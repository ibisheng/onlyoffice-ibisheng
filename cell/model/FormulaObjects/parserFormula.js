/*
 * (c) Copyright Ascensio System SIA 2010-2018
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

	function ParsedThing(value, type, subtype, pos, length) {
		this.value = value;
		this.type = type;
		this.subtype = subtype;
		this.pos = pos;
		this.length = length;
	}

	ParsedThing.prototype.getStop = function () {
		return new ParsedThing(this.value, this.type, TOK_SUBTYPE_STOP, this.pos, this.length);
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
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_TEXT, offset, token.length));
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
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_ERROR, offset, token.length));
					token = "";
				}
				continue;
			}

			// trim white-space
			if (currentCharCode === g_oCodeSpace) {
				if (token.length > 0) {
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
					token = "";
				}
				tokens.push(new ParsedThing("", TOK_TYPE_WSPACE, null, offset, token.length));
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
					tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
					token = "";
				}
				tokens.push(new ParsedThing(formula.substr(offset, 2), TOK_TYPE_OP_IN, TOK_SUBTYPE_LOGICAL, offset, token.length));
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
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN, null, offset, token.length));
						token = "";
					}
					inString = true;
					break;
				}
				case g_oCodeQuote:
				{
					if (token.length > 0) {
						// not expected
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN, null, offset, token.length));
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
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN, null, offset, token.length));
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
						tokens.push(new ParsedThing(token, TOK_TYPE_UNKNOWN, null, offset, token.length));
						token = "";
					}
					tmp = new ParsedThing('ARRAY', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset, token.length);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					tmp = new ParsedThing('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset, token.length);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					break;
				}
				case g_oCodeSemicolon:
				{
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
						token = "";
					}
					tmp = tokenStack.pop();
					if (tmp && 'ARRAYROW' !== tmp.value) {
						return null;
					}
					tokens.push(tmp);
					tokens.push(new ParsedThing(';', TOK_TYPE_ARGUMENT, null, offset, token.length));
					tmp = new ParsedThing('ARRAYROW', TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset, token.length);
					tokens.push(tmp);
					tokenStack.push(tmp.getStop());
					break;
				}
				case g_oCodeRightCurlyBracked:
				{
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
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
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
						token = "";
					}
					tokens.push(new ParsedThing(currentChar, TOK_TYPE_OP_IN, null, offset, token.length));
					break;
				}
				case g_oCodePercent:
				{
					// standard postfix operators
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
						token = "";
					}
					tokens.push(new ParsedThing(currentChar, TOK_TYPE_OP_POST, null, offset, token.length));
					break;
				}
				case g_oCodeLeftParenthesis:
				{
					// start subexpression or function
					if (token.length > 0) {
						tmp = new ParsedThing(token, TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset, token.length);
						tokens.push(tmp);
						tokenStack.push(tmp.getStop());
						token = "";
					} else {
						tmp = new ParsedThing("", TOK_TYPE_SUBEXPR, TOK_SUBTYPE_START, offset, token.length);
						tokens.push(tmp);
						tokenStack.push(tmp.getStop());
					}
					break;
				}
				case g_oCodeComma:
				{
					// function, subexpression, array parameters
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
						token = "";
					}
					tmp = (0 !== tokenStack.length) ? (TOK_TYPE_FUNCTION === tokenStack[tokenStack.length - 1].type) : false;
					tokens.push(tmp ? new ParsedThing(currentChar, TOK_TYPE_ARGUMENT, null, offset, token.length) :
						new ParsedThing(currentChar, TOK_TYPE_OP_IN, TOK_SUBTYPE_UNION, offset, token.length));
					break;
				}
				case g_oCodeRightParenthesis:
				{
					// stop subexpression
					if (token.length > 0) {
						tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
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
			tokens.push(new ParsedThing(token, TOK_TYPE_OPERAND, null, offset, token.length));
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
		name3D      : 15,
		specialFunctionStart: 16,
		specialFunctionEnd  : 17

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
	var cNumFormatFirstCell = -1;
	var cNumFormatNone = -2;
	var cNumFormatNull = -3;

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

Date.prototype['getExcelDateWithTime'] = Date.prototype.getExcelDateWithTime = function () {
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

  return this.getDateFromExcelWithTime(val);
};

Date.prototype.getDateFromExcelWithTime = function ( val ) {
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

Math.tanh = Math.tanh || function(x) {
	if (x === Infinity) {
		return 1;
	} else if (x === -Infinity) {
		return -1;
	} else {
		var y = Math.exp(2 * x);
		if (y === Infinity) {
			return 1;
		} else if (y === -Infinity) {
			return -1;
		}
		return (y - 1) / (y + 1);
	}
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

Math.log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};

Math.expm1 = Math.expm1 || function(x) {
	return Math.exp(x) - 1;
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

if (typeof Math.sign != 'function') {
	Math['sign'] = Math.sign = function (n) {
		return n == 0 ? 0 : n < 0 ? -1 : 1;
	};
}

RegExp.escape = function ( text ) {
    return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
};

parserHelp.setDigitSeparator(AscCommon.g_oDefaultCultureInfo.NumberDecimalSeparator);

	/** @constructor */
	function cBaseType(val) {
		this.numFormat = cNumFormatNull;
		this.value = val;
	}

	cBaseType.prototype.cloneTo = function (oRes) {
		oRes.numFormat = this.numFormat;
		oRes.value = this.value;
	};
	cBaseType.prototype.getValue = function () {
		return this.value;
	};
	cBaseType.prototype.toString = function () {
		return this.value.toString();
	};
	cBaseType.prototype.toLocaleString = function () {
		return this.toString();
	};

	/*Basic types of an elements used into formulas*/
	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cNumber(val) {
		cBaseType.call(this, parseFloat(val));
		var res;

		if (!isNaN(this.value) && Math.abs(this.value) !== Infinity) {
			res = this;
		} else if (val instanceof cError) {
			res = val;
		} else {
			res = new cError(cErrorType.not_numeric);
		}
		return res;
	}

	cNumber.prototype = Object.create(cBaseType.prototype);
	cNumber.prototype.constructor = cNumber;
	cNumber.prototype.type = cElementType.number;
	cNumber.prototype.tocString = function () {
		return new cString(("" + this.value).replace(FormulaSeparators.digitSeparatorDef,
			FormulaSeparators.digitSeparator));
	};
	cNumber.prototype.tocNumber = function () {
		return this;
	};
	cNumber.prototype.tocBool = function () {
		return new cBool(this.value !== 0);
	};
	cNumber.prototype.toLocaleString = function (digitDelim) {
		var res = this.value.toString();
		if (digitDelim) {
			return res.replace(FormulaSeparators.digitSeparatorDef, FormulaSeparators.digitSeparator);
		} else {
			return res;
		}
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cString(val) {
		cBaseType.call(this, val);
	}

	cString.prototype = Object.create(cBaseType.prototype);
	cString.prototype.constructor = cString;
	cString.prototype.type = cElementType.string;
	cString.prototype.tocNumber = function () {
		var res, m = this.value;
		if (this.value === "") {
			res = new cNumber(0);
		}

		/*if ( this.value[0] === '"' && this.value[this.value.length - 1] === '"' ) {
		 m = this.value.substring( 1, this.value.length - 1 );
		 }*/

		if (g_oFormatParser.isLocaleNumber(this.value)) {
			var numberValue = g_oFormatParser.parseLocaleNumber(this.value);
			if (!isNaN(numberValue)) {
				res = new cNumber(numberValue);
			}
		} else {
			var parseRes = AscCommon.g_oFormatParser.parse(this.value);
			if (null != parseRes) {
				res = new cNumber(parseRes.value);
			} else {
				res = new cError(cErrorType.wrong_value_type);
			}
		}

		return res;
	};
	cString.prototype.tocBool = function () {
		var res;
		if (parserHelp.isBoolean(this.value, 0)) {
			res = new cBool(parserHelp.operand_str.toUpperCase() === cBoolLocal.t);
		} else {
			res = this;
		}
		return res;
	};
	cString.prototype.tocString = function () {
		return this;
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cBool(val) {
		var v = false;
		switch (val.toString().toUpperCase()) {
			case "TRUE":
			case cBoolLocal.t:
				v = true;
		}
		cBaseType.call(this, v);
	}

	cBool.prototype = Object.create(cBaseType.prototype);
	cBool.prototype.constructor = cBool;
	cBool.prototype.type = cElementType.bool;
	cBool.prototype.toString = function () {
		return this.value.toString().toUpperCase();
	};
	cBool.prototype.getValue = function () {
		return this.toString();
	};
	cBool.prototype.tocNumber = function () {
		return new cNumber(this.value ? 1.0 : 0.0);
	};
	cBool.prototype.tocString = function () {
		return new cString(this.value ? "TRUE" : "FALSE");
	};
	cBool.prototype.toLocaleString = function () {
		return new cString(this.value ? cBoolLocal.t : cBoolLocal.f);
	};
	cBool.prototype.tocBool = function () {
		return this;
	};
	cBool.prototype.toBool = function () {
		return this.value;
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cError(val) {
		cBaseType.call(this, val);

		this.errorType = -1;

		switch (val) {
			case cErrorLocal["value"]:
			case cErrorOrigin["value"]:
			case cErrorType.wrong_value_type: {
				this.value = "#VALUE!";
				this.errorType = cErrorType.wrong_value_type;
				break;
			}
			case cErrorLocal["nil"]:
			case cErrorOrigin["nil"]:
			case cErrorType.null_value: {
				this.value = "#NULL!";
				this.errorType = cErrorType.null_value;
				break;
			}
			case cErrorLocal["div"]:
			case cErrorOrigin["div"]:
			case cErrorType.division_by_zero: {
				this.value = "#DIV/0!";
				this.errorType = cErrorType.division_by_zero;
				break;
			}
			case cErrorLocal["ref"]:
			case cErrorOrigin["ref"]:
			case cErrorType.bad_reference: {
				this.value = "#REF!";
				this.errorType = cErrorType.bad_reference;
				break;
			}
			case cErrorLocal["name"]:
			case cErrorOrigin["name"]:
			case cErrorType.wrong_name: {
				this.value = "#NAME?";
				this.errorType = cErrorType.wrong_name;
				break;
			}
			case cErrorLocal["num"]:
			case cErrorOrigin["num"]:
			case cErrorType.not_numeric: {
				this.value = "#NUM!";
				this.errorType = cErrorType.not_numeric;
				break;
			}
			case cErrorLocal["na"]:
			case cErrorOrigin["na"]:
			case cErrorType.not_available: {
				this.value = "#N/A";
				this.errorType = cErrorType.not_available;
				break;
			}
			case cErrorLocal["getdata"]:
			case cErrorOrigin["getdata"]:
			case cErrorType.getting_data: {
				this.value = "#GETTING_DATA";
				this.errorType = cErrorType.getting_data;
				break;
			}
			case cErrorLocal["uf"]:
			case cErrorOrigin["uf"]:
			case cErrorType.unsupported_function: {
				this.value = "#UNSUPPORTED_FUNCTION!";
				this.errorType = cErrorType.unsupported_function;
				break;
			}
		}

		return this;
	}

	cError.prototype = Object.create(cBaseType.prototype);
	cError.prototype.constructor = cError;
	cError.prototype.type = cElementType.error;
	cError.prototype.tocNumber = cError.prototype.tocString = cError.prototype.tocBool = function () {
		return this;
	};
	cError.prototype.toLocaleString = function () {
		switch (this.value) {
			case cErrorOrigin["value"]:
			case cErrorType.wrong_value_type: {
				return cErrorLocal["value"];
			}
			case cErrorOrigin["nil"]:
			case cErrorType.null_value: {
				return cErrorLocal["nil"];
			}
			case cErrorOrigin["div"]:
			case cErrorType.division_by_zero: {
				return cErrorLocal["div"];
			}

			case cErrorOrigin["ref"]:
			case cErrorType.bad_reference: {
				return cErrorLocal["ref"];
			}

			case cErrorOrigin["name"]:
			case cErrorType.wrong_name: {
				return cErrorLocal["name"];
			}

			case cErrorOrigin["num"]:
			case cErrorType.not_numeric: {
				return cErrorLocal["num"];
			}

			case cErrorOrigin["na"]:
			case cErrorType.not_available: {
				return cErrorLocal["na"];
			}

			case cErrorOrigin["getdata"]:
			case cErrorType.getting_data: {
				return cErrorLocal["getdata"];
			}

			case cErrorOrigin["uf"]:
			case cErrorType.unsupported_function: {
				return cErrorLocal["uf"];
			}
		}
		return cErrorLocal["na"];
	};
	cError.prototype.getErrorTypeFromString = function(val) {
		var res;
		switch (val) {
			case cErrorOrigin["value"]: {
				res = cErrorType.wrong_value_type;
				break;
			}
			case cErrorOrigin["nil"]: {
				res = cErrorType.null_value;
				break;
			}
			case cErrorOrigin["div"]: {
				res = cErrorType.division_by_zero;
				break;
			}
			case cErrorOrigin["ref"]: {
				res = cErrorType.bad_reference;
				break;
			}
			case cErrorOrigin["name"]: {
				res = cErrorType.wrong_name;
				break;
			}
			case cErrorOrigin["num"]: {
				res = cErrorType.not_numeric;
				break;
			}
			case cErrorOrigin["na"]: {
				res = cErrorType.not_available;
				break;
			}
			case cErrorOrigin["getdata"]: {
				res = cErrorType.getting_data;
				break;
			}
			case cErrorOrigin["uf"]: {
				res = cErrorType.unsupported_function;
				break;
			}
			default: {
				res = cErrorType.not_available;
				break;
			}
		}
		return res;
	};
	cError.prototype.getStringFromErrorType = function(type) {
		var res;
		switch (type) {
			case cErrorType.wrong_value_type: {
				res = cErrorOrigin["value"];
				break;
			}
			case cErrorType.null_value: {
				res = cErrorOrigin["nil"];
				break;
			}
			case cErrorType.division_by_zero: {
				res = cErrorOrigin["div"];
				break;
			}
			case cErrorType.bad_reference: {
				res = cErrorOrigin["ref"];
				break;
			}
			case cErrorType.wrong_name: {
				res = cErrorOrigin["name"];
				break;
			}
			case cErrorType.not_numeric: {
				res = cErrorOrigin["num"];
				break;
			}
			case cErrorType.not_available: {
				res = cErrorOrigin["na"];
				break;
			}
			case cErrorType.getting_data: {
				res = cErrorOrigin["getdata"];
				break;
			}
			case cErrorType.unsupported_function: {
				res = cErrorOrigin["uf"];
				break;
			}
			default:
				res = cErrorType.not_available;
				break;
		}
		return res;
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cArea(val, ws) {/*Area means "A1:E5" for example*/
		cBaseType.call(this, val);

		this.ws = ws;
		this.range = null;
		if (val) {
			this.range = ws.getRange2(val);
		}
	}

	cArea.prototype = Object.create(cBaseType.prototype);
	cArea.prototype.constructor = cArea;
	cArea.prototype.type = cElementType.cellsRange;
	cArea.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var oRes = new cArea(null, ws);
		this.cloneTo(oRes);
		if (this.range) {
			oRes.range = this.range.clone(ws);
		}
		return oRes;
	};
	cArea.prototype.getWsId = function () {
		return this.ws.Id;
	};
	cArea.prototype.getValue = function (checkExclude, excludeHiddenRows, excludeErrorsVal, excludeNestedStAg) {
		var val = [], r = this.getRange();
		if (!r) {
			val.push(new cError(cErrorType.bad_reference));
		} else {
			if (checkExclude && !excludeHiddenRows) {
				excludeHiddenRows = this.ws.isApplyFilterBySheet();
			}
			r._foreachNoEmpty(function (cell) {
				var bIsFoundNestedStAg = false;
				if(excludeNestedStAg && cell.formulaParsed && cell.formulaParsed.outStack){
					var outStack = cell.formulaParsed.outStack;
					for(var i = 0; i < outStack.length; i++){
						if(outStack[i] && (outStack[i].name === "AGGREGATE" || outStack[i].name === "SUBTOTAL")){
							bIsFoundNestedStAg = true;
							break;
						}
					}
				}
				if(!bIsFoundNestedStAg){
					var checkTypeVal = checkTypeCell(cell);
					if(!(excludeErrorsVal && CellValueType.Error === checkTypeVal.type)){
						val.push(checkTypeVal);
					}
				}

			}, undefined, excludeHiddenRows);
		}
		return val;
	};
	cArea.prototype.getValue2 = function (i, j) {
		var res = this.index(i + 1, j + 1), r;
		if (!res) {
			r = this.getRange();
			r.worksheet._getCellNoEmpty(r.bbox.r1 + i, r.bbox.c1 + j, function(cell) {
				res = checkTypeCell(cell);
			});
		}
		return res;
	};
	cArea.prototype.getRange = function () {
		if (!this.range) {
			this.range = this.ws.getRange2(this.value);
		}
		return this.range;
	};
	cArea.prototype.tocNumber = function () {
		var v = this.getValue()[0];
		if (!v) {
			v = new cNumber(0);
		} else {
			v = v.tocNumber();
		}
		return v;
	};
	cArea.prototype.tocString = function () {
		return this.getValue()[0].tocString();
	};
	cArea.prototype.tocBool = function () {
		return new cError(cErrorType.wrong_value_type);
	};
	cArea.prototype.toString = function () {
		var _c;

		if (this.range) {
			_c = this.range.getName();
		} else {
			_c = this.value;
		}
		if (_c.indexOf(":") < 0) {
			_c = _c + ":" + _c;
		}
		return _c;
	};
	cArea.prototype.getWS = function () {
		return this.ws;
	};
	cArea.prototype.getBBox0 = function () {
		return this.getRange().getBBox0();
	};
	cArea.prototype.cross = function (arg) {
		var r = this.getRange(), cross;
		if (!r) {
			return new cError(cErrorType.wrong_name);
		}
		cross = r.cross(arg);
		if (cross) {
			if (undefined !== cross.r) {
				return this.getValue2(cross.r - this.getBBox0().r1, 0);
			} else if (undefined !== cross.c) {
				return this.getValue2(0, cross.c - this.getBBox0().c1);
			}
		}
		return new cError(cErrorType.wrong_value_type);
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
	cArea.prototype.foreach = function (action) {
		var r = this.getRange();
		if (r) {
			r._foreach2(action);
		}
	};
	cArea.prototype.foreach2 = function (action) {
		var r = this.getRange();
		if (r) {
			r._foreach2(function (cell) {
				action(checkTypeCell(cell), cell);
			});
		}
	};
	cArea.prototype.getMatrix = function (excludeHiddenRows, excludeErrorsVal, excludeNestedStAg) {
		var arr = [], r = this.getRange();
		r._foreach2(function (cell, i, j, r1, c1) {
			if (!arr[i - r1]) {
				arr[i - r1] = [];
			}

			var bIsFoundNestedStAg = false;
			var resValue = new cEmpty();
			if(excludeNestedStAg && cell.formulaParsed && cell.formulaParsed.outStack){
				var outStack = cell.formulaParsed.outStack;
				for(var n = 0; n < outStack.length; n++){
					if(outStack[n] instanceof AscCommonExcel.cAGGREGATE || outStack[n] instanceof AscCommonExcel.cSUBTOTAL){
						bIsFoundNestedStAg = true;
						break;
					}
				}
			}
			if(!bIsFoundNestedStAg){
				var checkTypeVal = checkTypeCell(cell);
				if(!(excludeErrorsVal && CellValueType.Error === checkTypeVal.type)){
					resValue = checkTypeVal;
				}
			}

			arr[i - r1][j - c1] = resValue;
		});
		return arr;
	};
	cArea.prototype.getValuesNoEmpty = function (checkExclude, excludeHiddenRows, excludeErrorsVal, excludeNestedStAg) {
		var arr = [], r = this.getRange();

		r._foreachNoEmpty(function (cell) {
			var bIsFoundNestedStAg = false;
			if(excludeNestedStAg && cell.formulaParsed && cell.formulaParsed.outStack){
				var outStack = cell.formulaParsed.outStack;
				for(var i = 0; i < outStack.length; i++){
					if(outStack[i] instanceof AscCommonExcel.cAGGREGATE || outStack[i] instanceof AscCommonExcel.cSUBTOTAL){
						bIsFoundNestedStAg = true;
						break;
					}
				}
			}
			if(!bIsFoundNestedStAg){
				var checkTypeVal = checkTypeCell(cell);
				if(!(excludeErrorsVal && CellValueType.Error === checkTypeVal.type)){
					arr.push(checkTypeVal);
				}
			}

		}, undefined, excludeHiddenRows);

		return [arr];
	};
	cArea.prototype.index = function (r, c) {
		var bbox = this.getBBox0();
		bbox.normalize();
		var box = {c1: 1, c2: bbox.c2 - bbox.c1 + 1, r1: 1, r2: bbox.r2 - bbox.r1 + 1};

		if (r < box.r1 || r > box.r2 || c < box.c1 || c > box.c2) {
			return new cError(cErrorType.bad_reference);
		}
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cArea3D(val, wsFrom, wsTo) {/*Area3D means "Sheat1!A1:E5" for example*/
		cBaseType.call(this, val);

		this.bbox = null;
		if (val) {
			var bbox = AscCommonExcel.g_oRangeCache.getAscRange(val);
			if (null != bbox) {
				this.bbox = bbox.clone();
			}
		}
		this.wsFrom = wsFrom;
		this.wsTo = wsTo || this.wsFrom;

		//dependenceRange allow change sheets and then independently removeDependencies
		this.dependenceRange = null;
	}

	cArea3D.prototype = Object.create(cBaseType.prototype);
	cArea3D.prototype.constructor = cArea3D;
	cArea3D.prototype.type = cElementType.cellsRange3D;
	cArea3D.prototype.clone = function () {
		var oRes = new cArea3D(null, this.wsFrom, this.wsTo);
		this.cloneTo(oRes);
		if (this.bbox) {
			oRes.bbox = this.bbox.clone();
		}
		return oRes;
	};
	cArea3D.prototype.wsRange = function () {
		var wb = this.wsFrom.workbook;
		var wsF = this.wsFrom.getIndex(), wsL = this.wsTo.getIndex(), r = [];
		for (var i = wsF; i <= wsL; i++) {
			r.push(wb.getWorksheet(i));
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
		if (!this.isSingleSheet()) {
			return null;
		}
		return (this.range(this.wsRange()))[0];
	};
	cArea3D.prototype.getRanges = function () {
		return (this.range(this.wsRange()));
	};
	cArea3D.prototype.getValue = function (checkExclude, excludeHiddenRows, excludeErrorsVal, excludeNestedStAg) {
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
		var _exclude;
		var _r = this.range(_wsA);
		for (i = 0; i < _r.length; i++) {
			if (!_r[i]) {
				_val.push(new cError(cErrorType.bad_reference));
				return _val;
			}
			if (checkExclude && !(_exclude = excludeHiddenRows)) {
				_exclude = _wsA[i].isApplyFilterBySheet();
			}

			_r[i]._foreachNoEmpty(function (cell) {
				var bIsFoundNestedStAg = false;
				if(excludeNestedStAg && cell.formulaParsed && cell.formulaParsed.outStack){
					var outStack = cell.formulaParsed.outStack;
					for(var i = 0; i < outStack.length; i++){
						if(outStack[i] instanceof AscCommonExcel.cAGGREGATE || outStack[i] instanceof AscCommonExcel.cSUBTOTAL){
							bIsFoundNestedStAg = true;
							break;
						}
					}
				}
				if(!bIsFoundNestedStAg){
					var checkTypeVal = checkTypeCell(cell);
					if(!(excludeErrorsVal && CellValueType.Error === checkTypeVal.type)){
						_val.push(checkTypeVal);
					}
				}

			}, undefined, _exclude);
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
	cArea3D.prototype.changeSheet = function (wsLast, wsNew) {
		if (this.wsFrom === wsLast) {
			this.wsFrom = wsNew;
		}
		if (this.wsTo === wsLast) {
			this.wsTo = wsNew;
		}
	};
	cArea3D.prototype.toString = function () {
		var wsFrom = this.wsFrom.getName();
		var wsTo = this.wsTo.getName();
		var name = this.bbox ? this.bbox.getName() : this.value;
		return parserHelp.get3DRef(wsFrom !== wsTo ? wsFrom + ':' + wsTo : wsFrom, name);
	};
	cArea3D.prototype.tocNumber = function () {
		return this.getValue()[0].tocNumber();
	};
	cArea3D.prototype.tocString = function () {
		return this.getValue()[0].tocString();
	};
	cArea3D.prototype.tocBool = function () {
		return new cError(cErrorType.wrong_value_type);
	};
	cArea3D.prototype.tocArea = function () {
		var wsR = this.wsRange();
		if (wsR.length == 1) {
			return new cArea(this.value, wsR[0]);
		}
		return false;
	};
	cArea3D.prototype.getWS = function () {
		return this.wsFrom;
	};
	cArea3D.prototype.cross = function (arg, ws) {
		if (!this.isSingleSheet()) {
			return new cError(cErrorType.wrong_value_type);
		}
		/*if ( this.wsFrom !== ws ) {
		 return new cError( cErrorType.wrong_value_type );
		 }*/
		var r = this.getRange();
		if (!r) {
			return new cError(cErrorType.wrong_name);
		}
		var cross = r.cross(arg);
		if (cross) {
			if (undefined !== cross.r) {
				return this.getValue2(new CellAddress(cross.r, this.getBBox0().c1, 0));
			} else if (undefined !== cross.c) {
				return this.getValue2(new CellAddress(this.getBBox0().r1, cross.c, 0));
			}
		}
		return new cError(cErrorType.wrong_value_type);
	};
	cArea3D.prototype.getBBox0 = function () {
		var range = this.getRange();
		return range ? range.getBBox0() : range;
	};
	cArea3D.prototype.isValid = function () {
		var r = this.getRanges();
		for (var i = 0; i < r.length; ++i) {
			if (!r) {
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
		var arr = [], r = this.getRanges(), res;
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
		return this.wsFrom === this.wsTo;
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cRef(val, ws) {/*Ref means A1 for example*/
		cBaseType.call(this, val);

		this.ws = ws;
		this.range = null;
		if (val) {
			this.range = ws.getRange2(val.replace(AscCommon.rx_space_g, ""));
		}
	}

	cRef.prototype = Object.create(cBaseType.prototype);
	cRef.prototype.constructor = cRef;
	cRef.prototype.type = cElementType.cell;
	cRef.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var oRes = new cRef(null, ws);
		this.cloneTo(oRes);
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
	cRef.prototype.isHidden = function (excludeHiddenRows) {
		if (!excludeHiddenRows) {
			excludeHiddenRows = this.ws.isApplyFilterBySheet();
		}
		return excludeHiddenRows && this.isValid() && this.ws.getRowHidden(this.getRange().r1);
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cRef3D(val, ws) {/*Ref means Sheat1!A1 for example*/
		cBaseType.call(this, val);

		this.ws = ws;
		this.range = null;
		if (val && this.ws) {
			this.range = this.ws.getRange2(val);
		}
	}

	cRef3D.prototype = Object.create(cBaseType.prototype);
	cRef3D.prototype.constructor = cRef3D;
	cRef3D.prototype.type = cElementType.cell3D;
	cRef3D.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var oRes = new cRef3D(null, null);
		this.cloneTo(oRes);
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
		if (this.ws) {
			if (this.range) {
				return this.range;
			}
			return this.range = this.ws.getRange2(this.value);
		} else {
			return this.range = null;
		}
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
	cRef3D.prototype.changeSheet = function (wsLast, wsNew) {
		if (this.ws === wsLast) {
			this.ws = wsNew;
		}
	};
	cRef3D.prototype.toString = function () {
		return parserHelp.get3DRef(this.ws.getName(), this.value);
	};
	cRef3D.prototype.getWS = function () {
		return this.ws;
	};
	cRef3D.prototype.getMatrix = function () {
		return [[this.getValue()]];
	};
	cRef3D.prototype.getBBox0 = function () {
		var range = this.getRange();
		if (range) {
			return range.getBBox0();
		}
		return null;
	};
	cRef3D.prototype.isHidden = function (excludeHiddenRows) {
		if (!excludeHiddenRows) {
			excludeHiddenRows = this.ws.isApplyFilterBySheet();
		}
		var _r = this.getRange();
		return excludeHiddenRows && _r && this.ws.getRowHidden(_r.r1);
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cEmpty() {
		cBaseType.call(this, "");
	}

	cEmpty.prototype = Object.create(cBaseType.prototype);
	cEmpty.prototype.constructor = cEmpty;
	cEmpty.prototype.type = cElementType.empty;
	cEmpty.prototype.tocNumber = function () {
		return new cNumber(0);
	};
	cEmpty.prototype.tocBool = function () {
		return new cBool(false);
	};
	cEmpty.prototype.tocString = function () {
		return new cString("");
	};
	cEmpty.prototype.toString = function () {
		return "";
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cName(val, ws) {
		cBaseType.call(this, val);
		this.ws = ws;
	}

	cName.prototype = Object.create(cBaseType.prototype);
	cName.prototype.constructor = cName;
	cName.prototype.type = cElementType.name;
	cName.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var oRes = new cName(this.value, ws);
		this.cloneTo(oRes);
		return oRes;
	};
	cName.prototype.toRef = function (opt_bbox) {
		var defName = this.getDefName();
		if (!defName || !defName.ref) {
			return new cError(cErrorType.wrong_name);
		}
		return this.Calculate(undefined, opt_bbox);
	};
	cName.prototype.toString = function () {
		var defName = this.getDefName();
		if (defName) {
			return defName.name;
		} else {
			return this.value;
		}
	};
	cName.prototype.getValue = function () {
		return this.Calculate();
	};
	cName.prototype.getFormula = function () {
		var defName = this.getDefName();
		if (!defName || !defName.ref) {
			return new cError(cErrorType.wrong_name);
		}

		if (!defName.parsedRef) {
			return new cError(cErrorType.wrong_name);
		}
		return defName.parsedRef;
	};
	cName.prototype.Calculate = function () {
		var defName = this.getDefName();
		if (!defName || !defName.ref) {
			return new cError(cErrorType.wrong_name);
		}

		if (!defName.parsedRef) {
			return new cError(cErrorType.wrong_name);
		}
		//defName not linked to cell, use inherit range
		var offset;
		var bbox = arguments[1];
		if (bbox) {
			//offset - to support relative references in def names
			offset = {offsetRow: bbox.r1, offsetCol: bbox.c1};
		}
		return defName.parsedRef.calculate(this, bbox, offset);
	};
	cName.prototype.getDefName = function () {
		return this.ws ? this.ws.workbook.getDefinesNames(this.value, this.ws.getId()) : null;
	};
	cName.prototype.changeDefName = function (from, to) {
		var sheetId = this.ws ? this.ws.getId() : null;
		if (AscCommonExcel.getDefNameIndex(this.value) == AscCommonExcel.getDefNameIndex(from.name)) {
			if (null == from.sheetId) {
				//in case of changes in workbook defname should not be sheet defname
				var defName = this.getDefName();
				if (!(defName && null != defName.sheetId)) {
					this.value = to.name;
				}
			} else if (sheetId == from.sheetId) {
				this.value = to.name;
			}
		}
	};
	cName.prototype.getWS = function () {
		return this.ws;
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cStrucTable(val, wb, ws) {
		cBaseType.call(this, val);
		this.wb = wb;
		this.ws = ws;

		this.tableName = null;
		this.oneColumnIndex = null;
		this.colStartIndex = null;
		this.colEndIndex = null;
		this.reservedColumnIndex = null;
		this.hdtIndexes = null;
		this.hdtcstartIndex = null;
		this.hdtcendIndex = null;

		this.isDynamic = false;//#This row
		this.area = null;
	}

	cStrucTable.prototype = Object.create(cBaseType.prototype);
	cStrucTable.prototype.constructor = cStrucTable;
	cStrucTable.prototype.type = cElementType.table;
	cStrucTable.prototype.createFromVal = function (val, wb, ws) {
		var res = new cStrucTable(val[0], wb, ws);
		if (res._parseVal(val)) {
			res._updateArea(null, false);
		}
		return (res.area && res.area.type != cElementType.error) ? res : new cError(cErrorType.bad_reference);
	};
	cStrucTable.prototype.clone = function (opt_ws) {
		var ws = opt_ws ? opt_ws : this.ws;
		var wb = ws.workbook;
		var oRes = new cStrucTable(this.value, wb, ws);
		oRes.tableName = this.tableName;
		oRes.oneColumnIndex = this._cloneIndex(this.oneColumnIndex);
		oRes.colStartIndex = this._cloneIndex(this.colStartIndex);
		oRes.colEndIndex = this._cloneIndex(this.colEndIndex);
		oRes.reservedColumnIndex = this.reservedColumnIndex;
		if (this.hdtIndexes) {
			oRes.hdtIndexes = this.hdtIndexes.slice(0);
		}
		oRes.hdtcstartIndex = this._cloneIndex(this.hdtcstartIndex);
		oRes.hdtcendIndex = this._cloneIndex(this.hdtcendIndex);

		oRes.isDynamic = this.isDynamic;
		if (this.area) {
			if (this.area.clone) {
				oRes.area = this.area.clone(opt_ws);
			} else {
				oRes.area = this.area;
			}
		}
		this.cloneTo(oRes);
		return oRes;
	};
	cStrucTable.prototype._cloneIndex = function (val) {
		if (val) {
			return {wsID: val.wsID, index: val.index, name: val.name};
		} else {
			return val;
		}
	};
	cStrucTable.prototype.toRef = function (opt_bbox, opt_bConvertTableFormulaToRef) {
		//opt_bbox usefull only for #This row
		//case null == opt_bbox works like FormulaTablePartInfo.data
		var table = this.wb.getDefinesNames(this.tableName, this.ws ? this.ws.getId() : null);
		if (!table || !table.ref) {
			return new cError(cErrorType.wrong_name);
		}
		if (!this.area || this.isDynamic) {
			this._updateArea(opt_bbox, true, opt_bConvertTableFormulaToRef);
		}
		return this.area;
	};
	cStrucTable.prototype.toString = function () {
		return this._toString(false);
	};
	cStrucTable.prototype.toLocaleString = function () {
		return this._toString(true);
	};
	cStrucTable.prototype._toString = function (isLocal) {
		var tblStr, columns_1, columns_2;
		var table = this.wb.getDefinesNames(this.tableName, null);
		if (!table) {
			tblStr = this.tableName;
		} else {
			tblStr = table.name;
		}

		if (this.oneColumnIndex) {
			columns_1 = this.oneColumnIndex.name.replace(/([#[\]])/g, "'$1");
			tblStr += "[" + columns_1 + "]";
		} else if (this.colStartIndex && this.colEndIndex) {
			columns_1 = this.colStartIndex.name.replace(/([#[\]])/g, "'$1");
			columns_2 = this.colEndIndex.name.replace(/([#[\]])/g, "'$1");
			tblStr += "[[" + columns_1 + "]:[" + columns_2 + "]]";
		} else if (null != this.reservedColumnIndex) {
			tblStr += "[" + this._buildLocalTableString(this.reservedColumnIndex, isLocal) + "]";
		} else if (this.hdtIndexes || this.hdtcstartIndex || this.hdtcendIndex) {
			tblStr += '[';
			var i;
			for (i = 0; i < this.hdtIndexes.length; ++i) {
				if (0 != i) {
					if (isLocal) {
						tblStr += FormulaSeparators.functionArgumentSeparator;
					} else {
						tblStr += FormulaSeparators.functionArgumentSeparatorDef;
					}
				}
				tblStr += "[" + this._buildLocalTableString(this.hdtIndexes[i], isLocal) + "]";
			}
			if (this.hdtcstartIndex) {
				if (this.hdtIndexes.length > 0) {
					if (isLocal) {
						tblStr += FormulaSeparators.functionArgumentSeparator;
					} else {
						tblStr += FormulaSeparators.functionArgumentSeparatorDef;
					}
				}
				var hdtcstart = this.hdtcstartIndex.name.replace(/([#[\]])/g, "'$1");
				tblStr += "[" + hdtcstart + "]";
				if (this.hdtcendIndex) {
					var hdtcend = this.hdtcendIndex.name.replace(/([#[\]])/g, "'$1");
					tblStr += ":[" + hdtcend + "]";
				}
			}
			tblStr += ']';
		} else if (!isLocal) {
			tblStr += '[]';
		}
		return tblStr;
	};
	cStrucTable.prototype._parseVal = function (val) {
		var bRes = true, startCol, endCol;
		this.tableName = val['tableName'];
		if (val['oneColumn']) {
			startCol = val['oneColumn'].replace(/'([#[\]])/g, '$1');
			this.oneColumnIndex = this.wb.getTableIndexColumnByName(this.tableName, startCol);
			bRes = !!this.oneColumnIndex;
		} else if (val['columnRange']) {
			startCol = val['colStart'].replace(/'([#[\]])/g, '$1');
			endCol = val['colEnd'].replace(/'([#[\]])/g, '$1');
			if (!endCol) {
				endCol = startCol;
			}
			this.colStartIndex = this.wb.getTableIndexColumnByName(this.tableName, startCol);
			this.colEndIndex = this.wb.getTableIndexColumnByName(this.tableName, endCol);
			bRes = !!this.colStartIndex && !!this.colEndIndex;
		} else if (val['reservedColumn']) {
			this.reservedColumnIndex = parserHelp.getColumnTypeByName(val['reservedColumn']);
			if (AscCommon.FormulaTablePartInfo.thisRow == this.reservedColumnIndex ||
				AscCommon.FormulaTablePartInfo.headers == this.reservedColumnIndex ||
				AscCommon.FormulaTablePartInfo.totals == this.reservedColumnIndex) {
				this.isDynamic = true;
			}
		} else if (val['hdtcc']) {
			this.hdtIndexes = [];
			var hdtcstart = val['hdtcstart'];
			var hdtcend = val['hdtcend'];
			var re = /\[(.*?)\]/ig, m;
			while (null !== (m = re.exec(val['hdt']))) {
				var param = parserHelp.getColumnTypeByName(m[1]);
				if (AscCommon.FormulaTablePartInfo.thisRow == param ||
					AscCommon.FormulaTablePartInfo.headers == param || AscCommon.FormulaTablePartInfo.totals == param) {
					this.isDynamic = true;
				}
				this.hdtIndexes.push(param);
			}

			if (hdtcstart) {
				startCol = hdtcstart.replace(/'([#[\]])/g, '$1');
				this.hdtcstartIndex = this.wb.getTableIndexColumnByName(this.tableName, startCol);
				bRes = !!this.hdtcstartIndex;
				if (bRes && hdtcend) {
					endCol = hdtcend.replace(/'([#[\]])/g, '$1');
					this.hdtcendIndex = this.wb.getTableIndexColumnByName(this.tableName, endCol);
					bRes = !!this.hdtcendIndex;
				}
			}
		}
		return bRes;
	};
	cStrucTable.prototype._updateArea = function (bbox, toRef, bConvertTableFormulaToRef) {
		var paramObj = {param: null, startCol: null, endCol: null, cell: bbox, toRef: toRef, bConvertTableFormulaToRef: bConvertTableFormulaToRef};
		var isThisRow = false;
		var tableData;
		if (this.oneColumnIndex) {
			paramObj.param = AscCommon.FormulaTablePartInfo.columns;
			paramObj.startCol = this.oneColumnIndex.name;
		} else if (this.colStartIndex && this.colEndIndex) {
			paramObj.param = AscCommon.FormulaTablePartInfo.columns;
			paramObj.startCol = this.colStartIndex.name;
			paramObj.endCol = this.colEndIndex.name;
		} else if (null != this.reservedColumnIndex) {
			paramObj.param = this.reservedColumnIndex;
			isThisRow = AscCommon.FormulaTablePartInfo.thisRow == paramObj.param;
		} else if (this.hdtIndexes || this.hdtcstartIndex) {
			var data, range;
			if (this.hdtIndexes) {
				for (var i = 0; i < this.hdtIndexes.length; ++i) {
					paramObj.param = this.hdtIndexes[i];
					isThisRow = AscCommon.FormulaTablePartInfo.thisRow == paramObj.param;
					data = this.wb.getTableRangeForFormula(this.tableName, paramObj);
					if (!data) {
						return this._createAreaError(isThisRow);
					}

					if (range) {
						range.union2(data.range);
					} else {
						range = data.range;
					}
				}
			}

			if (this.hdtcstartIndex) {
				paramObj.param = AscCommon.FormulaTablePartInfo.columns;
				paramObj.startCol = this.hdtcstartIndex.name;
				paramObj.endCol = null;

				if (this.hdtcendIndex) {
					paramObj.endCol = this.hdtcendIndex.name;
				}
				data = this.wb.getTableRangeForFormula(this.tableName, paramObj);
				if (!data) {
					return this._createAreaError(isThisRow);
				}
				if (range) {
					var r1Abs = range.isAbsR1();
					var c1Abs = data.range.isAbsC1();
					var r2Abs = range.isAbsR2();
					var c2Abs = data.range.isAbsC2();
					range = new Asc.Range(data.range.c1, range.r1, data.range.c2, range.r2);
					range.setAbs(r1Abs, c1Abs, r2Abs, c2Abs);
				} else {
					range = data.range;
				}
			}

			tableData = data;
			tableData.range = range;
		} else {
			paramObj.param = AscCommon.FormulaTablePartInfo.data;
		}
		if (!tableData) {
			tableData = this.wb.getTableRangeForFormula(this.tableName, paramObj);
			if (!tableData) {
				return this._createAreaError(isThisRow);
			}
		}
		if (tableData.range) {
			var refName = tableData.range.getName();
			var wsFrom = this.wb.getWorksheetById(tableData.wsID);
			if (tableData.range.isOneCell()) {
				this.area = new cRef3D(refName, wsFrom);
			} else {
				this.area = new cArea3D(refName, wsFrom, wsFrom);
			}
		} else {
			this.area = new cError(cErrorType.bad_reference);
		}

		return this.area;
	};
	cStrucTable.prototype._createAreaError = function (isThisRow) {
		if (isThisRow) {
			return this.area = new cError(cErrorType.wrong_value_type);
		} else {
			return this.area = new cError(cErrorType.bad_reference);
		}
	};
	cStrucTable.prototype._buildLocalTableString = function (reservedColumn, local) {
		return parserHelp.getColumnNameByType(reservedColumn, local);
	};
	cStrucTable.prototype.changeDefName = function (from, to) {
		if (this.tableName == from.name) {
			this.tableName = to.name;
		}
	};
	cStrucTable.prototype.removeTableColumn = function (deleted) {
		if (this.oneColumnIndex) {
			if (deleted[this.oneColumnIndex.name]) {
				return true;
			} else {
				this.oneColumnIndex = this.wb.getTableIndexColumnByName(this.tableName, this.oneColumnIndex.name);
				if (!this.oneColumnIndex) {
					return true;
				}
			}
		}
		if (this.colStartIndex && this.colEndIndex) {
			if (deleted[this.colStartIndex.name]) {
				return true;
			} else {
				this.colStartIndex = this.wb.getTableIndexColumnByName(this.tableName, this.colStartIndex.name);
				if (!this.colStartIndex) {
					return true;
				}
			}
			if (deleted[this.colEndIndex.name]) {
				return true;
			} else {
				this.colEndIndex = this.wb.getTableIndexColumnByName(this.tableName, this.colEndIndex.name);
				if (!this.colEndIndex) {
					return true;
				}
			}
		}
		if (this.hdtcstartIndex) {
			if (deleted[this.hdtcstartIndex.name]) {
				return true;
			} else {
				this.hdtcstartIndex = this.wb.getTableIndexColumnByName(this.tableName, this.hdtcstartIndex.name);
				if (!this.hdtcstartIndex) {
					return true;
				}
			}
		}
		if (this.hdtcendIndex) {
			if (deleted[this.hdtcendIndex.name]) {
				return true;
			} else {
				this.hdtcendIndex = this.wb.getTableIndexColumnByName(this.tableName, this.hdtcendIndex.name);
				if (!this.hdtcendIndex) {
					return true;
				}
			}
		}
		return false;
	};
	cStrucTable.prototype.changeTableRef = function () {
		if (!this.isDynamic) {
			this._updateArea(null, false);
		}
	};
	cStrucTable.prototype.renameTableColumn = function () {
		var bRes = true;
		var columns1, columns2;
		if (this.oneColumnIndex) {
			columns1 = this.wb.getTableNameColumnByIndex(this.tableName, this.oneColumnIndex.index);
			if (columns1) {
				this.oneColumnIndex.name = columns1.columnName;
			} else {
				bRes = false;
			}
		} else if (this.colStartIndex && this.colEndIndex) {
			columns1 = this.wb.getTableNameColumnByIndex(this.tableName, this.colStartIndex.index);
			columns2 = this.wb.getTableNameColumnByIndex(this.tableName, this.colEndIndex.index);
			if (columns1 && columns2) {
				this.colStartIndex.name = columns1.columnName;
				this.colEndIndex.name = columns2.columnName;
			} else {
				bRes = false;
			}
		}
		if (this.hdtcstartIndex) {
			columns1 = this.wb.getTableNameColumnByIndex(this.tableName, this.hdtcstartIndex.index);
			if (columns1) {
				this.hdtcstartIndex.name = columns1.columnName;
			} else {
				bRes = false;
			}
		}
		if (this.hdtcendIndex) {
			columns1 = this.wb.getTableNameColumnByIndex(this.tableName, this.hdtcendIndex.index);
			if (columns1) {
				this.hdtcendIndex.name = columns1.columnName;
			} else {
				bRes = false;
			}
		}
		return bRes;
	};

	/**
	 * @constructor
	 * @extends {cName}
	 */
	function cName3D(val, ws) {
		cName.call(this, val, ws);
	}

	cName3D.prototype = Object.create(cName.prototype);
	cName3D.prototype.constructor = cName3D;
	cName3D.prototype.type = cElementType.name3D;
	cName3D.prototype.clone = function (opt_ws) {
		var ws;
		if (opt_ws && opt_ws.getName() === this.ws.getName()) {
			ws = opt_ws;
		} else {
			ws = this.ws;
		}
		var oRes = new cName3D(this.value, ws);
		this.cloneTo(oRes);
		return oRes;
	};
	cName3D.prototype.changeSheet = function (wsLast, wsNew) {
		if (this.ws === wsLast) {
			this.ws = wsNew;
		}
	};
	cName3D.prototype.toString = function () {
		return parserHelp.getEscapeSheetName(this.ws.getName()) + "!" + cName.prototype.toString.call(this);
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cArray() {
		cBaseType.call(this, undefined);
		this.array = [];
		this.rowCount = 0;
		this.countElementInRow = [];
		this.countElement = 0;
	}

	cArray.prototype = Object.create(cBaseType.prototype);
	cArray.prototype.constructor = cArray;
	cArray.prototype.type = cElementType.array;
	cArray.prototype.addRow = function () {
		this.array[this.array.length] = [];
		this.countElementInRow[this.rowCount++] = 0;
	};
	cArray.prototype.addElement = function (element) {
		if (this.array.length === 0) {
			this.addRow();
		}
		var arr = this.array, subArr = arr[this.rowCount - 1];
		subArr[subArr.length] = element;
		this.countElementInRow[this.rowCount - 1]++;
		this.countElement++;
	};
	cArray.prototype.getRow = function (rowIndex) {
		if (rowIndex < 0 || rowIndex > this.array.length - 1) {
			return null;
		}
		return this.array[rowIndex];
	};
	cArray.prototype.getCol = function (colIndex) {
		var col = [];
		for (var i = 0; i < this.rowCount; i++) {
			col.push(this.array[i][colIndex]);
		}
		return col;
	};
	cArray.prototype.getElementRowCol = function (row, col) {
		if (row > this.rowCount || col > this.getCountElementInRow()) {
			return new cError(cErrorType.not_available);
		}
		return this.array[row][col];
	};
	cArray.prototype.getElement = function (index) {
		for (var i = 0; i < this.rowCount; i++) {
			if (index > this.countElementInRow[i].length) {
				index -= this.countElementInRow[i].length;
			} else {
				return this.array[i][index];
			}
		}
		return null;
	};
	cArray.prototype.foreach = function (action) {
		if (typeof (action) !== 'function') {
			return true;
		}
		for (var ir = 0; ir < this.rowCount; ir++) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
				if (action.call(this, this.array[ir][ic], ir, ic)) {
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
		for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
				retArr.addElement(this.array[ir][ic].tocNumber());
			}
			if (ir === this.rowCount - 1) {
				break;
			}
		}
		return retArr;
	};
	cArray.prototype.tocString = function () {
		var retArr = new cArray();
		for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
				retArr.addElement(this.array[ir][ic].tocString());
			}
			if (ir === this.rowCount - 1) {
				break;
			}
		}
		return retArr;
	};
	cArray.prototype.tocBool = function () {
		var retArr = new cArray();
		for (var ir = 0; ir < this.rowCount; ir++, retArr.addRow()) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++) {
				retArr.addElement(this.array[ir][ic].tocBool());
			}
			if (ir === this.rowCount - 1) {
				break;
			}
		}
		return retArr;
	};
	cArray.prototype.toString = function () {
		var ret = "";
		for (var ir = 0; ir < this.rowCount; ir++, ret += FormulaSeparators.arrayRowSeparatorDef) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++, ret += FormulaSeparators.arrayColSeparatorDef) {
				if (this.array[ir][ic] instanceof cString) {
					ret += '"' + this.array[ir][ic].toString() + '"';
				} else {
					ret += this.array[ir][ic].toString() + "";
				}
			}
			if (ret[ret.length - 1] === FormulaSeparators.arrayColSeparatorDef) {
				ret = ret.substring(0, ret.length - 1);
			}
		}
		if (ret[ret.length - 1] === FormulaSeparators.arrayRowSeparatorDef) {
			ret = ret.substring(0, ret.length - 1);
		}
		return "{" + ret + "}";
	};
	cArray.prototype.toLocaleString = function (digitDelim) {
		var ret = "";
		for (var ir = 0; ir < this.rowCount;
			 ir++, ret += digitDelim ? FormulaSeparators.arrayRowSeparator : FormulaSeparators.arrayRowSeparatorDef) {
			for (var ic = 0; ic < this.countElementInRow[ir]; ic++, ret +=
				digitDelim ? FormulaSeparators.arrayColSeparator : FormulaSeparators.arrayColSeparatorDef) {
				if (this.array[ir][ic] instanceof cString) {
					ret += '"' + this.array[ir][ic].toLocaleString(digitDelim) + '"';
				} else {
					ret += this.array[ir][ic].toLocaleString(digitDelim) + "";
				}
			}
			if (ret[ret.length - 1] === digitDelim ? FormulaSeparators.arrayColSeparator :
					FormulaSeparators.arrayColSeparatorDef) {
				ret = ret.substring(0, ret.length - 1);
			}
		}
		if (ret[ret.length - 1] === digitDelim ? FormulaSeparators.arrayRowSeparator :
				FormulaSeparators.arrayRowSeparatorDef) {
			ret = ret.substring(0, ret.length - 1);
		}
		return "{" + ret + "}";
	};
	cArray.prototype.isValidArray = function () {
		if (this.countElement < 1) {
			return false;
		}
		for (var i = 0; i < this.rowCount - 1; i++) {
			if (this.countElementInRow[i] - this.countElementInRow[i + 1] !== 0) {
				return false;
			}
		}
		return true;
	};
	cArray.prototype.getValue2 = function (i, j) {
		var result = this.array[i];
		return result ? result[j] : result;
	};
	cArray.prototype.getMatrix = function () {
		return this.array;
	};
	cArray.prototype.fillFromArray = function (arr) {
		this.array = arr;
		this.rowCount = arr.length;
		for (var i = 0; i < arr.length; i++) {
			this.countElementInRow[i] = arr[i].length;
			this.countElement += arr[i].length;
		}
	};

	/**
	 * @constructor
	 * @extends {cBaseType}
	 */
	function cUndefined() {
		this.value = undefined;
	}

	cUndefined.prototype = Object.create(cBaseType.prototype);
	cUndefined.prototype.constructor = cUndefined;

	function checkTypeCell(cell) {
		if (cell && !cell.isNullText()) {
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
		this.argumentsCurrent = (argumentCount !== undefined) ? argumentCount : 2;
		this.value = null;
	}

	cBaseOperator.prototype.type = cElementType.operator;
	cBaseOperator.prototype.numFormat = cNumFormatFirstCell;
	cBaseOperator.prototype.rightAssociative = false;
	cBaseOperator.prototype.toString = function () {
		return this.name;
	};
	cBaseOperator.prototype.Calculate = function () {
		return null;
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
	cBaseOperator.prototype._convertAreaToArray = function (areaArr) {
		var res = [];
		for(var i = 0; i < areaArr.length; i++){
			var elem = areaArr[i];
			if(elem instanceof cArea || elem instanceof cArea3D){
				elem = convertAreaToArray(elem);
			}
			res.push(elem);
		}

		if(!res.length){
			res = areaArr;
		}

		return res;
	};

	/** @constructor */
	function cBaseFunction() {
	}

	cBaseFunction.prototype.type = cElementType.func;
	cBaseFunction.prototype.argumentsMin = 0;
	cBaseFunction.prototype.argumentsMax = 255;
	cBaseFunction.prototype.numFormat = cNumFormatFirstCell;
	cBaseFunction.prototype.ca = false;
	cBaseFunction.prototype.excludeHiddenRows = false;
	cBaseFunction.prototype.excludeErrorsVal = false;
	cBaseFunction.prototype.excludeNestedStAg = false;
	cBaseFunction.prototype.name = null;
	cBaseFunction.prototype.Calculate = function () {
		return new cError(cErrorType.wrong_name);
	};
	cBaseFunction.prototype.Assemble2 = function (arg, start, count) {

		var str = "", c = start + count - 1;
		for (var i = start; i <= c; i++) {
			if(!arg[i]) {
				continue;
			}
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
			if(!arg[i]) {
				continue;
			}
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
	cBaseFunction.prototype.setCalcValue = function (arg, numFormat) {
		if (numFormat !== null && numFormat !== undefined) {
			arg.numFormat = numFormat;
		}
		return arg;
	};
	cBaseFunction.prototype.checkArguments = function (countArguments) {
		return this.argumentsMin <= countArguments && countArguments <= this.argumentsMax;
	};
	cBaseFunction.prototype._findArrayInNumberArguments = function (oArguments, calculateFunc, dNotCheckNumberType){
		var argsArray = [];
		var inputArguments = oArguments.args;
		var findArgArrayIndex = oArguments.indexArr;

		var parseArray = function(array){
			array.foreach(function (elem, r, c) {

				var arg;
				argsArray = [];
				for(var j = 0; j < inputArguments.length; j++){
					if(i === j){
						arg = elem;
					}else if(cElementType.array === inputArguments[j].type){
						arg = inputArguments[j].getElementRowCol(r, c);
					}else{
						arg = inputArguments[j];
					}

					if(arg && ((dNotCheckNumberType) || (cElementType.number === arg.type && !dNotCheckNumberType))){
						argsArray[j] = arg.getValue();
					}else{
						argsArray = null;
						break;
					}
				}

				this.array[r][c] = null === argsArray ? new cError(cErrorType.wrong_value_type) : calculateFunc(argsArray);
			});
			return array;
		};

		if(null !== findArgArrayIndex){
			return parseArray(inputArguments[findArgArrayIndex]);
		}else{
			for(var i = 0; i < inputArguments.length; i++){
				if(cElementType.string === inputArguments[i].type && !dNotCheckNumberType){
					return new cError(cErrorType.wrong_value_type);
				}else{
					if(inputArguments[i].getValue){
						argsArray[i] = inputArguments[i].getValue();
					}else{
						argsArray[i] = inputArguments[i];
					}
				}
			}
		}

		return calculateFunc(argsArray);
	};
	cBaseFunction.prototype._prepareArguments = function (args, arg1, bAddFirstArrElem, typeArray) {
		var newArgs = [];
		var indexArr = null;

		for(var i = 0; i < args.length; i++){
			var arg = args[i];

			//для массивов отдельная ветка
			if(typeArray && cElementType.array === typeArray[i])
			{
				if (cElementType.cellsRange === arg.type || cElementType.array === arg.type) {
					newArgs[i] = arg.getMatrix(this.excludeHiddenRows, this.excludeErrorsVal, this.excludeNestedStAg);
				} else if (cElementType.cellsRange3D === arg.type) {
					newArgs[i] = arg.getMatrix(this.excludeHiddenRows, this.excludeErrorsVal, this.excludeNestedStAg)[0];
				} else {
					newArgs[i] = new cError(cErrorType.division_by_zero);
				}
			}else if (cElementType.cellsRange === arg.type || cElementType.cellsRange3D === arg.type) {
				newArgs[i] = arg.cross(arg1);
			}else if(cElementType.array === arg.type){
				if(bAddFirstArrElem){
					newArgs[i] = arg.getElementRowCol(0,0);
				}else{
					indexArr = i;
					newArgs[i] = arg;
				}
			}else{
				newArgs[i] = arg;
			}
		}

		return {args: newArgs, indexArr: indexArr};
	};
	cBaseFunction.prototype._checkErrorArg = function (argArray) {
		for (var i = 0; i < argArray.length; i++) {
			if (cElementType.error === argArray[i].type) {
				return argArray[i];
			}
		}
		return null;
	};
	cBaseFunction.prototype._getOneDimensionalArray = function (arg, type) {
		var res = [];

		var getValue = function(curArg){
			if(undefined === type || cElementType.string === type){
				return curArg.tocString().getValue();
			}else if( cElementType.number === type){
				return curArg.tocNumber().getValue();
			}
		};

		if (cElementType.cellsRange === arg.type || cElementType.cellsRange3D === arg.type || cElementType.array === arg.type) {

			if (cElementType.cellsRange === arg.type || cElementType.array === arg.type) {
				arg = arg.getMatrix();
			} else if (cElementType.cellsRange3D === arg.type) {
				arg = arg.getMatrix()[0];
			}

			for (var i = 0; i < arg.length; i++) {
				for (var j = 0; j < arg[i].length; j++) {
					if(cElementType.error === arg[i][j].type){
						return arg[i][j];
					}else{
						res.push(getValue(arg[i][j]));
					}
				}
			}
		}else{
			if(cElementType.error === arg.type){
				return arg;
			}else{
				res.push(getValue(arg));
			}
		}

		return res;
	};
	cBaseFunction.prototype.checkRef = function (arg) {
		var res = false;
		if (cElementType.cell3D === arg.type || cElementType.cell === arg.type || cElementType.cellsRange === arg.type ||
			cElementType.cellsRange3D === arg.type) {
			res = true;
		}
		return res;
	};

	/** @constructor */
	function cUnknownFunction(name) {
		this.name = name;
		this.isXLFN = null;
	}
	cUnknownFunction.prototype = Object.create(cBaseFunction.prototype);
	cUnknownFunction.prototype.constructor = cUnknownFunction;


	/** @constructor */
	function parentLeft() {
	}

	parentLeft.prototype.type = cElementType.operator;
	parentLeft.prototype.name = "(";
	parentLeft.prototype.argumentsCurrent = 1;
	parentLeft.prototype.toString = function () {
		return this.name;
	};
	parentLeft.prototype.Assemble2 = function (arg, start, count) {
		return new cString("(" + arg[start + count - 1] + ")");
	};
	parentLeft.prototype.Assemble2Locale = function (arg, start, count) {
		return this.Assemble2(arg, start, count);
	};

	/** @constructor */
	function parentRight() {
	}

	parentRight.prototype.type = cElementType.operator;
	parentRight.prototype.name =  ")";
	parentRight.prototype.toString = function () {
		return this.name;
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cRangeUnionOperator() {
	}

	cRangeUnionOperator.prototype = Object.create(cBaseOperator.prototype);
	cRangeUnionOperator.prototype.constructor = cRangeUnionOperator;
	cRangeUnionOperator.prototype.name = ':';
	cRangeUnionOperator.prototype.priority = 50;
	cRangeUnionOperator.prototype.argumentsCurrent = 2;
	cRangeUnionOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], ws0, ws1, ws, res;
		if (( cElementType.cell === arg0.type || cElementType.cellsRange === arg0.type ||
			cElementType.cell3D === arg0.type ||
			cElementType.cellsRange3D === arg0.type && (ws0 = arg0.wsFrom) === arg0.wsTo ) &&
			( cElementType.cell === arg1.type || cElementType.cellsRange === arg1.type ||
			cElementType.cell3D === arg1.type ||
			cElementType.cellsRange3D === arg1.type && (ws1 = arg1.wsFrom) === arg1.wsTo )) {

			if (cElementType.cellsRange3D === arg0.type) {
				ws0 = ws = arg0.wsFrom;
			} else {
				ws0 = ws = arg0.getWS();
			}

			if (cElementType.cellsRange3D === arg1.type) {
				ws1 = ws = arg1.wsFrom;
			} else {
				ws1 = ws = arg1.getWS();
			}

			if (ws0 !== ws1) {
				return new cError(cErrorType.wrong_value_type);
			}

			arg0 = arg0.getBBox0();
			arg1 = arg1.getBBox0();
			if (!arg0 || !arg1) {
				return new cError(cErrorType.wrong_value_type);
			}
			arg0 = arg0.union(arg1);
			arg0.normalize(true);
			res = arg0.isOneCell() ? new cRef(arg0.getName(), ws) : new cArea(arg0.getName(), ws);
		} else {
			res = new cError(cErrorType.wrong_value_type);
		}

		return res;
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cRangeIntersectionOperator() {
	}

	cRangeIntersectionOperator.prototype = Object.create(cBaseOperator.prototype);
	cRangeIntersectionOperator.prototype.constructor = cRangeIntersectionOperator;
	cRangeIntersectionOperator.prototype.name = ' ';
	cRangeIntersectionOperator.prototype.priority = 50;
	cRangeIntersectionOperator.prototype.argumentsCurrent = 2;
	cRangeIntersectionOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], ws0, ws1, ws, res;
		if (( cElementType.cell === arg0.type || cElementType.cellsRange === arg0.type ||
			cElementType.cell3D === arg0.type ||
			cElementType.cellsRange3D === arg0.type && (ws0 = arg0.wsFrom) == arg0.wsTo ) &&
			( cElementType.cell === arg1.type || cElementType.cellsRange === arg1.type ||
			cElementType.cell3D === arg1.type ||
			cElementType.cellsRange3D === arg1.type && (ws1 = arg1.wsFrom) == arg1.wsTo )) {

			if (cElementType.cellsRange3D === arg0.type) {
				ws0 = ws = arg0.wsFrom;
			} else {
				ws0 = ws = arg0.getWS();
			}

			if (cElementType.cellsRange3D === arg1.type) {
				ws1 = ws = arg1.wsFrom;
			} else {
				ws1 = ws = arg1.getWS();
			}

			if (ws0 !== ws1) {
				return new cError(cErrorType.wrong_value_type);
			}

			arg0 = arg0.getBBox0();
			arg1 = arg1.getBBox0();
			if (!arg0 || !arg1) {
				return new cError(cErrorType.wrong_value_type);
			}
			arg0 = arg0.intersection(arg1);
			if (arg0) {
				arg0.normalize(true);
				res = arg0.isOneCell() ? new cRef(arg0.getName(), ws) : new cArea(arg0.getName(), ws);
			} else {
				res = new cError(cErrorType.null_value);
			}
		} else {
			res = new cError(cErrorType.wrong_value_type);
		}

		return res;
	};


	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cUnarMinusOperator() {
	}

	cUnarMinusOperator.prototype = Object.create(cBaseOperator.prototype);
	cUnarMinusOperator.prototype.constructor = cUnarMinusOperator;
	cUnarMinusOperator.prototype.name = 'un_minus';
	cUnarMinusOperator.prototype.priority = 49;
	cUnarMinusOperator.prototype.argumentsCurrent = 1;
	cUnarMinusOperator.prototype.rightAssociative = true;
	cUnarMinusOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (arrElem, r, c) {
				arrElem = arrElem.tocNumber();
				arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(-arrElem.getValue());
			});
			return arg0;
		}
		arg0 = arg0.tocNumber();
		return arg0 instanceof cError ? arg0 : new cNumber(-arg0.getValue());
	};
	cUnarMinusOperator.prototype.toString = function () {        // toString function
		return '-';
	};
	cUnarMinusOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString("-" + arg[start + count - 1]);
	};
	cUnarMinusOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString("-" + arg[start + count - 1]);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cUnarPlusOperator() {
	}

	cUnarPlusOperator.prototype = Object.create(cBaseOperator.prototype);
	cUnarPlusOperator.prototype.constructor = cUnarPlusOperator;
	cUnarPlusOperator.prototype.name = 'un_plus';
	cUnarPlusOperator.prototype.priority = 49;
	cUnarPlusOperator.prototype.argumentsCurrent = 1;
	cUnarPlusOperator.prototype.rightAssociative = true;
	cUnarPlusOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		return arg0;
	};
	cUnarPlusOperator.prototype.toString = function () {
		return '+';
	};
	cUnarPlusOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString("+" + arg[start + count - 1]);
	};
	cUnarPlusOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString("+" + arg[start + count - 1]);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cAddOperator() {
	}

	cAddOperator.prototype = Object.create(cBaseOperator.prototype);
	cAddOperator.prototype.constructor = cAddOperator;
	cAddOperator.prototype.name = '+';
	cAddOperator.prototype.priority = 20;
	cAddOperator.prototype.argumentsCurrent = 2;
	cAddOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return _func[arg0.type][arg1.type](arg0, arg1, "+", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cMinusOperator() {
	}

	cMinusOperator.prototype = Object.create(cBaseOperator.prototype);
	cMinusOperator.prototype.constructor = cMinusOperator;
	cMinusOperator.prototype.name = '-';
	cMinusOperator.prototype.priority = 20;
	cMinusOperator.prototype.argumentsCurrent = 2;
	cMinusOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return _func[arg0.type][arg1.type](arg0, arg1, "-", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cPercentOperator() {
	}

	cPercentOperator.prototype = Object.create(cBaseOperator.prototype);
	cPercentOperator.prototype.constructor = cPercentOperator;
	cPercentOperator.prototype.name = '%';
	cPercentOperator.prototype.priority = 45;
	cPercentOperator.prototype.argumentsCurrent = 1;
	cPercentOperator.prototype.rightAssociative = true;
	cPercentOperator.prototype.Calculate = function (arg) {
		var res, arg0 = arg[0];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (arrElem, r, c) {
				arrElem = arrElem.tocNumber();
				arg0.array[r][c] = arrElem instanceof cError ? arrElem : new cNumber(arrElem.getValue() / 100);
			});
			return arg0;
		}
		arg0 = arg0.tocNumber();
		res = arg0 instanceof cError ? arg0 : new cNumber(arg0.getValue() / 100);
		res.numFormat = 9;
		return res;
	};
	cPercentOperator.prototype.Assemble2 = function (arg, start, count) {
		return new cString(arg[start + count - 1] + this.name);
	};
	cPercentOperator.prototype.Assemble2Locale = function (arg, start, count) {
		return new cString(arg[start + count - 1] + this.name);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cPowOperator() {
	}

	cPowOperator.prototype = Object.create(cBaseOperator.prototype);
	cPowOperator.prototype.numFormat = cNumFormatNone;
	cPowOperator.prototype.constructor = cPowOperator;
	cPowOperator.prototype.name = '^';
	cPowOperator.prototype.priority = 40;
	cPowOperator.prototype.argumentsCurrent = 2;
	cPowOperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocNumber();
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg1 = arg1.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		var _v = Math.pow(arg0.getValue(), arg1.getValue());
		if (isNaN(_v)) {
			return new cError(cErrorType.not_numeric);
		} else if (_v === Number.POSITIVE_INFINITY) {
			return new cError(cErrorType.division_by_zero);
		}
		return new cNumber(_v);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cMultOperator() {
	}

	cMultOperator.prototype = Object.create(cBaseOperator.prototype);
	cMultOperator.prototype.numFormat = cNumFormatNone;
	cMultOperator.prototype.constructor = cMultOperator;
	cMultOperator.prototype.name = '*';
	cMultOperator.prototype.priority = 30;
	cMultOperator.prototype.argumentsCurrent = 2;
	cMultOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return _func[arg0.type][arg1.type](arg0, arg1, "*", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cDivOperator() {
	}

	cDivOperator.prototype = Object.create(cBaseOperator.prototype);
	cDivOperator.prototype.numFormat = cNumFormatNone;
	cDivOperator.prototype.constructor = cDivOperator;
	cDivOperator.prototype.name = '/';
	cDivOperator.prototype.priority = 30;
	cDivOperator.prototype.argumentsCurrent = 2;
	cDivOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		return _func[arg0.type][arg1.type](arg0, arg1, "/", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cConcatSTROperator() {
	}

	cConcatSTROperator.prototype = Object.create(cBaseOperator.prototype);
	cConcatSTROperator.prototype.constructor = cConcatSTROperator;
	cConcatSTROperator.prototype.name = '&';
	cConcatSTROperator.prototype.priority = 15;
	cConcatSTROperator.prototype.argumentsCurrent = 2;
	cConcatSTROperator.prototype.numFormat = cNumFormatNone;
	cConcatSTROperator.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		}
		arg0 = arg0.tocString();
		if (arg1 instanceof cArea) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		}
		arg1 = arg1.tocString();

		return arg0 instanceof cError ? arg0 :
			arg1 instanceof cError ? arg1 : new cString(arg0.toString().concat(arg1.toString()));
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cEqualsOperator() {
	}

	cEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
	cEqualsOperator.prototype.constructor = cEqualsOperator;
	cEqualsOperator.prototype.name = '=';
	cEqualsOperator.prototype.priority = 10;
	cEqualsOperator.prototype.argumentsCurrent = 2;
	cEqualsOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, "=", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cNotEqualsOperator() {
	}

	cNotEqualsOperator.prototype = Object.create(cBaseOperator.prototype);
	cNotEqualsOperator.prototype.constructor = cNotEqualsOperator;
	cNotEqualsOperator.prototype.name = '<>';
	cNotEqualsOperator.prototype.priority = 10;
	cNotEqualsOperator.prototype.argumentsCurrent = 2;
	cNotEqualsOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, "<>", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cLessOperator() {
	}

	cLessOperator.prototype = Object.create(cBaseOperator.prototype);
	cLessOperator.prototype.constructor = cLessOperator;
	cLessOperator.prototype.name = '<';
	cLessOperator.prototype.priority = 10;
	cLessOperator.prototype.argumentsCurrent = 2;
	cLessOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, "<", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cLessOrEqualOperator() {
	}

	cLessOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
	cLessOrEqualOperator.prototype.constructor = cLessOrEqualOperator;
	cLessOrEqualOperator.prototype.name = '<=';
	cLessOrEqualOperator.prototype.priority = 10;
	cLessOrEqualOperator.prototype.argumentsCurrent = 2;
	cLessOrEqualOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, "<=", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cGreaterOperator() {
	}

	cGreaterOperator.prototype = Object.create(cBaseOperator.prototype);
	cGreaterOperator.prototype.constructor = cGreaterOperator;
	cGreaterOperator.prototype.name = '>';
	cGreaterOperator.prototype.priority = 10;
	cGreaterOperator.prototype.argumentsCurrent = 2;
	cGreaterOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, ">", arguments[1], bIsSpecialFunction);
	};

	/**
	 * @constructor
	 * @extends {cBaseOperator}
	 */
	function cGreaterOrEqualOperator() {
	}

	cGreaterOrEqualOperator.prototype = Object.create(cBaseOperator.prototype);
	cGreaterOrEqualOperator.prototype.constructor = cGreaterOrEqualOperator;
	cGreaterOrEqualOperator.prototype.name = '>=';
	cGreaterOrEqualOperator.prototype.priority = 10;
	cGreaterOrEqualOperator.prototype.argumentsCurrent = 2;
	cGreaterOrEqualOperator.prototype.Calculate = function (arg, opt_bbox, opt_defName, ws, bIsSpecialFunction) {
		var arg0 = arg[0], arg1 = arg[1];

		if(bIsSpecialFunction){
			var convertArgs = this._convertAreaToArray([arg0, arg1]);
			arg0 = convertArgs[0];
			arg1 = convertArgs[1];
		}

		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			arg0 = arg0.getValue();
		}
		if (cElementType.cellsRange === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1], arguments[3]);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}
		return _func[arg0.type][arg1.type](arg0, arg1, ">=", arguments[1], bIsSpecialFunction);
	};

	/** @constructor */
	function cSpecialOperandStart() {
	}

	cSpecialOperandStart.prototype.constructor = cSpecialOperandStart;
	cSpecialOperandStart.prototype.type = cElementType.specialFunctionStart;

	/** @constructor */
	function cSpecialOperandEnd() {
	}

	cSpecialOperandEnd.prototype.constructor = cSpecialOperandEnd;
	cSpecialOperandEnd.prototype.type = cElementType.specialFunctionEnd;


	/* cFormulaOperators is container for holding all ECMA-376 operators, see chapter $18.17.2.2 in "ECMA-376, Second Edition, Part 1 - Fundamentals And Markup Language Reference" */
	var cFormulaOperators = {
		'(': parentLeft,
		')': parentRight,
		'{': function () {
			var r = {};
			r.name = '{';
			r.toString = function () {
				return this.name;
			};
			return r;
		},
		'}': function () {
			var r = {};
			r.name = '}';
			r.toString = function () {
				return this.name;
			};
			return r;
		}, /* 50 is highest priority */
		':': cRangeUnionOperator,
		' ': cRangeIntersectionOperator,
		'un_minus': cUnarMinusOperator,
		'un_plus': cUnarPlusOperator,
		'%': cPercentOperator,
		'^': cPowOperator,
		'*': cMultOperator,
		'/': cDivOperator,
		'+': cAddOperator,
		'-': cMinusOperator,
		'&': cConcatSTROperator /*concat str*/,
		'=': cEqualsOperator/*equals*/,
		'<>': cNotEqualsOperator,
		'<': cLessOperator,
		'<=': cLessOrEqualOperator,
		'>': cGreaterOperator,
		'>=': cGreaterOrEqualOperator
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
		for (var type in cFormulaFunctionGroup) {
			b = new AscCommon.asc_CFormulaGroup(type);
			for (var i = 0; i < cFormulaFunctionGroup[type].length; ++i) {
				a = new cFormulaFunctionGroup[type][i]();
				//cFormulaFunctionGroup['NotRealised'] - массив ещё не реализованных формул
				if (-1 === cFormulaFunctionGroup['NotRealised'].indexOf(cFormulaFunctionGroup[type][i])) {
					f = new AscCommon.asc_CFormula(a);
					b.asc_addFormulaElement(f);
					cFormulaFunction[f.asc_getName()] = cFormulaFunctionGroup[type][i];
				}
				cAllFormulaFunction[a.name] = cFormulaFunctionGroup[type][i];
			}
			list.push(b);
		}
		return list;
	}
	function getRangeByRef(ref, ws, onlyRanges) {
		// ToDo in parser formula
		if (ref[0] === '(') {
			ref = ref.slice(1);
		}
		if (ref[ref.length - 1] === ')') {
			ref = ref.slice(0, -1);
		}
		var activeCell = ws.selectionRange.activeCell;
		var bbox = new Asc.Range(activeCell.col, activeCell.row, activeCell.col, activeCell.row);
		// ToDo in parser formula
		var ranges = [];
		var arrRefs = ref.split(',');
		arrRefs.forEach(function (refItem) {
			// ToDo in parser formula
			var currentWorkbook = '[0]!';
			if (0 === refItem.indexOf(currentWorkbook)) {
				refItem = refItem.slice(currentWorkbook.length);
			}

			var _f = new AscCommonExcel.parserFormula(refItem, null, ws);
			var refPos = [];
			if (_f.parse(null, null, refPos)) {
				refPos.forEach(function (item) {
					var ref;
					switch (item.oper.type) {
						case cElementType.table:
						case cElementType.name:
						case cElementType.name3D:
							ref = item.oper.toRef(bbox);
							break;
						case cElementType.cell:
						case cElementType.cell3D:
						case cElementType.cellsRange:
						case cElementType.cellsRange3D:
							ref = item.oper;
							break;
					}
					if (ref) {
						switch(ref.type) {
							case cElementType.cell:
							case cElementType.cell3D:
							case cElementType.cellsRange:
							case cElementType.cellsRange3D:
								ranges.push(ref.getRange());
								break;
							case cElementType.array:
								if (!onlyRanges) {
									ranges = ref.getMatrix();
								}
								break;
						}
					}
				});
			}
		});
		return ranges;
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
	var compareNumbers = function(){
		return AscCommon.compareNumbers(arg0.getValue(), arg1.getValue());
	};
	if ( what === ">" ) {
		return new cBool( compareNumbers() > 0 );
  } else if (what === ">=") {
		return new cBool( !(compareNumbers() < 0) );
  } else if (what === "<") {
		return new cBool( compareNumbers() < 0 );
  } else if (what === "<=") {
		return new cBool( !(compareNumbers() > 0) );
  } else if (what === "=") {
		return new cBool( compareNumbers() === 0 );
  } else if (what === "<>") {
		return new cBool( compareNumbers() !== 0 );
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
      _func[cElementType.cellsRange][cElementType.empty] = function(arg0, arg1, what, bbox) {
            var cross = arg0.cross( bbox );
            return _func[cross.type][arg1.type]( cross, arg1, what );
        };


_func[cElementType.number][cElementType.cellsRange] = _func[cElementType.string][cElementType.cellsRange] =
    _func[cElementType.bool][cElementType.cellsRange] = _func[cElementType.error][cElementType.cellsRange] =
    _func[cElementType.array][cElementType.cellsRange] =
      _func[cElementType.empty][cElementType.cellsRange] = function(arg0, arg1, what, bbox) {
            var cross = arg1.cross( bbox );
            return _func[arg0.type][cross.type]( arg0, cross, what );
        };


_func[cElementType.cellsRange][cElementType.cellsRange] = function ( arg0, arg1, what, bbox ) {
  var cross1 = arg0.cross(bbox), cross2 = arg1.cross(bbox);
    return _func[cross1.type][cross2.type]( cross1, cross2, what );
};

_func[cElementType.array][cElementType.array] = function ( arg0, arg1, what, bbox, bIsSpecialFunction ) {
	if (bIsSpecialFunction) {
		var specialArray = specialFuncArrayToArray(arg0, arg1, what);
		if(null !== specialArray){
			return specialArray;
		}
	}
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

_func[cElementType.number][cElementType.cell] = function ( arg0, arg1, what, bbox ) {
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
_func[cElementType.cell][cElementType.number] = function ( arg0, arg1, what, bbox ) {
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
_func[cElementType.cell][cElementType.cell] = function ( arg0, arg1, what, bbox ) {
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
    this.ws = _ws;
    this.wb = this.ws.workbook;
    this.value = null;
    this.outStack = [];
    this.error = [];
    this.Formula = formula;
    this.isParsed = false;
    //для функции parse и parseDiagramRef
    this.pCurrPos = 0;
    this.elemArr = [];
    this.operand_str = null;
    this.parenthesesNotEnough = false;
    this.f = [];
    this.countRef = 0;

	this.listenerId = lastListenerId++;
	this.ca = false;
	this.isDirty = false;
	this.isCalculate = false;
	this.calculateDefName = null;
	this.isTable = false;
	this.isInDependencies = false;
	this.parent = parent;
	this._index = undefined;

	if (AscFonts.IsCheckSymbols) {
		AscFonts.FontPickerByCharacter.getFontsByString(this.Formula);
	}
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
	parserFormula.prototype.setIsTable = function(isTable){
		this.isTable = isTable;
	};
	parserFormula.prototype.notify = function(data) {
		var eventData = {notifyData: data, assemble: null, formula: this};
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
			var needAssemble = true;
			this.removeDependencies();
			if (AscCommon.c_oNotifyType.Shift === data.type || AscCommon.c_oNotifyType.Move === data.type ||
				AscCommon.c_oNotifyType.Delete === data.type) {
				this.shiftCells(data.type, data.sheetId, data.bbox, data.offset);
			} else if (AscCommon.c_oNotifyType.ChangeDefName === data.type) {
				if (!data.to) {
					this.removeTableName(data.from, data.bConvertTableFormulaToRef);
				} else if (data.from.name != data.to.name) {
					this.changeDefName(data.from, data.to);
				} else if (data.from.isTable) {
					needAssemble = false;
					this.changeTableRef(data.from.name);
				}
			} else if (AscCommon.c_oNotifyType.DelColumnTable === data.type) {
				this.removeTableColumn(data.tableName, data.deleted);
			} else if (AscCommon.c_oNotifyType.RenameTableColumn === data.type) {
				this.renameTableColumn(data.tableName);
			} else if (AscCommon.c_oNotifyType.ChangeSheet === data.type) {
				needAssemble = false;
				var changeData = data.data;
				if (this.is3D || changeData.remove) {
					if (changeData.replace || changeData.remove) {
						if (changeData.remove) {
							needAssemble = this.removeSheet(changeData.remove, changeData.tableNamesMap, changeData.wsPrevName, changeData.wsNextName);
						} else {
							needAssemble = this.moveSheet(changeData.replace);
						}
					} else if (changeData.rename) {
						needAssemble = true;
					}
				}
			}
			if (needAssemble) {
				eventData.assemble = this.assemble(true);
			} else {
				eventData.assemble = this.Formula;
			}
			if (this.parent && this.parent.onFormulaEvent) {
				this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.ChangeFormula, eventData);
			}
			this.Formula = eventData.assemble;
			if (data.collectDependencies) {
				data.collectDependencies.push(this);
			} else {
				this.buildDependencies();
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
  oRes.operand_str = this.operand_str;
  oRes.error = this.error.concat();
  oRes.isParsed = this.isParsed;
  return oRes;
};
	parserFormula.prototype.getParent = function() {
		return this.parent;
	};
	parserFormula.prototype.getFormula = function() {
		return this.Formula;
	};
parserFormula.prototype.setFormula = function(formula) {
  this.Formula = formula;
  this.is3D = false;
  this.value = null;
  this.outStack = [];
  this.error = [];
  this.isParsed = false;
  //для функции parse
  this.pCurrPos = 0;
  this.elemArr = [];
  this.operand_str = null;
  this.parenthesesNotEnough = false;
  this.f = [];
  this.countRef = 0;
  this.ca = false;
  this.isDirty = false;
  this.isCalculate = false;
  this.calculateDefName = null;
  //this.isTable = false;
  this.isInDependencies = false;
};

	parserFormula.prototype.parse = function (local, digitDelim, refPos) {
		this.pCurrPos = 0;
		var needAssemble = false;
		var cFormulaList;

		var startSumproduct = false, counterSumproduct = 0;

		if (this.isParsed) {
			return this.isParsed;
		}

		if(!refPos){
			refPos = [];
		}
		/*
		 Парсер формулы реализует алгоритм перевода инфиксной формы записи выражения в постфиксную или Обратную Польскую Нотацию.
		 Что упрощает вычисление результата формулы.
		 При разборе формулы важен порядок проверки очередной части выражения на принадлежность тому или иному типу.
		 */

		if (false) {

			var getPrevElem = function(aTokens, pos){
				for(var n = pos - 1; n >=0; n--){
					if("" !== aTokens[n].value){
						return aTokens[n];
					}
				}
				return aTokens[pos - 1];
			};

			//console.log(this.Formula);
			cFormulaList =
				(local && AscCommonExcel.cFormulaFunctionLocalized) ? AscCommonExcel.cFormulaFunctionLocalized :
					cFormulaFunction;
			var aTokens = getTokens(this.Formula);
			if (null === aTokens) {
				this.outStack = [];
				this.error.push(c_oAscError.ID.FrmlWrongOperator);
				return false;
			}

			var stack = [], val, valUp, tmp, elem, len, indentCount = -1, args = [], prev, next, arr = null,
				bArrElemSign = false, wsF, wsT, arg_count;
			for (var i = 0, nLength = aTokens.length; i < nLength; ++i) {
				found_operand = null;
				val = aTokens[i].value;
				switch (aTokens[i].type) {
					case TOK_TYPE_OPERAND: {
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
											wsF = this.wb.getWorksheetByName(tmp.sheet);
											wsT = (null !== tmp.sheet2 && tmp.sheet !== tmp.sheet2) ?
												this.wb.getWorksheetByName(tmp.sheet2) : wsF;
											var name = tmp.getName().split("!")[1];
											elem = (tmp.isOneCell()) ? new cRef3D(name, wsF) :
												new cArea3D(name, wsF, wsT);
												refPos.push({start: aTokens[i].pos - aTokens[i].length,
													end: aTokens[i].pos,
													index: this.outStack.length,
													oper: elem});
										} else if(TOK_SUBTYPE_ERROR === aTokens[i].subtype) {
											elem = new cError(val);
										} else {
											this.error.push(c_oAscError.ID.FrmlWrongOperator);
											this.outStack = [];
											return false;
										}
									} else {
										tmp = AscCommonExcel.g_oRangeCache.getAscRange(valUp);
										if (tmp) {
											elem =
												tmp.isOneCell() ? new cRef(valUp, this.ws) : new cArea(valUp, this.ws);
											refPos.push({start: aTokens[i].pos - aTokens[i].length,
												end: aTokens[i].pos,
												index: this.outStack.length,
												oper: elem});
										} else if(TOK_SUBTYPE_ERROR === aTokens[i].subtype) {
											elem = new cError(val);
										} else {
											elem = new cName(aTokens[i].value, this.ws);
											refPos.push({start: aTokens[i].pos - aTokens[i].length,
												end: aTokens[i].pos,
												index: this.outStack.length,
												oper: elem});
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
					case TOK_TYPE_OP_IN: {
						if (TOK_SUBTYPE_UNION === aTokens[i].subtype) {
							this.outStack = [];
							this.error.push(c_oAscError.ID.FrmlWrongOperator);
							return false;
						}

						prev = getPrevElem(aTokens, i);
						if ('-' === val && (0 === i ||
							(TOK_TYPE_OPERAND !== prev.type && TOK_TYPE_OP_POST !== prev.type &&
							(TOK_SUBTYPE_STOP !== prev.subtype ||
							(TOK_TYPE_FUNCTION !== prev.type && TOK_TYPE_SUBEXPR !== prev.type))))) {
							elem = cFormulaOperators['un_minus'].prototype;
						} else {
							elem = cFormulaOperators[val].prototype;
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
							if (elem.rightAssociative ? (elem.priority < tmp.priority) :
									((elem.priority <= tmp.priority))) {
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
					case TOK_TYPE_FUNCTION: {
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
								elem = cFormulaList[val].prototype;
							} else if (val in cAllFormulaFunction) {
								elem = cAllFormulaFunction[val].prototype;
							} else {
								elem = new cUnknownFunction(val);
								elem.isXLFN = (0 === val.indexOf("_xlfn."));
							}
							if("SUMPRODUCT" === val){
								startSumproduct = true;

								counterSumproduct++;
								if(1 === counterSumproduct){
									this.outStack.push(cSpecialOperandStart.prototype);
								}
							}
							if (elem && elem.ca) {
								this.ca = elem.ca;
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
									arg_count = args[indentCount] -
										((prev && TOK_TYPE_FUNCTION === prev.type && TOK_SUBTYPE_START ===
											prev.subtype) ? 1 : 0);
									//this.outStack.push(arg_count);
									this.outStack.splice(this.outStack.length - 1, 0, arg_count);

									if(startSumproduct && "SUMPRODUCT" === tmp.name){
										counterSumproduct--;
										if(counterSumproduct < 1){
											startSumproduct = false;
											this.outStack.push(cSpecialOperandEnd.prototype);
										}
									}

									if (!tmp.checkArguments(arg_count)) {
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
					case TOK_TYPE_ARGUMENT: {
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
					case TOK_TYPE_SUBEXPR: {
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
					case TOK_TYPE_WSPACE: {
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

			if (this.outStack.length !== 0) {
				return this.isParsed = true;
			} else {
				return this.isParsed = false;
			}
		}

		this.operand_expected = true;
		var wasLeftParentheses = false, wasRigthParentheses = false, found_operand = null, _3DRefTmp = null, _tableTMP = null;
		cFormulaList = (local && AscCommonExcel.cFormulaFunctionLocalized) ? AscCommonExcel.cFormulaFunctionLocalized : cFormulaFunction;
		var leftParentArgumentsCurrentArr = [];

		var t = this;
		var parseOperators = function(){
			wasLeftParentheses = false;
			wasRigthParentheses = false;
			var found_operator = null;

			if (t.operand_expected) {
				if ('-' === t.operand_str) {
					t.operand_expected = true;
					found_operator = cFormulaOperators['un_minus'].prototype;
				} else if ('+' === t.operand_str) {
					t.operand_expected = true;
					found_operator = cFormulaOperators['un_plus'].prototype;
				} else if (' ' === t.operand_str) {
					return true;
				} else {
					t.error.push(c_oAscError.ID.FrmlWrongOperator);
					t.outStack = [];
					t.elemArr = [];
					return false;
				}
			} else if (!t.operand_expected) {
				if ('-' === t.operand_str) {
					t.operand_expected = true;
					found_operator = cFormulaOperators['-'].prototype;
				} else if ('+' === t.operand_str) {
					t.operand_expected = true;
					found_operator = cFormulaOperators['+'].prototype;
				} else if (':' === t.operand_str) {
					t.operand_expected = true;
					found_operator = cFormulaOperators[':'].prototype;
				} else if ('%' === t.operand_str) {
					t.operand_expected = false;
					found_operator = cFormulaOperators['%'].prototype;
				} else if (' ' === t.operand_str && t.pCurrPos === t.Formula.length) {
					return true;
				} else {
					if (t.operand_str in cFormulaOperators) {
						found_operator = cFormulaOperators[t.operand_str].prototype;
						t.operand_expected = true;
					} else {
						t.error.push(c_oAscError.ID.FrmlWrongOperator);
						t.outStack = [];
						t.elemArr = [];
						return false;
					}
				}
			}

			while (0 !== t.elemArr.length && (
				found_operator.rightAssociative ?
					( found_operator.priority < t.elemArr[t.elemArr.length - 1].priority ) :
					( found_operator.priority <= t.elemArr[t.elemArr.length - 1].priority )
			)) {
				t.outStack.push(t.elemArr.pop());
			}
			t.elemArr.push(found_operator);
			t.f.push(found_operator);
			found_operand = null;
			return true;
		};

		var parseLeftParentheses = function(){
			if (wasRigthParentheses || found_operand) {
				t.elemArr.push(new cMultOperator());
			}
			t.operand_expected = true;
			wasLeftParentheses = true;
			wasRigthParentheses = false;
			found_operand = null;
			t.elemArr.push(cFormulaOperators[t.operand_str].prototype);
			t.f.push(cFormulaOperators[t.operand_str].prototype);
			leftParentArgumentsCurrentArr[t.elemArr.length - 1] = 1;

			if(startSumproduct){
				counterSumproduct++;
				if(1 === counterSumproduct){
					t.outStack.push(cSpecialOperandStart.prototype);
				}
			}
		};

		var parseRightParentheses = function(){

			t.f.push(cFormulaOperators[t.operand_str].prototype);
			wasRigthParentheses = true;
			var top_elem = null;
			var top_elem_arg_count = 0;
			if (0 !== t.elemArr.length && ( (top_elem = t.elemArr[t.elemArr.length - 1]).name === '(' ) &&
				t.operand_expected) {
				top_elem_arg_count = leftParentArgumentsCurrentArr[t.elemArr.length - 1];
				if (top_elem_arg_count > 1) {
					t.outStack.push(new cEmpty());
				} else {
					leftParentArgumentsCurrentArr[t.elemArr.length - 1]--;
					top_elem_arg_count = leftParentArgumentsCurrentArr[t.elemArr.length - 1];
				}
			} else {
				while (0 !== t.elemArr.length &&
				!((top_elem = t.elemArr[t.elemArr.length - 1]).name === '(' )) {
					if (top_elem.name in cFormulaOperators && t.operand_expected) {
						t.error.push(c_oAscError.ID.FrmlOperandExpected);
						t.outStack = [];
						t.elemArr = [];
						return false;
					}
					t.outStack.push(t.elemArr.pop());
				}
				top_elem_arg_count = leftParentArgumentsCurrentArr[t.elemArr.length - 1];
			}

			if (0 === t.elemArr.length || null === top_elem/* && !wasLeftParentheses */) {
				t.outStack = [];
				t.elemArr = [];
				t.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
				return false;
			}

			var p = top_elem, func, bError = false;
			t.elemArr.pop();
			if (0 !== t.elemArr.length &&
				( func = t.elemArr[t.elemArr.length - 1] ).type === cElementType.func) {
				p = t.elemArr.pop();
				if (top_elem_arg_count > func.argumentsMax) {
					t.outStack = [];
					t.elemArr = [];
					t.error.push(c_oAscError.ID.FrmlWrongMaxArgument);
					return false;
				} else {
					if (top_elem_arg_count >= func.argumentsMin) {
						t.outStack.push(top_elem_arg_count);
						if (!func.checkArguments(top_elem_arg_count)) {
							bError = true;
						}
					} else {
						bError = true;
					}

					if (bError) {
						t.outStack = [];
						t.elemArr = [];
						t.error.push(c_oAscError.ID.FrmlWrongCountArgument);
						return false;
					}
				}
			} else if(wasLeftParentheses && 0 === top_elem_arg_count && t.elemArr[t.elemArr.length - 1] && " " === t.elemArr[t.elemArr.length - 1].name) {
				//intersection with empty range
				t.outStack = [];
				t.elemArr = [];
				t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
				return false;
			} else {
				if (wasLeftParentheses && (!t.elemArr[t.elemArr.length - 1] ||
					'(' === t.elemArr[t.elemArr.length - 1].name)) {
					t.outStack = [];
					t.elemArr = [];
					t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					return false;
				}
				// for (int i = 0; i < left_p.ParametersNum - 1; ++i)
				// {
				// ptgs_list.AddFirst(new PtgUnion()); // чета нужно добавить для Union.....
				// }
			}
			t.outStack.push(p);
			t.operand_expected = false;
			wasLeftParentheses = false;

			if(startSumproduct){
				counterSumproduct--;
				if(counterSumproduct < 1){
					startSumproduct = false;
					t.outStack.push(cSpecialOperandEnd.prototype);
				}
			}

			return true;
		};

		var parseCommaAndArgumentsUnion = function(){
			wasLeftParentheses = false;
			wasRigthParentheses = false;
			var stackLength = t.elemArr.length, top_elem = null, top_elem_arg_pos;

			if (t.elemArr.length !== 0 && t.elemArr[stackLength - 1].name === "(" && t.operand_expected) {
				t.outStack.push(new cEmpty());
				top_elem = t.elemArr[stackLength - 1];
				top_elem_arg_pos = stackLength - 1;
				wasLeftParentheses = true;
				t.operand_expected = false;
			} else {
				while (stackLength !== 0) {
					top_elem = t.elemArr[stackLength - 1];
					top_elem_arg_pos = stackLength - 1;
					if (top_elem.name === "(") {
						wasLeftParentheses = true;
						break;
					} else {
						t.outStack.push(t.elemArr.pop());
						stackLength = t.elemArr.length;
					}
				}
			}

			if (t.operand_expected) {
				t.error.push(c_oAscError.ID.FrmlWrongOperator);
				t.outStack = [];
				t.elemArr = [];
				return false;
			}

			if (!wasLeftParentheses) {
				t.error.push(c_oAscError.ID.FrmlWrongCountParentheses);
				t.outStack = [];
				t.elemArr = [];
				return false;
			}
			leftParentArgumentsCurrentArr[top_elem_arg_pos]++;
			t.operand_expected = true;
			return true;
		};

		var parseArray = function(){
			wasLeftParentheses = false;
			wasRigthParentheses = false;
			var arr = new cArray(), operator = {isOperator: false, operatorName: ""};
			while (t.pCurrPos < t.Formula.length &&
			!parserHelp.isRightBrace.call(t, t.Formula, t.pCurrPos)) {
				if (parserHelp.isArraySeparator.call(t, t.Formula, t.pCurrPos, digitDelim)) {
					if (t.operand_str === (digitDelim ? FormulaSeparators.arrayRowSeparator :
							FormulaSeparators.arrayRowSeparatorDef)) {
						arr.addRow();
					}
				} else if (parserHelp.isBoolean.call(t, t.Formula, t.pCurrPos, local)) {
					arr.addElement(new cBool(t.operand_str));
				} else if (parserHelp.isString.call(t, t.Formula, t.pCurrPos)) {
					arr.addElement(new cString(t.operand_str));
				} else if (parserHelp.isError.call(t, t.Formula, t.pCurrPos)) {
					arr.addElement(new cError(t.operand_str));
				} else if (parserHelp.isNumber.call(t, t.Formula, t.pCurrPos, digitDelim)) {
					if (operator.isOperator) {
						if (operator.operatorName === "+" || operator.operatorName === "-") {
							t.operand_str = operator.operatorName + "" + t.operand_str
						} else {
							t.outStack = [];
							t.elemArr = [];
							t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
							return false;
						}
					}
					arr.addElement(new cNumber(parseFloat(t.operand_str)));
					operator = {isOperator: false, operatorName: ""};
				} else if (parserHelp.isOperator.call(t, t.Formula, t.pCurrPos)) {
					operator.isOperator = true;
					operator.operatorName = t.operand_str;
				} else {
					t.outStack = [];
					t.elemArr = [];
					/*в массиве используется недопустимый параметр*/
					t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					return false;
				}
			}
			if (!arr.isValidArray()) {
				t.outStack = [];
				t.elemArr = [];
				/*размер массива не согласован*/
				t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
				return false;
			}
			t.outStack.push(arr);
			t.operand_expected = false;
			return true;
		};

		var parseOperands = function(){
			found_operand = null;

			if (wasRigthParentheses) {
				t.operand_expected = true;
			}

			if (!t.operand_expected) {
				t.error.push(c_oAscError.ID.FrmlWrongOperator);
				t.outStack = [];
				t.elemArr = [];
				return false;
			}

			/* Booleans */
			if (parserHelp.isBoolean.call(t, t.Formula, t.pCurrPos, local)) {
				found_operand = new cBool(t.operand_str);
			}

			/* Strings */ else if (parserHelp.isString.call(t, t.Formula, t.pCurrPos)) {
				found_operand = new cString(t.operand_str);
			}

			/* Errors */ else if (parserHelp.isError.call(t, t.Formula, t.pCurrPos, local)) {
				found_operand = new cError(t.operand_str);
			}

			/* Referens to 3D area: Sheet1:Sheet3!A1:B3, Sheet1:Sheet3!B3, Sheet1!B3*/ else if ((_3DRefTmp =
					parserHelp.is3DRef.call(t, t.Formula, t.pCurrPos))[0]) {

				t.is3D = true;
				var pos = {
					start: t.pCurrPos - t.operand_str.length - 1,
					end: t.pCurrPos,
					index: t.outStack.length
				};
				var wsF = t.wb.getWorksheetByName(_3DRefTmp[1]);
				var wsT = (null !== _3DRefTmp[2]) ? t.wb.getWorksheetByName(_3DRefTmp[2]) : wsF;

				if (!(wsF && wsT)) {
					t.error.push(c_oAscError.ID.FrmlWrongReferences);
					t.outStack = [];
					t.elemArr = [];
					return false;
				}
				if (parserHelp.isArea.call(t, t.Formula, t.pCurrPos)) {
					pos.end = t.pCurrPos;
					found_operand = new cArea3D(t.operand_str.toUpperCase(), wsF, wsT);
					pos.oper = found_operand;
					refPos.push(pos);
				} else if (parserHelp.isRef.call(t, t.Formula, t.pCurrPos)) {
					pos.end = t.pCurrPos;
					if (wsT !== wsF) {
						found_operand = new cArea3D(t.operand_str.toUpperCase(), wsF, wsT);
						pos.oper = found_operand;
					} else {
						found_operand = new cRef3D(t.operand_str.toUpperCase(), wsF);
						pos.oper = found_operand;
					}
					refPos.push(pos);
				} else if (parserHelp.isName.call(t, t.Formula, t.pCurrPos)) {
					pos.end = t.pCurrPos;
					found_operand = new cName3D(t.operand_str, wsF);
					pos.oper = found_operand;
					refPos.push(pos);
				}
				t.countRef++;
			}

			/* Referens to cells area A1:A10 */ else if (parserHelp.isArea.call(t, t.Formula,
					t.pCurrPos)) {
				found_operand = new cArea(t.operand_str.toUpperCase(), t.ws);
				refPos.push({
					start: t.pCurrPos - t.operand_str.length,
					end: t.pCurrPos,
					index: t.outStack.length,
					oper: found_operand
				});
				t.countRef++;
			}
			/* Referens to cell A4 */ else if (parserHelp.isRef.call(t, t.Formula, t.pCurrPos)) {
				found_operand = new cRef(t.operand_str.toUpperCase(), t.ws);
				refPos.push({
					start: t.pCurrPos - t.operand_str.length,
					end: t.pCurrPos,
					index: t.outStack.length,
					oper: found_operand
				});
				t.countRef++;
			}

			else if (_tableTMP = parserHelp.isTable.call(t, t.Formula, t.pCurrPos, local)) {
				found_operand = cStrucTable.prototype.createFromVal(_tableTMP, t.wb, t.ws);

				//todo undo delete column
				if (found_operand.type === cElementType.error) {
					/*используется неверный именованный диапазон или таблица*/
					t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					t.outStack = [];
					t.elemArr = [];
					return false;
				}

				if (found_operand.type !== cElementType.error) {
					refPos.push({
						start: t.pCurrPos - t.operand_str.length,
						end: t.pCurrPos,
						index: t.outStack.length,
						isName: true,
						oper: found_operand
					});
					t.countRef++;
				}
			}

			/* Referens to DefinedNames */ else if (parserHelp.isName.call(t, t.Formula, t.pCurrPos,
					t.wb, t.ws)[0]) {
				found_operand = new cName(t.operand_str, t.ws);
				var defName = found_operand.getDefName();
				if (defName && defName.isTable && (_tableTMP = parserHelp.isTable(t.operand_str + "[]", 0))) {
					found_operand = cStrucTable.prototype.createFromVal(_tableTMP, t.wb, t.ws);
					//need assemble becase source formula wrong
					needAssemble = true;
				}
				refPos.push({
					start: t.pCurrPos - t.operand_str.length,
					end: t.pCurrPos,
					index: t.outStack.length,
					isName: true,
					oper: found_operand
				});
				t.countRef++;
			}

			/* Numbers*/ else if (parserHelp.isNumber.call(t, t.Formula, t.pCurrPos, digitDelim)) {
				if (t.operand_str !== ".") {
					found_operand = new cNumber(parseFloat(t.operand_str));
				} else {
					t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
					t.outStack = [];
					t.elemArr = [];
					return false;
				}
			}

			/* Function*/ else if (parserHelp.isFunc.call(t, t.Formula, t.pCurrPos)) {

				if (wasRigthParentheses && t.operand_expected) {
					t.elemArr.push(new cMultOperator());
				}

				var found_operator = null, operandStr = t.operand_str.replace(rx_sFuncPref, "").toUpperCase();
				if (operandStr in cFormulaList) {
					found_operator = cFormulaList[operandStr].prototype;
				} else if (operandStr in cAllFormulaFunction) {
					found_operator = cAllFormulaFunction[operandStr].prototype;
				} else {
					found_operator = new cUnknownFunction(operandStr);
					found_operator.isXLFN = ( t.operand_str.indexOf("_xlfn.") === 0 );
				}

				if (found_operator !== null) {
					if (found_operator.ca) {
						t.ca = found_operator.ca;
					}
					t.elemArr.push(found_operator);
					t.f.push(found_operator);
					if("SUMPRODUCT" === found_operator.name){
						startSumproduct = true;
					}
				} else {
					t.error.push(c_oAscError.ID.FrmlWrongFunctionName);
					t.outStack = [];
					t.elemArr = [];
					return false;
				}
				t.operand_expected = false;
				wasRigthParentheses = false;
				return true;
			}

			if (null !== found_operand) {
				t.outStack.push(found_operand);
				t.f.push(found_operand);
				t.operand_expected = false;
				found_operand = null;
			} else {
				t.outStack.push(new cError(cErrorType.wrong_name));
				t.error.push(c_oAscError.ID.FrmlAnotherParsingError);
				return t.isParsed = false;
			}

			if (wasRigthParentheses) {
				t.elemArr.push(new cMultOperator());
			}
			wasLeftParentheses = false;
			wasRigthParentheses = false;
			return true;
		};

		while (this.pCurrPos < this.Formula.length) {
			this.operand_str = this.Formula[this.pCurrPos];

			/* Operators*/
			if (parserHelp.isOperator.call(this, this.Formula, this.pCurrPos) || parserHelp.isNextPtg.call(this, this.Formula, this.pCurrPos)) {
				if(!parseOperators()){
					return false;
				}
			} /* Left Parentheses*/ else if (parserHelp.isLeftParentheses.call(this, this.Formula, this.pCurrPos)) {
				parseLeftParentheses();

				//TODO протестировать
				//если осталось только закрыть скобки за функции с нулевым количеством аргументов
				if(this.pCurrPos === this.Formula.length){
					if(this.elemArr[this.elemArr.length - 2] && 0 === this.elemArr[this.elemArr.length - 2].argumentsMax){
						this.operand_expected = false;
					}
				}

			}/* Right Parentheses */ else if (parserHelp.isRightParentheses.call(this, this.Formula, this.pCurrPos)) {
				if(!parseRightParentheses()){
					return false;
				}
			}/*Comma & arguments union*/ else if (parserHelp.isComma.call(this, this.Formula, this.pCurrPos)) {
				if(!parseCommaAndArgumentsUnion()){
					return false;
				}
			}/* Array */ else if (parserHelp.isLeftBrace.call(this, this.Formula, this.pCurrPos)) {
				if(!parseArray()){
					return false;
				}
			}/* Operands*/ else {
				if(!parseOperands()){
					return false;
				}
			}
		}

		if (this.operand_expected) {
			this.outStack = [];
			this.elemArr = [];
			this.error.push(c_oAscError.ID.FrmlOperandExpected);
			return false;
		}
		var operand, parenthesesNotEnough = false;
		while (0 !== this.elemArr.length) {
			operand = this.elemArr.pop();
			if ('(' === operand.name && !this.parenthesesNotEnough) {
				this.Formula += ")";
				parenthesesNotEnough = true;
			} else if ('(' === operand.name || ')' === operand.name) {
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

		if (0 !== this.outStack.length) {
			if (needAssemble) {
				this.Formula = this.assemble();
			}
			return this.isParsed = true;
		} else {
			return this.isParsed = false;
		}
	};

	parserFormula.prototype.calculate = function (opt_defName, opt_bbox, opt_offset, opt_forceCalculate) {
		if (!this.incRecursionLevel()) {
			return this.value || new cError(cErrorType.bad_reference);
		}
		if ((this.isCalculate && !opt_forceCalculate) &&
			(!this.calculateDefName || this.calculateDefName[opt_bbox ? opt_bbox.getName() : opt_bbox])) {
			//cycle
			this.value = new cError(cErrorType.bad_reference);
			this._endCalculate();
			return this.value;
		}
		this.isCalculate = true;
		if (opt_defName) {
			if (!this.calculateDefName) {
				this.calculateDefName = {};
			}
			this.calculateDefName[opt_bbox ? opt_bbox.getName() : opt_bbox] = 1;
		}
		if (this.outStack.length < 1) {
			this.value = new cError(cErrorType.wrong_name);
			this._endCalculate();
			return this.value;
		}
		if (!opt_bbox && this.parent && this.parent.onFormulaEvent) {
			opt_bbox = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.GetRangeCell);
		}
		if (!opt_bbox) {
			opt_bbox = new Asc.Range(0, 0, 0, 0);
		}

		var elemArr = [], _tmp, numFormat = cNumFormatFirstCell, currentElement = null, bIsSpecialFunction, argumentsCount;
		for (var i = 0; i < this.outStack.length; i++) {
			currentElement = this.outStack[i];
			if (currentElement.name === "(") {
				continue;
			}
			if(currentElement.type === cElementType.specialFunctionStart){
				bIsSpecialFunction = true;
				continue;
			}
			if(currentElement.type === cElementType.specialFunctionEnd){
				bIsSpecialFunction = false;
				continue;
			}
			if("number" === typeof(currentElement)){
				continue;
			}
			if (currentElement.type === cElementType.operator || currentElement.type === cElementType.func) {
				argumentsCount = "number" === typeof(this.outStack[i - 1]) ? this.outStack[i - 1] : currentElement.argumentsCurrent;
				if (elemArr.length < argumentsCount) {
					elemArr = [];
					this.value = new cError(cErrorType.unsupported_function);
					this._endCalculate();
					return this.value;
				} else {
					var arg = [];
					for (var ind = 0; ind < argumentsCount; ind++) {
						if("number" === typeof(elemArr[elemArr.length - 1])){
							elemArr.pop();
						}
						arg.unshift(elemArr.pop());
					}
					_tmp = currentElement.Calculate(arg, opt_bbox, opt_defName, this.ws, bIsSpecialFunction);
					if (cNumFormatNull !== _tmp.numFormat) {
						numFormat = _tmp.numFormat;
					} else if (0 > numFormat || cNumFormatNone === currentElement.numFormat) {
						numFormat = currentElement.numFormat;
					}
					elemArr.push(_tmp);
				}
			} else if (currentElement.type === cElementType.name || currentElement.type === cElementType.name3D) {
				elemArr.push(currentElement.Calculate(null, opt_bbox));
			} else if (currentElement.type === cElementType.table) {
				elemArr.push(currentElement.toRef(opt_bbox));
			} else if (opt_offset) {
				elemArr.push(this.applyOffset(currentElement, opt_offset));
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
		this.calculateDefName = null;
		this.decRecursionLevel();
	};
	parserFormula.prototype.incRecursionLevel = function() {
		return !g_cCalcRecursion.getIsForceBacktracking() && g_cCalcRecursion.incLevel();
	};
	parserFormula.prototype.decRecursionLevel = function() {
		g_cCalcRecursion.decLevel();
		if (g_cCalcRecursion.getIsForceBacktracking()) {
			g_cCalcRecursion.insert(this);
			if (0 === g_cCalcRecursion.getLevel() && !g_cCalcRecursion.getIsProcessRecursion()) {
				g_cCalcRecursion.setIsProcessRecursion(true);
				do {
					g_cCalcRecursion.setIsForceBacktracking(false);
					g_cCalcRecursion.foreachInReverse(function(parsed){
						if (parsed.getIsDirty()) {
							parsed.calculate(undefined, undefined, undefined, true);
						}
					});
				} while (g_cCalcRecursion.getIsForceBacktracking());
				g_cCalcRecursion.setIsProcessRecursion(false);
			}
		} else {
			this.isCalculate = false;
			this.isDirty = false;
		}
	};

	/* Для обратной сборки функции иногда необходимо поменять ссылки на ячейки */
	parserFormula.prototype.changeOffset = function (offset, canResize) {//offset = AscCommonExcel.CRangeOffset
		for (var i = 0; i < this.outStack.length; i++) {
			this.changeOffsetElem(this.outStack[i], this.outStack, i, offset, canResize);
		}
		return this;
	};
	parserFormula.prototype.changeOffsetElem = function(elem, container, index, offset, canResize) {//offset =
		// AscCommonExcel.CRangeOffset
		var range, bbox = null, ws, isErr = false;
		if (cElementType.cell === elem.type || cElementType.cell3D === elem.type ||
			cElementType.cellsRange === elem.type) {
			isErr = true;
			range = elem.getRange();
			if (range) {
				bbox = range.getBBox0();
				ws = range.getWorksheet();
			}
		} else if (cElementType.cellsRange3D === elem.type) {
			isErr = true;
			bbox = elem.getBBox0();
		}
		if (bbox) {
			if (bbox.setOffsetWithAbs(offset, canResize)) {
				isErr = false;
				this.changeOffsetBBox(elem, bbox, ws);
			}
		}
		if (isErr) {
			container[index] = new cError(cErrorType.bad_reference);
		}
		return elem;
	};
	parserFormula.prototype.applyOffset = function(currentElement, offset) {
		var res = currentElement;
		var cloneElem = null;
		var bbox = null;
		var ws;
		if (cElementType.cell === currentElement.type || cElementType.cell3D === currentElement.type ||
			cElementType.cellsRange === currentElement.type) {
			var range = currentElement.getRange();
			if (range) {
				bbox = range.getBBox0();
				ws = range.getWorksheet();
				if (!bbox.isAbsAll()) {
					cloneElem = currentElement.clone();
					bbox = cloneElem.getRange().getBBox0();
				}
			}
		} else if (cElementType.cellsRange3D === currentElement.type) {
			bbox = currentElement.getBBox0();
			if (bbox && !bbox.isAbsAll()) {
				cloneElem = currentElement.clone();
				bbox = cloneElem.getBBox0();
			}
		}
		if (cloneElem) {
			bbox.setOffsetWithAbs(offset, false, true);
			this.changeOffsetBBox(cloneElem, bbox, ws);
			res = cloneElem;
		}
		return res;
	};
	parserFormula.prototype.changeOffsetBBox = function(elem, bbox, ws) {
		if (cElementType.cellsRange3D === elem.type) {
			elem.bbox = bbox;
		} else {
			elem.range = AscCommonExcel.Range.prototype.createFromBBox(ws, bbox);
		}
		elem.value = bbox.getName();
	};
	parserFormula.prototype.changeDefName = function(from, to) {
		var i, elem;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.name || elem.type == cElementType.name3D || elem.type == cElementType.table) {
				elem.changeDefName(from, to);
			}
		}
	};
	parserFormula.prototype.removeTableName = function(defName, bConvertTableFormulaToRef) {
		var i, elem;
		var bbox;
		if (this.parent && this.parent.onFormulaEvent) {
			bbox= this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.GetRangeCell);
		}

		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.table && elem.tableName == defName.name) {
				if(bConvertTableFormulaToRef)
				{
					this.outStack[i] = this.outStack[i].toRef(bbox, bConvertTableFormulaToRef);
				}
				else
				{
					this.outStack[i] = new cError(cErrorType.bad_reference);
				}
			}
		}
	};
	parserFormula.prototype.removeTableColumn = function(tableName, deleted) {
		var i, elem;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.table && elem.tableName == tableName) {
				if (elem.removeTableColumn(deleted)) {
					this.outStack[i] = new cError(cErrorType.bad_reference);
				}
			}
		}
	};
	parserFormula.prototype.renameTableColumn = function(tableName) {
		var i, elem;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.table && elem.tableName == tableName) {
				if (!elem.renameTableColumn()) {
					this.outStack[i] = new cError(cErrorType.bad_reference);
				}
			}
		}
	};
	parserFormula.prototype.changeTableRef = function(tableName) {
		var i, elem;
		for (i = 0; i < this.outStack.length; i++) {
			elem = this.outStack[i];
			if (elem.type == cElementType.table && elem.tableName == tableName) {
				elem.changeTableRef();
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
				if (elem.isSingleSheet() && sheetId == elem.wsFrom.getId() && elem.isValid()) {
					_cellsBbox = elem.getBBox0();
				}
			}
			if (_cellsRange || _cellsBbox) {
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
						isNoDelete = _cellsBbox.forShift(bbox, offset, this.wb.bUndoChanges);
					} else if (AscCommon.c_oNotifyType.Move == notifyType) {
						_cellsBbox.setOffset(offset);
						isNoDelete = true;
					} else if (AscCommon.c_oNotifyType.Delete == notifyType) {
						if (bbox.containsRange(_cellsBbox)) {
							isNoDelete = false;
						} else {
							isNoDelete = true;
							if (!this.wb.bUndoChanges) {
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
	parserFormula.prototype.renameSheetCopy = function (params) {
		var wsLast = params.lastName ? this.wb.getWorksheetByName(params.lastName) : null;
		var wsNew = params.newName ? this.wb.getWorksheetByName(params.newName) : null;
		var isInDependencies = this.isInDependencies;
		if (isInDependencies) {
			//before change outStack necessary to removeDependencies
			this.removeDependencies();
		}

		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cell3D === elem.type) {
				if (params.offset) {
					elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
				}
				if (wsLast && wsNew) {
					elem.changeSheet(wsLast, wsNew);
				}
			} else if (cElementType.cellsRange3D === elem.type) {
				if (params.offset) {
					elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
				}
				if (wsLast && wsNew) {
					if (elem.isSingleSheet()) {
						elem.changeSheet(wsLast, wsNew);
					} else {
						if (elem.wsFrom === wsLast || elem.wsTo === wsLast) {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
					}
				}
			} else if (params.offset && (cElementType.cellsRange === elem.type || cElementType.cell === elem.type)) {
				elem = this.changeOffsetElem(elem, this.outStack, i, params.offset);
			} else if (wsLast && wsNew && cElementType.name3D === elem.type) {
				elem.changeSheet(wsLast, wsNew);
			} else if (params.tableNameMap && cElementType.table === elem.type) {
				var newTableName = params.tableNameMap[elem.tableName];
				if (newTableName) {
					elem.tableName = newTableName;
				}
			}
		}
		if (isInDependencies) {
			this.buildDependencies();
		}
		return this;
	};
	parserFormula.prototype.removeSheet = function (sheetId, tableNamesMap) {
		var bRes = false;
		var ws = this.wb.getWorksheetById(sheetId);
		if (ws) {
			var wsIndex = ws.getIndex();
			var wsPrev = this.wb.getWorksheet(wsIndex - 1);
			var wsNext = this.wb.getWorksheet(wsIndex + 1);
			for (var i = 0; i < this.outStack.length; i++) {
				var elem = this.outStack[i];
				if (cElementType.cellsRange3D === elem.type) {
					if (elem.wsFrom === ws) {
						if (!elem.isSingleSheet() && null !== wsNext) {
							elem.changeSheet(ws, wsNext);
						} else {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
						bRes = true;
					} else if (elem.wsTo === ws) {
						if (null !== wsPrev) {
							elem.changeSheet(ws, wsPrev);
						} else {
							this.outStack[i] = new cError(cErrorType.bad_reference);
						}
						bRes = true;
					}
				} else if (cElementType.cell3D === elem.type || cElementType.name3D === elem.type) {
					if (elem.getWS() === ws) {
						this.outStack[i] = new cError(cErrorType.bad_reference);
						bRes = true;
					}
				} else if (cElementType.table === elem.type) {
					if (tableNamesMap[elem.tableName]) {
						this.outStack[i] = new cError(cErrorType.bad_reference);
						bRes = true;
					}
				}
			}
		}
		return bRes;
	};
	parserFormula.prototype.moveSheet = function(tempW) {
		var bRes = false;
		for (var i = 0; i < this.outStack.length; i++) {
			var elem = this.outStack[i];
			if (cElementType.cellsRange3D === elem.type) {
				var wsToIndex = elem.wsTo.getIndex();
				var wsFromIndex = elem.wsFrom.getIndex();
				if (!elem.isSingleSheet()) {
					if (elem.wsFrom === tempW.wF) {
						if (tempW.wTI > wsToIndex) {
							bRes = true;
							var wsNext = this.wb.getWorksheet(wsFromIndex + 1);
							if (wsNext) {
								elem.changeSheet(tempW.wF, wsNext);
							} else {
								this.outStack[i] = new cError(cErrorType.bad_reference);
							}
						}
					} else if (elem.wsTo === tempW.wF) {
						if (tempW.wTI <= wsFromIndex) {
							bRes = true;
							var wsPrev = this.wb.getWorksheet(wsToIndex - 1);
							if (wsPrev) {
								elem.changeSheet(tempW.wF, wsPrev);
							} else {
								this.outStack[i] = new cError(cErrorType.bad_reference);
							}
						}
					}
				}
			}
		}
		return bRes;
	};

	/* Сборка функции в инфиксную форму */
	parserFormula.prototype.assemble = function (rFormula) {
		if (!rFormula && this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError) {
			return this.Formula;
		}

		return this._assembleExec();
	};

	/* Сборка функции в инфиксную форму */
	parserFormula.prototype.assembleLocale = function (locale, digitDelim) {
		if (this.outStack.length == 1 && this.outStack[this.outStack.length - 1] instanceof cError) {
			return this.Formula;
		}

		return this._assembleExec(locale, digitDelim, true);
	};

	parserFormula.prototype._assembleExec = function (locale, digitDelim, bLocale) {
		//_numberPrevArg - количество аргументов функции в стеке
		var currentElement = null, _count = this.outStack.length, elemArr = new Array(_count), res = undefined,
			_count_arg, _numberPrevArg, _argDiff;

		for (var i = 0, j = 0; i < _count; i++, j++) {
			currentElement = this.outStack[i];

			if (currentElement.type === cElementType.specialFunctionStart ||
				currentElement.type === cElementType.specialFunctionEnd || "number" === typeof(currentElement)) {
				continue;
			}

			if (currentElement.type === cElementType.operator || currentElement.type === cElementType.func) {
				_numberPrevArg = "number" === typeof(this.outStack[i - 1]) ? this.outStack[i - 1] : null;
				_count_arg = null !== _numberPrevArg ? _numberPrevArg : currentElement.argumentsCurrent;
				_argDiff = 0;
				if(null !== _numberPrevArg) {
					_argDiff++;
					if(this.outStack[i - 2] && cElementType.specialFunctionEnd === this.outStack[i - 2].type) {
						_argDiff++;
					}
				}

				if(j - _count_arg - _argDiff < 0) {
					continue;
				}

				if (bLocale) {
					res = currentElement.Assemble2Locale(elemArr, j - _count_arg - _argDiff, _count_arg, locale, digitDelim);
				} else {
					res = currentElement.Assemble2(elemArr, j - _count_arg - _argDiff, _count_arg);
				}
				j -= _count_arg + _argDiff;
				elemArr[j] = res;
			} else {
				if (cElementType.string === currentElement.type) {
					if (bLocale) {
						currentElement = new cString("\"" + currentElement.toLocaleString(digitDelim) + "\"");
					} else {
						currentElement = new cString("\"" + currentElement.toString() + "\"");
					}

				}
				res = currentElement;
				elemArr[j] = res;
			}
		}

		if (res != undefined && res != null) {
			return bLocale ? res.toLocaleString(digitDelim) : res.toString();
		} else {
			return this.Formula;
		}
	};

	parserFormula.prototype.buildDependencies = function() {
		if (this.isInDependencies) {
			return;
		}
		this.isInDependencies = true;
		var ref, wsR;
		var isTable = this.isTable;
		var bbox, bboxes;
		if (this.ca) {
			this.wb.dependencyFormulas.startListeningVolatile(this);
		}

		var isDefName;
		if (this.parent && this.parent.onFormulaEvent) {
			isDefName = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.IsDefName);
		}

		for (var i = 0; i < this.outStack.length; i++) {
			ref = this.outStack[i];

			if (ref.type == cElementType.table) {
				this.wb.dependencyFormulas.startListeningDefName(ref.tableName, this);
			} else if (ref.type == cElementType.name) {
				this.wb.dependencyFormulas.startListeningDefName(ref.value, this);
			} else if (ref.type == cElementType.name3D) {
				this.wb.dependencyFormulas.startListeningDefName(ref.value, this, ref.ws.getId());
			} else if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type) && ref.isValid()) {
				bbox = ref.getRange().getBBox0();
				if(isTable){
					//extend table formula with header/total. This allows us not to follow their change,
					//but sometimes leads to recalculate of the table although changed cells near table (it's not a problem)
					bbox = bbox.clone();
					bbox.setOffsetFirst({offsetRow: -1, offsetCol: 0});
					bbox.setOffsetLast({offsetRow: 1, offsetCol: 0});
				}
				if (isDefName) {
					bboxes = this.extendBBoxCF(isDefName, bbox);
					for (var k = 0; k < bboxes.length; ++k) {
						this.wb.dependencyFormulas.startListeningRange(ref.getWsId(), bboxes[k], this);
					}
				} else {
					bbox = this.extendBBoxDefName(isDefName, bbox);
					this.wb.dependencyFormulas.startListeningRange(ref.getWsId(), bbox, this);
				}
			} else if (cElementType.cellsRange3D === ref.type && ref.isValid()) {
				wsR = ref.range(ref.wsRange());
				ref.dependenceRange = wsR;
				for (var j = 0; j < wsR.length; j++) {
					var range = wsR[j];
					if (range) {
						var wsId = range.getWorksheet().getId();
						bbox = range.getBBox0();
						if(isTable){
							//extend table formula with header/total. This allows us not to follow their change,
							//but sometimes leads to recalculate of the table although changed cells near table (it's not a problem)
							bbox = bbox.clone();
							bbox.setOffsetFirst({offsetRow: -1, offsetCol: 0});
							bbox.setOffsetLast({offsetRow: 1, offsetCol: 0});
						}
						if (isDefName) {
							bboxes = this.extendBBoxCF(isDefName, bbox);
							for (var k = 0; k < bboxes.length; ++k) {
								this.wb.dependencyFormulas.startListeningRange(wsId, bboxes[k], this);
							}
						} else {
							bbox = this.extendBBoxDefName(isDefName, bbox);
							this.wb.dependencyFormulas.startListeningRange(wsId, bbox, this);
						}
					}
				}
			}
		}
	};
	parserFormula.prototype.removeDependencies = function() {
		if (!this.isInDependencies) {
			return;
		}
		this.isInDependencies = false;
		var ref;
		var wsR;
		var isTable = this.isTable;
		var bbox, bboxes;
		if (this.ca) {
			this.wb.dependencyFormulas.endListeningVolatile(this);
		}

		var isDefName;
		if (this.parent && this.parent.onFormulaEvent) {
			isDefName = this.parent.onFormulaEvent(AscCommon.c_oNotifyParentType.IsDefName);
		}

		for (var i = 0; i < this.outStack.length; i++) {
			ref = this.outStack[i];

			if (ref.type == cElementType.table) {
				this.wb.dependencyFormulas.endListeningDefName(ref.tableName, this);
			} else if (ref.type == cElementType.name) {
				this.wb.dependencyFormulas.endListeningDefName(ref.value, this);
			} else if (ref.type == cElementType.name3D) {
				this.wb.dependencyFormulas.endListeningDefName(ref.value, this, ref.ws.getId());
			} else if ((cElementType.cell === ref.type || cElementType.cell3D === ref.type ||
				cElementType.cellsRange === ref.type) && ref.isValid()) {
				bbox = ref.getRange().getBBox0();
				if(isTable){
					bbox = bbox.clone();
					bbox.setOffsetFirst({offsetRow: -1, offsetCol: 0});
					bbox.setOffsetLast({offsetRow: 1, offsetCol: 0});
				}
				if (isDefName) {
					bboxes = this.extendBBoxCF(isDefName, bbox);
					for (var k = 0; k < bboxes.length; ++k) {
						this.wb.dependencyFormulas.endListeningRange(ref.getWsId(), bboxes[k], this);
					}
				} else {
					bbox = this.extendBBoxDefName(isDefName, bbox);
					this.wb.dependencyFormulas.endListeningRange(ref.getWsId(), bbox, this);
				}
			} else if (cElementType.cellsRange3D === ref.type && ref.dependenceRange) {
				wsR = ref.dependenceRange;
				for (var j = 0; j < wsR.length; j++) {
					var range = wsR[j];
					if (range) {
						var wsId = range.getWorksheet().getId();
						bbox = range.getBBox0();
						if(isTable){
							bbox = bbox.clone();
							bbox.setOffsetFirst({offsetRow: -1, offsetCol: 0});
							bbox.setOffsetLast({offsetRow: 1, offsetCol: 0});
						}
						if (isDefName) {
							bboxes = this.extendBBoxCF(isDefName, bbox);
							for (var k = 0; k < bboxes.length; ++k) {
								this.wb.dependencyFormulas.endListeningRange(wsId, bboxes[k], this);
							}
						} else {
							bbox = this.extendBBoxDefName(isDefName, bbox);
							this.wb.dependencyFormulas.endListeningRange(wsId, bbox, this);
						}
					}
				}
			}
		}
	};
	parserFormula.prototype.extendBBoxDefName = function(isDefName, bbox) {
		if (null === isDefName && !bbox.isAbsAll()) {
			bbox = bbox.clone();
			if (!bbox.isAbsR1() || !bbox.isAbsR2()) {
				bbox.r1 = 0;
				bbox.r2 = AscCommon.gc_nMaxRow0;
			}
			if (!bbox.isAbsC1() || !bbox.isAbsC2()) {
				bbox.c1 = 0;
				bbox.c2 = AscCommon.gc_nMaxCol0;
			}
		}
		return bbox;
	};
	parserFormula.prototype.extendBBoxCF = function(isDefName, bbox) {
		var res = [];
		if (!bbox.isAbsAll()) {
			var bboxCf = isDefName.bbox;
			var ranges = isDefName.ranges;
			var rowLT = bboxCf ? bboxCf.r1 : 0;
			var colLT = bboxCf ? bboxCf.c1 : 0;
			for (var i = 0; i < ranges.length; ++i) {
				var range = ranges[i];
				var offsetLT = {offsetRow: range.r1 - rowLT, offsetCol: range.c1 - colLT};
				var newBBoxLT = bbox.clone();
				newBBoxLT.setOffsetWithAbs(offsetLT, false, true);
				var newBBoxRB = newBBoxLT.clone();
				var offsetRB = {offsetRow: range.r2 - range.r1, offsetCol: range.c2 - range.c1};
				newBBoxRB.setOffsetWithAbs(offsetRB, false, true);
				var newBBox = new Asc.Range(newBBoxLT.c1, newBBoxLT.r1, newBBoxRB.c2, newBBoxRB.r2);
				//todo more accurately threshold maxRow/maxCol
				if (!(bbox.r1 <= newBBoxLT.r1 && newBBoxLT.r1 <= newBBoxLT.r2 &&
					newBBoxLT.r1 <= newBBoxRB.r1 && newBBoxRB.r1 <= newBBoxRB.r2)) {
					newBBox.r1 = 0;
					newBBox.r2 = AscCommon.gc_nMaxRow0;
				}
				if (!(bbox.c1 <= newBBoxLT.c1 && newBBoxLT.c1 <= newBBoxLT.c2 &&
					newBBoxLT.c1 <= newBBoxRB.c1 && newBBoxRB.c1 <= newBBoxRB.c2)) {
					newBBox.c1 = 0;
					newBBox.c2 = AscCommon.gc_nMaxCol0;
				}
				res.push(newBBox);
			}
		} else {
			res.push(bbox);
		}
		return res;
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
	parserFormula.prototype.getIndexNumber = function() {
		return this._index;
	};
	parserFormula.prototype.setIndexNumber = function(val) {
		this._index = val;
	};

	function CalcRecursion() {
		this.level = 0;
		this.elemsPart = [];
		this.elems = [];
		this.isForceBacktracking = false;
		this.isProcessRecursion = false;
	}
	//for chrome63(real maximum call stack size is 12575) MAXRECURSION that cause excaption is 783
	CalcRecursion.prototype.MAXRECURSION = 400;
	CalcRecursion.prototype.incLevel = function() {
		if(!window.level){
			window.level = 0;
		}
		window.level++;
		var res = this.level <= g_cCalcRecursion.MAXRECURSION;
		if (res) {
			this.level++;
		} else {
			this.setIsForceBacktracking(true);
		}
		return res;
	};
	CalcRecursion.prototype.decLevel = function() {
		this.level--;
	};
	CalcRecursion.prototype.getLevel = function() {
		return this.level;
	};
	CalcRecursion.prototype.insert = function(val) {
		this.elemsPart.push(val);
	};
	CalcRecursion.prototype.foreachInReverse = function(callback) {
		for (var i = this.elems.length - 1; i >= 0; --i) {
			var elemsPart = this.elems[i];
			for (var j = 0; j < elemsPart.length; ++j) {
				callback(elemsPart[j]);
				if (this.getIsForceBacktracking()) {
					return;
				}
			}
		}
	};
	CalcRecursion.prototype.setIsForceBacktracking = function(val) {
		if (!this.isForceBacktracking) {
			this.elemsPart = [];
			this.elems.push(this.elemsPart);
		}
		this.isForceBacktracking = val;
	};
	CalcRecursion.prototype.getIsForceBacktracking = function() {
		return this.isForceBacktracking;
	};
	CalcRecursion.prototype.setIsProcessRecursion = function(val) {
		this.isProcessRecursion = val;
	};
	CalcRecursion.prototype.getIsProcessRecursion = function() {
		return this.isProcessRecursion;
	};
	var g_cCalcRecursion =  new CalcRecursion();

function parseNum( str ) {
    if ( str.indexOf( "x" ) > -1 || str == "" || str.match( /\s+/ ) )//исключаем запись числа в 16-ричной форме из числа.
  {
        return false;
  }
    return !isNaN( str );
}

	var matchingOperators = new RegExp("^(=|<>|<=|>=|<|>).*");

	function matchingValue(oVal) {
		var res;
		if (cElementType.string === oVal.type) {
			var search, op;
			var val = oVal.getValue();
			var match = val.match(matchingOperators);
			if (match) {
				search = val.substr(match[1].length);
				op = match[1].replace(/\s/g, "");
			} else {
				search = val;
				op = null;
			}

			var parseRes = AscCommon.g_oFormatParser.parse(search);
			res = {val: parseRes ? new cNumber(parseRes.value) : new cString(search), op: op};
		} else {
			res = {val: oVal, op: null};
		}

		return res;
	}

	function matching(x, matchingInfo) {
		var y = matchingInfo.val;
		var operator = matchingInfo.op;
		var res = false, rS;
		if (cElementType.string === y.type) {
			if ('<' === operator || '>' === operator || '<=' === operator || '>=' === operator) {
				var _funcVal = _func[x.type][y.type](x, y, operator);
				if (cElementType.error === _funcVal.type) {
					return false;
				}
				return _funcVal.toBool();
			}

			y = y.toString();

			// Equal only string values
			if(cElementType.empty === x.type && '' === y){
				rS = true;
			} else if(cElementType.bool === x.type){
				x = x.tocString();
				rS = x.value === y;
			}else if(cElementType.error === x.type){
				rS = x.value === y;
			}else{
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
		} else if (cElementType.number === y.type) {
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
					if (cElementType.string === x.type) {
						x = x.tocNumber();
					}
					res = (x.value === y.value);
					break;
			}
		} else if (cElementType.bool === y.type || cElementType.error === y.type) {
			if (y.type === x.type && x.value === y.value) {
				res = true;
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
    s = s.toString().toLowerCase();
    mask = mask.toString().toLowerCase();
	var cCurMask;
    var nSIndex = 0;
    var nMaskIndex = 0;
    var nSLastIndex = 0;
    var nMaskLastIndex = 0;
    var nSLength = s.length;
    var nMaskLength = mask.length;
    var t = false;
    for ( ; nSIndex < nSLength; nMaskIndex++, nSIndex++, t = false ) {
        cCurMask = mask[nMaskIndex];
        if ( '~' === cCurMask ) {
            nMaskIndex++;
            cCurMask = mask[nMaskIndex];
            t = true;
    } else if ('*' === cCurMask) {
      break;
        }
        if ( ( cCurMask !== s[nSIndex] && '?' !== cCurMask ) || ( cCurMask !== s[nSIndex] && t) ) {
            bRes = false;
            break;
        }
    }
    if ( bRes ) {
        while ( 1 ) {
            cCurMask = mask[nMaskIndex];
            if ( nSIndex >= nSLength ) {
                while ( '*' === cCurMask && nMaskIndex < nMaskLength ) {
                    nMaskIndex++;
                    cCurMask = mask[nMaskIndex];
                }
                bRes = nMaskIndex >= nMaskLength;
                break;
      } else if ('*' === cCurMask) {
                nMaskIndex++;
                if ( nMaskIndex >= nMaskLength ) {
                    bRes = true;
                    break;
                }
                nSLastIndex = nSIndex + 1;
                nMaskLastIndex = nMaskIndex;
      } else if (cCurMask !== s[nSIndex] && '?' !== cCurMask) {
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

	// ToDo use Array.prototype.max, but some like to use for..in without hasOwnProperty
	function getArrayMax (array) {
		return Math.max.apply(null, array);
	}
	// ToDo use Array.prototype.min, but some like to use for..in without hasOwnProperty
	function getArrayMin (array) {
		return Math.min.apply(null, array);
	}

	function convertAreaToArray(area){
		var retArr = new cArray(), _arg0;
		if(area instanceof cArea3D) {
			area = area.getMatrix()[0];
		} else {
			area = area.getMatrix();
		}

		for ( var iRow = 0; iRow < area.length; iRow++, iRow < area.length ? retArr.addRow() : true ) {
			for ( var iCol = 0; iCol < area[iRow].length; iCol++ ) {
				_arg0 = area[iRow][iCol];
				retArr.addElement(_arg0);
			}
		}

		return retArr;
	}

	function specialFuncArrayToArray(arg0, arg1, what){
		var retArr = null, _arg0, _arg1;
		if (arg0.getRowCount() === arg1.getRowCount() && 1 === arg0.getCountElementInRow()) {
			retArr = new cArray();
			for ( var iRow = 0; iRow < arg1.getRowCount(); iRow++, iRow < arg1.getRowCount() ? retArr.addRow() : true ) {
				for ( var iCol = 0; iCol < arg1.getCountElementInRow(); iCol++ ) {
					_arg0 = arg0.getElementRowCol( iRow, 0 );
					_arg1 = arg1.getElementRowCol( iRow, iCol );
					retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
				}
			}
		} else if (arg0.getRowCount() === arg1.getRowCount() && 1 === arg1.getCountElementInRow()) {
			retArr = new cArray();
			for ( var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true ) {
				for ( var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++ ) {
					_arg0 = arg0.getElementRowCol( iRow, iCol );
					_arg1 = arg1.getElementRowCol( iRow, 0 );
					retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
				}
			}
		} else if (arg0.getCountElementInRow() === arg1.getCountElementInRow() && 1 === arg0.getRowCount()) {
			retArr = new cArray();
			for ( var iRow = 0; iRow < arg1.getRowCount(); iRow++, iRow < arg1.getRowCount() ? retArr.addRow() : true ) {
				for ( var iCol = 0; iCol < arg1.getCountElementInRow(); iCol++ ) {
					_arg0 = arg0.getElementRowCol( 0, iCol );
					_arg1 = arg1.getElementRowCol( iRow, iCol );
					retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
				}
			}
		} else if (arg0.getCountElementInRow() === arg1.getCountElementInRow() && 1 === arg1.getRowCount()) {
			retArr = new cArray();
			for ( var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true ) {
				for ( var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++ ) {
					_arg0 = arg0.getElementRowCol( iRow, iCol );
					_arg1 = arg1.getElementRowCol( 0, iCol );
					retArr.addElement( _func[_arg0.type][_arg1.type]( _arg0, _arg1, what ) );
				}
			}
		} else if (1 === arg0.getCountElementInRow() && 1 ===  arg1.getRowCount()) {
			retArr = new cArray();
			for (var iRow = 0; iRow < arg0.getRowCount(); iRow++, iRow < arg0.getRowCount() ? retArr.addRow() : true) {
				for (var iCol = 0; iCol < arg1.getCountElementInRow(); iCol++) {
					_arg0 = arg0.getElementRowCol(iRow, 0);
					_arg1 = arg1.getElementRowCol(0, iCol);
					retArr.addElement(_func[_arg0.type][_arg1.type](_arg0, _arg1, what));
				}
			}
		} else if (1 === arg1.getCountElementInRow() && 1 ===  arg0.getRowCount()) {
			retArr = new cArray();
			for (var iRow = 0; iRow < arg1.getRowCount(); iRow++, iRow < arg1.getRowCount() ? retArr.addRow() : true) {
				for (var iCol = 0; iCol < arg0.getCountElementInRow(); iCol++) {
					_arg0 = arg0.getElementRowCol(0, iCol);
					_arg1 = arg1.getElementRowCol(iRow, 0);
					retArr.addElement(_func[_arg0.type][_arg1.type](_arg0, _arg1, what));
				}
			}
		}
		return retArr;
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
	window['AscCommonExcel'].cNumFormatFirstCell = cNumFormatFirstCell;
	window['AscCommonExcel'].cNumFormatNone = cNumFormatNone;

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
	window['AscCommonExcel'].getRangeByRef = getRangeByRef;

	window['AscCommonExcel']._func = _func;

	window['AscCommonExcel'].parserFormula = parserFormula;

	window['AscCommonExcel'].parseNum = parseNum;
	window['AscCommonExcel'].matching = matching;
	window['AscCommonExcel'].matchingValue = matchingValue;
	window['AscCommonExcel'].GetDiffDate360 = GetDiffDate360;
	window['AscCommonExcel'].searchRegExp2 = searchRegExp2;
	window['AscCommonExcel'].rtl_math_erf = rtl_math_erf;
	window['AscCommonExcel'].rtl_math_erfc = rtl_math_erfc;
	window['AscCommonExcel'].getArrayMax = getArrayMax;
	window['AscCommonExcel'].getArrayMin = getArrayMin;
})(window);
