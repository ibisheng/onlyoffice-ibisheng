"use strict";

function CFraction(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_FRACTION;

    this.Pr =
    {
        type:   BAR_FRACTION
    };

    this.bHideBar =   false;

    CMathBase.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CFraction, CMathBase);
CFraction.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CFraction.prototype.getType = function()
{
    return this.Pr.type;
}
CFraction.prototype.draw = function(x, y, pGraphics)
{
    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
        this.drawBarFraction(x, y, pGraphics);
    else if(this.Pr.type == SKEWED_FRACTION)
        this.drawSkewedFraction(x, y, pGraphics);
    else if(this.Pr.type == LINEAR_FRACTION)
        this.drawLinearFraction(x, y, pGraphics);
}
CFraction.prototype.drawBarFraction = function(x, y, pGraphics)
{
    //var mgCtrPrp = this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp_2();
    this.ParaMath.ApplyArgSize(mgCtrPrp, this.Parent.Get_CompiledArgSize().value);

    var penW = mgCtrPrp.FontSize* 25.4/96 * 0.08;

    var numHeight = this.elements[0][0].size.height;

    var width = this.size.width - this.GapLeft - this.GapRight;

    var x1 = this.pos.x + x + this.GapLeft,
        x2 = x1 + width,
        y1 = this.pos.y + y + numHeight- penW;

    if( !this.bHideBar )
    {
        pGraphics.SetFont(mgCtrPrp);

        pGraphics.p_color(0,0,0, 255);
        pGraphics.b_color1(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    CFraction.superclass.draw.call(this, x, y, pGraphics);
}
CFraction.prototype.drawSkewedFraction = function(x, y, pGraphics)
{
    //var ctrPrp = this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var penW = mgCtrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    var gap = this.gapSlash/2 - penW/7.5;
    var plh = 9.877777777777776 * mgCtrPrp.FontSize / 36;

    var minHeight = 2*this.gapSlash,
        middleHeight = plh*4/3,
        maxHeight = (3*this.gapSlash + 5*plh)*2/3;

	var tg;
    var tg1 = -2.22,
        tg2 = -3.7;

    var X = this.pos.x + x + this.GapLeft,
        Y = this.pos.y + y;

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

    pGraphics.SetFont(mgCtrPrp);

    pGraphics.p_width(penW*1000);

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);
    pGraphics._s();
    pGraphics._m(xx1, yy1);
    pGraphics._l(xx2, yy2);
    pGraphics.ds();

    CFraction.superclass.draw.call(this, x, y, pGraphics);
}
CFraction.prototype.drawLinearFraction = function(x, y, pGraphics)
{
    var shift = 0.1*this.dW;

    var X = this.pos.x + x + this.GapLeft,
        Y = this.pos.y + y;

    var x1 = X + this.elements[0][0].size.width + this.dW - shift,
        y1 = Y,
        x2 = X + this.elements[0][0].size.width + shift,
        y2 = Y + this.size.height;

    //var ctrPrp = this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var penW = mgCtrPrp.FontSize/12.5*g_dKoef_pix_to_mm;

    pGraphics.SetFont(mgCtrPrp);
    pGraphics.p_width(penW*1000);

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();

    CFraction.superclass.draw.call(this, x, y, pGraphics);
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
/*CFraction.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    if(RPI.inline == true && this.Pr.type == BAR_FRACTION)
    {
        var ArgNum = ArgSize.Copy();
        ArgNum.decrease();

        this.elements[0][0].Resize(oMeasure, this, ParaMath, RPI, ArgNum);

        var ArgDen = ArgSize.Copy();
        ArgDen.decrease();

        this.elements[1][0].Resize(oMeasure, this, ParaMath, RPI, ArgDen);

        this.recalculateSize(oMeasure);
    }
    else
        CFraction.superclass.Resize.call(this, oMeasure, Parent, ParaMath, RPI, ArgSize);
}*/
CFraction.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    var ArgSzFr = ArgSize.Copy();

    if(RPI.bInline == true && this.Pr.type === BAR_FRACTION)
    {
        ArgSzFr.decrease();        // для контентов числителя и знаменателя
        this.ArgSize.SetValue(-1); // для CtrPrp
    }
    else if(RPI.bInsideFraction == true)
    {
        this.ArgSize.SetValue(-1); // для CtrPrp
    }

    var NewRPI = RPI.Copy();
    NewRPI.bInsideFraction = true;

    CFraction.superclass.Resize.call(this, oMeasure, Parent, ParaMath, NewRPI, ArgSzFr);

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

    //var ctrPrp =  this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var width  = num.width > den.width ? num.width : den.width;
    var height = num.height + den.height;
    var ascent = num.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    //width += this.GapLeft + this.GapRight;

    this.size =  {width: width, height: height, ascent: ascent};
}
CFraction.prototype.recalculateSkewed = function(oMeasure)
{
    //var ctrPrp = this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    this.gapSlash = 5.011235894097222 * mgCtrPrp.FontSize/36;
    var width = this.elements[0][0].size.width + this.gapSlash + this.elements[0][1].size.width;
    var height = this.elements[0][0].size.height + this.elements[0][1].size.height;
    var ascent = this.elements[0][0].size.height + this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    //width += this.GapLeft + this.GapRight;

    this.size =  {width: width, height: height, ascent: ascent};
}
CFraction.prototype.recalculateLinear = function()
{
    var AscentFirst   = this.elements[0][0].size.ascent,
        DescentFirst  = this.elements[0][0].size.height - this.elements[0][0].size.ascent,
        AscentSecond  = this.elements[0][1].size.ascent,
        DescentSecond = this.elements[0][1].size.height - this.elements[0][1].size.ascent;

    var H = AscentFirst + DescentSecond;
    //var ctrPrp = this.Get_CompiledCtrPrp();
    var mgCtrPrp = this.Get_CompiledCtrPrp();

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

    //width += this.GapLeft + this.GapRight;

    this.size = {height: height, width: width, ascent: ascent};
}
CFraction.prototype.setPosition = function(pos)
{
    if(this.Pr.type == SKEWED_FRACTION)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y - this.size.ascent;

        var PosNum = new CMathPosition();

        PosNum.x = this.pos.x + this.GapLeft;
        PosNum.y = this.pos.y;


        var PosDen = new CMathPosition();

        PosDen.x = this.pos.x + this.GapLeft + this.elements[0][0].size.width + this.gapSlash;
        PosDen.y = this.pos.y + this.elements[0][0].size.height;

        this.elements[0][0].setPosition(PosNum);
        this.elements[0][1].setPosition(PosDen);
    }
    else
        CFraction.superclass.setPosition.call(this, pos);
}
CFraction.prototype.old_findDisposition = function(mCoord)
{
    var disposition;

    if(this.Pr.type == SKEWED_FRACTION)
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
CFraction.prototype.findDisposition = function(SearchPos, Depth)
{
    if(this.Pr.type == SKEWED_FRACTION)
    {
        var Numerator   = this.elements[0][0].size,
            Denominator = this.elements[0][1].size;


        //posCurs.x = 0;
        SearchPos.Pos.Update(0, Depth);

        if( SearchPos.X < (Numerator.width + this.gapSlash/2))
        {
            if(Numerator.width < SearchPos.X)
            {
                SearchPos.X = Numerator.width;
            }
            if(Numerator.height < SearchPos.Y)
            {
                SearchPos.Y = Numerator.height;
            }

            SearchPos.Pos.Update(0, Depth+1);
            //posCurs.y = 0;
        }
        else
        {
            if(SearchPos.X < this.size.width - Denominator.width)
            {
                SearchPos.X = 0;
            }
            else if(SearchPos.X > this.size.width)
            {
                SearchPos.X = Denominator.width;
            }
            else
                SearchPos.X -= Numerator.width - this.gapSlash;

            if( SearchPos.Y < this.size.height - Denominator.height)
            {
                SearchPos.Y = 0;
            }
            else if(SearchPos.Y > this.size.height)
            {
                SearchPos.Y = Denominator.height;
            }
            else
                SearchPos.Y -= Numerator.height;

            SearchPos.Pos.Update(1, Depth+1);
            //posCurs.y = 1;
        }
    }
    else
       CFraction.superclass.findDisposition.call(this, SearchPos, Depth);

}
CFraction.prototype.setProperties = function(props)
{
    var bBar = props.type === BAR_FRACTION || props.type === NO_BAR_FRACTION,
        bSkew = props.type === SKEWED_FRACTION,
        bLin = props.type === LINEAR_FRACTION;

    if(bBar || bSkew || bLin)
        this.Pr.type = props.type;

    this.setCtrPrp(props.ctrPrp);
}
CFraction.prototype.fillContent = function()
{
    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
    {
        var num = new CNumerator();

        var den = new CDenominator();

        this.setDimension(2, 1);

        if(this.Pr.type == NO_BAR_FRACTION)
            this.bHideBar = true;

        this.addMCToContent([num, den]);
    }
    else if(this.Pr.type == SKEWED_FRACTION)
    {
        this.setDimension(1, 2);
        this.setContent();
    }
    else if(this.Pr.type == LINEAR_FRACTION)
    {
        this.setDimension(1, 2);
        this.setContent();
    }
}
CFraction.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();


    if(this.Pr.type == BAR_FRACTION || this.Pr.type == NO_BAR_FRACTION)
    {
        // Numerator
        this.elements[0][0].fillMathComposition(contents[0]);

        // Denominator
        this.elements[1][0].fillMathComposition(contents[1]);
    }
    else
    {
        // Numerator
        this.elements[0][0] = contents[0];

        // Denominator
        this.elements[0][1] = contents[1];
    }

}
CFraction.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CFraction.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_frac );
}
CFraction.prototype.Load_Changes = function(Reader)
{
}
CFraction.prototype.Refresh_RecalcData = function(Data)
{
}
CFraction.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_frac );
	
	Writer.WriteString2( this.getNumerator().Id );
	Writer.WriteString2( this.getDenominator().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.Pr.type )
    {
		Writer.WriteLong( this.Pr.type );	
		Flags |= 1;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CFraction.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
	
	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.type = Reader.GetLong();
	
	this.fillMathComposition (props, arrElems);
}
CFraction.prototype.Get_Id = function()
{
	return this.Id;
}


