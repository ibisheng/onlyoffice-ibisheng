"use strict";

var c_oAscZoomType = {
  Current: 0,
  FitWidth: 1,
  FitPage: 2
};

// Right = 0; Left = 1; Center = 2; Justify = 3;
var c_oAscAlignType = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
  JUSTIFY: 3,
  TOP: 4,
  MIDDLE: 5,
  BOTTOM: 6
};

var c_oAscWrapStyle2 = {
  Inline: 0,
  Square: 1,
  Tight: 2,
  Through: 3,
  TopAndBottom: 4,
  Behind: 5,
  InFront: 6
};

/*Error level & ID*/
var c_oAscError = {
  Level: {
    Critical: -1,
    NoCritical: 0
  },
  ID: {
    ServerSaveComplete: 3,
    ConvertationProgress: 2,
    DownloadProgress: 1,
    No: 0,
    Unknown: -1,
    ConvertationTimeout: -2,
    ConvertationError: -3,
    DownloadError: -4,
    UnexpectedGuid: -5,
    Database: -6,
    FileRequest: -7,
    FileVKey: -8,
    UplImageSize: -9,
    UplImageExt: -10,
    UplImageFileCount: -11,
    NoSupportClipdoard: -12,
    SplitCellMaxRows: -13,
    SplitCellMaxCols: -14,
    SplitCellRowsDivider: -15,
    StockChartError: -16,

    CoAuthoringDisconnect: -18,
    ConvertationPassword: -19,

    VKeyEncrypt: -20,
    KeyExpire: -21,
    UserCountExceed: -22,
    MobileUnexpectedCharCount: -23,

    MailMergeLoadFile: -24,
    MailMergeSaveFile: -25,

    UserDrop: -100,
    Warning: -101
  }
};


var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;

var c_oAscTableSelectionType = {
  Cell: 0,
  Row: 1,
  Column: 2,
  Table: 3
};


var c_oAscContextMenuTypes = {
  Common: 0, // Обычное контекстное меню
  ChangeHdrFtr: 1  // Специальное контестное меню для попадания в колонтитул
};

var c_oAscMouseMoveDataTypes = {
  Common: 0,
  Hyperlink: 1,
  LockedObject: 2
};

var c_oAscMouseMoveLockedObjectType = {
  Common: 0,
  Header: 1,
  Footer: 2
};

var c_oAscCollaborativeMarksShowType = {
  None: -1,
  All: 0,
  LastChanges: 1
};

var c_oAscAlignH = {
  Center: 0x00,
  Inside: 0x01,
  Left: 0x02,
  Outside: 0x03,
  Right: 0x04
};

var c_oAscChangeLevel = {
  BringToFront: 0x00,
  BringForward: 0x01,
  SendToBack: 0x02,
  BringBackward: 0x03
};

var c_oAscAlignV = {
  Bottom: 0x00,
  Center: 0x01,
  Inside: 0x02,
  Outside: 0x03,
  Top: 0x04
};

var c_oAscVertAlignJc = {
  Top: 0x00, // var vertalignjc_Top    = 0x00;
  Center: 0x01, // var vertalignjc_Center = 0x01;
  Bottom: 0x02  // var vertalignjc_Bottom = 0x02
};

var c_oAscTableLayout = {
  AutoFit: 0x00,
  Fixed: 0x01
};

var c_oAscAlignShapeType = {
  ALIGN_LEFT: 0,
  ALIGN_RIGHT: 1,
  ALIGN_TOP: 2,
  ALIGN_BOTTOM: 3,
  ALIGN_CENTER: 4,
  ALIGN_MIDDLE: 5
};

var TABLE_STYLE_WIDTH_PIX = 70;
var TABLE_STYLE_HEIGHT_PIX = 50;

var c_oAscDropCap = {
  None: 0,
  Drop: 1,
  Margin: 2
};

var c_oAscSectionBreakType = {
  NextPage: 0x00,
  OddPage: 0x01,
  EvenPage: 0x02,
  Continuous: 0x03,
  Column: 0x04
};

var c_oAscMathMainType = {
  Symbol: 0x00,
  Fraction: 0x01,
  Script: 0x02,
  Radical: 0x03,
  Integral: 0x04,
  LargeOperator: 0x05,
  Bracket: 0x06,
  Function: 0x07,
  Accent: 0x08,
  LimitLog: 0x09,
  Operator: 0x0a,
  Matrix: 0x0b,
  Empty_Content: 0x0c
};

