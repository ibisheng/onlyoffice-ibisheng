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
	var checkTypeCell = AscCommonExcel.checkTypeCell;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	var _func = AscCommonExcel._func;
	var matching = AscCommonExcel.matching;

	var maxGammaArgument = 171.624376956302;

	cFormulaFunctionGroup['Statistical'] = cFormulaFunctionGroup['Statistical'] || [];
	cFormulaFunctionGroup['Statistical'].push(cAVEDEV, cAVERAGE, cAVERAGEA, cAVERAGEIF, cAVERAGEIFS, cBETADIST,
		cBETA_DIST, cBETA_INV, cBINOMDIST, cBINOM_DIST, cBINOM_DIST_RANGE, cBINOM_INV, cCHIDIST, cCHIINV, cCHISQ_DIST,
		cCHISQ_DIST_RT, cCHISQ_INV, cCHISQ_INV_RT, cCHITEST, cCHISQ_TEST, cCONFIDENCE, cCONFIDENCE_NORM, cCONFIDENCE_T,
		cCORREL, cCOUNT, cCOUNTA, cCOUNTBLANK, cCOUNTIF, cCOUNTIFS, cCOVAR, cCOVARIANCE_P, cCOVARIANCE_S, cCRITBINOM,
		cDEVSQ, cEXPON_DIST, cEXPONDIST, cF_DIST, cFDIST, cF_DIST_RT, cF_INV, cFINV, cF_INV_RT, cFISHER, cFISHERINV,
		cFORECAST, cFORECAST_ETS, cFORECAST_ETS_CONFINT, cFORECAST_ETS_SEASONALITY, cFORECAST_ETS_STAT,
		cFORECAST_LINEAR, cFREQUENCY, cFTEST, cF_TEST, cGAMMA, cGAMMA_DIST, cGAMMADIST, cGAMMA_INV, cGAMMAINV, cGAMMALN,
		cGAMMALN_PRECISE, cGAUSS, cGEOMEAN, cGROWTH, cHARMEAN, cHYPGEOMDIST, cHYPGEOM_DIST, cINTERCEPT, cKURT, cLARGE,
		cLINEST, cLOGEST, cLOGINV, cLOGNORM_DIST, cLOGNORM_INV, cLOGNORMDIST, cMAX, cMAXA, cMAXIFS, cMEDIAN, cMIN,
		cMINA, cMINIFS, cMODE, cMODE_MULT, cMODE_SNGL, cNEGBINOMDIST, cNEGBINOM_DIST, cNORMDIST, cNORM_DIST, cNORMINV,
		cNORM_INV, cNORMSDIST, cNORM_S_DIST, cNORMSINV, cNORM_S_INV, cPEARSON, cPERCENTILE, cPERCENTILE_EXC,
		cPERCENTILE_INC, cPERCENTRANK, cPERCENTRANK_EXC, cPERCENTRANK_INC, cPERMUT, cPERMUTATIONA, cPHI, cPOISSON,
		cPOISSON_DIST, cPROB, cQUARTILE, cQUARTILE_EXC, cQUARTILE_INC, cRANK, cRANK_AVG, cRANK_EQ, cRSQ, cSKEW, cSKEW_P,
		cSLOPE, cSMALL, cSTANDARDIZE, cSTDEV, cSTDEV_S, cSTDEVA, cSTDEVP, cSTDEV_P, cSTDEVPA, cSTEYX, cTDIST, cT_DIST,
		cT_DIST_2T, cT_DIST_RT, cT_INV, cT_INV_2T, cTINV, cTREND, cTRIMMEAN, cTTEST, cT_TEST, cVAR, cVARA, cVARP,
		cVAR_P, cVAR_S, cVARPA, cWEIBULL, cWEIBULL_DIST, cZTEST, cZ_TEST);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cGROWTH, cLINEST, cLOGEST, cTREND);

	function isInteger(value) {
		return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
	}

	function integralPhi(x) { // Using gauss(x)+0.5 has severe cancellation errors for x<-4
		return 0.5 * AscCommonExcel.rtl_math_erfc(-x * 0.7071067811865475); // * 1/sqrt(2)
	}

	function phi(x) {
		return 0.39894228040143268 * Math.exp(-(x * x) / 2);
	}

	function gauss(x) {
		var t0 = [0.39894228040143268, -0.06649038006690545, 0.00997355701003582, -0.00118732821548045,
				0.00011543468761616, -0.00000944465625950, 0.00000066596935163, -0.00000004122667415, 0.00000000227352982,
				0.00000000011301172, 0.00000000000511243, -0.00000000000021218],
			t2 = [0.47724986805182079, 0.05399096651318805, -0.05399096651318805, 0.02699548325659403,
				-0.00449924720943234, -0.00224962360471617, 0.00134977416282970, -0.00011783742691370,
				-0.00011515930357476, 0.00003704737285544, 0.00000282690796889, -0.00000354513195524,
				0.00000037669563126, 0.00000019202407921, -0.00000005226908590, -0.00000000491799345,
				0.00000000366377919, -0.00000000015981997, -0.00000000017381238, 0.00000000002624031,
				0.00000000000560919, -0.00000000000172127, -0.00000000000008634, 0.00000000000007894],
			t4 = [0.49996832875816688, 0.00013383022576489, -0.00026766045152977, 0.00033457556441221,
				-0.00028996548915725, 0.00018178605666397, -0.00008252863922168, 0.00002551802519049,
				-0.00000391665839292, -0.00000074018205222, 0.00000064422023359, -0.00000017370155340,
				0.00000000909595465, 0.00000000944943118, -0.00000000329957075, 0.00000000029492075,
				0.00000000011874477, -0.00000000004420396, 0.00000000000361422, 0.00000000000143638,
				-0.00000000000045848];
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
				2.506628274631000270164908177133837338626],
			denom = [0, 39916800, 120543840, 150917976, 105258076, 45995730, 13339535, 2637558, 357423, 32670, 1925, 66,
				1];
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
				if (fDiff === 0.0) {
					return new cNumber(values[nIndex]);
				} else {
					return new cNumber(values[nIndex] + fDiff * (values[nIndex + 1] - values[nIndex]));
				}
			}
		}
	}

	function getPercentileExclusive(values, alpha) {
		values.sort(fSortAscending);

		var nSize1 = values.length + 1;
		if (nSize1 == 1) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (alpha * nSize1 < 1 || alpha * nSize1 > nSize1 - 1) {
			return new cError(cErrorType.not_numeric);
		}

		var nIndex = Math.floor(alpha * nSize1 - 1);
		var fDiff = alpha * nSize1 - 1 - Math.floor(alpha * nSize1 - 1);
		if (fDiff === 0.0) {
			return new cNumber(values[nIndex]);
		} else {
			return new cNumber(values[nIndex] + fDiff * (values[nIndex + 1] - values[nIndex]));
		}
	}

	function percentrank(tA, fNum, k, bInclusive) {

		tA.sort(fSortAscending);

		var nSize = tA.length;
		if (k < 1) {
			return new cError(cErrorType.not_numeric);
		} else if (tA.length < 1 || nSize === 0) {
			return new cError(cErrorType.not_available);
		} else {
			if (fNum < tA[0] || fNum > tA[nSize - 1]) {
				return new cError(cErrorType.not_available);
			} else if (nSize === 1) {
				return new cNumber(1);
			} else {

				if (fNum === tA[0]) {
					if (bInclusive) {
						fRes = 0;
					} else {
						fRes = 1 / ( nSize + 1 );
					}
				} else {
					var fRes, nOldCount = 0, fOldVal = tA[0], i;
					for (i = 1; i < nSize && tA[i] < fNum; i++) {
						if (tA[i] !== fOldVal) {
							nOldCount = i;
							fOldVal = tA[i];
						}
					}
					if (tA[i] !== fOldVal) {
						nOldCount = i;
					}
					if (fNum === tA[i]) {
						if (bInclusive) {
							fRes = nOldCount / (nSize - 1);
						} else {
							fRes = (i + 1) / (nSize + 1);
						}
					} else {
						if (nOldCount === 0) {
							fRes = 0;
						} else {
							var fFract = ( fNum - tA[nOldCount - 1] ) / ( tA[nOldCount] - tA[nOldCount - 1] );

							if (bInclusive) {
								fRes = ( nOldCount - 1 + fFract ) / (nSize - 1);
							} else {
								fRes = (nOldCount + fFract ) / ( nSize + 1 );
							}
						}
					}
				}

				return new cNumber(fRes.toString().substr(0, fRes.toString().indexOf(".") + 1 + k) - 0);
			}
		}
	}

	function getMedian(rArray) {
		rArray.sort(fSortAscending);

		var nSize = rArray.length;
		if (nSize == 0) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (nSize % 2 === 0) {
			return new cNumber((rArray[nSize / 2 - 1] + rArray[nSize / 2]) / 2);
		} else {
			return new cNumber(rArray[(nSize - 1) / 2]);
		}
	}

	function getGamma(fZ) {
		var fLogPi = Math.log(Math.PI);
		var fLogDblMax = Math.log(2.22507e+308);

		if (fZ > maxGammaArgument) {
			//SetError(FormulaError::IllegalFPOperation);
			//return HUGE_VAL;
			return;
		}

		if (fZ >= 1.0) {
			return getGammaHelper(fZ);
		}

		if (fZ >= 0.5) {
			return getGammaHelper(fZ + 1) / fZ;
		}

		if (fZ >= -0.5) {
			var fLogTest = getLogGammaHelper(fZ + 2) - Math.log1p(fZ) - Math.log(Math.abs(fZ));
			if (fLogTest >= fLogDblMax) {
				//SetError(FormulaError::IllegalFPOperation);
				//return HUGE_VAL;
				return;
			}
			return getGammaHelper(fZ + 2) / (fZ + 1) / fZ;
		}

		var fLogDivisor = getLogGammaHelper(1 - fZ) + Math.log(Math.abs(Math.sin(Math.PI * fZ)));
		if (fLogDivisor - fLogPi >= fLogDblMax) {
			return 0;
		}

		if (fLogDivisor < 0) {
			if (fLogPi - fLogDivisor > fLogDblMax) {
				//SetError(FormulaError::IllegalFPOperation);
				//return HUGE_VAL;
				return;
			}
		}

		return Math.exp(fLogPi - fLogDivisor) * ((Math.sin(Math.PI * fZ) < 0) ? -1 : 1);
	}

	function getGammaDist(fX, fAlpha, fLambda) {
		if (fX <= 0) {
			return 0;
		} else {
			return GetLowRegIGamma(fAlpha, fX / fLambda);
		}
	}

	function GetLowRegIGamma(fA, fX) {
		var fLnFactor = fA * Math.log(fX) - fX - getLogGamma(fA);
		var fFactor = Math.exp(fLnFactor);

		if (fX > fA + 1) {
			return 1 - fFactor * getGammaContFraction(fA, fX);
		} else {
			return fFactor * getGammaSeries(fA, fX);
		}
	}

	function getGammaContFraction(fA, fX) {
		var fBigInv = 2.22045e-016;//epsilon
		var fHalfMachEps = fBigInv / 2;
		var fBig = 1 / fBigInv;
		var fCount = 0;
		var fY = 1 - fA;
		var fDenom = fX + 2 - fA;
		var fPkm1 = fX + 1;
		var fPkm2 = 1;
		var fQkm1 = fDenom * fX;
		var fQkm2 = fX;
		var fApprox = fPkm1 / fQkm1;
		var bFinished = false;

		do {
			fCount = fCount + 1;
			fY = fY + 1;
			var fNum = fY * fCount;
			fDenom = fDenom + 2;
			var fPk = fPkm1 * fDenom - fPkm2 * fNum;
			var fQk = fQkm1 * fDenom - fQkm2 * fNum;
			if (fQk !== 0) {
				var fR = fPk / fQk;
				bFinished = (Math.abs((fApprox - fR) / fR) <= fHalfMachEps);
				fApprox = fR;
			}
			fPkm2 = fPkm1;
			fPkm1 = fPk;
			fQkm2 = fQkm1;
			fQkm1 = fQk;
			if (Math.abs(fPk) > fBig) {
				// reduce a fraction does not change the value
				fPkm2 = fPkm2 * fBigInv;
				fPkm1 = fPkm1 * fBigInv;
				fQkm2 = fQkm2 * fBigInv;
				fQkm1 = fQkm1 * fBigInv;
			}
		} while (!bFinished && fCount < 10000);

		if (!bFinished) {
			//SetError(FormulaError::NoConvergence);
			return;
		}
		return fApprox;
	}

	function getGammaSeries(fA, fX) {
		var fHalfMachEps = 2.22045e-016 / 2;
		var fDenomfactor = fA;
		var fSummand = 1 / fA;
		var fSum = fSummand;
		var nCount = 1;
		do {
			fDenomfactor = fDenomfactor + 1;
			fSummand = fSummand * fX / fDenomfactor;
			fSum = fSum + fSummand;
			nCount = nCount + 1;
		} while (fSummand / fSum > fHalfMachEps && nCount <= 10000);

		if (nCount > 10000) {
			//SetError(FormulaError::NoConvergence);
			return;
		}

		return fSum;
	}

	function getGammaDistPDF(fX, fAlpha, fLambda) {
		if (fX < 0) {
			return 0;
		} else if (fX === 0) {
			if (fAlpha < 1.0) {
				//SetError(FormulaError::DivisionByZero);  // should be #DIV/0
				//return HUGE_VAL;
				return;
			} else if (fAlpha === 1) {
				return (1 / fLambda);
			} else {
				return 0;
			}
		} else {
			var fXr = fX / fLambda;

			if (fXr > 1) {
				var fLogDblMax = Math.log(2.22507e+308);

				if (Math.log(fXr) * (fAlpha - 1) < fLogDblMax && fAlpha < maxGammaArgument) {
					return Math.pow(fXr, fAlpha - 1) * Math.exp(-fXr) / fLambda / getGamma(fAlpha);
				} else {
					return Math.exp((fAlpha - 1) * Math.log(fXr) - fXr - Math.log(fLambda) - getLogGamma(fAlpha));
				}
			} else {
				if (fAlpha < maxGammaArgument) {
					return Math.pow(fXr, fAlpha - 1) * Math.exp(-fXr) / fLambda / getGamma(fAlpha);
				} else {
					return Math.pow(fXr, fAlpha - 1) * Math.exp(-fXr) / fLambda / Math.exp(getLogGamma(fAlpha));
				}
			}
		}
	}

	function getChiDist(fX, fDF) {
		if (fX <= 0.0) {
			return 1.0;
		} else {
			return getUpRegIGamma(fDF / 2.0, fX / 2.0);
		}
	}

	function getUpRegIGamma(fA, fX) {
		var fLnFactor = fA * Math.log(fX) - fX - getLogGamma(fA);
		var fFactor = Math.exp(fLnFactor);
		if (fX > fA + 1) {
			return fFactor * getGammaContFraction(fA, fX);
		} else {
			return 1 - fFactor * getGammaSeries(fA, fX);
		}
	}

	function getChiSqDistCDF(fX, fDF) {
		if (fX <= 0) {
			return 0;
		} else {
			return GetLowRegIGamma(fDF / 2, fX / 2);
		}
	}

	function getChiSqDistPDF(fX, fDF) {
		var fValue;
		if (fX <= 0) {
			return 0;
		}
		if (fDF * fX > 1391000) {
			fValue = Math.exp((0.5 * fDF - 1) * Math.log(fX * 0.5) - 0.5 * fX - Math.log(2) - getLogGamma(0.5 * fDF));
		} else {
			var fCount;
			if (Math.fmod(fDF, 2) < 0.5) {
				fValue = 0.5;
				fCount = 2;
			} else {
				fValue = 1 / Math.sqrt(fX * 2 * Math.PI);
				fCount = 1;
			}

			while (fCount < fDF) {
				fValue *= (fX / fCount);
				fCount += 2;
			}
			if (fX >= 1425) {
				fValue = Math.exp(Math.log(fValue) - fX / 2);
			} else {
				fValue *= Math.exp(-fX / 2);
			}
		}
		return fValue;
	}

	function chiTest(pMat1, pMat2) {
		if (!pMat1 || !pMat2) {
			return new cError(cErrorType.not_available);
		}

		var nC1 = pMat1.length;
		var nC2 = pMat2.length;
		var nR1 = pMat1[0].length;
		var nR2 = pMat2[0].length;

		if (nR1 !== nR2 || nC1 !== nC2) {
			return new cError(cErrorType.not_available);
		}

		var fChi = 0.0;
		var bEmpty = true;
		for (var i = 0; i < nC1; i++) {
			for (var j = 0; j < nR1; j++) {
				if (pMat1[i][j] && pMat2[i][j]) {
					bEmpty = false;

					//MS выдает ошибку только если первый элемент строка. LO - если любой.
					if (i === 0 && j === 0 && cElementType.string === pMat1[i][j].type) {
						return new cError(cErrorType.division_by_zero);
					}

					if (cElementType.number !== pMat1[i][j].type || cElementType.number !== pMat2[i][j].type) {
						continue;
					}

					var fValX = pMat1[i][j].getValue();
					var fValE = pMat2[i][j].getValue();
					if (fValE === 0.0) {
						return new cError(cErrorType.division_by_zero);
					}

					var fTemp1 = (fValX - fValE) * (fValX - fValE);
					var fTemp2 = fTemp1;
					fChi += fTemp2 / fValE;
				}
			}
		}

		if (bEmpty) {
			return new cError(cErrorType.wrong_value_type);
		}

		var fDF;
		if (nC1 === 1 || nR1 === 1) {
			fDF = nC1 * nR1 - 1;
			if (fDF === 0) {
				return new cError(cErrorType.not_available);
			}
		} else {
			fDF = (nC1 - 1) * (nR1 - 1);
		}

		if (fDF < 1 || fChi < 0 || fDF > Math.pow(10, 10)) {
			return new cError(cErrorType.not_numeric);
		}

		var res = getChiDist(fChi, fDF);
		return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
	}

	function tTest(pMat1, pMat2, fTails, fTyp) {
		var fT, fF;
		var nC1 = pMat1.length;
		var nC2 = pMat2.length;
		var nR1 = pMat1[0].length;
		var nR2 = pMat2[0].length;

		var calcTest = null;
		if (fTyp === 1.0) {
			if (nC1 !== nC2 || nR1 !== nR2) {
				return new cError(cErrorType.not_available);
			}

			var fCount = 0.0;
			var fSum1 = 0.0;
			var fSum2 = 0.0;
			var fSumSqrD = 0.0;
			var fVal1, fVal2;
			for (var i = 0; i < nC1; i++) {
				for (var j = 0; j < nR1; j++) {
					if (cElementType.number !== pMat1[i][j].type || cElementType.number !== pMat2[i][j].type) {
						continue;
					}

					fVal1 = pMat1[i][j].getValue();
					fVal2 = pMat2[i][j].getValue();
					fSum1 += fVal1;
					fSum2 += fVal2;
					fSumSqrD += (fVal1 - fVal2) * (fVal1 - fVal2);
					fCount++;
				}
			}

			if (fCount < 1.0) {
				return new cError(cErrorType.wrong_value_type);
			}
			var fSumD = fSum1 - fSum2;
			var fDivider = (fCount * fSumSqrD - fSumD * fSumD);
			if (fDivider === 0.0) {
				return new cError(cErrorType.division_by_zero);
			}

			fT = Math.abs(fSumD) * Math.sqrt((fCount - 1.0) / fDivider);
			fF = fCount - 1.0;
		} else if (fTyp === 2.0) {
			calcTest = CalculateTest(false, nC1, nC2, nR1, nR2, pMat1, pMat2, fT, fF);
		} else if (fTyp === 3.0) {
			calcTest = CalculateTest(true, nC1, nC2, nR1, nR2, pMat1, pMat2, fT, fF);
		} else {
			return new cError(cErrorType.not_numeric);
		}

		if (null !== calcTest) {
			if (false === calcTest) {
				return new cError(cErrorType.wrong_value_type);
			} else {
				fT = calcTest.fT;
				fF = calcTest.fF;
			}
		}

		var res = getTDist(fT, fF, fTails);
		return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
	}

	function fTest(pMat1, pMat2) {

		var getMatrixValues = function (matrix) {
			var mfFirst = 1;
			var mfFirstSqr = 1;
			var mfRest = 0;
			var mfRestSqr = 0;
			var mnCount = 0;
			var bFirst = false;
			for (var i = 0; i < matrix.length; i++) {
				for (var j = 0; j < matrix[i].length; j++) {
					if (cElementType.number !== matrix[i][j].type) {
						continue;
					}
					mnCount++;
					if (!bFirst) {
						bFirst = true;
						mfFirst = matrix[i][j].getValue();
						mfFirstSqr = matrix[i][j].getValue() * matrix[i][j].getValue();
						continue;
					}

					mfRest += matrix[i][j].getValue();
					mfRestSqr += matrix[i][j].getValue() * matrix[i][j].getValue();
				}
			}
			return {mfFirst: mfFirst, mfRest: mfRest, mfRestSqr: mfRestSqr, mnCount: mnCount, mfFirstSqr: mfFirstSqr};
		};

		var matVals1 = getMatrixValues(pMat1);
		var fSum1 = matVals1.mfFirst + matVals1.mfRest;
		var fSumSqr1 = matVals1.mfFirstSqr + matVals1.mfRestSqr;
		var fCount1 = matVals1.mnCount;

		var matVals2 = getMatrixValues(pMat2);
		var fSum2 = matVals2.mfFirst + matVals2.mfRest;
		var fSumSqr2 = matVals2.mfFirstSqr + matVals2.mfRestSqr;
		var fCount2 = matVals2.mnCount;

		if (fCount1 < 2.0 || fCount2 < 2.0) {
			return new cError(cErrorType.division_by_zero);
		}
		var fS1 = (fSumSqr1 - fSum1 * fSum1 / fCount1) / (fCount1 - 1.0);
		var fS2 = (fSumSqr2 - fSum2 * fSum2 / fCount2) / (fCount2 - 1.0);
		if (fS1 === 0.0 || fS2 === 0.0) {
			return new cError(cErrorType.division_by_zero);
		}

		var fF, fF1, fF2;
		if (fS1 > fS2) {
			fF = fS1 / fS2;
			fF1 = fCount1 - 1.0;
			fF2 = fCount2 - 1.0;
		} else {
			fF = fS2 / fS1;
			fF1 = fCount2 - 1.0;
			fF2 = fCount1 - 1.0;
		}

		var fFcdf = getFDist(fF, fF1, fF2);
		var res = 2.0 * Math.min(fFcdf, 1.0 - fFcdf);

		return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
	}

	function CalculateTest(bTemplin, nC1, nC2, nR1, nR2, pMat1, pMat2, fT, fF) {
		var fCount1 = 0.0;
		var fCount2 = 0.0;
		var fSum1 = 0.0;
		var fSumSqr1 = 0.0;
		var fSum2 = 0.0;
		var fSumSqr2 = 0.0;
		var fVal;

		for (var i = 0; i < nC1; i++) {
			for (var j = 0; j < nR1; j++) {
				if (cElementType.string !== pMat1[i][j].type) {
					fVal = pMat1[i][j].getValue();
					fSum1 += fVal;
					fSumSqr1 += fVal * fVal;
					fCount1++;
				}
			}
		}

		for (var i = 0; i < nC2; i++) {
			for (var j = 0; j < nR2; j++) {
				if (cElementType.string !== pMat2[i][j].type) {
					fVal = pMat2[i][j].getValue();
					fSum2 += fVal;
					fSumSqr2 += fVal * fVal;
					fCount2++;
				}
			}
		}

		if (fCount1 < 2.0 || fCount2 < 2.0) {
			return false;
		}
		if (bTemplin) {
			var fS1 = (fSumSqr1 - fSum1 * fSum1 / fCount1) / (fCount1 - 1.0) / fCount1;
			var fS2 = (fSumSqr2 - fSum2 * fSum2 / fCount2) / (fCount2 - 1.0) / fCount2;
			if (fS1 + fS2 === 0.0) {
				return false;
			}

			var c = fS1 / (fS1 + fS2);
			fT = Math.abs(fSum1 / fCount1 - fSum2 / fCount2) / Math.sqrt(fS1 + fS2);
			fF = 1.0 / (c * c / (fCount1 - 1.0) + (1.0 - c) * (1.0 - c) / (fCount2 - 1.0));
		} else {
			var fS1 = (fSumSqr1 - fSum1 * fSum1 / fCount1) / (fCount1 - 1.0);
			var fS2 = (fSumSqr2 - fSum2 * fSum2 / fCount2) / (fCount2 - 1.0);

			fT =
				Math.abs(fSum1 / fCount1 - fSum2 / fCount2) / Math.sqrt((fCount1 - 1.0) * fS1 + (fCount2 - 1.0) * fS2) *
				Math.sqrt(fCount1 * fCount2 * (fCount1 + fCount2 - 2) / (fCount1 + fCount2));
			fF = fCount1 + fCount2 - 2;
		}

		return {fT: fT, fF: fF};
	}

	//BETA DISTRIBUTION
	function getBetaDist(fXin, fAlpha, fBeta) {
		if (fXin <= 0) {
			return 0;
		}
		if (fXin >= 1) {
			return 1;
		}
		if (fBeta === 1) {
			return Math.pow(fXin, fAlpha);
		}
		if (fAlpha === 1) {
			return -Math.expm1(fBeta * Math.log1p(-fXin));
		}

		var fResult;
		var fY = (0.5 - fXin) + 0.5;
		var flnY = Math.log1p(-fXin);
		var fX = fXin;
		var flnX = Math.log(fXin);
		var fA = fAlpha;
		var fB = fBeta;
		var bReflect = fXin > fAlpha / (fAlpha + fBeta);
		if (bReflect) {
			fA = fBeta;
			fB = fAlpha;
			fX = fY;
			fY = fXin;
			flnX = flnY;
			flnY = Math.log(fXin);
		}
		fResult = getBetaHelperContFrac(fX, fA, fB);
		fResult = fResult / fA;
		var fP = fA / (fA + fB);
		var fQ = fB / (fA + fB);

		var fTemp;
		if (fA > 1 && fB > 1 && fP < 0.97 && fQ < 0.97) {
			fTemp = getBetaDistPDF(fX, fA, fB) * fX * fY;
		} else {
			fTemp = Math.exp(fA * flnX + fB * flnY - getLogBeta(fA, fB));
		}

		fResult *= fTemp;
		if (bReflect) {
			fResult = 0.5 - fResult + 0.5;
		}
		if (fResult > 1) {
			fResult = 1;
		}
		if (fResult < 0) {
			fResult = 0;
		}

		return fResult;
	}

	// beta distribution probability density function
	function getTDist(T, fDF, nType) {
		var res = null;
		switch (nType) {
			case 1: {
				res = 0.5 * getBetaDist(fDF / ( fDF + T * T ), fDF / 2, 0.5);
				break;
			}
			case 2: {
				res = getBetaDist(fDF / ( fDF + T * T ), fDF / 2, 0.5);
				break;
			}
			case 3: {
				res = Math.pow(1 + ( T * T / fDF ), -( fDF + 1 ) / 2) / ( Math.sqrt(fDF) * getBeta(0.5, fDF / 2.0) );
				break;
			}
			case 4: {
				var X = fDF / ( T * T + fDF );
				var R = 0.5 * getBetaDist(X, 0.5 * fDF, 0.5);
				res = ( T < 0 ? R : 1 - R );
				break;
			}
		}
		return res;
	}


	function getBetaDistPDF(fX, fA, fB) {
		// special cases
		if (fA === 1) {
			if (fB === 1) {
				return 1;
			}
			if (fB === 2) {
				return -2 * fX + 2;
			}
			if (fX === 1 && fB < 1) {
				//SetError(FormulaError::IllegalArgument);
				//return HUGE_VAL;
				return;
			}

			if (fX <= 0.01) {
				return fB + fB * Math.expm1((fB - 1) * Math.log1p(-fX));
			} else {
				return fB * Math.pow(0.5 - fX + 0.5, fB - 1);
			}
		}
		if (fB === 1) {
			if (fA === 2) {
				return fA * fX;
			}
			if (fX === 0 && fA < 1) {
				//SetError(FormulaError::IllegalArgument);
				//return HUGE_VAL;
				return;
			}
			return fA * pow(fX, fA - 1);
		}
		if (fX <= 0) {
			if (fA < 1 && fX === 0) {
				//SetError(FormulaError::IllegalArgument);
				//return HUGE_VAL;
				return;
			} else {
				return 0;
			}
		}
		if (fX >= 1) {
			if (fB < 1 && fX === 1) {
				//SetError(FormulaError::IllegalArgument);
				//return HUGE_VAL;
				return;
			} else {
				return 0;
			}
		}


		var fLogDblMax = Math.log(2.22507e+308);
		var fLogDblMin = Math.log(2.22507e-308);
		var fLogY = (fX < 0.1) ? Math.log1p(-fX) : Math.log(0.5 - fX + 0.5);
		var fLogX = Math.log(fX);
		var fAm1LogX = (fA - 1) * fLogX;
		var fBm1LogY = (fB - 1) * fLogY;
		var fLogBeta = getLogBeta(fA, fB);

		if (fAm1LogX < fLogDblMax && fAm1LogX > fLogDblMin && fBm1LogY < fLogDblMax && fBm1LogY > fLogDblMin &&
			fLogBeta < fLogDblMax && fLogBeta > fLogDblMin && fAm1LogX + fBm1LogY < fLogDblMax &&
			fAm1LogX + fBm1LogY > fLogDblMin) {
			return Math.pow(fX, fA - 1) * Math.pow(0.5 - fX + 0.5, fB - 1) / getBeta(fA, fB);
		} else {
			return Math.exp(fAm1LogX + fBm1LogY - fLogBeta);
		}
	}

	function getBeta(fAlpha, fBeta) {
		var fA;
		var fB;
		if (fAlpha > fBeta) {
			fA = fAlpha;
			fB = fBeta;
		} else {
			fA = fBeta;
			fB = fAlpha;
		}

		if (fA + fB < maxGammaArgument) {
			return getGamma(fA) / getGamma(fA + fB) * getGamma(fB);
		}

		var fg = 6.024680040776729583740234375;
		var fgm = fg - 0.5;
		var fLanczos = getLanczosSum(fA);
		fLanczos /= getLanczosSum(fA + fB);
		fLanczos *= getLanczosSum(fB);
		var fABgm = fA + fB + fgm;
		fLanczos *= Math.sqrt((fABgm / (fA + fgm)) / (fB + fgm));
		var fTempA = fB / (fA + fgm);
		var fTempB = fA / (fB + fgm);
		var fResult = Math.exp(-fA * Math.log1p(fTempA) - fB * Math.log1p(fTempB) - fgm);
		fResult *= fLanczos;
		return fResult;
	}

	function getBetaHelperContFrac(fX, fA, fB) {
		var a1, b1, a2, b2, fnorm, cfnew, cf;
		a1 = 1;
		b1 = 1;
		b2 = 1 - (fA + fB) / (fA + 1) * fX;
		if (b2 === 0) {
			a2 = 0;
			fnorm = 1;
			cf = 1;
		} else {
			a2 = 1;
			fnorm = 1 / b2;
			cf = a2 * fnorm;
		}
		cfnew = 1;
		var rm = 1;

		var fMaxIter = 50000;
		var fMachEps = 2.22045e-016;
		var bfinished = false;
		do {
			var apl2m = fA + 2 * rm;
			var d2m = rm * (fB - rm) * fX / ((apl2m - 1) * apl2m);
			var d2m1 = -(fA + rm) * (fA + fB + rm) * fX / (apl2m * (apl2m + 1));
			a1 = (a2 + d2m * a1) * fnorm;
			b1 = (b2 + d2m * b1) * fnorm;
			a2 = a1 + d2m1 * a2 * fnorm;
			b2 = b1 + d2m1 * b2 * fnorm;
			if (b2 !== 0) {
				fnorm = 1 / b2;
				cfnew = a2 * fnorm;
				bfinished = (Math.abs(cf - cfnew) < Math.abs(cf) * fMachEps);
			}
			cf = cfnew;
			rm += 1;
		} while (rm < fMaxIter && !bfinished);
		return cf;
	}

	function getLogBeta(fAlpha, fBeta) {
		var fA;
		var fB;
		if (fAlpha > fBeta) {
			fA = fAlpha;
			fB = fBeta;
		} else {
			fA = fBeta;
			fB = fAlpha;
		}

		var fg = 6.024680040776729583740234375;
		var fgm = fg - 0.5;
		var fLanczos = getLanczosSum(fA);
		fLanczos /= getLanczosSum(fA + fB);
		fLanczos *= getLanczosSum(fB);
		var fLogLanczos = Math.log(fLanczos);
		var fABgm = fA + fB + fgm;
		fLogLanczos += 0.5 * (Math.log(fABgm) - Math.log(fA + fgm) - Math.log(fB + fgm));
		var fTempA = fB / (fA + fgm);
		var fTempB = fA / (fB + fgm);
		var fResult = -fA * Math.log1p(fTempA) - fB * Math.log1p(fTempB) - fgm;
		fResult += fLogLanczos;
		return fResult;
	}

	function getFDist(x, fF1, fF2) {
		var arg = fF2 / (fF2 + fF1 * x);
		var alpha = fF2 / 2;
		var beta = fF1 / 2;
		return getBetaDist(arg, alpha, beta);
	}

	function iterateInverse(rFunction, fAx, fBx) {
		var rConvError = false;
		var fYEps = 1.0E-307;
		var fXEps = 2.22045e-016;

		var fAy = rFunction.GetValue(fAx);
		var fBy = rFunction.GetValue(fBx);
		var fTemp;
		var nCount;
		for (nCount = 0; nCount < 1000 && !hasChangeOfSign(fAy, fBy); nCount++) {
			if (Math.abs(fAy) <= Math.abs(fBy)) {
				fTemp = fAx;
				fAx += 2 * (fAx - fBx);
				if (fAx < 0) {
					fAx = 0;
				}
				fBx = fTemp;
				fBy = fAy;
				fAy = rFunction.GetValue(fAx);
			} else {
				fTemp = fBx;
				fBx += 2 * (fBx - fAx);
				fAx = fTemp;
				fAy = fBy;
				fBy = rFunction.GetValue(fBx);
			}
		}

		if (fAy === 0) {
			return {val: fAx, bError: rConvError};
		}
		if (fBy === 0) {
			return {val: fBx, bError: rConvError};
		}
		if (!hasChangeOfSign(fAy, fBy)) {
			rConvError = true;
			return {val: 0, bError: rConvError};
		}
		// inverse quadric interpolation with additional brackets
		// set three points
		var fPx = fAx;
		var fPy = fAy;
		var fQx = fBx;
		var fQy = fBy;
		var fRx = fAx;
		var fRy = fAy;
		var fSx = 0.5 * (fAx + fBx);
		var bHasToInterpolate = true;

		nCount = 0;
		while (nCount < 500 && Math.abs(fRy) > fYEps && (fBx - fAx) > Math.max(Math.abs(fAx), Math.abs(fBx)) * fXEps) {
			if (bHasToInterpolate) {
				if (fPy !== fQy && fQy !== fRy && fRy !== fPy) {
					fSx = fPx * fRy * fQy / (fRy - fPy) / (fQy - fPy) + fRx * fQy * fPy / (fQy - fRy) / (fPy - fRy) +
						fQx * fPy * fRy / (fPy - fQy) / (fRy - fQy);
					bHasToInterpolate = (fAx < fSx) && (fSx < fBx); // inside the brackets?
				} else {
					bHasToInterpolate = false;
				}
			}
			if (!bHasToInterpolate) {
				fSx = 0.5 * (fAx + fBx);

				fQx = fBx;
				fQy = fBy;
				bHasToInterpolate = true;
			}

			fPx = fQx;
			fQx = fRx;
			fRx = fSx;
			fPy = fQy;
			fQy = fRy;
			fRy = rFunction.GetValue(fSx);

			if (hasChangeOfSign(fAy, fRy)) {
				fBx = fRx;
				fBy = fRy;
			} else {
				fAx = fRx;
				fAy = fRy;
			}

			bHasToInterpolate = bHasToInterpolate && (Math.abs(fRy) * 2 <= Math.abs(fQy));
			++nCount;
		}
		return {val: fRx, bError: rConvError};
	}

	function hasChangeOfSign(u, w) {
		return (u < 0 && w > 0) || (u > 0 && w < 0);
	}

	function rank(fVal, aSortArray, bAscending, bAverage) {
		//sort array
		aSortArray.sort(function sortArr(a, b) {
			return a - b;
		});

		var nSize = aSortArray.length;
		var res;

		if (nSize == 0 /*|| nGlobalError != FormulaError::NONE*/) {
			res = null;
		} else {
			if (fVal < aSortArray[0] || fVal > aSortArray[nSize - 1]) {
				res = null;
			} else {
				var fLastPos = 0;
				var fFirstPos = -1.0;
				var bFinished = false;
				var i;
				for (i = 0; i < nSize && !bFinished /*&& nGlobalError == FormulaError::NONE*/; i++) {
					if (aSortArray[i] === fVal) {
						if (fFirstPos < 0) {
							fFirstPos = i + 1.0;
						}
					} else {
						if (aSortArray[i] > fVal) {
							fLastPos = i;
							bFinished = true;
						}
					}
				}

				if (!bFinished) {
					fLastPos = i;
				}
				if (!bAverage) {
					if (bAscending) {
						res = fFirstPos;
					} else {
						res = nSize + 1.0 - fLastPos;
					}
				} else {
					if (bAscending) {
						res = ( fFirstPos + fLastPos ) / 2.0;
					} else {
						res = nSize + 1.0 - ( fFirstPos + fLastPos ) / 2.0;
					}
				}
			}
		}

		return res;
	}

	function skew(x, bSkewp) {

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

		var standDev;
		if (bSkewp) {
			standDev = Math.sqrt(sumSQRDeltaX / ( xLength ));
		} else {
			standDev = Math.sqrt(sumSQRDeltaX / ( xLength - 1 ));
		}

		for (i = 0; i < x.length; i++) {

			if (x[i] instanceof cNumber) {
				sumSQRDeltaXDivstandDev += Math.pow((x[i].getValue() - _x) / standDev, 3);
			}

		}

		var res;
		if (bSkewp) {
			res = sumSQRDeltaXDivstandDev / xLength;
		} else {
			res = xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev;
		}

		return new cNumber(res);
	}

	function convertToMatrix(val) {
		var matrix;
		if (undefined !== val.getMatrix) {
			matrix = val.getMatrix();
		} else {
			val = val.tocNumber();
			if (cElementType.error === val.type) {
				return val;
			}
			matrix = [[val]];
		}
		return matrix;
	}

	/*function forEachMatrixElem(matrix, func){
	 for(var i = 0; i < matrix.length; i++){
	 for(var j = 0; j < matrix[i].length; j++){

	 }
	 }
	 }*/

	function GetNewMat(c, r) {
		var matrix = [];
		for (var i = 0; i < c; i++) {
			for (var j = 0; j < r; j++) {
				if (!matrix[i]) {
					matrix[i] = [];
				}

				matrix[i][j] = 0;
			}
		}
		return matrix;
	}

	function matrixClone(matrix) {
		var cloneMatrix = [];
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				if (!cloneMatrix[i]) {
					cloneMatrix[i] = [];
				}

				cloneMatrix[i][j] = matrix[i][j];
			}
		}
		return cloneMatrix;
	}

	function CheckMatrix(_bLOG, pMatX, pMatY) {
		var nCX = 0;
		var nCY = 0;
		var nRX = 0;
		var nRY = 0;
		var M = 0;
		var N = 0;
		var nCase;

		var nRY = pMatY.length;
		var nCY = pMatY[0].length;
		var nCountY = nCY * nRY;
		for (var i = 0; i < pMatY.length; i++) {
			for (var j = 0; j < pMatY[i].length; j++) {
				if (!pMatY[i][j]) {
					//PushIllegalArgument();
					return false;
				} else {
					pMatY[i][j] = pMatY[i][j].getValue();
				}
			}
		}

		if (_bLOG) {
			var pNewY = matrixClone(pMatY);

			for (var i = 0; i < pMatY.length; i++) {
				for (var j = 0; j < pMatY[i].length; j++) {
					var fVal = pNewY[i][j];
					if (fVal <= 0.0) {
						//PushIllegalArgument();
						return false;
					} else {
						pNewY[i][j] = Math.log(fVal);
					}
				}
			}
			pMatY = pNewY;
		}

		if (pMatX) {
			nRX = pMatX.length;
			nCX = pMatX[0].length;
			var nCountX = nCX * nRX;
			for (var i = 0; i < pMatX.length; i++) {
				for (var j = 0; j < pMatX[i].length; j++) {
					if (!pMatX[i][j]) {
						//PushIllegalArgument();
						return false;
					} else {
						pMatX[i][j] = pMatX[i][j].getValue();
					}
				}
			}

			if (nCX === nCY && nRX === nRY) {
				nCase = 1;                  // simple regression
				M = 1;
				N = nCountY;
			} else if (nCY !== 1 && nRY !== 1) {
				//PushIllegalArgument();
				return false;
			} else if (nCY === 1) {
				if (nRX !== nRY) {
					//PushIllegalArgument();
					return false;
				} else {
					nCase = 2;              // Y is column
					N = nRY;
					M = nCX;
				}
			} else if (nCX !== nCY) {
				//PushIllegalArgument();
				return false;
			} else {
				nCase = 3;                  // Y is row
				N = nCY;
				M = nRX;
			}
		} else {
			pMatX = GetNewMat(nRY, nCY);
			nCX = nCY;
			nRX = nRY;
			if (!pMatX) {
				//PushIllegalArgument();
				return false;
			}

			var num = 1;
			for (var i = 0; i < nRY; i++) {
				for (var j = 1; j <= nCY; j++) {
					pMatX[i][j - 1] = num;
					num++;
				}
			}

			nCase = 1;
			N = nCountY;
			M = 1;
		}

		return {nCase: nCase, nCX: nCX, nCY: nCY, nRX: nRX, nRY: nRY, M: M, N: N, pMatX: pMatX, pMatY: pMatY};
	}

	function lcl_GetMeanOverAll(pMat, nN) {
		var fSum = 0.0;
		for (var i = 0; i < pMat.length; i++) {
			for (var j = 0; j < pMat[i].length; j++) {
				fSum += pMat[i][j];
			}
		}

		return fSum / nN;
	}

	function lcl_GetSumProduct(pMatA, pMatB, nM) {
		var fSum = 0.0;
		for (var i = 0; i < pMatA.length; i++) {
			for (var j = 0; j < pMatA[i].length; j++) {
				fSum += pMatA[i][j] * pMatB[i][j];
			}
		}
		return fSum;
	}

	function approxSub(a, b) {
		if (((a < 0.0 && b < 0.0) || (a > 0.0 && b > 0.0)) && Math.abs(a - b) < 2.22045e-016) {
			return 0.0;
		}
		return a - b;
	}


	function lcl_CalculateColumnMeans(pX, pResMat, nC, nR) {
		for (var i = 0; i < nC; i++) {
			var fSum = 0.0;
			for (var k = 0; k < nR; k++) {
				fSum += pX[k][i];// GetDouble(Column,Row)
			}
			pResMat[i][0] = fSum / nR;
		}
	}

	function lcl_CalculateColumnsDelta(pMat, pColumnMeans, nC, nR) {
		for (var i = 0; i < nC; i++) {
			for (var k = 0; k < nR; k++) {
				pMat[k][i] = approxSub(pMat[k][i], pColumnMeans[i][0]);
			}
		}
	}

	function lcl_TGetColumnMaximumNorm(pMatA, nR, nC, nN) {
		var fNorm = 0.0;
		for (var col = nC; col < nN; col++) {
			if (fNorm < Math.abs(pMatA[nR][col])) {
				fNorm = Math.abs(pMatA[nR][col]);
			}
		}

		return fNorm;
	}

	function lcl_TGetColumnEuclideanNorm(pMatA, nR, nC, nN) {
		var fNorm = 0.0;
		for (var col = nC; col < nN; col++) {
			fNorm += (pMatA[nR][col]) * (pMatA[nR][col]);
		}

		return Math.sqrt(fNorm);
	}

	function lcl_GetSign(fValue) {
		return (fValue >= 0.0 ? 1.0 : -1.0 );
	}

	function lcl_TGetColumnSumProduct(pMatA, nRa, pMatB, nRb, nC, nN) {
		var fResult = 0.0;
		for (var col = nC; col < nN; col++) {
			fResult += pMatA[nRa][col] * pMatB[nRb][col];
		}
		return fResult;
	}

	// same with transposed matrix A, N is count of columns, K count of rows
	function lcl_TCalculateQRdecomposition(pMatA, pVecR, nK, nN) {
		var fSum;
		// ScMatrix matrices are zero based, index access (column,row)
		for (var row = 0; row < nK; row++) {
			// calculate vector u of the householder transformation
			var fScale = lcl_TGetColumnMaximumNorm(pMatA, row, row, nN);
			if (fScale === 0.0) {
				// A is singular
				return false;
			}
			for (var col = row; col < nN; col++) {
				pMatA[row][col] = pMatA[row][col] / fScale;
			}

			var fEuclid = lcl_TGetColumnEuclideanNorm(pMatA, row, row, nN);
			var fFactor = 1.0 / fEuclid / (fEuclid + Math.abs(pMatA[row][row]));
			var fSignum = lcl_GetSign(pMatA[row][row]);
			pMatA[row][row] = pMatA[row][row] + fSignum * fEuclid;
			pVecR[row] = -fSignum * fScale * fEuclid;

			// apply Householder transformation to A
			for (var r = row + 1; r < nK; r++) {
				fSum = lcl_TGetColumnSumProduct(pMatA, row, pMatA, r, row, nN);
				for (var col = row; col < nN; col++) {
					pMatA[r][col] = pMatA[r][col] - fSum * fFactor * pMatA[row][col];
				}
			}

		}
		return true;
	}

	function lcl_ApplyHouseholderTransformation(pMatA, nC, pMatY, nN) {
		// ScMatrix matrices are zero based, index access (column,row)
		var fDenominator = lcl_GetColumnSumProduct(pMatA, nC, pMatA, nC, nC, nN);
		var fNumerator = lcl_GetColumnSumProduct(pMatA, nC, pMatY, 0, nC, nN);
		var fFactor = 2.0 * (fNumerator / fDenominator);
		for (var row = nC; row < nN; row++) {
			pMatY[0][row] = pMatY[0][row] - fFactor * pMatA[nC][row];
		}
	}

	function lcl_GetColumnSumProduct(pMatA, nCa, pMatB, nCb, nR, nN) {
		var fResult = 0.0;
		for (var row = nR; row < nN; row++) {
			fResult += pMatA[nCa][row] * pMatB[nCb][row];
		}
		return fResult;
	}

	function lcl_SolveWithUpperRightTriangle(pMatA, pVecR, pMatS, nK, bIsTransposed) {
		// ScMatrix matrices are zero based, index access (column,row)
		var row;
		// SCSIZE is never negative, therefore test with rowp1=row+1
		for (var rowp1 = nK; rowp1 > 0; rowp1--) {
			row = rowp1 - 1;
			var fSum = pMatS[row][0];
			for (var col = rowp1; col < nK; col++) {
				if (bIsTransposed) {
					fSum -= pMatA[col][row] * pMatS[col][0];
				} else {
					fSum -= pMatA[row][col] * pMatS[col][0];
				}
			}

			pMatS[row][0] = fSum / pVecR[row];
		}
	}

	// Multiply n x m Mat A with m x l Mat B to n x l Mat R
	function lcl_MFastMult(pA, pB, pR, n, m, l) {
		var sum;
		for (var row = 0; row < n; row++) {
			for (var col = 0; col < l; col++) {   // result element(col, row) =sum[ (row of A) * (column of B)]
				sum = 0.0;
				for (var k = 0; k < m; k++) {
					sum += pA[k][row] * pB[k][col];
				}
				pR[col][row] = sum;
			}
		}
	}

	function lcl_CalculateRowMeans(pX, pResMat, nC, nR) {
		for (var k = 0; k < nR; k++) {
			var fSum = 0.0;
			for (var i = 0; i < nC; i++) {
				fSum += pX[k][i];
			}
			// GetDouble(Column,Row)
			pResMat[k][0] = fSum / nC;
		}
	}

	function lcl_CalculateRowsDelta(pMat, pRowMeans, nC, nR) {
		for (var k = 0; k < nR; k++) {
			for (var i = 0; i < nC; i++) {
				pMat[k][i] = approxSub(pMat[k][i], pRowMeans[k][0]);
			}
		}
	}

	function lcl_TApplyHouseholderTransformation(pMatA, nR, pMatY, nN) {
		// ScMatrix matrices are zero based, index access (column,row)
		var fDenominator = lcl_TGetColumnSumProduct(pMatA, nR, pMatA, nR, nR, nN);
		var fNumerator = lcl_TGetColumnSumProduct(pMatA, nR, pMatY, 0, nR, nN);
		var fFactor = 2.0 * (fNumerator / fDenominator);
		for (var col = nR; col < nN; col++) {
			pMatY[0][col] = pMatY[0][col] - fFactor * pMatA[nR][col];
		}
	}

	function lcl_GetColumnMaximumNorm(pMatA, nC, nR, nN) {
		var fNorm = 0.0;
		for (var row = nR; row < nN; row++) {
			if (fNorm < Math.abs(pMatA[nC][row])) {
				fNorm = Math.abs(pMatA[nC][row]);
			}
		}
		return fNorm;
	}

	function lcl_GetColumnEuclideanNorm(pMatA, nC, nR, nN) {
		var fNorm = 0.0;
		for (var row = nR; row < nN; row++) {
			fNorm += pMatA[nC][row] * pMatA[nC][row];
		}
		return Math.sqrt(fNorm);
	}

	function lcl_CalculateQRdecomposition(pMatA, pVecR, nK, nN) {
		// ScMatrix matrices are zero based, index access (column,row)
		for (var col = 0; col < nK; col++) {
			// calculate vector u of the householder transformation
			var fScale = lcl_GetColumnMaximumNorm(pMatA, col, col, nN);
			if (fScale === 0.0) {
				// A is singular
				return false;
			}
			for (var row = col; row < nN; row++) {
				pMatA[col][row] = pMatA[col][row] / fScale;
			}

			var fEuclid = lcl_GetColumnEuclideanNorm(pMatA, col, col, nN);
			var fFactor = 1.0 / fEuclid / (fEuclid + Math.abs(pMatA[col][col]));
			var fSignum = lcl_GetSign(pMatA[col][col]);
			pMatA[col][col] = pMatA[col][col] + fSignum * fEuclid;
			pVecR[col] = -fSignum * fScale * fEuclid;

			// apply Householder transformation to A
			for (var c = col + 1; c < nK; c++) {
				var fSum = lcl_GetColumnSumProduct(pMatA, col, pMatA, c, col, nN);
				for (var row = col; row < nN; row++) {
					pMatA[c][row] = pMatA[c][row] - fSum * fFactor * pMatA[col][row];
				}
			}
		}
		return true;
	}

	function prepeareGrowthTrendCalculation(t, arg) {
		//если первое значение число
		arg[0] = tryNumberToArray(arg[0]);
		if (arg[1]) {
			arg[1] = tryNumberToArray(arg[1]);
		}
		if (arg[2]) {
			arg[2] = tryNumberToArray(arg[2]);
		}

		var oArguments = t._prepareArguments(arg, arguments[1], true,
			[cElementType.array, cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = t._checkErrorArg(argClone)) {
			return argError;
		}

		var pMatY = argClone[0];
		var pMatX = argClone[1];
		var pMatNewX = argClone[2];
		var bConstant = undefined !== argClone[3] ? argClone[3].getValue() : true;

		return {pMatY: pMatY, pMatX: pMatX, pMatNewX: pMatNewX, bConstant: bConstant};
	}

	function CalculateTrendGrowth(pMatY, pMatX, pMatNewX, bConstant, _bGrowth) {
		var getMatrixParams = CheckMatrix(_bGrowth, pMatX, pMatY);
		if (!getMatrixParams) {
			return;
		}

		// 1 = simple; 2 = multiple with Y as column; 3 = multiple with Y as row
		var nCase = getMatrixParams.nCase;
		var nCX = getMatrixParams.nCX, nCY = getMatrixParams.nCY; // number of columns
		var nRX = getMatrixParams.nRX, nRY = getMatrixParams.nRY; //number of rows
		var K = getMatrixParams.M, N = getMatrixParams.N; // K=number of variables X, N=number of data samples
		pMatX = getMatrixParams.pMatX, pMatY = getMatrixParams.pMatY;

		// Enough data samples?
		if ((bConstant && (N < K + 1)) || (!bConstant && (N < K)) || (N < 1) || (K < 1)) {
			return;
		}

		// Set default pMatNewX if necessary
		var nCXN, nRXN;
		var nCountXN;
		if (!pMatNewX) {
			nCXN = nCX;
			nRXN = nRX;
			nCountXN = nCXN * nRXN;
			pMatNewX = matrixClone(pMatX); // pMatX will be changed to X-meanX
		} else {
			nRXN = pMatNewX.length;
			nCXN = pMatNewX[0].length;
			if ((nCase === 2 && K !== nCXN) || (nCase === 3 && K !== nRXN)) {
				return;
			}
			nCountXN = nCXN * nRXN;
			for (var i = 0; i < pMatNewX.length; i++) {
				for (var j = 0; j < pMatNewX[i].length; j++) {
					if (!pMatNewX[i][j]) {
						//PushIllegalArgument();
						return false;
					} else {
						pMatNewX[i][j] = pMatNewX[i][j].getValue();
					}
				}
			}
		}

		var pResMat; // size depends on nCase
		if (nCase === 1) {
			pResMat = GetNewMat(nCXN, nRXN);
		} else {
			if (nCase === 2) {
				pResMat = GetNewMat(1, nRXN);
			} else {
				pResMat = GetNewMat(nCXN, 1);
			}
		}
		if (!pResMat) {
			//PushError(FormulaError::CodeOverflow);
			return;
		}

		// Uses sum(x-MeanX)^2 and not [sum x^2]-N * MeanX^2 in case bConstant.
		// Clone constant matrices, so that Mat = Mat - Mean is possible.
		var fMeanY = 0.0;
		if (bConstant) {
			var pCopyX = matrixClone(pMatX);
			var pCopyY = matrixClone(pMatY);
			if (!pCopyX || !pCopyY) {
				//PushError(FormulaError::MatrixSize);
				return;
			}
			pMatX = pCopyX;
			pMatY = pCopyY;
			// DeltaY is possible here; DeltaX depends on nCase, so later
			fMeanY = lcl_GetMeanOverAll(pMatY, N);
			for (var i = 0; i < pMatY.length; i++) {
				for (var j = 0; j < pMatY[i].length; j++) {
					pMatY[i][j] = approxSub(pMatY[i][j], fMeanY);
				}
			}
		}

		if (nCase === 1) {
			// calculate simple regression
			var fMeanX = 0.0;
			if (bConstant) {   // Mat = Mat - Mean
				fMeanX = lcl_GetMeanOverAll(pMatX, N);
				for (var i = 0; i < pMatX.length; i++) {
					for (var j = 0; j < pMatX[i].length; j++) {
						pMatX[i][j] = approxSub(pMatX[i][j], fMeanX);
					}
				}
			}
			var fSumXY = lcl_GetSumProduct(pMatX, pMatY, N);
			var fSumX2 = lcl_GetSumProduct(pMatX, pMatX, N);
			if (fSumX2 === 0.0) {
				//PushNoValue(); // all x-values are identical
				return;
			}
			var fSlope = fSumXY / fSumX2;
			var fHelp;
			if (bConstant) {
				var fIntercept = fMeanY - fSlope * fMeanX;
				for (var i = 0; i < pResMat.length; i++) {
					for (var j = 0; j < pResMat[i].length; j++) {
						fHelp = pMatNewX[i][j] * fSlope + fIntercept;
						pResMat[i][j] = _bGrowth ? Math.exp(fHelp) : fHelp;
					}
				}
			} else {
				for (var i = 0; i < pResMat.length; i++) {
					for (var j = 0; j < pResMat[i].length; j++) {
						fHelp = pMatNewX[i][j] * fSlope;
						pResMat[i][j] = _bGrowth ? Math.exp(fHelp) : fHelp;
					}
				}
			}
		} else // calculate multiple regression;
		{
			if (nCase === 2) // Y is column
			{
				var aVecR = []; // for QR decomposition
				// Enough memory for needed matrices?
				var pMeans = GetNewMat(K, 1); // mean of each column
				var pSlopes = GetNewMat(1, K); // from b1 to bK
				if (!pMeans || !pSlopes) {
					//PushError(FormulaError::CodeOverflow);
					return;
				}
				if (bConstant) {
					lcl_CalculateColumnMeans(pMatX, pMeans, K, N);
					lcl_CalculateColumnsDelta(pMatX, pMeans, K, N);
				}
				if (!lcl_CalculateQRdecomposition(pMatX, aVecR, K, N)) {
					//PushNoValue();
					return;
				}
				// Later on we will divide by elements of aVecR, so make sure
				// that they aren't zero.
				var bIsSingular = false;
				for (var row = 0; row < K && !bIsSingular; row++) {
					bIsSingular = bIsSingular || aVecR[row] === 0.0;
				}

				if (bIsSingular) {
					//PushNoValue();
					return;
				}
				// Z := Q' Y; Y is overwritten with result Z
				for (var col = 0; col < K; col++) {
					lcl_ApplyHouseholderTransformation(pMatX, col, pMatY, N);
				}
				// B = R^(-1) * Q' * Y <=> B = R^(-1) * Z <=> R * B = Z
				// result Z should have zeros for index>=K; if not, ignore values
				for (var col = 0; col < K; col++) {
					pSlopes[col][0] = pMatY[col][0];
				}
				lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pSlopes, K, false);

				// Fill result matrix
				lcl_MFastMult(pMatNewX, pSlopes, pResMat, nRXN, K, 1);
				if (bConstant) {
					var fIntercept = fMeanY - lcl_GetSumProduct(pMeans, pSlopes, K);
					for (var row = 0; row < nRXN; row++) {
						pResMat[0][row] = pResMat[0][row] + fIntercept;
					}

				}
				if (_bGrowth) {
					for (var i = 0; i < nRXN; i++) {
						pResMat[i] = Math.exp(pResMat[i]);
					}

				}
			} else { // nCase == 3, Y is row, all matrices are transposed

				var aVecR = []; // for QR decomposition
				// Enough memory for needed matrices?
				var pMeans = GetNewMat(K, 1); // mean of each row
				var pSlopes = GetNewMat(K, 1); // row from b1 to bK
				if (!pMeans || !pSlopes) {
					//PushError(FormulaError::CodeOverflow);
					return;
				}
				if (bConstant) {
					lcl_CalculateRowMeans(pMatX, pMeans, N, K);
					lcl_CalculateRowsDelta(pMatX, pMeans, N, K);
				}
				if (!lcl_TCalculateQRdecomposition(pMatX, aVecR, K, N)) {
					//PushNoValue();
					return;
				}
				// Later on we will divide by elements of aVecR, so make sure
				// that they aren't zero.
				var bIsSingular = false;
				for (var row = 0; row < K && !bIsSingular; row++) {
					bIsSingular = bIsSingular || aVecR[row] === 0.0;
				}
				if (bIsSingular) {
					//PushNoValue();
					return;
				}
				// Z := Q' Y; Y is overwritten with result Z
				for (var row = 0; row < K; row++) {
					lcl_TApplyHouseholderTransformation(pMatX, row, pMatY, N);
				}
				// B = R^(-1) * Q' * Y <=> B = R^(-1) * Z <=> R * B = Z
				// result Z should have zeros for index>=K; if not, ignore values
				for (var col = 0; col < K; col++) {
					pSlopes[col][0] = pMatY[0][col];
				}
				lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pSlopes, K, true);

				// Fill result matrix
				lcl_MFastMult(pSlopes, pMatNewX, pResMat, 1, K, nCXN);
				if (bConstant) {
					var fIntercept = fMeanY - lcl_GetSumProduct(pMeans, pSlopes, K);
					for (var col = 0; col < nCXN; col++) {
						pResMat[col][0] = pResMat[col][0] + fIntercept;
					}

				}
				if (_bGrowth) {
					for (var i = 0; i < nCXN; i++) {
						pResMat[i][0] = Math.exp(pResMat[i][0]);
					}

				}
			}
		}

		return pResMat;
	}

	function lcl_ApplyUpperRightTriangle(pMatA, pVecR, pMatB, pMatZ, nK, bIsTransposed) {
		// ScMatrix matrices are zero based, index access (column,row)
		for (var row = 0; row < nK; row++) {
			var fSum = pVecR[row] * pMatB[row][0];
			for (var col = row + 1; col < nK; col++) {
				if (bIsTransposed) {
					fSum += pMatA[row][col] * pMatB[col][0];
				} else {
					fSum += pMatA[col][row] * pMatB[col][0];
				}
			}
			pMatZ[row][0] = fSum;
		}
	}

	function lcl_SolveWithLowerLeftTriangle(pMatA, pVecR, pMatT, nK, bIsTransposed) {
		// ScMatrix matrices are zero based, index access (column,row)
		for (var row = 0; row < nK; row++) {
			var fSum = pMatT[row][0];
			for (var col = 0; col < row; col++) {
				if (bIsTransposed) {
					fSum -= pMatA[col][row] * pMatT[col][0];
				} else {
					fSum -= pMatA[row][col] * pMatT[col][0];
				}
			}
			pMatT[row][0] = fSum / pVecR[row];
		}
	}

	function lcl_GetSSresid(pMatX, pMatY, fSlope, nN) {
		var fSum = 0.0;
		for (var i = 0; i < nN; i++) {
			//var fTemp = pMatY->GetDouble(i) - fSlope * pMatX->GetDouble(i);
			//fSum += fTemp * fTemp;
		}
		return fSum;
	}

	function CalculateRGPRKP(pMatY, pMatX, bConstant, bStats, _bRKP) {
		var getMatrixParams = CheckMatrix(_bRKP, pMatX, pMatY);
		if (!getMatrixParams) {
			return;
		}

		// 1 = simple; 2 = multiple with Y as column; 3 = multiple with Y as row
		var nCase = getMatrixParams.nCase;
		var nCX = getMatrixParams.nCX, nCY = getMatrixParams.nCY; // number of columns
		var nRX = getMatrixParams.nRX, nRY = getMatrixParams.nRY; //number of rows
		var K = getMatrixParams.M, N = getMatrixParams.N; // K=number of variables X, N=number of data samples
		pMatX = getMatrixParams.pMatX, pMatY = getMatrixParams.pMatY;

		// Enough data samples?
		if ((bConstant && (N < K + 1)) || (!bConstant && (N < K)) || (N < 1) || (K < 1)) {
			//PushIllegalParameter();
			return;
		}

		var pResMat;
		if (bStats) {
			pResMat = GetNewMat(K + 1, 5);
		} else {
			pResMat = GetNewMat(K + 1, 1);
		}
		if (!pResMat) {
			//PushError(FormulaError::CodeOverflow);
			return;
		}


		//********
		// Fill unused cells in pResMat; order (column,row)
		if (bStats) {
			for (var i = 2; i < K + 1; i++) {
				pResMat[i][2] = null;//->PutError( FormulaError::NotAvailable, i, 2);
				pResMat[i][3] = null;//->PutError( FormulaError::NotAvailable, i, 3);
				pResMat[i][4] = null;//->PutError( FormulaError::NotAvailable, i, 4);
			}
		}


		// Uses sum(x-MeanX)^2 and not [sum x^2]-N * MeanX^2 in case bConstant.
		// Clone constant matrices, so that Mat = Mat - Mean is possible.
		var fMeanY = 0.0;
		if (bConstant) {
			var pNewX = matrixClone(pMatX);
			var pNewY = matrixClone(pMatY);
			if (!pNewX || !pNewY) {
				//PushError(FormulaError::MatrixSize);
				return;
			}
			pMatX = pNewX;
			pMatY = pNewY;
			// DeltaY is possible here; DeltaX depends on nCase, so later
			fMeanY = lcl_GetMeanOverAll(pMatY, N);
			for (var i = 0; i < pMatY.length; i++) {
				for (var j = 0; j < pMatY[i].length; j++) {
					pMatY[i][j] = approxSub(pMatY[i][j], fMeanY);
				}
			}
		}


		if (nCase === 1) {
			// calculate simple regression
			var fMeanX = 0.0;
			if (bConstant) {   // Mat = Mat - Mean
				fMeanX = lcl_GetMeanOverAll(pMatX, N);
				for (var i = 0; i < pMatX.length; i++) {
					for (var j = 0; j < pMatX[i].length; j++) {
						pMatX[i][j] = approxSub(pMatX[i][j], fMeanX);
					}
				}
			}
			var fSumXY = lcl_GetSumProduct(pMatX, pMatY, N);
			var fSumX2 = lcl_GetSumProduct(pMatX, pMatX, N);
			if (fSumX2 === 0.0) {
				//PushNoValue(); // all x-values are identical
				return;
			}
			var fSlope = fSumXY / fSumX2;
			var fIntercept = 0.0;

			if (bConstant) {
				fIntercept = fMeanY - fSlope * fMeanX;
			}

			pResMat[1][0] = _bRKP ? Math.exp(fIntercept) : fIntercept;
			pResMat[0][0] = _bRKP ? Math.exp(fSlope) : fSlope;

			if (bStats) {
				var fSSreg = fSlope * fSlope * fSumX2;
				pResMat[0][4] = fSSreg;

				var fDegreesFreedom = bConstant ? N - 2 : N - 1;
				pResMat[1][3] = fDegreesFreedom;

				var fSSresid = lcl_GetSSresid(pMatX, pMatY, fSlope, N);
				pResMat[1][4] = fSSresid;

				if (fDegreesFreedom === 0.0 || fSSresid === 0.0 || fSSreg === 0.0) {   // exact fit; test SSreg too, because SSresid might be
					// unequal zero due to round of errors
					pResMat[1][4] = 0;
					pResMat[0][3] = null;//->PutError( FormulaError::NotAvailable, 0, 3); // F
					pResMat[1][2] = 0;
					pResMat[0][1] = 0;
					if (bConstant) {
						pResMat[1][1] = 0;
					} else {
						pResMat[1][1] = null;
					}//->PutError( FormulaError::NotAvailable, 1, 1);

					pResMat[0][2] = 1;//->PutDouble(1.0, 0, 2); // R^2
				} else {
					var fFstatistic = (fSSreg / K) / (fSSresid / fDegreesFreedom);
					pResMat[0][3] = fFstatistic;//->PutDouble(fFstatistic, 0, 3);

					// standard error of estimate
					var fRMSE = Math.sqrt(fSSresid / fDegreesFreedom);
					pResMat[1][2] = fRMSE;

					var fSigmaSlope = fRMSE / Math.sqrt(fSumX2);
					pResMat[0][1] = fSigmaSlope;

					if (bConstant) {
						var fSigmaIntercept = fRMSE * Math.sqrt(fMeanX * fMeanX / fSumX2 + 1.0 / N);
						pResMat[1][1] = fSigmaIntercept;
					} else {
						pResMat[1][1] = null;//->PutError( FormulaError::NotAvailable, 1, 1);
					}

					var fR2 = fSSreg / (fSSreg + fSSresid);
					pResMat[0][2] = fR2;
				}
			}

		} else {
			// Uses a QR decomposition X = QR. The solution B = (X'X)^(-1) * X' * Y
			// becomes B = R^(-1) * Q' * Y
			if (nCase === 2) // Y is column
			{
				var aVecR = []; // for QR decomposition
				// Enough memory for needed matrices?
				var pMeans = GetNewMat(K, 1); // mean of each column
				var pMatZ; // for Q' * Y , inter alia
				if (bStats) {
					pMatZ = matrixClone(pMatY);
				}// Y is used in statistic, keep it
				else {
					pMatZ = pMatY;
				} // Y can be overwritten

				var pSlopes = GetNewMat(1, K); // from b1 to bK
				if (!pMeans || !pMatZ || !pSlopes) {
					//PushError(FormulaError::CodeOverflow);
					return;
				}
				if (bConstant) {
					lcl_CalculateColumnMeans(pMatX, pMeans, K, N);
					lcl_CalculateColumnsDelta(pMatX, pMeans, K, N);
				}
				if (!lcl_CalculateQRdecomposition(pMatX, aVecR, K, N)) {
					//PushNoValue();
					return;
				}
				// Later on we will divide by elements of aVecR, so make sure
				// that they aren't zero.
				var bIsSingular = false;
				for (var row = 0; row < K && !bIsSingular; row++) {
					bIsSingular = bIsSingular || aVecR[row] === 0;
				}

				if (bIsSingular) {
					//PushNoValue();
					return;
				}
				// Z = Q' Y;
				for (var col = 0; col < K; col++) {
					lcl_ApplyHouseholderTransformation(pMatX, col, pMatZ, N);
				}
				// B = R^(-1) * Q' * Y <=> B = R^(-1) * Z <=> R * B = Z
				// result Z should have zeros for index>=K; if not, ignore values
				for (var col = 0; col < K; col++) {
					pSlopes[col][0] = pMatY[col][0];
				}
				lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pSlopes, K, false);
				var fIntercept = 0.0;
				if (bConstant) {
					fIntercept = fMeanY - lcl_GetSumProduct(pMeans, pSlopes, K);
				}
				// Fill first line in result matrix
				pResMat[K][0] = _bRKP ? Math.exp(fIntercept) : fIntercept;
				for (var i = 0; i < K; i++) {
					pResMat[K - 1 - i][0] = _bRKP ? Math.exp(pSlopes[i][0]) : pSlopes[i][0];
				}


				if (bStats) {
					var fSSreg = 0.0;
					var fSSresid = 0.0;
					// re-use memory of Z;


					//*********
					//pMatZ->FillDouble(0.0, 0, 0, 0, N-1);


					// Z = R * Slopes
					lcl_ApplyUpperRightTriangle(pMatX, aVecR, pSlopes, pMatZ, K, false);
					// Z = Q * Z, that is Q * R * Slopes = X * Slopes
					for (var colp1 = K; colp1 > 0; colp1--) {
						lcl_ApplyHouseholderTransformation(pMatX, colp1 - 1, pMatZ, N);
					}
					fSSreg = lcl_GetSumProduct(pMatZ, pMatZ, N);


					//********
					// re-use Y for residuals, Y = Y-Z
					for (var row = 0; row < N; row++) {
						pMatY[row][0] = pMatY[row][0] - pMatZ[row][0];
					}


					fSSresid = lcl_GetSumProduct(pMatY, pMatY, N);
					pResMat[0][4] = fSSreg;
					pResMat[1][4] = fSSresid;

					var fDegreesFreedom = (bConstant) ? N - K - 1 : N - K;
					pResMat[1][3] = fDegreesFreedom;

					if (fDegreesFreedom === 0.0 || fSSresid === 0.0 || fSSreg === 0.0) {
						pResMat[1][4] = 0;
						pResMat[0][3] = null; //->PutError( FormulaError::NotAvailable, 0, 3); // F
						pResMat[1][2] = 0;//->PutDouble(0.0, 1, 2); // RMSE


						//********
						for (var i = 0; i < K; i++) {
							pResMat[K - 1 - i][1] = 0;//->PutDouble(0.0, K-1-i, 1);
						}


						// SigmaIntercept = RMSE * sqrt(...) = 0
						if (bConstant) {
							pResMat[K][1] = 0;
						} else {
							pResMat[K][1] = null;
						}//->PutError( FormulaError::NotAvailable, K, 1);

						//  R^2 = SSreg / (SSreg + SSresid) = 1.0
						pResMat[0][2] = 1; // R^2
					} else {
						var fFstatistic = (fSSreg / (K)) / (fSSresid / fDegreesFreedom);
						pResMat[0][3] = fFstatistic;

						// standard error of estimate = root mean SSE
						var fRMSE = Math.sqrt(fSSresid / fDegreesFreedom);
						pResMat[1][2] = fRMSE;

						// standard error of slopes
						// = RMSE * sqrt(diagonal element of (R' R)^(-1) )
						// standard error of intercept
						// = RMSE * sqrt( Xmean * (R' R)^(-1) * Xmean' + 1/N)
						// (R' R)^(-1) = R^(-1) * (R')^(-1). Do not calculate it as
						// a whole matrix, but iterate over unit vectors.
						var fSigmaIntercept = 0.0;
						var fPart; // for Xmean * single column of (R' R)^(-1)


						//********
						for (var col = 0; col < K; col++) {
							//re-use memory of MatZ
							//pMatZ->FillDouble(0.0,0,0,0,K-1); // Z = unit vector e
							pMatZ[col][0] = 1;//->PutDouble(1.0, col);
							//Solve R' * Z = e
							lcl_SolveWithLowerLeftTriangle(pMatX, aVecR, pMatZ, K, false);
							// Solve R * Znew = Zold
							lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pMatZ, K, false);
							// now Z is column col in (R' R)^(-1)
							var fSigmaSlope = fRMSE * Math.sqrt(pMatZ[col][0]);
							pResMat[K - 1 - col][1] = fSigmaSlope//->PutDouble(fSigmaSlope, K-1-col, 1);
							// (R' R) ^(-1) is symmetric
							if (bConstant) {
								fPart = lcl_GetSumProduct(pMeans, pMatZ, K);
								fSigmaIntercept += fPart * pMeans[0][col];
							}
						}


						if (bConstant) {
							fSigmaIntercept = fRMSE * Math.sqrt(fSigmaIntercept + 1.0 / N);
							pResMat[K][1] = fSigmaIntercept;
						} else {
							pResMat[K][1] = null;//->PutError( FormulaError::NotAvailable, K, 1);
						}

						var fR2 = fSSreg / (fSSreg + fSSresid);
						pResMat[0][2] = fR2;
					}
				}
			} else {
				// nCase == 3
				var aVecR = []; // for QR decomposition
				// Enough memory for needed matrices?
				var pMeans = GetNewMat(1, K); // mean of each row
				var pMatZ; // for Q' * Y , inter alia
				if (bStats) {
					pMatZ = matrixClone(pMatY);
				}// Y is used in statistic, keep it
				else {
					pMatZ = pMatY;
				} // Y can be overwritten
				var pSlopes = GetNewMat(K, 1); // from b1 to bK
				if (!pMeans || !pMatZ || !pSlopes) {
					//PushError(FormulaError::CodeOverflow);
					return;
				}
				if (bConstant) {
					lcl_CalculateRowMeans(pMatX, pMeans, N, K);
					lcl_CalculateRowsDelta(pMatX, pMeans, N, K);
				}

				if (!lcl_TCalculateQRdecomposition(pMatX, aVecR, K, N)) {
					//PushNoValue();
					return;
				}

				// Later on we will divide by elements of aVecR, so make sure
				// that they aren't zero.
				var bIsSingular = false;
				for (var row = 0; row < K && !bIsSingular; row++) {
					bIsSingular = bIsSingular || aVecR[row] === 0.0;
				}
				if (bIsSingular) {
					//PushNoValue();
					return;
				}
				// Z = Q' Y
				for (var row = 0; row < K; row++) {
					lcl_TApplyHouseholderTransformation(pMatX, row, pMatZ, N);
				}


				//*******
				// B = R^(-1) * Q' * Y <=> B = R^(-1) * Z <=> R * B = Z
				// result Z should have zeros for index>=K; if not, ignore values
				for (var col = 0; col < K; col++) {
					pSlopes[col][0] = pMatZ[col][0];
				}


				lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pSlopes, K, true);
				var fIntercept = 0.0;
				if (bConstant) {
					fIntercept = fMeanY - lcl_GetSumProduct(pMeans, pSlopes, K);
				}
				// Fill first line in result matrix
				pResMat[K][0] = _bRKP ? Math.exp(fIntercept) : fIntercept;//->PutDouble(_bRKP ? exp(fIntercept) : fIntercept, K, 0 );
				for (var i = 0; i < K; i++) {
					pResMat[K - 1 - i][0] = _bRKP ? Math.exp(pSlopes[i][0]) : pSlopes[i][0];
				}

				if (bStats) {
					var fSSreg = 0.0;
					var fSSresid = 0.0;
					// re-use memory of Z;


					//*********
					//pMatZ->FillDouble(0.0, 0, 0, N-1, 0);


					// Z = R * Slopes
					lcl_ApplyUpperRightTriangle(pMatX, aVecR, pSlopes, pMatZ, K, true);
					// Z = Q * Z, that is Q * R * Slopes = X * Slopes
					for (var rowp1 = K; rowp1 > 0; rowp1--) {
						lcl_TApplyHouseholderTransformation(pMatX, rowp1 - 1, pMatZ, N);
					}
					fSSreg = lcl_GetSumProduct(pMatZ, pMatZ, N);


					//********
					// re-use Y for residuals, Y = Y-Z
					for (var col = 0; col < N; col++) {
						pMatY[0][col] = pMatY[0][col] - pMatZ[0][col];
					}


					fSSresid = lcl_GetSumProduct(pMatY, pMatY, N);
					pResMat[0][4] = fSSreg;
					pResMat[1][4] = fSSresid;

					var fDegreesFreedom = bConstant ? N - K - 1 : N - K;
					pResMat[1][3] = fDegreesFreedom;

					if (fDegreesFreedom === 0.0 || fSSresid === 0.0 || fSSreg === 0.0) {   // exact fit; incl. case observed values Y are identical
						pResMat[1][4] = 0; // SSresid
						// F = (SSreg/K) / (SSresid/df) = #DIV/0!
						pResMat[0][3] = null; // F
						// RMSE = sqrt(SSresid / df) = sqrt(0 / df) = 0
						pResMat[1][2] = 0; // RMSE
						// SigmaSlope[i] = RMSE * sqrt(matrix[i,i]) = 0 * sqrt(...) = 0


						for (var i = 0; i < K; i++) {
							pResMat[K - 1 - i][1] = 0;
						}


						// SigmaIntercept = RMSE * sqrt(...) = 0
						if (bConstant) {
							pResMat[K][1] = 0;
						}//SigmaIntercept
						else {
							pResMat[K][1] = null;
						}//->PutError( FormulaError::NotAvailable, K, 1);

						//  R^2 = SSreg / (SSreg + SSresid) = 1.0
						pResMat[0][2] = 1; // R^2
					} else {
						var fFstatistic = (fSSreg / K) / (fSSresid / fDegreesFreedom);
						pResMat[0][3] = fFstatistic;

						// standard error of estimate = root mean SSE
						var fRMSE = Math.sqrt(fSSresid / fDegreesFreedom);
						pResMat[1][2] = fRMSE;

						// standard error of slopes
						// = RMSE * sqrt(diagonal element of (R' R)^(-1) )
						// standard error of intercept
						// = RMSE * sqrt( Xmean * (R' R)^(-1) * Xmean' + 1/N)
						// (R' R)^(-1) = R^(-1) * (R')^(-1). Do not calculate it as
						// a whole matrix, but iterate over unit vectors.
						// (R' R) ^(-1) is symmetric


						//********
						var fSigmaIntercept = 0.0;
						var fPart; // for Xmean * single col of (R' R)^(-1)
						for (var row = 0; row < K; row++) {
							//re-use memory of MatZ
							//pMatZ->FillDouble(0.0,0,0,K-1,0); // Z = unit vector e
							pMatZ[0][row] = 1;//->PutDouble(1.0, row);
							//Solve R' * Z = e
							lcl_SolveWithLowerLeftTriangle(pMatX, aVecR, pMatZ, K, true);
							// Solve R * Znew = Zold
							lcl_SolveWithUpperRightTriangle(pMatX, aVecR, pMatZ, K, true);
							// now Z is column col in (R' R)^(-1)
							var fSigmaSlope = fRMSE * Math.sqrt(pMatZ[0][row]);
							pResMat[K - 1 - row][1] = fSigmaSlope;
							if (bConstant) {
								fPart = lcl_GetSumProduct(pMeans, pMatZ, K);
								fSigmaIntercept += fPart * pMeans[0][row];
							}
						}


						if (bConstant) {
							fSigmaIntercept = fRMSE * Math.sqrt(fSigmaIntercept + 1.0 / N);
							pResMat[K][1] = fSigmaIntercept;
						} else {
							pResMat[K][1] = null;
						}

						var fR2 = fSSreg / (fSSreg + fSSresid);
						pResMat[0][2] = fR2;
					}
				}
			}
		}
		return pResMat;
	}

	function getBoolValue(val, defaultValue) {
		var res = undefined !== defaultValue ? defaultValue : null;

		if (!val) {
			return res;
		}

		if (cElementType.number === val.type) {
			res = val.tocBool().value;
		} else if (cElementType.bool === val.type) {
			res = val.value;
		}
		return res;
	}

	function GAMMADISTFUNCTION(fp, fAlpha, fBeta) {
		this.fp = fp;
		this.fAlpha = fAlpha;
		this.fBeta = fBeta;
	}

	GAMMADISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var gammaDistVal = getGammaDist(x, this.fAlpha, this.fBeta);
		res = this.fp - gammaDistVal;
		return res;
	};

	function BETADISTFUNCTION(fp, fAlpha, fBeta) {
		this.fp = fp;
		this.fAlpha = fAlpha;
		this.fBeta = fBeta;
	}

	BETADISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var betaDistVal = getBetaDist(x, this.fAlpha, this.fBeta);
		res = this.fp - betaDistVal;
		return res;
	};

	function CHIDISTFUNCTION(fp, fDF) {
		this.fp = fp;
		this.fDF = fDF;
	}

	CHIDISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var betaDistVal = getChiDist(x, this.fDF);
		res = this.fp - betaDistVal;
		return res;
	};

	function CHISQDISTFUNCTION(fp, fDF) {
		this.fp = fp;
		this.fDF = fDF;
	}

	CHISQDISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var betaDistVal = getChiSqDistCDF(x, this.fDF);
		res = this.fp - betaDistVal;
		return res;
	};

	function FDISTFUNCTION(fp, fF1, fF2) {
		this.fp = fp;
		this.fF1 = fF1;
		this.fF2 = fF2;
	}

	FDISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var betaDistVal = getFDist(x, this.fF1, this.fF2);
		res = this.fp - betaDistVal;
		return res;
	};

	function TDISTFUNCTION(fp, fDF, nT) {
		this.fp = fp;
		this.fDF = fDF;
		this.nT = nT;
	}

	TDISTFUNCTION.prototype.GetValue = function (x) {
		var res;
		var betaDistVal = getTDist(x, this.fDF, this.nT);
		res = this.fp - betaDistVal;
		return res;
	};


	function ScETSForecastCalculation(nSize) {
		//SvNumberFormatter* mpFormatter;
		this.maRange = [];   // data (X, Y)
		this.mpBase = [];                     // calculated base value array
		this.mpTrend = [];                    // calculated trend factor array
		this.mpPerIdx = [];                   // calculated periodical deviation array, not used with eds
		this.mpForecast = [];                 // forecasted value array
		this.mnSmplInPrd = 0;                 // samples per period
		this.mfStepSize = 0;                  // increment of X in maRange
		this.mfAlpha, this.mfBeta, this.mfGamma;    // constants to minimise the RMSE in the ES-equations
		this.mnCount = nSize;                     // No of data points
		this.mbInitialised;
		this.mnMonthDay;                     // n-month X-interval, value is day of month
		// accuracy indicators
		this.mfMAE;                       // mean absolute error
		this.mfMASE;                      // mean absolute scaled error
		this.mfMSE;                       // mean squared error (variation)
		this.mfRMSE;                      // root mean squared error (standard deviation)
		this.mfSMAPE;                     // symmetric mean absolute error
		//FormulaError mnErrorValue;
		this.bAdditive;                     // true: additive method, false: multiplicative method
		this.bEDS;                          // true: EDS, false: ETS

		// constants used in determining best fit for alpha, beta, gamma
		this.cfMinABCResolution = 0.001;  // minimum change of alpha, beta, gamma
		this.cnScenarios = 1000;   // No. of scenarios to calculate for PI calculations

		/*bool initData();
		 bool prefillBaseData();
		 bool prefillTrendData();
		 bool prefillPerIdx();
		 bool initCalc();
		 void refill();
		 SCSIZE CalcPeriodLen();
		 void CalcAlphaBetaGamma();
		 void CalcBetaGamma();
		 void CalcGamma();
		 void calcAccuracyIndicators();
		 bool GetForecast( double fTarget, double& rForecast );
		 double RandDev();
		 double convertXtoMonths( double x );*/
	}

	/*ScETSForecastCalculation::ScETSForecastCalculation( nSize, pFormatter )
	 : mpFormatter(pFormatter)
	 , mpBase(nullptr)
	 , mpTrend(nullptr)
	 , mpPerIdx(nullptr)
	 , mpForecast(nullptr)
	 , mnSmplInPrd(0)
	 , mfStepSize(0.0)
	 , mfAlpha(0.0)
	 , mfBeta(0.0)
	 , mfGamma(0.0)
	 , mnCount(nSize)
	 , mbInitialised(false)
	 , mnMonthDay(0)
	 , mfMAE(0.0)
	 , mfMASE(0.0)
	 , mfMSE(0.0)
	 , mfRMSE(0.0)
	 , mfSMAPE(0.0)
	 , mnErrorValue(FormulaError::NONE)
	 , bAdditive(false)
	 , bEDS(false)
	 {
	 maRange.reserve( mnCount );
	 }*/

	ScETSForecastCalculation.prototype = Object.create(ScETSForecastCalculation.prototype);
	ScETSForecastCalculation.prototype.constructor = ScETSForecastCalculation;


	ScETSForecastCalculation.prototype.PreprocessDataRange =
		function (rMatX, rMatY, rSmplInPrd, bDataCompletion, nAggregation, rTMat, eETSType) {
			var nColMatX = rMatX.length;
			var nRowMatX = rMatX[0].length;
			var nColMatY = rMatY.length;
			var nRowMatY = rMatY[0].length;

			if (nColMatX !== nColMatY || nRowMatX !== nRowMatY && !checkNumericMatrix(rMatX) ||
				!checkNumericMatrix(rMatY)) {
				return new cError(cErrorType.not_available);
			}

			this.bEDS = ( rSmplInPrd === 0 );
			this.bAdditive = /*( eETSType == etsAdd || eETSType == etsPIAdd || eETSType == etsStatAdd )*/true;

			this.mnCount = rMatX.length;
			var maRange = this.maRange;
			for (var i = 0; i < this.mnCount; i++) {
				maRange.push({X: rMatX[i][0].value, Y: rMatY[i][0].value});
			}

			maRange.sort(function (a, b) {
				return a.X - b.X;
			});

			if (rTMat) {
				if (/*eETSType != etsPIAdd && eETSType != etsPIMult*/true) {
					if (rTMat[0][0].getValue() < maRange[0].X) {
						return new cError(cErrorType.not_numeric);
					}
				} else {
					if (rTMat[0] < maRange[this.mnCount - 1].X) {
						return new cError(cErrorType.wrong_value_type);
					}
				}
			}

			var aDate = Date.prototype.getDateFromExcel(maRange[0].X);
			this.mnMonthDay = aDate.getDate();
			for (var i = 1; i < this.mnCount && this.mnMonthDay; i++) {
				var aDate1 = Date.prototype.getDateFromExcel(maRange[i].X);
				if (aDate !== aDate1) {
					if (aDate1.getDate() !== this.mnMonthDay) {
						this.mnMonthDay = 0;
					}
				}
			}

			this.mfStepSize = Number.MAX_VALUE;
			if (this.mnMonthDay) {
				for (var i = 0; i < this.mnCount; i++) {
					var aDate = Date.prototype.getDateFromExcel(maRange[i].X);
					maRange[i].X = aDate.getUTCFullYear() * 12 + aDate.getMonth();
				}
			}

			for (var i = 1; i < this.mnCount; i++) {

				var fStep = maRange[i].X - maRange[i - 1].X;
				if (fStep === 0.0) {
					if (nAggregation === 0) {
						return new cError(cErrorType.wrong_value_type);
					}

					var fTmp = maRange[i - 1].Y;
					var nCounter = 1;
					switch (nAggregation) {
						case 1 : // AVERAGE (default)
							while (i < this.mnCount && maRange[i].X === maRange[i - 1].X) {
								maRange.splice(i, 1);
								--this.mnCount;
							}
							break;
						case 7 : // SUM
							while (i < mnCount && maRange[i].X === maRange[i - 1].X) {
								fTmp += maRange[i].Y;
								maRange.splice(i, 1);
								--this.mnCount;
							}
							maRange[i - 1].Y = fTmp;
							break;

						case 2 : // COUNT
						case 3 : // COUNTA (same as COUNT as there are no non-numeric Y-values)
							while (i < this.mnCount && maRange[i].X === maRange[i - 1].X) {
								nCounter++;
								maRange.splice(i, 1);
								--this.mnCount;
							}
							maRange[i - 1].Y = nCounter;
							break;

						case 4 : // MAX
							while (i < this.mnCount && maRange[i].X === maRange[i - 1].X) {
								if (maRange[i].Y > fTmp) {
									fTmp = maRange[i].Y;
								}
								maRange.splice(i, 1);
								--this.mnCount;
							}
							maRange[i - 1].Y = fTmp;
							break;

						case 5 : // MEDIAN

							var aTmp = [];
							aTmp.push(maRange[i - 1].Y);
							while (i < mnCount && maRange[i].X === maRange[i - 1].X) {
								aTmp.push(maRange[i].Y);
								nCounter++;
								maRange.splice(i, 1);
								--this.mnCount;
							}

							//sort( aTmp.begin(), aTmp.end() );

							if (nCounter % 2) {
								maRange[i - 1].Y = aTmp[nCounter / 2];
							} else {
								maRange[i - 1].Y = ( aTmp[nCounter / 2] + aTmp[nCounter / 2 - 1] ) / 2.0;
							}

							break;

						case 6 : // MIN
							while (i < this.mnCount && maRange[i].X === maRange[i - 1].X) {
								if (maRange[i].Y < fTmp) {
									fTmp = maRange[i].Y;
								}
								maRange.splice(i, 1);
								--this.mnCount;
							}
							maRange[i - 1].Y = fTmp;
							break;
					}

					if (i < this.mnCount - 1) {
						fStep = maRange[i].X - maRange[i - 1].X;
					} else {
						fStep = this.mfStepSize;
					}
				}

				if (fStep > 0 && fStep < this.mfStepSize) {
					this.mfStepSize = fStep;
				}
			}

			// step must be constant (or gap multiple of step)
			var bHasGap = false;
			for (var i = 1; i < this.mnCount && !bHasGap; i++) {
				var fStep = maRange[i].X - maRange[i - 1].X;

				if (fStep != this.mfStepSize) {
					if (Math.fmod(fStep, this.mfStepSize) !== 0.0) {
						return new cError(cErrorType.wrong_value_type);
					}
					bHasGap = true;
				}
			}

			if (bHasGap) {
				var nMissingXCount = 0;
				var fOriginalCount = this.mnCount;
				if (this.mnMonthDay) {
					aDate = Date.prototype.getDateFromExcel(maRange[0].X);
				}

				for (var i = 1; i < this.mnCount; i++) {
					var fDist;
					if (this.mnMonthDay) {
						var aDate1 = Date.prototype.getDateFromExcel(maRange[i].X);
						fDist = 12 * ( aDate1.getUTCFullYear() - aDate.getUTCFullYear() ) +
							( aDate1.getMonth() - aDate.getMonth() );
						aDate = aDate1;
					} else {
						fDist = maRange[i].X - maRange[i - 1].X;
					}

					if (fDist > this.mfStepSize) {
						// gap, insert missing data points
						var fYGap = ( maRange[i].Y + maRange[i - 1].Y ) / 2.0;
						for (var fXGap = maRange[i - 1].X + this.mfStepSize; fXGap < maRange[i].X;
							 fXGap += this.mfStepSize) {
							var newAddElem = {X: fXGap, Y: ( bDataCompletion ? fYGap : 0.0 )};
							maRange.splice(i, 1, newAddElem);
							i++;
							this.mnCount++;
							nMissingXCount++;
							if (nMissingXCount / fOriginalCount > 0.3) {
								// maximum of 30% missing points exceeded
								return new cError(cErrorType.wrong_value_type);
							}
						}
					}
				}
			}

			if (rSmplInPrd !== 1) {
				this.mnSmplInPrd = rSmplInPrd;
			} else {
				this.mnSmplInPrd = this.CalcPeriodLen();
				if (this.mnSmplInPrd === 1) {
					this.bEDS = true; // period length 1 means no periodic data: EDS suffices
				}
			}

			if (!this.initData()) {
				return false;  // note: mnErrorValue is set in called function(s)
			}

			return true;
		};


	ScETSForecastCalculation.prototype.initData = function () {
		// give various vectors size and initial value
		this.mpBase = [];
		fillArray(this.mpBase, 0, this.mnCount);

		this.mpTrend = [];
		fillArray(this.mpTrend, 0, this.mnCount);

		if (!this.bEDS) {
			this.mpPerIdx = [];
			fillArray(this.mpPerIdx, 0, this.mnCount);
		}

		this.mpForecast = [];
		fillArray(this.mpForecast, 0, this.mnCount);
		this.mpForecast[0] = this.maRange[0].Y;

		if (this.prefillTrendData()) {
			if (this.prefillPerIdx()) {
				if (this.prefillBaseData()) {
					return true;
				}
			}
		}
		return false;
	};

	ScETSForecastCalculation.prototype.prefillTrendData = function () {
		if (this.bEDS) {
			this.mpTrend[0] = ( this.maRange[this.mnCount - 1].Y - this.maRange[0].Y ) / ( this.mnCount - 1 );
		} else {
			// we need at least 2 periods in the data range
			if (this.mnCount < 2 * this.mnSmplInPrd) {
				return new cError(cErrorType.wrong_value_type);
			}

			var fSum = 0.0;
			for (var i = 0; i < this.mnSmplInPrd; i++) {
				fSum += this.maRange[i + this.mnSmplInPrd].Y - this.maRange[i].Y;
			}
			var fTrend = fSum / ( this.mnSmplInPrd * this.mnSmplInPrd );

			this.mpTrend[0] = fTrend;
		}

		return true;
	};

	ScETSForecastCalculation.prototype.prefillPerIdx = function () {
		if (!this.bEDS) {
			// use as many complete periods as available
			if (this.mnSmplInPrd == 0) {
				// should never happen; if mnSmplInPrd equals 0, bEDS is true
				//mnErrorValue = FormulaError::UnknownState;
				return false;
			}

			var nPeriods = parseInt(this.mnCount / this.mnSmplInPrd);//scsize

			var aPeriodAverage = [];
			for (var i = 0; i < nPeriods; i++) {
				aPeriodAverage[i] = 0;
				for (var j = 0; j < this.mnSmplInPrd; j++) {
					aPeriodAverage[i] += this.maRange[i * this.mnSmplInPrd + j].Y;
				}
				aPeriodAverage[i] /= this.mnSmplInPrd;
				if (aPeriodAverage[i] === 0.0) {
					//SAL_WARN( "sc.core", "prefillPerIdx(), average of 0 will cause divide by zero error, quitting calculation" );
					//mnErrorValue = FormulaError::DivisionByZero;
					return false;
				}
			}

			for (var j = 0; j < this.mnSmplInPrd; j++) {
				var fI = 0.0;
				for (var i = 0; i < nPeriods; i++) {
					// adjust average value for position within period
					if (this.bAdditive) {
						fI += ( this.maRange[i * this.mnSmplInPrd + j].Y -
							( aPeriodAverage[i] + ( j - 0.5 * ( this.mnSmplInPrd - 1 ) ) * this.mpTrend[0] ) );
					} else {
						fI += ( this.maRange[i * this.mnSmplInPrd + j].Y /
							( aPeriodAverage[i] + ( j - 0.5 * ( this.mnSmplInPrd - 1 ) ) * this.mpTrend[0] ) );
					}
				}
				this.mpPerIdx[j] = fI / nPeriods;
			}
		}
		return true;
	};

	ScETSForecastCalculation.prototype.randDev = function () {
		return this.mfRMSE * gaussinv(0.57426331936068653);
	};

	ScETSForecastCalculation.prototype.prefillBaseData = function () {
		if (this.bEDS) {
			this.mpBase[0] = this.maRange[0].Y;
		} else {
			this.mpBase[0] = this.maRange[0].Y / this.mpPerIdx[0];
		}

		return true;
	};

	ScETSForecastCalculation.prototype.initCalc = function () {
		if (!this.mbInitialised) {
			this.CalcAlphaBetaGamma();

			this.mbInitialised = true;
			this.calcAccuracyIndicators();
		}
		return true;
	};


	ScETSForecastCalculation.prototype.calcAccuracyIndicators = function () {
		var fSumAbsErr = 0.0;
		var fSumDivisor = 0.0;
		var fSumErrSq = 0.0;
		var fSumAbsPercErr = 0.0;

		for (var i = 1; i < this.mnCount; i++) {
			var fError = this.mpForecast[i] - this.maRange[i].Y;
			fSumAbsErr += Math.abs(fError);
			fSumErrSq += fError * fError;
			fSumAbsPercErr += Math.abs(fError) / ( Math.abs(this.mpForecast[i]) + Math.abs(this.maRange[i].Y) );
		}

		for (var i = 2; i < this.mnCount; i++) {
			fSumDivisor += Math.abs(this.maRange[i].Y - this.maRange[i - 1].Y);
		}

		var nCalcCount = this.mnCount - 1;
		this.mfMAE = fSumAbsErr / nCalcCount;
		this.mfMASE = fSumAbsErr / ( nCalcCount * fSumDivisor / ( nCalcCount - 1 ) );
		this.mfMSE = fSumErrSq / nCalcCount;
		this.mfRMSE = Math.sqrt(this.mfMSE);
		this.mfSMAPE = fSumAbsPercErr * 2.0 / nCalcCount;
	};


	ScETSForecastCalculation.prototype.CalcPeriodLen = function () {
		var nBestVal = this.mnCount;
		var fBestME = Number.MAX_VALUE;
		var maRange = this.maRange;

		for (var nPeriodLen = parseInt(this.mnCount / 2); nPeriodLen >= 1; nPeriodLen--) {
			var fMeanError = 0.0;
			var nPeriods = parseInt(this.mnCount / nPeriodLen);
			var nStart = parseInt(this.mnCount - ( nPeriods * nPeriodLen ) + 1);
			for (var i = nStart; i < ( this.mnCount - nPeriodLen ); i++) {
				fMeanError += Math.abs(( maRange[i].Y - maRange[i - 1].Y ) -
					( maRange[nPeriodLen + i].Y - maRange[nPeriodLen + i - 1].Y ));
			}
			fMeanError /= ( nPeriods - 1 ) * nPeriodLen - 1;

			if (fMeanError <= fBestME || fMeanError === 0.0) {
				nBestVal = nPeriodLen;
				fBestME = fMeanError;
			}
		}
		return nBestVal;
	};


	ScETSForecastCalculation.prototype.CalcAlphaBetaGamma = function () {
		var f0 = 0.0;
		this.mfAlpha = f0;
		if (this.bEDS) {
			this.mfBeta = 0.0; // beta is not used with EDS
			this.CalcGamma();
		} else {
			this.CalcBetaGamma();
		}
		this.refill();
		var fE0 = this.mfMSE;

		var f2 = 1.0;
		this.mfAlpha = f2;
		if (this.bEDS) {
			this.CalcGamma();
		} else {
			this.CalcBetaGamma();
		}
		this.refill();
		var fE2 = this.mfMSE;

		var f1 = 0.5;
		this.mfAlpha = f1;
		if (this.bEDS) {
			this.CalcGamma();
		} else {
			this.CalcBetaGamma();
		}
		this.refill();

		if (fE0 === this.mfMSE && this.mfMSE === fE2) {
			this.mfAlpha = 0;
			if (this.bEDS) {
				this.CalcGamma();
			} else {
				this.CalcBetaGamma();
			}
			this.refill();
			return;
		}

		while (( f2 - f1 ) > this.cfMinABCResolution) {
			if (fE2 > fE0) {
				f2 = f1;
				fE2 = this.mfMSE;
				f1 = ( f0 + f1 ) / 2;
			} else {
				f0 = f1;
				fE0 = this.mfMSE;
				f1 = ( f1 + f2 ) / 2;
			}
			this.mfAlpha = f1;
			if (this.bEDS) {
				this.CalcGamma();
			} else {
				this.CalcBetaGamma();
			}
			this.refill();
		}
		if (fE2 > fE0) {
			if (fE0 < this.mfMSE) {
				this.mfAlpha = f0;
				if (this.bEDS) {
					this.CalcGamma();
				} else {
					this.CalcBetaGamma();
				}
				this.refill();
			}
		} else {
			if (fE2 < this.mfMSE) {
				this.mfAlpha = f2;
				if (this.bEDS) {
					this.CalcGamma();
				} else {
					this.CalcBetaGamma();
				}
				this.refill();
			}
		}
		this.calcAccuracyIndicators();
	};


	ScETSForecastCalculation.prototype.CalcBetaGamma = function () {
		var f0 = 0.0;
		this.mfBeta = f0;
		this.CalcGamma();
		this.refill();
		var fE0 = this.mfMSE;

		var f2 = 1.0;
		this.mfBeta = f2;
		this.CalcGamma();
		this.refill();
		var fE2 = this.mfMSE;

		var f1 = 0.5;
		this.mfBeta = f1;
		this.CalcGamma();
		this.refill();

		if (fE0 === this.mfMSE && this.mfMSE === fE2) {
			this.mfBeta = 0;
			this.CalcGamma();
			this.refill();
			return;
		}
		while (( f2 - f1 ) > this.cfMinABCResolution) {
			if (fE2 > fE0) {
				f2 = f1;
				fE2 = this.mfMSE;
				f1 = ( f0 + f1 ) / 2;
			} else {
				f0 = f1;
				fE0 = this.mfMSE;
				f1 = ( f1 + f2 ) / 2;
			}
			this.mfBeta = f1;
			this.CalcGamma();
			this.refill();
		}
		if (fE2 > fE0) {
			if (fE0 < this.mfMSE) {
				this.mfBeta = f0;
				this.CalcGamma();
				this.refill();
			}
		} else {
			if (fE2 < this.mfMSE) {
				this.mfBeta = f2;
				this.CalcGamma();
				this.refill();
			}
		}
	};

	ScETSForecastCalculation.prototype.CalcGamma = function () {
		var f0 = 0.0;
		this.mfGamma = f0;
		this.refill();
		var fE0 = this.mfMSE;

		var f2 = 1.0;
		this.mfGamma = f2;
		this.refill();
		var fE2 = this.mfMSE;

		var f1 = 0.5;
		this.mfGamma = f1;
		this.refill();

		if (fE0 === this.mfMSE && this.mfMSE === fE2) {
			this.mfGamma = 0;
			this.refill();
			return;
		}
		while (( f2 - f1 ) > this.cfMinABCResolution) {
			if (fE2 > fE0) {
				f2 = f1;
				fE2 = this.mfMSE;
				f1 = ( f0 + f1 ) / 2;
			} else {
				f0 = f1;
				fE0 = this.mfMSE;
				f1 = ( f1 + f2 ) / 2;
			}
			this.mfGamma = f1;
			this.refill();
		}
		if (fE2 > fE0) {
			if (fE0 < this.mfMSE) {
				this.mfGamma = f0;
				this.refill();
			}
		} else {
			if (fE2 < this.mfMSE) {
				this.mfGamma = f2;
				this.refill();
			}
		}
	};


	ScETSForecastCalculation.prototype.refill = function () {
		// refill mpBase, mpTrend, mpPerIdx and mpForecast with values
		// using the calculated mfAlpha, (mfBeta), mfGamma
		// forecast 1 step ahead
		for (var i = 1; i < this.mnCount; i++) {
			if (this.bEDS) {
				this.mpBase[i] = this.mfAlpha * this.maRange[i].Y + ( 1 - this.mfAlpha ) *
					( this.mpBase[i - 1] + this.mpTrend[i - 1] );
				this.mpTrend[i] =
					this.mfGamma * ( this.mpBase[i] - this.mpBase[i - 1] ) + ( 1 - this.mfGamma ) * this.mpTrend[i - 1];
				this.mpForecast[i] = this.mpBase[i - 1] + this.mpTrend[i - 1];
			} else {
				var nIdx;
				if (this.bAdditive) {
					nIdx = ( i > this.mnSmplInPrd ? i - this.mnSmplInPrd : i );
					this.mpBase[i] = this.mfAlpha * ( this.maRange[i].Y - this.mpPerIdx[nIdx] ) + ( 1 - this.mfAlpha ) *
						( this.mpBase[i - 1] + this.mpTrend[i - 1] );
					this.mpPerIdx[i] = this.mfBeta * ( this.maRange[i].Y - this.mpBase[i] ) + ( 1 - this.mfBeta ) *
						this.mpPerIdx[nIdx];
				} else {
					nIdx = ( i >= this.mnSmplInPrd ? i - this.mnSmplInPrd : i );
					this.mpBase[i] = this.mfAlpha * ( this.maRange[i].Y / this.mpPerIdx[nIdx] ) + ( 1 - this.mfAlpha ) *
						( this.mpBase[i - 1] + this.mpTrend[i - 1] );
					this.mpPerIdx[i] = this.mfBeta * ( this.maRange[i].Y / this.mpBase[i] ) + ( 1 - this.mfBeta ) *
						this.mpPerIdx[this.nIdx];
				}
				this.mpTrend[i] =
					this.mfGamma * ( this.mpBase[i] - this.mpBase[i - 1] ) + ( 1 - this.mfGamma ) * this.mpTrend[i - 1];

				if (this.bAdditive) {
					this.mpForecast[i] = this.mpBase[i - 1] + this.mpTrend[i - 1] + this.mpPerIdx[nIdx];
				} else {
					this.mpForecast[i] = ( this.mpBase[i - 1] + this.mpTrend[i - 1] ) * this.mpPerIdx[nIdx];
				}
			}
		}
		this.calcAccuracyIndicators();
	};


	ScETSForecastCalculation.prototype.convertXtoMonths = function (x) {
		//Date aNullDate = *( mpFormatter->GetNullDate() );
		var aDate = Date.prototype.getDateFromExcel(x);
		var nYear = aDate.getUTCFullYear();
		var nMonth = aDate.getMonth();
		var fMonthLength;
		switch (nMonth) {
			case  1 :
			case  3 :
			case  5 :
			case  7 :
			case  8 :
			case 10 :
			case 12 :
				fMonthLength = 31.0;
				break;
			case  2 :
				fMonthLength = ( aDate.isLeapYear() ? 29.0 : 28.0 );
				break;
			default :
				fMonthLength = 30.0;
		}
		return ( 12.0 * nYear + nMonth + ( aDate.getDate() - this.mnMonthDay ) / fMonthLength );
	};


	ScETSForecastCalculation.prototype.GetForecast = function (fTarget, rForecast) {
		if (!this.initCalc()) {
			return false;
		}

		if (fTarget <= this.maRange[this.mnCount - 1].X) {
			var n = ( fTarget - this.maRange[0].X ) / this.mfStepSize;
			var fInterpolate = Math.fmod(fTarget - this.maRange[0].X, this.mfStepSize);
			rForecast = this.maRange[n].Y;

			if (fInterpolate >= this.cfMinABCResolution) {
				var fInterpolateFactor = fInterpolate / this.mfStepSize;
				var fFc_1 = this.mpForecast[n + 1];
				rForecast = rForecast + fInterpolateFactor * ( fFc_1 - rForecast );
			}
		} else {
			var n = Math.round(( fTarget - this.maRange[this.mnCount - 1].X ) / this.mfStepSize);
			var fInterpolate = parseInt(Math.fmod(fTarget - this.maRange[this.mnCount - 1].X, this.mfStepSize));

			if (this.bEDS) {
				rForecast = this.mpBase[this.mnCount - 1] + n * this.mpTrend[this.mnCount - 1];
			} else if (this.bAdditive) {
				rForecast = this.mpBase[this.mnCount - 1] + n * this.mpTrend[this.mnCount - 1] +
					this.mpPerIdx[this.mnCount - 1 - this.mnSmplInPrd + ( n % this.mnSmplInPrd )];
			} else {
				rForecast = ( this.mpBase[this.mnCount - 1] + n * this.mpTrend[this.mnCount - 1] ) *
					this.mpPerIdx[this.mnCount - 1 - this.mnSmplInPrd + ( n % this.mnSmplInPrd )];
			}

			if (fInterpolate >= this.cfMinABCResolution) {
				var fInterpolateFactor = fInterpolate / this.mfStepSize;
				var fFc_1;
				if (this.bEDS) {
					fFc_1 = this.mpBase[this.mnCount - 1] + ( n + 1 ) * this.mpTrend[this.mnCount - 1];
				} else if (this.bAdditive) {
					fFc_1 = this.mpBase[this.mnCount - 1] + ( n + 1 ) * this.mpTrend[this.mnCount - 1] +
						this.mpPerIdx[this.mnCount - 1 - this.mnSmplInPrd + ( ( n + 1 ) % this.mnSmplInPrd )];
				} else {
					fFc_1 = ( this.mpBase[this.mnCount - 1] + ( n + 1 ) * this.mpTrend[this.mnCount - 1] ) *
						this.mpPerIdx[this.mnCount - 1 - this.mnSmplInPrd + ( ( n + 1 ) % this.mnSmplInPrd )];
				}
				rForecast = rForecast + fInterpolateFactor * ( fFc_1 - rForecast );
			}
		}
		return rForecast;
	};

	ScETSForecastCalculation.prototype.GetForecastRange = function (rTMat) {
		var nC = rTMat.length, nR = rTMat[0].length;

		var rFcMat = [];

		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				var fTarget;
				if (this.mnMonthDay) {
					fTarget = this.convertXtoMonths(rTMat[j][i].getValue());
				} else {
					fTarget = rTMat[j][i].getValue();
				}
				var fForecast;
				if (fForecast = this.GetForecast(fTarget)) {
					if (!rFcMat[j]) {
						rFcMat[j] = [];
					}
					rFcMat[j][i] = fForecast;
				} else {
					return false;
				}
			}
		}
		return rFcMat;
	};


	ScETSForecastCalculation.prototype.GetStatisticValue = function (rTypeMat) {
		if (!this.initCalc()) {
			return false;
		}

		var nC = rTypeMat.length, nR = rTypeMat[0].length;
		var rStatMat = [];
		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				if (!rStatMat[j]) {
					rStatMat[j] = [];
				}
				switch (rTypeMat[j][i].getValue()) {
					case 1 : // alpha
						rStatMat[j][i] = this.mfAlpha;
						break;
					case 2 : // gamma
						rStatMat[j][i] = this.mfGamma;
						break;
					case 3 : // beta
						rStatMat[j][i] = this.mfBeta;
						break;
					case 4 : // MASE
						rStatMat[j][i] = this.mfMASE;
						break;
					case 5 : // SMAPE
						rStatMat[j][i] = this.mfSMAPE;
						break;
					case 6 : // MAE
						rStatMat[j][i] = this.mfMAE;
						break;
					case 7 : // RMSE
						rStatMat[j][i] = this.mfRMSE;
						break;
					case 8 : // step size
						rStatMat[j][i] = this.mfStepSize;
						break;
					case 9 : // samples in period
						rStatMat[j][i] = this.mnSmplInPrd;
						break;
				}
			}
		}
		return rStatMat;
	};

	ScETSForecastCalculation.prototype.GetETSPredictionIntervals = function (rTMat, fPILevel) {
		if (!this.initCalc()) {
			return false;
		}

		var rPIMat = null;
		var nC = rTMat.length, nR = rTMat[0].length;

		// find maximum target value and calculate size of coefficient- array c
		var fMaxTarget = rTMat[0][0].value;
		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				if (fMaxTarget < rTMat[j][i].value) {
					fMaxTarget = rTMat[j][i].value;
				}
			}
		}

		if (this.mnMonthDay) {
			fMaxTarget = this.convertXtoMonths(fMaxTarget) - this.maRange[this.mnCount - 1].X;
		} else {
			fMaxTarget -= this.maRange[this.mnCount - 1].X;
		}

		var nSize = ( fMaxTarget / this.mfStepSize );
		if (Math.fmod(fMaxTarget, this.mfStepSize) !== 0.0) {
			nSize++;
		}

		var xScenRange = [];
		var xScenBase = [];
		var xScenTrend = [];
		var xScenPerIdx = [];
		var aPredictions = [];

		// fill scenarios
		for (var k = 0; k < this.cnScenarios; k++) {
			// fill array with forecasts, with RandDev() added to xScenRange
			if (this.bAdditive) {
				// calculation based on additive model
				xScenRange[0] = this.mpBase[this.mnCount - 1] + this.mpTrend[this.mnCount - 1] +
					this.mpPerIdx[this.mnCount - this.mnSmplInPrd] + this.randDev();

				if (!aPredictions[0]) {
					aPredictions[0] = [];
				}
				aPredictions[0][k] = xScenRange[0];
				xScenBase[0] = this.mfAlpha * ( xScenRange[0] - this.mpPerIdx[this.mnCount - this.mnSmplInPrd] ) +
					( 1 - this.mfAlpha ) * ( this.mpBase[this.mnCount - 1] + this.mpTrend[this.mnCount - 1] );
				xScenTrend[0] = this.mfGamma * ( xScenBase[0] - this.mpBase[this.mnCount - 1] ) + ( 1 - this.mfGamma ) *
					this.mpTrend[this.mnCount - 1];
				xScenPerIdx[0] = this.mfBeta * ( xScenRange[0] - xScenBase[0] ) + ( 1 - this.mfBeta ) *
					this.mpPerIdx[this.mnCount - this.mnSmplInPrd];
				for (var i = 1; i < nSize; i++) {
					var fPerIdx;
					if (i < this.mnSmplInPrd) {
						fPerIdx = this.mpPerIdx[this.mnCount + i - this.mnSmplInPrd];
					} else {
						fPerIdx = xScenPerIdx[i - this.mnSmplInPrd];
					}
					xScenRange[i] = xScenBase[i - 1] + xScenTrend[i - 1] + fPerIdx + this.randDev();

					if (!aPredictions[i]) {
						aPredictions[i] = [];
					}
					aPredictions[i][k] = xScenRange[i];
					xScenBase[i] = this.mfAlpha * ( xScenRange[i] - fPerIdx ) + ( 1 - this.mfAlpha ) *
						( xScenBase[i - 1] + xScenTrend[i - 1] );
					xScenTrend[i] =
						this.mfGamma * ( xScenBase[i] - xScenBase[i - 1] ) + ( 1 - this.mfGamma ) * xScenTrend[i - 1];
					xScenPerIdx[i] = this.mfBeta * ( xScenRange[i] - xScenBase[i] ) + ( 1 - this.mfBeta ) * fPerIdx;
				}
			} else {
				// calculation based on multiplicative model
				xScenRange[0] = ( this.mpBase[this.mnCount - 1] + this.mpTrend[this.mnCount - 1] ) *
					this.mpPerIdx[this.mnCount - this.mnSmplInPrd] + this.randDev();

				if (!aPredictions[0]) {
					aPredictions[0] = [];
				}
				aPredictions[0][k] = xScenRange[0];
				xScenBase[0] = this.mfAlpha * ( xScenRange[0] / this.mpPerIdx[this.mnCount - this.mnSmplInPrd] ) +
					( 1 - this.mfAlpha ) * ( this.mpBase[this.mnCount - 1] + this.mpTrend[this.mnCount - 1] );
				xScenTrend[0] = this.mfGamma * ( xScenBase[0] - this.mpBase[this.mnCount - 1] ) + ( 1 - this.mfGamma ) *
					this.mpTrend[this.mnCount - 1];
				xScenPerIdx[0] = this.mfBeta * ( xScenRange[0] / xScenBase[0] ) + ( 1 - this.mfBeta ) *
					this.mpPerIdx[this.mnCount - this.mnSmplInPrd];
				for (var i = 1; i < nSize; i++) {
					var fPerIdx;
					if (i < this.mnSmplInPrd) {
						fPerIdx = this.mpPerIdx[this.mnCount + i - this.mnSmplInPrd];
					} else {
						fPerIdx = xScenPerIdx[i - this.mnSmplInPrd];
					}
					xScenRange[i] = ( xScenBase[i - 1] + xScenTrend[i - 1] ) * fPerIdx + this.randDev();

					if (!aPredictions[i]) {
						aPredictions[i] = [];
					}
					aPredictions[i][k] = xScenRange[i];
					xScenBase[i] = this.mfAlpha * ( xScenRange[i] / fPerIdx ) + ( 1 - this.mfAlpha ) *
						( xScenBase[i - 1] + xScenTrend[i - 1] );
					xScenTrend[i] =
						this.mfGamma * ( xScenBase[i] - xScenBase[i - 1] ) + ( 1 - this.mfGamma ) * xScenTrend[i - 1];
					xScenPerIdx[i] = this.mfBeta * ( xScenRange[i] / xScenBase[i] ) + ( 1 - this.mfBeta ) * fPerIdx;
				}
			}
		}

		// create array of Percentile values;
		var xPercentile = [];
		for (var i = 0; i < nSize; i++) {
			xPercentile[i] = getPercentile(aPredictions[i], ( 1 + fPILevel ) / 2) - getPercentile(aPredictions[i], 0.5);
		}

		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				var fTarget;
				if (this.mnMonthDay) {
					fTarget = this.convertXtoMonths(rTMat[j][i].value) - this.maRange[this.mnCount - 1].X;
				} else {
					fTarget = rTMat[j][i].value - this.maRange[this.mnCount - 1].X;
				}
				var nSteps = ( fTarget / this.mfStepSize ) - 1;
				var fFactor = Math.fmod(fTarget, this.mfStepSize);
				var fPI = xPercentile[nSteps];
				if (fFactor != 0.0) {
					// interpolate
					var fPI1 = xPercentile[nSteps + 1];
					fPI = fPI + fFactor * ( fPI1 - fPI );
				}
				if (!rPIMat) {
					rPIMat = [];
				}
				if (!rPIMat[j]) {
					rPIMat[j] = [];
				}

				rPIMat[j][i] = fPI;
			}
		}

		return rPIMat;
	};


	ScETSForecastCalculation.prototype.GetEDSPredictionIntervals = function (rTMat, fPILevel) {
		if (!this.initCalc()) {
			return false;
		}

		var rPIMat = null;
		var nC = rTMat.length, nR = rTMat[0].length;

		// find maximum target value and calculate size of coefficient- array c
		var fMaxTarget = rTMat[0][0];
		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				if (fMaxTarget < rTMat[j][i]) {
					fMaxTarget = rTMat[j][i];
				}
			}
		}

		if (this.mnMonthDay) {
			fMaxTarget = this.convertXtoMonths(fMaxTarget) - this.maRange[this.mnCount - 1].X;
		} else {
			fMaxTarget -= this.maRange[this.mnCount - 1].X;
		}

		var nSize = ( fMaxTarget / this.mfStepSize );
		if (Math.fmod(fMaxTarget, this.mfStepSize) !== 0.0) {
			nSize++;
		}

		var z = gaussinv(( 1.0 + fPILevel ) / 2.0);
		var o = 1 - fPILevel;
		//std::vector< double > c( nSize );
		for (var i = 0; i < nSize; i++) {
			c[i] = Math.sqrt(1 + ( fPILevel / Math.pow(1 + o, 3.0) ) *
				( ( 1 + 4 * o + 5 * o * o ) + 2 * ( i ) * fPILevel * ( 1 + 3 * o ) + 2 * ( i * i ) * fPILevel *
					fPILevel ));
		}


		for (var i = 0; i < nR; i++) {
			for (var j = 0; j < nC; j++) {
				var fTarget;
				if (this.mnMonthDay) {
					fTarget = this.convertXtoMonths(rTMat[j][i]) - this.maRange[this.mnCount - 1].X;
				} else {
					fTarget = rTMat[j][i] - this.maRange[this.mnCount - 1].X;
				}
				var nSteps = ( fTarget / this.mfStepSize ) - 1;
				var fFactor = Math.fmod(fTarget, this.mfStepSize);
				var fPI = z * this.mfRMSE * c[nSteps] / c[0];
				if (fFactor !== 0.0) {
					// interpolate
					var fPI1 = z * this.mfRMSE * c[nSteps + 1] / c[0];
					fPI = fPI + fFactor * ( fPI1 - fPI );
				}

				if (!rPIMat) {
					rPIMat = [];
				}
				if (!rPIMat[j]) {
					rPIMat[j] = [];
				}

				rPIMat[j][i] = fPI;
			}
		}

		return rPIMat;
	};

	function checkNumericMatrix(matrix) {
		if (!matrix) {
			return false;
		}

		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				var type = matrix[i][j].type;
				if (!(cElementType.number === type || cElementType.bool === type)) {
					return false;
				}
			}
		}

		return true;
	}

	function fillArray(array, val, length) {
		for (var i = 0; i < length - 1; i++) {
			array[i] = val;
		}
	}

	function tryNumberToArray(arg) {
		if (arg) {
			var tempNumber;
			if (cElementType.number === arg.type) {
				tempNumber = arg;
				arg = new cArray();
				arg.addElement(tempNumber);
			} else if (cElementType.cell === arg.type || cElementType.cell3D === arg.type) {
				tempNumber = arg.getValue();
				arg = new cArray();
				arg.addElement(tempNumber);
			}
		}

		return arg;
	}

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAVEDEV() {
	}

	cAVEDEV.prototype = Object.create(cBaseFunction.prototype);
	cAVEDEV.prototype.constructor = cAVEDEV;
	cAVEDEV.prototype.name = 'AVEDEV';
	cAVEDEV.prototype.argumentsMin = 1;
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

		return new cNumber(a / count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAVERAGE() {
	}

	cAVERAGE.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGE.prototype.constructor = cAVERAGE;
	cAVERAGE.prototype.name = 'AVERAGE';
	cAVERAGE.prototype.argumentsMin = 1;
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
						return _argV;
					}
				}
			} else if (cElementType.cellsRange === _arg.type || cElementType.cellsRange3D === _arg.type) {
				var _argAreaValue = _arg.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
				for (var j = 0; j < _argAreaValue.length; j++) {
					var __arg = _argAreaValue[j];
					if (cElementType.string === __arg.type || cElementType.empty === __arg.type ||
						cElementType.bool === __arg.type) {
						continue;
					} else if (cElementType.number === __arg.type) {
						sum = _func[sum.type][__arg.type](sum, __arg, "+");
						count++;
					} else if (cElementType.error === __arg.type) {
						return __arg;
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
					return _arg;
				}
				sum = _func[sum.type][_arg.type](sum, _arg, "+");
				count++;
			}
		}
		return new cNumber(sum.getValue() / count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAVERAGEA() {
	}

	cAVERAGEA.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEA.prototype.constructor = cAVERAGEA;
	cAVERAGEA.prototype.name = 'AVERAGEA';
	cAVERAGEA.prototype.argumentsMin = 1;
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
					return _arg;
				}
				sum = _func[sum.type][_arg.type](sum, _arg, "+");
				count++;
			}
		}
		return new cNumber(sum.getValue() / count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAVERAGEIF() {
	}

	cAVERAGEIF.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEIF.prototype.constructor = cAVERAGEIF;
	cAVERAGEIF.prototype.name = 'AVERAGEIF';
	cAVERAGEIF.prototype.argumentsMin = 2;
	cAVERAGEIF.prototype.argumentsMax = 3;
	cAVERAGEIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : arg[0], _sum = 0, _count = 0, matchingInfo, ws;
		if ((cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type && cElementType.cellsRange !==
				arg0.type) ||
			(cElementType.cell !== arg2.type && cElementType.cell3D !== arg2.type && cElementType.cellsRange !==
				arg2.type)) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg1 = arg1.tocString();

		if (cElementType.string !== arg1.type) {
			return new cError(cErrorType.wrong_value_type);
		}

		var r = arg0.getRange();
		var r2 = arg2.getRange();
		ws = arg0.getWS();
		matchingInfo = AscCommonExcel.matchingValue(arg1);
		if (cElementType.cellsRange === arg0.type) {
			arg0.foreach2(function (v, cell) {
				if (matching(v, matchingInfo)) {
					var offset = cell.getOffset3(r.bbox.c1 + 1, r.bbox.r1 + 1);
					r2.setOffset(offset);

					var val;
					ws._getCellNoEmpty(r2.bbox.r1, r2.bbox.c1, function (cell) {
						val = checkTypeCell(cell);
					});

					offset.offsetCol *= -1;
					offset.offsetRow *= -1;
					r2.setOffset(offset);

					if (cElementType.number === val.type) {
						_sum += val.getValue();
						_count++;
					}
				}
			})
		} else {
			if (matching(arg0.getValue(), matchingInfo)) {
				var val;
				ws._getCellNoEmpty(r.bbox.r1, r2.bbox.c1, function (cell) {
					val = checkTypeCell(cell);
				});
				if (cElementType.number === val.type) {
					_sum += val.getValue();
					_count++;
				}
			}
		}

		if (0 === _count) {
			return new cError(cErrorType.division_by_zero);
		} else {
			return new cNumber(_sum / _count);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cAVERAGEIFS() {
	}

	cAVERAGEIFS.prototype = Object.create(cBaseFunction.prototype);
	cAVERAGEIFS.prototype.constructor = cAVERAGEIFS;
	cAVERAGEIFS.prototype.name = 'AVERAGEIFS';
	cAVERAGEIFS.prototype.argumentsMin = 3;
	cAVERAGEIFS.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type) {
			return new cError(cErrorType.wrong_value_type);
		}

		var arg0Matrix = arg0.getMatrix();
		var i, j, arg1, arg2, matchingInfo;
		for (var k = 1; k < arg.length; k += 2) {
			arg1 = arg[k];
			arg2 = arg[k + 1];

			if ((cElementType.cell !== arg1.type && cElementType.cell3D !== arg1.type && cElementType.cellsRange !==
					arg1.type)) {
				return new cError(cErrorType.wrong_value_type);
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
			return new cNumber(_sum / _count);
		}
	};
	cAVERAGEIFS.prototype.checkArguments = function (countArguments) {
		return 1 === countArguments % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBETADIST() {
	}

	cBETADIST.prototype = Object.create(cBaseFunction.prototype);
	cBETADIST.prototype.constructor = cBETADIST;
	cBETADIST.prototype.name = 'BETADIST';
	cBETADIST.prototype.argumentsMin = 3;
	cBETADIST.prototype.argumentsMax = 5;
	cBETADIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(0);
		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcBeta = function (argArray) {
			var x = argArray[0];
			var alpha = argArray[1];
			var beta = argArray[2];
			var fLowerBound = argArray[3];
			var fUpperBound = argArray[4];

			var fScale = fUpperBound - fLowerBound;
			if (fScale <= 0 || alpha <= 0 || beta <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			var res = null;
			if (x < fLowerBound) {
				res = 0;
			} else if (x > fUpperBound) {
				res = 1;
			} else {
				x = (x - fLowerBound) / fScale;
				res = getBetaDist(x, alpha, beta);
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcBeta);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBETA_DIST() {
	}

	cBETA_DIST.prototype = Object.create(cBaseFunction.prototype);
	cBETA_DIST.prototype.constructor = cBETA_DIST;
	cBETA_DIST.prototype.name = 'BETA.DIST';
	cBETA_DIST.prototype.argumentsMin = 4;
	cBETA_DIST.prototype.argumentsMax = 6;
	cBETA_DIST.prototype.isXLFN = true;
	cBETA_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();

		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(0);
		argClone[5] = argClone[5] ? argClone[5].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcBeta = function (argArray) {
			var x = argArray[0];
			var alpha = argArray[1];
			var beta = argArray[2];
			var bIsCumulative = argArray[3];
			var fLowerBound = argArray[4];
			var fUpperBound = argArray[5];

			var res = null;
			if (alpha <= 0 || beta <= 0 || x < fLowerBound || x > fUpperBound) {
				return new cError(cErrorType.not_numeric);
			}
			var fScale = fUpperBound - fLowerBound;
			x = (x - fLowerBound) / fScale;
			if (bIsCumulative) {
				res = getBetaDist(x, alpha, beta);
			} else {
				res = getBetaDistPDF(x, alpha, beta) / fScale;
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcBeta);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBETA_INV() {
	}

	cBETA_INV.prototype = Object.create(cBaseFunction.prototype);
	cBETA_INV.prototype.constructor = cBETA_INV;
	cBETA_INV.prototype.name = 'BETA.INV';
	cBETA_INV.prototype.argumentsMin = 3;
	cBETA_INV.prototype.argumentsMax = 5;
	cBETA_INV.prototype.isXLFN = true;
	cBETA_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(0);
		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(1);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGamma = function (argArray) {
			var fP = argArray[0];
			var fAlpha = argArray[1];
			var fBeta = argArray[2];
			var fA = argArray[3];
			var fB = argArray[4];

			if (fP < 0 || fP > 1 || fA >= fB || fAlpha <= 0 || fBeta <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new BETADISTFUNCTION(fP, fAlpha, fBeta);
			var oVal = iterateInverse(aFunc, 0, 1);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
				//SetError(FormulaError::NoConvergence);
			}
			var res = fA + oVal.val * (fB - fA);

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcGamma);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBINOMDIST() {
	}

	cBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cBINOMDIST.prototype.constructor = cBINOMDIST;
	cBINOMDIST.prototype.name = 'BINOMDIST';
	cBINOMDIST.prototype.argumentsMin = 4;
	cBINOMDIST.prototype.argumentsMax = 4;
	cBINOMDIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();//bool

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function binomdist(x, n, p) {
			x = parseInt(x);
			n = parseInt(n);
			return Math.binomCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
		}

		var calcBinom = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];
			var arg2 = argArray[2];
			var arg3 = argArray[3];

			if (arg0 < 0 || arg0 > arg1 || arg2 < 0 || arg2 > 1) {
				return new cError(cErrorType.not_numeric);
			}

			if (arg3) {
				var x = parseInt(arg0), n = parseInt(arg1), p = arg2, bm = 0;

				for (var y = 0; y <= x; y++) {
					bm += binomdist(y, n, p);
				}

				return new cNumber(bm);
			} else {
				return new cNumber(binomdist(arg0, arg1, arg2));
			}
		};

		return this._findArrayInNumberArguments(oArguments, calcBinom);
	};

	/**
	 * @constructor
	 * @extends {cBINOMDIST}
	 */
	function cBINOM_DIST() {
	}

	cBINOM_DIST.prototype = Object.create(cBINOMDIST.prototype);
	cBINOM_DIST.prototype.constructor = cBINOM_DIST;
	cBINOM_DIST.prototype.name = 'BINOM.DIST';
	cBINOM_DIST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBINOM_DIST_RANGE() {
	}

	cBINOM_DIST_RANGE.prototype = Object.create(cBaseFunction.prototype);
	cBINOM_DIST_RANGE.prototype.constructor = cBINOM_DIST_RANGE;
	cBINOM_DIST_RANGE.prototype.name = 'BINOM.DIST.RANGE';
	cBINOM_DIST_RANGE.prototype.argumentsMin = 3;
	cBINOM_DIST_RANGE.prototype.argumentsMax = 4;
	cBINOM_DIST_RANGE.prototype.isXLFN = true;
	cBINOM_DIST_RANGE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3] ? argClone[3].tocNumber() : argClone[2];

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function binomdist(x, n, p) {
			x = parseInt(x);
			n = parseInt(n);
			return Math.binomCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
		}

		var calcBinom = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];
			var arg2 = argArray[2];
			var arg3 = argArray[3];

			if (arg0 < 0 || arg1 < 0 || arg1 > 1 || arg2 < 0 || arg2 > arg0 || arg3 < arg2 || arg3 > arg0) {
				return new cError(cErrorType.not_numeric);
			}

			var summ = 0;
			for (var i = arg2; i <= arg3; i++) {
				summ += binomdist(i, arg0, arg1);
			}
			return new cNumber(summ);
		};

		return this._findArrayInNumberArguments(oArguments, calcBinom);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHIDIST() {
	}

	cCHIDIST.prototype = Object.create(cBaseFunction.prototype);
	cCHIDIST.prototype.constructor = cCHIDIST;
	cCHIDIST.prototype.name = "CHIDIST";
	cCHIDIST.prototype.argumentsMin = 2;
	cCHIDIST.prototype.argumentsMax = 2;
	cCHIDIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fChi = argArray[0];
			var fDF = parseInt(argArray[1]);

			if (fDF < 1 || fChi < 0 || fDF > Math.pow(10, 10)) {
				return new cError(cErrorType.not_numeric);
			}

			var res = getChiDist(fChi, fDF);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHIINV() {
	}

	cCHIINV.prototype = Object.create(cBaseFunction.prototype);
	cCHIINV.prototype.constructor = cCHIINV;
	cCHIINV.prototype.name = 'CHIINV';
	cCHIINV.prototype.argumentsMin = 2;
	cCHIINV.prototype.argumentsMax = 2;
	cCHIINV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fP = argArray[0];
			var fDF = parseInt(argArray[1]);

			if (fDF < 1 || fP <= 0 || fP > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new CHIDISTFUNCTION(fP, fDF);
			var oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = oVal.val;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_DIST() {
	}

	cCHISQ_DIST.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_DIST.prototype.constructor = cCHISQ_DIST;
	cCHISQ_DIST.prototype.name = 'CHISQ.DIST';
	cCHISQ_DIST.prototype.argumentsMin = 3;
	cCHISQ_DIST.prototype.argumentsMax = 3;
	cCHISQ_DIST.prototype.isXLFN = true;
	cCHISQ_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fX = argArray[0];
			var fDF = parseInt(argArray[1]);
			var bCumulative = argArray[2];

			var res = null;
			if (fDF < 1 || fDF > 1E10 || fX < 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				if (bCumulative) {
					res = getChiSqDistCDF(fX, fDF);
				} else {
					res = getChiSqDistPDF(fX, fDF);
				}
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {cCHIDIST}
	 */
	function cCHISQ_DIST_RT() {
	}

	cCHISQ_DIST_RT.prototype = Object.create(cCHIDIST.prototype);
	cCHISQ_DIST_RT.prototype.constructor = cCHISQ_DIST_RT;
	cCHISQ_DIST_RT.prototype.name = 'CHISQ.DIST.RT';
	cCHISQ_DIST_RT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_INV() {
	}

	cCHISQ_INV.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_INV.prototype.constructor = cCHISQ_INV;
	cCHISQ_INV.prototype.name = 'CHISQ.INV';
	cCHISQ_INV.prototype.argumentsMin = 2;
	cCHISQ_INV.prototype.argumentsMax = 2;
	cCHISQ_INV.prototype.isXLFN = true;
	cCHISQ_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fP = argArray[0];
			var fDF = parseInt(argArray[1]);

			if (fDF < 1 || fP < 0 || fP >= 1 || fDF > 1.0E10) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new CHISQDISTFUNCTION(fP, fDF);
			var oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = oVal.val;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHISQ_INV_RT() {
	}

	//TODO check max 64 iterations(from documentaion)
	cCHISQ_INV_RT.prototype = Object.create(cBaseFunction.prototype);
	cCHISQ_INV_RT.prototype.constructor = cCHISQ_INV_RT;
	cCHISQ_INV_RT.prototype.name = 'CHISQ.INV.RT';
	cCHISQ_INV_RT.prototype.argumentsMin = 2;
	cCHISQ_INV_RT.prototype.argumentsMax = 2;
	cCHISQ_INV_RT.prototype.isXLFN = true;
	cCHISQ_INV_RT.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fP = argArray[0];
			var fDF = parseInt(argArray[1]);

			if (fDF < 1 || fP <= 0 || fP > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new CHIDISTFUNCTION(fP, fDF);
			var oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = oVal.val;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCHITEST() {
	}

	cCHITEST.prototype = Object.create(cBaseFunction.prototype);
	cCHITEST.prototype.constructor = cCHITEST;
	cCHITEST.prototype.name = 'CHITEST';
	cCHITEST.prototype.argumentsMin = 2;
	cCHITEST.prototype.argumentsMax = 2;
	cCHITEST.prototype.Calculate = function (arg) {

		var arg2 = [arg[0], arg[1]];
		//если первое или второе значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (cElementType.string === arg[1].type || cElementType.bool === arg[1].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое или второе значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}
		if (cElementType.number === arg[1].type) {
			arg2[1] = new cArray();
			arg2[1].addElement(arg[1]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function calcChitest(argArray) {

			var arg1 = argArray[0];
			var arg2 = argArray[1];

			return chiTest(arg1, arg2);
		}

		return this._findArrayInNumberArguments(oArguments, calcChitest);
	};

	/**
	 * @constructor
	 * @extends {cCHITEST}
	 */
	function cCHISQ_TEST() {
	}

	cCHISQ_TEST.prototype = Object.create(cCHITEST.prototype);
	cCHISQ_TEST.prototype.constructor = cCHISQ_TEST;
	cCHISQ_TEST.prototype.name = 'CHISQ.TEST';
	cCHISQ_TEST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONFIDENCE() {
	}

	cCONFIDENCE.prototype = Object.create(cBaseFunction.prototype);
	cCONFIDENCE.prototype.constructor = cCONFIDENCE;
	cCONFIDENCE.prototype.name = 'CONFIDENCE';
	cCONFIDENCE.prototype.argumentsMin = 3;
	cCONFIDENCE.prototype.argumentsMax = 3;
	cCONFIDENCE.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcConfidence = function (argArray) {
			var alpha = argArray[0];
			var stdev_sigma = argArray[1];
			var size = parseInt(argArray[2]);

			if (alpha <= 0 || alpha >= 1 || stdev_sigma <= 0 || size < 1) {
				return new cError(cErrorType.not_numeric);
			}

			return new cNumber(gaussinv(1 - alpha / 2) * stdev_sigma / Math.sqrt(size));
		};

		return this._findArrayInNumberArguments(oArguments, calcConfidence);
	};

	/**
	 * @constructor
	 * @extends {cCONFIDENCE}
	 */
	function cCONFIDENCE_NORM() {
	}

	cCONFIDENCE_NORM.prototype = Object.create(cCONFIDENCE.prototype);
	cCONFIDENCE_NORM.prototype.constructor = cCONFIDENCE_NORM;
	cCONFIDENCE_NORM.prototype.name = 'CONFIDENCE.NORM';
	cCONFIDENCE_NORM.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONFIDENCE_T() {
	}

	cCONFIDENCE_T.prototype = Object.create(cBaseFunction.prototype);
	cCONFIDENCE_T.prototype.constructor = cCONFIDENCE_T;
	cCONFIDENCE_T.prototype.name = 'CONFIDENCE.T';
	cCONFIDENCE_T.prototype.argumentsMin = 3;
	cCONFIDENCE_T.prototype.argumentsMax = 3;
	cCONFIDENCE_T.prototype.isXLFN = true;
	cCONFIDENCE_T.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcConfidence = function (argArray) {
			var alpha = argArray[0];
			var stdev_sigma = argArray[1];
			var size = parseInt(argArray[2]);

			if (alpha <= 0 || alpha >= 1 || stdev_sigma <= 0 || size < 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new TDISTFUNCTION(alpha, size - 1, 2);
			var oVal = iterateInverse(aFunc, size * 0.5, size);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = (stdev_sigma * oVal.val) / Math.sqrt(size);
			return new cNumber(res);
		};

		return this._findArrayInNumberArguments(oArguments, calcConfidence);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCORREL() {
	}

	cCORREL.prototype = Object.create(cBaseFunction.prototype);
	cCORREL.prototype.constructor = cCORREL;
	cCORREL.prototype.name = 'CORREL';
	cCORREL.prototype.argumentsMin = 2;
	cCORREL.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return correl(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOUNT() {
	}

	cCOUNT.prototype = Object.create(cBaseFunction.prototype);
	cCOUNT.prototype.constructor = cCOUNT;
	cCOUNT.prototype.name = 'COUNT';
	cCOUNT.prototype.argumentsMin = 1;
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
				var _argAreaValue = _arg.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
		return new cNumber(count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOUNTA() {
	}

	cCOUNTA.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTA.prototype.constructor = cCOUNTA;
	cCOUNTA.prototype.name = 'COUNTA';
	cCOUNTA.prototype.argumentsMin = 1;
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
				var _argAreaValue = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
		return new cNumber(count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOUNTBLANK() {
	}

	cCOUNTBLANK.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTBLANK.prototype.constructor = cCOUNTBLANK;
	cCOUNTBLANK.prototype.name = 'COUNTBLANK';
	cCOUNTBLANK.prototype.argumentsMin = 1;
	cCOUNTBLANK.prototype.argumentsMax = 1;
	cCOUNTBLANK.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNTBLANK.prototype.Calculate = function (arg) {
		var arg0 = arg[0];
		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			return arg0.countCells();
		} else if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
			return new cNumber(1);
		} else {
			return new cError(cErrorType.bad_reference);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOUNTIF() {
	}

	cCOUNTIF.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTIF.prototype.constructor = cCOUNTIF;
	cCOUNTIF.prototype.name = 'COUNTIF';
	cCOUNTIF.prototype.argumentsMin = 2;
	cCOUNTIF.prototype.argumentsMax = 2;
	cCOUNTIF.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNTIF.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], _count = 0, matchingInfo;

		if (cElementType.error === arg0.type) {
			return arg0;
		}
		if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
			cElementType.cellsRange !== arg0.type && cElementType.cellsRange3D !== arg0.type) {
			return new cError(cErrorType.wrong_value_type);
		}

		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElementRowCol(0, 0);
		} else if (cElementType.cell === arg1.type || cElementType.cell3D === arg1.type) {
			arg1 = arg1.getValue();
		}

		/*arg1 = arg1.tocString();

		 if (cElementType.string !== arg1.type) {
		 return new cError(cErrorType.wrong_value_type);
		 }*/

		var val;
		matchingInfo = AscCommonExcel.matchingValue(arg1);
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

		return new cNumber(_count);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOUNTIFS() {
	}

	cCOUNTIFS.prototype = Object.create(cBaseFunction.prototype);
	cCOUNTIFS.prototype.constructor = cCOUNTIFS;
	cCOUNTIFS.prototype.name = 'COUNTIFS';
	cCOUNTIFS.prototype.argumentsMin = 2;
	cCOUNTIFS.prototype.argumentsMax = 254;
	cCOUNTIFS.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cCOUNTIFS.prototype.Calculate = function (arg) {
		var i, j, arg0, arg1, matchingInfo, arg0Matrix, arg1Matrix, _count = 0;
		for (var k = 0; k < arg.length; k += 2) {
			arg0 = arg[k];
			arg1 = arg[k + 1];
			if (cElementType.cell !== arg0.type && cElementType.cell3D !== arg0.type &&
				cElementType.cellsRange !== arg0.type &&
				!(cElementType.cellsRange3D === arg0.type && arg0.isSingleSheet())) {
				return new cError(cErrorType.wrong_value_type);
			}

			if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
				arg1 = arg1.cross(arguments[1]);
			} else if (cElementType.array === arg1.type) {
				arg1 = arg1.getElementRowCol(0, 0);
			}

			arg1 = arg1.tocString();
			if (cElementType.string !== arg1.type) {
				return new cError(cErrorType.wrong_value_type);
			}

			matchingInfo = AscCommonExcel.matchingValue(arg1);
			arg1Matrix = arg0.getMatrix();
			if (cElementType.cellsRange3D === arg0.type) {
				arg1Matrix = arg1Matrix[0];
			}
			if (!arg0Matrix) {
				arg0Matrix = arg1Matrix;
			}
			if (arg0Matrix.length !== arg1Matrix.length) {
				return new cError(cErrorType.wrong_value_type);
			}
			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return new cError(cErrorType.wrong_value_type);
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
		return new cNumber(_count);
	};
	cCOUNTIFS.prototype.checkArguments = function (countArguments) {
		return 0 === countArguments % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOVAR() {
	}

	cCOVAR.prototype = Object.create(cBaseFunction.prototype);
	cCOVAR.prototype.constructor = cCOVAR;
	cCOVAR.prototype.name = 'COVAR';
	cCOVAR.prototype.argumentsMin = 2;
	cCOVAR.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return covar(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOVARIANCE_P() {
	}

	cCOVARIANCE_P.prototype = Object.create(cBaseFunction.prototype);
	cCOVARIANCE_P.prototype.constructor = cCOVARIANCE_P;
	cCOVARIANCE_P.prototype.name = 'COVARIANCE.P';
	cCOVARIANCE_P.prototype.argumentsMin = 2;
	cCOVARIANCE_P.prototype.argumentsMax = 2;
	cCOVARIANCE_P.prototype.isXLFN = true;
	cCOVARIANCE_P.prototype.Calculate = function (arg) {

		var arg2 = [arg[0], arg[1]];
		//если первое или второе значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (cElementType.string === arg[1].type || cElementType.bool === arg[1].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое или второе значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}
		if (cElementType.number === arg[1].type) {
			arg2[1] = new cArray();
			arg2[1].addElement(arg[1]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function pearson(argArray) {

			var arg1 = argArray[0];
			var arg2 = argArray[1];
			var x = [];
			var y = [];

			for (var i = 0; i < arg1.length; i++) {
				for (var j = 0; j < arg1[i].length; j++) {
					x.push(arg1[i][j]);
				}
			}
			for (var i = 0; i < arg2.length; i++) {
				for (var j = 0; j < arg2[i].length; j++) {
					y.push(arg2[i][j]);
				}
			}

			var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length !== y.length) {
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
			}

			return new cNumber(sumXDeltaYDelta / xLength);
		}

		return this._findArrayInNumberArguments(oArguments, pearson);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOVARIANCE_S() {
	}

	cCOVARIANCE_S.prototype = Object.create(cBaseFunction.prototype);
	cCOVARIANCE_S.prototype.constructor = cCOVARIANCE_S;
	cCOVARIANCE_S.prototype.name = 'COVARIANCE.S';
	cCOVARIANCE_S.prototype.argumentsMin = 2;
	cCOVARIANCE_S.prototype.argumentsMax = 2;
	cCOVARIANCE_S.prototype.isXLFN = true;
	cCOVARIANCE_S.prototype.Calculate = function (arg) {

		var arg2 = [arg[0], arg[1]];
		//если первое или второе значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (cElementType.string === arg[1].type || cElementType.bool === arg[1].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое или второе значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}
		if (cElementType.number === arg[1].type) {
			arg2[1] = new cArray();
			arg2[1].addElement(arg[1]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function pearson(argArray) {

			var arg1 = argArray[0];
			var arg2 = argArray[1];
			var x = [];
			var y = [];

			for (var i = 0; i < arg1.length; i++) {
				for (var j = 0; j < arg1[i].length; j++) {
					x.push(arg1[i][j]);
				}
			}
			for (var i = 0; i < arg2.length; i++) {
				for (var j = 0; j < arg2[i].length; j++) {
					y.push(arg2[i][j]);
				}
			}

			var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length !== y.length) {
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

			if (xLength < 2.0) {
				return new cError(cErrorType.division_by_zero);
			}

			_x /= xLength;
			_y /= xLength;

			for (i = 0; i < x.length; i++) {

				if (!( x[i] instanceof cNumber && y[i] instanceof cNumber )) {
					continue;
				}

				sumXDeltaYDelta += (x[i].getValue() - _x) * (y[i].getValue() - _y);
			}

			return new cNumber(sumXDeltaYDelta / (xLength - 1));
		}

		return this._findArrayInNumberArguments(oArguments, pearson);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCRITBINOM() {
	}

	cCRITBINOM.prototype = Object.create(cBaseFunction.prototype);
	cCRITBINOM.prototype.constructor = cCRITBINOM;
	cCRITBINOM.prototype.name = 'CRITBINOM';
	cCRITBINOM.prototype.argumentsMin = 3;
	cCRITBINOM.prototype.argumentsMax = 3;
	cCRITBINOM.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function critbinom(argArray) {
			var n = argArray[0];
			var p = argArray[1];
			var alpha = argArray[2];

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

		return this._findArrayInNumberArguments(oArguments, critbinom);
	};

	/**
	 * @constructor
	 * @extends {cCRITBINOM}
	 */
	function cBINOM_INV() {
	}

	cBINOM_INV.prototype = Object.create(cCRITBINOM.prototype);
	cBINOM_INV.prototype.constructor = cBINOM_INV;
	cBINOM_INV.prototype.name = 'BINOM.INV';
	cBINOM_INV.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDEVSQ() {
	}

	cDEVSQ.prototype = Object.create(cBaseFunction.prototype);
	cDEVSQ.prototype.constructor = cDEVSQ;
	cDEVSQ.prototype.name = 'DEVSQ';
	cDEVSQ.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return devsq(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEXPON_DIST() {
	}

	cEXPON_DIST.prototype = Object.create(cBaseFunction.prototype);
	cEXPON_DIST.prototype.constructor = cEXPON_DIST;
	cEXPON_DIST.prototype.name = 'EXPON.DIST';
	cEXPON_DIST.prototype.argumentsMin = 3;
	cEXPON_DIST.prototype.argumentsMax = 3;
	cEXPON_DIST.prototype.isXLFN = true;
	cEXPON_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFDist = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];
			var arg2 = argArray[2];

			if (arg0 < 0 || arg1 <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			var res = null;
			if (arg2) {
				res = 1 - Math.exp(-arg1 * arg0);
			} else {
				res = arg1 * Math.exp(-arg1 * arg0);
			}
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcFDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cEXPONDIST() {
	}

	cEXPONDIST.prototype = Object.create(cBaseFunction.prototype);
	cEXPONDIST.prototype.constructor = cEXPONDIST;
	cEXPONDIST.prototype.name = 'EXPONDIST';
	cEXPONDIST.prototype.argumentsMin = 3;
	cEXPONDIST.prototype.argumentsMax = 3;
	cEXPONDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
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

		if (arg0.getValue() < 0 || arg2.getValue() <= 0) {
			return new cError(cErrorType.not_numeric);
		}

		if (arg2.toBool()) {
			return new cNumber(1 - Math.exp(-arg1.getValue() * arg0.getValue()));
		} else {
			return new cNumber(arg1.getValue() * Math.exp(-arg1.getValue() * arg0.getValue()));
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_DIST() {
	}

	cF_DIST.prototype = Object.create(cBaseFunction.prototype);
	cF_DIST.prototype.constructor = cF_DIST;
	cF_DIST.prototype.name = "F.DIST";
	cF_DIST.prototype.argumentsMin = 3;
	cF_DIST.prototype.argumentsMax = 4;
	cF_DIST.prototype.isXLFN = true;
	cF_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cBool(true);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFDist = function (argArray) {
			var fF = argArray[0];
			var fF1 = argArray[1];
			var fF2 = argArray[2];
			var bCum = argArray[3];

			if (fF < 0 || fF1 < 1 || fF2 < 1 || fF1 >= 1.0E10 || fF2 >= 1.0E10) {
				return new cError(cErrorType.not_numeric);
			}

			var res;
			if (bCum) {
				res = 1 - getFDist(fF, fF1, fF2);
			} else {
				res = Math.pow(fF1 / fF2, fF1 / 2) * Math.pow(fF, ( fF1 / 2 ) - 1) /
					( Math.pow(( 1 + ( fF * fF1 / fF2 ) ), ( fF1 + fF2 ) / 2) * getBeta(fF1 / 2, fF2 / 2) );
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcFDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_DIST_RT() {
	}

	cF_DIST_RT.prototype = Object.create(cBaseFunction.prototype);
	cF_DIST_RT.prototype.constructor = cF_DIST_RT;
	cF_DIST_RT.prototype.name = "F.DIST.RT";
	cF_DIST_RT.prototype.argumentsMin = 3;
	cF_DIST_RT.prototype.argumentsMax = 3;
	cF_DIST_RT.prototype.isXLFN = true;
	cF_DIST_RT.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFDist = function (argArray) {
			var fF = argArray[0];
			var fF1 = argArray[1];
			var fF2 = argArray[2];

			if (fF < 0 || fF1 < 1 || fF2 < 1 || fF1 >= 1.0E10 || fF2 >= 1.0E10) {
				return new cError(cErrorType.not_numeric);
			}

			var res = getFDist(fF, fF1, fF2);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcFDist);
	};

	/**
	 * @constructor
	 * @extends {cF_DIST_RT}
	 */
	function cFDIST() {
	}

	cFDIST.prototype = Object.create(cF_DIST_RT.prototype);
	cFDIST.prototype.constructor = cFDIST;
	cFDIST.prototype.name = 'FDIST';
	cFDIST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cF_INV() {
	}

	cF_INV.prototype = Object.create(cBaseFunction.prototype);
	cF_INV.prototype.constructor = cF_INV;
	cF_INV.prototype.name = 'F.INV';
	cF_INV.prototype.argumentsMin = 3;
	cF_INV.prototype.argumentsMax = 3;
	cF_INV.prototype.isXLFN = true;
	cF_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFDist = function (argArray) {
			var fP = argArray[0];
			var fF1 = parseInt(argArray[1]);
			var fF2 = parseInt(argArray[2]);

			if (fP <= 0 || fF1 < 1 || fF2 < 1 || fF1 >= 1.0E10 || fF2 >= 1.0E10 || fP > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new FDISTFUNCTION(1 - fP, fF1, fF2);
			var oVal = iterateInverse(aFunc, fF1 * 0.5, fF1);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = oVal.val;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcFDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFINV() {
	}

	cFINV.prototype = Object.create(cBaseFunction.prototype);
	cFINV.prototype.constructor = cFINV;
	cFINV.prototype.name = "FINV";
	cFINV.prototype.argumentsMin = 3;
	cFINV.prototype.argumentsMax = 3;
	cFINV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFDist = function (argArray) {
			var fP = argArray[0];
			var fF1 = parseInt(argArray[1]);
			var fF2 = parseInt(argArray[2]);

			if (fP <= 0 || fF1 < 1 || fF2 < 1 || fF1 >= 1.0E10 || fF2 >= 1.0E10 || fP > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new FDISTFUNCTION(fP, fF1, fF2);
			var oVal = iterateInverse(aFunc, fF1 * 0.5, fF1);
			var bConvError = oVal.bError;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			var res = oVal.val;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcFDist);
	};

	/**
	 * @constructor
	 * @extends {cFINV}
	 */
	function cF_INV_RT() {
	}

	cF_INV_RT.prototype = Object.create(cFINV.prototype);
	cF_INV_RT.prototype.constructor = cF_INV_RT;
	cF_INV_RT.prototype.name = 'F.INV.RT';
	cF_INV_RT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFISHER() {
	}

	cFISHER.prototype = Object.create(cBaseFunction.prototype);
	cFISHER.prototype.constructor = cFISHER;
	cFISHER.prototype.name = 'FISHER';
	cFISHER.prototype.argumentsMin = 1;
	cFISHER.prototype.argumentsMax = 1;
	cFISHER.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		function fisher(x) {
			return 0.5 * Math.ln((1 + x) / (1 - x));
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
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
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFISHERINV() {
	}

	cFISHERINV.prototype = Object.create(cBaseFunction.prototype);
	cFISHERINV.prototype.constructor = cFISHERINV;
	cFISHERINV.prototype.name = 'FISHERINV';
	cFISHERINV.prototype.argumentsMin = 1;
	cFISHERINV.prototype.argumentsMax = 1;
	cFISHERINV.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		function fisherInv(x) {
			return ( Math.exp(2 * x) - 1 ) / ( Math.exp(2 * x) + 1 );
		}

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
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
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST() {
	}

	cFORECAST.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST.prototype.constructor = cFORECAST;
	cFORECAST.prototype.name = 'FORECAST';
	cFORECAST.prototype.argumentsMin = 3;
	cFORECAST.prototype.argumentsMax = 3;
	cFORECAST.prototype.Calculate = function (arg) {

		function forecast(fx, y, x) {

			var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0, i;

			if (x.length !== y.length) {
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}
		arg0 = arg0.tocNumber();

		if (arg0 instanceof cError) {
			return arg0;
		}


		if (arg1 instanceof cArea) {
			arr0 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr0.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg2 instanceof cArea) {
			arr1 = arg2.getValue();
		} else if (arg2 instanceof cArray) {
			arg2.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return forecast(arg0, arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS() {
	}

	cFORECAST_ETS.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS.prototype.constructor = cFORECAST_ETS;
	cFORECAST_ETS.prototype.name = 'FORECAST.ETS';
	cFORECAST_ETS.prototype.argumentsMin = 3;
	cFORECAST_ETS.prototype.argumentsMax = 6;
	cFORECAST_ETS.prototype.Calculate = function (arg) {

		//результаты данной фукнции соответсвуют результатам LO, но отличаются от MS!!!
		var oArguments = this._prepareArguments(arg, arguments[1], true,
			[null, cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(1);
		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(1);
		argClone[5] = argClone[5] ? argClone[5].tocNumber() : new cNumber(1);


		argClone[0] = argClone[0].getMatrix();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var pTMat = argClone[0];
		var pMatY = argClone[1];
		var pMatX = argClone[2];
		var nSmplInPrd = argClone[3].getValue();
		var bDataCompletion = argClone[4].getValue();
		var nAggregation = argClone[5].getValue();

		if (nAggregation < 1 || nAggregation > 7) {
			return new cError(cErrorType.not_numeric);
		}
		if (bDataCompletion !== 1 && bDataCompletion !== 0) {
			return new cError(cErrorType.not_numeric);
		}

		var aETSCalc = new ScETSForecastCalculation(pMatX.length);
		var isError = aETSCalc.PreprocessDataRange(pMatX, pMatY, nSmplInPrd, bDataCompletion, nAggregation, pTMat);
		if (!isError) {
			///*,( eETSType != etsStatAdd && eETSType != etsStatMult ? pTMat : nullptr ),eETSType )
			return new cError(cErrorType.wrong_value_type);
		} else if (isError && cElementType.error === isError.type) {
			return isError;
		}


		var pFcMat = aETSCalc.GetForecastRange(pTMat);


		return pFcMat && pFcMat[0] ? new cNumber(pFcMat[0][0]) : new cError(cErrorType.wrong_value_type);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_CONFINT() {
	}

	cFORECAST_ETS_CONFINT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_CONFINT.prototype.constructor = cFORECAST_ETS_CONFINT;
	cFORECAST_ETS_CONFINT.prototype.name = 'FORECAST.ETS.CONFINT';
	cFORECAST_ETS_CONFINT.prototype.argumentsMin = 3;
	cFORECAST_ETS_CONFINT.prototype.argumentsMax = 7;
	cFORECAST_ETS_CONFINT.prototype.Calculate = function (arg) {

		//результаты данной фукнции соответсвуют результатам LO, но отличаются от MS!!!
		var oArguments = this._prepareArguments(arg, arguments[1], true,
			[null, cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(0.95);
		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(1);
		argClone[5] = argClone[5] ? argClone[5].tocNumber() : new cNumber(1);
		argClone[6] = argClone[6] ? argClone[6].tocNumber() : new cNumber(1);


		argClone[0] = argClone[0].getMatrix();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var pTMat = argClone[0];
		var pMatY = argClone[1];
		var pMatX = argClone[2];
		var fPILevel = argClone[3].getValue();
		var nSmplInPrd = argClone[4].getValue();
		var bDataCompletion = argClone[5].getValue();
		var nAggregation = argClone[6].getValue();

		if (fPILevel < 0 || fPILevel > 1) {
			return new cError(cErrorType.not_numeric);
		}
		if (nAggregation < 1 || nAggregation > 7) {
			return new cError(cErrorType.not_numeric);
		}
		if (bDataCompletion !== 1 && bDataCompletion !== 0) {
			return new cError(cErrorType.not_numeric);
		}

		var aETSCalc = new ScETSForecastCalculation(pMatX.length);
		var isError = aETSCalc.PreprocessDataRange(pMatX, pMatY, nSmplInPrd, bDataCompletion, nAggregation, pTMat);
		if (!isError) {
			///*,( eETSType != etsStatAdd && eETSType != etsStatMult ? pTMat : nullptr ),eETSType )
			return new cError(cErrorType.wrong_value_type);
		} else if (isError && cElementType.error === isError.type) {
			return isError;
		}

		/*SCSIZE nC, nR;
		 pTMat->GetDimensions( nC, nR );
		 ScMatrixRef pPIMat = GetNewMat( nC, nR );*/
		var pPIMat = null;
		if (nSmplInPrd === 0) {
			pPIMat = aETSCalc.GetEDSPredictionIntervals(pTMat, fPILevel);
		} else {
			pPIMat = aETSCalc.GetETSPredictionIntervals(pTMat, fPILevel);
		}

		if (null === pPIMat) {
			return new cError(cErrorType.wrong_value_type);
		}

		return new cNumber(pPIMat[0][0]);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_SEASONALITY() {
	}

	cFORECAST_ETS_SEASONALITY.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_SEASONALITY.prototype.constructor = cFORECAST_ETS_SEASONALITY;
	cFORECAST_ETS_SEASONALITY.prototype.name = 'FORECAST.ETS.SEASONALITY';
	cFORECAST_ETS_SEASONALITY.prototype.argumentsMin = 2;
	cFORECAST_ETS_SEASONALITY.prototype.argumentsMax = 4;
	cFORECAST_ETS_SEASONALITY.prototype.Calculate = function (arg) {

		//результаты данной фукнции соответсвуют результатам LO, но отличаются от MS!!!
		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(1);
		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(1);


		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var pMatY = argClone[0];
		var pMatX = argClone[1];
		var bDataCompletion = argClone[2].getValue();
		var nAggregation = argClone[3].getValue();

		if (nAggregation < 1 || nAggregation > 7) {
			return new cError(cErrorType.not_numeric);
		}
		if (bDataCompletion !== 1 && bDataCompletion !== 0) {
			return new cError(cErrorType.not_numeric);
		}

		var aETSCalc = new ScETSForecastCalculation(pMatX.length);
		var isError = aETSCalc.PreprocessDataRange(pMatX, pMatY, 1, bDataCompletion, nAggregation);
		if (!isError) {
			///*,( eETSType != etsStatAdd && eETSType != etsStatMult ? pTMat : nullptr ),eETSType )
			return new cError(cErrorType.wrong_value_type);
		} else if (isError && cElementType.error === isError.type) {
			return isError;
		}

		var res = aETSCalc.mnSmplInPrd;

		return new cNumber(res);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFORECAST_ETS_STAT() {
	}

	cFORECAST_ETS_STAT.prototype = Object.create(cBaseFunction.prototype);
	cFORECAST_ETS_STAT.prototype.constructor = cFORECAST_ETS_STAT;
	cFORECAST_ETS_STAT.prototype.name = 'FORECAST.ETS.STAT';
	cFORECAST_ETS_STAT.prototype.argumentsMin = 3;
	cFORECAST_ETS_STAT.prototype.argumentsMax = 6;
	cFORECAST_ETS_STAT.prototype.Calculate = function (arg) {

		//результаты данной фукнции соответсвуют результатам LO, но отличаются от MS!!!
		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		argClone[3] = argClone[3] ? argClone[3].tocNumber() : new cNumber(1);
		argClone[4] = argClone[4] ? argClone[4].tocNumber() : new cNumber(1);
		argClone[5] = argClone[5] ? argClone[5].tocNumber() : new cNumber(1);

		argClone[2] = convertToMatrix(argClone[2]);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var pMatY = argClone[0];
		var pMatX = argClone[1];
		var pTypeMat = argClone[2];
		var nSmplInPrd = argClone[3].getValue();
		var bDataCompletion = argClone[4].getValue();
		var nAggregation = argClone[5].getValue();

		if (nAggregation < 1 || nAggregation > 7) {
			return new cError(cErrorType.not_numeric);
		}
		if (bDataCompletion !== 1 && bDataCompletion !== 0) {
			return new cError(cErrorType.not_numeric);
		}

		var aETSCalc = new ScETSForecastCalculation(pMatX.length);
		var isError = aETSCalc.PreprocessDataRange(pMatX, pMatY, nSmplInPrd, bDataCompletion, nAggregation);
		if (!isError) {
			return new cError(cErrorType.wrong_value_type);
		} else if (isError && cElementType.error === isError.type) {
			return isError;
		}

		var pFcMat = aETSCalc.GetStatisticValue(pTypeMat);
		var res = null;
		if (!pFcMat) {
			return new cError(cErrorType.wrong_value_type);
		} else {
			res = pFcMat[0][0];
		}

		return null !== res ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
	};

	/**
	 * @constructor
	 * @extends {cFORECAST}
	 */
	function cFORECAST_LINEAR() {
	}

	cFORECAST_LINEAR.prototype = Object.create(cFORECAST.prototype);
	cFORECAST_LINEAR.prototype.constructor = cFORECAST_LINEAR;
	cFORECAST_LINEAR.prototype.name = 'FORECAST.LINEAR';
	cFORECAST_LINEAR.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFREQUENCY() {
	}

	cFREQUENCY.prototype = Object.create(cBaseFunction.prototype);
	cFREQUENCY.prototype.constructor = cFREQUENCY;
	cFREQUENCY.prototype.name = 'FREQUENCY';
	cFREQUENCY.prototype.argumentsMin = 2;
	cFREQUENCY.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.not_available);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix()[0];
		} else {
			return new cError(cErrorType.not_available);
		}

		return frequency(arg0, arg1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cFTEST() {
	}

	cFTEST.prototype = Object.create(cBaseFunction.prototype);
	cFTEST.prototype.constructor = cFTEST;
	cFTEST.prototype.name = 'FTEST';
	cFTEST.prototype.argumentsMin = 2;
	cFTEST.prototype.argumentsMax = 2;
	cFTEST.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcFTest = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];

			return fTest(arg0, arg1);
		};

		return this._findArrayInNumberArguments(oArguments, calcFTest);
	};


	/**
	 * @constructor
	 * @extends {cFTEST}
	 */
	function cF_TEST() {
	}

	cF_TEST.prototype = Object.create(cFTEST.prototype);
	cF_TEST.prototype.constructor = cF_TEST;
	cF_TEST.prototype.name = 'F.TEST';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMA() {
	}

	cGAMMA.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA.prototype.constructor = cGAMMA;
	cGAMMA.prototype.name = 'GAMMA';
	cGAMMA.prototype.argumentsMin = 1;
	cGAMMA.prototype.argumentsMax = 1;
	cGAMMA.prototype.isXLFN = true;
	cGAMMA.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGamma = function (argArray) {
			if (argArray[0] <= 0 && isInteger(argArray[0])) {
				return new cError(cErrorType.not_numeric);
			}
			var res = getGamma(argArray[0]);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcGamma);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMA_DIST() {
	}

	cGAMMA_DIST.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA_DIST.prototype.constructor = cGAMMA_DIST;
	cGAMMA_DIST.prototype.name = 'GAMMA.DIST';
	cGAMMA_DIST.prototype.argumentsMin = 4;
	cGAMMA_DIST.prototype.argumentsMax = 4;
	cGAMMA_DIST.prototype.isXLFN = true;
	cGAMMA_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGamma = function (argArray) {
			var fX = argArray[0];
			var fAlpha = argArray[1];
			var fBeta = argArray[2];
			var bCumulative = argArray[3];

			var res = null;
			if ((fX < 0) || fAlpha <= 0 || fBeta <= 0) {
				return new cError(cErrorType.not_numeric);
			} else {
				if (bCumulative) {
					res = getGammaDist(fX, fAlpha, fBeta);
				} else {
					res = getGammaDistPDF(fX, fAlpha, fBeta);
				}
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcGamma);
	};

	/**
	 * @constructor
	 * @extends {cGAMMA_DIST}
	 */
	function cGAMMADIST() {
	}

	cGAMMADIST.prototype = Object.create(cGAMMA_DIST.prototype);
	cGAMMADIST.prototype.constructor = cGAMMADIST;
	cGAMMADIST.prototype.name = 'GAMMADIST';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMA_INV() {
	}

	cGAMMA_INV.prototype = Object.create(cBaseFunction.prototype);
	cGAMMA_INV.prototype.constructor = cGAMMA_INV;
	cGAMMA_INV.prototype.name = 'GAMMA.INV';
	cGAMMA_INV.prototype.argumentsMin = 3;
	cGAMMA_INV.prototype.argumentsMax = 3;
	cGAMMA_INV.prototype.isXLFN = true;
	cGAMMA_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGamma = function (argArray) {
			var fP = argArray[0];
			var fAlpha = argArray[1];
			var fBeta = argArray[2];

			if (fAlpha <= 0 || fBeta <= 0 || fP < 0 || fP >= 1) {
				return new cError(cErrorType.not_numeric);
			}

			var res = null;
			if (fP === 0) {
				res = 0;
			} else {
				var aFunc = new GAMMADISTFUNCTION(fP, fAlpha, fBeta);
				var fStart = fAlpha * fBeta;
				var oVal = iterateInverse(aFunc, fStart * 0.5, fStart);
				var bConvError = oVal.bError;

				if (bConvError) {
					return new cError(cErrorType.not_numeric);
					//SetError(FormulaError::NoConvergence);
				}
				res = oVal.val;
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcGamma);
	};

	/**
	 * @constructor
	 * @extends {cGAMMA_INV}
	 */
	function cGAMMAINV() {
	}

	cGAMMAINV.prototype = Object.create(cGAMMA_INV.prototype);
	cGAMMAINV.prototype.constructor = cGAMMAINV;
	cGAMMAINV.prototype.name = 'GAMMAINV';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMALN() {
	}

	cGAMMALN.prototype = Object.create(cBaseFunction.prototype);
	cGAMMALN.prototype.constructor = cGAMMALN;
	cGAMMALN.prototype.name = 'GAMMALN';
	cGAMMALN.prototype.argumentsMin = 1;
	cGAMMALN.prototype.argumentsMax = 1;
	cGAMMALN.prototype.Calculate = function (arg) {



		/*
		 from OpenOffice Source.
		 end
		 */

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
					var a = getLogGamma(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = getLogGamma(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAMMALN_PRECISE() {
	}

	cGAMMALN_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cGAMMALN_PRECISE.prototype.constructor = cGAMMALN_PRECISE;
	cGAMMALN_PRECISE.prototype.name = 'GAMMALN.PRECISE';
	cGAMMALN_PRECISE.prototype.argumentsMin = 1;
	cGAMMALN_PRECISE.prototype.argumentsMax = 1;
	cGAMMALN_PRECISE.prototype.isXLFN = true;
	cGAMMALN_PRECISE.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGamma = function (argArray) {
			var a = getLogGamma(argArray[0]);
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		};

		return this._findArrayInNumberArguments(oArguments, calcGamma);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGAUSS() {
	}

	cGAUSS.prototype = Object.create(cBaseFunction.prototype);
	cGAUSS.prototype.constructor = cGAUSS;
	cGAUSS.prototype.name = 'GAUSS';
	cGAUSS.prototype.argumentsMin = 1;
	cGAUSS.prototype.argumentsMax = 1;
	cGAUSS.prototype.isXLFN = true;
	cGAUSS.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcGauss = function (argArray) {
			var res = gauss(argArray[0]);
			return isNaN(res) ? new cError(cErrorType.not_numeric) : new cNumber(res);
		};

		return this._findArrayInNumberArguments(oArguments, calcGauss);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGEOMEAN() {
	}

	cGEOMEAN.prototype = Object.create(cBaseFunction.prototype);
	cGEOMEAN.prototype.constructor = cGEOMEAN;
	cGEOMEAN.prototype.name = 'GEOMEAN';
	cGEOMEAN.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return geommean(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGROWTH() {
	}

	cGROWTH.prototype = Object.create(cBaseFunction.prototype);
	cGROWTH.prototype.constructor = cGROWTH;
	cGROWTH.prototype.name = 'GROWTH';
	cGROWTH.prototype.argumentsMin = 1;
	cGROWTH.prototype.argumentsMax = 4;
	cGROWTH.prototype.Calculate = function (arg) {

		var prepeareArgs = prepeareGrowthTrendCalculation(this, arg);
		if (cElementType.error === prepeareArgs.type) {
			return prepeareArgs;
		}
		var pMatY = prepeareArgs.pMatY;
		var pMatX = prepeareArgs.pMatX;
		var pMatNewX = prepeareArgs.pMatNewX;
		var bConstant = prepeareArgs.bConstant;
		var res = CalculateTrendGrowth(pMatY, pMatX, pMatNewX, bConstant, true);

		if (res && res[0] && res[0][0]) {
			return new cNumber(res[0][0]);
		} else {
			return new cError(cErrorType.wrong_value_type);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHARMEAN() {
	}

	cHARMEAN.prototype = Object.create(cBaseFunction.prototype);
	cHARMEAN.prototype.constructor = cHARMEAN;
	cHARMEAN.prototype.name = 'HARMEAN';
	cHARMEAN.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return harmmean(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHYPGEOMDIST() {
	}

	cHYPGEOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cHYPGEOMDIST.prototype.constructor = cHYPGEOMDIST;
	cHYPGEOMDIST.prototype.name = 'HYPGEOMDIST';
	cHYPGEOMDIST.prototype.argumentsMin = 4;
	cHYPGEOMDIST.prototype.argumentsMax = 4;
	cHYPGEOMDIST.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arg3 = arg[3];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1]);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
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


		if (arg0.getValue() < 0 || arg0.getValue() > Math.min(arg1.getValue(), arg2.getValue()) ||
			arg0.getValue() < Math.max(0, arg1.getValue() - arg3.getValue() + arg2.getValue()) ||
			arg1.getValue() <= 0 || arg1.getValue() > arg3.getValue() || arg2.getValue() <= 0 ||
			arg2.getValue() > arg3.getValue() || arg3.getValue() <= 0) {
			return new cError(cErrorType.not_numeric);
		}

		return new cNumber(Math.binomCoeff(arg2.getValue(), arg0.getValue()) *
			Math.binomCoeff(arg3.getValue() - arg2.getValue(), arg1.getValue() - arg0.getValue()) /
			Math.binomCoeff(arg3.getValue(), arg1.getValue()));

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHYPGEOM_DIST() {
	}

	cHYPGEOM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cHYPGEOM_DIST.prototype.constructor = cHYPGEOM_DIST;
	cHYPGEOM_DIST.prototype.name = 'HYPGEOM.DIST';
	cHYPGEOM_DIST.prototype.argumentsMin = 5;
	cHYPGEOM_DIST.prototype.argumentsMax = 5;
	cHYPGEOM_DIST.prototype.isXLFN = true;
	cHYPGEOM_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();
		argClone[4] = argClone[4].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function hypgeomdist(argArray) {
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);
			var arg2 = Math.floor(argArray[2]);
			var arg3 = Math.floor(argArray[3]);
			var bCumulative = argArray[4];

			if (arg0 < 0 || arg0 > Math.min(arg1, arg2) || arg0 < Math.max(0, arg1 - arg3 + arg2) || arg1 <= 0 ||
				arg1 > arg3 || arg2 <= 0 || arg2 > arg3 || arg3 <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			var res;
			if (bCumulative) {
				var fVal = 0.0;

				//TODO значения неверные для этой ветки! пересчитать
				for (var i = 0; i <= arg0; i++) {
					var temp = Math.binomCoeff(arg2, i) * Math.binomCoeff(arg3 - arg2, arg1 - i) /
						Math.binomCoeff(arg3, arg1);
					if (!isNaN(temp)) {
						fVal += temp;
					}
				}

				res = fVal;
			} else {
				res = Math.binomCoeff(arg2, arg0) * Math.binomCoeff(arg3 - arg2, arg1 - arg0) /
					Math.binomCoeff(arg3, arg1);
			}

			return isNaN(res) ? new cError(cErrorType.not_numeric) : new cNumber(res);
		}

		return this._findArrayInNumberArguments(oArguments, hypgeomdist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cINTERCEPT() {
	}

	cINTERCEPT.prototype = Object.create(cBaseFunction.prototype);
	cINTERCEPT.prototype.constructor = cINTERCEPT;
	cINTERCEPT.prototype.name = 'INTERCEPT';
	cINTERCEPT.prototype.argumentsMin = 2;
	cINTERCEPT.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return intercept(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cKURT() {
	}

	cKURT.prototype = Object.create(cBaseFunction.prototype);
	cKURT.prototype.constructor = cKURT;
	cKURT.prototype.name = 'KURT';
	cKURT.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return kurt(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLARGE() {
	}

	cLARGE.prototype = Object.create(cBaseFunction.prototype);
	cLARGE.prototype.constructor = cLARGE;
	cLARGE.prototype.name = 'LARGE';
	cLARGE.prototype.argumentsMin = 2;
	cLARGE.prototype.argumentsMax = 2;
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
			arg0 = arg0.getValuesNoEmpty(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
				this.excludeNestedStAg);
		} else if (cElementType.array === arg0.type) {
			arg0 = arg0.getMatrix();
		} else if (cElementType.cellsRange3D === arg0.type) {
			arg0 = arg0.getMatrix()[0];
		} else {
			return new cError(cErrorType.not_numeric);
		}


		if (cElementType.cellsRange === arg1.type || cElementType.cellsRange3D === arg1.type) {
			arg1 = arg1.cross(arguments[1]);
		} else if (cElementType.array === arg1.type) {
			arg1 = arg1.getElement(0);
		}

		arg1 = arg1.tocNumber();
		return this._getValue(arg0, arg1);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLINEST() {
	}

	cLINEST.prototype = Object.create(cBaseFunction.prototype);
	cLINEST.prototype.constructor = cLINEST;
	cLINEST.prototype.name = 'LINEST';
	cLINEST.prototype.argumentsMin = 1;
	cLINEST.prototype.argumentsMax = 4;
	cLINEST.prototype.Calculate = function (arg) {

		arg[0] = tryNumberToArray(arg[0]);
		if (arg[1]) {
			arg[1] = tryNumberToArray(arg[1]);
		}

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var pMatY = argClone[0];
		var pMatX = argClone[1];
		var bConstant = getBoolValue(argClone[2], true);
		var bStats = getBoolValue(argClone[3], true);

		var res = CalculateRGPRKP(pMatY, pMatX, bConstant, bStats);

		if (res && res[0] && res[0][0]) {
			return new cNumber(res[0][0]);
		} else {
			return new cError(cErrorType.wrong_value_type);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGEST() {
	}

	cLOGEST.prototype = Object.create(cBaseFunction.prototype);
	cLOGEST.prototype.constructor = cLOGEST;
	cLOGEST.prototype.name = 'LOGEST';
	cLOGEST.prototype.argumentsMin = 1;
	cLOGEST.prototype.argumentsMax = 4;

	/*cLOGEST.prototype.Calculate = function (arg) {

	 arg[0] = tryNumberToArray(arg[0]);
	 if(arg[1]){
	 arg[1] = tryNumberToArray(arg[1]);
	 }

	 var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array, cElementType.array]);
	 var argClone = oArguments.args;

	 var argError;
	 if (argError = this._checkErrorArg(argClone)) {
	 return argError;
	 }

	 var pMatY = argClone[0];
	 var pMatX = argClone[1];
	 var bConstant = getBoolValue(argClone[2], true);
	 var bStats = getBoolValue(argClone[3], true);

	 var res = CalculateRGPRKP( pMatY, pMatX, bConstant, bStats, true);

	 if(res && res[0] && res[0][0]){
	 return new cNumber(res[0][0]);
	 }else{
	 return new cError(cErrorType.wrong_value_type);
	 }
	 };*/

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGINV() {
	}

	cLOGINV.prototype = Object.create(cBaseFunction.prototype);
	cLOGINV.prototype.constructor = cLOGINV;
	cLOGINV.prototype.name = 'LOGINV';
	cLOGINV.prototype.argumentsMin = 3;
	cLOGINV.prototype.argumentsMax = 3;
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
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

		return loginv(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGNORM_DIST() {
	}

	cLOGNORM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORM_DIST.prototype.constructor = cLOGNORM_DIST;
	cLOGNORM_DIST.prototype.name = 'LOGNORM.DIST';
	cLOGNORM_DIST.prototype.argumentsMin = 4;
	cLOGNORM_DIST.prototype.argumentsMax = 4;
	cLOGNORM_DIST.prototype.isXLFN = true;
	cLOGNORM_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var normdist = function (argArray) {
			var x = argArray[0];
			var mue = argArray[1];
			var sigma = argArray[2];
			var bCumulative = argArray[3];

			var res = null;
			if (sigma <= 0.0) {
				return new cError(cErrorType.not_numeric);
			}
			if (bCumulative) {
				if (x <= 0) {
					res = 0;
				} else {
					res = 0.5 + gauss((Math.ln(x) - mue) / sigma);
				}
			} else {
				if (x <= 0) {
					return new cError(cErrorType.not_numeric);
				} else {
					res = phi((Math.log(x) - mue) / sigma) / sigma / x;
				}
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, normdist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGNORM_INV() {
	}

	cLOGNORM_INV.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORM_INV.prototype.constructor = cLOGNORM_INV;
	cLOGNORM_INV.prototype.name = 'LOGNORM.INV';
	cLOGNORM_INV.prototype.argumentsMin = 3;
	cLOGNORM_INV.prototype.argumentsMax = 3;
	cLOGNORM_INV.prototype.isXLFN = true;
	cLOGNORM_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var normdist = function (argArray) {
			var fP = argArray[0];
			var fMue = argArray[1];
			var fSigma = argArray[2];

			var res = null;
			if (fSigma <= 0.0 || fP <= 0.0 || fP >= 1.0) {
				return new cError(cErrorType.not_numeric);
			} else {
				res = Math.exp(fMue + fSigma * gaussinv(fP));
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, normdist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cLOGNORMDIST() {
	}

	cLOGNORMDIST.prototype = Object.create(cBaseFunction.prototype);
	cLOGNORMDIST.prototype.constructor = cLOGNORMDIST;
	cLOGNORMDIST.prototype.name = 'LOGNORMDIST';
	cLOGNORMDIST.prototype.argumentsMin = 3;
	cLOGNORMDIST.prototype.argumentsMax = 3;
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
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

		return normdist(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMAX() {
	}

	cMAX.prototype = Object.create(cBaseFunction.prototype);
	cMAX.prototype.constructor = cMAX;
	cMAX.prototype.name = 'MAX';
	cMAX.prototype.argumentsMin = 1;
	cMAX.prototype.Calculate = function (arg) {
		var v, element, argIVal, max = Number.NEGATIVE_INFINITY;
		for (var i = 0; i < arg.length; i++) {
			element = arg[i];
			argIVal = element.getValue();
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					if (cElementType.error === argIVal.type) {
						return argIVal;
					}
					if (cElementType.number === argIVal.type) {
						v = argIVal.tocNumber();
						if (v.getValue() > max) {
							max = v.getValue();
						}
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var argArr = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
				for (var j = 0; j < argArr.length; j++) {
					if (cElementType.number === argArr[j].type) {
						v = argArr[j].tocNumber();
						if (v.getValue() > max) {
							max = v.getValue();
						}
					} else if (cElementType.error === argArr[j].type) {
						return argArr[j];
					}
				}
			} else if (cElementType.error === element.type) {
				return element;
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
					return max;
				}
			} else {
				if (element.getValue() > max) {
					max = element.getValue();
				}
			}
		}
		return (max === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMAXA() {
	}

	cMAXA.prototype = Object.create(cBaseFunction.prototype);
	cMAXA.prototype.constructor = cMAXA;
	cMAXA.prototype.name = 'MAXA';
	cMAXA.prototype.argumentsMin = 1;
	cMAXA.prototype.Calculate = function (arg) {
		var argI, argIVal, max = Number.NEGATIVE_INFINITY, v;
		for (var i = 0; i < arg.length; i++) {
			argI = arg[i];
			argIVal = argI.getValue();
			if (argI instanceof cRef || argI instanceof cRef3D) {

				if (argIVal instanceof cError) {
					return argIVal;
				}

				v = argIVal.tocNumber();

				if (v instanceof cNumber && v.getValue() > max) {
					max = v.getValue();
				}
			} else if (argI instanceof cArea || argI instanceof cArea3D) {
				var argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return argArr[j];
					}

					v = argArr[j].tocNumber();

					if (v instanceof cNumber && v.getValue() > max) {
						max = v.getValue();
					}
				}
			} else if (argI instanceof cError) {
				return argI;
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
					return max;
				}
			} else {
				if (argI.getValue() > max) {
					max = argI.getValue();
				}
			}
		}
		return ( max === Number.NEGATIVE_INFINITY ? new cNumber(0) : new cNumber(max) )
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMAXIFS() {
	}

	cMAXIFS.prototype = Object.create(cBaseFunction.prototype);
	cMAXIFS.prototype.constructor = cMAXIFS;
	cMAXIFS.prototype.name = 'MAXIFS';
	cMAXIFS.prototype.argumentsMin = 3;
	cMAXIFS.prototype.isXLFN = true;
	cMAXIFS.prototype.Calculate = function (arg) {
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

			//compare
			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return new cError(cErrorType.wrong_value_type);
				}
				for (j = 0; j < arg1Matrix[i].length; ++j) {
					if (arg0Matrix[i][j] && !AscCommonExcel.matching(arg1Matrix[i][j], matchingInfo)) {
						//MS считает в данном случае, что значение 0 (из диапазона условий) соответсвует условию = ""
						if (!(null === matchingInfo.op && "" === matchingInfo.val.value && 0 ===
								arg1Matrix[i][j].value)) {
							arg0Matrix[i][j] = null;
						}
					}
				}
			}
		}

		var resArr = [];
		var valMatrix0;
		for (i = 0; i < arg0Matrix.length; ++i) {
			for (j = 0; j < arg0Matrix[i].length; ++j) {
				if ((valMatrix0 = arg0Matrix[i][j]) && cElementType.number === valMatrix0.type) {
					resArr.push(valMatrix0.getValue());
				}
			}
		}

		if (0 === resArr.length) {
			return new cNumber(0);
		}

		resArr.sort(function (a, b) {
			return b - a;
		});

		return new cNumber(resArr[0]);
	};
	cMAXIFS.prototype.checkArguments = function (countArguments) {
		return 1 === countArguments % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMINIFS() {
	}

	cMINIFS.prototype = Object.create(cBaseFunction.prototype);
	cMINIFS.prototype.constructor = cMINIFS;
	cMINIFS.prototype.name = 'MINIFS';
	cMINIFS.prototype.argumentsMin = 3;
	cMINIFS.prototype.isXLFN = true;
	cMINIFS.prototype.Calculate = function (arg) {
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

			//compare
			for (i = 0; i < arg1Matrix.length; ++i) {
				if (arg0Matrix[i].length !== arg1Matrix[i].length) {
					return new cError(cErrorType.wrong_value_type);
				}
				for (j = 0; j < arg1Matrix[i].length; ++j) {
					if (arg0Matrix[i][j] && !AscCommonExcel.matching(arg1Matrix[i][j], matchingInfo)) {
						//MS считает в данном случае, что значение 0 (из диапазона условий) соответсвует условию = ""
						if (!(null === matchingInfo.op && "" === matchingInfo.val.value && 0 ===
								arg1Matrix[i][j].value)) {
							arg0Matrix[i][j] = null;
						}
					}
				}
			}
		}

		var resArr = [];
		var valMatrix0;
		for (i = 0; i < arg0Matrix.length; ++i) {
			for (j = 0; j < arg0Matrix[i].length; ++j) {
				if ((valMatrix0 = arg0Matrix[i][j]) && cElementType.number === valMatrix0.type) {
					resArr.push(valMatrix0.getValue());
				}
			}
		}

		if (0 === resArr.length) {
			return new cNumber(0);
		}

		resArr.sort(function (a, b) {
			return a - b;
		});

		return new cNumber(resArr[0]);
	};
	cMINIFS.prototype.checkArguments = function (countArguments) {
		return 1 === countArguments % 2 && cBaseFunction.prototype.checkArguments.apply(this, arguments);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMEDIAN() {
	}

	cMEDIAN.prototype = Object.create(cBaseFunction.prototype);
	cMEDIAN.prototype.constructor = cMEDIAN;
	cMEDIAN.prototype.name = 'MEDIAN';
	cMEDIAN.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return median(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMIN() {
	}

	cMIN.prototype = Object.create(cBaseFunction.prototype);
	cMIN.prototype.constructor = cMIN;
	cMIN.prototype.name = 'MIN';
	cMIN.prototype.argumentsMin = 1;
	cMIN.prototype.Calculate = function (arg) {
		var v, element, argIVal, min = Number.POSITIVE_INFINITY;
		for (var i = 0; i < arg.length; i++) {
			element = arg[i];
			argIVal = element.getValue();
			if (cElementType.cell === element.type || cElementType.cell3D === element.type) {
				if (!this.checkExclude || !element.isHidden(this.excludeHiddenRows)) {
					if (cElementType.error === argIVal.type) {
						return argIVal;
					}
					if (cElementType.number === argIVal.type) {
						v = argIVal.tocNumber();
						if (v.getValue() < min) {
							min = v.getValue();
						}
					}
				}
			} else if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var argArr = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
				for (var j = 0; j < argArr.length; j++) {
					if (cElementType.number === argArr[j].type) {
						v = argArr[j].tocNumber();
						if (v.getValue() < min) {
							min = v.getValue();
						}
						continue;
					} else if (cElementType.error === argArr[j].type) {
						return argArr[j];
					}
				}
			} else if (cElementType.error === element.type) {
				return element;
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
					return min;
				}
			} else {
				if (element.getValue() < min) {
					min = element.getValue();
				}
			}
		}
		return ( min === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min) );
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMINA() {
	}

	cMINA.prototype = Object.create(cBaseFunction.prototype);
	cMINA.prototype.constructor = cMINA;
	cMINA.prototype.name = 'MINA';
	cMINA.prototype.argumentsMin = 1;
	cMINA.prototype.Calculate = function (arg) {
		var argI, argIVal, min = Number.POSITIVE_INFINITY, v;
		for (var i = 0; i < arg.length; i++) {
			argI = arg[i];
			argIVal = argI.getValue();
			if (argI instanceof cRef || argI instanceof cRef3D) {

				if (argIVal instanceof cError) {
					return argIVal;
				}

				v = argIVal.tocNumber();

				if (v instanceof cNumber && v.getValue() < min) {
					min = v.getValue();
				}
			} else if (argI instanceof cArea || argI instanceof cArea3D) {
				var argArr = argI.getValue();
				for (var j = 0; j < argArr.length; j++) {

					if (argArr[j] instanceof cError) {
						return argArr[j];
					}

					v = argArr[j].tocNumber();

					if (v instanceof cNumber && v.getValue() < min) {
						min = v.getValue();
					}
				}
			} else if (argI instanceof cError) {
				return argI;
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
					return min;
				}
			} else {
				if (argI.getValue() < min) {
					min = argI.getValue();
				}
			}
		}
		return ( min === Number.POSITIVE_INFINITY ? new cNumber(0) : new cNumber(min) );
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cMODE() {
	}

	cMODE.prototype = Object.create(cBaseFunction.prototype);
	cMODE.prototype.constructor = cMODE;
	cMODE.prototype.name = 'MODE';
	cMODE.prototype.argumentsMin = 1;
	cMODE.prototype.Calculate = function (arg) {

		function mode(x) {

			var medArr = [], t, i;

			for (i = 0; i < x.length; i++) {
				t = x[i].tocNumber();
				if (t instanceof cNumber) {
					medArr.push(t.getValue())
				}
			}

			medArr.sort(fSortAscending);

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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return mode(arr0);

	};

	/**
	 * @constructor
	 * @extends {cPERCENTILE}
	 */
	//TODO разницы в работе функций cMODE_MULT и cMODE не нашёл, но в LO обработки немного разные. проверить!
	function cMODE_MULT() {
	}

	cMODE_MULT.prototype = Object.create(cMODE.prototype);
	cMODE_MULT.prototype.constructor = cMODE_MULT;
	cMODE_MULT.prototype.name = 'MODE.MULT';
	cMODE_MULT.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {cPERCENTILE}
	 */
	function cMODE_SNGL() {
	}

	cMODE_SNGL.prototype = Object.create(cMODE.prototype);
	cMODE_SNGL.prototype.constructor = cMODE_SNGL;
	cMODE_SNGL.prototype.name = 'MODE.SNGL';
	cMODE_SNGL.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNEGBINOMDIST() {
	}

	cNEGBINOMDIST.prototype = Object.create(cBaseFunction.prototype);
	cNEGBINOMDIST.prototype.constructor = cNEGBINOMDIST;
	cNEGBINOMDIST.prototype.name = 'NEGBINOMDIST';
	cNEGBINOMDIST.prototype.argumentsMin = 3;
	cNEGBINOMDIST.prototype.argumentsMax = 3;
	cNEGBINOMDIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function negbinomdist(argArray) {
			var x = argArray[0];
			var r = argArray[1];
			var p = argArray[2];
			if (x < 0 || r < 1 || p < 0 || p > 1) {
				return new cError(cErrorType.not_numeric);
			} else {
				return new cNumber(Math.binomCoeff(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x));
			}
		}

		return this._findArrayInNumberArguments(oArguments, negbinomdist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNEGBINOM_DIST() {
	}

	cNEGBINOM_DIST.prototype = Object.create(cBaseFunction.prototype);
	cNEGBINOM_DIST.prototype.constructor = cNEGBINOM_DIST;
	cNEGBINOM_DIST.prototype.name = 'NEGBINOM.DIST';
	cNEGBINOM_DIST.prototype.argumentsMin = 4;
	cNEGBINOM_DIST.prototype.argumentsMax = 4;
	cNEGBINOM_DIST.prototype.isXLFN = true;
	cNEGBINOM_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function negbinomdist(argArray) {
			var x = parseInt(argArray[0]);
			var r = parseInt(argArray[1]);
			var p = argArray[2];
			var bCumulative = argArray[3];

			if (x < 0 || r < 1 || p < 0 || p > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var res;
			if (bCumulative) {
				res = 1 - getBetaDist(1 - p, x + 1, r);
			} else {
				res = Math.binomCoeff(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x);
			}

			return isNaN(res) ? new cError(cErrorType.not_numeric) : new cNumber(res);
		}

		return this._findArrayInNumberArguments(oArguments, negbinomdist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORMDIST() {
	}

	cNORMDIST.prototype = Object.create(cBaseFunction.prototype);
	cNORMDIST.prototype.constructor = cNORMDIST;
	cNORMDIST.prototype.name = 'NORMDIST';
	cNORMDIST.prototype.argumentsMin = 4;
	cNORMDIST.prototype.argumentsMax = 4;
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1]);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
		arg2 = arg2.tocNumber();
		arg3 = arg3.tocBool();

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


		return normdist(arg0.getValue(), arg1.getValue(), arg2.getValue(), arg3.toBool());
	};


	/**
	 * @constructor
	 * @extends {cPERCENTILE}
	 */
	function cNORM_DIST() {
	}

	cNORM_DIST.prototype = Object.create(cNORMDIST.prototype);
	cNORM_DIST.prototype.constructor = cNORM_DIST;
	cNORM_DIST.prototype.name = 'NORM.DIST';
	cNORM_DIST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORMINV() {
	}

	cNORMINV.prototype = Object.create(cBaseFunction.prototype);
	cNORMINV.prototype.constructor = cNORMINV;
	cNORMINV.prototype.name = 'NORMINV';
	cNORMINV.prototype.argumentsMin = 3;
	cNORMINV.prototype.argumentsMax = 3;
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
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

		return norminv(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};

	/**
	 * @constructor
	 * @extends {cNORMINV}
	 */
	function cNORM_INV() {
	}

	cNORM_INV.prototype = Object.create(cNORMINV.prototype);
	cNORM_INV.prototype.constructor = cNORM_INV;
	cNORM_INV.prototype.name = 'NORM.INV';
	cNORM_INV.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORMSDIST() {
	}

	cNORMSDIST.prototype = Object.create(cBaseFunction.prototype);
	cNORMSDIST.prototype.constructor = cNORMSDIST;
	cNORMSDIST.prototype.name = 'NORMSDIST';
	cNORMSDIST.prototype.argumentsMin = 1;
	cNORMSDIST.prototype.argumentsMax = 1;
	cNORMSDIST.prototype.Calculate = function (arg) {
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
					var a = 0.5 + gauss(elem.getValue());
					this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
				} else {
					this.array[r][c] = new cError(cErrorType.wrong_value_type);
				}
			})
		} else {
			var a = 0.5 + gauss(arg0.getValue());
			return isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORM_S_DIST() {
	}

	cNORM_S_DIST.prototype = Object.create(cBaseFunction.prototype);
	cNORM_S_DIST.prototype.constructor = cNORM_S_DIST;
	cNORM_S_DIST.prototype.name = 'NORM.S.DIST';
	cNORM_S_DIST.prototype.argumentsMin = 2;
	cNORM_S_DIST.prototype.argumentsMax = 2;
	cNORM_S_DIST.prototype.isXLFN = true;
	cNORM_S_DIST.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cNORM_S_DIST.prototype.Calculate = function (arg) {
		function normDistCalc(argArray) {

			var arg0 = argArray[0], arg1 = argArray[1];
			var res;
			if (arg1) {
				res = 0.5 + gauss(arg0);
			} else {
				res = Math.exp(-Math.pow(arg0, 2) / 2) / Math.sqrt(2 * Math.PI);
			}

			return isNaN(res) ? new cError(cErrorType.not_numeric) : new cNumber(res);
		}

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		return this._findArrayInNumberArguments(oArguments, normDistCalc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cNORMSINV() {
	}

	cNORMSINV.prototype = Object.create(cBaseFunction.prototype);
	cNORMSINV.prototype.constructor = cNORMSINV;
	cNORMSINV.prototype.name = 'NORMSINV';
	cNORMSINV.prototype.argumentsMin = 1;
	cNORMSINV.prototype.argumentsMax = 1;
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
			arg0 = arg0.cross(arguments[1]);
		}
		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return arg0;
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
			return isNaN(a) ? new cError(cErrorType.not_available) : new cNumber(a);
		}
		return arg0;
	};

	/**
	 * @constructor
	 * @extends {cNORMSINV}
	 */
	function cNORM_S_INV() {
	}

	cNORM_S_INV.prototype = Object.create(cNORMSINV.prototype);
	cNORM_S_INV.prototype.constructor = cNORM_S_INV;
	cNORM_S_INV.prototype.name = 'NORM.S.INV';
	cNORM_S_INV.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPEARSON() {
	}

	cPEARSON.prototype = Object.create(cBaseFunction.prototype);
	cPEARSON.prototype.constructor = cPEARSON;
	cPEARSON.prototype.name = 'PEARSON';
	cPEARSON.prototype.argumentsMin = 2;
	cPEARSON.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return pearson(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTILE() {
	}

	cPERCENTILE.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTILE.prototype.constructor = cPERCENTILE;
	cPERCENTILE.prototype.name = 'PERCENTILE';
	cPERCENTILE.prototype.argumentsMin = 2;
	cPERCENTILE.prototype.argumentsMax = 2;
	cPERCENTILE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cPERCENTILE.prototype.Calculate = function (arg) {
		function percentile(argArray) {

			var tA = [], A = argArray[0], alpha = argArray[1];

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

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		return this._findArrayInNumberArguments(oArguments, percentile);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTILE_EXC() {
	}

	cPERCENTILE_EXC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTILE_EXC.prototype.constructor = cPERCENTILE_EXC;
	cPERCENTILE_EXC.prototype.name = 'PERCENTILE.EXC';
	cPERCENTILE_EXC.prototype.argumentsMin = 2;
	cPERCENTILE_EXC.prototype.argumentsMax = 2;
	cPERCENTILE_EXC.prototype.isXLFN = true;
	cPERCENTILE_EXC.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cPERCENTILE_EXC.prototype.Calculate = function (arg) {
		function percentile(argArray) {

			var tA = [], A = argArray[0], alpha = argArray[1];

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

			return getPercentileExclusive(tA, alpha);
		}

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		return this._findArrayInNumberArguments(oArguments, percentile);
	};

	/**
	 * @constructor
	 * @extends {cPERCENTILE}
	 */
	function cPERCENTILE_INC() {
	}

	cPERCENTILE_INC.prototype = Object.create(cPERCENTILE.prototype);
	cPERCENTILE_INC.prototype.constructor = cPERCENTILE_INC;
	cPERCENTILE_INC.prototype.name = 'PERCENTILE.INC';
	cPERCENTILE_INC.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTRANK() {
	}

	cPERCENTRANK.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTRANK.prototype.constructor = cPERCENTRANK;
	cPERCENTRANK.prototype.name = 'PERCENTRANK';
	cPERCENTRANK.prototype.argumentsMin = 2;
	cPERCENTRANK.prototype.argumentsMax = 3;
	cPERCENTRANK.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(3);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function calcPercenTrank(argArray) {

			var tA = [], A = argArray[0], fNum = argArray[1], k = argArray[2];

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

			return percentrank(tA, fNum, k, true);
		}

		return this._findArrayInNumberArguments(oArguments, calcPercenTrank);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERCENTRANK_EXC() {
	}

	cPERCENTRANK_EXC.prototype = Object.create(cBaseFunction.prototype);
	cPERCENTRANK_EXC.prototype.constructor = cPERCENTRANK_EXC;
	cPERCENTRANK_EXC.prototype.name = 'PERCENTRANK.EXC';
	cPERCENTRANK_EXC.prototype.argumentsMin = 2;
	cPERCENTRANK_EXC.prototype.argumentsMax = 3;
	cPERCENTRANK_EXC.prototype.isXLFN = true;
	cPERCENTRANK_EXC.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new cNumber(3);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function calcPercenTrank(argArray) {

			var tA = [], A = argArray[0], fNum = argArray[1], k = argArray[2];

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

			return percentrank(tA, fNum, k);
		}

		return this._findArrayInNumberArguments(oArguments, calcPercenTrank);
	};

	/**
	 * @constructor
	 * @extends {cPERCENTRANK}
	 */
	function cPERCENTRANK_INC() {
	}

	cPERCENTRANK_INC.prototype = Object.create(cPERCENTRANK.prototype);
	cPERCENTRANK_INC.prototype.constructor = cPERCENTRANK_INC;
	cPERCENTRANK_INC.prototype.name = 'PERCENTRANK.INC';
	cPERCENTRANK_INC.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERMUT() {
	}

	cPERMUT.prototype = Object.create(cBaseFunction.prototype);
	cPERMUT.prototype.constructor = cPERMUT;
	cPERMUT.prototype.name = 'PERMUT';
	cPERMUT.prototype.argumentsMin = 2;
	cPERMUT.prototype.argumentsMax = 2;
	cPERMUT.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function permut(argArray) {
			var n = Math.floor(argArray[0]);
			var k = Math.floor(argArray[1]);
			if (n <= 0 || k <= 0 || n < k) {
				return new cError(cErrorType.not_numeric);
			}

			return new cNumber(Math.permut(n, k));
		}

		return this._findArrayInNumberArguments(oArguments, permut);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPERMUTATIONA() {
	}

	cPERMUTATIONA.prototype = Object.create(cBaseFunction.prototype);
	cPERMUTATIONA.prototype.constructor = cPERMUTATIONA;
	cPERMUTATIONA.prototype.name = 'PERMUTATIONA';
	cPERMUTATIONA.prototype.argumentsMin = 2;
	cPERMUTATIONA.prototype.argumentsMax = 2;
	cPERMUTATIONA.prototype.isXLFN = true;
	cPERMUTATIONA.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function permutationa(argArray) {
			var n = Math.floor(argArray[0]);
			var k = Math.floor(argArray[1]);
			if (n < 0.0 || k < 0.0) {
				return new cError(cErrorType.not_numeric);
			}

			return new cNumber(Math.pow(n, k));
		}

		return this._findArrayInNumberArguments(oArguments, permutationa);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPHI() {
	}

	cPHI.prototype = Object.create(cBaseFunction.prototype);
	cPHI.prototype.constructor = cPHI;
	cPHI.prototype.name = 'PHI';
	cPHI.prototype.argumentsMin = 1;
	cPHI.prototype.argumentsMax = 1;
	cPHI.prototype.isXLFN = true;
	cPHI.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function calcPhi(argArray) {
			var res = phi(argArray[0]);

			return isNaN(res) ? new cError(cErrorType.not_available) : new cNumber(res);
		}

		return this._findArrayInNumberArguments(oArguments, calcPhi);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPOISSON() {
	}

	cPOISSON.prototype = Object.create(cBaseFunction.prototype);
	cPOISSON.prototype.constructor = cPOISSON;
	cPOISSON.prototype.name = 'POISSON';
	cPOISSON.prototype.argumentsMin = 3;
	cPOISSON.prototype.argumentsMax = 3;
	cPOISSON.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function poisson(argArray) {
			var _x = parseInt(argArray[0]);
			var _l = argArray[1];
			var f = argArray[2];

			if (_x < 0 || _l < 0) {
				return new cError(cErrorType.not_numeric);
			}

			if (f) {
				var sum = 0;
				for (var k = 0; k <= _x; k++) {
					sum += Math.pow(_l, k) / Math.fact(k);
				}
				sum *= Math.exp(-_l);
				return new cNumber(sum);
			} else {
				return new cNumber(Math.exp(-_l) * Math.pow(_l, _x) / Math.fact(_x));
			}

		}

		return this._findArrayInNumberArguments(oArguments, poisson);
	};

	/**
	 * @constructor
	 * @extends {cPERCENTRANK}
	 */
	function cPOISSON_DIST() {
	}

	cPOISSON_DIST.prototype = Object.create(cPOISSON.prototype);
	cPOISSON_DIST.prototype.constructor = cPOISSON_DIST;
	cPOISSON_DIST.prototype.name = 'POISSON.DIST';
	cPOISSON_DIST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cPROB() {
	}

	cPROB.prototype = Object.create(cBaseFunction.prototype);
	cPROB.prototype.constructor = cPROB;
	cPROB.prototype.name = 'PROB';
	cPROB.prototype.argumentsMin = 3;
	cPROB.prototype.argumentsMax = 4;
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
			return new cError(cErrorType.not_available);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArray) {
			arg1 = arg1.getMatrix();
		} else if (arg1 instanceof cArea3D) {
			arg1 = arg1.getMatrix()[0];
		} else {
			return new cError(cErrorType.not_available);
		}


		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
			arg3 = arg3.cross(arguments[1]);
		} else if (arg3 instanceof cArray) {
			arg3 = arg3.getElement(0);
		}

		arg2 = arg2.tocNumber();
		if (!arg3 instanceof cEmpty) {
			arg3 = arg3.tocNumber();
		}

		if (arg2 instanceof cError) {
			return arg2;
		}
		if (arg3 instanceof cError) {
			return arg3;
		}

		return prob(arg0, arg1, arg2, arg3);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUARTILE() {
	}

	cQUARTILE.prototype = Object.create(cBaseFunction.prototype);
	cQUARTILE.prototype.constructor = cQUARTILE;
	cQUARTILE.prototype.name = 'QUARTILE';
	cQUARTILE.prototype.argumentsMin = 2;
	cQUARTILE.prototype.argumentsMax = 2;
	cQUARTILE.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cQUARTILE.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function quartile(argArray) {

			var A = argArray[0];
			var fFlag = Math.floor(argArray[1]);
			var tA = [];

			for (var i = 0; i < A.length; i++) {
				for (var j = 0; j < A[i].length; j++) {
					if (A[i][j] instanceof cError) {
						return A[i][j];
					} else if (A[i][j] instanceof cNumber || A[i][j] instanceof cEmpty) {
						tA.push(A[i][j].getValue());
					} else if (A[i][j] instanceof cBool) {
						tA.push(A[i][j].tocNumber().getValue());
					}
				}
			}

			var nSize = tA.length;
			if (tA.length < 1 || nSize === 0) {
				return new cError(cErrorType.not_available);
			} else if (fFlag < 0.0 || fFlag > 4.0) {
				return new cError(cErrorType.not_numeric);
			} else if (nSize === 1) {
				return new cNumber(tA[0]);
			}

			return fFlag === 2 ? getMedian(tA) : getPercentile(tA, 0.25 * fFlag);
		}

		return this._findArrayInNumberArguments(oArguments, quartile);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cQUARTILE_EXC() {
	}

	cQUARTILE_EXC.prototype = Object.create(cBaseFunction.prototype);
	cQUARTILE_EXC.prototype.constructor = cQUARTILE_EXC;
	cQUARTILE_EXC.prototype.name = 'QUARTILE.EXC';
	cQUARTILE_EXC.prototype.argumentsMin = 2;
	cQUARTILE_EXC.prototype.argumentsMax = 2;
	cQUARTILE_EXC.prototype.numFormat = AscCommonExcel.cNumFormatNone;
	cQUARTILE_EXC.prototype.isXLFN = true;
	cQUARTILE_EXC.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function quartile(argArray) {

			var A = argArray[0];
			var fFlag = Math.floor(argArray[1]);
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

			var nSize = tA.length;
			if (tA.length < 1 || nSize === 0) {
				return new cError(cErrorType.not_available);
			} else if (fFlag <= 0.0 || fFlag >= 4.0) {
				return new cError(cErrorType.not_numeric);
			} else if (nSize === 1) {
				return new cNumber(tA[0]);
			}

			return fFlag === 2 ? getMedian(tA) : getPercentileExclusive(tA, 0.25 * fFlag);
		}

		return this._findArrayInNumberArguments(oArguments, quartile);
	};

	/**
	 * @constructor
	 * @extends {cQUARTILE}
	 */
	function cQUARTILE_INC() {
	}

	cQUARTILE_INC.prototype = Object.create(cQUARTILE.prototype);
	cQUARTILE_INC.prototype.constructor = cQUARTILE_INC;
	cQUARTILE_INC.prototype.name = 'QUARTILE.INC';
	cQUARTILE_INC.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRANK() {
	}

	cRANK.prototype = Object.create(cBaseFunction.prototype);
	cRANK.prototype.constructor = cRANK;
	cRANK.prototype.name = "RANK";
	cRANK.prototype.argumentsMin = 2;
	cRANK.prototype.argumentsMax = 3;
	cRANK.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true, [null, cElementType.array]);
		var argClone = oArguments.args;

		//1 argument - array
		argClone[0] = argClone[0].tocNumber();
		argClone[2] = undefined !== argClone[2] ? argClone[2].tocNumber() : new cNumber(0);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcRank = function (argArray) {
			var number = argArray[0];
			var ref = argArray[1];
			var order = argArray[2];

			var changedRef = [];
			for (var i = 0; i < ref.length; i++) {
				for (var j = 0; j < ref[i].length; j++) {
					if (ref[i][j] instanceof cError) {
						return ref[i][j];
					} else if (ref[i][j] instanceof cNumber) {
						changedRef.push(ref[i][j].getValue());
					} else if (ref[i][j] instanceof cBool) {
						changedRef.push(ref[i][j].tocNumber().getValue());
					}
				}
			}

			if (!changedRef.length) {
				return new cError(cErrorType.wrong_value_type);
			}

			var res = rank(number, changedRef, order);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcRank);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRANK_AVG() {
	}

	cRANK_AVG.prototype = Object.create(cBaseFunction.prototype);
	cRANK_AVG.prototype.constructor = cRANK_AVG;
	cRANK_AVG.prototype.name = 'RANK.AVG';
	cRANK_AVG.prototype.argumentsMin = 2;
	cRANK_AVG.prototype.argumentsMax = 3;
	cRANK_AVG.prototype.isXLFN = true;
	cRANK_AVG.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true, [null, cElementType.array]);
		var argClone = oArguments.args;

		//1 argument - array
		argClone[0] = argClone[0].tocNumber();
		argClone[2] = undefined !== argClone[2] ? argClone[2].tocNumber() : new cNumber(0);

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcRank = function (argArray) {
			var number = argArray[0];
			var ref = argArray[1];
			var order = argArray[2];

			var changedRef = [];
			for (var i = 0; i < ref.length; i++) {
				for (var j = 0; j < ref[i].length; j++) {
					if (ref[i][j] instanceof cError) {
						return ref[i][j];
					} else if (ref[i][j] instanceof cNumber) {
						changedRef.push(ref[i][j].getValue());
					} else if (ref[i][j] instanceof cBool) {
						changedRef.push(ref[i][j].tocNumber().getValue());
					}
				}
			}

			if (!changedRef.length) {
				return new cError(cErrorType.wrong_value_type);
			}

			var res = rank(number, changedRef, order, true);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcRank);
	};

	/**
	 * @constructor
	 * @extends {cRANK}
	 */
	function cRANK_EQ() {
	}

	cRANK_EQ.prototype = Object.create(cRANK.prototype);
	cRANK_EQ.prototype.constructor = cRANK_EQ;
	cRANK_EQ.prototype.name = 'RANK.EQ';
	cRANK_EQ.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cRSQ() {
	}

	cRSQ.prototype = Object.create(cBaseFunction.prototype);
	cRSQ.prototype.constructor = cRSQ;
	cRSQ.prototype.name = 'RSQ';
	cRSQ.prototype.argumentsMin = 2;
	cRSQ.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return rsq(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSKEW() {
	}

	cSKEW.prototype = Object.create(cBaseFunction.prototype);
	cSKEW.prototype.constructor = cSKEW;
	cSKEW.prototype.name = 'SKEW';
	cSKEW.prototype.argumentsMin = 1;
	cSKEW.prototype.Calculate = function (arg) {

		var arr0 = [];

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return skew(arr0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSKEW_P() {
	}

	cSKEW_P.prototype = Object.create(cBaseFunction.prototype);
	cSKEW_P.prototype.constructor = cSKEW_P;
	cSKEW_P.prototype.name = 'SKEW.P';
	cSKEW_P.prototype.argumentsMin = 1;
	cSKEW_P.prototype.isXLFN = true;
	cSKEW_P.prototype.Calculate = function (arg) {

		var arr0 = [];

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return skew(arr0, true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSLOPE() {
	}

	cSLOPE.prototype = Object.create(cBaseFunction.prototype);
	cSLOPE.prototype.constructor = cSLOPE;
	cSLOPE.prototype.name = 'SLOPE';
	cSLOPE.prototype.argumentsMin = 2;
	cSLOPE.prototype.argumentsMax = 2;
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return slope(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSMALL() {
	}

	cSMALL.prototype = Object.create(cBaseFunction.prototype);
	cSMALL.prototype.constructor = cSMALL;
	cSMALL.prototype.name = 'SMALL';
	cSMALL.prototype.argumentsMin = 2;
	cSMALL.prototype.argumentsMax = 2;
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
			arg0 = arg0.getMatrix(this.excludeHiddenRows, this.excludeErrorsVal, this.excludeNestedStAg);
		} else if (arg0 instanceof cArea3D) {
			arg0 = arg0.getMatrix(this.excludeHiddenRows, this.excludeErrorsVal, this.excludeNestedStAg)[0];
		} else {
			return new cError(cErrorType.not_numeric);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
//        arg1 = arg1.getElement( 0 );
			arg1.foreach(actionArray);
			return retArr;
		}

		return frequency(arg0, arg1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTANDARDIZE() {
	}

	cSTANDARDIZE.prototype = Object.create(cBaseFunction.prototype);
	cSTANDARDIZE.prototype.constructor = cSTANDARDIZE;
	cSTANDARDIZE.prototype.name = 'STANDARDIZE';
	cSTANDARDIZE.prototype.argumentsMin = 3;
	cSTANDARDIZE.prototype.argumentsMax = 3;
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
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElement(0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElement(0);
		}

		if (arg2 instanceof cArea || arg2 instanceof cArea3D) {
			arg2 = arg2.cross(arguments[1]);
		} else if (arg2 instanceof cArray) {
			arg2 = arg2.getElement(0);
		}

		arg0 = arg0.tocNumber();
		arg1 = arg1.tocNumber();
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

		return standardize(arg0.getValue(), arg1.getValue(), arg2.getValue());
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEV() {
	}

	cSTDEV.prototype = Object.create(cBaseFunction.prototype);
	cSTDEV.prototype.constructor = cSTDEV;
	cSTDEV.prototype.name = 'STDEV';
	cSTDEV.prototype.argumentsMin = 1;
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
				var _argAreaValue = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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

		if (1 === count) {
			return new cError(cErrorType.division_by_zero);
		}

		return new cNumber(Math.sqrt(res / (count - 1)));
	};

	/**
	 * @constructor
	 * @extends {cSTDEV}
	 */
	function cSTDEV_S() {
	}

	cSTDEV_S.prototype = Object.create(cSTDEV.prototype);
	cSTDEV_S.prototype.constructor = cSTDEV_S;
	cSTDEV_S.prototype.name = 'STDEV.S';
	cSTDEV_S.prototype.isXLFN = true;


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEVA() {
	}

	cSTDEVA.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVA.prototype.constructor = cSTDEVA;
	cSTDEVA.prototype.name = 'STDEVA';
	cSTDEVA.prototype.argumentsMin = 1;
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
		return new cNumber(Math.sqrt(res / (count - 1)));
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEVP() {
	}

	cSTDEVP.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVP.prototype.constructor = cSTDEVP;
	cSTDEVP.prototype.name = 'STDEVP';
	cSTDEVP.prototype.argumentsMin = 1;
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
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {cSTDEVP}
	 */
	function cSTDEV_P() {
	}

	cSTDEV_P.prototype = Object.create(cSTDEVP.prototype);
	cSTDEV_P.prototype.constructor = cSTDEV_P;
	cSTDEV_P.prototype.name = 'STDEV.P';
	cSTDEV_P.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTDEVPA() {
	}

	cSTDEVPA.prototype = Object.create(cBaseFunction.prototype);
	cSTDEVPA.prototype.constructor = cSTDEVPA;
	cSTDEVPA.prototype.name = 'STDEVPA';
	cSTDEVPA.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cSTEYX() {
	}

	cSTEYX.prototype = Object.create(cBaseFunction.prototype);
	cSTEYX.prototype.constructor = cSTEYX;
	cSTEYX.prototype.name = 'STEYX';
	cSTEYX.prototype.argumentsMin = 2;
	cSTEYX.prototype.argumentsMax = 2;
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
				return new cNumber(
					Math.sqrt((1 / (xLength - 2)) * (sqrYDelta - sumXDeltaYDelta * sumXDeltaYDelta / sqrXDelta)));
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
			return new cError(cErrorType.wrong_value_type);
		}

		if (arg1 instanceof cArea) {
			arr1 = arg1.getValue();
		} else if (arg1 instanceof cArray) {
			arg1.foreach(function (elem) {
				arr1.push(elem);
			});
		} else {
			return new cError(cErrorType.wrong_value_type);
		}

		return steyx(arr0, arr1);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTDIST() {
	}

	cTDIST.prototype = Object.create(cBaseFunction.prototype);
	cTDIST.prototype.constructor = cTDIST;
	cTDIST.prototype.name = 'TDIST';
	cTDIST.prototype.argumentsMin = 3;
	cTDIST.prototype.argumentsMax = 3;
	cTDIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var T = argArray[0];
			var fDF = argArray[1];
			var nType = argArray[2];

			var res = getTDist(T, fDF, nType);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1 || argClone[0].getValue() < 0 ||
			(argClone[2].getValue() !== 1 && argClone[2].getValue() !== 2)) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST() {
	}

	cT_DIST.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST.prototype.constructor = cT_DIST;
	cT_DIST.prototype.name = 'T.DIST';
	cT_DIST.prototype.argumentsMin = 3;
	cT_DIST.prototype.argumentsMax = 3;
	cT_DIST.prototype.isXLFN = true;
	cT_DIST.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var T = argArray[0];
			var fDF = argArray[1];
			var bCumulative = argArray[2];

			var res = getTDist(T, fDF, bCumulative ? 4 : 3);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		if (argClone[1].getValue() < 1) {
			return new cError(cErrorType.not_numeric);
		}

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST_2T() {
	}

	cT_DIST_2T.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST_2T.prototype.constructor = cT_DIST_2T;
	cT_DIST_2T.prototype.name = 'T.DIST.2T';
	cT_DIST_2T.prototype.argumentsMin = 2;
	cT_DIST_2T.prototype.argumentsMax = 2;
	cT_DIST_2T.prototype.isXLFN = true;
	cT_DIST_2T.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var T = argArray[0];
			var fDF = argArray[1];

			if (fDF < 1 || T < 0) {
				return new cError(cErrorType.not_numeric);
			}

			var res = getTDist(T, fDF, 2);
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_DIST_RT() {
	}

	cT_DIST_RT.prototype = Object.create(cBaseFunction.prototype);
	cT_DIST_RT.prototype.constructor = cT_DIST_RT;
	cT_DIST_RT.prototype.name = 'T.DIST.RT';
	cT_DIST_RT.prototype.argumentsMin = 2;
	cT_DIST_RT.prototype.argumentsMax = 2;
	cT_DIST_RT.prototype.isXLFN = true;
	cT_DIST_RT.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var T = argArray[0];
			var fDF = argArray[1];

			if (fDF < 1) {
				return new cError(cErrorType.not_numeric);
			}

			var res = getTDist(T, fDF, 1);
			if (T < 0) {
				res = 1 - res;
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_INV() {
	}

	cT_INV.prototype = Object.create(cBaseFunction.prototype);
	cT_INV.prototype.constructor = cT_INV;
	cT_INV.prototype.name = 'T.INV';
	cT_INV.prototype.argumentsMin = 2;
	cT_INV.prototype.argumentsMax = 2;
	cT_INV.prototype.isXLFN = true;
	cT_INV.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fP = argArray[0];
			var fDF = parseInt(argArray[1]);

			if (fDF < 1.0 || fP <= 0.0 || fP > 1.0) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc, oVal, bConvError, res = null;
			if (fP === 1.0) {
				return new cError(cErrorType.not_numeric);
			} else if (fP < 0.5) {
				aFunc = new TDISTFUNCTION(1 - fP, fDF, 4);
				oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
				bConvError = oVal.bError;
				res = -oVal.val;
			} else {
				aFunc = new TDISTFUNCTION(fP, fDF, 4);
				oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
				bConvError = oVal.bError;
				res = oVal.val;
			}

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cT_INV_2T() {
	}

	cT_INV_2T.prototype = Object.create(cBaseFunction.prototype);
	cT_INV_2T.prototype.constructor = cT_INV_2T;
	cT_INV_2T.prototype.name = 'T.INV.2T';
	cT_INV_2T.prototype.argumentsMin = 2;
	cT_INV_2T.prototype.argumentsMax = 2;
	cT_INV_2T.prototype.isXLFN = true;
	cT_INV_2T.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTDist = function (argArray) {
			var fP = argArray[0];
			var fDF = parseInt(argArray[1]);

			//ms игнорирует услвие fP > 1. сделал как в документации
			if (fDF < 1.0 || fP <= 0 || fP > 1) {
				return new cError(cErrorType.not_numeric);
			}

			var aFunc = new TDISTFUNCTION(fP, fDF, 2);
			var oVal = iterateInverse(aFunc, fDF * 0.5, fDF);
			var bConvError = oVal.bError;
			var res = oVal.val;

			if (bConvError) {
				return new cError(cErrorType.not_numeric);
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this._findArrayInNumberArguments(oArguments, calcTDist);
	};

	/**
	 * @constructor
	 * @extends {cT_INV_2T}
	 */
	function cTINV() {
	}

	cTINV.prototype = Object.create(cT_INV_2T.prototype);
	cTINV.prototype.constructor = cTINV;
	cTINV.prototype.name = 'TINV';

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTREND() {
	}

	cTREND.prototype = Object.create(cBaseFunction.prototype);
	cTREND.prototype.constructor = cTREND;
	cTREND.prototype.name = 'TREND';
	cTREND.prototype.argumentsMin = 1;
	cTREND.prototype.argumentsMax = 4;
	cTREND.prototype.Calculate = function (arg) {

		var prepeareArgs = prepeareGrowthTrendCalculation(this, arg);
		if (cElementType.error === prepeareArgs.type) {
			return prepeareArgs;
		}
		var pMatY = prepeareArgs.pMatY;
		var pMatX = prepeareArgs.pMatX;
		var pMatNewX = prepeareArgs.pMatNewX;
		var bConstant = prepeareArgs.bConstant;
		var res = CalculateTrendGrowth(pMatY, pMatX, pMatNewX, bConstant);

		if (res && res[0] && res[0][0]) {
			return new cNumber(res[0][0]);
		} else {
			return new cError(cErrorType.wrong_value_type);
		}
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTRIMMEAN() {
	}

	cTRIMMEAN.prototype = Object.create(cBaseFunction.prototype);
	cTRIMMEAN.prototype.constructor = cTRIMMEAN;
	cTRIMMEAN.prototype.name = 'TRIMMEAN';
	cTRIMMEAN.prototype.argumentsMin = 2;
	cTRIMMEAN.prototype.argumentsMax = 2;
	cTRIMMEAN.prototype.Calculate = function (arg) {

		var arg2 = [arg[0], arg[1]];
		//если первое значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTrimMean = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];

			if (arg1 < 0.0 || arg1 >= 1.0) {
				return new cError(cErrorType.not_numeric);
			}

			var arr = [];
			for (var i = 0; i < arg0.length; i++) {
				for (var j = 0; j < arg0[i].length; j++) {
					if (cElementType.number === arg0[i][j].type) {
						arr.push(arg0[i][j].getValue());
					}
				}
			}

			var aSortArray = arr.sort(fSortAscending);
			var nSize = aSortArray.length;
			if (nSize == 0) {
				return new cError(cErrorType.not_numeric);
			} else {

				var nIndex = Math.floor(arg1 * nSize);
				if (nIndex % 2 !== 0) {
					nIndex--;
				}
				nIndex /= 2;

				var fSum = 0.0;
				for (var i = nIndex; i < nSize - nIndex; i++) {
					fSum += aSortArray[i];
				}

				return new cNumber(fSum / (nSize - 2 * nIndex));
			}
		};

		return this._findArrayInNumberArguments(oArguments, calcTrimMean);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cTTEST() {
	}

	cTTEST.prototype = Object.create(cBaseFunction.prototype);
	cTTEST.prototype.constructor = cTTEST;
	cTTEST.prototype.name = 'TTEST';
	cTTEST.prototype.argumentsMin = 4;
	cTTEST.prototype.argumentsMax = 4;
	cTTEST.prototype.Calculate = function (arg) {

		var arg2 = [arg[0], arg[1], arg[2], arg[3]];
		//если первое или второе значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		if (cElementType.string === arg[1].type || cElementType.bool === arg[1].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое или второе значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}
		if (cElementType.number === arg[1].type) {
			arg2[1] = new cArray();
			arg2[1].addElement(arg[1]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array, cElementType.array]);
		var argClone = oArguments.args;

		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();//bool

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcTTest = function (argArray) {
			var arg0 = argArray[0];
			var arg1 = argArray[1];
			var arg2 = parseInt(argArray[2]);
			var arg3 = parseInt(argArray[3]);

			if (!(arg2 === 1 || arg2 === 2)) {
				return new cError(cErrorType.not_numeric);
			}

			return tTest(arg0, arg1, arg2, arg3);
		};

		return this._findArrayInNumberArguments(oArguments, calcTTest);
	};

	/**
	 * @constructor
	 * @extends {cTTEST}
	 */
	function cT_TEST() {
	}

	cT_TEST.prototype = Object.create(cTTEST.prototype);
	cT_TEST.prototype.constructor = cT_TEST;
	cT_TEST.prototype.name = 'T.TEST';
	cT_TEST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVAR() {
	}

	cVAR.prototype = Object.create(cBaseFunction.prototype);
	cVAR.prototype.constructor = cVAR;
	cVAR.prototype.name = 'VAR';
	cVAR.prototype.argumentsMin = 1;
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
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVARA() {
	}

	cVARA.prototype = Object.create(cBaseFunction.prototype);
	cVARA.prototype.constructor = cVARA;
	cVARA.prototype.name = 'VARA';
	cVARA.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVARP() {
	}

	cVARP.prototype = Object.create(cBaseFunction.prototype);
	cVARP.prototype.constructor = cVARP;
	cVARP.prototype.name = 'VARP';
	cVARP.prototype.argumentsMin = 1;
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
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {cVARP}
	 */
	function cVAR_P() {
	}

	cVAR_P.prototype = Object.create(cVARP.prototype);
	cVAR_P.prototype.constructor = cVAR_P;
	cVAR_P.prototype.name = 'VAR.P';
	cVAR_P.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVAR_S() {
	}

	cVAR_S.prototype = Object.create(cBaseFunction.prototype);
	cVAR_S.prototype.constructor = cVAR_S;
	cVAR_S.prototype.name = 'VAR.S';
	cVAR_S.prototype.argumentsMin = 1;
	cVAR_S.prototype.isXLFN = true;
	cVAR_S.prototype.Calculate = function (arg) {
		function _var(x) {
			if (x.length <= 1) {
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

			return new cNumber(sumSQRDeltaX / (xLength - 1));
		}

		var element, arr0 = [];

		for (var j = 0; j < arg.length; j++) {
			element = arg[j];
			if (cElementType.cellsRange === element.type || cElementType.cellsRange3D === element.type) {
				var _arrVal = element.getValue(this.checkExclude, this.excludeHiddenRows, this.excludeErrorsVal,
					this.excludeNestedStAg);
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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVARdotP() {
	}

	cVARdotP.prototype = Object.create(cBaseFunction.prototype);
	cVARdotP.prototype.constructor = cVARdotP;
	cVARdotP.prototype.name = 'VAR.P';
	cVARdotP.prototype.argumentsMin = 1;
	cVARdotP.prototype.Calculate = cVARP.prototype.Calculate;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cVARPA() {
	}

	cVARPA.prototype = Object.create(cBaseFunction.prototype);
	cVARPA.prototype.constructor = cVARPA;
	cVARPA.prototype.name = 'VARPA';
	cVARPA.prototype.argumentsMin = 1;
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

		for (var j = 0; j < arg.length; j++) {

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
				return new cError(cErrorType.wrong_value_type);
			}

		}
		return _var(arr0);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cWEIBULL() {
	}

	cWEIBULL.prototype = Object.create(cBaseFunction.prototype);
	cWEIBULL.prototype.constructor = cWEIBULL;
	cWEIBULL.prototype.name = 'WEIBULL';
	cWEIBULL.prototype.argumentsMin = 4;
	cWEIBULL.prototype.argumentsMax = 4;
	cWEIBULL.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2].tocNumber();
		argClone[3] = argClone[3].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		var calcWeibull = function (argArray) {
			var x = argArray[0];
			var alpha = argArray[1];
			var beta = argArray[2];
			var kum = argArray[3];

			var res;
			if (alpha <= 0 || beta <= 0 || x < 0) {
				return new cError(cErrorType.not_numeric);
			} else if (kum === 0) {
				res = alpha / Math.pow(beta, alpha) * Math.pow(x, alpha - 1.0) * Math.exp(-Math.pow(x / beta, alpha));
			} else {
				res = 1.0 - Math.exp(-Math.pow(x / beta, alpha));
			}

			return new cNumber(res);
		};

		return this._findArrayInNumberArguments(oArguments, calcWeibull);
	};

	/**
	 * @constructor
	 * @extends {cRANK}
	 */
	function cWEIBULL_DIST() {
	}

	cWEIBULL_DIST.prototype = Object.create(cWEIBULL.prototype);
	cWEIBULL_DIST.prototype.constructor = cWEIBULL_DIST;
	cWEIBULL_DIST.prototype.name = 'WEIBULL.DIST';
	cWEIBULL_DIST.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cZTEST() {
	}

	cZTEST.prototype = Object.create(cBaseFunction.prototype);
	cZTEST.prototype.constructor = cZTEST;
	cZTEST.prototype.name = 'ZTEST';
	cZTEST.prototype.argumentsMin = 2;
	cZTEST.prototype.argumentsMax = 3;
	cZTEST.prototype.Calculate = function (arg) {

		var arg2 = arg[2] ? [arg[0], arg[1], arg[2]] : [arg[0], arg[1]];
		//если первое или второе значение строка
		if (cElementType.string === arg[0].type || cElementType.bool === arg[0].type) {
			return new cError(cErrorType.wrong_value_type);
		}
		//если первое или второе значение число
		if (cElementType.number === arg[0].type) {
			arg2[0] = new cArray();
			arg2[0].addElement(arg[0]);
		}

		var oArguments = this._prepareArguments(arg2, arguments[1], true, [cElementType.array]);
		var argClone = oArguments.args;

		argClone[1] = argClone[1].tocNumber();
		argClone[2] = argClone[2] ? argClone[2].tocNumber() : new AscCommonExcel.cUndefined();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return argError;
		}

		function calcZTest(argArray) {

			var arg0 = argArray[0];
			var x = argArray[1];
			var sigma = argArray[2];

			if (sigma !== undefined && sigma <= 0) {
				return new cError(cErrorType.not_numeric);
			}

			var nC1 = arg0.length;
			var nR1 = arg0[0].length;

			var fSum = 0.0;
			var fSumSqr = 0.0;
			var fVal;
			var rValCount = 0.0;
			for (var i = 0; i < nC1; i++) {
				for (var j = 0; j < nR1; j++) {
					if (cElementType.number !== arg0[i][j].type || cElementType.number !== arg0[i][j].type) {
						continue;
					}

					fVal = arg0[i][j].getValue();
					fSum += fVal;
					fSumSqr += fVal * fVal;
					rValCount++;
				}
			}

			var res;
			if (rValCount <= 1.0) {
				return new cError(cErrorType.division_by_zero);
			} else {
				var mue = fSum / rValCount;

				if (undefined === sigma) {
					sigma = (fSumSqr - fSum * fSum / rValCount) / (rValCount - 1.0);
					res = 0.5 - gauss((mue - x) / Math.sqrt(sigma / rValCount));
				} else {
					res = 0.5 - gauss((mue - x) * Math.sqrt(rValCount) / sigma);
				}
			}

			return new cNumber(res);
		}

		return this._findArrayInNumberArguments(oArguments, calcZTest);
	};

	/**
	 * @constructor
	 * @extends {cZTEST}
	 */
	function cZ_TEST() {
	}

	cZ_TEST.prototype = Object.create(cZTEST.prototype);
	cZ_TEST.prototype.constructor = cZ_TEST;
	cZ_TEST.prototype.name = 'Z.TEST';
	cZ_TEST.prototype.isXLFN = true;

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
	window['AscCommonExcel'].cLARGE = cLARGE;
	window['AscCommonExcel'].cSMALL = cSMALL;
	window['AscCommonExcel'].cMEDIAN = cMEDIAN;
	window['AscCommonExcel'].cSTDEV_S = cSTDEV_S;
	window['AscCommonExcel'].cSTDEV_P = cSTDEV_P;
	window['AscCommonExcel'].cVAR_S = cVAR_S;
	window['AscCommonExcel'].cVAR_P = cVAR_P;
	window['AscCommonExcel'].cMODE_SNGL = cMODE_SNGL;
	window['AscCommonExcel'].cPERCENTILE_INC = cPERCENTILE_INC;
	window['AscCommonExcel'].cQUARTILE_INC = cQUARTILE_INC;
	window['AscCommonExcel'].cPERCENTILE_EXC = cPERCENTILE_EXC;
	window['AscCommonExcel'].cQUARTILE_EXC = cQUARTILE_EXC;

})(window);
