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
    waitSeconds: 30,
    paths: {
			jquery          : '../vendor/jquery/jquery',
			underscore      : '../vendor/underscore/underscore',
			backbone        : '../vendor/backbone/backbone',
			bootstrap       : '../vendor/bootstrap/dist/js/bootstrap',
			text            : '../vendor/requirejs-text/text',
			perfectscrollbar: '../vendor/perfect-scrollbar/src/perfect-scrollbar',
			jmousewheel     : '../vendor/perfect-scrollbar/src/jquery.mousewheel',
			xregexp         : '../vendor/xregexp/xregexp-all-min',
			sockjs          : '../vendor/sockjs/sockjs.min',
			api             : 'api/documents/api',
			core            : 'common/main/lib/core/application',
			notification    : 'common/main/lib/core/NotificationCenter',
			keymaster       : 'common/main/lib/core/keymaster',
			tip             : 'common/main/lib/util/Tip',
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
	'api',
	'analytics',
	'gateway',
	'locale'
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
            'Common.Controllers.Fonts'
            /** coauthoring begin **/
            ,'Common.Controllers.Chat'
            ,'Common.Controllers.Comments'
            /** coauthoring end **/
            /** proprietary begin **/
            ,'Common.Controllers.ExternalDiagramEditor'
            /** proprietary end **/
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
        'common/main/lib/util/utils',
        'common/main/lib/controller/Fonts'
        /** coauthoring begin **/
        ,'common/main/lib/controller/Comments'
        ,'common/main/lib/controller/Chat'
        /** coauthoring end **/
        /** proprietary begin **/
        ,'documenteditor/main/app/view/ChartSettings'
        ,'common/main/lib/controller/ExternalDiagramEditor'
        /** proprietary end **/
    ], function() {
        app.start();
    });

});