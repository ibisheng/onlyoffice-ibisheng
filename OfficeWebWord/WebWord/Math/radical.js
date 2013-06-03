function CRadical()
{
    this.gapTop = 0;
    this.gapLeft = 0;

    CMathBase.call(this, 1, 1);
}
extend(CRadical, CMathBase);
CRadical.prototype.setContent = function()
{
    this.fillPlaceholders();
}
CRadical.prototype._old_old_recalculateSize = function()
{
    var sizeArg = this.elements[0][0].size;

    var w = l = this.params.font.FontSize/47,
        h = this.params.font.metrics.Height;

    var  maxH = getMaxHeight(this.params.font);
    this.gap_radical.left = 0.15*h + (0.1*sizeArg.height  + 0.3*h)*0.8 - sizeArg.height*0.05 + (maxH - sizeArg.height)/20;
    this.gap_radical.top = 2*w;

     var height = sizeArg.height + this.gap_radical.top,
        center = sizeArg.center + this.gap_radical.top,
        width  = sizeArg.width + this.gap_radical.left;

    height = height < h ? h : height;
    this.size = {height: height, width: width, center: center};

}
CRadical.prototype.old_recalculateSize = function()
{
    var sizeArg = this.elements[0][0].size;
    var minHeight = this.params.font.metrics.Height;

    var height, width, center,
        top = this.params.font.FontSize*g_dKoef_pt_to_mm,
        left = 1.6*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    top *= 0.21;

    /*var height, width, center,
        top = 3.5*this.params.type.font.FontSize/47,
        left = 1.6*(this.params.type.metrics.Height - this.params.type.metrics.Placeholder.Height);*/

    var penW = 1;
    left += penW/2;

    var sh = this.params.font.FontSize * 25.4/96;
    left += sh * 0.1;

    if(sizeArg.height < minHeight - top)
        height = minHeight;
    else
        height = sizeArg.height + top;

    ascentArg = sizeArg.height - sizeArg.center;
    center = height - ascentArg;
    width = left + sizeArg.width;

    this.gapLeft = left;
    this.gapTop = height - sizeArg.height;

    this.size = {width: width, height: height, center: center};
}
CRadical.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    //var minHeight = this.params.type.metrics.Height;

    var height, width, center,
        left = 1.85*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    var top = this.params.font.FontSize*g_dKoef_pt_to_mm*0.15;
    var penW = this.params.font.FontSize*g_dKoef_pt_to_mm*0.042;

    //var penW = 1* 25.4/96; //mm

    height = getStateHeight_3(arg.height + top, this.params.font);
    height += penW;
    width = arg.width + left;

    this.gapTop = (height - arg.height + penW + top)/2;
    this.gapLeft = left;

    center = this.gapTop + arg.center;

    this.size = {width: width, height: height, center: center};

}
CRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};
    var x = this.pos.x + this.gapLeft,
        y = this.pos.y + this.gapTop;

    this.elements[0][0].setPosition({x: x, y: y });
}
CRadical.prototype.mouseDown = function(pos)
{
    var coord = {x: pos.x - this.gapLeft, y: pos.y - this.gapTop};
    return CRadical.superclass.mouseDown.call(this, coord);
}
CRadical.prototype.mouseMove = function(pos)
{
    var coord = {x: pos.x - this.gapLeft, y: pos.y - this.gapTop};
    return CRadical.superclass.mouseMove.call(this, coord);
}
//context.fill() для заливки
//Graphics : df()

