"use strict";

function CSignRadical()
{
    this.Parent = null;
    this.pos = null;

    this.size = new CMathSize();
    this.gapArg = 0;
    this.gapSign = 0;   /// расстояние до значка радикала

    this.measure =
    {
        heightTick:     0,
        widthTick:      0,
        widthSlash:     0,
        bHigh:          false
    };

}
CSignRadical.prototype.draw = function(x, y, pGraphics, PDSE)
{
    var txtPrp   = this.Parent.Get_CompiledCtrPrp();
    var FontSize = txtPrp.FontSize;

    var penW =  FontSize*0.01185;

    var penW1 = 1.25*penW,
        penW2 = 5.4*penW,
        penW3 = 1.8*penW;

    y += this.gapSign; // смещаем

    //// Tick for degree ////

    var Height = this.size.height - this.gapSign;
    var sin1 = 0.456, // 0.0242/0.054
        cos1 = 0.89,
        tg1  = 0.512;

    var hTick = this.pos.y + y + Height - this.measure.heightTick;

    var xx1 = this.pos.x + x,         yy1 = hTick + 0.03*FontSize,
        xx2 = xx1 + penW1*sin1,       yy2 = yy1 + penW1*cos1,
        xx3 = xx2 + 0.03*FontSize,    yy3 = tg1*(xx2 - xx3) + yy2;

    var sin2 = 0.876,
        tg =  1.848;

    var yy4 = this.pos.y + y + Height;
    var xx4;
    var shift = penW1*0.2336;

    if( !this.measure.bHigh )
    {
        xx4 = xx3 + (yy4-yy3)/tg - shift;
    }
    else
    {
        xx4 = xx1 + this.measure.widthSlash - shift;
    }

    //// Tick for Base ////

    var xx5 = xx4 + shift,                      yy5 = yy4,
        xx6 = xx1 + this.measure.widthSlash,    yy6 = this.pos.y + y + penW3,
        xx7 = this.pos.x + x + this.size.width, yy7 = yy6,
        xx8 = xx7,                              yy8 = yy7 - penW3;

    var tg3     = (yy6 - yy5)/(xx6 - xx5);
    var hypoth3 = Math.sqrt((xx6 - xx5)*(xx6 - xx5) + (yy6 - yy5)*(yy6 - yy5));
    var cos3    = (xx6 - xx5)/hypoth3;
    var sin3    = (yy5 - yy6)/hypoth3;

    var yy9 = yy8, xx9 = xx6 - penW3*sin3;

    var tg2 = (yy4 - yy3)/(xx4 - xx3);

    //  y = tg3*(x - xx9) + yy9
    //
    //
    //  y = tg2*(x - xx4) + yy4 - penW2*sin2
    //  tg2 = (yy4 - yy3)/(xx4 - xx3)
    //  tg3*(x - xx9) + yy9 = tg2*(x - xx4) + yy4 - penW2*sin2
    //  tg3*x - tg3*xx9 + yy9 = tg2*x - tg2*xx4 + yy4 - penW2*sin2
    //  tg3*x - tg2*x = yy4 - penW2*sin2 - tg2*xx4 + tg3*xx9 - yy9
    //
    //

    var xx10, yy10;

    if( !this.measure.bHigh )
    {
        xx10 = (yy4 - tg2*xx4 + tg3*xx9 - yy9 - penW2)/(tg3 - tg2);
        yy10 = tg3*(xx10 - xx9) + yy9;
    }
    else
    {
        xx10 = xx9;
        yy10 = tg2*(xx10 - xx4) + yy4 - penW2*sin2;
    }

    var yy11 =  hTick;
    var xx11 = (yy11 - yy4 + penW2)/tg2 + xx4;

    var mgCtrPrp = this.Parent.Get_TxtPrControlLetter();

    PDSE.Graphics.SetFont(mgCtrPrp);

    this.Parent.Make_ShdColor(PDSE, this.Parent.Get_CompiledCtrPrp());
    PDSE.Graphics._s();

    if(PDSE.Graphics.Start_Command)
    {
        PDSE.Graphics.p_width(0); // в pGraphics выставится ширина равная 1 px

        PDSE.Graphics._m(xx1,  yy1);
        PDSE.Graphics._l(xx2,  yy2);
        PDSE.Graphics._l(xx3,  yy3);
        PDSE.Graphics._l(xx4,  yy4);
        PDSE.Graphics._l(xx5,  yy5);
        PDSE.Graphics._l(xx6,  yy6);
        PDSE.Graphics._l(xx7,  yy7);
        PDSE.Graphics._l(xx8,  yy8);
        PDSE.Graphics._l(xx9,  yy9);
        PDSE.Graphics._l(xx10, yy10);
        PDSE.Graphics._l(xx11, yy11);
        PDSE.Graphics._l(xx1,  yy1);

        PDSE.Graphics.df();
    }
    else // чтобы линии были четкие не в WordArt, рисуем знак радикала по заданному пути линиями нужной толщины
    {
        var intGrid = pGraphics.GetIntegerGrid();
        pGraphics.SetIntegerGrid(true);             // для того чтобы линии были отрисованы четко (неразмыто)

        pGraphics.p_width(penW3*1000);

        PDSE.Graphics._m(xx2,  yy2);
        PDSE.Graphics._l(xx3,  yy3);
        PDSE.Graphics._l(xx4,  yy4);
        PDSE.Graphics._l(xx5,  yy5);
        PDSE.Graphics._l(xx6,  yy6);
        PDSE.Graphics._l(xx7,  yy7);

        PDSE.Graphics.ds();

        pGraphics.SetIntegerGrid(intGrid);
    }

    PDSE.Graphics._s();

};
CSignRadical.prototype.recalculateSize = function(oMeasure, sizeArg)
{
    var txtPrp = this.Parent.Get_CompiledCtrPrp();

    var height, width;
    var plH = 9.877777777777776 * txtPrp.FontSize/36;

    this.gapArg = txtPrp.FontSize*g_dKoef_pt_to_mm*0.077108; /// расстояние до аргумента
    this.gapSign = txtPrp.FontSize*g_dKoef_pt_to_mm*0.094492; /// расстояние до значка радикала

    var heightArg = sizeArg.height + this.gapArg,
        widthArg  = sizeArg.width;


    //////////  Height  ///////////

    /*var H0 = plH*1.2,
     H1 = plH*1.50732421875,
     H2 = plH*2.760986328125,
     H3 = plH*4.217578125,
     H4 = plH*5.52197265625,
     H5 = plH*7.029296875;*/

    var H0 = plH*1.07,
    //H1 = plH*1.50732421875,
        H1 = plH*1.6234788833214036,
        H2 = plH*2.8,
        H3 = plH*4.08,
        H4 = plH*5.7,
        H5 = plH*7.15;


    this.measure.bHigh = false;

    var bDescentArg = sizeArg.height - sizeArg.ascent > 0.4*txtPrp.FontSize/11; // т.к. у нас почему-то для строчных букв "а" и тп descent не нулевой, см метрики в mathText.js

    if(heightArg < H0 && !bDescentArg)
        height = H0*1.12;
    //height = H0*1.058;
    else if( heightArg < H1)
        //height = H1*0.9284532335069441;
        height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3*1.04;
    else if( heightArg < H4 )
        height = H4;
    else if( heightArg < H5 )
        height = H5;
    else
    {
        height = heightArg;
        this.measure.bHigh = true;
    }

    ////////////////////////////////////


    //////////  Size of tick  //////////

    var minHgtRad = plH * 1.130493164,
        maxHgtRad = plH * 7.029296875;

    var minHgtTick = plH*0.6,
        maxHgtTick = 1.2*plH;

    var heightTick, widthSlash,
        gapLeft;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthSlash = plH * 0.67;

        gapLeft = 0.2*plH;
    }
    else
    {
        var H;

        if(heightArg < H1)
        {
            H = H1;
            var zetta = height < H1 ? 0.75 : 0.82;
            widthSlash = plH *zetta;
        }
        else
        {
            H = height;
            widthSlash = plH * 0.8681086138556986;
        }
        var alpha =  (H - minHgtRad)/(2*maxHgtRad);
        heightTick = minHgtTick*(1 + alpha);

        gapLeft = 0.12683105468750022* plH;
    }


    this.measure.widthSlash = widthSlash;

    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.1196002747872799*txtPrp.FontSize;

    //////////////////////////////

    //////////   WidthБ Height  //////////
    width = widthSlash + gapLeft + widthArg;
    height += this.gapSign;
    //////////////////////////////

    this.size.height = height;
    this.size.width  = width;
};
CSignRadical.prototype.setPosition = function(pos)
{
    this.pos = pos;
};
CSignRadical.prototype.relate = function(parent)
{
    this.Parent = parent;
};

