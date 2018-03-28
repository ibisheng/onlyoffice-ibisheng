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

(function(window, undefined){

// Import
var CellValueType = AscCommon.CellValueType;
var c_oAscBorderWidth = AscCommon.c_oAscBorderWidth;
var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
var FormulaTablePartInfo = AscCommon.FormulaTablePartInfo;
var parserHelp = AscCommon.parserHelp;
var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;
	var History = AscCommon.History;

var UndoRedoDataTypes = AscCommonExcel.UndoRedoDataTypes;
var UndoRedoData_IndexSimpleProp = AscCommonExcel.UndoRedoData_IndexSimpleProp;

var c_oAscCustomAutoFilter = Asc.c_oAscCustomAutoFilter;
var c_oAscAutoFilterTypes = Asc.c_oAscAutoFilterTypes;

var g_oColorManager = null;
	
var g_nHSLMaxValue = 255;
var g_nColorTextDefault = 1;
var g_nColorHyperlink = 10;
var g_nColorHyperlinkVisited = 11;

var g_oThemeColorsDefaultModsSpreadsheet = [
    [0, -4.9989318521683403E-2, -0.14999847407452621, -0.249977111117893, -0.34998626667073579, -0.499984740745262],
    [0, -9.9978637043366805E-2, -0.249977111117893, -0.499984740745262, -0.749992370372631, -0.89999084444715716],
    [0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
    [0, 0.89999084444715716, 0.749992370372631, 0.499984740745262, 0.249977111117893, 9.9978637043366805E-2],
    [0, 0.499984740745262, 0.34998626667073579, 0.249977111117893, 0.14999847407452621, 4.9989318521683403E-2]];

var map_themeExcel_to_themePresentation = {
	0: 12,
	1: 8,
	2: 13,
	3: 9,
	4: 0,
	5: 1,
	6: 2,
	7: 3,
	8: 4,
	9: 5,
	10: 11,
	11: 10
};
function shiftGetBBox(bbox, bHor)
{
	var bboxGet = null;
	if(bHor)
		bboxGet = Asc.Range(bbox.c1, bbox.r1, gc_nMaxCol0, bbox.r2);
	else
		bboxGet = Asc.Range(bbox.c1, bbox.r1, bbox.c2, gc_nMaxRow0);
	return bboxGet;
}
function shiftSort(a, b, offset)
{
	var nRes = 0;
	if(null == a.to || null == b.to)
	{
		if(null == a.to && null == b.to)
			nRes = 0;
		else if(null == a.to)
			nRes = -1;
		else if(null == b.to)
			nRes = 1;
	}
	else
	{
	    if (0 != offset.offsetRow) {
	        if (offset.offsetRow > 0)
	            nRes = b.to.r1 - a.to.r1;
	        else
	            nRes = a.to.r1 - b.to.r1;
	    }
	    if (0 == nRes && 0 != offset.offsetCol) {
	        if (offset.offsetCol > 0)
	            nRes = b.to.c1 - a.to.c1;
	        else
	            nRes = a.to.c1 - b.to.c1;
	    }
	}
	return nRes;
}
function createRgbColor(r, g, b) {
	return new RgbColor((r << 16) + (g << 8) + b);
}
var g_oRgbColorProperties = {
		rgb : 0
	};
function RgbColor(rgb)
{
	this.rgb = rgb;

	this._hash;
}
RgbColor.prototype =
{
	Properties: g_oRgbColorProperties,
	getHash: function() {
		if (!this._hash) {
			this._hash = this.rgb;
		}
		return this._hash;
	},
	clone : function()
	{
		return new RgbColor(this.rgb);
	},
	getType : function()
	{
		return UndoRedoDataTypes.RgbColor;
	},
	getProperties : function()
	{
		return this.Properties;
	},

    isEqual: function(oColor)
    {
        if(!oColor || !(oColor instanceof RgbColor)){
            return false;
        }
        if(this.rgb !== oColor.rgb){
            return false;
        }
        return true;
    },

	getProperty : function(nType)
	{
		switch(nType)
		{
		case this.Properties.rgb:return this.rgb;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
		case this.Properties.rgb: this.rgb = value;break;
		}
	},
	Write_ToBinary2 : function(oBinaryWriter)
	{
		oBinaryWriter.WriteLong(this.rgb);
	},
	Read_FromBinary2 : function(oBinaryReader)
	{
		this.rgb = oBinaryReader.GetULongLE();
	},
	getRgb : function()
	{
		return this.rgb;
	},
	getR : function()
	{
		return (this.rgb >> 16) & 0xff;
	},
	getG : function()
	{
		return (this.rgb >> 8) & 0xff;
	},
	getB : function()
	{
		return this.rgb & 0xff;
	},
	getA : function () {
		return 1;
	}
};
var g_oThemeColorProperties = {
		rgb: 0,
		theme: 1,
		tint: 2
	};
function ThemeColor()
{
	this.rgb = null;
	this.theme = null;
	this.tint = null;

	this._hash;
}
ThemeColor.prototype =
{
	Properties: g_oThemeColorProperties,
	getHash: function() {
		if (!this._hash) {
			this._hash = this.theme + ';' + this.tint;
		}
		return this._hash;
	},
	clone : function()
	{
		//ThemeColor must be created by g_oColorManager for correct rebuild
		//no need getThemeColor because it return same object
		return this;
	},
	getType : function()
	{
		return UndoRedoDataTypes.ThemeColor;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
		case this.Properties.rgb:return this.rgb;break;
		case this.Properties.theme:return this.theme;break;
		case this.Properties.tint:return this.tint;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
		case this.Properties.rgb: this.rgb = value;break;
		case this.Properties.theme: this.theme= value;break;
		case this.Properties.tint: this.tint = value;break;
		}
	},
    isEqual: function(oColor)
    {
        if(!oColor){
            return false;
        }
        if(this.theme !== oColor.theme){
            return false;
        }
        if(!AscFormat.fApproxEqual(this.tint, oColor.tint)){
            return false;
        }
        return true;
    },
	Write_ToBinary2 : function(oBinaryWriter)
	{
		oBinaryWriter.WriteByte(this.theme);
		if(null != this.tint)
		{
			oBinaryWriter.WriteByte(true);
			oBinaryWriter.WriteDouble2(this.tint);
		}
		else
		{
			oBinaryWriter.WriteBool(false);
		}
	},
	Read_FromBinary2AndReplace : function(oBinaryReader)
	{
		this.theme = oBinaryReader.GetUChar();
		var bTint = oBinaryReader.GetBool();
		if(bTint)
			this.tint = oBinaryReader.GetDoubleLE();
		return g_oColorManager.getThemeColor(this.theme, this.tint);
	},
	getRgb : function()
	{
		return this.rgb;
	},
	getR : function()
	{
		return (this.rgb >> 16) & 0xff;
	},
	getG : function()
	{
		return (this.rgb >> 8) & 0xff;

	},
	getB : function()
	{
		return this.rgb & 0xff;
	},
	getA : function () {
		return 1;
	},
	rebuild : function(theme)
	{
		var nRes = 0;
		var r = 0;
		var g = 0;
		var b = 0;
		if(null != this.theme && null != theme)
		{
			var oUniColor = theme.themeElements.clrScheme.colors[map_themeExcel_to_themePresentation[this.theme]];
			if(null != oUniColor)
			{
				var rgba = oUniColor.color.RGBA;
				if(null != rgba)
				{
					r = rgba.R;
					g = rgba.G;
					b = rgba.B;
				}
			}
			if(null != this.tint && 0 != this.tint)
			{
				var oCColorModifiers = new AscFormat.CColorModifiers();
				var HSL = {H: 0, S: 0, L: 0};
				oCColorModifiers.RGB2HSL(r, g, b, HSL);
				if (this.tint < 0)
					HSL.L = HSL.L * (1 + this.tint);
				else
					HSL.L = HSL.L * (1 - this.tint) + (g_nHSLMaxValue - g_nHSLMaxValue * (1 - this.tint));
				HSL.L >>= 0;
				var RGB = {R: 0, G: 0, B: 0};
				oCColorModifiers.HSL2RGB(HSL, RGB);
				r = RGB.R;
				g = RGB.G;
				b = RGB.B;
			}
			nRes |= b;
			nRes |= g << 8;
			nRes |= r << 16;
		}
		this.rgb = nRes;
	}
};
function CorrectAscColor(asc_color)
{
	if (null == asc_color)
		return null;

	var ret = null;

	var _type = asc_color.asc_getType();
	switch (_type)
	{
		case Asc.c_oAscColor.COLOR_TYPE_SCHEME:
		{
			// тут выставляется ТОЛЬКО из меню. поэтому:
			var _index = asc_color.asc_getValue() >> 0;
			var _id = (_index / 6) >> 0;
			var _pos = _index - _id * 6;
			var basecolor = g_oColorManager.getThemeColor(_id);
			var aTints = g_oThemeColorsDefaultModsSpreadsheet[AscCommon.GetDefaultColorModsIndex(basecolor.getR(), basecolor.getG(), basecolor.getB())];
			var tint = aTints[_pos];
			ret = g_oColorManager.getThemeColor(_id, tint);
			break;
		}
		default:
		{
			ret = createRgbColor(asc_color.asc_getR(), asc_color.asc_getG(), asc_color.asc_getB());
		}
	}
	return ret;
}
function ColorManager()
{
	this.theme = null;
	this.aColors = new Array(12);
}
ColorManager.prototype =
{
	isEqual : function(color1, color2)
	{
		var bRes = false;
		if(null == color1 && null == color2)
			bRes = true;
		else if(null != color1 && null != color2)
		{
			if((color1 instanceof ThemeColor && color2 instanceof ThemeColor) || (color1 instanceof RgbColor && color2 instanceof RgbColor))
				bRes =  color1.getRgb() == color2.getRgb();
		}
		return bRes;
	},
	setTheme : function(theme)
	{
		this.theme = theme;
		this.rebuildColors();
	},
	getThemeColor : function(theme, tint)
	{
		if(null == tint)
			tint = null;
		var oColorObj = this.aColors[theme];
		if(null == oColorObj)
		{
			oColorObj = {};
			this.aColors[theme] = oColorObj;
		}
		var oThemeColor = oColorObj[tint];
		if(null == oThemeColor)
		{
			oThemeColor = new ThemeColor();
			oThemeColor.theme = theme;
			oThemeColor.tint = tint;
			if(null != this.theme)
				oThemeColor.rebuild(this.theme);
			oColorObj[tint] = oThemeColor;
		}
		return oThemeColor;
	},
	rebuildColors : function()
	{
		if(null != this.theme)
		{
			for(var i = 0, length = this.aColors.length; i < length; ++i)
			{
				var oColorObj = this.aColors[i];
				for(var j in oColorObj)
				{
					var oThemeColor = oColorObj[j];
					oThemeColor.rebuild(this.theme);
				}
			}
		}
	}
};
g_oColorManager = new ColorManager();

	var g_oDefaultFormat = {
		XfId: null,
		Font: null,
		Fill: null,
		Num: null,
		Border: null,
		Align: null,
		FillAbs: null,
		NumAbs: null,
		BorderAbs: null,
		AlignAbs: null,
		ColorAuto: new RgbColor(0)
	};

	/** @constructor */
	function Fragment(val) {
		this.text = null;
		this.format = null;
		this.sFormula = null;
		this.sId = null;
		if (null != val) {
			this.set(val);
		}
	}

	Fragment.prototype.clone = function () {
		return new Fragment(this);
	};
	Fragment.prototype.set = function (oVal) {
		if (null != oVal.text) {
			this.text = oVal.text;
		}
		if (null != oVal.format) {
			this.format = oVal.format;
		}
		if (null != oVal.sFormula) {
			this.sFormula = oVal.sFormula;
		}
		if (null != oVal.sId) {
			this.sId = oVal.sId;
		}
	};
	Fragment.prototype.checkVisitedHyperlink = function (row, col, hyperlinkManager) {
		var color = this.format.getColor();
		if (color instanceof AscCommonExcel.ThemeColor && g_nColorHyperlink === color.theme && null === color.tint) {
			//для посещенных гиперссылок
			var hyperlink = hyperlinkManager.getByCell(row, col);
			if (hyperlink && hyperlink.data.getVisited()) {
				this.format.setColor(g_oColorManager.getThemeColor(g_nColorHyperlinkVisited, null));
			}
		}
	};

	function readValAttr(attr){
		if(attr()){
			var val = attr()["val"];
			return val ? val : null;
		}
		return null;
	}
	function getNumFromXml(val) {
		return val ? val - 0 : null;
	}
	function getColorFromXml(attr) {
		if(attr()){
			var vals = attr();
			if(null != vals["theme"]) {
				return AscCommonExcel.g_oColorManager.getThemeColor(getNumFromXml(vals["theme"]), getNumFromXml(vals["tint"]));
			} else if(null != vals["rgb"]){
				return new AscCommonExcel.RgbColor(0x00ffffff & getNumFromXml(vals["rgb"]));
			}
		}
		return null;
	}

var g_oFontProperties = {
		fn: 0,
		scheme: 1,
		fs: 2,
		b: 3,
		i: 4,
		u: 5,
		s: 6,
		c: 7,
		va: 8
	};

	/** @constructor */
	function Font() {
		this.fn = null;
		this.scheme = null;
		this.fs = null;
		this.b = null;
		this.i = null;
		this.u = null;
		this.s = null;
		this.c = null;
		this.va = null;
		this.skip = null;
		this.repeat = null;

		this._hash;
		this._index;
	}
	Font.prototype.Properties = g_oFontProperties;
	Font.prototype.getHash = function() {
		if(!this._hash){
			var color = this.c ? this.c.getHash() : '';
			this._hash = this.fn + '|' +this.scheme + '|' +this.fs + '|' +this.b + '|' +this.i + '|' +this.u + '|' +
				this.s + '|' + color + '|' +this.va + '|' + this.skip + '|' +this.repeat;
		}
		return this._hash;
	};
	Font.prototype.getIndexNumber = function() {
		return this._index;
	};
	Font.prototype.setIndexNumber = function(val) {
		return this._index = val;
	};
	Font.prototype.assign = function(font) {
		this.fn = font.fn;
		this.scheme = font.scheme;
		this.fs = font.fs;
		this.b = font.b;
		this.i = font.i;
		this.u = font.u;
		this.s = font.s;
		this.c = font.c;
		this.va = font.va;
		this.skip = font.skip;
		this.repeat = font.repeat;
	};
	Font.prototype.assignFromObject = function(font) {
		if (null != font.fn) {
			this.setName(font.fn);
		}
		if (null != font.scheme) {
			this.setScheme(font.scheme);
		}
		if (null != font.fs) {
			this.setSize(font.fs);
		}
		if (null != font.b) {
			this.setBold(font.b);
		}
		if (null != font.i) {
			this.setItalic(font.i);
		}
		if (null != font.u) {
			this.setUnderline(font.u);
		}
		if (null != font.s) {
			this.setStrikeout(font.s);
		}
		if (null != font.c) {
			this.setColor(font.c);
		}
		if (null != font.va) {
			this.setVerticalAlign(font.va);
		}
		if (null != font.skip) {
			this.setSkip(font.skip);
		}
		if (null != font.repeat) {
			this.setRepeat(font.repeat);
		}
	};
	Font.prototype.merge = function (font, isTable) {
		var oRes = new Font();
		oRes.fn = this.fn || font.fn;
		oRes.scheme = this.scheme || font.scheme;
		oRes.fs = this.fs || font.fs;
		oRes.b = this.b || font.b;
		oRes.i = this.i || font.i;
		oRes.s = this.s || font.s;
		oRes.u = this.u || font.u;
		//заглушка excel при merge стилей игнорирует default цвет
		if (isTable && this.c && this.c.isEqual(g_oDefaultFormat.Font.c)) {
			oRes.c = font.c || this.c;
		} else {
			oRes.c = this.c || font.c;
		}
		oRes.va = this.va || font.va;
		oRes.skip = this.skip || font.skip;
		oRes.repeat = this.repeat || font.repeat;
		return oRes;
	};
	Font.prototype.getRgbOrNull = function () {
		var nRes = null;
		if (null != this.c) {
			nRes = this.c.getRgb();
		}
		return nRes;
	};
	Font.prototype.isEqual = function (font) {
		var bRes = this.fs == font.fs && this.b == font.b && this.i == font.i && this.u == font.u && this.s == font.s &&
			g_oColorManager.isEqual(this.c, font.c) && this.va == font.va && this.skip == font.skip &&
			this.repeat == font.repeat;
		if (bRes) {
			var schemeThis = this.getScheme();
			var schemeOther = font.getScheme();
			if (Asc.EFontScheme.fontschemeNone == schemeThis && Asc.EFontScheme.fontschemeNone == schemeOther) {
				bRes = this.fn == font.fn;
			} else if (Asc.EFontScheme.fontschemeNone != schemeThis &&
				Asc.EFontScheme.fontschemeNone != schemeOther) {
				bRes = schemeThis == schemeOther;
			} else {
				bRes = false;
			}
		}
		return bRes;
	};
	Font.prototype.clone = function () {
		var font = new Font();
		font.assign(this);
		return font;
	};
	Font.prototype.intersect = function (oFont, oDefVal) {
		if (this.fn != oFont.fn) {
			this.fn = oDefVal.fn;
		}
		if (this.scheme != oFont.scheme) {
			this.scheme = oDefVal.scheme;
		}
		if (this.fs != oFont.fs) {
			this.fs = oDefVal.fs;
		}
		if (this.b != oFont.b) {
			this.b = oDefVal.b;
		}
		if (this.i != oFont.i) {
			this.i = oDefVal.i;
		}
		if (this.u != oFont.u) {
			this.u = oDefVal.u;
		}
		if (this.s != oFont.s) {
			this.s = oDefVal.s;
		}
		if (false == g_oColorManager.isEqual(this.c, oFont.c)) {
			this.c = oDefVal.c;
		}
		if (this.va != oFont.va) {
			this.va = oDefVal.va;
		}
		if (this.skip != oFont.skip) {
			this.skip = oDefVal.skip;
		}
		if (this.repeat != oFont.repeat) {
			this.repeat = oDefVal.repeat;
		}
	};
	Font.prototype.getName = function () {
		return this.fn || g_oDefaultFormat.Font.fn;
	};
	Font.prototype.setName = function (val) {
		return this.fn = val;
	};
	Font.prototype.getScheme = function () {
		return this.scheme || Asc.EFontScheme.fontschemeNone;
	};
	Font.prototype.setScheme = function(val) {
		return (null != val && Asc.EFontScheme.fontschemeNone != val) ? this.scheme = val : this.scheme = null;
	};
	Font.prototype.getSize = function () {
		return this.fs || g_oDefaultFormat.Font.fs;
	};
	Font.prototype.setSize = function(val) {
		return this.fs = val;
	};
	Font.prototype.getBold = function () {
		return !!this.b;
	};
	Font.prototype.setBold = function(val) {
		return val ? this.b = true : this.b = null;
	};
	Font.prototype.getItalic = function () {
		return !!this.i;
	};
	Font.prototype.setItalic = function(val) {
		return val ? this.i = true : this.i = null;
	};
	Font.prototype.getUnderline = function () {
		return null != this.u ? this.u : Asc.EUnderline.underlineNone;
	};
	Font.prototype.setUnderline = function(val) {
		return (null != val && Asc.EUnderline.underlineNone != val) ? this.u = val : this.u = null;
	};
	Font.prototype.getStrikeout = function () {
		return !!this.s;
	};
	Font.prototype.setStrikeout = function(val) {
		return val ? this.s = true : this.s = null;
	};
	Font.prototype.getColor = function () {
		return this.c || g_oDefaultFormat.ColorAuto;
	};
	Font.prototype.setColor = function(val) {
		return this.c = val;
	};
	Font.prototype.getVerticalAlign = function () {
		return null != this.va ? this.va : AscCommon.vertalign_Baseline;
	};
	Font.prototype.setVerticalAlign = function(val) {
		return (null != val && AscCommon.vertalign_Baseline != val) ? this.va = val : this.va = null;
	};
	Font.prototype.getSkip = function () {
		return !!this.skip;
	};
	Font.prototype.setSkip = function(val) {
		return val ? this.skip = true : this.skip = null;
	};
	Font.prototype.getRepeat = function () {
		return !!this.repeat;
	};
	Font.prototype.setRepeat = function (val) {
		return val ? this.repeat = true : this.repeat = null;
	};
	Font.prototype.getType = function () {
		return UndoRedoDataTypes.StyleFont;
	};
	Font.prototype.getProperties = function () {
		return this.Properties;
	};
	Font.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.fn:
				return this.fn;
				break;
			case this.Properties.scheme:
				return this.scheme;
				break;
			case this.Properties.fs:
				return this.fs;
				break;
			case this.Properties.b:
				return this.b;
				break;
			case this.Properties.i:
				return this.i;
				break;
			case this.Properties.u:
				return this.u;
				break;
			case this.Properties.s:
				return this.s;
				break;
			case this.Properties.c:
				return this.c;
				break;
			case this.Properties.va:
				return this.va;
				break;
		}
	};
	Font.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.fn:
				this.fn = value;
				break;
			case this.Properties.scheme:
				this.scheme = value;
				break;
			case this.Properties.fs:
				this.fs = value;
				break;
			case this.Properties.b:
				this.b = value;
				break;
			case this.Properties.i:
				this.i = value;
				break;
			case this.Properties.u:
				this.u = value;
				break;
			case this.Properties.s:
				this.s = value;
				break;
			case this.Properties.c:
				this.c = value;
				break;
			case this.Properties.va:
				this.va = value;
				break;
		}
	};
	Font.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if("b" === elem){
			this.b = getBoolFromXml(readValAttr(attr));
		} else if("color" === elem){
			this.c = getColorFromXml(attr);
		} else if("i" === elem){
			this.i = getBoolFromXml(readValAttr(attr));
		} else if("name" === elem){
			this.fn = readValAttr(attr);
		} else if("scheme" === elem){
			this.scheme = readValAttr(attr);
		} else if("strike" === elem){
			this.s = getBoolFromXml(readValAttr(attr));
		} else if("sz" === elem){
			this.fs = getNumFromXml(readValAttr(attr));
		} else if("u" === elem){
			switch (readValAttr(attr)) {
				case "single":
					this.u = Asc.EUnderline.underlineSingle;
					break;
				case "double":
					this.u = Asc.EUnderline.underlineDouble;
					break;
				case "singleAccounting":
					this.u = Asc.EUnderline.underlineSingleAccounting;
					break;
				case "doubleAccounting":
					this.u = Asc.EUnderline.underlineDoubleAccounting;
					break;
				case "none":
					this.u = Asc.EUnderline.underlineNone;
					break;
			}
		} else if("vertAlign" === elem){
			switch (readValAttr(attr)) {
				case "baseline":
					this.va = AscCommon.vertalign_Baseline;
					break;
				case "superscript":
					this.va = AscCommon.vertalign_SuperScript;
					break;
				case "subscript":
					this.va = AscCommon.vertalign_SubScript;
					break;
			}
		} else {
			newContext = null;
		}
		return newContext;
	};

	var st_gradienttypeLINEAR = 0;
	var st_gradienttypePATH = 1;

	var st_patterntypeNONE = 0;
	var st_patterntypeSOLID = 1;
	var st_patterntypeMEDIUMGRAY = 2;
	var st_patterntypeDARKGRAY = 3;
	var st_patterntypeLIGHTGRAY = 4;
	var st_patterntypeDARKHORIZONTAL = 5;
	var st_patterntypeDARKVERTICAL = 6;
	var st_patterntypeDARKDOWN = 7;
	var st_patterntypeDARKUP = 8;
	var st_patterntypeDARKGRID = 9;
	var st_patterntypeDARKTRELLIS = 10;
	var st_patterntypeLIGHTHORIZONTAL = 11;
	var st_patterntypeLIGHTVERTICAL = 12;
	var st_patterntypeLIGHTDOWN = 13;
	var st_patterntypeLIGHTUP = 14;
	var st_patterntypeLIGHTGRID = 15;
	var st_patterntypeLIGHTTRELLIS = 16;
	var st_patterntypeGRAY125 = 17;
	var st_patterntypeGRAY0625 = 18;

	function FromXml_ST_GradientType(val) {
		var res = -1;
		if ("linear" === val) {
			res = st_gradienttypeLINEAR;
		} else if ("path" === val) {
			res = st_gradienttypePATH;
		}
		return res;
	}

	function FromXml_ST_PatternType(val) {
		var res = -1;
		if ("none" === val) {
			res = st_patterntypeNONE;
		} else if ("solid" === val) {
			res = st_patterntypeSOLID;
		} else if ("mediumGray" === val) {
			res = st_patterntypeMEDIUMGRAY;
		} else if ("darkGray" === val) {
			res = st_patterntypeDARKGRAY;
		} else if ("lightGray" === val) {
			res = st_patterntypeLIGHTGRAY;
		} else if ("darkHorizontal" === val) {
			res = st_patterntypeDARKHORIZONTAL;
		} else if ("darkVertical" === val) {
			res = st_patterntypeDARKVERTICAL;
		} else if ("darkDown" === val) {
			res = st_patterntypeDARKDOWN;
		} else if ("darkUp" === val) {
			res = st_patterntypeDARKUP;
		} else if ("darkGrid" === val) {
			res = st_patterntypeDARKGRID;
		} else if ("darkTrellis" === val) {
			res = st_patterntypeDARKTRELLIS;
		} else if ("lightHorizontal" === val) {
			res = st_patterntypeLIGHTHORIZONTAL;
		} else if ("lightVertical" === val) {
			res = st_patterntypeLIGHTVERTICAL;
		} else if ("lightDown" === val) {
			res = st_patterntypeLIGHTDOWN;
		} else if ("lightUp" === val) {
			res = st_patterntypeLIGHTUP;
		} else if ("lightGrid" === val) {
			res = st_patterntypeLIGHTGRID;
		} else if ("lightTrellis" === val) {
			res = st_patterntypeLIGHTTRELLIS;
		} else if ("gray125" === val) {
			res = st_patterntypeGRAY125;
		} else if ("gray0625" === val) {
			res = st_patterntypeGRAY0625;
		}
		return res;
	}

	function CT_GradientFill() {
		//Attributes
		this.type = null;//linear
		this.degree = null;//0
		this.left = null;//0
		this.right = null;//0
		this.top = null;//0
		this.bottom = null;//0
		//Members
		this.stop = [];
	}

	CT_GradientFill.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			var vals = attr();
			var val;
			val = vals["type"];
			if (undefined !== val) {
				val = FromXml_ST_GradientType(val);
				if (-1 !== val) {
					this.type = val;
				}
			}
			val = vals["degree"];
			if (undefined !== val) {
				this.degree = val - 0;
			}
			val = vals["left"];
			if (undefined !== val) {
				this.left = val - 0;
			}
			val = vals["right"];
			if (undefined !== val) {
				this.right = val - 0;
			}
			val = vals["top"];
			if (undefined !== val) {
				this.top = val - 0;
			}
			val = vals["bottom"];
			if (undefined !== val) {
				this.bottom = val - 0;
			}
		}
	};
	CT_GradientFill.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("stop" === elem) {
			newContext = new CT_GradientStop();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
			this.stop.push(newContext);
		}
		else {
			newContext = null;
		}
		return newContext;
	};
	function CT_GradientStop() {
		//Attributes
		this.position = null;
		//Members
		this.color = null;
	}

	CT_GradientStop.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			var vals = attr();
			var val;
			val = vals["position"];
			if (undefined !== val) {
				this.position = val - 0;
			}
		}
	};
	CT_GradientStop.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("color" === elem) {
			this.color = getColorFromXml(attr);
		}
		else {
			newContext = null;
		}
		return newContext;
	};
	function CT_PatternFill() {
		//Attributes
		this.patternType = null;
		//Members
		this.fgColor = null;
		this.bgColor = null;
	}

	CT_PatternFill.prototype.readAttributes = function(attr, uq) {
		if (attr()) {
			var vals = attr();
			var val;
			val = vals["patternType"];
			if (undefined !== val) {
				val = FromXml_ST_PatternType(val);
				if (-1 !== val) {
					this.patternType = val;
				}
			}
		}
	};
	CT_PatternFill.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if ("fgColor" === elem) {
			this.fgColor = getColorFromXml(attr);
		}
		else if ("bgColor" === elem) {
			this.bgColor = getColorFromXml(attr);
		}
		else {
			newContext = null;
		}
		return newContext;
	};

	var g_oFillProperties = {
		bg: 0
	};

	/** @constructor */
	function Fill(val) {
		if (null == val) {
			val = g_oDefaultFormat.FillAbs;
		}
		this.bg = val.bg;

		this._hash;
		this._index;
	}

	Fill.prototype.Properties = g_oFillProperties;
	Fill.prototype.getHash = function () {
		if (!this._hash) {
			this._hash = this.bg ? this.bg.getHash() : '';
		}
		return this._hash;
	};
	Fill.prototype.getIndexNumber = function () {
		return this._index;
	};
	Fill.prototype.setIndexNumber = function (val) {
		return this._index = val;
	};
	Fill.prototype._mergeProperty = function (first, second, def) {
		if (def != first) {
			return first;
		} else {
			return second;
		}
	};
	Fill.prototype.merge = function (fill) {
		var oRes = new Fill();
		oRes.bg = this._mergeProperty(this.bg, fill.bg, g_oDefaultFormat.Fill.bg);
		return oRes;
	};
	Fill.prototype.getRgbOrNull = function () {
		var nRes = null;
		if (null != this.bg) {
			nRes = this.bg.getRgb();
		}
		return nRes;
	};
	Fill.prototype.getDif = function (val) {
		var oRes = new Fill(this);
		var bEmpty = true;
		if (g_oColorManager.isEqual(this.bg, val.bg)) {
			oRes.bg = null;
		} else {
			bEmpty = false;
		}
		if (bEmpty) {
			oRes = null;
		}
		return oRes;
	};
	Fill.prototype.isEqual = function (fill) {
		return g_oColorManager.isEqual(this.bg, fill.bg);
	};
	Fill.prototype.clone = function () {
		return new Fill(this);
	};
	Fill.prototype.getType = function () {
		return UndoRedoDataTypes.StyleFill;
	};
	Fill.prototype.getProperties = function () {
		return this.Properties;
	};
	Fill.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.bg:
				return this.bg;
				break;
		}
	};
	Fill.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.bg:
				this.bg = value;
				break;
		}
	};
	Fill.prototype.notEmpty = function () {
		return null !== this.bg;
	};
	Fill.prototype.onStartNode = function (elem, attr, uq) {
		var newContext = this;
		if ("gradientFill" === elem) {
			newContext = new CT_GradientFill();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
		} else if ("patternFill" === elem) {
			newContext = new CT_PatternFill();
			if (newContext.readAttributes) {
				newContext.readAttributes(attr, uq);
			}
		} else {
			newContext = null;
		}
		return newContext;
	};
	Fill.prototype.onEndNode = function (prevContext, elem) {
		if ("gradientFill" === elem) {
			if (prevContext.stop.length > 0) {
				var stop = prevContext.stop[0];
				if (stop.color) {
					this.bg = stop.color;
				}
			}
		} else if ("patternFill" === elem) {
			if (st_patterntypeNONE !== prevContext.patternType) {
				if (AscCommon.openXml.SaxParserDataTransfer.priorityBg) {
					if (prevContext.bgColor) {
						this.bg = prevContext.bgColor;
					} else if (prevContext.fgColor) {
						this.bg = prevContext.fgColor;
					}
				} else {
					if (prevContext.fgColor) {
						this.bg = prevContext.fgColor;
					} else if (prevContext.bgColor) {
						this.bg = prevContext.bgColor;
					}
				}
			}
		}
	};

	function FromXml_ST_BorderStyle(val) {
		var res = -1;
		if ("none" === val) {
			res = c_oAscBorderStyles.None;
		} else if ("thin" === val) {
			res = c_oAscBorderStyles.Thin;
		} else if ("medium" === val) {
			res = c_oAscBorderStyles.Medium;
		} else if ("dashed" === val) {
			res = c_oAscBorderStyles.Dashed;
		} else if ("dotted" === val) {
			res = c_oAscBorderStyles.Dotted;
		} else if ("thick" === val) {
			res = c_oAscBorderStyles.Thick;
		} else if ("double" === val) {
			res = c_oAscBorderStyles.Double;
		} else if ("hair" === val) {
			res = c_oAscBorderStyles.Hair;
		} else if ("mediumDashed" === val) {
			res = c_oAscBorderStyles.MediumDashed;
		} else if ("dashDot" === val) {
			res = c_oAscBorderStyles.DashDot;
		} else if ("mediumDashDot" === val) {
			res = c_oAscBorderStyles.MediumDashDot;
		} else if ("dashDotDot" === val) {
			res = c_oAscBorderStyles.DashDotDot;
		} else if ("mediumDashDotDot" === val) {
			res = c_oAscBorderStyles.MediumDashDotDot;
		} else if ("slantDashDot" === val) {
			res = c_oAscBorderStyles.SlantDashDot;
		}
		return res;
	}

	var g_oBorderPropProperties = {
		s: 0, c: 1
	};

	function BorderProp() {
		this.s = c_oAscBorderStyles.None;
		this.w = c_oAscBorderWidth.None;
		this.c = g_oColorManager.getThemeColor(1);
	}
	BorderProp.prototype.Properties = g_oBorderPropProperties;
	BorderProp.prototype.getHash = function() {
		if (!this._hash) {
			var color = this.c ? this.c.getHash() : '';
			this._hash = this.s + ';' + this.w + ';' + color;
		}
		return this._hash;
	};
	BorderProp.prototype.setStyle = function (style) {
		this.s = style;
		switch (this.s) {
			case c_oAscBorderStyles.Thin:
			case c_oAscBorderStyles.DashDot:
			case c_oAscBorderStyles.DashDotDot:
			case c_oAscBorderStyles.Dashed:
			case c_oAscBorderStyles.Dotted:
			case c_oAscBorderStyles.Hair:
				this.w = c_oAscBorderWidth.Thin;
				break;
			case c_oAscBorderStyles.Medium:
			case c_oAscBorderStyles.MediumDashDot:
			case c_oAscBorderStyles.MediumDashDotDot:
			case c_oAscBorderStyles.MediumDashed:
			case c_oAscBorderStyles.SlantDashDot:
				this.w = c_oAscBorderWidth.Medium;
				break;
			case c_oAscBorderStyles.Thick:
			case c_oAscBorderStyles.Double:
				this.w = c_oAscBorderWidth.Thick;
				break;
			default:
				this.w = c_oAscBorderWidth.None;
				break;
		}
	};
	BorderProp.prototype.getDashSegments = function () {
		var res;
		switch (this.s) {
			case c_oAscBorderStyles.Hair:
				res = [1, 1];
				break;
			case c_oAscBorderStyles.Dotted:
				res = [2, 2];
				break;
			case c_oAscBorderStyles.DashDotDot:
			case c_oAscBorderStyles.MediumDashDotDot:
				res = [3, 3, 3, 3, 9, 3];
				break;
			case c_oAscBorderStyles.DashDot:
			case c_oAscBorderStyles.MediumDashDot:
			case c_oAscBorderStyles.SlantDashDot:
				res = [3, 3, 9, 3];
				break;
			case c_oAscBorderStyles.Dashed:
				res = [3, 1];
				break;
			case c_oAscBorderStyles.MediumDashed:
				res = [9, 3];
				break;
			case c_oAscBorderStyles.Thin:
			case c_oAscBorderStyles.Medium:
			case c_oAscBorderStyles.Thick:
			case c_oAscBorderStyles.Double:
			default:
				res = [];
				break;
		}
		return res;
	};
	BorderProp.prototype.getRgbOrNull = function () {
		var nRes = null;
		if (null != this.c) {
			nRes = this.c.getRgb();
		}
		return nRes;
	};
	BorderProp.prototype.isEmpty = function () {
		return c_oAscBorderStyles.None === this.s;
	};
	BorderProp.prototype.isEqual = function (val) {
		return this.s === val.s && g_oColorManager.isEqual(this.c, val.c);
	};
	BorderProp.prototype.clone = function () {
		var res = new BorderProp();
		res.merge(this);
		return res;
	};
	BorderProp.prototype.merge = function (oBorderProp) {
		if (null != oBorderProp.s && c_oAscBorderStyles.None !== oBorderProp.s) {
			this.s = oBorderProp.s;
			this.w = oBorderProp.w;
			if (null != oBorderProp.c) {
				this.c = oBorderProp.c;
			}
		}
	};
	BorderProp.prototype.getType = function () {
		return UndoRedoDataTypes.StyleBorderProp;
	};
	BorderProp.prototype.getProperties = function () {
		return this.Properties;
	};
	BorderProp.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.s:
				return this.s;
				break;
			case this.Properties.c:
				return this.c;
				break;
		}
	};
	BorderProp.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.s:
				this.setStyle(value);
				break;
			case this.Properties.c:
				this.c = value;
				break;
		}
	};
	BorderProp.prototype.readAttributes = function(attr, uq) {
		if(attr()){
			var vals = attr();
			var val;
			val = vals["style"];
			if(undefined !== val){
				val = FromXml_ST_BorderStyle(val);
				if(-1 !== val){
					this.setStyle(val);
				}
			}
		}
	};
	BorderProp.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if("color" === elem){
			this.c = getColorFromXml(attr);
		}
		else {
			newContext = null;
		}
		return newContext;
	};
