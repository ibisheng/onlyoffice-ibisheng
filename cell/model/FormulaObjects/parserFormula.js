/*
 * (c) Copyright Ascensio System SIA 2010-2016
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
  // Import
  var CellValueType = AscCommon.CellValueType;
  var cBoolLocal = AscCommon.cBoolLocal;
  var cErrorOrigin = AscCommon.cErrorOrigin;
  var cErrorLocal = AscCommon.cErrorLocal;
  var FormulaSeparators = AscCommon.FormulaSeparators;
  var parserHelp = AscCommon.parserHelp;
  var g_oFormatParser = AscCommon.g_oFormatParser;
  var g_oCellAddressUtils = AscCommon.g_oCellAddressUtils;
  var CellAddress = AscCommon.CellAddress;

  var c_oAscError = Asc.c_oAscError;

	var TOK_TYPE_OPERAND = 1;
	var TOK_TYPE_FUNCTION = 2;
	var TOK_TYPE_SUBEXPR = 3;
	var TOK_TYPE_ARGUMENT = 4;
	var TOK_TYPE_OP_IN = 5;
	var TOK_TYPE_OP_POST = 6;
	var TOK_TYPE_WSPACE = 7;
	var TOK_TYPE_UNKNOWN = 8;

	var TOK_SUBTYPE_START = 9;
	var TOK_SUBTYPE_STOP = 10;

	var TOK_SUBTYPE_TEXT = 11;
	var TOK_SUBTYPE_LOGICAL = 12;
	var TOK_SUBTYPE_ERROR = 14;

	var TOK_SUBTYPE_UNION = 15;

	function ParsedThing(value, type, subtype) {
		this.value = value;
		this.type = type;
		this.subtype = subtype;
	}

	ParsedThing.prototype.getStop = function () {
		return new ParsedThing(this.value, this.type, TOK_SUBTYPE_STOP);
	};

	var g_oCodeSpace = 32; // Code of space
	var g_oCodeNumberSign = 35; // Code of #
	var g_oCodeDQuote = 34; // Code of "
	var g_oCodePercent = 37; // Code of %
	var g_oCodeAmpersand = 38; // Code of &
	var g_oCodeQuote = 39; // Code of '
	var g_oCodeLeftParenthesis = 40; // Code of (
	var g_oCodeRightParenthesis = 41; // Code of )
	var g_oCodeMultiply = 42; // Code of *
	var g_oCodePlus = 43; // Code of +
	var g_oCodeComma = 44; // Code of ,
	var g_oCodeMinus = 45; // Code of -
	var g_oCodeDivision = 47; // Code of /
	var g_oCodeSemicolon = 59; // Code of ;
	var g_oCodeLessSign = 60; // Code of <
	var g_oCodeEqualSign = 61; // Code of =
	var g_oCodeGreaterSign = 62; // Code of >
	var g_oCodeLeftSquareBracked = 91; // Code of [
	var g_oCodeRightSquareBracked = 93; // Code of ]
	var g_oCodeAccent = 94; // Code of ^
	var g_oCodeLeftCurlyBracked = 123; // Code of {
	var g_oCodeRightCurlyBracked = 125; // Code of }

	function getTokens(formula) {

		var tokens = [];
		var tokenStack = [];

		var offset = 0;
		var length = formula.length;
		var currentChar, currentCharCode, nextCharCode, tmp;

		var token = "";

		var inString = false;
		var inPath = false;
		var inRange = false;
		var inError = false;

		var regexSN = /^[1-9]{1}(\.[0-9]+)?E{1}$/;

		nextCharCode = formula.charCodeAt(offset);
		while (offset < length) {

			// state-dependent character evaluation (order is important)

			// double-quoted strings
			// embeds are doubled
			// end marks token

			currentChar = formula[offset];
			currentCharCode = nextCharCode;
			nextCharCode = formula.charCodeAt(offset + 1);

			if (inString) {
				if (currentCharCode === g_oCodeDQuote) {
					if (nextCharCode === g_oCodeDQuote) {
						token += currentChar;
						offset += 1;
					} else {
						inString = false;
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_TEXT));
						token = "";
					}
				} else {
					token += currentChar;
				}
				offset += 1;
				continue;
			} else if (inPath) {
				// single-quoted strings (links)
				// embeds are double
				// end does not mark a token
				if (currentCharCode === g_oCodeQuote) {
					if (nextCharCode === g_oCodeQuote) {
						token += currentChar;
						offset += 1;
					} else {
						inPath = false;
					}
				} else {
					token += currentChar;
				}
				offset += 1;
				continue;
			} else if (inRange) {
				// bracked strings (range offset or linked workbook name)
				// no embeds (changed to "()" by Excel)
				// end does not mark a token
				if (currentCharCode === g_oCodeRightSquareBracked) {
					inRange = false;
				}
				token += currentChar;
				offset += 1;
				continue;
			} else if (inError) {
				// error values
				// end marks a token, determined from absolute list of values
				token += currentChar;
				offset += 1;
				if ((",#NULL!,#DIV/0!,#VALUE!,#REF!,#NAME?,#NUM!,#N/A,").indexOf("," + token + ",") != -1) {
					inError = false;
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_ERROR));
					token = "";
				}
				continue;
			}

			// trim white-space
			if (currentCharCode === g_oCodeSpace) {
				if (token.length > 0) {
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
					token = "";
				}
				tokens.push(new ParsedThing("", TOK_TYPE_WSPACE));
				offset += 1;

				while ((currentCharCode = formula.charCodeAt(offset)) === g_oCodeSpace) {
					offset += 1;
				}
				if (offset >= length) {
					break;
				}

				currentChar = formula[offset];
				nextCharCode = formula.charCodeAt(offset + 1);
			}

			// multi-character comparators (>= || <= || <>)
			if ((currentCharCode === g_oCodeLessSign &&
				(nextCharCode === g_oCodeEqualSign || nextCharCode === g_oCodeGreaterSign)) ||
				(currentCharCode === g_oCodeGreaterSign && nextCharCode === g_oCodeEqualSign)) {
				if (token.length > 0) {
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
					token = "";
				}
				tokens.push(new ParsedThing(formula.substr(offset, 2), TOK_TYPE_OP_IN, TOK_SUBTYPE_LOGICAL));
				offset += 2;
				nextCharCode = formula.charCodeAt(offset);
				continue;
			}

			// scientific notation check
			if (currentCharCode === g_oCodePlus || currentCharCode === g_oCodeMinus) {
				if (token.length > 1) {
					if (token.match(regexSN)) {
						token += currentChar;
						offset += 1;
						continue;
					}
				}
			}

			// independent character evaulation (order not important)

			// establish state-dependent character evaluations
			switch (currentCharCode) {
				case g_oCodeDQuote:
				{
					if (token.length > 0) {
						// not expected
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN));
						token = "";
					}
					inString = true;
					break;
				}
				case g_oCodeQuote:
				{
					if (token.length > 0) {
						// not expected
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN));
						token = "";
					}
					inPath = true;
					break;
				}
				case g_oCodeLeftSquareBracked:
				{
					inRange = true;
					token += currentChar;
					break;
				}
				case g_oCodeNumberSign:
				{
					if (token.length > 0) {
						// not expected
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN));
						token = "";
					}
					inError = true;
					token += currentChar;
					break;
				}
				case g_oCodeLeftCurlyBracked:
				{
					// mark start and end of arrays and array rows
					if (token.length > 0) {
						// not expected
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN));
						token = "";
					}
					tmp = new ParsedThing('ARRAY', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					tmp = new ParsedThing('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					break;
				}
				case g_oCodeSemicolon:
				{
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tmp = tokenStack.pop();
					if (tmp && 'ARRAYROW' !== tmp.value) {
						return null;
					}
					tokens.push(tmp);
					tokens.push(new ParsedThing(';', TOK_TYPE_ARGUMENT));
					tmp = new ParsedThing('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					break;
				}
				case g_oCodeRightCurlyBracked:
				{
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tokens.push(tokenStack.pop());
					tokens.push(tokenStack.pop());
					break;
				}
				case g_oCodePlus:
				case g_oCodeMinus:
				case g_oCodeMultiply:
				case g_oCodeDivision:
				case g_oCodeAccent:
				case g_oCodeAmpersand:
				case g_oCodeEqualSign:
				case g_oCodeGreaterSign:
				case g_oCodeLessSign:
				{
					// standard infix operators
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tokens.push(new ParsedThing(currentChar, TOK_TYPE_OP_IN));
					break;
				}
				case g_oCodePercent:
				{
					// standard postfix operators
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tokens.push(new ParsedThing(currentChar, TOK_TYPE_OP_POST));
					break;
				}
				case g_oCodeLeftParenthesis:
				{
					// start subexpression or function
					if (token.length > 0) {
						tmp = new ParsedThing(token, TOK_TYPE_FUNCTION, TOK_SUBTYPE_START);
						tokens.push(tmp);
						tokenStack.push(tmp.getStop());
						token = "";
					} else {
						tmp = new ParsedThing("", TOK_TYPE_SUBEXPR, TOK_SUBTYPE_START);
						tokens.push(tmp);
						tokenStack.push(tmp.getStop());
					}
					break;
				}
				case g_oCodeComma:
				{
					// function, subexpression, array parameters
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tmp = (0 !== tokenStack.length) ? (TOK_TYPE_FUNCTION === tokenStack[tokenStack.length - 1].type) : false;
					tokens.push(tmp ? new ParsedThing(currentChar, TOK_TYPE_ARGUMENT) :
						new ParsedThing(currentChar, TOK_TYPE_OP_IN, TOK_SUBTYPE_UNION));
					break;
				}
				case g_oCodeRightParenthesis:
				{
					// stop subexpression
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
						token = "";
					}
					tokens.push(tokenStack.pop());
					break;
				}
				default:
				{
					// token accumulation
					token += currentChar;
					break;
				}
			}

			++offset;
		}

		// dump remaining accumulation
		if (token.length > 0) {
			tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND));
		}

		return tokens;
	}

  
/** @enum */
var cElementType = {
		number      : 0,
		string      : 1,
		bool        : 2,
		error       : 3,
		empty       : 4,
		cellsRange  : 5,
		cell        : 6,
		date        : 7,
		func        : 8,
		operator    : 9,
		name        : 10,
		array       : 11,
		cell3D      : 12,
		cellsRange3D: 13,
		table       : 14,
		name3D      : 15
  };
/** @enum */
var cErrorType = {
		unsupported_function: 0,
		null_value          : 1,
		division_by_zero    : 2,
		wrong_value_type    : 3,
		bad_reference       : 4,
		wrong_name          : 5,
		not_numeric         : 6,
		not_available       : 7,
		getting_data        : 8
  };
var cExcelSignificantDigits = 15; //количество цифр в числе после запятой
var cExcelMaxExponent = 308;
var cExcelMinExponent = -308;
var c_Date1904Const = 24107; //разница в днях между 01.01.1970 и 01.01.1904 годами
var c_Date1900Const = 25568; //разница в днях между 01.01.1970 и 01.01.1900 годами
var c_sPerDay = 86400;
var c_msPerDay = c_sPerDay * 1000;
  var rx_sFuncPref = /_xlfn\./i;

Date.prototype.excelNullDate1900 = Date.UTC( 1899, 11, 30, 0, 0, 0 );
Date.prototype.excelNullDate1904 = Date.UTC( 1904, 0, 1, 0, 0, 0 );

Date.prototype.getExcelNullDate = function () {
  return AscCommon.bDate1904 ? Date.prototype.excelNullDate1904 : Date.prototype.excelNullDate1900;
};

Date.prototype.isLeapYear = function () {
    var y = this.getUTCFullYear();
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
};

Date.prototype.getDaysInMonth = function () {
//    return arguments.callee[this.isLeapYear() ? 'L' : 'R'][this.getMonth()];
  return this.isLeapYear() ? this.getDaysInMonth.L[this.getUTCMonth()] : this.getDaysInMonth.R[this.getUTCMonth()];
};

// durations of months for the regular year
Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// durations of months for the leap year
Date.prototype.getDaysInMonth.L = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

Date.prototype.truncate = function () {
    this.setUTCHours( 0, 0, 0, 0 );
    return this;
};

Date.prototype.getExcelDate = function () {
    return Math.floor( this.getExcelDateWithTime() );
};

Date.prototype.getExcelDateWithTime = function () {
//    return Math.floor( ( this.getTime() / 1000 - this.getTimezoneOffset() * 60 ) / c_sPerDay + ( AscCommonExcel.c_DateCorrectConst + (bDate1904 ? 0 : 1) ) );
    var year = this.getUTCFullYear(), month = this.getUTCMonth(), date = this.getUTCDate(), res;

  if (1900 < year || (1900 == year && 1 < month)) {
    res = (Date.UTC(year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()) -
      this.getExcelNullDate() ) / c_msPerDay;
  } else if (1900 == year && 1 == month && 29 == date) {
        res = 60;
  } else {
    res = (Date.UTC(year, month, date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()) -
      this.getExcelNullDate() ) / c_msPerDay - 1;
  }

    return res;
};

Date.prototype.getDateFromExcel = function ( val ) {

    val = Math.floor( val );

  if (AscCommon.bDate1904) {
        return new Date( val * c_msPerDay + this.getExcelNullDate() );
  } else {
        if ( val < 60 ) {
            return new Date( val * c_msPerDay + this.getExcelNullDate() );
    } else if (val === 60) {
            return new Date( Date.UTC( 1900, 1, 29 ) );
    } else {
            return new Date( val * c_msPerDay + this.getExcelNullDate() );
        }
    }
};

Date.prototype.addYears = function ( counts ) {
    this.setUTCFullYear( this.getUTCFullYear() + Math.floor( counts ) );
};

Date.prototype.addMonths = function ( counts ) {
    if ( this.lastDayOfMonth() ) {
        this.setUTCDate( 1 );
        this.setUTCMonth( this.getUTCMonth() + Math.floor( counts ) );
        this.setUTCDate( this.getDaysInMonth() );
  } else {
        this.setUTCMonth( this.getUTCMonth() + Math.floor( counts ) );
    }
};

Date.prototype.addDays = function ( counts ) {
    this.setUTCDate( this.getUTCDate() + Math.floor( counts ) );
};

Date.prototype.lastDayOfMonth = function () {
    return this.getDaysInMonth() == this.getUTCDate();
};

Math.sinh = function ( arg ) {
    return (this.pow( this.E, arg ) - this.pow( this.E, -arg )) / 2;
};

Math.cosh = function ( arg ) {
    return (this.pow( this.E, arg ) + this.pow( this.E, -arg )) / 2;
};

Math.tanh = function ( arg ) {
    return this.sinh( arg ) / this.cosh( arg );
};

Math.asinh = function ( arg ) {
    return this.log( arg + this.sqrt( arg * arg + 1 ) );
};

Math.acosh = function ( arg ) {
    return this.log( arg + this.sqrt( arg + 1 ) * this.sqrt( arg - 1 ) );
};

Math.atanh = function ( arg ) {
    return 0.5 * this.log( (1 + arg) / (1 - arg) );
};

Math.fact = function ( n ) {
    var res = 1;
    n = this.floor( n );
    if ( n < 0 ) {
        return NaN;
  } else if (n > 170) {
        return Infinity;
    }
    while ( n !== 0 ) {
        res *= n--;
    }
    return res;
};

Math.doubleFact = function ( n ) {
    var res = 1;
    n = this.floor( n );
    if ( n < 0 ) {
        return NaN;
  } else if (n > 170) {
        return Infinity;
    }
//    n = Math.floor((n+1)/2);
    while ( n > 0 ) {
        res *= n;
        n -= 2;
    }
    return res;
};

Math.factor = function ( n ) {
    var res = 1;
    n = this.floor( n );
    while ( n !== 0 ) {
        res = res * n--;
    }
    return res;
};

Math.ln = Math.log;

Math.log10 = function ( x ) {
    return this.log( x ) / this.log( 10 );
};

Math.fmod = function ( a, b ) {
    return Number( (a - (this.floor( a / b ) * b)).toPrecision( cExcelSignificantDigits ) );
};

Math.binomCoeff = function ( n, k ) {
    return this.fact( n ) / (this.fact( k ) * this.fact( n - k ));
};

Math.permut = function ( n, k ) {
    return this.floor( this.fact( n ) / this.fact( n - k ) + 0.5 );
};

Math.approxEqual = function ( a, b ) {
    if ( a === b ) {
        return true;
    }
    return this.abs( a - b ) < 1e-15;
};

Math.sign = function ( x ) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
};

RegExp.escape = function ( text ) {
    return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
};

parserHelp.setDigitSeparator(AscCommon.g_oDefaultCultureInfo.NumberDecimalSeparator);

/** @constructor */
function cBaseType( val, type ) {
    this.needRecalc = false;
    this.numFormat = null;
    this.ca = false;
    this.type = type;
    this.value = val;
}

cBaseType.prototype.cloneTo = function(oRes) {
  oRes.needRecalc = this.needRecalc;
  oRes.numFormat = this.numFormat;
  oRes.type = this.type;
  oRes.value = this.value;
  oRes.ca = this.ca;
};
cBaseType.prototype.getValue = function() {
  return this.value;
};
cBaseType.prototype.toString = function() {
  return this.value.toString();
};
cBaseType.prototype.toLocaleString = function() {
  return this.toString();
};

/*Basic types of an elements used into formulas*/
/** @constructor */
function cNumber( val ) {
    this.constructor.call( this, parseFloat( val ), cElementType.number );
    var res;

    if ( !isNaN( this.value ) && Math.abs( this.value ) !== Infinity ) {
        res = this;
  } else if (val instanceof cError) {
        res = val;
  } else {
        res = new cError( cErrorType.not_numeric );
    }
    return res;
}

cNumber.prototype = Object.create( cBaseType.prototype );
cNumber.prototype.tocString = function () {
  return new cString(("" + this.value).replace(FormulaSeparators.digitSeparatorDef, FormulaSeparators.digitSeparator));
};
cNumber.prototype.tocNumber = function () {
    return this;
};
cNumber.prototype.tocBool = function () {
    return new cBool( this.value !== 0 );
};
cNumber.prototype.toLocaleString = function ( digitDelim ) {
    var res = this.value.toString();
  if (digitDelim) {
    return res.replace(FormulaSeparators.digitSeparatorDef, FormulaSeparators.digitSeparator);
  } else {
        return res;
  }
};

/** @constructor */
function cString( val ) {
    this.constructor.call( this, val, cElementType.string );
}

cString.prototype = Object.create( cBaseType.prototype );
cString.prototype.tocNumber = function () {
    var res, m = this.value;
    if ( this.value === "" ) {
        res = new cNumber( 0 );
    }

    /*if ( this.value[0] === '"' && this.value[this.value.length - 1] === '"' ) {
     m = this.value.substring( 1, this.value.length - 1 );
     }*/

    if ( g_oFormatParser.isLocaleNumber( this.value ) ) {
        var numberValue = g_oFormatParser.parseLocaleNumber( this.value );
        if ( !isNaN( numberValue ) ) {
            res = new cNumber( numberValue );
        }
    } else {
        var parseRes = AscCommon.g_oFormatParser.parse(this.value);
        if(null != parseRes) {
            res = new cNumber( parseRes.value );
        } else {
            res = new cError( cErrorType.wrong_value_type );
        }
    }

    return res;
};
cString.prototype.tocBool = function () {
    var res;
    if ( parserHelp.isBoolean( this.value, 0 ) ) {
        res = new cBool( parserHelp.operand_str.toUpperCase() === cBoolLocal["t"].toUpperCase() );
  } else {
        res = this;
    }
    return res;
};
cString.prototype.tocString = function () {
    return this;
};

/** @constructor */
function cBool( val ) {
	var v = false;
	switch(val.toString().toUpperCase()){
		case "TRUE":
    case cBoolLocal["t"].toUpperCase():
      v = true;
	}
    this.constructor.call( this, v, cElementType.bool );
}

