"use strict";

// Import
var CShape = AscFormat.CShape;

CImageShape.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CImageShape.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CImageShape.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CImageShape.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CImageShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CImageShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CImageShape.prototype.deselect = CShape.prototype.deselect;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CImageShape.prototype.setWorksheet = CShape.prototype.setWorksheet;
CImageShape.prototype.getDrawingObjectsController = CShape.prototype.getDrawingObjectsController;
CImageShape.prototype.setParent2 = CShape.prototype.setParent2;
CImageShape.prototype.handleUpdateTheme = CShape.prototype.handleUpdateTheme;
CImageShape.prototype.getIsSingleBody = CShape.prototype.getIsSingleBody;
CImageShape.prototype.getSlideIndex = CShape.prototype.getSlideIndex;
CImageShape.prototype.Is_UseInDocument = CShape.prototype.Is_UseInDocument;

CImageShape.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalculateBrush:          true,
        recalculatePen:            true,
        recalculateTransform:      true,
        recalculateBounds:         true,
        recalculateGeometry:       true,
        recalculateStyle:          true,
        recalculateFill:           true,
        recalculateLine:           true,
        recalculateTransparent:    true
    };
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
    this.lockType = AscCommon.c_oAscLockTypes.kLockTypeNone;
};

CImageShape.prototype.recalcBrush = function()
{
    this.recalcInfo.recalculateBrush = true;
};



CImageShape.prototype.recalcPen = function()
{
    this.recalcInfo.recalculatePen = true;
};
CImageShape.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CImageShape.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CImageShape.prototype.recalcGeometry = function()
{
    this.recalcInfo.recalculateGeometry = true;
};
CImageShape.prototype.recalcStyle = function()
{
    this.recalcInfo.recalculateStyle = true;
};
CImageShape.prototype.recalcFill = function()
{
    this.recalcInfo.recalculateFill = true;
};
CImageShape.prototype.recalcLine = function()
{
    this.recalcInfo.recalculateLine = true;
};
CImageShape.prototype.recalcTransparent = function()
{
    this.recalcInfo.recalculateTransparent = true;
};
CImageShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.recalcBounds();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateExtents = function()
{
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateRot = function()
{
    this.recalcTransform();
    this.recalcBounds();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateFill = function()
{
    this.recalcBrush();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateLn = function()
{
    this.recalcLine();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateGeometry = function()
{
    this.recalcBounds();
    this.recalcGeometry();
    this.addToRecalculate();
};
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getCompiledStyle = CShape.prototype.getCompiledStyle;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculate = function ()
{
    if(this.bDeleted || !this.parent)
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
        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }
    }, this, []);
};
CImageShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CImageShape.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CImageShape.prototype.hitInPath = CShape.prototype.hitInPath;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CImageShape.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CImageShape.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CImageShape.prototype.check_bounds = CShape.prototype.check_bounds;
CImageShape.prototype.normalize = CShape.prototype.normalize;