var g_oBorderProperties = {
		l: 0,
		t: 1,
		r: 2,
		b: 3,
		d: 4,
		ih: 5,
		iv: 6,
		dd: 7,
		du: 8
	};

	/** @constructor */
	function Border(val) {
		if (null == val) {
			val = g_oDefaultFormat.BorderAbs;
		}
		this.l = val.l.clone();
		this.t = val.t.clone();
		this.r = val.r.clone();
		this.b = val.b.clone();
		this.d = val.d.clone();
		this.ih = val.ih.clone();
		this.iv = val.iv.clone();
		this.dd = val.dd;
		this.du = val.du;

		this._hash;
		this._index;
	}

	Border.prototype.Properties = g_oBorderProperties;
	Border.prototype.getHash = function() {
		if (!this._hash) {
			this._hash = (this.l ? this.l.getHash() : '') + '|';
			this._hash += (this.t ? this.t.getHash() : '') + '|';
			this._hash += (this.r ? this.r.getHash() : '') + '|';
			this._hash += (this.b ? this.b.getHash() : '') + '|';
			this._hash += (this.d ? this.d.getHash() : '') + '|';
			this._hash += (this.ih ? this.ih.getHash() : '') + '|';
			this._hash += (this.iv ? this.iv.getHash() : '') + '|';
			this._hash += this.dd + '|';
			this._hash += this.du;
		}
		return this._hash;
	};
	Border.prototype.getIndexNumber = function() {
		return this._index;
	};
	Border.prototype.setIndexNumber = function(val) {
		return this._index = val;
	};
	Border.prototype._mergeProperty = function (first, second, def) {
		if ((null != def.isEqual && false == def.isEqual(first)) || (null == def.isEqual && def != first)) {
			return first;
		} else {
			return second;
		}
	};
	Border.prototype.merge = function (border) {
		var defaultBorder = g_oDefaultFormat.Border;
		var oRes = new Border();
		oRes.l = this._mergeProperty(this.l, border.l, defaultBorder.l).clone();
		oRes.t = this._mergeProperty(this.t, border.t, defaultBorder.t).clone();
		oRes.r = this._mergeProperty(this.r, border.r, defaultBorder.r).clone();
		oRes.b = this._mergeProperty(this.b, border.b, defaultBorder.b).clone();
		oRes.d = this._mergeProperty(this.d, border.d, defaultBorder.d).clone();
		oRes.ih = this._mergeProperty(this.ih, border.ih, defaultBorder.ih).clone();
		oRes.iv = this._mergeProperty(this.iv, border.iv, defaultBorder.iv).clone();
		oRes.dd = this._mergeProperty(this.dd, border.dd, defaultBorder.dd);
		oRes.du = this._mergeProperty(this.du, border.du, defaultBorder.du);
		return oRes;
	};
	Border.prototype.getDif = function (val) {
		var oRes = new Border(this);
		var bEmpty = true;
		if (true == this.l.isEqual(val.l)) {
			oRes.l = null;
		} else {
			bEmpty = false;
		}
		if (true == this.t.isEqual(val.t)) {
			oRes.t = null;
		} else {
			bEmpty = false;
		}
		if (true == this.r.isEqual(val.r)) {
			oRes.r = null;
		} else {
			bEmpty = false;
		}
		if (true == this.b.isEqual(val.b)) {
			oRes.b = null;
		} else {
			bEmpty = false;
		}
		if (true == this.d.isEqual(val.d)) {
			oRes.d = null;
		}
		if (true == this.ih.isEqual(val.ih)) {
			oRes.ih = null;
		} else {
			bEmpty = false;
		}
		if (true == this.iv.isEqual(val.iv)) {
			oRes.iv = null;
		} else {
			bEmpty = false;
		}
		if (this.dd == val.dd) {
			oRes.dd = null;
		} else {
			bEmpty = false;
		}
		if (this.du == val.du) {
			oRes.du = null;
		} else {
			bEmpty = false;
		}
		if (bEmpty) {
			oRes = null;
		}
		return oRes;
	};
	Border.prototype.isEqual = function (val) {
		return this.l.isEqual(val.l) && this.t.isEqual(val.t) && this.r.isEqual(val.r) && this.b.isEqual(val.b) &&
			this.d.isEqual(val.d) && this.ih.isEqual(val.ih) && this.iv.isEqual(val.iv) && this.dd == val.dd &&
			this.du == val.du;
	};
	Border.prototype.clone = function () {
		return new Border(this);
	};
	Border.prototype.clean = function () {
		var defaultBorder = g_oDefaultFormat.Border;
		this.l = defaultBorder.l.clone();
		this.t = defaultBorder.t.clone();
		this.r = defaultBorder.r.clone();
		this.b = defaultBorder.b.clone();
		this.d = defaultBorder.d.clone();
		this.ih = defaultBorder.ih.clone();
		this.iv = defaultBorder.iv.clone();
		this.dd = defaultBorder.dd;
		this.du = defaultBorder.du;
	};
	Border.prototype.mergeInner = function (border) {
		if (border) {
			if (border.l) {
				this.l.merge(border.l);
			}
			if (border.t) {
				this.t.merge(border.t);
			}
			if (border.r) {
				this.r.merge(border.r);
			}
			if (border.b) {
				this.b.merge(border.b);
			}
			if (border.d) {
				this.d.merge(border.d);
			}
			if (border.ih) {
				this.ih.merge(border.ih);
			}
			if (border.iv) {
				this.iv.merge(border.iv);
			}
			if (null != border.dd) {
				this.dd = this.dd || border.dd;
			}
			if (null != border.du) {
				this.du = this.du || border.du;
			}
		}
	};
	Border.prototype.getType = function () {
		return UndoRedoDataTypes.StyleBorder;
	};
	Border.prototype.getProperties = function () {
		return this.Properties;
	};
	Border.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.l:
				return this.l;
				break;
			case this.Properties.t:
				return this.t;
				break;
			case this.Properties.r:
				return this.r;
				break;
			case this.Properties.b:
				return this.b;
				break;
			case this.Properties.d:
				return this.d;
				break;
			case this.Properties.ih:
				return this.ih;
				break;
			case this.Properties.iv:
				return this.iv;
				break;
			case this.Properties.dd:
				return this.dd;
				break;
			case this.Properties.du:
				return this.du;
				break;
		}
	};
	Border.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.l:
				this.l = value;
				break;
			case this.Properties.t:
				this.t = value;
				break;
			case this.Properties.r:
				this.r = value;
				break;
			case this.Properties.b:
				this.b = value;
				break;
			case this.Properties.d:
				this.d = value;
				break;
			case this.Properties.ih:
				this.ih = value;
				break;
			case this.Properties.iv:
				this.iv = value;
				break;
			case this.Properties.dd:
				this.dd = value;
				break;
			case this.Properties.du:
				this.du = value;
				break;
		}
	};
	Border.prototype.notEmpty = function () {
		return (this.l && c_oAscBorderStyles.None !== this.l.s) || (this.r && c_oAscBorderStyles.None !== this.r.s) ||
			(this.t && c_oAscBorderStyles.None !== this.t.s) || (this.b && c_oAscBorderStyles.None !== this.b.s) ||
			(this.dd && c_oAscBorderStyles.None !== this.dd.s) || (this.du && c_oAscBorderStyles.None !== this.du.s);
	};
	Border.prototype.readAttributes = function(attr, uq) {
		if(attr()){
			var vals = attr();
			var val;
			val = vals["diagonalUp"];
			if(undefined !== val){
				this.du = getBoolFromXml(val);
			}
			val = vals["diagonalDown"];
			if(undefined !== val){
				this.dd = getBoolFromXml(val);
			}
		}
	};
	Border.prototype.onStartNode = function(elem, attr, uq) {
		var newContext = this;
		if("start" === elem || "left" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.l = newContext;
		}
		else if("end" === elem || "right" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.r = newContext;
		}
		else if("top" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.t = newContext;
		}
		else if("bottom" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.b = newContext;
		}
		else if("diagonal" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.d = newContext;
		}
		else if("vertical" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.iv = newContext;
		}
		else if("horizontal" === elem){
			newContext = new BorderProp();
			if(newContext.readAttributes){
				newContext.readAttributes(attr, uq);
			}
			this.ih = newContext;
		}
		else {
			newContext = null;
		}
		return newContext;
	};
var g_oNumProperties = {
		f: 0,
		id: 1
	};
/** @constructor */
function Num(val)
{
	if(null == val)
		val = g_oDefaultFormat.NumAbs;
	this.f = val.f;
  this.id = val.id;

	this._hash;
	this._index;
}
Num.prototype =
{
	Properties: g_oNumProperties,
	getHash: function() {
		if (!this._hash) {
			this._hash = this.f + '|' + this.id;
		}
		return this._hash;
	},
	getIndexNumber: function() {
		return this._index;
	},
	setIndexNumber: function(val) {
		this._index = val;
	},
  setFormat: function(f, opt_id) {
    this.f = f;
    this.id = opt_id;
  },
  getFormat: function() {
    return (null != this.id) ? (AscCommon.getFormatByStandardId(this.id) || this.f) : this.f;
  },
  _mergeProperty : function(first, second, def)
  {
    if(def != first)
      return first;
    else
      return second;
  },
	merge : function(num)
	{
		var oRes = new Num();
    oRes.f = this._mergeProperty(this.f, num.f, g_oDefaultFormat.Num.f);
    oRes.id = this._mergeProperty(this.id, num.id, g_oDefaultFormat.Num.id);
		return oRes;
	},
  getDif: function(val) {
    var oRes = new Num(this);
    var bEmpty = true;
    if (this.f == val.f) {
      oRes.f = null;
    } else {
      bEmpty = false;
    }
    if (this.id == val.id) {
      oRes.id = null;
    } else {
      bEmpty = false;
    }
    if (bEmpty) {
      oRes = null;
    }
    return oRes;
  },
  isEqual: function(val) {
    if (null != this.id && null != val.id) {
      return this.id == val.id;
    } else if (null != this.id || null != val.id) {
      return false;
    } else {
      return this.f == val.f;
    }
  },
    clone : function()
    {
        return new Num(this);
    },
	getType : function()
	{
		return UndoRedoDataTypes.StyleNum;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.f: return this.f;break;
			case this.Properties.id: return this.id;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.f: this.f = value;break;
			case this.Properties.id: this.id = value;break;
		}
	},
	readAttributes : function(attr, uq) {
		if (attr()) {
			var vals = attr();
			var val;
			val = vals["numFmtId"];
			var sFormat = null;
			var id;
			if (undefined !== val) {
				id = val - 0;
			}
			val = vals["formatCode"];
			if (undefined !== val) {
				sFormat = AscCommon.unleakString(uq(val));
			}
			this.f = null != sFormat ? sFormat : (AscCommonExcel.aStandartNumFormats[id] || "General");
			if ((5 <= id && id <= 8) || (14 <= id && id <= 17) || 22 == id || (27 <= id && id <= 31) ||
				(36 <= id && id <= 44)) {
				this.id = id;
			}
		}
	}
};
var g_oCellXfsProperties = {
		border: 0,
		fill: 1,
		font: 2,
		num: 3,
		align: 4,
		QuotePrefix: 5,
		XfId: 6,
		PivotButton: 7
	};
/** @constructor */
function CellXfs() {
    this.border = null;
    this.fill = null;
    this.font = null;
    this.num = null;
    this.align = null;
	this.QuotePrefix = null;
	this.PivotButton = null;
	this.XfId = null;

	//inner
	this._hash;
	this._index;
	this.operationCache = {};
}
CellXfs.prototype =
{
	Properties: g_oCellXfsProperties,
	getHash: function() {
		if (!this._hash) {
			this._hash = (this.border ? this.border.getIndexNumber() : '') + '|';
			this._hash += (this.fill ? this.fill.getIndexNumber() : '') + '|';
			this._hash += (this.font ? this.font.getIndexNumber() : '') + '|';
			this._hash += (this.num ? this.num.getIndexNumber() : '') + '|';
			this._hash += (this.align ? this.align.getIndexNumber() : '') + '|';
			this._hash += this.QuotePrefix + '|';
			this._hash += this.PivotButton + '|';
			this._hash += this.XfId + '|';
		}
		return this._hash;
	},
	getIndexNumber: function() {
		return this._index;
	},
	setIndexNumber: function(val) {
		this._index = val;
	},
	_mergeProperty : function(addFunc, first, second, isTable)
	{
		var res = null;
		if(null != first || null != second)
		{
			if(null == first)
				res = second;
			else if(null == second)
				res = first;
			else
			{
				if (null != first.merge) {
					res = addFunc.call(g_StyleCache, first.merge(second, isTable));
				} else {
					res = first;
				}
			}
		}
		return res;
	},
	merge : function(xfs, isTable)
	{
		var xfIndexNumber = xfs.getIndexNumber();
		if (undefined === xfIndexNumber) {
			xfs = g_StyleCache.addXf(xfs, true);
			xfIndexNumber = xfs.getIndexNumber();
		}
		var cache = this.getOperationCache("merge", xfIndexNumber);
		if (!cache) {
			cache = new CellXfs();
			cache.border = this._mergeProperty(g_StyleCache.addBorder, xfs.border, this.border);
			cache.fill = this._mergeProperty(g_StyleCache.addFill, xfs.fill, this.fill);
			cache.font = this._mergeProperty(g_StyleCache.addFont, xfs.font, this.font, isTable);
			cache.num = this._mergeProperty(g_StyleCache.addNum, xfs.num, this.num);
			cache.align = this._mergeProperty(g_StyleCache.addAlign, xfs.align, this.align);
			cache.QuotePrefix = this._mergeProperty(null, xfs.QuotePrefix, this.QuotePrefix);
			cache.PivotButton = this._mergeProperty(null, xfs.PivotButton, this.PivotButton);
			cache.XfId = this._mergeProperty(null, xfs.XfId, this.XfId);
			cache = g_StyleCache.addXf(cache);
			this.setOperationCache("merge", xfIndexNumber, cache);
		}
		return cache;
	},
    clone : function()
    {
        var res = new CellXfs();
		res.border = this.border;
		res.fill = this.fill;
		res.font = this.font;
		res.num = this.num;
		res.align = this.align;
		res.QuotePrefix = this.QuotePrefix;
		res.PivotButton = this.PivotButton;
		res.XfId = this.XfId;
        return res;
    },
	isEqual : function(xfs)
	{
		return this.font === xfs.font && this.fill === xfs.fill && this.border === xfs.border && this.num === xfs.num &&
			this.align === xfs.align && this.QuotePrefix === xfs.QuotePrefix && this.PivotButton === xfs.PivotButton &&
			this.XfId === xfs.XfId;
	},
	getType : function()
	{
		return UndoRedoDataTypes.StyleXfs;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.border: return this.border;break;
			case this.Properties.fill: return this.fill;break;
			case this.Properties.font: return this.font;break;
			case this.Properties.num: return this.num;break;
			case this.Properties.align: return this.align;break;
			case this.Properties.QuotePrefix: return this.QuotePrefix;break;
			case this.Properties.PivotButton: return this.PivotButton;break;
			case this.Properties.XfId: return this.XfId; break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.border: this.border = value;break;
			case this.Properties.fill: this.fill = value;break;
			case this.Properties.font: this.font = value;break;
			case this.Properties.num: this.num = value;break;
			case this.Properties.align: this.align = value;break;
			case this.Properties.QuotePrefix: this.QuotePrefix = value;break;
			case this.Properties.PivotButton: this.PivotButton = value;break;
			case this.Properties.XfId: this.XfId = value; break;
		}
	},
	getBorder: function() {
		return this.border;
	},
	setBorder: function(val) {
		this.border = val;
	},
	getFill: function() {
		return this.fill;
	},
	setFill: function(val) {
		this.fill = val;
	},
	getFont: function() {
		return this.font;
	},
	setFont: function(val) {
		this.font = val;
	},
	getNum: function() {
		return this.num;
	},
	setNum: function(val) {
		this.num = val;
	},
	getAlign: function() {
		return this.align;
	},
	setAlign: function(val) {
		this.align = val;
	},
	getQuotePrefix: function() {
		return this.QuotePrefix;
	},
	setQuotePrefix: function(val) {
		this.QuotePrefix = val;
	},
	getPivotButton: function() {
		return this.PivotButton;
	},
	setPivotButton: function(val) {
		this.PivotButton = val;
	},
	getXfId: function() {
		return this.XfId;
	},
	setXfId: function(val) {
		this.XfId = val;
	},
	getOperationCache: function(operation, val) {
		var res = undefined;
		var operation = this.operationCache[operation];
		if (operation) {
			res = operation[val];
		}
		return res;
	},
	setOperationCache: function(operation, val, xfs) {
		var valCache = this.operationCache[operation];
		if (!valCache) {
			valCache = {};
			this.operationCache[operation] = valCache;
		}
		valCache[val] = xfs;
	}
};

	function FromXml_ST_HorizontalAlignment(val) {
		var res = -1;
		if ("general" === val) {
			res = -1;
		} else if ("left" === val) {
			res = AscCommon.align_Left;
		} else if ("center" === val) {
			res = AscCommon.align_Center;
		} else if ("right" === val) {
			res = AscCommon.align_Right;
		} else if ("fill" === val) {
			res = AscCommon.align_Justify;
		} else if ("justify" === val) {
			res = AscCommon.align_Justify;
		} else if ("centerContinuous" === val) {
			res = AscCommon.align_Center;
		} else if ("distributed" === val) {
			res = AscCommon.align_Justify;
		}
		return res;
	}

	function FromXml_ST_VerticalAlignment(val) {
		var res = -1;
		if ("top" === val) {
			res = Asc.c_oAscVAlign.Top;
		} else if ("center" === val) {
			res = Asc.c_oAscVAlign.Center;
		} else if ("bottom" === val) {
			res = Asc.c_oAscVAlign.Bottom;
		} else if ("justify" === val) {
			res = Asc.c_oAscVAlign.Center;
		} else if ("distributed" === val) {
			res = Asc.c_oAscVAlign.Center;
		}
		return res;
	}

var g_oAlignProperties = {
		hor: 0,
		indent: 1,
		RelativeIndent: 2,
		shrink: 3,
		angle: 4,
		ver: 5,
		wrap: 6
	};
/** @constructor */
function Align(val)
{
	if(null == val)
		val = g_oDefaultFormat.AlignAbs;
	this.hor = val.hor;
	this.indent = val.indent;
	this.RelativeIndent = val.RelativeIndent;
	this.shrink = val.shrink;
	this.angle = val.angle;
	this.ver = val.ver;
	this.wrap = val.wrap;

	this._hash;
	this._index;
}
Align.prototype =
{
	Properties: g_oAlignProperties,
	getHash: function() {
		if (!this._hash) {
			this._hash = this.hor + '|' + this.indent + '|' + this.RelativeIndent + '|' + this.shrink + '|' +
				this.angle + '|' + this.ver + '|' + this.wrap;
		}
		return this._hash;
	},
	getIndexNumber: function() {
		return this._index;
	},
	setIndexNumber: function(val) {
		this._index = val;
	},
	_mergeProperty : function(first, second, def)
	{
		if (def != first)
			return first;
		else
			return second;
	},
	merge : function(border)
	{
		var defaultAlign = g_oDefaultFormat.Align;
		var oRes = new Align();
		oRes.hor = this._mergeProperty(this.hor, border.hor, defaultAlign.hor);
		oRes.indent = this._mergeProperty(this.indent, border.indent, defaultAlign.indent);
		oRes.RelativeIndent = this._mergeProperty(this.RelativeIndent, border.RelativeIndent, defaultAlign.RelativeIndent);
		oRes.shrink = this._mergeProperty(this.shrink, border.shrink, defaultAlign.shrink);
		oRes.angle = this._mergeProperty(this.angle, border.angle, defaultAlign.angle);
		oRes.ver = this._mergeProperty(this.ver, border.ver, defaultAlign.ver);
		oRes.wrap = this._mergeProperty(this.wrap, border.wrap, defaultAlign.wrap);
		return oRes;
	},
	getDif : function(val)
	{
		var oRes = new Align(this);
		var bEmpty = true;
		if(this.hor == val.hor)
			oRes.hor =  null;
		else
			bEmpty = false;
		if(this.indent == val.indent)
			oRes.indent =  null;
		else
			bEmpty = false;
		if(this.RelativeIndent == val.RelativeIndent)
			oRes.RelativeIndent =  null;
		else
			bEmpty = false;
		if(this.shrink == val.shrink)
			oRes.shrink =  null;
		else
			bEmpty = false;
		if(this.angle == val.angle)
			oRes.angle =  null;
		else
			bEmpty = false;
		if(this.ver == val.ver)
			oRes.ver =  null;
		else
			bEmpty = false;
		if(this.wrap == val.wrap)
			oRes.wrap =  null;
		else
			bEmpty = false;
		if(bEmpty)
			oRes = null;
		return oRes;
	},
	isEqual : function(val)
	{
		return this.hor == val.hor && this.indent == val.indent && this.RelativeIndent == val.RelativeIndent && this.shrink == val.shrink &&
				this.angle == val.angle && this.ver == val.ver && this.wrap == val.wrap;
	},
    clone : function()
    {
        return new Align(this);
    },
	getType : function()
	{
		return UndoRedoDataTypes.StyleAlign;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.hor: return this.hor;break;
			case this.Properties.indent: return this.indent;break;
			case this.Properties.RelativeIndent: return this.RelativeIndent;break;
			case this.Properties.shrink: return this.shrink;break;
			case this.Properties.angle: return this.angle;break;
			case this.Properties.ver: return this.ver;break;
			case this.Properties.wrap: return this.wrap;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.hor: this.hor = value;break;
			case this.Properties.indent: this.indent = value;break;
			case this.Properties.RelativeIndent: this.RelativeIndent = value;break;
			case this.Properties.shrink: this.shrink = value;break;
			case this.Properties.angle: this.angle = value;break;
			case this.Properties.ver: this.ver = value;break;
			case this.Properties.wrap: this.wrap = value;break;
		}
	},
	getAngle: function() {
		var nRes = 0;
		if (0 <= this.angle && this.angle <= 180) {
			nRes = this.angle <= 90 ? this.angle : 90 - this.angle;
		}
		return nRes;
	},
	setAngle: function(val) {
		this.angle = AscCommonExcel.angleInterfaceToFormat(val);;
	},
	getWrap: function() {
		// Для justify wrap всегда true
		return AscCommon.align_Justify === this.hor ? true : this.wrap;
	},
	setWrap: function(val) {
		this.wrap = val;
	},
	getShrinkToFit: function() {
		return this.shrink;
	},
	setShrinkToFit: function(val) {
		this.shrink = val;
	},
	getAlignHorizontal: function() {
		return this.hor;
	},
	setAlignHorizontal: function(val) {
		this.hor = val;
	},
	getAlignVertical: function() {
		return this.ver;
	},
	setAlignVertical: function(val) {
		this.ver = val;
	},
	readAttributes : function(attr, uq) {
	if(attr()){
		var vals = attr();
		var val;
		val = vals["horizontal"];
		if(undefined !== val){
			val = FromXml_ST_HorizontalAlignment(val);
			if(-1 !== val){
				this.hor = val;
			}
		}
		val = vals["vertical"];
		if(undefined !== val){
			val = FromXml_ST_VerticalAlignment(val);
			if(-1 !== val){
				this.ver = val;
			}
		}
		val = vals["textRotation"];
		if(undefined !== val){
			this.angle = val - 0;
		}
		val = vals["wrapText"];
		if(undefined !== val){
			this.wrap = getBoolFromXml(val);
		}
		val = vals["indent"];
		if(undefined !== val){
			this.indent = val - 0;
		}
		val = vals["relativeIndent"];
		if(undefined !== val){
			this.RelativeIndent = val - 0;
		}
		val = vals["shrinkToFit"];
		if(undefined !== val){
			this.shrink = getBoolFromXml(val);
		}
	}
}
};
/** @constructor */
function CCellStyles() {
	this.CustomStyles = [];
	this.DefaultStyles = [];
	// ToDo нужно все компоновать в общий список стилей (для того, чтобы не было проблем с добавлением стилей и отсутствия имени стиля)
	this.AllStyles = {};
}
CCellStyles.prototype.generateFontMap = function (oFontMap) {
	this._generateFontMap(oFontMap, this.DefaultStyles);
	this._generateFontMap(oFontMap, this.CustomStyles);
};
CCellStyles.prototype._generateFontMap = function (oFontMap, aStyles) {
	var i, length, oStyle;
	for (i = 0, length = aStyles.length; i < length; ++i) {
		oStyle = aStyles[i];
		if (null != oStyle.xfs && null != oStyle.xfs.font)
			oFontMap[oStyle.xfs.font.getName()] = 1;
	}
};
/**
 * Возвращает колличество стилей без учета скрытых
 */