function CNumerator()
{
    this.gap = 0;

    CMathBase.call(this, true);

    this.init();
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

    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var Descent = arg.height - arg.ascent; // baseLine
    var gapNum = 7.832769097222222 * mgCtrPrp.FontSize/36,
        minGap = mgCtrPrp.FontSize* 25.4/96 * 0.16;

    // var delta = 0.65*gap - Descent;
    var delta = 0.8076354679802956*gapNum - Descent;

    this.gap = delta > minGap ? delta - 0.95*minGap: minGap;

    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent;

    this.size = {width : width, height: height, ascent: ascent};
}
CNumerator.prototype.findDisposition = function(SearchPos, Depth)
{
    var arg = this.elements[0][0].size;

    SearchPos.Pos.Update(0, Depth);
    SearchPos.Pos.Update(0, Depth+1);


    if(SearchPos.Y > arg.height)
        SearchPos.Y = arg.height;

}
CNumerator.prototype.setPosition = function(pos)
{
    this.elements[0][0].setPosition(pos);
}
CNumerator.prototype.getElement = function()
{
    return this.elements[0][0];
}
CNumerator.prototype.fillMathComposition = function(content)
{
    this.elements[0][0] = content;
}
/*CNumerator.prototype.Get_CompiledCtrPrp = function()
{
    return this.Parent.Get_CompiledCtrPrp();
}*/
CNumerator.prototype.getPropsForWrite = function()
{
    var props = {};

    return props;
}

