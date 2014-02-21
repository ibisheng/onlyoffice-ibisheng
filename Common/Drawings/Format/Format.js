"use strict";

// COLOR -----------------------
/*
 var map_color_scheme = {};
 map_color_scheme["accent1"] = 0;
 map_color_scheme["accent2"] = 1;
 map_color_scheme["accent3"] = 2;
 map_color_scheme["accent4"] = 3;
 map_color_scheme["accent5"] = 4;
 map_color_scheme["accent6"] = 5;
 map_color_scheme["bg1"]     = 6;
 map_color_scheme["bg2"]     = 7;
 map_color_scheme["dk1"]     = 8;
 map_color_scheme["dk2"]     = 9;
 map_color_scheme["folHlink"] = 10;
 map_color_scheme["hlink"]   = 11;
 map_color_scheme["lt1"]     = 12;
 map_color_scheme["lt2"]     = 13;
 map_color_scheme["phClr"]   = 14;
 map_color_scheme["tx1"]     = 15;
 map_color_scheme["tx2"]     = 16;
 */

//Типы изменений в классе CTheme
var historyitem_ChangeColorScheme = 0;
var historyitem_ChangeFontScheme = 1;
var historyitem_ChangeFmtScheme = 2;

function isRealObject(o)
{
    return o !== null && typeof o === "object";
}

function isRealNumber(n)
{
    return typeof n === "number" && !isNaN(n);
}

function isRealBool(b)
{
    return b === true || b === false;
}





function writeLong(w, val)
{
    w.WriteBool(isRealNumber(val));
    if(isRealNumber(val))
    {
        w.WriteLong(val);
    }
}

