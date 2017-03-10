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
	var fSortAscending = AscCommon.fSortAscending;

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
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	var _func = AscCommonExcel._func;
	var matching = AscCommonExcel.matching;

	var maxGammaArgument = 171.624376956302;

	cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
	cFormulaFunctionGroup['Statistical'].push(cAVEDEV, cAVERAGE, cAVERAGEA, cAVERAGEIF, cAVERAGEIFS, cBETADIST,
		cBETAINV, cBINOMDIST, cCHIDIST, cCHIINV, cCHITEST, cCONFIDENCE, cCORREL, cCOUNT, cCOUNTA, cCOUNTBLANK, cCOUNTIF,
		cCOUNTIFS, cCOVAR, cCRITBINOM, cDEVSQ, cEXPONDIST, cFDIST, cFINV, cFISHER, cFISHERINV, cFORECAST, cFREQUENCY,
		cFTEST, cGAMMADIST, cGAMMAINV, cGAMMALN, cGEOMEAN, cGROWTH, cHARMEAN, cHYPGEOMDIST, cINTERCEPT, cKURT, cLARGE,
		cLINEST, cLOGEST, cLOGINV, cLOGNORMDIST, cMAX, cMAXA, cMEDIAN, cMIN, cMINA, cMODE, cNEGBINOMDIST, cNORMDIST,
		cNORMINV, cNORMSDIST, cNORMSINV, cPEARSON, cPERCENTILE, cPERCENTRANK, cPERMUT, cPOISSON, cPROB, cQUARTILE,
		cRANK, cRSQ, cSKEW, cSLOPE, cSMALL, cSTANDARDIZE, cSTDEV, cSTDEVA, cSTDEVP, cSTDEVPA, cSTEYX, cTDIST, cTINV,
		cTREND, cTRIMMEAN, cTTEST, cVAR, cVARA, cVARP, cVARPA, cWEIBULL, cZTEST);

	function integralPhi(x) { // Using gauss(x)+0.5 has severe cancellation errors for x<-4
		return 0.5 * AscCommonExcel.rtl_math_erfc(-x * 0.7071067811865475); // * 1/sqrt(2)
	}

	function phi(x) {
		return 0.39894228040143268 * Math.exp(-(x * x) / 2);
	}

	function gauss(x) {
		var t0 = [0.39894228040143268, -0.06649038006690545, 0.00997355701003582, -0.00118732821548045,
			0.00011543468761616, -0.00000944465625950, 0.00000066596935163, -0.00000004122667415, 0.00000000227352982,
			0.00000000011301172, 0.00000000000511243, -0.00000000000021218], t2 = [0.47724986805182079,
			0.05399096651318805, -0.05399096651318805, 0.02699548325659403, -0.00449924720943234, -0.00224962360471617,
			0.00134977416282970, -0.00011783742691370, -0.00011515930357476, 0.00003704737285544, 0.00000282690796889,
			-0.00000354513195524, 0.00000037669563126, 0.00000019202407921, -0.00000005226908590, -0.00000000491799345,
			0.00000000366377919, -0.00000000015981997, -0.00000000017381238, 0.00000000002624031, 0.00000000000560919,
			-0.00000000000172127, -0.00000000000008634, 0.00000000000007894], t4 = [0.49996832875816688,
			0.00013383022576489, -0.00026766045152977, 0.00033457556441221, -0.00028996548915725, 0.00018178605666397,
			-0.00008252863922168, 0.00002551802519049, -0.00000391665839292, -0.00000074018205222, 0.00000064422023359,
			-0.00000017370155340, 0.00000000909595465, 0.00000000944943118, -0.00000000329957075, 0.00000000029492075,
			0.00000000011874477, -0.00000000004420396, 0.00000000000361422, 0.00000000000143638, -0.00000000000045848];
		var asympt = [-1, 1, -3, 15, -105], xabs = Math.abs(x), xshort = Math.floor(xabs), nval = 0;
		if (xshort == 0) {
			nval = taylor(t0, 11, (xabs * xabs)) * xabs;
		} else if ((xshort >= 1) && (xshort <= 2)) {
			nval = taylor(t2, 23, (xabs - 2));
		} else if ((xshort >= 3) && (xshort <= 4)) {
			nval = taylor(t4, 20, (xabs - 4));
		} else {
			nval = 0.5 + phi(xabs) * taylor(asympt, 4, 1 / (xabs * xabs)) / xabs;
		}
		if (x < 0) {
			return -nval;
		} else {
			return nval;
		}
	}

	function taylor(pPolynom, nMax, x) {
		var nVal = pPolynom[nMax];
		for (var i = nMax - 1; i >= 0; i--) {
			nVal = pPolynom[i] + (nVal * x);
		}
		return nVal;
	}

	function gaussinv(x) {
		var q, t, z;

		q = x - 0.5;

		if (Math.abs(q) <= .425) {
			t = 0.180625 - q * q;
			z = q * (
					(
						(
							(
								(
									(
										(
											t * 2509.0809287301226727 + 33430.575583588128105
										) * t + 67265.770927008700853
									) * t + 45921.953931549871457
								) * t + 13731.693765509461125
							) * t + 1971.5909503065514427
						) * t + 133.14166789178437745
					) * t + 3.387132872796366608
				) / (
					(
						(
							(
								(
									(
										(
											t * 5226.495278852854561 + 28729.085735721942674
										) * t + 39307.89580009271061
									) * t + 21213.794301586595867
								) * t + 5394.1960214247511077
							) * t + 687.1870074920579083
						) * t + 42.313330701600911252
					) * t + 1
				);
		} else {
			if (q > 0) {
				t = 1 - x;
			} else {
				t = x;
			}

			t = Math.sqrt(-Math.log(t));

			if (t <= 5) {
				t += -1.6;
				z = (
						(
							(
								(
									(
										(
											(
												t * 7.7454501427834140764e-4 + 0.0227238449892691845833
											) * t + 0.24178072517745061177
										) * t + 1.27045825245236838258
									) * t + 3.64784832476320460504
								) * t + 5.7694972214606914055
							) * t + 4.6303378461565452959
						) * t + 1.42343711074968357734
					) / (
						(
							(
								(
									(
										(
											(
												t * 1.05075007164441684324e-9 + 5.475938084995344946e-4
											) * t + 0.0151986665636164571966
										) * t + 0.14810397642748007459
									) * t + 0.68976733498510000455
								) * t + 1.6763848301838038494
							) * t + 2.05319162663775882187
						) * t + 1
					);
			} else {
				t += -5;
				z = (
						(
							(
								(
									(
										(
											(
												t * 2.01033439929228813265e-7 + 2.71155556874348757815e-5
											) * t + 0.0012426609473880784386
										) * t + 0.026532189526576123093
									) * t + 0.29656057182850489123
								) * t + 1.7848265399172913358
							) * t + 5.4637849111641143699
						) * t + 6.6579046435011037772
					) / (
						(
							(
								(
									(
										(
											(
												t * 2.04426310338993978564e-15 + 1.4215117583164458887e-7
											) * t + 1.8463183175100546818e-5
										) * t + 7.868691311456132591e-4
									) * t + 0.0148753612908506148525
								) * t + 0.13692988092273580531
							) * t + 0.59983220655588793769
						) * t + 1
					);
			}

			if (q < 0) {
				z = -z;
			}
		}

		return z;
	}

	function getLanczosSum(fZ) {
		var num = [23531376880.41075968857200767445163675473, 42919803642.64909876895789904700198885093,
			35711959237.35566804944018545154716670596, 17921034426.03720969991975575445893111267,
			6039542586.35202800506429164430729792107, 1439720407.311721673663223072794912393972,
			248874557.8620541565114603864132294232163, 31426415.58540019438061423162831820536287,
			2876370.628935372441225409051620849613599, 186056.2653952234950402949897160456992822,
			8071.672002365816210638002902272250613822, 210.8242777515793458725097339207133627117,
			2.506628274631000270164908177133837338626], denom = [0, 39916800, 120543840, 150917976, 105258076, 45995730,
			13339535, 2637558, 357423, 32670, 1925, 66, 1];
		// Horner scheme
		var sumNum, sumDenom, i, zInv;
		if (fZ <= 1) {
			sumNum = num[12];
			sumDenom = denom[12];
			for (i = 11; i >= 0; --i) {
				sumNum *= fZ;
				sumNum += num[i];
				sumDenom *= fZ;
				sumDenom += denom[i];
			}
		} else
		// Cancel down with fZ^12; Horner scheme with reverse coefficients
		{
			zInv = 1 / fZ;
			sumNum = num[0];
			sumDenom = denom[0];
			for (i = 1; i <= 12; ++i) {
				sumNum *= zInv;
				sumNum += num[i];
				sumDenom *= zInv;
				sumDenom += denom[i];
			}
		}
		return sumNum / sumDenom;
	}

	/** You must ensure fZ>0; fZ>171.624376956302 will overflow. */
	function getGammaHelper(fZ) {
		var gamma = getLanczosSum(fZ), fg = 6.024680040776729583740234375, zgHelp = fZ + fg - 0.5;
		// avoid intermediate overflow
		var halfpower = Math.pow(zgHelp, fZ / 2 - 0.25);
		gamma *= halfpower;
		gamma /= Math.exp(zgHelp);
		gamma *= halfpower;
		if (fZ <= 20 && fZ == Math.floor(fZ)) {
			gamma = Math.round(gamma);
		}
		return gamma;
	}

	/** You must ensure fZ>0 */
	function getLogGammaHelper(fZ) {
		var _fg = 6.024680040776729583740234375, zgHelp = fZ + _fg - 0.5;
		return Math.log(getLanczosSum(fZ)) + (fZ - 0.5) * Math.log(zgHelp) - zgHelp;
	}

	function getLogGamma(fZ) {
		if (fZ >= maxGammaArgument) {
			return getLogGammaHelper(fZ);
		}
		if (fZ >= 0) {
			return Math.log(getGammaHelper(fZ));
		}
		if (fZ >= 0.5) {
			return Math.log(getGammaHelper(fZ + 1) / fZ);
		}
		return getLogGammaHelper(fZ + 2) - Math.log(fZ + 1) - Math.log(fZ);
	}

	function getPercentile(values, alpha) {
		values.sort(fSortAscending);

		var nSize = values.length;
		if (nSize === 0) {
			return new cError(cErrorType.not_available);
		} else {
			if (nSize === 1) {
				return new cNumber(values[0]);
			} else {
				var nIndex = Math.floor(alpha * (nSize - 1));
				var fDiff = alpha * (nSize - 1) - Math.floor(alpha * (nSize - 1));
				if (fDiff == 0.0) {
					return new cNumber(values[nIndex]);
				} else {
					return new cNumber(values[nIndex] + fDiff * (values[nIndex + 1] - values[nIndex]));
				}
			}
		}
	}

	/** @constructor */
	function cAVEDEV() {
		this.name = "AVEDEV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cAVEDEV.prototype = Object.create(cBaseFunction.prototype);
	cAVEDEV.prototype.Calculate = function (arg) {
		var count = 0, sum = new cNumber(0), arrX = [], i;
		for (i = 0; i < arg.length; i++) {
			var _arg = arg[i];
			if (_arg instanceof cRef || _arg instanceof cRef3D) {
				var _argV = _arg.getValue();
				if (_argV instanceof cNumber) {
					arrX.push(_argV);
					count++;
				}
			} else if (_arg instanceof cArea || _arg instanceof cArea3D) {
				var _argAreaValue = _arg.getValue();
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j];
					if (__arg instanceof cNumber) {
						arrX.push(__arg);
						count++;
					}
				}
			} else if (_arg instanceof cArray) {
				_arg.foreach(function (elem) {
					var e = elem.tocNumber();
					if (e instanceof cNumber) {
						arrX.push(e);
						count++;
					}
				})
			} else {
				if (_arg instanceof cError) {
					continue;
				}
				arrX.push(_arg);
				count++;
			}
		}

		for (i = 0; i < arrX.length; i++) {
			sum = _func[sum.type][arrX[i].type](sum, arrX[i], "+");
		}
		sum = new cNumber(sum.getValue() / count);
		var a = 0;
		for (i = 0; i < arrX.length; i++) {
			a += Math.abs(_func[sum.type][arrX[i].type](sum, arrX[i], "-").getValue());
		}

		return this.value = new cNumber(a / count);
	};
	cAVEDEV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cAVERAGE() {
		this.name = "AVERAGE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cAVERAGE.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGE.prototype.Calculate = function (arg) {
		var count = 0, sum = new cNumber(0);
		for (var i = 0; i < arg.length; i++) {
			var _arg = arg[i];
			if (cElementType.cell === _arg.type || cElementType.cell3D === _arg.type) {
				if (!this.checkExclude || !_arg.isHidden(this.excludeHiddenRows)) {
					var _argV = _arg.getValue();
					if (cElementType.string === _argV.type || cElementType.empty === _argV.type ||
						cElementType.bool === _argV.type) {
						continue;
					} else if (cElementType.number === _argV.type) {
						sum = _func[sum.type][_argV.type](sum, _argV, "+");
						count++;
					} else if (cElementType.error === _argV.type) {
						return this.value = _argV;
					}
				}
			} else if (cElementType.cellsRange === _arg.type || cElementType.cellsRange3D === _arg.type) {
				var _argAreaValue = _arg.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j];
					if (cElementType.string === __arg.type || cElementType.empty === __arg.type ||
						cElementType.bool === __arg.type) {
						continue;
					} else if (cElementType.number === __arg.type) {
						sum = _func[sum.type][__arg.type](sum, __arg, "+");
						count++;
					} else if (cElementType.error === __arg.type) {
						return this.value = __arg;
					}
				}
			} else if (cElementType.array === _arg.type) {
				_arg.foreach(function (elem) {
					if (cElementType.string === elem.type || cElementType.empty === elem.type ||
						cElementType.bool === elem.type) {
						return false;
					}
					var e = elem.tocNumber();
					if (cElementType.number === e.type) {
						sum = _func[sum.type][e.type](sum, e, "+");
						count++;
					}
				})
			} else {
				_arg = _arg.tocNumber();
				if (cElementType.error === _arg.type) {
					return this.value = _arg;
				}
				sum = _func[sum.type][_arg.type](sum, _arg, "+");
				count++;
			}
		}
		return this.value = new cNumber(sum.getValue() / count);
	};
	cAVERAGE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cAVERAGEA() {
		this.name = "AVERAGEA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cAVERAGEA.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEA.prototype.Calculate = function (arg) {
		var count = 0, sum = new cNumber(0);
		for (var i = 0; i < arg.length; i++) {
			var _arg = arg[i];
			if (cElementType.cell === _arg.type || cElementType.cell3D === _arg.type) {
				var _argV = _arg.getValue();
				if (cElementType.number === _argV.type || cElementType.bool === _argV.type) {
					sum = _func[sum.type][_argV.type](sum, _argV, "+");
					count++;
				} else if (cElementType.string === _argV.type) {
					count++;
				}
			} else if (cElementType.cellsRange === _arg.type || cElementType.cellsRange3D === _arg.type) {
				var _argAreaValue = _arg.getValue();
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j];
					if (cElementType.number === __arg.type || cElementType.bool === __arg.type) {
						sum = _func[sum.type][__arg.type](sum, __arg, "+");
						count++;
					} else if (cElementType.string === __arg.type) {
						count++;
					}
				}
			} else if (cElementType.array === _arg.type) {
				_arg.foreach(function (elem) {

					if (cElementType.string === elem.type || cElementType.empty === elem.type) {
						return false;
					}

					var e = elem.tocNumber();
					if (cElementType.number === e.type) {
						sum = _func[sum.type][e.type](sum, e, "+");
						count++;
					}
				})
			} else {
				_arg = _arg.tocNumber();
				if (cElementType.error === _arg.type) {
					return this.value = _arg;
				}
				sum = _func[sum.type][_arg.type](sum, _arg, "+");
				count++;
			}
		}
		return this.value = new cNumber(sum.getValue() / count);
	};
	cAVERAGEA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cAVERAGEIF() {
		this.name = "AVERAGEIF";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cAVERAGEIF.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _sum = 0, _count = 0, matchingInfo, ws;
		if ((cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type) ||
			(cElementType.cell !== arg2.type && cElementType.cell3D !== arg2.type &&
			cElementType.cellsRange !== arg2.type)) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg1 = arg1.tocString();

		if (cElementType.string !== arg1.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg1 = arg1.toString();
		var val;
		matchingInfo = AscCommonExcel.matchingValue(arg1.toString());
		if (cElementType.cellsRange === arg0.type) {
			ws = arg0.getWS();
			var tmpCellArg0 = arg0.getRange().getCells()[0], tmpCellArg2 = arg2.getRange(), offset, bbox, r2;
			arg0.foreach2(function (v, cell) {
				if (matching(v, matchingInfo)) {
					offset = cell.getOffset(tmpCellArg0);
					tmpCellArg2 = arg2.getRange();
					tmpCellArg2.setOffset(offset);
					bbox = tmpCellArg2.getBBox0();
					offset.offsetCol *= -1;
					offset.offsetRow *= -1;

					r2 = new cRef(ws.getRange3(bbox.r1, bbox.c1, bbox.r1, bbox.c1).getName(), ws);

					tmpCellArg2.setOffset(offset);

					if (cElementType.number === r2.getValue().type) {
						_sum += r2.getValue().getValue();
						_count++;
					}
				}
			})
		} else {
			val = arg0.getValue();
			if (matching(val, matchingInfo)) {
				var r = arg0.getRange();
				ws = arg0.getWS();
				var r1 = r.bbox.r1, c1 = arg2.getRange().bbox.c1;
				r = new cRef(ws.getRange3(r1, c1, r1, c1).getName(), ws);
				if (cElementType.number === r.getValue().type) {
					_sum += r.getValue().getValue();
					_count++;
				}
			}
		}

		if (_count == 0) {
			return new cError(cErrorType.division_by_zero);
		} else {
			return this.value = new cNumber(_sum / _count);
		}
	};
	cAVERAGEIF.prototype.getInfo = function () {
		return {
			name: this.name, args: "( cell-range, selection-criteria [ , average-range ] )"
		};
	};

	/** @constructor */
	function cAVERAGEIFS() {
		this.name = "AVERAGEIFS";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cAVERAGEIFS.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEIFS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		var arg0Matrix = arg0.getMatrix();
		var i, j, arg1, arg2, matchingInfo;
		for (var k = 1; k < arg.length; k += 2) {
			arg1 = arg[k];
			arg2 = arg[k + 1];

			if ((cElementType.cell !== arg1.type && cElementType.cell3D !== arg1.type &&
				cElementType.cellsRange !== arg1.type)) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

			if (cElementType.cellsRange === arg2.type || cElementType.cellsRange3D === arg2.type) {
				arg2 = arg2.cross(arguments[1].bbox);
			} else if (cElementType.array === arg2.type) {
				arg2 = arg2.getElementRowCol(0, 0);
			}

			arg2 = arg2.tocString();
			if (cElementType.string !== arg2.type) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
			matchingInfo = AscCommonExcel.matchingValue(arg2.toString());

			var arg1Matrix = arg1.getMatrix();
			if (arg0Matrix.length !== arg1Matrix.length) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return this.value = new cError(cErrorType.wrong_value_type);
				}
				for (j = 0; j < arg1Matrix[i].length; ++j) {
					if (arg0Matrix[i][j] && !AscCommonExcel.matching(arg1Matrix[i][j], matchingInfo)) {
						arg0Matrix[i][j] = null;
					}
				}
			}
		}

		var _sum = 0, _count = 0;
		var valMatrix0;
		for (i = 0; i < arg0Matrix.length; ++i) {
			for (j = 0; j < arg0Matrix[i].length; ++j) {
				if ((valMatrix0 = arg0Matrix[i][j]) && cElementType.number === valMatrix0.type) {
					_sum += valMatrix0.getValue();
					++_count;
				}
			}
		}


		if (0 === _count) {
			return new cError(cErrorType.division_by_zero);
		} else {
			return this.value = new cNumber(_sum / _count);
		}
	};
	cAVERAGEIFS.prototype.checkArguments = function () {
		return 1 === this.argumentsCurrent % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};
	cAVERAGEIFS.prototype.getInfo = function () {
		return {
			name: this.name, args: "(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)"
		};
	};

	/** @constructor */
	function cBETADIST() {/*Нет реализации в Google Docs*/
		cBaseFunction.call(this, "BETADIST");
	}

	cBETADIST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cBETAINV() {/*Нет реализации в Google Docs*/
		cBaseFunction.call(this, "BETAINV");
	}

	cBETAINV.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cBINOMDIST() {
		this.name = "BINOMDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 4;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
	}

	cBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cBINOMDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

		function binomdist(x, n, p) {
			x = parseInt(x);
			n = parseInt(n);
			return Math.binomCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
		}

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

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1].bbox);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
		arg3 = arg3.tocBool();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}
		if (arg3 instanceof cError) {
			return this.value = arg3;
		}


		if (arg0.getValue() < 0 || arg0.getValue() > arg1.getValue() || arg2.getValue() < 0 || arg2.getValue() > 1) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		if (arg3.toBool()) {
			var x = parseInt(arg0.getValue()), n = parseInt(arg1.getValue()), p = arg2.getValue(), bm = 0;
			for (var y = 0; y <= x; y++) {
				bm += binomdist(y, n, p);
			}
			return this.value = new cNumber(bm);
		} else {
			return this.value = new cNumber(binomdist(arg0.getValue(), arg1.getValue(), arg2.getValue()));
		}
	};
	cBINOMDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number-successes , number-trials , success-probability , cumulative-flag )"
		};
	};

	/** @constructor */
	function cCHIDIST() {
		cBaseFunction.call(this, "CHIDIST");
	}

	cCHIDIST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cCHIINV() {
		cBaseFunction.call(this, "CHIINV");
	}

	cCHIINV.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cCHITEST() {
		cBaseFunction.call(this, "CHITEST");
	}

	cCHITEST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cCONFIDENCE() {
		this.name = "CONFIDENCE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cCONFIDENCE.prototype = Object.create(cBaseFunction.prototype);
	cCONFIDENCE.prototype.Calculate = function (arg) {

		var alpha = arg[0], stdev_sigma = arg[1], size = arg[2];
		if (alpha instanceof cArea || alpha instanceof cArea3D) {
			alpha = alpha.cross(arguments[1].bbox);
		} else if (alpha instanceof cArray) {
			alpha = alpha.getElement(0);
		}

		if (stdev_sigma instanceof cArea || stdev_sigma instanceof cArea3D) {
			stdev_sigma = stdev_sigma.cross(arguments[1].bbox);
		} else if (stdev_sigma instanceof cArray) {
			stdev_sigma = stdev_sigma.getElement(0);
		}

		if (size instanceof cArea || size instanceof cArea3D) {
			size = size.cross(arguments[1].bbox);
		} else if (size instanceof cArray) {
			size = size.getElement(0);
		}

		alpha = alpha.tocNumber();
		stdev_sigma = stdev_sigma.tocNumber();
		size = size.tocNumber();

		if (alpha instanceof cError) {
			return this.value = alpha;
		}
		if (stdev_sigma instanceof cError) {
			return this.value = stdev_sigma;
		}
		if (size instanceof cError) {
			return this.value = size;
		}

		if (alpha.getValue() <= 0 || alpha.getValue() >= 1 || stdev_sigma.getValue <= 0 || size.getValue() < 1) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		return this.value =
			new cNumber(gaussinv(1.0 - alpha.getValue() / 2.0) * stdev_sigma.getValue() / Math.sqrt(size.getValue()));

	};
	cCONFIDENCE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( alpha , standard-dev , size )"
		};
	};

	/** @constructor */
	function cCORREL() {
		this.name = "CORREL";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cCORREL.prototype = Object.create(cBaseFunction.prototype);
	cCORREL.prototype.Calculate = function (arg) {

		function correl(x, y) {

			var s1 = 0, s2 = 0, s3 = 0, _x = 0, _y = 0, xLength = 0, i;
			if (x.length != y.length) {
				return new cError(cErrorType.not_available);
			}
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);
				s2 += (x[i].getValue() - _x) * (x[i].getValue() - _x);
				s3 += (y[i].getValue() - _y) * (y[i].getValue() - _y);

			}

			if (s2 == 0 || s3 == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(s1 / Math.sqrt(s2 * s3));
			}
		}

		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = correl(arr0, arr1);

	};
	cCORREL.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cCOUNT() {
		this.name = "COUNT";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cCOUNT.prototype = Object.create(cBaseFunction.prototype);
	cCOUNT.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNT.prototype.Calculate = function (arg) {
		var count = 0;
		for (var i = 0; i < arg.length; i++) {
			var _arg = arg[i];
			if (cElementType.cell === _arg.type || cElementType.cell3D === _arg.type) {
				if (!this.checkExclude || !_arg.isHidden(this.excludeHiddenRows)) {
					var _argV = _arg.getValue();
					if (cElementType.number === _argV.type) {
						count++;
					}
				}
			} else if (cElementType.cellsRange === _arg.type || cElementType.cellsRange3D === _arg.type) {
				var _argAreaValue = _arg.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < _argAreaValue.length; j++) {
					if (cElementType.number === _argAreaValue[j].type) {
						count++;
					}
				}
			} else if (cElementType.number === _arg.type || cElementType.bool === _arg.type ||
				cElementType.empty === _arg.type) {
				count++;
			} else if (cElementType.string === _arg.type) {
				if (cElementType.number === _arg.tocNumber().type) {
					count++;
				}
			} else if (cElementType.array === _arg.type) {
				_arg.foreach(function (elem) {
					if (cElementType.number === elem.tocNumber().type) {
						count++;
					}
				})
			}
		}
		return this.value = new cNumber(count);
	};
	cCOUNT.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cCOUNTA() {
		this.name = "COUNTA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cCOUNTA.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTA.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNTA.prototype.Calculate = function (arg) {
		var element, count = 0;
		for (var i = 0; i < arg.length; i++) {
			element = arg[i];
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var _argV = element.getValue();
					if (cElementType.empty !== _argV.type) {
						count++;
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _argAreaValue = element.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < _argAreaValue.length; j++) {
					if (cElementType.empty !== _argAreaValue[j].type) {
						count++;
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.empty !== elem.type) {
						count++;
					}
				})
			} else if (cElementType.empty !== element.type) {
				count++;
			}
		}
		return this.value = new cNumber(count);
	};
	cCOUNTA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cCOUNTBLANK() {
		this.name = "COUNTBLANK";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cCOUNTBLANK.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTBLANK.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNTBLANK.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			return this.value = arg0.countCells();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			return this.value = new cNumber(1);
		} else {
			return this.value = new cError(cErrorType.bad_reference);
		}
	};
	cCOUNTBLANK.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cCOUNTIF() {
		this.name = "COUNTIF";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cCOUNTIF.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], _count = 0, matchingInfo;
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type && cElementType.cellsRange !== arg0.type && cElementType.cellsRange3D !== arg0.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg1 = arg1.tocString();

		if (cElementType.string !== arg1.type) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		var val;
		matchingInfo = AscCommonExcel.matchingValue(arg1.toString());
		if (cElementType.cellsRange === arg0.type) {
			arg0.foreach2(function (_val) {
				_count += matching(_val, matchingInfo);
			})
		} else if (cElementType.cellsRange3D === arg0.type) {
			val = arg0.getValue();
			for (var i = 0; i < val.length; i++) {
				_count += matching(val[i], matchingInfo);
			}
		} else {
			val = arg0.getValue();
			_count += matching(val, matchingInfo);
		}

		return this.value = new cNumber(_count);
	};
	cCOUNTIF.prototype.getInfo = function () {
		return {
			name: this.name, args: "( cell-range, selection-criteria )"
		};
	};

	/** @constructor */
	function cCOUNTIFS() {
		this.name = "COUNTIFS";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 256;
	}

	cCOUNTIFS.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTIFS.prototype.Calculate = function (arg) {
		var i, j, arg0, arg1, matchingInfo, arg0Matrix, arg1Matrix, _count = 0;
		for (var k = 0; k < arg.length; k += 2) {
			arg0 = arg[k];
			arg1 = arg[k + 1];
			if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type && cElementType.cellsRange !== arg0.type && cElementType.cellsRange3D !== arg0.type) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

			if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
				arg1 = arg1.cross(arguments[1].bbox);
			} else if (cElementType.array === arg1.type) {
				arg1 = arg1.getElementRowCol(0, 0);
			}

			arg1 = arg1.tocString();
			if (cElementType.string !== arg1.type) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

			matchingInfo = AscCommonExcel.matchingValue(arg1.toString());
			arg1Matrix = arg0.getMatrix();
			if (!arg0Matrix) {
				arg0Matrix = arg1Matrix;
			}
			if (arg0Matrix.length !== arg1Matrix.length) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return this.value = new cError(cErrorType.wrong_value_type);
				}
				for (j = 0; j < arg1Matrix[i].length; ++j) {
					if (arg0Matrix[i][j] && !matching(arg1Matrix[i][j], matchingInfo)) {
						arg0Matrix[i][j] = null;
					}
				}
			}
		}

		for (i = 0; i < arg0Matrix.length; ++i) {
			for (j = 0; j < arg0Matrix[i].length; ++j) {
				if (arg0Matrix[i][j]) {
					++_count;
				}
			}
		}
		return this.value = new cNumber(_count);
	};
	cCOUNTIFS.prototype.checkArguments = function () {
		return 0 === this.argumentsCurrent % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};
	cCOUNTIFS.prototype.getInfo = function () {
		return {
			name: this.name, args: "(criteria_range1, criteria1, [criteria_range2, criteria2], ...)"
		};
	};

	/** @constructor */
	function cCOVAR() {
		this.name = "COVAR";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cCOVAR.prototype = Object.create(cBaseFunction.prototype);
	cCOVAR.prototype.Calculate = function (arg) {

		function covar(x, y) {

			var s1 = 0, _x = 0, _y = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			if (xLength == 0) {
				return new cError(cErrorType.division_by_zero);
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				s1 += (x[i].getValue() - _x) * (y[i].getValue() - _y);

			}
			return new cNumber(s1 / xLength);
		}

		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = covar(arr0, arr1);

	};
	cCOVAR.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cCRITBINOM() {
		this.name = "CRITBINOM";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cCRITBINOM.prototype = Object.create(cBaseFunction.prototype);
	cCRITBINOM.prototype.Calculate = function (arg) {
		var n = arg[0], p = arg[1], alpha = arg[2];                    // alpha

		function critbinom(n, p, alpha) {
			if (n < 0 || alpha <= 0 || alpha >= 1 || p < 0 || p > 1) {
				return new cError(cErrorType.not_numeric);
			} else {
				var q = 1 - p, factor = Math.pow(q, n), i, sum, max;
				if (factor == 0) {
					factor = Math.pow(p, n);
					if (factor == 0.0) {
						return new cError(cErrorType.wrong_value_type);
					} else {
						sum = 1 - factor;
						max = n;

						for (i = 0; i < max && sum >= alpha; i++) {
							factor *= (n - i) / (i + 1) * q / p;
							sum -= factor;
						}
						return new cNumber(n - i);
					}
				} else {
					sum = factor;
					max = n;

					for (i = 0; i < max && sum < alpha; i++) {
						factor *= (n - i) / (i + 1) * p / q;
						sum += factor;
					}
					return new cNumber(i);
				}
			}
		}

		if (alpha instanceof cArea || alpha instanceof cArea3D) {
			alpha = alpha.cross(arguments[1].bbox);
		} else if (alpha instanceof cArray) {
			alpha = alpha.getElement(0);
		}

		if (n instanceof cArea || n instanceof cArea3D) {
			n = n.cross(arguments[1].bbox);
		} else if (n instanceof cArray) {
			n = n.getElement(0);
		}

		if (p instanceof cArea || p instanceof cArea3D) {
			p = p.cross(arguments[1].bbox);
		} else if (p instanceof cArray) {
			p = p.getElement(0);
		}

		alpha = alpha.tocNumber();
		n = n.tocNumber();
		p = p.tocNumber();

		if (alpha instanceof cError) {
			return this.value = alpha;
		}
		if (n instanceof cError) {
			return this.value = n;
		}
		if (p instanceof cError) {
			return this.value = p;
		}

		return this.value = critbinom(n, p, alpha);

	};
	cCRITBINOM.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number-trials , success-probability , alpha )"
		};
	};

	/** @constructor */
	function cDEVSQ() {
		this.name = "DEVSQ";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cDEVSQ.prototype = Object.create(cBaseFunction.prototype);
	cDEVSQ.prototype.Calculate = function (arg) {

		function devsq(x) {

			var s1 = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					xLength++;
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					s1 += Math.pow(x[i].getValue() - _x, 2);
				}

			}

			return new cNumber(s1);
		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = devsq(arr0);

	};
	cDEVSQ.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cEXPONDIST() {
		this.name = "EXPONDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cEXPONDIST.prototype = Object.create(cBaseFunction.prototype);
	cEXPONDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

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

		if (arg0.getValue() < 0 || arg2.getValue() <= 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		if (arg2.toBool()) {
			return this.value = new cNumber(1 - Math.exp(-arg1.getValue() * arg0.getValue()));
		} else {
			return this.value = new cNumber(arg1.getValue() * Math.exp(-arg1.getValue() * arg0.getValue()));
		}
	};
	cEXPONDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , lambda , cumulative-flag )"
		};
	};

	/** @constructor */
	function cFDIST() {
		cBaseFunction.call(this, "FDIST");
	}

	cFDIST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cFINV() {
		cBaseFunction.call(this, "FINV");
	}

	cFINV.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cFISHER() {
		this.name = "FISHER";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cFISHER.prototype = Object.create(cBaseFunction.prototype);
	cFISHER.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		function fisher(x) {
			return 0.5 * Math.ln((1 + x) / (1 - x));
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = fisher(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = fisher(arg0.getValue());
			return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return this.value = arg0;

	};
	cFISHER.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number )"
		};
	};

	/** @constructor */
	function cFISHERINV() {
		this.name = "FISHERINV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cFISHERINV.prototype = Object.create(cBaseFunction.prototype);
	cFISHERINV.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		function fisherInv(x) {
			return ( Math.exp(2 * x) - 1 ) / ( Math.exp(2 * x) + 1 );
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = fisherInv(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = fisherInv(arg0.getValue());
			return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return this.value = arg0;

	};
	cFISHERINV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number )"
		};
	};

	/** @constructor */
	function cFORECAST() {
		this.name = "FORECAST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cFORECAST.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST.prototype.Calculate = function (arg) {

		function forecast(fx, y, x) {

			var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				var fValX = x[i].getValue();
				var fValY = y[i].getValue();

				fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
				fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

			}

			if (fSumDeltaXDeltaY == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(_y + fSumDeltaXDeltaY / fSumSqrDeltaX * ( fx.getValue() - _x ));
			}

		}

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		arg0 = arg0.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}


		if (arg1 instanceof cArea) {
			arr0 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg2 instanceof cArea) {
			arr1 = arg2.getValue();
		} else if (arg2 instanceof cArray) {
			arg2.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = forecast(arg0, arr0, arr1);

	};
	cFORECAST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cFREQUENCY() {
		this.name = "FREQUENCY";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cFREQUENCY.prototype = Object.create(cBaseFunction.prototype);
	cFREQUENCY.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cFREQUENCY.prototype.Calculate = function (arg) {

		function frequency(A, B) {

			var tA = [], tB = [Number.NEGATIVE_INFINITY], i, j;

			for (i = 0; i < A.length; i++) {
				for (j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cError) {
						return A[i][j];
					} else if (A[i][j] instanceof cNumber) {
						tA.push(A[i][j].getValue());
					} else if (A[i][j] instanceof cBool) {
						tA.push(A[i][j].tocNumber().getValue());
					}
				}
			}
			for (i = 0; i < B.length; i++) {
				for (j = 0; j < B[i].length; j++) {
					if (B[i][j] instanceof cError) {
						return B[i][j];
					} else if (B[i][j] instanceof cNumber) {
						tB.push(B[i][j].getValue());
					} else if (B[i][j] instanceof cBool) {
						tB.push(B[i][j].tocNumber().getValue());
					}
				}
			}

			tA.sort(fSortAscending);
			tB.push(Number.POSITIVE_INFINITY);
			tB.sort(fSortAscending);

			var C = [[]], k = 0;
			for (i = 1; i < tB.length; i++, k++) {
				C[0][k] = new cNumber(0);
				for (j = 0; j < tA.length; j++) {
					if (tA[j] > tB[i - 1] && tA[j] <= tB[i]) {
						var a = C[0][k].getValue();
						C[0][k] = new cNumber(++a);
					}
				}
			}
			var res = new cArray();
			res.fillFromArray(C);
			return res;
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}

		return this.value = frequency(arg0, arg1);

	};
	cFREQUENCY.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  data-array , bins-array )"
		};
	};

	/** @constructor */
	function cFTEST() {
		cBaseFunction.call(this, "FTEST");
	}

	cFTEST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cGAMMADIST() {
		cBaseFunction.call(this, "GAMMADIST");
	}

	cGAMMADIST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cGAMMAINV() {
		cBaseFunction.call(this, "GAMMAINV");
	}

	cGAMMAINV.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cGAMMALN() {
		this.name = "GAMMALN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cGAMMALN.prototype = Object.create(cBaseFunction.prototype);
	cGAMMALN.prototype.Calculate = function (arg) {



		/*
		 from OpenOffice Source.
		 end
		 */

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = getLogGamma(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = getLogGamma(arg0.getValue());
			return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return this.value = arg0;
	};
	cGAMMALN.prototype.getInfo = function () {
		return {name: this.name, args: "(number)"}
	};

	/** @constructor */
	function cGEOMEAN() {
		this.name = "GEOMEAN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cGEOMEAN.prototype = Object.create(cBaseFunction.prototype);
	cGEOMEAN.prototype.Calculate = function (arg) {

		function geommean(x) {

			var _x = 1, xLength = 0, _tx;
			for (var i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x *= x[i].getValue();
					xLength++;
				} else if (( x[i] instanceof cString || x[i] instanceof cBool ) &&
					( _tx = x[i].tocNumber()) instanceof cNumber) {
					_x *= _tx.getValue();
					xLength++;
				}

			}

			if (_x <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.pow(_x, 1 / xLength));
			}
		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString && arg[j].tocNumber() instanceof cNumber) {
				arr0.push(arg[j].tocNumber());
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = geommean(arr0);

	};
	cGEOMEAN.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cGROWTH() {
		cBaseFunction.call(this, "GROWTH");
	}

	cGROWTH.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cHARMEAN() {
		this.name = "HARMEAN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cHARMEAN.prototype = Object.create(cBaseFunction.prototype);
	cHARMEAN.prototype.Calculate = function (arg) {

		function harmmean(x) {

			var _x = 0, xLength = 0, _tx;
			for (var i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					if (x[i].getValue() == 0) {
						return new cError(cErrorType.not_numeric);
					}
					_x += 1 / x[i].getValue();
					xLength++;
				} else if (( x[i] instanceof cString || x[i] instanceof cBool ) &&
					( _tx = x[i].tocNumber()) instanceof cNumber) {
					if (_tx.getValue() == 0) {
						return new cError(cErrorType.not_numeric);
					}
					_x += 1 / _tx.getValue();
					xLength++;
				}

			}

			if (_x <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(xLength / _x);
			}
		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString && arg[j].tocNumber() instanceof cNumber) {
				arr0.push(arg[j].tocNumber());
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = harmmean(arr0);

	};
	cHARMEAN.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cHYPGEOMDIST() {
		this.name = "HYPGEOMDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 4;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
	}

	cHYPGEOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cHYPGEOMDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

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

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1].bbox);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
		arg3 = arg3.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}
		if (arg3 instanceof cError) {
			return this.value = arg3;
		}


		if (arg0.getValue() < 0 || arg0.getValue() > Math.min(arg1.getValue(), arg2.getValue()) ||
			arg0.getValue() < Math.max(0, arg1.getValue() - arg3.getValue() + arg2.getValue()) ||
			arg1.getValue() <= 0 || arg1.getValue() > arg3.getValue() || arg2.getValue() <= 0 ||
			arg2.getValue() > arg3.getValue() || arg3.getValue() <= 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		return this.value = new cNumber(Math.binomCoeff(arg2.getValue(), arg0.getValue()) *
			Math.binomCoeff(arg3.getValue() - arg2.getValue(), arg1.getValue() - arg0.getValue()) /
			Math.binomCoeff(arg3.getValue(), arg1.getValue()));

	};
	cHYPGEOMDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( sample-successes , number-sample , population-successes , number-population )"
		};
	};

	/** @constructor */
	function cINTERCEPT() {
		this.name = "INTERCEPT";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cINTERCEPT.prototype = Object.create(cBaseFunction.prototype);
	cINTERCEPT.prototype.Calculate = function (arg) {

		function intercept(y, x) {

			var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				var fValX = x[i].getValue();
				var fValY = y[i].getValue();

				fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
				fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

			}

			if (fSumDeltaXDeltaY == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(_y - fSumDeltaXDeltaY / fSumSqrDeltaX * _x);
			}

		}

		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = intercept(arr0, arr1);

	};
	cINTERCEPT.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cKURT() {
		this.name = "KURT";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cKURT.prototype = Object.create(cBaseFunction.prototype);
	cKURT.prototype.Calculate = function (arg) {

		function kurt(x) {

			var sumSQRDeltaX = 0, _x = 0, xLength = 0, sumSQRDeltaXDivstandDev = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					xLength++;
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					sumSQRDeltaX += Math.pow(x[i].getValue() - _x, 2);
				}

			}

			var standDev = Math.sqrt(sumSQRDeltaX / ( xLength - 1 ));

			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					sumSQRDeltaXDivstandDev += Math.pow((x[i].getValue() - _x) / standDev, 4);
				}

			}

			return new cNumber(xLength * (xLength + 1) / (xLength - 1) / (xLength - 2) / (xLength - 3) *
				sumSQRDeltaXDivstandDev - 3 * (xLength - 1) * (xLength - 1) / (xLength - 2) / (xLength - 3))

		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = kurt(arr0);

	};
	cKURT.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cLARGE() {
		this.name = "LARGE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cLARGE.prototype = Object.create(cBaseFunction.prototype);
	cLARGE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cLARGE.prototype._getValue = function (arg0, arg1) {
		if (cElementType.error === arg1.type) {
			return arg1;
		}

		arg1 = arg1.getValue();
		if (arg1 <= 0) {
			return new cError(cErrorType.not_available);
		}

		var v, tA = [];
		for (var i = 0; i < arg0.length; i++) {
			for (var j = 0; j < arg0[i].length; j++) {
				v = arg0[i][j];
				if (cElementType.error === v.type) {
					return v;
				} else if (cElementType.number === v.type) {
					tA.push(v.getValue());
				} else if (cElementType.bool === v.type) {
					tA.push(v.tocNumber().getValue());
				}
			}
		}

		tA.sort(AscCommon.fSortDescending);

		if (arg1 > tA.length) {
			return new cError(cErrorType.not_available);
		} else {
			return new cNumber(tA[arg1 - 1]);
		}
	};
	cLARGE.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (cElementType.cellsRange === arg0.type) {
			arg0 = arg0.getValuesNoEmpty();
		} else if (cElementType.array === arg0.type) {
			arg0 = arg0.getMatrix();
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElement(0);
		}

		arg1 = arg1.tocNumber();
		return this.value = this._getValue(arg0, arg1);
	};
	cLARGE.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  array , k )"
		};
	};

	/** @constructor */
	function cLINEST() {
		cBaseFunction.call(this, "LINEST");
	}

	cLINEST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cLOGEST() {
		cBaseFunction.call(this, "LOGEST");
	}

	cLOGEST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cLOGINV() {
		this.name = "LOGINV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cLOGINV.prototype = Object.create(cBaseFunction.prototype);
	cLOGINV.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		function loginv(x, mue, sigma) {
			if (sigma <= 0 || x <= 0 || x >= 1) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.exp(mue + sigma * ( gaussinv(x) )));
			}
		}

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

		return this.value = loginv(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};
	cLOGINV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , standard-deviation )"
		};
	};

	/** @constructor */
	function cLOGNORMDIST() {
		this.name = "LOGNORMDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cLOGNORMDIST.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORMDIST.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		function normdist(x, mue, sigma) {
			if (sigma <= 0 || x <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(0.5 + gauss((Math.ln(x) - mue) / sigma));
			}
		}

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

		return this.value = normdist(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};
	cLOGNORMDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , standard-deviation )"
		};
	};

	/** @constructor */
	function cMAX() {
		this.name = "MAX";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMAX.prototype = Object.create(cBaseFunction.prototype);
	cMAX.prototype.Calculate = function (arg) {
		var v, element, argIVal, max = Number.NEGATIVE_INFINITY;
		for (var i = 0; i < this.argumentsCurrent; i++) {
			element = arg[i];
			argIVal = element.getValue();
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					if (cElementType.error === argIVal.type) {
						return this.value = argIVal;
					}
					if (cElementType.number === argIVal.type) {
						v = argIVal.tocNumber();
						if (v.getValue() > max) {
							max = v.getValue();
						}
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var argArr = element.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < argArr.length; j++) {
					if (cElementType.number === argArr[j].type) {
						v = argArr[j].tocNumber();
						if (v.getValue() > max) {
							max = v.getValue();
						}
					} else if (cElementType.error === argArr[j].type) {
						return this.value = argArr[j];
					}
				}
			} else if (cElementType.error === element.type) {
				return this.value = element;
			} else if (cElementType.string === element.type) {
				v = element.tocNumber();
				if (cElementType.number === v.type) {
					if (v.getValue() > max) {
						max = v.getValue();
					}
				}
			} else if (cElementType.bool === element.type || cElementType.empty === element.type) {
				v = element.tocNumber();
				if (v.getValue() > max) {
					max = v.getValue();
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.number === elem.type) {
						if (elem.getValue() > max) {
							max = elem.getValue();
						}
					} else if (cElementType.error === elem.type) {
						max = elem;
						return true;
					}
				});
				if (cElementType.error === max.type) {
					return this.value = max;
				}
			} else {
				if (element.getValue() > max) {
					max = element.getValue();
				}
			}
		}
		return this.value = (max === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max));
	};
	cMAX.prototype.getInfo = function () {
		return {
			name: this.name, args: "(number1, number2, ...)"
		};
	};

	/** @constructor */
	function cMAXA() {
		this.name = "MAXA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMAXA.prototype = Object.create(cBaseFunction.prototype);
	cMAXA.prototype.Calculate = function (arg) {
		var argI, argIVal, max = Number.NEGATIVE_INFINITY, v;
		for (var i = 0; i < this.argumentsCurrent; i++) {
			argI = arg[i];
			argIVal = argI.getValue();
			if (argI instanceof cRef || argI instanceof cRef3D) {

				if (argIVal instanceof cError) {
					return this.value = argIVal;
				}

				v = argIVal.tocNumber();

				if (v instanceof cNumber && v.getValue() > max) {
					max = v.getValue();
				}
			} else if (argI instanceof cArea || argI instanceof cArea3D) {
				var argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return this.value = argArr[j];
					}

					v = argArr[j].tocNumber();

					if (v instanceof cNumber && v.getValue() > max) {
						max = v.getValue();
					}
				}
			} else if (argI instanceof cError) {
				return this.value = argI;
			} else if (argI instanceof cString) {
				v = argI.tocNumber();
				if (v instanceof cNumber) {
					if (v.getValue() > max) {
						max = v.getValue();
					}
				}
			} else if (argI instanceof cBool || argI instanceof cEmpty) {
				v = argI.tocNumber();
				if (v.getValue() > max) {
					max = v.getValue();
				}
			} else if (argI instanceof cArray) {
				argI.foreach(function (elem) {
					if (elem instanceof cError) {
						max = elem;
						return true;
					}
					elem = elem.tocNumber();

					if (elem instanceof cNumber && elem.getValue() > max) {
						max = elem.getValue();
					}
				});
				if (max instanceof cError) {
					return this.value = max;
				}
			} else {
				if (argI.getValue() > max) {
					max = argI.getValue();
				}
			}
		}
		return this.value = ( max === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max) )
	};
	cMAXA.prototype.getInfo = function () {
		return {
			name: this.name, args: "(number1, number2, ...)"
		};
	};

	/** @constructor */
	function cMEDIAN() {
		this.name = "MEDIAN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMEDIAN.prototype = Object.create(cBaseFunction.prototype);
	cMEDIAN.prototype.Calculate = function (arg) {

		function median(x) {

			var medArr = [], t;

			for (var i = 0; i < x.length; i++) {
				t = x[i].tocNumber();
				if (t instanceof cNumber) {
					medArr.push(t.getValue())
				}
			}

			medArr.sort(fSortAscending);

			if (medArr.length < 1) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				if (medArr.length % 2) {
					return new cNumber(medArr[(medArr.length - 1) / 2]);
				} else {
					return new cNumber((medArr[medArr.length / 2 - 1] + medArr[medArr.length / 2]) / 2);
				}
			}
		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = median(arr0);

	};
	cMEDIAN.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cMIN() {
		this.name = "MIN";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMIN.prototype = Object.create(cBaseFunction.prototype);
	cMIN.prototype.Calculate = function (arg) {
		var v, element, argIVal, min = Number.POSITIVE_INFINITY;
		for (var i = 0; i < this.argumentsCurrent; i++) {
			element = arg[i];
			argIVal = element.getValue();
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					if (cElementType.error === argIVal.type) {
						return this.value = argIVal;
					}
					if (cElementType.number === argIVal.type) {
						v = argIVal.tocNumber();
						if (v.getValue() < min) {
							min = v.getValue();
						}
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var argArr = element.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < argArr.length; j++) {
					if (cElementType.number === argArr[j].type) {
						v = argArr[j].tocNumber();
						if (v.getValue() < min) {
							min = v.getValue();
						}
						continue;
					} else if (cElementType.error === argArr[j].type) {
						return this.value = argArr[j];
					}
				}
			} else if (cElementType.error === element.type) {
				return this.value = element;
			} else if (cElementType.string === element.type) {
				v = element.tocNumber();
				if (cElementType.number === v.type) {
					if (v.getValue() < min) {
						min = v.getValue();
					}
				}
			} else if (cElementType.bool === element.type || cElementType.empty === element.type) {
				v = element.tocNumber();
				if (v.getValue() < min) {
					min = v.getValue();
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.number === elem.type) {
						if (elem.getValue() < min) {
							min = elem.getValue();
						}
					} else if (cElementType.error === elem.type) {
						min = elem;
						return true;
					}
				});
				if (cElementType.error === min.type) {
					return this.value = min;
				}
			} else {
				if (element.getValue() < min) {
					min = element.getValue();
				}
			}
		}
		return this.value = ( min === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min) );
	};
	cMIN.prototype.getInfo = function () {
		return {
			name: this.name, args: "(number1, number2, ...)"
		};
	};

	/** @constructor */
	function cMINA() {
		this.name = "MINA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMINA.prototype = Object.create(cBaseFunction.prototype);
	cMINA.prototype.Calculate = function (arg) {
		var argI, argIVal, min = Number.POSITIVE_INFINITY, v;
		for (var i = 0; i < this.argumentsCurrent; i++) {
			argI = arg[i];
			argIVal = argI.getValue();
			if (argI instanceof cRef || argI instanceof cRef3D) {

				if (argIVal instanceof cError) {
					return this.value = argIVal;
				}

				v = argIVal.tocNumber();

				if (v instanceof cNumber && v.getValue() < min) {
					min = v.getValue();
				}
			} else if (argI instanceof cArea || argI instanceof cArea3D) {
				var argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return this.value = argArr[j];
					}

					v = argArr[j].tocNumber();

					if (v instanceof cNumber && v.getValue() < min) {
						min = v.getValue();
					}
				}
			} else if (argI instanceof cError) {
				return this.value = argI;
			} else if (argI instanceof cString) {
				v = argI.tocNumber();
				if (v instanceof cNumber) {
					if (v.getValue() < min) {
						min = v.getValue();
					}
				}
			} else if (argI instanceof cBool || argI instanceof cEmpty) {
				v = argI.tocNumber();
				if (v.getValue() < min) {
					min = v.getValue();
				}
			} else if (argI instanceof cArray) {
				argI.foreach(function (elem) {
					if (elem instanceof cError) {
						min = elem;
						return true;
					}

					elem = elem.tocNumber();

					if (elem instanceof cNumber && elem.getValue() < min) {
						min = elem.getValue();
					}
				});
				if (min instanceof cError) {
					return this.value = min;
				}
			} else {
				if (argI.getValue() < min) {
					min = argI.getValue();
				}
			}
		}
		return this.value = ( min === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min) );
	};
	cMINA.prototype.getInfo = function () {
		return {
			name: this.name, args: "(number1, number2, ...)"
		};
	};

	/** @constructor */
	function cMODE() {
		this.name = "MODE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cMODE.prototype = Object.create(cBaseFunction.prototype);
	cMODE.prototype.Calculate = function (arg) {

		function mode(x) {

			var medArr = [], t, i;

			for (i = 0; i < x.length; i++) {
				t = x[i].tocNumber();
				if (t instanceof cNumber) {
					medArr.push(t.getValue())
				}
			}

			medArr.sort(AscCommon.fSortDescending);

			if (medArr.length < 1) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				var nMaxIndex = 0, nMax = 1, nCount = 1, nOldVal = medArr[0];

				for (i = 1; i < medArr.length; i++) {
					if (medArr[i] == nOldVal) {
						nCount++;
					} else {
						nOldVal = medArr[i];
						if (nCount > nMax) {
							nMax = nCount;
							nMaxIndex = i - 1;
						}
						nCount = 1;
					}
				}
				if (nCount > nMax) {
					nMax = nCount;
					nMaxIndex = i - 1;
				}
				if (nMax == 1 && nCount == 1) {
					return new cError(cErrorType.wrong_value_type);
				} else if (nMax == 1) {
					return new cNumber(nOldVal);
				} else {
					return new cNumber(medArr[nMaxIndex]);
				}
			}
		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = mode(arr0);

	};
	cMODE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cNEGBINOMDIST() {
		this.name = "NEGBINOMDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cNEGBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cNEGBINOMDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		function negbinomdist(x, r, p) {
			x = parseInt(x.getValue());
			r = parseInt(r.getValue());
			p = p.getValue();
			if (x < 0 || r < 1 || p < 0 || p > 1) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.binomCoeff(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x));
			}
		}

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

		return this.value = negbinomdist(arg0, arg1, arg2);

	};
	cNEGBINOMDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number-failures , number-successes , success-probability )"
		};
	};

	/** @constructor */
	function cNORMDIST() {
		this.name = "NORMDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 4;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
	}

	cNORMDIST.prototype = Object.create(cBaseFunction.prototype);
	cNORMDIST.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

		function normdist(x, mue, sigma, kum) {
			if (sigma <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			if (kum) {
				return new cNumber(integralPhi((x - mue) / sigma));
			} else {
				return new cNumber(phi((x - mue) / sigma) / sigma);
			}

		}

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

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1].bbox);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
		arg3 = arg3.tocBool();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}
		if (arg3 instanceof cError) {
			return this.value = arg3;
		}


		return this.value = normdist(arg0.getValue(), arg1.getValue(), arg2.getValue(), arg3.toBool());
	};
	cNORMDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , standard-deviation , cumulative-flag )"
		};
	};

	/** @constructor */
	function cNORMINV() {
		this.name = "NORMINV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cNORMINV.prototype = Object.create(cBaseFunction.prototype);
	cNORMINV.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		function norminv(x, mue, sigma) {
			if (sigma <= 0.0 || x <= 0.0 || x >= 1.0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(gaussinv(x) * sigma + mue);
			}
		}

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

		return this.value = norminv(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};
	cNORMINV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , standard-deviation )"
		};
	};

	/** @constructor */
	function cNORMSDIST() {
		this.name = "NORMSDIST";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cNORMSDIST.prototype = Object.create(cBaseFunction.prototype);
	cNORMSDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = 0.5 + gauss(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = 0.5 + gauss(arg0.getValue());
			return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return this.value = arg0;
	};
	cNORMSDIST.prototype.getInfo = function () {
		return {
			name: this.name, args: "(number)"
		};
	};

	/** @constructor */
	function cNORMSINV() {
		this.name = "NORMSINV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 1;
	}

	cNORMSINV.prototype = Object.create(cBaseFunction.prototype);
	cNORMSINV.prototype.Calculate = function (arg) {

		function normsinv(x) {
			if (x <= 0.0 || x >= 1.0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(gaussinv(x));
			}
		}

		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				if (elem instanceof cNumber) {
					var a = normsinv(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_available) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = normsinv(arg0.getValue());
			return this.value = isNaN(a) ? new cError(cErrorType.not_available) : new cNumber(a);
		}
		return this.value = arg0;
	};
	cNORMSINV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( probability )"
		};
	};

	/** @constructor */
	function cPEARSON() {
		this.name = "PEARSON";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cPEARSON.prototype = Object.create(cBaseFunction.prototype);
	cPEARSON.prototype.Calculate = function (arg) {

		function pearson(x, y) {

			var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length != y.length) {
				return new cError(cErrorType.not_available);
			}
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
				sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
				sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

			}

			if (sqrXDelta == 0 || sqrYDelta == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(sumXDeltaYDelta / Math.sqrt(sqrXDelta * sqrYDelta));
			}
		}

		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = pearson(arr0, arr1);

	};
	cPEARSON.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cPERCENTILE() {
		this.name = "PERCENTILE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cPERCENTILE.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTILE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cPERCENTILE.prototype.Calculate = function (arg) {

		function percentile(A, k) {

			var tA = [], alpha = k.getValue();

			for (var i = 0; i < A.length; i++) {
				for (var j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cError) {
						return A[i][j];
					} else if (A[i][j] instanceof cNumber) {
						tA.push(A[i][j].getValue());
					} else if (A[i][j] instanceof cBool) {
						tA.push(A[i][j].tocNumber().getValue());
					}
				}
			}

			return getPercentile(tA, alpha);
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		arg1 = arg1.tocNumber();

		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		return this.value = percentile(arg0, arg1);

	};
	cPERCENTILE.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  array , k )"
		};
	};

	/** @constructor */
	function cPERCENTRANK() {
		this.name = "PERCENTRANK";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cPERCENTRANK.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTRANK.prototype.Calculate = function (arg) {

		function percentrank(A, x, k) {

			var tA = [], t, i;

			k = k.getValue();

			for (i = 0; i < A.length; i++) {
				t = A[i].tocNumber();
				if (t instanceof cNumber) {
					tA.push(t.getValue())
				}
			}

			var fNum = x.getValue();

			tA.sort(fSortAscending);

			var nSize = tA.length;
			if (tA.length < 1 || nSize == 0) {
				return new cError(cErrorType.not_available);
			} else {
				if (fNum < tA[0] || fNum > tA[nSize - 1]) {
					return new cError(cErrorType.not_available);
				} else if (nSize == 1) {
					return new cNumber(1);
				} else {
					var fRes, nOldCount = 0, fOldVal = tA[0];
					for (i = 1; i < nSize && tA[i] < fNum; i++) {
						if (tA[i] != fOldVal) {
							nOldCount = i;
							fOldVal = tA[i];
						}
					}
					if (tA[i] != fOldVal) {
						nOldCount = i;
					}
					if (fNum == tA[i]) {
						fRes = nOldCount / (nSize - 1);
					} else {
						if (nOldCount == 0) {
							fRes = 0.0;
						} else {
							var fFract = ( fNum - tA[nOldCount - 1] ) / ( tA[nOldCount] - tA[nOldCount - 1] );
							fRes = ( nOldCount - 1 + fFract ) / (nSize - 1);
						}
					}
					return new cNumber(fRes.toString().substr(0, fRes.toString().indexOf(".") + 1 + k) - 0);
				}
			}
		}

		var arr0 = [], arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber(3);

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0.foreach2(function (elem) {
				if (elem instanceof cNumber) {
					arr0.push(elem);
				}
			});
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				if (elem instanceof cNumber) {
					arr0.push(elem);
				}
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
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

		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();

		if (arg1 instanceof cError) {
			return this.value = arg1;
		}
		if (arg2 instanceof cError) {
			return this.value = arg2;
		}

		return this.value = percentrank(arr0, arg1, arg2);

	};
	cPERCENTRANK.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array , x [ , significance ]  )"
		};
	};

	/** @constructor */
	function cPERMUT() {
		this.name = "PERMUT";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cPERMUT.prototype = Object.create(cBaseFunction.prototype);
	cPERMUT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1].bbox);
		}
		arg0 = arg0.tocNumber();

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		}
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		if (arg0 instanceof cArray && arg1 instanceof cArray) {
			if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
				return this.value = new cError(cErrorType.not_available);
			} else {
				arg0.foreach(function (elem, r, c) {
					var a = elem, b = arg1.getElementRowCol(r, c);
					if (a instanceof cNumber && b instanceof cNumber) {
						this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
					} else {
						this.array[r][c] = new cError(cErrorType.wrong_value_type);
					}
				});
				return this.value = arg0;
			}
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem, r, c) {
				var a = elem, b = arg1;
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return this.value = arg0;
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem, r, c) {
				var a = arg0, b = elem;
				if (a instanceof cNumber && b instanceof cNumber) {

					if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
						this.array[r][c] = new cError(cErrorType.not_numeric);
					}

					this.array[r][c] = new cNumber(Math.permut(a.getValue(), b.getValue()));
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			});
			return this.value = arg1;
		}

		if (arg0.getValue() <= 0 || arg1.getValue() <= 0 || arg0.getValue() < arg1.getValue()) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		return this.value = new cNumber(Math.permut(arg0.getValue(), arg1.getValue()));
	};
	cPERMUT.prototype.getInfo = function () {
		return {
			name: this.name, args: "( number , number-chosen )"
		};
	};

	/** @constructor */
	function cPOISSON() {
		this.name = "POISSON";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cPOISSON.prototype = Object.create(cBaseFunction.prototype);
	cPOISSON.prototype.Calculate = function (arg) {

		function poisson(x, l, cumulativeFlag) {
			var _x = parseInt(x.getValue()), _l = l.getValue(), f = cumulativeFlag.toBool();

			if (f) {
				var sum = 0;
				for (var k = 0; k <= x; k++) {
					sum += Math.pow(_l, k) / Math.fact(k);
				}
				sum *= Math.exp(-_l);
				return new cNumber(sum);
			} else {
				return new cNumber(Math.exp(-_l) * Math.pow(_l, _x) / Math.fact(_x));
			}

		}

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

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

		if (arg0.getValue() < 0 || arg1.getValue() <= 0) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		return this.value = new cNumber(poisson(arg0, arg1, arg2));

	};
	cPOISSON.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , cumulative-flag )"
		};
	};

	/** @constructor */
	function cPROB() {
		this.name = "PROB";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 4;
	}

	cPROB.prototype = Object.create(cBaseFunction.prototype);
	cPROB.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cPROB.prototype.Calculate = function (arg) {

		function prob(x, p, l, u) {
			var fUp, fLo;
			fLo = l.getValue();
			if (u instanceof cEmpty) {
				fUp = fLo;
			} else {
				fUp = u.getValue();
			}

			if (fLo > fUp) {
				var fTemp = fLo;
				fLo = fUp;
				fUp = fTemp;
			}
			var nC1 = x[0].length, nC2 = p[0].length, nR1 = x.length, nR2 = p.length;

			if (nC1 != nC2 || nR1 != nR2 || nC1 == 0 || nR1 == 0 || nC2 == 0 || nR2 == 0) {
				return new cError(cErrorType.not_available);
			} else {
				var fSum = 0, fRes = 0, bStop = false, fP, fW;
				for (var i = 0; i < nR1 && !bStop; i++) {
					for (var j = 0; j < nC1 && !bStop; j++) {
						if (x[i][j] instanceof cNumber && p[i][j] instanceof cNumber) {
							fP = p[i][j].getValue();
							fW = x[i][j].getValue();
							if (fP < 0.0 || fP > 1.0) {
								bStop = true;
							} else {
								fSum += fP;
								if (fW >= fLo && fW <= fUp) {
									fRes += fP;
								}
							}
						} else {
							return new cError(cErrorType.not_available);
						}
					}

				}
				if (bStop || Math.abs(fSum - 1.0) > 1.0E-7) {
					return new cError(cErrorType.not_available);
				} else {
					return new cNumber(fRes);
				}
			}
		}

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3] ? arg[3] : new cEmpty();
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1].bbox);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1].bbox);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg2 = arg2.tocNumber();
		if (!arg3 instanceof cEmpty) {
			arg3 = arg3.tocNumber();
		}

		if (arg2 instanceof cError) {
			return this.value = arg2;
		}
		if (arg3 instanceof cError) {
			return this.value = arg3;
		}

		return this.value = prob(arg0, arg1, arg2, arg3);

	};
	cPROB.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x-range , probability-range , lower-limit [ , upper-limit ] )"
		};
	};

	/** @constructor */
	function cQUARTILE() {
		this.name = "QUARTILE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cQUARTILE.prototype = Object.create(cBaseFunction.prototype);
	cQUARTILE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cQUARTILE.prototype.Calculate = function (arg) {

		function quartile(A, k) {

			var tA = [], fFlag = k.getValue();

			for (var i = 0; i < A.length; i++) {
				for (var j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cError) {
						return A[i][j];
					} else if (A[i][j] instanceof cNumber) {
						tA.push(A[i][j].getValue());
					} else if (A[i][j] instanceof cBool) {
						tA.push(A[i][j].tocNumber().getValue());
					}
				}
			}

			tA.sort(fSortAscending);

			var nSize = tA.length, nIndex, fDiff;
			if (tA.length < 1 || nSize == 0) {
				return new cError(cErrorType.not_available);
			} else {
				if (nSize == 1) {
					return new cNumber(tA[0]);
				} else {

					if (fFlag < 0.0 || fFlag > 4) {
						return new cError(cErrorType.not_numeric);
					} else if (fFlag == 0.0) {
						return new cNumber(tA[0]);
					} else if (fFlag == 1.0) {
						nIndex = Math.floor(0.25 * (nSize - 1));
						fDiff = 0.25 * (nSize - 1) - Math.floor(0.25 * (nSize - 1));
						if (fDiff == 0.0) {
							return new cNumber(tA[nIndex]);
						} else {
							return new cNumber(tA[nIndex] + fDiff * (tA[nIndex + 1] - tA[nIndex]));
						}
					} else if (fFlag == 2.0) {
						if (nSize % 2 == 0) {
							return new cNumber((tA[nSize / 2 - 1] + tA[nSize / 2]) / 2.0);
						} else {
							return new cNumber(tA[(nSize - 1) / 2]);
						}
					} else if (fFlag == 3.0) {
						nIndex = Math.floor(0.75 * (nSize - 1));
						fDiff = 0.75 * (nSize - 1) - Math.floor(0.75 * (nSize - 1));
						if (fDiff == 0.0) {
							return new cNumber(tA[nIndex]);
						} else {
							return new cNumber(tA[nIndex] + fDiff * (tA[nIndex + 1] - tA[nIndex]));
						}
					} else {
						return new cNumber(tA[nSize - 1]);
					}

				}
			}

		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		arg1 = arg1.tocNumber();

		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		return this.value = quartile(arg0, arg1);

	};
	cQUARTILE.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  array , result-category )"
		};
	};

	/** @constructor */
	function cRANK() {
		cBaseFunction.call(this, "RANK");
	}

	cRANK.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cRSQ() {
		this.name = "RSQ";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cRSQ.prototype = Object.create(cBaseFunction.prototype);
	cRSQ.prototype.Calculate = function (arg) {

		function rsq(x, y) {

			var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length != y.length) {
				return new cError(cErrorType.not_available);
			}
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
				sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
				sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

			}

			if (sqrXDelta == 0 || sqrYDelta == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(Math.pow(sumXDeltaYDelta / Math.sqrt(sqrXDelta * sqrYDelta), 2));
			}
		}


		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = rsq(arr0, arr1);

	};
	cRSQ.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cSKEW() {
		this.name = "SKEW";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cSKEW.prototype = Object.create(cBaseFunction.prototype);
	cSKEW.prototype.Calculate = function (arg) {

		function skew(x) {

			var sumSQRDeltaX = 0, _x = 0, xLength = 0, sumSQRDeltaXDivstandDev = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					xLength++;
				}

			}

			if (xLength <= 2) {
				return new cError(cErrorType.not_available);
			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					sumSQRDeltaX += Math.pow(x[i].getValue() - _x, 2);
				}

			}

			var standDev = Math.sqrt(sumSQRDeltaX / ( xLength - 1 ));

			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					sumSQRDeltaXDivstandDev += Math.pow((x[i].getValue() - _x) / standDev, 3);
				}

			}

			return new cNumber(xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev)

		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber) {
					arr0.push(a);
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber) {
						arr0.push(elem);
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = skew(arr0);
	};
	cSKEW.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cSLOPE() {
		this.name = "SLOPE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cSLOPE.prototype = Object.create(cBaseFunction.prototype);
	cSLOPE.prototype.Calculate = function (arg) {

		function slope(y, x) {

			var sumXDeltaYDelta = 0, sqrXDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length != y.length) {
				return new cError(cErrorType.not_available);
			}
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
				sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);

			}

			if (sqrXDelta == 0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(sumXDeltaYDelta / sqrXDelta);
			}
		}


		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = slope(arr0, arr1);

	};
	cSLOPE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( array-1 , array-2 )"
		};
	};

	/** @constructor */
	function cSMALL() {
		this.name = "SMALL";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cSMALL.prototype = Object.create(cBaseFunction.prototype);
	cSMALL.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cSMALL.prototype.Calculate = function (arg) {

		var retArr = new cArray();

		function frequency(A, k) {

			var tA = [];

			for (var i = 0; i < A.length; i++) {
				for (var j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cError) {
						return A[i][j];
					} else if (A[i][j] instanceof cNumber) {
						tA.push(A[i][j].getValue());
					} else if (A[i][j] instanceof cBool) {
						tA.push(A[i][j].tocNumber().getValue());
					}
				}
			}

			tA.sort(fSortAscending);

			if (k.getValue() > tA.length || k.getValue() <= 0) {
				return new cError(cErrorType.not_available);
			} else {
				return new cNumber(tA[k.getValue() - 1]);
			}
		}

		function actionArray(elem, r, c) {
			var e = elem.tocNumber();

			if (e instanceof cError) {
				retArr.addElement(e);
			}

			retArr.addElement(frequency(arg0, e));
		}

		var arg0 = arg[0], arg1 = arg[1];
		if (arg0 instanceof cArea || arg0 instanceof cArray) {
			arg0 = arg0.getMatrix();
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return this.value = new cError(cErrorType.not_available);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1].bbox);
		} else if (arg1 instanceof cArray) {
//        arg1 = arg1.getElement( 0 );
			arg1.foreach(actionArray);
			return this.value = retArr;
		}

		return this.value = frequency(arg0, arg1);

	};
	cSMALL.prototype.getInfo = function () {
		return {
			name: this.name, args: "(  array , k )"
		};
	};

	/** @constructor */
	function cSTANDARDIZE() {
		this.name = "STANDARDIZE";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 3;
		this.argumentsCurrent = 0;
		this.argumentsMax = 3;
	}

	cSTANDARDIZE.prototype = Object.create(cBaseFunction.prototype);
	cSTANDARDIZE.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];

		function standardize(x, mue, sigma) {
			if (sigma <= 0.0) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber((x - mue) / sigma);
			}
		}

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

		return this.value = standardize(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};
	cSTANDARDIZE.prototype.getInfo = function () {
		return {
			name: this.name, args: "( x , mean , standard-deviation )"
		};
	};

	/** @constructor */
	function cSTDEV() {
		this.name = "STDEV";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cSTDEV.prototype = Object.create(cBaseFunction.prototype);
	cSTDEV.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cSTDEV.prototype.Calculate = function (arg) {
		var i, element, count = 0, sum = new cNumber(0), member = [];
		for (i = 0; i < arg.length; i++) {
			element = arg[i];
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var _argV = element.getValue();
					if (cElementType.number === _argV.type) {
						member.push(_argV);
						sum = _func[sum.type][_argV.type](sum, _argV, "+");
						count++;
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _argAreaValue = element.getValue(this.checkExclude, this.excludeHiddenRows);
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j];
					if (cElementType.number === __arg.type) {
						member.push(__arg);
						sum = _func[sum.type][__arg.type](sum, __arg, "+");
						count++;
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					var e = elem.tocNumber();
					if (cElementType.number === e.type) {
						member.push(e);
						sum = _func[sum.type][e.type](sum, e, "+");
						count++;
					}
				})
			} else {
				element = element.tocNumber();
				if (cElementType.number === element.type) {
					member.push(element);
					sum = _func[sum.type][element.type](sum, element, "+");
					count++;
				}
			}
		}
		var average = sum.getValue() / count, res = 0, av;
		for (i = 0; i < member.length; i++) {
			av = member[i] - average;
			res += av * av;
		}
		return this.value = new cNumber(Math.sqrt(res / (count - 1)));
	};
	cSTDEV.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cSTDEVA() {
		this.name = "STDEVA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cSTDEVA.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVA.prototype.Calculate = function (arg) {
		var count = 0, sum = new cNumber(0), member = [], i;
		for (i = 0; i < arg.length; i++) {
			var _arg = arg[i];
			if (_arg instanceof cRef || _arg instanceof cRef3D) {
				var _argV = _arg.getValue().tocNumber();
				if (_argV instanceof cNumber) {
					member.push(_argV);
					sum = _func[sum.type][_argV.type](sum, _argV, "+");
					count++;
				}
			} else if (_arg instanceof cArea || _arg instanceof cArea3D) {
				var _argAreaValue = _arg.getValue();
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j].tocNumber();
					if (__arg instanceof cNumber) {
						member.push(__arg);
						sum = _func[sum.type][__arg.type](sum, __arg, "+");
						count++;
					}
				}
			} else if (_arg instanceof cArray) {
				_arg.foreach(function (elem) {
					var e = elem.tocNumber();
					if (e instanceof cNumber) {
						member.push(e);
						sum = _func[sum.type][e.type](sum, e, "+");
						count++;
					}
				})
			} else {
				_arg = _arg.tocNumber();
				if (_arg instanceof cNumber) {
					member.push(_arg);
					sum = _func[sum.type][_arg.type](sum, _arg, "+");
					count++;
				}
			}
		}
		var average = sum.getValue() / count, res = 0, av;
		for (i = 0; i < member.length; i++) {
			av = member[i] - average;
			res += av * av;
		}
		return this.value = new cNumber(Math.sqrt(res / (count - 1)));
	};
	cSTDEVA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cSTDEVP() {
		this.name = "STDEVP";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cSTDEVP.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVP.prototype.Calculate = function (arg) {
		function _var(x) {
			var i, tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
			for (i = 0; i < x.length; i++) {

				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)
			}

			return new cNumber(isNaN(_x) ? new cError(cErrorType.division_by_zero) : Math.sqrt(sumSQRDeltaX / xLength));
		}

		var element, arr0 = [];

		for (var j = 0; j < arg.length; j++) {
			element = arg[j];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows);
				_arrVal.forEach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var a = element.getValue();
					if (cElementType.number === a.type || cElementType.error === a.type) {
						arr0.push(a);
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.number === element.type || cElementType.bool === element.type) {
				arr0.push(element.tocNumber());
			} else if (cElementType.string === element.type || cElementType.empty === element.type) {
				arr0.push(new cNumber(0));
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);
	};
	cSTDEVP.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cSTDEVPA() {
		this.name = "STDEVPA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cSTDEVPA.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVPA.prototype.Calculate = function (arg) {

		function _var(x) {

			var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (x[i] instanceof cError) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

			}

			return new cNumber(Math.sqrt(sumSQRDeltaX / xLength));

		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (elem instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber || a instanceof cError) {
					arr0.push(a);
				} else if (a instanceof cBool) {
					arr0.push(a.tocNumber());
				} else if (a instanceof cString) {
					arr0.push(new cNumber(0));
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (elem instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				arr0.push(new cNumber(0));
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);
	};
	cSTDEVPA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cSTEYX() {
		this.name = "STEYX";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 2;
		this.argumentsCurrent = 0;
		this.argumentsMax = 2;
	}

	cSTEYX.prototype = Object.create(cBaseFunction.prototype);
	cSTEYX.prototype.Calculate = function (arg) {

		function steyx(y, x) {

			var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length != y.length) {
				return new cError(cErrorType.not_available);
			}
			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				_x += x[i].getValue();
				_y += y[i].getValue();
				xLength++;
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
				sqrXDelta += (x[i].getValue() - _x) * (x[i].getValue() - _x);
				sqrYDelta += (y[i].getValue() - _y) * (y[i].getValue() - _y);

			}


			if (sqrXDelta == 0 || sqrYDelta == 0 || xLength < 3) {
				return new cError(cErrorType.division_by_zero);
			} else {
				return new cNumber(Math.sqrt(
					(1 / (xLength - 2)) * (sqrYDelta - sumXDeltaYDelta * sumXDeltaYDelta / sqrXDelta)));
			}
		}


		var arg0 = arg[0], arg1 = arg[1], arr0 = [], arr1 = [];

		if (arg0 instanceof cArea) {
			arr0 = arg0.getValue();
		} else if (arg0 instanceof cArray) {
			arg0.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		return this.value = steyx(arr0, arr1);

	};
	cSTEYX.prototype.getInfo = function () {
		return {
			name: this.name, args: "( known-ys , known-xs )"
		};
	};

	/** @constructor */
	function cTDIST() {
		cBaseFunction.call(this, "TDIST");
	}

	cTDIST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cTINV() {
		cBaseFunction.call(this, "TINV");
	}

	cTINV.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cTREND() {
		cBaseFunction.call(this, "TREND");
	}

	cTREND.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cTRIMMEAN() {
		cBaseFunction.call(this, "TRIMMEAN");
	}

	cTRIMMEAN.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cTTEST() {
		cBaseFunction.call(this, "TTEST");
	}

	cTTEST.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cVAR() {
		this.name = "VAR";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cVAR.prototype = Object.create(cBaseFunction.prototype);
	cVAR.prototype.Calculate = function (arg) {
		function _var(x) {
			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var i, tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0;
			for (i = 0; i < x.length; i++) {

				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)
			}

			return new cNumber(sumSQRDeltaX / (xLength - 1))

		}

		var element, arr0 = [];

		for (var j = 0; j < arg.length; j++) {
			element = arg[j];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows);
				_arrVal.forEach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var a = element.getValue();
					if (cElementType.number === a.type || cElementType.error === a.type) {
						arr0.push(a);
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.number === element.type || cElementType.bool === element.type) {
				arr0.push(element.tocNumber());
			} else if (cElementType.string === element.type || cElementType.empty === element.type) {
				continue;
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);

	};
	cVAR.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cVARA() {
		this.name = "VARA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cVARA.prototype = Object.create(cBaseFunction.prototype);
	cVARA.prototype.Calculate = function (arg) {

		function _var(x) {

			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (x[i] instanceof cError) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

			}

			return new cNumber(sumSQRDeltaX / (xLength - 1))

		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (elem instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber || a instanceof cError) {
					arr0.push(a);
				} else if (a instanceof cBool) {
					arr0.push(a.tocNumber());
				} else if (a instanceof cString) {
					arr0.push(new cNumber(0));
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (a instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				arr0.push(new cNumber(0));
			} else if (arg[j] instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);
	};
	cVARA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cVARP() {
		this.name = "VARP";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cVARP.prototype = Object.create(cBaseFunction.prototype);
	cVARP.prototype.Calculate = function (arg) {
		function _var(x) {
			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (cElementType.number === x[i].type) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (cElementType.error === x[i].type) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {
				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x);
			}

			return new cNumber(sumSQRDeltaX / xLength);

		}

		var element, arr0 = [];

		for (var j = 0; j < arg.length; j++) {
			element = arg[j];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows);
				_arrVal.forEach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					var a = element.getValue();
					if (cElementType.number === a.type || cElementType.error === a.type) {
						arr0.push(a);
					}
				}
			} else if (cElementType.array === element.type) {
				element.foreach(function (elem) {
					if (cElementType.number === elem.type || cElementType.error === elem.type) {
						arr0.push(elem);
					}
				});
			} else if (cElementType.number === element.type || cElementType.bool === element.type) {
				arr0.push(element.tocNumber());
			} else if (cElementType.string === element.type || cElementType.empty === element.type) {
				arr0.push(new cNumber(0));
			} else {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);
	};
	cVARP.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cVARdotP() {
		this.name = "VAR.P";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cVARdotP.prototype = Object.create(cBaseFunction.prototype);
	cVARdotP.prototype.Calculate = cVARP.prototype.Calculate;
	cVARdotP.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cVARPA() {
		this.name = "VARPA";
		this.type = cElementType.func;
		this.value = null;
		this.argumentsMin = 1;
		this.argumentsCurrent = 0;
		this.argumentsMax = 255;
	}

	cVARPA.prototype = Object.create(cBaseFunction.prototype);
	cVARPA.prototype.Calculate = function (arg) {

		function _var(x) {

			if (x.length < 1) {
				return new cError(cErrorType.division_by_zero);
			}

			var tA = [], sumSQRDeltaX = 0, _x = 0, xLength = 0, i;
			for (i = 0; i < x.length; i++) {

				if (x[i] instanceof cNumber) {
					_x += x[i].getValue();
					tA.push(x[i].getValue());
					xLength++;
				} else if (x[i] instanceof cError) {
					return x[i];
				}

			}

			_x /= xLength;

			for (i = 0; i < x.length; i++) {

				sumSQRDeltaX += (tA[i] - _x) * (tA[i] - _x)

			}

			return new cNumber(sumSQRDeltaX / xLength);

		}

		var arr0 = [];

		for (var j = 0; j < this.getArguments(); j++) {

			if (arg[j] instanceof cArea || arg[j] instanceof cArea3D) {
				arg[j].foreach2(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (elem instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cRef || arg[j] instanceof cRef3D) {
				var a = arg[j].getValue();
				if (a instanceof cNumber || a instanceof cError) {
					arr0.push(a);
				} else if (a instanceof cBool) {
					arr0.push(a.tocNumber());
				} else if (a instanceof cString) {
					arr0.push(new cNumber(0));
				}
			} else if (arg[j] instanceof cArray) {
				arg[j].foreach(function (elem) {
					if (elem instanceof cNumber || elem instanceof cError) {
						arr0.push(elem);
					} else if (elem instanceof cBool) {
						arr0.push(elem.tocNumber());
					} else if (elem instanceof cString) {
						arr0.push(new cNumber(0));
					}
				});
			} else if (arg[j] instanceof cNumber || arg[j] instanceof cBool) {
				arr0.push(arg[j].tocNumber());
			} else if (arg[j] instanceof cString) {
				arr0.push(new cNumber(0));
			} else if (elem instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}

		}
		return this.value = _var(arr0);
	};
	cVARPA.prototype.getInfo = function () {
		return {
			name: this.name, args: "( argument-list )"
		};
	};

	/** @constructor */
	function cWEIBULL() {
		cBaseFunction.call(this, "WEIBULL");
	}

	cWEIBULL.prototype = Object.create(cBaseFunction.prototype);

	/** @constructor */
	function cZTEST() {
		cBaseFunction.call(this, "ZTEST");
	}

	cZTEST.prototype = Object.create(cBaseFunction.prototype);

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].phi = phi;
	window['AscCommonExcel'].gauss = gauss;
	window['AscCommonExcel'].gaussinv = gaussinv;
	window['AscCommonExcel'].getPercentile = getPercentile;

	window['AscCommonExcel'].cAVERAGE = cAVERAGE;
	window['AscCommonExcel'].cCOUNT = cCOUNT;
	window['AscCommonExcel'].cCOUNTA = cCOUNTA;
	window['AscCommonExcel'].cMAX = cMAX;
	window['AscCommonExcel'].cMIN = cMIN;
	window['AscCommonExcel'].cSTDEV = cSTDEV;
	window['AscCommonExcel'].cSTDEVP = cSTDEVP;
	window['AscCommonExcel'].cVAR = cVAR;
	window['AscCommonExcel'].cVARP = cVARP;
})(window);
