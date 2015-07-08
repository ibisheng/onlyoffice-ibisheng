/**
 *    native.js
 *
 *    Created by Alexey Musinov on 14 April 2015
 *    Copyright (c) 2015 Ascensio System SIA. All rights reserved.
 *
 */

var editor = undefined;
var window = {};
var navigator = {};
navigator.userAgent = "chrome";
window.navigator = navigator;
window.location = {};

window.location.protocol = "";
window.location.host = "";
window.location.href = "";

window.NATIVE_EDITOR_ENJINE = true;
window.NATIVE_EDITOR_ENJINE_SYNC_RECALC = true;

var document = {};
window.document = document;

//-------------------------------------------------------------------------------------------------
aStandartNumFormats = [];
aStandartNumFormats[0] = "General";
aStandartNumFormats[1] = "0";
aStandartNumFormats[2] = "0.00";
aStandartNumFormats[3] = "#,##0";
aStandartNumFormats[4] = "#,##0.00";
aStandartNumFormats[9] = "0%";
aStandartNumFormats[10] = "0.00%";
aStandartNumFormats[11] = "0.00E+00";
aStandartNumFormats[12] = "# ?/?";
aStandartNumFormats[13] = "# ??/??";
aStandartNumFormats[14] = "m/d/yyyy";
aStandartNumFormats[15] = "d-mmm-yy";
aStandartNumFormats[16] = "d-mmm";
aStandartNumFormats[17] = "mmm-yy";
aStandartNumFormats[18] = "h:mm AM/PM";
aStandartNumFormats[19] = "h:mm:ss AM/PM";
aStandartNumFormats[20] = "h:mm";
aStandartNumFormats[21] = "h:mm:ss";
aStandartNumFormats[22] = "m/d/yyyy h:mm";
aStandartNumFormats[37] = "#,##0_);(#,##0)";
aStandartNumFormats[38] = "#,##0_);[Red](#,##0)";
aStandartNumFormats[39] = "#,##0.00_);(#,##0.00)";
aStandartNumFormats[40] = "#,##0.00_);[Red](#,##0.00)";
aStandartNumFormats[45] = "mm:ss";
aStandartNumFormats[46] = "[h]:mm:ss";
aStandartNumFormats[47] = "mm:ss.0";
aStandartNumFormats[48] = "##0.0E+0";
aStandartNumFormats[49] = "@";
aStandartNumFormatsId = {};
for(var i in aStandartNumFormats)
{
    aStandartNumFormatsId[aStandartNumFormats[i]] = i - 0;
}
//-------------------------------------------------------------------------------------------------

function ConvertJSC_Array(_array)
{
    var _len = _array.length;
    var ret = new Uint8Array(_len);
    for (var i = 0; i < _len; i++)
        ret[i] = _array.getAt(i);
    return ret;
}

function Image()
{
    this.src = "";
    this.onload = function()
    {
    }
    this.onerror = function()
    {
    }
}

function _image_data()
{
    this.data = null;
    this.length = 0;
}

function native_pattern_fill()
{
}
native_pattern_fill.prototype =
{
    setTransform : function(transform) {}
};

function native_gradient_fill()
{
}
native_gradient_fill.prototype =
{
    addColorStop : function(offset,color) {}
};

function native_context2d(parent)
{
    this.canvas = parent;

    this.globalAlpha = 0;
    this.globalCompositeOperation = "";
    this.fillStyle = "";
    this.strokeStyle = "";

    this.lineWidth = 0;
    this.lineCap = 0;
    this.lineJoin = 0;
    this.miterLimit = 0;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowBlur = 0;
    this.shadowColor = 0;
    this.font = "";
    this.textAlign = 0;
    this.textBaseline = 0;
}
native_context2d.prototype =
{
    save : function() {},
    restore : function() {},

    scale : function(x,y) {},
    rotate : function(angle) {},
    translate : function(x,y) {},
    transform : function(m11,m12,m21,m22,dx,dy) {},
    setTransform : function(m11,m12,m21,m22,dx,dy) {},

    createLinearGradient : function(x0,y0,x1,y1) { return new native_gradient_fill(); },
    createRadialGradient : function(x0,y0,r0,x1,y1,r1) { return null; },
    createPattern : function(image,repetition) { return new native_pattern_fill(); },

    clearRect : function(x,y,w,h) {},
    fillRect : function(x,y,w,h) {},
    strokeRect : function(x,y,w,h) {},

    beginPath : function() {},
    closePath : function() {},
    moveTo : function(x,y) {},
    lineTo : function(x,y) {},
    quadraticCurveTo : function(cpx,cpy,x,y) {},
    bezierCurveTo : function(cp1x,cp1y,cp2x,cp2y,x,y) {},
    arcTo : function(x1,y1,x2,y2,radius) {},
    rect : function(x,y,w,h) {},
    arc : function(x,y,radius,startAngle,endAngle,anticlockwise) {},

    fill : function() {},
    stroke : function() {},
    clip : function() {},
    isPointInPath : function(x,y) {},
    drawFocusRing : function(element,xCaret,yCaret,canDrawCustom) {},

    fillText : function(text,x,y,maxWidth) {},
    strokeText : function(text,x,y,maxWidth) {},
    measureText : function(text) {},

    drawImage : function(img_elem,dx_or_sx,dy_or_sy,dw_or_sw,dh_or_sh,dx,dy,dw,dh) {},

    createImageData : function(imagedata_or_sw,sh)
    {
        var _data = new _image_data();
        _data.length = imagedata_or_sw * sh * 4;
        _data.data = (typeof(Uint8Array) != 'undefined') ? new Uint8Array(_data.length) : new Array(_data.length);
        return _data;
    },
    getImageData : function(sx,sy,sw,sh) {},
    putImageData : function(image_data,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight) {}
};

