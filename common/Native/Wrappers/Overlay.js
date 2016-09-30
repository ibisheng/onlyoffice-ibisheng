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

var TRACK_CIRCLE_RADIUS     = 5;
var TRACK_RECT_SIZE2        = 4;
var TRACK_RECT_SIZE         = 8;
var TRACK_RECT_SIZE_CT      = 6;
var TRACK_DISTANCE_ROTATE   = 25;
var TRACK_DISTANCE_ROTATE2  = 25;
var TRACK_ADJUSTMENT_SIZE   = 10;
var TRACK_WRAPPOINTS_SIZE   = 6;
var IMAGE_ROTATE_TRACK_W    = 21;

if (AscCommon.AscBrowser.isRetina && AscCommon.AscBrowser.isMobile) {
    TRACK_DISTANCE_ROTATE <<= 1;
}

var bIsUseImageRotateTrack  = true;
if (bIsUseImageRotateTrack)
{
    window.g_track_rotate_marker = new Image();
    window.g_track_rotate_marker;
    window.g_track_rotate_marker.asc_complete = false;
    window.g_track_rotate_marker.onload = function(){
        window.g_track_rotate_marker.asc_complete = true;
    };
    window.g_track_rotate_marker.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAVFBMVEUAAAD///////////////////////////////////////////////////////98fHy2trb09PTT09OysrKqqqqJiYng4ODr6+uamprGxsbi4uKGhoYjgM0eAAAADnRSTlMAy00k7/z0jbeuMzDljsugwZgAAACpSURBVBjTdZHbEoMgDESDAl6bgIqX9v//s67UYpm6D0xyYMImoaiuUr3pVdVRUtnwqaY8YaE5SRcfaPgqc+DSIh7WIGGaEVoUqRGN4oZlcDIiqYlaPjQz5CNu6cFJwLiuSO3nlLBDrKhn3l4rcnH4NcAdGd5EZMfCsoMFBxM6CD57G+u6vC48PMVnHtrYhP/x+7+3cw7zdJnD3cyA7QXa4nYXaW+a9Xdvb6zqE5Jb7LmzAAAAAElFTkSuQmCC";

    window.g_track_rotate_marker2 = new Image();
    window.g_track_rotate_marker2;
    window.g_track_rotate_marker2.asc_complete = false;
    window.g_track_rotate_marker2.onload = function(){
        window.g_track_rotate_marker2.asc_complete = true;
    };
    window.g_track_rotate_marker2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAeFBMVEUAAAD///////////////////////////////////////////////////////////////////////////+Tk5Obm5v8/PzAwMD5+fmWlpbt7e3k5OSfn5/z8/PLy8vn5+fExMSsrKyqqqrf39+vr6+9vb2urq7c3NxSmuRpAAAAE3RSTlMA+u2XA+PTrId4WBwTN7EKtLY4iqQP6AAAAWhJREFUOMudVe2SgjAMLN+goN51CxTLp3r3/m943BAqIJTR/RU6O02yTRY2g5tEgW9blu0HUeKyLRxDj0/ghcdVWuxYfAHLiV95B5uvwD4saK7DN+DMSj1f+CYu58l9J27A6XnnJG9R3ZWU6l4Vk+y6D310baHRXvUxdRSP/aYZILJbmebFLRNAlo69x7PEeQdZ5Xz8qiS6fJr8aOnEquATFApdSsr/v1HINUo+Q6nwoDDspfH4JmoJ6shzWcINaNBSlLCI6uvLfyXmAlR2xIKBB/A1ZKiGIGA+8QCtphBawRt+hsBnNvE0M0OPZmwcijRnFvE0U6CuIcbrIUlJRnJL9L0YifTQCgU3p/aH4I7fnWaCIajwMMszCl5A7Aj+TWctGuMT6qG4QtbGodBj9oAyjpke3LSDYXCXq9A8V6GZrsLGcqXlcrneW9elAQgpxdwA3rcUdv4ymdQHtrdvpPvW/LHZ7/8+/gBTWGFPbAkGiAAAAABJRU5ErkJggg==";


    TRACK_DISTANCE_ROTATE2 = 18;
}


