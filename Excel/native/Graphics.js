"use strict";

var g_fontManager2 = null;

function CClipManager()
{
    this.clipRects = [];
    this.curRect = new _rect();
    this.BaseObject = null;

    this.AddRect = function(x, y, w, h)
    {
        var _count = this.clipRects.length;
        if (0 == _count)
        {
            this.curRect.x = x;
            this.curRect.y = y;
            this.curRect.w = w;
            this.curRect.h = h;

            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;
            this.clipRects[_count] = _r;

            this.BaseObject.SetClip(this.curRect);
        }
        else
        {
            this.BaseObject.RemoveClip();
            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;

            this.clipRects[_count] = _r;
            this.curRect = this.IntersectRect(this.curRect, _r);
            this.BaseObject.SetClip(this.curRect);
        }
    }
    this.RemoveRect = function()
    {
        var _count = this.clipRects.length;
        if (0 != _count)
        {
            this.clipRects.splice(_count - 1, 1);
            --_count;

            this.BaseObject.RemoveClip();

            if (0 != _count)
            {
                this.curRect.x = this.clipRects[0].x;
                this.curRect.y = this.clipRects[0].y;
                this.curRect.w = this.clipRects[0].w;
                this.curRect.h = this.clipRects[0].h;

                for (var i = 1; i < _count; i++)
                    this.curRect = this.IntersectRect(this.curRect, this.clipRects[i]);

                this.BaseObject.SetClip(this.curRect);
            }
        }
    }

    this.IntersectRect = function(r1, r2)
    {
        var res = new _rect();
        res.x = Math.max(r1.x, r2.x);
        res.y = Math.max(r1.y, r2.y);
        res.w = Math.min(r1.x + r1.w, r2.x + r2.w) - res.x;
        res.h = Math.min(r1.y + r1.h, r2.y + r2.h) - res.y;

        if (0 > res.w)
            res.w = 0;
        if (0 > res.h)
            res.h = 0;

        return res;
    }
}

function CPen()
{
    this.Color      = { R : 255, G : 255, B : 255, A : 255 };
    this.Style      = 0;
    this.LineCap    = 0;
    this.LineJoin   = 0;

    this.LineWidth  = 1;
}
function CBrush()
{
    this.Color1     = { R : 255, G : 255, B : 255, A : 255 };
    this.Color2     = { R : 255, G : 255, B : 255, A : 255 };
    this.Type       = 0;
}

var MATRIX_ORDER_PREPEND    = 0;
var MATRIX_ORDER_APPEND     = 1;

var bIsChrome   = AscBrowser.isChrome;
var bIsSafari   = AscBrowser.isSafari;
var bIsIE       = AscBrowser.isIE;
var bIsAndroid  = AscBrowser.isAndroid;

function deg2rad(deg){
    return deg * Math.PI / 180.0;
}
function rad2deg(rad){
    return rad * 180.0 / Math.PI;
}

function CMatrix()
{
    this.sx     = 1.0;
    this.shx    = 0.0;
    this.shy    = 0.0;
    this.sy     = 1.0;
    this.tx     = 0.0;
    this.ty     = 0.0;
}

CMatrix.prototype =
{
    Reset : function(){
        this.sx     = 1.0;
        this.shx    = 0.0;
        this.shy    = 0.0;
        this.sy     = 1.0;
        this.tx     = 0.0;
        this.ty     = 0.0;
    },
    // ���������
    Multiply : function(matrix,order){
        if (MATRIX_ORDER_PREPEND == order)
        {
            var m = new CMatrix();
            m.sx     = matrix.sx;
            m.shx    = matrix.shx;
            m.shy    = matrix.shy;
            m.sy     = matrix.sy;
            m.tx     = matrix.tx;
            m.ty     = matrix.ty;
            m.Multiply(this, MATRIX_ORDER_APPEND);
            this.sx     = m.sx;
            this.shx    = m.shx;
            this.shy    = m.shy;
            this.sy     = m.sy;
            this.tx     = m.tx;
            this.ty     = m.ty;
        }
        else
        {
            var t0 = this.sx  * matrix.sx + this.shy * matrix.shx;
            var t2 = this.shx * matrix.sx + this.sy  * matrix.shx;
            var t4 = this.tx  * matrix.sx + this.ty  * matrix.shx + matrix.tx;
            this.shy = this.sx * matrix.shy + this.shy * matrix.sy;
            this.sy  = this.shx * matrix.shy + this.sy * matrix.sy;
            this.ty  = this.tx  * matrix.shy + this.ty * matrix.sy + matrix.ty;
            this.sx  = t0;
            this.shx = t2;
            this.tx  = t4;
        }
        return this;
    },
    // � ������ ������� ������ ���������� (��� �������� �����������)
    Translate : function(x,y,order){
        var m = new CMatrix();
        m.tx  = x;
        m.ty  = y;
        this.Multiply(m,order);
    },
    Scale : function(x,y,order){
        var m = new CMatrix();
        m.sx  = x;
        m.sy  = y;
        this.Multiply(m,order);
    },
    Rotate : function(a,order){
        var m = new CMatrix();
        var rad = deg2rad(a);
        m.sx  = Math.cos(rad);
        m.shx = Math.sin(rad);
        m.shy = -Math.sin(rad);
        m.sy  = Math.cos(rad);
        this.Multiply(m,order);
    },
    RotateAt : function(a,x,y,order){
        this.Translate(-x,-y,order);
        this.Rotate(a,order);
        this.Translate(x,y,order);
    },
    // determinant
    Determinant : function(){
        return this.sx * this.sy - this.shy * this.shx;
    },
    // invert
    Invert : function(){
        var det = this.Determinant();
        if (0.0001 > Math.abs(det))
            return;
        var d = 1 / det;

        var t0 = this.sy * d;
        this.sy =  this.sx * d;
        this.shy = -this.shy * d;
        this.shx = -this.shx * d;

        var t4 = -this.tx * t0  - this.ty * this.shx;
        this.ty = -this.tx * this.shy - this.ty * this.sy;

        this.sx = t0;
        this.tx = t4;
        return this;
    },
    // transform point
    TransformPointX : function(x,y){
        return x * this.sx  + y * this.shx + this.tx;
    },
    TransformPointY : function(x,y){
        return x * this.shy + y * this.sy  + this.ty;
    },
    // calculate rotate angle
    GetRotation : function(){
        var x1 = 0.0;
        var y1 = 0.0;
        var x2 = 1.0;
        var y2 = 0.0;
        this.TransformPoint(x1, y1);
        this.TransformPoint(x2, y2);
        var a = Math.atan2(y2-y1,x2-x1);
        return rad2deg(a);
    },
    // ������� ���������
    CreateDublicate : function(){
        var m = new CMatrix();
        m.sx     = this.sx;
        m.shx    = this.shx;
        m.shy    = this.shy;
        m.sy     = this.sy;
        m.tx     = this.tx;
        m.ty     = this.ty;
        return m;
    },

    IsIdentity : function()
    {
        if (this.sx == 1.0 &&
            this.shx == 0.0 &&
            this.shy == 0.0 &&
            this.sy == 1.0 &&
            this.tx == 0.0 &&
            this.ty == 0.0)
        {
            return true;
        }
        return false;
    },
    IsIdentity2 : function()
    {
        if (this.sx == 1.0 &&
            this.shx == 0.0 &&
            this.shy == 0.0 &&
            this.sy == 1.0)
        {
            return true;
        }
        return false;
    }
};

