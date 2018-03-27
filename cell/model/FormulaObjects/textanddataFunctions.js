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

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
function (window, undefined) {
	// Import
	var cElementType = AscCommonExcel.cElementType;
	var CellValueType = AscCommon.CellValueType;
	var g_oFormatParser = AscCommon.g_oFormatParser;
	var oNumFormatCache = AscCommon.oNumFormatCache;

	var cErrorType = AscCommonExcel.cErrorType;
	var cNumber = AscCommonExcel.cNumber;
	var cString = AscCommonExcel.cString;
	var cBool = AscCommonExcel.cBool;
	var cError = AscCommonExcel.cError;
	var cArea = AscCommonExcel.cArea;
	var cArea3D = AscCommonExcel.cArea3D;
	var cRef = AscCommonExcel.cRef;
	var cRef3D = AscCommonExcel.cRef3D;
	var cArray = AscCommonExcel.cArray;
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	cFormulaFunctionGroup['TextAndData'] = cFormulaFunctionGroup['TextAndData'] || [];
	cFormulaFunctionGroup['TextAndData'].push(cASC, cBAHTTEXT, cCHAR, cCLEAN, cCODE, cCONCATENATE, cCONCAT, cDOLLAR,
		cEXACT, cFIND, cFINDB, cFIXED, cJIS, cLEFT, cLEFTB, cLEN, cLENB, cLOWER, cMID, cMIDB, cNUMBERVALUE, cPHONETIC,
		cPROPER, cREPLACE, cREPLACEB, cREPT, cRIGHT, cRIGHTB, cSEARCH, cSEARCHB, cSUBSTITUTE, cT, cTEXT, cTEXTJOIN,
		cTRIM, cUNICHAR, cUNICODE, cUPPER, cVALUE);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cASC, cBAHTTEXT, cJIS, cPHONETIC);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cASC() {
	}

	cASC.prototype = Object.create(cBaseFunction.prototype);
	cASC.prototype.constructor = cASC;
	cASC.prototype.name = 'ASC';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBAHTTEXT() {
	}

	cBAHTTEXT.prototype = Object.create(cBaseFunction.prototype);
	cBAHTTEXT.prototype.constructor = cBAHTTEXT;
	cBAHTTEXT.prototype.name = 'BAHTTEXT';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHAR() {
	}

	cCHAR.prototype = Object.create(cBaseFunction.prototype);
	cCHAR.prototype.constructor = cCHAR;
	cCHAR.prototype.name = 'CHAR';
	cCHAR.prototype.argumentsMin = 1;
	cCHAR.prototype.argumentsMax = 1;
	cCHAR.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocNumber();
		} else if (arg0 instanceof cArray) {
			var ret = new cArray();
			arg0.foreach(function (elem, r, c) {
				var _elem = elem.tocNumber();
				if (!ret.array[r]) {
					ret.addRow();
				}

				if (_elem instanceof cError) {
					ret.addElement(_elem);
				} else {
					ret.addElement(new cString(String.fromCharCode(_elem.getValue())));
				}
			});
			return ret;
		}

		arg0 = arg0.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cString(String.fromCharCode(arg0.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCLEAN() {
	}

	cCLEAN.prototype = Object.create(cBaseFunction.prototype);
	cCLEAN.prototype.constructor = cCLEAN;
	cCLEAN.prototype.name = 'CLEAN';
	cCLEAN.prototype.argumentsMin = 1;
	cCLEAN.prototype.argumentsMax = 1;
	cCLEAN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocNumber();
		}
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		var v = arg0.getValue(), l = v.length, res = "";

		for (var i = 0; i < l; i++) {
			if (v.charCodeAt(i) > 0x1f) {
				res += v[i];
			}
		}

		return new cString(res);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCODE() {
	}

	cCODE.prototype = Object.create(cBaseFunction.prototype);
	cCODE.prototype.constructor = cCODE;
	cCODE.prototype.name = 'CODE';
	cCODE.prototype.argumentsMin = 1;
	cCODE.prototype.argumentsMax = 1;
	cCODE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			var ret = new cArray();
			arg0.foreach(function (elem, r, c) {
				var _elem = elem.tocString();
				if (!ret.array[r]) {
					ret.addRow();
				}

				if (_elem instanceof cError) {
					ret.addElement(_elem);
				} else {
					ret.addElement(new cNumber(_elem.toString().charCodeAt()));
				}
			});
			return ret;
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cNumber(arg0.toString().charCodeAt());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONCATENATE() {
	}

	//TODO пересмотреть функцию!!!
	cCONCATENATE.prototype = Object.create(cBaseFunction.prototype);
	cCONCATENATE.prototype.constructor = cCONCATENATE;
	cCONCATENATE.prototype.name = 'CONCATENATE';
	cCONCATENATE.prototype.argumentsMin = 1;
	cCONCATENATE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCONCATENATE.prototype.Calculate = function (arg) {
		var arg0 = new cString(""), argI;
		for (var i = 0; i < arg.length; i++) {
			argI = arg[i];
			if (argI instanceof cArea || argI instanceof cArea3D) {
				argI = argI.cross(arguments[1]);
			}
			argI = argI.tocString();
			if (argI instanceof cError) {
				return argI;
			} else if (argI instanceof cArray) {
				argI.foreach(function (elem) {
					if (elem instanceof cError) {
						arg0 = elem;
						return true;
					}

					arg0 = new cString(arg0.toString().concat(elem.toString()));

				});
				if (arg0 instanceof cError) {
					return arg0;
				}
			} else {
				arg0 = new cString(arg0.toString().concat(argI.toString()));
			}
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONCAT() {
	}

	cCONCAT.prototype = Object.create(cBaseFunction.prototype);
	cCONCAT.prototype.constructor = cCONCAT;
	cCONCAT.prototype.name = 'CONCAT';
	cCONCAT.prototype.argumentsMin = 1;
	cCONCAT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCONCAT.prototype.Calculate = function (arg) {
		var arg0 = new cString(""), argI;

		for (var i = 0; i < arg.length; i++) {
			argI = arg[i];

			if (cElementType.cellsRange === argI.type || cElementType.cellsRange3D === argI.type) {
				var _arrVal = argI.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < _arrVal.length; j++) {
					var _arrElem = _arrVal[j].tocString();
					if (cElementType.error === _arrElem.type) {
						return arrVal[j];
					} else {
						arg0 = new cString(arg0.toString().concat(_arrElem));
					}
				}
			} else {
				argI = argI.tocString();
				if (cElementType.error === argI.type) {
					return argI;
				} else if (cElementType.array === argI.type) {
					argI.foreach(function (elem) {
						if (cElementType.error === elem.type) {
							arg0 = elem;
							return true;
						}

						arg0 = new cString(arg0.toString().concat(elem.toString()));

					});
					if (cElementType.error === arg0.type) {
						return arg0;
					}
				} else {
					arg0 = new cString(arg0.toString().concat(argI.toString()));
				}
			}
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDOLLAR() {
	}

	cDOLLAR.prototype = Object.create(cBaseFunction.prototype);
	cDOLLAR.prototype.constructor = cDOLLAR;
	cDOLLAR.prototype.name = 'DOLLAR';
	cDOLLAR.prototype.argumentsMin = 1;
	cDOLLAR.prototype.argumentsMax = 2;
	cDOLLAR.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDOLLAR.prototype.Calculate = function (arg) {

		function SignZeroPositive(number) {
			return number < 0 ? -1 : 1;
		}

		function truncate(n) {
			return Math[n > 0 ? "floor" : "ceil"](n);
		}

		function Floor(number, significance) {
			var quotient = number / significance;
			if (quotient == 0) {
				return 0;
			}
			var nolpiat = 5 * Math.sign(quotient) *
				Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - AscCommonExcel.cExcelSignificantDigits);
			return truncate(quotient + nolpiat) * significance;
		}

		function roundHelper(number, num_digits) {
			if (num_digits > AscCommonExcel.cExcelMaxExponent) {
				if (Math.abs(number) < 1 || num_digits < 1e10) // The values are obtained experimentally
				{
					return new cNumber(number);
				}
				return new cNumber(0);
			} else if (num_digits < AscCommonExcel.cExcelMinExponent) {
				if (Math.abs(number) < 0.01) // The values are obtained experimentally
				{
					return new cNumber(number);
				}
				return new cNumber(0);
			}

			var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));

			number += significance / 2;

			if (number / significance == Infinity) {
				return new cNumber(number);
			}

			return new cNumber(Floor(number, significance));
		}

		function toFix(str, skip) {
			var res, _int, _dec, _tmp = "";

			if (skip) {
				return str;
			}

			res = str.split(".");
			_int = res[0];

			if (res.length == 2) {
				_dec = res[1];
			}

			_int = _int.split("").reverse().join("").match(/([^]{1,3})/ig);

			for (var i = _int.length - 1; i >= 0; i--) {
				_tmp += _int[i].split("").reverse().join("");
				if (i != 0) {
					_tmp += ",";
				}
			}

			if (undefined != _dec) {
				while (_dec.length < arg1.getValue()) _dec += "0";
			}

			return "" + _tmp + ( res.length == 2 ? "." + _dec + "" : "");
		}

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(2), arg2 = arg[2] ? arg[2] : new cBool(false);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}

		if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
			if (arg0 instanceof cError) {
				return arg0;
			} else if (arg0 instanceof cString) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				arg0 = arg0.tocNumber();
			}
		} else {
			arg0 = arg0.tocNumber();
		}

		if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
			arg1 = arg1.getValue();
			if (arg1 instanceof cError) {
				return arg1;
			} else if (arg1 instanceof cString) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				arg1 = arg1.tocNumber();
			}
		} else {
			arg1 = arg1.tocNumber();
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						var res = roundHelper(a.getValue(), b.getValue());
						this.array[r][c] = toFix(res.toString(), arg2.toBool());
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem;
				var b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {
					var res = roundHelper(a.getValue(), b.getValue());
					this.array[r][c] = toFix(res.toString(), arg2.toBool());
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0;
				var b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					var res = roundHelper(a.getValue(), b.getValue());
					this.array[r][c] = toFix(res.toString(), arg2.toBool());
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		var number = arg0.getValue(), num_digits = arg1.getValue();

		var res = roundHelper(number, num_digits).getValue();

		var cNull = "";

		if (num_digits > 0) {
			cNull = ".";
			for (var i = 0; i < num_digits; i++, cNull += "0") {
			}
		}

		res = new cString(oNumFormatCache.get("$#,##0" + cNull + ";($#,##0" + cNull + ")")
			.format(roundHelper(number, num_digits).getValue(), CellValueType.Number,
				AscCommon.gc_nMaxDigCount)[0].text);
		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEXACT() {
	}

	cEXACT.prototype = Object.create(cBaseFunction.prototype);
	cEXACT.prototype.constructor = cEXACT;
	cEXACT.prototype.name = 'EXACT';
	cEXACT.prototype.argumentsMin = 2;
	cEXACT.prototype.argumentsMax = 2;
	cEXACT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocString();

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
			arg1 = arg1.getElementRowCol(0, 0);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		var arg0val = arg0.getValue(), arg1val = arg1.getValue();
		return new cBool(arg0val === arg1val);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFIND() {
	}

	cFIND.prototype = Object.create(cBaseFunction.prototype);
	cFIND.prototype.constructor = cFIND;
	cFIND.prototype.name = 'FIND';
	cFIND.prototype.argumentsMin = 2;
	cFIND.prototype.argumentsMax = 3;
	cFIND.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg.length == 3 ? arg[2] : null, res, str, searchStr,
			pos = -1;

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocString();

		if (arg2 !== null) {

			if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
				arg2 = arg2.cross(arguments[1]);
			}

			arg2 = arg2.tocNumber();
			if (arg2 instanceof cArray) {
				arg2 = arg1.getElementRowCol(0, 0);
			}
			if (arg2 instanceof cError) {
				return arg2;
			}

			pos = arg2.getValue();
			pos = pos > 0 ? pos - 1 : pos;
		}

		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}
		if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		str = arg1.getValue();
		searchStr = RegExp.escape(arg0.getValue());

		if (arg2) {

			if (pos > str.length || pos < 0) {
				return new cError(cErrorType.wrong_value_type);
			}

			str = str.substring(pos);
			res = str.search(searchStr);
			if (res >= 0) {
				res += pos;
			}
		} else {
			res = str.search(searchStr);
		}

		if (res < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cNumber(res + 1);

	};

	/**
	 * @constructor
	 * @extends {cFIND}
	 */
	function cFINDB() {
	}

	cFINDB.prototype = Object.create(cFIND.prototype);
	cFINDB.prototype.constructor = cFINDB;
	cFINDB.prototype.name = 'FINDB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFIXED() {
	}

	cFIXED.prototype = Object.create(cBaseFunction.prototype);
	cFIXED.prototype.constructor = cFIXED;
	cFIXED.prototype.name = 'FIXED';
	cFIXED.prototype.argumentsMin = 1;
	cFIXED.prototype.argumentsMax = 3;
	cFIXED.prototype.Calculate = function (arg) {

		function SignZeroPositive(number) {
			return number < 0 ? -1 : 1;
		}

		function truncate(n) {
			return Math[n > 0 ? "floor" : "ceil"](n);
		}

		function Floor(number, significance) {
			var quotient = number / significance;
			if (quotient == 0) {
				return 0;
			}
			var nolpiat = 5 * Math.sign(quotient) *
				Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - AscCommonExcel.cExcelSignificantDigits);
			return truncate(quotient + nolpiat) * significance;
		}

		function roundHelper(number, num_digits) {
			if (num_digits > AscCommonExcel.cExcelMaxExponent) {
				if (Math.abs(number) < 1 || num_digits < 1e10) // The values are obtained experimentally
				{
					return new cNumber(number);
				}
				return new cNumber(0);
			} else if (num_digits < AscCommonExcel.cExcelMinExponent) {
				if (Math.abs(number) < 0.01) // The values are obtained experimentally
				{
					return new cNumber(number);
				}
				return new cNumber(0);
			}

			var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));

			number += significance / 2;

			if (number / significance == Infinity) {
				return new cNumber(number);
			}

			return new cNumber(Floor(number, significance));
		}

		function toFix(str, skip) {
			var res, _int, _dec, _tmp = "";

			if (skip) {
				return str;
			}

			res = str.split(".");
			_int = res[0];

			if (res.length == 2) {
				_dec = res[1];
			}

			_int = _int.split("").reverse().join("").match(/([^]{1,3})/ig);

			for (var i = _int.length - 1; i >= 0; i--) {
				_tmp += _int[i].split("").reverse().join("");
				if (i != 0) {
					_tmp += ",";
				}
			}

			if (undefined != _dec) {
				while (_dec.length < arg1.getValue()) _dec += "0";
			}

			return "" + _tmp + ( res.length == 2 ? "." + _dec + "" : "");
		}

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(2), arg2 = arg[2] ? arg[2] : new cBool(false);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		}

		arg2 = arg2.tocBool();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}

		if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
			if (arg0 instanceof cError) {
				return arg0;
			} else if (arg0 instanceof cString) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				arg0 = arg0.tocNumber();
			}
		} else {
			arg0 = arg0.tocNumber();
		}

		if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
			arg1 = arg1.getValue();
			if (arg1 instanceof cError) {
				return arg1;
			} else if (arg1 instanceof cString) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				arg1 = arg1.tocNumber();
			}
		} else {
			arg1 = arg1.tocNumber();
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						var res = roundHelper(a.getValue(), b.getValue());
						this.array[r][c] = toFix(res.toString(), arg2.toBool());
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem;
				var b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {
					var res = roundHelper(a.getValue(), b.getValue());
					this.array[r][c] = toFix(res.toString(), arg2.toBool());
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0;
				var b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					var res = roundHelper(a.getValue(), b.getValue());
					this.array[r][c] = toFix(res.toString(), arg2.toBool());
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		var number = arg0.getValue(), num_digits = arg1.getValue();

		var cNull = "";

		if (num_digits > 0) {
			cNull = ".";
			for (var i = 0; i < num_digits; i++, cNull += "0") {
			}
		}
		return new cString(oNumFormatCache.get("#" + (arg2.toBool() ? "" : ",") + "##0" + cNull)
			.format(roundHelper(number, num_digits).getValue(), CellValueType.Number,
				AscCommon.gc_nMaxDigCount)[0].text)
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cJIS() {
	}

	cJIS.prototype = Object.create(cBaseFunction.prototype);
	cJIS.prototype.constructor = cJIS;
	cJIS.prototype.name = 'JIS';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLEFT() {
	}

	cLEFT.prototype = Object.create(cBaseFunction.prototype);
	cLEFT.prototype.constructor = cLEFT;
	cLEFT.prototype.name = 'LEFT';
	cLEFT.prototype.argumentsMin = 1;
	cLEFT.prototype.argumentsMax = 2;
	cLEFT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg.length == 1 ? new cNumber(1) : arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
			arg1 = arg1.getElementRowCol(0, 0);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg1.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cString(arg0.getValue().substring(0, arg1.getValue()))

	};

	/**
	 * @constructor
	 * @extends {cLEFT}
	 */
	function cLEFTB() {
	}

	cLEFTB.prototype = Object.create(cLEFT.prototype);
	cLEFTB.prototype.constructor = cLEFTB;
	cLEFTB.prototype.name = 'LEFTB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLEN() {
	}

	cLEN.prototype = Object.create(cBaseFunction.prototype);
	cLEN.prototype.constructor = cLEN;
	cLEN.prototype.name = 'LEN';
	cLEN.prototype.argumentsMin = 1;
	cLEN.prototype.argumentsMax = 1;
	cLEN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cNumber(arg0.getValue().length)

	};

	/**
	 * @constructor
	 * @extends {cLEN}
	 */
	function cLENB() {
	}

	cLENB.prototype = Object.create(cLEN.prototype);
	cLENB.prototype.constructor = cLENB;
	cLENB.prototype.name = 'LENB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOWER() {
	}

	cLOWER.prototype = Object.create(cBaseFunction.prototype);
	cLOWER.prototype.constructor = cLOWER;
	cLOWER.prototype.name = 'LOWER';
	cLOWER.prototype.argumentsMin = 1;
	cLOWER.prototype.argumentsMax = 1;
	cLOWER.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cString(arg0.getValue().toLowerCase());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMID() {
	}

	cMID.prototype = Object.create(cBaseFunction.prototype);
	cMID.prototype.constructor = cMID;
	cMID.prototype.name = 'MID';
	cMID.prototype.argumentsMin = 3;
	cMID.prototype.argumentsMax = 3;
	cMID.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();

		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}
		if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}
		if (arg2 instanceof cArray) {
			arg2 = arg2.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}
		if (arg1.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (arg2.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		var l = arg0.getValue().length;

		if (arg1.getValue() > l) {
			return new cString("");
		}

		/* if( arg1.getValue() < l )
		 return arg0; */

		return new cString(arg0.getValue().substr(arg1.getValue() == 0 ? 0 : arg1.getValue() - 1, arg2.getValue()));

	};

	/**
	 * @constructor
	 * @extends {cMID}
	 */
	function cMIDB() {
	}

	cMIDB.prototype = Object.create(cMID.prototype);
	cMIDB.prototype.constructor = cMIDB;
	cMIDB.prototype.name = 'MIDB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNUMBERVALUE() {
	}

	cNUMBERVALUE.prototype = Object.create(cBaseFunction.prototype);
	cNUMBERVALUE.prototype.constructor = cNUMBERVALUE;
	cNUMBERVALUE.prototype.name = 'NUMBERVALUE';
	cNUMBERVALUE.prototype.argumentsMin = 1;
	cNUMBERVALUE.prototype.argumentsMax = 3;
	cNUMBERVALUE.prototype.isXLFN = true;
	cNUMBERVALUE.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocString();
		argClone[1] =
			argClone[1] ? argClone[1].tocString() : new cString(AscCommon.g_oDefaultCultureInfo.NumberDecimalSeparator);
		argClone[2] =
			argClone[2] ? argClone[2].tocString() : new cString(AscCommon.g_oDefaultCultureInfo.NumberGroupSeparator);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var replaceAt = function (str, index, chr) {
			if (index > str.length - 1) {
				return str;
			} else {
				return str.substr(0, index) + chr + str.substr(index + 1);
			}
		};

		var calcText = function (argArray) {
			var aInputString = argArray[0];
			var aDecimalSeparator = argArray[1], aGroupSeparator = argArray[2];
			var cDecimalSeparator = 0;

			if (aDecimalSeparator) {
				if (aDecimalSeparator.length === 1) {
					cDecimalSeparator = aDecimalSeparator[0];
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}

			if (cDecimalSeparator && aGroupSeparator && aGroupSeparator.indexOf(cDecimalSeparator) !== -1) {
				return new cError(cErrorType.wrong_value_type)
			}

			if (aInputString.length === 0) {
				return new cError(cErrorType.wrong_value_type)
			}

			//считаем количество вхождений cDecimalSeparator в строке
			var count = 0;
			for (var i = 0; i < aInputString.length; i++) {
				if (cDecimalSeparator === aInputString[i]) {
					count++;
				}
				if (count > 1) {
					return new cError(cErrorType.wrong_value_type);
				}
			}

			var nDecSep = cDecimalSeparator ? aInputString.indexOf(cDecimalSeparator) : 0;
			if (nDecSep !== 0) {
				var aTemporary = nDecSep >= 0 ? aInputString.substr(0, nDecSep) : aInputString;

				var nIndex = 0;
				while (nIndex < aGroupSeparator.length) {
					var nChar = aGroupSeparator[nIndex];

					aTemporary = aTemporary.replace(new RegExp(RegExp.escape(nChar), "g"), "");
					nIndex++;
				}

				if (nDecSep >= 0) {
					aInputString = aTemporary + aInputString.substr(nDecSep);
				} else {
					aInputString = aTemporary;
				}
			}

			//replace decimal separator
			aInputString =
				aInputString.replace(cDecimalSeparator, AscCommon.g_oDefaultCultureInfo.NumberDecimalSeparator);

			//delete spaces
			aInputString = aInputString.replace(/(\s|\r|\t|\n)/g, "");
			/*for ( var i = aInputString.length; i >= 0; i--){
			 var c = aInputString.charCodeAt(i);
			 if ( c == 0x0020 || c == 0x0009 || c == 0x000A || c == 0x000D ){
			 aInputString = aInputString.replaceAt( i, 1, "" ); // remove spaces etc.
			 }
			 }*/

			//remove and count '%'
			var nPercentCount = 0;
			for (var i = aInputString.length - 1; i >= 0 && aInputString.charCodeAt(i) === 0x0025; i--) {
				aInputString = replaceAt(aInputString, i, "");
				nPercentCount++;
			}

			var fVal = AscCommon.g_oFormatParser.parse(aInputString, AscCommon.g_oDefaultCultureInfo);
			if (fVal) {
				fVal = fVal.value;
				if (nPercentCount) {
					fVal *= Math.pow(10, -(nPercentCount * 2));
				}

				return new cNumber(fVal);
			}

			return new cError(cErrorType.wrong_value_type)
		};

		return this._findArrayInNumberArguments(oArguments, calcText, true);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPHONETIC() {
	}

	cPHONETIC.prototype = Object.create(cBaseFunction.prototype);
	cPHONETIC.prototype.constructor = cPHONETIC;
	cPHONETIC.prototype.name = 'PHONETIC';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPROPER() {
	}

	cPROPER.prototype = Object.create(cBaseFunction.prototype);
	cPROPER.prototype.constructor = cPROPER;
	cPROPER.prototype.name = 'PROPER';
	cPROPER.prototype.argumentsMin = 1;
	cPROPER.prototype.argumentsMax = 1;
	cPROPER.prototype.Calculate = function (arg) {
		var reg_PROPER = new RegExp("[-#$+*/^&%<\\[\\]='?_\\@!~`\">: ;.\\)\\(,]|\\d|\\s"), arg0 = arg[0];

		function proper(str) {
			var canUpper = true, retStr = "", regTest;
			for (var i = 0; i < str.length; i++) {
				regTest = reg_PROPER.test(str[i]);

				if (regTest) {
					canUpper = true;
				} else {
					if (canUpper) {
						retStr += str[i].toUpperCase();
						canUpper = false;
						continue;
					}
				}

				retStr += str[i].toLowerCase();

			}
			return retStr;
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			var ret = new cArray();
			arg0.foreach(function (elem, r, c) {
				var _elem = elem.tocString();
				if (!ret.array[r]) {
					ret.addRow();
				}

				if (_elem instanceof cError) {
					ret.addElement(_elem);
				} else {
					ret.addElement(new cString(proper(_elem.toString())));
				}
			});
			return ret;
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cString(proper(arg0.toString()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cREPLACE() {
	}

	cREPLACE.prototype = Object.create(cBaseFunction.prototype);
	cREPLACE.prototype.constructor = cREPLACE;
	cREPLACE.prototype.name = 'REPLACE';
	cREPLACE.prototype.argumentsMin = 4;
	cREPLACE.prototype.argumentsMax = 4;
	cREPLACE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0).tocString();
		}

		arg0 = arg0.tocString();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]).tocNumber();
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0).tocNumber();
		}

		arg1 = arg1.tocNumber();

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]).tocNumber();
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0).tocNumber();
		}

		arg2 = arg2.tocNumber();

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1]).tocString();
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0).tocString();
		}

		arg3 = arg3.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}
		if (arg3 instanceof cError) {
			return arg3;
		}

		if (arg1.getValue() < 1 || arg2.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		var string1 = arg0.getValue(), string2 = arg3.getValue(), res = "";

		string1 = string1.split("");
		string1.splice(arg1.getValue() - 1, arg2.getValue(), string2);
		for (var i = 0; i < string1.length; i++) {
			res += string1[i];
		}

		return new cString(res);

	};

	/**
	 * @constructor
	 * @extends {cREPLACE}
	 */
	function cREPLACEB() {
	}

	cREPLACEB.prototype = Object.create(cREPLACE.prototype);
	cREPLACEB.prototype.constructor = cREPLACEB;
	cREPLACEB.prototype.name = 'REPLACEB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cREPT() {
	}

	cREPT.prototype = Object.create(cBaseFunction.prototype);
	cREPT.prototype.constructor = cREPT;
	cREPT.prototype.name = 'REPT';
	cREPT.prototype.argumentsMin = 2;
	cREPT.prototype.argumentsMax = 2;
	cREPT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], res = "";
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
			arg1 = arg1.getElementRowCol(0, 0);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}


		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return arg0;
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]).tocNumber();
		} else if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
			arg1 = arg1.getValue();
		}

		if (arg1 instanceof cError) {
			return arg1;
		} else if (arg1 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		} else {
			arg1 = arg1.tocNumber();
		}

		if (arg1.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cString(arg0.getValue().repeat(arg1.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRIGHT() {
	}

	cRIGHT.prototype = Object.create(cBaseFunction.prototype);
	cRIGHT.prototype.constructor = cRIGHT;
	cRIGHT.prototype.name = 'RIGHT';
	cRIGHT.prototype.argumentsMin = 1;
	cRIGHT.prototype.argumentsMax = 2;
	cRIGHT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg.length === 1 ? new cNumber(1) : arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
			arg1 = arg1.getElementRowCol(0, 0);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg1.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}
		var l = arg0.getValue().length, _number = l - arg1.getValue();
		return new cString(arg0.getValue().substring(_number < 0 ? 0 : _number, l))

	};

	/**
	 * @constructor
	 * @extends {cRIGHT}
	 */
	function cRIGHTB() {
	}

	cRIGHTB.prototype = Object.create(cRIGHT.prototype);
	cRIGHTB.prototype.constructor = cRIGHTB;
	cRIGHTB.prototype.name = 'RIGHTB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSEARCH() {
	}

	cSEARCH.prototype = Object.create(cBaseFunction.prototype);
	cSEARCH.prototype.constructor = cSEARCH;
	cSEARCH.prototype.name = 'SEARCH';
	cSEARCH.prototype.argumentsMin = 2;
	cSEARCH.prototype.argumentsMax = 3;
	cSEARCH.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber(1);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0).tocString();
		}

		arg0 = arg0.tocString();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]).tocString();
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0).tocString();
		}

		arg1 = arg1.tocString();

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]).tocNumber();
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0).tocNumber();
		}

		arg2 = arg2.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}

		if (arg2.getValue() < 1 || arg2.getValue() > arg1.getValue().length) {
			return new cError(cErrorType.wrong_value_type);
		}

		var string1 = arg0.getValue(), string2 = arg1.getValue(), valueForSearching = string1
			.replace(/(\\)/g, "\\\\")
			.replace(/(\^)/g, "\\^")
			.replace(/(\()/g, "\\(")
			.replace(/(\))/g, "\\)")
			.replace(/(\+)/g, "\\+")
			.replace(/(\[)/g, "\\[")
			.replace(/(\])/g, "\\]")
			.replace(/(\{)/g, "\\{")
			.replace(/(\})/g, "\\}")
			.replace(/(\$)/g, "\\$")
			.replace(/(\.)/g, "\\.")
			.replace(/(~)?\*/g, function ($0, $1) {
				return $1 ? $0 : '(.*)';
			})
			.replace(/(~)?\?/g, function ($0, $1) {
				return $1 ? $0 : '.';
			})
			.replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?");
		valueForSearching = new RegExp(valueForSearching, "ig");
		if ('' === string1) {
			return arg2;
		}


		var res = string2.substring(arg2.getValue() - 1).search(valueForSearching) + arg2.getValue() - 1;

		if (res < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cNumber(res + 1);

	};

	/**
	 * @constructor
	 * @extends {cRIGHT}
	 */
	function cSEARCHB() {
	}

	cSEARCHB.prototype = Object.create(cSEARCH.prototype);
	cSEARCHB.prototype.constructor = cSEARCHB;
	cSEARCHB.prototype.name = 'SEARCHB';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUBSTITUTE() {
	}

	cSUBSTITUTE.prototype = Object.create(cBaseFunction.prototype);
	cSUBSTITUTE.prototype.constructor = cSUBSTITUTE;
	cSUBSTITUTE.prototype.name = 'SUBSTITUTE';
	cSUBSTITUTE.prototype.argumentsMin = 3;
	cSUBSTITUTE.prototype.argumentsMax = 4;
	cSUBSTITUTE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new cNumber(0);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0).tocString();
		}

		arg0 = arg0.tocString();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]).tocString();
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0).tocString();
		}

		arg1 = arg1.tocString();

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]).tocString();
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0).tocString();
		}

		arg2 = arg2.tocString();

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1]).tocNumber();
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0).tocNumber();
		}

		arg3 = arg3.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg2 instanceof cError) {
			return arg2;
		}
		if (arg3 instanceof cError) {
			return arg3;
		}

		if (arg3.getValue() < 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		var string = arg0.getValue(), old_string = arg1.getValue(), new_string = arg2.getValue(),
			occurence = arg3.getValue(), index = 0, res;
		res = string.replace(new RegExp(RegExp.escape(old_string), "g"), function (equal, p1, source) {
			index++;
			if (occurence == 0 || occurence > source.length) {
				return new_string;
			} else if (occurence == index) {
				return new_string;
			}
			return equal;
		});

		return new cString(res);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT() {
	}

	cT.prototype = Object.create(cBaseFunction.prototype);
	cT.prototype.constructor = cT;
	cT.prototype.name = 'T';
	cT.prototype.argumentsMin = 1;
	cT.prototype.argumentsMax = 1;
	cT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		} else if (arg0 instanceof cString || arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg[0] instanceof cArray) {
			arg0 = arg[0].getElementRowCol(0, 0);
		}

		if (arg0 instanceof cString || arg0 instanceof cError) {
			return arg[0];
		} else {
			return new AscCommonExcel.cEmpty();
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTEXT() {
	}

	cTEXT.prototype = Object.create(cBaseFunction.prototype);
	cTEXT.prototype.constructor = cTEXT;
	cTEXT.prototype.name = 'TEXT';
	cTEXT.prototype.argumentsMin = 2;
	cTEXT.prototype.argumentsMax = 2;
	cTEXT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.getValue();
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
			arg1 = arg1.getValue();
		} else if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg1 = arg1.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		var _tmp = arg0.tocNumber();
		if (_tmp instanceof cNumber) {
			arg0 = _tmp;
		}

		var oFormat = oNumFormatCache.get(arg1.toString());
		var a = g_oFormatParser.parse(arg0.getValue() + ""), aText;
		aText = oFormat.format(a ? a.value : arg0.getValue(),
			(arg0 instanceof cNumber || a) ? CellValueType.Number : CellValueType.String,
			AscCommon.gc_nMaxDigCountView);
		var text = "";

		for (var i = 0, length = aText.length; i < length; ++i) {

			if (aText[i].format && aText[i].format.getSkip()) {
				text += " ";
				continue;
			}
			if (aText[i].format && aText[i].format.getRepeat()) {
				continue;
			}

			text += aText[i].text;
		}

		var res = new cString(text);
		res.numFormat = AscCommonExcel.cNumFormatNone;
		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTEXTJOIN() {
	}

	cTEXTJOIN.prototype = Object.create(cBaseFunction.prototype);
	cTEXTJOIN.prototype.constructor = cTEXTJOIN;
	cTEXTJOIN.prototype.name = 'TEXTJOIN';
	cTEXTJOIN.prototype.argumentsMin = 3;
	cTEXTJOIN.prototype.argumentsMax = 255;
	cTEXTJOIN.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cTEXTJOIN.prototype.isXLFN = true;
	cTEXTJOIN.prototype.Calculate = function (arg) {

		var argClone = [arg[0], arg[1]];
		argClone[1] = arg[1].tocBool();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var ignore_empty = argClone[1].toBool();
		var delimiter = argClone[0];
		var delimiterIter = 0;
		//разделитель может быть в виде массива, где используются все его элементы
		var delimiterArr = this._getOneDimensionalArray(delimiter);
		//если хотя бы один элемент ошибка, то возвращаем ошибку
		if (delimiterArr instanceof cError) {
			return delimiterArr;
		}

		var concatString = function (string1, string2) {
			var res = string1;
			if ("" === string2 && ignore_empty) {
				return res;
			}
			var isStartStr = string1 === "";
			//выбираем разделитель из массива по порядку
			var delimiterStr = isStartStr ? "" : delimiterArr[delimiterIter];
			if (undefined === delimiterStr) {
				delimiterIter = 0;
				delimiterStr = delimiterArr[delimiterIter];
			}
			if (!isStartStr) {
				delimiterIter++;
			}

			res += delimiterStr + string2;
			return res;
		};

		var arg0 = new cString(""), argI;
		for (var i = 2; i < arg.length; i++) {
			argI = arg[i];

			var type = argI.type;
			if (cElementType.cellsRange === type || cElementType.cellsRange3D === type || cElementType.array === type) {
				//получаем одномерный массив
				argI = this._getOneDimensionalArray(argI);

				//если хотя бы один элемент с ошибкой, возвращаем ошибку
				if (argI instanceof cError) {
					return argI;
				}

				for (var n = 0; n < argI.length; n++) {
					arg0 = new cString(concatString(arg0.toString(), argI[n].toString()));
				}

			} else {
				argI = argI.tocString();
				if (argI instanceof cError) {
					return argI;
				}

				arg0 = new cString(concatString(arg0.toString(), argI.toString()));
			}
		}

		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTRIM() {
	}

	cTRIM.prototype = Object.create(cBaseFunction.prototype);
	cTRIM.prototype.constructor = cTRIM;
	cTRIM.prototype.name = 'TRIM';
	cTRIM.prototype.argumentsMin = 1;
	cTRIM.prototype.argumentsMax = 1;
	cTRIM.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]).tocString();
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0).tocString();
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}

		return new cString(arg0.getValue().replace(AscCommon.rx_space_g, function ($0, $1, $2) {
			var res = " " === $2[$1 + 1] ? "" : $2[$1];
			return res;
		}).replace(/^ | $/g, ""))
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cUNICHAR() {
	}

	cUNICHAR.prototype = Object.create(cBaseFunction.prototype);
	cUNICHAR.prototype.constructor = cUNICHAR;
	cUNICHAR.prototype.name = 'UNICHAR';
	cUNICHAR.prototype.argumentsMin = 1;
	cUNICHAR.prototype.argumentsMax = 1;
	cUNICHAR.prototype.isXLFN = true;
	cUNICHAR.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function _func(argArray) {
			var num = parseInt(argArray[0]);
			if (isNaN(num) || num <= 0 || num > 1114111) {
				return new cError(cErrorType.wrong_value_type);
			}

			var res = String.fromCharCode(num);
			if ("" === res) {
				return new cError(cErrorType.wrong_value_type);
			}


			return new cString(res);
		}

		return this._findArrayInNumberArguments(oArguments, _func, true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cUNICODE() {
	}

	cUNICODE.prototype = Object.create(cBaseFunction.prototype);
	cUNICODE.prototype.constructor = cUNICODE;
	cUNICODE.prototype.name = 'UNICODE';
	cUNICODE.prototype.argumentsMin = 1;
	cUNICODE.prototype.argumentsMax = 1;
	cUNICODE.prototype.isXLFN = true;
	cUNICODE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocString();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function _func(argArray) {
			var str = argArray[0].toString();
			var res = str.charCodeAt(0);
			return new cNumber(res);
		}

		return this._findArrayInNumberArguments(oArguments, _func, true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cUPPER() {
	}

	cUPPER.prototype = Object.create(cBaseFunction.prototype);
	cUPPER.prototype.constructor = cUPPER;
	cUPPER.prototype.name = 'UPPER';
	cUPPER.prototype.argumentsMin = 1;
	cUPPER.prototype.argumentsMax = 1;
	cUPPER.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}
		return new cString(arg0.getValue().toUpperCase());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVALUE() {
	}

	cVALUE.prototype = Object.create(cBaseFunction.prototype);
	cVALUE.prototype.constructor = cVALUE;
	cVALUE.prototype.name = 'VALUE';
	cVALUE.prototype.argumentsMin = 1;
	cVALUE.prototype.argumentsMax = 1;
	cVALUE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cVALUE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return arg0;
		}

		var res = g_oFormatParser.parse(arg0.getValue());

		if (res) {
			return new cNumber(res.value);
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

	};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].cTEXT = cTEXT;
})(window);
