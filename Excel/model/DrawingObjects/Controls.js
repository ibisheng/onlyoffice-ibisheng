"use strict";

function CBounds()
{
    this.L      = 0;    // ����� �������
    this.T      = 0;    // ������� �������
    this.R      = 0;    // ������ ������� (���� ������ ���� isAbsR, �� ��� ���������� ������, � �� R)
    this.B      = 0;    // ������� ������� (���� ������ ���� isAbsB, �� ��� ���������� ������, � �� B)

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

function CAbsolutePosition()
{
    this.L  = 0;
    this.T  = 0;
    this.R  = 0;
    this.B  = 0;
}

var g_anchor_left       = 1;
var g_anchor_top        = 2;
var g_anchor_right      = 4;
var g_anchor_bottom     = 8;

function CControl()
{
    this.Bounds         = new CBounds();

    this.Anchor         = g_anchor_left | g_anchor_top;

    this.Name           = null;
    this.Parent         = null;
    this.TabIndex       = null;

    this.HtmlElement    = null;

    this.AbsolutePosition = new CBounds();
	
	this.Resize = function(_width,_height,api)
	{
		if ((null == this.Parent) || (null == this.HtmlElement))
			return;

        var _x = 0;
        var _y = 0;
        var _r = 0;
        var _b = 0;

        var hor_anchor = (this.Anchor & 0x05);
        var ver_anchor = (this.Anchor & 0x0A);

        if (g_anchor_left == hor_anchor)
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
        else if (g_anchor_right == hor_anchor)
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
        else if ((g_anchor_left | g_anchor_right) == hor_anchor)
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

        if (g_anchor_top == ver_anchor)
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
        else if (g_anchor_bottom == ver_anchor)
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
        else if ((g_anchor_top | g_anchor_bottom) == ver_anchor)
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

        if (_r < _x)
            _r = _x;
        if (_b < _y)
            _b = _y;

        this.AbsolutePosition.L = _x;
        this.AbsolutePosition.T = _y;
        this.AbsolutePosition.R = _r;
        this.AbsolutePosition.B = _b;

        this.HtmlElement.style.left 	= ((_x * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.top 		= ((_y * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.width 	= (((_r - _x) * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.height 	= (((_b - _y) * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";

        if (api !== undefined && api.CheckRetinaElement && api.CheckRetinaElement(this.HtmlElement))
        {
            var _W = ((_r - _x) * g_dKoef_mm_to_pix + 0.5) >> 0;
            var _H = ((_b - _y) * g_dKoef_mm_to_pix + 0.5) >> 0;

            this.HtmlElement.width 	= _W << 1;
            this.HtmlElement.height = _H << 1;
        }
        else
        {
            this.HtmlElement.width 	= ((_r - _x) * g_dKoef_mm_to_pix + 0.5) >> 0;
            this.HtmlElement.height = ((_b - _y) * g_dKoef_mm_to_pix + 0.5) >> 0;
        }
	}
}

function CControlContainer()
{
    this.Bounds         = new CBounds();
    this.Anchor         = g_anchor_left | g_anchor_top;

    this.Name           = null;
    this.Parent         = null;
    this.TabIndex       = null;

    this.HtmlElement    = null;

    this.AbsolutePosition = new CBounds();
	
    this.Controls       = [];

    this.AddControl = function(ctrl)
    {
        ctrl.Parent = this;
        this.Controls[this.Controls.length] = ctrl;
    }
	
	this.Resize = function(_width,_height,api)
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
                    this.Controls[i].Resize(_width,_height,api);
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

        if (g_anchor_left == hor_anchor)
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
        else if (g_anchor_right == hor_anchor)
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
        else if ((g_anchor_left | g_anchor_right) == hor_anchor)
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

        if (g_anchor_top == ver_anchor)
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
        else if (g_anchor_bottom == ver_anchor)
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
        else if ((g_anchor_top | g_anchor_bottom) == ver_anchor)
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

        if (_r < _x)
            _r = _x;
        if (_b < _y)
            _b = _y;

        this.AbsolutePosition.L = _x;
        this.AbsolutePosition.T = _y;
        this.AbsolutePosition.R = _r;
        this.AbsolutePosition.B = _b;

        this.HtmlElement.style.left 	= ((_x * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.top 		= ((_y * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.width 	= (((_r - _x) * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";
        this.HtmlElement.style.height 	= (((_b - _y) * g_dKoef_mm_to_pix + 0.5) >> 0) + "px";

		var lCount = this.Controls.length;
		for (var i = 0; i < lCount; i++)
		{
			this.Controls[i].Resize(_r - _x,_b - _y, api);
		}
	}
}

function CreateControlContainer(name)
{
    var ctrl = new CControlContainer();
    ctrl.Name = name;
    ctrl.HtmlElement = document.getElementById(name);
    return ctrl;
}
function CreateControl(name)
{
    var ctrl = new CControl();
    ctrl.Name = name;
    ctrl.HtmlElement = document.getElementById(name);
    return ctrl;
}