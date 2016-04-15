"use strict";

(/**
* @param {Window} window
* @param {undefined} undefined
*/
function(window, undefined) {
var bDate1904 = false;
var FONT_THUMBNAIL_HEIGHT = (7 * 96.0 / 25.4) >> 0;
var c_oAscMaxColumnWidth = 255;
var c_oAscMaxRowHeight = 409;

//files type for Saving & DownloadAs
var c_oAscFileType = {
	UNKNOWN : 0,
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

	SlowOperation		: 11, // медленная операция
	LoadTheme			: 12, // загрузка темы
	MailMergeLoadFile	: 13, // загрузка файла для mail merge
	DownloadMerge		: 14, // cкачать файл с mail merge
	SendMailMerge		: 15  // рассылка mail merge по почте
};

var c_oAscAdvancedOptionsID = {
  CSV: 0,
  TXT: 1
};

var c_oAscAdvancedOptionsAction = {
	None: 0,
	Open: 1,
	Save: 2
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

var DownloadType = {
  None      : '',
  Download  : 'asc_onDownloadUrl',
  Print     : 'asc_onPrintUrl',
  MailMerge : 'asc_onSaveMailMerge'
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

var c_oAscShdClear = 0;
var c_oAscShdNil   = 1;

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
    barNormal             : 0,
    barStacked            : 1,
    barStackedPer         : 2,
    barNormal3d           : 3,
    barStacked3d          : 4,
    barStackedPer3d       : 5,
    barNormal3dPerspective: 6,
    lineNormal            : 7,
    lineStacked           : 8,
    lineStackedPer        : 9,
    lineNormalMarker      : 10,
    lineStackedMarker     : 11,
    lineStackedPerMarker  : 12,
    line3d                : 13,
    pie                   : 14,
    pie3d                 : 15,
    hBarNormal            : 16,
    hBarStacked           : 17,
    hBarStackedPer        : 18,
    hBarNormal3d          : 19,
    hBarStacked3d         : 20,
    hBarStackedPer3d      : 21,
    areaNormal            : 22,
    areaStacked           : 23,
    areaStackedPer        : 24,
    doughnut              : 25,
    stock                 : 26,
    scatter               : 27,
    scatterLine           : 28,
    scatterLineMarker     : 29,
    scatterMarker         : 30,
    scatterNone           : 31,
    scatterSmooth         : 32,
    scatterSmoothMarker   : 33,
    unknown               : 34
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

var c_oAscSizeRelFromH =
{
    sizerelfromhMargin: 0,
    sizerelfromhPage: 1,
    sizerelfromhLeftMargin: 2,
    sizerelfromhRightMargin: 3,
    sizerelfromhInsideMargin: 4,
    sizerelfromhOutsideMargin: 5
};

var c_oAscSizeRelFromV =
{
    sizerelfromvMargin: 0,
    sizerelfromvPage: 1,
    sizerelfromvTopMargin: 2,
    sizerelfromvBottomMargin: 3,
    sizerelfromvInsideMargin: 4,
    sizerelfromvOutsideMargin: 5
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
    PagePortrait	: 0x00,
    PageLandscape	: 0x01
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

var c_oAscVertDrawingText =
{
    normal : 1,
    vert   : 3,
    vert270: 4
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
var c_oAscCsvDelimiter = {
	None: 0,
	Tab: 1,
	Semicolon: 2,
	Сolon: 3,
	Comma: 4,
	Space: 5
};
var c_oAscUrlType = {
	Invalid : 0,
	Http: 1,
	Email: 2
};

var c_oAscCellTextDirection = {
    LRTB : 0x00,
    TBRL : 0x01,
    BTLR : 0x02
};

var c_oAscDocumentUnits = {
  Millimeter  : 0,
  Inch        : 1,
  Point       : 2
};


// Print default options (in mm)
var c_oAscPrintDefaultSettings = {
    // Размеры страницы при печати
    PageWidth: 210,
    PageHeight: 297,
    PageOrientation: c_oAscPageOrientation.PagePortrait,

    // Поля для страницы при печати
    PageLeftField: 17.8,
    PageRightField: 17.8,
    PageTopField: 19.1,
    PageBottomField: 19.1,

    PageGridLines: 0,
    PageHeadings: 0
};

var c_oAscEncodings = [
    [ 0,    28596, "ISO-8859-6",       "Arabic (ISO 8859-6)" ],
    [ 1,    720,   "DOS-720",          "Arabic (OEM 720)" ],
    [ 2,    1256,  "windows-1256",     "Arabic (Windows)" ],

    [ 3,    28594, "ISO-8859-4",       "Baltic (ISO 8859-4)" ],
    [ 4,    28603, "ISO-8859-13",      "Baltic (ISO 8859-13)" ],
    [ 5,    775,   "IBM775",           "Baltic (OEM 775)" ],
    [ 6,    1257,  "windows-1257",     "Baltic (Windows)" ],

    [ 7,    28604, "ISO-8859-14",      "Celtic (ISO 8859-14)" ],

    [ 8,    28595, "ISO-8859-5",       "Cyrillic (ISO 8859-5)" ],
    [ 9,    20866, "KOI8-R",           "Cyrillic (KOI8-R)" ],
    [ 10,   21866, "KOI8-U",           "Cyrillic (KOI8-U)" ],
    [ 11,   10007, "x-mac-cyrillic",   "Cyrillic (Mac)" ],
    [ 12,   855,   "IBM855",           "Cyrillic (OEM 855)" ],
    [ 13,   866,   "cp866",            "Cyrillic (OEM 866)" ],
    [ 14,   1251,  "windows-1251",     "Cyrillic (Windows)" ],

    [ 15,   852,   "IBM852",           "Central European (OEM 852)" ],
    [ 16,   1250,  "windows-1250",     "Central European (Windows)" ],

    [ 17,   950,   "Big5",             "Chinese (Big5 Traditional)" ],
    [ 18,   936,   "GB2312",           "Central (GB2312 Simplified)" ],

    [ 19,   28592, "ISO-8859-2",       "Eastern European (ISO 8859-2)" ],

    [ 20,   28597, "ISO-8859-7",       "Greek (ISO 8859-7)" ],
    [ 21,   737,   "IBM737",           "Greek (OEM 737)" ],
    [ 22,   869,   "IBM869",           "Greek (OEM 869)" ],
    [ 23,   1253,  "windows-1253",     "Greek (Windows)" ],

    [ 24,   28598, "ISO-8859-8",       "Hebrew (ISO 8859-8)" ],
    [ 25,   862,   "DOS-862",          "Hebrew (OEM 862)" ],
    [ 26,   1255,  "windows-1255",     "Hebrew (Windows)" ],

    [ 27,   932,   "Shift_JIS",        "Japanese (Shift-JIS)" ],

    [ 28,   949,   "KS_C_5601-1987",   "Korean (Windows)" ],
    [ 29,   51949, "EUC-KR",           "Korean (EUC)" ],

    [ 30,   861,   "IBM861",           "North European (Icelandic OEM 861)" ],
    [ 31,   865,   "IBM865",           "North European (Nordic OEM 865)" ],

    [ 32,   874,   "windows-874",      "Thai (TIS-620)" ],

    [ 33,   28593, "ISO-8859-3",       "Turkish (ISO 8859-3)" ],
    [ 34,   28599, "ISO-8859-9",       "Turkish (ISO 8859-9)" ],
    [ 35,   857,   "IBM857",           "Turkish (OEM 857)" ],
    [ 36,   1254,  "windows-1254",     "Turkish (Windows)" ],

    [ 37,   28591, "ISO-8859-1",       "Western European (ISO-8859-1)" ],
    [ 38,   28605, "ISO-8859-15",      "Western European (ISO-8859-15)" ],
    [ 39,   850,   "IBM850",           "Western European (OEM 850)" ],
    [ 40,   858,   "IBM858",           "Western European (OEM 858)" ],
    [ 41,   860,   "IBM860",           "Western European (OEM 860 : Portuguese)" ],
    [ 42,   863,   "IBM863",           "Western European (OEM 863 : French)" ],
    [ 43,   437,   "IBM437",           "Western European (OEM-US)" ],
    [ 44,   1252,  "windows-1252",     "Western European (Windows)" ],

    [ 45,   1258,  "windows-1258",     "Vietnamese (Windows)" ],

    [ 46,   65001, "UTF-8",            "Unicode (UTF-8)" ],
    [ 47,   65000, "UTF-7",            "Unicode (UTF-7)" ],

    [ 48,   1200, "UTF-16",            "Unicode (UTF-16)" ],
    [ 49,   1201, "UTF-16BE",          "Unicode (UTF-16 Big Endian)" ],

    [ 50,   12000, "UTF-32",           "Unicode (UTF-32)" ],
    [ 51,   12001, "UTF-32BE",         "Unicode (UTF-32 Big Endian)" ]
];
var c_oAscEncodingsMap = {"437": 43, "720": 1, "737": 21, "775": 5, "850": 39, "852": 15, "855": 12, "857": 35, "858": 40, "860": 41, "861": 30, "862": 25, "863": 42, "865": 31, "866": 13, "869": 22, "874": 32, "932": 27, "936": 18, "949": 28, "950": 17, "1200": 48, "1201": 49, "1250": 16, "1251": 14, "1252": 44, "1253": 23, "1254": 36, "1255": 26, "1256": 2, "1257": 6, "1258": 45, "10007": 11, "12000": 50, "12001": 51, "20866": 9, "21866": 10, "28591": 37, "28592": 19, "28593": 33, "28594": 3, "28595": 8, "28596": 0, "28597": 20, "28598": 24, "28599": 34, "28603": 4, "28604": 7, "28605": 38, "51949": 29, "65000": 47, "65001": 46}
var c_oAscCodePageUtf8 = 46;//65001

// https://support.office.com/en-us/article/Excel-specifications-and-limits-16c69c74-3d6a-4aaf-ba35-e6eb276e8eaa?ui=en-US&rs=en-US&ad=US&fromAR=1
var c_oAscMaxTooltipLength = 256;
var c_oAscMaxCellOrCommentLength = 32767;
var c_oAscMaxFormulaLength = 8192;

var locktype_None   = 1; // никто не залочил данный объект
var locktype_Mine   = 2; // данный объект залочен текущим пользователем
var locktype_Other  = 3; // данный объект залочен другим(не текущим) пользователем
var locktype_Other2 = 4; // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
var locktype_Other3 = 5; // данный объект был залочен (обновления пришли) и снова стал залочен

var changestype_None                 =  0; // Ничего не происходит с выделенным элементом (проверка идет через дополнительный параметр)
var changestype_Paragraph_Content    =  1; // Добавление/удаление элементов в параграф
var changestype_Paragraph_Properties =  2; // Изменение свойств параграфа
var changestype_Document_Content     = 10; // Добавление/удаление элементов в Document или в DocumentContent
var changestype_Document_Content_Add = 11; // Добавление элемента в класс Document или в класс DocumentContent
var changestype_Document_SectPr      = 12; // Изменения свойств данной секции (размер страницы, поля и ориентация)
var changestype_Document_Styles      = 13; // Изменяем стили документа (добавление/удаление/модифицирование)
var changestype_Table_Properties     = 20; // Любые изменения в таблице
var changestype_Table_RemoveCells    = 21; // Удаление ячеек (строк или столбцов)
var changestype_Image_Properties     = 23; // Изменения настроек картинки
var changestype_HdrFtr               = 30; // Изменения в колонтитуле (любые изменения)
var changestype_Remove               = 40; // Удаление, через кнопку backspace (Удаление назад)
var changestype_Delete               = 41; // Удаление, через кнопку delete (Удаление вперед)
var changestype_Drawing_Props        = 51; // Изменение свойств фигуры
var changestype_ColorScheme          = 60; // Изменение свойств фигуры
var changestype_Text_Props           = 61; // Изменение свойств фигуры
var changestype_RemoveSlide          = 62; // Изменение свойств фигуры
var changestype_PresentationProps    = 63; // Изменение темы, цветовой схемы, размера слайда;
var changestype_Theme                = 64; // Изменение темы;
var changestype_SlideSize            = 65; // Изменение цветовой схемы;
var changestype_SlideBg              = 66; // Изменение цветовой схемы;
var changestype_SlideTiming          = 67; // Изменение цветовой схемы;
var changestype_MoveComment          = 68;
var changestype_AddSp                = 69;
var changestype_AddComment           = 70;
var changestype_Layout               = 71;
var changestype_AddShape             = 72;
var changestype_AddShapes            = 73;

var changestype_2_InlineObjectMove       = 1; // Передвигаем объект в заданную позцию (проверяем место, в которое пытаемся передвинуть)
var changestype_2_HdrFtr                 = 2; // Изменения с колонтитулом
var changestype_2_Comment                = 3; // Работает с комментариями
var changestype_2_Element_and_Type       = 4; // Проверяем возможно ли сделать изменение заданного типа с заданным элементом(а не с текущим)
var changestype_2_ElementsArray_and_Type = 5; // Аналогично предыдущему, только идет массив элементов
var changestype_2_AdditionalTypes        = 6; // Дополнительные проверки типа 1

var contentchanges_Add    = 1;
var contentchanges_Remove = 2;

var offlineMode = '_offline_';


//------------------------------------------------------------export---------------------------------------------------
window['Asc'] = window['Asc'] || {};
window['Asc']['FONT_THUMBNAIL_HEIGHT'] = FONT_THUMBNAIL_HEIGHT;
window['Asc']['c_oAscMaxColumnWidth'] = window['Asc'].c_oAscMaxColumnWidth = c_oAscMaxColumnWidth;
window['Asc']['c_oAscMaxRowHeight'] = window['Asc'].c_oAscMaxRowHeight = c_oAscMaxRowHeight;
window['Asc']['c_oAscFileType'] = window['Asc'].c_oAscFileType = c_oAscFileType;
window['Asc']['c_oAscAsyncAction'] = window['Asc'].c_oAscAsyncAction = c_oAscAsyncAction;
window['Asc']['c_oAscAdvancedOptionsID'] = window['Asc'].c_oAscAdvancedOptionsID = c_oAscAdvancedOptionsID;
window['Asc']['c_oAscFontRenderingModeType'] = window['Asc'].c_oAscFontRenderingModeType = c_oAscFontRenderingModeType;
window['Asc']['c_oAscAsyncActionType'] = window['Asc'].c_oAscAsyncActionType = c_oAscAsyncActionType;
window['Asc']['c_oAscNumFormatType'] = window['Asc'].c_oAscNumFormatType = c_oAscNumFormatType;
window['Asc']['c_oAscDrawingLayerType'] = c_oAscDrawingLayerType;
window['Asc']['c_oAscTypeSelectElement'] = window['Asc'].c_oAscTypeSelectElement = c_oAscTypeSelectElement;
window['Asc']['linerule_AtLeast'] = window['Asc'].linerule_AtLeast = linerule_AtLeast;
window['Asc']['linerule_Auto'] = window['Asc'].linerule_Auto = linerule_Auto;
window['Asc']['linerule_Exact'] = window['Asc'].linerule_Exact = linerule_Exact;
window['Asc']['c_oAscShdClear'] = window['Asc'].c_oAscShdClear = c_oAscShdClear;
window['Asc']['c_oAscShdNil'] = window['Asc'].c_oAscShdNil = c_oAscShdNil;
window['Asc']['c_oAscChartTitleShowSettings'] = window['Asc'].c_oAscChartTitleShowSettings = c_oAscChartTitleShowSettings;
window['Asc']['c_oAscChartHorAxisLabelShowSettings'] = window['Asc'].c_oAscChartHorAxisLabelShowSettings = c_oAscChartHorAxisLabelShowSettings;
window['Asc']['c_oAscChartVertAxisLabelShowSettings'] = window['Asc'].c_oAscChartVertAxisLabelShowSettings = c_oAscChartVertAxisLabelShowSettings;
window['Asc']['c_oAscChartLegendShowSettings'] = window['Asc'].c_oAscChartLegendShowSettings = c_oAscChartLegendShowSettings;
window['Asc']['c_oAscChartDataLabelsPos'] = window['Asc'].c_oAscChartDataLabelsPos = c_oAscChartDataLabelsPos;
window['Asc']['c_oAscGridLinesSettings'] = window['Asc'].c_oAscGridLinesSettings = c_oAscGridLinesSettings;
window['Asc']['c_oAscChartTypeSettings'] = window['Asc'].c_oAscChartTypeSettings = c_oAscChartTypeSettings;
window['Asc']['c_oAscValAxisRule'] = window['Asc'].c_oAscValAxisRule = c_oAscValAxisRule;
window['Asc']['c_oAscValAxUnits'] = window['Asc'].c_oAscValAxUnits = c_oAscValAxUnits;
window['Asc']['c_oAscTickMark'] = window['Asc'].c_oAscTickMark = c_oAscTickMark;
window['Asc']['c_oAscTickLabelsPos'] = window['Asc'].c_oAscTickLabelsPos = c_oAscTickLabelsPos;
window['Asc']['c_oAscCrossesRule'] = window['Asc'].c_oAscCrossesRule = c_oAscCrossesRule;
window['Asc']['c_oAscBetweenLabelsRule'] = window['Asc'].c_oAscBetweenLabelsRule = c_oAscBetweenLabelsRule;
window['Asc']['c_oAscLabelsPosition'] = window['Asc'].c_oAscLabelsPosition = c_oAscLabelsPosition;
window['Asc']['c_oAscAxisType'] = window['Asc'].c_oAscAxisType = c_oAscAxisType;
window['Asc']['c_oAscHAnchor'] = window['Asc'].c_oAscHAnchor = c_oAscHAnchor;
window['Asc']['c_oAscXAlign'] = window['Asc'].c_oAscXAlign = c_oAscXAlign;
window['Asc']['c_oAscYAlign'] = window['Asc'].c_oAscYAlign = c_oAscYAlign;
window['Asc']['c_oAscVAnchor'] = window['Asc'].c_oAscVAnchor = c_oAscVAnchor;
window['Asc']['c_oAscRelativeFromH'] = window['Asc'].c_oAscRelativeFromH = c_oAscRelativeFromH;
window['Asc']['c_oAscRelativeFromV'] = window['Asc'].c_oAscRelativeFromV = c_oAscRelativeFromV;
window['Asc']['c_oAscPageOrientation'] = window['Asc'].c_oAscPageOrientation = c_oAscPageOrientation;
window['Asc']['c_oAscColor'] = window['Asc'].c_oAscColor = c_oAscColor;
window['Asc']['c_oAscFill'] = window['Asc'].c_oAscFill = c_oAscFill;
window['Asc']['c_oAscFillGradType'] = window['Asc'].c_oAscFillGradType = c_oAscFillGradType;
window['Asc']['c_oAscFillBlipType'] = window['Asc'].c_oAscFillBlipType = c_oAscFillBlipType;
window['Asc']['c_oAscStrokeType'] = window['Asc'].c_oAscStrokeType = c_oAscStrokeType;
window['Asc']['c_oAscVerticalTextAlign'] = c_oAscVerticalTextAlign;
window['Asc']['c_oAscVertDrawingText'] = c_oAscVertDrawingText;
window['Asc']['c_oAscLineJoinType'] = c_oAscLineJoinType;
window['Asc']['c_oAscLineCapType'] = c_oAscLineCapType;
window['Asc']['c_oAscLineBeginType'] = c_oAscLineBeginType;
window['Asc']['c_oAscLineBeginSize'] = c_oAscLineBeginSize;
window['Asc']['c_oAscCellTextDirection'] = window['Asc'].c_oAscCellTextDirection = c_oAscCellTextDirection;
window['Asc']['c_oAscDocumentUnits'] = window['Asc'].c_oAscDocumentUnits = c_oAscDocumentUnits;
window['Asc']['c_oAscMaxTooltipLength'] = window['Asc'].c_oAscMaxTooltipLength = c_oAscMaxTooltipLength;
window['Asc']['c_oAscMaxCellOrCommentLength'] = window['Asc'].c_oAscMaxCellOrCommentLength = c_oAscMaxCellOrCommentLength;

  window['AscCommon'] = window['AscCommon'] || {};
  window["AscCommon"].bDate1904 = bDate1904;
  window["AscCommon"].c_oAscAdvancedOptionsAction = c_oAscAdvancedOptionsAction;
  window["AscCommon"].DownloadType = DownloadType;
  window["AscCommon"].CellValueType = CellValueType;
  window["AscCommon"].c_oAscCellAnchorType = c_oAscCellAnchorType;
  window["AscCommon"].c_oAscChartDefines = c_oAscChartDefines;
  window["AscCommon"].c_oAscStyleImage = c_oAscStyleImage;
  window["AscCommon"].c_oAscLineDrawingRule = c_oAscLineDrawingRule;
  window["AscCommon"].align_Right = align_Right;
  window["AscCommon"].align_Left = align_Left;
  window["AscCommon"].align_Center = align_Center;
  window["AscCommon"].align_Justify = align_Justify;
  window["AscCommon"].vertalign_Baseline = vertalign_Baseline;
  window["AscCommon"].vertalign_SuperScript = vertalign_SuperScript;
  window["AscCommon"].vertalign_SubScript = vertalign_SubScript;
  window["AscCommon"].hdrftr_Header = hdrftr_Header;
  window["AscCommon"].hdrftr_Footer = hdrftr_Footer;
  window["AscCommon"].c_oAscSizeRelFromH = c_oAscSizeRelFromH;
  window["AscCommon"].c_oAscSizeRelFromV = c_oAscSizeRelFromV;
  window["AscCommon"].c_oAscWrapStyle = c_oAscWrapStyle;
  window["AscCommon"].c_oAscBorderWidth = c_oAscBorderWidth;
  window["AscCommon"].c_oAscBorderStyles = c_oAscBorderStyles;
  window["AscCommon"].c_oAscBorderType = c_oAscBorderType;
  window["AscCommon"].c_oAscLockTypes = c_oAscLockTypes;
  window["AscCommon"].c_oAscFormatPainterState = c_oAscFormatPainterState;
  window["AscCommon"].c_oAscSaveTypes = c_oAscSaveTypes;
  window["AscCommon"].c_oAscChartType = c_oAscChartType;
  window["AscCommon"].c_oAscChartSubType = c_oAscChartSubType;
  window["AscCommon"].c_oAscCsvDelimiter = c_oAscCsvDelimiter;
  window["AscCommon"].c_oAscUrlType = c_oAscUrlType;
  window["AscCommon"].c_oAscPrintDefaultSettings = c_oAscPrintDefaultSettings;
  window["AscCommon"].c_oAscEncodings = c_oAscEncodings;
  window["AscCommon"].c_oAscEncodingsMap = c_oAscEncodingsMap;
  window["AscCommon"].c_oAscCodePageUtf8 = c_oAscCodePageUtf8;
  window["AscCommon"].c_oAscMaxFormulaLength = c_oAscMaxFormulaLength;

  window["AscCommon"].locktype_None = locktype_None;
  window["AscCommon"].locktype_Mine = locktype_Mine;
  window["AscCommon"].locktype_Other = locktype_Other;
  window["AscCommon"].locktype_Other2 = locktype_Other2;
  window["AscCommon"].locktype_Other3 = locktype_Other3;

  window["AscCommon"].changestype_None = changestype_None;
  window["AscCommon"].changestype_Paragraph_Content = changestype_Paragraph_Content;
  window["AscCommon"].changestype_Paragraph_Properties = changestype_Paragraph_Properties;
  window["AscCommon"].changestype_Document_Content = changestype_Document_Content;
  window["AscCommon"].changestype_Document_Content_Add = changestype_Document_Content_Add;
  window["AscCommon"].changestype_Document_SectPr = changestype_Document_SectPr;
  window["AscCommon"].changestype_Document_Styles = changestype_Document_Styles;
  window["AscCommon"].changestype_Table_Properties = changestype_Table_Properties;
  window["AscCommon"].changestype_Table_RemoveCells = changestype_Table_RemoveCells;
  window["AscCommon"].changestype_Image_Properties = changestype_Image_Properties;
  window["AscCommon"].changestype_HdrFtr = changestype_HdrFtr;
  window["AscCommon"].changestype_Remove = changestype_Remove;
  window["AscCommon"].changestype_Delete = changestype_Delete;
  window["AscCommon"].changestype_Drawing_Props = changestype_Drawing_Props;
  window["AscCommon"].changestype_ColorScheme = changestype_ColorScheme;
  window["AscCommon"].changestype_Text_Props = changestype_Text_Props;
  window["AscCommon"].changestype_RemoveSlide = changestype_RemoveSlide;
  window["AscCommon"].changestype_Theme = changestype_Theme;
  window["AscCommon"].changestype_SlideSize = changestype_SlideSize;
  window["AscCommon"].changestype_SlideBg = changestype_SlideBg;
  window["AscCommon"].changestype_SlideTiming = changestype_SlideTiming;
  window["AscCommon"].changestype_MoveComment = changestype_MoveComment;
  window["AscCommon"].changestype_AddComment = changestype_AddComment;
  window["AscCommon"].changestype_Layout = changestype_Layout;
  window["AscCommon"].changestype_AddShape = changestype_AddShape;
  window["AscCommon"].changestype_AddShapes = changestype_AddShapes;
  window["AscCommon"].changestype_2_InlineObjectMove = changestype_2_InlineObjectMove;
  window["AscCommon"].changestype_2_HdrFtr = changestype_2_HdrFtr;
  window["AscCommon"].changestype_2_Comment = changestype_2_Comment;
  window["AscCommon"].changestype_2_Element_and_Type = changestype_2_Element_and_Type;
  window["AscCommon"].changestype_2_ElementsArray_and_Type = changestype_2_ElementsArray_and_Type;
  window["AscCommon"].changestype_2_AdditionalTypes = changestype_2_AdditionalTypes;
  window["AscCommon"].contentchanges_Add = contentchanges_Add;
  window["AscCommon"].contentchanges_Remove = contentchanges_Remove;

  window["AscCommon"].offlineMode = offlineMode;
})(window);
