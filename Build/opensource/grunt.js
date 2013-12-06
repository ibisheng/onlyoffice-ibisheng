module.exports = function(grunt) {
    var defaultConfig, packageFile;

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function(){
        defaultConfig = './webword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebWord config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webexcel_init', 'Initialize build WebExcel SDK.', function(){
        defaultConfig = './webexcel.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebExcel config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webpowerpoint_init', 'Initialize build WebPowerPoint SDK.', function(){
        defaultConfig = './webpowerpoint.json';
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
    
    grunt.registerTask('build_webword',     'build_webword_init build_sdk');
    grunt.registerTask('build_webexcel',  'build_webexcel_init build_sdk');
    grunt.registerTask('build_webpowerpoint', 'build_webpowerpoint_init build_sdk');
    grunt.registerTask('build_all', 'build_webword_init build_sdk build_webexcel_init build_sdk build_webpowerpoint_init build_sdk');

    grunt.registerTask('compile_sdk_init', function() {
        grunt.initConfig({
            pkg: '<json:' + defaultConfig + '>',
            meta: {
                banner: '/*\n' +
                    ' * Copyright (c) Ascensio System SIA <%= grunt.template.today("yyyy") %>. All rights reserved\n' +
                    ' *\n' +
                    ' * <%= pkg.homepage %> \n' +
                    ' *\n' +
                    ' * Version: <%= pkg.version %> (build:<%= pkg.build %>)\n' +
                    ' */'
            },

            min: {
                sdk: {
                    src: ['<banner:meta.banner>'].concat(packageFile['compile']["sdk"]['src']),
                    dest: packageFile['compile']["sdk"]['dst']
                }
            }
        });
    });
    grunt.registerTask('compile_sdk', 'compile_sdk_init min');

    grunt.registerTask('default', 'build_all');
};