cBool.prototype = Object.create( cBaseType.prototype );
cBool.prototype.toString = function () {
    return this.value.toString().toUpperCase();
};
cBool.prototype.getValue = function () {
    return this.toString();
};
cBool.prototype.tocNumber = function () {
    return new cNumber( this.value ? 1.0 : 0.0 );
};
cBool.prototype.tocString = function () {
    return new cString( this.value ? "TRUE" : "FALSE" );
};
cBool.prototype.toLocaleString = function () {
    return new cString( this.value ? cBoolLocal["t"].toUpperCase() : cBoolLocal["f"].toUpperCase() );
};
cBool.prototype.tocBool = function () {
    return this;
};
cBool.prototype.toBool = function () {
    return this.value;
};

/** @constructor */
function cError( val ) {
    this.constructor.call( this, val, cElementType.error );

    this.errorType = -1;

    switch ( val ) {
		case cErrorLocal["value"]:
		case cErrorOrigin["value"]:
        case cErrorType.wrong_value_type:
        {
            this.value = "#VALUE!";
            this.errorType = cErrorType.wrong_value_type;
            break;
        }
		case cErrorLocal["nil"]:
		case cErrorOrigin["nil"]:
        case cErrorType.null_value:
        {
            this.value = "#NULL!";
            this.errorType = cErrorType.null_value;
            break;
        }
		case cErrorLocal["div"]:
		case cErrorOrigin["div"]:
        case cErrorType.division_by_zero:
        {
            this.value = "#DIV/0!";
            this.errorType = cErrorType.division_by_zero;
            break;
        }
		case cErrorLocal["ref"]:
		case cErrorOrigin["ref"]:
        case cErrorType.bad_reference:
        {
            this.value = "#REF!";
            this.errorType = cErrorType.bad_reference;
            break;
        }
		case cErrorLocal["name"]:
		case cErrorOrigin["name"]:
        case cErrorType.wrong_name:
        {
            this.value = "#NAME?";
            this.errorType = cErrorType.wrong_name;
            break;
        }
		case cErrorLocal["num"]:
		case cErrorOrigin["num"]:
        case cErrorType.not_numeric:
        {
            this.value = "#NUM!";
            this.errorType = cErrorType.not_numeric;
            break;
        }
		case cErrorLocal["na"]:
		case cErrorOrigin["na"]:
        case cErrorType.not_available:
        {
            this.value = "#N/A";
            this.errorType = cErrorType.not_available;
            break;
        }
		case cErrorLocal["getdata"]:
		case cErrorOrigin["getdata"]:
        case cErrorType.getting_data:
        {
            this.value = "#GETTING_DATA";
            this.errorType = cErrorType.getting_data;
            break;
        }
		case cErrorLocal["uf"]:
		case cErrorOrigin["uf"]:
        case cErrorType.unsupported_function:
        {
            this.value = "#UNSUPPORTED_FUNCTION!";
            this.errorType = cErrorType.unsupported_function;
            break;
        }
    }

    return this;
}

cError.prototype = Object.create( cBaseType.prototype );
cError.prototype.tocNumber =
  cError.prototype.tocString = cError.prototype.tocBool = cError.prototype.tocEmpty = function() {
    return this;
};
cError.prototype.toLocaleString = function () {
	switch ( this.value ) {
		case cErrorOrigin["value"]:
		case cErrorType.wrong_value_type:
		{
			return cErrorLocal["value"];
			break;
		}
		case cErrorOrigin["nil"]:
		case cErrorType.null_value:
		{
			return cErrorLocal["nil"];
			break;
		}
		case cErrorOrigin["div"]:
		case cErrorType.division_by_zero:
		{
			return cErrorLocal["div"];
			break;
		}

		case cErrorOrigin["ref"]:
		case cErrorType.bad_reference:
		{
			return cErrorLocal["ref"];
			break;
		}

		case cErrorOrigin["name"]:
		case cErrorType.wrong_name:
		{
			return cErrorLocal["name"];
			break;
		}

		case cErrorOrigin["num"]:
		case cErrorType.not_numeric:
		{
			return cErrorLocal["num"];
			break;
		}

		case cErrorOrigin["na"]:
		case cErrorType.not_available:
		{
			return cErrorLocal["na"];
			break;
		}

		case cErrorOrigin["getdata"]:
		case cErrorType.getting_data:
		{
			return cErrorLocal["getdata"];
			break;
		}

		case cErrorOrigin["uf"]:
		case cErrorType.unsupported_function:
		{
			return cErrorLocal["uf"];
			break;
		}
	}
	return cErrorLocal["na"];
};
/*cError.prototype.toString = function () {
	return new cString( this.value ? cBoolLocal["t"].toUpperCase() : cBoolLocal["f"].toUpperCase() );
};*/

/** @constructor */
function cArea( val, ws ) {/*Area means "A1:E5" for example*/
    this.constructor.call( this, val, cElementType.cellsRange );

	this.ws = ws;
	this.range = null;
	if (val) {
		this.range = ws.getRange2(val);
	}
}

cArea.prototype = Object.create( cBaseType.prototype );
cArea.prototype.clone = function (opt_ws) {
	var ws = opt_ws ? opt_ws : this.ws;
	var oRes = new cArea(null, ws);
//	cBaseType.prototype.cloneTo.call( this, oRes );
	this.constructor.prototype.cloneTo.call(this, oRes);
	if (this.range) {
		oRes.range = this.range.clone(ws);
	}
    return oRes;
};
cArea.prototype.getWsId = function () {
    return this.ws.Id;
};
	cArea.prototype.getValue = function () {
		var val = [], r = this.getRange();
		if (!r) {
			val.push(new cError(cErrorType.bad_reference));
		} else {
			r._foreachNoEmpty(function (cell) {
				val.push(checkTypeCell(cell));
			});
		}
		return val;
	};
	cArea.prototype.getValue2 = function (i, j) {
		var res = this.index(i + 1, j + 1), r, cell;
		if (!res) {
			r = this.getRange();
			cell = r.worksheet._getCellNoEmpty(r.bbox.r1 + i, r.bbox.c1 + j);
			res = checkTypeCell(cell);
		}
		return res;
	};
cArea.prototype.getRange = function () {
    return this.range;
};
cArea.prototype.tocNumber = function () {
    var v = this.getValue()[0];
    if ( !v ) {
        v = new cNumber( 0 );
  } else {
        v = v.tocNumber();
    }
    return v;
};
cArea.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea.prototype.toString = function () {
    var _c;

    if ( this.range ) {
        _c = this.range.getName();
  } else {
        _c = this.value;
    }
    if ( _c.indexOf( ":" ) < 0 ) {
        _c = _c + ":" + _c;
    }
    return _c;
};
cArea.prototype.getWS = function () {
    return this.ws;
};
cArea.prototype.getBBox = function () {
    return this.getRange().getBBox();
};
cArea.prototype.getBBox0 = function () {
    return this.getRange().getBBox0();
};
cArea.prototype.cross = function ( arg ) {
    var r = this.getRange(), cross;
    if ( !r ) {
        return new cError( cErrorType.wrong_name );
    }
    cross = r.cross( arg );
    if ( cross ) {
        if ( cross.r != undefined ) {
            return this.getValue2( cross.r - this.getBBox().r1, 0 );
    } else if (cross.c != undefined) {
            return this.getValue2( 0, cross.c - this.getBBox().c1 );
        }
    }
    return new cError( cErrorType.wrong_value_type );
};
cArea.prototype.isValid = function () {
    return !!this.getRange();
};
	cArea.prototype.countCells = function () {
		var r = this.getRange(), bbox = r.bbox, count = (Math.abs(bbox.c1 - bbox.c2) + 1) *
			(Math.abs(bbox.r1 - bbox.r2) + 1);
		r._foreachNoEmpty(function (cell) {
			if (!cell || !cell.isEmptyTextString()) {
				count--;
			}
		});
		return new cNumber(count);
	};
cArea.prototype.foreach = function ( action ) {
    var r = this.getRange();
    if ( r ) {
        r._foreach2( action );
    }
};
	cArea.prototype.foreach2 = function (action) {
		var t = this, r = this.getRange();
		if (r) {
			r._foreach2(function (cell) {
				action(checkTypeCell(cell), cell);
			});
		}
	};
	cArea.prototype.getMatrix = function () {
		var t = this, arr = [], r = this.getRange();
		r._foreach2(function (cell, i, j, r1, c1) {
			if (!arr[i - r1]) {
				arr[i - r1] = [];
			}
			arr[i - r1][j - c1] = checkTypeCell(cell);
		});
		return arr;
	};
	cArea.prototype.getValuesNoEmpty = function () {
		var t = this, arr = [], r = this.getRange();
		r._foreachNoEmpty(function (cell) {
			arr.push(checkTypeCell(cell));
		});
		return [arr];
	};
cArea.prototype.getRefMatrix = function () {
    var t = this, arr = [], r = this.getRange();
    r._foreach2( function ( cell, i, j, r1, c1 ) {
    if (!arr[i - r1]) {
            arr[i - r1] = [];
    }
    if (cell) {
        arr[i - r1][j - c1] = new cRef( cell.getName(), t.ws );
    } else {
            arr[i - r1][j - c1] = new cRef( t.ws._getCell( i, j ).getName(), t.ws );
    }
    } );
    return arr;
};
cArea.prototype.index = function ( r, c ) {
    var bbox = this.getBBox0();
    bbox.normalize();
    var box = {c1: 1, c2: bbox.c2 - bbox.c1 + 1, r1: 1, r2: bbox.r2 - bbox.r1 + 1};

    if ( r < box.r1 || r > box.r2 || c < box.c1 || c > box.c2 ) {
        return new cError( cErrorType.bad_reference );
    }
};

/** @constructor */
function cArea3D( val, wsFrom, wsTo, wb ) {/*Area3D means "Sheat1!A1:E5" for example*/
    this.constructor.call( this, val, cElementType.cellsRange3D );

	this._wb = wb;
	this.bbox = null;
	if (val) {
		var bbox = AscCommonExcel.g_oRangeCache.getAscRange(val);
		if (null != bbox) {
			this.bbox = bbox.clone();
		}
	}
	this.wsFrom = this._wb.getWorksheetByName( wsFrom ).getId();
	this.wsTo = this._wb.getWorksheetByName( wsTo ).getId();
}

cArea3D.prototype = Object.create( cBaseType.prototype );
cArea3D.prototype.clone = function (opt_ws) {
	var wsFrom = this._wb.getWorksheetById(this.wsFrom).getName();
	var wsTo = this._wb.getWorksheetById(this.wsTo).getName();
	var wb = opt_ws ? opt_ws.workbook : this._wb;
	var oRes = new cArea3D(null, wsFrom, wsTo, wb);
//	cBaseType.prototype.cloneTo.call( this, oRes );
	this.constructor.prototype.cloneTo.call(this, oRes);
	if (this.bbox) {
		oRes.bbox = this.bbox.clone();
	}
	return oRes;
};
cArea3D.prototype.wsRange = function () {
    if ( !this.wsTo ) {
        this.wsTo = this.wsFrom;
    }
  var wsF = this._wb.getWorksheetById(this.wsFrom).getIndex(), wsL = this._wb.getWorksheetById(this.wsTo)
    .getIndex(), r = [];
    for ( var i = wsF; i <= wsL; i++ ) {
        r.push( this._wb.getWorksheet( i ) );
    }
    return r;
};
	cArea3D.prototype.range = function (wsRange) {
		if (!wsRange) {
			return [null];
		}
		var r = [];
		for (var i = 0; i < wsRange.length; i++) {
			if (!wsRange[i]) {
				r.push(null);
			} else {
				r.push(AscCommonExcel.Range.prototype.createFromBBox(wsRange[i], this.bbox));
			}
		}
		return r;
	};
cArea3D.prototype.getRange = function () {
    return this.range( this.wsRange() );
};
	cArea3D.prototype.getValue = function () {
		var i, _wsA = this.wsRange();
		var _val = [];
		if (_wsA.length < 1) {
			_val.push(new cError(cErrorType.bad_reference));
			return _val;
		}
		for (i = 0; i < _wsA.length; i++) {
			if (!_wsA[i]) {
				_val.push(new cError(cErrorType.bad_reference));
				return _val;
			}

		}
		var _r = this.range(_wsA);
		for (i = 0; i < _r.length; i++) {
			if (!_r[i]) {
				_val.push(new cError(cErrorType.bad_reference));
				return _val;
			}
			_r[i]._foreachNoEmpty(function (cell) {
				_val.push(checkTypeCell(cell));
			});
		}
		return _val;
	};
	cArea3D.prototype.getValue2 = function (cell) {
		var _wsA = this.wsRange(), _val = [], _r;
		if (_wsA.length < 1) {
			_val.push(new cError(cErrorType.bad_reference));
			return _val;
		}
		for (var i = 0; i < _wsA.length; i++) {
			if (!_wsA[i]) {
				_val.push(new cError(cErrorType.bad_reference));
				return _val;
			}

		}
		_r = this.range(_wsA);
		if (!_r[0]) {
			_val.push(new cError(cErrorType.bad_reference));
			return _val;
		}
		_r[0]._foreachNoEmpty(function (_cell) {
			if (cell.getID() === _cell.getName()) {
				_val.push(checkTypeCell(_cell));
			}
		});

		return (null == _val[0]) ? new cEmpty() : _val[0];
	};
	cArea3D.prototype.changeSheet = function (lastName, newName) {
		var wsLast = this._wb.getWorksheetByName(lastName);
		var wsNew = this._wb.getWorksheetByName(newName);
		if(wsLast && wsNew){
			var sheetIdLast = wsLast.getId();
			var sheetIdNew = wsNew.getId();
			if(this.wsFrom === sheetIdLast){
				this.wsFrom = sheetIdNew;
			}
			if(this.wsTo === sheetIdLast){
				this.wsTo = sheetIdNew;
			}
		}
	};
cArea3D.prototype.toString = function () {
	var wsFrom = this._wb.getWorksheetById(this.wsFrom).getName();
	var wsTo = this._wb.getWorksheetById(this.wsTo).getName();
	var name = this.bbox ? this.bbox.getName() : this.value;
    return parserHelp.get3DRef( wsFrom !== wsTo ? wsFrom + ':' + wsTo : wsFrom, name );
};
cArea3D.prototype.tocNumber = function () {
    return this.getValue()[0].tocNumber();
};
cArea3D.prototype.tocString = function () {
    return this.getValue()[0].tocString();
};
cArea3D.prototype.tocBool = function () {
    return this.getValue()[0].tocBool();
};
cArea3D.prototype.tocArea = function () {
    var wsR = this.wsRange();
    if ( wsR.length == 1 ) {
        return new cArea( this.value, wsR[0] );
    }
    return false;
};
cArea3D.prototype.getWS = function () {
    return this.wsRange()[0];
};
cArea3D.prototype.cross = function ( arg, wsID ) {
    if ( this.wsFrom !== this.wsTo ) {
        return new cError( cErrorType.wrong_value_type );
    }
    /*if ( this.wsFrom !== wsID ) {
        return new cError( cErrorType.wrong_value_type );
    }*/
    var r = this.getRange();
    if ( !r ) {
        return new cError( cErrorType.wrong_name );
    }
    var cross = r[0].cross( arg );
    if ( cross ) {
        if ( cross.r != undefined ) {
            return this.getValue2( new CellAddress( cross.r, this.getBBox().c1 ) );
    } else if (cross.c != undefined) {
            return this.getValue2( new CellAddress( this.getBBox().r1, cross.c ) );
    } else {
            return new cError( cErrorType.wrong_value_type );
        }
  } else {
        return new cError( cErrorType.wrong_value_type );
    }
};
cArea3D.prototype.getBBox = function () {
    return this.getRange()[0].getBBox();
};
cArea3D.prototype.getBBox0 = function () {
    return this.getRange()[0].getBBox0();
};
cArea3D.prototype.isValid = function () {
    var r = this.getRange();
    for ( var i = 0; i < r.length; i++ ) {
        if ( !r[i] ) {
            return false;
        }
    }
    return true;
};
	cArea3D.prototype.countCells = function () {
		var _wsA = this.wsRange();
		var _val = [];
		if (_wsA.length < 1) {
			_val.push(new cError(cErrorType.bad_reference));
			return _val;
		}
		var i;
		for (i = 0; i < _wsA.length; i++) {
			if (!_wsA[i]) {
				_val.push(new cError(cErrorType.bad_reference));
				return _val;
			}

		}
		var _r = this.range(_wsA), bbox = _r[0].bbox, count = (Math.abs(bbox.c1 - bbox.c2) + 1) *
			(Math.abs(bbox.r1 - bbox.r2) + 1);
		count = _r.length * count;
		for (i = 0; i < _r.length; i++) {
			_r[i]._foreachNoEmpty(function (cell) {
				if (!cell || !cell.isEmptyTextString()) {
					count--;
				}
			});
		}
		return new cNumber(count);
	};
	cArea3D.prototype.getMatrix = function () {
		var arr = [], r = this.getRange(), res;
		for (var k = 0; k < r.length; k++) {
			arr[k] = [];
			r[k]._foreach2(function (cell, i, j, r1, c1) {
				if (!arr[k][i - r1]) {
					arr[k][i - r1] = [];
				}
				res = checkTypeCell(cell);

				arr[k][i - r1][j - c1] = res;
			});
		}
		return arr;
	};
	cArea3D.prototype.foreach2 = function (action) {
		var _wsA = this.wsRange();
		if (_wsA.length >= 1) {
			var _r = this.range(_wsA);
			for (var i = 0; i < _r.length; i++) {
				if (_r[i]) {
					_r[i]._foreach2(function (cell) {
						action(checkTypeCell(cell));
					});
				}
			}
		}
	};
	cArea3D.prototype.isSingleSheet = function () {
		return this.wsFrom == this.wsTo;
	};

/** @constructor */
function cRef( val, ws ) {/*Ref means A1 for example*/
    this.constructor.call( this, val, cElementType.cell );

    this.ws = ws;
	this.range = null;
	if (val) {
		this.range = ws.getRange2(val.replace(AscCommon.rx_space_g, ""));
	}
}

cRef.prototype = Object.create( cBaseType.prototype );
cRef.prototype.clone = function (opt_ws) {
	var ws = opt_ws ? opt_ws : this.ws;
	var oRes = new cRef(null, ws);
//	cBaseType.prototype.cloneTo.call( this, oRes );
	this.constructor.prototype.cloneTo.call(this, oRes);
	if (this.range) {
		oRes.range = this.range.clone(ws);
	}
	return oRes;
};
cRef.prototype.getWsId = function () {
    return this.ws.Id;
};
	cRef.prototype.getValue = function () {
		if (!this.isValid()) {
			return new cError(cErrorType.bad_reference);
		}
		return checkTypeCell(this.range);
	};
cRef.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef.prototype.tocString = function () {
    return this.getValue().tocString();
    /* new cString(""+this.range.getValueWithFormat()); */
};
cRef.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef.prototype.toString = function () {
    return this.value;
};
cRef.prototype.getRange = function () {
    return this.range;
};
cRef.prototype.getWS = function () {
    return this.ws;
};
cRef.prototype.isValid = function () {
	return !!this.getRange();
};
cRef.prototype.getMatrix = function () {
  return [[this.getValue()]];
};
cRef.prototype.getBBox0 = function () {
    return this.getRange().getBBox0();
};

/** @constructor */
function cRef3D( val, _wsFrom, wb ) {/*Ref means Sheat1!A1 for example*/
    this.constructor.call( this, val, cElementType.cell3D );
	this.ws = null;
	if (_wsFrom) {
		this.ws = wb.getWorksheetByName(_wsFrom);
	}
	this.range = null;
	if (val && this.ws) {
		this.range = this.ws.getRange2(val);
	}
}

cRef3D.prototype = Object.create( cBaseType.prototype );
cRef3D.prototype.clone = function (opt_ws) {
	var ws = opt_ws ? opt_ws : this.ws;
	var wb = ws.workbook;
	var oRes = new cRef3D(null, null, wb);
//	cBaseType.prototype.cloneTo.call( this, oRes );
	this.constructor.prototype.cloneTo.call(this, oRes);
	if (opt_ws && this.ws.getName() == opt_ws.getName()) {
		oRes.ws = opt_ws;
	} else {
		oRes.ws = this.ws;
	}
	if (this.range) {
		oRes.range = this.range.clone(ws);
	}
	return oRes;
};
cRef3D.prototype.getWsId = function () {
    return this.ws.Id;
};
cRef3D.prototype.getRange = function () {
	return this.range;
};
cRef3D.prototype.isValid = function () {
    return !!this.getRange();
};
	cRef3D.prototype.getValue = function () {
		var _r = this.getRange();
		if (!_r) {
			return new cError(cErrorType.bad_reference);
		}
		return checkTypeCell(_r);
	};
