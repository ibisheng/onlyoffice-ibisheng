"use strict";
//Generated code
function getBoolFromXml(val) {
	return "0" !== val && "false" !== val && "off" !== val;
}
var st_sourcetypeWORKSHEET = 0;
var st_sourcetypeEXTERNAL = 1;
var st_sourcetypeCONSOLIDATION = 2;
var st_sourcetypeSCENARIO = 3;

var st_axisAXISROW = 0;
var st_axisAXISCOL = 1;
var st_axisAXISPAGE = 2;
var st_axisAXISVALUES = 3;

var st_fieldsorttypeMANUAL = 0;
var st_fieldsorttypeASCENDING = 1;
var st_fieldsorttypeDESCENDING = 2;

var st_itemtypeDATA = 0;
var st_itemtypeDEFAULT = 1;
var st_itemtypeSUM = 2;
var st_itemtypeCOUNTA = 3;
var st_itemtypeAVG = 4;
var st_itemtypeMAX = 5;
var st_itemtypeMIN = 6;
var st_itemtypePRODUCT = 7;
var st_itemtypeCOUNT = 8;
var st_itemtypeSTDDEV = 9;
var st_itemtypeSTDDEVP = 10;
var st_itemtypeVAR = 11;
var st_itemtypeVARP = 12;
var st_itemtypeGRAND = 13;
var st_itemtypeBLANK = 14;

var st_dataconsolidatefunctionAVERAGE = 0;
var st_dataconsolidatefunctionCOUNT = 1;
var st_dataconsolidatefunctionCOUNTNUMS = 2;
var st_dataconsolidatefunctionMAX = 3;
var st_dataconsolidatefunctionMIN = 4;
var st_dataconsolidatefunctionPRODUCT = 5;
var st_dataconsolidatefunctionSTDDEV = 6;
var st_dataconsolidatefunctionSTDDEVP = 7;
var st_dataconsolidatefunctionSUM = 8;
var st_dataconsolidatefunctionVAR = 9;
var st_dataconsolidatefunctionVARP = 10;

var st_showdataasNORMAL = 0;
var st_showdataasDIFFERENCE = 1;
var st_showdataasPERCENT = 2;
var st_showdataasPERCENTDIFF = 3;
var st_showdataasRUNTOTAL = 4;
var st_showdataasPERCENTOFROW = 5;
var st_showdataasPERCENTOFCOL = 6;
var st_showdataasPERCENTOFTOTAL = 7;
var st_showdataasINDEX = 8;

var st_formatactionBLANK = 0;
var st_formatactionFORMATTING = 1;
var st_formatactionDRILL = 2;
var st_formatactionFORMULA = 3;

var st_scopeSELECTION = 0;
var st_scopeDATA = 1;
var st_scopeFIELD = 2;

var st_typeNONE = 0;
var st_typeALL = 1;
var st_typeROW = 2;
var st_typeCOLUMN = 3;

var st_pivotfiltertypeUNKNOWN = 0;
var st_pivotfiltertypeCOUNT = 1;
var st_pivotfiltertypePERCENT = 2;
var st_pivotfiltertypeSUM = 3;
var st_pivotfiltertypeCAPTIONEQUAL = 4;
var st_pivotfiltertypeCAPTIONNOTEQUAL = 5;
var st_pivotfiltertypeCAPTIONBEGINSWITH = 6;
var st_pivotfiltertypeCAPTIONNOTBEGINSWITH = 7;
var st_pivotfiltertypeCAPTIONENDSWITH = 8;
var st_pivotfiltertypeCAPTIONNOTENDSWITH = 9;
var st_pivotfiltertypeCAPTIONCONTAINS = 10;
var st_pivotfiltertypeCAPTIONNOTCONTAINS = 11;
var st_pivotfiltertypeCAPTIONGREATERTHAN = 12;
var st_pivotfiltertypeCAPTIONGREATERTHANOREQUAL = 13;
var st_pivotfiltertypeCAPTIONLESSTHAN = 14;
var st_pivotfiltertypeCAPTIONLESSTHANOREQUAL = 15;
var st_pivotfiltertypeCAPTIONBETWEEN = 16;
var st_pivotfiltertypeCAPTIONNOTBETWEEN = 17;
var st_pivotfiltertypeVALUEEQUAL = 18;
var st_pivotfiltertypeVALUENOTEQUAL = 19;
var st_pivotfiltertypeVALUEGREATERTHAN = 20;
var st_pivotfiltertypeVALUEGREATERTHANOREQUAL = 21;
var st_pivotfiltertypeVALUELESSTHAN = 22;
var st_pivotfiltertypeVALUELESSTHANOREQUAL = 23;
var st_pivotfiltertypeVALUEBETWEEN = 24;
var st_pivotfiltertypeVALUENOTBETWEEN = 25;
var st_pivotfiltertypeDATEEQUAL = 26;
var st_pivotfiltertypeDATENOTEQUAL = 27;
var st_pivotfiltertypeDATEOLDERTHAN = 28;
var st_pivotfiltertypeDATEOLDERTHANOREQUAL = 29;
var st_pivotfiltertypeDATENEWERTHAN = 30;
var st_pivotfiltertypeDATENEWERTHANOREQUAL = 31;
var st_pivotfiltertypeDATEBETWEEN = 32;
var st_pivotfiltertypeDATENOTBETWEEN = 33;
var st_pivotfiltertypeTOMORROW = 34;
var st_pivotfiltertypeTODAY = 35;
var st_pivotfiltertypeYESTERDAY = 36;
var st_pivotfiltertypeNEXTWEEK = 37;
var st_pivotfiltertypeTHISWEEK = 38;
var st_pivotfiltertypeLASTWEEK = 39;
var st_pivotfiltertypeNEXTMONTH = 40;
var st_pivotfiltertypeTHISMONTH = 41;
var st_pivotfiltertypeLASTMONTH = 42;
var st_pivotfiltertypeNEXTQUARTER = 43;
var st_pivotfiltertypeTHISQUARTER = 44;
var st_pivotfiltertypeLASTQUARTER = 45;
var st_pivotfiltertypeNEXTYEAR = 46;
var st_pivotfiltertypeTHISYEAR = 47;
var st_pivotfiltertypeLASTYEAR = 48;
var st_pivotfiltertypeYEARTODATE = 49;
var st_pivotfiltertypeQ1 = 50;
var st_pivotfiltertypeQ2 = 51;
var st_pivotfiltertypeQ3 = 52;
var st_pivotfiltertypeQ4 = 53;
var st_pivotfiltertypeM1 = 54;
var st_pivotfiltertypeM2 = 55;
var st_pivotfiltertypeM3 = 56;
var st_pivotfiltertypeM4 = 57;
var st_pivotfiltertypeM5 = 58;
var st_pivotfiltertypeM6 = 59;
var st_pivotfiltertypeM7 = 60;
var st_pivotfiltertypeM8 = 61;
var st_pivotfiltertypeM9 = 62;
var st_pivotfiltertypeM10 = 63;
var st_pivotfiltertypeM11 = 64;
var st_pivotfiltertypeM12 = 65;

var st_sorttypeNONE = 0;
var st_sorttypeASCENDING = 1;
var st_sorttypeDESCENDING = 2;
var st_sorttypeASCENDINGALPHA = 3;
var st_sorttypeDESCENDINGALPHA = 4;
var st_sorttypeASCENDINGNATURAL = 5;
var st_sorttypeDESCENDINGNATURAL = 6;

var st_pivotareatypeNONE = 0;
var st_pivotareatypeNORMAL = 1;
var st_pivotareatypeDATA = 2;
var st_pivotareatypeALL = 3;
var st_pivotareatypeORIGIN = 4;
var st_pivotareatypeBUTTON = 5;
var st_pivotareatypeTOPEND = 6;

var st_groupbyRANGE = 0;
var st_groupbySECONDS = 1;
var st_groupbyMINUTES = 2;
var st_groupbyHOURS = 3;
var st_groupbyDAYS = 4;
var st_groupbyMONTHS = 5;
var st_groupbyQUARTERS = 6;
var st_groupbyYEARS = 7;

var st_sortmethodSTROKE = 0;
var st_sortmethodPINYIN = 1;
var st_sortmethodNONE = 2;

var st_dynamicfiltertypeNULL = 0;
var st_dynamicfiltertypeABOVEAVERAGE = 1;
var st_dynamicfiltertypeBELOWAVERAGE = 2;
var st_dynamicfiltertypeTOMORROW = 3;
var st_dynamicfiltertypeTODAY = 4;
var st_dynamicfiltertypeYESTERDAY = 5;
var st_dynamicfiltertypeNEXTWEEK = 6;
var st_dynamicfiltertypeTHISWEEK = 7;
var st_dynamicfiltertypeLASTWEEK = 8;
var st_dynamicfiltertypeNEXTMONTH = 9;
var st_dynamicfiltertypeTHISMONTH = 10;
var st_dynamicfiltertypeLASTMONTH = 11;
var st_dynamicfiltertypeNEXTQUARTER = 12;
var st_dynamicfiltertypeTHISQUARTER = 13;
var st_dynamicfiltertypeLASTQUARTER = 14;
var st_dynamicfiltertypeNEXTYEAR = 15;
var st_dynamicfiltertypeTHISYEAR = 16;
var st_dynamicfiltertypeLASTYEAR = 17;
var st_dynamicfiltertypeYEARTODATE = 18;
var st_dynamicfiltertypeQ1 = 19;
var st_dynamicfiltertypeQ2 = 20;
var st_dynamicfiltertypeQ3 = 21;
var st_dynamicfiltertypeQ4 = 22;
var st_dynamicfiltertypeM1 = 23;
var st_dynamicfiltertypeM2 = 24;
var st_dynamicfiltertypeM3 = 25;
var st_dynamicfiltertypeM4 = 26;
var st_dynamicfiltertypeM5 = 27;
var st_dynamicfiltertypeM6 = 28;
var st_dynamicfiltertypeM7 = 29;
var st_dynamicfiltertypeM8 = 30;
var st_dynamicfiltertypeM9 = 31;
var st_dynamicfiltertypeM10 = 32;
var st_dynamicfiltertypeM11 = 33;
var st_dynamicfiltertypeM12 = 34;

var st_calendartypeGREGORIAN = 0;
var st_calendartypeGREGORIANUS = 1;
var st_calendartypeGREGORIANMEFRENCH = 2;
var st_calendartypeGREGORIANARABIC = 3;
var st_calendartypeHIJRI = 4;
var st_calendartypeHEBREW = 5;
var st_calendartypeTAIWAN = 6;
var st_calendartypeJAPAN = 7;
var st_calendartypeTHAI = 8;
var st_calendartypeKOREA = 9;
var st_calendartypeSAKA = 10;
var st_calendartypeGREGORIANXLITENGLISH = 11;
var st_calendartypeGREGORIANXLITFRENCH = 12;
var st_calendartypeNONE = 13;

var st_iconsettype3ARROWS = 0;
var st_iconsettype3ARROWSGRAY = 1;
var st_iconsettype3FLAGS = 2;
var st_iconsettype3TRAFFICLIGHTS1 = 3;
var st_iconsettype3TRAFFICLIGHTS2 = 4;
var st_iconsettype3SIGNS = 5;
var st_iconsettype3SYMBOLS = 6;
var st_iconsettype3SYMBOLS2 = 7;
var st_iconsettype4ARROWS = 8;
var st_iconsettype4ARROWSGRAY = 9;
var st_iconsettype4REDTOBLACK = 10;
var st_iconsettype4RATING = 11;
var st_iconsettype4TRAFFICLIGHTS = 12;
var st_iconsettype5ARROWS = 13;
var st_iconsettype5ARROWSGRAY = 14;
var st_iconsettype5RATING = 15;
var st_iconsettype5QUARTERS = 16;

var st_sortbyVALUE = 0;
var st_sortbyCELLCOLOR = 1;
var st_sortbyFONTCOLOR = 2;
var st_sortbyICON = 3;

var st_filteroperatorEQUAL = 0;
var st_filteroperatorLESSTHAN = 1;
var st_filteroperatorLESSTHANOREQUAL = 2;
var st_filteroperatorNOTEQUAL = 3;
var st_filteroperatorGREATERTHANOREQUAL = 4;
var st_filteroperatorGREATERTHAN = 5;

var st_datetimegroupingYEAR = 0;
var st_datetimegroupingMONTH = 1;
var st_datetimegroupingDAY = 2;
var st_datetimegroupingHOUR = 3;
var st_datetimegroupingMINUTE = 4;
var st_datetimegroupingSECOND = 5;

function FromXml_ST_SourceType(val) {
	var res = -1;
	if ("worksheet" === val) {
		res = st_sourcetypeWORKSHEET;
	} else if ("external" === val) {
		res = st_sourcetypeEXTERNAL;
	} else if ("consolidation" === val) {
		res = st_sourcetypeCONSOLIDATION;
	} else if ("scenario" === val) {
		res = st_sourcetypeSCENARIO;
	}
	return res;
}

function FromXml_ST_Axis(val) {
	var res = -1;
	if ("axisRow" === val) {
		res = st_axisAXISROW;
	} else if ("axisCol" === val) {
		res = st_axisAXISCOL;
	} else if ("axisPage" === val) {
		res = st_axisAXISPAGE;
	} else if ("axisValues" === val) {
		res = st_axisAXISVALUES;
	}
	return res;
}

function FromXml_ST_FieldSortType(val) {
	var res = -1;
	if ("manual" === val) {
		res = st_fieldsorttypeMANUAL;
	} else if ("ascending" === val) {
		res = st_fieldsorttypeASCENDING;
	} else if ("descending" === val) {
		res = st_fieldsorttypeDESCENDING;
	}
	return res;
}

function FromXml_ST_ItemType(val) {
	var res = -1;
	if ("data" === val) {
		res = st_itemtypeDATA;
	} else if ("default" === val) {
		res = st_itemtypeDEFAULT;
	} else if ("sum" === val) {
		res = st_itemtypeSUM;
	} else if ("countA" === val) {
		res = st_itemtypeCOUNTA;
	} else if ("avg" === val) {
		res = st_itemtypeAVG;
	} else if ("max" === val) {
		res = st_itemtypeMAX;
	} else if ("min" === val) {
		res = st_itemtypeMIN;
	} else if ("product" === val) {
		res = st_itemtypePRODUCT;
	} else if ("count" === val) {
		res = st_itemtypeCOUNT;
	} else if ("stdDev" === val) {
		res = st_itemtypeSTDDEV;
	} else if ("stdDevP" === val) {
		res = st_itemtypeSTDDEVP;
	} else if ("var" === val) {
		res = st_itemtypeVAR;
	} else if ("varP" === val) {
		res = st_itemtypeVARP;
	} else if ("grand" === val) {
		res = st_itemtypeGRAND;
	} else if ("blank" === val) {
		res = st_itemtypeBLANK;
	}
	return res;
}