function readLong(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetLong();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeDouble(w, val)
{
    w.WriteBool(isRealNumber(val));
    if(isRealNumber(val))
    {
        w.WriteDouble(val);
    }
}

function readDouble(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetDouble();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeBool(w, val)
{
    w.WriteBool(isRealBool(val));
    if(isRealBool(val))
    {
        w.WriteBool(val);
    }
}

function readBool(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetBool();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeString(w, val)
{
    w.WriteBool(typeof  val === "string");
    if(typeof  val === "string")
    {
        w.WriteString2(val);
    }
}

function readString(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetString2();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeObject(w, val)
{
    w.WriteBool(isRealObject(val));
    if(isRealObject(val))
    {
        w.WriteString2(val.Get_Id());
    }
}

function readObject(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = g_oTableId.Get_ById(r.GetString2());
    }
    else
    {
        ret = null;
    }
    return ret;
}

function ExecuteNoHistory(f, oThis, args)
{
	var is_on = (History instanceof CHistory) ? History.Is_On() : false;
	if(!(History instanceof CHistory))
	{
		History = {Add: function(){}};
	}
	if(is_on)
	{
		History.TurnOff();
	}
	var ret = f.apply(oThis, args);	
	if(is_on)
	{
		History.TurnOn();
	}
	return ret;
}



var TYPE_TRACK_SHAPE = 0;
var TYPE_TRACK_GROUP = TYPE_TRACK_SHAPE;
var TYPE_TRACK_GROUP_PASSIVE = 1;
var TYPE_TRACK_TEXT = 2;
var TYPE_TRACK_EMPTY_PH = 3;


var GLOBAL_BLIP_FILL_MAP = {};

var COLOR_TYPE_NONE		= 0;
var COLOR_TYPE_SRGB		= 1;
var COLOR_TYPE_PRST		= 2;
var COLOR_TYPE_SCHEME	= 3;
var COLOR_TYPE_SYS		= 4;

var SLIDE_KIND = 0;
var LAYOUT_KIND = 1;
var MASTER_KIND = 2;

var map_prst_color = {};

map_prst_color["aliceBlue"] = 		0xF0F8FF;
map_prst_color["antiqueWhite"] = 	0xFAEBD7;
map_prst_color["aqua"] = 			0x00FFFF;
map_prst_color["aquamarine"] = 		0x7FFFD4;
map_prst_color["azure"] = 			0xF0FFFF;
map_prst_color["beige"] = 			0xF5F5DC;
map_prst_color["bisque"] = 			0xFFE4C4;
map_prst_color["black"] = 			0x000000;
map_prst_color["blanchedAlmond"] = 	0xFFEBCD;
map_prst_color["blue"] = 			0x0000FF;
map_prst_color["blueViolet"] = 		0x8A2BE2;
map_prst_color["brown"] = 			0xA52A2A;
map_prst_color["burlyWood"] = 		0xDEB887;
map_prst_color["cadetBlue"] = 		0x5F9EA0;
map_prst_color["chartreuse"] = 		0x7FFF00;
map_prst_color["chocolate"] = 		0xD2691E;
map_prst_color["coral"] = 			0xFF7F50;
map_prst_color["cornflowerBlue"] = 	0x6495ED;
map_prst_color["cornsilk"] = 		0xFFF8DC;
map_prst_color["crimson"] = 		0xDC143C;
map_prst_color["cyan"] = 			0x00FFFF;
map_prst_color["darkBlue"] = 		0x00008B;
map_prst_color["darkCyan"] = 		0x008B8B;
map_prst_color["darkGoldenrod"] = 	0xB8860B;
map_prst_color["darkGray"] = 		0xA9A9A9;
map_prst_color["darkGreen"] = 		0x006400;
map_prst_color["darkGrey"] = 		0xA9A9A9;
map_prst_color["darkKhaki"] = 		0xBDB76B;
map_prst_color["darkMagenta"] = 	0x8B008B;
map_prst_color["darkOliveGreen"] = 	0x556B2F;
map_prst_color["darkOrange"] = 		0xFF8C00;
map_prst_color["darkOrchid"] = 		0x9932CC;
map_prst_color["darkRed"] = 		0x8B0000;
map_prst_color["darkSalmon"] = 		0xE9967A;
map_prst_color["darkSeaGreen"] = 	0x8FBC8F;
map_prst_color["darkSlateBlue"] = 	0x483D8B;
map_prst_color["darkSlateGray"] = 	0x2F4F4F;
map_prst_color["darkSlateGrey"] = 	0x2F4F4F;
map_prst_color["darkTurquoise"] = 	0x00CED1;
map_prst_color["darkViolet"] = 		0x9400D3;
map_prst_color["deepPink"] = 		0xFF1493;
map_prst_color["deepSkyBlue"] = 	0x00BFFF;
map_prst_color["dimGray"] = 		0x696969;
map_prst_color["dimGrey"] = 		0x696969;
map_prst_color["dkBlue"] = 			0x00008B;
map_prst_color["dkCyan"] = 			0x008B8B;
map_prst_color["dkGoldenrod"] = 	0xB8860B;
map_prst_color["dkGray"] = 			0xA9A9A9;
map_prst_color["dkGreen"] = 		0x006400;
map_prst_color["dkGrey"] = 			0xA9A9A9;
map_prst_color["dkKhaki"] = 		0xBDB76B;
map_prst_color["dkMagenta"] = 		0x8B008B;
map_prst_color["dkOliveGreen"] = 	0x556B2F;
map_prst_color["dkOrange"] = 		0xFF8C00;
map_prst_color["dkOrchid"] = 		0x9932CC;
map_prst_color["dkRed"] = 			0x8B0000;
map_prst_color["dkSalmon"] = 		0xE9967A;
map_prst_color["dkSeaGreen"] = 		0x8FBC8B;
map_prst_color["dkSlateBlue"] = 	0x483D8B;
map_prst_color["dkSlateGray"] = 	0x2F4F4F;
map_prst_color["dkSlateGrey"] = 	0x2F4F4F;
map_prst_color["dkTurquoise"] = 	0x00CED1;
map_prst_color["dkViolet"] = 		0x9400D3;
map_prst_color["dodgerBlue"] = 		0x1E90FF;
map_prst_color["firebrick"] = 		0xB22222;
map_prst_color["floralWhite"] = 	0xFFFAF0;
map_prst_color["forestGreen"] = 	0x228B22;
map_prst_color["fuchsia"] = 		0xFF00FF;
map_prst_color["gainsboro"] = 		0xDCDCDC;
map_prst_color["ghostWhite"] = 		0xF8F8FF;
map_prst_color["gold"] = 			0xFFD700;
map_prst_color["goldenrod"] = 		0xDAA520;
map_prst_color["gray"] = 			0x808080;
map_prst_color["green"] = 			0x008000;
map_prst_color["greenYellow"] = 	0xADFF2F;
map_prst_color["grey"] = 			0x808080;
map_prst_color["honeydew"] = 		0xF0FFF0;
map_prst_color["hotPink"] = 		0xFF69B4;
map_prst_color["indianRed"] = 		0xCD5C5C;
map_prst_color["indigo"] = 			0x4B0082;
map_prst_color["ivory"] = 			0xFFFFF0;
map_prst_color["khaki"] = 			0xF0E68C;
map_prst_color["lavender"] = 		0xE6E6FA;
map_prst_color["lavenderBlush"] = 	0xFFF0F5;
map_prst_color["lawnGreen"] = 		0x7CFC00;
map_prst_color["lemonChiffon"] = 	0xFFFACD;
map_prst_color["lightBlue"] = 		0xADD8E6;
map_prst_color["lightCoral"] = 		0xF08080;
map_prst_color["lightCyan"] = 		0xE0FFFF;
map_prst_color["lightGoldenrodYellow"] = 0xFAFAD2;
map_prst_color["lightGray"] = 		0xD3D3D3;
map_prst_color["lightGreen"] = 		0x90EE90;
map_prst_color["lightGrey"] = 		0xD3D3D3;
map_prst_color["lightPink"] = 		0xFFB6C1;
map_prst_color["lightSalmon"] = 	0xFFA07A;
map_prst_color["lightSeaGreen"] = 	0x20B2AA;
map_prst_color["lightSkyBlue"] = 	0x87CEFA;
map_prst_color["lightSlateGray"] = 	0x778899;
map_prst_color["lightSlateGrey"] = 	0x778899;
map_prst_color["lightSteelBlue"] = 	0xB0C4DE;
map_prst_color["lightYellow"] = 	0xFFFFE0;
map_prst_color["lime"] = 			0x00FF00;
map_prst_color["limeGreen"] = 		0x32CD32;
map_prst_color["linen"] = 			0xFAF0E6;
map_prst_color["ltBlue"] = 			0xADD8E6;
map_prst_color["ltCoral"] = 		0xF08080;
map_prst_color["ltCyan"] = 			0xE0FFFF;
map_prst_color["ltGoldenrodYellow"] = 0xFAFA78;
map_prst_color["ltGray"] = 			0xD3D3D3;
map_prst_color["ltGreen"] = 		0x90EE90;
map_prst_color["ltGrey"] = 			0xD3D3D3;
map_prst_color["ltPink"] = 			0xFFB6C1;
map_prst_color["ltSalmon"] = 		0xFFA07A;
map_prst_color["ltSeaGreen"] = 		0x20B2AA;
map_prst_color["ltSkyBlue"] = 		0x87CEFA;
map_prst_color["ltSlateGray"] = 	0x778899;
map_prst_color["ltSlateGrey"] = 	0x778899;
map_prst_color["ltSteelBlue"] = 	0xB0C4DE;
map_prst_color["ltYellow"] = 		0xFFFFE0;
map_prst_color["magenta"] = 		0xFF00FF;
map_prst_color["maroon"] = 			0x800000;
map_prst_color["medAquamarine"] = 	0x66CDAA;
map_prst_color["medBlue"] = 		0x0000CD;
map_prst_color["mediumAquamarine"] =  0x66CDAA;
map_prst_color["mediumBlue"] = 		0x0000CD;
map_prst_color["mediumOrchid"] = 	0xBA55D3;
map_prst_color["mediumPurple"] = 	0x9370DB;
map_prst_color["mediumSeaGreen"] = 	0x3CB371;
map_prst_color["mediumSlateBlue"] = 0x7B68EE;
map_prst_color["mediumSpringGreen"] = 0x00FA9A;
map_prst_color["mediumTurquoise"] = 0x48D1CC;
map_prst_color["mediumVioletRed"] = 0xC71585;
map_prst_color["medOrchid"] = 		0xBA55D3;
map_prst_color["medPurple"] = 		0x9370DB;
map_prst_color["medSeaGreen"] = 	0x3CB371;
map_prst_color["medSlateBlue"] = 	0x7B68EE;
map_prst_color["medSpringGreen"] = 	0x00FA9A;
map_prst_color["medTurquoise"] = 	0x48D1CC;
map_prst_color["medVioletRed"] = 	0xC71585;
map_prst_color["midnightBlue"] = 	0x191970;
map_prst_color["mintCream"] = 		0xF5FFFA;
map_prst_color["mistyRose"] = 		0xFFE4FF;
map_prst_color["moccasin"] = 		0xFFE4B5;
map_prst_color["navajoWhite"] = 	0xFFDEAD;
map_prst_color["navy"] = 			0x000080;
map_prst_color["oldLace"] = 		0xFDF5E6;
map_prst_color["olive"] = 			0x808000;
map_prst_color["oliveDrab"] = 		0x6B8E23;
map_prst_color["orange"] = 			0xFFA500;
map_prst_color["orangeRed"] = 		0xFF4500;
map_prst_color["orchid"] = 			0xDA70D6;
map_prst_color["paleGoldenrod"] = 	0xEEE8AA;
map_prst_color["paleGreen"] = 		0x98FB98;
map_prst_color["paleTurquoise"] = 	0xAFEEEE;
map_prst_color["paleVioletRed"] = 	0xDB7093;
map_prst_color["papayaWhip"] = 		0xFFEFD5;
map_prst_color["peachPuff"] = 		0xFFDAB9;
map_prst_color["peru"] = 			0xCD853F;
map_prst_color["pink"] = 			0xFFC0CB;
map_prst_color["plum"] = 			0xD3A0D3;
map_prst_color["powderBlue"] = 		0xB0E0E6;
map_prst_color["purple"] = 			0x800080;
map_prst_color["red"] = 			0xFF0000;
map_prst_color["rosyBrown"] = 		0xBC8F8F;
map_prst_color["royalBlue"] = 		0x4169E1;
map_prst_color["saddleBrown"] = 	0x8B4513;
map_prst_color["salmon"] = 			0xFA8072;
map_prst_color["sandyBrown"] = 		0xF4A460;
map_prst_color["seaGreen"] = 		0x2E8B57;
map_prst_color["seaShell"] = 		0xFFF5EE;
map_prst_color["sienna"] = 			0xA0522D;
map_prst_color["silver"] = 			0xC0C0C0;
map_prst_color["skyBlue"] = 		0x87CEEB;
map_prst_color["slateBlue"] = 		0x6A5AEB;
map_prst_color["slateGray"] = 		0x708090;
map_prst_color["slateGrey"] = 		0x708090;
map_prst_color["snow"] = 			0xFFFAFA;
map_prst_color["springGreen"] = 	0x00FF7F;
map_prst_color["steelBlue"] = 		0x4682B4;
map_prst_color["tan"] = 			0xD2B48C;
map_prst_color["teal"] = 			0x008080;
map_prst_color["thistle"] = 		0xD8BFD8;
map_prst_color["tomato"] = 			0xFF7347;
map_prst_color["turquoise"] = 		0x40E0D0;
map_prst_color["violet"] = 			0xEE82EE;
map_prst_color["wheat"] = 			0xF5DEB3;
map_prst_color["white"] = 			0xFFFFFF;
map_prst_color["whiteSmoke"] = 		0xF5F5F5;
map_prst_color["yellow"] = 			0xFFFF00;
map_prst_color["yellowGreen"] = 	0x9ACD32;









function CColorMod()
{
    this.name = "";
    this.val = 0;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CColorMod.prototype =
{
    getObjectType: function()
    {
        return historyitem_type_ColorMod;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    setName: function(name)
    {
        History.Add(this, {Type: historyitem_ColorMod_SetName, oldName: this.name, newName: name});
        this.name = name;
    },

    setVal: function(val)
    {
        History.Add(this, {Type: historyitem_ColorMod_SetVal, oldVal: this.val, newVal: val});
        this.val = val;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ColorMod_SetName:
            {
                this.name = data.oldName;
                break;
            }
            case historyitem_ColorMod_SetVal:
            {
                this.val = data.oldVal;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ColorMod_SetName:
            {
                this.name = data.newName;
                break;
            }
            case historyitem_ColorMod_SetVal:
            {
                this.val = data.newVal;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_ColorMod_SetName:
            {
                w.WriteString2(data.newName);
                break;
            }
            case historyitem_ColorMod_SetVal:
            {
                w.WriteLong(data.newVal);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(data.Type)
        {
            case historyitem_ColorMod_SetName:
            {
                this.name = r.GetString2();
                break;
            }
            case historyitem_ColorMod_SetVal:
            {
                this.val = r.GetLong();
                break;
            }
        }
    },


    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_ColorMod);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },

    createDuplicate : function()
    {
        var duplicate = new CColorMod();
        duplicate.name = this.name;
        duplicate.val = this.val;
        return duplicate;
    }
};

var cd16 = 1.0/6.0;
var cd13 = 1.0/3.0;
var cd23 = 2.0/3.0;

function CColorModifiers()
{
    this.Mods = [];

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CColorModifiers.prototype =
{
    getObjectType: function()
    {
        return historyitem_type_ColorModifiers;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w) {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ColorModifiers_AddColorMod:
            {
                for(var i = this.Mods.length - 1; i > -1; --i)
                {
                    if(this.Mods[i] && this.Mods[i].Get_Id() === data.modId)
                    {
                        this.Mods.splice(i, 1);
                        break;
                    }
                }
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ColorModifiers_AddColorMod:
            {
                var mod = g_oTableId.Get_ById(data.modId);
                if(mod)
                {
                    this.Mods.push(mod);
                }
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_ColorModifiers_AddColorMod:
            {
                w.WriteString2(data.modId);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
        {
            return;
        }
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_ColorModifiers_AddColorMod:
            {
                var mod = g_oTableId.Get_ById(r.GetString2());
                if(mod)
                {
                    this.Mods.push(mod);
                }
                break;
            }
        }
    },


    addMod: function(mod)
    {
        this.Mods.push(mod);
        History.Add(this, {Type: historyitem_ColorModifiers_AddColorMod, modId: mod.Get_Id()});
    },


    IsIdentical : function(mods)
    {
        if(mods == null)
        {
            return false
        }
        if(mods.Mods == null || this.Mods.length!=mods.Mods.length)
        {
            return false;
        }

        for(var i = 0; i<this.Mods.length; ++i)
        {
            if(this.Mods[i].name!=mods.Mods[i].name
                || this.Mods[i].val!=mods.Mods[i].val)
            {
                return false;
            }
        }
        return true;

    },

    createDuplicate : function()
    {
        var duplicate = new CColorModifiers();
        for(var  i=0; i< this.Mods.length; ++i)
        {
            duplicate.Mods[i] = this.Mods[i].createDuplicate();
        }
        return duplicate;
    },

    RGB2HSL : function(R, G, B, HLS)
    {
        var iMin = Math.min(R, Math.min(G, B));
        var iMax = Math.max(R, Math.max(G, B));
        var iDelta = iMax - iMin;
        var dMax = (iMax + iMin)/255.0;
        var dDelta = iDelta/255.0;
        var H = 0;
        var S = 0;
        var L = dMax / 2.0;

        if (iDelta != 0)
        {
            if ( L < 0.5 ) S = dDelta / dMax;
            else           S = dDelta / ( 2.0 - dMax );

            dDelta = dDelta * 1530.0;
            var dR = ( iMax - R ) / dDelta;
            var dG = ( iMax - G ) / dDelta;
            var dB = ( iMax - B ) / dDelta;

            if      ( R == iMax ) H = dB - dG;
            else if ( G == iMax ) H = cd13 + dR - dB;
            else if ( B == iMax ) H = cd23 + dG - dR;

            if ( H < 0.0 ) H += 1.0;
            if ( H > 1.0 ) H -= 1.0;
        }

        H = ((H * 240) >> 0) & 0xFF;
        if (H < 0)
            H = 0;
        if (H > 255)
            H = 255;

        S = ((S * 240) >> 0) & 0xFF;
        if (S < 0)
            S = 0;
        if (S > 255)
            S = 255;

        L = ((L * 240) >> 0) & 0xFF;
        if (L < 0)
            L = 0;
        if (L > 255)
            L = 255;

        HLS.H = H;
        HLS.S = S;
        HLS.L = L;
    },

    HSL2RGB : function(HSL, RGB)
    {
        if (HSL.S == 0)
        {
            RGB.R = HSL.L;
            RGB.G = HSL.L;
            RGB.B = HSL.L;
        }
        else
        {
            var H = HSL.H/240.0;
            var S = HSL.S/240.0;
            var L = HSL.L/240.0;
            var v2 = 0;
            if (L < 0.5)
                v2 = L * (1.0 + S);
            else
                v2 = L + S - S*L;

            var v1 = 2.0 * L - v2;

            var R = (255 * this.Hue_2_RGB(v1, v2, H + cd13)) >> 0;
            var G = (255 * this.Hue_2_RGB(v1, v2, H)) >> 0;
            var B = (255 * this.Hue_2_RGB(v1, v2, H - cd13)) >> 0;

            if (R < 0)
                R = 0;
            if (R > 255)
                R = 255;

            if (G < 0)
                G = 0;
            if (G > 255)
                G = 255;

            if (B < 0)
                B = 0;
            if (B > 255)
                B = 255;

            RGB.R = R;
            RGB.G = G;
            RGB.B = B;
        }
    },

    Hue_2_RGB : function(v1,v2,vH)
    {
        if (vH < 0.0)
            vH += 1.0;
        if (vH > 1.0)
            vH -= 1.0;
        if (vH < cd16)
            return v1 + (v2 - v1) * 6.0 * vH;
        if (vH < 0.5)
            return v2;
        if (vH < cd23)
            return v1 + (v2 - v1) * (cd23 - vH) * 6.0;
        return v1;
    },

    Apply : function(RGBA)
    {
        if (null == this.Mods)
            return;

        var _len = this.Mods.length;
        for (var i = 0; i < _len; i++)
        {
            var colorMod = this.Mods[i];
            var val = colorMod.val/100000.0;

            if (colorMod.name == "alpha")
            {
                RGBA.A = Math.min(255, Math.max(0, 255 * val));
            }
            else if (colorMod.name == "blue")
            {
                RGBA.B = Math.min(255, Math.max(0, 255 * val));
            }
            else if (colorMod.name == "blueMod")
            {
                RGBA.B = Math.max(0, (RGBA.B * val) >> 0);
            }
            else if (colorMod.name == "blueOff")
            {
                RGBA.B = Math.max(0, (RGBA.B + val * 255)) >> 0;
            }
            else if (colorMod.name == "green")
            {
                RGBA.G = Math.min(255, Math.max(0, 255 * val)) >> 0;
            }
            else if (colorMod.name == "greenMod")
            {
                RGBA.G = Math.max(0, (RGBA.G * val) >> 0);
            }
            else if (colorMod.name == "greenOff")
            {
                RGBA.G = Math.max(0, (RGBA.G + val * 255)) >> 0;
            }
            else if (colorMod.name == "red")
            {
                RGBA.R = Math.min(255, Math.max(0, 255 * val)) >> 0;
            }
            else if (colorMod.name == "redMod")
            {
                RGBA.R = Math.max(0, (RGBA.R * val) >> 0);
            }
            else if (colorMod.name == "redOff")
            {
                RGBA.R = Math.max(0, (RGBA.R + val * 255) >> 0);
            }
            else if (colorMod.name == "hueOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.H + (val * 10.0) / 9.0) >> 0;
                while(res > 240)
                    res = res - 240;
                while(res < 0)
                    res += 240;
                HSL.H = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "inv")
            {
                RGBA.R ^= 0xFF;
                RGBA.G ^= 0xFF;
                RGBA.B ^= 0xFF;
            }
            else if (colorMod.name == "lumMod")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                if(HSL.L*val > 240)
                    HSL.L = 240;
                else
                    HSL.L = Math.max(0, (HSL.L * val) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "lumOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.L + val * 240) >> 0;
                while(res > 240)
                    res = res - 240;
                while(res < 0)
                    res += 240;
                HSL.L = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "satMod")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                if(HSL.S*val > 240)
                    HSL.S = 240;
                else
                    HSL.S = Math.max(0, (HSL.S * val) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "satOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.S + val * 240) >> 0;
                while(res > 240)
                    res = res - 240;
                while(res < 0)
                    res += 240;
                HSL.S = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "shade")
            {
                RGBA.R = Math.max(0, (RGBA.R * val) >> 0);
                RGBA.G = Math.max(0, (RGBA.G * val) >> 0);
                RGBA.B = Math.max(0, (RGBA.B * val) >> 0);
            }
            else if (colorMod.name == "tint")
            {
                RGBA.R = Math.max(0, (255 - (255 - RGBA.R) * val) >> 0);
                RGBA.G = Math.max(0, (255 - (255 - RGBA.G) * val) >> 0);
                RGBA.B = Math.max(0, (255 - (255 - RGBA.B) * val) >> 0);
            }
        }
    }
};

function CSysColor()
{
    this.type = COLOR_TYPE_SYS;
    this.id = "";
    this.RGBA = {R:0, G:0, B:0, A:255};


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSysColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SysColor;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SysColor_SetId:
            {
                this.id = data.oldId;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SysColor_SetId:
            {
                this.id = data.newId;
                break;
            }
        }
    },

    setId: function(id)
    {
        History.Add(this, {Type: historyitem_SysColor_SetId, oldId: this.id, newId: id});
        this.id = id;
    },

    Save_Change: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_SysColor_SetId:
            {
                w.WriteString2(data.newId);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
        {
            return;
        }
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SysColor_SetId:
            {
                this.id = r.GetString2();
                break;
            }
        }

    },

    IsIdentical :  function(color)
    {
        return color && color.type == COLOR_TYPE_SYS && color.id == this.id;
    },
    Calculate : function(obj)
    {
    },

    createDuplicate : function()
    {
        var duplicate = new CSysColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    }
};
function CPrstColor()
{
    this.type = COLOR_TYPE_PRST;
    this.id = "";
    this.RGBA = {R:0, G:0, B:0, A:255};
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPrstColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PrstColor;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setId: function(id)
    {
        History.Add(this, {Type: historyitem_PrstColor_SetId, oldId: this.id, newId: id});
        this.id = id;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PrstColor_SetId:
            {
                this.id = data.oldId;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PrstColor_SetId:
            {
                this.id = data.newId;
                break;
            }
        }
    },

    IsIdentical : function(color)
    {
        return color && color.type == COLOR_TYPE_PRST && color.id == this.id;
    },

    createDuplicate : function()
    {
        var duplicate = new CPrstColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(obj)
    {
        var RGB = map_prst_color[this.id];
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    }
};
function CRGBColor()
{
    this.type = COLOR_TYPE_SRGB;
    this.RGBA = {R:0, G:0, B:0, A:255};
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CRGBColor.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_RGBColor;
    },

    writeToBinaryLong: function(w)
    {
        w.WriteLong(((this.RGBA.R << 16) & 0xFF0000) + ((this.RGBA.G << 8) & 0xFF00) + this.RGBA.B);
    },

    readFromBinaryLong: function(r)
    {
        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    },

    setColor: function(r, g, b)
    {
        var rgba = this.RGBA;
        History.Add(this, {Type: historyitem_RGBColor_SetColor, oldColor: {r: rgba.R, g: rgba.G, b: rgba.B}, newColor: {r: r, g: g, b: b}});
        this.RGBA.R = r;
        this.RGBA.G = g;
        this.RGBA.B = b;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_RGBColor_SetColor:
            {
                this.RGBA.R = data.oldColor.r;
                this.RGBA.G = data.oldColor.g;
                this.RGBA.B = data.oldColor.b;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_RGBColor_SetColor:
            {
                this.RGBA.R = data.newColor.r;
                this.RGBA.G = data.newColor.g;
                this.RGBA.B = data.newColor.b;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_RGBColor_SetColor:
            {
                w.WriteLong(((data.r << 16) & 0xFF0000) + ((data.g << 8) & 0xFF00) + data.b);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_RGBColor_SetColor:
            {
                var color = r.GetLong();
                this.RGBA.R = (color >> 16) & 0xFF;
                this.RGBA.G = (color >> 8) & 0xFF;
                this.RGBA.B = color & 0xFF;
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },
    IsIdentical : function(color)
    {
        return color && color.type == COLOR_TYPE_SRGB && color.RGBA.R == this.RGBA.R && color.RGBA.G == this.RGBA.G && color.RGBA.B == this.RGBA.B && color.RGBA.A == this.RGBA.A;
    },

    createDuplicate : function()
    {
        var duplicate = new CRGBColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(obj)
    {
    }
};

function CSchemeColor()
{
    this.type = COLOR_TYPE_SCHEME;
    this.id = 0;
    this.RGBA = {R:0, G:0, B:0, A:255};
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSchemeColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SchemeColor;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setId: function(id)
    {
        History.Add(this, {Type: historyitem_SchemeColor_SetId, oldId: this.id, newId: id});
        this.id = id;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SchemeColor_SetId:
            {
                this.id = data.oldId;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SchemeColor_SetId:
            {
                this.id = data.newId;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_SchemeColor_SetId:
            {
                w.WriteLong(data.newId);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SchemeColor_SetId:
            {
                this.id = r.GetLong();
                break;
            }
        }
    },

    IsIdentical : function(color)
    {
        return color && color.type == COLOR_TYPE_SCHEME && color.id == this.id;
    },
    createDuplicate : function()
    {
        var duplicate = new CSchemeColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if(theme.themeElements.clrScheme)
        {
            if(this.id == phClr)
            {
                this.RGBA = RGBA;
            }
            else
            {
                var clrMap
                if(slide!=null && slide.clrMap!=null)
                {
                    clrMap = slide.clrMap.color_map;
                }
                else if(layout!=null && layout.clrMap!=null)
                {
                    clrMap = layout.clrMap.color_map;
                }
                else if(masterSlide!=null && masterSlide.clrMap!=null)
                {
                    clrMap = masterSlide.clrMap.color_map;
                }
                else
                {
                    clrMap = DEFAULT_COLOR_MAP.color_map;
                }
                if (clrMap[this.id]!=null && theme.themeElements.clrScheme.colors[clrMap[this.id]] != null)
                    this.RGBA = theme.themeElements.clrScheme.colors[clrMap[this.id]].color.RGBA;
                else if (theme.themeElements.clrScheme.colors[this.id] != null)
                    this.RGBA = theme.themeElements.clrScheme.colors[this.id].color.RGBA;
            }
        }
    }
};

    function CUniColor()
{
    this.color = null;
    this.Mods = null;//new CColorModifiers();
    this.RGBA = {R:0, G:0, B:0, A: 255};
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CUniColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_UniColor;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },


    setColor: function(color)
    {
        History.Add(this, {Type: historyitem_UniColor_SetColor, oldColor: this.color, newColor: color});
        this.color = color;
    },

    setMods: function(mods)
    {
        History.Add(this, {Type: historyitem_UniColor_SetMods, oldMods: this.Mods, newMods: mods});
        this.Mods = mods;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_UniColor_SetColor:
            {
                this.color = data.oldColor;
                break;
            }
            case historyitem_UniColor_SetMods:
            {
                this.Mods = data.oldMods;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_UniColor_SetColor:
            {
                this.color = data.oldColor;
                break;
            }
            case historyitem_UniColor_SetMods:
            {
                this.Mods = data.oldMods;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_UniColor_SetColor:
            {
                w.WriteBool(isRealObject(data.newColor));
                if(isRealObject(data.newColor))
                {
                    w.WriteString2(data.newColor.Get_Id());
                }
                break;
            }
            case historyitem_UniColor_SetMods:
            {
                w.WriteBool(isRealObject(data.newMods));
                if(isRealObject(data.newColor))
                {
                    w.WriteString2(data.newMods.Get_Id());
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectsType())
        {
            return;
        }
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_UniColor_SetColor:
            {
                if(r.GetBool())
                {
                    this.color = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.color = null;
                }
                break;
            }
            case historyitem_UniColor_SetMods:
            {
                if(r.GetBool())
                {
                    this.Mods = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.Mods = null;
                }
                break;
            }
        }
    },

    createDuplicate : function()
    {
        var duplicate = new CUniColor();
        if(this.color!=null)
        {
            duplicate.color = this.color.createDuplicate();
        }
        if(this.Mods)
            duplicate.Mods = this.Mods.createDuplicate();

        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    IsIdentical : function(unicolor)
    {
        if(unicolor == null)
        {
            return false;
        }
        if(!this.color.IsIdentical(unicolor.color))
        {
            return false;
        }
        if(!this.Mods.IsIdentical(unicolor.Mods))
        {
            return false;
        }
        return true;
    },

    Calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if (this.color == null)
            return this.RGBA;

        this.color.Calculate(theme, slide, layout, masterSlide, RGBA);

        this.RGBA = {R:this.color.RGBA.R, G:this.color.RGBA.G, B: this.color.RGBA.B, A: this.color.RGBA.A};
        if(this.Mods)
            this.Mods.Apply(this.RGBA);
    },

    compare : function(unicolor)
    {
        if(unicolor == null)
        {
            return null;
        }
        var _ret = new CUniColor();
        if(this.color == null || unicolor.color == null ||
            this.color.type !== unicolor.color.type)
        {
            return _ret;
        }

        switch(this.color.type)
        {
            case COLOR_TYPE_NONE:
            {
                break;
            }
            case COLOR_TYPE_PRST:
            {
                _ret.color = new CPrstColor();
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
            case COLOR_TYPE_SCHEME:
            {
                _ret.color = new CSchemeColor();
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
            case COLOR_TYPE_SRGB:
            {
                _ret.color = new CRGBColor();
                var _RGBA1 = this.color.RGBA;
                var _RGBA2 = this.color.RGBA;
                if(_RGBA1.R === _RGBA2.R
                    && _RGBA1.G === _RGBA2.G
                    && _RGBA1.B === _RGBA2.B)
                {
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                }
                if(_RGBA1.A === _RGBA2.A)
                {
                    _ret.color.RGBA.A = this.color.RGBA.A;
                }

                break;
            }
            case COLOR_TYPE_SYS:
            {
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
        }
        return _ret;
    },

    getCSSColor : function(transparent)
    {
        if (transparent != null)
        {
            var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + ",1)";
            return _css;
        }
        var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + "," + (this.RGBA.A / 255) + ")";
        return _css;
    }
};

function CreateUniColorRGB(r, g, b)
{
    var ret = new CUniColor();
    ret.setColor(new CRGBColor());
    ret.color.setColor(r, g, b);
    return ret;
}

function CreteSolidFillRGB(r, g, b)
{
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    var _uni_color = ret.fill.color;
    _uni_color.setColor(new CRGBColor());
    _uni_color.color.setColor(r, g, b);
    return ret;
}

// -----------------------------

// FILL ------------------------

var FILL_TYPE_NONE      = 0;
var FILL_TYPE_BLIP      = 1;
var FILL_TYPE_NOFILL	= 2;
var FILL_TYPE_SOLID		= 3;
var FILL_TYPE_GRAD		= 4;
var FILL_TYPE_PATT		= 5;

function CSrcRect()
{
    this.l = null;
    this.t = null;
    this.r = null;
    this.b = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSrcRect.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SrcRect;
    },

    setLTRB: function(l, t, r, b)
    {
        History.Add(this, {Type: historyitem_SrcRect_SetLTRB, oldLTRB:{l: this.l, t: this.t, r: this.r, b: this.b}, newLTRB:{l: l, t: t, r: r, b: b}});
        this.l = l;
        this.t = t;
        this.r = r;
        this.b = b;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SrcRect_SetLTRB:
            {
                var oldLTRB = data.oldLTRB;
                this.l = oldLTRB.l;
                this.t = oldLTRB.t;
                this.r = oldLTRB.r;
                this.b = oldLTRB.b;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SrcRect_SetLTRB:
            {
                var newLTRB = data.newLTRB;
                this.l = newLTRB.l;
                this.t = newLTRB.t;
                this.r = newLTRB.r;
                this.b = newLTRB.b;
                break;
            }
        }
    },

    Save_Changes: function()
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_SrcRect_SetLTRB:
            {
                var newLTRB = data.newLTRB;
                var bWriteRect = isRealNumber(newLTRB.l) && isRealNumber(newLTRB.t) && isRealNumber(newLTRB.r) && isRealNumber(newLTRB.b);
                w.WriteBool(bWriteRect);
                if(bWriteRect)
                {
                    w.WriteDouble(newLTRB.l);
                    w.WriteDouble(newLTRB.t);
                    w.WriteDouble(newLTRB.r);
                    w.WriteDouble(newLTRB.b);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SrcRect_SetLTRB:
            {
                if(r.GetBool())
                {
                    this.l = r.GetDouble();
                    this.t = r.GetDouble();
                    this.r = r.GetDouble();
                    this.b = r.GetDouble();
                }
                else
                {
                    this.l = null;
                    this.t = null;
                    this.r = null;
                    this.b = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },
    createDublicate : function()
    {
        var _ret = new CSrcRect();
        _ret.l = this.l;
        _ret.t = this.t;
        _ret.r = this.r;
        _ret.b = this.b;
        return _ret;
    }
};

function CBlipFill()
{
    this.type = FILL_TYPE_BLIP;

    this.RasterImageId = null;
    this.VectorImageBin = null;

    this.srcRect = null;

    this.stretch = null;
    this.tile = null;

    this.rotWithShape = null;
}

CBlipFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_BlipFill;
    },

    setRasterImageId: function(rasterImageId)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetRasterImageId, oldRasterImageId: this.RasterImageId, newRasterImageId: rasterImageId});
        this.RasterImageId = rasterImageId;
    },

    setVectorImageBin: function(vectorImageBin)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetVectorImageBin, oldVectorImageBin: this.VectorImageBin, newVectorImageBin: vectorImageBin});
        this.VectorImageBin = vectorImageBin;
    },

    setSrcRect: function(srcRect)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetSrcRect, oldSrcRect: this.srcRect, newSrcRect: srcRect});
        this.srcRect = srcRect;
    },

    setStretch: function(stretch)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetStretch, oldStretch: this.stretch, newStretch: stretch});
        this.stretch = stretch;
    },

    setTile: function(tile)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetTile, oldTile: this.tile, newTile: tile});
        this.tile = tile;
    },

    setRotWithShape: function(rotWithShape)
    {
        History.Add(this, {Type: historyitem_BlipFill_SetRotWithShape, oldRotWithShape: this.rotWithShape, newRotWidth: rotWithShape});
        this.rotWithShape = rotWithShape;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_BlipFill_SetRasterImageId:
            {
                this.RasterImageId = data.oldRasterImageId;
                break;
            }
            case historyitem_BlipFill_SetVectorImageBin:
            {
                this.VectorImageBin = data.oldVectorImageBin;
                break;
            }

            case historyitem_BlipFill_SetSrcRect:
            {
                this.srcRect = data.oldSrcRect;
                break;
            }

            case historyitem_BlipFill_SetStretch:
            {
                this.stretch = data.oldStretch;
                break;
            }

            case historyitem_BlipFill_SetTile:
            {
                this.tile = data.oldTile;
                break;
            }

            case historyitem_BlipFill_SetRotWithShape:
            {
                this.rotWithShape = data.oldRotWithShape;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_BlipFill_SetRasterImageId:
            {
                this.RasterImageId = data.newRasterImageId;
                break;
            }
            case historyitem_BlipFill_SetVectorImageBin:
            {
                this.VectorImageBin = data.newVectorImageBin;
                break;
            }

            case historyitem_BlipFill_SetSrcRect:
            {
                this.srcRect = data.newSrcRect;
                break;
            }

            case historyitem_BlipFill_SetStretch:
            {
                this.stretch = data.newStretch;
                break;
            }

            case historyitem_BlipFill_SetTile:
            {
                this.tile = data.newTile;
                break;
            }

            case historyitem_BlipFill_SetRotWithShape:
            {
                this.rotWithShape = data.newRotWithShape;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectsType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_BlipFill_SetRasterImageId:
            {
                w.WriteBool(typeof data.newRasterImageId === "string");
                if(typeof data.newRasterImageId === "string")
                {
                    w.WriteString2(data.newRasterImageId)
                }
                break;
            }
            case historyitem_BlipFill_SetVectorImageBin:
            {
                w.WriteBool(typeof this.VectorImageBin === "string");
                if(typeof this.VectorImageBin === "string")
                {
                    w.WriteString2(this.VectorImageBin);
                }
                break;
            }

            case historyitem_BlipFill_SetSrcRect:
            {
                w.WriteBool(isRealObject(data.newSrcRect));
                if(isRealObject(data.newSrcRect))
                {
                    w.WriteString2(data.newSrcRect.Get_Id());
                }
                break;
            }

            case historyitem_BlipFill_SetStretch:
            {
                w.WriteBool(isRealBool(data.newStretch));
                if(isRealBool(data.newStretch))
                {
                    w.WriteBool(data.newStretch);
                }
                break;
            }

            case historyitem_BlipFill_SetTile:
            {
                w.WriteBool(isRealBool(data.newTile));
                if(isRealBool(data.newTile))
                {
                    w.WriteBool(data.newTile);
                }
                break;
            }

            case historyitem_BlipFill_SetRotWithShape:
            {
                w.WriteBool(isRealBool(data.newRotWithShape));
                if(isRealBool(data.newRotWithShape))
                {
                    w.WriteBool(data.newRotWithShape);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_BlipFill_SetRasterImageId:
            {
                if(r.GetBool())
                {
                    this.RasterImageId = r.GetString2();
                }
                else
                {
                    this.RasterImageId = null;
                }
                break;
            }
            case historyitem_BlipFill_SetVectorImageBin:
            {
                if(r.GetBool())
                {
                    this.VectorImageBin = r.GetString2();
                }
                else
                {
                    this.VectorImageBin = null;
                }
                break;
            }

            case historyitem_BlipFill_SetSrcRect:
            {
                if(r.GetBool())
                {
                    this.srcRect = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.srcRect = null;
                }
                break;
            }

            case historyitem_BlipFill_SetStretch:
            {
                if(r.GetBool())
                {
                    this.srcRect = r.GetBool()
                }
                else
                {
                    this.srcRect = null;
                }
                break;
            }

            case historyitem_BlipFill_SetTile:
            {
                if(r.GetBool())
                {
                    this.tile = r.GetBool()
                }
                else
                {
                    this.tile = null;
                }
                break;
            }

            case historyitem_BlipFill_SetRotWithShape:
            {
                if(r.GetBool())
                {
                    this.rotWithShape = r.GetBool()
                }
                else
                {
                    this.rotWithShape = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate : function()
    {
        var duplicate = new CBlipFill();
        duplicate.RasterImageId = this.RasterImageId;
        duplicate.VectorImageBin = this.VectorImageBin;

        duplicate.stretch = this.stretch;
        duplicate.tile = this.tile;

        if (null != this.srcRect)
            duplicate.srcRect = this.srcRect.createDublicate();

        duplicate.rotWithShape = this.rotWithShape;
        return duplicate;
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  FILL_TYPE_BLIP)
        {
            return false;
        }

        if(fill.RasterImageId !=  this.RasterImageId)
        {
            return false;
        }

        /*if(fill.VectorImageBin !=  this.VectorImageBin)
         {
         return false;
         }    */

        if(fill.stretch !=  this.stretch)
        {
            return false;
        }

        if(fill.tile !=  this.tile)
        {
            return false;
        }

        /*
         if(fill.rotWithShape !=  this.rotWithShape)
         {
         return false;
         }
         */
        return true;

    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== FILL_TYPE_BLIP)
        {
            return null;
        }
        var _ret = new CBlipFill();
        if(this.RasterImageId == fill.RasterImageId)
        {
            _ret.RasterImageId = this.RasterImageId;
        }
        if(fill.stretch == this.stretch)
        {
            _ret.stretch = this.stretch;
        }
        if(fill.tile == this.tile)
        {
            _ret.tile = this.tile;
        }
        if(fill.rotWithShape === this.rotWithShape)
        {
            _ret.rotWithShape = this.rotWithShape;
        }
        return _ret;
    }
};

function CSolidFill()
{
    this.type = FILL_TYPE_SOLID;
    this.color = null;
}

CSolidFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SolidFill;
    },

    setColor: function(color)
    {
        History.Add(this, {Type: historyitem_SolidFill_SetColor, oldColor: this.color, newColor: color});
        this.color = color;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SolidFill_SetColor:
            {
                this.color = data.oldColor;
                break;
            }
        }
    },


    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SolidFill_SetColor:
            {
                this.color = data.newColor;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_SolidFill_SetColor:
            {
                w.WriteBool(isRealObject(data.newColor));
                if(isRealObject(data.newColor))
                {
                    w.WriteString2(data.newColor.Get_Id());
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SolidFill_SetColor:
            {
                if(r.GetBool())
                {
                    this.color = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.color = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  FILL_TYPE_SOLID)
        {
            return false;
        }

        return this.color.IsIdentical(fill.color);

    },

    createDuplicate : function()
    {
        var duplicate = new CSolidFill();
        duplicate.color = this.color.createDuplicate();
        return duplicate;
    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== FILL_TYPE_SOLID)
        {
            return null;
        }
        var _ret = new CSolidFill();
        _ret.color = this.color.compare(fill.color);
        return _ret;
    }
};

function CGs()
{
    this.color = null;
    this.pos = 0;
}

CGs.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    getObjectType: function()
    {
        return historyitem_type_Gs;
    },

    setColor: function(color)
    {
        History.Add(this, {Type: historyitem_Gs_SetColor, oldColor: this.color, newColor: color});
        this.color = color;
    },

    setPos: function(pos)
    {
        History.Add(this, {Type: historyitem_Gs_SetPos, oldPos: this.pos, newPos: pos});
        this.pos = pos;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Gs_SetColor:
            {
                this.color = data.oldColor;
                break;
            }
            case historyitem_Gs_SetPos:
            {
                this.pos = data.oldPos;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Gs_SetColor:
            {
                this.color = data.newColor;
                break;
            }
            case historyitem_Gs_SetPos:
            {
                this.pos = data.newPos;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectsType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_Gs_SetColor:
            {
                w.WriteBool(isRealObject(data.newColor));
                if(isRealObject(data.newColor))
                {
                    w.WriteString2(data.newColor.Get_Id());
                }
                break;
            }
            case historyitem_Gs_SetPos:
            {
                w.WriteBool(isRealNumber(data.newPos));
                if(isRealNumber(data.newPos))
                {
                    w.WriteLong(data.newPos);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_Gs_SetColor:
            {
                if(r.GetBool())
                {
                    this.color = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.color = null;
                }
                break;
            }
            case historyitem_Gs_SetPos:
            {
                if(r.GetBool())
                {
                    this.pos = r.GetLong();
                }
                else
                {
                    this.pos = 0;
                }
                break;
            }
        }
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(fill)
    {
        return false;
    },

    createDuplicate : function()
    {
        var duplicate = new CGs();
        duplicate.pos = this.pos;
        duplicate.color = this.color.createDuplicate();
        return duplicate;
    },

    compare: function(gs)
    {
        var compare_unicolor = this.color.compare(gs.color);
        if(!isRealObject(compare_unicolor))
        {
            return null;
        }
        var ret = new CGs();
        ret.color = compare_unicolor;
        ret.pos = gs.pos === this.pos ? this.pos : 0;
        return ret;
    }
};

function GradLin()
{
    this.angle = 5400000;
    this.scale = true;
}
GradLin.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_GradLin;
    },

    setAngle: function(angle)
    {
        History.Add(this, {Type: historyitem_GradLin_SetAngle, oldAngle: this.angle, newAngle: angle});
        this.angle = angle;
    },

    setScale: function(scale)
    {
        History.Add(this, {Type: historyitem_GradLin_SetScale, oldScale: this.scale, newScale: scale});
        this.scale = scale;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradLin_SetAngle:
            {
                this.angle = data.oldAngle;
                break;
            }
            case historyitem_GradLin_SetScale:
            {
                this.scale = data.oldScale;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradLin_SetAngle:
            {
                this.angle = data.newAngle;
                break;
            }
            case historyitem_GradLin_SetScale:
            {
                this.scale = data.newScale;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_GradLin_SetAngle:
            {
                w.WriteBool(isRealNumber(data.newAngle));
                if(isRealNumber(data.newAngle))
                {
                    w.WriteLong(data.newAngle);
                }
                break;
            }
            case historyitem_GradLin_SetScale:
            {
                w.WriteBool(isRealBool(data.newScale));
                if(isRealBool(data.newScale))
                {
                    w.WriteBool(data.newScale);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_GradLin_SetAngle:
            {
                if(r.GetBool())
                {
                    this.angle = r.GetLong();
                }
                else
                {
                    this.angle = null;
                }
                break;
            }
            case historyitem_GradLin_SetScale:
            {
                if(r.GetBool())
                {
                    this.scale = r.GetBool();
                }
                else
                {
                    this.scale = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(lin)
    {
        if (this.angle != lin.angle)
            return false;
        if (this.scale != lin.scale)
            return false;

        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new GradLin();
        duplicate.angle = this.angle;
        duplicate.scale = this.scale;
        return duplicate;
    },

    compare : function(lin)
    {
        return null;
    }
};

function GradPath()
{
    this.path = 0;
    this.rect = null;
}
GradPath.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_GradPath;
    },

    setPath: function(path)
    {
        History.Add(this, {Type: historyitem_GradPath_SetPath, oldPath: this.path, newPath: path});
        this.path = path;
    },

    setRect: function(rect)
    {
        History.Add(this, {Type: historyitem_GradPath_SetRect, oldRect: this.rect, newRect: rect});
        this.rect = rect;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradPath_SetPath:
            {
                this.path = data.oldPath;
                break;
            }
            case historyitem_GradPath_SetRect:
            {
                this.rect = data.oldRect;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradPath_SetPath:
            {
                this.path = data.newPath;
                break;
            }
            case historyitem_GradPath_SetRect:
            {
                this.rect = data.newRect;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_GradPath_SetPath:
            {
                w.WriteBool(isRealNumber(data.newPath));
                if(isRealNumber(data.newPath))
                {
                    w.WriteLong(data.newPath);
                }
                break;
            }
            case historyitem_GradPath_SetRect:
            {
                w.WriteBool(isRealObject(data.newRect));
                if(isRealObject(data.newRect))
                {
                    w.WriteString2(data.newRect.Get_Id());
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== this.getObjectType())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_GradPath_SetPath:
            {
                if(r.GetBool())
                {
                    this.path = r.GetLong();
                }
                else
                {
                    this.path = null;
                }
                break;
            }
            case historyitem_GradPath_SetRect:
            {
                if(r.GetBool())
                {
                    this.rect = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.rect = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(path)
    {
        if (this.path != path.path)
            return false;
        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new GradPath();
        duplicate.path = this.path;
        return duplicate;
    },

    compare : function(path)
    {
        return null;
    }
};

function CGradFill()
{
    this.type = FILL_TYPE_GRAD;
    // пока просто front color
    this.colors = [];

    this.lin = null;
    this.path = null;
}

CGradFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_GradFill;
    },

    addColor: function(color)
    {
        History.Add(this, {Type: historyitem_GradFill_AddColor, color: color});
        this.colors.push(color);
    },

    setLin: function(lin)
    {
        History.Add(this, {Type: historyitem_GradFill_SetLin, oldLin: this.lin, newLin: lin});
        this.lin = lin;
    },

    setPath: function(path)
    {
        History.Add(this, {Type: historyitem_GradFill_SetPath, oldPath: this.path, newPath: path});
        this.path = path;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradFill_AddColor:
            {
                if(isRealObject(data.color))
                {
                    for(var  i = this.colors.length - 1; i > -1; --i)
                    {
                        if(this.colors[i].Get_Id() === data.color.Get_Id())
                        {
                            this.colors.splice(i, 1);
                            break;
                        }
                    }
                }
                break;
            }
            case historyitem_GradFill_SetLin:
            {
                this.lin = data.oldLin;
                break;
            }

            case historyitem_GradFill_SetPath:
            {
                this.path = data.oldPath;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GradFill_AddColor:
            {
                if(isRealObject(data.color))
                {
                    this.colors.push(data.color);
                }
                break;
            }
            case historyitem_GradFill_SetLin:
            {
                this.lin = data.newLin;
                break;
            }

            case historyitem_GradFill_SetPath:
            {
                this.path = data.newPath;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_GradFill_AddColor:
            {
                w.WriteBool(isRealObject(data.color));
                if(isRealObject(data.color))
                {
                    w.WriteString2(data.color.Get_Id());
                }
                break;
            }
            case historyitem_GradFill_SetLin:
            {
                w.WriteBool(isRealObject(data.newLin));
                if(isRealObject(data.newLin))
                {
                    w.WriteString2(data.newLin.Get_Id());
                }
                break;
            }

            case historyitem_GradFill_SetPath:
            {
                w.WriteBool(isRealObject(data.newPath));
                if(isRealObject(data.newPath))
                {
                    w.WriteString2(data.newPath.Get_Id());
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  FILL_TYPE_GRAD)
        {
            return false;
        }
        if(fill.colors.length!= this.colors.length)
        {
            return false;
        }
        for(var i = 0; i < this.colors.length; ++i)
        {
            if(!this.colors[i].IsIdentical(fill.colors[i]))
            {
                return false;
            }
        }
        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new CGradFill();
        for(var i=0; i<this.colors.length; ++i)
        {
            duplicate.colors[i] = this.colors[i].createDuplicate();
        }

        if (this.lin)
            duplicate.lin = this.lin.createDuplicate();

        if (this.path)
            duplicate.path = this.path.createDuplicate();

        return duplicate;
    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== FILL_TYPE_GRAD)
        {
            return null;
        }
        var _ret  = new CGradFill();
        if(this.lin == null || fill.lin == null)
            _ret.lin = null;
        else
        {
            _ret.lin = new GradLin();
            _ret.lin.angle = this.lin && this.lin.angle === fill.lin.angle ? fill.lin.angle : 5400000;
            _ret.lin.scale = this.lin && this.lin.scale === fill.lin.scale ? fill.lin.scale : true;
        }
        if(this.path == null || fill.path == null)
        {
            _ret.path = null;
        }
        else
        {
            _ret.path = new GradPath();
        }

        if(this.colors.length === fill.colors.length )
        {
            for(var i = 0;  i < this.colors.length; ++i )
            {
                var compare_unicolor = this.colors[i].compare(fill.colors[i]);
                if(!isRealObject(compare_unicolor))
                {
                    break;
                }
                _ret.colors[i] = compare_unicolor;
            }
        }
        return _ret;
    }
};

function CPattFill()
{
    this.type = FILL_TYPE_PATT;
    this.ftype = 0;
    this.fgClr = null;//new CUniColor();
    this.bgClr = null;//new CUniColor();
}

CPattFill.prototype =
{
    getObjectType: function()
    {
        return historyitem_type_PathFill;
    },

    setFType: function(fType)
    {
        History.Add(this, {Type: historyitem_PathFill_SetFType, oldFType: this.ftype, newFType: fType});
        this.ftype = fType;
    },

    setFgColor: function(fgClr)
    {
        History.Add(this, {Type: historyitem_PathFill_SetFgClr, oldFgClr: this.fgClr, newFgClr: fgClr});
        this.fgClr = fgClr;
    },

    setBgColor: function(bgClr)
    {
        History.Add(this, {Type: historyitem_PathFill_SetBgClr, oldBgClr: this.bgClr, newBgClr: bgClr});
        this.bgClr = bgClr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PathFill_SetFType:
            {
                this.ftype = data.oldFType;
                break;
            }

            case historyitem_PathFill_SetFgClr:
            {
                this.fgClr = data.oldFgClr;
                break;
            }
            case historyitem_PathFill_SetBgClr:
            {
                this.bgClr = data.oldBgClr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PathFill_SetFType:
            {
                this.ftype = data.newFType;
                break;
            }

            case historyitem_PathFill_SetFgClr:
            {
                this.fgClr = data.newFgClr;
                break;
            }
            case historyitem_PathFill_SetBgClr:
            {
                this.bgClr = data.newBgClr;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_PathFill_SetFType:
            {
                w.WriteBool(isRealNumber(data.newFType));
                if(isRealNumber(data.newFType))
                {
                    w.WriteLong(data.newFType);
                }
                this.ftype = data.newFType;
                break;
            }

            case historyitem_PathFill_SetFgClr:
            {
                this.fgClr = data.newFgClr;
                break;
            }
            case historyitem_PathFill_SetBgClr:
            {
                this.bgClr = data.newBgClr;
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_PathFill_SetFType:
            {
                if(r.GetBool())
                {
                    this.ftype= r.GetLong();
                }
                else
                {
                    this.ftype = null
                }
                break;
            }

            case historyitem_PathFill_SetFgClr:
            {
                if(r.GetBool())
                {
                    this.fgClr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.fgClr = null;
                }
                break;
            }
            case historyitem_PathFill_SetBgClr:
            {
                if(r.GetBool())
                {
                    this.bgClr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.bgClr = null;
                }
                break;
            }
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  FILL_TYPE_PATT && this.ftype!=fill.ftype)
        {
            return false;
        }

        return this.fgClr.IsIdentical(fill.fgClr) && this.bgClr.IsIdentical(fill.bgClr);
    },

    createDuplicate : function()
    {
        var duplicate = new CPattFill();
        duplicate.ftype = this.ftype;
        duplicate.fgClr = this.fgClr.createDuplicate();
        duplicate.bgClr = this.bgClr.createDuplicate();
        return duplicate;
    },
    compare : function(fill)
    {
        if(fill == null)
        {
            return null;
        }
        if(fill.type !== FILL_TYPE_PATT)
        {
            return null;
        }
        var _ret = new CPattFill();
        if(fill.ftype == this.ftype)
        {
            _ret.ftype = this.ftype;
        }
        _ret.fgClr = this.fgClr.compare(fill.fgClr);
        _ret.bgClr = this.bgClr.compare(fill.bgClr);
        return _ret;
    }
};

function CNoFill()
{
    this.type = FILL_TYPE_NOFILL;
}

CNoFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_NoFill;
    },

    Undo: function()
    {},

    Redo: function()
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate : function()
    {
        return new CNoFill();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        return fill.type !=  FILL_TYPE_NOFILL;
    },
    compare : function(nofill)
    {
        if(nofill == null)
        {
            return null;
        }
        if(nofill.type === this.type)
        {
            return new CNoFill();
        }
        return null;
    }
}


function CreateBlackRGBUnifill()
{
	var ret = new CUniFill();
	ret.setFill(new CSolidFill());
	ret.fill.setColor(new CUniColor());
	ret.fill.color.setColor(new CRGBColor());
	ret.fill.color.color.setColor(0, 0, 0);
	return ret;
}

function CUniFill()
{
    this.fill = null;
    this.transparent = null;
}

CUniFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_UniFill;
    },

    setFill: function(fill)
    {
        History.Add(this, {Type: historyitem_UniFill_SetFill, oldFill: this.fill, newFill: fill});
        this.fill = fill;
    },

    setTransparent: function(transparent)
    {
        History.Add(this, {Type: historyitem_UniFill_SetTransparent, oldTransparent: this.fill, newTransparent: fill});
        this.transparent = transparent;
    },

	Set_FromObject: function(o)
	{
		//TODO
	},
	
    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_UniFill_SetFill:
            {
                this.fill = data.oldFill;
                break;
            }
            case historyitem_UniFill_SetTransparent:
            {
                this.transparent = data.oldTransparent;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_UniFill_SetFill:
            {
                this.fill = data.newFill;
                break;
            }
            case historyitem_UniFill_SetTransparent:
            {
                this.transparent = data.newTransparent;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_UniFill_SetFill:
            {
                w.WriteBool(isRealObject(data.newFill));
                if(isRealObject(data.newFill))
                {
                    w.WriteString2(data.newFill.Get_Id());
                }
                break;
            }
            case historyitem_UniFill_SetTransparent:
            {
                w.WriteBool(isRealNumber(data.newTransparent));
                if(isRealNumber(data.newTransparent))
                {
                    w.WriteLong(data.newTransparent);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_UniFill_SetFill:
            {

                if(r.GetBool())
                {
                    this.fill = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.fill = null;
                }
                break;
            }
            case historyitem_UniFill_SetTransparent:
            {
                if(r.GetBool())
                {
                    this.transparent = r.GetLong();
                }
                else
                {
                    this.transparent = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },
	
	Write_ToBinary: function(w)
	{},
	
	Read_FromBinary: function()
	{},



    calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if(this.fill )
        {
            if(this.fill.color)
            {
                this.fill.color.Calculate(theme, slide, layout, masterSlide, RGBA);
            }
            if(this.fill.colors)
            {
                for(var i  = 0; i <this.fill.colors.length; ++i )
                {
                    this.fill.colors[i].color.Calculate(theme, slide, layout, masterSlide, RGBA);
                }
            }
            if (this.fill.fgClr)
                this.fill.fgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
            if (this.fill.bgClr)
                this.fill.bgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
        }
    },

    getRGBAColor : function()
    {
        if (this.fill)
        {
            if (this.fill.type == FILL_TYPE_SOLID)
            {
                return this.fill.color.RGBA;
            }
            if (this.fill.type == FILL_TYPE_GRAD)
            {
                var RGBA = {R:0, G:0, B:0, A:255};
                var _colors = this.fill.colors;
                var _len = _colors.length;

                if (0 == _len)
                    return RGBA;

                for (var i = 0; i < _len; i++)
                {
                    RGBA.R += _colors[i].color.RGBA.R;
                    RGBA.G += _colors[i].color.RGBA.G;
                    RGBA.B += _colors[i].color.RGBA.B;
                }

                RGBA.R = (RGBA.R / _len) >> 0;
                RGBA.G = (RGBA.G / _len) >> 0;
                RGBA.B = (RGBA.B / _len) >> 0;

                return RGBA;
            }
            if (this.fill.type == FILL_TYPE_PATT)
            {
                return this.fill.fgClr.RGBA;
            }
        }
        return {R:0, G:0, B:0, A:255};
    },

    createDuplicate : function()
    {
        var duplicate = new CUniFill();
        if(this.fill != null)
        {
            duplicate.fill = this.fill.createDuplicate();
        }
        duplicate.transparent = this.transparent;
        return duplicate;
    },

    merge : function(unifill)
    {
        if(unifill )
        {
            if(unifill.fill!=null)
            {
                this.fill = unifill.fill.createDuplicate();
            }
            if(unifill.transparent != null)
            {
                this.transparent = unifill.transparent;
            }
        }
    },

    IsIdentical : function(unifill)
    {
        if(unifill == null)
        {
            return false;
        }
        if(this.fill == null && unifill.fill == null)
        {
            return true;
        }
        if(this.fill!=null)
        {
            return this.fill.IsIdentical(unifill.fill);
        }
        else
        {
            return false;
        }
    },

    compare : function(unifill)
    {
        if(unifill == null)
        {
            return null;
        }
        var _ret = new CUniFill();
        if(!(this.fill == null || unifill.fill == null))
        {
            if(this.fill.compare)
            {
                _ret.fill = this.fill.compare(unifill.fill);
            }
        }
        return _ret.fill;
    }
};

function CompareUniFill(unifill_1, unifill_2)
{

    if(unifill_1 == null || unifill_2 == null)
    {
        return null;
    }

    var _ret = new CUniFill();

    if(!(unifill_1.transparent === null || unifill_2.transparent === null
        || unifill_1.transparent !== unifill_2.transparent))
    {
        _ret.transparent = unifill_1.transparent;
    }

    if(unifill_1.fill == null || unifill_2.fill == null
        || unifill_1.fill.type != unifill_2.fill.type)
    {
        return _ret;
    }
    _ret.fill = unifill_1.compare(unifill_2);
    return _ret;
}
// -----------------------------

function CompareShapeProperties(shapeProp1, shapeProp2)
{
    var _result_shape_prop = {};
    if(shapeProp1.type === shapeProp2.type)
    {
        _result_shape_prop.type = shapeProp1.type;
    }
    else
    {
        _result_shape_prop.type = null;
    }

    if(shapeProp1.h === shapeProp2.h)
    {
        _result_shape_prop.h = shapeProp1.h;
    }
    else
    {
        _result_shape_prop.h = null;
    }

    if(shapeProp1.w === shapeProp2.w)
    {
        _result_shape_prop.w = shapeProp1.w;
    }
    else
    {
        _result_shape_prop.w = null;
    }

    if(shapeProp1.stroke === null || shapeProp2.stroke === null)
    {
        _result_shape_prop.stroke = null;
    }
    else
    {
        _result_shape_prop.stroke = shapeProp1.stroke.compare(shapeProp2.stroke)
    }

    if(shapeProp1.verticalTextAlign === shapeProp2.verticalTextAlign)
    {
        _result_shape_prop.verticalTextAlign = shapeProp1.verticalTextAlign;
    }
    else
    {
        _result_shape_prop.verticalTextAlign = null;
    }

    if(shapeProp1.canChangeArrows !== true || shapeProp2.canChangeArrows !== true)
        _result_shape_prop.canChangeArrows = false;
    else
        _result_shape_prop.canChangeArrows = true;

    _result_shape_prop.fill = CompareUniFill(shapeProp1.fill, shapeProp2.fill);
    _result_shape_prop.IsLocked = shapeProp1.IsLocked === true || shapeProp2.IsLocked === true;
    if(isRealObject(shapeProp1.paddings) && isRealObject(shapeProp2.paddings))
    {
        _result_shape_prop.paddings = new CPaddings();
        _result_shape_prop.paddings.Left = isRealNumber(shapeProp1.paddings.Left) ? (shapeProp1.paddings.Left === shapeProp2.paddings.Left ? shapeProp1.paddings.Left : undefined) : undefined;
        _result_shape_prop.paddings.Top = isRealNumber(shapeProp1.paddings.Top) ? (shapeProp1.paddings.Top === shapeProp2.paddings.Top ? shapeProp1.paddings.Top : undefined) : undefined;
        _result_shape_prop.paddings.Right = isRealNumber(shapeProp1.paddings.Right) ? (shapeProp1.paddings.Right === shapeProp2.paddings.Right ? shapeProp1.paddings.Right : undefined) : undefined;
        _result_shape_prop.paddings.Bottom = isRealNumber(shapeProp1.paddings.Bottom) ? (shapeProp1.paddings.Bottom === shapeProp2.paddings.Bottom ? shapeProp1.paddings.Bottom : undefined) : undefined;
    }
    _result_shape_prop.canFill = shapeProp1.canFill === true || shapeProp2.canFill === true;
    return _result_shape_prop;
}

// LN --------------------------
// размеры стрелок;
var lg=500,  mid=300, sm=200;
//типы стрелок
var ar_arrow=0, ar_diamond=1, ar_none=2, ar_oval=3, ar_stealth=4, ar_triangle=5;

var LineEndType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};
var LineEndSize = {
    Large: 0,
    Mid: 1,
    Small: 2
};

function EndArrow()
{
    this.type = null;
    this.len = null;
    this.w = null;


    this.compare = function(end_arrow)
    {
        if(end_arrow == null)
        {
            return null;
        }
        var _ret = new EndArrow();
        if(this.type === end_arrow.type)
        {
            _ret.type = this.type;
        }
        if(this.len === end_arrow.len)
        {
            _ret.len = this.len;
        }
        if(this.w === end_arrow)
        {
            _ret.w = this.w;
        }
        return _ret;
    };

    this.createDuplicate = function()
    {
        var duplicate =  new EndArrow();
        duplicate.type = this.type;
        duplicate.len = this.len;
        duplicate.w = this.w;
        return duplicate;
    };

    this.IsIdentical= function(arrow)
    {
        return arrow && arrow.type == this.type &&  arrow.len == this.len && arrow.w  == this.w;
    };

    this.GetWidth = function(size)
    {
        if (null == this.w)
            return size * 3;
        switch (this.w)
        {
            case LineEndSize.Large:
                return 5 * size;
            case LineEndSize.Small:
                return 2 * size;
            default:
                break;
        }
        return 3 * size;
    };
    this.GetLen = function(size)
    {
        if (null == this.len)
            return size * 3;
        switch (this.len)
        {
            case LineEndSize.Large:
                return 5 * size;
            case LineEndSize.Small:
                return 2 * size;
            default:
                break;
        }
        return 3 * size;
    };
}



var LineJoinType = {
    Empty : 0,
    Round : 1,
    Bevel : 2,
    Miter : 3
};


EndArrow.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_EndArrow;
    },

    setType: function(type)
    {
        History.Add(this, {Type:historyitem_EndArrow_SetType, oldType: this.type, newType: type});
        this.type = type;
    },

    setLen: function(len)
    {
        History.Add(this, {Type:historyitem_EndArrow_SetLen, oldLen: this.len, newLen: len});
        this.len = len;
    },


    setW: function(w)
    {
        History.Add(this, {Type:historyitem_EndArrow_SetW, oldW: this.w, newW: w});
        this.w = w;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_EndArrow_SetType:
            {
                this.type = data.oldType;
                break;
            }
            case historyitem_EndArrow_SetLen:
            {
                this.len = data.oldLen;
                break;
            }
            case historyitem_EndArrow_SetW:
            {
                this.len = data.oldW;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_EndArrow_SetType:
            {
                this.type = data.newType;
                break;
            }
            case historyitem_EndArrow_SetLen:
            {
                this.len = data.newLen;
                break;
            }
            case historyitem_EndArrow_SetW:
            {
                this.w = data.newW;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_EndArrow_SetType:
            {
                w.WriteBool(isRealNumber(data.newType));
                if(isRealNumber(data.newType))
                {
                    w.WriteLong(data.newType);
                }
                break;
            }
            case historyitem_EndArrow_SetLen:
            {
                w.WriteBool(isRealNumber(data.newLen));
                if(isRealNumber(data.newLen))
                {
                    w.WriteLong(data.newLen);
                }
                break;
            }
            case historyitem_EndArrow_SetW:
            {
                w.WriteBool(isRealNumber(data.newW));
                if(isRealNumber(data.newW))
                {
                    w.WriteLong(data.newW);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_EndArrow_SetType:
            {
                if(r.GetBool())
                {
                    this.type = r.GetLong();
                }
                else
                {
                    this.type = null;
                }
                break;
            }
            case historyitem_EndArrow_SetLen:
            {
                if(r.GetBool())
                {
                    this.len = r.GetLong();
                }
                else
                {
                    this.len = null;
                }
                break;
            }
            case historyitem_EndArrow_SetW:
            {
                if(r.GetLong())
                {
                    this.w = r.GetLong();
                }
                else
                {
                    this.w = null;
                }
                break;
            }
        }
    }
};

function ConvertJoinAggType(_type)
{
    switch (_type)
    {
        case LineJoinType.Round:
            return 2;
        case LineJoinType.Bevel:
            return 1;
        case LineJoinType.Miter:
            return 0;
        default:
            break;
    }
    return 2;
}

function LineJoin()
{
    this.type = null;
    this.limit = null;


    this.createDuplicate = function()
    {
        var duplicate =  new LineJoin();
        duplicate.type = this.type;
        duplicate.limit = this.limit;
        return duplicate;
    }
}

LineJoin.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_LineJoin;
    },

    setType: function(type)
    {
        History.Add(this, {Type:historyitem_LineJoin_SetType, oldType: this.type, newType: type});
        this.type = type;
    },

    setLimit: function(limit)
    {
        History.Add(this, {Type:historyitem_LineJoin_SetLimit, oldLimit: this.limit, newLimit: limit});
        this.limit = limit;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_LineJoin_SetType:
            {
                this.type = data.oldType;
                break;
            }
            case historyitem_LineJoin_SetLimit:
            {
                this.limit = data.oldLimit;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_LineJoin_SetType:
            {
                this.type = data.newType;
                break;
            }
            case historyitem_LineJoin_SetLimit:
            {
                this.limit = data.newLimit;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_LineJoin_SetType:
            {
                w.WriteBool(isRealNumber(data.newType));
                if(isRealNumber(data.newType))
                {
                    w.WriteLong(data.newType);
                }
                break;
            }
            case historyitem_LineJoin_SetLimit:
            {
                w.WriteBool(isRealNumber(data.newLimit));
                if(isRealNumber(data.newLimit))
                {
                    w.WriteLong(data.newLimit);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_LineJoin_SetType:
            {
                if(r.GetBool())
                {
                    this.type = r.GetLong();
                }
                else
                {
                    this.type = null;
                }
                break;
            }
            case historyitem_LineJoin_SetLimit:
            {
                if(r.GetBool())
                {
                    this.limit = r.GetLong();
                }
                else
                {
                    this.limit = null;
                }
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CLn()
{
    this.Fill = null;//new CUniFill();
    this.prstDash = null;

    this.Join = null;
    this.headEnd = null;
    this.tailEnd = null;

    this.algn = null;
    this.cap = null;
    this.cmpd = null;
    this.w = null;


    this.compare = function(line)
    {
        if(line == null)
        {
            return null;
        }
        var _ret = new CLn();
        if(this.Fill != null)
        {
            _ret.Fill = CompareUniFill(this.Fill, line.Fill);
        }
        if(this.prstDash === line.prstDash)
        {
            _ret.prstDash = this.prstDash;
        }
        if(this.Join === line.Join)
        {
            _ret.Join = this.Join;
        }
        if(this.tailEnd != null)
        {
            _ret.tailEnd = this.tailEnd.compare(line.tailEnd);
        }
        if(this.headEnd != null)
        {
            _ret.headEnd = this.headEnd.compare(line.headEnd);
        }

        if(this.algn === line.algn)
        {
            _ret.algn = this.algn;
        }
        if(this.cap === line.cap)
        {
            _ret.cap = this.cap;
        }
        if(this.cmpd === line.cmpd)
        {
            _ret.cmpd = this.cmpd;
        }
        if(this.w === line.w)
        {
            _ret.w = this.w;
        }
        return _ret;
    };

    this.merge =  function(ln)
    {
        if(ln == null)
        {
            return;
        }
        if(ln.Fill != null && ln.Fill.fill!= null)
        {
            this.Fill = ln.Fill.createDuplicate();
        }

        if(ln.prstDash != null)
        {
            this.prstDash = ln.prstDash;
        }

        if(ln.Join != null)
        {
            this.Join = ln.Join.createDuplicate();
        }

        if(ln.headEnd != null)
        {
            this.headEnd = ln.headEnd.createDuplicate();
        }

        if(ln.tailEnd != null)
        {
            this.tailEnd = ln.tailEnd.createDuplicate();
        }

        if(ln.algn != null)
        {
            this.algn = ln.algn;
        }

        if(ln.cap != null)
        {
            this.cap = ln.cap;
        }

        if(ln.cmpd != null)
        {
            this.cmpd = ln.cmpd;
        }

        if(ln.w != null)
        {
            this.w = ln.w;
        }
    };
    this.calculate = function(theme, slide, layout, master, RGBA)
    {
        if(isRealObject(this.Fill))
        {
            this.Fill.calculate(theme, slide, layout, master, RGBA);
        }
    };

    this.createDuplicate =  function()
    {
        var duplicate = new CLn();

        if (null != this.Fill)
        {
            duplicate.Fill = this.Fill.createDuplicate();
        }

        duplicate.prstDash = this.prstDash;
        duplicate.Join = this.Join;
        if(this.headEnd!=null)
        {
            duplicate.headEnd = this.headEnd.createDuplicate();
        }

        if(this.tailEnd!=null)
        {
            duplicate.tailEnd = this.tailEnd.createDuplicate();
        }

        duplicate.algn = this.algn;
        duplicate.cap = this.cap;
        duplicate.cmpd = this.cmpd;
        duplicate.w = this.w;
        return duplicate;
    }

    this.IsIdentical = function(ln)
    {
        return ln && (this.Fill == null ? ln.Fill == null : this.Fill.IsIdentical(ln.Fill) )&& this.Join == ln.Join
            && (this.headEnd == null ? ln.headEnd == null : this.headEnd.IsIdentical(ln.headEnd) )
            && (this.tailEnd == null ? ln.tailEnd == null : this.tailEnd.IsIdentical(ln.headEnd)) &&
            this.algn == ln.algn && this.cap == ln.cap && this.cmpd == ln.cmpd && this.w== ln.w;
    }
}


CLn.prototype =
{
    getObjectType: function()
    {
        return historyitem_type_Ln;
    },


    setFill: function(fill)
    {
        History.Add(this, {Type:historyitem_Ln_SetFill, oldFill: this.Fill, newFill: fill});
        this.Fill = fill;
    },

    setPrstDash: function(prstDash)
    {
        History.Add(this, {Type:historyitem_Ln_SetPrstDash, oldPrstDash: this.prstDash, newPrstDash: prstDash});
        this.prstDash = prstDash;
    },

    setJoin: function(join)
    {
        History.Add(this, {Type:historyitem_Ln_SetJoin, oldJoin: this.Join, newJoin: join});
        this.Join = join;
    },

    setHeadEnd: function(headEnd)
    {
        History.Add(this, {Type:historyitem_Ln_SetHeadEnd, oldHeadEnd: this.headEnd, newHeadEnd: headEnd});
        this.headEnd = headEnd;
    },

    setTailEnd: function(tailEnd)
    {
        History.Add(this, {Type:historyitem_Ln_SetTailEnd, oldTailEnd: this.tailEnd, newTailEnd: tailEnd});
        this.tailEnd = tailEnd;
    },

    setAlgn: function(algn)
    {
        History.Add(this, {Type:historyitem_Ln_SetAlgn, oldAlgn: this.algn, newAlgn: algn});
        this.algn = algn;
    },

    setCap: function(cap)
    {
        History.Add(this, {Type:historyitem_Ln_SetCap, oldCap: this.cap, newCap: cap});
        this.cap = cap;
    },

    setCmpd: function(cmpd)
    {
        History.Add(this, {Type:historyitem_Ln_SetCmpd, oldCmpd: this.cmpd, newCmpd: cmpd});
        this.cmpd = cmpd;
    },
    setW: function(w)
    {
        History.Add(this, {Type:historyitem_Ln_SetW, oldW: this.w, newW: w});
        this.w = w;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Ln_SetFill:
            {
                this.Fill = data.oldFill;
                break;
            }
            case historyitem_Ln_SetPrstDash:
            {
                this.prstDash = data.oldPrstDash;
                break;
            }
            case historyitem_Ln_SetJoin:
            {
                this.Join = data.oldJoin;
                break;
            }
            case historyitem_Ln_SetHeadEnd:
            {
                this.headEnd = data.oldHeadEnd;
                break;
            }
            case historyitem_Ln_SetTailEnd:
            {
                this.tailEnd = data.oldTailEnd;
                break;
            }
            case historyitem_Ln_SetAlgn:
            {
                this.algn = dat.oldAlgn;
                break;
            }
            case historyitem_Ln_SetCap:
            {
                this.cap = data.oldCap;
                break;
            }
            case historyitem_Ln_SetCmpd:
            {
                this.cmpd = data.oldCmpd;
                break;
            }
            case historyitem_Ln_SetW:
            {
                this.w = data.oldW;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Ln_SetFill:
            {
                this.Fill = data.newFill;
                break;
            }
            case historyitem_Ln_SetPrstDash:
            {
                this.prstDash = data.newPrstDash;
                break;
            }
            case historyitem_Ln_SetJoin:
            {
                this.Join = data.newJoin;
                break;
            }
            case historyitem_Ln_SetHeadEnd:
            {
                this.headEnd = data.newHeadEnd;
                break;
            }
            case historyitem_Ln_SetTailEnd:
            {
                this.tailEnd = data.newTailEnd;
                break;
            }
            case historyitem_Ln_SetAlgn:
            {
                this.algn = dat.newAlgn;
                break;
            }
            case historyitem_Ln_SetCap:
            {
                this.cap = data.newCap;
                break;
            }
            case historyitem_Ln_SetCmpd:
            {
                this.cmpd = data.newCmpd;
                break;
            }
            case historyitem_Ln_SetW:
            {
                this.w = data.newW;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_Ln_SetFill:
            {
                w.WriteBool(isRealObject(data.newFill));
                if(isRealObject(data.newFill))
                {
                    w.WriteString2(data.newFill.Get_Id());
                }
                break;
            }
            case historyitem_Ln_SetPrstDash:
            {
                w.WriteBool(isRealNumber(data.newPrstDash));
                if(isRealNumber(data.newPrstDash))
                {
                    w.WriteLong(data.newPrstDash);
                }
                break;
            }
            case historyitem_Ln_SetJoin:
            {
                w.WriteBool(isRealNumber(data.newJoin));
                if(isRealNumber(data.newJoin))
                {
                    w.WriteLong(data.newJoin);
                }
                break;
            }
            case historyitem_Ln_SetHeadEnd:
            {
                w.WriteBool(isRealObject(data.newHeadEnd));
                if(isRealObject(data.newHeadEnd))
                {
                    w.WriteString2(data.newHeadEnd.Get_Id());
                }
                break;
            }
            case historyitem_Ln_SetTailEnd:
            {
                w.WriteBool(isRealObject(data.newTailEnd));
                if(isRealObject(data.newTailEnd))
                {
                    w.WriteString2(data.newTailEnd.Get_Id());
                }
                break;
            }
            case historyitem_Ln_SetAlgn:
            {
                w.WriteBool(isRealNumber(data.newAlgn));
                if(isRealNumber(data.newAlgn))
                {
                    w.WriteLong(data.newAlgn);
                }
                break;
            }
            case historyitem_Ln_SetCap:
            {
                w.WriteBool(isRealNumber(data.newCap));
                if(isRealNumber(data.newCap))
                {
                    w.WriteLong(data.newCap);
                }
                break;
            }
            case historyitem_Ln_SetCmpd:
            {
                w.WriteBool(isRealNumber(data.newCmpd));
                if(isRealNumber(data.newCmpd))
                {
                    w.WriteLong(data.newCmpd);
                }
                break;
            }
            case historyitem_Ln_SetW:
            {
                w.WriteBool(isRealNumber(data.newW));
                if(isRealNumber(data.newW))
                {
                    w.WriteLong(data.newW);
                }
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_Ln_SetFill:
            {
                if(r.GetBool())
                {
                    this.Fill = g_oTableId.Get_ById(r.Get_String2());
                }
                else
                {
                    this.Fill = null;
                }
                break;
            }
            case historyitem_Ln_SetPrstDash:
            {
                if(r.GetBool())
                {
                    this.prstDash = r.GetLong();
                }
                else
                {
                    this.prstDash = null;
                }
                break;
            }
            case historyitem_Ln_SetJoin:
            {
                if(r.GetBool())
                {
                    this.Join = r.GetLong();
                }
                else
                {
                    this.Join = null;
                }
                break;
            }
            case historyitem_Ln_SetHeadEnd:
            {
                if(r.GetBool())
                {
                    this.headEnd = r.GetLong();
                }
                else
                {
                    this.headEnd = null;
                }
                break;
            }
            case historyitem_Ln_SetTailEnd:
            {
                if(r.GetBool())
                {
                    this.tailEnd = r.GetLong();
                }
                else
                {
                    this.tailEnd = null;
                }
                break;
            }
            case historyitem_Ln_SetAlgn:
            {
                if(r.GetBool())
                {
                    this.algn = r.GetLong();
                }
                else
                {
                    this.algn = null;
                }
                break;
            }
            case historyitem_Ln_SetCap:
            {
                if(r.GetBool())
                {
                    this.cap = r.GetLong();
                }
                else
                {
                    this.cap = null;
                }
                break;
            }
            case historyitem_Ln_SetCmpd:
            {
                if(r.GetBool())
                {
                    this.cmpd = r.GetLong();
                }
                else
                {
                    this.cmpd = null;
                }
                break;
            }
            case historyitem_Ln_SetW:
            {
                if(r.GetBool())
                {
                    this.w = r.GetLong();
                }
                else
                {
                    this.w = null;
                }
                break;
            }
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
}

// -----------------------------

// SHAPE ----------------------------

function DefaultShapeDefinition()
{
    this.spPr = new CSpPr();
    this.bodyPr = new CBodyPr();
    this.lstStyle = new CTextStyle();
    this.style = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

DefaultShapeDefinition.prototype=
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_DefaultShapeDefinition;
    },

    setSpPr: function(spPr)
    {
        History.Add(this, {Type: historyitem_DefaultShapeDefinition_SetSpPr, oldSpPr: this.spPr, newSpPr: spPr});
        this.spPr = spPr;
    },

    setBodyPr: function(bodyPr)
    {
        History.Add(this, {Type: historyitem_DefaultShapeDefinition_SetBodyPr, oldBodyPr: this.bodyPr, newBodyPr: bodyPr});
        this.bodyPr = bodyPr;
    },

    setLstStyle: function(lstStyle)
    {
        History.Add(this, {Type: historyitem_DefaultShapeDefinition_SetLstStyle, oldLstStyle: this.lstStyle, newLstStyle: lstStyle});
        this.lstStyle = lstStyle;
    },

    setStyle: function(style)
    {
        History.Add(this, {Type: historyitem_DefaultShapeDefinition_SetStyle, oldStyle: this.style, newStyle: style});
        this.style = style;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
        	case historyitem_DefaultShapeDefinition_SetSpPr:
        	{
        		this.spPr = data.oldSpPr;
        		break;
        	}
			case historyitem_DefaultShapeDefinition_SetBodyPr:
			{
				this.bodyPr = data.oldBodyPr;
				break;
			}
			case historyitem_DefaultShapeDefinition_SetLstStyle:
			{
				this.lstStyle = data.oldLstStyle;
				break;
			}
			case historyitem_DefaultShapeDefinition_SetStyle:
			{
				this.style = data.oldStyle;
				break;
			}
        }
    },

    Redo: function(data)
    {
    	switch(data.Type)
        {
        	case historyitem_DefaultShapeDefinition_SetSpPr:
        	{
        		this.spPr = data.newSpPr;
        		break;
        	}
			case historyitem_DefaultShapeDefinition_SetBodyPr:
			{
				this.bodyPr = data.newBodyPr;
				break;
			}
			case historyitem_DefaultShapeDefinition_SetLstStyle:
			{
				this.lstStyle = data.newLstStyle;
				break;
			}
			case historyitem_DefaultShapeDefinition_SetStyle:
			{
				this.style = data.newStyle;
				break;
			}
        }
    },
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
        {
        	case historyitem_DefaultShapeDefinition_SetSpPr:
        	{
        		w.WriteBool(isRealObject(data.newSpPr));
        		if(isRealObject(data.newSpPr))
				{
					w.WriteString2(data.newSpPr.Get_Id());
				}
        		break;
        	}
			case historyitem_DefaultShapeDefinition_SetBodyPr:
			{
        		w.WriteBool(isRealObject(data.newBodyPr));
        		if(isRealObject(data.newBodyPr))
				{
					w.WriteString2(data.newBodyPr.Get_Id());
				}
				break;
			}
			case historyitem_DefaultShapeDefinition_SetLstStyle:
			{
				w.WriteBool(isRealObject(data.newLstStyle));
        		if(isRealObject(data.newLstStyle))
				{
					w.WriteString2(data.newLstStyle.Get_Id());
				}
				break;
			}
			case historyitem_DefaultShapeDefinition_SetStyle:
			{
				w.WriteBool(isRealObject(data.newStyle));
        		if(isRealObject(data.newStyle))
				{
					w.WriteString2(data.newStyle.Get_Id());
				}
				break;
			}
        }
    },
    
    Load_Changes: function(r)
    {
    	if(this.getObjectType() !== r.GetBool())
			return;
		var type = r.GetLong();
    	switch(type)
        {
        	case historyitem_DefaultShapeDefinition_SetSpPr:
        	{
        		if(r.GetBool())
				{
					this.spPr = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.spPr = null;
				}
        		break;
        	}
			case historyitem_DefaultShapeDefinition_SetBodyPr:
			{
        		if(r.GetBool())
				{
					this.bodyPr = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.bodyPr = null;
				}
				break;
			}
			case historyitem_DefaultShapeDefinition_SetLstStyle:
			{
				if(r.GetBool())
				{
					this.lstStyle = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.lstStyle = null;
				}
				break;
			}
			case historyitem_DefaultShapeDefinition_SetStyle:
			{
				if(r.GetBool())
				{
					this.style = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.style = null;
				}
				break;
			}
        }
    }
};

function CNvPr()
{
    this.id = 0;
    this.name = "";
    this.isHidden = false;

    this.createDuplicate = function()
    {
        var duplicate = new CNvPr();
        duplicate.id = this.id;
        duplicate.name = this.name;
        duplicate.isHidden = this.isHidden;
        return duplicate;
    };

	this.Id = g_oIdCounter.Get_NewId();
	g_oTableId.Add(this, this.Id)
}


CNvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return historyitem_type_CNvPr;
    },
    
    setId: function(id)
    {
    	History.Add(this, {Type: historyitem_CNvPr_SetId, oldId: this.id, newId: id});
    	this.id = id;
    },
    
    setName: function(name)
    {
    	History.Add(this, {Type: historyitem_CNvPr_SetName, oldName: this.name, newName: name});
    	this.name = name;
    },
     
    setIsHidden: function(isHidden)
    {
    	History.Add(this, {Type: historyitem_CNvPr_SetIsHidden, oldIsHidden: this.isHidden, newIsHidden: isHidden});
    	this.isHidden = isHidden;
    },
    
    Undo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_CNvPr_SetId:
    		{
    			this.id = data.oldId;
    			break;
    		}
    		case historyitem_CNvPr_SetName:
    		{
    			this.name = data.oldName;
    			break;
    		}
    		case historyitem_CNvPr_SetIsHidden:
    		{
    			this.isHidden = data.oldIsHidden;
    			break;
    		}
    	}
    },
    
    Redo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_CNvPr_SetId:
    		{
    			this.id = data.newId;
    			break;
    		}
    		case historyitem_CNvPr_SetName:
    		{
    			this.name = data.newName;
    			break;
    		}
    		case historyitem_CNvPr_SetIsHidden:
    		{
    			this.isHidden = data.newIsHidden;
    			break;
    		}
    	}
    },
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
    	{
    		case historyitem_CNvPr_SetId:
    		{
    			w.WriteBool(isRealNumber(data.newId));
    			if(isRealNumber(data.newId))
    			{
    				w.WriteLong(data.newId);
    			}
    			break;
    		}
    		case historyitem_CNvPr_SetName:
    		{
    			w.WriteBool(typeof data.newName === "string");
    			if(typeof data.newName === "string")
    			{
    				w.WriteString2(data.newName);
    			}
    			break;
    		}
    		case historyitem_CNvPr_SetIsHidden:
    		{
    			w.WriteBool(isRealBool(data.newIsHidden));
    			if(isRealBool(data.newIsHidden))
    			{
    				w.WriteBool(data.newIsHidden);
    			}
    			break;
    		}
    	}
	},
	
	
	Load_Changes: function(r)
	{
		if(this.getObjectType() !== r.GetLong())
			return;
		var type = r.GetLong();
		switch(type)
    	{
    		case historyitem_CNvPr_SetId:
    		{
    			if(r.GetBool())
    			{
    				this.id = r.GetLong();
    			}
    			else 
    			{
    				this.id = null;
				}
    			break;
    		}
    		case historyitem_CNvPr_SetName:
    		{
    			w.WriteBool(typeof data.newName === "string");
    			if(typeof data.newName === "string")
    			{
    				w.WriteString2(data.newName);
    			}
    			if(r.GetBool())
    			break;
    		}
    		case historyitem_CNvPr_SetIsHidden:
    		{
    			w.WriteBool(isRealBool(data.newIsHidden));
    			if(isRealBool(data.newIsHidden))
    			{
    				w.WriteBool(data.newIsHidden);
    			}
    			break;
    		}
    	}
	},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function NvPr()
{
    this.isPhoto = false;
    this.userDrawn = false;
    this.ph = null;

    this.createDuplicate = function()
    {
        var duplicate = new NvPr();
        duplicate.isPhoto = this.isPhoto;
        duplicate.userDrawn = this.userDrawn;
        if(this.ph != null)
        {
            duplicate.ph = this.ph.createDuplicate();
        }
        return duplicate;
    };

    this.Write_ToBinary2 = function(w)
    {
        w.WriteBool(this.isPhoto);
        w.WriteBool(this.userDrawn);
        w.WriteBool(isRealObject(this.ph));
        if(isRealObject(this.ph))
        {
            this.ph.Write_ToBinary2(w);
        }
    };

    this.Read_FromBinary2 = function(r)
    {
        (this.isPhoto)   = r.GetBool();
        (this.userDrawn) = r.GetBool();
        if(r.GetBool())
        {
            this.ph = new Ph();
            this.ph.Read_FromBinary2(r);
        }
    };
    
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

NvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return historyitem_type_NvPr;
    },
    
    setIsPhoto: function(isPhoto)
    {
    	History.Add(this, {Type:historyitem_NvPr_SetIsPhoto, oldIsPhoto: this.isPhoto, newIsPhoto: isPhoto});
    	this.isPhoto = isPhoto; 
    },
    
    setUserDrawn: function(userDrawn)
    {
    	History.Add(this, {Type:historyitem_NvPr_SetUserDrawn, oldUserDrawn: this.userDrawn, newUserDrawn: userDrawn});
    	this.userDrawn = userDrawn;
    },
    
    setPh: function(ph)
    {
    	History.Add(this, {Type: historyitem_NvPr_SetPh, oldPh: this.ph, newPh: ph});
    	this.ph = ph;
    },
    
    
    Undo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_NvPr_SetIsPhoto:
    		{
    			this.isPhoto = data.oldIsPhoto;
     			break;
    		}
    		case historyitem_NvPr_SetUserDrawn:
    		{
    			this.userDrawn = data.oldUserDrawn;
    			break;
    		}
    		case historyitem_NvPr_SetPh:
    		{
    			this.ph = data.oldPh;
    			break;
    		}
    	}
    },
    
    
    Redo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_NvPr_SetIsPhoto:
    		{
    			this.isPhoto = data.newIsPhoto;
     			break;
    		}
    		case historyitem_NvPr_SetUserDrawn:
    		{
    			this.userDrawn = data.newUserDrawn;
    			break;
    		}
    		case historyitem_NvPr_SetPh:
    		{
    			this.ph = data.newPh;
    			break;
    		}
    	}
    },
    
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
    	{
			case historyitem_NvPr_SetIsPhoto:
    		{
    			w.WriteBool(isRealBool(data.newIsPhoto));
    			if(isRealBool(data.newIsPhoto))
    			{
    				w.WriteBool(data.newIsPhoto);
    			}
     			break;
    		}
    		case historyitem_NvPr_SetUserDrawn:
    		{
    			w.WriteBool(isRealBool(data.newUserDrawn));
    			if(isRealBool(data.newUserDrawn))
    			{
    				w.WriteBool(data.newUserDrawn);
    			}
    			break;
    		}
    		case historyitem_NvPr_SetPh:
    		{
    			w.WriteBool(isRealObject(data.newPh));
    			if(isRealObject(data.newPh))
    			{
    				w.WriteString2(data.newPh.Get_Id());
    			}
    			break;
    		}
    	}
    	
    },

    Load_Change: function(r)
    {
   		if(this.getObjectType() !== r.GetLong())
   			return;
		var type = r.GetLong();
		switch(type)
		{
			case historyitem_NvPr_SetIsPhoto:
    		{
    			if(r.GetBool())
    			{
    				this.isPhoto = r.GetBool();
    			}
    			else
    			{
    				this.isPhoto = null;
    			}
     			break;
    		}
    		case historyitem_NvPr_SetUserDrawn:
    		{	
    			if(r.GetBool())
    			{
    				this.userDrawn = r.GetBool();
    			}
    			else
    			{
    				this.userDrawn = null;
    			}
    			break;
    		}
    		case historyitem_NvPr_SetPh:
    		{
    			if(r.GetBool())
    			{
    				this.ph = g_oTableId.Get_ById(r.GetString2());
    			}
    			else
    			{
    				this.ph = null;
    			}
    			break;
    		} 
		}
    },
    
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

//типы плейсхолдеров
var phType_body     = 0,
    phType_chart    = 1,
    phType_clipArt  = 2, //(Clip Art)
    phType_ctrTitle = 3, //(Centered Title)
    phType_dgm      = 4, //(Diagram)
    phType_dt       = 5, //(Date and Time)
    phType_ftr      = 6, //(Footer)
    phType_hdr      = 7, //(Header)
    phType_media    = 8, //(Media)
    phType_obj      = 9, //(Object)
    phType_pic      = 10, //(Picture)
    phType_sldImg   = 11, //(Slide Image)
    phType_sldNum   = 12, //(Slide Number)
    phType_subTitle = 13, //(Subtitle)
    phType_tbl      = 14, //(Table)
    phType_title    = 15; //(Title)

var szPh_full    = 0,
    szPh_half    = 1,
    szPh_quarter = 2;

var orientPh_horz = 0,
    orientPh_vert = 1;

function Ph()
{
    this.hasCustomPrompt = false;
    this.idx = null;
    this.orient = null;
    this.sz = null;
    this.type = null;


    this.createDuplicate =  function()
    {
        var duplicate = new Ph();
        duplicate.hasCustomPrompt = this.hasCustomPrompt;
        duplicate.idx = this.idx;
        duplicate.orient = this.orient;
        duplicate.sz = this.sz;
        duplicate.type = this.type;
        return duplicate;
    };
}

Ph.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return historyitem_type_Ph;
    },
    
    setHasCustomPrompt: function(hasCustomPrompt)
    {
    	History.Add(this, {Type: historyitem_Ph_SetHasCustomPrompt, oldHasCutomPrompt: this.hasCustomPrompt, newHasCustomPrompt:hasCustomPrompt});
    	this.hasCustomPrompt = hasCustomPrompt;
    },
    
    setIdx: function(idx)
    {
    	History.Add(this, {Type: historyitem_Ph_SetIdx, oldIdx: this.idx, newIdx:idx});
    	this.idx = idx;
    },
    
    setOrient: function(orient)
    {
    	History.Add(this, {Type: historyitem_Ph_SetOrient, oldOrient: this.orient, newIdx:orient});
    	this.orient = orient;
    },
    
    setSz: function(sz)
    {
    	History.Add(this, {Type: historyitem_Ph_SetSz, oldSz: this.sz, newSz:sz});
    	this.sz = sz;
    },
    
    setType: function(type)
    {
    	History.Add(this, {Type: historyitem_Ph_SetType, oldType: this.type, newType:type});
    	this.type = type;	
    },
    
    Undo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_Ph_SetHasCustomPrompt:
    		{
    			this.hasCustomPrompt = data.oldHasCustomPrompt;
    			break;
    		}    		
    		case historyitem_Ph_SetIdx:
    		{
    			this.idx = data.oldIdx;
    			break;
    		}
    		case historyitem_Ph_SetOrient:
    		{
    			this.orient = data.oldOrient;
    			break;
    		}
    		case historyitem_Ph_SetSz:
    		{
    			this.sz = data.oldSz;
    			break;
    		}
    		case historyitem_Ph_SetType:
    		{
    			this.type = data.oldType;
    			break;
    		}
    	}
    },

    Redo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_Ph_SetHasCustomPrompt:
    		{
    			this.hasCustomPrompt = data.newHasCustomPrompt;
    			break;
    		}    		
    		case historyitem_Ph_SetIdx:
    		{
    			this.idx = data.newIdx;
    			break;
    		}
    		case historyitem_Ph_SetOrient:
    		{
    			this.orient = data.newOrient;
    			break;
    		}
    		case historyitem_Ph_SetSz:
    		{
    			this.sz = data.newSz;
    			break;
    		}
    		case historyitem_Ph_SetType:
    		{
    			this.type = data.newType;
    			break;
    		}
    	}
    },
    
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
    	{
    		case historyitem_Ph_SetHasCustomPrompt:
    		{
    			w.WriteBool(isRealBool(data.newHasCustomPrompt));
    			if(isRealBool(data.newHasCustomPrompt))
    			{
    				w.WriteBool(data.newHasCustomPrompt);
    			}
    			break;
    		}    		
    		case historyitem_Ph_SetIdx:
    		{
    			w.WriteBool(typeof data.newIdx === "string" || isRealNumber(data.newIdx));
    			if(typeof data.newIdx === "string" || isRealNumber(data.newIdx))
    			{
    				w.WriteBool(typeof data.newIdx === "string");
    				if(typeof data.newIdx === "string")
    				{
    					w.WriteString2(data.newIdx);
    				}
    				else
    				{
    					w.WriteLong(data.newIdx);	
    				}
    			}
    			break;
    		}
    		case historyitem_Ph_SetOrient:
    		{
    			w.WriteBool(isRealNumber(data.newOrient));
    			if(isRealNumber(data.newOrient))
    			{
    				w.WriteLong(data.newOrient);
    			}
    			break;
    		}
    		case historyitem_Ph_SetSz:
    		{
    			w.WriteBool(isRealNumber(data.newSz));
    			if(isRealNumber(data.newSz))
    			{
    				w.WriteLong(data.newSz);
    			}
    			break;
    		}
    		case historyitem_Ph_SetType:
    		{
    			w.WriteBool(isRealNumber(data.newType));
    			if(isRealNumber(data.newType))
    			{
    				w.WriteLong(data.newType);
    			}
    			break;
    		}
		}
    },
    
    Load_Changes: function(r)
    {
    	if(this.getObjectType() !== r.GetLong())
    		return;
    	var type = r.GetLong();	
    	switch(type)
    	{
    		case historyitem_Ph_SetHasCustomPrompt:
    		{
    			if(r.GetBool())
    			{
    				this.hasCustomPrompt = r.GetBool();
    			}
    			else
    			{
    				this.hasCustomPrompt = null;
    			}
    			break;
    		}    		
    		case historyitem_Ph_SetIdx:
    		{
    			if(r.GetBool())
    			{
    				if(r.GetBool())
    				{
    					this.idx = r.GetString2();
    				}
    				else
    				{
    					this.idx = r.GetLong();
    				}
    			}
    			else
    			{
    				this.idx = null;
    			}
    			break;
    		}
    		case historyitem_Ph_SetOrient:
    		{
    			if(r.GetBool())
    			{
    				this.orient = r.GetLong();
    			}
    			else
    			{
    				this.orient = null;
    			}
    			break;
    		}
    		case historyitem_Ph_SetSz:
    		{
    			if(r.GetBool())
    			{
    				this.sz = r.GetLong();
    			}
    			else
    			{
    				this.sz = null;
    			}
    			break;
    		}
    		case historyitem_Ph_SetType:
    		{
    			if(r.GetBool())
    			{
    				this.type = r.GetLong();
    			}
    			else
    			{
    				this.type = null;
    			}
    			break;
    		}	
    	}
		
    },
    
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function UniNvPr()
{
    this.cNvPr = new CNvPr();
    this.UniPr = null;
    this.nvPr = new NvPr();

    this.createDuplicate = function()
    {
        var duplicate = new UniNvPr();
        duplicate.cNvPr = this.cNvPr.createDuplicate();
        duplicate.UniPr = this.UniPr;
        duplicate.nvPr = this.nvPr.createDuplicate();
        return duplicate;
    };
    
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}

UniNvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return historyitem_type_UniNvPr;
    },
    
    setCNvPr: function(cNvPr)
    {
    	History.Add(this, {Type: historyitem_UniNvPr_SetCNvPr, oldCNvPr: this.cNvPr, newCNvPr: cNvPr});
    	this.cNvPr = cNvPr;
	},
	
	setUniPr: function(uniPr)
	{
    	History.Add(this, {Type: historyitem_UniNvPr_SetUniPr, oldUniPr: this.UniPr, newUniPr: uniPr});
    	this.UniPr = uniPr;
	},
	
	setNvPr: function(nvPr)
	{
    	History.Add(this, {Type: historyitem_UniNvPr_SetNvPr, oldNvPr: this.nvPr, newNvPr: nvPr});
    	this.nvPr = nvPr;
	},
	
	Undo: function(data)
	{
		switch(data.Type)
		{
			case historyitem_UniNvPr_SetCNvPr:
			{
				this.cNvPr = data.oldCNvPr;
				break;
			}
			case historyitem_UniNvPr_SetUniPr:
			{
				this.UniPr = data.oldUniPr;
				break;
			}
			case historyitem_UniNvPr_SetNvPr:
			{
				this.nvPr = data.oldNvPr;
				break;
			}
		}
	},
	
	Redo: function(data)
	{
		switch(data.Type)
		{
			case historyitem_UniNvPr_SetCNvPr:
			{
				this.cNvPr = data.newCNvPr;
				break;
			}
			case historyitem_UniNvPr_SetUniPr:
			{
				this.UniPr = data.newUniPr;
				break;
			}
			case historyitem_UniNvPr_SetNvPr:
			{
				this.nvPr = data.newNvPr;
				break;
			}
		}
	},
	
	Save_Changes: function(data, w)
	{
		w.WriteLong(this.getObjectType());
		w.WriteLong(data.Type);
		switch(data.Type)
		{
			case historyitem_UniNvPr_SetCNvPr:
			{
				w.WriteBool(isRealObject(data.newCNvPr));
				if(isRealObject(data.newCNvPr))
				{
					w.WriteString2(data.newCNvPr.Get_Id());
				}
				break;
			}
			case historyitem_UniNvPr_SetUniPr:
			{
				w.WriteBool(isRealObject(data.newUniPr));
				if(isRealObject(data.newUniPr))
				{
					w.WriteString2(data.newUniPr.Get_Id());
				}
				break;
			}
			case historyitem_UniNvPr_SetNvPr:
			{
				w.WriteBool(isRealObject(data.newNvPr));
				if(isRealObject(data.newNvPr))
				{
					w.WriteString2(data.newNvPr.Get_Id());
				}
				break;
			}
		}
	},
	
	
	Load_Changes: function(r)
	{
		if(this.getObjectType() !== r.GetLong())
			return;
		var type = r.GetLong();
		switch(type)
		{
			case historyitem_UniNvPr_SetCNvPr:
			{
				if(r.GetBool())
				{
					this.cNvPr = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.cNvPr = null;
				}
				break;
			}
			case historyitem_UniNvPr_SetUniPr:
			{
				if(r.GetBool())
				{
					this.UniPr = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.UniPr = null;
				}
				break;
			}
			case historyitem_UniNvPr_SetNvPr:
			{
				if(r.GetBool())
				{
					this.nvPr = g_oTableId.Get_ById(r.GetString2());
				}
				else
				{
					this.nvPr = null;
				}
				break;
			} 
		}
	},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function StyleRef()
{
    this.idx = 0;
    this.Color = new CUniColor();



    this.createDuplicate = function()
    {
        var duplicate  = new StyleRef();
        duplicate.idx = this.idx;
        duplicate.Color = this.Color.createDuplicate();
        return duplicate;
    }

    this.isIdentical = function(styleRef)
    {
        if(styleRef == null)
        {
            return false;
        }
        if(this.idx !== styleRef.idx)
        {
            return false;
        }

        if(this.Color.IsIdentical(styleRef.Color) == false)
        {
            return false;
        }

        return true;

    }
    
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

StyleRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return  historyitem_type_StyleRef;
    },
    
    setIdx: function(idx)
    {
    	History.Add(this, {Type: historyitem_StyleRef_SetIdx, oldIdx:this.idx, newIdx: idx});
    	this.idx= idx;
    },
    
    setColor: function(color)
    {
    	History.Add(this, {Type: historyitem_StyleRef_SetColor, oldColor:this.Color, newColor: color});
    	this.Color = color;
    },
    
    Undo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_StyleRef_SetIdx:
    		{
    			this.idx = data.oldIdx;
    			break;
    		}
    		case historyitem_StyleRef_SetColor:
    		{
    			this.Color = data.oldColor;
    			break;
    		}
    	}
    },
    
    Redo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_StyleRef_SetIdx:
    		{
    			this.idx = data.newIdx;
    			break;
    		}
    		case historyitem_StyleRef_SetColor:
    		{
    			this.Color = data.newColor;
    			break;
    		}
    	}
    },
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
    	{
    		case historyitem_StyleRef_SetIdx:
    		{
    			w.WriteBool(isRealNumber(data.newIdx));
    			if(isRealNumber(data.newIdx))
    			{
    				w.WriteLong(data.newIdx);
    			}
    			break;
    		}
    		case historyitem_StyleRef_SetColor:
    		{
    			w.WriteBool(isRealobject(data.newColor));
    			if(isRealObject(data.newColor))
    			{
    				w.WriteString2(data.newColor.Get_Id());
    			}
    			break;
    		}	
    	}
    },
    
    Load_Changes: function(r)
    {
    	if(this.getObjectType() !== r.GetLong())
    		return;
    	var type = r.GetLong();
    	switch(type)
    	{
    		case historyitem_StyleRef_SetIdx:
    		{
    			if(r.GetBool())
    			{
    				this.idx = r.GetLong();
    			}
    			else
    			{
    				this.idx = null;
    			}
    			break;
    		}
    		case historyitem_StyleRef_SetColor:
    		{
    			if(r.GetBool())
    			{
    				this.Color = g_oTableId.Get_ById(r.GetString2());
    			}
    			else
    			{
    				this.Color = null;
    			}
    			break;
    		}	
    	}
		
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

var fntStyleInd_none = 2;
var fntStyleInd_major = 0;
var fntStyleInd_minor = 1;

function FontRef()
{
    this.idx = fntStyleInd_none;
    this.Color = null;//new CUniColor();

    this.createDuplicate = function()
    {
        var duplicate  = new FontRef();
        duplicate.idx = this.idx;
        if(this.Color)
            duplicate.Color = this.Color.createDuplicate();
        return duplicate;
    }
	
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

FontRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    getObjectType: function()
    {
    	return historyitem_type_FontRef;
	},
    
    setIdx: function(idx)
    {
    	History.Add(this, {Type: historyitem_FontRef_SetIdx, oldIdx:this.idx, newIdx: idx});
    	this.idx= idx;
    },
    
    setColor: function(color)
    {
    	History.Add(this, {Type: historyitem_FontRef_SetColor, oldColor:this.Color, newColor: color});
    	this.Color = color;
    },
    
    Undo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_FontRef_SetIdx:
    		{
    			this.idx = data.oldIdx;
    			break;
    		}
    		case historyitem_FontRef_SetColor:
    		{
    			this.Color = data.oldColor;
    			break;
    		}
    	}
    },
    
    Redo: function(data)
    {
    	switch(data.Type)
    	{
    		case historyitem_FontRef_SetIdx:
    		{
    			this.idx = data.newIdx;
    			break;
    		}
    		case historyitem_FontRef_SetColor:
    		{
    			this.Color = data.newColor;
    			break;
    		}
    	}
    },
    
    Save_Changes: function(data, w)
    {
    	w.WriteLong(this.getObjectType());
    	w.WriteLong(data.Type);
    	switch(data.Type)
    	{
    		case historyitem_FontRef_SetIdx:
    		{
    			w.WriteBool(isRealNumber(data.newIdx));
    			if(isRealNumber(data.newIdx))
    			{
    				w.WriteLong(data.newIdx);
    			}
    			break;
    		}
    		case historyitem_FontRef_SetColor:
    		{
    			w.WriteBool(isRealobject(data.newColor));
    			if(isRealObject(data.newColor))
    			{
    				w.WriteString2(data.newColor.Get_Id());
    			}
    			break;
    		}	
    	}
    },
    
    Load_Changes: function(r)
    {
    	if(this.getObjectType() !== r.GetLong())
    		return;
    	var type = r.GetLong();
    	switch(type)
    	{
    		case historyitem_FontRef_SetIdx:
    		{
    			if(r.GetBool())
    			{
    				this.idx = r.GetLong();
    			}
    			else
    			{
    				this.idx = null;
    			}
    			break;
    		}
    		case historyitem_FontRef_SetColor:
    		{
    			if(r.GetBool())
    			{
    				this.Color = g_oTableId.Get_ById(r.GetString2());
    			}
    			else
    			{
    				this.Color = null;
    			}
    			break;
    		}	
    	}
		
    },


    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CShapeStyle()
{
    this.lnRef = null;//new StyleRef();
    this.fillRef = null;//new StyleRef();
    this.effectRef = null;//new StyleRef();
    this.fontRef = null;//new FontRef();



    this.merge = function(style)
    {
        if(style!=null)
        {
            if(style.lnRef != null)
            {
                this.lnRef = style.lnRef.createDuplicate();
            }

            if(style.fillRef != null)
            {
                this.fillRef = style.fillRef.createDuplicate();
            }

            if(style.effectRef != null)
            {
                this.effectRef = style.effectRef.createDuplicate();
            }

            if(style.fontRef != null)
            {
                this.fontRef = style.fontRef.createDuplicate();
            }
        }
    }

    this.createDuplicate =  function()
    {

        var duplicate = new CShapeStyle();
        if(this.lnRef!=null)
        {
            duplicate.lnRef = this.lnRef.createDuplicate();
        }
        if(this.fillRef!=null)
        {
            duplicate.fillRef = this.fillRef.createDuplicate();
        }
        if(this.effectRef!=null)
        {
            duplicate.effectRef = this.effectRef.createDuplicate();
        }
        if(this.fontRef!=null)
        {
            duplicate.fontRef = this.fontRef.createDuplicate();
        }
        return duplicate;
    }

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CShapeStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_ShapeStyle;
    },

    setLnRef: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeStyle_SetLnRef, oldPr: this.lnRef, newPr: pr});
        this.lnRef = pr;
    },
    setFillRef: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeStyle_SetFillRef, oldPr: this.fillRef, newPr: pr});
        this.fillRef = pr;
    },
    setFontRef: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeStyle_SetFontRef, oldPr: this.fontRef, newPr: pr});
        this.fontRef = pr;
    },

    setEffectRef: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeStyle_SetEffectRef, oldPr: this.effectRef, newPr: pr});
        this.effectRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ShapeStyle_SetLnRef:
            {
                this.lnRef = data.oldPr;
                break;
            }
            case historyitem_ShapeStyle_SetFillRef:
            {
                this.fillRef = data.oldPr;
                break;
            }
            case historyitem_ShapeStyle_SetFontRef:
            {
                this.fontRef = data.oldPr;
                break;
            }
            case historyitem_ShapeStyle_SetEffectRef:
            {
                this.effectRef = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ShapeStyle_SetLnRef:
            {
                this.lnRef = data.newPr;
                break;
            }
            case historyitem_ShapeStyle_SetFillRef:
            {
                this.fillRef = data.newPr;
                break;
            }
            case historyitem_ShapeStyle_SetFontRef:
            {
                this.fontRef = data.newPr;
                break;
            }
            case historyitem_ShapeStyle_SetEffectRef:
            {
                this.effectRef = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ShapeStyle_SetLnRef:
            case historyitem_ShapeStyle_SetFillRef:
            case historyitem_ShapeStyle_SetFontRef:
            case historyitem_ShapeStyle_SetEffectRef:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (data.Type)
        {
            case historyitem_ShapeStyle_SetLnRef:
            {
                this.lnRef = readObject(r);
                break;
            }
            case historyitem_ShapeStyle_SetFillRef:
            {
                this.fillRef = readObject(r);
                break;
            }
            case historyitem_ShapeStyle_SetFontRef:
            {
                this.fontRef = readObject(r);
                break;
            }
            case historyitem_ShapeStyle_SetEffectRef:
            {
                this.effectRef = readObject(r);
                break;
            }
        }
    }



};

