

function CBarFraction()
{
    CMathBase.call(this,2,1);
    //!!!
    //this.gapLine = 0; // толщину линии не учитываем, рисуем в области числителя
}
extend(CBarFraction, CMathBase);
CBarFraction.prototype.setContent = function()
{
    this.elements[0][0] = new CNumerator();
    this.elements[0][0].init(this.params);
    this.elements[0][0].relate(this);
    this.elements[0][0].fillPlaceholders();

    this.elements[1][0] = new CDenominator();
    this.elements[1][0].init(this.params);
    this.elements[1][0].relate(this);
    this.elements[1][0].fillPlaceholders();


    this.recalculateSize();
}
CBarFraction.prototype.getCenter =  function()
{
    var penW = this.params.font.FontSize* 25.4/96 * 0.08 /2;
    return this.elements[0][0].size.height + penW;
}
CBarFraction.prototype.draw = function()
{
    var penW = this.params.font.FontSize* 25.4/96 * 0.08;

    var x1 = this.pos.x,
        x2 = this.pos.x + this.size.width,
        y1 = y2 = this.pos.y + this.size.center - penW/2;

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.drawHorLine(0, y1, x1, x2, penW);

    CBarFraction.superclass.draw.call(this);
}

//////////

function CNumerator()
{
    CMathBase.call(this, 1, 1);
}
extend(CNumerator, CMathBase);
CNumerator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;

    var Descent = arg.height - arg.center - metrics.Placeholder.Height/ 2; // baseLine
    var gap = metrics.Height - metrics.Placeholder.Height + metrics.Descender,
        minGap = this.params.font.FontSize* 25.4/96 * 0.16;

    var delta = 0.65*gap - Descent;

    var GapNum = delta > minGap ? delta - 0.95*minGap: minGap;

    var width = arg.width;
    var height = arg.height + GapNum;
    var center = arg.center;

    this.size = {width : width, height: height, center: center};
}
CNumerator.prototype.findDisposition = function(mCoord)
{
    var arg = this.elements[0][0].size;

    if(mCoord.y > arg.height)
        mCoord.y = arg.height;

    var result = CNumerator.superclass.findDisposition.call(this, mCoord);

    return result;
}
CNumerator.prototype.setPosition = function(pos)
{
    var x = pos.x;
    var y = pos.y ;

    this.elements[0][0].setPosition({x: x, y: y});
}

function CDenominator()
{
    this.coeffGap = 1;
    CMathBase.call(this, 1, 1);
}
extend(CDenominator, CMathBase);
CDenominator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;

    var gap = metrics.Height - metrics.Placeholder.Height + metrics.Descender,
        Ascent = arg.center - metrics.Placeholder.Height/2,
        minGap = this.params.font.FontSize* 25.4/96 * 0.24;


    var delta = 0.47*gap - Ascent;
    var GapDen = delta > minGap ? delta : minGap;

    var width = arg.width;
    var height = arg.height + GapDen;
    var center = arg.center + GapDen;

    this.size = {width : width, height: height, center: center};
}
CDenominator.prototype.findDisposition = function(mCoord)
{
    var arg = this.elements[0][0].size;
    var gap = this.size.height - arg.height;

    if(mCoord.y < gap)
        mCoord.y = 0;
    else
        mCoord.y -= gap;

    var result = CNumerator.superclass.findDisposition.call(this, mCoord);

    return result;
}
CDenominator.prototype.setPosition = function(pos)
{
    var x = pos.x;
    var y = pos.y + this.size.height - this.elements[0][0].size.height;

    this.elements[0][0].setPosition({x: x, y: y});
}
CDenominator.prototype.setGapCoeff = function(coeff)
{
    if(coeff >= 0 && coeff <= 1)
    {
        this.coeffGap = coeff;
        this.recalculateSize();
    }
}


//////////

