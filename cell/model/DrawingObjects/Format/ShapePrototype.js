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

var History = AscCommon.History;

var G_O_DEFAULT_COLOR_MAP = AscFormat.GenerateDefaultColorMap();

CShape.prototype.setDrawingObjects = function(drawingObjects)
{
};


    CShape.prototype.getEditorType = function()
    {
        return 0;
    };
CShape.prototype.setDrawingBase = function(drawingBase)
{
    this.drawingBase = drawingBase;
    if(Array.isArray(this.spTree))
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].setDrawingBase(drawingBase);
        }
    }
};

CShape.prototype.Get_Numbering =  function()
{
    return new CNumbering();
};

CShape.prototype.getTextArtTranslate = function()
{
    return Asc["editor"].textArtTranslate;
};

CShape.prototype.Is_UseInDocument = function(){
    if(this.group)
    {
        var aSpTree = this.group.spTree;
        for(var i = 0; i < aSpTree.length; ++i)
        {
            if(aSpTree[i] === this)
            {
                return this.group.Is_UseInDocument();
            }
        }
        return false;
    }
    if(this.drawingBase)
    {
        return this.drawingBase.isUseInDocument();
    }
    return false;
};

CShape.prototype.isEmptyPlaceholder = function()
{
    return false;
};

CShape.prototype.getTextArtPreviewManager = function()
{
    return Asc["editor"].textArtPreviewManager;
};

CShape.prototype.getDrawingObjectsController = function()
{
    var wsViews = Asc["editor"] && Asc["editor"].wb && Asc["editor"].wb.wsViews;
    if(wsViews)
    {
        for(var i = 0; i < wsViews.length; ++i)
        {
            if(wsViews[i] && wsViews[i].model === this.worksheet && wsViews[i].objectRender)
                return wsViews[i].objectRender.controller;
        }
    }
    return null;
};

CShape.prototype.hitInTextRect = function (x, y)
{
    var oController = this.getDrawingObjectsController && this.getDrawingObjectsController();
    if(oController && (AscFormat.getTargetTextObject(oController) === this || (oController.curState.startTargetTextObject === this)))
    {
        var content = this.getDocContent && this.getDocContent();
        if ( content && this.invertTransformText)
        {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < this.contentWidth && t_y > 0 && t_y < this.contentHeight;
        }
    }
    else
    {
        if (window.AscDisableTextSelection)
            return;


        return this.hitInTextRectWord(x, y);
    }

    return false;
};

function addToDrawings(worksheet, graphic, position, lockByDefault, anchor)
{

    var drawingObjects;
    var wsViews = Asc["editor"].wb.wsViews;
    for(var i = 0; i < wsViews.length; ++i)
    {
        if(wsViews[i] && wsViews[i].model === worksheet)
        {
            drawingObjects = wsViews[i].objectRender;
            break;
        }
    }
    if(!drawingObjects)
    {
        drawingObjects = new AscFormat.DrawingObjects();
    }
    var oldDrawingBase = graphic.drawingBase;

    var drawingObject = drawingObjects.createDrawingObject(anchor);
    drawingObject.graphicObject = graphic;
    graphic.setDrawingBase(drawingObject);
    if(!worksheet)
        return;
    var ret, aObjects = worksheet.Drawings;
    if (AscFormat.isRealNumber(position) && position > -1 && position <= aObjects.length) {
        aObjects.splice(position, 0, drawingObject);
        ret = position;
    }
    else {
        ret = aObjects.length;
        aObjects.push(drawingObject);
    }

    /*if ( lockByDefault ) {
     _this.objectLocker.reset();
     _this.objectLocker.addObjectId(drawingObject.graphicObject.Id);
     _this.objectLocker.checkObjects( function(result) {} );
     }
     worksheet.setSelectionShape(true);  */
    if(oldDrawingBase)
    {
        drawingObject.from.col = oldDrawingBase.from.col;
        drawingObject.from.colOff = oldDrawingBase.from.colOff;
        drawingObject.from.row = oldDrawingBase.from.row;
        drawingObject.from.rowOff = oldDrawingBase.from.rowOff;

        drawingObject.to.col = oldDrawingBase.to.col;
        drawingObject.to.colOff = oldDrawingBase.to.colOff;
        drawingObject.to.row = oldDrawingBase.to.row;
        drawingObject.to.rowOff = oldDrawingBase.to.rowOff;
    }
    if(graphic.recalcTransform)
    {
        graphic.recalcTransform();
        if(graphic.recalcBounds)
        {
            graphic.recalcBounds();
        }
        graphic.addToRecalculate();
    }

    return ret;
}

