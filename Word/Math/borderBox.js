"use strict";

function CMathBorderBoxPr()
{
    strikeVthis.hideBot    = false;
    this.hideLeft   = false;
    this.hideRight  = false;
    this.hideTop    = false;
    this.strikeBLTR = false;
    this.strikeH    = false;
    this.strikeTLBR = false;
    this.strikeV    = false;
}

CMathBorderBoxPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.hideBot && null !== Obj.hideBot)
        this.hideBot = Obj.hideBot;

    if (undefined !== Obj.hideLeft && null !== Obj.hideLeft)
        this.hideLeft = Obj.hideLeft;

    if (undefined !== Obj.hideRight && null !== Obj.hideRight)
        this.hideRight = Obj.hideRight;

    if (undefined !== Obj.hideTop && null !== Obj.hideTop)
        this.hideTop = Obj.hideTop;

    if (undefined !== Obj.strikeBLTR && null !== Obj.strikeBLTR)
        this.strikeBLTR = Obj.strikeBLTR;

    if (undefined !== Obj.strikeH && null !== Obj.strikeH)
        this.strikeH = Obj.strikeH;

    if (undefined !== Obj.strikeTLBR && null !== Obj.strikeTLBR)
        this.strikeTLBR = Obj.strikeTLBR;

    if (undefined !== Obj.strikeV && null !== Obj.strikeV)
        this.strikeV = Obj.strikeV;
};

CMathBorderBoxPr.prototype.Copy = function()
{
    var NewPr = new CMathBorderBoxPr();

    NewPr.hideLeft   = this.hideLeft;
    NewPr.hideRight  = this.hideRight;
    NewPr.hideTop    = this.hideTop;
    NewPr.strikeBLTR = this.strikeBLTR;
    NewPr.strikeH    = this.strikeH;
    NewPr.strikeTLBR = this.strikeTLBR;
    NewPr.strikeV    = this.strikeV;

    return NewPr;
};

CMathBorderBoxPr.prototype.Write_ToBinary = function(Writer)
{
    // Bool : hideBot
    // Bool : hideLeft
    // Bool : hideRight
    // Bool : hideTop
    // Bool : strikeBLTR
    // Bool : strikeH
    // Bool : strikeTLBR
    // Bool : strikeV

    Writer.WriteBool(this.hideBot);
    Writer.WriteBool(this.hideLeft);
    Writer.WriteBool(this.hideRight);
    Writer.WriteBool(this.hideTop);
    Writer.WriteBool(this.strikeBLTR);
    Writer.WriteBool(this.strikeH);
    Writer.WriteBool(this.strikeTLBR);
    Writer.WriteBool(this.strikeV);
};

CMathBorderBoxPr.prototype.Read_FromBinary = function(Reader)
{
    // Bool : hideBot
    // Bool : hideLeft
    // Bool : hideRight
    // Bool : hideTop
    // Bool : strikeBLTR
    // Bool : strikeH
    // Bool : strikeTLBR
    // Bool : strikeV

    this.hideLeft   = Reader.GetBool();
    this.hideRight  = Reader.GetBool();
    this.hideTop    = Reader.GetBool();
    this.strikeBLTR = Reader.GetBool();
    this.strikeH    = Reader.GetBool();
    this.strikeTLBR = Reader.GetBool();
    this.strikeV    = Reader.GetBool();
};

function CBorderBox(props)
{
    CBorderBox.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BORDER_BOX;

    this.gapBrd = 0;

    this.Pr = new CMathBorderBoxPr();

    this.baseContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CBorderBox, CMathBase);
