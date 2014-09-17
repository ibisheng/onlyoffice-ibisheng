"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 16.09.14
 * Time: 12:04
 */

/**
 * Здесь мы пытаем быстро пересчитать текущий параграф. Если быстрый пересчет срабатывает, тогда возвращаются страницы,
 * которые нужно перерисовать, в противном случае вовзращается пустой массив.
 * @returns {*}
 */
Paragraph.prototype.Recalculate_Fast_WholeParagraph = function()
{
    // Здесь мы отдельно обрабатываем случаи быстрого пересчета параграфов, которые были разбиты на 1-2
    // страницы. Если параграф был разбит более чем на 2 страницы, то такое ускорение уже не имеет смысла.
    if (1 === this.Pages.length)
    {
        // Если параграф был разбит на 1 страницу изначально, тогда мы проверяем, чтобы он после пересчета
        // был также разбит на 1 страницу, кроме этого проверяем изменились ли границы параграфа, а во время пересчета
        // смотрим изменяeтся ли положение flow-объектов, привязанных к данному параграфу, кроме того, если по какой-то
        // причине пересчет возвращает не recalcresult_NextElement, тогда тоже отменяем быстрый пересчет

        var PageNum          = this.Get_StartPage_Absolute();
        var OldBounds        = this.Pages[0].Bounds;
        var FastRecalcResult = this.Recalculate_Page(PageNum, true);

        if (FastRecalcResult === recalcresult_NextElement && 1 === this.Pages.length && true === this.Pages[0].Bounds.Compare(OldBounds))
        {
            //console.log("Recalc Fast WholeParagraph 1 page");

            return [PageNum];
        }
    }
    else if (2 === this.Pages.length)
    {
        // Если параграф был разбит на 2 страницы изначально, тогда мы проверяем, чтобы он после пересчета
        // был также разбит на 2 страницы, кроме этого проверяем изменились ли границы параграфа на каждой странице,
        // а во время пересчета смотрим изменяeтся ли положение flow-объектов, привязанных к данному параграфу.
        // Кроме того, если по какой-то причине пересчет возвращает не recalcresult_NextPage на первой странице, или не
        // recalcresult_NextElement, тогда тоже отменяем быстрый пересчет.
        var OldBounds_0 = this.Pages[0].Bounds;
        var OldBounds_1 = this.Pages[1].Bounds;

        // Чтобы защититься от неправильной работы, связанной с переносом параграфа на новую страницу,
        // будем следить за тем, начинался ли изначально параграф с новой страницы, и начинается ли он с
        // новой страницы сейчас.
        var OldStartFromNewPage = this.Pages[0].StartLine < 0 ? true : false;

        // Чтобы защититься от неправильной работой с висячими строками, будем следить за количеством строк
        // если оно меньше либо равно 2 на какой-либо странице до/после пересчета.
        var OldLinesCount_0 = this.Pages[0].EndLine - this.Pages[0].StartLine + 1;
        var OldLinesCount_1 = this.Pages[1].EndLine - this.Pages[1].StartLine + 1;

        var PageNum = this.Get_StartPage_Absolute();
        var FastRecalcResult = this.Recalculate_Page(PageNum, true);

        if (FastRecalcResult !== recalcresult_NextPage)
            return [];

        FastRecalcResult = this.Recalculate_Page(PageNum + 1);
        if (FastRecalcResult !== recalcresult_NextElement)
            return [];

        // Сравниваем количество страниц (хотя оно должно быть 2 к данному моменту) и границы каждой страницы
        if (2 !== this.Pages.length || true !== this.Pages[0].Bounds.Compare(OldBounds_0) || true !== this.Pages[1].Bounds.Compare(OldBounds_1))
            return [];

        // Проверяем пустую первую страницу
        var StartFromNewPage = this.Pages[0].StartLine < 0 ? true : false;
        if (StartFromNewPage !== OldStartFromNewPage)
            return [];

        // Если параграф начался с новой страницы, тогда у него не надо проверять висячие строки
        if (true !== StartFromNewPage)
        {
            var LinesCount_0 = this.Pages[0].EndLine - this.Pages[0].StartLine + 1;
            var LinesCount_1 = this.Pages[1].EndLine - this.Pages[1].StartLine + 1;

            if ((OldLinesCount_0 <= 2 || LinesCount_0 <= 2) && OldLinesCount_0 !== LinesCount_0)
                return [];

            if ((OldLinesCount_1 <= 2 || LinesCount_1 <= 2) && OldLinesCount_1 !== LinesCount_1)
                return [];
        }

        //console.log("Recalc Fast WholeParagraph 2 pages");

        // Если параграф начинается с новой страницы, тогда не надо перерисовывать первую страницу, т.к. она
        // изначально была пустая, и сейчас пустая.
        if (true === StartFromNewPage)
            return [PageNum + 1];
        else
            return [PageNum, PageNum + 1];
    }

    return [];
};
/**
 * Пытаемся быстро рассчитать отрезок, в котором произошли изменения, и если ничего не съехало, тогда
 * перерисовываем страницу, в противном случаем запускаем обычный пересчет.
 * @param SimpleChanges
 * @returns {*} -1 если быстрый пересчет не получился, либо номер страницы, которую нужно перерисовать
 */