function CChangesDrawingObjectsAddToDrawingObjects(Class, Pos){
    this.Pos = Pos;
    this.Type = AscDFH.historyitem_AutoShapes_AddToDrawingObjects;
	AscDFH.CChangesBase.call(this, Class);
}
	CChangesDrawingObjectsAddToDrawingObjects.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingObjectsAddToDrawingObjects.prototype.constructor = CChangesDrawingObjectsAddToDrawingObjects;
    CChangesDrawingObjectsAddToDrawingObjects.prototype.Undo = function(){
        AscFormat.deleteDrawingBase(this.Class.worksheet.Drawings, this.Class.Get_Id());
    };
    CChangesDrawingObjectsAddToDrawingObjects.prototype.Redo = function(){
        AscFormat.addToDrawings(this.Class.worksheet, this.Class, this.Pos);
    };
    CChangesDrawingObjectsAddToDrawingObjects.prototype.WriteToBinary = function(Writer){
        Writer.WriteLong(this.Pos);
    };
    CChangesDrawingObjectsAddToDrawingObjects.prototype.ReadFromBinary = function(Reader){
        this.Pos = Reader.GetLong();
    };

    CChangesDrawingObjectsAddToDrawingObjects.prototype.CreateReverseChange = function(){
        return new CChangesDrawingObjectsRemoveFromDrawingObjects(this.Class, this.Pos);
    };

    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_AddToDrawingObjects] = CChangesDrawingObjectsAddToDrawingObjects;
function CChangesDrawingObjectsRemoveFromDrawingObjects(Class, Pos){
    this.Type = AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects;
    this.Pos = Pos;
	AscDFH.CChangesBase.call(this, Class);
}
	CChangesDrawingObjectsRemoveFromDrawingObjects.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.constructor = CChangesDrawingObjectsRemoveFromDrawingObjects;
    CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.Undo = function(){
        AscFormat.addToDrawings(this.Class.worksheet, this.Class, this.Pos);
    };
    CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.Redo = function(){
        AscFormat.deleteDrawingBase(this.Class.worksheet.Drawings, this.Class.Get_Id());
    };
    CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.WriteToBinary = function(Writer){
        Writer.WriteLong(this.Pos);
    };
    CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.ReadFromBinary = function(Reader){
        this.Pos = Reader.GetLong();
    };

    CChangesDrawingObjectsRemoveFromDrawingObjects.prototype.CreateReverseChange = function(){
        return new CChangesDrawingObjectsAddToDrawingObjects(this.Class, this.Pos);
    };

    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects] = CChangesDrawingObjectsRemoveFromDrawingObjects;

CShape.prototype.addToDrawingObjects =  function(pos, type)
{
    var position = addToDrawings(this.worksheet, this, pos, /*lockByDefault*/undefined, undefined);
    //var data = {Type: AscDFH.historyitem_AutoShapes_AddToDrawingObjects, Pos: position};
    History.Add(new CChangesDrawingObjectsAddToDrawingObjects(this, position));
    //this.worksheet.addContentChanges(new AscCommon.CContentChangesElement(AscCommon.contentchanges_Add, data.Pos, 1, data));
    var nv_sp_pr, bNeedSet = false;
    switch(this.getObjectType()){
        case AscDFH.historyitem_type_Shape:{
            if(!this.nvSpPr){
                bNeedSet = true;
            }
            break;
        }
        case AscDFH.historyitem_type_ChartSpace:{
            if(!this.nvGraphicFramePr){
                bNeedSet = true;
            }
            break;
        }
        case AscDFH.historyitem_type_ImageShape:{
            if(!this.nvPicPr){
                bNeedSet = true;
            }
            break;
        }
        case AscDFH.historyitem_type_GroupShape:{
            if(!this.nvGrpSpPr){
                bNeedSet = true;
            }
            break;
        }
    }
    if(bNeedSet){
        nv_sp_pr = new AscFormat.UniNvPr();
        nv_sp_pr.cNvPr.setId(++AscFormat.Ax_Counter.GLOBAL_AX_ID_COUNTER);
        this.setNvSpPr(nv_sp_pr);
    }
};


CShape.prototype.deleteDrawingBase = function()
{
    var position = AscFormat.deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
    if(AscFormat.isRealNumber(position))
    {
        //var data = {Type: AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects, Pos: position};
        History.Add(new CChangesDrawingObjectsRemoveFromDrawingObjects(this, position));
        //this.worksheet.addContentChanges(new AscCommon.CContentChangesElement(AscCommon.contentchanges_Remove, data.Pos, 1, data));
    }
    return position;
};

function getDrawingObjects_Sp(sp)
{
    var controller = sp.getDrawingObjectsController();
    return controller && controller.drawingObjects;
}