function CMatrixL()
{
    this.sx     = 1.0;
    this.shx    = 0.0;
    this.shy    = 0.0;
    this.sy     = 1.0;
    this.tx     = 0.0;
    this.ty     = 0.0;
}

CMatrixL.prototype =
{
    CreateDublicate : function()
    {
        var m = new CMatrixL();
        m.sx     = this.sx;
        m.shx    = this.shx;
        m.shy    = this.shy;
        m.sy     = this.sy;
        m.tx     = this.tx;
        m.ty     = this.ty;
        return m;
    },
    Reset : function()
    {
        this.sx     = 1.0;
        this.shx    = 0.0;
        this.shy    = 0.0;
        this.sy     = 1.0;
        this.tx     = 0.0;
        this.ty     = 0.0;
    },
    TransformPointX : function(x,y)
    {
        return x * this.sx  + y * this.shx + this.tx;
    },
    TransformPointY : function(x,y)
    {
        return x * this.shy + y * this.sy  + this.ty;
    }
};

function CGlobalMatrixTransformer()
{
    this.TranslateAppend = function(m, _tx, _ty)
    {
        m.tx += _tx;
        m.ty += _ty;
    }
    this.ScaleAppend = function(m, _sx, _sy)
    {
        m.sx     *= _sx;
        m.shx    *= _sx;
        m.shy    *= _sy;
        m.sy     *= _sy;
        m.tx     *= _sx;
        m.ty     *= _sy;
    }
    this.RotateRadAppend = function(m, _rad)
    {
        var _sx  = Math.cos(_rad);
        var _shx = Math.sin(_rad);
        var _shy = -Math.sin(_rad);
        var _sy  = Math.cos(_rad);

        var t0 = m.sx * _sx + m.shy * _shx;
        var t2 = m.shx * _sx + m.sy * _shx;
        var t4 = m.tx * _sx + m.ty * _shx;
        m.shy = m.sx * _shy + m.shy * _sy;
        m.sy  = m.shx * _shy + m.sy * _sy;
        m.ty  = m.tx * _shy + m.ty * _sy;
        m.sx  = t0;
        m.shx = t2;
        m.tx  = t4;
    }

    this.MultiplyAppend = function(m1, m2)
    {
        var t0 = m1.sx  * m2.sx + m1.shy * m2.shx;
        var t2 = m1.shx * m2.sx + m1.sy  * m2.shx;
        var t4 = m1.tx  * m2.sx + m1.ty  * m2.shx + m2.tx;
        m1.shy = m1.sx * m2.shy + m1.shy * m2.sy;
        m1.sy  = m1.shx * m2.shy + m1.sy * m2.sy;
        m1.ty  = m1.tx  * m2.shy + m1.ty * m2.sy + m2.ty;
        m1.sx  = t0;
        m1.shx = t2;
        m1.tx  = t4;
    }

    this.Invert = function(m)
    {
        var newM = m.CreateDublicate();
        var det = newM.sx * newM.sy - newM.shy * newM.shx;
        if (0.0001 > Math.abs(det))
            return newM;

        var d = 1 / det;

        var t0 = newM.sy * d;
        newM.sy =  newM.sx * d;
        newM.shy = -newM.shy * d;
        newM.shx = -newM.shx * d;

        var t4 = -newM.tx * t0  - newM.ty * newM.shx;
        newM.ty = -newM.tx * newM.shy - newM.ty * newM.sy;

        newM.sx = t0;
        newM.tx = t4;
        return newM;
    }

    this.MultiplyAppendInvert = function(m1, m2)
    {
        var m = this.Invert(m2);
        this.MultiplyAppend(m1, m);
    }

    this.MultiplyPrepend = function(m1, m2)
    {
        var m = new CMatrixL();
        m.sx     = m2.sx;
        m.shx    = m2.shx;
        m.shy    = m2.shy;
        m.sy     = m2.sy;
        m.tx     = m2.tx;
        m.ty     = m2.ty;
        this.MultiplyAppend(m, m1);
        m1.sx     = m.sx;
        m1.shx    = m.shx;
        m1.shy    = m.shy;
        m1.sy     = m.sy;
        m1.tx     = m.tx;
        m1.ty     = m.ty;
    }

    this.CreateDublicateM = function(matrix)
    {
        var m = new CMatrixL();
        m.sx     = matrix.sx;
        m.shx    = matrix.shx;
        m.shy    = matrix.shy;
        m.sy     = matrix.sy;
        m.tx     = matrix.tx;
        m.ty     = matrix.ty;
    }

    this.IsIdentity = function(m)
    {
        if (m.sx == 1.0 &&
            m.shx == 0.0 &&
            m.shy == 0.0 &&
            m.sy == 1.0 &&
            m.tx == 0.0 &&
            m.ty == 0.0)
        {
            return true;
        }
        return false;
    }
    this.IsIdentity2 = function(m)
    {
        if (m.sx == 1.0 &&
            m.shx == 0.0 &&
            m.shy == 0.0 &&
            m.sy == 1.0)
        {
            return true;
        }
        return false;
    }
}

