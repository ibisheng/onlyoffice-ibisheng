"use strict";

var g_bDate1904 = false;

var CellValueType = 
{
	Number:0,
	String:1,	
	Bool:2,
	Error:3
};

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


var c_oAscChartTitleShowSettings =
{
    none: 0,
    overlay: 1,
    noOverlay: 2
};

var c_oAscChartHorAxisLabelShowSettings =
{
    none: 0,
    noOverlay: 1
};


var c_oAscChartVertAxisLabelShowSettings =
{
    none: 0,
    rotated: 1,
    vertical: 2,
    horizontal: 3
};

var c_oAscChartLegendShowSettings =
{
    none: 0,
    left: 1,
    top: 2,
    right: 3,
    bottom: 4,
    leftOverlay: 5,
    rightOverlay: 6,
    layout: 7
};

var c_oAscChartDataLabelsPos =
{
    none: 0,
    b: 1,
    bestFit: 2,
    ctr: 3,
    inBase: 4,
    inEnd: 5,
    l: 6,
    outEnd: 7,
    r: 8,
    t: 9
};

var c_oAscChartCatAxisSettings =
{
    none: 0,
    leftToRight: 1,
    rightToLeft: 2,
    noLabels: 3
};

var c_oAscChartValAxisSettings =
{
    none: 0,
    byDefault: 1,
    thousands: 2,
    millions: 3,
    billions: 4,
    log: 5
};

var c_oAscAxisTypeSettings =
{
    vert: 0,
    hor: 1
};

var c_oAscGridLinesSettings =
{
    none: 0,
    major: 1,
    minor: 2,
    majorMinor: 3
};


var c_oAscChartTypeSettings =
{
    barNormal           : 0,
    barStacked          : 1,
    barStackedPer       : 2,
    lineNormal          : 3,
    lineStacked         : 4,
    lineStackedPer      : 5,
    lineNormalMarker    : 6,
    lineStackedMarker   : 7,
    lineStackedPerMarker: 8,
    pie                 : 9,
    hBarNormal          : 10,
    hBarStacked         : 11,
    hBarStackedPer      : 12,
    areaNormal          : 13,
    areaStacked         : 14,
    areaStackedPer      : 15,
    doughnut            : 16,
    stock               : 17,
    scatter             : 18,
    scatterLine         : 19,
    scatterLineMarker   : 20,
    scatterMarker       : 21,
    scatterNone         : 22,
    scatterSmooth       : 23,
    scatterSmoothMarker : 24,
    unknown: 25
};


var c_oAscValAxisRule =
{
    auto:0,
    fixed:1
};

var c_oAscValAxUnits =
{
    none:0,
    BILLIONS: 1,
    HUNDRED_MILLIONS: 2,
    HUNDREDS: 3,
    HUNDRED_THOUSANDS: 4,
    MILLIONS: 5,
    TEN_MILLIONS: 6,
    TEN_THOUSANDS: 7,
    TRILLIONS: 8,
    CUSTOM: 9,
    THOUSANDS: 10

};

var c_oAscTickMark =
{
    TICK_MARK_CROSS: 0,
    TICK_MARK_IN: 1,
    TICK_MARK_NONE: 2,
    TICK_MARK_OUT: 3
};

var c_oAscTickLabelsPos =
{
    TICK_LABEL_POSITION_HIGH:0,
    TICK_LABEL_POSITION_LOW:    1,
    TICK_LABEL_POSITION_NEXT_TO:  2,
    TICK_LABEL_POSITION_NONE    :  3
};

var c_oAscCrossesRule =
{
    auto:0,
    maxValue: 1,
    value: 2,
    minValue: 3
};

var c_oAscHorAxisType =
{
    auto: 0,
    date: 1,
    text: 2
};

var c_oAscBetweenLabelsRule =
{
    auto: 0,
    manual: 1
};

var c_oAscLabelsPosition =
{
    byDivisions: 0,
    betweenDivisions: 1
};


var c_oAscAxisType =
{
    auto: 0,
    date: 1,
    text: 2,
    cat : 3,
    val : 4
};

var c_oAscHAnchor = {
    Margin: 0x00,
    Page: 0x01,
    Text: 0x02,

    PageInternal: 0xFF // только для внутреннего использования
};