CCellStyles.prototype.getDefaultStylesCount = function () {
	var nCount = this.DefaultStyles.length;
	for (var i = 0, length = nCount; i < length; ++i) {
		if (this.DefaultStyles[i].Hidden)
			--nCount;
	}
	return nCount;
};
/**
 * Возвращает колличество стилей без учета скрытых и стандартных
 */
CCellStyles.prototype.getCustomStylesCount = function () {
	var nCount = this.CustomStyles.length;
	for (var i = 0, length = nCount; i < length; ++i) {
		if (this.CustomStyles[i].Hidden || null != this.CustomStyles[i].BuiltinId)
			--nCount;
	}
	return nCount;
};
CCellStyles.prototype.getStyleByXfId = function (oXfId) {
	for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
		if (oXfId === this.CustomStyles[i].XfId) {
			return this.CustomStyles[i];
		}
	}

	return null;
};
CCellStyles.prototype.getStyleNameByXfId = function (oXfId) {
	var styleName = null;
	if (null === oXfId)
		return styleName;

	var style = null;
	for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
		style = this.CustomStyles[i];
		if (oXfId === style.XfId) {
			if (null !== style.BuiltinId) {
				styleName = this.getDefaultStyleNameByBuiltinId(style.BuiltinId);
				if (null === styleName)
					styleName = style.Name;
				break;
			} else {
				styleName = style.Name;
				break;
			}
		}
	}

	return styleName;
};
CCellStyles.prototype.getDefaultStyleNameByBuiltinId = function (oBuiltinId) {
	var style = null;
	for (var i = 0, length = this.DefaultStyles.length; i < length; ++i) {
		style = this.DefaultStyles[i];
		if (style.BuiltinId === oBuiltinId)
			return style.Name;
	}
	return null;
};
CCellStyles.prototype.getCustomStyleByBuiltinId = function (oBuiltinId) {
	var style = null;
	for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
		style = this.CustomStyles[i];
		if (style.BuiltinId === oBuiltinId)
			return style;
	}
	return null;
};
CCellStyles.prototype._prepareCellStyle = function (name) {
	var defaultStyle = null;
	var style = null;
	var i, length;
	var maxXfId = -1;
	// Проверим, есть ли в default
	for (i = 0, length = this.DefaultStyles.length; i < length; ++i) {
		if (name === this.DefaultStyles[i].Name) {
			defaultStyle = this.DefaultStyles[i];
			break;
		}
	}
	// Если есть в default, ищем в custom по builtinId. Если нет, то по имени
	if (defaultStyle) {
		for (i = 0, length = this.CustomStyles.length; i < length; ++i) {
			if (defaultStyle.BuiltinId === this.CustomStyles[i].BuiltinId) {
				style = this.CustomStyles[i];
				break;
			}
			maxXfId = Math.max(maxXfId, this.CustomStyles[i].XfId);
		}
	} else {
		for (i = 0, length = this.CustomStyles.length; i < length; ++i) {
			if (name === this.CustomStyles[i].Name) {
				style = this.CustomStyles[i];
				break;
			}
			maxXfId = Math.max(maxXfId, this.CustomStyles[i].XfId);
		}
	}

	// Если нашли, то возвращаем XfId
	if (style)
		return style.XfId;

	if (defaultStyle) {
		this.CustomStyles[i] = defaultStyle.clone();
		this.CustomStyles[i].XfId = ++maxXfId;
		return this.CustomStyles[i].XfId;
	}
	return g_oDefaultFormat.XfId;
};
/** @constructor */
function CCellStyle() {
	this.BuiltinId = null;
	this.CustomBuiltin = null;
	this.Hidden = null;
	this.ILevel = null;
	this.Name = null;
	this.XfId = null;

	this.xfs = null;

	this.ApplyBorder = true;
	this.ApplyFill = true;
	this.ApplyFont = true;
	this.ApplyNumberFormat = true;
}
CCellStyle.prototype.clone = function () {
	var oNewStyle = new CCellStyle();
	oNewStyle.BuiltinId = this.BuiltinId;
	oNewStyle.CustomBuiltin = this.CustomBuiltin;
	oNewStyle.Hidden = this.Hidden;
	oNewStyle.ILevel = this.ILevel;
	oNewStyle.Name = this.Name;

	oNewStyle.ApplyBorder = this.ApplyBorder;
	oNewStyle.ApplyFill = this.ApplyFill;
	oNewStyle.ApplyFont = this.ApplyFont;
	oNewStyle.ApplyNumberFormat = this.ApplyNumberFormat;

	oNewStyle.xfs = this.xfs.clone();
	return oNewStyle;
};
CCellStyle.prototype.getFill = function () {
	if (null != this.xfs && null != this.xfs.fill)
		return this.xfs.fill.bg;

	return g_oDefaultFormat.Fill.bg;
};
CCellStyle.prototype.getFontColor = function () {
	if (null != this.xfs && null != this.xfs.font)
		return this.xfs.font.getColor();

	return g_oDefaultFormat.Font.c;
};
CCellStyle.prototype.getFont = function () {
	if (null != this.xfs && null != this.xfs.font)
		return this.xfs.font;
	return g_oDefaultFormat.Font;
};
CCellStyle.prototype.getBorder = function () {
	if (null != this.xfs && null != this.xfs.border)
		return this.xfs.border;
	return g_oDefaultFormat.Border;
};
CCellStyle.prototype.getNumFormatStr = function () {
	if(null != this.xfs && null != this.xfs.num)
		return this.xfs.num.getFormat();
	return g_oDefaultFormat.Num.getFormat();
};
/** @constructor */
function StyleManager(){
	//стиль ячейки по умолчанию, может содержать не все свойства
	this.oDefaultXfs = new CellXfs();
}
StyleManager.prototype =
{
	init: function(oDefaultXfs, wb) {
		//font
		if (!oDefaultXfs.font) {
			oDefaultXfs.font = new AscCommonExcel.Font();
		}
		if (!oDefaultXfs.font.scheme) {
			oDefaultXfs.font.scheme = Asc.EFontScheme.fontschemeMinor;
		}
		if (!oDefaultXfs.font.fn) {
			var sThemeFont = null;
			if (null != wb.theme.themeElements && null != wb.theme.themeElements.fontScheme) {
				if (Asc.EFontScheme.fontschemeMinor == oDefaultXfs.font.scheme && wb.theme.themeElements.fontScheme.minorFont) {
					sThemeFont = wb.theme.themeElements.fontScheme.minorFont.latin;
				} else if (Asc.EFontScheme.fontschemeMajor == oDefaultXfs.font.scheme && wb.theme.themeElements.fontScheme.majorFont) {
					sThemeFont = wb.theme.themeElements.fontScheme.majorFont.latin;
				}
			}
			oDefaultXfs.font.fn = sThemeFont ? sThemeFont : "Calibri";
		}
		if (!oDefaultXfs.font.fs) {
			oDefaultXfs.font.fs = 11;
		}
		if (!oDefaultXfs.font.c) {
			oDefaultXfs.font.c = AscCommonExcel.g_oColorManager.getThemeColor(AscCommonExcel.g_nColorTextDefault);
		}
		g_oDefaultFormat.Font = oDefaultXfs.font;
		if(null != oDefaultXfs.fill)
			g_oDefaultFormat.Fill = oDefaultXfs.fill.clone();
		if(null != oDefaultXfs.border)
			g_oDefaultFormat.Border = oDefaultXfs.border.clone();
		if(null != oDefaultXfs.num)
			g_oDefaultFormat.Num = oDefaultXfs.num.clone();
		if(null != oDefaultXfs.align)
			g_oDefaultFormat.Align = oDefaultXfs.align.clone();
		if (null !== oDefaultXfs.XfId) {
			this.oDefaultXfs.XfId = oDefaultXfs.XfId;
			g_oDefaultFormat.XfId = oDefaultXfs.XfId;
		}
		this.oDefaultXfs = oDefaultXfs;
	},
	setCellStyle : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "XfId", CellXfs.prototype.getXfId, CellXfs.prototype.setXfId);
	},
	setNum : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "num", CellXfs.prototype.getNum, CellXfs.prototype.setNum, g_StyleCache.addNum);
	},
	setFont : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "font", CellXfs.prototype.getFont, CellXfs.prototype.setFont, g_StyleCache.addFont);
	},
	setFill : function(oItemWithXfs, val)
	{
		if(val){
			var fill = new Fill();
			fill.bg = val;
			val = fill;
		}
		var oRes = this._setProperty(oItemWithXfs, val, "fill", CellXfs.prototype.getFill, CellXfs.prototype.setFill, g_StyleCache.addFill);
		if (oRes.oldVal) {
			oRes.oldVal = oRes.oldVal.bg;
		}
		if (oRes.newVal) {
			oRes.newVal = oRes.newVal.bg;
		}
		return oRes;
	},
	setBorder : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "border", CellXfs.prototype.getBorder, CellXfs.prototype.setBorder, g_StyleCache.addBorder);
	},
	setQuotePrefix : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "quotePrefix", CellXfs.prototype.getQuotePrefix, CellXfs.prototype.setQuotePrefix);
	},
	setPivotButton : function(oItemWithXfs, val)
	{
		return this._setProperty(oItemWithXfs, val, "pivotButton", CellXfs.prototype.getPivotButton, CellXfs.prototype.setPivotButton);
	},
	setFontname : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "name", Font.prototype.getName, function(val){
			this.setName(val);
			this.setScheme(null);
		}, "name");
	},
	setFontsize : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "size", Font.prototype.getSize, Font.prototype.setSize);
	},
	setFontcolor : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "color", Font.prototype.getColor, Font.prototype.setColor);
	},
	setBold : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "bold", Font.prototype.getBold, Font.prototype.setBold);
	},
	setItalic : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "italic", Font.prototype.getItalic, Font.prototype.setItalic);
	},
	setUnderline : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "underline", Font.prototype.getUnderline, Font.prototype.setUnderline);
	},
	setStrikeout : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "strikeout", Font.prototype.getStrikeout, Font.prototype.setStrikeout);
	},
	setFontAlign : function(oItemWithXfs, val)
	{
		return this._setFontProperty(oItemWithXfs, val, "fontAlign", Font.prototype.getVerticalAlign, Font.prototype.setVerticalAlign);
	},
	setAlignVertical : function(oItemWithXfs, val)
	{
		return this._setAlignProperty(oItemWithXfs, val, "alignVertical", Align.prototype.getAlignVertical, Align.prototype.setAlignVertical);
	},
	setAlignHorizontal : function(oItemWithXfs, val)
	{
		return this._setAlignProperty(oItemWithXfs, val, "alignHorizontal", Align.prototype.getAlignHorizontal, Align.prototype.setAlignHorizontal);
	},
	setShrinkToFit : function(oItemWithXfs, val)
	{
		return this._setAlignProperty(oItemWithXfs, val, "shrinkToFit", Align.prototype.getShrinkToFit, Align.prototype.setShrinkToFit);
	},
	setWrap : function(oItemWithXfs, val)
	{
		return this._setAlignProperty(oItemWithXfs, val, "wrap", Align.prototype.getWrap, Align.prototype.setWrap);
	},
    setAngle : function(oItemWithXfs, val)
    {
		return this._setAlignProperty(oItemWithXfs, val, "angle", function(){
			return AscCommonExcel.angleFormatToInterface2(this.angle);
		}, Align.prototype.setAngle);
    },
	setVerticalText : function(oItemWithXfs, val)
    {
		if(true == val)
			return this.setAngle(oItemWithXfs, AscCommonExcel.g_nVerticalTextAngle);
		else
			return this.setAngle(oItemWithXfs, 0);
    },
	_initXf: function(oItemWithXfs){
		var xfs = oItemWithXfs.xfs;
		if (!xfs) {
			if (oItemWithXfs.getDefaultXfs) {
				xfs = oItemWithXfs.getDefaultXfs();
			}
			if (!xfs) {
				xfs = this.oDefaultXfs;
			}
		}
		return xfs;
	},
	_initXfFont: function(xfs){
		xfs = xfs.clone();
		if(null == xfs.font){
			xfs.font = g_oDefaultFormat.Font;
		}
		xfs.font = xfs.font.clone();
		return xfs;
	},
	_initXfAlign: function(xfs){
		xfs = xfs.clone();
		if(null == xfs.align){
			xfs.align = g_oDefaultFormat.Align;
		}
		xfs.align = xfs.align.clone();
		return xfs;
	},
	_setProperty: function(oItemWithXfs, val, prop, getFunc, setFunc, addFunc) {
		var xfs = oItemWithXfs.xfs;
		var oRes = {newVal: null, oldVal: xfs ? getFunc.call(xfs) : null};
		xfs = this._initXf(oItemWithXfs);
		var hash = val && val.getHash ? val.getHash() : val;
		var xfsOperationCache = xfs;
		var newXf = xfs.getOperationCache(prop, hash);
		if (newXf) {
			oItemWithXfs.setStyleInternal(newXf);
			xfs = newXf;
		} else {
			xfs = xfs.clone();
			if (null != val) {
				if (addFunc) {
					setFunc.call(xfs, addFunc.call(g_StyleCache, val));
				} else {
					setFunc.call(xfs, val);
				}
			}
			else if (null != xfs) {
				setFunc.call(xfs, null);
			}

			xfs = g_StyleCache.addXf(xfs);
			xfsOperationCache.setOperationCache(prop, hash, xfs);
			oItemWithXfs.setStyleInternal(xfs);
		}
		oRes.newVal = xfs ? getFunc.call(xfs) : null;
		return oRes;
	},
	_setFontProperty : function(oItemWithXfs, val, prop, getFunc, setFunc)
	{
		var xfs = oItemWithXfs.xfs;
		var oRes = {newVal: val, oldVal: xfs && xfs.font ? getFunc.call(xfs.font): null};
		xfs = this._initXf(oItemWithXfs);
		var hash = val && val.getHash ? val.getHash() : val;
		var xfsOperationCache = xfs;
		var newXf = xfs.getOperationCache(prop, hash);
		if (newXf) {
			oItemWithXfs.setStyleInternal(newXf);
		} else {
			xfs = this._initXfFont(xfs);

			setFunc.call(xfs.font, val);
			xfs.font = g_StyleCache.addFont(xfs.font);

			xfs = g_StyleCache.addXf(xfs);
			xfsOperationCache.setOperationCache(prop, val, xfs);
			oItemWithXfs.setStyleInternal(xfs);
		}
		return oRes;
	},
	_setAlignProperty : function(oItemWithXfs, val, prop, getFunc, setFunc)
	{
		var xfs = oItemWithXfs.xfs;
		var oRes = {newVal: val, oldVal: xfs && xfs.align ? getFunc.call(xfs.align): getFunc.call(g_oDefaultFormat.Align)};
		xfs = this._initXf(oItemWithXfs);
		var xfsOperationCache = xfs;
		var newXf = xfs.getOperationCache(prop, val);
		if (newXf) {
			oItemWithXfs.setStyleInternal(newXf);
		} else {
			xfs = this._initXfAlign(xfs);

			setFunc.call(xfs.align, val);
			xfs.align = g_StyleCache.addAlign(xfs.align);

			xfs = g_StyleCache.addXf(xfs);
			xfsOperationCache.setOperationCache(prop, val, xfs);
			oItemWithXfs.setStyleInternal(xfs);
		}
		return oRes;
	}
};

	function StyleCache() {
		this.fonts = {count: 0, vals: {}};
		this.fills = {count: 0, vals: {}};
		this.borders = {count: 0, vals: {}};
		this.nums = {count: 0, vals: {}};
		this.aligns = {count: 0, vals: {}};
		this.xfs = {list: [], vals: {}};
	}

	StyleCache.prototype.addFont = function(newFont) {
		return this._add(this.fonts, newFont);
	};
	StyleCache.prototype.addFill = function(newFill) {
		return this._add(this.fills, newFill);
	};
	StyleCache.prototype.addBorder = function(newBorder) {
		return this._add(this.borders, newBorder);
	};
	StyleCache.prototype.addNum = function(newNum) {
		return this._add(this.nums, newNum);
	};
	StyleCache.prototype.addAlign = function(newAlign) {
		return this._add(this.aligns, newAlign);
	};
	StyleCache.prototype.addXf = function(newXf, recursively) {
		if (newXf) {
			if(newXf.font){
				newXf.font = this.addFont(newXf.font);
			}
			if(newXf.fill){
				newXf.fill = this.addFill(newXf.fill);
			}
			if(newXf.border){
				newXf.border = this.addBorder(newXf.border);
			}
			if(newXf.num){
				newXf.num = this.addNum(newXf.num);
			}
			if(newXf.align){
				newXf.align = this.addAlign(newXf.align);
			}
		}
		return this._add(this.xfs, newXf);
	};
	StyleCache.prototype.getXf = function(index) {
		return 1 <= index && index <= this.xfs.list.length ? this.xfs.list[index - 1] : null;
	};
	StyleCache.prototype.getXfCount = function() {
		return this.xfs.list.length;
	};
	StyleCache.prototype._add = function(container, newVal) {
		if (newVal && undefined === newVal.getIndexNumber()) {
			var hash = newVal.getHash();
			var res = container.vals[hash];
			if (!res) {
				if (container.list) {
					//index starts with 1
					newVal.setIndexNumber(container.list.push(newVal));
				} else {
					newVal.setIndexNumber(container.count++);
				}
				container.vals[hash] = newVal;
				res = newVal;
			}
			return res;
		} else {
			return newVal;
		}
	};
	var g_StyleCache = new StyleCache();

	/** @constructor */
	function SheetMergedStyles() {
		this.stylesTablePivot = [];
		this.stylesConditional = [];
	}

	SheetMergedStyles.prototype.setTablePivotStyle = function(range, xf, stripe) {
		this.stylesTablePivot.push({xf: xf, range: range, stripe: stripe, borders: undefined});
	};
	SheetMergedStyles.prototype.clearTablePivotStyle = function(range) {
		for (var i = this.stylesTablePivot.length - 1; i >= 0; --i) {
			var style = this.stylesTablePivot[i];
			if (style.range.isIntersect(range)) {
				this.stylesTablePivot.splice(i, 1);
			}
		}
	};
	SheetMergedStyles.prototype.setConditionalStyle = function(multiplyRange, formula) {
		this.stylesConditional.push({multiplyRange: multiplyRange, formula: formula});
	};
	SheetMergedStyles.prototype.clearConditionalStyle = function(multiplyRange) {
		for (var i = this.stylesConditional.length - 1; i >= 0; --i) {
			var style = this.stylesConditional[i];
			if (style.multiplyRange.isIntersect(multiplyRange)) {
				this.stylesConditional.splice(i, 1);
			}
		}
	};
	SheetMergedStyles.prototype.getStyle = function(hiddenManager, row, col, opt_ws) {
		var res = {table: [], conditional: []};
		if (opt_ws) {
			opt_ws._updateConditionalFormatting();
		}
		for (var i = 0; i < this.stylesConditional.length; ++i) {
			var style = this.stylesConditional[i];
			if (style.multiplyRange.contains(col, row)) {
				var xf = style.formula(row, col);
				if (xf) {
					res.conditional.push(xf);
				}
			}
		}
		for (var i = 0; i < this.stylesTablePivot.length; ++i) {
			var style = this.stylesTablePivot[i];
			var borderIndex;
			var xf = style.xf;
			if (style.range.contains(col, row) && (borderIndex = this._getBorderIndex(hiddenManager, style.range, style.stripe, row, col, xf)) >= 0) {
				if (borderIndex > 0) {
					if (!style.borders) {
						style.borders = {};
					}
					var xfModified = style.borders[borderIndex];
					if (!xfModified) {
						xfModified = xf.clone();
						var borderModified = xfModified.border.clone();
						if (0 !== (1 & borderIndex)) {
							borderModified.l = borderModified.iv;
						}
						if (0 !== (2 & borderIndex)) {
							borderModified.t = borderModified.ih;
						}
						if (0 !== (4 & borderIndex)) {
							borderModified.r = borderModified.iv;
						}
						if (0 !== (8 & borderIndex)) {
							borderModified.b = borderModified.ih;
						}
						if (0 !== (16 & borderIndex)) {
							borderModified.du = false;
							borderModified.dd = false;
						}
						xfModified.border = g_StyleCache.addBorder(borderModified);
						xfModified = g_StyleCache.addXf(xfModified);
						style.borders[borderIndex] = xfModified;
					}
					xf = xfModified;
				}
				res.table.push(xf);
			}
		}
		return res;
	};
	SheetMergedStyles.prototype._getBorderIndex = function(hiddenManager, bbox, stripe, row, col, xf) {
		var borderIndex = 0;
		var hidden;
		if (stripe) {
			if (stripe.row) {
				hidden = hiddenManager.getHiddenRowsCount(bbox.r1, row);
				var rowIndex = (row - bbox.r1 - hidden) % (stripe.size + stripe.offset);
				if (rowIndex < stripe.size) {
					if (xf.border) {
						if (bbox.c1 !== col && xf.border.l) {
							borderIndex += 1;
						}
						if (0 != rowIndex && xf.border.t) {
							borderIndex += 2;
						}
						if (bbox.c2 !== col && xf.border.r) {
							borderIndex += 4;
						}
						if (stripe.size - 1 != rowIndex && xf.border.b) {
							borderIndex += 8;
						}
					}
				} else {
					borderIndex = -1;
				}
			} else {
				hidden = hiddenManager.getHiddenColsCount(bbox.c1, col);
				var colIndex = (col - bbox.c1 - hidden) % (stripe.size + stripe.offset);
				if (colIndex < stripe.size) {
					if (xf.border) {
						if (0 != colIndex && xf.border.l) {
							borderIndex += 1;
						}
						if (bbox.r1 !== row && xf.border.t) {
							borderIndex += 2;
						}
						if (stripe.size - 1 != colIndex && xf.border.r) {
							borderIndex += 4;
						}
						if (bbox.r2 !== row && xf.border.b) {
							borderIndex += 8;
						}
					}
				} else {
					borderIndex = -1;
				}
			}
		} else if (xf.border) {
			if (bbox.c1 !== col && xf.border.l) {
				borderIndex += 1;
			}
			if (bbox.r1 !== row && xf.border.t) {
				borderIndex += 2;
			}
			if (bbox.c2 !== col && xf.border.r) {
				borderIndex += 4;
			}
			if (bbox.r2 !== row && xf.border.b) {
				borderIndex += 8;
			}
		}
		if (xf.border && (xf.border.du || xf.border.dd)) {
			borderIndex += 16;
		}
		return borderIndex;
	};
var g_oHyperlinkProperties = {
		Ref: 0,
		Location: 1,
		Hyperlink: 2,
		Tooltip: 3
	};
