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
	cFormulaFunctionGroup['Engineering'].push(cBITAND, cBITLSHIFT, cBITOR, cBITRSHIFT, cBITXOR, cERF_PRECISE,
		cERFC_PRECISE, cIMCOSH, cIMCOT, cIMCSC, cIMCSCH, cIMSEC, cIMSECH, cIMSINH, cIMTAN);
	cFormulaFunctionGroup['TextAndData'] = cFormulaFunctionGroup['TextAndData'] || [];
	cFormulaFunctionGroup['TextAndData'].push(cDBCS, cNUMBERVALUE, cUNICHAR, cUNICODE);
	cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
	cFormulaFunctionGroup['Statistical'].push(cBETA_DIST, cBETA_INV, cBINOM_DIST, cBINOM_DIST_RANGE, cBINOM_INV,
		cCHISQ_DIST, cCHISQ_DIST_RT, cCHISQ_INV, cCHISQ_INV_RT, cCHISQ_TEST, cCONFIDENCE_NORM, cCONFIDENCE_T,
		cCOVARIANCE_P, cCOVARIANCE_S, cEXPON_DIST, cF_DIST, cF_DIST_RT, cF_INV, cF_INV_RT, cF_TEST, cFORECAST_ETS,
		cFORECAST_ETS_CONFINT, cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT, cFORECAST_LINEAR, cGAMMA, cGAMMA_DIST,
		cGAMMA_INV, cGAMMALN_PRECISE, cGAUSS, cHYPGEOM_DIST, cLOGNORM_DIST, cLOGNORM_INV, cMODE_MULT, cMODE_SNGL,
		cNEGBINOM_DIST, cNORM_DIST, cNORM_INV, cNORM_S_DIST, cNORM_S_INV, cPERCENTILE_EXC, cPERCENTILE_INC,
		cPERCENTRANK_EXC, cPERCENTRANK_INC, cPERMUTATIONA, cPHI, cPOISSON_DIST, cQUARTILE_EXC, cQUARTILE_INC, cRANK_AVG,
		cRANK_EQ, cSKEW_P, cSTDEV_P, cSTDEV_S, cT_DIST, cT_DIST_2T, cT_DIST_RT, cT_INV, cT_INV_2T, cT_TEST, cVAR_P,
		cVAR_S, cWEIBULL_DIST, cZ_TEST);
	cFormulaFunctionGroup['Financial'] = cFormulaFunctionGroup['Financial'] || [];
	cFormulaFunctionGroup['Financial'].push(cPDURATION, cRRI);
	cFormulaFunctionGroup['Mathematic'] = cFormulaFunctionGroup['Mathematic'] || [];
	cFormulaFunctionGroup['Mathematic'].push(cAGGREGATE, cBASE, cCEILING_MATH, cCEILING_PRECISE,
		cCOMBINA, cCSC, cCSCH, cDECIMAL, cFLOOR_MATH, cFLOOR_PRECISE, cMUNIT, cSEC, cSECH);
	cFormulaFunctionGroup['LookupAndReference'] = cFormulaFunctionGroup['LookupAndReference'] || [];
	cFormulaFunctionGroup['LookupAndReference'].push(cFORMULATEXT);
	cFormulaFunctionGroup['Information'] = cFormulaFunctionGroup['Information'] || [];
	cFormulaFunctionGroup['Information'].push(cISFORMULA, cSHEET, cSHEETS);
	cFormulaFunctionGroup['Logical'] = cFormulaFunctionGroup['Logical'] || [];
	cFormulaFunctionGroup['Logical'].push(cIFNA, cXOR);

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
	function cBASE() {
		cBaseFunction.call(this, "BASE");
		this.isXLFN = true;
	}

	cBASE.prototype = Object.create(cBaseFunction.prototype);
	cBASE.prototype.constructor = cBASE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBETA_DIST() {
		cBaseFunction.call(this, "BETA.DIST");
		this.isXLFN = true;
	}

	cBETA_DIST.prototype = Object.create(cBaseFunction.prototype);
	cBETA_DIST.prototype.constructor = cBETA_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBETA_INV() {
		cBaseFunction.call(this, "BETA.INV");
		this.isXLFN = true;
	}

	cBETA_INV.prototype = Object.create(cBaseFunction.prototype);
	cBETA_INV.prototype.constructor = cBETA_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBINOM_DIST() {
		cBaseFunction.call(this, "BINOM.DIST");
		this.isXLFN = true;
	}

	cBINOM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cBINOM_DIST.prototype.constructor = cBINOM_DIST;

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
	function cBINOM_INV() {
		cBaseFunction.call(this, "BINOM.DIST.RANGE");
		this.isXLFN = true;
	}

	cBINOM_INV.prototype = Object.create(cBaseFunction.prototype);
	cBINOM_INV.prototype.constructor = cBINOM_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITAND() {
		cBaseFunction.call(this, "BITAND");
		this.isXLFN = true;
	}

	cBITAND.prototype = Object.create(cBaseFunction.prototype);
	cBITAND.prototype.constructor = cBITAND;

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
	function cCEILING_MATH() {
		cBaseFunction.call(this, "CEILING.MATH");
		this.isXLFN = true;
	}

	cCEILING_MATH.prototype = Object.create(cBaseFunction.prototype);
	cCEILING_MATH.prototype.constructor = cCEILING_MATH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCEILING_PRECISE() {
		cBaseFunction.call(this, "CEILING.PRECISE");
		this.isXLFN = true;
	}

	cCEILING_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cCEILING_PRECISE.prototype.constructor = cCEILING_PRECISE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_DIST() {
		cBaseFunction.call(this, "CHISQ.DIST");
		this.isXLFN = true;
	}

	cCHISQ_DIST.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_DIST.prototype.constructor = cCHISQ_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_DIST_RT() {
		cBaseFunction.call(this, "CHISQ.DIST.RT");
		this.isXLFN = true;
	}

	cCHISQ_DIST_RT.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_DIST_RT.prototype.constructor = cCHISQ_DIST_RT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_INV() {
		cBaseFunction.call(this, "CHISQ.INV");
		this.isXLFN = true;
	}

	cCHISQ_INV.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_INV.prototype.constructor = cCHISQ_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_INV_RT() {
		cBaseFunction.call(this, "CHISQ.INV.RT");
		this.isXLFN = true;
	}

	cCHISQ_INV_RT.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_INV_RT.prototype.constructor = cCHISQ_INV_RT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_TEST() {
		cBaseFunction.call(this, "CHISQ.TEST");
		this.isXLFN = true;
	}

	cCHISQ_TEST.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_TEST.prototype.constructor = cCHISQ_TEST;

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
	function cCONFIDENCE_NORM() {
		cBaseFunction.call(this, "CONFIDENCE.NORM");
		this.isXLFN = true;
	}

	cCONFIDENCE_NORM.prototype = Object.create(cBaseFunction.prototype);
	cCONFIDENCE_NORM.prototype.constructor = cCONFIDENCE_NORM;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONFIDENCE_T() {
		cBaseFunction.call(this, "CONFIDENCE.T");
		this.isXLFN = true;
	}

	cCONFIDENCE_T.prototype = Object.create(cBaseFunction.prototype);
	cCONFIDENCE_T.prototype.constructor = cCONFIDENCE_T;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOVARIANCE_P() {
		cBaseFunction.call(this, "COVARIANCE.P");
		this.isXLFN = true;
	}

	cCOVARIANCE_P.prototype = Object.create(cBaseFunction.prototype);
	cCOVARIANCE_P.prototype.constructor = cCOVARIANCE_P;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOVARIANCE_S() {
		cBaseFunction.call(this, "COVARIANCE.S");
		this.isXLFN = true;
	}

	cCOVARIANCE_S.prototype = Object.create(cBaseFunction.prototype);
	cCOVARIANCE_S.prototype.constructor = cCOVARIANCE_S;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCSC() {
		cBaseFunction.call(this, "CSC");
		this.isXLFN = true;
	}

	cCSC.prototype = Object.create(cBaseFunction.prototype);
	cCSC.prototype.constructor = cCSC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCSCH() {
		cBaseFunction.call(this, "CSCH");
		this.isXLFN = true;
	}

	cCSCH.prototype = Object.create(cBaseFunction.prototype);
	cCSCH.prototype.constructor = cCSCH;

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
	function cDECIMAL() {
		cBaseFunction.call(this, "DECIMAL");
		this.isXLFN = true;
	}

	cDECIMAL.prototype = Object.create(cBaseFunction.prototype);
	cDECIMAL.prototype.constructor = cDECIMAL;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERF_PRECISE() {
		cBaseFunction.call(this, "ERF.PRECISE");
		this.isXLFN = true;
	}

	cERF_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cERF_PRECISE.prototype.constructor = cERF_PRECISE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERFC_PRECISE() {
		cBaseFunction.call(this, "ERFC.PRECISE");
		this.isXLFN = true;
	}

	cERFC_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cERFC_PRECISE.prototype.constructor = cERFC_PRECISE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEXPON_DIST() {
		cBaseFunction.call(this, "EXPON.DIST");
		this.isXLFN = true;
	}

	cEXPON_DIST.prototype = Object.create(cBaseFunction.prototype);
	cEXPON_DIST.prototype.constructor = cEXPON_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_DIST() {
		cBaseFunction.call(this, "F.DIST");
		this.isXLFN = true;
	}

	cF_DIST.prototype = Object.create(cBaseFunction.prototype);
	cF_DIST.prototype.constructor = cF_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_DIST_RT() {
		cBaseFunction.call(this, "F.DIST.RT");
		this.isXLFN = true;
	}

	cF_DIST_RT.prototype = Object.create(cBaseFunction.prototype);
	cF_DIST_RT.prototype.constructor = cF_DIST_RT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_INV() {
		cBaseFunction.call(this, "F.INV");
		this.isXLFN = true;
	}

	cF_INV.prototype = Object.create(cBaseFunction.prototype);
	cF_INV.prototype.constructor = cF_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_INV_RT() {
		cBaseFunction.call(this, "F.INV.RT");
		this.isXLFN = true;
	}

	cF_INV_RT.prototype = Object.create(cBaseFunction.prototype);
	cF_INV_RT.prototype.constructor = cF_INV_RT;

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
	function cFLOOR_MATH() {
		cBaseFunction.call(this, "FLOOR.MATH");
		this.isXLFN = true;
	}

	cFLOOR_MATH.prototype = Object.create(cBaseFunction.prototype);
	cFLOOR_MATH.prototype.constructor = cFLOOR_MATH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFLOOR_PRECISE() {
		cBaseFunction.call(this, "FLOOR.PRECISE");
		this.isXLFN = true;
	}

	cFLOOR_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cFLOOR_PRECISE.prototype.constructor = cFLOOR_PRECISE;

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
	function cFORECAST_LINEAR() {
		cBaseFunction.call(this, "FORECAST.LINEAR");
		this.isXLFN = true;
	}

	cFORECAST_LINEAR.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_LINEAR.prototype.constructor = cFORECAST_LINEAR;

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
	function cGAMMA() {
		cBaseFunction.call(this, "GAMMA");
		this.isXLFN = true;
	}

	cGAMMA.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA.prototype.constructor = cGAMMA;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMA_DIST() {
		cBaseFunction.call(this, "GAMMA.DIST");
		this.isXLFN = true;
	}

	cGAMMA_DIST.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA_DIST.prototype.constructor = cGAMMA_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMA_INV() {
		cBaseFunction.call(this, "GAMMA.INV");
		this.isXLFN = true;
	}

	cGAMMA_INV.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA_INV.prototype.constructor = cGAMMA_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMALN_PRECISE() {
		cBaseFunction.call(this, "GAMMALN.PRECISE");
		this.isXLFN = true;
	}

	cGAMMALN_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cGAMMALN_PRECISE.prototype.constructor = cGAMMALN_PRECISE;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAUSS() {
		cBaseFunction.call(this, "GAUSS");
		this.isXLFN = true;
	}

	cGAUSS.prototype = Object.create(cBaseFunction.prototype);
	cGAUSS.prototype.constructor = cGAUSS;

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
	function cIFNA() {
		cBaseFunction.call(this, "IFNA");
		this.isXLFN = true;
	}

	cIFNA.prototype = Object.create(cBaseFunction.prototype);
	cIFNA.prototype.constructor = cIFNA;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCOSH() {
		cBaseFunction.call(this, "IMCOSH");
		this.isXLFN = true;
	}

	cIMCOSH.prototype = Object.create(cBaseFunction.prototype);
	cIMCOSH.prototype.constructor = cIMCOSH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCOT() {
		cBaseFunction.call(this, "IMCOT");
		this.isXLFN = true;
	}

	cIMCOT.prototype = Object.create(cBaseFunction.prototype);
	cIMCOT.prototype.constructor = cIMCOT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCSC() {
		cBaseFunction.call(this, "IMCSC");
		this.isXLFN = true;
	}

	cIMCSC.prototype = Object.create(cBaseFunction.prototype);
	cIMCSC.prototype.constructor = cIMCSC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCSCH() {
		cBaseFunction.call(this, "IMCSCH");
		this.isXLFN = true;
	}

	cIMCSCH.prototype = Object.create(cBaseFunction.prototype);
	cIMCSCH.prototype.constructor = cIMCSCH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSEC() {
		cBaseFunction.call(this, "IMSEC");
		this.isXLFN = true;
	}

	cIMSEC.prototype = Object.create(cBaseFunction.prototype);
	cIMSEC.prototype.constructor = cIMSEC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSECH() {
		cBaseFunction.call(this, "IMSECH");
		this.isXLFN = true;
	}

	cIMSECH.prototype = Object.create(cBaseFunction.prototype);
	cIMSECH.prototype.constructor = cIMSECH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSINH() {
		cBaseFunction.call(this, "IMSINH");
		this.isXLFN = true;
	}

	cIMSINH.prototype = Object.create(cBaseFunction.prototype);
	cIMSINH.prototype.constructor = cIMSINH;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMTAN() {
		cBaseFunction.call(this, "IMTAN");
		this.isXLFN = true;
	}

	cIMTAN.prototype = Object.create(cBaseFunction.prototype);
	cIMTAN.prototype.constructor = cIMTAN;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cISFORMULA() {
		cBaseFunction.call(this, "ISFORMULA");
		this.isXLFN = true;
	}

	cISFORMULA.prototype = Object.create(cBaseFunction.prototype);
	cISFORMULA.prototype.constructor = cISFORMULA;

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
	function cLOGNORM_DIST() {
		cBaseFunction.call(this, "LOGNORM.DIST");
		this.isXLFN = true;
	}

	cLOGNORM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORM_DIST.prototype.constructor = cLOGNORM_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGNORM_INV() {
		cBaseFunction.call(this, "LOGNORM.INV");
		this.isXLFN = true;
	}

	cLOGNORM_INV.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORM_INV.prototype.constructor = cLOGNORM_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMODE_MULT() {
		cBaseFunction.call(this, "MODE.MULT");
		this.isXLFN = true;
	}

	cMODE_MULT.prototype = Object.create(cBaseFunction.prototype);
	cMODE_MULT.prototype.constructor = cMODE_MULT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMODE_SNGL() {
		cBaseFunction.call(this, "MODE.SNGL");
		this.isXLFN = true;
	}

	cMODE_SNGL.prototype = Object.create(cBaseFunction.prototype);
	cMODE_SNGL.prototype.constructor = cMODE_SNGL;

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
	function cNEGBINOM_DIST() {
		cBaseFunction.call(this, "NEGBINOM.DIST");
		this.isXLFN = true;
	}

	cNEGBINOM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cNEGBINOM_DIST.prototype.constructor = cNEGBINOM_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORM_DIST() {
		cBaseFunction.call(this, "NORM.DIST");
		this.isXLFN = true;
	}

	cNORM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cNORM_DIST.prototype.constructor = cNORM_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORM_INV() {
		cBaseFunction.call(this, "NORM.INV");
		this.isXLFN = true;
	}

	cNORM_INV.prototype = Object.create(cBaseFunction.prototype);
	cNORM_INV.prototype.constructor = cNORM_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORM_S_DIST() {
		cBaseFunction.call(this, "NORM.S.DIST");
		this.isXLFN = true;
	}

	cNORM_S_DIST.prototype = Object.create(cBaseFunction.prototype);
	cNORM_S_DIST.prototype.constructor = cNORM_S_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORM_S_INV() {
		cBaseFunction.call(this, "NORM.S.INV");
		this.isXLFN = true;
	}

	cNORM_S_INV.prototype = Object.create(cBaseFunction.prototype);
	cNORM_S_INV.prototype.constructor = cNORM_S_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNUMBERVALUE() {
		cBaseFunction.call(this, "NUMBERVALUE");
		this.isXLFN = true;
	}

	cNUMBERVALUE.prototype = Object.create(cBaseFunction.prototype);
	cNUMBERVALUE.prototype.constructor = cNUMBERVALUE;

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
	function cPERCENTILE_EXC() {
		cBaseFunction.call(this, "PERCENTILE.EXC");
		this.isXLFN = true;
	}

	cPERCENTILE_EXC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTILE_EXC.prototype.constructor = cPERCENTILE_EXC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTILE_INC() {
		cBaseFunction.call(this, "PERCENTILE.INC");
		this.isXLFN = true;
	}

	cPERCENTILE_INC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTILE_INC.prototype.constructor = cPERCENTILE_INC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTRANK_EXC() {
		cBaseFunction.call(this, "PERCENTRANK.EXC");
		this.isXLFN = true;
	}

	cPERCENTRANK_EXC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTRANK_EXC.prototype.constructor = cPERCENTRANK_EXC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTRANK_INC() {
		cBaseFunction.call(this, "PERCENTRANK.INC");
		this.isXLFN = true;
	}

	cPERCENTRANK_INC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTRANK_INC.prototype.constructor = cPERCENTRANK_INC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERMUTATIONA() {
		cBaseFunction.call(this, "PERMUTATIONA");
		this.isXLFN = true;
	}

	cPERMUTATIONA.prototype = Object.create(cBaseFunction.prototype);
	cPERMUTATIONA.prototype.constructor = cPERMUTATIONA;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPHI() {
		cBaseFunction.call(this, "PHI");
		this.isXLFN = true;
	}

	cPHI.prototype = Object.create(cBaseFunction.prototype);
	cPHI.prototype.constructor = cPHI;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPOISSON_DIST() {
		cBaseFunction.call(this, "POISSON.DIST");
		this.isXLFN = true;
	}

	cPOISSON_DIST.prototype = Object.create(cBaseFunction.prototype);
	cPOISSON_DIST.prototype.constructor = cPOISSON_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUARTILE_EXC() {
		cBaseFunction.call(this, "QUARTILE.EXC");
		this.isXLFN = true;
	}

	cQUARTILE_EXC.prototype = Object.create(cBaseFunction.prototype);
	cQUARTILE_EXC.prototype.constructor = cQUARTILE_EXC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUARTILE_INC() {
		cBaseFunction.call(this, "QUARTILE.INC");
		this.isXLFN = true;
	}

	cQUARTILE_INC.prototype = Object.create(cBaseFunction.prototype);
	cQUARTILE_INC.prototype.constructor = cQUARTILE_INC;

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
	function cRANK_AVG() {
		cBaseFunction.call(this, "RANK.AVG");
		this.isXLFN = true;
	}

	cRANK_AVG.prototype = Object.create(cBaseFunction.prototype);
	cRANK_AVG.prototype.constructor = cRANK_AVG;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRANK_EQ() {
		cBaseFunction.call(this, "RANK.EQ");
		this.isXLFN = true;
	}

	cRANK_EQ.prototype = Object.create(cBaseFunction.prototype);
	cRANK_EQ.prototype.constructor = cRANK_EQ;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRRI() {
		cBaseFunction.call(this, "RRI");
		this.isXLFN = true;
	}

	cRRI.prototype = Object.create(cBaseFunction.prototype);
	cRRI.prototype.constructor = cRRI;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSEC() {
		cBaseFunction.call(this, "SEC");
		this.isXLFN = true;
	}

	cSEC.prototype = Object.create(cBaseFunction.prototype);
	cSEC.prototype.constructor = cSEC;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSECH() {
		cBaseFunction.call(this, "SECH");
		this.isXLFN = true;
	}

	cSECH.prototype = Object.create(cBaseFunction.prototype);
	cSECH.prototype.constructor = cSECH;

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
	function cSKEW_P() {
		cBaseFunction.call(this, "SKEW.P");
		this.isXLFN = true;
	}

	cSKEW_P.prototype = Object.create(cBaseFunction.prototype);
	cSKEW_P.prototype.constructor = cSKEW_P;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEV_P() {
		cBaseFunction.call(this, "STDEV.P");
		this.isXLFN = true;
	}

	cSTDEV_P.prototype = Object.create(cBaseFunction.prototype);
	cSTDEV_P.prototype.constructor = cSTDEV_P;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEV_S() {
		cBaseFunction.call(this, "STDEV.S");
		this.isXLFN = true;
	}

	cSTDEV_S.prototype = Object.create(cBaseFunction.prototype);
	cSTDEV_S.prototype.constructor = cSTDEV_S;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST() {
		cBaseFunction.call(this, "T.DIST");
		this.isXLFN = true;
	}

	cT_DIST.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST.prototype.constructor = cT_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST_2T() {
		cBaseFunction.call(this, "T.DIST.2T");
		this.isXLFN = true;
	}

	cT_DIST_2T.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST_2T.prototype.constructor = cT_DIST_2T;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST_RT() {
		cBaseFunction.call(this, "T.DIST.RT");
		this.isXLFN = true;
	}

	cT_DIST_RT.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST_RT.prototype.constructor = cT_DIST_RT;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_INV() {
		cBaseFunction.call(this, "T.INV");
		this.isXLFN = true;
	}

	cT_INV.prototype = Object.create(cBaseFunction.prototype);
	cT_INV.prototype.constructor = cT_INV;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_INV_2T() {
		cBaseFunction.call(this, "T.INV.2T");
		this.isXLFN = true;
	}

	cT_INV_2T.prototype = Object.create(cBaseFunction.prototype);
	cT_INV_2T.prototype.constructor = cT_INV_2T;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_TEST() {
		cBaseFunction.call(this, "T.TEST");
		this.isXLFN = true;
	}

	cT_TEST.prototype = Object.create(cBaseFunction.prototype);
	cT_TEST.prototype.constructor = cT_TEST;

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
	function cVAR_P() {
		cBaseFunction.call(this, "VAR.P");
		this.isXLFN = true;
	}

	cVAR_P.prototype = Object.create(cBaseFunction.prototype);
	cVAR_P.prototype.constructor = cVAR_P;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVAR_S() {
		cBaseFunction.call(this, "VAR.S");
		this.isXLFN = true;
	}

	cVAR_S.prototype = Object.create(cBaseFunction.prototype);
	cVAR_S.prototype.constructor = cVAR_S;

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

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEIBULL_DIST() {
		cBaseFunction.call(this, "WEIBULL.DIST");
		this.isXLFN = true;
	}

	cWEIBULL_DIST.prototype = Object.create(cBaseFunction.prototype);
	cWEIBULL_DIST.prototype.constructor = cWEIBULL_DIST;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cXOR() {
		cBaseFunction.call(this, "XOR");
		this.isXLFN = true;
	}

	cXOR.prototype = Object.create(cBaseFunction.prototype);
	cXOR.prototype.constructor = cXOR;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cZ_TEST() {
		cBaseFunction.call(this, "Z.TEST");
		this.isXLFN = true;
	}

	cZ_TEST.prototype = Object.create(cBaseFunction.prototype);
	cZ_TEST.prototype.constructor = cZ_TEST;
})(window);
