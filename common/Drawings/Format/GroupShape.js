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

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Import
var c_oAscSizeRelFromH = AscCommon.c_oAscSizeRelFromH;
var c_oAscSizeRelFromV = AscCommon.c_oAscSizeRelFromV;
var isRealObject = AscCommon.isRealObject;
    var History = AscCommon.History;
    var global_MatrixTransformer = AscCommon.global_MatrixTransformer;

var CShape = AscFormat.CShape;

function CGroupShape()
{
    CGroupShape.superclass.constructor.call(this);
    this.nvGrpSpPr = null;
    this.spTree    = [];


    this.invertTransform = null;
    this.scaleCoefficients = {cx: 1, cy: 1};

    this.arrGraphicObjects = [];
    this.selectedObjects = [];


    this.selection =
    {
        groupSelection: null,
        chartSelection: null,
        textSelection: null
    };

    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add(this, this.Id);
}
AscCommon.extendClass(CGroupShape, AscFormat.CGraphicObjectBase);

    CGroupShape.prototype.getObjectType = function()
    {
        return AscDFH.historyitem_type_GroupShape;
    };

    CGroupShape.prototype.Get_AllDrawingObjects = function(DrawingObjects)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].Get_AllDrawingObjects)
            {
                this.spTree[i].Get_AllDrawingObjects(DrawingObjects);
            }
        }
    };

    CGroupShape.prototype.documentGetAllFontNames = function(allFonts)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].documentGetAllFontNames)
                this.spTree[i].documentGetAllFontNames(allFonts);
        }
    };

    CGroupShape.prototype.documentCreateFontMap = function(allFonts)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].documentCreateFontMap)
                this.spTree[i].documentCreateFontMap(allFonts);
        }
    };

    CGroupShape.prototype.setBDeleted = function(pr)
    {
        History.Add(this, {Type: AscDFH.historyitem_ShapeSetBDeleted, oldPr: this.bDeleted, newPr: pr});
        this.bDeleted = pr;
    };

    CGroupShape.prototype.setBDeleted2 = function(pr)
    {
        this.bDeleted = pr;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].setBDeleted2)
            {
                this.spTree[i].setBDeleted2(pr);
            }
            else
            {
                this.spTree[i].bDeleted = pr;
            }
        }
    };

    CGroupShape.prototype.checkRemoveCache = function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].checkRemoveCache && this.spTree[i].checkRemoveCache();
        }
    };

    CGroupShape.prototype.documentUpdateSelectionState = function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.updateSelectionState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.documentUpdateSelectionState();
        }
        else
        {
            this.getDrawingDocument().SelectClear();
            this.getDrawingDocument().TargetEnd();
        }
    };

    CGroupShape.prototype.drawSelectionPage = function(pageIndex)
    {
        var oMatrix = null;
        if(this.selection.textSelection)
        {
            if(this.selection.textSelection.transformText)
            {
                oMatrix = this.selection.textSelection.transformText.CreateDublicate();
            }
            this.getDrawingDocument().UpdateTargetTransform(oMatrix);
            this.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
        }
        else if(this.selection.chartSelection && this.selection.chartSelection.selection.textSelection)
        {
            if(this.selection.chartSelection.selection.textSelection.transformText)
            {
                oMatrix = this.selection.chartSelection.selection.textSelection.transformText.CreateDublicate();
            }
            this.getDrawingDocument().UpdateTargetTransform(oMatrix);
            this.selection.chartSelection.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
        }
    };

    CGroupShape.prototype.setNvGrpSpPr = function(pr)
    {
        History.Add(this, {Type:AscDFH.historyitem_GroupShapeSetNvGrpSpPr, oldPr: this.nvGrpSpPr, newPr: pr});
        this.nvGrpSpPr = pr;
    };

    CGroupShape.prototype.setSpPr = function(pr)
    {
        History.Add(this, {Type:AscDFH.historyitem_GroupShapeSetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    };

    CGroupShape.prototype.addToSpTree = function(pos, item)
    {
        if(!AscFormat.isRealNumber(pos))
            pos = this.spTree.length;
        History.Add(this, {Type: AscDFH.historyitem_GroupShapeAddToSpTree, pos: pos, item: item});
        this.handleUpdateSpTree();
        this.spTree.splice(pos, 0, item);
    };

    CGroupShape.prototype.setParent = function(pr)
    {
        History.Add(this, {Type: AscDFH.historyitem_GroupShapeSetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    };

    CGroupShape.prototype.setGroup = function(group)
    {
        History.Add(this, {Type: AscDFH.historyitem_GroupShapeSetGroup, oldPr: this.group, newPr: group});
        this.group = group;
    };

    CGroupShape.prototype.removeFromSpTree = function(id)
    {
        for(var i = this.spTree.length-1; i > -1 ; --i)
        {
            if(this.spTree[i].Get_Id() === id)
            {
                this.handleUpdateSpTree();
                History.Add(this,{Type:AscDFH.historyitem_GroupShapeRemoveFromSpTree, pos: i, item:this.spTree[i]});
                return this.spTree.splice(i, 1)[0];
            }
        }
        return null;
    };

    CGroupShape.prototype.removeFromSpTreeByPos = function(pos)
    {
        History.Add(this,{Type:AscDFH.historyitem_GroupShapeRemoveFromSpTree, pos: pos, item:this.spTree[pos]});
        this.handleUpdateSpTree();
        return this.spTree.splice(pos, 1)[0];
    };

    CGroupShape.prototype.handleUpdateSpTree = function()
    {
        if(!this.group)
        {
            this.recalcInfo.recalculateArrGraphicObjects = true;
            this.recalcBounds();
            this.addToRecalculate();
        }
        else
        {
            this.recalcInfo.recalculateArrGraphicObjects = true;
            this.group.handleUpdateSpTree();
            this.recalcBounds();
        }
    };

    CGroupShape.prototype.copy = function()
    {
        var copy = new CGroupShape();
        if(this.nvGrpSpPr)
        {
            copy.setNvGrpSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        for(var i = 0; i < this.spTree.length; ++i)
        {
            copy.addToSpTree(copy.spTree.length, this.spTree[i].copy());
            copy.spTree[copy.spTree.length-1].setGroup(copy);
        }
        copy.setBDeleted(this.bDeleted);
        copy.cachedImage = this.getBase64Img();
        copy.cachedPixH = this.cachedPixH;
        copy.cachedPixW = this.cachedPixW;
        if(this.fromSerialize)
        {
            copy.setBFromSerialize(true);
        }
        return copy;
    };

    CGroupShape.prototype.getAllImages = function(images)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].getAllImages === "function")
            {
                this.spTree[i].getAllImages(images);
            }
        }
    };

    CGroupShape.prototype.getBase64Img = CShape.prototype.getBase64Img;

    CGroupShape.prototype.convertToWord = function(document)
    {
        this.setBDeleted(true);
        var c = new CGroupShape();
        c.setBDeleted(false);
        if(this.nvGrpSpPr)
        {
            c.setNvSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }

        for(var i = 0; i < this.spTree.length; ++i)
        {
            c.addToSpTree(c.spTree.length, this.spTree[i].convertToWord(document));
            c.spTree[c.spTree.length - 1].setGroup(c);
        }
        return c;
    };

    CGroupShape.prototype.convertToPPTX = function(drawingDocument, worksheet)
    {
        var c = new CGroupShape();
        c.setBDeleted(false);
        c.setWorksheet(worksheet);
        if(this.nvGrpSpPr)
        {
            c.setNvSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }

        for(var i = 0; i < this.spTree.length; ++i)
        {
            c.addToSpTree(c.spTree.length, this.spTree[i].convertToPPTX(drawingDocument, worksheet));
            c.spTree[c.spTree.length - 1].setGroup(c);
        }
        return c;
    };

    CGroupShape.prototype.getAllFonts = function(fonts)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof  this.spTree[i].getAllFonts === "function")
                this.spTree[i].getAllFonts(fonts);
        }
    };

    CGroupShape.prototype.isShape = function()
    {
        return false;
    };

    CGroupShape.prototype.isImage = function()
    {
        return false;
    };

    CGroupShape.prototype.isChart = function()
    {
        return false;
    };

    CGroupShape.prototype.isGroup = function()
    {
        return true;
    };

    CGroupShape.prototype.isPlaceholder  = function()
    {
        return this.nvGrpSpPr != null && this.nvGrpSpPr.nvPr != undefined && this.nvGrpSpPr.nvPr.ph != undefined;
    };

    CGroupShape.prototype.getAllRasterImages = function(images)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].getAllRasterImages)
                this.spTree[i].getAllRasterImages(images);
        }
    };

    CGroupShape.prototype.draw = function(graphics)
    {
        for(var i = 0; i < this.spTree.length; ++i)
            this.spTree[i].draw(graphics);


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
                var bCoMarksDraw = true;
                if(typeof editor !== "undefined" && editor && AscFormat.isRealBool(editor.isCoMarksDraw)){
                    bCoMarksDraw = editor.isCoMarksDraw;
                }
                if(bCoMarksDraw){
                    graphics.transform3(this.transform);
                    graphics.DrawLockObjectRect(oLock.Get_Type(), 0, 0, this.extX, this.extY);
                }
            }
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
    };

    CGroupShape.prototype.getLocalTransform = function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.localTransform;
    };

    CGroupShape.prototype.getArrGraphicObjects = function()
    {
        if(this.recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
        return this.arrGraphicObjects;
    };

    CGroupShape.prototype.getInvertTransform = function()
    {
        return this.invertTransform;
    };

    CGroupShape.prototype.getRectBounds = function()
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

    CGroupShape.prototype.getResultScaleCoefficients = function()
    {
        if(this.recalcInfo.recalculateScaleCoefficients)
        {
            var cx, cy;
            if(this.spPr.xfrm.isNotNullForGroup())
            {

                var dExtX = this.spPr.xfrm.extX, dExtY = this.spPr.xfrm.extY;
                var oParaDrawing = AscFormat.getParaDrawing(this);
                if(oParaDrawing)
                {
                    if(oParaDrawing.SizeRelH || oParaDrawing.SizeRelV)
                    {
                        this.m_oSectPr = null;
                        var oParentParagraph = oParaDrawing.Get_ParentParagraph();
                        if(oParentParagraph)
                        {

                            var oSectPr = oParentParagraph.Get_SectPr();
                            if(oSectPr)
                            {
                                if(oParaDrawing.SizeRelH && oParaDrawing.SizeRelH.Percent > 0)
                                {
                                    switch(oParaDrawing.SizeRelH.RelativeFrom)
                                    {
                                        case c_oAscSizeRelFromH.sizerelfromhMargin:
                                        {
                                            dExtX = oSectPr.Get_PageWidth() - oSectPr.Get_PageMargin_Left() - oSectPr.Get_PageMargin_Right();
                                            break;
                                        }
                                        case c_oAscSizeRelFromH.sizerelfromhPage:
                                        {
                                            dExtX = oSectPr.Get_PageWidth();
                                            break;
                                        }
                                        case c_oAscSizeRelFromH.sizerelfromhLeftMargin:
                                        {
                                            dExtX = oSectPr.Get_PageMargin_Left();
                                            break;
                                        }

                                        case c_oAscSizeRelFromH.sizerelfromhRightMargin:
                                        {
                                            dExtX = oSectPr.Get_PageMargin_Right();
                                            break;
                                        }
                                        default:
                                        {
                                            dExtX = oSectPr.Get_PageMargin_Left();
                                            break;
                                        }
                                    }
                                    dExtX *= oParaDrawing.SizeRelH.Percent;
                                }
                                if(oParaDrawing.SizeRelV && oParaDrawing.SizeRelV.Percent > 0)
                                {
                                    switch(oParaDrawing.SizeRelV.RelativeFrom)
                                    {
                                        case c_oAscSizeRelFromV.sizerelfromvMargin:
                                        {
                                            dExtY = oSectPr.Get_PageHeight() - oSectPr.Get_PageMargin_Top() - oSectPr.Get_PageMargin_Bottom();
                                            break;
                                        }
                                        case c_oAscSizeRelFromV.sizerelfromvPage:
                                        {
                                            dExtY = oSectPr.Get_PageHeight();
                                            break;
                                        }
                                        case c_oAscSizeRelFromV.sizerelfromvTopMargin:
                                        {
                                            dExtY = oSectPr.Get_PageMargin_Top();
                                            break;
                                        }
                                        case c_oAscSizeRelFromV.sizerelfromvBottomMargin:
                                        {
                                            dExtY = oSectPr.Get_PageMargin_Bottom();
                                            break;
                                        }
                                        default:
                                        {
                                            dExtY = oSectPr.Get_PageMargin_Top();
                                            break;
                                        }
                                    }
                                    dExtY *= oParaDrawing.SizeRelV.Percent;
                                }
                            }
                        }
                    }
                }

                if(this.spPr.xfrm.chExtX > 0)
                    cx = dExtX/this.spPr.xfrm.chExtX;
                else
                    cx = 1;

                if(this.spPr.xfrm.chExtY > 0)
                    cy = dExtY/this.spPr.xfrm.chExtY;
                else
                    cy = 1;
            }
            else
            {
                cx = 1;
                cy = 1;
            }
            if(isRealObject(this.group))
            {
                var group_scale_coefficients = this.group.getResultScaleCoefficients();
                cx *= group_scale_coefficients.cx;
                cy *= group_scale_coefficients.cy;
            }
            this.scaleCoefficients.cx = cx;
            this.scaleCoefficients.cy = cy;
            this.recalcInfo.recalculateScaleCoefficients = false;
        }
        return this.scaleCoefficients;
    };

    CGroupShape.prototype.getType = function()
    {
        return DRAWING_OBJECT_TYPE_GROUP;
    };

    CGroupShape.prototype.getCompiledTransparent = function()
    {
        return null;
    };

    CGroupShape.prototype.selectObject = function(object, pageIndex)
    {
        object.select(this, pageIndex);
    };

    CGroupShape.prototype.recalculate = function()
    {
        var recalcInfo = this.recalcInfo;

        if(recalcInfo.recalculateBrush)
        {
            this.recalculateBrush();
            recalcInfo.recalculateBrush = false;
        }
        if(recalcInfo.recalculatePen)
        {
            this.recalculatePen();
            recalcInfo.recalculatePen = false;
        }
        if(recalcInfo.recalculateScaleCoefficients)
        {
            this.getResultScaleCoefficients();
            recalcInfo.recalculateScaleCoefficients = false;
        }

        if(recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            recalcInfo.recalculateTransform = false;
        }
        if(recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
        for(var i = 0;  i < this.spTree.length; ++i)
            this.spTree[i].recalculate();
        if(recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            recalcInfo.recalculateBounds = false;
        }
    };

    CGroupShape.prototype.recalcTransform = function()
    {
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].recalcTransform)
                this.spTree[i].recalcTransform();
            else
            {
                this.spTree[i].recalcInfo.recalculateTransform = true;
                this.spTree[i].recalcInfo.recalculateTransformText = true;
            }
        }
    };

    CGroupShape.prototype.canRotate = function()
    {
        //TODO: сделать еще проверку SpLock
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].canRotate || !this.spTree[i].canRotate())
                return false;
        }
        return true;
    };

    CGroupShape.prototype.canResize = function()
    {
        //TODO: сделать еще проверку SpLock
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].canResize || !this.spTree[i].canResize())
                return false
        }
        return true;
    };

    CGroupShape.prototype.canMove = function()
    {
        //TODO: сделать еще проверку SpLock
        return true;//TODO
    };

    CGroupShape.prototype.canGroup = function()
    {
        //TODO: сделать еще проверку SpLock
        return true;//TODO
    };

    CGroupShape.prototype.canChangeAdjustments = function()
    {
        return false;
    };

    CGroupShape.prototype.drawAdjustments = function()
    {};

    CGroupShape.prototype.hitToAdjustment = function()
    {
        return {hit: false};
    };

    CGroupShape.prototype.recalculateBrush = function()
    {};

    CGroupShape.prototype.recalculatePen = function()
    {};

    CGroupShape.prototype.recalculateArrGraphicObjects = function()
    {
        this.arrGraphicObjects.length = 0;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].isGroup())
                this.arrGraphicObjects.push(this.spTree[i]);
            else
            {
                var arr_graphic_objects = this.spTree[i].getArrGraphicObjects();
                for(var j = 0; j < arr_graphic_objects.length; ++j)
                    this.arrGraphicObjects.push(arr_graphic_objects[j]);
            }
        }
    };

    CGroupShape.prototype.paragraphAdd = function(paraItem, bRecalculate)
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else
        {
            var i;
            if(paraItem.Type === para_TextPr)
            {
                AscFormat.DrawingObjectsController.prototype.applyDocContentFunction.call(this, CDocumentContent.prototype.Paragraph_Add, [paraItem, bRecalculate], CTable.prototype.Paragraph_Add);
            }
            else if(this.selectedObjects.length === 1
                && this.selectedObjects[0].getObjectType() === AscDFH.historyitem_type_Shape
                &&  !AscFormat.CheckLinePreset(this.selectedObjects[0].getPresetGeom()))
            {
                this.selection.textSelection = this.selectedObjects[0];
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
                if(AscFormat.isRealNumber(this.selection.textSelection.selectStartPage))
                    this.selection.textSelection.select(this, this.selection.textSelection.selectStartPage);
            }
            else if(this.selectedObjects.length > 0)
            {
                if(this.parent)
                {
                    this.parent.GoTo_Text();
                    this.resetSelection();
                }
            }
        }
    };

    CGroupShape.prototype.applyTextFunction = AscFormat.DrawingObjectsController.prototype.applyTextFunction;

    CGroupShape.prototype.applyDocContentFunction = AscFormat.DrawingObjectsController.prototype.applyDocContentFunction;

    CGroupShape.prototype.applyAllAlign = function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllAlign === "function")
            {
                this.spTree[i].applyAllAlign(val);
            }
        }
    };

    CGroupShape.prototype.applyAllSpacing = function(val)
    {

        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllSpacing === "function")
            {
                this.spTree[i].applyAllSpacing(val);
            }
        }
    };

    CGroupShape.prototype.applyAllNumbering = function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllNumbering === "function")
            {
                this.spTree[i].applyAllNumbering(val);
            }
        }
    };

    CGroupShape.prototype.applyAllIndent = function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllIndent === "function")
            {
                this.spTree[i].applyAllIndent(val);
            }
        }
    };

    CGroupShape.prototype.checkExtentsByDocContent = function()
    {
        var bRet = false;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].checkExtentsByDocContent === "function")
            {
                if(this.spTree[i].checkExtentsByDocContent())
                {
                    bRet = true;
                }
            }
        }
        return bRet;
    };

    CGroupShape.prototype.Paragraph_IncDecFontSizeAll = function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].Paragraph_IncDecFontSizeAll === "function")
            {
                this.spTree[i].Paragraph_IncDecFontSizeAll(val);
            }
        }
    };

    CGroupShape.prototype.changeSize = function(kw, kh)
    {
        if(this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNullForGroup())
        {
            var xfrm = this.spPr.xfrm;
            xfrm.setOffX(xfrm.offX * kw);
            xfrm.setOffY(xfrm.offY * kh);
            xfrm.setExtX(xfrm.extX * kw);
            xfrm.setExtY(xfrm.extY * kh);
            xfrm.setChExtX(xfrm.chExtX*kw);
            xfrm.setChExtY(xfrm.chExtY*kh);
            xfrm.setChOffX(xfrm.chOffX*kw);
            xfrm.setChOffY(xfrm.chOffY*kh);
        }
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].changeSize(kw, kh);
        }
    };

    CGroupShape.prototype.recalculateTransform = function()
    {
        this.cachedImage = null;
        var xfrm;
        if(this.spPr.xfrm.isNotNullForGroup())
            xfrm = this.spPr.xfrm;
        else
        {
            xfrm = new AscFormat.CXfrm();
            xfrm.offX = 0;
            xfrm.offY = 0;
            xfrm.extX = 5;
            xfrm.extY = 5;
            xfrm.chOffX = 0;
            xfrm.chOffY = 0;
            xfrm.chExtX = 5;
            xfrm.chExtY = 5;
        }

        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = this.flipH === true;
            this.flipV = this.flipV === true;
        }
        else
        {
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

    CGroupShape.prototype.getTransformMatrix = function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
        }
        return this.transform;
    };

    CGroupShape.prototype.getSnapArrays = function(snapX, snapY)
    {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX*0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY*0.5);
        snapY.push(transform.ty + this.extY);
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].getSnapArrays)
            {
                this.arrGraphicObjects[i].getSnapArrays(snapX, snapY);
            }
        }
    };

    CGroupShape.prototype.getPlaceholderType = function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    };

    CGroupShape.prototype.getPlaceholderIndex = function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
    };

    CGroupShape.prototype.getPhType = function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    };

    CGroupShape.prototype.getPhIndex = function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
    };

    CGroupShape.prototype.getSelectionState = function()
    {
        var selection_state = {};
        if(this.selection.textSelection)
        {
            selection_state.textObject = this.selection.textSelection;
            selection_state.selectStartPage = this.selection.textSelection.selectStartPage;
            selection_state.textSelection = this.selection.textSelection.getDocContent().Get_SelectionState();
        }
        else if(this.selection.chartSelection)
        {
            selection_state.chartObject = this.selection.chartSelection;
            selection_state.selectStartPage = this.selection.chartSelection.selectStartPage;
            selection_state.chartSelection = this.selection.chartSelection.getSelectionState();
        }
        else
        {
            selection_state.selection = [];
            for(var i = 0; i < this.selectedObjects.length; ++i)
            {
                selection_state.selection.push({object: this.selectedObjects[i], pageIndex: this.selectedObjects[i].selectStartPage});
            }
        }
        return selection_state;
    };

    CGroupShape.prototype.setSelectionState = function(selection_state)
    {
        this.resetSelection(this);
        if(selection_state.textObject)
        {
            this.selectObject(selection_state.textObject, selection_state.selectStartPage);
            this.selection.textSelection = selection_state.textObject;
            selection_state.textObject.getDocContent().Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length-1);
        }
        else if(selection_state.chartSelection)
        {
            this.selectObject(selection_state.chartObject, selection_state.selectStartPage);
            this.selection.chartSelection = selection_state.chartObject;
            selection_state.chartObject.setSelectionState(selection_state.chartSelection);
        }
        else
        {
            for(var i = 0; i < selection_state.selection.length; ++i)
            {
                this.selectObject(selection_state.selection[i].object, selection_state.selection[i].pageIndex);
            }
        }
    };

    CGroupShape.prototype.documentUpdateRulersState = function()
    {
        if(this.selectedObjects.length === 1 && this.selectedObjects[0].documentUpdateRulersState)
            this.selectedObjects[0].documentUpdateRulersState();
    };

    CGroupShape.prototype.updateChartReferences = function(oldWorksheet, newWorksheet, bNoRebuildCache)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].updateChartReferences)
                this.spTree[i].updateChartReferences(oldWorksheet, newWorksheet, bNoRebuildCache);
        }
    };

    CGroupShape.prototype.rebuildSeries = function(data)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].rebuildSeries)
                this.spTree[i].rebuildSeries(data);
        }
    };

    CGroupShape.prototype.CheckNeedRecalcAutoFit = function(oSectPr)
    {
        var bRet = false;
        for(var i = 0;  i< this.spTree.length; ++i)
        {
            if(this.spTree[i].CheckNeedRecalcAutoFit && this.spTree[i].CheckNeedRecalcAutoFit(oSectPr))
            {
                bRet = true;
            }
        }
        if(bRet)
        {
            this.recalcWrapPolygon();
        }
        return bRet;
    };

    CGroupShape.prototype.CheckGroupSizes = function()
    {
        var bRet = false;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].checkExtentsByDocContent)
            {
                if(this.spTree[i].checkExtentsByDocContent(undefined, false))
                {
                    bRet = true;
                }
            }
        }
        if(bRet)
        {
            if(!this.group)
            {
                this.updateCoordinatesAfterInternalResize();
            }
            if(this.parent instanceof ParaDrawing)
            {
                this.parent.CheckWH();
            }
        }
        return bRet;
    };

    CGroupShape.prototype.Get_RevisionsChangeParagraph = function(SearchEngine){
        var i;
        if(this.selectedObjects.length === 0){
            if(SearchEngine.Get_Direction() > 0){
                i = 0;
            }
            else{
                i = this.arrGraphicObjects.length - 1;
            }
        }
        else{
            if(SearchEngine.Get_Direction() > 0){
                for(i = 0; i < this.arrGraphicObjects.length; ++i){
                    if(this.arrGraphicObjects[i].selected){
                        break;
                    }
                }
                if(i === this.arrGraphicObjects.length){
                    return;
                }
            }
            else{
                for(i = this.arrGraphicObjects.length - 1; i > -1 ; --i){
                    if(this.arrGraphicObjects[i].selected){
                        break;
                    }
                }
                if(i === -1){
                    return;
                }
            }
        }
        while(!SearchEngine.Is_Found()){
            if(this.arrGraphicObjects[i].Get_RevisionsChangeParagraph){
                this.arrGraphicObjects[i].Get_RevisionsChangeParagraph(SearchEngine);
            }
            if(SearchEngine.Get_Direction() > 0){
                if(i === this.arrGraphicObjects.length - 1){
                    break;
                }
                ++i;
            }
            else{
                if(i === 0){
                    break;
                }
                --i;
            }
        }
    };

    CGroupShape.prototype.Search  = function(Str, Props, SearchEngine, Type)
    {
        var Len = this.arrGraphicObjects.length;
        for(var i = 0; i < Len; ++i)
        {
            if(this.arrGraphicObjects[i].Search)
            {
                this.arrGraphicObjects[i].Search(Str, Props, SearchEngine, Type);
            }
        }
    };

    CGroupShape.prototype.Search_GetId  = function(bNext, bCurrent)
    {
        var Current = -1;
        var Len = this.arrGraphicObjects.length;
       
        var Id = null;
        if ( true === bCurrent )
        {
            for(var i = 0; i < Len; ++i)
            {                
                if(this.arrGraphicObjects[i] === this.selection.textSelection)
                {
                    Current = i;
                    break;
                }
            } 
        }
        
        if ( true === bNext )
        {      
            var Start = ( -1 !== Current ? Current : 0 );
            
            for ( var i = Start; i < Len; i++ )
            {
                if ( this.arrGraphicObjects[i].Search_GetId )
                {
                    Id = this.arrGraphicObjects[i].Search_GetId(true, i === Current ? true : false);
                    if ( null !== Id )
                        return Id;
                }
            }
        }        
        else
        {
            var Start = ( -1 !== Current ? Current : Len - 1 );

            for ( var i = Start; i >= 0; i-- )
            {
                if ( this.arrGraphicObjects[i].Search_GetId )
                {
                    Id = this.arrGraphicObjects[i].Search_GetId(false, i === Current ? true : false);
                    if ( null !== Id )
                        return Id;
                }
            }
        }
                
        return null;
    };

    CGroupShape.prototype.isEmptyPlaceholder = function ()
    {
        return false;
    };

    CGroupShape.prototype.getCompiledFill = function()
    {
        this.compiledFill = null;
        if(isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill))
        {
            this.compiledFill = this.spPr.Fill.createDuplicate();
        }
        else if(isRealObject(this.group))
        {
            var group_compiled_fill = this.group.getCompiledFill();
            if(isRealObject(group_compiled_fill) && isRealObject(group_compiled_fill.fill))
            {
                this.compiledFill = group_compiled_fill.createDuplicate();
            }
            else
            {
                var hierarchy = this.getHierarchy();
                for(var i = 0; i < hierarchy.length; ++i)
                {
                    if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill))
                    {
                        this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                        break;
                    }
                }
            }
        }
        else
        {
            var hierarchy = this.getHierarchy();
            for(var i = 0; i < hierarchy.length; ++i)
            {
                if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill))
                {
                    this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                    break;
                }
            }
        }
        return this.compiledFill;
    };

    CGroupShape.prototype.getCompiledLine = function()
    {
        return null;
    };

    CGroupShape.prototype.setVerticalAlign  = function(align)
    {
        for(var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index)
        {
            if(this.spTree[_shape_index].setVerticalAlign)
            {
                this.spTree[_shape_index].setVerticalAlign(align);
            }
        }
    };

    CGroupShape.prototype.setVert  = function(vert)
    {
        for(var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index)
        {
            if(this.spTree[_shape_index].setVert)
            {
                this.spTree[_shape_index].setVert(vert);
            }
        }
    };

    CGroupShape.prototype.setPaddings = function(paddings)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].setPaddings)
            {
                this.spTree[i].setPaddings(paddings);
            }
        }
    };

    CGroupShape.prototype.getResizeCoefficients = function(numHandle, x, y)
    {
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-t_x)/cx, kd2: (cy-t_y)/cy};
            case 1:
                return {kd1: (cy-t_y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-t_y)/cy, kd2: t_x/cx};
            case 3:
                return {kd1: t_x/cx, kd2: 0};
            case 4:
                return {kd1: t_x/cx, kd2: t_y/cy};
            case 5:
                return {kd1: t_y/cy, kd2: 0};
            case 6:
                return {kd1: t_y/cy, kd2:(cx-t_x)/cx};
            case 7:
                return {kd1:(cx-t_x)/cx, kd2: 0};
        }
        return {kd1: 1, kd2: 1};
    };

    CGroupShape.prototype.changePresetGeom = function(preset)
    {
        for(var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index)
        {
            if(this.spTree[_shape_index].changePresetGeom)
            {
                this.spTree[_shape_index].changePresetGeom(preset);
            }
        }
    };

    CGroupShape.prototype.changeFill = function(fill)
    {
        for(var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index)
        {
            if(this.spTree[_shape_index].changeFill)
            {
                this.spTree[_shape_index].changeFill(fill);
            }
        }
    };

    CGroupShape.prototype.changeLine = function(line)
    {
        for(var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index)
        {
            if(this.spTree[_shape_index].changeLine)
            {
                this.spTree[_shape_index].changeLine(line);
            }
        }
    };

    CGroupShape.prototype.getMainGroup = function()
    {
        if(!isRealObject(this.group))
            return this;
        return this.group.getMainGroup();
    };

    CGroupShape.prototype.canUnGroup = function()
    {
        return true;
    };

    CGroupShape.prototype.normalize = function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].normalize();
        }
        CGroupShape.superclass.normalize.call(this);
        var xfrm = this.spPr.xfrm;
        xfrm.setChExtX(xfrm.extX);
        xfrm.setChExtY(xfrm.extY);
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
    };

    CGroupShape.prototype.updateCoordinatesAfterInternalResize = function()
    {
        this.normalize();
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].isGroup())
                this.spTree[i].updateCoordinatesAfterInternalResize();
        }

        var sp_tree = this.spTree;

        var min_x, max_x, min_y, max_y;
        var sp = sp_tree[0];
        var xfrm  = sp.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var xc, yc;
        if(AscFormat.checkNormalRotate(rot))
        {
            min_x = xfrm.offX;
            min_y = xfrm.offY;
            max_x = xfrm.offX + xfrm.extX;
            max_y = xfrm.offY + xfrm.extY;
        }
        else
        {
            xc = xfrm.offX + xfrm.extX*0.5;
            yc = xfrm.offY + xfrm.extY*0.5;
            min_x = xc - xfrm.extY*0.5;
            min_y = yc - xfrm.extX*0.5;
            max_x = xc + xfrm.extY*0.5;
            max_y = yc + xfrm.extX*0.5;
        }
        var cur_max_x, cur_min_x, cur_max_y, cur_min_y;
        for(i = 1; i < sp_tree.length; ++i)
        {
            sp = sp_tree[i];
            xfrm  = sp.spPr.xfrm;
            rot = xfrm.rot == null ? 0 : xfrm.rot;

            if(AscFormat.checkNormalRotate(rot))
            {
                cur_min_x = xfrm.offX;
                cur_min_y = xfrm.offY;
                cur_max_x = xfrm.offX + xfrm.extX;
                cur_max_y = xfrm.offY + xfrm.extY;
            }
            else
            {
                xc = xfrm.offX + xfrm.extX*0.5;
                yc = xfrm.offY + xfrm.extY*0.5;
                cur_min_x = xc - xfrm.extY*0.5;
                cur_min_y = yc - xfrm.extX*0.5;
                cur_max_x = xc + xfrm.extY*0.5;
                cur_max_y = yc + xfrm.extX*0.5;
            }
            if(cur_max_x > max_x)
                max_x = cur_max_x;
            if(cur_min_x < min_x)
                min_x = cur_min_x;

            if(cur_max_y > max_y)
                max_y = cur_max_y;
            if(cur_min_y < min_y)
                min_y = cur_min_y;
        }

        var temp;
        var x_min_clear = min_x;
        var y_min_clear = min_y;
        if(this.spPr.xfrm.flipH === true)
        {
            temp = max_x;
            max_x = this.spPr.xfrm.extX - min_x;
            min_x = this.spPr.xfrm.extX - temp;
        }

        if(this.spPr.xfrm.flipV === true)
        {
            temp = max_y;
            max_y = this.spPr.xfrm.extY - min_y;
            min_y = this.spPr.xfrm.extY - temp;
        }

        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX*0.5;
        var vc = xfrm.extY*0.5;
        old_x0 = this.spPr.xfrm.offX + hc - (hc*Math.cos(rot) - vc*Math.sin(rot));
        old_y0 = this.spPr.xfrm.offY  + vc - (hc*Math.sin(rot) + vc*Math.cos(rot));
        var t_dx = min_x*Math.cos(rot) - min_y*Math.sin(rot);
        var t_dy = min_x*Math.sin(rot) + min_y*Math.cos(rot);
        var new_x0, new_y0;
        new_x0 = old_x0 + t_dx;
        new_y0 = old_y0 + t_dy;
        var new_hc = Math.abs(max_x - min_x)*0.5;
        var new_vc = Math.abs(max_y - min_y)*0.5;
        var new_xc = new_x0 + (new_hc*Math.cos(rot) - new_vc*Math.sin(rot));
        var new_yc = new_y0 + (new_hc*Math.sin(rot) + new_vc*Math.cos(rot));

        var pos_x, pos_y;
        pos_x = new_xc - new_hc;
        pos_y = new_yc - new_vc;

        var xfrm = this.spPr.xfrm;
        if(this.group || !(editor && editor.isDocumentEditor))
        {
            xfrm.setOffX(pos_x);
            xfrm.setOffY(pos_y);
        }
        xfrm.setExtX(Math.abs(max_x - min_x));
        xfrm.setExtY(Math.abs(max_y - min_y));
        xfrm.setChExtX(Math.abs(max_x - min_x));
        xfrm.setChExtY(Math.abs(max_y - min_y));
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
        for(i = 0; i < sp_tree.length; ++i)
        {
            sp_tree[i].spPr.xfrm.setOffX(sp_tree[i].spPr.xfrm.offX - x_min_clear);
            sp_tree[i].spPr.xfrm.setOffY(sp_tree[i].spPr.xfrm.offY - y_min_clear);
        }
        this.checkDrawingBaseCoords();
        return {posX: pos_x, posY: pos_y};
    };

    CGroupShape.prototype.select = CShape.prototype.select;

    CGroupShape.prototype.deselect = function(drawingObjectsController)
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

    CGroupShape.prototype.getParentObjects = function()
    {
        var parents = {slide: null, layout: null, master: null, theme: null};
        return parents;
    };

    CGroupShape.prototype.getCardDirectionByNum = function(num)
    {
        var num_north = this.getNumByCardDirection(AscFormat.CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if(same_flip)
            return ((num - num_north) + AscFormat.CARD_DIRECTION_N + 8)%8;

        return (AscFormat.CARD_DIRECTION_N - (num - num_north)+ 8)%8;
    };

    CGroupShape.prototype.applyTextArtForm = function(sPreset)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].applyTextArtForm)
            {
                this.spTree[i].applyTextArtForm(sPreset);
            }
        }
    };

    CGroupShape.prototype.getNumByCardDirection = function(cardDirection)
    {
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                north_number = !full_flip_v ? 1 : 5;
                break;
            }
            case y3:
            {
                north_number = !full_flip_h ? 3 : 7;
                break;
            }
            case y5:
            {
                north_number = !full_flip_v ? 5 : 1;
                break;
            }
            default:
            {
                north_number = !full_flip_h ? 7 : 3;
                break;
            }
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;

        if(same_flip)
            return (north_number + cardDirection)%8;
        return (north_number - cardDirection + 8)%8;
    };

    CGroupShape.prototype.getAspect = function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    };

    CGroupShape.prototype.getFullFlipH = function()
    {
        if(!isRealObject(this.group))
            return this.flipH;
        else
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    };

    CGroupShape.prototype.getFullFlipV = function()
    {
        if(!isRealObject(this.group))
            return this.flipV;
        else
            return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    };

    CGroupShape.prototype.getFullRotate = function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    };

    CGroupShape.prototype.createRotateTrack = function()
    {
        return new AscFormat.RotateTrackGroup(this);
    };

    CGroupShape.prototype.createMoveTrack = function()
    {
        return new AscFormat.MoveGroupTrack(this);
    };

    CGroupShape.prototype.createResizeTrack = function(cardDirection)
    {
        return new AscFormat.ResizeTrackGroup(this, cardDirection);
    };

    CGroupShape.prototype.resetSelection = function(graphicObjects)
    {
        this.selection.textSelection = null;
        if(this.selection.chartSelection)
        {
            this.selection.chartSelection.resetSelection();
        }
        this.selection.chartSelection = null;

        for(var i = this.selectedObjects.length - 1; i > -1; --i)
        {
            var old_gr = this.selectedObjects[i].group;
            var obj = this.selectedObjects[i];
            obj.group = this;
            obj.deselect(graphicObjects);
            obj.group = old_gr;
        }
    };

    CGroupShape.prototype.resetInternalSelection = AscFormat.DrawingObjectsController.prototype.resetInternalSelection;

    CGroupShape.prototype.recalculateCurPos = AscFormat.DrawingObjectsController.prototype.recalculateCurPos;

    CGroupShape.prototype.loadDocumentStateAfterLoadChanges = AscFormat.DrawingObjectsController.prototype.loadDocumentStateAfterLoadChanges;

    CGroupShape.prototype.checkDrawingBaseCoords = CShape.prototype.checkDrawingBaseCoords;

    CGroupShape.prototype.setDrawingBaseCoords = CShape.prototype.setDrawingBaseCoords;

    CGroupShape.prototype.deleteBFromSerialize = CShape.prototype.deleteBFromSerialize;

    CGroupShape.prototype.setBFromSerialize = CShape.prototype.setBFromSerialize;

    CGroupShape.prototype.calculateSnapArrays = function(snapArrayX, snapArrayY)
    {
        var sp;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            sp = this.spTree[i];
            sp.calculateSnapArrays(snapArrayX, snapArrayY);
            sp.recalculateSnapArrays();
        }
    };

    CGroupShape.prototype.setNvSpPr = function(pr)
    {
        History.Add(this, {Type: AscDFH.historyitem_GroupShapeSetNvGrpSpPr, oldPr: this.nvGrpSpPr, newPr: pr});
        this.nvGrpSpPr = pr;
    };

    CGroupShape.prototype.Restart_CheckSpelling = function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].Restart_CheckSpelling && this.spTree[i].Restart_CheckSpelling();
        }
    };

    CGroupShape.prototype.recalculateLocalTransform =  CShape.prototype.recalculateLocalTransform;

    CGroupShape.prototype.bringToFront  = function()//перемещаем заселекченые объекты наверх
    {
        var i;
        var arrDrawings = [];
        for(i = this.spTree.length - 1;  i > -1; --i)
        {
            if(this.spTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
            {
                this.spTree[i].bringToFront();
            }
            else if(this.spTree[i].selected)
            {
                arrDrawings.push(this.removeFromSpTreeByPos(i));
            }
        }
        for(i = arrDrawings.length-1; i > -1 ; --i)
        {
            this.addToSpTree(null, arrDrawings[i]);
        }
    };

    CGroupShape.prototype.bringForward  = function()
    {
        var i;
        for(i = this.spTree.length-1; i > -1; --i)
        {
            if(this.spTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
            {
                this.spTree[i].bringForward();
            }
            else if(i < this.spTree.length-1 && this.spTree[i].selected && !this.spTree[i+1].selected)
            {
                var item = this.removeFromSpTreeByPos(i);
                this.addToSpTree(i+1, item);
            }
        }
    };

    CGroupShape.prototype.sendToBack  = function()
    {
        var i, arrDrawings = [];
        for(i = this.spTree.length-1; i > -1; --i)
        {
            if(this.spTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
            {
                this.spTree[i].sendToBack();
            }
            else if(this.spTree[i].selected)
            {
                arrDrawings.push(this.removeFromSpTreeByPos(i));
            }
        }
        arrDrawings.reverse();
        for(i = 0; i < arrDrawings.length; ++i)
        {
            this.addToSpTree(i, arrDrawings[i]);
        }
    };

    CGroupShape.prototype.bringBackward  = function()
    {
        var i;
        for(i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape)
            {
                this.spTree[i].bringBackward();
            }
            else if(i > 0 && this.spTree[i].selected && !this.spTree[i-1].selected)
            {
                this.addToSpTree(i-1, this.removeFromSpTreeByPos(i));
            }
        }
    };

    CGroupShape.prototype.Undo = function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_AutoShapes_SetDrawingBasePos:{
                if(this.drawingBase && this.drawingBase.Pos){
                    this.drawingBase.Pos.X = data.OldPr.X;
                    this.drawingBase.Pos.Y = data.OldPr.Y;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseExt:{
                if(this.drawingBase && this.drawingBase.ext){
                    this.drawingBase.ext.cx = data.OldPr.cx;
                    this.drawingBase.ext.cy = data.OldPr.cy;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseType:{
                if(this.drawingBase){
                    this.drawingBase.Type = data.OldPr;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetLocks:
            {
                this.locks = data.oldPr;
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

            case AscDFH.historyitem_GroupShapeSetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }

            case AscDFH.historyitem_GroupShapeAddToSpTree:
            {
                for(var i = this.spTree.length - 1; i > -1; --i)
                {
                    if(this.spTree[i] === data.item)
                    {
                        this.spTree.splice(i, 1);
                        break;
                    }
                }
                this.handleUpdateSpTree();
                break;
            }
            case AscDFH.historyitem_GroupShapeSetGroup:
            {
                this.group = data.oldPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = data.oldPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeSetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeRemoveFromSpTree:
            {
                this.spTree.splice(data.pos, 0, data.item);
                this.handleUpdateSpTree();
                break;
            }
        }
    };

    CGroupShape.prototype.Redo = function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_AutoShapes_SetDrawingBasePos:{
                if(this.drawingBase && this.drawingBase.Pos){
                    this.drawingBase.Pos.X = data.NewPr.X;
                    this.drawingBase.Pos.Y = data.NewPr.Y;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseExt:{
                if(this.drawingBase && this.drawingBase.ext){
                    this.drawingBase.ext.cx = data.NewPr.cx;
                    this.drawingBase.ext.cy = data.NewPr.cy;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseType:{
                if(this.drawingBase){
                    this.drawingBase.Type = data.NewPr;
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetLocks:
            {
                this.locks = data.newPr;
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

            case AscDFH.historyitem_GroupShapeSetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeAddToSpTree:
            {
                this.spTree.splice(data.pos, 0, data.item);
                this.handleUpdateSpTree();
                break;
            }
            case AscDFH.historyitem_GroupShapeSetGroup:
            {
                this.group = data.newPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = data.newPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeSetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case AscDFH.historyitem_GroupShapeRemoveFromSpTree:
            {
                for(var i = this.spTree.length; i > -1; --i)
                {
                    if(this.spTree[i] === data.item)
                    {
                        this.spTree.splice(i, 1);
                        this.handleUpdateSpTree();
                        break;
                    }
                }
                break;
            }
        }
    };

    CGroupShape.prototype.Refresh_RecalcData = function()
    {};

    CGroupShape.prototype.Save_Changes = function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case AscDFH.historyitem_AutoShapes_SetDrawingBasePos:{

                w.WriteDouble(data.NewPr.X);
                w.WriteDouble(data.NewPr.Y);
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseExt:{
                w.WriteDouble(data.NewPr.cx);
                w.WriteDouble(data.NewPr.cy);
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseType:{

                w.WriteLong(data.NewPr);
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetLocks:
            {
                w.WriteLong(data.newPr);
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
            case AscDFH.historyitem_GroupShapeAddToSpTree:
            case AscDFH.historyitem_GroupShapeRemoveFromSpTree:
            {
                AscFormat.writeLong(w, data.pos);
                AscFormat.writeObject(w, data.item);
                break;
            }
            case AscDFH.historyitem_GroupShapeSetGroup:
            case AscDFH.historyitem_GroupShapeSetNvGrpSpPr:
            case AscDFH.historyitem_GroupShapeSetParent:
            case AscDFH.historyitem_GroupShapeSetSpPr:
            {
                AscFormat.writeObject(w, data.newPr);
                break;
            }

            case AscDFH.historyitem_ShapeSetBDeleted:
            {
                AscFormat.writeBool(w, data.newPr);
                break;
            }
        }
    };

    CGroupShape.prototype.Load_Changes = function(r)
    {
        var type  = r.GetLong();
        switch (type)
        {
            case AscDFH.historyitem_AutoShapes_SetDrawingBasePos:{
                if(this.drawingBase && this.drawingBase.Pos){
                    this.drawingBase.Pos.X = r.GetDouble();
                    this.drawingBase.Pos.Y = r.GetDouble();
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseExt:{
                if(this.drawingBase && this.drawingBase.ext){
                    this.drawingBase.ext.cx = r.GetDouble();
                    this.drawingBase.ext.cy = r.GetDouble();
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetDrawingBaseType:
            {
                if(this.drawingBase)
                {
                    this.drawingBase.Type = r.GetLong();
                }
                break;
            }
            case AscDFH.historyitem_AutoShapes_SetLocks:
            {
                this.locks = r.GetLong();
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
            case AscDFH.historyitem_GroupShapeAddToSpTree:
            {
                var pos = AscFormat.readLong(r);
                var item = AscFormat.readObject(r);
                if(isRealObject(item) && AscFormat.isRealNumber(pos))
                {
                    this.spTree.splice(pos, 0, item);
                }
                this.handleUpdateSpTree();
                break;
            }
            case AscDFH.historyitem_GroupShapeSetGroup:
            {
                this.group = AscFormat.readObject(r);
                break;
            }
            case AscDFH.historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = AscFormat.readObject(r);
                break;
            }
            case AscDFH.historyitem_GroupShapeSetParent:
            {
                this.parent = AscFormat.readObject(r);
                break;
            }
            case AscDFH.historyitem_GroupShapeRemoveFromSpTree:
            {
                var pos = AscFormat.readLong(r);
                var item = AscFormat.readObject(r);
                if(AscFormat.isRealNumber(pos) && isRealObject(item))
                {
                    if(this.spTree[pos] === item)
                    {
                        this.spTree.splice(pos, 1);
                        this.handleUpdateSpTree();
                    }
                }
                break;
            }

            case AscDFH.historyitem_GroupShapeSetSpPr:
            {
                this.spPr = AscFormat.readObject(r);
                break;
            }
        }
    };

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CGroupShape = CGroupShape;
})(window);
