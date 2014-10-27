"use strict";

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
	Open				: 0, // открытие документа
	Save				: 1,
	LoadDocumentFonts	: 2, // загружаем фонты документа (сразу после открытия)
    LoadDocumentImages	: 3, // загружаем картинки документа (сразу после загрузки шрифтов)
    LoadFont			: 4, // подгрузка нужного шрифта
    LoadImage			: 5, // подгрузка картинки
	DownloadAs			: 6,
	Print				: 7, // конвертация в PDF и сохранение у пользователя
	UploadImage			: 8,
	ApplyChanges		: 9  // применение изменений от другого пользователя.
};
//files type for Saving & DownloadAs
var c_oAscFileType = {
	INNER: 		0x0041,
	DOCX: 		0x0041,
	DOC: 		0x0042,
	ODT: 		0x0043,
	RTF: 		0x0044,
	TXT: 		0x0045,
	HTML_ZIP: 	0x0803,
	MHT: 		0x0047,
	PDF: 		0x0201,
	EPUB: 		0x0048,
	FB2: 		0x0049,
	MOBI: 		0x004a,
	DOCY: 		0x1001
};

// Right = 0; Left = 1; Center = 2; Justify = 3;
var c_oAscAlignType = {
	LEFT:0,
	CENTER:1,
	RIGHT:2,
	JUSTIFY:3,
	TOP:4,
	MIDDLE:5,
	BOTTOM:6
};

var c_oAscWrapStyle2 = {
    Inline       : 0,
    Square       : 1,
    Tight        : 2,
    Through      : 3,
    TopAndBottom : 4,
    Behind       : 5,
    InFront      : 6
};
	
/*Error level & ID*/
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
        SplitCellMaxRows:       -13,
        SplitCellMaxCols:       -14,
        SplitCellRowsDivider:   -15,
        StockChartError:        -16,

		CoAuthoringDisconnect:	-18,
		ConvertationPassword:	-19,

		VKeyEncrypt:			-20,
		KeyExpire:				-21,
		UserCountExceed:		-22,
		MobileUnexpectedCharCount: -23
	}
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

var c_oAscTableBordersType = {
	LEFT:0,
	TOP:1,
	RIGHT:2,
	BOTTOM:3,
	VERTLINE:4,
	HORIZONTLINE:5,
	INSIDE:6,
	OUTSIDE:7,
	ALL:8
};
var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96.0 / 25.4);

var c_oAscStyleImage = {
    Default :0,
    Document:1
};

var c_oAscLineDrawingRule = {
    Left   : 0,
    Center : 1,
    Right  : 2,
    Top    : 0,
    Bottom : 2
};

// Chart defines
var c_oAscChartType = {
    line: "Line",
    bar: "Bar",
    hbar: "HBar",
    area: "Area",
    pie: "Pie",
    scatter: "Scatter",
    stock: "Stock",
    doughnut: "Doughnut"
};

var c_oAscChartSubType = {
    normal: "normal",
    stacked: "stacked",
    stackedPer: "stackedPer"
};

var align_Right   = 0;
var align_Left    = 1;
var align_Center  = 2;
var align_Justify = 3;

var vertalign_Baseline    = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript   = 2;
var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;

var hdrftr_Default = 0x01;
var hdrftr_Even    = 0x02;
var hdrftr_First   = 0x03;

var c_oAscTableSelectionType = {
    Cell   : 0,
    Row    : 1,
    Column : 2,
    Table  : 3
};

var linerule_AtLeast = 0;
var linerule_Auto    = 1;
var linerule_Exact   = 2;

var shd_Clear = 0;
var shd_Nil   = 1;

var c_oAscContextMenuTypes = {
    Common       : 0, // Обычное контекстное меню
    ChangeHdrFtr : 1  // Специальное контестное меню для попадания в колонтитул
};

var c_oAscMouseMoveDataTypes = {
    Common       : 0,
    Hyperlink    : 1,
    LockedObject : 2
};

var c_oAscMouseMoveLockedObjectType = {
    Common : 0,
    Header : 1,
    Footer : 2
};

var c_oAscCollaborativeMarksShowType = {
    None        : -1,
    All         :  0,
    LastChanges :  1
};

