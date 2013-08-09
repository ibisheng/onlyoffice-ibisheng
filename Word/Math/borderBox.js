function CBorderBox()
{
    this.gapBrd = 0;

    this.bLeft = true;
    this.bRight = true;
    this.bTop = true;
    this.bDown = true;

    this.bLDiag = false;
    this.bRDiag = false;

//    this.bLeft = false;
//    this.bRight = false;
//    this.bDown = false;
//    this.bTop = false;

    /*this.bLDiag = true;
    this.bRDiag = true;*/

    CMathBase.call(this);
}
extend(CBorderBox, CMathBase);
CBorderBox.prototype.init = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CBorderBox.prototype.recalculateSize = function()
{
    var ss = this.elements[0][0].size;

    var width = ss.width;
    var height = ss.height;
    var center = ss.center;

    this.gapBrd = this.getTxtPrp().FontSize*0.08104587131076388;

    if(this.bTop)
    {
        height += this.gapBrd;
        center += this.gapBrd;
    }
    if(this.bDown)
        height += this.gapBrd;

    if(this.bLeft)
        width += this.gapBrd;
    if(this.bRight)
        width += this.gapBrd;

    this.size = {width : width, height: height, center: center};
}
CBorderBox.prototype.draw = function()
{
    this.elements[0][0].draw();

    var penW = this.getTxtPrp().FontSize* 25.4/96 * 0.08 ;

    if(this.bTop)
    {

        var x1 = this.pos.x,
         x2 = this.pos.x + this.size.width - 25.4/96,
         y1 = y2 = this.pos.y;

         MathControl.pGraph.p_color(0,0,0, 255);
         MathControl.pGraph.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.bDown)
    {
        var x1 = this.pos.x,
            x2 = this.pos.x + this.size.width - 25.4/96,
            y1 = y2 = this.pos.y + this.size.height - penW;

            MathControl.pGraph.p_color(0,0,0, 255);
            MathControl.pGraph.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.bLeft)
    {
        var x1 = this.pos.x ,
            y1 = this.pos.y,
            y2 = this.pos.y + this.size.height - 25.4/96;

        MathControl.pGraph.p_color(0,0,0, 255);
        MathControl.pGraph.drawVerLine(0, x1, y1, y2, penW);
    }

    if(this.bRight)
    {
        var x1 = this.pos.x + this.size.width - penW ,
            y1 = this.pos.y,
            y2 = this.pos.y + this.size.height - 25.4/96 ;

        MathControl.pGraph.p_color(0,0,0, 255);
        MathControl.pGraph.drawVerLine(0, x1, y1, y2, penW);
    }

    if(this.bLDiag)
    {
        var pW = penW*0.8;
        var x1 = this.pos.x , y1 = this.pos.y,
            x2 = x1 + pW, y2 = y1,
            x3 = x1 + this.size.width - 25.4/96, y3 = y1 + this.size.height - pW - 25.4/96,
            x4 = x3, y4 = y3 + pW,
            x5 = x4 - pW, y5 = y4,
            x6 = x1, y6 = y1 + pW,
            x7 = x1, y7 = y1;

        MathControl.pGraph.p_width(1000);
        MathControl.pGraph.b_color1(0,0,0, 255);

        MathControl.pGraph._s();
        MathControl.pGraph._m(x1, y1);
        MathControl.pGraph._l(x2, y2);
        MathControl.pGraph._l(x3, y3);
        MathControl.pGraph._l(x4, y4);
        MathControl.pGraph._l(x5, y5);
        MathControl.pGraph._l(x6, y6);
        MathControl.pGraph._l(x7, y7);
        MathControl.pGraph.df();

    }
    if(this.bRDiag)
    {
        var pW = penW*0.8;
        var x1 = this.pos.x + this.size.width - pW - 25.4/96, y1 = this.pos.y,
            x2 = x1 + pW, y2 = y1,
            x3 = x2, y3 = y2 + pW,
            x4 = this.pos.x + pW, y4 = this.pos.y + this.size.height - 25.4/96,
            x5 = x4 - pW, y5 = y4,
            x6 = x5, y6 = y5 - pW,
            x7 = x1, y7 = y1;

        MathControl.pGraph.p_width(1000);
        MathControl.pGraph.b_color1(0,0,0, 255);

        MathControl.pGraph._s();
        MathControl.pGraph._m(x1, y1);
        MathControl.pGraph._l(x2, y2);
        MathControl.pGraph._l(x3, y3);
        MathControl.pGraph._l(x4, y4);
        MathControl.pGraph._l(x5, y5);
        MathControl.pGraph._l(x6, y6);
        MathControl.pGraph._l(x7, y7);
        MathControl.pGraph.df();

    }

}
CBorderBox.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    var x = this.pos.x, y = this.pos.y;

    if(this.bLeft)
        x += this.gapBrd;
    if(this.bTop)
        y += this.gapBrd;

    this.elements[0][0].setPosition({x : x, y: y});
}
CBorderBox.prototype.findDisposition = function(mCoord)
{
    var X = null,
        Y = null,
        inside_flag = -1; // остаемя в пределах данного элемента( за границы элемента не вышли )

    var shX = 0, shY = 0;

    if(this.bLeft)
        shX = this.gapBrd;
    if(this.bTop)
        shY = this.gapBrd;

    var sCont = this.elements[0][0].size;

    if(mCoord.x < shX)
    {
        X = 0;
        inside_flag = 0;
    }
    else if(mCoord.x > shX + sCont.width)
    {
        X = sCont.width;
        inside_flag = 1;
    }
    else
    {
        X = mCoord.x - shX;
    }

    if(mCoord.y < shY)
    {
        Y = 0;
        inside_flag = 2;
    }
    else if(mCoord.y > shY + sCont.height)
    {
        Y = sCont.height;
        inside_flag = 2;
    }
    else
    {
        Y = mCoord.y - shY;
    }

    var coord = {x: X, y: Y},
        posCurs = {x: 0, y: 0};


    return {pos: posCurs, mCoord: coord, inside_flag: inside_flag};

}
CBorderBox.prototype.getElement = function()
{
    return this.elements[0][0];
}