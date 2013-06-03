var moveTo=0,
    lineTo=1,
    arcTo=2,
    bezier3=3,
    bezier4=4,
    close=5;

var cToRad = 1/(60000*57.295779513);
var cToDeg = 1/cToRad;

function Path(extrusionOk, fill, stroke, w, h)
{
    if(stroke!=undefined)
        this.stroke = stroke;
    else
        this.stroke = true;

    this.extrusionOk = extrusionOk||false;
    this.fill = fill||'norm';

    this.pathW = w != undefined ? w : undefined;
    this.pathH = h != undefined ? h : undefined;

    this.ArrPathCommandInfo = [];
    this.ArrPathCommandLocal = [];
    this.ArrPathCommand = [];

    this.createDuplicate = function()
    {
        var duplicate = new Path(this.extrusionOk, this.fill, this.stroke, this.pathW, this.pathH);
        for(var i = 0; i<this.ArrPathCommandInfo.length; ++i)
        {
            duplicate.ArrPathCommandInfo[i] = clonePrototype(this.ArrPathCommandInfo[i]);
        }

        for (i = 0; i < this.ArrPathCommand.length; ++i)
        {
            duplicate.ArrPathCommand[i] = clonePrototype(this.ArrPathCommand[i]);
        }
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
        var multH, multW;

        multH = this.pathH == undefined ? 43200/gdLst["h"] : 43200/this.pathH;
        multW = this.pathW == undefined ? 43200/gdLst["w"] : 43200/this.pathW;
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

                    this.ArrPathCommandLocal.push({id:cmd.id, X:x0*multW, Y:y0*multH});

                    lastX=x0*multW;
                    lastY=y0*multH;
                    
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

                    this.ArrPathCommandLocal.push({id:bezier3, X0:x0*multW, Y0: y0*multH, X1:x1*multW, Y1:y1*multH});
                    
                    lastX=x1*multW;
                    lastY=y1*multH;
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



                    this.ArrPathCommandLocal.push({id:bezier3, X0:x0*multW, Y0: y0*multH, X1:x1*multW, Y1:y1*multH, X2:x2*multW, Y2:y2*multH});

                    lastX=x2*multW;
                    lastY=y2*multH;

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

                    this.ArrPathCommandLocal.push({id: arcTo,
                                              stX: lastX,
                                              stY: lastY,
                                              wR: wR*multW,
                                              hR: hR*multH,
                                              stAng: stAng*cToRad,
                                              swAng: swAng*cToRad});


                    var sin1 = Math.sin((stAng)*cToRad);
                    var cos1 = Math.cos((stAng)*cToRad);

                    var __x = cos1 / (wR*multW);
                    var __y = sin1 / (hR*multH);
                    var l = 1 / Math.sqrt(__x * __x + __y * __y);

                    var xc = lastX - l * cos1;
                    var yc = lastY - l * sin1;

                    lastX=(xc+multW*wR*Math.cos(AngToEllPrm((stAng+swAng)*cToRad, wR*multW, hR*multH)));
                    lastY=(yc+multH*hR*Math.sin(AngToEllPrm((stAng+swAng)*cToRad, wR*multW, hR*multH)));

                    break;
                }
                case close:
                {
                    this.ArrPathCommandLocal.push({id: close});
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

        var multH, multW;

        multH = this.pathH == undefined ? 43200/gdLst["h"] : 43200/this.pathH;
        multW = this.pathW == undefined ? 43200/gdLst["w"] : 43200/this.pathW;
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

                    this.ArrPathCommandLocal[i] = ({id:cmd.id, X:x0*multW, Y:y0*multH});

                    lastX=x0*multW;
                    lastY=y0*multH;

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

                    this.ArrPathCommandLocal[i] = ({id:bezier3, X0:x0*multW, Y0: y0*multH, X1:x1*multW, Y1:y1*multH});

                    lastX=x1*multW;
                    lastY=y1*multH;
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



                    this.ArrPathCommandLocal[i] = ({id:bezier3, X0:x0*multW, Y0: y0*multH, X1:x1*multW, Y1:y1*multH, X2:x2*multW, Y2:y2*multH});

                    lastX=x2*multW;
                    lastY=y2*multH;

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

                    this.ArrPathCommandLocal[i] = ({id: arcTo,
                        stX: lastX,
                        stY: lastY,
                        wR: wR*multW,
                        hR: hR*multH,
                        stAng: stAng*cToRad,
                        swAng: swAng*cToRad});


                    var sin1 = Math.sin((stAng)*cToRad);
                    var cos1 = Math.cos((stAng)*cToRad);

                    var __x = cos1 / (wR*multW);
                    var __y = sin1 / (hR*multH);
                    var l = 1 / Math.sqrt(__x * __x + __y * __y);

                    var xc = lastX - l * cos1;
                    var yc = lastY - l * sin1;

                    lastX=(xc+multW*wR*Math.cos(AngToEllPrm((stAng+swAng)*cToRad, wR*multW, hR*multH)));
                    lastY=(yc+multH*hR*Math.sin(AngToEllPrm((stAng+swAng)*cToRad, wR*multW, hR*multH)));

                    break;
                }
                case close:
                {
                    this.ArrPathCommandLocal[i] = ({id: close});
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
    },

    /*
    draw: function(graphics, line_color, line_width, fill_color, alpha, fillAlpha, lineAlpha)
    {
        var path=this.ArrPathCommand;
        graphics._s();
        graphics.p_width(line_width*100);
        for(var j=0, l=path.length; j<l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    graphics._m(cmd.X, cmd.Y);
                    break;
                }
                case lineTo:
                {
                    graphics._l(cmd.X, cmd.Y);
                    break;
                }
                case bezier3:
                {
                    graphics._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                    break;
                }
                case bezier4:
                {
                    graphics._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                    break;
                }
                case arcTo:
                {
                    Arc(graphics, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    graphics._z();

                    if(this.fill != 'none' && fill_color != null)
                    {
                        var finalFillColor;
                        switch (this.fill)
                        {
                            case "norm":
                            {
                                finalFillColor = fill_color;
                                break;
                            }
                            case "darken":
                            {
                                finalFillColor = fill_color.darken();
                                break;
                            }
                            case "darkenLess":
                            {
                                finalFillColor = fill_color.darkenLess();
                                break;
                            }
                            case "lighten":
                            {
                                finalFillColor = fill_color.lighten();
                                break;
                            }
                            case "lightenLess":
                            {
                                finalFillColor = fill_color.lightenLess();
                                break;
                            }
                        }
                        graphics.b_color1(finalFillColor. r, finalFillColor.g, finalFillColor.b, fill_color.a);
                        graphics.df();
                    }
                    if(this.stroke && line_color != null)
                    {
                        var tmpColor = line_color.norm(lineAlpha);
                        graphics.p_color(line_color.r, line_color.g, line_color.b, fill_color.a);
                        graphics.ds();
                    }
                    if(j<l-1)
                        graphics._s();
                    break;
                }
            }
        }
        if(this.fill!='none' && fill_color!=null)
        {
            switch (this.fill)
            {
                case "norm":
                {
                    finalFillColor = fill_color;
                    break;
                }
                case "darken":
                {
                    finalFillColor = fill_color.darken();
                    break;
                }
                case "darkenLess":
                {
                    finalFillColor = fill_color.darkenLess();
                    break;
                }
                case "lighten":
                {
                    finalFillColor = fill_color.lighten();
                    break;
                }
                case "lightenLess":
                {
                    finalFillColor = fill_color.lightenLess();
                    break;
                }
            }
            graphics.b_color1(finalFillColor. r, finalFillColor.g, finalFillColor.b, fill_color.a);
            graphics.df();
        }
        if(this.stroke && line_color!=null)
        {
            tmpColor = line_color.norm(lineAlpha);
            graphics.p_color(line_color.r, line_color.g, line_color.b, fill_color.a);
            graphics.ds();
        }
    },
    */
    draw: function(shape_drawer, w, h)
    {
        var multH1 = this.pathH == undefined ? 43200/h : 43200*43200/(h*this.pathH);
        var multW1 = this.pathW == undefined ? 43200/w : 43200*43200/(w*this.pathW);
        var multH = 100/multH1;
        var multW = 100/multW1;
        var path=this.ArrPathCommandLocal;
        shape_drawer._s();
        for(var j=0, l=path.length; j<l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    shape_drawer._m(cmd.X*multW, cmd.Y*multH);
                    break;
                }
                case lineTo:
                {
                    shape_drawer._l(cmd.X*multW, cmd.Y*multH);
                    break;
                }
                case bezier3:
                {
                    shape_drawer._c2(cmd.X0*multW, cmd.Y0*multH, cmd.X1*multW, cmd.Y1*multH);
                    break;
                }
                case bezier4:
                {
                    shape_drawer._c(cmd.X0*multW, cmd.Y0*multH, cmd.X1*multW, cmd.Y1*multH, cmd.X2*multW, cmd.Y2*multH);
                    break;
                }
                case arcTo:
                {
                    Arc3(shape_drawer, cmd.stX*multW, cmd.stY*multH, cmd.wR*multW, cmd.hR*multH, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    shape_drawer._z();
                    shape_drawer.df(this.fill);

                    if (this.stroke && !shape_drawer.bIsNoStrokeAttack)
                    {
                        shape_drawer.ds();
                    }
                    if (j < (l-1))
                        shape_drawer._s();
                    break;
                }
            }
        }

        shape_drawer.df(this.fill);

        if (this.stroke && !shape_drawer.bIsNoStrokeAttack)
        {
            shape_drawer.ds();
        }
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
                    Arc(checker, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
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
