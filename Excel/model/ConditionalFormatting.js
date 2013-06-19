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

		this.SqRefRange = null;

		return this;
	}

	function CConditionalFormattingRule () {
		if ( !(this instanceof CConditionalFormattingRule) ) {
			return new CConditionalFormattingRule ();
		}

		this.AboveAverage = true;
		this.Bottom = false;
		this.dxf = null;
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

	function CGradient (c1, c2) {
		if ( !(this instanceof CGradient) ) {
			return new CGradient (c1, c2);
		}

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

	CGradient.prototype = {
		/** @type CGradient */
		constructor: CGradient,

		init: function (min, max) {
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
		},
		calculateColor: function (indexColor) {
			indexColor = parseInt((indexColor - this.min) * this.koef);

			var r = (this.r1 + ((FT_Common.IntToUInt(this.r2 - this.r1) * indexColor) >> this.base_shift)) & 0xFF;
			var g = (this.g1 + ((FT_Common.IntToUInt(this.g2 - this.g1) * indexColor) >> this.base_shift)) & 0xFF;
			var b = (this.b1 + ((FT_Common.IntToUInt(this.b2 - this.b1) * indexColor) >> this.base_shift)) & 0xFF;
			//console.log("index=" + indexColor + ": r=" + r + " g=" + g + " b=" + b);
			return new RgbColor((r << 16) + (g << 8) + b);
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