function native_canvas()
{
    this.id = "";
    this.width = 300;
    this.height = 150;

    this.nodeType = 1;
}
native_canvas.prototype =
{
    getContext : function(type)
    {
        if (type == "2d")
            return new native_context2d(this);
        return null;
    },

    toDataUrl : function(type)
    {
        return "";
    },

    addEventListener : function()
    {
    },

    attr : function()
    {
    }
};

window["Asc"] = {};

var _null_object = {};
_null_object.length = 0;
_null_object.nodeType = 1;
_null_object.offsetWidth = 1;
_null_object.offsetHeight = 1;
_null_object.clientWidth = 1;
_null_object.clientHeight = 1;
_null_object.scrollWidth = 1;
_null_object.scrollHeight = 1;
_null_object.style = {};
_null_object.documentElement = _null_object;
_null_object.body = _null_object;
_null_object.ownerDocument = _null_object;
_null_object.defaultView = _null_object;

_null_object.addEventListener = function(){};
_null_object.setAttribute = function(){};
_null_object.getElementsByTagName = function() { return []; };
_null_object.appendChild = function() {};
_null_object.removeChild = function() {};
_null_object.insertBefore = function() {};
_null_object.childNodes = [];
_null_object.parent = _null_object;
_null_object.parentNode = _null_object;
_null_object.find = function() { return this; };
_null_object.appendTo = function() { return this; };
_null_object.css = function() { return this; };
_null_object.width = function() { return 1; };
_null_object.height = function() { return 1; };
_null_object.attr = function() { return this; };
_null_object.prop = function() { return this; };
_null_object.val = function() { return this; };
_null_object.remove = function() {};
_null_object.getComputedStyle = function() { return null; };
_null_object.getContext = function(type) {
    if (type == "2d")
        return new native_context2d(this);
    return null;
};

window._null_object = _null_object;

document.createElement = function(type)
{
    if (type && type.toLowerCase)
    {
        if (type.toLowerCase() == "canvas")
            return new native_canvas();
    }

    return _null_object;
}

function _return_empty_html_element() { return _null_object; };

document.createDocumentFragment = _return_empty_html_element;
document.getElementsByTagName = function(tag) {
    var ret = [];
    if ("head" == tag)
        ret.push(_null_object);
    return ret;
};
document.insertBefore = function() {};
document.appendChild = function() {};
document.removeChild = function() {};
document.getElementById = function() { return _null_object; };
document.createComment = function() { return undefined; };

document.documentElement = _null_object;
document.body = _null_object;

var native = CreateNativeEngine();
window.native = native;
window["native"] = native;

function GetNativeEngine() {
    return window.native;
}

var native_renderer = null;
var _api = null;
var Asc = window["Asc"];

function NativeOpenFileData(data, version)
{
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();

    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");
        _api.asc_nativeOpenFile(data, version);
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(data, version);
    }
}

function NativeOpenFile(arguments)
{
    window["CreateMainTextMeasurerWrapper"]();

    var doc_bin = window.native.GetFileString(window.native.GetFilePath());
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();

    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");
        _api.asc_nativeOpenFile(doc_bin);
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(doc_bin);
    }
}

function NativeOpenFile2(_params)
{
    window["CreateMainTextMeasurerWrapper"]();

    window.g_file_path = "native_open_file";
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
    var doc_bin = window.native.GetFileString(window.g_file_path);
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");

        if (undefined !== _api.Native_Editor_Initialize_Settings)
        {
            _api.Native_Editor_Initialize_Settings(_params);
        }

        _api.asc_nativeOpenFile(doc_bin);

        if (_api.NativeAfterLoad)
            _api.NativeAfterLoad();
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(doc_bin);
    }
}

function NativeCalculateFile()
{
    _api.asc_nativeCalculateFile();
}

function NativeApplyChangesData(data, isFull)
{
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api.asc_nativeApplyChanges2(data, isFull);
    }
    else
    {
        _api.asc_nativeApplyChanges2(data, isFull);
    }
}

function NativeApplyChanges()
{
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        var __changes = [];
        var _count_main = window.native.GetCountChanges();
        for (var i = 0; i < _count_main; i++)
        {
            var _changes_file = window.native.GetChangesFile(i);
            var _changes = JSON.parse(window.native.GetFileString(_changes_file));

            for (var j = 0; j < _changes.length; j++)
            {
                __changes.push(_changes[j]);
            }
        }
        _api.asc_nativeApplyChanges(__changes);
    }
    else
    {
        var __changes = [];
        var _count_main = window.native.GetCountChanges();
        for (var i = 0; i < _count_main; i++)
        {
            var _changes_file = window.native.GetChangesFile(i);
            var _changes = JSON.parse(window.native.GetFileString(_changes_file));

            for (var j = 0; j < _changes.length; j++)
            {
                __changes.push(_changes[j]);
            }
        }

        _api.asc_nativeApplyChanges(__changes);
    }
}
function NativeGetFileString()
{
    return _api.asc_nativeGetFile();
}
function NativeGetFileData()
{
    return _api.asc_nativeGetFileData();
}

