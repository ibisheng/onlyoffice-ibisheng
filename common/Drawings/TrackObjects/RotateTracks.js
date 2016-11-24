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

(function(window, undefined){

// Import
var CMatrix = AscCommon.CMatrix;
var global_MatrixTransformer = AscCommon.global_MatrixTransformer;
    
var c_oAscFill = Asc.c_oAscFill;

var MIN_ANGLE = 0.07;


function OverlayObject(geometry, extX, extY, brush, pen, transform )
{
    this.geometry = geometry;
    this.ext = {};
    this.ext.cx = extX;
    this.ext.cy = extY;
    this.extX = extX;
    this.extY = extY;

    var _brush, _pen;
    if((!brush || !brush.fill || brush.fill.type === c_oAscFill.FILL_TYPE_NOFILL) &&
        (!pen || !pen.Fill || !pen.Fill || !pen.Fill.fill || pen.Fill.fill.type === c_oAscFill.FILL_TYPE_NOFILL || pen.w === 0))
    {
        var penBrush = AscFormat.CreatePenBrushForChartTrack();
        _brush = penBrush.brush;
        _pen = penBrush.pen;
    }
    else
    {
        _brush = brush;
        _pen = pen;
    }

    this.brush = _brush;
    this.pen = _pen;
    this.TransformMatrix = transform;
    this.shapeDrawer = new AscCommon.CShapeDrawer();

    this.updateTransform = function(extX, extY, transform)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.extX = extX;
        this.extY = extY;
        this.transform = transform;
    };

    this.updateExtents = function(extX, extY)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.extX = extX;
        this.extY = extY;
        this.geometry && this.geometry.Recalculate(extX, extY);
    };

    this.updateTransformMatrix = function(transform)
    {
        this.TransformMatrix = transform;
    };


    this.draw = function(overlay, transform)
    {
        var oldTransform = this.TransformMatrix;
        if(transform)
        {
            this.updateTransformMatrix(transform);
        }
        if(this.checkDrawGeometry())
        {
            overlay.SaveGrState();
            overlay.SetIntegerGrid(false);
            overlay.transform3(this.TransformMatrix, false);
            this.shapeDrawer.fromShape2(this, overlay, this.geometry);
            this.shapeDrawer.draw(this.geometry);
            overlay.RestoreGrState();
        }
        else
        {
            if (window["NATIVE_EDITOR_ENJINE"] === true)
            {
                var _shape = new AscFormat.CShape();
				_shape.extX = this.ext.cx;
				_shape.extY = this.ext.cy;
				
				_shape.brush = AscFormat.CreateSolidFillRGBA(255, 255, 255, 128);
				_shape.pen = new AscFormat.CLn();
				_shape.pen.Fill = AscFormat.CreateSolidFillRGBA(0, 0, 0, 160);
				_shape.pen.w = 18000;
				
				overlay.SaveGrState();
	            overlay.SetIntegerGrid(false);
	            overlay.transform3(this.TransformMatrix, false);
	            this.shapeDrawer.fromShape2(_shape, overlay, null);
	            this.shapeDrawer.draw(null);
	            overlay.RestoreGrState();
            }
            else
            {
                overlay.SaveGrState();
                overlay.SetIntegerGrid(false);
                overlay.transform3(this.TransformMatrix);
                overlay._s();
                overlay._m(0, 0);
                overlay._l(this.ext.cx, 0);
                overlay._l(this.ext.cx, this.ext.cy);
                overlay._l(0, this.ext.cy);
                overlay._z();
                overlay.p_color(0,0,0,160);
                overlay.p_width(500);
                overlay.ds();
                overlay.b_color1(255,255,255,128);
                overlay.df();
                overlay._e();
                overlay.RestoreGrState();
				
				if (overlay.m_oOverlay)
					overlay.m_oOverlay.ClearAll = true;
            }
        }
        if(transform)
        {
            this.updateTransformMatrix(oldTransform);
        }
    };

    this.checkDrawGeometry = function()
    {
        return this.geometry &&
            ( (this.pen && this.pen.Fill && this.pen.Fill.fill
                && this.pen.Fill.fill.type != c_oAscFill.FILL_TYPE_NOFILL && this.pen.Fill.fill.type != c_oAscFill.FILL_TYPE_NONE)
                || (this.brush && this.brush.fill && this.brush.fill
                && this.brush.fill.type != c_oAscFill.FILL_TYPE_NOFILL && this.brush.fill.type != c_oAscFill.FILL_TYPE_NONE) )
    }


    this.check_bounds = function(boundsChecker)
    {
        if(this.geometry )
        {
            this.geometry.check_bounds(boundsChecker);
        }
        else
        {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.ext.cx, 0);
            boundsChecker._l(this.ext.cx, this.ext.cy);
            boundsChecker._l(0, this.ext.cy);
            boundsChecker._z();
            boundsChecker._e();
        }
    }
}