function CDenominator()
{
    this.gap = 0;

    CMathBase.call(this, true);

    this.init();
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

    var mgCtrPrp = this.Get_CompiledCtrPrp();


    var gapDen = 7.325682539682539 * mgCtrPrp.FontSize/36,
        Ascent = arg.ascent -  4.938888888888888*mgCtrPrp.FontSize/36,
        minGap = gapDen/3;

    var delta = gapDen - Ascent;
    this.gap = delta > minGap ? delta : minGap;

    var width = arg.width;
    var height = arg.height + this.gap;
    var ascent = arg.ascent + this.gap;

    this.size = {width : width, height: height, ascent: ascent};
}
CDenominator.prototype.findDisposition = function(SearchPos, Depth)
{
    var arg = this.elements[0][0].size;


    SearchPos.Pos.Update(0, Depth);
    SearchPos.Pos.Update(0, Depth+1);

    if(SearchPos.Y < this.gap)
    {
        SearchPos.Y = 0;
    }
    else if (SearchPos.Y > arg.height + this.gap)
    {
        SearchPos.Y = arg.height;
    }
    else
        SearchPos.Y -= this.gap;

}
CDenominator.prototype.setPosition = function(pos)
{
    var NewPos = new CMathPosition();

    NewPos.x = pos.x;
    NewPos.y = pos.y + this.gap;

    this.elements[0][0].setPosition(NewPos);
}
CDenominator.prototype.getElement = function(txt)
{
    return this.elements[0][0];
}
CDenominator.prototype.fillMathComposition = function(content)
{
    this.elements[0][0] = content;
}
/*CDenominator.prototype.Get_CompiledCtrPrp = function()
{
    return this.Parent.Get_CompiledCtrPrp();
}*/
CDenominator.prototype.getPropsForWrite = function()
{
    var props = {};

    return props;
}
//////////
