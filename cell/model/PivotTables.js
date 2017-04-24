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
function ToXml_ST_SourceType(val) {
	var res = "";
	if (st_sourcetypeWORKSHEET === val) {
		res = "worksheet";
	} else if (st_sourcetypeEXTERNAL === val) {
		res = "external";
	} else if (st_sourcetypeCONSOLIDATION === val) {
		res = "consolidation";
	} else if (st_sourcetypeSCENARIO === val) {
		res = "scenario";
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
function ToXml_ST_Axis(val) {
	var res = "";
	if (st_axisAXISROW === val) {
		res = "axisRow";
	} else if (st_axisAXISCOL === val) {
		res = "axisCol";
	} else if (st_axisAXISPAGE === val) {
		res = "axisPage";
	} else if (st_axisAXISVALUES === val) {
		res = "axisValues";
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
function ToXml_ST_FieldSortType(val) {
	var res = "";
	if (st_fieldsorttypeMANUAL === val) {
		res = "manual";
	} else if (st_fieldsorttypeASCENDING === val) {
		res = "ascending";
	} else if (st_fieldsorttypeDESCENDING === val) {
		res = "descending";
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
function ToXml_ST_ItemType(val) {
	var res = "";
	if (st_itemtypeDATA === val) {
		res = "data";
	} else if (st_itemtypeDEFAULT === val) {
		res = "default";
	} else if (st_itemtypeSUM === val) {
		res = "sum";
	} else if (st_itemtypeCOUNTA === val) {
		res = "countA";
	} else if (st_itemtypeAVG === val) {
		res = "avg";
	} else if (st_itemtypeMAX === val) {
		res = "max";
	} else if (st_itemtypeMIN === val) {
		res = "min";
	} else if (st_itemtypePRODUCT === val) {
		res = "product";
	} else if (st_itemtypeCOUNT === val) {
		res = "count";
	} else if (st_itemtypeSTDDEV === val) {
		res = "stdDev";
	} else if (st_itemtypeSTDDEVP === val) {
		res = "stdDevP";
	} else if (st_itemtypeVAR === val) {
		res = "var";
	} else if (st_itemtypeVARP === val) {
		res = "varP";
	} else if (st_itemtypeGRAND === val) {
		res = "grand";
	} else if (st_itemtypeBLANK === val) {
		res = "blank";
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
function ToXml_ST_DataConsolidateFunction(val) {
	var res = "";
	if (st_dataconsolidatefunctionAVERAGE === val) {
		res = "average";
	} else if (st_dataconsolidatefunctionCOUNT === val) {
		res = "count";
	} else if (st_dataconsolidatefunctionCOUNTNUMS === val) {
		res = "countNums";
	} else if (st_dataconsolidatefunctionMAX === val) {
		res = "max";
	} else if (st_dataconsolidatefunctionMIN === val) {
		res = "min";
	} else if (st_dataconsolidatefunctionPRODUCT === val) {
		res = "product";
	} else if (st_dataconsolidatefunctionSTDDEV === val) {
		res = "stdDev";
	} else if (st_dataconsolidatefunctionSTDDEVP === val) {
		res = "stdDevp";
	} else if (st_dataconsolidatefunctionSUM === val) {
		res = "sum";
	} else if (st_dataconsolidatefunctionVAR === val) {
		res = "var";
	} else if (st_dataconsolidatefunctionVARP === val) {
		res = "varp";
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
function ToXml_ST_ShowDataAs(val) {
	var res = "";
	if (st_showdataasNORMAL === val) {
		res = "normal";
	} else if (st_showdataasDIFFERENCE === val) {
		res = "difference";
	} else if (st_showdataasPERCENT === val) {
		res = "percent";
	} else if (st_showdataasPERCENTDIFF === val) {
		res = "percentDiff";
	} else if (st_showdataasRUNTOTAL === val) {
		res = "runTotal";
	} else if (st_showdataasPERCENTOFROW === val) {
		res = "percentOfRow";
	} else if (st_showdataasPERCENTOFCOL === val) {
		res = "percentOfCol";
	} else if (st_showdataasPERCENTOFTOTAL === val) {
		res = "percentOfTotal";
	} else if (st_showdataasINDEX === val) {
		res = "index";
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
function ToXml_ST_FormatAction(val) {
	var res = "";
	if (st_formatactionBLANK === val) {
		res = "blank";
	} else if (st_formatactionFORMATTING === val) {
		res = "formatting";
	} else if (st_formatactionDRILL === val) {
		res = "drill";
	} else if (st_formatactionFORMULA === val) {
		res = "formula";
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
function ToXml_ST_Scope(val) {
	var res = "";
	if (st_scopeSELECTION === val) {
		res = "selection";
	} else if (st_scopeDATA === val) {
		res = "data";
	} else if (st_scopeFIELD === val) {
		res = "field";
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
function ToXml_ST_Type(val) {
	var res = "";
	if (st_typeNONE === val) {
		res = "none";
	} else if (st_typeALL === val) {
		res = "all";
	} else if (st_typeROW === val) {
		res = "row";
	} else if (st_typeCOLUMN === val) {
		res = "column";
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
function ToXml_ST_PivotFilterType(val) {
	var res = "";
	if (st_pivotfiltertypeUNKNOWN === val) {
		res = "unknown";
	} else if (st_pivotfiltertypeCOUNT === val) {
		res = "count";
	} else if (st_pivotfiltertypePERCENT === val) {
		res = "percent";
	} else if (st_pivotfiltertypeSUM === val) {
		res = "sum";
	} else if (st_pivotfiltertypeCAPTIONEQUAL === val) {
		res = "captionEqual";
	} else if (st_pivotfiltertypeCAPTIONNOTEQUAL === val) {
		res = "captionNotEqual";
	} else if (st_pivotfiltertypeCAPTIONBEGINSWITH === val) {
		res = "captionBeginsWith";
	} else if (st_pivotfiltertypeCAPTIONNOTBEGINSWITH === val) {
		res = "captionNotBeginsWith";
	} else if (st_pivotfiltertypeCAPTIONENDSWITH === val) {
		res = "captionEndsWith";
	} else if (st_pivotfiltertypeCAPTIONNOTENDSWITH === val) {
		res = "captionNotEndsWith";
	} else if (st_pivotfiltertypeCAPTIONCONTAINS === val) {
		res = "captionContains";
	} else if (st_pivotfiltertypeCAPTIONNOTCONTAINS === val) {
		res = "captionNotContains";
	} else if (st_pivotfiltertypeCAPTIONGREATERTHAN === val) {
		res = "captionGreaterThan";
	} else if (st_pivotfiltertypeCAPTIONGREATERTHANOREQUAL === val) {
		res = "captionGreaterThanOrEqual";
	} else if (st_pivotfiltertypeCAPTIONLESSTHAN === val) {
		res = "captionLessThan";
	} else if (st_pivotfiltertypeCAPTIONLESSTHANOREQUAL === val) {
		res = "captionLessThanOrEqual";
	} else if (st_pivotfiltertypeCAPTIONBETWEEN === val) {
		res = "captionBetween";
	} else if (st_pivotfiltertypeCAPTIONNOTBETWEEN === val) {
		res = "captionNotBetween";
	} else if (st_pivotfiltertypeVALUEEQUAL === val) {
		res = "valueEqual";
	} else if (st_pivotfiltertypeVALUENOTEQUAL === val) {
		res = "valueNotEqual";
	} else if (st_pivotfiltertypeVALUEGREATERTHAN === val) {
		res = "valueGreaterThan";
	} else if (st_pivotfiltertypeVALUEGREATERTHANOREQUAL === val) {
		res = "valueGreaterThanOrEqual";
	} else if (st_pivotfiltertypeVALUELESSTHAN === val) {
		res = "valueLessThan";
	} else if (st_pivotfiltertypeVALUELESSTHANOREQUAL === val) {
		res = "valueLessThanOrEqual";
	} else if (st_pivotfiltertypeVALUEBETWEEN === val) {
		res = "valueBetween";
	} else if (st_pivotfiltertypeVALUENOTBETWEEN === val) {
		res = "valueNotBetween";
	} else if (st_pivotfiltertypeDATEEQUAL === val) {
		res = "dateEqual";
	} else if (st_pivotfiltertypeDATENOTEQUAL === val) {
		res = "dateNotEqual";
	} else if (st_pivotfiltertypeDATEOLDERTHAN === val) {
		res = "dateOlderThan";
	} else if (st_pivotfiltertypeDATEOLDERTHANOREQUAL === val) {
		res = "dateOlderThanOrEqual";
	} else if (st_pivotfiltertypeDATENEWERTHAN === val) {
		res = "dateNewerThan";
	} else if (st_pivotfiltertypeDATENEWERTHANOREQUAL === val) {
		res = "dateNewerThanOrEqual";
	} else if (st_pivotfiltertypeDATEBETWEEN === val) {
		res = "dateBetween";
	} else if (st_pivotfiltertypeDATENOTBETWEEN === val) {
		res = "dateNotBetween";
	} else if (st_pivotfiltertypeTOMORROW === val) {
		res = "tomorrow";
	} else if (st_pivotfiltertypeTODAY === val) {
		res = "today";
	} else if (st_pivotfiltertypeYESTERDAY === val) {
		res = "yesterday";
	} else if (st_pivotfiltertypeNEXTWEEK === val) {
		res = "nextWeek";
	} else if (st_pivotfiltertypeTHISWEEK === val) {
		res = "thisWeek";
	} else if (st_pivotfiltertypeLASTWEEK === val) {
		res = "lastWeek";
	} else if (st_pivotfiltertypeNEXTMONTH === val) {
		res = "nextMonth";
	} else if (st_pivotfiltertypeTHISMONTH === val) {
		res = "thisMonth";
	} else if (st_pivotfiltertypeLASTMONTH === val) {
		res = "lastMonth";
	} else if (st_pivotfiltertypeNEXTQUARTER === val) {
		res = "nextQuarter";
	} else if (st_pivotfiltertypeTHISQUARTER === val) {
		res = "thisQuarter";
	} else if (st_pivotfiltertypeLASTQUARTER === val) {
		res = "lastQuarter";
	} else if (st_pivotfiltertypeNEXTYEAR === val) {
		res = "nextYear";
	} else if (st_pivotfiltertypeTHISYEAR === val) {
		res = "thisYear";
	} else if (st_pivotfiltertypeLASTYEAR === val) {
		res = "lastYear";
	} else if (st_pivotfiltertypeYEARTODATE === val) {
		res = "yearToDate";
	} else if (st_pivotfiltertypeQ1 === val) {
		res = "Q1";
	} else if (st_pivotfiltertypeQ2 === val) {
		res = "Q2";
	} else if (st_pivotfiltertypeQ3 === val) {
		res = "Q3";
	} else if (st_pivotfiltertypeQ4 === val) {
		res = "Q4";
	} else if (st_pivotfiltertypeM1 === val) {
		res = "M1";
	} else if (st_pivotfiltertypeM2 === val) {
		res = "M2";
	} else if (st_pivotfiltertypeM3 === val) {
		res = "M3";
	} else if (st_pivotfiltertypeM4 === val) {
		res = "M4";
	} else if (st_pivotfiltertypeM5 === val) {
		res = "M5";
	} else if (st_pivotfiltertypeM6 === val) {
		res = "M6";
	} else if (st_pivotfiltertypeM7 === val) {
		res = "M7";
	} else if (st_pivotfiltertypeM8 === val) {
		res = "M8";
	} else if (st_pivotfiltertypeM9 === val) {
		res = "M9";
	} else if (st_pivotfiltertypeM10 === val) {
		res = "M10";
	} else if (st_pivotfiltertypeM11 === val) {
		res = "M11";
	} else if (st_pivotfiltertypeM12 === val) {
		res = "M12";
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
function ToXml_ST_SortType(val) {
	var res = "";
	if (st_sorttypeNONE === val) {
		res = "none";
	} else if (st_sorttypeASCENDING === val) {
		res = "ascending";
	} else if (st_sorttypeDESCENDING === val) {
		res = "descending";
	} else if (st_sorttypeASCENDINGALPHA === val) {
		res = "ascendingAlpha";
	} else if (st_sorttypeDESCENDINGALPHA === val) {
		res = "descendingAlpha";
	} else if (st_sorttypeASCENDINGNATURAL === val) {
		res = "ascendingNatural";
	} else if (st_sorttypeDESCENDINGNATURAL === val) {
		res = "descendingNatural";
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
function ToXml_ST_PivotAreaType(val) {
	var res = "";
	if (st_pivotareatypeNONE === val) {
		res = "none";
	} else if (st_pivotareatypeNORMAL === val) {
		res = "normal";
	} else if (st_pivotareatypeDATA === val) {
		res = "data";
	} else if (st_pivotareatypeALL === val) {
		res = "all";
	} else if (st_pivotareatypeORIGIN === val) {
		res = "origin";
	} else if (st_pivotareatypeBUTTON === val) {
		res = "button";
	} else if (st_pivotareatypeTOPEND === val) {
		res = "topEnd";
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
function ToXml_ST_GroupBy(val) {
	var res = "";
	if (st_groupbyRANGE === val) {
		res = "range";
	} else if (st_groupbySECONDS === val) {
		res = "seconds";
	} else if (st_groupbyMINUTES === val) {
		res = "minutes";
	} else if (st_groupbyHOURS === val) {
		res = "hours";
	} else if (st_groupbyDAYS === val) {
		res = "days";
	} else if (st_groupbyMONTHS === val) {
		res = "months";
	} else if (st_groupbyQUARTERS === val) {
		res = "quarters";
	} else if (st_groupbyYEARS === val) {
		res = "years";
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
function ToXml_ST_SortMethod(val) {
	var res = "";
	if (st_sortmethodSTROKE === val) {
		res = "stroke";
	} else if (st_sortmethodPINYIN === val) {
		res = "pinYin";
	} else if (st_sortmethodNONE === val) {
		res = "none";
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
function ToXml_ST_DynamicFilterType(val) {
	var res = "";
	if (st_dynamicfiltertypeNULL === val) {
		res = "null";
	} else if (st_dynamicfiltertypeABOVEAVERAGE === val) {
		res = "aboveAverage";
	} else if (st_dynamicfiltertypeBELOWAVERAGE === val) {
		res = "belowAverage";
	} else if (st_dynamicfiltertypeTOMORROW === val) {
		res = "tomorrow";
	} else if (st_dynamicfiltertypeTODAY === val) {
		res = "today";
	} else if (st_dynamicfiltertypeYESTERDAY === val) {
		res = "yesterday";
	} else if (st_dynamicfiltertypeNEXTWEEK === val) {
		res = "nextWeek";
	} else if (st_dynamicfiltertypeTHISWEEK === val) {
		res = "thisWeek";
	} else if (st_dynamicfiltertypeLASTWEEK === val) {
		res = "lastWeek";
	} else if (st_dynamicfiltertypeNEXTMONTH === val) {
		res = "nextMonth";
	} else if (st_dynamicfiltertypeTHISMONTH === val) {
		res = "thisMonth";
	} else if (st_dynamicfiltertypeLASTMONTH === val) {
		res = "lastMonth";
	} else if (st_dynamicfiltertypeNEXTQUARTER === val) {
		res = "nextQuarter";
	} else if (st_dynamicfiltertypeTHISQUARTER === val) {
		res = "thisQuarter";
	} else if (st_dynamicfiltertypeLASTQUARTER === val) {
		res = "lastQuarter";
	} else if (st_dynamicfiltertypeNEXTYEAR === val) {
		res = "nextYear";
	} else if (st_dynamicfiltertypeTHISYEAR === val) {
		res = "thisYear";
	} else if (st_dynamicfiltertypeLASTYEAR === val) {
		res = "lastYear";
	} else if (st_dynamicfiltertypeYEARTODATE === val) {
		res = "yearToDate";
	} else if (st_dynamicfiltertypeQ1 === val) {
		res = "Q1";
	} else if (st_dynamicfiltertypeQ2 === val) {
		res = "Q2";
	} else if (st_dynamicfiltertypeQ3 === val) {
		res = "Q3";
	} else if (st_dynamicfiltertypeQ4 === val) {
		res = "Q4";
	} else if (st_dynamicfiltertypeM1 === val) {
		res = "M1";
	} else if (st_dynamicfiltertypeM2 === val) {
		res = "M2";
	} else if (st_dynamicfiltertypeM3 === val) {
		res = "M3";
	} else if (st_dynamicfiltertypeM4 === val) {
		res = "M4";
	} else if (st_dynamicfiltertypeM5 === val) {
		res = "M5";
	} else if (st_dynamicfiltertypeM6 === val) {
		res = "M6";
	} else if (st_dynamicfiltertypeM7 === val) {
		res = "M7";
	} else if (st_dynamicfiltertypeM8 === val) {
		res = "M8";
	} else if (st_dynamicfiltertypeM9 === val) {
		res = "M9";
	} else if (st_dynamicfiltertypeM10 === val) {
		res = "M10";
	} else if (st_dynamicfiltertypeM11 === val) {
		res = "M11";
	} else if (st_dynamicfiltertypeM12 === val) {
		res = "M12";
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
function ToXml_ST_CalendarType(val) {
	var res = "";
	if (st_calendartypeGREGORIAN === val) {
		res = "gregorian";
	} else if (st_calendartypeGREGORIANUS === val) {
		res = "gregorianUs";
	} else if (st_calendartypeGREGORIANMEFRENCH === val) {
		res = "gregorianMeFrench";
	} else if (st_calendartypeGREGORIANARABIC === val) {
		res = "gregorianArabic";
	} else if (st_calendartypeHIJRI === val) {
		res = "hijri";
	} else if (st_calendartypeHEBREW === val) {
		res = "hebrew";
	} else if (st_calendartypeTAIWAN === val) {
		res = "taiwan";
	} else if (st_calendartypeJAPAN === val) {
		res = "japan";
	} else if (st_calendartypeTHAI === val) {
		res = "thai";
	} else if (st_calendartypeKOREA === val) {
		res = "korea";
	} else if (st_calendartypeSAKA === val) {
		res = "saka";
	} else if (st_calendartypeGREGORIANXLITENGLISH === val) {
		res = "gregorianXlitEnglish";
	} else if (st_calendartypeGREGORIANXLITFRENCH === val) {
		res = "gregorianXlitFrench";
	} else if (st_calendartypeNONE === val) {
		res = "none";
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
function ToXml_ST_IconSetType(val) {
	var res = "";
	if (st_iconsettype3ARROWS === val) {
		res = "3Arrows";
	} else if (st_iconsettype3ARROWSGRAY === val) {
		res = "3ArrowsGray";
	} else if (st_iconsettype3FLAGS === val) {
		res = "3Flags";
	} else if (st_iconsettype3TRAFFICLIGHTS1 === val) {
		res = "3TrafficLights1";
	} else if (st_iconsettype3TRAFFICLIGHTS2 === val) {
		res = "3TrafficLights2";
	} else if (st_iconsettype3SIGNS === val) {
		res = "3Signs";
	} else if (st_iconsettype3SYMBOLS === val) {
		res = "3Symbols";
	} else if (st_iconsettype3SYMBOLS2 === val) {
		res = "3Symbols2";
	} else if (st_iconsettype4ARROWS === val) {
		res = "4Arrows";
	} else if (st_iconsettype4ARROWSGRAY === val) {
		res = "4ArrowsGray";
	} else if (st_iconsettype4REDTOBLACK === val) {
		res = "4RedToBlack";
	} else if (st_iconsettype4RATING === val) {
		res = "4Rating";
	} else if (st_iconsettype4TRAFFICLIGHTS === val) {
		res = "4TrafficLights";
	} else if (st_iconsettype5ARROWS === val) {
		res = "5Arrows";
	} else if (st_iconsettype5ARROWSGRAY === val) {
		res = "5ArrowsGray";
	} else if (st_iconsettype5RATING === val) {
		res = "5Rating";
	} else if (st_iconsettype5QUARTERS === val) {
		res = "5Quarters";
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
function ToXml_ST_SortBy(val) {
	var res = "";
	if (st_sortbyVALUE === val) {
		res = "value";
	} else if (st_sortbyCELLCOLOR === val) {
		res = "cellColor";
	} else if (st_sortbyFONTCOLOR === val) {
		res = "fontColor";
	} else if (st_sortbyICON === val) {
		res = "icon";
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
function ToXml_ST_FilterOperator(val) {
	var res = "";
	if (st_filteroperatorEQUAL === val) {
		res = "equal";
	} else if (st_filteroperatorLESSTHAN === val) {
		res = "lessThan";
	} else if (st_filteroperatorLESSTHANOREQUAL === val) {
		res = "lessThanOrEqual";
	} else if (st_filteroperatorNOTEQUAL === val) {
		res = "notEqual";
	} else if (st_filteroperatorGREATERTHANOREQUAL === val) {
		res = "greaterThanOrEqual";
	} else if (st_filteroperatorGREATERTHAN === val) {
		res = "greaterThan";
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
function ToXml_ST_DateTimeGrouping(val) {
	var res = "";
	if (st_datetimegroupingYEAR === val) {
		res = "year";
	} else if (st_datetimegroupingMONTH === val) {
		res = "month";
	} else if (st_datetimegroupingDAY === val) {
		res = "day";
	} else if (st_datetimegroupingHOUR === val) {
		res = "hour";
	} else if (st_datetimegroupingMINUTE === val) {
		res = "minute";
	} else if (st_datetimegroupingSECOND === val) {
		res = "second";
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
	this.refreshedDate = null;
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
		val = vals["refreshedDate"];
		if (undefined !== val) {
			this.refreshedDate = val - 0;
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
CT_PivotCacheDefinition.prototype.toXml = function(writer) {
	var res = "";
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotCacheDefinition");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	if (null !== this.id) {
		writer.WriteXmlAttributeString("r:id", this.id);
	}
	if (null !== this.invalid) {
		writer.WriteXmlAttributeBool("invalid", this.invalid);
	}
	if (null !== this.saveData) {
		writer.WriteXmlAttributeBool("saveData", this.saveData);
	}
	if (null !== this.refreshOnLoad) {
		writer.WriteXmlAttributeBool("refreshOnLoad", this.refreshOnLoad);
	}
	if (null !== this.optimizeMemory) {
		writer.WriteXmlAttributeBool("optimizeMemory", this.optimizeMemory);
	}
	if (null !== this.enableRefresh) {
		writer.WriteXmlAttributeBool("enableRefresh", this.enableRefresh);
	}
	if (null !== this.refreshedBy) {
		writer.WriteXmlAttributeString("refreshedBy", this.refreshedBy);
	}
	if (null !== this.refreshedDate) {
		writer.WriteXmlAttributeNumber("refreshedDate", this.refreshedDate);
	}
	if (null !== this.backgroundQuery) {
		writer.WriteXmlAttributeBool("backgroundQuery", this.backgroundQuery);
	}
	if (null !== this.missingItemsLimit) {
		writer.WriteXmlAttributeNumber("missingItemsLimit", this.missingItemsLimit);
	}
	if (null !== this.createdVersion) {
		writer.WriteXmlAttributeNumber("createdVersion", this.createdVersion);
	}
	if (null !== this.refreshedVersion) {
		writer.WriteXmlAttributeNumber("refreshedVersion", this.refreshedVersion);
	}
	if (null !== this.minRefreshableVersion) {
		writer.WriteXmlAttributeNumber("minRefreshableVersion", this.minRefreshableVersion);
	}
	if (null !== this.recordCount) {
		writer.WriteXmlAttributeNumber("recordCount", this.recordCount);
	}
	if (null !== this.upgradeOnRefresh) {
		writer.WriteXmlAttributeBool("upgradeOnRefresh", this.upgradeOnRefresh);
	}
	if (null !== this.tupleCache) {
		writer.WriteXmlAttributeBool("tupleCache", this.tupleCache);
	}
	if (null !== this.supportSubquery) {
		writer.WriteXmlAttributeBool("supportSubquery", this.supportSubquery);
	}
	if (null !== this.supportAdvancedDrill) {
		writer.WriteXmlAttributeBool("supportAdvancedDrill", this.supportAdvancedDrill);
	}
	writer.WriteXmlNodeEnd("pivotCacheDefinition", true);
	if (null !== this.cacheSource) {
		res += this.cacheSource.toXml(writer, "cacheSource");
	}
	if (null !== this.cacheFields) {
		res += this.cacheFields.toXml(writer, "cacheFields");
	}
	if (null !== this.cacheHierarchies) {
		res += this.cacheHierarchies.toXml(writer, "cacheHierarchies");
	}
	if (null !== this.kpis) {
		res += this.kpis.toXml(writer, "kpis");
	}
	if (null !== this.tupleCache) {
		res += this.tupleCache.toXml(writer, "tupleCache");
	}
	if (null !== this.calculatedItems) {
		res += this.calculatedItems.toXml(writer, "calculatedItems");
	}
	if (null !== this.calculatedMembers) {
		res += this.calculatedMembers.toXml(writer, "calculatedMembers");
	}
	if (null !== this.dimensions) {
		res += this.dimensions.toXml(writer, "dimensions");
	}
	if (null !== this.measureGroups) {
		res += this.measureGroups.toXml(writer, "measureGroups");
	}
	if (null !== this.maps) {
		res += this.maps.toXml(writer, "maps");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotCacheDefinition");
	return res;
};
function CT_PivotCacheRecords() {
//Attributes
	this.count = null;
//Members
	this.r = null;
	this.extLst = null;
//internal
	this._curArray = null;
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
		this._curArray = [];
		this.r = [];
	} else if ("b" === elem) {
		newContext = new CT_Boolean();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("d" === elem) {
		newContext = new CT_DateTime();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("e" === elem) {
		newContext = new CT_Error();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("m" === elem) {
		newContext = new CT_Missing();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("n" === elem) {
		newContext = new CT_Number();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("s" === elem) {
		newContext = new CT_String();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
	} else if ("x" === elem) {
		newContext = new CT_Index();
		if (newContext.readAttributes) {
			newContext.readAttributes(attr, uq);
		}
		this._curArray.push(newContext);
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
CT_PivotCacheRecords.prototype.onEndNode = function(prevContext, elem) {
	if ("r" === elem) {
		if (this._curArray && this._curArray.length > 0) {
			this.r.push(this._curArray);
			this._curArray = null;
		}
	}
};
CT_PivotCacheRecords.prototype.toXml = function(writer) {
	var res = "";
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotCacheRecords");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd("pivotCacheRecords", true);
	if (null !== r) {
		for (var i = 0; i < this.r.length; ++i) {
			var elem = this.r[i];
			writer.WriteXmlNodeEnd("r", true);
			for (var j = 0; j < elem.length; ++j) {
				var subelem = elem[j];
				if (subelem instanceof CT_Boolean) {
					subelem.toXml(writer, "b");
				} else if (subelem instanceof CT_DateTime) {
					subelem.toXml(writer, "d");
				} else if (subelem instanceof CT_Error) {
					subelem.toXml(writer, "e");
				} else if (subelem instanceof CT_Missing) {
					subelem.toXml(writer, "m");
				} else if (subelem instanceof CT_Number) {
					subelem.toXml(writer, "n");
				} else if (subelem instanceof CT_String) {
					subelem.toXml(writer, "s");
				} else if (subelem instanceof CT_Index) {
					subelem.toXml(writer, "x");
				}
			}
			writer.WriteXmlNodeEnd("r");
		}
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotCacheRecords");
	return res;
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
CT_pivotTableDefinition.prototype.toXml = function(writer) {
	var res = "";
	writer.WriteXmlString("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
	writer.WriteXmlNodeStart("pivotTableDefinition");
	writer.WriteXmlString(
		" xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"");
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.cacheId) {
		writer.WriteXmlAttributeNumber("cacheId", this.cacheId);
	}
	if (null !== this.dataOnRows) {
		writer.WriteXmlAttributeBool("dataOnRows", this.dataOnRows);
	}
	if (null !== this.dataPosition) {
		writer.WriteXmlAttributeNumber("dataPosition", this.dataPosition);
	}
	if (null !== this.autoFormatId) {
		writer.WriteXmlAttributeNumber("autoFormatId", this.autoFormatId);
	}
	if (null !== this.applyNumberFormats) {
		writer.WriteXmlAttributeBool("applyNumberFormats", this.applyNumberFormats);
	}
	if (null !== this.applyBorderFormats) {
		writer.WriteXmlAttributeBool("applyBorderFormats", this.applyBorderFormats);
	}
	if (null !== this.applyFontFormats) {
		writer.WriteXmlAttributeBool("applyFontFormats", this.applyFontFormats);
	}
	if (null !== this.applyPatternFormats) {
		writer.WriteXmlAttributeBool("applyPatternFormats", this.applyPatternFormats);
	}
	if (null !== this.applyAlignmentFormats) {
		writer.WriteXmlAttributeBool("applyAlignmentFormats", this.applyAlignmentFormats);
	}
	if (null !== this.applyWidthHeightFormats) {
		writer.WriteXmlAttributeBool("applyWidthHeightFormats", this.applyWidthHeightFormats);
	}
	if (null !== this.dataCaption) {
		writer.WriteXmlAttributeString("dataCaption", this.dataCaption);
	}
	if (null !== this.grandTotalCaption) {
		writer.WriteXmlAttributeString("grandTotalCaption", this.grandTotalCaption);
	}
	if (null !== this.errorCaption) {
		writer.WriteXmlAttributeString("errorCaption", this.errorCaption);
	}
	if (null !== this.showError) {
		writer.WriteXmlAttributeBool("showError", this.showError);
	}
	if (null !== this.missingCaption) {
		writer.WriteXmlAttributeString("missingCaption", this.missingCaption);
	}
	if (null !== this.showMissing) {
		writer.WriteXmlAttributeBool("showMissing", this.showMissing);
	}
	if (null !== this.pageStyle) {
		writer.WriteXmlAttributeString("pageStyle", this.pageStyle);
	}
	if (null !== this.pivotTableStyle) {
		writer.WriteXmlAttributeString("pivotTableStyle", this.pivotTableStyle);
	}
	if (null !== this.vacatedStyle) {
		writer.WriteXmlAttributeString("vacatedStyle", this.vacatedStyle);
	}
	if (null !== this.tag) {
		writer.WriteXmlAttributeString("tag", this.tag);
	}
	if (null !== this.updatedVersion) {
		writer.WriteXmlAttributeNumber("updatedVersion", this.updatedVersion);
	}
	if (null !== this.minRefreshableVersion) {
		writer.WriteXmlAttributeNumber("minRefreshableVersion", this.minRefreshableVersion);
	}
	if (null !== this.asteriskTotals) {
		writer.WriteXmlAttributeBool("asteriskTotals", this.asteriskTotals);
	}
	if (null !== this.showItems) {
		writer.WriteXmlAttributeBool("showItems", this.showItems);
	}
	if (null !== this.editData) {
		writer.WriteXmlAttributeBool("editData", this.editData);
	}
	if (null !== this.disableFieldList) {
		writer.WriteXmlAttributeBool("disableFieldList", this.disableFieldList);
	}
	if (null !== this.showCalcMbrs) {
		writer.WriteXmlAttributeBool("showCalcMbrs", this.showCalcMbrs);
	}
	if (null !== this.visualTotals) {
		writer.WriteXmlAttributeBool("visualTotals", this.visualTotals);
	}
	if (null !== this.showMultipleLabel) {
		writer.WriteXmlAttributeBool("showMultipleLabel", this.showMultipleLabel);
	}
	if (null !== this.showDataDropDown) {
		writer.WriteXmlAttributeBool("showDataDropDown", this.showDataDropDown);
	}
	if (null !== this.showDrill) {
		writer.WriteXmlAttributeBool("showDrill", this.showDrill);
	}
	if (null !== this.printDrill) {
		writer.WriteXmlAttributeBool("printDrill", this.printDrill);
	}
	if (null !== this.showMemberPropertyTips) {
		writer.WriteXmlAttributeBool("showMemberPropertyTips", this.showMemberPropertyTips);
	}
	if (null !== this.showDataTips) {
		writer.WriteXmlAttributeBool("showDataTips", this.showDataTips);
	}
	if (null !== this.enableWizard) {
		writer.WriteXmlAttributeBool("enableWizard", this.enableWizard);
	}
	if (null !== this.enableDrill) {
		writer.WriteXmlAttributeBool("enableDrill", this.enableDrill);
	}
	if (null !== this.enableFieldProperties) {
		writer.WriteXmlAttributeBool("enableFieldProperties", this.enableFieldProperties);
	}
	if (null !== this.preserveFormatting) {
		writer.WriteXmlAttributeBool("preserveFormatting", this.preserveFormatting);
	}
	if (null !== this.useAutoFormatting) {
		writer.WriteXmlAttributeBool("useAutoFormatting", this.useAutoFormatting);
	}
	if (null !== this.pageWrap) {
		writer.WriteXmlAttributeNumber("pageWrap", this.pageWrap);
	}
	if (null !== this.pageOverThenDown) {
		writer.WriteXmlAttributeBool("pageOverThenDown", this.pageOverThenDown);
	}
	if (null !== this.subtotalHiddenItems) {
		writer.WriteXmlAttributeBool("subtotalHiddenItems", this.subtotalHiddenItems);
	}
	if (null !== this.rowGrandTotals) {
		writer.WriteXmlAttributeBool("rowGrandTotals", this.rowGrandTotals);
	}
	if (null !== this.colGrandTotals) {
		writer.WriteXmlAttributeBool("colGrandTotals", this.colGrandTotals);
	}
	if (null !== this.fieldPrintTitles) {
		writer.WriteXmlAttributeBool("fieldPrintTitles", this.fieldPrintTitles);
	}
	if (null !== this.itemPrintTitles) {
		writer.WriteXmlAttributeBool("itemPrintTitles", this.itemPrintTitles);
	}
	if (null !== this.mergeItem) {
		writer.WriteXmlAttributeBool("mergeItem", this.mergeItem);
	}
	if (null !== this.showDropZones) {
		writer.WriteXmlAttributeBool("showDropZones", this.showDropZones);
	}
	if (null !== this.createdVersion) {
		writer.WriteXmlAttributeNumber("createdVersion", this.createdVersion);
	}
	if (null !== this.indent) {
		writer.WriteXmlAttributeNumber("indent", this.indent);
	}
	if (null !== this.showEmptyRow) {
		writer.WriteXmlAttributeBool("showEmptyRow", this.showEmptyRow);
	}
	if (null !== this.showEmptyCol) {
		writer.WriteXmlAttributeBool("showEmptyCol", this.showEmptyCol);
	}
	if (null !== this.showHeaders) {
		writer.WriteXmlAttributeBool("showHeaders", this.showHeaders);
	}
	if (null !== this.compact) {
		writer.WriteXmlAttributeBool("compact", this.compact);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.outlineData) {
		writer.WriteXmlAttributeBool("outlineData", this.outlineData);
	}
	if (null !== this.compactData) {
		writer.WriteXmlAttributeBool("compactData", this.compactData);
	}
	if (null !== this.published) {
		writer.WriteXmlAttributeBool("published", this.published);
	}
	if (null !== this.gridDropZones) {
		writer.WriteXmlAttributeBool("gridDropZones", this.gridDropZones);
	}
	if (null !== this.immersive) {
		writer.WriteXmlAttributeBool("immersive", this.immersive);
	}
	if (null !== this.multipleFieldFilters) {
		writer.WriteXmlAttributeBool("multipleFieldFilters", this.multipleFieldFilters);
	}
	if (null !== this.chartFormat) {
		writer.WriteXmlAttributeNumber("chartFormat", this.chartFormat);
	}
	if (null !== this.rowHeaderCaption) {
		writer.WriteXmlAttributeString("rowHeaderCaption", this.rowHeaderCaption);
	}
	if (null !== this.colHeaderCaption) {
		writer.WriteXmlAttributeString("colHeaderCaption", this.colHeaderCaption);
	}
	if (null !== this.fieldListSortAscending) {
		writer.WriteXmlAttributeBool("fieldListSortAscending", this.fieldListSortAscending);
	}
	if (null !== this.mdxSubqueries) {
		writer.WriteXmlAttributeBool("mdxSubqueries", this.mdxSubqueries);
	}
	if (null !== this.customListSort) {
		writer.WriteXmlAttributeBool("customListSort", this.customListSort);
	}
	writer.WriteXmlNodeEnd("pivotTableDefinition", true);
	if (null !== this.location) {
		res += this.location.toXml(writer, "location");
	}
	if (null !== this.pivotFields) {
		res += this.pivotFields.toXml(writer, "pivotFields");
	}
	if (null !== this.rowFields) {
		res += this.rowFields.toXml(writer, "rowFields");
	}
	if (null !== this.rowItems) {
		res += this.rowItems.toXml(writer, "rowItems");
	}
	if (null !== this.colFields) {
		res += this.colFields.toXml(writer, "colFields");
	}
	if (null !== this.colItems) {
		res += this.colItems.toXml(writer, "colItems");
	}
	if (null !== this.pageFields) {
		res += this.pageFields.toXml(writer, "pageFields");
	}
	if (null !== this.dataFields) {
		res += this.dataFields.toXml(writer, "dataFields");
	}
	if (null !== this.formats) {
		res += this.formats.toXml(writer, "formats");
	}
	if (null !== this.conditionalFormats) {
		res += this.conditionalFormats.toXml(writer, "conditionalFormats");
	}
	if (null !== this.chartFormats) {
		res += this.chartFormats.toXml(writer, "chartFormats");
	}
	if (null !== this.pivotHierarchies) {
		res += this.pivotHierarchies.toXml(writer, "pivotHierarchies");
	}
	if (null !== this.pivotTableStyleInfo) {
		res += this.pivotTableStyleInfo.toXml(writer, "pivotTableStyleInfo");
	}
	if (null !== this.filters) {
		res += this.filters.toXml(writer, "filters");
	}
	if (null !== this.rowHierarchiesUsage) {
		res += this.rowHierarchiesUsage.toXml(writer, "rowHierarchiesUsage");
	}
	if (null !== this.colHierarchiesUsage) {
		res += this.colHierarchiesUsage.toXml(writer, "colHierarchiesUsage");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd("pivotTableDefinition");
	return res;
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
CT_CacheSource.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.type) {
		writer.WriteXmlAttributeString("type", ToXml_ST_SourceType(this.type));
	}
	if (null !== this.connectionId) {
		writer.WriteXmlAttributeNumber("connectionId", this.connectionId);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.consolidation) {
		res += this.consolidation.toXml(writer, "consolidation");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	if (null !== this.worksheetSource) {
		res += this.worksheetSource.toXml(writer, "worksheetSource");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CacheFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.cacheField.length; ++i) {
		var elem = this.cacheField[i];
		res += elem.toXml(writer, "cacheField");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CacheHierarchies.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.cacheHierarchy.length; ++i) {
		var elem = this.cacheHierarchy[i];
		res += elem.toXml(writer, "cacheHierarchy");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PCDKPIs.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.kpi.length; ++i) {
		var elem = this.kpi[i];
		res += elem.toXml(writer, "kpi");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_TupleCache.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.entries) {
		res += this.entries.toXml(writer, "entries");
	}
	if (null !== this.sets) {
		res += this.sets.toXml(writer, "sets");
	}
	if (null !== this.queryCache) {
		res += this.queryCache.toXml(writer, "queryCache");
	}
	if (null !== this.serverFormats) {
		res += this.serverFormats.toXml(writer, "serverFormats");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CalculatedItems.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.calculatedItem.length; ++i) {
		var elem = this.calculatedItem[i];
		res += elem.toXml(writer, "calculatedItem");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CalculatedMembers.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.calculatedMember.length; ++i) {
		var elem = this.calculatedMember[i];
		res += elem.toXml(writer, "calculatedMember");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Dimensions.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.dimension.length; ++i) {
		var elem = this.dimension[i];
		res += elem.toXml(writer, "dimension");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_MeasureGroups.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.measureGroup.length; ++i) {
		var elem = this.measureGroup[i];
		res += elem.toXml(writer, "measureGroup");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_MeasureDimensionMaps.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.map.length; ++i) {
		var elem = this.map[i];
		res += elem.toXml(writer, "map");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ExtensionList.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.ext.length; ++i) {
		var elem = this.ext[i];
		res += elem.toXml(writer, "ext");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Boolean.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeBool("v", this.v);
	}
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_DateTime.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeString("v", this.v);
	}
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Error.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeString("v", this.v);
	}
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	if (null !== this.in) {
		writer.WriteXmlAttributeNumber("in", this.in);
	}
	if (null !== this.bc) {
		writer.WriteXmlAttributeNumber("bc", this.bc);
	}
	if (null !== this.fc) {
		writer.WriteXmlAttributeNumber("fc", this.fc);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeBool("i", this.i);
	}
	if (null !== this.un) {
		writer.WriteXmlAttributeBool("un", this.un);
	}
	if (null !== this.st) {
		writer.WriteXmlAttributeBool("st", this.st);
	}
	if (null !== this.b) {
		writer.WriteXmlAttributeBool("b", this.b);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.tpls) {
		res += this.tpls.toXml(writer, "tpls");
	}
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Missing.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	if (null !== this.in) {
		writer.WriteXmlAttributeNumber("in", this.in);
	}
	if (null !== this.bc) {
		writer.WriteXmlAttributeNumber("bc", this.bc);
	}
	if (null !== this.fc) {
		writer.WriteXmlAttributeNumber("fc", this.fc);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeBool("i", this.i);
	}
	if (null !== this.un) {
		writer.WriteXmlAttributeBool("un", this.un);
	}
	if (null !== this.st) {
		writer.WriteXmlAttributeBool("st", this.st);
	}
	if (null !== this.b) {
		writer.WriteXmlAttributeBool("b", this.b);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpls.length; ++i) {
		var elem = this.tpls[i];
		res += elem.toXml(writer, "tpls");
	}
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Number.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeNumber("v", this.v);
	}
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	if (null !== this.in) {
		writer.WriteXmlAttributeNumber("in", this.in);
	}
	if (null !== this.bc) {
		writer.WriteXmlAttributeNumber("bc", this.bc);
	}
	if (null !== this.fc) {
		writer.WriteXmlAttributeNumber("fc", this.fc);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeBool("i", this.i);
	}
	if (null !== this.un) {
		writer.WriteXmlAttributeBool("un", this.un);
	}
	if (null !== this.st) {
		writer.WriteXmlAttributeBool("st", this.st);
	}
	if (null !== this.b) {
		writer.WriteXmlAttributeBool("b", this.b);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpls.length; ++i) {
		var elem = this.tpls[i];
		res += elem.toXml(writer, "tpls");
	}
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_String.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeString("v", this.v);
	}
	if (null !== this.u) {
		writer.WriteXmlAttributeBool("u", this.u);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeString("c", this.c);
	}
	if (null !== this.cp) {
		writer.WriteXmlAttributeNumber("cp", this.cp);
	}
	if (null !== this.in) {
		writer.WriteXmlAttributeNumber("in", this.in);
	}
	if (null !== this.bc) {
		writer.WriteXmlAttributeNumber("bc", this.bc);
	}
	if (null !== this.fc) {
		writer.WriteXmlAttributeNumber("fc", this.fc);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeBool("i", this.i);
	}
	if (null !== this.un) {
		writer.WriteXmlAttributeBool("un", this.un);
	}
	if (null !== this.st) {
		writer.WriteXmlAttributeBool("st", this.st);
	}
	if (null !== this.b) {
		writer.WriteXmlAttributeBool("b", this.b);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpls.length; ++i) {
		var elem = this.tpls[i];
		res += elem.toXml(writer, "tpls");
	}
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Index.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeNumber("v", this.v);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Location.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	if (null !== this.firstHeaderRow) {
		writer.WriteXmlAttributeNumber("firstHeaderRow", this.firstHeaderRow);
	}
	if (null !== this.firstDataRow) {
		writer.WriteXmlAttributeNumber("firstDataRow", this.firstDataRow);
	}
	if (null !== this.firstDataCol) {
		writer.WriteXmlAttributeNumber("firstDataCol", this.firstDataCol);
	}
	if (null !== this.rowPageCount) {
		writer.WriteXmlAttributeNumber("rowPageCount", this.rowPageCount);
	}
	if (null !== this.colPageCount) {
		writer.WriteXmlAttributeNumber("colPageCount", this.colPageCount);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_PivotFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotField.length; ++i) {
		var elem = this.pivotField[i];
		res += elem.toXml(writer, "pivotField");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_RowFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.field.length; ++i) {
		var elem = this.field[i];
		res += elem.toXml(writer, "field");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_rowItems.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.i.length; ++i) {
		var elem = this.i[i];
		res += elem.toXml(writer, "i");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ColFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.field.length; ++i) {
		var elem = this.field[i];
		res += elem.toXml(writer, "field");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_colItems.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.i.length; ++i) {
		var elem = this.i[i];
		res += elem.toXml(writer, "i");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PageFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pageField.length; ++i) {
		var elem = this.pageField[i];
		res += elem.toXml(writer, "pageField");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_DataFields.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.dataField.length; ++i) {
		var elem = this.dataField[i];
		res += elem.toXml(writer, "dataField");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Formats.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.format.length; ++i) {
		var elem = this.format[i];
		res += elem.toXml(writer, "format");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ConditionalFormats.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.conditionalFormat.length; ++i) {
		var elem = this.conditionalFormat[i];
		res += elem.toXml(writer, "conditionalFormat");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ChartFormats.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.chartFormat.length; ++i) {
		var elem = this.chartFormat[i];
		res += elem.toXml(writer, "chartFormat");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotHierarchies.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotHierarchy.length; ++i) {
		var elem = this.pivotHierarchy[i];
		res += elem.toXml(writer, "pivotHierarchy");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotTableStyle.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.showRowHeaders) {
		writer.WriteXmlAttributeBool("showRowHeaders", this.showRowHeaders);
	}
	if (null !== this.showColHeaders) {
		writer.WriteXmlAttributeBool("showColHeaders", this.showColHeaders);
	}
	if (null !== this.showRowStripes) {
		writer.WriteXmlAttributeBool("showRowStripes", this.showRowStripes);
	}
	if (null !== this.showColStripes) {
		writer.WriteXmlAttributeBool("showColStripes", this.showColStripes);
	}
	if (null !== this.showLastColumn) {
		writer.WriteXmlAttributeBool("showLastColumn", this.showLastColumn);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_PivotFilters.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filter.length; ++i) {
		var elem = this.filter[i];
		res += elem.toXml(writer, "filter");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_RowHierarchiesUsage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.rowHierarchyUsage.length; ++i) {
		var elem = this.rowHierarchyUsage[i];
		res += elem.toXml(writer, "rowHierarchyUsage");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ColHierarchiesUsage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.colHierarchyUsage.length; ++i) {
		var elem = this.colHierarchyUsage[i];
		res += elem.toXml(writer, "colHierarchyUsage");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Consolidation.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.autoPage) {
		writer.WriteXmlAttributeBool("autoPage", this.autoPage);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pages) {
		res += this.pages.toXml(writer, "pages");
	}
	if (null !== this.rangeSets) {
		res += this.rangeSets.toXml(writer, "rangeSets");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_WorksheetSource.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.sheet) {
		writer.WriteXmlAttributeString("sheet", this.sheet);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeString("r:id", this.id);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_CacheField.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	if (null !== this.propertyName) {
		writer.WriteXmlAttributeString("propertyName", this.propertyName);
	}
	if (null !== this.serverField) {
		writer.WriteXmlAttributeBool("serverField", this.serverField);
	}
	if (null !== this.uniqueList) {
		writer.WriteXmlAttributeBool("uniqueList", this.uniqueList);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	if (null !== this.formula) {
		writer.WriteXmlAttributeString("formula", this.formula);
	}
	if (null !== this.sqlType) {
		writer.WriteXmlAttributeNumber("sqlType", this.sqlType);
	}
	if (null !== this.hierarchy) {
		writer.WriteXmlAttributeNumber("hierarchy", this.hierarchy);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	if (null !== this.databaseField) {
		writer.WriteXmlAttributeBool("databaseField", this.databaseField);
	}
	if (null !== this.mappingCount) {
		writer.WriteXmlAttributeNumber("mappingCount", this.mappingCount);
	}
	if (null !== this.memberPropertyField) {
		writer.WriteXmlAttributeBool("memberPropertyField", this.memberPropertyField);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.sharedItems) {
		res += this.sharedItems.toXml(writer, "sharedItems");
	}
	if (null !== this.fieldGroup) {
		res += this.fieldGroup.toXml(writer, "fieldGroup");
	}
	for (var i = 0; i < this.mpMap.length; ++i) {
		var elem = this.mpMap[i];
		res += elem.toXml(writer, "mpMap");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CacheHierarchy.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	if (null !== this.measure) {
		writer.WriteXmlAttributeBool("measure", this.measure);
	}
	if (null !== this.set) {
		writer.WriteXmlAttributeBool("set", this.set);
	}
	if (null !== this.parentSet) {
		writer.WriteXmlAttributeNumber("parentSet", this.parentSet);
	}
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeNumber("iconSet", this.iconSet);
	}
	if (null !== this.attribute) {
		writer.WriteXmlAttributeBool("attribute", this.attribute);
	}
	if (null !== this.time) {
		writer.WriteXmlAttributeBool("time", this.time);
	}
	if (null !== this.keyAttribute) {
		writer.WriteXmlAttributeBool("keyAttribute", this.keyAttribute);
	}
	if (null !== this.defaultMemberUniqueName) {
		writer.WriteXmlAttributeString("defaultMemberUniqueName", this.defaultMemberUniqueName);
	}
	if (null !== this.allUniqueName) {
		writer.WriteXmlAttributeString("allUniqueName", this.allUniqueName);
	}
	if (null !== this.allCaption) {
		writer.WriteXmlAttributeString("allCaption", this.allCaption);
	}
	if (null !== this.dimensionUniqueName) {
		writer.WriteXmlAttributeString("dimensionUniqueName", this.dimensionUniqueName);
	}
	if (null !== this.displayFolder) {
		writer.WriteXmlAttributeString("displayFolder", this.displayFolder);
	}
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeString("measureGroup", this.measureGroup);
	}
	if (null !== this.measures) {
		writer.WriteXmlAttributeBool("measures", this.measures);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.oneField) {
		writer.WriteXmlAttributeBool("oneField", this.oneField);
	}
	if (null !== this.memberValueDatatype) {
		writer.WriteXmlAttributeNumber("memberValueDatatype", this.memberValueDatatype);
	}
	if (null !== this.unbalanced) {
		writer.WriteXmlAttributeBool("unbalanced", this.unbalanced);
	}
	if (null !== this.unbalancedGroup) {
		writer.WriteXmlAttributeBool("unbalancedGroup", this.unbalancedGroup);
	}
	if (null !== this.hidden) {
		writer.WriteXmlAttributeBool("hidden", this.hidden);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.fieldsUsage) {
		res += this.fieldsUsage.toXml(writer, "fieldsUsage");
	}
	if (null !== this.groupLevels) {
		res += this.groupLevels.toXml(writer, "groupLevels");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PCDKPI.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	if (null !== this.displayFolder) {
		writer.WriteXmlAttributeString("displayFolder", this.displayFolder);
	}
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeString("measureGroup", this.measureGroup);
	}
	if (null !== this.parent) {
		writer.WriteXmlAttributeString("parent", this.parent);
	}
	if (null !== this.value) {
		writer.WriteXmlAttributeString("value", this.value);
	}
	if (null !== this.goal) {
		writer.WriteXmlAttributeString("goal", this.goal);
	}
	if (null !== this.status) {
		writer.WriteXmlAttributeString("status", this.status);
	}
	if (null !== this.trend) {
		writer.WriteXmlAttributeString("trend", this.trend);
	}
	if (null !== this.weight) {
		writer.WriteXmlAttributeString("weight", this.weight);
	}
	if (null !== this.time) {
		writer.WriteXmlAttributeString("time", this.time);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
};
function CT_PCDSDTCEntries() {
//Attributes
	this.count = null;
//Members
	this.Items = [];
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
CT_PCDSDTCEntries.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.Items.length; ++i) {
		var elem = this.Items[i];
		if (elem instanceof CT_Error) {
			elem.toXml(writer, "e");
		} else if (elem instanceof CT_Missing) {
			elem.toXml(writer, "m");
		} else if (elem instanceof CT_Number) {
			elem.toXml(writer, "n");
		} else if (elem instanceof CT_String) {
			elem.toXml(writer, "s");
		}
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Sets.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.set.length; ++i) {
		var elem = this.set[i];
		res += elem.toXml(writer, "set");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_QueryCache.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.query.length; ++i) {
		var elem = this.query[i];
		res += elem.toXml(writer, "query");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ServerFormats.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.serverFormat.length; ++i) {
		var elem = this.serverFormat[i];
		res += elem.toXml(writer, "serverFormat");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CalculatedItem.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.formula) {
		writer.WriteXmlAttributeString("formula", this.formula);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		res += this.pivotArea.toXml(writer, "pivotArea");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CalculatedMember.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.mdx) {
		writer.WriteXmlAttributeString("mdx", this.mdx);
	}
	if (null !== this.memberName) {
		writer.WriteXmlAttributeString("memberName", this.memberName);
	}
	if (null !== this.hierarchy) {
		writer.WriteXmlAttributeString("hierarchy", this.hierarchy);
	}
	if (null !== this.parent) {
		writer.WriteXmlAttributeString("parent", this.parent);
	}
	if (null !== this.solveOrder) {
		writer.WriteXmlAttributeNumber("solveOrder", this.solveOrder);
	}
	if (null !== this.set) {
		writer.WriteXmlAttributeBool("set", this.set);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotDimension.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.measure) {
		writer.WriteXmlAttributeBool("measure", this.measure);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_MeasureGroup.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_MeasureDimensionMap.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.measureGroup) {
		writer.WriteXmlAttributeNumber("measureGroup", this.measureGroup);
	}
	if (null !== this.dimension) {
		writer.WriteXmlAttributeNumber("dimension", this.dimension);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
		this._curElem = elem;
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
CT_Extension.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.uri) {
		writer.WriteXmlAttributeString("uri", this.uri);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.Any) {
		writer.WriteXmlNodeStart("Any", true);
		writer.WriteXmlString(this.Any);
		writer.WriteXmlNodeEnd("Any");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_X.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.v) {
		writer.WriteXmlAttributeNumber("v", this.v);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Tuples.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.c) {
		writer.WriteXmlAttributeNumber("c", this.c);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpl.length; ++i) {
		var elem = this.tpl[i];
		res += elem.toXml(writer, "tpl");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotField.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.axis) {
		writer.WriteXmlAttributeString("axis", ToXml_ST_Axis(this.axis));
	}
	if (null !== this.dataField) {
		writer.WriteXmlAttributeBool("dataField", this.dataField);
	}
	if (null !== this.subtotalCaption) {
		writer.WriteXmlAttributeString("subtotalCaption", this.subtotalCaption);
	}
	if (null !== this.showDropDowns) {
		writer.WriteXmlAttributeBool("showDropDowns", this.showDropDowns);
	}
	if (null !== this.hiddenLevel) {
		writer.WriteXmlAttributeBool("hiddenLevel", this.hiddenLevel);
	}
	if (null !== this.uniqueMemberProperty) {
		writer.WriteXmlAttributeString("uniqueMemberProperty", this.uniqueMemberProperty);
	}
	if (null !== this.compact) {
		writer.WriteXmlAttributeBool("compact", this.compact);
	}
	if (null !== this.allDrilled) {
		writer.WriteXmlAttributeBool("allDrilled", this.allDrilled);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.subtotalTop) {
		writer.WriteXmlAttributeBool("subtotalTop", this.subtotalTop);
	}
	if (null !== this.dragToRow) {
		writer.WriteXmlAttributeBool("dragToRow", this.dragToRow);
	}
	if (null !== this.dragToCol) {
		writer.WriteXmlAttributeBool("dragToCol", this.dragToCol);
	}
	if (null !== this.multipleItemSelectionAllowed) {
		writer.WriteXmlAttributeBool("multipleItemSelectionAllowed", this.multipleItemSelectionAllowed);
	}
	if (null !== this.dragToPage) {
		writer.WriteXmlAttributeBool("dragToPage", this.dragToPage);
	}
	if (null !== this.dragToData) {
		writer.WriteXmlAttributeBool("dragToData", this.dragToData);
	}
	if (null !== this.dragOff) {
		writer.WriteXmlAttributeBool("dragOff", this.dragOff);
	}
	if (null !== this.showAll) {
		writer.WriteXmlAttributeBool("showAll", this.showAll);
	}
	if (null !== this.insertBlankRow) {
		writer.WriteXmlAttributeBool("insertBlankRow", this.insertBlankRow);
	}
	if (null !== this.serverField) {
		writer.WriteXmlAttributeBool("serverField", this.serverField);
	}
	if (null !== this.insertPageBreak) {
		writer.WriteXmlAttributeBool("insertPageBreak", this.insertPageBreak);
	}
	if (null !== this.autoShow) {
		writer.WriteXmlAttributeBool("autoShow", this.autoShow);
	}
	if (null !== this.topAutoShow) {
		writer.WriteXmlAttributeBool("topAutoShow", this.topAutoShow);
	}
	if (null !== this.hideNewItems) {
		writer.WriteXmlAttributeBool("hideNewItems", this.hideNewItems);
	}
	if (null !== this.measureFilter) {
		writer.WriteXmlAttributeBool("measureFilter", this.measureFilter);
	}
	if (null !== this.includeNewItemsInFilter) {
		writer.WriteXmlAttributeBool("includeNewItemsInFilter", this.includeNewItemsInFilter);
	}
	if (null !== this.itemPageCount) {
		writer.WriteXmlAttributeNumber("itemPageCount", this.itemPageCount);
	}
	if (null !== this.sortType) {
		writer.WriteXmlAttributeString("sortType", ToXml_ST_FieldSortType(this.sortType));
	}
	if (null !== this.dataSourceSort) {
		writer.WriteXmlAttributeBool("dataSourceSort", this.dataSourceSort);
	}
	if (null !== this.nonAutoSortDefault) {
		writer.WriteXmlAttributeBool("nonAutoSortDefault", this.nonAutoSortDefault);
	}
	if (null !== this.rankBy) {
		writer.WriteXmlAttributeNumber("rankBy", this.rankBy);
	}
	if (null !== this.defaultSubtotal) {
		writer.WriteXmlAttributeBool("defaultSubtotal", this.defaultSubtotal);
	}
	if (null !== this.sumSubtotal) {
		writer.WriteXmlAttributeBool("sumSubtotal", this.sumSubtotal);
	}
	if (null !== this.countASubtotal) {
		writer.WriteXmlAttributeBool("countASubtotal", this.countASubtotal);
	}
	if (null !== this.avgSubtotal) {
		writer.WriteXmlAttributeBool("avgSubtotal", this.avgSubtotal);
	}
	if (null !== this.maxSubtotal) {
		writer.WriteXmlAttributeBool("maxSubtotal", this.maxSubtotal);
	}
	if (null !== this.minSubtotal) {
		writer.WriteXmlAttributeBool("minSubtotal", this.minSubtotal);
	}
	if (null !== this.productSubtotal) {
		writer.WriteXmlAttributeBool("productSubtotal", this.productSubtotal);
	}
	if (null !== this.countSubtotal) {
		writer.WriteXmlAttributeBool("countSubtotal", this.countSubtotal);
	}
	if (null !== this.stdDevSubtotal) {
		writer.WriteXmlAttributeBool("stdDevSubtotal", this.stdDevSubtotal);
	}
	if (null !== this.stdDevPSubtotal) {
		writer.WriteXmlAttributeBool("stdDevPSubtotal", this.stdDevPSubtotal);
	}
	if (null !== this.varSubtotal) {
		writer.WriteXmlAttributeBool("varSubtotal", this.varSubtotal);
	}
	if (null !== this.varPSubtotal) {
		writer.WriteXmlAttributeBool("varPSubtotal", this.varPSubtotal);
	}
	if (null !== this.showPropCell) {
		writer.WriteXmlAttributeBool("showPropCell", this.showPropCell);
	}
	if (null !== this.showPropTip) {
		writer.WriteXmlAttributeBool("showPropTip", this.showPropTip);
	}
	if (null !== this.showPropAsCaption) {
		writer.WriteXmlAttributeBool("showPropAsCaption", this.showPropAsCaption);
	}
	if (null !== this.defaultAttributeDrillState) {
		writer.WriteXmlAttributeBool("defaultAttributeDrillState", this.defaultAttributeDrillState);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.items) {
		res += this.items.toXml(writer, "items");
	}
	if (null !== this.autoSortScope) {
		res += this.autoSortScope.toXml(writer, "autoSortScope");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Field.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_I.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.t) {
		writer.WriteXmlAttributeString("t", ToXml_ST_ItemType(this.t));
	}
	if (null !== this.r) {
		writer.WriteXmlAttributeNumber("r", this.r);
	}
	if (null !== this.i) {
		writer.WriteXmlAttributeNumber("i", this.i);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PageField.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.item) {
		writer.WriteXmlAttributeNumber("item", this.item);
	}
	if (null !== this.hier) {
		writer.WriteXmlAttributeNumber("hier", this.hier);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.cap) {
		writer.WriteXmlAttributeString("cap", this.cap);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_DataField.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.subtotal) {
		writer.WriteXmlAttributeString("subtotal", ToXml_ST_DataConsolidateFunction(this.subtotal));
	}
	if (null !== this.showDataAs) {
		writer.WriteXmlAttributeString("showDataAs", ToXml_ST_ShowDataAs(this.showDataAs));
	}
	if (null !== this.baseField) {
		writer.WriteXmlAttributeNumber("baseField", this.baseField);
	}
	if (null !== this.baseItem) {
		writer.WriteXmlAttributeNumber("baseItem", this.baseItem);
	}
	if (null !== this.numFmtId) {
		writer.WriteXmlAttributeNumber("numFmtId", this.numFmtId);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Format.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.action) {
		writer.WriteXmlAttributeString("action", ToXml_ST_FormatAction(this.action));
	}
	if (null !== this.dxfId) {
		writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		res += this.pivotArea.toXml(writer, "pivotArea");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ConditionalFormat.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.scope) {
		writer.WriteXmlAttributeString("scope", ToXml_ST_Scope(this.scope));
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeString("type", ToXml_ST_Type(this.type));
	}
	if (null !== this.priority) {
		writer.WriteXmlAttributeNumber("priority", this.priority);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotAreas) {
		res += this.pivotAreas.toXml(writer, "pivotAreas");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ChartFormat.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.chart) {
		writer.WriteXmlAttributeNumber("chart", this.chart);
	}
	if (null !== this.format) {
		writer.WriteXmlAttributeNumber("format", this.format);
	}
	if (null !== this.series) {
		writer.WriteXmlAttributeBool("series", this.series);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		res += this.pivotArea.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotHierarchy.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.multipleItemSelectionAllowed) {
		writer.WriteXmlAttributeBool("multipleItemSelectionAllowed", this.multipleItemSelectionAllowed);
	}
	if (null !== this.subtotalTop) {
		writer.WriteXmlAttributeBool("subtotalTop", this.subtotalTop);
	}
	if (null !== this.showInFieldList) {
		writer.WriteXmlAttributeBool("showInFieldList", this.showInFieldList);
	}
	if (null !== this.dragToRow) {
		writer.WriteXmlAttributeBool("dragToRow", this.dragToRow);
	}
	if (null !== this.dragToCol) {
		writer.WriteXmlAttributeBool("dragToCol", this.dragToCol);
	}
	if (null !== this.dragToPage) {
		writer.WriteXmlAttributeBool("dragToPage", this.dragToPage);
	}
	if (null !== this.dragToData) {
		writer.WriteXmlAttributeBool("dragToData", this.dragToData);
	}
	if (null !== this.dragOff) {
		writer.WriteXmlAttributeBool("dragOff", this.dragOff);
	}
	if (null !== this.includeNewItemsInFilter) {
		writer.WriteXmlAttributeBool("includeNewItemsInFilter", this.includeNewItemsInFilter);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.mps) {
		res += this.mps.toXml(writer, "mps");
	}
	for (var i = 0; i < this.members.length; ++i) {
		var elem = this.members[i];
		res += elem.toXml(writer, "members");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.mpFld) {
		writer.WriteXmlAttributeNumber("mpFld", this.mpFld);
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeString("type", ToXml_ST_PivotFilterType(this.type));
	}
	if (null !== this.evalOrder) {
		writer.WriteXmlAttributeNumber("evalOrder", this.evalOrder);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeNumber("id", this.id);
	}
	if (null !== this.iMeasureHier) {
		writer.WriteXmlAttributeNumber("iMeasureHier", this.iMeasureHier);
	}
	if (null !== this.iMeasureFld) {
		writer.WriteXmlAttributeNumber("iMeasureFld", this.iMeasureFld);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.description) {
		writer.WriteXmlAttributeString("description", this.description);
	}
	if (null !== this.stringValue1) {
		writer.WriteXmlAttributeString("stringValue1", this.stringValue1);
	}
	if (null !== this.stringValue2) {
		writer.WriteXmlAttributeString("stringValue2", this.stringValue2);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.autoFilter) {
		res += this.autoFilter.toXml(writer, "autoFilter");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_HierarchyUsage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.hierarchyUsage) {
		writer.WriteXmlAttributeNumber("hierarchyUsage", this.hierarchyUsage);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Pages.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.page.length; ++i) {
		var elem = this.page[i];
		res += elem.toXml(writer, "page");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_RangeSets.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.rangeSet.length; ++i) {
		var elem = this.rangeSet[i];
		res += elem.toXml(writer, "rangeSet");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_SharedItems.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.containsSemiMixedTypes) {
		writer.WriteXmlAttributeBool("containsSemiMixedTypes", this.containsSemiMixedTypes);
	}
	if (null !== this.containsNonDate) {
		writer.WriteXmlAttributeBool("containsNonDate", this.containsNonDate);
	}
	if (null !== this.containsDate) {
		writer.WriteXmlAttributeBool("containsDate", this.containsDate);
	}
	if (null !== this.containsString) {
		writer.WriteXmlAttributeBool("containsString", this.containsString);
	}
	if (null !== this.containsBlank) {
		writer.WriteXmlAttributeBool("containsBlank", this.containsBlank);
	}
	if (null !== this.containsMixedTypes) {
		writer.WriteXmlAttributeBool("containsMixedTypes", this.containsMixedTypes);
	}
	if (null !== this.containsNumber) {
		writer.WriteXmlAttributeBool("containsNumber", this.containsNumber);
	}
	if (null !== this.containsInteger) {
		writer.WriteXmlAttributeBool("containsInteger", this.containsInteger);
	}
	if (null !== this.minValue) {
		writer.WriteXmlAttributeNumber("minValue", this.minValue);
	}
	if (null !== this.maxValue) {
		writer.WriteXmlAttributeNumber("maxValue", this.maxValue);
	}
	if (null !== this.minDate) {
		writer.WriteXmlAttributeString("minDate", this.minDate);
	}
	if (null !== this.maxDate) {
		writer.WriteXmlAttributeString("maxDate", this.maxDate);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.longText) {
		writer.WriteXmlAttributeBool("longText", this.longText);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.Items.length; ++i) {
		var elem = this.Items[i];
		if (elem instanceof CT_Boolean) {
			elem.toXml(writer, "b");
		} else if (elem instanceof CT_DateTime) {
			elem.toXml(writer, "d");
		} else if (elem instanceof CT_Error) {
			elem.toXml(writer, "e");
		} else if (elem instanceof CT_Missing) {
			elem.toXml(writer, "m");
		} else if (elem instanceof CT_Number) {
			elem.toXml(writer, "n");
		} else if (elem instanceof CT_String) {
			elem.toXml(writer, "s");
		}
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_FieldGroup.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.par) {
		writer.WriteXmlAttributeNumber("par", this.par);
	}
	if (null !== this.base) {
		writer.WriteXmlAttributeNumber("base", this.base);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.rangePr) {
		res += this.rangePr.toXml(writer, "rangePr");
	}
	if (null !== this.discretePr) {
		res += this.discretePr.toXml(writer, "discretePr");
	}
	if (null !== this.groupItems) {
		res += this.groupItems.toXml(writer, "groupItems");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_FieldsUsage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.fieldUsage.length; ++i) {
		var elem = this.fieldUsage[i];
		res += elem.toXml(writer, "fieldUsage");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_GroupLevels.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.groupLevel.length; ++i) {
		var elem = this.groupLevel[i];
		res += elem.toXml(writer, "groupLevel");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Set.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.maxRank) {
		writer.WriteXmlAttributeNumber("maxRank", this.maxRank);
	}
	if (null !== this.setDefinition) {
		writer.WriteXmlAttributeString("setDefinition", this.setDefinition);
	}
	if (null !== this.sortType) {
		writer.WriteXmlAttributeString("sortType", ToXml_ST_SortType(this.sortType));
	}
	if (null !== this.queryFailed) {
		writer.WriteXmlAttributeBool("queryFailed", this.queryFailed);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.tpls.length; ++i) {
		var elem = this.tpls[i];
		res += elem.toXml(writer, "tpls");
	}
	if (null !== this.sortByTuple) {
		res += this.sortByTuple.toXml(writer, "sortByTuple");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Query.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.mdx) {
		writer.WriteXmlAttributeString("mdx", this.mdx);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.tpls) {
		res += this.tpls.toXml(writer, "tpls");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ServerFormat.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.culture) {
		writer.WriteXmlAttributeString("culture", this.culture);
	}
	if (null !== this.format) {
		writer.WriteXmlAttributeString("format", this.format);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_PivotArea.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.type) {
		writer.WriteXmlAttributeString("type", ToXml_ST_PivotAreaType(this.type));
	}
	if (null !== this.dataOnly) {
		writer.WriteXmlAttributeBool("dataOnly", this.dataOnly);
	}
	if (null !== this.labelOnly) {
		writer.WriteXmlAttributeBool("labelOnly", this.labelOnly);
	}
	if (null !== this.grandRow) {
		writer.WriteXmlAttributeBool("grandRow", this.grandRow);
	}
	if (null !== this.grandCol) {
		writer.WriteXmlAttributeBool("grandCol", this.grandCol);
	}
	if (null !== this.cacheIndex) {
		writer.WriteXmlAttributeBool("cacheIndex", this.cacheIndex);
	}
	if (null !== this.outline) {
		writer.WriteXmlAttributeBool("outline", this.outline);
	}
	if (null !== this.offset) {
		writer.WriteXmlAttributeString("offset", this.offset);
	}
	if (null !== this.collapsedLevelsAreSubtotals) {
		writer.WriteXmlAttributeBool("collapsedLevelsAreSubtotals", this.collapsedLevelsAreSubtotals);
	}
	if (null !== this.axis) {
		writer.WriteXmlAttributeString("axis", ToXml_ST_Axis(this.axis));
	}
	if (null !== this.fieldPosition) {
		writer.WriteXmlAttributeNumber("fieldPosition", this.fieldPosition);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.references) {
		res += this.references.toXml(writer, "references");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Tuple.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.fld) {
		writer.WriteXmlAttributeNumber("fld", this.fld);
	}
	if (null !== this.hier) {
		writer.WriteXmlAttributeNumber("hier", this.hier);
	}
	if (null !== this.item) {
		writer.WriteXmlAttributeNumber("item", this.item);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Items.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.item.length; ++i) {
		var elem = this.item[i];
		res += elem.toXml(writer, "item");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_AutoSortScope.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.pivotArea) {
		res += this.pivotArea.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotAreas.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pivotArea.length; ++i) {
		var elem = this.pivotArea[i];
		res += elem.toXml(writer, "pivotArea");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_MemberProperties.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.mp.length; ++i) {
		var elem = this.mp[i];
		res += elem.toXml(writer, "mp");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Members.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.member.length; ++i) {
		var elem = this.member[i];
		res += elem.toXml(writer, "member");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_AutoFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filterColumn.length; ++i) {
		var elem = this.filterColumn[i];
		res += elem.toXml(writer, "filterColumn");
	}
	if (null !== this.sortState) {
		res += this.sortState.toXml(writer, "sortState");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PCDSCPage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.pageItem.length; ++i) {
		var elem = this.pageItem[i];
		res += elem.toXml(writer, "pageItem");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_RangeSet.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.i1) {
		writer.WriteXmlAttributeNumber("i1", this.i1);
	}
	if (null !== this.i2) {
		writer.WriteXmlAttributeNumber("i2", this.i2);
	}
	if (null !== this.i3) {
		writer.WriteXmlAttributeNumber("i3", this.i3);
	}
	if (null !== this.i4) {
		writer.WriteXmlAttributeNumber("i4", this.i4);
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.sheet) {
		writer.WriteXmlAttributeString("sheet", this.sheet);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeString("r:id", this.id);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_RangePr.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.autoStart) {
		writer.WriteXmlAttributeBool("autoStart", this.autoStart);
	}
	if (null !== this.autoEnd) {
		writer.WriteXmlAttributeBool("autoEnd", this.autoEnd);
	}
	if (null !== this.groupBy) {
		writer.WriteXmlAttributeString("groupBy", ToXml_ST_GroupBy(this.groupBy));
	}
	if (null !== this.startNum) {
		writer.WriteXmlAttributeNumber("startNum", this.startNum);
	}
	if (null !== this.endNum) {
		writer.WriteXmlAttributeNumber("endNum", this.endNum);
	}
	if (null !== this.startDate) {
		writer.WriteXmlAttributeString("startDate", this.startDate);
	}
	if (null !== this.endDate) {
		writer.WriteXmlAttributeString("endDate", this.endDate);
	}
	if (null !== this.groupInterval) {
		writer.WriteXmlAttributeNumber("groupInterval", this.groupInterval);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_DiscretePr.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
};
function CT_GroupItems() {
//Attributes
	this.count = null;
//Members
	this.Items = [];
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
CT_GroupItems.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.Items.length; ++i) {
		var elem = this.Items[i];
		if (elem instanceof CT_Boolean) {
			elem.toXml(writer, "b");
		} else if (elem instanceof CT_DateTime) {
			elem.toXml(writer, "d");
		} else if (elem instanceof CT_Error) {
			elem.toXml(writer, "e");
		} else if (elem instanceof CT_Missing) {
			elem.toXml(writer, "m");
		} else if (elem instanceof CT_Number) {
			elem.toXml(writer, "n");
		} else if (elem instanceof CT_String) {
			elem.toXml(writer, "s");
		}
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_FieldUsage.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_GroupLevel.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	if (null !== this.user) {
		writer.WriteXmlAttributeBool("user", this.user);
	}
	if (null !== this.customRollUp) {
		writer.WriteXmlAttributeBool("customRollUp", this.customRollUp);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.groups) {
		res += this.groups.toXml(writer, "groups");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotAreaReferences.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.reference.length; ++i) {
		var elem = this.reference[i];
		res += elem.toXml(writer, "reference");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_Item.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.n) {
		writer.WriteXmlAttributeString("n", this.n);
	}
	if (null !== this.t) {
		writer.WriteXmlAttributeString("t", ToXml_ST_ItemType(this.t));
	}
	if (null !== this.h) {
		writer.WriteXmlAttributeBool("h", this.h);
	}
	if (null !== this.s) {
		writer.WriteXmlAttributeBool("s", this.s);
	}
	if (null !== this.sd) {
		writer.WriteXmlAttributeBool("sd", this.sd);
	}
	if (null !== this.f) {
		writer.WriteXmlAttributeBool("f", this.f);
	}
	if (null !== this.m) {
		writer.WriteXmlAttributeBool("m", this.m);
	}
	if (null !== this.c) {
		writer.WriteXmlAttributeBool("c", this.c);
	}
	if (null !== this.x) {
		writer.WriteXmlAttributeNumber("x", this.x);
	}
	if (null !== this.d) {
		writer.WriteXmlAttributeBool("d", this.d);
	}
	if (null !== this.e) {
		writer.WriteXmlAttributeBool("e", this.e);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_MemberProperty.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.showCell) {
		writer.WriteXmlAttributeBool("showCell", this.showCell);
	}
	if (null !== this.showTip) {
		writer.WriteXmlAttributeBool("showTip", this.showTip);
	}
	if (null !== this.showAsCaption) {
		writer.WriteXmlAttributeBool("showAsCaption", this.showAsCaption);
	}
	if (null !== this.nameLen) {
		writer.WriteXmlAttributeNumber("nameLen", this.nameLen);
	}
	if (null !== this.pPos) {
		writer.WriteXmlAttributeNumber("pPos", this.pPos);
	}
	if (null !== this.pLen) {
		writer.WriteXmlAttributeNumber("pLen", this.pLen);
	}
	if (null !== this.level) {
		writer.WriteXmlAttributeNumber("level", this.level);
	}
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Member.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_FilterColumn.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.colId) {
		writer.WriteXmlAttributeNumber("colId", this.colId);
	}
	if (null !== this.hiddenButton) {
		writer.WriteXmlAttributeBool("hiddenButton", this.hiddenButton);
	}
	if (null !== this.showButton) {
		writer.WriteXmlAttributeBool("showButton", this.showButton);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.colorFilter) {
		res += this.colorFilter.toXml(writer, "colorFilter");
	}
	if (null !== this.customFilters) {
		res += this.customFilters.toXml(writer, "customFilters");
	}
	if (null !== this.dynamicFilter) {
		res += this.dynamicFilter.toXml(writer, "dynamicFilter");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	if (null !== this.filters) {
		res += this.filters.toXml(writer, "filters");
	}
	if (null !== this.iconFilter) {
		res += this.iconFilter.toXml(writer, "iconFilter");
	}
	if (null !== this.top10) {
		res += this.top10.toXml(writer, "top10");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_SortState.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.columnSort) {
		writer.WriteXmlAttributeBool("columnSort", this.columnSort);
	}
	if (null !== this.caseSensitive) {
		writer.WriteXmlAttributeBool("caseSensitive", this.caseSensitive);
	}
	if (null !== this.sortMethod) {
		writer.WriteXmlAttributeString("sortMethod", ToXml_ST_SortMethod(this.sortMethod));
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.sortCondition.length; ++i) {
		var elem = this.sortCondition[i];
		res += elem.toXml(writer, "sortCondition");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PageItem.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Groups.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.group.length; ++i) {
		var elem = this.group[i];
		res += elem.toXml(writer, "group");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_PivotAreaReference.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.field) {
		writer.WriteXmlAttributeNumber("field", this.field);
	}
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	if (null !== this.selected) {
		writer.WriteXmlAttributeBool("selected", this.selected);
	}
	if (null !== this.byPosition) {
		writer.WriteXmlAttributeBool("byPosition", this.byPosition);
	}
	if (null !== this.relative) {
		writer.WriteXmlAttributeBool("relative", this.relative);
	}
	if (null !== this.defaultSubtotal) {
		writer.WriteXmlAttributeBool("defaultSubtotal", this.defaultSubtotal);
	}
	if (null !== this.sumSubtotal) {
		writer.WriteXmlAttributeBool("sumSubtotal", this.sumSubtotal);
	}
	if (null !== this.countASubtotal) {
		writer.WriteXmlAttributeBool("countASubtotal", this.countASubtotal);
	}
	if (null !== this.avgSubtotal) {
		writer.WriteXmlAttributeBool("avgSubtotal", this.avgSubtotal);
	}
	if (null !== this.maxSubtotal) {
		writer.WriteXmlAttributeBool("maxSubtotal", this.maxSubtotal);
	}
	if (null !== this.minSubtotal) {
		writer.WriteXmlAttributeBool("minSubtotal", this.minSubtotal);
	}
	if (null !== this.productSubtotal) {
		writer.WriteXmlAttributeBool("productSubtotal", this.productSubtotal);
	}
	if (null !== this.countSubtotal) {
		writer.WriteXmlAttributeBool("countSubtotal", this.countSubtotal);
	}
	if (null !== this.stdDevSubtotal) {
		writer.WriteXmlAttributeBool("stdDevSubtotal", this.stdDevSubtotal);
	}
	if (null !== this.stdDevPSubtotal) {
		writer.WriteXmlAttributeBool("stdDevPSubtotal", this.stdDevPSubtotal);
	}
	if (null !== this.varSubtotal) {
		writer.WriteXmlAttributeBool("varSubtotal", this.varSubtotal);
	}
	if (null !== this.varPSubtotal) {
		writer.WriteXmlAttributeBool("varPSubtotal", this.varPSubtotal);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.x.length; ++i) {
		var elem = this.x[i];
		res += elem.toXml(writer, "x");
	}
	if (null !== this.extLst) {
		res += this.extLst.toXml(writer, "extLst");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_ColorFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.dxfId) {
		writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	}
	if (null !== this.cellColor) {
		writer.WriteXmlAttributeBool("cellColor", this.cellColor);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_CustomFilters.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.and) {
		writer.WriteXmlAttributeBool("and", this.and);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.customFilter.length; ++i) {
		var elem = this.customFilter[i];
		res += elem.toXml(writer, "customFilter");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_DynamicFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.type) {
		writer.WriteXmlAttributeString("type", ToXml_ST_DynamicFilterType(this.type));
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeNumber("val", this.val);
	}
	if (null !== this.valIso) {
		writer.WriteXmlAttributeString("valIso", this.valIso);
	}
	if (null !== this.maxValIso) {
		writer.WriteXmlAttributeString("maxValIso", this.maxValIso);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Filters.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.blank) {
		writer.WriteXmlAttributeBool("blank", this.blank);
	}
	if (null !== this.calendarType) {
		writer.WriteXmlAttributeString("calendarType", ToXml_ST_CalendarType(this.calendarType));
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.filter.length; ++i) {
		var elem = this.filter[i];
		res += elem.toXml(writer, "filter");
	}
	for (var i = 0; i < this.dateGroupItem.length; ++i) {
		var elem = this.dateGroupItem[i];
		res += elem.toXml(writer, "dateGroupItem");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_IconFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeString("iconSet", ToXml_ST_IconSetType(this.iconSet));
	}
	if (null !== this.iconId) {
		writer.WriteXmlAttributeNumber("iconId", this.iconId);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Top10.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.top) {
		writer.WriteXmlAttributeBool("top", this.top);
	}
	if (null !== this.percent) {
		writer.WriteXmlAttributeBool("percent", this.percent);
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeNumber("val", this.val);
	}
	if (null !== this.filterVal) {
		writer.WriteXmlAttributeNumber("filterVal", this.filterVal);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_SortCondition.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.descending) {
		writer.WriteXmlAttributeBool("descending", this.descending);
	}
	if (null !== this.sortBy) {
		writer.WriteXmlAttributeString("sortBy", ToXml_ST_SortBy(this.sortBy));
	}
	if (null !== this.ref) {
		writer.WriteXmlAttributeString("ref", this.ref);
	}
	if (null !== this.customList) {
		writer.WriteXmlAttributeString("customList", this.customList);
	}
	if (null !== this.dxfId) {
		writer.WriteXmlAttributeNumber("dxfId", this.dxfId);
	}
	if (null !== this.iconSet) {
		writer.WriteXmlAttributeString("iconSet", ToXml_ST_IconSetType(this.iconSet));
	}
	if (null !== this.iconId) {
		writer.WriteXmlAttributeNumber("iconId", this.iconId);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_LevelGroup.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.name) {
		writer.WriteXmlAttributeString("name", this.name);
	}
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.caption) {
		writer.WriteXmlAttributeString("caption", this.caption);
	}
	if (null !== this.uniqueParent) {
		writer.WriteXmlAttributeString("uniqueParent", this.uniqueParent);
	}
	if (null !== this.id) {
		writer.WriteXmlAttributeNumber("id", this.id);
	}
	writer.WriteXmlNodeEnd(name, true);
	if (null !== this.groupMembers) {
		res += this.groupMembers.toXml(writer, "groupMembers");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_CustomFilter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.operator) {
		writer.WriteXmlAttributeString("operator", ToXml_ST_FilterOperator(this.operator));
	}
	if (null !== this.val) {
		writer.WriteXmlAttributeString("val", this.val);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_Filter.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.val) {
		writer.WriteXmlAttributeString("val", this.val);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_DateGroupItem.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.year) {
		writer.WriteXmlAttributeNumber("year", this.year);
	}
	if (null !== this.month) {
		writer.WriteXmlAttributeNumber("month", this.month);
	}
	if (null !== this.day) {
		writer.WriteXmlAttributeNumber("day", this.day);
	}
	if (null !== this.hour) {
		writer.WriteXmlAttributeNumber("hour", this.hour);
	}
	if (null !== this.minute) {
		writer.WriteXmlAttributeNumber("minute", this.minute);
	}
	if (null !== this.second) {
		writer.WriteXmlAttributeNumber("second", this.second);
	}
	if (null !== this.dateTimeGrouping) {
		writer.WriteXmlAttributeString("dateTimeGrouping", ToXml_ST_DateTimeGrouping(this.dateTimeGrouping));
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
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
CT_GroupMembers.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.count) {
		writer.WriteXmlAttributeNumber("count", this.count);
	}
	writer.WriteXmlNodeEnd(name, true);
	for (var i = 0; i < this.groupMember.length; ++i) {
		var elem = this.groupMember[i];
		res += elem.toXml(writer, "groupMember");
	}
	writer.WriteXmlNodeEnd(name);
	return res;
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
CT_GroupMember.prototype.toXml = function(writer, name) {
	var res = "";
	writer.WriteXmlNodeStart(name);
	if (null !== this.uniqueName) {
		writer.WriteXmlAttributeString("uniqueName", this.uniqueName);
	}
	if (null !== this.group) {
		writer.WriteXmlAttributeBool("group", this.group);
	}
	writer.WriteXmlNodeEnd(name, true, true);
	return res;
};