var c_oAscMathMainTypeStrings = {};
c_oAscMathMainTypeStrings[c_oAscMathMainType.Symbol       ] = "Symbols";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Fraction     ] = "Fraction";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Script       ] = "Script";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Radical      ] = "Radical";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Integral     ] = "Integral";
c_oAscMathMainTypeStrings[c_oAscMathMainType.LargeOperator] = "LargeOperator";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Bracket      ] = "Bracket";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Function     ] = "Function";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Accent       ] = "Accent";
c_oAscMathMainTypeStrings[c_oAscMathMainType.LimitLog     ] = "LimitLog";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Operator     ] = "Operator";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Matrix       ] = "Matrix";
c_oAscMathMainTypeStrings[c_oAscMathMainType.Empty_Content] = "Empty_Content";

var c_oAscMathType = {
//----------------------------------------------------------------------------------------------------------------------
  Symbol_pm: 0x00000000,
  Symbol_infinity: 0x00000001,
  Symbol_equals: 0x00000002,
  Symbol_neq: 0x00000003,
  Symbol_about: 0x00000004,
  Symbol_times: 0x00000005,
  Symbol_div: 0x00000006,
  Symbol_factorial: 0x00000007,
  Symbol_propto: 0x00000008,
  Symbol_less: 0x00000009,
  Symbol_ll: 0x0000000a,
  Symbol_greater: 0x0000000b,
  Symbol_gg: 0x0000000c,
  Symbol_leq: 0x0000000d,
  Symbol_geq: 0x0000000e,
  Symbol_mp: 0x0000000f,
  Symbol_cong: 0x00000010,
  Symbol_approx: 0x00000011,
  Symbol_equiv: 0x00000012,
  Symbol_forall: 0x00000013,
  Symbol_additional: 0x00000014,
  Symbol_partial: 0x00000015,
  Symbol_sqrt: 0x00000016,
  Symbol_cbrt: 0x00000017,
  Symbol_qdrt: 0x00000018,
  Symbol_cup: 0x00000019,
  Symbol_cap: 0x0000001a,
  Symbol_emptyset: 0x0000001b,
  Symbol_percent: 0x0000001c,
  Symbol_degree: 0x0000001d,
  Symbol_fahrenheit: 0x0000001e,
  Symbol_celsius: 0x0000001f,
  Symbol_inc: 0x00000020,
  Symbol_nabla: 0x00000021,
  Symbol_exists: 0x00000022,
  Symbol_notexists: 0x00000023,
  Symbol_in: 0x00000024,
  Symbol_ni: 0x00000025,
  Symbol_leftarrow: 0x00000026,
  Symbol_uparrow: 0x00000027,
  Symbol_rightarrow: 0x00000028,
  Symbol_downarrow: 0x00000029,
  Symbol_leftrightarrow: 0x0000002a,
  Symbol_therefore: 0x0000002b,
  Symbol_plus: 0x0000002c,
  Symbol_minus: 0x0000002d,
  Symbol_not: 0x0000002e,
  Symbol_ast: 0x0000002f,
  Symbol_bullet: 0x00000030,
  Symbol_vdots: 0x00000031,
  Symbol_cdots: 0x00000032,
  Symbol_rddots: 0x00000033,
  Symbol_ddots: 0x00000034,
  Symbol_aleph: 0x00000035,
  Symbol_beth: 0x00000036,
  Symbol_QED: 0x00000037,
  Symbol_alpha: 0x00010000,
  Symbol_beta: 0x00010001,
  Symbol_gamma: 0x00010002,
  Symbol_delta: 0x00010003,
  Symbol_varepsilon: 0x00010004,
  Symbol_epsilon: 0x00010005,
  Symbol_zeta: 0x00010006,
  Symbol_eta: 0x00010007,
  Symbol_theta: 0x00010008,
  Symbol_vartheta: 0x00010009,
  Symbol_iota: 0x0001000a,
  Symbol_kappa: 0x0001000b,
  Symbol_lambda: 0x0001000c,
  Symbol_mu: 0x0001000d,
  Symbol_nu: 0x0001000e,
  Symbol_xsi: 0x0001000f,
  Symbol_o: 0x00010010,
  Symbol_pi: 0x00010011,
  Symbol_varpi: 0x00010012,
  Symbol_rho: 0x00010013,
  Symbol_varrho: 0x00010014,
  Symbol_sigma: 0x00010015,
  Symbol_varsigma: 0x00010016,
  Symbol_tau: 0x00010017,
  Symbol_upsilon: 0x00010018,
  Symbol_varphi: 0x00010019,
  Symbol_phi: 0x0001001a,
  Symbol_chi: 0x0001001b,
  Symbol_psi: 0x0001001c,
  Symbol_omega: 0x0001001d,
  Symbol_Alpha: 0x00020000,
  Symbol_Beta: 0x00020001,
  Symbol_Gamma: 0x00020002,
  Symbol_Delta: 0x00020003,
  Symbol_Epsilon: 0x00020004,
  Symbol_Zeta: 0x00020005,
  Symbol_Eta: 0x00020006,
  Symbol_Theta: 0x00020007,
  Symbol_Iota: 0x00020008,
  Symbol_Kappa: 0x00020009,
  Symbol_Lambda: 0x0002000a,
  Symbol_Mu: 0x0002000b,
  Symbol_Nu: 0x0002000c,
  Symbol_Xsi: 0x0002000d,
  Symbol_O: 0x0002000e,
  Symbol_Pi: 0x0002000f,
  Symbol_Rho: 0x00020010,
  Symbol_Sigma: 0x00020011,
  Symbol_Tau: 0x00020012,
  Symbol_Upsilon: 0x00020013,
  Symbol_Phi: 0x00020014,
  Symbol_Chi: 0x00020015,
  Symbol_Psi: 0x00020016,
  Symbol_Omega: 0x00020017,
//----------------------------------------------------------------------------------------------------------------------
  FractionVertical: 0x01000000,
  FractionDiagonal: 0x01000001,
  FractionHorizontal: 0x01000002,
  FractionSmall: 0x01000003,
  FractionDifferential_1: 0x01010000,
  FractionDifferential_2: 0x01010001,
  FractionDifferential_3: 0x01010002,
  FractionDifferential_4: 0x01010003,
  FractionPi_2: 0x01010004,
//----------------------------------------------------------------------------------------------------------------------
  ScriptSup: 0x02000000,
  ScriptSub: 0x02000001,
  ScriptSubSup: 0x02000002,
  ScriptSubSupLeft: 0x02000003,
  ScriptCustom_1: 0x02010000,
  ScriptCustom_2: 0x02010001,
  ScriptCustom_3: 0x02010002,
  ScriptCustom_4: 0x02010003,
//----------------------------------------------------------------------------------------------------------------------
  RadicalSqrt: 0x03000000,
  RadicalRoot_n: 0x03000001,
  RadicalRoot_2: 0x03000002,
  RadicalRoot_3: 0x03000003,
  RadicalCustom_1: 0x03010000,
  RadicalCustom_2: 0x03010001,
//----------------------------------------------------------------------------------------------------------------------
  Integral: 0x04000000,
  IntegralSubSup: 0x04000001,
  IntegralCenterSubSup: 0x04000002,
  IntegralDouble: 0x04000003,
  IntegralDoubleSubSup: 0x04000004,
  IntegralDoubleCenterSubSup: 0x04000005,
  IntegralTriple: 0x04000006,
  IntegralTripleSubSup: 0x04000007,
  IntegralTripleCenterSubSup: 0x04000008,
  IntegralOriented: 0x04010000,
  IntegralOrientedSubSup: 0x04010001,
  IntegralOrientedCenterSubSup: 0x04010002,
  IntegralOrientedDouble: 0x04010003,
  IntegralOrientedDoubleSubSup: 0x04010004,
  IntegralOrientedDoubleCenterSubSup: 0x04010005,
  IntegralOrientedTriple: 0x04010006,
  IntegralOrientedTripleSubSup: 0x04010007,
  IntegralOrientedTripleCenterSubSup: 0x04010008,
  Integral_dx: 0x04020000,
  Integral_dy: 0x04020001,
  Integral_dtheta: 0x04020002,
//----------------------------------------------------------------------------------------------------------------------
  LargeOperator_Sum: 0x05000000,
  LargeOperator_Sum_CenterSubSup: 0x05000001,
  LargeOperator_Sum_SubSup: 0x05000002,
  LargeOperator_Sum_CenterSub: 0x05000003,
  LargeOperator_Sum_Sub: 0x05000004,
  LargeOperator_Prod: 0x05010000,
  LargeOperator_Prod_CenterSubSup: 0x05010001,
  LargeOperator_Prod_SubSup: 0x05010002,
  LargeOperator_Prod_CenterSub: 0x05010003,
  LargeOperator_Prod_Sub: 0x05010004,
  LargeOperator_CoProd: 0x05010005,
  LargeOperator_CoProd_CenterSubSup: 0x05010006,
  LargeOperator_CoProd_SubSup: 0x05010007,
  LargeOperator_CoProd_CenterSub: 0x05010008,
  LargeOperator_CoProd_Sub: 0x05010009,
  LargeOperator_Union: 0x05020000,
  LargeOperator_Union_CenterSubSup: 0x05020001,
  LargeOperator_Union_SubSup: 0x05020002,
  LargeOperator_Union_CenterSub: 0x05020003,
  LargeOperator_Union_Sub: 0x05020004,
  LargeOperator_Intersection: 0x05020005,
  LargeOperator_Intersection_CenterSubSup: 0x05020006,
  LargeOperator_Intersection_SubSup: 0x05020007,
  LargeOperator_Intersection_CenterSub: 0x05020008,
  LargeOperator_Intersection_Sub: 0x05020009,
  LargeOperator_Disjunction: 0x05030000,
  LargeOperator_Disjunction_CenterSubSup: 0x05030001,
  LargeOperator_Disjunction_SubSup: 0x05030002,
  LargeOperator_Disjunction_CenterSub: 0x05030003,
  LargeOperator_Disjunction_Sub: 0x05030004,
  LargeOperator_Conjunction: 0x05030005,
  LargeOperator_Conjunction_CenterSubSup: 0x05030006,
  LargeOperator_Conjunction_SubSup: 0x05030007,
  LargeOperator_Conjunction_CenterSub: 0x05030008,
  LargeOperator_Conjunction_Sub: 0x05030009,
  LargeOperator_Custom_1: 0x05040000,
  LargeOperator_Custom_2: 0x05040001,
  LargeOperator_Custom_3: 0x05040002,
  LargeOperator_Custom_4: 0x05040003,
  LargeOperator_Custom_5: 0x05040004,
//----------------------------------------------------------------------------------------------------------------------
  Bracket_Round: 0x06000000,
  Bracket_Square: 0x06000001,
  Bracket_Curve: 0x06000002,
  Bracket_Angle: 0x06000003,
  Bracket_LowLim: 0x06000004,
  Bracket_UppLim: 0x06000005,
  Bracket_Line: 0x06000006,
  Bracket_LineDouble: 0x06000007,
  Bracket_Square_OpenOpen: 0x06000008,
  Bracket_Square_CloseClose: 0x06000009,
  Bracket_Square_CloseOpen: 0x0600000a,
  Bracket_SquareDouble: 0x0600000b,
  Bracket_Round_Delimiter_2: 0x06010000,
  Bracket_Curve_Delimiter_2: 0x06010001,
  Bracket_Angle_Delimiter_2: 0x06010002,
  Bracket_Angle_Delimiter_3: 0x06010003,
  Bracket_Round_OpenNone: 0x06020000,
  Bracket_Round_NoneOpen: 0x06020001,
  Bracket_Square_OpenNone: 0x06020002,
  Bracket_Square_NoneOpen: 0x06020003,
  Bracket_Curve_OpenNone: 0x06020004,
  Bracket_Curve_NoneOpen: 0x06020005,
  Bracket_Angle_OpenNone: 0x06020006,
  Bracket_Angle_NoneOpen: 0x06020007,
  Bracket_LowLim_OpenNone: 0x06020008,
  Bracket_LowLim_NoneNone: 0x06020009,
  Bracket_UppLim_OpenNone: 0x0602000a,
  Bracket_UppLim_NoneOpen: 0x0602000b,
  Bracket_Line_OpenNone: 0x0602000c,
  Bracket_Line_NoneOpen: 0x0602000d,
  Bracket_LineDouble_OpenNone: 0x0602000e,
  Bracket_LineDouble_NoneOpen: 0x0602000f,
  Bracket_SquareDouble_OpenNone: 0x06020010,
  Bracket_SquareDouble_NoneOpen: 0x06020011,
  Bracket_Custom_1: 0x06030000,
  Bracket_Custom_2: 0x06030001,
  Bracket_Custom_3: 0x06030002,
  Bracket_Custom_4: 0x06030003,
  Bracket_Custom_5: 0x06040000,
  Bracket_Custom_6: 0x06040001,
  Bracket_Custom_7: 0x06040002,
//----------------------------------------------------------------------------------------------------------------------
  Function_Sin: 0x07000000,
  Function_Cos: 0x07000001,
  Function_Tan: 0x07000002,
  Function_Csc: 0x07000003,
  Function_Sec: 0x07000004,
  Function_Cot: 0x07000005,
  Function_1_Sin: 0x07010000,
  Function_1_Cos: 0x07010001,
  Function_1_Tan: 0x07010002,
  Function_1_Csc: 0x07010003,
  Function_1_Sec: 0x07010004,
  Function_1_Cot: 0x07010005,
  Function_Sinh: 0x07020000,
  Function_Cosh: 0x07020001,
  Function_Tanh: 0x07020002,
  Function_Csch: 0x07020003,
  Function_Sech: 0x07020004,
  Function_Coth: 0x07020005,
  Function_1_Sinh: 0x07030000,
  Function_1_Cosh: 0x07030001,
  Function_1_Tanh: 0x07030002,
  Function_1_Csch: 0x07030003,
  Function_1_Sech: 0x07030004,
  Function_1_Coth: 0x07030005,
  Function_Custom_1: 0x07040000,
  Function_Custom_2: 0x07040001,
  Function_Custom_3: 0x07040002,
//----------------------------------------------------------------------------------------------------------------------
  Accent_Dot: 0x08000000,
  Accent_DDot: 0x08000001,
  Accent_DDDot: 0x08000002,
  Accent_Hat: 0x08000003,
  Accent_Check: 0x08000004,
  Accent_Accent: 0x08000005,
  Accent_Grave: 0x08000006,
  Accent_Smile: 0x08000007,
  Accent_Tilde: 0x08000008,
  Accent_Bar: 0x08000009,
  Accent_DoubleBar: 0x0800000a,
  Accent_CurveBracketTop: 0x0800000b,
  Accent_CurveBracketBot: 0x0800000c,
  Accent_GroupTop: 0x0800000d,
  Accent_GroupBot: 0x0800000e,
  Accent_ArrowL: 0x0800000f,
  Accent_ArrowR: 0x08000010,
  Accent_ArrowD: 0x08000011,
  Accent_HarpoonL: 0x08000012,
  Accent_HarpoonR: 0x08000013,
  Accent_BorderBox: 0x08010000,
  Accent_BorderBoxCustom: 0x08010001,
  Accent_BarTop: 0x08020000,
  Accent_BarBot: 0x08020001,
  Accent_Custom_1: 0x08030000,
  Accent_Custom_2: 0x08030001,
  Accent_Custom_3: 0x08030002,
//----------------------------------------------------------------------------------------------------------------------
  LimitLog_LogBase: 0x09000000,
  LimitLog_Log: 0x09000001,
  LimitLog_Lim: 0x09000002,
  LimitLog_Min: 0x09000003,
  LimitLog_Max: 0x09000004,
  LimitLog_Ln: 0x09000005,
  LimitLog_Custom_1: 0x09010000,
  LimitLog_Custom_2: 0x09010001,
//----------------------------------------------------------------------------------------------------------------------
  Operator_ColonEquals: 0x0a000000,
  Operator_EqualsEquals: 0x0a000001,
  Operator_PlusEquals: 0x0a000002,
  Operator_MinusEquals: 0x0a000003,
  Operator_Definition: 0x0a000004,
  Operator_UnitOfMeasure: 0x0a000005,
  Operator_DeltaEquals: 0x0a000006,
  Operator_ArrowL_Top: 0x0a010000,
  Operator_ArrowR_Top: 0x0a010001,
  Operator_ArrowL_Bot: 0x0a010002,
  Operator_ArrowR_Bot: 0x0a010003,
  Operator_DoubleArrowL_Top: 0x0a010004,
  Operator_DoubleArrowR_Top: 0x0a010005,
  Operator_DoubleArrowL_Bot: 0x0a010006,
  Operator_DoubleArrowR_Bot: 0x0a010007,
  Operator_ArrowD_Top: 0x0a010008,
  Operator_ArrowD_Bot: 0x0a010009,
  Operator_DoubleArrowD_Top: 0x0a01000a,
  Operator_DoubleArrowD_Bot: 0x0a01000b,
  Operator_Custom_1: 0x0a020000,
  Operator_Custom_2: 0x0a020001,
//----------------------------------------------------------------------------------------------------------------------
  Matrix_1_2: 0x0b000000,
  Matrix_2_1: 0x0b000001,
  Matrix_1_3: 0x0b000002,
  Matrix_3_1: 0x0b000003,
  Matrix_2_2: 0x0b000004,
  Matrix_2_3: 0x0b000005,
  Matrix_3_2: 0x0b000006,
  Matrix_3_3: 0x0b000007,
  Matrix_Dots_Center: 0x0b010000,
  Matrix_Dots_Baseline: 0x0b010001,
  Matrix_Dots_Vertical: 0x0b010002,
  Matrix_Dots_Diagonal: 0x0b010003,
  Matrix_Identity_2: 0x0b020000,
  Matrix_Identity_2_NoZeros: 0x0b020001,
  Matrix_Identity_3: 0x0b020002,
  Matrix_Identity_3_NoZeros: 0x0b020003,
  Matrix_2_2_RoundBracket: 0x0b030000,
  Matrix_2_2_SquareBracket: 0x0b030001,
  Matrix_2_2_LineBracket: 0x0b030002,
  Matrix_2_2_DLineBracket: 0x0b030003,
  Matrix_Flat_Round: 0x0b040000,
  Matrix_Flat_Square: 0x0b040001,
//----------------------------------------------------------------------------------------------------------------------
  Default_Text: 0x0c000000
};

