
(
/**
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
    cFormulaFunctionGroup['DateAndTime'].push(
      cDAYS,
      cISOWEEKNUM
    );
    cFormulaFunctionGroup['Engineering'] = cFormulaFunctionGroup['Engineering'] || [];
    cFormulaFunctionGroup['Engineering'].push(
      cBITAND,
      cBITLSHIFT,
      cBITOR,
      cBITRSHIFT,
      cBITXOR,
      cERF_PRECISE,
      cERFC_PRECISE,
      cIMCOSH,
      cIMCOT,
      cIMCSC,
      cIMCSCH,
      cIMSEC,
      cIMSECH,
      cIMSINH,
      cIMTAN
    );
    cFormulaFunctionGroup['TextAndData'] = cFormulaFunctionGroup['TextAndData'] || [];
    cFormulaFunctionGroup['TextAndData'].push(
      cDBCS,
      cNUMBERVALUE,
      cUNICHAR,
      cUNICODE
    );
    cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
    cFormulaFunctionGroup['Statistical'].push(
      cBETA_DIST,
      cBETA_INV,
      cBINOM_DIST,
      cBINOM_DIST_RANGE,
      cBINOM_INV,
      cCHISQ_DIST,
      cCHISQ_DIST_RT,
      cCHISQ_INV,
      cCHISQ_INV_RT,
      cCHISQ_TEST,
      cCONFIDENCE_NORM,
      cCONFIDENCE_T,
      cCOVARIANCE_P,
      cCOVARIANCE_S,
      cEXPON_DIST,
      cF_DIST,
      cF_DIST_RT,
      cF_INV,
      cF_INV_RT,
      cF_TEST,
      cFORECAST_ETS,
      cFORECAST_ETS_CONFINT,
      cFORECAST_ETS_SEASONALITY,
      cFORECAST_ETS_STAT,
      cFORECAST_LINEAR,
      cGAMMA,
      cGAMMA_DIST,
      cGAMMA_INV,
      cGAMMALN_PRECISE,
      cGAUSS,
      cHYPGEOM_DIST,
      cLOGNORM_DIST,
      cLOGNORM_INV,
      cMODE_MULT,
      cMODE_SNGL,
      cNEGBINOM_DIST,
      cNORM_DIST,
      cNORM_INV,
      cNORM_S_DIST,
      cNORM_S_INV,
      cPERCENTILE_EXC,
      cPERCENTILE_INC,
      cPERCENTRANK_EXC,
      cPERCENTRANK_INC,
      cPERMUTATIONA,
      cPHI,
      cPOISSON_DIST,
      cQUARTILE_EXC,
      cQUARTILE_INC,
      cRANK_AVG,
      cRANK_EQ,
      cSKEW_P,
      cSTDEV_P,
      cSTDEV_S,
      cT_DIST,
      cT_DIST_2T,
      cT_DIST_RT,
      cT_INV,
      cT_INV_2T,
      cT_TEST,
      cVAR_P,
      cVAR_S,
      cWEIBULL_DIST,
      cZ_TEST
    );
    cFormulaFunctionGroup['Financial'] = cFormulaFunctionGroup['Financial'] || [];
    cFormulaFunctionGroup['Financial'].push(
      cPDURATION,
      cRRI
    );
    cFormulaFunctionGroup['Mathematic'] = cFormulaFunctionGroup['Mathematic'] || [];
    cFormulaFunctionGroup['Mathematic'].push(
      cACOT,
      cACOTH,
      cAGGREGATE,
      cARABIC,
      cBASE,
      cCEILING_MATH,
      cCEILING_PRECISE,
      cCOMBINA,
      cCOT,
      cCOTH,
      cCSC,
      cCSCH,
      cDECIMAL,
      cFLOOR_MATH,
      cFLOOR_PRECISE,
      cMUNIT,
      cSEC,
      cSECH
    );
    cFormulaFunctionGroup['LookupAndReference'] = cFormulaFunctionGroup['LookupAndReference'] || [];
    cFormulaFunctionGroup['LookupAndReference'].push(
      cFORMULATEXT
    );
    cFormulaFunctionGroup['Information'] = cFormulaFunctionGroup['Information'] || [];
    cFormulaFunctionGroup['Information'].push(
      cISFORMULA,
      cSHEET,
      cSHEETS
    );
    cFormulaFunctionGroup['Logical'] = cFormulaFunctionGroup['Logical'] || [];
    cFormulaFunctionGroup['Logical'].push(
      cIFNA,
      cXOR
    );

function cACOT() {
    cBaseFunction.call( this, "ACOT" );
    this.isXLFN = true;
}
cACOT.prototype = Object.create( cBaseFunction.prototype );

function cACOTH() {
    cBaseFunction.call( this, "ACOTH" );
    this.isXLFN = true;
}
cACOTH.prototype = Object.create( cBaseFunction.prototype );

function cAGGREGATE() {
    cBaseFunction.call( this, "AGGREGATE" );
    this.isXLFN = true;
}
cAGGREGATE.prototype = Object.create( cBaseFunction.prototype );

function cARABIC() {
    cBaseFunction.call( this, "ARABIC" );
    this.isXLFN = true;
}
cARABIC.prototype = Object.create( cBaseFunction.prototype );

function cBASE() {
    cBaseFunction.call( this, "BASE" );
    this.isXLFN = true;
}
cBASE.prototype = Object.create( cBaseFunction.prototype );

function cBETA_DIST() {
    cBaseFunction.call( this, "BETA.DIST" );
    this.isXLFN = true;
}
cBETA_DIST.prototype = Object.create( cBaseFunction.prototype );

function cBETA_INV() {
    cBaseFunction.call( this, "BETA.INV" );
    this.isXLFN = true;
}
cBETA_INV.prototype = Object.create( cBaseFunction.prototype );

function cBINOM_DIST() {
    cBaseFunction.call( this, "BINOM.DIST" );
    this.isXLFN = true;
}
cBINOM_DIST.prototype = Object.create( cBaseFunction.prototype );

function cBINOM_DIST_RANGE() {
    cBaseFunction.call( this, "BINOM.DIST.RANGE" );
    this.isXLFN = true;
}
cBINOM_DIST_RANGE.prototype = Object.create( cBaseFunction.prototype );

function cBINOM_INV() {
    cBaseFunction.call( this, "BINOM.DIST.RANGE" );
    this.isXLFN = true;
}
cBINOM_INV.prototype = Object.create( cBaseFunction.prototype );

function cBITAND() {
    cBaseFunction.call( this, "BITAND" );
    this.isXLFN = true;
}
cBITAND.prototype = Object.create( cBaseFunction.prototype );

function cBITLSHIFT() {
    cBaseFunction.call( this, "BITLSHIFT" );
    this.isXLFN = true;
}
cBITLSHIFT.prototype = Object.create( cBaseFunction.prototype );

function cBITOR() {
    cBaseFunction.call( this, "BITOR" );
    this.isXLFN = true;
}
cBITOR.prototype = Object.create( cBaseFunction.prototype );

function cBITRSHIFT() {
    cBaseFunction.call( this, "BITRSHIFT" );
    this.isXLFN = true;
}
cBITRSHIFT.prototype = Object.create( cBaseFunction.prototype );

function cBITXOR() {
    cBaseFunction.call( this, "BITXOR" );
    this.isXLFN = true;
}
cBITXOR.prototype = Object.create( cBaseFunction.prototype );

function cCEILING_MATH() {
    cBaseFunction.call( this, "CEILING.MATH" );
    this.isXLFN = true;
}
cCEILING_MATH.prototype = Object.create( cBaseFunction.prototype );

function cCEILING_PRECISE() {
    cBaseFunction.call( this, "CEILING.PRECISE" );
    this.isXLFN = true;
}
cCEILING_PRECISE.prototype = Object.create( cBaseFunction.prototype );

function cCHISQ_DIST() {
    cBaseFunction.call( this, "CHISQ.DIST" );
    this.isXLFN = true;
}
cCHISQ_DIST.prototype = Object.create( cBaseFunction.prototype );

function cCHISQ_DIST_RT() {
    cBaseFunction.call( this, "CHISQ.DIST.RT" );
    this.isXLFN = true;
}
cCHISQ_DIST_RT.prototype = Object.create( cBaseFunction.prototype );

function cCHISQ_INV() {
    cBaseFunction.call( this, "CHISQ.INV" );
    this.isXLFN = true;
}
cCHISQ_INV.prototype = Object.create( cBaseFunction.prototype );

function cCHISQ_INV_RT() {
    cBaseFunction.call( this, "CHISQ.INV.RT" );
    this.isXLFN = true;
}
cCHISQ_INV_RT.prototype = Object.create( cBaseFunction.prototype );

function cCHISQ_TEST() {
    cBaseFunction.call( this, "CHISQ.TEST" );
    this.isXLFN = true;
}
cCHISQ_TEST.prototype = Object.create( cBaseFunction.prototype );

function cCOMBINA() {
    cBaseFunction.call( this, "COMBINA" );
    this.isXLFN = true;
}
cCOMBINA.prototype = Object.create( cBaseFunction.prototype );

function cCONFIDENCE_NORM() {
    cBaseFunction.call( this, "CONFIDENCE.NORM" );
    this.isXLFN = true;
}
cCONFIDENCE_NORM.prototype = Object.create( cBaseFunction.prototype );

function cCONFIDENCE_T() {
    cBaseFunction.call( this, "CONFIDENCE.T" );
    this.isXLFN = true;
}
cCONFIDENCE_T.prototype = Object.create( cBaseFunction.prototype );

function cCOT() {
    cBaseFunction.call( this, "COT" );
    this.isXLFN = true;
}
cCOT.prototype = Object.create( cBaseFunction.prototype );

function cCOTH() {
    cBaseFunction.call( this, "COTH" );
    this.isXLFN = true;
}
cCOTH.prototype = Object.create( cBaseFunction.prototype );

function cCOVARIANCE_P() {
    cBaseFunction.call( this, "COVARIANCE.P" );
    this.isXLFN = true;
}
cCOVARIANCE_P.prototype = Object.create( cBaseFunction.prototype );

function cCOVARIANCE_S() {
    cBaseFunction.call( this, "COVARIANCE.S" );
    this.isXLFN = true;
}
cCOVARIANCE_S.prototype = Object.create( cBaseFunction.prototype );

function cCSC() {
    cBaseFunction.call( this, "CSC" );
    this.isXLFN = true;
}
cCSC.prototype = Object.create( cBaseFunction.prototype );

function cCSCH() {
    cBaseFunction.call( this, "CSCH" );
    this.isXLFN = true;
}
cCSCH.prototype = Object.create( cBaseFunction.prototype );

function cDAYS() {
    cBaseFunction.call( this, "DAYS" );
    this.isXLFN = true;
}
cDAYS.prototype = Object.create( cBaseFunction.prototype );

function cDBCS() {
    cBaseFunction.call( this, "DBCS" );
    this.isXLFN = true;
}
cDBCS.prototype = Object.create( cBaseFunction.prototype );

function cDECIMAL() {
    cBaseFunction.call( this, "DECIMAL" );
    this.isXLFN = true;
}
cDECIMAL.prototype = Object.create( cBaseFunction.prototype );

function cERF_PRECISE() {
    cBaseFunction.call( this, "ERF.PRECISE" );
    this.isXLFN = true;
}
cERF_PRECISE.prototype = Object.create( cBaseFunction.prototype );

function cERFC_PRECISE() {
    cBaseFunction.call( this, "ERFC.PRECISE" );
    this.isXLFN = true;
}
cERFC_PRECISE.prototype = Object.create( cBaseFunction.prototype );

function cEXPON_DIST() {
    cBaseFunction.call( this, "EXPON.DIST" );
    this.isXLFN = true;
}
cEXPON_DIST.prototype = Object.create( cBaseFunction.prototype );

function cF_DIST() {
    cBaseFunction.call( this, "F.DIST" );
    this.isXLFN = true;
}
cF_DIST.prototype = Object.create( cBaseFunction.prototype );

function cF_DIST_RT() {
    cBaseFunction.call( this, "F.DIST.RT" );
    this.isXLFN = true;
}
cF_DIST_RT.prototype = Object.create( cBaseFunction.prototype );

function cF_INV() {
    cBaseFunction.call( this, "F.INV" );
    this.isXLFN = true;
}
cF_INV.prototype = Object.create( cBaseFunction.prototype );

function cF_INV_RT() {
    cBaseFunction.call( this, "F.INV.RT" );
    this.isXLFN = true;
}
cF_INV_RT.prototype = Object.create( cBaseFunction.prototype );

function cF_TEST() {
    cBaseFunction.call( this, "F.TEST" );
    this.isXLFN = true;
}
cF_TEST.prototype = Object.create( cBaseFunction.prototype );

function cFILTERXML() {
    cBaseFunction.call( this, "FILTERXML" );
    this.isXLFN = true;
}
cFILTERXML.prototype = Object.create( cBaseFunction.prototype );

function cFLOOR_MATH() {
    cBaseFunction.call( this, "FLOOR.MATH" );
    this.isXLFN = true;
}
cFLOOR_MATH.prototype = Object.create( cBaseFunction.prototype );

function cFLOOR_PRECISE() {
    cBaseFunction.call( this, "FLOOR.PRECISE" );
    this.isXLFN = true;
}
cFLOOR_PRECISE.prototype = Object.create( cBaseFunction.prototype );

function cFORECAST_ETS() {
    cBaseFunction.call( this, "FORECAST.ETS" );
    this.isXLFN = true;
}
cFORECAST_ETS.prototype = Object.create( cBaseFunction.prototype );

function cFORECAST_ETS_CONFINT() {
    cBaseFunction.call( this, "FORECAST.ETS.CONFINT" );
    this.isXLFN = true;
}
cFORECAST_ETS_CONFINT.prototype = Object.create( cBaseFunction.prototype );

function cFORECAST_ETS_SEASONALITY() {
    cBaseFunction.call( this, "FORECAST.ETS.SEASONALITY" );
    this.isXLFN = true;
}
cFORECAST_ETS_SEASONALITY.prototype = Object.create( cBaseFunction.prototype );

function cFORECAST_ETS_STAT() {
    cBaseFunction.call( this, "FORECAST.ETS.STAT" );
    this.isXLFN = true;
}
cFORECAST_ETS_STAT.prototype = Object.create( cBaseFunction.prototype );

function cFORECAST_LINEAR() {
    cBaseFunction.call( this, "FORECAST.LINEAR" );
    this.isXLFN = true;
}
cFORECAST_LINEAR.prototype = Object.create( cBaseFunction.prototype );

function cFORMULATEXT() {
    cBaseFunction.call( this, "FORMULATEXT" );
    this.isXLFN = true;
}
cFORMULATEXT.prototype = Object.create( cBaseFunction.prototype );

function cGAMMA() {
    cBaseFunction.call( this, "GAMMA" );
    this.isXLFN = true;
}
cGAMMA.prototype = Object.create( cBaseFunction.prototype );

function cGAMMA_DIST() {
    cBaseFunction.call( this, "GAMMA.DIST" );
    this.isXLFN = true;
}
cGAMMA_DIST.prototype = Object.create( cBaseFunction.prototype );

function cGAMMA_INV() {
    cBaseFunction.call( this, "GAMMA.INV" );
    this.isXLFN = true;
}
cGAMMA_INV.prototype = Object.create( cBaseFunction.prototype );

function cGAMMALN_PRECISE() {
    cBaseFunction.call( this, "GAMMALN.PRECISE" );
    this.isXLFN = true;
}
cGAMMALN_PRECISE.prototype = Object.create( cBaseFunction.prototype );

function cGAUSS() {
    cBaseFunction.call( this, "GAUSS" );
    this.isXLFN = true;
}
cGAUSS.prototype = Object.create( cBaseFunction.prototype );

function cHYPGEOM_DIST() {
    cBaseFunction.call( this, "HYPGEOM.DIST" );
    this.isXLFN = true;
}
cHYPGEOM_DIST.prototype = Object.create( cBaseFunction.prototype );

function cIFNA() {
    cBaseFunction.call( this, "IFNA" );
    this.isXLFN = true;
}
cIFNA.prototype = Object.create( cBaseFunction.prototype );

function cIMCOSH() {
    cBaseFunction.call( this, "IMCOSH" );
    this.isXLFN = true;
}
cIMCOSH.prototype = Object.create( cBaseFunction.prototype );

function cIMCOT() {
    cBaseFunction.call( this, "IMCOT" );
    this.isXLFN = true;
}
cIMCOT.prototype = Object.create( cBaseFunction.prototype );

function cIMCSC() {
    cBaseFunction.call( this, "IMCSC" );
    this.isXLFN = true;
}
cIMCSC.prototype = Object.create( cBaseFunction.prototype );

function cIMCSCH() {
    cBaseFunction.call( this, "IMCSCH" );
    this.isXLFN = true;
}
cIMCSCH.prototype = Object.create( cBaseFunction.prototype );

function cIMSEC() {
    cBaseFunction.call( this, "IMSEC" );
    this.isXLFN = true;
}
cIMSEC.prototype = Object.create( cBaseFunction.prototype );

function cIMSECH() {
    cBaseFunction.call( this, "IMSECH" );
    this.isXLFN = true;
}
cIMSECH.prototype = Object.create( cBaseFunction.prototype );

function cIMSINH() {
    cBaseFunction.call( this, "IMSINH" );
    this.isXLFN = true;
}
cIMSINH.prototype = Object.create( cBaseFunction.prototype );

function cIMTAN() {
    cBaseFunction.call( this, "IMTAN" );
    this.isXLFN = true;
}
cIMTAN.prototype = Object.create( cBaseFunction.prototype );

function cISFORMULA() {
    cBaseFunction.call( this, "ISFORMULA" );
    this.isXLFN = true;
}
cISFORMULA.prototype = Object.create( cBaseFunction.prototype );

function cISOWEEKNUM() {
    cBaseFunction.call( this, "ISOWEEKNUM" );
    this.isXLFN = true;
}
cISOWEEKNUM.prototype = Object.create( cBaseFunction.prototype );

function cLOGNORM_DIST() {
    cBaseFunction.call( this, "LOGNORM.DIST" );
    this.isXLFN = true;
}
cLOGNORM_DIST.prototype = Object.create( cBaseFunction.prototype );

function cLOGNORM_INV() {
    cBaseFunction.call( this, "LOGNORM.INV" );
    this.isXLFN = true;
}
cLOGNORM_INV.prototype = Object.create( cBaseFunction.prototype );

function cMODE_MULT() {
    cBaseFunction.call( this, "MODE.MULT" );
    this.isXLFN = true;
}
cMODE_MULT.prototype = Object.create( cBaseFunction.prototype );

function cMODE_SNGL() {
    cBaseFunction.call( this, "MODE.SNGL" );
    this.isXLFN = true;
}
cMODE_SNGL.prototype = Object.create( cBaseFunction.prototype );

function cMUNIT() {
    cBaseFunction.call( this, "MUNIT" );
    this.isXLFN = true;
}
cMUNIT.prototype = Object.create( cBaseFunction.prototype );

function cNEGBINOM_DIST() {
    cBaseFunction.call( this, "NEGBINOM.DIST" );
    this.isXLFN = true;
}
cNEGBINOM_DIST.prototype = Object.create( cBaseFunction.prototype );

function cNORM_DIST() {
    cBaseFunction.call( this, "NORM.DIST" );
    this.isXLFN = true;
}
cNORM_DIST.prototype = Object.create( cBaseFunction.prototype );

function cNORM_INV() {
    cBaseFunction.call( this, "NORM.INV" );
    this.isXLFN = true;
}
cNORM_INV.prototype = Object.create( cBaseFunction.prototype );

function cNORM_S_DIST() {
    cBaseFunction.call( this, "NORM.S.DIST" );
    this.isXLFN = true;
}
cNORM_S_DIST.prototype = Object.create( cBaseFunction.prototype );

function cNORM_S_INV() {
    cBaseFunction.call( this, "NORM.S.INV" );
    this.isXLFN = true;
}
cNORM_S_INV.prototype = Object.create( cBaseFunction.prototype );

function cNUMBERVALUE() {
    cBaseFunction.call( this, "NUMBERVALUE" );
    this.isXLFN = true;
}
cNUMBERVALUE.prototype = Object.create( cBaseFunction.prototype );

function cPDURATION() {
    cBaseFunction.call( this, "PDURATION" );
    this.isXLFN = true;
}
cPDURATION.prototype = Object.create( cBaseFunction.prototype );

function cPERCENTILE_EXC() {
    cBaseFunction.call( this, "PERCENTILE.EXC" );
    this.isXLFN = true;
}
cPERCENTILE_EXC.prototype = Object.create( cBaseFunction.prototype );

function cPERCENTILE_INC() {
    cBaseFunction.call( this, "PERCENTILE.INC" );
    this.isXLFN = true;
}
cPERCENTILE_INC.prototype = Object.create( cBaseFunction.prototype );

function cPERCENTRANK_EXC() {
    cBaseFunction.call( this, "PERCENTRANK.EXC" );
    this.isXLFN = true;
}
cPERCENTRANK_EXC.prototype = Object.create( cBaseFunction.prototype );

function cPERCENTRANK_INC() {
    cBaseFunction.call( this, "PERCENTRANK.INC" );
    this.isXLFN = true;
}
cPERCENTRANK_INC.prototype = Object.create( cBaseFunction.prototype );

function cPERMUTATIONA() {
    cBaseFunction.call( this, "PERMUTATIONA" );
    this.isXLFN = true;
}
cPERMUTATIONA.prototype = Object.create( cBaseFunction.prototype );

function cPHI() {
    cBaseFunction.call( this, "PHI" );
    this.isXLFN = true;
}
cPHI.prototype = Object.create( cBaseFunction.prototype );

function cPOISSON_DIST() {
    cBaseFunction.call( this, "POISSON.DIST" );
    this.isXLFN = true;
}
cPOISSON_DIST.prototype = Object.create( cBaseFunction.prototype );

function cQUARTILE_EXC() {
    cBaseFunction.call( this, "QUARTILE.EXC" );
    this.isXLFN = true;
}
cQUARTILE_EXC.prototype = Object.create( cBaseFunction.prototype );

function cQUARTILE_INC() {
    cBaseFunction.call( this, "QUARTILE.INC" );
    this.isXLFN = true;
}
cQUARTILE_INC.prototype = Object.create( cBaseFunction.prototype );

function cQUERYSTRING() {
    cBaseFunction.call( this, "QUERYSTRING" );
    this.isXLFN = true;
}
cQUERYSTRING.prototype = Object.create( cBaseFunction.prototype );

function cRANK_AVG() {
    cBaseFunction.call( this, "RANK.AVG" );
    this.isXLFN = true;
}
cRANK_AVG.prototype = Object.create( cBaseFunction.prototype );

function cRANK_EQ() {
    cBaseFunction.call( this, "RANK.EQ" );
    this.isXLFN = true;
}
cRANK_EQ.prototype = Object.create( cBaseFunction.prototype );

function cRRI() {
    cBaseFunction.call( this, "RRI" );
    this.isXLFN = true;
}
cRRI.prototype = Object.create( cBaseFunction.prototype );

function cSEC() {
    cBaseFunction.call( this, "SEC" );
    this.isXLFN = true;
}
cSEC.prototype = Object.create( cBaseFunction.prototype );

function cSECH() {
    cBaseFunction.call( this, "SECH" );
    this.isXLFN = true;
}
cSECH.prototype = Object.create( cBaseFunction.prototype );

function cSHEET() {
    cBaseFunction.call( this, "SHEET" );
    this.isXLFN = true;
}
cSHEET.prototype = Object.create( cBaseFunction.prototype );

function cSHEETS() {
    cBaseFunction.call( this, "SHEETS" );
    this.isXLFN = true;
}
cSHEETS.prototype = Object.create( cBaseFunction.prototype );

function cSKEW_P() {
    cBaseFunction.call( this, "SKEW.P" );
    this.isXLFN = true;
}
cSKEW_P.prototype = Object.create( cBaseFunction.prototype );

function cSTDEV_P() {
    cBaseFunction.call( this, "STDEV.P" );
    this.isXLFN = true;
}
cSTDEV_P.prototype = Object.create( cBaseFunction.prototype );

function cSTDEV_S() {
    cBaseFunction.call( this, "STDEV.S" );
    this.isXLFN = true;
}
cSTDEV_S.prototype = Object.create( cBaseFunction.prototype );

function cT_DIST() {
    cBaseFunction.call( this, "T.DIST" );
    this.isXLFN = true;
}
cT_DIST.prototype = Object.create( cBaseFunction.prototype );

function cT_DIST_2T() {
    cBaseFunction.call( this, "T.DIST.2T" );
    this.isXLFN = true;
}
cT_DIST_2T.prototype = Object.create( cBaseFunction.prototype );

function cT_DIST_RT() {
    cBaseFunction.call( this, "T.DIST.RT" );
    this.isXLFN = true;
}
cT_DIST_RT.prototype = Object.create( cBaseFunction.prototype );

function cT_INV() {
    cBaseFunction.call( this, "T.INV" );
    this.isXLFN = true;
}
cT_INV.prototype = Object.create( cBaseFunction.prototype );

function cT_INV_2T() {
    cBaseFunction.call( this, "T.INV.2T" );
    this.isXLFN = true;
}
cT_INV_2T.prototype = Object.create( cBaseFunction.prototype );

function cT_TEST() {
    cBaseFunction.call( this, "T.TEST" );
    this.isXLFN = true;
}
cT_TEST.prototype = Object.create( cBaseFunction.prototype );

function cUNICHAR() {
    cBaseFunction.call( this, "UNICHAR" );
    this.isXLFN = true;
}
cUNICHAR.prototype = Object.create( cBaseFunction.prototype );

function cUNICODE() {
    cBaseFunction.call( this, "UNICODE" );
    this.isXLFN = true;
}
cUNICODE.prototype = Object.create( cBaseFunction.prototype );

function cVAR_P() {
    cBaseFunction.call( this, "VAR.P" );
    this.isXLFN = true;
}
cVAR_P.prototype = Object.create( cBaseFunction.prototype );

function cVAR_S() {
    cBaseFunction.call( this, "VAR.S" );
    this.isXLFN = true;
}
cVAR_S.prototype = Object.create( cBaseFunction.prototype );

function cWEBSERVICE() {
    cBaseFunction.call( this, "WEBSERVICE" );
    this.isXLFN = true;
}
cWEBSERVICE.prototype = Object.create( cBaseFunction.prototype );

function cWEIBULL_DIST() {
    cBaseFunction.call( this, "WEIBULL.DIST" );
    this.isXLFN = true;
}
cWEIBULL_DIST.prototype = Object.create( cBaseFunction.prototype );

function cXOR() {
    cBaseFunction.call( this, "XOR" );
    this.isXLFN = true;
}
cXOR.prototype = Object.create( cBaseFunction.prototype );

function cZ_TEST() {
    cBaseFunction.call( this, "Z.TEST" );
    this.isXLFN = true;
}
cZ_TEST.prototype = Object.create( cBaseFunction.prototype );
})(window);
