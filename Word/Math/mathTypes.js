"use strict";

var MATH_FRACTION           	=  0;
var MATH_DEGREE             	=  1;
var MATH_DEGREESubSup       	=  2;
var MATH_RADICAL            	=  3;
var MATH_NARY               	=  4;
var MATH_DELIMITER          	=  5;
var MATH_GROUP_CHARACTER    	=  6;
var MATH_FUNCTION           	=  7;
var MATH_ACCENT             	=  8;
var MATH_BORDER_BOX         	=  9;
var MATH_LIMIT              	= 10;
var MATH_MATRIX             	= 11;
var MATH_BOX                	= 12;
var MATH_EQ_ARRAY               = 13;
var MATH_BAR                    = 14;
var MATH_PHANTOM                = 15;

var MATH_RUN                    = 16;
var MATH_PRIMARY_LIMIT          = 17;

var BAR_FRACTION            	=  0;
var SKEWED_FRACTION         	=  1;
var LINEAR_FRACTION         	=  2;
var NO_BAR_FRACTION         	=  3;

var DEGREE_SUPERSCRIPT      	=  1;
var DEGREE_SUBSCRIPT        	= -1;

var DEGREE_SubSup           	=  1;
var DEGREE_PreSubSup        	= -1;

var SQUARE_RADICAL          	=  0;
var DEGREE_RADICAL          	=  1;

var NARY_INTEGRAL           	=  0;
var NARY_DOUBLE_INTEGRAL    	=  1;
var NARY_TRIPLE_INTEGRAL    	=  2;
var NARY_CONTOUR_INTEGRAL   	=  3;
var NARY_SURFACE_INTEGRAL   	=  4;
var NARY_VOLUME_INTEGRAL    	=  5;
var NARY_SIGMA              	=  6;
var NARY_PRODUCT            	=  7;
var NARY_COPRODUCT          	=  8;
var NARY_UNION              	=  9;
var NARY_INTERSECTION       	= 10;
var NARY_LOGICAL_OR         	= 11;
var NARY_LOGICAL_AND        	= 12;
var NARY_TEXT_OPER              = 13;

var NARY_UndOvr             	=  0;
var NARY_SubSup             	=  1;

////////////////////////////////////////////////////

//  operators:
//  accent, delimiters, group character

var OPERATOR_EMPTY              = -1;
var OPERATOR_TEXT               =  0;
var PARENTHESIS_LEFT        	=  1;
var PARENTHESIS_RIGHT       	=  2;
var BRACKET_CURLY_LEFT      	=  3;
var BRACKET_CURLY_RIGHT     	=  4;
var BRACKET_SQUARE_LEFT     	=  5;
var BRACKET_SQUARE_RIGHT    	=  6;
var BRACKET_ANGLE_LEFT      	=  7;
var BRACKET_ANGLE_RIGHT     	=  8;
var HALF_SQUARE_LEFT    	    =  9;
var HALF_SQUARE_RIGHT   	    = 10;
var HALF_SQUARE_LEFT_UPPER	    = 11;
var HALF_SQUARE_RIGHT_UPPER	    = 12;
var DELIMITER_LINE              = 13;
var DELIMITER_DOUBLE_LINE       = 14;
var WHITE_SQUARE_LEFT           = 15;
var WHITE_SQUARE_RIGHT          = 16;
var BRACKET_CURLY_TOP           = 17;
var BRACKET_CURLY_BOTTOM        = 18;
var ARROW_LEFT                  = 19;
var ARROW_RIGHT                 = 20;
var ARROW_LR                    = 21;
var DOUBLE_LEFT_ARROW           = 22;
var DOUBLE_RIGHT_ARROW          = 23;
var DOUBLE_ARROW_LR             = 24;
var ACCENT_ARROW_LEFT           = 26;
var ACCENT_ARROW_RIGHT          = 27;
var ACCENT_ARROW_LR             = 28;
var ACCENT_HALF_ARROW_LEFT      = 29;
var ACCENT_HALF_ARROW_RIGHT     = 30;
var PARENTHESIS_TOP             = 31;
var PARENTHESIS_BOTTOM          = 32;
var BRACKET_SQUARE_TOP     	    = 33;

var ACCENT_ONE_DOT              = 31;
var ACCENT_TWO_DOTS             = 32;
var ACCENT_THREE_DOTS           = 33;
var ACCENT_GRAVE                = 34;
var ACCENT_ACUTE                = 35;
var ACCENT_CIRCUMFLEX           = 36;
var ACCENT_COMB_CARON           = 37;
var ACCENT_LINE                 = 38;
var ACCENT_DOUBLE_LINE          = 39;
var SINGLE_LINE                 = 40;
var DOUBLE_LINE                 = 41;
var ACCENT_TILDE                = 42;
var ACCENT_BREVE                = 43;
var ACCENT_INVERT_BREVE         = 44;

var ACCENT_SIGN                 = 45;
var ACCENT_TEXT                 = 46;

///////////////////////////////////////////////////


var TXT_ROMAN                   =  0;   // math roman
var TXT_SCRIPT                  =  1;
var TXT_FRAKTUR                 =  2;
var TXT_DOUBLE_STRUCK           =  3;
var TXT_SANS_SERIF              =  4;
var TXT_MONOSPACE               =  5;

var OPER_DELIMITER              =  0;
var OPER_SEPARATOR              =  1;
var OPER_GROUP_CHAR             =  2;
var OPER_ACCENT                 =  3;
var OPER_BAR                    =  4;


var TURN_0                      =  0;
var TURN_180                    =  1;
var TURN_MIRROR_0               =  2;
var TURN_MIRROR_180             =  3;

