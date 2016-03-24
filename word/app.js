/**
 *  app.js
 *
 *  Created by Alexander Yuzhin on 12/27/13
 *  Copyright (c) 2013 Ascensio System SIA. All rights reserved.
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
        jszip           : '../vendor/jszip/jszip.min',
        jsziputils      : '../vendor/jszip-utils/jszip-utils.min',
        jsrsasign       : '../vendor/jsrsasign/jsrsasign-latest-all-min',
        //allfonts        : '../sdk/Common/AllFonts',
        //sdk             : '../sdk/Word/sdk-all',
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
//    urlArgs: "_dc=" +  (new Date()).getTime(), // debug only, be sure to remove it before deploying your code.
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
                'jszip',
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
    'jszip',
    'jsziputils',
    'jsrsasign',
    //'allfonts',
	'sockjs',
	'underscore'
], function (Backbone, Bootstrap, Core) {
    Backbone.history.start();

    /**
     * Application instance with DE namespace defined
     */
    var app = new Backbone.Application({
        nameSpace: 'DE',
        autoCreate: false,
        controllers : [
            'Viewport',
            'DocumentHolder',
            'Toolbar',
            'Statusbar',
            'RightMenu',
            'LeftMenu',
            'Main',
            'Common.Controllers.Fonts',
            'Common.Controllers.History'
            /** coauthoring begin **/
            ,'Common.Controllers.Chat'
            ,'Common.Controllers.Comments'
            /** coauthoring end **/
            /** proprietary begin **/
            ,'Common.Controllers.ExternalDiagramEditor'
            /** proprietary end **/
            ,'Common.Controllers.ExternalMergeEditor'
            ,'Common.Controllers.ReviewChanges'
        ]
    });

    Common.Locale.apply();

    require([
        'documenteditor/main/app/controller/Viewport',
        'documenteditor/main/app/controller/DocumentHolder',
        'documenteditor/main/app/controller/Toolbar',
        'documenteditor/main/app/controller/Statusbar',
        'documenteditor/main/app/controller/RightMenu',
        'documenteditor/main/app/controller/LeftMenu',
        'documenteditor/main/app/controller/Main',
        'documenteditor/main/app/view/ParagraphSettings',
        'documenteditor/main/app/view/HeaderFooterSettings',
        'documenteditor/main/app/view/ImageSettings',
        'documenteditor/main/app/view/TableSettings',
        'documenteditor/main/app/view/ShapeSettings',
        'documenteditor/main/app/view/TextArtSettings',
        'common/main/lib/util/utils',
        'common/main/lib/util/LocalStorage',
        'common/main/lib/controller/Fonts',
        'common/main/lib/controller/History'
        /** coauthoring begin **/
        ,'common/main/lib/controller/Comments'
        ,'common/main/lib/controller/Chat'
        /** coauthoring end **/
        /** proprietary begin **/
        ,'documenteditor/main/app/view/ChartSettings'
        ,'common/main/lib/controller/ExternalDiagramEditor'
        /** proprietary end **/
        ,'common/main/lib/controller/ExternalMergeEditor'
        ,'common/main/lib/controller/ReviewChanges'
    ], function() {
        app.start();
    });

});