function CSkewedFraction()
{
    this.gapSlash = 0;
    CMathBase.call(this,1,2);
}
extend(CSkewedFraction, CMathBase);
CSkewedFraction.prototype.setContent = function()
{
    CSkewedFraction.superclass.fillPlaceholders.call(this);
}
CSkewedFraction.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};
    this.elements[0][0].setPosition(this.pos);

    var x = this.pos.x + this.elements[0][0].size.width + this.gapSlash,
        y = this.pos.y +  this.size.center;

    this.elements[0][1].setPosition({x: x, y: y});

   /* var WidthSlash = this.size.width - this.elements[0][0].size.width - this.elements[0][2].size.width; //т.к. расстояние между элементами не равно ширине слеша
    var shiftWidth = (WidthSlash < this.elements[0][1].size.width) ? (this.elements[0][1].size.width - WidthSlash)/2 : 0;

    var ratio =   this.elements[0][0].size.height / this.size.height;
    var shiftHeight = (this.size.height - this.elements[0][1].size.height)*ratio;

    this.elements[0][1].setPosition({x: this.pos.x + this.elements[0][0].size.width - shiftWidth, y: this.pos.y + shiftHeight });
    this.elements[0][2].setPosition({x: this.pos.x + this.elements[0][0].size.width + WidthSlash, y: this.pos.y +  this.size.center});*/
};
CSkewedFraction.prototype.recalculateSize = function()
{
    this.gapSlash = this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height;
    var _width = this.elements[0][0].size.width + this.gapSlash + this.elements[0][1].size.width;
    var _height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var _center = this.getCenter();

    this.size =  {width: _width, height: _height, center: _center};
};
CSkewedFraction.prototype.getCenter = function()
{
    return this.elements[0][0].size.height;
};
CSkewedFraction.prototype.findDisposition = function( mCoord )
{
    var mouseCoord = {x: mCoord.x, y: mCoord.y},
        posCurs =    {x: null, y: null},
        inside_flag = -1;

    posCurs.x = 0;

    if( mCoord.x < (this.elements[0][0].size.width + this.gapSlash/2))
    {
        var sizeFirst = this.elements[0][0].size;
        if(sizeFirst.width < mCoord.x)
        {
            mouseCoord.x = sizeFirst.width;
            inside_flag = 1;
        }
        if(sizeFirst.height < mCoord.y)
        {
            mouseCoord.y = sizeFirst.height;
            inside_flag = 2;
        }

        posCurs.y = 0;
    }
    else
    {
        var sizeSec = this.elements[0][1].size;
        if(mCoord.x < this.size.width - sizeSec.width)
        {
            mouseCoord.x = 0;
            inside_flag = 0;
        }
        else if( mCoord.x > this.size.width)
        {
            mouseCoord.x = sizeSec.width;
            inside_flag = 1;
        }
        else
            mouseCoord.x = mCoord.x - this.elements[0][0].size.width - this.gapSlash;

        if( mCoord.y < this.size.height - this.elements[0][1].size.height)
        {
            mouseCoord.y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > this.size.height)
        {
            mouseCoord.y = sizeSec.height;
            inside_flag = 2;
        }
        else
            mouseCoord.y = mCoord.y - this.elements[0][0].size.height;

        posCurs.y = 1;
    }

    return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};

};
CSkewedFraction.prototype.draw = function()
{
    CSkewedFraction.superclass.draw.call(this);
    var penW = this.params.font.FontSize/12.5*g_dKoef_pix_to_mm;

    //to do
    //переделать
    var gap = this.gapSlash/2 - penW/7.5;

    var minHeight = 2*this.gapSlash,
        middleHeight = this.params.font.metrics.Placeholder.Height*4/3,
        maxHeight = (3*this.gapSlash + 5*this.params.font.metrics.Placeholder.Height)*2/3;


    var tg1 = -2.22,
        tg2 = -3.7;

    var heightSlash = this.size.height*2/3;

    if(heightSlash < maxHeight)
    {
        if(heightSlash < minHeight)
        {
            heightSlash = minHeight;
            tg = tg1;
        }
        else
        {
            heightSlash = this.size.height*2/3;
            tg = (heightSlash - maxHeight)*(tg1 - tg2)/(middleHeight - maxHeight) + tg2;
        }

        var b = this.elements[0][0].size.height - tg*(this.elements[0][0].size.width + gap);

        var y1 =  this.elements[0][0].size.height/3,
            y2 =  this.elements[0][0].size.height/3 + heightSlash;

        var x1 =  (y1 - b)/tg,
            x2 =  (y2 - b)/tg;

        var xx1 = this.pos.x + x1,
            xx2 = this.pos.x + x2;

        var yy1 = this.pos.y  + y1,
            yy2 = this.pos.y  + y2;

    }
    else
    {
        heightSlash = maxHeight;
        tg = tg2;
        coeff = this.elements[0][0].size.height/this.size.height;
        shift = heightSlash*coeff;

        var minVal = this.params.font.metrics.Placeholder.Height/2,
            maxVal = heightSlash - minVal;

        if(shift < minVal)
            shift = minVal;
        else if(shift > maxVal)
            shift = maxVal;

        var y0 = this.elements[0][0].size.height - shift;
        var b = this.elements[0][0].size.height - tg*(this.elements[0][0].size.width + gap);

        var y1 = y0,
            y2 = y0 + heightSlash;

        var x1 = (y1 - b)/tg,
            x2 = (y2 - b)/tg;

        var xx1 = this.pos.x + x1,
            xx2 = this.pos.x + x2;

        var yy1 = this.pos.y + y1 ,
            yy2 = this.pos.y + y2;

    }

    MathControl.pGraph.p_width(penW*1000);

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(xx1, yy1);
    MathControl.pGraph._l(xx2, yy2);
    MathControl.pGraph.ds();
}

