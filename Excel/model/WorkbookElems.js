var g_nNumsMaxId = 160;
var g_oDefaultXfId = null;
var g_oDefaultFont = null;
var g_oDefaultFill = null;
var g_oDefaultNum = null;
var g_oDefaultBorder = null;
var g_oDefaultAlign = null;
var g_oDefaultFontAbs = null;
var g_oDefaultFillAbs = null;
var g_oDefaultNumAbs = null;
var g_oDefaultBorderAbs = null;
var g_oDefaultAlignAbs = null;

var g_nColorTextDefault = 1;
var g_nColorHyperlink = 10;
var g_nColorHyperlinkVisited = 11;

var g_oThemeColorTint = [[0, -4.9989318521683403E-2, -0.14999847407452621, -0.249977111117893, -0.34998626667073579, -0.499984740745262],
						[0, 0.499984740745262, 0.34998626667073579, 0.249977111117893, 0.14999847407452621, 4.9989318521683403E-2],
						[0, -9.9978637043366805E-2, -0.249977111117893, -0.499984740745262, -0.749992370372631, -0.89999084444715716],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262],
						[0, 0.79998168889431442, 0.59999389629810485, 0.39997558519241921, -0.249977111117893, -0.499984740745262]];
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
}
var map_themePresentation_to_themeExcel = new Object();
for(var i in map_themeExcel_to_themePresentation)
	map_themePresentation_to_themeExcel[map_themeExcel_to_themePresentation[i]] = i - 0;