function CreateDefaultShapeStyle()
{
    var style = new CShapeStyle();
    style.setLnRef(new StyleRef());
    style.lnRef.setIdx(2);
    style.lnRef.setColor(new CUniColor());
    style.lnRef.Color.setColor(new CSchemeColor());
    style.lnRef.Color.color.setId(g_clr_accent1);
    var mod = new CColorMod();
    mod.setName("shade");
    mod.setVal(50000);
    style.lnRef.Color.setMods(new CColorModifiers());
    style.lnRef.Color.Mods.addMod(mod);

    style.setFillRef(new StyleRef());
    style.fillRef.setIdx(1);
    style.fillRef.setColor(new CUniColor());
    style.fillRef.Color.setColor(new CSchemeColor());
    style.fillRef.Color.color.setId(g_clr_accent1);

    style.setEffectRef(new StyleRef());
    style.effectRef.setIdx(0);
    style.effectRef.setColor(new CUniColor());
    style.effectRef.Color.setColor(new CSchemeColor());
    style.effectRef.Color.color.setId(g_clr_accent1);


    style.setFontRef(new FontRef());
    style.fontRef.setIdx(fntStyleInd_minor);
    style.fontRef.setColor(new CUniColor());
    style.fontRef.Color.setColor(new CSchemeColor());
    style.fontRef.Color.color.setId(tx1);
    return style;
}




