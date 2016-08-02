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
		var c_oAscPrintDefaultSettings = AscCommon.c_oAscPrintDefaultSettings;
		var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
		var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;
		var g_oCellAddressUtils = AscCommon.g_oCellAddressUtils;

		var c_oAscSelectionType = Asc.c_oAscSelectionType;


		/** @const */
		var kLeftLim1 = .999999999999999;
		var MAX_EXCEL_INT = 1e308;
		var MIN_EXCEL_INT = -MAX_EXCEL_INT;

		/** @const */
		var kUndefinedL = "undefined";
		/** @const */
		var kNullL = "null";
		/** @const */
		var kObjectL = "object";
		/** @const */
		var kFunctionL = "function";
		/** @const */
		var kNumberL = "number";
		/** @const */
		var kArrayL = "array";

		function applyFunction(callback) {
			if (kFunctionL === typeof callback)
				callback.apply(null, Array.prototype.slice.call(arguments, 1));
		}

		function typeOf(obj) {
			if (obj === undefined) {return kUndefinedL;}
			if (obj === null) {return kNullL;}
			return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
		}

		function lastIndexOf(s, regExp, fromIndex) {
			var end = fromIndex >= 0 && fromIndex <= s.length ? fromIndex : s.length;
			for (var i = end - 1; i >= 0; --i) {
				var j = s.slice(i, end).search(regExp);
				if (j >= 0) {return i + j;}
			}
			return -1;
		}

		function search(arr, fn) {
			for (var i = 0; i < arr.length; ++i) {
				if ( fn(arr[i]) ) {return i;}
			}
			return -1;
		}

		function getUniqueRangeColor (arrRanges, curElem, tmpColors) {
			var colorIndex, j, range = arrRanges[curElem];
			for (j = 0; j < curElem; ++j) {
				if (range.isEqual(arrRanges[j])) {
					colorIndex = tmpColors[j];
					break;
				}
			}
			return colorIndex;
		}

		function getMinValueOrNull (val1, val2) {
			return null === val2 ? val1 : (null === val1 ? val2 : Math.min(val1, val2));
		}


		function round(x) {
			var y = x + (x >= 0 ? .5 : -.5);
			return y | y;
			//return Math.round(x);
		}

		function floor(x) {
			var y = x | x;
			y -= x < 0 && y > x ? 1 : 0;
			return y + (x - y > kLeftLim1 ? 1 : 0); // to fix float number precision caused by binary presentation
			//return Math.floor(x);
		}

		function ceil(x) {
			var y = x | x;
			y += x > 0 && y < x ? 1 : 0;
			return y - (y - x > kLeftLim1 ? 1 : 0); // to fix float number precision caused by binary presentation
			//return Math.ceil(x);
		}

		function incDecFonSize (bIncrease, oValue) {
			// Закон изменения размеров :
			// Результатом должно быть ближайшее из отрезка [8,72] по следующим числам 8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72
			// Если значение меньше или равно 8 и мы уменьшаем, то ничего не меняется
			// Если значение больше или равно 72 и мы увеличиваем, то ничего не меняется

			var aSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
			var nLength = aSizes.length;
			var i;
			if (true === bIncrease) {
				if (oValue >= aSizes[nLength - 1])
					return null;
				for (i = 0; i < nLength; ++i)
					if (aSizes[i] > oValue)
						break;
			} else {
				if (oValue <= aSizes[0])
					return null;
				for (i = nLength - 1; i >= 0; --i)
					if (aSizes[i] < oValue)
						break;
			}

			return aSizes[i];
		}

		// Определяет времени работы функции
		function profileTime(fn/*[, arguments]*/) {
			var start, end, arg = [], i;
			if (arguments.length) {
				if (arguments.length > 1) {
					for (i = 1; i < arguments.length; ++i)
						arg.push(arguments[i]);
					start = new Date();
					fn.apply(window, arg);
					end = new Date();
				} else {
					start = new Date();
					fn();
					end = new Date();
				}
				return end.getTime() - start.getTime();
			}
			return undefined;
		}

		var referenceType = {
			A: 0,			// Absolute
			ARRC: 1,	// Absolute row; relative column
			RRAC: 2,	// Relative row; absolute column
			R: 3			// Relative
		};

		function CRangeOffset(offsetCol, offsetRow) {
			this.offsetCol = offsetCol;
			this.offsetRow = offsetRow;
		}

		/**
		 * Rectangle region of cells
		 * @constructor
		 * @memberOf Asc
		 * @param c1 {Number} Left side of range.
		 * @param r1 {Number} Top side of range.
		 * @param c2 {Number} Right side of range (inclusively).
		 * @param r2 {Number} Bottom side of range (inclusively).
		 * @param normalize {Boolean=} Optional. If true, range will be converted to form (left,top) - (right,bottom).
		 * @return {Range}
		 */
		function Range(c1, r1, c2, r2, normalize) {
			if (!(this instanceof Range)) {
				return new Range(c1, r1, c2, r2, normalize);
			}

			/** @type Number */
			this.c1 = c1;
			/** @type Number */
			this.r1 = r1;
			/** @type Number */
			this.c2 = c2;
			/** @type Number */
			this.r2 = r2;
			this.refType1 = referenceType.R;
			this.refType2 = referenceType.R;

			return normalize ? this.normalize() : this;
		}

		Range.prototype.assign = function (c1, r1, c2, r2, normalize) {
			if (typeOf(c1) !== kNumberL || typeOf(c2) !== kNumberL || typeOf(r1) !== kNumberL || typeOf(r2) !== kNumberL) {
				throw "Error: range.assign(" + c1 + "," + r1 + "," + c2 + "," + r2 + ") - numerical args are expected";
			}
			this.c1 = c1;
			this.r1 = r1;
			this.c2 = c2;
			this.r2 = r2;
			return normalize ? this.normalize() : this;
		};
		Range.prototype.assign2 = function (range) {
			return this.assign(range.c1, range.r1, range.c2, range.r2);
		};

		Range.prototype.clone = function (normalize) {
			var oRes = new Range(this.c1, this.r1, this.c2, this.r2, normalize);
			oRes.refType1 = this.refType1;
			oRes.refType2 = this.refType2;
			return oRes;
		};

		Range.prototype.normalize = function () {
			var tmp;
			if (this.c1 > this.c2) {
				tmp = this.c1;
				this.c1 = this.c2;
				this.c2 = tmp;
			}
			if (this.r1 > this.r2) {
				tmp = this.r1;
				this.r1 = this.r2;
				this.r2 = tmp;
			}
			return this;
		};

		Range.prototype.isEqual = function (range) {
			return range && this.c1 === range.c1 && this.r1 === range.r1 && this.c2 === range.c2 && this.r2 === range.r2;
		};

		Range.prototype.isEqualAll = function (range) {
			return this.isEqual(range) && this.refType1 === range.refType1 && this.refType2 === range.refType2;
		};

		Range.prototype.contains = function (c, r) {
			return this.c1 <= c && c <= this.c2 && this.r1 <= r && r <= this.r2;
		};

		Range.prototype.containsRange = function (range) {
			return this.contains(range.c1, range.r1) && this.contains(range.c2, range.r2);
		};

		Range.prototype.containsFirstLineRange = function (range) {
			return this.contains(range.c1, range.r1) && this.contains(range.c2, range.r1);
		};

		Range.prototype.intersection = function (range) {
			var s1 = this.clone(true), s2 = range instanceof Range ? range.clone(true) :
				new Range(range.c1, range.r1, range.c2, range.r2, true);

			if (s2.c1 > s1.c2 || s2.c2 < s1.c1 || s2.r1 > s1.r2 || s2.r2 < s1.r1) {
				return null;
			}

			return new Range(s2.c1 >= s1.c1 && s2.c1 <= s1.c2 ? s2.c1 : s1.c1, s2.r1 >= s1.r1 && s2.r1 <= s1.r2 ? s2.r1 :
				s1.r1, Math.min(s1.c2, s2.c2), Math.min(s1.r2, s2.r2));
		};

		Range.prototype.intersectionSimple = function (range) {
			var oRes = null;
			var r1 = Math.max(this.r1, range.r1);
			var c1 = Math.max(this.c1, range.c1);
			var r2 = Math.min(this.r2, range.r2);
			var c2 = Math.min(this.c2, range.c2);
			if (r1 <= r2 && c1 <= c2) {
				oRes = new Range(c1, r1, c2, r2);
			}
			return oRes;
		};

		Range.prototype.isIntersect = function (range) {
			var bRes = true;
			if (range.r2 < this.r1 || this.r2 < range.r1) {
				bRes = false;
			} else if (range.c2 < this.c1 || this.c2 < range.c1) {
				bRes = false;
			}
			return bRes;
		};

		Range.prototype.isOneCell = function () {
			return this.r1 == this.r2 && this.c1 == this.c2;
		};

		Range.prototype.union = function (range) {
			var s1 = this.clone(true), s2 = range instanceof Range ? range.clone(true) :
				new Range(range.c1, range.r1, range.c2, range.r2, true);

			return new Range(Math.min(s1.c1, s2.c1), Math.min(s1.r1, s2.r1), Math.max(s1.c2, s2.c2), Math.max(s1.r2, s2.r2));
		};

		Range.prototype.union2 = function (range) {
			this.c1 = Math.min(this.c1, range.c1);
			this.c2 = Math.max(this.c2, range.c2);
			this.r1 = Math.min(this.r1, range.r1);
			this.r2 = Math.max(this.r2, range.r2);
		};

		Range.prototype.setOffset = function (offset) {
			if (this.r1 == 0 && this.r2 == gc_nMaxRow0 && offset.offsetRow != 0 ||
				this.c1 == 0 && this.c2 == gc_nMaxCol0 && offset.offsetCol != 0) {
				return;
			}
			this.setOffsetFirst(offset);
			this.setOffsetLast(offset);
		};

		Range.prototype.setOffsetFirst = function (offset) {
			this.c1 += offset.offsetCol;
			if (this.c1 < 0) {
				this.c1 = 0;
			}
			if (this.c1 > gc_nMaxCol0) {
				this.c1 = gc_nMaxCol0;
			}
			this.r1 += offset.offsetRow;
			if (this.r1 < 0) {
				this.r1 = 0;
			}
			if (this.r1 > gc_nMaxRow0) {
				this.r1 = gc_nMaxRow0;
			}
		};

		Range.prototype.setOffsetLast = function (offset) {
			this.c2 += offset.offsetCol;
			if (this.c2 < 0) {
				this.c2 = 0;
			}
			if (this.c2 > gc_nMaxCol0) {
				this.c2 = gc_nMaxCol0;
			}
			this.r2 += offset.offsetRow;
			if (this.r2 < 0) {
				this.r2 = 0;
			}
			if (this.r2 > gc_nMaxRow0) {
				this.r2 = gc_nMaxRow0;
			}
		};

		Range.prototype.getName = function () {
			var sRes = "";
			var c1Abs = this.isAbsCol(this.refType1), c2Abs = this.isAbsCol(this.refType2);
			var r1Abs = this.isAbsRow(this.refType1), r2Abs = this.isAbsRow(this.refType2);

			if (0 == this.c1 && gc_nMaxCol0 == this.c2 && false == c1Abs && false == c2Abs) {
				if (r1Abs) {
					sRes += "$";
				}
				sRes += (this.r1 + 1) + ":";
				if (r2Abs) {
					sRes += "$";
				}
				sRes += (this.r2 + 1);
			} else if (0 == this.r1 && gc_nMaxRow0 == this.r2 && false == r1Abs && false == r2Abs) {
				if (c1Abs) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
				if (c2Abs) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
			} else {
				if (c1Abs) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
				if (r1Abs) {
					sRes += "$";
				}
				sRes += (this.r1 + 1);
				if (!this.isOneCell()) {
					sRes += ":";
					if (c2Abs) {
						sRes += "$";
					}
					sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
					if (r2Abs) {
						sRes += "$";
					}
					sRes += (this.r2 + 1);
				}
			}
			return sRes;
		};

		Range.prototype.getAbsName = function () {
			var sRes = "";
			var c1Abs = this.isAbsCol(this.refType1), c2Abs = this.isAbsCol(this.refType2);
			var r1Abs = this.isAbsRow(this.refType1), r2Abs = this.isAbsRow(this.refType2);

			if (0 == this.c1 && gc_nMaxCol0 == this.c2 && false == c1Abs && false == c2Abs) {
				sRes += "$";
				sRes += (this.r1 + 1) + ":";
				sRes += "$";
				sRes += (this.r2 + 1);
			} else if (0 == this.r1 && gc_nMaxRow0 == this.r2 && false == r1Abs && false == r2Abs) {
				sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
				sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
			} else {
				sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
				sRes += "$";
				sRes += (this.r1 + 1);
				if (!this.isOneCell()) {
					sRes += ":";
					sRes += "$";
					sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
					sRes += "$";
					sRes += (this.r2 + 1);
				}
			}
			return sRes;
		};

		Range.prototype.getAbsName2 = function (absCol1, absRow1, absCol2, absRow2) {
			var sRes = "";
			var c1Abs = this.isAbsCol(this.refType1), c2Abs = this.isAbsCol(this.refType2);
			var r1Abs = this.isAbsRow(this.refType1), r2Abs = this.isAbsRow(this.refType2);

			if (0 == this.c1 && gc_nMaxCol0 == this.c2 && false == c1Abs && false == c2Abs) {
				if (absRow1) {
					sRes += "$";
				}
				sRes += (this.r1 + 1) + ":";
				if (absRow2) {
					sRes += "$";
				}
				sRes += (this.r2 + 1);
			} else if (0 == this.r1 && gc_nMaxRow0 == this.r2 && false == r1Abs && false == r2Abs) {
				if (absCol1) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
				if (absCol2) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
			} else {
				if (absCol1) {
					sRes += "$";
				}
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
				if (absRow1) {
					sRes += "$";
				}
				sRes += (this.r1 + 1);
				if (!this.isOneCell()) {
					sRes += ":";
					if (absCol2) {
						sRes += "$";
					}
					sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
					if (absRow2) {
						sRes += "$";
					}
					sRes += (this.r2 + 1);
				}
			}
			return sRes;
		};

		Range.prototype.getAllRange = function () {
			var result;
			if (c_oAscSelectionType.RangeMax === this.type) {
				result = new Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
			} else if (c_oAscSelectionType.RangeCol === this.type) {
				result = new Range(this.c1, 0, this.c2, gc_nMaxRow0);
			} else if (c_oAscSelectionType.RangeRow === this.type) {
				result = new Range(0, this.r1, gc_nMaxCol0, this.r2);
			} else {
				result = this.clone();
			}

			return result;
		};

		Range.prototype.setAbs = function (absRow1, absCol1, absRow2, absCol2) {
			this.refType1 = (absRow1 ? 0 : 2) + (absCol1 ? 0 : 1);
			this.refType2 = (absRow2 ? 0 : 2) + (absCol2 ? 0 : 1);
		};
		Range.prototype.isAbsCol = function (refType) {
			return (refType === referenceType.A || refType === referenceType.RRAC);
		};
		Range.prototype.isAbsRow = function (refType) {
			return (refType === referenceType.A || refType === referenceType.ARRC);
		};
		Range.prototype.switchReference = function () {
			this.refType1 = (this.refType1 + 1) % 4;
			this.refType2 = (this.refType2 + 1) % 4;
		};

		/**
		 *
     * @constructor
		 * @extends {Range}
     */
		function Range3D() {
			this.sheet = '';

			if (3 == arguments.length) {
				var range = arguments[0];
				Range3D.superclass.constructor.call(this, range.c1, range.r1, range.c2, range.r2);
				// ToDo стоит пересмотреть конструкторы.
				this.refType1 = range.refType1;
				this.refType2 = range.refType2;

				this.sheet = arguments[1];
				this.sheet2 = arguments[2];
			} else if (arguments.length > 1) {
				ActiveRange.superclass.constructor.apply(this, arguments);
			} else {
				ActiveRange.superclass.constructor.call(this, 0, 0, 0, 0);
      }
		}
		AscCommon.extendClass(Range3D, Range);
		Range3D.prototype.isIntersect = function () {
			var oRes = true;
			
			if (2 == arguments.length) {
				oRes = this.sheet === arguments[1];
			}
			return oRes && Range3D.superclass.isIntersect.apply(this, arguments);
		};
		Range3D.prototype.clone = function(){
			return new Range3D(ActiveRange.superclass.clone.apply(this, arguments), this.sheet, this.sheet2);
		};

    /**
     *
     * @constructor
     * @extends {Range}
     */
		function ActiveRange(){
			if(1 == arguments.length)
			{
				var range = arguments[0];
				ActiveRange.superclass.constructor.call(this, range.c1, range.r1, range.c2, range.r2);
				// ToDo стоит пересмотреть конструкторы.
				this.refType1 = range.refType1;
				this.refType2 = range.refType2;
			}
			else if(arguments.length > 1)
				ActiveRange.superclass.constructor.apply(this, arguments);
			else
				ActiveRange.superclass.constructor.call(this, 0, 0, 0, 0);
			this.type = c_oAscSelectionType.RangeCells;
			this.startCol = 0; // Активная ячейка в выделении
			this.startRow = 0; // Активная ячейка в выделении
			this._updateAdditionalData();
		}
		AscCommon.extendClass(ActiveRange, Range);
		
		ActiveRange.prototype.assign = function () {
			ActiveRange.superclass.assign.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype.assign2 = function () {
			ActiveRange.superclass.assign2.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype.clone = function(){
			var oRes = new ActiveRange(ActiveRange.superclass.clone.apply(this, arguments));
			oRes.type = this.type;
			oRes.startCol = this.startCol;
			oRes.startRow = this.startRow;
			return oRes;
		};
		ActiveRange.prototype.normalize = function () {
			ActiveRange.superclass.normalize.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype.isEqualAll = function () {
			var bRes = ActiveRange.superclass.isEqual.apply(this, arguments);
			if(bRes && arguments.length > 0)
			{
				var range = arguments[0];
				bRes = this.type == range.type && this.startCol == range.startCol && this.startRow == range.startRow;
			}
			return bRes;
		};
		ActiveRange.prototype.contains = function () {
			return ActiveRange.superclass.contains.apply(this, arguments);
		};
		ActiveRange.prototype.containsRange = function () {
			return ActiveRange.superclass.containsRange.apply(this, arguments);
		};
		ActiveRange.prototype.containsFirstLineRange = function () {
			return ActiveRange.superclass.containsFirstLineRange.apply(this, arguments);
		};
		ActiveRange.prototype.intersection = function () {
			var oRes = ActiveRange.superclass.intersection.apply(this, arguments);
			if(null != oRes)
			{
				oRes = new ActiveRange(oRes);
				oRes._updateAdditionalData();
			}
			return oRes;
		};
		ActiveRange.prototype.intersectionSimple = function () {
			var oRes = ActiveRange.superclass.intersectionSimple.apply(this, arguments);
			if(null != oRes)
			{
				oRes = new ActiveRange(oRes);
				oRes._updateAdditionalData();
			}
			return oRes;
		};
		ActiveRange.prototype.union = function () {
			var oRes = new ActiveRange(ActiveRange.superclass.union.apply(this, arguments));
			oRes._updateAdditionalData();
			return oRes;
		};
		ActiveRange.prototype.union2 = function () {
			ActiveRange.superclass.union2.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype.setOffset = function(offset){
			this.setOffsetFirst(offset);
			this.setOffsetLast(offset);
		};
		ActiveRange.prototype.setOffsetFirst = function(offset){
			ActiveRange.superclass.setOffsetFirst.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype.setOffsetLast = function(offset){
			ActiveRange.superclass.setOffsetLast.apply(this, arguments);
			this._updateAdditionalData();
			return this;
		};
		ActiveRange.prototype._updateAdditionalData = function(){
			//меняем выделеную ячейку, если она не входит в диапазон
			//возможно, в будующем придется пределать логику, пока нет примеров, когда это работает плохо
			if(!this.contains(this.startCol, this.startRow))
			{
				this.startCol = this.c1;
				this.startRow = this.r1;
			}
			//не меняем тип выделения, если это не выделение ячееек
			// if(this.type == c_oAscSelectionType.RangeCells || this.type == c_oAscSelectionType.RangeCol ||
				// this.type == c_oAscSelectionType.RangeRow || this.type == c_oAscSelectionType.RangeMax)
			// {
				// if(0 == this.r1 && 0 == this.c1 && gc_nMaxRow0 == this.r2 && gc_nMaxCol0 == this.c2)
					// this.type = c_oAscSelectionType.RangeMax;
				// else if(0 == this.r1 && gc_nMaxRow0 == this.r2)
					// this.type = c_oAscSelectionType.RangeCol;
				// else if(0 == this.c1 && gc_nMaxCol0 == this.c2)
					// this.type = c_oAscSelectionType.RangeRow;
				// else
					// this.type = c_oAscSelectionType.RangeCells;
			// }
		};

    /**
     *
     * @constructor
     * @extends {Range}
     */
		function FormulaRange(){
			if(1 == arguments.length)
			{
				var range = arguments[0];
				FormulaRange.superclass.constructor.call(this, range.c1, range.r1, range.c2, range.r2);
			}
			else if(arguments.length > 1)
				FormulaRange.superclass.constructor.apply(this, arguments);
			else
				FormulaRange.superclass.constructor.call(this, 0, 0, 0, 0);

			this.refType1 = referenceType.R;
			this.refType2 = referenceType.R;
		}
		AscCommon.extendClass(FormulaRange, Range);
		FormulaRange.prototype.clone = function () {
			var oRes = new FormulaRange(FormulaRange.superclass.clone.apply(this, arguments));
			oRes.refType1 = this.refType1;
			oRes.refType2 = this.refType2;
			return oRes;
		};
		FormulaRange.prototype.intersection = function () {
			var oRes = FormulaRange.superclass.intersection.apply(this, arguments);
			if(null != oRes)
				oRes = new FormulaRange(oRes);
			return oRes;
		};
		FormulaRange.prototype.intersectionSimple = function () {
			var oRes = FormulaRange.superclass.intersectionSimple.apply(this, arguments);
			if(null != oRes)
				oRes = new FormulaRange(oRes);
			return oRes;
		};
		FormulaRange.prototype.union = function () {
			return new FormulaRange(FormulaRange.superclass.union.apply(this, arguments));
		};
		FormulaRange.prototype.getName = function () {
			var sRes = "";
			var c1Abs = this.isAbsCol(this.refType1), c2Abs = this.isAbsCol(this.refType2);
			var r1Abs = this.isAbsRow(this.refType1), r2Abs = this.isAbsRow(this.refType2);

			if(0 == this.c1 && gc_nMaxCol0 == this.c2)
			{
				if(r1Abs)
					sRes += "$";
				sRes += (this.r1 + 1) + ":";
				if(r2Abs)
					sRes += "$";
				sRes += (this.r2 + 1);
			}
			else if(0 == this.r1 && gc_nMaxRow0 == this.r2)
			{
				if(c1Abs)
					sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1) + ":";
				if(c2Abs)
					sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
			}
			else
			{
				if(c1Abs)
					sRes += "$";
				sRes += g_oCellAddressUtils.colnumToColstr(this.c1 + 1);
				if(r1Abs)
					sRes += "$";
				sRes += (this.r1 + 1);
				if(!this.isOneCell())
				{
					sRes += ":";
					if(c2Abs)
						sRes += "$";
					sRes += g_oCellAddressUtils.colnumToColstr(this.c2 + 1);
					if(r2Abs)
						sRes += "$";
					sRes += (this.r2 + 1);
				}
			}
			return sRes;
		};

		function MultiplyRange(ranges) {
			this.ranges = ranges;
		}
		MultiplyRange.prototype.isIntersect = function(range) {
			for (var i = 0; i < this.ranges.length; ++i) {
				if (range.isIntersect(this.ranges[i])) {
					return true;
				}
			}
			return false;
		};

		function VisibleRange(visibleRange, offsetX, offsetY) {
			this.visibleRange = visibleRange;
			this.offsetX = offsetX;
			this.offsetY = offsetY;
		}

		function RangeCache() {
			this.oCache = {};
		}

		RangeCache.prototype.getAscRange = function (sRange) {
			return this._getRange(sRange, 1);
		};
		RangeCache.prototype.getRange3D = function (sRange) {
			var res = AscCommon.parserHelp.parse3DRef(sRange);
			if (!res) {
				return null;
			}
			var range = this._getRange(res.range.toUpperCase(), 1);
			return range ? new Range3D(range, res.sheet, res.sheet2) : null;
		};
		RangeCache.prototype.getActiveRange = function (sRange) {
			return this._getRange(sRange, 2);
		};
		RangeCache.prototype.getFormulaRange = function (sRange) {
			return this._getRange(sRange, 3);
		};
		RangeCache.prototype._getRange = function (sRange, type) {
			var oRes = null;
			var oCacheVal = this.oCache[sRange];
			if (null == oCacheVal) {
				var oFirstAddr, oLastAddr;
				var bIsSingle = true;
				var nIndex = sRange.indexOf(":");
				if (-1 != nIndex) {
					bIsSingle = false;
					oFirstAddr = g_oCellAddressUtils.getCellAddress(sRange.substring(0, nIndex));
					oLastAddr = g_oCellAddressUtils.getCellAddress(sRange.substring(nIndex + 1));
				} else {
					oFirstAddr = oLastAddr = g_oCellAddressUtils.getCellAddress(sRange);
				}
				oCacheVal = {first: null, last: null, ascRange: null, formulaRange: null, activeRange: null};
				//последнее условие, чтобы не распознавалось "A", "1"(должно быть "A:A", "1:1")
				if (oFirstAddr.isValid() && oLastAddr.isValid() &&
					(!bIsSingle || (!oFirstAddr.getIsRow() && !oFirstAddr.getIsCol()))) {
					oCacheVal.first = oFirstAddr;
					oCacheVal.last = oLastAddr;
				}
				this.oCache[sRange] = oCacheVal;
			}
			if (1 == type) {
				oRes = oCacheVal.ascRange;
			} else if (2 == type) {
				oRes = oCacheVal.activeRange;
			} else {
				oRes = oCacheVal.formulaRange;
			}
			if (null == oRes && null != oCacheVal.first && null != oCacheVal.last) {
				var r1 = oCacheVal.first.getRow0(), r2 = oCacheVal.last.getRow0(), c1 = oCacheVal.first.getCol0(), c2 = oCacheVal.last.getCol0();
				if (oCacheVal.first.getIsRow() && oCacheVal.last.getIsRow()) {
					c1 = 0;
					c2 = gc_nMaxCol0;
				}
				if (oCacheVal.first.getIsCol() && oCacheVal.last.getIsCol()) {
					r1 = 0;
					r2 = gc_nMaxRow0;
				}
				if (r1 > r2) {
					var temp = r1;
					r1 = r2;
					r2 = temp;
				}
				if (c1 > c2) {
					var temp = c1;
					c1 = c2;
					c2 = temp;
				}

				if (1 == type) {
					if (null == oCacheVal.ascRange) {
						var oAscRange = new Range(c1, r1, c2, r2);
						oAscRange.setAbs(oCacheVal.first.getRowAbs(), oCacheVal.first.getColAbs(), oCacheVal.last.getRowAbs(),
							oCacheVal.last.getColAbs());

						oCacheVal.ascRange = oAscRange;
					}
					oRes = oCacheVal.ascRange;
				} else if (2 == type) {
					if (null == oCacheVal.activeRange) {
						var oActiveRange = new ActiveRange(c1, r1, c2, r2);
						oActiveRange.setAbs(oCacheVal.first.getRowAbs(), oCacheVal.first.getColAbs(), oCacheVal.last.getRowAbs(),
							oCacheVal.last.getColAbs());

						var bCol = 0 == r1 && gc_nMaxRow0 == r2;
						var bRow = 0 == c1 && gc_nMaxCol0 == c2;
						if (bCol && bRow) {
							oActiveRange.type = c_oAscSelectionType.RangeMax;
						} else if (bCol) {
							oActiveRange.type = c_oAscSelectionType.RangeCol;
						} else if (bRow) {
							oActiveRange.type = c_oAscSelectionType.RangeRow;
						} else {
							oActiveRange.type = c_oAscSelectionType.RangeCells;
						}
						oActiveRange.startCol = oActiveRange.c1;
						oActiveRange.startRow = oActiveRange.r1;
						oCacheVal.activeRange = oActiveRange;
					}
					oRes = oCacheVal.activeRange;
				} else {
					if (null == oCacheVal.formulaRange) {
						var oFormulaRange = new FormulaRange(c1, r1, c2, r2);
						oFormulaRange.setAbs(oCacheVal.first.getRowAbs(), oCacheVal.first.getColAbs(), oCacheVal.last.getRowAbs(),
							oCacheVal.last.getColAbs());

						oCacheVal.formulaRange = oFormulaRange;
					}
					oRes = oCacheVal.formulaRange;
				}
			}
			return oRes;
		};

		var g_oRangeCache = new RangeCache();
		/**
		 * @constructor
		 * @memberOf Asc
		 */
		function HandlersList(handlers) {
			if ( !(this instanceof HandlersList) ) {return new HandlersList(handlers);}
			this.handlers = handlers || {};
			return this;
		}

		HandlersList.prototype = {

			constructor: HandlersList,

			trigger: function (eventName) {
				var h = this.handlers[eventName], t = typeOf(h), a = Array.prototype.slice.call(arguments, 1), i;
				if (t === kFunctionL) {
					return h.apply(this, a);
				}
				if (t === kArrayL) {
					for (i = 0; i < h.length; i += 1) {
						if (typeOf(h[i]) === kFunctionL) {h[i].apply(this, a);}
					}
					return true;
				}
				return false;
			},

			add: function (eventName, eventHandler, replaceOldHandler) {
				var th = this.handlers, h, old, t;
				if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
					th[eventName] = eventHandler;
				} else {
					old = h = th[eventName];
					t = typeOf(old);
					if (t !== kArrayL) {
						h = th[eventName] = [];
						if (t === kFunctionL) {h.push(old);}
					}
					h.push(eventHandler);
				}
			},

			remove: function (eventName, eventHandler) {
				var th = this.handlers, h = th[eventName], i;
				if (th.hasOwnProperty(eventName)) {
					if (typeOf(h) !== kArrayL || typeOf(eventHandler) !== kFunctionL) {
						delete th[eventName];
						return true;
					}
					for (i = h.length - 1; i >= 0; i -= 1) {
						if (h[i] === eventHandler) {
							delete h[i];
							return true;
						}
					}
				}
				return false;
			}

		};


		function outputDebugStr(channel) {
			var c = window.console;
			if (Asc.g_debug_mode && c && c[channel] && c[channel].apply) {
				c[channel].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
		
		function trim(val)
		{
			if(!String.prototype.trim)
				return val.trim();
			else
				return val.replace(/^\s+|\s+$/g,'');  
		}

		function isNumberInfinity(val) {
		    var valTrim = trim(val);
		    var valInt = valTrim - 0;
		    return valInt == valTrim && valTrim.length > 0 && MIN_EXCEL_INT < valInt && valInt < MAX_EXCEL_INT;//
		}

		function arrayToLowerCase(array) {
			var result = [];
			for (var i = 0, length = array.length; i < length; ++i)
				result.push(array[i].toLowerCase());
			return result;
		}

		function isFixedWidthCell(frag) {
			for (var i = 0; i < frag.length; ++i) {
				var f = frag[i].format;
				if (f && f.repeat) {return true;}
			}
			return false;
		}

		function truncFracPart(frag) {
			var s = frag.reduce(function (prev,val) {return prev + val.text;}, "");
			// Проверка scientific format
			if (s.search(/E/i) >= 0) {
				return frag;
			}
			// Поиск десятичной точки
			var pos = s.search(/[,\.]/);
			if (pos >= 0) {
				frag[0].text = s.slice(0, pos);
				frag.splice(1, frag.length - 1);
			}
			return frag;
		}

		function getEndValueRange (dx, start, v1, v2) {
			var x1, x2;
			if (0 !== dx) {
				if (start === v1) {
					x1 = v1;
					x2 = v2;
				} else if (start === v2) {
					x1 = v2;
					x2 = v1;
				} else {
					if (0 > dx) {
						x1 = v2;
						x2 = v1;
					} else {
						x1 = v1;
						x2 = v2;
					}
				}
			} else {
				x1 = v1;
				x2 = v2;
			}
			return {x1: x1, x2: x2};
		}

		//-----------------------------------------------------------------
		// События движения мыши
		//-----------------------------------------------------------------
		/** @constructor */
		function asc_CMouseMoveData (obj) {
			if ( !(this instanceof asc_CMouseMoveData) ) {
				return new asc_CMouseMoveData(obj);
			}
			
			if (obj) {
				this.type = obj.type;
				this.x = obj.x;
				this.reverseX = obj.reverseX;	// Отображать комментарий слева от ячейки
				this.y = obj.y;
				this.hyperlink = obj.hyperlink;
				this.aCommentIndexes = obj.aCommentIndexes;
				this.userId = obj.userId;
				this.lockedObjectType = obj.lockedObjectType;

				// Для resize
				this.sizeCCOrPt = obj.sizeCCOrPt;
				this.sizePx = obj.sizePx;
			}

			return this;
		}
		asc_CMouseMoveData.prototype = {
			constructor: asc_CMouseMoveData,
			asc_getType: function () { return this.type; },
			asc_getX: function () { return this.x; },
			asc_getReverseX: function () { return this.reverseX; },
			asc_getY: function () { return this.y; },
			asc_getHyperlink: function () { return this.hyperlink; },
			asc_getCommentIndexes: function () { return this.aCommentIndexes; },
			asc_getUserId: function () { return this.userId; },
			asc_getLockedObjectType: function () { return this.lockedObjectType; },
			asc_getSizeCCOrPt: function () { return this.sizeCCOrPt; },
			asc_getSizePx: function () { return this.sizePx; }
		};

		// Гиперссылка
		/** @constructor */
		function asc_CHyperlink (obj) {
			if (!(this instanceof asc_CHyperlink)) {
				return new asc_CHyperlink(obj);
			}

			// Класс Hyperlink из модели
			this.hyperlinkModel = null != obj ? obj : new AscCommonExcel.Hyperlink();
			// Используется только для выдачи наружу и выставлении обратно
			this.text = null;

			return this;
		}
		asc_CHyperlink.prototype = {
			constructor: asc_CHyperlink,
			asc_getType: function () { return this.hyperlinkModel.getHyperlinkType(); },
			asc_getHyperlinkUrl: function () { return this.hyperlinkModel.Hyperlink; },
			asc_getTooltip: function () { return this.hyperlinkModel.Tooltip; },
			asc_getLocation: function () { return this.hyperlinkModel.getLocation(); },
			asc_getSheet: function () { return this.hyperlinkModel.LocationSheet; },
			asc_getRange: function () { return this.hyperlinkModel.LocationRange; },
			asc_getText: function () { return this.text; },

			asc_setType: function (val) {
				// В принципе эта функция избыточна
				switch (val) {
					case Asc.c_oAscHyperlinkType.WebLink:
						this.hyperlinkModel.setLocation(null);
						break;
					case Asc.c_oAscHyperlinkType.RangeLink:
						this.hyperlinkModel.Hyperlink = null;
						break;
				}
			},
			asc_setHyperlinkUrl: function (val) { this.hyperlinkModel.Hyperlink = val; },
			asc_setTooltip: function (val) { this.hyperlinkModel.Tooltip = val ? val.slice(0, Asc.c_oAscMaxTooltipLength) : val; },
			asc_setLocation: function (val) { this.hyperlinkModel.setLocation(val); },
			asc_setSheet: function (val) { this.hyperlinkModel.setLocationSheet(val); },
			asc_setRange: function (val) { this.hyperlinkModel.setLocationRange(val); },
			asc_setText: function (val) { this.text = val; }
		};

		/** @constructor */
		function asc_CPageMargins (obj) {
			if (obj) {
				this.left = obj.left;
				this.right = obj.right;
				this.top = obj.top;
				this.bottom = obj.bottom;
			}

			return this;
		}
		asc_CPageMargins.prototype.init = function () {
			if (null == this.left)
				this.left = c_oAscPrintDefaultSettings.PageLeftField;
			if (null == this.top)
				this.top = c_oAscPrintDefaultSettings.PageTopField;
			if (null == this.right)
				this.right = c_oAscPrintDefaultSettings.PageRightField;
			if (null == this.bottom)
				this.bottom = c_oAscPrintDefaultSettings.PageBottomField;
		};
		asc_CPageMargins.prototype.asc_getLeft = function () { return this.left; };
		asc_CPageMargins.prototype.asc_getRight = function () { return this.right; };
		asc_CPageMargins.prototype.asc_getTop = function () { return this.top; };
		asc_CPageMargins.prototype.asc_getBottom = function () { return this.bottom; };
		asc_CPageMargins.prototype.asc_setLeft = function (val) { this.left = val; };
		asc_CPageMargins.prototype.asc_setRight = function (val) { this.right = val; };
		asc_CPageMargins.prototype.asc_setTop = function (val) { this.top = val; };
		asc_CPageMargins.prototype.asc_setBottom = function (val) { this.bottom = val; };
		/** @constructor */
		function asc_CPageSetup () {
			this.orientation = c_oAscPrintDefaultSettings.PageOrientation;
			this.width = c_oAscPrintDefaultSettings.PageWidth;
			this.height = c_oAscPrintDefaultSettings.PageHeight;

			this.fitToWidth = false; //ToDo can be a number
			this.fitToHeight = false; //ToDo can be a number

			// ToDo
			this.blackAndWhite = false;
			this.cellComments = 0; // none ST_CellComments
			this.copies = 1;
			this.draft = false;
			this.errors = 0; // displayed ST_PrintError
			this.firstPageNumber = -1;
			this.pageOrder = 0; // downThenOver ST_PageOrder
			this.scale = 100;
			this.useFirstPageNumber = false;
			this.usePrinterDefaults = true;

			return this;
		}
		asc_CPageSetup.prototype.asc_getOrientation = function () { return this.orientation; };
		asc_CPageSetup.prototype.asc_getWidth = function () { return this.width; };
		asc_CPageSetup.prototype.asc_getHeight = function () { return this.height; };
		asc_CPageSetup.prototype.asc_setOrientation = function (val) { this.orientation = val; };
		asc_CPageSetup.prototype.asc_setWidth = function (val) { this.width = val; };
		asc_CPageSetup.prototype.asc_setHeight = function (val) { this.height = val; };
		asc_CPageSetup.prototype.asc_getFitToWidth = function () { return this.fitToWidth; };
		asc_CPageSetup.prototype.asc_getFitToHeight = function () { return this.fitToHeight; };
		asc_CPageSetup.prototype.asc_setFitToWidth = function (val) { this.fitToWidth = val; };
		asc_CPageSetup.prototype.asc_setFitToHeight = function (val) { this.fitToHeight = val; };

		/** @constructor */
		function asc_CPageOptions (obj) {
			if (obj) {
				this.pageMargins = obj.pageMargins;
				this.pageSetup = obj.pageSetup;
				this.gridLines = obj.gridLines;
				this.headings = obj.headings;
			}

			return this;
		}
		asc_CPageOptions.prototype.init = function () {
			if (!this.pageMargins)
				this.pageMargins = new asc_CPageMargins();
			this.pageMargins.init();

			if (!this.pageSetup)
				this.pageSetup = new asc_CPageSetup();

			if (null == this.gridLines)
				this.gridLines = c_oAscPrintDefaultSettings.PageGridLines;
			if (null == this.headings)
				this.headings = c_oAscPrintDefaultSettings.PageHeadings;
		};
		asc_CPageOptions.prototype.asc_getPageMargins = function () { return this.pageMargins; };
		asc_CPageOptions.prototype.asc_getPageSetup = function () { return this.pageSetup; };
		asc_CPageOptions.prototype.asc_getGridLines = function () { return this.gridLines; };
		asc_CPageOptions.prototype.asc_getHeadings = function () { return this.headings; };
		asc_CPageOptions.prototype.asc_setPageMargins = function (val) { this.pageMargins = val; };
		asc_CPageOptions.prototype.asc_setPageSetup = function (val) { this.pageSetup = val; };
		asc_CPageOptions.prototype.asc_setGridLines = function (val) { this.gridLines = val; };
		asc_CPageOptions.prototype.asc_setHeadings = function (val) { this.headings = val; };

		function CPagePrint () {
			this.pageWidth = 0;
			this.pageHeight = 0;

			this.pageClipRectLeft = 0;
			this.pageClipRectTop = 0;
			this.pageClipRectWidth = 0;
			this.pageClipRectHeight = 0;

			this.pageRange = null;

			this.leftFieldInPt = 0;
			this.topFieldInPt = 0;
			this.rightFieldInPt = 0;
			this.bottomFieldInPt = 0;

			this.pageGridLines = false;
			this.pageHeadings = false;

			this.indexWorksheet = -1;

			this.startOffset = 0;
			this.startOffsetPt = 0;

			return this;
		}
		function CPrintPagesData () {
			this.arrPages = null;
			this.currentIndex = 0;

			return this;
		}
		/** @constructor */
		function asc_CAdjustPrint () {
			// Вид печати
			this.printType = Asc.c_oAscPrintType.ActiveSheets;
			// ToDo сюда же start и end page index

			return this;
		}
		asc_CAdjustPrint.prototype.asc_getPrintType = function () { return this.printType; };
		asc_CAdjustPrint.prototype.asc_setPrintType = function (val) { this.printType = val; };

		/** @constructor */
		function asc_CLockInfo () {
			this["sheetId"] = null;
			this["type"] = null;
			this["subType"] = null;
			this["guid"] = null;
			this["rangeOrObjectId"] = null;
		}

		/** @constructor */
		function asc_CCollaborativeRange (c1, r1, c2, r2) {
			this["c1"] = c1;
			this["r1"] = r1;
			this["c2"] = c2;
			this["r2"] = r2;
		}

		var g_oCSheetViewSettingsProperties = {
				showGridLines		: 0,
				showRowColHeaders	: 1
			};
		/** @constructor */
		function asc_CSheetViewSettings () {
			this.Properties = g_oCSheetViewSettingsProperties;

			// Показывать ли сетку
			this.showGridLines = null;
			// Показывать обозначения строк и столбцов
			this.showRowColHeaders = null;

			// Закрепление области
			this.pane = null;

			return this;
		}

		asc_CSheetViewSettings.prototype = {
			constructor: asc_CSheetViewSettings,
			clone: function () {
				var result = new asc_CSheetViewSettings();
				result.showGridLines = this.showGridLines;
				result.showRowColHeaders = this.showRowColHeaders;
				if (this.pane)
					result.pane = this.pane.clone();
				return result;
			},
			isEqual: function (settings) {
				return this.asc_getShowGridLines() === settings.asc_getShowGridLines() &&
					this.asc_getShowRowColHeaders() === settings.asc_getShowRowColHeaders();
			},
			setSettings: function (settings) {
				this.showGridLines = settings.showGridLines;
				this.showRowColHeaders = settings.showRowColHeaders;
			},
			asc_getShowGridLines: function () { return false !== this.showGridLines; },
			asc_getShowRowColHeaders: function () { return false !== this.showRowColHeaders; },
			asc_getIsFreezePane: function () { return null !== this.pane && this.pane.isInit(); },
			asc_setShowGridLines: function (val) { this.showGridLines = val; },
			asc_setShowRowColHeaders: function (val) { this.showRowColHeaders = val; },
			getType : function () {
				return AscCommonExcel.UndoRedoDataTypes.SheetViewSettings;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.showGridLines: return this.showGridLines;break;
					case this.Properties.showRowColHeaders: return this.showRowColHeaders;break;
				}
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.showGridLines: this.showGridLines = value;break;
					case this.Properties.showRowColHeaders: this.showRowColHeaders = value;break;
				}
			}
		};

		/** @constructor */
		function asc_CPane () {
			this.state = null;
			this.topLeftCell = null;
			this.xSplit = 0;
			this.ySplit = 0;
			// CellAddress для удобства
			this.topLeftFrozenCell = null;

			return this;
		}
		asc_CPane.prototype.isInit = function () {
			return null !== this.topLeftFrozenCell;
		};
		asc_CPane.prototype.clone = function() {
			var res = new asc_CPane();
			res.state = this.state;
			res.topLeftCell = this.topLeftCell;
			res.xSplit = this.xSplit;
			res.ySplit = this.ySplit;
			res.topLeftFrozenCell = this.topLeftFrozenCell ?
				new AscCommon.CellAddress(this.topLeftFrozenCell.row, this.topLeftFrozenCell.col) : null;
			return res;
		};
		asc_CPane.prototype.init = function() {
			// ToDo Обрабатываем пока только frozen и frozenSplit
			if ((AscCommonExcel.c_oAscPaneState.Frozen === this.state || AscCommonExcel.c_oAscPaneState.FrozenSplit === this.state) &&
				(0 < this.xSplit || 0 < this.ySplit)) {
				this.topLeftFrozenCell = new AscCommon.CellAddress(this.ySplit, this.xSplit, 0);
				if (!this.topLeftFrozenCell.isValid())
					this.topLeftFrozenCell = null;
			}
		};

		function RedoObjectParam () {
			this.bIsOn = false;
			this.bIsReInit = false;
			this.oChangeWorksheetUpdate = {};
			this.bUpdateWorksheetByModel = false;
			this.bOnSheetsChanged = false;
			this.oOnUpdateTabColor = {};
			this.oOnUpdateSheetViewSettings = {};
			this.bAddRemoveRowCol = false;
		}


    /** @constructor */
    function asc_CStylesPainter() {
      this.defaultStyles = null;
      this.docStyles = null;

      this.styleThumbnailWidth = 112;
      this.styleThumbnailHeight = 38;
      this.styleThumbnailWidthPt = this.styleThumbnailWidth * 72 / 96;
      this.styleThumbnailHeightPt = this.styleThumbnailHeight * 72 / 96;

      this.styleThumbnailWidthWithRetina = this.styleThumbnailWidth;
      this.styleThumbnailHeightWithRetina = this.styleThumbnailHeight;
      if (AscCommon.AscBrowser.isRetina) {
        this.styleThumbnailWidthWithRetina <<= 1;
        this.styleThumbnailHeightWithRetina <<= 1;
      }
    }

    asc_CStylesPainter.prototype = {
      constructor: asc_CStylesPainter,
      asc_getStyleThumbnailWidth: function() {
        return this.styleThumbnailWidthWithRetina;
      },
      asc_getStyleThumbnailHeight: function() {
        return this.styleThumbnailHeightWithRetina;
      },
      asc_getDefaultStyles: function() {
        return this.defaultStyles;
      },
      asc_getDocStyles: function() {
        return this.docStyles;
      },
      generateStylesAll: function(cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
        this.generateDefaultStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
        this.generateDocumentStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
      },
      generateDefaultStyles: function(cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
        var cellStyles = cellStylesAll.DefaultStyles;

        var oCanvas = document.createElement('canvas');
        oCanvas.width = this.styleThumbnailWidthWithRetina;
        oCanvas.height = this.styleThumbnailHeightWithRetina;
        var oGraphics = new Asc.DrawingContext({canvas: oCanvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});

        var oStyle, oCustomStyle;
        this.defaultStyles = [];
        for (var i = 0; i < cellStyles.length; ++i) {
          oStyle = cellStyles[i];
          if (oStyle.Hidden) {
            continue;
          }
          // ToDo Возможно стоит переписать немного, чтобы не пробегать каждый раз по массиву custom-стилей (нужно генерировать AllStyles)
          oCustomStyle = cellStylesAll.getCustomStyleByBuiltinId(oStyle.BuiltinId);

          this.drawStyle(oGraphics, stringRenderer, oCustomStyle || oStyle, oStyle.Name);
          this.defaultStyles.push(new AscCommon.CStyleImage(oStyle.Name, AscCommon.c_oAscStyleImage.Default, oCanvas.toDataURL("image/png")));
        }
      },
      generateDocumentStyles: function(cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
        var cellStyles = cellStylesAll.CustomStyles;

        var oCanvas = document.createElement('canvas');
        oCanvas.width = this.styleThumbnailWidthWithRetina;
        oCanvas.height = this.styleThumbnailHeightWithRetina;
        var oGraphics = new Asc.DrawingContext({canvas: oCanvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});

        var oStyle;
        this.docStyles = [];
        for (var i = 0; i < cellStyles.length; ++i) {
          oStyle = cellStyles[i];
          if (oStyle.Hidden || null != oStyle.BuiltinId) {
            continue;
          }

          this.drawStyle(oGraphics, stringRenderer, oStyle, oStyle.Name);
          this.docStyles.push(new AscCommon.CStyleImage(oStyle.Name, AscCommon.c_oAscStyleImage.Document, oCanvas.toDataURL("image/png")));
        }
      },
      drawStyle: function(oGraphics, stringRenderer, oStyle, sStyleName) {
        oGraphics.clear();
        // Fill cell
        var oColor = oStyle.getFill();
        if (null !== oColor) {
          oGraphics.setFillStyle(oColor);
          oGraphics.fillRect(0, 0, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt);
        }

        var drawBorder = function(b, x1, y1, x2, y2) {
          if (null != b && AscCommon.c_oAscBorderStyles.None !== b.s) {
            oGraphics.setStrokeStyle(b.c);

            // ToDo поправить
            oGraphics.setLineWidth(b.w).beginPath().moveTo(x1, y1).lineTo(x2, y2).stroke();
          }
        };

        // borders
        var oBorders = oStyle.getBorder();
        drawBorder(oBorders.l, 0, 0, 0, this.styleThumbnailHeightPt);
        drawBorder(oBorders.r, this.styleThumbnailWidthPt, 0, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt);
        drawBorder(oBorders.t, 0, 0, this.styleThumbnailWidthPt, 0);
        drawBorder(oBorders.b, 0, this.styleThumbnailHeightPt, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt);

        // Draw text
        var fc = oStyle.getFontColor();
        var oFontColor = fc !== null ? fc : new AscCommon.CColor(0, 0, 0);
        var format = oStyle.getFont();
        // Для размера шрифта делаем ограничение для превью в 16pt (у Excel 18pt, но и высота превью больше 22px)
        var oFont = new Asc.FontProperties(format.fn, (16 < format.fs) ? 16 : format.fs, format.b, format.i, format.u, format.s);

        var width_padding = 3; // 4 * 72 / 96

        var tm = stringRenderer.measureString(sStyleName);
        // Текст будем рисовать по центру (в Excel чуть по другому реализовано, у них постоянный отступ снизу)
        var textY = 0.5 * (this.styleThumbnailHeightPt - tm.height);
        oGraphics.setFont(oFont);
        oGraphics.setFillStyle(oFontColor);
        oGraphics.fillText(sStyleName, width_padding, textY + tm.baseline);
      }
    };

		/** @constructor */
		function asc_CSheetPr() {
			if (!(this instanceof asc_CSheetPr)) {
				return new asc_CSheetPr();
			}

			this.CodeName = null;
			this.EnableFormatConditionsCalculation = null;
			this.FilterMode = null;
			this.Published = null;
			this.SyncHorizontal = null;
			this.SyncRef = null;
			this.SyncVertical = null;
			this.TransitionEntry = null;
			this.TransitionEvaluation = null;

			this.TabColor = null;

			return this;
		}
		asc_CSheetPr.prototype.clone = function()  {
			var res = new asc_CSheetPr();

			res.CodeName = this.CodeName;
			res.EnableFormatConditionsCalculation = this.EnableFormatConditionsCalculation;
			res.FilterMode = this.FilterMode;
			res.Published = this.Published;
			res.SyncHorizontal = this.SyncHorizontal;
			res.SyncRef = this.SyncRef;
			res.SyncVertical = this.SyncVertical;
			res.TransitionEntry = this.TransitionEntry;
			res.TransitionEvaluation = this.TransitionEvaluation;
			if (this.TabColor)
				res.TabColor = this.TabColor.clone();

			return res;
		};

		// Математическая информация о выделении
		/** @constructor */
		function asc_CSelectionMathInfo() {
			this.count = 0;
			this.countNumbers = 0;
			this.sum = null;
			this.average = null;
			this.min = null;
			this.max = null;
		}

		asc_CSelectionMathInfo.prototype = {
			constructor: asc_CSelectionMathInfo,
			asc_getCount: function () { return this.count; },
			asc_getCountNumbers: function () { return this.countNumbers; },
			asc_getSum: function () { return this.sum; },
			asc_getAverage: function () { return this.average; },
			asc_getMin: function () { return this.min; },
			asc_getMax: function () { return this.max; }
		};

		/** @constructor */
		function asc_CFindOptions() {
			this.findWhat = "";							// текст, который ищем
			this.scanByRows = true;						// просмотр по строкам/столбцам
			this.scanForward = true;					// поиск вперед/назад
			this.isMatchCase = false;					// учитывать регистр
			this.isWholeCell = false;					// ячейка целиком
			this.scanOnOnlySheet = true;				// искать только на листе/в книге
			this.lookIn = Asc.c_oAscFindLookIn.Formulas;	// искать в формулах/значениях/примечаниях

			this.replaceWith = "";						// текст, на который заменяем (если у нас замена)
			this.isReplaceAll = false;					// заменить все (если у нас замена)

			// внутренние переменные
			this.activeRange = null;
			this.indexInArray = 0;
			this.countFind = 0;
			this.countReplace = 0;
			this.countFindAll = 0;
			this.countReplaceAll = 0;
			this.sheetIndex = -1;
		}
		asc_CFindOptions.prototype.clone = function () {
			var result = new asc_CFindOptions();
			result.findWhat = this.findWhat;
			result.scanByRows = this.scanByRows;
			result.scanForward = this.scanForward;
			result.isMatchCase = this.isMatchCase;
			result.isWholeCell = this.isWholeCell;
			result.scanOnOnlySheet = this.scanOnOnlySheet;
			result.lookIn = this.lookIn;

			result.replaceWith = this.replaceWith;
			result.isReplaceAll = this.isReplaceAll;

			result.activeRange = this.activeRange ? this.activeRange.clone() : null;
			result.indexInArray = this.indexInArray;
			result.countFind = this.countFind;
			result.countReplace = this.countReplace;
			result.countFindAll = this.countFindAll;
			result.countReplaceAll = this.countReplaceAll;
			result.sheetIndex = this.sheetIndex;
			return result;
		};
		asc_CFindOptions.prototype.isEqual = function (obj) {
			return null != obj && this.findWhat === obj.findWhat && this.scanByRows === obj.scanByRows &&
				this.scanForward === obj.scanForward && this.isMatchCase === obj.isMatchCase &&
				this.isWholeCell === obj.isWholeCell && this.scanOnOnlySheet === obj.scanOnOnlySheet &&
				this.lookIn === obj.lookIn;
		};
		asc_CFindOptions.prototype.clearFindAll = function () {
			this.countFindAll = 0;
			this.countReplaceAll = 0;
		};
		asc_CFindOptions.prototype.updateFindAll = function () {
			this.countFindAll += this.countFind;
			this.countReplaceAll += this.countReplace;
		};

		asc_CFindOptions.prototype.asc_setFindWhat = function (val) {this.findWhat = val;};
		asc_CFindOptions.prototype.asc_setScanByRows = function (val) {this.scanByRows = val;};
		asc_CFindOptions.prototype.asc_setScanForward = function (val) {this.scanForward = val;};
		asc_CFindOptions.prototype.asc_setIsMatchCase = function (val) {this.isMatchCase = val;};
		asc_CFindOptions.prototype.asc_setIsWholeCell = function (val) {this.isWholeCell = val;};
		asc_CFindOptions.prototype.asc_setScanOnOnlySheet = function (val) {this.scanOnOnlySheet = val;};
		asc_CFindOptions.prototype.asc_setLookIn = function (val) {this.lookIn = val;};
		asc_CFindOptions.prototype.asc_setReplaceWith = function (val) {this.replaceWith = val;};
		asc_CFindOptions.prototype.asc_setIsReplaceAll = function (val) {this.isReplaceAll = val;};

		/** @constructor */
		function asc_CCompleteMenu(name, type) {
			this.name = name;
			this.type = type;
		}
		asc_CCompleteMenu.prototype.asc_getName = function () {return this.name;};
		asc_CCompleteMenu.prototype.asc_getType = function () {return this.type;};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		var prot;
		window['Asc'] = window['Asc'] || {};
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].applyFunction = applyFunction;
		window["Asc"].typeOf = typeOf;
		window["Asc"].lastIndexOf = lastIndexOf;
		window["Asc"].search = search;
		window["Asc"].getUniqueRangeColor = getUniqueRangeColor;
		window["Asc"].getMinValueOrNull = getMinValueOrNull;
		window["Asc"].round = round;
		window["Asc"].floor = floor;
		window["Asc"].ceil = ceil;
		window["Asc"].incDecFonSize = incDecFonSize;
		window["Asc"].outputDebugStr = outputDebugStr;
		window["Asc"].profileTime = profileTime;
		window["Asc"].isNumberInfinity = isNumberInfinity;
		window["Asc"].trim = trim;
		window["Asc"].arrayToLowerCase = arrayToLowerCase;
		window["Asc"].isFixedWidthCell = isFixedWidthCell;
		window["Asc"].truncFracPart = truncFracPart;
		window["Asc"].getEndValueRange = getEndValueRange;

		window["AscCommonExcel"].referenceType = referenceType;
		window["AscCommonExcel"].CRangeOffset = CRangeOffset;
		window["Asc"].Range = Range;
		window["AscCommonExcel"].Range3D = Range3D;
		window["AscCommonExcel"].ActiveRange = ActiveRange;
		window["AscCommonExcel"].FormulaRange = FormulaRange;
		window["AscCommonExcel"].MultiplyRange = MultiplyRange;
		window["AscCommonExcel"].VisibleRange = VisibleRange;
		window["AscCommonExcel"].g_oRangeCache = g_oRangeCache;

		window["AscCommonExcel"].HandlersList = HandlersList;

		window["AscCommonExcel"].RedoObjectParam = RedoObjectParam;

		window["AscCommonExcel"].asc_CMouseMoveData = asc_CMouseMoveData;
		prot = asc_CMouseMoveData.prototype;
		prot["asc_getType"] = prot.asc_getType;
		prot["asc_getX"] = prot.asc_getX;
		prot["asc_getReverseX"] = prot.asc_getReverseX;
		prot["asc_getY"] = prot.asc_getY;
		prot["asc_getHyperlink"] = prot.asc_getHyperlink;		
		prot["asc_getCommentIndexes"] = prot.asc_getCommentIndexes;
		prot["asc_getUserId"] = prot.asc_getUserId;
		prot["asc_getLockedObjectType"] = prot.asc_getLockedObjectType;
		prot["asc_getSizeCCOrPt"] = prot.asc_getSizeCCOrPt;
		prot["asc_getSizePx"] = prot.asc_getSizePx;

		window["Asc"]["asc_CHyperlink"] = window["Asc"].asc_CHyperlink = asc_CHyperlink;
		prot = asc_CHyperlink.prototype;
		prot["asc_getType"] = prot.asc_getType;
		prot["asc_getHyperlinkUrl"] = prot.asc_getHyperlinkUrl;
		prot["asc_getTooltip"] = prot.asc_getTooltip;
		prot["asc_getLocation"] = prot.asc_getLocation;
		prot["asc_getSheet"] = prot.asc_getSheet;
		prot["asc_getRange"] = prot.asc_getRange;
		prot["asc_getText"] = prot.asc_getText;
		prot["asc_setType"] = prot.asc_setType;
		prot["asc_setHyperlinkUrl"] = prot.asc_setHyperlinkUrl;
		prot["asc_setTooltip"] = prot.asc_setTooltip;
		prot["asc_setLocation"] = prot.asc_setLocation;
		prot["asc_setSheet"] = prot.asc_setSheet;
		prot["asc_setRange"] = prot.asc_setRange;
		prot["asc_setText"] = prot.asc_setText;

		window["Asc"]["asc_CPageMargins"] = window["Asc"].asc_CPageMargins = asc_CPageMargins;
		prot = asc_CPageMargins.prototype;
		prot["asc_getLeft"] = prot.asc_getLeft;
		prot["asc_getRight"] = prot.asc_getRight;
		prot["asc_getTop"] = prot.asc_getTop;
		prot["asc_getBottom"] = prot.asc_getBottom;
		prot["asc_setLeft"] = prot.asc_setLeft;
		prot["asc_setRight"] = prot.asc_setRight;
		prot["asc_setTop"] = prot.asc_setTop;
		prot["asc_setBottom"] = prot.asc_setBottom;

		window["Asc"]["asc_CPageSetup"] = window["Asc"].asc_CPageSetup = asc_CPageSetup;
		prot = asc_CPageSetup.prototype;
		prot["asc_getOrientation"] = prot.asc_getOrientation;
		prot["asc_getWidth"] = prot.asc_getWidth;
		prot["asc_getHeight"] = prot.asc_getHeight;
		prot["asc_setOrientation"] = prot.asc_setOrientation;
		prot["asc_setWidth"] = prot.asc_setWidth;
		prot["asc_setHeight"] = prot.asc_setHeight;
		prot["asc_getFitToWidth"] = prot.asc_getFitToWidth;
		prot["asc_getFitToHeight"] = prot.asc_getFitToHeight;
		prot["asc_setFitToWidth"] = prot.asc_setFitToWidth;
		prot["asc_setFitToHeight"] = prot.asc_setFitToHeight;

		window["Asc"]["asc_CPageOptions"] = window["Asc"].asc_CPageOptions = asc_CPageOptions;
		prot = asc_CPageOptions.prototype;
		prot["asc_getPageMargins"] = prot.asc_getPageMargins;
		prot["asc_getPageSetup"] = prot.asc_getPageSetup;
		prot["asc_getGridLines"] = prot.asc_getGridLines;
		prot["asc_getHeadings"] = prot.asc_getHeadings;
		prot["asc_setPageMargins"] = prot.asc_setPageMargins;
		prot["asc_setPageSetup"] = prot.asc_setPageSetup;
		prot["asc_setGridLines"] = prot.asc_setGridLines;
		prot["asc_setHeadings"] = prot.asc_setHeadings;

		window["AscCommonExcel"].CPagePrint = CPagePrint;
		window["AscCommonExcel"].CPrintPagesData = CPrintPagesData;

		window["Asc"]["asc_CAdjustPrint"] = window["Asc"].asc_CAdjustPrint = asc_CAdjustPrint;
		prot = asc_CAdjustPrint.prototype;
		prot["asc_getPrintType"] = prot.asc_getPrintType;
		prot["asc_setPrintType"] = prot.asc_setPrintType;

		window["AscCommonExcel"].asc_CLockInfo = asc_CLockInfo;

		window["AscCommonExcel"].asc_CCollaborativeRange = asc_CCollaborativeRange;

		window["AscCommonExcel"].asc_CSheetViewSettings = asc_CSheetViewSettings;
		prot = asc_CSheetViewSettings.prototype;
		prot["asc_getShowGridLines"] = prot.asc_getShowGridLines;
		prot["asc_getShowRowColHeaders"] = prot.asc_getShowRowColHeaders;
		prot["asc_getIsFreezePane"] = prot.asc_getIsFreezePane;
		prot["asc_setShowGridLines"] = prot.asc_setShowGridLines;
		prot["asc_setShowRowColHeaders"] = prot.asc_setShowRowColHeaders;

		window["AscCommonExcel"].asc_CPane = asc_CPane;

		window["AscCommonExcel"].asc_CStylesPainter = asc_CStylesPainter;
		prot = asc_CStylesPainter.prototype;
		prot["asc_getStyleThumbnailWidth"] = prot.asc_getStyleThumbnailWidth;
		prot["asc_getStyleThumbnailHeight"] = prot.asc_getStyleThumbnailHeight;
		prot["asc_getDefaultStyles"] = prot.asc_getDefaultStyles;
		prot["asc_getDocStyles"] = prot.asc_getDocStyles;

		window["AscCommonExcel"].asc_CSheetPr = asc_CSheetPr;

		window["AscCommonExcel"].asc_CSelectionMathInfo = asc_CSelectionMathInfo;
		prot = asc_CSelectionMathInfo.prototype;
		prot["asc_getCount"] = prot.asc_getCount;
		prot["asc_getCountNumbers"] = prot.asc_getCountNumbers;
		prot["asc_getSum"] = prot.asc_getSum;
		prot["asc_getAverage"] = prot.asc_getAverage;
		prot["asc_getMin"] = prot.asc_getMin;
		prot["asc_getMax"] = prot.asc_getMax;

		window["Asc"]["asc_CFindOptions"] = window["Asc"].asc_CFindOptions = asc_CFindOptions;
		prot = asc_CFindOptions.prototype;
		prot["asc_setFindWhat"] = prot.asc_setFindWhat;
		prot["asc_setScanByRows"] = prot.asc_setScanByRows;
		prot["asc_setScanForward"] = prot.asc_setScanForward;
		prot["asc_setIsMatchCase"] = prot.asc_setIsMatchCase;
		prot["asc_setIsWholeCell"] = prot.asc_setIsWholeCell;
		prot["asc_setScanOnOnlySheet"] = prot.asc_setScanOnOnlySheet;
		prot["asc_setLookIn"] = prot.asc_setLookIn;
		prot["asc_setReplaceWith"] = prot.asc_setReplaceWith;
		prot["asc_setIsReplaceAll"] = prot.asc_setIsReplaceAll;

		window["AscCommonExcel"].asc_CCompleteMenu = asc_CCompleteMenu;
		prot = asc_CCompleteMenu.prototype;
		prot["asc_getName"] = prot.asc_getName;
		prot["asc_getType"] = prot.asc_getType;
})(window);
