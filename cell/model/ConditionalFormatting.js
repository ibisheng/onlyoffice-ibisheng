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

(function (window, undefined) {
	/*
	 * Import
	 * -----------------------------------------------------------------------------
	 */
	var FT_Common = AscFonts.FT_Common;

	/**
	 * Отвечает за условное форматирование
	 * -----------------------------------------------------------------------------
	 *
	 * @constructor
	 * @memberOf Asc
	 */
	function CConditionalFormatting () {
		this.pivot = false;
		this.ranges = null;
		this.aRules = [];

		return this;
	}
	CConditionalFormatting.prototype.setSqref = function(sqref) {
		this.ranges = AscCommonExcel.g_oRangeCache.getActiveRangesFromSqRef(sqref);
	};
	CConditionalFormatting.prototype.clone = function() {
		var i, res = new CConditionalFormatting();
		res.pivot = this.pivot;
		if (this.ranges) {
			res.ranges = [];
			for (i = 0; i < this.ranges.length; ++i) {
				res.ranges.push(this.ranges[i].clone());
			}
		}
		for (i = 0; i < this.aRules.length; ++i)
			res.aRules.push(this.aRules[i].clone());

		return res;
	};
	CConditionalFormatting.prototype.isValid = function() {
		//todo more checks
		return this.ranges && this.ranges.length > 0;
	}
	CConditionalFormatting.prototype.getBBox = function() {
		var bbox = null;
		if (this.ranges && this.ranges.length > 0) {
			bbox = this.ranges[0].clone();
			for(var i = 1 ; i < this.ranges.length; ++i){
				bbox.union2(this.ranges[i]);
			}
		}
		return bbox;
	};

	//todo need another approach
	function CConditionalFormattingFormulaWrapper (ws, cf) {
		this.ws = ws;
		this.cf = cf;
	}
	CConditionalFormattingFormulaWrapper.prototype.onFormulaEvent = function(type, eventData) {
		if (AscCommon.c_oNotifyParentType.CanDo === type) {
			return true;
		} else if (AscCommon.c_oNotifyParentType.IsDefName === type) {
			return true;
		} else if (AscCommon.c_oNotifyParentType.Change === type) {
			//todo collect
			this.ws._updateConditionalFormatting(new AscCommonExcel.MultiplyRange(this.cf.ranges));
		}
	};

	function CConditionalFormattingRule () {
		this.aboveAverage = true;
		this.activePresent = false;
		this.bottom = false;
		this.dxf = null;
		this.equalAverage = false;
		this.id = null;
		this.operator = null;
		this.percent = false;
		this.priority = null;
		this.rank = null;
		this.stdDev = null;
		this.stopIfTrue = false;
		this.text = null;
		this.timePeriod = null;
		this.type = null;

		this.aRuleElements = [];

		return this;
	}
	CConditionalFormattingRule.prototype.clone = function() {
		var i, res = new CConditionalFormattingRule();
		res.aboveAverage = this.aboveAverage;
		res.bottom = this.bottom;
		if (this.dxf)
			res.dxf = this.dxf.clone();
		res.equalAverage = this.equalAverage;
		res.operator = this.operator;
		res.percent = this.percent;
		res.priority = this.priority;
		res.rank = this.rank;
		res.stdDev = this.stdDev;
		res.stopIfTrue = this.stopIfTrue;
		res.text = this.text;
		res.timePeriod = this.timePeriod;
		res.type = this.type;

		for (i = 0; i < this.aRuleElements.length; ++i)
			res.aRuleElements.push(this.aRuleElements[i].clone());
		return res;
	};
	CConditionalFormattingRule.prototype.getTimePeriod = function() {
		var start, end;
		var now = new Date();
		switch (this.timePeriod) {
			case AscCommonExcel.ST_TimePeriod.last7Days:
				end = now.getExcelDate();
				now.setDate(now.getDate() - 7);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.lastMonth:
				end = now.getExcelDate();
				now.setMonth(now.getMonth() - 1);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.thisMonth:
				start = now.getExcelDate();
				now.setMonth(now.getMonth() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.nextMonth:
				now.setMonth(now.getMonth() + 1);
				start = now.getExcelDate();
				now.setMonth(now.getMonth() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.lastWeek:
				now.setDate(now.getDate() - now.getDay());
				end = now.getExcelDate();
				now.setDate(now.getDate() - 7);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.thisWeek:
				now.setDate(now.getDate() - now.getDay());
				start = now.getExcelDate();
				now.setDate(now.getDate() + 7);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.nextWeek:
				now.setDate(now.getDate() - now.getDay() + 7);
				start = now.getExcelDate();
				now.setDate(now.getDate() + 7);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.yesterday:
				end = now.getExcelDate();
				now.setDate(now.getDate() - 1);
				start = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.today:
				start = now.getExcelDate();
				now.setDate(now.getDate() + 1);
				end = now.getExcelDate();
				break;
			case AscCommonExcel.ST_TimePeriod.tomorrow:
				now.setDate(now.getDate() + 1);
				start = now.getExcelDate();
				now.setDate(now.getDate() + 1);
				end = now.getExcelDate();
				break;
		}
		return {start: start, end: end};
	};
	CConditionalFormattingRule.prototype.cellIs = function(val, v1, v2) {
		var res = false;
		switch(this.operator) {
			case AscCommonExcel.ECfOperator.Operator_beginsWith:
				res = val.endsWith(v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_between:
				res = v1 <= val && val <= v2;
				break;
			case AscCommonExcel.ECfOperator.Operator_containsText:
				res = -1 !== val.indexOf(v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_endsWith:
				res = val.startsWith(v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_equal:
				res = val == v1;
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThan:
				res = val > v1;
				break;
			case AscCommonExcel.ECfOperator.Operator_greaterThanOrEqual:
				res = val >= v1;
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThan:
				res = val < v1;
				break;
			case AscCommonExcel.ECfOperator.Operator_lessThanOrEqual:
				res = val <= v1;
				break;
			case AscCommonExcel.ECfOperator.Operator_notBetween:
				res = !(v1 <= val && val <= v2);
				break;
			case AscCommonExcel.ECfOperator.Operator_notContains:
				res = -1 === val.indexOf(v1);
				break;
			case AscCommonExcel.ECfOperator.Operator_notEqual:
				res = val != v1;
				break;
		}
		return res;
	};
	CConditionalFormattingRule.prototype.getAverage = function(val, average, stdDev) {
		var res = false;
		/*if (this.stdDev) {
			average += (this.aboveAverage ? 1 : -1) * this.stdDev + stdDev;
		}*/
		if (this.aboveAverage) {
			res = val > average;
		} else {
			res = val < average;
		}
		res = res || (this.equalAverage && val == average);
		return res;
	};
	CConditionalFormattingRule.prototype.hasStdDev = function() {
		return null !== this.stdDev;
	};

	function CColorScale () {
		this.aCFVOs = [];
		this.aColors = [];

		return this;
	}
	CColorScale.prototype.clone = function() {
		var i, res = new CColorScale();
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		for (i = 0; i < this.aColors.length; ++i)
			res.aColors.push(this.aColors[i].clone());
		return res;
	};
	CColorScale.prototype.getMin = function(min, max, values) {
		var oCFVO = (0 < this.aCFVOs.length) ? this.aCFVOs[0] : null;
		return this.getValue(min, max, values, oCFVO);
	};
	CColorScale.prototype.getMid = function(min, max, values) {
		var oCFVO = (2 < this.aCFVOs.length ? this.aCFVOs[1] : null);
		return this.getValue(min, max, values, oCFVO);
	};
	CColorScale.prototype.getMax = function(min, max, values) {
		var oCFVO = (2 === this.aCFVOs.length) ? this.aCFVOs[1] : (2 < this.aCFVOs.length ? this.aCFVOs[2] : null);
		return this.getValue(min, max, values, oCFVO);
	};
	CColorScale.prototype.getValue = function(min, max, values, oCFVO) {
		var res = min;
		if (oCFVO) {
			// ToDo Formula
			switch (oCFVO.Type) {
				case AscCommonExcel.ECfvoType.Minimum:
					res = min;
					break;
				case AscCommonExcel.ECfvoType.Maximum:
					res = max;
					break;
				case AscCommonExcel.ECfvoType.Number:
					res = parseFloat(oCFVO.Val);
					break;
				case AscCommonExcel.ECfvoType.Percent:
					res = min + Math.floor((max - min) * parseFloat(oCFVO.Val) / 100);
					break;
				case AscCommonExcel.ECfvoType.Percentile:
					res = AscCommonExcel.getPercentile(values, parseFloat(oCFVO.Val) / 100.0);
					if (AscCommonExcel.cElementType.number === res.type) {
						res = res.getValue();
					} else {
						res = min;
					}
					break;
			}
		}
		return res;
	};

	function CDataBar () {
		this.MaxLength = 90;
		this.MinLength = 10;
		this.ShowValue = true;

		this.aCFVOs = [];
		this.Color = null;

		return this;
	}
	CDataBar.prototype.clone = function() {
		var i, res = new CDataBar();
		res.MaxLength = this.MaxLength;
		res.MinLength = this.MinLength;
		res.ShowValue = this.ShowValue;
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		if (this.Color)
			res.Color = this.Color.clone();
		return res;
	};

	function CFormulaCF () {
		this.Text = null;
		this._f = null;

		return this;
	}
	CFormulaCF.prototype.clone = function() {
		var res = new CFormulaCF();
		res.Text = this.Text;
		return res;
	};
	CFormulaCF.prototype.init = function(ws, opt_parent) {
		if (!this._f) {
			this._f = new AscCommonExcel.parserFormula(this.Text, opt_parent, ws);
			this._f.parse();
			if (opt_parent) {
				//todo realize removeDependencies
				this._f.buildDependencies();
			}
		}
	};
	CFormulaCF.prototype.getValue = function(ws) {
		this.init(ws);
		return this._f.calculate(null, null).getValue();
	};
	CFormulaCF.prototype.getValueRaw = function(ws, opt_parent, opt_bbox, opt_offset) {
		this.init(ws, opt_parent);
		return this._f.calculate(null, opt_bbox, opt_offset);
	};

	function CIconSet () {
		this.IconSet = Asc.EIconSetType.Traffic3Lights1;
		this.Percent = true;
		this.Reverse = false;
		this.ShowValue = true;

		this.aCFVOs = [];

		return this;
	}
	CIconSet.prototype.clone = function() {
		var i, res = new CIconSet();
		res.IconSet = this.IconSet;
		res.Percent = this.Percent;
		res.Reverse = this.Reverse;
		res.ShowValue = this.ShowValue;
		for (i = 0; i < this.aCFVOs.length; ++i)
			res.aCFVOs.push(this.aCFVOs[i].clone());
		return res;
	};

	function CConditionalFormatValueObject () {
		this.Gte = true;
		this.Type = null;
		this.Val = null;

		return this;
	}
	CConditionalFormatValueObject.prototype.clone = function() {
		var res = new CConditionalFormatValueObject();
		res.Gte = this.Gte;
		res.Type = this.Type;
		res.Val = this.Val;
		return res;
	};

	function CGradient (c1, c2) {
		this.MaxColorIndex = 512;
		this.base_shift = 8;

		this.c1 = c1;
		this.c2 = c2;

		this.min = this.max = 0;
		this.koef = null;
		this.r1 = this.r2 = 0;
		this.g1 = this.g2 = 0;
		this.b1 = this.b2 = 0;

		return this;
	}

	CGradient.prototype.init = function (min, max) {
		var distance = max - min;

		this.min = min;
		this.max = max;
		this.koef = this.MaxColorIndex / (2.0 * distance);
		this.r1 = this.c1.getR();
		this.g1 = this.c1.getG();
		this.b1 = this.c1.getB();
		this.r2 = this.c2.getR();
		this.g2 = this.c2.getG();
		this.b2 = this.c2.getB();
	};
	CGradient.prototype.calculateColor = function (indexColor) {
		if (indexColor < this.min) {
			indexColor = this.min;
		} else if (indexColor > this.max) {
			indexColor = this.max;
		}
		indexColor = ((indexColor - this.min) * this.koef) >> 0;

		var r = (this.r1 + ((FT_Common.IntToUInt(this.r2 - this.r1) * indexColor) >> this.base_shift)) & 0xFF;
		var g = (this.g1 + ((FT_Common.IntToUInt(this.g2 - this.g1) * indexColor) >> this.base_shift)) & 0xFF;
		var b = (this.b1 + ((FT_Common.IntToUInt(this.b2 - this.b1) * indexColor) >> this.base_shift)) & 0xFF;
		//console.log("index=" + indexColor + ": r=" + r + " g=" + g + " b=" + b);
		return new AscCommonExcel.RgbColor((r << 16) + (g << 8) + b);
	};

	/*
	 * Export
	 * -----------------------------------------------------------------------------
	 */
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].CConditionalFormatting = CConditionalFormatting;
	window['AscCommonExcel'].CConditionalFormattingFormulaWrapper = CConditionalFormattingFormulaWrapper;
	window['AscCommonExcel'].CConditionalFormattingRule = CConditionalFormattingRule;
	window['AscCommonExcel'].CColorScale = CColorScale;
	window['AscCommonExcel'].CDataBar = CDataBar;
	window['AscCommonExcel'].CFormulaCF = CFormulaCF;
	window['AscCommonExcel'].CIconSet = CIconSet;
	window['AscCommonExcel'].CConditionalFormatValueObject = CConditionalFormatValueObject;
	window['AscCommonExcel'].CGradient = CGradient;
})(window);
