var K=1/4;

var mt=0, lt=1, cb=2, cl=3;

function SplineCommandMoveTo(x, y)
{
    this.id = 0;
    this.x = x;
    this.y = y;
}

function SplineCommandLineTo(x, y)
{
    this.id = 1;
    this.x = x;
    this.y = y;
    this.changePoint = function(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

function SplineCommandBezier(x1, y1, x2, y2, x3, y3)
{
    this.id = 2;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;

    this.changeLastPoint = function(x, y)
    {
        this.x3 = x;
        this.y3 = y;
        this.x2 = this.x1 + (this.x3 - this.x1)*0.5;
        this.y2 = this.y1 + (this.y3 - this.y1)*0.5;
    }
}

function Spline(slide)
{
    this.calculateLine = function()
    {
        if(this.parent == null )
        {
            return;
        }
        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;

        var pen = null;
        var  RGBA = {R:0, G: 0, B:0, A:255};
        if(theme && this.style!=null && this.style.lnRef!=null)
        {
            pen = theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(theme, slide, layout, master);
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            pen = new CLn();
        }

        if(pen.Fill!=null)
        {
            pen.Fill.calculate(theme, slide,layout, master, RGBA) ;
        }

        this.pen = pen;
    };
    this.path = [];

    this.Matrix = new CMatrixL();
    this.TransformMatrix = new CMatrixL();

    this.parent = slide;
    this.style  = CreateDefaultShapeStyle();
    this.calculateLine();

    this.calculateLine = function()
    {
        var slide = null, layout = null, master = null, theme = null;
        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                slide = this.parent;
                layout = slide.Layout;
                if(layout)
                {
                    master = layout.Master;
                }
                break;
            }
            case LAYOUT_KIND:
            {
                layout = this.parent;
                master = layout.Master;
                break;
            }
            case MASTER_KIND :
            {
                master = this.parent;
                break;
            }
        }

        if(master)
            theme = master.Theme;

        var pen = null;
        var  RGBA = {R:0, G: 0, B:0, A:255};
        if(theme && this.style!=null && this.style.lnRef!=null)
        {
            pen = theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(theme, slide, layout, master);
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            pen = new CLn();
        }
        if(this.spPr.ln!=null)
        {
            pen.merge(this.spPr.ln)
        }

        if(pen.Fill!=null)
        {
            pen.Fill.calculate(theme, slide,layout, master, RGBA) ;
        }

        this.pen = pen;
    };

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
       // g.transform3(this.Matrix);
        for(var i = 0; i < this.path.length; ++i)
        {
            var lastX, lastY;
            switch (this.path[i].id )
            {
                case 0 :
                {
                    g._m(this.path[i].x, this.path[i].y);
                    lastX = this.path[i].x;
                    lastY = this.path[i].y;
                    break;
                }
                case 1 :
                {
                    g._l(this.path[i].x, this.path[i].y);
                    lastX = this.path[i].x;
                    lastY = this.path[i].y;
                    break;
                }
                case 2 :
                {
                    /*g._l(this.path[i].x1*100, this.path[i].y1*100);
                    g._l(this.path[i].x2*100, this.path[i].y2*100);
                    g._l(this.path[i].x3*100, this.path[i].y3*100);

                    g._m(lastX*100, lastY*100);       */
                    g._c(this.path[i].x1, this.path[i].y1, this.path[i].x2, this.path[i].y2, this.path[i].x3, this.path[i].y3);
                    lastX = this.path[i].x3;
                    lastY = this.path[i].y3;
                    break;
                }
            }
        }
        g.ds();
    };

    this.createShape =  function(parent)
    {
        var xMax = this.path[0].x, yMax = this.path[0].y, xMin = xMax, yMin = yMax;
        var i;

        var bClosed = false;
        if(this.path.length > 2)
        {
            var dx = this.path[0].x - this.path[this.path.length-1].x3;
            var dy = this.path[0].y - this.path[this.path.length-1].y3;
            if(Math.sqrt(dx*dx +dy*dy) < 3)
            {
                bClosed = true;
                this.path[this.path.length-1].x3 = this.path[0].x;
                this.path[this.path.length-1].y3 = this.path[0].y;
                if(this.path.length > 3)
                {
                    var vx = (this.path[1].x3 - this.path[this.path.length-2].x3)/6;
                    var vy = (this.path[1].y3 - this.path[this.path.length-2].y3)/6;
                }
                else
                {
                    vx = -(this.path[1].y3 - this.path[0].y)/6;
                    vy = (this.path[1].x3 - this.path[0].x)/6;
                }


                this.path[1].x1 = this.path[0].x +vx;
                this.path[1].y1 = this.path[0].y +vy;
                this.path[this.path.length-1].x2 = this.path[0].x -vx;
                this.path[this.path.length-1].y2 = this.path[0].y -vy;
            }
        }
        for( i = 1; i<this.path.length; ++i)
        {
            if(this.path[i].id == 1)
            {
                if(this.path[i].x > xMax)
                {
                    xMax = this.path[i].x;
                }
                if(this.path[i].y > yMax)
                {
                    yMax = this.path[i].y;
                }

                if(this.path[i].x < xMin)
                {
                    xMin = this.path[i].x;
                }

                if(this.path[i].y < yMin)
                {
                    yMin = this.path[i].y;
                }
            }
            else
            {
                if(this.path[i].x1 > xMax)
                {
                    xMax = this.path[i].x1;
                }
                if(this.path[i].y1 > yMax)
                {
                    yMax = this.path[i].y1;
                }

                if(this.path[i].x1 < xMin)
                {
                    xMin = this.path[i].x1;
                }

                if(this.path[i].y1 < yMin)
                {
                    yMin = this.path[i].y1;
                }


                if(this.path[i].x2 > xMax)
                {
                    xMax = this.path[i].x2;
                }
                if(this.path[i].y2 > yMax)
                {
                    yMax = this.path[i].y2;
                }

                if(this.path[i].x2 < xMin)
                {
                    xMin = this.path[i].x2;
                }

                if(this.path[i].y2 < yMin)
                {
                    yMin = this.path[i].y2;
                }


                if(this.path[i].x3 > xMax)
                {
                    xMax = this.path[i].x3;
                }
                if(this.path[i].y3 > yMax)
                {
                    yMax = this.path[i].y3;
                }

                if(this.path[i].x3 < xMin)
                {
                    xMin = this.path[i].x3;
                }

                if(this.path[i].y3 < yMin)
                {
                    yMin = this.path[i].y3;
                }
            }
        }

        var shape = new CShape(parent);
        shape.spPr.xfrm.offX = xMin;
        shape.spPr.xfrm.offY = yMin;
        shape.spPr.xfrm.extX = xMax-xMin;
        shape.spPr.xfrm.extY = yMax-yMin;
        var geometry = new Geometry();
        geometry.AddPathCommand(0, undefined, bClosed ? "norm": "none", undefined, xMax - xMin, yMax-yMin);
        geometry.AddRect("l", "t", "r", "b");
        for(i = 0;  i< this.path.length; ++i)
        {
            switch (this.path[i].id)
            {
                case 0 :
                {
                    geometry.AddPathCommand(1, (this.path[i].x - xMin) + "", (this.path[i].y - yMin) + "");
                    break;
                }
                case 1 :
                {
                    geometry.AddPathCommand(2, (this.path[i].x - xMin) + "", (this.path[i].y - yMin) + "");
                    break;
                }
                case 2:
                {
                    geometry.AddPathCommand(5, (this.path[i].x1 - xMin) + "", (this.path[i].y1 - yMin) + "", (this.path[i].x2 - xMin) + "", (this.path[i].y2 - yMin) + "", (this.path[i].x3 - xMin) + "", (this.path[i].y3 - yMin) + "");
                    break;
                }
            }
        }
        if(bClosed)
        {
            geometry.AddPathCommand(6);
        }
        shape.txBody = new CTextBody(shape);
        shape.txBody.bodyPr = new CBodyPr();
        shape.txBody.bodyPr.setDefault();
        shape.txBody.bodyPr.anchor = 1;//center
        shape.style  = CreateDefaultShapeStyle();
        shape.txBody.content = new CDocumentContent(shape, parent.elementsManipulator.DrawingDocument,0, 0, 0, 0, 0, 0);
        shape.txBody.content.Content[0].Set_Align( 2, false );
        shape.spPr.Geometry = geometry;
        shape.nvSpPr = new UniNvPr();
        shape.nvSpPr.cNvPr.id = ++parent.maxId;
        shape.geometry = shape.spPr.Geometry;
        shape.calculate2();
        parent.elementsManipulator.Spline = new Spline();
        return shape;
    }
}
