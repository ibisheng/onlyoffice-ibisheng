var editor = undefined;
var window = {};
var navigator = {};
navigator.userAgent = "chrome";
window.navigator = navigator;
window.location = {};

window.location.protocol = "";
window.location.host = "";
window.location.href = "";
window.location.pathname = "";

window.NATIVE_EDITOR_ENJINE = true;
window.NATIVE_EDITOR_ENJINE_SYNC_RECALC = true;
window.IS_NATIVE_EDITOR = true;

var document = {};
window.document = document;

window["Asc"] = {};
var Asc = window["Asc"];

window["AscFonts"] = {};
var AscFonts = window["AscFonts"];

window["AscCommon"] = {};
var AscCommon = window["AscCommon"];

window["AscFormat"] = {};
var AscFormat = window["AscFormat"];

window["AscDFH"] = {};
var AscDFH = window["AscDFH"];

window["AscCH"] = {};
var AscCH = window["AscCH"];

window["AscCommonExcel"] = {};
var AscCommonExcel = window["AscCommonExcel"];

function Image() {
    this.src = "";
    this.onload = function()
    {
    }
    this.onerror = function()
    {
    }
}
function _image_data() {
    this.data = null;
    this.length = 0;
}

function native_pattern_fill() {
}
native_pattern_fill.prototype = {
    setTransform : function(transform) {}
};

function native_gradient_fill() {
}
native_gradient_fill.prototype = {
    addColorStop : function(offset,color) {}
};

function native_context2d(parent) {
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
native_context2d.prototype = {
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

document.createElement = function(type) {
    if (type && type.toLowerCase)
    {
        if (type.toLowerCase() == "canvas")
            return new native_canvas();
    }

    return _null_object;
};

function _return_empty_html_element() { return _null_object; }

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

var _api = null;

window.NativeSupportTimeouts = false;
window.NativeTimeoutObject = {};

function clearTimeout(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setTimeout(func, interval) {
    if (!window.NativeSupportTimeouts)
        return;

    var _id = window.native["GenerateTimeoutId"](interval);
    window.NativeTimeoutObject["" + _id] = func;
    return _id;
}
function offline_timeoutFire(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    var _prop = "" + _id;
    var _func = window.NativeTimeoutObject[_prop];
    window.NativeTimeoutObject[_prop] = undefined;

    if (!_func)
        return;

    _func.call(null);
    _func = null;
}
function clearInterval(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setInterval(func, interval) {
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

window.clearTimeout = clearTimeout;
window.setTimeout = setTimeout;
window.clearInterval = clearInterval;
window.setInterval = setInterval;

var console = {
    log : function(param) { window.native.consoleLog(param); },
    time : function (param) {},
    timeEnd : function (param) {}
};

window["NativeCorrectImageUrlOnPaste"] = function(url) {
    return window["native"]["CorrectImageUrlOnPaste"](url);
};
window["NativeCorrectImageUrlOnCopy"] = function(url) {
    return window["native"]["CorrectImageUrlOnCopy"](url);
};

window['AscFonts'].CFontManager = function CFontManager() {
    this.m_oLibrary = {};
    this.Initialize = function(){};
    this.ClearFontsRasterCache = function(){};
};
window["use_native_fonts_only"] = true;

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

window['AscFonts'] = window['AscFonts'] || {};
window['AscFonts'].FT_Common = FT_Common;