CBorderBox.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBorderBox.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.baseContent;
}
CBorderBox.prototype.setProperties = function(props)
{
    this.Pr.Set_FromObject(props);
    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CBorderBox.prototype.recalculateSize = function()
{
    var base = this.elements[0][0].size;

    var width = base.width;
    var height = base.height;
    var ascent = base.ascent;

    this.gapBrd = this.Get_CompiledCtrPrp().FontSize*0.08104587131076388;

    if(this.Pr.hideTop == false)
    {
        height += this.gapBrd;
        ascent += this.gapBrd;
    }
    if(this.Pr.hideBot == false)
        height += this.gapBrd;

    if(this.Pr.hideLeft == false)
        width += this.gapBrd;
    if(this.Pr.hideRight == false)
        width += this.gapBrd;

    width += this.GapLeft + this.GapRight;

    this.size = {width : width, height: height, ascent: ascent};
}
CBorderBox.prototype.draw = function(x, y, pGraphics)
{
    this.elements[0][0].draw(x, y, pGraphics);

    var penW = this.Get_CompiledCtrPrp().FontSize*0.02;

    var Width  = this.size.width - this.GapLeft - this.GapRight,
        Height = this.size.height;

    var X = this.pos.x + x + this.GapLeft,
        Y = this.pos.y + y;

    if(!this.Pr.hideTop)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y;

         pGraphics.p_color(0,0,0, 255);
         pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(!this.Pr.hideBot)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y + Height;

            pGraphics.p_color(0,0,0, 255);
            pGraphics.drawHorLine(2, y1, x1, x2, penW);
    }

    if(!this.Pr.hideLeft)
    {
        var x1 = X,
            y1 = Y,
            y2 = Y + Height;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

    if(!this.Pr.hideRight)
    {
        var x1 = X + Width,
            y1 = Y,
            y2 = Y + Height;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(2, x1, y1, y2, penW);
    }

    if(this.Pr.strikeTLBR)  // left diagonal
    {
        if(penW < 0.3)
        {
            var x1 = X, y1 = Y,
                x2 = X + Width, y2 = Y + Height;

            pGraphics.p_width(180);
            pGraphics.b_color1(0,0,0, 255);

            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics.ds();
        }
        else
        {
            var pW = penW*0.8;

            var x1 = X,                 y1 = Y,
                x2 = X + pW,            y2 = Y,
                x3 = X + Width,         y3 = Y + Height - pW,
                x4 = X + Width,         y4 = Y + Height,
                x5 = X + Width - pW,    y5 = Y + Height,
                x6 = X,                 y6 = Y + pW,
                x7 = X,                 y7 = Y;

            pGraphics.p_width(1000);
            pGraphics.b_color1(0,0,0, 255);

            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics._l(x3, y3);
            pGraphics._l(x4, y4);
            pGraphics._l(x5, y5);
            pGraphics._l(x6, y6);
            pGraphics._l(x7, y7);
            pGraphics.df();
        }

    }

    if(this.Pr.strikeBLTR) // right diagonal
    {
        if(penW < 0.3)
        {
            var x1 = X + Width,      y1 = Y,
                x2 = X,              y2 = Y + Height;

            pGraphics.p_width(180);
            pGraphics.b_color1(0,0,0, 255);

            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics.ds();
        }
        else
        {
            var pW = 0.8*penW;

            var x1 = X + Width,         y1 = Y,
                x2 = X + Width - pW,    y2 = Y,
                x3 = X,                 y3 = Y + Height - pW,
                x4 = X,                 y4 = Y + Height,
                x5 = X + pW,            y5 = Y + Height,
                x6 = X + Width,         y6 = Y + pW,
                x7 = X + Width,         y7 = Y;


            pGraphics.p_width(1000);
            pGraphics.b_color1(0,0,0, 255);

            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics._l(x3, y3);
            pGraphics._l(x4, y4);
            pGraphics._l(x5, y5);
            pGraphics._l(x6, y6);
            pGraphics._l(x7, y7);
            pGraphics.df();
        }

    }

    if(this.Pr.strikeH)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y + Height/2 - penW/2;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.Pr.strikeV)
    {
        var x1 = X + Width/2 - penW/2,
            y1 = Y,
            y2 = Y + Height;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

}
CBorderBox.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;

    var NewPos = new CMathPosition();

    if(this.Pr.hideLeft == false)
        NewPos.x = this.pos.x + this.GapLeft + this.gapBrd;
    else
        NewPos.x = this.pos.x + this.GapLeft;


    if(this.Pr.hideTop == false)
        NewPos.y = this.pos.y + this.gapBrd;
    else
        NewPos.y = this.pos.y;

    this.elements[0][0].setPosition(NewPos, PosInfo);
}
CBorderBox.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var alignLeft  =  this.Pr.hideLeft  ? 0 : this.gapBrd,
        alignRight =  this.Pr.hideRight ? 0 : this.gapBrd;
    SearchPos.CurX += this.GapLeft + alignLeft;

    var result =  this.elements[0][0].Get_ParaContentPosByXY(SearchPos, Depth+2, _CurLine, _CurRange, StepEnd);

    if(result)
    {
        SearchPos.Pos.Update2(0, Depth);
        SearchPos.Pos.Update2(0, Depth + 1);


        SearchPos.InTextPos.Update(0, Depth);
        SearchPos.InTextPos.Update(0, Depth + 1);

    }

    SearchPos.CurX += this.GapRight + alignRight;

    return result;
}
CBorderBox.prototype.getBase = function()
{
    return this.elements[0][0];
}
CBorderBox.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CBorderBox.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();

    var NewBorderBox = new CBorderBox(oProps);
    this.baseContent.CopyTo(NewBorderBox.baseContent, false);
    return NewBorderBox;
};
CBorderBox.prototype.Refresh_RecalcData = function(Data)
{
}
CBorderBox.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong(historyitem_type_borderBox);
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.baseContent.Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
    this.Pr.Write_ToBinary(Writer);
};
CBorderBox.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.baseContent = g_oTableId.Get_ById(Reader.GetString2());

    this.CtrlPr.Read_FromBinary(Reader);
    this.Pr.Read_FromBinary(Reader);

    this.fillContent();
}
CBorderBox.prototype.Get_Id = function()
{
	return this.Id;
}

