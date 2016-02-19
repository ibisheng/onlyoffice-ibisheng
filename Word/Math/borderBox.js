"use strict";

function CMathBreak()
{
    this.alnAt = undefined;
}
CMathBreak.prototype.Set_FromObject = function(Obj)
{
    if(Obj.alnAt !== undefined && Obj.alnAt !== null && Obj.alnAt - 0 == Obj.alnAt)
    {
        if(Obj.alnAt >= 1 && Obj.alnAt <= 255)
            this.alnAt = Obj.alnAt;
    }
};
CMathBreak.prototype.Copy = function()
{
    var NewMBreak = new CMathBreak();
    NewMBreak.alnAt = this.alnAt;

    return NewMBreak;
};
CMathBreak.prototype.Get_AlignBrk = function()
{
    return this.alnAt !== undefined ? this.alnAt : 0;
};
CMathBreak.prototype.Get_AlnAt = function()
{
    return this.alnAt;
};
CMathBreak.prototype.Displace = function(isForward)
{
    if(isForward == false)
    {
        if(this.alnAt == 1)
            this.alnAt = undefined;
        else if(this.alnAt !== undefined)
            this.alnAt--;
    }
    else
    {
        if(this.alnAt == undefined)
            this.alnAt = 1;
        else if(this.alnAt < 255)
            this.alnAt++;
    }
};
CMathBreak.prototype.Apply_AlnAt = function(alnAt)
{
    if(alnAt == undefined)
    {
        this.alnAt = undefined;
    }
    else if(alnAt >= 1 && alnAt <= 255)
    {
        this.alnAt = alnAt;
    }
};
CMathBreak.prototype.Write_ToBinary = function(Writer)
{
    if(this.alnAt !== undefined)
    {
        Writer.WriteBool(false);
        Writer.WriteByte(this.alnAt);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CMathBreak.prototype.Read_FromBinary = function(Reader)
{
    if(Reader.GetBool() == false)
    {
        this.alnAt = Reader.GetByte();
    }
    else
    {
        this.alnAt = undefined;
    }
};


function CMathBorderBoxPr()
{
    this.hideBot    = false;
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

    this.hideBot    = Reader.GetBool();
    this.hideLeft   = Reader.GetBool();
    this.hideRight  = Reader.GetBool();
    this.hideTop    = Reader.GetBool();
    this.strikeBLTR = Reader.GetBool();
    this.strikeH    = Reader.GetBool();
    this.strikeTLBR = Reader.GetBool();
    this.strikeV    = Reader.GetBool();
};

/**
 *
 * @param props
 * @constructor
 * @extends {CMathBase}
 */
function CBorderBox(props)
{
    CBorderBox.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.gapBrd = 0;

    this.Pr = new CMathBorderBoxPr();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CBorderBox, CMathBase);
CBorderBox.prototype.ClassType = historyitem_type_borderBox;
CBorderBox.prototype.kind      = MATH_BORDER_BOX;
CBorderBox.prototype.init = function(props)
{
    this.Fill_LogicalContent(1);

    this.setProperties(props);
    this.fillContent();
};
CBorderBox.prototype.getBase = function()
{
    return this.Content[0];
};
CBorderBox.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBorderBox.prototype.recalculateSize = function()
{
    var base = this.elements[0][0].size;

    var width = base.width;
    var height = base.height;
    var ascent = base.ascent;

    this.gapBrd = this.Get_TxtPrControlLetter().FontSize*0.08104587131076388;

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

    this.size.width  = width;
    this.size.height = height;
    this.size.ascent = ascent;
};
CBorderBox.prototype.Draw_Elements = function(PDSE)
{
    var _X = PDSE.X;

    this.Content[0].Draw_Elements(PDSE);

    var penW = this.Get_TxtPrControlLetter().FontSize*0.02;

    var Width  = this.size.width - this.GapLeft - this.GapRight,
        Height = this.size.height;

    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line, PDSE.Range);

    var X = this.pos.x + PosLine.x + this.GapLeft,
        Y = this.pos.y + PosLine.y;

    var oCompiledPr = this.Get_CompiledCtrPrp();

    this.Make_ShdColor(PDSE, oCompiledPr);

    if(!this.Pr.hideTop)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y;

        PDSE.Graphics.drawHorLine(0, y1, x1, x2, penW, true);
    }

    if(!this.Pr.hideBot)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y + Height;

        PDSE.Graphics.drawHorLine(2, y1, x1, x2, penW, true);
    }

    if(!this.Pr.hideLeft)
    {
        var x1 = X,
            y1 = Y,
            y2 = Y + Height;

        PDSE.Graphics.drawVerLine(0, x1, y1, y2, penW, true);
    }

    if(!this.Pr.hideRight)
    {
        var x1 = X + Width,
            y1 = Y,
            y2 = Y + Height;

        PDSE.Graphics.drawVerLine(2, x1, y1, y2, penW, true);
    }

    if(this.Pr.strikeTLBR)  // left diagonal
    {
        if(penW < 0.3)
        {
            var x1 = X, y1 = Y,
                x2 = X + Width, y2 = Y + Height;

            PDSE.Graphics.p_width(180);

            PDSE.Graphics._s();
            PDSE.Graphics._m(x1, y1);
            PDSE.Graphics._l(x2, y2);
            PDSE.Graphics.ds();
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

            PDSE.Graphics.p_width(1000);

            PDSE.Graphics._s();
            PDSE.Graphics._m(x1, y1);
            PDSE.Graphics._l(x2, y2);
            PDSE.Graphics._l(x3, y3);
            PDSE.Graphics._l(x4, y4);
            PDSE.Graphics._l(x5, y5);
            PDSE.Graphics._l(x6, y6);
            PDSE.Graphics._l(x7, y7);
            PDSE.Graphics.df();
        }
    }

    if(this.Pr.strikeBLTR) // right diagonal
    {
        if(penW < 0.3)
        {
            var x1 = X + Width,      y1 = Y,
                x2 = X,              y2 = Y + Height;

            PDSE.Graphics.p_width(180);

            PDSE.Graphics._s();
            PDSE.Graphics._m(x1, y1);
            PDSE.Graphics._l(x2, y2);
            PDSE.Graphics.ds();
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


            PDSE.Graphics.p_width(1000);

            PDSE.Graphics._s();
            PDSE.Graphics._m(x1, y1);
            PDSE.Graphics._l(x2, y2);
            PDSE.Graphics._l(x3, y3);
            PDSE.Graphics._l(x4, y4);
            PDSE.Graphics._l(x5, y5);
            PDSE.Graphics._l(x6, y6);
            PDSE.Graphics._l(x7, y7);
            PDSE.Graphics.df();
        }
    }

    if(this.Pr.strikeH)
    {
        var x1 = X,
            x2 = X + Width,
            y1 = Y + Height/2 - penW/2;

        PDSE.Graphics.drawHorLine(0, y1, x1, x2, penW);
    }

    if(this.Pr.strikeV)
    {
        var x1 = X + Width/2 - penW/2,
            y1 = Y,
            y2 = Y + Height;

        PDSE.Graphics.drawVerLine(0, x1, y1, y2, penW, true);
    }

    PDSE.X = _X + this.size.width;
};
CBorderBox.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;

    this.UpdatePosBound(pos, PosInfo);

    var NewPos = new CMathPosition();

    var Base = this.Content[0];

    if(this.Pr.hideLeft == false)
        NewPos.x = this.pos.x + this.GapLeft + this.gapBrd;
    else
        NewPos.x = this.pos.x + this.GapLeft;


    if(this.Pr.hideTop == false)
        NewPos.y = this.pos.y + this.gapBrd + Base.size.ascent;
    else
        NewPos.y = this.pos.y + Base.size.ascent;

    Base.setPosition(NewPos, PosInfo);

    pos.x += this.size.width;
};
CBorderBox.prototype.Apply_MenuProps = function(Props)
{
    if(Props.Type == c_oAscMathInterfaceType.BorderBox)
    {
        if(Props.HideTop !== undefined && Props.HideTop !== this.Pr.hideTop)
        {
            History.Add(this, new CChangesMathBorderBoxTop(Props.HideTop, this.Pr.hideTop));
            this.raw_SetTop(Props.HideTop);
        }

        if(Props.HideBottom !== undefined && Props.HideBottom !== this.Pr.hideBot)
        {
            History.Add(this, new CChangesMathBorderBoxBot(Props.HideBottom, this.Pr.hideBot));
            this.raw_SetBot(Props.HideBottom);
        }

        if(Props.HideLeft !== undefined && Props.HideLeft !== this.Pr.hideLeft)
        {
            History.Add(this, new CChangesMathBorderBoxLeft(Props.HideLeft, this.Pr.hideLeft));
            this.raw_SetLeft(Props.HideLeft);
        }

        if(Props.HideRight !== undefined && Props.HideRight !== this.Pr.hideRight)
        {
            History.Add(this, new CChangesMathBorderBoxRight(Props.HideRight, this.Pr.hideRight));
            this.raw_SetRight(Props.HideRight);
        }

        if(Props.HideHor !== undefined && Props.HideHor == this.Pr.strikeH) // strikeH - нарисовать горизонтальную линию
        {
            History.Add(this, new CChangesMathBorderBoxHor(!Props.HideHor, this.Pr.strikeH));
            this.raw_SetHor(!Props.HideHor);
        }

        if(Props.HideVer !== undefined && Props.HideVer == this.Pr.strikeV) // strikeV - нарисовать вертикальную линию
        {
            History.Add(this, new CChangesMathBorderBoxVer(!Props.HideVer, this.Pr.strikeV));
            this.raw_SetVer(!Props.HideVer);
        }

        if(Props.HideTopLTR !== undefined && Props.HideTopLTR == this.Pr.strikeTLBR) // strikeTLBR - нарисовать диагональ из верхнего угла слева направо
        {
            History.Add(this, new CChangesMathBorderBoxTopLTR(!Props.HideTopLTR, this.Pr.strikeTLBR));
            this.raw_SetTopLTR(!Props.HideTopLTR );
        }

        if(Props.HideTopRTL !== undefined && Props.HideTopRTL == this.Pr.strikeBLTR)
        {
            History.Add(this, new CChangesMathBorderBoxTopRTL(!Props.HideTopRTL, this.Pr.strikeBLTR)); // strikeBLTR - нарисовать диагональ из нижнего угла слева направо
            this.raw_SetTopRTL(!Props.HideTopRTL);
        }
    }
};
CBorderBox.prototype.raw_SetTop = function(Value)
{
    this.Pr.hideTop = Value;
};
CBorderBox.prototype.raw_SetBot = function(Value)
{
    this.Pr.hideBot = Value;
};
CBorderBox.prototype.raw_SetLeft = function(Value)
{
    this.Pr.hideLeft = Value;
};
CBorderBox.prototype.raw_SetRight = function(Value)
{
    this.Pr.hideRight = Value;
};
CBorderBox.prototype.raw_SetHor = function(Value)
{
    this.Pr.strikeH = Value;
};
CBorderBox.prototype.raw_SetVer = function(Value)
{
    this.Pr.strikeV = Value;
};
CBorderBox.prototype.raw_SetTopLTR = function(Value)
{
    this.Pr.strikeTLBR = Value;
};
CBorderBox.prototype.raw_SetTopRTL = function(Value)
{
    this.Pr.strikeBLTR = Value;
};
CBorderBox.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuBorderBox(this);
};

