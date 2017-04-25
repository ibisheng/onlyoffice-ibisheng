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

(function(window, undefined){

// Import
var CShape = AscFormat.CShape;
var HitInLine = AscFormat.HitInLine;

var isRealObject = AscCommon.isRealObject;
var History = AscCommon.History;


    window['AscDFH'].drawingsChangesMap[AscDFH.historyitem_GraphicFrameSetSpPr] = function(oClass, value){oClass.spPr = value;};
    window['AscDFH'].drawingsChangesMap[AscDFH.historyitem_GraphicFrameSetGraphicObject] = function(oClass, value){
        oClass.graphicObject = value;
        if(value)
        {
            value.Parent = oClass;
            oClass.graphicObject.Index = 0;
        }
    };
    window['AscDFH'].drawingsChangesMap[AscDFH.historyitem_GraphicFrameSetSetNvSpPr] = function(oClass, value){oClass.nvGraphicFramePr = value;};
    window['AscDFH'].drawingsChangesMap[AscDFH.historyitem_GraphicFrameSetSetParent] = function(oClass, value){oClass.parent = value;};
    window['AscDFH'].drawingsChangesMap[AscDFH.historyitem_GraphicFrameSetSetGroup] = function(oClass, value){oClass.group = value;};

    AscDFH.changesFactory[AscDFH.historyitem_GraphicFrameSetSpPr] = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_GraphicFrameSetGraphicObject] = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_GraphicFrameSetSetNvSpPr] = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_GraphicFrameSetSetParent] = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_GraphicFrameSetSetGroup] = AscDFH.CChangesDrawingsObject;

function CGraphicFrame()
{
	AscFormat.CGraphicObjectBase.call(this);
    this.graphicObject = null;
    this.nvGraphicFramePr = null;

    this.compiledHierarchy = [];
    this.Pages      = [];
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add(this, this.Id);
    this.compiledStyles = [];
    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateSizes: true,
        recalculateNumbering: true,
        recalculateShapeHierarchy: true,
        recalculateTable: true
    };
    this.RecalcInfo = {};
}

	CGraphicFrame.prototype = Object.create(AscFormat.CGraphicObjectBase.prototype);
	CGraphicFrame.prototype.constructor = CGraphicFrame;

CGraphicFrame.prototype.addToRecalculate = CShape.prototype.addToRecalculate;

CGraphicFrame.prototype.Get_Theme = CShape.prototype.Get_Theme;

CGraphicFrame.prototype.Get_ColorMap = CShape.prototype.Get_ColorMap;

CGraphicFrame.prototype.setBDeleted = CShape.prototype.setBDeleted;
CGraphicFrame.prototype.getBase64Img = CShape.prototype.getBase64Img;
CGraphicFrame.prototype.checkDrawingBaseCoords = CShape.prototype.checkDrawingBaseCoords;
CGraphicFrame.prototype.getSlideIndex = CShape.prototype.getSlideIndex;
CGraphicFrame.prototype.Is_UseInDocument = CShape.prototype.Is_UseInDocument;

CGraphicFrame.prototype.Get_DocumentPositionFromObject= function(PosArray)
    {
        if (!PosArray)
            PosArray = [];

        return PosArray;
};

CGraphicFrame.prototype.Is_DrawingShape = function(bRetShape)
    {
        if(bRetShape === true)
        {
            return null;
        }
        return false;
};

CGraphicFrame.prototype.handleUpdatePosition= function()
    {
        this.recalcInfo.recalculateTransform = true;
        this.addToRecalculate();
};

CGraphicFrame.prototype.handleUpdateTheme= function()
    {
        this.compiledStyles = [];
        if(this.graphicObject)
        {
            this.graphicObject.Recalc_CompiledPr2();
            this.graphicObject.RecalcInfo.Recalc_AllCells();
            this.recalcInfo.recalculateSizes          = true;
            this.recalcInfo.recalculateShapeHierarchy = true;
            this.recalcInfo.recalculateTable          = true;
            this.addToRecalculate();
        }
};

