module.exports = function(grunt) {
	require('google-closure-compiler').grunt(grunt);
    var revision="unknown", defaultConfig, packageFile;
	var path = grunt.option('src') || './sdk_configs';
	var level = grunt.option('level') || 'ADVANCED';
	var formatting = grunt.option('formatting') || '';
	var nomap = grunt.option('nomap') || '';
	
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
	
	grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function(){
        defaultConfig = path + '/webword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebWord config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

	grunt.registerTask('build_nativeword_init', 'Initialize build NativeWord SDK.', function(){
        defaultConfig = path + '/nativeword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('nativeword config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
	
    grunt.registerTask('build_webexcel_init', 'Initialize build WebExcel SDK.', function(){
        defaultConfig = path + '/webexcel.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebExcel config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webpowerpoint_init', 'Initialize build WebPowerPoint SDK.', function(){
        defaultConfig = path + '/webpowerpoint.json';
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
	
	grunt.registerTask('build_webword',     ['build_webword_init', 'build_sdk']);
	grunt.registerTask('build_nativeword', ['build_nativeword_init', 'build_sdk']);
    grunt.registerTask('build_webexcel',  ['build_webexcel_init', 'build_sdk']);
    grunt.registerTask('build_webpowerpoint', ['build_webpowerpoint_init', 'build_sdk']);
		
	grunt.registerTask('build_all', ['build_webword_init', 'build_sdk', 'build_webexcel_init', 'build_sdk', 'build_webpowerpoint_init', 'build_sdk']);

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
		var srcFiles = packageFile['compile']['sdk']['common'];
		var sdkOpt = {
			compilation_level: compilation_level,
			warning_level: 'QUIET',
			externs: packageFile['compile']['sdk']['externs']/*,
			create_source_map: map_file_path,
			source_map_format: "V3"*/
		};
		var definesOpt = {
			compilation_level: 'ADVANCED' === compilation_level ? 'SIMPLE' : compilation_level,
			warning_level: 'QUIET'
		};
		if (formatting) {
			console.log('formatting');
			definesOpt['formatting'] = sdkOpt['formatting'] = formatting;
		}
		if (!nomap) {
			sdkOpt['variable_renaming_report'] = packageFile['compile']['sdk']['log'] + '/variable.map';
			sdkOpt['property_renaming_report'] = packageFile['compile']['sdk']['log'] + '/property.map';
		}
		
		if (grunt.option('desktop')) {
			console.log('desktop');
			srcFiles.concat(packageFile['compile']['sdk']['desktop']);
		}
		
		var cc = require('google-closure-compiler').compiler;
		cc.prototype.spawnOptions = {env: {'JAVA_OPTS': '-Xms2048m'}};

		grunt.initConfig({
			pkg: packageFile,
			'closure-compiler': {
				sdk: {
					files: {
						'<%= pkg.compile.sdk.dst %>': srcFiles
					},
					options: sdkOpt
					},
				defines: {
					files: {
						'<%= pkg.compile.defines.dst %>': packageFile['compile']['defines']['src']
					},
					options: definesOpt
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
	
	grunt.registerTask('compile_sdk', ['compile_sdk_init:' + level, 'closure-compiler', 'concat', 'replace', 'clean']);
	grunt.registerTask('compile_sdk_native', ['compile_sdk_init:' + level, 'closure-compiler:sdk', 'concat', 'replace', 'clean']);
		
	grunt.registerTask('default', ['get_svn_info', 'build_all']);
};