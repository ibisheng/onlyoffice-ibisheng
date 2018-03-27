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
	var cElementType = AscCommonExcel.cElementType;
	var cErrorType = AscCommonExcel.cErrorType;
	var cExcelSignificantDigits = AscCommonExcel.cExcelSignificantDigits;
	var cNumber = AscCommonExcel.cNumber;
	var cString = AscCommonExcel.cString;
	var cBool = AscCommonExcel.cBool;
	var cError = AscCommonExcel.cError;
	var cArea = AscCommonExcel.cArea;
	var cArea3D = AscCommonExcel.cArea3D;
	var cRef = AscCommonExcel.cRef;
	var cRef3D = AscCommonExcel.cRef3D;
	var cEmpty = AscCommonExcel.cEmpty;
	var cArray = AscCommonExcel.cArray;
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	var _func = AscCommonExcel._func;

	var AGGREGATE_FUNC_AVE     = 1;
	var AGGREGATE_FUNC_CNT     = 2;
	var AGGREGATE_FUNC_CNTA    = 3;
	var AGGREGATE_FUNC_MAX     = 4;
	var AGGREGATE_FUNC_MIN     = 5;
	var AGGREGATE_FUNC_PROD    = 6;
	var AGGREGATE_FUNC_STD     = 7;
	var AGGREGATE_FUNC_STDP    = 8;
	var AGGREGATE_FUNC_SUM     = 9;
	var AGGREGATE_FUNC_VAR     = 10;
	var AGGREGATE_FUNC_VARP    = 11;
	var AGGREGATE_FUNC_MEDIAN  = 12;
	var AGGREGATE_FUNC_MODSNGL = 13;
	var AGGREGATE_FUNC_LARGE   = 14;
	var AGGREGATE_FUNC_SMALL   = 15;
	var AGGREGATE_FUNC_PERCINC = 16;
	var AGGREGATE_FUNC_QRTINC  = 17;
	var AGGREGATE_FUNC_PERCEXC = 18;
	var AGGREGATE_FUNC_QRTEXC  = 19;

	cFormulaFunctionGroup['Mathematic'] = cFormulaFunctionGroup['Mathematic'] || [];
	cFormulaFunctionGroup['Mathematic'].push(cABS, cACOS, cACOSH, cACOT, cACOTH, cAGGREGATE, cARABIC, cASIN, cASINH,
		cATAN, cATAN2, cATANH, cBASE, cCEILING, cCEILING_MATH, cCEILING_PRECISE, cCOMBIN, cCOMBINA, cCOS, cCOSH, cCOT,
		cCOTH, cCSC, cCSCH, cDECIMAL, cDEGREES, cECMA_CEILING, cEVEN, cEXP, cFACT, cFACTDOUBLE, cFLOOR, cFLOOR_PRECISE,
		cFLOOR_MATH, cGCD, cINT, cISO_CEILING, cLCM, cLN, cLOG, cLOG10, cMDETERM, cMINVERSE, cMMULT, cMOD, cMROUND,
		cMULTINOMIAL, cODD, cPI, cPOWER, cPRODUCT, cQUOTIENT, cRADIANS, cRAND, cRANDBETWEEN, cROMAN, cROUND, cROUNDDOWN,
		cROUNDUP, cSEC, cSECH, cSERIESSUM, cSIGN, cSIN, cSINH, cSQRT, cSQRTPI, cSUBTOTAL, cSUM, cSUMIF, cSUMIFS,
		cSUMPRODUCT, cSUMSQ, cSUMX2MY2, cSUMX2PY2, cSUMXMY2, cTAN, cTANH, cTRUNC);

	var cSubTotalFunctionType = {
		includes: {
			AVERAGE: 1, COUNT: 2, COUNTA: 3, MAX: 4, MIN: 5, PRODUCT: 6, STDEV: 7, STDEVP: 8, SUM: 9, VAR: 10, VARP: 11
		}, excludes: {
			AVERAGE: 101,
			COUNT: 102,
			COUNTA: 103,
			MAX: 104,
			MIN: 105,
			PRODUCT: 106,
			STDEV: 107,
			STDEVP: 108,
			SUM: 109,
			VAR: 110,
			VARP: 111
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cABS() {
	}

	cABS.prototype = Object.create(cBaseFunction.prototype);
	cABS.prototype.constructor = cABS;
	cABS.prototype.name = 'ABS';
	cABS.prototype.argumentsMin = 1;
	cABS.prototype.argumentsMax = 1;
	cABS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					this.array[r][c] = new cNumber(Math.abs(elem.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
		} else {
			return new cNumber(Math.abs(arg0.getValue()));
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cACOS() {
	}

	cACOS.prototype = Object.create(cBaseFunction.prototype);
	cACOS.prototype.constructor = cACOS;
	cACOS.prototype.name = 'ACOS';
	cACOS.prototype.argumentsMin = 1;
	cACOS.prototype.argumentsMax = 1;
	cACOS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.acos(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.acos(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cACOSH() {
	}

	cACOSH.prototype = Object.create(cBaseFunction.prototype);
	cACOSH.prototype.constructor = cACOSH;
	cACOSH.prototype.name = 'ACOSH';
	cACOSH.prototype.argumentsMin = 1;
	cACOSH.prototype.argumentsMax = 1;
	cACOSH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.acosh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.acosh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cACOT() {
	}

	cACOT.prototype = Object.create(cBaseFunction.prototype);
	cACOT.prototype.constructor = cACOT;
	cACOT.prototype.name = 'ACOT';
	cACOT.prototype.argumentsMin = 1;
	cACOT.prototype.argumentsMax = 1;
	cACOT.prototype.isXLFN = true;
	cACOT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cACOT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					var a = Math.PI / 2 - Math.atan(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			var a = Math.PI / 2 - Math.atan(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cACOTH() {
	}

	cACOTH.prototype = Object.create(cBaseFunction.prototype);
	cACOTH.prototype.constructor = cACOTH;
	cACOTH.prototype.name = 'ACOTH';
	cACOTH.prototype.argumentsMin = 1;
	cACOTH.prototype.argumentsMax = 1;
	cACOTH.prototype.isXLFN = true;
	cACOTH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cACOTH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					var a = Math.atanh(1 / elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			var a = Math.atanh(1 / arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAGGREGATE() {
	}

	cAGGREGATE.prototype = Object.create(cBaseFunction.prototype);
	cAGGREGATE.prototype.constructor = cAGGREGATE;
	cAGGREGATE.prototype.name = 'AGGREGATE';
	cAGGREGATE.prototype.argumentsMin = 3;
	cAGGREGATE.prototype.argumentsMax = 253;
	cAGGREGATE.prototype.isXLFN = true;
	cAGGREGATE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments([arg[0], arg[1]], arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var nFunc = argClone[0].getValue();
		var f = null;
		switch (nFunc) {
			case AGGREGATE_FUNC_AVE:
				f = AscCommonExcel.cAVERAGE.prototype;
				break;
			case AGGREGATE_FUNC_CNT:
				f = AscCommonExcel.cCOUNT.prototype;
				break;
			case AGGREGATE_FUNC_CNTA:
				f = AscCommonExcel.cCOUNTA.prototype;
				break;
			case AGGREGATE_FUNC_MAX:
				f = AscCommonExcel.cMAX.prototype;
				break;
			case AGGREGATE_FUNC_MIN:
				f = AscCommonExcel.cMIN.prototype;
				break;
			case AGGREGATE_FUNC_PROD:
				f = AscCommonExcel.cPRODUCT.prototype;
				break;
			case AGGREGATE_FUNC_STD:
				f = AscCommonExcel.cSTDEV_S.prototype;
				break;
			case AGGREGATE_FUNC_STDP:
				f = AscCommonExcel.cSTDEV_P.prototype;
				break;
			case AGGREGATE_FUNC_SUM:
				f = AscCommonExcel.cSUM.prototype;
				break;
			case AGGREGATE_FUNC_VAR:
				f = AscCommonExcel.cVAR_S.prototype;
				break;
			case AGGREGATE_FUNC_VARP:
				f = AscCommonExcel.cVAR_P.prototype;
				break;
			case AGGREGATE_FUNC_MEDIAN:
				f = AscCommonExcel.cMEDIAN.prototype;
				break;
			case AGGREGATE_FUNC_MODSNGL:
				f = AscCommonExcel.cMODE_SNGL.prototype;
				break;
			case AGGREGATE_FUNC_LARGE:
				if (arg[3]) {
					f = AscCommonExcel.cLARGE.prototype;
				}
				break;
			case AGGREGATE_FUNC_SMALL:
				if (arg[3]) {
					f = AscCommonExcel.cSMALL.prototype;
				}
				break;
			case AGGREGATE_FUNC_PERCINC:
				if (arg[3]) {
					f = AscCommonExcel.cPERCENTILE_INC.prototype;
				}
				break;
			case AGGREGATE_FUNC_QRTINC:
				if (arg[3]) {
					f = AscCommonExcel.cQUARTILE_INC.prototype;
				}
				break;
			case AGGREGATE_FUNC_PERCEXC:
				if (arg[3]) {
					f = AscCommonExcel.cPERCENTILE_EXC.prototype;
				}
				break;
			case AGGREGATE_FUNC_QRTEXC:
				if (arg[3]) {
					f = AscCommonExcel.cQUARTILE_EXC.prototype;
				}
				break;
			default:
				return new cError(cErrorType.not_numeric);
		}

		if (null === f) {
			return new cError(cErrorType.wrong_value_type);
		}

		var nOption = argClone[1].getValue();
		var ignoreHiddenRows = false;
		var ignoreErrorsVal = false;
		var ignoreNestedStAg = false;
		switch (nOption) {
			case 0 : // ignore nested SUBTOTAL and AGGREGATE functions
				ignoreNestedStAg = true;
				break;
			case 1 : // ignore hidden rows, nested SUBTOTAL and AGGREGATE functions
				ignoreNestedStAg = true;
				ignoreHiddenRows = true;
				break;
			case 2 : // ignore error values, nested SUBTOTAL and AGGREGATE functions
				ignoreNestedStAg = true;
				ignoreErrorsVal = true;
				break;
			case 3 : // ignore hidden rows, error values, nested SUBTOTAL and AGGREGATE functions
				ignoreNestedStAg = true;
				ignoreErrorsVal = true;
				ignoreHiddenRows = true;
				break;
			case 4 : // ignore nothing
				break;
			case 5 : // ignore hidden rows
				ignoreHiddenRows = true;
				break;
			case 6 : // ignore error values
				ignoreErrorsVal = true;
				break;
			case 7 : // ignore hidden rows and error values
				ignoreHiddenRows = true;
				ignoreErrorsVal = true;
				break;
			default :
				return new cError(cErrorType.not_numeric);
		}

		var res;
		if (f) {
			var oldExcludeHiddenRows = f.excludeHiddenRows;
			var oldExcludeErrorsVal = f.excludeErrorsVal;
			var oldIgnoreNestedStAg = f.excludeNestedStAg;

			f.excludeHiddenRows = ignoreHiddenRows;
			f.excludeErrorsVal = ignoreErrorsVal;
			f.excludeNestedStAg = ignoreNestedStAg;

			var newArgs = [];
			//14 - 19 особенные функции, требующие второго аргумента
			var doNotCheckRef = nFunc >= 14 && nFunc <= 19;
			for (var i = 2; i < arg.length; i++) {
				//аргумент может быть только ссылка на ячейку или диапазон ячеек
				//в противном случае - ошибка
				if(doNotCheckRef || this.checkRef(arg[i])) {
					newArgs.push(arg[i]);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}

			if (f.argumentsMax && newArgs.length > f.argumentsMax) {
				return new cError(cErrorType.wrong_value_type);
			}

			res = f.Calculate(newArgs);

			f.excludeHiddenRows = oldExcludeHiddenRows;
			f.excludeErrorsVal = oldExcludeErrorsVal;
			f.excludeNestedStAg = oldIgnoreNestedStAg;
		}

		return res;
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cARABIC() {
	}

	cARABIC.prototype = Object.create(cBaseFunction.prototype);
	cARABIC.prototype.constructor = cARABIC;
	cARABIC.prototype.name = 'ARABIC';
	cARABIC.prototype.argumentsMin = 1;
	cARABIC.prototype.argumentsMax = 1;
	cARABIC.prototype.isXLFN = true;
	cARABIC.prototype.Calculate = function (arg) {
		var to_arabic = function (roman) {
			roman = roman.toUpperCase();
			if (roman < 1) {
				return 0;
			} else if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/i.test(roman)) {
				return NaN;
			}

			var chars = {
				"M": 1000,
				"CM": 900,
				"D": 500,
				"CD": 400,
				"C": 100,
				"XC": 90,
				"L": 50,
				"XL": 40,
				"X": 10,
				"IX": 9,
				"V": 5,
				"IV": 4,
				"I": 1
			};
			var arabic = 0;
			roman.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function (i) {
				arabic += chars[i];
			});

			return arabic;
		};

		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			return new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.tocString();

		if (cElementType.error === arg0.type) {
			return arg0;
		}

		if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				var a = elem;
				if (cElementType.string === a.type) {
					var res = to_arabic(a.getValue());
					this.array[r][c] = isNaN(res) ? new cError(cErrorType.wrong_value_type) : new cNumber(res);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		}

		//TODO проверить возвращение ошибок!
		var res = to_arabic(arg0.getValue());
		return isNaN(res) ? new cError(cErrorType.wrong_value_type) : new cNumber(res);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cASIN() {
	}

	cASIN.prototype = Object.create(cBaseFunction.prototype);
	cASIN.prototype.constructor = cASIN;
	cASIN.prototype.name = 'ASIN';
	cASIN.prototype.argumentsMin = 1;
	cASIN.prototype.argumentsMax = 1;
	cASIN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.asin(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.asin(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cASINH() {
	}

	cASINH.prototype = Object.create(cBaseFunction.prototype);
	cASINH.prototype.constructor = cASINH;
	cASINH.prototype.name = 'ASINH';
	cASINH.prototype.argumentsMin = 1;
	cASINH.prototype.argumentsMax = 1;
	cASINH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.asinh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.asinh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cATAN() {
	}

	cATAN.prototype = Object.create(cBaseFunction.prototype);
	cATAN.prototype.constructor = cATAN;
	cATAN.prototype.name = 'ATAN';
	cATAN.prototype.argumentsMin = 1;
	cATAN.prototype.argumentsMax = 1;
	cATAN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.atan(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			var a = Math.atan(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cATAN2() {
	}

	cATAN2.prototype = Object.create(cBaseFunction.prototype);
	cATAN2.prototype.constructor = cATAN2;
	cATAN2.prototype.name = 'ATAN2';
	cATAN2.prototype.argumentsMin = 2;
	cATAN2.prototype.argumentsMax = 2;
	cATAN2.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem, b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] =
							a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) :
								new cNumber(Math.atan2(b.getValue(), a.getValue()))
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] =
						a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) :
							new cNumber(Math.atan2(b.getValue(), a.getValue()))
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] =
						a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) :
							new cNumber(Math.atan2(b.getValue(), a.getValue()))
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		return (    arg0 instanceof cError ? arg0 : arg1 instanceof cError ? arg1 :
				arg1.getValue() == 0 && arg0.getValue() == 0 ? new cError(cErrorType.division_by_zero) :
					new cNumber(Math.atan2(arg1.getValue(), arg0.getValue()))
		)
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cATANH() {
	}

	cATANH.prototype = Object.create(cBaseFunction.prototype);
	cATANH.prototype.constructor = cATANH;
	cATANH.prototype.name = 'ATANH';
	cATANH.prototype.argumentsMin = 1;
	cATANH.prototype.argumentsMax = 1;
	cATANH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.atanh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.atanh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBASE() {
	}

	cBASE.prototype = Object.create(cBaseFunction.prototype);
	cBASE.prototype.constructor = cBASE;
	cBASE.prototype.name = 'BASE';
	cBASE.prototype.argumentsMin = 2;
	cBASE.prototype.argumentsMax = 3;
	cBASE.prototype.isXLFN = true;
	cBASE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(0);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function base_math(argArray) {
			var number = parseInt(argArray[0]);
			var radix = parseInt(argArray[1]);
			var min_length = parseInt(argArray[2]);

			if (radix < 2 || radix > 36 || number < 0 || number > Math.pow(2, 53) || min_length < 0) {
				return new cError(cErrorType.not_numeric);
			}

			var str = number.toString(radix);
			str = str.toUpperCase();
			if (str.length < min_length) {
				var prefix = "";
				for (var i = 0; i < min_length - str.length; i++) {
					prefix += "0";
				}
				str = prefix + str;
			}

			return new cString(str);
		}

		return this._findArrayInNumberArguments(oArguments, base_math);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCEILING() {
	}

	cCEILING.prototype = Object.create(cBaseFunction.prototype);
	cCEILING.prototype.constructor = cCEILING;
	cCEILING.prototype.name = 'CEILING';
	cCEILING.prototype.argumentsMin = 2;
	cCEILING.prototype.argumentsMax = 2;
	cCEILING.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg[0].tocNumber();
		arg1 = arg[1].tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		function ceilingHelper(number, significance) {
			if (significance == 0) {
				return new cNumber(0.0);
			}
			if (number > 0 && significance < 0) {
				return new cError(cErrorType.not_numeric);
			} else if (number / significance === Infinity) {
				return new cError(cErrorType.not_numeric);
			} else {
				var quotient = number / significance;
				if (quotient == 0) {
					return new cNumber(0.0);
				}
				var quotientTr = Math.floor(quotient);

				var nolpiat = 5 * Math.sign(quotient) *
					Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);

				if (Math.abs(quotient - quotientTr) > nolpiat) {
					++quotientTr;
				}
				return new cNumber(quotientTr * significance);
			}
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem, b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = ceilingHelper(a.getValue(), b.getValue())
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] = ceilingHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] = ceilingHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		return ceilingHelper(arg0.getValue(), arg1.getValue());

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCEILING_MATH() {
	}

	cCEILING_MATH.prototype = Object.create(cBaseFunction.prototype);
	cCEILING_MATH.prototype.constructor = cCEILING_MATH;
	cCEILING_MATH.prototype.name = 'CEILING.MATH';
	cCEILING_MATH.prototype.argumentsMin = 1;
	cCEILING_MATH.prototype.argumentsMax = 3;
	cCEILING_MATH.prototype.isXLFN = true;
	cCEILING_MATH.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		if (!argClone[1]) {
			argClone[1] = argClone[0] > 0 ? new cNumber(1) : new cNumber(-1);
		}
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(0);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function floor_math(argArray) {
			var number = argArray[0];
			var significance = argArray[1];
			var mod = argArray[2];

			if (significance === 0 || number === 0) {
				return new cNumber(0.0);
			}

			if (number * significance < 0.0) {
				significance = -significance;
			}

			if (mod === 0 && number < 0.0) {
				return new cNumber(Math.floor(number / significance) * significance);
			} else {
				return new cNumber(Math.ceil(number / significance) * significance);
			}
		}

		return this._findArrayInNumberArguments(oArguments, floor_math);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCEILING_PRECISE() {
	}

	cCEILING_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cCEILING_PRECISE.prototype.constructor = cCEILING_PRECISE;
	cCEILING_PRECISE.prototype.name = 'CEILING.PRECISE';
	cCEILING_PRECISE.prototype.argumentsMin = 1;
	cCEILING_PRECISE.prototype.argumentsMax = 2;
	cCEILING_PRECISE.prototype.isXLFN = true;
	cCEILING_PRECISE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1] ? argClone[1].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function floorHelper(argArray) {
			var number = argArray[0];
			var significance = argArray[1];
			if (significance === 0 || number === 0) {
				return new cNumber(0.0);
			}

			var absSignificance = Math.abs(significance);
			var quotient = number / absSignificance;
			return new cNumber(Math.ceil(quotient) * absSignificance);
		}

		return this._findArrayInNumberArguments(oArguments, floorHelper);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOMBIN() {
	}

	cCOMBIN.prototype = Object.create(cBaseFunction.prototype);
	cCOMBIN.prototype.constructor = cCOMBIN;
	cCOMBIN.prototype.name = 'COMBIN';
	cCOMBIN.prototype.argumentsMin = 2;
	cCOMBIN.prototype.argumentsMax = 2;
	cCOMBIN.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem, b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || b.getValue() <= 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		if (arg0.getValue() <= 0 || arg1.getValue() <= 0 || arg0.getValue() < arg1.getValue()) {
			return new cError(cErrorType.not_numeric);
		}

		return new cNumber(Math.binomCoeff(arg0.getValue(), arg1.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOMBINA() {
	}

	cCOMBINA.prototype = Object.create(cBaseFunction.prototype);
	cCOMBINA.prototype.constructor = cCOMBINA;
	cCOMBINA.prototype.name = 'COMBINA';
	cCOMBINA.prototype.argumentsMin = 2;
	cCOMBINA.prototype.argumentsMax = 2;
	cCOMBINA.prototype.isXLFN = true;
	cCOMBINA.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function combinaCalculate(argArray) {
			var a = argArray[0];
			var b = argArray[1];

			if (a < 0 || b < 0 || a < b) {
				return new cError(cErrorType.not_numeric);
			}

			a = parseInt(a);
			b = parseInt(b);
			return new cNumber(Math.binomCoeff(a + b - 1, b));
		}

		return this._findArrayInNumberArguments(oArguments, combinaCalculate);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOS() {
	}

	cCOS.prototype = Object.create(cBaseFunction.prototype);
	cCOS.prototype.constructor = cCOS;
	cCOS.prototype.name = 'COS';
	cCOS.prototype.argumentsMin = 1;
	cCOS.prototype.argumentsMax = 1;
	cCOS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.cos(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.cos(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOSH() {
	}

	cCOSH.prototype = Object.create(cBaseFunction.prototype);
	cCOSH.prototype.constructor = cCOSH;
	cCOSH.prototype.name = 'COSH';
	cCOSH.prototype.argumentsMin = 1;
	cCOSH.prototype.argumentsMax = 1;
	cCOSH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.cosh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.cosh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOT() {
	}

	cCOT.prototype = Object.create(cBaseFunction.prototype);
	cCOT.prototype.constructor = cCOT;
	cCOT.prototype.name = 'COT';
	cCOT.prototype.argumentsMin = 1;
	cCOT.prototype.argumentsMax = 1;
	cCOT.prototype.isXLFN = true;
	cCOT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		var maxVal = Math.pow(2, 27);
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					if (0 === elem.getValue()) {
						this.array[r][c] = new cError(cErrorType.division_by_zero);
					} else if (Math.abs(elem.getValue()) >= maxVal) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						var a = 1 / Math.tan(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			if (0 === arg0.getValue()) {
				return new cError(cErrorType.division_by_zero);
			} else if (Math.abs(arg0.getValue()) >= maxVal) {
				return new cError(cErrorType.not_numeric);
			}

			var a = 1 / Math.tan(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOTH() {
	}

	cCOTH.prototype = Object.create(cBaseFunction.prototype);
	cCOTH.prototype.constructor = cCOTH;
	cCOTH.prototype.name = 'COTH';
	cCOTH.prototype.argumentsMin = 1;
	cCOTH.prototype.argumentsMax = 1;
	cCOTH.prototype.isXLFN = true;
	cCOTH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOTH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		//TODO в документации к COTH написано максимальное значение - Math.pow(2, 27), но MS EXCEL в данном случае не выдает ошибку
		//проверку на максиимальное значение убрал
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					if (0 === elem.getValue()) {
						this.array[r][c] = new cError(cErrorType.division_by_zero);
					} else {
						var a = 1 / Math.tanh(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			if (0 === arg0.getValue()) {
				return new cError(cErrorType.division_by_zero);
			}

			var a = 1 / Math.tanh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCSC() {
	}

	cCSC.prototype = Object.create(cBaseFunction.prototype);
	cCSC.prototype.constructor = cCSC;
	cCSC.prototype.name = 'CSC';
	cCSC.prototype.argumentsMin = 1;
	cCSC.prototype.argumentsMax = 1;
	cCSC.prototype.isXLFN = true;
	cCSC.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCSC.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		var maxVal = Math.pow(2, 27);
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					if (0 === elem.getValue()) {
						this.array[r][c] = new cError(cErrorType.division_by_zero);
					} else if (Math.abs(elem.getValue()) >= maxVal) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						var a = 1 / Math.sin(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			if (0 === arg0.getValue()) {
				return new cError(cErrorType.division_by_zero);
			} else if (Math.abs(arg0.getValue()) >= maxVal) {
				return new cError(cErrorType.not_numeric);
			}

			var a = 1 / Math.sin(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCSCH() {
	}

	cCSCH.prototype = Object.create(cBaseFunction.prototype);
	cCSCH.prototype.constructor = cCSCH;
	cCSCH.prototype.name = 'CSCH';
	cCSCH.prototype.argumentsMin = 1;
	cCSCH.prototype.argumentsMax = 1;
	cCSCH.prototype.isXLFN = true;
	cCSCH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCSCH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		//TODO в документации к COTH написано максимальное значение - Math.pow(2, 27), но MS EXCEL в данном случае не выдает ошибку
		//проверку на максиимальное значение убрал
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					if (0 === elem.getValue()) {
						this.array[r][c] = new cError(cErrorType.division_by_zero);
					} else {
						var a = 1 / Math.sinh(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			if (0 === arg0.getValue()) {
				return new cError(cErrorType.division_by_zero);
			}

			var a = 1 / Math.sinh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDECIMAL() {
	}

	cDECIMAL.prototype = Object.create(cBaseFunction.prototype);
	cDECIMAL.prototype.constructor = cDECIMAL;
	cDECIMAL.prototype.name = 'DECIMAL';
	cDECIMAL.prototype.argumentsMin = 2;
	cDECIMAL.prototype.argumentsMax = 2;
	cDECIMAL.prototype.isXLFN = true;
	cDECIMAL.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocString();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function decimal_calculate(argArray) {
			var a = argArray[0];
			var b = argArray[1];
			b = parseInt(b);

			if (b < 2 || b > 36) {
				return new cError(cErrorType.not_numeric);
			}

			var fVal = 0;
			var startIndex = 0;
			while (a[startIndex] === ' ') {
				startIndex++;
			}

			if (b === 16) {
				if (a[startIndex] === 'x' || a[startIndex] === 'X') {
					startIndex++;
				} else if (a[startIndex] === '0' && ( a[startIndex + 1] === 'x' || a[startIndex + 1] === 'X' )) {
					startIndex += 2;
				}
			}

			a = a.toLowerCase();
			var startPos = 'a'.charCodeAt(0);
			for (var i = startIndex; i < a.length; i++) {
				var n;
				if ('0' <= a[i] && a[i] <= '9') {
					n = a[i] - '0';
				} else if ('a' <= a[i] && a[i] <= 'z') {
					var currentPos = a[i].charCodeAt(0);
					n = 10 + parseInt(currentPos - startPos);
				} else {
					n = b;
				}

				if (b <= n) {
					return new cError(cErrorType.not_numeric);
				} else {
					fVal = fVal * b + n;
				}
			}

			return isNaN(fVal) ? new cError(cErrorType.not_numeric) : new cNumber(fVal);
		}

		return this._findArrayInNumberArguments(oArguments, decimal_calculate, true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDEGREES() {
	}

	cDEGREES.prototype = Object.create(cBaseFunction.prototype);
	cDEGREES.prototype.constructor = cDEGREES;
	cDEGREES.prototype.name = 'DEGREES';
	cDEGREES.prototype.argumentsMin = 1;
	cDEGREES.prototype.argumentsMax = 1;
	cDEGREES.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = elem.getValue();
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = arg0.getValue();
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
		}
		return arg0;

	};

	/**
	 * @constructor
	 * @extends {cCEILING}
	 */
	//TODO нигде нет отписания к этой функции! работает так же как и cCEILING на всех примерах.
	function cECMA_CEILING() {
	}

	cECMA_CEILING.prototype = Object.create(cCEILING.prototype);
	cECMA_CEILING.prototype.constructor = cECMA_CEILING;
	cECMA_CEILING.prototype.name = 'ECMA.CEILING';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEVEN() {
	}

	cEVEN.prototype = Object.create(cBaseFunction.prototype);
	cEVEN.prototype.constructor = cEVEN;
	cEVEN.prototype.name = 'EVEN';
	cEVEN.prototype.argumentsMin = 1;
	cEVEN.prototype.argumentsMax = 1;
	cEVEN.prototype.Calculate = function (arg) {

		function evenHelper(arg) {
			var arg0 = arg.getValue();
			if (arg0 >= 0) {
				arg0 = Math.ceil(arg0);
				if ((arg0 & 1) == 0) {
					return new cNumber(arg0);
				} else {
					return new cNumber(arg0 + 1);
				}
			} else {
				arg0 = Math.floor(arg0);
				if ((arg0 & 1) == 0) {
					return new cNumber(arg0);
				} else {
					return new cNumber(arg0 - 1);
				}
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		arg0 = arg0.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}

		if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					this.array[r][c] = evenHelper(elem);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg0 instanceof cNumber) {
			return evenHelper(arg0);
		}
		return new cError(cErrorType.wrong_value_type);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEXP() {
	}

	cEXP.prototype = Object.create(cBaseFunction.prototype);
	cEXP.prototype.constructor = cEXP;
	cEXP.prototype.name = 'EXP';
	cEXP.prototype.argumentsMin = 1;
	cEXP.prototype.argumentsMax = 1;
	cEXP.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.exp(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		}
		if (!(arg0 instanceof cNumber)) {
			return new cError(cErrorType.not_numeric);
		} else {
			var a = Math.exp(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFACT() {
	}

	cFACT.prototype = Object.create(cBaseFunction.prototype);
	cFACT.prototype.constructor = cFACT;
	cFACT.prototype.name = 'FACT';
	cFACT.prototype.argumentsMin = 1;
	cFACT.prototype.argumentsMax = 1;
	cFACT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					if (elem.getValue() < 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						var a = Math.fact(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			if (arg0.getValue() < 0) {
				return new cError(cErrorType.not_numeric);
			}
			var a = Math.fact(arg0.getValue());
			return isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFACTDOUBLE() {
	}

	cFACTDOUBLE.prototype = Object.create(cBaseFunction.prototype);
	cFACTDOUBLE.prototype.constructor = cFACTDOUBLE;
	cFACTDOUBLE.prototype.name = 'FACTDOUBLE';
	cFACTDOUBLE.prototype.argumentsMin = 1;
	cFACTDOUBLE.prototype.argumentsMax = 1;
	cFACTDOUBLE.prototype.Calculate = function (arg) {
		function factDouble(n) {
			if (n == 0) {
				return 0;
			} else if (n < 0) {
				return Number.NaN;
			} else if (n > 300) {
				return Number.Infinity;
			}
			n = Math.floor(n);
			var res = n, _n = n, ost = -(_n & 1);
			n -= 2;

			while (n != ost) {
				res *= n;
				n -= 2;
			}
			return res;
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					if (elem.getValue() < 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						var a = factDouble(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			if (arg0.getValue() < 0) {
				return new cError(cErrorType.not_numeric);
			}
			var a = factDouble(arg0.getValue());
			return isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFLOOR() {
	}

	cFLOOR.prototype = Object.create(cBaseFunction.prototype);
	cFLOOR.prototype.constructor = cFLOOR;
	cFLOOR.prototype.name = 'FLOOR';
	cFLOOR.prototype.argumentsMin = 2;
	cFLOOR.prototype.argumentsMax = 2;
	cFLOOR.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg[0].tocNumber();
		arg1 = arg[1].tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		function floorHelper(number, significance) {
			if (significance == 0) {
				return new cNumber(0.0);
			}
			if (( number > 0 && significance < 0 ) || ( number < 0 && significance > 0 )) {
				return new cError(cErrorType.not_numeric);
			} else if (number / significance === Infinity) {
				return new cError(cErrorType.not_numeric);
			} else {
				var quotient = number / significance;
				if (quotient == 0) {
					return new cNumber(0.0);
				}

				var nolpiat = 5 * ( quotient < 0 ? -1.0 : quotient > 0 ? 1.0 : 0.0 ) *
					Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);

				return new cNumber(Math.floor(quotient + nolpiat) * significance);
			}
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = floorHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = floorHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = floorHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		if (arg0 instanceof cString || arg1 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		}

		return floorHelper(arg0.getValue(), arg1.getValue());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFLOOR_PRECISE() {
	}

	cFLOOR_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cFLOOR_PRECISE.prototype.constructor = cFLOOR_PRECISE;
	cFLOOR_PRECISE.prototype.name = 'FLOOR.PRECISE';
	cFLOOR_PRECISE.prototype.argumentsMin = 1;
	cFLOOR_PRECISE.prototype.argumentsMax = 2;
	cFLOOR_PRECISE.prototype.isXLFN = true;
	cFLOOR_PRECISE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1] ? argClone[1].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function floorHelper(argArray) {
			var number = argArray[0];
			var significance = argArray[1];
			if (significance === 0 || number === 0) {
				return new cNumber(0.0);
			}

			var absSignificance = Math.abs(significance);
			var quotient = number / absSignificance;
			return new cNumber(Math.floor(quotient) * absSignificance);
		}

		return this._findArrayInNumberArguments(oArguments, floorHelper);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFLOOR_MATH() {
	}

	cFLOOR_MATH.prototype = Object.create(cBaseFunction.prototype);
	cFLOOR_MATH.prototype.constructor = cFLOOR_MATH;
	cFLOOR_MATH.prototype.name = 'FLOOR.MATH';
	cFLOOR_MATH.prototype.argumentsMin = 1;
	cFLOOR_MATH.prototype.argumentsMax = 3;
	cFLOOR_MATH.prototype.isXLFN = true;
	cFLOOR_MATH.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		if (!argClone[1]) {
			argClone[1] = argClone[0] > 0 ? new cNumber(1) : new cNumber(-1);
		}
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(0);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function floor_math(argArray) {
			var number = argArray[0];
			var significance = argArray[1];
			var mod = argArray[2];

			if (significance === 0 || number === 0) {
				return new cNumber(0.0);
			}

			if (number * significance < 0.0) {
				significance = -significance;
			}

			if (mod === 0 && number < 0.0) {
				return new cNumber(Math.ceil(number / significance) * significance);
			} else {
				return new cNumber(Math.floor(number / significance) * significance);
			}
		}

		return this._findArrayInNumberArguments(oArguments, floor_math);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGCD() {
	}

	cGCD.prototype = Object.create(cBaseFunction.prototype);
	cGCD.prototype.constructor = cGCD;
	cGCD.prototype.name = 'GCD';
	cGCD.prototype.argumentsMin = 1;
	cGCD.prototype.Calculate = function (arg) {

		var _gcd = 0, argArr;

		function gcd(a, b) {
			var _a = parseInt(a), _b = parseInt(b);
			while (_b != 0)
				_b = _a % (_a = _b);
			return _a;
		}

		for (var i = 0; i < arg.length; i++) {
			var argI = arg[i];

			if (argI instanceof cArea || argI instanceof cArea3D) {
				argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return argArr[j];
					}

					if (argArr[j] instanceof cString) {
						continue;
					}

					if (argArr[j] instanceof cBool) {
						argArr[j] = argArr[j].tocNumber();
					}

					if (argArr[j].getValue() < 0) {
						return new cError(cErrorType.not_numeric);
					}

					_gcd = gcd(_gcd, argArr[j].getValue());
				}
			} else if (argI instanceof cArray) {
				argArr = argI.tocNumber();

				if (argArr.foreach(function (arrElem) {

						if (arrElem instanceof cError) {
							_gcd = arrElem;
							return true;
						}

						if (arrElem instanceof cBool) {
							arrElem = arrElem.tocNumber();
						}

						if (arrElem instanceof cString) {
							return;
						}

						if (arrElem.getValue() < 0) {
							_gcd = new cError(cErrorType.not_numeric);
							return true;
						}
						_gcd = gcd(_gcd, arrElem.getValue());

					})) {
					return _gcd;
				}
			} else {
				argI = argI.tocNumber();

				if (argI.getValue() < 0) {
					return new cError(cErrorType.not_numeric);
				}

				if (argI instanceof cError) {
					return argI;
				}

				_gcd = gcd(_gcd, argI.getValue())
			}
		}

		return new cNumber(_gcd);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cINT() {
	}

	cINT.prototype = Object.create(cBaseFunction.prototype);
	cINT.prototype.constructor = cINT;
	cINT.prototype.name = 'INT';
	cINT.prototype.argumentsMin = 1;
	cINT.prototype.argumentsMax = 1;
	cINT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg0 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					this.array[r][c] = new cNumber(Math.floor(elem.getValue()))
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			return new cNumber(Math.floor(arg0.getValue()))
		}

		return new cNumber(Math.floor(arg0.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	//TODO точная копия функции CEILING.PRECISE. зачем excel две одинаковые функции?
	function cISO_CEILING() {
	}

	cISO_CEILING.prototype = Object.create(cBaseFunction.prototype);
	cISO_CEILING.prototype.constructor = cISO_CEILING;
	cISO_CEILING.prototype.name = 'ISO.CEILING';
	cISO_CEILING.prototype.argumentsMin = 1;
	cISO_CEILING.prototype.argumentsMax = 2;
	//cISO_CEILING.prototype.isXLFN = true;
	cISO_CEILING.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1]);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1] ? argClone[1].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function floorHelper(argArray) {
			var number = argArray[0];
			var significance = argArray[1];
			if (significance === 0 || number === 0) {
				return new cNumber(0.0);
			}

			var absSignificance = Math.abs(significance);
			var quotient = number / absSignificance;
			return new cNumber(Math.ceil(quotient) * absSignificance);
		}

		return this._findArrayInNumberArguments(oArguments, floorHelper);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLCM() {
	}

	cLCM.prototype = Object.create(cBaseFunction.prototype);
	cLCM.prototype.constructor = cLCM;
	cLCM.prototype.name = 'LCM';
	cLCM.prototype.argumentsMin = 1;
	cLCM.prototype.Calculate = function (arg) {

		var _lcm = 1, argArr;

		function gcd(a, b) {
			var _a = parseInt(a), _b = parseInt(b);
			while (_b != 0)
				_b = _a % (_a = _b);
			return _a;
		}

		function lcm(a, b) {
			return Math.abs(parseInt(a) * parseInt(b)) / gcd(a, b);
		}

		for (var i = 0; i < arg.length; i++) {
			var argI = arg[i];

			if (argI instanceof cArea || argI instanceof cArea3D) {
				argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return argArr[j];
					}

					if (argArr[j] instanceof cString) {
						continue;
					}

					if (argArr[j] instanceof cBool) {
						argArr[j] = argArr[j].tocNumber();
					}

					if (argArr[j].getValue() <= 0) {
						return new cError(cErrorType.not_numeric);
					}

					_lcm = lcm(_lcm, argArr[j].getValue());
				}
			} else if (argI instanceof cArray) {
				argArr = argI.tocNumber();

				if (argArr.foreach(function (arrElem) {

						if (arrElem instanceof cError) {
							_lcm = arrElem;
							return true;
						}

						if (arrElem instanceof cBool) {
							arrElem = arrElem.tocNumber();
						}

						if (arrElem instanceof cString) {
							return;
						}

						if (arrElem.getValue() <= 0) {
							_lcm = new cError(cErrorType.not_numeric);
							return true;
						}
						_lcm = lcm(_lcm, arrElem.getValue());

					})) {
					return _lcm;
				}
			} else {
				argI = argI.tocNumber();

				if (argI.getValue() <= 0) {
					return new cError(cErrorType.not_numeric);
				}

				if (argI instanceof cError) {
					return argI;
				}

				_lcm = lcm(_lcm, argI.getValue())
			}
		}

		return new cNumber(_lcm);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLN() {
	}

	cLN.prototype = Object.create(cBaseFunction.prototype);
	cLN.prototype.constructor = cLN;
	cLN.prototype.name = 'LN';
	cLN.prototype.argumentsMin = 1;
	cLN.prototype.argumentsMax = 1;
	cLN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg0 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					if (elem.getValue() <= 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						this.array[r][c] = new cNumber(Math.log(elem.getValue()));
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			if (arg0.getValue() <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.log(arg0.getValue()));
			}
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOG() {
	}

	cLOG.prototype = Object.create(cBaseFunction.prototype);
	cLOG.prototype.constructor = cLOG;
	cLOG.prototype.name = 'LOG';
	cLOG.prototype.argumentsMin = 1;
	cLOG.prototype.argumentsMax = 2;
	cLOG.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(10);
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1 ? arg1 : new cNumber(10);
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || a.getValue() <= 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || a.getValue() <= 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		if (!(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) )) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg0.getValue() <= 0 || ( arg1 && arg1.getValue() <= 0 )) {
			return new cError(cErrorType.not_numeric);
		}

		return new cNumber(Math.log(arg0.getValue()) / Math.log(arg1.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOG10() {
	}

	cLOG10.prototype = Object.create(cBaseFunction.prototype);
	cLOG10.prototype.constructor = cLOG10;
	cLOG10.prototype.name = 'LOG10';
	cLOG10.prototype.argumentsMin = 1;
	cLOG10.prototype.argumentsMax = 1;
	cLOG10.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg0 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					if (elem.getValue() <= 0) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						this.array[r][c] = new cNumber(Math.log10(elem.getValue()));
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			if (arg0.getValue() <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.log10(arg0.getValue()));
			}
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMDETERM() {
	}

	cMDETERM.prototype = Object.create(cBaseFunction.prototype);
	cMDETERM.prototype.constructor = cMDETERM;
	cMDETERM.prototype.name = 'MDETERM';
	cMDETERM.prototype.argumentsMin = 1;
	cMDETERM.prototype.argumentsMax = 1;
	cMDETERM.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cMDETERM.prototype.Calculate = function (arg) {

		function determ(A) {
			var N = A.length, denom = 1, exchanges = 0, i, j;

			for (i = 0; i < N; i++) {
				for (j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
						return NaN;
					}
				}
			}

			for (i = 0; i < N - 1; i++) {
				var maxN = i, maxValue = Math.abs(A[i][i] instanceof cEmpty ? NaN : A[i][i]);
				for (j = i + 1; j < N; j++) {
					var value = Math.abs(A[j][i] instanceof cEmpty ? NaN : A[j][i]);
					if (value > maxValue) {
						maxN = j;
						maxValue = value;
					}
				}
				if (maxN > i) {
					var temp = A[i];
					A[i] = A[maxN];
					A[maxN] = temp;
					exchanges++;
				} else {
					if (maxValue == 0) {
						return maxValue;
					}
				}
				var value1 = A[i][i] instanceof cEmpty ? NaN : A[i][i];
				for (j = i + 1; j < N; j++) {
					var value2 = A[j][i] instanceof cEmpty ? NaN : A[j][i];
					A[j][i] = 0;
					for (var k = i + 1; k < N; k++) {
						A[j][k] = (A[j][k] * value1 - A[i][k] * value2) / denom;
					}
				}
				denom = value1;
			}

			if (exchanges % 2) {
				return -A[N - 1][N - 1];
			} else {
				return A[N - 1][N - 1];
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else {
			return new cError(cErrorType.not_available);
		}

		if (arg0[0].length != arg0.length) {
			return new cError(cErrorType.wrong_value_type);
		}

		arg0 = determ(arg0);

		if (!isNaN(arg0)) {
			return new cNumber(arg0);
		} else {
			return new cError(cErrorType.not_available);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMINVERSE() {
	}

	cMINVERSE.prototype = Object.create(cBaseFunction.prototype);
	cMINVERSE.prototype.constructor = cMINVERSE;
	cMINVERSE.prototype.name = 'MINVERSE';
	cMINVERSE.prototype.argumentsMin = 1;
	cMINVERSE.prototype.argumentsMax = 1;
	cMINVERSE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cMINVERSE.prototype.Calculate = function (arg) {

		function Determinant(A) {
			var N = A.length, B = [], denom = 1, exchanges = 0, i, j;

			for (i = 0; i < N; ++i) {
				B[i] = [];
				for (j = 0; j < N; ++j) {
					B[i][j] = A[i][j];
				}
			}

			for (i = 0; i < N - 1; ++i) {
				var maxN = i, maxValue = Math.abs(B[i][i]);
				for (j = i + 1; j < N; ++j) {
					var value = Math.abs(B[j][i]);
					if (value > maxValue) {
						maxN = j;
						maxValue = value;
					}
				}
				if (maxN > i) {
					var temp = B[i];
					B[i] = B[maxN];
					B[maxN] = temp;
					++exchanges;
				} else {
					if (maxValue == 0) {
						return maxValue;
					}
				}
				var value1 = B[i][i];
				for (j = i + 1; j < N; ++j) {
					var value2 = B[j][i];
					B[j][i] = 0;
					for (var k = i + 1; k < N; ++k) {
						B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
					}
				}
				denom = value1;
			}
			if (exchanges % 2) {
				return -B[N - 1][N - 1];
			} else {
				return B[N - 1][N - 1];
			}
		}

		function MatrixCofactor(i, j, __A) {        //Алгебраическое дополнение матрицы
			var N = __A.length, sign = ((i + j) % 2 == 0) ? 1 : -1;

			for (var m = 0; m < N; m++) {
				for (var n = j + 1; n < N; n++) {
					__A[m][n - 1] = __A[m][n];
				}
				__A[m].length--;
			}
			for (var k = (i + 1); k < N; k++) {
				__A[k - 1] = __A[k];
			}
			__A.length--;

			return sign * Determinant(__A);
		}

		function AdjugateMatrix(_A) {             //Союзная (присоединённая) матрица к A. (матрица adj(A), составленная из алгебраических дополнений A).
			var N = _A.length, B = [], adjA = [];

			for (var i = 0; i < N; i++) {
				adjA[i] = [];
				for (var j = 0; j < N; j++) {
					for (var m = 0; m < N; m++) {
						B[m] = [];
						for (var n = 0; n < N; n++) {
							B[m][n] = _A[m][n];
						}
					}
					adjA[i][j] = MatrixCofactor(j, i, B);
				}
			}

			return adjA;
		}

		function InverseMatrix(A) {
			var i, j;
			for (i = 0; i < A.length; i++) {
				for (j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
						return new cError(cErrorType.not_available);
					} else {
						A[i][j] = A[i][j].getValue();
					}
				}
			}

			var detA = Determinant(A), invertA, res;

			if (detA != 0) {
				invertA = AdjugateMatrix(A);
				var datA = 1 / detA;
				for (i = 0; i < invertA.length; i++) {
					for (j = 0; j < invertA[i].length; j++) {
						invertA[i][j] = new cNumber(datA * invertA[i][j]);
					}
				}
				res = new cArray();
				res.fillFromArray(invertA);
			} else {
				res = new cError(cErrorType.not_available);
			}

			return res;
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else {
			return new cError(cErrorType.not_available);
		}

		if (arg0[0].length != arg0.length) {
			return new cError(cErrorType.wrong_value_type);
		}

		return InverseMatrix(arg0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMMULT() {
	}

	cMMULT.prototype = Object.create(cBaseFunction.prototype);
	cMMULT.prototype.constructor = cMMULT;
	cMMULT.prototype.name = 'MMULT';
	cMMULT.prototype.argumentsMin = 2;
	cMMULT.prototype.argumentsMax = 2;
	cMMULT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cMMULT.prototype.Calculate = function (arg) {

		function mult(A, B) {
			var i, j;
			for (i = 0; i < A.length; i++) {
				for (j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
						return new cError(cErrorType.not_available);
					}
				}
			}
			for (i = 0; i < B.length; i++) {
				for (j = 0; j < B[i].length; j++) {
					if (B[i][j] instanceof cEmpty || B[i][j] instanceof cString) {
						return new cError(cErrorType.not_available);
					}
				}
			}

			if (A.length != B[0].length) {
				return new cError(cErrorType.wrong_value_type);
			}
			var C = new Array(A.length);
			for (i = 0; i < A.length; i++) {
				C[i] = new Array(B[0].length);
				for (j = 0; j < B[0].length; j++) {
					C[i][j] = 0;
					for (var k = 0; k < B.length; k++) {
						C[i][j] += A[i][k].getValue() * B[k][j].getValue();
					}
					C[i][j] = new cNumber(C[i][j]);
				}
			}
			var res = new cArray();
			res.fillFromArray(C);
			return res;
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else {
			return new cError(cErrorType.not_available);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArray) {
			arg1 = arg1.getMatrix();
		} else {
			return new cError(cErrorType.not_available);
		}

		return mult(arg0, arg1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMOD() {
	}

	cMOD.prototype = Object.create(cBaseFunction.prototype);
	cMOD.prototype.constructor = cMOD;
	cMOD.prototype.name = 'MOD';
	cMOD.prototype.argumentsMin = 2;
	cMOD.prototype.argumentsMax = 2;
	cMOD.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = new cNumber(
							(b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ));
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {

					this.array[r][c] =
						new cNumber((b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] =
						new cNumber((b.getValue() < 0 ? -1 : 1) * ( Math.abs(a.getValue()) % Math.abs(b.getValue()) ));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		if (!(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) )) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1.getValue() == 0) {
			return new cError(cErrorType.division_by_zero);
		}

		return new cNumber((arg1.getValue() < 0 ? -1 : 1) * ( Math.abs(arg0.getValue()) % Math.abs(arg1.getValue()) ));

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMROUND() {
	}

	cMROUND.prototype = Object.create(cBaseFunction.prototype);
	cMROUND.prototype.constructor = cMROUND;
	cMROUND.prototype.name = 'MROUND';
	cMROUND.prototype.argumentsMin = 2;
	cMROUND.prototype.argumentsMax = 2;
	cMROUND.prototype.Calculate = function (arg) {

		var multiple;

		function mroundHelper(num) {
			var multiplier = Math.pow(10, Math.floor(Math.log10(Math.abs(num))) - cExcelSignificantDigits + 1);
			var nolpiat = 0.5 * (num > 0 ? 1 : num < 0 ? -1 : 0) * multiplier;
			var y = (num + nolpiat) / multiplier;
			y = y / Math.abs(y) * Math.floor(Math.abs(y));
			var x = y * multiplier / multiple;

			// var x = number / multiple;
			nolpiat =
				5 * (x / Math.abs(x)) * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - cExcelSignificantDigits);
			x = x + nolpiat;
			x = x | x;

			return x * multiple;
		}

		function f(a, b, r, c) {
			if (a instanceof cNumber && b instanceof cNumber) {
				if (a.getValue() == 0) {
					this.array[r][c] = new cNumber(0);
				} else if (a.getValue() < 0 && b.getValue() > 0 || arg0.getValue() > 0 && b.getValue() < 0) {
					this.array[r][c] = new cError(cErrorType.not_numeric);
				} else {
					multiple = b.getValue();
					this.array[r][c] = new cNumber(mroundHelper(a.getValue() + b.getValue() / 2))
				}
			} else {
				this.array[r][c] = new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}
		if (arg0 instanceof cString || arg1 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					f.call(this, elem, arg1.getElementRowCol(r, c), r, c)
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				f.call(this, elem, arg1, r, c);
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				f.call(this, arg0, elem, r, c)
			});
			return arg1;
		}

		if (arg1.getValue() == 0) {
			return new cNumber(0);
		}

		if (arg0.getValue() < 0 && arg1.getValue() > 0 || arg0.getValue() > 0 && arg1.getValue() < 0) {
			return new cError(cErrorType.not_numeric);
		}

		multiple = arg1.getValue();
		return new cNumber(mroundHelper(arg0.getValue() + arg1.getValue() / 2));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMULTINOMIAL() {
	}

	cMULTINOMIAL.prototype = Object.create(cBaseFunction.prototype);
	cMULTINOMIAL.prototype.constructor = cMULTINOMIAL;
	cMULTINOMIAL.prototype.name = 'MULTINOMIAL';
	cMULTINOMIAL.prototype.argumentsMin = 1;
	cMULTINOMIAL.prototype.Calculate = function (arg) {
		var arg0 = new cNumber(0), fact = 1;

		for (var i = 0; i < arg.length; i++) {
			if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
				var _arrVal = arg[i].getValue();
				for (var j = 0; j < _arrVal.length; j++) {
					if (_arrVal[j] instanceof cNumber) {
						if (_arrVal[j].getValue() < 0) {
							return new cError(cError.not_numeric);
						}
						arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
						fact *= Math.fact(_arrVal[j].getValue());
					} else if (_arrVal[j] instanceof cError) {
						return _arrVal[j];
					} else {
						return new cError(cError.wrong_value_type);
					}
				}
			} else if (arg[i] instanceof cArray) {
				if (arg[i].foreach(function (arrElem) {
						if (arrElem instanceof cNumber) {
							if (arrElem.getValue() < 0) {
								return true;
							}

							arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
							fact *= Math.fact(arrElem.getValue());
						} else {
							return true;
						}
					})) {
					return new cError(cErrorType.wrong_value_type);
				}
			} else if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
				var _arg = arg[i].getValue();

				if (_arg.getValue() < 0) {
					return new cError(cErrorType.not_numeric);
				}

				if (_arg instanceof cNumber) {
					if (_arg.getValue() < 0) {
						return new cError(cError.not_numeric);
					}
					arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
					fact *= Math.fact(_arg.getValue());
				} else if (_arg instanceof cError) {
					return _arg;
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			} else if (arg[i] instanceof cNumber) {

				if (arg[i].getValue() < 0) {
					return new cError(cErrorType.not_numeric);
				}

				arg0 = _func[arg0.type][arg[i].type](arg0, arg[i], "+");
				fact *= Math.fact(arg[i].getValue());
			} else if (arg[i] instanceof cError) {
				return arg[i];
			} else {
				return new cError(cErrorType.wrong_value_type);
			}

			if (arg0 instanceof cError) {
				return new cError(cErrorType.wrong_value_type);
			}
		}

		if (arg0.getValue() > 170) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cNumber(Math.fact(arg0.getValue()) / fact);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cODD() {
	}

	cODD.prototype = Object.create(cBaseFunction.prototype);
	cODD.prototype.constructor = cODD;
	cODD.prototype.name = 'ODD';
	cODD.prototype.argumentsMin = 1;
	cODD.prototype.argumentsMax = 1;
	cODD.prototype.Calculate = function (arg) {

		function oddHelper(arg) {
			var arg0 = arg.getValue();
			if (arg0 >= 0) {
				arg0 = Math.ceil(arg0);
				if ((arg0 & 1) == 1) {
					return new cNumber(arg0);
				} else {
					return new cNumber(arg0 + 1);
				}
			} else {
				arg0 = Math.floor(arg0);
				if ((arg0 & 1) == 1) {
					return new cNumber(arg0);
				} else {
					return new cNumber(arg0 - 1);
				}
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}

		if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					this.array[r][c] = oddHelper(elem);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg0 instanceof cNumber) {
			return oddHelper(arg0);
		}
		return new cError(cErrorType.wrong_value_type);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPI() {
	}

	cPI.prototype = Object.create(cBaseFunction.prototype);
	cPI.prototype.constructor = cPI;
	cPI.prototype.name = 'PI';
	cPI.prototype.argumentsMax = 0;
	cPI.prototype.Calculate = function () {
		return new cNumber(Math.PI);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPOWER() {
	}

	cPOWER.prototype = Object.create(cBaseFunction.prototype);
	cPOWER.prototype.constructor = cPOWER;
	cPOWER.prototype.name = 'POWER';
	cPOWER.prototype.argumentsMin = 2;
	cPOWER.prototype.argumentsMax = 2;
	cPOWER.prototype.Calculate = function (arg) {

		function powerHelper(a, b) {
			if (a == 0 && b < 0) {
				return new cError(cErrorType.division_by_zero);
			}
			if (a == 0 && b == 0) {
				return new cError(cErrorType.not_numeric);
			}

			return new cNumber(Math.pow(a, b));
		}

		function f(a, b, r, c) {
			if (a instanceof cNumber && b instanceof cNumber) {
				this.array[r][c] = powerHelper(a.getValue(), b.getValue());
			} else {
				this.array[r][c] = new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				f.call(this, elem, arg1, r, c)
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				f.call(this, arg0, elem, r, c);
			});
			return arg1;
		}

		if (!(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) )) {
			return new cError(cErrorType.wrong_value_type);
		}

		return powerHelper(arg0.getValue(), arg1.getValue());

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPRODUCT() {
	}

	cPRODUCT.prototype = Object.create(cBaseFunction.prototype);
	cPRODUCT.prototype.constructor = cPRODUCT;
	cPRODUCT.prototype.name = 'PRODUCT';
	cPRODUCT.prototype.argumentsMin = 1;
	cPRODUCT.prototype.Calculate = function (arg) {
		var element, arg0 = new cNumber(1);
		for (var i = 0; i < arg.length; i++) {
			element = arg[i];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
				for (var j = 0; j < _arrVal.length; j++) {
					arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "*");
					if (cElementType.error === arg0.type) {
						return arg0;
					}
				}
			} else if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var _arg = element.getValue();
					arg0 = _func[arg0.type][_arg.type](arg0, _arg, "*");
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.string === elem.type || cElementType.bool === elem.type ||
						cElementType.empty === elem.type) {
						return;
					}

					arg0 = _func[arg0.type][elem.type](arg0, elem, "*");
				})
			} else {
				arg0 = _func[arg0.type][element.type](arg0, element, "*");
			}
			if (cElementType.error === arg0.type) {
				return arg0;
			}

		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUOTIENT() {
	}

	cQUOTIENT.prototype = Object.create(cBaseFunction.prototype);
	cQUOTIENT.prototype.constructor = cQUOTIENT;
	cQUOTIENT.prototype.name = 'QUOTIENT';
	cQUOTIENT.prototype.argumentsMin = 2;
	cQUOTIENT.prototype.argumentsMax = 2;
	cQUOTIENT.prototype.Calculate = function (arg) {

		function quotient(a, b) {
			if (b.getValue() != 0) {
				return new cNumber(parseInt(a.getValue() / b.getValue()));
			} else {
				return new cError(cErrorType.division_by_zero);
			}
		}

		function f(a, b, r, c) {
			if (a instanceof cNumber && b instanceof cNumber) {
				this.array[r][c] = quotient(a, b);
			} else {
				this.array[r][c] = new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				f.call(this, elem, arg1, r, c)
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				f.call(this, arg0, elem, r, c);
			});
			return arg1;
		}

		if (!(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) )) {
			return new cError(cErrorType.wrong_value_type);
		}


		return quotient(arg0, arg1);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRADIANS() {
	}

	cRADIANS.prototype = Object.create(cBaseFunction.prototype);
	cRADIANS.prototype.constructor = cRADIANS;
	cRADIANS.prototype.name = 'RADIANS';
	cRADIANS.prototype.argumentsMin = 1;
	cRADIANS.prototype.argumentsMax = 1;
	cRADIANS.prototype.Calculate = function (arg) {

		function radiansHelper(ang) {
			return ang * Math.PI / 180
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();

		if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					this.array[r][c] = new cNumber(radiansHelper(elem.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			return ( arg0 instanceof cError ? arg0 : new cNumber(radiansHelper(arg0.getValue())) );
		}

		return arg0;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRAND() {
	}

	cRAND.prototype = Object.create(cBaseFunction.prototype);
	cRAND.prototype.constructor = cRAND;
	cRAND.prototype.name = 'RAND';
	cRAND.prototype.argumentsMax = 0;
	cRAND.prototype.ca = true;
	cRAND.prototype.Calculate = function () {
		return new cNumber(Math.random());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRANDBETWEEN() {
	}

	cRANDBETWEEN.prototype = Object.create(cBaseFunction.prototype);
	cRANDBETWEEN.prototype.constructor = cRANDBETWEEN;
	cRANDBETWEEN.prototype.name = 'RANDBETWEEN';
	cRANDBETWEEN.prototype.argumentsMin = 2;
	cRANDBETWEEN.prototype.argumentsMax = 2;
	cRANDBETWEEN.prototype.ca = true;
	cRANDBETWEEN.prototype.Calculate = function (arg) {

		function randBetween(a, b) {
			return new cNumber(Math.round(Math.random() * Math.abs(a - b)) + a);
		}

		function f(a, b, r, c) {
			if (a instanceof cNumber && b instanceof cNumber) {
				this.array[r][c] = randBetween(a.getValue(), b.getValue());
			} else {
				this.array[r][c] = new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				f.call(this, elem, arg1, r, c)
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				f.call(this, arg0, elem, r, c);
			});
			return arg1;
		}

		if (!(arg0 instanceof cNumber) || ( arg1 && !(arg0 instanceof cNumber) )) {
			return new cError(cErrorType.wrong_value_type);
		}


		return new cNumber(randBetween(arg0.getValue(), arg1.getValue()));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cROMAN() {
	}

	cROMAN.prototype = Object.create(cBaseFunction.prototype);
	cROMAN.prototype.constructor = cROMAN;
	cROMAN.prototype.name = 'ROMAN';
	cROMAN.prototype.argumentsMin = 2;
	cROMAN.prototype.argumentsMax = 2;
	cROMAN.prototype.Calculate = function (arg) {
		function roman(num, mode) {
			if ((mode >= 0) && (mode < 5) && (num >= 0) && (num < 4000)) {
				var chars = ['M', 'D', 'C', 'L', 'X', 'V', 'I'], values = [1000, 500, 100, 50, 10, 5, 1],
					maxIndex = values.length - 1, aRoman = "", index, digit, index2, steps;
				for (var i = 0; i <= maxIndex / 2; i++) {
					index = 2 * i;
					digit = parseInt(num / values[index]);

					if ((digit % 5) == 4) {
						index2 = (digit == 4) ? index - 1 : index - 2;
						steps = 0;
						while ((steps < mode) && (index < maxIndex)) {
							steps++;
							if (values[index2] - values[index + 1] <= num) {
								index++;
							} else {
								steps = mode;
							}
						}
						aRoman += chars[index];
						aRoman += chars[index2];
						num = ( num + values[index] );
						num = ( num - values[index2] );
					} else {
						if (digit > 4) {
							aRoman += chars[index - 1];
						}
						for (var j = digit % 5; j > 0; j--) {
							aRoman += chars[index];
						}
						num %= values[index];
					}
				}
				return new cString(aRoman);
			} else {
				return new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D || arg1 instanceof cArea || arg1 instanceof cArea3D) {
			return new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem;
					var b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = roman(a.getValue(), b.getValue());
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] = roman(a.getValue(), b.getValue());
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {
					this.array[r][c] = roman(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		return roman(arg0.getValue(), arg1.getValue());

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cROUND() {
	}

	cROUND.prototype = Object.create(cBaseFunction.prototype);
	cROUND.prototype.constructor = cROUND;
	cROUND.prototype.name = 'ROUND';
	cROUND.prototype.argumentsMin = 2;
	cROUND.prototype.argumentsMax = 2;
	cROUND.prototype.Calculate = function (arg) {

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
				Math.pow(10, Math.floor(Math.log10(Math.abs(quotient))) - cExcelSignificantDigits);
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

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
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
						this.array[r][c] = roundHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = roundHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = roundHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		var number = arg0.getValue(), num_digits = arg1.getValue();

		return roundHelper(number, num_digits);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cROUNDDOWN() {
	}

	cROUNDDOWN.prototype = Object.create(cBaseFunction.prototype);
	cROUNDDOWN.prototype.constructor = cROUNDDOWN;
	cROUNDDOWN.prototype.name = 'ROUNDDOWN';
	cROUNDDOWN.prototype.argumentsMin = 2;
	cROUNDDOWN.prototype.argumentsMax = 2;
	cROUNDDOWN.prototype.Calculate = function (arg) {
		function rounddownHelper(number, num_digits) {
			if (num_digits > AscCommonExcel.cExcelMaxExponent) {
				if (Math.abs(number) >= 1e-100 || num_digits <= 98303) { // The values are obtained experimentally
					return new cNumber(number);
				}
				return new cNumber(0);
			} else if (num_digits < AscCommonExcel.cExcelMinExponent) {
				if (Math.abs(number) >= 1e100) { // The values are obtained experimentally
					return new cNumber(number);
				}
				return new cNumber(0);
			}

			var significance = Math.pow(10, -( num_digits | num_digits ));

			if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
				return new cNumber(number);
			}
			var x = number * Math.pow(10, num_digits);
			x = x | x;
			return new cNumber(x * significance);
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
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
						this.array[r][c] = rounddownHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = rounddownHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = rounddownHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		var number = arg0.getValue(), num_digits = arg1.getValue();
		return rounddownHelper(number, num_digits);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cROUNDUP() {
	}

	cROUNDUP.prototype = Object.create(cBaseFunction.prototype);
	cROUNDUP.prototype.constructor = cROUNDUP;
	cROUNDUP.prototype.name = 'ROUNDUP';
	cROUNDUP.prototype.argumentsMin = 2;
	cROUNDUP.prototype.argumentsMax = 2;
	cROUNDUP.prototype.Calculate = function (arg) {
		function roundupHelper(number, num_digits) {
			if (num_digits > AscCommonExcel.cExcelMaxExponent) {
				if (Math.abs(number) >= 1e-100 || num_digits <= 98303) { // The values are obtained experimentally
					return new cNumber(number);
				}
				return new cNumber(0);
			} else if (num_digits < AscCommonExcel.cExcelMinExponent) {
				if (Math.abs(number) >= 1e100) { // The values are obtained experimentally
					return new cNumber(number);
				}
				return new cNumber(0);
			}

			var significance = Math.pow(10, -( num_digits | num_digits ));

			if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
				return new cNumber(number);
			}
			var x = number * Math.pow(10, num_digits);
			x = (x | x) + (x > 0 ? 1 : x < 0 ? -1 : 0) * 1;
			return new cNumber(x * significance);
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
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
						this.array[r][c] = roundupHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = roundupHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = roundupHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		var number = arg0.getValue(), num_digits = arg1.getValue();
		return roundupHelper(number, num_digits);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSEC() {
	}

	cSEC.prototype = Object.create(cBaseFunction.prototype);
	cSEC.prototype.constructor = cSEC;
	cSEC.prototype.name = 'SEC';
	cSEC.prototype.argumentsMin = 1;
	cSEC.prototype.argumentsMax = 1;
	cSEC.prototype.isXLFN = true;
	cSEC.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cSEC.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		var maxVal = Math.pow(2, 27);
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					if (Math.abs(elem.getValue()) >= maxVal) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					} else {
						var a = 1 / Math.cos(elem.getValue());
						this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
					}
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			if (Math.abs(arg0.getValue()) >= maxVal) {
				return new cError(cErrorType.not_numeric);
			}

			var a = 1 / Math.cos(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSECH() {
	}

	cSECH.prototype = Object.create(cBaseFunction.prototype);
	cSECH.prototype.constructor = cSECH;
	cSECH.prototype.name = 'SECH';
	cSECH.prototype.argumentsMin = 1;
	cSECH.prototype.argumentsMax = 1;
	cSECH.prototype.isXLFN = true;
	cSECH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cSECH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		//TODO в документации к COTH написано максимальное значение - Math.pow(2, 27), но MS EXCEL в данном случае не выдает ошибку
		//проверку на максиимальное значение убрал
		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.error === arg0.type) {
			return arg0;
		} else if (cElementType.array === arg0.type) {
			arg0.foreach(function (elem, r, c) {
				if (cElementType.number === elem.type) {
					var a = 1 / Math.cosh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg0;
		} else {
			var a = 1 / Math.cosh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSERIESSUM() {
	}

	cSERIESSUM.prototype = Object.create(cBaseFunction.prototype);
	cSERIESSUM.prototype.constructor = cSERIESSUM;
	cSERIESSUM.prototype.name = 'SERIESSUM';
	cSERIESSUM.prototype.argumentsMin = 4;
	cSERIESSUM.prototype.argumentsMax = 4;
	cSERIESSUM.prototype.Calculate = function (arg) {

		function SERIESSUM(x, n, m, a) {

			x = x.getValue();
			n = n.getValue();
			m = m.getValue();

			for (var i = 0; i < a.length; i++) {
				if (!( a[i] instanceof cNumber)) {
					return new cError(cErrorType.wrong_value_type);
				}
				a[i] = a[i].getValue();
			}

			function sumSeries(x, n, m, a) {
				var sum = 0;
				for (var i = 0; i < a.length; i++) {
					sum += a[i] * Math.pow(x, n + i * m)
				}
				return sum;
			}

			return new cNumber(sumSeries(x, n, m, a));
		}

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];
		if (arg0 instanceof cNumber || arg0 instanceof cRef || arg0 instanceof cRef3D) {
			arg0 = arg0.tocNumber();
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cNumber || arg1 instanceof cRef || arg1 instanceof cRef3D) {
			arg1 = arg1.tocNumber();
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg2 instanceof cNumber || arg2 instanceof cRef || arg2 instanceof cRef3D) {
			arg2 = arg2.tocNumber();
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg3 instanceof cNumber || arg3 instanceof cRef || arg3 instanceof cRef3D) {
			arg3 = [arg3.tocNumber()];
		} else if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.getValue();
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return SERIESSUM(arg0, arg1, arg2, arg3);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSIGN() {
	}

	cSIGN.prototype = Object.create(cBaseFunction.prototype);
	cSIGN.prototype.constructor = cSIGN;
	cSIGN.prototype.name = 'SIGN';
	cSIGN.prototype.argumentsMin = 1;
	cSIGN.prototype.argumentsMax = 1;
	cSIGN.prototype.Calculate = function (arg) {

		function signHelper(arg) {
			if (arg < 0) {
				return new cNumber(-1.0);
			} else if (arg == 0) {
				return new cNumber(0.0);
			} else {
				return new cNumber(1.0);
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = elem.getValue();
					this.array[r][c] = signHelper(a)
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = arg0.getValue();
			return signHelper(a);
		}
		return arg0;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSIN() {
	}

	cSIN.prototype = Object.create(cBaseFunction.prototype);
	cSIN.prototype.constructor = cSIN;
	cSIN.prototype.name = 'SIN';
	cSIN.prototype.argumentsMin = 1;
	cSIN.prototype.argumentsMax = 1;
	cSIN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.sin(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.sin(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSINH() {
	}

	cSINH.prototype = Object.create(cBaseFunction.prototype);
	cSINH.prototype.constructor = cSINH;
	cSINH.prototype.name = 'SINH';
	cSINH.prototype.argumentsMin = 1;
	cSINH.prototype.argumentsMax = 1;
	cSINH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.sinh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.sinh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSQRT() {
	}

	cSQRT.prototype = Object.create(cBaseFunction.prototype);
	cSQRT.prototype.constructor = cSQRT;
	cSQRT.prototype.name = 'SQRT';
	cSQRT.prototype.argumentsMin = 1;
	cSQRT.prototype.argumentsMax = 1;
	cSQRT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.sqrt(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.sqrt(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSQRTPI() {
	}

	cSQRTPI.prototype = Object.create(cBaseFunction.prototype);
	cSQRTPI.prototype.constructor = cSQRTPI;
	cSQRTPI.prototype.name = 'SQRTPI';
	cSQRTPI.prototype.argumentsMin = 1;
	cSQRTPI.prototype.argumentsMax = 1;
	cSQRTPI.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.sqrt(elem.getValue() * Math.PI);
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.sqrt(arg0.getValue() * Math.PI);
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUBTOTAL() {
	}

	cSUBTOTAL.prototype = Object.create(cBaseFunction.prototype);
	cSUBTOTAL.prototype.constructor = cSUBTOTAL;
	cSUBTOTAL.prototype.name = 'SUBTOTAL';
	cSUBTOTAL.prototype.argumentsMin = 1;
	cSUBTOTAL.prototype.Calculate = function (arg) {
		var f, exclude = false, arg0 = arg[0];

		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (cElementType.number !== arg0.type) {
			return arg0;
		}

		arg0 = arg0.getValue();

		switch (arg0) {
			case cSubTotalFunctionType.excludes.AVERAGE:
				exclude = true;
			case cSubTotalFunctionType.includes.AVERAGE:
				f = AscCommonExcel.cAVERAGE.prototype;
				break;
			case cSubTotalFunctionType.excludes.COUNT:
				exclude = true;
			case cSubTotalFunctionType.includes.COUNT:
				f = AscCommonExcel.cCOUNT.prototype;
				break;
			case cSubTotalFunctionType.excludes.COUNTA:
				exclude = true;
			case cSubTotalFunctionType.includes.COUNTA:
				f = AscCommonExcel.cCOUNTA.prototype;
				break;
			case cSubTotalFunctionType.excludes.MAX:
				exclude = true;
			case cSubTotalFunctionType.includes.MAX:
				f = AscCommonExcel.cMAX.prototype;
				break;
			case cSubTotalFunctionType.excludes.MIN:
				exclude = true;
			case cSubTotalFunctionType.includes.MIN:
				f = AscCommonExcel.cMIN.prototype;
				break;
			case cSubTotalFunctionType.excludes.PRODUCT:
				exclude = true;
			case cSubTotalFunctionType.includes.PRODUCT:
				f = cPRODUCT.prototype;
				break;
			case cSubTotalFunctionType.excludes.STDEV:
				exclude = true;
			case cSubTotalFunctionType.includes.STDEV:
				f = AscCommonExcel.cSTDEV.prototype;
				break;
			case cSubTotalFunctionType.excludes.STDEVP:
				exclude = true;
			case cSubTotalFunctionType.includes.STDEVP:
				f = AscCommonExcel.cSTDEVP.prototype;
				break;
			case cSubTotalFunctionType.excludes.SUM:
				exclude = true;
			case cSubTotalFunctionType.includes.SUM:
				f = cSUM.prototype;
				break;
			case cSubTotalFunctionType.excludes.VAR:
				exclude = true;
			case cSubTotalFunctionType.includes.VAR:
				f = AscCommonExcel.cVAR.prototype;
				break;
			case cSubTotalFunctionType.excludes.VARP:
				exclude = true;
			case cSubTotalFunctionType.includes.VARP:
				f = AscCommonExcel.cVARP.prototype;
				break;
		}
		var res;
		if (f) {
			//вложенные итоги игнорируются, чтобы избежать двойного суммирования
			f.excludeNestedStAg = true;

			f.checkExclude = true;
			f.excludeHiddenRows = exclude;
			res = f.Calculate(arg.slice(1));
		}

		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUM() {
	}

	cSUM.prototype = Object.create(cBaseFunction.prototype);
	cSUM.prototype.constructor = cSUM;
	cSUM.prototype.name = 'SUM';
	cSUM.prototype.argumentsMin = 1;
	cSUM.prototype.Calculate = function (arg) {
		var element, _arg, arg0 = new cNumber(0);
		for (var i = 0; i < arg.length; i++) {
			element = arg[i];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
				for (var j = 0; j < _arrVal.length; j++) {
					if (cElementType.bool !== _arrVal[j].type && cElementType.string !== _arrVal[j].type) {
						arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
					}
					if (cElementType.error === arg0.type) {
						return arg0;
					}
				}
			} else if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					_arg = element.getValue();
					if (cElementType.bool !== _arg.type && cElementType.string !== _arg.type) {
						arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (arrElem) {
					if (cElementType.bool !== arrElem.type && cElementType.string !== arrElem.type &&
						cElementType.empty !== arrElem.type) {
						arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
					}
				});
			} else {
				_arg = element.tocNumber();
				arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
			}
			if (cElementType.error === arg0.type) {
				return arg0;
			}

		}

		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMIF() {
	}

	cSUMIF.prototype = Object.create(cBaseFunction.prototype);
	cSUMIF.prototype.constructor = cSUMIF;
	cSUMIF.prototype.name = 'SUMIF';
	cSUMIF.prototype.argumentsMin = 2;
	cSUMIF.prototype.argumentsMax = 3;
	cSUMIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _sum = 0, matchingInfo;
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type) {
			if (cElementType.cellsRange3D === arg0.type) {
				arg0 = arg0.tocArea();
				if (!arg0) {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				return new cError(cErrorType.wrong_value_type);
			}
		}

		if (cElementType.cell !== arg2.type && cElementType.cell3D !== arg2.type &&
			cElementType.cellsRange !== arg2.type) {
			if (cElementType.cellsRange3D === arg2.type) {
				arg2 = arg2.tocArea();
				if (!arg2) {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				return new cError(cErrorType.wrong_value_type);
			}
		}

		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg1 = arg1.tocString();

		if (cElementType.string !== arg1.type) {
			return new cError(cErrorType.wrong_value_type);
		}

		matchingInfo = AscCommonExcel.matchingValue(arg1);
		if (cElementType.cellsRange === arg0.type || cElementType.cell === arg0.type) {
			var arg0Matrix = arg0.getMatrix(), arg2Matrix = arg2.getMatrix(), valMatrix2;
			for (var i = 0; i < arg0Matrix.length; i++) {
				for (var j = 0; j < arg0Matrix[i].length; j++) {
					if (arg2Matrix[i] && (valMatrix2 = arg2Matrix[i][j]) && cElementType.number === valMatrix2.type &&
						AscCommonExcel.matching(arg0Matrix[i][j], matchingInfo)) {
						_sum += valMatrix2.getValue();
					}
				}
			}
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cNumber(_sum);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMIFS() {
	}

	cSUMIFS.prototype = Object.create(cBaseFunction.prototype);
	cSUMIFS.prototype.constructor = cSUMIFS;
	cSUMIFS.prototype.name = 'SUMIFS';
	cSUMIFS.prototype.argumentsMin = 3;
	cSUMIFS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type) {
			if (cElementType.cellsRange3D === arg0.type) {
				arg0 = arg0.tocArea();
				if (!arg0) {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				return new cError(cErrorType.wrong_value_type);
			}
		}

		var arg0Matrix = arg0.getMatrix();
		var i, j, arg1, arg2, matchingInfo;
		for (var k = 1; k < arg.length; k += 2) {
			arg1 = arg[k];
			arg2 = arg[k + 1];

			if (cElementType.cell !== arg1.type && cElementType.cell3D !== arg1.type &&
				cElementType.cellsRange !== arg1.type) {
				if (cElementType.cellsRange3D === arg1.type) {
					arg1 = arg1.tocArea();
					if (!arg1) {
						return new cError(cErrorType.wrong_value_type);
					}
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}

			if (cElementType.cellsRange === arg2.type || cElementType.cellsRange3D === arg2.type) {
				arg2 = arg2.cross(arguments[1]);
			} else if (cElementType.array === arg2.type) {
				arg2 = arg2.getElementRowCol(0, 0);
			}

			arg2 = arg2.tocString();

			if (cElementType.string !== arg2.type) {
				return new cError(cErrorType.wrong_value_type);
			}

			matchingInfo = AscCommonExcel.matchingValue(arg2);

			var arg1Matrix = arg1.getMatrix();
			if (arg0Matrix.length !== arg1Matrix.length) {
				return new cError(cErrorType.wrong_value_type);
			}
			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return new cError(cErrorType.wrong_value_type);
				}
				for (j = 0; j < arg1Matrix[i].length; ++j) {
					if (arg0Matrix[i][j] && !AscCommonExcel.matching(arg1Matrix[i][j], matchingInfo)) {
						arg0Matrix[i][j] = null;
					}
				}
			}
		}

		var _sum = 0;
		var valMatrix0;
		for (i = 0; i < arg0Matrix.length; ++i) {
			for (j = 0; j < arg0Matrix[i].length; ++j) {
				if ((valMatrix0 = arg0Matrix[i][j]) && cElementType.number === valMatrix0.type) {
					_sum += valMatrix0.getValue();
				}
			}
		}
		return new cNumber(_sum);
	};
	cSUMIFS.prototype.checkArguments = function (countArguments) {
		return 1 === countArguments % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMPRODUCT() {
	}

	cSUMPRODUCT.prototype = Object.create(cBaseFunction.prototype);
	cSUMPRODUCT.prototype.constructor = cSUMPRODUCT;
	cSUMPRODUCT.prototype.name = 'SUMPRODUCT';
	cSUMPRODUCT.prototype.argumentsMin = 1;
	cSUMPRODUCT.prototype.Calculate = function (arg) {
		var arg0 = new cNumber(0), resArr = [], col = 0, row = 0, res = 1, _res = [], i;

		for (i = 0; i < arg.length; i++) {

			if (arg[i] instanceof cArea3D) {
				return new cError(cErrorType.bad_reference);
			}

			if (arg[i] instanceof cArea || arg[i] instanceof cArray) {
				resArr[i] = arg[i].getMatrix();
			} else if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
				resArr[i] = [[arg[i].getValue()]];
			} else {
				resArr[i] = [[arg[i]]];
			}

			row = Math.max(resArr[0].length, row);
			col = Math.max(resArr[0][0].length, col);

			if (row != resArr[i].length || col != resArr[i][0].length) {
				return new cError(cErrorType.not_numeric);
			}

			if (arg[i] instanceof cError) {
				return arg[i];
			}
		}

		for (var iRow = 0; iRow < row; iRow++) {
			for (var iCol = 0; iCol < col; iCol++) {
				res = 1;
				for (var iRes = 0; iRes < resArr.length; iRes++) {
					arg0 = resArr[iRes][iRow][iCol];
					if (arg0 instanceof cError) {
						return arg0;
					} else if (arg0 instanceof cString) {
						if (arg0.tocNumber() instanceof cError) {
							res *= 0;
						} else {
							res *= arg0.tocNumber().getValue();
						}
					} else {
						res *= arg0.tocNumber().getValue();
					}
				}
				_res.push(res);
			}
		}
		res = 0;
		for (i = 0; i < _res.length; i++) {
			res += _res[i]
		}

		return new cNumber(res);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMSQ() {
	}

	cSUMSQ.prototype = Object.create(cBaseFunction.prototype);
	cSUMSQ.prototype.constructor = cSUMSQ;
	cSUMSQ.prototype.name = 'SUMSQ';
	cSUMSQ.prototype.argumentsMin = 1;
	cSUMSQ.prototype.Calculate = function (arg) {
		var arg0 = new cNumber(0), _arg;

		function sumsqHelper(a, b) {
			var c = _func[b.type][b.type](b, b, "*");
			return _func[a.type][c.type](a, c, "+");
		}

		for (var i = 0; i < arg.length; i++) {
			if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
				var _arrVal = arg[i].getValue();
				for (var j = 0; j < _arrVal.length; j++) {
					if (_arrVal[j] instanceof cNumber) {
						arg0 = sumsqHelper(arg0, _arrVal[j]);
					} else if (_arrVal[j] instanceof cError) {
						return _arrVal[j];
					}
				}
			} else if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
				_arg = arg[i].getValue();
				if (_arg instanceof cNumber) {
					arg0 = sumsqHelper(arg0, _arg);
				}
			} else if (arg[i] instanceof cArray) {
				arg[i].foreach(function (arrElem) {
					if (arrElem instanceof cNumber) {
						arg0 = sumsqHelper(arg0, arrElem);
					}
				})
			} else {
				_arg = arg[i].tocNumber();
				arg0 = sumsqHelper(arg0, _arg);
			}
			if (arg0 instanceof cError) {
				return arg0;
			}

		}

		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMX2MY2() {
	}

	cSUMX2MY2.prototype = Object.create(cBaseFunction.prototype);
	cSUMX2MY2.prototype.constructor = cSUMX2MY2;
	cSUMX2MY2.prototype.name = 'SUMX2MY2';
	cSUMX2MY2.prototype.argumentsMin = 2;
	cSUMX2MY2.prototype.argumentsMax = 2;
	cSUMX2MY2.prototype.Calculate = function (arg) {

		function sumX2MY2(a, b, _3d) {
			var sum = 0, i, j;

			function a2Mb2(a, b) {
				return a * a - b * b;
			}

			if (!_3d) {
				if (a.length == b.length && a[0].length == b[0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
								sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue())
							} else {
								return new cError(cErrorType.wrong_value_type);
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							for (var k = 0; k < a[0][0].length; k++) {
								if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
									sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue())
								} else {
									return new cError(cErrorType.wrong_value_type);
								}
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}
		}

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
			return sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
		}

		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cError) {
			return arg1;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return sumX2MY2(arg0, arg1, false);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMX2PY2() {
	}

	cSUMX2PY2.prototype = Object.create(cBaseFunction.prototype);
	cSUMX2PY2.prototype.constructor = cSUMX2PY2;
	cSUMX2PY2.prototype.name = 'SUMX2PY2';
	cSUMX2PY2.prototype.argumentsMin = 2;
	cSUMX2PY2.prototype.argumentsMax = 2;
	cSUMX2PY2.prototype.Calculate = function (arg) {

		function sumX2MY2(a, b, _3d) {
			var sum = 0, i, j;

			function a2Mb2(a, b) {
				return a * a + b * b;
			}

			if (!_3d) {
				if (a.length == b.length && a[0].length == b[0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
								sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue())
							} else {
								return new cError(cErrorType.wrong_value_type);
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							for (var k = 0; k < a[0][0].length; k++) {
								if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
									sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue())
								} else {
									return new cError(cErrorType.wrong_value_type);
								}
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}
		}

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
			return sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
		}

		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cError) {
			return arg1;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return sumX2MY2(arg0, arg1, false);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSUMXMY2() {
	}

	cSUMXMY2.prototype = Object.create(cBaseFunction.prototype);
	cSUMXMY2.prototype.constructor = cSUMXMY2;
	cSUMXMY2.prototype.name = 'SUMXMY2';
	cSUMXMY2.prototype.argumentsMin = 2;
	cSUMXMY2.prototype.argumentsMax = 2;
	cSUMXMY2.prototype.Calculate = function (arg) {

		function sumX2MY2(a, b, _3d) {
			var sum = 0, i, j;

			function a2Mb2(a, b) {
				return ( a - b ) * ( a - b );
			}

			if (!_3d) {
				if (a.length == b.length && a[0].length == b[0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
								sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue())
							} else {
								return new cError(cErrorType.wrong_value_type);
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			} else {
				if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < a[0].length; j++) {
							for (var k = 0; k < a[0][0].length; k++) {
								if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
									sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue())
								} else {
									return new cError(cErrorType.wrong_value_type);
								}
							}
						}
					}
					return new cNumber(sum);
				} else {
					return new cError(cErrorType.wrong_value_type);
				}
			}
		}

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
			return sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
		}

		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cError) {
			return arg1;
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return sumX2MY2(arg0, arg1, false);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTAN() {
	}

	cTAN.prototype = Object.create(cBaseFunction.prototype);
	cTAN.prototype.constructor = cTAN;
	cTAN.prototype.name = 'TAN';
	cTAN.prototype.argumentsMin = 1;
	cTAN.prototype.argumentsMax = 1;
	cTAN.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.tan(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.tan(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTANH() {
	}

	cTANH.prototype = Object.create(cBaseFunction.prototype);
	cTANH.prototype.constructor = cTANH;
	cTANH.prototype.name = 'TANH';
	cTANH.prototype.argumentsMin = 1;
	cTANH.prototype.argumentsMax = 1;
	cTANH.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = Math.tanh(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = Math.tanh(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTRUNC() {
	}

	cTRUNC.prototype = Object.create(cBaseFunction.prototype);
	cTRUNC.prototype.constructor = cTRUNC;
	cTRUNC.prototype.name = 'TRUNC';
	cTRUNC.prototype.argumentsMin = 1;
	cTRUNC.prototype.argumentsMax = 2;
	cTRUNC.prototype.Calculate = function (arg) {

		function truncHelper(a, b) {
			var c = a < 0 ? 1 : 0;
			if (b == 0) {
				return new cNumber(a.toString().substr(0, 1 + c));
			} else if (b > 0) {
				return new cNumber(a.toString().substr(0, b + 2 + c));
			} else {
				return new cNumber(0);
			}
		}

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(0);
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg0;
		}
		if (arg1 instanceof cError) {
			return arg1;
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
						this.array[r][c] = truncHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = truncHelper(a.getValue(), b.getValue())
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
					this.array[r][c] = truncHelper(a.getValue(), b.getValue())
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return arg1;
		}

		return truncHelper(arg0.getValue(), arg1.getValue());
	};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].cAGGREGATE = cAGGREGATE;
	window['AscCommonExcel'].cPRODUCT = cPRODUCT;
	window['AscCommonExcel'].cSUBTOTAL = cSUBTOTAL;
	window['AscCommonExcel'].cSUM = cSUM;
})(window);
