"use strict";

function PolyLine (drawingObjects, theme, master, layout, slide, pageIndex)
{

    AscFormat.ExecuteNoHistory(function(){

        this.drawingObjects = drawingObjects;
        this.arrPoint = [];
        this.Matrix = new CMatrixL();
        this.TransformMatrix = new CMatrixL();

        this.pageIndex = pageIndex;
        this.style  = AscFormat.CreateDefaultShapeStyle();
        var style = this.style;
        style.fillRef.Color.Calculate(theme, slide, layout, master, {R:0, G: 0, B:0, A:255});
        var RGBA = style.fillRef.Color.RGBA;
        var pen = theme.getLnStyle(style.lnRef.idx, style.lnRef.Color);
        style.lnRef.Color.Calculate(theme, slide, layout, master);
        RGBA = style.lnRef.Color.RGBA;

        if(pen.Fill)
        {
            pen.Fill.calculate(theme, slide, layout, master, RGBA);
        }

        this.pen = pen;

        this.polylineForDrawer = new PolylineForDrawer(this);

    }, this, []);

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
        if(AscFormat.isRealNumber(this.pageIndex) && g.SetCurrentPage)
        {
            g.SetCurrentPage(this.pageIndex);
        }
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

    this.getBounds = function()
    {
        var boundsChecker = new  AscFormat.CSlideBoundsChecker();
        this.draw(boundsChecker);
        boundsChecker.Bounds.posX = boundsChecker.Bounds.min_x;
        boundsChecker.Bounds.posY = boundsChecker.Bounds.min_y;
        boundsChecker.Bounds.extX = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
        boundsChecker.Bounds.extY = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
        return boundsChecker.Bounds;
    };

    
    this.getShape =  function(bWord, drawingDocument, drawingObjects)
    {
        var xMax = this.arrPoint[0].x, yMax = this.arrPoint[0].y, xMin = xMax, yMin = yMax;
        var i;

        var bClosed = false;
        var min_dist;
        if(drawingObjects)
        {
            min_dist = drawingObjects.convertPixToMM(3);
        }
        else
        {
            min_dist = editor.WordControl.m_oDrawingDocument.GetMMPerDot(3)
        }
        if(this.arrPoint.length > 2)
        {
            var dx = this.arrPoint[0].x - this.arrPoint[this.arrPoint.length-1].x;
            var dy = this.arrPoint[0].y - this.arrPoint[this.arrPoint.length-1].y;
            if(Math.sqrt(dx*dx +dy*dy) < min_dist)
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




        var shape = new AscFormat.CShape();

     //  if(drawingObjects)
     //  {
     //      shape.setWorksheet(drawingObjects.getWorksheetModel());
     //      shape.addToDrawingObjects();
     //  }
        shape.setSpPr(new AscFormat.CSpPr());
        shape.spPr.setParent(shape);
        shape.spPr.setXfrm(new AscFormat.CXfrm());
        shape.spPr.xfrm.setParent(shape.spPr);
        if(!bWord)
        {
            shape.spPr.xfrm.setOffX(xMin);
            shape.spPr.xfrm.setOffY(yMin);
        }
        else
        {
            shape.setWordShape(true);
            shape.spPr.xfrm.setOffX(0);
            shape.spPr.xfrm.setOffY(0);
        }
        shape.spPr.xfrm.setExtX(xMax-xMin);
        shape.spPr.xfrm.setExtY(yMax - yMin);
        shape.setStyle(AscFormat.CreateDefaultShapeStyle());
        var geometry = new AscFormat.Geometry();


        var w = xMax - xMin, h = yMax-yMin;
        var kw, kh, pathW, pathH;
        if(w > 0)
        {
            pathW = 43200;
            kw = 43200/ w
        }
        else
        {
            pathW = 0;
            kw = 0;
        }
        if(h > 0)
        {
            pathH = 43200;
            kh = 43200 / h;
        }
        else
        {
            pathH = 0;
            kh = 0;
        }
        geometry.AddPathCommand(0, undefined, bClosed ? "norm": "none", undefined, pathW, pathH);
        geometry.AddRect("l", "t", "r", "b");
        geometry.AddPathCommand(1, (((this.arrPoint[0].x - xMin) * kw) >> 0) + "", (((this.arrPoint[0].y - yMin) * kh) >> 0) + "");
        for(i = 1;  i< _n; ++i)
        {
            geometry.AddPathCommand(2, (((this.arrPoint[i].x - xMin) * kw) >> 0) + "", (((this.arrPoint[i].y - yMin) * kh) >> 0) + "");
        }
        if(bClosed)
        {
            geometry.AddPathCommand(6);
        }

        shape.spPr.setGeometry(geometry);
        shape.setBDeleted(false);
        shape.recalculate();
        shape.x = xMin;
        shape.y = yMin;
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