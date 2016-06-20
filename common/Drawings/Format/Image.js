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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Import
var CShape = AscFormat.CShape;
var History = AscCommon.History;
var global_MatrixTransformer = AscCommon.global_MatrixTransformer;

var isRealObject = AscCommon.isRealObject;

function CImageShape()
{
    CImageShape.superclass.constructor.call(this);
    this.nvPicPr  = null;
    this.blipFill = null;
    this.style    = null;



    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add( this, this.Id );
}
AscCommon.extendClass(CImageShape, AscFormat.CGraphicObjectBase);

CImageShape.prototype.getObjectType = function()
{
    return AscDFH.historyitem_type_ImageShape;
};

CImageShape.prototype.setBDeleted = function(pr)
{
    History.Add(this, {Type: AscDFH.historyitem_ShapeSetBDeleted, oldPr: this.bDeleted, newPr: pr});
    this.bDeleted = pr;
};

CImageShape.prototype.setNvPicPr = function(pr)
{
    History.Add(this, {Type:AscDFH.historyitem_ImageShapeSetNvPicPr, oldPr: this.nvPicPr, newPr: pr});
    this.nvPicPr = pr;
};

CImageShape.prototype.setSpPr = function(pr)
{
    History.Add(this, {Type:AscDFH.historyitem_ImageShapeSetSpPr, oldPr: this.spPr, newPr: pr});
    this.spPr = pr;
};

CImageShape.prototype.setBlipFill = function(pr)
{
    History.Add(this, {Type:AscDFH.historyitem_ImageShapeSetBlipFill, oldPr: this.blipFill, newPr: pr});
    this.blipFill = pr;
};

CImageShape.prototype.setParent = function(pr)
{
    History.Add(this, {Type: AscDFH.historyitem_ImageShapeSetParent, oldPr: this.parent, newPr: pr});
    this.parent = pr;
};

CImageShape.prototype.setGroup = function(pr)
{
    History.Add(this, {Type: AscDFH.historyitem_ImageShapeSetGroup, oldPr: this.group, newPr: pr});
    this.group = pr;
};

CImageShape.prototype.setStyle = function(pr)
{
    History.Add(this, {Type: AscDFH.historyitem_ImageShapeSetStyle, oldPr: this.style, newPr: pr});
    this.style = pr;
};

CImageShape.prototype.copy = function()
{
    var copy = new CImageShape();

    if(this.nvPicPr)
    {
        copy.setNvPicPr(this.nvPicPr.createDuplicate());
    }
    if(this.spPr)
    {
        copy.setSpPr(this.spPr.createDuplicate());
        copy.spPr.setParent(copy);
    }
    if(this.blipFill)
    {
        copy.setBlipFill(this.blipFill.createDuplicate());
    }
    if(this.style)
    {
        copy.setStyle(this.style.createDuplicate());
    }
    copy.setBDeleted(this.bDeleted);
    if(this.fromSerialize)
    {
        copy.setBFromSerialize(true);
    }
    copy.cachedImage = this.getBase64Img();
    copy.cachedPixH = this.cachedPixH;
    copy.cachedPixW = this.cachedPixW;
    return copy;
};

CImageShape.prototype.getImageUrl = function()
{
    if(isRealObject(this.blipFill))
        return this.blipFill.RasterImageId;
    return null;
};

CImageShape.prototype.getSnapArrays = function(snapX, snapY)
{
    var transform = this.getTransformMatrix();
    snapX.push(transform.tx);
    snapX.push(transform.tx + this.extX*0.5);
    snapX.push(transform.tx + this.extX);
    snapY.push(transform.ty);
    snapY.push(transform.ty + this.extY*0.5);
    snapY.push(transform.ty + this.extY);
};

CImageShape.prototype.checkDrawingBaseCoords = CShape.prototype.checkDrawingBaseCoords;

CImageShape.prototype.setDrawingBaseCoords = CShape.prototype.setDrawingBaseCoords;