var c_oAscXAlign = {
    Center: 0x00,
    Inside: 0x01,
    Left: 0x02,
    Outside: 0x03,
    Right: 0x04
};
var c_oAscYAlign = {
    Bottom: 0x00,
    Center: 0x01,
    Inline: 0x02,
    Inside: 0x03,
    Outside: 0x04,
    Top: 0x05
};

var c_oAscVAnchor = {
    Margin: 0x00,
    Page: 0x01,
    Text: 0x02
};

var c_oAscRelativeFromH = {
    Character: 0x00,
    Column: 0x01,
    InsideMargin: 0x02,
    LeftMargin: 0x03,
    Margin: 0x04,
    OutsideMargin: 0x05,
    Page: 0x06,
    RightMargin: 0x07
};

var c_oAscRelativeFromV = {
    BottomMargin: 0x00,
    InsideMargin: 0x01,
    Line: 0x02,
    Margin: 0x03,
    OutsideMargin: 0x04,
    Page: 0x05,
    Paragraph: 0x06,
    TopMargin: 0x07
};

// image wrap style
var c_oAscWrapStyle = {
	Inline:0,
	Flow : 1
};

// math
var c_oAscLimLoc = {
    SubSup: 0x00,
    UndOvr: 0x01
};
var c_oAscMathJc = {
    Center: 0x00,
    CenterGroup: 0x01,
    Left: 0x02,
    Right: 0x03
};
var c_oAscTopBot = {
    Bot: 0x00,
    Top: 0x01
};
var c_oAscScript = {
    DoubleStruck: 0x00,
    Fraktur: 0x01,
    Monospace: 0x02,
    Roman: 0x03,
    SansSerif: 0x04,
    Script: 0x05
};
var c_oAscShp = {
    Centered: 0x00,
    Match: 0x01
};
var c_oAscSty = {
    Bold: 0x00,
    BoldItalic: 0x01,
    Italic: 0x02,
    Plain: 0x03
};
var c_oAscFType = {
    Bar: 0x00,
    Lin: 0x01,
    NoBar: 0x02,
    Skw: 0x03
};
var c_oAscBrkBin = {
    After: 0x00,
    Before: 0x01,
    Repeat: 0x02
};
var c_oAscBrkBinSub = {
    PlusMinus: 0x00,
    MinusPlus: 0x01,
    MinusMinus: 0x02
};
// Толщина бордера
var c_oAscBorderWidth = {
    None	: 0,	// 0px
    Thin	: 1,	// 1px
    Medium	: 2,	// 2px
    Thick	: 3		// 3px
};
// Располагаются в порядке значимости для отрисовки
var c_oAscBorderStyles = {
    None				: 0,
    Double				: 1,
    Hair				: 2,
    DashDotDot			: 3,
    DashDot				: 4,
    Dotted				: 5,
    Dashed				: 6,
    Thin				: 7,
    MediumDashDotDot	: 8,
    SlantDashDot		: 9,
    MediumDashDot		: 10,
    MediumDashed		: 11,
    Medium				: 12,
    Thick				: 13
};
// PageOrientation
var c_oAscPageOrientation = {
    PagePortrait	: 1,
    PageLandscape	: 2
};
/**
 * lock types
 * @const
 */
var c_oAscLockTypes = {
    kLockTypeNone	: 1, // никто не залочил данный объект
    kLockTypeMine	: 2, // данный объект залочен текущим пользователем
    kLockTypeOther	: 3, // данный объект залочен другим(не текущим) пользователем
    kLockTypeOther2	: 4, // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
    kLockTypeOther3	: 5  // данный объект был залочен (обновления пришли) и снова стал залочен
};

var c_oAscFormatPainterState = {
	     kOff : 0,
	      kOn : 1,
	kMultiple : 2
};

var kCurFormatPainter = "";
if (AscBrowser.isIE)
	// Пути указаны относительно html в меню, не надо их исправлять
	// и коммитить на пути относительно тестового меню
	kCurFormatPainter = "url(../../../sdk/Common/Images/copy_format.cur), pointer";
else if (AscBrowser.isOpera)
	kCurFormatPainter = "pointer";
else
	kCurFormatPainter = "url('data:image/png;base64,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\
		emp/gv47IxYAAAAASUVORK5CYII=') 14 8, pointer";