function FromXml_ST_DataConsolidateFunction(val) {
	var res = -1;
	if ("average" === val) {
		res = st_dataconsolidatefunctionAVERAGE;
	} else if ("count" === val) {
		res = st_dataconsolidatefunctionCOUNT;
	} else if ("countNums" === val) {
		res = st_dataconsolidatefunctionCOUNTNUMS;
	} else if ("max" === val) {
		res = st_dataconsolidatefunctionMAX;
	} else if ("min" === val) {
		res = st_dataconsolidatefunctionMIN;
	} else if ("product" === val) {
		res = st_dataconsolidatefunctionPRODUCT;
	} else if ("stdDev" === val) {
		res = st_dataconsolidatefunctionSTDDEV;
	} else if ("stdDevp" === val) {
		res = st_dataconsolidatefunctionSTDDEVP;
	} else if ("sum" === val) {
		res = st_dataconsolidatefunctionSUM;
	} else if ("var" === val) {
		res = st_dataconsolidatefunctionVAR;
	} else if ("varp" === val) {
		res = st_dataconsolidatefunctionVARP;
	}
	return res;
}

function FromXml_ST_ShowDataAs(val) {
	var res = -1;
	if ("normal" === val) {
		res = st_showdataasNORMAL;
	} else if ("difference" === val) {
		res = st_showdataasDIFFERENCE;
	} else if ("percent" === val) {
		res = st_showdataasPERCENT;
	} else if ("percentDiff" === val) {
		res = st_showdataasPERCENTDIFF;
	} else if ("runTotal" === val) {
		res = st_showdataasRUNTOTAL;
	} else if ("percentOfRow" === val) {
		res = st_showdataasPERCENTOFROW;
	} else if ("percentOfCol" === val) {
		res = st_showdataasPERCENTOFCOL;
	} else if ("percentOfTotal" === val) {
		res = st_showdataasPERCENTOFTOTAL;
	} else if ("index" === val) {
		res = st_showdataasINDEX;
	}
	return res;
}

function FromXml_ST_FormatAction(val) {
	var res = -1;
	if ("blank" === val) {
		res = st_formatactionBLANK;
	} else if ("formatting" === val) {
		res = st_formatactionFORMATTING;
	} else if ("drill" === val) {
		res = st_formatactionDRILL;
	} else if ("formula" === val) {
		res = st_formatactionFORMULA;
	}
	return res;
}

function FromXml_ST_Scope(val) {
	var res = -1;
	if ("selection" === val) {
		res = st_scopeSELECTION;
	} else if ("data" === val) {
		res = st_scopeDATA;
	} else if ("field" === val) {
		res = st_scopeFIELD;
	}
	return res;
}

function FromXml_ST_Type(val) {
	var res = -1;
	if ("none" === val) {
		res = st_typeNONE;
	} else if ("all" === val) {
		res = st_typeALL;
	} else if ("row" === val) {
		res = st_typeROW;
	} else if ("column" === val) {
		res = st_typeCOLUMN;
	}
	return res;
}

function FromXml_ST_PivotFilterType(val) {
	var res = -1;
	if ("unknown" === val) {
		res = st_pivotfiltertypeUNKNOWN;
	} else if ("count" === val) {
		res = st_pivotfiltertypeCOUNT;
	} else if ("percent" === val) {
		res = st_pivotfiltertypePERCENT;
	} else if ("sum" === val) {
		res = st_pivotfiltertypeSUM;
	} else if ("captionEqual" === val) {
		res = st_pivotfiltertypeCAPTIONEQUAL;
	} else if ("captionNotEqual" === val) {
		res = st_pivotfiltertypeCAPTIONNOTEQUAL;
	} else if ("captionBeginsWith" === val) {
		res = st_pivotfiltertypeCAPTIONBEGINSWITH;
	} else if ("captionNotBeginsWith" === val) {
		res = st_pivotfiltertypeCAPTIONNOTBEGINSWITH;
	} else if ("captionEndsWith" === val) {
		res = st_pivotfiltertypeCAPTIONENDSWITH;
	} else if ("captionNotEndsWith" === val) {
		res = st_pivotfiltertypeCAPTIONNOTENDSWITH;
	} else if ("captionContains" === val) {
		res = st_pivotfiltertypeCAPTIONCONTAINS;
	} else if ("captionNotContains" === val) {
		res = st_pivotfiltertypeCAPTIONNOTCONTAINS;
	} else if ("captionGreaterThan" === val) {
		res = st_pivotfiltertypeCAPTIONGREATERTHAN;
	} else if ("captionGreaterThanOrEqual" === val) {
		res = st_pivotfiltertypeCAPTIONGREATERTHANOREQUAL;
	} else if ("captionLessThan" === val) {
		res = st_pivotfiltertypeCAPTIONLESSTHAN;
	} else if ("captionLessThanOrEqual" === val) {
		res = st_pivotfiltertypeCAPTIONLESSTHANOREQUAL;
	} else if ("captionBetween" === val) {
		res = st_pivotfiltertypeCAPTIONBETWEEN;
	} else if ("captionNotBetween" === val) {
		res = st_pivotfiltertypeCAPTIONNOTBETWEEN;
	} else if ("valueEqual" === val) {
		res = st_pivotfiltertypeVALUEEQUAL;
	} else if ("valueNotEqual" === val) {
		res = st_pivotfiltertypeVALUENOTEQUAL;
	} else if ("valueGreaterThan" === val) {
		res = st_pivotfiltertypeVALUEGREATERTHAN;
	} else if ("valueGreaterThanOrEqual" === val) {
		res = st_pivotfiltertypeVALUEGREATERTHANOREQUAL;
	} else if ("valueLessThan" === val) {
		res = st_pivotfiltertypeVALUELESSTHAN;
	} else if ("valueLessThanOrEqual" === val) {
		res = st_pivotfiltertypeVALUELESSTHANOREQUAL;
	} else if ("valueBetween" === val) {
		res = st_pivotfiltertypeVALUEBETWEEN;
	} else if ("valueNotBetween" === val) {
		res = st_pivotfiltertypeVALUENOTBETWEEN;
	} else if ("dateEqual" === val) {
		res = st_pivotfiltertypeDATEEQUAL;
	} else if ("dateNotEqual" === val) {
		res = st_pivotfiltertypeDATENOTEQUAL;
	} else if ("dateOlderThan" === val) {
		res = st_pivotfiltertypeDATEOLDERTHAN;
	} else if ("dateOlderThanOrEqual" === val) {
		res = st_pivotfiltertypeDATEOLDERTHANOREQUAL;
	} else if ("dateNewerThan" === val) {
		res = st_pivotfiltertypeDATENEWERTHAN;
	} else if ("dateNewerThanOrEqual" === val) {
		res = st_pivotfiltertypeDATENEWERTHANOREQUAL;
	} else if ("dateBetween" === val) {
		res = st_pivotfiltertypeDATEBETWEEN;
	} else if ("dateNotBetween" === val) {
		res = st_pivotfiltertypeDATENOTBETWEEN;
	} else if ("tomorrow" === val) {
		res = st_pivotfiltertypeTOMORROW;
	} else if ("today" === val) {
		res = st_pivotfiltertypeTODAY;
	} else if ("yesterday" === val) {
		res = st_pivotfiltertypeYESTERDAY;
	} else if ("nextWeek" === val) {
		res = st_pivotfiltertypeNEXTWEEK;
	} else if ("thisWeek" === val) {
		res = st_pivotfiltertypeTHISWEEK;
	} else if ("lastWeek" === val) {
		res = st_pivotfiltertypeLASTWEEK;
	} else if ("nextMonth" === val) {
		res = st_pivotfiltertypeNEXTMONTH;
	} else if ("thisMonth" === val) {
		res = st_pivotfiltertypeTHISMONTH;
	} else if ("lastMonth" === val) {
		res = st_pivotfiltertypeLASTMONTH;
	} else if ("nextQuarter" === val) {
		res = st_pivotfiltertypeNEXTQUARTER;
	} else if ("thisQuarter" === val) {
		res = st_pivotfiltertypeTHISQUARTER;
	} else if ("lastQuarter" === val) {
		res = st_pivotfiltertypeLASTQUARTER;
	} else if ("nextYear" === val) {
		res = st_pivotfiltertypeNEXTYEAR;
	} else if ("thisYear" === val) {
		res = st_pivotfiltertypeTHISYEAR;
	} else if ("lastYear" === val) {
		res = st_pivotfiltertypeLASTYEAR;
	} else if ("yearToDate" === val) {
		res = st_pivotfiltertypeYEARTODATE;
	} else if ("Q1" === val) {
		res = st_pivotfiltertypeQ1;
	} else if ("Q2" === val) {
		res = st_pivotfiltertypeQ2;
	} else if ("Q3" === val) {
		res = st_pivotfiltertypeQ3;
	} else if ("Q4" === val) {
		res = st_pivotfiltertypeQ4;
	} else if ("M1" === val) {
		res = st_pivotfiltertypeM1;
	} else if ("M2" === val) {
		res = st_pivotfiltertypeM2;
	} else if ("M3" === val) {
		res = st_pivotfiltertypeM3;
	} else if ("M4" === val) {
		res = st_pivotfiltertypeM4;
	} else if ("M5" === val) {
		res = st_pivotfiltertypeM5;
	} else if ("M6" === val) {
		res = st_pivotfiltertypeM6;
	} else if ("M7" === val) {
		res = st_pivotfiltertypeM7;
	} else if ("M8" === val) {
		res = st_pivotfiltertypeM8;
	} else if ("M9" === val) {
		res = st_pivotfiltertypeM9;
	} else if ("M10" === val) {
		res = st_pivotfiltertypeM10;
	} else if ("M11" === val) {
		res = st_pivotfiltertypeM11;
	} else if ("M12" === val) {
		res = st_pivotfiltertypeM12;
	}
	return res;
}

function FromXml_ST_SortType(val) {
	var res = -1;
	if ("none" === val) {
		res = st_sorttypeNONE;
	} else if ("ascending" === val) {
		res = st_sorttypeASCENDING;
	} else if ("descending" === val) {
		res = st_sorttypeDESCENDING;
	} else if ("ascendingAlpha" === val) {
		res = st_sorttypeASCENDINGALPHA;
	} else if ("descendingAlpha" === val) {
		res = st_sorttypeDESCENDINGALPHA;
	} else if ("ascendingNatural" === val) {
		res = st_sorttypeASCENDINGNATURAL;
	} else if ("descendingNatural" === val) {
		res = st_sorttypeDESCENDINGNATURAL;
	}
	return res;
}

function FromXml_ST_PivotAreaType(val) {
	var res = -1;
	if ("none" === val) {
		res = st_pivotareatypeNONE;
	} else if ("normal" === val) {
		res = st_pivotareatypeNORMAL;
	} else if ("data" === val) {
		res = st_pivotareatypeDATA;
	} else if ("all" === val) {
		res = st_pivotareatypeALL;
	} else if ("origin" === val) {
		res = st_pivotareatypeORIGIN;
	} else if ("button" === val) {
		res = st_pivotareatypeBUTTON;
	} else if ("topEnd" === val) {
		res = st_pivotareatypeTOPEND;
	}
	return res;
}

function FromXml_ST_GroupBy(val) {
	var res = -1;
	if ("range" === val) {
		res = st_groupbyRANGE;
	} else if ("seconds" === val) {
		res = st_groupbySECONDS;
	} else if ("minutes" === val) {
		res = st_groupbyMINUTES;
	} else if ("hours" === val) {
		res = st_groupbyHOURS;
	} else if ("days" === val) {
		res = st_groupbyDAYS;
	} else if ("months" === val) {
		res = st_groupbyMONTHS;
	} else if ("quarters" === val) {
		res = st_groupbyQUARTERS;
	} else if ("years" === val) {
		res = st_groupbyYEARS;
	}
	return res;
}

function FromXml_ST_SortMethod(val) {
	var res = -1;
	if ("stroke" === val) {
		res = st_sortmethodSTROKE;
	} else if ("pinYin" === val) {
		res = st_sortmethodPINYIN;
	} else if ("none" === val) {
		res = st_sortmethodNONE;
	}
	return res;
}

function FromXml_ST_DynamicFilterType(val) {
	var res = -1;
	if ("null" === val) {
		res = st_dynamicfiltertypeNULL;
	} else if ("aboveAverage" === val) {
		res = st_dynamicfiltertypeABOVEAVERAGE;
	} else if ("belowAverage" === val) {
		res = st_dynamicfiltertypeBELOWAVERAGE;
	} else if ("tomorrow" === val) {
		res = st_dynamicfiltertypeTOMORROW;
	} else if ("today" === val) {
		res = st_dynamicfiltertypeTODAY;
	} else if ("yesterday" === val) {
		res = st_dynamicfiltertypeYESTERDAY;
	} else if ("nextWeek" === val) {
		res = st_dynamicfiltertypeNEXTWEEK;
	} else if ("thisWeek" === val) {
		res = st_dynamicfiltertypeTHISWEEK;
	} else if ("lastWeek" === val) {
		res = st_dynamicfiltertypeLASTWEEK;
	} else if ("nextMonth" === val) {
		res = st_dynamicfiltertypeNEXTMONTH;
	} else if ("thisMonth" === val) {
		res = st_dynamicfiltertypeTHISMONTH;
	} else if ("lastMonth" === val) {
		res = st_dynamicfiltertypeLASTMONTH;
	} else if ("nextQuarter" === val) {
		res = st_dynamicfiltertypeNEXTQUARTER;
	} else if ("thisQuarter" === val) {
		res = st_dynamicfiltertypeTHISQUARTER;
	} else if ("lastQuarter" === val) {
		res = st_dynamicfiltertypeLASTQUARTER;
	} else if ("nextYear" === val) {
		res = st_dynamicfiltertypeNEXTYEAR;
	} else if ("thisYear" === val) {
		res = st_dynamicfiltertypeTHISYEAR;
	} else if ("lastYear" === val) {
		res = st_dynamicfiltertypeLASTYEAR;
	} else if ("yearToDate" === val) {
		res = st_dynamicfiltertypeYEARTODATE;
	} else if ("Q1" === val) {
		res = st_dynamicfiltertypeQ1;
	} else if ("Q2" === val) {
		res = st_dynamicfiltertypeQ2;
	} else if ("Q3" === val) {
		res = st_dynamicfiltertypeQ3;
	} else if ("Q4" === val) {
		res = st_dynamicfiltertypeQ4;
	} else if ("M1" === val) {
		res = st_dynamicfiltertypeM1;
	} else if ("M2" === val) {
		res = st_dynamicfiltertypeM2;
	} else if ("M3" === val) {
		res = st_dynamicfiltertypeM3;
	} else if ("M4" === val) {
		res = st_dynamicfiltertypeM4;
	} else if ("M5" === val) {
		res = st_dynamicfiltertypeM5;
	} else if ("M6" === val) {
		res = st_dynamicfiltertypeM6;
	} else if ("M7" === val) {
		res = st_dynamicfiltertypeM7;
	} else if ("M8" === val) {
		res = st_dynamicfiltertypeM8;
	} else if ("M9" === val) {
		res = st_dynamicfiltertypeM9;
	} else if ("M10" === val) {
		res = st_dynamicfiltertypeM10;
	} else if ("M11" === val) {
		res = st_dynamicfiltertypeM11;
	} else if ("M12" === val) {
		res = st_dynamicfiltertypeM12;
	}
	return res;
}

