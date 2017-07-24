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


(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined) {
	/*cFormulaFunctionGroup['_xlfn'] = [

	 cFILTERXML,//web not support in MS Office Online
	 cWEBSERVICE,//web not support in MS Office Online

	 cQUERYSTRING
	 ];*/

	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	/*new funcions with _xlnf-prefix*/
	cFormulaFunctionGroup['DateAndTime'] = cFormulaFunctionGroup['DateAndTime'] || [];
	cFormulaFunctionGroup['DateAndTime'].push(cDAYS, cISOWEEKNUM);
	cFormulaFunctionGroup['Engineering'] = cFormulaFunctionGroup['Engineering'] || [];
	cFormulaFunctionGroup['Engineering'].push(cBITLSHIFT, cBITOR, cBITRSHIFT, cBITXOR);
	cFormulaFunctionGroup['TextAndData'] = cFormulaFunctionGroup['TextAndData'] || [];
	cFormulaFunctionGroup['TextAndData'].push(cDBCS, cUNICHAR, cUNICODE);
	cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
	cFormulaFunctionGroup['Statistical'].push(cBINOM_DIST_RANGE, cF_TEST, cFORECAST_ETS, cFORECAST_ETS_CONFINT,
		cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT, cHYPGEOM_DIST);
	cFormulaFunctionGroup['Financial'] = cFormulaFunctionGroup['Financial'] || [];
	cFormulaFunctionGroup['Financial'].push(cPDURATION);
	cFormulaFunctionGroup['Mathematic'] = cFormulaFunctionGroup['Mathematic'] || [];
	cFormulaFunctionGroup['Mathematic'].push(cAGGREGATE, cMUNIT);
	cFormulaFunctionGroup['LookupAndReference'] = cFormulaFunctionGroup['LookupAndReference'] || [];
	cFormulaFunctionGroup['LookupAndReference'].push(cFORMULATEXT);
	cFormulaFunctionGroup['Information'] = cFormulaFunctionGroup['Information'] || [];
	cFormulaFunctionGroup['Information'].push(cSHEET, cSHEETS);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cDAYS, cISOWEEKNUM, cBITLSHIFT, cBITOR, cBITRSHIFT, cBITXOR,
		cDBCS, cUNICHAR, cUNICODE, cBINOM_DIST_RANGE, cF_TEST, cFORECAST_ETS, cFORECAST_ETS_CONFINT,
		cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT, cHYPGEOM_DIST, cPDURATION,
		cAGGREGATE, cMUNIT, cFORMULATEXT, cSHEET, cSHEETS);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAGGREGATE() {
		cBaseFunction.call(this, "AGGREGATE");
		this.isXLFN = true;
	}

	cAGGREGATE.prototype = Object.create(cBaseFunction.prototype);
	cAGGREGATE.prototype.constructor = cAGGREGATE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBINOM_DIST_RANGE() {
		cBaseFunction.call(this, "BINOM.DIST.RANGE");
		this.isXLFN = true;
	}

	cBINOM_DIST_RANGE.prototype = Object.create(cBaseFunction.prototype);
	cBINOM_DIST_RANGE.prototype.constructor = cBINOM_DIST_RANGE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITLSHIFT() {
		cBaseFunction.call(this, "BITLSHIFT");
		this.isXLFN = true;
	}

	cBITLSHIFT.prototype = Object.create(cBaseFunction.prototype);
	cBITLSHIFT.prototype.constructor = cBITLSHIFT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITOR() {
		cBaseFunction.call(this, "BITOR");
		this.isXLFN = true;
	}

	cBITOR.prototype = Object.create(cBaseFunction.prototype);
	cBITOR.prototype.constructor = cBITOR;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITRSHIFT() {
		cBaseFunction.call(this, "BITRSHIFT");
		this.isXLFN = true;
	}

	cBITRSHIFT.prototype = Object.create(cBaseFunction.prototype);
	cBITRSHIFT.prototype.constructor = cBITRSHIFT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITXOR() {
		cBaseFunction.call(this, "BITXOR");
		this.isXLFN = true;
	}

	cBITXOR.prototype = Object.create(cBaseFunction.prototype);
	cBITXOR.prototype.constructor = cBITXOR;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOMBINA() {
		cBaseFunction.call(this, "COMBINA");
		this.isXLFN = true;
	}

	cCOMBINA.prototype = Object.create(cBaseFunction.prototype);
	cCOMBINA.prototype.constructor = cCOMBINA;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDAYS() {
		cBaseFunction.call(this, "DAYS");
		this.isXLFN = true;
	}

	cDAYS.prototype = Object.create(cBaseFunction.prototype);
	cDAYS.prototype.constructor = cDAYS;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDBCS() {
		cBaseFunction.call(this, "DBCS");
		this.isXLFN = true;
	}

	cDBCS.prototype = Object.create(cBaseFunction.prototype);
	cDBCS.prototype.constructor = cDBCS;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_TEST() {
		cBaseFunction.call(this, "F.TEST");
		this.isXLFN = true;
	}

	cF_TEST.prototype = Object.create(cBaseFunction.prototype);
	cF_TEST.prototype.constructor = cF_TEST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFILTERXML() {
		cBaseFunction.call(this, "FILTERXML");
		this.isXLFN = true;
	}

	cFILTERXML.prototype = Object.create(cBaseFunction.prototype);
	cFILTERXML.prototype.constructor = cFILTERXML;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS() {
		cBaseFunction.call(this, "FORECAST.ETS");
		this.isXLFN = true;
	}

	cFORECAST_ETS.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS.prototype.constructor = cFORECAST_ETS;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_CONFINT() {
		cBaseFunction.call(this, "FORECAST.ETS.CONFINT");
		this.isXLFN = true;
	}

	cFORECAST_ETS_CONFINT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_CONFINT.prototype.constructor = cFORECAST_ETS_CONFINT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_SEASONALITY() {
		cBaseFunction.call(this, "FORECAST.ETS.SEASONALITY");
		this.isXLFN = true;
	}

	cFORECAST_ETS_SEASONALITY.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_SEASONALITY.prototype.constructor = cFORECAST_ETS_SEASONALITY;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_STAT() {
		cBaseFunction.call(this, "FORECAST.ETS.STAT");
		this.isXLFN = true;
	}

	cFORECAST_ETS_STAT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_STAT.prototype.constructor = cFORECAST_ETS_STAT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORMULATEXT() {
		cBaseFunction.call(this, "FORMULATEXT");
		this.isXLFN = true;
	}

	cFORMULATEXT.prototype = Object.create(cBaseFunction.prototype);
	cFORMULATEXT.prototype.constructor = cFORMULATEXT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHYPGEOM_DIST() {
		cBaseFunction.call(this, "HYPGEOM.DIST");
		this.isXLFN = true;
	}

	cHYPGEOM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cHYPGEOM_DIST.prototype.constructor = cHYPGEOM_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISOWEEKNUM() {
		cBaseFunction.call(this, "ISOWEEKNUM");
		this.isXLFN = true;
	}

	cISOWEEKNUM.prototype = Object.create(cBaseFunction.prototype);
	cISOWEEKNUM.prototype.constructor = cISOWEEKNUM;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMUNIT() {
		cBaseFunction.call(this, "MUNIT");
		this.isXLFN = true;
	}

	cMUNIT.prototype = Object.create(cBaseFunction.prototype);
	cMUNIT.prototype.constructor = cMUNIT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPDURATION() {
		cBaseFunction.call(this, "PDURATION");
		this.isXLFN = true;
	}

	cPDURATION.prototype = Object.create(cBaseFunction.prototype);
	cPDURATION.prototype.constructor = cPDURATION;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUERYSTRING() {
		cBaseFunction.call(this, "QUERYSTRING");
		this.isXLFN = true;
	}

	cQUERYSTRING.prototype = Object.create(cBaseFunction.prototype);
	cQUERYSTRING.prototype.constructor = cQUERYSTRING;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSHEET() {
		cBaseFunction.call(this, "SHEET");
		this.isXLFN = true;
	}

	cSHEET.prototype = Object.create(cBaseFunction.prototype);
	cSHEET.prototype.constructor = cSHEET;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSHEETS() {
		cBaseFunction.call(this, "SHEETS");
		this.isXLFN = true;
	}

	cSHEETS.prototype = Object.create(cBaseFunction.prototype);
	cSHEETS.prototype.constructor = cSHEETS;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cUNICHAR() {
		cBaseFunction.call(this, "UNICHAR");
		this.isXLFN = true;
	}

	cUNICHAR.prototype = Object.create(cBaseFunction.prototype);
	cUNICHAR.prototype.constructor = cUNICHAR;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cUNICODE() {
		cBaseFunction.call(this, "UNICODE");
		this.isXLFN = true;
	}

	cUNICODE.prototype = Object.create(cBaseFunction.prototype);
	cUNICODE.prototype.constructor = cUNICODE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEBSERVICE() {
		cBaseFunction.call(this, "WEBSERVICE");
		this.isXLFN = true;
	}

	cWEBSERVICE.prototype = Object.create(cBaseFunction.prototype);
	cWEBSERVICE.prototype.constructor = cWEBSERVICE;
})(window);
