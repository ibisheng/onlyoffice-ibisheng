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
	function _getRowTitle(row) {
		return "" + (row + 1);
	}

	var g_cCharDelimiter = AscCommon.g_cCharDelimiter;
	var parserHelp = AscCommon.parserHelp;
	var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
	var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;
	var g_oCellAddressUtils = AscCommon.g_oCellAddressUtils;
	var CellAddress = AscCommon.CellAddress;

	var cElementType = AscCommonExcel.cElementType;
	var cErrorType = AscCommonExcel.cErrorType;
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

	var checkTypeCell = AscCommonExcel.checkTypeCell;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	var _func = AscCommonExcel._func;

	cFormulaFunctionGroup['LookupAndReference'] = cFormulaFunctionGroup['LookupAndReference'] || [];
	cFormulaFunctionGroup['LookupAndReference'].push(cADDRESS, cAREAS, cCHOOSE, cCOLUMN, cCOLUMNS, cGETPIVOTDATA,
		cHLOOKUP, cHYPERLINK, cINDEX, cINDIRECT, cLOOKUP, cMATCH, cOFFSET, cROW, cROWS, cRTD, cTRANSPOSE, cVLOOKUP);

	function searchRegExp(str, flags) {
		var vFS = str
			.replace(/(\\)/g, "\\")
			.replace(/(\^)/g, "\\^")
			.replace(/(\()/g, "\\(")
			.replace(/(\))/g, "\\)")
			.replace(/(\+)/g, "\\+")
			.replace(/(\[)/g, "\\[")
			.replace(/(\])/g, "\\]")
			.replace(/(\{)/g, "\\{")
			.replace(/(\})/g, "\\}")
			.replace(/(\$)/g, "\\$")
			.replace(/(~)?\*/g, function ($0, $1) {
				return $1 ? $0 : '(.*)';
			})
			.replace(/(~)?\?/g, function ($0, $1) {
				return $1 ? $0 : '.{1}';
			})
			.replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?");

		return new RegExp(vFS + "$", flags ? flags : "i");
	}

	/** @constructor */
	function cADDRESS() {
		this.name = "ADDRESS";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 5;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cADDRESS.prototype = Object.create(cBaseFunction.prototype);
	cADDRESS.prototype.Calculate = function (arg) {
		var rowNumber = arg[0], colNumber = arg[1], refType = arg[2] ? arg[2] : new cNumber(1), A1RefType = arg[3] ?
			arg[3] : new cBool(true), sheetName = arg[4] ? arg[4] : new cEmpty();

		if (cElementType.cellsRange === rowNumber.type || cElementType.cellsRange3D === rowNumber.type) {
			rowNumber = rowNumber.cross(arguments[1].bbox);
		} else if (cElementType.array === rowNumber.type) {
			rowNumber = rowNumber.getElementRowCol(0, 0);
		}

		if (cElementType.cellsRange === colNumber.type || cElementType.cellsRange3D === colNumber.type) {
			colNumber = colNumber.cross(arguments[1].bbox);
		} else if (cElementType.array === colNumber.type) {
			colNumber = colNumber.getElementRowCol(0, 0);
		}

		if (cElementType.cellsRange === refType.type || cElementType.cellsRange3D === refType.type) {
			refType = refType.cross(arguments[1].bbox);
		} else if (cElementType.array === refType.type) {
			refType = refType.getElementRowCol(0, 0);
		}

		if (cElementType.cellsRange === A1RefType.type || cElementType.cellsRange3D === A1RefType.type) {
			A1RefType = A1RefType.cross(arguments[1].bbox);
		} else if (cElementType.array === A1RefType.type) {
			A1RefType = A1RefType.getElementRowCol(0, 0);
		}

		if (cElementType.cellsRange === sheetName.type || cElementType.cellsRange3D === sheetName.type) {
			sheetName = sheetName.cross(arguments[1].bbox);
		} else if (cElementType.array === sheetName.type) {
			sheetName = sheetName.getElementRowCol(0, 0);
		}

		rowNumber = rowNumber.tocNumber();
		colNumber = colNumber.tocNumber();
		refType = refType.tocNumber();
		A1RefType = A1RefType.tocBool();

		if (cElementType.error === rowNumber.type) {
			return this.value = rowNumber;
		}
		if (cElementType.error === colNumber.type) {
			return this.value = colNumber;
		}
		if (cElementType.error === refType.type) {
			return this.value = refType;
		}
		if (cElementType.error === A1RefType.type) {
			return this.value = A1RefType;
		}
		if (cElementType.error === sheetName.type) {
			return this.value = sheetName;
		}

		rowNumber = rowNumber.getValue();
		colNumber = colNumber.getValue();
		refType = refType.getValue();
		A1RefType = A1RefType.toBool();

		if (refType > 4 || refType < 1 || rowNumber < 1 || rowNumber > AscCommon.gc_nMaxRow || colNumber < 1 ||
			colNumber > AscCommon.gc_nMaxCol) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		var strRef;
		var absR, absC;
		switch (refType - 1) {
			case AscCommonExcel.referenceType.A:
				absR = true;
				absC = true;
				break;
			case AscCommonExcel.referenceType.ARRC:
				absR = true;
				absC = false;
				break;
			case AscCommonExcel.referenceType.RRAC:
				absR = false;
				absC = true;
				break;
			case AscCommonExcel.referenceType.R:
				absR = false;
				absC = false;
				break;
		}

		strRef = this._getRef(this._absolute(absR, rowNumber, A1RefType),
			this._absolute(absC, A1RefType ? g_oCellAddressUtils.colnumToColstrFromWsView(colNumber) : colNumber, A1RefType),
			A1RefType);

		return this.value =
			new cString((cElementType.empty === sheetName.type) ? strRef : parserHelp.get3DRef(sheetName.toString(), strRef));
	};
	cADDRESS.prototype._getRef = function (row, col, A1RefType) {
		return A1RefType ? col + row : 'R' + row + 'C' + col;
	};
	cADDRESS.prototype._absolute = function (abs, val, A1RefType) {

		return abs ? (A1RefType ? '$' + val : val) : (A1RefType ? val : '[' + val + ']');
	};
	cADDRESS.prototype.getInfo = function () {
		return {
			name: this.name,
			args: "( row-number , col-number [ , [ ref-type ] [ , [ A1-ref-style-flag ] [ , sheet-name ] ] ] )"
		};
	};

	/** @constructor */
	function cAREAS() {
		cBaseFunction.call(this, "AREAS");
	}

	cAREAS.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cCHOOSE() {
		this.name = "CHOOSE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 30;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cCHOOSE.prototype = Object.create(cBaseFunction.prototype);
	cCHOOSE.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();

		if (cElementType.error === arg0.type) {
			return this.value = arg0;
		}

		if (cElementType.number === arg0.type) {
			if (arg0.getValue() < 1 || arg0.getValue() > this.getArguments() - 1) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

			return this.value = arg[Math.floor(arg0.getValue())];
		}

		return this.value = new cError(cErrorType.wrong_value_type);
	};
	cCHOOSE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( index , argument-list )"
		};
	};

	/** @constructor */
	function cCOLUMN() {
		this.name = "COLUMN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 0;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cCOLUMN.prototype = Object.create(cBaseFunction.prototype);
	cCOLUMN.prototype.Calculate = function (arg) {
		var arg0;
		if (this.argumentsCurrent == 0) {
			arg0 = arguments[1];
			return this.value = new cNumber(arg0.bbox.c1 + 1);
		}
		arg0 = arg[0];
		var range;
		if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type ||
			cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			range = arg0.getRange();
		}
		return this.value = (range ? new cNumber(range.bbox.c1 + 1) : new cError(cErrorType.bad_reference));
	};
	cCOLUMN.prototype.getInfo = function () {
		return {
			name: this.name, args: "( [ reference ] )"
		};
	};

	/** @constructor */
	function cCOLUMNS() {
		this.name = "COLUMNS";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cCOLUMNS.prototype = Object.create(cBaseFunction.prototype);
	cCOLUMNS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		var range;
		if (cElementType.array === arg0.type) {
			return this.value = new cNumber(arg0.getCountElementInRow());
		} else if (cElementType.cellsRange === arg0.type || cElementType.cell === arg0.type ||
			cElementType.cell3D === arg0.type || cElementType.cellsRange3D === arg0.type) {
			range = arg0.getRange();
		}
		return this.value = (range ? new cNumber(Math.abs(range.getBBox0().c1 - range.getBBox0().c2) + 1) :
			new cError(cErrorType.wrong_value_type));
	};
	cCOLUMNS.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array )"
		};
	};

	/** @constructor */
	function cGETPIVOTDATA() {
		cBaseFunction.call(this, "GETPIVOTDATA");
	}

	cGETPIVOTDATA.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cHLOOKUP() {
		this.name = "HLOOKUP";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cHLOOKUP.prototype = Object.create(cBaseFunction.prototype);
	cHLOOKUP.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
		var arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool().value : true;
		var numberRow = arg2.getValue() - 1, valueForSearching = arg0.getValue(), resC = -1, min, regexp;

		if (isNaN(numberRow)) {
			return this.value = new cError(cErrorType.bad_reference);
		}
		if (numberRow < 0) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cell3D === arg0.type || cElementType.cell === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.string === arg0.type) {
			valueForSearching = arg0.getValue();
			regexp = searchRegExp(valueForSearching);
		} else if (cElementType.error === arg0.type) {
			return this.value = arg0;
		} else {
			valueForSearching = arg0.getValue();
		}

		var found = false;
		if (cElementType.array === arg1.type) {
			arg1.foreach(function (elem, r, c) {
				if (c == 0) {
					min = elem.getValue();
				}

				if (arg3 === true) {
					if (valueForSearching == elem.getValue()) {
						resC = c;
						found = true;
					} else if (valueForSearching > elem.getValue() && !found) {
						resC = c;
					}
				} else {
					if (cElementType.string === arg0.type) {
						if (regexp.test(elem.getValue())) {
							resC = c;
						}
					} else if (valueForSearching == elem.getValue()) {
						resC = c;
					}
				}

				min = Math.min(min, elem.getValue());
			});

			if (min > valueForSearching) {
				return this.value = new cError(cErrorType.not_available);
			}

			if (resC == -1) {
				return this.value = new cError(cErrorType.not_available);
			}

			if (numberRow > arg1.getRowCount() - 1) {
				return this.value = new cError(cErrorType.bad_reference);
			}

			return this.value = arg1.getElementRowCol(numberRow, resC);

		}

		var range;
		if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type ||
			cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			range = arg1.getRange();
		}
		if (!range) {
			return this.value = new cError(cErrorType.bad_reference);
		}

		var bb = range.getBBox0();
		if (numberRow > bb.r2 - bb.r1) {
			return this.value = new cError(cErrorType.bad_reference);
		}
		var ws = arg1.getWS();
		var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r1, bb.c2);

		resC = g_oHLOOKUPCache.get(oSearchRange, valueForSearching, arg3);
		if (-1 === resC) {
			return this.value = new cError(cErrorType.not_available);
		}

		var v = arg1.getWS()._getCellNoEmpty(bb.r1 + numberRow, resC);
		return this.value = checkTypeCell(v);
	};
	cHLOOKUP.prototype.getInfo = function () {
		return {
			name: this.name, args: "( lookup-value  ,  table-array  ,  row-index-num  [  ,  [  range-lookup-flag  ] ] )"
		};
	};

	/** @constructor */
	function cHYPERLINK() {
		cBaseFunction.call(this, "HYPERLINK");
	}

	cHYPERLINK.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cINDEX() {
		this.name = "INDEX";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cINDEX.prototype = Object.create(cBaseFunction.prototype);
	cINDEX.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] && (cElementType.empty !== arg[1].type) ? arg[1] : new cNumber(1), arg2 = arg[2] &&
		(cElementType.empty !== arg[2].type) ? arg[2] : new cNumber(1), arg3 = arg[3] &&
		(cElementType.empty !== arg[3].type) ? arg[3] : new cNumber(1), res;

		if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.tocArea();
			if (!arg0) {
				return this.value = new cError(cErrorType.not_available);
			}
		} else if (cElementType.error === arg0.type) {
			return this.value = arg0;
		}

		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
		arg3 = arg3.tocNumber();

		if (cElementType.error === arg1.type || cElementType.error === arg2.type || cElementType.error === arg3.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg1 = arg1.getValue();
		arg2 = arg2.getValue();
		arg3 = arg3.getValue();

		if (arg1 < 0 || arg2 < 0) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.array === arg0.type) {
			res = arg0.getValue2((1 === arg0.rowCount || 0 === arg1) ? 0 : arg1 - 1, 0 === arg2 ? 0 : arg2 - 1);
		} else if (cElementType.cellsRange === arg0.type) {
			var ws = arg0.getWS(), bbox = arg0.getBBox0();

			if (bbox.r1 == bbox.r2) {/*одна строка*/
				res = ws.getRange3(bbox.r1, bbox.c1 + arg1 - 1, bbox.r1, bbox.c1 + arg1 - 1).getCells()[0].getName();
				res = new cRef(res, ws);
			} else {
				if (arg1 == 0 && arg2 > 0) {
					var _a1 = ws.getRange3(bbox.r1, bbox.c1 + arg2 - 1, bbox.r1, bbox.c2 + arg2 - 1)
						.getCells()[0].getName(), _a2 = ws.getRange3(bbox.r2, bbox.c1 + arg2 - 1, bbox.r2, bbox.c2 + arg2 - 1)
						.getCells()[0].getName();
					res = new cArea(_a1.toString() + ":" + _a2.toString(), ws);
				} else {
					if (arg1 > Math.abs(bbox.r1 - bbox.r2) + 1 || arg2 > Math.abs(bbox.c1 - bbox.c2) + 1) {
						res = new cError(cErrorType.bad_reference);
					} else {
						res = new cRef(ws.getRange3(bbox.r1 + arg1 - 1, bbox.c1 + arg2 - 1, bbox.r1 + arg1 - 1, bbox.c1 + arg2 - 1)
							.getCells()[0].getName(), ws);
					}
				}
			}
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			if ((arg1 == 0 || arg1 == 1) && (arg2 == 0 || arg2 == 1)) {
				res = arg0.getValue();
			}
		} else {
			res = new cError(cErrorType.wrong_value_type);
		}

		return this.value = res ? res : new cError(cErrorType.bad_reference);
	};
	cINDEX.prototype.getInfo = function () {
		return {
			name: this.name,
			args: "( array , [ row-number ] [ , [ column-number ] ] ) " + this.name +
			"( reference , [ row-number ] [ , [ column-number ] [ , [ area-number ] ] ] )"
		};
	};

	/** @constructor */
	function cINDIRECT() {
		this.name = "INDIRECT";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cINDIRECT.prototype = Object.create(cBaseFunction.prototype);
	cINDIRECT.prototype.Calculate = function (arg) {
		var t = this, arg0 = arg[0].tocString(), arg1 = arg[1] ? arg[1] :
			new cBool(true), r1 = arguments[1], wb = r1.worksheet.workbook, o = {
			Formula: "", pCurrPos: 0
		}, r2 = arguments[2], ref, found_operand;

		function parseReference() {
			if ((ref = parserHelp.is3DRef.call(o, o.Formula, o.pCurrPos))[0]) {
				var wsFrom = wb.getWorksheetByName(ref[1]);
				var wsTo = (null !== ref[2]) ? wb.getWorksheetByName(ref[2]) : wsFrom;
				if (!(wsFrom && wsTo)) {
					return t.value = new cError(cErrorType.bad_reference);
				}
				if (parserHelp.isArea.call(o, o.Formula, o.pCurrPos)) {
					found_operand = new cArea3D(o.operand_str.toUpperCase(), wsFrom, wsTo);
				} else if (parserHelp.isRef.call(o, o.Formula, o.pCurrPos)) {
					if (wsTo !== wsFrom) {
						found_operand = new cArea3D(o.operand_str.toUpperCase(), wsFrom, wsTo);
					} else {
						found_operand = new cRef3D(o.operand_str.toUpperCase(), wsFrom);
					}
				}
			} else if (parserHelp.isArea.call(o, o.Formula, o.pCurrPos)) {
				found_operand = new cArea(o.operand_str.toUpperCase(), r1.worksheet);
			} else if (parserHelp.isRef.call(o, o.Formula, o.pCurrPos, true)) {
				found_operand = new cRef(o.operand_str.toUpperCase(), r1.worksheet);
			} else if (parserHelp.isName.call(o, o.Formula, o.pCurrPos, wb)[0]) {
				found_operand = new AscCommonExcel.cName(o.operand_str, r1.worksheet);
			}
		}

		if (cElementType.array === arg0.type) {
			var ret = new cArray();
			arg0.foreach(function (elem, r) {
				o = {Formula: elem.toString(), pCurrPos: 0};
				parseReference();
				if (!ret.array[r]) {
					ret.addRow();
				}
				ret.addElement(found_operand)
			});
			return this.value = ret;
		} else {
			o.Formula = arg0.toString();
			parseReference();
		}

		if (found_operand) {
			if (cElementType.name === found_operand.type) {
				found_operand = found_operand.toRef();
			}

			return this.value = found_operand;
		}

		return this.value = new cError(cErrorType.bad_reference);

	};
	cINDIRECT.prototype.getInfo = function () {
		return {
			name: this.name, args: "( ref-text [ , [ A1-ref-style-flag ] ] )"
		};
	};

	/** @constructor */
	function cLOOKUP() {
		this.name = "LOOKUP";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cLOOKUP.prototype = Object.create(cBaseFunction.prototype);
	cLOOKUP.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = this.argumentsCurrent == 2 ? arg1 : arg[2], resC = -1, resR = -1;

		if (cElementType.error === arg0.type) {
			return this.value = arg0;
		}
		if (cElementType.cell === arg0.type) {
			arg0 = arg0.getValue();
		}

		function arrFinder(arr) {
			if (arr.getRowCount() > arr.getCountElementInRow()) {
				//ищем в первом столбце
				resC = arr.getCountElementInRow() > 1 ? 1 : 0;
				var arrCol = arr.getCol(0);
				resR = _func.binarySearch(arg0, arrCol);
			} else {
				//ищем в первой строке
				resR = arr.getRowCount() > 1 ? 1 : 0;
				var arrRow = arr.getRow(0);
				resC = _func.binarySearch(arg0, arrRow);
			}
		}

		if (!( (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type ||
			cElementType.array === arg1.type) &&
			(cElementType.cellsRange === arg2.type || cElementType.cellsRange3D === arg2.type ||
			cElementType.array === arg2.type) )) {
			return this.value = new cError(cErrorType.not_available);
		}

		if (cElementType.array === arg1.type && cElementType.array === arg2.type) {
			if (arg1.getRowCount() != arg2.getRowCount() && arg1.getCountElementInRow() != arg2.getCountElementInRow()) {
				return this.value = new cError(cErrorType.not_available);
			}

			arrFinder(arg1);

			if (resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2) {
				return this.value = new cError(cErrorType.not_available);
			}

			return this.value = arg2.getElementRowCol(resR, resC);

		} else if (cElementType.array === arg1.type || cElementType.array === arg2.type) {

			var _arg1, _arg2;

			_arg1 = cElementType.array === arg1.type ? arg1 : arg2;

			_arg2 = cElementType.array === arg2.type ? arg1 : arg2;

			var BBox = _arg2.getBBox0();

			if (_arg1.getRowCount() != (BBox.r2 - BBox.r1) && _arg1.getCountElementInRow() != (BBox.c2 - BBox.c1)) {
				return this.value = new cError(cErrorType.not_available);
			}

			arrFinder(_arg1);

			if (resR <= -1 && resC <= -1 || resR <= -2 || resC <= -2) {
				return this.value = new cError(cErrorType.not_available);
			}

			var c = new CellAddress(BBox.r1 + resR, BBox.c1 + resC, 0);
			return this.value = checkTypeCell(_arg2.getWS()._getCellNoEmpty(c.getRow0(), c.getCol0()));
		} else {
			if (cElementType.cellsRange3D === arg1.type && !arg1.isSingleSheet() ||
				cElementType.cellsRange3D === arg2.type && !arg2.isSingleSheet()) {
				return this.value = new cError(cErrorType.not_available);
			}

			var arg1Range, arg2Range;

			if (cElementType.cellsRange3D === arg1.type) {
				arg1Range = arg1.getMatrix()[0];
			} else if (cElementType.cellsRange === arg1.type) {
				arg1Range = arg1.getMatrix();
			}

			if (cElementType.cellsRange3D === arg2.type) {
				arg2Range = arg2.getMatrix()[0];
			} else if (cElementType.cellsRange === arg2.type) {
				arg2Range = arg2.getMatrix();
			}

			var index = _func.binarySearch(arg0, function () {
				var a = [];
				for (var i = 0; i < arg1Range.length; i++) {
					a.push(arg1Range[i][0])
				}
				return a;
			}());


			if (index < 0) {
				return this.value = new cError(cErrorType.not_available);
			}

			var ws = cElementType.cellsRange3D === arg1.type && arg1.isSingleSheet() ? arg1.getWS() : arg1.ws;

			if (cElementType.cellsRange3D === arg1.type) {
				if (arg1.isSingleSheet()) {
					ws = arg1.getWS();
				} else {
					return this.value = new cError(cErrorType.bad_reference);
				}
			} else if (cElementType.cellsRange === arg1.type) {
				ws = arg1.getWS();
			} else {
				return this.value = new cError(cErrorType.bad_reference);
			}

			var b = arg2.getBBox0();
			if (this.argumentsCurrent == 2) {
				if (arg1Range[0].length >= 2) {
					return this.value = new cRef(ws.getCell3(b.r1 + index, b.c2 + 0).getName(), ws);
				} else {
					return this.value = new cRef(ws.getCell3(b.r1 + 0, b.c1 + index).getName(), ws);
				}
			} else {
				if (arg2Range.length == 1) {
					return this.value = new cRef(ws.getCell3(b.r1 + 0, b.c1 + index).getName(), ws);
				} else {
					return this.value = new cRef(ws.getCell3(b.r1 + index, b.c1 + 0).getName(), ws);
				}
			}
		}
	};
	cLOOKUP.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  lookup-value  ,  lookup-vector  ,  result-vector  )"
		};
	};

	/** @constructor */
	function cMATCH() {
		this.name = "MATCH";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cMATCH.prototype = Object.create(cBaseFunction.prototype);
	cMATCH.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber(1);

		function findMatch(a0, a1, a2) {
			var i, item, a1RowCount = a1.length, a1ColumnCount = a1[0].length, a2Value = a2.getValue(), arr, index = -1;
			var a0Type = a0.type;
			var a0Value = a0.getValue();
			if(!(cElementType.number === a0Type || cElementType.string === a0Type || cElementType.bool === a0Type || cElementType.error === a0Type || cElementType.empty === a0Type)) {
				a0Type = a0Value.type;
				a0Value = a0Value.getValue();
			}

			if (a1RowCount > 1 && a1ColumnCount > 1) {
				return new cError(cErrorType.not_available);
			} else if (a1RowCount === 1 && a1ColumnCount >= 1) {
				arr = a1[0];
			} else {
				arr = [];
				for (i = 0; i < a1RowCount; i++) {
					arr[i] = a1[i][0];
				}
			}

			if (!(-1 === a2Value || 0 === a2Value || 1 === a2Value)) {
				return new cError(cErrorType.not_numeric);
			}

			for (i = 0; i < arr.length; ++i) {
				item = arr[i];
				if (arr[i].type === a0Type) {
					if (0 === a2Value) {
						if (cElementType.string === a0Type) {
							if (AscCommonExcel.searchRegExp2(item.toString(), a0Value)) {
								index = i;
								break;
							}
						} else {
							if (item == a0Value) {
								index = i;
								break;
							}
						}
					} else if (1 === a2Value) {
						if (item <= a0Value) {
							index = i;
						} else {
							break;
						}
					} else if (-1 === a2Value) {
						if (item >= a0Value) {
							index = i;
						} else {
							break;
						}
					}
				}
			}

			return (-1 < index) ? new cNumber(index + 1) : new cError(cErrorType.not_available);

		}

		if (cElementType.cellsRange3D === arg0.type || cElementType.array === arg0.type ||
			cElementType.cellsRange === arg0.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		} else if (cElementType.error === arg0.type) {
			return this.value = arg0;
		}

		if (cElementType.array === arg1.type || cElementType.cellsRange === arg1.type) {
			arg1 = arg1.getMatrix();
		} else if (cElementType.cellsRange3D === arg1.type && arg1.wsFrom == arg1.wsTo) {
			arg1 = arg1.getMatrix()[0];
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getMatrix();
		} else {
			return this.value = new cError(cErrorType.not_available);
		}

		if (cElementType.number === arg2.type || cElementType.bool === arg2.type) {
		} else if (cElementType.error === arg2.type) {
			return this.value = arg2;
		} else {
			return this.value = new cError(cErrorType.not_available);
		}

		return this.value = findMatch(arg0, arg1, arg2)

	};
	cMATCH.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  lookup-value  ,  lookup-array [ , [ match-type ]] )"
		};
	};

	/** @constructor */
	function cOFFSET() {
		this.name = "OFFSET";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 5;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cOFFSET.prototype = Object.create(cBaseFunction.prototype);
	cOFFSET.prototype.Calculate = function (arg) {

		function validBBOX(bbox) {
			return 0 <= bbox.r1 && bbox.r1 <= gc_nMaxRow0 && 0 <= bbox.c1 && bbox.c1 <= gc_nMaxCol0 && 0 <= bbox.r2 &&
				bbox.r2 <= gc_nMaxRow0 && 0 <= bbox.c2 && bbox.c2 <= gc_nMaxCol0;
		}

		var arg0 = arg[0], arg1 = arg[1].tocNumber(), arg2 = arg[2].tocNumber(), arg3 = new cNumber(-1), arg4 = new cNumber(-1);

		if (this.argumentsCurrent >= 4) {
			arg3 = arg[3].tocNumber();
		}
		if (this.argumentsCurrent == 5) {
			arg4 = arg[4].tocNumber();
		}

		if (cElementType.error === arg1.type || cElementType.error === arg2.type || cElementType.error === arg3.type ||
			arg4.type) {
			return this.value = new cError(cErrorType.bad_reference);
		}

		arg1 = arg1.getValue();
		arg2 = arg2.getValue();
		arg3 = arg3.getValue();
		arg4 = arg4.getValue();


		if (arg3 < 0) {
			arg3 = 1;
		}
		if (arg4 < 0) {
			arg4 = 1;
		}

		if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {

			var range = arg0.getRange(), bbox = range.getBBox0(), box = {r1: 0, r2: 0, c1: 0, c2: 0}, ref;

			box.r1 = bbox.r1 + arg1;
			box.c1 = bbox.c1 + arg2;
			box.r2 = bbox.r1 + arg1 + arg3 - 1;
			box.c2 = bbox.c1 + arg2 + arg4 - 1;

			if (!validBBOX(box)) {
				return this.value = new cError(cErrorType.bad_reference);
			}

			if (box.r1 == box.r2 && box.c1 == box.c2) {
				ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1);
				this.value = (cElementType.cell === arg0.type) ? new cRef(ref, arg0.ws) : new cRef3D(ref, arg0.ws);
			} else {
				ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1) + ":" +
					g_oCellAddressUtils.colnumToColstrFromWsView(box.c2 + 1) + _getRowTitle(box.r2);
				this.value =
					(cElementType.cell === arg0.type) ? new cArea(ref, arg0.ws) : new cArea3D(ref, arg0.ws, arg0.ws);
			}

		} else if (cElementType.cellsRange === arg0.type) {

			var bbox = arg0.getBBox0(), box = {r1: 0, r2: 0, c1: 0, c2: 0}, ref;

			box.r1 = bbox.r1 + arg1;
			box.c1 = bbox.c1 + arg2;
			box.r2 = bbox.r1 + arg1 + arg3 - 1;
			box.c2 = bbox.c1 + arg2 + arg4 - 1;

			if (!validBBOX(box)) {
				return this.value = new cError(cErrorType.bad_reference);
			}
			if (box.r1 == box.r2 && box.c1 == box.c2) {
				ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1);
				this.value = new cRef(ref, arg0.ws);
			} else {
				ref = g_oCellAddressUtils.colnumToColstrFromWsView(box.c1 + 1) + _getRowTitle(box.r1) + ":" +
					g_oCellAddressUtils.colnumToColstrFromWsView(box.c2 + 1) + _getRowTitle(box.r2);
				this.value = new cArea(ref, arg0.ws);
			}
		} else {
			this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value;

	};
	cOFFSET.prototype.getInfo = function () {
		return {
			name: this.name, args: "( reference , rows , cols [ , [ height ] [ , [ width ] ] ] )"
		};
	};

	/** @constructor */
	function cROW() {
		this.name = "ROW";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 0;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cROW.prototype = Object.create(cBaseFunction.prototype);
	cROW.prototype.Calculate = function (arg) {
		var arg0;
		if (this.argumentsCurrent == 0) {
			arg0 = arguments[1];
			return this.value = new cNumber(arg0.bbox.r1 + 1);
		}
		arg0 = arg[0];
		var range;
		if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type ||
			cElementType.cellsRange === arg0.type || cElementType.cellsRange3D === arg0.type) {
			range = arg0.getRange();
		}
		return this.value = (range ? new cNumber(range.bbox.r1 + 1) : new cError(cErrorType.bad_reference));
	};
	cROW.prototype.getInfo = function () {
		return {
			name: this.name, args: "( [ reference ] )"
		};
	};

	/** @constructor */
	function cROWS() {
		this.name = "ROWS";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cROWS.prototype = Object.create(cBaseFunction.prototype);
	cROWS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		var range;
		if (cElementType.array === arg0.type) {
			return this.value = new cNumber(arg0.getRowCount());
		} else if (cElementType.cellsRange === arg0.type || cElementType.cell === arg0.type ||
			cElementType.cell3D === arg0.type || cElementType.cellsRange3D === arg0.type) {
			range = arg0.getRange();
		}
		return this.value = (range ? new cNumber(Math.abs(range.getBBox0().r1 - range.getBBox0().r2) + 1) :
			new cError(cErrorType.wrong_value_type));
	};
	cROWS.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array )"
		};
	};

	/** @constructor */
	function cRTD() {
		cBaseFunction.call(this, "RTD");
	}

	cRTD.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cTRANSPOSE() {
		this.name = "TRANSPOSE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.noneFormat;
	}

	cTRANSPOSE.prototype = Object.create(cBaseFunction.prototype);
	cTRANSPOSE.prototype.Calculate = function (arg) {

		function TransposeMatrix(A) {

			var tMatrix = [], res = new cArray();

			for (var i = 0; i < A.length; i++) {
				for (var j = 0; j < A[i].length; j++) {
					if (!tMatrix[j]) {
						tMatrix[j] = [];
					}
					tMatrix[j][i] = A[i][j];
				}
			}

			res.fillFromArray(tMatrix);

			return res;
		}

		var arg0 = arg[0];
		if (cElementType.cellsRange === arg0.type || cElementType.array === arg0.type) {
			arg0 = arg0.getMatrix();
		} else if (cElementType.cell === arg0.type || cElementType.cell3D === arg0.type) {
			return this.value = arg0.getValue();
		} else if (cElementType.number === arg0.type || cElementType.string === arg0.type || cElementType.bool === arg0.type || cElementType.error === arg0.type) {
			return this.value = arg0;
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		return this.value = TransposeMatrix(arg0);
	};
	cTRANSPOSE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array )"
		};
	};

	/** @constructor */
	function VHLOOKUPCache(bHor) {
		this.cacheId = {};
		this.cacheRanges = {};
		this.bHor = bHor;
	}

	VHLOOKUPCache.prototype.get = function (range, valueForSearching, arg3Value) {
		var res, _this = this, wsId = range.getWorksheet().getId(), sRangeName = wsId + g_cCharDelimiter +
			range.getName(), cacheElem = this.cacheId[sRangeName];
		if (null == cacheElem) {
			cacheElem = {elements: [], results: {}};
			range._foreachNoEmpty(function (cell, r, c) {
				var v = cell.getValueWithoutFormat();
				cacheElem.elements.push({v: v, i: (_this.bHor ? c : r)});
			});
			this.cacheId[sRangeName] = cacheElem;
			var cacheRange = this.cacheRanges[wsId];
			if (null == cacheRange) {
				cacheRange = new AscCommonExcel.RangeDataManager(null);
				this.cacheRanges[wsId] = cacheRange;
			}
			cacheRange.add(range.getBBox0(), cacheElem);
		}
		var sInputKey = valueForSearching + g_cCharDelimiter + arg3Value;
		res = cacheElem.results[sInputKey];
		if (null == res) {
			res = this._calculate(cacheElem.elements, valueForSearching, arg3Value);
			cacheElem.results[sInputKey] = res;
		}
		return res;
	};
	VHLOOKUPCache.prototype._calculate = function (cacheArray, valueForSearching, lookup) {
		var res = -1, i = 0, j, length = cacheArray.length, k, elem, val;

		if ('' === valueForSearching && 0 !== length) {
			return cacheArray[0].i;
		}
		if (lookup) {
			j = length - 1;
			while (i <= j) {
				k = Math.floor((i + j) / 2);
				elem = cacheArray[k];
				val = elem.v;
				if (valueForSearching == val) {
					return elem.i;
				} else if (valueForSearching < val) {
					j = k - 1;
				} else {
					i = k + 1;
				}
			}
			res = Math.min(i, j);
			res = -1 === res ? res : cacheArray[res].i;
		} else {
			// Exact value
			for (; i < length; i++) {
				elem = cacheArray[i];
				val = elem.v;
				if (valueForSearching == val) {
					return elem.i;
				}
			}
		}
		return res;
	};
	VHLOOKUPCache.prototype.remove = function (cell) {
		var wsId = cell.ws.getId();
		var cacheRange = this.cacheRanges[wsId];
		if (null != cacheRange) {
			var oGetRes = cacheRange.get(new Asc.Range(cell.nCol, cell.nRow, cell.nCol, cell.nRow));
			for (var i = 0, length = oGetRes.all.length; i < length; ++i) {
				var elem = oGetRes.all[i];
				elem.data.results = {};
			}
		}
	};
	VHLOOKUPCache.prototype.clean = function () {
		this.cacheId = {};
		this.cacheRanges = {};
	};

	/** @constructor */
	function cVLOOKUP() {
		this.name = "VLOOKUP";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
		this.formatType = {
			def: -1, //подразумевается формат первой ячейки входящей в формулу.
			noneFormat: -2
		};
		this.numFormat = this.formatType.def;
	}

	cVLOOKUP.prototype = Object.create(cBaseFunction.prototype);
	cVLOOKUP.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
		var arg3 = this.argumentsCurrent == 4 ? arg[3].tocBool().value : true;
		var numberCol = arg2.getValue() - 1, valueForSearching, resR = -1, min, regexp;

		if (isNaN(numberCol)) {
			return this.value = new cError(cErrorType.bad_reference);
		}

		if (numberCol < 0) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cell3D === arg0.type || cElementType.cell === arg0.type) {
			arg0 = arg0.getValue();
		}

		if (cElementType.error === arg0.type) {
			return this.value = arg0;
		} else {
			valueForSearching = arg0.getValue();
		}

		var found = false;
		if (cElementType.array === arg1.type) {
			// ToDo
			if (cElementType.string === arg0.type) {
				regexp = searchRegExp(valueForSearching);
			}
			arg1.foreach(function (elem, r) {
				if (r == 0) {
					min = elem.getValue();
				}

				if (arg3) {
					if (valueForSearching == elem.getValue()) {
						resR = r;
						found = true;
					} else if (valueForSearching > elem.getValue() && !found) {
						resR = r;
					}
				} else {
					if (cElementType.string === arg0.type) {
						if (regexp.test(elem.getValue())) {
							resR = r;
						}
					} else if (valueForSearching == elem.getValue()) {
						resR = r;
					}
				}

				min = Math.min(min, elem.getValue());
			});

			if (min > valueForSearching) {
				return this.value = new cError(cErrorType.not_available);
			}

			if (resR == -1) {
				return this.value = new cError(cErrorType.not_available);
			}

			if (numberCol > arg1.getCountElementInRow() - 1) {
				return this.value = new cError(cErrorType.bad_reference);
			}

			return this.value = arg1.getElementRowCol(resR, numberCol);
		}

		var range;
		if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type ||
			cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			range = arg1.getRange();
		}
		if (!range) {
			return this.value = new cError(cErrorType.bad_reference);
		}

		var bb = range.getBBox0();
		if (numberCol > bb.c2 - bb.c1) {
			return this.value = new cError(cErrorType.bad_reference);
		}
		var ws = arg1.getWS();
		var oSearchRange = ws.getRange3(bb.r1, bb.c1, bb.r2, bb.c1);

		resR = g_oVLOOKUPCache.get(oSearchRange, valueForSearching, arg3);
		if (-1 === resR) {
			return this.value = new cError(cErrorType.not_available);
		}

		var v = arg1.getWS()._getCellNoEmpty(resR, bb.c1 + numberCol);
		return this.value = checkTypeCell(v);
	};
	cVLOOKUP.prototype.getInfo = function () {
		return {
			name: this.name, args: "( lookup-value  ,  table-array  ,  col-index-num  [  ,  [  range-lookup-flag  ] ] )"
		};
	};

	var g_oVLOOKUPCache = new VHLOOKUPCache(false);
	var g_oHLOOKUPCache = new VHLOOKUPCache(true);

//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].g_oVLOOKUPCache = g_oVLOOKUPCache;
	window['AscCommonExcel'].g_oHLOOKUPCache = g_oHLOOKUPCache;
})(window);