function RgbColor(rgb)
{
	this.Properties = {
		rgb : 0
	}
	this.rgb = rgb;
}
RgbColor.prototype =
{
	getType : function()
	{
		return UndoRedoDataTypes.RgbColor;
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
	}
}
function ThemeColor()
{
	this.Properties = {
		rgb: 0,
		theme: 1,
		tint: 2
	}
	this.rgb = null;
	this.theme = null;
	this.tint = null;
}
ThemeColor.prototype =
{
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
				var oCColorModifiers = new CColorModifiers();
				var HSL = {H: 0, S: 0, L: 0};
				oCColorModifiers.RGB2HSL(r, g, b, HSL);
				var L = HSL.L / g_nHSLMaxValue;
				if (this.tint < 0)
					L = L * (1 + this.tint);
				else
					L = L * (1 - this.tint) + (1 - 1 * (1 - this.tint));
				HSL.L = Asc.floor(L * g_nHSLMaxValue);
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
}
function CorrectAscColor(asc_color)
{
	if (null == asc_color)
		return null;

	var ret = null;

	var _type = asc_color.get_type();
	switch (_type)
	{
		case c_oAscColor.COLOR_TYPE_SCHEME:
		{
			// тут выставляется ТОЛЬКО из меню. поэтому:
			var _index = parseInt(asc_color.get_value());
			var _id = (_index / 6) >> 0;
			var _pos = _index - _id * 6
			var tint = g_oThemeColorTint[_id][_pos];
			ret = g_oColorManager.getThemeColor(_id, tint);
			break;
		}
		default:
		{
			ret = new RgbColor((asc_color.get_r() << 16) + (asc_color.get_g() << 8) + asc_color.get_b());
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
			oColorObj = new Object();
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
}
g_oColorManager = new ColorManager();

/** @constructor */
function Font(val)
{
	if(null == val)
	{
		val = {
			fn : "Calibri",
			scheme : EFontScheme.fontschemeMinor,
			fs : 11,
			b : false,
			i : false,
			u : "none",
			s : false,
			c : g_oColorManager.getThemeColor(g_nColorTextDefault),
			va : "baseline",
			skip : false,
			repeat : false
		};
	}
	this.Properties = {
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
	this.fn = val.fn;
	this.scheme = val.scheme;
	this.fs = val.fs;
	this.b = val.b;
	this.i = val.i;
	this.u = val.u;
	this.s = val.s;
	this.c = val.c;
	this.va = val.va
    //skip и repeat не сохраняются в файл нужны здесь только чтобы класс Font можно было использовать в комплексных строках
    this.skip = val.skip;
    this.repeat = val.repeat;
};
Font.prototype =
{
	_mergeProperty : function(first, second, def)
	{
		if(def != first)
			return first;
		else
			return second;
	},
	merge : function(font)
	{
		var oRes = new Font();
		oRes.fn = this._mergeProperty(this.fn, font.fn, g_oDefaultFont.fn);
		oRes.fs = this._mergeProperty(this.fs, font.fs, g_oDefaultFont.fs);
		oRes.b = this._mergeProperty(this.b, font.b, g_oDefaultFont.b);
		oRes.i = this._mergeProperty(this.i, font.i, g_oDefaultFont.i);
		oRes.u = this._mergeProperty(this.u, font.u, g_oDefaultFont.u);
		oRes.s = this._mergeProperty(this.s, font.s, g_oDefaultFont.s);
		//заглушка excel при merge стилей игнорирует default цвет
		if(this.c instanceof ThemeColor && g_nColorTextDefault == this.c.theme && null == this.c.tint)
			oRes.c = this._mergeProperty(font.c, this.c, g_oDefaultFont.c);
		else
			oRes.c = this._mergeProperty(this.c, font.c, g_oDefaultFont.c);
		oRes.themeColor = this._mergeProperty(this.themeColor, font.themeColor, g_oDefaultFont.themeColor);
		oRes.themeTint = this._mergeProperty(this.themeTint, font.themeTint, g_oDefaultFont.themeTint);
		oRes.va = this._mergeProperty(this.va, font.va, g_oDefaultFont.va);
		oRes.skip = this._mergeProperty(this.skip, font.skip, g_oDefaultFont.skip);
		oRes.repeat = this._mergeProperty(this.repeat, font.repeat, g_oDefaultFont.repeat);
		return oRes;
	},
	getRgbOrNull : function()
	{
		var nRes = null;
		if(null != this.c)
			nRes = this.c.getRgb();
		return nRes;
	},
	getDif : function(val)
	{
		var oRes = new Font(this);
		var bEmpty = true;
		if(this.fn == val.fn)
			oRes.fn =  null;
		else
			bEmpty = false;
		if(this.scheme == val.scheme)
			oRes.scheme =  null;
		else
			bEmpty = false;
		if(this.fs == val.fs)
			oRes.fs =  null;
		else
			bEmpty = false;
		if(this.b == val.b)
			oRes.b =  null;
		else
			bEmpty = false;
		if(this.i == val.i)
			oRes.i =  null;
		else
			bEmpty = false;
		if(this.u == val.u)
			oRes.u =  null;
		else
			bEmpty = false;
		if(this.s == val.s)
			oRes.s =  null;
		else
			bEmpty = false;
		if(g_oColorManager.isEqual(this.c, val.c))
			oRes.c =  null;
		else
			bEmpty = false;
		if(this.va == val.va)
			oRes.va =  null;
		else
			bEmpty = false;
		if(this.skip == val.skip)
			oRes.skip =  null;
		else
			bEmpty = false;
		if(this.repeat == val.repeat)
			oRes.repeat =  null;
		else
			bEmpty = false;
		if(bEmpty)
			oRes = null;
		return oRes;
	},
	isEqual : function(font)
	{
		var bRes = this.fs == font.fs && this.b == font.b && this.i == font.i && this.u == font.u && this.s == font.s &&
				g_oColorManager.isEqual(this.c, font.c) && this.va == font.va && this.skip == font.skip && this.repeat == font.repeat;
		if(bRes)
		{
			if(null == this.scheme && null == font.scheme)
				bRes = this.fn == font.fn;
			else if(null != this.scheme && null != font.scheme)
				bRes = this.scheme == font.scheme;
			else
				bRes = false;
		}
		return bRes;
	},
    clone : function()
    {
		return new Font(this);
    },
	set : function(oVal)
	{
        if(null != oVal.fn)
            this.fn = oVal.fn;
		if(null != oVal.scheme)
            this.scheme = oVal.scheme;
        if(null != oVal.fs)
            this.fs = oVal.fs;
        if(null != oVal.b)
            this.b = oVal.b;
        if(null != oVal.i)
            this.i = oVal.i;
        if(null != oVal.u)
            this.u = oVal.u;
        if(null != oVal.s)
            this.s = oVal.s;
        if(null != oVal.c)
            this.c = oVal.c;
		if(null != oVal.va)
            this.va = oVal.va;
        if(null != oVal.skip)
            this.skip = oVal.skip;
		if(null != oVal.repeat)
            this.repeat = oVal.repeat;
	},
	intersect : function(oFont, oDefVal)
	{
		if(this.fn != oFont.fn)
            this.fn = g_oDefaultFont.fn;
		if(this.scheme != oFont.scheme)
            this.scheme = g_oDefaultFont.scheme;
        if(this.fs != oFont.fs)
            this.fs = g_oDefaultFont.fs;
		if(this.b != oFont.b)
            this.b = g_oDefaultFont.b;
		if(this.i != oFont.i)
            this.i = g_oDefaultFont.i;
		if(this.u != oFont.u)
            this.u = g_oDefaultFont.u;
		if(this.s != oFont.s)
            this.s = g_oDefaultFont.s;
		if(false == g_oColorManager.isEqual(this.c, oFont.c))
            this.c = g_oDefaultFont.c;
		if(this.va != oFont.va)
            this.va = g_oDefaultFont.va;
		if(this.skip != oFont.skip)
            this.skip = g_oDefaultFont.skip;
		if(this.repeat != oFont.repeat)
            this.repeat = g_oDefaultFont.repeat;
	},
	getType : function()
	{
		return UndoRedoDataTypes.StyleFont;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.fn: return this.fn;break;
			case this.Properties.scheme: return this.scheme;break;
			case this.Properties.fs: return this.fs;break;
			case this.Properties.b: return this.b;break;
			case this.Properties.i: return this.i;break;
			case this.Properties.u: return this.u;break;
			case this.Properties.s: return this.s;break;
			case this.Properties.c: return this.c;break;
			case this.Properties.va: return this.va;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.fn: this.fn = value;break;
			case this.Properties.scheme: this.scheme = value;break;
			case this.Properties.fs: this.fs = value;break;
			case this.Properties.b: this.b = value;break;
			case this.Properties.i: this.i = value;break;
			case this.Properties.u: this.u = value;break;
			case this.Properties.s: this.s = value;break;
			case this.Properties.c: this.c = value;break;
			case this.Properties.va: this.va = value;break;
		}
	}
};
/** @constructor */
function Fill(val)
{
	if(null == val)
	{
		val = {
			bg : null
		};
	}
	this.Properties = {
		bg: 0
	};
	this.bg = val.bg;
};
Fill.prototype =
{
	_mergeProperty : function(first, second, def)
	{
		if(def != first)
			return first;
		else
			return second;
	},
	merge : function(fill)
	{
		var oRes = new Fill();
		oRes.bg = this._mergeProperty(this.bg, fill.bg, g_oDefaultFill.bg);
		oRes.themeColor = this._mergeProperty(this.themeColor, fill.themeColor, g_oDefaultFill.themeColor);
		oRes.themeTint = this._mergeProperty(this.themeTint, fill.themeTint, g_oDefaultFill.themeTint);
		return oRes;
	},
	getRgbOrNull : function()
	{
		var nRes = null;
		if(null != this.bg)
			nRes = this.bg.getRgb();
		return nRes;
	},
	getDif : function(val)
	{
		var oRes = new Fill(this);
		var bEmpty = true;
		if(g_oColorManager.isEqual(this.bg, val.bg))
			oRes.bg =  null;
		else
			bEmpty = false;
		if(bEmpty)
			oRes = null;
		return oRes;
	},
	isEqual : function(fill)
	{
		return g_oColorManager.isEqual(this.bg, fill.bg);
	},
    clone : function()
    {
        return new Fill(this);
    },
	getType : function()
	{
		return UndoRedoDataTypes.StyleFill;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.bg: return this.bg;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.bg: this.bg = value;break;
		}
	}
};
function BorderProp()
{
	this.Properties = {
		s: 0,
		c: 1
	};
	this.s = "none";
	this.c = g_oColorManager.getThemeColor(1);
}
BorderProp.prototype = {
	getRgbOrNull : function()
	{
		var nRes = null;
		if(null != this.c)
			nRes = this.c.getRgb();
		return nRes;
	},
	isEmpty : function()
	{
		return "none" == this.s;
	},
	isEqual : function(val)
	{
		return this.s == val.s && g_oColorManager.isEqual(this.c, val.c);
	},
	clone : function()
	{
		var res = new BorderProp();
		res.merge(this);
		return res;
	},
	merge : function(oBorderProp)
	{
		if(null != oBorderProp.s && "none" != oBorderProp.s)
		{
			this.s = oBorderProp.s;
			if(null != oBorderProp.c)
				this.c = oBorderProp.c;
		}
	},
	getType : function()
	{
		return UndoRedoDataTypes.StyleBorderProp;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.s: return this.s;break;
			case this.Properties.c: return this.c;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.s: this.s = value;break;
			case this.Properties.c: this.c = value;break;
		}
	}
}
/** @constructor */
function Border(val)
{
	if(null == val)
	{
		val = {
			l : new BorderProp(),
			t : new BorderProp(),
			r : new BorderProp(),
			b : new BorderProp(),
			d : new BorderProp(),
			ih : new BorderProp(),
			iv : new BorderProp(),
			dd : false,
			du : false
		};
	}
	this.Properties = {
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
	this.l = val.l.clone();
	this.t = val.t.clone();
	this.r = val.r.clone();
	this.b = val.b.clone();
	this.d = val.d.clone();
	this.ih = val.ih.clone();
	this.iv = val.iv.clone();
	this.dd = val.dd;
	this.du = val.du;
};
Border.prototype =
{
	_mergeProperty : function(first, second, def)
	{
		if((null != def.isEqual && false == def.isEqual(first)) || (null == def.isEqual && def != first))
			return first;
		else
			return second;
	},
	merge : function(border)
	{
		var oRes = new Border();
		oRes.l = this._mergeProperty(this.l, border.l, g_oDefaultBorder.l).clone();
		oRes.t = this._mergeProperty(this.t, border.t, g_oDefaultBorder.t).clone();
		oRes.r = this._mergeProperty(this.r, border.r, g_oDefaultBorder.r).clone();
		oRes.b = this._mergeProperty(this.b, border.b, g_oDefaultBorder.b).clone();
		oRes.d = this._mergeProperty(this.d, border.d, g_oDefaultBorder.d).clone();
		oRes.ih = this._mergeProperty(this.ih, border.ih, g_oDefaultBorder.ih).clone();
		oRes.iv = this._mergeProperty(this.iv, border.iv, g_oDefaultBorder.iv).clone();
		oRes.dd = this._mergeProperty(this.dd, border.dd, g_oDefaultBorder.dd);
		oRes.du = this._mergeProperty(this.du, border.du, g_oDefaultBorder.du);
		return oRes;
	},
	getDif : function(val)
	{
		var oRes = new Border(this);
		var bEmpty = true;
		if(true == this.l.isEqual(val.l))
			oRes.l =  null;
		else
			bEmpty = false;
		if(true == this.t.isEqual(val.t))
			oRes.t =  null;
		else
			bEmpty = false;
		if(true == this.r.isEqual(val.r))
			oRes.r =  null;
		else
			bEmpty = false;
		if(true == this.b.isEqual(val.b))
			oRes.b =  null;
		else
			bEmpty = false;
		if(true == this.d.isEqual(val.d))
			oRes.d =  null;
		if(true == this.ih.isEqual(val.ih))
			oRes.ih =  null;
		else
			bEmpty = false;
		if(true == this.iv.isEqual(val.iv))
			oRes.iv =  null;
		else
			bEmpty = false;
		if(this.dd == val.dd)
			oRes.dd =  null;
		else
			bEmpty = false;
		if(this.du == val.du)
			oRes.du =  null;
		else
			bEmpty = false;
		if(bEmpty)
			oRes = null;
		return oRes;
	},
	isEqual : function(val)
	{
		return this.l.isEqual(val.l) && this.t.isEqual(val.t) && this.r.isEqual(val.r) && this.b.isEqual(val.b) && this.d.isEqual(val.d) &&
				this.ih.isEqual(val.ih) && this.iv.isEqual(val.iv) && this.dd == val.dd && this.du == val.du;
	},
    clone : function()
    {
        return new Border(this);
    },
	clean : function()
	{
		this.l = g_oDefaultBorder.l.clone();
		this.t = g_oDefaultBorder.t.clone();
		this.r = g_oDefaultBorder.r.clone();
		this.b = g_oDefaultBorder.b.clone();
		this.d = g_oDefaultBorder.d.clone();
		this.ih = g_oDefaultBorder.ih.clone();
		this.iv = g_oDefaultBorder.iv.clone();
		this.dd = g_oDefaultBorder.dd;
		this.du = g_oDefaultBorder.du;
	},
    set : function(border)
    {
		//border может быть не класса Border
		this.clean();
		this.mergeInner(border);
    },
    mergeInner : function(border){
		//border может быть не класса Border
        if(border){
            if(border.l)
				this.l.merge(border.l);
            if(border.t)
                this.t.merge(border.t);
            if(border.r)
                this.r.merge(border.r);
            if(border.b)
                this.b.merge(border.b);
            if(border.d)
                this.d.merge(border.d);
            if(border.ih)
				this.ih.merge(border.ih);
            if(border.iv)
                this.iv.merge(border.iv);
            if(null != border.dd)
                this.dd = border.dd;
            if(null != border.du)
                this.du = border.du;
        }
    },
	getType : function()
	{
		return UndoRedoDataTypes.StyleBorder;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.l: return this.l;break;
			case this.Properties.t: return this.t;break;
			case this.Properties.r: return this.r;break;
			case this.Properties.b: return this.b;break;
			case this.Properties.d: return this.d;break;
			case this.Properties.ih: return this.ih;break;
			case this.Properties.iv: return this.iv;break;
			case this.Properties.dd: return this.dd;break;
			case this.Properties.du: return this.du;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.l: this.l = value;break;
			case this.Properties.t: this.t = value;break;
			case this.Properties.r: this.r = value;break;
			case this.Properties.b: this.b = value;break;
			case this.Properties.d: this.d = value;break;
			case this.Properties.ih: this.ih = value;break;
			case this.Properties.iv: this.iv = value;break;
			case this.Properties.dd: this.dd = value;break;
			case this.Properties.du: this.du = value;break;
		}
	}
};
/** @constructor */
function Num(val)
{
	if(null == val)
	{
		val = {
			f : "General"
		};
	}
	this.Properties = {
		f: 0
	};
	this.f = val.f;
};
Num.prototype =
{
	merge : function(num)
	{
		var oRes = new Num();
		if(g_oDefaultNum.f != this.f)
			oRes.f = this.f;
		else
			oRes.f = num.f;
		return oRes;
	},
	getDif : function(val)
	{
		var oRes = new Num(this);
		var bEmpty = true;
		if(this.f == val.f)
			oRes.f =  null;
		else
			bEmpty = false;
		if(bEmpty)
			oRes = null;
		return oRes;
	},
	isEqual : function(val)
	{
		return this.f == val.f;
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
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.f: this.f = value;break;
		}
	}
};
/** @constructor */
function CellXfs() {
	this.Properties = {
		border: 0,
		fill: 1,
		font: 2,
		num: 3,
		align: 4,
		QuotePrefix: 5,
		XfId: 6
	};
    this.border = null;
    this.fill = null;
    this.font = null;
    this.num = null;
    this.align = null;
	this.QuotePrefix = null;
	this.XfId = null;
}
CellXfs.prototype =
{
	_mergeProperty : function(first, second)
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
				if(null != first.merge)
					res = first.merge(second);
				else
					res = from;
			}
		}
		return res;
	},
	merge : function(xfs)
	{
		var oRes = new CellXfs();
		oRes.border = this._mergeProperty(this.border, xfs.border);
		oRes.fill = this._mergeProperty(this.fill, xfs.fill);
		oRes.font = this._mergeProperty(this.font, xfs.font);
		oRes.num = this._mergeProperty(this.num, xfs.num);
		oRes.align = this._mergeProperty(this.align, xfs.align);
		oRes.QuotePrefix = this._mergeProperty(this.QuotePrefix, xfs.QuotePrefix);
		return oRes;
	},
    clone : function()
    {
        var res = new CellXfs();
        if(null != this.border)
            res.border = this.border.clone();
        if(null != this.fill)
            res.fill = this.fill.clone();
        if(null != this.font)
            res.font = this.font.clone();
        if(null != this.num)
            res.num = this.num.clone();
        if(null != this.align)
            res.align = this.align.clone();
        if(null != this.QuotePrefix)
            res.QuotePrefix = this.QuotePrefix;
		if (null !== this.XfId)
			res.XfId = this.XfId;
        return res;
    },
	isEqual : function(xfs)
	{
		if(false == ((null == this.border && null == xfs.border) || (null != this.border && null != xfs.border && this.border.isEqual(xfs.border))))
			return false;
		if(false == ((null == this.fill && null == xfs.fill) || (null != this.fill && null != xfs.fill && this.fill.isEqual(xfs.fill))))
			return false;
		if(false == ((null == this.font && null == xfs.font) || (null != this.font && null != xfs.font && this.font.isEqual(xfs.font))))
			return false;
		if(false == ((null == this.num && null == xfs.num) || (null != this.num && null != xfs.num && this.num.isEqual(xfs.num))))
			return false;
		if(false == ((null == this.align && null == xfs.align) || (null != this.align && null != xfs.align && this.align.isEqual(xfs.align))))
			return false;
		if(this.QuotePrefix != xfs.QuotePrefix)
			return false;
		if (this.XfId != xfs.XfId)
			return false;
		return true;
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
			case this.Properties.XfId: this.XfId = value; break;
		}
	}
};
/** @constructor */
function Align(val)
{
	if(null == val)
	{
		val = {
			hor : "none",
			indent : 0,
			RelativeIndent : 0,
			shrink : false,
			angle : 0,
			ver : "bottom",
			wrap : false
		};
	}
	this.Properties = {
		hor: 0,
		indent: 1,
		RelativeIndent: 2,
		shrink: 3,
		angle: 4,
		ver: 5,
		wrap: 6
	};
	this.hor = val.hor;
	this.indent = val.indent;
	this.RelativeIndent = val.RelativeIndent;
	this.shrink = val.shrink;
	this.angle = val.angle;
	this.ver = val.ver;
	this.wrap = val.wrap;
};
Align.prototype =
{
	_mergeProperty : function(first, second, def)
	{
		if(false == def.isEqual(first))
			return first;
		else
			return second;
	},
	merge : function(border)
	{
		var oRes = new Align();
		oRes.hor = this._mergeProperty(this.hor, border.hor, g_oDefaultAlign.hor);
		oRes.indent = this._mergeProperty(this.indent, border.indent, g_oDefaultAlign.indent);
		oRes.RelativeIndent = this._mergeProperty(this.RelativeIndent, border.RelativeIndent, g_oDefaultAlign.RelativeIndent);
		oRes.shrink = this._mergeProperty(this.shrink, border.shrink, g_oDefaultAlign.shrink);
		oRes.angle = this._mergeProperty(this.angle, border.angle, g_oDefaultAlign.angle);
		oRes.ver = this._mergeProperty(this.ver, border.ver, g_oDefaultAlign.ver);
		oRes.wrap = this._mergeProperty(this.wrap, border.wrap, g_oDefaultAlign.wrap);
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
	}
};
/** @constructor */
function CCellStyles() {
	this.CustomStyles = [];
	this.DefaultStyles = [];
	this.AllStyles = {};
}
/** @constructor */
function CCellStyle() {
	this.BuiltinId = null;
	this.CustomBuiltin = null;
	this.Hidden = null;
	this.ILevel = null;
	this.Name = null;
	this.XfId = null;

	this.xfs = null;
}
/** @constructor */
function StyleManager(){
    //содержат все свойства по умолчанию
	this.oDefaultFont = null;
	this.oDefaultAlign = null;
	this.oDefaultQuotePrefix = null;
    //стиль ячейки по умолчанию, может содержать не все свойства
	this.oDefaultXfs = new CellXfs();
};
StyleManager.prototype =
{
    init : function(oDefaultXfs)
    {
		if(null != oDefaultXfs.font)
			g_oDefaultFont = oDefaultXfs.font.clone();
		if(null != oDefaultXfs.fill)
			g_oDefaultFill = oDefaultXfs.fill.clone();
		if(null != oDefaultXfs.border)
			g_oDefaultBorder = oDefaultXfs.border.clone();
		if(null != oDefaultXfs.num)
			g_oDefaultNum = oDefaultXfs.num.clone();
		if(null != oDefaultXfs.align)
			g_oDefaultAlign = oDefaultXfs.align.clone();
		if (null !== oDefaultXfs.XfId) {
			this.oDefaultXfs.XfId = oDefaultXfs.XfId;
			g_oDefaultXfId = oDefaultXfs.XfId;
		}
	},
    _prepareSet : function(oItemWithXfs)
	{
		if(null == oItemWithXfs.xfs)
			oItemWithXfs.xfs = oItemWithXfs.getDefaultFormat(this.oDefaultXfs).clone();
        return oItemWithXfs.xfs;
	},
    _prepareSetFont : function(oItemWithXfs)
	{
        xfs = this._prepareSet(oItemWithXfs);
		if(null == xfs.font)
			xfs.font = new Font();
        return xfs;
	},
    _prepareSetAlign : function(oItemWithXfs)
	{
        xfs = this._prepareSet(oItemWithXfs);
		if(null == xfs.align)
			xfs.align = new Align();
        return xfs;
	},
	setNumFormat : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.num)
            oRes.oldVal = xfs.num.f;
		else
			oRes.oldVal = g_oDefaultNum.f;
        if(null == val)
        {
            if(null != xfs)
                xfs.num = null;
        }
        else
        {
            xfs = this._prepareSet(oItemWithXfs);
            if(null == xfs.num)
                xfs.num = new Num();
            xfs.num.f = val;
        }
		return oRes;
	},
	setFont : function(oItemWithXfs, val, oHistoryObj, nHistoryId, sSheetId, oRange)
    {
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font;
		else
			oRes.oldVal = g_oDefaultFont;
        if(null == val)
        {
            if(null != xfs)
                xfs.font = null;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font = val.clone();
        }
		return oRes;
	},
	setFontname : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.fn;
		else
			oRes.oldVal = g_oDefaultFont.fn;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.fn = g_oDefaultFont.fn;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.fn = val;
        }
		return oRes;
	},
	setFontsize : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.fs;
		else
			oRes.oldVal = g_oDefaultFont.fs;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.fs = g_oDefaultFont.fs;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.fs = val;
        }
		return oRes;
	},
	setFontcolor : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.c;
		else
			oRes.oldVal = g_oDefaultFont.c;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.c = g_oDefaultFont.c;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.c = val;
        }
		return oRes;
	},
	setBold : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.b;
		else
			oRes.oldVal = g_oDefaultFont.b;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.b = g_oDefaultFont.b;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.b = val;
        }
		return oRes;
	},
	setItalic : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.i;
		else
			oRes.oldVal = g_oDefaultFont.i;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.i = g_oDefaultFont.i;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.i = val;
        }
		return oRes;
	},
	setUnderline : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.u;
		else
			oRes.oldVal = g_oDefaultFont.u;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.u = g_oDefaultFont.u;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.u = val;
        }
		return oRes;
	},
	setStrikeout : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.s;
		else
			oRes.oldVal = g_oDefaultFont.s;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.s = g_oDefaultFont.s;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.s = val;
        }
		return oRes;
	},
	setFontAlign : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.font)
            oRes.oldVal = xfs.font.va;
		else
			oRes.oldVal = g_oDefaultFont.va;
        if(null == val)
        {
            if(null != xfs && null != xfs.font)
                xfs.font.va = g_oDefaultFont.va;
        }
        else
        {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.va = val;
        }
		return oRes;
	},
	setAlignVertical : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.align)
            oRes.oldVal = xfs.align.ver;
		else
			oRes.oldVal = g_oDefaultAlign.ver;
        if(null == val)
        {
            if(null != xfs && null != xfs.align)
                xfs.align.ver = g_oDefaultAlign.ver;
        }
        else
        {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.ver = val;
        }
		return oRes;
	},
	setAlignHorizontal : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.align)
            oRes.oldVal = xfs.align.hor;
		else
			oRes.oldVal = g_oDefaultAlign.hor;
        if(null == val)
        {
            if(null != xfs && null != xfs.align)
                xfs.align.hor = g_oDefaultAlign.hor;
        }
        else
        {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.hor = val;
        }
		return oRes;
	},
	setFill : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.fill)
            oRes.oldVal = xfs.fill.bg;
		else
			oRes.oldVal = g_oDefaultFill.bg;
        if(null == val)
        {
            if(null != xfs && null != xfs.fill)
                xfs.fill.bg = g_oDefaultFill.bg;
        }
        else
        {
            xfs = this._prepareSet(oItemWithXfs);
			if(null == xfs.fill)
                xfs.fill = new Fill();
            xfs.fill.bg = val;
        }
		return oRes;
	},
	setBorder : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.border)
            oRes.oldVal = xfs.border;
		else
			oRes.oldVal = g_oDefaultBorder;
        if(null == val)
        {
            if(null != xfs && null != xfs.border)
                xfs.border = val;
        }
        else
        {
            xfs = this._prepareSet(oItemWithXfs);
            xfs.border = val;
        }
		return oRes;
	},
	setShrinkToFit : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.align)
            oRes.oldVal = xfs.align.shrink;
		else
			oRes.oldVal = g_oDefaultAlign.shrink;
        if(null == val)
        {
            if(null != xfs && null != xfs.align)
                xfs.align.shrink = g_oDefaultAlign.shrink;
        }
        else
        {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.shrink = val;
        }
		return oRes;
	},
	setWrap : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.align)
            oRes.oldVal = xfs.align.wrap;
		else
			oRes.oldVal = g_oDefaultAlign.wrap;
        if(null == val)
        {
            if(null != xfs && null != xfs.align)
                xfs.align.wrap = g_oDefaultAlign.wrap;
        }
        else
        {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.wrap = val;
        }
		return oRes;
	},
	setQuotePrefix : function(oItemWithXfs, val)
	{
        var xfs = oItemWithXfs.xfs;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.QuotePrefix)
            oRes.oldVal = xfs.QuotePrefix;
        if(null == val)
        {
            if(null != xfs)
                xfs.QuotePrefix = val;
        }
        else
        {
            xfs = this._prepareSet(oItemWithXfs);
            xfs.QuotePrefix = val;
        }
		return oRes;
	},
    setAngle : function(oItemWithXfs, val)
    {
        var xfs = oItemWithXfs.xfs;
		if(-90 <= val && val <= 90)
		{
			if(val < 0)
				val = 90 - val;
		}
		else if(g_nVerticalTextAngle != val)
			val = 0;
        var oRes = {newVal: val, oldVal: null};
        if(null != xfs && null != xfs.align)
            oRes.oldVal = xfs.align.angle;
		else
			oRes.oldVal = g_oDefaultAlign.angle;
        if(null == val)
        {
            if(null != xfs && null != xfs.align)
                xfs.align.angle = g_oDefaultAlign.angle;
        }
        else
        {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.angle = val;
        }
        return oRes;
    },
	setVerticalText : function(oItemWithXfs, val)
    {
		if(true == val)
			return this.setAngle(oItemWithXfs, g_nVerticalTextAngle);
		else
			return this.setAngle(oItemWithXfs, 0);
    }
};
/** @constructor */
function Hyperlink()
{
	this.Properties = {
		Ref: 0,
		Location: 1,
		Hyperlink: 2,
		Tooltip: 3
	};
    this.Ref = null;
    this.Location = null;
    this.Hyperlink = null;
    this.Tooltip = null;
	
	this.bVisited = false;
};
Hyperlink.prototype =
{
	clone : function()
	{
		var oNewHyp = new Hyperlink();
		if(null != this.Ref)
			oNewHyp.Ref = this.Ref.clone();
		if(null != this.Location)
			oNewHyp.Location = this.Location;
		if(null != this.Hyperlink)
			oNewHyp.Hyperlink = this.Hyperlink;
		if(null != this.Tooltip)
			oNewHyp.Tooltip = this.Tooltip;
		return oNewHyp;
	},
	isEqual : function(obj)
	{
		var bRes = (this.Location == obj.Location && this.Hyperlink == obj.Hyperlink && this.Tooltip == obj.Tooltip);
		if(bRes)
		{
			var oBBoxRef = this.Ref.getBBox0();
			var oBBoxObj = obj.Ref.getBBox0();
			bRes = (oBBoxRef.r1 == oBBoxObj.r1 && oBBoxRef.c1 == oBBoxObj.c1 && oBBoxRef.r2 == oBBoxObj.r2 && oBBoxRef.c2 == oBBoxObj.c2);
		}
		return bRes;
	},
	isValid : function()
	{
		return null != this.Ref && (null != this.Location || null != this.Hyperlink);
	},
	getType : function()
	{
		return UndoRedoDataTypes.Hyperlink;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.Ref:
				var sRes = this.Ref.worksheet.getName();
				if(false == rx_test_ws_name.test(sRes))
					sRes = "'" + sRes + "'";
				sRes += "!" + this.Ref.getName();
				return sRes;
				break;
			case this.Properties.Location: return this.Location;break;
			case this.Properties.Hyperlink: return this.Hyperlink;break;
			case this.Properties.Tooltip: return this.Tooltip;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.Ref:
				//todo обработать нули
				var oRefParsed = parserHelp.parse3DRef(value);
				if (null !== oRefParsed) {
					// Получаем sheet по имени
					ws = window["Asc"]["editor"].wbModel.getWorksheetByName (oRefParsed.sheet);
					if (ws)
						this.Ref = ws.getRange2(oRefParsed.range);
				}
			break;
			case this.Properties.Location: this.Location = value;break;
			case this.Properties.Hyperlink: this.Hyperlink = value;break;
			case this.Properties.Tooltip: this.Tooltip = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
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
function Col(worksheet, index)
{
	this.ws = worksheet;
	this.sm = this.ws.workbook.oStyleManager;
	this.index = index;
	this.id = this.ws.getNextColId();
    this.BestFit = null;
    this.hd = null;
    this.CustomWidth = null;
    this.width = null;
    this.xfs = null;
	this.merged = null;
	this.hyperlinks = new Array();
};
Col.prototype =
{
	getId : function()
	{
		return this.id;
	},
	isEqual : function(obj)
	{
		var bRes = this.BestFit == obj.BestFit && this.hd == obj.hd && this.width == obj.width && this.CustomWidth == obj.CustomWidth && this.merged == obj.merged && this.hyperlinks.length == obj.hyperlinks.length;
		if(bRes)
		{
			if(null != this.xfs && null != obj.xfs)
				bRes = this.xfs.isEqual(obj.xfs);
			else if(null != this.xfs || null != obj.xfs)
				bRes = false;
		}
		if(bRes)
		{
			for(var i = 0, length = this.hyperlinks.length; i < length; ++i)
			{
				if(false == this.hyperlinks[i].isEqual(obj.hyperlinks[i]))
				{
					bRes = false;
					break;
				}
			}
		}
		return bRes;
	},
    isEmptyToSave : function()
	{
		return null == this.BestFit && null == this.hd && null == this.width && null == this.xfs && null == this.CustomWidth;
	},
	isEmpty : function()
	{
		return this.isEmptyToSave() && null == this.merged && 0 == this.hyperlinks.length;
	},
	Remove : function()
	{
		this.ws._removeCol(this.index);
	},
	clone : function()
    {
        var oNewCol = new Col(this.ws, this.index);
        if(null != this.BestFit)
            oNewCol.BestFit = this.BestFit;
        if(null != this.hd)
            oNewCol.hd = this.hd;
        if(null != this.width)
            oNewCol.width = this.width;
		if(null != this.CustomWidth)
            oNewCol.CustomWidth = this.CustomWidth;
        if(null != this.xfs)
            oNewCol.xfs = this.xfs.clone();
		//надо быть осторожнее, пока clone используется только с oAllCol
		if(null != this.merged)
            oNewCol.merged = this.merged;
		if(null != this.hyperlinks)
		{
            oNewCol.hyperlinks = new Array();
			for(var i = 0, length = this.hyperlinks.length; i < length; ++i)
				oNewCol.hyperlinks.push(this.hyperlinks[i]);
		}
		//todo hyperlink
        return oNewCol;
    },
	getWidthProp : function()
	{
		return new UndoRedoData_ColProp(this);
	},
	setWidthProp : function(prop)
	{
		if(null != prop.width)
			this.width = prop.width;
		else
			this.width = null;
		if(null != prop.hd)
			this.hd = prop.hd;
		else
			this.hd = null;
		if(null != prop.CustomWidth)
			this.CustomWidth = prop.CustomWidth;
		else
			this.CustomWidth = null;
		if(null != prop.BestFit)
			this.BestFit = prop.BestFit;
		else
			this.BestFit = null;
	},
	getDefaultFormat : function(oDefault)
	{
		if(null != this.ws.oAllCol && null != this.ws.oAllCol.xfs)
			return this.ws.oAllCol.xfs;
		else
			return oDefault;
	},
	getMerged : function()
	{
		return this.merged;
	},
	setStyle : function(xfs)
	{
		var oldVal = this.xfs;
		var newVal = null;
		this.xfs = null;
		if(null != xfs)
		{
			this.xfs = xfs.clone();
			newVal = xfs;
		}
		if(History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal))))
		{
			if(null != oldVal)
				oldVal = oldVal.clone();
			if(null != newVal)
				newVal = newVal.clone();
			History.Add(g_oUndoRedoCol, historyitem_RowCol_SetStyle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
		}
	},
	setNumFormat : function(val)
	{
		var oRes = this.sm.setNumFormat(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_NumFormat, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFont : function(val)
    {
		var oRes = this.sm.setFont(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetFont, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
		}
	},
	setFontname : function(val)
	{
		var oRes = this.sm.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontname, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontsize : function(val)
	{
		var oRes = this.sm.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontsize, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontcolor : function(val)
	{
		var oRes = this.sm.setFontcolor(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontcolor, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setBold : function(val)
	{
		var oRes = this.sm.setBold(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Bold, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setItalic : function(val)
	{
		var oRes = this.sm.setItalic(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Italic, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setUnderline : function(val)
	{
		var oRes = this.sm.setUnderline(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Underline, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setStrikeout : function(val)
	{
		var oRes = this.sm.setStrikeout(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Strikeout, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFontAlign : function(val)
	{
		var oRes = this.sm.setFontAlign(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_FontAlign, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setAlignVertical : function(val)
	{
		var oRes = this.sm.setAlignVertical(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignVertical, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setAlignHorizontal : function(val)
	{
		var oRes = this.sm.setAlignHorizontal(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignHorizontal, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setFill : function(val)
	{
		var oRes = this.sm.setFill(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fill, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setBorder : function(val)
	{
		var oRes = this.sm.setBorder(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Border, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
		}
	},
	setShrinkToFit : function(val)
	{
		var oRes = this.sm.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_ShrinkToFit, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
	setWrap : function(val)
	{
		var oRes = this.sm.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Wrap, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	},
    setAngle : function(val)
    {
        var oRes = this.sm.setAngle(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
    },
	setVerticalText : function(val)
	{
        var oRes = this.sm.setVerticalText(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
	}
};
/**
 * @constructor
 */
function Row(worksheet)
{
	this.ws = worksheet;
	this.sm = this.ws.workbook.oStyleManager;
	this.c = new Object();
	this.id = this.ws.getNextRowId();
    this.r = null;
	this.index = null;
    this.xfs = null;
    this.h = null;
    this.hd = null;
    this.CustomHeight = null;
	this.merged = null;
	this.hyperlinks = new Array();
};
Row.prototype =
{
	getId : function()
	{
		return this.id;
	},
	create : function(row)
	{
		this.index = row - 1;
		this.r = row;
		this.xfs = null;
	},
	moveVer : function(nDif)
	{
		this.r += nDif;
	},
	isEmptyToSave : function()
	{
		if(null != this.xfs || null != this.h || null != this.hd || null != this.CustomHeight)
			return false;
		var bEmptyCells = true;
		for(var i in this.c)
		{
			bEmptyCells = false;
			break;
		}
		if(false == bEmptyCells)
			return false;
		return true;
	},
	isEmpty : function()
	{
		return this.isEmptyToSave() && null == this.merged && 0 == this.hyperlinks.length;
	},
	Remove : function()
	{
		this.ws._removeRow(this.index);
	},
	clone : function()
	{
		var oNewRow = new Row(this.ws);
		oNewRow.r = this.r;
		if(null != this.xfs)
			oNewRow.xfs = this.xfs.clone();
		if(null != this.h)
			oNewRow.h = this.h;
		if(null != this.CustomHeight)
			oNewRow.CustomHeight = this.CustomHeight;
		if(null != this.hd)
			oNewRow.hd = this.hd;
		for(var i in this.c)
			oNewRow.c[i] = this.c[i].clone();
		//todo hyperlink
		return oNewRow;
	},
	getHeightProp : function()
	{
		return new UndoRedoData_RowProp(this);
	},
	setHeightProp : function(prop)
	{
		if(null != prop.h)
			this.h = prop.h;
		else
			this.h = null;
		if(null != prop.hd)
			this.hd = prop.hd;
		else
			this.hd = null;
		if(null != prop.CustomHeight)
			this.CustomHeight = prop.CustomHeight;
		else
			this.CustomHeight = null;
	},
	copyProperty : function(otherRow)
	{
		if(null != otherRow.xfs)
			this.xfs = otherRow.xfs.clone();
		if(null != otherRow.h)
			this.h = otherRow.h;
		if(null != otherRow.CustomHeight)
			this.CustomHeight = otherRow.CustomHeight;
		if(null != otherRow.hd)
			this.hd = otherRow.hd;
	},
	getDefaultFormat : function(oDefault)
	{
		if(null != this.ws.oAllCol && null != this.ws.oAllCol.xfs)
			return this.ws.oAllCol.xfs;
		else
			return oDefault;
	},
	getMerged : function()
	{
		return this.merged;
	},
	setStyle : function(xfs)
	{
		var oldVal = this.xfs;
		var newVal = null;
		this.xfs = null;
		if(null != xfs)
		{
			this.xfs = xfs.clone();
			newVal = xfs;
		}
		if(History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal))))
		{
			if(null != oldVal)
				oldVal = oldVal.clone();
			if(null != newVal)
				newVal = newVal.clone();
			History.Add(g_oUndoRedoRow, historyitem_RowCol_SetStyle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
		}
	},
	setNumFormat : function(val)
	{
		var oRes = this.sm.setNumFormat(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_NumFormat, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFont : function(val)
    {
		var oRes = this.sm.setFont(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetFont, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
		}
	},
	setFontname : function(val)
	{
		var oRes = this.sm.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontname, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontsize : function(val)
	{
		var oRes = this.sm.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontsize, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontcolor : function(val)
	{
		var oRes = this.sm.setFontcolor(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontcolor, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setBold : function(val)
	{
		var oRes = this.sm.setBold(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Bold, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setItalic : function(val)
	{
		var oRes = this.sm.setItalic(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Italic, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setUnderline : function(val)
	{
		var oRes = this.sm.setUnderline(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Underline, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setStrikeout : function(val)
	{
		var oRes = this.sm.setStrikeout(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Strikeout, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFontAlign : function(val)
	{
		var oRes = this.sm.setFontAlign(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_FontAlign, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setAlignVertical : function(val)
	{
		var oRes = this.sm.setAlignVertical(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignVertical, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setAlignHorizontal : function(val)
	{
		var oRes = this.sm.setAlignHorizontal(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignHorizontal, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setFill : function(val)
	{
		var oRes = this.sm.setFill(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fill, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setBorder : function(val)
	{
		var oRes = this.sm.setBorder(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
		{
			var oldVal = null;
			if(null != oRes.oldVal)
				oldVal = oRes.oldVal.clone();
			var newVal = null;
			if(null != oRes.newVal)
				newVal = oRes.newVal.clone();
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Border, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
		}
	},
	setShrinkToFit : function(val)
	{
		var oRes = this.sm.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_ShrinkToFit, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
	setWrap : function(val)
	{
		var oRes = this.sm.setShrinkToFit(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Wrap, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	},
    setAngle: function(val)
    {
        var oRes = this.sm.setFontname(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
    },
	setVerticalText : function(val)
	{
        var oRes = this.sm.setVerticalText(this, val);
        if(History.Is_On() && oRes.oldVal != oRes.newVal)
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
	}
};
function CCellValueMultiText()
{
	this.Properties = {
		text: 0,
		format: 1
	};
	this.text = null;
	this.format = null;
};
CCellValueMultiText.prototype = 
{
	isEqual : function(val)
	{
		if(null == val)
			return false;
		return this.text == val.text && ((null == this.format && null == val.format) || (null != this.format && null != val.format && this.format.isEqual(val.format)));
	},
	clone : function()
	{
		var oRes = new CCellValueMultiText();
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
function CCellValue(cell)
{
	this.Properties = {
		text: 0,
		multiText: 1,
		number: 2,
		type: 3
	};
	this.cell = cell;
	
	this.text = null;
	this.multiText = null;
	this.number = null;
	this.type = CellValueType.Number;
	//cache
	this.textValue = null;
	this.aTextValue2 = new Array();
	this.textValueForEdit = null;
	this.textValueForEdit2 = null;
}
CCellValue.prototype = 
{
	isEmpty : function()
	{
		if(null != this.number || (null != this.text && "" != this.text))
			return false;
		if(null != this.multiText)
		{
			var sText = "";
			for(var i = 0, length = this.multiText.length; i < length; ++i)
				sText += this.multiText[i].text;
			if("" != sText)
				return false;
		}
		return true;
	},
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
	clean : function()
	{
		this.text = null;
		this.multiText = null;
		this.number = null;
		this.type = CellValueType.Number;
		this.cleanCache();
	},
	clone : function(cell)
	{
		var oRes = new CCellValue(cell);
		if(null != this.text)
			oRes.text = this.text;
		if(null != this.multiText)
			oRes.multiText = this._cloneMultiText();
		if(null != this.number)
			oRes.number = this.number;
		if(null != this.type)
			oRes.type = this.type;
		return oRes;
	},
	cleanCache : function()
	{
		this.textValue = null;
		this.aTextValue2 = new Array();
		this.textValueForEdit = null;
		this.textValueForEdit2 = null;
	},
	makeSimpleText : function()
	{
		var bRes = false;
		if(null != this.multiText)
		{
			var sRes = "";
			for(var i = 0, length = this.multiText.length; i < length; ++i)
				sRes += this.multiText[i].text;
			this.multiText = null;
			this.text = sRes;
			bRes = true;
		}
		return bRes;
	},
	getValueWithoutFormat : function()
	{
		//применяем форматирование
		var sResult = "";
		if(null != this.number)
		{
			if(CellValueType.Bool == this.type)
				sResult = this.number == 1 ? "TRUE" : "FALSE";
			else
				sResult = this.number.toString();
		}
		else if(null != this.text)
			sResult = this.text;
		else if(null != this.multiText)
		{
			for(var i = 0, length = this.multiText.length; i < length; i++){
				sResult += this.multiText[i].text;
			}
		}
		return sResult;
	},
	getValue : function()
	{
		if(null == this.textValue)
		{
			this.getValue2(gc_nMaxDigCountView, function(){return true;});
			this.textValue = "";
			var aText = this.aTextValue2[gc_nMaxDigCountView];
			for(var i = 0, length = aText.length; i < length; ++i)
			{
				if(aText[i].format && aText[i].format.skip == false)
					this.textValue += aText[i].text;
			}
		}
		return this.textValue;
	},
	getValueForEdit : function()
	{
		if(null == this.textValueForEdit)
		{
			this.getValueForEdit2();
			this.textValueForEdit = "";
			for(var i = 0, length = this.textValueForEdit2.length; i < length; ++i)
				this.textValueForEdit += this.textValueForEdit2[i].text;
		}
		return this.textValueForEdit;
	},
	getValue2 : function(dDigitsCount, fIsFitMeasurer)
	{
		var aRes = null;
		if(null != this.aTextValue2[dDigitsCount])
			aRes = this.aTextValue2[dDigitsCount];
		if(null == aRes)
		{
			var bNeedMeasure = true;
			var sText = null;
			var aText = null;		
			if(CellValueType.Number == this.type || CellValueType.String == this.type)
			{
				if(null != this.text)
					sText = this.text;
				else if(null != this.multiText)
					aText = this.multiText;

				if(CellValueType.String == this.type)
					bNeedMeasure = false;
				var oNumFormat;
				var xfs = this.cell.getStyle();
				if(null != xfs && null != xfs.num)
					oNumFormat = oNumFormatCache.get(xfs.num.f);
				else
					oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
				if(false == oNumFormat.isGeneralFormat())
				{
					var oAdditionalResult = new Object();
					if(null != this.number)
					{
						aText = oNumFormat.format(this.number, this.type, dDigitsCount, oAdditionalResult);
						sText = null;
					}
					else if(CellValueType.String == this.type)
					{
						if(oNumFormat.isTextFormat())
						{
							if(null != this.text)
							{
								aText = oNumFormat.format(this.text, this.type, dDigitsCount, oAdditionalResult);
								sText = null;
							}
							else if(null != this.multiText)
							{
								if("@" != oNumFormat.sFormat)
								{
									var sSimpleString = "";
									for(var i = 0, length = this.multiText.length; i < length; ++i)
										sSimpleString += this.multiText[i].text;
									aText = oNumFormat.format(sSimpleString, this.type, dDigitsCount, oAdditionalResult);
									sText = null;
								}
							}
						}
					}
				}
				else if(CellValueType.Number == this.type && null != this.number)
				{
					bNeedMeasure = false;
					var bFindResult = false;
					//варируем dDigitsCount чтобы результат влез в ячейку
					var nTempDigCount = Math.ceil(dDigitsCount);
					var sOriginText = this.number;
					while(nTempDigCount >= 1)
					{
						//Строим подходящий general format
						var sGeneral = DecodeGeneralFormat(sOriginText, this.type, nTempDigCount);
						if(null != sGeneral)
							oNumFormat = oNumFormatCache.get(sGeneral);

						if(null != oNumFormat)
						{
							sText = null;
							aText = oNumFormat.format(sOriginText, this.type, dDigitsCount);
							if(true == oNumFormat.isTextFormat())
								break;
							else
							{
								aRes = this._getValue2Result(sText, aText);
								//Проверяем влезает ли текст
								if(true == fIsFitMeasurer(aRes))
								{
									bFindResult = true;
									break;
								}
								aRes = null;
							}
						}
						nTempDigCount--;
					}
					if(false == bFindResult)
					{
						sText = null;
						var oNewFont = new Font();
						if(dDigitsCount > 1)
						{
							oNewFont.repeat = true;
							aText = [{text: "#", format: oNewFont}];
						}
						else
							aText = [{text: "", format: oNewFont}];
					}
				}
			}
			else if(CellValueType.Bool == this.type)
			{
				if(null != this.number)
					sText = (0 != this.number) ? "TRUE" : "FALSE";
			}
			else if(CellValueType.Error == this.type)
			{
				if(null != this.text)
					sText = this.text;
			}
			if(bNeedMeasure)
			{
				aRes = this._getValue2Result(sText, aText);
				//Проверяем влезает ли текст
				if(false == fIsFitMeasurer(aRes))
				{
					aRes = null;
					sText = null;
					aText = [{text: "#", format: {repeat: true}}];
				}
			}
			if(null == aRes)
				aRes = this._getValue2Result(sText, aText);
			if( this.cell.sFormula ){
				aRes[0].sFormula = this.cell.sFormula;
				aRes[0].sId = this.cell.getName();
			}
			
			this.aTextValue2[dDigitsCount] = aRes;
		}
		return aRes;
	},
	getValueForEdit2 : function()
	{
		if(null == this.textValueForEdit2)
		{
			//todo проблема точности. в excel у чисел только 15 значащих цифр у нас больше.
			//применяем форматирование
			var oValueText = null;
			var oValueArray = null;
			var xfs = this.cell.getStyle();
			if(this.cell.sFormula)
				oValueText = "="+this.cell.sFormula;
			else
			{
				if(null != this.text || null != this.number)
				{
					if (CellValueType.Bool == this.type && null != this.number)
						oValueText = (this.number == 1) ? "TRUE" : "FALSE";
					else
					{
						if(null != this.text)
							oValueText = this.text;
						if(CellValueType.Number == this.type || CellValueType.String == this.type)
						{
							var oNumFormat;
							if(null != xfs && null != xfs.num)
								oNumFormat = oNumFormatCache.get(xfs.num.f);
							else
								oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
							if(CellValueType.String != this.type && null != oNumFormat && null != this.number)
							{
								var nValue = this.number;
								var oTargetFormat = oNumFormat.getFormatByValue(nValue);
								if(oTargetFormat)
								{
									if(1 == oTargetFormat.nPercent)
									{
										//prercent
										oValueText = oGeneralEditFormatCache.format(nValue * 100) + "%";
									}
									else if(oTargetFormat.bDateTime)
									{
										//Если число не подходит под формат даты возвращаем само число
										if(false == oTargetFormat.isInvalidDateValue(nValue))
										{
											var bDate = oTargetFormat.bDate;
											var bTime = oTargetFormat.bTime;
											if(false == bDate && nValue >= 1)
												bDate = true;
											if(false == bTime && Math.floor(nValue) != nValue)
												bTime = true;
											if(bDate && bTime)
												oNumFormat = oNumFormatCache.get("m/d/yyyy h:mm:ss AM/PM");
											else if(bTime)
												oNumFormat = oNumFormatCache.get("h:mm:ss AM/PM");
											else
												oNumFormat = oNumFormatCache.get("m/d/yyyy");
											
											var aFormatedValue = oNumFormat.format(nValue, CellValueType.Number, gc_nMaxDigCount);
											oValueText = "";
											for(var i = 0, length = aFormatedValue.length; i < length; ++i)
												oValueText += aFormatedValue[i].text;
										}
										else
											oValueText = oGeneralEditFormatCache.format(nValue);
									}
									else
										oValueText = oGeneralEditFormatCache.format(nValue);
								}
							}
						}
					}
				}
				else if(this.multiText)
					oValueArray = this.multiText;
			}
			if(null != xfs && true == xfs.QuotePrefix && CellValueType.String == this.type)
			{
				if(null != oValueText)
					oValueText = "'" + oValueText;
				else if(null != oValueArray)
					oValueArray = [{text:"'"}].concat(oValueArray);
			}
			this.textValueForEdit2 = this._getValue2Result(oValueText, oValueArray);
		}
		return this.textValueForEdit2;
	},
	_getValue2Result : function(sText, aText)
	{
		var aResult = new Array();
		if(null == sText && null == aText)
			sText = "";
		var cellfont;
		var xfs = this.cell.getStyle();
		if(null != xfs && null != xfs.font)
			cellfont = xfs.font;
		else
			cellfont = g_oDefaultFont;
		if(null != sText){
			var oNewItem = {text: null, format: null, sFormula: null, sId: null, theme: null, tint: null};
			oNewItem.text = sText;
			oNewItem.format = cellfont.clone();
			//todo
			if(oNewItem.format.c instanceof ThemeColor)
			{
				oNewItem.theme = oNewItem.format.c.theme;
				oNewItem.tint = oNewItem.format.c.tint;
			}
			oNewItem.format.c = oNewItem.format.getRgbOrNull();
			oNewItem.format.skip = false;
			oNewItem.format.repeat = false;
			aResult.push(oNewItem);
		}
		else if(null != aText){
			for(var i = 0; i < aText.length; i++){
				var oNewItem = {text: null, format: null, sFormula: null, sId: null, theme: null, tint: null};
				var oCurtext = aText[i];
				if(null != oCurtext.text)
				{
					oNewItem.text = oCurtext.text;
					var oCurFormat = new Font();
					oCurFormat = new Font();
					oCurFormat.set(cellfont);
					if(null != oCurtext.format)
						oCurFormat.set(oCurtext.format);
					oNewItem.format = oCurFormat;
					//todo
					if(oNewItem.format.c instanceof ThemeColor)
					{
						oNewItem.theme = oNewItem.format.c.theme;
						oNewItem.tint = oNewItem.format.c.tint;
					}
					oNewItem.format.c = oNewItem.format.getRgbOrNull();
					aResult.push(oNewItem);
				}
			}
		}
		return aResult;
	},
	setValue : function(val)
	{
		this.clean();
		if("" == val)
			return;
		var oNumFormat;
		var xfs = this.cell.getStyle();
		if(null != xfs && null != xfs.num)
			oNumFormat = oNumFormatCache.get(xfs.num.f);
		else
			oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
		if(oNumFormat.isTextFormat())
		{
			this.type = CellValueType.String;
			this.text = val;
		}
		else
		{
			if(Asc.isNumber(val))
			{
				this.type = CellValueType.Number;
				this.number = parseFloat(val);
			}
			else
			{
				var sUpText = val.toUpperCase();
				if("TRUE" == sUpText || "FALSE" == sUpText)
				{
					this.type = CellValueType.Bool;
					this.number = ("TRUE" == sUpText) ? 1 : 0;
				}
				else if("#NULL!" == sUpText || "#DIV/0!" == sUpText || "#NAME?" == sUpText || "#NUM!" == sUpText ||
					"#N/A" == sUpText || "#REF!" == sUpText || "#VALUE!" == sUpText)
				{
					this.type = CellValueType.Error;
					this.text = sUpText;
				}
				else
				{
					//распознаем формат
					var bParsed = false;
					var res = g_oFormatParser.parse(val);
					if(null != res)
					{
						//Сравниваем с текущим форматом, если типы совпадают - меняем только значение ячейки
						var oTargetFormat = null;
						if(null != oNumFormat)
							oTargetFormat = oNumFormat.getFormatByValue(res.value);
						if(res.bDateTime)
						{
							if(null == oTargetFormat || res.bDateTime != oTargetFormat.bDateTime)
								this.cell.setNumFormat(res.format);
						}
						else if(res.format != oNumFormat.sFormat)
							this.cell.setNumFormat(res.format);
						this.number = res.value;
						this.type = CellValueType.Number;
						bParsed = true;
					}
					if(false == bParsed)
					{
						this.type = CellValueType.String;
						//проверяем QuotePrefix
						if(val.length > 0 && "'" == val[0])
						{
							this.cell.setQuotePrefix(true);
							val = val.substring(1);
						}
						this.text = val;
					}
				}
			}
		}
	},
	setValue2 : function(aVal)
	{
		var sSimpleText = "";
		for(var i = 0, length = aVal.length; i < length; ++i)
			sSimpleText += aVal[i].text;
		this.setValue(sSimpleText);
		if(CellValueType.String == this.type)
		{
			this.clean();
			this.type = CellValueType.String;
			//проверяем можно ли перевести массив в простую строку.
			if(aVal.length > 0)
			{
				this.multiText = new Array();
				for(var i = 0, length = aVal.length; i < length; i++){
					var item = aVal[i];
					var format = item.format;
					if(null != item.theme)
						format.c = g_oColorManager.getThemeColor(item.theme, item.tint);
					else
					{
						//todo убрать это преобразование
						if(null != format && null != format.c && "string" == typeof(format.c))
						{
							//переводим обратно в число
							if(0 == format.c.indexOf("#"))
							{
								var hex = format.c.substring(1);
								if(hex.length == 3)
									hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
								if(hex.length == 6)
								{
									var r = parseInt("0x" + hex.substring(0,2));
									var g = parseInt("0x" + hex.substring(2,4));
									var b = parseInt("0x" + hex.substring(4,6));
									format.c = r << 16 | g <<  8 | b;
								}
							}
						}
						format.c = new RgbColor(format.c);
					}
					
					var oNewElem = new CCellValueMultiText();
					oNewElem.text = item.text;
					oNewElem.format = new Font();
					if(null != item.format)
						oNewElem.format.set(item.format);
					this.multiText.push(oNewElem);
				}
				this.miminizeMultiText(true);
			}
			//обрабатываем QuotePrefix
			if(null != this.text)
			{
				if(this.text.length > 0 && "'" == this.text[0])
				{
					this.cell.setQuotePrefix(true);
					this.text = this.text.substring(1);
				}
			}
			else if(null != this.multiText)
			{
				if(this.multiText.length > 0)
				{
					var oFirstItem = this.multiText[0];
					if(null != oFirstItem.text && oFirstItem.text.length > 0 && "'" == oFirstItem.text[0])
					{
						this.cell.setQuotePrefix(true);
						if(1 != oFirstItem.text.length)
							oFirstItem.text = oFirstItem.text.substring(1);
						else
						{
							this.multiText.shift();
							if(0 == this.multiText.length)
							{
								this.multiText = null;
								this.text = "";
							}
						}
					}
				}
			}
		}
	},
	_cloneMultiText : function()
	{
		var oRes = new Array();
		for(var i = 0, length = this.multiText.length; i < length; ++i)
			oRes.push(this.multiText[i].clone());
		return oRes;
	},
	miminizeMultiText : function(bSetCellFont)
	{
		var bRes = false;
		if(null == bSetCellFont)
			bSetCellFont = true;
		if(null != this.multiText && this.multiText.length > 0)
		{
			var aVal = this.multiText;
			var oIntersectFont = aVal[0].format.clone();
			for(var i = 1, length = aVal.length; i < length; i++)
				oIntersectFont.intersect(aVal[i].format);
			if(bSetCellFont)
			{
				if(oIntersectFont.isEqual(g_oDefaultFont))
					this.cell.setFont(null, false);
				else
					this.cell.setFont(oIntersectFont, false);
			}
			//если у всех элементов один формат, то сохраняем только текст
			var bIsEqual = true;
			for(var i = 0, length = aVal.length; i < length; i++)
			{
				if(false == oIntersectFont.isEqual(aVal[i].format))
				{
					bIsEqual = false;
					break;
				}
			}
			if(bIsEqual)
			{
				this.makeSimpleText();
				bRes = true;
			}
		}
		return bRes;
	},
	_setFontProp : function(fCheck, fAction)
	{
		var bRes = false;
		if(null != this.multiText)
		{
			//проверяем поменяются ли свойства
			var bChange = false;
			for(var i = 0, length = this.multiText.length; i < length; ++i)
			{
				if(true == fCheck(this.multiText[i].format))
				{
					bChange = true;
					break;
				}
			}
			if(bChange)
			{
				var backupObj = this.cell.getValueData();
				for(var i = 0, length = this.multiText.length; i < length; ++i)
					fAction(this.multiText[i].format);
				//пробуем преобразовать в простую строку
				var cell = this.cell;
				if(this.miminizeMultiText(false))
				{
					var DataNew = cell.getValueData();
					History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, cell.ws.getId(), new Asc.Range(0, cell.oId.getRow0(), gc_nMaxCol0, cell.oId.getRow0()), new UndoRedoData_CellSimpleData(cell.oId.getRow0(),cell.oId.getCol0(), backupObj, DataNew));
				}
				else
				{
					var DataNew = this._cloneMultiText();
					History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeArrayValueFormat, cell.ws.getId(), new Asc.Range(0, cell.oId.getRow0(), gc_nMaxCol0, cell.oId.getRow0()), new UndoRedoData_CellSimpleData(cell.oId.getRow0(), cell.oId.getCol0(), backupObj.value.multiText, DataNew));
				}
			}
			bRes = true;
		}
		return bRes;
	},
	setFontname : function(val)
	{
		return this._setFontProp(function(format){return val != format.fn;}, function(format){format.fn = val;});
	},
	setFontsize : function(val)
	{
		return this._setFontProp(function(format){return val != format.fs;}, function(format){format.fs = val;});
	},
	setFontcolor : function(val)
	{
		return this._setFontProp(function(format){return val != format.c;}, function(format){format.c = val;});
	},
	setBold : function(val)
	{
		return this._setFontProp(function(format){return val != format.b;}, function(format){format.b = val;});
	},
	setItalic : function(val)
	{
		return this._setFontProp(function(format){return val != format.i;}, function(format){format.i = val;});
	},
	setUnderline : function(val)
	{
		return this._setFontProp(function(format){return val != format.u;}, function(format){format.u = val;});
	},
	setStrikeout : function(val)
	{
		return this._setFontProp(function(format){return val != format.s;}, function(format){format.s = val;});
	},
	setFontAlign : function(val)
	{
		return this._setFontProp(function(format){return val != format.va;}, function(format){format.va = val;});
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