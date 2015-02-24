"use strict";

function CMathFractionPr()
{
    this.type = BAR_FRACTION;
}
CMathFractionPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.type && null !== Obj.type)
        this.type = Obj.type;
};
CMathFractionPr.prototype.Copy = function(Obj)
{
    var NewPr = new CMathFractionPr();
    NewPr.type = this.type;
    return NewPr;
};
CMathFractionPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : type
    Writer.WriteLong(this.type);
};
CMathFractionPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : type
    this.type = Reader.GetLong();
};

function CFraction(props)
{
    CFraction.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Numerator   = null;
    this.Denominator = null;

    this.Pr = new CMathFractionPr();

    this.bHideBar =   false;

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CFraction, CMathBase);

CFraction.prototype.ClassType = historyitem_type_frac;
CFraction.prototype.kind      = MATH_FRACTION;

CFraction.prototype.init = function(props)
{
    this.Fill_LogicalContent(2);

    this.setProperties(props);
    this.fillContent();
}
CFraction.prototype.getType = function()
{
    return this.Pr.type;
}
CFraction.prototype.draw = function(x, y, pGraphics, PDSE)
{
    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        this.drawBarFraction(x, y, pGraphics, PDSE);
    else if(this.Pr.type == SKEWED_FRACTION)
        this.drawSkewedFraction(x, y, pGraphics, PDSE);
    else if(this.Pr.type == LINEAR_FRACTION)
        this.drawLinearFraction(x, y, pGraphics, PDSE);
}
CFraction.prototype.Draw_Elements = function(PDSE)
{
    var X = PDSE.X;

    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        this.drawBarFraction(PDSE);
    else if(this.Pr.type == SKEWED_FRACTION)
        this.drawSkewedFraction(PDSE);
    else if(this.Pr.type == LINEAR_FRACTION)
        this.drawLinearFraction(PDSE);

    PDSE.X = X + this.size.width;
}
CFraction.prototype.drawBarFraction = function(PDSE)
{
    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var penW = mgCtrPrp.FontSize* 25.4/96 * 0.08;

    var numHeight = this.elements[0][0].size.height;

    var width = this.size.width - this.GapLeft - this.GapRight;

    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line);

    var x1 = this.pos.x + PosLine.x + this.GapLeft,
        x2 = this.pos.x + PosLine.x + this.GapLeft + width,
        y1 = this.pos.y + PosLine.y + numHeight- penW;

    if( !this.bHideBar )
    {
        PDSE.Graphics.SetFont(mgCtrPrp);

        this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
        PDSE.Graphics.drawHorLine(0, y1, x1, x2, penW);
    }

    CFraction.superclass.Draw_Elements.call(this, PDSE);
}
CFraction.prototype.drawSkewedFraction = function(PDSE)
{
    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var penW = mgCtrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    var gap = this.dW/2 - penW/7.5;
    var plh = 9.877777777777776 * mgCtrPrp.FontSize / 36;

    var minHeight = 2*this.dW,
        middleHeight = plh*4/3,
        maxHeight = (3*this.dW + 5*plh)*2/3;

	var tg;
    var tg1 = -2.22,
        tg2 = -3.7;

    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line);

    var X = this.pos.x + PosLine.x + this.GapLeft,
        Y = this.pos.y + PosLine.y;

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

        var xx1 = X + x1,
            xx2 = X + x2;

        var yy1 = Y + y1,
            yy2 = Y + y2;

    }
    else
    {
        heightSlash = maxHeight;
        tg = tg2;
        var coeff = this.elements[0][0].size.height/this.size.height;
        var shift = heightSlash*coeff;

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

        var xx1 = X + x1,
            xx2 = X + x2;

        var yy1 = Y + y1,
            yy2 = Y + y2;

    }

    PDSE.Graphics.SetFont(mgCtrPrp);

    PDSE.Graphics.p_width(penW*1000);

    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
    PDSE.Graphics._s();
    PDSE.Graphics._m(xx1, yy1);
    PDSE.Graphics._l(xx2, yy2);
    PDSE.Graphics.ds();

    CFraction.superclass.Draw_Elements.call(this, PDSE);
}
CFraction.prototype.drawLinearFraction = function(PDSE)
{
    var shift = 0.1*this.dW;

    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line);

    var X = this.pos.x + PosLine.x + this.GapLeft,
        Y = this.pos.y + PosLine.y;

    var x1 = X + this.elements[0][0].size.width + this.dW - shift,
        y1 = Y,
        x2 = X + this.elements[0][0].size.width + shift,
        y2 = Y + this.size.height;

    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var penW = mgCtrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    PDSE.Graphics.SetFont(mgCtrPrp);
    PDSE.Graphics.p_width(penW*1000);

    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());

    PDSE.Graphics._s();
    PDSE.Graphics._m(x1, y1);
    PDSE.Graphics._l(x2, y2);
    PDSE.Graphics.ds();

    CFraction.superclass.Draw_Elements.call(this, PDSE);
}
CFraction.prototype.getNumerator = function()
{
    var numerator;

    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        numerator = this.elements[0][0].getElement();
    else
        numerator = this.elements[0][0];

    return numerator;
}
CFraction.prototype.getDenominator = function()
{
    var denominator;

    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        denominator = this.elements[1][0].getElement();
    else
        denominator = this.elements[0][1];

    return denominator;
}
CFraction.prototype.getNumeratorMathContent = function()
{
    return this.Content[0];
};
CFraction.prototype.getDenominatorMathContent = function()
{
    return this.Content[1];
};
CFraction.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent   = Parent;
    this.ParaMath = ParaMath;

    var ArgSzNumDen = ArgSize.Copy();

    if(RPI.bInline == true && (this.Pr.type === BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)) // уменьшае размер числителя и знаменателя
    {
        ArgSzNumDen.decrease();        // для контентов числителя и знаменателя
        this.ArgSize.SetValue(-1);     // для CtrPrp
    }
    else if(RPI.bDecreasedComp == true)    // уменьшаем  расстояние между числителем и знаменателем (размер FontSize для TxtPr ControlLetter)
                                            // this.ArgSize отвечает за TxtPr ControlLetter
    {
        this.ArgSize.SetValue(-1); // для CtrPrp
    }
    else
    {
        this.ArgSize.SetValue(0);
    }

    this.RecalcInfo.bCtrPrp = true;

    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);

    this.ApplyProperties(RPI);

    var NewRPI = RPI.Copy();
    if(this.Pr.type !== LINEAR_FRACTION)
        NewRPI.bDecreasedComp = true;

    // setGaps обязательно после того как смержили CtrPrp (Set_CompiledCtrPrp)

    if(this.bInside == false)
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);

    this.Numerator.PreRecalc(this, ParaMath, ArgSzNumDen, NewRPI);
    this.Denominator.PreRecalc(this, ParaMath, ArgSzNumDen, NewRPI);
}
CFraction.prototype.recalculateSize = function(oMeasure)
{
    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        this.recalculateBarFraction(oMeasure);
    else if(this.Pr.type == SKEWED_FRACTION)
        this.recalculateSkewed(oMeasure);
    else if(this.Pr.type == LINEAR_FRACTION)
        this.recalculateLinear(oMeasure);
}
CFraction.prototype.recalculateBarFraction = function(oMeasure)
{
    var num = this.elements[0][0].size,
        den = this.elements[1][0].size;

    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var width  = num.width > den.width ? num.width : den.width;
    var height = num.height + den.height;
    var ascent = num.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    width += this.GapLeft + this.GapRight;

    this.size =  {width: width, height: height, ascent: ascent};
}
CFraction.prototype.recalculateSkewed = function(oMeasure)
{
    var mgCtrPrp = this.Get_TxtPrControlLetter();

    //this.gapSlash = 5.011235894097222 * mgCtrPrp.FontSize/36;
    this.dW = 5.011235894097222 * mgCtrPrp.FontSize/36;
    var width = this.elements[0][0].size.width + this.dW + this.elements[0][1].size.width;
    var height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var ascent = this.elements[0][0].size.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    width += this.GapLeft + this.GapRight;

    this.size =  {width: width, height: height, ascent: ascent};
}
CFraction.prototype.recalculateLinear = function()
{
    var AscentFirst   = this.elements[0][0].size.ascent,
        DescentFirst  = this.elements[0][0].size.height - this.elements[0][0].size.ascent,
        AscentSecond  = this.elements[0][1].size.ascent,
        DescentSecond = this.elements[0][1].size.height - this.elements[0][1].size.ascent;

    var H = AscentFirst + DescentSecond;

    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var gap = 5.011235894097222*mgCtrPrp.FontSize/36;

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

    var ascent  = AscentFirst > AscentSecond ? AscentFirst : AscentSecond;
    var descent = DescentFirst > DescentSecond ? DescentFirst : DescentSecond;

    var height = ascent + descent;

    var width = this.elements[0][0].size.width + this.dW + this.elements[0][1].size.width;

    width += this.GapLeft + this.GapRight;

    this.size = {height: height, width: width, ascent: ascent};
}
CFraction.prototype.setPosition = function(pos, PDSE)
{
    if(this.Pr.type == SKEWED_FRACTION)
    {
        var Numerator   = this.Content[0],
            Denominator = this.Content[1];

        this.pos.x = pos.x;
        this.pos.y = pos.y - this.size.ascent;

        var X = this.pos.x + this.GapLeft,
            Y = this.pos.y;

        var PosNum = new CMathPosition();

        PosNum.x = X;
        PosNum.y = Y + Numerator.size.ascent;

        var PosDen = new CMathPosition();

        PosDen.x = X + Numerator.size.width + this.dW;
        PosDen.y = Y + Numerator.size.height + Denominator.size.ascent;

        Numerator.setPosition(PosNum, PDSE);
        Denominator.setPosition(PosDen, PDSE);

        pos.x += this.size.width;
    }
    else
        CFraction.superclass.setPosition.call(this, pos, PDSE);
}
CFraction.prototype.fillContent = function()
{
    this.Numerator   = new CNumerator(this.Content[0]);
    this.Denominator = new CDenominator(this.Content[1]);

    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
    {
        this.setDimension(2, 1);

        if(this.Pr.type == NO_BAR_FRACTION)
            this.bHideBar = true;

        this.elements[0][0] = this.Numerator;
        this.elements[1][0] = this.Denominator;
    }
    else if(this.Pr.type == SKEWED_FRACTION)
    {
        this.setDimension(1, 2);
        this.elements[0][0] = this.Numerator.getElement();
        this.elements[0][1] = this.Denominator.getElement();
    }
    else if(this.Pr.type == LINEAR_FRACTION)
    {
        this.setDimension(1, 2);
        this.elements[0][0] = this.Numerator.getElement();
        this.elements[0][1] = this.Denominator.getElement();
    }
}
CFraction.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.Fraction;
    MathProps.Pr   = null;
};