Paragraph.prototype.Recalculate_Fast_Range = function(SimpleChanges)
{
    if ( true === this.Parent.Is_HdrFtr(false) )
        return -1;

    var Run = SimpleChanges[0].Class;
    var ParaPos = Run.Get_SimpleChanges_ParaPos(SimpleChanges);
    if ( null === ParaPos )
        return -1;

    var Line  = ParaPos.Line;
    var Range = ParaPos.Range;

    // TODO: Отключаем это ускорение в таблицах, т.к. в таблицах и так есть свое ускорение. Но можно и это ускорение
    // подключить, для этого надо проверять изменились ли MinMax ширины и набираем ли мы в строке заголовков.
    if ( undefined === this.Parent || true === this.Parent.Is_TableCellContent() )
        return -1;

    // Если мы находимся в строке, которая была полностью перенесена из-за обтекания,  и мы добавляем пробел, или
    // удаляем символ, тогда нам запускать обычный пересчет, т.к. первое слово может начать убираться в промежутках
    // обтекания, которых у нас нет в отрезках строки
    if ( true === this.Lines[Line].RangeY )
    {
        // TODO: Сделать проверку на добавление пробела и удаление
        return -1;
    }

    // Если у нас есть PageBreak в строке, запускаем обычный пересчет, либо если это пустой параграф.
    if ( this.Lines[Line].LineInfo & 1 || (  this.Lines[Line].LineInfo & 2 &&  this.Lines[Line].LineInfo & 4 ) )
        return  -1;

    // Если у нас отрезок, в котором произошли изменения является отрезком с нумерацией, тогда надо запустить
    // обычный пересчет.
    var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
    if ( null !== this.Numbering.Item && ( Line < this.Numbering.Line || ( Line === this.Numbering.Line && Range <= this.Numbering.Range ) ) && ( undefined !== NumPr && undefined !== NumPr.NumId && 0 !== NumPr.NumId && "0" !== NumPr.NumId ) )
    {
        // TODO: Сделать проверку на само изменение, переместилась ли нумерация
        return -1;
    }

    if ( 0 === Line && 0 === Range && undefined !== this.Get_SectionPr() )
    {
        return -1;
    }

    // Если наш параграф является рамкой с авто шириной, тогда пересчитываем по обычному
    // TODO: Улучишить данную проверку
    if ( 1 === this.Lines.length && true !== this.Is_Inline() )
        return -1;

    // Мы должны пересчитать как минимум 3 отрезка: текущий, предыдущий и следующий, потому что при удалении элемента
    // или добавлении пробела первое слово в данном отрезке может убраться в предыдущем отрезке, и кроме того при
    // удалении возможен вариант, когда мы неправильно определили отрезок (т.е. более ранний взяли). Но возможен
    // вариант, при котором предыдущий или/и следующий отрезки - пустые, т.е. там нет ни одного текстового элемента
    // тогда мы начинаем проверять с отрезка, в котором есть хоть что-то.

    var PrevLine  = Line;
    var PrevRange = Range;

    while ( PrevLine >= 0 )
    {
        PrevRange--;

        if ( PrevRange < 0 )
        {
            PrevLine--;

            if ( PrevLine < 0 )
                break;

            PrevRange = this.Lines[PrevLine].Ranges.length - 1;
        }

        if ( true === this.Is_EmptyRange( PrevLine, PrevRange ) )
            continue;
        else
            break;
    }

    if ( PrevLine < 0 )
    {
        PrevLine  = Line;
        PrevRange = Range;
    }

    var NextLine  = Line;
    var NextRange = Range;

    var LinesCount = this.Lines.length;

    while ( NextLine <= LinesCount - 1 )
    {
        NextRange++;

        if ( NextRange > this.Lines[NextLine].Ranges.length - 1 )
        {
            NextLine++

            if ( NextLine > LinesCount - 1 )
                break;

            NextRange = 0;
        }

        if ( true === this.Is_EmptyRange( NextLine, NextRange ) )
            continue;
        else
            break;
    }

    if ( NextLine > LinesCount - 1 )
    {
        NextLine  = Line;
        NextRange = Range;
    }

    var CurLine  = PrevLine;
    var CurRange = PrevRange;

    var Result;
    while ( ( CurLine < NextLine ) || ( CurLine === NextLine && CurRange <= NextRange ) )
    {
        var TempResult = this.private_Recalculate_Fast_Range(CurLine, CurRange);
        if ( -1 === TempResult )
            return -1;

        if ( CurLine === Line && CurRange === Range )
            Result = TempResult;

        CurRange++;

        if ( CurRange > this.Lines[CurLine].Ranges.length - 1 )
        {
            CurLine++;
            CurRange = 0;
        }
    }

    // Во время пересчета сбрасываем привязку курсора к строке.
    this.CurPos.Line  = -1;
    this.CurPos.Range = -1;

    this.Internal_CheckSpelling();

    //console.log("Recalc Fast Range");

    return Result;
};

