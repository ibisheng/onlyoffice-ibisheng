var c_oAscError = {
	Level: {
		Critical:-1,
		NoCritical:0
	},
	ID : {
		ServerSaveComplete: 	3,
		ConvertationProgress: 	2,
		DownloadProgress: 		1,
		No: 					0,
		Unknown: 			 	-1,
		ConvertationTimeout: 	-2,
		ConvertationError: 		-3,
		DownloadError: 			-4,
		UnexpectedGuid: 		-5,
		Database: 				-6,
		FileRequest: 			-7,
		FileVKey: 				-8,
		UplImageSize: 			-9,
		UplImageExt: 			-10,
		UplImageFileCount: 		-11,
		NoSupportClipdoard:		-12,
		PastInMergeAreaError:	-13,
		StockChartError:        -14,
		DataRangeError:         -15,
		CannotMoveRange:        -16,
		UplImageUrl: 			-17,
		CoAuthoringDisconnect:	-18,
		
		
		VKeyEncrypt:			-20,
		KeyExpire:				-21,
		UserCountExceed:		-22,

		/* для формул */
		FrmlWrongCountParentheses:	-30,
		FrmlWrongOperator:			-31,
		FrmlWrongMaxArgument:		-32,
		FrmlWrongCountArgument:		-33,
		FrmlWrongFunctionName:		-34,
		FrmlAnotherParsingError:	-35,
		FrmlWrongArgumentRange:		-36,
		FrmlOperandExpected:		-37,
		
		AutoFilterDataRangeError:   -38
	}
};
var c_oAscConfirm = {
	ConfirmReplaceRange : 0
};
var c_oAscFileType = {
	INNER:		0x0101,
	XLSX:		0x0101,
	XLS:		0x0102,
	ODS:		0x0103,
	CSV:		0x0104,
	HTML:		0x0803,
	PDFPRINT:	0x0802,
	ZIP:		0x0803,
	XLSY:		0x1002
};
var c_oAscZoomType = {
	Current :0,
	FitWidth:1,
	FitPage :2
};

var c_oAscAsyncActionType = {
	Information : 0,
	BlockInteraction : 1
};

var c_oAscAsyncAction = {
	Open				: 0,  // открытие документа
	Save				: 1,
	LoadDocumentFonts	: 2,  // загружаем фонты документа (сразу после открытия)
	LoadDocumentImages	: 3,  // загружаем картинки документа (сразу после загрузки шрифтов)
	LoadFont			: 4,  // подгрузка нужного шрифта
	LoadImage			: 5,  // подгрузка картинки
	DownloadAs			: 6,
	Print				: 7,  //конвертация в PDF и сохранение у пользователя
	UploadImage			: 8,
	Recalc				: 9,
	SlowOperation		: 10,
	PrepareToSave		: 11  // Подготовка к сохранению
};

var c_oAscAlignType = {
	NONE: "none",
	LEFT:"left",
	CENTER:"center",
	RIGHT:"right",
	JUSTIFY:"justify",
	TOP:"top",
	MIDDLE:"center",
	BOTTOM:"bottom"
};

var c_oAscCsvDelimiter = {
	None:0,
	Tab:1,
	Semicolon:2,
	Сolon:3,
	Comma:4,
	Space:5
};

var c_oAscAdvancedOptionsID = {
	CSV:0
};

var c_oAscAdvancedOptionsAction = {
	None: 0,
	Open: 1,
	Save: 2
};

var c_oAscMergeOptions = {
	Unmerge:     0,
	Merge:       1,
	MergeCenter: 2,
	MergeAcross: 3
};

var c_oAscSortOptions = {
	Ascending:  1,
	Descending: 2
};

var c_oAscInsertOptions = {
	InsertCellsAndShiftRight: 1,
	InsertCellsAndShiftDown:  2,
	InsertColumns:            3,
	InsertRows:               4
};

var c_oAscDeleteOptions = {
	DeleteCellsAndShiftLeft: 1,
	DeleteCellsAndShiftTop:  2,
	DeleteColumns:           3,
	DeleteRows:              4
};

var c_oAscFormatOptions = {
	General:    'General',
	Number:     '0.00',
	Currency:   '$#,##0.00',
	Accounting: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
	DateShort:  'm/d/yyyy',
	DateLong:   '[$-F800]dddd, mmmm dd, yyyy',
	Time:       '[$-F400]h:mm:ss AM/PM',
	Percentage: '0%',
	Fraction:   '# ?/?',
	Scientific: '0.00E+00',
	Text:       '@'
};

var c_oAscBorderOptions = {
	Top:    0,
	Right:  1,
	Bottom: 2,
	Left:   3,
	DiagD:  4,
	DiagU:  5,
	InnerV: 6,
	InnerH: 7
};

var c_oAscCleanOptions = {
	All:     0,
	Text:    1,
	Format:  2,
	Formula: 4
};

var c_oAscDrawDepOptions = {
	Master:     0,
	Slave:    1,
	Clear:  2
};

