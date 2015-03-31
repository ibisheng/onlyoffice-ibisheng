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

    this.bNaryInline = false;

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

    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);

    this.ApplyProperties(RPI);

    if(this.bInside == false)
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);

    this.baseContent.PreRecalc(this, ParaMath, ArgSize, RPI);

    var ArgSzDegr = ArgSize.Copy();
    ArgSzDegr.decrease();

    var RPIDegr = RPI.Copy();
    RPIDegr.bDecreasedComp = true;

    this.bNaryInline = RPI.bNaryInline;

    this.iterContent.PreRecalc(this, ParaMath, ArgSzDegr, RPIDegr);
};
CDegreeBase.prototype.Resize = function(oMeasure, RPI)
{
    this.baseContent.Resize(oMeasure, RPI);

    this.iterContent.Resize(oMeasure, RPI);

    if(this.Pr.type === DEGREE_SUPERSCRIPT)
        this.recalculateSup(oMeasure);
    else if(this.Pr.type === DEGREE_SUBSCRIPT)
        this.recalculateSubScript(oMeasure);
};
/*CDegreeBase.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    if(PRS.bMath_OneLine == false)
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

        var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
        var RangeEndPos   = 0;

        this.baseContent.Recalculate_Range(PRS, ParaPr, Depth + 1);

        if(PRS.NewRange == false)
        {
            RangeEndPos = 1;
            this.iterContent.Recalculate_Range(PRS, ParaPr, Depth + 1);
        }
    }
    else
    {
        CDegreeBase.superclass.Recalculate_Range.call(this, PRS, ParaPr, Depth);
    }
};*/
CDegreeBase.prototype.recalculateSize = function(oMeasure)
{
    if(this.Pr.type === DEGREE_SUPERSCRIPT)
        this.recalculateSup(oMeasure);
    else if(this.Pr.type === DEGREE_SUBSCRIPT)
        this.recalculateSubScript(oMeasure);
};
CDegreeBase.prototype.new_recalculateSup = function(oMeasure, PRS)
{
    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var iterSize = this.iterContent.size;

    var base   = this.baseContent.size,
        iter   = this.iterContent.size;

    this.upBase = 0;
    this.upIter = 0;

    var HeightLine = AscentLine + DescentLine;

    // для итератора степени выравниваем по последнему текстовому элементу (в случае если размер шрифта для основания один и то же)
    // исключая случай, когда итератор в N-арном операторе


    var BaseJustDraw = this.baseContent.IsJustDraw();
    var lastElem = this.baseContent.GetLastElement();

    var BaseRun  = lastElem.Type == para_Math_Run && mgCtrPrp.FontSize == lastElem.Get_CompiledPr(false).FontSize;
    var bTextElement = BaseJustDraw && (BaseRun || (lastElem.Type !== para_Math_Run && lastElem.IsJustDraw()));

    var UpBaseline = 0.5*TextAscent;

    if(bTextElement)
    {
        var minR = 0.3*TextAscent;

        var last = lastElem.size,
            upBaseLast = 0,
            upBaseIter = 0;

        if(base.ascent > UpBaseline + iter.ascent && iter.height + minR < base.ascent) // размер шрифта итератора << размера шрифта основания => iter << base; дробь + текст
        {
            this.upIter = base.ascent - (UpBaseline + iter.ascent);
        }
        else if(UpBaseline - (iter.height - iter.ascent) > minR)
        {
            this.upBase = UpBaseline + iter.ascent - base.ascent;
        }
        else
        {
            this.upBase = iter.height + minR - base.ascent;
        }
    }
    else
    {
        var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

        if(iter.height - iter.ascent + shCenter > base.ascent) // для дробей и т.п.
        {
            this.upBase = iter.height - (base.ascent - shCenter);
        }
        else if(iter.ascent > shCenter)
        {
            this.upBase = iter.ascent - shCenter;
        }
        else
        {
            this.upIter = shCenter - iter.ascent;
        }
    }


    if( this.bNaryInline)
        this.dW = 0.17*PlH;
    else
        this.dW = 0.056*PlH;

    if(PRS.bMath_OneLine == true)
    {
        this.size.height = this.upBase + base.height;
        this.size.ascent = this.upBase + base.ascent;

        this.size.width  = base.width + iter.width + this.dW;
        this.size.width  += this.GapLeft + this.GapRight;
    }

};
CDegreeBase.prototype.recalculateSup = function(oMeasure)
{
    var base   = this.baseContent.size,
        iter   = this.iterContent.size;

    var mgCtrPrp = this.Get_TxtPrControlLetter();

    this.upBase = 0;
    this.upIter = 0;

    var bTextElement = false,
        lastElem;

    if(!this.baseContent.IsJustDraw())
    {
        lastElem = this.baseContent.GetLastElement();

        var BaseRun  = lastElem.Type == para_Math_Run && mgCtrPrp.FontSize == lastElem.Get_CompiledPr(false).FontSize;
        bTextElement = BaseRun || (lastElem.Type !== para_Math_Run && lastElem.IsJustDraw());
    }

    var PlH = 0.64*this.ParaMath.GetPlh(oMeasure, mgCtrPrp);
    //var UpBaseline = 1.65*shCenter; // расстояние от baseline основания до бейзлайна итератора
     var UpBaseline = 0.75*PlH; // расстояние от baseline основания до бейзлайна итератора

    if(bTextElement)
    {
        var last = lastElem.size,
            upBaseLast = 0,
            upBaseIter = 0;

        if( (last.ascent - UpBaseline) + (iter.height - iter.ascent) >  (last.ascent - 2/9*PlH) )
            upBaseLast = iter.height - (last.ascent - 2/9*PlH);
        else if(UpBaseline + iter.ascent > last.ascent)
            upBaseLast = UpBaseline + iter.ascent - last.ascent;
        else
            upBaseIter = last.ascent - UpBaseline - iter.ascent;

        if(upBaseLast + last.ascent > base.ascent)
        {
            this.upBase = upBaseLast - (base.ascent - last.ascent);
            this.upIter = upBaseIter;
        }
        else
        {
            this.upBase = 0;
            this.upIter = (base.ascent - upBaseLast - last.ascent) + upBaseIter;
        }
    }
    else
    {
        var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

        if(iter.height - iter.ascent + shCenter > base.ascent) // для дробей и т.п.
        {
            this.upBase = iter.height - (base.ascent - shCenter);
        }
        else if(iter.ascent > shCenter)
        {
            this.upBase = iter.ascent - shCenter;
        }
        else
        {
            this.upIter = shCenter - iter.ascent;
        }
    }

    var height = this.upBase + base.height;
    var ascent = this.upBase + base.ascent;

    if( this.bNaryInline)
        this.dW = 0.17*PlH;
    else
        this.dW = 0.056*PlH;

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;
};
CDegreeBase.prototype.recalculateSubScript = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_TxtPrControlLetter();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);


    //var oBase = this.elements[0][0];
    //var bOneLineText = oBase.IsJustDraw() ? false : oBase.IsOneLineText();

    var bTextElement = false,
        lastElem;


    if(!this.baseContent.IsJustDraw())
    {
        lastElem = this.baseContent.GetLastElement();

        var txtPrpControl = this.ParaMath.GetFirstRPrp();// нам нужен текстовые настройки для управляющих элементов без учета ArgSize, а это как раз будут текстовые настройки первого рана
                                                         // если учтем ArgSize, то для вложенных дробей эта проверка на Run не сработает
        var BaseRun       = lastElem.Type == para_Math_Run && txtPrpControl.FontSize == lastElem.Get_CompiledPr(false).FontSize;
        bTextElement      = BaseRun || (lastElem.Type !== para_Math_Run && lastElem.IsJustDraw());
    }

    var height, ascent, descent;

    var PlH = 0.64*this.ParaMath.GetPlh(oMeasure, mgCtrPrp);

    if(bTextElement)
    {
        //var last = lastElem.size;
        var DownBaseline = 0.9*shCenter;


        if(iter.ascent - DownBaseline > 3/4*PlH)
            this.upIter = 1/4*PlH;
        else
            this.upIter = PlH + DownBaseline - iter.ascent;

        if(base.ascent > PlH)
        {
            this.upIter += base.ascent - PlH;
        }

        //this.upIter = base.ascent + DownBaseline - iter.ascent;

        var descentBase = base.height - base.ascent,
            descentIter = this.upIter + iter.height - base.ascent;

        descent = descentBase > descentIter ? descentBase : descentIter;
        ascent  = base.ascent;

        height = ascent + descent;
    }
    else
    {
        this.upIter = base.height + shCenter - iter.ascent;

        // ограничение для случая, когда аскент итератора >> высоты основания
        if(base.ascent - 1.5*shCenter > this.upIter)
            this.upIter = base.ascent - 1.5*shCenter;

        height = this.upIter + iter.height;
        ascent = base.ascent;
    }

    if( this.bNaryInline)
        this.dW = 0.17*PlH;
    else
        this.dW = 0.056*PlH;

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;
};
CDegreeBase.prototype.setPosition = function(pos, PRSA, Line, Range, Page)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent;

    var oBase = this.elements[0][0],
        oIter = this.elements[0][1];

    var PosBase = new CMathPosition();

    PosBase.x = this.pos.x + this.GapLeft;
    PosBase.y = this.pos.y + this.upBase;

    if(oBase.Type == para_Math_Content)
        PosBase.y += oBase.size.ascent;

    var PosIter = new CMathPosition();

    PosIter.x = this.pos.x + this.GapLeft + oBase.size.width + this.dW;
    PosIter.y = this.pos.y + this.upIter + oIter.size.ascent;

    oBase.setPosition(PosBase, PRSA, Line, Range, Page);
    oIter.setPosition(PosIter, PRSA, Line, Range, Page);

    pos.x += this.size.width;
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
CDegree.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.Script;
    MathProps.Pr   = null;
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

    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);

    var RPI_ITER = RPI.Copy();
    RPI_ITER.bDecreasedComp = true;

    this.iterUp.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
    this.iterDn.PreRecalc(this, ParaMath, ArgSzIters, RPI_ITER);
};
CIterators.prototype.recalculateSize = function(oMeasure, dH, ascent)
{
    this.dH = dH;

    var iterUp = this.iterUp.size,
        iterDown = this.iterDn.size;

    this.size.ascent = ascent;
    this.size.height = iterUp.height + dH + iterDown.height;
    this.size.width  = iterUp.width > iterDown.width ? iterUp.width : iterDown.width;

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
    var mgCtrPrp = this.Get_CompiledCtrPrp(); // Get_CompiledCtrPrp -  чтобы итераторы не разъезжались
    // половину ascent брать нельзя, т.к. черта дроби будет разделительной для верхнего и нижнего итератора => соответственно
    // если числитель меньше/больше знаменателя расположение итераторов у степени будет неправильным

    var iterUp   = this.iters.iterUp.size,
        iterDown = this.iters.iterDn.size,
        base     = this.baseContent.size;

    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.4;

    //var ctrPrpIter = this.iters.Get_TxtPrControlLetter();
    //var shIter = this.ParaMath.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    var PlH = 0.26*this.ParaMath.GetPlh(oMeasure, mgCtrPrp);

    var height, width, ascent, descent;

    var dH; // of Iterators
    var minGap;

    var TextElement = false;

    if(!this.baseContent.IsJustDraw())
    {
        var last = this.baseContent.GetLastElement();

        var BaseRun      = last.Type == para_Math_Run && mgCtrPrp.FontSize >= last.Get_CompiledPr(false).FontSize;
            TextElement  = BaseRun || (last.Type !== para_Math_Run && last.IsJustDraw());
    }

    //var BaseText       = last.Type == para_Math_Run && !this.baseContent.IsJustDraw(),
    //    TextElement    = BaseText && mgCtrPrp.FontSize >= last.Get_CompiledPr(false).FontSize;

    if(TextElement)
    {
        minGap =  0.5*PlH;

        var DivBaseline = 3.034*PlH;
        var ascIters, dgrHeight;

        if(DivBaseline > minGap + iterDown.ascent + (iterUp.height - iterUp.ascent))
        {
            dH = DivBaseline - iterDown.ascent - (iterUp.height - iterUp.ascent);
        }
        else
        {
            dH = minGap;
        }

        var GapDown = PlH;

        ascIters = iterUp.height + dH + GapDown;
        dgrHeight = iterDown.height + iterUp.height + dH;

        ascent = ascIters > base.ascent ? ascIters : base.ascent;

        var dscIter = dgrHeight - ascIters,
            dscBase = base.height - base.ascent;

        descent = dscIter > dscBase ? dscIter : dscBase;
        height = ascent + descent;

        this.iters.recalculateSize(oMeasure, dH, ascIters /*ascent of Iterators*/);
    }
    else
    {
        minGap =  0.7*PlH;

        var lUpBase    = base.ascent - shCenter; // center of base
        var lDownBase  = base.height - lUpBase; // height - center of base


        var DescUpIter  = iterUp.height - iterUp.ascent + PlH;
        var AscDownIter = iterDown.ascent - PlH;

        var UpGap, DownGap;

        if(this.bNaryInline)
        {
            UpGap   = 0;
            DownGap = 0;
        }
        else
        {
            UpGap   = lUpBase > DescUpIter    ? lUpBase   - DescUpIter  : 0;           // расстояние от центра основания до верхнего итератора
            DownGap = lDownBase > AscDownIter ? lDownBase - AscDownIter : 0;           // расстояние от центра основания до нижнего итератора
        }

        if(UpGap + DownGap > minGap)
            dH = UpGap + DownGap;
        else
            dH = minGap;

        height = iterUp.height + dH + iterDown.height;
        ascent = iterUp.height + UpGap + shCenter;

        this.iters.recalculateSize(oMeasure, dH, ascent/*ascent of Iterators*/);
    }

    if( this.bNaryInline)
        this.dW = 0.42*PlH;
    else
        this.dW = 0.14*PlH;

    width  = this.iters.size.width + base.width + this.dW;
    width += this.GapLeft + this.GapRight;

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;

}
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
CDegreeSubSup.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.Script;
    MathProps.Pr   = null;
};