CGraphicFrame.prototype.handleUpdateFill= function()
{};

CGraphicFrame.prototype.handleUpdateLn= function()
{};

CGraphicFrame.prototype.handleUpdateExtents= function()
    {
        this.recalcInfo.recalculateTransform = true;
        this.addToRecalculate();
};

CGraphicFrame.prototype.recalcText= function()
    {
        this.compiledStyles = [];
        if(this.graphicObject)
        {
            this.graphicObject.Recalc_CompiledPr2();
            this.graphicObject.RecalcInfo.Reset(true);
        }
        this.recalcInfo.recalculateTable = true;
        this.recalcInfo.recalculateSizes = true;
};

CGraphicFrame.prototype.Get_TextBackGroundColor= function()
    {
        return undefined;
};

CGraphicFrame.prototype.Get_PrevElementEndInfo= function()
    {
        return null;
};

CGraphicFrame.prototype.Get_PageFields= function()
    {
        return editor.WordControl.m_oLogicDocument.Get_PageFields();
};

CGraphicFrame.prototype.Get_ParentTextTransform= function()
    {
        return this.transformText;
};

CGraphicFrame.prototype.getDocContent= function()
    {
        if(this.graphicObject && this.graphicObject.CurCell && ( false === this.graphicObject.Selection.Use || ( true === this.graphicObject.Selection.Use && table_Selection_Text === this.graphicObject.Selection.Type ) ) )
        {
            return this.graphicObject.CurCell.Content;
        }
        return null;
};

CGraphicFrame.prototype.setSpPr= function(spPr)
{
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetSpPr, this.spPr, spPr));
        this.spPr = spPr;
};

CGraphicFrame.prototype.setGraphicObject= function(graphicObject)
    {
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetGraphicObject, this.graphicObject, graphicObject));
        this.graphicObject = graphicObject;
        if(this.graphicObject)
        {
            this.graphicObject.Index = 0;
            this.graphicObject.Parent = this;
        }
};

CGraphicFrame.prototype.setNvSpPr= function(pr)
{
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetSetNvSpPr, this.nvGraphicFramePr, pr));
        this.nvGraphicFramePr = pr;
};

CGraphicFrame.prototype.setParent= function(parent)
{
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetSetParent, this.parent, parent));
        this.parent = parent;
};

CGraphicFrame.prototype.setGroup= function(group)
    {
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetSetGroup, this.group, group));
        this.group = group;
};

CGraphicFrame.prototype.getObjectType= function()
    {
        return AscDFH.historyitem_type_GraphicFrame;
};

CGraphicFrame.prototype.Search = function(Str, Props, SearchEngine, Type)
    {
        if(this.graphicObject)
        {
            this.graphicObject.Search(Str, Props, SearchEngine, Type);
        }
};

CGraphicFrame.prototype.Search_GetId = function(bNext, bCurrent)
    {
        if(this.graphicObject)
        {
            return this.graphicObject.Search_GetId(bNext, bCurrent);
        }

        return null;
};

CGraphicFrame.prototype.copy= function()
    {
        var ret = new CGraphicFrame();
        if(this.graphicObject)
        {
            ret.setGraphicObject(this.graphicObject.Copy(ret));
            if(editor && editor.WordControl && editor.WordControl.m_oLogicDocument && isRealObject(editor.WordControl.m_oLogicDocument.globalTableStyles))
            {
                ret.graphicObject.Reset(0, 0, this.graphicObject.XLimit, this.graphicObject.YLimit, ret.graphicObject.PageNum);
            }
        }
        if(this.nvGraphicFramePr)
        {
            ret.setNvSpPr(this.nvGraphicFramePr.createDuplicate());
        }
        if(this.spPr)
        {
            ret.setSpPr(this.spPr.createDuplicate());
            ret.spPr.setParent(ret);
        }
        ret.setBDeleted(false);

        if(!this.recalcInfo.recalculateTable && !this.recalcInfo.recalculateSizes && !this.recalcInfo.recalculateTransform)
        {
            ret.cachedImage = this.getBase64Img();
            ret.cachedPixW = this.cachedPixW;
            ret.cachedPixH = this.cachedPixH;
        }
        return ret;
};

