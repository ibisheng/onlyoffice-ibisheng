"use strict";

function CDegreeBase(props, bInside)
{
    CDegreeBase.superclass.constructor.call(this, bInside);

    this.upBase = 0; // отступ сверху для основания
    this.upIter = 0; // отступ сверху для итератора

    this.Pr =
    {
        type:   DEGREE_SUPERSCRIPT
    };

    this.baseContent = null;
    this.iterContent = null;


    if(props !== null && typeof(props) !== "undefined")
        this.init(props);
}
Asc.extendClass(CDegreeBase, CMathBase);
CDegreeBase.prototype.init = function(props)
{
    this.setProperties(props);
    this.setDimension(1, 2);
};
CDegreeBase.prototype.fillContent = function()
{
    this.elements[0][0] = this.baseContent;
    this.elements[0][1] = this.iterContent;
};
CDegreeBase.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    //this.Set_CompiledCtrPrp(ParaMath);

    this.elements[0][0].Resize(oMeasure, this, ParaMath, RPI, ArgSize);

    var ArgSzDegr = ArgSize.Copy();
    ArgSzDegr.decrease();

    this.elements[0][1].Resize(oMeasure, this, ParaMath, RPI, ArgSzDegr);

    if(this.Pr.type === DEGREE_SUPERSCRIPT)
        this.recalculateSup(oMeasure);
    else if(this.Pr.type === DEGREE_SUBSCRIPT)
        this.recalculateSubScript(oMeasure);
};
CDegreeBase.prototype.recalculateSup = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    this.upBase = 0;
    this.upIter = 0;

    var oBase = this.elements[0][0];
    //var bBaseOnlyText = oBase.IsJustDraw() ? false : oBase.IsOnlyText();    // у Just-Draw элементов нет ф-ии IsOnlyText

    var bOneLineText = oBase.IsJustDraw() ? false : oBase.IsOneLineText();

    if(bOneLineText)
    {
        //var UpBaseline =  1.786*shCenter; // baseline итератора
        var UpBaseline = 1.65*shCenter; // baseline итератора

        // iter.height - UpBaseline - iter.ascent + base.ascent  > 2/3 * base.height

        if(iter.height - UpBaseline - iter.ascent + base.ascent  > 2/3 * base.ascent)
            this.upBase = iter.height - 2/3*base.ascent;
        else if(UpBaseline + iter.ascent > base.ascent)
            this.upBase = UpBaseline + iter.ascent - base.ascent;
        else
            this.upIter = base.ascent - UpBaseline - iter.ascent;
    }
    else
    {
        this.upBase = iter.ascent - 1.2*shCenter;
        var ascBase = base.ascent - shCenter > 0.27*mgCtrPrp.FontSize ? base.ascent - shCenter : 2/3*base.ascent;

        // ограничение для случая, когда дескент итератора >> высоты основания
        if(iter.height - this.upBase > ascBase)
            this.upBase = iter.height - ascBase;
    }


    var height = this.upBase + base.height;
    var ascent = this.upBase + base.ascent;

    // only for supScript
    if(this.IsPlhIterator())
        this.dW = 0.008*mgCtrPrp.FontSize;
    else
        this.dW = 0.01*mgCtrPrp.FontSize;

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    this.size = {width: width, height: height, ascent: ascent};
};
CDegreeBase.prototype.recalculateSubScript = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    var oBase = this.elements[0][0];
    //var bBaseOnlyText = oBase.IsJustDraw() ? false : oBase.IsOnlyText();    // у Just-Draw элементов нет ф-ии IsOnlyText

    var bOneLineText = oBase.IsJustDraw() ? false : oBase.IsOneLineText();

    if(bOneLineText)
    {
        var DownBaseline = 0.9*shCenter;

        if(iter.ascent - DownBaseline > 3/4*base.ascent)
            this.upIter = 1/4*base.ascent;
        else
            this.upIter = base.ascent + DownBaseline - iter.ascent;
    }
    else
    {
        this.upIter = base.height + 0.9*shCenter - iter.ascent;

        /*if(base.ascent - shCenter > this.upIter)
            this.upIter = base.height - base.ascent + shCenter;*/

        // ограничение для случая, когда аскент итератора >> высоты основания
        /*if(base.ascent - shCenter > this.upIter)
            this.upIter = base.ascent - shCenter;*/

        if(base.ascent - 2*shCenter > this.upIter)
            this.upIter = base.ascent - 2*shCenter;
    }

    var height = this.upIter + iter.height;
    var ascent = base.ascent;

    this.size = {width: width, height: height, ascent: ascent};
};
CDegreeBase.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent;

    var PosBase = new CMathPosition();

    PosBase.x = this.pos.x + this.GapLeft;
    PosBase.y = this.pos.y + this.upBase;

    var PosIter = new CMathPosition();

    PosIter.x = this.pos.x + this.GapLeft + this.elements[0][0].size.width + this.dW;
    PosIter.y = this.pos.y + this.upIter;

    this.elements[0][0].setPosition(PosBase, PosInfo);
    this.elements[0][1].setPosition(PosIter, PosInfo);
};
CDegreeBase.prototype.getIterator = function()
{
    return this.iterContent;
};
CDegreeBase.prototype.getUpperIterator = function()
{
    return this.iterContent;
};
CDegreeBase.prototype.getLowerIterator = function()
{
    return this.iterContent;
};
CDegreeBase.prototype.getBase = function()
{
    return this.baseContent;
};
CDegreeBase.prototype.IsPlhIterator = function()
{
    return this.iterContent.IsPlaceholder();
};
CDegreeBase.prototype.setProperties = function(props)
{
    if(props.type === DEGREE_SUPERSCRIPT || props.type === DEGREE_SUBSCRIPT)
        this.Pr.type = props.type;
    else
        this.Pr.type = DEGREE_SUPERSCRIPT;

    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
};
CDegreeBase.prototype.setBase = function(base)
{
    this.baseContent = base;
};
CDegreeBase.prototype.setIterator = function(iterator)
{
    this.iterContent = iterator;
};