cRef3D.prototype.tocBool = function () {
    return this.getValue().tocBool();
};
cRef3D.prototype.tocNumber = function () {
    return this.getValue().tocNumber();
};
cRef3D.prototype.tocString = function () {
    return this.getValue().tocString();
};
cRef3D.prototype.changeSheet = function ( lastName, newName ) {
    if ( this.ws.getName() === lastName ) {
        this.ws = this.ws.workbook.getWorksheetByName( newName );
    }
};
cRef3D.prototype.toString = function () {
	return parserHelp.get3DRef(this.ws.getName(), this.value);
};
cRef3D.prototype.getWS = function () {
    return this.ws;
};
cRef3D.prototype.getBBox0 = function () {
    var range = this.getRange();
    if ( range ) {
        return range.getBBox0();
    }
    return null;
};

/** @constructor */
function cEmpty() {
    this.constructor.call( this, "", cElementType.empty );
}

cEmpty.prototype = Object.create( cBaseType.prototype );
cEmpty.prototype.tocNumber = function () {
    return new cNumber( 0 );
};
cEmpty.prototype.tocBool = function () {
    return new cBool( false );
};
cEmpty.prototype.tocString = function () {
    return new cString( "" );
};
cEmpty.prototype.toString = function () {
    return "";
};

/** @constructor */
function cName( val, wb, ws ) {
    this.constructor.call( this, val, cElementType.name );
    this.wb = wb;
    this.ws = ws;
}

cName.prototype = Object.create( cBaseType.prototype );
	cName.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var wb = ws.workbook;
		var oRes = new cName(this.value, wb, ws);
		this.constructor.prototype.cloneTo.call( this, oRes );
		return oRes;
	};
cName.prototype.toRef = function () {
	var defName = this.getDefName();
    if ( !defName || !defName.ref ) {
        return new cError( cErrorType.wrong_name );
    }

    var _3DRefTmp, ref = defName.ref, _wsFrom, _wsTo;

    if ( ref && (_3DRefTmp = parserHelp.is3DRef( ref, 0 ))[0] ) {
        _wsFrom = _3DRefTmp[1];
        _wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) ) ? _3DRefTmp[2] : _wsFrom;
        if ( parserHelp.isArea( ref, ref.indexOf( "!" ) + 1 ) ) {
            if ( _wsFrom === _wsTo ) {
                return new cArea( parserHelp.operand_str, this.wb.getWorksheetByName( _wsFrom ) );
      } else {
                return new cArea3D( parserHelp.operand_str, _wsFrom, _wsTo, this.wb );
            }
    } else if (parserHelp.isRef(ref, ref.indexOf("!") + 1)) {
            return new cRef3D( parserHelp.operand_str, _wsFrom, this.wb );
        }
    }
    return new cError( cErrorType.wrong_name );
};
cName.prototype.toString = function () {
	var defName = this.getDefName();
    if ( defName ) {
        return defName.name;
  } else {
        return this.value;
    }
};
cName.prototype.getValue = function () {
    return this.Calculate();
};
cName.prototype.Calculate = function () {
	var defName = this.getDefName();
    if ( !defName || !defName.ref ) {
        return new cError( cErrorType.wrong_name );
    }

    if ( !defName.parsedRef ) {
        return new cError( cErrorType.wrong_name );
    }
	//defName not linked to cell, use inherit range
	var r1 = arguments[1];
    return defName.parsedRef.calculate( this , r1);

};
	cName.prototype.getDefName = function () {
		return this.wb.getDefinesNames( this.value, this.ws ? this.ws.getId() : null );
	};
	cName.prototype.changeDefName = function (from, to) {
		var LocalSheetId = this.ws ? this.ws.getIndex() : null;
		if (AscCommonExcel.getDefNameIndex(this.value) == AscCommonExcel.getDefNameIndex(from.Name) &&
			(null == from.LocalSheetId || LocalSheetId == from.LocalSheetId )) {
			this.value = to.Name;
		}
	};

/** @constructor */
function cStrucTable( val, wb, ws ) {
    this.constructor.call( this, val[0], cElementType.table );
    this.wb = wb;
    this.ws = ws;
    this.tableName = val['tableName'];
    this.reservedColumn = null;
    this.isDynamic = false;//#This row
    this.area = null;
    this.val = val;
	var ret = this._createArea( val, null );
	return (ret && ret.type != cElementType.error) ? this : ret;
}

cStrucTable.prototype = Object.create( cBaseType.prototype );
	cStrucTable.prototype.clone = function(opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var wb = ws.workbook;
		var oRes = new cStrucTable(this.val, wb, ws);
		this.constructor.prototype.cloneTo.call(this, oRes);
		return oRes;
	};
