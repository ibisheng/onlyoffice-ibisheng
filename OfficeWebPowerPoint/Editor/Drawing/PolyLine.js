function PolyLine (slide)
{
    this.slide = slide;
    this.arrPoint = [];


    this.Matrix = new CMatrixL();
    this.TransformMatrix = new CMatrixL();

    this.parent = slide;
    this.style  = CreateDefaultShapeStyle();

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

    this.calculateLine();
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
    this.createShape =  function(parent)
    {
        var xMax = this.arrPoint[0].x, yMax = this.arrPoint[0].y, xMin = xMax, yMin = yMax;
        var i;

        var bClosed = false;
        if(this.arrPoint.length > 2)
        {
            var dx = this.arrPoint[0].x - this.arrPoint[this.arrPoint.length-1].x;
            var dy = this.arrPoint[0].y - this.arrPoint[this.arrPoint.length-1].y;
            if(Math.sqrt(dx*dx +dy*dy) < this.parent.elementsManipulator.DrawingDocument.GetMMPerDot(3))
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

        var shape = new CShape(parent);
        shape.spPr.xfrm.offX = xMin;
        shape.spPr.xfrm.offY = yMin;
        shape.spPr.xfrm.extX = xMax-xMin;
        shape.spPr.xfrm.extY = yMax-yMin;
        var geometry = new Geometry();
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
        shape.txBody = new CTextBody(shape);
        shape.txBody.bodyPr = new CBodyPr();
        shape.txBody.bodyPr.setDefault();
        shape.txBody.bodyPr.anchor = 1;//center
        shape.style  = CreateDefaultShapeStyle();
        shape.txBody.content = new CDocumentContent(shape, parent.elementsManipulator.DrawingDocument,0, 0, 0, 0, 0, 0);
        shape.txBody.content.Content[0].Set_Align( 2, false );
        shape.spPr.Geometry = geometry;
        shape.geometry = shape.spPr.Geometry;
        shape.nvSpPr = new UniNvPr();
        shape.nvSpPr.cNvPr.id = ++parent.maxId;
        shape.calculate2();
        parent.elementsManipulator.PolyLine = null;
        return shape;
    }
}