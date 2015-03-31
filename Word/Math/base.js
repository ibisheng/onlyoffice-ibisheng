"use strict";

function CMathBase(bInside)
{
    CMathBase.superclass.constructor.call(this);

    this.Type = para_Math_Composition;

    this.pos  = new CMathPosition();
    this.size = new CMathSize();

    //  Properties
    this.Parent = null;
    this.ParaMath = null; // ссылка на общую формулу

    this.CtrPrp = new CTextPr();
    this.CompiledCtrPrp = new CTextPr();
    this.TextPrControlLetter = new CTextPr();

    this.ArgSize = new CMathArgSize();

    /////////////////
    this.nRow = 0;
    this.nCol = 0;

    this.bInside = bInside === true;

    this.bOneLine        = true;
    this.bCanBreak       = false;
    this.NumBreakContent = -1;

    this.elements    = [];

    this.Bounds = new CMathBounds();

    this.dW = 0; //column gap, gap width
    this.dH = 0; //row gap, gap height

    this.alignment =
    {
        hgt: null,
        wdt: null
    };

    this.GapLeft = 0;
    this.GapRight = 0;

    this.BrGapLeft  = 0;
    this.BrGapRight = 0;

    this.RecalcInfo =
    {
        bCtrPrp:     true,
        bProps:      true
    };

    this.Content = [];
    this.CurPos  = 0;

    this.Selection =
    {
        StartPos : 0,
        EndPos   : 0,
        Use      : false
    };

    this.NearPosArray = [];

    return this;
}
Asc.extendClass(CMathBase, CParagraphContentWithParagraphLikeContent);
CMathBase.prototype.setContent = function()
{
    for(var i=0; i < this.nRow; i++)
    {
        this.elements[i] = [];
        for(var j = 0; j < this.nCol; j++)
            this.elements[i][j] = new CMathContent();
    }
};
CMathBase.prototype.setDimension = function(countRow, countCol)
{
    this.nRow = countRow;
    this.nCol = countCol;

    this.alignment.hgt = [];
    this.alignment.wdt = [];

    for(var i = 0; i < this.nCol ; i++)
    {
        this.alignment.wdt[i] = MCJC_CENTER;
    }

    for(var j=0; j < this.nRow; j++)
    {
        this.elements[j] = [];
        this.alignment.hgt[j] = MCJC_CENTER;
    }

};
CMathBase.prototype.NeedBreakContent = function(Number)
{
    this.bCanBreak       = true;
    this.NumBreakContent = Number;

    this.BrGapLeft  = this.GapLeft;
    this.BrGapRight = this.GapRight;
};
///////// RunPrp, CtrPrp
CMathBase.prototype.setCtrPrp = function(txtPrp) // выставляем ctrPrp на чтение
{
    if(txtPrp !== null && typeof(txtPrp) !== "undefined")
    {
        this.CtrPrp.Merge(txtPrp);
    }
};
CMathBase.prototype.Get_CtrPrp = function()
{
    var CtrPrp;
    if(this.bInside === true)
        CtrPrp = this.Parent.Get_CtrPrp();
    else
        CtrPrp = this.CtrPrp.Copy();

    return CtrPrp;
};
CMathBase.prototype.Get_CompiledCtrPrp = function(bAllowInline)
{
    this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

    var CompiledCtrPrp;

    if(this.bInside === true)
    {
        CompiledCtrPrp = this.Parent.Get_CompiledCtrPrp();
    }
    else
    {
        CompiledCtrPrp = this.Get_CompiledCtrPrp_2();

        if(bAllowInline !== false && this.ParaMath)
            CompiledCtrPrp.FontSize *= MatGetKoeffArgSize(CompiledCtrPrp.FontSize, this.Parent.Get_CompiledArgSize().value);
    }

    if(bAllowInline !== false && this.ParaMath)
        CompiledCtrPrp.FontSize *= MatGetKoeffArgSize(CompiledCtrPrp.FontSize, this.ArgSize.value);// для настроек inline формул

    return CompiledCtrPrp;
};
CMathBase.prototype.Get_CompiledCtrPrp_2 = function() // without arg Size
{
    this.Set_CompiledCtrPrp(this.Parent, this.ParaMath);

    var CompiledCtrPrp;

    if(this.bInside === true)
        CompiledCtrPrp = this.Parent.Get_CompiledCtrPrp_2();
    else
        CompiledCtrPrp = this.CompiledCtrPrp.Copy();

    return CompiledCtrPrp;
};
CMathBase.prototype.Get_CompiledArgSize = function()
{
    return this.Parent.Get_CompiledArgSize();
};
CMathBase.prototype.Get_TxtPrControlLetter = function(RPI) // TextPrControlLetter не копируются !
{
    this.Set_CompiledCtrPrp(this.Parent, this.ParaMath, RPI);

    return this.TextPrControlLetter;
};
CMathBase.prototype.fillPlaceholders = function()
{
    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
            if(!this.elements[i][j].IsJustDraw())
                this.elements[i][j].fillPlaceholders();
};
CMathBase.prototype.addMCToContent = function(elements)
{
    if(elements.length == this.nRow*this.nCol)
    {
        this.elements.length = 0;
        for(var i = 0; i < this.nRow; i++)
        {
            this.elements[i] = [];
            for(var j = 0; j < this.nCol; j++)
                this.elements[i][j] = elements[j + i*this.nCol];
        }
    }
    else
        this.setContent();
};
// эта функция здесь необходима для случая с n-арными операторами : когда передаем n-арный оператор с итераторами и аргумент
CMathBase.prototype.IsJustDraw = function()
{
    return false;
};
CMathBase.prototype.IsAccent = function()
{
    return false;
};
CMathBase.prototype.IsEqArray = function()
{
    return false;
};
CMathBase.prototype.getWidthsHeights = function()
{
    var Widths = [];
    for(var tt = 0; tt < this.nCol; tt++ )
        Widths[tt] = 0;

    var Ascents = [];
    var Descents = [];

    for(tt = 0; tt < this.nRow; tt++ )
    {
        Ascents[tt] = 0;
        Descents[tt] = 0;
    }

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol ; j++)
        {
            var size = this.elements[i][j].size;
            Widths[j] = ( Widths[j] > size.width ) ? Widths[j] : size.width;
            Ascents[i] = (Ascents[i] > size.ascent ) ? Ascents[i] : size.ascent;
            Descents[i] = (Descents[i] > size.height - size.ascent ) ? Descents[i] : size.height - size.ascent;
        }

    var Heights = [];
    for(tt = 0; tt < this.nRow; tt++ )
    {
        Heights[tt] = Ascents[tt] + Descents[tt];
    }

    return { widths: Widths, heights: Heights };
};
CMathBase.prototype.align = function(pos_x, pos_y)
{
    var PosAlign = new CMathPosition();

    if(this.alignment.hgt[pos_x] == MCJC_CENTER)
    {
        var maxAsc = 0;
        var _ascent;

        for(var j = 0; j < this.nCol; j++)
        {
            _ascent = this.elements[pos_x][j].size.ascent;
            maxAsc = ( maxAsc > _ascent ) ? maxAsc : _ascent;
        }
        PosAlign.y = (maxAsc - this.elements[pos_x][pos_y].size.ascent);
    }
    else
    {
        var maxH = 0;
        var _h;

        for(var j = 0; j < this.nCol; j++)
        {
            _h = this.elements[pos_x][j].size.height;
            maxH = ( maxH > _h ) ? maxH : _h;
        }

        var coeffHgt;
        if(this.alignment.hgt[pos_x] == MCJC_RIGHT)
            coeffHgt = 1;
        else
            coeffHgt = 0;

        PosAlign.y = (maxH - this.elements[pos_x][pos_y].size.height)*coeffHgt;
    }

    var maxW  = 0;
    for(var i=0; i < this.nRow; i++)
    {
        var _w = this.elements[i][pos_y].size.width;
        maxW = ( maxW > _w ) ? maxW : _w;
    }

    if(this.alignment.wdt[pos_y] == MCJC_CENTER)
        PosAlign.x = (maxW - this.elements[pos_x][pos_y].size.width)*0.5;
    else
    {
        var coeffWdt;
        if(this.alignment.wdt[pos_y] == MCJC_RIGHT)
            coeffWdt = 1;
        else
            coeffWdt = 0;

        PosAlign.x = (maxW - this.elements[pos_x][pos_y].size.width)*coeffWdt;
    }

    return PosAlign;
};
CMathBase.prototype.setPosition = function(pos, PRSA, Line, Range, Page)
{
    if(this.bOneLine)
    {
        this.pos.x = pos.x;

        if(this.bInside === true)
            this.pos.y = pos.y;
        else
            this.pos.y = pos.y - this.size.ascent; ///!!!!

        this.Bounds.SetPos(0, pos, PRSA);
        this.Bounds.SetPage(0, Page);

        var maxWH = this.getWidthsHeights();
        var Widths = maxWH.widths;
        var Heights = maxWH.heights;

        var h = 0, w = 0;

        for(var i=0; i < this.nRow; i++)
        {
            w = 0;
            for(var j = 0; j < this.nCol; j++)
            {
                var NewPos = new CMathPosition();
                var al = this.align(i, j);

                NewPos.x = this.pos.x + this.GapLeft + al.x + this.dW*j + w;
                NewPos.y = this.pos.y + al.y + this.dH*i + h;

                if(this.elements[i][j].Type == para_Math_Content) // прибавим ascent только для контентов, для вложенных мат объектов не добавляем !
                    NewPos.y += this.elements[i][j].size.ascent;

                this.elements[i][j].setPosition(NewPos, PRSA, Line, Range, Page);
                w += Widths[j];
            }
            h += Heights[i];
        }

        pos.x += this.size.width;

    }
    else
    {
        var CurLine  = Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? Range - this.StartRange : Range );

        this.Bounds.SetPos(CurLine, pos, PRSA);
        this.Bounds.SetPage(CurLine, Page);

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        if(CurLine == 0 && CurRange == 0)
            pos.x += this.BrGapLeft;

        this.Content[StartPos].setPosition(pos, PRSA, Line, Range, Page);

        for(var Pos = StartPos + 1; Pos <= EndPos; Pos++)
        {
            pos.x += this.dW;
            this.Content[Pos].setPosition(pos, PRSA, Line, Range, Page);
        }

        var LinesCount = this.protected_GetLinesCount();

        if(LinesCount - 1 == CurLine)
            pos.x += this.BrGapRight;

    }
};
CMathBase.prototype.draw = function(x, y, pGraphics, PDSE)
{
    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp()); // для Just-Draw элементов

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
        {
            if(this.elements[i][j].IsJustDraw()) // для Just-Draw элементов надо выставить Font
            {
                var ctrPrp = this.Get_TxtPrControlLetter();

                var Font =
                {
                    FontSize:   ctrPrp.FontSize,
                    FontFamily: {Name : ctrPrp.FontFamily.Name, Index : ctrPrp.FontFamily.Index},
                    Italic:     false,
                    Bold:       false //ctrPrp.Bold
                };

                pGraphics.SetFont(Font);
            }

            this.elements[i][j].draw(x, y, pGraphics, PDSE);
        }
};
CMathBase.prototype.Draw_Elements = function(PDSE)
{
    if(this.bOneLine)
    {
        var X = PDSE.X;

        this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp()); // для Just-Draw элементов

        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                if(this.elements[i][j].IsJustDraw()) // для Just-Draw элементов надо выставить Font
                {
                    var ctrPrp = this.Get_TxtPrControlLetter();

                    var Font =
                    {
                        FontSize:   ctrPrp.FontSize,
                        FontFamily: {Name : ctrPrp.FontFamily.Name, Index : ctrPrp.FontFamily.Index},
                        Italic:     false,
                        Bold:       false //ctrPrp.Bold
                    };

                    PDSE.Graphics.SetFont(Font);
                }

                this.elements[i][j].Draw_Elements(PDSE);
            }
        }

        PDSE.X = X + this.size.width;
    }
    else
    {
        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        if(CurLine == 0 && CurRange == 0)
            PDSE.X += this.BrGapLeft;

        this.Content[StartPos].Draw_Elements(PDSE);

        for (var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++ )
        {
            PDSE.X += this.dW;
            this.Content[CurPos].Draw_Elements(PDSE);
        }

        var LinesCount = this.protected_GetLinesCount();

        if(LinesCount - 1 == CurLine)
        {
            PDSE.X += this.BrGapRight;
        }
    }
};
CMathBase.prototype.remove = function(order)
{
    return this.Parent.remove(order);
};
CMathBase.prototype.ApplyProperties = function(RPI)
{};
CMathBase.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI, GapsInfo)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);

    this.ApplyProperties(RPI);

    // setGaps обязательно после того как смержили CtrPrp (Set_CompiledCtrPrp)
    if(this.bInside == false)
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
            this.elements[i][j].PreRecalc(this, ParaMath, ArgSize, RPI);

};
CMathBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    var width = 0;
    var height = 0;

    var maxWH = this.getWidthsHeights();

    this.setDistance();

    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    for( var j = 0 ; j < this.nRow; j++ )
        height += Heights[j];

    height += this.dH*(this.nRow - 1);

    for(var i=0; i < this.nCol ; i++)
        width += Widths[i];

    width += this.dW*(this.nCol - 1) + this.GapLeft + this.GapRight;

    var ascent = this.getAscent(oMeasure, height);

    this.size.width  = width;
    this.size.height = height;
    this.size.ascent = ascent;
}
CMathBase.prototype.Resize = function(oMeasure, RPI)
{
    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
        {
            if(this.elements[i][j].IsJustDraw()) // для Just-Draw элементов надо выставить Font
            {
                var ctrPrp = this.Get_TxtPrControlLetter();

                var Font =
                {
                    FontSize:   ctrPrp.FontSize,
                    FontFamily: {Name : ctrPrp.FontFamily.Name, Index : ctrPrp.FontFamily.Index},
                    Italic:     false,
                    Bold:       false //ctrPrp.Bold
                };

                g_oTextMeasurer.SetFont(Font);
            }

            this.elements[i][j].Resize(oMeasure, RPI);
        }


    this.recalculateSize(oMeasure, RPI);
};
CMathBase.prototype.Resize_2 = function(oMeasure, Parent, ParaMath, RPI, ArgSize)
{
    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
            if(!this.elements[i][j].IsJustDraw())
                this.elements[i][j].Resize_2(oMeasure, this, ParaMath, RPI, ArgSize);
};
CMathBase.prototype.Set_CompiledCtrPrp = function(Parent, ParaMath, RPI)
{
    if(this.RecalcInfo.bCtrPrp == true || (RPI !== null && RPI !== undefined && RPI.bRecalcCtrPrp == true))
    {
        if (undefined === ParaMath || null === ParaMath)
        {
            this.CompiledCtrPrp = new CTextPr();
            this.CompiledCtrPrp.Init_Default();
            return;
        }

        // Получим настройки текста, для данного параграфа
        this.CompiledCtrPrp = ParaMath.Paragraph.Get_CompiledPr2(false).TextPr.Copy();

        this.CompiledCtrPrp.Merge(ParaMath.Get_Default_TPrp());

        // Если в прямых настройках задан стиль, тогда смержим настройки стиля
        if ( undefined != this.CtrPrp.RStyle )
        {
            var Styles = ParaMath.Paragraph.Parent.Get_Styles();
            var StyleTextPr = Styles.Get_Pr( this.CtrPrp.RStyle, styletype_Character ).TextPr;
            this.CompiledCtrPrp.Merge( StyleTextPr );
        }

        var defaultTxtPrp = ParaMath.Get_Default_TPrp();

        this.CompiledCtrPrp.FontFamily =
        {
            Name:       defaultTxtPrp.FontFamily.Name,
            Index:      defaultTxtPrp.FontFamily.Index
        };

        this.CompiledCtrPrp.Merge(this.CtrPrp);

        // for Control Letter

        var FontSize = ParaMath.GetFirstRPrp().FontSize;

        if(this.bInside == true)
        {
            var TxtPr = Parent.Get_TxtPrControlLetter(RPI); // чтобы применился ArgSize Parent

            FontSize = TxtPr.FontSize;
            FontSize *= MatGetKoeffArgSize(FontSize, this.ArgSize.value);
        }
        else
        {
            FontSize *= MatGetKoeffArgSize(FontSize, Parent.Get_CompiledArgSize().value);
            FontSize *= MatGetKoeffArgSize(FontSize, this.ArgSize.value);
        }

        this.TextPrControlLetter.FontSize = FontSize;
        this.TextPrControlLetter.FontFamily =
        {
            Name:       defaultTxtPrp.FontFamily.Name,
            Index:      defaultTxtPrp.FontFamily.Index
        }; // Cambria Math


        this.RecalcInfo.bCtrPrp = false;
    }
};
CMathBase.prototype.getAscent = function(oMeasure, _height)
{
    var Ascent = 0;
    if(this.nRow > 1)
    {
        Ascent = _height;
        Ascent /=2;
        var MergedCtrPrp = this.Get_CompiledCtrPrp();
        Ascent += this.ParaMath.GetShiftCenter(oMeasure, MergedCtrPrp);
    }
    else
        for(var i=0; i< this.nCol; i++)
            Ascent = (this.elements[0][i].size.ascent > Ascent) ?  this.elements[0][i].size.ascent : Ascent;

    return Ascent;
};
CMathBase.prototype.alignHor = function(pos, coeff)
{
    if(pos!=-1)
        this.alignment.wdt[pos] = coeff;
    else
        for(var j = 0; j< this.alignment.wdt.length; j++)
            this.alignment.wdt[j] = coeff;

}
CMathBase.prototype.alignVer = function(pos, coeff)
{
    if(pos!=-1)
        this.alignment.hgt[pos] = coeff;
    else
        for(var j = 0; j < this.alignment.hgt.length; j++)
            this.alignment.hgt[j] = coeff;
};
CMathBase.prototype.setDistance = function()
{

};
CMathBase.prototype.hidePlaceholder = function(flag)
{
    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
        {
            if( this.elements[i][j].IsJustDraw() == false )
                this.elements[i][j].hidePlaceholder(flag);
        }
};
CMathBase.prototype.getElement = function(x, y)
{
    return this.elements[x][y];
};
CMathBase.prototype.IsOneLineText = function() // for degree
{
    var bOneLineText = true;
    if(this.nRow == 1)
    {
        for(var j = 0; j < this.nCol; j++)
        {
            if(!this.elements[0][j].IsJustDraw() && !this.elements[0][j].IsOneLineText())
            {
                bOneLineText = false;
                break;
            }
        }
    }
    else
        bOneLineText = false;


    return bOneLineText;
};
////    For Edit   /////
CMathBase.prototype.getGapsInside = function(GapsInfo)
{
    var kind = this.kind;
    var gaps = {left: 0, right: 0};
    var checkBase = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL || kind == MATH_LIMIT || kind == MATH_BORDER_BOX;

    if(checkBase)
    {
        var base = this.getBase();
        gaps = base.getGapsInside(GapsInfo);
    }

    return gaps;
};
CMathBase.prototype.SetGaps = function(GapsInfo)
{
    //this.Parent   = GapsInfo.Parent;
    //this.ParaMath = GapsInfo.ParaMath;

    GapsInfo.Left       = GapsInfo.Current;
    GapsInfo.leftRunPrp = GapsInfo.currRunPrp;


    GapsInfo.Current    = this;
    GapsInfo.currRunPrp = this.Get_CompiledCtrPrp();

    GapsInfo.setGaps();

};
CMathBase.prototype.Is_EmptyGaps = function()
{
    return false;
};
//////////////////////////////////
CMathBase.prototype.IsPlaceholder = function()
{
    return false;
};
CMathBase.prototype.IsText = function()
{
    return false;
};
CMathBase.prototype.GetParent = function()
{
    return (this.Parent.Type !== para_Math_Composition ? this : this.Parent.GetParent());
};
CMathBase.prototype.Get_TextPr = function(ContentPos, Depth)
{
    var pos = ContentPos.Get(Depth);

    return this.Content[pos].Get_TextPr(ContentPos, Depth+1);
};
CMathBase.prototype.Get_CompiledTextPr  = function(Copy)
{
    var  TextPr = this.Content[0].Get_CompiledTextPr(true, true);

    for(var i = 1; i < this.Content.length; i++)
    {
        var CurTextPr = this.Content[i].Get_CompiledTextPr(false, true);

        if ( null !== CurTextPr )
            TextPr = TextPr.Compare( CurTextPr );
    }

    return TextPr;
};
CMathBase.prototype.Get_CompiledPr = function(Copy)
{
    return this.Get_CompiledTextPr(Copy);
};
CMathBase.prototype.Apply_TextPr = function(TextPr, IncFontSize, ApplyToAll)
{
    if(ApplyToAll == true)
        this.RecalcInfo.bCtrPrp = true;

    if(TextPr == undefined)
    {
        var CtrPrp = this.Get_CompiledCtrPrp_2();
        this.Set_FontSizeCtrPrp(FontSize_IncreaseDecreaseValue( IncFontSize, CtrPrp.FontSize ));
    }
    else
    {
        if(TextPr.FontSize !== undefined)
            this.Set_FontSizeCtrPrp(TextPr.FontSize);

        if(TextPr.Shd !== undefined)
            this.Set_Shd(TextPr.Shd);

        if ( undefined !== TextPr.Color && undefined === TextPr.Unifill )
        {
            this.Set_Color( null === TextPr.Color ? undefined : TextPr.Color );
            this.Set_Unifill( undefined );
        }

        if ( undefined !== TextPr.Unifill )
        {
            this.Set_Unifill(null === TextPr.Unifill ? undefined : TextPr.Unifill);
            this.Set_Color(undefined);
        }

        if(undefined !== TextPr.Underline)
        {
            this.Set_Underline(TextPr.Underline);
        }

        if(undefined !== TextPr.Strikeout)
        {
            this.Set_Strikeout(TextPr.Strikeout);
        }

        if(undefined !== TextPr.DStrikeout)
        {
            this.Set_DoubleStrikeout(TextPr.DStrikeout);
        }

        if ( undefined != TextPr.RFonts )
        {
            var RFonts = new CRFonts();
            RFonts.Set_All("Cambria Math", -1);

            this.raw_SetRFonts(RFonts);
        }
    }


    // нужно пройтись по всем элементам  и вложенным формулам в том числе, чтобы пересчитать ctrPrp у всех мат объектов
    // для некоторых формул (например, для итератора в Limit) важно учесть собственные настройки (ArgSize), а не только родительские, поэтому и нужно профтись по всем inline-формулам

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
            if(!this.elements[i][j].IsJustDraw())
                this.elements[i][j].Apply_TextPr(TextPr, IncFontSize, ApplyToAll);

    // такая ситуация может возникнуть при добавлении элементов из меню, и чтобы применились текстовые настройки при вставке нужно пройтись по контентам
    // a Resize произойдет позже, после вставки = > массив this.elements заполнится позднее
    if(this.nRow == 0 && this.nCol == 0)
    {
        for(var i = 0 ; i < this.Content.length; i++)
        {
            this.Content[i].Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
        }
    }

};
CMathBase.prototype.GetMathTextPrForMenu = function(ContentPos, Depth)
{
    var pos = ContentPos.Get(Depth);

    return this.Content[pos].GetMathTextPrForMenu(ContentPos, Depth+1);
};
CMathBase.prototype.Set_MathTextPr2 = function(TextPr, MathPr, bAll)
{
    this.Set_FontSizeCtrPrp(TextPr.FontSize);

    for(var i = 0; i < this.Content.length; i++)
        this.Content[i].Set_MathTextPr2(TextPr, MathPr, bAll);
};
CMathBase.prototype.Set_FontSizeCtrPrp = function(Value)
{
    if ( Value !== this.CtrPrp.FontSize )
    {
        History.Add(this, new CChangesMathFontSize(Value, this.CtrPrp.FontSize));
        this.raw_SetFontSize(Value);
    }
};
CMathBase.prototype.Set_Color = function(Value)
{
    if ( ( undefined === Value && undefined !== this.CtrPrp.Color ) || ( Value instanceof CDocumentColor && ( undefined === this.CtrPrp.Color || false === Value.Compare(this.CtrPrp.Color) ) ) )
    {
        History.Add( this,  new CChangesMathColor(Value, this.CtrPrp.Color));
        this.raw_SetColor(Value);
    }
};
CMathBase.prototype.Set_Unifill = function(Value)
{
    if ( ( undefined === Value && undefined !== this.CtrPrp.Unifill ) || ( Value instanceof CUniFill && ( undefined === this.CtrPrp.Unifill || false === CompareUnifillBool(this.CtrPrp.Unifill, Value) ) ) )
    {
        History.Add(this, new CChangesMathUnifill(Value, this.CtrPrp.Unifill));
        this.raw_SetUnifill(Value);
    }
};
CMathBase.prototype.Set_Shd = function(Shd)
{
    if ( !(undefined === this.CtrPrp.Shd && undefined === Shd) && !(undefined !== this.CtrPrp.Shd && undefined !== Shd && true === this.CtrPrp.Shd.Compare( Shd ) ) )
    {
        History.Add(this, new CChangesMathShd(Shd, this.CtrPrp.Shd));
        this.raw_SetShd(Shd);
    }
};
CMathBase.prototype.Set_Underline = function(Value)
{
    if ( Value !== this.CtrPrp.Underline )
    {
        History.Add(this, new CChangesMathUnderline(Value, this.CtrPrp.Underline));
        this.raw_SetUnderline(Value);
    }
};
CMathBase.prototype.Set_Strikeout = function(Value)
{
    if ( Value !== this.CtrPrp.Strikeout )
    {
        History.Add(this, new CChangesMathStrikeout(Value, this.CtrPrp.Strikeout));
        this.raw_SetStrikeout(Value);
    }
};
CMathBase.prototype.Set_DoubleStrikeout = function(Value)
{
    if(Value !== this.CtrPrp.DStrikeout)
    {
        History.Add(this, new CChangesMath_DoubleStrikeout(Value, this.CtrPrp.DStrikeout));
        this.raw_Set_DoubleStrikeout(Value);
    }
};
CMathBase.prototype.Set_Bold = function(Value)
{
    if(Value !== this.CtrPrp.Bold)
    {
        History.Add(this, new CChangesMathBold(Value, this.CtrPrp.Bold));
        this.raw_SetBold(Value);
    }
};
CMathBase.prototype.Set_Italic = function(Value)
{
    if(Value !== this.CtrPrp.Italic)
    {
        History.Add(this, new CChangesMathItalic(Value, this.CtrPrp.Italic));
        this.raw_SetItalic(Value);
    }
};
CMathBase.prototype.Set_RFonts_Ascii = function(Value)
{
    if(this.CtrPrp.RFonts.Ascii !== Value)
    {
        History.Add(this, new CChangesMath_RFontsAscii(Value, this.CtrPrp.RFonts.Ascii));
        this.raw_SetRFontsAscii(Value);
    }
};
CMathBase.prototype.Set_RFonts_HAnsi = function(Value)
{
    if(this.CtrPrp.RFonts.HAnsi !== Value)
    {
        History.Add(this, new CChangesMath_RFontsHAnsi(Value, this.CtrPrp.RFonts.HAnsi));
        this.raw_SetRFontsHAnsi(Value);
    }
};
CMathBase.prototype.Set_RFonts_CS = function(Value)
{
    if(this.CtrPrp.RFonts.CS !== Value)
    {
        History.Add(this, new CChangesMath_RFontsCS(Value, this.CtrPrp.RFonts.CS));
        this.raw_SetRFontsCS(Value);
    }
};
CMathBase.prototype.Set_RFonts_EastAsia = function(Value)
{
    if(this.CtrPrp.RFonts.EastAsia !== Value)
    {
        History.Add(this, new CChangesMath_RFontsEastAsia(Value, this.CtrPrp.RFonts.EastAsia));
        this.raw_SetRFontsEastAsia(Value);
    }
};
CMathBase.prototype.Set_RFonts_Hint = function(Value)
{
    if(this.CtrPrp.RFonts.Hint !== Value)
    {
        History.Add(this, new CChangesMath_RFontsHint(Value, this.CtrPrp.RFonts.Hint));
        this.raw_SetRFontsHint(Value);
    }
};
CMathBase.prototype.raw_SetBold = function(Value)
{
    this.CtrPrp.Bold = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetItalic = function(Value)
{
    this.CtrPrp.Italic = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetUnderline  = function(Value)
{
    this.CtrPrp.Underline = Value;
    this.NeedUpdate_CtrPrp();

};
CMathBase.prototype.raw_SetStrikeout = function(Value)
{
    this.CtrPrp.Strikeout = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_Set_DoubleStrikeout = function(Value)
{
    this.CtrPrp.DStrikeout = Value;
    this.NeedUpdate_CtrPrp();

};
CMathBase.prototype.raw_SetFontSize  = function(Value)
{
    this.CtrPrp.FontSize    = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetShd = function(Shd)
{
    if ( undefined !== Shd )
    {
        this.CtrPrp.Shd = new CDocumentShd();
        this.CtrPrp.Shd.Set_FromObject( Shd );
    }
    else
        this.CtrPrp.Shd = undefined;

    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetColor = function(Value)
{
    this.CtrPrp.Color = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetUnifill = function(Value)
{
    this.CtrPrp.Unifill = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetRFonts = function(RFonts)
{
    if ( undefined != RFonts )
    {
        if ( undefined != RFonts.Ascii )
            this.Set_RFonts_Ascii( RFonts.Ascii );

        if ( undefined != RFonts.HAnsi )
            this.Set_RFonts_HAnsi( RFonts.HAnsi );

        if ( undefined != RFonts.CS )
            this.Set_RFonts_CS( RFonts.CS );

        if ( undefined != RFonts.EastAsia )
            this.Set_RFonts_EastAsia( RFonts.EastAsia );

        if ( undefined != RFonts.Hint )
            this.Set_RFonts_Hint( RFonts.Hint );
    }
    else
    {
        this.Set_RFonts_Ascii( undefined );
        this.Set_RFonts_HAnsi( undefined );
        this.Set_RFonts_CS( undefined );
        this.Set_RFonts_EastAsia( undefined );
        this.Set_RFonts_Hint( undefined );
    }
};
CMathBase.prototype.raw_SetRFontsAscii = function(Value)
{
    this.CtrPrp.RFonts.Ascii = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetRFontsHAnsi = function(Value)
{
    this.CtrPrp.RFonts.HAnsi = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetRFontsCS = function(Value)
{
    this.CtrPrp.RFonts.CS = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetRFontsEastAsia = function(Value)
{
    this.CtrPrp.RFonts.EastAsia = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetRFontsHint = function(Value)
{
    this.CtrPrp.RFonts.Hint = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.NeedUpdate_CtrPrp = function()
{
    this.RecalcInfo.bCtrPrp = true;

    if(null !== this.ParaMath)
        this.ParaMath.SetNeedResize();
};
CMathBase.prototype.SelectToParent = function(bCorrect)
{
    this.bSelectionUse = true;
    this.Parent.SelectToParent(bCorrect);
};
CMathBase.prototype.Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    var Result = this.Content[this.CurPos].Get_StartRangePos(_CurLine, _CurRange, SearchPos, Depth+1);

    if ( true === Result )
        SearchPos.Pos.Update( this.CurPos, Depth );

    return Result;

};
CMathBase.prototype.Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth)
{
    var Result = this.Content[this.CurPos].Get_EndRangePos(_CurLine, _CurRange, SearchPos, Depth+1);

    if ( true === Result )
        SearchPos.Pos.Update( this.CurPos, Depth );

    return Result;

};
CMathBase.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var WidthVisible;

    if(this.bOneLine)
    {
        if ( 0 !== PRSA.LettersSkip )
        {
            WidthVisible = this.size.width;
            PRSA.LettersSkip--;
        }
        else
            WidthVisible = this.size.width + PRSA.JustifyWord;

        PRSA.X    += WidthVisible;
        PRSA.LastW = WidthVisible;
    }
    else
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        if(CurLine == 0 && CurRange == 0)
            PRSA.X += this.BrGapLeft;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if(CurPos == this.NumBreakContent)
            {
                Item.Recalculate_Range_Spaces( PRSA, _CurLine, _CurRange, _CurPage );
            }
            else
            {
                if ( 0 !== PRSA.LettersSkip )
                {
                    WidthVisible = Item.size.width;
                    PRSA.LettersSkip--;
                }
                else
                    WidthVisible = Item.size.width + PRSA.JustifyWord;

                PRSA.LastW = WidthVisible;
                PRSA.X    += WidthVisible;
            }
        }

        PRSA.X += this.dW*(EndPos - StartPos);

        var Len = this.Content.length;

        // Здесь проверяем не на колво строк, т.к. на данном этапе еще идет вычисление строк, а на конец контента !

        if(EndPos == Len - 1)
        {
            var EndBrContentEnd = this.NumBreakContent == EndPos && this.Content[EndPos].Math_Is_End( _CurLine, _CurRange),
                NotBrContent = this.NumBreakContent !== EndPos;

            if(EndBrContentEnd || NotBrContent)
                PRSA.X += this.BrGapRight;
        }
    }
};
CMathBase.prototype.Get_Width = function(_CurLine)
{
    var Width = 0;

    if(this.bOneLine)
    {
        Width = this.size.width;
    }
    else
    {
        var CurLine  = _CurLine - this.StartLine;
        Width = this.Bounds.GetWidth(CurLine);
        //Width = this.LineMetrics.GetWidth(CurLine);
    }

    return Width;
};
CMathBase.prototype.Set_Paragraph           = CParagraphContentWithParagraphLikeContent.prototype.Set_Paragraph;
CMathBase.prototype.Get_ElementByPos        = CParagraphContentWithParagraphLikeContent.prototype.Get_ElementByPos;
CMathBase.prototype.Get_ParaPosByContentPos = CParagraphContentWithParagraphLikeContent.prototype.Get_ParaPosByContentPos;

CMathBase.prototype.Set_ParaMath     = CMathContent.prototype.Set_ParaMath;
CMathBase.prototype.Recalculate_Reset = function(StartRange, StartLine)
{
    this.StartLine   = StartLine;
    this.StartRange  = StartRange;

    this.protected_ClearLines();

    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++)
    {
        this.Content[nPos].Recalculate_Reset(StartRange, StartLine);
    }
};
CMathBase.prototype.Fill_LogicalContent = function(nCount)
{
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex] = new CMathContent();
        this.Content[nIndex].ParentElement = this;
        this.Content[nIndex].Parent        = this;
    }
};
CMathBase.prototype.Copy = function()
{
    var oProps = this.Pr.Copy();
    oProps.ctrPrp = this.CtrPrp.Copy();

    var NewElement = new this.constructor(oProps);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].CopyTo(NewElement.Content[nIndex], false);
    }

    return NewElement;
};
CMathBase.prototype.Refresh_RecalcData = function(Data)
{
    if(this.ParaMath !== null)
        this.ParaMath.Refresh_RecalcData(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
};
CMathBase.prototype.Write_ToBinary2 = function( Writer )
{
    Writer.WriteLong(this.ClassType);

    // String           : Id
    // Long             : Content.length
    // Array of Strings : Content[Index].Id
    // Variable         : Pr
    // Variable(CTextPr): CtrPrp

    Writer.WriteString2(this.Id);

    var nCount = this.Content.length;
    Writer.WriteLong(nCount);
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        Writer.WriteString2(this.Content[nIndex].Id);
    }

    this.Pr.Write_ToBinary(Writer);
    this.CtrPrp.Write_ToBinary(Writer);
};
CMathBase.prototype.Read_FromBinary2 = function( Reader )
{
    // String           : Id
    // Long             : Content.length
    // Array of Strings : Content[Index].Id
    // Variable         : Pr
    // Variable(CTextPr): CtrPrp

    this.Id = Reader.GetString2();

    var nCount = Reader.GetLong();
    this.Content = [];
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex] = g_oTableId.Get_ById(Reader.GetString2());
        this.Content[nIndex].ParentElement = this;
        this.Content[nIndex].Parent        = this;
    }

    this.Pr.Read_FromBinary(Reader);
    this.CtrPrp.Read_FromBinary(Reader);

    this.fillContent();
}
CMathBase.prototype.Get_Id = function()
{
    return this.Id;
};
CMathBase.prototype.getPropsForWrite = function()
{
    return this.Pr;
};
CMathBase.prototype.setProperties = function(oProps)
{
    this.Pr.Set_FromObject(oProps);
    this.setCtrPrp(oProps.ctrPrp);

    this.RecalcInfo.bProps = true;
}
CMathBase.prototype.Correct_Content = function(bInnerCorrection)
{
    var nCount = this.Content.length;
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].Correct_Content(bInnerCorrection);
    }
};
CMathBase.prototype.Undo = function(Data)
{
    Data.Undo(this);
};
CMathBase.prototype.Redo = function(Data)
{
    Data.Redo(this);
};
CMathBase.prototype.Save_Changes = function(Data, Writer)
{
    Writer.WriteLong(this.ClassType);
    WriteChanges_ToBinary(Data, Writer);
};
CMathBase.prototype.Load_Changes = function(Reader)
{
    var ClassType = Reader.GetLong();

    if (this.ClassType !== ClassType)
        return;

    ReadChanges_FromBinary(Reader, this);
};
CMathBase.prototype.Get_AllFontNames = function(AllFonts)
{
    this.CtrPrp.Document_Get_AllFontNames(AllFonts);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex].Get_AllFontNames(AllFonts);
    }
};
CMathBase.prototype.Create_FontMap = function(Map)
{
    if (null === this.ParaMath)
        return;

    var CtrPrp = this.Get_CompiledCtrPrp();
    CtrPrp.Document_CreateFontMap(Map, this.ParaMath.Paragraph.Get_Theme().themeElements.fontScheme);

    for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; nIndex++)
        this.Content[nIndex].Create_FontMap(Map);
};
CMathBase.prototype.Recalculate_CurPos = function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
{
    return this.Content[this.CurPos].Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
};
CMathBase.prototype.old_Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var nCount = this.Content.length;
    if (nCount <= 0)
        return false;

    var aBounds = [];
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        var oBounds = this.Content[nIndex].Get_Bounds();
        if (oBounds.W > 0.001 && oBounds.H > 0.001)
            aBounds.push(oBounds);
        else
            aBounds.push(null);
    }

    var X = SearchPos.X;
    var Y = SearchPos.Y;

    var dDiff = null;

    var nCurIndex = 0;
    var nFindIndex = 0;

    while (nCurIndex < nCount)
    {
        var oBounds = aBounds[nCurIndex];

        if (null !== oBounds)
        {
            if (oBounds.X <= X && X <= oBounds.X + oBounds.W && oBounds.Y <= Y && Y <= oBounds.Y + oBounds.H)
            {
                nFindIndex = nCurIndex;
                break;
            }
            else
            {
                var dCurDiffX = X - (oBounds.X + oBounds.W / 2);
                var dCurDiffY = Y - (oBounds.Y + oBounds.H / 2);
                var dCurDiff = dCurDiffX * dCurDiffX + dCurDiffY * dCurDiffY;

                if (null === dDiff || dDiff > dCurDiff)
                {
                    dDiff = dCurDiff;
                    nFindIndex = nCurIndex;
                }
            }
        }

        nCurIndex++;
    }

    if (null === aBounds[nFindIndex])
        return false;

    SearchPos.CurX = aBounds[nFindIndex].X;
    SearchPos.CurY = aBounds[nFindIndex].Y;

    var bResult = this.Content[nFindIndex].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd);
    if(true === bResult)
    {
        SearchPos.Pos.Update2(nFindIndex, Depth);
    }

    return bResult;
};
CMathBase.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var bResult = false;

    var nCount = this.Content.length;
    if (nCount <= 0)
        return false;

    if(this.bOneLine)
    {
        var aBounds = [];
        for (var nIndex = 0; nIndex < nCount; nIndex++)
        {
            var oBounds = this.Content[nIndex].Get_LineBound(_CurLine);
            if (oBounds.W > 0.001 && oBounds.H > 0.001)
                aBounds.push(oBounds);
            else
                aBounds.push(null);
        }

        var X = SearchPos.X;
        var Y = SearchPos.Y;

        var dDiff = null;

        var nCurIndex = 0;
        var nFindIndex = 0;

        //var PosLine = this.ParaMath.GetLinePosition(_CurLine);

        while (nCurIndex < nCount)
        {
            var oBounds = aBounds[nCurIndex];

            if (null !== oBounds)
            {
                var _X = oBounds.X,
                    _Y = oBounds.Y;

                if (_X <= X && X <= _X + oBounds.W && _Y <= Y && Y <= _Y + oBounds.H)
                {
                    nFindIndex = nCurIndex;
                    break;
                }
                else
                {
                    var dCurDiffX = X - (_X + oBounds.W / 2);
                    var dCurDiffY = Y - (_Y + oBounds.H / 2);
                    var dCurDiff = dCurDiffX * dCurDiffX + dCurDiffY * dCurDiffY;

                    if (null === dDiff || dDiff > dCurDiff)
                    {
                        dDiff = dCurDiff;
                        nFindIndex = nCurIndex;
                    }
                }
            }

            nCurIndex++;
        }

        if (null === aBounds[nFindIndex])
            return false;

        SearchPos.CurX = aBounds[nFindIndex].X;
        SearchPos.CurY = aBounds[nFindIndex].Y;

        bResult = this.Content[nFindIndex].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd);
        if(true === bResult)
        {
            SearchPos.Pos.Update2(nFindIndex, Depth);
        }
    }
    else
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        for (var Pos = StartPos; Pos <= EndPos; Pos++)
        {
            if ( false === SearchPos.InText )
                SearchPos.InTextPos.Update2( Pos, Depth );

            if(true == this.Content[Pos].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd))
            {
                SearchPos.Pos.Update2( Pos, Depth );
                bResult = true;
            }
        }
    }

    return bResult;
};
CMathBase.prototype.Get_ParaContentPos = function(bSelection, bStart, ContentPos)
{
    var nPos = (true !== bSelection ? this.CurPos : (false !== bStart ? this.Selection.StartPos : this.Selection.EndPos));
    ContentPos.Add(nPos);

    if (undefined !== this.Content[nPos])
        this.Content[nPos].Get_ParaContentPos(bSelection, bStart, ContentPos);
};
CMathBase.prototype.Set_ParaContentPos = function(ContentPos, Depth)
{
    var CurPos = ContentPos.Get(Depth);

    if (undefined === CurPos || this.CurPos < 0)
    {
        this.CurPos = 0;
        this.Content[this.CurPos].Cursor_MoveToStartPos();
    }
    else if (CurPos > this.Content.length - 1)
    {
        this.CurPos = this.Content.length - 1;
        this.Content[this.CurPos].Cursor_MoveToEndPos(false);
    }
    else
    {
        this.CurPos = CurPos;
        this.Content[this.CurPos].Set_ParaContentPos(ContentPos, Depth + 1);
    }
};
CMathBase.prototype.Selection_DrawRange = function(_CurLine, _CurRange, SelectionDraw)
{
    if(this.bOneLine)
    {
        var SelectionStartPos = this.Selection.StartPos;
        var SelectionEndPos   = this.Selection.EndPos;

        var SelectionUse = this.Selection.Use;

        if(SelectionUse == true)
        {
            if(SelectionStartPos !== SelectionEndPos)
            {
                SelectionDraw.FindStart = false;
                SelectionDraw.W += this.size.width;
            }
            else
            {
                var Item = this.Content[SelectionStartPos];

                var PosLine = this.ParaMath.GetLinePosition(_CurLine);

                SelectionDraw.StartX = PosLine.x + Item.pos.x;
                SelectionDraw.StartY = PosLine.y + Item.pos.y - Item.size.ascent;
                SelectionDraw.H      = Item.size.height;

                Item.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
            }
        }
        else if(SelectionDraw.FindStart == true)
        {
            SelectionDraw.StartX += this.size.width;
        }
    }
    else
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);



        var SelectionStartPos = this.Selection.StartPos;
        var SelectionEndPos   = this.Selection.EndPos;
        var SelectionUse = this.Selection.Use;

        if(SelectionUse == true && SelectionStartPos !== SelectionEndPos)
        {
            SelectionDraw.FindStart = false;
            SelectionDraw.W += this.Bounds.GetWidth(CurLine);

        }
        else
        {
            if(CurLine == 0)
            {
                if(SelectionDraw.FindStart == true)
                    SelectionDraw.StartX += this.BrGapLeft;
                else if(SelectionUse == true)
                    SelectionDraw.W += this.BrGapLeft;
            }

            this.Content[StartPos].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);

            var Len = SelectionUse == true ? Math.min(EndPos, SelectionStartPos) : EndPos;

            for(var Pos = StartPos + 1; Pos <= Len; Pos++)
            {
                var Item = this.Content[Pos];

                if(SelectionDraw.FindStart == true)
                    SelectionDraw.StartX += this.dW;
                else if(SelectionUse == true)
                    SelectionDraw.W += this.dW;

                Item.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
            }

            var LinesCount = this.protected_GetLinesCount();

            if(SelectionDraw.FindStart == true && LinesCount - 1 == CurLine)
                SelectionDraw.StartX += this.BrGapRight;
        }
    }
};
CMathBase.prototype.Selection_IsEmpty = function()
{
    if (true !== this.Selection.Use)
        return true;

    if (this.Selection.StartPos === this.Selection.EndPos)
        return this.Content[this.Selection.StartPos].Selection_IsEmpty();

    return false;
};
CMathBase.prototype.GetSelectContent = function()
{
    var nPos = (true === this.Selection.Use ? this.Selection.StartPos : this.CurPos);
    return this.Content[nPos].GetSelectContent();
};
CMathBase.prototype.Is_InnerSelection = function()
{
    if (true === this.Selection.Use && this.Selection.StartPos === this.Selection.EndPos)
        return true;

    return false;
};
CMathBase.prototype.Select_WholeElement = function()
{
    if (null !== this.Parent)
        this.Parent.Select_Element(this, true);
};
CMathBase.prototype.Select_MathContent = function(MathContent)
{
    for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++)
    {
        if (this.Content[nPos] === MathContent)
        {
            if (null !== this.Parent)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = nPos;
                this.Selection.EndPos   = nPos;
                this.Parent.Select_Element(this, false);
            }
            break;
        }
    }
};
CMathBase.prototype.Draw_HighLights = function(PDSH, bAll)
{
    var oShd = this.Get_CompiledCtrPrp().Shd;
    var bDrawShd  = ( oShd === undefined || shd_Nil === oShd.Value ? false : true );
    var ShdColor  = ( true === bDrawShd ? oShd.Get_Color( PDSH.Paragraph ) : null );

    var X = PDSH.X,
        Y0 = PDSH.Y0,
        Y1 = PDSH.Y1;

    var bAllCont = this.Selection.StartPos !== this.Selection.EndPos;

    for (var CurPos = 0; CurPos < this.Content.length; CurPos++)
        this.Content[CurPos].Draw_HighLights(PDSH, bAllCont);

    if (true === bDrawShd)
        PDSH.Shd.Add(Y0, Y1, X, X + this.size.width, 0, ShdColor.r, ShdColor.g, ShdColor.b );

    PDSH.X = this.pos.x + this.ParaMath.X + this.size.width;

};
CMathBase.prototype.Draw_Lines = function(PDSL)
{
    var CtrPrp = this.Get_CompiledCtrPrp(false);

    var aStrikeout  = PDSL.Strikeout;
    var aDStrikeout = PDSL.DStrikeout;

    var X          = PDSL.X;
    var Y          = PDSL.Baseline - CtrPrp.FontSize * g_dKoef_pt_to_mm * 0.27;

    var LineW      = (CtrPrp.FontSize / 18) * g_dKoef_pt_to_mm;

    var Para       = PDSL.Paragraph;

    var BgColor = PDSL.BgColor;
    if ( undefined !== CtrPrp.Shd && shd_Nil !== CtrPrp.Shd.Value )
        BgColor = CtrPrp.Shd.Get_Color( Para );
    var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );
    var CurColor, RGBA, Theme = this.Paragraph.Get_Theme(), ColorMap = this.Paragraph.Get_ColorMap();

    // Выставляем цвет обводки
    if ( true === PDSL.VisitedHyperlink && ( undefined === this.Pr.Color && undefined === this.Pr.Unifill ) )
        CurColor = new CDocumentColor( 128, 0, 151 );
    else if ( true === CtrPrp.Color.Auto && !CtrPrp.Unifill)
        CurColor = new CDocumentColor( AutoColor.r, AutoColor.g, AutoColor.b );
    else
    {
        if(CtrPrp.Unifill)
        {
            CtrPrp.Unifill.check(Theme, ColorMap);
            RGBA = CtrPrp.Unifill.getRGBAColor();
            CurColor = new CDocumentColor( RGBA.R, RGBA.G, RGBA.B );
        }
        else
        {
            CurColor = new CDocumentColor( CtrPrp.Color.r, CtrPrp.Color.g, CtrPrp.Color.b );
        }
    }

    if ( true === CtrPrp.DStrikeout )
        aDStrikeout.Add( Y, Y, X, X + this.size.width, LineW, CurColor.r, CurColor.g, CurColor.b );
    else if ( true === CtrPrp.Strikeout )
        aStrikeout.Add( Y, Y, X, X + this.size.width, LineW, CurColor.r, CurColor.g, CurColor.b );

    for ( var CurPos = 0; CurPos < this.Content.length; CurPos++ )
        this.Content[CurPos].Draw_Lines(PDSL);

    PDSL.X = this.pos.x + this.ParaMath.X + this.size.width;
};
CMathBase.prototype.Make_ShdColor = function(PDSE, CurTextPr)
{
    var Para      = PDSE.Paragraph;
    var pGraphics = PDSE.Graphics;
    var BgColor   = PDSE.BgColor;

    if ( undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value )
        BgColor = CurTextPr.Shd.Get_Color( Para );

    var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );

    var RGBA;
    if(CurTextPr.Unifill)
    {
        CurTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
        RGBA = CurTextPr.Unifill.getRGBAColor();

        if ( true === PDSE.VisitedHyperlink && ( undefined === this.CtrPrp.Color && undefined === this.CtrPrp.Unifill ) )
        {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.p_color( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
        }
        else
        {
            pGraphics.p_color( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A);
        }
    }
    else
    {
        if ( true === PDSE.VisitedHyperlink && ( undefined === this.CtrPrp.Color && undefined === this.CtrPrp.Unifill ) )
        {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.p_color( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
            pGraphics.b_color1( RGBA.R, RGBA.G, RGBA.B, RGBA.A );
        }
        else if ( true === CurTextPr.Color.Auto )
        {
            pGraphics.p_color( AutoColor.r, AutoColor.g, AutoColor.b, 255);
            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
        }
        else
        {
            pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
            pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        }
    }


    if(BgColor == undefined)
        BgColor = new CDocumentColor( 255, 255, 255, false );

    return BgColor;
};
CMathBase.prototype.protected_AddToContent = function(Pos, Items, bUpdatePosition)
{
    History.Add(this, new CChangesMathAddItems(Pos, Items));
    this.raw_AddToContent(Pos, Items, bUpdatePosition);
    this.private_UpdatePosOnAdd(Pos, bUpdatePosition);
};
CMathBase.prototype.raw_AddToContent = function(Pos, Items, bUpdatePosition)
{
    for(var Index = 0, Count = Items.length; Index < Count; Index++)
    {
        var Item = Items[Index];
        this.Content.splice(Pos + Index, 0, Item);
        Item.ParentElement = this;
    }

    this.fillContent();
    this.private_SetNeedResize();
};
CMathBase.prototype.raw_RemoveFromContent = function(Pos, Count)
{
    this.Content.splice(Pos, Count);

    this.fillContent();
    this.private_SetNeedResize();
};
CMathBase.prototype.Recalc_RunsCompiledPr = function()
{
    this.RecalcInfo.bCtrPrp = true;
    CParagraphContentWithParagraphLikeContent.prototype.Recalc_RunsCompiledPr.call(this);
};
CMathBase.prototype.GetLastElement = function()
{
    return this;
};
CMathBase.prototype.GetFirstElement = function()
{
    return this;
};
CMathBase.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    var WordLen = PRS.WordLen; // запоминаем, чтобы внутр мат объекты не увеличили WordLen

    var bOneLine = PRS.bMath_OneLine;
    this.bOneLine = this.bCanBreak == false || PRS.bMath_OneLine == true;

    if(this.bOneLine == true)
    {
        PRS.bMath_OneLine = this.bOneLine;

        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                var Item = this.elements[i][j];

                if(Item.IsJustDraw()) // для Just-Draw элементов надо выставить Font
                {
                    var ctrPrp = this.Get_TxtPrControlLetter();

                    var Font =
                    {
                        FontSize:   ctrPrp.FontSize,
                        FontFamily: {Name : ctrPrp.FontFamily.Name, Index : ctrPrp.FontFamily.Index},
                        Italic:     false,
                        Bold:       false //ctrPrp.Bold
                    };

                    g_oTextMeasurer.SetFont(Font);

                    Item.Measure(g_oTextMeasurer);
                }
                else
                {
                    if(Item.Type == para_Math_Content)
                        Item.Recalculate_Reset( PRS.Range, PRS.Line ); // обновим StartLine и StartRange

                    Item.Recalculate_Range(PRS, ParaPr, Depth);
                }
            }
        }

        this.recalculateSize(g_oTextMeasurer);

        this.Update_WordLen(PRS, WordLen);
        this.Bounds.SetWidth(0, this.size.width);
        this.Bounds.UpdateMetrics(0, this.size);
    }
    else
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

        this.setDistance();

        var Numb = this.NumBreakContent;

        var Len = this.Content.length;
        var RangeStartPos = this.protected_AddRange(CurLine, CurRange),
            RangeEndPos = Len - 1;

        if(CurLine == 0 && CurRange == 0)
        {
            PRS.WordLen += this.BrGapLeft;
        }

        //var PosEndRun = PRS.PosEndRun.Copy();
        //var Word = PRS.Word;
        //var WordLen = PRS.WordLen;

        for(var Pos = RangeStartPos; Pos < Len; Pos++)
        {
            var Item = this.Content[Pos];

            PRS.bMath_OneLine = true;

            var bOneLineContent = Pos !== Numb;

            if(bOneLineContent == false)
            {
                PRS.Update_CurPos(Pos, Depth);
                PRS.bMath_OneLine  = false;
            }

            var NeedSetReset = CurLine == 0 && CurRange == 0  || Pos !== RangeStartPos;
            if(Item.Type == para_Math_Content && NeedSetReset)
                Item.Recalculate_Reset(PRS.Range, PRS.Line); // обновим StartLine и StartRange

            Item.Recalculate_Range(PRS, ParaPr, Depth+1);

            if(bOneLineContent == true)
            {
                if(true !== PRS.Word)
                {
                    PRS.WordLen = Item.size.width;
                    PRS.Word    = true;
                }
                else
                {
                    PRS.WordLen += Item.size.width;
                }
            }

            if(true === PRS.NewRange)
            {
                RangeEndPos = Numb;
                break;
            }
        }


        if(PRS.NewRange == false)
        {
            PRS.WordLen += this.BrGapRight;
        }

        this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
    }

    PRS.bMath_OneLine = bOneLine;
};
CMathBase.prototype.Math_GetWidth = function(_CurLine, _CurRange)
{
    return this.size.width;
};
CMathBase.prototype.Update_WordLen = function(PRS, WordLen)
{
    if(this.bInside == false)
    {
        if(true !== PRS.Word)
        {
            PRS.WordLen = this.size.width;
        }
        else
        {
            PRS.WordLen = WordLen + this.size.width;
        }
    }
};
CMathBase.prototype.Recalculate_Range_OneLine = function(PRS, ParaPr, Depth)
{
    this.Recalculate_Range(PRS, ParaPr, Depth);
};
CMathBase.prototype.Recalculate_LineMetrics = function(PRS, ParaPr, _CurLine, _CurRange)
{
    if(this.bOneLine)
    {
        this.UpdateMetrics(PRS, this.size);
        this.Bounds.UpdateMetrics(0, this.size);
        PRS.ContentMetrics.UpdateMetrics(this.size);
    }
    else
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);


        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
        {
            var Item = this.Content[CurPos];

            if(CurPos == this.NumBreakContent)
            {
                Item.Recalculate_LineMetrics(PRS, ParaPr, _CurLine, _CurRange);
                this.Bounds.UpdateMetrics(CurLine, PRS.ContentMetrics);
            }
            else
            {
                this.UpdateMetrics(PRS, Item.size);
                this.Bounds.UpdateMetrics(CurLine, Item.size);
            }
        }
    }
};
CMathBase.prototype.UpdateMetrics = function(PRS, Size)
{
    if(PRS.LineAscent < Size.ascent)
        PRS.LineAscent = Size.ascent;

    if(PRS.LineDescent < Size.height - Size.ascent)
        PRS.LineDescent = Size.height - Size.ascent;

    PRS.ContentMetrics.UpdateMetrics(Size);
};
CMathBase.prototype.Recalculate_Range_Width = function(PRSC, _CurLine, _CurRange)
{
    if(this.bOneLine)
    {
        PRSC.Range.W += this.size.width;
    }
    else
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        var RangeW = PRSC.Range.W;

        if(CurLine == 0 && CurRange == 0)
            PRSC.Range.W += this.BrGapLeft;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if(CurPos == this.NumBreakContent)
            {
                Item.Recalculate_Range_Width( PRSC, _CurLine, _CurRange );
            }
            else
            {
                PRSC.Range.W += Item.size.width;
            }
        }

        PRSC.Range.W += this.dW*(EndPos - StartPos);


        // Здесь проверяем не на колво строк, т.к. на данном этапе еще идет вычисление строк, а на конец контента !

        var Len = this.Content.length;

        if(EndPos == Len - 1)
        {
            var EndBrContentEnd = this.NumBreakContent == EndPos && this.Content[EndPos].Math_Is_End( _CurLine, _CurRange),
                NotBrContent = this.NumBreakContent !== EndPos;

            if(EndBrContentEnd || NotBrContent)
                PRSC.Range.W += this.BrGapRight;
        }

        this.Bounds.SetWidth(CurLine, PRSC.Range.W - RangeW);
    }
};
CMathBase.prototype.Is_EmptyRange = function()
{
    return false;
};
CMathBase.prototype.Get_CurrentParaPos          = CMathContent.prototype.Get_CurrentParaPos;
CMathBase.prototype.private_UpdatePosOnAdd      = CMathContent.prototype.private_UpdatePosOnAdd;
CMathBase.prototype.private_UpdatePosOnRemove   = CMathContent.prototype.private_UpdateOnRemove;
CMathBase.prototype.private_CorrectSelectionPos = CMathContent.prototype.private_CorrectSelectionPos;
CMathBase.prototype.private_CorrectSelectionPos = CMathContent.prototype.private_CorrectSelectionPos;
CMathBase.prototype.private_SetNeedResize       = CMathContent.prototype.private_SetNeedResize;
CMathBase.prototype.private_CorrectCurPos = function()
{
    if (this.CurPos > this.Content.length - 1)
    {
        this.CurPos = this.Content.length - 1;
        this.Content[this.CurPos].Cursor_MoveToEndPos(false);
    }

    if (this.CurPos < 0)
    {
        this.CurPos = this.Content.length - 1;
        this.Content[this.CurPos].Cursor_MoveToStartPos();
    }
};