function GetNativeCountPages()
{
    return _api.asc_nativePrintPagesCount();
}

window.memory1 = null;
window.memory2 = null;

function GetNativePageBase64(pageIndex)
{
    if (null == window.memory1)
        window.memory1 = CreateNativeMemoryStream();
    else
        window.memory1.ClearNoAttack();

    if (null == window.memory2)
        window.memory2 = CreateNativeMemoryStream();
    else
        window.memory2.ClearNoAttack();

    if (native_renderer == null)
    {
        native_renderer = _api.asc_nativeCheckPdfRenderer(window.memory1, window.memory2);
    }
    else
    {
        window.memory1.ClearNoAttack();
        window.memory2.ClearNoAttack();
    }

    _api.asc_nativePrint(native_renderer, pageIndex);
    return window.memory1;
}

function GetNativePageMeta(pageIndex)
{
    return _api.GetNativePageMeta(pageIndex);
}

function GetNativeId()
{
    return window.native.GetFileId();
}

// для работы с таймерами
window.NativeSupportTimeouts = false;
window.NativeTimeoutObject = {};

function clearTimeout(_id)
{
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setTimeout(func, interval)
{
    if (!window.NativeSupportTimeouts)
        return;

    var _id = window.native["GenerateTimeoutId"](interval);
    window.NativeTimeoutObject["" + _id] = func;
    return _id;
}

window.native.Call_TimeoutFire = function(_id)
{
    if (!window.NativeSupportTimeouts)
        return;

    var _prop = "" + _id;
    var _func = window.NativeTimeoutObject[_prop];
    window.NativeTimeoutObject[_prop] = undefined;

    if (!_func)
        return;

    _func.call(null);
    _func = null;
};

function clearInterval(_id)
{
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setInterval(func, interval)
{
    if (!window.NativeSupportTimeouts)
        return;

    var _intervalFunc = function()
    {
        func.call(null);
        setTimeout(func, interval);
    };

    var _id = window.native["GenerateTimeoutId"](interval);
    window.NativeTimeoutObject["" + _id] = _intervalFunc;
    return _id;
}

window.clearTimeout     = clearTimeout;
window.setTimeout       = setTimeout;
window.clearInterval    = clearInterval;
window.setInterval      = setInterval;

var console = {
    log : function(param) { window.native.consoleLog(param); }
};

// HTML page interface
window.native.Call_OnUpdateOverlay = function(param)
{
    return _api.Call_OnUpdateOverlay(param);
};

window.native.Call_OnMouseDown = function(e)
{
    return _api.Call_OnMouseDown(e);
};
window.native.Call_OnMouseUp = function(e)
{
    return _api.Call_OnMouseUp(e);
};
window.native.Call_OnMouseMove = function(e)
{
    return _api.Call_OnMouseMove(e);
};
window.native.Call_OnCheckMouseDown = function(e)
{
    return _api.Call_OnCheckMouseDown(e);
};

window.native.Call_OnKeyDown = function(e)
{
    return _api.Call_OnKeyDown(e);
};
window.native.Call_OnKeyPress = function(e)
{
    return _api.Call_OnKeyPress(e);
};
window.native.Call_OnKeyUp = function(e)
{
    return _api.Call_OnKeyUp(e);
};
window.native.Call_OnKeyboardEvent = function(e)
{
    return _api.Call_OnKeyboardEvent(e);
};

window.native.Call_CalculateResume = function()
{
    return _api.Call_CalculateResume();
};

window.native.Call_TurnOffRecalculate = function()
{
    return _api.Call_TurnOffRecalculate();
};
window.native.Call_TurnOnRecalculate = function()
{
    return _api.Call_TurnOnRecalculate();
};

window.native.Call_CheckTargetUpdate = function()
{
    return _api.Call_CheckTargetUpdate();
};
window.native.Call_Common = function(type, param)
{
    return _api.Call_Common(type, param);
};

window.native.Call_HR_Tabs = function(arrT, arrP)
{
    return _api.Call_HR_Tabs(arrT, arrP);
};
window.native.Call_HR_Pr = function(_indent_left, _indent_right, _indent_first)
{
    return _api.Call_HR_Pr(_indent_left, _indent_right, _indent_first);
};
window.native.Call_HR_Margins = function(_margin_left, _margin_right)
{
    return _api.Call_HR_Margins(_margin_left, _margin_right);
};
window.native.Call_HR_Table = function(_params, _cols, _margins, _rows)
{
    return _api.Call_HR_Table(_params, _cols, _margins, _rows);
};

window.native.Call_VR_Margins = function(_top, _bottom)
{
    return _api.Call_VR_Margins(_top, _bottom);
};
window.native.Call_VR_Header = function(_header_top, _header_bottom)
{
    return _api.Call_VR_Header(_header_top, _header_bottom);
};
window.native.Call_VR_Table = function(_params, _cols, _margins, _rows)
{
    return _api.Call_VR_Table(_params, _cols, _margins, _rows);
};

window.native.Call_Menu_Event = function(type, _params)
{
    return _api.Call_Menu_Event(type, _params);
};

// FT_Common
function _FT_Common()
{
    this.UintToInt = function(v)
    {
        return (v>2147483647)?v-4294967296:v;
    };
    this.UShort_To_Short = function(v)
    {
        return (v>32767)?v-65536:v;
    };
    this.IntToUInt = function(v)
    {
        return (v<0)?v+4294967296:v;
    };
    this.Short_To_UShort = function(v)
    {
        return (v<0)?v+65536:v;
    };
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    };
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    };
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    };
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    };
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    };
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = memory.Alloc(new_count);
        }
        else
        {
            var block2 = memory.Alloc(new_count);
            FT_Common.memcpy_p(block2, pointer, cur_count);
            ret.block = block2;
        }
        return ret;
    };

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = CreateIntArray(new_count);
        }
        else
        {
            var block2 = CreateIntArray(new_count);
            for (var i = 0; i < cur_count; i++)
                block2[i] = pointer[i];

            ret.block = block2;
        }
        return ret;
    };
}

