module.exports = function(grunt) {
	require('google-closure-compiler').grunt(grunt);
    var revision="unknown", defaultConfig, packageFile, toolsConfig, toolsFile;
	
	var path = require('path');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-replace');
	
	grunt.registerTask('get_svn_info', 'Initialize svn information', function () {
		// Instruct this task to wait until we call the done() method to continue
		var done = this.async();
		
		grunt.util.spawn({
			cmd: 'svnversion',
			args: ['../../'],
			}, function (error, result, code) {
				if (null === error) {
					revision = result;
				}
				
				// All done, continue to the next tasks
				done();
		});
	});
	
	grunt.registerTask('setup_tools', 'Initialize tools.', function(){
        toolsConfig = 'tools.json';
        toolsFile = require('./' + toolsConfig);

        if (toolsFile)
            grunt.log.ok('Tools config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
	
	grunt.registerTask('cleanup_deploy_folder_init', 'Initialize tools.', function(){
		grunt.initConfig({
			clean: {
				options: {
					force: true
				},
				menu:[
					toolsFile['menu_path']
				]
			}
		});
    });	
	
	grunt.registerTask('cleanup_deploy_folder',  ['cleanup_deploy_folder_init', 'clean']);
	
	grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function(){
        defaultConfig = './sdk_configs/webword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebWord config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

	grunt.registerTask('build_nativeword_init', 'Initialize build NativeWord SDK.', function(){
        defaultConfig = './sdk_configs/nativeword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('nativeword config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
	
    grunt.registerTask('build_webexcel_init', 'Initialize build WebExcel SDK.', function(){
        defaultConfig = './sdk_configs/webexcel.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebExcel config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webpowerpoint_init', 'Initialize build WebPowerPoint SDK.', function(){
        defaultConfig = './sdk_configs/webpowerpoint.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebPowerPoint config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
	
	grunt.registerTask('build_sdk', 'Build sdk.', function(){
        if (packageFile) {
            if (packageFile['tasks']['build'])
                grunt.task.run(packageFile['tasks']['build']);
            else
                grunt.log.error().writeln('Not found "build" task in configure'.red);
        } else {
            grunt.log.error().writeln('Is not load configure file.'.red);
        }
    });
	
	grunt.registerTask('build_webword',     ['setup_tools', 'build_webword_init', 'build_sdk']);
	grunt.registerTask('build_nativeword', ['setup_tools', 'build_nativeword_init', 'build_sdk']);
    grunt.registerTask('build_webexcel',  ['setup_tools', 'build_webexcel_init', 'build_sdk']);
    grunt.registerTask('build_webpowerpoint', ['setup_tools', 'build_webpowerpoint_init', 'build_sdk']);
	
	grunt.registerTask('deploy_sdk_all', ['setup_tools', 'build_webword_init', 'deploy_sdk', 'build_webexcel_init', 'deploy_sdk', 'build_webpowerpoint_init', 'deploy_sdk']);
	
	grunt.registerTask('build_all_without_deploy', ['setup_tools', 'build_webword_init', 'build_sdk', 'build_webexcel_init', 'build_sdk', 'build_webpowerpoint_init', 'build_sdk']);
	grunt.registerTask('build_all', ['build_all_without_deploy', 'deploy_sdk_all']);
	grunt.registerTask('cleanup_and_build_all', ['setup_tools', 'cleanup_deploy_folder', 'build_all']);

	grunt.registerTask('up_sdk_src_init', 'Update SDK source', function() {
		grunt.initConfig({
			exec: {
				update_sources: {
					command: 'svn.exe up -q --non-interactive -r ' + packageFile['update_src']['revision'] + ' ' + packageFile['update_src']['src'],
					stdout: true
				},				
				update_logs: {
					command: 'svn.exe up -q --non-interactive -r HEAD ' + packageFile['compile']['sdk']['log'],
					stdout: true
				}
			}
		});
    });
	
	grunt.registerTask('update_sources_webword', ['build_webword_init', 'up_sdk_src_init', 'exec']);
	grunt.registerTask('update_sources_webexcel', ['build_webexcel_init', 'up_sdk_src_init', 'exec']);
	grunt.registerTask('update_sources_webpowerpoint', ['build_webpowerpoint_init', 'up_sdk_src_init', 'exec']);

	grunt.registerTask('update_sources', ['update_sources_webword', 'update_sources_webexcel', 'update_sources_webpowerpoint']);

	grunt.registerTask('commit_logs_init', function() {
		var build_num = packageFile['info']['build'];
		var svn_rev = packageFile['update_src']['revision'];
		
		if(undefined !== process.env['BUILD_NUMBER'])
			build_num = parseInt(process.env['BUILD_NUMBER']);
			
		if(undefined !== process.env['SVN_REVISION'])
			svn_rev = parseInt(process.env['SVN_REVISION']);
			
		var commit_message ='\"Version: '+ packageFile['info']['version'] + 
							' (build:' + build_num + ')' +
							' from svn rev: ' + svn_rev + '\"';
        grunt.initConfig({
			exec: {
				store_log: {
					command: 'svn.exe commit ' + packageFile['deploy']['store_log']['dst'] + ' -q -m ' + commit_message,
					stdout: false
				}
			}
        });
    });	
	
	grunt.registerTask('commit_logs_webword', ['build_webword_init', 'commit_logs_init', 'exec']);
	grunt.registerTask('commit_logs_webexcel', ['build_webexcel_init', 'commit_logs_init', 'exec']);
	grunt.registerTask('commit_logs_webpowerpoint', ['build_webpowerpoint_init', 'commit_logs_init', 'exec']);
	
	grunt.registerTask('commit_logs', ['commit_logs_webword', 'commit_logs_webexcel', 'commit_logs_webpowerpoint']);
	
    grunt.registerTask('increment_build', function() {
		var pkg = grunt.file.readJSON(defaultConfig);
		pkg.info.build = parseInt(pkg.info.build) + 1;

		if(undefined !== process.env['BUILD_NUMBER']) {
			grunt.log.ok('Use Jenkins build number as sdk-all build number!'.yellow);
			packageFile['info']['build'] = parseInt(process.env['BUILD_NUMBER']);
			pkg.info.build = packageFile['info']['build'];
		}
		if(undefined !== process.env['SVN_REVISION']){
			packageFile['info']['rev'] = process.env['SVN_REVISION'];
		}
		else{
			grunt.log.ok('Use revision number \"' + revision + '\" from svnversion!'.yellow);
			packageFile['info']['rev'] = revision;
		}
		grunt.file.write(defaultConfig, JSON.stringify(pkg, null, 4));
    });
	
	grunt.registerTask('create_map_file', function() {
		//Не нашел как передать параметры в таску, поэтому  продублировал код.	
		var map_file_path = packageFile['compile']['sdk']['dst'] + '.map';	
		var map_record = '//@ sourceMappingURL=' + packageFile['compile']['source_map']['url'] + '/' + map_file_path;

		var map_record_file_path = map_file_path + '.tmp';
		grunt.file.write(map_record_file_path, map_record);
	});
	
	grunt.registerTask('compile_sdk_init', function(compilation_level) {
		grunt.file.mkdir( packageFile['compile']['sdk']['log'] );
		var map_file_path = packageFile['compile']['sdk']['dst'] + '.map';
		var map_record_file_path = map_file_path + '.tmp';
		var concat_res = {};
		concat_res[packageFile['compile']['sdk']['dst']] = [
					packageFile['compile']['sdk']['dst'],
					packageFile['compile']['defines']['dst'],
					map_record_file_path ];
		grunt.initConfig({
			pkg: grunt.file.readJSON(defaultConfig),
			'closure-compiler': {
				build: {
					files: {
						'<%= pkg.compile.sdk.dst %>': packageFile['compile']['sdk']['src']
					},
				options: {
						compilation_level: compilation_level,
						warning_level: 'QUIET',
						externs: packageFile['compile']['sdk']['externs'],
						variable_renaming_report: packageFile['compile']['sdk']['log'] + '/variable.map',
						property_renaming_report: packageFile['compile']['sdk']['log'] + '/property.map'/*,
						create_source_map: map_file_path,
						source_map_format: "V3"*/
					},
				defines: {
						options: {
						compilation_level: 'SIMPLE',
						warning_level: 'QUIET'
				}
					}
				}
			},
			create_map_file: {},
			concat: concat_res,
			clean: [ 
				packageFile['compile']['defines']['dst'],
				map_record_file_path
			],
			replace: {
				version: {
					options: {
						variables: {
							Version: packageFile['info']['version'],
							Build: packageFile['info']['build'].toString(),
							Rev: packageFile['info']['rev'].toString()
						}
					},
					files: {
						'<%= pkg.compile.sdk.dst %>': '<%= pkg.compile.sdk.dst %>'
					}
				}
			}
		});
	});
	
	grunt.registerTask('compile_sdk', ['compile_sdk_init:ADVANCED', 'closure-compiler', 'concat', 'replace', 'clean']);
	grunt.registerTask('compile_sdk_fast', ['compile_sdk_init:WHITESPACE_ONLY', 'closure-compiler', 'concat', 'replace', 'clean']);
		
	grunt.registerTask('compile_sdk_native', ['compile_sdk_init:ADVANCED', 'closure-compiler:sdk', 'concat', 'replace', 'clean']);
	grunt.registerTask('compile_sdk_native_fast', ['compile_sdk_init:WHITESPACE_ONLY', 'closure-compiler:sdk', 'concat', 'replace', 'clean']);
	
	grunt.registerTask('deploy_sdk_init', function() {
        grunt.initConfig({
		    pkg: grunt.file.readJSON(toolsConfig),
            copy:  packageFile['deploy']['copy']
        });
    });
	
	grunt.registerTask('deploy_sdk', ['deploy_sdk_init', 'copy']);
	 
	grunt.registerTask('default', ['get_svn_info', 'build_all_without_deploy']);
};