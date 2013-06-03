/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 3/30/12
 * Time: 5:21 PM
 * To change graphics template use File | Settings | File Templates.
 */
function circle(graphics, xc, yc, r)
{
    graphics._s();
    ArcToCurvers(graphics, xc+r, yc, r, r, 0, 2*Math.PI);
    graphics._z();
    graphics.ds();
    graphics.df();
}

function diamond(graphics, xc, yc, d)
{
    d*=0.5;
    graphics._s();
    graphics._m(xc, yc-d);
    graphics._l(xc+d, yc);
    graphics._l(xc, yc+d);
    graphics._l(xc-d, yc);
    graphics._z();
    graphics.ds();
    graphics.df();
}

function square(graphics, xc, yc, d)
{
    graphics._s();
    graphics._m(xc-d, yc-d);
    graphics._l(xc+d, yc-d);
    graphics._l(xc+d, yc+d);
    graphics._l(xc-d, yc+d);
    graphics._z();
    graphics.ds();
    graphics.df();
}