function CFractionBase(bInside, MathContent)
{
    CFractionBase.superclass.constructor.call(this, bInside);
    this.gap = 0;
    this.init(MathContent);
}
Asc.extendClass(CFractionBase, CMathBase);
CFractionBase.prototype.init = function(MathContent)
{
    this.setDimension(1, 1);
    this.elements[0][0] = MathContent;
}
CFractionBase.prototype.getElement = function()
{
    return this.elements[0][0];
}
CFractionBase.prototype.setElement = function(Element)
{
    this.elements[0][0] = Element;
};
CFractionBase.prototype.getPropsForWrite = function()
{
    return {};
}
CFractionBase.prototype.Get_Id = function()
{
    return this.elements[0][0].Get_Id();
};

function CNumerator(MathContent)
{
    CNumerator.superclass.constructor.call(this, true, MathContent);
}
Asc.extendClass(CNumerator, CFractionBase);
CNumerator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;

    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var Descent = arg.height - arg.ascent; // baseLine

    g_oTextMeasurer.SetFont(mgCtrPrp);
    var Height = g_oTextMeasurer.GetHeight();

    var gapNum, minGap;

    if(this.Parent.kind == MATH_LIMIT || this.Parent.kind == MATH_GROUP_CHARACTER)
    {
        //gapNum = Height/2.4;
        //gapNum = Height/2.97;
        //gapNum = Height/2.97 - Height/10.5;
        gapNum = Height/4.14;
        minGap = Height/13.8;

        //var delta = 0.8076354679802956*gapNum - Descent;
        var delta = gapNum - Descent;
        //this.gap = delta > minGap ? delta - 0.95*minGap: minGap;
        this.gap = delta > minGap ? delta: minGap;
    }
    else    // Fraction
    {
        gapNum = Height/3.05;
        minGap = Height/9.77;

        var delta = gapNum - Descent;
        this.gap = delta > minGap ? delta : minGap;
    }


    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent;

    this.size = {width : width, height: height, ascent: ascent};
}

function CDenominator(MathContent)
{
    CDenominator.superclass.constructor.call(this, true, MathContent);
}
Asc.extendClass(CDenominator, CFractionBase);
CDenominator.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;

    var mgCtrPrp = this.Get_TxtPrControlLetter();

    var Ascent = arg.ascent -  4.938888888888888*mgCtrPrp.FontSize/36;

    g_oTextMeasurer.SetFont(mgCtrPrp);
    var Height = g_oTextMeasurer.GetHeight();

    var gapDen, minGap;

    if(this.Parent.kind == MATH_PRIMARY_LIMIT || this.Parent.kind == MATH_GROUP_CHARACTER)
    {
        gapDen = Height/2.6;
        minGap = Height/10;
    }
    else // Fraction
    {
        gapDen = Height/2.03;
        minGap = Height/6.1;
    }

    var delta = gapDen - Ascent;
    this.gap = delta > minGap ? delta : minGap;


    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent + this.gap;

    this.size = {width : width, height: height, ascent: ascent};
}
CDenominator.prototype.setPosition = function(pos, PDSE)
{
    pos.y += this.gap;

    CDenominator.superclass.setPosition.call(this, pos, PDSE);
}
//////////