CImageShape.prototype.deleteBFromSerialize = CShape.prototype.deleteBFromSerialize;

CImageShape.prototype.setBFromSerialize = CShape.prototype.setBFromSerialize;

CImageShape.prototype.isPlaceholder  = function()
{
    return this.nvPicPr != null && this.nvPicPr.nvPr != undefined && this.nvPicPr.nvPr.ph != undefined;
};

CImageShape.prototype.isEmptyPlaceholder = function ()
{
    return false;
};

CImageShape.prototype.isShape = function()
{
    return false;
};

CImageShape.prototype.isImage = function()
{
    return true;
};

CImageShape.prototype.isChart = function()
{
    return false;
};

CImageShape.prototype.isGroup = function()
{
    return false;
};

CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;

CImageShape.prototype.hitInPath = CShape.prototype.hitInPath;

CImageShape.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;

CImageShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;

CImageShape.prototype.changeSize = CShape.prototype.changeSize;

CImageShape.prototype.getFullFlipH = function()
{
    if(!isRealObject(this.group))
        return this.flipH;
    return this.group.getFullFlipH() ? !this.flipH : this.flipH;
};

CImageShape.prototype.getFullFlipV = function()
{
    if(!isRealObject(this.group))
        return this.flipV;
    return this.group.getFullFlipV() ? !this.flipV : this.flipV;
};

CImageShape.prototype.getAspect = function(num)
{
    var _tmp_x = this.extX != 0 ? this.extX : 0.1;
    var _tmp_y = this.extY != 0 ? this.extY : 0.1;
    return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
};

CImageShape.prototype.getFullRotate = function()
{
    return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
};

CImageShape.prototype.getRectBounds = function()
{
    var transform = this.getTransformMatrix();
    var w = this.extX;
    var h = this.extY;
    var rect_points = [{x:0, y:0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}];
    var min_x, max_x, min_y, max_y;
    min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
    min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
    max_x = min_x;
    max_y = min_y;
    var cur_x, cur_y;
    for(var i = 1; i < 4; ++i)
    {
        cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
        cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
        if(cur_x < min_x)
            min_x = cur_x;
        if(cur_x > max_x)
            max_x = cur_x;

        if(cur_y < min_y)
            min_y = cur_y;
        if(cur_y > max_y)
            max_y = cur_y;
    }
    return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
};

CImageShape.prototype.canRotate = function()
{
    return true;
};

CImageShape.prototype.canResize = function()
{
    return true;//TODO
};

CImageShape.prototype.canMove = function()
{
    return true;//TODO
};

CImageShape.prototype.canGroup = function()
{
    return true;//TODO
};

CImageShape.prototype.canChangeAdjustments = function()
{
    return true;//TODO
};

CImageShape.prototype.createRotateTrack = function()
{
    return new AscFormat.RotateTrackShapeImage(this);
};

CImageShape.prototype.createResizeTrack = function(cardDirection)
{
    return new AscFormat.ResizeTrackShapeImage(this, cardDirection);
};

CImageShape.prototype.createMoveTrack = function()
{
    return new AscFormat.MoveShapeImageTrack(this);
};

CImageShape.prototype.getInvertTransform = function()
{
    if(this.recalcInfo.recalculateTransform)
    {
        this.recalculateTransform();
        this.recalcInfo.recalculateTransform = true;
    }
    return this.invertTransform;
};

CImageShape.prototype.hitInTextRect = function(x, y)
{
    return false;
};

CImageShape.prototype.getBase64Img = CShape.prototype.getBase64Img;

CImageShape.prototype.convertToWord = function(document)
{
    this.setBDeleted(true);
    var oCopy = this.copy();
    oCopy.setBDeleted(false);
    return oCopy;
};

CImageShape.prototype.convertToPPTX = function(drawingDocument, worksheet)
{
    var ret = this.copy();
    ret.setWorksheet(worksheet);
    ret.setParent(null);
    ret.setBDeleted(false);
    return ret;
};

