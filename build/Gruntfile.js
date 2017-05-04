/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

module.exports = function(grunt) {
	var defaultConfig, packageFile;
	var path = grunt.option('src') || './configs';
	var level = grunt.option('level') || 'ADVANCED';
	var formatting = grunt.option('formatting') || '';

	require('google-closure-compiler').grunt(grunt, ['ADVANCED' === level ? '-Xms2048m' : '-Xms1024m']);

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
	
	grunt.registerTask('build_word',     ['build_webword_init', 'build_sdk']);
	grunt.registerTask('build_cell',  ['build_webexcel_init', 'build_sdk']);
	grunt.registerTask('build_slide', ['build_webpowerpoint_init', 'build_sdk']);

	grunt.registerTask('build_all', ['build_word', 'build_cell', 'build_slide']);
	
	grunt.registerTask('concat_sdk_init', function() {
		var sdkDstFolder = packageFile['compile']['sdk']['dst'];
		var sdkTmp = sdkDstFolder + '/sdk-tmp.js';
		var sdkAllTmp = sdkDstFolder + '/sdk-all-tmp.js';
		var sdkAllMinTmp = sdkDstFolder + '/sdk-all-min-tmp.js';
		var srcFilesMin = packageFile['compile']['sdk']['min'];
		var srcFilesAll = packageFile['compile']['sdk']['common'];
		var sdkOpt = {};
		
		if (!grunt.option('noclosure')) {
			sdkOpt = {
				banner: '(function(window, undefined) {',
				footer: '})(window);'
			};
		}
		
		if (grunt.option('mobile')) {
			srcFilesMin = packageFile['compile']['sdk']['mobile_banners']['min'].concat(srcFilesMin);
			srcFilesAll = packageFile['compile']['sdk']['mobile_banners']['common'].concat(srcFilesAll);
			
			var excludeFiles = packageFile['compile']['sdk']['exclude_mobile'];
			srcFilesAll = srcFilesAll.filter(function(item) {
				return -1 === excludeFiles.indexOf(item);
			});
			var mobileFiles = packageFile['compile']['sdk']['mobile'];
			if(mobileFiles){
				srcFilesAll = srcFilesAll.concat(mobileFiles);
			}
		}
		
		if (!grunt.option('noprivate')) {
			srcFilesAll = srcFilesAll.concat(packageFile['compile']['sdk']['private']);
		}
		if (grunt.option('desktop')) {
			srcFilesMin = srcFilesMin.concat(packageFile['compile']['sdk']['desktop']['min']);
			srcFilesAll = srcFilesAll.concat(packageFile['compile']['sdk']['desktop']['common']);
		}
		
		grunt.initConfig({
			concat: {
				sdkmin: {
					options: {
//						banner: '(function(window, undefined) {',
//						footer: '})(window);window["split"]="split";'
						banner: '',
						footer: 'window["split"]="split";'
					},
					src: srcFilesMin,
					dest: sdkAllMinTmp
				},
				sdk: {
					options: sdkOpt,
					src: srcFilesAll,
					dest: sdkAllTmp
				},
				all: {
					src: [sdkAllMinTmp, sdkAllTmp],
					dest: sdkTmp
				}
			},
			clean: {
				tmp: {
					options: {
						force: true
					},
					src: [
						sdkAllMinTmp,
						sdkAllTmp
					]
				}
			}
		});
	});
	
	grunt.registerTask('compile_sdk_init', function() {
		var splitLine = '';
		var sdkDstFolder = packageFile['compile']['sdk']['dst'];
		var sdkTmp = sdkDstFolder + '/sdk-tmp.js';
		var tmp_sdk_path = sdkDstFolder + '/sdk-js-tmp.js';
		var sdkAllMinDst = sdkDstFolder + '/sdk-all-min.js';
		var sdkAllDst = sdkDstFolder + '/sdk-all.js';
		var sdkAllCache = sdkDstFolder + '/*.cache'
		var sdkOpt = {
			jscomp_off: 'checkVars',
			compilation_level: level,
			warning_level: 'QUIET',
			externs: packageFile['compile']['sdk']['externs']
		};
		if (formatting) {
			sdkOpt['formatting'] = formatting;
		}
		if ('ADVANCED' === level) {
			splitLine = ('PRETTY_PRINT' === formatting) ? 'window.split = "split";' : 'window.split="split";';
		} else {
			splitLine = ('PRETTY_PRINT' === formatting) ? 'window["split"] = "split";' : 'window["split"]="split";';
		}
		
		grunt.initConfig({
			'closure-compiler': {
				sdk: {
					options: sdkOpt,
					dest: tmp_sdk_path,
					src: [sdkTmp]
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
					src: ['license.js', sdkAllDst],
					dest: sdkAllDst
				}
			},
			clean: {
				tmp: {
					options: {
						force: true
					},
					src: [
						sdkTmp,
						tmp_sdk_path,
						sdkAllCache
					]
				}
			},
			replace: {
				version: {
					options: {
						patterns: [
							{
								json: {
									Version: process.env['PRODUCT_VERSION'] || '0.0.0',
									Build: process.env['BUILD_NUMBER'] || '0'
								}
							}
						]
					},
					files: [
						{ src: [sdkAllMinDst, sdkAllDst], dest: sdkDstFolder + '/' }
					]
				}
			}
		});
	});
	
	grunt.registerTask('concat_sdk', ['concat_sdk_init', 'concat', 'clean']);
	grunt.registerTask('build_sdk', ['concat_sdk', 'compile_sdk_init', 'closure-compiler', 'splitfile', 'concat', 'replace', 'clean']);
	grunt.registerTask('default', ['build_all']);
};