var global_MatrixTransformer = new CGlobalMatrixTransformer();

function CGraphics()
{
    this.m_oContext     = null;
    this.m_dWidthMM     = 0;
    this.m_dHeightMM    = 0;
    this.m_lWidthPix    = 0;
    this.m_lHeightPix   = 0;
    this.m_dDpiX        = 96.0;
    this.m_dDpiY        = 96.0;
    this.m_bIsBreak 	= false;

    this.textBB_l       = 10000;
    this.textBB_t       = 10000;
    this.textBB_r       = -10000;
    this.textBB_b       = -10000;

    this.m_oPen     = new CPen();
    this.m_oBrush   = new CBrush();
    this.m_oAutoShapesTrack = null;

    this.m_oFontManager = null;
    this.m_bIsFillTextCanvasColor = 0;

    this.m_oCoordTransform  = new CMatrixL();
    this.m_oBaseTransform   = new CMatrixL();
    this.m_oTransform       = new CMatrixL();
    this.m_oFullTransform   = new CMatrixL();
    this.m_oInvertFullTransform = new CMatrixL();

    this.ArrayPoints = null;

    this.m_oCurFont =
    {
        Name        : "",
        FontSize    : 10,
        Bold        : false,
        Italic      : false
    };

    // RFonts
    this.m_oTextPr      = null;
    this.m_oGrFonts     = new CGrRFonts();
    this.m_oLastFont    = new CFontSetup();

    this.LastFontOriginInfo = { Name : "", Replace : null };

    this.m_bIntegerGrid = true;

    this.ClipManager = new CClipManager();
    this.ClipManager.BaseObject = this;

    this.TextureFillTransformScaleX = 1;
    this.TextureFillTransformScaleY = 1;
    this.IsThumbnail = false;

    this.GrState = new CGrState();
    this.GrState.Parent = this;

    this.globalAlpha = 1;

    this.TextClipRect = null;
    this.IsClipContext = false;

    this.ClearMode = false;

    this.IsUseFonts2        = false;
    this.m_oFontManager2    = null;
    this.m_oLastFont2       = null;

    this.ClearMode          = false;
    this.IsRetina           = false;
}