var c_oAscAlignH = {
    Center  : 0x00,
    Inside  : 0x01,
    Left    : 0x02,
    Outside : 0x03,
    Right   : 0x04
};

var c_oAscChangeLevel = {
    BringToFront : 0x00,
    BringForward : 0x01,
    SendToBack   : 0x02,
    BringBackward: 0x03
};

var c_oAscAlignV = {
    Bottom  : 0x00,
    Center  : 0x01,
    Inside  : 0x02,
    Outside : 0x03,
    Top     : 0x04
};

var c_oAscVertAlignJc = {
    Top    : 0x00, // var vertalignjc_Top    = 0x00;
    Center : 0x01, // var vertalignjc_Center = 0x01;
    Bottom : 0x02  // var vertalignjc_Bottom = 0x02
};

var c_oAscTableLayout = {
    AutoFit : 0x00,
    Fixed   : 0x01
};

var c_oAscColor = {
    COLOR_TYPE_SRGB   : 1,
    COLOR_TYPE_PRST   : 2,
    COLOR_TYPE_SCHEME : 3
};

var c_oAscFill = {
    FILL_TYPE_BLIP   : 1,
    FILL_TYPE_NOFILL : 2,
    FILL_TYPE_SOLID	 : 3,
    FILL_TYPE_PATT   : 4,
    FILL_TYPE_GRAD   : 5
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
    STROKE_NONE: 0,
    STROKE_COLOR: 1
};

var c_oAscAlignShapeType = {
    ALIGN_LEFT: 0,
    ALIGN_RIGHT: 1,
    ALIGN_TOP : 2,
    ALIGN_BOTTOM : 3,
    ALIGN_CENTER : 4,
    ALIGN_MIDDLE: 5
};


