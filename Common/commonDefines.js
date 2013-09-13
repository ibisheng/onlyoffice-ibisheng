
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

// Chart defines
var c_oAscChartType = {
	line: "Line",
	bar: "Bar",
	hbar: "HBar",
	area: "Area",
	pie: "Pie",
	scatter: "Scatter",
	stock: "Stock"
 };

 var c_oAscChartSubType = {
	normal: "normal",
	stacked: "stacked",
	stackedPer: "stackedPer"
 };

 var c_oAscChartLegend = {
	left: "left",
	right: "right",
	top: "top",
	bottom: "bottom"
 };

 var c_oAscObjectLockState = {
	No: 1,
	On: 2,
	Off: 3
 };
 
 var c_oAscDrawingLayerType = {
	BringToFront: 0,
	SendToBack: 1,
	BringForward: 2,
	SendBackward: 3
 };
 
 var c_oAscChartStyle = {
	Dark: 1,
	Standart: 2,
	Accent1: 3,
	Accent2: 4,
	Accent3: 5,
	Accent4: 6,
	Accent5: 7,
	Accent6: 8
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


var c_oAscTypeSelectElement = {
    Paragraph  : 0,
    Table      : 1,
    Image      : 2,
    Header     : 3,
    Hyperlink  : 4,
    SpellCheck : 5,
    Shape:6,
    Slide:7,
    Chart: 8
};