// selection type
var c_oAscSelectionType = {
	RangeCells:	1,
	RangeCol:   2,
	RangeRow:	3,
	RangeMax:	4,
	RangeImage: 5,
	RangeChart: 6,
	RangeShape: 7
};

var c_oAscLegendMarkerType = {
	Line: 0,
	Square: 1
}

var c_oAscHyperlinkType = {
	WebLink: 1,
	RangeLink: 2
};

var c_oAscMouseMoveType = {
	None:			0,
	Hyperlink:		1,
	Comment:		2,
	LockedObject:	3
};

var c_oAscMouseMoveLockedObjectType = {
	None:				-1,
	Range:				0,
	TableProperties:	1,
	Sheet:				2
};

var c_oAscColor = {
    COLOR_TYPE_SRGB   : 1,
    COLOR_TYPE_PRST   : 2,
    COLOR_TYPE_SCHEME : 3
};
 
 // PageOrientation
var c_oAscPageOrientation = {
	PagePortrait: 1,
	PageLandscape: 2
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

/**
 * lock types
 * @const
 */
var c_oAscLockTypes = {
	kLockTypeNone:		1, // никто не залочил данный объект
	kLockTypeMine:		2, // данный объект залочен текущим пользователем
	kLockTypeOther:		3, // данный объект залочен другим(не текущим) пользователем
	kLockTypeOther2:	4, // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
	kLockTypeOther3:	5  // данный объект был залочен (обновления пришли) и снова стал залочен
};

var c_oAscLockTypeElem = {
	Range:	1,
	Object:	2,
	Sheet:	3
};

var c_oAscLockTypeElemSubType = {
	DeleteColumns:		1,
	InsertColumns:		2,
	DeleteRows:			3,
	InsertRows:			4,
	ChangeProperties:	5
};

var c_oAscRecalcIndexTypes = {
	RecalcIndexAdd:		1,
	RecalcIndexRemove:	2
};

// Тип печати
var c_oAscPrintType = {
	ActiveSheets:	0,	// Активные листы
	EntireWorkbook:	1,	// Всю книгу
	Selection:		2	// Выделенный фрагмент
};
// Тип печати
var c_oAscLayoutPageType = {
	FitToWidth:		0,	// На всю ширину
	ActualSize:		1	// По реальным размерам
};

 var c_oAscCustomAutoFilter = {
	equals: 1, 
	doesNotEqual: 6,
	isGreaterThan: 2, 
	isGreaterThanOrEqualTo: 3, 
	isLessThan: 4, 
	isLessThanOrEqualTo: 5,
	beginsWith: 7, 
	doesNotBeginWith: 8, 
	endsWith: 9, 
	doesNotEndWith: 10,
	contains: 11, 
	doesNotContain: 12
 };

// Состояние редактора ячейки
var c_oAscCellEditorState = {
	editEnd:		0,				// Окончание редактирования
	editStart:		1,				// Начало редактирования
	editEmptyCell:	2,				// Редактирование пустой ячейки (доступны функции и свойства текста)
	editText:		3,				// Редактирование текста, числа, даты и др. формата, кроме формулы
	editFormula:	4				// Редактирование формулы
};

// Пересчитывать ли ширину столбца
var c_oAscCanChangeColWidth = {
	none:			0,	// not recalc
	numbers:		1,	// only numbers
	all:			2	// numbers + text
};

// Режимы отрисовки
var c_oAscFontRenderingModeType = {
	noHinting				: 1,
	hinting					: 2,
	hintingAndSubpixeling	: 3
};

var c_oAscStyleImage = {
	Default		: 0,
	Document	: 1
};

var c_oAscFill = {
    FILL_TYPE_BLIP   : 1,
    FILL_TYPE_NOFILL : 2,
    FILL_TYPE_SOLID	 : 3
};

var c_oAscFillBlipType = {
    STRETCH : 1,
    TILE    : 2
};

var c_oAscStrokeType = {
    STROKE_NONE: 0,
    STROKE_COLOR: 1
};

var c_oAscLineJoinType = {
    Round : 1,
    Bevel : 2,
    Miter : 3
};

var c_oAscLineCapType = {
    Flat : 0,
    Round : 1,
    Square : 2
};

var c_oAscLineBeginType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};

var c_oAscLineBeginSize = {
    small_small : 0,
    small_mid : 1,
    small_large : 2,
    mid_small : 3,
    mid_mid : 4,
    mid_large : 5,
    large_small : 6,
    large_mid : 7,
    large_large : 8
};

var c_oAscTypeSelectElement = {
	Paragraph  : 0,
	Table      : 1,
	Image      : 2,
	Header     : 3,
    Hyperlink  : 4,
    SpellCheck : 5
}
 
var c_oAscCoAuthoringMeBorderColor					= "rgba(22,156,0,1)";
var c_oAscCoAuthoringOtherBorderColor				= "rgba(238,53,37,1)";
var c_oAscCoAuthoringLockTablePropertiesBorderColor	= "rgba(255,144,0,1)";
var c_oAscCoAuthoringDottedWidth					= 2;
var c_oAscCoAuthoringDottedDistance					= 1;

var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96.0 / 25.4);
