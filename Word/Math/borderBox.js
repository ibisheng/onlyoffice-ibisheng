function CBorderBox(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BORDER_BOX;

    this.gapBrd = 0;

    /*this.bLeft = true;
    this.bRight = true;
    this.bTop = true;
    this.bBot = true;

    this.bLDiag = false;
    this.bRDiag = false;

    this.bHor = false;
    this.bVert = false;*/

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

    this.init(props);
    this.setCtrPrp(props.ctrPrp);
	g_oTableId.Add(this, this.Id);
}
extend(CBorderBox, CMathBase);
CBorderBox.prototype.init = function(props)
{
    /*if(typeof(props) !== "undefined" && props !== null)
    {
        if(props.hideLeft === true || props.hideLeft === 1)
            this.bLeft = false;
        if(props.hideRight === true || props.hideRight === 1)
            this.bRight = false;
        if(props.hideTop === true || props.hideTop === 1)
            this.bTop = false;
        if(props.hideBot === true || props.hideBot === 1)
            this.bBot = false;

        if(props.strikeBLTR === true || props.strikeBLTR === 1)
            this.bRDiag = true;

        if(props.strikeTLBR === true || props.strikeTLBR === 1)
            this.bLDiag = true;

        if(props.strikeH === true || props.strikeH === 1)
            this.bHor = true;

        if(props.strikeV === true || props.strikeV === 1)
            this.bVert = true;
    }*/

    this.setBorders(props);
    this.setDimension(1, 1);

    this.setContent();
}
CBorderBox.prototype.setBorders = function(props)
{
    if(typeof(props) !== "undefined" && props !== null)
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
    }

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
    //var penW = this.Get_CompiledCtrPrp().FontSize* 25.4/72 * 0.06 ;
    var penW = this.Get_CompiledCtrPrp().FontSize*0.02;

    if(!this.Pr.hideTop)
    {
        var x1 = this.pos.x + x,
            x2 = this.pos.x + x + this.size.width - penW/2,
            y1 = this.pos.y + y;

         pGraphics.p_color(0,0,0, 255);
         pGraphics.drawHorLine(0, y1, x1, x2, penW);

        /*pGraphics.p_color(255,0,0, 255);
        pGraphics.drawHorLine(0, y1 - 25.4/96, x1 + 2*25.4/96, x2, 25.4/96);

        pGraphics.p_color(255,0,0, 255);
        pGraphics.drawHorLine(0, y1 + penW, x1 + 2*25.4/96, x2 , 25.4/96);*/
    }

    if(!this.Pr.hideBot)
    {
        var x1 = this.pos.x + x,
            x2 = this.pos.x + x + this.size.width - penW/2,
            y1 = this.pos.y + y + this.size.height - penW/2;

            pGraphics.p_color(0,0,0, 255);
            pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(!this.Pr.hideLeft)
    {
        var x1 = this.pos.x + x,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW/2;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

    if(!this.Pr.hideRight)
    {
        var x1 = this.pos.x + x + this.size.width - penW/2,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW/2;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

    if(this.Pr.strikeTLBR)  // left diagonal
    {
        var pW = penW*0.8;
        var x1 = this.pos.x + x , y1 = this.pos.y + y,
            x2 = x1 + pW, y2 = y1,
            x3 = x1 + this.size.width - penW, y3 = y1 + this.size.height - pW - penW,
            x4 = x3, y4 = y3 + pW,
            x5 = x4 - pW, y5 = y4,
            x6 = x1, y6 = y1 + pW,
            x7 = x1, y7 = y1;

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

    if(this.Pr.strikeBLTR) // right diagonal
    {
        var pW = penW*0.8;
        var x1 = this.pos.x + x + this.size.width - pW - penW, y1 = this.pos.y + y,
            x2 = x1 + pW, y2 = y1,
            x3 = x2, y3 = y2 + pW,
            x4 = this.pos.x + x + pW, y4 = this.pos.y + y + this.size.height - penW,
            x5 = x4 - pW, y5 = y4,
            x6 = x5, y6 = y5 - pW,
            x7 = x1, y7 = y1;

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

    if(this.Pr.strikeH)
    {
        var x1 = this.pos.x + x,
            x2 = this.pos.x + x + this.size.width - penW,
            y1 = this.pos.y + y + this.size.height/2 - penW/2;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.Pr.strikeV)
    {
        var x1 = this.pos.x + x + this.size.width/2 - penW/2,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

}
CBorderBox.prototype.old_draw = function(x, y, pGraphics)
{
    this.elements[0][0].draw(x, y, pGraphics);
    //var penW = this.getCtrPrp().FontSize* 25.4/96 * 0.08 ;
    var penW = this.Get_CompiledCtrPrp().FontSize*0.02;

    if(!this.Pr.hideTop)
    {

        var x1 = this.pos.x + x,
        //x2 = this.pos.x + x + this.size.width - 25.4/96,
            x2 = this.pos.x + x + this.size.width - penW,
            y1 = this.pos.y + y;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(!this.Pr.hideBot)
    {
        var x1 = this.pos.x + x,
        //x2 = this.pos.x + x + this.size.width - 25.4/96,
            x2 = this.pos.x + x + this.size.width - penW,
            y1 = this.pos.y + y + this.size.height - penW;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(!this.Pr.hideLeft)
    {
        var x1 = this.pos.x + x,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW;
        //y2 = this.pos.y + y + this.size.height - 25.4/96;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

    if(!this.Pr.hideRight)
    {
        var x1 = this.pos.x + x + this.size.width - penW,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW;
        //y2 = this.pos.y + y + this.size.height - 25.4/96 ;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

    if(this.Pr.strikeTLBR)
    {
        var pW = penW*0.8;
        var x1 = this.pos.x + x , y1 = this.pos.y + y,
            x2 = x1 + pW, y2 = y1,
        //x3 = x1 + this.size.width - 25.4/96, y3 = y1 + this.size.height - pW - 25.4/96,
            x3 = x1 + this.size.width - penW, y3 = y1 + this.size.height - pW - penW,
            x4 = x3, y4 = y3 + pW,
            x5 = x4 - pW, y5 = y4,
            x6 = x1, y6 = y1 + pW,
            x7 = x1, y7 = y1;

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

    if(this.Pr.strikeBLTR)
    {
        var pW = penW*0.8;
        var x1 = this.pos.x + x + this.size.width - pW - penW, y1 = this.pos.y + y,
        //x1 = this.pos.x + x + this.size.width - pW - 25.4/96, y1 = this.pos.y + y,
            x2 = x1 + pW, y2 = y1,
            x3 = x2, y3 = y2 + pW,
            x4 = this.pos.x + x + pW, y4 = this.pos.y + y + this.size.height - penW,
        //x4 = this.pos.x + x + pW, y4 = this.pos.y + y + this.size.height - 25.4/96,
            x5 = x4 - pW, y5 = y4,
            x6 = x5, y6 = y5 - pW,
            x7 = x1, y7 = y1;

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

    if(this.Pr.strikeH)
    {
        var x1 = this.pos.x + x,
            x2 = this.pos.x + x + this.size.width - penW,
        //x2 = this.pos.x + x + this.size.width - 25.4/96,
            y1 = this.pos.y + y + this.size.height/2 - penW/2;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.Pr.strikeV)
    {
        var x1 = this.pos.x + x + this.size.width/2 - penW/2,
            y1 = this.pos.y + y,
            y2 = this.pos.y + y + this.size.height - penW;
        //y2 = this.pos.y + y + this.size.height - 25.4/96;

        pGraphics.p_color(0,0,0, 255);
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }

}
CBorderBox.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    var x = this.pos.x + this.GapLeft, y = this.pos.y;

    if(this.Pr.hideLeft == false)
        x += this.gapBrd;
    if(this.Pr.hideTop == false)
        y += this.gapBrd;

    this.elements[0][0].setPosition({x : x, y: y});
}
CBorderBox.prototype.findDisposition = function(mCoord)
{
    var X = null,
        Y = null,
        inside_flag = -1; // остаемя в пределах данного элемента( за границы элемента не вышли )

    var shX = 0, shY = 0;

    if(this.Pr.hideLeft == false)
        shX = this.gapBrd;
    if(this.Pr.hideTop == false)
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
CBorderBox.prototype.getBase = function()
{
    return this.elements[0][0];
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
	Writer.WriteString2( this.elements[0][0].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.hideBot )
    {
		Writer.WriteBool( this.hideBot );	
		Flags |= 1;
	}
	if ( undefined != this.hideLeft )
    {
		Writer.WriteBool( this.hideLeft );	
		Flags |= 2;
	}
	if ( undefined != this.hideRight )
    {
		Writer.WriteBool( this.hideRight );	
		Flags |= 4;
	}
	if ( undefined != this.hideTop )
    {
		Writer.WriteBool( this.hideTop );
		Flags |= 8;
	}
	if ( undefined != this.strikeBLTR )
    {
		Writer.WriteBool( this.strikeBLTR );	
		Flags |= 16;
	}
	if ( undefined != this.strikeH )
    {
		Writer.WriteBool( this.strikeH );
		Flags |= 32;
	}
	if ( undefined != this.strikeTLBR )
    {
		Writer.WriteBool( this.strikeTLBR );	
		Flags |= 64;
	}
	if ( undefined != this.strikeV )
    {
		Writer.WriteBool( this.strikeV );
		Flags |= 128;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CBorderBox.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;
		
	this.CtrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		this.hideBot = Reader.GetBool();
	if ( Flags & 2 )
		this.hideLeft = Reader.GetBool();
	if ( Flags & 4 )
		this.hideRight = Reader.GetBool();
	if ( Flags & 8 )
		this.hideTop = Reader.GetBool();
	if ( Flags & 16 )
		this.strikeBLTR = Reader.GetBool();
	if ( Flags & 32 )
		this.strikeH = Reader.GetBool();
	if ( Flags & 64 )
		this.strikeTLBR = Reader.GetBool();
	if ( Flags & 128 )
		this.strikeV = Reader.GetBool();
}
CBorderBox.prototype.Get_Id = function()
{
	return this.Id;
}

function CBox(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_BOX;

    this.aln  = false;
    this.opEmu = false;
    this.diff = false;
    this.noBreak = false;
    this.brk = false;

    CMathBase.call(this);

    this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CBox, CMathBase);
CBox.prototype.init = function(props)
{
    if(props.opEmu === true || props.opEmu === 1)
        this.opEmu = true;

    if(props.diff === true || props.diff === 1)
        this.diff = true;

    if(props.noBreak === true || props.noBreak === 1)
        this.noBreak = true;

    if(props.brk === true || props.brk === 1)
        this.brk = true;

    if(props.aln === true || props.aln === 1)
        this.aln = true;

    this.setDimension(1, 1);
    this.setContent();

    if(this.opEmu)
        this.elements[0][0].decreaseArgSize();

    if(props.ctrPrp !== null && typeof(props.ctrPrp) !== "undefined")
        this.setCtrPrp(props.ctrPrp);
}
CBox.prototype.getBase = function()
{
    return this.elements[0][0];
}
CBox.prototype.getPropsForWrite = function()
{
    var props =
    {
        aln:     this.aln,
        opEmu:   this.opEmu,
        diff:    this.diff,
        noBreak: this.noBreak,
        brk:     this.brk
    };

    return props;
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
	Writer.WriteString2( this.elements[0][0].Id );
	
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
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	this.CtrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		this.aln = Reader.GetBool();
	if ( Flags & 2 )
		this.brk = Reader.GetLong();
	if ( Flags & 4 )
		this.diff = Reader.GetBool();
	if ( Flags & 8 )
		this.noBreak = Reader.GetBool();
	if ( Flags & 16 )
		this.opEmu = Reader.GetBool();
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

    this.init(props);

	g_oTableId.Add( this, this.Id );
}
extend(CBar, CCharacter);
CBar.prototype.init = function(props)
{
    if(props.pos === LOCATION_TOP || props.location === LOCATION_TOP)
        this.Pr.pos = LOCATION_TOP;
    else if(props.pos === LOCATION_BOT || props.location === LOCATION_BOT)
        this.Pr.pos = LOCATION_BOT;

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


    if(props.ctrPrp !== null && typeof(props.ctrPrp) !== "undefined")
        this.setCtrPrp(props.ctrPrp);
}
CBar.prototype.setLocation = function(pos)
{
    this.Pr.pos = pos;
    this.RecalcInfo.bProps = true;
}
CBar.prototype.Resize = function(Parent, ParaMath, oMeasure)
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

    CBar.superclass.Resize.call(this, Parent, ParaMath, oMeasure);
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
	Writer.WriteString2( this.elements[0][0].Id );	
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.pos )
    {
		Writer.WriteString2( this.pos );	
		Flags |= 1;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );

}
CBar.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	this.CtrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		this.pos = Reader.GetString2();
}
CBar.prototype.Get_Id = function()
{
	return this.Id;
}

function CPhantom(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.props = null;
    CMathBase.call(this);

    this.init(props);
    this.setCtrPrp(props.ctrPrp);
	g_oTableId.Add( this, this.Id );
}
extend(CPhantom, CMathBase);
CPhantom.prototype.init = function(props)
{
    this.props = props;
    this.setDimension(1, 1);
    this.setContent();
}
CPhantom.prototype.getPropsForWrite = function()
{
    return this.props;
}
CPhantom.prototype.getBase = function()
{
    return this.elements[0][0];
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
	Writer.WriteString2( this.elements[0][0].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.show )
    {
		Writer.WriteBool( this.show );
		Flags |= 1;
	}
	if ( undefined != this.transp )
    {
		Writer.WriteBool( this.transp );
		Flags |= 2;
	}
	if ( undefined != this.zeroAsc )
    {
		Writer.WriteBool( this.zeroAsc );
		Flags |= 4;
	}
	if ( undefined != this.zeroDesc )
    {
		Writer.WriteBool( this.zeroDesc );
		Flags |= 8;
	}
	if ( undefined != this.zeroWid )
    {
		Writer.WriteBool( this.zeroWid );
		Flags |= 16;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CPhantom.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;
		
	this.CtrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		this.show = Reader.GetBool();
	if ( Flags & 2 )
		this.transp = Reader.GetBool();
	if ( Flags & 4 )
		this.zeroAsc = Reader.GetBool();
	if ( Flags & 8 )
		this.zeroDesc = Reader.GetBool();
	if ( Flags & 16 )
		this.zeroWid = Reader.GetBool();
}
CPhantom.prototype.Get_Id = function()
{
	return this.Id;
}