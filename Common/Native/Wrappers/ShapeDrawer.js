window.IsShapeToImageConverter = false;
function DrawLineEnd(xEnd, yEnd, xPrev, yPrev, type, w, len, drawer, trans)
{
    switch (type)
    {
        case LineEndType.None:
            break;
        case LineEndType.Arrow:
        {
            var _ex = xPrev - xEnd;
            var _ey = yPrev - yEnd;
            var _elen = Math.sqrt(_ex*_ex + _ey*_ey);
            _ex /= _elen;
            _ey /= _elen;

            var _vx = _ey;
            var _vy = -_ex;

            var tmpx = xEnd + len * _ex;
            var tmpy = yEnd + len * _ey;

            var x1 = tmpx + _vx * w/2;
            var y1 = tmpy + _vy * w/2;

            var x3 = tmpx - _vx * w/2;
            var y3 = tmpy - _vy * w/2;

            drawer._s();
            drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer.ds();
            drawer._e();

            break;
        }
        case LineEndType.Diamond:
        {
            var _ex = xPrev - xEnd;
            var _ey = yPrev - yEnd;
            var _elen = Math.sqrt(_ex*_ex + _ey*_ey);
            _ex /= _elen;
            _ey /= _elen;

            var _vx = _ey;
            var _vy = -_ex;

            var tmpx = xEnd + len/2 * _ex;
            var tmpy = yEnd + len/2 * _ey;

            var x1 = xEnd + _vx * w/2;
            var y1 = yEnd + _vy * w/2;

            var x3 = xEnd - _vx * w/2;
            var y3 = yEnd - _vy * w/2;

            var tmpx2 = xEnd - len/2 * _ex;
            var tmpy2 = yEnd - len/2 * _ey;

            drawer._s();
            drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
            drawer._l(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._z();
            drawer.drawStrokeFillStyle();
            drawer._e();

            drawer._s();
            drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
            drawer._l(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._z();
            drawer.ds();
            drawer._e();

            break;
        }
        case LineEndType.Oval:
        {
            var _ex = xPrev - xEnd;
            var _ey = yPrev - yEnd;
            var _elen = Math.sqrt(_ex*_ex + _ey*_ey);
            _ex /= _elen;
            _ey /= _elen;

            var _vx = _ey;
            var _vy = -_ex;

            var tmpx = xEnd + len/2 * _ex;
            var tmpy = yEnd + len/2 * _ey;

            var tmpx2 = xEnd - len/2 * _ex;
            var tmpy2 = yEnd - len/2 * _ey;

            var cx1 = tmpx + _vx * 3*w/4;
            var cy1 = tmpy + _vy * 3*w/4;
            var cx2 = tmpx2 + _vx * 3*w/4;
            var cy2 = tmpy2 + _vy * 3*w/4;

            var cx3 = tmpx - _vx * 3*w/4;
            var cy3 = tmpy - _vy * 3*w/4;
            var cx4 = tmpx2 - _vx * 3*w/4;
            var cy4 = tmpy2 - _vy * 3*w/4;

            drawer._s();
            drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
            drawer._c(trans.TransformPointX(cx1, cy1), trans.TransformPointY(cx1, cy1),
                trans.TransformPointX(cx2, cy2), trans.TransformPointY(cx2, cy2),
                trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));

            drawer._c(trans.TransformPointX(cx4, cy4), trans.TransformPointY(cx4, cy4),
                trans.TransformPointX(cx3, cy3), trans.TransformPointY(cx3, cy3),
                trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));

            drawer.drawStrokeFillStyle();
            drawer._e();

            drawer._s();
            drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
            drawer._c(trans.TransformPointX(cx1, cy1), trans.TransformPointY(cx1, cy1),
                trans.TransformPointX(cx2, cy2), trans.TransformPointY(cx2, cy2),
                trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));

            drawer._c(trans.TransformPointX(cx4, cy4), trans.TransformPointY(cx4, cy4),
                trans.TransformPointX(cx3, cy3), trans.TransformPointY(cx3, cy3),
                trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));

            drawer.ds();
            drawer._e();
            break;
        }
        case LineEndType.Stealth:
        {
            var _ex = xPrev - xEnd;
            var _ey = yPrev - yEnd;
            var _elen = Math.sqrt(_ex*_ex + _ey*_ey);
            _ex /= _elen;
            _ey /= _elen;

            var _vx = _ey;
            var _vy = -_ex;

            var tmpx = xEnd + len * _ex;
            var tmpy = yEnd + len * _ey;

            var x1 = tmpx + _vx * w/2;
            var y1 = tmpy + _vy * w/2;

            var x3 = tmpx - _vx * w/2;
            var y3 = tmpy - _vy * w/2;

            var x4 = xEnd + (len - w/2) * _ex;
            var y4 = yEnd + (len - w/2) * _ey;

            drawer._s();
            drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._l(trans.TransformPointX(x4, y4), trans.TransformPointY(x4, y4));
            drawer._z();
            drawer.drawStrokeFillStyle();
            drawer._e();

            drawer._s();
            drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._l(trans.TransformPointX(x4, y4), trans.TransformPointY(x4, y4));
            drawer._z();
            drawer.ds();
            drawer._e();

            break;
        }
        case LineEndType.Triangle:
        {
            var _ex = xPrev - xEnd;
            var _ey = yPrev - yEnd;
            var _elen = Math.sqrt(_ex*_ex + _ey*_ey);
            _ex /= _elen;
            _ey /= _elen;

            var _vx = _ey;
            var _vy = -_ex;

            var tmpx = xEnd + len * _ex;
            var tmpy = yEnd + len * _ey;

            var x1 = tmpx + _vx * w/2;
            var y1 = tmpy + _vy * w/2;

            var x3 = tmpx - _vx * w/2;
            var y3 = tmpy - _vy * w/2;

            drawer._s();
            drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._z();
            drawer.drawStrokeFillStyle();
            drawer._e();

            drawer._s();
            drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
            drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
            drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
            drawer._z();
            drawer.ds();
            drawer._e();
            break;
        }
    }
}


