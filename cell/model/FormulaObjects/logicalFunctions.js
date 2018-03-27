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
	var cErrorType = AscCommonExcel.cErrorType;
	var cNumber = AscCommonExcel.cNumber;
	var cString = AscCommonExcel.cString;
	var cBool = AscCommonExcel.cBool;
	var cError = AscCommonExcel.cError;
	var cArea = AscCommonExcel.cArea;
	var cArea3D = AscCommonExcel.cArea3D;
	var cEmpty = AscCommonExcel.cEmpty;
	var cArray = AscCommonExcel.cArray;
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;
	var cElementType = AscCommonExcel.cElementType;

	cFormulaFunctionGroup['Logical'] = cFormulaFunctionGroup['Logical'] || [];
	cFormulaFunctionGroup['Logical'].push(cAND, cFALSE, cIF, cIFERROR, cIFNA, cIFS, cNOT, cOR, cSWITCH, cTRUE, cXOR);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAND() {
	}

	cAND.prototype = Object.create(cBaseFunction.prototype);
	cAND.prototype.constructor = cAND;
	cAND.prototype.name = 'AND';
	cAND.prototype.argumentsMin = 1;
	cAND.prototype.Calculate = function (arg) {
		var argResult = null;
		for (var i = 0; i < arg.length; i++) {
			if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
				var argArr = arg[i].getValue();
				for (var j = 0; j < argArr.length; j++) {
					if (argArr[j] instanceof cError) {
						return argArr[j];
					} else if (!(argArr[j] instanceof cString || argArr[j] instanceof cEmpty)) {
						if (argResult === null) {
							argResult = argArr[j].tocBool();
						} else {
							argResult = new cBool(argResult.value && argArr[j].tocBool().value);
						}
						if (argResult.value === false) {
							return new cBool(false);
						}
					}
				}
			} else {
				if (arg[i] instanceof cString) {
					return new cError(cErrorType.wrong_value_type);
				} else if (arg[i] instanceof cError) {
					return arg[i];
				} else if (arg[i] instanceof cArray) {
					arg[i].foreach(function (elem) {
						if (elem instanceof cError) {
							argResult = elem;
							return true;
						} else if (elem instanceof cString || elem instanceof cEmpty) {
							return false;
						} else {
							if (argResult === null) {
								argResult = elem.tocBool();
							} else {
								argResult = new cBool(argResult.value && elem.tocBool().value);
							}
							if (argResult.value === false) {
								return true;
							}
						}
					});
				} else {
					if (argResult === null) {
						argResult = arg[i].tocBool();
					} else {
						argResult = new cBool(argResult.value && arg[i].tocBool().value);
					}
					if (argResult.value === false) {
						return new cBool(false);
					}
				}
			}
		}
		if (argResult === null) {
			return new cError(cErrorType.wrong_value_type);
		}
		return argResult;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFALSE() {
	}

	cFALSE.prototype = Object.create(cBaseFunction.prototype);
	cFALSE.prototype.constructor = cFALSE;
	cFALSE.prototype.name = 'FALSE';
	cFALSE.prototype.argumentsMax = 0;
	cFALSE.prototype.Calculate = function () {
		return new cBool(false);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIF() {
	}

	cIF.prototype = Object.create(cBaseFunction.prototype);
	cIF.prototype.constructor = cIF;
	cIF.prototype.name = 'IF';
	cIF.prototype.argumentsMin = 1;
	cIF.prototype.argumentsMax = 3;
	cIF.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}
		if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocBool();
		if (arg0 instanceof cError) {
			return arg0;
		} else if (arg0 instanceof cString) {
			return new cError(cErrorType.wrong_value_type);
		} else if (arg0.value) {
			return arg1 ? arg1 instanceof cEmpty ? new cNumber(0) : arg1 : new cBool(true);
		} else {
			return arg2 ? arg2 instanceof cEmpty ? new cNumber(0) : arg2 : new cBool(false);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIFERROR() {
	}

	cIFERROR.prototype = Object.create(cBaseFunction.prototype);
	cIFERROR.prototype.constructor = cIFERROR;
	cIFERROR.prototype.name = 'IFERROR';
	cIFERROR.prototype.argumentsMin = 2;
	cIFERROR.prototype.argumentsMax = 2;
	cIFERROR.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		if (arg0 instanceof AscCommonExcel.cRef || arg0 instanceof AscCommonExcel.cRef3D) {
			arg0 = arg0.getValue();
		}
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		if (arg0 instanceof cError) {
			return arg[1] instanceof cArray ? arg[1].getElement(0) : arg[1];
		} else {
			return arg[0];
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIFNA() {
	}

	cIFNA.prototype = Object.create(cBaseFunction.prototype);
	cIFNA.prototype.constructor = cIFNA;
	cIFNA.prototype.name = 'IFNA';
	cIFNA.prototype.argumentsMin = 2;
	cIFNA.prototype.argumentsMax = 2;
	cIFNA.prototype.isXLFN = true;
	cIFNA.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		if (arg0 instanceof AscCommonExcel.cRef || arg0 instanceof AscCommonExcel.cRef3D) {
			arg0 = arg0.getValue();
		}
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		if (arg0 instanceof cError && cErrorType.not_available === arg0.errorType) {
			return arg[1] instanceof cArray ? arg[1].getElement(0) : arg[1];
		} else {
			return arg[0];
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIFS() {
	}

	cIFS.prototype = Object.create(cBaseFunction.prototype);
	cIFS.prototype.constructor = cIFS;
	cIFS.prototype.name = 'IFS';
	cIFS.prototype.argumentsMin = 2;
	cIFS.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var res = null;
		for (var i = 0; i < arg.length; i++) {
			var argN = argClone[i];
			if (cElementType.string === argN.type) {
				res = new cError(cErrorType.wrong_value_type);
				break;
			} else if (cElementType.number === argN.type || cElementType.bool === argN.type) {
				if (!argClone[i + 1]) {
					res = new cError(cErrorType.not_available);
					break;
				}

				argN = argN.tocBool();
				if (true === argN.value) {
					res = argClone[i + 1];
					break;
				}
			}
			if (i === arg.length - 1) {
				res = new cError(cErrorType.not_available);
				break;
			}
			i++;
		}

		if (null === res) {
			return new cError(cErrorType.not_available);
		}

		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNOT() {
	}

	cNOT.prototype = Object.create(cBaseFunction.prototype);
	cNOT.prototype.constructor = cNOT;
	cNOT.prototype.name = 'NOT';
	cNOT.prototype.argumentsMin = 1;
	cNOT.prototype.argumentsMax = 1;
	cNOT.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}

		if (arg0 instanceof cString) {
			var res = arg0.tocBool();
			if (res instanceof cString) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				return new cBool(!res.value);
			}
		} else if (arg0 instanceof cError) {
			return arg0;
		} else {
			return new cBool(!arg0.tocBool().value);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cOR() {
	}

	cOR.prototype = Object.create(cBaseFunction.prototype);
	cOR.prototype.constructor = cOR;
	cOR.prototype.name = 'OR';
	cOR.prototype.argumentsMin = 1;
	cOR.prototype.Calculate = function (arg) {
		var argResult = null;
		for (var i = 0; i < arg.length; i++) {
			if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
				var argArr = arg[i].getValue();
				for (var j = 0; j < argArr.length; j++) {
					if (argArr[j] instanceof cError) {
						return argArr[j];
					} else if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) {
						if (argResult === null) {
							argResult = argArr[j].tocBool();
						} else {
							argResult = new cBool(argResult.value || argArr[j].tocBool().value);
						}
						if (argResult.value === true) {
							return new cBool(true);
						}
					}
				}
			} else {
				if (arg[i] instanceof cString) {
					return new cError(cErrorType.wrong_value_type);
				} else if (arg[i] instanceof cError) {
					return arg[i];
				} else if (arg[i] instanceof cArray) {
					arg[i].foreach(function (elem) {
						if (elem instanceof cError) {
							argResult = elem;
							return true;
						} else if (elem instanceof cString || elem instanceof cEmpty) {
							return false;
						} else {
							if (argResult === null) {
								argResult = elem.tocBool();
							} else {
								argResult = new cBool(argResult.value || elem.tocBool().value);
							}
						}
					})
				} else {
					if (argResult == null) {
						argResult = arg[i].tocBool();
					} else {
						argResult = new cBool(argResult.value || arg[i].tocBool().value);
					}
					if (argResult.value === true) {
						return new cBool(true);
					}
				}
			}
		}
		if (argResult == null) {
			return new cError(cErrorType.wrong_value_type);
		}
		return argResult;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSWITCH() {
	}

	cSWITCH.prototype = Object.create(cBaseFunction.prototype);
	cSWITCH.prototype.constructor = cSWITCH;
	cSWITCH.prototype.name = 'SWITCH';
	cSWITCH.prototype.argumentsMin = 3;
	cSWITCH.prototype.argumentsMax = 126;
	cSWITCH.prototype.isXLFN = true;
	cSWITCH.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var arg0 = argClone[0].getValue();
		if (cElementType.cell === argClone[0].type || cElementType.cell3D === argClone[0].type) {
			arg0 = arg0.getValue()
		}

		var res = null;
		for (var i = 1; i < argClone.length; i++) {
			var argN = argClone[i].getValue();
			if (arg0 === argN) {
				if (!argClone[i + 1]) {
					return cErrorType.not_available;
				} else {
					res = argClone[i + 1];
					break;
				}
			}
			if (i === argClone.length - 1) {
				res = argClone[i];
			}
			i++;
		}

		if (null === res) {
			return new cError(cErrorType.not_available);
		}

		return res;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTRUE() {
	}

	cTRUE.prototype = Object.create(cBaseFunction.prototype);
	cTRUE.prototype.constructor = cTRUE;
	cTRUE.prototype.name = 'TRUE';
	cTRUE.prototype.argumentsMax = 0;
	cTRUE.prototype.Calculate = function () {
		return new cBool(true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cXOR() {
	}

	cXOR.prototype = Object.create(cBaseFunction.prototype);
	cXOR.prototype.constructor = cXOR;
	cXOR.prototype.name = 'XOR';
	cXOR.prototype.argumentsMin = 1;
	cXOR.prototype.argumentsMax = 254;
	cXOR.prototype.isXLFN = true;
	cXOR.prototype.Calculate = function (arg) {
		var argResult = null;
		var nTrueValues = 0;
		for (var i = 0; i < arg.length; i++) {
			if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
				var argArr = arg[i].getValue();
				for (var j = 0; j < argArr.length; j++) {
					if (argArr[j] instanceof cError) {
						return argArr[j];
					} else if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) {
						if (argResult === null) {
							argResult = argArr[j].tocBool();
						} else {
							argResult = new cBool(argResult.value || argArr[j].tocBool().value);
						}
					}
					if (argResult.value === true) {
						nTrueValues++;
					}
				}
			} else {
				if (arg[i] instanceof cString) {
					return new cError(cErrorType.wrong_value_type);
				} else if (arg[i] instanceof cError) {
					return arg[i];
				} else if (arg[i] instanceof cArray) {
					arg[i].foreach(function (elem) {
						if (elem instanceof cError) {
							argResult = elem;
							return true;
						} else if (elem instanceof cString || elem instanceof cEmpty) {
							return false;
						} else {
							if (argResult === null) {
								argResult = elem.tocBool();
							} else {
								argResult = new cBool(elem.tocBool().value);
							}
						}

						if (argResult.value === true) {
							nTrueValues++;
						}
					})
				} else {
					if (argResult == null) {
						argResult = arg[i].tocBool();
					} else {
						argResult = new cBool(arg[i].tocBool().value);
					}

					if (argResult.value === true) {
						nTrueValues++;
					}
				}
			}
		}
		if (argResult == null) {
			return new cError(cErrorType.wrong_value_type);
		} else {
			if (nTrueValues % 2) {
				argResult = new cBool(true);
			} else {
				argResult = new cBool(false);
			}
		}

		return argResult;
	};
})(window);