function CDegree(props, bInside)
{
    this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_DEGREE;

    CDegree.superclass.constructor.call(this, props, bInside);

    this.baseContent = new CMathContent();
    this.iterContent = new CMathContent();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

    g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CDegree, CDegreeBase);
CDegree.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
};
CDegree.prototype.getPropsForWrite = function()
{
    return this.Pr;
};
CDegree.prototype.Refresh_RecalcData = function(Data)
{
};
CDegree.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong(historyitem_type_deg);
    Writer.WriteString2(this.Id);
	Writer.WriteString2(this.baseContent.Id);
	Writer.WriteString2(this.iterContent.Id);

	this.CtrPrp.Write_ToBinary(Writer);
	Writer.WriteLong( this.Pr.type );
};
CDegree.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetLong();
    this.baseContent = g_oTableId.Get_ById(Reader.GetLong());
    this.iterContent = g_oTableId.Get_ById(Reader.GetLong());

	var props = {ctrPrp: new CTextPr()};
	props.ctrPrp.Read_FromBinary(Reader);
    props.type = Reader.GetLong();

    this.init(props);
};
CDegree.prototype.Get_Id = function()
{
	return this.Id;
};

function CIterators(iterUp, iterDn)
{
    CIterators.superclass.constructor.call(this, true);

    this.lUp = 0;   // центр основания
    this.lD = 0;    // высота - центр основания
    this.upper = 0; // смещение сверху для позиции основания

    this.iterUp = iterUp;
    this.iterDn = iterDn;
}
Asc.extendClass(CIterators, CMathBase);
CIterators.prototype.init = function()
{
    this.setDimension(2, 1);
    this.elements[0][0] = this.iterUp;
    this.elements[1][0] = this.iterDn;
};
CIterators.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
};
CIterators.prototype.getLowerIterator = function()
{
    return this.elements[1][0];
};
CIterators.prototype.setUpperIterator = function(iterator)
{
    this.elements[0][0] = iterator;
};
CIterators.prototype.setLowerIterator = function(iterator)
{
    this.elements[1][0] = iterator;
};
CIterators.prototype.Get_CompiledCtrPrp = function()
{
    return this.Parent.Get_CompiledCtrPrp();
};
CIterators.prototype.alignIterators = function(mcJc)
{
    this.alignment.wdt[0] = mcJc;
};

