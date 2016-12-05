/*
 * (c) Copyright Ascensio System SIA 2010-2016
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

    this.m_oPen     = new AscCommon.CPen();
    this.m_oBrush   = new AscCommon.CBrush();
    this.m_oAutoShapesTrack = null;

    this.m_oFontManager = null;
    this.m_bIsFillTextCanvasColor = 0;

    this.m_oCoordTransform  = new AscCommon.CMatrixL();
    this.m_oBaseTransform   = new AscCommon.CMatrixL();
    this.m_oTransform       = new AscCommon.CMatrixL();
    this.m_oFullTransform   = new AscCommon.CMatrixL();
    this.m_oInvertFullTransform = new AscCommon.CMatrixL();

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
    this.m_oGrFonts     = new AscCommon.CGrRFonts();
    this.m_oLastFont    = new AscCommon.CFontSetup();

    this.LastFontOriginInfo = { Name : "", Replace : null };

    this.m_bIntegerGrid = true;

    this.ClipManager = new AscCommon.CClipManager();
    this.ClipManager.BaseObject = this;

    this.TextureFillTransformScaleX = 1;
    this.TextureFillTransformScaleY = 1;
    this.IsThumbnail = false;

    this.GrState = new AscCommon.CGrState();
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

        this.LastFontOriginInfo = { Name : "", Replace : null };
        this.m_oCurFont =
        {
            Name        : "",
            FontSize    : 10,
            Bold        : false,
            Italic      : false
        };

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

        //this.ClearParams();

        this.m_oLastFont.Clear();
        this.Native["PD_Save"]();

        // this.m_oContext.save();
    },
    EndDraw : function()
    {
    },

    ClearParams : function()
    {
        this.m_oTextPr      = null;
        this.m_oGrFonts     = new AscCommon.CGrRFonts();
        this.m_oLastFont    = new AscCommon.CFontSetup();

        this.IsUseFonts2    = false;
        this.m_oLastFont2   = null;

        this.m_bIntegerGrid = true;
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
                this.m_oContext.lineWidth = this.m_oPen.LineWidth;
            }
            else
            {
                var _x1 = this.m_oFullTransform.TransformPointX(0, 0);
                var _y1 = this.m_oFullTransform.TransformPointY(0, 0);
                var _x2 = this.m_oFullTransform.TransformPointX(1, 1);
                var _y2 = this.m_oFullTransform.TransformPointY(1, 1);

                var _koef = Math.sqrt(((_x2 - _x1)*(_x2 - _x1) + (_y2 - _y1)*(_y2 - _y1)) / 2);
                this.Native["PD_p_width"](1 / _koef);
                this.m_oContext.lineWidth = 1 / _koef;
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
                this.m_oContext.lineWidth = this.m_oPen.LineWidth * koef;
            }
            else
            {
                this.Native["PD_p_width"](1);
                this.m_oContext.lineWidth = 1;
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
        AscCommon.global_MatrixTransformer.MultiplyAppend(_ft, this.m_oCoordTransform);

        var _it = this.m_oInvertFullTransform;
        _it.sx = _ft.sx;
        _it.shx = _ft.shx;
        _it.shy = _ft.shy;
        _it.sy = _ft.sy;
        _it.tx = _ft.tx;
        _it.ty = _ft.ty;

        if (false !== isInvertNeed)
        {
            AscCommon.global_MatrixTransformer.MultiplyAppendInvert(_it, _t);
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

        //this.ClearParams();

        this.Native["PD_reset"]();
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
                if (!AscCommon.global_MatrixTransformer.IsIdentity2(this.m_oTransform))
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
                if (!AscCommon.global_MatrixTransformer.IsIdentity2(this.m_oTransform))
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

        var oFontStyle = AscFonts.FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleBoldItalic;

        var _fontinfo = AscFonts.g_fontApplication.GetFontInfo(font.FontFamily.Name, oFontStyle, this.LastFontOriginInfo);
        var _info = GetLoadInfoForMeasurer(_fontinfo, oFontStyle);

        this.m_oLastFont.SetUpName = font.FontFamily.Name;
        this.m_oLastFont.SetUpSize = font.FontSize;
        this.m_oLastFont.SetUpStyle = oFontStyle;

        var flag = 0;
        if (_info.NeedBold)     flag |= 0x01;
        if (_info.NeedItalic)   flag |= 0x02;
        if (_info.SrcBold)      flag |= 0x04;
        if (_info.SrcItalic)    flag |= 0x08;

        g_oTextMeasurer.Measurer["LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);

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
        var _lastFont = this.m_oLastFont;

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

    //    if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle)
        {
            _lastFont.SetUpName = _lastFont.Name;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;

            var _fontinfo = AscFonts.g_fontApplication.GetFontInfo(_lastFont.SetUpName, _lastFont.SetUpStyle, this.LastFontOriginInfo);
            var _info = GetLoadInfoForMeasurer(_fontinfo, _lastFont.SetUpStyle);

            var flag = 0;
            if (_info.NeedBold)     flag |= 0x01;
            if (_info.NeedItalic)   flag |= 0x02;
            if (_info.SrcBold)      flag |= 0x04;
            if (_info.SrcItalic)    flag |= 0x08;

            g_oTextMeasurer.Measurer["LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);

            this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);
        }
    },

    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    FillText : function(x,y,text)
    {
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = AscFonts.g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

       // var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
       // var _y = this.m_oInvertFullTransform.TransformPointY(x,y);

        this.Native["PD_FillText"](x, y, _code);
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
            _code = AscFonts.g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

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
            lUnicode = AscFonts.g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

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
//------------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CGraphics = CGraphics;