CGraphicFrame.prototype.isEmptyPlaceholder= function()
    {
        return false;
};

CGraphicFrame.prototype.getAllFonts= function(fonts)
    {
        if(this.graphicObject)
        {
            for(var i = 0; i < this.graphicObject.Content.length; ++i)
            {
                var row = this.graphicObject.Content[i];
                var cells = row.Content;
                for(var j = 0; j < cells.length;++j)
                {
                    cells[j].Content.Document_Get_AllFontNames(fonts);
                }
            }
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
};

CGraphicFrame.prototype.MoveCursorToStartPos = function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.MoveCursorToStartPos();
            this.graphicObject.RecalculateCurPos();

        }
};

CGraphicFrame.prototype.MoveCursorToEndPos = function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.MoveCursorToEndPos();
            this.graphicObject.RecalculateCurPos();

        }
};

CGraphicFrame.prototype.hitInPath= function()
    {
        return false;
};

CGraphicFrame.prototype.paragraphFormatPaste= function(CopyTextPr, CopyParaPr, Bool)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.PasteFormatting(CopyTextPr, CopyParaPr, Bool);

            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }

};

CGraphicFrame.prototype.ClearParagraphFormatting= function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.ClearParagraphFormatting();

            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }

};

CGraphicFrame.prototype.Set_Props= function(props)
    {
        if(this.graphicObject)
        {
            var bApplyToAll = this.parent.graphicObjects.State.textObject !== this;
           // if(bApplyToAll)
           //     this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_Props(props, bApplyToAll);
            //if(bApplyToAll)
            //    this.graphicObject.Set_ApplyToAll(false);
            this.OnContentRecalculate();
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
};

CGraphicFrame.prototype.updateCursorType= function(x, y, e)
    {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        this.graphicObject.UpdateCursorType(tx, ty, 0)
};

CGraphicFrame.prototype.getIsSingleBody = CShape.prototype.getIsSingleBody;

CGraphicFrame.prototype.getHierarchy = CShape.prototype.getHierarchy;

CGraphicFrame.prototype.getAllImages = function (images) {
};

CGraphicFrame.prototype.recalculate = function()
    {
        if(this.bDeleted  || !this.parent)
            return;
        AscFormat.ExecuteNoHistory(function(){
            if(this.recalcInfo.recalculateTable)
            {
                if(this.graphicObject)
                {
                    this.graphicObject.Set_PositionH(Asc.c_oAscHAnchor.Page, false, 0, false);
                    this.graphicObject.Set_PositionV(Asc.c_oAscVAnchor.Page, false, 0, false);
                    this.graphicObject.Parent = this;
                    this.graphicObject.Reset(0, 0, this.spPr.xfrm.extX, 10000, 0);
                    this.graphicObject.Recalculate_Page(0);
                }
                this.recalcInfo.recalculateTable = false;
            }
            if(this.recalcInfo.recalculateSizes)
            {
                this.recalculateSizes();
                this.recalcInfo.recalculateSizes = false;

            }
            if(this.recalcInfo.recalculateTransform)
            {
                this.recalculateTransform();
            this.recalculateSnapArrays();
                this.recalcInfo.recalculateTransform = false;
                this.transformText = this.transform;
                this.invertTransformText = this.invertTransform;
                this.cachedImage = null;
                this.bounds.l = this.x;
                this.bounds.t = this.y;
                this.bounds.r = this.x + this.extX;
                this.bounds.b = this.y + this.extY;
                this.bounds.x = this.x;
                this.bounds.y = this.y;
                this.bounds.w = this.extX;
                this.bounds.h = this.extY;
            }
        }, this, []);

};

CGraphicFrame.prototype.recalculateSizes = function()
    {
        if(this.graphicObject)
        {
            this.graphicObject.XLimit -= this.graphicObject.X;
            this.graphicObject.X = 0;
            this.graphicObject.Y = 0;
            this.graphicObject.X_origin = 0;
            var _page_bounds = this.graphicObject.Get_PageBounds(0);
            this.spPr.xfrm.extY = _page_bounds.Bottom - _page_bounds.Top;
            this.spPr.xfrm.extX = _page_bounds.Right - _page_bounds.Left;
            this.extX =  this.spPr.xfrm.extX;
            this.extY =  this.spPr.xfrm.extY;
        }
};

CGraphicFrame.prototype.GetSelectDirection = function()
    {
        return 0;
};

CGraphicFrame.prototype.recalculateCurPos = function()
    {
        this.graphicObject.RecalculateCurPos();
};

CGraphicFrame.prototype.isShape = function()
    {
        return false;
};

CGraphicFrame.prototype.isImage = function()
    {
        return false;
};

CGraphicFrame.prototype.isGroup = function()
    {
        return false;
};

CGraphicFrame.prototype.isChart = function()
    {
        return false;
};

CGraphicFrame.prototype.isTable = function()
    {
        return this.graphicObject instanceof CTable;
};

CGraphicFrame.prototype.CanAddHyperlink = function(bCheck)
    {
        if(this.graphicObject)
            return this.graphicObject.CanAddHyperlink(bCheck);
        return false;
};

CGraphicFrame.prototype.IsCursorInHyperlink = function(bCheck)
    {
        if(this.graphicObject)
            return this.graphicObject.IsCursorInHyperlink(bCheck);
        return false;
};

CGraphicFrame.prototype.getTransformMatrix = function()
    {
        return this.transform;
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
};

CGraphicFrame.prototype.OnContentReDraw = function()
{};

CGraphicFrame.prototype.getRectBounds = function()
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

CGraphicFrame.prototype.changeSize = function(kw, kh)
    {
        if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            xfrm.setOffX(xfrm.offX * kw);
            xfrm.setOffY(xfrm.offY * kh);
        }
        this.recalcTransform && this.recalcTransform();
};