function FromXml_ST_CalendarType(val) {
	var res = -1;
	if ("gregorian" === val) {
		res = st_calendartypeGREGORIAN;
	} else if ("gregorianUs" === val) {
		res = st_calendartypeGREGORIANUS;
	} else if ("gregorianMeFrench" === val) {
		res = st_calendartypeGREGORIANMEFRENCH;
	} else if ("gregorianArabic" === val) {
		res = st_calendartypeGREGORIANARABIC;
	} else if ("hijri" === val) {
		res = st_calendartypeHIJRI;
	} else if ("hebrew" === val) {
		res = st_calendartypeHEBREW;
	} else if ("taiwan" === val) {
		res = st_calendartypeTAIWAN;
	} else if ("japan" === val) {
		res = st_calendartypeJAPAN;
	} else if ("thai" === val) {
		res = st_calendartypeTHAI;
	} else if ("korea" === val) {
		res = st_calendartypeKOREA;
	} else if ("saka" === val) {
		res = st_calendartypeSAKA;
	} else if ("gregorianXlitEnglish" === val) {
		res = st_calendartypeGREGORIANXLITENGLISH;
	} else if ("gregorianXlitFrench" === val) {
		res = st_calendartypeGREGORIANXLITFRENCH;
	} else if ("none" === val) {
		res = st_calendartypeNONE;
	}
	return res;
}

function FromXml_ST_IconSetType(val) {
	var res = -1;
	if ("3Arrows" === val) {
		res = st_iconsettype3ARROWS;
	} else if ("3ArrowsGray" === val) {
		res = st_iconsettype3ARROWSGRAY;
	} else if ("3Flags" === val) {
		res = st_iconsettype3FLAGS;
	} else if ("3TrafficLights1" === val) {
		res = st_iconsettype3TRAFFICLIGHTS1;
	} else if ("3TrafficLights2" === val) {
		res = st_iconsettype3TRAFFICLIGHTS2;
	} else if ("3Signs" === val) {
		res = st_iconsettype3SIGNS;
	} else if ("3Symbols" === val) {
		res = st_iconsettype3SYMBOLS;
	} else if ("3Symbols2" === val) {
		res = st_iconsettype3SYMBOLS2;
	} else if ("4Arrows" === val) {
		res = st_iconsettype4ARROWS;
	} else if ("4ArrowsGray" === val) {
		res = st_iconsettype4ARROWSGRAY;
	} else if ("4RedToBlack" === val) {
		res = st_iconsettype4REDTOBLACK;
	} else if ("4Rating" === val) {
		res = st_iconsettype4RATING;
	} else if ("4TrafficLights" === val) {
		res = st_iconsettype4TRAFFICLIGHTS;
	} else if ("5Arrows" === val) {
		res = st_iconsettype5ARROWS;
	} else if ("5ArrowsGray" === val) {
		res = st_iconsettype5ARROWSGRAY;
	} else if ("5Rating" === val) {
		res = st_iconsettype5RATING;
	} else if ("5Quarters" === val) {
		res = st_iconsettype5QUARTERS;
	}
	return res;
}

function FromXml_ST_SortBy(val) {
	var res = -1;
	if ("value" === val) {
		res = st_sortbyVALUE;
	} else if ("cellColor" === val) {
		res = st_sortbyCELLCOLOR;
	} else if ("fontColor" === val) {
		res = st_sortbyFONTCOLOR;
	} else if ("icon" === val) {
		res = st_sortbyICON;
	}
	return res;
}

function FromXml_ST_FilterOperator(val) {
	var res = -1;
	if ("equal" === val) {
		res = st_filteroperatorEQUAL;
	} else if ("lessThan" === val) {
		res = st_filteroperatorLESSTHAN;
	} else if ("lessThanOrEqual" === val) {
		res = st_filteroperatorLESSTHANOREQUAL;
	} else if ("notEqual" === val) {
		res = st_filteroperatorNOTEQUAL;
	} else if ("greaterThanOrEqual" === val) {
		res = st_filteroperatorGREATERTHANOREQUAL;
	} else if ("greaterThan" === val) {
		res = st_filteroperatorGREATERTHAN;
	}
	return res;
}

function FromXml_ST_DateTimeGrouping(val) {
	var res = -1;
	if ("year" === val) {
		res = st_datetimegroupingYEAR;
	} else if ("month" === val) {
		res = st_datetimegroupingMONTH;
	} else if ("day" === val) {
		res = st_datetimegroupingDAY;
	} else if ("hour" === val) {
		res = st_datetimegroupingHOUR;
	} else if ("minute" === val) {
		res = st_datetimegroupingMINUTE;
	} else if ("second" === val) {
		res = st_datetimegroupingSECOND;
	}
	return res;
}