cStrucTable.prototype.toRef = function (opt_bbox) {
	//opt_bbox usefull only for #This row
	//case null == opt_bbox works like FormulaTablePartInfo.data
	var table = this.wb.getDefinesNames( this.tableName, this.ws ? this.ws.getId() : null );
	if ( !table || !table.ref ) {
		return new cError( cErrorType.wrong_name );
	}
    if(!this.area || this.isDynamic){
        this._createArea( this.val, opt_bbox );
    }
    return this.area;
};
cStrucTable.prototype.toString = function () {
	return this._toString(false);
};
cStrucTable.prototype.toLocaleString = function () {
	return this._toString(true);
};
	cStrucTable.prototype._toString = function(isLocal) {
		var tblStr, columns_1, columns_2;
		var table = this.wb.getDefinesNames(this.tableName, this.ws ? this.ws.getId() : null);
		if (!table) {
			if (!this.tableName) {
				if (isLocal) {
					return this.value.replace("[]", "");
				} else {
					//do not replace [] becase 'Table1[]' - right, 'Table1' - wrong
					return this.value;
				}
			} else {
				tblStr = this.tableName;
			}
		} else {
			tblStr = table.name;
		}

		(!isLocal || this.columnName) ? tblStr += "[%1]" : null;
		if (this.oneColumn) {

			columns_1 = this.wb.getTableNameColumnByIndex(this.tableName, this.oneColumnIndex.index);
			if (columns_1) {
				this.oneColumn = columns_1.columnName;
			} else if (this.oneColumnIndex.name) {
				this.oneColumn = this.oneColumnIndex.name;
			}

			return tblStr.replace("%1", this.oneColumn.replace(/#/g, "'#"));
		}
		if (this.columnRange) {
			columns_1 = this.wb.getTableNameColumnByIndex(this.tableName, this.colStartIndex.index);
			columns_2 = this.wb.getTableNameColumnByIndex(this.tableName, this.colEndIndex.index);
			if (columns_1) {
				this.colStart = columns_1.columnName
			} else if (this.colStartIndex.name) {
				this.colStart = this.colStartIndex.name;
			}
			if (columns_2) {
				this.colEnd = columns_2.columnName
			} else if (this.colEndIndex.name) {
				this.colEnd = this.colEndIndex.name;
			}
			var colStart = this.colStart.replace(/#/g, "'#");
			var colEnd = this.colEnd.replace(/#/g, "'#");
			return tblStr.replace("%1", "[" + colStart + "]:[" + colEnd + "]");
		}
		if (this.reservedColumn) {
			return tblStr.replace("%1", this._buildLocalTableString(this.reservedColumnIndex, isLocal));
		}
		if (this.hdt) {
			var re = /\[(.*?)\]/ig, m, data = "", i = 0;
			while (null !== (m = re.exec(this.hdt))) {

				data += "[" + this._buildLocalTableString(this.hdtIndexes[i], isLocal) + "]" +
					FormulaSeparators.functionArgumentSeparatorDef;
			}
			data = data.substr(0, data.length - 1);
			if (this.hdtcstart) {

				columns_1 = this.wb.getTableNameColumnByIndex(this.tableName, this.hdtcstartIndex.index);
				if (columns_1) {
					this.hdtcstart = columns_1.columnName;
				} else if (this.hdtcstartIndex.name) {
					this.hdtcstart = this.hdtcstartIndex.name;
				}

				data += FormulaSeparators.functionArgumentSeparatorDef + "[" + this.hdtcstart.replace(/#/g, "'#") + "]"
			}
			if (this.hdtcend) {

				columns_2 = this.wb.getTableNameColumnByIndex(this.tableName, this.hdtcendIndex.index);
				if (columns_2) {
					this.hdtcend = columns_2.columnName;
				} else if (this.hdtcendIndex.name) {
					this.hdtcend = this.hdtcendIndex.name;
				}

				data += ":[" + this.hdtcend.replace(/#/g, "'#") + "]"
			}
			return tblStr.replace("%1", data);
		}
		if (isLocal) {
			return tblStr.replace("%1", "").replace("[]", "");
		} else {
			//do not replace [] becase 'Table1[]' - right, 'Table1' - wrong
			return tblStr.replace("%1", "");
		}
	};
cStrucTable.prototype._createArea = function ( val, opt_bbox ) {
    this.columnName  = val['columnName'];

    var paramObj = {param: null, startCol: null, endCol: null, cell: opt_bbox, includeColumnHeader:false};

    if ( val['oneColumn'] || val['columnRange'] ) {

        this.oneColumn = val['oneColumn'];
        this.columnRange = val['columnRange'];

    paramObj.param = AscCommon.FormulaTablePartInfo.columns;
        if ( val['columnRange'] ) {
            this.columnRange = val['columnRange'];
            paramObj.startCol = this.colStart = val['colStart'].replace(/'#/g,"#");
            paramObj.endCol = this.colEnd = val['colEnd'].replace(/'#/g,"#");
      if (!this.colEnd) {
				this.colEnd = this.colStart;
      }

			this.colStartIndex = this.wb.getTableIndexColumnByName( this.tableName, this.colStart );
			this.colEndIndex = this.wb.getTableIndexColumnByName( this.tableName, this.colEnd );
			if( !this.colStartIndex && !this.colEndIndex ){
				return this.area =  new cError( cErrorType.bad_reference );
			}
    } else {
            paramObj.startCol = this.oneColumn = val['oneColumn'].replace(/'#/g,"#");
			this.oneColumnIndex = this.wb.getTableIndexColumnByName( this.tableName, this.oneColumn );
			if( !this.oneColumnIndex ){
				return this.area = new cError( cErrorType.bad_reference );
			}
        }

        var tableData = this.wb.getTableRangeForFormula( this.tableName, paramObj );

        if ( !tableData ) {
            return this.area = new cError( cErrorType.bad_reference );
        }
		if( tableData.range ){
			this.area = tableData.range.isOneCell() ?
        new cRef3D(tableData.range.getAbsName(), this.wb.getWorksheetById(tableData.wsID)
          .getName(), this.wb) :
        new cArea3D(tableData.range.getAbsName(), this.wb.getWorksheetById(tableData.wsID)
          .getName(), this.wb.getWorksheetById(tableData.wsID).getName(), this.wb);
		}
  } else if (val['reservedColumn'] || !val['columnName']) {
		this.reservedColumn = val['reservedColumn'] || "";
    this.reservedColumnIndex = paramObj.param = parserHelp.getColumnTypeByName(this.reservedColumn);
        if(AscCommon.FormulaTablePartInfo.thisRow == paramObj.param){
            this.isDynamic = true;
        }

        tableData = this.wb.getTableRangeForFormula( this.tableName, paramObj );
        if ( !tableData ) {
			return this.area = new cError( cErrorType.bad_reference );
        }
		if( tableData.range ){
			this.area = tableData.range.isOneCell() ?
        new cRef3D(tableData.range.getAbsName(), this.wb.getWorksheetById(tableData.wsID)
          .getName(), this.wb) :
        new cArea3D(tableData.range.getAbsName(), this.wb.getWorksheetById(tableData.wsID)
          .getName(), this.wb.getWorksheetById(tableData.wsID).getName(), this.wb);
		}
  } else if (val['hdtcc']) {
        this.hdt = val['hdt'];
		this.hdtIndexes = [];
		this.hdtcstart = val['hdtcstart'];
        this.hdtcend = val['hdtcend'];
        var re = /\[(.*?)\]/ig, m, data, range;
        while ( null !== (m = re.exec( this.hdt )) ) {
      paramObj.param = parserHelp.getColumnTypeByName(m[1]);
            if(AscCommon.FormulaTablePartInfo.thisRow == paramObj.param){
                this.isDynamic = true;
            }
			this.hdtIndexes.push(paramObj.param);
            data = this.wb.getTableRangeForFormula( this.tableName, paramObj );

            if ( !data ) {
				return this.area = new cError( cErrorType.bad_reference );
            }

            if ( range ) {
                range.union2( data.range );
      } else {
                range = data.range;
            }
        }

        if ( this.hdtcstart ) {
			this.hdtcstart = this.hdtcstart.replace(/'#/g,"#");
      paramObj.param = AscCommon.FormulaTablePartInfo.columns;
            paramObj.startCol = this.hdtcstart;
            paramObj.endCol = null;
			this.hdtcstartIndex = this.wb.getTableIndexColumnByName( this.tableName, this.hdtcstart );

			if( !this.hdtcstartIndex ){
				return this.area =  new cError( cErrorType.bad_reference );
			}

            if ( this.hdtcend ) {
				this.hdtcend = this.hdtcend.replace(/'#/g,"#");
                paramObj.endCol = this.hdtcend;
				this.hdtcendIndex = this.wb.getTableIndexColumnByName( this.tableName, this.hdtcend );

				if( !this.hdtcendIndex ){
					return this.area =  new cError( cErrorType.bad_reference );
				}

            }

          if (range) {
            var _c1 = range.c1 + (this.hdtcstartIndex ? this.hdtcstartIndex.index : 0);
            range = new Asc.Range(_c1, range.r1, this.hdtcendIndex ? range.c1 + this.hdtcendIndex.index : _c1, range.r2);
          } else {
            paramObj.includeColumnHeader = true;
            data = this.wb.getTableRangeForFormula( this.tableName, paramObj );

            if ( !data ) {
              return this.area = new cError( cErrorType.bad_reference );
            }
            range = data.range;
          }
        }

        tableData = data;
        tableData.range = range;
		if( range ){
			this.area = range.isOneCell() ?
				new cRef3D( range.getAbsName(), this.wb.getWorksheetById( tableData.wsID ).getName(), this.wb ):
        new cArea3D(range.getAbsName(), this.wb.getWorksheetById(tableData.wsID)
          .getName(), this.wb.getWorksheetById(tableData.wsID).getName(), this.wb);
		}
    }

    !this.area ? this.area = new cError( cErrorType.bad_reference ) : null;
	return this.area;
};
cStrucTable.prototype._buildLocalTableString = function (reservedColumn,local) {
  return parserHelp.getColumnNameByType(reservedColumn, local);
};

/** @constructor */
function cName3D(val, wb, ws) {
	cName.call( this, val, wb, ws );
	this.type = cElementType.name3D;
}
cName3D.prototype = Object.create( cName.prototype );
	cName3D.prototype.clone = function (opt_ws) {
		var ws;
		if (opt_ws && opt_ws.getName() === this.ws.getName()) {
			ws = opt_ws;
		} else {
			ws = this.ws;
		}
		var wb = ws.workbook;
		var oRes = new cName3D(this.value, wb, ws);
		this.constructor.prototype.cloneTo.call( this, oRes );
		return oRes;
	};
	cName3D.prototype.changeSheet = function ( lastName, newName ) {
		if ( this.ws.getName() === lastName ) {
			this.ws = this.wb.getWorksheetByName( newName );
		}
	};
cName3D.prototype.toString = function () {
	return parserHelp.getEscapeSheetName( this.ws.getName() ) + "!" + this.constructor.prototype.toString.call(this);
};

/** @constructor */
function cArray() {
    this.constructor.call( this, undefined, cElementType.array );
    this.array = [];
    this.rowCount = 0;
    this.countElementInRow = [];
    this.countElement = 0;
}

cArray.prototype = Object.create( cBaseType.prototype );
cArray.prototype.addRow = function () {
    this.array[this.array.length] = [];
    this.countElementInRow[this.rowCount++] = 0;
};
cArray.prototype.addElement = function ( element ) {
    if ( this.array.length === 0 ) {
        this.addRow();
    }
  var arr = this.array, subArr = arr[this.rowCount - 1];
    subArr[subArr.length] = element;
    this.countElementInRow[this.rowCount - 1]++;
    this.countElement++;
};
cArray.prototype.getRow = function ( rowIndex ) {
    if ( rowIndex < 0 || rowIndex > this.array.length - 1 ) {
        return null;
    }
    return this.array[rowIndex];
};
cArray.prototype.getCol = function ( colIndex ) {
    var col = [];
    for ( var i = 0; i < this.rowCount; i++ ) {
        col.push( this.array[i][colIndex] );
    }
    return col;
};
cArray.prototype.getElementRowCol = function ( row, col ) {
    if ( row > this.rowCount || col > this.getCountElementInRow() ) {
        return new cError( cErrorType.not_available );
    }
    return this.array[row][col];
};
cArray.prototype.getElement = function ( index ) {
    for ( var i = 0; i < this.rowCount; i++ ) {
        if ( index > this.countElementInRow[i].length ) {
            index -= this.countElementInRow[i].length;
    } else {
            return this.array[i][index];
        }
    }
    return null;
};
cArray.prototype.foreach = function ( action ) {
    if ( typeof (action) !== 'function' ) {
        return true;
    }
    for ( var ir = 0; ir < this.rowCount; ir++ ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            if ( action.call( this, this.array[ir][ic], ir, ic ) ) {
                return true;
            }
        }
    }
    return undefined;
};
cArray.prototype.getCountElement = function () {
    return this.countElement;
};
cArray.prototype.getCountElementInRow = function () {
    return this.countElementInRow[0];
};
cArray.prototype.getRowCount = function () {
    return this.rowCount;
};
cArray.prototype.tocNumber = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocNumber() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocString = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocString() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.tocBool = function () {
    var retArr = new cArray();
    for ( var ir = 0; ir < this.rowCount; ir++, retArr.addRow() ) {
        for ( var ic = 0; ic < this.countElementInRow[ir]; ic++ ) {
            retArr.addElement( this.array[ir][ic].tocBool() );
        }
        if ( ir === this.rowCount - 1 ) {
            break;
        }
    }
    return retArr;
};
cArray.prototype.toString = function () {
    var ret = "";
  for (var ir = 0; ir < this.rowCount; ir++, ret += FormulaSeparators.arrayRowSeparatorDef) {
    for (var ic = 0; ic < this.countElementInRow[ir]; ic++, ret += FormulaSeparators.arrayColSeparatorDef) {
            if ( this.array[ir][ic] instanceof cString ) {
                ret += '"' + this.array[ir][ic].toString() + '"';
      } else {
                ret += this.array[ir][ic].toString() + "";
            }
        }
    if (ret[ret.length - 1] === FormulaSeparators.arrayColSeparatorDef) {
            ret = ret.substring( 0, ret.length - 1 );
        }
    }
  if (ret[ret.length - 1] === FormulaSeparators.arrayRowSeparatorDef) {
        ret = ret.substring( 0, ret.length - 1 );
    }
    return "{" + ret + "}";
};
cArray.prototype.toLocaleString = function ( digitDelim ) {
    var ret = "";
  for (var ir = 0; ir < this.rowCount; ir++, ret += digitDelim ? FormulaSeparators.arrayRowSeparator : FormulaSeparators.arrayRowSeparatorDef) {
    for (var ic = 0; ic < this.countElementInRow[ir];
         ic++, ret += digitDelim ? FormulaSeparators.arrayColSeparator : FormulaSeparators.arrayColSeparatorDef) {
            if ( this.array[ir][ic] instanceof cString ) {
                ret += '"' + this.array[ir][ic].toLocaleString( digitDelim ) + '"';
      } else {
                ret += this.array[ir][ic].toLocaleString( digitDelim ) + "";
            }
        }
    if (ret[ret.length - 1] === digitDelim ? FormulaSeparators.arrayColSeparator : FormulaSeparators.arrayColSeparatorDef) {
            ret = ret.substring( 0, ret.length - 1 );
        }
    }
  if (ret[ret.length - 1] === digitDelim ? FormulaSeparators.arrayRowSeparator : FormulaSeparators.arrayRowSeparatorDef) {
        ret = ret.substring( 0, ret.length - 1 );
    }
    return "{" + ret + "}";
};
cArray.prototype.isValidArray = function () {
    if ( this.countElement < 1 ) {
        return false;
    }
    for ( var i = 0; i < this.rowCount - 1; i++ ) {
        if ( this.countElementInRow[i] - this.countElementInRow[i + 1] !== 0 ) {
            return false;
        }
    }
    return true;
};
cArray.prototype.getValue2 = function ( i, j ) {
    var result = this.array[i];
    return result ? result[j] : result;
};
cArray.prototype.getMatrix = function () {
    return this.array;
};
cArray.prototype.fillFromArray = function ( arr ) {
    this.array = arr;
    this.rowCount = arr.length;
    for ( var i = 0; i < arr.length; i++ ) {
        this.countElementInRow[i] = arr[i].length;
        this.countElement += arr[i].length;
    }
};
cArray.prototype.getElementByCell = function ( cellAddress ) {
    if ( this.cellAddress ){
        if( this.countElementInRow == 1 ){
            this.getElementRowCol( cellAddress.getRow0(), 0 );
        }
        if( this.rowCount == 1 ){
            this.getElementRowCol( 0, cellAddress.getCol0() );
        }
  } else {
        return this.getElement( 0 );
    }
};

/** @constructor */
function cUndefined() {
    this.value = undefined;
}
cUndefined.prototype = Object.create( cBaseType.prototype );

	function checkTypeCell(cell) {
		if (cell && !cell.isEmptyText()) {
			var val = cell.getValueWithoutFormat();
			var type = cell.getType();
			if (CellValueType.Number === type) {
				return new cNumber(val - 0);
			} else if (CellValueType.Bool === type) {
				return new cBool(val);
			} else if (CellValueType.Error === type) {
				return new cError(val);
			} else {
				return new cString(val);
			}
		} else {
			return new cEmpty();
		}
	}

  /*--------------------------------------------------------------------------*/
  /*Base classes for operators & functions */
  /** @constructor */
  function cBaseOperator(name, priority, argumentCount) {
    this.name = name ? name : '';
    this.priority = (priority !== undefined) ? priority : 10;
    this.type = cElementType.operator;
    this.isRightAssociative = false;
    this.argumentsCurrent = (argumentCount !== undefined) ? argumentCount : 2;
    this.value = null;
    this.formatType = {
      def: -1, //подразумевается формат первой ячейки входящей в формулу.
      noneFormat: -2
    };
    this.numFormat = this.formatType.def;
  }

  cBaseOperator.prototype.getArguments = function () {
    return this.argumentsCurrent;
  };
  cBaseOperator.prototype.toString = function () {
    return this.name;
  };
  cBaseOperator.prototype.Calculate = function () {
    return null;
  };
  cBaseOperator.prototype.Assemble = function (arg) {
    var str = "";
    if (this.argumentsCurrent === 2) {
      str = arg[0] + "" + this.name + "" + arg[1];
    } else {
      str = this.name + "" + arg[0];
    }
    return new cString(str);
  };
  cBaseOperator.prototype.Assemble2 = function (arg, start, count) {
    var str = "";
    if (this.argumentsCurrent === 2) {
      str += arg[start + count - 2] + this.name + arg[start + count - 1];
    } else {
      str += this.name + arg[start];
    }
    return new cString(str);
  };
  cBaseOperator.prototype.Assemble2Locale = function (arg, start, count, locale, digitDelim) {
    var str = "";
    if (this.argumentsCurrent === 2) {
      str += arg[start + count - 2].toLocaleString(digitDelim) + this.name +
        arg[start + count - 1].toLocaleString(digitDelim);
    } else {
      str += this.name + arg[start];
    }
    return new cString(str);
  };

  /** @constructor */
  function cBaseFunction(name, argMin, argMax) {
    this.name = name;
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = argMin ? argMin : 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = argMax ? argMax : 255;
    this.formatType = {
      def: -1, //подразумевается формат первой ячейки входящей в формулу.
      noneFormat: -2
    };
    this.numFormat = this.formatType.def;
//    this.isXLFN = rx_sFuncPref.test(this.name);
  }
  cBaseFunction.prototype.Calculate = function () {
    this.value = new cError(cErrorType.wrong_name);
    return this.value;
  };
  cBaseFunction.prototype.setArgumentsMin = function (count) {
    this.argumentsMin = count;
  };
  cBaseFunction.prototype.setArgumentsMax = function (count) {
    this.argumentsMax = count;
  };
  cBaseFunction.prototype.DecrementArguments = function () {
    --this.argumentsCurrent;
  };
  cBaseFunction.prototype.IncrementArguments = function () {
    ++this.argumentsCurrent;
  };
  cBaseFunction.prototype.setName = function (name) {
    this.name = name;
  };
  cBaseFunction.prototype.setArgumentsCount = function (count) {
    this.argumentsCurrent = count;
  };
  cBaseFunction.prototype.getArguments = function () {
    return this.argumentsCurrent;
  };
  cBaseFunction.prototype.getMaxArguments = function () {
    return this.argumentsMax;
  };
  cBaseFunction.prototype.getMinArguments = function () {
    return this.argumentsMin;
  };
  cBaseFunction.prototype.Assemble = function (arg) {
    var str = "";
    for (var i = 0; i < arg.length; i++) {
      str += arg[i].toString();
      if (i !== arg.length - 1) {
        str += ",";
      }
    }
    if (this.isXLFN) {
      return new cString("_xlfn." + this.name + "(" + str + ")");
    }
    return new cString(this.toString() + "(" + str + ")");
  };
  cBaseFunction.prototype.Assemble2 = function (arg, start, count) {

    var str = "", c = start + count - 1;
    for (var i = start; i <= c; i++) {
      str += arg[i].toString();
      if (i !== c) {
        str += ",";
      }
    }
    if (this.isXLFN) {
      return new cString("_xlfn." + this.name + "(" + str + ")");
    }
    return new cString(this.toString() + "(" + str + ")");
  };
  cBaseFunction.prototype.Assemble2Locale = function (arg, start, count, locale, digitDelim) {

    var name = this.toString(), str = "", c = start + count - 1, localeName = locale ? locale[name] : name;

    localeName = localeName || this.toString();
    for (var i = start; i <= c; i++) {
      str += arg[i].toLocaleString(digitDelim);
      if (i !== c) {
        str += FormulaSeparators.functionArgumentSeparator;
      }
    }
    return new cString(localeName + "(" + str + ")");
  };
  cBaseFunction.prototype.toString = function () {
    return this.name.replace(rx_sFuncPref, "_xlfn.");
  };
  cBaseFunction.prototype.setCA = function (arg, ca, numFormat) {
    this.value = arg;
    if (ca) {
      this.value.ca = true;
    }
    if (numFormat !== null && numFormat !== undefined) {
      this.value.numFormat = numFormat;
    }
    return this.value;
  };
  cBaseFunction.prototype.setFormat = function (f) {
    this.numFormat = f;
  };
  cBaseFunction.prototype.checkArguments = function () {
    return this.argumentsMin <= this.argumentsCurrent && this.argumentsCurrent <= this.argumentsMax;
  };

/** @constructor */
function parentLeft() {
    this.name = "(";
    this.type = cElementType.operator;
    this.argumentsCurrent = 1;
}

parentLeft.prototype.constructor = parentLeft;
parentLeft.prototype.DecrementArguments = function () {
    --this.argumentsCurrent;
};
parentLeft.prototype.IncrementArguments = function () {
    ++this.argumentsCurrent;
};
parentLeft.prototype.toString = function () {
    return this.name;
};
parentLeft.prototype.getArguments = function () {
    return this.argumentsCurrent;
};
parentLeft.prototype.Assemble = function ( arg ) {
    return new cString( "(" + arg + ")" );
};
parentLeft.prototype.Assemble2 = function ( arg, start, count ) {
    return new cString( "(" + arg[start + count - 1] + ")" );
};
parentLeft.prototype.Assemble2Locale = function ( arg, start, count ) {
    return this.Assemble2( arg, start, count );
};

/** @constructor */
function parentRight() {
    this.name = ")";
    this.type = cElementType.operator;
}

parentRight.prototype.constructor = parentRight;
parentRight.prototype.toString = function () {
    return this.name;
};

/** @constructor */
function cRangeUnionOperator() {
    cBaseOperator.apply( this, [':', 50, 2] );
}

cRangeUnionOperator.prototype = Object.create( cBaseOperator.prototype );
cRangeUnionOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], wsId0, wsId1, wb, ws;
  if (( arg0 instanceof cRef || arg0 instanceof cArea || arg0 instanceof cRef3D ||
    arg0 instanceof cArea3D && (wsId0 = arg0.wsFrom) == arg0.wsTo ) &&
    ( arg1 instanceof cRef || arg1 instanceof cArea || arg1 instanceof cRef3D ||
    arg1 instanceof cArea3D && (wsId1 = arg1.wsFrom) == arg1.wsTo )) {

        if ( arg0 instanceof cArea3D ) {
            wsId0 = arg0.wsFrom;
            ws = arg0.getWS();
    } else {
            wsId0 = arg0.ws.getId();
            ws = arg0.getWS();
        }

        if ( arg1 instanceof cArea3D ) {
            wsId1 = arg1.wsFrom;
            ws = arg1.getWS();
    } else {
            wsId1 = arg1.ws.getId();
            ws = arg1.getWS();
        }

        if ( wsId0 != wsId1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }

        arg0 = arg0.getBBox0();
        arg1 = arg1.getBBox0();
        if ( !arg0 || !arg1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }
        arg0 = arg0.union( arg1 );
        arg0.normalize( true );

    if (arg0.isOneCell()) {
			this.value = new cRef( arg0.getName(), ws );
    } else {
			this.value = new cArea( arg0.getName(), ws );
    }

        this.value = new cArea( arg0.getName(), ws );

  } else {
        return this.value = new cError( cErrorType.wrong_value_type );
    }

    return this.value;
};

/** @constructor */
function cRangeIntersectionOperator() {
    cBaseOperator.apply( this, [' ', 50, 2] );
}

cRangeIntersectionOperator.prototype = Object.create( cBaseOperator.prototype );
cRangeIntersectionOperator.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], wsId0, wsId1, wb, ws;
  if (( arg0 instanceof cRef || arg0 instanceof cArea || arg0 instanceof cRef3D ||
    arg0 instanceof cArea3D && (wsId0 = arg0.wsFrom) == arg0.wsTo ) &&
    ( arg1 instanceof cRef || arg1 instanceof cArea || arg1 instanceof cRef3D ||
    arg1 instanceof cArea3D && (wsId1 = arg1.wsFrom) == arg1.wsTo )) {

        if ( arg0 instanceof cArea3D ) {
            wsId0 = arg0.wsFrom;
            ws = arg0.getWS();
    } else {
            wsId0 = arg0.ws.getId();
            ws = arg0.getWS();
        }

        if ( arg1 instanceof cArea3D ) {
            wsId1 = arg1.wsFrom;
            ws = arg1.getWS();
    } else {
            wsId1 = arg1.ws.getId();
            ws = arg1.getWS();
        }

        if ( wsId0 != wsId1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }

        arg0 = arg0.getBBox0();
        arg1 = arg1.getBBox0();
        if ( !arg0 || !arg1 ) {
            return this.value = new cError( cErrorType.wrong_value_type );
        }
        arg0 = arg0.intersection( arg1 );
		if( arg0 ){
        	arg0.normalize( true );
      if (arg0.isOneCell()) {
				this.value = new cRef( arg0.getName(), ws );
      } else {
				this.value = new cArea( arg0.getName(), ws );
		}
    } else {
			return this.value = new cError( cErrorType.null_value );
    }

  } else {
        return this.value = new cError( cErrorType.wrong_value_type );
    }

    return this.value;
};


	/** @constructor */
	function cUnarMinusOperator() {
		cBaseOperator.apply(this, ['un_minus'/**name operator*/, 49/**priority of operator*/, 1/**count arguments*/]);
		this.isRightAssociative = true;
	}

	cUnarMinusOperator.prototype = Object.create(cBaseOperator.prototype);
	cUnarMinusOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (arrElem, r, c) {
				arrElem = arrElem.tocNumber();
				arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(-arrElem.getValue());
			});
			return this.value = arg0;
		}
		arg0 = arg0.tocNumber();
		return this.value = arg0 instanceof cError ? arg0 : new cNumber(-arg0.getValue());
	};
	cUnarMinusOperator.prototype.toString = function () {        // toString function
		return '-';
	};
	cUnarMinusOperator.prototype.Assemble = function (arg) {
		return new cString("-" + arg[0]);
	};
	cUnarMinusOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString("-" + arg[start + count - 1]);
	};
	cUnarMinusOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString("-" + arg[start + count - 1]);
	};

	/** @constructor */
	function cUnarPlusOperator() {
		cBaseOperator.apply(this, ['un_plus', 49, 1]);
		this.isRightAssociative = true;
	}

	cUnarPlusOperator.prototype = Object.create(cBaseOperator.prototype);
	cUnarPlusOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		return this.value = arg0;
	};
	cUnarPlusOperator.prototype.toString = function () {
		return '+';
	};
	cUnarPlusOperator.prototype.Assemble = function (arg) {
		return new cString("+" + arg[0]);
	};
	cUnarPlusOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString("+" + arg[start + count - 1]);
	};
	cUnarPlusOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString("+" + arg[start + count - 1]);
	};

	/** @constructor */
	function cAddOperator() {
		cBaseOperator.apply(this, ['+', 20]);
	}

	cAddOperator.prototype = Object.create(cBaseOperator.prototype);
	cAddOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "+", arguments[1].first);
	};

	/** @constructor */
	function cMinusOperator() {
		cBaseOperator.apply(this, ['-', 20]);
	}

	cMinusOperator.prototype = Object.create(cBaseOperator.prototype);
	cMinusOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "-", arguments[1].first);
	};

	/** @constructor */
	function cPercentOperator() {
		cBaseOperator.apply(this, ['%', 45, 1]);
		this.isRightAssociative = true;
	}

	cPercentOperator.prototype = Object.create(cBaseOperator.prototype);
	cPercentOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (arrElem, r, c) {
				arrElem = arrElem.tocNumber();
				arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(arrElem.getValue() / 100);
			});
			return this.value = arg0;
		}
		arg0 = arg0.tocNumber();
		this.value = arg0 instanceof cError ? arg0 : new cNumber(arg0.getValue() / 100);
		this.value.numFormat = 9;
		return this.value;
	};
	cPercentOperator.prototype.Assemble = function (arg) {
		return new cString(arg[0] + this.name);
	};
	cPercentOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString(arg[start + count - 1] + this.name);
	};
	cPercentOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString(arg[start + count - 1] + this.name);
	};

	/** @constructor */
	function cPowOperator() {
		cBaseOperator.apply(this, ['^', 40]);
	}

	cPowOperator.prototype = Object.create(cBaseOperator.prototype);
	cPowOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		}
		arg0 = arg0.tocNumber();
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		}
		arg1 = arg1.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var _v = Math.pow(arg0.getValue(), arg1.getValue());
		if (isNaN(_v)) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (_v === Number.POSITIVE_INFINITY) {
			return this.value = new cError(cErrorType.division_by_zero);
		}
		return this.value = new cNumber(_v);
	};

	/** @constructor */
	function cMultOperator() {
		cBaseOperator.apply(this, ['*', 30]);
	}

	cMultOperator.prototype = Object.create(cBaseOperator.prototype);
	cMultOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "*", arguments[1].first);
	};

	/** @constructor */
	function cDivOperator() {
		cBaseOperator.apply(this, ['/', 30]);
	}

	cDivOperator.prototype = Object.create(cBaseOperator.prototype);
	cDivOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "/", arguments[1].first);
	};

	/** @constructor */
	function cConcatSTROperator() {
		cBaseOperator.apply(this, ['&', 15]);
	}

	cConcatSTROperator.prototype = Object.create(cBaseOperator.prototype);
	cConcatSTROperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		}
		arg0 = arg0.tocString();
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		}
		arg1 = arg1.tocString();

		return this.value = arg0 instanceof cError ? arg0 :
			arg1 instanceof cError ? arg1 : new cString(arg0.toString().concat(arg1.toString()));
	};

	/** @constructor */
	function cEqualsOperator() {
		cBaseOperator.apply(this, ['=', 10]);
	}

	cEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
	cEqualsOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "=", arguments[1].first);
	};

	/** @constructor */
	function cNotEqualsOperator() {
		cBaseOperator.apply(this, ['<>', 10]);
	}

	cNotEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
	cNotEqualsOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<>", arguments[1].first);
	};

	/** @constructor */
	function cLessOperator() {
		cBaseOperator.apply(this, ['<', 10]);
	}

	cLessOperator.prototype = Object.create(cBaseOperator.prototype);
	cLessOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<", arguments[1].first);
	};

	/** @constructor */
	function cLessOrEqualOperator() {
		cBaseOperator.apply(this, ['<=', 10]);
	}

	cLessOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
	cLessOrEqualOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, "<=", arguments[1].first);
	};

	/** @constructor */
	function cGreaterOperator() {
		cBaseOperator.apply(this, ['>', 10]);
	}

	cGreaterOperator.prototype = Object.create(cBaseOperator.prototype);
	cGreaterOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, ">", arguments[1].first);
	};

	/** @constructor */
	function cGreaterOrEqualOperator() {
		cBaseOperator.apply(this, ['>=', 10]);
	}

	cGreaterOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
	cGreaterOrEqualOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1].first);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].first, arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return this.value = _func[arg0.type][arg1.type](arg0, arg1, ">=", arguments[1].first);
	};

/* cFormulaOperators is container for holding all ECMA-376 operators, see chapter $18.17.2.2 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
var cFormulaOperators = {
    '('       : parentLeft,
    ')'       : parentRight,
    '{'       : function () {
        var r = {};
        r.name = '{';
        r.toString = function () {
            return this.name;
        };
        return r;
    },
    '}'       : function () {
        var r = {};
        r.name = '}';
        r.toString = function () {
            return this.name;
        };
        return r;
  }, /* 50 is highest priority */
    ':'       : cRangeUnionOperator,
    ' '       : cRangeIntersectionOperator,
    'un_minus': cUnarMinusOperator,
    'un_plus' : cUnarPlusOperator,
    '%'       : cPercentOperator,
    '^'       : cPowOperator,
    '*'       : cMultOperator,
    '/'       : cDivOperator,
    '+'       : cAddOperator,
    '-'       : cMinusOperator,
    '&'       : cConcatSTROperator /*concat str*/,
    '='       : cEqualsOperator/*equals*/,
    '<>'      : cNotEqualsOperator,
    '<'       : cLessOperator,
    '<='      : cLessOrEqualOperator,
    '>'       : cGreaterOperator,
    '>='      : cGreaterOrEqualOperator
    /* 10 is lowest priopity */
};

/* cFormulaFunctionGroup is container for holding all ECMA-376 function, see chapter $18.17.7 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
/*
 Каждая формула представляет собой копию функции cBaseFunction.
 Для реализации очередной функции необходимо указать количество (минимальное и максимальное) принимаемых аргументов. Берем в спецификации.
 Также необходино написать реализацию методов Calculate и getInfo(возвращает название функции и вид/количетво аргументов).
 В методе Calculate необходимо отслеживать тип принимаемых аргументов. Для примера, если мы обращаемся к ячейке A1, в которой лежит 123, то этот аргумент будет числом. Если же там лежит "123", то это уже строка. Для более подробной информации смотреть спецификацию.
 Метод getInfo является обязательным, ибо через этот метод в интерфейс передается информация о реализованных функциях.
 */
var cFormulaFunctionGroup = {};
var cFormulaFunction = {};
var cAllFormulaFunction = {};

function getFormulasInfo() {

    var list = [], a, b, f;
    for ( var type in cFormulaFunctionGroup ) {
    b = new AscCommon.asc_CFormulaGroup(type);
        for ( var i = 0; i < cFormulaFunctionGroup[type].length; ++i ) {
            a = new cFormulaFunctionGroup[type][i]();
            if ( a.getInfo ) {
        f = new AscCommon.asc_CFormula(a.getInfo());
                b.asc_addFormulaElement( f );
                cFormulaFunction[f.asc_getName()] = cFormulaFunctionGroup[type][i];
            }
            cAllFormulaFunction[a.name] = cFormulaFunctionGroup[type][i];
        }
        list.push( b );
    }
    return list;
}

