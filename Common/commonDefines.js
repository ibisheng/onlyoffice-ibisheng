"use strict";

var g_bDate1904 = false;

var CellValueType = 
{
	Number:0,
	String:1,	
	Bool:2,
	Error:3
}

//NumFormat defines
var c_oAscNumFormatType = {
	General : 0,
	Custom : 1,
	Text : 2,
	Number : 3,
	Integer : 4,
	Scientific : 5,
	Currency : 6,
	Date : 7,
	Time : 8,
	Percent : 9,
	Fraction : 10
}



 var c_oAscChartLegend = {
	left: "left",
	right: "right",
	top: "top",
	bottom: "bottom"
 };
 
 var c_oAscDrawingLayerType = {
	BringToFront: 0,
	SendToBack: 1,
	BringForward: 2,
	SendBackward: 3
 };
 


var	c_oAscTransactionState = { 
	No: -1,
	Start: 0,
	Stop: 1
};
						
var c_oAscCellAnchorType = {
	cellanchorAbsolute:  0,
	cellanchorOneCell:  1,
	cellanchorTwoCell:  2
};

var c_oAscChartDefines = {
	defaultChartWidth: 478,
	defaultChartHeight: 286
};

var c_oAscLineDrawingRule = {
    Left   : 0,
    Center : 1,
    Right  : 2,
    Top    : 0,
    Bottom : 2
};

var align_Right   = 0;
var align_Left    = 1;
var align_Center  = 2;
var align_Justify = 3;


var linerule_AtLeast = 0;
var linerule_Auto    = 1;
var linerule_Exact   = 2;

var shd_Clear = 0;
var shd_Nil   = 1;

var vertalign_Baseline    = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript   = 2;
var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;
