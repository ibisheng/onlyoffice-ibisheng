var _g_dKoef_mm_to_pix = 96 / 25.4;
var _g_dKoef_pix_to_mm = 25.4 / 96;

// dublivate classes
function _CBounds()
{
    this.L      = 0;    // ????? ???????
    this.T      = 0;    // ??????? ???????
    this.R      = 0;    // ?????? ??????? (???? ?????? ???? isAbsR, ?? ??? ?????????? ??????, ? ?? R)
    this.B      = 0;    // ??????? ??????? (???? ?????? ???? isAbsB, ?? ??? ?????????? ??????, ? ?? B)

    this.isAbsL = false;
    this.isAbsT = false;
    this.isAbsR = false;
    this.isAbsB = false;

    this.AbsW   = -1;
    this.AbsH   = -1;

    this.SetParams = function(_l,_t,_r,_b,abs_l,abs_t,abs_r,abs_b,absW,absH)
    {
        this.L = _l;
        this.T = _t;
        this.R = _r;
        this.B = _b;

        this.isAbsL = abs_l;
        this.isAbsT = abs_t;
        this.isAbsR = abs_r;
        this.isAbsB = abs_b;

        this.AbsW   = absW;
        this.AbsH   = absH;
    }
}

function _CAbsolutePosition()
{
    this.L  = 0;
    this.T  = 0;
    this.R  = 0;
    this.B  = 0;
}

var _g_anchor_left       = 1;
var _g_anchor_top        = 2;
var _g_anchor_right      = 4;
var _g_anchor_bottom     = 8;

