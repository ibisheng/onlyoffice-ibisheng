/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

// Import
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;

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


    var yy4 = this.pos.y + y + Height + 0.35;
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

    if(PDSE.Graphics.Start_Command) // textArt
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
        var intGrid = PDSE.Graphics.GetIntegerGrid();
        PDSE.Graphics.SetIntegerGrid(true);             // для того чтобы линии были отрисованы четко (неразмыто)

        PDSE.Graphics.p_width(penW3*1000);

        if(PDSE.Graphics.m_oCoordTransform !== undefined)
        {
            var CoordTransform = PDSE.Graphics.m_oCoordTransform;
            var diff = CoordTransform.TransformPointX(xx5, yy5) - CoordTransform.TransformPointX(xx4, yy4);

            // чтобы реже перескакивали точки при незначительном изменении ширины формулы (из-за округления на отрисовке)
            // на небольших размерах приравниваем две нижние точки друг другу
            if( diff < 0.3 )
                xx5 = xx4;
        }

        PDSE.Graphics._m(xx2,  yy2);
        PDSE.Graphics._l(xx3,  yy3);
        PDSE.Graphics._l(xx4,  yy4);
        PDSE.Graphics._l(xx5,  yy5);
        PDSE.Graphics._l(xx6,  yy6);
        PDSE.Graphics._l(xx7,  yy7);

        PDSE.Graphics.ds();

        PDSE.Graphics.SetIntegerGrid(intGrid);
    }

    PDSE.Graphics._s();

};
CSignRadical.prototype.recalculateSize = function(oMeasure, sizeArg, bInline)
{
    var height = 0;
    var CtrPrp = this.Parent.Get_CompiledCtrPrp(),
        FontSize = CtrPrp.FontSize;

    var Symbol5 = new CMathText(true);
    Symbol5.add(0x35);

    // измеряем функцией MeasureJustDraw, чтобы был выставлен Font
    this.Parent.MeasureJustDraw(Symbol5);

    var measureH = Symbol5.size.height;

    // высота символов изменяется непропорционально размерам шрифта
    // поэтому ориентируемся на высоту символа 5

    var H1;

    var H0 =  measureH*1.07,
        H2 = measureH*2.8,
        H3 = measureH*4.08,
        H4 = measureH*5.7,
        H5 = measureH*7.15;

    if(bInline)
    {
        this.gapArg =   measureH*0.015; /// расстояние до аргумента
        this.gapSign =  0; /// расстояние до значка радикала

        H1 = measureH*1.45;
    }
    else
    {
        this.gapArg =  measureH*0.0991; /// расстояние до аргумента
        this.gapSign = measureH*0.1215; /// расстояние до значка радикала

        H1 = measureH*1.6235;
    }

    var heightArg = sizeArg.height + this.gapArg,
        widthArg = sizeArg.width;

    this.measure.bHigh = false;

    var letterG = new CMathText(true);
    letterG.add(0x67);

    // измеряем функцией MeasureJustDraw, чтобы был выставлен Font
    this.Parent.MeasureJustDraw(letterG);

    var Descent = letterG.size.height - letterG.size.ascent;
    var bDescentArg = sizeArg.height - sizeArg.ascent > 0.9*Descent;

    if(heightArg < H0 && !bDescentArg)
        height = H0;
    else if( heightArg < H1)
        height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3;
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

    var measureTick = 0.27438 * FontSize;

    var minHgtRad = 1.13*measureTick,
        maxHgtRad = 7.03*measureTick;

    var minHgtTick = 0.6*measureTick,
        maxHgtTick = 1.2*measureTick;

    var heightTick, widthSlash,
        gapLeft;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthSlash = 0.67*measureTick;

        gapLeft = 0.2*measureTick;
    }
    else
    {
        var zetta;

        if(height < H1)
            zetta = 0.75;
        else if(heightArg < H1)
            zetta = 0.82;
        else
            zetta = 0.868;

        widthSlash = measureTick *zetta;
        var H = heightArg < H1 ? H1 : height;

        var alpha =  (H - minHgtRad)/(2*maxHgtRad);
        heightTick = minHgtTick*(1 + alpha);

        gapLeft = 0.127* measureTick;
    }

    this.measure.widthSlash = widthSlash;

    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.13*FontSize;

    //////////////////////////////

    //////////   Width, Height  //////////

    this.size.height = height + this.gapSign;
    this.size.width  = widthSlash + gapLeft + widthArg;

    //////////////////////////////
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
CMathRadicalPr.prototype.ChangeType = function()
{
    if(this.type == DEGREE_RADICAL)
    {
        this.degHide = true;
        this.type = SQUARE_RADICAL;
    }
    else
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
	CMathBase.call(this);

	this.Id = AscCommon.g_oIdCounter.Get_NewId();

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

    AscCommon.g_oTableId.Add( this, this.Id );
}
CRadical.prototype = Object.create(CMathBase.prototype);
CRadical.prototype.constructor = CRadical;