var c_oAscMathInterfaceType = {
  Common        : 0x00,
  Fraction      : 0x01,
  Script        : 0x02,
  Radical       : 0x03,
  LargeOperator : 0x04,
  Delimiter     : 0x05,
  Function      : 0x06,
  Accent        : 0x07,
  BorderBox     : 0x08,
  Bar           : 0x09,
  Box           : 0x0a,
  Limit         : 0x0b,
  GroupChar     : 0x0c,
  Matrix        : 0x0d,
  EqArray       : 0x0e,
  Phantom       : 0x0f
};

var c_oAscMathInterfaceBarPos = {
  Top    : 0,
  Bottom : 1
};

var c_oAscMathInterfaceScript = {
  None      : 0x000,  // Удаление скрипта
  Sup       : 0x001,
  Sub       : 0x002,
  SubSup    : 0x003,
  PreSubSup : 0x004
};

var c_oAscMathInterfaceFraction = {
  Bar    : 0x001,
  Skewed : 0x002,
  Linear : 0x003,
  NoBar  : 0x004
};

var c_oAscMathInterfaceLimitPos = {
  None   : -1,  // Удаление предела
  Top    : 0,
  Bottom : 1
};

var c_oAscMathInterfaceMatrixMatrixAlign = {
  Top    : 0,
  Center : 1,
  Bottom : 2
};

