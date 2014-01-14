/*function PointToSegmentDistance( px, py, x0, y0, x1, y1)
{
    var vx = x1 - x0;
    var vy = y1 - y0;
    var wx = px - x0;
    var wy = py - y0;
    var

    var c1 = vx*wx + vy*wy;
    if ( c1 <= 0 )
        return Math.sqrt(wx*wx + wy*wy);
    var c2 = vx*vx + vy*vy;
    if ( c2 <= c1 )
        return d(P, P1)
    b = c1 / c2
    Pb = P0 + bv
    return d(P, Pb)
}          */

function HitInLine(context, px, py, x0, y0, x1, y1)
{
    var l = Math.min(x0, x1);
    var t = Math.min(y0, y1);
    var r = Math.max(x0, x1);
    var b = Math.max(y0, y1);
    if(px < l || px > r || py < t || py > b)
        return false;
    var tx, ty, dx, dy, d;
    tx=x1-x0;
    ty=y1-y0;

    d=1.5/Math.sqrt(tx*tx+ty*ty);

    dx=-ty*d;
    dy=tx*d;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0+dx, y0+dy);
    context.lineTo(x1+dx, y1+dy);
    context.lineTo(x1-dx, y1-dy);
    context.lineTo(x0-dx, y0-dy);
    context.closePath();
    return context.isPointInPath(px, py);
}

function HitInBezier4(context, px, py, x0, y0, x1, y1, x2, y2, x3, y3)
{
    var l = Math.min(x0, x1, x2, x3);
    var t = Math.min(y0, y1, y2, y3);
    var r = Math.max(x0, x1, x2, x3);
    var b = Math.max(y0, y1, y2, y3);
    if(px < l || px > r || py < t || py > b)
        return false;
    var tx, ty, dx, dy, d;
    tx=x3-x0;
    ty=y3-y0;

    d=1.5/Math.sqrt(tx*tx+ty*ty);

    dx=-ty*d;
    dy=tx*d;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0+dx, y0+dy);
    context.bezierCurveTo(x1+dx, y1+dy, x2+dx, y2+dy, x3+dx, y3+dy);
    context.lineTo(x3-dx, y3-dy);
    context.bezierCurveTo(x2-dx, y2-dy, x1-dx, y1-dy, x0-dx, y0-dy);
    context.closePath();
    return context.isPointInPath(px, py);
}

function HitInBezier3(context, px, py, x0, y0, x1, y1, x2, y2)
{
    var l = Math.min(x0, x1, x2);
    var t = Math.min(y0, y1, y2);
    var r = Math.max(x0, x1, x2);
    var b = Math.max(y0, y1, y2);
    if(px < l || px > r || py < t || py > b)
        return false;
    var tx, ty, dx, dy, d;
    tx=x2-x0;
    ty=y2-y0;

    d=1.5/Math.sqrt(tx*tx+ty*ty);

    dx=-ty*d;
    dy=tx*d;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0+dx, y0+dy);
    context.quadraticCurveTo(x1+dx, y1+dy, x2+dx, y2+dy);
    context.lineTo(x2-dx, y2-dy);
    context.quadraticCurveTo(x1-dx, y1-dy, x0-dx, y0-dy);
    context.closePath();
    return context.isPointInPath(px, py);
}