CMathBase.prototype.Search                        = CParagraphContentWithParagraphLikeContent.prototype.Search;
CMathBase.prototype.Add_SearchResult              = CParagraphContentWithParagraphLikeContent.prototype.Add_SearchResult;
CMathBase.prototype.Clear_SearchResults           = CParagraphContentWithParagraphLikeContent.prototype.Clear_SearchResults;
CMathBase.prototype.Remove_SearchResult           = CParagraphContentWithParagraphLikeContent.prototype.Remove_SearchResult;
CMathBase.prototype.Search_GetId                  = CParagraphContentWithParagraphLikeContent.prototype.Search_GetId;
CMathBase.prototype.Set_SelectionContentPos       = CParagraphContentWithParagraphLikeContent.prototype.Set_SelectionContentPos;
CMathBase.prototype.Get_LeftPos                   = CParagraphContentWithParagraphLikeContent.prototype.Get_LeftPos;
CMathBase.prototype.Get_RightPos                  = CParagraphContentWithParagraphLikeContent.prototype.Get_RightPos;
CMathBase.prototype.Get_WordStartPos              = CParagraphContentWithParagraphLikeContent.prototype.Get_WordStartPos;
CMathBase.prototype.Get_WordEndPos                = CParagraphContentWithParagraphLikeContent.prototype.Get_WordEndPos;
CMathBase.prototype.Selection_Remove              = CParagraphContentWithParagraphLikeContent.prototype.Selection_Remove;
CMathBase.prototype.Select_All                    = CParagraphContentWithParagraphLikeContent.prototype.Select_All;
CMathBase.prototype.Check_NearestPos              = CParagraphContentWithParagraphLikeContent.prototype.Check_NearestPos;
CMathBase.prototype.Get_SelectionDirection        = CParagraphContentWithParagraphLikeContent.prototype.Get_SelectionDirection;
CMathBase.prototype.Selection_CheckParaContentPos = function(ContentPos, Depth, bStart, bEnd)
{
    if (true !== this.Selection.Use)
        return false;

    var CurPos = ContentPos.Get(Depth);

    if (this.Selection.StartPos === this.Selection.EndPos && this.Selection.StartPos === CurPos)
        return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart, bEnd);

    if (this.Selection.StartPos !== this.Selection.EndPos)
        return true;

    return false;
};
CMathBase.prototype.Document_UpdateInterfaceState = function(MathProps)
{
};