var c_oAscMathInterfaceMatrixColumnAlign = {
  Left   : 0,
  Center : 1,
  Right  : 2
};

var c_oAscMathInterfaceMatrixRowRule = {
  Single      : 0x00,
  OneAndHalf  : 0x01,
  Double      : 0x02,
  Exactly     : 0x03,
  Multiple    : 0x04

};

var c_oAscMathInterfaceMatrixColumnRule = {
   Single      : 0x00,
   OneAndHalf  : 0x01,
   Double      : 0x02,
   Exactly     : 0x03,
   Multiple    : 0x04
};

var c_oAscMathInterfaceEqArrayAlign = {
  Top    : 0,
  Center : 1,
  Bottom : 2
};

var c_oAscMathInterfaceEqArrayLineRule = {
  Single      : 0x00,
  OneAndHalf  : 0x01,
  Double      : 0x02,
  Exactly     : 0x03,
  Multiple    : 0x04
};

var c_oAscMathInterfaceNaryLimitLocation = {
  UndOvr : 0,
  SubSup : 1
};

var c_oAscMathInterfaceGroupCharPos = {
  None   : -1,  // Удаление GroupChar
  Top    : 0,
  Bottom : 1
};

var c_oAscMathInterfaceSettingsBrkBin = {
  BreakRepeat   : 0x00,
  BreakBefore   : 0x01,
  BreakAfter    : 0x02
};

var c_oAscMathInterfaceSettingsAlign = {
  Left   : 0,
  Center : 1,
  Right  : 2,
  Justify : 3
};



var c_oAscRevisionsChangeType = {
  Unknown: 0x00,
  TextAdd: 0x01,
  TextRem: 0x02,
  ParaAdd: 0x03,
  ParaRem: 0x04,
  TextPr: 0x05,
  ParaPr: 0x06
};

var c_oAscRevisionsObjectType =
{
  Image        : 0,
  Shape        : 1,
  Chart        : 2,
  MathEquation : 3
};

var c_oAscPageOrientation = {
  Portrait  : 0x00,
  Landscape : 0x01
};


window["flat_desine"] = false;