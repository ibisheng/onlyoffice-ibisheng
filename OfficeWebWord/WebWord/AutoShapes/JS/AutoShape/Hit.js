function HitInLine(context, px, py, x0, y0, x1, y1)
{
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

function HitToArc4(context, px, py, xc, yc, wR, hR, stAng, swAng)
{
    var bx0, by0, bx1, by1, bx2, by2, bx3, by3;
    var ex1, ey1, ex2, ey2;
    //определяем координаты крайних точек кривой
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    var A1=stAng+0.3333333*swAng, A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    var tx1, ty1, tx2, ty2;
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    var d=1/108;
    bx1=(12*tx1-6*tx2)*d;
    by1=(12*ty1-6*ty2)*d;
    bx2=(12*tx2-6*tx1)*d;
    by2=(12*ty2-6*ty1)*d;

    return HitInBezier4(context, px, py, bx0, by0, bx1, by1, bx2, by2, bx3, by3);
}


function HitToArc(context, px, py, lastX, lastY, wR, hR, stAng, swAng)
{
   var xc, yc;

    var sin1 = Math.sin(stAng);
    var cos1 = Math.cos(stAng);

    var __x = cos1 / wR;
    var __y = sin1 / hR;
    var l = 1 / Math.sqrt(__x * __x + __y * __y);

    xc = lastX - l * cos1;
    yc = lastY - l * sin1;
    return HitToArc4(context, px, py, xc, yc, wR, hR, stAng, swAng*0.25)||
            HitToArc4(context, px, py, xc, yc, wR, hR, stAng+swAng*0.25, swAng*0.25)||
        HitToArc4(context, px, py, xc, yc, wR, hR, stAng+swAng*0.5, swAng*0.25)||
        HitToArc4(context, px, py, xc, yc, wR, hR, stAng+swAng*0.75, swAng*0.25);
}