CMathBase.prototype.Is_ContentUse = function(MathContent)
{
    for (var Pos = 0, Count = this.Content.length; Pos < Count; Pos++)
    {
        if (MathContent === this.Content[Pos])
            return true;
    }

    return false;
};

function CMathBasePr()
{
}
CMathBasePr.prototype.Set_FromObject  = function(Obj){};
CMathBasePr.prototype.Copy            = function(){return new CMathBasePr();};
CMathBasePr.prototype.Write_ToBinary  = function(Writer){};
CMathBasePr.prototype.Read_FromBinary = function(Reader){};

function CMathBounds()
{
    this.Bounds = [];
}
CMathBounds.prototype.Reset = function()
{
    this.Bounds.length = 0;
};
CMathBounds.prototype.CheckLineBound = function(Line)
{
    if(this.Bounds.length <= Line)
    {
        this.Bounds[Line] = new CMathBoundsMeasures();
    }
};
CMathBounds.prototype.UpdateMetrics = function(Line, Metric)
{
    this.CheckLineBound(Line);
    this.Bounds[Line].UpdateMetrics(Metric);
};
CMathBounds.prototype.UpdateWidth = function(Line, Width)
{
    this.CheckLineBound(Line);
    this.Bounds[Line].UpdateWidth(Width);
};
CMathBounds.prototype.SetWidth = function(Line, Width)
{
    this.CheckLineBound(Line);
    this.Bounds[Line].SetWidth(Width);
};
CMathBounds.prototype.SetPage = function(Line, Page)
{
    this.CheckLineBound(Line);
    this.Bounds[Line].SetPage(Page);
};
CMathBounds.prototype.GetWidth = function(Line)
{
    return this.Bounds[Line].W;
};
CMathBounds.prototype.GetAscent = function(Line)
{
    return this.Bounds[Line].Asc;
};
CMathBounds.prototype.GetHeight = function(Line)
{
    return this.Bounds[Line].H;
};
CMathBounds.prototype.Get_Bounds = function()
{
    return this.Bounds;
};
CMathBounds.prototype.Get_LineBound = function(CurLine)
{
    var Bound;
    if(CurLine < this.Bounds.length)
    {
        Bound = this.Bounds[CurLine];
    }
    else // заглушка, если еще не пересчитали, а запрос Bonds пришел (например, на поиске)
    {
        Bound = new CMathBoundsMeasures();
    }

    return Bound;
};
CMathBounds.prototype.SetPos = function(Line, Pos, PRSA)
{
    this.CheckLineBound(Line);
    this.Bounds[Line].SetPos(Pos, PRSA);
};
CMathBounds.prototype.GetPos = function(Line)
{
    var Pos = new CMathPosition();

    Pos.x = this.Bounds[Line].GetX();
    Pos.y = this.Bounds[Line].GetY();

    return Pos;
};