function ObjectToDraw(brush, pen, extX, extY, geometry, transform, x, y, oComment)
{
    this.extX = extX;
    this.extY = extY;
    this.transform = transform;
    this.TransformMatrix = transform;
    this.geometry = geometry;
    this.parentShape = null;
    this.Comment = oComment;
    this.pen = pen;
    this.brush = brush;

    /*������� �������*/
    this.x = x;
    this.y = y;
}
ObjectToDraw.prototype =
{
    check_bounds: function(boundsChecker)
    {
        if(this.geometry)
        {
            this.geometry.check_bounds(boundsChecker);
        }
        else
        {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.extX, 0);
            boundsChecker._l(this.extX, this.extY);
            boundsChecker._l(0, this.extY);
            boundsChecker._z();
            boundsChecker._e();
        }
    },

    resetBrushPen: function(brush, pen, x, y)
    {
        this.brush = brush;
        this.pen = pen;

        if(AscFormat.isRealNumber(x) && AscFormat.isRealNumber(y))
        {
            this.x = x;
            this.y = y;
        }
    },

    Recalculate: function(oTheme, oColorMap, dWidth, dHeight, oShape, bResetPathsInfo)
    {
       // if(AscFormat.isRealNumber(this.x) && AscFormat.isRealNumber(this.y))
       // {
       //     if(Math.abs(dWidth - this.extX) > MOVE_DELTA || Math.abs(dHeight - this.extY))
       //     {
       //         this.x*=dWidth/this.extX;
       //         this.y*=dHeight/this.extY;
       //     }
       // }
        if(this.brush)
        {
            this.brush.check(oTheme, oColorMap);
        }
        if(this.pen && this.pen.Fill)
        {
            this.pen.Fill.check(oTheme, oColorMap);
        }
        if(this.geometry)
        {
            this.geometry.Recalculate(dWidth, dHeight, bResetPathsInfo);
        }
        this.parentShape = oShape;
    },

    getTransform: function(oTransformMatrix, bNoParentShapeTransform)
    {

        var oTransform;
        if(oTransformMatrix)
        {
            oTransform = oTransformMatrix;
        }
        else
        {
            if(this.parentShape && !(bNoParentShapeTransform === true))
            {
                oTransform = this.parentShape.transformText;
            }
            else
            {
                oTransform = this.TransformMatrix;
            }
        }
        return oTransform;
    },

    drawComment2: function(graphics, bNoParentShapeTransform, oTransformMatrix)
    {
        var oTransform = this.getTransform(oTransformMatrix, bNoParentShapeTransform);
        this.DrawComment(graphics, oTransform);
    },

    DrawComment : function(graphics, oTransform)
    {
        if(this.Comment)
        {
            var oComment = AscCommon.g_oTableId.Get_ById(this.Comment.Additional.CommentId);
            if(oComment)
            {
                var Para = AscCommon.g_oTableId.Get_ById( oComment.StartId );
                if( editor && editor.WordControl && editor.WordControl.m_oLogicDocument && editor.WordControl.m_oLogicDocument.Comments &&
                    (graphics instanceof AscCommon.CGraphics) && ( editor.WordControl.m_oLogicDocument.Comments.Is_Use() && true != editor.isViewMode))
                {
                    if(this.Comment.Additional.CommentId === editor.WordControl.m_oLogicDocument.Comments.Get_CurrentId())
                    {
                        this.brush = AscFormat.G_O_ACTIVE_COMMENT_BRUSH;
                    }
                    else
                    {
                        this.brush = AscFormat.G_O_NO_ACTIVE_COMMENT_BRUSH;
                    }
                    var oComm = this.Comment;
                    Para && editor.WordControl.m_oLogicDocument.Comments.Add_DrawingRect(oComm.x0, oComm.y0, oComm.x1 - oComm.x0, oComm.y1 - oComm.y0, graphics.PageNum, this.Comment.Additional.CommentId, global_MatrixTransformer.Invert(oTransform));
                }
            }
        }
    },

    draw: function(graphics, bNoParentShapeTransform, oTransformMatrix, oTheme, oColorMap)
    {
        var oTransform = this.getTransform(oTransformMatrix, bNoParentShapeTransform);
        this.DrawComment(graphics, oTransform);
        if(oTheme && oColorMap)
        {
            if(this.brush)
            {
                this.brush.check(oTheme, oColorMap);
            }
            if(this.pen && this.pen.Fill)
            {
                this.pen.Fill.check(oTheme, oColorMap);
            }
        }
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(oTransform, false);
        var shape_drawer = new AscCommon.CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.geometry);
        if(graphics.IsSlideBoundsCheckerType)
        {
            shape_drawer.bIsNoFillAttack = false;
        }
        shape_drawer.draw(this.geometry);
        graphics.RestoreGrState();
    },

    createDuplicate: function()
    {
    }
};
function RotateTrackShapeImage(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    var brush;
    if(originalObject.blipFill)
    {
        brush = new AscFormat.CUniFill();
        brush.fill = originalObject.blipFill;
    }
    else
    {
        brush = originalObject.brush;
    }
    this.overlayObject = new OverlayObject(originalObject.spPr.geometry, originalObject.extX, originalObject.extY, brush, originalObject.pen, this.transform);

    this.angle = originalObject.rot;
    var full_flip_h = this.originalObject.getFullFlipH();
    var full_flip_v = this.originalObject.getFullFlipV();
    this.signum = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v ? 1 : -1;
    this.draw = function(overlay, transform)
    {
        if(AscFormat.isRealNumber(this.originalObject.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalObject.selectStartPage);
        }
        this.overlayObject.draw(overlay, transform);
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.ShiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        if(this.originalObject.group)
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.originalObject.group.transform);
        }
        if(this.originalObject.parent)
        {
            var parent_transform = this.originalObject.parent.Get_ParentTextTransform && this.originalObject.parent.Get_ParentTextTransform();
            if(parent_transform)
            {
                global_MatrixTransformer.MultiplyAppend(this.transform, parent_transform);
            }
        }

    };

    this.trackEnd = function()
    {
        AscFormat.CheckSpPrXfrm(this.originalObject);
        this.originalObject.spPr.xfrm.setRot(this.angle);
    };

    this.getBounds = function()
    {
        var boundsChecker = new  AscFormat.CSlideBoundsChecker();
        var tr = null;
        if(this.originalObject && this.originalObject.parent)
        {
            var parent_transform = this.originalObject.parent.Get_ParentTextTransform && this.originalObject.parent.Get_ParentTextTransform();
            if(parent_transform)
            {
                tr = this.transform.CreateDublicate();
                global_MatrixTransformer.MultiplyAppend(tr, global_MatrixTransformer.Invert(parent_transform));
            }

        }
        this.draw(boundsChecker, tr ? tr : null);
        tr = this.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,this.originalObject.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalObject.extY));

        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);

        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);

        boundsChecker.Bounds.posX = this.originalObject.x;
        boundsChecker.Bounds.posY = this.originalObject.y;
        boundsChecker.Bounds.extX = this.originalObject.extX;
        boundsChecker.Bounds.extY = this.originalObject.extY;
        return boundsChecker.Bounds;
    }
}