function CDegreeSubSupBase(props, bInside)
{
    CDegreeSubSupBase.superclass.constructor.call(this, bInside);

    this.gapBase = 0;

    this.Pr =
    {
        type:       DEGREE_SubSup,
        alnScr:     false  // не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта
    };

    this.baseContent = null;
    this.iters       = new CIterators(null, null);

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);
}
Asc.extendClass(CDegreeSubSupBase, CMathBase);
CDegreeSubSupBase.prototype.init = function(props)
{
    this.setProperties(props);
    this.setDimension(1, 2);
};
CDegreeSubSupBase.prototype.fillContent = function()
{
    var oBase  = this.baseContent;
    var oIters = this.iters;

    this.setDimension(1, 2);

    oIters.init();

    oIters.lUp = 0;
    oIters.lD = 0;

    if(this.Pr.type == DEGREE_SubSup)
    {
        oIters.alignIterators(MCJC_LEFT);
        this.addMCToContent([oBase, oIters]);
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        this.addMCToContent([oIters, oBase]);
        oIters.alignIterators(MCJC_RIGHT);
    }
};
CDegreeSubSupBase.prototype.Resize = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    //this.Set_CompiledCtrPrp(ParaMath);

    var ArgSzIters = ArgSize.Copy();
    ArgSzIters.decrease();

    this.baseContent.Resize(oMeasure, this, ParaMath, RPI, ArgSize);
    this.iters.Resize(oMeasure, this, ParaMath, RPI, ArgSzIters);

    this.recalculateSize(oMeasure, RPI);
};
CDegreeSubSupBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.4;

    var iters, base;

    if(this.Pr.type == DEGREE_SubSup)
    {
        iters = this.elements[0][1];
        base  = this.elements[0][0];
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        iters = this.elements[0][0];
        base  = this.elements[0][1];
    }

    // distance for iterators

    var iterUp = iters.elements[0][0].size,
        iterDown = iters.elements[1][0].size;

    var lUp    = base.size.ascent - shCenter; // center of base
    var lDown  = base.size.height - lUp; // height - center of base

    var ctrPrpIter = iters.Get_CompiledCtrPrp();
    var shIter = this.ParaMath.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    var minGap =  0.7*shIter;

    var up, down;

    if(RPI.bNaryInline == true)
    {
        up = down = 0;
    }
    else
    {
        var upDesc = 0,
            downAsc = 0;

        if(!base.IsJustDraw() && base.IsOneLineText())
        {
            upDesc = 1.5*shIter;
            downAsc = 1.2*shIter;
        }
        else
        {
            upDesc = iterUp.height - iterUp.ascent + shIter;
            downAsc = iterDown.ascent - shIter;
        }

        up = lUp > upDesc ? lUp - upDesc : 0;     // расстояние от центра основания до верхнего итератора
        down = lDown > downAsc ? lDown - downAsc : 0;   // расстояние от центра основания до нижнего итератора
    }



    if(up + down > minGap)
    {
        this.gapBase = iterUp.height + up - lUp;
        iters.dH = up + down;
    }
    else
    {
        iters.dH = minGap;
        this.gapBase = iterUp.height - lUp + minGap/2;
    }

    iters.recalculateSize(oMeasure);

    var width  = iters.size.width + base.size.width + this.dW;
    width += this.GapLeft + this.GapRight;
    var height = iters.size.height;

    var ascent = base.size.ascent + this.gapBase;

    this.size = {width: width, height: height, ascent: ascent};

};
CDegreeSubSupBase.prototype.align = function(x, y)
{
    var _x = 0, _y = 0;

    if(this.Pr.type == DEGREE_SubSup)
    {
        if(x == 0 && y == 0)
            _y = this.gapBase;
    }
    else
    {
        if(x == 0 && y == 1)
            _y = this.gapBase;
    }

    return {x: _x, y: _y};
};
CDegreeSubSupBase.prototype.getBase = function()
{
    return this.baseContent;
};
CDegreeSubSupBase.prototype.getUpperIterator = function()
{
    return this.iters.iterUp;
};
CDegreeSubSupBase.prototype.getLowerIterator = function()
{
    return this.iters.iterDn;
};
CDegreeSubSupBase.prototype.setBase = function(base)
{
    this.baseContent = base;
};
CDegreeSubSupBase.prototype.setUpperIterator = function(iterator)
{
    this.iters.iterUp = iterator;
};
CDegreeSubSupBase.prototype.setLowerIterator = function(iterator)
{
    this.iters.iterDn = iterator;
};
CDegreeSubSupBase.prototype.setProperties = function(props)
{
    if(props.alnScr === true || props.alnScr === 1)
        this.Pr.alnScr = true;
    else if(props.alnScr === false || props.alnScr === 0)
        this.Pr.alnScr = false;

    if(props.type === DEGREE_SubSup || props.type === DEGREE_PreSubSup)
        this.Pr.type = props.type;

    this.setCtrPrp(props.ctrPrp);

    this.RecalcInfo.bProps = true;
};

