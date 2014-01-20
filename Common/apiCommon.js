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
			} else {
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

		/**
		 * Класс asc_CAscLicense для лицензии
		 * -----------------------------------------------------------------------------
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function asc_CAscLicense (settings) {
			if ( !(this instanceof asc_CAscLicense) ) {
				return new asc_CAscLicense();
			}
			if(settings) {
				this.customer = settings["customer"];
				this.customerAddr = settings["customer_addr"];
				this.customerWww = settings["customer_www"];
				this.customerMail = settings["customer_mail"];
				this.customerInfo = settings["customer_info"];
				this.customerLogo = settings["customer_logo"];
			} else {
				this.customer = null;
				this.customerAddr = null;
				this.customerWww = null;
				this.customerMail = null;
				this.customerInfo = null;
				this.customerLogo = null;
			}
			return this;
		}

		asc_CAscLicense.prototype.asc_getCustomer = function () {return this.customer;};
		asc_CAscLicense.prototype.asc_getCustomerAddr = function () {return this.customerAddr;};
		asc_CAscLicense.prototype.asc_getCustomerWww = function () {return this.customerWww;};
		asc_CAscLicense.prototype.asc_getCustomerMail = function () {return this.customerMail;};
		asc_CAscLicense.prototype.asc_getCustomerInfo = function () {return this.customerInfo;};
		asc_CAscLicense.prototype.asc_getCustomerLogo = function () {return this.customerLogo;};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"]["asc_CAscLicense"] = window["Asc"].asc_CAscLicense = asc_CAscLicense;

		prot = asc_CAscLicense.prototype;
		prot["asc_getCustomer"]				= prot.asc_getCustomer;
		prot["asc_getCustomerAddr"]			= prot.asc_getCustomerAddr;
		prot["asc_getCustomerWww"]			= prot.asc_getCustomerWww;
		prot["asc_getCustomerMail"]			= prot.asc_getCustomerMail;
		prot["asc_getCustomerInfo"]			= prot.asc_getCustomerInfo;
		prot["asc_getCustomerLogo"]			= prot.asc_getCustomerLogo;

		/**
		 * Класс CColor для работы с цветами
		 * -----------------------------------------------------------------------------
		 *
		 * @constructor
		 * @memberOf window
		 */
		 
		function CColor (r,g,b,a){
			this.r = (undefined == r) ? 0 : r;
			this.g = (undefined == g) ? 0 : g;
			this.b = (undefined == b) ? 0 : b;
			this.a = (undefined == a) ? 1 : a;
		}
		
		CColor.prototype = {
			constructor: CColor,
			getR: function(){return this.r},
			get_r: function(){return this.r},
			put_r: function(v){this.r = v; this.hex = undefined;},
			getG: function(){return this.g},
			get_g: function(){return this.g;},
			put_g: function(v){this.g = v; this.hex = undefined;},
			getB: function(){return this.b},
			get_b: function(){return this.b;},
			put_b: function(v){this.b = v; this.hex = undefined;},
			getA: function(){return this.a},
			get_hex: function()
			{
				if(!this.hex)
				{
					var r = this.r.toString(16);
					var g = this.g.toString(16);
					var b = this.b.toString(16);
					this.hex = ( r.length == 1? "0" + r: r) +
						( g.length == 1? "0" + g: g) +
						( b.length == 1? "0" + b: b);
				}
				return this.hex;
			}
		};
		
		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["CColor"] = window.CColor = CColor;
		
		prot = CColor.prototype;
		prot["getR"]	= prot.getR;
		prot["get_r"]	= prot.get_r;
		prot["put_r"]	= prot.put_r;
		prot["getG"]	= prot.getG;
		prot["get_g"]	= prot.get_g;
		prot["put_g"]	= prot.put_g;
		prot["getB"]	= prot.getB;
		prot["get_b"]	= prot.get_b;
		prot["put_b"]	= prot.put_b;
		prot["getA"]	= prot.getA;
		prot["get_hex"]	= prot.get_hex;
	}
)(window);

var CColor = window["CColor"];