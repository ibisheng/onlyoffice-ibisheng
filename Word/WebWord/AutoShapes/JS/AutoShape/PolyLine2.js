/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 4/5/12
 * Time: 11:38 AM
 * To change this template use File | Settings | File Templates.
 */
function PolyLine2()
{
    this.ArrPointBlock=new Array();
    this.ArrPointBlock[0]= new Array();
}

PolyLine2.prototype=
{
    AddPoint: function(x, y)
    {
        this.ArrPointBlock[this.ArrPointBlock.length-1].push({x: x, y: y});
        this.LastPoint={x: x, y: y};
    },

    AddSeparator: function()
    {
        this.ArrPointBlock[this.ArrPointBlock.length]= new Array();
    },

    ChangeLastPoint: function(x, y)
    {
        this.ArrPointBlock[this.ArrPointBlock.length-1][this.ArrPointBlock[this.ArrPointBlock.length-1].length-1]={x: x, y:y};
        this.LastPoint={x: x, y: y};
    },

    Draw: function(graphics)
    {
        graphics.SetIntegerGrid(true);
        graphics.p_width(1000);
        graphics.p_color(0, 0, 0, 255);

        if(this.ArrPointBlock[0].length>0)
            graphics._m(this.ArrPointBlock[0][0].x*100, this.ArrPointBlock[0][0].y*100);
        for(var i=0; i<this.ArrPointBlock.length; i++)
            for(var j=0; j<this.ArrPointBlock[i].length; j++)
                graphics._l(this.ArrPointBlock[i][j].x*100, this.ArrPointBlock[i][j].y*100);
        graphics.ds();
    },

    DistanceToLastPoint: function(x, y)
    {
        var dx, dy;
        dx=x-this.LastPoint.x;
        dy=y-this.LastPoint.y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    Clear: function()
    {
        this.ArrPointBlock.length=0;
        this.ArrPointBlock[0]= new Array();
    },

    CreateShape: function(DrawingDocument, Parent)
    {

        if(this.ArrPointBlock[0].length>0)
        {
            var Xmin, Xmax, Ymin, Ymax;
            Xmin=this.ArrPointBlock[0][0].x;
            Ymin=this.ArrPointBlock[0][0].y;
            Xmax=Xmin;
            Ymax=Ymin;

            //Находим габариты коробки
            var ArrP;
            for(var i=0; i<this.ArrPointBlock.length; i++)
            {
                ArrP=this.ArrPointBlock[i];
                for(var j=0; j<ArrP.length; j++)
                {
                    if(Xmax<ArrP[j].x)
                        Xmax=ArrP[j].x;
                    if(Ymax<ArrP[j].y)
                        Ymax=ArrP[j].y;

                    if(Xmin>ArrP[j].x)
                        Xmin=ArrP[j].x;
                    if(Ymin>ArrP[j].y)
                        Ymin=ArrP[j].y;
                }
            }

            var geometry=new Geometry(), dx, dy;
            dx=this.ArrPointBlock[0][0].x-this.LastPoint.x;
            dy=this.ArrPointBlock[0][0].y-this.LastPoint.y;
            var IsClosed=Math.sqrt(dx*dx+dy*dy)<3;
            if(IsClosed)
                geometry.AddPathCommand(0,false, undefined, undefined, Xmax-Xmin, Ymax-Ymin);
            else
                geometry.AddPathCommand(0,false, 'none', undefined, Xmax-Xmin, Ymax-Ymin);

            geometry.AddPathCommand(1, (this.ArrPointBlock[0][0].x-Xmin)+'', (this.ArrPointBlock[0][0].y-Ymin)+'');
            for(i=0; i<this.ArrPointBlock.length; i++)
            {
                ArrP=this.ArrPointBlock[i];
                if(ArrP.length==1)
                    geometry.AddPathCommand(2, (ArrP[0].x-Xmin)+'', (ArrP[0].y-Ymin)+'');
                else if(ArrP.length>1)
                {
                    var n=Math.floor(ArrP.length/6);
                    for(j=0; j<n; j++)
                        geometry.AddPathCommand(5, (ArrP[j*6+1].x-Xmin)+'', (ArrP[j*6+1].y-Ymin)+'', (ArrP[j*6+3].x-Xmin)+'', (ArrP[j*6+3].y-Ymin)+'', (ArrP[j*6+5].x-Xmin)+'', (ArrP[j*6+5].y-Ymin)+'');

                    n=ArrP.length-1;
                    for(j=ArrP.length%6; j>0;j--)
                        geometry.AddPathCommand(2, (ArrP[n-(j-1)].x-Xmin)+'', (ArrP[n-(j-1)].y-Ymin)+'');
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
            return shape;
            
        }
        else
            return null;
    }
};