/**
 *    app.js
 *
 *    Created by Maxim Kadushkin on 21 March 2014
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
        //sdk             : '../sdk/Excel/sdk-all',
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
	'underscore'
], function (Backbone, Bootstrap, Core) {
    Backbone.history.start();

    /**
     * Application instance with SSE namespace defined
     */
    var app = new Backbone.Application({
        nameSpace: 'SSE',
        autoCreate: false,
        controllers : [
            'Viewport',
            'DocumentHolder',
            'CellEditor',
            'FormulaDialog',
            'Print',
            'Toolbar',
            'Statusbar',
            'RightMenu',
            'LeftMenu',
            'Main',
            'Common.Controllers.Fonts',
            'Common.Controllers.Chat',
            'Common.Controllers.Comments'
        ]
    });

    Common.Locale.apply();

    require([
        'spreadsheeteditor/main/app/controller/Viewport',
        'spreadsheeteditor/main/app/controller/DocumentHolder',
        'spreadsheeteditor/main/app/controller/CellEditor',
        'spreadsheeteditor/main/app/controller/Toolbar',
        'spreadsheeteditor/main/app/controller/Statusbar',
        'spreadsheeteditor/main/app/controller/RightMenu',
        'spreadsheeteditor/main/app/controller/LeftMenu',
        'spreadsheeteditor/main/app/controller/Main',
        'spreadsheeteditor/main/app/controller/Print',
        'spreadsheeteditor/main/app/view/ParagraphSettings',
        'spreadsheeteditor/main/app/view/ImageSettings',
        'spreadsheeteditor/main/app/view/ChartSettings',
        'spreadsheeteditor/main/app/view/ShapeSettings',
        'spreadsheeteditor/main/app/view/TextArtSettings',
        'common/main/lib/util/utils',
        'common/main/lib/util/LocalStorage',
        'common/main/lib/controller/Fonts',
        'common/main/lib/controller/Comments',
        'common/main/lib/controller/Chat'
    ], function() {
        app.start();
    });
});