function COverlay()
{
    this.m_oControl = null;
    this.m_oContext = null;

    this.min_x = 0xFFFF;
    this.min_y = 0xFFFF;
    this.max_x = -0xFFFF;
    this.max_y = -0xFFFF;

    this.m_bIsShow = false;
    this.m_bIsAlwaysUpdateOverlay = false;

    this.m_oHtmlPage = null;

    this.DashLineColor = "#000000";
    this.ClearAll = false;

    this.IsRetina = false;
}

COverlay.prototype =
{
    init : function(context, controlName, x, y, w_pix, h_pix, w_mm, h_mm)
    {
        this.m_oContext = context;
        //this.m_oControl = AscCommon.CreateControl(controlName);

        //this.m_oHtmlPage = new AscCommon.CHtmlPage();
        //this.m_oHtmlPage.init(x, y, w_pix, h_pix, w_mm, h_mm);
    },

    Clear : function()
    {
//        if (null == this.m_oContext)
//        {
//            this.m_oContext = this.m_oControl.HtmlElement.getContext('2d');
//
//            this.m_oContext.imageSmoothingEnabled = false;
//            this.m_oContext.mozImageSmoothingEnabled = false;
//            this.m_oContext.oImageSmoothingEnabled = false;
//            this.m_oContext.webkitImageSmoothingEnabled = false;
//        }
//
//        this.SetBaseTransform();
//
//        this.m_oContext.beginPath();
//        if (this.max_x != -0xFFFF && this.max_y != -0xFFFF)
//        {
//            if (this.ClearAll === true)
//            {
//                this.m_oContext.clearRect(0, 0, this.m_oControl.HtmlElement.width, this.m_oControl.HtmlElement.height);
//                this.ClearAll = false;
//            }
//            else
//            {
//                var _eps = 5;
//                this.m_oContext.clearRect(this.min_x - _eps, this.min_y - _eps, this.max_x - this.min_x + 2*_eps, this.max_y - this.min_y + 2*_eps);
//            }
//        }
        this.min_x = 0xFFFF;
        this.min_y = 0xFFFF;
        this.max_x = -0xFFFF;
        this.max_y = -0xFFFF;
    },

    GetImageTrackRotationImage : function()
    {
        return this.IsRetina ? window.g_track_rotate_marker2 : window.g_track_rotate_marker;
    },

    SetTransform : function(sx, shy, shx, sy, tx, ty)
    {
        this.SetBaseTransform();
        this.m_oContext.setTransform(sx, shy, shx, sy, tx, ty);

    },

    SetBaseTransform : function()
    {
        if (this.IsRetina)
            this.m_oContext.setTransform(2, 0, 0, 2, 0, 0);
        else
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
    },

    Show : function()
    {
        if (this.m_bIsShow)
            return;

        this.m_bIsShow = true;
        //this.m_oControl.HtmlElement.style.display = "block";
    },
    UnShow : function()
    {
        if (!this.m_bIsShow)
            return;

        this.m_bIsShow = false;
        //this.m_oControl.HtmlElement.style.display = "none";
    },

    VertLine : function(position, bIsSimpleAdd)
    {
        if (bIsSimpleAdd !== true)
        {
            this.Clear();
            if (this.m_bIsAlwaysUpdateOverlay || true/*мало ли что есть на оверлее*/)
            {
                //if (!editor.WordControl.OnUpdateOverlay())
                {
                //    editor.WordControl.EndUpdateOverlay();
                }
            }
        }

        if (this.min_x > position)
            this.min_x = position;
        if (this.max_x < position)
            this.max_x = position;

        //this.min_x = position;
        //this.max_x = position;
        this.min_y = 0;
        this.max_y = this.m_oControl.HtmlElement.height;

        this.m_oContext.lineWidth = 1;

        var x = ((position + 0.5) >> 0) + 0.5;
        var y = 0;

        this.m_oContext.strokeStyle = this.DashLineColor;
        this.m_oContext.beginPath();

        while (y < this.max_y)
        {
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y+=1;
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y+=1;
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y++;

            y += 5;
        }

        this.m_oContext.stroke();

        y = 1;
        this.m_oContext.strokeStyle = "#FFFFFF";
        this.m_oContext.beginPath();

        while (y < this.max_y)
        {
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y+=1;
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y+=1;
            this.m_oContext.moveTo(x, y); y++;
            this.m_oContext.lineTo(x, y); y++;

            y += 5;
        }

        this.m_oContext.stroke();
        this.Show();
    },

    VertLine2 : function(position)
    {
        if (this.min_x > position)
            this.min_x = position;
        if (this.max_x < position)
            this.max_x = position;

        var _old_global = this.m_oContext.globalAlpha;
        this.m_oContext.globalAlpha = 1;

        this.min_y = 0;
        this.max_y = this.m_oControl.HtmlElement.height;

        this.m_oContext.lineWidth = 1;

        var x = ((position + 0.5) >> 0) + 0.5;
        var y = 0;

        /*
         this.m_oContext.strokeStyle = "#FFFFFF";
         this.m_oContext.beginPath();
         this.m_oContext.moveTo(x, y);
         this.m_oContext.lineTo(x, this.max_y);
         this.m_oContext.stroke();
         */

        this.m_oContext.strokeStyle = this.DashLineColor;
        this.m_oContext.beginPath();

        var dist = 1;

        while (y < this.max_y)
        {
            this.m_oContext.moveTo(x, y);
            y += dist;
            this.m_oContext.lineTo(x, y);
            y += dist;
        }

        this.m_oContext.stroke();
        this.m_oContext.beginPath();
        this.Show();

        this.m_oContext.globalAlpha = _old_global;
    },

    HorLine : function(position, bIsSimpleAdd)
    {
        if (bIsSimpleAdd !== true)
        {
            this.Clear();
            if (this.m_bIsAlwaysUpdateOverlay || true/*мало ли что есть на оверлее*/)
            {
            //    if (!editor.WordControl.OnUpdateOverlay())
                {
            //        editor.WordControl.EndUpdateOverlay();
                }
            }
        }

        this.min_x = 0;
        this.max_x = this.m_oControl.HtmlElement.width;

        if (this.min_y > position)
            this.min_y = position;
        if (this.max_y < position)
            this.max_y = position;

        this.m_oContext.lineWidth = 1;

        var y = ((position + 0.5) >> 0) + 0.5;
        var x = 0;

        this.m_oContext.strokeStyle = this.DashLineColor;
        this.m_oContext.beginPath();

        while (x < this.max_x)
        {
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x+=1;
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x+=1;
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x++;

            x += 5;
        }

        this.m_oContext.stroke();

        x = 1;
        this.m_oContext.strokeStyle = "#FFFFFF";
        this.m_oContext.beginPath();

        while (x < this.max_x)
        {
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x+=1;
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x+=1;
            this.m_oContext.moveTo(x, y); x++;
            this.m_oContext.lineTo(x, y); x++;

            x += 5;
        }

        this.m_oContext.stroke();
        this.Show();
    },

    HorLine2 : function(position)
    {
        if (this.min_y > position)
            this.min_y = position;
        if (this.max_y < position)
            this.max_y = position;

        var _old_global = this.m_oContext.globalAlpha;
        this.m_oContext.globalAlpha = 1;

        this.min_x = 0;
        this.max_x = this.m_oControl.HtmlElement.width;

        this.m_oContext.lineWidth = 1;

        var y = ((position + 0.5) >> 0) + 0.5;
        var x = 0;

        /*
         this.m_oContext.strokeStyle = "#FFFFFF";
         this.m_oContext.beginPath();
         this.m_oContext.moveTo(x, y);
         this.m_oContext.lineTo(this.max_x, y);
         this.m_oContext.stroke();
         */

        this.m_oContext.strokeStyle = this.DashLineColor;
        this.m_oContext.beginPath();

        var dist = 1;

        while (x < this.max_x)
        {
            this.m_oContext.moveTo(x, y);
            x += dist;
            this.m_oContext.lineTo(x, y);
            x += dist;
        }

        this.m_oContext.stroke();
        this.m_oContext.beginPath();
        this.Show();

        this.m_oContext.globalAlpha = _old_global;
    },

    CheckPoint1 : function(x,y)
    {
        if (x < this.min_x)
            this.min_x = x;
        if (y < this.min_y)
            this.min_y = y;
    },
    CheckPoint2 : function(x,y)
    {
        if (x > this.max_x)
            this.max_x = x;
        if (y > this.max_y)
            this.max_y = y;
    },
    CheckPoint : function(x,y)
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

    AddRect2 : function(x,y,r)
    {
        var _x = x - ((r / 2) >> 0);
        var _y = y - ((r / 2) >> 0);
        this.CheckPoint1(_x,_y);
        this.CheckPoint2(_x+r,_y+r);

        this.m_oContext.moveTo(_x,_y);
        this.m_oContext.rect(_x,_y,r,r);
    },

    AddRect3 : function(x,y,r, ex1, ey1, ex2, ey2)
    {
        var _r = r / 2;

        var x1 = x + _r * (ex2 - ex1);
        var y1 = y + _r * (ey2 - ey1);

        var x2 = x + _r * (ex2 + ex1);
        var y2 = y + _r * (ey2 + ey1);

        var x3 = x + _r * (-ex2 + ex1);
        var y3 = y + _r * (-ey2 + ey1);

        var x4 = x + _r * (-ex2 - ex1);
        var y4 = y + _r * (-ey2 - ey1);

        this.CheckPoint(x1,y1);
        this.CheckPoint(x2,y2);
        this.CheckPoint(x3,y3);
        this.CheckPoint(x4,y4);

        var ctx = this.m_oContext;
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
    },

    AddRect : function(x,y,w,h)
    {
        this.CheckPoint1(x,y);
        this.CheckPoint2(x + w,y + h);

        this.m_oContext.moveTo(x,y);
        this.m_oContext.rect(x,y,w,h);
        //this.m_oContext.closePath();
    },
    CheckRectT : function(x,y,w,h,trans,eps)
    {
        var x1 = trans.TransformPointX(x, y);
        var y1 = trans.TransformPointY(x, y);

        var x2 = trans.TransformPointX(x+w, y);
        var y2 = trans.TransformPointY(x+w, y);

        var x3 = trans.TransformPointX(x+w, y+h);
        var y3 = trans.TransformPointY(x+w, y+h);

        var x4 = trans.TransformPointX(x, y+h);
        var y4 = trans.TransformPointY(x, y+h);

        this.CheckPoint(x1, y1);
        this.CheckPoint(x2, y2);
        this.CheckPoint(x3, y3);
        this.CheckPoint(x4, y4);

        if (eps !== undefined)
        {
            this.min_x -= eps;
            this.min_y -= eps;
            this.max_x += eps;
            this.max_y += eps;
        }
    },
    CheckRect : function(x,y,w,h)
    {
        this.CheckPoint1(x,y);
        this.CheckPoint2(x + w,y + h);
    },
    AddEllipse : function(x,y,r)
    {
        this.CheckPoint1(x-r,y-r);
        this.CheckPoint2(x+r,y+r);

        this.m_oContext.moveTo(x+r,y);
        this.m_oContext.arc(x,y,r,0,Math.PI*2,false);
        //this.m_oContext.closePath();
    },

    AddRoundRect : function(x, y, w, h, r)
    {
        if (w < (2 * r) || h < (2 * r))
            return this.AddRect(x, y, w, h);

        this.CheckPoint1(x,y);
        this.CheckPoint2(x + w,y + h);

        var _ctx = this.m_oContext;
//        _ctx.moveTo(x + r, y);
//        _ctx.lineTo(x + w - r, y);
//        _ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//        _ctx.lineTo(x + w, y + h - r);
//        _ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//        _ctx.lineTo(x + r, y + h);
//        _ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//        _ctx.lineTo(x, y + r);
//        _ctx.quadraticCurveTo(x, y, x + r, y);
    },

    AddRoundRectCtx : function(ctx, x, y, w, h, r)
    {
        if (w < (2 * r) || h < (2 * r))
            return ctx.rect(x, y, w, h);

        var _ctx = this.m_oContext;
//        _ctx.moveTo(x + r, y);
//        _ctx.lineTo(x + w - r, y);
//        _ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//        _ctx.lineTo(x + w, y + h - r);
//        _ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//        _ctx.lineTo(x + r, y + h);
//        _ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//        _ctx.lineTo(x, y + r);
//        _ctx.quadraticCurveTo(x, y, x + r, y);
    }
};