CShape.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalculateContent:        true,
        recalculateBrush:          true,
        recalculatePen:            true,
        recalculateTransform:      true,
        recalculateTransformText:  true,
        recalculateBounds:         true,
        recalculateGeometry:       true,
        recalculateStyle:          true,
        recalculateFill:           true,
        recalculateLine:           true,
        recalculateTransparent:    true,
        recalculateTextStyles:     [true, true, true, true, true, true, true, true, true],
        oContentMetrics: null
    };
    this.compiledStyles = [];
    this.lockType = AscCommon.c_oAscLockTypes.kLockTypeNone;
};
CShape.prototype.recalcContent = function()
{
    this.recalcInfo.recalculateContent = true;
};

CShape.prototype.getDrawingDocument = function()
{
    if(this.worksheet)
        return this.worksheet.DrawingDocument;
    var drawingObjects =  getDrawingObjects_Sp(this);
    return drawingObjects && drawingObjects.drawingDocument;
};

CShape.prototype.recalcBrush = function()
{
    this.recalcInfo.recalculateBrush = true;
};

CShape.prototype.recalcPen = function()
{
    this.recalcInfo.recalculatePen = true;
};
CShape.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CShape.prototype.recalcTransformText = function()
{
    this.recalcInfo.recalculateTransformText = true;
};
CShape.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CShape.prototype.recalcGeometry = function()
{
    this.recalcInfo.recalculateGeometry = true;
};
CShape.prototype.recalcStyle = function()
{
    this.recalcInfo.recalculateStyle = true;
};
CShape.prototype.recalcFill = function()
{
    this.recalcInfo.recalculateFill = true;
};
CShape.prototype.recalcLine = function()
{
    this.recalcInfo.recalculateLine = true;
};
CShape.prototype.recalcTransparent = function()
{
    this.recalcInfo.recalculateTransparent = true;
};
CShape.prototype.recalcTextStyles = function()
{
    this.recalcInfo.recalculateTextStyles =  [true, true, true, true, true, true, true, true, true];
};
CShape.prototype.addToRecalculate = function()
{
    var controller = this.getDrawingObjectsController && this.getDrawingObjectsController();
    if(controller)
    {
        controller.objectsForRecalculate[this.Id] = this;
    }
};

CShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.recalcBounds();
    this.recalcTransformText();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CShape.prototype.handleUpdateExtents = function()
{
    this.recalcContent();
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcContent();
    this.addToRecalculate();
   //delete this.fromSerialize;
};
CShape.prototype.handleUpdateRot = function()
{
    this.recalcTransform();
    if(this.txBody && this.txBody.bodyPr && this.txBody.bodyPr.upright)
    {
        this.recalcContent();
    }
    this.recalcTransformText();
    this.recalcBounds();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CShape.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.recalcTransformText();
    this.recalcContent();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CShape.prototype.handleUpdateFill = function()
{
    this.recalcBrush();
    this.recalcFill();
    this.recalcTransparent();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateLn = function()
{
    this.recalcPen();
    this.recalcLine();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateGeometry = function()
{
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcContent();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.convertPixToMM = function(pix)
{
    var drawingObjects =  getDrawingObjects_Sp(this);
    return drawingObjects ? drawingObjects.convertMetric(pix, 0, 3) : 0;
};
CShape.prototype.getCanvasContext = function()
{
    var drawingObjects =  getDrawingObjects_Sp(this);
    return drawingObjects ? drawingObjects.getCanvasContext() : null;
};
CShape.prototype.getCompiledStyle = function()
{
    return this.style;
};
CShape.prototype.getHierarchy = function()
{
    return [];
};
CShape.prototype.getParentObjects = function ()
{
    return { slide: null, layout: null, master: null, theme: window["Asc"]["editor"].wbModel.theme};
};

CShape.prototype.recalcText = function()
{
    this.recalcInfo.recalculateContent = true;
    this.recalcInfo.recalculateTransformText = true;
};

CShape.prototype.recalculate = function ()
{
    if(this.bDeleted)
        return;
    AscFormat.ExecuteNoHistory(function(){
        if (this.recalcInfo.recalculateBrush) {
            this.recalculateBrush();
            this.recalcInfo.recalculateBrush = false;
        }

        if (this.recalcInfo.recalculatePen) {
            this.recalculatePen();
            this.recalcInfo.recalculatePen = false;
        }
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalculateSnapArrays();
            this.recalcInfo.recalculateTransform = false;
        }

        if (this.recalcInfo.recalculateGeometry) {
            this.recalculateGeometry();
            this.recalcInfo.recalculateGeometry = false;
        }

        if (this.recalcInfo.recalculateContent) {
            this.recalcInfo.oContentMetrics = this.recalculateContent();
            this.recalcInfo.recalculateContent = false;
        }

        if (this.recalcInfo.recalculateTransformText) {
            this.recalculateTransformText();
            this.recalcInfo.recalculateTransformText = false;
        }

        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }

    }, this, []);
};
    
CShape.prototype.recalculateBounds = function()
{
    var boundsChecker = new  AscFormat.CSlideBoundsChecker();
    this.draw(boundsChecker);
    boundsChecker.CorrectBounds();

    this.bounds.x = boundsChecker.Bounds.min_x;
    this.bounds.y = boundsChecker.Bounds.min_y;
    this.bounds.l = boundsChecker.Bounds.min_x;
    this.bounds.t = boundsChecker.Bounds.min_y;
    this.bounds.r = boundsChecker.Bounds.max_x;
    this.bounds.b = boundsChecker.Bounds.max_y;
    this.bounds.w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
    this.bounds.h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
    if(this.drawingBase && !this.group)
    {
        this.drawingBase.checkBoundsFromTo();
    }
};

CShape.prototype.recalculateContent = function()
{
    var content = this.getDocContent();
    if(content){
        var body_pr = this.getBodyPr();

        var oRecalcObj = this.recalculateDocContent(content, body_pr);
        this.contentWidth = oRecalcObj.w;
        this.contentHeight = oRecalcObj.contentH;
        if(this.txBody)
        {
            this.txBody.contentWidth = this.contentWidth;
            this.txBody.contentHeight = this.contentHeight;
        }
        this.recalcInfo.oContentMetrics = oRecalcObj;
        if(this.recalcInfo.recalcTitle)
        {
            this.recalcInfo.bRecalculatedTitle = true;
            this.recalcInfo.recalcTitle = null;


            var oTextWarpContent = this.checkTextWarp(content, body_pr, oRecalcObj.textRectW + oRecalcObj.correctW, oRecalcObj.textRectH + oRecalcObj.correctH, true, false);
            this.txWarpStructParamarks = oTextWarpContent.oTxWarpStructParamarksNoTransform;
            this.txWarpStruct = oTextWarpContent.oTxWarpStructNoTransform;

            this.txWarpStructParamarksNoTransform = oTextWarpContent.oTxWarpStructParamarksNoTransform;
            this.txWarpStructNoTransform = oTextWarpContent.oTxWarpStructNoTransform;
        }
        else
        {
            var oTextWarpContent = this.checkTextWarp(content, body_pr, oRecalcObj.textRectW + oRecalcObj.correctW, oRecalcObj.textRectH + oRecalcObj.correctH, true, true);
            this.txWarpStructParamarks = oTextWarpContent.oTxWarpStructParamarks;
            this.txWarpStruct = oTextWarpContent.oTxWarpStruct;

            this.txWarpStructParamarksNoTransform = oTextWarpContent.oTxWarpStructParamarksNoTransform;
            this.txWarpStructNoTransform = oTextWarpContent.oTxWarpStructNoTransform;
        }
        return oRecalcObj;
    }
    else{
        this.txWarpStructParamarks = null;
        this.txWarpStruct = null;

        this.txWarpStructParamarksNoTransform = null;
        this.txWarpStructNoTransform = null;

        this.recalcInfo.warpGeometry = null;
    }
    return null;
};

CShape.prototype.Get_ColorMap = function()
{
    return G_O_DEFAULT_COLOR_MAP;
};

CShape.prototype.getStyles = function(index)
{
    return this.Get_Styles(index);
};

CShape.prototype.Get_Worksheet = function()
{
    return this.worksheet;
};



    CShape.prototype.Set_CurrentElement = function()
    {

        var drawing_objects = this.getDrawingObjectsController();
        if(drawing_objects)
        {
            drawing_objects.resetSelection(true);
            if(this.group)
            {
                var main_group = this.group.getMainGroup();
                drawing_objects.selectObject(main_group, 0);
                main_group.selectObject(this, 0);
                main_group.selection.textSelection = this;
                drawing_objects.selection.groupSelection = main_group;
            }
            else
            {
                drawing_objects.selectObject(this, 0);
                drawing_objects.selection.textSelection = this;
            }
        }
    };

AscFormat.CTextBody.prototype.Get_Worksheet = function()
{
    return this.parent && this.parent.Get_Worksheet && this.parent.Get_Worksheet();
};
AscFormat.CTextBody.prototype.getDrawingDocument = function()
{
    return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
};

    //------------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].G_O_DEFAULT_COLOR_MAP = G_O_DEFAULT_COLOR_MAP;
    window['AscFormat'].addToDrawings = addToDrawings;
})(window);
