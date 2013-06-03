var d=1/108;
var k1=12/108, k2=6/108;
function arcTo3(context, xc, yc, wR, hR, stAng, swAng){
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

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);
    context.bezierCurveTo(bx1*0.01, by1*0.01, bx2*0.01, by2*0.01, bx3*0.01, by3*0.01);
}
function ArcTo(context, lastX, lastY, wR, hR, stAng, swAng){
    //для лучшей аппроксимации разобьем дугу на четыре части
    var xc=lastX-wR*Math.cos(stAng),
        yc=lastY-hR*Math.sin(stAng);
    swAng*=0.25;
    arcTo3(context, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    arcTo3(context, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    arcTo3(context, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    arcTo3(context, xc, yc, wR, hR, stAng, swAng);
}
function HitToArc3(x, y, context, xc, yc, wR, hR, stAng, swAng){
    var bx0, by0, bx1, by1, bx2, by2, bx3, by3;
    var ex1, ey1, ex2, ey2;
    //определяем координаты крайних точек кривой
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);
    //координаты двух точек на дуге через которые должна проходить кривая Безье
    var A1=stAng+0.3333333*swAng, A2=stAng+0.6666666*swAng;
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
    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);
    //context.lineTo(bx0, by0);
    var dx=bx3-bx0,
    dy=by3-by0;
    d=1/Math.sqrt(dx*dx+dy*dy);
    var vx=dy*d*5000,
        vy=-dx*d*5000;
    context.beginPath();
    context.moveTo(bx0+vx, by0+vy);
    context.bezierCurveTo(bx1+vx, by1+vy, bx2+vx, by2+vy, bx3+vx, by3+vy);
    context.stroke();
    context.lineTo(bx3-vx, by3-vy);
    context.stroke();
    context.moveTo(bx0-vx, by0-vy);
    context.bezierCurveTo(bx1-vx, by1-vy, bx2-vx, by2-vy, bx3-vx, by3-vy);
    context.stroke();
    context.moveTo(bx0-vx, by0-vy);
    context.lineTo(bx0+vx, by0+vy);
    context.stroke();
    return context.isPointInPath(x, y);
}
/*function HitToArc(x, y, context, lastX, lastY, wR, hR, stAng, swAng){
    //для лучшей аппроксимации разобьем дугу на четыре части
    var xc=lastX-wR*Math.cos(stAng),
        yc=lastY-hR*Math.sin(stAng);
    return HitToArc3(x, y, context, xc, yc, wR, hR, stAng, swAng*0.25)||
    HitToArc3(x, y, context, xc, yc, wR, hR, stAng+swAng*0.25, swAng*0.25)||
    HitToArc3(x, y, context, xc, yc, wR, hR, stAng+swAng*0.5, swAng*0.25)||
    HitToArc3(x, y, context, xc, yc, wR, hR, stAng+swAng*0.75, swAng*0.25);
}*/

function Arc4(graphics, xc, yc, wR, hR, stAng, swAng)
{

    var bx0, by0, bx1, by1, bx2, by2, bx3, by3;
    var ex1, ey1, ex2, ey2, r0, r1, r2, r3;

    bx0=xc+wR*Math.cos(AngToEllPrm(stAng, wR, hR));
    by0=yc+hR*Math.sin(AngToEllPrm(stAng, wR, hR));


    ex1=xc+wR*Math.cos(AngToEllPrm(stAng+swAng/3.0, wR, hR));
    ey1=yc+hR*Math.sin(AngToEllPrm(stAng+swAng/3.0, wR, hR));


    ex2=xc+wR*Math.cos(AngToEllPrm(stAng+swAng/1.5, wR, hR));
    ey2=yc+hR*Math.sin(AngToEllPrm(stAng+swAng/1.5, wR, hR));

    bx3=xc+wR*Math.cos(AngToEllPrm(stAng+swAng, wR, hR));
    by3=yc+hR*Math.sin(AngToEllPrm(stAng+swAng, wR, hR));
    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    var tx1, ty1, tx2, ty2;
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);
    graphics._c(bx1, by1, bx2, by2, bx3, by3);
}

function Arc(graphics, lastX, lastY, wR, hR, stAng, swAng)
{
    var xc, yc;

    var sin1 = Math.sin(stAng);
    var cos1 = Math.cos(stAng);

    var __x = cos1 / wR;
    var __y = sin1 / hR;
    var l = 1 / Math.sqrt(__x * __x + __y * __y);

    xc = lastX - l * cos1;
    yc = lastY - l * sin1;

    swAng*=0.125;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
    stAng+=swAng;
    Arc4(graphics, xc, yc, wR, hR, stAng, swAng);
}

function EllipseN(graphics, x, y, a, b, angle)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);

    graphics._s();
    graphics._m(x, y);

    var bx0, by0, bx1, by1, bx2, by2, bx3, by3;
    var ex1, ey1, ex2, ey2;
    var wR=a, hR = b, xc=x-a, yc=y, stAng, swAng;
    //определяем координаты крайних точек кривой
    stAng=0;
    swAng=Math.PI*0.5;
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

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);


    stAng=Math.PI*0.5;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);



    stAng=Math.PI;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);


    stAng=Math.PI*1.5;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);


    graphics._z();
    graphics.ds();
    graphics.df();
}