function CMathBoundsMeasures()
{
    this.Type = MATH_BOUNDS_MEASURES;
    this.X    = 0;
    this.Y    = 0;
    this.W    = 0;
    this.H    = 0;
    this.Asc  = 0;
    this.Page = 0;
}
CMathBoundsMeasures.prototype.UpdateMetrics = function(Metric)
{
    var MetricH   = Metric.Type == MATH_SIZE ? Metric.height : Metric.H;
    var MetricAsc = Metric.Type == MATH_SIZE ? Metric.ascent : Metric.Asc;

    var Descent = this.H - this.Asc;
    var MetricDescent = MetricH - MetricAsc;

    if(this.Asc < MetricAsc)
        this.Asc = MetricAsc;

    if(Descent < MetricDescent)
    {
        this.H = MetricDescent + this.Asc;
    }
    else
    {
        this.H = Descent + this.Asc;
    }
};
CMathBoundsMeasures.prototype.UpdateWidth = function(Width)
{
    this.W += Width;
};
CMathBoundsMeasures.prototype.SetWidth = function(Width)
{
    this.W = Width;
};
CMathBoundsMeasures.prototype.SetPage = function(Page)
{
    this.Page = Page;
};
CMathBoundsMeasures.prototype.SetPos = function(Pos, PRSA)
{
    this.X = PRSA.X + Pos.x;
    this.Y = PRSA.Y + Pos.y - this.Asc;
};
CMathBoundsMeasures.prototype.GetX = function()
{
    return this.X;
};
CMathBoundsMeasures.prototype.GetY = function()
{
    return this.Y + this.Asc;
};
