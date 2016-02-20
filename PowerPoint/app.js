/**
 *    app.js
 *
 *    Created by Julia Radzhabova on 26 March 2014
 *    Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

'use strict';

require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    baseUrl: '../../',
    paths: {
        jquery          : '../vendor/jquery/jquery',
        underscore      : '../vendor/underscore/underscore',
        backbone        : '../vendor/backbone/backbone',
        bootstrap       : '../vendor/bootstrap/dist/js/bootstrap',
        text            : '../vendor/requirejs-text/text',
        perfectscrollbar: 'common/main/lib/mods/perfect-scrollbar',
        jmousewheel     : '../vendor/perfect-scrollbar/src/jquery.mousewheel',
        xregexp         : '../vendor/xregexp/xregexp-all-min',
        sockjs          : '../vendor/sockjs/sockjs.min',
        jsziputils      : '../vendor/jszip-utils/jszip-utils.min',
        jsrsasign       : '../vendor/jsrsasign/jsrsasign-latest-all-min',
        //allfonts        : '../sdk/Common/AllFonts',
        //sdk             : '../sdk/PowerPoint/sdk-all',
        api             : 'api/documents/api',
        core            : 'common/main/lib/core/application',
        notification    : 'common/main/lib/core/NotificationCenter',
        keymaster       : 'common/main/lib/core/keymaster',
        tip             : 'common/main/lib/util/Tip',
        localstorage    : 'common/main/lib/util/LocalStorage',
        analytics       : 'common/Analytics',
        gateway         : 'common/Gateway',
        locale          : 'common/locale',
        irregularstack  : 'common/IrregularStack'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: [
                'jquery'
            ]
        },
        perfectscrollbar: {
            deps: [
                'jmousewheel'
            ]
        },
        notification: {
            deps: [
                'backbone'
            ]
        },
        core: {
            deps: [
                'backbone',
                'notification',
                'irregularstack'
            ]
        },
        sdk: {
            deps: [
                'jquery',
                'underscore',
                'allfonts',
                'xregexp',
                'sockjs',
                'jsziputils',
                'jsrsasign'
            ]
        },
        gateway: {
            deps: [
                'jquery'
            ]
        },
        analytics: {
            deps: [
                'jquery'
            ]
        }
    }
});

require([
    'backbone',
    'bootstrap',
    'core',
    //'sdk',
    'api',
    'analytics',
    'gateway',
    'locale',
    'jsziputils',
    'jsrsasign',
    //'allfonts',
    'sockjs',
    'xregexp',
    'underscore'
], function (Backbone, Bootstrap, Core) {
    Backbone.history.start();

    /**
     * Application instance with PE namespace defined
     */
    var app = new Backbone.Application({
        nameSpace: 'PE',
        autoCreate: false,
        controllers : [
            'Viewport',
            'DocumentHolder',
            'Toolbar',
            'Statusbar',
            'RightMenu',
            'LeftMenu',
            'Main',
            'Common.Controllers.Fonts'
            /** coauthoring begin **/
            , 'Common.Controllers.Chat',
            'Common.Controllers.Comments',
            /** coauthoring end **/
            /** proprietary begin **/
            'Common.Controllers.ExternalDiagramEditor'
            /** proprietary end **/
        ]
    });

    Common.Locale.apply();

    require([
        'presentationeditor/main/app/controller/Viewport',
        'presentationeditor/main/app/controller/DocumentHolder',
        'presentationeditor/main/app/controller/Toolbar',
        'presentationeditor/main/app/controller/Statusbar',
        'presentationeditor/main/app/controller/RightMenu',
        'presentationeditor/main/app/controller/LeftMenu',
        'presentationeditor/main/app/controller/Main',
        'presentationeditor/main/app/view/ParagraphSettings',
        'presentationeditor/main/app/view/ImageSettings',
        'presentationeditor/main/app/view/ShapeSettings',
        'presentationeditor/main/app/view/SlideSettings',
        'presentationeditor/main/app/view/TableSettings',
        'presentationeditor/main/app/view/TextArtSettings',
        'common/main/lib/util/utils',
        'common/main/lib/util/LocalStorage',
        'common/main/lib/controller/Fonts'
        /** coauthoring begin **/
        ,'common/main/lib/controller/Comments',
        'common/main/lib/controller/Chat',
        /** coauthoring end **/
        /** proprietary begin **/
        'presentationeditor/main/app/view/ChartSettings',
        'common/main/lib/controller/ExternalDiagramEditor'
        /** proprietary end **/
    ], function() {
        app.start();
    });
});