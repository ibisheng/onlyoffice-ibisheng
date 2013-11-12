(	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function (window, undefined) {
		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
		var prot;
		
		/**
		 * Класс asc_CAscEditorPermissions для прав редакторов
		 * -----------------------------------------------------------------------------
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function asc_CAscEditorPermissions (settings) {
			if ( !(this instanceof asc_CAscEditorPermissions) ) {
				return new asc_CAscEditorPermissions();
			}
			if(settings) {
				this.canEdit = settings["canEdit"];
				this.canDownload = settings["canDownload"];
				this.canCoAuthoring = settings["canCoAuthoring"];
				this.canReaderMode = settings["canReaderMode"];
				this.canBranding = settings["canBranding"];
				this.isAutosaveEnable = settings["isAutosaveEnable"];
				this.AutosaveMinInterval = settings["AutosaveMinInterval"];
			}
			else {
				this.canEdit = true;
				this.canDownload = true;
				this.canCoAuthoring = true;
				this.canReaderMode = true;
				this.canBranding = true;
				this.isAutosaveEnable = true;
				this.AutosaveMinInterval = 300;
			}
			return this;
		}

			asc_CAscEditorPermissions.prototype = {
			constructor: asc_CAscEditorPermissions,
			asc_getCanEdit: function(){ return this.canEdit; },
			asc_getCanDownload: function(){ return this.canDownload; },
			asc_getCanCoAuthoring: function(){ return this.canCoAuthoring; },
			asc_getCanReaderMode: function(){ return this.canReaderMode; },
			asc_getCanBranding: function(v){ return this.canBranding; },
			asc_getIsAutosaveEnable: function(){ return this.isAutosaveEnable; },
			asc_getAutosaveMinInterval: function(){ return this.AutosaveMinInterval; },

			asc_setCanEdit: function(v){ this.canEdit = v; },
			asc_setCanDownload: function(v){ this.canDownload = v; },
			asc_setCanCoAuthoring: function(v){ this.canCoAuthoring = v; },
			asc_setCanReaderMode: function(v){ this.canReaderMode = v; },
			asc_setCanBranding: function(v){ this.canBranding = v; },
			asc_setIsAutosaveEnable: function(v){ this.isAutosaveEnable = v; },
			asc_setAutosaveMinInterval: function(v){ this.AutosaveMinInterval = v; }
		};
		
		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"]["asc_CAscEditorPermissions"] = 
		window["Asc"].asc_CAscEditorPermissions = asc_CAscEditorPermissions;
		
		prot = asc_CAscEditorPermissions.prototype;
		prot["asc_getCanEdit"]				= prot.asc_getCanEdit;
		prot["asc_getCanDownload"]			= prot.asc_getCanDownload;
		prot["asc_getCanCoAuthoring"]		= prot.asc_getCanCoAuthoring;
		prot["asc_getCanReaderMode"]		= prot.asc_getCanReaderMode;
		prot["asc_getCanBranding"]			= prot.asc_getCanBranding;
		prot["asc_getIsAutosaveEnable"]		= prot.asc_getIsAutosaveEnable;
		prot["asc_getAutosaveMinInterval"]	= prot.asc_getAutosaveMinInterval;
	}
)(window);