function RotateTrackGroup(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();

    this.overlayObjects = [];


    this.arrTransforms = [];
    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.getInvertTransform();
    for(var i = 0; i < arr_graphic_objects.length; ++i)
    {
        var gr_obj_transform_copy = arr_graphic_objects[i].getTransformMatrix().CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY,
            arr_graphic_objects[i].brush,  arr_graphic_objects[i].pen, new CMatrix());
    }


    this.angle = originalObject.rot;

    this.draw = function(overlay)
    {
        if(AscFormat.isRealNumber(this.originalObject.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalObject.selectStartPage);
        }
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            this.overlayObjects[i].draw(overlay);
        }
    };

    this.getBounds = function()
    {
        var boundsChecker = new  AscFormat.CSlideBoundsChecker();
        this.draw(boundsChecker);
        var tr = this.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,this.originalObject.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalObject.extY));

        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);

        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
        boundsChecker.Bounds.posX = this.originalObject.x;
        boundsChecker.Bounds.posY = this.originalObject.y;
        boundsChecker.Bounds.extX = this.originalObject.extX;
        boundsChecker.Bounds.extY = this.originalObject.extY;
        return boundsChecker.Bounds;
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.ShiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };

    this.trackEnd = function()
    {
        AscFormat.CheckSpPrXfrm(this.originalObject);
        this.originalObject.spPr.xfrm.setRot(this.angle);
    }
}