//рисуем конечную стрелку
function DrawTailEnd(type, length, width, x, y, angle, graphics, array_points)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);
    switch(type)
    {
        case ar_arrow:
        {
            var xb, yb, xc, yc;
            xb=-length;
            yb=-width*0.5;

            xc=xb;
            yc=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics.ds();

            break;
        }
        case ar_diamond:
        {
            var xd, yd;
            xb=-length*0.5;
            yb=-width*0.5;

            xc=-length;
            yc=0;

            xd=xb;
            yd=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();

            break;
        }
        case ar_none:
        {
            break;
        }
        case ar_oval:
        {
            EllipseN(graphics, x, y, length*0.5, width*0.5, angle);
            break;
        }
        case ar_stealth:
        {
            xb=-length;
            yb=-width*0.5;

            xc=-length*0.5;
            yc=0;

            xd=xb;
            yd=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
        case ar_triangle:
        {
            xb=-length;
            yb=-width*0.5;

            xc=xb;
            yc=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
    }
}


//рисуем начальную стрелку
function DrawHeadEnd(type, length, width, x, y, angle, graphics)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);
    switch(type)
    {
        case ar_arrow:
        {
            var xb, yb, xc, yc;
            xb=length;
            yb=-width*0.5;

            xc=xb;
            yc=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics.ds();

            break;
        }
        case ar_diamond:
        {
            var xd, yd;
            xb=length*0.5;
            yb=-width*0.5;

            xc=length;
            yc=0;

            xd=xb;
            yd=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();

            break;
        }
        case ar_none:
        {
            break;
        }
        case ar_oval:
        {
            Ellipse2(graphics, x, y, length*0.5, width*0.5, angle);
            break;
        }
        case ar_stealth:
        {
            xb=length;
            yb=-width*0.5;

            xc=length*0.5;
            yc=0;

            xd=xb;
            yd=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
        case ar_triangle:
        {
            xb=length;
            yb=-width*0.5;

            xc=xb;
            yc=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
    }
}

function CShapeDrawer()
{
    this.Shape      = null;
    this.Graphics   = null;
    this.NativeGraphics = null;
    this.UniFill    = null;
    this.Ln         = null;
    this.Transform  = null;

    this.bIsTexture         = false;
    this.bIsNoFillAttack    = false;
    this.bIsNoStrokeAttack  = false;
    this.FillUniColor       = null;
    this.StrokeUniColor     = null;
    this.StrokeWidth        = 0;

    this.min_x = 0xFFFF;
    this.min_y = 0xFFFF;
    this.max_x = -0xFFFF;
    this.max_y = -0xFFFF;

    this.bIsCheckBounds = false;
    this.IsRectShape    = false;
}

CShapeDrawer.prototype =
{
    Clear : function()
    {
        //this.Shape      = null;
        //this.Graphics   = null;
        this.UniFill    = null;
        this.Ln         = null;
        this.Transform  = null;

        this.bIsTexture         = false;
        this.bIsNoFillAttack    = false;
        this.bIsNoStrokeAttack  = false;
        this.FillUniColor       = null;
        this.StrokeUniColor     = null;
        this.StrokeWidth        = 0;

        this.min_x = 0xFFFF;
        this.min_y = 0xFFFF;
        this.max_x = -0xFFFF;
        this.max_y = -0xFFFF;

        this.bIsCheckBounds = false;
        this.IsRectShape    = false;
    },

    CheckPoint : function(x, y)
    {
        if (x < this.min_x)
            this.min_x = x;
        if (y < this.min_y)
            this.min_y = y;
        if (x > this.max_x)
            this.max_x = x;
        if (y > this.max_y)
            this.max_y = y;
    },

    fromShape2 : function(shape, graphics, geom)
    {
        this.fromShape(shape, graphics);

        if (!geom)
        {
            this.IsRectShape = true;
        }
        else
        {
            if (geom.preset == "rect")
                this.IsRectShape = true;
        }
    },

    fromShape : function(shape, graphics)
    {
        this.IsRectShape    = false;
        this.Shape          = shape;

        this.Graphics = graphics;
        this.NativeGraphics = window["native"];
        
        if (graphics.IsSlideBoundsCheckerType)
        {
            this.Graphics = graphics;
            this.NativeGraphics = null;
        }
        else if (graphics.IsTrack)
        {
            this.NativeGraphics = graphics.Native;
        }

        this.UniFill        = shape.brush;
        this.Ln             = shape.pen;
        this.Transform      = shape.TransformMatrix;

        this.min_x = 0xFFFF;
        this.min_y = 0xFFFF;
        this.max_x = -0xFFFF;
        this.max_y = -0xFFFF;

        var bIsCheckBounds = false;

        if (this.UniFill == null || this.UniFill.fill == null)
            this.bIsNoFillAttack = true;
        else
        {
            var _fill = this.UniFill.fill;
            switch (_fill.type)
            {
                case FILL_TYPE_BLIP:
                {
                    this.bIsTexture = true;
                    break;
                }
                case FILL_TYPE_SOLID:
                {
                    this.FillUniColor = _fill.color.RGBA;
                    break;
                }
                case FILL_TYPE_GRAD:
                {
                    bIsCheckBounds = true;

                    break;
                }
                case FILL_TYPE_PATT:
                {
                    bIsCheckBounds = true;
                    break;
                }
                case FILL_TYPE_NOFILL:
                {
                    this.bIsNoFillAttack = true;
                    break;
                }
                default:
                {
                    this.bIsNoFillAttack = true;
                    break;
                }
            }
        }

        if (this.Ln == null || this.Ln.Fill == null || this.Ln.Fill.fill == null)
            this.bIsNoStrokeAttack = true;
        else
        {
            var _fill = this.Ln.Fill.fill;
            switch (_fill.type)
            {
                case FILL_TYPE_BLIP:
                {
                    this.StrokeUniColor = new CUniColor().RGBA;
                    break;
                }
                case FILL_TYPE_SOLID:
                {
                    this.StrokeUniColor = _fill.color.RGBA;
                    break;
                }
                case FILL_TYPE_GRAD:
                {
                    var _c = _fill.colors;
                    if (_c == 0)
                        this.StrokeUniColor = new CUniColor().RGBA;
                    else
                        this.StrokeUniColor = _fill.colors[0].color.RGBA;

                    break;
                }
                case FILL_TYPE_PATT:
                {
                    this.StrokeUniColor = _fill.fgClr.RGBA;
                    break;
                }
                case FILL_TYPE_NOFILL:
                {
                    this.bIsNoStrokeAttack = true;
                    break;
                }
                default:
                {
                    this.bIsNoStrokeAttack = true;
                    break;
                }
            }

            this.StrokeWidth = (this.Ln.w == null) ? 12700 : parseInt(this.Ln.w);
            this.StrokeWidth /= 36000.0;
			
			if (graphics.IsSlideBoundsCheckerType && !this.bIsNoStrokeAttack)
                graphics.LineWidth = this.StrokeWidth;
        }

        if (this.bIsTexture || bIsCheckBounds)
        {
            // сначала нужно определить границы
            this.bIsCheckBounds = true;
            this.check_bounds();
            this.bIsCheckBounds = false;
        }
    },

    draw : function(geom)
    {
        if (this.bIsNoStrokeAttack && this.bIsNoFillAttack)
            return;
			
		if (this.Graphics.IsSlideBoundsCheckerType)
		{
			// slide bounds checker
			if(geom)
	        {
	            geom.draw(this);
	        }
	        else
	        {
	            this._s();
	            this._m(0, 0);
	            this._l(this.Shape.extX, 0);
	            this._l(this.Shape.extX, this.Shape.extY);
	            this._l(0, this.Shape.extY);
	            this._z();
	            this.drawFillStroke(true, "norm", true && !this.bIsNoStrokeAttack);
	            this._e();
	        }

	        if (this.Graphics.IsSlideBoundsCheckerType && this.Graphics.AutoCheckLineWidth)
	        {
	            this.Graphics.CorrectBounds2();
	        }
			return;
		}

        this.NativeGraphics["PD_StartShapeDraw"](this.IsRectShape);
        if(geom)
        {
            geom.draw(this);
        }
        else
        {
            this._s();
            this._m(0, 0);
            this._l(this.Shape.extX, 0);
            this._l(this.Shape.extX, this.Shape.extY);
            this._l(0, this.Shape.extY);
            this._z();
            this.drawFillStroke(true, "norm", true && !this.bIsNoStrokeAttack);
            this._e();
        }
        this.NativeGraphics["PD_EndShapeDraw"]();
    },

    p_width : function(w)
    {
		return this.Graphics.p_width(w);
    },

    _m : function(x, y)
    {
        if (this.bIsCheckBounds)
        {
            this.CheckPoint(x, y);
            return;
        }
		return this.Graphics._m(x, y);
    },
    _l : function(x, y)
    {
        if (this.bIsCheckBounds)
        {
            this.CheckPoint(x, y);
            return;
        }
		return this.Graphics._l(x, y);        
    },
    _c : function(x1, y1, x2, y2, x3, y3)
    {
        if (this.bIsCheckBounds)
        {
            this.CheckPoint(x1, y1);
            this.CheckPoint(x2, y2);
            this.CheckPoint(x3, y3);
            return;
        }
		return this.Graphics._c(x1, y1, x2, y2, x3, y3);
    },
    _c2 : function(x1, y1, x2, y2)
    {
        if (this.bIsCheckBounds)
        {
            this.CheckPoint(x1, y1);
            this.CheckPoint(x2, y2);
            return;
        }
		return this.Graphics._c2(x1, y1, x2, y2);
    },
    _z : function()
    {
        if (this.bIsCheckBounds)
            return;
		return this.Graphics._z();		
    },
    _s : function()
    {
		return this.Graphics._s();
    },
    _e : function()
    {
		return this.Graphics._e();    
    },

    df : function(mode)
    {
        if (mode == "none" || this.bIsNoFillAttack)
            return;
			
		if (this.Graphics.IsSlideBoundsCheckerType)
			return;

        var _fill = this.UniFill.fill;
        switch (_fill.type)
        {
            case FILL_TYPE_BLIP:
            {
                if (!_fill.srcRect)
                    this.NativeGraphics["PD_put_BrushTextute"](_fill.RasterImageId);
                else
                {
                    var _sR = _fill.srcRect;
                    this.NativeGraphics["PD_put_BrushTextute"](_fill.RasterImageId, _sR.l, _sR.t, _sR.r, _sR.b);
                }

                this.NativeGraphics["PD_put_BrushTextureMode"]((null == _fill.tile) ? 1 : 2);
                this.NativeGraphics["PD_put_BrushBounds"](this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y));

                break;
            }
            case FILL_TYPE_SOLID:
            {
                var rgba = this.FillUniColor;
                if (mode == "darken")
                {
                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                    var rgb = _color1.darken();
                    rgba = { R: rgb.r, G: rgb.g, B: rgb.b, A: rgba.A };
                }
                else if (mode == "darkenLess")
                {
                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                    var rgb = _color1.darkenLess();
                    rgba = { R: rgb.r, G: rgb.g, B: rgb.b, A: rgba.A };
                }
                else if (mode == "lighten")
                {
                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                    var rgb = _color1.lighten();
                    rgba = { R: rgb.r, G: rgb.g, B: rgb.b, A: rgba.A };
                }
                else if (mode == "lightenLess")
                {
                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                    var rgb = _color1.lightenLess();
                    rgba = { R: rgb.r, G: rgb.g, B: rgb.b, A: rgba.A };
                }
                if (rgba)
                {
                    if (this.UniFill.transparent != null)
                        rgba.A = this.UniFill.transparent;
                    this.NativeGraphics["PD_b_color1"](rgba.R, rgba.G, rgba.B, rgba.A);
                }
                break;
            }
            case FILL_TYPE_GRAD:
            {
                this.NativeGraphics["PD_put_BrushBounds"](this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y));
                var points = null;
                if (_fill.lin)
                {
                    points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, _fill.lin.angle, _fill.lin.scale);
                    this.NativeGraphics["PD_put_BrushGradientLinear"](points.x0, points.y0, points.x1, points.y1);
                }
                else if (_fill.path)
                {
                    var _cx = (this.min_x + this.max_x) / 2;
                    var _cy = (this.min_y + this.max_y) / 2;
                    var _r = Math.max(this.max_x - this.min_x, this.max_y - this.min_y) / 2;
                    this.NativeGraphics["PD_put_BrushGradientRadial"](_cx, _cy, 1, _cx, _cy, _r);
                }
                else
                {
                    //gradObj = _ctx.createLinearGradient(this.min_x, this.min_y, this.max_x, this.min_y);
                    points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, 90 * 60000, false);
                    this.NativeGraphics["PD_put_BrushGradientLinear"](points.x0, points.y0, points.x1, points.y1);
                }

                var arr_pos = [];
                var arr_colors = [];
                for (var i = 0; i < _fill.colors.length; i++)
                {
                    arr_pos.push(_fill.colors[i].pos / 100000);

                    var _c = _fill.colors[i].color.RGBA;
                    arr_colors.push(_c.R * 256*256*256 + _c.G * 256*256 + _c.B * 256 + _c.A);
                }
                this.NativeGraphics["PD_put_BrushGragientColors"](arr_pos, arr_colors);

                break;
            }
            case FILL_TYPE_PATT:
            {
                var _patt_name = global_hatch_names[_fill.ftype];
                if (undefined == _patt_name)
                    _patt_name = "cross";

                var _fc = _fill.fgClr.RGBA;
                var _bc = _fill.bgClr.RGBA;

                var __fa = (null === this.UniFill.transparent) ? _fc.A : 255;
                var __ba = (null === this.UniFill.transparent) ? _bc.A : 255;

                this.NativeGraphics["PD_put_BrushPattern"](_patt_name);
                this.NativeGraphics["PD_b_color1"](_fc.R, _fc.G, _fc.B, __fa);
                this.NativeGraphics["PD_b_color2"](_bc.R, _bc.G, _bc.B, __ba);
                break;
            }
            default:
                break;
        }

        this.NativeGraphics["PD_Fill"]();
    },
    ds : function()
    {
        if (this.bIsNoStrokeAttack)
            return;
			
		if (this.Graphics.IsSlideBoundsCheckerType)
			return;

        if (this.Ln.Join != null && this.Ln.Join.type != null)
        {
            switch (this.Ln.Join.type)
            {
                case LineJoinType.Round:
                {
                    this.NativeGraphics["PD_lineJoin"]("round");
                    break;
                }
                case LineJoinType.Bevel:
                {
                    this.NativeGraphics["PD_lineJoin"]("bevel");
                    break;
                }
                case LineJoinType.Empty:
                {
                    this.NativeGraphics["PD_lineJoin"]("miter");
                    break;
                }
                case LineJoinType.Miter:
                {
                    this.NativeGraphics["PD_lineJoin"]("miter");
                    break;
                }
            }
        }

        var rgba = this.StrokeUniColor;
        this.NativeGraphics["PD_p_width"](this.StrokeWidth);
        this.NativeGraphics["PD_p_color"](rgba.R, rgba.G, rgba.B, rgba.A);
        
        this.NativeGraphics["PD_Stroke"]();
    },

    drawFillStroke : function(bIsFill, fill_mode, bIsStroke)
    {
        if (bIsFill)
            this.df(fill_mode);
        if (bIsStroke)
            this.ds();
    },

    check_bounds : function()
    {
        this.Shape.check_bounds(this);
    },

    // common funcs
    getNormalPoint : function(x0, y0, angle, x1, y1)
    {
        // точка - пересечение прямой, проходящей через точку (x0, y0) под углом angle и
        // перпендикуляра к первой прямой, проведенной из точки (x1, y1)
        var ex1 = Math.cos(angle);
        var ey1 = Math.sin(angle);

        var ex2 = -ey1;
        var ey2 = ex1;

        var a = ex1 / ey1;
        var b = ex2 / ey2;

        var x = ((a * b * y1 - a * b * y0) - (a * x1 - b * x0)) / (b - a);
        var y = (x - x0) / a + y0;

        return { X : x, Y : y };
    },

    getGradientPoints : function(min_x, min_y, max_x, max_y, _angle, scale)
    {
        var points = { x0 : 0, y0 : 0, x1 : 0, y1 : 0 };

        var angle = _angle / 60000;
        while (angle < 0)
            angle += 360;
        while (angle >= 360)
            angle -= 360;

        if (Math.abs(angle) < 1)
        {
            points.x0 = min_x;
            points.y0 = min_y;
            points.x1 = max_x;
            points.y1 = min_y;

            return points;
        }
        else if (Math.abs(angle - 90) < 1)
        {
            points.x0 = min_x;
            points.y0 = min_y;
            points.x1 = min_x;
            points.y1 = max_y;

            return points;
        }
        else if (Math.abs(angle - 180) < 1)
        {
            points.x0 = max_x;
            points.y0 = min_y;
            points.x1 = min_x;
            points.y1 = min_y;

            return points;
        }
        else if (Math.abs(angle - 270) < 1)
        {
            points.x0 = min_x;
            points.y0 = max_y;
            points.x1 = min_x;
            points.y1 = min_y;

            return points;
        }

        var grad_a = deg2rad(angle);
        if (!scale)
        {
            if (angle > 0 && angle < 90)
            {
                var p = this.getNormalPoint(min_x, min_y, grad_a, max_x, max_y);

                points.x0 = min_x;
                points.y0 = min_y;
                points.x1 = p.X;
                points.y1 = p.Y;

                return points;
            }
            if (angle > 90 && angle < 180)
            {
                var p = this.getNormalPoint(max_x, min_y, grad_a, min_x, max_y);

                points.x0 = max_x;
                points.y0 = min_y;
                points.x1 = p.X;
                points.y1 = p.Y;

                return points;
            }
            if (angle > 180 && angle < 270)
            {
                var p = this.getNormalPoint(max_x, max_y, grad_a, min_x, min_y);

                points.x0 = max_x;
                points.y0 = max_y;
                points.x1 = p.X;
                points.y1 = p.Y;

                return points;
            }
            if (angle > 270 && angle < 360)
            {
                var p = this.getNormalPoint(min_x, max_y, grad_a, max_x, min_y);

                points.x0 = min_x;
                points.y0 = max_y;
                points.x1 = p.X;
                points.y1 = p.Y;

                return points;
            }
            // никогда сюда не зайдем
            return points;
        }

        // scale == true
        var _grad_45 = (Math.PI / 2) - Math.atan2(max_y - min_y, max_x - min_x);
        var _grad_90_45 = (Math.PI / 2) - _grad_45;
        if (angle > 0 && angle < 90)
        {
            if (angle <= 45)
            {
                grad_a = (_grad_45 * angle / 45);
            }
            else
            {
                grad_a = _grad_45 + _grad_90_45 * (angle - 45) / 45;
            }

            var p = this.getNormalPoint(min_x, min_y, grad_a, max_x, max_y);

            points.x0 = min_x;
            points.y0 = min_y;
            points.x1 = p.X;
            points.y1 = p.Y;

            return points;
        }
        if (angle > 90 && angle < 180)
        {
            if (angle <= 135)
            {
                grad_a = Math.PI / 2 + _grad_90_45 * (angle - 90) / 45;
            }
            else
            {
                grad_a = Math.PI - _grad_45 * (angle - 135) / 45;
            }

            var p = this.getNormalPoint(max_x, min_y, grad_a, min_x, max_y);

            points.x0 = max_x;
            points.y0 = min_y;
            points.x1 = p.X;
            points.y1 = p.Y;

            return points;
        }
        if (angle > 180 && angle < 270)
        {
            if (angle <= 225)
            {
                grad_a = Math.PI + _grad_45 * (angle - 180) / 45;
            }
            else
            {
                grad_a = 3 * Math.PI / 2 - _grad_90_45 * (angle - 225) / 45;
            }

            var p = this.getNormalPoint(max_x, max_y, grad_a, min_x, min_y);

            points.x0 = max_x;
            points.y0 = max_y;
            points.x1 = p.X;
            points.y1 = p.Y;

            return points;
        }
        if (angle > 270 && angle < 360)
        {
            if (angle <= 315)
            {
                grad_a = 3 * Math.PI / 2 + _grad_90_45 * (angle - 270) / 45;
            }
            else
            {
                grad_a = 2 * Math.PI - _grad_45 * (angle - 315) / 45;
            }

            var p = this.getNormalPoint(min_x, max_y, grad_a, max_x, min_y);

            points.x0 = min_x;
            points.y0 = max_y;
            points.x1 = p.X;
            points.y1 = p.Y;

            return points;
        }
        // никогда сюда не зайдем
        return points;
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
    }
};

function ShapeToImageConverter(shape, pageIndex)
{
	return "";
}