Paragraph.prototype.private_Recalculate_Fast_Range = function(_Line, _Range)
{
    var PRS = this.m_oPRSW;

    var XStart, YStart, XLimit, YLimit;

    // Определим номер страницы
    var CurLine  = _Line;
    var CurRange = _Range;
    var CurPage  = 0;

    var PagesLen = this.Pages.length;
    for ( var TempPage = 0; TempPage < PagesLen; TempPage++ )
    {
        var __Page = this.Pages[TempPage];
        if ( CurLine <= __Page.EndLine && CurLine >= __Page.FirstLine )
        {
            CurPage = TempPage;
            break;
        }
    }

    if ( -1 === CurPage )
        return -1;

    var ParaPr = this.Get_CompiledPr2( false).ParaPr;

    if ( 0 === CurPage )//|| ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument ) )
    {
        XStart = this.X;
        YStart = this.Y;
        XLimit = this.XLimit;
        YLimit = this.YLimit;
    }
    else
    {
        var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage, this.Index );

        XStart = PageStart.X;
        YStart = PageStart.Y;
        XLimit = PageStart.XLimit;
        YLimit = PageStart.YLimit;
    }

    PRS.XStart = XStart;
    PRS.YStart = YStart;
    PRS.XLimit = XLimit - ParaPr.Ind.Right;
    PRS.YLimit = YLimit;

    // Обнуляем параметры PRS для строки и отрезка
    PRS.Reset_Line();

    PRS.Page  = 0;
    PRS.Line  = _Line;
    PRS.Range = _Range;

    PRS.RangesCount = this.Lines[CurLine].Ranges.length - 1;

    PRS.Paragraph = this;

    var RangesCount = PRS.RangesCount;

    var Line  = this.Lines[CurLine];
    var Range = Line.Ranges[CurRange];

    var StartPos = Range.StartPos;
    var EndPos   = Range.EndPos;

    // Обновляем состояние пересчета
    PRS.Reset_Range(Range.X, Range.XEnd);

    var ContentLen = this.Content.length;

    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
    {
        var Item = this.Content[Pos];

        if ( para_Math === Item.Type )
        {
            // TODO: Надо бы перенести эту проверку на изменение контента параграфа
            Item.MathPara = this.Check_MathPara(Pos);
        }

        PRS.Update_CurPos( Pos, 0 );

        var SavedLines = Item.Save_RecalculateObject(true);

        Item.Recalculate_Range( PRS, ParaPr, 1 );

        if ( ( true === PRS.NewRange && Pos !== EndPos ) || ( Pos === EndPos && true !== PRS.NewRange ) )
            return -1;
        else if ( Pos === EndPos && true === PRS.NewRange && true === PRS.MoveToLBP )
        {
            Item.Recalculate_Set_RangeEndPos(PRS, PRS.LineBreakPos, 1);
        }

        // Нам нужно проверить только строку с номером CurLine
        if ( false === SavedLines.Compare( _Line, _Range, Item ) )
            return -1;

        Item.Load_RecalculateObject(SavedLines, this);
    }

    // Recalculate_Lines_Width
    var PRSC = this.m_oPRSC;

    var StartPos = Range.StartPos;
    var EndPos   = Range.EndPos;

    Range.Reset_Width();
    PRSC.Reset( this, Range );

    if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
        PRSC.Range.W += this.Numbering.WidthVisible;

    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
    {
        var Item = this.Content[Pos];
        Item.Recalculate_Range_Width( PRSC, CurLine, CurRange );
    }
    //------------------------------------------------

    var RecalcResultAlign = this.Recalculate_Lines_Align(PRS, CurPage, ParaPr, true);

    if ( recalcresult_NextElement !== RecalcResultAlign )
        return -1;

    return this.Get_StartPage_Absolute() + CurPage;
};