function Ellipse2(graphics, x, y, a, b, angle)
{
    var sin, cos;
    sin=Math.sin(angle);
    cos=Math.cos(angle);

    graphics._s();
    graphics._m(x, y);

    var bx0, by0, bx1, by1, bx2, by2, bx3, by3;
    var ex1, ey1, ex2, ey2;
    var wR=a, hR = b, xc=x+a, yc=y, stAng, swAng;
    //определяем координаты крайних точек кривой
    stAng=Math.PI;
    swAng=Math.PI*0.5;
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

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);


    stAng=Math.PI*1.5;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);



    stAng=0;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);


    stAng=Math.PI*0.5;
    swAng=Math.PI*0.5;
    bx0=xc+wR*Math.cos(stAng);
    by0=yc+hR*Math.sin(stAng);
    bx3=xc+wR*Math.cos(stAng+swAng);
    by3=yc+hR*Math.sin(stAng+swAng);

    //координаты двух точек на дуге через которые должна проходить кривая Безье
    A1=stAng+0.3333333*swAng;
    A2=stAng+0.6666667*swAng;
    ex1=xc+wR*Math.cos(A1);
    ey1=yc+hR*Math.sin(A1);
    ex2=xc+wR*Math.cos(A2);
    ey2=yc+hR*Math.sin(A2);

    //вычислим две оставшиеся опорные точки кривой Безье, так чтобы она проходила через  точки (ex1, ey1), (ex2, ey2)
    tx1=27*ex1-8*bx0-bx3;
    ty1=27*ey1-8*by0-by3;
    tx2=27*ex2-bx0-8*bx3;
    ty2=27*ey2-by0-8*by3;

    bx1=(k1*tx1-k2*tx2);
    by1=(k1*ty1-k2*ty2);
    bx2=(k1*tx2-k2*tx1);
    by2=(k1*ty2-k2*ty1);

    bx1-=x;
    by1-=y;
    bx2-=x;
    by2-=y;
    bx3-=x;
    by3-=y;
    graphics._c(bx1*cos-by1*sin+x, bx1*sin+by1*cos+y, bx2*cos-by2*sin+x, bx2*sin+by2*cos+y, bx3*cos-by3*sin+x, bx3*sin+by3*cos+y);
    graphics._z();
    graphics.ds();
    graphics.df();
}


// arcTo new version
function Arc3(ctx, fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle)
{
    var sin1 = Math.sin(fStartAngle);
    var cos1 = Math.cos(fStartAngle);

    var __x = cos1 / fWidth;
    var __y = sin1 / fHeight;
    var l = 1 / Math.sqrt(__x * __x + __y * __y);

    var cx = fX - l * cos1;
    var cy = fY - l * sin1;


    Arc2(ctx, cx - fWidth, cy - fHeight, 2 * fWidth, 2 * fHeight, fStartAngle, fSweepAngle);
}

function Arc2(ctx, fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle)
{
    if (0 >= fWidth || 0 >= fHeight)
        return;

    fStartAngle = -fStartAngle;
    fSweepAngle = -fSweepAngle;

    if (false /*is path closed*/ )
    {
        var fStartX = fX + fWidth / 2.0 + fWidth / 2 * Math.cos( AngToEllPrm( fStartAngle, fWidth / 2, fHeight / 2 ) );
        var fStartY = fY + fHeight / 2.0 - fHeight / 2 * Math.sin( AngToEllPrm ( fStartAngle, fWidth / 2, fHeight / 2 ) );

        if ( fSweepAngle < (2 * Math.PI) )
        {
            ctx._m(fStartX, fStartY);
        }
    }

    var bClockDirection = false;
    var fEndAngle = (2 * Math.PI) -(fSweepAngle + fStartAngle);
    var fSrtAngle = (2 * Math.PI) - fStartAngle;
    if( fSweepAngle > 0 )
        bClockDirection = true;

    if(Math.abs(fSweepAngle) >= (2 * Math.PI))
    {
        Ellipse(ctx, fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2);
    }
    else
    {
        EllipseArc(ctx, fX + fWidth / 2, fY + fHeight / 2, fWidth / 2, fHeight / 2, fSrtAngle, fEndAngle, bClockDirection);
    }
}

function AngToEllPrm(fAngle, fXRad, fYRad)
{
    return Math.atan2( Math.sin( fAngle ) / fYRad,  Math.cos( fAngle ) / fXRad );
}