CGraphicFrame.prototype.recalcTransform = function()
    {
        this.recalcInfo.recalculateTransform = true;
};

CGraphicFrame.prototype.getTransform = function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return {x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV};
};

CGraphicFrame.prototype.canRotate = function()
    {
        return false;
};

CGraphicFrame.prototype.canResize = function()
    {
        return false;
};

CGraphicFrame.prototype.canMove = function()
    {
        return true;
};

CGraphicFrame.prototype.canGroup = function()
    {
        return false;
};

CGraphicFrame.prototype.createRotateTrack = function()
    {
        return new AscFormat.RotateTrackShapeImage(this);
};

CGraphicFrame.prototype.createResizeTrack = function(cardDirection)
    {
        return new AscFormat.ResizeTrackShapeImage(this, cardDirection);
};

CGraphicFrame.prototype.createMoveTrack = function()
    {
        return new AscFormat.MoveShapeImageTrack(this);
};

CGraphicFrame.prototype.getSnapArrays = function(snapX, snapY)
    {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX*0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY*0.5);
        snapY.push(transform.ty + this.extY);
};

CGraphicFrame.prototype.hitInInnerArea = function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
};

CGraphicFrame.prototype.hitInTextRect = function(x, y)
    {
        return this.hitInInnerArea(x, y);
};

CGraphicFrame.prototype.getInvertTransform = function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        return this.invertTransform;
};

CGraphicFrame.prototype.hitInBoundingRect = function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.getParentObjects().presentation.DrawingDocument.CanvasHitContext;

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
};

