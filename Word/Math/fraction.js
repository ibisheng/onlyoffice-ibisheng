function CBarFraction()
{
    this.bHide = false;
    CMathBase.call(this);
}
extend(CBarFraction, CMathBase);
CBarFraction.prototype.init = function()
{
    var num = new CNumerator();
    num.init();

    var den = new CDenominator();
    den.init();

    this.setDimension(2, 1);
    this.addMCToContent(num, den);
}
CBarFraction.prototype.getCenter =  function()
{
    var penW = this.getTxtPrp_2().FontSize* 25.4/96 * 0.08 /2;
    return this.elements[0][0].size.height + penW;
}
CBarFraction.prototype.draw = function()
{
    var penW = this.getTxtPrp_2().FontSize* this.reduct* 25.4/96 * 0.08;

    var x1 = this.pos.x,
        x2 = this.pos.x + this.size.width,
        y1 = y2 = this.pos.y + this.size.center - penW/2;

    if( ! this.bHide)
    {
        MathControl.pGraph.p_color(0,0,0, 255);
        MathControl.pGraph.b_color1(0,0,0, 255);
        MathControl.pGraph.drawHorLine(0, y1, x1, x2, penW);
    }


    CBarFraction.superclass.draw.call(this);
}
CBarFraction.prototype.getNumerator = function()
{
    return this.elements[0][0].getElement();
}
CBarFraction.prototype.getDenominator = function()
{
    return this.elements[1][0].getElement();
}
CBarFraction.prototype.hideBar = function(flag)
{
    this.bHide = flag;
}
CBarFraction.prototype.setSimple = function(flag)
{
    if(flag)
        this.setReduct(DEGR_REDUCT);
    else
        this.setReduct(1);
}
//////////

function CNumerator()
{
    CMathBase.call(this);
}
extend(CNumerator, CMathBase);
CNumerator.prototype.init = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CNumerator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var txtPrp = this.getTxtPrp_2();

    var Descent = arg.height - arg.ascent; // baseLine
    var gap = 7.832769097222222 * txtPrp.FontSize/36,
        minGap = txtPrp.FontSize* 25.4/96 * 0.16;

    var delta = 0.65*gap - Descent;

    var GapNum = delta > minGap ? delta - 0.95*minGap: minGap;

    var width = arg.width;
    var height = arg.height + GapNum;
    var center = arg.center;

    this.size = {width : width, height: height, center: center};
}
CNumerator.prototype.new_recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;
    var penW = this.params.font.FontSize* 25.4/96 * 0.08;

    var Descent = arg.height - arg.center - metrics.Placeholder.Height*DIV_CENTER; // baseLine
    //var gap = metrics.Height - metrics.Placeholder.Height + metrics.Descender,
    var gap = metrics.Descender + 2*penW *1.8,
        minGap = 2*penW;

    var delta = gap - Descent;

    var GapNum = delta > minGap ? delta : minGap;

    var width = arg.width;
    var height = arg.height + GapNum;
    var center = arg.center;

    this.size = {width : width, height: height, center: center};
}
CNumerator.prototype.n_recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;
    //var penW = this.params.font.FontSize* 25.4/96 * 0.08;


    var DescentFirst = arg.height - arg.center - metrics.Placeholder.Height*DIV_CENTER; // baseLine

    //var gap = metrics.Height -  2.8*metrics.Descender;  // 8 pt
    //var gap = metrics.Height -  1.5*metrics.Descender;

    var gap = metrics.Height - (2.96 - 0.02*this.params.font.FontSize)*metrics.Descender;

    var penW = this.params.font.FontSize/47;

    // 20    7
    // 60   21

    var gapNum = DescentFirst - 2*penW < 0.55*gap ? 0.55*gap - DescentFirst : 2*penW;

    var width = arg.width;
    var height = arg.height + gapNum;
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
CNumerator.prototype.getElement = function(txt)
{
    return this.elements[0][0];
}
CNumerator.prototype.getTxtPrp = function()
{
    return this.Parent.getTxtPrp();
}