function CAutoshapeTrack()
{
    this.IsTrack            = true;

    this.PageIndex          = -1;
    this.CurrentPageInfo    = null;

    this.Native = window["native"]["CreateAutoShapesTrackControl"]();
}

CAutoshapeTrack.prototype =
{
    SetFont : function(font)
    {
    },
    init2 : function()
    {
    },
    
    CorrectOverlayBounds : function()
    {
        this.Native["DD_CorrectOverlayBounds"]();
    },

    SetCurrentPage : function(nPageIndex)
    {
        //if (nPageIndex == this.PageIndex)
        //    return;

        this.PageIndex = nPageIndex;
        this.Native["DD_SetCurrentPage"](nPageIndex);
    },
    
    SetPageIndexSimple : function(nPageIndex)
    {
        this.Native["DD_SetPageIndexSimple"](nPageIndex);
    },
    
    transform3 : function(m)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty);
    },
    
    reset : function()
    {
        this.Native["PD_reset"]();
    },

    /*************************************************************************/
    /******************************** TRACKS *********************************/
    /*************************************************************************/
    DrawTrack : function(type, matrix, left, top, width, height, isLine, isCanRotate)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawTrack"](type, left, top, width, height, isLine, isCanRotate);
    },

    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.Native["DD_DrawTrackSelectShapes"](x, y, w, h);
    },

    DrawAdjustment : function(matrix, x, y)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawAdjustment"](x, y);
    },

    DrawEditWrapPointsPolygon : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsPolygon"](points);
    },

    DrawEditWrapPointsTrackLines : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsTrackLines"](points);
    },

    DrawInlineMoveCursor : function(x, y, h, m)
    {
        if (!m)
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h);
        }
        else
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h, m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
        }
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["PD_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    },
    
    // repeat drawing interface
    put_GlobalAlpha : function(enable, alpha)
    {
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
        this.Native["PD_p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.Native["PD_p_width"](w);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        this.Native["PD_b_color1"](r,g,b,a);
    },
    b_color2 : function(r,g,b,a)
    {
        this.Native["PD_b_color2"](r,g,b,a);
    },

    transform : function(sx,shy,shx,sy,tx,ty)
    {
        this.Native["PD_transform"](sx,shy,shx,sy,tx,ty);
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
        this.Native["PD_PathMoveTo"](x,y);
    },
    _l : function(x,y)
    {
        this.Native["PD_PathLineTo"](x,y);
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        this.Native["PD_PathCurveTo"](x1,y1,x2,y2,x3,y3);
    },
    _c2 : function(x1,y1,x2,y2)
    {
        this.Native["PD_PathCurveTo2"](x1,y1,x2,y2);
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
        this.Native["PD_reset"]();
    },

    transform3 : function(m, isNeedInvert)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty,isNeedInvert);
    },

    FreeFont : function()
    {
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
    },
    font : function(font_id,font_size)
    {
    },
    SetFont : function(font)
    {
    },

    SetTextPr : function(textPr, theme)
    {
    },
    GetTextPr : function()
    {
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
    },

    FillText : function(x,y,text)
    {
    },
    t : function(text,x,y)
    {
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
    },
    t2 : function(text,x,y,cropX,cropW)
    {
    },
    FillTextCode : function(x,y,lUnicode)
    {
    },
    tg : function(text,x,y)
    {
    },
    charspace : function(space)
    {
    },

    SetIntegerGrid : function(param)
    {
        //this.Native["PD_SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        //return this.m_bIntegerGrid;
        return false;
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

    }
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].COverlay = COverlay;
window['AscCommon'].TRACK_CIRCLE_RADIUS = TRACK_CIRCLE_RADIUS;
window['AscCommon'].TRACK_DISTANCE_ROTATE = TRACK_DISTANCE_ROTATE;
window['AscCommon'].CAutoshapeTrack = CAutoshapeTrack;