function CMathRadicalPr()
{
    this.type    = DEGREE_RADICAL;
    this.degHide = false;
}

CMathRadicalPr.prototype.Set_FromObject = function(Obj)
{
    if(SQUARE_RADICAL === Obj.type || DEGREE_RADICAL === Obj.type)
        this.type = Obj.type;

    if(true === Obj.degHide || 1 === Obj.degHide)
    {
        this.degHide = true;
        this.type = SQUARE_RADICAL;
    }
    else if(false === Obj.degHide || 0 === Obj.degHide)
    {
        this.degHide = false;
        this.type = DEGREE_RADICAL;
    }
};

CMathRadicalPr.prototype.Copy = function()
{
    var NewPr = new CMathRadicalPr();

    NewPr.type    = this.type;
    NewPr.degHide = this.degHide;

    return NewPr;
};

CMathRadicalPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : type
    // Bool : degHide

    Writer.WriteLong(this.type);
    Writer.WriteBool(this.degHide);
};

CMathRadicalPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : type
    // Bool : degHide

    this.type    = Reader.GetLong();
    this.degHide = Reader.GetBool();
};

/**
 *
 * @param props
 * @constructor
 * @extends {CMathBase}
 */
function CRadical(props)
{
    CRadical.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Iterator = null;
    this.Base     = null;

    this.RealBase = null;

    this.signRadical = new CSignRadical();
    this.signRadical.relate(this);

    this.Pr = new CMathRadicalPr();

    this.gapDegree = 0;
    this.gapWidth = 0; //  в случае со степенью, если ширина степени не нулевая, добавляется расстояние для ширины

    if(props !== null && props !== undefined)
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CRadical, CMathBase);

