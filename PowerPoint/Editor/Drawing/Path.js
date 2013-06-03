var moveTo=0,
    lineTo=1,
    arcTo=2,
    bezier3=3,
    bezier4=4,
    close=5;

var cToRad = Math.PI / 10800000.0;
var cToDeg = 1/cToRad;

function Path(extrusionOk, fill, stroke, w, h)
{
    if(stroke!=undefined)
        this.stroke = stroke;
    else
        this.stroke = true;

    this.extrusionOk = extrusionOk||false;
    this.fill = fill||'norm';

    this.pathW = w;
    this.pathH = h;

    if(this.pathW!=undefined)
    {
        this.divPW = 1/w;
        this.divPH = 1/h;
    }

    this.ArrPathCommandInfo = new Array();
    this.ArrPathCommand = new Array();

    this.createDuplicate = function()
    {
        var duplicate = new Path(this.extrusionOk, this.fill, this.stroke, this.pathW, this.pathH);
        for(var i = 0; i<this.ArrPathCommandInfo.length; ++i)
        {
            duplicate.ArrPathCommandInfo[i] = clonePrototype(this.ArrPathCommandInfo[i]);
        }

        /*for (i = 0; i < this.ArrPathCommand.length; ++i)
        {
            duplicate.ArrPathCommand[i] = clonePrototype(this.ArrPathCommand[i]);
        }  */
        return duplicate;
    }
}

