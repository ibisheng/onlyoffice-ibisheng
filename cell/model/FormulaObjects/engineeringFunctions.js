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
	var cErrorType = AscCommonExcel.cErrorType;
	var cNumber = AscCommonExcel.cNumber;
	var cString = AscCommonExcel.cString;
	var cError = AscCommonExcel.cError;
	var cArea = AscCommonExcel.cArea;
	var cArea3D = AscCommonExcel.cArea3D;
	var cArray = AscCommonExcel.cArray;
	var cUndefined = AscCommonExcel.cUndefined;
	var cBaseFunction = AscCommonExcel.cBaseFunction;
	var cFormulaFunctionGroup = AscCommonExcel.cFormulaFunctionGroup;

	var rtl_math_erf = AscCommonExcel.rtl_math_erf;

	var rg_validBINNumber = /^[01]{1,10}$/, rg_validDEC2BINNumber = /^-?[0-9]{1,3}$/, rg_validDEC2OCTNumber = /^-?[0-9]{1,9}$/, rg_validDEC2HEXNumber = /^-?[0-9]{1,12}$/, rg_validHEXNumber = /^[0-9A-F]{1,10}$/i, rg_validOCTNumber = /^[0-7]{1,10}$/, rg_complex_number = new XRegExp("^(?<real>[-+]?(?:\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?))?(?<img>([-+]?(\\d*(?:\\.\\d+)?(?:[Ee][+-]?\\d+)?)?[ij])?)", "g");

	var NumberBase = {
		BIN: 2, OCT: 8, DEC: 10, HEX: 16
	};

	var f_PI_DIV_2 = Math.PI / 2;
	var f_PI_DIV_4 = Math.PI / 4;
	var f_2_DIV_PI = 2 / Math.PI;

	function BesselJ(x, N) {
		if (N < 0) {
			return new cError(cErrorType.not_numeric);
		}
		if (x === 0.0) {
			return new cNumber((N == 0) ? 1 : 0);
		}

		/*  The algorithm works only for x>0, therefore remember sign. BesselJ
		 with integer order N is an even function for even N (means J(-x)=J(x))
		 and an odd function for odd N (means J(-x)=-J(x)).*/
		var fSign = (N % 2 == 1 && x < 0) ? -1 : 1;
		var fX = Math.abs(x);

		var fMaxIteration = 9000000; //experimental, for to return in < 3 seconds
		var fEstimateIteration = fX * 1.5 + N;
		var bAsymptoticPossible = Math.pow(fX, 0.4) > N;
		if (fEstimateIteration > fMaxIteration) {
			if (bAsymptoticPossible) {
				return new cNumber(fSign * Math.sqrt(f_2_DIV_PI / fX) * Math.cos(fX - N * f_PI_DIV_2 - f_PI_DIV_4));
			} else {
				return new cError(cErrorType.not_numeric);
			}
		}

		var epsilon = 1.0e-15; // relative error
		var bHasfound = false, k = 0, u;

		// first used with k=1
		var m_bar, g_bar, g_bar_delta_u, g = 0, delta_u = 0, f_bar = -1;  // f_bar_k = 1/f_k, but only used for k=0

		if (N == 0) {
			u = 1;
			g_bar_delta_u = 0;
			g_bar = -2 / fX;
			delta_u = g_bar_delta_u / g_bar;
			u = u + delta_u;
			g = -1 / g_bar;
			f_bar = f_bar * g;
			k = 2;
		} else {
			u = 0;
			for (k = 1; k <= N - 1; k = k + 1) {
				m_bar = 2 * Math.fmod(k - 1, 2) * f_bar;
				g_bar_delta_u = -g * delta_u - m_bar * u; // alpha_k = 0.0
				g_bar = m_bar - 2 * k / fX + g;
				delta_u = g_bar_delta_u / g_bar;
				u = u + delta_u;
				g = -1 / g_bar;
				f_bar = f_bar * g;
			}
			// Step alpha_N = 1.0
			m_bar = 2 * Math.fmod(k - 1, 2) * f_bar;
			g_bar_delta_u = f_bar - g * delta_u - m_bar * u; // alpha_k = 1.0
			g_bar = m_bar - 2 * k / fX + g;
			delta_u = g_bar_delta_u / g_bar;
			u = u + delta_u;
			g = -1 / g_bar;
			f_bar = f_bar * g;
			k = k + 1;
		}
		// Loop until desired accuracy, always alpha_k = 0.0
		do {
			m_bar = 2 * Math.fmod(k - 1, 2) * f_bar;
			g_bar_delta_u = -g * delta_u - m_bar * u;
			g_bar = m_bar - 2 * k / fX + g;
			delta_u = g_bar_delta_u / g_bar;
			u = u + delta_u;
			g = -1 / g_bar;
			f_bar = f_bar * g;
			bHasfound = (Math.abs(delta_u) <= Math.abs(u) * epsilon);
			k = k + 1;
		} while (!bHasfound && k <= fMaxIteration);
		if (bHasfound) {
			return new cNumber(u * fSign);
		} else {
			return new cError(cErrorType.not_numeric);
		}// unlikely to happen
	}

	function BesselI(x, n) {
		var nMaxIteration = 20000, fXHalf = x / 2, fResult = 0, fEpsilon = 1.0E-30;
		if (n < 0) {
			return new cError(cErrorType.not_numeric);
		}

		/*  Start the iteration without TERM(n,0), which is set here.

		 TERM(n,0) = (x/2)^n / n!
		 */
		var nK = 0, fTerm = 1;
		// avoid overflow in Fak(n)
		/*for ( nK = 1; nK <= n; ++nK ) {
		 fTerm = fTerm / nK * fXHalf;
		 }*/

		fTerm = Math.pow(fXHalf, n) / Math.fact(n);

		fResult = fTerm;    // Start result with TERM(n,0).
		if (fTerm !== 0) {
			nK = 1;
			do {
				fTerm = Math.pow(fXHalf, n + 2 * nK) / ( Math.fact(nK) * Math.fact(n + nK) );

				/*  Calculation of TERM(n,k) from TERM(n,k-1):

				 (x/2)^(n+2k)
				 TERM(n,k)  =  --------------
				 k! (n+k)!

				 (x/2)^2 (x/2)^(n+2(k-1))
				 =  --------------------------
				 k (k-1)! (n+k) (n+k-1)!

				 (x/2)^2     (x/2)^(n+2(k-1))
				 =  --------- * ------------------
				 k(n+k)      (k-1)! (n+k-1)!

				 x^2/4
				 =  -------- TERM(n,k-1)
				 k(n+k)
				 */
//            fTerm = fTerm * fXHalf / nK * fXHalf / (nK + n);
				fResult = fResult + fTerm;
				nK++;
			} while ((Math.abs(fTerm) > Math.abs(fResult) * fEpsilon) && (nK < nMaxIteration));

		}
		return new cNumber(fResult);
	}

	function Besselk0(fNum) {
		var fRet, y;

		if (fNum <= 2) {

			y = fNum * fNum / 4.0;
			fRet=(-Math.log(fNum / 2.0) * BesselI(fNum, 0)) + (-0.57721566 + y * (0.42278420
				+y * (0.23069756 + y * (0.3488590e-1 + y * (0.262698e-2
				+y * (0.10750e-3 + y * 0.74e-5))))));

		} else {
			y = 2 / fNum;
			fRet = Math.exp(-fNum) / Math.sqrt(fNum) * ( 1.25331414 + y * ( -0.7832358e-1 + y * ( 0.2189568e-1 +
				y * ( -0.1062446e-1 + y * ( 0.587872e-2 + y * ( -0.251540e-2 + y * 0.53208e-3 ) ) ) ) ) );
		}

		return new cNumber(fRet);
	}

	function Besselk1(fNum) {
		var fRet, y;

		if (fNum <= 2) {
			y = fNum * fNum / 4.0;
			fRet=(Math.log(fNum / 2.0) * BesselI(fNum, 1))+(1.0 / fNum)*(1.0 + y * (0.15443144
				+ y * (-0.67278579 + y * (-0.18156897 + y * (-0.1919402e-1
				+ y * (-0.110404e-2 + y * (-0.4686e-4)))))));
		} else {
			y = 2 / fNum;
			fRet = Math.exp(-fNum) / Math.sqrt(fNum) * ( 1.25331414 + y * ( 0.23498619 + y * ( -0.3655620e-1 +
				y * ( 0.1504268e-1 + y * ( -0.780353e-2 + y * ( 0.325614e-2 + y * ( -0.68245e-3 ) ) ) ) ) ) );
		}

		return new cNumber(fRet);
	}

	function bessi0(x){
		var ax = Math.abs(x), fRet, y;

		if (ax < 3.75) {
			y = x / 3.75;
			y *= y;
			fRet = 1.0 + y*(3.5156229 + y*(3.0899424 + y*(1.2067492 + y*(0.2659732 + y*(0.360768e-1 + y*0.45813e-2)))));
		} else {
			y = 3.75 / ax;
			fRet = (Math.exp(ax) / Math.sqrt(ax))*(0.39894228 + y*(0.1328592e-1
				+ y*(0.225319e-2 + y*(-0.157565e-2 + y*(0.916281e-2
				+ y*(-0.2057706e-1 + y*(0.2635537e-1 + y*(-0.1647633e-1
				+ y*0.392377e-2))))))));
		}
		return fRet;
	}

	function bessi(x, n){
		var max = 1.0e10;
		var min = 1.0e-10;
		var ACC  = 40.0;

		var bi, bim, bip, tox, res;
		if (x === 0.0){
			return new cNumber(0.0);
		} else {
			tox = 2.0 / Math.abs(x);
			bip = res = 0.0;
			bi = 1.0;
			for (var j = 2 * (n + parseInt(Math.sqrt(ACC * n))); j>0; j--) {
				bim = bip + j * tox * bi;
				bip = bi;
				bi = bim;
				if (Math.abs(bi) > max) {
					res *= min;
					bi *= min;
					bip *= min;
				}
				if (j === n){
					res = bip;
				}
			}
			res *= bessi0(x) / bi;
			return x < 0.0 && (n & 1) ? new cNumber(-res) : new cNumber(res);
		}
	}

	function BesselK(fNum, nOrder) {
		switch (nOrder) {
			case 0:
				return Besselk0(fNum);
			case 1:
				return Besselk1(fNum);
			default: {
				var fBkp;

				var fTox = 2 / fNum, fBkm = Besselk0(fNum), fBk = Besselk1(fNum);

				if (fBkm instanceof cError) {
					return fBkm;
				}
				if (fBk instanceof cError) {
					return fBk;
				}

				fBkm = fBkm.getValue();
				fBk = fBk.getValue();

				for (var n = 1; n < nOrder; n++) {
					fBkp = fBkm + n * fTox * fBk;
					fBkm = fBk;
					fBk = fBkp;
				}

				return new cNumber(fBk);
			}
		}
	}

	// See #i31656# for a commented version of this implementation, attachment #desc6
	// http://www.openoffice.org/nonav/issues/showattachment.cgi/63609/Comments%20to%20the%20implementation%20of%20the%20Bessel%20functions.odt
	function Bessely0(fX) {
		if (fX <= 0) {
			return new cError(cErrorType.not_numeric);
		}
		var fMaxIteration = 9000000; // should not be reached
		if (fX > 5.0e+6) { // iteration is not considerable better then approximation
			return new cNumber(Math.sqrt(1 / Math.PI / fX) * (Math.sin(fX) - Math.cos(fX)));
		}
		var epsilon = 1.0e-15, EulerGamma = 0.57721566490153286060;
		var alpha = Math.log10(fX / 2) + EulerGamma;
		var u = alpha;

		var k = 1, m_bar = 0, g_bar_delta_u = 0, g_bar = -2 / fX;
		var delta_u = g_bar_delta_u / g_bar, g = -1 / g_bar, f_bar = -1 * g, sign_alpha = 1, km1mod2, bHasFound = false;
		k = k + 1;
		do {
			km1mod2 = Math.fmod(k - 1, 2);
			m_bar = (2 * km1mod2) * f_bar;
			if (km1mod2 == 0) {
				alpha = 0;
			} else {
				alpha = sign_alpha * (4 / k);
				sign_alpha = -sign_alpha;
			}
			g_bar_delta_u = f_bar * alpha - g * delta_u - m_bar * u;
			g_bar = m_bar - (2 * k) / fX + g;
			delta_u = g_bar_delta_u / g_bar;
			u = u + delta_u;
			g = -1 / g_bar;
			f_bar = f_bar * g;
			bHasFound = (Math.abs(delta_u) <= Math.abs(u) * epsilon);
			k = k + 1;
		} while (!bHasFound && k < fMaxIteration);
		if (bHasFound) {
			return new cNumber(u * f_2_DIV_PI);
		} else {
			return new cError(cErrorType.not_numeric);
		}
	}

	// See #i31656# for a commented version of this implementation, attachment #desc6
	// http://www.openoffice.org/nonav/issues/showattachment.cgi/63609/Comments%20to%20the%20implementation%20of%20the%20Bessel%20functions.odt
	function Bessely1(fX) {
		if (fX <= 0) {
			return new cError(cErrorType.not_numeric);
		}
		var fMaxIteration = 9000000; // should not be reached
		if (fX > 5e+6) { // iteration is not considerable better then approximation
			return new cNumber(-Math.sqrt(1 / Math.PI / fX) * (Math.sin(fX) + Math.cos(fX)));
		}
		var epsilon = 1.0e-15, EulerGamma = 0.57721566490153286060, alpha = 1 /
			fX, f_bar = -1, u = alpha, k = 1, m_bar = 0;
		alpha = 1 - EulerGamma - Math.log10(fX / 2);
		var g_bar_delta_u = -alpha, g_bar = -2 / fX, delta_u = g_bar_delta_u / g_bar;
		u = u + delta_u;
		var g = -1 / g_bar;
		f_bar = f_bar * g;
		var sign_alpha = -1, km1mod2, //will be (k-1) mod 2
			q, // will be (k-1) div 2
			bHasFound = false;
		k = k + 1;
		do {
			km1mod2 = Math.fmod(k - 1, 2);
			m_bar = (2 * km1mod2) * f_bar;
			q = (k - 1) / 2;
			if (km1mod2 == 0) { // k is odd
				alpha = sign_alpha * (1 / q + 1 / (q + 1));
				sign_alpha = -sign_alpha;
			} else {
				alpha = 0;
			}
			g_bar_delta_u = f_bar * alpha - g * delta_u - m_bar * u;
			g_bar = m_bar - (2 * k) / fX + g;
			delta_u = g_bar_delta_u / g_bar;
			u = u + delta_u;
			g = -1 / g_bar;
			f_bar = f_bar * g;
			bHasFound = (Math.abs(delta_u) <= Math.abs(u) * epsilon);
			k = k + 1;
		} while (!bHasFound && k < fMaxIteration);
		if (bHasFound) {
			return new cNumber(-u * 2 / Math.PI);
		} else {
			return new cError(cErrorType.not_numeric);
		}
	}

	function _Bessely0(fNum) {

		if (fNum < 8.0) {
			var y = (fNum * fNum);
			var f1 = -2957821389.0 + y * (7062834065.0 + y * (-512359803.6 + y * (10879881.29 + y * (-86327.92757 + y * 228.4622733))));
			var f2 = 40076544269.0 + y * (745249964.8 + y * (7189466.438 + y * (47447.26470 + y * (226.1030244 + y))));
			var fRet = f1 / f2 + 0.636619772 * BesselJ(fNum, 0) * Math.log(fNum);
		}
		else {
			var z = 8.0 / fNum;
			var y = (z * z);
			var xx = fNum - 0.785398164;
			var f1 = 1 + y * (-0.1098628627e-2 + y * (0.2734510407e-4 + y * (-0.2073370639e-5 + y * 0.2093887211e-6)));
			var f2 = -0.1562499995e-1 + y * (0.1430488765e-3 + y * (-0.6911147651e-5 + y * (0.7621095161e-6 + y * (-0.934945152e-7))));
			var fRet = Math.sqrt(0.636619772 / fNum) * (Math.sin(xx) * f1 + z * Math.cos(xx) * f2);
		}

		return new cNumber(fRet);
	}


	function _Bessely1(fNum) {
		var z, xx , y, fRet, ans1, ans2;
		if (fNum < 8.0) {
			y = fNum * fNum;
			ans1 = fNum *(-0.4900604943e13 + y * (0.1275274390e13 + y * (-0.5153438139e11 + y * (0.7349264551e9 + y * (-0.4237922726e7 + y * 0.8511937935e4)))));
			ans2 = 0.2499580570e14 + y * (0.4244419664e12 + y * (0.3733650367e10 + y * (0.2245904002e8 + y * (0.1020426050e6 + y * (0.3549632885e3 + y)))));
			fRet=(ans1 / ans2) + 0.636619772 * (BesselJ(fNum) * Math.log(fNum) - 1.0 / fNum);
		} else {
			z = 8.0 / fNum;
			y = z * z;
			xx = fNum - 2.356194491;
			ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * (-0.240337019e-6))));
			ans2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
			fRet = Math.sqrt(0.636619772 / fNum) * (Math.sin(xx) * ans1 + z * Math.cos(xx) * ans2);
		}

		return new cNumber(fRet);
	}

	function BesselY(fNum, nOrder) {
		switch (nOrder) {
			case 0:
				return _Bessely0(fNum);
			case 1:
				return _Bessely1(fNum);
			default: {
				var fByp, fTox = 2 / fNum, fBym = _Bessely0(fNum), fBy = _Bessely1(fNum);

				if (fBym instanceof cError) {
					return fBym;
				}
				if (fBy instanceof cError) {
					return fBy;
				}

				fBym = fBym.getValue();
				fBy = fBy.getValue();

				for (var n = 1; n < nOrder; n++) {
					fByp = n * fTox * fBy - fBym;
					fBym = fBy;
					fBy = fByp;
				}

				return new cNumber(fBy);
			}
		}
	}

	function validBINNumber(n) {
		return rg_validBINNumber.test(n);
	}

	function validDEC2BINNumber(n) {
		return rg_validDEC2BINNumber.test(n);
	}

	function validDEC2OCTNumber(n) {
		return rg_validDEC2OCTNumber.test(n);
	}

	function validDEC2HEXNumber(n) {
		return rg_validDEC2HEXNumber.test(n);
	}

	function validHEXNumber(n) {
		return rg_validHEXNumber.test(n);
	}

	function validOCTNumber(n) {
		return rg_validOCTNumber.test(n);
	}

	function convertFromTo(src, from, to, charLim) {
		var res = parseInt(src, from).toString(to);
		if (charLim == undefined) {
			return new cString(res.toUpperCase());
		} else {
			charLim = parseInt(charLim);
			if (charLim >= res.length) {
				return new cString(( '0'.repeat(charLim - res.length) + res).toUpperCase());
			} else {
				return new cError(cErrorType.not_numeric);
			}
		}
	}

	function Complex(r, i, suffix) {
		if (arguments.length == 1) {
			return this.ParseString(arguments[0]);
		} else {
			this.real = r;
			this.img = i;
			this.suffix = suffix ? suffix : "i";
			return this;
		}
	}

	Complex.prototype = {

		constructor: Complex, toString: function () {
			var res = [];
			var hasImag = this.img != 0, hasReal = !hasImag || (this.real != 0);

			if (hasReal) {

				res.push(this.real);
			}
			if (hasImag) {
				if (this.img == 1) {
					if (hasReal) {
						res.push('+');
					}
				} else if (this.img == -1) {
					res.push("-");
				} else {
					this.img > 0 && hasReal ? res.push("+" + this.img) : res.push(this.img);
				}
				res.push(this.suffix ? this.suffix : "i");
			}
			return res.join("");
		}, Real: function () {
			return this.real;
		}, Imag: function () {
			return this.img;
		}, Abs: function () {
			return Math.sqrt(this.real * this.real + this.img * this.img);
		}, Arg: function () {
			if (this.real == 0.0 && this.img == 0.0) {
				return new cError(cErrorType.division_by_zero);
			}

			var phi = Math.acos(this.real / this.Abs());

			if (this.img < 0.0) {
				phi = -phi;
			}

			return phi;
		}, Conj: function () {
			var c = new Complex(this.real, -this.img, this.suffix);
			return c.toString();
		}, Cos: function () {
			if (this.img) {
				var a = Math.cos(this.real) * Math.cosh(this.img);
				this.img = -( Math.sin(this.real) * Math.sinh(this.img) );
				this.real = a;
			} else {
				this.real = Math.cos(this.real);
			}
		}, Tan: function () {
			if (this.img) {
				var a = Math.sin(2 * this.real) / (Math.cos(2 * this.real) + Math.cosh(2 * this.img));
				this.img = Math.sinh(2 * this.img) / (Math.cos(2 * this.real) + Math.cosh(2 * this.img));
				this.real = a;
			} else {
				this.real = Math.tan(this.real);
			}
		}, Cot: function () {
			if (this.img) {
				var a = Math.sin(2 * this.real) / (Math.cosh(2 * this.img) - Math.cos(2 * this.real));
				this.img = -(Math.sinh(2 * this.img) / (Math.cosh(2 * this.img) - Math.cos(2 * this.real)));
				this.real = a;
			} else {
				this.real = 1 / Math.tan(this.real);
			}
		}, Cosh: function () {
			if (this.img) {
				var a = Math.cosh(this.real) * Math.cos(this.img);
				this.img = Math.sinh(this.real) * Math.sin(this.img);
				this.real = a;
			} else {
				this.real = Math.cosh(this.real);
			}
		}, Csc: function () {
			if (this.img) {
				var a = (2 * Math.sin(this.real) * Math.cosh(this.img)) / (Math.cosh(2 * this.img) - Math.cos(2 *this.real));
				this.img = (-2 * Math.cos(this.real) * Math.sinh(this.img)) / (Math.cosh(2 * this.img) - Math.cos(2 *this.real));
				this.real = a;
			} else {
				this.real = 1 / Math.sin(this.real);
			}
		}, Csch: function () {
			if (this.img) {
				var a = (2 * Math.sinh(this.real) * Math.cos(this.img)) / (Math.cosh(2 * this.real) - Math.cos(2 *this.img));
				this.img = (-2 * Math.cosh(this.real) * Math.sin(this.img)) / (Math.cosh(2 * this.real) - Math.cos(2 *this.img));
				this.real = a;
			} else {
				this.real = 1 / Math.sinh(this.real);
			}
		}, Sec: function () {
			if (this.img) {
				var a = (2 * Math.cos(this.real) * Math.cosh(this.img)) / (Math.cosh(2 * this.img) + Math.cos(2 *this.real));
				this.img = (2 * Math.sin(this.real) * Math.sinh(this.img)) / (Math.cosh(2 * this.img) + Math.cos(2 *this.real));
				this.real = a;
			} else {
				this.real = 1 / Math.cos(this.real);
			}
		}, Sech: function () {
			if (this.img) {
				var a = (2 * Math.cosh(this.real) * Math.cos(this.img)) / (Math.cosh(2 * this.real) + Math.cos(2 *this.img));
				this.img = (-2 * Math.sinh(this.real) * Math.sin(this.img)) / (Math.cosh(2 * this.real) + Math.cos(2 *this.img));
				this.real = a;
			} else {
				this.real = 1 / Math.cosh(this.real);
			}
		}, Sin: function () {
			if (this.img) {
				var a = Math.sin(this.real) * Math.cosh(this.img);
				this.img = Math.cos(this.real) * Math.sinh(this.img);
				this.real = a;
			} else {
				this.real = Math.sin(this.real);
			}
		}, Sinh: function () {
			if (this.img) {
				var a = Math.sinh(this.real) * Math.cos(this.img);
				this.img = Math.cosh(this.real) * Math.sin(this.img);
				this.real = a;
			} else {
				this.real = Math.sinh(this.real);
			}
		}, Div: function (comp) {

			var a = this.real, b = this.img, c = comp.real, d = comp.img, f = 1 / (c * c + d * d);

			if (Math.abs(f) == Infinity) {
				return new cError(cErrorType.not_numeric);
			}

			return new Complex((a * c + b * d) * f, (b * c - a * d) * f, this.suffix);

		}, Exp: function () {

			var e = Math.exp(this.real), c = Math.cos(this.img), s = Math.sin(this.img);

			this.real = e * c;
			this.img = e * s;

		}, Ln: function () {

			var abs = this.Abs(), arg = this.Arg();

			if (abs == 0 || arg instanceof cError) {
				return new cError(cErrorType.not_numeric);
			}

			this.real = Math.ln(abs);
			this.img = arg;

		}, Log10: function () {

			var c = new Complex(Math.ln(10), 0);
			var r = this.Ln();

			if (r instanceof cError) {
				return r;
			}

			c = this.Div(c);

			if (c instanceof cError) {
				return c;
			}

			this.real = c.real;
			this.img = c.img;

		}, Log2: function () {

			var c = new Complex(Math.ln(2), 0);
			var r = this.Ln();

			if (r instanceof cError) {
				return r;
			}

			c = this.Div(c);

			if (c instanceof cError) {
				return c;
			}

			this.real = c.real;
			this.img = c.img;

		}, Power: function (power) {

			if (this.real == 0 && this.img == 0) {
				if (power > 0) {
					this.real = this.img = 0;
					return true;
				} else {
					return false;
				}
			} else {

				var p = this.Abs(), phi;

				phi = Math.acos(this.real / p);
				if (this.img < 0) {
					phi = -phi;
				}

				p = Math.pow(p, power);
				phi *= power;

				this.real = Math.cos(phi) * p;
				this.img = Math.sin(phi) * p;

				return true;
			}

		}, Product: function (comp) {

			var a = this.real, b = this.img, c = comp.real, d = comp.img;

			this.real = a * c - b * d;
			this.img = a * d + b * c;

		}, SQRT: function () {

			if (this.real || this.img) {
				var abs = this.Abs(), arg = this.Arg();

				this.real = Math.sqrt(abs) * Math.cos(arg / 2);
				this.img = Math.sqrt(abs) * Math.sin(arg / 2);

			}

		}, Sub: function (comp) {

			this.real -= comp.real;
			this.img -= comp.img;

		}, Sum: function (comp) {

			this.real += comp.real;
			this.img += comp.img;

		}, isImagUnit: function (c) {
			return c == 'i' || c == 'j';
		}, parseComplexStr: function (s) {
			var match = XRegExp.exec(s, rg_complex_number), r, i, suf;
			if (match) {
				r = match["real"];
				i = match["img"];

				if (!(r || i)) {
					return new cError(cErrorType.not_numeric);
				}

				if (i) {
					suf = i[i.length - 1];
					i = i.substr(0, i.length - 1);
					if (i.length == 1 && (i[0] == "-" || i[0] == "+" )) {
						i = parseFloat(i + "1");
					} else {
						i = parseFloat(i);
					}
				} else {
					i = 0;
				}

				if (r) {
					r = parseFloat(r);
				} else {
					r = 0;
				}

				return new Complex(r, i, suf ? suf : "i");

			} else {
				return new cError(cErrorType.not_numeric);
			}
		}, ParseString: function (rStr) {

			var pStr = {pStr: rStr}, f = {f: undefined};

			if (rStr.length == 0) {
				this.real = 0;
				this.img = 0;
				this.suffix = "i";
				return this;
			}

			if (this.isImagUnit(pStr.pStr[0]) && rStr.length == 1) {
				this.real = 0;
				this.img = 1;
				this.suffix = pStr;
				return this;
			}

			if (!this.ParseDouble(pStr, f)) {
				return new cError(cErrorType.not_numeric);
			}

			switch (pStr.pStr[0] + "") {
				case '-':   // imag part follows
				case '+': {
					var r = f.f;

					if (this.isImagUnit(pStr.pStr[1])) {
						this.c = pStr.pStr[1];
						if (pStr.pStr[2] === undefined) {
							this.real = f.f;
							this.img = ( pStr.pStr[0] == '+' ) ? 1.0 : -1.0;
							return this;
						}
					} else if (this.ParseDouble(pStr, f) && this.isImagUnit(pStr.pStr[0])) {
						this.c = pStr.pStr;
						if (pStr.pStr[2] === undefined) {
							this.real = r;
							this.img = f.f;
							return this;
						}
					}
					break;
				}
				case 'j':
				case 'i':
					this.c = pStr;
					if (pStr.pStr[1] === undefined) {
						this.img = f.f;
						this.real = 0.0;
						return this;
					}
					break;
				case "undefined":     // only real-part
					this.real = f.f;
					this.img = 0.0;
					return this;
			}
			return new cError(cErrorType.not_numeric);
		}, ParseDouble: function (rp, rRet) {

			function isnum(c) {
				return c >= '0' && c <= '9';
			}


			function iscomma(c) {
				return c == '.' || c == ',';
			}


			function isexpstart(c) {
				return c == 'e' || c == 'E';
			}


			function isimagunit(c) {
				return c == 'i' || c == 'j';
			}

			var fInt = 0.0, fFrac = 0.0, fMult = 0.1, // multiplier to multiply digits with, when adding fractional ones
				nExp = 0, nMaxExp = 307, nDigCnt = 18, // max. number of digits to read in, rest doesn't matter
				State = {
					end: 0,
					sign: 1,
					intstart: 2,
					int: 3,
					ignoreintdigs: 4,
					frac: 5,
					ignorefracdigs: 6,
					expsign: 7,
					exp: 8
				}, eS = State.sign, bNegNum = false, bNegExp = false, p = rp.pStr, c, i = 0;

			while (eS) {
				c = p[i];
				switch (eS) {
					case State.sign:
						if (isnum(c)) {
							fInt = parseFloat(c);
							nDigCnt--;
							eS = State.int;
						} else if (c == '-') {
							bNegNum = true;
							eS = State.intstart;
						} else if (c == '+') {
							eS = State.intstart;
						} else if (iscomma(c)) {
							eS = State.frac;
						} else {
							return false;
						}
						break;
					case State.intstart:
						if (isnum(c)) {
							fInt = parseFloat(c);
							nDigCnt--;
							eS = State.int;
						} else if (iscomma(c)) {
							eS = State.frac;
						} else if (isimagunit(c)) {
							rRet.f = 0.0;
							return true;
						} else {
							return false;
						}
						break;
					case State.int:
						if (isnum(c)) {
							fInt *= 10.0;
							fInt += parseFloat(c);
							nDigCnt--;
							if (!nDigCnt) {
								eS = State.ignoreintdigs;
							}
						} else if (iscomma(c)) {
							eS = State.frac;
						} else if (isexpstart(c)) {
							eS = State.expsign;
						} else {
							eS = State.end;
						}
						break;
					case State.ignoreintdigs:
						if (isnum(c)) {
							nExp++;
						}     // just multiply num with 10... ;-)
						else if (iscomma(c)) {
							eS = State.frac;
						} else if (isexpstart(c)) {
							eS = State.expsign;
						} else {
							eS = State.end;
						}
						break;
					case State.frac:
						if (isnum(c)) {
							fFrac += parseFloat(c) * fMult;
							nDigCnt--;
							if (nDigCnt) {
								fMult *= 0.1;
							} else {
								eS = State.ignorefracdigs;
							}
						} else if (isexpstart(c)) {
							eS = State.expsign;
						} else {
							eS = State.end;
						}
						break;
					case State.ignorefracdigs:
						if (isexpstart(c)) {
							eS = State.expsign;
						} else if (!isnum(c)) {
							eS = State.end;
						}
						break;
					case State.expsign:
						if (isnum(c)) {
							nExp = parseFloat(c);
							eS = State.exp;
						} else if (c == '-') {
							bNegExp = true;
							eS = State.exp;
						} else if (c != '+') {
							eS = State.end;
						}
						break;
					case State.exp:
						if (isnum(c)) {
							nExp *= 10;
							nExp += parseFloat(c);
							if (nExp > nMaxExp) {
								return false;
							}
						} else {
							eS = State.end;
						}
						break;
					case State.end:     // to avoid compiler warning
						break;      // loop exits anyway
				}

				i++;
			}

			i--;        // set pointer back to last
			rp.pStr = p.substr(i);

			fInt += fFrac;
			var nLog10 = Math.log10(fInt);

			if (bNegExp) {
				nExp = -nExp;
			}

			if (nLog10 + nExp > nMaxExp) {
				return false;
			}

			fInt = fInt * Math.pow(10.0, nExp);

			if (bNegNum) {
				fInt = -fInt;
			}

			rRet.f = fInt;

			return true;
		}

	};

	var unitConverterArr = null;
	function getUnitConverter(){
		if(null === unitConverterArr){

			unitConverterArr = {};
			var generateWeightAndMass = function(){
				//Вес и масса
				unitConverterArr["g"] = {};//грамм

				unitConverterArr["g"]["sg"] = 0.0000685220500053478;
				unitConverterArr["g"]["lbm"] = 0.00220462291469134;
				unitConverterArr["g"]["u"] = 6.022137E+023;
				unitConverterArr["g"]["ozm"] = 0.0352739718003627;
				unitConverterArr["g"]["grain"] = 15.43236;
				unitConverterArr["g"]["cwt"] = 0.0000220462262184878;
				unitConverterArr["g"]["shweight"] = 0.00002204623;
				unitConverterArr["g"]["uk_cwt"] = 0.0000196841305522212;
				unitConverterArr["g"]["lcwt"] = 0.0000196841305522212;
				unitConverterArr["g"]["hweight"] = 0.00001968413;
				unitConverterArr["g"]["stone"] = 0.000157473;
				unitConverterArr["g"]["ton"] = 0.000001102311;
				unitConverterArr["g"]["uk_ton"] = 0.000000984206527611061;
				unitConverterArr["g"]["LTON"] = 0.000000984206527611061;
				unitConverterArr["g"]["brton"] = 0.0000009842065;


				unitConverterArr["sg"] = {};//Слэг

				unitConverterArr["sg"]["lbm"] = 32.1739194101648;
				unitConverterArr["sg"]["u"] = 8.78861184032002E+027;
				unitConverterArr["sg"]["ozm"] = 514.782785944229;
				unitConverterArr["sg"]["grain"] = 225217.429992179;
				unitConverterArr["sg"]["cwt"] = 0.321739151364665;
				unitConverterArr["sg"]["shweight"] = 0.321739206551459;
				unitConverterArr["sg"]["uk_cwt"] = 0.287267099432737;
				unitConverterArr["sg"]["lcwt"] = 0.287267099432737;
				unitConverterArr["sg"]["hweight"] = 0.287267091373707;
				unitConverterArr["sg"]["stone"] = 2.29813614723596;
				unitConverterArr["sg"]["ton"] = 0.0160869530306517;
				unitConverterArr["sg"]["uk_ton"] = 0.0143633549716368;
				unitConverterArr["sg"]["LTON"] = 0.0143633549716368;
				unitConverterArr["sg"]["brton"] = 0.0143633545686854;


				unitConverterArr["lbm"] = {};//Фунт массы (эвердьюпойс)

				unitConverterArr["lbm"]["u"] = 2.73159503145377E+026;
				unitConverterArr["lbm"]["ozm"] = 16.0000023429409;
				unitConverterArr["lbm"]["grain"] = 6999.99981727516;
				unitConverterArr["lbm"]["cwt"] = 0.00999999867168865;
				unitConverterArr["lbm"]["shweight"] = 0.0100000003869535;
				unitConverterArr["lbm"]["uk_cwt"] = 0.00892857024257915;
				unitConverterArr["lbm"]["lcwt"] = 0.00892857024257915;
				unitConverterArr["lbm"]["hweight"] = 0.00892856999209586;
				unitConverterArr["lbm"]["stone"] = 0.0714285417930745;
				unitConverterArr["lbm"]["ton"] = 0.000499999792551521;
				unitConverterArr["lbm"]["uk_ton"] = 0.000446428512128958;
				unitConverterArr["lbm"]["LTON"] = 0.000446428512128958;
				unitConverterArr["lbm"]["brton"] = 0.000446428499604793;


				unitConverterArr["u"] = {};//атомная единица массы

				unitConverterArr["u"]["ozm"] = 5.85738448002141E-026;
				unitConverterArr["u"]["grain"] = 2.56260526786422E-023;
				unitConverterArr["u"]["cwt"] = 3.66086427766219E-029;
				unitConverterArr["u"]["shweight"] = 3.66086490559747E-029;
				unitConverterArr["u"]["uk_cwt"] = 3.26862881934124E-029;
				unitConverterArr["u"]["lcwt"] = 3.26862881934124E-029;
				unitConverterArr["u"]["hweight"] = 3.2686287276427E-029;
				unitConverterArr["u"]["stone"] = 2.61490231789811E-028;
				unitConverterArr["u"]["ton"] = 1.83043162252868E-030;
				unitConverterArr["u"]["uk_ton"] = 1.63431440967062E-030;
				unitConverterArr["u"]["LTON"] = 1.63431440967062E-030;
				unitConverterArr["u"]["brton"] = 1.63431436382135E-030;


				unitConverterArr["ozm"] = {};//Унция

				unitConverterArr["ozm"]["grain"] = 437.499924514917;
				unitConverterArr["ozm"]["cwt"] = 0.000624999825459436;
				unitConverterArr["ozm"]["shweight"] = 0.000624999932663475;
				unitConverterArr["ozm"]["uk_cwt"] = 0.000558035558445925;
				unitConverterArr["ozm"]["lcwt"] = 0.000558035558445925;
				unitConverterArr["ozm"]["hweight"] = 0.000558035542790721;
				unitConverterArr["ozm"]["stone"] = 0.00446428320834516;
				unitConverterArr["ozm"]["ton"] = 0.0000312499824584161;
				unitConverterArr["ozm"]["uk_ton"] = 0.0000279017779222963;
				unitConverterArr["ozm"]["LTON"] = 0.0000279017779222963;
				unitConverterArr["ozm"]["brton"] = 0.0000279017771395361;


				unitConverterArr["grain"] = {};//Гран

				unitConverterArr["grain"]["cwt"] = 0.00000142857127610345;
				unitConverterArr["grain"]["shweight"] = 0.00000142857152114129;
				unitConverterArr["grain"]["uk_cwt"] = 0.0000012755100679495;
				unitConverterArr["grain"]["lcwt"] = 0.0000012755100679495;
				unitConverterArr["grain"]["hweight"] = 0.00000127551003216618;
				unitConverterArr["grain"]["stone"] = 0.0000102040776653733;
				unitConverterArr["grain"]["ton"] = 0.000000071428543657613;
				unitConverterArr["grain"]["uk_ton"] = 0.0000000637755033974752;
				unitConverterArr["grain"]["LTON"] = 0.0000000637755033974752;
				unitConverterArr["grain"]["brton"] = 0.0000000637755016083088;


				unitConverterArr["cwt"] = {};//Американский (короткий) центнер

				unitConverterArr["cwt"]["shweight"] = 1.00000017152651;
				unitConverterArr["cwt"]["uk_cwt"] = 0.892857142857143;
				unitConverterArr["cwt"]["lcwt"] = 0.892857142857143;
				unitConverterArr["cwt"]["hweight"] = 0.89285711780881;
				unitConverterArr["cwt"]["stone"] = 7.142855128101;
				unitConverterArr["cwt"]["ton"] = 0.049999985896707;
				unitConverterArr["cwt"]["uk_ton"] = 0.0446428571428571;
				unitConverterArr["cwt"]["LTON"] = 0.0446428571428571;
				unitConverterArr["cwt"]["brton"] = 0.0446428558904405;


				unitConverterArr["shweight"] = {};//Американский (короткий) центнер

				unitConverterArr["shweight"]["uk_cwt"] = 0.892856989708499;
				unitConverterArr["shweight"]["lcwt"] = 0.892856989708499;
				unitConverterArr["shweight"]["hweight"] = 0.892856964660171;
				unitConverterArr["shweight"]["stone"] = 7.1428539029122;
				unitConverterArr["shweight"]["ton"] = 0.0499999773203854;
				unitConverterArr["shweight"]["uk_ton"] = 0.044642849485425;
				unitConverterArr["shweight"]["LTON"] = 0.044642849485425;
				unitConverterArr["shweight"]["brton"] = 0.0446428482330085;


				unitConverterArr["uk_cwt"] = {};//Английский (длинный) центнер

				unitConverterArr["uk_cwt"]["lcwt"] = 1;
				unitConverterArr["uk_cwt"]["hweight"] = 0.999999971945867;
				unitConverterArr["uk_cwt"]["stone"] = 7.99999774347312;
				unitConverterArr["uk_cwt"]["ton"] = 0.0559999842043118;
				unitConverterArr["uk_cwt"]["uk_ton"] = 0.05;
				unitConverterArr["uk_cwt"]["LTON"] = 0.05;
				unitConverterArr["uk_cwt"]["brton"] = 0.0499999985972934;


				unitConverterArr["lcwt"] = {};//Английский (длинный) центнер

				unitConverterArr["lcwt"]["hweight"] = 0.999999971945867;
				unitConverterArr["lcwt"]["stone"] = 7.99999774347312;
				unitConverterArr["lcwt"]["ton"] = 0.0559999842043118;
				unitConverterArr["lcwt"]["uk_ton"] = 0.05;
				unitConverterArr["lcwt"]["LTON"] = 0.05;
				unitConverterArr["lcwt"]["brton"] = 0.0499999985972934;


				unitConverterArr["lcwt"] = {};//Английский (длинный) центнер

				unitConverterArr["lcwt"]["hweight"] = 0.999999971945867;
				unitConverterArr["lcwt"]["stone"] = 7.99999774347312;
				unitConverterArr["lcwt"]["ton"] = 0.0559999842043118;
				unitConverterArr["lcwt"]["uk_ton"] = 0.05;
				unitConverterArr["lcwt"]["LTON"] = 0.05;
				unitConverterArr["lcwt"]["brton"] = 0.0499999985972934;


				unitConverterArr["hweight"] = {};//Английский (длинный) центнер

				unitConverterArr["hweight"]["stone"] = 7.99999796790613;
				unitConverterArr["hweight"]["ton"] = 0.0559999857753429;
				unitConverterArr["hweight"]["uk_ton"] = 0.0500000014027067;
				unitConverterArr["hweight"]["LTON"] = 0.0500000014027067;
				unitConverterArr["hweight"]["brton"] = 0.05;


				unitConverterArr["stone"] = {};//Стоун

				unitConverterArr["stone"]["ton"] = 0.007;
				unitConverterArr["stone"]["uk_ton"] = 0.00625000176291212;
				unitConverterArr["stone"]["LTON"] = 0.00625000176291212;
				unitConverterArr["stone"]["brton"] = 0.00625000158757374;


				unitConverterArr["ton"] = {};//Тонна

				unitConverterArr["ton"]["uk_ton"] = 0.892857394701732;
				unitConverterArr["ton"]["LTON"] = 0.892857394701732;
				unitConverterArr["ton"]["brton"] = 0.892857369653392;


				unitConverterArr["uk_ton"] = {};//Стандартная тонна

				unitConverterArr["uk_ton"]["LTON"] = 1;
				unitConverterArr["uk_ton"]["brton"] = 0.999999971945867;


				unitConverterArr["LTON"] = {};//Стандартная тонна

				unitConverterArr["LTON"]["brton"] = 0.999999971945867;
			};

			var generateDistance = function(){

				//Picapt parameter do not support by LO
				unitConverterArr["m"] = {};

				unitConverterArr["m"]["mi"] = 0.000621371192237334;
				unitConverterArr["m"]["Nmi"] = 0.000539956803455724;
				unitConverterArr["m"]["in"] = 39.3700787401575;
				unitConverterArr["m"]["ft"] = 3.28083989501312;
				unitConverterArr["m"]["yd"] = 1.09361329833771;
				unitConverterArr["m"]["ang"] = 10000000000;
				unitConverterArr["m"]["ell"] = 0.8748906;
				unitConverterArr["m"]["ly"] = 1.05702345577329E-016;
				unitConverterArr["m"]["parsec"] = 3.240779E-017;
				unitConverterArr["m"]["pc"] = 3.240779E-017;
				//unitConverterArr["m"]["Picapt"] = ;
				unitConverterArr["m"]["Pica"] = 2834.64566929134;
				unitConverterArr["m"]["pica"] = 236.220472441;
				unitConverterArr["m"]["survey_mi"] = 0.000621369949494949;


				unitConverterArr["mi"] = {};

				unitConverterArr["mi"]["Nmi"] = 0.868976241900648;
				unitConverterArr["mi"]["in"] = 63360;
				unitConverterArr["mi"]["ft"] = 5280;
				unitConverterArr["mi"]["yd"] = 1760;
				unitConverterArr["mi"]["ang"] = 16093440000000;
				unitConverterArr["mi"]["ell"] = 1407.9999377664;
				unitConverterArr["mi"]["ly"] = 0.000000000000170111435640801;
				unitConverterArr["mi"]["parsec"] = 0.00000000000005215528238976;
				unitConverterArr["mi"]["pc"] = 0.00000000000005215528238976;
				unitConverterArr["mi"]["Pica"] = 4561920;
				unitConverterArr["mi"]["pica"] = 380160.000000089;
				unitConverterArr["mi"]["survey_mi"] = 0.999998;


				unitConverterArr["Nmi"] = {};

				unitConverterArr["Nmi"]["in"] = 72913.3858267717;
				unitConverterArr["Nmi"]["ft"] = 6076.1154855643;
				unitConverterArr["Nmi"]["yd"] = 2025.37182852143;
				unitConverterArr["Nmi"]["ang"] = 18520000000000;
				unitConverterArr["Nmi"]["ell"] = 1620.2973912;
				unitConverterArr["Nmi"]["ly"] = 0.000000000000195760744009214;
				unitConverterArr["Nmi"]["parsec"] = 0.00000000000006001922708;
				unitConverterArr["Nmi"]["pc"] = 0.00000000000006001922708;
				unitConverterArr["Nmi"]["Pica"] = 5249763.77952756;
				unitConverterArr["Nmi"]["pica"] = 437480.314960732;
				unitConverterArr["Nmi"]["survey_mi"] = 1.15077714646465;

				unitConverterArr["in"] = {};

				unitConverterArr["in"]["ft"] = 0.0833333333333333;
				unitConverterArr["in"]["yd"] = 0.0277777777777778;
				unitConverterArr["in"]["ang"] = 254000000;
				unitConverterArr["in"]["ell"] = 0.02222222124;
				unitConverterArr["in"]["ly"] = 2.68483957766416E-018;
				unitConverterArr["in"]["parsec"] = 8.23157866E-019;
				unitConverterArr["in"]["pc"] = 8.23157866E-019;
				unitConverterArr["in"]["Pica"] = 72;
				unitConverterArr["in"]["pica"] = 6.0000000000014;
				unitConverterArr["in"]["survey_mi"] = 0.0000157827967171717;


				unitConverterArr["ft"] = {};

				unitConverterArr["ft"]["yd"] = 0.333333333333333;
				unitConverterArr["ft"]["ang"] = 3048000000;
				unitConverterArr["ft"]["ell"] = 0.26666665488;
				unitConverterArr["ft"]["ly"] = 3.221807493197E-017;
				unitConverterArr["ft"]["parsec"] = 9.877894392E-018;
				unitConverterArr["ft"]["pc"] = 9.877894392E-018;
				unitConverterArr["ft"]["Pica"] = 864;
				unitConverterArr["ft"]["pica"] = 72.0000000000168;
				unitConverterArr["ft"]["survey_mi"] = 0.000189393560606061;


				unitConverterArr["yd"] = {};

				unitConverterArr["yd"]["ang"] = 9144000000;
				unitConverterArr["yd"]["ell"] = 0.79999996464;
				unitConverterArr["yd"]["ly"] = 9.66542247959099E-017;
				unitConverterArr["yd"]["parsec"] = 2.9633683176E-017;
				unitConverterArr["yd"]["pc"] = 2.9633683176E-017;
				unitConverterArr["yd"]["Pica"] = 2592;
				unitConverterArr["yd"]["pica"] = 216.00000000005;
				unitConverterArr["yd"]["survey_mi"] = 0.000568180681818182;


				unitConverterArr["ang"] = {};

				unitConverterArr["ang"]["ell"] = 0.00000000008748906;
				unitConverterArr["ang"]["ly"] = 1.05702345577329E-026;
				unitConverterArr["ang"]["parsec"] = 3.240779E-027;
				unitConverterArr["ang"]["pc"] = 3.240779E-027;
				unitConverterArr["ang"]["Pica"] = 0.000000283464566929134;
				unitConverterArr["ang"]["pica"] = 0.0000000236220472441;
				unitConverterArr["ang"]["survey_mi"] = 0.000000000000062136994949495;


				unitConverterArr["ell"] = {};

				unitConverterArr["ell"]["ly"] = 1.20817786335034E-016;
				unitConverterArr["ell"]["parsec"] = 3.70421056072611E-017;
				unitConverterArr["ell"]["pc"] = 3.70421056072611E-017;
				unitConverterArr["ell"]["Pica"] = 3240.00014320801;
				unitConverterArr["ell"]["pica"] = 270.000011934064;
				unitConverterArr["ell"]["survey_mi"] = 0.000710225883664711;


				unitConverterArr["ly"] = {};

				unitConverterArr["ly"]["parsec"] = 0.30659480471312;
				unitConverterArr["ly"]["pc"] = 0.30659480471312;
				unitConverterArr["ly"]["Pica"] = 2.68172447244094E+019;
				unitConverterArr["ly"]["pica"] = 2.23477039370131E+018;
				unitConverterArr["ly"]["survey_mi"] = 5878487805555.55;


				unitConverterArr["parsec"] = {};

				unitConverterArr["parsec"]["pc"] = 1;
				unitConverterArr["parsec"]["Pica"] = 8.74680337440886E+019;
				unitConverterArr["parsec"]["pica"] = 7.28900281200909E+018;
				unitConverterArr["parsec"]["survey_mi"] = 19173474942134.3;


				unitConverterArr["pc"] = {};
				unitConverterArr["pc"]["Pica"] = 8.74680337440886E+019;
				unitConverterArr["pc"]["pica"] = 7.28900281200909E+018;
				unitConverterArr["pc"]["survey_mi"] = 19173474942134.3;


				unitConverterArr["Pica"] = {};
				unitConverterArr["Pica"]["pica"] = 0.0833333333333528;
				unitConverterArr["Pica"]["survey_mi"] = 0.000000219205509960718;


				unitConverterArr["pica"] = {};
				unitConverterArr["pica"]["survey_mi"] = 0.00000263046611952801;

			};

			var generateTime = function(){

				unitConverterArr["yr"] = {};//Год

				unitConverterArr["yr"]["day"] = 365.25;
				unitConverterArr["yr"]["d"] = 365.25;
				unitConverterArr["yr"]["hr"] = 8766;
				unitConverterArr["yr"]["mn"] = 525960;
				unitConverterArr["yr"]["min"] = 525960;
				unitConverterArr["yr"]["sec"] = 31557600;
				unitConverterArr["yr"]["s"] = 31557600;


				unitConverterArr["day"] = {};//День

				unitConverterArr["day"]["d"] = 1;
				unitConverterArr["day"]["hr"] = 24;
				unitConverterArr["day"]["mn"] = 1440;
				unitConverterArr["day"]["min"] = 1440;
				unitConverterArr["day"]["sec"] = 86400;
				unitConverterArr["day"]["s"] = 86400;


				unitConverterArr["d"] = {};//День

				unitConverterArr["d"]["hr"] = 24;
				unitConverterArr["d"]["mn"] = 1440;
				unitConverterArr["d"]["min"] = 1440;
				unitConverterArr["d"]["sec"] = 86400;
				unitConverterArr["d"]["s"] = 86400;


				unitConverterArr["hr"] = {};//Час

				unitConverterArr["hr"]["mn"] = 60;
				unitConverterArr["hr"]["min"] = 60;
				unitConverterArr["hr"]["sec"] = 3600;
				unitConverterArr["hr"]["s"] = 3600;


				unitConverterArr["mn"] = {};//Минуты

				unitConverterArr["mn"]["min"] = 1;
				unitConverterArr["mn"]["sec"] = 60;
				unitConverterArr["mn"]["s"] = 60;


				unitConverterArr["min"] = {};//Минуты

				unitConverterArr["min"]["sec"] = 60;
				unitConverterArr["min"]["s"] = 60;


				unitConverterArr["sec"] = {};//Секунды

				unitConverterArr["sec"]["s"] = 1;
			};

			var generatePressure = function(){

				//p parameter do not support by LO(p === Pa in MS DOC)
				unitConverterArr["Pa"] = {};//Паскаль

				//unitConverterArr["Pa"]["p"] = ;
				unitConverterArr["Pa"]["atm"] = 0.00000986923299998193;
				unitConverterArr["Pa"]["at"] = 0.00000986923299998193;
				unitConverterArr["Pa"]["mmHg"] = 0.00750061707998627;
				unitConverterArr["Pa"]["psi"] = 0.0001450377;
				unitConverterArr["Pa"]["Torr"] = 0.007500638;

				unitConverterArr["atm"] = {};//Атмосфера

				unitConverterArr["atm"]["at"] = 1;
				unitConverterArr["atm"]["mmHg"] = 760;
				unitConverterArr["atm"]["psi"] = 14.6959444569062;
				unitConverterArr["atm"]["Torr"] = 760.00211972032;


				unitConverterArr["at"] = {};//Атмосфера

				unitConverterArr["at"]["mmHg"] = 760;
				unitConverterArr["at"]["psi"] = 14.6959444569062;
				unitConverterArr["at"]["Torr"] = 760.00211972032;


				unitConverterArr["mmHg"] = {};//Миллиметр ртутного столба

				unitConverterArr["mmHg"]["psi"] = 0.019336769022245;
				unitConverterArr["mmHg"]["Torr"] = 1.00000278910568;


				unitConverterArr["psi"] = {};//Фунт на квадратный дюйм

				unitConverterArr["psi"]["Torr"] = 51.7150920071126;
			};

			var generateForceAndEnergy = function(){

				//Force
				unitConverterArr["N"] = {};//Newton

				unitConverterArr["N"]["dyn"] = 100000;
				unitConverterArr["N"]["dy"] = 100000;
				unitConverterArr["N"]["lbf"] = 0.224808923655339;
				unitConverterArr["N"]["pond"] = 101.9716;


				unitConverterArr["dyn"] = {};//Dyne

				unitConverterArr["dyn"]["dy"] = 1;
				unitConverterArr["dyn"]["lbf"] = 0.00000224808923655339;
				unitConverterArr["dyn"]["pond"] = 0.001019716;


				unitConverterArr["dy"] = {};//Dyne

				unitConverterArr["dy"]["lbf"] = 0.00000224808923655339;
				unitConverterArr["dy"]["pond"] = 0.001019716;


				unitConverterArr["lbf"] = {};//Pound force

				unitConverterArr["lbf"]["pond"] = 453.5923144952;


				//Energy
				unitConverterArr["J"] = {};//Joule

				unitConverterArr["J"]["e"] = 10000000;
				unitConverterArr["J"]["c"] = 0.239006249473467;
				unitConverterArr["J"]["cal"] = 0.238846190642017;
				unitConverterArr["J"]["eV"] = 6.241457E+018;
				unitConverterArr["J"]["ev"] = 6.241457E+018;
				unitConverterArr["J"]["HPh"] = 0.000000372506111111111;
				unitConverterArr["J"]["hh"] = 0.000000372506111111111;
				unitConverterArr["J"]["Wh"] = 0.000277777777777778;
				unitConverterArr["J"]["wh"] = 0.000277777777777778;
				unitConverterArr["J"]["flb"] = 23.7304222192651;
				unitConverterArr["J"]["BTU"] = 0.000947815067349015;
				unitConverterArr["J"]["btu"] = 0.000947815067349015;


				unitConverterArr["e"] = {};//Erg

				unitConverterArr["e"]["c"] = 0.0000000239006249473467;
				unitConverterArr["e"]["cal"] = 0.0000000238846190642017;
				unitConverterArr["e"]["eV"] = 624145700000;
				unitConverterArr["e"]["ev"] = 624145700000;
				unitConverterArr["e"]["HPh"] = 0.0000000000000372506111111111;
				unitConverterArr["e"]["hh"] = 0.0000000000000372506111111111;
				unitConverterArr["e"]["Wh"] = 0.0000000000277777777777778;
				unitConverterArr["e"]["wh"] = 0.0000000000277777777777778;
				unitConverterArr["e"]["flb"] = 0.00000237304222192651;
				unitConverterArr["e"]["BTU"] = 0.0000000000947815067349015;
				unitConverterArr["e"]["btu"] = 0.0000000000947815067349015;


				unitConverterArr["c"] = {};//Thermodynamic calorie

				unitConverterArr["c"]["cal"] = 0.99933031528756;
				unitConverterArr["c"]["eV"] = 2.61141999999999E+019;
				unitConverterArr["c"]["ev"] = 2.61141999999999E+019;
				unitConverterArr["c"]["HPh"] = 0.00000155856222141365;
				unitConverterArr["c"]["hh"] = 0.00000155856222141365;
				unitConverterArr["c"]["Wh"] = 0.0011622197260102;
				unitConverterArr["c"]["wh"] = 0.0011622197260102;
				unitConverterArr["c"]["flb"] = 99.2878733152101;
				unitConverterArr["c"]["BTU"] = 0.00396564972437775;
				unitConverterArr["c"]["btu"] = 0.00396564972437775;


				unitConverterArr["cal"] = {};//IT calorie

				unitConverterArr["cal"]["eV"] = 2.61317E+019;
				unitConverterArr["cal"]["ev"] = 2.61317E+019;
				unitConverterArr["cal"]["HPh"] = 0.00000155960666615539;
				unitConverterArr["cal"]["hh"] = 0.00000155960666615539;
				unitConverterArr["cal"]["Wh"] = 0.00116299856837203;
				unitConverterArr["cal"]["wh"] = 0.00116299856837203;
				unitConverterArr["cal"]["flb"] = 99.3544094443285;
				unitConverterArr["cal"]["BTU"] = 0.00396830723907002;
				unitConverterArr["cal"]["btu"] = 0.00396830723907002;


				unitConverterArr["eV"] = {};//Electron volt

				unitConverterArr["eV"]["ev"] = 1;
				unitConverterArr["eV"]["HPh"] = 5.968255667084E-026;
				unitConverterArr["eV"]["hh"] = 5.968255667084E-026;
				unitConverterArr["eV"]["Wh"] = 4.45052778185891E-023;
				unitConverterArr["eV"]["wh"] = 4.45052778185891E-023;
				unitConverterArr["eV"]["flb"] = 3.80206452103493E-018;
				unitConverterArr["eV"]["BTU"] = 1.51857982414846E-022;
				unitConverterArr["eV"]["btu"] = 1.51857982414846E-022;


				unitConverterArr["ev"] = {};//Electron volt

				unitConverterArr["ev"]["HPh"] = 5.968255667084E-026;
				unitConverterArr["ev"]["hh"] = 5.968255667084E-026;
				unitConverterArr["ev"]["Wh"] = 4.45052778185891E-023;
				unitConverterArr["ev"]["wh"] = 4.45052778185891E-023;
				unitConverterArr["ev"]["flb"] = 3.80206452103493E-018;
				unitConverterArr["ev"]["BTU"] = 1.51857982414846E-022;
				unitConverterArr["ev"]["btu"] = 1.51857982414846E-022;


				unitConverterArr["HPh"] = {};//Horsepower-hour

				unitConverterArr["HPh"]["hh"] = 1;
				unitConverterArr["HPh"]["Wh"] = 745.699921403228;
				unitConverterArr["HPh"]["wh"] = 745.699921403228;
				unitConverterArr["HPh"]["flb"] = 63704786.3415771;
				unitConverterArr["HPh"]["BTU"] = 2544.42823641704;
				unitConverterArr["HPh"]["btu"] = 2544.42823641704;


				unitConverterArr["hh"] = {};//Horsepower-hour

				unitConverterArr["hh"]["Wh"] = 745.699921403228;
				unitConverterArr["hh"]["wh"] = 745.699921403228;
				unitConverterArr["hh"]["flb"] = 63704786.3415771;
				unitConverterArr["hh"]["BTU"] = 2544.42823641704;
				unitConverterArr["hh"]["btu"] = 2544.42823641704;


				unitConverterArr["Wh"] = {};//Watt-hour

				unitConverterArr["Wh"]["wh"] = 1;
				unitConverterArr["Wh"]["flb"] = 85429.5199893544;
				unitConverterArr["Wh"]["BTU"] = 3.41213424245645;
				unitConverterArr["Wh"]["btu"] = 3.41213424245645;


				unitConverterArr["wh"] = {};//Watt-hour

				unitConverterArr["wh"]["flb"] = 85429.5199893544;
				unitConverterArr["wh"]["BTU"] = 3.41213424245645;
				unitConverterArr["wh"]["btu"] = 3.41213424245645;


				unitConverterArr["flb"] = {};//Foot-pound

				unitConverterArr["flb"]["BTU"] = 0.0000399409272448405;
				unitConverterArr["flb"]["btu"] = 0.0000399409272448405;


				unitConverterArr["BTU"] = {};//BTU

				unitConverterArr["BTU"]["btu"] = 1;

			};


			var generatePowerMagnetismTemperature = function(){

				//Power
				unitConverterArr["HP"] = {};//Horsepower

				unitConverterArr["HP"]["h"] = 1;
				unitConverterArr["HP"]["PS"] = 1.0138700185381;
				unitConverterArr["HP"]["W"] = 745.699921403228;
				unitConverterArr["HP"]["w"] = 745.699921403228;


				unitConverterArr["h"] = {};//Horsepower

				unitConverterArr["h"]["PS"] = 1.0138700185381;
				unitConverterArr["h"]["W"] = 745.699921403228;
				unitConverterArr["h"]["w"] = 745.699921403228;


				unitConverterArr["PS"] = {};//Pferdestärke

				unitConverterArr["PS"]["W"] = 735.498542977386;
				unitConverterArr["PS"]["w"] = 735.498542977386;

				unitConverterArr["W"] = {};//Watt ;

				unitConverterArr["W"]["w"] = 1;


				//Magnetism
				unitConverterArr["T"] = {};//Tesla

				unitConverterArr["T"]["ga"] = 10000;

				//***TODO пересмотреть коэфиициэнты у температуры!!!!!***
				//Temperature
				//type 0 - умножение, 1 - сложение
				unitConverterArr["C"] = {};//Degree Celsius

				unitConverterArr["C"]["cel"] = 1;
				unitConverterArr["C"]["F"] = [{type: 0, val: 1.8}, {type: 1, val: 32}];
				unitConverterArr["C"]["fah"] = [{type: 0, val: 1.8}, {type: 1, val: 32}];
				unitConverterArr["C"]["K"] = [{type: 1, val: 273.15}];
				unitConverterArr["C"]["kel"] = [{type: 1, val: 273.15}];
				unitConverterArr["C"]["Rank"] = [{type: 1, val: 273.15}, {type: 0, val: 1.8}];
				unitConverterArr["C"]["Reau"] = 0.8;


				unitConverterArr["cel"] = {};//Degree Celsius

				unitConverterArr["cel"]["F"] = [{type: 0, val: 1.8}, {type: 1, val: 32}];
				unitConverterArr["cel"]["fah"] = [{type: 0, val: 1.8}, {type: 1, val: 32}];
				unitConverterArr["cel"]["K"] = [{type: 1, val: 273.15}];
				unitConverterArr["cel"]["kel"] = [{type: 1, val: 273.15}];
				unitConverterArr["cel"]["Rank"] = [{type: 1, val: 273.15}, {type: 0, val: 1.8}];
				unitConverterArr["cel"]["Reau"] = 0.8;


				unitConverterArr["F"] = {};//Degree Fahrenheit

				unitConverterArr["F"]["fah"] = 1;
				unitConverterArr["F"]["K"] = [{type: 1, val: -32}, {type: 0, val: 5/9}, {type: 1, val: 273.15}];
				unitConverterArr["F"]["kel"] = [{type: 1, val: -32}, {type: 0, val: 5/9}, {type: 1, val: 273.15}];
				unitConverterArr["F"]["Rank"] = [{type: 1, val: 459.67}];
				unitConverterArr["F"]["Reau"] = [{type: 1, val: -32}, {type: 0, val: 0.444444}];


				unitConverterArr["fah"] = {};//Degree Fahrenheit

				unitConverterArr["fah"]["K"] = [{type: 1, val: -32}, {type: 0, val: 5/9}, {type: 1, val: 273.15}];
				unitConverterArr["fah"]["kel"] = [{type: 1, val: -32}, {type: 0, val: 5/9}, {type: 1, val: 273.15}];
				unitConverterArr["fah"]["Rank"] = [{type: 1, val: 459.67}];
				unitConverterArr["fah"]["Reau"] = [{type: 1, val: -32}, {type: 0, val: 0.444444}];


				unitConverterArr["K"] = {};//Kelvin

				unitConverterArr["K"]["kel"] = 1;
				unitConverterArr["K"]["Rank"] = 1.8;
				unitConverterArr["K"]["Reau"] = [{type: 1, val: -273.15}, {type: 0, val: 0.8}];


				unitConverterArr["kel"] = {};//Kelvin

				unitConverterArr["kel"]["Rank"] = 1.8;
				unitConverterArr["kel"]["Reau"] = [{type: 1, val: -273.15}, {type: 0, val: 0.8}];

				unitConverterArr["Rank"] = {};//Degrees Rankine

				unitConverterArr["Rank"]["Reau"] = [{type: 0, val: 0.4444444}, {type: 1, val: -218.52}];

			};


			var generateVolume = function(){

				//Picapt3/Picapt^3 do not support by LO
				unitConverterArr["tsp"] = {};//Teaspoon

				unitConverterArr["tsp"]["tspm"] = 0.98578431875;
				unitConverterArr["tsp"]["tbs"] = 0.333333333333333;
				unitConverterArr["tsp"]["oz"] = 0.166666666666667;
				unitConverterArr["tsp"]["cup"] = 0.0208333333333333;
				unitConverterArr["tsp"]["pt"] = 0.0104166666666667;
				unitConverterArr["tsp"]["us_pt"] = 0.0104166666666667;
				unitConverterArr["tsp"]["uk_pt"] = 0.00867368942321863;
				unitConverterArr["tsp"]["qt"] = 0.00520833333333333;
				unitConverterArr["tsp"]["uk_qt"] = 0.00433684471160932;
				unitConverterArr["tsp"]["gal"] = 0.00130208333333333;
				unitConverterArr["tsp"]["uk_gal"] = 0.00108421117790233;
				unitConverterArr["tsp"]["l"] = 0.00492892159375;
				unitConverterArr["tsp"]["L"] = 0.00492892159375;
				unitConverterArr["tsp"]["lt"] = 0.00492892159375;
				unitConverterArr["tsp"]["ang3"] = 4.92892159375E+024;
				unitConverterArr["tsp"]["ang^3"] = 4.92892159375E+024;
				unitConverterArr["tsp"]["barrel"] = 0.0000310019841269841;
				unitConverterArr["tsp"]["bushel"] = 0.000139870916129584;
				unitConverterArr["tsp"]["ft3"] = 0.00017406322337963;
				unitConverterArr["tsp"]["ft^3"] = 0.00017406322337963;

				unitConverterArr["tsp"]["in3"] = 0.30078125;
				unitConverterArr["tsp"]["in^3"] = 0.30078125;
				unitConverterArr["tsp"]["ly3"] = 5.82110969649095E-054;
				unitConverterArr["tsp"]["ly^3"] = 5.82110969649095E-054;
				unitConverterArr["tsp"]["ang^3"] = 4.92892159375E+024;
				unitConverterArr["tsp"]["m3"] = 0.00000492892159375;
				unitConverterArr["tsp"]["m^3"] = 0.00000492892159375;
				unitConverterArr["tsp"]["mi3"] = 1.18251117637581E-015;
				unitConverterArr["tsp"]["mi^3"] = 1.18251117637581E-015;

				unitConverterArr["tsp"]["yd3"] = 0.0000064467860510974;
				unitConverterArr["tsp"]["yd^3"] = 0.0000064467860510974;
				unitConverterArr["tsp"]["Nmi3"] = 7.7594146898722E-016;
				unitConverterArr["tsp"]["Nmi^3"] = 7.7594146898722E-016;
				//unitConverterArr["tsp"]["Picapt3"] = ;
				//unitConverterArr["tsp"]["Picapt^3"] = ;
				unitConverterArr["tsp"]["Pica3"] = 112266;
				unitConverterArr["tsp"]["Pica^3"] = 112266;
				unitConverterArr["tsp"]["GRT"] = 0.00000174063239539155;
				unitConverterArr["tsp"]["regton"] = 0.00000174063239539155;
				unitConverterArr["tsp"]["MTON"] = 0.00696252893518519;


				unitConverterArr["tspm"] = {};//Modern teaspoon

				unitConverterArr["tspm"]["tbs"] = 0.33814022701843;
				unitConverterArr["tspm"]["oz"] = 0.169070113509215;
				unitConverterArr["tspm"]["cup"] = 0.0211337641886519;
				unitConverterArr["tspm"]["pt"] = 0.0105668820943259;
				unitConverterArr["tspm"]["us_pt"] = 0.0105668820943259;
				unitConverterArr["tspm"]["uk_pt"] = 0.00879876993196351;
				unitConverterArr["tspm"]["qt"] = 0.00528344104716297;
				unitConverterArr["tspm"]["uk_qt"] = 0.00439938496598176;
				unitConverterArr["tspm"]["gal"] = 0.00132086026179074;
				unitConverterArr["tspm"]["uk_gal"] = 0.00109984624149544;
				unitConverterArr["tspm"]["l"] = 0.005;
				unitConverterArr["tspm"]["L"] = 0.005;
				unitConverterArr["tspm"]["lt"] = 0.005;
				unitConverterArr["tspm"]["ang3"] = 5E+024;
				unitConverterArr["tspm"]["ang^3"] = 5E+024;
				unitConverterArr["tspm"]["barrel"] = 0.0000314490538521605;
				unitConverterArr["tspm"]["bushel"] = 0.00014188795;
				unitConverterArr["tspm"]["ft3"] = 0.000176573333607443;
				unitConverterArr["tspm"]["ft^3"] = 0.000176573333607443;

				unitConverterArr["tspm"]["in3"] = 0.305118720473661;
				unitConverterArr["tspm"]["in^3"] = 0.305118720473661;
				unitConverterArr["tspm"]["ly3"] = 5.9050540628119E-054;
				unitConverterArr["tspm"]["ly^3"] = 5.9050540628119E-054;
				unitConverterArr["tspm"]["ang^3"] = 5E+024;
				unitConverterArr["tspm"]["m3"] = 0.000005;
				unitConverterArr["tspm"]["m^3"] = 0.000005;
				unitConverterArr["tspm"]["mi3"] = 1.19956379289464E-015;
				unitConverterArr["tspm"]["mi^3"] = 1.19956379289464E-015;

				unitConverterArr["tspm"]["yd3"] = 0.00000653975309657196;
				unitConverterArr["tspm"]["yd^3"] = 0.00000653975309657196;
				unitConverterArr["tspm"]["Nmi3"] = 7.87131073429058E-016;
				unitConverterArr["tspm"]["Nmi^3"] = 7.87131073429058E-016;
				//unitConverterArr["tspm"]["Picapt3"] = ;
				//unitConverterArr["tspm"]["Picapt^3"] = ;
				unitConverterArr["tspm"]["Pica3"] = 113884.952179353;
				unitConverterArr["tspm"]["Pica^3"] = 113884.952179353;
				unitConverterArr["tspm"]["GRT"] = 0.0000017657335;
				unitConverterArr["tspm"]["regton"] = 0.0000017657335;
				unitConverterArr["tspm"]["MTON"] = 0.00706293334429772;


				unitConverterArr["tbs"] = {};

				unitConverterArr["tbs"]["oz"] = 0.5;
				unitConverterArr["tbs"]["cup"] = 0.0625;
				unitConverterArr["tbs"]["pt"] = 0.03125;
				unitConverterArr["tbs"]["us_pt"] = 0.03125;
				unitConverterArr["tbs"]["uk_pt"] = 0.0260210682696559;
				unitConverterArr["tbs"]["qt"] = 0.015625;
				unitConverterArr["tbs"]["uk_qt"] = 0.013010534134828;
				unitConverterArr["tbs"]["gal"] = 0.00390625;
				unitConverterArr["tbs"]["uk_gal"] = 0.00325263353370699;
				unitConverterArr["tbs"]["l"] = 0.01478676478125;
				unitConverterArr["tbs"]["L"] = 0.01478676478125;
				unitConverterArr["tbs"]["lt"] = 0.01478676478125;
				unitConverterArr["tbs"]["ang3"] = 1.478676478125E+025;
				unitConverterArr["tbs"]["ang^3"] = 1.478676478125E+025;
				unitConverterArr["tbs"]["barrel"] = 0.0000930059523809524;
				unitConverterArr["tbs"]["bushel"] = 0.000419612748388752;
				unitConverterArr["tbs"]["ft3"] = 0.000522189670138889;
				unitConverterArr["tbs"]["ft^3"] = 0.000522189670138889;

				unitConverterArr["tbs"]["in3"] = 0.90234375;
				unitConverterArr["tbs"]["in^3"] = 0.90234375;
				unitConverterArr["tbs"]["ly3"] = 1.74633290894728E-053;
				unitConverterArr["tbs"]["ly^3"] = 1.74633290894728E-053;
				unitConverterArr["tbs"]["ang^3"] = 1.478676478125E+025;
				unitConverterArr["tbs"]["m3"] = 0.00001478676478125;
				unitConverterArr["tbs"]["m^3"] = 0.00001478676478125;
				unitConverterArr["tbs"]["mi3"] = 3.54753352912742E-015;
				unitConverterArr["tbs"]["mi^3"] = 3.54753352912742E-015;

				unitConverterArr["tbs"]["yd3"] = 0.0000193403581532922;
				unitConverterArr["tbs"]["yd^3"] = 0.0000193403581532922;
				unitConverterArr["tbs"]["Nmi3"] = 2.32782440696166E-015;
				unitConverterArr["tbs"]["Nmi^3"] = 2.32782440696166E-015;
				//unitConverterArr["tbs"]["Picapt3"] = ;
				//unitConverterArr["tbs"]["Picapt^3"] = ;
				unitConverterArr["tbs"]["Pica3"] = 336798;
				unitConverterArr["tbs"]["Pica^3"] = 336798;
				unitConverterArr["tbs"]["GRT"] = 0.00000522189718617466;
				unitConverterArr["tbs"]["regton"] = 0.00000522189718617466;
				unitConverterArr["tbs"]["MTON"] = 0.0208875868055556;


				unitConverterArr["oz"] = {};

				unitConverterArr["oz"]["cup"] = 0.125;
				unitConverterArr["oz"]["pt"] = 0.0625;
				unitConverterArr["oz"]["us_pt"] = 0.0625;
				unitConverterArr["oz"]["uk_pt"] = 0.0520421365393118;
				unitConverterArr["oz"]["qt"] = 0.03125;
				unitConverterArr["oz"]["uk_qt"] = 0.0260210682696559;
				unitConverterArr["oz"]["gal"] = 0.0078125;
				unitConverterArr["oz"]["uk_gal"] = 0.00650526706741398;
				unitConverterArr["oz"]["l"] = 0.0295735295625;
				unitConverterArr["oz"]["L"] = 0.0295735295625;
				unitConverterArr["oz"]["lt"] = 0.0295735295625;
				unitConverterArr["oz"]["ang3"] = 2.95735295625E+025;
				unitConverterArr["oz"]["ang^3"] = 2.95735295625E+025;
				unitConverterArr["oz"]["barrel"] = 0.000186011904761905;
				unitConverterArr["oz"]["bushel"] = 0.000839225496777505;
				unitConverterArr["oz"]["ft3"] = 0.00104437934027778;
				unitConverterArr["oz"]["ft^3"] = 0.00104437934027778;

				unitConverterArr["oz"]["in3"] = 1.8046875;
				unitConverterArr["oz"]["in^3"] = 1.8046875;
				unitConverterArr["oz"]["ly3"] = 3.49266581789457E-053;
				unitConverterArr["oz"]["ly^3"] = 3.49266581789457E-053;
				unitConverterArr["oz"]["ang^3"] = 2.95735295625E+025;
				unitConverterArr["oz"]["m3"] = 0.0000295735295625;
				unitConverterArr["oz"]["m^3"] = 0.0000295735295625;
				unitConverterArr["oz"]["mi3"] = 7.09506705825485E-015;
				unitConverterArr["oz"]["mi^3"] = 7.09506705825485E-015;

				unitConverterArr["oz"]["yd3"] = 0.0000386807163065844;
				unitConverterArr["oz"]["yd^3"] = 0.0000386807163065844;
				unitConverterArr["oz"]["Nmi3"] = 4.65564881392332E-015;
				unitConverterArr["oz"]["Nmi^3"] = 4.65564881392332E-015;
				//unitConverterArr["oz"]["Picapt3"] = ;
				//unitConverterArr["oz"]["Picapt^3"] = ;
				unitConverterArr["oz"]["Pica3"] = 673596;
				unitConverterArr["oz"]["Pica^3"] = 673596;
				unitConverterArr["oz"]["GRT"] = 0.0000104437943723493;
				unitConverterArr["oz"]["regton"] = 0.0000104437943723493;
				unitConverterArr["oz"]["MTON"] = 0.0417751736111111;


				unitConverterArr["cup"] = {};

				unitConverterArr["cup"]["pt"] = 0.5;
				unitConverterArr["cup"]["us_pt"] = 0.5;
				unitConverterArr["cup"]["uk_pt"] = 0.416337092314494;
				unitConverterArr["cup"]["qt"] = 0.25;
				unitConverterArr["cup"]["uk_qt"] = 0.208168546157247;
				unitConverterArr["cup"]["gal"] = 0.0625;
				unitConverterArr["cup"]["uk_gal"] = 0.0520421365393118;
				unitConverterArr["cup"]["l"] = 0.2365882365;
				unitConverterArr["cup"]["L"] = 0.2365882365;
				unitConverterArr["cup"]["lt"] = 0.2365882365;
				unitConverterArr["cup"]["ang3"] = 2.365882365E+026;
				unitConverterArr["cup"]["ang^3"] = 2.365882365E+026;
				unitConverterArr["cup"]["barrel"] = 0.00148809523809524;
				unitConverterArr["cup"]["bushel"] = 0.00671380397422004;
				unitConverterArr["cup"]["ft3"] = 0.00835503472222222;
				unitConverterArr["cup"]["ft^3"] = 0.00835503472222222;

				unitConverterArr["cup"]["in3"] = 14.4375;
				unitConverterArr["cup"]["in^3"] = 14.4375;
				unitConverterArr["cup"]["ly3"] = 2.79413265431566E-052;
				unitConverterArr["cup"]["ly^3"] = 2.79413265431566E-052;
				unitConverterArr["cup"]["ang^3"] = 2.365882365E+026;
				unitConverterArr["cup"]["m3"] = 0.0002365882365;
				unitConverterArr["cup"]["m^3"] = 0.0002365882365;
				unitConverterArr["cup"]["mi3"] = 0.0000000000000567605364660388;
				unitConverterArr["cup"]["mi^3"] = 0.0000000000000567605364660388;

				unitConverterArr["cup"]["yd3"] = 0.000309445730452675;
				unitConverterArr["cup"]["yd^3"] = 0.000309445730452675;
				unitConverterArr["cup"]["Nmi3"] = 0.0000000000000372451905113865;
				unitConverterArr["cup"]["Nmi^3"] = 0.0000000000000372451905113865;
				//unitConverterArr["cup"]["Picapt3"] = ;
				//unitConverterArr["cup"]["Picapt^3"] = ;
				unitConverterArr["cup"]["Pica3"] = 5388768;
				unitConverterArr["cup"]["Pica^3"] = 5388768;
				unitConverterArr["cup"]["GRT"] = 0.0000835503549787945;
				unitConverterArr["cup"]["regton"] = 0.0000835503549787945;
				unitConverterArr["cup"]["MTON"] = 0.334201388888889;


				unitConverterArr["pt"] = {};

				unitConverterArr["pt"]["us_pt"] = 1;
				unitConverterArr["pt"]["uk_pt"] = 0.832674184628989;
				unitConverterArr["pt"]["qt"] = 0.5;
				unitConverterArr["pt"]["uk_qt"] = 0.416337092314494;
				unitConverterArr["pt"]["gal"] = 0.125;
				unitConverterArr["pt"]["uk_gal"] = 0.104084273078624;
				unitConverterArr["pt"]["l"] = 0.473176473;
				unitConverterArr["pt"]["L"] = 0.473176473;
				unitConverterArr["pt"]["lt"] = 0.473176473;
				unitConverterArr["pt"]["ang3"] = 4.73176473E+026;
				unitConverterArr["pt"]["ang^3"] = 4.73176473E+026;
				unitConverterArr["pt"]["barrel"] = 0.00297619047619048;
				unitConverterArr["pt"]["bushel"] = 0.0134276079484401;
				unitConverterArr["pt"]["ft3"] = 0.0167100694444444;
				unitConverterArr["pt"]["ft^3"] = 0.0167100694444444;

				unitConverterArr["pt"]["in3"] = 28.875;
				unitConverterArr["pt"]["in^3"] = 28.875;
				unitConverterArr["pt"]["ly3"] = 5.58826530863131E-052;
				unitConverterArr["pt"]["ly^3"] = 5.58826530863131E-052;
				unitConverterArr["pt"]["ang^3"] = 4.73176473E+026;
				unitConverterArr["pt"]["m3"] = 0.000473176473;
				unitConverterArr["pt"]["m^3"] = 0.000473176473;
				unitConverterArr["pt"]["mi3"] = 0.000000000000113521072932078;
				unitConverterArr["pt"]["mi^3"] = 0.000000000000113521072932078;

				unitConverterArr["pt"]["yd3"] = 0.00061889146090535;
				unitConverterArr["pt"]["yd^3"] = 0.00061889146090535;
				unitConverterArr["pt"]["Nmi3"] = 0.0000000000000744903810227731;
				unitConverterArr["pt"]["Nmi^3"] = 0.0000000000000744903810227731;
				//unitConverterArr["pt"]["Picapt3"] = ;
				//unitConverterArr["pt"]["Picapt^3"] = ;
				unitConverterArr["pt"]["Pica3"] = 10777536;
				unitConverterArr["pt"]["Pica^3"] = 10777536;
				unitConverterArr["pt"]["GRT"] = 0.000167100709957589;
				unitConverterArr["pt"]["regton"] = 0.000167100709957589;
				unitConverterArr["pt"]["MTON"] = 0.668402777777778;


				unitConverterArr["us_pt"] = {};

				unitConverterArr["us_pt"]["uk_pt"] = 0.832674184628989;
				unitConverterArr["us_pt"]["qt"] = 0.5;
				unitConverterArr["us_pt"]["uk_qt"] = 0.416337092314494;
				unitConverterArr["us_pt"]["gal"] = 0.125;
				unitConverterArr["us_pt"]["uk_gal"] = 0.104084273078624;
				unitConverterArr["us_pt"]["l"] = 0.473176473;
				unitConverterArr["us_pt"]["L"] = 0.473176473;
				unitConverterArr["us_pt"]["lt"] = 0.473176473;
				unitConverterArr["us_pt"]["ang3"] = 4.73176473E+026;
				unitConverterArr["us_pt"]["ang^3"] = 4.73176473E+026;
				unitConverterArr["us_pt"]["barrel"] = 0.00297619047619048;
				unitConverterArr["us_pt"]["bushel"] = 0.0134276079484401;
				unitConverterArr["us_pt"]["ft3"] = 0.0167100694444444;
				unitConverterArr["us_pt"]["ft^3"] = 0.0167100694444444;

				unitConverterArr["us_pt"]["in3"] = 28.875;
				unitConverterArr["us_pt"]["in^3"] = 28.875;
				unitConverterArr["us_pt"]["ly3"] = 5.58826530863131E-052;
				unitConverterArr["us_pt"]["ly^3"] = 5.58826530863131E-052;
				unitConverterArr["us_pt"]["ang^3"] = 4.73176473E+026;
				unitConverterArr["us_pt"]["m3"] = 0.000473176473;
				unitConverterArr["us_pt"]["m^3"] = 0.000473176473;
				unitConverterArr["us_pt"]["mi3"] = 0.000000000000113521072932078;
				unitConverterArr["us_pt"]["mi^3"] = 0.000000000000113521072932078;

				unitConverterArr["us_pt"]["yd3"] = 0.00061889146090535;
				unitConverterArr["us_pt"]["yd^3"] = 0.00061889146090535;
				unitConverterArr["us_pt"]["Nmi3"] = 0.0000000000000744903810227731;
				unitConverterArr["us_pt"]["Nmi^3"] = 0.0000000000000744903810227731;
				//unitConverterArr["us_pt"]["Picapt3"] = ;
				//unitConverterArr["us_pt"]["Picapt^3"] = ;
				unitConverterArr["us_pt"]["Pica3"] = 10777536;
				unitConverterArr["us_pt"]["Pica^3"] = 10777536;
				unitConverterArr["us_pt"]["GRT"] = 0.000167100709957589;
				unitConverterArr["us_pt"]["regton"] = 0.000167100709957589;
				unitConverterArr["us_pt"]["MTON"] = 0.668402777777778;


				unitConverterArr["uk_pt"] = {};

				unitConverterArr["uk_pt"]["qt"] = 0.600474962752427;
				unitConverterArr["uk_pt"]["uk_qt"] = 0.5;
				unitConverterArr["uk_pt"]["gal"] = 0.150118740688107;
				unitConverterArr["uk_pt"]["uk_gal"] = 0.125;
				unitConverterArr["uk_pt"]["l"] = 0.56826125;
				unitConverterArr["uk_pt"]["L"] = 0.56826125;
				unitConverterArr["uk_pt"]["lt"] = 0.56826125;
				unitConverterArr["uk_pt"]["ang3"] = 5.6826125E+026;
				unitConverterArr["uk_pt"]["ang^3"] = 5.6826125E+026;
				unitConverterArr["uk_pt"]["barrel"] = 0.00357425573066921;
				unitConverterArr["uk_pt"]["bushel"] = 0.0161258847653875;
				unitConverterArr["uk_pt"]["ft3"] = 0.0200679566544865;
				unitConverterArr["uk_pt"]["ft^3"] = 0.0200679566544865;

				unitConverterArr["uk_pt"]["in3"] = 34.6774290989527;
				unitConverterArr["uk_pt"]["in^3"] = 34.6774290989527;
				unitConverterArr["uk_pt"]["ly3"] = 6.71122680610214E-052;
				unitConverterArr["uk_pt"]["ly^3"] = 6.71122680610214E-052;
				unitConverterArr["uk_pt"]["ang^3"] = 5.6826125E+026;
				unitConverterArr["uk_pt"]["m3"] = 0.00056826125;
				unitConverterArr["uk_pt"]["m^3"] = 0.00056826125;
				unitConverterArr["uk_pt"]["mi3"] = 0.00000000000013633312408101;
				unitConverterArr["uk_pt"]["mi^3"] = 0.00000000000013633312408101;

				unitConverterArr["uk_pt"]["yd3"] = 0.000743257653869871;
				unitConverterArr["uk_pt"]["yd^3"] = 0.000743257653869871;
				unitConverterArr["uk_pt"]["Nmi3"] = 0.0000000000000894592175401276;
				unitConverterArr["uk_pt"]["Nmi^3"] = 0.0000000000000894592175401276;
				//unitConverterArr["uk_pt"]["Picapt3"] = ;
				//unitConverterArr["uk_pt"]["Picapt^3"] = ;
				unitConverterArr["uk_pt"]["Pica3"] = 12943281.0563259;
				unitConverterArr["uk_pt"]["Pica^3"] = 12943281.0563259;
				unitConverterArr["uk_pt"]["GRT"] = 0.000200679585175375;
				unitConverterArr["uk_pt"]["regton"] = 0.000200679585175375;
				unitConverterArr["uk_pt"]["MTON"] = 0.80271826617946;


				unitConverterArr["qt"] = {};

				unitConverterArr["qt"]["uk_qt"] = 0.832674184628989;
				unitConverterArr["qt"]["gal"] = 0.25;
				unitConverterArr["qt"]["uk_gal"] = 0.208168546157247;
				unitConverterArr["qt"]["l"] = 0.946352946;
				unitConverterArr["qt"]["L"] = 0.946352946;
				unitConverterArr["qt"]["lt"] = 0.946352946;
				unitConverterArr["qt"]["ang3"] = 9.46352946E+026;
				unitConverterArr["qt"]["ang^3"] = 9.46352946E+026;
				unitConverterArr["qt"]["barrel"] = 0.00595238095238095;
				unitConverterArr["qt"]["bushel"] = 0.0268552158968801;
				unitConverterArr["qt"]["ft3"] = 0.0334201388888889;
				unitConverterArr["qt"]["ft^3"] = 0.0334201388888889;

				unitConverterArr["qt"]["in3"] = 57.75;
				unitConverterArr["qt"]["in^3"] = 57.75;
				unitConverterArr["qt"]["ly3"] = 1.11765306172626E-051;
				unitConverterArr["qt"]["ly^3"] = 1.11765306172626E-051;
				unitConverterArr["qt"]["ang^3"] = 9.46352946E+026;
				unitConverterArr["qt"]["m3"] = 0.000946352946;
				unitConverterArr["qt"]["m^3"] = 0.000946352946;
				unitConverterArr["qt"]["mi3"] = 0.000000000000227042145864155;
				unitConverterArr["qt"]["mi^3"] = 0.000000000000227042145864155;

				unitConverterArr["qt"]["yd3"] = 0.0012377829218107;
				unitConverterArr["qt"]["yd^3"] = 0.0012377829218107;
				unitConverterArr["qt"]["Nmi3"] = 0.000000000000148980762045546;
				unitConverterArr["qt"]["Nmi^3"] = 0.000000000000148980762045546;
				//unitConverterArr["qt"]["Picapt3"] = ;
				//unitConverterArr["qt"]["Picapt^3"] = ;
				unitConverterArr["qt"]["Pica3"] = 21555072;
				unitConverterArr["qt"]["Pica^3"] = 21555072;
				unitConverterArr["qt"]["GRT"] = 0.000334201419915178;
				unitConverterArr["qt"]["regton"] = 0.000334201419915178;
				unitConverterArr["qt"]["MTON"] = 1.33680555555556;


				unitConverterArr["uk_qt"] = {};

				unitConverterArr["uk_qt"]["gal"] = 0.300237481376214;
				unitConverterArr["uk_qt"]["uk_gal"] = 0.25;
				unitConverterArr["uk_qt"]["l"] = 1.1365225;
				unitConverterArr["uk_qt"]["L"] = 1.1365225;
				unitConverterArr["uk_qt"]["lt"] = 1.1365225;
				unitConverterArr["uk_qt"]["ang3"] = 1.1365225E+027;
				unitConverterArr["uk_qt"]["ang^3"] = 1.1365225E+027;
				unitConverterArr["uk_qt"]["barrel"] = 0.00714851146133842;
				unitConverterArr["uk_qt"]["bushel"] = 0.032251769530775;
				unitConverterArr["uk_qt"]["ft3"] = 0.040135913308973;
				unitConverterArr["uk_qt"]["ft^3"] = 0.040135913308973;

				unitConverterArr["uk_qt"]["in3"] = 69.3548581979054;
				unitConverterArr["uk_qt"]["in^3"] = 69.3548581979054;
				unitConverterArr["uk_qt"]["ly3"] = 1.34224536122043E-051;
				unitConverterArr["uk_qt"]["ly^3"] = 1.34224536122043E-051;
				unitConverterArr["uk_qt"]["ang^3"] = 1.1365225E+027;
				unitConverterArr["uk_qt"]["m3"] = 0.0011365225;
				unitConverterArr["uk_qt"]["m^3"] = 0.0011365225;
				unitConverterArr["uk_qt"]["mi3"] = 0.000000000000272666248162019;
				unitConverterArr["uk_qt"]["mi^3"] = 0.000000000000272666248162019;

				unitConverterArr["uk_qt"]["yd3"] = 0.00148651530773974;
				unitConverterArr["uk_qt"]["yd^3"] = 0.00148651530773974;
				unitConverterArr["uk_qt"]["Nmi3"] = 0.000000000000178918435080255;
				unitConverterArr["uk_qt"]["Nmi^3"] = 0.000000000000178918435080255;
				//unitConverterArr["uk_qt"]["Picapt3"] = ;
				//unitConverterArr["uk_qt"]["Picapt^3"] = ;
				unitConverterArr["uk_qt"]["Pica3"] = 25886562.1126518;
				unitConverterArr["uk_qt"]["Pica^3"] = 25886562.1126518;
				unitConverterArr["uk_qt"]["GRT"] = 0.00040135917035075;
				unitConverterArr["uk_qt"]["regton"] = 0.00040135917035075;
				unitConverterArr["uk_qt"]["MTON"] = 1.60543653235892;


				unitConverterArr["gal"] = {};

				unitConverterArr["gal"]["uk_gal"] = 0.832674184628989;
				unitConverterArr["gal"]["l"] = 3.785411784;
				unitConverterArr["gal"]["L"] = 3.785411784;
				unitConverterArr["gal"]["lt"] = 3.785411784;
				unitConverterArr["gal"]["ang3"] = 3.785411784E+027;
				unitConverterArr["gal"]["ang^3"] = 3.785411784E+027;
				unitConverterArr["gal"]["barrel"] = 0.0238095238095238;
				unitConverterArr["gal"]["bushel"] = 0.107420863587521;
				unitConverterArr["gal"]["ft3"] = 0.133680555555556;
				unitConverterArr["gal"]["ft^3"] = 0.133680555555556;

				unitConverterArr["gal"]["in3"] = 231;
				unitConverterArr["gal"]["in^3"] = 231;
				unitConverterArr["gal"]["ly3"] = 4.47061224690505E-051;
				unitConverterArr["gal"]["ly^3"] = 4.47061224690505E-051;
				unitConverterArr["gal"]["ang^3"] = 3.785411784E+027;
				unitConverterArr["gal"]["m3"] = 0.003785411784;
				unitConverterArr["gal"]["m^3"] = 0.003785411784;
				unitConverterArr["gal"]["mi3"] = 0.00000000000090816858345662;
				unitConverterArr["gal"]["mi^3"] = 0.00000000000090816858345662;

				unitConverterArr["gal"]["yd3"] = 0.0049511316872428;
				unitConverterArr["gal"]["yd^3"] = 0.0049511316872428;
				unitConverterArr["gal"]["Nmi3"] = 0.000000000000595923048182185;
				unitConverterArr["gal"]["Nmi^3"] = 0.000000000000595923048182185;
				//unitConverterArr["gal"]["Picapt3"] = ;
				//unitConverterArr["gal"]["Picapt^3"] = ;
				unitConverterArr["gal"]["Pica3"] = 86220288;
				unitConverterArr["gal"]["Pica^3"] = 86220288;
				unitConverterArr["gal"]["GRT"] = 0.00133680567966071;
				unitConverterArr["gal"]["regton"] = 0.00133680567966071;
				unitConverterArr["gal"]["MTON"] = 5.34722222222222;


				unitConverterArr["uk_gal"] = {};

				unitConverterArr["uk_gal"]["l"] = 4.54609;
				unitConverterArr["uk_gal"]["L"] = 4.54609;
				unitConverterArr["uk_gal"]["lt"] = 4.54609;
				unitConverterArr["uk_gal"]["ang3"] = 4.54609E+027;
				unitConverterArr["uk_gal"]["ang^3"] = 4.54609E+027;
				unitConverterArr["uk_gal"]["barrel"] = 0.0285940458453537;
				unitConverterArr["uk_gal"]["bushel"] = 0.1290070781231;
				unitConverterArr["uk_gal"]["ft3"] = 0.160543653235892;
				unitConverterArr["uk_gal"]["ft^3"] = 0.160543653235892;

				unitConverterArr["uk_gal"]["in3"] = 277.419432791621;
				unitConverterArr["uk_gal"]["in^3"] = 277.419432791621;
				unitConverterArr["uk_gal"]["ly3"] = 5.36898144488171E-051;
				unitConverterArr["uk_gal"]["ly^3"] = 5.36898144488171E-051;
				unitConverterArr["uk_gal"]["ang^3"] = 4.54609E+027;
				unitConverterArr["uk_gal"]["m3"] = 0.00454609;
				unitConverterArr["uk_gal"]["m^3"] = 0.00454609;
				unitConverterArr["uk_gal"]["mi3"] = 0.00000000000109066499264808;
				unitConverterArr["uk_gal"]["mi^3"] = 0.00000000000109066499264808;

				unitConverterArr["uk_gal"]["yd3"] = 0.00594606123095897;
				unitConverterArr["uk_gal"]["yd^3"] = 0.00594606123095897;
				unitConverterArr["uk_gal"]["Nmi3"] = 0.000000000000715673740321021;
				unitConverterArr["uk_gal"]["Nmi^3"] = 0.000000000000715673740321021;
				//unitConverterArr["uk_gal"]["Picapt3"] = ;
				//unitConverterArr["uk_gal"]["Picapt^3"] = ;
				unitConverterArr["uk_gal"]["Pica3"] = 103546248.450607;
				unitConverterArr["uk_gal"]["Pica^3"] = 103546248.450607;
				unitConverterArr["uk_gal"]["GRT"] = 0.001605436681403;
				unitConverterArr["uk_gal"]["regton"] = 0.001605436681403;
				unitConverterArr["uk_gal"]["MTON"] = 6.42174612943568;


				unitConverterArr["l"] = {};

				unitConverterArr["l"]["L"] = 1;
				unitConverterArr["l"]["lt"] = 1;
				unitConverterArr["l"]["ang3"] = 1E+027;
				unitConverterArr["l"]["ang^3"] = 1E+027;
				unitConverterArr["l"]["barrel"] = 0.00628981077043211;
				unitConverterArr["l"]["bushel"] = 0.02837759;
				unitConverterArr["l"]["ft3"] = 0.0353146667214886;
				unitConverterArr["l"]["ft^3"] = 0.0353146667214886;

				unitConverterArr["l"]["in3"] = 61.0237440947323;
				unitConverterArr["l"]["in^3"] = 61.0237440947323;
				unitConverterArr["l"]["ly3"] = 1.18101081256238E-051;
				unitConverterArr["l"]["ly^3"] = 1.18101081256238E-051;
				unitConverterArr["l"]["ang^3"] = 1E+027;
				unitConverterArr["l"]["m3"] = 0.001;
				unitConverterArr["l"]["m^3"] = 0.001;
				unitConverterArr["l"]["mi3"] = 0.000000000000239912758578928;
				unitConverterArr["l"]["mi^3"] = 0.000000000000239912758578928;

				unitConverterArr["l"]["yd3"] = 0.00130795061931439;
				unitConverterArr["l"]["yd^3"] = 0.00130795061931439;
				unitConverterArr["l"]["Nmi3"] = 0.000000000000157426214685811;
				unitConverterArr["l"]["Nmi^3"] = 0.000000000000157426214685811;
				//unitConverterArr["l"]["Picapt3"] = ;
				//unitConverterArr["l"]["Picapt^3"] = ;
				unitConverterArr["l"]["Pica3"] = 22776990.4358706;
				unitConverterArr["l"]["Pica^3"] = 22776990.4358706;
				unitConverterArr["l"]["GRT"] = 0.0003531467;
				unitConverterArr["l"]["regton"] = 0.0003531467;
				unitConverterArr["l"]["MTON"] = 1.41258666885954;


				unitConverterArr["L"] = {};

				unitConverterArr["L"]["lt"] = 1;
				unitConverterArr["L"]["ang3"] = 1E+027;
				unitConverterArr["L"]["ang^3"] = 1E+027;
				unitConverterArr["L"]["barrel"] = 0.00628981077043211;
				unitConverterArr["L"]["bushel"] = 0.02837759;
				unitConverterArr["L"]["ft3"] = 0.0353146667214886;
				unitConverterArr["L"]["ft^3"] = 0.0353146667214886;

				unitConverterArr["L"]["in3"] = 61.0237440947323;
				unitConverterArr["L"]["in^3"] = 61.0237440947323;
				unitConverterArr["L"]["ly3"] = 1.18101081256238E-051;
				unitConverterArr["L"]["ly^3"] = 1.18101081256238E-051;
				unitConverterArr["L"]["ang^3"] = 1E+027;
				unitConverterArr["L"]["m3"] = 0.001;
				unitConverterArr["L"]["m^3"] = 0.001;
				unitConverterArr["L"]["mi3"] = 0.000000000000239912758578928;
				unitConverterArr["L"]["mi^3"] = 0.000000000000239912758578928;

				unitConverterArr["L"]["yd3"] = 0.00130795061931439;
				unitConverterArr["L"]["yd^3"] = 0.00130795061931439;
				unitConverterArr["L"]["Nmi3"] = 0.000000000000157426214685811;
				unitConverterArr["L"]["Nmi^3"] = 0.000000000000157426214685811;
				//unitConverterArr["L"]["Picapt3"] = ;
				//unitConverterArr["L"]["Picapt^3"] = ;
				unitConverterArr["L"]["Pica3"] = 22776990.4358706;
				unitConverterArr["L"]["Pica^3"] = 22776990.4358706;
				unitConverterArr["L"]["GRT"] = 0.0003531467;
				unitConverterArr["L"]["regton"] = 0.0003531467;
				unitConverterArr["L"]["MTON"] = 1.41258666885954;


				unitConverterArr["lt"] = {};

				unitConverterArr["lt"]["ang3"] = 1E+027;
				unitConverterArr["lt"]["ang^3"] = 1E+027;
				unitConverterArr["lt"]["barrel"] = 0.00628981077043211;
				unitConverterArr["lt"]["bushel"] = 0.02837759;
				unitConverterArr["lt"]["ft3"] = 0.0353146667214886;
				unitConverterArr["lt"]["ft^3"] = 0.0353146667214886;

				unitConverterArr["lt"]["in3"] = 61.0237440947323;
				unitConverterArr["lt"]["in^3"] = 61.0237440947323;
				unitConverterArr["lt"]["ly3"] = 1.18101081256238E-051;
				unitConverterArr["lt"]["ly^3"] = 1.18101081256238E-051;
				unitConverterArr["lt"]["ang^3"] = 1E+027;
				unitConverterArr["lt"]["m3"] = 0.001;
				unitConverterArr["lt"]["m^3"] = 0.001;
				unitConverterArr["lt"]["mi3"] = 0.000000000000239912758578928;
				unitConverterArr["lt"]["mi^3"] = 0.000000000000239912758578928;

				unitConverterArr["lt"]["yd3"] = 0.00130795061931439;
				unitConverterArr["lt"]["yd^3"] = 0.00130795061931439;
				unitConverterArr["lt"]["Nmi3"] = 0.000000000000157426214685811;
				unitConverterArr["lt"]["Nmi^3"] = 0.000000000000157426214685811;
				//unitConverterArr["lt"]["Picapt3"] = ;
				//unitConverterArr["lt"]["Picapt^3"] = ;
				unitConverterArr["lt"]["Pica3"] = 22776990.4358706;
				unitConverterArr["lt"]["Pica^3"] = 22776990.4358706;
				unitConverterArr["lt"]["GRT"] = 0.0003531467;
				unitConverterArr["lt"]["regton"] = 0.0003531467;
				unitConverterArr["lt"]["MTON"] = 1.41258666885954;


				unitConverterArr["ang3"] = {};

				unitConverterArr["ang3"]["ang^3"] = 1;
				unitConverterArr["ang3"]["barrel"] = 6.28981077043211E-030;
				unitConverterArr["ang3"]["bushel"] = 2.837759E-029;
				unitConverterArr["ang3"]["ft3"] = 3.53146667214886E-029;
				unitConverterArr["ang3"]["ft^3"] = 3.53146667214886E-029;

				unitConverterArr["ang3"]["in3"] = 6.10237440947323E-026;
				unitConverterArr["ang3"]["in^3"] = 6.10237440947323E-026;
				unitConverterArr["ang3"]["ly3"] = 1.18101081256238E-078;
				unitConverterArr["ang3"]["ly^3"] = 1.18101081256238E-078;
				unitConverterArr["ang3"]["ang^3"] = 1;
				unitConverterArr["ang3"]["m3"] = 1E-030;
				unitConverterArr["ang3"]["m^3"] = 1E-030;
				unitConverterArr["ang3"]["mi3"] = 2.39912758578928E-040;
				unitConverterArr["ang3"]["mi^3"] = 2.39912758578928E-040;

				unitConverterArr["ang3"]["yd3"] = 1.30795061931439E-030;
				unitConverterArr["ang3"]["yd^3"] = 1.30795061931439E-030;
				unitConverterArr["ang3"]["Nmi3"] = 1.57426214685812E-040;
				unitConverterArr["ang3"]["Nmi^3"] = 1.57426214685812E-040;
				//unitConverterArr["ang3"]["Picapt3"] = ;
				//unitConverterArr["ang3"]["Picapt^3"] = ;
				unitConverterArr["ang3"]["Pica3"] = 2.27769904358706E-020;
				unitConverterArr["ang3"]["Pica^3"] = 2.27769904358706E-020;
				unitConverterArr["ang3"]["GRT"] = 3.531467E-031;
				unitConverterArr["ang3"]["regton"] = 3.531467E-031;
				unitConverterArr["ang3"]["MTON"] = 1.41258666885954E-027;


				unitConverterArr["ang^3"] = {};

				unitConverterArr["ang^3"]["barrel"] = 6.28981077043211E-030;
				unitConverterArr["ang^3"]["bushel"] = 2.837759E-029;
				unitConverterArr["ang^3"]["ft3"] = 3.53146667214886E-029;
				unitConverterArr["ang^3"]["ft^3"] = 3.53146667214886E-029;

				unitConverterArr["ang^3"]["in3"] = 6.10237440947323E-026;
				unitConverterArr["ang^3"]["in^3"] = 6.10237440947323E-026;
				unitConverterArr["ang^3"]["ly3"] = 1.18101081256238E-078;
				unitConverterArr["ang^3"]["ly^3"] = 1.18101081256238E-078;
				unitConverterArr["ang^3"]["ang^3"] = 1;
				unitConverterArr["ang^3"]["m3"] = 1E-030;
				unitConverterArr["ang^3"]["m^3"] = 1E-030;
				unitConverterArr["ang^3"]["mi3"] = 2.39912758578928E-040;
				unitConverterArr["ang^3"]["mi^3"] = 2.39912758578928E-040;

				unitConverterArr["ang^3"]["yd3"] = 1.30795061931439E-030;
				unitConverterArr["ang^3"]["yd^3"] = 1.30795061931439E-030;
				unitConverterArr["ang^3"]["Nmi3"] = 1.57426214685812E-040;
				unitConverterArr["ang^3"]["Nmi^3"] = 1.57426214685812E-040;
				//unitConverterArr["ang^3"]["Picapt3"] = ;
				//unitConverterArr["ang^3"]["Picapt^3"] = ;
				unitConverterArr["ang^3"]["Pica3"] = 2.27769904358706E-020;
				unitConverterArr["ang^3"]["Pica^3"] = 2.27769904358706E-020;
				unitConverterArr["ang^3"]["GRT"] = 3.531467E-031;
				unitConverterArr["ang^3"]["regton"] = 3.531467E-031;
				unitConverterArr["ang^3"]["MTON"] = 1.41258666885954E-027;


				unitConverterArr["ang^3"] = {};

				unitConverterArr["ang^3"]["barrel"] = 6.28981077043211E-030;
				unitConverterArr["ang^3"]["bushel"] = 2.837759E-029;
				unitConverterArr["ang^3"]["ft3"] = 3.53146667214886E-029;
				unitConverterArr["ang^3"]["ft^3"] = 3.53146667214886E-029;

				unitConverterArr["ang^3"]["in3"] = 6.10237440947323E-026;
				unitConverterArr["ang^3"]["in^3"] = 6.10237440947323E-026;
				unitConverterArr["ang^3"]["ly3"] = 1.18101081256238E-078;
				unitConverterArr["ang^3"]["ly^3"] = 1.18101081256238E-078;
				unitConverterArr["ang^3"]["ang^3"] = 1;
				unitConverterArr["ang^3"]["m3"] = 1E-030;
				unitConverterArr["ang^3"]["m^3"] = 1E-030;
				unitConverterArr["ang^3"]["mi3"] = 2.39912758578928E-040;
				unitConverterArr["ang^3"]["mi^3"] = 2.39912758578928E-040;

				unitConverterArr["ang^3"]["yd3"] = 1.30795061931439E-030;
				unitConverterArr["ang^3"]["yd^3"] = 1.30795061931439E-030;
				unitConverterArr["ang^3"]["Nmi3"] = 1.57426214685812E-040;
				unitConverterArr["ang^3"]["Nmi^3"] = 1.57426214685812E-040;
				//unitConverterArr["ang^3"]["Picapt3"] = ;
				//unitConverterArr["ang^3"]["Picapt^3"] = ;
				unitConverterArr["ang^3"]["Pica3"] = 2.27769904358706E-020;
				unitConverterArr["ang^3"]["Pica^3"] = 2.27769904358706E-020;
				unitConverterArr["ang^3"]["GRT"] = 3.531467E-031;
				unitConverterArr["ang^3"]["regton"] = 3.531467E-031;
				unitConverterArr["ang^3"]["MTON"] = 1.41258666885954E-027;


				unitConverterArr["barrel"] = {};

				unitConverterArr["barrel"]["bushel"] = 4.51167627067586;
				unitConverterArr["barrel"]["ft3"] = 5.61458333333333;
				unitConverterArr["barrel"]["ft^3"] = 5.61458333333333;

				unitConverterArr["barrel"]["in3"] = 9702;
				unitConverterArr["barrel"]["in^3"] = 9702;
				unitConverterArr["barrel"]["ly3"] = 1.87765714370012E-049;
				unitConverterArr["barrel"]["ly^3"] = 1.87765714370012E-049;
				unitConverterArr["barrel"]["barrel"] = 1;
				unitConverterArr["barrel"]["m3"] = 0.158987294928;
				unitConverterArr["barrel"]["m^3"] = 0.158987294928;
				unitConverterArr["barrel"]["mi3"] = 0.000000000038143080505178;
				unitConverterArr["barrel"]["mi^3"] = 0.000000000038143080505178;

				unitConverterArr["barrel"]["yd3"] = 0.207947530864197;
				unitConverterArr["barrel"]["yd^3"] = 0.207947530864197;
				unitConverterArr["barrel"]["Nmi3"] = 0.0000000000250287680236518;
				unitConverterArr["barrel"]["Nmi^3"] = 0.0000000000250287680236518;
				//unitConverterArr["barrel"]["Picapt3"] = ;
				//unitConverterArr["barrel"]["Picapt^3"] = ;
				unitConverterArr["barrel"]["Pica3"] = 3621252096;
				unitConverterArr["barrel"]["Pica^3"] = 3621252096;
				unitConverterArr["barrel"]["GRT"] = 0.0561458385457499;
				unitConverterArr["barrel"]["regton"] = 0.0561458385457499;
				unitConverterArr["barrel"]["MTON"] = 224.583333333333;


				unitConverterArr["bushel"] = {};

				unitConverterArr["bushel"]["ft3"] = 1.24445616141077;
				unitConverterArr["bushel"]["ft^3"] = 1.24445616141077;

				unitConverterArr["bushel"]["in3"] = 2150.42024691781;
				unitConverterArr["bushel"]["in^3"] = 2150.42024691781;
				unitConverterArr["bushel"]["ly3"] = 4.1617727670404E-050;
				unitConverterArr["bushel"]["ly^3"] = 4.1617727670404E-050;
				unitConverterArr["bushel"]["bushel"] = 1;
				unitConverterArr["bushel"]["m3"] = 0.0352390742131379;
				unitConverterArr["bushel"]["m^3"] = 0.0352390742131379;
				unitConverterArr["bushel"]["mi3"] = 0.00000000000845430350424147;
				unitConverterArr["bushel"]["mi^3"] = 0.00000000000845430350424147;

				unitConverterArr["bushel"]["yd3"] = 0.0460909689411396;
				unitConverterArr["bushel"]["yd^3"] = 0.0460909689411396;
				unitConverterArr["bushel"]["Nmi3"] = 0.00000000000554755406240669;
				unitConverterArr["bushel"]["Nmi^3"] = 0.00000000000554755406240669;
				//unitConverterArr["bushel"]["Picapt3"] = ;
				//unitConverterArr["bushel"]["Picapt^3"] = ;
				unitConverterArr["bushel"]["Pica3"] = 802640056.321578;
				unitConverterArr["bushel"]["Pica^3"] = 802640056.321578;
				unitConverterArr["bushel"]["GRT"] = 0.0124445627694247;
				unitConverterArr["bushel"]["regton"] = 0.0124445627694247;
				unitConverterArr["bushel"]["MTON"] = 49.7782464564307;


				unitConverterArr["ft3"] = {};

				unitConverterArr["ft3"]["ft^3"] = 1;

				unitConverterArr["ft3"]["in3"] = 1728;
				unitConverterArr["ft3"]["in^3"] = 1728;
				unitConverterArr["ft3"]["ly3"] = 3.34425020028222E-050;
				unitConverterArr["ft3"]["ly^3"] = 3.34425020028222E-050;
				unitConverterArr["ft3"]["ft3"] = 1;
				unitConverterArr["ft3"]["m3"] = 0.028316846592;
				unitConverterArr["ft3"]["m^3"] = 0.028316846592;
				unitConverterArr["ft3"]["mi3"] = 0.00000000000679357278014303;
				unitConverterArr["ft3"]["mi^3"] = 0.00000000000679357278014303;

				unitConverterArr["ft3"]["yd3"] = 0.037037037037037;
				unitConverterArr["ft3"]["yd^3"] = 0.037037037037037;
				unitConverterArr["ft3"]["Nmi3"] = 0.00000000000445781397081738;
				unitConverterArr["ft3"]["Nmi^3"] = 0.00000000000445781397081738;
				//unitConverterArr["ft3"]["Picapt3"] = ;
				//unitConverterArr["ft3"]["Picapt^3"] = ;
				unitConverterArr["ft3"]["Pica3"] = 644972544;
				unitConverterArr["ft3"]["Pica^3"] = 644972544;
				unitConverterArr["ft3"]["GRT"] = 0.010000000928371;
				unitConverterArr["ft3"]["regton"] = 0.010000000928371;
				unitConverterArr["ft3"]["MTON"] = 40;


				unitConverterArr["ft^3"] = {};

				unitConverterArr["ft^3"]["in3"] = 1728;
				unitConverterArr["ft^3"]["in^3"] = 1728;
				unitConverterArr["ft^3"]["ly3"] = 3.34425020028222E-050;
				unitConverterArr["ft^3"]["ly^3"] = 3.34425020028222E-050;
				unitConverterArr["ft^3"]["ft^3"] = 1;
				unitConverterArr["ft^3"]["m3"] = 0.028316846592;
				unitConverterArr["ft^3"]["m^3"] = 0.028316846592;
				unitConverterArr["ft^3"]["mi3"] = 0.00000000000679357278014303;
				unitConverterArr["ft^3"]["mi^3"] = 0.00000000000679357278014303;

				unitConverterArr["ft^3"]["yd3"] = 0.037037037037037;
				unitConverterArr["ft^3"]["yd^3"] = 0.037037037037037;
				unitConverterArr["ft^3"]["Nmi3"] = 0.00000000000445781397081738;
				unitConverterArr["ft^3"]["Nmi^3"] = 0.00000000000445781397081738;
				//unitConverterArr["ft^3"]["Picapt3"] = ;
				//unitConverterArr["ft^3"]["Picapt^3"] = ;
				unitConverterArr["ft^3"]["Pica3"] = 644972544;
				unitConverterArr["ft^3"]["Pica^3"] = 644972544;
				unitConverterArr["ft^3"]["GRT"] = 0.010000000928371;
				unitConverterArr["ft^3"]["regton"] = 0.010000000928371;
				unitConverterArr["ft^3"]["MTON"] = 40;


				unitConverterArr["in3"] = {};

				unitConverterArr["in3"]["in^3"] = 1;
				unitConverterArr["in3"]["ly3"] = 1.93532997701517E-053;
				unitConverterArr["in3"]["ly^3"] = 1.93532997701517E-053;
				unitConverterArr["in3"]["in3"] = 1;
				unitConverterArr["in3"]["m3"] = 0.000016387064;
				unitConverterArr["in3"]["m^3"] = 0.000016387064;
				unitConverterArr["in3"]["mi3"] = 3.93146572924944E-015;
				unitConverterArr["in3"]["mi^3"] = 3.93146572924944E-015;

				unitConverterArr["in3"]["yd3"] = 0.0000214334705075446;
				unitConverterArr["in3"]["yd^3"] = 0.0000214334705075446;
				unitConverterArr["in3"]["Nmi3"] = 2.57975345533413E-015;
				unitConverterArr["in3"]["Nmi^3"] = 2.57975345533413E-015;
				//unitConverterArr["in3"]["Picapt3"] = ;
				//unitConverterArr["in3"]["Picapt^3"] = ;
				unitConverterArr["in3"]["Pica3"] = 373248;
				unitConverterArr["in3"]["Pica^3"] = 373248;
				unitConverterArr["in3"]["GRT"] = 0.0000057870375742888;
				unitConverterArr["in3"]["regton"] = 0.0000057870375742888;
				unitConverterArr["in3"]["MTON"] = 0.0231481481481481;


				unitConverterArr["in^3"] = {};

				unitConverterArr["in^3"]["ly3"] = 1.93532997701517E-053;
				unitConverterArr["in^3"]["ly^3"] = 1.93532997701517E-053;
				unitConverterArr["in^3"]["in^3"] = 1;
				unitConverterArr["in^3"]["m3"] = 0.000016387064;
				unitConverterArr["in^3"]["m^3"] = 0.000016387064;
				unitConverterArr["in^3"]["mi3"] = 3.93146572924944E-015;
				unitConverterArr["in^3"]["mi^3"] = 3.93146572924944E-015;
				//picapt
				unitConverterArr["in^3"]["yd3"] = 0.0000214334705075446;
				unitConverterArr["in^3"]["yd^3"] = 0.0000214334705075446;
				unitConverterArr["in^3"]["Nmi3"] = 2.57975345533413E-015;
				unitConverterArr["in^3"]["Nmi^3"] = 2.57975345533413E-015;

				unitConverterArr["in^3"]["Pica3"] = 373248;
				unitConverterArr["in^3"]["Pica^3"] = 373248;
				unitConverterArr["in^3"]["GRT"] = 0.0000057870375742888;
				unitConverterArr["in^3"]["regton"] = 0.0000057870375742888;
				unitConverterArr["in^3"]["MTON"] = 0.0231481481481481;


				unitConverterArr["ly3"] = {};

				unitConverterArr["ly3"]["ly^3"] = 1;
				unitConverterArr["ly3"]["ly3"] = 1;
				unitConverterArr["ly3"]["m3"] = 8.46732298606437E+047;
				unitConverterArr["ly3"]["m^3"] = 8.46732298606437E+047;
				unitConverterArr["ly3"]["mi3"] = 2.03141881536547E+038;
				unitConverterArr["ly3"]["mi^3"] = 2.03141881536547E+038;

				unitConverterArr["ly3"]["yd3"] = 1.10748403435579E+048;
				unitConverterArr["ly3"]["yd^3"] = 1.10748403435579E+048;
				unitConverterArr["ly3"]["Nmi3"] = 1.33297860621828E+038;
				unitConverterArr["ly3"]["Nmi^3"] = 1.33297860621828E+038;
				//unitConverterArr["ly3"]["Picapt3"] = ;
				//unitConverterArr["ly3"]["Picapt^3"] = ;
				unitConverterArr["ly3"]["Pica3"] = 1.92860134671016E+058;
				unitConverterArr["ly3"]["Pica^3"] = 1.92860134671016E+058;
				unitConverterArr["ly3"]["GRT"] = 2.99020717036278E+047;
				unitConverterArr["ly3"]["regton"] = 2.99020717036278E+047;
				unitConverterArr["ly3"]["MTON"] = 1.19608275710425E+051;


				unitConverterArr["ly^3"] = {};

				unitConverterArr["ly^3"]["m3"] = 8.46732298606437E+047;
				unitConverterArr["ly^3"]["m^3"] = 8.46732298606437E+047;
				unitConverterArr["ly^3"]["mi3"] = 2.03141881536547E+038;
				unitConverterArr["ly^3"]["mi^3"] = 2.03141881536547E+038;

				unitConverterArr["ly^3"]["yd3"] = 1.10748403435579E+048;
				unitConverterArr["ly^3"]["yd^3"] = 1.10748403435579E+048;
				unitConverterArr["ly^3"]["Nmi3"] = 1.33297860621828E+038;
				unitConverterArr["ly^3"]["Nmi^3"] = 1.33297860621828E+038;
				//unitConverterArr["ly^3"]["Picapt3"] = ;
				//unitConverterArr["ly^3"]["Picapt^3"] = ;
				unitConverterArr["ly^3"]["Pica3"] = 1.92860134671016E+058;
				unitConverterArr["ly^3"]["Pica^3"] = 1.92860134671016E+058;
				unitConverterArr["ly^3"]["GRT"] = 2.99020717036278E+047;
				unitConverterArr["ly^3"]["regton"] = 2.99020717036278E+047;
				unitConverterArr["ly^3"]["MTON"] = 1.19608275710425E+051;


				unitConverterArr["m3"] = {};

				unitConverterArr["m3"]["m^3"] = 1;
				unitConverterArr["m3"]["mi3"] = 0.000000000239912758578928;
				unitConverterArr["m3"]["mi^3"] = 0.000000000239912758578928;

				unitConverterArr["m3"]["yd3"] = 1.30795061931439;
				unitConverterArr["m3"]["yd^3"] = 1.30795061931439;
				unitConverterArr["m3"]["Nmi3"] = 0.000000000157426214685811;
				unitConverterArr["m3"]["Nmi^3"] = 0.000000000157426214685811;
				//unitConverterArr["m3"]["Picapt3"] = ;
				//unitConverterArr["m3"]["Picapt^3"] = ;
				unitConverterArr["m3"]["Pica3"] = 22776990435.8706;
				unitConverterArr["m3"]["Pica^3"] = 22776990435.8706;
				unitConverterArr["m3"]["GRT"] = 0.3531467;
				unitConverterArr["m3"]["regton"] = 0.3531467;
				unitConverterArr["m3"]["MTON"] = 1412.58666885954;


				unitConverterArr["m^3"] = {};

				unitConverterArr["m^3"]["mi3"] = 0.000000000239912758578928;
				unitConverterArr["m^3"]["mi^3"] = 0.000000000239912758578928;

				unitConverterArr["m^3"]["yd3"] = 1.30795061931439;
				unitConverterArr["m^3"]["yd^3"] = 1.30795061931439;
				unitConverterArr["m^3"]["Nmi3"] = 0.000000000157426214685811;
				unitConverterArr["m^3"]["Nmi^3"] = 0.000000000157426214685811;
				//unitConverterArr["m^3"]["Picapt3"] = ;
				//unitConverterArr["m^3"]["Picapt^3"] = ;
				unitConverterArr["m^3"]["Pica3"] = 22776990435.8706;
				unitConverterArr["m^3"]["Pica^3"] = 22776990435.8706;
				unitConverterArr["m^3"]["GRT"] = 0.3531467;
				unitConverterArr["m^3"]["regton"] = 0.3531467;
				unitConverterArr["m^3"]["MTON"] = 1412.58666885954;


				unitConverterArr["mi3"] = {};

				unitConverterArr["mi3"]["mi^3"] = 1;

				unitConverterArr["mi3"]["yd3"] = 5451776000;
				unitConverterArr["mi3"]["yd^3"] = 5451776000;
				unitConverterArr["mi3"]["Nmi3"] = 0.656181086901306;
				unitConverterArr["mi3"]["Nmi^3"] = 0.656181086901306;
				//unitConverterArr["mi3"]["Picapt3"] = ;
				//unitConverterArr["mi3"]["Picapt^3"] = ;
				unitConverterArr["mi3"]["Pica3"] = 9.49386375730299E+019;
				unitConverterArr["mi3"]["Pica^3"] = 9.49386375730299E+019;
				unitConverterArr["mi3"]["GRT"] = 1471979656.65432;
				unitConverterArr["mi3"]["regton"] = 1471979656.65432;
				unitConverterArr["mi3"]["MTON"] = 5887918080000;


				unitConverterArr["mi^3"] = {};

				unitConverterArr["mi3"]["yd3"] = 5451776000;
				unitConverterArr["mi3"]["yd^3"] = 5451776000;
				unitConverterArr["mi3"]["Nmi3"] = 0.656181086901306;
				unitConverterArr["mi3"]["Nmi^3"] = 0.656181086901306;
				//unitConverterArr["mi3"]["Picapt3"] = ;
				//unitConverterArr["mi3"]["Picapt^3"] = ;
				unitConverterArr["mi3"]["Pica3"] = 9.49386375730299E+019;
				unitConverterArr["mi3"]["Pica^3"] = 9.49386375730299E+019;
				unitConverterArr["mi3"]["GRT"] = 1471979656.65432;
				unitConverterArr["mi3"]["regton"] = 1471979656.65432;
				unitConverterArr["mi3"]["MTON"] = 5887918080000;


				unitConverterArr["yd3"] = {};

				unitConverterArr["yd3"]["yd^3"] = 1;
				unitConverterArr["yd3"]["Nmi3"] = 0.000000000120360977212069;
				unitConverterArr["yd3"]["Nmi^3"] = 0.000000000120360977212069;
				//unitConverterArr["yd3"]["Picapt3"] = ;
				//unitConverterArr["yd3"]["Picapt^3"] = ;
				unitConverterArr["yd3"]["Pica3"] = 17414258688;
				unitConverterArr["yd3"]["Pica^3"] = 17414258688;
				unitConverterArr["yd3"]["GRT"] = 0.270000025066018;
				unitConverterArr["yd3"]["regton"] = 0.270000025066018;
				unitConverterArr["yd3"]["MTON"] = 1080;


				unitConverterArr["yd^3"] = {};

				unitConverterArr["yd^3"]["Nmi3"] = 0.000000000120360977212069;
				unitConverterArr["yd^3"]["Nmi^3"] = 0.000000000120360977212069;
				//unitConverterArr["yd^3"]["Picapt3"] = ;
				//unitConverterArr["yd^3"]["Picapt^3"] = ;
				unitConverterArr["yd^3"]["Pica3"] = 17414258688;
				unitConverterArr["yd^3"]["Pica^3"] = 17414258688;
				unitConverterArr["yd^3"]["GRT"] = 0.270000025066018;
				unitConverterArr["yd^3"]["regton"] = 0.270000025066018;
				unitConverterArr["yd^3"]["MTON"] = 1080;


				unitConverterArr["Nmi3"] = {};

				unitConverterArr["Nmi3"]["Nmi^3"] = 1;
				//unitConverterArr["Nmi3"]["Picapt3"] = ;
				//unitConverterArr["Nmi3"]["Picapt^3"] = ;
				unitConverterArr["Nmi3"]["Pica3"] = 1.44683593398524E+020;
				unitConverterArr["Nmi3"]["Pica^3"] = 1.44683593398524E+020;
				unitConverterArr["Nmi3"]["GRT"] = 2243252184.55391;
				unitConverterArr["Nmi3"]["regton"] = 2243252184.55391;
				unitConverterArr["Nmi3"]["MTON"] = 8973007905187.58;


				unitConverterArr["Nmi^3"] = {};

				//unitConverterArr["Nmi^3"]["Picapt3"] = ;
				//unitConverterArr["Nmi^3"]["Picapt^3"] = ;
				unitConverterArr["Nmi^3"]["Pica3"] = 1.44683593398524E+020;
				unitConverterArr["Nmi^3"]["Pica^3"] = 1.44683593398524E+020;
				unitConverterArr["Nmi^3"]["GRT"] = 2243252184.55391;
				unitConverterArr["Nmi^3"]["regton"] = 2243252184.55391;
				unitConverterArr["Nmi^3"]["MTON"] = 8973007905187.58;


				/*unitConverterArr["Picapt3"] = {};

				unitConverterArr["Picapt3"]["Picapt^3"] = ;
				unitConverterArr["Picapt3"]["Pica3"] = ;
				unitConverterArr["Picapt3"]["Pica^3"] = ;
				unitConverterArr["Picapt3"]["GRT"] = ;
				unitConverterArr["Picapt3"]["regton"] = ;
				unitConverterArr["Picapt3"]["MTON"] = ;


				unitConverterArr["Picapt^3"] = {}; ;

				unitConverterArr["Picapt^3"]["Pica3"] = ;
				unitConverterArr["Picapt^3"]["Pica^3"] = ;
				unitConverterArr["Picapt^3"]["GRT"] = ;
				unitConverterArr["Picapt^3"]["regton"] = ;
				unitConverterArr["Picapt^3"]["MTON"] = ;*/


				unitConverterArr["Pica3"] = {};

				unitConverterArr["Pica3"]["Pica^3"] = 1;
				unitConverterArr["Pica3"]["GRT"] = 0.0000000000155045373968214;
				unitConverterArr["Pica3"]["regton"] = 0.0000000000155045373968214;
				unitConverterArr["Pica3"]["MTON"] = 0.0000000620181438297008;


				unitConverterArr["Pica^3"] = {};

				unitConverterArr["Pica^3"]["GRT"] = 0.0000000000155045373968214;
				unitConverterArr["Pica^3"]["regton"] = 0.0000000000155045373968214;
				unitConverterArr["Pica^3"]["MTON"] = 0.0000000620181438297008;


				unitConverterArr["GRT"] = {};

				unitConverterArr["GRT"]["regton"] = 1;
				unitConverterArr["GRT"]["MTON"] = 3999.99962865162;


				unitConverterArr["regton"] = {};

				unitConverterArr["regton"]["MTON"] = 3999.99962865162;

			};

			var generateArea = function(){

				unitConverterArr["uk_acre"] = {};//International acre

				//do not support Picapt2 & Picapt^2 by LO
				unitConverterArr["uk_acre"]["us_acre"] = 0.999996000004;
				unitConverterArr["uk_acre"]["ang2"] = 4.0468564224E+023;
				unitConverterArr["uk_acre"]["ang^2"] = 4.0468564224E+023;
				unitConverterArr["uk_acre"]["ar"] = 40.468564224;
				unitConverterArr["uk_acre"]["ft2"] = 43560;
				unitConverterArr["uk_acre"]["ft^2"] = 43560;
				unitConverterArr["uk_acre"]["ha"] = 0.40468564224;
				unitConverterArr["uk_acre"]["in2"] = 6272640;
				unitConverterArr["uk_acre"]["in^2"] = 6272640;
				unitConverterArr["uk_acre"]["ly2"] = 4.52154695871477E-029;
				unitConverterArr["uk_acre"]["ly^2"] = 4.52154695871477E-029;
				unitConverterArr["uk_acre"]["m2"] = 4046.8564224;
				unitConverterArr["uk_acre"]["m^2"] = 4046.8564224;
				unitConverterArr["uk_acre"]["Morgen"] = 1.61874256896;
				unitConverterArr["uk_acre"]["mi2"] = 0.0015625;
				unitConverterArr["uk_acre"]["mi^2"] = 0.0015625;
				unitConverterArr["uk_acre"]["Nmi2"] = 0.0011798745452934;
				unitConverterArr["uk_acre"]["Nmi^2"] = 0.0011798745452934;
				//unitConverterArr["uk_acre"]["Picapt2"] = ;
				unitConverterArr["uk_acre"]["Pica2"] = 32517365760;
				unitConverterArr["uk_acre"]["Pica^2"] = 32517365760;
				//unitConverterArr["uk_acre"]["Picapt^2"] = ;
				unitConverterArr["uk_acre"]["yd2"] = 4840;
				unitConverterArr["uk_acre"]["yd^2"] = 4840;


				unitConverterArr["us_acre"] = {};

				unitConverterArr["us_acre"]["ang2"] = 4.04687260987425E+023;
				unitConverterArr["us_acre"]["ang^2"] = 4.04687260987425E+023;
				unitConverterArr["us_acre"]["ar"] = 40.4687260987425;
				unitConverterArr["us_acre"]["ft2"] = 43560.1742405227;
				unitConverterArr["us_acre"]["ft^2"] = 43560.1742405227;
				unitConverterArr["us_acre"]["ha"] = 0.404687260987425;
				unitConverterArr["us_acre"]["in2"] = 6272665.09063527;
				unitConverterArr["us_acre"]["in^2"] = 6272665.09063527;
				unitConverterArr["us_acre"]["ly2"] = 4.52156504495687E-029;
				unitConverterArr["us_acre"]["ly^2"] = 4.52156504495687E-029;
				unitConverterArr["us_acre"]["m2"] = 4046.87260987425;
				unitConverterArr["us_acre"]["m^2"] = 4046.87260987425;
				unitConverterArr["us_acre"]["Morgen"] = 1.6187490439497;
				unitConverterArr["us_acre"]["mi2"] = 0.00156250625001875;
				unitConverterArr["us_acre"]["mi^2"] = 0.00156250625001875;
				unitConverterArr["us_acre"]["Nmi2"] = 0.00117987926480574;
				unitConverterArr["us_acre"]["Nmi^2"] = 0.00117987926480574;
				//unitConverterArr["us_acre"]["Picapt2"] = ;
				unitConverterArr["us_acre"]["Pica2"] = 32517495829.8532;
				unitConverterArr["us_acre"]["Pica^2"] = 32517495829.8532;
				//unitConverterArr["us_acre"]["Picapt^2"] = ;
				unitConverterArr["us_acre"]["yd2"] = 4840.01936005808;
				unitConverterArr["us_acre"]["yd^2"] = 4840.01936005808;


				unitConverterArr["ang2"] = {};

				unitConverterArr["ang2"]["ang^2"] = 1;
				unitConverterArr["ang2"]["ar"] = 1E-022;
				unitConverterArr["ang2"]["ft2"] = 1.07639104167097E-019;
				unitConverterArr["ang2"]["ft^2"] = 1.07639104167097E-019;
				unitConverterArr["ang2"]["ha"] = 1E-024;
				unitConverterArr["ang2"]["in2"] = 1.5500031000062E-017;
				unitConverterArr["ang2"]["in^2"] = 1.5500031000062E-017;
				unitConverterArr["ang2"]["ly2"] = 1.11729858605491E-052;
				unitConverterArr["ang2"]["ly^2"] = 1.11729858605491E-052;
				unitConverterArr["ang2"]["m2"] = 1E-020;
				unitConverterArr["ang2"]["m^2"] = 1E-020;
				unitConverterArr["ang2"]["Morgen"] = 4E-024;
				unitConverterArr["ang2"]["mi2"] = 3.86102158542446E-027;
				unitConverterArr["ang2"]["mi^2"] = 3.86102158542446E-027;
				unitConverterArr["ang2"]["Nmi2"] = 2.91553349598123E-027;
				unitConverterArr["ang2"]["Nmi^2"] = 2.91553349598123E-027;
				//unitConverterArr["ang2"]["Picapt2"] = ;
				unitConverterArr["ang2"]["Pica2"] = 0.0000000000000803521607043214;
				unitConverterArr["ang2"]["Pica^2"] = 0.0000000000000803521607043214;
				//unitConverterArr["ang2"]["Picapt^2"] = ;
				unitConverterArr["ang2"]["yd2"] = 1.19599004630108E-020;
				unitConverterArr["ang2"]["yd^2"] = 1.19599004630108E-020;


				unitConverterArr["ang^2"] = {};

				unitConverterArr["ang^2"]["ar"] = 1E-022;
				unitConverterArr["ang^2"]["ft2"] = 1.07639104167097E-019;
				unitConverterArr["ang^2"]["ft^2"] = 1.07639104167097E-019;
				unitConverterArr["ang^2"]["ha"] = 1E-024;
				unitConverterArr["ang^2"]["in2"] = 1.5500031000062E-017;
				unitConverterArr["ang^2"]["in^2"] = 1.5500031000062E-017;
				unitConverterArr["ang^2"]["ly2"] = 1.11729858605491E-052;
				unitConverterArr["ang^2"]["ly^2"] = 1.11729858605491E-052;
				unitConverterArr["ang^2"]["m2"] = 1E-020;
				unitConverterArr["ang^2"]["m^2"] = 1E-020;
				unitConverterArr["ang^2"]["Morgen"] = 4E-024;
				unitConverterArr["ang^2"]["mi2"] = 3.86102158542446E-027;
				unitConverterArr["ang^2"]["mi^2"] = 3.86102158542446E-027;
				unitConverterArr["ang^2"]["Nmi2"] = 2.91553349598123E-027;
				unitConverterArr["ang^2"]["Nmi^2"] = 2.91553349598123E-027;
				//unitConverterArr["ang^2"]["Picapt2"] = ;
				unitConverterArr["ang^2"]["Pica2"] = 0.0000000000000803521607043214;
				unitConverterArr["ang^2"]["Pica^2"] = 0.0000000000000803521607043214;
				//unitConverterArr["ang^2"]["Picapt^2"] = ;
				unitConverterArr["ang^2"]["yd2"] = 1.19599004630108E-020;
				unitConverterArr["ang^2"]["yd^2"] = 1.19599004630108E-020;


				unitConverterArr["ar"] = {};

				unitConverterArr["ar"]["ft2"] = 1076.39104167097;
				unitConverterArr["ar"]["ft^2"] = 1076.39104167097;
				unitConverterArr["ar"]["ha"] = 0.01;
				unitConverterArr["ar"]["in2"] = 155000.31000062;
				unitConverterArr["ar"]["in^2"] = 155000.31000062;
				unitConverterArr["ar"]["ly2"] = 1.11729858605491E-030;
				unitConverterArr["ar"]["ly^2"] = 1.11729858605491E-030;
				unitConverterArr["ar"]["m2"] = 100;
				unitConverterArr["ar"]["m^2"] = 100;
				unitConverterArr["ar"]["Morgen"] = 0.04;
				unitConverterArr["ar"]["mi2"] = 0.0000386102158542446;
				unitConverterArr["ar"]["mi^2"] = 0.0000386102158542446;
				unitConverterArr["ar"]["Nmi2"] = 0.0000291553349598123;
				unitConverterArr["ar"]["Nmi^2"] = 0.0000291553349598123;
				//unitConverterArr["ar"]["Picapt2"] = ;
				unitConverterArr["ar"]["Pica2"] = 803521607.043214;
				unitConverterArr["ar"]["Pica^2"] = 803521607.043214;
				//unitConverterArr["ar"]["Picapt^2"] = ;
				unitConverterArr["ar"]["yd2"] = 119.599004630108;
				unitConverterArr["ar"]["yd^2"] = 119.599004630108;


				unitConverterArr["ft2"] = {};

				unitConverterArr["ft2"]["ft^2"] = 1;
				unitConverterArr["ft2"]["ha"] = 0.000009290304;
				unitConverterArr["ft2"]["in2"] = 144;
				unitConverterArr["ft2"]["in^2"] = 144;
				unitConverterArr["ft2"]["ly2"] = 1.03800435232203E-033;
				unitConverterArr["ft2"]["ly^2"] = 1.03800435232203E-033;
				unitConverterArr["ft2"]["m2"] = 0.09290304;
				unitConverterArr["ft2"]["m^2"] = 0.09290304;
				unitConverterArr["ft2"]["Morgen"] = 0.000037161216;
				unitConverterArr["ft2"]["mi2"] = 0.0000000358700642791552;
				unitConverterArr["ft2"]["mi^2"] = 0.0000000358700642791552;
				unitConverterArr["ft2"]["Nmi2"] = 0.0000000270861924998484;
				unitConverterArr["ft2"]["Nmi^2"] = 0.0000000270861924998484;
				//unitConverterArr["ft2"]["Picapt2"] = ;
				unitConverterArr["ft2"]["Pica2"] = 746496;
				unitConverterArr["ft2"]["Pica^2"] = 746496;
				//unitConverterArr["ft2"]["Picapt^2"] = ;
				unitConverterArr["ft2"]["yd2"] = 0.111111111111111;
				unitConverterArr["ft2"]["yd^2"] = 0.111111111111111;


				unitConverterArr["ft^2"] = {};

				unitConverterArr["ft^2"]["ha"] = 0.000009290304;
				unitConverterArr["ft^2"]["in2"] = 144;
				unitConverterArr["ft^2"]["in^2"] = 144;
				unitConverterArr["ft^2"]["ly2"] = 1.03800435232203E-033;
				unitConverterArr["ft^2"]["ly^2"] = 1.03800435232203E-033;
				unitConverterArr["ft^2"]["m2"] = 0.09290304;
				unitConverterArr["ft^2"]["m^2"] = 0.09290304;
				unitConverterArr["ft^2"]["Morgen"] = 0.000037161216;
				unitConverterArr["ft^2"]["mi2"] = 0.0000000358700642791552;
				unitConverterArr["ft^2"]["mi^2"] = 0.0000000358700642791552;
				unitConverterArr["ft^2"]["Nmi2"] = 0.0000000270861924998484;
				unitConverterArr["ft^2"]["Nmi^2"] = 0.0000000270861924998484;
				//unitConverterArr["ft^2"]["Picapt2"] = ;
				unitConverterArr["ft^2"]["Pica2"] = 746496;
				unitConverterArr["ft^2"]["Pica^2"] = 746496;
				//unitConverterArr["ft^2"]["Picapt^2"] = ;
				unitConverterArr["ft^2"]["yd2"] = 0.111111111111111;
				unitConverterArr["ft^2"]["yd^2"] = 0.111111111111111;


				unitConverterArr["ha"] = {};

				unitConverterArr["ha"]["in2"] = 15500031.000062;
				unitConverterArr["ha"]["in^2"] = 15500031.000062;
				unitConverterArr["ha"]["ly2"] = 1.11729858605491E-028;
				unitConverterArr["ha"]["ly^2"] = 1.11729858605491E-028;
				unitConverterArr["ha"]["m2"] = 10000;
				unitConverterArr["ha"]["m^2"] = 10000;
				unitConverterArr["ha"]["Morgen"] = 4;
				unitConverterArr["ha"]["mi2"] = 0.00386102158542446;
				unitConverterArr["ha"]["mi^2"] = 0.00386102158542446;
				unitConverterArr["ha"]["Nmi2"] = 0.00291553349598123;
				unitConverterArr["ha"]["Nmi^2"] = 0.00291553349598123;
				//unitConverterArr["ha"]["Picapt2"] = ;
				unitConverterArr["ha"]["Pica2"] = 80352160704.3214;
				unitConverterArr["ha"]["Pica^2"] = 80352160704.3214;
				//unitConverterArr["ha"]["Picapt^2"] = ;
				unitConverterArr["ha"]["yd2"] = 11959.9004630108;
				unitConverterArr["ha"]["yd^2"] = 11959.9004630108;


				unitConverterArr["in2"] = {};

				unitConverterArr["in2"]["in^2"] = 1;
				unitConverterArr["in2"]["ly2"] = 7.20836355779189E-036;
				unitConverterArr["in2"]["ly^2"] = 7.20836355779189E-036;
				unitConverterArr["in2"]["m2"] = 0.00064516;
				unitConverterArr["in2"]["m^2"] = 0.00064516;
				unitConverterArr["in2"]["Morgen"] = 0.000000258064;
				unitConverterArr["in2"]["mi2"] = 0.000000000249097668605244;
				unitConverterArr["in2"]["mi^2"] = 0.000000000249097668605244;
				unitConverterArr["in2"]["Nmi2"] = 0.000000000188098559026725;
				unitConverterArr["in2"]["Nmi^2"] = 0.000000000188098559026725;
				//unitConverterArr["in2"]["Picapt2"] = ;
				unitConverterArr["in2"]["Pica2"] = 5184;
				unitConverterArr["in2"]["Pica^2"] = 5184;
				//unitConverterArr["in2"]["Picapt^2"] = ;
				unitConverterArr["in2"]["yd2"] = 0.000771604938271605;
				unitConverterArr["in2"]["yd^2"] = 0.000771604938271605;


				unitConverterArr["in^2"] = {};

				unitConverterArr["in^2"]["ly2"] = 7.20836355779189E-036;
				unitConverterArr["in^2"]["ly^2"] = 7.20836355779189E-036;
				unitConverterArr["in^2"]["m2"] = 0.00064516;
				unitConverterArr["in^2"]["m^2"] = 0.00064516;
				unitConverterArr["in^2"]["Morgen"] = 0.000000258064;
				unitConverterArr["in^2"]["mi2"] = 0.000000000249097668605244;
				unitConverterArr["in^2"]["mi^2"] = 0.000000000249097668605244;
				unitConverterArr["in^2"]["Nmi2"] = 0.000000000188098559026725;
				unitConverterArr["in^2"]["Nmi^2"] = 0.000000000188098559026725;
				//unitConverterArr["in^2"]["Picapt2"] = ;
				unitConverterArr["in^2"]["Pica2"] = 5184;
				unitConverterArr["in^2"]["Pica^2"] = 5184;
				//unitConverterArr["in^2"]["Picapt^2"] = ;
				unitConverterArr["in^2"]["yd2"] = 0.000771604938271605;
				unitConverterArr["in^2"]["yd^2"] = 0.000771604938271605;


				unitConverterArr["ly2"] = {};

				unitConverterArr["ly2"]["ly^2"] = 1;
				unitConverterArr["ly2"]["m2"] = 8.9501590038784E+031;
				unitConverterArr["ly2"]["m^2"] = 8.9501590038784E+031;
				unitConverterArr["ly2"]["Morgen"] = 3.58006360155136E+028;
				unitConverterArr["ly2"]["mi2"] = 3.45567571069556E+025;
				unitConverterArr["ly2"]["mi^2"] = 3.45567571069556E+025;
				unitConverterArr["ly2"]["Nmi2"] = 2.60944883701655E+025;
				unitConverterArr["ly2"]["Nmi^2"] = 2.60944883701655E+025;
				//unitConverterArr["ly2"]["Picapt2"] = ;
				unitConverterArr["ly2"]["Pica2"] = 7.19164614608866E+038;
				unitConverterArr["ly2"]["Pica^2"] = 7.19164614608866E+038;
				//unitConverterArr["ly2"]["Picapt^2"] = ;
				unitConverterArr["ly2"]["yd2"] = 1.07043010814506E+032;
				unitConverterArr["ly2"]["yd^2"] = 1.07043010814506E+032;


				unitConverterArr["ly^2"] = {};

				unitConverterArr["ly^2"]["m2"] = 8.9501590038784E+031;
				unitConverterArr["ly^2"]["m^2"] = 8.9501590038784E+031;
				unitConverterArr["ly^2"]["Morgen"] = 3.58006360155136E+028;
				unitConverterArr["ly^2"]["mi2"] = 3.45567571069556E+025;
				unitConverterArr["ly^2"]["mi^2"] = 3.45567571069556E+025;
				unitConverterArr["ly^2"]["Nmi2"] = 2.60944883701655E+025;
				unitConverterArr["ly^2"]["Nmi^2"] = 2.60944883701655E+025;
				//unitConverterArr["ly^2"]["Picapt2"] = ;
				unitConverterArr["ly^2"]["Pica2"] = 7.19164614608866E+038;
				unitConverterArr["ly^2"]["Pica^2"] = 7.19164614608866E+038;
				//unitConverterArr["ly^2"]["Picapt^2"] = ;
				unitConverterArr["ly^2"]["yd2"] = 1.07043010814506E+032;
				unitConverterArr["ly^2"]["yd^2"] = 1.07043010814506E+032;


				unitConverterArr["m2"] = {};

				unitConverterArr["m2"]["m^2"] = 1;
				unitConverterArr["m2"]["Morgen"] = 0.0004;
				unitConverterArr["m2"]["mi2"] = 0.000000386102158542446;
				unitConverterArr["m2"]["mi^2"] = 0.000000386102158542446;
				unitConverterArr["m2"]["Nmi2"] = 0.000000291553349598123;
				unitConverterArr["m2"]["Nmi^2"] = 0.000000291553349598123;
				//unitConverterArr["m2"]["Picapt2"] = ;
				unitConverterArr["m2"]["Pica2"] = 8035216.07043214;
				unitConverterArr["m2"]["Pica^2"] = 8035216.07043214;
				//unitConverterArr["m2"]["Picapt^2"] = ;
				unitConverterArr["m2"]["yd2"] = 1.19599004630108;
				unitConverterArr["m2"]["yd^2"] = 1.19599004630108;


				unitConverterArr["m^2"] = {};

				unitConverterArr["m^2"]["Morgen"] = 0.0004;
				unitConverterArr["m^2"]["mi2"] = 0.000000386102158542446;
				unitConverterArr["m^2"]["mi^2"] = 0.000000386102158542446;
				unitConverterArr["m^2"]["Nmi2"] = 0.000000291553349598123;
				unitConverterArr["m^2"]["Nmi^2"] = 0.000000291553349598123;
				//unitConverterArr["m^2"]["Picapt2"] = ;
				unitConverterArr["m^2"]["Pica2"] = 8035216.07043214;
				unitConverterArr["m^2"]["Pica^2"] = 8035216.07043214;
				//unitConverterArr["m^2"]["Picapt^2"] = ;
				unitConverterArr["m^2"]["yd2"] = 1.19599004630108;
				unitConverterArr["m^2"]["yd^2"] = 1.19599004630108;


				unitConverterArr["Morgen"] = {};

				unitConverterArr["Morgen"]["mi2"] = 0.000965255396356115;
				unitConverterArr["Morgen"]["mi^2"] = 0.000965255396356115;
				unitConverterArr["Morgen"]["Nmi2"] = 0.000728883373995307;
				unitConverterArr["Morgen"]["Nmi^2"] = 0.000728883373995307;
				//unitConverterArr["Morgen"]["Picapt2"] = ;
				unitConverterArr["Morgen"]["Pica2"] = 20088040176.0803;
				unitConverterArr["Morgen"]["Pica^2"] = 20088040176.0803;
				//unitConverterArr["Morgen"]["Picapt^2"] = ;
				unitConverterArr["Morgen"]["yd2"] = 2989.9751157527;
				unitConverterArr["Morgen"]["yd^2"] = 2989.9751157527;


				unitConverterArr["mi2"] = {};

				unitConverterArr["mi2"]["mi^2"] = 1;
				unitConverterArr["mi2"]["Nmi2"] = 0.755119708987773;
				unitConverterArr["mi2"]["Nmi^2"] = 0.755119708987773;
				//unitConverterArr["mi2"]["Picapt2"] = ;
				unitConverterArr["mi2"]["Pica2"] = 20811114086400;
				unitConverterArr["mi2"]["Pica^2"] = 20811114086400;
				//unitConverterArr["mi2"]["Picapt^2"] = ;
				unitConverterArr["mi2"]["yd2"] = 3097600;
				unitConverterArr["mi2"]["yd^2"] = 3097600;


				unitConverterArr["mi^2"] = {};

				unitConverterArr["mi^2"]["Nmi2"] = 0.755119708987773;
				unitConverterArr["mi^2"]["Nmi^2"] = 0.755119708987773;
				//unitConverterArr["mi^2"]["Picapt2"] = ;
				unitConverterArr["mi^2"]["Pica2"] = 20811114086400;
				unitConverterArr["mi^2"]["Pica^2"] = 20811114086400;
				//unitConverterArr["mi^2"]["Picapt^2"] = ;
				unitConverterArr["mi^2"]["yd2"] = 3097600;
				unitConverterArr["mi^2"]["yd^2"] = 3097600;


				unitConverterArr["Nmi2"] = {};

				unitConverterArr["Nmi2"]["Nmi^2"] = 1;
				//unitConverterArr["Nmi2"]["Picapt2"] = ;
				unitConverterArr["Nmi2"]["Pica2"] = 27560019740839.5;
				unitConverterArr["Nmi2"]["Pica^2"] = 27560019740839.5;
				//unitConverterArr["Nmi2"]["Picapt^2"] = ;
				unitConverterArr["Nmi2"]["yd2"] = 4102131.04376826;
				unitConverterArr["Nmi2"]["yd^2"] = 4102131.04376826;


				unitConverterArr["Nmi^2"] = {};

				//unitConverterArr["Nmi^2"]["Picapt2"] = ;
				unitConverterArr["Nmi^2"]["Pica2"] = 27560019740839.5;
				unitConverterArr["Nmi^2"]["Pica^2"] = 27560019740839.5;
				//unitConverterArr["Nmi^2"]["Picapt^2"] = ;
				unitConverterArr["Nmi^2"]["yd2"] = 4102131.04376826;
				unitConverterArr["Nmi^2"]["yd^2"] = 4102131.04376826;


				/*unitConverterArr["Picapt2"] = {};

				unitConverterArr["Picapt2"]["Pica2"] = ;
				unitConverterArr["Picapt2"]["Pica^2"] = ;
				unitConverterArr["Picapt2"]["Picapt^2"] = ;
				unitConverterArr["Picapt2"]["yd2"] = ;
				unitConverterArr["Picapt2"]["yd^2"] = ;*/


				unitConverterArr["Pica2"] = {};

				unitConverterArr["Pica2"]["Pica^2"] = 1;
				//unitConverterArr["Pica2"]["Picapt^2"] = ;
				unitConverterArr["Pica2"]["yd2"] = 0.000000148843545191282;
				unitConverterArr["Pica2"]["yd^2"] = 0.000000148843545191282;


				unitConverterArr["Pica^2"] = {};

				//unitConverterArr["Pica^2"]["Picapt^2"] = ;
				unitConverterArr["Pica^2"]["yd2"] = 0.000000148843545191282;
				unitConverterArr["Pica^2"]["yd^2"] = 0.000000148843545191282;


				/*unitConverterArr["Picapt^2"] = {};

				unitConverterArr["Picapt^2"]["yd2"] = ;
				unitConverterArr["Picapt^2"]["yd^2"] = ;*/


				unitConverterArr["yd2"] = {};

				unitConverterArr["yd2"]["yd^2"] = 1;

			};

			var generateInformationAndSpeed = function(){

				unitConverterArr["bit"] = {};

				unitConverterArr["bit"]["byte"] = 0.125;


				//Speed
				unitConverterArr["admkn"] = {};

				unitConverterArr["admkn"]["kn"] = 0.999999913606911;
				unitConverterArr["admkn"]["m/h"] = 1851.99984;
				unitConverterArr["admkn"]["m/hr"] = 1851.99984;
				unitConverterArr["admkn"]["m/s"] = 0.5144444;
				unitConverterArr["admkn"]["m/sec"] = 0.5144444;
				unitConverterArr["admkn"]["mph"] = 1.15077934860415;


				unitConverterArr["kn"] = {};

				unitConverterArr["kn"]["m/h"] = 1852;
				unitConverterArr["kn"]["m/hr"] = 1852;
				unitConverterArr["kn"]["m/s"] = 0.514444444444444;
				unitConverterArr["kn"]["m/sec"] = 0.514444444444444;
				unitConverterArr["kn"]["mph"] = 1.15077944802354;


				unitConverterArr["m/h"] = {};

				unitConverterArr["m/h"]["m/hr"] = 1;
				unitConverterArr["m/h"]["m/s"] = 0.000277777777777778;
				unitConverterArr["m/h"]["m/sec"] = 0.000277777777777778;
				unitConverterArr["m/h"]["mph"] = 0.000621371192237334;


				unitConverterArr["m/hr"] = {};

				unitConverterArr["m/hr"]["m/s"] = 0.000277777777777778;
				unitConverterArr["m/hr"]["m/sec"] = 0.000277777777777778;
				unitConverterArr["m/hr"]["mph"] = 0.000621371192237334;


				unitConverterArr["m/s"] = {};

				unitConverterArr["m/s"]["m/sec"] = 1;
				unitConverterArr["m/s"]["mph"] = 2.2369362920544;


				unitConverterArr["m/sec"] = {};

				unitConverterArr["m/sec"]["mph"] = 2.2369362920544;

			};

			generateWeightAndMass();
			generateDistance();
			generateTime();
			generatePressure();
			generateForceAndEnergy();
			generatePowerMagnetismTemperature();
			generateVolume();
			generateArea();
			generateInformationAndSpeed();
		}

		return unitConverterArr;
	}

	function getUnitConverterCoeff(from, to){
		var uniteArr = getUnitConverter();
		var res = null;
		if(uniteArr[from] && undefined !== uniteArr[from][to]){
			res = uniteArr[from][to];
		}
		return res;
	}

	cFormulaFunctionGroup['Engineering'] = cFormulaFunctionGroup['Engineering'] || [];
	cFormulaFunctionGroup['Engineering'].push(cBESSELI, cBESSELJ, cBESSELK, cBESSELY, cBIN2DEC, cBIN2HEX, cBIN2OCT,
		cBITAND, cBITLSHIFT, cBITOR, cBITRSHIFT, cBITXOR, cCOMPLEX, cCONVERT, cDEC2BIN, cDEC2HEX, cDEC2OCT, cDELTA,
		cERF, cERF_PRECISE, cERFC, cERFC_PRECISE, cGESTEP, cHEX2BIN, cHEX2DEC, cHEX2OCT, cIMABS, cIMAGINARY,
		cIMARGUMENT, cIMCONJUGATE, cIMCOS, cIMCOSH, cIMCOT, cIMCSC, cIMCSCH, cIMDIV, cIMEXP, cIMLN, cIMLOG10, cIMLOG2,
		cIMPOWER, cIMPRODUCT, cIMREAL, cIMSEC, cIMSECH, cIMSIN, cIMSINH, cIMSQRT, cIMSUB, cIMSUM, cIMTAN, cOCT2BIN,
		cOCT2DEC, cOCT2HEX);

	cFormulaFunctionGroup['NotRealised'] = cFormulaFunctionGroup['NotRealised'] || [];
	cFormulaFunctionGroup['NotRealised'].push(cCONVERT);

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBESSELI() {
		cBaseFunction.call(this, "BESSELI");
	}

	cBESSELI.prototype = Object.create(cBaseFunction.prototype);
	cBESSELI.prototype.constructor = cBESSELI;
	cBESSELI.prototype.argumentsMin = 2;
	cBESSELI.prototype.argumentsMax = 2;
	cBESSELI.prototype.Calculate = function ( arg ) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var x = argArray[0];
			var n = argArray[1];

			if ( n < 0 ){
				return new cError( cErrorType.not_numeric );
			}
			if(x < 0){
				x = Math.abs(x);
			}
			n = Math.floor(n);

			return bessi( x, n );
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBESSELJ() {
		cBaseFunction.call(this, "BESSELJ");
	}

	cBESSELJ.prototype = Object.create(cBaseFunction.prototype);
	cBESSELJ.prototype.constructor = cBESSELJ;
	cBESSELJ.prototype.argumentsMin = 2;
	cBESSELJ.prototype.argumentsMax = 2;
	cBESSELJ.prototype.Calculate = function ( arg ) {
		//результаты вычислений как в LO
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var x = argArray[0];
			var n = argArray[1];

			if ( n < 0 ){
				return new cError( cErrorType.not_numeric );
			}
			if(x < 0){
				x = Math.abs(x);
			}
			n = Math.floor(n);

			return BesselJ( x, n );
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBESSELK() {
		cBaseFunction.call(this, "BESSELK");
	}

	cBESSELK.prototype = Object.create(cBaseFunction.prototype);
	cBESSELK.prototype.constructor = cBESSELK;
	cBESSELK.prototype.argumentsMin = 2;
	cBESSELK.prototype.argumentsMax = 2;
	cBESSELK.prototype.Calculate = function ( arg ) {
		//результаты вычислений как в LO
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var x = argArray[0];
			var n = argArray[1];

			if ( n < 0 || x < 0){
				return new cError( cErrorType.not_numeric );
			}

			n = Math.floor(n);

			return BesselK( x, n );
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBESSELY() {
		cBaseFunction.call(this, "BESSELY");
	}

	cBESSELY.prototype = Object.create(cBaseFunction.prototype);
	cBESSELY.prototype.constructor = cBESSELY;
	cBESSELY.prototype.argumentsMin = 2;
	cBESSELY.prototype.argumentsMax = 2;
	cBESSELY.prototype.Calculate = function ( arg ) {
		//результаты вычислений как в LO
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var x = argArray[0];
			var n = argArray[1];

			if ( n < 0 || x < 0){
				return new cError( cErrorType.not_numeric );
			}

			n = Math.floor(n);

			return BesselY( x, n );
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};


	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBIN2DEC() {
		cBaseFunction.call(this, "BIN2DEC");
	}

	cBIN2DEC.prototype = Object.create(cBaseFunction.prototype);
	cBIN2DEC.prototype.constructor = cBIN2DEC;
	cBIN2DEC.prototype.argumentsMin = 1;
	cBIN2DEC.prototype.argumentsMax = 1;
	cBIN2DEC.prototype.Calculate = function (arg) {
		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (validBINNumber(arg0)) {
			var substr = arg0.toString();
			if (substr.length == 10 && substr.substring(0, 1) == "1") {
				this.value = new cNumber(parseInt(substr.substring(1), NumberBase.BIN) - 512);
			} else {
				this.value = new cNumber(parseInt(arg0, NumberBase.BIN));
			}
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBIN2HEX() {
		cBaseFunction.call(this, "BIN2HEX");
	}

	cBIN2HEX.prototype = Object.create(cBaseFunction.prototype);
	cBIN2HEX.prototype.constructor = cBIN2HEX;
	cBIN2HEX.prototype.argumentsMin = 1;
	cBIN2HEX.prototype.argumentsMax = 2;
	cBIN2HEX.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.not_numeric);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validBINNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			var substr = arg0.toString();
			if (substr.length === 10 && substr.substring(0, 1) === '1') {
				this.value =
					new cString((1099511627264 + parseInt(substr.substring(1), NumberBase.BIN)).toString(NumberBase.HEX)
						.toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.BIN, NumberBase.HEX, arg1);
			}
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBIN2OCT() {
		cBaseFunction.call(this, "BIN2OCT");
	}

	cBIN2OCT.prototype = Object.create(cBaseFunction.prototype);
	cBIN2OCT.prototype.constructor = cBIN2OCT;
	cBIN2OCT.prototype.argumentsMin = 1;
	cBIN2OCT.prototype.argumentsMax = 2;
	cBIN2OCT.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.not_numeric);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validBINNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			var substr = arg0.toString();
			if (substr.length === 10 && substr.substring(0, 1) === '1') {
				this.value =
					new cString((1073741312 + parseInt(substr.substring(1), NumberBase.BIN)).toString(NumberBase.OCT)
						.toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.BIN, NumberBase.OCT, arg1);
			}
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITAND() {
		cBaseFunction.call(this, "BITAND");
	}

	cBITAND.prototype = Object.create(cBaseFunction.prototype);
	cBITAND.prototype.constructor = cBITAND;
	cBITAND.prototype.argumentsMin = 2;
	cBITAND.prototype.argumentsMax = 2;
	cBITAND.prototype.isXLFN = true;
	cBITAND.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);

			if ( arg0 < 0 || arg1 < 0 /*|| arg0 > 2^48 || arg1 > 2^48*/){
				return  new cError(cErrorType.not_numeric);
			}

			var res = arg0 & arg1;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITLSHIFT() {
		cBaseFunction.call(this, "BITLSHIFT");
	}

	cBITLSHIFT.prototype = Object.create(cBaseFunction.prototype);
	cBITLSHIFT.prototype.constructor = cBITLSHIFT;
	cBITLSHIFT.prototype.argumentsMin = 2;
	cBITLSHIFT.prototype.argumentsMax = 2;
	cBITLSHIFT.prototype.isXLFN = true;
	cBITLSHIFT.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);

			if ( arg0 < 0 /*|| arg0 >= 2^48*/){
				return  new cError(cErrorType.not_numeric);
			}

			var res;
			if (arg1 < 0){
				res = Math.floor( arg0 / Math.pow( 2.0, -arg1));
			}else if (arg1 === 0){
				res = arg0;
			}else{
				res = arg0 * Math.pow( 2.0, arg1);
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITOR() {
		cBaseFunction.call(this, "BITOR");
	}

	cBITOR.prototype = Object.create(cBaseFunction.prototype);
	cBITOR.prototype.constructor = cBITOR;
	cBITOR.prototype.argumentsMin = 2;
	cBITOR.prototype.argumentsMax = 2;
	cBITOR.prototype.isXLFN = true;
	cBITOR.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);

			if ( arg0 < 0 || arg1 < 0 /*|| arg0 > 2^48 || arg1 > 2^48*/){
				return  new cError(cErrorType.not_numeric);
			}

			var res = arg0 | arg1;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITRSHIFT() {
		cBaseFunction.call(this, "BITRSHIFT");
	}

	cBITRSHIFT.prototype = Object.create(cBaseFunction.prototype);
	cBITRSHIFT.prototype.constructor = cBITRSHIFT;
	cBITRSHIFT.prototype.argumentsMin = 2;
	cBITRSHIFT.prototype.argumentsMax = 2;
	cBITRSHIFT.prototype.isXLFN = true;
	cBITRSHIFT.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);

			if ( arg0 < 0 /*|| arg0 >= 2^48*/){
				return  new cError(cErrorType.not_numeric);
			}

			var res;
			if (arg1 < 0){
				res = Math.floor( arg0 * Math.pow( 2.0, -arg1));
			}else if (arg1 === 0){
				res = arg0;
			}else{
				res = Math.floor( arg0 / Math.pow( 2.0, arg1));
			}

			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cBITXOR() {
		cBaseFunction.call(this, "BITXOR");
	}

	cBITXOR.prototype = Object.create(cBaseFunction.prototype);
	cBITXOR.prototype.constructor = cBITXOR;
	cBITXOR.prototype.argumentsMin = 2;
	cBITXOR.prototype.argumentsMax = 2;
	cBITXOR.prototype.isXLFN = true;
	cBITXOR.prototype.Calculate = function (arg) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var arg0 = Math.floor(argArray[0]);
			var arg1 = Math.floor(argArray[1]);

			if ( arg0 < 0 || arg1 < 0 /*|| arg0 > 2^48 || arg1 > 2^48*/){
				return  new cError(cErrorType.not_numeric);
			}

			var res = arg0 ^ arg1;
			return null !== res && !isNaN(res) ? new cNumber(res) : new cError(cErrorType.wrong_value_type);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCOMPLEX() {
		cBaseFunction.call(this, "COMPLEX");
	}

	cCOMPLEX.prototype = Object.create(cBaseFunction.prototype);
	cCOMPLEX.prototype.constructor = cCOMPLEX;
	cCOMPLEX.prototype.argumentsMin = 2;
	cCOMPLEX.prototype.argumentsMax = 3;
	cCOMPLEX.prototype.Calculate = function (arg) {

		var real = arg[0], img = arg[1], suf = !arg[2] || arg[2] instanceof AscCommonExcel.cEmpty ? new cString("i") :
			arg[2];
		if (real instanceof cArea || img instanceof cArea3D) {
			real = real.cross(arguments[1]);
		} else if (real instanceof cArray) {
			real = real.getElement(0);
		}

		if (img instanceof cArea || img instanceof cArea3D) {
			img = img.cross(arguments[1]);
		} else if (img instanceof cArray) {
			img = img.getElement(0);
		}

		if (suf instanceof cArea || suf instanceof cArea3D) {
			suf = suf.cross(arguments[1]);
		} else if (suf instanceof cArray) {
			suf = suf.getElement(0);
		}

		real = real.tocNumber();
		img = img.tocNumber();
		suf = suf.tocString();

		if (real instanceof cError) {
			return this.value = real;
		}
		if (img instanceof cError) {
			return this.value = img;
		}
		if (suf instanceof cError) {
			return this.value = suf;
		}

		real = real.getValue();
		img = img.getValue();
		suf = suf.getValue();

		if (suf != "i" && suf != "j") {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		var c = new Complex(real, img, suf);

		this.value = new cString(c.toString());

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cCONVERT() {
		cBaseFunction.call(this, "CONVERT");
	}

	cCONVERT.prototype = Object.create(cBaseFunction.prototype);
	cCONVERT.prototype.constructor = cCONVERT;
	cCONVERT.prototype.argumentsMin = 3;
	cCONVERT.prototype.argumentsMax = 3;
	cCONVERT.prototype.Calculate = function ( arg ) {
		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1].tocString();
		argClone[2] = argClone[2].tocString();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcFunc = function(argArray){
			var num = argArray[0];
			var from = argArray[1];
			var to = argArray[2];

			var coeff;
			var res;
			if(null !== (coeff = getUnitConverterCoeff(from, to))){
				if(coeff.length){
					res = num;
					for(var i = 0; i < coeff.length; i++){
						if(0 === coeff[i].type){
							res *= coeff[i].val;
						}else{
							res += coeff[i].val;
						}
					}
				}else{
					res = num * coeff;
				}
			}else if(null !== (coeff = getUnitConverterCoeff(to, from))){
				if(coeff.length){
					res = num;
					for(var i = coeff.length - 1; i >= 0; i--){
						if(0 === coeff[i].type){
							res /= coeff[i].val;
						}else{
							res -= coeff[i].val;
						}
					}
				}else{
					res = num / coeff;
				}
			}else{
				return new cError(cErrorType.not_available);
			}

			return new cNumber(res);
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcFunc, true);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDEC2BIN() {
		cBaseFunction.call(this, "DEC2BIN");
	}

	cDEC2BIN.prototype = Object.create(cBaseFunction.prototype);
	cDEC2BIN.prototype.constructor = cDEC2BIN;
	cDEC2BIN.prototype.argumentsMin = 1;
	cDEC2BIN.prototype.argumentsMax = 2;
	cDEC2BIN.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = Math.floor(arg0.getValue());

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validDEC2BINNumber(arg0) && arg0 >= -512 && arg0 <= 511 &&
			( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			if (arg0 < 0) {
				this.value = new cString('1' + '0'.repeat(9 - (512 + arg0).toString(NumberBase.BIN).length) +
					(512 + arg0).toString(NumberBase.BIN).toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.DEC, NumberBase.BIN, arg1);
			}

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDEC2HEX() {
		cBaseFunction.call(this, "DEC2HEX");
	}

	cDEC2HEX.prototype = Object.create(cBaseFunction.prototype);
	cDEC2HEX.prototype.constructor = cDEC2HEX;
	cDEC2HEX.prototype.argumentsMin = 1;
	cDEC2HEX.prototype.argumentsMax = 2;
	cDEC2HEX.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = Math.floor(arg0.getValue());

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validDEC2HEXNumber(arg0) && arg0 >= -549755813888 && arg0 <= 549755813887 &&
			( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			if (arg0 < 0) {
				this.value = new cString((1099511627776 + arg0).toString(NumberBase.HEX).toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.DEC, NumberBase.HEX, arg1);
			}

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDEC2OCT() {
		cBaseFunction.call(this, "DEC2OCT");
	}

	cDEC2OCT.prototype = Object.create(cBaseFunction.prototype);
	cDEC2OCT.prototype.constructor = cDEC2OCT;
	cDEC2OCT.prototype.argumentsMin = 1;
	cDEC2OCT.prototype.argumentsMax = 2;
	cDEC2OCT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocNumber();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = Math.floor(arg0.getValue());

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validDEC2OCTNumber(arg0) && arg0 >= -536870912 && arg0 <= 536870911 &&
			( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			if (arg0 < 0) {
				this.value = new cString((1073741824 + arg0).toString(NumberBase.OCT).toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.DEC, NumberBase.OCT, arg1);
			}

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cDELTA() {
		cBaseFunction.call(this, "DELTA");
	}

	cDELTA.prototype = Object.create(cBaseFunction.prototype);
	cDELTA.prototype.constructor = cDELTA;
	cDELTA.prototype.argumentsMin = 1;
	cDELTA.prototype.argumentsMax = 2;
	cDELTA.prototype.Calculate = function (arg) {

		var number1 = arg[0], number2 = !arg[1] ? new cNumber(0) : arg[1];

		if (number1 instanceof cArea || number2 instanceof cArea3D) {
			number1 = number1.cross(arguments[1]);
		} else if (number1 instanceof cArray) {
			number1 = number1.getElement(0);
		}

		if (number2 instanceof cArea || number2 instanceof cArea3D) {
			number2 = number2.cross(arguments[1]);
		} else if (number2 instanceof cArray) {
			number2 = number2.getElement(0);
		}

		number1 = number1.tocNumber();
		number2 = number2.tocNumber();

		if (number1 instanceof cError) {
			return this.value = number1;
		}
		if (number2 instanceof cError) {
			return this.value = number2;
		}

		number1 = number1.getValue();
		number2 = number2.getValue();

		this.value = new cNumber(number1 == number2 ? 1 : 0);

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERF() {
		cBaseFunction.call(this, "ERF");
	}

	cERF.prototype = Object.create(cBaseFunction.prototype);
	cERF.prototype.constructor = cERF;
	cERF.prototype.argumentsMin = 1;
	cERF.prototype.argumentsMax = 2;
	cERF.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();
		argClone[1] = argClone[1] ? argClone[1].tocNumber() : new cUndefined();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcErf = function(argArray) {
			var a = argArray[0];
			var b = argArray[1];

			var res;
			if(undefined !== b){
				res = new cNumber(rtl_math_erf(b) - rtl_math_erf(a));
			}else{
				res = new cNumber(rtl_math_erf(a));
			}

			return res;
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcErf);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERF_PRECISE() {
		cBaseFunction.call(this, "ERF.PRECISE");
	}

	cERF_PRECISE.prototype = Object.create(cBaseFunction.prototype);
	cERF_PRECISE.prototype.constructor = cERF_PRECISE;
	cERF_PRECISE.prototype.argumentsMin = 1;
	cERF_PRECISE.prototype.argumentsMax = 1;
	cERF_PRECISE.prototype.isXLFN = true;
	cERF_PRECISE.prototype.Calculate = function (arg) {

		var oArguments = this._prepareArguments(arg, arguments[1], true);
		var argClone = oArguments.args;

		argClone[0] = argClone[0].tocNumber();

		var argError;
		if (argError = this._checkErrorArg(argClone)) {
			return this.value = argError;
		}

		var calcErf = function(argArray) {
			var a = argArray[0];
			return new cNumber(rtl_math_erf(a));
		};

		return this.value = this._findArrayInNumberArguments(oArguments, calcErf);
	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cERFC() {
		cBaseFunction.call(this, "ERFC");
	}

	cERFC.prototype = Object.create(cBaseFunction.prototype);
	cERFC.prototype.constructor = cERFC;
	cERFC.prototype.argumentsMin = 1;
	cERFC.prototype.argumentsMax = 1;
	cERFC.prototype.Calculate = function (arg) {

		var a = arg[0];
		if (a instanceof cArea || a instanceof cArea3D) {
			a = a.cross(arguments[1]);
		} else if (a instanceof cArray) {
			a = a.getElement(0);
		}

		a = a.tocNumber();
		if (a instanceof cError) {
			return this.value = a;
		}

		a = a.getValue();

		this.value = new cNumber(AscCommonExcel.rtl_math_erfc(a));

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {cERFC}
	 */
	function cERFC_PRECISE() {
		cERFC.call(this);
		this.name = "ERFC.PRECISE";
	}

	cERFC_PRECISE.prototype = Object.create(cERFC.prototype);
	cERFC_PRECISE.prototype.constructor = cERFC_PRECISE;
	cERFC_PRECISE.prototype.isXLFN = true;

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cGESTEP() {
		cBaseFunction.call(this, "GESTEP");
	}

	cGESTEP.prototype = Object.create(cBaseFunction.prototype);
	cGESTEP.prototype.constructor = cGESTEP;
	cGESTEP.prototype.argumentsMin = 1;
	cGESTEP.prototype.argumentsMax = 2;
	cGESTEP.prototype.Calculate = function (arg) {

		var number1 = arg[0], number2 = !arg[1] ? new cNumber(0) : arg[1];

		if (number1 instanceof cArea || number2 instanceof cArea3D) {
			number1 = number1.cross(arguments[1]);
		} else if (number1 instanceof cArray) {
			number1 = number1.getElement(0);
		}

		if (number2 instanceof cArea || number2 instanceof cArea3D) {
			number2 = number2.cross(arguments[1]);
		} else if (number2 instanceof cArray) {
			number2 = number2.getElement(0);
		}

		number1 = number1.tocNumber();
		number2 = number2.tocNumber();

		if (number1 instanceof cError) {
			return this.value = number1;
		}
		if (number2 instanceof cError) {
			return this.value = number2;
		}

		number1 = number1.getValue();
		number2 = number2.getValue();

		this.value = new cNumber(number1 >= number2 ? 1 : 0);

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHEX2BIN() {
		cBaseFunction.call(this, "HEX2BIN");
	}

	cHEX2BIN.prototype = Object.create(cBaseFunction.prototype);
	cHEX2BIN.prototype.constructor = cHEX2BIN;
	cHEX2BIN.prototype.argumentsMin = 1;
	cHEX2BIN.prototype.argumentsMax = 2;
	cHEX2BIN.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validHEXNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			var negative = (arg0.length === 10 && arg0.substring(0, 1).toUpperCase() === 'F'), arg0DEC = (negative) ?
				parseInt(arg0, NumberBase.HEX) - 1099511627776 : parseInt(arg0, NumberBase.HEX);

			if (arg0DEC < -512 || arg0DEC > 511) {
				this.value = new cError(cErrorType.not_numeric)
			} else {

				if (negative) {
					var str = (512 + arg0DEC).toString(NumberBase.BIN);
					this.value = new cString('1' + '0'.repeat(9 - str.length) + str);
				} else {
					this.value = convertFromTo(arg0DEC, NumberBase.DEC, NumberBase.BIN, arg1);
				}

			}
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHEX2DEC() {
		cBaseFunction.call(this, "HEX2DEC");
	}

	cHEX2DEC.prototype = Object.create(cBaseFunction.prototype);
	cHEX2DEC.prototype.constructor = cHEX2DEC;
	cHEX2DEC.prototype.argumentsMin = 1;
	cHEX2DEC.prototype.argumentsMax = 1;
	cHEX2DEC.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (validHEXNumber(arg0)) {

			arg0 = parseInt(arg0, NumberBase.HEX);
			this.value = new cNumber((arg0 >= 549755813888) ? arg0 - 1099511627776 : arg0);

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cHEX2OCT() {
		cBaseFunction.call(this, "HEX2OCT");
	}

	cHEX2OCT.prototype = Object.create(cBaseFunction.prototype);
	cHEX2OCT.prototype.constructor = cHEX2OCT;
	cHEX2OCT.prototype.argumentsMin = 1;
	cHEX2OCT.prototype.argumentsMax = 2;
	cHEX2OCT.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validHEXNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			arg0 = parseInt(arg0, NumberBase.HEX);

			if (arg0 > 536870911 && arg0 < 1098974756864) {
				this.value = new cError(cErrorType.not_numeric);
			} else {

				if (arg0 >= 1098974756864) {
					this.value = new cString((arg0 - 1098437885952).toString(NumberBase.OCT).toUpperCase());
				} else {
					this.value = convertFromTo(arg0, NumberBase.DEC, NumberBase.OCT, arg1);
				}

			}

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMABS() {
		cBaseFunction.call(this, "IMABS");
	}

	cIMABS.prototype = Object.create(cBaseFunction.prototype);
	cIMABS.prototype.constructor = cIMABS;
	cIMABS.prototype.argumentsMin = 1;
	cIMABS.prototype.argumentsMax = 1;
	cIMABS.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		this.value = new cNumber(c.Abs());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMAGINARY() {
		cBaseFunction.call(this, "IMAGINARY");
	}

	cIMAGINARY.prototype = Object.create(cBaseFunction.prototype);
	cIMAGINARY.prototype.constructor = cIMAGINARY;
	cIMAGINARY.prototype.argumentsMin = 1;
	cIMAGINARY.prototype.argumentsMax = 1;
	cIMAGINARY.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		this.value = new cNumber(c.Imag());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMARGUMENT() {
		cBaseFunction.call(this, "IMARGUMENT");
	}

	cIMARGUMENT.prototype = Object.create(cBaseFunction.prototype);
	cIMARGUMENT.prototype.constructor = cIMARGUMENT;
	cIMARGUMENT.prototype.argumentsMin = 1;
	cIMARGUMENT.prototype.argumentsMax = 1;
	cIMARGUMENT.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		this.value = new cNumber(c.Arg());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCONJUGATE() {
		cBaseFunction.call(this, "IMCONJUGATE");
	}

	cIMCONJUGATE.prototype = Object.create(cBaseFunction.prototype);
	cIMCONJUGATE.prototype.constructor = cIMCONJUGATE;
	cIMCONJUGATE.prototype.argumentsMin = 1;
	cIMCONJUGATE.prototype.argumentsMax = 1;
	cIMCONJUGATE.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		this.value = new cString(c.Conj());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCOS() {
		cBaseFunction.call(this, "IMCOS");
	}

	cIMCOS.prototype = Object.create(cBaseFunction.prototype);
	cIMCOS.prototype.constructor = cIMCOS;
	cIMCOS.prototype.argumentsMin = 1;
	cIMCOS.prototype.argumentsMax = 1;
	cIMCOS.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Cos();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCOSH() {
		cBaseFunction.call(this, "IMCOSH");
	}

	cIMCOSH.prototype = Object.create(cBaseFunction.prototype);
	cIMCOSH.prototype.constructor = cIMCOSH;
	cIMCOSH.prototype.argumentsMin = 1;
	cIMCOSH.prototype.argumentsMax = 1;
	cIMCOSH.prototype.isXLFN = true;
	cIMCOSH.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Cosh();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCOT() {
		cBaseFunction.call(this, "IMCOT");
	}

	cIMCOT.prototype = Object.create(cBaseFunction.prototype);
	cIMCOT.prototype.constructor = cIMCOT;
	cIMCOT.prototype.argumentsMin = 1;
	cIMCOT.prototype.argumentsMax = 1;
	cIMCOT.prototype.isXLFN = true;
	cIMCOT.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if(0 == arg0.value){
			return this.value = new cError(cErrorType.not_numeric);
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Cot();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCSC() {
		cBaseFunction.call(this, "IMCSC");
	}
	//TODO проверить!!!
	cIMCSC.prototype = Object.create(cBaseFunction.prototype);
	cIMCSC.prototype.constructor = cIMCSC;
	cIMCSC.prototype.argumentsMin = 1;
	cIMCSC.prototype.argumentsMax = 1;
	cIMCSC.prototype.isXLFN = true;
	cIMCSC.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		if(0 == arg0.value){
			return this.value = new cError(cErrorType.not_numeric);
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Csc();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMCSCH() {
		cBaseFunction.call(this, "IMCSCH");
	}
	//TODO проверить!!!
	cIMCSCH.prototype = Object.create(cBaseFunction.prototype);
	cIMCSCH.prototype.constructor = cIMCSCH;
	cIMCSCH.prototype.argumentsMin = 1;
	cIMCSCH.prototype.argumentsMax = 1;
	cIMCSCH.prototype.isXLFN = true;
	cIMCSCH.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		if(0 == arg0.value){
			return this.value = new cError(cErrorType.not_numeric);
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Csch();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMDIV() {
		cBaseFunction.call(this, "IMDIV");
	}

	cIMDIV.prototype = Object.create(cBaseFunction.prototype);
	cIMDIV.prototype.constructor = cIMDIV;
	cIMDIV.prototype.argumentsMin = 2;
	cIMDIV.prototype.argumentsMax = 2;
	cIMDIV.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var c1 = new Complex(arg0.toString()), c2 = new Complex(arg1.toString()), c3;

		if (c1 instanceof cError || c2 instanceof cError) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		c3 = c1.Div(c2);

		this.value = new cString(c3.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMEXP() {
		cBaseFunction.call(this, "IMEXP");
	}

	cIMEXP.prototype = Object.create(cBaseFunction.prototype);
	cIMEXP.prototype.constructor = cIMEXP;
	cIMEXP.prototype.argumentsMin = 1;
	cIMEXP.prototype.argumentsMax = 1;
	cIMEXP.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Exp();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMLN() {
		cBaseFunction.call(this, "IMLN");
	}

	cIMLN.prototype = Object.create(cBaseFunction.prototype);
	cIMLN.prototype.constructor = cIMLN;
	cIMLN.prototype.argumentsMin = 1;
	cIMLN.prototype.argumentsMax = 1;
	cIMLN.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		var r = c.Ln();

		if (r instanceof cError) {
			return r;
		}

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMLOG10() {
		cBaseFunction.call(this, "IMLOG10");
	}

	cIMLOG10.prototype = Object.create(cBaseFunction.prototype);
	cIMLOG10.prototype.constructor = cIMLOG10;
	cIMLOG10.prototype.argumentsMin = 1;
	cIMLOG10.prototype.argumentsMax = 1;
	cIMLOG10.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		var r = c.Log10();

		if (r instanceof cError) {
			return r;
		}

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMLOG2() {
		cBaseFunction.call(this, "IMLOG2");
	}

	cIMLOG2.prototype = Object.create(cBaseFunction.prototype);
	cIMLOG2.prototype.constructor = cIMLOG2;
	cIMLOG2.prototype.argumentsMin = 1;
	cIMLOG2.prototype.argumentsMax = 1;
	cIMLOG2.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		var r = c.Log2();

		if (r instanceof cError) {
			return r;
		}

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMPOWER() {
		cBaseFunction.call(this, "IMPOWER");
	}

	cIMPOWER.prototype = Object.create(cBaseFunction.prototype);
	cIMPOWER.prototype.constructor = cIMPOWER;
	cIMPOWER.prototype.argumentsMin = 2;
	cIMPOWER.prototype.argumentsMax = 2;
	cIMPOWER.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocNumber();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		if (c.Power(arg1.getValue())) {
			this.value = new cString(c.toString());
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMPRODUCT() {
		cBaseFunction.call(this, "IMPRODUCT");
	}

	cIMPRODUCT.prototype = Object.create(cBaseFunction.prototype);
	cIMPRODUCT.prototype.constructor = cIMPRODUCT;
	cIMPRODUCT.prototype.argumentsMin = 1;
	cIMPRODUCT.prototype.Calculate = function (arg) {
		var arg0 = arg[0], t = this;

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString()), c1;

		if (c instanceof cError) {
			return this.value = c;
		}

		for (var i = 1; i < this.getArguments(); i++) {

			var argI = arg[i];
			if (argI instanceof cArea || argI instanceof cArea3D) {
				var argIArr = argI.getValue(), _arg;
				for (var j = 0; j < argIArr.length; j++) {
					_arg = argIArr[i].tocString();

					if (_arg instanceof cError) {
						return this.value = _arg;
					}

					c1 = new Complex(_arg.toString());

					if (c1 instanceof cError) {
						return this.value = c1;
					}

					c.Product(c1);

				}
				continue;
			} else if (argI instanceof cArray) {
				argI.foreach(function (elem) {
					var e = elem.tocString();
					if (e instanceof cError) {
						return t.value = e;
					}

					c1 = new Complex(e.toString());

					if (c1 instanceof cError) {
						return t.value = c1;
					}

					c.Product(c1);

				});
				continue;
			}

			argI = argI.tocString();

			if (argI instanceof cError) {
				return this.value = argI;
			}

			c1 = new Complex(argI.toString());

			c.Product(c1);

		}

		if (c instanceof cError) {
			this.value = c;
		} else {
			this.value = new cString(c.toString());
		}

		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMREAL() {
		cBaseFunction.call(this, "IMREAL");
	}

	cIMREAL.prototype = Object.create(cBaseFunction.prototype);
	cIMREAL.prototype.constructor = cIMREAL;
	cIMREAL.prototype.argumentsMin = 1;
	cIMREAL.prototype.argumentsMax = 1;
	cIMREAL.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		this.value = new cNumber(c.real);
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSEC() {
		cBaseFunction.call(this, "IMSEC");
	}
	cIMSEC.prototype = Object.create(cBaseFunction.prototype);
	cIMSEC.prototype.constructor = cIMSEC;
	cIMSEC.prototype.argumentsMin = 1;
	cIMSEC.prototype.argumentsMax = 1;
	cIMSEC.prototype.isXLFN = true;
	cIMSEC.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Sec();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSECH() {
		cBaseFunction.call(this, "IMSECH");
	}
	cIMSECH.prototype = Object.create(cBaseFunction.prototype);
	cIMSECH.prototype.constructor = cIMSECH;
	cIMSECH.prototype.argumentsMin = 1;
	cIMSECH.prototype.argumentsMax = 1;
	cIMSECH.prototype.isXLFN = true;
	cIMSECH.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Sech();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};



	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSIN() {
		cBaseFunction.call(this, "IMSIN");
	}

	cIMSIN.prototype = Object.create(cBaseFunction.prototype);
	cIMSIN.prototype.constructor = cIMSIN;
	cIMSIN.prototype.argumentsMin = 1;
	cIMSIN.prototype.argumentsMax = 1;
	cIMSIN.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Sin();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSINH() {
		cBaseFunction.call(this, "IMSINH");
	}

	cIMSINH.prototype = Object.create(cBaseFunction.prototype);
	cIMSINH.prototype.constructor = cIMSINH;
	cIMSINH.prototype.argumentsMin = 1;
	cIMSINH.prototype.argumentsMax = 1;
	cIMSINH.prototype.isXLFN = true;
	cIMSINH.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Sinh();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSQRT() {
		cBaseFunction.call(this, "IMSQRT");
	}

	cIMSQRT.prototype = Object.create(cBaseFunction.prototype);
	cIMSQRT.prototype.constructor = cIMSQRT;
	cIMSQRT.prototype.argumentsMin = 1;
	cIMSQRT.prototype.argumentsMax = 1;
	cIMSQRT.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.SQRT();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSUB() {
		cBaseFunction.call(this, "IMSUB");
	}

	cIMSUB.prototype = Object.create(cBaseFunction.prototype);
	cIMSUB.prototype.constructor = cIMSUB;
	cIMSUB.prototype.argumentsMin = 2;
	cIMSUB.prototype.argumentsMax = 2;
	cIMSUB.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}


		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		arg1 = arg1.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}
		if (arg1 instanceof cError) {
			return this.value = arg1;
		}

		var c1 = new Complex(arg0.toString()), c2 = new Complex(arg1.toString());

		if (c1 instanceof cError || c2 instanceof cError) {
			return this.value = new cError(cErrorType.not_numeric);
		}

		c1.Sub(c2);

		this.value = new cString(c1.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMSUM() {
		cBaseFunction.call(this, "IMSUM");
	}

	cIMSUM.prototype = Object.create(cBaseFunction.prototype);
	cIMSUM.prototype.constructor = cIMSUM;
	cIMSUM.prototype.argumentsMin = 1;
	cIMSUM.prototype.Calculate = function (arg) {

		var arg0 = arg[0], t = this;

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		var c = new Complex(arg0.toString()), c1;

		if (c instanceof cError) {
			return this.value = c;
		}

		for (var i = 1; i < this.getArguments(); i++) {

			var argI = arg[i];
			if (argI instanceof cArea || argI instanceof cArea3D) {
				var argIArr = argI.getValue(), _arg;
				for (var j = 0; j < argIArr.length; j++) {
					_arg = argIArr[i].tocString();

					if (_arg instanceof cError) {
						return this.value = _arg;
					}

					c1 = new Complex(_arg.toString());

					if (c1 instanceof cError) {
						return this.value = c1;
					}

					c.Sum(c1);

				}
				continue;
			} else if (argI instanceof cArray) {
				argI.foreach(function (elem) {
					var e = elem.tocString();
					if (e instanceof cError) {
						return t.value = e;
					}

					c1 = new Complex(e.toString());

					if (c1 instanceof cError) {
						return t.value = c1;
					}

					c.Sum(c1);

				});
				continue;
			}

			argI = argI.tocString();

			if (argI instanceof cError) {
				return this.value = argI;
			}

			c1 = new Complex(argI.toString());

			c.Sum(c1);

		}

		if (c instanceof cError) {
			this.value = c;
		} else {
			this.value = new cString(c.toString());
		}

		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cIMTAN() {
		cBaseFunction.call(this, "IMTAN");
	}
	//TODO проверить!!!
	cIMTAN.prototype = Object.create(cBaseFunction.prototype);
	cIMTAN.prototype.constructor = cIMTAN;
	cIMTAN.prototype.argumentsMin = 1;
	cIMTAN.prototype.argumentsMax = 1;
	cIMTAN.prototype.isXLFN = true;
	cIMTAN.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		if(arg0.value === true || arg0.value === false){
			return this.value = new cError(cErrorType.wrong_value_type);
		}

		var c = new Complex(arg0.toString());

		if (c instanceof cError) {
			return this.value = c;
		}

		c.Tan();

		this.value = new cString(c.toString());
		this.value.numFormat = 0;

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cOCT2BIN() {
		cBaseFunction.call(this, "OCT2BIN");
	}

	cOCT2BIN.prototype = Object.create(cBaseFunction.prototype);
	cOCT2BIN.prototype.constructor = cOCT2BIN;
	cOCT2BIN.prototype.argumentsMin = 1;
	cOCT2BIN.prototype.argumentsMax = 2;
	cOCT2BIN.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validOCTNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			var negative = (arg0.length === 10 && arg0.substring(0, 1).toUpperCase() === '7'), arg0DEC = (negative) ?
				parseInt(arg0, NumberBase.OCT) - 1073741824 : parseInt(arg0, NumberBase.OCT);

			if (arg0DEC < -512 || arg0DEC > 511) {
				this.value = new cError(cErrorType.not_numeric)
			} else {

				if (negative) {
					var str = (512 + arg0DEC).toString(NumberBase.BIN);
					this.value = new cString(('1' + '0'.repeat(9 - str.length) + str).toUpperCase());
				} else {
					this.value = convertFromTo(arg0DEC, NumberBase.DEC, NumberBase.BIN, arg1);
				}

			}
		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cOCT2DEC() {
		cBaseFunction.call(this, "OCT2DEC");
	}

	cOCT2DEC.prototype = Object.create(cBaseFunction.prototype);
	cOCT2DEC.prototype.constructor = cOCT2DEC;
	cOCT2DEC.prototype.argumentsMin = 1;
	cOCT2DEC.prototype.argumentsMax = 1;
	cOCT2DEC.prototype.Calculate = function (arg) {

		var arg0 = arg[0];

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();

		if (arg0 instanceof cError) {
			return this.value = arg0;
		}

		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (validOCTNumber(arg0)) {

			arg0 = parseInt(arg0, NumberBase.OCT);
			this.value = new cNumber((arg0 >= 536870912) ? arg0 - 1073741824 : arg0);

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};

	/**
	 * @constructor
	 * @extends {AscCommonExcel.cBaseFunction}
	 */
	function cOCT2HEX() {
		cBaseFunction.call(this, "OCT2HEX");
	}

	cOCT2HEX.prototype = Object.create(cBaseFunction.prototype);
	cOCT2HEX.prototype.constructor = cOCT2HEX;
	cOCT2HEX.prototype.argumentsMin = 1;
	cOCT2HEX.prototype.argumentsMax = 2;
	cOCT2HEX.prototype.Calculate = function (arg) {

		var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cUndefined();

		if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
			arg0 = arg0.cross(arguments[1]);
		} else if (arg0 instanceof cArray) {
			arg0 = arg0.getElementRowCol(0, 0);
		}

		if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
			arg1 = arg1.cross(arguments[1]);
		} else if (arg1 instanceof cArray) {
			arg1 = arg1.getElementRowCol(0, 0);
		}

		arg0 = arg0.tocString();
		if (arg0 instanceof cError) {
			return this.value = new cError(cErrorType.wrong_value_type);
		}
		arg0 = arg0.getValue();

		if (arg0.length == 0) {
			arg0 = 0;
		}

		if (!(arg1 instanceof cUndefined)) {
			arg1 = arg1.tocNumber();
			if (arg1 instanceof cError) {
				return this.value = new cError(cErrorType.wrong_value_type);
			}
		}
		arg1 = arg1.getValue();

		if (validHEXNumber(arg0) && ( arg1 > 0 && arg1 <= 10 || arg1 == undefined )) {

			arg0 = parseInt(arg0, NumberBase.OCT);

			if (arg0 >= 536870912) {
				this.value = new cString(('ff' + (arg0 + 3221225472).toString(NumberBase.HEX)).toUpperCase());
			} else {
				this.value = convertFromTo(arg0, NumberBase.DEC, NumberBase.HEX, arg1);
			}

		} else {
			this.value = new cError(cErrorType.not_numeric);
		}

		return this.value;

	};
})(window);