CRadical.prototype.ClassType = historyitem_type_rad;
CRadical.prototype.kind      = MATH_RADICAL;

CRadical.prototype.init = function(props)
{
    this.setProperties(props);
    this.Fill_LogicalContent(2);

    this.fillContent();
};
CRadical.prototype.fillContent = function()
{
    this.Iterator = this.getDegree();
    this.Base     = this.getBase();
};
CRadical.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);

    this.ApplyProperties(RPI);

    var ArgSzIter = new CMathArgSize();
    ArgSzIter.SetValue(-2);

    this.Iterator.PreRecalc(this, ParaMath, ArgSzIter, RPI);
    this.RealBase.PreRecalc(this, ParaMath, ArgSize, RPI);

    if(this.bInside == false)
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);
};
CRadical.prototype.ApplyProperties = function(RPI)
{
    if(this.RecalcInfo.bProps)
    {
        if(this.Pr.degHide == true)
        {
            this.setDimension(1, 1);

            // TODO: IlyaKirillov: Пока убрал данный вариант, потому что у обычного пользователя он
            //       не встретится с вероятностью 99%, а обработка данного случая в текущей реализации
            //       приводит к багам в совместном редактировании.

//            if(this.Iterator !== null)
//            {
//                var Item = new CMathBase(true);
//                Item.setDimension(1, 2);
//                Item.elements[0][0] = this.Iterator;
//                Item.elements[0][1] = this.Base;
//
//                //Item.addMCToContent(this.Iterator, this.Base);
//
//                this.elements[0][0] = Item;
//            }
//            else
//            {
//                this.elements[0][0] = this.Base;
//            }

            this.elements[0][0] = this.Base;

            //---------------------

            this.RealBase = this.elements[0][0];
        }
        else
        {
            this.setDimension(1, 2);
            this.elements[0][0] = this.Iterator;
            this.elements[0][1] = this.Base;

            this.RealBase       = this.Base;

        }

        this.RecalcInfo.bProps = false;
    }
};
CRadical.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    var bOneLine = PRS.bMath_OneLine;
    var WordLen = PRS.WordLen; // запоминаем, чтобы внутр мат объекты не увеличили WordLen
    this.BrGapLeft  = this.GapLeft;
    this.BrGapRight = this.GapRight;

    this.Iterator.Recalculate_Reset(PRS.Range, PRS.Line, PRS);
    this.Base.Recalculate_Reset(PRS.Range, PRS.Line, PRS);

    PRS.bMath_OneLine = true;

    this.Iterator.Recalculate_Range(PRS, ParaPr, Depth);
    this.Base.Recalculate_Range(PRS, ParaPr, Depth);

    this.recalculateSize(g_oTextMeasurer);

    this.UpdatePRS_OneLine(PRS, WordLen);
    this.Bounds.SetWidth(0, 0, this.size.width);
    this.Bounds.UpdateMetrics(0, 0, this.size);

    PRS.bMath_OneLine = bOneLine;
};
CRadical.prototype.recalculateSize = function(oMeasure)
{
    var shTop,
        height, width, ascent;

    this.signRadical.recalculateSize(oMeasure, this.RealBase.size);

    var txtPrp = this.Get_CompiledCtrPrp();
    var sign = this.signRadical.size,
        gSign = this.signRadical.gapSign,
        // в случае смещения baseline контента тоже смещается, и по высоте артгумент может выйти чуть за пределы (т.о. значок интеграла будет расположен чуть выше, чем следовало бы, и размер аргумента выйде за границы)
        gArg = this.signRadical.gapArg > 2*g_dKoef_pt_to_mm ? this.signRadical.gapArg : 2*g_dKoef_pt_to_mm; // делаем смещение, т.к. для fontSize 11, 14 и меньше высота плейсхолдера не совпадает
                                                                                                            // с высотой отрисовки плейсхолдера и происходит наложение черты значка радикала и плейсхолдера

    var gapBase = gSign + gArg;

    if(this.Pr.type == SQUARE_RADICAL)
    {
        //base = this.elements[0][0].size;
        shTop = (sign.height - gSign - this.RealBase.size.height)/2;
        shTop = shTop > 0 ? shTop : 0;

        ascent = gapBase + shTop + this.RealBase.size.ascent;

        height = sign.height > ascent - this.RealBase.size.ascent + this.RealBase.size.height ? sign.height : ascent - this.RealBase.size.ascent + this.RealBase.size.height;
        width  = sign.width;

        //ascent = height - (base.height - base.ascent);

        width += this.GapLeft + this.GapRight;
    }
    else if(this.Pr.type == DEGREE_RADICAL)
    {
        //degr = this.elements[0][0].size;
        //base = this.elements[0][1].size;

        var wTick = this.signRadical.measure.widthTick,
            hTick = this.signRadical.measure.heightTick;

        var plH = 9.877777777777776 * txtPrp.FontSize /36;

        // общие gaps
        var gapHeight = 0.011*txtPrp.FontSize; // добавляем это расстояние к общей высоте радикала, также как и gapWidth
        this.gapWidth = 0.011*txtPrp.FontSize;

        var wDegree = this.Iterator.size.width > wTick ? this.Iterator.size.width - wTick : 0;
        width = wDegree + sign.width + this.gapWidth;
        width += this.GapLeft + this.GapRight;

        var gapDegree;
        if( this.RealBase.size.height < plH )
            gapDegree = 1.5*txtPrp.FontSize/36;
        else
            gapDegree = 3*txtPrp.FontSize/36;

        var h1 = gapHeight + this.Iterator.size.height + gapDegree + hTick,
            h2 = sign.height;

        shTop = (sign.height - gSign - this.RealBase.size.height)/2;

        if(h1 > h2)
        {
            height =  h1;
            ascent = height - sign.height + gapBase + shTop + this.RealBase.size.ascent;
        }
        else
        {
            height =  h2;
            ascent = gapBase + shTop + this.RealBase.size.ascent;
        }

        this.gapDegree = height - h1 + gapHeight;
    }

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;
};
CRadical.prototype.Resize = function(oMeasure, RPI)
{
    if(this.Pr.type == SQUARE_RADICAL)
        this.RealBase.Resize(oMeasure, RPI);
    else
    {
        this.Iterator.Resize(oMeasure, RPI);
        this.RealBase.Resize(oMeasure, RPI);
    }

    this.recalculateSize(oMeasure);
};
CRadical.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;

    this.UpdatePosBound(pos, PosInfo);

    var PosBase    = new CMathPosition(),
        PosRadical = new CMathPosition();

    if(this.Pr.type == SQUARE_RADICAL)
    {
        var gapLeft = this.size.width - this.RealBase.size.width - this.GapRight;
        var gapTop = this.size.ascent - this.RealBase.size.ascent;

        PosRadical.x = this.pos.x + this.GapLeft;
        PosRadical.y = this.pos.y;

        PosBase.x = this.pos.x + gapLeft;
        PosBase.y = this.pos.y + gapTop + this.RealBase.size.ascent;

        this.signRadical.setPosition(PosRadical);
        this.RealBase.setPosition(PosBase, PosInfo);
    }
    else if(this.Pr.type == DEGREE_RADICAL)
    {
        var wTick = this.signRadical.measure.widthTick;

        var PosDegree = new CMathPosition();

        PosDegree.x = this.pos.x + this.GapLeft + this.gapWidth;
        PosDegree.y = this.pos.y + this.gapDegree + this.Iterator.size.ascent;

        this.Iterator.setPosition(PosDegree, PosInfo);

        var wDegree = this.Iterator.size.width > wTick ? this.Iterator.size.width - wTick : 0;

        PosRadical.x = this.pos.x + this.GapLeft + wDegree;
        PosRadical.y = this.pos.y + this.size.height - this.signRadical.size.height;

        this.signRadical.setPosition(PosRadical);

        PosBase.x = this.pos.x + this.size.width - this.RealBase.size.width - this.GapRight;
        PosBase.y = this.pos.y + this.size.ascent;

        this.RealBase.setPosition(PosBase, PosInfo);
    }

    pos.x += this.size.width;
};
CRadical.prototype.Draw_LinesForContent = function(PDSL)
{
    if(this.Pr.type == SQUARE_RADICAL)
    {
        this.RealBase.Draw_Lines(PDSL);
    }
    else
    {
        this.RealBase.Draw_Lines(PDSL);
        this.Iterator.Draw_Lines(PDSL);
    }
};
CRadical.prototype.Draw_Elements = function(PDSE)
{
    var X = PDSE.X;

    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line, PDSE.Range);

    this.signRadical.draw(PosLine.x, PosLine.y, PDSE.Graphics, PDSE);
    CRadical.superclass.Draw_Elements.call(this, PDSE);

    PDSE.X = X + this.size.width;
};
CRadical.prototype.getBase = function()
{
    return this.Content[1];
};
CRadical.prototype.getDegree = function()
{
    return this.Content[0];
};
CRadical.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.Radical;
    MathProps.Pr   = null;
};
CRadical.prototype.Is_ContentUse = function(MathContent)
{
    if (MathContent === this.Content[1])
        return true;

    if(DEGREE_RADICAL === this.Pr.type && MathContent === this.Content[0])
        return true;

    return false;
};