/** @constructor */
function Hyperlink () {
	this.Properties = g_oHyperlinkProperties;
    this.Ref = null;
    this.Hyperlink = null;
    this.Tooltip = null;
	// Составные части Location
	this.Location = null;
	this.LocationSheet = null;
	this.LocationRange = null;
	this.bUpdateLocation = false;
	
	this.bVisited = false;
}
Hyperlink.prototype = {
	clone : function (oNewWs) {
		var oNewHyp = new Hyperlink();
		if (null !== this.Ref)
			oNewHyp.Ref = this.Ref.clone(oNewWs);
		if (null !== this.getLocation())
			oNewHyp.setLocation(this.getLocation());
		if (null !== this.LocationSheet)
			oNewHyp.LocationSheet = this.LocationSheet;
		if (null !== this.LocationRange)
			oNewHyp.LocationRange = this.LocationRange;
		if (null !== this.Hyperlink)
			oNewHyp.Hyperlink = this.Hyperlink;
		if (null !== this.Tooltip)
			oNewHyp.Tooltip = this.Tooltip;
		if (null !== this.bVisited)
			oNewHyp.bVisited = this.bVisited;
		return oNewHyp;
	},
	isEqual : function (obj) {
		var bRes = (this.getLocation() == obj.getLocation() && this.Hyperlink == obj.Hyperlink && this.Tooltip == obj.Tooltip);
		if (bRes) {
			var oBBoxRef = this.Ref.getBBox0();
			var oBBoxObj = obj.Ref.getBBox0();
			bRes = (oBBoxRef.r1 == oBBoxObj.r1 && oBBoxRef.c1 == oBBoxObj.c1 && oBBoxRef.r2 == oBBoxObj.r2 && oBBoxRef.c2 == oBBoxObj.c2);
		}
		return bRes;
	},
	isValid : function () {
		return null != this.Ref && (null != this.getLocation() || null != this.Hyperlink);
	},
	setLocationSheet : function (LocationSheet) {
		this.LocationSheet = LocationSheet;
		this.bUpdateLocation = true;
	},
	setLocationRange : function (LocationRange) {
		this.LocationRange = LocationRange;
		this.bUpdateLocation = true;
	},
	setLocation : function (Location) {
		this.bUpdateLocation = false;
		this.Location = Location;
		this.LocationSheet = this.LocationRange = null;

		if (null !== this.Location) {
			var result = parserHelp.parse3DRef(this.Location);
			if (null !== result) {
				this.LocationSheet = result.sheet;
				this.LocationRange = result.range;
			}
		}
	},
	getLocation : function () {
		if (this.bUpdateLocation)
			this._updateLocation();
		return this.Location;
	},
	_updateLocation : function () {
		this.bUpdateLocation = false;
		if (null === this.LocationSheet || null === this.LocationRange)
			this.Location = null;
		else
			this.Location = parserHelp.get3DRef(this.LocationSheet, this.LocationRange);
	},
	setVisited : function (bVisited) {
		this.bVisited = bVisited;
	},
	getVisited : function () {
		return this.bVisited;
	},
	getHyperlinkType : function () {
		return null !== this.Hyperlink ? Asc.c_oAscHyperlinkType.WebLink : Asc.c_oAscHyperlinkType.RangeLink;
	},
	getType : function () {
		return UndoRedoDataTypes.Hyperlink;
	},
	getProperties : function () {
		return this.Properties;
	},
	getProperty : function (nType) {
		switch (nType) {
			case this.Properties.Ref: return parserHelp.get3DRef(this.Ref.worksheet.getName(), this.Ref.getName()); break;
			case this.Properties.Location: return this.getLocation();break;
			case this.Properties.Hyperlink: return this.Hyperlink;break;
			case this.Properties.Tooltip: return this.Tooltip;break;
		}
	},
	setProperty : function (nType, value) {
		switch (nType) {
			case this.Properties.Ref:
				//todo обработать нули
				var oRefParsed = parserHelp.parse3DRef(value);
				if (null !== oRefParsed) {
					// Получаем sheet по имени
					var ws = window["Asc"]["editor"].wbModel.getWorksheetByName (oRefParsed.sheet);
					if (ws)
						this.Ref = ws.getRange2(oRefParsed.range);
				}
			break;
			case this.Properties.Location: this.setLocation(value);break;
			case this.Properties.Hyperlink: this.Hyperlink = value;break;
			case this.Properties.Tooltip: this.Tooltip = value;break;
		}
	},
	applyCollaborative : function (nSheetId, collaborativeEditing) {
		var bbox = this.Ref.getBBox0();
		var OffsetFirst = {offsetCol:0, offsetRow:0};
		var OffsetLast = {offsetCol:0, offsetRow:0};
		OffsetFirst.offsetRow = collaborativeEditing.getLockMeRow2(nSheetId, bbox.r1) - bbox.r1;
		OffsetFirst.offsetCol = collaborativeEditing.getLockMeColumn2(nSheetId, bbox.c1) - bbox.c1;
		OffsetLast.offsetRow = collaborativeEditing.getLockMeRow2(nSheetId, bbox.r2) - bbox.r2;
		OffsetLast.offsetCol = collaborativeEditing.getLockMeColumn2(nSheetId, bbox.c2) - bbox.c2;
		this.Ref.setOffsetFirst(OffsetFirst);
		this.Ref.setOffsetLast(OffsetLast);
	}
};
/** @constructor */
function SheetFormatPr(){
	this.nBaseColWidth = null;
	this.dDefaultColWidth = null;
	this.oAllRow = null;
}
SheetFormatPr.prototype = {
	clone : function(){
		var oRes = new SheetFormatPr();
		oRes.nBaseColWidth = this.nBaseColWidth;
		oRes.dDefaultColWidth = this.dDefaultColWidth;
		if(null != this.oAllRow)
			oRes.oAllRow = this.oAllRow.clone();
		return oRes;
	}
};
/** @constructor */
function Col(worksheet, index)
{
	this.ws = worksheet;
	this.index = index;
    this.BestFit = null;
    this.hd = null;
    this.CustomWidth = null;
    this.width = null;
    this.xfs = null;
}
Col.prototype =
{
	moveHor : function(nDif)
	{
		this.index += nDif;
	},
	isEqual : function(obj)
	{
		var bRes = this.BestFit == obj.BestFit && this.hd == obj.hd && this.width == obj.width && this.CustomWidth == obj.CustomWidth;
		if(bRes)
		{
			if(null != this.xfs && null != obj.xfs)
				bRes = this.xfs.isEqual(obj.xfs);
			else if(null != this.xfs || null != obj.xfs)
				bRes = false;
		}
		return bRes;
	},
	isEmpty : function()
	{
		return null == this.BestFit && null == this.hd && null == this.width && null == this.xfs && null == this.CustomWidth;
	},
	clone : function(oNewWs)
    {
        if(!oNewWs)
            oNewWs = this.ws;
        var oNewCol = new Col(oNewWs, this.index);
        if(null != this.BestFit)
            oNewCol.BestFit = this.BestFit;
        if(null != this.hd)
            oNewCol.hd = this.hd;
        if(null != this.width)
            oNewCol.width = this.width;
		if(null != this.CustomWidth)
            oNewCol.CustomWidth = this.CustomWidth;
        if(null != this.xfs)
			oNewCol.xfs = this.xfs;
        return oNewCol;
    },
	getWidthProp : function()
	{
		return new AscCommonExcel.UndoRedoData_ColProp(this);
	},
	setWidthProp : function(prop)
	{
		if(null != prop)
		{
			if(null != prop.width)
				this.width = prop.width;
			else
				this.width = null;
			this.setHidden(prop.hd);
			if(null != prop.CustomWidth)
				this.CustomWidth = prop.CustomWidth;
			else
				this.CustomWidth = null;
			if(null != prop.BestFit)
				this.BestFit = prop.BestFit;
			else
				this.BestFit = null;
		}
	},
	getStyle : function()
	{
		return this.xfs;
	},
	_getUpdateRange: function () {
	    if (AscCommonExcel.g_nAllColIndex == this.index)
	        return new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
	    else
	        return new Asc.Range(this.index, 0, this.index, gc_nMaxRow0);
	},
	setStyle : function(xfs)
	{
		var oldVal = this.xfs;
		this.setStyleInternal(xfs);
		if (History.Is_On() && oldVal !== this.xfs) {
			History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_SetStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, this.xfs));
		}
	},
	setStyleInternal : function(xfs)
	{
		this.xfs = g_StyleCache.addXf(xfs);
	},
	setCellStyle : function(val)
	{
		var newVal = this.ws.workbook.CellStyles._prepareCellStyle(val);
		var oRes = this.ws.workbook.oStyleManager.setCellStyle(this, newVal);
		if(History.Is_On() && oRes.oldVal != oRes.newVal) {
			var oldStyleName = this.ws.workbook.CellStyles.getStyleNameByXfId(oRes.oldVal);
			History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_SetCellStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldStyleName, val));

			// Выставляем стиль
			var oStyle = this.ws.workbook.CellStyles.getStyleByXfId(oRes.newVal);
			if (oStyle.ApplyFont)
				this.setFont(oStyle.getFont());
			if (oStyle.ApplyFill)
				this.setFill(oStyle.getFill());
			if (oStyle.ApplyBorder)
				this.setBorder(oStyle.getBorder());
			if (oStyle.ApplyNumberFormat)
				this.setNumFormat(oStyle.getNumFormatStr());
		}
	},
	setNumFormat : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setNum(this, new Num({f:val}));
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Num, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setNum : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setNum(this, val);
		if(History.Is_On() && oRes.oldVal != oRes.newVal)
			History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Num, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFont : function(val)
    {
		var oRes = this.ws.workbook.oStyleManager.setFont(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_SetFont, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
		}
	},
	setFontname : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Fontname, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontsize : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontsize(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Fontsize, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontcolor : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontcolor(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Fontcolor, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setBold : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setBold(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Bold, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setItalic : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setItalic(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Italic, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setUnderline : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setUnderline(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Underline, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setStrikeout : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setStrikeout(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Strikeout, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontAlign : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontAlign(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_FontAlign, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setAlignVertical : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setAlignVertical(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_AlignVertical, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setAlignHorizontal : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setAlignHorizontal(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_AlignHorizontal, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFill : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFill(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Fill, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setBorder : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setBorder(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Border, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
		}
	},
	setShrinkToFit : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_ShrinkToFit, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setWrap : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setWrap(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Wrap, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
    setAngle : function(val)
    {
        var oRes = this.ws.workbook.oStyleManager.setAngle(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
    },
	setVerticalText : function(val)
	{
        var oRes = this.ws.workbook.oStyleManager.setVerticalText(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoCol, AscCH.historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setHidden: function(val) {
		if (this.index >= 0 && (!this.hd !== !val)) {
			this.ws.hiddenManager.addHidden(false, this.index);
		}
		this.hd = val;
	},
	getHidden: function() {
		return this.hd;
	},
	setIndex: function(val) {
		this.index = val;
	},
	getIndex: function() {
		return this.index;
	}
};

var g_nRowOffsetFlag = 0;
var g_nRowOffsetXf = g_nRowOffsetFlag + 1;
var g_nRowOffsetHeight = g_nRowOffsetXf + 4;
var g_nRowStructSize = g_nRowOffsetHeight + 8;

var g_nRowFlag_empty = 0;
var g_nRowFlag_init = 1;
var g_nRowFlag_hd = 2;
var g_nRowFlag_CustomHeight = 4;
var g_nRowFlag_CalcHeight = 8;
var g_nRowFlag_NullHeight = 16;

/**
 * @constructor
 */
function Row(worksheet)
{
	this.ws = worksheet;
	this.index = null;
    this.xfs = null;
    this.h = null;
	this.flags = g_nRowFlag_init;
	this._hasChanged = false;
}
Row.prototype =
{
	clear: function() {
		this.index = null;
		this.xfs = null;
		this.h = null;
		this.flags = g_nRowFlag_init;
		this._hasChanged = false;
	},
	saveContent: function(opt_inCaseOfChange) {
		if (this.index >= 0 && (!opt_inCaseOfChange || this._hasChanged)) {
			this._hasChanged = false;
			var sheetMemory = this.ws.rowsData;
			sheetMemory.checkSize(this.index);
			var xfSave = this.xfs ? this.xfs.getIndexNumber() : 0;
			var flagToSave = this.flags;
			var heightToSave = this.h;
			if (null === heightToSave) {
				flagToSave |= g_nRowFlag_NullHeight;
				heightToSave = 0;
			}
			sheetMemory.setUint8(this.index, g_nRowOffsetFlag, flagToSave);
			sheetMemory.setUint32(this.index, g_nRowOffsetXf, xfSave);
			sheetMemory.setFloat64(this.index, g_nRowOffsetHeight, heightToSave);
		}
	},
	loadContent: function(index) {
		var res = false;
		this.clear();
		this.index = index;
		var sheetMemory = this.ws.rowsData;
		if(sheetMemory.hasSize(this.index)){
			this.flags = sheetMemory.getUint8(this.index, g_nRowOffsetFlag);
			if (0 != (g_nRowFlag_init & this.flags)) {
				this.xfs = g_StyleCache.getXf(sheetMemory.getUint32(this.index, g_nRowOffsetXf));
				if (0 !== (g_nRowFlag_NullHeight & this.flags)) {
					this.flags &= ~g_nRowFlag_NullHeight;
					this.h = null;
				} else {
					this.h = sheetMemory.getFloat64(this.index, g_nRowOffsetHeight);
				}
				res = true;
			}
		}
		return res;
	},
	setChanged: function(val) {
		this._hasChanged = val;
	},
	isEmpty : function()
	{
		return this.isEmptyProp();
	},
	isEmptyProp : function()
	{
		//todo
		return null == this.xfs && null == this.h && g_nRowFlag_init == this.flags;
	},
	clone : function(oNewWs, renameParams)
	{
        if(!oNewWs)
            oNewWs = this.ws;
        var oNewRow = new Row(oNewWs);
		oNewRow.index = this.index;
		oNewRow.flags = this.flags;
		if(null != this.xfs)
			oNewRow.xfs = this.xfs;
		if(null != this.h)
			oNewRow.h = this.h;
		return oNewRow;
	},
	copyFrom : function(row)
	{
		this.flags = row.flags;
		if(null != row.xfs)
			this.xfs = row.xfs;
		if(null != row.h)
			this.h = row.h;
		this._hasChanged = true;
	},
	getDefaultXfs : function()
	{
		var oRes = null;
		if(null != this.ws.oAllCol && null != this.ws.oAllCol.xfs)
			oRes = this.ws.oAllCol.xfs.clone();
		return oRes;
	},
	getHeightProp : function()
	{
		return new AscCommonExcel.UndoRedoData_RowProp(this);
	},
	setHeightProp : function(prop)
	{
		if(null != prop)
		{
			if(null != prop.h)
				this.h = prop.h;
			else
				this.h = null;
			this.setHidden(prop.hd);
			this.setCustomHeight(prop.CustomHeight);
		}
	},
	getStyle : function()
	{
		return this.xfs;
	},
	_getUpdateRange: function () {
	    if (AscCommonExcel.g_nAllRowIndex == this.index)
	        return new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
	    else
	        return new Asc.Range(0, this.index, gc_nMaxCol0, this.index);
	},
	setStyle : function(xfs)
	{
		var oldVal = this.xfs;
		this.setStyleInternal(xfs);
		if (History.Is_On() && oldVal !== this.xfs) {
			History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_SetStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, this.xfs));
		}
	},
	setStyleInternal : function(xfs)
	{
		this.xfs = g_StyleCache.addXf(xfs);
		this._hasChanged = true;
	},
	setCellStyle : function(val)
	{
		var newVal = this.ws.workbook.CellStyles._prepareCellStyle(val);
		var oRes = this.ws.workbook.oStyleManager.setCellStyle(this, newVal);
		if(History.Is_On() && oRes.oldVal != oRes.newVal) {
			var oldStyleName = this.ws.workbook.CellStyles.getStyleNameByXfId(oRes.oldVal);
			History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_SetCellStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldStyleName, val));

			// Выставляем стиль
			var oStyle = this.ws.workbook.CellStyles.getStyleByXfId(oRes.newVal);
			if (oStyle.ApplyFont)
				this.setFont(oStyle.getFont());
			if (oStyle.ApplyFill)
				this.setFill(oStyle.getFill());
			if (oStyle.ApplyBorder)
				this.setBorder(oStyle.getBorder());
			if (oStyle.ApplyNumberFormat)
				this.setNumFormat(oStyle.getNumFormatStr());
		}
	},
	setNumFormat : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setNum(this, new Num({f:val}));
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Num, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setNum : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setNum(this, val);
		if(History.Is_On() && oRes.oldVal != oRes.newVal)
			History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Num, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFont : function(val)
    {
		var oRes = this.ws.workbook.oStyleManager.setFont(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_SetFont, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
		}
	},
	setFontname : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Fontname, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontsize : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontsize(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Fontsize, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontcolor : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontcolor(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Fontcolor, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setBold : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setBold(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Bold, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setItalic : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setItalic(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Italic, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setUnderline : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setUnderline(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Underline, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setStrikeout : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setStrikeout(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Strikeout, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontAlign : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFontAlign(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_FontAlign, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setAlignVertical : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setAlignVertical(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_AlignVertical, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setAlignHorizontal : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setAlignHorizontal(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_AlignHorizontal, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFill : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setFill(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Fill, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setBorder : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setBorder(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Border, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
		}
	},
	setShrinkToFit : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_ShrinkToFit, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setWrap : function(val)
	{
		var oRes = this.ws.workbook.oStyleManager.setWrap(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Wrap, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
    setAngle: function(val)
    {
        var oRes = this.ws.workbook.oStyleManager.setAngle(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
    },
	setVerticalText : function(val)
	{
        var oRes = this.ws.workbook.oStyleManager.setVerticalText(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(AscCommonExcel.g_oUndoRedoRow, AscCH.historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},

	setHidden: function(val) {
		if (this.index >= 0 && (!this.getHidden() !== !val)) {
			this.ws.hiddenManager.addHidden(true, this.index);
		}
		if (true === val) {
			this.flags |= g_nRowFlag_hd;
		} else {
			this.flags &= ~g_nRowFlag_hd;
		}
		this._hasChanged = true;
	},
	getHidden: function() {
		return 0 !== (g_nRowFlag_hd & this.flags);
	},
	setCustomHeight: function(val) {
		if (true === val) {
			this.flags |= g_nRowFlag_CustomHeight;
		} else {
			this.flags &= ~g_nRowFlag_CustomHeight;
		}
		this._hasChanged = true;
	},
	getCustomHeight: function() {
		return 0 != (g_nRowFlag_CustomHeight & this.flags);
	},
	setCalcHeight: function(val) {
		if (true === val) {
			this.flags |= g_nRowFlag_CalcHeight;
		} else {
			this.flags &= ~g_nRowFlag_CalcHeight;
		}
		this._hasChanged = true;
	},
	getCalcHeight: function() {
		return 0 != (g_nRowFlag_CalcHeight & this.flags);
	},
	setIndex: function(val) {
		this.index = val;
	},
	getIndex: function() {
		return this.index;
	},
	setHeight: function(val) {
		if (val < 0) {
			val = 0;
		} else if (val > Asc.c_oAscMaxRowHeight) {
			val = Asc.c_oAscMaxRowHeight;
		}
		this.h = val;
		this._hasChanged = true;
	},
	getHeight: function() {
		return this.h;
	}
};
	function getStringFromMultiText(multiText) {
		var sRes = "";
		if (multiText) {
			for (var i = 0, length = multiText.length; i < length; ++i) {
				var elem = multiText[i];
				if (null != elem.text && !(elem.format && elem.format.getSkip())) {
					sRes += elem.text;
				}
			}
		}
		return sRes;
	};
	function isEqualMultiText(multiText1, multiText2) {
		var sRes = "";
		if (multiText1 && multiText2) {
			if (multiText1.length === multiText2.length) {
				for (var i = 0, length = multiText1.length; i < length; ++i) {
					var elem1 = multiText1[i];
					var elem2 = multiText2[i];
					if (!elem1.isEqual(elem2)) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		} else {
			return multiText1 === multiText2;
		}
	};
var g_oCMultiTextElemProperties = {
		text: 0,
		format: 1
	};
function CMultiTextElem() {
	this.text = null;
	this.format = null;
}
CMultiTextElem.prototype =
{
	Properties : g_oCMultiTextElemProperties,
	isEqual : function(val)
	{
		if(null == val)
			return false;
		return this.text == val.text && ((null == this.format && null == val.format) || (null != this.format && null != val.format && this.format.isEqual(val.format)));
	},
	clone : function()
	{
		var oRes = new CMultiTextElem();
		if(null != this.text)
			oRes.text = this.text;
		if(null != this.format)
			oRes.format = this.format.clone();
		return oRes;
	},
	getType : function()
	{
		return UndoRedoDataTypes.ValueMultiTextElem;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.text: return this.text;break;
			case this.Properties.format: return this.format;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.text: this.text = value;break;
			case this.Properties.format: this.format = value;break;
		}
	}
};

var g_oCCellValueProperties = {
		text: 0,
		multiText: 1,
		number: 2,
		type: 3
	};

function CCellValue(opt_cell)
{
	if (opt_cell) {
		this.text = opt_cell.text;
		this.multiText = opt_cell.multiText;
		this.number = opt_cell.number;
		this.type = opt_cell.type;
	} else {
		this.text = null;
		this.multiText = null;
		this.number = null;
		this.type = CellValueType.Number;
	}
}
CCellValue.prototype = 
{
	Properties: g_oCCellValueProperties,
	isEqual : function(val)
	{
		if(null == val)
			return false;
		if(this.text != val.text)
			return false;
		if(this.number != val.number)
			return false;
		if(this.type != val.type)
			return false;
		if(null != this.multiText && null != val.multiText)
		{
			if(this.multiText.length == val.multiText.length)
			{
				for(var i = 0, length = this.multiText.length; i < length; ++i)
				{
					if(false == this.multiText[i].isEqual(val.multiText[i]))
						return false;
				}
				return true;
			}
			return false;
		}
		else if(null == this.multiText && null == val.multiText)
			return true;

		return false;
	},
	getType : function()
	{
		return UndoRedoDataTypes.CellValue;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.text: return this.text;break;
			case this.Properties.multiText: return this.multiText;break;
			case this.Properties.number: return this.number;break;
			case this.Properties.type: return this.type;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.text: this.text = value;break;
			case this.Properties.multiText: this.multiText = value;break;
			case this.Properties.number: this.number = value;break;
			case this.Properties.type: this.type = value;break;
		}
	}
};

function TreeRBNode(key, storedValue){
	this.storedValue = storedValue;
	this.key = key;
	this.red = null;
	
	this.left = null;
	this.right = null;
	this.parent = null;
}
TreeRBNode.prototype = {
	constructor: TreeRBNode,
	isEqual : function(x){
		return this.key == x.key;
	}
};
/**
 *
 * @param low
 * @param high
 * @param storedValue
 * @constructor
 * @extends {TreeRBNode}
 */
function IntervalTreeRBNode(low, high, storedValue){
	TreeRBNode.call(this, low, storedValue);
	this.high = high;
	this.maxHigh = this.high;
	this.minLow = this.key;
}
IntervalTreeRBNode.prototype = Object.create(TreeRBNode.prototype);
IntervalTreeRBNode.prototype.constructor = IntervalTreeRBNode;
IntervalTreeRBNode.prototype.isEqual = function (x) {
	return this.key == x.key && this.high == x.high;
};
		
function TreeRB(){
	this.nil = null;
	this.root = null;
	this._init();
}
TreeRB.prototype = {
	constructor: TreeRB,
	_init : function(){
		this.nil = new TreeRBNode();
		this.nil.left = this.nil.right = this.nil.parent = this.nil;
		this.nil.key = -Number.MAX_VALUE;
		this.nil.red = 0;
		this.nil.storedValue = null;
		
		this.root = new TreeRBNode();
		this.root.left = this.nil.right = this.nil.parent = this.nil;
		this.root.key = Number.MAX_VALUE;
		this.root.red = 0;
		this.root.storedValue = null;
	},
	_treeInsertHelp : function(z){
		var oRes = z;
		z.left = z.right = this.nil;
		var y = this.root;
		var x = this.root.left;
		while(x != this.nil && !x.isEqual(z)){
			y = x;
			if(x.key > z.key)
				x = x.left;
			else
				x = x.right;
		}
		if(x == this.nil)
		{
			z.parent = y;
			if(y == this.root || y.key > z.key)
				y.left = z;
			else
				y.right = z;
		}
		else
			oRes = x;
		return oRes;
	},
	_fixUpMaxHigh : function(x){
	},
	_cleanMaxHigh : function(x){
	},
	_leftRotate : function(x){
		var y = x.right;
		x.right = y.left;
		if (y.left != this.nil)
			y.left.parent = x;
		y.parent = x.parent;
		if(x == x.parent.left){
			x.parent.left = y;
		}
		else{
			x.parent.right = y;
		}
		y.left = x;
		x.parent = y;
	},
	_rightRotate : function(y){
		var x = y.left;
		y.left = x.right;
		if(this.nil !=  x.right)
			x.right.parent = y;
		x.parent = y.parent;
		if(y == y.parent.left){
			y.parent.left = x;
		}
		else{
			y.parent.right = x;
		}
		x.right = y;
		y.parent = x;
	},
	insertOrGet : function(x){
		var y = null;
		var oRes = x;
		oRes = this._treeInsertHelp(x);
		if(x == oRes)
		{
			this._fixUpMaxHigh(x.parent);
			x.red = 1;
			while(x.parent.red)
			{
				if(x.parent == x.parent.parent.left){
					y = x.parent.parent.right;
					if(y.red){
						x.parent.red = 0;
						y.red = 0;
						x.parent.parent.red = 1;
						x = x.parent.parent;
					}
					else{
						if (x == x.parent.right) {
						  x = x.parent;
						  this._leftRotate(x);
						}
						x.parent.red=0;
						x.parent.parent.red=1;
						this._rightRotate(x.parent.parent);
					}
				}
				else{
					y = x.parent.parent.left;
					if (y.red){
						x.parent.red = 0;
						y.red = 0;
						x.parent.parent.red = 1;
						x = x.parent.parent;
					}
					else{
						if (x == x.parent.left) {
							x = x.parent;
							this._rightRotate(x);
						}
						x.parent.red = 0;
						x.parent.parent.red = 1;
						this._leftRotate(x.parent.parent);
					} 
				}
			}
			this.root.left.red = 0;
		}
		return oRes;
	},
	_getSuccessorOf : function(x){
		var y;
		if(this.nil != (y = x.right)){
			while(y.left != this.nil){
				y = y.left;
			}
			return(y);
		}
		else{
			y = x.parent;
			while(x == y.right) {
			  x = y;
			  y = y.parent;
			}
			if (y == this.root) return(this.nil);
			return(y);
		}
	},
	_deleteFixUp : function(x){
		var w;
		var rootLeft = this.root.left;
		
		while((!x.red) && (rootLeft != x)){
			if(x == x.parent.left){
				w = x.parent.right;
				if (w.red){
					w.red = 0;
					x.parent.red = 1;
					this._leftRotate(x.parent);
					w = x.parent.right;
				}
				if((!w.right.red) && (!w.left.red)){
					w.red = 1;
					x = x.parent;
				}
				else{
					if(!w.right.red){
						w.left.red = 0;
						w.red = 1;
						this._rightRotate(w);
						w = x.parent.right;
					}
					w.red = x.parent.red;
					x.parent.red = 0;
					w.right.red = 0;
					this._leftRotate(x.parent);
					x = rootLeft; /* this is to exit while loop */
				}
			}
			else{
				w = x.parent.left;
				if (w.red){
					w.red = 0;
					x.parent.red = 1;
					this._rightRotate(x.parent);
					w = x.parent.left;
				}
				if ( (!w.right.red) && (!w.left.red)){
					w.red = 1;
					x = x.parent;
				}
				else{
					if (!w.left.red) {
						w.right.red = 0;
						w.red = 1;
						this._leftRotate(w);
						w = x.parent.left;
					}
					w.red = x.parent.red;
					x.parent.red = 0;
					w.left.red = 0;
					this._rightRotate(x.parent);
					x = rootLeft; /* this is to exit while loop */
				}
			}
		}
		x.red=0;
	},
	deleteNode : function(z){
		var oRes = z.storedValue;
		var y = ((z.left == this.nil) || (z.right == this.nil)) ? z : this._getSuccessorOf(z);
		var x = (y.left == this.nil) ? y.right : y.left;
		if (this.root == (x.parent = y.parent)){
			this.root.left = x;
		}
		else{
			if (y == y.parent.left){
				y.parent.left = x;
			}
			else{
				y.parent.right = x;
			}
		}
		if (y != z){
			this._cleanMaxHigh(y);
			y.left = z.left;
			y.right = z.right;
			y.parent = z.parent;
			z.left.parent = z.right.parent = y;
			if (z == z.parent.left){
				z.parent.left = y; 
			}
			else{
				z.parent.right = y;
			}
			this._fixUpMaxHigh(x.parent); 
			if(!(y.red)){
				y.red = z.red;
				this._deleteFixUp(x);
			}
			else
				y.red = z.red; 
		}
		else{
			this._fixUpMaxHigh(x.parent);
			if (!(y.red))
				this._deleteFixUp(x);
		}
		return oRes;
	},
	_enumerateRecursion : function(low, high, x, enumResultStack){
		if(x != this.nil){
			if(low > x.key)
				this._enumerateRecursion(low, high, x.right, enumResultStack);
			else if(high < x.key)
				this._enumerateRecursion(low, high, x.left, enumResultStack);
			else
			{
				this._enumerateRecursion(low, high, x.left, enumResultStack);
				enumResultStack.push(x);
				this._enumerateRecursion(low, high, x.right, enumResultStack);
			}
		}
	},
	enumerate : function(low, high){
		var enumResultStack = [];
		if(low <= high)
			this._enumerateRecursion(low, high, this.root.left, enumResultStack);
		return enumResultStack;
	},
	getElem : function(val){
		var oRes = null;
		//todo переделать
		var aElems = this.enumerate(val, val);
		if(aElems.length > 0)
			oRes = aElems[0];
		return oRes;
	},
	getNodeAll : function(){
		return this.enumerate(-Number.MAX_VALUE, Number.MAX_VALUE);
	},
	isEmpty : function(){
		return this.nil == this.root.left;
	}
};

/**
 *
 * @constructor
 * @extends {TreeRB}
 */
function IntervalTreeRB(){
	TreeRB.call(this);
}
IntervalTreeRB.prototype = Object.create(TreeRB.prototype);
IntervalTreeRB.prototype.constructor = IntervalTreeRB;
IntervalTreeRB.prototype._init = function (x) {
	this.nil = new IntervalTreeRBNode();
	this.nil.left = this.nil.right = this.nil.parent = this.nil;
	this.nil.key = this.nil.high = this.nil.maxHigh = -Number.MAX_VALUE;
	this.nil.minLow = Number.MAX_VALUE;
	this.nil.red = 0;
	this.nil.storedValue = null;
	
	this.root = new IntervalTreeRBNode();
	this.root.left = this.nil.right = this.nil.parent = this.nil;
	this.root.key = this.root.high = this.root.maxHigh = Number.MAX_VALUE;
	this.root.minLow = -Number.MAX_VALUE;
	this.root.red = 0;
	this.root.storedValue = null;
};
IntervalTreeRB.prototype._fixUpMaxHigh = function (x) {
	while(x != this.root){
		x.maxHigh = Math.max(x.high, Math.max(x.left.maxHigh, x.right.maxHigh));
		x.minLow = Math.min(x.key, Math.min(x.left.minLow, x.right.minLow));
		x = x.parent;
	}
};
IntervalTreeRB.prototype._cleanMaxHigh = function (x) {
	x.maxHigh = -Number.MAX_VALUE;
	x.minLow = Number.MAX_VALUE;
};
IntervalTreeRB.prototype._overlap = function (a1, a2, b1, b2) {
	if (a1 <= b1){
		return ((b1 <= a2));
	}
	else{
		return ((a1 <= b2));
	}
};
IntervalTreeRB.prototype._enumerateRecursion = function (low, high, x, enumResultStack) {
	if(x != this.nil){
		if(this._overlap(low, high, x.minLow, x.maxHigh))
		{
			this._enumerateRecursion(low, high, x.left, enumResultStack);
			if (this._overlap(low, high, x.key, x.high))
				enumResultStack.push(x);
			this._enumerateRecursion(low, high, x.right, enumResultStack);
		}
	}
};
IntervalTreeRB.prototype._leftRotate = function (x) {
	var y = x.right;
	TreeRB.prototype._leftRotate.call(this, x);

	x.maxHigh = Math.max(x.left.maxHigh,Math.max(x.right.maxHigh,x.high));
	x.minLow = Math.min(x.left.minLow,Math.min(x.right.minLow,x.key));
	y.maxHigh = Math.max(x.maxHigh,Math.max(y.right.maxHigh,y.high));
	y.minLow = Math.min(x.minLow,Math.min(y.right.minLow,y.key));
};
IntervalTreeRB.prototype._rightRotate = function (y) {
	var x = y.left;
	TreeRB.prototype._rightRotate.call(this, y);
	
	y.maxHigh = Math.max(y.left.maxHigh,Math.max(y.right.maxHigh,y.high));
	y.minLow = Math.min(y.left.minLow,Math.min(y.right.minLow,y.key));
	x.maxHigh = Math.max(x.left.maxHigh,Math.max(y.maxHigh,x.high));
	x.minLow = Math.min(x.left.minLow,Math.min(y.minLow,y.key));
};
function RangeDataManagerElem(bbox, data)
{
	this.bbox = bbox;
	this.data = data;
}
function RangeDataManager(fChange)
{
	this.oIntervalTreeRB = new IntervalTreeRB();
	this.oDependenceManager = null;
	this.fChange = fChange;
}
RangeDataManager.prototype = {
    add: function (bbox, data, oChangeParam)
	{
		var oNewNode = new IntervalTreeRBNode(bbox.r1, bbox.r2, null);
		var oStoredNode = this.oIntervalTreeRB.insertOrGet(oNewNode);
		if(oStoredNode == oNewNode)
			oStoredNode.storedValue = [];
		var oNewElem = new RangeDataManagerElem(new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2), data);
		oStoredNode.storedValue.push(oNewElem);
		if(null != this.fChange)
		    this.fChange.call(this, oNewElem.data, null, oNewElem.bbox, oChangeParam);
	},
	get : function(bbox)
	{
		var bboxRange = new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
		var oRes = {all: [], inner: [], outer: []};
		var oNodes = this.oIntervalTreeRB.enumerate(bbox.r1, bbox.r2);
		for(var i = 0, length = oNodes.length; i < length; i++)
		{
			var oNode = oNodes[i];
			if(oNode.storedValue)
			{
				for(var j = 0, length2 = oNode.storedValue.length; j < length2; j++)
				{
					var elem = oNode.storedValue[j];
					if(elem.bbox.isIntersect(bbox))
					{
						oRes.all.push(elem);
						if(bboxRange.containsRange(elem.bbox))
							oRes.inner.push(elem);
						else
							oRes.outer.push(elem);
					}
				}
			}
		}
		return oRes;
	},
	getExact : function(bbox)
	{
		var oRes = null;
		var oGet = this.get(bbox);
		for(var i = 0, length = oGet.inner.length; i < length; i++)
		{
			var elem = oGet.inner[i];
			if(elem.bbox.isEqual(bbox))
			{
				oRes = elem;
				break;
			}
		}
		return oRes;
	},
	_getByCell : function(nRow, nCol)
	{
		var oRes = null;
		var aAll = this.get(new Asc.Range(nCol, nRow, nCol, nRow));
		if(aAll.all.length > 0)
			oRes = aAll.all[0];
		return oRes;
	},
	getByCell : function(nRow, nCol)
	{
		var oRes = this._getByCell(nRow, nCol);
		if(null == oRes && null != this.oDependenceManager)
		{
			var oDependence = this.oDependenceManager._getByCell(nRow, nCol);
			if(null != oDependence)
			{
				var oTempRes = this.get(oDependence.bbox);
				if(oTempRes.all.length > 0)
					oRes = oTempRes.all[0];
			}
		}
		return oRes;
	},
	remove: function (bbox, bInnerOnly, oChangeParam)
	{
	    var aElems = this.get(bbox);
	    var aTargetArray;
	    if (bInnerOnly)
	        aTargetArray = aElems.inner;
	    else
	        aTargetArray = aElems.all;
	    for (var i = 0, length = aTargetArray.length; i < length; ++i)
		{
	        var elem = aTargetArray[i];
	        this.removeElement(elem, oChangeParam);
		}
	},
	removeElement: function (elemToDelete, oChangeParam)
	{
		if(null != elemToDelete)
		{
			var bbox = elemToDelete.bbox;
			var oNodes = this.oIntervalTreeRB.enumerate(bbox.r1, bbox.r2);
			for(var i = 0, length = oNodes.length; i < length; i++)
			{
				var oNode = oNodes[i];
				if(oNode.storedValue)
				{
					for(var j = 0, length2 = oNode.storedValue.length; j < length2; j++)
					{
						var elem = oNode.storedValue[j];
						if(elem.bbox.isEqual(bbox))
						{
							oNode.storedValue.splice(j, 1);
							break;
						}
					}
					if(0 == oNode.storedValue.length)
						this.oIntervalTreeRB.deleteNode(oNode);
				}
			}
			if(null != this.fChange)
			    this.fChange.call(this, elemToDelete.data, elemToDelete.bbox, null, oChangeParam);
		}
	},
	removeAll : function(oChangeParam)
	{
	    this.remove(new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), null, oChangeParam);
		//todo
		this.oIntervalTreeRB = new IntervalTreeRB();
	},
	shiftGet : function(bbox, bHor)
	{
		var bboxGet = shiftGetBBox(bbox, bHor);
		return {bbox: bboxGet, elems: this.get(bboxGet)};
	},
	shift: function (bbox, bAdd, bHor, oGetRes, oChangeParam)
	{
	    var _this = this;
	    if (null == oGetRes)
	        oGetRes = this.shiftGet(bbox, bHor);
	    var offset;
	    if (bHor)
	        offset = { offsetRow: 0, offsetCol: bbox.c2 - bbox.c1 + 1 };
	    else
	        offset = { offsetRow: bbox.r2 - bbox.r1 + 1, offsetCol: 0 };
	    if (!bAdd) {
	        offset.offsetRow = -offset.offsetRow;
	        offset.offsetCol = -offset.offsetCol;
	    }
	    this._shiftmove(true, bbox, offset, oGetRes.elems, oChangeParam);
	},
	move: function (from, to, oChangeParam)
	{
	    var offset = { offsetRow: to.r1 - from.r1, offsetCol: to.c1 - from.c1 };
	    var oGetRes = this.get(from);
	    this._shiftmove(false, from, offset, oGetRes, oChangeParam);
	},
	_shiftmove: function (bShift, bbox, offset, elems, oChangeParam) {
	    var aToChange = [];
	    var bAdd = offset.offsetRow > 0 || offset.offsetCol > 0;
	    var bHor = 0 != offset.offsetCol ? true : false;
	    //сдвигаем inner
	    if (elems.inner.length > 0) {
	        var bboxAsc = Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
	        for (var i = 0, length = elems.inner.length; i < length; i++) {
	            var elem = elems.inner[i];
	            var from = elem.bbox;
	            var to = null;
	            if (bShift) {
	                if (bAdd) {
	                    to = from.clone();
	                    to.setOffset(offset);
	                }
	                else if (!bboxAsc.containsRange(from)) {
	                    to = from.clone();
	                    if (bHor) {
	                        if (to.c1 <= bbox.c2)
	                            to.setOffsetFirst({ offsetRow: 0, offsetCol: bbox.c2 - to.c1 + 1 });
	                    }
	                    else {
	                        if (to.r1 <= bbox.r2)
	                            to.setOffsetFirst({ offsetRow: bbox.r2 - to.r1 + 1, offsetCol: 0 });
	                    }
	                    to.setOffset(offset);
	                }
	            }
	            else {
	                to = from.clone();
	                to.setOffset(offset);
	            }
	            aToChange.push({ elem: elem, to: to });
	        }
	    }
	    //меняем outer
	    if (bShift) {
	        if (elems.outer.length > 0) {
	            for (var i = 0, length = elems.outer.length; i < length; i++) {
	                var elem = elems.outer[i];
	                var from = elem.bbox;
	                var to = null;
	                if (bHor) {
	                    if (from.c1 < bbox.c1 && bbox.r1 <= from.r1 && from.r2 <= bbox.r2) {
	                        if (bAdd) {
	                            to = from.clone();
	                            to.setOffsetLast({ offsetRow: 0, offsetCol: bbox.c2 - bbox.c1 + 1 });
	                        }
	                        else {
	                            to = from.clone();
	                            var nTemp1 = from.c2 - bbox.c1 + 1;
	                            var nTemp2 = bbox.c2 - bbox.c1 + 1;
	                            to.setOffsetLast({ offsetRow: 0, offsetCol: -Math.min(nTemp1, nTemp2) });
	                        }
	                    }
	                }
	                else {
	                    if (from.r1 < bbox.r1 && bbox.c1 <= from.c1 && from.c2 <= bbox.c2) {
	                        if (bAdd) {
	                            to = from.clone();
	                            to.setOffsetLast({ offsetRow: bbox.r2 - bbox.r1 + 1, offsetCol: 0 });
	                        }
	                        else {
	                            to = from.clone();
	                            var nTemp1 = from.r2 - bbox.r1 + 1;
	                            var nTemp2 = bbox.r2 - bbox.r1 + 1;
	                            to.setOffsetLast({ offsetRow: -Math.min(nTemp1, nTemp2), offsetCol: 0 });
	                        }
	                    }
	                }
	                if (null != to)
	                    aToChange.push({ elem: elem, to: to });
	            }
	        }
	    }
	    //сначала сортируем чтобы не было конфликтов при сдвиге
	    aToChange.sort(function (a, b) { return shiftSort(a, b, offset); });

	    if (null != this.fChange) {
	        for (var i = 0, length = aToChange.length; i < length; ++i) {
	            var item = aToChange[i];
	            this.fChange.call(this, item.elem.data, item.elem.bbox, item.to, oChangeParam);
	        }
	    }
	    //убираем fChange, чтобы потом послать его только на одну операцию, а не 2
	    var fOldChange = this.fChange;
	    this.fChange = null;
	    //сначала удаляем все чтобы не было конфликтов
	    for (var i = 0, length = aToChange.length; i < length; ++i) {
	        var item = aToChange[i];
	        var elem = item.elem;
	        this.removeElement(elem, oChangeParam);
	    }
	    //добавляем измененные ячейки
	    for (var i = 0, length = aToChange.length; i < length; ++i) {
	        var item = aToChange[i];
	        if (null != item.to)
	            this.add(item.to, item.elem.data, oChangeParam);
	    }
	    this.fChange = fOldChange;
	},
	getAll : function()
	{
		var aRes = [];
		var oNodes = this.oIntervalTreeRB.getNodeAll();
		for(var i = 0, length = oNodes.length; i < length; i++)
		{
			var oNode = oNodes[i];
			if(oNode.storedValue)
			{
				for(var j = 0, length2 = oNode.storedValue.length; j < length2; j++)
				{
					var elem = oNode.storedValue[j];
					aRes.push(elem);
				}
			}
		}
		return aRes;
	},
	setDependenceManager : function(oDependenceManager)
	{
		this.oDependenceManager = oDependenceManager;
	}
};

	/** @constructor */
	function sparklineGroup(addId) {
		// attributes
		this.type = null;
		this.lineWeight = null;
		this.displayEmptyCellsAs = null;
		this.markers = null;
		this.high = null;
		this.low = null;
		this.first = null;
		this.last = null;
		this.negative = null;
		this.displayXAxis = null;
		this.displayHidden = null;
		this.minAxisType = null;
		this.maxAxisType = null;
		this.rightToLeft = null;
		this.manualMax = null;
		this.manualMin = null;

		this.dateAxis = null;

		// elements
		this.colorSeries = null;
		this.colorNegative = null;
		this.colorAxis = null;
		this.colorMarkers = null;
		this.colorFirst = null;
		this.colorLast = null;
		this.colorHigh = null;
		this.colorLow = null;

		this.f = null;
		this.arrSparklines = [];

		//for drawing preview
		this.canvas = null;

		this.worksheet = null;
		this.Id = null;
		if (addId) {
			this.Id = AscCommon.g_oIdCounter.Get_NewId();
			AscCommon.g_oTableId.Add(this, this.Id);
		}
	}
	sparklineGroup.prototype.getObjectType = function () {
		return AscDFH.historyitem_type_Sparkline;
	};
	sparklineGroup.prototype.Get_Id = function () {
		return this.Id;
	};
	sparklineGroup.prototype.Write_ToBinary2 = function (w) {
		w.WriteLong(this.getObjectType());
		w.WriteString2(this.Id);
		w.WriteString2(this.worksheet ? this.worksheet.getId() : '-1');
	};
	sparklineGroup.prototype.Read_FromBinary2 = function (r) {
		this.Id = r.GetString2();

		// ToDDo не самая лучшая схема добавления на лист...
		var api_sheet = Asc['editor'];
		this.worksheet = api_sheet.wbModel.getWorksheetById(r.GetString2());
		if (this.worksheet) {
			this.worksheet.insertSparklineGroup(this);
		}
	};
	sparklineGroup.prototype.default = function () {
		this.type = Asc.c_oAscSparklineType.Line;
		this.lineWeight = 0.75;
		this.displayEmptyCellsAs = Asc.c_oAscEDispBlanksAs.Zero;
		this.markers = false;
		this.high = false;
		this.low = false;
		this.first = false;
		this.last = false;
		this.negative = false;
		this.displayXAxis = false;
		this.displayHidden = false;
		this.minAxisType = Asc.c_oAscSparklineAxisMinMax.Individual;
		this.maxAxisType = Asc.c_oAscSparklineAxisMinMax.Individual;
		this.rightToLeft = false;
		this.manualMax = null;
		this.manualMin = null;
		this.dateAxis = false;

		// elements
		var defaultSeriesColor = 3629202;
		var defaultOtherColor = 13631488;

		this.colorSeries = new RgbColor(defaultSeriesColor);
		this.colorNegative = new RgbColor(defaultOtherColor);
		this.colorAxis = new RgbColor(defaultOtherColor);
		this.colorMarkers = new RgbColor(defaultOtherColor);
		this.colorFirst = new RgbColor(defaultOtherColor);
		this.colorLast = new RgbColor(defaultOtherColor);
		this.colorHigh = new RgbColor(defaultOtherColor);
		this.colorLow = new RgbColor(defaultOtherColor);
	};
	sparklineGroup.prototype.setWorksheet = function (worksheet, oldWorksheet) {
		this.worksheet = worksheet;
		if (oldWorksheet) {
			var oldSparklines = [];
			var newSparklines = [];
			for (var i = 0; i < this.arrSparklines.length; ++i) {
				oldSparklines.push(this.arrSparklines[i].clone());
				this.arrSparklines[i].updateWorksheet(worksheet.sName, oldWorksheet.sName);
				newSparklines.push(this.arrSparklines[i].clone());
			}
			History.Add(new AscDFH.CChangesSparklinesChangeData(this, oldSparklines, newSparklines));
		}
	};

    sparklineGroup.prototype.checkProperty = function (propOld, propNew, type, fChangeConstructor) {
        if (null !== propNew && propOld !== propNew) {
            History.Add(new fChangeConstructor(this, type, propOld, propNew));
            return propNew;
        }
        return propOld;
    };

	sparklineGroup.prototype.set = function (val) {
		var getColor = function (color) {
			return color instanceof Asc.asc_CColor ? CorrectAscColor(color) : color ? color.clone(): color;
		};

		this.type = this.checkProperty(this.type, val.type, AscDFH.historyitem_Sparkline_Type, AscDFH.CChangesDrawingsLong);
		this.lineWeight = this.checkProperty(this.lineWeight, val.lineWeight, AscDFH.historyitem_Sparkline_LineWeight, AscDFH.CChangesDrawingsDouble);
		this.displayEmptyCellsAs = this.checkProperty(this.displayEmptyCellsAs, val.displayEmptyCellsAs, AscDFH.historyitem_Sparkline_DisplayEmptyCellsAs, AscDFH.CChangesDrawingsLong);
		this.markers = this.checkProperty(this.markers, val.markers, AscDFH.historyitem_Sparkline_Markers, AscDFH.CChangesDrawingsBool);
		this.high = this.checkProperty(this.high, val.high, AscDFH.historyitem_Sparkline_High, AscDFH.CChangesDrawingsBool);
		this.low = this.checkProperty(this.low, val.low, AscDFH.historyitem_Sparkline_Low, AscDFH.CChangesDrawingsBool);
		this.first = this.checkProperty(this.first, val.first, AscDFH.historyitem_Sparkline_First, AscDFH.CChangesDrawingsBool);
		this.last = this.checkProperty(this.last, val.last, AscDFH.historyitem_Sparkline_Last, AscDFH.CChangesDrawingsBool);
		this.negative = this.checkProperty(this.negative, val.negative, AscDFH.historyitem_Sparkline_Negative, AscDFH.CChangesDrawingsBool);
		this.displayXAxis = this.checkProperty(this.displayXAxis, val.displayXAxis, AscDFH.historyitem_Sparkline_DisplayXAxis, AscDFH.CChangesDrawingsBool);
		this.displayHidden = this.checkProperty(this.displayHidden, val.displayHidden, AscDFH.historyitem_Sparkline_DisplayHidden, AscDFH.CChangesDrawingsBool);
		this.minAxisType = this.checkProperty(this.minAxisType, val.minAxisType, AscDFH.historyitem_Sparkline_MinAxisType, AscDFH.CChangesDrawingsLong);
		this.maxAxisType = this.checkProperty(this.maxAxisType, val.maxAxisType, AscDFH.historyitem_Sparkline_MaxAxisType, AscDFH.CChangesDrawingsLong);
		this.rightToLeft = this.checkProperty(this.rightToLeft, val.rightToLeft, AscDFH.historyitem_Sparkline_RightToLeft, AscDFH.CChangesDrawingsBool);
		this.manualMax = this.checkProperty(this.manualMax, val.manualMax, AscDFH.historyitem_Sparkline_ManualMax, AscDFH.CChangesDrawingsDouble);
		this.manualMin = this.checkProperty(this.manualMin, val.manualMin, AscDFH.historyitem_Sparkline_ManualMin, AscDFH.CChangesDrawingsDouble);
		this.dateAxis = this.checkProperty(this.dateAxis, val.dateAxis, AscDFH.historyitem_Sparkline_DateAxis, AscDFH.CChangesDrawingsBool);

		this.colorSeries = this.checkProperty(this.colorSeries, getColor(val.colorSeries), AscDFH.historyitem_Sparkline_ColorSeries, AscDFH.CChangesDrawingsExcelColor);
		this.colorNegative = this.checkProperty(this.colorNegative, getColor(val.colorNegative), AscDFH.historyitem_Sparkline_ColorNegative, AscDFH.CChangesDrawingsExcelColor);
		this.colorAxis = this.checkProperty(this.colorAxis, getColor(val.colorAxis), AscDFH.historyitem_Sparkline_ColorAxis, AscDFH.CChangesDrawingsExcelColor);
		this.colorMarkers = this.checkProperty(this.colorMarkers, getColor(val.colorMarkers), AscDFH.historyitem_Sparkline_ColorMarkers, AscDFH.CChangesDrawingsExcelColor);
		this.colorFirst = this.checkProperty(this.colorFirst, getColor(val.colorFirst), AscDFH.historyitem_Sparkline_ColorFirst, AscDFH.CChangesDrawingsExcelColor);
		this.colorLast = this.checkProperty(this.colorLast, getColor(val.colorLast), AscDFH.historyitem_Sparkline_colorLast, AscDFH.CChangesDrawingsExcelColor);
		this.colorHigh = this.checkProperty(this.colorHigh, getColor(val.colorHigh), AscDFH.historyitem_Sparkline_ColorHigh, AscDFH.CChangesDrawingsExcelColor);
		this.colorLow = this.checkProperty(this.colorLow, getColor(val.colorLow), AscDFH.historyitem_Sparkline_ColorLow, AscDFH.CChangesDrawingsExcelColor);

		this.f = this.checkProperty(this.f, val.f, AscDFH.historyitem_Sparkline_F, AscDFH.CChangesDrawingsString);

		this.cleanCache();
	};
	sparklineGroup.prototype.clone = function (onlyProps) {
		var res = new sparklineGroup(!onlyProps);
		res.set(this);
		res.f = this.f;

		if (!onlyProps) {
			var newSparklines = [];
			for (var i = 0; i < this.arrSparklines.length; ++i) {
				res.arrSparklines.push(this.arrSparklines[i].clone());
				newSparklines.push(this.arrSparklines[i].clone());
			}
			History.Add(new AscDFH.CChangesSparklinesChangeData(res, null, newSparklines));
		}

		return res;
	};
	sparklineGroup.prototype.draw = function (oDrawingContext) {
		var oCacheView;
		var graphics = new AscCommon.CGraphics();
		graphics.init(oDrawingContext.ctx, oDrawingContext.getWidth(0), oDrawingContext.getHeight(0),
			oDrawingContext.getWidth(3), oDrawingContext.getHeight(3));
		graphics.m_oFontManager = AscCommon.g_fontManager;
		for (var i = 0; i < this.arrSparklines.length; ++i) {
			if (oCacheView = this.arrSparklines[i].oCacheView) {
				oCacheView.draw(graphics);
			}
		}
	};
	sparklineGroup.prototype.cleanCache = function () {
		// ToDo clean only colors (for color scheme)
		for (var i = 0; i < this.arrSparklines.length; ++i) {
			this.arrSparklines[i].oCacheView = null;
		}
	};
	sparklineGroup.prototype.updateCache = function (sheet, ranges) {
		var sparklineRange;
		for (var i = 0; i < this.arrSparklines.length; ++i) {
			sparklineRange = this.arrSparklines[i]._f;
			if (sparklineRange) {
				for (var j = 0; j < ranges.length; ++j) {
					if (sparklineRange.isIntersect(ranges[j], sheet)) {
						this.arrSparklines[i].oCacheView = null;
						break;
					}
				}
			}
		}
	};
	sparklineGroup.prototype.contains = function (c, r) {
		for (var j = 0; j < this.arrSparklines.length; ++j) {
			if (this.arrSparklines[j].contains(c, r)) {
				return j;
			}
		}
		return -1;
	};
	sparklineGroup.prototype.intersectionSimple = function (range) {
		for (var j = 0; j < this.arrSparklines.length; ++j) {
			if (this.arrSparklines[j].intersectionSimple(range)) {
				return j;
			}
		}
		return -1;
	};
	sparklineGroup.prototype.remove = function (range) {
		for (var i = 0; i < this.arrSparklines.length; ++i) {
			if (this.arrSparklines[i].checkInRange(range)) {
				History.Add(new AscDFH.CChangesSparklinesRemoveData(this, this.arrSparklines[i]));
				this.arrSparklines.splice(i, 1);
				--i;
			}
		}
		var bRemove = (0 === this.arrSparklines.length);
		return bRemove;
	};
	sparklineGroup.prototype.getLocationRanges = function (onlySingle) {
		var result = new AscCommonExcel.SelectionRange();
		this.arrSparklines.forEach(function (item, i) {
			if (0 === i) {
				result.assign2(item.sqref);
			} else {
				result.addRange();
				result.getLast().assign2(item.sqref);
			}
		});
		var unionRange = result.getUnion();
		return (!onlySingle || unionRange.isSingleRange()) ? unionRange : result;
	};
	sparklineGroup.prototype.getDataRanges = function () {
		var isUnion = true;
		var sheet = this.worksheet.getName();
		var result = new AscCommonExcel.SelectionRange();
		this.arrSparklines.forEach(function (item, i) {
			if (item._f) {
				isUnion = isUnion && sheet === item._f.sheet;
				if (0 === i) {
					result.assign2(item._f);
				} else {
					result.addRange();
					result.getLast().assign2(item._f);
				}
			} else {
				isUnion = false;
			}
		});
		var unionRange = isUnion ? result.getUnion() : result;
		return unionRange.isSingleRange() ? unionRange : result;
	};
	sparklineGroup.prototype.asc_getId = function () {
		return this.Id;
	};
	sparklineGroup.prototype.asc_getType = function () {
		return null !== this.type ? this.type : Asc.c_oAscSparklineType.Line;
	};
	sparklineGroup.prototype.asc_getLineWeight = function () {
		return null !== this.lineWeight ? this.lineWeight : 0.75;
	};
	sparklineGroup.prototype.asc_getDisplayEmpty = function () {
		return null !== this.displayEmptyCellsAs ? this.displayEmptyCellsAs : Asc.c_oAscEDispBlanksAs.Zero;
	};
	sparklineGroup.prototype.asc_getMarkersPoint = function () {
		return !!this.markers;
	};
	sparklineGroup.prototype.asc_getHighPoint = function () {
		return !!this.high;
	};
	sparklineGroup.prototype.asc_getLowPoint = function () {
		return !!this.low;
	};
	sparklineGroup.prototype.asc_getFirstPoint = function () {
		return !!this.first;
	};
	sparklineGroup.prototype.asc_getLastPoint = function () {
		return !!this.last;
	};
	sparklineGroup.prototype.asc_getNegativePoint = function () {
		return !!this.negative;
	};
	sparklineGroup.prototype.asc_getDisplayXAxis = function () {
		return this.displayXAxis;
	};
	sparklineGroup.prototype.asc_getDisplayHidden = function () {
		return this.displayHidden;
	};
	sparklineGroup.prototype.asc_getMinAxisType = function () {
		return null !== this.minAxisType ? this.minAxisType : Asc.c_oAscSparklineAxisMinMax.Individual;
	};
	sparklineGroup.prototype.asc_getMaxAxisType = function () {
		return null !== this.maxAxisType ? this.maxAxisType : Asc.c_oAscSparklineAxisMinMax.Individual;
	};
	sparklineGroup.prototype.asc_getRightToLeft = function () {
		return this.rightToLeft;
	};
	sparklineGroup.prototype.asc_getManualMax = function () {
		return this.manualMax;
	};
	sparklineGroup.prototype.asc_getManualMin = function () {
		return this.manualMin;
	};
	sparklineGroup.prototype.asc_getColorSeries = function () {
		return this.colorSeries ? Asc.colorObjToAscColor(this.colorSeries) : this.colorSeries;
	};
	sparklineGroup.prototype.asc_getColorNegative = function () {
		return this.colorNegative ? Asc.colorObjToAscColor(this.colorNegative) : this.colorNegative;
	};
	sparklineGroup.prototype.asc_getColorAxis = function () {
		return this.colorAxis ? Asc.colorObjToAscColor(this.colorAxis) : this.colorAxis;
	};
	sparklineGroup.prototype.asc_getColorMarkers = function () {
		return this.colorMarkers ? Asc.colorObjToAscColor(this.colorMarkers) : this.colorMarkers;
	};
	sparklineGroup.prototype.asc_getColorFirst = function () {
		return this.colorFirst ? Asc.colorObjToAscColor(this.colorFirst) : this.colorFirst;
	};
	sparklineGroup.prototype.asc_getColorLast = function () {
		return this.colorLast ? Asc.colorObjToAscColor(this.colorLast) : this.colorLast;
	};
	sparklineGroup.prototype.asc_getColorHigh = function () {
		return this.colorHigh ? Asc.colorObjToAscColor(this.colorHigh) : this.colorHigh;
	};
	sparklineGroup.prototype.asc_getColorLow = function () {
		return this.colorLow ? Asc.colorObjToAscColor(this.colorLow) : this.colorLow;
	};
	sparklineGroup.prototype.asc_getDataRanges = function () {
		var arrResultData = [];
		var arrResultLocation = [];
		var oLocationRanges = this.getLocationRanges(true);
		var oDataRanges = oLocationRanges.isSingleRange() && this.getDataRanges();
		if (oLocationRanges.isSingleRange() && oDataRanges.isSingleRange()) {
			for (var i = 0; i < oLocationRanges.ranges.length; ++i) {
				arrResultData.push(oDataRanges.ranges[i].getName());
				arrResultLocation.push(oLocationRanges.ranges[i].getAbsName());
			}
		} else {
			this.arrSparklines.forEach(function (item) {
				arrResultData.push(item.f || cErrorOrigin['ref']);
				arrResultLocation.push(item.sqref.getAbsName());
			});
		}
		return [arrResultData.join(AscCommon.FormulaSeparators.functionArgumentSeparator),
			arrResultLocation.join(AscCommon.FormulaSeparators.functionArgumentSeparator)];
	};
	sparklineGroup.prototype.asc_setType = function (val) {
		this.type = val;
	};
	sparklineGroup.prototype.asc_setLineWeight = function (val) {
		this.lineWeight = val;
	};
	sparklineGroup.prototype.asc_setDisplayEmpty = function (val) {
		this.displayEmptyCellsAs = val;
	};
	sparklineGroup.prototype.asc_setMarkersPoint = function (val) {
		this.markers = val;
	};
	sparklineGroup.prototype.asc_setHighPoint = function (val) {
		this.high = val;
	};
	sparklineGroup.prototype.asc_setLowPoint = function (val) {
		this.low = val;
	};
	sparklineGroup.prototype.asc_setFirstPoint = function (val) {
		this.first = val;
	};
	sparklineGroup.prototype.asc_setLastPoint = function (val) {
		this.last = val;
	};
	sparklineGroup.prototype.asc_setNegativePoint = function (val) {
		this.negative = val;
	};
	sparklineGroup.prototype.asc_setDisplayXAxis = function (val) {
		this.displayXAxis = val;
	};
	sparklineGroup.prototype.asc_setDisplayHidden = function (val) {
		this.displayHidden = val;
	};
	sparklineGroup.prototype.asc_setMinAxisType = function (val) {
		this.minAxisType = val;
	};
	sparklineGroup.prototype.asc_setMaxAxisType = function (val) {
		this.maxAxisType = val;
	};
	sparklineGroup.prototype.asc_setRightToLeft = function (val) {
		this.rightToLeft = val;
	};
	sparklineGroup.prototype.asc_setManualMax = function (val) {
		this.manualMax = val;
	};
	sparklineGroup.prototype.asc_setManualMin = function (val) {
		this.manualMin = val;
	};
	sparklineGroup.prototype.asc_setColorSeries = function (val) {
		this.colorSeries = val;
	};
	sparklineGroup.prototype.asc_setColorNegative = function (val) {
		this.colorNegative = val;
	};
	sparklineGroup.prototype.asc_setColorAxis = function (val) {
		this.colorAxis = val;
	};
	sparklineGroup.prototype.asc_setColorMarkers = function (val) {
		this.colorMarkers = val;
	};
	sparklineGroup.prototype.asc_setColorFirst = function (val) {
		this.colorFirst = val;
	};
	sparklineGroup.prototype.asc_setColorLast = function (val) {
		this.colorLast = val;
	};
	sparklineGroup.prototype.asc_setColorHigh = function (val) {
		this.colorHigh = val;
	};
	sparklineGroup.prototype.asc_setColorLow = function (val) {
		this.colorLow = val;
	};

	sparklineGroup.prototype.createExcellColor = function(aColor) {
		var oExcellColor = null;
		if(Array.isArray(aColor)) {
			if(2 === aColor.length){
				oExcellColor = AscCommonExcel.g_oColorManager.getThemeColor(aColor[0], aColor[1]);
			}
			else if(1 === aColor.length){
				oExcellColor = new AscCommonExcel.RgbColor(0x00ffffff & aColor[0]);
			}
		}
		return oExcellColor;
	};

	sparklineGroup.prototype._generateThumbCache = function () {
		function createItem(value) {
			return {numFormatStr: "General", isDateTimeFormat: false, val: value, isHidden: false};
		}

		switch (this.asc_getType()) {
			case Asc.c_oAscSparklineType.Line: {
				return [createItem(4), createItem(-58), createItem(51), createItem(-124), createItem(124), createItem(60)];
			}
			case Asc.c_oAscSparklineType.Column: {
				return [createItem(88), createItem(56), createItem(144), createItem(64), createItem(-56), createItem(-104),
					createItem(-40), createItem(-24), createItem(-56), createItem(104), createItem(56), createItem(80),
					createItem(-56), createItem(88)];
			}
			case Asc.c_oAscSparklineType.Stacked: {
				return [createItem(1), createItem(-1), createItem(-1), createItem(-2), createItem(1), createItem(1),
					createItem(-1), createItem(1), createItem(1), createItem(1), createItem(1), createItem(2), createItem(-1),
					createItem(1)];
			}
		}
		return [];
	};

	sparklineGroup.prototype._drawThumbBySparklineGroup = function (oSparkline, oSparklineGroup, oSparklineView, oGraphics) {
		oSparklineView.initFromSparkline(oSparkline, oSparklineGroup, null, true);
		var t = this;
		AscFormat.ExecuteNoHistory(function () {
			oSparklineView.chartSpace.setWorksheet(t.worksheet);
		}, this, []);

		oSparklineView.chartSpace.extX = 100;
		oSparklineView.chartSpace.extY = 100;
		oSparklineView.chartSpace.x = 0;
		oSparklineView.chartSpace.y = 0;
		var type = oSparklineGroup.asc_getType();
		if (type === Asc.c_oAscSparklineType.Stacked) {
			AscFormat.ExecuteNoHistory(function () {
				var oPlotArea = oSparklineView.chartSpace.chart.plotArea;
				if (!oPlotArea.layout) {
					oPlotArea.setLayout(new AscFormat.CLayout());
				}
				var fPos = 0.32;
				oPlotArea.layout.setWMode(AscFormat.LAYOUT_MODE_FACTOR);
				oPlotArea.layout.setW(1.0);
				oPlotArea.layout.setHMode(AscFormat.LAYOUT_MODE_FACTOR);
				oPlotArea.layout.setH(1 - 2 * fPos);
				oPlotArea.layout.setYMode(AscFormat.LAYOUT_MODE_EDGE);
				oPlotArea.layout.setY(fPos);
			}, this, []);
		}
		if (type === Asc.c_oAscSparklineType.Line) {
			AscFormat.ExecuteNoHistory(function () {
				var oPlotArea = oSparklineView.chartSpace.chart.plotArea;
				if (!oPlotArea.layout) {
					oPlotArea.setLayout(new AscFormat.CLayout());
				}
				var fPos = 0.16;
				oPlotArea.layout.setWMode(AscFormat.LAYOUT_MODE_FACTOR);
				oPlotArea.layout.setW(1 - fPos);
				oPlotArea.layout.setHMode(AscFormat.LAYOUT_MODE_FACTOR);
				oPlotArea.layout.setH(1 - fPos);
			}, this, []);
		}
		AscFormat.ExecuteNoHistory(function () {
			AscFormat.CheckSpPrXfrm(oSparklineView.chartSpace);
		}, this, []);
		oSparklineView.chartSpace.recalculate();
		oSparklineView.chartSpace.brush = AscFormat.CreateSolidFillRGBA(0xFF, 0xFF, 0xFF, 0xFF);

		oSparklineView.chartSpace.draw(oGraphics);
	};

	sparklineGroup.prototype._isEqualStyle = function (oSparklineGroup) {
		var equalColors = function (color1, color2) {
			return color1 ? color1.isEqual(color2) : color1 === color2;
		};
		return equalColors(this.colorSeries, oSparklineGroup.colorSeries) &&
			equalColors(this.colorNegative, oSparklineGroup.colorNegative) &&
			equalColors(this.colorMarkers, oSparklineGroup.colorMarkers) &&
			equalColors(this.colorFirst, oSparklineGroup.colorFirst) &&
			equalColors(this.colorLast, oSparklineGroup.colorLast) &&
			equalColors(this.colorHigh, oSparklineGroup.colorHigh) && equalColors(this.colorLow, oSparklineGroup.colorLow);
	};

	sparklineGroup.prototype.asc_getStyles = function (type) {
		History.TurnOff();
		var aRet = [];
		var nStyleIndex = -1;
		var oSparklineGroup = this.clone(true);
		if ('undefined' !== typeof type) {
			oSparklineGroup.asc_setType(type);
		}

		var canvas = document.createElement('canvas');
		canvas.width = 50;
		canvas.height = 50;
		if (AscCommon.AscBrowser.isRetina) {
			canvas.width = AscCommon.AscBrowser.convertToRetinaValue(canvas.width, true);
			canvas.height = AscCommon.AscBrowser.convertToRetinaValue(canvas.height, true);
		}
		var oSparklineView = new AscFormat.CSparklineView();
		var oSparkline = new sparkline();
		oSparkline.oCache = this._generateThumbCache();
		var oGraphics = new AscCommon.CGraphics();
		oGraphics.init(canvas.getContext('2d'), canvas.width, canvas.height, 100, 100);
		oGraphics.m_oFontManager = AscCommon.g_fontManager;
		oGraphics.transform(1, 0, 0, 1, 0, 0);

		for (var i = 0; i < 36; ++i) {
			oSparklineGroup.asc_setStyle(i);
			if (nStyleIndex === -1 && this._isEqualStyle(oSparklineGroup)) {
				nStyleIndex = i;
			}

			this._drawThumbBySparklineGroup(oSparkline, oSparklineGroup, oSparklineView, oGraphics);
			aRet.push(canvas.toDataURL("image/png"));
		}
		aRet.push(nStyleIndex);
		History.TurnOn();
		return aRet;
	};

	sparklineGroup.prototype.asc_setStyle = function (nStyleIndex) {
		var oStyle = AscFormat.aSparklinesStyles[nStyleIndex];
		if (oStyle) {
			this.colorSeries = this.createExcellColor(oStyle[0]);
			this.colorNegative = this.createExcellColor(oStyle[1]);
			this.colorAxis = this.createExcellColor(0xff000000);
			this.colorMarkers = this.createExcellColor(oStyle[2]);
			this.colorFirst = this.createExcellColor(oStyle[3]);
			this.colorLast = this.createExcellColor(oStyle[4]);
			this.colorHigh = this.createExcellColor(oStyle[5]);
			this.colorLow = this.createExcellColor(oStyle[6]);
		}
	};
	/** @constructor */
	function sparkline() {
		this.sqref = null;
		this.f = null;
		this._f = null;

		//for preview
		this.oCache = null;
		this.oCacheView = null;
	}

	sparkline.prototype.clone = function () {
		var res = new sparkline();

		res.sqref = this.sqref ? this.sqref.clone() : null;
		res.f = this.f;
		res._f = this._f ? this._f.clone() : null;

		return res;
	};
	sparkline.prototype.setSqref = function (sqref) {
		this.sqref = AscCommonExcel.g_oRangeCache.getAscRange(sqref).clone();
		this.sqref.setAbs(true, true, true, true);
	};
	sparkline.prototype.setF = function (f) {
		this.f = f;
		this._f = AscCommonExcel.g_oRangeCache.getRange3D(this.f);
	};
	sparkline.prototype.updateWorksheet = function (sheet, oldSheet) {
		if (this._f && oldSheet === this._f.sheet && (null === this._f.sheet2 || oldSheet === this._f.sheet2)) {
			this._f.setSheet(sheet);
			this.f = this._f.getName();
		}
	};
	sparkline.prototype.checkInRange = function (range) {
		return this.sqref ? range.isIntersect(this.sqref) : false;
	};
	sparkline.prototype.contains = function (c, r) {
		return this.sqref ? this.sqref.contains(c, r) : false;
	};
	sparkline.prototype.intersectionSimple = function (range) {
		return this.sqref ? this.sqref.intersectionSimple(range) : false;
	};

	// For Auto Filters
	/** @constructor */
	function TablePart(handlers) {
		this.Ref = null;
		this.HeaderRowCount = null;
		this.TotalsRowCount = null;
		this.DisplayName = null;
		this.AutoFilter = null;
		this.SortState = null;
		this.TableColumns = null;
		this.TableStyleInfo = null;

		this.altText = null;
		this.altTextSummary = null;

		this.result = null;
		this.handlers = handlers;
	}

	TablePart.prototype.clone = function () {
		var i, res = new TablePart(this.handlers);
		res.Ref = this.Ref ? this.Ref.clone() : null;
		res.HeaderRowCount = this.HeaderRowCount;
		res.TotalsRowCount = this.TotalsRowCount;
		if (this.AutoFilter) {
			res.AutoFilter = this.AutoFilter.clone();
		}
		if (this.SortState) {
			res.SortState = this.SortState.clone();
		}
		if (this.TableColumns) {
			res.TableColumns = [];
			for (i = 0; i < this.TableColumns.length; ++i) {
				res.TableColumns.push(this.TableColumns[i].clone());
			}
		}
		if (this.TableStyleInfo) {
			res.TableStyleInfo = this.TableStyleInfo.clone();
		}

		if (this.result) {
			res.result = [];
			for (i = 0; i < this.result.length; ++i) {
				res.result.push(this.result[i].clone());
			}
		}
		res.DisplayName = this.DisplayName;

		res.altText = this.altText;
		res.altTextSummary = this.altTextSummary;

		return res;
	};
	TablePart.prototype.renameSheetCopy = function (ws, renameParams) {
		for (var i = 0; i < this.TableColumns.length; ++i) {
			this.TableColumns[i].renameSheetCopy(ws, renameParams);
		}
	};
	TablePart.prototype.removeDependencies = function (opt_cols) {
		if (!opt_cols) {
			opt_cols = this.TableColumns;
		}
		for (var i = 0; i < opt_cols.length; ++i) {
			opt_cols[i].removeDependencies();
		}
	};
	TablePart.prototype.buildDependencies = function () {
		for (var i = 0; i < this.TableColumns.length; ++i) {
			this.TableColumns[i].buildDependencies();
		}
	};
	TablePart.prototype.getAllFormulas = function (formulas) {
		for (var i = 0; i < this.TableColumns.length; ++i) {
			this.TableColumns[i].getAllFormulas(formulas);
		}
	};
	TablePart.prototype.moveRef = function (col, row) {
		var ref = this.Ref.clone();
		ref.setOffset({offsetCol: col ? col : 0, offsetRow: row ? row : 0});

		this.Ref = ref;
		//event
		this.handlers.trigger("changeRefTablePart", this);

		if (this.AutoFilter) {
			this.AutoFilter.moveRef(col, row);
		}
		if (this.SortState) {
			this.SortState.moveRef(col, row);
		}
	};
	TablePart.prototype.changeRef = function (col, row, bIsFirst, bIsNotChangeAutoFilter) {
		var ref = this.Ref.clone();
		if (bIsFirst) {
			ref.setOffsetFirst({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		} else {
			ref.setOffsetLast({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		}

		this.Ref = ref;

		//event
		this.handlers.trigger("changeRefTablePart", this);

		if (this.AutoFilter && !bIsNotChangeAutoFilter) {
			this.AutoFilter.changeRef(col, row, bIsFirst);
		}
		if (this.SortState) {
			this.SortState.changeRef(col, row, bIsFirst);
		}
	};
	TablePart.prototype.changeRefOnRange = function (range, autoFilters, generateNewTableColumns) {
		if (!range) {
			return;
		}

		//add table columns
		if (generateNewTableColumns) {
			var newTableColumns = [];
			var intersectionRanges = this.Ref.intersection(range);

			if (null !== intersectionRanges) {
				this.removeDependencies();
				var tableColumn;
				var headerRow = this.isHeaderRow() ? this.Ref.r1 : this.Ref.r1 - 1;
				for (var i = range.c1; i <= range.c2; i++) {
					if (i >= intersectionRanges.c1 && i <= intersectionRanges.c2) {
						var tableIndex = i - this.Ref.c1;
						tableColumn = this.TableColumns[tableIndex];
					} else {
						tableColumn = new TableColumn();
						var cell = autoFilters.worksheet.getCell3(headerRow, i);
						if (!cell.isNullText()) {
							tableColumn.Name =
								autoFilters.checkTableColumnName(newTableColumns.concat(this.TableColumns),
									cell.getValueWithoutFormat());
						}
					}

					newTableColumns.push(tableColumn);
				}

				for (var j = 0; j < newTableColumns.length; j++) {
					tableColumn = newTableColumns[j];
					if (tableColumn.Name === null) {
						tableColumn.Name = autoFilters._generateColumnName2(newTableColumns);
					}
				}

				this.TableColumns = newTableColumns;
				this.buildDependencies();
			}
		}
		this.Ref = Asc.Range(range.c1, range.r1, range.c2, range.r2);
		//event
		this.handlers.trigger("changeRefTablePart", this);

		if (this.AutoFilter) {
			this.AutoFilter.changeRefOnRange(range);
		}
	};
	TablePart.prototype.isApplyAutoFilter = function () {
		var res = false;

		if (this.AutoFilter) {
			res = this.AutoFilter.isApplyAutoFilter();
		}

		return res;
	};
	TablePart.prototype.isApplySortConditions = function () {
		var res = false;

		if (this.SortState && this.SortState.SortConditions && this.SortState.SortConditions[0]) {
			res = true;
		}

		return res;
	};

	TablePart.prototype.setHandlers = function (handlers) {
		if (this.handlers === null) {
			this.handlers = handlers;
		}
	};

	TablePart.prototype.deleteTableColumns = function (activeRange) {
		if (!activeRange) {
			return;
		}

		var diff = null, startCol;
		if (activeRange.c1 < this.Ref.c1 && activeRange.c2 > this.Ref.c1 && activeRange.c2 < this.Ref.c2)//until
		{
			diff = activeRange.c2 - this.Ref.c1 + 1;
			startCol = 0;
		} else if (activeRange.c1 < this.Ref.c2 && activeRange.c2 > this.Ref.c2 && activeRange.c1 > this.Ref.c1)//after
		{
			diff = this.Ref.c2 - activeRange.c1 + 1;
			startCol = activeRange.c1 - this.Ref.c1;
		} else if (activeRange.c1 >= this.Ref.c1 && activeRange.c2 <= this.Ref.c2)//inside
		{
			diff = activeRange.c2 - activeRange.c1 + 1;
			startCol = activeRange.c1 - this.Ref.c1;
		}

		if (diff !== null) {
			var deleted = this.TableColumns.splice(startCol, diff);
			this.removeDependencies(deleted);

			//todo undo
			var deletedMap = {};
			for (var i = 0; i < deleted.length; ++i) {
				deletedMap[deleted[i].Name] = 1;
			}
			this.handlers.trigger("deleteColumnTablePart", this.DisplayName, deletedMap);

			if (this.SortState) {
				var bIsDeleteSortState = this.SortState.changeColumns(activeRange, true);
				if (bIsDeleteSortState) {
					this.SortState = null;
				}
			}
		}

	};

	TablePart.prototype.addTableColumns = function (activeRange, autoFilters) {
		var newTableColumns = [], num = 0;
		this.removeDependencies();
		for (var j = 0; j < this.TableColumns.length;) {
			var curCol = num + this.Ref.c1;
			if (activeRange.c1 <= curCol && activeRange.c2 >= curCol) {
				newTableColumns[newTableColumns.length] = new TableColumn();
			} else {
				newTableColumns[newTableColumns.length] = this.TableColumns[j];
				j++
			}

			num++;
		}

		for (var j = 0; j < newTableColumns.length; j++) {
			var tableColumn = newTableColumns[j];
			if (tableColumn.Name === null) {
				tableColumn.Name = autoFilters._generateColumnName2(newTableColumns);
			}
		}

		this.TableColumns = newTableColumns;

		/*if(this.SortState && this.SortState.SortConditions && this.SortState.SortConditions[0])
		 {
		 var SortConditions = this.SortState.SortConditions[0];
		 if(activeRange.c1 <= SortConditions.Ref.c1)
		 {
		 var offset = activeRange.c2 - activeRange.c1 + 1;
		 SortConditions.Ref.c1 += offset;
		 SortConditions.Ref.c2 += offset;
		 }
		 }*/

		if (this.SortState) {
			this.SortState.changeColumns(activeRange);
		}

		this.buildDependencies();
	};

	TablePart.prototype.addTableLastColumn = function (activeRange, autoFilters, isAddLastColumn) {
		this.removeDependencies();
		var newTableColumns = this.TableColumns;
		newTableColumns.push(new TableColumn());
		newTableColumns[newTableColumns.length - 1].Name = autoFilters._generateColumnName2(newTableColumns);

		this.TableColumns = newTableColumns;
		this.buildDependencies();
	};

	TablePart.prototype.isAutoFilter = function () {
		return false;
	};

	TablePart.prototype.getAutoFilter = function () {
		return this.AutoFilter;
	};

	TablePart.prototype.getTableRangeForFormula = function (objectParam) {
		var res = null;
		var startRow = this.HeaderRowCount === null ? this.Ref.r1 + 1 : this.Ref.r1;
		var endRow = this.TotalsRowCount ? this.Ref.r2 - 1 : this.Ref.r2;
		switch (objectParam.param) {
			case FormulaTablePartInfo.all: {
				res = new Asc.Range(this.Ref.c1, this.Ref.r1, this.Ref.c2, this.Ref.r2);
				break;
			}
			case FormulaTablePartInfo.data: {
				res = new Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
				break;
			}
			case FormulaTablePartInfo.headers: {
				if (this.HeaderRowCount === null) {
					res = new Asc.Range(this.Ref.c1, this.Ref.r1, this.Ref.c2, this.Ref.r1);
				} else if (!objectParam.toRef || objectParam.bConvertTableFormulaToRef) {
					res = new Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
				}
				break;
			}
			case FormulaTablePartInfo.totals: {
				if (this.TotalsRowCount) {
					res = new Asc.Range(this.Ref.c1, this.Ref.r2, this.Ref.c2, this.Ref.r2);
				} else if (!objectParam.toRef || objectParam.bConvertTableFormulaToRef) {
					res = new Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
				}
				break;
			}
			case FormulaTablePartInfo.thisRow: {
				if (objectParam.cell) {
					if (startRow <= objectParam.cell.r1 && objectParam.cell.r1 <= endRow) {
						res = new Asc.Range(this.Ref.c1, objectParam.cell.r1, this.Ref.c2, objectParam.cell.r1);
					} else if (objectParam.bConvertTableFormulaToRef) {
						res = new Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
					}
				} else {
					if (objectParam.bConvertTableFormulaToRef) {
						res = new Asc.Range(this.Ref.c1, 0, this.Ref.c2, 0);
					} else {
						res = new Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
					}
				}
				break;
			}
			case FormulaTablePartInfo.columns: {
				var startCol = this.getTableIndexColumnByName(objectParam.startCol);
				var endCol = this.getTableIndexColumnByName(objectParam.endCol);

				if (startCol === null) {
					break;
				}
				if (endCol === null) {
					endCol = startCol;
				}

				res = new Asc.Range(this.Ref.c1 + startCol, startRow, this.Ref.c1 + endCol, endRow);
				break;
			}
		}
		if (res) {
			if (objectParam.param === FormulaTablePartInfo.thisRow) {
				res.setAbs(false, true, false, true);
			} else {
				res.setAbs(true, true, true, true);
			}
		}
		return res;
	};

	TablePart.prototype.getTableIndexColumnByName = function (name) {
		var res = null;
		if (name === null || name === undefined || !this.TableColumns) {
			return res;
		}

		for (var i = 0; i < this.TableColumns.length; i++) {
			if (name.toLowerCase() === this.TableColumns[i].Name.toLowerCase()) {
				res = i;
				break;
			}
		}

		return res;
	};

	TablePart.prototype.getTableNameColumnByIndex = function (index) {
		var res = null;
		if (index === null || index === undefined || !this.TableColumns) {
			return res;
		}

		for (var i = 0; i < this.TableColumns.length; i++) {
			if (index === i) {
				res = this.TableColumns[i].Name;
				break;
			}
		}

		return res;
	};

	TablePart.prototype.showButton = function (val) {
		if (val === false) {
			if (!this.AutoFilter) {
				this.AutoFilter = new AutoFilter();
				this.AutoFilter.Ref = this.Ref;
			}

			this.AutoFilter.showButton(val);
		} else {
			if (this.AutoFilter && this.AutoFilter.FilterColumns && this.AutoFilter.FilterColumns.length) {
				this.AutoFilter.showButton(val);
			}
		}
	};

	TablePart.prototype.isShowButton = function () {
		var res = false;

		if (this.AutoFilter) {
			res = this.AutoFilter.isShowButton();
		} else {
			res = null;
		}

		return res;
	};

	TablePart.prototype.generateTotalsRowLabel = function (ws) {
		if (!this.TableColumns) {
			return;
		}

		//в случае одной колонки выставляем только формулу
		if (this.TableColumns.length > 1) {
			this.TableColumns[0].generateTotalsRowLabel();
		}
		this.TableColumns[this.TableColumns.length - 1].generateTotalsRowFunction(ws, this);
	};

	TablePart.prototype.changeDisplayName = function (newName) {
		this.DisplayName = newName;
	};

	TablePart.prototype.getRangeWithoutHeaderFooter = function () {
		var startRow = this.HeaderRowCount === null ? this.Ref.r1 + 1 : this.Ref.r1;
		var endRow = this.TotalsRowCount ? this.Ref.r2 - 1 : this.Ref.r2;

		return Asc.Range(this.Ref.c1, startRow, this.Ref.c2, endRow);
	};

	TablePart.prototype.checkTotalRowFormula = function (ws) {
		for (var i = 0; i < this.TableColumns.length; i++) {
			this.TableColumns[i].checkTotalRowFormula(ws, this);
		}
	};

	TablePart.prototype.changeAltText = function (val) {
		this.altText = val;
	};

	TablePart.prototype.changeAltTextSummary = function (val) {
		this.altTextSummary = val;
	};

	TablePart.prototype.addAutoFilter = function () {
		var autoFilter = new AscCommonExcel.AutoFilter();
		var cloneRef = this.Ref.clone();
		if (this.TotalsRowCount) {
			cloneRef.r2--
		}
		autoFilter.Ref = cloneRef;

		this.AutoFilter = autoFilter;
		return autoFilter;
	};

	TablePart.prototype.isHeaderRow = function () {
		return null === this.HeaderRowCount || this.HeaderRowCount > 0;
	};

	TablePart.prototype.isTotalsRow = function () {
		return this.TotalsRowCount > 0;
	};

	TablePart.prototype.generateSortState = function () {
		this.SortState = new AscCommonExcel.SortState();
		this.SortState.SortConditions = [];
		this.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
	};

	/** @constructor */
	function AutoFilter() {
		this.Ref = null;
		this.FilterColumns = null;
		this.SortState = null;

		this.result = null;
	}

	AutoFilter.prototype.clone = function () {
		var i, res = new AutoFilter();
		res.Ref = this.Ref ? this.Ref.clone() : null;
		res.refTable = this.refTable ? this.refTable.clone() : null;
		if (this.FilterColumns) {
			res.FilterColumns = [];
			for (i = 0; i < this.FilterColumns.length; ++i) {
				res.FilterColumns.push(this.FilterColumns[i].clone());
			}
		}

		if (this.SortState) {
			res.SortState = this.SortState.clone();
		}

		if (this.result) {
			res.result = [];
			for (i = 0; i < this.result.length; ++i) {
				res.result.push(this.result[i].clone());
			}
		}

		return res;
	};

	AutoFilter.prototype.addFilterColumn = function () {
		if (this.FilterColumns === null) {
			this.FilterColumns = [];
		}

		var oNewElem = new FilterColumn();
		this.FilterColumns.push(oNewElem);

		return oNewElem;
	};
	AutoFilter.prototype.moveRef = function (col, row) {
		var ref = this.Ref.clone();
		ref.setOffset({offsetCol: col ? col : 0, offsetRow: row ? row : 0});

		if (this.SortState) {
			this.SortState.moveRef(col, row);
		}

		this.Ref = ref;
	};
	AutoFilter.prototype.changeRef = function (col, row, bIsFirst) {
		var ref = this.Ref.clone();
		if (bIsFirst) {
			ref.setOffsetFirst({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		} else {
			ref.setOffsetLast({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		}

		this.Ref = ref;
	};
	AutoFilter.prototype.changeRefOnRange = function (range) {
		if (!range) {
			return;
		}

		this.Ref = Asc.Range(range.c1, range.r1, range.c2, range.r2);

		if (this.AutoFilter) {
			this.AutoFilter.changeRefOnRange(range);
		}
	};
	AutoFilter.prototype.isApplyAutoFilter = function () {
		var res = false;

		if (this.FilterColumns && this.FilterColumns.length) {
			for (var i = 0; i < this.FilterColumns.length; i++) {
				if (this.FilterColumns[i].isApplyAutoFilter()) {
					res = true;
					break;
				}
			}
		}

		return res;
	};

	AutoFilter.prototype.isApplySortConditions = function () {
		var res = false;

		if (this.SortState && this.SortState.SortConditions && this.SortState.SortConditions[0]) {
			res = true;
		}

		return res;
	};

	AutoFilter.prototype.isAutoFilter = function () {
		return true;
	};

	AutoFilter.prototype.cleanFilters = function () {
		if (!this.FilterColumns) {
			return;
		}

		for (var i = 0; i < this.FilterColumns.length; i++) {
			if (this.FilterColumns[i].ShowButton === false) {
				this.FilterColumns[i].clean();
			} else {
				this.FilterColumns.splice(i, 1);
				i--;
			}
		}
	};

	AutoFilter.prototype.showButton = function (val) {

		if (val === false) {
			if (this.FilterColumns === null) {
				this.FilterColumns = [];
			}

			var columnsLength = this.Ref.c2 - this.Ref.c1 + 1;
			for (var i = 0; i < columnsLength; i++) {
				var filterColumn = this._getFilterColumnByColId(i);
				if (filterColumn) {
					filterColumn.ShowButton = false;
				} else {
					filterColumn = new FilterColumn();
					filterColumn.ColId = i;
					filterColumn.ShowButton = false;
					this.FilterColumns.push(filterColumn);
				}
			}
		} else {
			if (this.FilterColumns && this.FilterColumns.length) {
				for (var i = 0; i < this.FilterColumns.length; i++) {
					this.FilterColumns[i].ShowButton = true;
				}
			}
		}
	};

	AutoFilter.prototype.isShowButton = function () {
		var res = true;

		if (this.FilterColumns && this.FilterColumns.length) {
			for (var i = 0; i < this.FilterColumns.length; i++) {
				if (this.FilterColumns[i].ShowButton === false) {
					res = false;
					break;
				}
			}
		}

		return res;
	};

	AutoFilter.prototype.getRangeWithoutHeaderFooter = function () {
		return Asc.Range(this.Ref.c1, this.Ref.r1 + 1, this.Ref.c2, this.Ref.r2);
	};

	AutoFilter.prototype._getFilterColumnByColId = function (colId) {
		var res = false;

		if (this.FilterColumns && this.FilterColumns.length) {
			for (var i = 0; i < this.FilterColumns.length; i++) {
				if (this.FilterColumns[i].ColId === colId) {
					res = this.FilterColumns[i];
					break;
				}
			}
		}

		return res;
	};

	//функция используется только для изменения данных сортировки, называется так как и в классе TablePart. возможно стоит переименовать.
	AutoFilter.prototype.deleteTableColumns = function (activeRange) {
		if (this.SortState) {
			var bIsDeleteSortState = this.SortState.changeColumns(activeRange, true);
			if (bIsDeleteSortState) {
				this.SortState = null;
			}
		}
	};

	//функция используется только для изменения данных сортировки, называется так как и в классе TablePart. возможно стоит переименовать.
	AutoFilter.prototype.addTableColumns = function (activeRange) {
		if (this.SortState) {
			this.SortState.changeColumns(activeRange);
		}
	};

	AutoFilter.prototype.getIndexByColId = function (colId) {
		var res = null;

		if (!this.FilterColumns) {
			return res;
		}

		for (var i = 0; i < this.FilterColumns.length; i++) {
			if (this.FilterColumns[i].ColId === colId) {
				res = i;
				break;
			}
		}

		return res;
	};

	AutoFilter.prototype.getFilterColumn = function (colId) {
		var res = null;

		if (!this.FilterColumns) {
			return res;
		}

		for (var i = 0; i < this.FilterColumns.length; i++) {
			if (this.FilterColumns[i].ColId === colId) {
				res = this.FilterColumns[i];
				break;
			}
		}

		return res;
	};

	AutoFilter.prototype.getAutoFilter = function () {
		return this;
	};

	AutoFilter.prototype.hiddenByAnotherFilter = function (worksheet, cellId, row, col) {
		var result = false;

		var filterColumns = this.FilterColumns;
		if (filterColumns) {
			for (var j = 0; j < filterColumns.length; j++) {
				var colId = filterColumns[j].ColId;
				if (colId !== cellId) {
					var cell = worksheet.getCell3(row, colId + col);
					var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();

					var isNumberFilter = filterColumns[j].isApplyCustomFilter();
					var val = (isDateTimeFormat || isNumberFilter) ? cell.getValueWithoutFormat() : cell.getValueWithFormat();
					if (filterColumns[j].isHideValue(val, isDateTimeFormat, null, cell)) {
						result = true;
						break;
					}
				}
			}
		}

		return result;
	};

	AutoFilter.prototype.setRowHidden = function(worksheet, newFilterColumn) {
		var startRow = this.Ref.r1 + 1;
		var endRow = this.Ref.r2;

		var colId = newFilterColumn ? newFilterColumn.ColId : null;
		var minChangeRow = null;
		var hiddenObj = {start: this.Ref.r1 + 1, h: null};
		var nHiddenRowCount = 0;
		var nRowsCount = 0;
		for (var i = startRow; i <= endRow; i++) {

			var isHidden = this.hiddenByAnotherFilter(worksheet, colId, i, this.Ref.c1);
			if(!newFilterColumn) {
				if (isHidden !== worksheet.getRowHidden(i)) {
					if (minChangeRow === null) {
						minChangeRow = i;
					}
				}

				if (true === isHidden) {
					worksheet.setRowHidden(isHidden, i, i);
				}
			} else {
				if (!isHidden) {
					var cell = worksheet.getCell3(i, colId + this.Ref.c1);
					var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
					var isNumberFilter = false;
					if (newFilterColumn.CustomFiltersObj || newFilterColumn.Top10 || newFilterColumn.DynamicFilter) {
						isNumberFilter = true;
					}

					var currentValue = (isDateTimeFormat || isNumberFilter) ? cell.getValueWithoutFormat() : cell.getValueWithFormat();
					currentValue = window["Asc"].trim(currentValue);
					var isSetHidden = newFilterColumn.isHideValue(currentValue, isDateTimeFormat, null, cell);

					if (isSetHidden !== worksheet.getRowHidden(i) && minChangeRow === null) {
						minChangeRow = i;
					}

					//скрываем строки
					if (hiddenObj.h === null) {
						hiddenObj.h = isSetHidden;
						hiddenObj.start = i;
					} else if (hiddenObj.h !== isSetHidden) {
						worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
						if (true === hiddenObj.h) {
							nHiddenRowCount += i - hiddenObj.start;
						}

						hiddenObj.h = isSetHidden;
						hiddenObj.start = i;
					}

					if (i === endRow) {
						worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i);
						if (true === hiddenObj.h) {
							nHiddenRowCount += i + 1 - hiddenObj.start;
						}
					}
					nRowsCount++;
				} else if (hiddenObj.h !== null) {
					worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
					if (true === hiddenObj.h) {
						nHiddenRowCount += i - hiddenObj.start;
					}
					hiddenObj.h = null
				}
			}
		}

		return {nOpenRowsCount: nRowsCount - nHiddenRowCount, nAllRowsCount: endRow - startRow + 1, minChangeRow: minChangeRow};
	};

	AutoFilter.prototype.generateSortState = function () {
		this.SortState = new AscCommonExcel.SortState();
		this.SortState.SortConditions = [];
		this.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
	};

	function FilterColumns() {
		this.ColId = null;
		this.CustomFiltersObj = null;
	}

	FilterColumns.prototype.clone = function () {
		var res = new FilterColumns();
		res.ColId = this.ColId;
		if (this.CustomFiltersObj) {
			res.CustomFiltersObj = this.CustomFiltersObj.clone();
		}

		return res;
	};

	/** @constructor */
	function SortState() {
		this.Ref = null;
		this.CaseSensitive = null;
		this.SortConditions = null;
	}

	SortState.prototype.clone = function () {
		var i, res = new SortState();
		res.Ref = this.Ref ? this.Ref.clone() : null;
		res.CaseSensitive = this.CaseSensitive;
		if (this.SortConditions) {
			res.SortConditions = [];
			for (i = 0; i < this.SortConditions.length; ++i) {
				res.SortConditions.push(this.SortConditions[i].clone());
			}
		}
		return res;
	};

	SortState.prototype.moveRef = function (col, row) {
		var ref = this.Ref.clone();
		ref.setOffset({offsetCol: col ? col : 0, offsetRow: row ? row : 0});

		this.Ref = ref;

		if (this.SortConditions) {
			for (var i = 0; i < this.SortConditions.length; ++i) {
				this.SortConditions[i].moveRef(col, row);
			}
		}
	};

	SortState.prototype.changeRef = function (col, row, bIsFirst) {
		var ref = this.Ref.clone();
		if (bIsFirst) {
			ref.setOffsetFirst({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		} else {
			ref.setOffsetLast({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
		}

		this.Ref = ref;
	};

	SortState.prototype.changeColumns = function (activeRange, isDelete) {
		var bIsSortStateDelete = true;
		//если изменяем диапазон так, что удаляется колонка с сортировкой, удаляем ее
		if (this.SortConditions) {
			for (var i = 0; i < this.SortConditions.length; ++i) {
				var bIsSortConditionsDelete = this.SortConditions[i].changeColumns(activeRange, isDelete);
				if (bIsSortConditionsDelete) {
					this.SortConditions[i] = null;
				} else {
					bIsSortStateDelete = false;
				}
			}
		}
		return bIsSortStateDelete;
	};


	/** @constructor */
	function TableColumn() {
		this.Name = null;
		this.TotalsRowLabel = null;
		this.TotalsRowFunction = null;
		this.TotalsRowFormula = null;
		this.dxf = null;
		this.CalculatedColumnFormula = null;
	}

	TableColumn.prototype.onFormulaEvent = function (type, eventData) {
		if (AscCommon.c_oNotifyParentType.CanDo === type) {
			return true;
		} else if (AscCommon.c_oNotifyParentType.Change === type) {
			this.TotalsRowFormula.setIsDirty(false);
		}
	};
	TableColumn.prototype.renameSheetCopy = function (ws, renameParams) {
		if (this.TotalsRowFormula) {
			this.buildDependencies();
			this.TotalsRowFormula.renameSheetCopy(renameParams);
			this.applyTotalRowFormula(this.TotalsRowFormula.assemble(true), ws, true);
		}
	};
	TableColumn.prototype.buildDependencies = function () {
		if (this.TotalsRowFormula) {
			this.TotalsRowFormula.parse();
			this.TotalsRowFormula.buildDependencies();
		}
	};
	TableColumn.prototype.removeDependencies = function () {
		if (this.TotalsRowFormula) {
			this.TotalsRowFormula.removeDependencies();
		}
	};
	TableColumn.prototype.getAllFormulas = function (formulas) {
		if (this.TotalsRowFormula) {
			formulas.push(this.TotalsRowFormula);
		}
	};
	TableColumn.prototype.clone = function () {
		var res = new TableColumn();
		res.Name = this.Name;
		res.TotalsRowLabel = this.TotalsRowLabel;
		res.TotalsRowFunction = this.TotalsRowFunction;

		if (this.TotalsRowFormula) {
			res.applyTotalRowFormula(this.TotalsRowFormula.Formula, this.TotalsRowFormula.ws, false);
		}
		if (this.dxf) {
			res.dxf = this.dxf.clone;
		}
		res.CalculatedColumnFormula = this.CalculatedColumnFormula;
		return res;
	};
	TableColumn.prototype.generateTotalsRowLabel = function () {
		//TODO добавить в перевод
		if (this.TotalsRowLabel === null) {
			this.TotalsRowLabel = "Summary";
		}
	};
	TableColumn.prototype.generateTotalsRowFunction = function (ws, tablePart) {
		//TODO добавить в перевод
		if (null === this.TotalsRowFunction && null === this.TotalsRowLabel) {
			var columnRange = this.getRange(tablePart);

			var totalFunction = Asc.ETotalsRowFunction.totalrowfunctionSum;
			if (null !== columnRange) {
				for (var i = columnRange.r1; i <= columnRange.r2; i++) {
					var type = ws.getCell3(i, columnRange.c1).getType();
					if (null !== type && CellValueType.Number !== type) {
						totalFunction = Asc.ETotalsRowFunction.totalrowfunctionCount;
						break;
					}
				}
			}

			this.TotalsRowFunction = totalFunction;
		}
	};

	TableColumn.prototype.getTotalRowFormula = function (tablePart) {
		var res = null;

		if (null !== this.TotalsRowFunction) {
			switch (this.TotalsRowFunction) {
				case Asc.ETotalsRowFunction.totalrowfunctionAverage: {
					res = "SUBTOTAL(101," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionCount: {
					res = "SUBTOTAL(103," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionCountNums: {
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionCustom: {
					res = this.getTotalsRowFormula();
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionMax: {
					res = "SUBTOTAL(104," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionMin: {
					res = "SUBTOTAL(105," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionNone: {
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionStdDev: {
					res = "SUBTOTAL(107," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionSum: {
					res = "SUBTOTAL(109," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
				case Asc.ETotalsRowFunction.totalrowfunctionVar: {
					res = "SUBTOTAL(110," + tablePart.DisplayName + "[" + this.Name + "])";
					break;
				}
			}
		}

		return res;
	};

	TableColumn.prototype.cleanTotalsData = function () {
		this.CalculatedColumnFormula = null;
		this.applyTotalRowFormula(null, null, false);
		this.TotalsRowFunction = null;
		this.TotalsRowLabel = null;
	};
	TableColumn.prototype.getTotalsRowFormula = function () {
		return this.TotalsRowFormula ? this.TotalsRowFormula.getFormula() : null;
	};
	TableColumn.prototype.setTotalsRowFormula = function (val, ws) {
		this.cleanTotalsData();
		if ("=" === val[0]) {
			val = val.substring(1);
		}
		this.applyTotalRowFormula(val, ws, true);
		this.TotalsRowFunction = Asc.ETotalsRowFunction.totalrowfunctionCustom;
	};

	TableColumn.prototype.setTotalsRowLabel = function (val) {
		this.cleanTotalsData();

		this.TotalsRowLabel = val;
	};

	TableColumn.prototype.checkTotalRowFormula = function (ws, tablePart) {
		if (null !== this.TotalsRowFunction &&
			Asc.ETotalsRowFunction.totalrowfunctionCustom !== this.TotalsRowFunction) {
			var totalRowFormula = this.getTotalRowFormula(tablePart);

			if (null !== totalRowFormula) {
				this.applyTotalRowFormula(totalRowFormula, ws, true);
				this.TotalsRowFunction = Asc.ETotalsRowFunction.totalrowfunctionCustom;
			}
		}
	};
	TableColumn.prototype.applyTotalRowFormula = function (val, opt_ws, opt_buildDep) {
		this.removeDependencies();
		if (val) {
			this.TotalsRowFormula = new AscCommonExcel.parserFormula(val, this, opt_ws);
			if (opt_buildDep) {
				this.buildDependencies();
			}
		} else {
			this.TotalsRowFormula = null;
		}
	};

	TableColumn.prototype.getRange = function (tablePart, includeHeader, includeTotal) {
		var res = null;

		var ref = tablePart.Ref;
		var startRow = (includeHeader && tablePart.isHeaderRow()) || (!tablePart.isHeaderRow()) ? ref.r1 : ref.r1 + 1;
		var endRow = (includeTotal && tablePart.isTotalsRow()) || (!tablePart.isTotalsRow()) ? ref.r2 : ref.r2 - 1;
		var col = null;
		for (var i = 0; i < tablePart.TableColumns.length; i++) {
			if (this.Name === tablePart.TableColumns[i].Name) {
				col = ref.c1 + i;
				break;
			}
		}

		if (null !== col) {
			res = Asc.Range(col, startRow, col, endRow);
		}

		return res;
	};

	/** @constructor */
	function TableStyleInfo() {
		this.Name = null;
		this.ShowColumnStripes = null;
		this.ShowRowStripes = null;
		this.ShowFirstColumn = null;
		this.ShowLastColumn = null;
	}

	TableStyleInfo.prototype.clone = function () {
		var res = new TableStyleInfo();
		res.Name = this.Name;
		res.ShowColumnStripes = this.ShowColumnStripes;
		res.ShowRowStripes = this.ShowRowStripes;
		res.ShowFirstColumn = this.ShowFirstColumn;
		res.ShowLastColumn = this.ShowLastColumn;
		return res;
	};
	TableStyleInfo.prototype.setName = function (val) {
		this.Name = val;
	};

	/** @constructor */
	function FilterColumn() {
		this.ColId = null;
		this.Filters = null;
		this.CustomFiltersObj = null;
		this.DynamicFilter = null;
		this.ColorFilter = null;
		this.Top10 = null;
		this.ShowButton = true;
	}

	FilterColumn.prototype.clone = function () {
		var res = new FilterColumn();
		res.ColId = this.ColId;
		if (this.Filters) {
			res.Filters = this.Filters.clone();
		}
		if (this.CustomFiltersObj) {
			res.CustomFiltersObj = this.CustomFiltersObj.clone();
		}
		if (this.DynamicFilter) {
			res.DynamicFilter = this.DynamicFilter.clone();
		}
		if (this.ColorFilter) {
			res.ColorFilter = this.ColorFilter.clone();
		}
		if (this.Top10) {
			res.Top10 = this.Top10.clone();
		}
		res.ShowButton = this.ShowButton;
		return res;
	};
	FilterColumn.prototype.isHideValue = function (val, isDateTimeFormat, top10Length, cell) {
		var res = false;
		if (this.Filters) {
			this.Filters._initLowerCaseValues();
			res = this.Filters.isHideValue(val.toLowerCase(), isDateTimeFormat);
		} else if (this.CustomFiltersObj) {
			res = this.CustomFiltersObj.isHideValue(val);
		} else if (this.Top10) {
			res = this.Top10.isHideValue(val, top10Length);
		} else if (this.ColorFilter) {
			res = this.ColorFilter.isHideValue(cell);
		} else if (this.DynamicFilter) {
			res = this.DynamicFilter.isHideValue(val);
		}

		return res;
	};
	FilterColumn.prototype.clean = function () {
		this.Filters = null;
		this.CustomFiltersObj = null;
		this.DynamicFilter = null;
		this.ColorFilter = null;
		this.Top10 = null;
	};
	FilterColumn.prototype.createFilter = function (obj) {

		var allFilterOpenElements = false;
		var newFilter;

		switch (obj.filter.type) {
			case c_oAscAutoFilterTypes.ColorFilter: {
				this.ColorFilter = obj.filter.filter.clone();
				break;
			}
			case c_oAscAutoFilterTypes.CustomFilters: {
				obj.filter.filter.check();
				this.CustomFiltersObj = obj.filter.filter.clone();
				break;
			}
			case c_oAscAutoFilterTypes.DynamicFilter: {
				this.DynamicFilter = obj.filter.filter.clone();
				break;
			}
			case c_oAscAutoFilterTypes.Top10: {
				this.Top10 = obj.filter.filter.clone();
				break;
			}
			case c_oAscAutoFilterTypes.Filters: {
				//если приходит только скрытое Blank, тогда добавляем CustomFilter, так же делает MS
				var addCustomFilter = false;
				for (var i = 0; i < obj.values.length; i++) {
					if ("" === obj.values[i].text && false === obj.values[i].visible) {
						addCustomFilter = true;
					} else if ("" !== obj.values[i].text && false === obj.values[i].visible) {
						addCustomFilter = false;
						break;
					}
				}

				if (addCustomFilter) {
					this.CustomFiltersObj = new CustomFilters();
					this.CustomFiltersObj._generateEmptyValueFilter();
				} else {
					newFilter = new Filters();
					allFilterOpenElements = newFilter.init(obj);

					if (!allFilterOpenElements) {
						this.Filters = newFilter;
					}
				}

				break;
			}
		}

		return allFilterOpenElements;
	};

	FilterColumn.prototype.isApplyAutoFilter = function () {
		var res = false;

		if (this.Filters !== null || this.CustomFiltersObj !== null || this.DynamicFilter !== null ||
			this.ColorFilter !== null || this.Top10 !== null) {
			res = true;
		}

		return res;
	};

	FilterColumn.prototype.init = function (range) {

		//добавляем данные, которые не передаются из меню при примененни а/ф(в данном случае только DynamicFilter)
		if (null !== this.DynamicFilter) {
			this.DynamicFilter.init(range);
		} else if (null !== this.Top10) {
			this.Top10.init(range);
		}

	};

	FilterColumn.prototype.isApplyCustomFilter = function () {
		var res = false;

		if (this.Top10 || this.CustomFiltersObj || this.ColorFilter || this.DynamicFilter) {
			res = true;
		}

		return res;
	};

	FilterColumn.prototype.isOnlyNotEqualEmpty = function () {
		var res = false;

		if (this.CustomFiltersObj) {
			var customFilters = this.CustomFiltersObj.CustomFilters;
			var customFilter = customFilters && 1 === customFilters.length ? customFilters[0] : null;
			if (customFilter && c_oAscCustomAutoFilter.doesNotEqual === customFilter.Operator && " " === customFilter.Val) {
				res = true;
			}
		}

		return res;
	};


	/** @constructor */
	function Filters() {
		this.Values = {};
		this.Dates = [];
		this.Blank = null;

		this.lowerCaseValues = null;
	}

	Filters.prototype.clone = function () {
		var i, res = new Filters();
		for (var i in this.Values) {
			res.Values[i] = this.Values[i];
		}
		if (this.Dates) {
			for (i = 0; i < this.Dates.length; ++i) {
				res.Dates.push(this.Dates[i].clone());
			}
		}
		res.Blank = this.Blank;
		return res;
	};
	Filters.prototype.init = function (obj) {
		var allFilterOpenElements = true;
		for (var i = 0; i < obj.values.length; i++) {
			if (obj.values[i].visible) {
				if (obj.values[i].isDateFormat) {
					if (obj.values[i].text === "") {
						this.Blank = true;
					} else {
						var dateGroupItem = new DateGroupItem();
						var autoFilterDateElem = new AutoFilterDateElem(obj.values[i].val, obj.values[i].val, 1);
						dateGroupItem.convertRangeToDateGroupItem(autoFilterDateElem);
						autoFilterDateElem.convertDateGroupItemToRange(dateGroupItem);

						this.Dates.push(autoFilterDateElem);
					}
				} else {
					if (obj.values[i].text === "") {
						this.Blank = true;
					} else {
						this.Values[obj.values[i].text] = true;
					}
				}
			} else {
				allFilterOpenElements = false;
			}
		}
		this._sortDate();
		this._initLowerCaseValues();

		return allFilterOpenElements;
	};
	Filters.prototype.isHideValue = function (val, isDateTimeFormat) {
		var res = false;

		if (isDateTimeFormat && this.Dates) {
			if (val === "") {
				res = !this.Blank ? true : false;
			} else {
				res = this.binarySearch(val, this.Dates) !== -1 ? false : true;
			}
		} else if (this.Values) {
			if (val === "") {
				res = !this.Blank ? true : false;
			} else {
				res = !this.lowerCaseValues[val] ? true : false;
			}
		}

		return res;
	};

	Filters.prototype.binarySearch = function (val, array) {
		var i = 0, j = array.length - 1, k;
		val = parseFloat(val);

		while (i <= j) {
			k = Math.floor((i + j) / 2);

			if (val >= array[k].start && val < array[k].end) {
				return k;
			} else if (val < array[k].start) {
				j = k - 1;
			} else {
				i = k + 1;
			}
		}

		return -1;
	};

	Filters.prototype.linearSearch = function (val, array) {
		var n = array.length, i = 0;
		val = parseFloat(val);

		while (i <= n && !(array[i] && val >= array[i].start && val < array[i].end))
			i++;

		if (i < n) {
			return i;
		} else {
			return -1;
		}
	};
	Filters.prototype._initLowerCaseValues = function () {
		if (this.lowerCaseValues === null) {
			this.lowerCaseValues = {};
			for (var i in this.Values) {
				this.lowerCaseValues[i.toLowerCase()] = true;
			}
		}
	};
	Filters.prototype._sortDate = function () {
		if (this.Dates && this.Dates.length) {
			this.Dates.sort(function sortArr(a, b) {
				return a.start - b.start;
			})
		}
	};

	Filters.prototype.clean = function () {
		this.Values = {};
		this.Dates = [];
		this.Blank = null;
	};
	
/** @constructor */
function Filter() {
	this.Val = null;
}
/** @constructor */
function DateGroupItem() {
	this.DateTimeGrouping = null;
	this.Day = null;
	this.Hour = null;
	this.Minute = null;
	this.Month = null;
	this.Second = null;
	this.Year = null;
}
DateGroupItem.prototype.clone = function() {
	var res = new DateGroupItem();
	res.DateTimeGrouping = this.DateTimeGrouping;
	res.Day = this.Day;
	res.Hour = this.Hour;
	res.Minute = this.Minute;
	res.Month = this.Month;
	res.Second = this.Second;
	res.Year = this.Year;
	return res;
};
DateGroupItem.prototype.convertRangeToDateGroupItem = function(range) {
	var startUtcDate = AscCommon.NumFormat.prototype.parseDate(range.start);
	var year = startUtcDate.year;
	var month = startUtcDate.month + 1;
	var day = startUtcDate.d;
	var hour = startUtcDate.hour;
	var minute = startUtcDate.minute;
	var second = startUtcDate.second;
	
	this.DateTimeGrouping = range.dateTimeGrouping;
	
	switch(this.DateTimeGrouping)
	{
		case 1://day
		{
			this.Year = year;
			this.Month = month;
			this.Day = day;
			break;
		}
		case 2://hour
		{
			this.Year = year;
			this.Month = month;
			this.Day = day;
			this.Hour = hour;
			break;
		}
		case 3://minute
		{
			this.Year = year;
			this.Month = month;
			this.Day = day;
			this.Hour = hour;
			this.Minute = minute;
			break;
		}
		case 4://month
		{
			this.Year = year;
			this.Month = month;
			break;
		}
		case 5://second
		{
			this.Year = year;
			this.Month = month;
			this.Day = day;
			this.Hour = hour;
			this.Minute = minute;
			this.Second = second;
			break;
		}
		case 6://year
		{
			this.Year = year;
			break;
		}
	}
};


var g_oCustomFilters = {
	And	 : 0,
	CustomFilters	: 1
};
/** @constructor */
function CustomFilters() {
	this.Properties = g_oCustomFilters;
	
	this.And = null;
	this.CustomFilters = null;
}
CustomFilters.prototype.getType = function() {
	return UndoRedoDataTypes.CustomFilters;
};
CustomFilters.prototype.getProperties = function() {
	return this.Properties;
};
CustomFilters.prototype.getProperty = function(nType) {
	switch (nType) {
		case this.Properties.And: return this.And; break;
		case this.Properties.CustomFilters: return this.CustomFilters; break;
	}
	return null;
};
CustomFilters.prototype.setProperty = function(nType, value) {
	switch (nType) {
		case this.Properties.And: this.And = value;break;
		case this.Properties.CustomFilters: this.CustomFilters = value;break;
	}
};
	
CustomFilters.prototype.clone = function() {
	var i, res = new CustomFilters();
	res.And = this.And;
	if (this.CustomFilters) {
		res.CustomFilters = [];
		for (i = 0; i < this.CustomFilters.length; ++i)
			res.CustomFilters.push(this.CustomFilters[i].clone());
	}
	return res;
};
CustomFilters.prototype.init = function(obj) {
	this.And = !obj.isChecked;
	this.CustomFilters = [];
	
	if(obj.filter1 != undefined)
		this.CustomFilters[0] = new CustomFilter(obj.filter1, obj.valFilter1);
	if(obj.filter2 != undefined)
		this.CustomFilters[1] = new CustomFilter(obj.filter2, obj.valFilter2);
};
CustomFilters.prototype.isHideValue = function(val){
	
	var res = false;
	var filterRes1 = this.CustomFilters[0] ? this.CustomFilters[0].isHideValue(val) : null;
	var filterRes2 = this.CustomFilters[1] ? this.CustomFilters[1].isHideValue(val) : null;
	
	if(!this.And && ((filterRes1 === null && filterRes2 === true || filterRes1 === true && filterRes2 === null || filterRes1 === true && filterRes2 === true)))
		res = true;
	if(this.And && ((filterRes1 === true || filterRes2 === true)))
		res = true;
	
	return res;
};
CustomFilters.prototype.asc_getAnd = function () { return this.And; };
CustomFilters.prototype.asc_getCustomFilters = function () { return this.CustomFilters; };

CustomFilters.prototype.asc_setAnd = function (val) { this.And = val; };
CustomFilters.prototype.asc_setCustomFilters = function (val) { this.CustomFilters = val; };

CustomFilters.prototype.check = function () {
	if(this.CustomFilters) {
		for(var i = 0; i < this.CustomFilters.length; i++) {
			this.CustomFilters[i].check();
		}
	}
};

CustomFilters.prototype._generateEmptyValueFilter = function() {
	this.And = true;
	this.CustomFilters = [];
	var customFilter = new CustomFilter();
	customFilter._generateEmptyValueFilter();
	this.CustomFilters.push(customFilter);
};

var g_oCustomFilter = {
	Operator	 : 0,
	Val	: 1
};

/** @constructor */
function CustomFilter(operator, val) {
	this.Properties = g_oCustomFilter;
	
	this.Operator = operator != undefined ? operator : null;
	this.Val = val != undefined ? val : null;
}
CustomFilter.prototype.getType = function() {
	return UndoRedoDataTypes.CustomFilter;
};
CustomFilter.prototype.getProperties = function() {
	return this.Properties;
};
CustomFilter.prototype.getProperty = function(nType) {
	switch (nType) {
		case this.Properties.Operator: return this.Operator; break;
		case this.Properties.Val: return this.Val; break;
	}
	return null;
};
CustomFilter.prototype.setProperty = function(nType, value) {
	switch (nType) {
		case this.Properties.Operator: this.Operator = value;break;
		case this.Properties.Val: this.Val = value;break;
	}
};

CustomFilter.prototype.clone = function() {
	var res = new CustomFilter();
	res.Operator = this.Operator;
	res.Val = this.Val;
	return res;
};
CustomFilter.prototype.init = function(operator, val) {
	this.Operator = operator;
	this.Val = val;
};
CustomFilter.prototype.isHideValue = function(val) {

	var result = false;
	var isDigitValue = !isNaN(val);
	if(!isDigitValue)
	{
		val = val.toLowerCase();
	}

	var checkComplexSymbols = null, filterVal;
	if(checkComplexSymbols != null)
	{
		result = checkComplexSymbols;
	}
	else
	{
		var isNumberFilter = this.Operator == c_oAscCustomAutoFilter.isGreaterThan || this.Operator == c_oAscCustomAutoFilter.isGreaterThanOrEqualTo || this.Operator == c_oAscCustomAutoFilter.isLessThan || this.Operator == c_oAscCustomAutoFilter.isLessThanOrEqualTo;
		
		if(c_oAscCustomAutoFilter.equals === this.Operator || c_oAscCustomAutoFilter.doesNotEqual === this.Operator)
		{
			filterVal = isNaN(this.Val) ? this.Val.toLowerCase() : this.Val;
		}
		else if(isNumberFilter)
		{
			if(isNaN(this.Val) && isNaN(val))
			{
				filterVal =  this.Val;
			}
			else
			{
				filterVal =  parseFloat(this.Val);
				val = parseFloat(val);
			}
		}
		else
		{
			filterVal = isNaN(this.Val) ? this.Val.toLowerCase() : this.Val;
		}

		var trimVal = "string" === typeof(val) ? window["Asc"].trim(val) : val;
		var trimFilterVal = "string" === typeof(filterVal) ? window["Asc"].trim(filterVal) : filterVal;

		switch (this.Operator)
		{
			case c_oAscCustomAutoFilter.equals://equals
			{
				if(trimVal === trimFilterVal)
				{
					result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.doesNotEqual://doesNotEqual
			{
				if(trimVal !== trimFilterVal)
				{
					result = true;
				}
					
				break;
			}
			
			case c_oAscCustomAutoFilter.isGreaterThan://isGreaterThan
			{
				if(val > filterVal)
				{
					result = true;
				}	
				
				break;
			}
			case c_oAscCustomAutoFilter.isGreaterThanOrEqualTo://isGreaterThanOrEqualTo
			{
				if(val >= filterVal)
				{
					result = true;
				}	
				
				break;
			}
			case c_oAscCustomAutoFilter.isLessThan://isLessThan
			{
				if(val < filterVal)
				{
					result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.isLessThanOrEqualTo://isLessThanOrEqualTo
			{
				if(val <= filterVal)
				{
					result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.beginsWith://beginsWith
			{
				if(!isDigitValue)
				{
					if(val.startsWith(filterVal))
						result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.doesNotBeginWith://doesNotBeginWith
			{
				if(!isDigitValue)
				{
					if(!val.startsWith(filterVal))
						result = true;
				}
				else
					result = true;
				
				break;
			}
			case c_oAscCustomAutoFilter.endsWith://endsWith
			{
				if(!isDigitValue)
				{
					if(val.endsWith(filterVal))
						result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.doesNotEndWith://doesNotEndWith
			{
				if(!isDigitValue)
				{
					if(!val.endsWith(filterVal))
						result = true;
				}
				else
					result = true;
				
				break;
			}
			case c_oAscCustomAutoFilter.contains://contains
			{
				if(!isDigitValue)
				{
					if(val.indexOf(filterVal) !== -1)
						result = true;
				}
				
				break;
			}
			case c_oAscCustomAutoFilter.doesNotContain://doesNotContain
			{
				if(!isDigitValue)
				{
					if(val.indexOf(filterVal) === -1)
						result = true;
				}
				else
					result = true;
				
				break;
			}
		}
	}	
	
	return !result;
};

CustomFilter.prototype.asc_getOperator = function () { return this.Operator; };
CustomFilter.prototype.asc_getVal = function () { return this.Val; };

CustomFilter.prototype.asc_setOperator = function (val) { this.Operator = val; };
CustomFilter.prototype.asc_setVal = function (val) { this.Val = val; };

CustomFilter.prototype.check = function () {
	if(c_oAscCustomAutoFilter.doesNotEqual === this.Operator) {
		if("" === this.Val.replace(/ /g, "")){
			this.Val = " ";
		}
	}
};

CustomFilter.prototype._generateEmptyValueFilter = function () {
	this.Operator = c_oAscCustomAutoFilter.doesNotEqual;
	this.Val = " ";
};

var g_oDynamicFilter = {
	Type : 0,
	Val	: 1,
	MaxVal: 2
};

/** @constructor */
function DynamicFilter() {
	this.Properties = g_oDynamicFilter;
	
	this.Type = null;
	this.Val = null;
	this.MaxVal = null;
}
DynamicFilter.prototype.getType = function() {
	return UndoRedoDataTypes.DynamicFilter;
};
DynamicFilter.prototype.getProperties = function() {
	return this.Properties;
};
DynamicFilter.prototype.getProperty = function(nType) {
	switch (nType) {
		case this.Properties.Type: return this.Type; break;
		case this.Properties.Val: return this.Val; break;
		case this.Properties.MaxVal: return this.MaxVal; break;
	}
	return null;
};
DynamicFilter.prototype.setProperty = function(nType, value) {
	switch (nType) {
		case this.Properties.Type: this.Type = value;break;
		case this.Properties.Val: this.Val = value;break;
		case this.Properties.MaxVal: this.MaxVal = value;break;
	}
};
DynamicFilter.prototype.clone = function() {
	var res = new DynamicFilter();
	res.Type = this.Type;
	res.Val = this.Val;
	res.MaxVal = this.MaxVal;
	return res;
};

DynamicFilter.prototype.init = function(range) {
	var res = null;
	
	switch(this.Type)
	{
		case Asc.c_oAscDynamicAutoFilter.aboveAverage:
		case Asc.c_oAscDynamicAutoFilter.belowAverage:
		{
			var summ = 0;
			var counter = 0;
			
			range._foreachNoEmpty(function(cell){
				var val = parseFloat(cell.getValueWithoutFormat());
				
				if(!isNaN(val))
				{
					summ += parseFloat(val);
					counter++;
				}
				
			});
			res = summ / counter;
			
			break;
		}
	}
	
	this.Val = res;
};

DynamicFilter.prototype.isHideValue = function(val) {
	var res = false;
	
	switch(this.Type)
	{
		case Asc.c_oAscDynamicAutoFilter.aboveAverage:
		{
			res = val > this.Val ? false : true;
			break;
		}
		case Asc.c_oAscDynamicAutoFilter.belowAverage:
		{
			res = val < this.Val ? false : true;
			break;
		}
	}
	
	return res;
};

DynamicFilter.prototype.asc_getType = function () { return this.Type; };
DynamicFilter.prototype.asc_getVal = function () { return this.Val; };
DynamicFilter.prototype.asc_getMaxVal = function () { return this.MaxVal; };

DynamicFilter.prototype.asc_setType = function (val) { this.Type = val; };
DynamicFilter.prototype.asc_setVal = function (val) { this.Val = val; };
DynamicFilter.prototype.asc_setMaxVal = function (val) { this.MaxVal = val; };

var g_oColorFilter = {
	CellColor : 0,
	dxf	: 1
};

/** @constructor */
function ColorFilter() {
	this.Properties = g_oColorFilter;
	
	this.CellColor = null;
	this.dxf = null;
}
ColorFilter.prototype.getType = function() {
	return UndoRedoDataTypes.ColorFilter;
};
ColorFilter.prototype.getProperties = function() {
	return this.Properties;
};
ColorFilter.prototype.getProperty = function(nType) {
	switch (nType) {
		case this.Properties.CellColor: return this.CellColor; break;
		case this.Properties.dxf: return this.dxf; break;
	}
	return null;
};
ColorFilter.prototype.setProperty = function(nType, value) {
	switch (nType) {
		case this.Properties.CellColor: this.CellColor = value;break;
		case this.Properties.dxf: this.dxf = value;break;
	}
};
ColorFilter.prototype.clone = function() {
	var res = new ColorFilter();
	res.CellColor = this.CellColor;
	if (this.dxf) {
		res.dxf = this.dxf.clone();
	}
	return res;
};
ColorFilter.prototype.isHideValue = function(cell) {
	
	var res = true;
	var t = this;
	
	var isEqualColors = function(filterColor, cellColor)
	{
		var res = false;
		if(filterColor === cellColor)
		{
			res = true;
		}
		else if(!filterColor && (!cellColor || null === cellColor.rgb || 0 === cellColor.rgb))
		{
			res = true;
		}
		else if(!cellColor && (!filterColor || null === filterColor.rgb || 0 === filterColor.rgb))
		{
			res = true;
		}
		else if(cellColor && filterColor && cellColor.rgb === filterColor.rgb)
		{
			res = true;
		}
		
		return res;
	};
	
	if(this.dxf && this.dxf.fill && cell)
	{
		var filterColor = this.dxf.fill.bg;
		cell.getLeftTopCellNoEmpty(function(cell) {
			if(false === t.CellColor)//font color
			{
				var multiText;
				if(cell && (multiText = cell.getValueMultiText()) !== null)
				{
					for(var j = 0; j < multiText.length; j++)
					{
						var fontColor = multiText[j].format ? multiText[j].format.getColor() : null;
						if(isEqualColors(filterColor,fontColor ))
						{
							res = false;
							break;
						}
					}
				}
				else
				{
					var fontColor = cell && cell.xfs && cell.xfs.font ? cell.xfs.font.getColor() : null;
					if(isEqualColors(filterColor,fontColor))
					{
						res = false;
					}
				}
			}
			else
			{
				var color = cell ? cell.getStyle() : null;
				var cellColor =  color !== null && color.fill && color.fill.bg ? color.fill.bg : null;

				if(isEqualColors(filterColor, cellColor))
				{
					res = false;
				}
			}
		});
	}
	
	return res;
};

ColorFilter.prototype.asc_getCellColor = function () { return this.CellColor; };
ColorFilter.prototype.asc_getDxf = function () { return this.dxf; };

ColorFilter.prototype.asc_setCellColor = function (val) { this.CellColor = val; };
ColorFilter.prototype.asc_setDxf = function (val) { this.dxf = val; };
ColorFilter.prototype.asc_getCColor = function ()
{ 
	var res = null;
	
	if(this.dxf && this.dxf.fill && null !== this.dxf.fill.bg && null !== this.dxf.fill.bg.rgb)
	{
		var color = this.dxf.fill.bg;
		
		var res = new Asc.asc_CColor();
		res.asc_putR(color.getR());
		res.asc_putG(color.getG());
		res.asc_putB(color.getB());
		res.asc_putA(color.getA());
	}
	
	return res;
};
ColorFilter.prototype.asc_setCColor = function (asc_CColor) 
{
	if(!this.dxf)
	{
		this.dxf = new CellXfs();
	}
	
	if(!this.dxf.bg)
	{
		this.dxf.fill = new Fill();
	}
	
	if(null === asc_CColor)
	{
		this.dxf.fill.bg = new RgbColor();
		this.dxf.fill.bg.rgb = null;
	}
	else
	{
		this.dxf.fill.bg = new RgbColor((asc_CColor.asc_getR() << 16) + (asc_CColor.asc_getG() << 8) + asc_CColor.asc_getB());
	}
};

var g_oTop10 = {
	FilterVal : 0,
	Percent	: 1,
	Top: 2,
	Val: 3
};

/** @constructor */
function Top10() {
	this.Properties = g_oTop10;
	
	this.FilterVal = null;
	this.Percent = null;
	this.Top = null;
	this.Val = null;
}
Top10.prototype.getType = function() {
	return UndoRedoDataTypes.Top10;
};
Top10.prototype.getProperties = function() {
	return this.Properties;
};
Top10.prototype.getProperty = function(nType) {
	switch (nType) {
		case this.Properties.FilterVal: return this.FilterVal; break;
		case this.Properties.Percent: return this.Percent; break;
		case this.Properties.Top: return this.Top; break;
		case this.Properties.Val: return this.Val; break;
	}
	return null;
};
Top10.prototype.setProperty = function(nType, value) {
	switch (nType) {
		case this.Properties.FilterVal: this.FilterVal = value;break;
		case this.Properties.Percent: this.Percent = value;break;
		case this.Properties.Top: this.Top = value;break;
		case this.Properties.Val: this.Val = value;break;
	}
};
Top10.prototype.clone = function() {
	var res = new Top10();
	res.FilterVal = this.FilterVal;
	res.Percent = this.Percent;
	res.Top = this.Top;
	res.Val = this.Val;
	return res;
};
Top10.prototype.isHideValue = function(val) {
	// ToDo работает не совсем правильно.
	var res = false;
	
	if(null !== this.FilterVal)
	{
		if(this.Top)
		{
			if(val < this.FilterVal)
			{
				res = true;
			}
		}
		else
		{
			if(val > this.FilterVal)
			{
				res = true;
			}
		}
	}
	
	return res;
};

Top10.prototype.init = function(range, reWrite){
	var res = null;
	var t = this;
	
	if(null === this.FilterVal || true === reWrite)
	{	
		if(range)
		{
			var arr = [];
			var alreadyAddValues = {};
			var count = 0;
			range._setPropertyNoEmpty(null, null, function(cell){
				var val = parseFloat(cell.getValueWithoutFormat());
				
				if(!isNaN(val) && !alreadyAddValues[val])
				{
					arr.push(val);
					alreadyAddValues[val] = 1;
					count++;
				}
			});
			
			if(arr.length)
			{
				arr.sort(function(a, b){
					var res;
					if(t.Top)
					{
						res = b - a;
					}
					else
					{
						res = a - b;
					}
					
					return res; 
				});
				
				if(this.Percent)
				{
					var num = parseInt(count * (this.Val / 100));
					if(0 === num)
					{
						num = 1;
					}
					
					res = arr[num - 1];
				}
				else
				{
					res = arr[this.Val - 1];
				}
				
			}
		}
	}
	
	if(null !== res)
	{
		this.FilterVal = res;
	}
}; 

Top10.prototype.asc_getFilterVal = function () { return this.FilterVal; };
Top10.prototype.asc_getPercent = function () { return this.Percent; };
Top10.prototype.asc_getTop = function () { return this.Top; };
Top10.prototype.asc_getVal = function () { return this.Val; };

Top10.prototype.asc_setFilterVal = function (val) { this.FilterVal = val; };
Top10.prototype.asc_setPercent = function (val) { this.Percent = val; };
Top10.prototype.asc_setTop = function (val) { this.Top = val; };
Top10.prototype.asc_setVal = function (val) { this.Val = val; };

/** @constructor */
function SortCondition() {
	this.Ref = null;
	this.ConditionSortBy = null;
	this.ConditionDescending = null;
	this.dxf = null;
}
SortCondition.prototype.clone = function() {
	var res = new SortCondition();
	res.Ref = this.Ref ? this.Ref.clone() : null;
	res.ConditionSortBy = this.ConditionSortBy;
	res.ConditionDescending = this.ConditionDescending;
	if (this.dxf)
		res.dxf = this.dxf.clone();
	return res;
};
SortCondition.prototype.moveRef = function(col, row) {
	var ref = this.Ref.clone();
	ref.setOffset({offsetCol: col ? col : 0, offsetRow: row ? row : 0});
	
	this.Ref = ref;
};
SortCondition.prototype.changeColumns = function(activeRange, isDelete) {
	var bIsDeleteCurSortCondition = false;
	var ref = this.Ref.clone();
	var offsetCol = null;
	
	if(isDelete)
	{
		if(activeRange.c1 <= ref.c1 && activeRange.c2 >= ref.c1)
		{
			bIsDeleteCurSortCondition = true;
		}
		else if(activeRange.c1 < ref.c1)
		{
			offsetCol = -(activeRange.c2 - activeRange.c1 + 1);
		}
	}
	else
	{
		if(activeRange.c1 <= ref.c1)
		{
			offsetCol = activeRange.c2 - activeRange.c1 + 1;
		}
	}
	
	if(null !== offsetCol)
	{
		ref.setOffset({offsetCol: offsetCol, offsetRow: 0});
		this.Ref = ref;
	}
	
	return bIsDeleteCurSortCondition;
};

SortCondition.prototype.getSortType = function() {
	var res = null;

	if(true === this.ConditionDescending) {
		res = Asc.c_oAscSortOptions.Ascending;
	} else if(false === this.ConditionDescending) {
		res = Asc.c_oAscSortOptions.Descending;
	} else if(Asc.ESortBy.sortbyCellColor === this.ConditionSortBy) {
		res = Asc.c_oAscSortOptions.ByColorFill;
	} else if(Asc.ESortBy.sortbyCellColor === this.sortbyFontColor) {
		res = Asc.c_oAscSortOptions.ByColorFont;
	}

	return res;
};

SortCondition.prototype.getSortColor = function() {
	var res = null;

	if(this.dxf) {
		if(this.dxf.fill && this.dxf.fill.bg) {
			res = this.dxf.fill.bg;
		} else if(this.dxf.font && this.dxf.font.c) {
			res = this.dxf.font.c;
		}
	}

	return res;
};

SortCondition.prototype.applySort = function(type, ref, color) {
	this.Ref = ref;

	if(type === Asc.c_oAscSortOptions.ByColorFill || type === Asc.c_oAscSortOptions.ByColorFont) {
		var newDxf;
		if (type === Asc.c_oAscSortOptions.ByColorFill) {
			newDxf = new AscCommonExcel.CellXfs();
			newDxf.fill = new AscCommonExcel.Fill();
			newDxf.fill.bg = color;
			this.ConditionSortBy = Asc.ESortBy.sortbyCellColor;
		} else {
			newDxf.font = new AscCommonExcel.Font();
			newDxf.font.setColor(color);
			this.ConditionSortBy = Asc.ESortBy.sortbyFontColor;
		}

		this.dxf = AscCommonExcel.g_StyleCache.addXf(newDxf, true);
	} else if(type === Asc.c_oAscSortOptions.Ascending || type === Asc.c_oAscSortOptions.Descending) {
		this.ConditionDescending = type !== Asc.c_oAscSortOptions.Ascending;
	}

};

function AutoFilterDateElem(start, end, dateTimeGrouping) {
	this.start = start;
	this.end = end;
	this.dateTimeGrouping = dateTimeGrouping;
} 
AutoFilterDateElem.prototype.clone = function() {
	var res = new AutoFilterDateElem();
	res.start = this.start;
	this.end = this.end;
	this.dateTimeGrouping = this.dateTimeGrouping;
	
	return res;
};
AutoFilterDateElem.prototype.convertDateGroupItemToRange = function(oDateGroupItem) {
	var startDate, endDate, date;
	switch(oDateGroupItem.DateTimeGrouping)
	{
		case 1://day
		{
			date = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day));
			startDate = date.getExcelDateWithTime();
			date.addDays(1)
			endDate = date.getExcelDateWithTime();
			break;
		}
		case 2://hour
		{
			startDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, 1)).getExcelDateWithTime();
			endDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, 59)).getExcelDateWithTime();
			break;
		}
		case 3://minute
		{
			startDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, oDateGroupItem.Minute, 1)).getExcelDateWithTime();
			endDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, oDateGroupItem.Minute, 59)).getExcelDateWithTime();
			break;
		}
		case 4://month
		{
			date = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, 1));
			startDate = date.getExcelDateWithTime();
			date.addMonths(1)
			endDate = date.getExcelDateWithTime();
			break;
		}
		case 5://second
		{
			startDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, oDateGroupItem.Second)).getExcelDateWithTime();
			endDate = new Date(Date.UTC( oDateGroupItem.Year, oDateGroupItem.Month - 1, oDateGroupItem.Day, oDateGroupItem.Hour, oDateGroupItem.Second )).getExcelDateWithTime();
			break;
		}
		case 6://year
		{
			date = new Date(Date.UTC( oDateGroupItem.Year, 0));
			startDate = date.getExcelDateWithTime();
			date.addYears(1)
			endDate = date.getExcelDateWithTime();
			break;
		}
	}
	
	this.start = startDate;
	this.end = endDate;
	this.dateTimeGrouping = oDateGroupItem.DateTimeGrouping;
};

	if (typeof Map === 'undefined') {
		(function() {
			var Map = function() {
				this.storage = {};
			};
			Map.prototype = {
				set: function(key, value) {
					this.storage[key] = value;
				},
				get: function(key) {
					return this.storage[key];
				},
				delete: function(key) {
					delete this.storage[key];
				},
				has: function(key) {
					return !!this.storage[key];
				}
			};

			window.Map = Map;
		})();
	}
	/**
	 * @constructor
	 * @memberOf AscCommonExcel
	 */
	function CSharedStrings () {
		this.all = [];
		this.text = new Map();
		//
		this.multiText = [];
		this.multiTextIndex = [];
	}

	CSharedStrings.prototype.addText = function(text) {
		var index = this.text.get(text);
		if (undefined === index) {
			this.all.push(text);
			index = this.all.length;
			this.text.set(text, index);
			if (AscFonts.IsCheckSymbols) {
				AscFonts.FontPickerByCharacter.getFontsByString(text);
			}
		}
		return index;
	};
	CSharedStrings.prototype.addMultiText = function(multiText) {
		var index, i;
		for (i = 0; i < this.multiText.length; ++i) {
			if (AscCommonExcel.isEqualMultiText(multiText, this.multiText[i])) {
				index = this.multiTextIndex[i];
				break;
			}
		}
		if (undefined === index) {
			this.all.push(multiText);
			index = this.all.length;
			this.multiText.push(multiText);
			this.multiTextIndex.push(index);
			if (AscFonts.IsCheckSymbols) {
				for (i = 0; i < multiText.length; ++i) {
					AscFonts.FontPickerByCharacter.getFontsByString(multiText[i].text);
				}
			}
		}
		return index;
	};
	CSharedStrings.prototype.get = function(index) {
		return 1 <= index && index <= this.all.length ? this.all[index - 1] : null;
	};
	CSharedStrings.prototype.getCount = function() {
		return this.all.length;
	};
	CSharedStrings.prototype.generateFontMap = function(oFontMap) {
		for (var i = 0; i < this.multiText.length; ++i) {
			var multiText = this.multiText[i];
			for (var j = 0; j < multiText.length; ++j) {
				var part = multiText[j];
				if (null != part.format) {
					oFontMap[part.format.getName()] = 1;
				}
			}
		}
	};

	/**
	 * @constructor
	 * @memberOf AscCommonExcel
	 */
	function CWorkbookFormulas () {
		this.all = [];
	}

	CWorkbookFormulas.prototype.add = function(formula) {
		var index = formula.getIndexNumber();
		if (undefined === index) {
			this.all.push(formula);
			index = this.all.length;
			formula.setIndexNumber(index);
		}
		return formula;
	};
	CWorkbookFormulas.prototype.get = function(index) {
		return 1 <= index && index <= this.all.length ? this.all[index - 1] : null;
	};
	CWorkbookFormulas.prototype.getCount = function() {
		return this.all.length;
	};

	//----------------------------------------------------------export----------------------------------------------------
	var prot;
	window['Asc'] = window['Asc'] || {};
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].g_oColorManager = g_oColorManager;
	window['AscCommonExcel'].g_oDefaultFormat = g_oDefaultFormat;
	window['AscCommonExcel'].g_nColorTextDefault = g_nColorTextDefault;
	window['AscCommonExcel'].g_nColorHyperlink = g_nColorHyperlink;
	window['AscCommonExcel'].g_oThemeColorsDefaultModsSpreadsheet = g_oThemeColorsDefaultModsSpreadsheet;
	window['AscCommonExcel'].g_StyleCache = g_StyleCache;
	window['AscCommonExcel'].map_themeExcel_to_themePresentation = map_themeExcel_to_themePresentation;
	window['AscCommonExcel'].g_nRowStructSize = g_nRowStructSize;
	window['AscCommonExcel'].shiftGetBBox = shiftGetBBox;
	window['AscCommonExcel'].getStringFromMultiText = getStringFromMultiText;
	window['AscCommonExcel'].isEqualMultiText = isEqualMultiText;
	window['AscCommonExcel'].RgbColor = RgbColor;
	window['AscCommonExcel'].createRgbColor = createRgbColor;
	window['AscCommonExcel'].ThemeColor = ThemeColor;
	window['AscCommonExcel'].CorrectAscColor = CorrectAscColor;
	window['AscCommonExcel'].Fragment = Fragment;
	window['AscCommonExcel'].Font = Font;
	window['AscCommonExcel'].Fill = Fill;
	window['AscCommonExcel'].BorderProp = BorderProp;
	window['AscCommonExcel'].Border = Border;
	window['AscCommonExcel'].Num = Num;
	window['AscCommonExcel'].CellXfs = CellXfs;
	window['AscCommonExcel'].Align = Align;
	window['AscCommonExcel'].CCellStyles = CCellStyles;
	window['AscCommonExcel'].CCellStyle = CCellStyle;
	window['AscCommonExcel'].StyleManager = StyleManager;
	window['AscCommonExcel'].SheetMergedStyles = SheetMergedStyles;
	window['AscCommonExcel'].Hyperlink = Hyperlink;
	window['AscCommonExcel'].SheetFormatPr = SheetFormatPr;
	window['AscCommonExcel'].Col = Col;
	window['AscCommonExcel'].Row = Row;
	window['AscCommonExcel'].CMultiTextElem = CMultiTextElem;
	window['AscCommonExcel'].CCellValue = CCellValue;
	window['AscCommonExcel'].RangeDataManagerElem = RangeDataManagerElem;
	window['AscCommonExcel'].RangeDataManager = RangeDataManager;
	window['AscCommonExcel'].CSharedStrings = CSharedStrings;
	window['AscCommonExcel'].CWorkbookFormulas = CWorkbookFormulas;
	window["Asc"]["sparklineGroup"] = window['AscCommonExcel'].sparklineGroup = sparklineGroup;
	prot = sparklineGroup.prototype;
	prot["asc_getId"] = prot.asc_getId;
	prot["asc_getType"] = prot.asc_getType;
	prot["asc_getLineWeight"] = prot.asc_getLineWeight;
	prot["asc_getDisplayEmpty"] = prot.asc_getDisplayEmpty;
	prot["asc_getMarkersPoint"] = prot.asc_getMarkersPoint;
	prot["asc_getHighPoint"] = prot.asc_getHighPoint;
	prot["asc_getLowPoint"] = prot.asc_getLowPoint;
	prot["asc_getFirstPoint"] = prot.asc_getFirstPoint;
	prot["asc_getLastPoint"] = prot.asc_getLastPoint;
	prot["asc_getNegativePoint"] = prot.asc_getNegativePoint;
	prot["asc_getDisplayXAxis"] = prot.asc_getDisplayXAxis;
	prot["asc_getDisplayHidden"] = prot.asc_getDisplayHidden;
	prot["asc_getMinAxisType"] = prot.asc_getMinAxisType;
	prot["asc_getMaxAxisType"] = prot.asc_getMaxAxisType;
	prot["asc_getRightToLeft"] = prot.asc_getRightToLeft;
	prot["asc_getManualMax"] = prot.asc_getManualMax;
	prot["asc_getManualMin"] = prot.asc_getManualMin;
	prot["asc_getColorSeries"] = prot.asc_getColorSeries;
	prot["asc_getColorNegative"] = prot.asc_getColorNegative;
	prot["asc_getColorAxis"] = prot.asc_getColorAxis;
	prot["asc_getColorMarkers"] = prot.asc_getColorMarkers;
	prot["asc_getColorFirst"] = prot.asc_getColorFirst;
	prot["asc_getColorLast"] = prot.asc_getColorLast;
	prot["asc_getColorHigh"] = prot.asc_getColorHigh;
	prot["asc_getColorLow"] = prot.asc_getColorLow;
	prot["asc_getDataRanges"] = prot.asc_getDataRanges;
	prot["asc_setType"] = prot.asc_setType;
	prot["asc_setLineWeight"] = prot.asc_setLineWeight;
	prot["asc_setDisplayEmpty"] = prot.asc_setDisplayEmpty;
	prot["asc_setMarkersPoint"] = prot.asc_setMarkersPoint;
	prot["asc_setHighPoint"] = prot.asc_setHighPoint;
	prot["asc_setLowPoint"] = prot.asc_setLowPoint;
	prot["asc_setFirstPoint"] = prot.asc_setFirstPoint;
	prot["asc_setLastPoint"] = prot.asc_setLastPoint;
	prot["asc_setNegativePoint"] = prot.asc_setNegativePoint;
	prot["asc_setDisplayXAxis"] = prot.asc_setDisplayXAxis;
	prot["asc_setDisplayHidden"] = prot.asc_setDisplayHidden;
	prot["asc_setMinAxisType"] = prot.asc_setMinAxisType;
	prot["asc_setMaxAxisType"] = prot.asc_setMaxAxisType;
	prot["asc_setRightToLeft"] = prot.asc_setRightToLeft;
	prot["asc_setManualMax"] = prot.asc_setManualMax;
	prot["asc_setManualMin"] = prot.asc_setManualMin;
	prot["asc_setColorSeries"] = prot.asc_setColorSeries;
	prot["asc_setColorNegative"] = prot.asc_setColorNegative;
	prot["asc_setColorAxis"] = prot.asc_setColorAxis;
	prot["asc_setColorMarkers"] = prot.asc_setColorMarkers;
	prot["asc_setColorFirst"] = prot.asc_setColorFirst;
	prot["asc_setColorLast"] = prot.asc_setColorLast;
	prot["asc_setColorHigh"] = prot.asc_setColorHigh;
	prot["asc_setColorLow"] = prot.asc_setColorLow;
	prot["asc_getStyles"] = prot.asc_getStyles;
	prot["asc_setStyle"] = prot.asc_setStyle;
	window['AscCommonExcel'].sparkline = sparkline;
	window['AscCommonExcel'].TablePart = TablePart;
	window['AscCommonExcel'].AutoFilter = AutoFilter;
	window['AscCommonExcel'].SortState = SortState;
	window['AscCommonExcel'].TableColumn = TableColumn;
	window['AscCommonExcel'].TableStyleInfo = TableStyleInfo;
	window['AscCommonExcel'].FilterColumn = FilterColumn;
	window['AscCommonExcel'].Filters = Filters;
	window['AscCommonExcel'].Filter = Filter;
	window['AscCommonExcel'].DateGroupItem = DateGroupItem;
	window['AscCommonExcel'].SortCondition = SortCondition;
	window['AscCommonExcel'].AutoFilterDateElem = AutoFilterDateElem;

window["Asc"]["CustomFilters"]			= window["Asc"].CustomFilters = CustomFilters;
prot									= CustomFilters.prototype;
prot["asc_getAnd"]						= prot.asc_getAnd;
prot["asc_getCustomFilters"]			= prot.asc_getCustomFilters;
prot["asc_setAnd"]						= prot.asc_setAnd;
prot["asc_setCustomFilters"]			= prot.asc_setCustomFilters;

window["Asc"]["CustomFilter"]			= window["Asc"].CustomFilter = CustomFilter;
prot									= CustomFilter.prototype;
prot["asc_getOperator"]					= prot.asc_getOperator;
prot["asc_getVal"]						= prot.asc_getVal;
prot["asc_setOperator"]					= prot.asc_setOperator;
prot["asc_setVal"]						= prot.asc_setVal;

window["Asc"]["DynamicFilter"]			= window["Asc"].DynamicFilter = DynamicFilter;
prot									= DynamicFilter.prototype;
prot["asc_getType"]						= prot.asc_getType;
prot["asc_getVal"]						= prot.asc_getVal;
prot["asc_getMaxVal"]					= prot.asc_getMaxVal;
prot["asc_setType"]						= prot.asc_setType;
prot["asc_setVal"]						= prot.asc_setVal;
prot["asc_setMaxVal"]					= prot.asc_setMaxVal;

window["Asc"]["ColorFilter"]			= window["Asc"].ColorFilter = ColorFilter;
prot									= ColorFilter.prototype;
prot["asc_getCellColor"]				= prot.asc_getCellColor;
prot["asc_getCColor"]					= prot.asc_getCColor;
prot["asc_getDxf"]						= prot.asc_getDxf;
prot["asc_setCellColor"]				= prot.asc_setCellColor;
prot["asc_setDxf"]						= prot.asc_setDxf;
prot["asc_setCColor"]					= prot.asc_setCColor;

window["Asc"]["Top10"]					= window["Asc"].Top10 = Top10;
prot									= Top10.prototype;
prot["asc_getFilterVal"]				= prot.asc_getFilterVal;
prot["asc_getPercent"]					= prot.asc_getPercent;
prot["asc_getTop"]						= prot.asc_getTop;
prot["asc_getVal"]						= prot.asc_getVal;
prot["asc_setFilterVal"]				= prot.asc_setFilterVal;
prot["asc_setPercent"]					= prot.asc_setPercent;
prot["asc_setTop"]						= prot.asc_setTop;
prot["asc_setVal"]						= prot.asc_setVal;

window["Asc"]["TreeRBNode"]			= window["Asc"].TreeRBNode = TreeRBNode;
window["Asc"]["TreeRB"]			= window["Asc"].TreeRB = TreeRB;
prot									= TreeRB.prototype;
prot["insertOrGet"]						= prot.insertOrGet;
prot["deleteNode"]			= prot.deleteNode;
prot["enumerate"]						= prot.enumerate;
prot["getElem"]			= prot.getElem;
prot["getNodeAll"]			= prot.getNodeAll;
prot["isEmpty"]			= prot.getNodeAll;
})(window);