/**
 *
 * @param CMathMenuBorderBox
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuBorderBox(BorderBox)
{
    CMathMenuBorderBox.superclass.constructor.call(this, BorderBox);

    this.Type = c_oAscMathInterfaceType.BorderBox;

    if(undefined !== BorderBox)
    {
        this.HideTop    = BorderBox.Pr.hideTop;
        this.HideBottom = BorderBox.Pr.hideBot;
        this.HideLeft   = BorderBox.Pr.hideLeft;
        this.HideRight  = BorderBox.Pr.hideRight;
        this.HideHor    = BorderBox.Pr.strikeH == false;
        this.HideVer    = BorderBox.Pr.strikeV == false;
        this.HideTopLTR = BorderBox.Pr.strikeTLBR == false;
        this.HideTopRTL = BorderBox.Pr.strikeBLTR == false;
    }
    else
    {
        this.HideTop    = undefined;
        this.HideBottom = undefined;
        this.HideLeft   = undefined;
        this.HideRight  = undefined;
        this.HideHor    = undefined;
        this.HideVer    = undefined;
        this.HideTopLTR = undefined;
        this.HideTopRTL = undefined;
    }
}
Asc.extendClass(CMathMenuBorderBox, CMathMenuBase);
CMathMenuBorderBox.prototype.get_HideTop = function(){return this.HideTop;};
CMathMenuBorderBox.prototype.put_HideTop = function(bHideTop){this.HideTop = bHideTop;};
CMathMenuBorderBox.prototype.get_HideBottom = function(){return this.HideBottom;};
CMathMenuBorderBox.prototype.put_HideBottom = function(bHideBottom){this.HideBottom = bHideBottom;};
CMathMenuBorderBox.prototype.get_HideLeft = function(){return this.HideLeft;};
CMathMenuBorderBox.prototype.put_HideLeft = function(bHideLeft){this.HideLeft = bHideLeft;};
CMathMenuBorderBox.prototype.get_HideRight = function(){return this.HideRight;};
CMathMenuBorderBox.prototype.put_HideRight = function(bHideRight){this.HideRight = bHideRight;};
CMathMenuBorderBox.prototype.get_HideHor = function(){return this.HideHor;};
CMathMenuBorderBox.prototype.put_HideHor = function(bHideHor){this.HideHor = bHideHor;};
CMathMenuBorderBox.prototype.get_HideVer = function(){return this.HideVer;};
CMathMenuBorderBox.prototype.put_HideVer = function(bHideVer){this.HideVer = bHideVer;};
CMathMenuBorderBox.prototype.get_HideTopLTR = function(){return this.HideTopLTR;};
CMathMenuBorderBox.prototype.put_HideTopLTR = function(bHideTopLTR){this.HideTopLTR = bHideTopLTR;};
CMathMenuBorderBox.prototype.get_HideTopRTL = function(){return this.HideTopRTL;};
CMathMenuBorderBox.prototype.put_HideTopRTL = function(bHideTopRTL){this.HideTopRTL = bHideTopRTL;};

window["CMathMenuBorderBox"]                   = CMathMenuBorderBox;
CMathMenuBorderBox.prototype["get_HideTop"]    = CMathMenuBorderBox.prototype.get_HideTop;
CMathMenuBorderBox.prototype["put_HideTop"]    = CMathMenuBorderBox.prototype.put_HideTop;
CMathMenuBorderBox.prototype["get_HideBottom"] = CMathMenuBorderBox.prototype.get_HideBottom;
CMathMenuBorderBox.prototype["put_HideBottom"] = CMathMenuBorderBox.prototype.put_HideBottom;
CMathMenuBorderBox.prototype["get_HideLeft"]   = CMathMenuBorderBox.prototype.get_HideLeft;
CMathMenuBorderBox.prototype["put_HideLeft"]   = CMathMenuBorderBox.prototype.put_HideLeft;
CMathMenuBorderBox.prototype["get_HideRight"]  = CMathMenuBorderBox.prototype.get_HideRight;
CMathMenuBorderBox.prototype["put_HideRight"]  = CMathMenuBorderBox.prototype.put_HideRight;
CMathMenuBorderBox.prototype["get_HideHor"]    = CMathMenuBorderBox.prototype.get_HideHor;
CMathMenuBorderBox.prototype["put_HideHor"]    = CMathMenuBorderBox.prototype.put_HideHor;
CMathMenuBorderBox.prototype["get_HideVer"]    = CMathMenuBorderBox.prototype.get_HideVer;
CMathMenuBorderBox.prototype["put_HideVer"]    = CMathMenuBorderBox.prototype.put_HideVer;
CMathMenuBorderBox.prototype["get_HideTopLTR"] = CMathMenuBorderBox.prototype.get_HideTopLTR;
CMathMenuBorderBox.prototype["put_HideTopLTR"] = CMathMenuBorderBox.prototype.put_HideTopLTR;
CMathMenuBorderBox.prototype["get_HideTopRTL"] = CMathMenuBorderBox.prototype.get_HideTopRTL;
CMathMenuBorderBox.prototype["put_HideTopRTL"] = CMathMenuBorderBox.prototype.put_HideTopRTL;



function CMathBoxPr()
{
    this.brk     = undefined;
    this.aln     = false;
    this.diff    = false;
    this.noBreak = false;
    this.opEmu   = false;
}
CMathBoxPr.prototype.Set_FromObject = function(Obj)
{
    if(true === Obj.aln || 1 === Obj.aln)
        this.aln = true;
    else
        this.aln = false;

    if(Obj.brk !== null && Obj.brk !== undefined)
    {
        this.brk = new CMathBreak();
        this.brk.Set_FromObject(Obj.brk);
    }

    if(true === Obj.diff || 1 === Obj.diff)
        this.diff = true;
    else
        this.diff = false;

    if(true === Obj.noBreak || 1 === Obj.noBreak)
        this.noBreak = true;
    else
        this.noBreak = false;

    if(true === Obj.opEmu || 1 === Obj.opEmu || Obj.opEmu === null) // null - val attribute is absent
        this.opEmu = true;
    else
        this.opEmu = false;
};
CMathBoxPr.prototype.Get_AlignBrk = function()
{
    return this.brk !== undefined ? this.brk.Get_AlignBrk() : 0;
};
CMathBoxPr.prototype.Get_AlnAt = function()
{
    return this.brk != undefined ? this.brk.Get_AlnAt() : undefined;
};
CMathBoxPr.prototype.Displace_Break = function(isForward)
{
    if(this.brk !== undefined)
    {
        this.brk.Displace(isForward);
    }
};
CMathBoxPr.prototype.Apply_AlnAt = function(alnAt)
{
    if(this.brk !== undefined)
    {
        this.brk.Apply_AlnAt(alnAt);
    }
};
CMathBoxPr.prototype.IsForcedBreak = function()
{
    return this.opEmu == true && this.brk !== undefined;
};
CMathBoxPr.prototype.Insert_ForcedBreak = function()
{
    if(false == this.IsForcedBreak())
    {
        this.brk = new CMathBreak();
    }
};
CMathBoxPr.prototype.Delete_ForcedBreak = function()
{
    if(true == this.IsForcedBreak())
    {
        this.brk = undefined;
    }
};
CMathBoxPr.prototype.Copy = function()
{
    var NewPr = new CMathBoxPr();

    NewPr.aln     = this.aln    ;
    NewPr.diff    = this.diff   ;
    NewPr.noBreak = this.noBreak;
    NewPr.opEmu   = this.opEmu  ;

    if(this.brk !== undefined)
        NewPr.brk = this.brk.Copy();

    return NewPr;
};
CMathBoxPr.prototype.Write_ToBinary = function(Writer)
{
    // Bool : aln
    // Bool : brk
    // Bool : diff
    // Bool : noBreak
    // Bool : opEmu

    Writer.WriteBool(this.aln);
    Writer.WriteBool(this.diff);
    Writer.WriteBool(this.noBreak);
    Writer.WriteBool(this.opEmu);

    if ( undefined !== this.brk )
    {
        Writer.WriteBool(false);
        this.brk.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CMathBoxPr.prototype.Read_FromBinary = function(Reader)
{
    // Bool : aln
    // Bool : brk
    // Bool : diff
    // Bool : noBreak
    // Bool : opEmu

    this.aln     = Reader.GetBool();
    this.diff    = Reader.GetBool();
    this.noBreak = Reader.GetBool();
    this.opEmu   = Reader.GetBool();

    if(Reader.GetBool() == false)
    {
        this.brk = new CMathBreak();
        this.brk.Read_FromBinary(Reader);
    }
    else
    {
        this.brk = undefined;
    }
};

/**
 *
 * @param props
 * @constructor
 * @extends {CMathBase}
 */
