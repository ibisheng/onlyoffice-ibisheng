"use strict";

function CBorderBox(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BORDER_BOX;

    this.gapBrd = 0;

    this.Pr =
    {
        hideLeft:       false,
        hideRight:      false,
        hideTop:        false,
        hideBot:        false,
        strikeBLTR:     false,
        strikeTLBR:     false,
        strikeH:        false,
        strikeV:        false
    };

    CMathBase.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add(this, this.Id);
}
extend(CBorderBox, CMathBase);
CBorderBox.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBorderBox.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CBorderBox.prototype.setProperties = function(props)
{
    if(typeof(props.hideLeft) !== "undefined" && props.hideLeft !== null)
        this.Pr.hideLeft = props.hideLeft;

    if(typeof(props.hideRight) !== "undefined" && props.hideRight !== null)
        this.Pr.hideRight = props.hideRight;

    if(typeof(props.hideTop) !== "undefined" && props.hideTop !== null)
        this.Pr.hideTop = props.hideTop;

    if(typeof(props.hideBot) !== "undefined" && props.hideBot !== null)
        this.Pr.hideBot = props.hideBot;

    if(typeof(props.strikeBLTR) !== "undefined" && props.strikeBLTR !== null) // right diagonal
        this.Pr.strikeBLTR = props.strikeBLTR;

    if(typeof(props.strikeTLBR) !== "undefined" && props.strikeTLBR !== null) // left diagonal
        this.Pr.strikeTLBR = props.strikeTLBR;

    if(typeof(props.strikeH) !== "undefined" && props.strikeH !== null)
        this.Pr.strikeH = props.strikeH;

    if(typeof(props.strikeV) !== "undefined" && props.strikeV !== null)
        this.Pr.strikeV = props.strikeV;

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
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Pos.Update(0, Depth + 1);
    }

    SearchPos.CurX += this.GapRight + alignRight;

    return result;
}
CBorderBox.prototype.getBase = function()
{
    return this.elements[0][0];
}
CBorderBox.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();

    // Base
    this.elements[0][0] = contents[0];
}
CBorderBox.prototype.getPropsForWrite = function()
{
    /*var props = {};

    props.hideLeft  = !this.bLeft;
    props.hideRight = !this.bRight;
    props.hideTop   = !this.bTop;
    props.hideBot   = !this.bBot;

    props.strikeBLTR = this.bRDiag;
    props.strikeTLBR = this.bLDiag;
    props.strikeH    = this.bHor;
    props.strikeV    = this.bVert;

    return props;*/

    return this.Pr;
}
CBorderBox.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_borderBox );
}
CBorderBox.prototype.Load_Changes = function(Reader)
{
}
CBorderBox.prototype.Refresh_RecalcData = function(Data)
{
}
CBorderBox.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_borderBox );
	Writer.WriteString2( this.getBase().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.Pr.hideBot )
    {
		Writer.WriteBool( this.Pr.hideBot );	
		Flags |= 1;
	}
	if ( undefined != this.Pr.hideLeft )
    {
		Writer.WriteBool( this.Pr.hideLeft );	
		Flags |= 2;
	}
	if ( undefined != this.Pr.hideRight )
    {
		Writer.WriteBool( this.Pr.hideRight );	
		Flags |= 4;
	}
	if ( undefined != this.Pr.hideTop )
    {
		Writer.WriteBool( this.Pr.hideTop );
		Flags |= 8;
	}
	if ( undefined != this.Pr.strikeBLTR )
    {
		Writer.WriteBool( this.Pr.strikeBLTR );	
		Flags |= 16;
	}
	if ( undefined != this.Pr.strikeH )
    {
		Writer.WriteBool( this.Pr.strikeH );
		Flags |= 32;
	}
	if ( undefined != this.Pr.strikeTLBR )
    {
		Writer.WriteBool( this.Pr.strikeTLBR );	
		Flags |= 64;
	}
	if ( undefined != this.Pr.strikeV )
    {
		Writer.WriteBool( this.Pr.strikeV );
		Flags |= 128;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CBorderBox.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
		
	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.hideBot = Reader.GetBool();
	if ( Flags & 2 )
		props.hideLeft = Reader.GetBool();
	if ( Flags & 4 )
		props.hideRight = Reader.GetBool();
	if ( Flags & 8 )
		props.hideTop = Reader.GetBool();
	if ( Flags & 16 )
		props.strikeBLTR = Reader.GetBool();
	if ( Flags & 32 )
		props.strikeH = Reader.GetBool();
	if ( Flags & 64 )
		props.strikeTLBR = Reader.GetBool();
	if ( Flags & 128 )
		props.strikeV = Reader.GetBool();
		
	this.fillMathComposition (props, arrElems);
}
CBorderBox.prototype.Get_Id = function()
{
	return this.Id;
}



function CBox(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BOX;

    this.Pr =
    {
        aln:        false,
        opEmu:      false,
        diff:       false,
        noBreak:    false,
        brk:        false
    };

    CMathBase.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CBox, CMathBase);