function CXfrm()
{
    this.offX   = null;
    this.offY   = null;
    this.extX   = null;
    this.extY   = null;
    this.chOffX = null;
    this.chOffY = null;
    this.chExtX = null;
    this.chExtY = null;

    this.flipH  = null;
    this.flipV  = null;
    this.rot    = null;

    this.parent = null;

    this.isNotNull = function()
    {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.extX) && isRealNumber(this.extY);
    };


    this.isNotNullForGroup = function()
    {
        return isRealNumber(this.offX) && isRealNumber(this.offY)
            && isRealNumber(this.chOffX) && isRealNumber(this.chOffY)
            && isRealNumber(this.extX) && isRealNumber(this.extY)
            && isRealNumber(this.chExtX) && isRealNumber(this.chExtY);
    };

    this.isEqual = function(xfrm)
    {

        return xfrm && this.offX == xfrm.offX && this.offY == xfrm.offY && this.extX == xfrm.extX &&
            this.extY == xfrm.extY && this.chOffX == xfrm.chOffX && this.chOffY == xfrm.chOffY && this.chExtX == xfrm.chExtX &&
            this.chExtY == xfrm.chExtY ;
    }

    this.merge = function(xfrm)
    {
        if(xfrm.offX != null)
        {
            this.offX = xfrm.offX;
        }
        if(xfrm.offY != null)
        {
            this.offY = xfrm.offY;
        }


        if(xfrm.extX != null)
        {
            this.extX = xfrm.extX;
        }
        if(xfrm.extY != null)
        {
            this.extY = xfrm.extY;
        }


        if(xfrm.chOffX != null)
        {
            this.chOffX = xfrm.chOffX;
        }
        if(xfrm.chOffY != null)
        {
            this.chOffY = xfrm.chOffY;
        }


        if(xfrm.chExtX != null)
        {
            this.chExtX = xfrm.chExtX;
        }
        if(xfrm.chExtY != null)
        {
            this.chExtY = xfrm.chExtY;
        }


        if(xfrm.flipH != null)
        {
            this.flipH = xfrm.flipH;
        }
        if(xfrm.flipV != null)
        {
            this.flipV = xfrm.flipV;
        }

        if(xfrm.rot != null)
        {
            this.rot = xfrm.rot;
        }
    }

    this.createDuplicate = function()
    {
        var duplicate = new CXfrm();
        duplicate.offX = this.offX;
        duplicate.offY = this.offY;
        duplicate.extX = this.extX;
        duplicate.extY = this.extY;
        duplicate.chOffX = this.chOffX;
        duplicate.chOffY = this.chOffY;
        duplicate.chExtX = this.chExtX;
        duplicate.chExtY = this.chExtY;

        duplicate.flipH = this.flipH;
        duplicate.flipV = this.flipV;
        duplicate.rot = this.rot;
        return duplicate;
    }

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CXfrm.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Xfrm;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setOffX: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetOffX, oldPr: this.offX, newPr: pr});
        this.offX = pr;
        this.handleUpdatePosition();
    },
    setOffY: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetOffY, oldPr: this.offY, newPr: pr});
        this.offY = pr;
        this.handleUpdatePosition();
    },
    setExtX: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetExtX, oldPr: this.extX, newPr: pr});
        this.extX = pr;
        this.handleUpdateExtents();
    },
    setExtY: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetExtY, oldPr: this.extY, newPr: pr});
        this.extY = pr;
        this.handleUpdateExtents();
    },
    setChOffX: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetChOffX, oldPr: this.chOffX, newPr: pr});
        this.chOffX = pr;
        this.handleUpdateChildOffset();
    },
    setChOffY: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetChOffY, oldPr: this.chOffY, newPr: pr});
        this.chOffY = pr;
        this.handleUpdateChildOffset();
    },
    setChExtX: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetChExtX, oldPr: this.chExtX, newPr: pr});
        this.chExtX = pr;
        this.handleUpdateChildExtents();
    },
    setChExtY: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetChExtY, oldPr: this.chExtY, newPr: pr});
        this.chExtY = pr;
        this.handleUpdateChildExtents();
    },
    setFlipH: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetFlipH, oldPr: this.flipH, newPr: pr});
        this.flipH = pr;
        this.handleUpdateFlip();
    },
    setFlipV: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetFlipV, oldPr: this.flipV, newPr: pr});
        this.flipV = pr;
        this.handleUpdateFlip();
    },
    setRot: function(pr)
    {
        History.Add(this, {Type: historyitem_Xfrm_SetRot, oldPr: this.rot, newPr: pr});
        this.rot = pr;
        this.handleUpdateRot();
    },

    handleUpdatePosition: function()
    {
        if(this.parent && this.parent.handleUpdatePosition)
        {
            this.parent.handleUpdatePosition();
        }
    },

    handleUpdateExtents: function()
    {
        if(this.parent && this.parent.handleUpdateExtents)
        {
            this.parent.handleUpdateExtents();
        }
    },

    handleUpdateChildOffset: function()
    {
        if(this.parent && this.parent.handleUpdateChildOffset)
        {
            this.parent.handleUpdateChildOffset();
        }
    },

    handleUpdateChildExtents: function()
    {
        if(this.parent && this.parent.handleUpdateChildExtents)
        {
            this.parent.handleUpdateChildExtents();
        }
    },

    handleUpdateFlip: function()
    {
        if(this.parent && this.parent.handleUpdateFlip)
        {
            this.parent.handleUpdateFlip();
        }
    },

    handleUpdateRot: function()
    {
        if(this.parent && this.parent.handleUpdateRot)
        {
            this.parent.handleUpdateRot();
        }
    },


    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Xfrm_SetOffX:
            {
                this.offX = data.oldPr;
                this.handleUpdatePosition();
                break;
            }
            case historyitem_Xfrm_SetOffY:
            {
                this.offY = data.oldPr;
                this.handleUpdatePosition();
                break;
            }
            case historyitem_Xfrm_SetExtX:
            {
                this.extX = data.oldPr;
                this.handleUpdateExtents();
                break;
            }
            case historyitem_Xfrm_SetExtY:
            {
                this.extY = data.oldPr;
                this.handleUpdateExtents();
                break;
            }
            case historyitem_Xfrm_SetChOffX:
            {
                this.chOffX = data.oldPr;
                this.handleUpdateChildOffset();
                break;
            }
            case historyitem_Xfrm_SetChOffY:
            {
                this.chOffY = data.oldPr;
                this.handleUpdateChildOffset();
                break;
            }
            case historyitem_Xfrm_SetChExtX:
            {
                this.chExtX = data.oldPr;
                this.handleUpdateChildExtents();
                break;
            }
            case historyitem_Xfrm_SetChExtY:
            {
                this.chExtY = data.oldPr;
                this.handleUpdateChildExtents();
                break;
            }
            case historyitem_Xfrm_SetFlipH:
            {
                this.flipH = data.oldPr;
                this.handleUpdateFlip();
                break;
            }
            case historyitem_Xfrm_SetFlipV:
            {
                this.flipV = data.oldPr;
                this.handleUpdateFlip();
                break;
            }
            case historyitem_Xfrm_SetRot:
            {
                this.rot = data.oldPr;
                this.handleUpdateRot();
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Xfrm_SetOffX:
            {
                this.offX = data.newPr;
                this.handleUpdatePosition();
                break;
            }
            case historyitem_Xfrm_SetOffY:
            {
                this.offY = data.newPr;
                this.handleUpdatePosition();
                break;
            }
            case historyitem_Xfrm_SetExtX:
            {
                this.extX = data.newPr;
                this.handleUpdateExtents();
                break;
            }
            case historyitem_Xfrm_SetExtY:
            {
                this.extY = data.newPr;
                this.handleUpdateExtents();
                break;
            }
            case historyitem_Xfrm_SetChOffX:
            {
                this.chOffX = data.newPr;
                this.handleUpdateChildOffset();
                break;
            }
            case historyitem_Xfrm_SetChOffY:
            {
                this.chOffY = data.newPr;
                this.handleUpdateChildOffset();
                break;
            }
            case historyitem_Xfrm_SetChExtX:
            {
                this.chExtX = data.newPr;
                this.handleUpdateChildExtents();
                break;
            }
            case historyitem_Xfrm_SetChExtY:
            {
                this.chExtY = data.newPr;
                this.handleUpdateChildExtents();
                break;
            }
            case historyitem_Xfrm_SetFlipH:
            {
                this.flipH = data.newPr;
                this.handleUpdateFlip();
                break;
            }
            case historyitem_Xfrm_SetFlipV:
            {
                this.flipV = data.newPr;
                this.handleUpdateFlip();
                break;
            }
            case historyitem_Xfrm_SetRot:
            {
                this.rot = data.newPr;
                this.handleUpdateRot();
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Xfrm_SetOffX:
            case historyitem_Xfrm_SetOffY:
            case historyitem_Xfrm_SetExtX:
            case historyitem_Xfrm_SetExtY:
            case historyitem_Xfrm_SetChOffX:
            case historyitem_Xfrm_SetChOffY:
            case historyitem_Xfrm_SetChExtX:
            case historyitem_Xfrm_SetChExtY:
            case historyitem_Xfrm_SetRot:
            {
                writeDouble(w, data.newPr);
                break;
            }

            case historyitem_Xfrm_SetFlipH:
            case historyitem_Xfrm_SetFlipV:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Xfrm_SetOffX:
            {
                this.offX = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetOffY:
            {
                this.offY = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetExtX:
            {
                this.extX = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetExtY:
            {
                this.extY = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetChOffX:
            {
                this.chOffX = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetChOffY:
            {
                this.chOffY = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetChExtX:
            {
                this.chExtX = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetChExtY:
            {
                this.chExtY = readDouble(r);
                break;
            }
            case historyitem_Xfrm_SetFlipH:
            {
                this.flipH = readBool(r);
                break;
            }
            case historyitem_Xfrm_SetFlipV:
            {
                this.flipV = readBool(r);
                break;
            }
            case historyitem_Xfrm_SetRot:
            {
                this.rot = readDouble(r);
                break;
            }
        }
    }
};

function CSpPr()
{
    this.bwMode    = 0;

    this.xfrm       = new CXfrm();//TODO: временная заглушка чтоб работало в ворде.
    this.geometry   = null;//new Geometry();
    this.Fill       = null;
    this.ln         = null;
    this.parent     = null;
    this.merge = function(spPr)
    {
        /*if(spPr.xfrm != null)
         {
         this.xfrm.merge(spPr.xfrm);
         }  */
        if(spPr.geometry!=null)
        {
            this.geometry = spPr.geometry.createDuplicate();
        }

        if(spPr.Fill!=null && spPr.Fill.fill!=null)
        {
            //this.Fill = spPr.Fill.createDuplicate();
        }

        /*if(spPr.ln!=null)
         {
         if(this.ln == null)
         this.ln = new CLn();
         this.ln.merge(spPr.ln);
         }  */
    };

    this.createDuplicate = function()
    {
        var duplicate = new CSpPr();
        duplicate.bwMode = this.bwMode;
        duplicate.xfrm = this.xfrm.createDuplicate();
        if(this.geometry!=null)
            duplicate.geometry = this.geometry.createDuplicate();
        if(this.geometry!=null)
            duplicate.geometry = this.geometry.createDuplicate();
        if(this.Fill!=null)
        {
            duplicate.Fill = this.Fill.createDuplicate();
        }
        if(this.ln!=null)
        {
            duplicate.ln = this.ln.createDuplicate();
        }
        return duplicate;
    };

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSpPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SpPr;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setBwMode: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetBwMode, oldPr: this.bwMode, newPr: pr});
        this.bwMode = pr;
    },

    setXfrm: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetXfrm, oldPr: this.xfrm, newPr: pr});
        this.xfrm = pr;
    },

    setGeometry: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetGeometry, oldPr: this.geometry, newPr: pr});
        this.geometry = pr;
        this.handleUpdateGeometry();
    },

    setFill: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetFill, oldPr: this.Fill, newPr: pr});
        this.Fill = pr;
        if(this.parent && this.parent.recalcBrush)
        {
            this.parent.recalcBrush();
        }
    },

    setLn: function(pr)
    {
        History.Add(this, {Type: historyitem_SpPr_SetLn, oldPr: this.ln, newPr: pr});
        this.ln = pr;
        if(this.parent && this.parent.recalcPen)
        {
            this.parent.recalcPen();
        }
    },

    handleUpdatePosition: function()
    {
        if(this.parent && this.parent.handleUpdatePosition)
        {
            this.parent.handleUpdatePosition();
        }
    },

    handleUpdateExtents: function()
    {
        if(this.parent && this.parent.handleUpdateExtents)
        {
            this.parent.handleUpdateExtents();
        }
    },

    handleUpdateChildOffset: function()
    {
        if(this.parent && this.parent.handleUpdateChildOffset)
        {
            this.parent.handleUpdateChildOffset();
        }
    },

    handleUpdateChildExtents: function()
    {
        if(this.parent && this.parent.handleUpdateChildExtents)
        {
            this.parent.handleUpdateChildExtents();
        }
    },

    handleUpdateFlip: function()
    {
        if(this.parent && this.parent.handleUpdateFlip)
        {
            this.parent.handleUpdateFlip();
        }
    },

    handleUpdateRot: function()
    {
        if(this.parent && this.parent.handleUpdateRot)
        {
            this.parent.handleUpdateRot();
        }
    },


    handleUpdateGeometry: function()
    {
        if(this.parent && this.parent.handleUpdateGeometry)
        {
            this.parent.handleUpdateGeometry();
        }
    },

    handleUpdateFill: function()
    {
        if(this.parent && this.parent.handleUpdateFill)
        {
            this.parent.handleUpdateFill();
        }
    },
    handleUpdateLn: function()
    {
        if(this.parent && this.parent.handleUpdateLn)
        {
            this.parent.handleUpdateLn();
        }
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SpPr_SetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_SpPr_SetBwMode:
            {
                this.bwMode = data.oldPr;
                break;
            }
            case historyitem_SpPr_SetXfrm:
            {
                this.xfrm = data.oldPr;
                break;
            }
            case historyitem_SpPr_SetGeometry:
            {
                this.geometry = data.oldPr;
                this.handleUpdateGeometry();
                break;
            }
            case historyitem_SpPr_SetFill:
            {
                this.Fill = data.oldPr;
                this.handleUpdateFill();
                break;
            }
            case historyitem_SpPr_SetLn:
            {
                this.ln = data.oldPr;
                this.handleUpdateLn();
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SpPr_SetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_SpPr_SetBwMode:
            {
                this.bwMode = data.newPr;
                break;
            }
            case historyitem_SpPr_SetXfrm:
            {
                this.xfrm = data.newPr;
                break;
            }
            case historyitem_SpPr_SetGeometry:
            {
                this.geometry = data.newPr;
                this.handleUpdateGeometry();
                break;
            }
            case historyitem_SpPr_SetFill:
            {
                this.Fill = data.newPr;
                this.handleUpdateFill();
                break;
            }
            case historyitem_SpPr_SetLn:
            {
                this.ln = data.newPr;
                this.handleUpdateLn();
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_SpPr_SetBwMode:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_SpPr_SetXfrm:
            case historyitem_SpPr_SetGeometry:
            case historyitem_SpPr_SetFill:
            case historyitem_SpPr_SetLn:
            case historyitem_SpPr_SetParent:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SpPr_SetBwMode:
            {
                this.bwMode = readBool(r);
                break;
            }
            case historyitem_SpPr_SetXfrm:
            {
                this.xfrm = readObject(r);
                break;
            }
            case historyitem_SpPr_SetGeometry:
            {
                this.geometry = readObject(r);
                this.handleUpdateGeometry();
                break;
            }
            case historyitem_SpPr_SetFill:
            {
                this.Fill = readObject(r);
                this.handleUpdateFill();
                break;
            }
            case historyitem_SpPr_SetLn:
            {
                this.ln = readObject(r);
                this.handleUpdateLn();
                break;
            }
            case historyitem_SpPr_SetParent:
            {
                this.parent = readObject(r);
                break;
            }
        }
    }
};
// ----------------------------------