Path.prototype = {
    moveTo: function(x, y)
    {
        if(!isNaN(parseInt(x,10)))
            x=parseInt(x,10);
        if(!isNaN(parseInt(y,10)))
            y=parseInt(y,10);
        this.ArrPathCommandInfo.push({id:moveTo, X:x, Y:y});
    },

    lnTo: function(x, y)
    {
        if(!isNaN(parseInt(x,10)))
            x=parseInt(x,10);
        if(!isNaN(parseInt(y,10)))
            y=parseInt(y,10);
        this.ArrPathCommandInfo.push({id:lineTo, X:x, Y:y});
    },

    arcTo: function(wR, hR, stAng, swAng)
    {
        if(!isNaN(parseInt(wR,10)))
            wR=parseInt(wR,10);
        if(!isNaN(parseInt(hR,10)))
            hR=parseInt(hR,10);

        if(!isNaN(parseInt(stAng,10)))
            stAng=parseInt(stAng,10);
        if(!isNaN(parseInt(swAng,10)))
            swAng=parseInt(swAng,10);
        this.ArrPathCommandInfo.push({id: arcTo, wR: wR, hR: hR, stAng: stAng, swAng: swAng});
    },

    quadBezTo: function(x0, y0, x1, y1)
    {
        if(!isNaN(parseInt(x0,10)))
            x0=parseInt(x0,10);
        if(!isNaN(parseInt(y0,10)))
            y0=parseInt(y0,10);

        if(!isNaN(parseInt(x1,10)))
            x1=parseInt(x1,10);
        if(!isNaN(parseInt(y1,10)))
            y1=parseInt(y1,10);
        this.ArrPathCommandInfo.push({id:bezier3, X0:x0, Y0:y0, X1:x1, Y1:y1});
    },

    cubicBezTo: function(x0, y0, x1, y1, x2, y2)
    {
        if(!isNaN(parseInt(x0,10)))
            x0=parseInt(x0,10);
        if(!isNaN(parseInt(y0,10)))
            y0=parseInt(y0,10);

        if(!isNaN(parseInt(x1,10)))
            x1=parseInt(x1,10);
        if(!isNaN(parseInt(y1,10)))
            y1=parseInt(y1,10);

        if(!isNaN(parseInt(x2,10)))
            x2=parseInt(x2,10);
        if(!isNaN(parseInt(y2,10)))
            y2=parseInt(y2,10);
        this.ArrPathCommandInfo.push({id:bezier4, X0:x0, Y0:y0, X1:x1, Y1:y1, X2:x2, Y2:y2});
    },

    close: function()
    {
        this.ArrPathCommandInfo.push({id:close});
    },

    init: function(gdLst)
    {
        var ch, cw;
        if(this.pathW!=undefined)
        {
            ch = (gdLst["h"]/this.pathH);
            cw = (gdLst["w"]/this.pathW);
        }
        else
        {
            ch=1;
            cw=1;
        }
        var APCI=this.ArrPathCommandInfo, n = APCI.length, cmd;
        var x0, y0, x1, y1, x2, y2, wR, hR, stAng, swAng, lastX, lastY;
        for(var i=0; i<n; i++)
        {
            cmd=APCI[i];
            switch(cmd.id)
            {
                case moveTo:
                case lineTo:
                {
                    x0=parseInt(cmd.X);
                    if(isNaN(x0))
                    {
                        x0=gdLst[cmd.X];
                    }

                    y0=parseInt(cmd.Y);
                    if(isNaN(y0))
                    {
                        y0=gdLst[cmd.Y];
                    }

                    this.ArrPathCommand.push({id:cmd.id, X:x0*cw, Y:y0*ch});

                    lastX=x0*cw;
                    lastY=y0*ch;
                    
                    break;
                }
                case bezier3:
                {
                    x0=parseInt(cmd.X0);
                    if(isNaN(x0))
                    {
                        x0=gdLst[cmd.X0];
                    }

                    y0=parseInt(cmd.Y0);
                    if(isNaN(y0))
                    {
                        y0=gdLst[cmd.Y0];
                    }

                    x1=parseInt(cmd.X1);
                    if(isNaN(x1))
                    {
                        x1=gdLst[cmd.X1];
                    }

                    y1=parseInt(cmd.Y1);
                    if(isNaN(y1))
                    {
                        y1=gdLst[cmd.Y1];
                    }

                    this.ArrPathCommand.push({id:bezier3, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch});
                    
                    lastX=x1*cw;
                    lastY=y1*ch;
                    break;
                }
                case bezier4:
                {
                    x0=parseInt(cmd.X0);
                    if(isNaN(x0))
                    {
                        x0=gdLst[cmd.X0];
                    }

                    y0=parseInt(cmd.Y0);
                    if(isNaN(y0))
                    {
                        y0=gdLst[cmd.Y0];
                    }


                    x1=parseInt(cmd.X1);
                    if(isNaN(x1))
                    {
                        x1=gdLst[cmd.X1];
                    }

                    y1=parseInt(cmd.Y1);
                    if(isNaN(y1))
                    {
                        y1=gdLst[cmd.Y1];
                    }


                    x2=parseInt(cmd.X2);
                    if(isNaN(x2))
                    {
                        x2=gdLst[cmd.X2];
                    }

                    y2=parseInt(cmd.Y2);
                    if(isNaN(y2))
                    {
                        y2=gdLst[cmd.Y2];
                    }

                    
                    this.ArrPathCommand.push({id:bezier4, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch, X2:x2*cw, Y2:y2*ch});

                    lastX=x2*cw;
                    lastY=y2*ch;

                    break;
                }
                case arcTo:
                {
                    hR=parseInt(cmd.hR);
                    if(isNaN(hR))
                    {
                        hR=gdLst[cmd.hR];
                    }

                    wR=parseInt(cmd.wR);
                    if(isNaN(wR))
                    {
                        wR=gdLst[cmd.wR];
                    }

                    
                    stAng=parseInt(cmd.stAng);
                    if(isNaN(stAng))
                    {
                        stAng=gdLst[cmd.stAng];
                    }

                    swAng=parseInt(cmd.swAng);
                    if(isNaN(swAng))
                    {
                        swAng=gdLst[cmd.swAng];
                    }

                    var a1 = stAng;
                    var a2 = stAng + swAng;
                    var a3 = swAng;

                    stAng = Math.atan2(ch * Math.sin(a1 * cToRad), cw * Math.cos(a1 * cToRad)) / cToRad;
                    swAng = Math.atan2(ch * Math.sin(a2 * cToRad), cw * Math.cos(a2 * cToRad)) / cToRad - stAng;

                    if((swAng > 0) && (a3 < 0)) swAng -= 21600000;
                    if((swAng < 0) && (a3 > 0)) swAng += 21600000;
                    if(swAng == 0) swAng = 21600000;

                    var a = wR*cw;
                    var b = hR*ch;
                    var sin2 = Math.sin(stAng*cToRad);
                    var cos2 = Math.cos(stAng*cToRad);
                    var _xrad = cos2 / a;
                    var _yrad = sin2 / b;
                    var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                    var xc = lastX - l * cos2;
                    var yc = lastY - l * sin2;

                    var sin1 = Math.sin((stAng+swAng)*cToRad);
                    var cos1 = Math.cos((stAng+swAng)*cToRad);
                    var _xrad1 = cos1 / a;
                    var _yrad1 = sin1 / b;
                    var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);

                    this.ArrPathCommand[i]={id: arcTo,
                        stX: lastX,
                        stY: lastY,
                        wR: wR*cw,
                        hR: hR*ch,
                        stAng: stAng*cToRad,
                        swAng: swAng*cToRad};

                    lastX = xc + l1 * cos1;
                    lastY = yc + l1 * sin1;

                    /*
                    var sin1 = Math.sin(stAng+swAng);
                    var cos1 = Math.cos(stAng+swAng);

                    var __x = cos1 / (wR*cw);
                    var __y = sin1 / (hR*ch);
                    var l = 1 / Math.sqrt(__x * __x + __y * __y);

                    var xc = lastX - l * cos1;
                    var yc = lastY - l * sin1;

                    lastX=xc+cw*wR*Math.cos(AngToEllPrm(stAng+swAng, wR, hR));
                    lastY=yc+ch*hR*Math.sin(AngToEllPrm(stAng+swAng, wR, hR));
                    */
                    //lastX=lastX+wR*cw*(-Math.cos(stAng*cToRad)+Math.cos((stAng+swAng)*cToRad));
                    //lastY=lastY+hR*ch*(-Math.sin(stAng*cToRad)+Math.sin((stAng+swAng)*cToRad));
                    
                    break;
                }
                case close:
                {
                    this.ArrPathCommand.push({id: close});
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
    },

    recalculate: function(gdLst)
    {
        var ch, cw;
        if(this.pathW!=undefined)
        {
            ch = (gdLst["h"]/this.pathH);
            cw = (gdLst["w"]/this.pathW);
        }
        else
        {
            ch = 1;
            cw = 1;
        }
        var APCI=this.ArrPathCommandInfo, n = APCI.length, cmd;
        var x0, y0, x1, y1, x2, y2, wR, hR, stAng, swAng, lastX, lastY;
        for(var i=0; i<n; ++i)
        {
            cmd=APCI[i];
            switch(cmd.id)
            {
                case moveTo:
                case lineTo:
                {
                    x0=gdLst[cmd.X];
                    if(x0===undefined)
                    {
                        x0=cmd.X;
                    }

                    y0=gdLst[cmd.Y];
                    if(y0===undefined)
                    {
                        y0=cmd.Y;
                    }

                    this.ArrPathCommand[i] ={id:cmd.id, X:x0*cw, Y:y0*ch};

                    lastX=x0*cw;
                    lastY=y0*ch;

                    break;
                }
                case bezier3:
                {

                    x0=gdLst[cmd.X0];
                    if(x0===undefined)
                    {
                        x0=cmd.X0;
                    }

                    y0=gdLst[cmd.Y0];
                    if(y0===undefined)
                    {
                        y0=cmd.Y0;
                    }

                    x1=gdLst[cmd.X1];
                    if(x1===undefined)
                    {
                        x1=cmd.X1;
                    }

                    y1=gdLst[cmd.Y1];
                    if(y1===undefined)
                    {
                        y1=cmd.Y1;
                    }

                    this.ArrPathCommand[i]={id:bezier3, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch};

                    lastX=x1*cw;
                    lastY=y1*ch;
                    break;
                }
                case bezier4:
                {
                    x0=gdLst[cmd.X0];
                    if(x0===undefined)
                    {
                        x0=cmd.X0;
                    }

                    y0=gdLst[cmd.Y0];
                    if(y0===undefined)
                    {
                        y0=cmd.Y0;
                    }

                    x1=gdLst[cmd.X1];
                    if(x1===undefined)
                    {
                        x1=cmd.X1;
                    }

                    y1=gdLst[cmd.Y1];
                    if(y1===undefined)
                    {
                        y1=cmd.Y1;
                    }

                    x2=gdLst[cmd.X2];
                    if(x2===undefined)
                    {
                       x2=cmd.X2;
                    }

                    y2=gdLst[cmd.Y2];
                    if(y2===undefined)
                    {
                       y2=cmd.Y2;
                    }


                    this.ArrPathCommand[i]={id:bezier4, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch, X2:x2*cw, Y2:y2*ch};

                    lastX=x2*cw;
                    lastY=y2*ch;

                    break;
                }
                case arcTo:
                {
                     hR=gdLst[cmd.hR];

                    if(hR===undefined)
                    {
                       hR=cmd.hR;
                    }


                    wR=gdLst[cmd.wR];
                    if(wR===undefined)
                    {
                        wR=cmd.wR;
                    }

                    stAng=gdLst[cmd.stAng];
                    if(stAng===undefined)
                    {
                        stAng=cmd.stAng;
                    }


                    swAng=gdLst[cmd.swAng];
                    if(swAng===undefined)
                    {
                        swAng=cmd.swAng;
                    }


                    var a1 = stAng;
                    var a2 = stAng + swAng;
                    var a3 = swAng;

                    stAng = Math.atan2(ch * Math.sin(a1 * cToRad), cw * Math.cos(a1 * cToRad)) / cToRad;
                    swAng = Math.atan2(ch * Math.sin(a2 * cToRad), cw * Math.cos(a2 * cToRad)) / cToRad - stAng;

                    if((swAng > 0) && (a3 < 0)) swAng -= 21600000;
                    if((swAng < 0) && (a3 > 0)) swAng += 21600000;
                    if(swAng == 0) swAng = 21600000;

                    var a = wR*cw;
                    var b = hR*ch;
                    var sin2 = Math.sin(stAng*cToRad);
                    var cos2 = Math.cos(stAng*cToRad);
                    var _xrad = cos2 / a;
                    var _yrad = sin2 / b;
                    var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                    var xc = lastX - l * cos2;
                    var yc = lastY - l * sin2;

                    var sin1 = Math.sin((stAng+swAng)*cToRad);
                    var cos1 = Math.cos((stAng+swAng)*cToRad);
                    var _xrad1 = cos1 / a;
                    var _yrad1 = sin1 / b;
                    var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);

                    this.ArrPathCommand[i]={id: arcTo,
                        stX: lastX,
                        stY: lastY,
                        wR: wR*cw,
                        hR: hR*ch,
                        stAng: stAng*cToRad,
                        swAng: swAng*cToRad};

                    lastX = xc + l1 * cos1;
                    lastY = yc + l1 * sin1;


                    break;
                }
                case close:
                {
                    this.ArrPathCommand[i]={id: close};
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
    },

    draw: function(shape_drawer)
    {
        if (shape_drawer.bIsCheckBounds === true && this.fill == "none")
        {
            // это для текстур
            return;
        }

        var bIsDrawLast = false;
        var path=this.ArrPathCommand;

        shape_drawer._s();
        for(var j=0, l=path.length; j<l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    bIsDrawLast = true;
                    shape_drawer._m(cmd.X, cmd.Y);
                    break;
                }
                case lineTo:
                {
                    bIsDrawLast = true;
                    shape_drawer._l(cmd.X, cmd.Y);
                    break;
                }
                case bezier3:
                {
                    bIsDrawLast = true;
                    shape_drawer._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                    break;
                }
                case bezier4:
                {
                    bIsDrawLast = true;
                    shape_drawer._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                    break;
                }
                case arcTo:
                {
                    bIsDrawLast = true;
                    ArcToCurvers(shape_drawer, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    shape_drawer._z();

                    //shape_drawer.drawFillStroke(true, this.fill, this.stroke && !shape_drawer.bIsNoStrokeAttack);
                    //bIsDrawLast = false;
                    //if (j < (l-1))
                    //    shape_drawer._s();
                    break;
                }
            }
        }

        if (bIsDrawLast)
        {
            shape_drawer.drawFillStroke(true, this.fill, this.stroke && !shape_drawer.bIsNoStrokeAttack);
        }

        shape_drawer._e();
        /*
        shape_drawer.df(this.fill);

        if (this.stroke && !shape_drawer.bIsNoStrokeAttack)
        {
            shape_drawer.ds();
        }
        */
    },

    check_bounds: function(checker)
    {
        var path=this.ArrPathCommand;
        for(var j=0, l=path.length; j<l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    checker._m(cmd.X, cmd.Y);
                    break;
                }
                case lineTo:
                {
                    checker._l(cmd.X, cmd.Y);
                    break;
                }
                case bezier3:
                {
                    checker._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                    break;
                }
                case bezier4:
                {
                    checker._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                    break;
                }
                case arcTo:
                {
                    ArcToCurvers(checker, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    checker._z();
                    break;
                }
            }
        }
    }
};