CRadical.prototype.ClassType = AscDFH.historyitem_type_rad;
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


    this.RealBase.PreRecalc(this, ParaMath, ArgSize, RPI);

    var bDecreasedComp = RPI.bDecreasedComp;
    RPI.bDecreasedComp = true;

    this.Iterator.PreRecalc(this, ParaMath, ArgSzIter, RPI);

    RPI.bDecreasedComp = bDecreasedComp;

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
    var shTop, width, ascent;

    this.signRadical.recalculateSize(oMeasure, this.RealBase.size, this.ParaMath.Is_Inline());

    var txtPrp = this.Get_CompiledCtrPrp();
    var sign = this.signRadical.size,
        gSign = this.signRadical.gapSign,
        // в случае смещения baseline контента тоже смещается, и по высоте артгумент может выйти чуть за пределы (т.о. значок интеграла будет расположен чуть выше, чем следовало бы, и размер аргумента выйде за границы)
        gArg = this.signRadical.gapArg > 2*g_dKoef_pt_to_mm ? this.signRadical.gapArg : 2*g_dKoef_pt_to_mm; // делаем смещение, т.к. для fontSize 11, 14 и меньше высота плейсхолдера не совпадает
                                                                                                            // с высотой отрисовки плейсхолдера и происходит наложение черты значка радикала и плейсхолдера

    var gapBase = gSign + gArg;

    if(this.Pr.type == SQUARE_RADICAL)
    {
        shTop = (sign.height - gSign - this.RealBase.size.height)/2;
        shTop = shTop > 0 ? shTop : 0;

        ascent = gapBase + shTop + this.RealBase.size.ascent;

        this.size.ascent = ascent;
        this.size.height = sign.height > ascent - this.RealBase.size.ascent + this.RealBase.size.height ? sign.height : ascent - this.RealBase.size.ascent + this.RealBase.size.height;
        this.size.width = sign.width + this.GapLeft + this.GapRight;
    }
    else if(this.Pr.type == DEGREE_RADICAL)
    {
        var wTick = this.signRadical.measure.widthTick,
            hTick = this.signRadical.measure.heightTick;

        // общие gaps
        var gapHeight = 0.011*txtPrp.FontSize; // добавляем это расстояние к общей высоте радикала, также как и gapWidth
        this.gapWidth = 0.011*txtPrp.FontSize;

        var wDegree = this.Iterator.size.width > wTick ? this.Iterator.size.width - wTick : 0;
        width = wDegree + sign.width + this.gapWidth;
        this.size.width = width + this.GapLeft + this.GapRight;

        shTop = (sign.height - gSign - this.RealBase.size.height)/2;

        var h1 = this.Iterator.size.height + ((0.65*sign.height + 0.5) >> 0),
            h2 = sign.height;

        if(h1 > h2)
        {
            this.size.height = h1;
            this.size.ascent = h1 - sign.height + gapBase + shTop + this.RealBase.size.ascent;
        }
        else
        {
            this.size.height = h2;
            this.size.ascent = gapBase + shTop + this.RealBase.size.ascent;
        }

        this.gapDegree = this.size.height - h1;
    }
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
CRadical.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var bResult;

    if(this.Pr.type == DEGREE_RADICAL)
    {
        bResult = CMathBase.prototype.Get_ParaContentPosByXY.call(this, SearchPos, Depth, _CurLine, _CurRange, StepEnd);
    }
    else
    {
        if(true === this.Content[1].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd))
        {
            SearchPos.Pos.Update2(1, Depth);
            bResult = true;
        }
    }

    return bResult;
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
    CMathBase.prototype.Draw_Elements.call(this, PDSE);

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
CRadical.prototype.Apply_TextPr = function(TextPr, IncFontSize, ApplyToAll)
{
    this.Apply_TextPrToCtrPr(TextPr, IncFontSize, ApplyToAll);

    this.Iterator.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
    this.Base.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
};
CRadical.prototype.Apply_MenuProps = function(Props)
{
	if (Props.Type == Asc.c_oAscMathInterfaceType.Radical && Props.HideDegree !== undefined)
	{
		if (true == this.Iterator.IsPlaceholder() && Props.HideDegree !== this.Pr.degHide)
		{
			AscCommon.History.Add(new CChangesMathRadicalHideDegree(this, this.Pr.degHide, Props.HideDegree));
			this.raw_SetHideDegree(Props.HideDegree);
		}
	}
};
CRadical.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuRadical(this);
};
CRadical.prototype.raw_SetHideDegree = function(Value)
{
    if(this.Pr.degHide !== Value)
    {
        this.Pr.ChangeType();
        this.RecalcInfo.bProps = true;
        this.ApplyProperties();

        if(this.Pr.type === SQUARE_RADICAL && this.CurPos == 0) // находимся в степени
        {
            this.CurPos = 1;
            this.Base.MoveCursorToStartPos();
        }
    }
};
CRadical.prototype.Can_ModifyArgSize = function()
{
    return this.CurPos == 0 && false === this.Is_SelectInside();
};
CRadical.prototype.Is_ContentUse = function(MathContent)
{
    if (MathContent === this.Content[1])
        return true;

    if(DEGREE_RADICAL === this.Pr.type && MathContent === this.Content[0])
        return true;

    return false;
};

/**
 *
 * @param CMathMenuRadical
 * @constructor
 * @extends {CMathMenuBase}
 */
function CMathMenuRadical(Radical)
{
	CMathMenuBase.call(this, Radical);

    if (undefined !== Radical)
    {
        var HideDegree = undefined;
        if (Radical.Iterator.IsPlaceholder())
            HideDegree = Radical.Pr.degHide == true;

        this.Type       = Asc.c_oAscMathInterfaceType.Radical;
        this.HideDegree = HideDegree;
    }
    else
    {
        this.Type       = Asc.c_oAscMathInterfaceType.Radical;
        this.HideDegree = undefined;
    }
}
CMathMenuRadical.prototype = Object.create(CMathMenuBase.prototype);
CMathMenuRadical.prototype.constructor = CMathMenuRadical;
CMathMenuRadical.prototype.get_HideDegree = function(){return this.HideDegree;};
CMathMenuRadical.prototype.put_HideDegree = function(Hide){this.HideDegree = Hide;};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CRadical = CRadical;

window["CMathMenuRadical"] = CMathMenuRadical;
CMathMenuRadical.prototype["get_HideDegree"] = CMathMenuRadical.prototype.get_HideDegree;
CMathMenuRadical.prototype["put_HideDegree"] = CMathMenuRadical.prototype.put_HideDegree;