function CT_PivotCacheDefinition() {
//Attributes
	this.id = null;
	this.invalid = null;//false
	this.saveData = null;//true
	this.refreshOnLoad = null;//false
	this.optimizeMemory = null;//false
	this.enableRefresh = null;//true
	this.refreshedBy = null;
	this.refreshedDateIso = null;
	this.backgroundQuery = null;//false
	this.missingItemsLimit = null;
	this.createdVersion = null;//0
	this.refreshedVersion = null;//0
	this.minRefreshableVersion = null;//0
	this.recordCount = null;
	this.upgradeOnRefresh = null;//false
	this.tupleCache = null;//false
	this.supportSubquery = null;//false
	this.supportAdvancedDrill = null;//false
//Members
	this.cacheSource = null;
	this.cacheFields = null;
	this.cacheHierarchies = null;
	this.kpis = null;
	this.tupleCache = null;
	this.calculatedItems = null;
	this.calculatedMembers = null;
	this.dimensions = null;
	this.measureGroups = null;
	this.maps = null;
	this.extLst = null;
}
CT_PivotCacheDefinition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = uq(val);
		}
		val = vals["invalid"];
		if (undefined !== val) {
			this.invalid = getBoolFromXml(val);
		}
		val = vals["saveData"];
		if (undefined !== val) {
			this.saveData = getBoolFromXml(val);
		}
		val = vals["refreshOnLoad"];
		if (undefined !== val) {
			this.refreshOnLoad = getBoolFromXml(val);
		}
		val = vals["optimizeMemory"];
		if (undefined !== val) {
			this.optimizeMemory = getBoolFromXml(val);
		}
		val = vals["enableRefresh"];
		if (undefined !== val) {
			this.enableRefresh = getBoolFromXml(val);
		}
		val = vals["refreshedBy"];
		if (undefined !== val) {
			this.refreshedBy = uq(val);
		}
		val = vals["refreshedDateIso"];
		if (undefined !== val) {
			this.refreshedDateIso = uq(val);
		}
		val = vals["backgroundQuery"];
		if (undefined !== val) {
			this.backgroundQuery = getBoolFromXml(val);
		}
		val = vals["missingItemsLimit"];
		if (undefined !== val) {
			this.missingItemsLimit = val - 0;
		}
		val = vals["createdVersion"];
		if (undefined !== val) {
			this.createdVersion = val - 0;
		}
		val = vals["refreshedVersion"];
		if (undefined !== val) {
			this.refreshedVersion = val - 0;
		}
		val = vals["minRefreshableVersion"];
		if (undefined !== val) {
			this.minRefreshableVersion = val - 0;
		}
		val = vals["recordCount"];
		if (undefined !== val) {
			this.recordCount = val - 0;
		}
		val = vals["upgradeOnRefresh"];
		if (undefined !== val) {
			this.upgradeOnRefresh = getBoolFromXml(val);
		}
		val = vals["tupleCache"];
		if (undefined !== val) {
			this.tupleCache = getBoolFromXml(val);
		}
		val = vals["supportSubquery"];
		if (undefined !== val) {
			this.supportSubquery = getBoolFromXml(val);
		}
		val = vals["supportAdvancedDrill"];
		if (undefined !== val) {
			this.supportAdvancedDrill = getBoolFromXml(val);
		}
	}
};
CT_PivotCacheDefinition.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotCacheDefinition" === elem) {
		newContext.readAttributes(attr, uq);
	} else if ("cacheSource" === elem) {
		newContext = new CT_CacheSource();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheSource = newContext;
	} else if ("cacheFields" === elem) {
		newContext = new CT_CacheFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheFields = newContext;
	} else if ("cacheHierarchies" === elem) {
		newContext = new CT_CacheHierarchies();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheHierarchies = newContext;
	} else if ("kpis" === elem) {
		newContext = new CT_PCDKPIs();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.kpis = newContext;
	} else if ("tupleCache" === elem) {
		newContext = new CT_TupleCache();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tupleCache = newContext;
	} else if ("calculatedItems" === elem) {
		newContext = new CT_CalculatedItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedItems = newContext;
	} else if ("calculatedMembers" === elem) {
		newContext = new CT_CalculatedMembers();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedMembers = newContext;
	} else if ("dimensions" === elem) {
		newContext = new CT_Dimensions();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dimensions = newContext;
	} else if ("measureGroups" === elem) {
		newContext = new CT_MeasureGroups();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.measureGroups = newContext;
	} else if ("maps" === elem) {
		newContext = new CT_MeasureDimensionMaps();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.maps = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotCacheRecords() {
//Attributes
	this.count = null;
//Members
	this.r = [];
	this.extLst = null;
}
CT_PivotCacheRecords.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotCacheRecords.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotCacheRecords" === elem) {
		newContext.readAttributes(attr, uq);
	} else if ("r" === elem) {
		newContext = new CT_r();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.r.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_pivotTableDefinition() {
//Attributes
	this.name = null;
	this.cacheId = null;
	this.dataOnRows = null;//false
	this.dataPosition = null;
	this.autoFormatId = null;
	this.applyNumberFormats = null;
	this.applyBorderFormats = null;
	this.applyFontFormats = null;
	this.applyPatternFormats = null;
	this.applyAlignmentFormats = null;
	this.applyWidthHeightFormats = null;
	this.dataCaption = null;
	this.grandTotalCaption = null;
	this.errorCaption = null;
	this.showError = null;//false
	this.missingCaption = null;
	this.showMissing = null;//true
	this.pageStyle = null;
	this.pivotTableStyle = null;
	this.vacatedStyle = null;
	this.tag = null;
	this.updatedVersion = null;//0
	this.minRefreshableVersion = null;//0
	this.asteriskTotals = null;//false
	this.showItems = null;//true
	this.editData = null;//false
	this.disableFieldList = null;//false
	this.showCalcMbrs = null;//true
	this.visualTotals = null;//true
	this.showMultipleLabel = null;//true
	this.showDataDropDown = null;//true
	this.showDrill = null;//true
	this.printDrill = null;//false
	this.showMemberPropertyTips = null;//true
	this.showDataTips = null;//true
	this.enableWizard = null;//true
	this.enableDrill = null;//true
	this.enableFieldProperties = null;//true
	this.preserveFormatting = null;//true
	this.useAutoFormatting = null;//false
	this.pageWrap = null;//0
	this.pageOverThenDown = null;//false
	this.subtotalHiddenItems = null;//false
	this.rowGrandTotals = null;//true
	this.colGrandTotals = null;//true
	this.fieldPrintTitles = null;//false
	this.itemPrintTitles = null;//false
	this.mergeItem = null;//false
	this.showDropZones = null;//true
	this.createdVersion = null;//0
	this.indent = null;//1
	this.showEmptyRow = null;//false
	this.showEmptyCol = null;//false
	this.showHeaders = null;//true
	this.compact = null;//true
	this.outline = null;//false
	this.outlineData = null;//false
	this.compactData = null;//true
	this.published = null;//false
	this.gridDropZones = null;//false
	this.immersive = null;//true
	this.multipleFieldFilters = null;//true
	this.chartFormat = null;//0
	this.rowHeaderCaption = null;
	this.colHeaderCaption = null;
	this.fieldListSortAscending = null;//false
	this.mdxSubqueries = null;//false
	this.customListSort = null;//true
//Members
	this.location = null;
	this.pivotFields = null;
	this.rowFields = null;
	this.rowItems = null;
	this.colFields = null;
	this.colItems = null;
	this.pageFields = null;
	this.dataFields = null;
	this.formats = null;
	this.conditionalFormats = null;
	this.chartFormats = null;
	this.pivotHierarchies = null;
	this.pivotTableStyleInfo = null;
	this.filters = null;
	this.rowHierarchiesUsage = null;
	this.colHierarchiesUsage = null;
	this.extLst = null;
}
CT_pivotTableDefinition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["cacheId"];
		if (undefined !== val) {
			this.cacheId = val - 0;
		}
		val = vals["dataOnRows"];
		if (undefined !== val) {
			this.dataOnRows = getBoolFromXml(val);
		}
		val = vals["dataPosition"];
		if (undefined !== val) {
			this.dataPosition = val - 0;
		}
		val = vals["autoFormatId"];
		if (undefined !== val) {
			this.autoFormatId = val - 0;
		}
		val = vals["applyNumberFormats"];
		if (undefined !== val) {
			this.applyNumberFormats = getBoolFromXml(val);
		}
		val = vals["applyBorderFormats"];
		if (undefined !== val) {
			this.applyBorderFormats = getBoolFromXml(val);
		}
		val = vals["applyFontFormats"];
		if (undefined !== val) {
			this.applyFontFormats = getBoolFromXml(val);
		}
		val = vals["applyPatternFormats"];
		if (undefined !== val) {
			this.applyPatternFormats = getBoolFromXml(val);
		}
		val = vals["applyAlignmentFormats"];
		if (undefined !== val) {
			this.applyAlignmentFormats = getBoolFromXml(val);
		}
		val = vals["applyWidthHeightFormats"];
		if (undefined !== val) {
			this.applyWidthHeightFormats = getBoolFromXml(val);
		}
		val = vals["dataCaption"];
		if (undefined !== val) {
			this.dataCaption = uq(val);
		}
		val = vals["grandTotalCaption"];
		if (undefined !== val) {
			this.grandTotalCaption = uq(val);
		}
		val = vals["errorCaption"];
		if (undefined !== val) {
			this.errorCaption = uq(val);
		}
		val = vals["showError"];
		if (undefined !== val) {
			this.showError = getBoolFromXml(val);
		}
		val = vals["missingCaption"];
		if (undefined !== val) {
			this.missingCaption = uq(val);
		}
		val = vals["showMissing"];
		if (undefined !== val) {
			this.showMissing = getBoolFromXml(val);
		}
		val = vals["pageStyle"];
		if (undefined !== val) {
			this.pageStyle = uq(val);
		}
		val = vals["pivotTableStyle"];
		if (undefined !== val) {
			this.pivotTableStyle = uq(val);
		}
		val = vals["vacatedStyle"];
		if (undefined !== val) {
			this.vacatedStyle = uq(val);
		}
		val = vals["tag"];
		if (undefined !== val) {
			this.tag = uq(val);
		}
		val = vals["updatedVersion"];
		if (undefined !== val) {
			this.updatedVersion = val - 0;
		}
		val = vals["minRefreshableVersion"];
		if (undefined !== val) {
			this.minRefreshableVersion = val - 0;
		}
		val = vals["asteriskTotals"];
		if (undefined !== val) {
			this.asteriskTotals = getBoolFromXml(val);
		}
		val = vals["showItems"];
		if (undefined !== val) {
			this.showItems = getBoolFromXml(val);
		}
		val = vals["editData"];
		if (undefined !== val) {
			this.editData = getBoolFromXml(val);
		}
		val = vals["disableFieldList"];
		if (undefined !== val) {
			this.disableFieldList = getBoolFromXml(val);
		}
		val = vals["showCalcMbrs"];
		if (undefined !== val) {
			this.showCalcMbrs = getBoolFromXml(val);
		}
		val = vals["visualTotals"];
		if (undefined !== val) {
			this.visualTotals = getBoolFromXml(val);
		}
		val = vals["showMultipleLabel"];
		if (undefined !== val) {
			this.showMultipleLabel = getBoolFromXml(val);
		}
		val = vals["showDataDropDown"];
		if (undefined !== val) {
			this.showDataDropDown = getBoolFromXml(val);
		}
		val = vals["showDrill"];
		if (undefined !== val) {
			this.showDrill = getBoolFromXml(val);
		}
		val = vals["printDrill"];
		if (undefined !== val) {
			this.printDrill = getBoolFromXml(val);
		}
		val = vals["showMemberPropertyTips"];
		if (undefined !== val) {
			this.showMemberPropertyTips = getBoolFromXml(val);
		}
		val = vals["showDataTips"];
		if (undefined !== val) {
			this.showDataTips = getBoolFromXml(val);
		}
		val = vals["enableWizard"];
		if (undefined !== val) {
			this.enableWizard = getBoolFromXml(val);
		}
		val = vals["enableDrill"];
		if (undefined !== val) {
			this.enableDrill = getBoolFromXml(val);
		}
		val = vals["enableFieldProperties"];
		if (undefined !== val) {
			this.enableFieldProperties = getBoolFromXml(val);
		}
		val = vals["preserveFormatting"];
		if (undefined !== val) {
			this.preserveFormatting = getBoolFromXml(val);
		}
		val = vals["useAutoFormatting"];
		if (undefined !== val) {
			this.useAutoFormatting = getBoolFromXml(val);
		}
		val = vals["pageWrap"];
		if (undefined !== val) {
			this.pageWrap = val - 0;
		}
		val = vals["pageOverThenDown"];
		if (undefined !== val) {
			this.pageOverThenDown = getBoolFromXml(val);
		}
		val = vals["subtotalHiddenItems"];
		if (undefined !== val) {
			this.subtotalHiddenItems = getBoolFromXml(val);
		}
		val = vals["rowGrandTotals"];
		if (undefined !== val) {
			this.rowGrandTotals = getBoolFromXml(val);
		}
		val = vals["colGrandTotals"];
		if (undefined !== val) {
			this.colGrandTotals = getBoolFromXml(val);
		}
		val = vals["fieldPrintTitles"];
		if (undefined !== val) {
			this.fieldPrintTitles = getBoolFromXml(val);
		}
		val = vals["itemPrintTitles"];
		if (undefined !== val) {
			this.itemPrintTitles = getBoolFromXml(val);
		}
		val = vals["mergeItem"];
		if (undefined !== val) {
			this.mergeItem = getBoolFromXml(val);
		}
		val = vals["showDropZones"];
		if (undefined !== val) {
			this.showDropZones = getBoolFromXml(val);
		}
		val = vals["createdVersion"];
		if (undefined !== val) {
			this.createdVersion = val - 0;
		}
		val = vals["indent"];
		if (undefined !== val) {
			this.indent = val - 0;
		}
		val = vals["showEmptyRow"];
		if (undefined !== val) {
			this.showEmptyRow = getBoolFromXml(val);
		}
		val = vals["showEmptyCol"];
		if (undefined !== val) {
			this.showEmptyCol = getBoolFromXml(val);
		}
		val = vals["showHeaders"];
		if (undefined !== val) {
			this.showHeaders = getBoolFromXml(val);
		}
		val = vals["compact"];
		if (undefined !== val) {
			this.compact = getBoolFromXml(val);
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["outlineData"];
		if (undefined !== val) {
			this.outlineData = getBoolFromXml(val);
		}
		val = vals["compactData"];
		if (undefined !== val) {
			this.compactData = getBoolFromXml(val);
		}
		val = vals["published"];
		if (undefined !== val) {
			this.published = getBoolFromXml(val);
		}
		val = vals["gridDropZones"];
		if (undefined !== val) {
			this.gridDropZones = getBoolFromXml(val);
		}
		val = vals["immersive"];
		if (undefined !== val) {
			this.immersive = getBoolFromXml(val);
		}
		val = vals["multipleFieldFilters"];
		if (undefined !== val) {
			this.multipleFieldFilters = getBoolFromXml(val);
		}
		val = vals["chartFormat"];
		if (undefined !== val) {
			this.chartFormat = val - 0;
		}
		val = vals["rowHeaderCaption"];
		if (undefined !== val) {
			this.rowHeaderCaption = uq(val);
		}
		val = vals["colHeaderCaption"];
		if (undefined !== val) {
			this.colHeaderCaption = uq(val);
		}
		val = vals["fieldListSortAscending"];
		if (undefined !== val) {
			this.fieldListSortAscending = getBoolFromXml(val);
		}
		val = vals["mdxSubqueries"];
		if (undefined !== val) {
			this.mdxSubqueries = getBoolFromXml(val);
		}
		val = vals["customListSort"];
		if (undefined !== val) {
			this.customListSort = getBoolFromXml(val);
		}
	}
};
CT_pivotTableDefinition.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotTableDefinition" === elem) {
		newContext.readAttributes(attr, uq);
	} else if ("location" === elem) {
		newContext = new CT_Location();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.location = newContext;
	} else if ("pivotFields" === elem) {
		newContext = new CT_PivotFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotFields = newContext;
	} else if ("rowFields" === elem) {
		newContext = new CT_RowFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowFields = newContext;
	} else if ("rowItems" === elem) {
		newContext = new CT_rowItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowItems = newContext;
	} else if ("colFields" === elem) {
		newContext = new CT_ColFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colFields = newContext;
	} else if ("colItems" === elem) {
		newContext = new CT_colItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colItems = newContext;
	} else if ("pageFields" === elem) {
		newContext = new CT_PageFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageFields = newContext;
	} else if ("dataFields" === elem) {
		newContext = new CT_DataFields();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dataFields = newContext;
	} else if ("formats" === elem) {
		newContext = new CT_Formats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.formats = newContext;
	} else if ("conditionalFormats" === elem) {
		newContext = new CT_ConditionalFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.conditionalFormats = newContext;
	} else if ("chartFormats" === elem) {
		newContext = new CT_ChartFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.chartFormats = newContext;
	} else if ("pivotHierarchies" === elem) {
		newContext = new CT_PivotHierarchies();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotHierarchies = newContext;
	} else if ("pivotTableStyleInfo" === elem) {
		newContext = new CT_PivotTableStyle();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotTableStyleInfo = newContext;
	} else if ("filters" === elem) {
		newContext = new CT_PivotFilters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filters = newContext;
	} else if ("rowHierarchiesUsage" === elem) {
		newContext = new CT_RowHierarchiesUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowHierarchiesUsage = newContext;
	} else if ("colHierarchiesUsage" === elem) {
		newContext = new CT_ColHierarchiesUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colHierarchiesUsage = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CacheSource() {
//Attributes
	this.type = null;
	this.connectionId = null;//0
//Members
	this.consolidation = null;
	this.extLst = null;
	this.worksheetSource = null;
}
CT_CacheSource.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_SourceType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["connectionId"];
		if (undefined !== val) {
			this.connectionId = val - 0;
		}
	}
};
CT_CacheSource.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("consolidation" === elem) {
		newContext = new CT_Consolidation();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.consolidation = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else if ("worksheetSource" === elem) {
		newContext = new CT_WorksheetSource();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.worksheetSource = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CacheFields() {
//Attributes
	this.count = null;
//Members
	this.cacheField = [];
}
CT_CacheFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CacheFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("cacheField" === elem) {
		newContext = new CT_CacheField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CacheHierarchies() {
//Attributes
	this.count = null;
//Members
	this.cacheHierarchy = [];
}
CT_CacheHierarchies.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CacheHierarchies.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("cacheHierarchy" === elem) {
		newContext = new CT_CacheHierarchy();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.cacheHierarchy.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PCDKPIs() {
//Attributes
	this.count = null;
//Members
	this.kpi = [];
}
CT_PCDKPIs.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDKPIs.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("kpi" === elem) {
		newContext = new CT_PCDKPI();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.kpi.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_TupleCache() {
//Members
	this.entries = null;
	this.sets = null;
	this.queryCache = null;
	this.serverFormats = null;
	this.extLst = null;
}
CT_TupleCache.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("entries" === elem) {
		newContext = new CT_PCDSDTCEntries();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.entries = newContext;
	} else if ("sets" === elem) {
		newContext = new CT_Sets();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sets = newContext;
	} else if ("queryCache" === elem) {
		newContext = new CT_QueryCache();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.queryCache = newContext;
	} else if ("serverFormats" === elem) {
		newContext = new CT_ServerFormats();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.serverFormats = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CalculatedItems() {
//Attributes
	this.count = null;
//Members
	this.calculatedItem = [];
}
CT_CalculatedItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CalculatedItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("calculatedItem" === elem) {
		newContext = new CT_CalculatedItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CalculatedMembers() {
//Attributes
	this.count = null;
//Members
	this.calculatedMember = [];
}
CT_CalculatedMembers.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_CalculatedMembers.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("calculatedMember" === elem) {
		newContext = new CT_CalculatedMember();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.calculatedMember.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Dimensions() {
//Attributes
	this.count = null;
//Members
	this.dimension = [];
}
CT_Dimensions.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Dimensions.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("dimension" === elem) {
		newContext = new CT_PivotDimension();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dimension.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_MeasureGroups() {
//Attributes
	this.count = null;
//Members
	this.measureGroup = [];
}
CT_MeasureGroups.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MeasureGroups.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("measureGroup" === elem) {
		newContext = new CT_MeasureGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.measureGroup.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_MeasureDimensionMaps() {
//Attributes
	this.count = null;
//Members
	this.map = [];
}
CT_MeasureDimensionMaps.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MeasureDimensionMaps.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("map" === elem) {
		newContext = new CT_MeasureDimensionMap();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.map.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ExtensionList() {
//Members
	this.ext = [];
}
CT_ExtensionList.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("ext" === elem) {
		newContext = new CT_Extension();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.ext.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_r() {
//Members
	this.b = [];
	this.d = [];
	this.e = [];
	this.m = [];
	this.n = [];
	this.s = [];
	this.x = [];
}
CT_r.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("b" === elem) {
		newContext = new CT_Boolean();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.b.push(newContext);
	} else if ("d" === elem) {
		newContext = new CT_DateTime();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.d.push(newContext);
	} else if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.e.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.m.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.n.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.s.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Location() {
//Attributes
	this.ref = null;
	this.firstHeaderRow = null;
	this.firstDataRow = null;
	this.firstDataCol = null;
	this.rowPageCount = null;//0
	this.colPageCount = null;//0
}
CT_Location.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
		val = vals["firstHeaderRow"];
		if (undefined !== val) {
			this.firstHeaderRow = val - 0;
		}
		val = vals["firstDataRow"];
		if (undefined !== val) {
			this.firstDataRow = val - 0;
		}
		val = vals["firstDataCol"];
		if (undefined !== val) {
			this.firstDataCol = val - 0;
		}
		val = vals["rowPageCount"];
		if (undefined !== val) {
			this.rowPageCount = val - 0;
		}
		val = vals["colPageCount"];
		if (undefined !== val) {
			this.colPageCount = val - 0;
		}
	}
};
function CT_PivotFields() {
//Attributes
	this.count = null;
//Members
	this.pivotField = [];
}
CT_PivotFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotField" === elem) {
		newContext = new CT_PivotField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_RowFields() {
//Attributes
	this.count = null;//0
//Members
	this.field = [];
}
CT_RowFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RowFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("field" === elem) {
		newContext = new CT_Field();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.field.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_rowItems() {
//Attributes
	this.count = null;
//Members
	this.i = [];
}
CT_rowItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_rowItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("i" === elem) {
		newContext = new CT_I();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.i.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ColFields() {
//Attributes
	this.count = null;//0
//Members
	this.field = [];
}
CT_ColFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ColFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("field" === elem) {
		newContext = new CT_Field();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.field.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_colItems() {
//Attributes
	this.count = null;
//Members
	this.i = [];
}
CT_colItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_colItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("i" === elem) {
		newContext = new CT_I();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.i.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PageFields() {
//Attributes
	this.count = null;
//Members
	this.pageField = [];
}
CT_PageFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PageFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pageField" === elem) {
		newContext = new CT_PageField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_DataFields() {
//Attributes
	this.count = null;
//Members
	this.dataField = [];
}
CT_DataFields.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_DataFields.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("dataField" === elem) {
		newContext = new CT_DataField();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dataField.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Formats() {
//Attributes
	this.count = null;//0
//Members
	this.format = [];
}
CT_Formats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Formats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("format" === elem) {
		newContext = new CT_Format();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.format.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ConditionalFormats() {
//Attributes
	this.count = null;//0
//Members
	this.conditionalFormat = [];
}
CT_ConditionalFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ConditionalFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("conditionalFormat" === elem) {
		newContext = new CT_ConditionalFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.conditionalFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ChartFormats() {
//Attributes
	this.count = null;//0
//Members
	this.chartFormat = [];
}
CT_ChartFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ChartFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("chartFormat" === elem) {
		newContext = new CT_ChartFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.chartFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotHierarchies() {
//Attributes
	this.count = null;
//Members
	this.pivotHierarchy = [];
}
CT_PivotHierarchies.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotHierarchies.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotHierarchy" === elem) {
		newContext = new CT_PivotHierarchy();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotHierarchy.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotTableStyle() {
//Attributes
	this.name = null;
	this.showRowHeaders = null;
	this.showColHeaders = null;
	this.showRowStripes = null;
	this.showColStripes = null;
	this.showLastColumn = null;
}
CT_PivotTableStyle.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["showRowHeaders"];
		if (undefined !== val) {
			this.showRowHeaders = getBoolFromXml(val);
		}
		val = vals["showColHeaders"];
		if (undefined !== val) {
			this.showColHeaders = getBoolFromXml(val);
		}
		val = vals["showRowStripes"];
		if (undefined !== val) {
			this.showRowStripes = getBoolFromXml(val);
		}
		val = vals["showColStripes"];
		if (undefined !== val) {
			this.showColStripes = getBoolFromXml(val);
		}
		val = vals["showLastColumn"];
		if (undefined !== val) {
			this.showLastColumn = getBoolFromXml(val);
		}
	}
};
function CT_PivotFilters() {
//Attributes
	this.count = null;//0
//Members
	this.filter = [];
}
CT_PivotFilters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotFilters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filter" === elem) {
		newContext = new CT_PivotFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filter.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_RowHierarchiesUsage() {
//Attributes
	this.count = null;
//Members
	this.rowHierarchyUsage = [];
}
CT_RowHierarchiesUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RowHierarchiesUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rowHierarchyUsage" === elem) {
		newContext = new CT_HierarchyUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rowHierarchyUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ColHierarchiesUsage() {
//Attributes
	this.count = null;
//Members
	this.colHierarchyUsage = [];
}
CT_ColHierarchiesUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ColHierarchiesUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("colHierarchyUsage" === elem) {
		newContext = new CT_HierarchyUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colHierarchyUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Consolidation() {
//Attributes
	this.autoPage = null;//true
//Members
	this.pages = null;
	this.rangeSets = null;
}
CT_Consolidation.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["autoPage"];
		if (undefined !== val) {
			this.autoPage = getBoolFromXml(val);
		}
	}
};
CT_Consolidation.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pages" === elem) {
		newContext = new CT_Pages();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pages = newContext;
	} else if ("rangeSets" === elem) {
		newContext = new CT_RangeSets();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangeSets = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_WorksheetSource() {
//Attributes
	this.ref = null;
	this.name = null;
	this.sheet = null;
	this.id = null;
}
CT_WorksheetSource.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["sheet"];
		if (undefined !== val) {
			this.sheet = uq(val);
		}
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = uq(val);
		}
	}
};
function CT_CacheField() {
//Attributes
	this.name = null;
	this.caption = null;
	this.propertyName = null;
	this.serverField = null;//false
	this.uniqueList = null;//true
	this.numFmtId = null;
	this.formula = null;
	this.sqlType = null;//0
	this.hierarchy = null;//0
	this.level = null;//0
	this.databaseField = null;//true
	this.mappingCount = null;
	this.memberPropertyField = null;//false
//Members
	this.sharedItems = null;
	this.fieldGroup = null;
	this.mpMap = [];
	this.extLst = null;
}
CT_CacheField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
		val = vals["propertyName"];
		if (undefined !== val) {
			this.propertyName = uq(val);
		}
		val = vals["serverField"];
		if (undefined !== val) {
			this.serverField = getBoolFromXml(val);
		}
		val = vals["uniqueList"];
		if (undefined !== val) {
			this.uniqueList = getBoolFromXml(val);
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
		val = vals["formula"];
		if (undefined !== val) {
			this.formula = uq(val);
		}
		val = vals["sqlType"];
		if (undefined !== val) {
			this.sqlType = val - 0;
		}
		val = vals["hierarchy"];
		if (undefined !== val) {
			this.hierarchy = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
		val = vals["databaseField"];
		if (undefined !== val) {
			this.databaseField = getBoolFromXml(val);
		}
		val = vals["mappingCount"];
		if (undefined !== val) {
			this.mappingCount = val - 0;
		}
		val = vals["memberPropertyField"];
		if (undefined !== val) {
			this.memberPropertyField = getBoolFromXml(val);
		}
	}
};
CT_CacheField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("sharedItems" === elem) {
		newContext = new CT_SharedItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sharedItems = newContext;
	} else if ("fieldGroup" === elem) {
		newContext = new CT_FieldGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldGroup = newContext;
	} else if ("mpMap" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mpMap.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CacheHierarchy() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.measure = null;//false
	this.set = null;//false
	this.parentSet = null;
	this.iconSet = null;//0
	this.attribute = null;//false
	this.time = null;//false
	this.keyAttribute = null;//false
	this.defaultMemberUniqueName = null;
	this.allUniqueName = null;
	this.allCaption = null;
	this.dimensionUniqueName = null;
	this.displayFolder = null;
	this.measureGroup = null;
	this.measures = null;//false
	this.count = null;
	this.oneField = null;//false
	this.memberValueDatatype = null;
	this.unbalanced = null;
	this.unbalancedGroup = null;
	this.hidden = null;//false
//Members
	this.fieldsUsage = null;
	this.groupLevels = null;
	this.extLst = null;
}
CT_CacheHierarchy.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
		val = vals["measure"];
		if (undefined !== val) {
			this.measure = getBoolFromXml(val);
		}
		val = vals["set"];
		if (undefined !== val) {
			this.set = getBoolFromXml(val);
		}
		val = vals["parentSet"];
		if (undefined !== val) {
			this.parentSet = val - 0;
		}
		val = vals["iconSet"];
		if (undefined !== val) {
			this.iconSet = val - 0;
		}
		val = vals["attribute"];
		if (undefined !== val) {
			this.attribute = getBoolFromXml(val);
		}
		val = vals["time"];
		if (undefined !== val) {
			this.time = getBoolFromXml(val);
		}
		val = vals["keyAttribute"];
		if (undefined !== val) {
			this.keyAttribute = getBoolFromXml(val);
		}
		val = vals["defaultMemberUniqueName"];
		if (undefined !== val) {
			this.defaultMemberUniqueName = uq(val);
		}
		val = vals["allUniqueName"];
		if (undefined !== val) {
			this.allUniqueName = uq(val);
		}
		val = vals["allCaption"];
		if (undefined !== val) {
			this.allCaption = uq(val);
		}
		val = vals["dimensionUniqueName"];
		if (undefined !== val) {
			this.dimensionUniqueName = uq(val);
		}
		val = vals["displayFolder"];
		if (undefined !== val) {
			this.displayFolder = uq(val);
		}
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = uq(val);
		}
		val = vals["measures"];
		if (undefined !== val) {
			this.measures = getBoolFromXml(val);
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["oneField"];
		if (undefined !== val) {
			this.oneField = getBoolFromXml(val);
		}
		val = vals["memberValueDatatype"];
		if (undefined !== val) {
			this.memberValueDatatype = val - 0;
		}
		val = vals["unbalanced"];
		if (undefined !== val) {
			this.unbalanced = getBoolFromXml(val);
		}
		val = vals["unbalancedGroup"];
		if (undefined !== val) {
			this.unbalancedGroup = getBoolFromXml(val);
		}
		val = vals["hidden"];
		if (undefined !== val) {
			this.hidden = getBoolFromXml(val);
		}
	}
};
CT_CacheHierarchy.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("fieldsUsage" === elem) {
		newContext = new CT_FieldsUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldsUsage = newContext;
	} else if ("groupLevels" === elem) {
		newContext = new CT_GroupLevels();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupLevels = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PCDKPI() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.displayFolder = null;
	this.measureGroup = null;
	this.parent = null;
	this.value = null;
	this.goal = null;
	this.status = null;
	this.trend = null;
	this.weight = null;
	this.time = null;
}
CT_PCDKPI.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
		val = vals["displayFolder"];
		if (undefined !== val) {
			this.displayFolder = uq(val);
		}
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = uq(val);
		}
		val = vals["parent"];
		if (undefined !== val) {
			this.parent = uq(val);
		}
		val = vals["value"];
		if (undefined !== val) {
			this.value = uq(val);
		}
		val = vals["goal"];
		if (undefined !== val) {
			this.goal = uq(val);
		}
		val = vals["status"];
		if (undefined !== val) {
			this.status = uq(val);
		}
		val = vals["trend"];
		if (undefined !== val) {
			this.trend = uq(val);
		}
		val = vals["weight"];
		if (undefined !== val) {
			this.weight = uq(val);
		}
		val = vals["time"];
		if (undefined !== val) {
			this.time = uq(val);
		}
	}
};
function CT_PCDSDTCEntries() {
//Attributes
	this.count = null;
//Members
	this.Items = [];
//internal
	this._curElem = null;
}
CT_PCDSDTCEntries.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDSDTCEntries.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_PCDSDTCEntries.prototype.onTextNode = function(text, uq) {
	if ("Items" === this._curElem) {
		this.Items = uq(text);
	}
};
function CT_Sets() {
//Attributes
	this.count = null;
//Members
	this.set = [];
}
CT_Sets.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Sets.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("set" === elem) {
		newContext = new CT_Set();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.set.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_QueryCache() {
//Attributes
	this.count = null;
//Members
	this.query = [];
}
CT_QueryCache.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_QueryCache.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("query" === elem) {
		newContext = new CT_Query();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.query.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ServerFormats() {
//Attributes
	this.count = null;
//Members
	this.serverFormat = [];
}
CT_ServerFormats.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_ServerFormats.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("serverFormat" === elem) {
		newContext = new CT_ServerFormat();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.serverFormat.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CalculatedItem() {
//Attributes
	this.field = null;
	this.formula = null;
//Members
	this.pivotArea = null;
	this.extLst = null;
}
CT_CalculatedItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["formula"];
		if (undefined !== val) {
			this.formula = uq(val);
		}
	}
};
CT_CalculatedItem.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CalculatedMember() {
//Attributes
	this.name = null;
	this.mdx = null;
	this.memberName = null;
	this.hierarchy = null;
	this.parent = null;
	this.solveOrder = null;//0
	this.set = null;//false
//Members
	this.extLst = null;
}
CT_CalculatedMember.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["mdx"];
		if (undefined !== val) {
			this.mdx = uq(val);
		}
		val = vals["memberName"];
		if (undefined !== val) {
			this.memberName = uq(val);
		}
		val = vals["hierarchy"];
		if (undefined !== val) {
			this.hierarchy = uq(val);
		}
		val = vals["parent"];
		if (undefined !== val) {
			this.parent = uq(val);
		}
		val = vals["solveOrder"];
		if (undefined !== val) {
			this.solveOrder = val - 0;
		}
		val = vals["set"];
		if (undefined !== val) {
			this.set = getBoolFromXml(val);
		}
	}
};
CT_CalculatedMember.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotDimension() {
//Attributes
	this.measure = null;//false
	this.name = null;
	this.uniqueName = null;
	this.caption = null;
}
CT_PivotDimension.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["measure"];
		if (undefined !== val) {
			this.measure = getBoolFromXml(val);
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
	}
};
function CT_MeasureGroup() {
//Attributes
	this.name = null;
	this.caption = null;
}
CT_MeasureGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
	}
};
function CT_MeasureDimensionMap() {
//Attributes
	this.measureGroup = null;
	this.dimension = null;
}
CT_MeasureDimensionMap.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["measureGroup"];
		if (undefined !== val) {
			this.measureGroup = val - 0;
		}
		val = vals["dimension"];
		if (undefined !== val) {
			this.dimension = val - 0;
		}
	}
};
function CT_Extension() {
//Attributes
	this.uri = null;
//Members
	this.Any = null;
//internal
	this._curElem = null;
}
CT_Extension.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uri"];
		if (undefined !== val) {
			this.uri = uq(val);
		}
	}
};
CT_Extension.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("Any" === elem) {
		this.Any = elem;
	} else {
		newContext = null;
	}
	return newContext;
};
CT_Extension.prototype.onTextNode = function(text, uq) {
	if ("Any" === this._curElem) {
		this.Any = uq(text);
	}
};
function CT_Boolean() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
//Members
	this.x = [];
}
CT_Boolean.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = getBoolFromXml(val);
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
	}
};
CT_Boolean.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_DateTime() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
//Members
	this.x = [];
}
CT_DateTime.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = uq(val);
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
	}
};
CT_DateTime.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Error() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = null;
	this.x = [];
}
CT_Error.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = uq(val);
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Error.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls = newContext;
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Missing() {
//Attributes
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_Missing.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Missing.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Number() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_Number.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_Number.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_String() {
//Attributes
	this.v = null;
	this.u = null;
	this.f = null;
	this.c = null;
	this.cp = null;
	this.in = null;
	this.bc = null;
	this.fc = null;
	this.i = null;//false
	this.un = null;//false
	this.st = null;//false
	this.b = null;//false
//Members
	this.tpls = [];
	this.x = [];
}
CT_String.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = uq(val);
		}
		val = vals["u"];
		if (undefined !== val) {
			this.u = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = uq(val);
		}
		val = vals["cp"];
		if (undefined !== val) {
			this.cp = val - 0;
		}
		val = vals["in"];
		if (undefined !== val) {
			this.in = val - 0;
		}
		val = vals["bc"];
		if (undefined !== val) {
			this.bc = val - 0;
		}
		val = vals["fc"];
		if (undefined !== val) {
			this.fc = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = getBoolFromXml(val);
		}
		val = vals["un"];
		if (undefined !== val) {
			this.un = getBoolFromXml(val);
		}
		val = vals["st"];
		if (undefined !== val) {
			this.st = getBoolFromXml(val);
		}
		val = vals["b"];
		if (undefined !== val) {
			this.b = getBoolFromXml(val);
		}
	}
};
CT_String.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Index() {
//Attributes
	this.v = null;
}
CT_Index.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
	}
};
function CT_PivotField() {
//Attributes
	this.name = null;
	this.axis = null;
	this.dataField = null;//false
	this.subtotalCaption = null;
	this.showDropDowns = null;//true
	this.hiddenLevel = null;//false
	this.uniqueMemberProperty = null;
	this.compact = null;//true
	this.allDrilled = null;//false
	this.numFmtId = null;
	this.outline = null;//true
	this.subtotalTop = null;//true
	this.dragToRow = null;//true
	this.dragToCol = null;//true
	this.multipleItemSelectionAllowed = null;//false
	this.dragToPage = null;//true
	this.dragToData = null;//true
	this.dragOff = null;//true
	this.showAll = null;//true
	this.insertBlankRow = null;//false
	this.serverField = null;//false
	this.insertPageBreak = null;//false
	this.autoShow = null;//false
	this.topAutoShow = null;//true
	this.hideNewItems = null;//false
	this.measureFilter = null;//false
	this.includeNewItemsInFilter = null;//false
	this.itemPageCount = null;//10
	this.sortType = null;//manual
	this.dataSourceSort = null;
	this.nonAutoSortDefault = null;//false
	this.rankBy = null;
	this.defaultSubtotal = null;//true
	this.sumSubtotal = null;//false
	this.countASubtotal = null;//false
	this.avgSubtotal = null;//false
	this.maxSubtotal = null;//false
	this.minSubtotal = null;//false
	this.productSubtotal = null;//false
	this.countSubtotal = null;//false
	this.stdDevSubtotal = null;//false
	this.stdDevPSubtotal = null;//false
	this.varSubtotal = null;//false
	this.varPSubtotal = null;//false
	this.showPropCell = null;//false
	this.showPropTip = null;//false
	this.showPropAsCaption = null;//false
	this.defaultAttributeDrillState = null;//false
//Members
	this.items = null;
	this.autoSortScope = null;
	this.extLst = null;
}
CT_PivotField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["axis"];
		if (undefined !== val) {
			val = FromXml_ST_Axis(val);
			if (-1 !== val) {
				this.axis = val;
			}
		}
		val = vals["dataField"];
		if (undefined !== val) {
			this.dataField = getBoolFromXml(val);
		}
		val = vals["subtotalCaption"];
		if (undefined !== val) {
			this.subtotalCaption = uq(val);
		}
		val = vals["showDropDowns"];
		if (undefined !== val) {
			this.showDropDowns = getBoolFromXml(val);
		}
		val = vals["hiddenLevel"];
		if (undefined !== val) {
			this.hiddenLevel = getBoolFromXml(val);
		}
		val = vals["uniqueMemberProperty"];
		if (undefined !== val) {
			this.uniqueMemberProperty = uq(val);
		}
		val = vals["compact"];
		if (undefined !== val) {
			this.compact = getBoolFromXml(val);
		}
		val = vals["allDrilled"];
		if (undefined !== val) {
			this.allDrilled = getBoolFromXml(val);
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["subtotalTop"];
		if (undefined !== val) {
			this.subtotalTop = getBoolFromXml(val);
		}
		val = vals["dragToRow"];
		if (undefined !== val) {
			this.dragToRow = getBoolFromXml(val);
		}
		val = vals["dragToCol"];
		if (undefined !== val) {
			this.dragToCol = getBoolFromXml(val);
		}
		val = vals["multipleItemSelectionAllowed"];
		if (undefined !== val) {
			this.multipleItemSelectionAllowed = getBoolFromXml(val);
		}
		val = vals["dragToPage"];
		if (undefined !== val) {
			this.dragToPage = getBoolFromXml(val);
		}
		val = vals["dragToData"];
		if (undefined !== val) {
			this.dragToData = getBoolFromXml(val);
		}
		val = vals["dragOff"];
		if (undefined !== val) {
			this.dragOff = getBoolFromXml(val);
		}
		val = vals["showAll"];
		if (undefined !== val) {
			this.showAll = getBoolFromXml(val);
		}
		val = vals["insertBlankRow"];
		if (undefined !== val) {
			this.insertBlankRow = getBoolFromXml(val);
		}
		val = vals["serverField"];
		if (undefined !== val) {
			this.serverField = getBoolFromXml(val);
		}
		val = vals["insertPageBreak"];
		if (undefined !== val) {
			this.insertPageBreak = getBoolFromXml(val);
		}
		val = vals["autoShow"];
		if (undefined !== val) {
			this.autoShow = getBoolFromXml(val);
		}
		val = vals["topAutoShow"];
		if (undefined !== val) {
			this.topAutoShow = getBoolFromXml(val);
		}
		val = vals["hideNewItems"];
		if (undefined !== val) {
			this.hideNewItems = getBoolFromXml(val);
		}
		val = vals["measureFilter"];
		if (undefined !== val) {
			this.measureFilter = getBoolFromXml(val);
		}
		val = vals["includeNewItemsInFilter"];
		if (undefined !== val) {
			this.includeNewItemsInFilter = getBoolFromXml(val);
		}
		val = vals["itemPageCount"];
		if (undefined !== val) {
			this.itemPageCount = val - 0;
		}
		val = vals["sortType"];
		if (undefined !== val) {
			val = FromXml_ST_FieldSortType(val);
			if (-1 !== val) {
				this.sortType = val;
			}
		}
		val = vals["dataSourceSort"];
		if (undefined !== val) {
			this.dataSourceSort = getBoolFromXml(val);
		}
		val = vals["nonAutoSortDefault"];
		if (undefined !== val) {
			this.nonAutoSortDefault = getBoolFromXml(val);
		}
		val = vals["rankBy"];
		if (undefined !== val) {
			this.rankBy = val - 0;
		}
		val = vals["defaultSubtotal"];
		if (undefined !== val) {
			this.defaultSubtotal = getBoolFromXml(val);
		}
		val = vals["sumSubtotal"];
		if (undefined !== val) {
			this.sumSubtotal = getBoolFromXml(val);
		}
		val = vals["countASubtotal"];
		if (undefined !== val) {
			this.countASubtotal = getBoolFromXml(val);
		}
		val = vals["avgSubtotal"];
		if (undefined !== val) {
			this.avgSubtotal = getBoolFromXml(val);
		}
		val = vals["maxSubtotal"];
		if (undefined !== val) {
			this.maxSubtotal = getBoolFromXml(val);
		}
		val = vals["minSubtotal"];
		if (undefined !== val) {
			this.minSubtotal = getBoolFromXml(val);
		}
		val = vals["productSubtotal"];
		if (undefined !== val) {
			this.productSubtotal = getBoolFromXml(val);
		}
		val = vals["countSubtotal"];
		if (undefined !== val) {
			this.countSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevSubtotal"];
		if (undefined !== val) {
			this.stdDevSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevPSubtotal"];
		if (undefined !== val) {
			this.stdDevPSubtotal = getBoolFromXml(val);
		}
		val = vals["varSubtotal"];
		if (undefined !== val) {
			this.varSubtotal = getBoolFromXml(val);
		}
		val = vals["varPSubtotal"];
		if (undefined !== val) {
			this.varPSubtotal = getBoolFromXml(val);
		}
		val = vals["showPropCell"];
		if (undefined !== val) {
			this.showPropCell = getBoolFromXml(val);
		}
		val = vals["showPropTip"];
		if (undefined !== val) {
			this.showPropTip = getBoolFromXml(val);
		}
		val = vals["showPropAsCaption"];
		if (undefined !== val) {
			this.showPropAsCaption = getBoolFromXml(val);
		}
		val = vals["defaultAttributeDrillState"];
		if (undefined !== val) {
			this.defaultAttributeDrillState = getBoolFromXml(val);
		}
	}
};
CT_PivotField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("items" === elem) {
		newContext = new CT_Items();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.items = newContext;
	} else if ("autoSortScope" === elem) {
		newContext = new CT_AutoSortScope();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.autoSortScope = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Field() {
//Attributes
	this.x = null;
}
CT_Field.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
	}
};
function CT_I() {
//Attributes
	this.t = null;//data
	this.r = null;//0
	this.i = null;//0
//Members
	this.x = [];
}
CT_I.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["t"];
		if (undefined !== val) {
			val = FromXml_ST_ItemType(val);
			if (-1 !== val) {
				this.t = val;
			}
		}
		val = vals["r"];
		if (undefined !== val) {
			this.r = val - 0;
		}
		val = vals["i"];
		if (undefined !== val) {
			this.i = val - 0;
		}
	}
};
CT_I.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_X();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PageField() {
//Attributes
	this.fld = null;
	this.item = null;
	this.hier = null;
	this.name = null;
	this.cap = null;
//Members
	this.extLst = null;
}
CT_PageField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["item"];
		if (undefined !== val) {
			this.item = val - 0;
		}
		val = vals["hier"];
		if (undefined !== val) {
			this.hier = val - 0;
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["cap"];
		if (undefined !== val) {
			this.cap = uq(val);
		}
	}
};
CT_PageField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_DataField() {
//Attributes
	this.name = null;
	this.fld = null;
	this.subtotal = null;//sum
	this.showDataAs = null;//normal
	this.baseField = null;//-1
	this.baseItem = null;//1048832
	this.numFmtId = null;
//Members
	this.extLst = null;
}
CT_DataField.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["subtotal"];
		if (undefined !== val) {
			val = FromXml_ST_DataConsolidateFunction(val);
			if (-1 !== val) {
				this.subtotal = val;
			}
		}
		val = vals["showDataAs"];
		if (undefined !== val) {
			val = FromXml_ST_ShowDataAs(val);
			if (-1 !== val) {
				this.showDataAs = val;
			}
		}
		val = vals["baseField"];
		if (undefined !== val) {
			this.baseField = val - 0;
		}
		val = vals["baseItem"];
		if (undefined !== val) {
			this.baseItem = val - 0;
		}
		val = vals["numFmtId"];
		if (undefined !== val) {
			this.numFmtId = val - 0;
		}
	}
};
CT_DataField.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Format() {
//Attributes
	this.action = null;//formatting
	this.dxfId = null;
//Members
	this.pivotArea = null;
	this.extLst = null;
}
CT_Format.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["action"];
		if (undefined !== val) {
			val = FromXml_ST_FormatAction(val);
			if (-1 !== val) {
				this.action = val;
			}
		}
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
	}
};
CT_Format.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ConditionalFormat() {
//Attributes
	this.scope = null;//selection
	this.type = null;//none
	this.priority = null;
//Members
	this.pivotAreas = null;
	this.extLst = null;
}
CT_ConditionalFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["scope"];
		if (undefined !== val) {
			val = FromXml_ST_Scope(val);
			if (-1 !== val) {
				this.scope = val;
			}
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_Type(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["priority"];
		if (undefined !== val) {
			this.priority = val - 0;
		}
	}
};
CT_ConditionalFormat.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotAreas" === elem) {
		newContext = new CT_PivotAreas();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotAreas = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ChartFormat() {
//Attributes
	this.chart = null;
	this.format = null;
	this.series = null;//false
//Members
	this.pivotArea = null;
}
CT_ChartFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["chart"];
		if (undefined !== val) {
			this.chart = val - 0;
		}
		val = vals["format"];
		if (undefined !== val) {
			this.format = val - 0;
		}
		val = vals["series"];
		if (undefined !== val) {
			this.series = getBoolFromXml(val);
		}
	}
};
CT_ChartFormat.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotHierarchy() {
//Attributes
	this.outline = null;//false
	this.multipleItemSelectionAllowed = null;//false
	this.subtotalTop = null;//false
	this.showInFieldList = null;//true
	this.dragToRow = null;//true
	this.dragToCol = null;//true
	this.dragToPage = null;//true
	this.dragToData = null;//false
	this.dragOff = null;//true
	this.includeNewItemsInFilter = null;//false
	this.caption = null;
//Members
	this.mps = null;
	this.members = [];
	this.extLst = null;
}
CT_PivotHierarchy.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["multipleItemSelectionAllowed"];
		if (undefined !== val) {
			this.multipleItemSelectionAllowed = getBoolFromXml(val);
		}
		val = vals["subtotalTop"];
		if (undefined !== val) {
			this.subtotalTop = getBoolFromXml(val);
		}
		val = vals["showInFieldList"];
		if (undefined !== val) {
			this.showInFieldList = getBoolFromXml(val);
		}
		val = vals["dragToRow"];
		if (undefined !== val) {
			this.dragToRow = getBoolFromXml(val);
		}
		val = vals["dragToCol"];
		if (undefined !== val) {
			this.dragToCol = getBoolFromXml(val);
		}
		val = vals["dragToPage"];
		if (undefined !== val) {
			this.dragToPage = getBoolFromXml(val);
		}
		val = vals["dragToData"];
		if (undefined !== val) {
			this.dragToData = getBoolFromXml(val);
		}
		val = vals["dragOff"];
		if (undefined !== val) {
			this.dragOff = getBoolFromXml(val);
		}
		val = vals["includeNewItemsInFilter"];
		if (undefined !== val) {
			this.includeNewItemsInFilter = getBoolFromXml(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
	}
};
CT_PivotHierarchy.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("mps" === elem) {
		newContext = new CT_MemberProperties();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mps = newContext;
	} else if ("members" === elem) {
		newContext = new CT_Members();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.members.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotFilter() {
//Attributes
	this.fld = null;
	this.mpFld = null;
	this.type = null;
	this.evalOrder = null;//0
	this.id = null;
	this.iMeasureHier = null;
	this.iMeasureFld = null;
	this.name = null;
	this.description = null;
	this.stringValue1 = null;
	this.stringValue2 = null;
//Members
	this.autoFilter = null;
	this.extLst = null;
}
CT_PivotFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["mpFld"];
		if (undefined !== val) {
			this.mpFld = val - 0;
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_PivotFilterType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["evalOrder"];
		if (undefined !== val) {
			this.evalOrder = val - 0;
		}
		val = vals["id"];
		if (undefined !== val) {
			this.id = val - 0;
		}
		val = vals["iMeasureHier"];
		if (undefined !== val) {
			this.iMeasureHier = val - 0;
		}
		val = vals["iMeasureFld"];
		if (undefined !== val) {
			this.iMeasureFld = val - 0;
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["description"];
		if (undefined !== val) {
			this.description = uq(val);
		}
		val = vals["stringValue1"];
		if (undefined !== val) {
			this.stringValue1 = uq(val);
		}
		val = vals["stringValue2"];
		if (undefined !== val) {
			this.stringValue2 = uq(val);
		}
	}
};
CT_PivotFilter.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("autoFilter" === elem) {
		newContext = new CT_AutoFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.autoFilter = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_HierarchyUsage() {
//Attributes
	this.hierarchyUsage = null;
}
CT_HierarchyUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["hierarchyUsage"];
		if (undefined !== val) {
			this.hierarchyUsage = val - 0;
		}
	}
};
function CT_Pages() {
//Attributes
	this.count = null;
//Members
	this.page = [];
}
CT_Pages.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Pages.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("page" === elem) {
		newContext = new CT_PCDSCPage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.page.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_RangeSets() {
//Attributes
	this.count = null;
//Members
	this.rangeSet = [];
}
CT_RangeSets.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_RangeSets.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rangeSet" === elem) {
		newContext = new CT_RangeSet();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangeSet.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_SharedItems() {
//Attributes
	this.containsSemiMixedTypes = null;//true
	this.containsNonDate = null;//true
	this.containsDate = null;//false
	this.containsString = null;//true
	this.containsBlank = null;//false
	this.containsMixedTypes = null;//false
	this.containsNumber = null;//false
	this.containsInteger = null;//false
	this.minValue = null;
	this.maxValue = null;
	this.minDate = null;
	this.maxDate = null;
	this.count = null;
	this.longText = null;//false
//Members
	this.Items = [];
//internal
	this._curElem = null;
}
CT_SharedItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["containsSemiMixedTypes"];
		if (undefined !== val) {
			this.containsSemiMixedTypes = getBoolFromXml(val);
		}
		val = vals["containsNonDate"];
		if (undefined !== val) {
			this.containsNonDate = getBoolFromXml(val);
		}
		val = vals["containsDate"];
		if (undefined !== val) {
			this.containsDate = getBoolFromXml(val);
		}
		val = vals["containsString"];
		if (undefined !== val) {
			this.containsString = getBoolFromXml(val);
		}
		val = vals["containsBlank"];
		if (undefined !== val) {
			this.containsBlank = getBoolFromXml(val);
		}
		val = vals["containsMixedTypes"];
		if (undefined !== val) {
			this.containsMixedTypes = getBoolFromXml(val);
		}
		val = vals["containsNumber"];
		if (undefined !== val) {
			this.containsNumber = getBoolFromXml(val);
		}
		val = vals["containsInteger"];
		if (undefined !== val) {
			this.containsInteger = getBoolFromXml(val);
		}
		val = vals["minValue"];
		if (undefined !== val) {
			this.minValue = val - 0;
		}
		val = vals["maxValue"];
		if (undefined !== val) {
			this.maxValue = val - 0;
		}
		val = vals["minDate"];
		if (undefined !== val) {
			this.minDate = uq(val);
		}
		val = vals["maxDate"];
		if (undefined !== val) {
			this.maxDate = uq(val);
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["longText"];
		if (undefined !== val) {
			this.longText = getBoolFromXml(val);
		}
	}
};
CT_SharedItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("b" === elem) {
		newContext = new CT_Boolean();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("d" === elem) {
		newContext = new CT_DateTime();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_SharedItems.prototype.onTextNode = function(text, uq) {
	if ("Items" === this._curElem) {
		this.Items = uq(text);
	}
};
function CT_FieldGroup() {
//Attributes
	this.par = null;
	this.base = null;
//Members
	this.rangePr = null;
	this.discretePr = null;
	this.groupItems = null;
}
CT_FieldGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["par"];
		if (undefined !== val) {
			this.par = val - 0;
		}
		val = vals["base"];
		if (undefined !== val) {
			this.base = val - 0;
		}
	}
};
CT_FieldGroup.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("rangePr" === elem) {
		newContext = new CT_RangePr();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.rangePr = newContext;
	} else if ("discretePr" === elem) {
		newContext = new CT_DiscretePr();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.discretePr = newContext;
	} else if ("groupItems" === elem) {
		newContext = new CT_GroupItems();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupItems = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_X() {
//Attributes
	this.v = null;//0
}
CT_X.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["v"];
		if (undefined !== val) {
			this.v = val - 0;
		}
	}
};
function CT_FieldsUsage() {
//Attributes
	this.count = null;
//Members
	this.fieldUsage = [];
}
CT_FieldsUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_FieldsUsage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("fieldUsage" === elem) {
		newContext = new CT_FieldUsage();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.fieldUsage.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_GroupLevels() {
//Attributes
	this.count = null;
//Members
	this.groupLevel = [];
}
CT_GroupLevels.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_GroupLevels.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupLevel" === elem) {
		newContext = new CT_GroupLevel();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupLevel.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Set() {
//Attributes
	this.count = null;
	this.maxRank = null;
	this.setDefinition = null;
	this.sortType = null;//none
	this.queryFailed = null;//false
//Members
	this.tpls = [];
	this.sortByTuple = null;
}
CT_Set.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["maxRank"];
		if (undefined !== val) {
			this.maxRank = val - 0;
		}
		val = vals["setDefinition"];
		if (undefined !== val) {
			this.setDefinition = uq(val);
		}
		val = vals["sortType"];
		if (undefined !== val) {
			val = FromXml_ST_SortType(val);
			if (-1 !== val) {
				this.sortType = val;
			}
		}
		val = vals["queryFailed"];
		if (undefined !== val) {
			this.queryFailed = getBoolFromXml(val);
		}
	}
};
CT_Set.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls.push(newContext);
	} else if ("sortByTuple" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortByTuple = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Query() {
//Attributes
	this.mdx = null;
//Members
	this.tpls = null;
}
CT_Query.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["mdx"];
		if (undefined !== val) {
			this.mdx = uq(val);
		}
	}
};
CT_Query.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpls" === elem) {
		newContext = new CT_Tuples();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpls = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ServerFormat() {
//Attributes
	this.culture = null;
	this.format = null;
}
CT_ServerFormat.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["culture"];
		if (undefined !== val) {
			this.culture = uq(val);
		}
		val = vals["format"];
		if (undefined !== val) {
			this.format = uq(val);
		}
	}
};
function CT_PivotArea() {
//Attributes
	this.field = null;
	this.type = null;//normal
	this.dataOnly = null;//true
	this.labelOnly = null;//false
	this.grandRow = null;//false
	this.grandCol = null;//false
	this.cacheIndex = null;//false
	this.outline = null;//true
	this.offset = null;
	this.collapsedLevelsAreSubtotals = null;//false
	this.axis = null;
	this.fieldPosition = null;
//Members
	this.references = null;
	this.extLst = null;
}
CT_PivotArea.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_PivotAreaType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["dataOnly"];
		if (undefined !== val) {
			this.dataOnly = getBoolFromXml(val);
		}
		val = vals["labelOnly"];
		if (undefined !== val) {
			this.labelOnly = getBoolFromXml(val);
		}
		val = vals["grandRow"];
		if (undefined !== val) {
			this.grandRow = getBoolFromXml(val);
		}
		val = vals["grandCol"];
		if (undefined !== val) {
			this.grandCol = getBoolFromXml(val);
		}
		val = vals["cacheIndex"];
		if (undefined !== val) {
			this.cacheIndex = getBoolFromXml(val);
		}
		val = vals["outline"];
		if (undefined !== val) {
			this.outline = getBoolFromXml(val);
		}
		val = vals["offset"];
		if (undefined !== val) {
			this.offset = uq(val);
		}
		val = vals["collapsedLevelsAreSubtotals"];
		if (undefined !== val) {
			this.collapsedLevelsAreSubtotals = getBoolFromXml(val);
		}
		val = vals["axis"];
		if (undefined !== val) {
			val = FromXml_ST_Axis(val);
			if (-1 !== val) {
				this.axis = val;
			}
		}
		val = vals["fieldPosition"];
		if (undefined !== val) {
			this.fieldPosition = val - 0;
		}
	}
};
CT_PivotArea.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("references" === elem) {
		newContext = new CT_PivotAreaReferences();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.references = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Tuples() {
//Attributes
	this.c = null;
//Members
	this.tpl = [];
}
CT_Tuples.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["c"];
		if (undefined !== val) {
			this.c = val - 0;
		}
	}
};
CT_Tuples.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("tpl" === elem) {
		newContext = new CT_Tuple();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.tpl.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Items() {
//Attributes
	this.count = null;
//Members
	this.item = [];
}
CT_Items.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Items.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("item" === elem) {
		newContext = new CT_Item();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.item.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_AutoSortScope() {
//Members
	this.pivotArea = null;
}
CT_AutoSortScope.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotAreas() {
//Attributes
	this.count = null;
//Members
	this.pivotArea = [];
}
CT_PivotAreas.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotAreas.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pivotArea" === elem) {
		newContext = new CT_PivotArea();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pivotArea.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_MemberProperties() {
//Attributes
	this.count = null;
//Members
	this.mp = [];
}
CT_MemberProperties.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_MemberProperties.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("mp" === elem) {
		newContext = new CT_MemberProperty();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.mp.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Members() {
//Attributes
	this.count = null;
	this.level = null;
//Members
	this.member = [];
}
CT_Members.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
	}
};
CT_Members.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("member" === elem) {
		newContext = new CT_Member();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.member.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_AutoFilter() {
//Attributes
	this.ref = null;
//Members
	this.filterColumn = [];
	this.sortState = null;
	this.extLst = null;
}
CT_AutoFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
	}
};
CT_AutoFilter.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filterColumn" === elem) {
		newContext = new CT_FilterColumn();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filterColumn.push(newContext);
	} else if ("sortState" === elem) {
		newContext = new CT_SortState();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortState = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PCDSCPage() {
//Attributes
	this.count = null;
//Members
	this.pageItem = [];
}
CT_PCDSCPage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PCDSCPage.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("pageItem" === elem) {
		newContext = new CT_PageItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.pageItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_RangeSet() {
//Attributes
	this.i1 = null;
	this.i2 = null;
	this.i3 = null;
	this.i4 = null;
	this.ref = null;
	this.name = null;
	this.sheet = null;
	this.id = null;
}
CT_RangeSet.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["i1"];
		if (undefined !== val) {
			this.i1 = val - 0;
		}
		val = vals["i2"];
		if (undefined !== val) {
			this.i2 = val - 0;
		}
		val = vals["i3"];
		if (undefined !== val) {
			this.i3 = val - 0;
		}
		val = vals["i4"];
		if (undefined !== val) {
			this.i4 = val - 0;
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["sheet"];
		if (undefined !== val) {
			this.sheet = uq(val);
		}
		val = vals["r:id"];
		if (undefined !== val) {
			this.id = uq(val);
		}
	}
};
function CT_RangePr() {
//Attributes
	this.autoStart = null;//true
	this.autoEnd = null;//true
	this.groupBy = null;//range
	this.startNum = null;
	this.endNum = null;
	this.startDate = null;
	this.endDate = null;
	this.groupInterval = null;//1
}
CT_RangePr.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["autoStart"];
		if (undefined !== val) {
			this.autoStart = getBoolFromXml(val);
		}
		val = vals["autoEnd"];
		if (undefined !== val) {
			this.autoEnd = getBoolFromXml(val);
		}
		val = vals["groupBy"];
		if (undefined !== val) {
			val = FromXml_ST_GroupBy(val);
			if (-1 !== val) {
				this.groupBy = val;
			}
		}
		val = vals["startNum"];
		if (undefined !== val) {
			this.startNum = val - 0;
		}
		val = vals["endNum"];
		if (undefined !== val) {
			this.endNum = val - 0;
		}
		val = vals["startDate"];
		if (undefined !== val) {
			this.startDate = uq(val);
		}
		val = vals["endDate"];
		if (undefined !== val) {
			this.endDate = uq(val);
		}
		val = vals["groupInterval"];
		if (undefined !== val) {
			this.groupInterval = val - 0;
		}
	}
};
function CT_DiscretePr() {
//Attributes
	this.count = null;
//Members
	this.x = [];
}
CT_DiscretePr.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_DiscretePr.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_GroupItems() {
//Attributes
	this.count = null;
//Members
	this.Items = [];
//internal
	this._curElem = null;
}
CT_GroupItems.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_GroupItems.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("b" === elem) {
		newContext = new CT_Boolean();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("d" === elem) {
		newContext = new CT_DateTime();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.Items.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
CT_GroupItems.prototype.onTextNode = function(text, uq) {
	if ("Items" === this._curElem) {
		this.Items = uq(text);
	}
};
function CT_FieldUsage() {
//Attributes
	this.x = null;
}
CT_FieldUsage.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
	}
};
function CT_GroupLevel() {
//Attributes
	this.uniqueName = null;
	this.caption = null;
	this.user = null;//false
	this.customRollUp = null;//false
//Members
	this.groups = null;
	this.extLst = null;
}
CT_GroupLevel.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
		val = vals["user"];
		if (undefined !== val) {
			this.user = getBoolFromXml(val);
		}
		val = vals["customRollUp"];
		if (undefined !== val) {
			this.customRollUp = getBoolFromXml(val);
		}
	}
};
CT_GroupLevel.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groups" === elem) {
		newContext = new CT_Groups();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groups = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotAreaReferences() {
//Attributes
	this.count = null;
//Members
	this.reference = [];
}
CT_PivotAreaReferences.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_PivotAreaReferences.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("reference" === elem) {
		newContext = new CT_PivotAreaReference();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.reference.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_Tuple() {
//Attributes
	this.fld = null;
	this.hier = null;
	this.item = null;
}
CT_Tuple.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["fld"];
		if (undefined !== val) {
			this.fld = val - 0;
		}
		val = vals["hier"];
		if (undefined !== val) {
			this.hier = val - 0;
		}
		val = vals["item"];
		if (undefined !== val) {
			this.item = val - 0;
		}
	}
};
function CT_Item() {
//Attributes
	this.n = null;
	this.t = null;//data
	this.h = null;//false
	this.s = null;//false
	this.sd = null;//true
	this.f = null;//false
	this.m = null;//false
	this.c = null;//false
	this.x = null;
	this.d = null;//false
	this.e = null;//true
}
CT_Item.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["n"];
		if (undefined !== val) {
			this.n = uq(val);
		}
		val = vals["t"];
		if (undefined !== val) {
			val = FromXml_ST_ItemType(val);
			if (-1 !== val) {
				this.t = val;
			}
		}
		val = vals["h"];
		if (undefined !== val) {
			this.h = getBoolFromXml(val);
		}
		val = vals["s"];
		if (undefined !== val) {
			this.s = getBoolFromXml(val);
		}
		val = vals["sd"];
		if (undefined !== val) {
			this.sd = getBoolFromXml(val);
		}
		val = vals["f"];
		if (undefined !== val) {
			this.f = getBoolFromXml(val);
		}
		val = vals["m"];
		if (undefined !== val) {
			this.m = getBoolFromXml(val);
		}
		val = vals["c"];
		if (undefined !== val) {
			this.c = getBoolFromXml(val);
		}
		val = vals["x"];
		if (undefined !== val) {
			this.x = val - 0;
		}
		val = vals["d"];
		if (undefined !== val) {
			this.d = getBoolFromXml(val);
		}
		val = vals["e"];
		if (undefined !== val) {
			this.e = getBoolFromXml(val);
		}
	}
};
function CT_MemberProperty() {
//Attributes
	this.name = null;
	this.showCell = null;//false
	this.showTip = null;//false
	this.showAsCaption = null;//false
	this.nameLen = null;
	this.pPos = null;
	this.pLen = null;
	this.level = null;
	this.field = null;
}
CT_MemberProperty.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["showCell"];
		if (undefined !== val) {
			this.showCell = getBoolFromXml(val);
		}
		val = vals["showTip"];
		if (undefined !== val) {
			this.showTip = getBoolFromXml(val);
		}
		val = vals["showAsCaption"];
		if (undefined !== val) {
			this.showAsCaption = getBoolFromXml(val);
		}
		val = vals["nameLen"];
		if (undefined !== val) {
			this.nameLen = val - 0;
		}
		val = vals["pPos"];
		if (undefined !== val) {
			this.pPos = val - 0;
		}
		val = vals["pLen"];
		if (undefined !== val) {
			this.pLen = val - 0;
		}
		val = vals["level"];
		if (undefined !== val) {
			this.level = val - 0;
		}
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
	}
};
function CT_Member() {
//Attributes
	this.name = null;
}
CT_Member.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
	}
};
function CT_FilterColumn() {
//Attributes
	this.colId = null;
	this.hiddenButton = null;//false
	this.showButton = null;//true
//Members
	this.colorFilter = null;
	this.customFilters = null;
	this.dynamicFilter = null;
	this.extLst = null;
	this.filters = null;
	this.iconFilter = null;
	this.top10 = null;
}
CT_FilterColumn.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["colId"];
		if (undefined !== val) {
			this.colId = val - 0;
		}
		val = vals["hiddenButton"];
		if (undefined !== val) {
			this.hiddenButton = getBoolFromXml(val);
		}
		val = vals["showButton"];
		if (undefined !== val) {
			this.showButton = getBoolFromXml(val);
		}
	}
};
CT_FilterColumn.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("colorFilter" === elem) {
		newContext = new CT_ColorFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.colorFilter = newContext;
	} else if ("customFilters" === elem) {
		newContext = new CT_CustomFilters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.customFilters = newContext;
	} else if ("dynamicFilter" === elem) {
		newContext = new CT_DynamicFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dynamicFilter = newContext;
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else if ("filters" === elem) {
		newContext = new CT_Filters();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filters = newContext;
	} else if ("iconFilter" === elem) {
		newContext = new CT_IconFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.iconFilter = newContext;
	} else if ("top10" === elem) {
		newContext = new CT_Top10();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.top10 = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_SortState() {
//Attributes
	this.columnSort = null;//false
	this.caseSensitive = null;//false
	this.sortMethod = null;//none
	this.ref = null;
//Members
	this.sortCondition = [];
	this.extLst = null;
}
CT_SortState.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["columnSort"];
		if (undefined !== val) {
			this.columnSort = getBoolFromXml(val);
		}
		val = vals["caseSensitive"];
		if (undefined !== val) {
			this.caseSensitive = getBoolFromXml(val);
		}
		val = vals["sortMethod"];
		if (undefined !== val) {
			val = FromXml_ST_SortMethod(val);
			if (-1 !== val) {
				this.sortMethod = val;
			}
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
	}
};
CT_SortState.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("sortCondition" === elem) {
		newContext = new CT_SortCondition();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.sortCondition.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PageItem() {
//Attributes
	this.name = null;
}
CT_PageItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
	}
};
function CT_Groups() {
//Attributes
	this.count = null;
//Members
	this.group = [];
}
CT_Groups.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_Groups.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("group" === elem) {
		newContext = new CT_LevelGroup();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.group.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_PivotAreaReference() {
//Attributes
	this.field = null;
	this.count = null;
	this.selected = null;//true
	this.byPosition = null;//false
	this.relative = null;//false
	this.defaultSubtotal = null;//false
	this.sumSubtotal = null;//false
	this.countASubtotal = null;//false
	this.avgSubtotal = null;//false
	this.maxSubtotal = null;//false
	this.minSubtotal = null;//false
	this.productSubtotal = null;//false
	this.countSubtotal = null;//false
	this.stdDevSubtotal = null;//false
	this.stdDevPSubtotal = null;//false
	this.varSubtotal = null;//false
	this.varPSubtotal = null;//false
//Members
	this.x = [];
	this.extLst = null;
}
CT_PivotAreaReference.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["field"];
		if (undefined !== val) {
			this.field = val - 0;
		}
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
		val = vals["selected"];
		if (undefined !== val) {
			this.selected = getBoolFromXml(val);
		}
		val = vals["byPosition"];
		if (undefined !== val) {
			this.byPosition = getBoolFromXml(val);
		}
		val = vals["relative"];
		if (undefined !== val) {
			this.relative = getBoolFromXml(val);
		}
		val = vals["defaultSubtotal"];
		if (undefined !== val) {
			this.defaultSubtotal = getBoolFromXml(val);
		}
		val = vals["sumSubtotal"];
		if (undefined !== val) {
			this.sumSubtotal = getBoolFromXml(val);
		}
		val = vals["countASubtotal"];
		if (undefined !== val) {
			this.countASubtotal = getBoolFromXml(val);
		}
		val = vals["avgSubtotal"];
		if (undefined !== val) {
			this.avgSubtotal = getBoolFromXml(val);
		}
		val = vals["maxSubtotal"];
		if (undefined !== val) {
			this.maxSubtotal = getBoolFromXml(val);
		}
		val = vals["minSubtotal"];
		if (undefined !== val) {
			this.minSubtotal = getBoolFromXml(val);
		}
		val = vals["productSubtotal"];
		if (undefined !== val) {
			this.productSubtotal = getBoolFromXml(val);
		}
		val = vals["countSubtotal"];
		if (undefined !== val) {
			this.countSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevSubtotal"];
		if (undefined !== val) {
			this.stdDevSubtotal = getBoolFromXml(val);
		}
		val = vals["stdDevPSubtotal"];
		if (undefined !== val) {
			this.stdDevPSubtotal = getBoolFromXml(val);
		}
		val = vals["varSubtotal"];
		if (undefined !== val) {
			this.varSubtotal = getBoolFromXml(val);
		}
		val = vals["varPSubtotal"];
		if (undefined !== val) {
			this.varPSubtotal = getBoolFromXml(val);
		}
	}
};
CT_PivotAreaReference.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.x.push(newContext);
	} else if ("extLst" === elem) {
		newContext = new CT_ExtensionList();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.extLst = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_ColorFilter() {
//Attributes
	this.dxfId = null;
	this.cellColor = null;//true
}
CT_ColorFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
		val = vals["cellColor"];
		if (undefined !== val) {
			this.cellColor = getBoolFromXml(val);
		}
	}
};
function CT_CustomFilters() {
//Attributes
	this.and = null;//false
//Members
	this.customFilter = [];
}
CT_CustomFilters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["and"];
		if (undefined !== val) {
			this.and = getBoolFromXml(val);
		}
	}
};
CT_CustomFilters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("customFilter" === elem) {
		newContext = new CT_CustomFilter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.customFilter.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_DynamicFilter() {
//Attributes
	this.type = null;
	this.val = null;
	this.valIso = null;
	this.maxValIso = null;
}
CT_DynamicFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["type"];
		if (undefined !== val) {
			val = FromXml_ST_DynamicFilterType(val);
			if (-1 !== val) {
				this.type = val;
			}
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = val - 0;
		}
		val = vals["valIso"];
		if (undefined !== val) {
			this.valIso = uq(val);
		}
		val = vals["maxValIso"];
		if (undefined !== val) {
			this.maxValIso = uq(val);
		}
	}
};
function CT_Filters() {
//Attributes
	this.blank = null;//false
	this.calendarType = null;//none
//Members
	this.filter = [];
	this.dateGroupItem = [];
}
CT_Filters.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["blank"];
		if (undefined !== val) {
			this.blank = getBoolFromXml(val);
		}
		val = vals["calendarType"];
		if (undefined !== val) {
			val = FromXml_ST_CalendarType(val);
			if (-1 !== val) {
				this.calendarType = val;
			}
		}
	}
};
CT_Filters.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("filter" === elem) {
		newContext = new CT_Filter();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.filter.push(newContext);
	} else if ("dateGroupItem" === elem) {
		newContext = new CT_DateGroupItem();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.dateGroupItem.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_IconFilter() {
//Attributes
	this.iconSet = null;
	this.iconId = null;
}
CT_IconFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["iconSet"];
		if (undefined !== val) {
			val = FromXml_ST_IconSetType(val);
			if (-1 !== val) {
				this.iconSet = val;
			}
		}
		val = vals["iconId"];
		if (undefined !== val) {
			this.iconId = val - 0;
		}
	}
};
function CT_Top10() {
//Attributes
	this.top = null;//true
	this.percent = null;//false
	this.val = null;
	this.filterVal = null;
}
CT_Top10.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["top"];
		if (undefined !== val) {
			this.top = getBoolFromXml(val);
		}
		val = vals["percent"];
		if (undefined !== val) {
			this.percent = getBoolFromXml(val);
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = val - 0;
		}
		val = vals["filterVal"];
		if (undefined !== val) {
			this.filterVal = val - 0;
		}
	}
};
function CT_SortCondition() {
//Attributes
	this.descending = null;//false
	this.sortBy = null;//value
	this.ref = null;
	this.customList = null;
	this.dxfId = null;
	this.iconSet = null;//item3arrows
	this.iconId = null;
}
CT_SortCondition.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["descending"];
		if (undefined !== val) {
			this.descending = getBoolFromXml(val);
		}
		val = vals["sortBy"];
		if (undefined !== val) {
			val = FromXml_ST_SortBy(val);
			if (-1 !== val) {
				this.sortBy = val;
			}
		}
		val = vals["ref"];
		if (undefined !== val) {
			this.ref = uq(val);
		}
		val = vals["customList"];
		if (undefined !== val) {
			this.customList = uq(val);
		}
		val = vals["dxfId"];
		if (undefined !== val) {
			this.dxfId = val - 0;
		}
		val = vals["iconSet"];
		if (undefined !== val) {
			val = FromXml_ST_IconSetType(val);
			if (-1 !== val) {
				this.iconSet = val;
			}
		}
		val = vals["iconId"];
		if (undefined !== val) {
			this.iconId = val - 0;
		}
	}
};
function CT_LevelGroup() {
//Attributes
	this.name = null;
	this.uniqueName = null;
	this.caption = null;
	this.uniqueParent = null;
	this.id = null;
//Members
	this.groupMembers = null;
}
CT_LevelGroup.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["name"];
		if (undefined !== val) {
			this.name = uq(val);
		}
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["caption"];
		if (undefined !== val) {
			this.caption = uq(val);
		}
		val = vals["uniqueParent"];
		if (undefined !== val) {
			this.uniqueParent = uq(val);
		}
		val = vals["id"];
		if (undefined !== val) {
			this.id = val - 0;
		}
	}
};
CT_LevelGroup.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupMembers" === elem) {
		newContext = new CT_GroupMembers();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupMembers = newContext;
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_CustomFilter() {
//Attributes
	this.operator = null;//equal
	this.val = null;
}
CT_CustomFilter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["operator"];
		if (undefined !== val) {
			val = FromXml_ST_FilterOperator(val);
			if (-1 !== val) {
				this.operator = val;
			}
		}
		val = vals["val"];
		if (undefined !== val) {
			this.val = uq(val);
		}
	}
};
function CT_Filter() {
//Attributes
	this.val = null;
}
CT_Filter.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["val"];
		if (undefined !== val) {
			this.val = uq(val);
		}
	}
};
function CT_DateGroupItem() {
//Attributes
	this.year = null;
	this.month = null;
	this.day = null;
	this.hour = null;
	this.minute = null;
	this.second = null;
	this.dateTimeGrouping = null;
}
CT_DateGroupItem.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["year"];
		if (undefined !== val) {
			this.year = val - 0;
		}
		val = vals["month"];
		if (undefined !== val) {
			this.month = val - 0;
		}
		val = vals["day"];
		if (undefined !== val) {
			this.day = val - 0;
		}
		val = vals["hour"];
		if (undefined !== val) {
			this.hour = val - 0;
		}
		val = vals["minute"];
		if (undefined !== val) {
			this.minute = val - 0;
		}
		val = vals["second"];
		if (undefined !== val) {
			this.second = val - 0;
		}
		val = vals["dateTimeGrouping"];
		if (undefined !== val) {
			val = FromXml_ST_DateTimeGrouping(val);
			if (-1 !== val) {
				this.dateTimeGrouping = val;
			}
		}
	}
};
function CT_GroupMembers() {
//Attributes
	this.count = null;
//Members
	this.groupMember = [];
}
CT_GroupMembers.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["count"];
		if (undefined !== val) {
			this.count = val - 0;
		}
	}
};
CT_GroupMembers.prototype.onStartNode = function(elem, attr, uq) {
	var newContext = this;
	if ("groupMember" === elem) {
		newContext = new CT_GroupMember();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this.groupMember.push(newContext);
	} else {
		newContext = null;
	}
	return newContext;
};
function CT_GroupMember() {
//Attributes
	this.uniqueName = null;
	this.group = null;//false
}
CT_GroupMember.prototype.readAttributes = function(attr, uq) {
	if (attr()) {
		var vals = attr();
		var val;
		val = vals["uniqueName"];
		if (undefined !== val) {
			this.uniqueName = uq(val);
		}
		val = vals["group"];
		if (undefined !== val) {
			this.group = getBoolFromXml(val);
		}
	}
};