CGraphicFrame.prototype.Document_UpdateRulersState  = function(margins)
    {
        if(this.graphicObject)
        {
            this.graphicObject.Document_UpdateRulersState(this.parent.num);
        }
};

CGraphicFrame.prototype.Get_PageLimits  = function(PageIndex)
    {
        return { X : 0, Y : 0, XLimit : Page_Width, YLimit : Page_Height };
};

CGraphicFrame.prototype.getParentObjects = CShape.prototype.getParentObjects;

CGraphicFrame.prototype.Is_HdrFtr = function(bool)
    {
        if(bool) return null;
        return false;
};

CGraphicFrame.prototype.Is_TableCellContent = function()
    {
        return false;
};

CGraphicFrame.prototype.Check_AutoFit = function()
    {
        return false;
};

CGraphicFrame.prototype.Is_InTable = function()
    {
        return null;
};

CGraphicFrame.prototype.selectionSetStart = function(e, x, y, slideIndex)
    {
        if ( AscCommon.g_mouse_button_right === e.Button )
        {
            this.rightButtonFlag = true;
            return;
        }
        if(isRealObject(this.graphicObject))
        {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            if(AscCommon.g_mouse_event_type_down === e.Type)
            {
                if(this.graphicObject.IsTableBorder( tx, ty, 0))
                {
                    if(!editor.isViewMode && editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props) === false)
                    {
                        History.Create_NewPoint(AscDFH.historydescription_Presentation_TableBorder);
                    }
                    else
                    {
                        return;
                    }
                }
            }
            this.graphicObject.Selection_SetStart(tx, ty, this.parent.num, e);
            this.graphicObject.RecalculateCurPos();
            return;
        }
};

CGraphicFrame.prototype.selectionSetEnd = function(e, x, y, slideIndex)
    {
        if(AscCommon.g_mouse_event_type_move === e.Type)
        {
            this.rightButtonFlag = false;
        }
        if(this.rightButtonFlag && AscCommon.g_mouse_event_type_up === e.Type)
        {
            this.rightButtonFlag = false;
            return;
        }
        if(isRealObject(this.graphicObject))
        {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            //var bBorder = this.graphicObject.Selection.Type2 === table_Selection_Border;
            this.graphicObject.Selection_SetEnd(tx, ty, 0, e);
            //if(g_mouse_event_type_up === e.Type && bBorder)
            //    editor.WordControl.m_oLogicDocument.Recalculate();  TODO: пересчет вызывается в CTable
        }
};

CGraphicFrame.prototype.updateSelectionState = function()
    {
        if(isRealObject(this.graphicObject))
        {
            var drawingDocument = this.parent.presentation.DrawingDocument;
            var Doc = this.graphicObject;
            if ( true === Doc.IsSelectionUse() && !Doc.IsSelectionEmpty()) {
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetEnd();
                drawingDocument.SelectEnabled(true);
                drawingDocument.SelectClear();
                Doc.DrawSelectionOnPage(0);
                drawingDocument.SelectShow();
            }
            else
            {
                drawingDocument.SelectEnabled(false);
                Doc.RecalculateCurPos();
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetShow();
            }
        }
        else
        {
            this.parent.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.parent.presentation.DrawingDocument.TargetEnd();
            this.parent.presentation.DrawingDocument.SelectEnabled(false);
            this.parent.presentation.DrawingDocument.SelectClear();
            this.parent.presentation.DrawingDocument.SelectShow();
        }
};

CGraphicFrame.prototype.Get_AbsolutePage  = function(CurPage)
    {
        return this.Get_StartPage_Absolute();
};

CGraphicFrame.prototype.Get_AbsoluteColumn  = function(CurPage)
    {
        return 0;
};

CGraphicFrame.prototype.Is_TopDocument = function()
    {
        return false;
};

CGraphicFrame.prototype.drawAdjustments = function()
{};

