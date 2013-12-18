function CFraction()
{
    this.kind = MATH_FRACTION;

    this.type = BAR_FRACTION;
    this.bHideBar = false;
    CMathBase.call(this);
}
extend(CFraction, CMathBase);
CFraction.prototype.init = function(props)
{
    var bValid = typeof(props.type) !== "undefined" && props.type !== null;

    if(bValid)
    {
        var bBar = props.type === BAR_FRACTION || props.type === NO_BAR_FRACTION,
            bSkew = props.type === SKEWED_FRACTION,
            bLin = props.type === LINEAR_FRACTION;

        if(bBar || bSkew || bLin) // на всякий случай
            this.type = props.type;
    }

    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
    {
        var num = new CNumerator();
        num.init();

        var den = new CDenominator();
        den.init();

        this.setDimension(2, 1);

        if(this.type == NO_BAR_FRACTION)
            this.bHideBar = true;

        this.addMCToContent(num, den);
    }
    else if(this.type == SKEWED_FRACTION)
    {
        this.setDimension(1, 2);
        this.setContent();
    }
    else if(this.type == LINEAR_FRACTION)
    {
        this.setDimension(1, 2);
        this.setContent();
    }
}
CFraction.prototype.getType = function()
{
    return this.type;
}
CFraction.prototype.getCenter = function()
{
    var center;

    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
    {
        var penW = this.getCtrPrp().FontSize* 25.4/96 * 0.08 /2;
        center = this.elements[0][0].size.height + penW;
    }
    else if(this.type == SKEWED_FRACTION)
    {
        center = this.elements[0][0].size.height;
    }
    else if(this.type == LINEAR_FRACTION)
    {
        center = CFraction.superclass.getCenter.call(this);
    }

    return center;
}
CFraction.prototype.draw = function(pGraphics)
{
    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
        this.drawBarFraction(pGraphics);
    else if(this.type == SKEWED_FRACTION)
        this.drawSkewedFraction(pGraphics);
    else if(this.type == LINEAR_FRACTION)
        this.drawLinearFraction(pGraphics);
}
CFraction.prototype.drawBarFraction = function(pGraphics)
{
    var ctrPrp = this.getCtrPrp();
    var penW = ctrPrp.FontSize* this.reduct* 25.4/96 * 0.08;

    var x1 = this.pos.x,
        x2 = this.pos.x + this.size.width,
        y1 = y2 = this.pos.y + this.size.center - penW/2;

    if( !this.bHideBar )
    {
        pGraphics.SetFont(ctrPrp);

        pGraphics.p_color(0,0,0, 255);
        pGraphics.b_color1(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    CFraction.superclass.draw.call(this, pGraphics);
}
CFraction.prototype.drawSkewedFraction = function(pGraphics)
{
    var ctrPrp = this.getCtrPrp();

    var penW = ctrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    var gap = this.gapSlash/2 - penW/7.5;
    var plh = 9.877777777777776 * ctrPrp.FontSize / 36;

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
        var coeff = this.elements[0][0].size.height/this.size.height;
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

    pGraphics.SetFont(ctrPrp);

    pGraphics.p_width(penW*1000);

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);
    pGraphics._s();
    pGraphics._m(xx1, yy1);
    pGraphics._l(xx2, yy2);
    pGraphics.ds();

    CFraction.superclass.draw.call(this, pGraphics);
}
CFraction.prototype.drawLinearFraction = function(pGraphics)
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

    var ctrPrp = this.getCtrPrp();
    var penW = ctrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    pGraphics.SetFont(ctrPrp);
    pGraphics.p_width(penW*1000);

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();

    CFraction.superclass.draw.call(this, pGraphics);
}
CFraction.prototype.getNumerator = function()
{
    var numerator;

    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
        numerator = this.elements[0][0].getElement();
    else
        numerator = this.elements[0][0];

    return numerator;
}
CFraction.prototype.getDenominator = function()
{
    var denominator;

    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
        denominator = this.elements[1][0].getElement();
    else
        denominator = this.elements[0][1];

    return denominator;
}
CFraction.prototype.recalculateSize = function()
{
    if(this.type == BAR_FRACTION || this.type == NO_BAR_FRACTION)
        CFraction.superclass.recalculateSize.call(this);
    else if(this.type == SKEWED_FRACTION)
        this.recalculateSkewed();
    else if(this.type == LINEAR_FRACTION)
        this.recalculateLinear();
}
CFraction.prototype.recalculateSkewed = function()
{
    var ctrPrp = this.getCtrPrp();
    this.gapSlash = 5.011235894097222 * ctrPrp.FontSize/36;
    var _width = this.elements[0][0].size.width + this.gapSlash + this.elements[0][1].size.width;
    var _height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var _center = this.getCenter();

    this.size =  {width: _width, height: _height, center: _center};
}
CFraction.prototype.recalculateLinear = function()
{
    var H = this.elements[0][0].size.center + this.elements[0][1].size.height - this.elements[0][1].size.center;
    //var txtPrp = this.getTxtPrp();
    var ctrPrp = this.getCtrPrp();

    var gap = 5.011235894097222*ctrPrp.FontSize/36;

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
CFraction.prototype.setPosition = function(pos)
{
    if(this.type == SKEWED_FRACTION)
    {
        this.pos = {x: pos.x, y: pos.y - this.size.center};
        this.elements[0][0].setPosition(this.pos);

        var x = this.pos.x + this.elements[0][0].size.width + this.gapSlash,
            y = this.pos.y +  this.size.center;

        this.elements[0][1].setPosition({x: x, y: y});

    }
    else
        CFraction.superclass.setPosition.call(this, pos);
}
CFraction.prototype.findDisposition = function( mCoord )
{
    var disposition;

    if(this.type == SKEWED_FRACTION)
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

        disposition =  {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
    }
    else
        disposition = CFraction.superclass.findDisposition.call(this, mCoord);

    return disposition;
}
CFraction.prototype.getPropsForWrite = function()
{
	var type = null;
	if (this.type == BAR_FRACTION)
		type = 0;
	else if (this.type == LINEAR_FRACTION)
		type = 1;
	else if (this.type == NO_BAR_FRACTION)
		type = 2;
	else if (this.type == SKEWED_FRACTION)
		type = 3;

    var props = {
		type: type
	};
    return props;
}


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
    //var txtPrp = this.getTxtPrp();
    //txtPrp.FontSize *= this.Parent.reduct;

    var ctrPrp = this.getCtrPrp();

    var Descent = arg.height - arg.ascent; // baseLine
    var gap = 7.832769097222222 * ctrPrp.FontSize/36,
        minGap = ctrPrp.FontSize* 25.4/96 * 0.16;

    // var delta = 0.65*gap - Descent;
    var delta = 0.8076354679802956*gap - Descent;

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

    return CNumerator.superclass.findDisposition.call(this, mCoord);
}
CNumerator.prototype.setPosition = function(pos)
{
    var x = pos.x;
    var y = pos.y ;

    this.elements[0][0].setPosition({x: x, y: y});
}
CNumerator.prototype.getElement = function()
{
    return this.elements[0][0];
}
CNumerator.prototype.getReduct = function()
{
    return this.Parent.getReduct();
}
CNumerator.prototype.getCtrPrp = function()
{
    return this.Parent.getCtrPrp();
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
    /*var txtPrp = this.getTxtPrp();
    txtPrp.FontSize *= this.Parent.reduct;*/

    var ctrPrp = this.getCtrPrp();

    var gap = 7.832769097222222 * ctrPrp.FontSize/36,
        Ascent = arg.center -  4.938888888888888*ctrPrp.FontSize/36,
        minGap = ctrPrp.FontSize* 25.4/96 * 0.24;

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
    else if (mCoord.y > arg.height + gap)
        mCoord.y = arg.height;
    else
        mCoord.y -= gap;

    return CDenominator.superclass.findDisposition.call(this, mCoord);
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
CDenominator.prototype.getReduct = function()
{
    return this.Parent.getReduct();
}
CDenominator.prototype.getCtrPrp = function()
{
    return this.Parent.getCtrPrp();
}

//////////

function old_CBarFraction()
{
    this.bHide = false;
    this.bSimple = false;
    CMathBase.call(this);
}
extend(old_CBarFraction, CMathBase);
old_CBarFraction.prototype.init = function()
{
    var num = new CNumerator();
    num.init();

    var den = new CDenominator();
    den.init();

    this.setDimension(2, 1);
    this.addMCToContent(num, den);
}
old_CBarFraction.prototype.getCenter =  function()
{
    var penW = this.getTxtPrp().FontSize* 25.4/96 * 0.08 /2;
    return this.elements[0][0].size.height + penW;
}
old_CBarFraction.prototype.draw = function()
{
    var penW = this.getTxtPrp().FontSize* this.reduct* 25.4/96 * 0.08;

    var x1 = this.pos.x,
        x2 = this.pos.x + this.size.width,
        y1 = y2 = this.pos.y + this.size.center - penW/2;

    if(!this.bHide)
    {
        MathControl.pGraph.p_color(0,0,0, 255);
        MathControl.pGraph.b_color1(0,0,0, 255);
        MathControl.pGraph.drawHorLine(0, y1, x1, x2, penW);
    }

    old_CBarFraction.superclass.draw.call(this);
}
old_CBarFraction.prototype.getNumerator = function()
{
    return this.elements[0][0].getElement();
}
old_CBarFraction.prototype.getDenominator = function()
{
    return this.elements[1][0].getElement();
}
old_CBarFraction.prototype.hideBar = function(flag)
{
    this.bHide = flag;
}
old_CBarFraction.prototype.setSimple = function(flag)
{
    this.bSimple = flag;

    if(flag)
        this.setReduct(DEGR_REDUCT);
    else
        this.setReduct(1);

    this.Resize();
}

//////////

function old_CSkewedFraction()
{
    this.gapSlash = 0;
    CMathBase.call(this);
}
extend(old_CSkewedFraction, CMathBase);
old_CSkewedFraction.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();
}
old_CSkewedFraction.prototype.setPosition = function(pos)
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
}
old_CSkewedFraction.prototype.recalculateSize = function()
{
    this.gapSlash = 5.011235894097222 * this.getTxtPrp().FontSize/36;
    var _width = this.elements[0][0].size.width + this.gapSlash + this.elements[0][1].size.width;
    var _height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var _center = this.getCenter();

    this.size =  {width: _width, height: _height, center: _center};
}
old_CSkewedFraction.prototype.getCenter = function()
{
    return this.elements[0][0].size.height;
};
old_CSkewedFraction.prototype.findDisposition = function( mCoord )
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

}
old_CSkewedFraction.prototype.draw = function()
{
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

    old_CSkewedFraction.superclass.draw.call(this);
}
old_CSkewedFraction.prototype.getNumerator = function()
{
    return this.elements[0][0];
}
old_CSkewedFraction.prototype.getDenominator = function()
{
    return this.elements[0][1];
}

//////////

function old_CLinearFraction()
{
    CMathBase.call(this);
}
extend(old_CLinearFraction, CMathBase);
old_CLinearFraction.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();
}
old_CLinearFraction.prototype.recalculateSize = function()
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
old_CLinearFraction.prototype.draw = function()
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

    old_CLinearFraction.superclass.draw.call(this);
}
old_CLinearFraction.prototype.getNumerator = function()
{
    return this.elements[0][0];
}
old_CLinearFraction.prototype.getDenominator = function()
{
    return this.elements[0][1];
}