// THEME ----------------------------

var g_clr_MIN = 0;
var g_clr_accent1 = 0;
var g_clr_accent2 = 1;
var g_clr_accent3 = 2;
var g_clr_accent4 = 3;
var g_clr_accent5 = 4;
var g_clr_accent6 = 5;
var g_clr_dk1 = 6;
var g_clr_dk2 = 7;
var g_clr_folHlink = 8;
var g_clr_hlink = 9;
var g_clr_lt1 = 10;
var g_clr_lt2 = 11;
var g_clr_MAX = 11;

var g_clr_bg1 = g_clr_lt1;
var g_clr_bg2 = g_clr_lt2;
var g_clr_tx1 = g_clr_dk1;
var g_clr_tx2 = g_clr_dk2;

var phClr   = 14;
var tx1     = 15;
var tx2     = 16;

function ClrScheme()
{
    this.name = "";
    this.colors = [];

    for (var i = g_clr_MIN; i <= g_clr_MAX; i++)
        this.colors[i] = null;

    this.isIdentical = function(clrScheme)
    {
        if(clrScheme == null)
        {
            return false;
        }
        if(!(clrScheme instanceof ClrScheme) )
        {
            return false;
        }
        if(clrScheme.name != this.name)
        {
            return false;
        }
        for(var _clr_index = g_clr_MIN; _clr_index <= g_clr_MAX; ++_clr_index)
        {
            if(this.colors[i] != clrScheme.colors[i])
            {
                return false;
            }
        }
        return true;
    };

    this.createDuplicate = function()
    {
        var _duplicate = new ClrScheme();
        _duplicate.name = this.name;
        for(var _clr_index = 0; _clr_index <= this.colors.length; ++_clr_index)
        {
            _duplicate.colors[_clr_index] = this.colors[_clr_index];
        }
        return _duplicate;
    };
}

ClrScheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ClrScheme;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setName: function(name)
    {
        History.Add(this, {Type: historyitem_ClrScheme_SetName, oldPr: this.name, newPr: name});
        this.name = name;
    },

    addColor: function(index, color)
    {
        History.Add(this, {Type: historyitem_ClrScheme_AddClr, index: index, newColor: color, oldColor: this.colors[index]});
        this.colors[index] = color;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ClrScheme_SetName:
            {
                this.name = data.oldPr;
                break;
            }
            case historyitem_ClrScheme_AddClr:
            {
                this.colors[data.index] = data.oldColor;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ClrScheme_SetName:
            {
                this.name = data.newPr;
                break;
            }
            case historyitem_ClrScheme_AddClr:
            {
                this.colors[data.index] = data.newColor;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ClrScheme_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_ClrScheme_AddClr:
            {
                writeLong(w, data.index);
                writeOject(w, data.newColor);
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_ClrScheme_SetName:
            {
                this.name = readString(r);
                break;
            }
            case historyitem_ClrScheme_AddClr:
            {
                var index = readLong(r);
                var color = readObject(r);
                if(isRealNumber(index) && isRealObejct(color))
                {
                    this.colors[index] = color;
                }
                break;
            }
        }
    }

};

function ClrMap()
{
    this.color_map = [];

    for (var i = g_clr_MIN; i <= g_clr_MAX; i++)
        this.color_map[i] = null;

    this.createDuplicate =  function()
    {
        var _copy = new ClrMap();
        for(var _color_index = g_clr_MIN; _color_index <= this.color_map.length; ++_color_index)
        {
            _copy.color_map[_color_index] = this.color_map[_color_index];
        }
        return _copy;
    };

    if(typeof g_oIdCounter != "undefined" && typeof g_oTableId != "undefined" && g_oTableId && g_oIdCounter)
    {
        this.Id = g_oIdCounter.Get_NewId();
        g_oTableId.Add(this, this.Id);
    }

}

ClrMap.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ClrMap;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setClr: function(index, clr)
    {
        History.Add(this, {Type: historyitem_ClrMap_SetClr, oldColor: this.color_map[index], newColor: clr, index: index});
        this.color_map[index] = clr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ClrMap_SetClr:
            {
                this.color_map[data.index] = data.oldColor;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ClrMap_SetClr:
            {
                this.color_map[data.index] = data.newColor;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ClrMap_SetClr:
            {
                writeLong(w, data.index);
                writeObject(w, data.newColor);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ClrMap_SetClr:
            {
                var index = readLong(r);
                var color = readObject(r);
                if(isRealNumber(index) && isReaObject(color))
                {
                    this.color_map[index] = color;
                }
                break;
            }
        }
    }
};
function ExtraClrScheme()
{
    this.clrScheme = null;
    this.clrMap = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

ExtraClrScheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ExtraClrScheme;
    },

    setClrScheme: function(pr)
    {
        History.Add(this, {Type: historyitem_ExtraClrScheme_SetClrScheme, oldPr: this.clrScheme, newPr: pr});
        this.clrScheme = pr;
    },

    setClrMap: function(pr)
    {
        History.Add(this, {Type: historyitem_ExtraClrScheme_SetClrMap, oldPr: this.clrMap, newPr: pr});
        this.clrMap = pr;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ExtraClrScheme_SetClrScheme:
            {
                this.clrScheme = data.oldPr;
                break;
            }
            case historyitem_ExtraClrScheme_SetClrMap:
            {
                this.clrMap = data.oldPr;
                break;
            }
        }
    },


    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ExtraClrScheme_SetClrScheme:
            {
                this.clrScheme = data.newPr;
                break;
            }
            case historyitem_ExtraClrScheme_SetClrMap:
            {
                this.clrMap = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_ExtraClrScheme_SetClrScheme:
            case historyitem_ExtraClrScheme_SetClrMap:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },


    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_ExtraClrScheme_SetClrScheme:
            {
                this.clrScheme = readObject(r);
                break;
            }
            case historyitem_ExtraClrScheme_SetClrMap:
            {
                this.clrMap = readObject(r);
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function FontCollection()
{
    this.latin = null;
    this.ea   = null;
    this.cs   = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}

FontCollection.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_FontCollection;
    },

    setLatin: function(pr)
    {
        History.Add(this, {Type: historyitem_FontCollection_SetLatin, oldPr: this.latin, newPr: pr});
        this.latin = pr;
    },

    setEA: function(pr)
    {
        History.Add(this, {Type: historyitem_FontCollection_SetEA, oldPr: this.ea, newPr: pr});
        this.ea = pr;
    },

    setCS: function(pr)
    {
        History.Add(this, {Type: historyitem_FontCollection_SetCS, oldPr: this.cs, newPr: pr});
        this.cs = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_FontCollection_SetLatin:
            {
                this.latin = data.oldPr;
                break;
            }
            case historyitem_FontCollection_SetEA:
            {
                this.ea = data.oldPr;
                break;
            }
            case historyitem_FontCollection_SetCS:
            {
                this.cs = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_FontCollection_SetLatin:
            {
                this.latin = data.newPr;
                break;
            }
            case historyitem_FontCollection_SetEA:
            {
                this.ea = data.newPr;
                break;
            }
            case historyitem_FontCollection_SetCS:
            {
                this.cs = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_FontCollection_SetLatin:
            case historyitem_FontCollection_SetEA:
            case historyitem_FontCollection_SetCS:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_FontCollection_SetLatin:
            {
                this.latin = readString(r);
                break;
            }
            case historyitem_FontCollection_SetEA:
            {
                this.ea = readString(r);
                break;
            }
            case historyitem_FontCollection_SetCS:
            {
                this.cs = readString(r);
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function FontScheme()
{
    this.name = "";

    this.majorFont = new FontCollection();
    this.minorFont = new FontCollection();
}

FontScheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_FontScheme;
    },


    setName: function(pr)
    {
        History.Add(this, {Type: historyitem_FontScheme_SetName, oldPr: this.name, newPr: pr});
        this.name = pr;
    },

    setMajorFont: function(pr)
    {
        History.Add(this, {Type: historyitem_FontScheme_SetMajorFont, oldPr: this.majorFont, newPr: pr});
        this.majorFont = pr;
    },
    setMinorFont: function(pr)
    {
        History.Add(this, {Type: historyitem_FontScheme_SetMinorFont, oldPr: this.minorFont, newPr: pr});
        this.minorFont = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_FontScheme_SetName:
            {
                this.name = data.oldPr;
                break;
            }
            case historyitem_FontScheme_SetMajorFont:
            {
                this.majorFont = data.oldPr;
                break;
            }
            case historyitem_FontScheme_SetMinorFont:
            {
                this.minorFont = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_FontScheme_SetName:
            {
                this.name = data.newPr;
                break;
            }
            case historyitem_FontScheme_SetMajorFont:
            {
                this.majorFont = data.newPr;
                break;
            }
            case historyitem_FontScheme_SetMinorFont:
            {
                this.minorFont = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type)
        switch(data.Type)
        {
            case historyitem_FontScheme_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_FontScheme_SetMajorFont:
            case historyitem_FontScheme_SetMinorFont:
            {
                writeObject(w, data.newPr);
                this.majorFont = data.newPr;
                break;
            }
        }
    },
    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_FontScheme_SetName:
            {
                this.name = readString(r);
                break;
            }
            case historyitem_FontScheme_SetMajorFont:
            {
                this.majorFont = readObject(r);
                break;
            }
            case historyitem_FontScheme_SetMinorFont:
            {
                this.minorFont = readObject(r);
                break;
            }
        }
    }
};

function FmtScheme()
{
    this.name           = "";
    this.fillStyleLst   = [];
    this.lnStyleLst     = [];
    this.effectStyleLst = null;
    this.bgFillStyleLst = [];

    this.GetFillStyle = function(number)
    {
        if (number >= 1 && number <= 999)
        {
            var ret = this.fillStyleLst[number - 1];
            if (undefined === ret)
                return null;
            return ret.createDuplicate();
        }
        else if (number >= 1001)
        {
            var ret = this.bgFillStyleLst[number - 1001];
            if (undefined === ret)
                return null;
            return ret.createDuplicate();
        }

        return null;
    }

}

FmtScheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getObjectType: function()
    {
        return historyitem_type_FormatScheme;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setName: function(pr)
    {
        History.Add(this, {Type:historyitem_FormatScheme_SetName, oldPr: this.name, newPr: pr});
        this.name = pr;
    },
    addFillToStyleLst: function(pr)
    {
        History.Add(this, {Type:historyitem_FormatScheme_AddFillToStyleLst, pr: pr});
        this.fillStyleLst.push(pr);
    },
    addLnToStyleLst: function(pr)
    {
        History.Add(this, {Type:historyitem_FormatScheme_AddLnToStyleLst, pr: pr});
        this.lnStyleLst.push(pr);
    },
    addEffectToStyleLst: function(pr)
    {
        History.Add(this, {Type:historyitem_FormatScheme_AddEffectToStyleLst, pr: pr});
        this.effectStyleLst.push(pr);
    },
    addBgFillToStyleLst: function(pr)
    {
        History.Add(this, {Type:historyitem_FormatScheme_AddBgFillToStyleLst, pr: pr});
        this.bgFillStyleLst.push(pr);
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_FormatScheme_SetName:
            {
                this.name = data.oldPr;
                break;
            }
            case historyitem_FormatScheme_SetFillStyleLst:
            {
                for(var i = this.fillStyleLst.length - 1; i > -1; --i)
                {
                    if(this.fillStyleLst[i] === data.pr)
                    {
                        this.fillStyleLst.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_FormatScheme_SetLnStyleLst:
            {
                for(var i = this.lnStyleLst.length - 1; i > -1; --i)
                {
                    if(this.lnStyleLst[i] === data.pr)
                    {
                        this.lnStyleLst.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_FormatScheme_SetEffectStyleLst:
            {
                for(var i = this.effectStyleLst.length - 1; i > -1; --i)
                {
                    if(this.effectStyleLst[i] === data.pr)
                    {
                        this.effectStyleLst.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_FormatScheme_SetBgFillStyleLst:
            {
                for(var i = this.bgFillStyleLst.length - 1; i > -1; --i)
                {
                    if(this.bgFillStyleLst[i] === data.pr)
                    {
                        this.bgFillStyleLst.splice(i, 1);
                        break;
                    }
                }
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_FormatScheme_SetName:
            {
                this.name = data.newPr;
                break;
            }
            case historyitem_FormatScheme_SetFillStyleLst:
            {
                this.fillStyleLst.push(data.pr);
                break;
            }
            case historyitem_FormatScheme_SetLnStyleLst:
            {
                this.lnStyleLst.push(data.pr);
                break;
            }
            case historyitem_FormatScheme_SetEffectStyleLst:
            {
                this.effectStyleLst.push(data.pr);
                break;
            }
            case historyitem_FormatScheme_SetBgFillStyleLst:
            {
                this.bgFillStyleLst.push(data.pr);
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_FormatScheme_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_FormatScheme_SetFillStyleLst:
            case historyitem_FormatScheme_SetLnStyleLst:
            case historyitem_FormatScheme_SetEffectStyleLst:
            case historyitem_FormatScheme_SetBgFillStyleLst:
            {
                writeObject(w, data.pr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_FormatScheme_SetName:
            {
                this.name = readString(r);
                break;
            }
            case historyitem_FormatScheme_SetFillStyleLst:
            {
                var pr = readObject(r);
                if(isRealObject(pr))
                {
                    this.fillStyleLst.push(pr);
                }
                break;
            }
            case historyitem_FormatScheme_SetLnStyleLst:
            {
                var pr = readObject(r);
                if(isRealObject(pr))
                {
                    this.lnStyleLst.push(pr);
                }
                break;
            }
            case historyitem_FormatScheme_SetEffectStyleLst:
            {
                var pr = readObject(r);
                if(isRealObject(pr))
                {
                    this.effectStyleLst.push(pr);
                }
                break;
            }
            case historyitem_FormatScheme_SetBgFillStyleLst:
            {
                var pr = readObject(r);
                if(isRealObject(pr))
                {
                    this.bgFillStyleLst.push(pr);
                }
                break;
            }
        }
    }
};

function ThemeElements()
{
    this.clrScheme = new ClrScheme();
    this.fontScheme = new FontScheme();
    this.fmtScheme = new FmtScheme();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

ThemeElements.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ThemeElements;
    },

    setClrScheme: function(pr)
    {
        History.Add(this, {Type: historyitem_ThemeElements_SetClrScheme, oldPr: this.clrScheme, newPr: pr});
        this.clrScheme = pr;
    },

    setFontScheme: function(pr)
    {
        History.Add(this, {Type: historyitem_ThemeElements_SetFontScheme, oldPr: this.fontScheme, newPr: pr});
        this.fontScheme = pr;
    },

    setFmtScheme: function(pr)
    {
        History.Add(this, {Type: historyitem_ThemeElements_SetFmtScheme, oldPr: this.fmtScheme, newPr: pr});
        this.fmtScheme = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ThemeElements_SetClrScheme:
            {
                this.clrScheme = data.oldPr;
                break;
            }
            case historyitem_ThemeElements_SetFontScheme:
            {
                this.fontScheme = data.oldPr;
                break;
            }
            case historyitem_ThemeElements_SetFmtScheme:
            {
                this.fmtScheme = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ThemeElements_SetClrScheme:
            {
                this.clrScheme = data.newPr;
                break;
            }
            case historyitem_ThemeElements_SetFontScheme:
            {
                this.fontScheme = data.newPr;
                break;
            }
            case historyitem_ThemeElements_SetFmtScheme:
            {
                this.fmtScheme = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        switch(data.Type)
        {
            case historyitem_ThemeElements_SetClrScheme:
            case historyitem_ThemeElements_SetFontScheme:
            case historyitem_ThemeElements_SetFmtScheme:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ThemeElements_SetClrScheme:
            {
                this.clrScheme = readObject(r);
                break;
            }
            case historyitem_ThemeElements_SetFontScheme:
            {
                this.fontScheme = readObject(r);
                break;
            }
            case historyitem_ThemeElements_SetFmtScheme:
            {
                this.fmtScheme = readObject(r);
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CTheme()
{
    this.name = "";
    this.themeElements = new ThemeElements();
    this.spDef = null;
    this.lnDef = null;
    this.txDef = null;

    this.extraClrSchemeLst = [];

    // pointers
    this.presentation = null;
    this.clrMap = null;

    this.getFillStyle = function(idx)
    {
        if (this.themeElements.fmtScheme.fillStyleLst[idx-1])
        {
            return this.themeElements.fmtScheme.fillStyleLst[idx-1].createDuplicate();
        }
        return new CUniFill();
    };
    this.getLnStyle = function(idx)
    {
        if (this.themeElements.fmtScheme.lnStyleLst[idx-1])
        {
            return this.themeElements.fmtScheme.lnStyleLst[idx-1].createDuplicate();
        }
        return new CLn();
    };


    this.changeColorScheme = function(clrScheme)
    {
        History.Add(this, {Type: historyitem_ChangeColorScheme, oldPr: this.themeElements.clrScheme, newPr: clrScheme});
        this.themeElements.clrScheme = clrScheme;
    };

    this.setFontScheme = function(fontScheme)
    {
        History.Add(this, {Type: historyitem_ChangeFontScheme, oldPr: this.themeElements.fontScheme, newPr: fontScheme});
        this.themeElements.fontScheme = fontScheme;
    };

    this.setFormatScheme = function(fmtScheme)
    {
        History.Add(this, {Type: historyitem_ChangeFmtScheme, oldPr: this.themeElements.fmtScheme, newPr: fmtScheme});
        this.themeElements.fmtScheme = fmtScheme;
    };

    this.Refresh_RecalcData= function()
    {
        var slides = editor.WordControl.m_oLogicDocument.Slides;
        for(var  i = 0; i < slides.length; ++i)
        {
            var slide = slides[i];
            if(slide.Layout && slide.Layout.Master && slide.Layout.Master.Theme === this)
            {
                slide.recalcAllColors();
            }
        }

    };


    this.Undo = function(data)
    {
        switch(data.Type)
        {
            case historyitem_ChangeColorScheme:
            {
                this.themeElements.clrScheme = data.oldPr;
                break;
            }
            case historyitem_ChangeFontScheme:
            {
                this.themeElements.fontScheme = data.oldPr;
                break;
            }

            case historyitem_ChangeFmtScheme:
            {
                this.themeElements.fmtScheme = data.oldPr;
                break;
            }
        }
        var _slides = editor.WordControl.m_oLogicDocument.Slides;
        var _slide_count = _slides.length;
        for(var _slide_index = 0; _slide_index < _slide_count; ++_slide_index)
        {
			var _cur_slide =_slides[_slide_index];
            var _cur_theme = _cur_slide.Layout.Master.Theme;
            if(_cur_theme === this)
            {
                _cur_slide.recalcAllColors();
                _cur_slide.Layout.recalcAll();
                _cur_slide.Layout.Master.recalcAll();
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
            }
        }
    };

    this.Redo = function(data)
    {
        switch(data.Type)
        {
            case historyitem_ChangeColorScheme:
            {
                this.themeElements.clrScheme = data.newPr;
                break;
            }
            case historyitem_ChangeFontScheme:
            {
                this.themeElements.fontScheme = data.newPr;
                break;
            }

            case historyitem_ChangeFmtScheme:
            {
                this.themeElements.fmtScheme = data.newPr;
                break;
            }
        }

        var _slides = editor.WordControl.m_oLogicDocument.Slides;
        var _slide_count = _slides.length;
        for(var _slide_index = 0; _slide_index < _slide_count; ++_slide_index)
        {
			var _cur_slide =_slides[_slide_index];
			var _cur_theme = _cur_slide.Layout.Master.Theme;
            if(_cur_theme === this)
            {
                _cur_slide.recalcAllColors();
                _cur_slide.Layout.recalcAll();
                _cur_slide.Layout.Master.recalcAll();
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
            }
        }
    };

    this.getObjecType = function()
    {
        return historyitem_type_Theme;
    },

    this.Write_ToBinary2 = function(w)
    {
        w.WriteLong(historyitem_type_Theme);
        w.WriteString2(this.Id);
    };

    this.Read_FromBinary2 = function(r)
    {
        this.Id = r.GetString2();
    };

    this.Save_Changes = function(data, w)
    {
        w.WriteLong(historyitem_type_Theme);
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_ChangeColorScheme:
            case historyitem_ChangeFontScheme:
            case historyitem_ChangeFmtScheme:
            {
                data.newPr.Write_ToBinary2(w);
                break;
            }
        }
    };

    this.Load_Changes = function(r)
    {
        if(r.GetLong() === historyitem_type_Theme)
        {
			var _cur_slide, _cur_theme;
			var type = r.GetLong();
            switch(type)
            {
                case historyitem_ChangeColorScheme:
                {
                    this.themeElements.clrScheme = new ClrScheme();
                    this.themeElements.clrScheme.Read_FromBinary2(r);
                    var _slides = editor.WordControl.m_oLogicDocument.Slides;
                    var _slide_count = _slides.length;
                    for(var _slide_index = 0; _slide_index < _slide_count; ++_slide_index)
                    {
                        _cur_slide =_slides[_slide_index];
                        _cur_theme = _cur_slide.Layout.Master.Theme;
                        if(_cur_theme === this)
                        {
                            _cur_slide.recalcAllColors();
                            _cur_slide.Layout.recalcAll();
                            _cur_slide.Layout.Master.recalcAll();
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                        }
                    }
                    break;
                }
                case historyitem_ChangeFontScheme:
                {
                    this.themeElements.fontScheme = new FontScheme();
                    this.themeElements.fontScheme.Read_FromBinary2(r);
                    var _slides = editor.WordControl.m_oLogicDocument.Slides;
                    var _slide_count = _slides.length;
                    for(var _slide_index = 0; _slide_index < _slide_count; ++_slide_index)
                    {
                        _cur_slide =_slides[_slide_index];
                        _cur_theme = _cur_slide.Layout.Master.Theme;
                        if(_cur_theme === this)
                        {
                            _cur_slide.recalcAllColors();
                            _cur_slide.Layout.recalcAll();
                            _cur_slide.Layout.Master.recalcAll();
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                        }
                    }
                    break;
                }
                case historyitem_ChangeFmtScheme:
                {
                    this.themeElements.fmtScheme = new FmtScheme();
                    this.themeElements.fmtScheme.Read_FromBinary2(r);
                    var _slides = editor.WordControl.m_oLogicDocument.Slides;
                    var _slide_count = _slides.length;
                    for(var _slide_index = 0; _slide_index < _slide_count; ++_slide_index)
                    {
                        _cur_slide =_slides[_slide_index];
                        _cur_theme = _cur_slide.Layout.Master.Theme;
                        if(_cur_theme === this)
                        {
                            _cur_slide.recalcAllColors();
                            _cur_slide.Layout.recalcAll();
                            _cur_slide.Layout.Master.recalcAll();
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Id] = _cur_slide;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Id] = _cur_slide.Layout;
                            editor.WordControl.m_oLogicDocument.recalcMap[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
                        }
                    }
                    break;
                }
            }
        }
    };

    this.Get_Id = function()
    {
        return this.Id;
    };

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CTheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};
// ----------------------------------

// CSLD -----------------------------

function HF()
{
    this.dt     = true;
    this.ftr    = true;
    this.hdr    = true;
    this.sldNum = true;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

HF.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_HF;
    },

    setDt: function(pr)
    {
        History.Add(this, {Type: historyitem_HF_SetDt, oldPr: this.dt, newPr: pr});
        this.dt = pr;
    },
    setFtr: function(pr)
    {
        History.Add(this, {Type: historyitem_HF_SetFtr, oldPr: this.ftr, newPr: pr});
        this.ftr = pr;
    },
    setHdr: function(pr)
    {
        History.Add(this, {Type: historyitem_HF_SetHdr, oldPr: this.hdr, newPr: pr});
        this.hdr = pr;
    },
    setSldNum: function(pr)
    {
        History.Add(this, {Type: historyitem_HF_SetSldNum, oldPr: this.sldNum, newPr: pr});
        this.sldNum = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_HF_SetDt:
            {
                this.dt = data.oldPr;
                break;
            }
            case historyitem_HF_SetFtr:
            {
                this.ftr = data.oldPr;
                break;
            }
            case historyitem_HF_SetHdr:
            {
                this.hdr = data.oldPr;
                break;
            }
            case historyitem_HF_SetSldNum:
            {
                this.sldNum = data.oldPr;
                break;
            }
        }
    },


    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_HF_SetDt:
            {
                this.dt = data.newPr;
                break;
            }
            case historyitem_HF_SetFtr:
            {
                this.ftr = data.newPr;
                break;
            }
            case historyitem_HF_SetHdr:
            {
                this.hdr = data.newPr;
                break;
            }
            case historyitem_HF_SetSldNum:
            {
                this.sldNum = data.newPr;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_HF_SetDt:
            case historyitem_HF_SetFtr:
            case historyitem_HF_SetHdr:
            case historyitem_HF_SetSldNum:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(data.Type)
        {
            case historyitem_HF_SetDt:
            {
                this.dt = readBool(r);
                break;
            }
            case historyitem_HF_SetFtr:
            {
                this.ftr = readBool(r);
                break;
            }
            case historyitem_HF_SetHdr:
            {
                this.hdr = readBool(r);
                break;
            }
            case historyitem_HF_SetSldNum:
            {
                this.sldNum = readBool(r);
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CBgPr()
{
    this.Fill         = null;
    this.shadeToTitle = false;
    this.merge = function(bgPr)
    {

        if(this.Fill == null)
        {
            this.Fill = new CUniFill();
            if(bgPr.Fill != null)
            {
                this.Fill.merge(bgPr.Fill)
            }
        }
    };

    this.createFullCopy = function()
    {
        var _copy = new CBgPr();
        if(this.Fill != null)
        {
            _copy.Fill = this.Fill.createDuplicate();
        }
        _copy.shadeToTitle = this.shadeToTitle;
        return _copy;
    };

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}

CBgPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjecType: function()
    {
        return historyitem_type_BgPr;
    },

    setFill: function(pr)
    {
        History.Add(this, {Type: historyitem_BgPr_SetFill, oldPr: this.Fill, newPr: pr});
        this.Fill = pr;
    },

    setShadeToTitle: function(pr)
    {
        History.Add(this, {Type: historyitem_BgPr_SetShadeToTitle, oldPr: this.shadeToTitle, newPr: pr});
        this.shadeToTitle = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BgPr_SetFill:
            {
                this.Fill = data.oldPr;
                break;
            }
            case historyitem_BgPr_SetShadeToTitle:
            {
                this.shadeToTitle = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BgPr_SetFill:
            {
                this.Fill = data.newPr;
                break;
            }
            case historyitem_BgPr_SetShadeToTitle:
            {
                this.shadeToTitle = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_BgPr_SetFill:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_BgPr_SetShadeToTitle:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_BgPr_SetFill:
            {
                this.Fill = readObject(r);
                break;
            }
            case historyitem_BgPr_SetShadeToTitle:
            {
                this.shadeToTitle = readBool(r);
                break;
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CBg()
{
    this.bwMode = null;
    this.bgPr   = null;
    this.bgRef  = null;

    this.merge =  function(bg)
    {
        if(this.bgPr == null)
        {
            this.bgPr = new CBgPr();
            if(bg.bgPr != null)
            {
                this.bgPr.merge(bg.bgPr);
            }
        }
    };

    this.createFullCopy = function()
    {
        var _copy = new CBg();
        _copy.bwMode = this.bwMode;
        if(this.bgPr != null)
        {
            _copy.bgPr = this.bgPr.createFullCopy();
        }
        if(this.bgRef != null)
        {
            _copy.bgRef = this.bgRef.createDuplicate();
        }
        return _copy;
    };

    this.Write_ToBinary2 = function(w)
    {
        w.WriteBool(isRealObject(this.bgPr));
        if(isRealObject(this.bgPr))
        {
            this.bgPr.Write_ToBinary2(w);
        }
    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            this.bgPr = new CBgPr();
            this.bgPr.Read_FromBinary2(r);
        }
    };
}

CBg.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    setBwMode: function(pr)
    {
        History.Add(this, {Type: historyitem_BgSetBwMode, oldPr: this.bwMode, newPr: pr});
        this.bwMode = pr;
    },
    setBgPr: function(pr)
    {
        History.Add(this, {Type: historyitem_BgSetBgPr, oldPr: this.bgPr, newPr: pr});
        this.bgPr = pr;
    },
    setBgRef: function(pr)
    {
        History.Add(this, {Type: historyitem_BgSetBgRef, oldPr: this.bgRef, newPr: pr});
        this.bgRef = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_BgSetBwMode:
            {
                this.bwMode = data.oldPr;
                break;
            }
            case historyitem_BgSetBgPr:
            {
                this.bgPr = data.oldPr;
                break;
            }
            case historyitem_BgSetBgRef:
            {
                this.bgRef = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_BgSetBwMode:
            {
                this.bwMode = data.newPr;
                break;
            }
            case historyitem_BgSetBgPr:
            {
                this.bgPr = data.newPr;
                break;
            }
            case historyitem_BgSetBgRef:
            {
                this.bgRef = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_BgSetBwMode:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_BgSetBgPr:
            case historyitem_BgSetBgRef:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    getObjectType: function()
    {
        return historyitem_type_Bg;
    }
};

function CSld()
{
    this.name = "";
    this.Bg = null;
    this.spTree = [];//new GroupShape();

    this.merge = function(cSld)
    {
    };
    this.createFullCopy = function(parent, elementsManipulator)
    {
        var _copy = new CSld();
        _copy.name = this.name;

        if(this.Bg != null)
        {
            _copy.Bg = this.Bg.createFullCopy();
        }

        var _glyph_index;
        for(_glyph_index = 0; _glyph_index < this.spTree.length; ++_glyph_index)
        {
            if(typeof this.spTree[_glyph_index].createFullCopy === "function")
            {
                _copy.spTree[_glyph_index] = this.spTree[_glyph_index].createFullCopy(parent, elementsManipulator);
                _copy.spTree[_glyph_index].Recalculate();
                _copy.spTree[_glyph_index].updateCursorTypes();
            }
        }
        return _copy;
    };

}


CSld.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};
// ----------------------------------

// MASTERSLIDE ----------------------

function CTextStyle()
{
    this.defPPr = null;
    this.lvl1pPr = null;
    this.lvl2pPr = null;
    this.lvl3pPr = null;
    this.lvl4pPr = null;
    this.lvl5pPr = null;
    this.lvl6pPr = null;
    this.lvl7pPr = null;
    this.lvl8pPr = null;
    this.lvl9pPr = null;
}

CTextStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

function CTextStyles()
{
    this.titleStyle = null;
    this.bodyStyle = null;
    this.otherStyle = null;

    this.Write_ToBinary2 = function(w)
    {
        w.WriteBool(isRealObject(this.titleStyle));
        if(isRealObject(this.titleStyle))
        {
            this.titleStyle.Write_ToBinary2(w);
        }


        w.WriteBool(isRealObject(this.bodyStyle));
        if(isRealObject(this.bodyStyle))
        {
            this.bodyStyle.Write_ToBinary2(w);
        }

        w.WriteBool(isRealObject(this.otherStyle));
        if(isRealObject(this.otherStyle))
        {
            this.otherStyle.Write_ToBinary2(w);
        }
        w.WriteString2("test");
    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            this.titleStyle = new TextListStyle();
            this.titleStyle.Read_FromBinary2(r);
        }
        else
        {
            this.titleStyle = null;
        }


        if(r.GetBool())
        {
            this.bodyStyle = new TextListStyle();
            this.bodyStyle.Read_FromBinary2(r);
        }
        else
        {
            this.bodyStyle = null;
        }

        if(r.GetBool())
        {
            this.otherStyle = new TextListStyle();
            this.otherStyle.Read_FromBinary2(r);
        }
        else
        {
            this.otherStyle = null;
        }
        var s = r.GetString2();
    };
}


CTextStyles.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

//---------------------------

// SLIDELAYOUT ----------------------

//Layout types
var nSldLtTBlank                   = 0; // Blank ))
var nSldLtTChart                   = 1; //Chart)
var nSldLtTChartAndTx              = 2; //( Chart and Text ))
var nSldLtTClipArtAndTx            = 3; //Clip Art and Text)
var nSldLtTClipArtAndVertTx        = 4; //Clip Art and Vertical Text)
var nSldLtTCust                    = 5; // Custom ))
var nSldLtTDgm                     = 6; //Diagram ))
var nSldLtTFourObj                 = 7; //Four Objects)
var nSldLtTMediaAndTx              = 8; // ( Media and Text ))
var nSldLtTObj                     = 9; //Title and Object)
var nSldLtTObjAndTwoObj            = 10; //Object and Two Object)
var nSldLtTObjAndTx                = 11; // ( Object and Text ))
var nSldLtTObjOnly                 = 12; //Object)
var nSldLtTObjOverTx               = 13; // ( Object over Text))
var nSldLtTObjTx                   = 14; //Title, Object, and Caption)
var nSldLtTPicTx                   = 15; //Picture and Caption)
var nSldLtTSecHead                 = 16; //Section Header)
var nSldLtTTbl                     = 17; // ( Table ))
var nSldLtTTitle                   = 18; // ( Title ))
var nSldLtTTitleOnly               = 19; // ( Title Only ))
var nSldLtTTwoColTx                = 20; // ( Two Column Text ))
var nSldLtTTwoObj                  = 21; //Two Objects)
var nSldLtTTwoObjAndObj            = 22; //Two Objects and Object)
var nSldLtTTwoObjAndTx             = 23; //Two Objects and Text)
var nSldLtTTwoObjOverTx            = 24; //Two Objects over Text)
var nSldLtTTwoTxTwoObj             = 25; //Two Text and Two Objects)
var nSldLtTTx                      = 26; // ( Text ))
var nSldLtTTxAndChart              = 27; // ( Text and Chart ))
var nSldLtTTxAndClipArt            = 28; //Text and Clip Art)
var nSldLtTTxAndMedia              = 29; // ( Text and Media ))
var nSldLtTTxAndObj                = 30; // ( Text and Object ))
var nSldLtTTxAndTwoObj             = 31; //Text and Two Objects)
var nSldLtTTxOverObj               = 32; // ( Text over Object))
var nSldLtTVertTitleAndTx          = 33; //Vertical Title and Text)
var nSldLtTVertTitleAndTxOverChart = 34; //Vertical Title and Text Over Chart)
var nSldLtTVertTx                  = 35; //Vertical Text)





var _weight_body = 9;
var _weight_chart = 5;
var _weight_clipArt = 2;
var _weight_ctrTitle = 11;
var _weight_dgm = 4;
var _weight_media = 3;
var _weight_obj = 8;
var _weight_pic = 7;
var _weight_subTitle = 10;
var _weight_tbl = 6;
var _weight_title = 11;

var _ph_multiplier = 4;

var _ph_summ_blank = 0;
var _ph_summ_chart = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart);
var _ph_summ_chart_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ_dgm = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_dgm);
var _ph_summ_four_obj = Math.pow(_ph_multiplier, _weight_title) + 4*Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__media_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_media) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_two_obj = Math.pow(_ph_multiplier, _weight_title) + 3*Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj_only = Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__pic_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_pic) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__sec_head = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_subTitle);
var _ph_summ__tbl = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_tbl);
var _ph_summ__title_only = Math.pow(_ph_multiplier, _weight_title);
var _ph_summ__two_col_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_two_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_obj) +2* Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx_and_clip_art = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body) + + Math.pow(_ph_multiplier, _weight_clipArt);

var _arr_lt_types_weight = [];
_arr_lt_types_weight[0] =   _ph_summ_blank;
_arr_lt_types_weight[1] =   _ph_summ_chart;
_arr_lt_types_weight[2] =   _ph_summ_chart_and_tx;
_arr_lt_types_weight[3] =   _ph_summ_dgm;
_arr_lt_types_weight[4] =   _ph_summ_four_obj;
_arr_lt_types_weight[5] =   _ph_summ__media_and_tx;
_arr_lt_types_weight[6] =   _ph_summ__obj;
_arr_lt_types_weight[7] =   _ph_summ__obj_and_two_obj;
_arr_lt_types_weight[8] =   _ph_summ__obj_and_tx;
_arr_lt_types_weight[9] =   _ph_summ__obj_only;
_arr_lt_types_weight[10] =  _ph_summ__pic_tx;
_arr_lt_types_weight[11] =  _ph_summ__sec_head;
_arr_lt_types_weight[12] =  _ph_summ__tbl;
_arr_lt_types_weight[13] =  _ph_summ__title_only;
_arr_lt_types_weight[14] =  _ph_summ__two_col_tx;
_arr_lt_types_weight[15] =  _ph_summ__two_obj_and_tx;
_arr_lt_types_weight[16] =  _ph_summ__two_obj_and_two_tx;
_arr_lt_types_weight[17] =  _ph_summ__tx;
_arr_lt_types_weight[18] =  _ph_summ__tx_and_clip_art;

_arr_lt_types_weight.sort(function(a,b){return a-b;});


var _global_layout_summs_array = {};
_global_layout_summs_array["_" + _ph_summ_blank] = nSldLtTBlank;
_global_layout_summs_array["_" + _ph_summ_chart] = nSldLtTChart;
_global_layout_summs_array["_" + _ph_summ_chart_and_tx] = nSldLtTChartAndTx;
_global_layout_summs_array["_" + _ph_summ_dgm] = nSldLtTDgm;
_global_layout_summs_array["_" + _ph_summ_four_obj] = nSldLtTFourObj;
_global_layout_summs_array["_" + _ph_summ__media_and_tx] = nSldLtTMediaAndTx;
_global_layout_summs_array["_" + _ph_summ__obj] = nSldLtTObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_two_obj] = nSldLtTObjAndTwoObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_tx] = nSldLtTObjAndTx;
_global_layout_summs_array["_" + _ph_summ__obj_only] = nSldLtTObjOnly;
_global_layout_summs_array["_" + _ph_summ__pic_tx] = nSldLtTPicTx;
_global_layout_summs_array["_" + _ph_summ__sec_head] = nSldLtTSecHead;
_global_layout_summs_array["_" + _ph_summ__tbl] = nSldLtTTbl;
_global_layout_summs_array["_" + _ph_summ__title_only] = nSldLtTTitleOnly;
_global_layout_summs_array["_" + _ph_summ__two_col_tx] = nSldLtTTwoColTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_tx] = nSldLtTTwoObjAndTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_two_tx] = nSldLtTTwoTxTwoObj;
_global_layout_summs_array["_" + _ph_summ__tx] = nSldLtTTx;
_global_layout_summs_array["_" + _ph_summ__tx_and_clip_art] = nSldLtTTxAndClipArt;

/*function SlideLayout(slideMaster)
 {
 this.cSld = new CSld();
 this.clrMap = null; // override ClrMap

 this.hf = new HF();

 this.matchingName = "";
 this.preserve = false;
 this.showMasterPhAnim = false;
 //this.showMasterSp = false;
 this.type = null;

 this.userDrawn = true;

 this.ImageBase64 = "";

 // pointers
 this.Master = slideMaster;
 this.Theme = null;
 this.TableStyles = null;
 this.Vml = null;
 this.kind = LAYOUT_KIND;

 this.Width = 254;
 this.Height = 190.5;

 this.changeProportions = function(kW, kH)
 {
 var _graphic_objects = this.cSld.spTree;
 var _object_index;
 var _objects_count = _graphic_objects.length;
 for(_object_index = 0; _object_index < _objects_count; ++_object_index)
 {
 _graphic_objects[_object_index].changeProportions(kW, kH)
 }
 };


 this.setSize = function(width, height)
 {
 var _k_h = height/this.Height;
 var _k_w = width/this.Width;
 this.Width = width;
 this.Height = height;

 var _graphic_objects = this.cSld.spTree;
 var _objects_count = _graphic_objects.length;
 var _object_index;
 for(_object_index = 0; _object_index < _objects_count; ++_object_index)
 {
 _graphic_objects[_object_index].updateProportions(_k_w, _k_h);
 }
 };
 this.Calculate = function()
 {
 // нужно пробежаться по всем шейпам:
 // учесть тему во всех заливках
 // учесть тему во всех текстовых настройках,
 };


 this.calculateColors = function()
 {
 var _shapes = this.cSld.spTree;
 var _shapes_count = _shapes.length;
 var _shape_index;
 for(_shape_index = 0; _shape_index < _shapes_count; ++_shape_index)
 {
 if(_shapes[_shape_index].calculateColors)
 {
 _shapes[_shape_index].calculateColors();
 }
 }
 };

 this.draw = function(graphics)
 {
 for(var i=0; i < this.cSld.spTree.length; ++i)
 {
 if(!this.cSld.spTree[i].isPlaceholder())
 this.cSld.spTree[i].Draw(graphics);
 }
 };

 //-----------------------------------------------


 this.getMatchingShape =  function(type, idx)
 {
 var _input_reduced_type;
 if(type == null)
 {
 _input_reduced_type = phType_body;
 }
 else
 {
 if(type == phType_ctrTitle)
 {
 _input_reduced_type = phType_title;
 }
 else
 {
 _input_reduced_type = type;
 }
 }

 var _input_reduced_index;
 if(idx == null)
 {
 _input_reduced_index = 0;
 }
 else
 {
 _input_reduced_index = idx;
 }


 var _sp_tree = this.cSld.spTree;
 var _shape_index;
 var _index, _type;
 var _final_index, _final_type;
 var _glyph;
 for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
 {
 _glyph = _sp_tree[_shape_index];
 if(_glyph.isPlaceholder())
 {
 if(_glyph instanceof CShape)
 {
 _index = _glyph.nvSpPr.nvPr.ph.idx;
 _type = _glyph.nvSpPr.nvPr.ph.type;
 }
 if(_glyph instanceof CImage2)
 {
 _index = _glyph.nvPicPr.nvPr.ph.idx;
 _type = _glyph.nvPicPr.nvPr.ph.type;
 }
 if(_glyph instanceof  GroupShape)
 {
 _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
 _type = _glyph.nvGrpSpPr.nvPr.ph.type;
 }

 if(_type == null)
 {
 _final_type = phType_body;
 }
 else
 {
 if(_type == phType_ctrTitle)
 {
 _final_type = phType_title;
 }
 else
 {
 _final_type = _type;
 }
 }
 if(_index == null)
 {
 _final_index = 0;
 }
 else
 {
 _final_index = _index;
 }

 if(_input_reduced_type == _final_type && _input_reduced_index == _final_index)
 {
 return _glyph;
 }
 }
 }



 if(_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr)
 {
 for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
 {
 _glyph = _sp_tree[_shape_index];
 if(_glyph.isPlaceholder())
 {
 if(_glyph instanceof CShape)
 {
 _type = _glyph.nvSpPr.nvPr.ph.type;
 }
 if(_glyph instanceof CImage2)
 {
 _type = _glyph.nvPicPr.nvPr.ph.type;
 }
 if(_glyph instanceof  GroupShape)
 {
 _type = _glyph.nvGrpSpPr.nvPr.ph.type;
 }

 if(_input_reduced_type == _type)
 {
 return _glyph;
 }
 }
 }
 }

 for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
 {
 _glyph = _sp_tree[_shape_index];
 if(_glyph.isPlaceholder())
 {
 if(_glyph instanceof CShape)
 {
 _type = _glyph.nvSpPr.nvPr.ph.type;
 }
 if(_glyph instanceof CImage2)
 {
 _type = _glyph.nvPicPr.nvPr.ph.type;
 }
 if(_glyph instanceof  GroupShape)
 {
 _type = _glyph.nvGrpSpPr.nvPr.ph.type;
 }

 if(_type == null)
 {
 _final_type = phType_body;
 }
 else
 {
 if(_type == phType_ctrTitle)
 {
 _final_type = phType_title;
 }
 else
 {
 _final_type = _type;
 }
 }

 if(this.type === nSldLtTTitle && (_input_reduced_type === phType_body || _input_reduced_type === phType_subTitle) && (_final_type === phType_body || _final_type === phType_subTitle) )
 {
 return _glyph;
 }
 }
 }

 return null;
 };


 this.calculateType = function()
 {
 if(this.type !== null)
 {
 this.calculatedType = this.type;
 return;
 }
 var _ph_types_array = [];
 var _matchedLayoutTypes = [];
 for(var _ph_type_index = 0; _ph_type_index < 16; ++_ph_type_index)
 {
 _ph_types_array[_ph_type_index] = 0;
 }
 for(var _layout_type_index = 0; _layout_type_index < 36; ++_layout_type_index)
 {
 _matchedLayoutTypes[_layout_type_index] = false;
 }
 var _shapes = this.cSld.spTree;
 var _shape_index;
 var _shape;
 for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
 {
 _shape = _shapes[_shape_index];
 if(_shape.isPlaceholder())
 {
 var _cur_type = _shape.getPhType();
 if(!(typeof(_cur_type) == "number"))
 {
 _cur_type = phType_body;
 }
 if(typeof _ph_types_array[_cur_type] == "number")
 {
 ++_ph_types_array[_cur_type];
 }
 }
 }

 var _weight = Math.pow(_ph_multiplier, _weight_body)*_ph_types_array[phType_body] + Math.pow(_ph_multiplier, _weight_chart)*_ph_types_array[phType_chart] +
 Math.pow(_ph_multiplier, _weight_clipArt)*_ph_types_array[phType_clipArt] + Math.pow(_ph_multiplier, _weight_ctrTitle)*_ph_types_array[phType_ctrTitle] +
 Math.pow(_ph_multiplier, _weight_dgm)*_ph_types_array[phType_dgm] + Math.pow(_ph_multiplier, _weight_media)*_ph_types_array[phType_media] +
 Math.pow(_ph_multiplier, _weight_obj)*_ph_types_array[phType_obj] + Math.pow(_ph_multiplier, _weight_pic)*_ph_types_array[phType_pic] +
 Math.pow(_ph_multiplier, _weight_subTitle)*_ph_types_array[phType_subTitle] + Math.pow(_ph_multiplier, _weight_tbl)*_ph_types_array[phType_tbl] +
 Math.pow(_ph_multiplier, _weight_title)*_ph_types_array[phType_title];

 for(var _index = 0; _index < 18; ++_index)
 {
 if(_weight >= _arr_lt_types_weight[_index] && _weight <= _arr_lt_types_weight[_index+1])
 {
 if(Math.abs(_arr_lt_types_weight[_index]-_weight) <= Math.abs(_arr_lt_types_weight[_index + 1]-_weight))
 {
 this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index]];
 return;
 }
 else
 {
 this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index+1]];
 return;
 }
 }
 }
 this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[18]];
 };

 this.calculateMatchedTypes = function()
 {
 this.matchedTypes = [];
 for(var i = 0; i < 36; ++i)
 {
 this.matchedTypes[i] = false;
 }
 if(this.calculatedType != null)
 {
 switch (this.calculatedType)
 {
 case nSldLtTBlank :
 {
 this.matchedTypes[nSldLtTBlank] = true;
 break;
 }
 case nSldLtTChart :
 {
 this.matchedTypes[nSldLtTChart] = true;
 break;
 }
 case nSldLtTChartAndTx:
 case nSldLtTTxAndChart:
 case nSldLtTVertTitleAndTxOverChart:
 {
 this.matchedTypes[nSldLtTChartAndTx] = true;
 this.matchedTypes[nSldLtTTxAndChart] = true;
 this.matchedTypes[nSldLtTVertTitleAndTxOverChart] = true;
 break;
 }
 case nSldLtTClipArtAndTx:
 case nSldLtTTxAndClipArt:
 case nSldLtTClipArtAndVertTx:
 {
 this.matchedTypes[nSldLtTClipArtAndTx] = true;
 this.matchedTypes[nSldLtTTxAndClipArt] = true;
 break;
 }
 case nSldLtTDgm :
 {
 this.matchedTypes[nSldLtTDgm] = true;
 break;
 }
 case nSldLtTFourObj :
 {
 this.matchedTypes[nSldLtTFourObj] = true;
 break;
 }
 case nSldLtTMediaAndTx:
 case nSldLtTTxAndMedia:
 {
 this.matchedTypes[nSldLtTMediaAndTx] = true;
 this.matchedTypes[nSldLtTTxAndMedia] = true;
 break;
 }
 case nSldLtTObj :
 {
 this.matchedTypes[nSldLtTObj] = true;
 break;
 }
 case nSldLtTObjAndTwoObj:
 case nSldLtTTwoObjAndObj:
 {
 this.matchedTypes[nSldLtTObjAndTwoObj] = true;
 this.matchedTypes[nSldLtTTwoObjAndObj] = true;
 break;
 }
 case nSldLtTObjAndTx:
 case nSldLtTTxAndObj:
 case nSldLtTTxOverObj:
 case nSldLtTObjOverTx:
 case nSldLtTObjTx:
 {
 this.matchedTypes[nSldLtTObjAndTx] = true;
 this.matchedTypes[nSldLtTTxAndObj] = true;
 this.matchedTypes[nSldLtTTxOverObj] = true;
 break;
 }
 case nSldLtTObjOnly:
 {
 this.matchedTypes[nSldLtTObjOnly] = true;
 break;
 }

 case nSldLtTPicTx :
 {
 this.matchedTypes[nSldLtTPicTx] = true;
 break;
 }

 case nSldLtTSecHead:
 case nSldLtTTitle:
 {
 this.matchedTypes[nSldLtTSecHead] = true;
 this.matchedTypes[nSldLtTTitle] = true;
 break;
 }
 case nSldLtTTbl:
 {
 this.matchedTypes[nSldLtTTbl] = true;
 break;
 }
 case nSldLtTTitleOnly:
 {
 this.matchedTypes[nSldLtTTitleOnly] = true;
 break;
 }
 case nSldLtTTwoColTx:
 {
 this.matchedTypes[nSldLtTTwoColTx] = true;
 break;
 }
 case nSldLtTTwoObj :
 {
 this.matchedTypes[nSldLtTTwoObj] = true;
 break;
 }

 case nSldLtTTwoObjAndTx :
 case nSldLtTTwoObjOverTx:
 case nSldLtTTxAndTwoObj:
 {
 this.matchedTypes[nSldLtTTwoObjAndTx] = true;
 this.matchedTypes[nSldLtTTwoObjOverTx] = true;
 this.matchedTypes[nSldLtTTxAndTwoObj] = true;
 break;
 }
 case nSldLtTTwoTxTwoObj :
 {
 this.matchedTypes[nSldLtTTwoTxTwoObj] = true;
 break;
 }
 case nSldLtTTx :
 case nSldLtTVertTx:
 case nSldLtTVertTitleAndTx:
 {
 this.matchedTypes[nSldLtTTx] = true;
 this.matchedTypes[nSldLtTVertTx] = true;
 this.matchedTypes[nSldLtTVertTitleAndTx] = true;
 break;
 }




 }
 }
 else
 {

 }
 };

 this.recalculate = function()
 {

 if(!this.calculated)
 return;
 var _shapes = this.cSld.spTree;
 var _shape_index;
 var _shape_count = _shapes.length;
 for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
 {
 if(!_shapes[_shape_index].isPlaceholder())
 _shapes[_shape_index].Recalculate();
 }
 };
 }  */

// ----------------------------------

// NOTEMASTER -----------------------

function NoteMaster()
{
    this.cSld = new CSld();
    this.clrMap = new ClrMap();

    this.hf = new HF();
    this.notesStyle = null;

    // pointers
    this.Theme = null;
    this.TableStyles = null;

    this.Calculate = function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,
    }
}

NoteMaster.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

// ----------------------------------

// NOTE -----------------------------

function NoteSlide()
{
    this.cSld = new CSld();
    this.clrMap = null; // override ClrMap

    this.showMasterPhAnim = false;
    this.showMasterSp = false;

    // pointers

    this.Calculate = function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,
    }
}

NoteSlide.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

// ----------------------------------

function isThemeFont(sFont)
{
    return sFont == "+mj-lt" || sFont == "+mn-lt" || sFont == "+mj-ea" || sFont == "+mn-ea" || sFont == "+mj-cs" || sFont == "+mn-cs";
}

function getFontInfo(sFont)
{
    switch(sFont)
    {
        case "+mj-lt":
        {
            return  function(obj)
            {
                return obj.majorFont.latin;
            };
        }
        case "+mn-lt":
        {
            return  function(obj)
            {
                return obj.minorFont.latin;
            };
        }
        case "+mj-ea":
        {
            return  function(obj)
            {
                return obj.majorFont.ea;
            };
        }
        case "+mn-ea":
        {
            return  function(obj)
            {
                return obj.minorFont.ea;
            };
        }
        case "+mj-cs":
        {
            return  function(obj)
            {
                return obj.majorFont.cs;
            };
        }
        case "+mn-cs":
        {
            return  function(obj)
            {
                return obj.minorFont.cs;
            };
        }
        default :
        {
            return function(obj)
            {
                return sFont;
            };
        }
    }
}



// SLIDE ----------------------------
function redrawSlide(slide, presentation, arr_layouts, direction, arr_slides)
{

    var _history_is_on = History.Is_On();
    if(_history_is_on)
    {
        History.TurnOff();
    }
    if(slide !== null && typeof slide === "object")
    {
        var _new_layout = slide.Layout;
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        /*if(Math.abs(presentation.Width - 254) > 1 || Math.abs(presentation.Width - 190.5) > 1)
         {
         var kx = presentation.Width/254;
         var ky = presentation.Height/190.5;
         for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
         {
         _arr_shapes[_shape_index].resizeToFormat(kx, ky);
         }
         }   */
        for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
        {
            _arr_shapes[_shape_index].recalculate();
            // _arr_shapes[_shape_index].setContainer(_new_layout.elementsManipulator);
            // _arr_shapes[_shape_index].calculate();
        }
        slide.recalcAll();
        slide.recalculate();
        if(direction === 0)
        {
            editor.WordControl.m_oLogicDocument.RecalculateCurPos();
        }
        presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    }

    if(_history_is_on)
    {
        History.TurnOn();
    }
    if(slide !== null && typeof slide === "object")
    {
        if(direction == 0)
        {

            if(slide.num > 0)
            {
                presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[slide.num-1], presentation, arr_layouts, -1, arr_slides)}, 30);
            }
            else
            {
                presentation.backChangeThemeTimeOutId = null;
            }
            if(slide.num < presentation.Slides.length-1)
            {
                presentation.forwardChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[slide.num+1], presentation, arr_layouts, +1, arr_slides)}, 30);
            }
            else
            {
                presentation.forwardChangeThemeTimeOutId = null;
            }
            presentation.startChangeThemeTimeOutId = null;
        }
        if(direction > 0)
        {
            if(slide.num < presentation.Slides.length-1)
            {
                presentation.forwardChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[slide.num+1], presentation, arr_layouts,  +1, arr_slides)}, 30);
            }
            else
            {
                presentation.forwardChangeThemeTimeOutId = null;
            }
        }
        if(direction < 0)
        {
            if(slide.num > 0)
            {
                presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[slide.num-1], presentation, arr_layouts,  -1, arr_slides)}, 30);
            }
            else
            {
                presentation.backChangeThemeTimeOutId = null;
            }
        }
    }
    else
    {
        presentation.startChangeThemeTimeOutId = null;
        presentation.forwardChangeThemeTimeOutId = null;
        presentation.backChangeThemeTimeOutId = null;
    }
}