function CDenominator()
{
    CMathBase.call(this);
}
extend(CDenominator, CMathBase);
CDenominator.prototype.init = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CDenominator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var txtPrp = this.getTxtPrp_2();

    var gap = 7.832769097222222 * txtPrp.FontSize/36,
        Ascent = arg.ascent,
        minGap = txtPrp.FontSize* 25.4/96 * 0.24;

    var delta = 0.47*gap - Ascent;
    var GapDen = delta > minGap ? delta : minGap;

    var width = arg.width;
    var height = arg.height + GapDen;
    var center = arg.center + GapDen;

    this.size = {width : width, height: height, center: center};
}
CDenominator.prototype.new_recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;

    var gap = metrics.Height - metrics.Placeholder.Height - metrics.Descender,
        Ascent = arg.center + metrics.Placeholder.Height*DIV_CENTER - metrics.Placeholder.Height,
        minGap = this.params.font.FontSize* 25.4/96 * 0.24 * 1.23;

    var delta = gap - Ascent;
    var GapDen = delta > minGap ? delta : minGap;

    var width  = arg.width;
    var height = arg.height + GapDen;
    var center = arg.center + GapDen;

    this.size = {width : width, height: height, center: center};
}
CDenominator.prototype.n_recalculateSize = function()
{
    var arg = this.elements[0][0].size;
    var metrics = this.params.font.metrics;

    var AscentSecond = arg.center + metrics.Placeholder.Height*DIV_CENTER;

    //var gap = metrics.Height - 2.8*metrics.Descender; // 8 pt
    //var gap = metrics.Height - 1.5*metrics.Descender; // 72 pt

    var gap = metrics.Height - (2.96 - 0.02*this.params.font.FontSize)*metrics.Descender;

    // a*x + b = c
    // a*8 + b = 2.8
    // a*72 + b = 1.5
    // a = - 1.3/64
    // b = 2.96

    var penW = this.params.font.FontSize/47;

    var gapDen = AscentSecond - 3*penW < 0.45*gap ? 0.45*gap - AscentSecond : 3*penW;

    var width  = arg.width;
    var height = arg.height + gapDen;
    var center = arg.center + gapDen;

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
CDenominator.prototype.getElement = function(txt)
{
    return this.elements[0][0];
}
CDenominator.prototype.getTxtPrp = function()
{
    return this.Parent.getTxtPrp();
}


//////////

function CSkewedFraction()
{
    this.gapSlash = 0;
    CMathBase.call(this);
}
extend(CSkewedFraction, CMathBase);
CSkewedFraction.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();
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
    this.gapSlash = 5.011235894097222 * this.getTxtPrp().FontSize/36;
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
    var fontSize = this.getTxtPrp().FontSize;
    var penW = fontSize/12.5*g_dKoef_pix_to_mm;

    //to do
    //переделать
    var gap = this.gapSlash/2 - penW/7.5;
    var plh = 9.877777777777776 * fontSize / 36;

    var minHeight = 2*this.gapSlash,
        middleHeight = plh*4/3,
        maxHeight = (3*this.gapSlash + 5*plh)*2/3;


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

        var minVal = plh/2,
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
CSkewedFraction.prototype.getNumerator = function()
{
    return this.elements[0][0];
}
CSkewedFraction.prototype.getDenominator = function()
{
    return this.elements[0][1];
}

//////////

function CLinearFraction()
{
    CMathBase.call(this);
}
extend(CLinearFraction, CMathBase);
CLinearFraction.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();
}
CLinearFraction.prototype.recalculateSize = function()
{
    var H = this.elements[0][0].size.center + this.elements[0][1].size.height - this.elements[0][1].size.center;
    var txtPrp = this.getTxtPrp();

    var gap = 5.011235894097222*txtPrp.FontSize/36;

    var H3 = gap*4.942252165543792,
        H4 = gap*7.913378248315688,
        H5 = gap*9.884504331087584;

    if( H < H3 )
        this.dW = gap;
    else if( H < H4 )
        this.dW = 2*gap;
    else if( H < H5 )
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

    var penW = this.getTxtPrp().FontSize/12.5*g_dKoef_pix_to_mm;

    MathControl.pGraph.p_width(penW*1000);

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);

    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph.ds();

    CLinearFraction.superclass.draw.call(this);

}
CLinearFraction.prototype.getNumerator = function()
{
    return this.elements[0][0];
}
CLinearFraction.prototype.getDenominator = function()
{
    return this.elements[0][1];
}
