/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
	var g_oFormatParser = AscCommon.g_oFormatParser;

	var cErrorType = AscCommonExcel.cErrorType;
	var c_sPerDay = AscCommonExcel.c_sPerDay;
	var c_msPerDay = AscCommonExcel.c_msPerDay;
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

	var GetDiffDate360 = AscCommonExcel.GetDiffDate360;

	var cExcelDateTimeDigits = 8; //количество цифр после запятой в числах отвечающих за время специализация $18.17.4.2

	var DayCountBasis = {
		// US 30/360
		UsPsa30_360: 0, // Actual/Actual
		ActualActual: 1, // Actual/360
		Actual360: 2, // Actual/365
		Actual365: 3, // European 30/360
		Europ30_360: 4
	};

	function yearFrac(d1, d2, mode) {

		d1.truncate();
		d2.truncate();

		var date1 = d1.getUTCDate(), month1 = d1.getUTCMonth() +
			1, year1 = d1.getUTCFullYear(), date2 = d2.getUTCDate(), month2 = d2.getUTCMonth() +
			1, year2 = d2.getUTCFullYear();

		switch (mode) {
			case DayCountBasis.UsPsa30_360:
				return new cNumber(Math.abs(GetDiffDate360(date1, month1, year1, date2, month2, year2, true)) / 360);
			case DayCountBasis.ActualActual:
				var yc = Math.abs(year2 - year1), sd = year1 > year2 ? new Date(d2) :
					new Date(d1), yearAverage = sd.isLeapYear() ? 366 : 365, dayDiff = /*Math.abs*/( d2 - d1 );
				for (var i = 0; i < yc; i++) {
					sd.addYears(1);
					yearAverage += sd.isLeapYear() ? 366 : 365;
				}
				yearAverage /= (yc + 1);
				dayDiff /= (yearAverage * c_msPerDay);
				return new cNumber(Math.abs(dayDiff));
			case DayCountBasis.Actual360:
				var dayDiff = Math.abs(d2 - d1);
				dayDiff /= (360 * c_msPerDay);
				return new cNumber(dayDiff);
			case DayCountBasis.Actual365:
				var dayDiff = Math.abs(d2 - d1);
				dayDiff /= (365 * c_msPerDay);
				return new cNumber(dayDiff);
			case DayCountBasis.Europ30_360:
				return new cNumber(Math.abs(GetDiffDate360(date1, month1, year1, date2, month2, year2, false)) / 360);
			default:
				return new cError(cErrorType.not_numeric);
		}
	}

	function diffDate(d1, d2, mode) {
		var date1 = d1.getUTCDate(), month1 = d1.getUTCMonth() +
			1, year1 = d1.getUTCFullYear(), date2 = d2.getUTCDate(), month2 = d2.getUTCMonth() +
			1, year2 = d2.getUTCFullYear();

		switch (mode) {
			case DayCountBasis.UsPsa30_360:
				return new cNumber(GetDiffDate360(date1, month1, year1, date2, month2, year2, true));
			case DayCountBasis.ActualActual:
				return new cNumber((d2 - d1) / c_msPerDay);
			case DayCountBasis.Actual360:
				var dayDiff = d2 - d1;
				dayDiff /= c_msPerDay;
				return new cNumber((d2 - d1) / c_msPerDay);
			case DayCountBasis.Actual365:
				var dayDiff = d2 - d1;
				dayDiff /= c_msPerDay;
				return new cNumber((d2 - d1) / c_msPerDay);
			case DayCountBasis.Europ30_360:
				return new cNumber(GetDiffDate360(date1, month1, year1, date2, month2, year2, false));
			default:
				return new cError(cErrorType.not_numeric);
		}
	}

	function diffDate2(d1, d2, mode) {
		var date1 = d1.getUTCDate(), month1 = d1.getUTCMonth(), year1 = d1.getUTCFullYear(), date2 = d2.getUTCDate(), month2 = d2.getUTCMonth(), year2 = d2.getUTCFullYear();

		var nDaysInYear, nYears, nDayDiff;

		switch (mode) {
			case DayCountBasis.UsPsa30_360:
				nDaysInYear = 360;
				nYears = year1 - year2;
				nDayDiff = Math.abs(GetDiffDate360(date1, month1 + 1, year1, date2, month2 + 1, year2, true)) -
					nYears * nDaysInYear;
				return new cNumber(nYears + nDayDiff / nDaysInYear);
			case DayCountBasis.ActualActual:
				nYears = year2 - year1;
				nDaysInYear = d1.isLeapYear() ? 366 : 365;

				var dayDiff;

				if (nYears && ( month1 > month2 || ( month1 == month2 && date1 > date2 ) )) {
					nYears--;
				}

				if (nYears) {
					dayDiff = parseInt((d2 - new Date(Date.UTC(year2, month1, date1))) / c_msPerDay);
				} else {
					dayDiff = parseInt(( d2 - d1 ) / c_msPerDay);
				}

				if (dayDiff < 0) {
					dayDiff += nDaysInYear;
				}
				return new cNumber(nYears + dayDiff / nDaysInYear);
			case DayCountBasis.Actual360:
				nDaysInYear = 360;
				nYears = parseInt(( d2 - d1 ) / c_msPerDay / nDaysInYear);
				nDayDiff = (d2 - d1) / c_msPerDay;
				nDayDiff %= nDaysInYear;
				return new cNumber(nYears + nDayDiff / nDaysInYear);
			case DayCountBasis.Actual365:
				nDaysInYear = 365;
				nYears = parseInt(( d2 - d1 ) / c_msPerDay / nDaysInYear);
				nDayDiff = (d2 - d1) / c_msPerDay;
				nDayDiff %= nDaysInYear;
				return new cNumber(nYears + nDayDiff / nDaysInYear);
			case DayCountBasis.Europ30_360:
				nDaysInYear = 360;
				nYears = year1 - year2;
				nDayDiff = Math.abs(GetDiffDate360(date1, month1 + 1, year1, date2, month2 + 1, year2, false)) -
					nYears * nDaysInYear;
				return new cNumber(nYears + nDayDiff / nDaysInYear);
			default:
				return new cError(cErrorType.not_numeric);
		}
	}

	function GetDiffDate(d1, d2, nMode, av) {
		var bNeg = d1 > d2, nRet, pOptDaysIn1stYear;

		if (bNeg) {
			var n = d2;
			d2 = d1;
			d1 = n;
		}

		var nD1 = d1.getUTCDate(), nM1 = d1.getUTCMonth(), nY1 = d1.getUTCFullYear(), nD2 = d2.getUTCDate(), nM2 = d2.getUTCMonth(), nY2 = d2.getUTCFullYear();

		switch (nMode) {
			case DayCountBasis.UsPsa30_360:            // 0=USA (NASD) 30/360
			case DayCountBasis.Europ30_360: {            // 4=Europe 30/360
				var bLeap = d1.isLeapYear(), nDays, nMonths/*, nYears*/;

				nMonths = nM2 - nM1;
				nDays = nD2 - nD1;
				nMonths += ( nY2 - nY1 ) * 12;
				nRet = nMonths * 30 + nDays;
				if (nMode == 0 && nM1 == 2 && nM2 != 2 && nY1 == nY2) {
					nRet -= bLeap ? 1 : 2;
				}

				pOptDaysIn1stYear = 360;
				break;
			}
			case DayCountBasis.ActualActual:            // 1=exact/exact
				pOptDaysIn1stYear = d1.isLeapYear() ? 366 : 365;
				nRet = d2 - d1;
				break;
			case DayCountBasis.Actual360:            // 2=exact/360
				nRet = d2 - d1;
				pOptDaysIn1stYear = 360;
				break;
			case DayCountBasis.Actual365:            //3=exact/365
				nRet = d2 - d1;
				pOptDaysIn1stYear = 365;
				break;
		}

		return (bNeg ? -nRet : nRet) / c_msPerDay / (av ? 1 : pOptDaysIn1stYear);
	}

	function days360(date1, date2, flag) {
		var sign;

		var nY1 = date1.getUTCFullYear(), nM1 = date1.getUTCMonth() +
			1, nD1 = date1.getUTCDate(), nY2 = date2.getUTCFullYear(), nM2 = date2.getUTCMonth() +
			1, nD2 = date2.getUTCDate();

		if (flag && (date2 < date1)) {
			sign = date1;
			date1 = date2;
			date2 = sign;
			sign = -1;
		} else {
			sign = 1;
		}
		if (nD1 == 31) {
			nD1 -= 1;
		} else if (!flag) {
			if (nM1 == 2) {
				switch (nD1) {
					case 28 :
						if (!date1.isLeapYear()) {
							nD1 = 30;
						}
						break;
					case 29 :
						nD1 = 30;
						break;
				}
			}
		}
		if (nD2 == 31) {
			if (!flag) {
				if (nD1 == 30) {
					nD2--;
				}
			} else {
				nD2 = 30;
			}
		}
		return sign * ( nD2 - nD1 + ( nM2 - nM1 ) * 30 + ( nY2 - nY1 ) * 360 );
	}

	function daysInYear(date, basis) {
		switch (basis) {
			case DayCountBasis.UsPsa30_360:         // 0=USA (NASD) 30/360
			case DayCountBasis.Actual360:         // 2=exact/360
			case DayCountBasis.Europ30_360:         // 4=Europe 30/360
				return new cNumber(360);
			case DayCountBasis.ActualActual: {         // 1=exact/exact
				var d = Date.prototype.getDateFromExcel(date);
				return new cNumber(d.isLeapYear() ? 366 : 365);
			}
			case DayCountBasis.Actual365:         //3=exact/365
				return new cNumber(365);
			default:
				return new cError(cErrorType.not_numeric);
		}
	}

	cFormulaFunctionGroup['DateAndTime'] = cFormulaFunctionGroup['DateAndTime'] || [];
	cFormulaFunctionGroup['DateAndTime'].push(cDATE, cDATEDIF, cDATEVALUE, cDAY, cDAYS360, cEDATE, cEOMONTH, cHOUR,
		cMINUTE, cMONTH, cNETWORKDAYS, cNETWORKDAYS_INTL, cNOW, cSECOND, cTIME, cTIMEVALUE, cTODAY, cWEEKDAY, cWEEKNUM,
		cWORKDAY, cWORKDAY_INTL, cYEAR, cYEARFRAC);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDATE() {
		this.name = "DATE";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cDATE.prototype = Object.create(cBaseFunction.prototype);
	cDATE.prototype.constructor = cDATE;
	cDATE.prototype.argumentsMin = 3;
	cDATE.prototype.argumentsMax = 3;
	cDATE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], year, month, day;

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}
		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1].bbox);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}

		year = arg0.getValue();
		month = arg1.getValue();
		day = arg2.getValue();

		if (year >= 0 && year <= 1899) {
			year += 1900;
		}
		if (month == 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		if (year == 1900 && month == 2 && day == 29) {
			this.value = new cNumber(60);
		} else {
			this.value = new cNumber(Math.round(new Date(Date.UTC(year, month - 1, day)).getExcelDate()));
		}
		this.value.numFormat = 14;
		return this.value;
	};
	cDATE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( year, month, day )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDATEDIF() {
		this.name = "DATEDIF";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cDATEDIF.prototype = Object.create(cBaseFunction.prototype);
	cDATEDIF.prototype.constructor = cDATEDIF;
	cDATEDIF.prototype.argumentsMin = 3;
	cDATEDIF.prototype.argumentsMax = 3;
	cDATEDIF.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDATEDIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1].bbox);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}

		var val0 = arg0.getValue(), val1 = arg1.getValue();

		if (val0 < 0 || val1 < 0 || val0 >= val1) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		val0 = Date.prototype.getDateFromExcel(val0);
		val1 = Date.prototype.getDateFromExcel(val1);

		function dateDiff(date1, date2) {
			var years = date2.getUTCFullYear() - date1.getUTCFullYear();
			var months = years * 12 + date2.getUTCMonth() - date1.getUTCMonth();
			var days = date2.getUTCDate() - date1.getUTCDate();

			years -= date2.getUTCMonth() < date1.getUTCMonth();
			months -= date2.getUTCDate() < date1.getUTCDate();
			days +=
				days < 0 ? new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth() - 1, 0)).getUTCDate() + 1 : 0;

			return [years, months, days];
		}

		switch (arg2.getValue().toUpperCase()) {
			case "Y":
				return this.value = new cNumber(dateDiff(val0, val1)[0]);
				break;
			case "M":
				return this.value = new cNumber(dateDiff(val0, val1)[1]);
				break;
			case "D":
				return this.value = new cNumber(parseInt((val1 - val0) / c_msPerDay));
				break;
			case "MD":
				if (val0.getUTCDate() > val1.getUTCDate()) {
					this.value = new cNumber(Math.abs(
							new Date(Date.UTC(val0.getUTCFullYear(), val0.getUTCMonth(), val0.getUTCDate())) -
							new Date(Date.UTC(val0.getUTCFullYear(), val0.getUTCMonth() + 1, val1.getUTCDate()))) /
						c_msPerDay);
				} else {
					this.value = new cNumber(val1.getUTCDate() - val0.getUTCDate());
				}
				return this.value;
				break;
			case "YM":
				var d = dateDiff(val0, val1);
				return this.value = new cNumber(d[1] - d[0] * 12);
				break;
			case "YD":
				if (val0.getUTCMonth() > val1.getUTCMonth()) {
					this.value = new cNumber(Math.abs(
							new Date(Date.UTC(val0.getUTCFullYear(), val0.getUTCMonth(), val0.getUTCDate())) -
							new Date(Date.UTC(val0.getUTCFullYear() + 1, val1.getUTCMonth(), val1.getUTCDate()))) /
						c_msPerDay);
				} else {
					this.value = new cNumber(Math.abs(
							new Date(Date.UTC(val0.getUTCFullYear(), val0.getUTCMonth(), val0.getUTCDate())) -
							new Date(Date.UTC(val0.getUTCFullYear(), val1.getUTCMonth(), val1.getUTCDate()))) /
						c_msPerDay);
				}
				return this.value;
				break;
			default:
				return this.value = new cError(cErrorType.not_numeric)
		}

	};
	cDATEDIF.prototype.getInfo = function () {
		return {
			name: this.name, args: "( start-date , end-date , unit )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDATEVALUE() {
		this.name = "DATEVALUE";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cDATEVALUE.prototype = Object.create(cBaseFunction.prototype);
	cDATEVALUE.prototype.constructor = cDATEVALUE;
	cDATEVALUE.prototype.argumentsMin = 1;
	cDATEVALUE.prototype.argumentsMax = 1;
	cDATEVALUE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDATEVALUE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var res = g_oFormatParser.parse(arg0.getValue());
		if (res && res.bDateTime) {
			return this.value = new cNumber(parseInt(res.value));
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
	};
	cDATEVALUE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( date-time-string )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDAY() {
		this.name = "DAY";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cDAY.prototype = Object.create(cBaseFunction.prototype);
	cDAY.prototype.constructor = cDAY;
	cDAY.prototype.argumentsMin = 1;
	cDAY.prototype.argumentsMax = 1;
	cDAY.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDAY.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
			val = arg0.tocNumber().getValue();
		}
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue().tocNumber();
			if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					return this.value = new cError(cErrorType.wrong_value_type);
				} else {
					val = Math.floor(( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) ));
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val < 60) {
				return this.setCalcValue(
					new cNumber(( new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay) ).getUTCDate()), 0);
			} else if (val == 60) {
				return this.setCalcValue(
					new cNumber(( new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay) ).getUTCDate() +
						1), 0);
			} else {
				return this.setCalcValue(
					new cNumber(( new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay) ).getUTCDate()),
					0);
			}
		} else {
			return this.setCalcValue(
				new cNumber(( new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay) ).getUTCDate()), 0);
		}
	};
	cDAY.prototype.getInfo = function () {
		return {
			name: this.name, args: "( date-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDAYS360() {
		this.name = "DAYS360";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cDAYS360.prototype = Object.create(cBaseFunction.prototype);
	cDAYS360.prototype.constructor = cDAYS360;
	cDAYS360.prototype.argumentsMin = 2;
	cDAYS360.prototype.argumentsMax = 3;
	cDAYS360.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cDAYS360.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cBool(false);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1].bbox);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocBool();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}

		if (arg0.getValue() < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}
		if (arg1.getValue() < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		var date1 = Date.prototype.getDateFromExcel(arg0.getValue()), date2 = Date.prototype.getDateFromExcel(
			arg1.getValue());

		return this.value = new cNumber(days360(date1, date2, arg2.toBool()));

	};
	cDAYS360.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  start-date , end-date [ , method-flag ] )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEDATE() {
		this.name = "EDATE";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cEDATE.prototype = Object.create(cBaseFunction.prototype);
	cEDATE.prototype.constructor = cEDATE;
	cEDATE.prototype.argumentsMin = 2;
	cEDATE.prototype.argumentsMax = 2;
	cEDATE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cEDATE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var val = arg0.getValue(), date, _date;

		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val < 60) {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			} else if (val == 60) {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			} else {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			}
		} else {
			val = new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
		}

		date = new Date(val);

		if (0 <= date.getUTCDate() && 28 >= date.getUTCDate()) {
			val = new Date(val.setUTCMonth(val.getUTCMonth() + arg1.getValue()))
		} else if (29 <= date.getUTCDate() && 31 >= date.getUTCDate()) {
			date.setUTCDate(1);
			date.setUTCMonth(date.getUTCMonth() + arg1.getValue());
			if (val.getUTCDate() > (_date = date.getDaysInMonth())) {
				val.setUTCDate(_date);
			}
			val = new Date(val.setUTCMonth(val.getUTCMonth() + arg1.getValue()));
		}

		return this.value = new cNumber(Math.floor(( val.getTime() / 1000 - val.getTimezoneOffset() * 60 ) / c_sPerDay +
			(AscCommonExcel.c_DateCorrectConst + 1)))
	};
	cEDATE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( start-date , month-offset )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEOMONTH() {
		this.name = "EOMONTH";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cEOMONTH.prototype = Object.create(cBaseFunction.prototype);
	cEOMONTH.prototype.constructor = cEOMONTH;
	cEOMONTH.prototype.argumentsMin = 2;
	cEOMONTH.prototype.argumentsMax = 2;
	cEOMONTH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cEOMONTH.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var val = arg0.getValue();

		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val < 60) {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			} else if (val == 60) {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			} else {
				val = new Date((val - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			}
		} else {
			val = new Date((val - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
		}

		val.setUTCDate(1);
		val.setUTCMonth(val.getUTCMonth() + arg1.getValue());
		val.setUTCDate(val.getDaysInMonth());

		return this.value = new cNumber(Math.floor(( val.getTime() / 1000 - val.getTimezoneOffset() * 60 ) / c_sPerDay +
			(AscCommonExcel.c_DateCorrectConst + 1)));
	};
	cEOMONTH.prototype.getInfo = function () {
		return {
			name: this.name, args: "( start-date , month-offset )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHOUR() {
		this.name = "HOUR";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cHOUR.prototype = Object.create(cBaseFunction.prototype);
	cHOUR.prototype.constructor = cHOUR;
	cHOUR.prototype.argumentsMin = 1;
	cHOUR.prototype.argumentsMax = 1;
	cHOUR.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cHOUR.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
		}

		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue();
			if (val instanceof cError) {
				return this.value = val;
			} else if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					d = g_oFormatParser.parseDate(arg0.getValue());
					if (d == null) {
						return this.value = new cError(cErrorType.wrong_value_type);
					}
					val = d.value;
				} else {
					val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) );
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else                             //1		 2 3 4					   4	3		 	 					2 1
		{
			return this.setCalcValue(new cNumber(parseInt(( ( val - Math.floor(val) ) * 24 ).toFixed(cExcelDateTimeDigits))),
				0);
		}
	};
	cHOUR.prototype.getInfo = function () {
		return {
			name: this.name, args: "( time-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMINUTE() {
		this.name = "MINUTE";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cMINUTE.prototype = Object.create(cBaseFunction.prototype);
	cMINUTE.prototype.constructor = cMINUTE;
	cMINUTE.prototype.argumentsMin = 1;
	cMINUTE.prototype.argumentsMax = 1;
	cMINUTE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cMINUTE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
		}

		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue();
			if (val instanceof cError) {
				return this.value = val;
			} else if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					d = g_oFormatParser.parseDate(arg0.getValue());
					if (d == null) {
						return this.value = new cError(cErrorType.wrong_value_type);
					}
					val = d.value;
				} else {
					val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) );
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else {
			val = parseInt(( ( val * 24 - Math.floor(val * 24) ) * 60 ).toFixed(cExcelDateTimeDigits)) % 60;
			return this.setCalcValue(new cNumber(val), 0);
		}
	};
	cMINUTE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( time-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMONTH() {
		this.name = "MONTH";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cMONTH.prototype = Object.create(cBaseFunction.prototype);
	cMONTH.prototype.constructor = cMONTH;
	cMONTH.prototype.argumentsMin = 1;
	cMONTH.prototype.argumentsMax = 1;
	cMONTH.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cMONTH.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
		}

		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue();
			if (val instanceof cError) {
				return this.value = val;
			} else if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					return this.value = new cError(cErrorType.wrong_value_type);
				} else {
					val = Math.floor(( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) ));
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}
		if (!AscCommon.bDate1904) {
			if (val == 60) {
				return this.setCalcValue(new cNumber(2), 0);
			} else {
				return this.setCalcValue(
					new cNumber(( new Date(( (val == 0 ? 1 : val) - AscCommonExcel.c_DateCorrectConst - 1 ) *
							c_msPerDay) ).getUTCMonth() + 1), 0);
			}
		} else {
			return this.setCalcValue(new cNumber(( new Date(( (val == 0 ? 1 : val) - AscCommonExcel.c_DateCorrectConst ) *
					c_msPerDay) ).getUTCMonth() + 1), 0);
		}
	};
	cMONTH.prototype.getInfo = function () {
		return {
			name: this.name, args: "( date-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNETWORKDAYS() {
		this.name = "NETWORKDAYS";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cNETWORKDAYS.prototype = Object.create(cBaseFunction.prototype);
	cNETWORKDAYS.prototype.constructor = cNETWORKDAYS;
	cNETWORKDAYS.prototype.argumentsMin = 2;
	cNETWORKDAYS.prototype.argumentsMax = 3;
	cNETWORKDAYS.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cNETWORKDAYS.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var val0 = arg0.getValue(), val1 = arg1.getValue(), dif, count = 0;

		if (val0 < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val0 < 60) {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			} else if (val0 == 60) {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			} else {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			}
		} else {
			val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
		}

		if (val1 < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val1 < 60) {
				val1 = new Date((val1 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			} else if (val1 == 60) {
				val1 = new Date((val1 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			} else {
				val1 = new Date((val1 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			}
		} else {
			val1 = new Date((val1 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
		}

		var holidays = [], i;

		if (arg2) {
			if (arg2 instanceof cRef) {
				var a = arg2.getValue();
				if (a instanceof cNumber && a.getValue() >= 0) {
					holidays.push(a);
				}
			} else if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
				var arr = arg2.getValue();
				for (i = 0; i < arr.length; i++) {
					if (arr[i] instanceof cNumber && arr[i].getValue() >= 0) {
						holidays.push(arr[i]);
					}
				}
			} else if (arg2 instanceof cArray) {
				arg2.foreach(function (elem, r, c) {
					if (elem instanceof cNumber) {
						holidays.push(elem);
					} else if (elem instanceof cString) {
						var res = g_oFormatParser.parse(elem.getValue());
						if (res && res.bDateTime && res.value >= 0) {
							holidays.push(new cNumber(parseInt(res.value)));
						}
					}
				})
			}
		}

		for (i = 0; i < holidays.length; i++) {
			holidays[i] = Date.prototype.getDateFromExcel(holidays[i].getValue());
		}

		function includeInHolidays(date) {
			for (var i = 0; i < holidays.length; i++) {
				if (date.getTime() == holidays[i].getTime()) {
					return false;
				}
			}
			return true;
		}

		dif = ( val1 - val0 );
		dif = ( dif + (dif >= 0 ? c_msPerDay : 0 ) ) / c_msPerDay;
		for (i = 0; i < Math.abs(dif); i++) {
			var date = new Date(val0);
			date.setUTCDate(val0.getUTCDate() + i);
			if (date.getUTCDay() != 6 && date.getUTCDay() != 0 && includeInHolidays(date)) {
				count++;
			}
		}
		return this.value = new cNumber((dif < 0 ? -1 : 1) * count);
	};
	cNETWORKDAYS.prototype.getInfo = function () {
		return {
			name: this.name, args: "( start-date , end-date [ , holidays ] )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNETWORKDAYS_INTL() {
		cBaseFunction.call(this, "NETWORKDAYS.INTL");
	}

	cNETWORKDAYS_INTL.prototype = Object.create(cBaseFunction.prototype);
	cNETWORKDAYS_INTL.prototype.constructor = cNETWORKDAYS_INTL;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNOW() {
		this.name = "NOW";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cNOW.prototype = Object.create(cBaseFunction.prototype);
	cNOW.prototype.constructor = cNOW;
	cNOW.prototype.argumentsMax = 0;
	cNOW.prototype.ca = true;
	cNOW.prototype.Calculate = function () {
		var d = new Date();
		this.value = new cNumber(d.getExcelDate() +
			(d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds()) / c_sPerDay);
		this.value.numFormat = 22;
		return this.value;
	};
	cNOW.prototype.getInfo = function () {
		return {
			name: this.name, args: "()"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSECOND() {
		this.name = "SECOND";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cSECOND.prototype = Object.create(cBaseFunction.prototype);
	cSECOND.prototype.constructor = cSECOND;
	cSECOND.prototype.argumentsMin = 1;
	cSECOND.prototype.argumentsMax = 1;
	cSECOND.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cSECOND.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
		}

		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue();
			if (val instanceof cError) {
				return this.value = val;
			} else if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					d = g_oFormatParser.parseDate(arg0.getValue());
					if (d == null) {
						return this.value = new cError(cErrorType.wrong_value_type);
					}
					val = d.value;
				} else {
					val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) );
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else {
			val = parseInt((( val * 24 * 60 - Math.floor(val * 24 * 60) ) * 60).toFixed(cExcelDateTimeDigits)) % 60;
			return this.setCalcValue(new cNumber(val), 0);
		}
	};
	cSECOND.prototype.getInfo = function () {
		return {
			name: this.name, args: "( time-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTIME() {
		this.name = "TIME";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cTIME.prototype = Object.create(cBaseFunction.prototype);
	cTIME.prototype.constructor = cTIME;
	cTIME.prototype.argumentsMin = 3;
	cTIME.prototype.argumentsMax = 3;
	cTIME.prototype.Calculate = function (arg) {
		var hour = arg[0], minute = arg[1], second = arg[2];

		if (hour instanceof cArea || hour instanceof cArea3D) {
			hour = hour.cross(arguments[1].bbox);
		} else if (hour instanceof cArray) {
			hour = hour.getElement(0);
		}
		if (minute instanceof cArea || minute instanceof cArea3D) {
			minute = minute.cross(arguments[1].bbox);
		} else if (minute instanceof cArray) {
			minute = minute.getElement(0);
		}
		if (second instanceof cArea || second instanceof cArea3D) {
			second = second.cross(arguments[1].bbox);
		} else if (second instanceof cArray) {
			second = second.getElement(0);
		}

		hour = hour.tocNumber();
		minute = minute.tocNumber();
		second = second.tocNumber();

		if (hour instanceof cError) {
			return this.value = hour;
		}
		if (minute instanceof cError) {
			return this.value = minute;
		}
		if (second instanceof cError) {
			return this.value = second;
		}

		hour = hour.getValue();
		minute = minute.getValue();
		second = second.getValue();

		var v = (hour * 60 * 60 + minute * 60 + second) / c_sPerDay;
		this.value = new cNumber(v - Math.floor(v));
		this.value.numFormat = 18;
		return this.value;
	};
	cTIME.prototype.getInfo = function () {
		return {
			name: this.name, args: "( hour, minute, second )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTIMEVALUE() {
		this.name = "TIMEVALUE";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cTIMEVALUE.prototype = Object.create(cBaseFunction.prototype);
	cTIMEVALUE.prototype.constructor = cTIMEVALUE;
	cTIMEVALUE.prototype.argumentsMin = 1;
	cTIMEVALUE.prototype.argumentsMax = 1;
	cTIMEVALUE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cTIMEVALUE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var res = g_oFormatParser.parse(arg0.getValue());

		if (res && res.bDateTime) {
			return this.value = new cNumber(res.value - parseInt(res.value));
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
	};
	cTIMEVALUE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( date-time-string )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTODAY() {
		this.name = "TODAY";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cTODAY.prototype = Object.create(cBaseFunction.prototype);
	cTODAY.prototype.constructor = cTODAY;
	cTODAY.prototype.argumentsMax = 0;
	cTODAY.prototype.ca = true;
	cTODAY.prototype.Calculate = function () {
		this.value = new cNumber(new Date().getExcelDate());
		this.value.numFormat = 14;
		return this.value;
	};
	cTODAY.prototype.getInfo = function () {
		return {
			name: this.name, args: "()"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEEKDAY() {
		this.name = "WEEKDAY";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cWEEKDAY.prototype = Object.create(cBaseFunction.prototype);
	cWEEKDAY.prototype.constructor = cWEEKDAY;
	cWEEKDAY.prototype.argumentsMin = 1;
	cWEEKDAY.prototype.argumentsMax = 2;
	cWEEKDAY.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cWEEKDAY.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(1);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var weekday;

		switch (arg1.getValue()) {
			case 1: /* 1 (Sunday) through 7 (Saturday)  */
			case 17:/* 1 (Sunday) through 7 (Saturday) */
				weekday = [1, 2, 3, 4, 5, 6, 7];
				break;
			case 2: /* 1 (Monday) through 7 (Sunday)    */
			case 11:/* 1 (Monday) through 7 (Sunday)    */
				weekday = [7, 1, 2, 3, 4, 5, 6];
				break;
			case 3: /* 0 (Monday) through 6 (Sunday)    */
				weekday = [6, 0, 1, 2, 3, 4, 5];
				break;
			case 12:/* 1 (Tuesday) through 7 (Monday)   */
				weekday = [6, 7, 1, 2, 3, 4, 5];
				break;
			case 13:/* 1 (Wednesday) through 7 (Tuesday) */
				weekday = [5, 6, 7, 1, 2, 3, 4];
				break;
			case 14:/* 1 (Thursday) through 7 (Wednesday) */
				weekday = [4, 5, 6, 7, 1, 2, 3];
				break;
			case 15:/* 1 (Friday) through 7 (Thursday) */
				weekday = [3, 4, 5, 6, 7, 1, 2];
				break;
			case 16:/* 1 (Saturday) through 7 (Friday) */
				weekday = [2, 3, 4, 5, 6, 7, 1];
				break;
			default:
				return this.value = new cError(cErrorType.not_numeric);
		}
		if (arg0.getValue() < 0) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = new cNumber(weekday[new Date((arg0.getValue() - (AscCommonExcel.c_DateCorrectConst + 1)) *
			c_msPerDay).getUTCDay()]);
	};
	cWEEKDAY.prototype.getInfo = function () {
		return {
			name: this.name, args: "( serial-value [ , weekday-start-flag ] )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEEKNUM() {
		this.name = "WEEKNUM";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cWEEKNUM.prototype = Object.create(cBaseFunction.prototype);
	cWEEKNUM.prototype.constructor = cWEEKNUM;
	cWEEKNUM.prototype.argumentsMin = 1;
	cWEEKNUM.prototype.argumentsMax = 2;
	cWEEKNUM.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cWEEKNUM.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(1), type = 0;

		function WeekNumber(dt, iso, type) {
			dt.setUTCHours(0, 0, 0);
			var startOfYear = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
			var endOfYear = new Date(dt);
			endOfYear.setUTCMonth(11);
			endOfYear.setUTCDate(31);
			var wk = parseInt(((dt - startOfYear) / c_msPerDay + iso[startOfYear.getUTCDay()]) / 7);
			if (type) {
				switch (wk) {
					case 0:
						// Возвращаем номер недели от 31 декабря предыдущего года
						startOfYear.setUTCDate(0);
						return WeekNumber(startOfYear, iso, type);
					case 53:
						// Если 31 декабря выпадает до четверга 1 недели следующего года
						if (endOfYear.getUTCDay() < 4) {
							return new cNumber(1);
						} else {
							return new cNumber(wk);
						}
					default:
						return new cNumber(wk);
				}
			} else {
				wk = parseInt(((dt - startOfYear) / c_msPerDay + iso[startOfYear.getUTCDay()] + 7) / 7);
				return new cNumber(wk);
			}
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		if (arg0.getValue() < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		var weekdayStartDay;

		switch (arg1.getValue()) {
			case 1: /* 1 (Sunday) through 7 (Saturday)  */
			case 17:/* 1 (Sunday) through 7 (Saturday) */
				weekdayStartDay = [0, 1, 2, 3, 4, 5, 6];
				break;
			case 2: /* 1 (Monday) through 7 (Sunday)    */
			case 11:/* 1 (Monday) through 7 (Sunday)    */
				weekdayStartDay = [6, 0, 1, 2, 3, 4, 5];
				break;
			case 12:/* 1 (Tuesday) through 7 (Monday)   */
				weekdayStartDay = [5, 6, 0, 1, 2, 3, 4];
				break;
			case 13:/* 1 (Wednesday) through 7 (Tuesday) */
				weekdayStartDay = [4, 5, 6, 0, 1, 2, 3];
				break;
			case 14:/* 1 (Thursday) through 7 (Wednesday) */
				weekdayStartDay = [3, 4, 5, 6, 0, 1, 2];
				break;
			case 15:/* 1 (Friday) through 7 (Thursday) */
				weekdayStartDay = [2, 3, 4, 5, 6, 0, 1];
				break;
			case 16:/* 1 (Saturday) through 7 (Friday) */
				weekdayStartDay = [1, 2, 3, 4, 5, 6, 0];
				break;
			case 21:
				weekdayStartDay = [6, 7, 8, 9, 10, 4, 5];
//                { 6, 7, 8, 9, 10, 4, 5 }
				type = 1;
				break;
			default:
				return this.value = new cError(cErrorType.not_numeric);
		}

		return this.value =
			new cNumber(WeekNumber(Date.prototype.getDateFromExcel(arg0.getValue()), weekdayStartDay, type));

	};
	cWEEKNUM.prototype.getInfo = function () {
		return {
			name: this.name, args: "( serial-value [ , weekday-start-flag ] )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWORKDAY() {
		this.name = "WORKDAY";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cWORKDAY.prototype = Object.create(cBaseFunction.prototype);
	cWORKDAY.prototype.constructor = cWORKDAY;
	cWORKDAY.prototype.argumentsMin = 2;
	cWORKDAY.prototype.argumentsMax = 3;
	cWORKDAY.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cWORKDAY.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var val0 = arg0.getValue(), holidays = [], i;

		if (val0 < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		} else if (!AscCommon.bDate1904) {
			if (val0 < 60) {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			} else if (val0 == 60) {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			} else {
				val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
			}
		} else {
			val0 = new Date((val0 - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
		}

		if (arg2) {
			if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
				var arr = arg2.getValue();
				for (i = 0; i < arr.length; i++) {
					if (arr[i] instanceof cNumber && arr[i].getValue() >= 0) {
						holidays.push(arr[i]);
					}
				}
			} else if (arg2 instanceof cArray) {
				arg2.foreach(function (elem, r, c) {
					if (elem instanceof cNumber) {
						holidays.push(elem);
					} else if (elem instanceof cString) {
						var res = g_oFormatParser.parse(elem.getValue());
						if (res && res.bDateTime && res.value >= 0) {
							holidays.push(new cNumber(parseInt(res.value)));
						}
					}
				})
			}
		}

		for (i = 0; i < holidays.length; i++) {
			if (!AscCommon.bDate1904) {
				if (holidays[i].getValue() < 60) {
					holidays[i] = new Date((holidays[i].getValue() - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
				} else if (holidays[i] == 60) {
					holidays[i] =
						new Date((holidays[i].getValue() - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
				} else {
					holidays[i] =
						new Date((holidays[i].getValue() - AscCommonExcel.c_DateCorrectConst - 1) * c_msPerDay);
				}
			} else {
				holidays[i] = new Date((holidays[i].getValue() - AscCommonExcel.c_DateCorrectConst) * c_msPerDay);
			}
		}

		function notAHolidays(date) {
			for (var i = 0; i < holidays.length; i++) {
				if (date.getTime() == holidays[i].getTime()) {
					return false;
				}
			}
			return true;
		}

		var dif = arg1.getValue(), count = 1, dif1 = dif > 0 ? 1 : dif < 0 ? -1 : 0, val, date = val0;
		while (Math.abs(dif) > count) {
			date = new Date(val0.getTime() + dif1 * c_msPerDay);
			if (date.getUTCDay() != 6 && date.getUTCDay() != 0 && notAHolidays(date)) {
				count++;
			}
			dif >= 0 ? dif1++ : dif1--;
		}
		date = new Date(val0.getTime() + dif1 * c_msPerDay);
		val = date.getExcelDate();

		if (val < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		return this.setCalcValue(new cNumber(val), 14);
	};
	cWORKDAY.prototype.getInfo = function () {
		return {
			name: this.name, args: "( start-date , day-offset [ , holidays ] )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWORKDAY_INTL() {
		cBaseFunction.call(this, "WORKDAY.INTL");
	}

	cWORKDAY_INTL.prototype = Object.create(cBaseFunction.prototype);
	cWORKDAY_INTL.prototype.constructor = cWORKDAY_INTL;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cYEAR() {
		this.name = "YEAR";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cYEAR.prototype = Object.create(cBaseFunction.prototype);
	cYEAR.prototype.constructor = cYEAR;
	cYEAR.prototype.argumentsMin = 1;
	cYEAR.prototype.argumentsMax = 1;
	cYEAR.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cYEAR.prototype.Calculate = function (arg) {
		var arg0 = arg[0], val;
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox).tocNumber();
		}

		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cNumber || arg0 instanceof cBool) {
			val = arg0.tocNumber().getValue();
		} else if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			return this.value = new cError(cErrorType.wrong_value_type);
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			val = arg0.getValue();
			if (val instanceof cError) {
				return this.value = val;
			} else if (val instanceof cNumber || val instanceof cBool) {
				val = arg0.tocNumber().getValue();
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		} else if (arg0 instanceof cString) {
			val = arg0.tocNumber();
			if (val instanceof cError || val instanceof cEmpty) {
				var d = new Date(arg0.getValue());
				if (isNaN(d)) {
					return this.value = new cError(cErrorType.wrong_value_type);
				} else {
					val = Math.floor(( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay +
						( AscCommonExcel.c_DateCorrectConst + (AscCommon.bDate1904 ? 0 : 1) ));
				}
			} else {
				val = arg0.tocNumber().getValue();
			}
		}
		if (val < 0) {
			return this.setCalcValue(new cError(cErrorType.not_numeric), 0);
		} else {
			return this.setCalcValue(
				new cNumber((new Date((val - (AscCommonExcel.c_DateCorrectConst + 1)) * c_msPerDay)).getUTCFullYear()),
				0);
		}
	};
	cYEAR.prototype.getInfo = function () {
		return {
			name: this.name, args: "( date-value )"
		};
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cYEARFRAC() {
		this.name = "YEARFRAC";
		this.value = null;
		this.argumentsCurrent = 0;
	}

	cYEARFRAC.prototype = Object.create(cBaseFunction.prototype);
	cYEARFRAC.prototype.constructor = cYEARFRAC;
	cYEARFRAC.prototype.argumentsMin = 2;
	cYEARFRAC.prototype.argumentsMax = 3;
	cYEARFRAC.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cYEARFRAC.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber(0);
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1].bbox);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}

		var val0 = arg0.getValue(), val1 = arg1.getValue();

		if (val0 < 0 || val1 < 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		val0 = Date.prototype.getDateFromExcel(val0);
		val1 = Date.prototype.getDateFromExcel(val1);

		return this.value = yearFrac(val0, val1, arg2.getValue());
//    return this.value = diffDate2( val0, val1, arg2.getValue() );

	};
	cYEARFRAC.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  start-date , end-date [ , basis ] )"
		};
	};

//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].DayCountBasis = DayCountBasis;
	window['AscCommonExcel'].yearFrac = yearFrac;
	window['AscCommonExcel'].diffDate = diffDate;
	window['AscCommonExcel'].days360 = days360;
	window['AscCommonExcel'].daysInYear = daysInYear;
})(window);
