"use strict";

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

        function asc_ChartSettings()
        {
            this.style         = null;
            this.title         = null;
            this.rowCols       = null;
            this.horAxisLabel  = null;
            this.vertAxisLabel = null;
            this.legendPos     = null;
            this.dataLabelsPos = null;
            this.vertAx        = null;
            this.horAx         = null;
            this.horGridLines  = null;
            this.vertGridLines = null;
            this.type = null;
            this.showSerName = null;
            this.showCatName = null;
            this.showVal    = null;
            this.separator = null;
            this.horAxisProps = null;
            this.vertAxisProps = null;
        }
        asc_ChartSettings.prototype =
        {
            putStyle: function(index)
            {
                this.style = index;
            },

            getStyle: function()
            {
                return this.style;
            },

            putTitle: function(v)
            {
                this.title = v;
            },

            getTitle: function()
            {
                return this.title;
            },

            putRowCols: function(v)
            {
                this.rowCols = v;
            },

            getRowCols: function()
            {
                return this.rowCols;
            },

            putHorAxisLabel: function(v)
            {
                this.horAxisLabel = v;
            },
            putVertAxisLabel: function(v)
            {
                this.vertAxisLabel = v;
            },
            putLegendPos: function(v)
            {
                this.legendPos = v;
            },
            putDataLabelsPos: function(v)
            {
                this.dataLabelsPos = v;
            },
            putCatAx: function(v)
            {
                this.vertAx = v;
            },
            putValAx: function(v)
            {
                this.horAx = v;
            },

            getHorAxisLabel: function(v)
            {
                return this.horAxisLabel;
            },
            getVertAxisLabel: function(v)
            {
                return this.vertAxisLabel;
            },
            getLegendPos: function(v)
            {
                return this.legendPos;
            },
            getDataLabelsPos: function(v)
            {
                return this.dataLabelsPos;
            },
            getVertAx: function(v)
            {
                return this.vertAx;
            },
            getHorAx: function(v)
            {
                return this.horAx;
            },

            putHorGridLines: function(v)
            {
                this.horGridLines = v;
            },

            getHorGridLines: function(v)
            {
                return this.horGridLines;
            },

            putVertGridLines: function(v)
            {
                this.vertGridLines = v;
            },

            getVertGridLines: function()
            {
                return this.vertGridLines;
            },

            getType: function()
            {
                return this.type;
            },

            putType: function(v)
            {
                return this.type = v;
            },

            putShowSerName: function(v)
            {
                return this.showSerName = v;
            },
            putShowCatName: function(v)
            {
                return this.showCatName = v;
            },
            putShowVal: function(v)
            {
                return this.showVal = v;
            },


            getShowSerName: function()
            {
                return this.showSerName;
            },
            getShowCatName: function()
            {
                return this.showCatName;
            },
            getShowVal: function()
            {
                return this.showVal;
            },

            putSeparator: function(v)
            {
                this.separator = v;
            },

            getSeparator: function()
            {
                return this.separator;
            },

            putHorAxisProps: function(v)
            {
                this.horAxisProps = v;
            },

            getHorAxisProps: function()
            {
                return this.horAxisProps;
            },


            putVertAxisProps: function(v)
            {
                this.vertAxisProps = v;
            },

            getVertAxisProps: function()
            {
                return this.vertAxisProps;
            }
        };

        prot = asc_ChartSettings.prototype;
        prot["putStyle"]         = prot.putStyle;
        prot["putTitle"]         = prot.putTitle;
        prot["putRowCols"]       = prot.putRowCols;
        prot["putHorAxisLabel"]  = prot.putHorAxisLabel;
        prot["putVertAxisLabel"] = prot.putVertAxisLabel;
        prot["putLegendPos"]     = prot.putLegendPos;
        prot["putDataLabelsPos"] = prot.putDataLabelsPos;
        prot["putCatAx"]         = prot.putCatAx;
        prot["putValAx"]         = prot.putValAx;
        prot["getStyle"]         = prot.getStyle;
        prot["getTitle"]         = prot.getTitle;
        prot["getRowCols"]       = prot.getRowCols;
        prot["getHorAxisLabel"]  = prot.getHorAxisLabel;
        prot["getVertAxisLabel"] = prot.getVertAxisLabel;
        prot["getLegendPos"]     = prot.getLegendPos;
        prot["getDataLabelsPos"] = prot.getDataLabelsPos;
        prot["getHorAx"]         = prot.getHorAx;
        prot["getVertAx"]        = prot.getVertAx;
        prot["getHorGridLines"]  = prot.getHorGridLines;
        prot["putHorGridLines"]  = prot.putHorGridLines;
        prot["getVertGridLines"] = prot.getVertGridLines;
        prot["putVertGridLines"] = prot.putVertGridLines;
        prot["getType"]          = prot.getType;
        prot["putType"]          = prot.putType;
        prot["putShowSerName"]   = prot.putShowSerName;
        prot["getShowSerName"]   = prot.getShowSerName;
        prot["putShowCatName"]   = prot.putShowCatName;
        prot["getShowCatName"]   = prot.getShowCatName;
        prot["putShowVal"]       = prot.putShowVal;
        prot["getShowVal"]       = prot.getShowVal;
        prot["putSeparator"]       = prot.putSeparator;
        prot["getSeparator"]       = prot.getSeparator;
        prot["putHorAxisProps"]       = prot.putHorAxisProps;
        prot["getHorAxisProps"]       = prot.getHorAxisProps;
        prot["putVertAxisProps"]       = prot.putVertAxisProps;
        prot["getVertAxisProps"]       = prot.getVertAxisProps;


        window["asc_ChartSettings"] = asc_ChartSettings;

        function asc_ValAxisSettings()
        {
            this.minValRule       = null;
            this.minVal            = null;
            this.maxValRule       = null;
            this.maxVal            = null;
            this.invertValOrder   = null;
            this.logScale          = null;
            this.logBase          = null;
            this.units               = null;
            this.showUnitsOnChart = null;
            this.majorTickMark      = null;
            this.minorTickMark      = null;
            this.tickLabelsPos      = null;
            this.crossesRule        = null;
            this.crosses            = null;
        }
        asc_ValAxisSettings.prototype =
        {
            putMinValRule: function(v)
            {
                this.minValRule = v;
            },
            putMinVal: function(v)
            {
                this.minVal = v;
            },
            putMaxValRule: function(v)
            {
                this.maxValRule = v;
            },
            putMaxVal: function(v)
            {
                this.maxVal = v;
            },
            putInvertValOrder: function(v)
            {
                this.invertValOrder =  v;
            },
            putLogScale: function(v)
            {
                this.logScale =  v;
            },
            putLogBase: function(v)
            {
                this.logBase =  v;
            },
            putUnits: function(v)
            {
                this.units = v;
            },
            putShowUnitsOnChart: function(v)
            {
                this.showUnitsOnChart =  v;
            },
            putMajorTickMark: function(v)
            {
                this.majorTickMark =  v;
            },
            putMinorTickMark: function(v)
            {
                this.minorTickMark =  v;
            },
            putTickLabelsPos: function(v)
            {
                this.tickLabelsPos =  v;
            },
            putCrossesRule: function(v)
            {
                this.crossesRule =  v;
            },
            putCrosses: function(v)
            {
                this.crosses =  v;
            },


            getMinValRule: function()
            {
                return this.minValRule;
            },
            getMinVal: function()
            {
                return this.minVal;
            },
            getMaxValRule: function()
            {
                return this.maxValRule;
            },
            getMaxVal: function()
            {
                return this.maxVal;
            },
            getInvertValOrder: function()
            {
                return this.invertValOrder;
            },
            getLogScale: function()
            {
                return this.logScale;
            },
            getLogBase: function()
            {
                return this.logBase;
            },
            getUnits: function()
            {
                return this.units;
            },
            getShowUnitsOnChart: function()
            {
                return this.showUnitsOnChart;
            },
            getMajorTickMark: function()
            {
                return this.majorTickMark;
            },
            getMinorTickMark: function()
            {
                return this.minorTickMark;
            },
            getTickLabelsPos: function()
            {
                return this.tickLabelPos;
            },
            getCrossesRule: function()
            {
                return this.crossesRule;
            },
            getCrosses: function()
            {
                return this.crosses;
            }
        };

        prot = asc_ValAxisSettings.prototype;
        prot["putMinValRule"]       = prot.putMinValRule       ;
        prot["putMinVal"]           = prot.putMinVal           ;
        prot["putMaxValRule"]       = prot.putMaxValRule       ;
        prot["putMaxVal"]           = prot.putMaxVal           ;
        prot["putInvertValOrder"]   = prot.putInvertValOrder   ;
        prot["putLogScale"]         = prot.putLogScale         ;
        prot["putLogBase"]          = prot.putLogBase          ;
        prot["putUnits"]            = prot.putUnits            ;
        prot["putShowUnitsOnChart"] = prot.putShowUnitsOnChart ;
        prot["putMajorTickMark"]    = prot.putMajorTickMark    ;
        prot["putMinorTickMark"]    = prot.putMinorTickMark    ;
        prot["putTickLabelsPos"]    = prot.putTickLabelsPos    ;
        prot["putCrossesRule"]      = prot.putCrossesRule      ;
        prot["putCrosses"]          = prot.putCrosses          ;

        prot["getMinValRule"]       = prot.getMinValRule       ;
        prot["getMinVal"]           = prot.getMinVal           ;
        prot["getMaxValRule"]       = prot.getMaxValRule       ;
        prot["getMaxVal"]           = prot.getMaxVal           ;
        prot["getInvertValOrder"]   = prot.getInvertValOrder   ;
        prot["getLogScale"]         = prot.getLogScale         ;
        prot["getLogBase"]          = prot.getLogBase          ;
        prot["getUnits"]            = prot.getUnits            ;
        prot["getShowUnitsOnChart"] = prot.getShowUnitsOnChart ;
        prot["getMajorTickMark"]    = prot.getMajorTickMark    ;
        prot["getMinorTickMark"]    = prot.getMinorTickMark    ;
        prot["getTickLabelsPos"]    = prot.getTickLabelsPos    ;
        prot["getCrossesRule"]      = prot.getCrossesRule      ;
        prot["getCrosses"]          = prot.getCrosses          ;

    window["asc_ValAxisSettings"] = asc_ValAxisSettings;


    function asc_CatAxisSettings()
    {
        this.intervalBetweenTick       = null;
        this.intervalBetweenLabelsRule = null;
        this.intervalBetweenLabels     = null;
        this.invertCatOrder            = null;
        this.labelsAxisDistance        = null;
        this.axisType                  = null;
        this.majorTickMark             = null;
        this.minorTickMark             = null;
        this.tickLabelsPos             = null;
        this.crossesRule               = null;
        this.crosses                   = null;
        this.labelsPosition            = null;
    }

    asc_CatAxisSettings.prototype =
    {
        putIntervalBetweenTick: function(v)
        {
            this.intervalBetweenTick = v;
        },
        putIntervalBetweenLabelsRule: function(v)
        {
            this.intervalBetweenLabelsRule = v;
        },
        putIntervalBetweenLabels: function(v)
        {
            this.intervalBetweenLabels = v;
        },
        putInvertCatOrder: function(v)
        {
            this.invertCatOrder = v;
        },
        putLabelsAxisDistance: function(v)
        {
            this.labelsAxisDistance = v;
        },
        putMajorTickMark: function(v)
        {
            this.majorTickMark = v;
        },
        putMinorTickMark: function(v)
        {
            this.minorTickMark = v;
        },
        putTickLabelsPos: function(v)
        {
            this.tickLabelsPos = v;
        },
        putCrossesRule: function(v)
        {
            this.crossesRule = v;
        },
        putCrosses: function(v)
        {
            this.crosses = v;
        },

        putAxisType: function(v)
        {
            this.axisType = v;
        },

        putLabelsPosition: function(v)
        {
            this.labelsPosition = v;
        },

        getIntervalBetweenTick: function(v)
        {
            return this.intervalBetweenTick;
        },

        getIntervalBetweenLabelsRule: function()
        {
            return this.intervalBetweenLabelsRule ;
        },
        getIntervalBetweenLabels: function()
        {
            return this.intervalBetweenLabels ;
        },
        getInvertCatOrder: function()
        {
            return this.invertCatOrder ;
        },
        getLabelsAxisDistance: function()
        {
            return this.labelsAxisDistance ;
        },
        getMajorTickMark: function()
        {
            return this.majorTickMark ;
        },
        getMinorTickMark: function()
        {
            return this.minorTickMark ;
        },
        getTickLabelsPos: function()
        {
            return this.tickLabelsPos;
        },
        getCrossesRule: function()
        {
            return this.crossesRule ;
        },
        getCrosses: function()
        {
            return this.crosses;
        },

        getAxisType: function()
        {
            return this.axisType;
        },

        getLabelsPosition: function()
        {
            return this.labelsPosition;
        }
    };

    prot = asc_CatAxisSettings.prototype;
    prot["putIntervalBetweenTick"] = prot.putIntervalBetweenTick;
    prot["putIntervalBetweenLabelsRule"] = prot.putIntervalBetweenLabelsRule;
    prot["putIntervalBetweenLabels"] = prot.putIntervalBetweenLabels        ;
    prot["putInvertCatOrder"] = prot.putInvertCatOrder                      ;
    prot["putLabelsAxisDistance"] = prot.putLabelsAxisDistance              ;
    prot["putMajorTickMark"] = prot.putMajorTickMark                        ;
    prot["putMinorTickMark"] = prot.putMinorTickMark                        ;
    prot["putTickLabelsPos"] = prot.putTickLabelsPos;
    prot["putCrossesRule"] = prot.putCrossesRule;
    prot["putCrosses"] = prot.putCrosses;
    prot["putAxisType"] = prot.putAxisType;
    prot["putLabelsPosition"] = prot.putLabelsPosition;


    prot["getIntervalBetweenTick"] = prot.getIntervalBetweenTick;
    prot["getIntervalBetweenLabelsRule"] = prot.getIntervalBetweenLabelsRule;
    prot["getIntervalBetweenLabels"] = prot.getIntervalBetweenLabels        ;
    prot["getInvertCatOrder"] = prot.getInvertCatOrder                      ;
    prot["getLabelsAxisDistance"] = prot.getLabelsAxisDistance              ;
    prot["getMajorTickMark"] = prot.getMajorTickMark                        ;
    prot["getMinorTickMark"] = prot.getMinorTickMark                        ;
    prot["getTickLabelsPos"] = prot.getTickLabelsPos                        ;
    prot["getCrossesRule"] = prot.getCrossesRule                            ;
    prot["getCrosses"]     = prot.getCrosses                   ;
    prot["getAxisType"]     = prot.getAxisType                   ;
    prot["getLabelsPosition"] = prot.getLabelsPosition;


    window["asc_CatAxisSettings"] = asc_CatAxisSettings;
}
)(window);

var CColor = window["CColor"];
var asc_ChartSettings = window["asc_ChartSettings"];
var asc_AxisSettings = window["asc_AxisSettings"];
var asc_ValAxisSettings = window["asc_ValAxisSettings"];
var asc_CatAxisSettings = window["asc_CatAxisSettings"];