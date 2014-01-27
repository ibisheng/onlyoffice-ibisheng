/* DrawingContext.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Nov 21, 2011
 */
(function (/** jQuery */$, /** Window */window, undefined) {

/*
 * Import
 * -----------------------------------------------------------------------------
 */

var asc = window["Asc"];
var asc_round = asc.round;
var asc_floor = asc.floor;

function colorObjToAscColor(color) {
	var oRes = null;
	var r = color.getR();
	var g = color.getG();
	var b = color.getB();
	var bTheme = false;
	if(color instanceof ThemeColor && null != color.theme)
	{
		var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
		var themePresentation = array_colors_types[color.theme];
		var tintExcel = 0;
		if(null != color.tint)
			tintExcel = color.tint;
		var tintPresentation = 0;
		var oThemeColorTint = g_oThemeColorTint[color.theme];
		if(null != oThemeColorTint)
		{
			for(var i = 0 , length = oThemeColorTint.length; i < length; ++i)
			{
				var cur = oThemeColorTint[i];
				//0.005 установлено экспериментально
				if(Math.abs(cur - tintExcel) < 0.005)
				{
					bTheme = true;
					tintPresentation = i;
					break;
				}
			}
		}
		if(bTheme)
		{
			oRes = new CAscColor();
			oRes.r = r;
			oRes.g = g;
			oRes.b = b;
			oRes.a = 255;
			oRes.type = c_oAscColor.COLOR_TYPE_SCHEME;
			oRes.value = themePresentation;
		}
	}
	if(false == bTheme)
		oRes = CreateAscColorCustom(r, g, b);
	return oRes;
}

var oldPpi = undefined,
    cvt = undefined;

/**
 * Gets ratio to convert units
 * @param {Number} fromUnits  Units (0=px, 1=pt, 2=in, 3=mm)
 * @param {Number} toUnits    Units (0=px, 1=pt, 2=in, 3=mm)
 * @param {Number} ppi        Points per inch
 * @return {Number}  Ratio
 */
function getCvtRatio(fromUnits, toUnits, ppi) {
	if (ppi !== oldPpi || oldPpi === undefined) {
		var _ppi  = 1 / ppi,
		    _72   = 1 / 72,
		    _25_4 = 1 / 25.4;
		cvt = [
			     /*    px          pt       in        mm    */
			/*px*/[         1,   72*_ppi,   _ppi,  25.4*_ppi ],
			/*pt*/[   ppi*_72,         1,    _72,   25.4*_72 ],
			/*in*/[       ppi,        72,      1,       25.4 ],
			/*mm*/[ ppi*_25_4,  72*_25_4,  _25_4,          1 ]
		];
		oldPpi = ppi;
	}
	return cvt[fromUnits][toUnits];
}

/**
 * Округляет текущее значение в pt таким образом, чтобы при переводе его в px при указанном DPI получалось
 * целое число пикселей
 * @param {type} origPt
 * @param {type} ppi
 * @param {type} pxAddon
 * @returns {Number}
 */
function calcNearestPt(origPt, ppi, pxAddon) {
	var a = pxAddon !== undefined ? pxAddon : 0,
	    x = origPt * ppi / 72,
	    y = x | x,
	    p = x - y < .000000001 ? 0 : 1; // to fix float number precision caused by binary presentation
	return (y + p + a) / ppi * 72;
}

function deg2rad(deg){
	return deg * Math.PI / 180.0;
}

function rad2deg(rad){
	return rad * 180.0 / Math.PI;
}



/** @const */
var MATRIX_ORDER_PREPEND = 0,
    MATRIX_ORDER_APPEND  = 1;

/**
 * @constructor
 */
function Matrix() {
	if ( !(this instanceof Matrix) ) {
		return new Matrix();
	}

	this.sx  = 1.0;
	this.shx = 0.0;
	this.shy = 0.0;
	this.sy  = 1.0;
	this.tx  = 0.0;
	this.ty  = 0.0;

	return this;
}

Matrix.prototype = {

	/** @type Matrix */
	constructor: Matrix,

	reset: function () {
		this.sx  = 1.0;
		this.shx = 0.0;
		this.shy = 0.0;
		this.sy  = 1.0;
		this.tx  = 0.0;
		this.ty  = 0.0;
	},

	assign: function (sx, shx, shy, sy, tx, ty) {
		this.sx  = sx;
		this.shx = shx;
		this.shy = shy;
		this.sy  = sy;
		this.tx  = tx;
		this.ty  = ty;
	},

	copyFrom: function (matrix) {
		this.sx  = matrix.sx;
		this.shx = matrix.shx;
		this.shy = matrix.shy;
		this.sy  = matrix.sy;
		this.tx  = matrix.tx;
		this.ty  = matrix.ty;
	},

	clone: function () {
		var m = new Matrix();
		m.copyFrom(this);
		return m;
	},

	multiply: function (matrix, order) {
		if (MATRIX_ORDER_PREPEND === order) {
			var m = matrix.clone();
			m.multiply(this, MATRIX_ORDER_APPEND);
			this.copyFrom(m);
		} else {
			var t0   = this.sx  * matrix.sx  + this.shy * matrix.shx;
			var t2   = this.shx * matrix.sx  + this.sy  * matrix.shx;
			var t4   = this.tx  * matrix.sx  + this.ty  * matrix.shx + matrix.tx;
			this.shy = this.sx  * matrix.shy + this.shy * matrix.sy;
			this.sy  = this.shx * matrix.shy + this.sy  * matrix.sy;
			this.ty  = this.tx  * matrix.shy + this.ty  * matrix.sy + matrix.ty;
			this.sx  = t0;
			this.shx = t2;
			this.tx  = t4;
		}
	},

	translate: function (x, y, order) {
		var m = new Matrix();
		m.tx  = x;
		m.ty  = y;
		this.multiply(m, order);
	},

	scale: function (x, y, order) {
		var m = new Matrix();
		m.sx  = x;
		m.sy  = y;
		this.multiply(m, order);
	},

	rotate: function (a, order) {
		var m = new Matrix();
		var rad = deg2rad(a);
		m.sx  = Math.cos(rad);
		m.shx = Math.sin(rad);
		m.shy = -Math.sin(rad);
		m.sy  = Math.cos(rad);
		this.multiply(m, order);
	},

	rotateAt: function (a, x, y, order) {
		this.translate(-x, -y, order);
		this.rotate(a, order);
		this.translate(x, y, order);
	},

	determinant: function () {
		return this.sx * this.sy - this.shy * this.shx;
	},

	invert: function () {
		var det = this.determinant();
		if (0.0001 > det) {return;}
		var d = 1 / det;

		var t0 = this.sy * d;
		this.sy =  this.sx * d;
		this.shy = -this.shy * d;
		this.shx = -this.shx * d;

		var t4 = -this.tx * t0  - this.ty * this.shx;
		this.ty = -this.tx * this.shy - this.ty * this.sy;

		this.sx = t0;
		this.tx = t4;
	},

	transformPointX: function (x, y) {
		return x * this.sx  + y * this.shx + this.tx;
	},

	transformPointY: function (x, y) {
		return x * this.shy + y * this.sy  + this.ty;
	},

	/** Calculates rotation angle */
	getRotation: function () {
		var x1 = 0.0;
		var y1 = 0.0;
		var x2 = 1.0;
		var y2 = 0.0;
		this.transformPoint(x1, y1);
		this.transformPoint(x2, y2);
		var a = Math.atan2(y2-y1, x2-x1);
		return rad2deg(a);
	}

};



/**
 * Creates font properties
 * -----------------------------------------------------------------------------
 * @constructor
 * @param {String} family     Font family
 * @param {Number} size       Font size
 * @param {Boolean} bold      Font style - bold
 * @param {Boolean} italic    Font style - italic
 * @param {String} underline  Font style - type of underline
 * @param {String} strikeout  Font style - type of strike-out
 *
 * @memberOf Asc
 */
function FontProperties(family, size, bold, italic, underline, strikeout) {
	if ( !(this instanceof FontProperties) ) {
		return new FontProperties(family, size, bold, italic, underline, strikeout);
	}

	this.FontFamily = {Name: family, Index: -1, Angle : 0};
	this.FontSize   = size;
	this.Bold       = !!bold;
	this.Italic     = !!italic;
	this.Underline  = underline;
	this.Strikeout  = strikeout;

	return this;
}

FontProperties.prototype = {

	/** @type FontProperties */
	constructor: FontProperties,

	/**
	 * Assigns font preperties from another object
	 * @param {FontProperties} font
	 */
	copyFrom: function (font) {
		this.FontFamily.Name  = font.FontFamily.Name;
		this.FontFamily.Index = font.FontFamily.Index;
		this.FontSize  = font.FontSize;
		this.Bold      = font.Bold;
		this.Italic    = font.Italic;
		this.Underline = font.Underline;
		this.Strikeout = font.Strikeout;
	},

	/** @return {FontProperties} */
	clone: function () {
		return new FontProperties(this.FontFamily.Name, this.FontSize,
				this.Bold, this.Italic, this.Underline, this.Strikeout);
	},

	isEqual: function (font) {
		return font !== undefined &&
		       this.FontFamily.Name.toLowerCase() === font.FontFamily.Name.toLowerCase() &&
		       this.FontSize === font.FontSize &&
		       this.Bold === font.Bold &&
		       this.Italic === font.Italic;
	}

};



/**
 * Creates text metrics
 * -----------------------------------------------------------------------------
 * @constructor
 * @param {Number} width
 * @param {Number} height
 * @param {Number} lineHeight
 * @param {Number} baseline
 * @param {Number} descender
 * @param {Number} fontSize
 * @param {Number} centerline
 * @param {Number} widthBB
 *
 * @memberOf Asc
 */
function TextMetrics(width, height, lineHeight, baseline, descender, fontSize, centerline, widthBB) {
	if ( !(this instanceof TextMetrics) ) {
		return new TextMetrics(width, height, lineHeight, baseline, descender, fontSize, centerline, widthBB);
	}

	this.width      = width !== undefined ? width : 0;
	this.height     = height !== undefined ? height : 0;
	this.lineHeight = lineHeight !== undefined ? lineHeight : 0;
	this.baseline   = baseline !== undefined ? baseline : 0;
	this.descender  = descender !== undefined ? descender : 0;
	this.fontSize   = fontSize !== undefined ? fontSize : 0;
	this.centerline = centerline !== undefined ? centerline : 0;
	this.widthBB    = widthBB !== undefined ? widthBB : 0;

	return this;
}



/**
 * Creates font metrics
 * -----------------------------------------------------------------------------
 * @constructor
 * @param {Number} ascender
 * @param {Number} descender
 * @param {Number} lineGap
 *
 * @memberOf Asc
 */
function FontMetrics(ascender, descender, lineGap) {
	if ( !(this instanceof FontMetrics) ) {
		return new FontMetrics(ascender, descender, lineGap);
	}

	this.ascender  = ascender !== undefined ? ascender : 0;
	this.descender = descender !== undefined ? descender : 0;
	this.lineGap   = lineGap !== undefined ? lineGap : 0;

	return this;
}



/**
 * Emulates scalable canvas context
 * -----------------------------------------------------------------------------
 * @constructor
 * @param {Object} settings  Settings : {
 *   canvas : HTMLElement
 *   units  : units (0=px, 1=pt, 2=in, 3=mm)
 *   font   : FontProperties
 * }
 *
 * @memberOf Asc
 */
function DrawingContext(settings) {
	if ( !(this instanceof DrawingContext) ) {
		return new DrawingContext(settings);
	}

	this.setCanvas(settings.canvas);

	var ppiTest =
			$('<div style="position: absolute; width: 10in; height:10in; visibility:hidden; padding:0;"/>')
			.appendTo("body");
	this.ppiX = asc_round(ppiTest[0] ? (ppiTest[0].offsetWidth * 0.1) : 96);
	this.ppiY = asc_round(ppiTest[0] ? (ppiTest[0].offsetHeight * 0.1) : 96);
	ppiTest.remove();

	this._mct  = new Matrix();  // units transform
	this._mt   = new Matrix();  // user transform
    this._mbt  = new Matrix();  // bound transform
	this._mft  = new Matrix();  // full transform
	this._mift = new Matrix();  // inverted full transform
    this._im   = new Matrix();

	this.scaleFactor = 1;

	this._1px_x = getCvtRatio(0/*px*/, 3/*mm*/, this.ppiX);
	this._1px_y = getCvtRatio(0/*px*/, 3/*mm*/, this.ppiY);
	this.units  = 3/*mm*/;
	this.changeUnits(undefined !== settings.units ? settings.units : this.units);

	this.fmgrGraphics = undefined !== settings.fmgrGraphics ? settings.fmgrGraphics : null;
	if (null === this.fmgrGraphics) {return null;}

	/** @type FontProperties */
	this.font = undefined !== settings.font ? settings.font : null;
	// Font должен быть передан (он общий для всех DrawingContext, т.к. может возникнуть ситуация как в баге http://bugzserver/show_bug.cgi?id=19784)
	if (null === this.font) {return null;}

	// CColor
	this.fillColor = new CColor(255, 255, 255);
    return this;
}

DrawingContext.prototype = {

	/** @type DrawingContext */
	constructor: DrawingContext,

	/**
	 * Returns width of drawing context in current units
	 * @param {Number} units  Единицы измерения (0=px, 1=pt, 2=in, 3=mm) в которых будет возвращена ширина
	 * @return {Number}
	 */
	getWidth: function (units) {
		var i = units >= 0 && units <=3 ? units : this.units;
		return this.canvas.width * getCvtRatio(0/*px*/, i, this.ppiX);
	},

	/**
	 * Returns height of drawing context in current units
	 * @param {Number} units  Единицы измерения (0=px, 1=pt, 2=in, 3=mm) в которых будет возвращена высота
	 * @return {Number}
	 */
	getHeight: function (units) {
		var i = units >= 0 && units <=3 ? units : this.units;
		return this.canvas.height * getCvtRatio(0/*px*/, i, this.ppiY);
	},

	/**
	 * Returns canvas element
	 * @type {Element}
	 */
	getCanvas: function () {
		return this.canvas;
	},

	/**
	 *
	 * @param canvas
	 */
	setCanvas: function (canvas) {
		if (null == canvas) {return;}
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		if (this.ctx.mozImageSmoothingEnabled) {
			this.ctx.mozImageSmoothingEnabled = false;
		}
	},

	/**
	 * Returns pixels per inch ratio
	 * @type {Number}
	 */
	getPPIX: function () {
		return this.ppiX;
	},

	/**
	 * Returns pixels per inch ratio
	 * @type {Number}
	 */
	getPPIY: function () {
		return this.ppiY;
	},

	/**
	 * Returns currrent units (0=px, 1=pt, 2=in, 3=mm)
	 * @type {Number}
	 */
	getUnits: function () {
		return this.units;
	},

	/**
	 * Changes units of drawing context
	 * @param {Number} units  New units of drawing context (0=px, 1=pt, 2=in, 3=mm)
	 */
	changeUnits: function (units) {
		var i = units >= 0 && units <=3 ? units : 0;
		this._mct.sx = getCvtRatio(i, 0/*px*/, this.ppiX);
		this._mct.sy = getCvtRatio(i, 0/*px*/, this.ppiY);
		this._calcMFT();
		this._1px_x = getCvtRatio(0/*px*/, i, this.ppiX);
		this._1px_y = getCvtRatio(0/*px*/, i, this.ppiY);
		this.units = units;
		return this;
	},

	/**
	 * Returns currrent zoom ratio
	 * @type {Number}
	 */
	getZoom: function () {
		return this.scaleFactor;
	},

	/**
	 * Changes scale factor of drawing context by changing its PPI
	 * @param {Number} factor
	 */
	changeZoom: function (factor) {
		if (factor <= 0) {throw "Scale factor must be >= 0";}

		factor = asc_round(factor * 1000) / 1000;

		this.ppiX = asc_round(this.ppiX / this.scaleFactor * factor * 1000) / 1000;
		this.ppiY = asc_round(this.ppiY / this.scaleFactor * factor * 1000) / 1000;
		this.scaleFactor = factor;

		// reinitialize
		this.changeUnits(this.units);
		this.setFont(this.font);

		return this;
	},

	/**
	 * Resets dimensions of drawing context (canvas 'width' and 'height' attributes)
	 * @param {Number} width   New width in current units
	 * @param {Number} height  New height in current units
	 */
	resetSize: function (width, height) {
		var w = asc_round( width  * getCvtRatio(this.units, 0/*px*/, this.ppiX) ),
		    h = asc_round( height * getCvtRatio(this.units, 0/*px*/, this.ppiY) );
		if (w !== this.canvas.width) {
			this.canvas.width = w;
		}
		if (h !== this.canvas.height) {
			this.canvas.height = h;
		}
		return this;
	},

	/**
	 * Expands dimensions of drawing context (canvas 'width' and 'height' attributes)
	 * @param {Number} width   New width in current units
	 * @param {Number} height  New height in current units
	 */
	expand: function (width, height) {
		var w = asc_round( width  * getCvtRatio(this.units, 0/*px*/, this.ppiX) ),
		    h = asc_round( height * getCvtRatio(this.units, 0/*px*/, this.ppiY) );
		if (w > this.canvas.width) {
			this.canvas.width = w;
		}
		if (h > this.canvas.height) {
			this.canvas.height = h;
		}
		return this;
	},

	// Canvas methods

	clear: function () {
		this.clearRect(0, 0, this.getWidth(), this.getHeight());
		return this;
	},

	save: function () {
		this.ctx.save();
		return this;
	},

	restore: function () {
		this.ctx.restore();
		return this;
	},

	scale: function (kx, ky) {
		//TODO: implement scale()
		return this;
	},

	rotate: function (a) {
		//TODO: implement rotate()
		return this;
	},

	translate: function (dx, dy) {
		//TODO: implement translate()
		return this;
	},

	transform: function (sx, shy, shx, sy, tx, ty) {
		//TODO: implement transform()
		return this;
	},

    setTransform: function(sx, shy, shx, sy, tx, ty) {
        this._mbt.assign(sx, shx, shy, sy, tx, ty);
        return this;
    },

    setTextTransform: function(sx, shy, shx, sy, tx, ty) {
        this._mt.assign(sx, shx, shy, sy, tx, ty);
        return this;
    },

    updateTransforms: function() {
        this._calcMFT();
        this.fmgrGraphics[1].SetTextMatrix(
            this._mt.sx, this._mt.shy, this._mt.shx, this._mt.sy, this._mt.tx, this._mt.ty);
    },

    resetTransforms: function(){
        this.setTransform(this._im.sx, this._im.shy, this._im.shx, this._im.sy, this._im.tx, this._im.ty);
        this.setTextTransform(this._im.sx, this._im.shy, this._im.shx, this._im.sy, this._im.tx, this._im.ty);
        this._calcMFT();
    },

	// Style methods

	getFillStyle: function () {
		return this.ctx.fillStyle;
	},

	getStrokeStyle: function () {
		return this.ctx.strokeStyle;
	},

	getLineWidth: function () {
		return this.ctx.lineWidth;
	},

	getLineCap: function () {
		return this.ctx.lineCap;
	},

	getLineJoin: function () {
		return this.ctx.lineJoin;
	},

	/**
	 * @param {RgbColor || ThemeColor || CColor} val
	 * @returns {DrawingContext}
	 */
	setFillStyle: function (val) {
		var _r = val.getR();
		var _g = val.getG();
		var _b = val.getB();
		var _a = val.getA();
		this.fillColor = new CColor(_r, _g, _b, _a);
		this.ctx.fillStyle = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
		return this;
	},

	setFillPattern: function (val) {
		this.ctx.fillStyle = val;
		return this;
	},

	/**
	 * @param {RgbColor || ThemeColor || CColor} val
	 * @returns {DrawingContext}
	 */
	setStrokeStyle: function (val) {
		var _r = val.getR();
		var _g = val.getG();
		var _b = val.getB();
		var _a = val.getA();
		this.ctx.strokeStyle = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
		return this;
	},

	setLineWidth: function (width) {
		this.ctx.lineWidth = width;
		return this;
	},

	setLineCap: function (cap) {
		this.ctx.lineCap = cap;
		return this;
	},

	setLineJoin: function (join) {
		this.ctx.lineJoin = join;
		return this;
	},

	fillRect: function (x, y, w, h) {
		var r = this._calcRect(x, y, w, h);
		this.ctx.fillRect(r.x, r.y, r.w, r.h);
		return this;
	},

	strokeRect: function (x, y, w, h) {
		var r = this._calcRect(x, y, w, h);
		this.ctx.strokeRect(r.x+0.5, r.y+0.5, r.w-1, r.h-1);
		return this;
	},

	clearRect: function (x, y, w, h) {
		var r = this._calcRect(x, y, w, h);
		this.ctx.clearRect(r.x, r.y, r.w, r.h);
		return this;
	},

	// Font and text methods

	getFont: function () {
		return this.font.clone();
	},

	getFontFamily: function () {
		return this.font.FontFamily.Name;
	},

	getFontSize: function () {
		return this.font.FontSize;
	},

	/**
	 * @param {Number} units  Units of result (0=px, 1=pt, 2=in, 3=mm)
	 * @return {FontMetrics}
	 */
	getFontMetrics: function (units) {
		var fm = this.fmgrGraphics[0],
		    d  = Math.abs(fm.m_lDescender),
		    r  = getCvtRatio(0/*px*/, units >= 0 && units <=3 ? units : this.units, this.ppiX),
		    factor = this.getFontSize() * r / fm.m_lUnits_Per_Em;
		return new FontMetrics(
			factor * fm.m_lAscender,
			factor * d,
			factor * (fm.m_lLineHeight - fm.m_lAscender - d)
		);
	},

    setFont: function (font, angle) {
        var italic, bold, fontStyle, r;

        if (font.FontFamily.Index === undefined ||
            font.FontFamily.Index === null ||
            font.FontFamily.Index === -1) {
            font.FontFamily.Index = window.g_map_font_index[font.FontFamily.Name];
        }

        this.font.copyFrom(font);

        italic = true === font.Italic;
        bold   = true === font.Bold;

        fontStyle = FontStyle.FontStyleRegular;
        if ( !italic && bold )
            fontStyle = FontStyle.FontStyleBold;
        else if ( italic && !bold )
            fontStyle = FontStyle.FontStyleItalic;
        else if ( italic && bold )
            fontStyle = FontStyle.FontStyleBoldItalic;

        if (angle && 0 != angle) {
            r = window.g_font_infos[ font.FontFamily.Index ].LoadFont(
                window.g_font_loader, this.fmgrGraphics[1], font.FontSize, fontStyle, this.ppiX, this.ppiY);

            this.fmgrGraphics[1].SetTextMatrix(
                this._mt.sx, this._mt.shy, this._mt.shx, this._mt.sy, this._mt.tx, this._mt.ty);
        } else {
            r = window.g_font_infos[ font.FontFamily.Index ].LoadFont(
                window.g_font_loader, this.fmgrGraphics[0], font.FontSize, fontStyle, this.ppiX, this.ppiY);
        }

        if (r === false) {
            throw "Can not use " + font.FontFamily.Name + " font. (Check whether font file is loaded)";
        }

        return this;
    },

	/**
	 * Returns dimensions of first char of string
	 * @param {String} text   Character to measure
	 * @param {Number} units  Units (0 = px, 1 = pt, 2 = in, 3 = mm)
	 * @return {TextMetrics}  Returns the char dimension
	 */
	measureChar: function (text, units) {
		return this.measureText(text.charAt(0), units);
	},

	/**
	 * Returns dimensions of string
	 * @param {String} text   String to measure
	 * @param {Number} units  Units (0 = px, 1 = pt, 2 = in, 3 = mm)
	 * @return {TextMetrics}  Returns the dimension of string {width: w, height: h}
	 */
	measureText: function (text, units) {
		var fm = this.fmgrGraphics[0],
		    r  = getCvtRatio(0/*px*/, units >= 0 && units <=3 ? units : this.units, this.ppiX);
		for (var tmp, w = 0, w2 = 0, i = 0; i < text.length; ++i) {
			tmp = fm.MeasureChar( text.charCodeAt(i) );
			w += tmp.fAdvanceX;
		}
		w2 = w - tmp.fAdvanceX + tmp.oBBox.fMaxX - tmp.oBBox.fMinX + 1;
		return this._calcTextMetrics(w * r, w2 * r, fm, r);
	},
	
	getHeightText: function()
    {
        var fm = this.fmgrGraphics[0];
		var UnitsPerEm = fm.m_lUnits_Per_Em;
        var Height     = fm.m_lLineHeight;
		var setUpSize  = this.font.FontSize;
        return Height * setUpSize / UnitsPerEm;
    },

	fillGlyph: function (pGlyph, fmgr) {
		var nW = pGlyph.oBitmap.nWidth;
		var nH = pGlyph.oBitmap.nHeight;

		if ( !(nW > 0 && nH > 0) ) {return;}

		var nX = asc_floor(fmgr.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
		var nY = asc_floor(fmgr.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

		var _r = this.fillColor.r;
		var _g = this.fillColor.g;
		var _b = this.fillColor.b;

		if (window.g_isMobileVersion) {
			// Special for iPad (5.1)

			if (!_r && !_g && !_b) {
				this.ctx.drawImage(pGlyph.oBitmap.oGlyphData.m_oCanvas, 0, 0, nW, nH, nX, nY, nW, nH);
			} else {
				var canvD = $("<canvas width='"+nW+"' height='"+nH+"'/>")[0];
				var ctxD = canvD.getContext("2d");
				var pixDst = ctxD.getImageData(0, 0, nW, nH);
				var dstP = pixDst.data;
				var data = pGlyph.oBitmap.oGlyphData.m_oContext.getImageData(0, 0, nW, nH);
				var dataPx = data.data;
				var cur = 0;
				var cnt = 4 * nW * nH;
				for (var i = 3; i < cnt; i += 4) {
					dstP[cur++] = _r;
					dstP[cur++] = _g;
					dstP[cur++] = _b;
					dstP[cur++] = dataPx[i];
				}
				ctxD.putImageData(pixDst, 0, 0, 0, 0, nW, nH);
				this.ctx.drawImage(canvD, 0, 0, nW, nH, nX, nY, nW, nH);
			}
		} else {
			pGlyph.oBitmap.oGlyphData.checkColor(_r, _g, _b, nW, nH);
			pGlyph.oBitmap.draw(this.ctx, nX, nY);
		}
	},
	
	fillText: function (text, x, y, maxWidth, charWidths, angle) {
        var manager = angle ? this.fmgrGraphics[1] : this.fmgrGraphics[0];

        var _x = this._mift.transformPointX(x, y);
        var _y = this._mift.transformPointY(x, y);

        var length = text.length;
        for (var i = 0; i < length; ++i) {
            try {
                _x = manager.LoadString2C(text.charAt(i), _x, _y);
            } catch(err) {
                // do nothing
            }
            var pGlyph = manager.m_oGlyphString.m_pGlyphsBuffer[0];
            if (null === pGlyph || null === pGlyph.oBitmap) {continue;}

            this.fillGlyph(pGlyph, manager);
        }

        return this;
    },

	// Path methods

	beginPath: function () {
		this.ctx.beginPath();
		return this;
	},

	closePath: function () {
		this.ctx.closePath();
		return this;
	},

	moveTo: function (x, y) {
		var r = this._calcRect(x, y);
		this.ctx.moveTo(r.x, r.y);
		return this;
	},

	lineTo: function (x, y) {
		var r = this._calcRect(x, y);
		this.ctx.lineTo(r.x, r.y);
		return this;
	},

	lineDiag : function (x1, y1, x2, y2) {
		var isEven = 0 !== this.ctx.lineWidth % 2 ? 0.5 : 0;
		var r1 = this._calcRect(x1, y1);
		var r2 = this._calcRect(x2, y2);
		this.ctx.moveTo(r1.x + isEven, r1.y + isEven);
		this.ctx.lineTo(r2.x + isEven, r2.y + isEven);
		return this;
	},
	lineHor : function (x1, y, x2) {
		var isEven = 0 !== this.ctx.lineWidth % 2 ? 0.5 : 0;
		var r1 = this._calcRect(x1, y);
		var r2 = this._calcRect(x2, y);
		this.ctx.moveTo(r1.x, r1.y + isEven);
		this.ctx.lineTo(r2.x, r2.y + isEven);
		return this;
	},
	lineVer : function (x, y1, y2) {
		var isEven = 0 !== this.ctx.lineWidth % 2 ? 0.5 : 0;
		var r1 = this._calcRect(x, y1);
		var r2 = this._calcRect(x, y2);
		this.ctx.moveTo(r1.x + isEven, r1.y);
		this.ctx.lineTo(r2.x + isEven, r2.y);
		return this;
	},

	dashLineCleverHor : function (x1, y, x2) {
		var w_dot = c_oAscCoAuthoringDottedWidth, w_dist = c_oAscCoAuthoringDottedDistance;
		var _x1 = this._mct.transformPointX(x1, y);
		var _y  = this._mct.transformPointY(x1, y);
		var _x2 = this._mct.transformPointX(x2, y);
		var ctx = this.ctx;

		_x1 = (_x1 >> 0) + 0.5;
		_y  = (_y  >> 0) + 0.5;
		_x2 = (_x2 >> 0) + 0.5;

		for (; _x1 < _x2; _x1 += w_dist) {
			ctx.moveTo(_x1, _y);
			_x1 += w_dot;

			if (_x1 > _x2)
				_x1 = _x2;

			ctx.lineTo(_x1, _y);
		}
	},
	dashLineCleverVer : function (x, y1, y2) {
		var w_dot = c_oAscCoAuthoringDottedWidth, w_dist = c_oAscCoAuthoringDottedDistance;
		var _y1 = this._mct.transformPointY(x, y1);
		var _x  = this._mct.transformPointX(x, y1);
		var _y2 = this._mct.transformPointY(x, y2);
		var ctx = this.ctx;

		_y1 = (_y1 >> 0) + 0.5;
		_x  = (_x  >> 0) + 0.5;
		_y2 = (_y2 >> 0) + 0.5;

		for (; _y1 < _y2; _y1 += w_dist) {
			ctx.moveTo(_x, _y1);
			_y1 += w_dot;

			if (_y1 > _y2)
				_y1 = _y2;

			ctx.lineTo(_x, _y1);
		}
	},

	dashLine: function (x1, y1, x2, y2, w_dot, w_dist) {
		var len = Math.sqrt ((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
		if (len < 1)
			len = 1;

		var len_x1 = Math.abs(w_dot *(x2 - x1)/len);
		var len_y1 = Math.abs(w_dot *(y2 - y1)/len);
		var len_x2 = Math.abs(w_dist*(x2 - x1)/len);
		var len_y2 = Math.abs(w_dist*(y2 - y1)/len);
		var i, j;

		if (x1 <= x2 && y1 <= y2) {
			for (i = x1, j = y1; i < x2 || j < y2; i += len_x2, j += len_y2) {
				this.moveTo(i, j);

				i += len_x1;
				j += len_y1;

				if (i > x2)
					i = x2;
				if (j > y2)
					j = y2;

				this.lineTo(i, j);
			}
		} else if (x1 <= x2 && y1 > y2) {
			for (i = x1, j = y1; i < x2 || j > y2; i += len_x2, j -= len_y2) {
				this.moveTo(i, j);

				i += len_x1;
				j -= len_y1;

				if (i > x2)
					i = x2;
				if (j < y2)
					j = y2;

				this.lineTo(i, j);
			}
		} else if (x1 > x2 && y1 <= y2) {
			for (i = x1, j = y1; i > x2 || j < y2; i -= len_x2, j += len_y2) {
				this.moveTo(i, j);

				i -= len_x1;
				j += len_y1;

				if (i < x2)
					i = x2;
				if (j > y2)
					j = y2;

				this.lineTo(i, j);
			}
		} else {
			for (i = x1, j = y1; i > x2 || j > y2; i -= len_x2, j -= len_y2) {
				this.moveTo(i, j);

				i -= len_x1;
				j -= len_y1;

				if (i < x2)
					i = x2;
				if (j < y2)
					j = y2;

			this.lineTo(i, j);
			}
		}
	},

	dashRect: function (x1, y1, x2, y2, x3, y3, x4, y4, w_dot, w_dist) {
		this.dashLine(x1, y1, x2, y2, w_dot, w_dist);
		this.dashLine(x2, y2, x4, y4, w_dot, w_dist);
		this.dashLine(x4, y4, x3, y3, w_dot, w_dist);
		this.dashLine(x3, y3, x1, y1, w_dot, w_dist);
	},

	rect: function (x, y, w, h) {
		var r = this._calcRect(x, y, w, h);
		this.ctx.rect(r.x, r.y, r.w, r.h);
		return this;
	},

	arc: function (x, y, radius, startAngle, endAngle, antiClockwise, dx, dy) {
		var r = this._calcRect(x, y);
		dx = typeof dx !== "undefined" ? dx : 0;
		dy = typeof dy !== "undefined" ? dy : 0;
		this.ctx.arc(r.x + dx, r.y + dy, radius, startAngle, endAngle, antiClockwise);
		return this;
	},

	bezierCurveTo: function (x1, y1, x2, y2, x3, y3) {
		var p1 = this._calcRect(x1, y1),
		    p2 = this._calcRect(x2, y2),
		    p3 = this._calcRect(x3, y3);
		this.ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		return this;
	},

	fill: function () {
		this.ctx.fill();
		return this;
	},

	stroke: function () {
		this.ctx.stroke();
		return this;
	},

	clip: function () {
		this.ctx.clip();
		return this;
	},

	// Image methods

	drawImage: function (img, sx, sy, sw, sh, dx, dy, dw, dh) {
		var sr = this._calcRect(sx, sy, sw, sh),
		    dr = this._calcRect(dx, dy, dw, dh);
		this.ctx.drawImage(img, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, dr.w, dr.h);
		return this;
	},

	// Private methods

	_calcRect: function (x, y, w, h) {
		var wh = w !== undefined && h !== undefined,
		    x2 = x + w - this._1px_x,
		    y2 = y + h - this._1px_y,
		    _x = this._mft.transformPointX(x, y),
		    _y = this._mft.transformPointY(x, y);
		return {
			x: asc_round(_x),
			y: asc_round(_y),
			w: wh ? asc_round(this._mft.transformPointX(x2, y2) - _x + 1) : undefined,
			h: wh ? asc_round(this._mft.transformPointY(x2, y2) - _y + 1) : undefined
		};
	},

	_calcMFT: function () {
		this._mft = this._mct.clone();
        this._mft.multiply(this._mbt, MATRIX_ORDER_PREPEND);
        this._mft.multiply(this._mt, MATRIX_ORDER_PREPEND);

        this._mift = this._mt.clone();
        this._mift.invert();
        this._mift.multiply(this._mft, MATRIX_ORDER_PREPEND);
	},

	/**
	 * @param {Number} w         Ширина текста
	 * @param {Number} wBB       Ширина Bound Box текста
	 * @param {CFontManager} fm  Объект CFontManager для получения метрик шрифта
	 * @param {Number} r         Коэффициент перевода pt -> в текущие единицы измерения (this.units)
	 * @return {TextMetrics}
	 */
	_calcTextMetrics: function (w, wBB, fm, r) {
		var factor = this.getFontSize() * r / fm.m_lUnits_Per_Em,
		    l = fm.m_lLineHeight * factor,
		    b = fm.m_lAscender * factor,
		    d = Math.abs(fm.m_lDescender * factor);
		return new TextMetrics(w, b + d, l, b, d, this.font.FontSize, 0, wBB);
	}
};


/*
 * Export
 * -----------------------------------------------------------------------------
 */

window["Asc"].getCvtRatio      = getCvtRatio;
window["Asc"].calcNearestPt    = calcNearestPt;
window["Asc"].colorObjToAscColor = colorObjToAscColor;

window["Asc"].FontProperties   = FontProperties;
window["Asc"].TextMetrics      = TextMetrics;
window["Asc"].FontMetrics      = FontMetrics;
window["Asc"].DrawingContext   = DrawingContext;
window["Asc"].Matrix           = Matrix;

})(jQuery, window);
