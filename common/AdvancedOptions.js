"use strict";

(
	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ( window, undefined) {

		/** @constructor */
		function asc_CAdvancedOptions(id,opt){
			this.optionId = null;
			this.options = null;

			switch(id){
				case Asc.c_oAscAdvancedOptionsID.CSV:
					this.optionId = id;
					this.options = new asc_CCSVOptions(opt);
					break;
				case Asc.c_oAscAdvancedOptionsID.TXT:
					this.optionId = id;
					this.options = new asc_CTXTOptions(opt);
					break;
			}
		}
		asc_CAdvancedOptions.prototype.asc_getOptionId = function(){ return this.optionId; };
		asc_CAdvancedOptions.prototype.asc_getOptions = function(){ return this.options; };

		/** @constructor */
		function asc_CCSVOptions(opt){
			this.codePages = function(){
				var arr = [], c, encodings = opt["encodings"];
				for(var i = 0; i < encodings.length; i++ ){
					c = new asc_CCodePage();
					c.init(encodings[i]);
					arr.push(c);
				}
				return arr;
			}();
			this.recommendedSettings = new asc_CCSVAdvancedOptions (opt["codepage"], /*opt["delimiter"]*/AscCommon.c_oAscCsvDelimiter.Comma); // ToDo разделитель пока только "," http://bugzserver/show_bug.cgi?id=31009
		}
		asc_CCSVOptions.prototype.asc_getCodePages = function(){ return this.codePages;};
		asc_CCSVOptions.prototype.asc_getRecommendedSettings = function () { return this.recommendedSettings; };

		/** @constructor */
		function asc_CTXTOptions(opt){
			this.codePages = function(){
				var arr = [], c, encodings = opt["encodings"];
				for(var i = 0; i < encodings.length; i++ ){
					c = new asc_CCodePage();
					c.init(encodings[i]);
					arr.push(c);
				}
				return arr;
			}();
			this.recommendedSettings = new asc_CTXTAdvancedOptions (opt["codepage"]);
		}
		asc_CTXTOptions.prototype.asc_getCodePages = function(){ return this.codePages;};
		asc_CTXTOptions.prototype.asc_getRecommendedSettings = function () { return this.recommendedSettings; };

		/** @constructor */
		function asc_CCSVAdvancedOptions(codepage,delimiter){
			this.codePage = codepage;
			this.delimiter = delimiter;
		}
		asc_CCSVAdvancedOptions.prototype.asc_getDelimiter = function(){return this.delimiter;};
		asc_CCSVAdvancedOptions.prototype.asc_setDelimiter = function(v){this.delimiter = v;};
		asc_CCSVAdvancedOptions.prototype.asc_getCodePage = function(){return this.codePage;};
		asc_CCSVAdvancedOptions.prototype.asc_setCodePage = function(v){this.codePage = v;};
		
		/** @constructor */
		function asc_CTXTAdvancedOptions(codepage){
			this.codePage = codepage;
		}
		asc_CTXTAdvancedOptions.prototype.asc_getCodePage = function(){return this.codePage;};
		asc_CTXTAdvancedOptions.prototype.asc_setCodePage = function(v){this.codePage = v;};

		/** @constructor */
		function asc_CCodePage(){
			this.codePageName = null;
			this.codePage = null;
			this.text = null;
		}
		asc_CCodePage.prototype.init = function (encoding) {
			this.codePageName = encoding["name"];
			this.codePage = encoding["codepage"];
			this.text = encoding["text"];
		};
		asc_CCodePage.prototype.asc_getCodePageName = function(){return this.codePageName;};
		asc_CCodePage.prototype.asc_setCodePageName = function(v){this.codePageName = v;};
		asc_CCodePage.prototype.asc_getCodePage = function(){return this.codePage;};
		asc_CCodePage.prototype.asc_setCodePage = function(v){this.codePage = v;};
		asc_CCodePage.prototype.asc_getText = function(){return this.text;};
		asc_CCodePage.prototype.asc_setText = function(v){this.text = v;};

		/** @constructor */
		function asc_CDelimiter(delimiter){
			this.delimiterName = delimiter;
		}
		asc_CDelimiter.prototype.asc_getDelimiterName = function(){return this.delimiterName;};
		asc_CDelimiter.prototype.asc_setDelimiterName = function(v){ this.delimiterName = v;};

		/** @constructor */
		function asc_CFormulaGroup(name){
			this.groupName = name;
			this.formulasArray = [];
		}
		asc_CFormulaGroup.prototype.asc_getGroupName = function() { return this.groupName; };
		asc_CFormulaGroup.prototype.asc_getFormulasArray = function() { return this.formulasArray; };
		asc_CFormulaGroup.prototype.asc_addFormulaElement = function(o) { return this.formulasArray.push(o); };

		/** @constructor */
		function asc_CFormula(o){
			this.name = o.name;
			this.arg = o.args;
		}
		asc_CFormula.prototype.asc_getName = function () {
			return AscCommonExcel.cFormulaFunctionToLocale ? AscCommonExcel.cFormulaFunctionToLocale[this.name] : this.name;
		};
		asc_CFormula.prototype.asc_getArguments = function () {
			return this.arg;
		};

		//----------------------------------------------------------export----------------------------------------------------
		var prot;
		window['Asc'] = window['Asc'] || {};
		window['AscCommon'] = window['AscCommon'] || {};
		window["AscCommon"].asc_CAdvancedOptions = asc_CAdvancedOptions;
		prot = asc_CAdvancedOptions.prototype;
		prot["asc_getOptionId"]			= prot.asc_getOptionId;
		prot["asc_getOptions"]			= prot.asc_getOptions;

		prot = asc_CCSVOptions.prototype;
		prot["asc_getCodePages"]			= prot.asc_getCodePages;
		prot["asc_getRecommendedSettings"]	= prot.asc_getRecommendedSettings;

		prot = asc_CTXTOptions.prototype;
		prot["asc_getCodePages"]			= prot.asc_getCodePages;
		prot["asc_getRecommendedSettings"]	= prot.asc_getRecommendedSettings;

		window["Asc"].asc_CCSVAdvancedOptions = window["Asc"]["asc_CCSVAdvancedOptions"] = asc_CCSVAdvancedOptions;
		prot = asc_CCSVAdvancedOptions.prototype;
		prot["asc_getDelimiter"] = prot.asc_getDelimiter;
		prot["asc_setDelimiter"] = prot.asc_setDelimiter;
		prot["asc_getCodePage"] = prot.asc_getCodePage;
		prot["asc_setCodePage"] = prot.asc_setCodePage;

		window["Asc"].asc_CTXTAdvancedOptions = window["Asc"]["asc_CTXTAdvancedOptions"] = asc_CTXTAdvancedOptions;
		prot = asc_CTXTAdvancedOptions.prototype;
		prot["asc_getCodePage"] = prot.asc_getCodePage;
		prot["asc_setCodePage"] = prot.asc_setCodePage;

		prot = asc_CCodePage.prototype;
		prot["asc_getCodePageName"]		= prot.asc_getCodePageName;
		prot["asc_setCodePageName"]		= prot.asc_setCodePageName;
		prot["asc_getCodePage"]			= prot.asc_getCodePage;
		prot["asc_setCodePage"]			= prot.asc_setCodePage;
		prot["asc_getText"]				= prot.asc_getText;
		prot["asc_setText"]				= prot.asc_setText;

		prot = asc_CDelimiter.prototype;
		prot["asc_getDelimiterName"]			= prot.asc_getDelimiterName;
		prot["asc_setDelimiterName"]			= prot.asc_setDelimiterName;

		window["AscCommon"].asc_CFormulaGroup = asc_CFormulaGroup;
		prot = asc_CFormulaGroup.prototype;
		prot["asc_getGroupName"]				= prot.asc_getGroupName;
		prot["asc_getFormulasArray"]			= prot.asc_getFormulasArray;
		prot["asc_addFormulaElement"]			= prot.asc_addFormulaElement;

		window["AscCommon"].asc_CFormula = asc_CFormula;
		prot = asc_CFormula.prototype;
		prot["asc_getName"]				= prot.asc_getName;
		prot["asc_getArguments"]		= prot.asc_getArguments;
	}
)(window);