function redrawSlide2(slide, presentation, arrInd, pos,  arr_layouts, direction, arr_slides)
{
    var _history_is_on = History.Is_On();
    if(_history_is_on)
    {
        History.TurnOff();
    }
    if(slide !== null && typeof slide === "object")
    {
        var _new_layout = slide.Layout;
        var _arr_shapes = _new_layout.cSld.spTree;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
        {
            _arr_shapes[_shape_index].recalculate();
        }
        slide.recalcAll();
        slide.recalculate();
        presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    }

    if(_history_is_on)
    {
        History.TurnOn();
    }
    if(direction == 0)
    {
        if(pos > 0)
        {
            presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(arr_slides[arrInd[pos - 1]], presentation, arrInd,pos - 1, arr_layouts, -1, arr_slides)}, 30);
        }
        else
        {
            presentation.backChangeThemeTimeOutId = null;
        }
        if(pos < arrInd.length-1)
        {
            presentation.forwardChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1, arr_layouts, +1, arr_slides)}, 30);
        }
        else
        {
            presentation.forwardChangeThemeTimeOutId = null;
        }
        presentation.startChangeThemeTimeOutId = null;
    }
    if(direction > 0)
    {
        if(pos < arrInd.length-1)
        {
            presentation.forwardChangeThemeTimeOutId =setTimeout(function(){redrawSlide2(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1, arr_layouts, +1, arr_slides)}, 30);
        }
        else
        {
            presentation.forwardChangeThemeTimeOutId = null;
        }
    }
    if(direction < 0)
    {
        if(pos > 0)
        {
            presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(arr_slides[arrInd[pos - 1]], presentation, arrInd, pos - 1, arr_layouts, -1, arr_slides)}, 30);
        }
        else
        {
            presentation.backChangeThemeTimeOutId = null;
        }
    }
}