/*--------------------------------------------------------------------------*/


var _func = [];//для велосипеда а-ля перегрузка функций.
_func[cElementType.number] = [];
_func[cElementType.string] = [];
_func[cElementType.bool] = [];
_func[cElementType.error] = [];
_func[cElementType.cellsRange] = [];
_func[cElementType.empty] = [];
_func[cElementType.array] = [];
_func[cElementType.cell] = [];


_func[cElementType.number][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > arg1.getValue() );
  } else if (what === ">=") {
        return new cBool( arg0.getValue() >= arg1.getValue() );
  } else if (what === "<") {
        return new cBool( arg0.getValue() < arg1.getValue() );
  } else if (what === "<=") {
        return new cBool( arg0.getValue() <= arg1.getValue() );
  } else if (what === "=") {
        return new cBool( arg0.getValue() === arg1.getValue() );
  } else if (what === "<>") {
        return new cBool( arg0.getValue() !== arg1.getValue() );
  } else if (what === "-") {
        return new cNumber( arg0.getValue() - arg1.getValue() );
  } else if (what === "+") {
        return new cNumber( arg0.getValue() + arg1.getValue() );
  } else if (what === "/") {
        if ( arg1.getValue() !== 0 ) {
            return new cNumber( arg0.getValue() / arg1.getValue() );
    } else {
            return new cError( cErrorType.division_by_zero );
        }
  } else if (what === "*") {
        return new cNumber( arg0.getValue() * arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.string] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
  } else if (what === "<" || what === "<=") {
        return new cBool( true );
  } else if (what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-" || what === "+" || what === "/" || what === "*") {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg;
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
  } else if (what === "<" || what === "<=") {
        return new cBool( true );
  } else if (what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() - _arg.getValue() );
  } else if (what === "+") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() + _arg.getValue() );
  } else if (what === "/") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        if ( _arg.getValue() !== 0 ) {
            return new cNumber( arg0.getValue() / _arg.getValue() );
    } else {
            return new cError( cErrorType.division_by_zero );
        }
  } else if (what === "*") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( arg0.getValue() * _arg.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.number][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.number][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > 0 );
  } else if (what === ">=") {
        return new cBool( arg0.getValue() >= 0 );
  } else if (what === "<") {
        return new cBool( arg0.getValue() < 0 );
  } else if (what === "<=") {
        return new cBool( arg0.getValue() <= 0 );
  } else if (what === "=") {
        return new cBool( arg0.getValue() === 0 );
  } else if (what === "<>") {
        return new cBool( arg0.getValue() !== 0 );
  } else if (what === "-") {
        return new cNumber( arg0.getValue() - 0 );
  } else if (what === "+") {
        return new cNumber( arg0.getValue() + 0 );
  } else if (what === "/") {
        return new cError( cErrorType.division_by_zero );
  } else if (what === "*") {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.string][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
  } else if (what === "<" || what === "<=" || what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-" || what === "+" || what === "/" || what === "*") {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.string] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" ) {
        return new cBool( arg0.getValue() > arg1.getValue() );
  } else if (what === ">=") {
        return new cBool( arg0.getValue() >= arg1.getValue() );
  } else if (what === "<") {
        return new cBool( arg0.getValue() < arg1.getValue() );
  } else if (what === "<=") {
        return new cBool( arg0.getValue() <= arg1.getValue() );
  } else if (what === "=") {
        return new cBool( arg0.getValue().toLowerCase() === arg1.getValue().toLowerCase() );
  } else if (what === "<>") {
        return new cBool( arg0.getValue().toLowerCase() !== arg1.getValue().toLowerCase() );
  } else if (what === "-") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
  } else if (what === "+") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
  } else if (what === "/") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
  } else if (what === "*") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" || what === ">=" ) {
        return new cBool( false );
  } else if (what === "<" || what === "<=") {
        return new cBool( true );
  } else if (what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
  } else if (what === "+") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
  } else if (what === "/") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
  } else if (what === "*") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg0 instanceof cError ) {
            return _arg0;
        }
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.string][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.string][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.getValue().length !== 0 );
  } else if (what === ">=") {
        return new cBool( arg0.getValue().length >= 0 );
  } else if (what === "<") {
        return new cBool( false );
  } else if (what === "<=") {
        return new cBool( arg0.getValue().length <= 0 );
  } else if (what === "=") {
        return new cBool( arg0.getValue().length === 0 );
  } else if (what === "<>") {
        return new cBool( arg0.getValue().length !== 0 );
  } else if (what === "-" || what === "+" || what === "/" || what === "*") {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.bool][cElementType.number] = function ( arg0, arg1, what ) {
    var _arg;
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
  } else if (what === "<" || what === "<=") {
        return new cBool( false );
  } else if (what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-") {
        _arg = arg0.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() - arg1.getValue() );
  } else if (what === "+") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() + arg1.getValue() );
  } else if (what === "/") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        if ( arg1.getValue() !== 0 ) {
            return new cNumber( _arg.getValue() / arg1.getValue() );
    } else {
            return new cError( cErrorType.division_by_zero );
        }
  } else if (what === "*") {
        _arg = arg1.tocNumber();
        if ( _arg instanceof cError ) {
            return _arg;
        }
        return new cNumber( _arg.getValue() * arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.string] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" || what === ">=" ) {
        return new cBool( true );
  } else if (what === "<" || what === "<=") {
        return new cBool( false );
  } else if (what === "=") {
        return new cBool( false );
  } else if (what === "<>") {
        return new cBool( true );
  } else if (what === "-") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
  } else if (what === "+") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
  } else if (what === "/") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        if ( _arg1.getValue() !== 0 ) {
            return new cNumber( _arg0.getValue() / _arg1.getValue() );
        }
        return new cError( cErrorType.division_by_zero );
  } else if (what === "*") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        if ( _arg1 instanceof cError ) {
            return _arg1;
        }
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.bool] = function ( arg0, arg1, what ) {
    var _arg0, _arg1;
    if ( what === ">" ) {
        return    new cBool( arg0.value > arg1.value );
  } else if (what === ">=") {
        return    new cBool( arg0.value >= arg1.value );
  } else if (what === "<") {
        return    new cBool( arg0.value < arg1.value );
  } else if (what === "<=") {
        return    new cBool( arg0.value <= arg1.value );
  } else if (what === "=") {
        return    new cBool( arg0.value === arg1.value );
  } else if (what === "<>") {
        return    new cBool( arg0.value !== arg1.value );
  } else if (what === "-") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() - _arg1.getValue() );
  } else if (what === "+") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() + _arg1.getValue() );
  } else if (what === "/") {
        if ( !arg1.value ) {
            return new cError( cErrorType.division_by_zero );
        }
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() / _arg1.getValue() );
  } else if (what === "*") {
        _arg0 = arg0.tocNumber();
        _arg1 = arg1.tocNumber();
        return new cNumber( _arg0.getValue() * _arg1.getValue() );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.bool][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.bool][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( arg0.value > false );
  } else if (what === ">=") {
        return new cBool( arg0.value >= false );
  } else if (what === "<") {
        return new cBool( arg0.value < false );
  } else if (what === "<=") {
        return new cBool( arg0.value <= false );
  } else if (what === "=") {
        return new cBool( arg0.value === false );
  } else if (what === "<>") {
        return new cBool( arg0.value !== false );
  } else if (what === "-") {
        return new cNumber( arg0.value ? 1 : 0 );
  } else if (what === "+") {
        return new cNumber( arg0.value ? 1 : 0 );
  } else if (what === "/") {
        return new cError( cErrorType.division_by_zero );
  } else if (what === "*") {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.error][cElementType.number] = _func[cElementType.error][cElementType.string] =
  _func[cElementType.error][cElementType.bool] =
    _func[cElementType.error][cElementType.error] = _func[cElementType.error][cElementType.empty] = function(arg0) {
            return arg0;
        };


_func[cElementType.empty][cElementType.number] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( 0 > arg1.getValue() );
  } else if (what === ">=") {
        return new cBool( 0 >= arg1.getValue() );
  } else if (what === "<") {
        return new cBool( 0 < arg1.getValue() );
  } else if (what === "<=") {
        return new cBool( 0 <= arg1.getValue() );
  } else if (what === "=") {
        return new cBool( 0 === arg1.getValue() );
  } else if (what === "<>") {
        return new cBool( 0 !== arg1.getValue() );
  } else if (what === "-") {
        return new cNumber( 0 - arg1.getValue() );
  } else if (what === "+") {
        return new cNumber( 0 + arg1.getValue() );
  } else if (what === "/") {
        if ( arg1.getValue() === 0 ) {
            return new cError( cErrorType.not_numeric );
        }
        return new cNumber( 0 );
  } else if (what === "*") {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.string] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( 0 > arg1.getValue().length );
  } else if (what === ">=") {
        return new cBool( 0 >= arg1.getValue().length );
  } else if (what === "<") {
        return new cBool( 0 < arg1.getValue().length );
  } else if (what === "<=") {
        return new cBool( 0 <= arg1.getValue().length );
  } else if (what === "=") {
        return new cBool( 0 === arg1.getValue().length );
  } else if (what === "<>") {
        return new cBool( 0 !== arg1.getValue().length );
  } else if (what === "-" || what === "+" || what === "/" || what === "*") {
        return new cError( cErrorType.wrong_value_type );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.bool] = function ( arg0, arg1, what ) {
    if ( what === ">" ) {
        return new cBool( false > arg1.value );
  } else if (what === ">=") {
        return new cBool( false >= arg1.value );
  } else if (what === "<") {
        return new cBool( false < arg1.value );
  } else if (what === "<=") {
        return new cBool( false <= arg1.value );
  } else if (what === "=") {
        return new cBool( arg1.value === false );
  } else if (what === "<>") {
        return new cBool( arg1.value !== false );
  } else if (what === "-") {
        return new cNumber( 0 - arg1.value ? 1.0 : 0.0 );
  } else if (what === "+") {
        return new cNumber( arg1.value ? 1.0 : 0.0 );
  } else if (what === "/") {
        if ( arg1.value ) {
            return new cNumber( 0 );
        }
        return new cError( cErrorType.not_numeric );
  } else if (what === "*") {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};

_func[cElementType.empty][cElementType.error] = function ( arg0, arg1 ) {
    return arg1;
};

_func[cElementType.empty][cElementType.empty] = function ( arg0, arg1, what ) {
    if ( what === ">" || what === "<" || what === "<>" ) {
        return new cBool( false );
  } else if (what === ">=" || what === "<=" || what === "=") {
        return new cBool( true );
  } else if (what === "-" || what === "+") {
        return new cNumber( 0 );
  } else if (what === "/") {
        return new cError( cErrorType.not_numeric );
  } else if (what === "*") {
        return new cNumber( 0 );
    }
    return new cError( cErrorType.wrong_value_type );
};


_func[cElementType.cellsRange][cElementType.number] = _func[cElementType.cellsRange][cElementType.string] =
    _func[cElementType.cellsRange][cElementType.bool] = _func[cElementType.cellsRange][cElementType.error] =
    _func[cElementType.cellsRange][cElementType.array] =
      _func[cElementType.cellsRange][cElementType.empty] = function(arg0, arg1, what, cellAddress) {
            var cross = arg0.cross( cellAddress );
            return _func[cross.type][arg1.type]( cross, arg1, what );
        };


_func[cElementType.number][cElementType.cellsRange] = _func[cElementType.string][cElementType.cellsRange] =
    _func[cElementType.bool][cElementType.cellsRange] = _func[cElementType.error][cElementType.cellsRange] =
    _func[cElementType.array][cElementType.cellsRange] =
      _func[cElementType.empty][cElementType.cellsRange] = function(arg0, arg1, what, cellAddress) {
            var cross = arg1.cross( cellAddress );
            return _func[arg0.type][cross.type]( arg0, cross, what );
        };


_func[cElementType.cellsRange][cElementType.cellsRange] = function ( arg0, arg1, what, cellAddress ) {
  var cross1 = arg0.cross(cellAddress), cross2 = arg1.cross(cellAddress);
    return _func[cross1.type][cross2.type]( cross1, cross2, what );
};

_func[cElementType.array][cElementType.array] = function ( arg0, arg1, what ) {
    if ( arg0.getRowCount() !== arg1.getRowCount() || arg0.getCountElementInRow() !== arg1.getCountElementInRow() ) {
        return new cError( cErrorType.wrong_value_type );
    }
    var retArr = new cArray(), _arg0, _arg1;
    for ( var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true ) {
        for ( var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++ ) {
            _arg0 = arg0.getElementRowCol( iRow, iCol );
            _arg1 = arg1.getElementRowCol( iRow, iCol );
            retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
        }
    }
    return retArr;
};

_func[cElementType.array][cElementType.number] = _func[cElementType.array][cElementType.string] =
    _func[cElementType.array][cElementType.bool] = _func[cElementType.array][cElementType.error] =
        _func[cElementType.array][cElementType.empty] = function ( arg0, arg1, what ) {
            var res = new cArray();
            arg0.foreach( function ( elem, r ) {
                if ( !res.array[r] ) {
                    res.addRow();
                }
                res.addElement( _func[elem.type][arg1.type]( elem, arg1, what ) );
            } );
            return res;
        };


_func[cElementType.number][cElementType.array] = _func[cElementType.string][cElementType.array] =
    _func[cElementType.bool][cElementType.array] = _func[cElementType.error][cElementType.array] =
        _func[cElementType.empty][cElementType.array] = function ( arg0, arg1, what ) {
            var res = new cArray();
            arg1.foreach( function ( elem, r ) {
                if ( !res.array[r] ) {
                    res.addRow();
                }
                res.addElement( _func[arg0.type][elem.type]( arg0, elem, what ) );
            } );
            return res;
        };


_func.binarySearch = function ( sElem, arrTagert, regExp ) {
    var first = 0, /* Номер первого элемента в массиве */
        last = arrTagert.length - 1, /* Номер элемента в массиве, СЛЕДУЮЩЕГО ЗА последним */
    /* Если просматриваемый участок непустой, first<last */
        mid;

    var arrTagertOneType = [], isString = false;

    for ( var i = 0; i < arrTagert.length; i++ ) {
        if ( (arrTagert[i] instanceof cString || sElem instanceof cString) && !isString ) {
            i = 0;
            isString = true;
            sElem = new cString( sElem.toString().toLowerCase() );
        }
        if ( isString ) {
            arrTagertOneType[i] = new cString( arrTagert[i].toString().toLowerCase() );
    } else {
            arrTagertOneType[i] = arrTagert[i].tocNumber();
        }
    }

    if ( arrTagert.length === 0 ) {
        return -1;
        /* массив пуст */
  } else if (arrTagert[0].value > sElem.value) {
        return -2;
  } else if (arrTagert[arrTagert.length - 1].value < sElem.value) {
        return arrTagert.length - 1;
    }

    while ( first < last ) {
        mid = Math.floor( first + (last - first) / 2 );
        if ( sElem.value <= arrTagert[mid].value || ( regExp && regExp.test( arrTagert[mid].value ) ) ) {
            last = mid;
    } else {
            first = mid + 1;
        }
    }

    /* Если условный оператор if(n==0) и т.д. в начале опущен - значит, тут раскомментировать!    */
    if ( /* last<n &&*/ arrTagert[last].value === sElem.value ) {
        return last;
        /* Искомый элемент найден. last - искомый индекс */
  } else {
        return last - 1;
        /* Искомый элемент не найден. Но если вам вдруг надо его вставить со сдвигом, то его место - last.    */
    }

};

_func[cElementType.number][cElementType.cell] = function ( arg0, arg1, what, cellAddress ) {
    var ar1 = arg1.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( arg0.getValue() > ar1.getValue() );
        }
        case ">=":
        {
            return new cBool( arg0.getValue() >= ar1.getValue() );
        }
        case "<":
        {
            return new cBool( arg0.getValue() < ar1.getValue() );
        }
        case "<=":
        {
            return new cBool( arg0.getValue() <= ar1.getValue() );
        }
        case "=":
        {
            return new cBool( arg0.getValue() === ar1.getValue() );
        }
        case "<>":
        {
            return new cBool( arg0.getValue() !== ar1.getValue() );
        }
        case "-":
        {
            return new cNumber( arg0.getValue() - ar1.getValue() );
        }
        case "+":
        {
            return new cNumber( arg0.getValue() + ar1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( arg0.getValue() / ar1.getValue() );
      } else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( arg0.getValue() * ar1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }

};
_func[cElementType.cell][cElementType.number] = function ( arg0, arg1, what, cellAddress ) {
    var ar0 = arg0.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( ar0.getValue() > arg1.getValue() );
        }
        case ">=":
        {
            return new cBool( ar0.getValue() >= arg1.getValue() );
        }
        case "<":
        {
            return new cBool( ar0.getValue() < arg1.getValue() );
        }
        case "<=":
        {
            return new cBool( ar0.getValue() <= arg1.getValue() );
        }
        case "=":
        {
            return new cBool( ar0.getValue() === arg1.getValue() );
        }
        case "<>":
        {
            return new cBool( ar0.getValue() !== arg1.getValue() );
        }
        case "-":
        {
            return new cNumber( ar0.getValue() - arg1.getValue() );
        }
        case "+":
        {
            return new cNumber( ar0.getValue() + arg1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( ar0.getValue() / arg1.getValue() );
      } else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( ar0.getValue() * arg1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }
};
_func[cElementType.cell][cElementType.cell] = function ( arg0, arg1, what, cellAddress ) {
    var ar0 = arg0.tocNumber();
    switch ( what ) {
        case ">":
        {
            return new cBool( ar0.getValue() > arg1.getValue() );
        }
        case ">=":
        {
            return new cBool( ar0.getValue() >= arg1.getValue() );
        }
        case "<":
        {
            return new cBool( ar0.getValue() < arg1.getValue() );
        }
        case "<=":
        {
            return new cBool( ar0.getValue() <= arg1.getValue() );
        }
        case "=":
        {
            return new cBool( ar0.getValue() === arg1.getValue() );
        }
        case "<>":
        {
            return new cBool( ar0.getValue() !== arg1.getValue() );
        }
        case "-":
        {
            return new cNumber( ar0.getValue() - arg1.getValue() );
        }
        case "+":
        {
            return new cNumber( ar0.getValue() + arg1.getValue() );
        }
        case "/":
        {
            if ( arg1.getValue() !== 0 ) {
                return new cNumber( ar0.getValue() / arg1.getValue() );
      } else {
                return new cError( cErrorType.division_by_zero );
            }
        }
        case "*":
        {
            return new cNumber( ar0.getValue() * arg1.getValue() );
        }
        default:
        {
            return new cError( cErrorType.wrong_value_type );
        }
    }
};

_func[cElementType.cellsRange3D] = _func[cElementType.cellsRange];
_func[cElementType.cell3D] = _func[cElementType.cell];

	var lastListenerId = 0;
/** класс отвечающий за парсинг строки с формулой, подсчета формулы, перестройки формулы при манипуляции с ячейкой*/
/** @constructor */
function parserFormula( formula, parent, _ws ) {
    this.is3D = false;
    // this.cellId = _cellId;
    // this.cellAddress = g_oCellAddressUtils.getCellAddress( this.cellId );
    this.ws = _ws;
    this.wb = this.ws.workbook;
    this.value = null;
    this.outStack = [];
    this.error = [];
    this.Formula = formula;
    this.FormulaLocale = null;
    this.isParsed = false;
    //для функции parse и parseDiagramRef
    this.pCurrPos = 0;
    this.elemArr = [];
    this.RefPos = [];
    this.operand_str = null;
    this.parenthesesNotEnough = false;
    this.f = [];
    this.reRowCol = /^(ROW|ROWS|COLUMN|COLUMNS)$/gi
    this.regSpace = /\$/g;
    this.countRef = 0;

	this.listenerId = lastListenerId++;
	this.ca = false;
	this.isDirty = false;
	this.isCalculate = false;
	this.parent = parent;
}
  parserFormula.prototype.getWs = function() {
    return this.ws;
  };
  parserFormula.prototype.getListenerId = function() {
    return this.listenerId;
  };
  parserFormula.prototype.getIsDirty = function() {
    return this.isDirty;
  };
  parserFormula.prototype.setIsDirty = function(isDirty) {
    this.isDirty = isDirty;
  };
	parserFormula.prototype.notify = function(data) {
		var eventData = {notifyData: data, assemble: null, isRebuild: false, formula: this};
		if (this.parent && this.parent.onFormulaEvent) {
			var checkCanDo = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.CanDo, eventData);
			if(!checkCanDo){
				return;
			}
		}
		if (AscCommon.c_oNotifyType.Dirty === data.type) {
			if (!this.isDirty) {
				this.isDirty = true;
				if (this.parent && this.parent.onFormulaEvent) {
					this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.Change, eventData);
				}
			}
		} else if (AscCommon.c_oNotifyType.Changed === data.type) {
			if (this.parent && this.parent.onFormulaEvent) {
				this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.Change, eventData);
			}
		} else {
			var assembleType = AscCommon.c_oNotifyParentAssemble.Normal;
			this.removeDependencies();
			if (AscCommon.c_oNotifyType.Shift === data.type || AscCommon.c_oNotifyType.Move === data.type ||
				AscCommon.c_oNotifyType.Delete === data.type) {
				this.shiftCells(data.type, data.sheetId, data.bbox, data.offset);
				assembleType = AscCommon.c_oNotifyParentAssemble.Flag;
				eventData.isRebuild = false;
			} else if (AscCommon.c_oNotifyType.ChangeDefName === data.type) {
				if (data.from.Name != data.to.Name) {
					this.changeDefName(data.from, data.to);
				} else if (data.from.isTable) {
					assembleType = AscCommon.c_oNotifyParentAssemble.Current;
					eventData.isRebuild = true;
				}
			} else if (AscCommon.c_oNotifyType.Rebuild === data.type) {
				assembleType = AscCommon.c_oNotifyParentAssemble.Normal;
				eventData.isRebuild = true;
			} else if (AscCommon.c_oNotifyType.ChangeSheet === data.type) {
				assembleType = AscCommon.c_oNotifyParentAssemble.Current;
				if (this.is3D) {
					var changeData = data.data;
					if (changeData.insert) {
						eventData.isRebuild = this.insertSheet(changeData.insert);
					} else if (changeData.replace || changeData.remove) {
						eventData.isRebuild = true;
						var moveSheetRes = 0;
						if (changeData.replace) {
							moveSheetRes = this.moveSheet(changeData.replace);
						} else {
							moveSheetRes = this.removeSheet(changeData.remove);
						}
						if (2 === moveSheetRes) {
							assembleType = AscCommon.c_oNotifyParentAssemble.Normal;
						} else if (1 !== moveSheetRes) {
							eventData.isRebuild = false;
						}
					} else if (changeData.rename) {
						this.renameSheet(changeData.rename.from, changeData.rename.to);
						assembleType = AscCommon.c_oNotifyParentAssemble.Normal;
						eventData.isRebuild = false;
					}
				}
			}
			switch (assembleType) {
				case AscCommon.c_oNotifyParentAssemble.Normal:
					eventData.assemble = this.assemble();
					break;
				case AscCommon.c_oNotifyParentAssemble.Flag:
					eventData.assemble = this.assemble(true);
					break;
				case AscCommon.c_oNotifyParentAssemble.Current:
					eventData.assemble = this.Formula;
					break;
			}
			if (this.parent && this.parent.onFormulaEvent) {
				this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.ChangeFormula, eventData);
			}
		}
	};