function Ellipse(ctx, fX, fY, fXRad, fYRad)
{
    ctx._m(fX - fXRad, fY);

    var c_fKappa = 0.552;
    ctx._c(fX - fXRad, fY + fYRad * c_fKappa, fX - fXRad * c_fKappa, fY + fYRad, fX, fY + fYRad);
    ctx._c(fX + fXRad * c_fKappa, fY + fYRad, fX + fXRad, fY + fYRad * c_fKappa, fX + fXRad, fY);
    ctx._c(fX + fXRad, fY - fYRad * c_fKappa, fX + fXRad * c_fKappa, fY - fYRad, fX, fY - fYRad);
    ctx._c(fX - fXRad * c_fKappa, fY - fYRad, fX - fXRad, fY - fYRad * c_fKappa, fX - fXRad, fY);
}

function EllipseArc(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, bClockDirection)
{
    while ( fAngle1 < 0 )
        fAngle1 += (2 * Math.PI);

    while ( fAngle1 > (2 * Math.PI) )
        fAngle1 -= (2 * Math.PI);

    while ( fAngle2 < 0 )
        fAngle2 += (2 * Math.PI);

    while ( fAngle2 >= (2 * Math.PI) )
        fAngle2 -= (2 * Math.PI);

    if ( !bClockDirection )
    {
        if ( fAngle1 <= fAngle2 )
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, false);
        else
        {
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, 2 * Math.PI, false);
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, 0, fAngle2, false);
        }
    }
    else
    {
        if ( fAngle1 >= fAngle2 )
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, fAngle2, true);
        else
        {
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, fAngle1, 0, true);
            EllipseArc2(ctx, fX, fY, fXRad, fYRad, 2 * Math.PI, fAngle2, true);
        }
    }
}

function EllipseArc2(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
{
    var nFirstPointQuard  = parseInt(2 * dAngle1 / Math.PI) + 1;
    var nSecondPointQuard = parseInt(2 * dAngle2 / Math.PI) + 1;
    nSecondPointQuard = Math.min( 4, Math.max( 1, nSecondPointQuard ) );
    nFirstPointQuard  = Math.min( 4, Math.max( 1, nFirstPointQuard ) );

    var fStartX = fX + fXRad * Math.cos( AngToEllPrm( dAngle1, fXRad, fYRad ) );
    var fStartY = fY + fYRad * Math.sin( AngToEllPrm( dAngle1, fXRad, fYRad ) );

    var EndPoint = {X: 0, Y: 0};
    ctx._l(fStartX, fStartY);

    var fCurX = fStartX, fCurY = fStartY;
    var dStartAngle = dAngle1;
    var dEndAngle = 0;

    if ( !bClockDirection )
    {
        for( var nIndex = nFirstPointQuard; nIndex <= nSecondPointQuard; nIndex++ )
        {
            if ( nIndex == nSecondPointQuard )
                dEndAngle = dAngle2;
            else
                dEndAngle = nIndex * Math.PI / 2;
            if ( !( nIndex == nFirstPointQuard ) )
                dStartAngle = (nIndex - 1 ) * Math.PI / 2;

            EndPoint = EllipseArc3(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
        }
    }
    else
    {
        for( var nIndex = nFirstPointQuard; nIndex >= nSecondPointQuard; nIndex-- )
        {
            if ( nIndex == nFirstPointQuard )
                dStartAngle = dAngle1;
            else
                dStartAngle = nIndex * Math.PI / 2;
            if ( !( nIndex == nSecondPointQuard ) )
                dEndAngle = (nIndex - 1 ) * Math.PI / 2;
            else
                dEndAngle = dAngle2;

            EndPoint = EllipseArc3(ctx, fX, fY, fXRad, fYRad, AngToEllPrm( dStartAngle, fXRad, fYRad ), AngToEllPrm( dEndAngle, fXRad, fYRad ), false);
        }
    }
}

function EllipseArc3(ctx, fX, fY, fXRad, fYRad, dAngle1, dAngle2, bClockDirection)
{
    var fAlpha = Math.sin( dAngle2 - dAngle1 ) * ( Math.sqrt( 4.0 + 3.0 * Math.tan( (dAngle2 - dAngle1) / 2.0 ) * Math.tan( (dAngle2 - dAngle1) / 2.0 ) ) - 1.0 ) / 3.0;

    var sin1 = Math.sin(dAngle1);
    var cos1 = Math.cos(dAngle1);
    var sin2 = Math.sin(dAngle2);
    var cos2 = Math.cos(dAngle2);

    var fX1 = fX + fXRad * cos1;
    var fY1 = fY + fYRad * sin1;

    var fX2 = fX + fXRad * cos2;
    var fY2 = fY + fYRad * sin2;

    var fCX1 = fX1 - fAlpha * fXRad * sin1;
    var fCY1 = fY1 + fAlpha * fYRad * cos1;

    var fCX2 = fX2 + fAlpha * fXRad * sin2;
    var fCY2 = fY2 - fAlpha * fYRad * cos2;

    if ( !bClockDirection )
    {
        ctx._c(fCX1, fCY1, fCX2, fCY2, fX2, fY2);
        return {X: fX2, Y: fY2};
    }
    else
    {
        ctx._c(fCX2, fCY2, fCX1, fCY1, fX1, fY1);
        return {X: fX1, Y: fY1};
    }
}