function CDegreeSubSup(props, bInside)
{
    this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_DEGREESubSup;

    CDegreeSubSup.superclass.constructor.call(this, props, bInside);

    this.baseContent = new CMathContent();
    this.iters       = new CIterators(new CMathContent(), new CMathContent());

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

    g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CDegreeSubSup, CDegreeSubSupBase);
CDegreeSubSup.prototype.init = function(props)
{
    this.setProperties(props);
    this.fillContent();
};
CDegreeSubSup.prototype.getPropsForWrite = function()
{
    return this.Pr;
};
CDegreeSubSup.prototype.Refresh_RecalcData = function(Data)
{
};
CDegreeSubSup.prototype.Write_ToBinary2 = function( Writer )
{
    Writer.WriteLong( historyitem_type_deg_subsup );
    Writer.WriteString2(this.Id);
    Writer.WriteString2(this.baseContent.Id);
    Writer.WriteString2(this.iters.iterDn.Id);
    Writer.WriteString2(this.iters.iterUp.Id);

    this.CtrPrp.Write_ToBinary(Writer);
    Writer.WriteLong( this.Pr.type );
    if ( this.Pr.type == DEGREE_SubSup )
    {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if ( undefined != this.Pr.alnScr )
        {
            Writer.WriteBool( this.Pr.alnScr );
            Flags |= 1;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Flags );
        Writer.Seek( EndPos );
    }
};
CDegreeSubSup.prototype.Read_FromBinary2 = function( Reader )
{
    this.Id = Reader.GetString2();

    this.baseContent  = g_oTableId.Get_ById(Reader.GetString2());
    this.iters.iterDn = g_oTableId.Get_ById(Reader.GetString2());
    this.iters.iterUp = g_oTableId.Get_ById(Reader.GetString2());

    var props = {ctrPrp: new CTextPr()};
    props.ctrPrp.Read_FromBinary(Reader);
    props.type = Reader.GetLong();
    if ( props.type == DEGREE_SubSup )
    {
        var Flags = Reader.GetLong();
        if ( Flags & 1 )
            props.alnScr = Reader.GetBool();
    }

    this.init(props);
    this.iters.init();
};
CDegreeSubSup.prototype.Get_Id = function()
{
    return this.Id;
};