//--------------------------------------------------------------------------------
// font engine
//--------------------------------------------------------------------------------
var FONT_ITALIC_ANGLE   = 0.3090169943749;
var FT_ENCODING_UNICODE = 1970170211;
var FT_ENCODING_NONE    = 0;
var FT_ENCODING_MS_SYMBOL   = 1937337698;
var FT_ENCODING_APPLE_ROMAN = 1634889070;

var LOAD_MODE = 40970;
var REND_MODE = 0;

var FontStyle =
{
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};

var EGlyphState =
{
    glyphstateNormal:   0,
    glyphstateDeafault: 1,
    glyphstateMiss:     2
};

function CPoint1() {
    this.fX = 0;
    this.fY = 0;
    this.fWidth = 0;
    this.fHeight = 0;
}
function CPoint2() {
    this.fLeft = 0;
    this.fTop = 0;
    this.fRight = 0;
    this.fBottom = 0;
}
function CFontManager() {
    this.m_oLibrary = {};
    this.Initialize = function(){};
    this.ClearFontsRasterCache = function(){};
}

function CStylesPainter() {
    this.STYLE_THUMBNAIL_WIDTH  = GlobalSkin.STYLE_THUMBNAIL_WIDTH;
    this.STYLE_THUMBNAIL_HEIGHT = GlobalSkin.STYLE_THUMBNAIL_HEIGHT;

    this.CurrentTranslate = null;
    this.IsRetinaEnabled = false;

    this.defaultStyles = [];
    this.docStyles = [];
    this.mergedStyles = [];
}
CStylesPainter.prototype = {
    GenerateStyles: function(_api, ds)
    {
        if (_api.WordControl.bIsRetinaSupport)
        {
            this.STYLE_THUMBNAIL_WIDTH  <<= 1;
            this.STYLE_THUMBNAIL_HEIGHT <<= 1;
            this.IsRetinaEnabled = true;
        }

        this.CurrentTranslate = _api.CurrentTranslate;

        var _stream = global_memory_stream_menu;
        var _graphics = new CDrawingStream();

        _api.WordControl.m_oDrawingDocument.Native["DD_PrepareNativeDraw"]();

        this.GenerateDefaultStyles(_api, ds, _graphics);
        this.GenerateDocumentStyles(_api, _graphics);

        // стили сформированы. осталось просто сформировать единый список
        var _count_default = this.defaultStyles.length;
        var _count_doc = 0;
        if (null != this.docStyles)
            _count_doc = this.docStyles.length;

        var aPriorityStyles = [];
        var fAddToPriorityStyles = function(style){
            var index = style.Style.uiPriority;
            if(null == index)
                index = 0;
            var aSubArray = aPriorityStyles[index];
            if(null == aSubArray)
            {
                aSubArray = [];
                aPriorityStyles[index] = aSubArray;
            }
            aSubArray.push(style);
        };
        var _map_document = {};

        for (var i = 0; i < _count_doc; i++)
        {
            var style = this.docStyles[i];
            _map_document[style.Name] = 1;
            fAddToPriorityStyles(style);
        }

        for (var i = 0; i < _count_default; i++)
        {
            var style = this.defaultStyles[i];
            if(null == _map_document[style.Name])
                fAddToPriorityStyles(style);
        }

        this.mergedStyles = [];
        for(var index in aPriorityStyles)
        {
            var aSubArray = aPriorityStyles[index];
            aSubArray.sort(function(a, b){
                if(a.Name < b.Name)
                    return -1;
                else if(a.Name > b.Name)
                    return 1;
                else
                    return 0;
            });
            for(var i = 0, length = aSubArray.length; i < length; ++i)
            {
                this.mergedStyles.push(aSubArray[i]);
            }
        }

        var _count = this.mergedStyles.length;
        for (var i = 0; i < _count; i++)
        {
            this.drawStyle(_graphics, this.mergedStyles[i].Style, _api);
        }

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](1);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
    },
    GenerateDefaultStyles: function(_api, ds, _graphics)
    {
        var styles = ds;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                this.defaultStyles.push({ Name: style.Name, Style: style });
                //this.drawStyle(_graphics, style, _api);
            }
        }
    },

    GenerateDocumentStyles: function(_api, _graphics)
    {
        if (_api.WordControl.m_oLogicDocument == null)
            return;

        var __Styles = _api.WordControl.m_oLogicDocument.Get_Styles();
        var styles = __Styles.Style;

        if (styles == null)
            return;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                // как только меняется сериалайзер - меняется и код здесь. Да, не очень удобно,
                // зато быстро делается
                var formalStyle = i.toLowerCase().replace(/\s/g, "");
                var res = formalStyle.match(/^heading([1-9][0-9]*)$/);
                var index = (res) ? res[1] - 1 : -1;

                var _dr_style = __Styles.Get_Pr(i, styletype_Paragraph);
                _dr_style.Name = style.Name;
                _dr_style.Id = i;

                //this.drawStyle(_graphics, _dr_style, _api);

                var _name = _dr_style.Name;
                // алгоритм смены имени
                if (style.Default)
                {
                    switch (style.Default)
                    {
                        case 1:
                            break;
                        case 2:
                            _name = "No List";
                            break;
                        case 3:
                            _name = "Normal";
                            break;
                        case 4:
                            _name = "Normal Table";
                            break;
                    }
                }
                else if (index != -1)
                {
                    _name = "Heading ".concat(index + 1);
                }

                this.docStyles.push({ Name: _name, Style: _dr_style });
            }
        }
    },

    drawStyle: function(graphics, style, _api)
    {
        var _w_px = this.STYLE_THUMBNAIL_WIDTH;
        var _h_px = this.STYLE_THUMBNAIL_HEIGHT;
        var dKoefToMM = g_dKoef_pix_to_mm;

        if (AscBrowser.isRetina)
        {
            _w_px *= 2;
            _h_px *= 2;
            dKoefToMM /= 2;
        }

        _api.WordControl.m_oDrawingDocument.Native["DD_StartNativeDraw"](_w_px, _h_px, _w_px * dKoefToMM, _h_px * dKoefToMM);

        g_oTableId.m_bTurnOff = true;
        History.TurnOff();

        var oldDefTabStop = Default_Tab_Stop;
        Default_Tab_Stop = 1;

        var hdr = new CHeaderFooter(_api.WordControl.m_oLogicDocument.HdrFtr, _api.WordControl.m_oLogicDocument, _api.WordControl.m_oDrawingDocument, hdrftr_Header);
        var _dc = hdr.Content;//new CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, true, false);

        var par = new Paragraph(_api.WordControl.m_oDrawingDocument, _dc, 0, 0, 0, 0, false);
        var run = new ParaRun(par, false);

        for (var i = 0; i < style.Name.length; i++)
        {
            run.Add_ToContent(i, new ParaText(style.Name.charAt(i)), false);
        }

        _dc.Internal_Content_Add(0, par, false);
        par.Add_ToContent(0, run);
        par.Style_Add(style.Id, false);
        par.Set_Align(align_Left);
        par.Set_Tabs(new CParaTabs());

        var _brdL = style.ParaPr.Brd.Left;
        if ( undefined !== _brdL && null !== _brdL )
        {
            var brdL = new CDocumentBorder();
            brdL.Set_FromObject(_brdL);
            brdL.Space = 0;
            par.Set_Border(brdL, historyitem_Paragraph_Borders_Left);
        }

        var _brdT = style.ParaPr.Brd.Top;
        if ( undefined !== _brdT && null !== _brdT )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdT);
            brd.Space = 0;
            par.Set_Border(brd, historyitem_Paragraph_Borders_Top);
        }

        var _brdB = style.ParaPr.Brd.Bottom;
        if ( undefined !== _brdB && null !== _brdB )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdB);
            brd.Space = 0;
            par.Set_Border(brd, historyitem_Paragraph_Borders_Bottom);
        }

        var _brdR = style.ParaPr.Brd.Right;
        if ( undefined !== _brdR && null !== _brdR )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdR);
            brd.Space = 0;
            par.Set_Border(brd, historyitem_Paragraph_Borders_Right);
        }

        var _ind = new CParaInd();
        _ind.FirstLine = 0;
        _ind.Left = 0;
        _ind.Right = 0;
        par.Set_Ind(_ind, false);

        var _sp = new CParaSpacing();
        _sp.Line              = 1;
        _sp.LineRule          = linerule_Auto;
        _sp.Before            = 0;
        _sp.BeforeAutoSpacing = false;
        _sp.After             = 0;
        _sp.AfterAutoSpacing  = false;
        par.Set_Spacing(_sp, false);

        _dc.Reset(0, 0, 10000, 10000);
        _dc.Recalculate_Page(0, true);

        _dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
        _dc.Recalculate_Page(0, true);

        var y = 0;
        var b = dKoefToMM * _h_px;
        var w = dKoefToMM * _w_px;
        var off = 10 * dKoefToMM;
        var off2 = 5 * dKoefToMM;
        var off3 = 1 * dKoefToMM;

        graphics.transform(1,0,0,1,0,0);
        graphics.save();
        graphics._s();
        graphics._m(off2, y + off3);
        graphics._l(w - off, y + off3);
        graphics._l(w - off, b - off3);
        graphics._l(off2, b - off3);
        graphics._z();
        graphics.clip();

        var baseline = par.Lines[0].Y;
        par.Shift(0, off + 0.5, y + 0.75 * (b - y) - baseline);
        par.Draw(0, graphics);

        graphics.restore();

        Default_Tab_Stop = oldDefTabStop;

        g_oTableId.m_bTurnOff = false;
        History.TurnOn();

        var _stream = global_memory_stream_menu;

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](0);
        _stream["WriteString2"](style.Name);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
        graphics.ClearParams();
    }
}

