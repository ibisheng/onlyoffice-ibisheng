var double_eps = 0.00001;
var hit_error_eps = 0.5;
function HitInLine(context, px, py, x0, y0, x1, y1)
{
    var tx, ty, dx, dy, d;
    tx=x1-x0;
    ty=y1-y0;

    if (Math.abs(tx*tx+ty*ty) < double_eps)
        return HitInLine(context, px, py, x0, y0, x1 + hit_error_eps, y1 + hit_error_eps);

    d=1.5/Math.sqrt(tx*tx+ty*ty);
    if(global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM))
        d *= global_mouseEvent.KoefPixToMM;

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

    if (Math.abs(tx*tx+ty*ty) < double_eps)
        return HitInLine(context, px, py, x0, y0, x1, y1, x2, y2, x3 + hit_error_eps, y3 + hit_error_eps);

    d=1.5/Math.sqrt(tx*tx+ty*ty);
    if(global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM))
        d *= global_mouseEvent.KoefPixToMM;

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

    if (Math.abs(tx*tx+ty*ty) < double_eps)
        return HitInLine(context, px, py, x0, y0, x1, y1, x2 + hit_error_eps, y2 + hit_error_eps);

    d=1.5/Math.sqrt(tx*tx+ty*ty);
    if(global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM))
        d *= global_mouseEvent.KoefPixToMM;

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