var DELIMITER_SHAPE_MATH        =  0;
var DELIMITER_SHAPE_CENTERED    =  1;

var LIMIT_LOW               	=  0;
var LIMIT_UP                	=  1;

/////////////////////////////////////////

var MCJC_CENTER                 =  0;
var MCJC_LEFT                   =  1;
var MCJC_RIGHT                  =  2;
var MCJC_INSIDE                 =  0;
var MCJC_OUTSIDE                =  0;

var BASEJC_CENTER               =  0;
var BASEJC_TOP                  =  1;
var BASEJC_BOTTOM               =  2;
var BASEJC_INLINE               =  0;
var BASEJC_INSIDE               =  0;
var BASEJC_OUTSIDE              =  0;

var JC_CENTER                   =  0;
var JC_CENTERGROUP              =  1;
var JC_LEFT                     =  2;
var JC_RIGHT                    =  3;

var LOCATION_TOP                =  0;
var LOCATION_BOT                =  1;
var LOCATION_LEFT               =  2;
var LOCATION_RIGHT              =  3;
var LOCATION_SEP                =  4;

var VJUST_TOP                   = 0;
var VJUST_BOT                   = 1;


////////////////////////////////////////
var BREAK_BEFORE                =  0;
var BREAK_AFTER                 =  1;
var BREAK_REPEAT                =  2;

var BREAK_MIN_MIN               =  0;
var BREAK_PLUS_MIN              =  1;
var BREAK_MIN_PLUS              =  2;

var STY_BOLD                    =  0;
var STY_BI                      =  1;
var STY_ITALIC                  =  2;
var STY_PLAIN                   =  3;

/////////////////////////////////////////

var ALIGN_MARGIN_WRAP           = 0;
var ALIGN_MARGIN                = 1;
var ALIGN_WRAP                  = 2;
var ALIGN_EMPTY                 = 3;

var MATH_INTERVAL_EMPTY         = 0;
var MATH_INTERVAL_ON_SIDE       = 1;

var MATH_UPDWRAP_NOCHANGES      = 0;
var MATH_UPDWRAP_NEWRANGE       = 1;
var MATH_UPDWRAP_UNDERFLOW      = 2;

var MATH_SIZE                   = 0;
var MATH_BOUNDS_MEASURES        = 1;

var MATH_MATRIX_ROW             = 0;
var MATH_MATRIX_COLUMN          = 1;

var c_oAscMathMenuTypes =
{
    FractionBar:                0x001,
    FractionSkewed:             0x002,
    FractionLinear:             0x003,
    FractionNoBar:              0x004,
    RadicalHideDegree:          0x005,
    NaryLimLoc:                 0x006,
    NaryHideUpperIterator:      0x007,
    NaryHideLowerIterator:      0x008,
    DelimiterHideBegOper:       0x009,
    DelimiterHideEndOper:       0x00A,
    DelimiterAddToLeft:         0x00B,
    DelimiterAddToRight:        0x00C,
    DelimiterRemoveContent:     0x00D,
    DelimiterGrow:              0x00E,
    DelimiterShpCentred:        0x00F,
    GroupCharOver:              0x010,
    GroupCharUnder:             0x011,
    LimitOver:                  0x012,
    LimitUnder:                 0x013,
    BorderBoxHideTop:           0x014,
    BorderBoxHideBot:           0x015,
    BorderBoxHideLeft:          0x016,
    BorderBoxHideRight:         0x017,
    BorderBoxStrikeHor:         0x018,
    BorderBoxStrikeVer:         0x019,
    BorderBoxStrikeTopLTR:      0x020,
    BorderBoxStrikeTopRTL:      0x021,
    MatrixAddRowUnder:          0x022,
    MatrixAddRowOver:           0x023,
    MatrixRemoveRow:            0x024,
    MatrixAddColumnToLeft:      0x025,
    MatrixAddColumnToRight:     0x026,
    MatrixRemoveColumn:         0x027,
    MatrixBaseJcCenter:         0x028,
    MatrixBaseJcTop:            0x029,
    MatrixBaseJcBottom:         0x030,
    MatrixColumnJcCenter:       0x031,
    MatrixColumnJcLeft:         0x032,
    MatrixColumnJcRight:        0x033,
    MatrixRowSingleGap:         0x034,
    MatrixRowOneAndHalfGap:     0x035,
    MatrixRowDoubleGap:         0x036,
    MatrixRowExactlyGap:        0x037,
    MatrixRowMultipleGap:       0x038,
    MatrixColumnSingleGap:      0x039,
    MatrixColumnOneAndHalfGap:  0x040,
    MatrixColumnDoubleGap:      0x041,
    MatrixColumnExactlyGap:     0x042,
    MatrixColumnMultipleGap:    0x043,
    MatrixHidePlaceholders:     0x044,
    MatrixMinColumnWidth:       0x045,
    EqArrayAddRowUnder:         0x046,
    EqArrayAddRowOver:          0x047,
    EqArrayRemoveRow:           0x048,
    EqArrayBaseJcCenter:        0x049,
    EqArrayBaseJcTop:           0x050,
    EqArrayBaseJcBottom:        0x051,
    EqArrayRowSingleGap:        0x052,
    EqArrayRowOneAndHalfGap:    0x053,
    EqArrayRowDoubleGap:        0x054,
    EqArrayRowExactlyGap:       0x055,
    EqArrayRowMultipleGap:      0x056,
    BarLineOver:                0x057,
    BarLineUnder:               0x058,
    DeleteElement:              0x059,
    DeleteSubScript:            0x060,
    DeleteSuperScript:          0x061,
    IncreaseArgSize:            0x062,
    DecreaseArgSize:            0x063,
    AddForcedBreak:             0x064,
    DeleteForcedBreak:          0x065
};