parserFormula.prototype.clone = function(formula, parent, ws) {
    if (null == formula) {
    formula = this.Formula;
    }
    if (null == parent) {
		parent = this.parent;
    }
    if (null == ws) {
    ws = this.ws;
    }
  var oRes = new parserFormula(formula, parent, ws);
  oRes.is3D = this.is3D;
  oRes.value = this.value;
  oRes.pCurrPos = this.pCurrPos;
  oRes.elemArr = [];
  for (var i = 0, length = this.outStack.length; i < length; i++) {
    var oCurElem = this.outStack[i];
      if (oCurElem.clone) {
      oRes.outStack.push(oCurElem.clone());
      } else {
      oRes.outStack.push(oCurElem);
    }
    }
  oRes.RefPos = [];
  oRes.operand_str = this.operand_str;
  oRes.error = this.error.concat();
  oRes.isParsed = this.isParsed;
  return oRes;
};

parserFormula.prototype.setFormula = function(formula) {
  this.Formula = formula;
  this.is3D = false;
  this.value = null;
  this.outStack = [];
  this.error = [];
  this.FormulaLocale = null;
  this.isParsed = false;
  //для функции parse
  this.pCurrPos = 0;
  this.elemArr = [];
  this.RefPos = [];
  this.operand_str = null;
  this.parenthesesNotEnough = false;
  this.f = [];
  this.countRef = 0;
};

