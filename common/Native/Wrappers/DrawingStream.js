/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

function CDrawingStreamSerializer()
{
    this.Memory = [];
}

CDrawingStreamSerializer.prototype["PD_put_GlobalAlpha"] = function(enable, alpha)
{
    this.Memory.push(0);
    this.Memory.push(enable);
    this.Memory.push(alpha);
};
CDrawingStreamSerializer.prototype["PD_End_GlobalAlpha"] = function()
{
    this.Memory.push(1);
};
CDrawingStreamSerializer.prototype["PD_p_color"] = function(r,g,b,a)
{
    this.Memory.push(2);
    this.Memory.push(r);
    this.Memory.push(g);
    this.Memory.push(b);
    this.Memory.push(a);
};
CDrawingStreamSerializer.prototype["PD_p_width"] = function(w)
{
    this.Memory.push(3);
    this.Memory.push(w);
};
CDrawingStreamSerializer.prototype["PD_b_color1"] = function(r,g,b,a)
{
    this.Memory.push(4);
    this.Memory.push(r);
    this.Memory.push(g);
    this.Memory.push(b);
    this.Memory.push(a);
};
CDrawingStreamSerializer.prototype["PD_b_color2"] = function(r,g,b,a)
{
    this.Memory.push(5);
    this.Memory.push(r);
    this.Memory.push(g);
    this.Memory.push(b);
    this.Memory.push(a);
};
CDrawingStreamSerializer.prototype["PD_transform"] = function(sx,shy,shx,sy,tx,ty)
{
    this.Memory.push(6);
    this.Memory.push(sx);
    this.Memory.push(shy);
    this.Memory.push(shx);
    this.Memory.push(sy);
    this.Memory.push(tx);
    this.Memory.push(ty);
};
CDrawingStreamSerializer.prototype["PD_PathStart"] = function()
{
    this.Memory.push(11);
};
CDrawingStreamSerializer.prototype["PD_PathEnd"] = function()
{
    this.Memory.push(12);
};
CDrawingStreamSerializer.prototype["PD_PathClose"] = function()
{
    this.Memory.push(13);
};
CDrawingStreamSerializer.prototype["PD_PathMoveTo"] = function(x,y)
{
    this.Memory.push(7);
    this.Memory.push(x);
    this.Memory.push(y);
};
CDrawingStreamSerializer.prototype["PD_PathLineTo"] = function(x,y)
{
    this.Memory.push(8);
    this.Memory.push(x);
    this.Memory.push(y);
};
CDrawingStreamSerializer.prototype["PD_PathCurveTo"] = function(x1,y1,x2,y2,x3,y3)
{
    this.Memory.push(9);
    this.Memory.push(x1);
    this.Memory.push(y1);
    this.Memory.push(x2);
    this.Memory.push(y2);
    this.Memory.push(x3);
    this.Memory.push(y3);
};
CDrawingStreamSerializer.prototype["PD_PathCurveTo2"] = function(x1,y1,x2,y2)
{
    this.Memory.push(10);
    this.Memory.push(x1);
    this.Memory.push(y1);
    this.Memory.push(x2);
    this.Memory.push(y2);
};
CDrawingStreamSerializer.prototype["PD_Stroke"] = function()
{
    this.Memory.push(14);
};
CDrawingStreamSerializer.prototype["PD_Fill"] = function()
{
    this.Memory.push(15);
};
CDrawingStreamSerializer.prototype["PD_Save"] = function()
{
    this.Memory.push(16);
};
CDrawingStreamSerializer.prototype["PD_Restore"] = function()
{
    this.Memory.push(17);
};
CDrawingStreamSerializer.prototype["PD_clip"] = function()
{
    this.Memory.push(18);
};
CDrawingStreamSerializer.prototype["PD_reset"] = function()
{
    this.Memory.push(19);
};
CDrawingStreamSerializer.prototype["PD_transform3"] = function(sx,shy,shx,sy,tx,ty,isNeedInvert)
{
    this.Memory.push(20);
    this.Memory.push(sx);
    this.Memory.push(shy);
    this.Memory.push(shx);
    this.Memory.push(sy);
    this.Memory.push(tx);
    this.Memory.push(ty);
    this.Memory.push(isNeedInvert);
};
CDrawingStreamSerializer.prototype["PD_FreeFont"] = function()
{
    // none
};
CDrawingStreamSerializer.prototype["PD_drawImage"] = function(img,x,y,w,h,alpha,srcRect_l,srcRect_t,srcRect_r,srcRect_b)
{
    if (srcRect_l === undefined)
    {
        this.Memory.push(22);
        this.Memory.push(img);
        this.Memory.push(x);
        this.Memory.push(y);
        this.Memory.push(w);
        this.Memory.push(h);
        this.Memory.push(alpha);
        return;
    }
    this.Memory.push(23);
    this.Memory.push(img);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
    this.Memory.push(alpha);
    this.Memory.push(srcRect_l);
    this.Memory.push(srcRect_t);
    this.Memory.push(srcRect_r);
    this.Memory.push(srcRect_b);
};
CDrawingStreamSerializer.prototype["PD_font"] = function(font_id, font_size)
{
    // nothing
};
CDrawingStreamSerializer.prototype["PD_LoadFont"] = function(Path, FaceIndex, FontSize, flag)
{
    this.Memory.push(25);
    this.Memory.push(Path);
    this.Memory.push(FaceIndex);
    this.Memory.push(FontSize);
    this.Memory.push(flag);
};
CDrawingStreamSerializer.prototype["PD_FillText"] = function(x,y,text_code)
{
    this.Memory.push(26);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(text_code);
};
CDrawingStreamSerializer.prototype["PD_Text"] = function(x,y,_arr)
{
    // not used.
};
CDrawingStreamSerializer.prototype["PD_FillText2"] = function(x,y,text_code,cropX,cropW)
{
    this.Memory.push(28);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(text_code);
    this.Memory.push(cropX);
    this.Memory.push(cropW);
};
CDrawingStreamSerializer.prototype["PD_Text2"] = function(x,y,_arr,cropX,cropW)
{
    // not used.
};
CDrawingStreamSerializer.prototype["PD_FillTextG"] = function(x,y,text_code)
{
    this.Memory.push(31);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(text_code);
};
CDrawingStreamSerializer.prototype["PD_SetIntegerGrid"] = function(param)
{
    this.Memory.push(32);
    this.Memory.push(param);
};
CDrawingStreamSerializer.prototype["PD_DrawHeaderEdit"] = function(yPos, lock_type)
{
    this.Memory.push(33);
    this.Memory.push(yPos);
    this.Memory.push(lock_type);
};
CDrawingStreamSerializer.prototype["PD_DrawFooterEdit"] = function(yPos, lock_type)
{
    this.Memory.push(34);
    this.Memory.push(yPos);
    this.Memory.push(lock_type);
};
CDrawingStreamSerializer.prototype["PD_DrawLockParagraph"] = function(lock_type, x, y1, y2)
{
    this.Memory.push(35);
    this.Memory.push(lock_type);
    this.Memory.push(x);
    this.Memory.push(y1);
    this.Memory.push(y2);
};
CDrawingStreamSerializer.prototype["PD_DrawLockObjectRect"] = function(lock_type, x, y, w, h)
{
    this.Memory.push(36);
    this.Memory.push(lock_type);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_DrawEmptyTableLine"] = function(x1,y1,x2,y2)
{
    this.Memory.push(37);
    this.Memory.push(x1);
    this.Memory.push(y1);
    this.Memory.push(x2);
    this.Memory.push(y2);
};
CDrawingStreamSerializer.prototype["PD_DrawSpellingLine"] = function(y0, x0, x1, w)
{
    this.Memory.push(38);
    this.Memory.push(y0);
    this.Memory.push(x0);
    this.Memory.push(x1);
    this.Memory.push(w);
};
CDrawingStreamSerializer.prototype["PD_drawHorLine"] = function(align, y, x, r, penW)
{
    this.Memory.push(39);
    this.Memory.push(align);
    this.Memory.push(y);
    this.Memory.push(x);
    this.Memory.push(r);
    this.Memory.push(penW);
};
CDrawingStreamSerializer.prototype["PD_drawHorLine2"] = function(align, y, x, r, penW)
{
    this.Memory.push(40);
    this.Memory.push(align);
    this.Memory.push(y);
    this.Memory.push(x);
    this.Memory.push(r);
    this.Memory.push(penW);
};
CDrawingStreamSerializer.prototype["PD_drawVerLine"] = function(align, x, y, b, penW)
{
    this.Memory.push(41);
    this.Memory.push(align);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(b);
    this.Memory.push(penW);
};
CDrawingStreamSerializer.prototype["PD_drawHorLineExt"] = function(align, y, x, r, penW, leftMW, rightMW)
{
    this.Memory.push(42);
    this.Memory.push(align);
    this.Memory.push(y);
    this.Memory.push(x);
    this.Memory.push(r);
    this.Memory.push(penW);
    this.Memory.push(leftMW);
    this.Memory.push(rightMW);
};
CDrawingStreamSerializer.prototype["PD_rect"] = function(x,y,w,h)
{
    this.Memory.push(43);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_TableRect"] = function(x,y,w,h)
{
    this.Memory.push(44);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_AddClipRect"] = function(x,y,w,h)
{
    this.Memory.push(45);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_SetClip"] = function(x,y,w,h)
{
    this.Memory.push(46);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_RemoveClip"] = function()
{
    this.Memory.push(47);
};
CDrawingStreamSerializer.prototype["PD_drawCollaborativeChanges"] = function(x, y, w, h)
{
    this.Memory.push(48);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_drawSearchResult"] = function(x, y, w, h)
{
    this.Memory.push(49);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_drawFlowAnchor"] = function(x, y)
{
    this.Memory.push(50);
    this.Memory.push(x);
    this.Memory.push(y);
};
CDrawingStreamSerializer.prototype["PD_SavePen"] = function()
{
    this.Memory.push(51);
};
CDrawingStreamSerializer.prototype["PD_RestorePen"] = function()
{
    this.Memory.push(52);
};
CDrawingStreamSerializer.prototype["PD_SaveBrush"] = function()
{
    this.Memory.push(53);
};
CDrawingStreamSerializer.prototype["PD_RestoreBrush"] = function()
{
    this.Memory.push(54);
};
CDrawingStreamSerializer.prototype["PD_SavePenBrush"] = function()
{
    this.Memory.push(55);
};
CDrawingStreamSerializer.prototype["PD_RestorePenBrush"] = function()
{
    this.Memory.push(56);
};
CDrawingStreamSerializer.prototype["PD_SaveGrState"] = function()
{
    this.Memory.push(57);
};
CDrawingStreamSerializer.prototype["PD_RestoreGrState"] = function()
{
    this.Memory.push(58);
};
CDrawingStreamSerializer.prototype["PD_StartClipPath"] = function()
{
    this.Memory.push(59);
};
CDrawingStreamSerializer.prototype["PD_EndClipPath"] = function()
{
    this.Memory.push(65);
};
CDrawingStreamSerializer.prototype["PD_StartCheckTableDraw"] = function()
{
    this.Memory.push(60);
};
CDrawingStreamSerializer.prototype["PD_EndCheckTableDraw"] = function(bIsRestore)
{
    this.Memory.push(61);
};
CDrawingStreamSerializer.prototype["PD_SetTextClipRect"] = function(_l, _t, _r, _b)
{
    this.Memory.push(62);
    this.Memory.push(_l);
    this.Memory.push(_t);
    this.Memory.push(_r);
    this.Memory.push(_b);
};
CDrawingStreamSerializer.prototype["PD_AddSmartRect"] = function(x, y, w, h, pen_w)
{
    this.Memory.push(63);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
    this.Memory.push(pen_w);
};
CDrawingStreamSerializer.prototype["PD_DrawPresentationComment"] = function(type, x, y, w, h)
{
    this.Memory.push(64);
    this.Memory.push(type);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_StartShapeDraw"] = function(IsRectShape)
{
    this.Memory.push(70);
    this.Memory.push(IsRectShape);
};
CDrawingStreamSerializer.prototype["PD_EndShapeDraw"] = function()
{
    this.Memory.push(71);
};
CDrawingStreamSerializer.prototype["PD_put_BrushTexture"] = function(id, l, t, r, b)
{
    if (l === undefined)
    {
        this.Memory.push(72);
        this.Memory.push(id);
        return;
    }
    this.Memory.push(73);
    this.Memory.push(id);
    this.Memory.push(l);
    this.Memory.push(t);
    this.Memory.push(r);
    this.Memory.push(b);
};
CDrawingStreamSerializer.prototype["PD_put_BrushTextureMode"] = function(mode)
{
    this.Memory.push(74);
    this.Memory.push(mode);
};
CDrawingStreamSerializer.prototype["PD_put_BrushBounds"] = function(x, y, w, h)
{
    this.Memory.push(75);
    this.Memory.push(x);
    this.Memory.push(y);
    this.Memory.push(w);
    this.Memory.push(h);
};
CDrawingStreamSerializer.prototype["PD_put_BrushGradientLinear"] = function(x0, y0, x1, y1)
{
    this.Memory.push(76);
    this.Memory.push(x0);
    this.Memory.push(y0);
    this.Memory.push(x1);
    this.Memory.push(y1);
};
CDrawingStreamSerializer.prototype["PD_put_BrushGragientColors"] = function(arr_pos, arr_colors)
{
    this.Memory.push(77);
    this.Memory.push(arr_colors.length);

    for (var i = 0; i < arr_colors.length; i++)
    {
        this.Memory.push(arr_pos[i].pos / 100000);

        var _rgba = arr_colors[i].color.RGBA;
        this.Memory.push(_rgba.R * 256*256*256 + _rgba.G * 256*256 + _rgba.B * 256 + _rgba.A);
    }
};
CDrawingStreamSerializer.prototype["PD_put_BrushPattern"] = function(_patt_name)
{
    this.Memory.push(78);
    this.Memory.push(_patt_name);
};
CDrawingStreamSerializer.prototype["PD_lineJoin"] = function(_join)
{
    this.Memory.push(79);
    this.Memory.push(_join);
};
CDrawingStreamSerializer.prototype["PD_put_BrushGradientRadial"] = function(x1, y1, r1, x2, y2, r2)
{
    this.Memory.push(80);
    this.Memory.push(x1);
    this.Memory.push(y1);
    this.Memory.push(r1);
    this.Memory.push(x2);
    this.Memory.push(y2);
    this.Memory.push(r2);
};

function CDrawingStream(_writer)
{
    this.Native = (undefined === _writer) ? window["native"] : _writer;

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

CDrawingStream.prototype =
{
    ClearParams : function()
    {
        this.m_oTextPr      = null;
        this.m_oGrFonts     = new AscCommon.CGrRFonts();
        this.m_oLastFont    = new AscCommon.CFontSetup();

        this.IsUseFonts2    = false;
        this.m_oLastFont2   = null;

        this.m_bIntegerGrid = true;
    },

    EndDraw : function()
    {
        // not used
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
    Start_GlobalAlpha : function()
    {
        // nothing
    },
    End_GlobalAlpha : function()
    {
        this.Native["PD_End_GlobalAlpha"]();
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        var _c = this.m_oPen.Color;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;
        this.Native["PD_p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.Native["PD_p_width"](w / 1000);
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
    },
    b_color2 : function(r,g,b,a)
    {
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

    FreeFont : function()
    {
        this.Native["PD_FreeFont"]();
    },

    // images
    drawImage : function(img,x,y,w,h,alpha,srcRect)
    {
        if (!srcRect)
            return this.Native["PD_drawImage"](img,x,y,w,h,alpha);

        return this.Native["PD_drawImage"](img,x,y,w,h,alpha,srcRect.l,srcRect.t,srcRect.r,srcRect.b);
    },

    // text
    GetFont : function()
    {
        return this.m_oCurFont;
    },
    font : function(font_id,font_size)
    {
        this.Native["PD_font"](font_id, font_size);
    },
    SetFont : function(font)
    {
        if (null == font)
            return;

        this.m_oCurFont =
        {
            FontFamily :
            {
                Index : font.FontFamily.Index,
                Name  : font.FontFamily.Name
            },

            FontSize : font.FontSize,
            Bold     : font.Bold,
            Italic   : font.Italic
        };

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

        var flag = 0;
        if (_info.NeedBold)     flag |= 0x01;
        if (_info.NeedItalic)   flag |= 0x02;
        if (_info.SrcBold)      flag |= 0x04;
        if (_info.SrcItalic)    flag |= 0x08;

        this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);
    },

    SetTextPr : function(textPr, theme)
    {
        this.m_oTextPr = textPr;
        if (theme)
            this.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, this.m_oTextPr.RFonts);
        else
            this.m_oGrFonts = this.m_oTextPr.RFonts;
    },
    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oGrFonts;
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

        if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle)
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

            this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);
        }
    },

    FillText : function(x,y,text)
    {
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = AscFonts.g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

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
        this.Native["PD_FillTextG"](x,y,text);
    },
    charspace : function(space)
    {
        // nothing
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

    DrawSpellingLine : function(y0, x0, x1, w)
    {
        this.Native["PD_DrawSpellingLine"](y0, x0, x1, w);
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
        this.Native["PD_rect"](x,y,w,h);
    },

    TableRect : function(x,y,w,h)
    {
        this.Native["PD_TableRect"](x,y,w,h);
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        this.Native["PD_AddClipRect"](x,y,w,h);
    },
    RemoveClipRect : function()
    {
        // nothing
    },

    SetClip : function(r)
    {
        this.Native["PD_SetClip"](r.x, r.y, r.w, r.h);
    },

    RemoveClip : function()
    {
        this.Native["PD_RemoveClip"]();
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
    },

    AddSmartRect : function(x, y, w, h, pen_w)
    {
        return this.Native["PD_AddSmartRect"](x, y, w, h, pen_w);
    },

    Drawing_StartCheckBounds : function(x, y, w, h)
    {

    },

    Drawing_EndCheckBounds : function()
    {

    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        return this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    }
};