CGraphics.prototype =
{
    init : function(context,width_px,height_px,width_mm,height_mm)
    {
        this.Native = window["native"];

        this.m_oContext     = context;
        this.m_lHeightPix   = height_px;
        this.m_lWidthPix    = width_px;
        this.m_dWidthMM     = width_mm;
        this.m_dHeightMM    = height_mm;
        this.m_dDpiX        = 25.4 * this.m_lWidthPix / this.m_dWidthMM;
        this.m_dDpiY        = 25.4 * this.m_lHeightPix / this.m_dHeightMM;

        this.m_oCoordTransform.sx   = this.m_dDpiX / 25.4;
        this.m_oCoordTransform.sy   = this.m_dDpiY / 25.4;

        this.TextureFillTransformScaleX = 1 / this.m_oCoordTransform.sx;
        this.TextureFillTransformScaleY = 1 / this.m_oCoordTransform.sy;

        /*
         if (this.IsThumbnail)
         {
         this.TextureFillTransformScaleX *= (width_px / (width_mm * g_dKoef_mm_to_pix));
         this.TextureFillTransformScaleY *= (height_px / (height_mm * g_dKoef_mm_to_pix))
         }
         */

        /*
         if (true == this.m_oContext.mozImageSmoothingEnabled)
         this.m_oContext.mozImageSmoothingEnabled = false;
         */

        this.m_oLastFont.Clear();
        this.Native["PD_Save"]();

        // this.m_oContext.save();
    },
    EndDraw : function()
    {
    },

    put_GlobalAlpha : function(enable, alpha)
    {
        if (false === enable)
        {
            this.globalAlpha = 1;
        }
        else
        {
            this.globalAlpha = alpha;
        }

        this.Native["PD_put_GlobalAlpha"](enable, alpha);
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        this.Native["PD_p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.m_oPen.LineWidth = w / 1000.0;

        if (!this.m_bIntegerGrid)
        {
            if (0 != this.m_oPen.LineWidth)
            {
                this.Native["PD_p_width"](this.m_oPen.LineWidth);
            }
            else
            {
                var _x1 = this.m_oFullTransform.TransformPointX(0, 0);
                var _y1 = this.m_oFullTransform.TransformPointY(0, 0);
                var _x2 = this.m_oFullTransform.TransformPointX(1, 1);
                var _y2 = this.m_oFullTransform.TransformPointY(1, 1);

                var _koef = Math.sqrt(((_x2 - _x1)*(_x2 - _x1) + (_y2 - _y1)*(_y2 - _y1)) / 2);
                this.Native["PD_p_width"](1 / _koef);
            }
        }
        else
        {
            if (0 != this.m_oPen.LineWidth)
            {
                var _m = this.m_oFullTransform;
                var x = _m.sx + _m.shx;
                var y = _m.sy + _m.shy;

                var koef = Math.sqrt((x * x + y * y) / 2);
                this.Native["PD_p_width"](this.m_oPen.LineWidth * koef);
            }
            else
            {
                this.Native["PD_p_width"](1);
            }
        }
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        var _c = this.m_oBrush.Color1;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;

        this.Native["PD_b_color1"](r,g,b,a);

        this.m_bIsFillTextCanvasColor = 0;
    },
    b_color2 : function(r,g,b,a)
    {
        var _c = this.m_oBrush.Color2;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;

        this.Native["PD_b_color2"](r,g,b,a);
    },

    transform : function(sx,shy,shx,sy,tx,ty)
    {
        var _t = this.m_oTransform;
        _t.sx    = sx;
        _t.shx   = shx;
        _t.shy   = shy;
        _t.sy    = sy;
        _t.tx    = tx;
        _t.ty    = ty;

        this.CalculateFullTransform();
        if (false === this.m_bIntegerGrid)
        {
            var _ft = this.m_oFullTransform;
            this.Native["PD_transform"](_ft.sx,_ft.shy,_ft.shx,_ft.sy,_ft.tx,_ft.ty);
        }

        //if (null != this.m_oFontManager)
        //{
        //    this.m_oFontManager.SetTextMatrix(_t.sx,_t.shy,_t.shx,_t.sy,_t.tx,_t.ty);
        //}
    },
    CalculateFullTransform : function(isInvertNeed)
    {
        var _ft = this.m_oFullTransform;
        var _t = this.m_oTransform;
        _ft.sx = _t.sx;
        _ft.shx = _t.shx;
        _ft.shy = _t.shy;
        _ft.sy = _t.sy;
        _ft.tx = _t.tx;
        _ft.ty = _t.ty;
        global_MatrixTransformer.MultiplyAppend(_ft, this.m_oCoordTransform);

        var _it = this.m_oInvertFullTransform;
        _it.sx = _ft.sx;
        _it.shx = _ft.shx;
        _it.shy = _ft.shy;
        _it.sy = _ft.sy;
        _it.tx = _ft.tx;
        _it.ty = _ft.ty;

        if (false !== isInvertNeed)
        {
            global_MatrixTransformer.MultiplyAppendInvert(_it, _t);
        }
    },
    // path commands
    _s : function()
    {
        this.Native["PD_PathStart"]();
    },
    _e : function()
    {
        this.Native["PD_PathEnd"]();
    },
    _z : function()
    {
        this.Native["PD_PathClose"]();
    },
    _m : function(x,y)
    {
        if (false === this.m_bIntegerGrid)
        {
            this.Native["PD_PathMoveTo"](x,y);

            if (this.ArrayPoints != null)
                this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
        }
        else
        {
            var _x = (this.m_oFullTransform.TransformPointX(x,y)) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x,y)) >> 0;
            this.Native["PD_PathMoveTo"](_x + 0.5,_y + 0.5);
        }
    },
    _l : function(x,y)
    {
        if (false === this.m_bIntegerGrid)
        {
            this.Native["PD_PathLineTo"](x,y);

            if (this.ArrayPoints != null)
                this.ArrayPoints[this.ArrayPoints.length] = {x: x, y: y};
        }
        else
        {
            var _x = (this.m_oFullTransform.TransformPointX(x,y)) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x,y)) >> 0;
            this.Native["PD_PathLineTo"](_x + 0.5,_y + 0.5);
        }

    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        if (false === this.m_bIntegerGrid)
        {
            this.Native["PD_PathCurveTo"](x1,y1,x2,y2,x3,y3);

            if (this.ArrayPoints != null)
            {
                this.ArrayPoints[this.ArrayPoints.length] = {x: x1, y: y1};
                this.ArrayPoints[this.ArrayPoints.length] = {x: x2, y: y2};
                this.ArrayPoints[this.ArrayPoints.length] = {x: x3, y: y3};
            }
        }
        else
        {
            var _x1 = (this.m_oFullTransform.TransformPointX(x1,y1)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x1,y1)) >> 0;

            var _x2 = (this.m_oFullTransform.TransformPointX(x2,y2)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x2,y2)) >> 0;

            var _x3 = (this.m_oFullTransform.TransformPointX(x3,y3)) >> 0;
            var _y3 = (this.m_oFullTransform.TransformPointY(x3,y3)) >> 0;

            this.Native["PD_PathCurveTo"](_x1 + 0.5,_y1 + 0.5,_x2 + 0.5,_y2 + 0.5,_x3 + 0.5,_y3 + 0.5);
        }
    },
    _c2 : function(x1,y1,x2,y2)
    {
        if (false === this.m_bIntegerGrid)
        {
            this.Native["PD_PathCurveTo2"](x1,y1,x2,y2);

            if (this.ArrayPoints != null)
            {
                this.ArrayPoints[this.ArrayPoints.length] = {x: x1, y: y1};
                this.ArrayPoints[this.ArrayPoints.length] = {x: x2, y: y2};
            }
        }
        else
        {
            var _x1 = (this.m_oFullTransform.TransformPointX(x1,y1)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x1,y1)) >> 0;

            var _x2 = (this.m_oFullTransform.TransformPointX(x2,y2)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x2,y2)) >> 0;

            this.Native["PD_PathCurveTo2"](_x1 + 0.5,_y1 + 0.5,_x2 + 0.5,_y2 + 0.5);
        }
    },
    ds : function()
    {
        this.Native["PD_Stroke"]();
    },
    df : function()
    {
        this.Native["PD_Fill"]();
    },

    // canvas state
    save : function()
    {
        this.Native["PD_Save"]();
    },
    restore : function()
    {
        this.Native["PD_Restore"]();
    },
    clip : function()
    {
        this.Native["PD_clip"]();
    },

    reset : function()
    {
        this.m_oTransform.Reset();
        this.CalculateFullTransform(false);

        if (!this.m_bIntegerGrid)
            this.Native["PD_transform"](this.m_oCoordTransform.sx,0,0,this.m_oCoordTransform.sy,0, 0);
    },

    transform3 : function(m, isNeedInvert)
    {
        var _t = this.m_oTransform;
        _t.sx = m.sx;
        _t.shx = m.shx;
        _t.shy = m.shy;
        _t.sy = m.sy;
        _t.tx = m.tx;
        _t.ty = m.ty;
        this.CalculateFullTransform(isNeedInvert);

        if (!this.m_bIntegerGrid)
        {
            var _ft = this.m_oFullTransform;
            this.Native["PD_transform"](_ft.sx,_ft.shy,_ft.shx,_ft.sy,_ft.tx,_ft.ty);
        }
        else
        {
            this.SetIntegerGrid(false);
        }

        // теперь трансформ выставляется ТОЛЬКО при загрузке шрифта. Здесь другого быть и не может
        /*
         if (null != this.m_oFontManager && false !== isNeedInvert)
         {
         this.m_oFontManager.SetTextMatrix(this.m_oTransform.sx,this.m_oTransform.shy,this.m_oTransform.shx,
         this.m_oTransform.sy,this.m_oTransform.tx,this.m_oTransform.ty);
         }
         */
    },

    CheckUseFonts2 : function(_transform)
    {
//        if (!global_MatrixTransformer.IsIdentity2(_transform))
//        {
//            if (window.g_fontManager2 == null)
//            {
//                window.g_fontManager2 = new CFontManager();
//                window.g_fontManager2.Initialize(true);
//            }
//
//            this.m_oFontManager2 = window.g_fontManager2;
//
//            if (null == this.m_oLastFont2)
//                this.m_oLastFont2 = new CFontSetup();
//
//            this.IsUseFonts2 = true;
//        }
    },

    UncheckUseFonts2 : function()
    {
        this.IsUseFonts2 = false;
    },

    FreeFont : function()
    {
        this.Native["PD_FreeFont"]();

        //// это чтобы не сбросился кэш при отрисовке следующего шейпа
        this.m_oFontManager.m_pFont = null;
    },

    // images
    drawImage2 : function(img,x,y,w,h,alpha,srcRect)
    {
        console.log('NOT IMPLEMENTED : drawImage2');

        var isA = (undefined !== alpha && null != alpha && 255 != alpha);
        var _oldGA = 0;
        if (isA)
        {
            // _oldGA = this.m_oContext.globalAlpha;
            // this.m_oContext.globalAlpha = alpha / 255;
        }

        if (false === this.m_bIntegerGrid)
        {
            if (!srcRect)
            {
                // тут нужно проверить, можно ли нарисовать точно. т.е. может картинка ровно такая, какая нужна.
                if (!global_MatrixTransformer.IsIdentity2(this.m_oTransform))
                {
                    //    this.m_oContext.drawImage(img,x,y,w,h);
                }
                else
                {
                    var xx = this.m_oFullTransform.TransformPointX(x, y);
                    var yy = this.m_oFullTransform.TransformPointY(x, y);
                    var rr = this.m_oFullTransform.TransformPointX(x + w, y + h);
                    var bb = this.m_oFullTransform.TransformPointY(x + w, y + h);
                    var ww = rr - xx;
                    var hh = bb - yy;

                    if (Math.abs(img.width - ww) < 2 && Math.abs(img.height - hh) < 2)
                    {
                        // рисуем точно
                        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
                        //     this.m_oContext.drawImage(img, xx >> 0, yy >> 0);

                        //     var _ft = this.m_oFullTransform;
                        //     this.m_oContext.setTransform(_ft.sx,_ft.shy,_ft.shx,_ft.sy,_ft.tx,_ft.ty);

                    }
                    else
                    {
                        //     this.m_oContext.drawImage(img,x,y,w,h);
                    }
                }
            }
            else
            {
                var _w = img.width;
                var _h = img.height;
                if (_w > 0 && _h > 0)
                {
                    var __w = w;
                    var __h = h;
                    var _delW = Math.max(0, -srcRect.l) + Math.max(0, srcRect.r - 100) + 100;
                    var _delH = Math.max(0, -srcRect.t) + Math.max(0, srcRect.b - 100) + 100;

                    var _sx = 0;
                    if (srcRect.l > 0 && srcRect.l < 100)
                        _sx = Math.min((_w * srcRect.l / 100) >> 0, _w - 1);
                    else if (srcRect.l < 0)
                    {
                        var _off = ((-srcRect.l / _delW) * __w);
                        x += _off;
                        w -= _off;
                    }
                    var _sy = 0;
                    if (srcRect.t > 0 && srcRect.t < 100)
                        _sy = Math.min((_h * srcRect.t / 100) >> 0, _h - 1);
                    else if (srcRect.t < 0)
                    {
                        var _off = ((-srcRect.t / _delH) * __h);
                        y += _off;
                        h -= _off;
                    }
                    var _sr = _w;
                    if (srcRect.r > 0 && srcRect.r < 100)
                        _sr = Math.max(Math.min((_w * srcRect.r / 100) >> 0, _w - 1), _sx);
                    else if (srcRect.r > 100)
                    {
                        var _off = ((srcRect.r - 100) / _delW) * __w;
                        w -= _off;
                    }
                    var _sb = _h;
                    if (srcRect.b > 0 && srcRect.b < 100)
                        _sb = Math.max(Math.min((_h * srcRect.b / 100) >> 0, _h - 1), _sy);
                    else if (srcRect.b > 100)
                    {
                        var _off = ((srcRect.b - 100) / _delH) * __h;
                        h -= _off;
                    }

                    //     if ((_sr-_sx) > 0 && (_sb-_sy) > 0 && w > 0 && h > 0)
                    //         this.m_oContext.drawImage(img,_sx,_sy,_sr-_sx,_sb-_sy,x,y,w,h);
                }
                else
                {
                    //     this.m_oContext.drawImage(img,x,y,w,h);
                }
            }
        }
        else
        {
            var _x1 = (this.m_oFullTransform.TransformPointX(x,y)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x,y)) >> 0;
            var _x2 = (this.m_oFullTransform.TransformPointX(x+w,y+h)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x+w,y+h)) >> 0;

            x = _x1;
            y = _y1;
            w = _x2 - _x1;
            h = _y2 - _y1;

            if (!srcRect)
            {
                // тут нужно проверить, можно ли нарисовать точно. т.е. может картинка ровно такая, какая нужна.
                if (!global_MatrixTransformer.IsIdentity2(this.m_oTransform))
                {
                    //    this.m_oContext.drawImage(img,_x1,_y1,w,h);
                }
                else
                {
                    if (Math.abs(img.width - w) < 2 && Math.abs(img.height - h) < 2)
                    {
                        // рисуем точно
                        //    this.m_oContext.drawImage(img, x, y);
                    }
                    else
                    {
                        //    this.m_oContext.drawImage(img,_x1,_y1,w,h);
                    }
                }
            }
            else
            {
                var _w = img.width;
                var _h = img.height;
                if (_w > 0 && _h > 0)
                {
                    var __w = w;
                    var __h = h;
                    var _delW = Math.max(0, -srcRect.l) + Math.max(0, srcRect.r - 100) + 100;
                    var _delH = Math.max(0, -srcRect.t) + Math.max(0, srcRect.b - 100) + 100;

                    var _sx = 0;
                    if (srcRect.l > 0 && srcRect.l < 100)
                        _sx = Math.min((_w * srcRect.l / 100) >> 0, _w - 1);
                    else if (srcRect.l < 0)
                    {
                        var _off = ((-srcRect.l / _delW) * __w);
                        x += _off;
                        w -= _off;
                    }
                    var _sy = 0;
                    if (srcRect.t > 0 && srcRect.t < 100)
                        _sy = Math.min((_h * srcRect.t / 100) >> 0, _h - 1);
                    else if (srcRect.t < 0)
                    {
                        var _off = ((-srcRect.t / _delH) * __h);
                        y += _off;
                        h -= _off;
                    }
                    var _sr = _w;
                    if (srcRect.r > 0 && srcRect.r < 100)
                        _sr = Math.max(Math.min((_w * srcRect.r / 100) >> 0, _w - 1), _sx);
                    else if (srcRect.r > 100)
                    {
                        var _off = ((srcRect.r - 100) / _delW) * __w;
                        w -= _off;
                    }
                    var _sb = _h;
                    if (srcRect.b > 0 && srcRect.b < 100)
                        _sb = Math.max(Math.min((_h * srcRect.b / 100) >> 0, _h - 1), _sy);
                    else if (srcRect.b > 100)
                    {
                        var _off = ((srcRect.b - 100) / _delH) * __h;
                        h -= _off;
                    }

                    //   if ((_sr-_sx) > 0 && (_sb-_sy) > 0 && w > 0 && h > 0)
                    //       this.m_oContext.drawImage(img,_sx,_sy,_sr-_sx,_sb-_sy,x,y,w,h);
                }
                else
                {
                    //     this.m_oContext.drawImage(img,x,y,w,h);
                }
            }
        }

        if (isA)
        {
            // this.m_oContext.globalAlpha = _oldGA;
        }
    },
    drawImage : function(img,x,y,w,h,alpha,srcRect,nativeImage)
    {
        if (!srcRect)
            return this.Native["PD_drawImage"](img,x,y,w,h,alpha);

        return this.Native["PD_drawImage"](img,x,y,w,h,alpha,srcRect.l,srcRect.t,srcRect.r,srcRect.b);

        //if (nativeImage)
        //{
        //    this.drawImage2(nativeImage,x,y,w,h,alpha,srcRect);
        //    return;
        //}
        //
        //var editor = window["Asc"]["editor"];
        //var _img = editor.ImageLoader.map_image_index[img];
        //if (_img != undefined && _img.Status == ImageLoadStatus.Loading)
        //{
        //    // TODO: IMAGE_LOADING
        //}
        //else if (_img != undefined && _img.Image != null)
        //{
        //    this.drawImage2(_img.Image,x,y,w,h,alpha,srcRect);
        //}
        //else
        //{
        //    var _x = x;
        //    var _y = y;
        //    var _r = x+w;
        //    var _b = y+h;
        //    if (this.m_bIntegerGrid)
        //    {
        //        _x = this.m_oFullTransform.TransformPointX(x,y);
        //        _y = this.m_oFullTransform.TransformPointY(x,y);
        //        _r = this.m_oFullTransform.TransformPointX(x+w,y+h);
        //        _b = this.m_oFullTransform.TransformPointY(x+w,y+h);
        //    }
        //
        //    var ctx = this.m_oContext;
        //    var old_p = ctx.lineWidth;
        //
        //    ctx.beginPath();
        //    ctx.moveTo(_x,_y);
        //    ctx.lineTo(_r,_b);
        //    ctx.moveTo(_r,_y);
        //    ctx.lineTo(_x,_b);
        //    ctx.strokeStyle = "#FF0000";
        //    ctx.stroke();
        //
        //    ctx.beginPath();
        //    ctx.moveTo(_x,_y);
        //    ctx.lineTo(_r,_y);
        //    ctx.lineTo(_r,_b);
        //    ctx.lineTo(_x,_b);
        //    ctx.closePath();
        //
        //    ctx.lineWidth = 1;
        //    ctx.strokeStyle = "#000000";
        //    ctx.stroke();
        //    ctx.beginPath();
        //
        //    ctx.lineWidth = old_p;
        //    ctx.strokeStyle = "rgba(" + this.m_oPen.Color.R + "," + this.m_oPen.Color.G + "," +
        //        this.m_oPen.Color.B + "," + (this.m_oPen.Color.A / 255) + ")";
        //}
    },

    // text
    GetFont : function()
    {
        return this.m_oCurFont;
    },
    font : function(font_id,font_size,matrix)
    {
        this.Native["PD_font"](font_id, font_size);
    },
    SetFont : function(font)
    {
        if (null == font)
            return;

        this.m_oCurFont.Name        = font.FontFamily.Name;
        this.m_oCurFont.FontSize    = font.FontSize;
        this.m_oCurFont.Bold        = font.Bold;
        this.m_oCurFont.Italic      = font.Italic;

        var bItalic = true === font.Italic;
        var bBold   = true === font.Bold;

        var oFontStyle = FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBoldItalic;

        var _fontinfo = g_fontApplication.GetFontInfo(font.FontFamily.Name, oFontStyle, this.LastFontOriginInfo);
        var _info = GetLoadInfoForMeasurer(_fontinfo, oFontStyle);

        var _last_font = this.IsUseFonts2 ? this.m_oLastFont2 : this.m_oLastFont;

        _last_font.SetUpName = font.FontFamily.Name;
        _last_font.SetUpSize = font.FontSize;
        _last_font.SetUpStyle = oFontStyle;

        var flag = 0;
        if (_info.NeedBold)     flag |= 0x01;
        if (_info.NeedItalic)   flag |= 0x02;
        if (_info.SrcBold)      flag |= 0x04;
        if (_info.SrcItalic)    flag |= 0x08;

        this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);
    },

    SetTextPr : function(textPr, theme)
    {
        this.m_oTextPr = textPr.Copy();
        this.theme = theme;
        var FontScheme = theme.themeElements.fontScheme;
        this.m_oTextPr.RFonts.Ascii    = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.Ascii.Name), Index: -1};
        this.m_oTextPr.RFonts.EastAsia = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.EastAsia.Name), Index: -1};
        this.m_oTextPr.RFonts.HAnsi    = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.HAnsi.Name), Index: -1};
        this.m_oTextPr.RFonts.CS       = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.CS.Name), Index: -1};
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.IsUseFonts2 ? this.m_oLastFont2 : this.m_oLastFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_HAnsi:
            default:
            {
                _lastFont.Name   = _rfonts.HAnsi.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
        }

        if (undefined !== fontSizeKoef)
            _lastFont.Size *= fontSizeKoef;

        var _style = 0;
        if (_lastFont.Italic)
            _style += 2;
        if (_lastFont.Bold)
            _style += 1;

        _lastFont.SetUpName = _lastFont.Name;
        _lastFont.SetUpSize = _lastFont.Size;
        _lastFont.SetUpStyle = _style;

        var _fontinfo = g_fontApplication.GetFontInfo(_lastFont.SetUpName, _lastFont.SetUpStyle, this.LastFontOriginInfo);
        var _info = GetLoadInfoForMeasurer(_fontinfo, _lastFont.SetUpStyle);

        var flag = 0;
        if (_info.NeedBold)     flag |= 0x01;
        if (_info.NeedItalic)   flag |= 0x02;
        if (_info.SrcBold)      flag |= 0x04;
        if (_info.SrcItalic)    flag |= 0x08;

        this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);
    },

    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    FillText : function(x,y,text)
    {
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        this.Native["PD_FillText"](x,y,_code);
    },
    t : function(text,x,y)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["PD_Text"](x,y,_arr);
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        this.Native["PD_FillText2"](x,y,_code,cropX,cropW);
    },
    t2 : function(text,x,y,cropX,cropW)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["PD_Text2"](x,y,_arr,cropX,cropW);
    },
    FillTextCode : function(x,y,lUnicode)
    {
        if (null != this.LastFontOriginInfo.Replace)
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

        this.Native["PD_FillText"](x,y,lUnicode);
    },

    tg : function(text,x,y)
    {
//        if (this.m_bIsBreak)
//            return;
//
//        var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
//        var _y = this.m_oInvertFullTransform.TransformPointY(x,y);
//
//        var _font_manager = this.IsUseFonts2 ? this.m_oFontManager2 : this.m_oFontManager;
//
//        try
//        {
//            _font_manager.LoadString3C(text,_x,_y);
//        }
//        catch(err)
//        {
//        }
//
//        if (false === this.m_bIntegerGrid)
//        {
//            this.m_oContext.setTransform(1,0,0,1,0,0);
//        }
//        var pGlyph = _font_manager.m_oGlyphString.m_pGlyphsBuffer[0];
//        if (null == pGlyph)
//            return;
//
//        if (null != pGlyph.oBitmap)
//        {
//            var _a = this.m_oBrush.Color1.A;
//            if (255 != _a)
//                this.m_oContext.globalAlpha = _a / 255;
//            this.private_FillGlyph(pGlyph);
//
//            if (255 != _a)
//                this.m_oContext.globalAlpha = 1.0;
//        }
//        if (false === this.m_bIntegerGrid)
//        {
//            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
//                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
//        }
    },
    charspace : function(space)
    {
    },

    // private methods
    private_FillGlyph : function(pGlyph)
    {
        console.log('NOT IMPLEMENTED private_FillGlyph');
    },
    private_FillGlyphC : function(pGlyph,cropX,cropW)
    {
        console.log('NOT IMPLEMENTED private_FillGlyphC');
    },

    private_FillGlyph2 : function(pGlyph)
    {
        console.log('NOT IMPLEMENTED private_FillGlyph2');
    },

    SetIntegerGrid : function(param)
    {
        this.m_bIntegerGrid = param;
        this.Native["PD_SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        return this.m_bIntegerGrid;
    },

    DrawHeaderEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawHeaderEdit"](yPos, lock_type);
    },

    DrawFooterEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawFooterEdit"](yPos, lock_type);
    },

    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        this.Native["PD_DrawLockParagraph"](lock_type, x, y1, y2);
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        this.Native["PD_DrawLockObjectRect"](lock_type, x, y, w, h);
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        this.Native["PD_DrawEmptyTableLine"](x1,y1,x2,y2);
    },

    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine"](align, y, x, r, penW);
    },
    drawHorLine2 : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine2"](align, y, x, r, penW);
    },
    drawVerLine : function(align, x, y, b, penW)
    {
        this.Native["PD_drawVerLine"](align, x, y, b, penW);
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        this.Native["PD_drawHorLineExt"](align, y, x, r, penW, leftMW, rightMW);
    },

    rect : function(x,y,w,h)
    {
        if (this.m_bIntegerGrid)
        {
            var _x = (this.m_oFullTransform.TransformPointX(x,y) + 0.5) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x,y) + 0.5) >> 0;
            var _r = (this.m_oFullTransform.TransformPointX(x+w,y) + 0.5) >> 0;
            var _b = (this.m_oFullTransform.TransformPointY(x,y+h) + 0.5) >> 0;

            this.Native["PD_rect"](_x, _y, _r - _x, _b - _y);
        }
        else
        {
            this.Native["PD_rect"](x,y,w,h);
        }
    },

    TableRect : function(x,y,w,h)
    {
        this.Native["PD_TableRect"](x,y,w,h);

    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        this.Native["PD_AddClipRect"](x,y,w,h);
        ////this.ClipManager.AddRect(x, y, w, h);
        //var __rect = new _rect();
        //__rect.x = x;
        //__rect.y = y;
        //__rect.w = w;
        //__rect.h = h;
        //this.GrState.AddClipRect(__rect);
    },
    RemoveClipRect : function()
    {
        //this.ClipManager.RemoveRect();
    },

    AddSmartRect : function(x, y, w, h, pen_w)
    {
        return this.Native["PD_AddSmartRect"](x, y, w, h, pen_w);
    },

    SetClip : function(r)
    {
        this.Native["PD_SetClip"](r.x, r.y, r.w, r.h);

        //var ctx = this.m_oContext;
        //ctx.save();
        //
        //ctx.beginPath();
        //if (!global_MatrixTransformer.IsIdentity(this.m_oTransform))
        //{
        //    ctx.rect(r.x, r.y, r.w, r.h);
        //}
        //else
        //{
        //    var _x = (this.m_oFullTransform.TransformPointX(r.x,r.y) + 1) >> 0;
        //    var _y = (this.m_oFullTransform.TransformPointY(r.x,r.y) + 1) >> 0;
        //    var _r = (this.m_oFullTransform.TransformPointX(r.x+r.w,r.y) - 1) >> 0;
        //    var _b = (this.m_oFullTransform.TransformPointY(r.x,r.y+r.h) - 1) >> 0;
        //
        //    ctx.rect(_x, _y, _r - _x + 1, _b - _y + 1);
        //}
        //
        //this.clip();
        //ctx.beginPath();
    },

    RemoveClip : function()
    {
        this.Native["PD_RemoveClip"]();

        //this.m_oContext.restore();
        //this.m_oContext.save();
        //
        //if (this.m_oContext.globalAlpha != this.globalAlpha)
        //    this.m_oContext.globalAlpha = this.globalAlpha;
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
        this.Native["PD_drawCollaborativeChanges"](x, y, w, h);
    },

    drawSearchResult : function(x, y, w, h)
    {
        this.Native["PD_drawSearchResult"](x, y, w, h);
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["PD_drawFlowAnchor"](x, y);

    },

    SavePen : function()
    {
        this.Native["PD_SavePen"]();
    },
    RestorePen : function()
    {
        this.Native["PD_RestorePen"]();
    },

    SaveBrush : function()
    {
        this.Native["PD_SaveBrush"]();
    },
    RestoreBrush : function()
    {
        this.Native["PD_RestoreBrush"]();
    },

    SavePenBrush : function()
    {
        this.Native["PD_SavePenBrush"]();
    },
    RestorePenBrush : function()
    {
        this.Native["PD_RestorePenBrush"]();
    },

    SaveGrState : function()
    {
        this.Native["PD_SaveGrState"]();
    },
    RestoreGrState : function()
    {
        this.Native["PD_RestoreGrState"]();
    },

    StartClipPath : function()
    {
        this.Native["PD_StartClipPath"]();
    },

    EndClipPath : function()
    {
        this.Native["PD_EndClipPath"]();

    },

    StartCheckTableDraw : function()
    {
        return this.Native["PD_StartCheckTableDraw"]();
    },

    EndCheckTableDraw : function(bIsRestore)
    {
        return this.Native["PD_EndCheckTableDraw"](bIsRestore);
    },

    SetTextClipRect : function(_l, _t, _r, _b)
    {
        return this.Native["PD_SetTextClipRect"](_l, _t, _r, _b);
    }
};