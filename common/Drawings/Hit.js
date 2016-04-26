"use strict";

(function(window, undefined){
    // Import
    var global_mouseEvent = AscCommon.global_mouseEvent;
    
function HitInLine(context, px, py, x0, y0, x1, y1)
{
   /* var l = Math.min(x0, x1);
    var t = Math.min(y0, y1);
    var r = Math.max(x0, x1);
    var b = Math.max(y0, y1);
    if(px < l || px > r || py < t || py > b)
        return false;*/
    var tx, ty, dx, dy, d;
    tx=x1-x0;
    ty=y1-y0;

    d=1.5/Math.sqrt(tx*tx+ty*ty);

    if(typeof global_mouseEvent !== "undefined" && AscCommon.isRealObject(global_mouseEvent) && AscFormat.isRealNumber(global_mouseEvent.KoefPixToMM))
    {
        d *= global_mouseEvent.KoefPixToMM;
    }

    if (undefined !== window.AscHitToHandlesEpsilon)
    {
        d = window.AscHitToHandlesEpsilon/Math.sqrt(tx*tx+ty*ty);
    }

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

    if(typeof global_mouseEvent !== "undefined" && AscCommon.isRealObject(global_mouseEvent) && AscFormat.isRealNumber(global_mouseEvent.KoefPixToMM))
    {
        d *= global_mouseEvent.KoefPixToMM;
    }

    if (undefined !== window.AscHitToHandlesEpsilon)
    {
        d = window.AscHitToHandlesEpsilon/Math.sqrt(tx*tx+ty*ty);
    }

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

    if(typeof global_mouseEvent !== "undefined" && AscCommon.isRealObject(global_mouseEvent) && AscFormat.isRealNumber(global_mouseEvent.KoefPixToMM))
    {
        d *= global_mouseEvent.KoefPixToMM;
    }

    if (undefined !== window.AscHitToHandlesEpsilon)
    {
        d = window.AscHitToHandlesEpsilon/Math.sqrt(tx*tx+ty*ty);
    }

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

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].HitInLine = HitInLine;
    window['AscFormat'].HitInBezier4 = HitInBezier4;
    window['AscFormat'].HitInBezier3 = HitInBezier3;
})(window);
