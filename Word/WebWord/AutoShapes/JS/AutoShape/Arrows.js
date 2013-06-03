// размеры стрелок;
var lg=500,  mid=300, sm=200;
//типы стрелок
var ar_arrow=0, ar_diamond=1, ar_none=2, ar_oval=3, ar_stealth=4, ar_triangle=5;
//рисуем конечную стрелку
function DrawTailEnd(type, length, width, x, y, angle, graphics)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);
    x*=100;
    y*=100;
    switch(type)
    {
        case ar_arrow:
        {
            var xb, yb, xc, yc;
            xb=-length;
            yb=-width*0.5;

            xc=xb;
            yc=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics.ds();

            break;
        }
        case ar_diamond:
        {
            var xd, yd;
            xb=-length*0.5;
            yb=-width*0.5;

            xc=-length;
            yc=0;

            xd=xb;
            yd=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();

            break;
        }
        case ar_none:
        {
            break;
        }
        case ar_oval:
        {
            EllipseN(graphics, x, y, length*0.5, width*0.5, angle);
            break;
        }
        case ar_stealth:
        {
            xb=-length;
            yb=-width*0.5;

            xc=-length*0.5;
            yc=0;

            xd=xb;
            yd=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
        case ar_triangle:
        {
            xb=-length;
            yb=-width*0.5;

            xc=xb;
            yc=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
    }
}


//рисуем начальную стрелку
function DrawHeadEnd(type, length, width, x, y, angle, graphics)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);
    x*=100;
    y*=100;
    switch(type)
    {
        case ar_arrow:
        {
            var xb, yb, xc, yc;
            xb=length;
            yb=-width*0.5;

            xc=xb;
            yc=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics.ds();

            break;
        }
        case ar_diamond:
        {
            var xd, yd;
            xb=length*0.5;
            yb=-width*0.5;

            xc=length;
            yc=0;

            xd=xb;
            yd=yb+width;

            graphics._s();
            graphics._m(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(x, y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();

            break;
        }
        case ar_none:
        {
            break;
        }
        case ar_oval:
        {
            Ellipse2(graphics, x, y, length*0.5, width*0.5, angle);
            break;
        }
        case ar_stealth:
        {
            xb=length;
            yb=-width*0.5;

            xc=length*0.5;
            yc=0;

            xd=xb;
            yd=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._l(xd*cos-yd*sin+x, xd*sin+yd*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
        case ar_triangle:
        {
            xb=length;
            yb=-width*0.5;

            xc=xb;
            yc=-yb;

            graphics._s();
            graphics._m(x, y);
            graphics._l(xb*cos-yb*sin+x, xb*sin+yb*cos+y);
            graphics._l(xc*cos-yc*sin+x, xc*sin+yc*cos+y);
            graphics._z();
            graphics.ds();
            graphics.df();
            break;
        }
    }
}
