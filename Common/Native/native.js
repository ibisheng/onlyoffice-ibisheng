var editor = undefined;
var window = new Object();
var navigator = new Object();
navigator.userAgent = "chrome";
window.navigator = navigator;
window.location = new Object();

window.location.protocol = "";
window.location.host = "";
window.location.href = "";

window.NATIVE_EDITOR_ENJINE = true;
window.NATIVE_EDITOR_ENJINE_SYNC_RECALC = true;

var document = new Object();
window.document = document;

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

    createLinearGradient : function(x0,y0,x1,y1) { return null; },
    createRadialGradient : function(x0,y0,r0,x1,y1,r1) { return null; },
    createPattern : function(image,repetition) { return null; },

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
        _data.data = new Uint8Array(imagedata_or_sw * sh * 4);
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

window["Asc"] = new Object();

var _null_object = new Object();
_null_object.length = 0;
_null_object.nodeType = 1;
_null_object.offsetWidth = 1;
_null_object.offsetHeight = 1;
_null_object.clientWidth = 1;
_null_object.clientHeight = 1;
_null_object.scrollWidth = 1;
_null_object.scrollHeight = 1;
_null_object.style = new Object();
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
_null_object.width = function() { return 0; };
_null_object.height = function() { return 0; };
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

function GetNativeEngine()
{
	return window.native;
}

var native_renderer = null;
var _api = null;
var Asc = null;

function NativeOpenFile()
{
    var doc_bin = window.native.GetFileString(g_file_path);
    if (NATIVE_DOCUMENT_TYPE == "presentation" || NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");       
        _api.asc_nativeOpenFile(doc_bin);
    }
    else
    {
        Asc = window["Asc"];    
        _api = new window["Asc"]["spreadsheet_api"];
        var doc_bin = window.native.GetFileString(g_file_path);
        _api.asc_nativeOpenFile(doc_bin);
    }
}

function NativeOpenFile2()
{
	g_oTextMeasurer = new CTextMeasurerWrapper();
	g_oTextMeasurer.Init();

	window.g_file_path = "native_open_file";
	window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
    var doc_bin = window.native.GetFileString(window.g_file_path);
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");       
        _api.asc_nativeOpenFile(doc_bin);
        
        if (_api.WordControl.m_oDrawingDocument.AfterLoad)
            _api.WordControl.m_oDrawingDocument.AfterLoad();
    }
    else
    {
        Asc = window["Asc"];    
        _api = new window["Asc"]["spreadsheet_api"];
        var doc_bin = window.native.GetFileString(window.g_file_path);
        _api.asc_nativeOpenFile(doc_bin);
    }
}

function NativeCalculateFile()
{
	_api.asc_nativeCalculateFile();
}

function NativeApplyChanges()
{
    if (NATIVE_DOCUMENT_TYPE == "presentation" || NATIVE_DOCUMENT_TYPE == "document")
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
	_api.WordControl.m_oDrawingDocument.LogicDocument = _api.WordControl.m_oDrawingDocument.m_oLogicDocument;
    _api.WordControl.m_oDrawingDocument.RenderPage(pageIndex);
}

function GetNativeId()
{
    return window.native.GetFileId();
}

function clearTimeout() {};
function setTimeout() {};
function clearInterval() {};
function setInterval() {};

window.clearTimeout = clearTimeout;
window.setTimeout = setTimeout;
window.clearInterval = clearInterval;
window.setInterval = setInterval;

window["OfficeExcel"] = {type:'common'};
var OfficeExcel = window["OfficeExcel"];

var console = {
	log : function(param) { window.native.ConsoleLog(param); }
};

// HTML page interface
window.native.Call_OnUpdateOverlay = function(param)
{
    _api.WordControl.m_oDrawingDocument.OnUpdateOverlay();
};

window.native.Call_OnMouseDown = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnMouseDown(e);
};
window.native.Call_OnMouseUp = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnMouseUp(e);
};
window.native.Call_OnMouseMove = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnMouseMove(e);
};

window.native.Call_OnKeyDown = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnKeyDown(e);
};
window.native.Call_OnKeyPress = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnKeyPress(e);
};
window.native.Call_OnKeyUp = function(e)
{
    _api.WordControl.m_oDrawingDocument.OnKeyUp(e);
};

window.native.Call_CalculateResume = function()
{
    Document_Recalculate_Page();
};

window.native.Call_TurnOffRecalculate = function()
{
    _api.WordControl.m_oLogicDocument.TurnOffRecalc = true;
};
window.native.Call_TurnOnRecalculate = function()
{
    _api.WordControl.m_oLogicDocument.TurnOffRecalc = false;
};