CGraphicFrame.prototype.recalculateTransform = CShape.prototype.recalculateTransform;

CGraphicFrame.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;

CGraphicFrame.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;

CGraphicFrame.prototype.addToDrawingObjects = CShape.prototype.addToDrawingObjects;

CGraphicFrame.prototype.select = CShape.prototype.select;

CGraphicFrame.prototype.deselect = CShape.prototype.deselect;

CGraphicFrame.prototype.Update_ContentIndexing = function()
{};
    
CGraphicFrame.prototype.Get_TopDocumentContent = function()
{
    return null;
};

CGraphicFrame.prototype.draw = function(graphics)
    {
        if (graphics.IsSlideBoundsCheckerType === true) {
            graphics.transform3(this.transform);
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.extX, 0);
            graphics._l(this.extX, this.extY);
            graphics._l(0, this.extY);
            graphics._e();
            return;
        }
        if(this.graphicObject)
        {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            if(AscCommon.locktype_None != this.Lock.Get_Type() && !this.group)
                graphics.DrawLockObjectRect(this.Lock.Get_Type() , 0, 0, this.extX, this.extY);
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
};

CGraphicFrame.prototype.Select = function()
{};

CGraphicFrame.prototype.Set_CurrentElement = function()
    {
        if(this.parent && this.parent.graphicObjects)
        {
            this.parent.graphicObjects.resetSelection(true);
            if(this.group)
            {
                var main_group = this.group.getMainGroup();
                this.parent.graphicObjects.selectObject(main_group, 0);
                main_group.selectObject(this, 0);
                main_group.selection.textSelection = this;
            }
            else
            {
                this.parent.graphicObjects.selectObject(this, 0);
                this.parent.graphicObjects.selection.textSelection = this;
            }
            if(editor.WordControl.m_oLogicDocument.CurPage !== this.parent.num)
            {
                editor.WordControl.m_oLogicDocument.Set_CurPage(this.parent.num);
                editor.WordControl.GoToPage(this.parent.num);
            }
        }
};

CGraphicFrame.prototype.OnContentRecalculate = function()
    {
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.Document_UpdateRulersState();
};

CGraphicFrame.prototype.getTextSelectionState = function()
    {
        return this.graphicObject.GetSelectionState();
};

CGraphicFrame.prototype.setTextSelectionState = function(Sate)
    {
        return this.graphicObject.SetSelectionState(Sate, Sate.length-1);
};

CGraphicFrame.prototype.isPlaceholder = function()
    {
        return this.nvGraphicFramePr &&  this.nvGraphicFramePr.nvPr && this.nvGraphicFramePr.nvPr.ph !== null;
};

CGraphicFrame.prototype.getPhType = function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.type;
        }
        return null;
};

CGraphicFrame.prototype.getPhIndex = function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.idx;
        }
        return null;
};

CGraphicFrame.prototype.getPlaceholderType = function()
    {
        return this.getPhType();
};

CGraphicFrame.prototype.getPlaceholderIndex = function()
    {
        return this.getPhIndex();
};

CGraphicFrame.prototype.paragraphAdd = function(paraItem, bRecalculate)
    {
};

CGraphicFrame.prototype.applyTextFunction = function(docContentFunction, tableFunction, args)
    {
        if(tableFunction === CTable.prototype.AddToParagraph)
        {
            if((args[0].Type === para_NewLine
                || args[0].Type === para_Text
                || args[0].Type === para_Space
                || args[0].Type === para_Tab
                || args[0].Type === para_PageNum)
                && this.graphicObject.Selection.Use)
            {
                this.graphicObject.Remove(1, true, undefined, true);
            }
        }
        else if(tableFunction === CTable.prototype.AddNewParagraph)
        {
            this.graphicObject.Selection.Use && this.graphicObject.Remove(1, true, undefined, true);
        }
        tableFunction.apply(this.graphicObject, args);
};