CRadical.prototype.old_draw = function()
{
    var x = this.pos.x,
        y = this.pos.y;

    /*var penW = this.params.type.font.FontSize/12.5;
    penW = parseInt(penW + 0.5);
    penW = 72 / 25.4;

    if(penW == 0)
        penW = 1;*/

    //var penW = 96/25.4;
    //var penW = 1; //px

    var penW = this.params.font.FontSize*g_dKoef_pt_to_mm*0.042;
    penW *= 96/25.4;

    var minHeight = this.params.font.metrics.Height,
        maxHeight = 4*this.params.font.metrics.Height + this.params.font.metrics.Placeholder.Height;

    var minHgtTick = this.params.font.metrics.Placeholder.Height*2/3,
        maxHgtTick = this.params.font.metrics.Height;

    var maxWidth = 1.6*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    var coeff = 0.2*maxWidth/(maxHeight - minHeight),
        b = maxWidth*0.3 - coeff*minHeight;

    var x1 = x,
        x2 = x + 0.2*maxWidth;


    if(this.size.height < maxHeight)
        x3 = x2 + coeff*this.size.height + b;
    else
        x3 = x2 + coeff*maxHeight + b;

    var x4 = x + maxWidth,
        x5 = x + this.size.width;

    if ( this.size.height > maxHeight )
        heightTick = maxHgtTick;
    else
    {
        var alpha = (this.size.height - minHeight)/maxHeight;
        heightTick = minHgtTick*(1 + alpha);
    }

    var y2 = y + this.size.height - heightTick,
        y1 = y2 + 0.12*maxWidth,
        y3 = y + this.size.height,
        y4 = y,
        y5 = y;


    MathControl.pGraph.p_width(penW*0.8*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x1*100, y1*100);
    MathControl.pGraph._l(x2*100, y2*100);
    MathControl.pGraph.ds();


    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x2*100, y2*100);
    MathControl.pGraph._l(x3*100, y3*100);
    MathControl.pGraph.ds();

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x3*100, y3*100);
    MathControl.pGraph._l(x4*100, y4*100);
    MathControl.pGraph._l(x5*100,y5*100);
    MathControl.pGraph.ds();

    var tX = x2 + penW*0.5*25.4/96,
        tY = y2 - penW*0.5*25.4/96*0.6;

    MathControl.pGraph.p_width(penW*0.2*1000);
    MathControl.pGraph.b_color1(255,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(tX*100, tY*100);
    MathControl.pGraph._l((tX+1)*100, tY*100);
    MathControl.pGraph.ds();


    /*MathControl.pGraph.p_width(1000);
    MathControl.pGraph.b_color1(255,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x1*100, y1*100);
    MathControl.pGraph._l(x2*100, y2*100);
    MathControl.pGraph.ds();


    MathControl.pGraph.p_width(1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x2*100, y2*100);
    MathControl.pGraph._l(x3*100, y3*100);
    MathControl.pGraph.ds();*/

    /*MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x3*100, y3*100);
    MathControl.pGraph._l(x4*100, y4*100);
    MathControl.pGraph._l(x5*100,y5*100);
    MathControl.pGraph.ds();*/

    this.elements[0][0].draw();

}
CRadical.prototype.draw = function()
{
    this.elements[0][0].draw();

    var x = this.pos.x,
        y = this.pos.y;

    /*var penW = this.params.type.font.FontSize/12.5;
    penW = parseInt(penW + 0.5);
    penW = 72 / 25.4;

    if(penW == 0)
        penW = 1;*/

    //var penW = 96/25.4;
    //var penW = 1; //px

    var penW = this.params.font.FontSize*g_dKoef_pt_to_mm*0.042;
    //penW *= 96/25.4;

    var minHeight = this.params.font.metrics.Height,
        maxHeight = 4*this.params.font.metrics.Height + this.params.font.metrics.Placeholder.Height;

    var minHgtTick = this.params.font.metrics.Placeholder.Height*2/3,
        maxHgtTick = this.params.font.metrics.Height;

    var maxWidth = 1.6*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    if ( this.size.height > maxHeight )
        heightTick = maxHgtTick;
    else
    {
        var alpha = (this.size.height - minHeight)/maxHeight;
        heightTick = minHgtTick*(1 + alpha);
    }

    var coeff = 0.2*maxWidth/(maxHeight - minHeight),
        b = maxWidth*0.3 - coeff*minHeight;

    var tX = 1.7*penW * 0.5 * 25.4/96,
        tY = (-1)*tX * 11/25 *0.5; // 11/25 - тангенс угла наклона

    var x1 = x,
        x2 = x + 0.25*maxWidth;

    var y2 = y + this.size.height - heightTick,
        y1 = y2 + 0.11*maxWidth;

    var x3 = x2 - tX,
        y3 = y2 - tY;

    if(this.size.height < maxHeight)
        x4 = x3 + coeff*this.size.height + b;
    else
        x4 = x3 + coeff*maxHeight + b;

    var y4 = y + this.size.height;

    var x5 = x + maxWidth,
        x6 = x + this.size.width;

    var y5 = y,
        y6 = y;

    MathControl.pGraph.p_width(penW*0.8*1000);

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);

    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph.ds();


    MathControl.pGraph.p_width(1.7*penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x3, y3);
    MathControl.pGraph._l(x4, y4);
    MathControl.pGraph.ds();

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x4, y4);
    MathControl.pGraph._l(x5, y5);
    MathControl.pGraph._l(x6,y6);
    MathControl.pGraph.ds();

}