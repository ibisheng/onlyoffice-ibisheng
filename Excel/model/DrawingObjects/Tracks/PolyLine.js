"use strict";

function PolyLine (drawingObjects)
{
    this.drawingObjects = drawingObjects;
    this.arrPoint = [];
    this.Matrix = new CMatrixL();
    this.TransformMatrix = new CMatrixL();

    this.style  = CreateDefaultShapeStyle();


    var _calculated_line;
    var wb = this.drawingObjects.getWorkbook();
    var _theme = wb.theme;
    var colorMap = GenerateDefaultColorMap().color_map;
    var RGBA = {R: 0, G: 0, B: 0, A: 255};
    if(isRealObject(_theme) && typeof _theme.getLnStyle === "function"
        && isRealObject(this.style) && isRealObject(this.style.lnRef) && isRealNumber(this.style.lnRef.idx)
        && isRealObject(this.style.lnRef.Color) && typeof  this.style.lnRef.Color.Calculate === "function")
    {
        _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
        this.style.lnRef.Color.Calculate(_theme, colorMap, {R: 0 , G: 0, B: 0, A: 255});
        RGBA = this.style.lnRef.Color.RGBA;
    }
    else
    {
        _calculated_line = new CLn();
    }

    if(isRealObject(_calculated_line.Fill))
    {
        _calculated_line.Fill.calculate(_theme, colorMap, RGBA) ;
    }

    this.pen = _calculated_line;

    this.polylineForDrawer = new PolylineForDrawer(this);

    this.Draw = function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.Matrix);

        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this);
    };
    this.draw = function(g)
    {
        this.polylineForDrawer.Draw(g);
        return;
        if(this.arrPoint.length < 2)
        {
            return;
        }
        g._m(this.arrPoint[0].x, this.arrPoint[0].y);
        for(var i = 1; i < this.arrPoint.length; ++i)
        {
            g._l(this.arrPoint[i].x, this.arrPoint[i].y);
        }
        g.ds();
    };

    this.getLeftTopPoint = function()
    {
        if(this.arrPoint.length  < 1)
            return {x: 0, y: 0};
        var xMax = this.arrPoint[0].x, yMax = this.arrPoint[0].y, xMin = xMax, yMin = yMax;
        var i;
        for( i = 1; i<this.arrPoint.length; ++i)
        {
            if(this.arrPoint[i].x > xMax)
            {
                xMax = this.arrPoint[i].x;
            }
            if(this.arrPoint[i].y > yMax)
            {
                yMax = this.arrPoint[i].y;
            }

            if(this.arrPoint[i].x < xMin)
            {
                xMin = this.arrPoint[i].x;
            }

            if(this.arrPoint[i].y < yMin)
            {
                yMin = this.arrPoint[i].y;
            }
        }

        return {x: xMin, y: yMin};
    };

    this.createShape =  function(document)
    {
        var xMax = this.arrPoint[0].x, yMax = this.arrPoint[0].y, xMin = xMax, yMin = yMax;
        var i;

        var bClosed = false;
        if(this.arrPoint.length > 2)
        {
            var dx = this.arrPoint[0].x - this.arrPoint[this.arrPoint.length-1].x;
            var dy = this.arrPoint[0].y - this.arrPoint[this.arrPoint.length-1].y;
            if(Math.sqrt(dx*dx +dy*dy) < this.drawingObjects.convertMetric(3, 0, 3))
            {
                bClosed = true;
            }
        }
        var _n = bClosed ? this.arrPoint.length - 1 : this.arrPoint.length;
        for( i = 1; i<_n; ++i)
        {
            if(this.arrPoint[i].x > xMax)
            {
                xMax = this.arrPoint[i].x;
            }
            if(this.arrPoint[i].y > yMax)
            {
                yMax = this.arrPoint[i].y;
            }

            if(this.arrPoint[i].x < xMin)
            {
                xMin = this.arrPoint[i].x;
            }

            if(this.arrPoint[i].y < yMin)
            {
                yMin = this.arrPoint[i].y;
            }
        }




        var shape = new CShape(null, this.drawingObjects);

        shape.setXfrmObject(new CXfrm());
        shape.setPosition(xMin, yMin);
        shape.setExtents(xMax-xMin, yMax-yMin);
        shape.setStyleBinary(CreateDefaultShapeStyle());
        var geometry = new CGeometry();

        geometry.AddPathCommand(0, undefined, bClosed ? "norm": "none", undefined, xMax - xMin, yMax-yMin);
        geometry.AddRect("l", "t", "r", "b");
        geometry.AddPathCommand(1, (this.arrPoint[0].x - xMin) + "", (this.arrPoint[0].y - yMin) + "");
        for(i = 1;  i< _n; ++i)
        {
            geometry.AddPathCommand(2, (this.arrPoint[i].x - xMin) + "", (this.arrPoint[i].y - yMin) + "");
        }
        if(bClosed)
        {
            geometry.AddPathCommand(6);
        }
        geometry.Init( xMax-xMin, yMax-yMin);
        shape.setGeometry(geometry);
        shape.recalculate();

        shape.addToDrawingObjects();

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null,
            new UndoRedoDataGraphicObjects(shape.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        return shape;
    }
}

function PolylineForDrawer(polyline)
{
    this.polyline = polyline;
    this.pen = polyline.pen;
    this.brush = polyline.brush;
    this.TransformMatrix = polyline.TransformMatrix;
    this.Matrix = polyline.Matrix;

    this.Draw = function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.Matrix);

        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this);
    };
    this.draw = function(g)
    {
        g._e();
        if(this.polyline.arrPoint.length < 2)
        {
            return;
        }
        g._m(this.polyline.arrPoint[0].x, this.polyline.arrPoint[0].y);
        for(var i = 1; i < this.polyline.arrPoint.length; ++i)
        {
            g._l(this.polyline.arrPoint[i].x, this.polyline.arrPoint[i].y);
        }
        g.ds();
    };
}