//////////

function CLinearFraction()
{
    CMathBase.call(this,1,2);
}
extend(CLinearFraction, CMathBase);
CLinearFraction.prototype.setContent = function()
{
    CLinearFraction.superclass.fillPlaceholders.call(this);
}
CLinearFraction.prototype.recalculateSize = function()
{
    var H = this.elements[0][0].size.center + this.elements[0][1].size.height - this.elements[0][1].size.center;
    var state = getStateHeight_2(H, this.params.font),
        gap = this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height;

    if(state == 0 || state == 1)
        this.dW = gap;
    else if(state == 2)
        this.dW = 2*gap;
    else if(state == 3)
        this.dW = 2.8*gap;
    else
        this.dW = 3.4*gap;

    var h1 = this.elements[0][0].size.height,
        h2 = this.elements[0][1].size.height;

    var c1 = this.elements[0][0].size.center,
        c2 = this.elements[0][1].size.center;

    var asc = c1 > c2 ? c1 : c2;
    var desc = h1 - c1 > h2 - c2 ? h1- c1 : h2 - c2;

    var height = asc + desc;

    var width = this.elements[0][0].size.width + this.dW + this.elements[0][1].size.width;
    var center = this.getCenter();

    this.size = {height: height, width: width, center: center};
}
CLinearFraction.prototype.draw = function()
{
    var gap = this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height;
    var minHeight = 2*gap,
        maxHeight = (3*gap + 5*this.params.font.metrics.Placeholder.Height)*2/3;

    var first = this.elements[0][0].size,
        sec = this.elements[0][1].size;

    var cent = first.center > sec.center ? first.center : sec.center,
        desc1 = first.height - first.center, desc2 = sec.height - sec.center,
        desc =  desc1 > desc2 ? desc1 : desc2;

    var shift = 0.1*this.dW;

    var x1 = this.pos.x + this.elements[0][0].size.width + this.dW - shift,
        y1 = this.pos.y + this.size.center - cent,
        x2 = this.pos.x + this.elements[0][0].size.width + shift,
        y2 = this.pos.y + this.size.center + desc;

    var penW = this.params.font.FontSize/12.5*g_dKoef_pix_to_mm;

    MathControl.pGraph.p_width(penW*1000);

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);

    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph.ds();

    CLinearFraction.superclass.draw.call(this);

}

/////////

function CSimpleFraction()
{
    CBarFraction.call(this);
}
extend(CSimpleFraction, CBarFraction);
CSimpleFraction.prototype.init = function(params)
{
    this.params = Common_CopyObj(params);
    this.params.font = getTypeDegree(params.font);
}
CSimpleFraction.prototype.setContent = function()
{
    CSimpleFraction.superclass.setContent.call(this);
}
