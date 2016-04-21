"use strict";

// Import
var CShape = AscFormat.CShape;
var CGroupShape = AscFormat.CGroupShape;

CGroupShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CGroupShape.prototype.handleUpdateTheme = CShape.prototype.handleUpdateTheme;
CGroupShape.prototype.getSlideIndex = CShape.prototype.getSlideIndex;

CGroupShape.prototype.Is_UseInDocument = CShape.prototype.Is_UseInDocument;

CGroupShape.prototype.handleUpdateFill = function()
{
    for(var i = 0; i < this.spTree.length; ++i)
    {
        this.spTree[i].handleUpdateFill();
    }
    this.addToRecalculate();
};
CGroupShape.prototype.handleUpdateLn = function()
{
    for(var i = 0; i < this.spTree.length; ++i)
    {
        this.spTree[i].handleUpdateLn();
    }
    this.addToRecalculate();
};

CGroupShape.prototype.recalcText = function()
{
    if(this.spTree)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].recalcText)
            {
                this.spTree[i].recalcText();
            }
        }
    }
};



CGroupShape.prototype.setRecalculateInfo = function()
{
    var recalcInfo = this.recalcInfo;
    this.recalcInfo =
    {
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateArrGraphicObjects: true,
        recalculateBounds: true,
        recalculateScaleCoefficients: true
    };
    this.localTransform = new CMatrix();
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};

    this.lockType = AscCommon.c_oAscLockTypes.kLockTypeNone;
};

CGroupShape.prototype.recalcTransform = function()
{

    this.recalcInfo.recalculateScaleCoefficients = true;
    this.recalcInfo.recalculateTransform = true;
    for(var i = 0; i < this.spTree.length; ++i)
    {
        this.spTree[i].recalcTransform();
    }
};

CGroupShape.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};

CGroupShape.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CGroupShape.prototype.getDrawingObjectsController =  CShape.prototype.getDrawingObjectsController;
CGroupShape.prototype.setDrawingObjects = function(drawingObjects)
{
    this.drawingObjects = drawingObjects;
    for(var i = 0; i < this.spTree.length; ++i)
    {
        this.spTree[i].setDrawingObjects(drawingObjects);
    }
};

CGroupShape.prototype.setWorksheet = function(worksheet)
{
    History.Add(this, {Type: AscDFH.historyitem_AutoShapes_SetWorksheet, oldPr: this.worksheet, newPr: worksheet});
    this.worksheet = worksheet;
    for(var i = 0; i < this.spTree.length; ++i)
    {
        this.spTree[i].setWorksheet(worksheet);
    }
};

CGroupShape.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CGroupShape.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CGroupShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CGroupShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CGroupShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CGroupShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CGroupShape.prototype.getIsSingleBody = CShape.prototype.getIsSingleBody;
CGroupShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CGroupShape.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CGroupShape.prototype.recalculateBounds = function()
{
    var sp_tree = this.spTree;
    var x_arr_max = [], y_arr_max = [], x_arr_min = [], y_arr_min = [];
    for(var i = 0; i < sp_tree.length; ++i)
    {
        sp_tree[i].recalculate();
        var bounds = sp_tree[i].bounds;
        var l = bounds.l;
        var r = bounds.r;
        var t = bounds.t;
        var b = bounds.b;
        x_arr_max.push(r);
        x_arr_min.push(l);
        y_arr_max.push(b);
        y_arr_min.push(t);
    }


    if(!this.group)
    {
        var tr = this.localTransform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.extX,0));
        arr_p_y.push(tr.TransformPointY(this.extX,0));
        arr_p_x.push(tr.TransformPointX(this.extX,this.extY));
        arr_p_y.push(tr.TransformPointY(this.extX,this.extY));
        arr_p_x.push(tr.TransformPointX(0,this.extY));
        arr_p_y.push(tr.TransformPointY(0,this.extY));

        x_arr_max = x_arr_max.concat(arr_p_x);
        x_arr_min = x_arr_min.concat(arr_p_x);
        y_arr_max = y_arr_max.concat(arr_p_y);
        y_arr_min = y_arr_min.concat(arr_p_y);
    }

    this.bounds.x = Math.min.apply(Math, x_arr_min);
    this.bounds.y = Math.min.apply(Math, y_arr_min);
    this.bounds.l = this.bounds.x;
    this.bounds.t = this.bounds.y;
    this.bounds.r = Math.max.apply(Math, x_arr_max);
    this.bounds.b = Math.max.apply(Math, y_arr_max);
    this.bounds.w = this.bounds.r - this.bounds.l;
    this.bounds.h = this.bounds.b - this.bounds.t;
};

CGroupShape.prototype.deselect = CShape.prototype.deselect;
CGroupShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CGroupShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CGroupShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CGroupShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.addToRecalculate();
    for(var i = 0; i < this.spTree.length; ++i)
    {
        if(this.spTree[i].handleUpdatePosition)
        {
            this.spTree[i].handleUpdatePosition();
        }
    }
    this.addToRecalculate();
};
CGroupShape.prototype.handleUpdateExtents = function()
{
    this.recalcTransform();
    this.addToRecalculate();
};
CGroupShape.prototype.handleUpdateRot = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateFlip = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateChildOffset = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateChildExtents = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.updatePosition = CShape.prototype.updatePosition;
CGroupShape.prototype.setParent2 = CShape.prototype.setParent2;
CGroupShape.prototype.recalculate = function()
{
    if(this.bDeleted || !this.parent)
        return;
    AscFormat.ExecuteNoHistory(function()
    {
        if(this.recalcInfo.recalculateBrush)
        {
            this.recalculateBrush();
            this.recalcInfo.recalculateBrush = false;
        }
        if(this.recalcInfo.recalculatePen)
        {
            this.recalculatePen();
            this.recalcInfo.recalculatePen = false;
        }
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.calculateSnapArrays();
            this.recalcInfo.recalculateTransform = false;
        }
        if(this.recalcInfo.recalculateArrGraphicObjects)
        {
            this.recalculateArrGraphicObjects();
            this.recalcInfo.recalculateArrGraphicObjects = false;
        }
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].recalculate();
        }
        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }
    }, this, []);
};