var c_oAscVerticalTextAlign = {
    TEXT_ALIGN_BOTTOM : 0,// (Text Anchor Enum ( Bottom ))
    TEXT_ALIGN_CTR : 1,// (Text Anchor Enum ( Center ))
    TEXT_ALIGN_DIST : 2,// (Text Anchor Enum ( Distributed ))
    TEXT_ALIGN_JUST : 3,// (Text Anchor Enum ( Justified ))
    TEXT_ALIGN_TOP : 4// Top
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

var TABLE_STYLE_WIDTH_PIX   = 70;
var TABLE_STYLE_HEIGHT_PIX  = 50;

var c_oAscDropCap =
{
    None   : 0,
    Drop   : 1,
    Margin : 2
};

var c_oAscSectionBreakType = 
{
    NextPage   : 0x00,
    OddPage    : 0x01,
    EvenPage   : 0x02,
    Continuous : 0x03,
    Column     : 0x04
};

var c_oAscMathTypeBits =
{
    Fraction      : 0x00010000,
    Script        : 0x00020000,
    Radical       : 0x00040000,
    Integral      : 0x00080000,
    LargeOperator : 0x00100000,
    Bracket       : 0x00200000,
    Function      : 0x00400000,
    Accent        : 0x00800000,
    LimitLog      : 0x01000000,
    Operator      : 0x02000000,
    Matrix        : 0x04000000

};

var c_oAscMathType =
{
    FractionVertical       : 0x00010001,
    FractionDiagonal       : 0x00010002,
    FractionHorizontal     : 0x00010003,
    FractionSmall          : 0x00010004,
    FractionDifferential_1 : 0x00010005,
    FractionDifferential_2 : 0x00010006,
    FractionDifferential_3 : 0x00010007,
    FractionDifferential_4 : 0x00010008,
    FractionPi_2           : 0x00010009,
//----------------------------------------------------------------------------------------------------------------------
    ScriptSup              : 0x00020001,
    ScriptSub              : 0x00020002,
    ScriptSubSup           : 0x00020003,
    ScriptSubSupLeft       : 0x00020004,
    ScriptCustom_1         : 0x00020005,
    ScriptCustom_2         : 0x00020006,
    ScriptCustom_3         : 0x00020007,
    ScriptCustom_4         : 0x00020008,
//----------------------------------------------------------------------------------------------------------------------
    RadicalSqrt            : 0x00040001,
    RadicalRoot_n          : 0x00040002,
    RadicalRoot_2          : 0x00040003,
    RadicalRoot_3          : 0x00040004,
    RadicalCustom_1        : 0x00040005,
    RadicalCustom_2        : 0x00040006,
//----------------------------------------------------------------------------------------------------------------------
    Integral                           : 0x00080001,
    IntegralSubSup                     : 0x00080002,
    IntegralCenterSubSup               : 0x00080003,
    IntegralDouble                     : 0x00080004,
    IntegralDoubleSubSup               : 0x00080005,
    IntegralDoubleCenterSubSup         : 0x00080006,
    IntegralTriple                     : 0x00080007,
    IntegralTripleSubSup               : 0x00080008,
    IntegralTripleCenterSubSup         : 0x00080009,
    IntegralOriented                   : 0x0008000A,
    IntegralOrientedSubSup             : 0x0008000B,
    IntegralOrientedCenterSubSup       : 0x0008000C,
    IntegralOrientedDouble             : 0x0008000D,
    IntegralOrientedDoubleSubSup       : 0x0008000E,
    IntegralOrientedDoubleCenterSubSup : 0x0008000F,
    IntegralOrientedTriple             : 0x00080010,
    IntegralOrientedTripleSubSup       : 0x00080011,
    IntegralOrientedTripleCenterSubSup : 0x00080012,
    Integral_dx                        : 0x00080013,
    Integral_dy                        : 0x00080014,
    Integral_dtheta                    : 0x00080015,
//----------------------------------------------------------------------------------------------------------------------
    LargeOperator_Sum                       : 0x00100001,
    LargeOperator_Sum_CenterSubSup          : 0x00100002,
    LargeOperator_Sum_SubSup                : 0x00100003,
    LargeOperator_Sum_CenterSub             : 0x00100004,
    LargeOperator_Sum_Sub                   : 0x00100005,
    LargeOperator_Prod                      : 0x00100101,
    LargeOperator_Prod_CenterSubSup         : 0x00100102,
    LargeOperator_Prod_SubSup               : 0x00100103,
    LargeOperator_Prod_CenterSub            : 0x00100104,
    LargeOperator_Prod_Sub                  : 0x00100105,
    LargeOperator_CoProd                    : 0x00100201,
    LargeOperator_CoProd_CenterSubSup       : 0x00100202,
    LargeOperator_CoProd_SubSup             : 0x00100203,
    LargeOperator_CoProd_CenterSub          : 0x00100204,
    LargeOperator_CoProd_Sub                : 0x00100205,
    LargeOperator_Union                     : 0x00100301,
    LargeOperator_Union_CenterSubSup        : 0x00100302,
    LargeOperator_Union_SubSup              : 0x00100303,
    LargeOperator_Union_CenterSub           : 0x00100304,
    LargeOperator_Union_Sub                 : 0x00100305,
    LargeOperator_Intersection              : 0x00100401,
    LargeOperator_Intersection_CenterSubSup : 0x00100402,
    LargeOperator_Intersection_SubSup       : 0x00100403,
    LargeOperator_Intersection_CenterSub    : 0x00100404,
    LargeOperator_Intersection_Sub          : 0x00100405,
    LargeOperator_Disjunction               : 0x00100501,
    LargeOperator_Disjunction_CenterSubSup  : 0x00100502,
    LargeOperator_Disjunction_SubSup        : 0x00100503,
    LargeOperator_Disjunction_CenterSub     : 0x00100504,
    LargeOperator_Disjunction_Sub           : 0x00100505,
    LargeOperator_Conjunction               : 0x00100601,
    LargeOperator_Conjunction_CenterSubSup  : 0x00100602,
    LargeOperator_Conjunction_SubSup        : 0x00100603,
    LargeOperator_Conjunction_CenterSub     : 0x00100604,
    LargeOperator_Conjunction_Sub           : 0x00100605,
    LargeOperator_Custom_1                  : 0x00100701,
    LargeOperator_Custom_2                  : 0x00100702,
    LargeOperator_Custom_3                  : 0x00100703,
    LargeOperator_Custom_4                  : 0x00100704,
    LargeOperator_Custom_5                  : 0x00100705,
//----------------------------------------------------------------------------------------------------------------------
    Bracket_Round                 : 0x00200001,
    Bracket_Square                : 0x00200002,
    Bracket_Curve                 : 0x00200003,
    Bracket_Angle                 : 0x00200004,
    Bracket_LowLim                : 0x00200005,
    Bracket_UppLim                : 0x00200006,
    Bracket_Line                  : 0x00200007,
    Bracket_LineDouble            : 0x00200008,
    Bracket_Square_OpenOpen       : 0x00200009,
    Bracket_Square_CloseClose     : 0x0020000A,
    Bracket_Square_CloseOpen      : 0x0020000B,
    Bracket_SquareDouble          : 0x0020000C,
    Bracket_Round_Delimiter_2     : 0x0020000D,
    Bracket_Curve_Delimiter_2     : 0x0020000E,
    Bracket_Angle_Delimiter_2     : 0x0020000F,
    Bracket_Angle_Delimiter_3     : 0x00200010,
    Bracket_Round_OpenNone        : 0x00200011,
    Bracket_Round_NoneOpen        : 0x00200012,
    Bracket_Square_OpenNone       : 0x00200013,
    Bracket_Square_NoneOpen       : 0x00200014,
    Bracket_Curve_OpenNone        : 0x00200015,
    Bracket_Curve_NoneOpen        : 0x00200016,
    Bracket_Angle_OpenNone        : 0x00200017,
    Bracket_Angle_NoneOpen        : 0x00200018,
    Bracket_LowLim_OpenNone       : 0x00200019,
    Bracket_LowLim_NoneNone       : 0x0020001A,
    Bracket_UppLim_OpenNone       : 0x0020001B,
    Bracket_UppLim_NoneOpen       : 0x0020001C,
    Bracket_Line_OpenNone         : 0x0020001D,
    Bracket_Line_NoneOpen         : 0x0020001E,
    Bracket_LineDouble_OpenNone   : 0x0020001F,
    Bracket_LineDouble_NoneOpen   : 0x00200020,
    Bracket_SquareDouble_OpenNone : 0x00200021,
    Bracket_SquareDouble_NoneOpen : 0x00200022,

    Bracket_Custom_1              : 0x00200023,
    Bracket_Custom_2              : 0x00200024,
    Bracket_Custom_3              : 0x00200025,
    Bracket_Custom_4              : 0x00200026,
    Bracket_Custom_5              : 0x00200027,
    Bracket_Custom_6              : 0x00200028,
    Bracket_Custom_7              : 0x00200029,
//----------------------------------------------------------------------------------------------------------------------
    Function_Sin      : 0x00400001,
    Function_Cos      : 0x00400002,
    Function_Tan      : 0x00400003,
    Function_Csc      : 0x00400004,
    Function_Sec      : 0x00400005,
    Function_Cot      : 0x00400006,
    Function_1_Sin    : 0x00400007,
    Function_1_Cos    : 0x00400008,
    Function_1_Tan    : 0x00400009,
    Function_1_Csc    : 0x0040000a,
    Function_1_Sec    : 0x0040000b,
    Function_1_Cot    : 0x0040000c,
    Function_Sinh     : 0x0040000d,
    Function_Cosh     : 0x0040000e,
    Function_Tanh     : 0x0040000f,
    Function_Csch     : 0x00400010,
    Function_Sech     : 0x00400011,
    Function_Coth     : 0x00400012,
    Function_1_Sinh   : 0x00400013,
    Function_1_Cosh   : 0x00400014,
    Function_1_Tanh   : 0x00400015,
    Function_1_Csch   : 0x00400016,
    Function_1_Sech   : 0x00400017,
    Function_1_Coth   : 0x00400018,
    Function_Custom_1 : 0x00400019,
    Function_Custom_2 : 0x0040001a,
    Function_Custom_3 : 0x0040001b,
//----------------------------------------------------------------------------------------------------------------------
    Accent_Dot             : 0x00800001,
    Accent_DDot            : 0x00800002,
    Accent_DDDot           : 0x00800003,
    Accent_Hat             : 0x00800004,
    Accent_Check           : 0x00800005,
    Accent_Accent          : 0x00800006,
    Accent_Grave           : 0x00800007,
    Accent_Smile           : 0x00800008,
    Accent_Tilde           : 0x00800009,
    Accent_Bar             : 0x0080000a,
    Accent_DoubleBar       : 0x0080000b,
    Accent_CurveBracketTop : 0x0080000c,
    Accent_CurveBracketBot : 0x0080000d,
    Accent_GroupTop        : 0x0080000e,
    Accent_GroupBot        : 0x0080000f,
    Accent_ArrowL          : 0x00800010,
    Accent_ArrowR          : 0x00800011,
    Accent_ArrowD          : 0x00800012,
    Accent_HarpoonL        : 0x00800013,
    Accent_HarpoonR        : 0x00800014,

    Accent_BorderBox       : 0x00800101,
    Accent_BorderBoxCustom : 0x00800102,
    Accent_BarTop          : 0x00800103,
    Accent_BarBot          : 0x00800104,

    Accent_Custom_1        : 0x00800201,
    Accent_Custom_2        : 0x00800202,
    Accent_Custom_3        : 0x00800203,
//----------------------------------------------------------------------------------------------------------------------
    LimitLog_LogBase       : 0x01000001,
    LimitLog_Log           : 0x01000002,
    LimitLog_Lim           : 0x01000003,
    LimitLog_Min           : 0x01000004,
    LimitLog_Max           : 0x01000005,
    LimitLog_Ln            : 0x01000006,
    LimitLog_Custom_1      : 0x01000101,
    LimitLog_Custom_2      : 0x01000102,
//----------------------------------------------------------------------------------------------------------------------
    Operator_ColonEquals      : 0x02000001,
    Operator_EqualsEquals     : 0x02000002,
    Operator_PlusEquals       : 0x02000003,
    Operator_MinusEquals      : 0x02000004,
    Operator_Definition       : 0x02000005,
    Operator_UnitOfMeasure    : 0x02000006,
    Operator_DeltaEquals      : 0x02000007,
    Operator_ArrowL_Top       : 0x02000008,
    Operator_ArrowR_Top       : 0x02000009,
    Operator_ArrowL_Bot       : 0x0200000a,
    Operator_ArrowR_Bot       : 0x0200000b,
    Operator_DoubleArrowL_Top : 0x0200000c,
    Operator_DoubleArrowR_Top : 0x0200000d,
    Operator_DoubleArrowL_Bot : 0x0200000e,
    Operator_DoubleArrowR_Bot : 0x0200000f,
    Operator_ArrowD_Top       : 0x02000010,
    Operator_ArrowD_Bot       : 0x02000011,
    Operator_DoubleArrowD_Top : 0x02000012,
    Operator_DoubleArrowD_Bot : 0x02000013,

    Operator_Custom_1         : 0x02000101,
    Operator_Custom_2         : 0x02000102,
//----------------------------------------------------------------------------------------------------------------------
    Matrix_1_2                : 0x04000001,
    Matrix_2_1                : 0x04000002,
    Matrix_1_3                : 0x04000003,
    Matrix_3_1                : 0x04000004,
    Matrix_2_2                : 0x04000005,
    Matrix_2_3                : 0x04000006,
    Matrix_3_2                : 0x04000007,
    Matrix_3_3                : 0x04000008,

    Matrix_Dots_Center        : 0x04000101,
    Matrix_Dots_Baseline      : 0x04000102,
    Matrix_Dots_Vertical      : 0x04000103,
    Matrix_Dots_Diagonal      : 0x04000104,

    Matrix_Identity_2         : 0x04000201,
    Matrix_Identity_2_NoZeros : 0x04000202,
    Matrix_Identity_3         : 0x04000203,
    Matrix_Identity_3_NoZeros : 0x04000204,

    Matrix_2_2_RoundBracket   : 0x04000301,
    Matrix_2_2_SquareBracket  : 0x04000302,
    Matrix_2_2_LineBracket    : 0x04000303,
    Matrix_2_2_DLineBracket   : 0x04000304,

    Matrix_Flat_Round         : 0x04000401,
    Matrix_Flat_Square        : 0x04000402

};

window["flat_desine"] = false;