function CBox(props)
{
    CBox.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathBoxPr();

    this.baseContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CBox, CMathBase);
CBox.prototype.ClassType = historyitem_type_box;
CBox.prototype.kind      = MATH_BOX;
CBox.prototype.init = function(props)
{
    this.Fill_LogicalContent(1);

    this.setProperties(props);
    this.fillContent();
};
CBox.prototype.fillContent = function()
{
    if(this.Pr.opEmu == false && this.Pr.noBreak == false)
    {
        this.NeedBreakContent(0);
    }
    else
    {
        this.bCanBreak = false;
    }

    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBox.prototype.getBase = function()
{
    return this.Content[0];
};
CBox.prototype.UpdatePRS_OneLine = function(PRS, WordLen, MathFirstItem)
{
    PRS.WordLen   = WordLen;
    PRS.MathFirstItem = MathFirstItem; // вернем MathFirstItem, который был до расчета Box, т.к . при расчете он мог измениться (при наличии внутри Box др мат объектов)
};
CBox.prototype.IsOperatorEmulator = function()
{
    return this.Pr.opEmu == true;
};
CBox.prototype.IsForcedBreak = function()
{
    var bInline = this.ParaMath.Is_Inline();

    return bInline == false && this.Pr.IsForcedBreak();
};
CBox.prototype.Get_AlignBrk = function()
{
    return this.Pr.Get_AlignBrk();
};
CBox.prototype.Displace_BreakOperator = function(_CurLine, _CurRange, isForward, CountOperators)
{
    if(this.Pr.brk !== undefined)
    {
        var AlnAt = this.Pr.Get_AlnAt();

        var NotIncrease = AlnAt == CountOperators && isForward == true;

        if(NotIncrease == false)
        {
            this.Pr.Displace_Break(isForward);

            var NewAlnAt = this.Pr.Get_AlnAt();

            if(AlnAt !== NewAlnAt)
            {
                History.Add(this, new CChangesMathBoxAlnAt(NewAlnAt, AlnAt));
            }
        }
    }
};
CBox.prototype.raw_setAlnAt = function(Value)
{
    this.Pr.Apply_AlnAt(Value);
};
CBox.prototype.Can_ModifyArgSize = function()
{
    return false === this.Is_SelectInside();
};
CBox.prototype.Apply_MenuProps = function(Props)
{
    // не проверяем изменения на тип !
    // потому что может прийти свойства из другого (вложенного в Box) мат объекта, но при этом есть возможность вставить/удалить  принудительный перенос для Box

    if(Props.Action & c_oMathMenuAction.InsertForcedBreak && true == this.Can_InsertForcedBreak())
    {
        History.Add(this, new CChangesMathBoxForcedBreak(true, false));
        this.raw_ForcedBreak(true);
    }

    if(Props.Action & c_oMathMenuAction.DeleteForcedBreak && true == this.Can_DeleteForcedBreak())
    {
        History.Add(this, new CChangesMathBoxForcedBreak(false, true));
        this.raw_ForcedBreak(false);
    }
};
CBox.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuBox(this);
};
CBox.prototype.Can_InsertForcedBreak = function()
{
    return false === this.IsForcedBreak();
};
CBox.prototype.Can_DeleteForcedBreak = function()
{
    return this.IsForcedBreak();
};
CBox.prototype.raw_ForcedBreak = function(InsertBreak)
{
    if(InsertBreak)
    {
        this.Pr.Insert_ForcedBreak();
    }
    else
    {
        this.Pr.Delete_ForcedBreak();
    }
};
CBox.prototype.Can_ModifyForcedBreak = function(Pr)
{
    if(true == this.Can_InsertForcedBreak())
    {
        Pr.Set_InsertForcedBreak();
    }
    else
    {
        Pr.Set_DeleteForcedBreak();
    }
};
CBox.prototype.Apply_ForcedBreak = function(Props)
{
    this.Apply_MenuProps(Props);

    // исключаем из Props, чтобы не применить к операторам внути Box
    // иначе при Drag'n'Drop оператора получим неочевидный результат :  принудительный перенос
    if(Props.Action & c_oMathMenuAction.InsertForcedBreak)
        Props.Action ^= c_oMathMenuAction.InsertForcedBreak;

    if(Props.Action & c_oMathMenuAction.DeleteForcedBreak)
        Props.Action ^= c_oMathMenuAction.DeleteForcedBreak;
};