CImageShape.prototype.recalculateBrush = CShape.prototype.recalculateBrush;

CImageShape.prototype.recalculatePen = function()
{
    CShape.prototype.recalculatePen.call(this);
    if(this.pen && AscFormat.isRealNumber(this.pen.w))
    {
        this.pen.w *= 2;
    }
};

CImageShape.prototype.getCompiledLine = CShape.prototype.getCompiledLine;

CImageShape.prototype.getCompiledFill = CShape.prototype.getCompiledFill;

CImageShape.prototype.getCompiledTransparent = CShape.prototype.getCompiledTransparent;

CImageShape.prototype.getAllRasterImages = function(images)
{
    this.blipFill && typeof this.blipFill.RasterImageId === "string" && this.blipFill.RasterImageId.length > 0 && images.push(this.blipFill.RasterImageId);
};

CImageShape.prototype.getHierarchy = function()
{
    if(this.recalcInfo.recalculateShapeHierarchy)
    {
        this.compiledHierarchy.length = 0;
        var hierarchy = this.compiledHierarchy;
        if(this.isPlaceholder())
        {
            var ph_type = this.getPlaceholderType();
            var ph_index = this.getPlaceholderIndex();
            var b_is_single_body = this.getIsSingleBody();
            switch (this.parent.kind)
            {
                case AscFormat.TYPE_KIND.SLIDE:
                {
                    hierarchy.push(this.parent.Layout.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    hierarchy.push(this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    break;
                }

                case AscFormat.TYPE_KIND.LAYOUT:
                {
                    hierarchy.push(this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    break;
                }
            }
        }
        this.recalcInfo.recalculateShapeHierarchy = true;
    }
    return this.compiledHierarchy;
};

CImageShape.prototype.recalculateTransform = function()
{
    this.cachedImage = null;
    if(!isRealObject(this.group))
    {
        if(this.spPr.xfrm.isNotNull())
        {
            var xfrm = this.spPr.xfrm;
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        else
        {
            if(this.isPlaceholder())
            {
                var hierarchy = this.getHierarchy();
                for(var i = 0; i < hierarchy.length; ++i)
                {
                    var hierarchy_sp = hierarchy[i];
                    if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                    {
                        var xfrm = hierarchy_sp.spPr.xfrm;
                        this.x = xfrm.offX;
                        this.y = xfrm.offY;
                        this.extX = xfrm.extX;
                        this.extY = xfrm.extY;
                        this.rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                        this.flipH = xfrm.flipH === true;
                        this.flipV = xfrm.flipV === true;
                        break;
                    }
                }
                if(i === hierarchy.length)
                {
                    this.x = 0;
                    this.y = 0;
                    this.extX = 5;
                    this.extY = 5;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
            else
            {
                this.x = 0;
                this.y = 0;
                this.extX = 5;
                this.extY = 5;
                this.rot = 0;
                this.flipH = false;
                this.flipV = false;
            }
        }
    }
    else
    {
        var xfrm;
        if(this.spPr.xfrm.isNotNull())
        {
            xfrm = this.spPr.xfrm;
        }
        else
        {
            if(this.isPlaceholder())
            {
                var hierarchy = this.getHierarchy();
                for(var i = 0; i < hierarchy.length; ++i)
                {
                    var hierarchy_sp = hierarchy[i];
                    if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                    {
                        xfrm = hierarchy_sp.spPr.xfrm;
                        break;
                    }
                }
                if(i === hierarchy.length)
                {
                    xfrm = new AscFormat.CXfrm();
                    xfrm.offX = 0;
                    xfrm.offX = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            else
            {
                xfrm = new AscFormat.CXfrm();
                xfrm.offX = 0;
                xfrm.offY = 0;
                xfrm.extX = 5;
                xfrm.extY = 5;
            }
        }
        var scale_scale_coefficients = this.group.getResultScaleCoefficients();
        this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
        this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
        this.extX = scale_scale_coefficients.cx*xfrm.extX;
        this.extY = scale_scale_coefficients.cy*xfrm.extY;
        this.rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
        this.flipH = xfrm.flipH === true;
        this.flipV = xfrm.flipV === true;
    }
    this.transform.Reset();
    var hc = this.extX*0.5;
    var vc = this.extY*0.5;
    global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
    if(this.flipH)
        global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
    if(this.flipV)
        global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
    global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
    global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
    if(isRealObject(this.group))
    {
        global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransformMatrix());
    }
    this.invertTransform = global_MatrixTransformer.Invert(this.transform);
   //if(this.drawingBase && !this.group)
   //{
   //    this.drawingBase.setGraphicObjectCoords();
   //}
};

CImageShape.prototype.Refresh_RecalcData = function(data)
{
    switch(data.Type)
    {
        case AscDFH.historyitem_ImageShapeSetBlipFill:
        {
            this.recalcBrush();
            this.recalcFill();
            this.addToRecalculate();
            break;
        }
    }
};

CImageShape.prototype.recalculateGeometry = function()
{
    if(isRealObject(this.spPr.geometry))
    {
        var transform = this.getTransform();
        this.spPr.geometry.Recalculate(transform.extX, transform.extY);
    }
};

CImageShape.prototype.getTransformMatrix = function()
{
    if(this.recalcInfo.recalculateTransform)
    {
        this.recalculateTransform();
        this.recalcInfo.recalculateTransform = false;
    }
    return this.transform;
};

CImageShape.prototype.getTransform = function()
{
    if(this.recalcInfo.recalculateTransform)
    {
        this.recalculateTransform();
        this.recalcInfo.recalculateTransform = false;
    }
    return {x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV};
};

CImageShape.prototype.draw = function(graphics, transform)
{
    if(graphics.updatedRect)
    {
        var rect = graphics.updatedRect;
        var bounds = this.bounds;
        if(bounds.x > rect.x + rect.w
            || bounds.y > rect.y + rect.h
            || bounds.x + bounds.w < rect.x
            || bounds.y + bounds.h < rect.y)
            return;
    }
    var _transform = transform ? transform :this.transform;
    graphics.SetIntegerGrid(false);
    graphics.transform3(_transform, false);
    var shape_drawer = new AscCommon.CShapeDrawer();
    if(this.pen || this.brush)
    {
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        shape_drawer.Clear();
    }
    var oldBrush = this.brush;
    var oldPen = this.pen;

    this.brush = new AscFormat.CUniFill();
    this.brush.fill = this.blipFill;
    this.pen = null;

    shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
    shape_drawer.draw(this.spPr.geometry);
    this.brush = oldBrush;
    this.pen = oldPen;

    if(!this.group)
    {
        var oLock;
        if(this.parent instanceof ParaDrawing)
        {
            oLock = this.parent.Lock;
        }
        else if(this.Lock)
        {
            oLock = this.Lock;
        }
        if(oLock && AscCommon.locktype_None != oLock.Get_Type())
        {
            graphics.transform3(_transform);
            graphics.DrawLockObjectRect(oLock.Get_Type(), 0, 0, this.extX, this.extY);
        }
    }
    graphics.reset();
    graphics.SetIntegerGrid(true);
};

CImageShape.prototype.select = CShape.prototype.select;

CImageShape.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;

CImageShape.prototype.deselect = function(drawingObjectsController)
{
    this.selected = false;
    var selected_objects;
    if(!isRealObject(this.group))
        selected_objects = drawingObjectsController.selectedObjects;
    else
        selected_objects = this.group.getMainGroup().selectedObjects;
    for(var i = 0; i < selected_objects.length; ++i)
    {
        if(selected_objects[i] === this)
        {
            selected_objects.splice(i, 1);
            break;
        }
    }
    return this;
};

CImageShape.prototype.getMainGroup = function()
{
    if(!isRealObject(this.group))
        return null;

    var cur_group = this.group;
    while(isRealObject(cur_group.group))
        cur_group = cur_group.group;
    return cur_group;
};

CImageShape.prototype.drawAdjustments = function(drawingDocument)
{
};

CImageShape.prototype.hitToAdjustment = function()
{
    return {hit:false};
};

CImageShape.prototype.getPlaceholderType = function()
{
    return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
};

CImageShape.prototype.getPlaceholderIndex = function()
{
    return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
};

CImageShape.prototype.getPhType = function()
{
    return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
};

CImageShape.prototype.getPhIndex = function()
{
    return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
};

CImageShape.prototype.setNvSpPr = function(pr)
{
    History.Add(this, {Type: AscDFH.historyitem_ImageShapeSetNvPicPr, oldPr: this.nvPicPr, newPr: pr});
    this.nvPicPr = pr;
};

CImageShape.prototype.getAllImages = function(images)
{
    if(this.blipFill instanceof  AscFormat.CBlipFill && typeof this.blipFill.RasterImageId === "string")
    {
        images[AscCommon.getFullImageSrc2(this.blipFill.RasterImageId)] = true;
    }
};

CImageShape.prototype.Undo = function(data)
{
    switch(data.Type)
    {
        case AscDFH.historyitem_AutoShapes_SetLocks:
        {
            this.locks = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetData:
        {
            this.m_sData = data.oldData;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetApplicationId:
        {
            this.m_sData = data.oldId;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetPixSizes:
        {
            this.m_nPixWidth = data.oldPr.w;
            this.m_nPixHeight = data.oldPr.h;
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetBFromSerialize:
        {
            this.fromSerialize = data.oldPr;
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors:
        {
            if(this.drawingBase)
            {
                this.drawingBase.from.col    = data.oldFromCol;
                this.drawingBase.from.colOff = data.oldFromColOff;
                this.drawingBase.from.row    = data.oldFromRow;
                this.drawingBase.from.rowOff = data.oldFromRowOff;
                this.drawingBase.to.col      = data.oldToCol;
                this.drawingBase.to.colOff   = data.oldToColOff;
                this.drawingBase.to.row      = data.oldToRow;
                this.drawingBase.to.rowOff   = data.oldToRowOff;
                this.drawingBase.Pos.X       = data.oldPosX;
                this.drawingBase.Pos.Y       = data.oldPosY;
                this.drawingBase.ext.cx      = data.oldCx;
                this.drawingBase.ext.cy      = data.oldCy;
            }
            break;
        }
        case AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects:
        {
            AscFormat.addToDrawings(this.worksheet, this, data.Pos);
            break;
        }
        case AscDFH.historyitem_AutoShapes_AddToDrawingObjects:
        {
            AscFormat.deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetWorksheet:
        {
            this.worksheet = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ShapeSetBDeleted:
        {
            this.bDeleted = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetNvPicPr:
        {
            this.nvPicPr = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetSpPr:
        {
            this.spPr = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetBlipFill:
        {
            this.blipFill = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetParent:
        {
            this.parent = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetGroup:
        {
            this.group = data.oldPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetStyle:
        {
            this.style = data.oldPr;
            break;
        }
    }
};

CImageShape.prototype.Redo = function(data)
{
    switch(data.Type)
    {

        case AscDFH.historyitem_AutoShapes_SetLocks:
        {
            this.locks = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetData:
        {
            this.m_sData = data.newData;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetApplicationId:
        {
            this.m_sData = data.newId;
            break;
        }

        case AscDFH.historyitem_ImageShapeSetPixSizes:
        {
            this.m_nPixWidth = data.newPr.w;
            this.m_nPixHeight = data.newPr.h;
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetBFromSerialize:
        {
            this.fromSerialize = data.newPr;
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors:
        {
            if(this.drawingBase)
            {
                this.drawingBase.from.col    = data.fromCol;
                this.drawingBase.from.colOff = data.fromColOff;
                this.drawingBase.from.row    = data.fromRow;
                this.drawingBase.from.rowOff = data.fromRowOff;
                this.drawingBase.to.col      = data.toCol;
                this.drawingBase.to.colOff   = data.toColOff;
                this.drawingBase.to.row      = data.toRow;
                this.drawingBase.to.rowOff   = data.toRowOff;
                this.drawingBase.Pos.X       = data.posX;
                this.drawingBase.Pos.Y       = data.posY;
                this.drawingBase.ext.cx      = data.cx;
                this.drawingBase.ext.cy      = data.cy;
            }
            break;
        }
        case AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects:
        {
            AscFormat.deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        }
        case AscDFH.historyitem_AutoShapes_AddToDrawingObjects:
        {
            AscFormat.addToDrawings(this.worksheet, this, data.Pos);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetWorksheet:
        {
            this.worksheet = data.newPr;
            break;
        }
        case AscDFH.historyitem_ShapeSetBDeleted:
        {
            this.bDeleted = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetNvPicPr:
        {
            this.nvPicPr = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetSpPr:
        {
            this.spPr = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetBlipFill:
        {
            this.blipFill = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetParent:
        {
            this.parent = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetGroup:
        {
            this.group = data.newPr;
            break;
        }
        case AscDFH.historyitem_ImageShapeSetStyle:
        {
            this.style = data.newPr;
            break;
        }
    }
};

CImageShape.prototype.Save_Changes = function(data, w)
{
    w.WriteLong(data.Type);
    switch(data.Type)
    {
        case AscDFH.historyitem_AutoShapes_SetLocks:
        {
            w.WriteLong(data.newPr);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetData:
        {
            AscFormat.writeString(w, data.newData);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetApplicationId:
        {

            AscFormat.writeString(w, data.newId);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetPixSizes:
        {
            AscFormat.writeLong(w, data.newPr.w);
            AscFormat.writeLong(w, data.newPr.h);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetBFromSerialize:
        {
            AscFormat.writeBool(w, data.newPr);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors:
        {
            AscFormat.writeDouble(w, data.fromCol   );
            AscFormat.writeDouble(w, data.fromColOff);
            AscFormat.writeDouble(w, data.fromRow   );
            AscFormat.writeDouble(w, data.fromRowOff);
            AscFormat.writeDouble(w, data.toCol);
            AscFormat.writeDouble(w, data.toColOff);
            AscFormat.writeDouble(w, data.toRow   );
            AscFormat.writeDouble(w, data.toRowOff);


            AscFormat.writeDouble(w, data.posX);
            AscFormat.writeDouble(w, data.posY);
            AscFormat.writeDouble(w, data.cx);
            AscFormat.writeDouble(w, data.cy);
            break;
        }
        case AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects:
        {
            break;
        }
        case AscDFH.historyitem_AutoShapes_AddToDrawingObjects:
        {
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            AscFormat.writeLong(w, Pos);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetWorksheet:
        {
            AscFormat.writeBool(w,isRealObject(data.newPr));
            if(isRealObject(data.newPr))
            {
                AscFormat.writeString(w,data.newPr.getId());
            }
            break;
        }
        case AscDFH.historyitem_ImageShapeSetNvPicPr:
        case AscDFH.historyitem_ImageShapeSetSpPr:
        case AscDFH.historyitem_ImageShapeSetParent:
        case AscDFH.historyitem_ImageShapeSetGroup:
        case AscDFH.historyitem_ImageShapeSetStyle:
        {
            AscFormat.writeObject(w, data.newPr);
            break;
        }
        case AscDFH.historyitem_ShapeSetBDeleted:
        {
            AscFormat.writeBool(w, data.newPr);
            break;
        }

        case AscDFH.historyitem_ImageShapeSetBlipFill:
        {
            w.WriteBool(isRealObject(data.newPr));
            if(isRealObject(data.newPr))
            {
                data.newPr.Write_ToBinary(w);
            }
            break;
        }
    }
};

CImageShape.prototype.Load_Changes = function(r)
{
    var type = r.GetLong();
    switch(type)
    {
        case AscDFH.historyitem_AutoShapes_SetLocks:
        {
            this.locks = r.GetLong();
            break;
        }
        case AscDFH.historyitem_ImageShapeSetData:
        {
            this.m_sData = AscFormat.readString(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetApplicationId:
        {
            this.m_sApplicationId = AscFormat.readString(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetPixSizes:
        {
            this.m_nPixWidth = AscFormat.readLong(r);
            this.m_nPixHeight = AscFormat.readLong(r);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetBFromSerialize:
        {
            this.fromSerialize = AscFormat.readBool(r);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors:
        {
            if(this.drawingBase)
            {
                this.drawingBase.from.col    = AscFormat.readDouble(r);
                this.drawingBase.from.colOff = AscFormat.readDouble(r);
                this.drawingBase.from.row    = AscFormat.readDouble(r);
                this.drawingBase.from.rowOff = AscFormat.readDouble(r);
                this.drawingBase.to.col      = AscFormat.readDouble(r);
                this.drawingBase.to.colOff   = AscFormat.readDouble(r);
                this.drawingBase.to.row      = AscFormat.readDouble(r);
                this.drawingBase.to.rowOff   = AscFormat.readDouble(r);


                this.drawingBase.Pos.X = AscFormat.readDouble(r);
                this.drawingBase.Pos.Y = AscFormat.readDouble(r);
                this.drawingBase.ext.cx = AscFormat.readDouble(r);
                this.drawingBase.ext.cy = AscFormat.readDouble(r);
            }
            break;
        }
        case AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects:
        {
            AscFormat.deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        }
        case AscDFH.historyitem_AutoShapes_AddToDrawingObjects:
        {
            var pos = AscFormat.readLong(r);
            if(this.worksheet)
            {
                pos = this.worksheet.contentChanges.Check(AscCommon.contentchanges_Add, pos);
            }
            AscFormat.addToDrawings(this.worksheet, this, pos);
            break;
        }
        case AscDFH.historyitem_AutoShapes_SetWorksheet:
        {
            AscFormat.ReadWBModel(this, r);
            break;
        }
        case AscDFH.historyitem_ShapeSetBDeleted:
        {
            this.bDeleted = AscFormat.readBool(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetNvPicPr:
        {
            this.nvPicPr = AscFormat.readObject(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetSpPr:
        {
            this.spPr = AscFormat.readObject(r);
            break;
        }

        case AscDFH.historyitem_ImageShapeSetBlipFill:
        {
            if(r.GetBool())
            {
                this.blipFill = new AscFormat.CBlipFill();
                r.GetLong();
                this.blipFill.Read_FromBinary(r);
                if(typeof AscCommon.CollaborativeEditing !== "undefined")
                {
                    if(typeof this.blipFill.RasterImageId === "string" && this.blipFill.RasterImageId.length > 0)
                    {
                        AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(this.blipFill.RasterImageId));
                    }
                }
            }
            else
            {
                this.blipFill = null;
            }
            this.handleUpdateFill();
            break;
        }
        case AscDFH.historyitem_ImageShapeSetParent:
        {
            this.parent = AscFormat.readObject(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetGroup:
        {
            this.group = AscFormat.readObject(r);
            break;
        }
        case AscDFH.historyitem_ImageShapeSetStyle:
        {
            this.style = AscFormat.readObject(r);
            break;
        }
    }
};

CImageShape.prototype.Load_LinkData = function(linkData)
{
};

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CImageShape = CImageShape;
})(window);