function _CControl()
{
    this.Bounds         = new _CBounds();

    this.Anchor         = _g_anchor_left | _g_anchor_top;

    this.Name           = null;
    this.Parent         = null;
    this.TabIndex       = null;

    this.HtmlElement    = null;

    this.AbsolutePosition = new _CBounds();

    this.Resize = function(_width,_height)
    {
        if ((null == this.Parent) || (null == this.HtmlElement))
            return;

        var _x = 0;
        var _y = 0;
        var _r = 0;
        var _b = 0;

        var hor_anchor = (this.Anchor & 0x05);
        var ver_anchor = (this.Anchor & 0x0A);

        if (_g_anchor_left == hor_anchor)
        {
            if (this.Bounds.isAbsL)
                _x = this.Bounds.L;
            else
                _x = (this.Bounds.L * _width / 1000);

            if (-1 != this.Bounds.AbsW)
                _r = _x + this.Bounds.AbsW;
            else
            {
                if (this.Bounds.isAbsR)
                    _r = (_width - this.Bounds.R);
                else
                    _r = this.Bounds.R * _width / 1000;
            }
        }
        else if (_g_anchor_right == hor_anchor)
        {
            if (this.Bounds.isAbsR)
                _r = (_width - this.Bounds.R);
            else
                _r = (this.Bounds.R * _width / 1000);

            if (-1 != this.Bounds.AbsW)
                _x = _r - this.Bounds.AbsW;
            else
            {
                if (this.Bounds.isAbsL)
                    _x = this.Bounds.L;
                else
                    _x = this.Bounds.L * _width / 1000;
            }
        }
        else if ((_g_anchor_left | _g_anchor_right) == hor_anchor)
        {
            if (this.Bounds.isAbsL)
                _x = this.Bounds.L;
            else
                _x = (this.Bounds.L * _width / 1000);

            if (this.Bounds.isAbsR)
                _r = (_width - this.Bounds.R);
            else
                _r = (this.Bounds.R * _width / 1000);
        }
        else
        {
            _x = this.Bounds.L;
            _r = this.Bounds.R;
        }

        if (_g_anchor_top == ver_anchor)
        {
            if (this.Bounds.isAbsT)
                _y = this.Bounds.T;
            else
                _y = (this.Bounds.T * _height / 1000);

            if (-1 != this.Bounds.AbsH)
                _b = _y + this.Bounds.AbsH;
            else
            {
                if (this.Bounds.isAbsB)
                    _b = (_height - this.Bounds.B);
                else
                    _b = this.Bounds.B * _height / 1000;
            }
        }
        else if (_g_anchor_bottom == ver_anchor)
        {
            if (this.Bounds.isAbsB)
                _b = (_height - this.Bounds.B);
            else
                _b = (this.Bounds.B * _height / 1000);

            if (-1 != this.Bounds.AbsH)
                _y = _b - this.Bounds.AbsH;
            else
            {
                if (this.Bounds.isAbsT)
                    _y = this.Bounds.T;
                else
                    _y = this.Bounds.T * _height / 1000;
            }
        }
        else if ((_g_anchor_top | _g_anchor_bottom) == ver_anchor)
        {
            if (this.Bounds.isAbsT)
                _y = this.Bounds.T;
            else
                _y = (this.Bounds.T * _height / 1000);

            if (this.Bounds.isAbsB)
                _b = (_height - this.Bounds.B);
            else
                _b = (this.Bounds.B * _height / 1000);
        }
        else
        {
            _y = this.Bounds.T;
            _b = this.Bounds.B;
        }

        this.AbsolutePosition.L = _x;
        this.AbsolutePosition.T = _y;
        this.AbsolutePosition.R = _r;
        this.AbsolutePosition.B = _b;

        this.HtmlElement.style.left 	= parseInt(_x * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.top 		= parseInt(_y * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.width 	= parseInt((_r - _x) * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.height 	= parseInt((_b - _y) * _g_dKoef_mm_to_pix + 0.5) + "px";

        this.HtmlElement.width 	= parseInt((_r - _x) * _g_dKoef_mm_to_pix + 0.5);
        this.HtmlElement.height = parseInt((_b - _y) * _g_dKoef_mm_to_pix + 0.5);
    }


}

function _CControlContainer()
{
    this.Bounds         = new _CBounds();
    this.Anchor         = _g_anchor_left | _g_anchor_top;

    this.Name           = null;
    this.Parent         = null;
    this.TabIndex       = null;

    this.HtmlElement    = null;

    this.AbsolutePosition = new _CBounds();

    this.Controls       = new Array();

    this.AddControl = function(ctrl)
    {
        ctrl.Parent = this;
        this.Controls[this.Controls.length] = ctrl;
    }

    this.Resize = function(_width,_height)
    {
        if (null == this.Parent)
        {
            this.AbsolutePosition.L = 0;
            this.AbsolutePosition.T = 0;
            this.AbsolutePosition.R = _width;
            this.AbsolutePosition.B = _height;

            if (null != this.HtmlElement)
            {
                var lCount = this.Controls.length;
                for (var i = 0; i < lCount; i++)
                {
                    this.Controls[i].Resize(_width,_height);
                }
            }
            return;
        }

        var _x = 0;
        var _y = 0;
        var _r = 0;
        var _b = 0;

        var hor_anchor = (this.Anchor & 0x05);
        var ver_anchor = (this.Anchor & 0x0A);

        if (_g_anchor_left == hor_anchor)
        {
            if (this.Bounds.isAbsL)
                _x = this.Bounds.L;
            else
                _x = (this.Bounds.L * _width / 1000);

            if (-1 != this.Bounds.AbsW)
                _r = _x + this.Bounds.AbsW;
            else
            {
                if (this.Bounds.isAbsR)
                    _r = (_width - this.Bounds.R);
                else
                    _r = this.Bounds.R * _width / 1000;
            }
        }
        else if (_g_anchor_right == hor_anchor)
        {
            if (this.Bounds.isAbsR)
                _r = (_width - this.Bounds.R);
            else
                _r = (this.Bounds.R * _width / 1000);

            if (-1 != this.Bounds.AbsW)
                _x = _r - this.Bounds.AbsW;
            else
            {
                if (this.Bounds.isAbsL)
                    _x = this.Bounds.L;
                else
                    _x = this.Bounds.L * _width / 1000;
            }
        }
        else if ((_g_anchor_left | _g_anchor_right) == hor_anchor)
        {
            if (this.Bounds.isAbsL)
                _x = this.Bounds.L;
            else
                _x = (this.Bounds.L * _width / 1000);

            if (this.Bounds.isAbsR)
                _r = (_width - this.Bounds.R);
            else
                _r = (this.Bounds.R * _width / 1000);
        }
        else
        {
            _x = this.Bounds.L;
            _r = this.Bounds.R;
        }

        if (_g_anchor_top == ver_anchor)
        {
            if (this.Bounds.isAbsT)
                _y = this.Bounds.T;
            else
                _y = (this.Bounds.T * _height / 1000);

            if (-1 != this.Bounds.AbsH)
                _b = _y + this.Bounds.AbsH;
            else
            {
                if (this.Bounds.isAbsB)
                    _b = (_height - this.Bounds.B);
                else
                    _b = this.Bounds.B * _height / 1000;
            }
        }
        else if (_g_anchor_bottom == ver_anchor)
        {
            if (this.Bounds.isAbsB)
                _b = (_height - this.Bounds.B);
            else
                _b = (this.Bounds.B * _height / 1000);

            if (-1 != this.Bounds.AbsH)
                _y = _b - this.Bounds.AbsH;
            else
            {
                if (this.Bounds.isAbsT)
                    _y = this.Bounds.T;
                else
                    _y = this.Bounds.T * _height / 1000;
            }
        }
        else if ((_g_anchor_top | _g_anchor_bottom) == ver_anchor)
        {
            if (this.Bounds.isAbsT)
                _y = this.Bounds.T;
            else
                _y = (this.Bounds.T * _height / 1000);

            if (this.Bounds.isAbsB)
                _b = (_height - this.Bounds.B);
            else
                _b = (this.Bounds.B * _height / 1000);
        }
        else
        {
            _y = this.Bounds.T;
            _b = this.Bounds.B;
        }

        this.AbsolutePosition.L = _x;
        this.AbsolutePosition.T = _y;
        this.AbsolutePosition.R = _r;
        this.AbsolutePosition.B = _b;

        this.HtmlElement.style.left 	= parseInt(_x * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.top 		= parseInt(_y * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.width 	= parseInt((_r - _x) * _g_dKoef_mm_to_pix + 0.5) + "px";
        this.HtmlElement.style.height 	= parseInt((_b - _y) * _g_dKoef_mm_to_pix + 0.5) + "px";

        var lCount = this.Controls.length;
        for (var i = 0; i < lCount; i++)
        {
            this.Controls[i].Resize(_r - _x,_b - _y);
        }
    }
}

function _CreateControlContainer(name)
{
    var ctrl = new _CControlContainer();
    ctrl.Name = name;
    ctrl.HtmlElement = document.getElementById(name);
    return ctrl;
}
function _CreateControl(name)
{
    var ctrl = new _CControl();
    ctrl.Name = name;
    ctrl.HtmlElement = document.getElementById(name);
    return ctrl;
}

var StatusPanel = null;
var StatusPanel_statusText = null;
var StatusPanel_buttonZoomOut = null;
var StatusPanel_buttonZoomText = null;
var StatusPanel_buttonZoomIn = null;

function InitStatus()
{
    window._button_eventHandlers = button_eventHandlers;

    StatusPanel = _CreateControlContainer("id_status");
    StatusPanel.Bounds.SetParams(0,0,1000,7,false,false,false,true,-1,6);
    StatusPanel.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
    
    StatusPanel_statusText = _CreateControl("id_status_text");
    StatusPanel_statusText.Bounds.SetParams(0,0,1000,1000,false,false,false,false,-1,-1);
    StatusPanel_statusText.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
    StatusPanel.AddControl(StatusPanel_statusText);

    StatusPanel_buttonZoomOut = _CreateControl("id_buttonZoomOut");
    StatusPanel_buttonZoomOut.Bounds.SetParams(0,0,26,1000,false,false,true,false,5,5);
    StatusPanel_buttonZoomOut.Anchor = (g_anchor_right | g_anchor_top);
    StatusPanel.AddControl(StatusPanel_buttonZoomOut);

    StatusPanel_buttonZoomText = _CreateControl("id_TextZoomValue");
    StatusPanel_buttonZoomText.Bounds.SetParams(0,0,11,1000,false,false,true,false,15,5);
    StatusPanel_buttonZoomText.Anchor = (g_anchor_right | g_anchor_top);
    StatusPanel.AddControl(StatusPanel_buttonZoomText);

    StatusPanel_buttonZoomIn = _CreateControl("id_buttonZoomIn");
    StatusPanel_buttonZoomIn.Bounds.SetParams(0,0,6,1000,false,false,true,false,5,5);
    StatusPanel_buttonZoomIn.Anchor = (g_anchor_right | g_anchor_top);
    StatusPanel.AddControl(StatusPanel_buttonZoomIn);

    var button_ZoomOut  = new window._button_eventHandlers("","0px 0px","0px -20px", "0px -40px",StatusPanel_buttonZoomOut,window.onButtonZoomOutClick);
    var button_ZoomIn   = new window._button_eventHandlers("","0px -60px","0px -80px", "0px -100px",StatusPanel_buttonZoomIn,window.onButtonZoomInClick);

    RegisterStatusBar();
}

window.onButtonZoomOutClick = function()
{
    editor.WordControl.zoom_Out();
}

window.onButtonZoomInClick = function()
{
    editor.WordControl.zoom_In();
}

function _checkBodyWidth()
{
    var w = 0;
    if (window.innerWidth)
        w = window.innerWidth;
    else if (document.documentElement && document.documentElement.clientWidth)
        w = document.documentElement.clientWidth;
    else if (document.body)
        w = document.body.clientWidth;
    return w;
}
function _checkBodyHeight()
{
    var h = 0;
    if (window.innerHeight)
        h = window.innerHeight;
    else if (document.documentElement && document.documentElement.clientHeight)
        h = document.documentElement.clientHeight;
    else if (document.body)
        h = document.body.clientHeight;
    return h;
}

function ResizeStatus()
{
    var status_element = document.getElementById("id_status");

    var _left = 0;
    var _top = _checkBodyHeight() - 22;
	if (window.__IScrollReInit != undefined)
		_top -= 43;
    var _width = _checkBodyWidth();
    var _height = 18;

    status_element.style.left = _left + "px";
    status_element.style.top = _top + "px";
    status_element.style.width = _width + "px";
    status_element.style.height = _height + "px";

    StatusPanel.AbsolutePosition.L = _left * _g_dKoef_pix_to_mm;
    StatusPanel.AbsolutePosition.T = _top * _g_dKoef_pix_to_mm;
    StatusPanel.AbsolutePosition.R = (_left + _width) * _g_dKoef_pix_to_mm;
    StatusPanel.AbsolutePosition.B = (_top + _height) * _g_dKoef_pix_to_mm;

    if (null != StatusPanel.HtmlElement)
    {
        var lCount = StatusPanel.Controls.length;
        for (var i = 0; i < lCount; i++)
        {
            StatusPanel.Controls[i].Resize(_width * _g_dKoef_pix_to_mm, _height * _g_dKoef_pix_to_mm);
        }
    }
}

var ___pages_count = 0;
var ___page_number = 0;

function __status_set_zoom(zoom, type)
{
    StatusPanel_buttonZoomText.HtmlElement.innerHTML = zoom + "%";
}
function __status_set_current_page(number)
{
    ___page_number = number;
    StatusPanel_statusText.HtmlElement.innerHTML = "  Page " + (___page_number + 1) + " of " + ___pages_count;
}
function __status_set_pagescount(count)
{
    ___pages_count = count;
    StatusPanel_statusText.HtmlElement.innerHTML = "  Page " + (___page_number + 1) + " of " + ___pages_count;
}
function __status_message(message)
{
    StatusPanel_statusText.HtmlElement.innerHTML = message;
}

function RegisterStatusBar()
{
    editor.asc_registerCallback("asc_onZoomChange", __status_set_zoom);
    editor.asc_registerCallback("asc_onCurrentPage", __status_set_current_page);
    editor.asc_registerCallback("asc_onCountPages", __status_set_pagescount);
    editor.asc_registerCallback("asc_onMessage", __status_message)
}