window["use_native_fonts_only"] = true;

//--------------------------------------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;

// FT_Common
function _FT_Common() {
    this.UintToInt = function(v)
    {
        return (v>2147483647)?v-4294967296:v;
    };
    this.UShort_To_Short = function(v)
    {
        return (v>32767)?v-65536:v;
    };
    this.IntToUInt = function(v)
    {
        return (v<0)?v+4294967296:v;
    };
    this.Short_To_UShort = function(v)
    {
        return (v<0)?v+65536:v;
    };
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    };
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    };
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    };
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    };
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    };
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = memory.Alloc(new_count);
        }
        else
        {
            var block2 = memory.Alloc(new_count);
            FT_Common.memcpy_p(block2, pointer, cur_count);
            ret.block = block2;
        }
        return ret;
    };

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = CreateIntArray(new_count);
        }
        else
        {
            var block2 = CreateIntArray(new_count);
            for (var i = 0; i < cur_count; i++)
                block2[i] = pointer[i];

            ret.block = block2;
        }
        return ret;
    };
}
var FT_Common = new _FT_Common();

var global_memory_stream_menu = CreateNativeMemoryStream();

//-------------------------------------------------------------------------------
// ASCCOLOR
function asc_menu_ReadColor(_params, _cursor)
{
    var _color = new asc_CColor();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _color.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _color.r = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _color.g = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _color.b = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _color.a = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _color.Auto = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _color.value = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _color.ColorSchemeId = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                var _count = _params[_cursor.pos++];
                for (var i = 0; i < _count; i++)
                {
                    var _mod = new CColorMod();
                    _mod.name = _params[_cursor.pos++];
                    _mod.val = _params[_cursor.pos++];
                    _color.Mods.push(_mod);
                }
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _color;
}
function asc_menu_WriteColor(_type, _color, _stream)
{
    if (!_color)
        return;

    _stream["WriteByte"](_type);

    if (_color.type !== undefined && _color.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_color.type);
    }
    if (_color.r !== undefined && _color.r !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteByte"](_color.r);
    }
    if (_color.g !== undefined && _color.g !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteByte"](_color.g);
    }
    if (_color.b !== undefined && _color.b !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteByte"](_color.b);
    }
    if (_color.a !== undefined && _color.a !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteByte"](_color.a);
    }
    if (_color.Auto !== undefined && _color.Auto !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_color.Auto);
    }
    if (_color.value !== undefined && _color.value !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_color.value);
    }
    if (_color.ColorSchemeId !== undefined && _color.ColorSchemeId !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_color.ColorSchemeId);
    }
    if (_color.Mods !== undefined && _color.Mods !== null)
    {
        _stream["WriteByte"](8);

        var _len = _color.Mods.length;
        _stream["WriteLong"](_len);

        for (var i = 0; i < _len; i++)
        {
            _stream["WriteString1"](_color.Mods[i].name);
            _stream["WriteLong"](_color.Mods[i].val);
        }
    }

    _stream["WriteByte"](255);
}
// TEXTFONTFAMILY
function asc_menu_ReadFontFamily(_params, _cursor)
{
    var _fontfamily = { Name : undefined, Index : -1 };
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fontfamily.Name = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fontfamily.Index = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _fontfamily;
}
function asc_menu_WriteFontFamily(_type, _family, _stream)
{
    if (!_family)
        return;

    _stream["WriteByte"](_type);

    if (_family.Name !== undefined && _family.Name !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_family.Name);
    }
    if (_family.Index !== undefined && _family.Index !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_family.Index);
    }

    _stream["WriteByte"](255);
}


