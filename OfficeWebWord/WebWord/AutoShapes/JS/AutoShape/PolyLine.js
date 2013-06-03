/*function PolyLine()
{
    this.ArrPoint=new Array();
    this.Path = new Array();
    this.Separation=new Array();
    this.Separation.push(0);
    this.PointStorage=new Array();
    this.Path=new Path(false, false, true, 0,0);
    this.Counter=0;
}

PolyLine.prototype=
{
    AddPoint: function(x, y)
    {
        this.Counter++;
        this.ArrPoint.push({x: x, y:y});
        if(this.Counter%8==0)
        {
            this.Path.cubicBezTo()
            this.Counter=0;
        }
    },

    AddSeparator: function()
    {
        this.Separation.push(this.ArrPoint.length);
    },
    ChangeLastPoint: function(x, y)
    {
        this.ArrPoint[this.ArrPoint.length-1]={x: x, y:y};
    },

    DistanceToLastPoint: function(x, y)
    {
        if(this.ArrPoint.length>0)
        {
            var dx, dy;
            dx=x-this.ArrPoint[this.ArrPoint.length-1].x;
            dy=y-this.ArrPoint[this.ArrPoint.length-1].y;
            return Math.sqrt(dx*dx+dy*dy);
        }
        else
            return 0;
    },

    Draw: function(graphics)
    {
        graphics.SetIntegerGrid(true);
        graphics.p_width(1000);
        if(this.ArrPoint.length>0)
        {
            graphics._m(this.ArrPoint[0].x*100, this.ArrPoint[0].y*100);
            for(var i=1; i<this.ArrPoint.length; i++)
            {
                graphics._l(this.ArrPoint[i].x*100, this.ArrPoint[i].y*100)
            }
            graphics.ds();
        }
    },

    CreateShape: function(DrawingDocument, Parent)
    {
        this.Separation.push(0);
        var shape=new CShape(DrawingDocument, Parent);
        var Xmin, Xmax, Ymin, Ymax;
        Xmin=this.ArrPoint[0].x;
        Ymin=this.ArrPoint[0].y;
        Xmax=Xmin;
        Ymax=Ymin;

        for(var i=1; i<this.ArrPoint.length; i++)
        {
            if(Xmax<this.ArrPoint[i].x)
                Xmax=this.ArrPoint[i].x;
            if(Ymax<this.ArrPoint[i].y)
                Ymax=this.ArrPoint[i].y;

            if(Xmin>this.ArrPoint[i].x)
                Xmin=this.ArrPoint[i].x;
            if(Ymin>this.ArrPoint[i].y)
                Ymin=this.ArrPoint[i].y;
        }
        var j, t, s, r;
        for(i=0; i<this.Separation.length-1;i++)
        {
            t =this.Separation[i+1]-this.Separation[i];
            s=Math.floor(t/4);
            r=t%4;
            for(j=0; j<s; j++)
            {
                
            }
        }
    }
};*/

function PolyLine()
{
    this.ArrPoint=new Array();
}

PolyLine.prototype=
{
    AddPoint: function(x, y)
    {
        this.ArrPoint.push({x: x, y:y});
    },

    CreateShape: function(DrawingDocument, Parent)
    {
        var Xmin, Xmax, Ymin, Ymax;
        Xmin=this.ArrPoint[0].x;
        Ymin=this.ArrPoint[0].y;
        Xmax=Xmin;
        Ymax=Ymin;

        for(var i=1; i<this.ArrPoint.length; i++)
        {
            if(Xmax<this.ArrPoint[i].x)
                Xmax=this.ArrPoint[i].x;
            if(Ymax<this.ArrPoint[i].y)
                Ymax=this.ArrPoint[i].y;

            if(Xmin>this.ArrPoint[i].x)
                Xmin=this.ArrPoint[i].x;
            if(Ymin>this.ArrPoint[i].y)
                Ymin=this.ArrPoint[i].y;
        }

        var geometry=new Geometry(), dx, dy, points=this.ArrPoint;
        dx=this.ArrPoint[0].x-this.ArrPoint[this.ArrPoint.length-1].x;
        dy=this.ArrPoint[0].y-this.ArrPoint[this.ArrPoint.length-1].y;
        if(Math.sqrt(dx*dx+dy*dy)<3)
            geometry.AddPathCommand(0,false, undefined, undefined, Xmax-Xmin, Ymax-Ymin);
        else
            geometry.AddPathCommand(0,false, 'none', undefined, Xmax-Xmin, Ymax-Ymin);

        geometry.AddPathCommand(1, (points[0].x-Xmin)+'', (points[0].y-Ymin)+'');
        var n=Math.floor(this.ArrPoint.length/4);
        for(i=0; i<n; i++)
            geometry.AddPathCommand(5, (points[i*4+1].x-Xmin)+'', (points[i*4+1].y-Ymin)+'', (points[i*4+2].x-Xmin)+'', (points[i*4+2].y-Ymin)+'', (points[i*4+3].x-Xmin)+'', (points[i*4+3].y-Ymin)+'');

        n=this.ArrPoint.length-1;
        for(i=this.ArrPoint.length%4; i>0;i--)
            geometry.AddPathCommand(2, (points[n-(i-1)].x-Xmin)+'', (points[n-(i-1)].y-Ymin)+'');

        if(Math.sqrt(dx*dx+dy*dy)<3)
            geometry.AddPathCommand(6);

        geometry.AddRect('l', 't', 'r', 'b');

        geometry.Init(Xmax-Xmin, Ymax-Ymin);
        var shape=new CShape(DrawingDocument, Parent);
        shape.AddGeometry(geometry);
        shape.Init(undefined, Xmin, Ymin, {x:0, y:0}, {cx: Xmax-Xmin, cy: Ymax-Ymin});
        shape.AddDocumentContent();
        shape.Recalculate();
        return shape;
    },
    Draw: function(graphics)
    {
        graphics.SetIntegerGrid(true);
        graphics.p_width(100);
        if(this.ArrPoint.length>0)
        {
            graphics._s();
            graphics._m(this.ArrPoint[0].x*100, this.ArrPoint[0].y*100);
            for(var i=0; i< this.ArrPoint.length; i++)
                graphics._l(this.ArrPoint[i].x*100, this.ArrPoint[i].y*100);
            graphics.ds();
        }
    },

    DistanceToLastPoint: function(x, y)
    {
        if(this.ArrPoint.length>0)
        {
            var dx, dy;
            dx=x-this.ArrPoint[this.ArrPoint.length-1].x;
            dy=y-this.ArrPoint[this.ArrPoint.length-1].y;
            return Math.sqrt(dx*dx+dy*dy);
        }
        else
            return 0;
    },

    Clear: function()
    {
        this.ArrPoint.length=0;
    }
};