CBox.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBox.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CBox.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    //this.Set_CompiledCtrPrp(ParaMath);

    var ArgSizeBox = ArgSize.Copy();

    /*if(this.Pr.opEmu)
        ArgSizeBox.decrease();*/

    CBox.superclass.Resize.call(this, oMeasure, Parent, ParaMath, RPI, ArgSizeBox);
}
CBox.prototype.setProperties = function(props)
{
    if(props.opEmu === true || props.opEmu === false)
        this.Pr.opEmu = props.opEmu;

    if(props.diff === true || props.diff === false)
        this.Pr.diff = props.diff;

    if(props.noBreak === true || props.noBreak === false)
        this.Pr.noBreak = props.noBreak;

    if(props.brk === true || props.brk === false)
        this.Pr.brk = props.brk;

    if(props.aln === true || props.aln === false)
        this.Pr.aln = props.aln;

    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CBox.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();

    // Base
    this.elements[0][0] = contents[0];
}
CBox.prototype.getBase = function()
{
    return this.elements[0][0];
}
CBox.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CBox.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_box );
}
CBox.prototype.Load_Changes = function(Reader)
{
}
CBox.prototype.Refresh_RecalcData = function(Data)
{
}
CBox.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_box );
	Writer.WriteString2( this.getBase().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.aln )
    {
		Writer.WriteBool(this.aln);	
		Flags |= 1;
	}
	if ( undefined != this.brk )
    {
		Writer.WriteLong(this.brk);	
		Flags |= 2;
	}
	if ( undefined != this.diff )
    {
		Writer.WriteBool(this.diff);	
		Flags |= 4;
	}
	if ( undefined != this.noBreak )
    {
		Writer.WriteBool(this.noBreak);	
		Flags |= 8;
	}
	if ( undefined != this.opEmu )
    {
		Writer.WriteBool(this.opEmu);	
		Flags |= 16;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CBox.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));

	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.aln = Reader.GetBool();
	if ( Flags & 2 )
		props.brk = Reader.GetLong();
	if ( Flags & 4 )
		props.diff = Reader.GetBool();
	if ( Flags & 8 )
		props.noBreak = Reader.GetBool();
	if ( Flags & 16 )
		props.opEmu = Reader.GetBool();
		
	this.fillMathComposition (props, arrElems);
}
CBox.prototype.Get_Id = function()
{
	return this.Id;
}

function CBar(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BAR;

    this.Pr =
    {
        pos: LOCATION_BOT
    };

    //this.loc = LOCATION_BOT;
    this.operator = new COperator(OPER_BAR);

    CCharacter.call(this);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CBar, CCharacter);
CBar.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CBar.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.setContent();
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
    if(props.pos === LOCATION_TOP || props.pos === LOCATION_BOT)
        this.Pr.pos = LOCATION_TOP;

    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CBar.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();

    // Base
    this.elements[0][0] = contents[0];
}
CBar.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
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
	Writer.WriteLong( historyitem_type_bar );
	Writer.WriteString2( this.getBase().Id );	
	
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
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));

	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.pos = Reader.GetLong();
		
	this.fillMathComposition (props, arrElems);
}
CBar.prototype.Get_Id = function()
{
	return this.Id;
}

function CPhantom(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    CMathBase.call(this);

    this.Pr =
    {
        show:       true,
        transp:     false,
        zeroAsc:    false,
        zeroDesc:   false,
        zeroWid:    false
    };

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CPhantom, CMathBase);
CPhantom.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
}
CPhantom.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.setContent();
}
CPhantom.prototype.getBase = function()
{
    return this.elements[0][0];
}
CPhantom.prototype.setProperties = function(props)
{
    if(props.show == true || props.show == false)
        this.Pr.show = props.show;

    if(props.transp == false || props.transp == true)
        this.Pr.transp = props.transp;

    if(props.zeroAsc == false || props.zeroAsc == true)
        this.Pr.zeroAsc = props.zeroAsc;

    if(props.zeroDesc == false || props.zeroDesc == true)
        this.Pr.zeroDesc = props.zeroDesc;

    if(props.zeroWid == false || props.zeroWid == true)
        this.Pr.zeroWid = props.zeroWid;


    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CPhantom.prototype.fillMathComposition = function(props, contents /*array*/)
{
    this.setProperties(props);
    this.fillContent();

    // Base
    this.elements[0][0] = contents[0];
}
CPhantom.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CPhantom.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_phant );
}
CPhantom.prototype.Load_Changes = function(Reader)
{
}
CPhantom.prototype.Refresh_RecalcData = function(Data)
{
}
CPhantom.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_phant );
	Writer.WriteString2( this.getBase().Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.Pr.show )
    {
		Writer.WriteBool( this.Pr.show );
		Flags |= 1;
	}
	if ( undefined != this.Pr.transp )
    {
		Writer.WriteBool( this.Pr.transp );
		Flags |= 2;
	}
	if ( undefined != this.Pr.zeroAsc )
    {
		Writer.WriteBool( this.Pr.zeroAsc );
		Flags |= 4;
	}
	if ( undefined != this.Pr.zeroDesc )
    {
		Writer.WriteBool( this.Pr.zeroDesc );
		Flags |= 8;
	}
	if ( undefined != this.Pr.zeroWid )
    {
		Writer.WriteBool( this.Pr.zeroWid );
		Flags |= 16;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CPhantom.prototype.Read_FromBinary2 = function( Reader )
{
	var props = {ctrPrp: new CTextPr()};
	var arrElems = [];
	
	arrElems.push(g_oTableId.Get_ById( Reader.GetString2()));
		
	props.ctrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		props.show = Reader.GetBool();
	if ( Flags & 2 )
		props.transp = Reader.GetBool();
	if ( Flags & 4 )
		props.zeroAsc = Reader.GetBool();
	if ( Flags & 8 )
		props.zeroDesc = Reader.GetBool();
	if ( Flags & 16 )
		props.zeroWid = Reader.GetBool();
		
	this.fillMathComposition (props, arrElems);
}
CPhantom.prototype.Get_Id = function()
{
	return this.Id;
}