//--------------------------------------------------------------------------------
// defines
//--------------------------------------------------------------------------------

var PageType = {
    PageDefaultType: 0,
    PageTopType: 1,
    PageLeftType: 2,
    PageCornerType: 3
};

var deviceScale = 1;

//--------------------------------------------------------------------------------
// OfflineEditor
//--------------------------------------------------------------------------------

function OfflineEditor () {

    this.contentX = 16384;
    this.contextY = 1048576;
    this.zoom = 1.0;

    // main

    this.openFile = function () {
        window["CreateMainTextMeasurerWrapper"]();

        deviceScale = window.native["GetDeviceScale"]();

        window.g_file_path = "native_open_file";
        window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(window.native["GetFileString"]());

        //var worksheet = _api.wb.showWorksheet(0);
    };

    // prop

    this.getMaxSizeX = function () {
        return this.contentX;
    };
    this.getMaxSizeY = function () {
        return this.contextY;
    };
    this.getSelection = function(x, y, width, height) {
        _null_object.width = width;
        _null_object.height = height;

        var worksheet = _api.wb.getWorksheet();
        var region = this._updateRegion(worksheet, x, y, width, height);

        return _api.wb.getWorksheet()._getDrawSelection_Local(region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd);
    };

    // render

    this.drawSheet = function (x, y, width, height, ratio) {
        _null_object.width = width * ratio;
        _null_object.height = height * ratio;

        var worksheet = _api.wb.getWorksheet();
        var region = this._updateRegion(worksheet, x, y, width * ratio, height * ratio);

        worksheet._drawGrid_Local(undefined,
            region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd,
            worksheet.cols[region.columnBeg].left + region.columnOff, worksheet.rows[region.rowBeg].top + region.rowOff,
            width + region.columnOff, height + region.rowOff);

        worksheet._drawCellsAndBorders_Local(undefined,
            region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd,
            worksheet.cols[region.columnBeg].left + region.columnOff, worksheet.rows[region.rowBeg].top + region.rowOff);
    };
    this.drawHeader = function (x, y, width, height, type, ratio) {

        _null_object.width = width * ratio;
        _null_object.height = height * ratio;

        var worksheet = _api.wb.getWorksheet();
        var region = this._updateRegion(worksheet, x, y, width * ratio, height * ratio);

        var isColumn = type == PageType.PageTopType || type == PageType.PageCornerType;
        var isRow = type == PageType.PageLeftType || type == PageType.PageCornerType;

        if (!isColumn && isRow)
            worksheet._drawRowHeaders_Local(undefined, region.rowBeg, region.rowEnd, undefined, 0, region.rowOff);
        else if (isColumn && !isRow)
            worksheet._drawColumnHeaders_Local(undefined, region.columnBeg, region.columnEnd, undefined, region.columnOff, 0);
        else if (isColumn && isRow)
            worksheet._drawCorner();
    };

    // internal

    this._updateRegion = function (worksheet, x, y, width, height) {

        var i = 0;
        var nativeToEditor = 1.0 / deviceScale * (72.0 / 96.0);

        // координаты в СО редактора

        var logicX = x * nativeToEditor + worksheet.headersWidth;
        var logicY = y * nativeToEditor + worksheet.headersHeight;
        var logicToX = ( x + width ) * nativeToEditor + worksheet.headersWidth;
        var logicToY = ( y + height ) * nativeToEditor + worksheet.headersHeight;

        var columnBeg = -1;
        var columnEnd = -1;
        var columnOff = 0;
        var rowBeg = -1;
        var rowEnd = -1;
        var rowOff = 0;
        var count = 0;

        // добавляем отсутствующие колонки ( с небольшим зазором )

        var logicToXMAX = logicToX;//10000 * (1 + Math.floor(logicToX / 10000));

        if (logicToXMAX >= worksheet.cols[worksheet.cols.length - 1].left) {

            do {
                worksheet.nColsCount = worksheet.cols.length + 1;
                worksheet._calcWidthColumns(2); // fullRecalc

                if (logicToXMAX < worksheet.cols[worksheet.cols.length - 1].left) {
                    break
                }
            } while (1);
        }


        if (logicX < worksheet.cols[worksheet.cols.length - 1].left) {
            count = worksheet.cols.length;
            for (i = 0; i < count; ++i) {
                if (-1 === columnBeg) {
                    if (worksheet.cols[i].left <= logicX && logicX < worksheet.cols[i].left + worksheet.cols[i].width) {
                        columnBeg = i;
                        columnOff = logicX - worksheet.cols[i].left;
                    }
                }

                if (worksheet.cols[i].left <= logicToX && logicToX < worksheet.cols[i].left + worksheet.cols[i].width) {
                    columnEnd = i;
                    break;
                }
            }
        }

        // добавляем отсутствующие строки ( с небольшим зазором )

        var logicToYMAX = logicToY;//10000 * (1 + Math.floor(logicToY / 10000));

        if (logicToYMAX >= worksheet.rows[worksheet.rows.length - 1].top) {

            do {
                worksheet.nRowsCount = worksheet.rows.length + 1;
                worksheet._calcHeightRows(2); // fullRecalc

                if (logicToYMAX < worksheet.rows[worksheet.rows.length - 1].top) {
                    break
                }
            } while (1);
        }


        if (logicY < worksheet.rows[worksheet.rows.length - 1].top) {
            count = worksheet.rows.length;
            for (i = 0; i < count; ++i) {
                if (-1 === rowBeg) {
                    if (worksheet.rows[i].top <= logicY && logicY < worksheet.rows[i].top + worksheet.rows[i].height) {
                        rowBeg = i;
                        rowOff = logicY - worksheet.rows[i].top;
                    }
                }

                if (worksheet.rows[i].top <= logicToY && logicToY < worksheet.rows[i].top + worksheet.rows[i].height) {
                    rowEnd = i;
                    break;
                }
            }
        }

        return {
            columnBeg: columnBeg,
            columnEnd: columnEnd,
            columnOff: columnOff,
            rowBeg: rowBeg,
            rowEnd: rowEnd,
            rowOff: rowOff
        };
    };

    this._updateContentSize = function (isColumnRecalc, isRowRecalc) {

        // сделать пересчет по надобности

        //var gc_nMaxRow = 1048576;
        //var gc_nMaxCol = 16384;
    }
}
var _s = new OfflineEditor();

