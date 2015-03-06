"use strict";

var g_bDate1904 = false;
var FONT_THUMBNAIL_HEIGHT = (7 * 96.0 / 25.4) >> 0;

//files type for Saving & DownloadAs
var c_oAscFileType = {
	PDF		: 0x0201,
	HTML	: 0x0803,

	// Word
	DOCX	: 0x0041,
	DOC		: 0x0042,
	ODT		: 0x0043,
	RTF		: 0x0044,
	TXT		: 0x0045,
	MHT		: 0x0047,
	EPUB	: 0x0048,
	FB2		: 0x0049,
	MOBI	: 0x004a,
	DOCY	: 0x1001,
	JSON	: 0x0808,	// Для mail-merge

	// Excel
	XLSX	: 0x0101,
	XLS		: 0x0102,
	ODS		: 0x0103,
	CSV		: 0x0104,
	XLSY	: 0x1002,

	// PowerPoint
	PPTX	: 0x0081,
	PPT		: 0x0082,
	ODP		: 0x0083
};

var c_oAscAsyncAction = {
	Open				: 0,  // открытие документа
	Save				: 1,  // сохранение
	LoadDocumentFonts	: 2,  // загружаем фонты документа (сразу после открытия)
	LoadDocumentImages	: 3,  // загружаем картинки документа (сразу после загрузки шрифтов)
	LoadFont			: 4,  // подгрузка нужного шрифта
	LoadImage			: 5,  // подгрузка картинки
	DownloadAs			: 6,  // cкачать
	Print				: 7,  // конвертация в PDF и сохранение у пользователя
	UploadImage			: 8,  // загрузка картинки

	ApplyChanges		: 9,  // применение изменений от другого пользователя.
	Recalc				: 10, // пересчет формул
	SlowOperation		: 11, // медленная операция
	LoadTheme			: 12, // загрузка темы
	MailMergeLoadFile	: 13  // загрузка файла для mail merge
};

// Режимы отрисовки
var c_oAscFontRenderingModeType = {
	noHinting				: 1,
	hinting					: 2,
	hintingAndSubpixeling	: 3
};

var c_oAscAsyncActionType = {
	Information			: 0,
	BlockInteraction	: 1
};

var CellValueType = {
	Number	: 0,
	String	: 1,
	Bool	: 2,
	Error	: 3
};

//NumFormat defines
var c_oAscNumFormatType = {
	General		: 0,
	Custom		: 1,
	Text		: 2,
	Number		: 3,
	Integer		: 4,
	Scientific	: 5,
	Currency	: 6,
	Date		: 7,
	Time		: 8,
	Percent		: 9,
	Fraction	: 10,
	Accounting	: 11
};
 
 var c_oAscDrawingLayerType = {
	BringToFront	: 0,
	SendToBack		: 1,
	BringForward	: 2,
	SendBackward	: 3
 };
						
var c_oAscCellAnchorType = {
	cellanchorAbsolute	:  0,
	cellanchorOneCell	:  1,
	cellanchorTwoCell	:  2
};

var c_oAscChartDefines = {
	defaultChartWidth	: 478,
	defaultChartHeight	: 286
};

var c_oAscStyleImage = {
	Default		: 0,
	Document	: 1
};

var c_oAscTypeSelectElement = {
	Paragraph  : 0,
	Table      : 1,
	Image      : 2,
	Header     : 3,
	Hyperlink  : 4,
	SpellCheck : 5,
	Shape      : 6,
	Slide      : 7,
	Chart      : 8,
	Math       : 9,
	MailMerge  : 10
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
var c_oAscBorderType = {
	Hor		: 1,
	Ver		: 2,
	Diag	: 3
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

var c_oAscSaveTypes = {
	PartStart	: 0,
	Part		: 1,
	Complete	: 2,
	CompleteAll	: 3
};

var c_oAscColor = {
	COLOR_TYPE_NONE		: 0,
	COLOR_TYPE_SRGB		: 1,
	COLOR_TYPE_PRST		: 2,
	COLOR_TYPE_SCHEME	: 3,
	COLOR_TYPE_SYS		: 4
};

var c_oAscFill = {
	FILL_TYPE_BLIP   : 1,
	FILL_TYPE_NOFILL : 2,
	FILL_TYPE_SOLID	 : 3,
	FILL_TYPE_PATT   : 4,
	FILL_TYPE_GRAD   : 5
};

// Chart defines
var c_oAscChartType = {
	line	: "Line",
	bar		: "Bar",
	hbar	: "HBar",
	area	: "Area",
	pie		: "Pie",
	scatter	: "Scatter",
	stock	: "Stock",
	doughnut: "Doughnut"
};
var c_oAscChartSubType = {
	normal		: "normal",
	stacked		: "stacked",
	stackedPer	: "stackedPer"
};

var c_oAscFillGradType  = {
	GRAD_LINEAR : 1,
	GRAD_PATH   : 2
};
var c_oAscFillBlipType = {
	STRETCH : 1,
	TILE    : 2
};
var c_oAscStrokeType = {
	STROKE_NONE	: 0,
	STROKE_COLOR: 1
};

var c_oAscVerticalTextAlign = {
	TEXT_ALIGN_BOTTOM	: 0, // (Text Anchor Enum ( Bottom ))
	TEXT_ALIGN_CTR		: 1, // (Text Anchor Enum ( Center ))
	TEXT_ALIGN_DIST		: 2, // (Text Anchor Enum ( Distributed ))
	TEXT_ALIGN_JUST		: 3, // (Text Anchor Enum ( Justified ))
	TEXT_ALIGN_TOP		: 4  // Top
};
var c_oAscLineJoinType = {
	Round : 1,
	Bevel : 2,
	Miter : 3
};
var c_oAscLineCapType = {
	Flat	: 0,
	Round	: 1,
	Square	: 2
};
var c_oAscLineBeginType = {
	None	: 0,
	Arrow	: 1,
	Diamond	: 2,
	Oval	: 3,
	Stealth	: 4,
	Triangle: 5
};
var c_oAscLineBeginSize = {
	small_small	: 0,
	small_mid	: 1,
	small_large	: 2,
	mid_small	: 3,
	mid_mid		: 4,
	mid_large	: 5,
	large_small	: 6,
	large_mid	: 7,
	large_large	: 8
};