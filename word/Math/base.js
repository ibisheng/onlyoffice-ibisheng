"use strict";

/**
 *
 * @param bInside
 * @returns {CMathBase}
 * @constructor
 * @extends {CParagraphContentWithParagraphLikeContent}
 */
function CMathBase(bInside)
{
    CMathBase.superclass.constructor.call(this);

    this.Type = para_Math_Composition;

    this.pos  = new CMathPosition();
    this.size = new CMathSize();

    //  Properties
    this.Parent 			 = null;
    this.ParaMath 			 = null; // ссылка на общую формулу

    this.CtrPrp 			 = new CTextPr();
    this.CompiledCtrPrp 	 = new CTextPr(); 
    this.TextPrControlLetter = new CTextPr();

    this.ArgSize             = new CMathArgSize();

    /////////////////
    this.nRow                = 0;
    this.nCol                = 0;

    this.bInside             = bInside === true;

    this.bOneLine            = true;
    this.bCanBreak           = false;
    this.NumBreakContent     = -1;

    this.elements            = [];

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

    this.ReviewType = reviewtype_Common;
    this.ReviewInfo = new CReviewInfo();

    var Api = editor;
    if (Api && !Api.isPresentationEditor && Api.WordControl && Api.WordControl.m_oLogicDocument && true === Api.WordControl.m_oLogicDocument.Is_TrackRevisions())
    {
        this.ReviewType = reviewtype_Add;
        this.ReviewInfo.Update();
    }

    return this;
}
AscCommon.extendClass(CMathBase, CParagraphContentWithParagraphLikeContent);
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
};
///////// RunPrp, CtrPrp
CMathBase.prototype.setCtrPrp = function(txtPrp) // выставляем ctrPrp на чтение
{
    if(txtPrp !== null && typeof(txtPrp) !== "undefined")
    {
        this.CtrPrp.Merge(txtPrp);
    }
};
CMathBase.prototype.Get_CtrPrp = function(bCopy)
{
    var CtrPrp;
    if(this.bInside === true)
        CtrPrp = this.Parent.Get_CtrPrp(bCopy);
    else
        CtrPrp = bCopy ? this.CtrPrp.Copy() : this.CtrPrp;

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

        for(var j = 0; j < this.nCol; j++)
        {
            var _ascent = this.elements[pos_x][j].size.ascent;
            maxAsc = ( maxAsc > _ascent ) ? maxAsc : _ascent;
        }
        PosAlign.y = maxAsc - this.elements[pos_x][pos_y].size.ascent;
    }
    else if(this.alignment.hgt[pos_x] == MCJC_LEFT)
    {
        PosAlign.y = 0;
    }
    else // MCJC_RIGHT
    {
        var maxH = 0;

        for(var j = 0; j < this.nCol; j++)
        {
            var _h = this.elements[pos_x][j].size.height;
            maxH = ( maxH > _h ) ? maxH : _h;
        }

        PosAlign.y = maxH - this.elements[pos_x][pos_y].size.height;
    }

    var maxW  = 0;
    for(var i=0; i < this.nRow; i++)
    {
        var _w = this.elements[i][pos_y].size.width;
        maxW = ( maxW > _w ) ? maxW : _w;
    }

    if(this.alignment.wdt[pos_y] == MCJC_CENTER)
        PosAlign.x = (maxW - this.elements[pos_x][pos_y].size.width)*0.5;
    else if(this.alignment.wdt[pos_y] == MCJC_LEFT)
        PosAlign.x = 0;
    else // MCJC_RIGHT
        PosAlign.x = maxW - this.elements[pos_x][pos_y].size.width;

    return PosAlign;
};
CMathBase.prototype.setPosition = function(pos, PosInfo)
{
    this.UpdatePosBound(pos, PosInfo);

    if(this.bOneLine)
    {
        this.pos.x = pos.x;

        if(this.bInside === true)
            this.pos.y = pos.y;
        else
            this.pos.y = pos.y - this.size.ascent; ///!!!!

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

                this.elements[i][j].setPosition(NewPos, PosInfo);
                w += Widths[j];
            }
            h += Heights[i];
        }

        pos.x += this.size.width;
    }
    else
    {
        var Line  = PosInfo.CurLine,
            Range = PosInfo.CurRange;
        var CurLine  = Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? Range - this.StartRange : Range );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        if(CurLine == 0 && CurRange == 0)
            pos.x += this.BrGapLeft;

        this.Content[StartPos].setPosition(pos, PosInfo);

        for(var Pos = StartPos + 1; Pos <= EndPos; Pos++)
        {
            pos.x += this.dW;
            this.Content[Pos].setPosition(pos, PosInfo);
        }

        var Len = this.Content.length;

        // Здесь проверяем не на то, что это последний Range (т.к. на данном этапе еще идет вычисление строк) а на конец контента !

        var EndBrContentEnd = this.NumBreakContent == EndPos && this.Content[EndPos].Math_Is_End(Line, Range),
            NotBrContent = this.NumBreakContent !== EndPos;

        var bEnd = EndBrContentEnd || NotBrContent;

        if(EndPos == Len - 1 && true === bEnd)
            pos.x += this.BrGapRight;

    }
};
CMathBase.prototype.ShiftPage = function(Dx)
{
    this.Bounds.ShiftPage(Dx);

    for(var i=0; i < this.nRow; i++)
    {
        for(var j = 0; j < this.nCol; j++)
        {
            var Item = this.elements[i][j];
            if(false == Item.IsJustDraw())
                Item.ShiftPage(Dx);
        }
    }
};
CMathBase.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    if(this.bOneLine)
    {
        this.Bounds.ShiftPos(CurLine, CurRange, Dx, Dy);

        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                var Item = this.elements[i][j];
                if(false == Item.IsJustDraw())
                    Item.Shift_Range(Dx, Dy, _CurLine, _CurRange);
            }
        }
    }
    else
    {
        this.Bounds.ShiftPos(CurLine, CurRange, Dx, Dy);

        CMathBase.superclass.Shift_Range.call(this, Dx, Dy, _CurLine, _CurRange);
    }
};
CMathBase.prototype.IsStartRange = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    return CurLine == 0 && CurRange == 0;
};
CMathBase.prototype.IsLastRange = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var LinesCount = this.protected_GetLinesCount(),
        RangesCount = this.protected_GetRangesCount(CurLine);


    return CurLine == LinesCount - 1 && CurRange == RangesCount - 1;
};
CMathBase.prototype.UpdatePosBound = function(pos, PosInfo)
{
    var CurLine  = PosInfo.CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? PosInfo.CurRange - this.StartRange : PosInfo.CurRange);

    this.Bounds.SetPos(CurLine, CurRange, pos);
};
CMathBase.prototype.UpdateBoundsPosInfo = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange);

    this.Bounds.SetGenPos(CurLine, CurRange, PRSA);
    this.Bounds.SetPage(CurLine, CurRange, _CurPage);

    if(this.bOneLine == true)
    {
        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                if(false == this.elements[i][j].IsJustDraw())
                    this.elements[i][j].UpdateBoundsPosInfo(PRSA, _CurLine, _CurRange, _CurPage);
            }
        }
    }
    else
    {
        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        for(var Pos = StartPos; Pos <= EndPos; Pos++)
        {
            this.Content[Pos].UpdateBoundsPosInfo(PRSA, _CurLine, _CurRange, _CurPage);
        }
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

        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_Elements(PDSE);
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
CMathBase.prototype.Math_UpdateGaps = function(_CurLine, _CurRange, GapsInfo)
{
    GapsInfo.updateCurrentObject(this, this.TextPrControlLetter.FontSize);

    if(GapsInfo.bUpdate == true)
    {
        GapsInfo.updateGaps();
    }

    if(this.bOneLine == false)
    {
        var BrPos = this.NumBreakContent;
        this.Content[BrPos].Math_UpdateGaps(_CurLine, _CurRange);
    }
};
CMathBase.prototype.UpdLastElementForGaps = function(CurLine, CurRange, GapsInfo)
{
    GapsInfo.updateCurrentObject(this, this.TextPrControlLetter.FontSize);
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
    this.Apply_TextPrToCtrPr(TextPr, IncFontSize, ApplyToAll);

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
CMathBase.prototype.Apply_TextPrToCtrPr = function(TextPr, IncFontSize, ApplyToAll)
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
        if(TextPr.AscFill || TextPr.AscLine || TextPr.AscUnifill)
        {
            var oCompiledPr = this.Get_CompiledCtrPrp();
            if(TextPr.AscFill)
            {
                this.Set_TextFill(AscFormat.CorrectUniFill(TextPr.AscFill, oCompiledPr.TextFill, 0));
            }
            if(TextPr.AscUnifill)
            {
                this.Set_Unifill(AscFormat.CorrectUniFill(TextPr.AscUnifill, oCompiledPr.Unifill, 0));
            }
            if(TextPr.AscLine)
            {
                this.Set_TextOutline(AscFormat.CorrectUniStroke(TextPr.AscLine, oCompiledPr.TextOutline, 0));
            }
            return;
        }
        if(TextPr.FontSize !== undefined)
            this.Set_FontSizeCtrPrp(TextPr.FontSize);

        if(TextPr.Shd !== undefined)
            this.Set_Shd(TextPr.Shd);

        if(undefined != TextPr.Unifill)
        {
            this.Set_Unifill(TextPr.Unifill.createDuplicate());
            if(undefined != this.CtrPrp.Color)
            {
                this.Set_Color(undefined);
            }
            if(undefined != this.CtrPrp.TextFill)
            {
                this.Set_TextFill(undefined);
            }
        }
        if(undefined != TextPr.TextOutline)
        {
            this.Set_TextOutline(TextPr.TextOutline);
        }
        if(undefined != TextPr.TextFill)
        {
            this.Set_TextFill(TextPr.TextFill);
            if(undefined != this.CtrPrp.Color)
            {
                this.Set_Color(undefined);
            }
            if(undefined != this.CtrPrp.Unifill)
            {
                this.Set_Unifill(undefined);
            }
        }

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( null === TextPr.HighLight ? undefined : TextPr.HighLight );

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
    if ( ( undefined === Value && undefined !== this.CtrPrp.Unifill ) || ( Value instanceof AscFormat.CUniFill && ( undefined === this.CtrPrp.Unifill || false === AscFormat.CompareUnifillBool(this.CtrPrp.Unifill, Value) ) ) )
    {
        History.Add(this, new CChangesMathUnifill(Value, this.CtrPrp.Unifill));
        this.raw_SetUnifill(Value);
    }
};
CMathBase.prototype.Set_TextFill = function(Value)
{
    if ( ( undefined === Value && undefined !== this.CtrPrp.TextFill ) || ( Value instanceof AscFormat.CUniFill && ( undefined === this.CtrPrp.TextFill || false === AscFormat.CompareUnifillBool(this.CtrPrp.TextFill, Value) ) ) )
    {
        History.Add(this, new CChangesMathTextFill(Value, this.CtrPrp.TextFill));
        this.raw_SetTextFill(Value);
    }
};
CMathBase.prototype.Set_TextOutline = function(Value)
{
    if ( ( undefined === Value && undefined !== this.CtrPrp.TextOutline ) || ( Value instanceof AscFormat.CLn && ( undefined === this.CtrPrp.TextOutline || false === Value.IsIdentical(this.CtrPrp.TextOutline) ) ) )
    {
        History.Add(this, new CChangesMathTextOutline(Value, this.CtrPrp.TextOutline));
        this.raw_SetTextOutline(Value);
    }
};
CMathBase.prototype.Set_HighLight = function(Value)
{
    var OldValue = this.CtrPrp.HighLight;
    if ( (undefined === Value && undefined !== OldValue) || ( highlight_None === Value && highlight_None !== OldValue ) || ( Value instanceof CDocumentColor && ( undefined === OldValue || highlight_None === OldValue || false === Value.Compare(OldValue) ) ) )
    {
        History.Add(this, new CChangesMathHighLight(Value, this.CtrPrp.HighLight));
        this.raw_SetHighLight(Value);
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
CMathBase.prototype.raw_SetTextFill = function(Value)
{
    this.CtrPrp.TextFill = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetTextOutline = function(Value)
{
    this.CtrPrp.TextOutline = Value;
    this.NeedUpdate_CtrPrp();
};
CMathBase.prototype.raw_SetHighLight = function(Value)
{
    this.CtrPrp.HighLight = Value;
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
};
CMathBase.prototype.SelectToParent = function(bCorrect)
{
    this.bSelectionUse = true;
    this.Parent.SelectToParent(bCorrect);
};
CMathBase.prototype.Get_StartRangePos = function(_CurLine, _CurRange, SearchPos, Depth, bStartPos)
{
    var Pos = bStartPos == true ? this.NumBreakContent : this.CurPos;

    var Result = this.Content[Pos].Get_StartRangePos(_CurLine, _CurRange, SearchPos, Depth+1, bStartPos);

    if ( true === Result )
        SearchPos.Pos.Update(Pos, Depth );

    return Result;

};
CMathBase.prototype.Get_EndRangePos = function(_CurLine, _CurRange, SearchPos, Depth, bEndPos)
{
    var Pos = bEndPos == true ? this.NumBreakContent : this.CurPos;

    var Result = this.Content[Pos].Get_EndRangePos(_CurLine, _CurRange, SearchPos, Depth+1, bEndPos);

    if ( true === Result )
        SearchPos.Pos.Update( Pos, Depth );

    return Result;

};
CMathBase.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var WidthVisible;

    if ( 0 !== PRSA.LettersSkip )
    {
        WidthVisible = this.Bounds.Get_Width(CurLine, CurRange);
        PRSA.LettersSkip--;
    }
    else
    {
        WidthVisible = this.Bounds.Get_Width(CurLine, CurRange) + PRSA.JustifyWord;
    }

    PRSA.X    += WidthVisible;
    PRSA.LastW = WidthVisible;
};
CMathBase.prototype.Get_Width = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine,
        CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    return this.Bounds.Get_Width(CurLine, CurRange);
};
CMathBase.prototype.Save_RecalculateObject = function(Copy)
{
    var RecalcObj;
    if(this.bOneLine)
    {
        RecalcObj = new CEmptyRunRecalculateObject(this.StartLine, this.StartRange);
    }
    else
    {

        var Num = this.NumBreakContent;

        RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
        RecalcObj.Save_Lines( this, Copy );

        for(var Pos = 0; Pos < this.Content.length; Pos++)
        {
            if(Pos == Num)
            {
                RecalcObj.Content[Pos] = this.Content[Pos].Save_RecalculateObject(Copy);
            }
            else
            {
                RecalcObj.Content[Pos] = new CEmptyRunRecalculateObject(this.StartLine, this.StartRange);
            }
        }
    }

    return RecalcObj;
};
CMathBase.prototype.Load_RecalculateObject = function(RecalcObj)
{
    if(this.bOneLine == false)
        CMathBase.superclass.Load_RecalculateObject.call(this, RecalcObj);

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
    // Long             : ReviewType
    // Bool             : undefined == ReviewInfo
    // if false         : ReviewInfo

    Writer.WriteString2(this.Id);

    var nCount = this.Content.length;
    Writer.WriteLong(nCount);
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        Writer.WriteString2(this.Content[nIndex].Id);
    }

    this.Pr.Write_ToBinary(Writer);
    this.CtrPrp.Write_ToBinary(Writer);
    Writer.WriteLong(this.ReviewType);

    if (undefined !== this.ReviewInfo)
    {
        Writer.WriteBool(false);
        this.ReviewInfo.Write_ToBinary(Writer);
    }
    else
    {
        Writer.WriteBool(true);
    }
};
CMathBase.prototype.Read_FromBinary2 = function( Reader )
{
    // String           : Id
    // Long             : Content.length
    // Array of Strings : Content[Index].Id
    // Variable         : Pr
    // Variable(CTextPr): CtrPrp
    // Long             : ReviewType
    // Bool             : undefined == ReviewInfo
    // if false         : ReviewInfo


    this.Id = Reader.GetString2();

    var nCount = Reader.GetLong();
    this.Content = [];
    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        this.Content[nIndex] = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
        this.Content[nIndex].ParentElement = this;
        this.Content[nIndex].Parent        = this;
    }

    this.Pr.Read_FromBinary(Reader);
    this.CtrPrp.Read_FromBinary(Reader);

    this.ReviewType = Reader.GetLong();
    if (true === Reader.GetBool())
    {
        this.ReviewInfo = undefined;
    }
    else
    {
        this.ReviewInfo = new CReviewInfo();
        this.ReviewInfo.Read_FromBinary(Reader);
    }

    this.fillContent();
};
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
CMathBase.prototype.Get_ParaContentPosByXY = function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
{
    var nCount = this.Content.length;
    if (nCount <= 0)
        return false;

    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var StartPos, EndPos;

    if(this.bOneLine == false)
    {
        StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);
    }
    else
    {
        StartPos = 0;
        EndPos = nCount - 1;
    }

    var aBounds = [];

    for (var nIndex = 0; nIndex < nCount; nIndex++)
    {
        if(nIndex < StartPos || nIndex > EndPos)
        {
            aBounds.push(null);
        }
        else
        {
            var oBounds = this.Content[nIndex].Get_LineBound(_CurLine, _CurRange);

            if(oBounds == undefined)
                aBounds.push(null);
            else if (oBounds.W > 0.001 && oBounds.H > 0.001)
                aBounds.push(oBounds);
            else
                aBounds.push(null);
        }
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

    if ( false === SearchPos.InText )
        SearchPos.InTextPos.Update2( nFindIndex, Depth );

    var bResult = false;

    if(true === this.Content[nFindIndex].Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd))
    {
        SearchPos.Pos.Update2(nFindIndex, Depth);
        bResult = true;
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
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    var SelectionStartPos = this.Selection.StartPos;
    var SelectionEndPos   = this.Selection.EndPos;

    var SelectionUse = this.Selection.Use;
    // для каждой новой строки в ParaMath FindStart будет true независимо от того нашли или нет начало селекта на предыдущей строке
    // поэтому для контентов разбивающихся на несколько строк сделаем проверку, чтобы не попасть в контенты, которые не относятся к текущей строке

    var ContentSelect = true;

    if(this.bOneLine == false)
    {
        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        ContentSelect = SelectionStartPos >= StartPos && SelectionEndPos <= EndPos;
    }

    if(SelectionUse == true && SelectionStartPos !== SelectionEndPos)
    {
        var Bound = this.Bounds.Get_LineBound(CurLine, CurRange);

        SelectionDraw.FindStart = false;
        SelectionDraw.W += Bound.W;
    }
    else if(SelectionUse == true && ContentSelect == true)
    {
        var Item = this.Content[SelectionStartPos];
        var BoundItem = Item.Get_LineBound(_CurLine, _CurRange);

        SelectionDraw.StartX = BoundItem.X;


        Item.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
    }
    else if(SelectionDraw.FindStart == true)
    {
        SelectionDraw.StartX += this.Bounds.Get_Width(CurLine, CurRange);
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
    var ComplCtrPrp = this.Get_CompiledCtrPrp();
    var oShd = ComplCtrPrp.Shd;
    var bDrawShd  = ( oShd === undefined || Asc.c_oAscShdNil === oShd.Value ? false : true );
    var ShdColor  = ( true === bDrawShd ? oShd.Get_Color( PDSH.Paragraph ) : null );

    var X = PDSH.X,
        Y0 = PDSH.Y0,
        Y1 = PDSH.Y1;

    var CurLine  = PDSH.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

    var StartPos, EndPos;
    if(this.bOneLine)
    {
        StartPos = 0;
        EndPos   = this.Content.length - 1;
    }
    else
    {
        StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);
    }


    var bAllCont = this.Selection.StartPos !== this.Selection.EndPos;

    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
        this.Content[CurPos].Draw_HighLights(PDSH, bAllCont);

    var Bound = this.Get_LineBound(PDSH.Line, PDSH.Range);

    if (true === bDrawShd)
        PDSH.Shd.Add(Y0, Y1, X, X + Bound.W, 0, ShdColor.r, ShdColor.g, ShdColor.b );

    var HighLight = ComplCtrPrp.HighLight;

    if ( highlight_None != HighLight )
        PDSH.High.Add( Y0, Y1, X, X + Bound.W, 0, HighLight.r, HighLight.g, HighLight.b );


    PDSH.X = Bound.X + Bound.W;
};
CMathBase.prototype.Draw_Lines = function(PDSL)
{
    var CtrPrp = this.Get_CompiledCtrPrp(false);

    var aStrikeout  = PDSL.Strikeout;
    var aDStrikeout = PDSL.DStrikeout;

    var ReviewType = this.Get_ReviewType();
    var bAddReview = reviewtype_Add === ReviewType ? true : false;
    var bRemReview = reviewtype_Remove === ReviewType ? true : false;
    var ReviewColor = null;
    if (bAddReview || bRemReview)
        ReviewColor = this.ReviewInfo.Get_Color();

    var ArgSize     = this.Get_CompiledArgSize();
    var fontCoeff   = MatGetKoeffArgSize(CtrPrp.FontSize, ArgSize.value);

    // вычисляем координату Y и LineW также как в Run
    var X          = PDSL.X;
    var Y          = PDSL.Baseline - CtrPrp.FontSize * fontCoeff * g_dKoef_pt_to_mm * 0.27;

    var LineW      = (CtrPrp.FontSize / 18) * g_dKoef_pt_to_mm;

    var Para       = PDSL.Paragraph;

    var BgColor = PDSL.BgColor;
    if ( undefined !== CtrPrp.Shd && Asc.c_oAscShdNil !== CtrPrp.Shd.Value )
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

    var CurLine  = PDSL.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

    var Bound = this.Bounds.Get_LineBound(CurLine, CurRange);

    if (true === bRemReview)
        aStrikeout.Add(Y, Y, X, X + Bound.W, LineW, ReviewColor.r, ReviewColor.g, ReviewColor.b);
    else if ( true === CtrPrp.DStrikeout )
        aDStrikeout.Add( Y, Y, X, X + Bound.W, LineW, CurColor.r, CurColor.g, CurColor.b );
    else if ( true === CtrPrp.Strikeout )
        aStrikeout.Add( Y, Y, X, X + Bound.W, LineW, CurColor.r, CurColor.g, CurColor.b );

    this.Draw_LinesForContent(PDSL);

    PDSL.X = Bound.X + Bound.W;
};
CMathBase.prototype.Draw_LinesForContent = function(PDSL)
{
    var CurLine  = PDSL.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );
    
    var StartPos, EndPos;

    if(this.bOneLine)
    {
        StartPos = 0;
        EndPos   = this.Content.length - 1;
    }
    else
    {
        StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);
    }

    for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        this.Content[CurPos].Draw_Lines(PDSL);
};
CMathBase.prototype.Make_ShdColor = function(PDSE, CurTextPr)
{
    var Para      = PDSE.Paragraph;
    var pGraphics = PDSE.Graphics;
    var BgColor   = PDSE.BgColor;

    if ( undefined !== CurTextPr.Shd && Asc.c_oAscShdNil !== CurTextPr.Shd.Value )
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

    if (reviewtype_Common !== this.Get_ReviewType())
    {
        var ReviewColor = this.Get_ReviewColor();
        pGraphics.p_color(ReviewColor.r, ReviewColor.g, ReviewColor.b, 255);
        pGraphics.b_color1(ReviewColor.r, ReviewColor.g, ReviewColor.b, 255);
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
CMathBase.prototype.protected_RemoveItems = function(Pos, Items, bUpdatePosition)
{
    History.Add(this, new CChangesMathRemoveItems(Pos, Items));

    var Count = Items.length;
    this.raw_RemoveFromContent(Pos, Count);

    // Обновим текущую позицию
    if (this.CurPos > Pos + Count)
        this.CurPos -= Count;
    else if (this.CurPos > Pos )
        this.CurPos = Pos;

    this.private_CorrectCurPos();
    this.private_UpdatePosOnRemove(Pos, Count);
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
};
CMathBase.prototype.raw_RemoveFromContent = function(Pos, Count)
{
    this.Content.splice(Pos, Count);

    this.fillContent();
};
CMathBase.prototype.raw_SetColumn = function(Value)
{
    if(Value > 0)
        this.Pr.Set_Column(Value);
};
CMathBase.prototype.Recalc_RunsCompiledPr = function()
{
    this.RecalcInfo.bCtrPrp = true;

    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
        {
            var Item = this.elements[i][j];
            if(!Item.IsJustDraw())
                Item.Recalc_RunsCompiledPr();
        }
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
    var bContainCompareOper = PRS.bContainCompareOper;

    var bOneLine = PRS.bMath_OneLine;

    this.bOneLine = this.bCanBreak == false || PRS.bMath_OneLine == true;

    if(this.kind !== MATH_DELIMITER)
    {
        this.BrGapLeft  = this.GapLeft;
        this.BrGapRight = this.GapRight;
    }

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
                    this.MeasureJustDraw(Item);
                }
                else
                {
                    Item.Recalculate_Reset(PRS.Range, PRS.Line, PRS); // обновим StartLine и StartRange
                    Item.Recalculate_Range(PRS, ParaPr, Depth);
                }
            }
        }

        this.recalculateSize(g_oTextMeasurer);

        this.UpdatePRS_OneLine(PRS, WordLen, PRS.MathFirstItem);
        this.Bounds.SetWidth(0, 0, this.size.width);
        this.Bounds.UpdateMetrics(0, 0, this.size);
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

        for(var Pos = RangeStartPos; Pos < Len; Pos++)
        {
            var Item = this.Content[Pos];

            var NeedSetReset = CurLine == 0 && CurRange == 0  || Pos !== RangeStartPos;
            if(Item.Type == para_Math_Content && NeedSetReset)
                Item.Recalculate_Reset(PRS.Range, PRS.Line, PRS); // обновим StartLine и StartRange

            if(Pos == Numb)
            {
                PRS.Update_CurPos(Pos, Depth);
                PRS.bMath_OneLine  = false;

                Item.Recalculate_Range(PRS, ParaPr, Depth+1);

                if(true === PRS.NewRange)
                {
                    RangeEndPos = Numb;
                    break;
                }
            }
            else
            {
                PRS.bMath_OneLine = true;

                var WWordLen = PRS.WordLen;

                Item.Recalculate_Range(PRS, ParaPr, Depth+1);

                PRS.WordLen = WWordLen + Item.size.width;
                PRS.Word    = true;

            }

            if(PRS.NewRange == false && Pos < Len - 1)
                PRS.WordLen += this.dW;
        }

        if(PRS.NewRange == false)
        {
            PRS.WordLen += this.BrGapRight;
        }

        this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
    }

    PRS.bMath_OneLine = bOneLine;
    PRS.bContainCompareOper = bContainCompareOper;
};
/*CMathBase.prototype.Get_WrapToLine = function(_CurLine, _CurRange, WrapIndent)
{
    var Wrap = 0;

    if(this.bOneLine)
    {
        Wrap = WrapIndent;
    }
    else
    {
        var Pos = this.NumBreakContent;
        Wrap = this.Content[Pos].Get_WrapToLine(_CurLine, _CurRange, WrapIndent);
    }

    return Wrap;
};*/
CMathBase.prototype.Recalculate_MinMaxContentWidth = function(MinMax)
{
    var bOneLine = MinMax.bMath_OneLine;

    if(this.kind !== MATH_DELIMITER)
    {
        this.BrGapLeft  = this.GapLeft;
        this.BrGapRight = this.GapRight;
    }

    if(this.bCanBreak == false || MinMax.bMath_OneLine == true)
    {
        MinMax.bMath_OneLine = true;

        for(var i=0; i < this.nRow; i++)
        {
            for(var j = 0; j < this.nCol; j++)
            {
                var Item = this.elements[i][j];

                if(Item.IsJustDraw()) // для Just-Draw элементов надо выставить Font
                {
                    this.MeasureJustDraw(Item);
                }
                else
                {
                    Item.Recalculate_MinMaxContentWidth(MinMax);
                }
            }
        }

        this.recalculateSize(g_oTextMeasurer);

        var width = this.size.width;

        if(false === MinMax.bWord)
        {
            MinMax.bWord    = true;
            MinMax.nWordLen = width;
        }
        else
        {
            MinMax.nWordLen += width;
        }

        MinMax.nCurMaxWidth += width;
    }
    else
    {
        this.setDistance();

        var Numb = this.NumBreakContent;
        var Len = this.Content.length;

        if(false === MinMax.bWord)
        {
            MinMax.bWord    = true;
            MinMax.nWordLen = this.BrGapLeft;
        }
        else
        {
            MinMax.nWordLen += this.BrGapLeft;
        }

        MinMax.nCurMaxWidth += this.BrGapLeft;


        for(var Pos = 0; Pos < Len; Pos++)
        {
            var Item = this.Content[Pos];

            MinMax.bMath_OneLine = Pos !== Numb;
            Item.Recalculate_MinMaxContentWidth(MinMax);

            if(Pos !== Numb)
            {
                MinMax.nWordLen += Item.size.width;
                MinMax.nCurMaxWidth += Item.size.width;
            }

            if(Pos < Len - 1)
            {
                MinMax.nWordLen += this.dW;
                MinMax.nCurMaxWidth += this.dW;
            }
        }

        MinMax.nWordLen += this.BrGapRight;
        MinMax.nCurMaxWidth += this.BrGapRight;

    }

    MinMax.bMath_OneLine = bOneLine;
};
CMathBase.prototype.MeasureJustDraw = function(Item)
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
};
CMathBase.prototype.UpdatePRS_OneLine = function(PRS, WordLen)
{
    if(this.bInside == false)
    {
        PRS.WordLen = WordLen + this.size.width;
        PRS.MathFirstItem = false;
    }
};
CMathBase.prototype.Recalculate_Range_OneLine = function(PRS, ParaPr, Depth)
{
    this.Recalculate_Range(PRS, ParaPr, Depth);
};
CMathBase.prototype.Recalculate_LineMetrics = function(PRS, ParaPr, _CurLine, _CurRange, ContentMetrics)
{
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);

    if(PRS.bFastRecalculate === false)
    {
        this.Bounds.Reset(CurLine, CurRange);
    }

    var StartPos, EndPos;

    if(this.bOneLine)
    {
        var NewContentMetrics = new CMathBoundsMeasures();

        for (var CurPos = 0; CurPos < this.Content.length; CurPos++)
        {
            this.Content[CurPos].Recalculate_LineMetrics(PRS, ParaPr, _CurLine, _CurRange, NewContentMetrics);
        }

        //this.Bounds.UpdateMetrics(CurLine, CurRange, this.size);
        this.Bounds.UpdateMetrics(0, 0, this.size);

        // чтобы внутр объекты не перебили метрики (например, у внутр мат объекта Asc может быть больше Asc текущего объекта)

        ContentMetrics.UpdateMetrics(this.size);

        if(this.Parent.bRoot)
        {
            this.UpdatePRS(PRS, this.size);
        }
    }
    else
    {
        StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
        {
            var Item = this.Content[CurPos];
            Item.Recalculate_LineMetrics(PRS, ParaPr, _CurLine, _CurRange, ContentMetrics);

            var BoundItem = Item.Get_LineBound(_CurLine, _CurRange);

            this.Bounds.UpdateMetrics(CurLine, CurRange, BoundItem);
            //ContentMetrics.UpdateMetrics(BoundItem);

            this.UpdatePRS(PRS, BoundItem);
        }
    }
};
CMathBase.prototype.IsEmptyRange = function(_CurLine, _CurRange)
{
    var bEmpty = false;
    var Numb = this.NumBreakContent;

    if(this.bOneLine == false)
    {
        bEmpty = this.Content[Numb].IsEmptyRange(_CurLine, _CurRange);
    }

    return bEmpty;
};
CMathBase.prototype.Is_EmptyRange = function(_CurLine, _CurRange)
{
    return this.bOneLine == true ? false : this.Content[this.NumBreakContent].Is_EmptyRange(_CurLine, _CurRange);
};
CMathBase.prototype.Get_LineBound = function(_CurLine, _CurRange)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    return this.Bounds.Get_LineBound(CurLine, CurRange);
};
CMathBase.prototype.UpdatePRS = function(PRS, Metric)
{
    var MetricAsc  = Metric.Type == MATH_SIZE ? Metric.ascent : Metric.Asc;
    var MetricDesc = Metric.Type == MATH_SIZE ? Metric.height - Metric.ascent : Metric.H - Metric.Asc;

    if(PRS.LineAscent < MetricAsc)
        PRS.LineAscent = MetricAsc;

    if(PRS.LineDescent < MetricDesc)
        PRS.LineDescent = MetricDesc;


};
CMathBase.prototype.UpdateMetrics = function(PRS, Size)
{
    if(PRS.LineAscent < Size.ascent)
        PRS.LineAscent = Size.ascent;

    if(PRS.LineDescent < Size.height - Size.ascent)
        PRS.LineDescent = Size.height - Size.ascent;
};
CMathBase.prototype.Recalculate_Range_Width = function(PRSC, _CurLine, _CurRange)
{
    var RangeW = PRSC.Range.W;

    var CurLine = _CurLine - this.StartLine;
    var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

    if(this.bOneLine)
    {
        for (var Pos = 0; Pos <= this.Content.length - 1; Pos++)
        {
            this.Content[Pos].Recalculate_Range_Width( PRSC, _CurLine, _CurRange );
        }

        PRSC.Range.W = RangeW + this.size.width;
    }
    else
    {
        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        if(CurLine == 0 && CurRange == 0)
            PRSC.Range.W += this.BrGapLeft;

        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++)
        {
            this.Content[CurPos].Recalculate_Range_Width( PRSC, _CurLine, _CurRange );
        }

        PRSC.Range.W += this.dW*(EndPos - StartPos);

        // Здесь проверяем не на то, что это последний Range (т.к. на данном этапе еще идет вычисление строк) а на конец контента !

        var Len = this.Content.length;
        var EndBrContentEnd = this.NumBreakContent == EndPos && this.Content[EndPos].Math_Is_End( _CurLine, _CurRange),
            NotBrContent = this.NumBreakContent !== EndPos;

        var bEnd = EndBrContentEnd || NotBrContent;

        if(EndPos == Len - 1 && true === bEnd)
        {
            PRSC.Range.W += this.BrGapRight;
        }
    }

    this.Bounds.SetWidth(CurLine, CurRange, PRSC.Range.W - RangeW);
};
CMathBase.prototype.UpdateOperators = function(_CurLine, _CurRange, bEmptyGapLeft, bEmptyGapRight)
{
    if(this.bOneLine == false)
    {
         // Content[this.NumBreakContent] должен содержаться в каждой строке многострочного объекта
         this.Content[this.NumBreakContent].UpdateOperators(_CurLine, _CurRange, bEmptyGapLeft, bEmptyGapRight);
    }

};
CMathBase.prototype.IsShade = function()
{
    var oShd = this.Get_CompiledCtrPrp().Shd;
    return !(oShd === undefined || Asc.c_oAscShdNil === oShd.Value);
};
CMathBase.prototype.Get_Range_VisibleWidth = function(RangeW, _CurLine, _CurRange)
{
    if(this.bOneLine)
    {
        RangeW.W += this.size.width;
    }
    else
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
        var EndPos   = this.protected_GetRangeEndPos(CurLine, CurRange);

        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Get_Range_VisibleWidth(RangeW, _CurLine, _CurRange);
        }
    }
};
CMathBase.prototype.Displace_BreakOperator = function(isForward, bBrkBefore, CountOperators)
{
    this.Content[this.NumBreakContent].Displace_BreakOperator(isForward, bBrkBefore, CountOperators);
};
CMathBase.prototype.Get_AlignBrk = function(_CurLine, bBrkBefore)
{
    return this.Content[this.NumBreakContent].Get_AlignBrk(_CurLine, bBrkBefore);
};
CMathBase.prototype.raw_SetReviewType = function(Type, Info)
{
    this.ReviewType = Type;
    this.ReviewInfo = Info;
    this.private_UpdateTrackRevisions();
};
CMathBase.prototype.Get_ReviewType = function()
{
    if (this.Id)
        return this.ReviewType;
    else if (this.Parent && this.Parent.Get_ReviewType)
        return this.Parent.Get_ReviewType();

    return reviewtype_Common;
};
CMathBase.prototype.Get_ReviewColor = function()
{
    if (this.Id)
    {
        if (this.ReviewInfo)
            return this.ReviewInfo.Get_Color();
        else
            return new CDocumentColor(255, 0, 0);
    }
    else if (this.Parent && this.Parent.Get_ReviewColor)
    {
        return this.Parent.Get_ReviewColor();
    }

    return REVIEW_COLOR;
};
CMathBase.prototype.Set_ReviewType = function(Type, isSetToContent)
{
    if (!this.Id)
        return;

    if (false !== isSetToContent)
        CMathBase.superclass.Set_ReviewType.apply(this, arguments);

    if (Type !== this.ReviewType)
    {
        var NewInfo = new CReviewInfo();
        NewInfo.Update();

        History.Add(this, new CChangesMathBaseReviewType(Type, NewInfo, this.ReviewType, this.ReviewInfo));
        this.raw_SetReviewType(Type, NewInfo);
    }
};
CMathBase.prototype.Set_ReviewTypeWithInfo = function(ReviewType, ReviewInfo)
{
    if (!this.Id)
        return;

    CMathBase.superclass.Set_ReviewTypeWithInfo.apply(this, arguments);

    History.Add(this, new CChangesMathBaseReviewType(ReviewType, ReviewInfo, this.ReviewType, this.ReviewInfo));
    this.raw_SetReviewType(ReviewType, ReviewInfo);
};
CMathBase.prototype.Check_RevisionsChanges = function(Checker, ContentPos, Depth)
{
    var ReviewType = this.Get_ReviewType();

    if (true !== Checker.Is_CheckOnlyTextPr())
    {
        if (ReviewType !== Checker.Get_AddRemoveType() || (reviewtype_Common !== ReviewType && this.ReviewInfo.Get_UserId() !== Checker.Get_AddRemoveUserId()))
        {
            Checker.Flush_AddRemoveChange();
            ContentPos.Update(0, Depth);

            if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
            {
                this.Get_StartPos(ContentPos, Depth);
                Checker.Start_AddRemove(ReviewType, ContentPos);
            }
        }

        if (reviewtype_Add === ReviewType || reviewtype_Remove === ReviewType)
        {
            Checker.Add_Math(this);
            Checker.Update_AddRemoveReviewInfo(this.ReviewInfo);
            this.Get_EndPos(false, ContentPos, Depth);
            Checker.Set_AddRemoveEndPos(ContentPos);

            // Нам нужно проставить конечную позицию в начало следующего рана, чтобы выделился данный элемент целиком
            if (this.Paragraph)
            {
                var TempContentPos = this.Paragraph.Get_PosByElement(this);
                if (TempContentPos)
                {
                    var InParentPos = TempContentPos.Get(TempContentPos.Get_Depth());
                    TempContentPos.Decrease_Depth(1);
                    var Parent = this.Paragraph.Get_ElementByPos(TempContentPos);
                    if (Parent && Parent.Content && this === Parent.Content[InParentPos] && Parent.Content[InParentPos + 1] && para_Math_Run === Parent.Content[InParentPos + 1].Type)
                    {
                        ContentPos.Update(InParentPos + 1, Depth - 1);
                        Parent.Content[InParentPos + 1].Get_StartPos(ContentPos, Depth);
                        Checker.Set_AddRemoveEndPos(ContentPos);
                    }
                }
            }
        }
    }

    if (reviewtype_Common !== ReviewType)
        Checker.Begin_CheckOnlyTextPr();

    CMathBase.superclass.Check_RevisionsChanges.apply(this, arguments);

    if (reviewtype_Common !== ReviewType)
        Checker.End_CheckOnlyTextPr();
};
CMathBase.prototype.Accept_RevisionChanges = function(Type, bAll)
{
    var ReviewType = this.ReviewType;
    if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextAdd === Type))
    {
        this.Set_ReviewType(reviewtype_Common, false);
    }
    else if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextRem === Type))
    {
        var Parent = this.Get_Parent();
        var PosInParent = this.Get_PosInParent(Parent);

        if (!Parent || -1 === PosInParent)
        {
            this.Set_ReviewType(reviewtype_Common, false);
        }
        else
        {
            Parent.Remove_FromContent(PosInParent, 1);
            return;
        }
    }

    CMathBase.superclass.Accept_RevisionChanges.apply(this, arguments);
};
CMathBase.prototype.Reject_RevisionChanges = function(Type, bAll)
{
    var ReviewType = this.ReviewType;
    if (reviewtype_Remove === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextRem === Type))
    {
        this.Set_ReviewType(reviewtype_Common, false);
    }
    else if (reviewtype_Add === ReviewType && (undefined === Type || c_oAscRevisionsChangeType.TextAdd === Type))
    {
        var Parent = this.Get_Parent();
        var PosInParent = this.Get_PosInParent(Parent);

        if (!Parent || -1 === PosInParent)
        {
            this.Set_ReviewType(reviewtype_Common, false);
        }
        else
        {
            Parent.Remove_FromContent(PosInParent, 1);
            return;
        }
    }

    CMathBase.superclass.Reject_RevisionChanges.apply(this, arguments);
};
CMathBase.prototype.Set_MenuProps = function(Props)
{
    this.Apply_ForcedBreak(Props);

    if(this.Selection.Use == false)
    {
        this.Content[this.CurPos].Set_MenuProps(Props);
    }
    else if(this.Selection.Use == true && this.Selection.StartPos == this.Selection.EndPos)
    {
        var Pos = this.Selection.StartPos;
        this.Content[Pos].Set_MenuProps(Props);
    }
};
CMathBase.prototype.Can_ApplyMenuPropsToObject = function()
{
    var bApplyToCurrent = false;

    if(this.Selection.Use == true && this.Selection.StartPos !== this.Selection.EndPos)
    {
        bApplyToCurrent = true;
    }
    else
    {
        var Pos = this.Selection.Use == false ? this.CurPos : this.Selection.StartPos;
        bApplyToCurrent = true === this.Content[Pos].Is_CurrentContent();
    }

    return bApplyToCurrent;
};
CMathBase.prototype.Get_MenuProps = function()
{
    var Pr = {};
    var Pos = null;

    if(this.Selection.Use == false)
    {
        Pos = this.CurPos;
    }
    else if(this.Selection.StartPos == this.Selection.EndPos)
    {
        Pos = this.Selection.StartPos;
    }

    var bOutsideComposition   = Pos !== null && true == this.Content[Pos].Check_Composition(),
        bSelectAllComposition = Pos == null;

    if(bOutsideComposition)
    {
        Pr = this.Content[Pos].Get_MenuProps();
        this.Can_ModifyForcedBreak(Pr);
    }
    else if(bSelectAllComposition == false)
    {
        Pr = this.Get_InterfaceProps();
        this.Content[Pos].Can_ModifyForcedBreak(Pr);
    }
    else
    {
        Pr = this.Get_InterfaceProps();
    }

    return Pr;
};
CMathBase.prototype.Apply_MenuProps = function()
{};
CMathBase.prototype.Can_ModifyForcedBreak = function(Pr)
{
};
CMathBase.prototype.Apply_ForcedBreak = function()
{
};
CMathBase.prototype.Get_DeletedItemsThroughInterface = function()
{
    var baseContent  = this.getBase();
    var DeletedItems =  baseContent !==  null ? baseContent.Content : null;

    return DeletedItems;
};
CMathBase.prototype.Can_DecreaseArgumentSize = function()
{
    var bDecreaseArgSize = false;

    if(true === this.Can_ModifyArgSize())
    {
        var CompiledArgSize = this.Content[this.CurPos].Get_CompiledArgSize();
        bDecreaseArgSize = CompiledArgSize.Can_Decrease();
    }

    return bDecreaseArgSize;
};
CMathBase.prototype.Can_IncreaseArgumentSize = function()
{
    var bIncreaseArgSize = false;

    if(true === this.Can_ModifyArgSize())
    {
        var CompiledArgSize = this.Content[this.CurPos].Get_CompiledArgSize();
        bIncreaseArgSize = CompiledArgSize.Can_Increase();
    }

    return bIncreaseArgSize;
};
CMathBase.prototype.Get_InterfaceProps = function()
{
    return new CMathMenuBase();
};
CMathBase.prototype.Can_ModifyArgSize = function()
{
    return false;
};
CMathBase.prototype.Is_SelectInside = function()
{
    return this.Selection.Use == true && this.Selection.StartPos !== this.Selection.EndPos;
};
CMathBase.prototype.Can_InsertForcedBreak = function()
{
    return false;
};
CMathBase.prototype.Can_DeleteForcedBreak = function()
{
    return false;
};
CMathBase.prototype.Correct_ContentCurPos = function()
{
    for(var Pos = 0; Pos < this.Content.length; Pos++)
    {
        this.Content[Pos].Correct_ContentCurPos();
    }
};
CMathBase.prototype.Math_Set_EmptyRange         = CMathContent.prototype.Math_Set_EmptyRange;
CMathBase.prototype.Set_ParaMath                = CMathContent.prototype.Set_ParaMath;
CMathBase.prototype.Recalculate_Reset           = CMathContent.prototype.Recalculate_Reset;
CMathBase.prototype.Set_ParaContentPos          = CMathContent.prototype.Set_ParaContentPos;
CMathBase.prototype.Get_CurrentParaPos          = CMathContent.prototype.Get_CurrentParaPos;
CMathBase.prototype.private_UpdatePosOnAdd      = CMathContent.prototype.private_UpdatePosOnAdd;
CMathBase.prototype.private_UpdatePosOnRemove   = CMathContent.prototype.private_UpdatePosOnRemove;
CMathBase.prototype.private_CorrectSelectionPos = CMathContent.prototype.private_CorrectSelectionPos;

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
CMathBounds.prototype.Reset = function(CurLine, CurRange)
{
    if(CurRange == 0)
        this.Bounds.length = CurLine;
};
CMathBounds.prototype.CheckLineBound = function(Line, Range)
{
    if(this.Bounds.length <= Line)
    {
        this.Bounds[Line] = [];
    }

    if(this.Bounds[Line].length <= Range)
    {
        this.Bounds[Line][Range] = new CMathBoundsMeasures();
    }
};
CMathBounds.prototype.UpdateMetrics = function(Line, Range, Metric)
{
    this.CheckLineBound(Line, Range);
    this.Bounds[Line][Range].UpdateMetrics(Metric);
};
CMathBounds.prototype.SetWidth = function(Line, Range, Width)
{
    this.CheckLineBound(Line, Range);
    this.Bounds[Line][Range].SetWidth(Width);
};
CMathBounds.prototype.SetPage = function(Line, Range, Page)
{
    this.CheckLineBound(Line);
    this.Bounds[Line][Range].SetPage(Page);
};
CMathBounds.prototype.Get_Width = function(Line, Range)
{
    this.CheckLineBound(Line);
    return this.Bounds[Line][Range].W;
};
CMathBounds.prototype.GetAscent = function(Line, Range)
{
    this.CheckLineBound(Line);
    return this.Bounds[Line][Range].Asc;
};
CMathBounds.prototype.GetDescent = function(Line, Range)
{
    this.CheckLineBound(Line);
    return this.Bounds[Line][Range].H - this.Bounds[Line][Range].Asc;
};
CMathBounds.prototype.ShiftPage = function(Dx)
{
    var CountLines = this.Bounds.length;

    for(var CurLine = 0; CurLine < CountLines; CurLine++)
    {
        var CountRanges = this.Bounds[CurLine].length;

        for(var CurRange = 0; CurRange < CountRanges; CurRange++)
        {
            this.Bounds[CurLine][CurRange].ShiftPage(Dx);
        }
    }
};
CMathBounds.prototype.Get_Bounds = function()
{
    return this.Bounds;
};
CMathBounds.prototype.Get_LineBound = function(CurLine, CurRange)
{
    var Bound;
    if(CurLine < this.Bounds.length && CurRange < this.Bounds[CurLine].length)
    {
        Bound = this.Bounds[CurLine][CurRange];
    }
    else // заглушка, если еще не пересчитали, а запрос Bonds пришел (например, на поиске)
    {
        Bound = new CMathBoundsMeasures();
    }

    return Bound;
};
CMathBounds.prototype.SetPos = function(Line, Range, Pos)
{
    this.CheckLineBound(Line, Range);
    this.Bounds[Line][Range].SetPos(Pos);
};
CMathBounds.prototype.SetGenPos = function(Line, Range, PRSA)
{
    this.CheckLineBound(Line, Range);
    this.Bounds[Line][Range].SetGenPos(PRSA);
};
CMathBounds.prototype.ShiftPos = function(Line, Range, Dx, Dy)
{
    this.CheckLineBound(Line, Range);
    this.Bounds[Line][Range].ShiftPos(Dx, Dy);
};
CMathBounds.prototype.GetPos = function(Line, Range)
{
    this.CheckLineBound(Line);

    var Pos = new CMathPosition();

    Pos.x = this.Bounds[Line][Range].GetX();
    Pos.y = this.Bounds[Line][Range].GetY();

    return Pos;
};
function CMathBoundsMeasures()
{
    this.Type = MATH_BOUNDS_MEASURES;

    // нужны ля расчета выравниваний относительно операторов
    this._X   = 0;
    this._Y   = 0;
    // необходимы для отрисовки рамки, подсветки
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
CMathBoundsMeasures.prototype.SetWidth = function(Width)
{
    this.W = Width;
};
CMathBoundsMeasures.prototype.SetGenPos = function(PRSA)
{
    this.X = PRSA.X + this._X;
    this.Y = PRSA.Y + this._Y;
};
CMathBoundsMeasures.prototype.SetPos = function(Pos)
{
    this._X = Pos.x;
    this._Y = Pos.y - this.Asc;
};
CMathBoundsMeasures.prototype.ShiftPos = function(Dx, Dy)
{
    this.X += Dx;
    this.Y += Dy;
};
CMathBoundsMeasures.prototype.GetX = function()
{
    return this.X;
};
CMathBoundsMeasures.prototype.GetY = function()
{
    return this.Y + this.Asc;
};
CMathBoundsMeasures.prototype.SetPage = function(Page)
{
    this.Page = Page;
};
CMathBoundsMeasures.prototype.ShiftPage = function(Dx)
{
    this.Page += Dx;
};

function CEmptyRunRecalculateObject(StartLine, StartRange)
{
    this.StartLine   = StartLine;
    this.StartRange  = StartRange;
    this.Lines       = [];
    this.Content     = [];

    this.WrapState   = ALIGN_EMPTY;
}
CEmptyRunRecalculateObject.prototype =
{
    Save_Lines : function(Obj, Copy)
    {

    },

    Save_Content : function(Obj, Copy)
    {

    },

    Save_WrapState: function(Obj, Copy)
    {

    },

    Load_Lines : function(Obj)
    {

    },

    Load_Content : function(Obj)
    {

    },

    Load_WrapState: function(Obj)
    {

    },

    Save_RunContent : function(Run, Copy)
    {

    },

    Load_RunContent : function(Run)
    {

    },

    Get_DrawingFlowPos : function(FlowPos)
    {

    },

    Compare : function(_CurLine, _CurRange, OtherLinesInfo)
    {
        return true;
    }

};

var c_oMathMenuAction = {
    None                    : 0x00000000,
    RemoveAccentCharacter   : 0x00000001,
    RemoveBar               : 0x00000002,
    InsertMatrixRow         : 0x00000004,
    InsertMatrixColumn      : 0x00000008,
    InsertBefore            : 0x00000010,
    DeleteMatrixRow         : 0x00000020,
    DeleteMatrixColumn      : 0x00000040,
    InsertEquation          : 0x00000080,
    DeleteEquation          : 0x00000100,
    InsertDelimiterArgument : 0x00000200,
    DeleteDelimiterArgument : 0x00000400,
    IncreaseArgumentSize    : 0x00000800,
    DecreaseArgumentSize    : 0x00001000,
    InsertForcedBreak       : 0x00002000,
    DeleteForcedBreak       : 0x00004000,
    AlignToCharacter        : 0x00008000,
    RemoveDelimiter         : 0x00010000,
    RemoveRadical           : 0x00020000

};

function CMathMenuBase(oMath)
{
    this.Type   = c_oAscMathInterfaceType.Common;
    this.Action = c_oMathMenuAction.None;

    if(oMath == undefined)
    {
        this.CanIncreaseArgumentSize = false;
        this.CanDecreaseArgumentSize = false;
        this.CanInsertForcedBreak    = false;
        this.CanDeleteForcedBreak    = false;
        this.CanAlignToCharacter     = false;
    }
    else
    {
        this.CanIncreaseArgumentSize = oMath.Can_IncreaseArgumentSize();
        this.CanDecreaseArgumentSize = oMath.Can_DecreaseArgumentSize();
        this.CanInsertForcedBreak    = oMath.Can_InsertForcedBreak();
        this.CanDeleteForcedBreak    = oMath.Can_DeleteForcedBreak();
        this.CanAlignToCharacter     = false;
    }
}
CMathMenuBase.prototype.get_Type = function()
{
    return this.Type;
};
CMathMenuBase.prototype.remove_AccentCharacter = function()
{
    this.Action |= c_oMathMenuAction.RemoveAccentCharacter;
};
CMathMenuBase.prototype.remove_Bar = function()
{
    this.Action |= c_oMathMenuAction.RemoveBar;
};
CMathMenuBase.prototype.insert_MatrixRow = function(bBefore)
{
    if (bBefore)
        this.Action |= c_oMathMenuAction.InsertBefore;

    this.Action |= c_oMathMenuAction.InsertMatrixRow;
};
CMathMenuBase.prototype.insert_MatrixColumn = function(bBefore)
{
    if (bBefore)
        this.Action |= c_oMathMenuAction.InsertBefore;

    this.Action |= c_oMathMenuAction.InsertMatrixColumn;
};
CMathMenuBase.prototype.delete_MatrixRow = function()
{
    this.Action |= c_oMathMenuAction.DeleteMatrixRow;
};
CMathMenuBase.prototype.delete_MatrixColumn = function()
{
    this.Action |= c_oMathMenuAction.DeleteMatrixColumn;
};
CMathMenuBase.prototype.insert_Equation = function(bBefore)
{
    if (bBefore)
        this.Action |= c_oMathMenuAction.InsertBefore;

    this.Action |= c_oMathMenuAction.InsertEquation;
};
CMathMenuBase.prototype.delete_Equation = function()
{
    this.Action |= c_oMathMenuAction.DeleteEquation;
};
CMathMenuBase.prototype.insert_DelimiterArgument = function(bBefore)
{
    if (bBefore)
        this.Action |= c_oMathMenuAction.InsertBefore;

    this.Action |= c_oMathMenuAction.InsertDelimiterArgument;
};
CMathMenuBase.prototype.delete_DelimiterArgument = function()
{
    this.Action |= c_oMathMenuAction.DeleteDelimiterArgument;
};
CMathMenuBase.prototype.can_IncreaseArgumentSize = function()
{
    return this.CanIncreaseArgumentSize;
};
CMathMenuBase.prototype.can_DecreaseArgumentSize = function()
{
    return this.CanDecreaseArgumentSize;
};
CMathMenuBase.prototype.increase_ArgumentSize = function()
{
    this.Action |= c_oMathMenuAction.IncreaseArgumentSize;
};
CMathMenuBase.prototype.decrease_ArgumentSize = function()
{
    this.Action |= c_oMathMenuAction.DecreaseArgumentSize;
};
CMathMenuBase.prototype.can_InsertManualBreak = function()
{
    return this.CanInsertForcedBreak;
};
CMathMenuBase.prototype.can_DeleteManualBreak = function()
{
    return this.CanDeleteForcedBreak;
};
CMathMenuBase.prototype.can_AlignToCharacter = function()
{
    return this.CanAlignToCharacter;
};
CMathMenuBase.prototype.insert_ManualBreak = function()
{
    this.Action |= c_oMathMenuAction.InsertForcedBreak;
};
CMathMenuBase.prototype.delete_ManualBreak = function()
{
    this.Action |= c_oMathMenuAction.DeleteForcedBreak;
};
CMathMenuBase.prototype.align_ToCharacter = function()
{
    this.Action |= c_oMathMenuAction.AlignToCharacter;
};
CMathMenuBase.prototype.remove_DelimiterCharacters = function()
{
    this.Action |= c_oMathMenuAction.RemoveDelimiter;
};
CMathMenuBase.prototype.remove_Radical = function()
{
    this.Action |= c_oMathMenuAction.RemoveRadical;
};
CMathMenuBase.prototype.Set_InsertForcedBreak = function()
{
    this.CanInsertForcedBreak = true;
    this.CanDeleteForcedBreak = false;
};
CMathMenuBase.prototype.Set_DeleteForcedBreak = function()
{
    this.CanInsertForcedBreak = false;
    this.CanDeleteForcedBreak = true;
};

window["CMathMenuBase"]                                = CMathMenuBase;
CMathMenuBase.prototype["get_Type"]                    = CMathMenuBase.prototype.get_Type;
CMathMenuBase.prototype["remove_AccentCharacter"]      = CMathMenuBase.prototype.remove_AccentCharacter;
CMathMenuBase.prototype["remove_Bar"]                  = CMathMenuBase.prototype.remove_Bar;
CMathMenuBase.prototype["insert_MatrixRow"]            = CMathMenuBase.prototype.insert_MatrixRow;
CMathMenuBase.prototype["insert_MatrixColumn"]         = CMathMenuBase.prototype.insert_MatrixColumn;
CMathMenuBase.prototype["delete_MatrixRow"]            = CMathMenuBase.prototype.delete_MatrixRow;
CMathMenuBase.prototype["delete_MatrixColumn"]         = CMathMenuBase.prototype.delete_MatrixColumn;
CMathMenuBase.prototype["insert_Equation"]             = CMathMenuBase.prototype.insert_Equation;
CMathMenuBase.prototype["delete_Equation"]             = CMathMenuBase.prototype.delete_Equation;
CMathMenuBase.prototype["insert_DelimiterArgument"]    = CMathMenuBase.prototype.insert_DelimiterArgument;
CMathMenuBase.prototype["delete_DelimiterArgument"]    = CMathMenuBase.prototype.delete_DelimiterArgument;
CMathMenuBase.prototype["can_IncreaseArgumentSize"]    = CMathMenuBase.prototype.can_IncreaseArgumentSize;
CMathMenuBase.prototype["can_DecreaseArgumentSize"]    = CMathMenuBase.prototype.can_DecreaseArgumentSize;
CMathMenuBase.prototype["increase_ArgumentSize"]       = CMathMenuBase.prototype.increase_ArgumentSize;
CMathMenuBase.prototype["decrease_ArgumentSize"]       = CMathMenuBase.prototype.decrease_ArgumentSize;
CMathMenuBase.prototype["can_InsertManualBreak"]       = CMathMenuBase.prototype.can_InsertManualBreak;
CMathMenuBase.prototype["insert_ManualBreak"]          = CMathMenuBase.prototype.insert_ManualBreak;
CMathMenuBase.prototype["can_DeleteManualBreak"]       = CMathMenuBase.prototype.can_DeleteManualBreak;
CMathMenuBase.prototype["delete_ManualBreak"]          = CMathMenuBase.prototype.delete_ManualBreak;
CMathMenuBase.prototype["can_AlignToCharacter"]        = CMathMenuBase.prototype.can_AlignToCharacter;
CMathMenuBase.prototype["align_ToCharacter"]           = CMathMenuBase.prototype.align_ToCharacter;
CMathMenuBase.prototype["remove_DelimiterCharacters"]  = CMathMenuBase.prototype.remove_DelimiterCharacters;
CMathMenuBase.prototype["remove_Radical"]              = CMathMenuBase.prototype.remove_Radical;