/**
 *
 * @param CMathMenuBox
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuBox(Box)
{
    CMathMenuBox.superclass.constructor.call(this, Box);

    this.Type = c_oAscMathInterfaceType.Box;
}
Asc.extendClass(CMathMenuBox, CMathMenuBase);
window["CMathMenuBox"] = CMathMenuBox;

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

/**
 *
 * @param props
 * @constructor
 * @extends {CCharacter}
 */
function CBar(props)
{
    CBar.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathBarPr();

    this.operator = new COperator(OPER_BAR);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CBar, CCharacter);
CBar.prototype.ClassType = historyitem_type_bar;
CBar.prototype.kind      = MATH_BAR;
CBar.prototype.init = function(props)
{
    this.Fill_LogicalContent(1);

    this.setProperties(props);
    this.fillContent();
};
CBar.prototype.getBase = function()
{
    return this.Content[0];
};
CBar.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBar.prototype.ApplyProperties = function(RPI)
{
    if(this.RecalcInfo.bProps == true)
    {
        var prp = {loc:    this.Pr.pos, type:   DELIMITER_LINE };

        var defaultProps = { loc:   LOCATION_BOT};

        this.setCharacter(prp, defaultProps);
        this.RecalcInfo.bProps = false;
    }
};
CBar.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.ApplyProperties(RPI);
    this.operator.PreRecalc(this, ParaMath);

    CBar.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, RPI, GapsInfo);
};
CBar.prototype.getAscent = function()
{
    var ascent;

    if(this.Pr.pos === LOCATION_TOP )
        ascent = this.operator.size.height + this.elements[0][0].size.ascent;
    else if(this.Pr.pos === LOCATION_BOT )
        ascent = this.elements[0][0].size.ascent;

    return ascent;
};
CBar.prototype.Apply_MenuProps = function(Props)
{
    if(Props.Type == c_oAscMathInterfaceType.Bar && Props.Pos !== undefined)
    {
        var Pos = Props.Pos == c_oAscMathInterfaceBarPos.Bottom ? LOCATION_BOT : LOCATION_TOP;

        if(Pos !== this.Pr.pos)
        {
            History.Add(this, new CChangesMathBarLinePos(Pos, this.Pr.pos));
            this.raw_SetLinePos(Pos);
        }
    }
};
CBar.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuBar(this);
};
CBar.prototype.raw_SetLinePos = function(Value)
{
    this.Pr.pos = Value;
    this.RecalcInfo.bProps = true;
    this.ApplyProperties();
};