parserFormula.prototype.parse = function(local, digitDelim) {
  this.pCurrPos = 0;
  var needAssemble = false;

  if (this.isParsed) {
    return this.isParsed;
  }
  /*
   Парсер формулы реализует алгоритм перевода инфиксной формы записи выражения в постфиксную или Обратную Польскую Нотацию.
   Что упрощает вычисление результата формулы.
   При разборе формулы важен порядок проверки очередной части выражения на принадлежность тому или иному типу.
   */

	if (false) {
		//console.log(this.Formula);
		var cFormulaList = (local && AscCommonExcel.cFormulaFunctionLocalized) ? AscCommonExcel.cFormulaFunctionLocalized :
			cFormulaFunction;
		var aTokens = getTokens(this.Formula);
		if (null === aTokens) {
			this.outStack = [];
			this.error.push(c_oAscError.ID.FrmlWrongOperator);
			return false;
		}

		var stack = [], val, valUp, tmp, elem, len, indentCount = -1, args = [], prev, next, arr = null, bArrElemSign = false;
		for (var i = 0, nLength = aTokens.length; i < nLength; ++i) {
			found_operand = null;
			val = aTokens[i].value;
			switch (aTokens[i].type) {
				case TOK_TYPE_OPERAND:
				{
					if (TOK_SUBTYPE_TEXT === aTokens[i].subtype) {
						elem = new cString(val);
					} else {
						tmp = parseFloat(val);
						if (isNaN(tmp)) {
							valUp = val.toUpperCase();
							if ('TRUE' === valUp || 'FALSE' === valUp) {
								elem = new cBool(valUp);
							} else {
								if (-1 !== val.indexOf('!')) {
									tmp = AscCommonExcel.g_oRangeCache.getRange3D(val);
									if (tmp) {
										this.is3D = true;
										elem = (tmp.isOneCell() && (null === tmp.sheet2 || tmp.sheet === tmp.sheet2)) ?
											new cRef3D(tmp.getName(), tmp.sheet, this.wb) :
											new cArea3D(tmp.getName(), tmp.sheet, null !== tmp.sheet2 ? tmp.sheet2 : tmp.sheet, this.wb);
									} else {
										this.error.push(c_oAscError.ID.FrmlWrongOperator);
										this.outStack = [];
										return false;
									}
								} else {
									tmp = AscCommonExcel.g_oRangeCache.getAscRange(valUp);
									if (tmp) {
										elem = tmp.isOneCell() ? new cRef(valUp, this.ws) : new cArea(valUp, this.ws);
									} else {
										elem = new cName(aTokens[i].value, this.wb, this.ws);
									}
								}
							}
						} else {
							elem = new cNumber(tmp);
						}
					}
					if (arr) {
						if (cElementType.number !== elem.type && cElementType.bool !== elem.type &&
							cElementType.string !== elem.type) {
							this.outStack = [];
							this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
							return false;
						} else {
							if (bArrElemSign) {
								if (cElementType.number !== elem.type) {
									this.outStack = [];
									this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
									return false;
								}
								elem.value *= -1;
								bArrElemSign = false;
							}
							arr.addElement(elem);
						}
					} else {
						this.outStack.push(elem);
						this.f.push(elem);
					}
					break;
				}
				case TOK_TYPE_OP_POST:
				case TOK_TYPE_OP_IN:
				{
					if (TOK_SUBTYPE_UNION === aTokens[i].subtype) {
						this.outStack = [];
						this.error.push(c_oAscError.ID.FrmlWrongOperator);
						return false;
					}

					prev = aTokens[i - 1];
					if ('-' === val && (0 === i || (TOK_TYPE_OPERAND !== prev.type && TOK_TYPE_OP_POST !== prev.type &&
						(TOK_SUBTYPE_STOP !== prev.subtype ||
						(TOK_TYPE_FUNCTION !== prev.type && TOK_TYPE_SUBEXPR !== prev.type))))) {
						elem = new cFormulaOperators['un_minus']();
					} else {
						elem = new cFormulaOperators[val]();
					}
					if (arr) {
						if (bArrElemSign || 'un_minus' !== elem.name) {
							this.outStack = [];
							this.error.push(c_oAscError.ID.FrmlWrongOperator);
							return false;
						} else {
							bArrElemSign = true;
							break;
						}
					}

					this.f.push(elem);

					len = stack.length;
					while (0 !== len) {
						tmp = stack[len - 1];
						if (elem.isRightAssociative ? (elem.priority < tmp.priority) : ((elem.priority <= tmp.priority))) {
							this.outStack.push(tmp);
							--len;
						} else {
							break;
						}
					}
					stack.length = len;

					stack.push(elem);
					break;
				}
				case TOK_TYPE_FUNCTION:
				{
					if (TOK_SUBTYPE_START === aTokens[i].subtype) {
						val = val.toUpperCase();
						if ('ARRAY' === val) {
							if (arr) {
								this.outStack = [];
								this.error.push(c_oAscError.ID.FrmlWrongOperator);
								return false;
							}
							arr = new cArray();
							break;
						} else if ('ARRAYROW' === val) {
							if (!arr) {
								this.outStack = [];
								this.error.push(c_oAscError.ID.FrmlWrongOperator);
								return false;
							}
							arr.addRow();
							break;
						} else if (val in cFormulaList) {
							elem = new cFormulaList[val]();
						} else if (val in cAllFormulaFunction) {
							elem = new cAllFormulaFunction[val]();
						} else {
							elem = new cBaseFunction(val);
							elem.isXLFN = (0 === val.indexOf("_xlfn."));
						}
						stack.push(elem);
						args[++indentCount] = 1;
					} else {
						if (arr) {
							if ('ARRAY' === val) {
								if (!arr.isValidArray()) {
									this.outStack = [];
									// размер массива не согласован
									this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
									return false;
								}
								this.outStack.push(arr);
								arr = null;
							} else if ('ARRAYROW' !== val) {
								this.outStack = [];
								this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
								return false;
							}
							break;
						}
						len = stack.length;
						while (0 !== len) {
							tmp = stack[len - 1];
							--len;
							this.outStack.push(tmp);
							if (cElementType.func === tmp.type) {
								prev = aTokens[i - 1];
								tmp.setArgumentsCount(args[indentCount] -
									((prev && TOK_TYPE_FUNCTION === prev.type && TOK_SUBTYPE_START === prev.subtype) ? 1 : 0));
								if (!tmp.checkArguments()) {
									this.outStack = [];
									this.error.push(c_oAscError.ID.FrmlWrongMaxArgument);
									return false;
								}
								break;
							}
						}
						stack.length = len;
						--indentCount;
					}
					break;
				}
				case TOK_TYPE_ARGUMENT:
				{
					if (arr) {
						break;
					}
					if (-1 === indentCount) {
						throw 'error!!!!!!!!!!!';
					}
					args[indentCount] += 1;
					len = stack.length;
					while (0 !== len) {
						tmp = stack[len - 1];
						if (cElementType.func === tmp.type) {
							break;
						}
						this.outStack.push(tmp);
						--len;
					}
					stack.length = len;

					next = aTokens[i + 1];
					if (next && (TOK_TYPE_ARGUMENT === next.type ||
						(TOK_TYPE_FUNCTION === next.type && TOK_SUBTYPE_START !== next.subtype))) {
						this.outStack.push(new cEmpty());
						break;
					}
					break;
				}
				case TOK_TYPE_SUBEXPR:
				{
					if (TOK_SUBTYPE_START === aTokens[i].subtype) {
						elem = new parentLeft();
						stack.push(elem);
					} else {
						elem = new parentRight();
						len = stack.length;
						while (0 !== len) {
							tmp = stack[len - 1];
							--len;
							this.outStack.push(tmp);
							if (tmp instanceof parentLeft) {
								break;
							}
						}
						stack.length = len;
					}
					this.f.push(elem);
					break;
				}
				case TOK_TYPE_WSPACE:
				{
					if (0 !== i && i !== nLength - 1) {
						prev = aTokens[i - 1];
						next = aTokens[i + 1];
						if ((TOK_TYPE_OPERAND === prev.type ||
							((TOK_TYPE_FUNCTION === prev.type || TOK_TYPE_SUBEXPR === prev.type) &&
							TOK_SUBTYPE_STOP === prev.subtype)) && ((TOK_TYPE_OPERAND === next.type) ||
							((TOK_TYPE_FUNCTION === next.type || TOK_TYPE_SUBEXPR === next.type) &&
							TOK_SUBTYPE_START === next.subtype))) {
							aTokens[i].type = TOK_TYPE_OP_IN;
							aTokens[i].value = ' ';
							--i;
						}
					}
					break;
				}
			}
		}
		while (stack.length !== 0) {
			this.outStack.push(stack.pop());
		}

		if (this.outStack.length != 0) {
			return this.isParsed = true;
		} else {
			return this.isParsed = false;
		}
	}

  this.operand_expected = true;
  var wasLeftParentheses = false, wasRigthParentheses = false, found_operand = null, _3DRefTmp = null, _tableTMP = null;
  var cFormulaList = (local && AscCommonExcel.cFormulaFunctionLocalized) ? AscCommonExcel.cFormulaFunctionLocalized : cFormulaFunction;
  while (this.pCurrPos < this.Formula.length) {
    this.operand_str = this.Formula[this.pCurrPos];
    /*if ( parserHelp.isControlSymbols.call( this, this.Formula, this.pCurrPos )){
     console.log("!");
     continue;
     }*/

    /* Operators*/
    if (parserHelp.isOperator.call(this, this.Formula, this.pCurrPos) ||
      parserHelp.isNextPtg.call(this, this.Formula, this.pCurrPos)) {
      wasLeftParentheses = false;
      wasRigthParentheses = false;
      found_operator = null;

      if (this.operand_expected) {
        if (this.operand_str == "-") {
          this.operand_expected = true;
          found_operator = new cFormulaOperators['un_minus']();
        } else if (this.operand_str == "+") {
          this.operand_expected = true;
          found_operator = new cFormulaOperators['un_plus']();
        } else if (this.operand_str == " ") {
          continue;
        } else {
          this.error.push(c_oAscError.ID.FrmlWrongOperator);
          this.outStack = [];
          this.elemArr = [];
          return false;
        }
      } else if (!this.operand_expected) {
        if (this.operand_str == "-") {
          this.operand_expected = true;
          found_operator = new cFormulaOperators['-']();
        } else if (this.operand_str == "+") {
          this.operand_expected = true;
          found_operator = new cFormulaOperators['+']();
        } else if (this.operand_str == ":") {
          this.operand_expected = true;
          found_operator = new cFormulaOperators[':']();
        } else if (this.operand_str == "%") {
          this.operand_expected = false;
          found_operator = new cFormulaOperators['%']();
        } else if (this.operand_str == " " && this.pCurrPos == this.Formula.length) {
          continue;
        } else {
          if (this.operand_str in cFormulaOperators) {
            found_operator = new cFormulaOperators[this.operand_str]();
            this.operand_expected = true;
          } else {
            this.error.push(c_oAscError.ID.FrmlWrongOperator);
            this.outStack = [];
            this.elemArr = [];
            return false;
          }
        }
      }

      while (this.elemArr.length != 0 && (
        found_operator.isRightAssociative ?
          ( found_operator.priority < this.elemArr[this.elemArr.length - 1].priority ) :
          ( found_operator.priority <= this.elemArr[this.elemArr.length - 1].priority )
      )) {
        this.outStack.push(this.elemArr.pop());
      }
      this.elemArr.push(found_operator);
      this.f.push(found_operator);
      found_operand = null;
    }

    /* Left & Right Parentheses */ else if (parserHelp.isLeftParentheses.call(this, this.Formula, this.pCurrPos)) {
      if (wasRigthParentheses || found_operand) {
        this.elemArr.push(new cMultOperator());
      }
      this.operand_expected = true;
      wasLeftParentheses = true;
      wasRigthParentheses = false;
      found_operand = null;
      this.elemArr.push(new cFormulaOperators[this.operand_str]());
      this.f.push(new cFormulaOperators[this.operand_str]());
    }

    else if (parserHelp.isRightParentheses.call(this, this.Formula, this.pCurrPos)) {
      this.f.push(new cFormulaOperators[this.operand_str]());
      wasRigthParentheses = true;
      var top_elem = null;
      if (this.elemArr.length != 0 && ( (top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" ) &&
        this.operand_expected) {
        if (top_elem.getArguments() > 1) {
          this.outStack.push(new cEmpty());
        } else {
          top_elem.DecrementArguments();
        }
      } else {
        while (this.elemArr.length != 0 && !((top_elem = this.elemArr[this.elemArr.length - 1]).name == "(" )) {
          if (top_elem.name in cFormulaOperators && this.operand_expected) {
            this.error.push(c_oAscError.ID.FrmlOperandExpected);
            this.outStack = [];
            this.elemArr = [];
            return false;
          }
          this.outStack.push(this.elemArr.pop());
        }
      }

      if (this.elemArr.length == 0 || top_elem == null/* && !wasLeftParentheses */) {
        this.outStack = [];
        this.elemArr = [];
        this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
        return false;
      }

      var p = top_elem, func;
      this.elemArr.pop();
      if (this.elemArr.length != 0 && ( func = this.elemArr[this.elemArr.length - 1] ).type == cElementType.func) {
        p = this.elemArr.pop();
        if (top_elem.getArguments() > func.getMaxArguments()) {
          this.outStack = [];
          this.elemArr = [];
          this.error.push(c_oAscError.ID.FrmlWrongMaxArgument);
          return false;
        } else {
          if (top_elem.getArguments() >= func.getMinArguments()) {
            func.setArgumentsCount(top_elem.getArguments());
          } else {
            this.outStack = [];
            this.elemArr = [];
            this.error.push(c_oAscError.ID.FrmlWrongCountArgument);
            return false;
          }
        }
        } else {
          if (wasLeftParentheses &&
            (!this.elemArr[this.elemArr.length - 1] || this.elemArr[this.elemArr.length - 1].name == "(" )) {
          this.outStack = [];
          this.elemArr = [];
          this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
          return false;
        }
        // for (int i = 0; i < left_p.ParametersNum - 1; ++i)
        // {
        // ptgs_list.AddFirst(new PtgUnion()); // чета нужно добавить для Union.....
        // }
      }
      this.outStack.push(p);
      this.operand_expected = false;
      wasLeftParentheses = false;
    }

    /*Comma & arguments union*/ else if (parserHelp.isComma.call(this, this.Formula, this.pCurrPos)) {
      wasLeftParentheses = false;
      wasRigthParentheses = false;
      var stackLength = this.elemArr.length, top_elem = null;

      if (this.elemArr.length != 0 && this.elemArr[stackLength - 1].name == "(" && this.operand_expected) {
        this.outStack.push(new cEmpty());
        top_elem = this.elemArr[stackLength - 1];
        wasLeftParentheses = true;
        this.operand_expected = false;
      } else {
        while (stackLength != 0) {
          top_elem = this.elemArr[stackLength - 1];
          if (top_elem.name == "(") {
            wasLeftParentheses = true;
            break;
          } else {
            this.outStack.push(this.elemArr.pop());
            stackLength = this.elemArr.length;
          }
        }
      }

      if (this.operand_expected) {
        this.error.push(c_oAscError.ID.FrmlWrongOperator);
        this.outStack = [];
        this.elemArr = [];
        return false;
      }

      if (!wasLeftParentheses) {
        this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
        this.outStack = [];
        this.elemArr = [];
        return false;
      }
      top_elem.IncrementArguments();
      this.operand_expected = true;
    }

    /* Array */ else if (parserHelp.isLeftBrace.call(this, this.Formula, this.pCurrPos)) {
      wasLeftParentheses = false;
      wasRigthParentheses = false;
      var arr = new cArray(), operator = {isOperator: false, operatorName: ""};
      while (this.pCurrPos < this.Formula.length && !parserHelp.isRightBrace.call(this, this.Formula, this.pCurrPos)) {
        if (parserHelp.isArraySeparator.call(this, this.Formula, this.pCurrPos, digitDelim)) {
          if (this.operand_str == (digitDelim ? FormulaSeparators.arrayRowSeparator : FormulaSeparators.arrayRowSeparatorDef)) {
            arr.addRow();
          }
        } else if (parserHelp.isBoolean.call(this, this.Formula, this.pCurrPos, local)) {
          arr.addElement(new cBool(this.operand_str));
        } else if (parserHelp.isString.call(this, this.Formula, this.pCurrPos)) {
          arr.addElement(new cString(this.operand_str));
        } else if (parserHelp.isError.call(this, this.Formula, this.pCurrPos)) {
          arr.addElement(new cError(this.operand_str));
        } else if (parserHelp.isNumber.call(this, this.Formula, this.pCurrPos, digitDelim)) {
          if (operator.isOperator) {
            if (operator.operatorName == "+" || operator.operatorName == "-") {
              this.operand_str = operator.operatorName + "" + this.operand_str
            } else {
              this.outStack = [];
              this.elemArr = [];
              this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
              return false;
            }
          }
          arr.addElement(new cNumber(parseFloat(this.operand_str)));
          operator = {isOperator: false, operatorName: ""};
        } else if (parserHelp.isOperator.call(this, this.Formula, this.pCurrPos)) {
          operator.isOperator = true;
          operator.operatorName = this.operand_str;
        } else {
          this.outStack = [];
          this.elemArr = [];
          /*в массиве используется недопустимый параметр*/
          this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
          return false;
        }
      }
      if (!arr.isValidArray()) {
        this.outStack = [];
        this.elemArr = [];
        /*размер массива не согласован*/
        this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
        return false;
      }
      this.outStack.push(arr);
      this.operand_expected = false;
    }

    /* Operands*/ else {

      found_operand = null;

      if (wasRigthParentheses) {
        this.operand_expected = true;
      }

      if (!this.operand_expected) {
        this.error.push(c_oAscError.ID.FrmlWrongOperator);
        this.outStack = [];
        this.elemArr = [];
        return false;
      }

      /* Booleans */
      if (parserHelp.isBoolean.call(this, this.Formula, this.pCurrPos, local)) {
        found_operand = new cBool(this.operand_str);
      }

      /* Strings */ else if (parserHelp.isString.call(this, this.Formula, this.pCurrPos)) {
        found_operand = new cString(this.operand_str);
      }

      /* Errors */ else if (parserHelp.isError.call(this, this.Formula, this.pCurrPos, local)) {
        found_operand = new cError(this.operand_str);
      }

      /* Referens to 3D area: Sheet1:Sheet3!A1:B3, Sheet1:Sheet3!B3, Sheet1!B3*/ else if ((_3DRefTmp =
          parserHelp.is3DRef.call(this, this.Formula, this.pCurrPos))[0]) {

        this.is3D = true;
        var _wsFrom = _3DRefTmp[1], _wsTo = ( (_3DRefTmp[2] !== null) && (_3DRefTmp[2] !== undefined) ) ? _3DRefTmp[2] :
          _wsFrom, wsF = this.wb.getWorksheetByName(_wsFrom), wsT = this.wb.getWorksheetByName(_wsTo), pos = {
          start: this.pCurrPos - this.operand_str.length - 1, end: this.pCurrPos, index: this.outStack.length
        };

        if (!(wsF && wsT)) {
          this.error.push(c_oAscError.ID.FrmlWrongReferences);
          this.outStack = [];
          this.elemArr = [];
          return false;
        }
        if (parserHelp.isArea.call(this, this.Formula, this.pCurrPos)) {
          pos.end = this.pCurrPos;
          found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
          pos.oper = found_operand;
          this.RefPos.push(pos);
        } else if (parserHelp.isRef.call(this, this.Formula, this.pCurrPos)) {
          pos.end = this.pCurrPos;
          if (_wsTo != _wsFrom) {
            found_operand = new cArea3D(this.operand_str.toUpperCase(), _wsFrom, _wsTo, this.wb);
            pos.oper = found_operand;
          } else {
            found_operand = new cRef3D(this.operand_str.toUpperCase(), _wsFrom, this.wb);
            pos.oper = found_operand;
          }
          this.RefPos.push(pos);
        } else if (parserHelp.isName.call(this, this.Formula, this.pCurrPos)) {
          found_operand = new cName3D(this.operand_str, this.wb, wsF);
        }
        this.countRef++;
      }

      /* Referens to cells area A1:A10 */ else if (parserHelp.isArea.call(this, this.Formula, this.pCurrPos)) {
        found_operand = new cArea(this.operand_str.toUpperCase(), this.ws);
        this.RefPos.push({
          start: this.pCurrPos - this.operand_str.length,
          end: this.pCurrPos,
          index: this.outStack.length,
          oper: found_operand
        });
        this.countRef++;
      }
      /* Referens to cell A4 */ else if (parserHelp.isRef.call(this, this.Formula, this.pCurrPos)) {
        found_operand = new cRef(this.operand_str.toUpperCase(), this.ws);
        this.RefPos.push({
          start: this.pCurrPos - this.operand_str.length,
          end: this.pCurrPos,
          index: this.outStack.length,
          oper: found_operand
        });
        this.countRef++;
      }

      else if (_tableTMP = parserHelp.isTable.call(this, this.Formula, this.pCurrPos, local)) {
        found_operand = new cStrucTable(_tableTMP, this.wb, this.ws);

        if (found_operand.type != cElementType.error) {
          this.RefPos.push({
            start: this.pCurrPos - this.operand_str.length,
            end: this.pCurrPos,
            index: this.outStack.length,
            isName: true,
            oper: found_operand
          });
          this.countRef++;
        }

//					if(found_operand.type==cElementType.error) {
//						/*используется неверный именованный диапазон или таблица*/
//						this.error.push( c_oAscError.ID.FrmlAnotherParsingError );
//						this.outStack = [];
//						this.elemArr = [];
//						return false;
//					}


      }

      /* Referens to DefinedNames */ else if (parserHelp.isName.call(this, this.Formula, this.pCurrPos, this.wb,
          this.ws)[0]) {
        found_operand = new cName(this.operand_str, this.wb, this.ws);
        var defName = found_operand.getDefName();
        if (defName && defName.isTable) {
			//need assemble becase source formula wrong
          needAssemble = true;
          found_operand =
            new cStrucTable(parserHelp.isTable(this.operand_str + "[]", 0), this.wb, this.ws);
        }
        this.RefPos.push({
            start: this.pCurrPos - this.operand_str.length,
            end: this.pCurrPos,
            index: this.outStack.length,
            isName: true,
            oper: found_operand
          });
        this.countRef++;
      }

        /* Numbers*/ else if (parserHelp.isNumber.call(this, this.Formula, this.pCurrPos, digitDelim)) {
        if (this.operand_str != ".") {
          found_operand = new cNumber(parseFloat(this.operand_str));
          } else {
          this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
          this.outStack = [];
          this.elemArr = [];
          return false;
        }
      }

        /* Function*/ else if (parserHelp.isFunc.call(this, this.Formula, this.pCurrPos)) {

        if (wasRigthParentheses && this.operand_expected) {
          this.elemArr.push(new cMultOperator());
        }

        var found_operator = null, operandStr = this.operand_str.replace(rx_sFuncPref, "").toUpperCase();
          if (operandStr in cFormulaList) {
          found_operator = new cFormulaList[operandStr]();
          } else if (operandStr in cAllFormulaFunction) {
          found_operator = new cAllFormulaFunction[operandStr]();
          } else {
          found_operator = new cBaseFunction(operandStr);
          found_operator.isXLFN = ( this.operand_str.indexOf("_xlfn.") === 0 );
        }

        if (found_operator != null) {
          this.elemArr.push(found_operator);
          this.f.push(found_operator);
          } else {
          this.error.push(c_oAscError.ID.FrmlWrongFunctionName);
          this.outStack = [];
          this.elemArr = [];
          return false;
        }
        this.operand_expected = false;
        wasRigthParentheses = false;
        continue;
      }

      if (found_operand != null && found_operand != undefined) {
        this.outStack.push(found_operand);
        this.f.push(found_operand);
        this.operand_expected = false;
        found_operand = null
        } else {
        if (this.operand_str == null || this.operand_str == "'") {
          this.outStack.push(new cError(cErrorType.wrong_name));
          this.error.push(c_oAscError.ID.FrmlAnotherParsingError);
          return this.isParsed = false;
        }
        if (parserHelp.isName.call(this, this.Formula, this.pCurrPos, this.wb, this.ws)[0]) {
          this.outStack.push(new cName(this.operand_str, this.wb));
        }

        this.operand_expected = false;
        if (this.operand_str != null) {
          if (this.operand_str == '"') {
            continue;
          }
          this.pCurrPos += this.operand_str.length;
        }
      }
      if (wasRigthParentheses) {
        this.elemArr.push(new cMultOperator());
      }
      wasLeftParentheses = false;
      wasRigthParentheses = false;
    }

  }
  if (this.operand_expected) {
    this.outStack = [];
    this.elemArr = [];
    this.error.push(c_oAscError.ID.FrmlOperandExpected);
    return false;
  }
  var operand, parenthesesNotEnough = false;
  while (this.elemArr.length != 0) {
    operand = this.elemArr.pop();
    if (operand.name == "(" && !this.parenthesesNotEnough) {
      this.Formula += ")";
      parenthesesNotEnough = true;
      } else if (operand.name == "(" || operand.name == ")") {
      this.outStack = [];
      this.elemArr = [];
      this.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
      return false;
      } else {
      this.outStack.push(operand);
    }
  }
  this.parenthesesNotEnough = parenthesesNotEnough;
  if (this.parenthesesNotEnough) {
    this.error.push(c_oAscError.ID.FrmlParenthesesCorrectCount);
    return this.isParsed = false;
  }

  if (this.outStack.length != 0) {
    if(needAssemble){
      this.Formula = this.assemble();
    }
    return this.isParsed = true;
  } else {
    return this.isParsed = false;
  }
};

parserFormula.prototype.calculate = function(opt_defName, opt_range) {
	if (this.isCalculate) {
		this.value = new cError(cErrorType.bad_reference);
		this._endCalculate();
		return this.value;
	}
	this.isCalculate = true;
	if (this.outStack.length < 1) {
		this.value = new cError(cErrorType.wrong_name);
		this._endCalculate();
		return this.value;
	}
	var rangeCell = null;
	if (opt_range) {
		rangeCell = opt_range;
	} else if (this.parent && this.parent.onFormulaEvent) {
		rangeCell = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.GetRangeCell);
	}
	if (!rangeCell) {
		rangeCell = this.ws.getCell3(0, 0);
	}

  var elemArr = [], _tmp, numFormat = -1, currentElement = null;
  for (var i = 0; i < this.outStack.length; i++) {
    currentElement = this.outStack[i];
    if (currentElement.name == "(") {
      continue;
    }
    if (currentElement.type == cElementType.operator || currentElement.type == cElementType.func) {
      if (elemArr.length < currentElement.getArguments()) {
        elemArr = [];
		this.value = new cError(cErrorType.unsupported_function);
		this._endCalculate();
        return this.value;
        } else {
        var arg = [];
        for (var ind = 0; ind < currentElement.getArguments(); ind++) {
          arg.unshift(elemArr.pop());
        }
          _tmp = currentElement.Calculate(arg, rangeCell, opt_defName, this.ws.getId());
        if (_tmp.numFormat !== undefined && _tmp.numFormat !== null) {
          numFormat = _tmp.numFormat; //> numFormat ? _tmp.numFormat : numFormat;
          } else if (numFormat < 0 || currentElement.numFormat < currentElement.formatType.def) {
          numFormat = currentElement.numFormat;
        }
        elemArr.push(_tmp);
      }
      } else if (currentElement.type == cElementType.name || currentElement.type == cElementType.name3D) {
      elemArr.push(currentElement.Calculate(arg, rangeCell));
      } else if (currentElement.type == cElementType.table) {
      elemArr.push(currentElement.toRef(rangeCell.getBBox0()));
      } else {
      elemArr.push(currentElement);
    }
  }
  this.value = elemArr.pop();
  this.value.numFormat = numFormat;

    this._endCalculate();
  return this.value;
};
	parserFormula.prototype._endCalculate = function() {
		if (this.parent && this.parent.onFormulaEvent) {
			this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.EndCalculate);
		}
		this.isCalculate = false;
		this.isDirty = false;
		if(!!this.ca != this.value.ca){
			if (this.value.ca) {
				this.wb.dependencyFormulas.startListeningVolatile(this);
			} else {
				this.wb.dependencyFormulas.endListeningVolatile(this);
			}
			this.ca = this.value.ca;
		}
	};

	/* Для обратной сборки функции иногда необходимо поменять ссылки на ячейки */
	parserFormula.prototype.changeOffset = function (offset) {//offset = AscCommonExcel.CRangeOffset
		for (var i = 0; i < this.outStack.length; i++) {
			this.changeOffsetElem(this.outStack[i], this.outStack, i, offset);
		}
		return this;
	};
	parserFormula.prototype.changeOffsetElem = function(elem, container, index, offset) {//offset =
		// AscCommonExcel.CRangeOffset
		var range, bbox = null, isErr = false;
		if (cElementType.cell === elem.type || cElementType.cell3D === elem.type ||
			cElementType.cellsRange === elem.type) {
			isErr = true;
			range = elem.getRange();
			if (range) {
				bbox = range.getBBox0();
			}
		} else if (cElementType.cellsRange3D === elem.type) {
			isErr = true;
			bbox = elem.getBBox0();
		}
		if (bbox) {
			if (bbox.setOffsetWithAbs(offset)) {
				isErr = false;
				if (cElementType.cellsRange3D === elem.type) {
					elem.bbox = bbox;
				} else {
					elem.range = AscCommonExcel.Range.prototype.createFromBBox(range.getWorksheet(), bbox);
				}
				elem.value = bbox.getName();
			}
		}
		if (isErr) {
			container[index] = new cError(cErrorType.bad_reference);
		}
		return elem;
	};
	parserFormula.prototype.changeDefName = function(from, to) {
		var i, elem, LocalSheetId;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.name || elem.type == cElementType.name3D) {
				elem.changeDefName(from, to);
			} else if (elem.type == cElementType.table) {
				LocalSheetId = elem.ws ? elem.ws.getIndex() : null;
				if (elem.tableName == from.Name && (null == from.LocalSheetId || LocalSheetId == from.LocalSheetId )) {
					elem.tableName = to.Name;
				}
			}
		}
	};
	parserFormula.prototype.removeTableName = function(defName) {
		var i, elem, LocalSheetId;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.table) {
				LocalSheetId = elem.ws ? elem.ws.getIndex() : null;
				if (elem.tableName == defName.Name && (null == defName.LocalSheetId || LocalSheetId == defName.LocalSheetId )) {
					var rangeCell = null;
					if (this.parent && this.parent.onFormulaEvent) {
						rangeCell = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.GetRangeCell);
					}
					if (!rangeCell) {
						rangeCell = this.ws.getCell3(0, 0);
					}
					this.outStack[i] = elem.toRef(rangeCell.getBBox0());
				}
			}
		}
	};
	parserFormula.prototype.shiftCells = function(notifyType, sheetId, bbox, offset) {
		var elem;
		for (var i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			var _cellsRange = null;
			var _cellsBbox = null;
			if (elem.type === cElementType.cell || elem.type === cElementType.cellsRange) {
				if (sheetId == elem.ws.getId() && elem.isValid()) {
					_cellsRange = elem.getRange();
					if (_cellsRange) {
						_cellsBbox = _cellsRange.getBBox0();
					}
				}
			} else if (elem.type === cElementType.cell3D) {
				if (sheetId == elem.ws.getId() && elem.isValid()) {
					_cellsRange = elem.getRange();
					if (_cellsRange) {
						_cellsBbox = _cellsRange.getBBox0();
					}
				}
			} else if (elem.type === cElementType.cellsRange3D) {
				if (elem.wsFrom == elem.wsTo && sheetId == elem.wsFrom && elem.isValid()) {
					_cellsBbox = elem.getBBox0();
				}
			}
			if (_cellsRange) {
				var isIntersect;
				if (AscCommon.c_oNotifyType.Shift == notifyType) {
					isIntersect = bbox.isIntersectForShift(_cellsBbox, offset);
				} else if (AscCommon.c_oNotifyType.Move == notifyType) {
					isIntersect = bbox.containsRange(_cellsBbox);
				} else if (AscCommon.c_oNotifyType.Delete == notifyType) {
					isIntersect = bbox.isIntersect(_cellsBbox);
				}
				if (isIntersect) {
					var isNoDelete;
					if (AscCommon.c_oNotifyType.Shift == notifyType) {
						isNoDelete = _cellsBbox.forShift(bbox, offset);
					} else if (AscCommon.c_oNotifyType.Move == notifyType) {
						_cellsBbox.setOffset(offset);
						isNoDelete = true;
					} else if (AscCommon.c_oNotifyType.Delete == notifyType) {
						if (bbox.containsRange(_cellsBbox)) {
							isNoDelete = false;
						} else {
							isNoDelete = true;
							var ltIn = bbox.contains(_cellsBbox.c1, _cellsBbox.r1);
							var rtIn = bbox.contains(_cellsBbox.c2, _cellsBbox.r1);
							var lbIn = bbox.contains(_cellsBbox.c1, _cellsBbox.r2);
							var rbIn = bbox.contains(_cellsBbox.c2, _cellsBbox.r2);
							if (ltIn && rtIn && bbox.r1 != _cellsBbox.r1) {
								_cellsBbox.setOffsetFirst({offsetCol: 0, offsetRow: bbox.r2 - _cellsBbox.r1 + 1});
							} else if (rtIn && rbIn && bbox.c2 != _cellsBbox.c2) {
								_cellsBbox.setOffsetLast({offsetCol: bbox.c1 - _cellsBbox.c2 - 1, offsetRow: 0});
							} else if (rbIn && lbIn && bbox.r2 != _cellsBbox.r2) {
								_cellsBbox.setOffsetLast({offsetCol: 0, offsetRow: bbox.r1 - _cellsBbox.r2 - 1});
							} else if (lbIn && ltIn && bbox.c1 != _cellsBbox.c1) {
								_cellsBbox.setOffsetFirst({offsetCol: bbox.c2 - _cellsBbox.c1 + 1, offsetRow: 0});
							}
						}
					}
					if (isNoDelete) {
						if (elem.type === cElementType.cellsRange3D) {
							elem.bbox = _cellsBbox;
						} else {
							elem.range = _cellsRange.createFromBBox(_cellsRange.getWorksheet(), _cellsBbox);
						}
						elem.value = _cellsBbox.getName();
					} else {
						this.outStack[i] = new cError(cErrorType.bad_reference);
					}
				}
			}
		}
	};
	parserFormula.prototype.renameSheet = function(lastName, newName) {
		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cell3D === elem.type || cElementType.cellsRange3D === elem.type) {
				elem.changeSheet(lastName, newName);
			} else if (cElementType.name3D === elem.type) {
				elem.changeSheet(lastName, newName);
			}
		}
		return this;
	};
	parserFormula.prototype.renameSheetCopy = function(params) {
		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cell3D === elem.type) {
				if(params.offset){
					elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
				}
				if(params.lastName){
					elem.changeSheet(params.lastName, params.newName);
				}
			} else if (cElementType.cellsRange3D === elem.type) {
				if(params.offset){
					elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
				}
				if(params.lastName) {
					if (elem.wsTo === elem.wsFrom) {
						elem.changeSheet(params.lastName, params.newName);
					} else {
						var wsTo = this.wb.getWorksheetById(elem.wsTo);
						var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
						if (wsFrom.getName() == params.lastName || wsTo.getName() == params.lastName) {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
					}
				}
			} else if (params.offset && (cElementType.cellsRange === elem.type || cElementType.cell === elem.type)) {
				elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
			} else if (params.lastName && cElementType.name3D === elem.type) {
				elem.changeSheet(params.lastName, params.newName);
			} else if (params.tableNameMap && cElementType.table === elem.type) {
				var newTableName = params.tableNameMap[elem.tableName];
				if (newTableName) {
					elem.tableName = newTableName;
				}
			}
		}
		return this;
	};
	parserFormula.prototype.removeSheet = function(sheetId) {
		var nRes = 0;
		var ws = this.wb.getWorksheetById(sheetId);
		if (ws) {
			var wsIndex = ws.getIndex();
			var wsPrev = null;
			if (wsIndex > 0) {
				wsPrev = this.wb.getWorksheet(wsIndex - 1);
			}
			var wsNext = null;
			if (wsIndex < this.wb.getWorksheetCount() - 1) {
				wsNext = this.wb.getWorksheet(wsIndex + 1);
			}
			for (var i = 0; i < this.outStack.length; i++) {
				var elem = this.outStack[i];
				if (cElementType.cellsRange3D === elem.type) {
					var wsTo = this.wb.getWorksheetById(elem.wsTo);
					var wsToIndex = wsTo.getIndex();
					var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
					var wsFromIndex = wsFrom.getIndex();
					if (wsFromIndex <= wsIndex && wsIndex <= wsToIndex && 0 == nRes) {
						nRes = 1;
					}
					if (elem.wsFrom == sheetId) {
						if (elem.wsTo != sheetId && null != wsNext) {
							elem.changeSheet(ws.getName(), wsNext.getName());
						} else {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
						nRes = 2;
					} else if (elem.wsTo == sheetId) {
						if (null != wsPrev) {
							elem.changeSheet(ws.getName(), wsPrev.getName());
						} else {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
						nRes = 2;
					}
				} else if (cElementType.cell3D === elem.type) {
					if (elem.ws.getId() == sheetId) {
						this.outStack[i] = new cError(cErrorType.bad_reference);
						nRes = 2;
					}
				}
			}
		}
		return nRes;
	};
	parserFormula.prototype.insertSheet = function(index) {
		var bRes = false;
		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cellsRange3D == elem.type) {
				var wsTo = this.wb.getWorksheetById(elem.wsTo);
				var wsToIndex = wsTo.getIndex();
				var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
				var wsFromIndex = wsFrom.getIndex();
				if (wsFromIndex <= index && index <= wsToIndex) {
					bRes = true;
					break;
				}
			}
		}
		return bRes;
	};
	parserFormula.prototype.moveSheet = function(tempW) {
		var nRes = 0;
		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cellsRange3D == elem.type) {
				var wsTo = this.wb.getWorksheetById(elem.wsTo);
				var wsToIndex = wsTo.getIndex();
				var wsFrom = this.wb.getWorksheetById(elem.wsFrom);
				var wsFromIndex = wsFrom.getIndex();
				if (wsFromIndex <= tempW.wFI && tempW.wFI <= wsToIndex && 0 == nRes) {
					nRes = 1;
				}
				if (elem.wsFrom !== elem.wsTo) {
					if (elem.wsFrom == tempW.wFId) {
						if (tempW.wTI > wsToIndex) {
							nRes = 2;
							var wsNext = this.wb.getWorksheet(wsFromIndex + 1);
							if (wsNext) {
								elem.changeSheet(tempW.wFN, wsNext.getName());
							} else {
								this.outStack[i] = new cError(cErrorType.bad_reference);
							}
						}
					} else if (elem.wsTo == tempW.wFId) {
						if (tempW.wTI <= wsFromIndex) {
							nRes = 2;
							var wsPrev = this.wb.getWorksheet(wsToIndex - 1);
							if (wsPrev) {
								elem.changeSheet(tempW.wFN, wsPrev.getName());
							} else {
								this.outStack[i] = new cError(cErrorType.bad_reference);
							}
						}
					}
				}
			}
		}
		return nRes;
	};

	/* Сборка функции в инфиксную форму */
	parserFormula.prototype.assemble = function (rFormula) {
		if (!rFormula && this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError) {
			return this.Formula;
		}
		var currentElement = null, _count = this.outStack.length, elemArr = new Array(_count), res = undefined, _count_arg;
		for (var i = 0, j = 0; i < _count; i++, j++) {
			currentElement = this.outStack[i];
			if (cElementType.operator === currentElement.type || cElementType.func === currentElement.type) {
				_count_arg = currentElement.getArguments();
				res = currentElement.Assemble2(elemArr, j - _count_arg, _count_arg);
				j -= _count_arg;
				elemArr[j] = res;
			} else {
				if (cElementType.string === currentElement.type) {
					currentElement = new cString("\"" + currentElement.toString() + "\"");
				}
				res = currentElement;
				elemArr[j] = res;
			}
		}

		if (res != undefined && res != null) {
			return res.toString();
		} else {
			return this.Formula;
		}
	};