function CMathBoxPr()
{
    this.aln     = false;
    this.brk     = false;
    this.diff    = false;
    this.noBreak = false;
    this.opEmu   = false;
};

CMathBoxPr.prototype.Set_FromObject = function(Obj)
{
    if(true === Obj.aln || 1 === Obj.aln)
        this.Pr.aln = true;
    else
        this.Pr.aln = false;

    if(true === Obj.brk || 1 === Obj.brk)
        this.Pr.brk = true;
    else
        this.Pr.brk = false;

    if(true === Obj.diff || 1 === Obj.diff)
        this.Pr.diff = true;
    else
        this.Pr.diff = false;

    if(true === Obj.noBreak || 1 === Obj.noBreak)
        this.Pr.noBreak = true;
    else
        this.Pr.noBreak = false;

    if(true === Obj.opEmu || 1 === Obj.opEmu)
        this.Pr.opEmu = true;
    else
        this.Pr.opEmu = false;
};

CMathBoxPr.prototype.Copy = function()
{
    var NewPr = new CMathBoxPr();

    NewPr.aln     = this.aln    ;
    NewPr.brk     = this.brk    ;
    NewPr.diff    = this.diff   ;
    NewPr.noBreak = this.noBreak;
    NewPr.opEmu   = this.opEmu  ;

    return NewPr;
};

CMathBoxPr.prototype.Write_ToBinary = function(Wrtier)
{
    // Bool : aln
    // Bool : brk
    // Bool : diff
    // Bool : noBreak
    // Bool : opEmu

    Writer.WriteBool(aln);
    Writer.WriteBool(brk);
    Writer.WriteBool(diff);
    Writer.WriteBool(noBreak);
    Writer.WriteBool(opEmu);
};

CMathBoxPr.prototype.Read_FromBinary = function(Reader)
{
    // Bool : aln
    // Bool : brk
    // Bool : diff
    // Bool : noBreak
    // Bool : opEmu

    this.aln     = Reader.GetBool();
    this.brk     = Reader.GetBool();
    this.diff    = Reader.GetBool();
    this.noBreak = Reader.GetBool();
    this.opEmu   = Reader.GetBool();
};

function CBox(props)
{
    CBox.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BOX;

    this.Pr = new CMathBoxPr();

    this.baseContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CBox, CMathBase);
CBox.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBox.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.baseContent;
}
CBox.prototype.setProperties = function(props)
{
    this.Pr.Set_FromObject(Obj);
    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CBox.prototype.getBase = function()
{
    return this.elements[0][0];
}
CBox.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CBox.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();
    var NewBox = new CBox(oProps);
    this.baseContent.CopyTo(NewBox.baseContent, false);
    return NewBox;
};
CBox.prototype.Refresh_RecalcData = function(Data)
{
}
CBox.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong(historyitem_type_box);
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.baseContent.Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
    this.Pr.Write_ToBinary(Writer);
};
CBox.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.baseContent = g_oTableId.Get_ById(Reader.GetString2());

    this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.Read_FromBinary(Reader);

    this.fillContent();
}
CBox.prototype.Get_Id = function()
{
	return this.Id;
}

function CMathBarPr()
{
    this.pos = LOCATION_BOT;
}

CMathBarPr.prototype.Set_FromObject = function(Obj)
{
    if(LOCATION_TOP === Obj.pos || LOCATION_BOT === Obj.pos)
        this.pos = Obj.pos;
};

CMathBarPr.prototype.Copy = function()
{
    var NewPr = new CMathBarPr();
    NewPr.pos = this.pos;
    return NewPr;
};

CMathBarPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : pos
    Writer.WriteLong(this.pos);
};

CMathBarPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : pos
    this.pos = Reader.GetLong();
};

function CBar(props)
{
    CBar.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BAR;

    this.Pr = new CMathBarPr();

    this.baseContent = new CMathContent();

    this.operator = new COperator(OPER_BAR);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CBar, CCharacter);