/**
 *
 * @param CMathMenuBar
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuBar(Bar)
{
    CMathMenuBar.superclass.constructor.call(this, Bar);

    this.Type   = c_oAscMathInterfaceType.Bar;

    if (undefined !== Bar)
    {
        this.Pos = Bar.Pr.pos == LOCATION_BOT ? c_oAscMathInterfaceBarPos.Bottom : c_oAscMathInterfaceBarPos.Top;
    }
    else
    {
        this.Pos = undefined;
    }
}
Asc.extendClass(CMathMenuBar, CMathMenuBase);

CMathMenuBar.prototype.get_Pos = function(){return this.Pos};
CMathMenuBar.prototype.put_Pos = function(Pos){this.Pos = Pos;};

window["CMathMenuBar"] = CMathMenuBar;
CMathMenuBar.prototype["get_Pos"] = CMathMenuBar.prototype.get_Pos;
CMathMenuBar.prototype["put_Pos"] = CMathMenuBar.prototype.put_Pos;

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

    Writer.WriteBool(this.show);
    Writer.WriteBool(this.transp);
    Writer.WriteBool(this.zeroAsc);
    Writer.WriteBool(this.zeroDesc);
    Writer.WriteBool(this.zeroWid);
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

/**
 *
 * @param props
 * @constructor
 * @extends {CMathBase}
 */
function CPhantom(props)
{
    CPhantom.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathPhantomPr();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CPhantom, CMathBase);
CPhantom.prototype.ClassType = historyitem_type_phant;
CPhantom.prototype.kind      = MATH_PHANTOM;
CPhantom.prototype.init = function(props)
{
    this.Fill_LogicalContent(1);

    this.setProperties(props);
    this.fillContent();
};
CPhantom.prototype.getBase = function()
{
    return this.Content[0];
};
CPhantom.prototype.fillContent = function()
{
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};