//--------------------------------------------------------------------------------
// ios
//--------------------------------------------------------------------------------

function offline_of() {_s.openFile();}
function offline_sx() {_s.getMaxSizeX();}
function offline_sy() {_s.getMaxSizeY();}
function offline_stz(v) {_s.zoom = v; _api.asc_setZoom(v);}
function offline_ds(x, y, width, height, ratio) {_s.drawSheet(x, y, width, height, ratio);}
function offline_dh(x, y, width, height, type, ratio) {_s.drawHeader(x, y, width, height, type, ratio);}
function offline_mouse_down(x, y) {
    _api.wb.getWorksheet().changeSelectionStartPoint(x, y, true, true);
}
function offline_mouse_move(x, y) {
    _api.wb.getWorksheet().changeSelectionEndPoint(x, y, true, true);
}
function offline_mouse_up(x, y) {
    _api.wb.getWorksheet().changeSelectionDone();
}
function offline_get_selection(x, y, width, height) {
    return _s.getSelection(x, y, width, height);
}
function offline_apply_event(type,params) {
    var _return = undefined;
    var _current = {pos: 0};
    var _continue = true;
    switch (type) {

        case 3: // ASC_MENU_EVENT_TYPE_UNDO
        {
            _api.asc_Undo();
            break;
        }
        case 4: // ASC_MENU_EVENT_TYPE_REDO
        {
            _api.asc_Redo();
            break;
        }
        case 2000: // ASC_SPREADSHEETS_EVENT_TYPE_CELL_PR
        {
            while (_continue) {
                var _attr = params[_current.pos++];
                switch (_attr) {
                    case 0:
                    {
                        _api.asc_setCellBold(params[_current.pos++]);
                        break;
                    }
                    case 1:
                    {
                        _api.asc_setCellItalic(params[_current.pos++]);
                        break;
                    }
                    case 2:
                    {
                        _api.asc_setCellUnderline(params[_current.pos++]);
                        break;
                    }
                    case 3:
                    {
                        _api.asc_setCellStrikeout(params[_current.pos++]);
                        break;
                    }
                    case 4:
                    {
                        _api.asc_setCellFontName(asc_menu_ReadFontFamily(params, _current).Name);
                        break;
                    }
                    case 5:
                    {
                        _api.asc_setCellFontSize(params[_current.pos++]);
                        break;
                    }
                    case 6:
                    {
                        var textColor = asc_menu_ReadColor(params, _current);
                        _api.asc_setCellTextColor(textColor);
                        break;
                    }
                    case 7:
                    {
                        var backgroundColor = asc_menu_ReadColor(params, _current);
                        _api.asc_setCellBackgroundColor(backgroundColor);
                        break;
                    }
                    case 8:
                    {
                        _api.asc_setCellSuperscript(params[_current.pos++]);
                        break;
                    }
                    case 9:
                    {
                        var horizAlign = params[_current.pos++], ha = '';

                        if (horizAlign === c_oAscAlignType.NONE) ha = 'none';
                        else if (horizAlign === c_oAscAlignType.LEFT) ha = 'left';
                        else if (horizAlign === c_oAscAlignType.CENTER) ha = 'center';
                        else if (horizAlign === c_oAscAlignType.RIGHT) ha = 'right';
                        else if (horizAlign === c_oAscAlignType.JUSTIFY) ha = 'justify';
                        else if (horizAlign === c_oAscAlignType.TOP) ha = 'top';
                        else if (horizAlign === c_oAscAlignType.MIDDLE) ha = 'center';
                        else if (horizAlign === c_oAscAlignType.BOTTOM) ha = 'bottom';

                        _api.asc_setCellAlign(ha);

                        break;
                    }
                    case 10:
                    {
                        var vertAlign = params[_current.pos++], va = '';

                        if (vertAlign === c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM) va = 'bottom';
                        else if (vertAlign === c_oAscVerticalTextAlign.TEXT_ALIGN_CTR) va = 'center';
                        else if (vertAlign === c_oAscVerticalTextAlign.TEXT_ALIGN_DIST) va = 'distributed';
                        else if (vertAlign === c_oAscVerticalTextAlign.TEXT_ALIGN_JUST) va = 'justify';
                        else if (vertAlign === c_oAscVerticalTextAlign.TEXT_ALIGN_TOP) va = 'top';

                        _api.asc_setCellVertAlign(va);

                        break;
                    }
                    case 11:
                    {
                        _api.asc_setCellTextWrap(params[_current.pos++]);
                        break;
                    }
                    case 12:
                    {
                        _api.asc_setCellTextShrink(params[_current.pos++]);
                        break;
                    }
                    case 255:
                    default:
                    {
                        _continue = false;
                        break;
                    }
                }
            }
            break;
        }
        case 2010:
        {
            var _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();

            var merged = _api.asc_getCellInfo().asc_getFlags().asc_getMerge();

            if (!merged && _api.asc_mergeCellsDataLost(params)) {
                _stream["WriteBool"](true);
            } else {
                _stream["WriteBool"](false);
            }

            _return = _stream;
            break;
        }
        case 2020:
        {
            _api.asc_mergeCells(params);
            break;
        }
        case 2030:
        {
            _api.asc_setCellFormat(params);
            break;
        }
        case 2031:
        {
            _api.asc_decreaseCellDigitNumbers();
            break;
        }
        case 2032:
        {
            _api.asc_increaseCellDigitNumbers();
            break;
        }
        case 2040:
        {
            if (params.length) {
                var typeF = params[0], cellId ='';
                if (2===params.length)
                    cellId = params[1];
                _api.asc_sortColFilter(typeF, cellId);
            }
            break;
        }
        case 3010:
        {
            _api.asc_emptyCells(params);
            break;
        }
        default:
            break;
    }

    return _return;
}