CGraphicFrame.prototype.remove = function(Count, bOnlyText, bRemoveOnlySelection)
    {
        this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
};

CGraphicFrame.prototype.addNewParagraph = function()
    {
        this.graphicObject.AddNewParagraph(false);
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
};

CGraphicFrame.prototype.setParagraphAlign = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.SetParagraphAlign(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
        }
};

CGraphicFrame.prototype.applyAllAlign = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.SetParagraphAlign(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
};

CGraphicFrame.prototype.setParagraphSpacing = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.SetParagraphSpacing(val);
        }
};

CGraphicFrame.prototype.applyAllSpacing = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.SetParagraphSpacing(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
};

CGraphicFrame.prototype.setParagraphNumbering = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.SetParagraphNumbering(val);
        }
};

CGraphicFrame.prototype.setParagraphIndent = function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.SetParagraphIndent(val);
        }
};

CGraphicFrame.prototype.setParent2 = function(parent)
    {
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_GraphicFrameSetSetParent, this.parent, parent));
        this.parent = parent;
};

CGraphicFrame.prototype.setWordFlag = function(bPresentation, Document)
    {
        if(this.graphicObject)
        {
            this.graphicObject.bPresentation = bPresentation;
            for(var i = 0; i < this.graphicObject.Content.length; ++i)
            {
                var row = this.graphicObject.Content[i];
                for(var j = 0; j < row.Content.length; ++j)
                {
                    var content = row.Content[j].Content;
                    if(!bPresentation && Document)
                    {
                        content.Styles = Document.Styles;
                    }
                    else
                    {
                        content.Styles = null;
                    }
                    content.bPresentation = bPresentation;
                    for(var k = 0; k < content.Content.length; ++k)
                    {
                        content.Content[k].bFromDocument = !bPresentation;
                    }
                }
            }
        }
};

CGraphicFrame.prototype.Get_Styles = function(level)
    {
        if(AscFormat.isRealNumber(level))
        {
            if(!this.compiledStyles[level])
            {
                CShape.prototype.recalculateTextStyles.call(this, level);
            }
            return this.compiledStyles[level];
        }
        else
        {
            return editor.WordControl.m_oLogicDocument.globalTableStyles;
        }
};

CGraphicFrame.prototype.Get_StartPage_Absolute = function()
    {
        return this.parent.num;
};

CGraphicFrame.prototype.Get_PageContentStartPos = function(PageNum)
    {
        var presentation = editor.WordControl.m_oLogicDocument;
        return {
            X : 0,
            XLimit: presentation.Width,
            Y : 0,
            YLimit : presentation.Height,
            MaxTopBorder : 0
        };


};

CGraphicFrame.prototype.Get_PageContentStartPos2 = function()
    {
        return this.Get_PageContentStartPos();
};

CGraphicFrame.prototype.hitToHandles = function()
    {
        return -1;
};

CGraphicFrame.prototype.hitToAdjustment = function()
    {
        return {hit:false};
};

CGraphicFrame.prototype.Refresh_RecalcData = function()
    {
        this.Refresh_RecalcData2();
};

CGraphicFrame.prototype.Refresh_RecalcData2 = function()
    {
        this.recalcInfo.recalculateTable = true;
        this.recalcInfo.recalculateSizes = true;
        this.addToRecalculate();
    };
CGraphicFrame.prototype.checkTypeCorrect = function()
    {
        if(!this.graphicObject){
            return false;
        }
        return true;
    };
CGraphicFrame.prototype.Is_ThisElementCurrent = function()
    {
        if(this.parent && this.parent.graphicObjects)
        {
            if(this.group)
            {
                var main_group = this.group.getMainGroup();
                return main_group.selection.textSelection === this;
            }
            else
            {
                return this.parent.graphicObjects.selection.textSelection === this;
            }
        }
        return false;
    };

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CGraphicFrame = CGraphicFrame;
})(window);