function recalculateSlideAfterChangeThemeColors(slide, presentation, direction, arr_slides)
{
    var _history_is_on = History.Is_On();


    slide.recalcAllColors();
    slide.recalculate();
    presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);

    if(direction == 0)
    {
        if(slide.num > 0)
        {
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(arr_slides[slide.num-1], presentation,  -1, arr_slides)}, 30);
        }
        if(slide.num < presentation.Slides.length-1)
        {
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(arr_slides[slide.num+1], presentation,  +1, arr_slides)}, 30);
        }
        presentation.startChangeThemeTimeOutId = null;
    }
    if(direction > 0)
    {
        if(slide.num < presentation.Slides.length-1)
        {
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(arr_slides[slide.num+1], presentation,   +1, arr_slides)}, 30);
        }
    }
    if(direction < 0)
    {
        if(slide.num > 0)
        {
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(arr_slides[slide.num-1], presentation,   -1, arr_slides)}, 30);
        }
    }
}


var text_fit_No         = 0;
var text_fit_Auto       = 1;
var text_fit_NormAuto   = 2;

function CTextFit()
{
    this.type           = 0;
    this.fontScale      = null;
    this.lnSpcReduction = null;
}

CTextFit.prototype =
{
    CreateDublicate : function()
    {
        var d = new CTextFit();
        d.type = this.type;
        d.fontScale = this.fontScale;
        d.lnSpcReduction = this.lnSpcReduction;
        return d;
    },

    Get_Id: function()
    {
        return this.Id;
    }
};


// ----------------------------------


var VERTICAL_ANCHOR_TYPE_BOTTOM = 0;
var VERTICAL_ANCHOR_TYPE_CENTER = 1;
var VERTICAL_ANCHOR_TYPE_DISTRIBUTED = 2;
var VERTICAL_ANCHOR_TYPE_JUSTIFIED = 3;
var VERTICAL_ANCHOR_TYPE_TOP = 4;

//Overflow Types
var nOTClip     = 0;
var nOTEllipsis = 1;
var nOTOwerflow = 2;
//-----------------------------

//Text Anchoring Types
var nTextATB = 0;// (Text Anchor Enum ( Bottom ))
var nTextATCtr = 1;// (Text Anchor Enum ( Center ))
var nTextATDist = 2;// (Text Anchor Enum ( Distributed ))
var nTextATJust = 3;// (Text Anchor Enum ( Justified ))
var nTextATT = 4;// Top

//Vertical Text Types
var nVertTTeaVert          = 0; //( ( East Asian Vertical ))
var nVertTThorz            = 1; //( ( Horizontal ))
var nVertTTmongolianVert   = 2; //( ( Mongolian Vertical ))
var nVertTTvert            = 3; //( ( Vertical ))
var nVertTTvert270         = 4;//( ( Vertical 270 ))
var nVertTTwordArtVert     = 5;//( ( WordArt Vertical ))
var nVertTTwordArtVertRtl  = 6;//(Vertical WordArt Right to Left)
//-------------------------------------------------------------------
//Text Wrapping Types
var nTWTNone   = 0;
var nTWTSquare = 1;

var text_fit_No         = 0;
var text_fit_Auto       = 1;
var text_fit_NormAuto   = 2;

function CBodyPr()
{
    this.flatTx           = null;
    this.anchor           = null;
    this.anchorCtr        = null;
    this.bIns             = null;
    this.compatLnSpc      = null;
    this.forceAA          = null;
    this.fromWordArt      = null;
    this.horzOverflow     = null;
    this.lIns             = null;
    this.numCol           = null;
    this.rIns             = null;
    this.rot              = null;
    this.rtlCol           = null;
    this.spcCol           = null;
    this.spcFirstLastPara = null;
    this.tIns             = null;
    this.upright          = null;
    this.vert             = null;
    this.vertOverflow     = null;
    this.wrap             = null;
    this.textFit          = null;


	
    this.setVert = function(val)
    {
        this.vert = val;
    };

    this.setRot = function(val)
    {
        this.rot = val;
    };

    this.reset = function()
    {
        this.flatTx           = null;
        this.anchor           = null;
        this.anchorCtr        = null;
        this.bIns             = null;
        this.compatLnSpc      = null;
        this.forceAA          = null;
        this.fromWordArt      = null;
        this.horzOverflow     = null;
        this.lIns             = null;
        this.numCol           = null;
        this.rIns             = null;
        this.rot              = null;
        this.rtlCol           = null;
        this.spcCol           = null;
        this.spcFirstLastPara = null;
        this.tIns             = null;
        this.upright          = null;
        this.vert             = null;
        this.vertOverflow     = null;
        this.wrap             = null;
        this.textFit          = null;
    };

	
    this.Write_ToBinary2 = function(w)
    {
        var flag = this.flatTx != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.flatTx);
        }

        flag = this.anchor != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.anchor);
        }

        flag = this.anchorCtr != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.anchorCtr);
        }

        flag = this.bIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.bIns);
        }

        flag = this.compatLnSpc != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.compatLnSpc);
        }

        flag = this.forceAA != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.forceAA);
        }

        flag = this.fromWordArt != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.fromWordArt);
        }

        flag = this.horzOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.horzOverflow);
        }

        flag = this.lIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.lIns);
        }

        flag = this.numCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.numCol);
        }

        flag = this.rIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.rIns);
        }


        flag = this.rot != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.rot);
        }

        flag = this.rtlCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.rtlCol);
        }

        flag = this.spcCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcCol);
        }

        flag = this.spcFirstLastPara != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcFirstLastPara);
        }

        flag = this.tIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.tIns);
        }

        flag = this.upright != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.upright);
        }

        flag = this.vert != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vert);
        }


        flag = this.vertOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vertOverflow);
        }

        flag = this.wrap != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.wrap);
        }
    };

    this.Read_FromBinary2 = function(r)
    {
        var flag = r.GetBool();
        if(flag)
        {
            this.flatTx = r.GetLong();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.anchor = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.anchorCtr = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.bIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.compatLnSpc = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.forceAA = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.fromWordArt = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.horzOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.lIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.numCol = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.rot = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rtlCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcFirstLastPara = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.tIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.upright = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.vert = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.vertOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.wrap = r.GetLong();
        }
    };

    this.setDefault =  function()
    {
        this.flatTx         = null;
        this.anchor         = 4;
        this.anchorCtr      = false;
        this.bIns           = 45720/36000;
        this.compatLnSpc    = false;
        this.forceAA        = false;
        this.fromWordArt    = false;
        this.horzOverflow   = nOTOwerflow;
        this.lIns           = 91440/36000;
        this.numCol         = 1;
        this.rIns           = 91440/36000;
        this.rot            = null;
        this.rtlCol         = false;
        this.spcCol         = false ;
        this.spcFirstLastPara = null;
        this.tIns           = 45720/36000;
        this.upright        = false;
        this.vert           = nVertTThorz;
        this.vertOverflow   = nOTOwerflow;
        this.wrap           = nTWTSquare;
    };

    this.createDuplicate = function()
    {

        var duplicate = new CBodyPr();
        duplicate.flatTx         = this.flatTx;
        duplicate.anchor         = this.anchor;
        duplicate.anchorCtr      = this.anchorCtr;
        duplicate.bIns           = this.bIns;
        duplicate.compatLnSpc    = this.compatLnSpc;
        duplicate.forceAA        = this.forceAA;
        duplicate.fromWordArt    = this.fromWordArt;
        duplicate.horzOverflow   = this.horzOverflow;
        duplicate.lIns           = this.lIns;
        duplicate.rIns           = this.rIns;
        duplicate.rot            = this.rot;
        duplicate.rtlCol         = this.rtlCol;
        duplicate.spcCol         = this.spcCol;
        duplicate.spcFirstLastPara = this.spcFirstLastPara;
        duplicate.tIns           = this.tIns;
        duplicate.upright        = this.upright;
        duplicate.vert           = this.vert;
        duplicate.vertOverflow   = this.vertOverflow;
        duplicate.wrap           = this.wrap;

        return duplicate;
    };

    this.merge = function(bodyPr)
    {
        if(bodyPr.flatTx!=null)
        {
            this.flatTx = bodyPr.flatTx;
        }
        if(bodyPr.anchor!=null)
        {
            this.anchor = bodyPr.anchor;
        }
        if(bodyPr.anchorCtr!=null)
        {
            this.anchorCtr = bodyPr.anchorCtr;
        }
        if(bodyPr.bIns!=null)
        {
            this.bIns = bodyPr.bIns;
        }
        if(bodyPr.compatLnSpc!=null)
        {
            this.compatLnSpc = bodyPr.compatLnSpc;
        }
        if(bodyPr.forceAA!=null)
        {
            this.forceAA = bodyPr.forceAA;
        }
        if(bodyPr.fromWordArt!=null)
        {
            this.fromWordArt = bodyPr.fromWordArt;
        }

        if(bodyPr.horzOverflow!=null)
        {
            this.horzOverflow = bodyPr.horzOverflow;
        }

        if(bodyPr.lIns!=null)
        {
            this.lIns = bodyPr.lIns;
        }

        if(bodyPr.rIns!=null)
        {
            this.rIns = bodyPr.rIns;
        }

        if(bodyPr.rot!=null)
        {
            this.rot = bodyPr.rot;
        }

        if(bodyPr.rtlCol!=null)
        {
            this.rtlCol = bodyPr.rtlCol;
        }

        if(bodyPr.spcCol!=null)
        {
            this.spcCol = bodyPr.spcCol;
        }
        if(bodyPr.spcFirstLastPara!=null)
        {
            this.spcFirstLastPara = bodyPr.spcFirstLastPara;
        }

        if(bodyPr.tIns!=null)
        {
            this.tIns = bodyPr.tIns;
        }
        if(bodyPr.upright!=null)
        {
            this.upright = bodyPr.upright;
        }

        if(bodyPr.vert!=null)
        {
            this.vert = bodyPr.vert;
        }
        if(bodyPr.vertOverflow!=null)
        {
            this.vertOverflow = bodyPr.vertOverflow;
        }
        if(bodyPr.wrap!=null)
        {
            this.wrap = bodyPr.wrap;
        }
    }

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBodyPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};


function CHyperlink()
{
    this.url = "";
    this.action = "";
}

CHyperlink.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

function CTextParagraphPr()
{
    this.bullet = new CBullet();
    this.lvl = null;
    this.pPr = new CParaPr();
    this.rPr = new CTextPr();

    this.createDuplicate = function()
    {
        var duplicate = new CTextParagraphPr();
        duplicate.bullet = this.bullet.createDuplicate();
        duplicate.lvl = this.lvl;
        duplicate.pPr = clone(this.pPr);
        duplicate.rPr = clone(this.rPr);
        return duplicate;
    };

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealObject(this.bullet));
        if(isRealObject(this.bullet))
        {
            this.bullet.Write_ToBinary2(w);
        }
        w.WriteBool(isRealNumber(this.lvl));
        if(isRealNumber(this.lvl))
        {
            w.WriteLong(this.lvl);
        }

        w.WriteBool(isRealObject(this.pPr));
        if(isRealObject(this.pPr))
        {
            this.pPr.Write_ToBinary(w);
        }


        w.WriteBool(isRealObject(this.rPr));
        if(isRealObject(this.rPr))
        {
            this.rPr.Write_ToBinary(w);
        }
    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            this.bullet = new CBullet();
            this.bullet.Read_FromBinary2(r);
        }
        else
        {
            this.bullet = new CBullet();
        }
        if(r.GetBool())
        {
            this.lvl = r.GetLong();
        }
        else
        {
            this.lvl = null;
        }

        this.pPr = new CParaPr();
        if(r.GetBool())
        {
            this.pPr.Read_FromBinary(r);
        }

        this.rPr = new CTextPr();
        if(r.GetBool())
        {
            this.rPr.Read_FromBinary(r);
        }
    };
}

CTextParagraphPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

function CompareBullets(bullet1, bullet2)
{
	var ret = new CBullet();
	//TODO: сделать сравнивание
	return ret;
}

function CBullet()
{
    this.bulletColor = null;
    this.bulletSize = null;
    this.bulletTypeface = null;
    this.bulletType = null;
    this.Bullet = null;

    this.createDuplicate = function()
    {
        var duplicate = new CBullet();
        if(this.bulletColor)
        {
            duplicate.bulletColor = this.bulletColor.createDuplicate();
        }
        if(this.bulletSize)
        {
            duplicate.bulletSize = this.bulletSize.createDuplicate();
        }
        if(this.bulletTypeface)
        {
            duplicate.bulletTypeface = this.bulletTypeface.createDuplicate();
        }

        if(this.bulletType)
        {
            duplicate.bulletType = this.bulletType.createDuplicate();
        }

        duplicate.Bullet = this.Bullet;
        return duplicate;
    };

    this.isBullet = function()
    {
        return this.bulletType != null && this.bulletType.type != null;
    };

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealObject(this.bulletColor));
        if(isRealObject(this.bulletColor))
        {
            this.bulletColor.Write_ToBinary2(w);
        }

        w.WriteBool(isRealObject(this.bulletSize));
        if(isRealObject(this.bulletSize))
        {
            this.bulletSize.Write_ToBinary2(w);
        }


        w.WriteString2("dssdf");

        w.WriteBool(isRealObject(this.bulletTypeface));
        if(isRealObject(this.bulletTypeface))
        {
            this.bulletTypeface.Write_ToBinary2(w);
        }


        w.WriteBool(isRealObject(this.bulletType));
        if(isRealObject(this.bulletType))
        {
            this.bulletType.Write_ToBinary2(w);
        }

    };

    this.Read_FromBinary2 = function(r)
    {

        if(r.GetBool())
        {
            this.bulletColor = new CBulletColor();
            this.bulletColor.Read_FromBinary2(r);
        }

        if(r.GetBool())
        {
            this.bulletSize = new CBulletSize();
            this.bulletSize.Read_FromBinary2(r);
        }

        var s = r.GetString2();
        if(r.GetBool())
        {
            this.bulletTypeface = new CBulletTypeface();
            this.bulletTypeface.Read_FromBinary2(r);
        }

        if(r.GetBool())
        {
            this.bulletType = new CBulletType();
            this.bulletType.Read_FromBinary2(r);
        }
    };
}

CBullet.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
	
	Set_FromObject: function(obj)
	{
		if(obj)
		{
			if(obj.bulletColor)
			{
				this.bulletColor = new CBulletColor();
				this.bulletColor.Set_FromObject(obj.bulletColor);
			}
			else
				this.bulletColor = null;
			
			if(obj.bulletSize)
			{
				this.bulletSize = new CBulletSize();
				this.bulletSize.Set_FromObject(obj.bulletSize);
			}
			else
				this.bulletSize = null;
				
			if(obj.bulletTypeface)
			{
				this.bulletTypeface = new CBulletTypeface();
				this.bulletTypeface.Set_FromObject(obj.bulletTypeface);
			}
			else
				this.bulletTypeface = null;
		}
	},
	
	Write_ToBinary: function(w)
	{},
	
	Read_FromBinary: function(r)
	{}

};

var BULLET_TYPE_COLOR_NONE	= 0;
var BULLET_TYPE_COLOR_CLRTX	= 1;
var BULLET_TYPE_COLOR_CLR	= 2;

function CBulletColor()
{
    this.type = BULLET_TYPE_COLOR_NONE;
    this.UniColor = null;
    this.createDuplicate = function()
    {
        var duplicate = new CBulletColor();
        duplicate.type = this.type;
        if(this.UniColor != null)
        {
            duplicate.UniColor = this.UniColor.createDuplicate();
        }
        return duplicate;
    };

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }
        w.WriteBool(isRealObject(this.UniColor));
        if(isRealObject(this.UniColor))
        {
            this.UniColor.Write_ToBinary2(w);
        }

    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }

        if(r.GetBool())
        {
            this.UniColor = new CUniColor();
            this.UniColor.Read_FromBinary2(r);
        }
    };
}

CBulletColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
	
	Set_FromObject: function(o)
	{
		this.type = o.type;
		if(o.UniColor)
		{
			
		}
	}
};

var BULLET_TYPE_SIZE_NONE	= 0;
var BULLET_TYPE_SIZE_TX		= 1;
var BULLET_TYPE_SIZE_PCT	= 2;
var BULLET_TYPE_SIZE_PTS	= 3;

function CBulletSize()
{
    this.type = BULLET_TYPE_SIZE_NONE;
    this.val = 0;
    this.createDuplicate = function()
    {
        var d = new CBulletSize();
        d.type = this.type;
        d.val = this.val;
        return d;
    }

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(isRealNumber(this.val));
        if(isRealNumber(this.val))
        {
            w.WriteLong(this.val);
        }

    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.val) = r.GetLong();
        }
    };
}

CBulletSize.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

var BULLET_TYPE_TYPEFACE_NONE	= 0;
var BULLET_TYPE_TYPEFACE_TX		= 1;
var BULLET_TYPE_TYPEFACE_BUFONT	= 2;

function CBulletTypeface()
{
    this.type = BULLET_TYPE_TYPEFACE_NONE;
    this.typeface = "";

    this.createDuplicate = function()
    {
        var d = new CBulletTypeface();
        d.type = this.type;
        d.typeface = this.typeface;
        return d;
    };

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(typeof this.typeface === "string");
        if(typeof this.typeface === "string")
        {
            w.WriteString2(this.typeface);
        }

    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.typeface) = r.GetString2();
        }
    };
}

CBulletTypeface.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

var BULLET_TYPE_BULLET_NONE		= 0;
var BULLET_TYPE_BULLET_CHAR		= 1;
var BULLET_TYPE_BULLET_AUTONUM	= 2;
var BULLET_TYPE_BULLET_BLIP		= 3;

function CBulletType()
{
    this.type = null;//BULLET_TYPE_BULLET_NONE;
    this.Char = "*";
    this.AutoNumType = 0;
    this.startAt = 1;

    this.createDuplicate = function()
    {
        var d = new CBulletType();
        d.type = this.type;
        d.Char = this.Char;
        d.AutoNumType = this.AutoNumType;
        d.startAt = this.startAt;
        return d;
    }

    this.Write_ToBinary2 =function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(typeof this.Char === "string");
        if(typeof this.Char === "string")
        {
            w.WriteString2(this.Char);
        }

        w.WriteBool(isRealNumber(this.AutoNumType));
        if(isRealNumber(this.AutoNumType))
        {
            w.WriteLong(this.AutoNumType);
        }

        w.WriteBool(isRealNumber(this.startAt));
        if(isRealNumber(this.startAt))
        {
            w.WriteLong(this.startAt);
        }


    };

    this.Read_FromBinary2 = function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.Char) = r.GetString2();
        }

        if(r.GetBool())
        {
            (this.AutoNumType) = r.GetLong();
        }

        if(r.GetBool())
        {
            (this.startAt) = r.GetLong();
        }
    };
}

CBulletType.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

function TextListStyle()
{
    this.levels = new Array(10);

    for (var i = 0; i < 10; i++)
        this.levels[i] = null;

    this.createDuplicate = function()
    {
        var duplicate = new TextListStyle();
        for(var i=0; i<10; ++i)
        {
            if(this.levels[i]!=null)
            {
                duplicate.levels[i] = this.levels[i].createDuplicate();
            }
        }
        return duplicate;
    };

    this.Write_ToBinary2 = function(w)
    {
        w.WriteBool(MASTER_STYLES);

        for(var i = 0; i < 10; ++i)
        {
            w.WriteBool(isRealObject(this.levels[i]));
            if(isRealObject(this.levels[i]))
            {
                this.levels[i].Write_ToBinary2(w);
            }
        }
    };

    this.Read_FromBinary2 = function(r)
    {
        var b = r.GetBool();

        for(var i = 0; i < 10; ++i)
        {
            if(r.GetBool())
            {
                this.levels[i] = new CTextParagraphPr();
                this.levels[i].Read_FromBinary2(r);
            }
            else
            {
                this.levels[i] = null;
            }
        }
    };
}

TextListStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};

function CPresParagraph()
{
    this.textPr = null;
    this.endRunPr = null;
    this.Content = [];

    this.createDuplicate = function()
    {
        var duplicate = new CPresParagraph();
        duplicate.textPr = clone(this.textPr);
        duplicate.endRunPr = clone(this.endRunPr);
        duplicate.Content = clone(this.Content);
        return duplicate;
    }
}

CPresParagraph.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    }
};


function copyParagraph(paragraph, parent)
{
    var copy = new Paragraph(paragraph.DrawingDocument, parent, 0, 0, 0, 0, 0);
    if(paragraph.bullet)
    {
        copy.bullet = paragraph.bullet.createDuplicate();
    }
    copy.Pr = clone(paragraph.Pr);
    copy.rPr = clone(paragraph.rPr);
    for(var i = 0, n = paragraph.Content.length; i < n; ++i )
    {
        copy.Content[i] = paragraph.Content[i].createDuplicate();
    }
    return copy;
}

var PARRUN_TYPE_NONE    = 0;
var PARRUN_TYPE_RUN		= 1;
var PARRUN_TYPE_FLD		= 2;
var PARRUN_TYPE_BR		= 3;


// DEFAULT OBJECTS
function GenerateDefaultTheme(presentation)
{
	return ExecuteNoHistory(function()
	{
		var theme = new CTheme();
		theme.presentation = presentation;
		theme.themeElements.fontScheme.majorFont.latin = "Arial";
		theme.themeElements.fontScheme.minorFont.latin = "Arial";

		var scheme = theme.themeElements.clrScheme;

		scheme.colors[8] = CreateUniColorRGB(0,0,0);
		scheme.colors[12] = CreateUniColorRGB(255,255,255);
		scheme.colors[9] = CreateUniColorRGB(0x1F,0x49, 0x7D);
		scheme.colors[13] = CreateUniColorRGB(0xEE,0xEC,0xE1);
		scheme.colors[0] = CreateUniColorRGB(0x4F, 0x81, 0xBD); //CreateUniColorRGB(0xFF, 0x81, 0xBD);//
		scheme.colors[1] = CreateUniColorRGB(0xC0,0x50,0x4D);
		scheme.colors[2] = CreateUniColorRGB(0x9B,0xBB,0x59);
		scheme.colors[3] = CreateUniColorRGB(0x80,0x64,0xA2);
		scheme.colors[4] = CreateUniColorRGB(0x4B,0xAC,0xC6);
		scheme.colors[5] = CreateUniColorRGB(0xF7,0x96,0x46);
		scheme.colors[11] = CreateUniColorRGB(0x00,0x00,0xFF);
		scheme.colors[10] = CreateUniColorRGB(0x80, 0x00, 0x80);

		// -------------- fill styles -------------------------
		var brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(new CSchemeColor());
		brush.fill.color.color.setId(phClr);
		theme.themeElements.fmtScheme.fillStyleLst.push(brush);

		brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
		theme.themeElements.fmtScheme.fillStyleLst.push(brush);

		brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
		theme.themeElements.fmtScheme.fillStyleLst.push(brush);
		// ----------------------------------------------------

		// -------------- back styles -------------------------
		brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(new CSchemeColor());
		brush.fill.color.color.setId(phClr);
		theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);

		brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
		theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);

		brush = new CUniFill();
		brush.setFill(new CSolidFill());
		brush.fill.setColor(new CUniColor());
		brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
		theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);
		// ----------------------------------------------------

		var pen = new CLn();
		pen.setW(9525);
		pen.setFill(new CUniFill());
		pen.Fill.setFill(new CSolidFill());
		pen.Fill.fill.setColor(new CUniColor());
		pen.Fill.fill.color.setColor(new CSchemeColor());
		pen.Fill.fill.color.color.setId(phClr);
		pen.Fill.fill.color.setMods(new CColorModifiers());
		
		var mod = new CColorMod();
		mod.setName("shade");
		mod.setVal(95000);
		pen.Fill.fill.color.Mods.addMod(mod);
		mod = new CColorMod();
		mod.setName("satMod");
		mod.setVal(105000);
		pen.Fill.fill.color.Mods.addMod(mod);
		theme.themeElements.fmtScheme.lnStyleLst.push(pen);

		pen = new CLn();
		pen.setW(25400);
		pen.setFill(new CUniFill());
		pen.Fill.setFill(new CSolidFill());

		pen.Fill.fill.setColor(new CUniColor());
		pen.Fill.fill.color.setColor(new CSchemeColor());
		pen.Fill.fill.color.color.setId(phClr);
		theme.themeElements.fmtScheme.lnStyleLst.push(pen);

		pen = new CLn();
		pen.setW(38100);
		pen.setFill(new CUniFill());
		pen.Fill.setFill(new CSolidFill());
		pen.Fill.fill.setColor(new CUniColor());
		pen.Fill.fill.color.setColor(new CSchemeColor());
		pen.Fill.fill.color.color.setId(phClr);
		theme.themeElements.fmtScheme.lnStyleLst.push(pen);
		theme.extraClrSchemeLst = [];
		return theme;
	}, this, []);
}

function GenerateDefaultMasterSlide(theme)
{
    var master = new MasterSlide(theme.presentation, theme);
    master.Theme = theme;

    master.sldLayoutLst[0] = GenerateDefaultSlideLayout(master);

    return master;
}

function GenerateDefaultSlideLayout(master)
{
    var layout = new SlideLayout(master);
    layout.Theme = master.Theme;
    return layout;
}

function GenerateDefaultSlide(layout)
{
    var slide = new Slide(layout.Master.presentation, layout, 0);
    slide.Master = layout.Master;
    slide.Theme = layout.Master.Theme;
    return slide;
}

function CreateDefaultTextRectStyle()
{
    var style = new CShapeStyle();
    style.lnRef = new StyleRef();
    style.lnRef.idx = 0;
    style.lnRef.Color.color = new CSchemeColor();
    style.lnRef.Color.color.id = g_clr_accent1;
    var mod = new CColorMod();
    mod.name = "shade";
    mod.val = 50000;
    style.lnRef.Color.Mods.Mods.push(mod);

    style.fillRef = new StyleRef();
    style.fillRef.idx = 0;
    style.fillRef.Color.color = new CSchemeColor();
    style.fillRef.Color.color.id = g_clr_accent1;

    style.effectRef = new StyleRef();
    style.effectRef.idx = 0;
    style.effectRef.Color.color = new CSchemeColor();
    style.effectRef.Color.color.id = g_clr_accent1;


    style.fontRef = new FontRef();
    style.fontRef.idx = fntStyleInd_minor;
    style.fontRef.Color = new CUniColor();
    style.fontRef.Color.color = new CSchemeColor();
    style.fontRef.Color.color.id = 8;
    return style;
};



function GenerateDefaultColorMap()
{
    var clrMap = new ClrMap();

    clrMap.color_map[0] = 0;
    clrMap.color_map[1] = 1;
    clrMap.color_map[2] = 2;
    clrMap.color_map[3] = 3;
    clrMap.color_map[4] = 4;
    clrMap.color_map[5] = 5;
    clrMap.color_map[10] = 10;
    clrMap.color_map[11] = 11;
    clrMap.color_map[6] = 12;
    clrMap.color_map[7] = 13;
    clrMap.color_map[15] = 8;
    clrMap.color_map[16] = 9;

    return clrMap;

}
var DEFAULT_COLOR_MAP = GenerateDefaultColorMap();