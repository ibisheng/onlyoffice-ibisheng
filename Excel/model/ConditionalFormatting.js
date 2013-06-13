/*
 * Author: Alexander.Trofimov
 * Date: 30.10.12
 */

(	/**
 * @param {jQuery} $
 * @param {Window} window
 * @param {undefined} undefined
 */
	function ($, window, undefined) {
	/*
	 * Import
	 * -----------------------------------------------------------------------------
	 */
	var asc				= window["Asc"];

	/**
	 * Отвечает за условное форматирование
	 * -----------------------------------------------------------------------------
	 *
	 * @constructor
	 * @memberOf Asc
	 */
	function CConditionalFormatting () {
		if ( !(this instanceof CConditionalFormatting) ) {
			return new CConditionalFormatting ();
		}

		this.Pivot = false;
		this.SqRef = null;
		this.aRules = [];

		return this;
	}

	function CConditionalFormattingRule () {
		if ( !(this instanceof CConditionalFormattingRule) ) {
			return new CConditionalFormattingRule ();
		}

		this.AboveAverage = true;
		this.Bottom = false;
		this.DxfId = null;
		this.EqualAverage = false;
		this.Operator = null;
		this.Percent = false;
		this.Priority = null;
		this.Rank = null;
		this.StdDev = null;
		this.StopIfTrue = false;
		this.Text = null;
		this.TimePeriod = null;
		this.Type = null;

		this.aRuleElements = [];

		return this;
	}

	function CColorScale () {
		if ( !(this instanceof CColorScale) ) {
			return new CColorScale ();
		}

		this.aCFVOs = [];
		this.aColors = [];

		return this;
	}

	function CDataBar () {
		if ( !(this instanceof CDataBar) ) {
			return new CDataBar ();
		}

		this.MaxLength = 90;
		this.MinLength = 10;
		this.ShowValue = true;

		this.aCFVOs = [];
		this.Color = null;

		return this;
	}

	function CFormulaCF () {
		if ( !(this instanceof CFormulaCF) ) {
			return new CFormulaCF ();
		}

		this.Text = null;

		return this;
	}

	function CIconSet () {
		if ( !(this instanceof CIconSet) ) {
			return new CIconSet ();
		}

		this.IconSet = "3TrafficLights1";
		this.Percent = true;
		this.Reverse = false;
		this.ShowValue = true;

		this.aCFVOs = [];

		return this;
	}

	function CConditionalFormatValueObject () {
		if ( !(this instanceof CConditionalFormatValueObject) ) {
			return new CConditionalFormatValueObject ();
		}

		this.Gte = true;
		this.Type = null;
		this.Val = null;

		return this;
	}

	function CGradient () {
		if ( !(this instanceof CGradient) ) {
			return new CGradient ();
		}

		this.MaxColorIndex = 512;
		this.base_shift = 8;

		this.c1 = null;
		this.c2 = null;

		return this;
	}

	CGradient.prototype = {
		/** @type CGradient */
		constructor: CGradient,

		generate: function (count) {
			if (null === this.c1 || null === this.c2)
				return null;

			var result = [];
			var i, indexColor;
			var tmp = this.MaxColorIndex / (2.0 * (count - 1));
			for (i = 0; i < count; ++i) {
				indexColor = parseInt(i * tmp);
				result[i] = this.calculateColor(indexColor);
			}

			return result;
		},
		calculateColor: function (indexColor) {
			var ret = new CAscColor();
			ret.r = (this.c1.r + ((FT_Common.IntToUInt(this.c2.r - this.c1.r) * indexColor) >> this.base_shift)) & 0xFFFF;
			ret.g = (this.c1.g + ((FT_Common.IntToUInt(this.c2.g - this.c1.g) * indexColor) >> this.base_shift)) & 0xFFFF;
			ret.b = (this.c1.b + ((FT_Common.IntToUInt(this.c2.b - this.c1.b) * indexColor) >> this.base_shift)) & 0xFFFF;
			ret.a = (this.c1.a + ((FT_Common.IntToUInt(this.c2.a - this.c1.a) * indexColor) >> this.base_shift)) & 0xFFFF;
			return ret;
		}
	};

	/*
	 * Export
	 * -----------------------------------------------------------------------------
	 */
	asc.CConditionalFormatting = CConditionalFormatting;
	asc.CConditionalFormattingRule = CConditionalFormattingRule;
	asc.CColorScale = CColorScale;
	asc.CDataBar = CDataBar;
	asc.CFormulaCF = CFormulaCF;
	asc.CIconSet = CIconSet;
	asc.CConditionalFormatValueObject = CConditionalFormatValueObject;
	asc.CGradient = CGradient;
})(jQuery, window);