function Chart3dAdjustTrack(oChartSpace, numHandle, startX, startY)
{
    this.chartSpace = oChartSpace;
    this.numHandle = numHandle;


    this.originalObject = oChartSpace;
    this.originalShape = oChartSpace;

    this.transform = this.originalObject.transform;
    this.processor3D = oChartSpace.chartObj.processor3D;
    this.depthPerspective = oChartSpace.chartObj.processor3D.depthPerspective;

    this.startX = oChartSpace.invertTransform.TransformPointX(startX, startY);
    this.startY = oChartSpace.invertTransform.TransformPointY(startX, startY);

    AscFormat.ExecuteNoHistory(function(){
        this.view3D = oChartSpace.chart.view3D.createDuplicate();
        this.chartSizes = this.chartSpace.getChartSizes();

        this.cX = this.chartSizes.startX + this.chartSizes.w/2;
        this.cY = this.chartSizes.startY + this.chartSizes.h/2;
        this.geometry = new AscFormat.Geometry();
        var oPen = new AscFormat.CLn();
        oPen.w = 15000;
        oPen.Fill = AscFormat.CreateSolidFillRGBA(255, 255, 255, 255);
        this.objectToDraw = new OverlayObject(this.geometry, oChartSpace.extX, oChartSpace.extY, null, oPen, oChartSpace.transform );

        var oPen2 = new AscFormat.CLn();
        oPen2.w = 15000;
        oPen2.Fill = AscFormat.CreateSolidFillRGBA(0x61, 0x9e, 0xde, 255);
        oPen2.prstDash = 0;
        this.objectToDraw2 = new OverlayObject(this.geometry, oChartSpace.extX, oChartSpace.extY, null, oPen2, oChartSpace.transform );


        var pxToMM = this.chartSpace.chartObj.calcProp.pxToMM;
        var oChSz = this.chartSizes;
        this.centerPoint = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w/2)*pxToMM, (oChSz.startY + oChSz.h/2)*pxToMM, this.depthPerspective/2);
    }, this, []);


    this.draw = function(overlay, transform)
    {
        if(AscFormat.isRealNumber(this.chartSpace.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.chartSpace.selectStartPage);
        }
        var dOldAlpha = null;
        var oGraphics = overlay.Graphics ? overlay.Graphics : overlay;
        if(AscFormat.isRealNumber(oGraphics.globalAlpha) && oGraphics.put_GlobalAlpha){
            dOldAlpha = oGraphics.globalAlpha;
            oGraphics.put_GlobalAlpha(false, 1);
        }
        this.objectToDraw.draw(overlay, transform);
        this.objectToDraw2.draw(overlay, transform);
        if(AscFormat.isRealNumber(dOldAlpha) && oGraphics.put_GlobalAlpha){
            oGraphics.put_GlobalAlpha(true, dOldAlpha);
        }
    };


    this.calculateGeometry = function()
    {
        AscFormat.ExecuteNoHistory(function(){

            this.geometry.pathLst.length = 0;
            var path = new AscFormat.Path();
            path.pathW = this.chartSpace.extX;
            path.pathH = this.chartSpace.extY;
            path.stroke  = true;
            var pxToMM = this.chartSpace.chartObj.calcProp.pxToMM;
            this.geometry.pathLst.push(path);
            var oChSz = this.chartSizes;

            var centerPoint2 = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w/2)*pxToMM, (oChSz.startY + oChSz.h/2)*pxToMM, this.depthPerspective/2);

            var deltaX = (this.centerPoint.x - centerPoint2.x)/pxToMM;
            var deltaY = (this.centerPoint.y - centerPoint2.y)/pxToMM;

            var point1 = this.processor3D.convertAndTurnPoint(oChSz.startX*pxToMM, oChSz.startY*pxToMM, 0);
            path.moveTo(point1.x/pxToMM + deltaX, point1.y/pxToMM + deltaY);
            var point2 = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w) *pxToMM, oChSz.startY*pxToMM, 0);
            path.lnTo(point2.x/pxToMM + deltaX, point2.y/pxToMM + deltaY);
            var point3 = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w)*pxToMM, (oChSz.startY + oChSz.h)*pxToMM, 0);
            path.lnTo(point3.x/pxToMM + deltaX, point3.y/pxToMM + deltaY);
            var point4 = this.processor3D.convertAndTurnPoint((oChSz.startX)*pxToMM, (oChSz.startY + oChSz.h)*pxToMM, 0);
            path.lnTo(point4.x/pxToMM + deltaX, point4.y/pxToMM + deltaY);
            path.close();

            var point1d = this.processor3D.convertAndTurnPoint(oChSz.startX*pxToMM, oChSz.startY*pxToMM, this.depthPerspective);
            path.moveTo(point1d.x/pxToMM + deltaX, point1d.y/pxToMM + deltaY);
            var point2d = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w) *pxToMM, oChSz.startY*pxToMM, this.depthPerspective);
            path.lnTo(point2d.x/pxToMM + deltaX, point2d.y/pxToMM + deltaY);
            var point3d = this.processor3D.convertAndTurnPoint((oChSz.startX + oChSz.w)*pxToMM, (oChSz.startY + oChSz.h)*pxToMM, this.depthPerspective);
            path.lnTo(point3d.x/pxToMM + deltaX, point3d.y/pxToMM + deltaY);
            var point4d = this.processor3D.convertAndTurnPoint((oChSz.startX)*pxToMM, (oChSz.startY + oChSz.h)*pxToMM, this.depthPerspective);
            path.lnTo(point4d.x/pxToMM + deltaX, point4d.y/pxToMM + deltaY);
            path.close();

            path.moveTo(point1.x/pxToMM + deltaX, point1.y/pxToMM + deltaY);
            path.lnTo(point1d.x/pxToMM + deltaX, point1d.y/pxToMM + deltaY);
            path.moveTo(point2.x/pxToMM + deltaX, point2.y/pxToMM + deltaY);
            path.lnTo(point2d.x/pxToMM + deltaX, point2d.y/pxToMM + deltaY);
            path.moveTo(point3.x/pxToMM + deltaX, point3.y/pxToMM + deltaY);
            path.lnTo(point3d.x/pxToMM + deltaX, point3d.y/pxToMM + deltaY);
            path.moveTo(point4.x/pxToMM + deltaX, point4.y/pxToMM + deltaY);
            path.lnTo(point4d.x/pxToMM + deltaX, point4d.y/pxToMM + deltaY);

            this.geometry.Recalculate(this.chartSpace.extX, this.chartSpace.extY);
        }, this, []);

    };

    this.getBounds = function()
    {
        var boundsChecker = new  AscFormat.CSlideBoundsChecker();
        this.draw(boundsChecker);
        var tr = this.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,this.originalObject.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalObject.extY));

        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);

        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
        boundsChecker.Bounds.posX = this.originalObject.x;
        boundsChecker.Bounds.posY = this.originalObject.y;
        boundsChecker.Bounds.extX = this.originalObject.extX;
        boundsChecker.Bounds.extY = this.originalObject.extY;
        return boundsChecker.Bounds;
    };

    this.track = function(x, y)
    {

        var tx = this.chartSpace.invertTransform.TransformPointX(x, y);
        var ty = this.chartSpace.invertTransform.TransformPointY(x, y);
        var deltaAng = 0;
        var StratRotY = oChartSpace.chart.view3D && oChartSpace.chart.view3D.rotY ? oChartSpace.chart.view3D.rotY : 0;
        deltaAng = -90*(tx - this.startX)/(this.chartSizes.w/2);
        this.view3D.rotY = StratRotY + deltaAng;
        if(this.view3D.rotY < 0){
            this.view3D.rotY = 0;
        }
        if(this.view3D.rotY >= 360){
            this.view3D.rotY = 359;
        }

        var StratRotX = oChartSpace.chart.view3D && oChartSpace.chart.view3D.rotX ? oChartSpace.chart.view3D.rotX : 0;
        deltaAng = 90*(ty - this.startY)/(this.chartSizes.h/2);
        this.view3D.rotX = StratRotX + deltaAng;

		if(oChartSpace.chart.plotArea && oChartSpace.chart.plotArea.chart && oChartSpace.chart.plotArea.chart.getObjectType() === AscDFH.historyitem_type_PieChart){
			if(this.view3D.rotX < 0){
                this.view3D.rotX = 0;
            }
		}
		
        if(this.view3D.rotX < -90){
            this.view3D.rotX = -90;
        }

        if(this.view3D.rotX > 90){
            this.view3D.rotX = 90;
        }

        this.processor3D.angleOx = this.view3D && this.view3D.rotX ? (- this.view3D.rotX / 360) * (Math.PI * 2) : 0;
        this.processor3D.angleOy = this.view3D && this.view3D.rotY ? (- this.view3D.rotY / 360) * (Math.PI * 2) : 0;
        this.processor3D.angleOz = 0;

      //  this.processor3D.view3D = this.view3D;
    //    this.processor3D.calaculate3DProperties();
        //this.processor3D.view3D = oChartSpace.chart.view3D;

        this.calculateGeometry();
    };

    this.trackEnd = function()
    {
        oChartSpace.chart.setView3D(this.view3D.createDuplicate());
        oChartSpace.setRecalculateInfo();
    }
}

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].OverlayObject = OverlayObject;
    window['AscFormat'].ObjectToDraw = ObjectToDraw;
    window['AscFormat'].RotateTrackShapeImage = RotateTrackShapeImage;
    window['AscFormat'].RotateTrackGroup = RotateTrackGroup;
    window['AscFormat'].Chart3dAdjustTrack = Chart3dAdjustTrack;
})(window);