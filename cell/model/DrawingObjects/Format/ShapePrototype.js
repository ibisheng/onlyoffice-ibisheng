"use strict";

// Import
var CShape = AscFormat.CShape;

var G_O_DEFAULT_COLOR_MAP = AscFormat.GenerateDefaultColorMap();

CShape.prototype.setDrawingObjects = function(drawingObjects)
{
};
CShape.prototype.setWorksheet = function(worksheet)
{
    History.Add(this, {Type: AscDFH.historyitem_AutoShapes_SetWorksheet, oldPr: this.worksheet, newPr: worksheet});
    this.worksheet = worksheet;
    if(this.spTree)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].setWorksheet(worksheet);
        }
    }
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
    if (AscFormat.isRealNumber(position)) {
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

function deleteDrawingBase(aObjects, graphicId)
{
    var position = null;
    for (var i = 0; i < aObjects.length; i++) {
        if ( aObjects[i].graphicObject.Get_Id() == graphicId ) {
            aObjects.splice(i, 1);
            position = i;
            break;
        }
    }
    return position;
}

CShape.prototype.addToDrawingObjects =  function(pos)
{
    var controller = this.getDrawingObjectsController();
    var position = addToDrawings(this.worksheet, this, pos, /*lockByDefault*/undefined, undefined);
    var data = {Type: AscDFH.historyitem_AutoShapes_AddToDrawingObjects, Pos: position};
    History.Add(this, data);
    this.worksheet.addContentChanges(new AscCommon.CContentChangesElement(AscCommon.contentchanges_Add, data.Pos, 1, data));
};


CShape.prototype.deleteDrawingBase = function()
{
    var position = deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
    if(AscFormat.isRealNumber(position))
    {
        var data = {Type: AscDFH.historyitem_AutoShapes_RemoveFromDrawingObjects, Pos: position};
        History.Add(this, data);
        this.worksheet.addContentChanges(new AscCommon.CContentChangesElement(AscCommon.contentchanges_Remove, data.Pos, 1, data));
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
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
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
            this.calculateSnapArrays();
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
    if(content)
    {
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

AscFormat.CTextBody.prototype.Get_Worksheet = function()
{
    return this.parent && this.parent.Get_Worksheet && this.parent.Get_Worksheet();
};
AscFormat.CTextBody.prototype.getDrawingDocument = function()
{
    return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
};
