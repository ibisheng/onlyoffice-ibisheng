"use strict";

function CMathDegreePr()
{
    this.type = DEGREE_SUPERSCRIPT;
}

CMathDegreePr.prototype.Set_FromObject = function(Obj)
{
    if (DEGREE_SUPERSCRIPT === Obj.type || DEGREE_SUBSCRIPT === Obj.type)
        this.type = Obj.type;
    else
        this.type = DEGREE_SUPERSCRIPT;
};

CMathDegreePr.prototype.Copy = function()
{
    var NewPr = new CMathDegreePr();
    NewPr.type = this.type;
    return NewPr;
};

CMathDegreePr.prototype.Write_ToBinary = function(Writer)
{
    // Long : type
    Writer.WriteLong(this.type);
};

CMathDegreePr.prototype.Read_FromBinary = function(Reader)
{
    // Long : type
    this.type = Reader.GetLong(Reader);
};

function CDegreeBase(props, bInside)
{
    CDegreeBase.superclass.constructor.call(this, bInside);

    this.upBase = 0; // отступ сверху для основания
    this.upIter = 0; // отступ сверху для итератора

    this.Pr = new CMathDegreePr();

    this.baseContent = null;
    this.iterContent = null;

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);
        //CDegreeBase.prototype.init.call(this, props);
}
Asc.extendClass(CDegreeBase, CMathBase);
CDegreeBase.prototype.init = function(props)
{
    this.setProperties(props);
    this.setDimension(1, 2);
};
CDegreeBase.prototype.fillContent = function()
{
    this.setDimension(1, 2);
    this.elements[0][0] = this.baseContent;
    this.elements[0][1] = this.iterContent;
};
CDegreeBase.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    this.Set_CompiledCtrPrp(Parent, ParaMath);

    this.ApplyProperties(RPI);

    if(this.bInside == false)
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);

    this.baseContent.PreRecalc(this, ParaMath, ArgSize, RPI);

    var ArgSzDegr = ArgSize.Copy();
    ArgSzDegr.decrease();

    var RPIDegr = RPI.Copy();
    RPIDegr.bDecreasedComp = true;

    this.iterContent.PreRecalc(this, ParaMath, ArgSzDegr, RPIDegr);
}
CDegreeBase.prototype.Resize = function(oMeasure, RPI)
{
    //this.Parent = Parent;
    //this.ParaMath = ParaMath;

    //this.Set_CompiledCtrPrp(ParaMath);

    this.baseContent.Resize(oMeasure, RPI);

    //var ArgSzDegr = ArgSize.Copy();
    //ArgSzDegr.decrease();

    this.iterContent.Resize(oMeasure, RPI);

    if(this.Pr.type === DEGREE_SUPERSCRIPT)
        this.recalculateSup(oMeasure);
    else if(this.Pr.type === DEGREE_SUBSCRIPT)
        this.recalculateSubScript(oMeasure);
};
CDegreeBase.prototype.recalculateSup = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.GetTPrpToControlLetter();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    this.upBase = 0;
    this.upIter = 0;

    var oBase = this.elements[0][0];

    var bOneLineText = oBase.IsJustDraw() ? false : oBase.IsOneLineText();

    if(bOneLineText)
    {
        var UpBaseline = 1.65*shCenter; // baseline итератора

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

    var mgCtrPrp = this.GetTPrpToControlLetter();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    var oBase = this.elements[0][0];
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
    CDegree.superclass.constructor.call(this, props, bInside);

    this.Id = g_oIdCounter.Get_NewId();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

    g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CDegree, CDegreeBase);

CDegree.prototype.ClassType = historyitem_type_deg;
CDegree.prototype.kind      = MATH_DEGREE;