/* Сборка функции в инфиксную форму */
parserFormula.prototype.assembleLocale = function(locale, digitDelim) {
  if (this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError) {
    return this.Formula;
  }
    var currentElement = null, _count = this.outStack.length, elemArr = new Array(_count), res = undefined, _count_arg;
  for (var i = 0, j = 0; i < _count; i++, j++) {
    currentElement = this.outStack[i];
    if (currentElement.type == cElementType.operator || currentElement.type == cElementType.func) {
      _count_arg = currentElement.getArguments();
      res = currentElement.Assemble2Locale(elemArr, j - _count_arg, _count_arg, locale, digitDelim);
      j -= _count_arg;
      elemArr[j] = res;
      } else {
      if (currentElement instanceof cString) {
        currentElement = new cString("\"" + currentElement.toLocaleString(digitDelim) + "\"");
      }
      res = currentElement;
      elemArr[j] = res;
    }
  }
  if (res != undefined && res != null) {
    return res.toLocaleString(digitDelim);
    } else {
    return this.Formula;
  }
};
	parserFormula.prototype.buildDependencies = function() {

		var ref, nTo, wsR;

		if (this.ca) {
			this.wb.dependencyFormulas.startListeningVolatile(this);
		}

		for (var i = 0; i < this.outStack.length; i++) {
			ref = this.outStack[i];

			if (ref.type == cElementType.table) {
				this.wb.dependencyFormulas.startListeningDefName(ref.tableName, this);
				continue;
			}

			if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type || cElementType.cellsRange3D === ref.type) &&
				ref.isValid() && this.outStack[i + 1] && this.outStack[i + 1] instanceof cBaseFunction &&
				this.reRowCol.test(this.outStack[i + 1].name)) {
				this.reRowCol.lastIndex = 0;
				continue;
			}

			if (ref.type == cElementType.name || ref.type == cElementType.name3D) {
				this.wb.dependencyFormulas.startListeningDefName(ref.value, this);
			} else if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type) && ref.isValid()) {
				this.wb.dependencyFormulas.startListeningRange(ref.getWsId(), ref.getRange().getBBox0(), this);
			} else if (cElementType.cellsRange3D === ref.type && ref.isValid()) {
				wsR = ref.range(ref.wsRange());
				for (var j = 0; j < wsR.length; j++) {
					var range = wsR[j];
					if (range) {
						var wsId = range.getWorksheet().getId();
						this.wb.dependencyFormulas.startListeningRange(wsId, range.getBBox0(), this);
					}
				}
			}
		}
	};
	parserFormula.prototype.removeDependencies = function() {
		var ref;
		var wsR;
		if (this.ca) {
			this.wb.dependencyFormulas.endListeningVolatile(this);
		}

		for (var i = 0; i < this.outStack.length; i++) {
			ref = this.outStack[i];

			if (ref.type == cElementType.table) {
				this.wb.dependencyFormulas.endListeningDefName(ref.tableName, this);
				continue;
			}

			if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type || cElementType.cellsRange3D === ref.type) &&
				ref.isValid() && this.outStack[i + 1] && this.outStack[i + 1] instanceof cBaseFunction &&
				this.reRowCol.test(this.outStack[i + 1].name)) {
				this.reRowCol.lastIndex = 0;
				continue;
			}

			if (ref.type == cElementType.name || ref.type == cElementType.name3D) {
				this.wb.dependencyFormulas.endListeningDefName(ref.value, this);
			} else if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type) && ref.isValid()) {
				this.wb.dependencyFormulas.endListeningRange(ref.getWsId(), ref.getRange().getBBox0(), this);
			} else if (cElementType.cellsRange3D === ref.type && ref.isValid()) {
				wsR = ref.range(ref.wsRange());
				for (var j = 0; j < wsR.length; j++) {
					var range = wsR[j];
					if (range) {
						var wsId = range.getWorksheet().getId();
						this.wb.dependencyFormulas.endListeningRange(wsId, range.getBBox0(), this);
					}
				}
			}
		}
	};

parserFormula.prototype.getElementByPos = function(pos) {
  var curPos = 0;
  for (var i = 0; i < this.f.length; ++i) {
    curPos += this.f[i].toString().length;
    if (curPos >= pos) {
      return this.f[i];
    }
  }
  return null;
};

function parseNum( str ) {
    if ( str.indexOf( "x" ) > -1 || str == "" || str.match( /\s+/ ) )//исключаем запись числа в 16-ричной форме из числа.
  {
        return false;
  }
    return !isNaN( str );
}

	function matching(x, y, operator) {
		var res = false, rS;
		if (cElementType.string === y.type) {
			y = y.toString();
			if ('' === y) {
				// Empty compare string
				rS = (cElementType.empty === x.type);
			} else {
				// Equal only string values
				rS = (cElementType.string === x.type) ? searchRegExp2(x.value, y) : false;
			}

			switch (operator) {
				case "<>":
					res = !rS;
					break;
				case "=":
				default:
					res = rS;
					break;
			}
		} else {
			rS = (x.type === y.type);
			switch (operator) {
				case "<>":
					res = !rS || (x.value != y.value);
					break;
				case ">":
					res = rS && (x.value > y.value);
					break;
				case "<":
					res = rS && (x.value < y.value);
					break;
				case ">=":
					res = rS && (x.value >= y.value);
					break;
				case "<=":
					res = rS && (x.value <= y.value);
					break;
				case "=":
				default:
					res = (x.value == y.value);
					break;
			}
		}
		return res;
	}

function GetDiffDate360( nDay1, nMonth1, nYear1, nDay2, nMonth2, nYear2, bUSAMethod ) {
    var nDayDiff;
  var startTime = new Date(nYear1, nMonth1 - 1, nDay1), endTime = new Date(nYear2, nMonth2 - 1, nDay2), nY, nM, nD;

    if ( startTime > endTime ) {
        nY = nYear1;
        nYear1 = nYear2;
        nYear2 = nY;
        nM = nMonth1;
        nMonth1 = nMonth2;
        nMonth2 = nM;
        nD = nDay1;
        nDay1 = nDay2;
        nDay2 = nD;
    }

    if ( bUSAMethod ) {
        if ( nDay1 == 31 ) {
            nDay1--;
        }
        if ( nDay1 == 30 && nDay2 == 31 ) {
            nDay2--;
    } else {
            if ( nMonth1 == 2 && nDay1 == ( new Date( nYear1, 0, 1 ).isLeapYear() ? 29 : 28 ) ) {
                nDay1 = 30;
                if ( nMonth2 == 2 && nDay2 == ( new Date( nYear2, 0, 1 ).isLeapYear() ? 29 : 28 ) ) {
                    nDay2 = 30;
                }
            }
        }
//        nDayDiff = ( nYear2 - nYear1 ) * 360 + ( nMonth2 - nMonth1 ) * 30 + ( nDay2 - nDay1 );
  } else {
        if ( nDay1 == 31 ) {
            nDay1--;
        }
        if ( nDay2 == 31 ) {
            nDay2--;
        }
    }
    nDayDiff = ( nYear2 - nYear1 ) * 360 + ( nMonth2 - nMonth1 ) * 30 + ( nDay2 - nDay1 );
    return nDayDiff;
}

function searchRegExp2( s, mask ) {
    //todo протестировать
    var bRes = true;
    var s = s.toString().toLowerCase();
    var mask = mask.toString().toLowerCase();
    var nSIndex = 0;
    var nMaskIndex = 0;
    var nSLastIndex = 0;
    var nMaskLastIndex = 0;
    var nSLength = s.length;
    var nMaskLength = mask.length;
    var t = false;
    for ( ; nSIndex < nSLength; nMaskIndex++, nSIndex++, t = false ) {
        var cCurMask = mask[nMaskIndex];
        if ( '~' == cCurMask ) {
            nMaskIndex++;
            cCurMask = mask[nMaskIndex];
            t = true;
    } else if ('*' == cCurMask) {
      break;
        }
        if ( ( cCurMask != s[nSIndex] && '?' != cCurMask ) || ( cCurMask != s[nSIndex] && t) ) {
            bRes = false;
            break;
        }
    }
    if ( bRes ) {
        while ( 1 ) {
            var cCurMask = mask[nMaskIndex];
            if ( nSIndex >= nSLength ) {
                while ( '*' == cCurMask && nMaskIndex < nMaskLength ) {
                    nMaskIndex++;
                    cCurMask = mask[nMaskIndex];
                }
                bRes = nMaskIndex >= nMaskLength;
                break;
      } else if ('*' == cCurMask) {
                nMaskIndex++;
                if ( nMaskIndex >= nMaskLength ) {
                    bRes = true;
                    break;
                }
                nSLastIndex = nSIndex + 1;
                nMaskLastIndex = nMaskIndex;
      } else if (cCurMask != s[nSIndex] && '?' != cCurMask) {
                nMaskIndex = nMaskLastIndex;
                nSIndex = nSLastIndex++;
      } else {
                nSIndex++;
                nMaskIndex++;
            }
        }
    }
    return bRes;
}

/*
 * Code below has been taken from OpenOffice Source.
 */

function lcl_Erf0065( x ) {
  var pn = [1.12837916709551256, 1.35894887627277916E-1, 4.03259488531795274E-2, 1.20339380863079457E-3,
    6.49254556481904354E-5], qn = [1.00000000000000000, 4.53767041780002545E-1, 8.69936222615385890E-2,
    8.49717371168693357E-3, 3.64915280629351082E-4];
    var pSum = 0.0, qSum = 0.0, xPow = 1.0;
    for ( var i = 0; i <= 4; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x * x;
    }
    return x * pSum / qSum;
}

/** Approximation algorithm for erfc for 0.65 < x < 6.0. */
function lcl_Erfc0600( x ) {
  var pSum = 0, qSum = 0, xPow = 1, pn, qn;

    if ( x < 2.2 ) {
    pn = [9.99999992049799098E-1, 1.33154163936765307, 8.78115804155881782E-1, 3.31899559578213215E-1,
      7.14193832506776067E-2, 7.06940843763253131E-3];
    qn = [1.00000000000000000, 2.45992070144245533, 2.65383972869775752, 1.61876655543871376, 5.94651311286481502E-1,
      1.26579413030177940E-1, 1.25304936549413393E-2];
  } else {
    pn =
      [9.99921140009714409E-1, 1.62356584489366647, 1.26739901455873222, 5.81528574177741135E-1, 1.57289620742838702E-1,
        2.25716982919217555E-2];
    qn = [1.00000000000000000, 2.75143870676376208, 3.37367334657284535, 2.38574194785344389, 1.05074004614827206,
      2.78788439273628983E-1, 4.00072964526861362E-2];
    }

    for ( var i = 0; i < 6; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow *= x;
    }
    qSum += qn[6] * xPow;
    return Math.exp( -1 * x * x ) * pSum / qSum;
}

/** Approximation algorithm for erfc for 6.0 < x < 26.54 (but used for all x > 6.0). */
function lcl_Erfc2654( x ) {
  var pn = [5.64189583547756078E-1, 8.80253746105525775, 3.84683103716117320E1, 4.77209965874436377E1,
    8.08040729052301677], qn = [1.00000000000000000, 1.61020914205869003E1, 7.54843505665954743E1,
    1.12123870801026015E2, 3.73997570145040850E1];

    var pSum = 0, qSum = 0, xPow = 1;

    for ( var i = 0; i <= 4; ++i ) {
        pSum += pn[i] * xPow;
        qSum += qn[i] * xPow;
        xPow /= x * x;
    }
    return Math.exp( -1 * x * x ) * pSum / (x * qSum);
}

function rtl_math_erf( x ) {
  if (x == 0) {
        return 0;
  }

    var bNegative = false;
    if ( x < 0 ) {
        x = Math.abs( x );
        bNegative = true;
    }

    var res = 1;
  if (x < 1.0e-10) {
        res = parseFloat( x * 1.1283791670955125738961589031215452 );
  } else if (x < 0.65) {
        res = lcl_Erf0065( x );
  } else {
        res = 1 - rtl_math_erfc( x );
  }

  if (bNegative) {
        res *= -1;
  }

    return res;
}

function rtl_math_erfc( x ) {
  if (x == 0) {
        return 1;
  }

    var bNegative = false;
    if ( x < 0 ) {
        x = Math.abs( x );
        bNegative = true;
    }

    var fErfc = 0;
    if ( x >= 0.65 ) {
    if (x < 6) {
            fErfc = lcl_Erfc0600( x );
    } else {
            fErfc = lcl_Erfc2654( x );
    }
  } else {
        fErfc = 1 - rtl_math_erf( x );
  }

  if (bNegative) {
        fErfc = 2 - fErfc;
  }

    return fErfc;
}

  //----------------------------------------------------------export----------------------------------------------------
  window['AscCommonExcel'] = window['AscCommonExcel'] || {};
  window['AscCommonExcel'].cElementType = cElementType;
  window['AscCommonExcel'].cErrorType = cErrorType;
  window['AscCommonExcel'].cExcelSignificantDigits = cExcelSignificantDigits;
  window['AscCommonExcel'].cExcelMaxExponent = cExcelMaxExponent;
  window['AscCommonExcel'].cExcelMinExponent = cExcelMinExponent;
  window['AscCommonExcel'].c_Date1904Const = c_Date1904Const;
  window['AscCommonExcel'].c_Date1900Const = c_Date1900Const;
  window['AscCommonExcel'].c_DateCorrectConst = c_Date1900Const;
  window['AscCommonExcel'].c_sPerDay = c_sPerDay;
  window['AscCommonExcel'].c_msPerDay = c_msPerDay;

  window['AscCommonExcel'].cNumber = cNumber;
  window['AscCommonExcel'].cString = cString;
  window['AscCommonExcel'].cBool = cBool;
  window['AscCommonExcel'].cError = cError;
  window['AscCommonExcel'].cArea = cArea;
  window['AscCommonExcel'].cArea3D = cArea3D;
  window['AscCommonExcel'].cRef = cRef;
  window['AscCommonExcel'].cRef3D = cRef3D;
  window['AscCommonExcel'].cEmpty = cEmpty;
  window['AscCommonExcel'].cName = cName;
  window['AscCommonExcel'].cArray = cArray;
  window['AscCommonExcel'].cUndefined = cUndefined;
  window['AscCommonExcel'].cBaseFunction = cBaseFunction;

	window['AscCommonExcel'].checkTypeCell = checkTypeCell;
  window['AscCommonExcel'].cFormulaFunctionGroup = cFormulaFunctionGroup;
  window['AscCommonExcel'].cFormulaFunction = cFormulaFunction;

  window['AscCommonExcel'].cFormulaFunctionLocalized = null;
  window['AscCommonExcel'].cFormulaFunctionToLocale = null;

  window['AscCommonExcel'].getFormulasInfo = getFormulasInfo;

  window['AscCommonExcel']._func = _func;

  window['AscCommonExcel'].parserFormula = parserFormula;

  window['AscCommonExcel'].parseNum = parseNum;
  window['AscCommonExcel'].matching = matching;
  window['AscCommonExcel'].GetDiffDate360 = GetDiffDate360;
  window['AscCommonExcel'].searchRegExp2 = searchRegExp2;
  window['AscCommonExcel'].rtl_math_erf = rtl_math_erf;
  window['AscCommonExcel'].rtl_math_erfc = rtl_math_erfc;
})(window);
