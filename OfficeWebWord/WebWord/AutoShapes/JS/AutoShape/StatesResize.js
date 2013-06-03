var N=0, NE=1, E=2, SE=3, S=4, SW=5, W=6, NW=7;
function GetOctant(w, h, x, y)
{
    if(x<0&&y<0)
        return 0;
    else if(y<0&&(x>=0&&x<w))
    {
        return 1;
    }
    else if(y<0&&(x>=w))
    {
        return 2;
    }
    else if((y>=0&&y<h)&&(x<0))
    {
        return 3;
    }
    else if((x>=0&&x<=w)&&(y>=0&&y<=h))
    {
        return 4
    }
    else if((x>w)&&(y>=0&&y<h))
    {
        return 5;
    }
    else if((y>=h)&&x<0)
    {
        return 6;
    }
    else if((x>=0&&x<w)&&(y>h))
    {
        return 7;
    }
    else
        return 8;
}

function ResizeProportionNW(shape, x, y)
{
    this.LastOctant=GetOctant(shape.ext.cx, shape.ext.cy, x, y);
    this.ResizeProportion = function(shape, n, x, y)
    {

    }
}

function Resize(dir)
{
    this.dir=dir;
    this.OnMouseMove = function(shape, e)
    {
        var RelPoint = shape.GetPointRelativeLT(e.X,e.Y)
    }
}