CDegree.prototype.init = function(props)
{
    this.Fill_LogicalContent(2);

    this.setProperties(props);
    this.fillContent();
};
CDegree.prototype.fillContent = function()
{
    this.iterContent = this.Content[1];
    this.baseContent = this.Content[0];

    CDegree.superclass.fillContent.apply(this, arguments);
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
CIterators.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    this.ArgSize.SetValue(-1);

    var ArgSzIters = ArgSize.Copy();
    ArgSzIters.Merge(this.ArgSize);

    this.Set_CompiledCtrPrp(Parent, ParaMath);

    var RPI_ITER = RPI.Copy();
    RPI_ITER.bDecreasedComp = true;

    this.iterUp.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
    this.iterDn.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
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
CIterators.prototype.alignIterators = function(mcJc)
{
    this.alignment.wdt[0] = mcJc;
};

function CMathDegreeSubSupPr()
{
    this.type   = DEGREE_SubSup;
    this.alnScr = false;// не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта
}

CMathDegreeSubSupPr.prototype.Set_FromObject = function(Obj)
{
    if (true === Obj.alnScr || 1 === Obj.alnScr)
        this.alnScr = true;
    else
        this.alnScr = false;

    if (DEGREE_SubSup === Obj.type || DEGREE_PreSubSup === Obj.type)
        this.type = Obj.type;
};

CMathDegreeSubSupPr.prototype.Copy = function()
{
    var NewPr = new CMathDegreeSubSupPr();

    NewPr.type   = this.type;
    NewPr.alnScr = this.alnScr;

    return NewPr;
};

CMathDegreeSubSupPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : type
    // Bool : alnScr

    Writer.WriteLong(this.type);
    Writer.WriteBool(this.alnScr);
};

CMathDegreeSubSupPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : type
    // Bool : alnScr

    this.type   = Reader.GetLong();
    this.alnScr = Reader.GetBool();
};


function CDegreeSubSupBase(props, bInside)
{
    CDegreeSubSupBase.superclass.constructor.call(this, bInside);

    this.gapBase = 0;
    this.bNaryInline = false;

    this.Pr = new CMathDegreeSubSupPr();

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
CDegreeSubSupBase.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.bNaryInline = RPI.bNaryInline;

    CDegreeSubSupBase.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, RPI, GapsInfo);
};
CDegreeSubSupBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    //var mgCtrPrp = this.GetTPrpToControlLetter();

    var mgCtrPrp = this.Get_CompiledCtrPrp(); // Get_CompiledCtrPrp -  чтобы итераторы не разъезжались
                                              // половину ascent брать нельзя, т.к. черта дроби будет разделительной для верхнего и нижнего итератора => соответственно
                                              // если числитель меньше/больше знаменателя расположение итераторов у степени будет неправильным

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
    //var lUp    = base.size.height/2; // center of base
    var lDown  = base.size.height - lUp; // height - center of base

    var ctrPrpIter = iters.GetTPrpToControlLetter();
    var shIter = this.ParaMath.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    var minGap =  0.7*shIter;

    var up, down;

    if(this.bNaryInline)
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

function CDegreeSubSup(props, bInside)
{
    CDegreeSubSup.superclass.constructor.call(this, props, bInside);

    this.Id = g_oIdCounter.Get_NewId();

    if(props !== null && typeof(props) !== "undefined")
        this.init(props);

    g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CDegreeSubSup, CDegreeSubSupBase);

CDegreeSubSup.prototype.ClassType = historyitem_type_deg_subsup;
CDegreeSubSup.prototype.kind      = MATH_DEGREESubSup;

CDegreeSubSup.prototype.init = function(props)
{
    this.Fill_LogicalContent(3);

    this.setProperties(props);
    this.fillContent();
};

CDegreeSubSup.prototype.fillContent = function()
{
    if (DEGREE_SubSup === this.Pr.type)
    {
        this.baseContent = this.Content[0];
        this.iters = new CIterators(this.Content[2], this.Content[1]);
    }
    else
    {
        this.baseContent = this.Content[2];
        this.iters = new CIterators(this.Content[1], this.Content[0]);
    }

    CDegreeSubSup.superclass.fillContent.apply(this, arguments);
};
