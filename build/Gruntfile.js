module.exports = function(grunt) {
	require('google-closure-compiler').grunt(grunt, ['-Xms2048m']);
    var defaultConfig, packageFile;
	var path = grunt.option('src') || './configs';
	var level = grunt.option('level') || 'ADVANCED';
	var formatting = grunt.option('formatting') || '';
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-split-file');
	
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

	grunt.registerTask('compile_sdk_init', function(compilation_level) {
		var splitLine = '';
		var tmp_sdk_path = 'sdk-js-tmp.js';
		var sdkDstFolder = packageFile['compile']['sdk']['dst'];
		var sdkAllMinDst = sdkDstFolder + '/sdk-all-min.js';
		var sdkAllDst = sdkDstFolder + '/sdk-all.js';
		var concat_src = [sdkAllDst];
		var srcFiles = packageFile['compile']['sdk']['common'];
		var sdkOpt = {
			compilation_level: compilation_level,
			warning_level: 'QUIET',
			externs: packageFile['compile']['sdk']['externs']
		};
		if (formatting) {
			sdkOpt['formatting'] = formatting;
		}
		if ('ADVANCED' === compilation_level) {
			splitLine = ('PRETTY_PRINT' === formatting) ? 'window.split = "split";' : 'window.split="split";';
		} else {
			splitLine = ('PRETTY_PRINT' === formatting) ? 'window["split"] = "split";' : 'window["split"]="split";';
		}
		
		if (grunt.option('mobile')) {				
			var excludeFiles = packageFile['compile']['sdk']['exclude_mobile']
			srcFiles = srcFiles.filter(function(item) {
				return -1 === excludeFiles.indexOf(item);
			});		
			var mobileFiles = packageFile['compile']['sdk']['mobile'];
			if(mobileFiles){
				srcFiles = srcFiles.concat(mobileFiles);
			}
		}
		
		if (!grunt.option('noprivate')) {
			srcFiles = srcFiles.concat(packageFile['compile']['sdk']['private']);
		}
		if (grunt.option('desktop')) {
			srcFiles = srcFiles.concat(packageFile['compile']['sdk']['desktop']);
		}
		if (grunt.option('builder')) {
			srcFiles = srcFiles.concat(packageFile['compile']['sdk']['builder']);
		}
		
		grunt.initConfig({
			pkg: packageFile,
			'closure-compiler': {
				sdk: {
					options: sdkOpt,
					dest: tmp_sdk_path,
					src: srcFiles
				}
					},
			splitfile: {
				sdk: {
					options: {
					  separator: splitLine,
					  prefix: [ "sdk-all-min", "sdk-all" ]
					},
					dest: sdkDstFolder,
					src: tmp_sdk_path
				}
			},
			concat: {
				sdkmin: {
					src: ['license.js', sdkAllMinDst],
					dest: sdkAllMinDst
				},
				sdk: {
				options: {
						banner: '<%= grunt.file.read("license.js") %>' + '\n(function(window, undefined) {',
					footer: '})(window);'
					},
					src: concat_src,
					dest: sdkAllDst
					}
			},
			clean: [ 
				tmp_sdk_path
			],
			replace: {
				version: {
					options: {
						variables: {
							Version: process.env['PRODUCT_VERSION'],
							Build: process.env['BUILD_NUMBER']
						}
					},
					files: {
						'<%= pkg.compile.sdk.dst %>': '<%= pkg.compile.sdk.dst %>'
					}
				}
			}
		});
	});
	
	grunt.registerTask('compile_sdk', ['compile_sdk_init:' + level, 'closure-compiler', 'splitfile', 'concat', 'replace', 'clean']);
	grunt.registerTask('default', ['build_webpowerpoint']);
};