CBar.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBar.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.baseContent;
}
CBar.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    if(this.RecalcInfo.bProps == true)
    {
        var prp =
        {
            loc:    this.Pr.pos,
            type:   DELIMITER_LINE
        };

        var defaultProps =
        {
            loc:   LOCATION_BOT
        };

        this.setCharacter(prp, defaultProps);
        this.RecalcInfo.bProps = false;
    }

    //this.Set_CompiledCtrPrp(ParaMath);

    CBar.superclass.Resize.call(this, oMeasure, Parent, ParaMath, RPI, ArgSize);
}
CBar.prototype.getAscent = function()
{
    var ascent;

    if(this.Pr.pos === LOCATION_TOP )
        ascent = this.operator.size.height + this.elements[0][0].size.ascent;
    else if(this.Pr.pos === LOCATION_BOT )
        ascent = this.elements[0][0].size.ascent;

    return ascent;
}
CBar.prototype.setProperties = function(props)
{
    this.Pr.Set_FromObject(props);
    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CBar.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CBar.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();
    var NewBar = new CBar(oProps);
    this.baseContent.CopyTo(NewBar.baseContent, false);
    return NewBar;
};
CBar.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_bar );
}
CBar.prototype.Load_Changes = function(Reader)
{
}
CBar.prototype.Refresh_RecalcData = function(Data)
{
}
CBar.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong(historyitem_type_bar);
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.baseContent.Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.Pr.pos )
    {
		Writer.WriteLong( this.Pr.pos );	
		Flags |= 1;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );

}
CBar.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.baseContent = g_oTableId.Get_ById(Reader.GetString2());

	var props = {ctrPrp: new CTextPr()};
	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.pos = Reader.GetLong();

    this.init(props);
}
CBar.prototype.Get_Id = function()
{
	return this.Id;
}

function CMathPhantomPr()
{
    this.show     = true;
    this.transp   = false;
    this.zeroAsc  = false;
    this.zeroDesc = false;
    this.zeroWid  = false;
}

CMathPhantomPr.prototype.Set_FromObject = function(Obj)
{
    if (true === Obj.show || 1 === Obj.show)
        this.show = true;
    else
        this.show = false;

    if (true === Obj.transp || 1 === Obj.transp)
        this.transp = true;
    else
        this.transp = false;

    if (true === Obj.zeroAsc || 1 === Obj.zeroAsc)
        this.zeroAsc = true;
    else
        this.zeroAsc = false;

    if (true === Obj.zeroDesc || 1 === Obj.zeroDesc)
        this.zeroDesc = true;
    else
        this.zeroDesc = false;

    if (true === Obj.zeroWid || 1 === Obj.zeroWid)
        this.zeroWid = true;
    else
        this.zeroWid = false;
};

CMathPhantomPr.prototype.Copy = function()
{
    var NewPr = new CMathPhantomPr();

    NewPr.show     = this.show    ;
    NewPr.transp   = this.transp  ;
    NewPr.zeroAsc  = this.zeroAsc ;
    NewPr.zeroDesc = this.zeroDesc;
    NewPr.zeroWid  = this.zeroWid ;

    return NewPr;
};

CMathPhantomPr.prototype.Write_ToBinary = function(Writer)
{
    // Bool : show
    // Bool : transp
    // Bool : zeroAsc
    // Bool : zeroDesc
    // Bool : zeroWid

    Writer.WriteBool(show);
    Writer.WriteBool(transp);
    Writer.WriteBool(zeroAsc);
    Writer.WriteBool(zeroDesc);
    Writer.WriteBool(zeroWid);
};

CMathPhantomPr.prototype.Read_FromBinary = function(Reader)
{
    // Bool : show
    // Bool : transp
    // Bool : zeroAsc
    // Bool : zeroDesc
    // Bool : zeroWid

    this.show     = Reader.GetBool();
    this.transp   = Reader.GetBool();
    this.zeroAsc  = Reader.GetBool();
    this.zeroDesc = Reader.GetBool();
    this.zeroWid  = Reader.GetBool();
};

function CPhantom(props)
{
    CPhantom.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathPhantomPr();

    this.baseContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CPhantom, CMathBase);
CPhantom.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CPhantom.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.baseContent;
}
CPhantom.prototype.getBase = function()
{
    return this.elements[0][0];
}
CPhantom.prototype.setProperties = function(props)
{
    this.Pr.Set_FromObject(props);
    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CPhantom.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CPhantom.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();

    var NewPhant = new CPhantom(oProps);
    this.baseContent.CopyTo(NewPhant.baseContent, false);
    return NewPhant;
};
CPhantom.prototype.Refresh_RecalcData = function(Data)
{
}
CPhantom.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong(historyitem_type_phant);
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.baseContent.Id);
	
	this.CtrPrp.Write_ToBinary(Writer);
    this.Pr.Write_ToBinary(Writer);
}
CPhantom.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();
    this.baseContent = g_oTableId.Get_ById(Reader.GetString2());

    this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.Read_FromBinary(Reader);

    this.fillContent();
}
CPhantom.prototype.Get_Id = function()
{
	return this.Id;
}