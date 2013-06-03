var K=1/4;

var mt=0, lt=1, cb=2, cl=3;
function Spline()
{
    this.ArrPoint=new Array();
    this.Path=new Array();
}

Spline.prototype=
{
    AddPoint: function(x, y)
    {
        this.ArrPoint.push({x: x, y:y});

        switch(this.ArrPoint.length)
        {
            case 1:
            {
                this.Path.push({
                    id: mt,
                    x: x,
                    y: y
                });
                break;
            }
            case 2:
            {
                this.Path.push({
                   id: lt,
                    x: x,
                    y: y
                });
                break;
            }
            case 3:
            {
                this.Path.length=1;

                var vx, vy;
                vx=this.ArrPoint[2].x-this.ArrPoint[0].x;
                vy=this.ArrPoint[2].y-this.ArrPoint[0].y;

                var b1x, b1y, b2x, b2y;
                b2x=this.ArrPoint[1].x-vx*K;
                b2y=this.ArrPoint[1].y-vy*K;

                var tx, ty;
                tx=b2x-this.ArrPoint[0].x;
                ty=b2y-this.ArrPoint[0].y;

                b1x=this.ArrPoint[0].x+tx*K;
                b1y=this.ArrPoint[0].y+ty*K;

                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[1].x,
                    y2: this.ArrPoint[1].y
                });

                b1x=this.ArrPoint[1].x+vx*K;
                b1y=this.ArrPoint[1].y+vy*K;

                tx=b1x-this.ArrPoint[2].x;
                ty=b1y-this.ArrPoint[2].y;

                b2x=this.ArrPoint[2].x+tx*K;
                b2y=this.ArrPoint[2].y+ty*K;

                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[2].x,
                    y2: this.ArrPoint[2].y
                });
                break;
            }
            default:
            {
                var n=this.ArrPoint.length-1, N=this.Path.length-1;

                vx=this.ArrPoint[n].x-this.ArrPoint[n-2].x;
                vy=this.ArrPoint[n].y-this.ArrPoint[n-2].y;

                this.Path[N].x1=this.ArrPoint[n-1].x-vx*K;
                this.Path[N].y1=this.ArrPoint[n-1].y-vy*K;

                b1x=this.ArrPoint[n-1].x+vx*K;
                b1y=this.ArrPoint[n-1].y+vy*K;

                vx=b1x-this.ArrPoint[n].x;
                vy=b1y-this.ArrPoint[n].y;

                b2x=this.ArrPoint[n].x+vx*K;
                b2y=this.ArrPoint[n].y+vy*K;
                
                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[n].x,
                    y2: this.ArrPoint[n].y
                });
            }
        }
    },

    CreateShape: function(DrawingDocument, Parent)
    {
        var Xmin, Xmax, Ymin, Ymax;
        Xmin=this.ArrPoint[0].x;
        Ymin=this.ArrPoint[0].y;
        Xmax=Xmin;
        Ymax=Ymin;

        for(var i=1; i<this.Path.length; i++)
        {
            /*if(Xmax<this.ArrPoint[i].x)
                Xmax=this.ArrPoint[i].x;
            if(Ymax<this.ArrPoint[i].y)
                Ymax=this.ArrPoint[i].y;

            if(Xmin>this.ArrPoint[i].x)
                Xmin=this.ArrPoint[i].x;
            if(Ymin>this.ArrPoint[i].y)
                Ymin=this.ArrPoint[i].y;*/

           switch(this.Path[i].id)
            {
                case mt:
                case lt:
                {
                    if(Xmax<this.Path[i].x)
                        Xmax=this.Path[i].x;
                    if(Ymax<this.Path[i].y)
                        Ymax=this.Path[i].y;

                    if(Xmin>this.Path[i].x)
                        Xmin=this.Path[i].x;
                    if(Ymin>this.Path[i].y)
                        Ymin=this.Path[i].y;
                    break;
                }
                case cb:
                {
                    if(Xmax<this.Path[i].x0)
                        Xmax=this.Path[i].x0;
                    if(Ymax<this.Path[i].y0)
                        Ymax=this.Path[i].y0;

                    if(Xmin>this.Path[i].x0)
                        Xmin=this.Path[i].x0;
                    if(Ymin>this.Path[i].y0)
                        Ymin=this.Path[i].y0;

                    if(Xmax<this.Path[i].x1)
                        Xmax=this.Path[i].x1;
                    if(Ymax<this.Path[i].y1)
                        Ymax=this.Path[i].y1;

                    if(Xmin>this.Path[i].x1)
                        Xmin=this.Path[i].x1;
                    if(Ymin>this.Path[i].y1)
                        Ymin=this.Path[i].y1;

                    if(Xmax<this.Path[i].x2)
                        Xmax=this.Path[i].x2;
                    if(Ymax<this.Path[i].y2)
                        Ymax=this.Path[i].y2;

                    if(Xmin>this.Path[i].x2)
                        Xmin=this.Path[i].x2;
                    if(Ymin>this.Path[i].y2)
                        Ymin=this.Path[i].y2;
                    break;
                }
            }
        }

        var geometry=new Geometry(), dx, dy, points=this.ArrPoint;
        dx=this.ArrPoint[0].x-this.ArrPoint[this.ArrPoint.length-1].x;
        dy=this.ArrPoint[0].y-this.ArrPoint[this.ArrPoint.length-1].y;
        var IsClosed= Math.sqrt(dx*dx+dy*dy)<3 && this.ArrPoint.length>2;
        if(IsClosed)
            geometry.AddPathCommand(0,false, undefined, undefined, Xmax-Xmin, Ymax-Ymin);
        else
            geometry.AddPathCommand(0,false, 'none', undefined, Xmax-Xmin, Ymax-Ymin);

        if(IsClosed)
        {
            var n=this.ArrPoint.length-1, N=this.Path.length-1;
            var vx, vy;
            vx=this.ArrPoint[1].x-this.ArrPoint[n-1].x;
            vy=this.ArrPoint[1].y-this.ArrPoint[n-1].y;

            this.Path[1].x0=this.ArrPoint[0].x+vx*K;
            this.Path[1].y0=this.ArrPoint[0].y+vy*K;

            this.Path[N].x1=this.ArrPoint[0].x-vx*K;
            this.Path[N].y1=this.ArrPoint[0].y-vy*K;

            this.Path[N].x2=this.ArrPoint[0].x;
            this.Path[N].y2=this.ArrPoint[0].y;
        }

        for(i=0; i<this.Path.length;i++)
        {
            switch(this.Path[i].id)
            {
                case mt:
                {
                    geometry.AddPathCommand(1, (this.Path[i].x-Xmin)+'', (this.Path[i].y-Ymin)+'');
                    break;
                }
                case lt:
                {
                    geometry.AddPathCommand(2, (this.Path[i].x-Xmin)+'', (this.Path[i].y-Ymin)+'');
                    break;
                }
                case cb:
                {
                    geometry.AddPathCommand(5, (this.Path[i].x0-Xmin)+'', (this.Path[i].y0-Ymin)+'', (this.Path[i].x1-Xmin)+'', (this.Path[i].y1-Ymin)+'', (this.Path[i].x2-Xmin)+'', (this.Path[i].y2-Ymin)+'');
                    break;
                }
            }
        }
        if(IsClosed)
             geometry.AddPathCommand(6);
        geometry.AddRect('l', 't', 'r', 'b');

        geometry.Init(Xmax-Xmin, Ymax-Ymin);
        var shape=new CShape(DrawingDocument, Parent);
        shape.AddGeometry(geometry);
        shape.Init(undefined, Xmin, Ymin, {x:0, y:0}, {cx: Xmax-Xmin, cy: Ymax-Ymin});
        shape.AddDocumentContent();
        shape.Recalculate();
        shape.prst='splineBezier';
        return shape;
    },

    ChangeLastPoint: function(x, y)
    {
        this.ArrPoint.length=this.ArrPoint.length-1;
        this.Path.length=this.Path.length-1;

        this.ArrPoint.push({x: x, y:y});

        switch(this.ArrPoint.length)
        {
            case 1:
            {
                this.Path.push({
                    id: mt,
                    x: x,
                    y: y
                });
                break;
            }
            case 2:
            {
                this.Path.push({
                   id: lt,
                    x: x,
                    y: y
                });
                break;
            }
            case 3:
            {
                this.Path.length=1;

                var vx, vy;
                vx=this.ArrPoint[2].x-this.ArrPoint[0].x;
                vy=this.ArrPoint[2].y-this.ArrPoint[0].y;

                var b1x, b1y, b2x, b2y;
                b2x=this.ArrPoint[1].x-vx*K;
                b2y=this.ArrPoint[1].y-vy*K;

                vx=b2x-this.ArrPoint[0].x;
                vy=b2y-this.ArrPoint[0].y;

                b1x=this.ArrPoint[0].x+vx*K;
                b1y=this.ArrPoint[0].y+vy*K;

                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[1].x,
                    y2: this.ArrPoint[1].y
                });

                vx=this.ArrPoint[2].x-this.ArrPoint[0].x;
                vy=this.ArrPoint[2].y-this.ArrPoint[0].y;
                b1x=this.ArrPoint[1].x+vx*K;
                b1y=this.ArrPoint[1].y+vy*K;

                vx=b1x-this.ArrPoint[2].x;
                vy=b1y-this.ArrPoint[2].y;

                b2x=this.ArrPoint[2].x+vx*K;
                b2y=this.ArrPoint[2].y+vy*K;

                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[2].x,
                    y2: this.ArrPoint[2].y
                });
                break;
            }
            default:
            {
                var n=this.ArrPoint.length-1, N=this.Path.length-1;

                vx=this.ArrPoint[n].x-this.ArrPoint[n-2].x;
                vy=this.ArrPoint[n].y-this.ArrPoint[n-2].y;

                this.Path[N].x1=this.ArrPoint[n-1].x-vx*K;
                this.Path[N].y1=this.ArrPoint[n-1].y-vy*K;

                b1x=this.ArrPoint[n-1].x+vx*K;
                b1y=this.ArrPoint[n-1].y+vy*K;

                vx=b1x-this.ArrPoint[n].x;
                vy=b1y-this.ArrPoint[n].y;

                b2x=this.ArrPoint[n].x+vx*K;
                b2y=this.ArrPoint[n].y+vy*K;

                this.Path.push({
                    id: cb,

                    x0: b1x,
                    y0: b1y,

                    x1: b2x,
                    y1: b2y,

                    x2: this.ArrPoint[n].x,
                    y2: this.ArrPoint[n].y
                });
            }
        }
    },

    Draw: function(graphics)
    {

        graphics.reset();
        graphics.SetIntegerGrid(false);
        graphics.p_width(100);
        graphics._s();
        if(this.ArrPoint.length>1)
            graphics._m(this.ArrPoint[0].x*100, this.ArrPoint[0].y*100);

        var lastX, lastY;
        for(var i=0; i<this.Path.length;i++)
        {
             switch(this.Path[i].id)
            {
                case mt:
                {
                    graphics._m(this.Path[i].x*100, this.Path[i].y*100);
                    lastX=this.Path[i].x;
                    lastY=this.Path[i].y;
                    break;
                }
                case lt:
                {
                    graphics._l(this.Path[i].x*100, this.Path[i].y*100);
                    lastX=this.Path[i].x;
                    lastY=this.Path[i].y;
                    break;
                }
                case cb:
                {
                    graphics._c(this.Path[i].x0*100, this.Path[i].y0*100, this.Path[i].x1*100, this.Path[i].y1*100, this.Path[i].x2*100, this.Path[i].y2*100);
                    /*graphics._m(lastX*100, lastY*100);
                    graphics._l(this.Path[i].x0*100, this.Path[i].y0*100);
                    graphics._l(this.Path[i].x1*100, this.Path[i].y1*100);
                    graphics._l(this.Path[i].x2*100, this.Path[i].y2*100);*/

                    lastX=this.Path[i].x2;
                    lastY=this.Path[i].y2;
                    break;
                }
            }
        }
        graphics.ds();
        graphics.SetIntegerGrid(true);
    },

    Clear: function()
    {
        this.ArrPoint.length=0;
         this.Path.length=0;
    }
};