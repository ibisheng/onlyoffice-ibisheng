/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
	cFormulaFunctionGroup['TextAndData'] = cFormulaFunctionGroup['TextAndData'] || [];
	cFormulaFunctionGroup['TextAndData'].push(cDBCS);
	cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
	cFormulaFunctionGroup['Statistical'].push(cFORECAST_ETS, cFORECAST_ETS_CONFINT,
		cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT);
	cFormulaFunctionGroup['Mathematic'] = cFormulaFunctionGroup['Mathematic'] || [];
	cFormulaFunctionGroup['Mathematic'].push(cMUNIT);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cDBCS, cFORECAST_ETS,
		cFORECAST_ETS_CONFINT, cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT,
		cMUNIT);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDBCS() {	
	}

	cDBCS.prototype = Object.create(cBaseFunction.prototype);
	cDBCS.prototype.constructor = cDBCS;
	cDBCS.prototype.name = "DBCS";
	cDBCS.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFILTERXML() {	
	}

	cFILTERXML.prototype = Object.create(cBaseFunction.prototype);
	cFILTERXML.prototype.constructor = cFILTERXML;
	cFILTERXML.prototype.name = "FILTERXML";
	cFILTERXML.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS() {	
	}

	cFORECAST_ETS.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS.prototype.constructor = cFORECAST_ETS;
	cFORECAST_ETS.prototype.name = "FORECAST.ETS";
	cFORECAST_ETS.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_CONFINT() {	
	}

	cFORECAST_ETS_CONFINT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_CONFINT.prototype.constructor = cFORECAST_ETS_CONFINT;
	cFORECAST_ETS_CONFINT.prototype.name = "FORECAST.ETS.CONFINT";
	cFORECAST_ETS_CONFINT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_SEASONALITY() {	
	}

	cFORECAST_ETS_SEASONALITY.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_SEASONALITY.prototype.constructor = cFORECAST_ETS_SEASONALITY;
	cFORECAST_ETS_SEASONALITY.prototype.name = "FORECAST.ETS.SEASONALITY";
	cFORECAST_ETS_SEASONALITY.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_STAT() {	
	}

	cFORECAST_ETS_STAT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_STAT.prototype.constructor = cFORECAST_ETS_STAT;
	cFORECAST_ETS_STAT.prototype.name = "FORECAST.ETS.STAT";
	cFORECAST_ETS_STAT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMUNIT() {	
	}

	cMUNIT.prototype = Object.create(cBaseFunction.prototype);
	cMUNIT.prototype.constructor = cMUNIT;
	cMUNIT.prototype.name = "MUNIT";
	cMUNIT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUERYSTRING() {	
	}

	cQUERYSTRING.prototype = Object.create(cBaseFunction.prototype);
	cQUERYSTRING.prototype.constructor = cQUERYSTRING;
	cQUERYSTRING.prototype.name = "QUERYSTRING";
	cQUERYSTRING.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEBSERVICE() {	
	}

	cWEBSERVICE.prototype = Object.create(cBaseFunction.prototype);
	cWEBSERVICE.prototype.constructor = cWEBSERVICE;
	cWEBSERVICE.prototype.name = "WEBSERVICE";
	cWEBSERVICE.prototype.isXLFN = true;
})(window);
