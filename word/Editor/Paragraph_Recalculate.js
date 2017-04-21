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

// TODO: В колонтитулах быстрые пересчеты отключены. Надо реализовать.

/**
 * Здесь мы пытаемся быстро пересчитать текущий параграф. Если быстрый пересчет срабатывает, тогда возвращаются
 * страницы, которые нужно перерисовать, в противном случае возвращается пустой массив.
 * @returns {*}
 */
Paragraph.prototype.Recalculate_FastWholeParagraph = function()
{
    if (this.Pages.length <= 0)
        return [];

    if (true === this.Parent.Is_HdrFtr(false))
        return [];

    //Не запускаемм быстрый пересчет, когда параграф находится в автофигуре с выставленным флагом подбора размера по размеру контента,
    // т. к. при расчете контента потребуется пересчет в новых размерах.
    if(true === this.Parent.Check_AutoFit())
    {
        return [];
    }

    // TODO: Отключаем это ускорение в таблицах, т.к. в таблицах и так есть свое ускорение. Но можно и это ускорение
    // подключить, для этого надо проверять изменились ли MinMax ширины и набираем ли мы в строке заголовков.
    if (undefined === this.Parent || true === this.Parent.Is_TableCellContent())
        return [];

    // Если изменения происходят в специальном пустом параграфе-конце секции, тогда запускаем обычный пересчет
    if (this.bFromDocument && this.LogicDocument && true === this.LogicDocument.Pages[this.Get_StartPage_Absolute()].Check_EndSectionPara(this))
        return [];

    // Если параграф - рамка с автошириной, надо пересчитывать по обычному
    if (1 === this.Lines.length && true !== this.Is_Inline())
        return [];

    // Здесь мы отдельно обрабатываем случаи быстрого пересчета параграфов, которые были разбиты на 1-2
    // страницы. Если параграф был разбит более чем на 2 страницы, то такое ускорение уже не имеет смысла.
    if (1 === this.Pages.length)
    {
        // Если параграф был разбит на 1 страницу изначально, тогда мы проверяем, чтобы он после пересчета
        // был также разбит на 1 страницу, кроме этого проверяем изменились ли границы параграфа, и проверяем
        // последнюю строку на pageBreak/columnBreak, а во время пересчета смотрим изменяeтся ли положение
        // flow-объектов, привязанных к данному параграфу, кроме того, если по какой-то причине пересчет возвращает
        // не recalcresult_NextElement, тогда тоже отменяем быстрый пересчет

		this.m_oPRSW.SetFast(true);

        var OldBounds            = this.Pages[0].Bounds;
        var isPageBreakLastLine1 = this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakPage;
        var isPageBreakLastLine2 = this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakRealPage;
        var FastRecalcResult     = this.Recalculate_Page(0, true);

		this.m_oPRSW.SetFast(false);

        if (FastRecalcResult & recalcresult_NextElement
            && 1 === this.Pages.length
            && true === this.Pages[0].Bounds.Compare(OldBounds)
            && this.Lines.length > 0
            && isPageBreakLastLine1 === (this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakPage)
            && isPageBreakLastLine2 === (this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakRealPage))
        {
            //console.log("Recalc Fast WholeParagraph 1 page");
            return [this.Get_AbsolutePage(0)];
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

        var isPageBreakLastLine1 = this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakPage;
        var isPageBreakLastLine2 = this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakRealPage;

        // Чтобы защититься от неправильной работы, связанной с переносом параграфа на новую страницу,
        // будем следить за тем, начинался ли изначально параграф с новой страницы, и начинается ли он с
        // новой страницы сейчас.
        var OldStartFromNewPage = this.Pages[0].StartLine < 0 ? true : false;

        // Чтобы защититься от неправильной работой с висячими строками, будем следить за количеством строк
        // если оно меньше либо равно 2 на какой-либо странице до/после пересчета.
        var OldLinesCount_0 = this.Pages[0].EndLine - this.Pages[0].StartLine + 1;
        var OldLinesCount_1 = this.Pages[1].EndLine - this.Pages[1].StartLine + 1;

		this.m_oPRSW.SetFast(true);
		var FastRecalcResult = this.Recalculate_Page(0, true);

		if (!(FastRecalcResult & recalcresult_NextPage))
		{
			this.m_oPRSW.SetFast(false);
			return [];
		}

        FastRecalcResult = this.Recalculate_Page(1);
		this.m_oPRSW.SetFast(false);
        if (!(FastRecalcResult & recalcresult_NextElement))
            return [];

        // Сравниваем количество страниц (хотя оно должно быть 2 к данному моменту) и границы каждой страницы
        if (2 !== this.Pages.length || true !== this.Pages[0].Bounds.Compare(OldBounds_0) || true !== this.Pages[1].Bounds.Compare(OldBounds_1))
            return [];

        // Сравниваем наличие pageBreak/columnBreak в последней строке
        if (this.Lines.length <= 0
            || isPageBreakLastLine1 !== (this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakPage)
            || isPageBreakLastLine2 !== (this.Lines[this.Lines.length - 1].Info & paralineinfo_BreakRealPage))
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
        {
            return [this.Get_AbsolutePage(1)];
        }
        else
        {
            var PageAbs0 = this.Get_AbsolutePage(0);
            var PageAbs1 = this.Get_AbsolutePage(1);
            if (PageAbs0 !== PageAbs1)
                return [PageAbs0, PageAbs1];
            else
                return [PageAbs0];
        }
    }

    return [];
};
/**
 * Пытаемся быстро рассчитать отрезок, в котором произошли изменения, и если ничего не съехало, тогда
 * перерисовываем страницу, в противном случаем запускаем обычный пересчет.
 * @param SimpleChanges
 * @returns {*} -1 если быстрый пересчет не получился, либо номер страницы, которую нужно перерисовать
 */
Paragraph.prototype.Recalculate_FastRange = function(SimpleChanges)
{
    if (this.Pages.length <= 0)
        return -1;

    if (true === this.Parent.Is_HdrFtr(false))
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

    //Не запускаемм быстрый пересчет, когда параграф находится в автофигуре с выставленным флагом подбора размера по размеру контента,
    // т. к. при расчете контента потребуется пересчет в новых размерах.
    if(true === this.Parent.Check_AutoFit())
    {
        return -1;
    }

    // Если мы находимся в строке, которая была полностью перенесена из-за обтекания,  и мы добавляем пробел, или
    // удаляем символ, тогда нам запускать обычный пересчет, т.к. первое слово может начать убираться в промежутках
    // обтекания, которых у нас нет в отрезках строки
    if ( true === this.Lines[Line].RangeY )
    {
        // TODO: Сделать проверку на добавление пробела и удаление
        return -1;
    }

    // Если у нас есть PageBreak в строке, запускаем обычный пересчет, либо если это пустой параграф.
    if (this.Lines[Line].Info & paralineinfo_BreakPage || (this.Lines[Line].Info & paralineinfo_Empty &&  this.Lines[Line].Info & paralineinfo_End))
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

	this.m_oPRSW.SetFast(true);

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
        var TempResult = this.private_RecalculateFastRange(CurRange, CurLine);
        if ( -1 === TempResult )
		{
			this.m_oPRSW.SetFast(false);
			return -1;
		}

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

	this.m_oPRSW.SetFast(false);
    return this.Get_AbsolutePage(Result);
};

/**
 * Функция для пересчета страницы параграфа.
 * @param {number} CurPage - Номер страницы, которую нужно пересчитать (относительный номер страницы для параграфа).
 * Предыдущая страница ДОЛЖНА быть пересчитана, если задано не нулевое значение.
 * @returns {*} Возвращается результат пересчета
 */
Paragraph.prototype.Recalculate_Page = function(CurPage)
{
    this.Clear_NearestPosArray();

    // Во время пересчета сбрасываем привязку курсора к строке.
    this.CurPos.Line  = -1;
    this.CurPos.Range = -1;

    this.FontMap.NeedRecalc = true;

    this.Internal_CheckSpelling();

    var RecalcResult = this.private_RecalculatePage( CurPage );

    this.private_CheckColumnBreak(CurPage);

    this.Parent.RecalcInfo.Reset_WidowControl();

    return RecalcResult;
};

/**
 * Функция для пересчета страницы параграфа, так чтобы на данной странице ничего не было. Применяется, когда из-за
 * пересчета плавающей автофигуры нужно сразу перейти на следующую страницу, пропустив несколько колонок.
 * @param {number} PageIndex - Номер страницы, пересчет которой мы пропускаем. (предыдущая страница ДОЛЖНА быть
 * пересчитана, если это не нулевое значение)
 */
Paragraph.prototype.Recalculate_SkipPage = function(PageIndex)
{
    if (0 === PageIndex)
    {
        this.Start_FromNewPage();
    }
    else
    {
        var PrevPage = this.Pages[PageIndex - 1];

        var EndLine       = Math.max(PrevPage.StartLine, PrevPage.EndLine); // На случай, если предыдущая страница тоже пустая
        var NewPage       = new CParaPage(PrevPage.X, PrevPage.Y, PrevPage.XLimit, PrevPage.YLimit, EndLine);
        NewPage.StartLine = EndLine;
        NewPage.EndLine   = EndLine - 1;
        NewPage.TextPr    = PrevPage.TextPr;

        this.Pages[PageIndex] = NewPage;
    }
};

/**
 * Функция для сохранения объекта пересчета.
 * @returns {*} Возвращается объект (CParagraphRecalculateObject) с информацией о текущем пересчете параграфа
 */
Paragraph.prototype.Save_RecalculateObject = function()
{
    var RecalcObj = new CParagraphRecalculateObject();
    RecalcObj.Save(this);
    return RecalcObj;
};

/**
 * Загрузка сохраненного раннее пересчета.
 * @param RecalcObj (CParagraphRecalculateObject)
 */
Paragraph.prototype.Load_RecalculateObject = function(RecalcObj)
{
    RecalcObj.Load(this);
};

/**
 * Очистка рассчетных классов параграфа.
 */
Paragraph.prototype.Prepare_RecalculateObject = function()
{
    this.Pages = [];
    this.Lines = [];

    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Prepare_RecalculateObject();
    }
};

/**
 * Пересчитываем первую страницу параграфа так, чтобы он начинался с новой страницы.
 */
Paragraph.prototype.Start_FromNewPage = function()
{
    this.Pages.length = 1;
    this.Pages[0] = new CParaPage(this.X, this.Y, this.XLimit, this.YLimit, 0);

    // Добавляем разрыв страницы
    this.Pages[0].Set_EndLine(-1);
    this.Lines[-1] = new CParaLine();
};

Paragraph.prototype.private_RecalculateFastRange       = function(CurRange, CurLine)
{
    var PRS = this.m_oPRSW;

    var XStart, YStart, XLimit, YLimit;

    // Определим номер страницы
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

    var ParaPr = this.Get_CompiledPr2(false).ParaPr;

    if ( 0 === CurPage )//|| ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument ) )
    {
        XStart = this.X;
        YStart = this.Y;
        XLimit = this.XLimit;
        YLimit = this.YLimit;
    }
    else
    {
        var PageStart = this.Parent.Get_PageContentStartPos2(this.PageNum, this.ColumnNum, CurPage, this.Index);

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

    PRS.Page  = CurPage;
    PRS.Line  = CurLine;
    PRS.Range = CurRange;

    PRS.Ranges      = this.Lines[CurLine].Ranges;
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
            Item.Set_Inline(true === this.Check_MathPara(Pos)? false : true);
            PRS.bFastRecalculate = true; // чтобы не обновить случайно StartLine (Recalculate_Reset)
        }

        PRS.Update_CurPos( Pos, 0 );

        var SavedLines = Item.Save_RecalculateObject(true);

        Item.Recalculate_Range( PRS, ParaPr, 1 );

        if ( ( true === PRS.NewRange && Pos !== EndPos ) || ( Pos === EndPos && true !== PRS.NewRange ) )
            return -1;
        else if ( Pos === EndPos && true === PRS.NewRange && true === PRS.MoveToLBP )
        {
            var BreakPos = PRS.LineBreakPos.Get(0);
            if (BreakPos !== Pos)
                return -1;
            else
                Item.Recalculate_Set_RangeEndPos(PRS, PRS.LineBreakPos, 1);
        }

        // Нам нужно проверить только строку с номером CurLine
        if (false === SavedLines.Compare(CurLine, CurRange, Item))
            return -1;

        Item.Load_RecalculateObject(SavedLines, this);
    }

    // TODO: Здесь пересчеты идут целиком для строки, а не для конкретного отрезка.
    if (!(this.private_RecalculateLineAlign(CurLine, CurPage, PRS, ParaPr, true) & recalcresult_NextElement))
        return -1;

    return CurPage;
};

Paragraph.prototype.private_RecalculatePage            = function(CurPage, bFirstRecalculate)
{
    var PRS = this.m_oPRSW;
	PRS.Reset_Page(this, CurPage);

    var Pr     = this.Get_CompiledPr();
    var ParaPr = Pr.ParaPr;

    var CurLine = (CurPage > 0 ? this.Pages[CurPage - 1].EndLine + 1 : 0);
    //-------------------------------------------------------------------------------------------------------------
    // Обрабатываем настройку "не отрывать от следующего"
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculatePageKeepNext(CurLine, CurPage, PRS, ParaPr))
        return PRS.RecalcResult;

    //-------------------------------------------------------------------------------------------------------------
    // Получаем начальные координаты параграфа
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculatePageXY(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // Делаем проверки, не нужно ли сразу перенести параграф на новую страницу
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculatePageBreak(CurLine, CurPage, PRS,ParaPr))
        return PRS.RecalcResult;

    // Изначально обнуляем промежутки обтекания и наличие переноса строки
    PRS.Reset_Ranges();

    if (false !== bFirstRecalculate)
    {
        PRS.Reset_RestartPageRecalcInfo();
        PRS.Reset_MathRecalcInfo();
		PRS.SaveFootnotesInfo();
    }
	else
	{
		PRS.LoadFootnotesInfo();
	}

    var RecalcResult;
    while (true)
    {
        PRS.Line = CurLine;
        PRS.RecalcResult = recalcresult_NextLine;

        this.private_RecalculateLine(CurLine, CurPage, PRS, ParaPr);

        RecalcResult = PRS.RecalcResult;

        if (RecalcResult & recalcresult_NextLine)
        {
            // В эту ветку мы попадаем, если строка пересчиталась в нормальном режиме и можно переходить к следующей.
            CurLine++;
            PRS.Reset_Ranges();
            PRS.Reset_RunRecalcInfo();
            PRS.Reset_MathRecalcInfo();
        }
        else if (RecalcResult & recalcresult_PrevLine)
        {
            if (PRS.Line < this.Pages[CurPage].StartLine)
                PRS.Restore_RunRecalcInfo();
            else
            {
                RecalcResult = this.private_RecalculatePage(CurPage, false);
                break;
            }
        }
        else if (RecalcResult & recalcresult_CurLine)
        {
            // В эту ветку мы попадаем, если нам необходимо заново пересчитать данную строку. Такое случается
            // когда у нас появляются плавающие объекты, относительно которых необходимо произвести обтекание.
            // В данном случае мы ничего не делаем, т.к. номер строки не меняется, а новые отрезки обтекания
            // были заполнены при последнем неудачном рассчете.

            PRS.Restore_RunRecalcInfo();
        }
        else if (RecalcResult & recalcresult_NextElement || RecalcResult & recalcresult_NextPage)
        {
            // В эту ветку мы попадаем, если мы достигли конца страницы или конца параграфа. Просто выходим
            // из цикла.
            break;
        }
        else if (RecalcResult & recalcresult_CurPagePara)
        {
            // В эту ветку мы попадаем, если в параграфе встретилась картинка, которая находится ниже данного
            // параграфа, и можно пересчитать заново данный параграф.
            RecalcResult = this.private_RecalculatePage(CurPage, false);
            break;
        }
        else //if (RecalcResult & recalcresult_CurPage || RecalcResult & recalcresult_PrevPage)
        {
            // В эту ветку мы попадаем, если в нашем параграфе встретилось, что-то из-за чего надо пересчитывать
            // эту страницу или предыдущую страницу. Поэтому далее можно ничего не делать, а сообщать верхнему
            // классу об этом.
            return RecalcResult;
        }
    }

    //-------------------------------------------------------------------------------------------------------------
    // Получаем некоторую информацию для следующей страницы (например незакрытые комментарии)
    //-------------------------------------------------------------------------------------------------------------
    this.Recalculate_PageEndInfo(PRS, CurPage);

    return RecalcResult;
};

Paragraph.prototype.private_RecalculatePageKeepNext    = function(CurLine, CurPage, PRS, ParaPr)
{
    // Такая настройка срабатывает в единственном случае:
    // У предыдущего параграфа выставлена данная настройка, а текущий параграф сразу начинается с новой страницы
    // ( при этом у него не выставлен флаг "начать с новой страницы", иначе будет зацикливание здесь ).
    if (1 === CurPage && true === this.Check_EmptyPages(0) && this.Parent instanceof CDocument && false === ParaPr.PageBreakBefore)
    {
        // Если у предыдущего параграфа стоит настройка "не отрывать от следующего".
        // И сам параграф не разбит на несколько страниц и не начинается с новой страницы,
        // тогда мы должны пересчитать предыдущую страницу, с учетом того, что предыдущий параграф
        // надо начать с новой страницы.
        var Curr = this.Get_DocumentPrev();
        while (null != Curr && type_Paragraph === Curr.GetType() && undefined === Curr.Get_SectionPr())
        {
            var CurrKeepNext = Curr.Get_CompiledPr2(false).ParaPr.KeepNext;
            if ((true === CurrKeepNext && Curr.Pages.length > 1) || false === CurrKeepNext || true !== Curr.Is_Inline() || true === Curr.Check_PageBreak())
            {
                break;
            }
            else
            {
                var Prev = Curr.Get_DocumentPrev();
                if (null === Prev || (type_Paragraph === Prev.GetType() && undefined !== Prev.Get_SectionPr()))
                    break;

                if (type_Paragraph != Prev.GetType() || false === Prev.Get_CompiledPr2(false).ParaPr.KeepNext)
                {
                    if (true === this.Parent.RecalcInfo.Can_RecalcObject())
                    {
                        this.Parent.RecalcInfo.Set_KeepNext(Curr, this);
                        PRS.RecalcResult = recalcresult_PrevPage | recalcresultflags_Column;
                        return false;
                    }
                    else
                        break;
                }
                else
                {
                    Curr = Prev;
                }
            }
        }
    }

    if (true === this.Parent.RecalcInfo.Check_KeepNextEnd(this))
    {
        // Дошли до сюда, значит уже пересчитали данную ситуацию.
        // Делаем Reset здесь, потому что Reset надо делать в том же месте, гды мы запросили пересчет заново.
        this.Parent.RecalcInfo.Reset();
    }

    return true;
};

Paragraph.prototype.private_RecalculatePageXY          = function(CurLine, CurPage, PRS, ParaPr)
{
    // Если это первая страница параграфа (CurPage = 0), тогда мы должны использовать координаты, которые нам
    // были заданы сверху, а если не первая, тогда координаты мы должны запросить у родительского класса.
    // TODO: Тут отдельно обрабатывается случай, когда рамка переносится на новую страницу, т.е. страница начинается
    //       сразу с рамки. Надо бы не разбивать в данной ситуации рамку на страницы, а просто новую страницу начать
    //       с нее на уровне DocumentContent.

    var XStart, YStart, XLimit, YLimit;
    if ( 0 === CurPage || ( undefined != this.Get_FramePr() && this.LogicDocument === this.Parent ) )
    {
        XStart = this.X;
        YStart = this.Y;
        XLimit = this.XLimit;
        YLimit = this.YLimit;
    }
    else
    {
        var PageStart = this.Parent.Get_PageContentStartPos2(this.PageNum, this.ColumnNum, CurPage, this.Index);

        XStart = PageStart.X;
        YStart = PageStart.Y;
        XLimit = PageStart.XLimit;
        YLimit = PageStart.YLimit;
    }

    PRS.XStart = XStart;
    PRS.YStart = YStart;
    PRS.XLimit = XLimit - ParaPr.Ind.Right;
    PRS.YLimit = YLimit;
    PRS.Y      = YStart;

    this.Pages.length   = CurPage + 1;
    this.Pages[CurPage] = new CParaPage(XStart, YStart, XLimit, YLimit, CurLine);
};

Paragraph.prototype.private_RecalculatePageBreak       = function(CurLine, CurPage, PRS, ParaPr)
{
    // Для пустых параграфов с разрывом секции не делаем переноса страницы
    if (undefined !== this.Get_SectionPr() && true === this.IsEmpty())
        return true;

    if (this.Parent instanceof CDocument)
    {
        // Начинаем параграф с новой страницы
        var PageRelative = this.private_GetRelativePageIndex(CurPage) - this.Get_StartPage_Relative();
        if (0 === PageRelative && true === ParaPr.PageBreakBefore)
        {
            // Если это первый элемент документа или секции, тогда не надо начинать его с новой страницы.
            // Кроме случая, когда у нас разрыв секции на текущей странице. Также не добавляем разрыв страницы для
            // особого пустого параграфа с разрывом секции.

            var bNeedPageBreak = true;

            var Prev = this.Get_DocumentPrev();
            if ((true === this.IsEmpty() && undefined !== this.Get_SectionPr()) || null === Prev)
            {
                bNeedPageBreak = false;
            }
            else if (this.Parent === this.LogicDocument && type_Paragraph === Prev.GetType() && undefined !== Prev.Get_SectionPr())
            {
                var PrevSectPr = Prev.Get_SectionPr();
                var CurSectPr = this.LogicDocument.SectionsInfo.Get_SectPr(this.Index).SectPr;
                if (c_oAscSectionBreakType.Continuous !== CurSectPr.Get_Type() || true !== CurSectPr.Compare_PageSize(PrevSectPr))
                    bNeedPageBreak = false;
            }

            if (true === bNeedPageBreak)
            {
                // Добавляем разрыв страницы
                this.Pages[CurPage].Set_EndLine(CurLine - 1);

                if (0 === CurLine)
                    this.Lines[-1] = new CParaLine();

                PRS.RecalcResult = recalcresult_NextPage | recalcresultflags_Column;
                return false;
            }
        }
        else if ( true === this.Parent.RecalcInfo.Check_KeepNext(this) && 0 === CurPage && null != this.Get_DocumentPrev() )
        {
            this.Pages[CurPage].Set_EndLine( CurLine - 1 );
            if ( 0 === CurLine )
                this.Lines[-1] = new CParaLine( 0 );

            PRS.RecalcResult = recalcresult_NextPage;
            return false;
        }
        else if (true === this.Is_Inline()) // Случай Flow разбирается в Document.js
        {
            // Проверяем PageBreak и ColumnBreak в предыдущей строке
            var isPageBreakOnPrevLine   = false;
            var isColumnBreakOnPrevLine = false;

            var PrevElement = this.Get_DocumentPrev();

            if (null !== PrevElement && type_Paragraph === PrevElement.Get_Type() && true === PrevElement.Is_Empty() && undefined !== PrevElement.Get_SectionPr())
                PrevElement = PrevElement.Get_DocumentPrev();

            if (0 !== CurPage && true !== this.Check_EmptyPages(CurPage - 1))
            {
                var EndLine = this.Pages[CurPage - 1].EndLine;
                if (-1 !== EndLine && this.Lines[EndLine].Info & paralineinfo_BreakRealPage)
                    isPageBreakOnPrevLine = true;
            }
            else if (null !== PrevElement && type_Paragraph === PrevElement.Get_Type())
            {
                var bNeedPageBreak = true;
                if (type_Paragraph === PrevElement.GetType() && undefined !== PrevElement.Get_SectionPr())
                {
                    var PrevSectPr = PrevElement.Get_SectionPr();
                    var CurSectPr  = this.LogicDocument.SectionsInfo.Get_SectPr(this.Index).SectPr;
                    if (c_oAscSectionBreakType.Continuous !== CurSectPr.Get_Type() || true !== CurSectPr.Compare_PageSize(PrevSectPr))
                        bNeedPageBreak = false;
                }

                if (true === bNeedPageBreak)
                {
                    var EndLine = PrevElement.Pages[PrevElement.Pages.length - 1].EndLine;
                    if (-1 !== EndLine && PrevElement.Lines[EndLine].Info & paralineinfo_BreakRealPage)
                        isPageBreakOnPrevLine = true;
                }
            }

            // ColumnBreak для случая CurPage > 0 не разбираем здесь, т.к. он срабатывает автоматически
            if (0 === CurPage && null !== PrevElement && type_Paragraph === PrevElement.Get_Type())
            {
                var EndLine = PrevElement.Pages[PrevElement.Pages.length - 1].EndLine;
                if (-1 !== EndLine && !(PrevElement.Lines[EndLine].Info & paralineinfo_BreakRealPage) && PrevElement.Lines[EndLine].Info & paralineinfo_BreakPage)
                    isColumnBreakOnPrevLine = true;
            }

            if ((true === isPageBreakOnPrevLine && (0 !== this.private_GetColumnIndex(CurPage) || (0 === CurPage && null !== PrevElement)))
                || (true === isColumnBreakOnPrevLine && 0 === CurPage))
            {
                this.Pages[CurPage].Set_EndLine(CurLine - 1);

                if (0 === CurLine)
                    this.Lines[-1] = new CParaLine();

                PRS.RecalcResult = recalcresult_NextPage | recalcresultflags_Column;
                return false;
            }
        }
    }

    //// Эта проверка на случай, если предыдущий параграф закончился PageBreak
    //if (PRS.YStart > PRS.YLimit - 0.001 && (CurLine != this.Pages[CurPage].FirstLine || (0 === CurPage && (null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent()))) && true === this.Use_YLimit())
    //{
    //    this.Pages[CurPage].Set_EndLine(CurLine - 1);
    //    if ( 0 === CurLine )
    //        this.Lines[-1] = new CParaLine( 0 );
    //
    //    PRS.RecalcResult = recalcresult_NextPage;
    //    return false;
    //}

    return true;
};

Paragraph.prototype.private_RecalculateLine            = function(CurLine, CurPage, PRS, ParaPr)
{
    // При пересчете любой строки обновляем эти поля
    this.ParaEnd.Line  = -1;
    this.ParaEnd.Range = -1;

    //-------------------------------------------------------------------------------------------------------------
    // 1. Добавляем новую строку в параграф
    //-------------------------------------------------------------------------------------------------------------
    this.Lines.length   = CurLine + 1;
    this.Lines[CurLine] = new CParaLine();

    //-------------------------------------------------------------------------------------------------------------
    // 2. Проверяем, является ли данная строка висячей
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineWidow(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 3. Заполняем строку отрезками обтекания
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculateLineFillRanges(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // 4. Пересчитываем отрезки данной строки
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineRanges(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 5. Заполняем информацию о строке
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculateLineInfo(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // 6. Пересчитываем метрики данной строки
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculateLineMetrics(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // 7. Рассчитываем высоту строки, а также положение верхней и нижней границ
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculateLinePosition(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // 8. Проверяем достигла ли данная строка конца страницы
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineBottomBound(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 9. Проверяем обтекание данной строки относительно плавающих объектов
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineCheckRanges(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 10. Выставляем вертикальное смещение данной строки
    //-------------------------------------------------------------------------------------------------------------
    this.private_RecalculateLineBaseLine(CurLine, CurPage, PRS, ParaPr);

    //-------------------------------------------------------------------------------------------------------------
    // 11. Проверяем не съехала ли вся строка из-за обтекания
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineCheckRangeY(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 12. Пересчитываем сдвиги элементов внутри параграфа и видимые ширины пробелов, в зависимости от align.
    //-------------------------------------------------------------------------------------------------------------
    if (!(this.private_RecalculateLineAlign(CurLine, CurPage, PRS, ParaPr, false) & recalcresult_NextElement))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 13. Последние проверки
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineEnd(CurLine, CurPage, PRS, ParaPr))
        return;

    //-------------------------------------------------------------------------------------------------------------
    // 14. Проверяем Последние проверки
    //-------------------------------------------------------------------------------------------------------------
    if (false === this.private_RecalculateLineCheckFootnotes(CurLine, CurPage, PRS, ParaPr))
        return;
};

Paragraph.prototype.private_RecalculateLineWidow       = function(CurLine, CurPage, PRS, ParaPr)
{
    // Висячие строки обрабатываются только внутри основного документа
    if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Check_WidowControl(this, CurLine) )
    {
        this.Parent.RecalcInfo.Need_ResetWidowControl();

        this.Pages[CurPage].Set_EndLine(CurLine - 1);
        if (0 === CurLine)
        {
            this.Lines[-1] = new CParaLine(0);
        }

        PRS.RecalcResult = recalcresult_NextPage | recalcresultflags_Column;
        return false;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineFillRanges  = function(CurLine, CurPage, PRS, ParaPr)
{
    this.Lines[CurLine].Info = 0;

    // Параметры Ranges и RangesCount не обнуляются здесь, они задаются выше
    var Ranges      = PRS.Ranges;
    var RangesCount = PRS.RangesCount;

    // Обнуляем параметры PRS для строки
    PRS.Reset_Line();

    // Проверим, нужно ли в данной строке учитывать FirstLine (т.к. не всегда это первая строка должна быть)
    var UseFirstLine = true;
    for ( var TempCurLine = CurLine - 1; TempCurLine >= 0; TempCurLine-- )
    {
        var TempInfo = this.Lines[TempCurLine].Info;
        if (!(TempInfo & paralineinfo_BreakPage) || !(TempInfo & paralineinfo_Empty))
        {
            UseFirstLine = false;
            break;
        }
    }

    // Проверим неинлайн формулу в первой строке
    if (0 === CurLine && true === UseFirstLine)
    {
        var CurPos = 0;
        var Count = this.Content.length;
        while (CurPos < Count)
        {
            if (true === this.Check_MathPara(CurPos))
            {
                UseFirstLine = false;
                break;
            }
            else if (true !== this.Content[CurPos].Is_Empty())
            {
                break;
            }

            CurPos++;
        }
    }

    PRS.UseFirstLine = UseFirstLine;

    // Заполняем строку отрезками обтекания. Выставляем начальные сдвиги для отрезков. Начало промежутка = конец вырезаемого промежутка
    this.Lines[CurLine].Reset();
    this.Lines[CurLine].Add_Range( ( true === UseFirstLine ? PRS.XStart + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : PRS.XStart + ParaPr.Ind.Left ), (RangesCount == 0 ? PRS.XLimit : Ranges[0].X0) );
    for ( var Index = 1; Index < Ranges.length + 1; Index++ )
    {
        this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? PRS.XLimit : Ranges[Index].X0) );
    }

    if (true === PRS.RangeY)
    {
        PRS.RangeY = false;
        this.Lines[CurLine].Info |= paralineinfo_RangeY;
    }
};

Paragraph.prototype.private_RecalculateLineRanges      = function(CurLine, CurPage, PRS, ParaPr)
{
    var RangesCount = PRS.RangesCount;
    var CurRange = 0;
    while ( CurRange <= RangesCount )
    {
        PRS.Range = CurRange;
        this.private_RecalculateRange(CurRange, CurLine, CurPage, RangesCount, PRS, ParaPr);

        if ( true === PRS.ForceNewPage || true === PRS.NewPage || true === PRS.ForceNewLine )
        {
            // Поскольку мы выходим досрочно из цикла, нам надо удалить лишние отрезки обтекания
            this.Lines[CurLine].Ranges.length = CurRange + 1;
            break;
        }

        if ( -1 === this.ParaEnd.Line && true === PRS.End )
        {
            this.ParaEnd.Line  = CurLine;
            this.ParaEnd.Range = CurRange;
        }

        // Такое может случиться, если мы насильно переносим автофигуру на следующую страницу
        if (PRS.RecalcResult & recalcresult_NextPage || PRS.RecalcResult & recalcresult_PrevLine || PRS.RecalcResult & recalcresult_CurLine || PRS.RecalcResult & recalcresult_CurPagePara)
            return false;

        CurRange++;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineInfo        = function(CurLine, CurPage, PRS, ParaPr)
{
    if (true === PRS.BreakPageLine)
        this.Lines[CurLine].Info |= paralineinfo_BreakPage;

    if (true === PRS.BreakRealPageLine)
        this.Lines[CurLine].Info |= paralineinfo_BreakRealPage;

    if (true === PRS.EmptyLine)
        this.Lines[CurLine].Info |= paralineinfo_Empty;

    if (true === PRS.End)
        this.Lines[CurLine].Info |= paralineinfo_End;

    if (true === PRS.BadLeftTab)
        this.Lines[CurLine].Info |= paralineinfo_BadLeftTab;

    if (PRS.GetFootnoteReferencesCount(null, true) > 0)
    	this.Lines[CurLine].Info |= paralineinfo_Notes;
};

Paragraph.prototype.private_RecalculateLineMetrics     = function(CurLine, CurPage, PRS, ParaPr)
{
    var Line = this.Lines[CurLine];
    var RangesCount = Line.Ranges.length;

    for (var CurRange = 0; CurRange < RangesCount; CurRange++)
    {
        var Range = Line.Ranges[CurRange];

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        for (var Pos = StartPos; Pos <= EndPos; Pos++)
        {
            this.Content[Pos].Recalculate_LineMetrics(PRS, ParaPr, CurLine, CurRange);
        }
    }

    // Строка пустая, у нее надо выставить ненулевую высоту. Делаем как Word, выставляем высоту по размеру
    // текста, на котором закончилась данная строка.
    if ( true === PRS.EmptyLine || PRS.LineAscent < 0.001 )
    {
        var LastItem = (true === PRS.End ? this.Content[this.Content.length - 1] : this.Content[this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].EndPos]);

        if ( true === PRS.End )
        {
            // TODO: Как только переделаем para_End переделать тут

            // Выставляем настройки для символа параграфа
            var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
            EndTextPr.Merge(this.TextPr.Value);

            g_oTextMeasurer.SetTextPr( EndTextPr, this.Get_Theme());
            g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

            // Запрашиваем текущие метрики шрифта, под TextAscent мы будем понимать ascent + linegap(которые записаны в шрифте)
            var EndTextHeight  = g_oTextMeasurer.GetHeight();
            var EndTextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
            var EndTextAscent  = EndTextHeight - EndTextDescent;
            var EndTextAscent2 = g_oTextMeasurer.GetAscender();

            PRS.LineTextAscent  = EndTextAscent;
            PRS.LineTextAscent2 = EndTextAscent2;
            PRS.LineTextDescent = EndTextDescent;

            if ( PRS.LineAscent < EndTextAscent )
                PRS.LineAscent = EndTextAscent;

            if ( PRS.LineDescent < EndTextDescent )
                PRS.LineDescent = EndTextDescent;
        }
        else if ( undefined !== LastItem )
        {
            var LastRun = LastItem.Get_LastRunInRange(PRS.Line, PRS.Range);
            if ( undefined !== LastRun && null !== LastRun )
            {
                if ( PRS.LineTextAscent < LastRun.TextAscent )
                    PRS.LineTextAscent = LastRun.TextAscent;

                if ( PRS.LineTextAscent2 < LastRun.TextAscent2 )
                    PRS.LineTextAscent2 = LastRun.TextAscent2;

                if ( PRS.LineTextDescent < LastRun.TextDescent )
                    PRS.LineTextDescent = LastRun.TextDescent;

                if ( PRS.LineAscent < LastRun.TextAscent )
                    PRS.LineAscent = LastRun.TextAscent;

                if ( PRS.LineDescent < LastRun.TextDescent )
                    PRS.LineDescent = LastRun.TextDescent;
            }
        }
    }

    // Рассчитаем метрики строки
    this.Lines[CurLine].Metrics.Update( PRS.LineTextAscent, PRS.LineTextAscent2, PRS.LineTextDescent, PRS.LineAscent, PRS.LineDescent, ParaPr );
};

Paragraph.prototype.private_RecalculateLinePosition    = function(CurLine, CurPage, PRS, ParaPr)
{
    var BaseLineOffset = 0;
    if (CurLine === this.Pages[CurPage].FirstLine)
    {
        BaseLineOffset = this.Lines[CurLine].Metrics.Ascent;

        if (0 === CurLine)
        {
			// Добавляем расстояние до параграфа (Pr.Spacing.Before)
			if (this.private_CheckNeedBeforeSpacing(CurPage, PRS))
				BaseLineOffset += ParaPr.Spacing.Before;

            // Добавляем толщину границы параграфа (если граница задана)
            if ((true === ParaPr.Brd.First || 1 === CurPage) && border_Single === ParaPr.Brd.Top.Value)
                BaseLineOffset += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            else if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value)
                BaseLineOffset += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
        }

        PRS.BaseLineOffset = BaseLineOffset;
    }
    else
	{
		if (this.Lines[CurLine].Info & paralineinfo_RangeY)
			PRS.BaseLineOffset = this.Lines[CurLine].Metrics.Ascent;
		else
			BaseLineOffset = PRS.BaseLineOffset;
	}

    var Top, Bottom;
    var Top2, Bottom2; // верх и низ без Pr.Spacing

    var PrevBottom = this.Pages[CurPage].Bounds.Bottom;

    if (this.Lines[CurLine].Info & paralineinfo_RangeY)
    {
        Top  = PRS.Y;
        Top2 = PRS.Y;

        if ( 0 === CurLine )
        {
			if (this.private_CheckNeedBeforeSpacing(CurPage, PRS))
            {
                Top2    = Top + ParaPr.Spacing.Before;
                Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                if ( true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value )
                {
                    Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
                else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                {
                    Top2    += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                    Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                }
            }
            else
            {
                // Параграф начинается с новой страницы
                Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                if ( border_Single === ParaPr.Brd.Top.Value )
                {
                    Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
            }
        }
        else
        {
            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
        }
    }
    else
    {
        if ( 0 !== CurLine )
        {
            if ( CurLine !== this.Pages[CurPage].FirstLine )
            {
                Top     = PRS.Y + BaseLineOffset + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                Top2    = Top;
                Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
            }
            else
            {
                Top     = this.Pages[CurPage].Y;
                Top2    = Top;
                Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
            }
        }
        else
        {
            Top  = PRS.Y;
            Top2 = PRS.Y;

			if (this.private_CheckNeedBeforeSpacing(CurPage, PRS))
            {
                Top2    = Top + ParaPr.Spacing.Before;
                Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                if ( true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value )
                {
                    Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
                else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                {
                    Top2    += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                    Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                }
            }
            else
            {
                // Параграф начинается с новой страницы
                Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                if ( border_Single === ParaPr.Brd.Top.Value )
                {
                    Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
            }
        }
    }

    Bottom  = Bottom2;
    Bottom += this.Lines[CurLine].Metrics.LineGap;

    // Если данная строка последняя, тогда подкорректируем нижнюю границу
    if ( true === PRS.End )
    {
        Bottom += ParaPr.Spacing.After;

        // Если нижняя граница Between, тогда она учитывается в следующем параграфе
        if ( true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value )
        {
            Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
        }
        else if ( border_Single === ParaPr.Brd.Between.Value )
        {
            Bottom += ParaPr.Brd.Between.Space;
        }

		// TODO: Здесь нужно сделать корректировку YLimit с учетом сносок. Надо разобраться почему вообще здесь
		// используется this.YLimit вместо Page.YLimit

        if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
            Bottom = this.YLimit;
    }

    // Верхнюю границу мы сохраняем только для первой строки данной страницы
    if (CurLine === this.Pages[CurPage].FirstLine && !(this.Lines[CurLine].Info & paralineinfo_RangeY))
        this.Pages[CurPage].Bounds.Top = Top;

    this.Pages[CurPage].Bounds.Bottom = Bottom;

    this.Lines[CurLine].Top    = Top    - this.Pages[CurPage].Y;
    this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

    PRS.LineTop        = Top;
    PRS.LineBottom     = Bottom;
    PRS.LineTop2       = Top2;
    PRS.LineBottom2    = Bottom2;
    PRS.LinePrevBottom = PrevBottom
};

Paragraph.prototype.private_RecalculateLineBottomBound = function(CurLine, CurPage, PRS, ParaPr)
{
    var Top     = PRS.LineTop;
    var Bottom2 = PRS.LineBottom2;

    // В ячейке перенос страницы происходит по нижней границе, т.е. с учетом Spacing.After и границы
    if ( true === this.Parent.Is_TableCellContent() )
        Bottom2 = PRS.LineBottom;

    // Переносим строку по PageBreak. Если в строке ничего нет кроме PageBreak, и это не конец параграфа, тогда нам не надо проверять высоту строки и обтекание.
    var LineInfo = this.Lines[CurLine].Info;
    var BreakPageLineEmpty = (LineInfo & paralineinfo_BreakPage && LineInfo & paralineinfo_Empty && !(LineInfo & paralineinfo_End) ? true : false);
    PRS.BreakPageLineEmpty = BreakPageLineEmpty;

    var RealCurPage = this.private_GetRelativePageIndex(CurPage) - this.Get_StartPage_Relative();

    var YLimit = PRS.YLimit;
    var oTopDocument = PRS.TopDocument;
	var bNoFootnotes = true;
	if (oTopDocument instanceof CDocument)
	{
		// bNoFootnotes - означает есть или нет сноска на данной колонке
		var nHeight =  oTopDocument.Footnotes.GetHeight(PRS.PageAbs, PRS.ColumnAbs);
		if (nHeight > 0.001)
		{
			bNoFootnotes = false;

			// В таблицах граница разруливается по своему
			if (true !== PRS.IsInTable())
				YLimit -= nHeight;
		}
	}
    else if (oTopDocument instanceof CFootEndnote)
    {
		// bNoFootnotes - означает, первая или нет данная сноска в колонке. Если она не первая,
		// тогда если у нее не убирается первая строка первого параграфа, все равно надо делать перенос
        var oLogicDocument = this.LogicDocument;
        if (true !== oLogicDocument.Footnotes.IsEmptyPageColumn(PRS.PageAbs, PRS.ColumnAbs))
			bNoFootnotes = false;
    }

    // Сначала проверяем не нужно ли сделать перенос страницы в данном месте
    // Перенос не делаем, если это первая строка на новой странице
    if (true === this.Use_YLimit() && (Top > YLimit || Bottom2 > YLimit) && (CurLine != this.Pages[CurPage].FirstLine || false === bNoFootnotes || (0 === RealCurPage && (null != this.Get_DocumentPrev() || (true === this.Parent.Is_TableCellContent() && true !== this.Parent.Is_TableFirstRowOnNewPage())))) && false === BreakPageLineEmpty)
    {
		this.private_RecalculateMoveLineToNextPage(CurLine, CurPage, PRS, ParaPr);
		return false;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineCheckRanges = function(CurLine, CurPage, PRS, ParaPr)
{
    var Right   = this.Pages[CurPage].XLimit - ParaPr.Ind.Right;
    var Top     = PRS.LineTop;
    var Bottom  = PRS.LineBottom;
    var Top2    = PRS.LineTop2;
    var Bottom2 = PRS.LineBottom2;

    var Left;

    if(true === PRS.MathNotInline)
        Left = this.Pages[CurPage].X;
    else
        Left = false === PRS.UseFirstLine ? this.Pages[CurPage].X + ParaPr.Ind.Left : this.Pages[CurPage].X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

    var PageFields = this.Parent.Get_ColumnFields ? this.Parent.Get_ColumnFields(this.Get_Index(), this.Get_AbsoluteColumn(CurPage)) : this.Parent.Get_PageFields(this.private_GetRelativePageIndex(CurPage));

    var Ranges = PRS.Ranges;
    var Ranges2;

    if ( true === this.Use_Wrap() )
        Ranges2 = this.Parent.CheckRange(Left, Top, Right, Bottom, Top2, Bottom2, PageFields.X, PageFields.XLimit, this.private_GetRelativePageIndex(CurPage), true, PRS.MathNotInline);
    else
        Ranges2 = [];

    // Проверяем совпали ли промежутки. Если совпали, тогда данная строчка рассчитана верно, и мы переходим к
    // следующей, если нет, тогда заново рассчитываем данную строчку, но с новыми промежутками.
    // Заметим, что тут возможен случай, когда Ranges2 меньше, чем Ranges, такое может случится при повторном
    // обсчете строки. (После первого расчета мы выяснили что Ranges < Ranges2, при повторном обсчете строки, т.к.
    // она стала меньше, то у нее и рассчитанная высота могла уменьшиться, а значит Ranges2 могло оказаться
    // меньше чем Ranges). В таком случае не надо делать повторный пересчет, иначе будет зависание.
    if (-1 === FlowObjects_CompareRanges(Ranges, Ranges2) && true === FlowObjects_CheckInjection(Ranges, Ranges2) && false === PRS.BreakPageLineEmpty)
    {
        // Выставляем новые отрезки обтекания и сообщаем, что надо заново персчитать данную строку
        PRS.Ranges       = Ranges2;
        PRS.RangesCount  = Ranges2.length;
        PRS.RecalcResult = recalcresult_CurLine;

        if (this.Lines[CurLine].Info & paralineinfo_RangeY)
            PRS.RangeY = true;

        return false;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineBaseLine    = function(CurLine, CurPage, PRS, ParaPr)
{
    if (this.Lines[CurLine].Info & paralineinfo_RangeY)
    {
        this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
    }
    else
    {
        if (CurLine > 0)
        {
            // Первая линия на странице не должна двигаться
            if (CurLine != this.Pages[CurPage].FirstLine && ( true === PRS.End || true !== PRS.EmptyLine || PRS.RangesCount <= 0 || true === PRS.NewPage  ))
                PRS.Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;

            this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
        }
        else
            this.Lines[0].Y = 0;
    }

    this.Lines[CurLine].Y += PRS.BaseLineOffset;
    if (this.Lines[CurLine].Metrics.LineGap < 0)
        this.Lines[CurLine].Y += this.Lines[CurLine].Metrics.LineGap;
};

Paragraph.prototype.private_RecalculateLineCheckRangeY = function(CurLine, CurPage, PRS, ParaPr)
{
    // Такое случается, когда у нас после пересчета Flow картинки, место к которому она была привязана перешло на
    // следующую страницу.
    if (PRS.RecalcResult & recalcresult_NextPage)
        return false;

    // Если строка пустая в следствии того, что у нас было обтекание, тогда мы не добавляем новую строку,
    // а просто текущую смещаем ниже.


    if(true === PRS.EmptyLine && true === PRS.bMathRangeY) // нужный PRS.Y выставляется в ParaMath
    {
        PRS.bMathRangeY = false;
        // Отмечаем, что данная строка переносится по Y из-за обтекания
        PRS.RangeY = true;

        // Пересчитываем заново данную строку
        PRS.Reset_Ranges();
        PRS.RecalcResult = recalcresult_CurLine;

        return false;
    }
    else if (true !== PRS.End && true === PRS.EmptyLine && PRS.RangesCount > 0)
    {
        // Найдем верхнюю точку объектов обтекания (т.е. так чтобы при новом обсчете не учитывался только
        // этот объект, заканчивающийся выше всех)

        var Ranges = PRS.Ranges;

        var RangesMaxY = Ranges[0].Y1;
        for (var Index = 1; Index < Ranges.length; Index++)
        {
            if (RangesMaxY > Ranges[Index].Y1)
                RangesMaxY = Ranges[Index].Y1;
        }

        if (Math.abs(RangesMaxY - PRS.Y) < 0.001)
            PRS.Y = RangesMaxY + 1; // смещаемся по 1мм
        else
            PRS.Y = RangesMaxY + 0.001; // Добавляем 0.001, чтобы избавиться от погрешности

        // Отмечаем, что данная строка переносится по Y из-за обтекания
        PRS.RangeY = true;

        // Пересчитываем заново данную строку
        PRS.Reset_Ranges();
        PRS.RecalcResult = recalcresult_CurLine;

        return false;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineEnd         = function(CurLine, CurPage, PRS, ParaPr)
{
    if ( true === PRS.NewPage )
    {
        // Если это последний элемент параграфа, тогда нам не надо переносить текущий параграф
        // на новую страницу. Нам надо выставить границы так, чтобы следующий параграф начинался
        // с новой страницы.
        this.Pages[CurPage].Set_EndLine( CurLine );
        PRS.RecalcResult = recalcresult_NextPage;
        return false;
    }

    if (true !== PRS.End)
    {
        if ( true === PRS.ForceNewPage )
        {
            this.Pages[CurPage].Set_EndLine( CurLine - 1 );

            if ( 0 === CurLine )
                this.Lines[-1] = new CParaLine();

            PRS.RecalcResult = recalcresult_NextPage;
            return false;
        }
    }
    else
    {
        // В последней строке могут быть заполнены не все отрезки обтекания. Удаляем лишние.
        if (PRS.Range < PRS.RangesCount)
            this.Lines[CurLine].Ranges.length = PRS.Range + 1;

        // Проверим висячую строку
        if (true === ParaPr.WidowControl && CurLine === this.Pages[CurPage].StartLine && CurLine >= 1 && false === this.private_CheckSkipKeepLinesAndWidowControl(CurPage))
        {
            // Проверим не встречается ли в предыдущей строке BreakPage, если да, тогда не учитываем WidowControl
            var BreakPagePrevLine = (this.Lines[CurLine - 1].Info & paralineinfo_BreakPage) | 0;

            if (this.Parent instanceof CDocument
                && true === this.Parent.RecalcInfo.Can_RecalcWidowControl()
                && 0 === BreakPagePrevLine
                && (1 === CurPage && null != this.Get_DocumentPrev())
                && this.Lines[CurLine - 1].Ranges.length <= 1)
            {
                var bBreakPageFromStart = false;
                for (var Index = 0, Count = this.Pages[CurPage - 1].Drawings.length; Index < Count; Index++)
                {
                    var Drawing = this.Pages[CurPage - 1].Drawings[Index];
                    var DrawingLine = Drawing.LineNum;

                    if (DrawingLine >= CurLine - 1)
                    {
                        bBreakPageFromStart = true;
                        break;
                    }
                }

                // Если в строках, которые мы переносим есть картинки, либо, если у нас в параграфе 3 строки,
                // тогда сразу начинаем параграф с новой строки
                if (true === bBreakPageFromStart || CurLine <= 2)
                {
                    CurLine = 0;
                    // Вызываем данную функцию для удаления картинок с предыдущей страницы
                    this.Recalculate_Drawing_AddPageBreak(0, 0, true);
                }
                else
                    CurLine = CurLine - 1;

                this.Parent.RecalcInfo.Set_WidowControl(this, CurLine);
                PRS.RecalcResult = recalcresult_PrevPage | recalcresultflags_Column;
                return false;
            }
        }

        // Если у нас нумерация относится к знаку конца параграфа, тогда в такой
        // ситуации не рисуем нумерацию у такого параграфа.
        if (para_End === this.Numbering.Item.Type && this.Lines[CurLine].Info & paralineinfo_BreakPage)
        {
            this.Numbering.Item  = null;
            this.Numbering.Run   = null;
            this.Numbering.Line  = -1;
            this.Numbering.Range = -1;
        }

        this.Pages[CurPage].Set_EndLine( CurLine );
        PRS.RecalcResult = recalcresult_NextElement;
    }

    return true;
};

Paragraph.prototype.private_RecalculateLineAlign       = function(CurLine, CurPage, PRS, ParaPr, Fast)
{
    // Здесь мы пересчитываем ширину пробелов (и в особенных случаях дополнительное
    // расстояние между символами) с учетом прилегания параграфа.
    // 1. Если align = left, тогда внутри каждого промежутка текста выравниваем его
    //    к левой границе промежутка.
    // 2. Если align = right, тогда внутри каждого промежутка текста выравниваем его
    //    к правой границе промежутка.
    // 3. Если align = center, тогда внутри каждого промежутка текста выравниваем его
    //    по центру промежутка.
    // 4. Если align = justify, тогда
    //    4.1 Если внутри промежутка ровно 1 слово.
    //        4.1.1 Если промежуток в строке 1 и слово занимает почти всю строку,
    //              добавляем в слове к каждой букве дополнительное расстояние между
    //              символами, чтобы ширина слова совпала с шириной строки.
    //        4.1.2 Если промежуток первый, тогда слово приставляем к левой границе
    //              промежутка
    //        4.1.3 Если промежуток последний, тогда приставляем слово к правой
    //              границе промежутка
    //        4.1.4 Если промежуток ни первый, ни последний, тогда ставим слово по
    //              середине промежутка
    //    4.2 Если слов больше 1, тогда, исходя из количества пробелов между словами в
    //        промежутке, увеличиваем их на столько, чтобы правая граница последнего
    //        слова совпала с правой границей промежутка
    var PRSW = PRS;
    var PRSC = this.m_oPRSC;
    var PRSA = this.m_oPRSA;
    PRSA.Paragraph    = this;
    PRSA.LastW        = 0;
    PRSA.RecalcFast   = Fast;
    PRSA.RecalcResult = recalcresult_NextElement;
    PRSA.PageY        = this.Pages[CurPage].Bounds.Top;
    PRSA.PageX        = this.Pages[CurPage].Bounds.Left;

    var Line        = this.Lines[CurLine];
    var RangesCount = Line.Ranges.length;

    for (var CurRange = 0; CurRange < RangesCount; CurRange++)
    {
        var Range = Line.Ranges[CurRange];

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        PRSC.Reset( this, Range );

        PRSC.Range.W = 0;
        if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
            PRSC.Range.W += this.Numbering.WidthVisible;

        for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
        {
            var Item = this.Content[Pos];
            Item.Recalculate_Range_Width( PRSC, CurLine, CurRange );
        }

        var JustifyWord  = 0;
        var JustifySpace = 0;
        var RangeWidth   = Range.XEnd - Range.X;

        var X = 0;

        // Если данный отрезок содержит только формулу, тогда прилегание данного отрезка определяется формулой
        var ParaMath = this.Check_Range_OnlyMath(CurRange, CurLine);
        if (null !== ParaMath)
        {
            var Math_X      = ( 1 === RangesCount ? this.Pages[CurPage].X      + ParaPr.Ind.Left  : Range.X );
            var Math_XLimit = ( 1 === RangesCount ? this.Pages[CurPage].XLimit - ParaPr.Ind.Right : Range.XEnd );

            X = ParaMath.Get_AlignToLine(CurLine, CurRange, PRS.Page, Math_X, Math_XLimit);
        }
        else
        {
            if (this.Lines[CurLine].Info & paralineinfo_BadLeftTab)
            {
                X            = Range.X;
                JustifyWord  = 0;
                JustifySpace = 0;
            }
            else
            {
                // RangeWidth - ширина всего пространства в данном отрезке, а Range.W - ширина занимаемого пространства
                switch (ParaPr.Jc)
                {
                    case AscCommon.align_Left :
                    {
                        X = Range.X;
                        break;
                    }
                    case AscCommon.align_Right:
                    {
                        X = Math.max(Range.X + RangeWidth - Range.W, Range.X);
                        break;
                    }
                    case AscCommon.align_Center:
                    {
                        X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X);
                        break;
                    }
                    case AscCommon.align_Justify:
                    {
                        X = Range.X;

                        if (1 == PRSC.Words)
                        {
                            if (1 == RangesCount && !(Line.Info & paralineinfo_End))
                            {
                                // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                if (RangeWidth - Range.W <= 0.05 * RangeWidth && PRSC.Letters > 1)
                                    JustifyWord = (RangeWidth - Range.W) / (PRSC.Letters - 1);
                            }
                            else if (0 == CurRange || Line.Info & paralineinfo_End)
                            {
                                // TODO: Здесь нужно улучшить проверку, т.к. отключено выравнивание по центру для всей
                                //       последней строки, а нужно отключить для последнего отрезка, в котором идет
                                //       конец параграфа.
                                
                                // Ничего не делаем (выравниваем текст по левой границе)
                            }
                            else if (CurRange == RangesCount - 1)
                            {
                                X = Range.X + RangeWidth - Range.W;
                            }
                            else
                            {
                                X = Range.X + (RangeWidth - Range.W) / 2;
                            }
                        }
                        else
                        {
                            // TODO: Переделать проверку последнего отрезка в последней строке (нужно выставлять флаг когда пришел PRS.End в отрезке)

                            // Последний промежуток последней строки не надо растягивать по ширине.
                            if (PRSC.Spaces > 0 && (!(Line.Info & paralineinfo_End) || CurRange != Line.Ranges.length - 1))
                                JustifySpace = (RangeWidth - Range.W) / PRSC.Spaces;
                            else
                                JustifySpace = 0;
                        }

                        break;
                    }
                    default:
                    {
                        X = Range.X;
                        break;
                    }
                }
            }

            // В последнем отрезке последней строки не делаем текст "по ширине"
            if (CurLine === this.ParaEnd.Line && CurRange === this.ParaEnd.Range)
            {
                JustifyWord  = 0;
                JustifySpace = 0;
            }
        }

        Range.Spaces = PRSC.Spaces + PRSC.SpacesSkip;

        PRSA.X    = X;
        PRSA.Y    = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        PRSA.XEnd = Range.XEnd;
        PRSA.JustifyWord   = JustifyWord;
        PRSA.JustifySpace  = JustifySpace;
        PRSA.SpacesCounter = PRSC.Spaces;
        PRSA.SpacesSkip    = PRSC.SpacesSkip;
        PRSA.LettersSkip   = PRSC.LettersSkip;
        PRSA.RecalcResult  = recalcresult_NextElement;

        var _LineMetrics = this.Lines[CurLine].Metrics;
        PRSA.Y0 = (this.Pages[CurPage].Y + this.Lines[CurLine].Y - _LineMetrics.Ascent);
        PRSA.Y1 = (this.Pages[CurPage].Y + this.Lines[CurLine].Y + _LineMetrics.Descent);
        if (_LineMetrics.LineGap < 0)
            PRSA.Y1 += _LineMetrics.LineGap;

        this.Lines[CurLine].Ranges[CurRange].XVisible = X;

        if ( 0 === CurRange )
            this.Lines[CurLine].X = X - PRSW.XStart;

        if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
            PRSA.X += this.Numbering.WidthVisible;

        for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
        {
            var Item = this.Content[Pos];
            Item.Recalculate_Range_Spaces(PRSA, CurLine, CurRange, CurPage);

            if (!(PRSA.RecalcResult & recalcresult_NextElement))
            {
                PRSW.RecalcResult = PRSA.RecalcResult;
                return PRSA.RecalcResult;
            }
        }
    }

    return PRSA.RecalcResult;
};

Paragraph.prototype.private_RecalculateLineCheckFootnotes = function(CurLine, CurPage, PRS, ParaPr)
{
    if (!((PRS.RecalcResult & recalcresult_NextElement) || (PRS.RecalcResult & recalcresult_NextLine)))
        return false;

	if (PRS.Fast)
		return true;

	var oTopDocument  = PRS.TopDocument;
	var arrFootnotes  = [];
	var oLineBreakPos = this.GetLineEndPos(CurLine);
	for (var nIndex = 0, nCount = PRS.Footnotes.length; nIndex < nCount; ++nIndex)
	{
		var oFootnote = PRS.Footnotes[nIndex].FootnoteReference.Get_Footnote();
		var oPos      = PRS.Footnotes[nIndex].Pos;

		// Проверим позицию
		if (oLineBreakPos.Compare(oPos) <= 0)
			continue;

		arrFootnotes.push(oFootnote);
	}

	if (oTopDocument instanceof CDocument)
	{
		if (!oTopDocument.Footnotes.RecalculateFootnotes(PRS.PageAbs, PRS.ColumnAbs, this.Pages[CurPage].Y + this.Lines[CurLine].Bottom, arrFootnotes))
		{
			this.private_RecalculateMoveLineToNextPage(CurLine, CurPage, PRS, ParaPr);
			return false;
		}
	}

	return true;
};

Paragraph.prototype.private_RecalculateRange           = function(CurRange, CurLine, CurPage, RangesCount, PRS, ParaPr)
{
    // Найдем начальную позицию данного отрезка
    var StartPos = 0;
    if ( 0 === CurLine && 0 === CurRange )
        StartPos = 0;
    else if ( CurRange > 0 )
        StartPos = this.Lines[CurLine].Ranges[CurRange - 1].EndPos;
    else
        StartPos = this.Lines[CurLine - 1].Ranges[ this.Lines[CurLine - 1].Ranges.length - 1 ].EndPos;

    var Line = this.Lines[CurLine];
    var Range = Line.Ranges[CurRange];

    this.Lines[CurLine].Set_RangeStartPos( CurRange, StartPos );

    if ( true === PRS.UseFirstLine && 0 !== CurRange && true === PRS.EmptyLine )
    {
        if ( ParaPr.Ind.FirstLine < 0 )
        {
            Range.X += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        }
        else
        {
            Range.X += ParaPr.Ind.FirstLine;
        }
    }

    var X    = Range.X;
    var XEnd = ( CurRange == RangesCount ? PRS.XLimit : PRS.Ranges[CurRange].X0 );

    // Обновляем состояние пересчета
    PRS.Reset_Range(X, XEnd);

    var ContentLen = this.Content.length;

    var Pos = StartPos;
    for ( ;Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];

        if ( para_Math === Item.Type )
        {
            var NotInlineMath = this.Check_MathPara(Pos);
            if (true === NotInlineMath && true !== PRS.EmptyLine)
            {
                PRS.ForceNewLine = true;
                PRS.NewRange = true;
                Pos--;
                break;
            }
            // TODO: Надо бы перенести эту проверку на изменение контента параграфа
            Item.Set_Inline(true === this.Check_MathPara(Pos)? false : true);
        }

        if ( ( 0 === Pos && 0 === CurLine && 0 === CurRange ) || Pos !== StartPos )
        {
            Item.Recalculate_Reset(CurRange, CurLine);
        }

        PRS.Update_CurPos( Pos, 0 );
        Item.Recalculate_Range( PRS, ParaPr, 1 );

        if ( true === PRS.NewRange )
        {
            break;
        }
    }

    if ( Pos >= ContentLen )
        Pos = ContentLen - 1;

    if (PRS.RecalcResult & recalcresult_NextLine)
    {
        // У нас отрезок пересчитался нормально и тут возможны 2 варианта :
        // 1. Отрезок закончился в данной позиции
        // 2. Не все убралось в заданный отрезок и перенос нужно поставить в позиции PRS.LineBreakPos

        if ( true === PRS.MoveToLBP )
        {
            // Отмечаем, что в заданной позиции заканчивается отрезок
            this.private_RecalculateRangeEndPos( PRS, PRS.LineBreakPos, 0 );
        }
        else
            this.Lines[CurLine].Set_RangeEndPos( CurRange, Pos );
    }
};

Paragraph.prototype.private_RecalculateRangeEndPos     = function(PRS, PRP, Depth)
{
    var CurLine  = PRS.Line;
    var CurRange = PRS.Range;
    var CurPos   = PRP.Get(Depth);

    this.Content[CurPos].Recalculate_Set_RangeEndPos(PRS, PRP, Depth + 1);
    this.Lines[CurLine].Set_RangeEndPos( CurRange, CurPos );
};

Paragraph.prototype.private_RecalculateGetTabPos = function(X, ParaPr, CurPage, NumTab)
{
    var PRS = this.m_oPRSW;

    var PageStart = this.Parent.Get_PageContentStartPos2(this.PageNum, this.ColumnNum, CurPage, this.Index);
    if ( undefined != this.Get_FramePr() )
        PageStart.X = 0;
    else if ( PRS.RangesCount > 0 && Math.abs(PRS.Ranges[0].X0 - PageStart.X) < 0.001 )
        PageStart.X = PRS.Ranges[0].X1;

    // Если у данного параграфа есть табы, тогда ищем среди них
    var TabsCount = ParaPr.Tabs.Get_Count();

    // Добавим в качестве таба левую границу
    var TabsPos = [];
    var bCheckLeft = true;
    for ( var Index = 0; Index < TabsCount; Index++ )
    {
        var Tab = ParaPr.Tabs.Get(Index);
        var TabPos = Tab.Pos + PageStart.X;

        if ( true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left )
        {
            TabsPos.push( new CParaTab(tab_Left, ParaPr.Ind.Left ) );
            bCheckLeft = false;
        }

        if ( tab_Clear != Tab.Value )
            TabsPos.push( Tab );
    }

    if ( true === bCheckLeft )
        TabsPos.push( new CParaTab(tab_Left, ParaPr.Ind.Left ) );

    TabsCount = TabsPos.length;

    var Tab = null;
    for ( var Index = 0; Index < TabsCount; Index++ )
    {
        var TempTab = TabsPos[Index];

        // TODO: Пока здесь сделаем поправку на погрешность. Когда мы сделаем так, чтобы все наши значения хранились
        //       в тех же единицах, что и в формате Docx, тогда и здесь можно будет вернуть обычное сравнение (см. баг 22586)
        //       Разница с NumTab возникла из-за бага 22586, везде нестрогое оставлять нельзя из-за бага 32051.

        var _X1 = (X * 72 * 20) | 0;
        var _X2 = ((TempTab.Pos + PageStart.X) * 72 * 20) | 0;

        //if (X < TempTab.Pos + PageStart.X)
        if ((true === NumTab && _X1 <= _X2) || (true !== NumTab && _X1 < _X2))
        {
            Tab = TempTab;
            break;
        }
    }

    var NewX = 0;

    // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
    var DefTab = ParaPr.DefaultTabSize != null ? ParaPr.DefaultTabSize : AscCommonWord.Default_Tab_Stop;
    if ( null === Tab )
    {
        if ( X < PageStart.X + ParaPr.Ind.Left )
        {
            NewX = PageStart.X + ParaPr.Ind.Left;
        }
        else if (DefTab < 0.001)
        {
            NewX = X;
        }
        else
        {
            NewX = PageStart.X;
            while ( X >= NewX - 0.001 )
                NewX += DefTab;
        }
    }
    else
    {
        NewX = Tab.Pos + PageStart.X;
    }

    return { NewX : NewX, TabValue : ( null === Tab ? tab_Left : Tab.Value ), DefaultTab : (null === Tab ? true : false) };
};

Paragraph.prototype.private_CheckSkipKeepLinesAndWidowControl = function(CurPage)
{
    var bSkipWidowAndKeepLines = false;
    if (this.ColumnsCount > 1)
    {
        var bWrapDrawing = false;
        for (var TempPage = 0; TempPage <= CurPage; ++TempPage)
        {
            for (var DrawingIndex = 0, DrawingsCount = this.Pages[TempPage].Drawings.length; DrawingIndex < DrawingsCount; ++DrawingIndex)
            {
                if (this.Pages[TempPage].Drawings[DrawingIndex].Use_TextWrap())
                {
                    bWrapDrawing = true;
                    break;
                }
            }

            if (bWrapDrawing)
                break;
        }

        bSkipWidowAndKeepLines = bWrapDrawing;
    }

    return bSkipWidowAndKeepLines;
};

Paragraph.prototype.private_CheckColumnBreak = function(CurPage)
{
    if (this.Is_EmptyPage(CurPage))
        return;

    var Page = this.Pages[CurPage];
    var Line = this.Lines[Page.EndLine];

    if (!Line)
        return;

    if (Line.Info & paralineinfo_BreakPage && !(Line.Info & paralineinfo_BreakRealPage))
    {
        if (this.bFromDocument && this.LogicDocument)
            this.LogicDocument.OnColumnBreak_WhileRecalculate();
    }
};

Paragraph.prototype.private_RecalculateMoveLineToNextPage = function(CurLine, CurPage, PRS, ParaPr)
{
	// TODO: Неразрывные абзацы и висячие строки внутри колонок вместе с плавающими объектами пока не обсчитываем
	var bSkipWidowAndKeepLines = this.private_CheckSkipKeepLinesAndWidowControl(CurPage);

	// Проверим висячую строку
	if (this.Parent instanceof CDocument
		&& false === bSkipWidowAndKeepLines
		&& true === this.Parent.RecalcInfo.Can_RecalcWidowControl()
		&& true === ParaPr.WidowControl
		&& CurLine - this.Pages[CurPage].StartLine <= 1
		&& CurLine >= 1 && true != PRS.BreakPageLine
		&& ( 0 === CurPage && null != this.Get_DocumentPrev() ) )
	{
		// Вызываем данную функцию для удаления картинок с предыдущей страницы
		this.Recalculate_Drawing_AddPageBreak(0, 0, true);

		// TODO: Здесь перенос нужно делать сразу же, если в строке не было объектов с обтеканием
		this.Parent.RecalcInfo.Set_WidowControl(this, CurLine - 1);
		PRS.RecalcResult = recalcresult_CurPage | recalcresultflags_Column;
		return false;
	}
	else
	{
		// Учитываем неразрывные абзацы:
		//   1. В Word2010 (версия <= 14) просто проверяем, если параграф разбивается на 2 страницы, тогда
		//      переносим его с новой страницы. Также не учитываем неразрывные параграфы внутри таблиц.
		//   2. В Word2016 (версия >= 15) в добавок к предыдущему ориентируемся на колонки: пытаемся текущую
		//      страницу параграфа разместить в какой либо колонке (пересчитывая их по очереди), если параграф
		//      все равно не рассчитан до конца, тогда размещаем его в первой колонке и делаем перенос на следующую
		//      страницу.
		if (true === ParaPr.KeepLines && this.LogicDocument && false === bSkipWidowAndKeepLines)
		{
			var CompatibilityMode = this.LogicDocument.Get_CompatibilityMode();
			if (CompatibilityMode <= document_compatibility_mode_Word14)
			{
				if (null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage)
					CurLine = 0;
			}
			else if (CompatibilityMode >= document_compatibility_mode_Word15)
			{
				// TODO: Разобраться с 2016 вордом
				if (null != this.Get_DocumentPrev() && 0 === CurPage)
					CurLine = 0;
			}
		}

		// Восстанавливаем позицию нижней границы предыдущей страницы
		this.Pages[CurPage].Bounds.Bottom = PRS.LinePrevBottom;
		this.Pages[CurPage].Set_EndLine( CurLine - 1 );

		if ( 0 === CurLine )
			this.Lines[-1] = new CParaLine(0);

		// Добавляем разрыв страницы
		PRS.RecalcResult = recalcresult_NextPage;
		return false;
	}
};

Paragraph.prototype.private_CheckNeedBeforeSpacing = function(CurPage, PRS)
{
	if (CurPage <= 0)
		return true;

	if (!this.Check_FirstPage(CurPage))
		return false;

	if (!(PRS.Parent instanceof CDocument))
		return true;

	// Если дошли до этого места, то тут все зависит от того на какой мы странице. Если на первой странице данной секции
	// тогда добавляем расстояние, а если нет - нет. Но подсчет первой страницы здесь не совпадает с тем, как она
	// считается для нумерации. Если разрыв секции идет на текущей странице, то первой считается сразу данная страница.

	var LogicDocument = PRS.Parent;
	var SectionIndex = LogicDocument.GetSectionIndexByElementIndex(this.Get_Index());
	var FirstElement = LogicDocument.GetFirstElementInSection(SectionIndex);

	if (!FirstElement || FirstElement.Get_AbsolutePage(0) === PRS.GetPageAbs())
		return true;

	return false;
};

var ERecalcPageType =
{
    START   : 0x00, // начать заново пересчет, с начала страницы
    ELEMENT : 0x01, // начать заново пересчет, начиная с заданного элемента
    Y       : 0x02  // начать заново пересчет, начиная с заданной позиции по вертикали
};

function CRecalcPageType()
{
    this.Type    = ERecalcPageType.START;
    this.Element = null;
    this.Y       = -1;
}

CRecalcPageType.prototype.Reset = function()
{
    this.Type    = ERecalcPageType.START;
    this.Element = null;
    this.Y       = -1;
};
CRecalcPageType.prototype.Set_Element = function(Element)
{
    this.Type    = ERecalcPageType.Element;
    this.Element = Element;
};
CRecalcPageType.prototype.Set_Y = function(Y)
{
    this.Type = ERecalcPageType.Y;
    this.Y    = Y;
};

var paralineinfo_BreakPage     = 0x0001; // В строке есть PageBreak или ColumnBreak
var paralineinfo_Empty         = 0x0002; // Строка пустая
var paralineinfo_End           = 0x0004; // Последняя строка параграфа
var paralineinfo_RangeY        = 0x0008; // Строка начинается после какого-либо объекта с обтеканием
var paralineinfo_BreakRealPage = 0x0010; // В строке есть PageBreak
var paralineinfo_BadLeftTab    = 0x0020; // В строке есть левый таб, который правее правой границы
var paralineinfo_Notes         = 0x0040; // В строке есть сноски

function CParaLine()
{
    this.Y       = 0; // Позиция BaseLine
    this.Top     = 0;
    this.Bottom  = 0;
    this.Metrics = new CParaLineMetrics();
    this.Ranges  = []; // Массив CParaLineRanges
    this.Info    = 0;  // Побитовая информация о строке:
                       // 1 бит : есть ли PageBreak в строке
                       // 2 бит : пустая ли строка (без учета PageBreak)
                       // 3 бит : последняя ли это строка (т.е. строка с ParaEnd)
                       // 4 бит : строка переносится по Y по обтекаемому объекту
}

CParaLine.prototype =
{
    Add_Range : function(X, XEnd)
    {
        this.Ranges.push(new CParaLineRange(X, XEnd));
    },

    Shift : function(Dx, Dy)
    {
        // По Y мы ничего не переносим, т.к. все значени по Y у строки относительно начала страницы данного параграфа
        for (var CurRange = 0, RangesCount = this.Ranges.length; CurRange < RangesCount; CurRange++)
        {
            this.Ranges[CurRange].Shift(Dx, Dy);
        }
    },

    Get_StartPos : function()
    {
        if (this.Ranges.length <= 0)
            return 0;

        return this.Ranges[0].StartPos;
    },

    Get_EndPos : function()
    {
        if (this.Ranges.length <= 0)
            return 0;

        return this.Ranges[this.Ranges.length - 1].EndPos;
    },

    Set_RangeStartPos : function(CurRange, StartPos)
    {
        this.Ranges[CurRange].StartPos = StartPos;
    },

    Set_RangeEndPos : function(CurRange, EndPos)
    {
        this.Ranges[CurRange].EndPos = EndPos;
    },

    Copy : function()
    {
        var NewLine = new CParaLine();

        NewLine.Y      = this.Y;
        NewLine.Top    = this.Top;
        NewLine.Bottom = this.Bottom;

        NewLine.Metrics.Ascent      = this.Ascent;
        NewLine.Metrics.Descent     = this.Descent;
        NewLine.Metrics.TextAscent  = this.TextAscent;
        NewLine.Metrics.TextAscent2 = this.TextAscent2;
        NewLine.Metrics.TextDescent = this.TextDescent;
        NewLine.Metrics.LineGap     = this.LineGap;

        for (var CurRange = 0, RangesCount = this.Ranges.length; CurRange < RangesCount; CurRange++)
        {
            NewLine.Ranges[CurRange] = this.Ranges[CurRange].Copy();
        }

        NewLine.Info = this.Info;

        return NewLine;
    },

    Reset : function()
    {
        //this.Y        = 0;
        this.Top      = 0;
        this.Bottom   = 0;
        this.Metrics  = new CParaLineMetrics();
        this.Ranges   = [];
        this.Info     = 0;
    }
};

function CParaLineMetrics()
{
    this.Ascent      = 0; // Высота над BaseLine
    this.Descent     = 0; // Высота после BaseLine
    this.TextAscent  = 0; // Высота текста над BaseLine
    this.TextAscent2 = 0; // Высота текста над BaseLine
    this.TextDescent = 0; // Высота текста после BaseLine
    this.LineGap     = 0; // Дополнительное расстояние между строками
}

CParaLineMetrics.prototype =
{
    Update : function(TextAscent, TextAscent2, TextDescent, Ascent, Descent, ParaPr)
    {
        if ( TextAscent > this.TextAscent )
            this.TextAscent = TextAscent;

        if ( TextAscent2 > this.TextAscent2 )
            this.TextAscent2 = TextAscent2;

        if ( TextDescent > this.TextDescent )
            this.TextDescent = TextDescent;

        if ( Ascent > this.Ascent )
            this.Ascent = Ascent;

        if ( Descent > this.Descent )
            this.Descent = Descent;

        if ( this.Ascent < this.TextAscent )
            this.Ascent = this.TextAscent;

        if ( this.Descent < this.TextDescent )
            this.Descent = this.TextDescent;

        this.LineGap = this.Recalculate_LineGap( ParaPr, this.TextAscent, this.TextDescent );

        if (Asc.linerule_AtLeast === ParaPr.Spacing.LineRule && (this.Ascent + this.Descent + this.LineGap) > (this.TextAscent + this.TextDescent))
        {
            // В такой ситуации Word располагает текст внизу строки
            this.Ascent  = this.Ascent + this.LineGap;
            this.LineGap = 0;
        }
    },

    Recalculate_LineGap : function(ParaPr, TextAscent, TextDescent)
    {
        var LineGap = 0;
        switch ( ParaPr.Spacing.LineRule )
        {
            case Asc.linerule_Auto:
            {
                LineGap = ( TextAscent + TextDescent ) * ( ParaPr.Spacing.Line - 1 );
                break;
            }
            case Asc.linerule_Exact:
            {
                var ExactValue = Math.max( 25.4 / 72, ParaPr.Spacing.Line );
                LineGap = ExactValue - ( TextAscent + TextDescent );

                var Gap = this.Ascent + this.Descent - ExactValue;

                if ( Gap > 0 )
                {
                    var DescentDiff = this.Descent - this.TextDescent;

                    if ( DescentDiff > 0 )
                    {
                        if ( DescentDiff < Gap )
                        {
                            this.Descent = this.TextDescent;
                            Gap -= DescentDiff;
                        }
                        else
                        {
                            this.Descent -= Gap;
                            Gap = 0;
                        }
                    }

                    var AscentDiff = this.Ascent - this.TextAscent;

                    if ( AscentDiff > 0 )
                    {
                        if ( AscentDiff < Gap )
                        {
                            this.Ascent = this.TextAscent;
                            Gap -= AscentDiff;
                        }
                        else
                        {
                            this.Ascent -= Gap;
                            Gap = 0;
                        }
                    }

                    if ( Gap > 0 )
                    {
                        // Уменьшаем пропорционально TextAscent и TextDescent
                        var OldTA = this.TextAscent;
                        var OldTD = this.TextDescent;

                        var Sum = OldTA + OldTD;

                        this.Ascent  = OldTA * (Sum - Gap) / Sum;
                        this.Descent = OldTD * (Sum - Gap) / Sum;
                    }
                }
                else
                {
                    this.Ascent -= Gap; // все в Ascent
                }

                LineGap = 0;


                break;
            }
            case Asc.linerule_AtLeast:
            {
                var TargetLineGap = ParaPr.Spacing.Line;
                var TextLineGap   = TextAscent + TextDescent;
                var RealLineGap   = this.Ascent + this.Descent;

                // Специальный случай, когда в строке нет никакого текста
                if (Math.abs(TextLineGap) < 0.001 || RealLineGap >= TargetLineGap)
                    LineGap = 0;
                else
                    LineGap = TargetLineGap - RealLineGap;

                break;
            }

        }
        return LineGap;
    }
};

function CParaLineRange(X, XEnd)
{
    this.X         = X;    // Начальная позиция отрезка без учета прилегания содержимого
    this.XVisible  = 0;    // Начальная позиция отрезка с учетом прилегания содержимого
    this.XEnd      = XEnd; // Предельное значение по X для данного отрезка
    this.StartPos  = 0;    // Позиция в контенте параграфа, с которой начинается данный отрезок
    this.EndPos    = 0;    // Позиция в контенте параграфа, на которой заканчиваетсяданный отрезок
    this.W         = 0;
    this.Spaces    = 0;    // Количество пробелов в отрезке, без учета пробелов в конце отрезка
}

CParaLineRange.prototype =
{
    Shift : function(Dx, Dy)
    {
        this.X        += Dx;
        this.XEnd     += Dx;
        this.XVisible += Dx;
    },

    Copy : function()
    {
        var NewRange = new CParaLineRange();

        NewRange.X           = this.X;
        NewRange.XVisible    = this.XVisible;
        NewRange.XEnd        = this.XEnd;
        NewRange.StartPos    = this.StartPos;
        NewRange.EndPos      = this.EndPos;
        NewRange.W           = this.W;
        NewRange.Spaces      = this.Spaces;

        return NewRange;
    }
};

function CParaPage(X, Y, XLimit, YLimit, FirstLine)
{
    this.X         = X;
    this.Y         = Y;
    this.XLimit    = XLimit;
    this.YLimit    = YLimit;
    this.FirstLine = FirstLine;
    this.Bounds    = new CDocumentBounds( X, Y, XLimit, Y );
    this.StartLine = FirstLine; // Номер строки, с которой начинается данная страница
    this.EndLine   = FirstLine; // Номер последней строки на данной странице
    this.TextPr    = null;      // Расситанные текстовые настройки для начала страницы

    this.Drawings  = [];
    this.EndInfo   = new CParagraphPageEndInfo();
}

CParaPage.prototype =
{
    Reset : function(X, Y, XLimit, YLimit, FirstLine)
    {
        this.X         = X;
        this.Y         = Y;
        this.XLimit    = XLimit;
        this.YLimit    = YLimit;
        this.FirstLine = FirstLine;
        this.Bounds    = new CDocumentBounds( X, Y, XLimit, Y );
        this.StartLine = FirstLine;
        this.Drawings  = [];
    },

    Shift : function(Dx, Dy)
    {
        this.X      += Dx;
        this.Y      += Dy;
        this.XLimit += Dx;
        this.YLimit += Dy;
        this.Bounds.Shift( Dx, Dy );
    },

    Set_EndLine : function(EndLine)
    {
        this.EndLine = EndLine;
    },

    Add_Drawing : function(Item)
    {
        this.Drawings.push(Item);
    },

    Copy : function()
    {
        var NewPage = new CParaPage();

        NewPage.X             = this.X;
        NewPage.Y             = this.Y;
        NewPage.XLimit        = this.XLimit;
        NewPage.YLimit        = this.YLimit;
        NewPage.FirstLine     = this.FirstLine;

        NewPage.Bounds.Left   = this.Bounds.Left;
        NewPage.Bounds.Right  = this.Bounds.Right;
        NewPage.Bounds.Top    = this.Bounds.Top;
        NewPage.Bounds.Bottom = this.Bounds.Bottom;

        NewPage.StartLine     = this.StartLine;
        NewPage.EndLine       = this.EndLine;

        var Count = this.Drawings.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            NewPage.Drawings.push( this.Drawings[Index] );
        }

        NewPage.EndInfo = this.EndInfo.Copy();

        return NewPage;
    }
};

function CParagraphRecalculateTabInfo()
{
    this.TabPos =  0;
    this.X      =  0;
    this.Value  = -1;
    this.Item   = null;
}

CParagraphRecalculateTabInfo.prototype =
{
    Reset : function()
    {
        this.TabPos =  0;
        this.X      =  0;
        this.Value  = -1;
        this.Item   = null;
    }
};

function CParagraphRecalculateStateWrap(Para)
{
    // Общие параметры, которые заполняются 1 раз на пересчет всей страницы
    this.Paragraph       = Para;
    this.Parent          = null;
    this.TopDocument     = null;
    this.PageAbs         = 0;
    this.ColumnAbs       = 0;
	this.InTable         = false;
    this.SectPr          = null; // настройки секции, к которой относится данный параграф

	this.Fast            = false; // Быстрый ли пересчет

    //
    this.Page            = 0;
    this.Line            = 0;
    this.Range           = 0;

    this.Ranges          = [];
    this.RangesCount     = 0;

    this.FirstItemOnLine = true;
    this.EmptyLine       = true;
    this.StartWord       = false;
    this.Word            = false;
    this.AddNumbering    = true;

    this.BreakPageLine      = false; // Разрыв страницы (параграфа) в данной строке
    this.UseFirstLine       = false;
    this.BreakPageLineEmpty = false;
    this.BreakRealPageLine  = false; // Разрыв страницы документа (не только параграфа) в данной строке
    this.BadLeftTab         = false; // Левый таб правее правой границы

    this.WordLen         = 0;
    this.SpaceLen        = 0;
    this.SpacesCount     = 0;
    this.LastTab         = new CParagraphRecalculateTabInfo();

    this.LineTextAscent  = 0;
    this.LineTextDescent = 0;
    this.LineTextAscent2 = 0;
    this.LineAscent      = 0;
    this.LineDescent     = 0;

    this.LineTop        = 0;
    this.LineBottom     = 0;
    this.LineTop2       = 0;
    this.LineBottom2    = 0;
    this.LinePrevBottom = 0;

    this.XRange = 0; // Начальное положение по горизонтали для данного отрезка
    this.X      = 0; // Текущее положение по горизонтали
    this.XEnd   = 0; // Предельное значение по горизонтали для текущего отрезка

    this.Y      = 0; // Текущее положение по вертикали

    this.XStart = 0; // Начальное значение для X на данной страницы
    this.YStart = 0; // Начальное значение для Y на данной страницы
    this.XLimit = 0; // Предельное значение для X на данной страницы
    this.YLimit = 0; // Предельное значение для Y на данной страницы

    this.NewPage  = false; // Переходим на новую страницу
    this.NewRange = false; // Переходим к новому отрезку
    this.End      = false;
    this.RangeY   = false; // Текущая строка переносится по Y из-за обтекания

    this.CurPos       = new CParagraphContentPos();

    this.NumberingPos = new CParagraphContentPos(); // Позиция элемента вместе с которым идет нумерация

    this.MoveToLBP    = false;                      // Делаем ли разрыв в позиции this.LineBreakPos
    this.LineBreakPos = new CParagraphContentPos(); // Последняя позиция в которой можно будет добавить разрыв
    // отрезка или строки, если что-то не умещается (например,
    // если у нас не убирается слово, то разрыв ставим перед ним)

    this.RunRecalcInfoLast  = null; // RecalcInfo последнего рана
    this.RunRecalcInfoBreak = null; // RecalcInfo рана, на котором произошел разрыв отрезка/строки

    this.BaseLineOffset = 0;

    this.RecalcResult = 0x00;//recalcresult_NextElement;

    this.RestartPageRecalcInfo =     // Информация о том, почему текущая страница параграфа пересчитывается заново
    {
        Line   : 0,           // Номер строки, начиная с которой надо пересчитать
        Object : null         // Объект, который вызвал пересчет
    };

    this.Footnotes                  = [];
	this.FootnotesRecalculateObject = null;

    // for ParaMath
    this.bMath_OneLine       = false;
    this.bMathWordLarge      = false;
    this.bEndRunToContent    = false;
    this.PosEndRun           = new CParagraphContentPos();

    // параметры, необходимые для расчета разбиения по операторам
    // у "крайних" в строке операторов/мат объектов сооответствующий Gap равен нулю
    this.OperGapRight        = 0;
    this.OperGapLeft         = 0;
    this.bPriorityOper       = true;  // есть ли в контенте операторы с высоким приоритетом разбиения
    this.WrapIndent          = 0;     // WrapIndent нужен для сравнения с длиной слова (когда слово разбивается по Compare Oper): ширина первой строки формулы не должна быть меньше WrapIndent
    this.bContainCompareOper = true;  // содержаться ли в текущем контенте операторы с высоким приоритетом
    this.MathFirstItem       = true;  // параметр необходим для принудительного переноса
    this.bFirstLine          = false;

    this.bNoOneBreakOperator = true;  // прежде чем обновлять позицию в контент Run, учтем были ли до этого break-операторы (проверки на Word == false не достаточно, т.к. формула мб инлайновая и тогда не нужно обновлять позицию)
    this.bForcedBreak        = false;
    this.bInsideOper         = false; // учитываем есть ли разбивка внутри мат объекта, чтобы случайно не вставить в конец пред оператора (при Brk_Before == false)
    this.bOnlyForcedBreak    = false; // учитывается, если возможна разбивка только по операторам выше уровням => в этом случае можно сделать принудительный разрыв во внутреннем контенте
    this.bBreakBox           = false;

    //-----------------------------//
    this.bFastRecalculate    = false;
    this.bBreakPosInLWord    = true; // обновляем LineBreakPos (Set_LineBreakPos) для WordLarge. Не обновляем для инлайновой формулы, перед формулой есть еще текст, чтобы не перебить LineBreakPos и выставить по тем меткам, которые были до формулы разбиение
    this.bContinueRecalc     = false;
    this.bMathRangeY         = false; // используется для переноса формулы под картинку
    this.MathNotInline       = null;
}

CParagraphRecalculateStateWrap.prototype =
{
    Reset_Page : function(Paragraph, CurPage)
    {
		this.Paragraph   = Paragraph;
		this.Parent      = Paragraph.Parent;
		this.TopDocument = Paragraph.Parent.Get_TopDocumentContent();
		this.PageAbs     = Paragraph.Get_AbsolutePage(CurPage);
		this.ColumnAbs   = Paragraph.Get_AbsoluteColumn(CurPage);
		this.InTable     = Paragraph.Parent.Is_TableCellContent();
        this.SectPr      = null;

		this.Page               = CurPage;
		this.RunRecalcInfoLast  = (0 === CurPage ? null : Paragraph.Pages[CurPage - 1].EndInfo.RunRecalcInfo);
		this.RunRecalcInfoBreak = this.RunRecalcInfoLast;
	},

    // Обнуляем некоторые параметры перед новой строкой
    Reset_Line : function()
    {
        this.RecalcResult        = recalcresult_NextLine;

        this.EmptyLine           = true;
        this.BreakPageLine       = false;
        this.End                 = false;
        this.UseFirstLine        = false;
        this.BreakRealPageLine   = false;
        this.BadLeftTab          = false;

        this.LineTextAscent      = 0;
        this.LineTextAscent2     = 0;
        this.LineTextDescent     = 0;
        this.LineAscent          = 0;
        this.LineDescent         = 0;

        this.NewPage             = false;
        this.ForceNewPage        = false;
        this.ForceNewLine        = false;

        this.bMath_OneLine       = false;
        this.bMathWordLarge      = false;
        this.bEndRunToContent    = false;
        this.PosEndRun           = new CParagraphContentPos();
        this.Footnotes           = [];

        this.OperGapRight        = 0;
        this.OperGapLeft         = 0;
        this.WrapIndent          = 0;
        this.MathFirstItem       = true;
        this.bContainCompareOper = true;
        this.bInsideOper         = false;
        this.bOnlyForcedBreak    = false;
        this.bBreakBox           = false;
        this.bNoOneBreakOperator = true;
        this.bFastRecalculate    = false;
        this.bForcedBreak        = false;
        this.bBreakPosInLWord    = true;

        this.MathNotInline      = null;
    },

    // Обнуляем некоторые параметры перед новым отрезком
    Reset_Range : function(X, XEnd)
    {
        this.LastTab.Reset();

        this.SpaceLen        = 0;
        this.WordLen         = 0;
        this.SpacesCount     = 0;
        this.Word            = false;
        this.FirstItemOnLine = true;
        this.StartWord       = false;
        this.NewRange        = false;
        this.X               = X;
        this.XEnd            = XEnd;
        this.XRange          = X;

        this.MoveToLBP    = false;
        this.LineBreakPos = new CParagraphContentPos();

        // for ParaMath
        this.bMath_OneLine    = false;
        this.bMathWordLarge   = false;
        this.bEndRunToContent = false;
        this.PosEndRun        = new CParagraphContentPos();

        this.OperGapRight        = 0;
        this.OperGapLeft         = 0;
        this.WrapIndent          = 0;
        this.bContainCompareOper = true;
        this.bInsideOper         = false;
        this.bOnlyForcedBreak    = false;
        this.bBreakBox           = false;
        this.bNoOneBreakOperator = true;
        this.bForcedBreak        = false;
        this.bFastRecalculate    = false;
        this.bBreakPosInLWord    = true;
    },

    Reset_RestartPageRecalcInfo : function()
    {
        this.RestartPageRecalcInfo.Line   = 0;
        this.RestartPageRecalcInfo.Object = null;
    },

    Set_RestartPageRecalcInfo : function(Line, Object)
    {
        this.RestartPageRecalcInfo.Line   = Line;
        this.RestartPageRecalcInfo.Object = Object;
    },

    Set_LineBreakPos : function(PosObj)
    {
        this.LineBreakPos.Set( this.CurPos );
        this.LineBreakPos.Add( PosObj );
    },

    Set_NumberingPos : function(PosObj, Item)
    {
        this.NumberingPos.Set( this.CurPos );
        this.NumberingPos.Add( PosObj );

        this.Paragraph.Numbering.Pos  = this.NumberingPos;
        this.Paragraph.Numbering.Item = Item;
    },

    Update_CurPos : function(PosObj, Depth)
    {
        this.CurPos.Update(PosObj, Depth);
    },

    Reset_Ranges : function()
    {
        this.Ranges      = [];
        this.RangesCount = 0;
    },

    Reset_RunRecalcInfo : function()
    {
        this.RunRecalcInfoBreak = this.RunRecalcInfoLast;
    },

    Reset_MathRecalcInfo: function()
    {
        this.bContinueRecalc = false;
    },

    Restore_RunRecalcInfo : function()
    {
        this.RunRecalcInfoLast = this.RunRecalcInfoBreak;
    },

    Recalculate_Numbering : function(Item, Run, ParaPr, _X)
    {
        var CurPage = this.Page, CurLine = this.Line, CurRange = this.Range;
        var Para = this.Paragraph;
        var X = _X, LineAscent = this.LineAscent;

        // Если нужно добавить нумерацию и на текущем элементе ее можно добавить, тогда добавляем её
        var NumberingItem = Para.Numbering;
        var NumberingType = Para.Numbering.Type;

        if ( para_Numbering === NumberingType )
        {
            var NumPr = ParaPr.NumPr;
            if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId || ( undefined !== Para.Get_SectionPr() && true === Para.IsEmpty() ) )
            {
                // Так мы обнуляем все рассчитанные ширины данного элемента
                NumberingItem.Measure( g_oTextMeasurer, undefined );
            }
            else
            {
                var Numbering = Para.Parent.Get_Numbering();
                var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                var NumSuff   = NumLvl.Suff;
                var NumJc     = NumLvl.Jc;
                var NumInfo   = Para.Parent.Internal_GetNumInfo( Para.Id, NumPr );
                var NumTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                NumTextPr.Merge( Para.TextPr.Value );
                NumTextPr.Merge( NumLvl.TextPr );


                // Здесь измеряется только ширина символов нумерации, без суффикса
                NumberingItem.Measure( g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr, Para.Get_Theme() );

                // При рассчете высоты строки, если у нас параграф со списком, то размер символа
                // в списке влияет только на высоту строки над Baseline, но не влияет на высоту строки
                // ниже baseline.
                if ( LineAscent < NumberingItem.Height )
                    LineAscent = NumberingItem.Height;

                switch ( NumJc )
                {
                    case AscCommon.align_Right:
                    {
                        NumberingItem.WidthVisible = 0;
                        break;
                    }
                    case AscCommon.align_Center:
                    {
                        NumberingItem.WidthVisible = NumberingItem.WidthNum / 2;
                        break;
                    }
                    case AscCommon.align_Left:
                    default:
                    {
                        NumberingItem.WidthVisible = NumberingItem.WidthNum;
                        break;
                    }
                }

                X += NumberingItem.WidthVisible;

                switch( NumSuff )
                {
                    case numbering_suff_Nothing:
                    {
                        // Ничего не делаем
                        break;
                    }
                    case numbering_suff_Space:
                    {
                        var OldTextPr = g_oTextMeasurer.GetTextPr();



                        var Theme = Para.Get_Theme();
                        g_oTextMeasurer.SetTextPr( NumTextPr, Theme );
                        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );
                        NumberingItem.WidthSuff = g_oTextMeasurer.Measure( " " ).Width;
                        g_oTextMeasurer.SetTextPr( OldTextPr, Theme );
                        break;
                    }
                    case numbering_suff_Tab:
                    {
                        var NewX = Para.private_RecalculateGetTabPos(X, ParaPr, CurPage, true).NewX;

                        NumberingItem.WidthSuff = NewX - X;

                        break;
                    }
                }

                NumberingItem.Width         = NumberingItem.WidthNum;
                NumberingItem.WidthVisible += NumberingItem.WidthSuff;

                X += NumberingItem.WidthSuff;
            }
        }
        else if ( para_PresentationNumbering === NumberingType )
        {
            var Level = Para.PresentationPr.Level;
            var Bullet = Para.PresentationPr.Bullet;

            var BulletNum = 0;
            if (Bullet.Get_Type() >= numbering_presentationnumfrmt_ArabicPeriod)
            {
                var Prev = Para.Prev;
                while (null != Prev && type_Paragraph === Prev.GetType())
                {
                    var PrevLevel = Prev.PresentationPr.Level;
                    var PrevBullet = Prev.Get_PresentationNumbering();

                    // Если предыдущий параграф более низкого уровня, тогда его не учитываем
                    if (Level < PrevLevel)
                    {
                        Prev = Prev.Prev;
                        continue;
                    }
                    else if (Level > PrevLevel)
                        break;
                    else if (PrevBullet.Get_Type() === Bullet.Get_Type() && PrevBullet.Get_StartAt() === PrevBullet.Get_StartAt())
                    {
                        if (true != Prev.IsEmpty())
                            BulletNum++;

                        Prev = Prev.Prev;
                    }
                    else
                        break;
                }
            }

            // Найдем настройки для первого текстового элемента
            var FirstTextPr = Para.Get_FirstTextPr();

            NumberingItem.Bullet = Bullet;
            NumberingItem.BulletNum = BulletNum + 1;
            NumberingItem.Measure(g_oTextMeasurer, FirstTextPr, Para.Get_Theme());


            if ( numbering_presentationnumfrmt_None != Bullet.Get_Type() )
            {
                if ( ParaPr.Ind.FirstLine < 0 )
                    NumberingItem.WidthVisible = Math.max( NumberingItem.Width, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X );
                else
                    NumberingItem.WidthVisible = Math.max( Para.X + ParaPr.Ind.Left + NumberingItem.Width - X, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X );
            }

            X += NumberingItem.WidthVisible;
        }

        // Заполним обратные данные в элементе нумерации
        NumberingItem.Item       = Item;
        NumberingItem.Run        = Run;
        NumberingItem.Line       = CurLine;
        NumberingItem.Range      = CurRange;
        NumberingItem.LineAscent = LineAscent;

        return X;
    }
};
CParagraphRecalculateStateWrap.prototype.AddFootnoteReference = function(oFootnoteReference, oPos)
{
	// Ссылки могут добавляться несколько раз, если строка разбита на несколько отрезков
	for (var nIndex = 0, nCount = this.Footnotes.length; nIndex < nCount; ++nIndex)
	{
		if (this.Footnotes[nIndex].FootnoteReference === oFootnoteReference)
			return;
	}

	this.Footnotes.push({FootnoteReference : oFootnoteReference, Pos : oPos});
};
CParagraphRecalculateStateWrap.prototype.GetFootnoteReferencesCount = function(oFootnoteReference, isAllowCustom)
{
	var _isAllowCustom = (true === isAllowCustom ? true : false);

	// Если данную ссылку мы добавляли уже в строке, тогда ищем сколько было элементов до нее, если не добавляли,
	// тогда возвращаем просто количество ссылок. Ссылки с флагом CustomMarkFollows не учитываются

	var nRefsCount = 0;
	for (var nIndex = 0, nCount = this.Footnotes.length; nIndex < nCount; ++nIndex)
	{
		if (this.Footnotes[nIndex].FootnoteReference === oFootnoteReference)
			return nRefsCount;

		if (true === _isAllowCustom || true !== this.Footnotes[nIndex].FootnoteReference.IsCustomMarkFollows())
			nRefsCount++;
	}

	return nRefsCount;
};
CParagraphRecalculateStateWrap.prototype.SetFast = function(bValue)
{
	this.Fast = bValue;
};
CParagraphRecalculateStateWrap.prototype.IsFastRecalculate = function()
{
	return this.Fast;
};
CParagraphRecalculateStateWrap.prototype.GetPageAbs = function()
{
	return this.PageAbs;
};
CParagraphRecalculateStateWrap.prototype.GetColumnAbs = function()
{
	return this.ColumnAbs;
};
CParagraphRecalculateStateWrap.prototype.GetCurrentContentPos = function(nPos)
{
	var oContentPos = this.CurPos.Copy();
	oContentPos.Set(this.CurPos);
	oContentPos.Add(nPos);
	return oContentPos;
};
CParagraphRecalculateStateWrap.prototype.SaveFootnotesInfo = function()
{
	var oTopDocument = this.TopDocument;
	if (oTopDocument instanceof CDocument)
		this.FootnotesRecalculateObject = oTopDocument.Footnotes.SaveRecalculateObject(this.PageAbs, this.ColumnAbs);
};
CParagraphRecalculateStateWrap.prototype.LoadFootnotesInfo = function()
{
	var oTopDocument = this.TopDocument;
	if (oTopDocument instanceof CDocument && this.FootnotesRecalculateObject)
		oTopDocument.Footnotes.LoadRecalculateObject(this.PageAbs, this.ColumnAbs, this.FootnotesRecalculateObject);
};
CParagraphRecalculateStateWrap.prototype.IsInTable = function()
{
	return this.InTable;
};
CParagraphRecalculateStateWrap.prototype.GetSectPr = function()
{
	if (null === this.SectPr && this.Paragraph)
		this.SectPr = this.Paragraph.Get_SectPr();

	return this.SectPr;
};

function CParagraphRecalculateStateCounter()
{
    this.Paragraph   = undefined;
    this.Range       = undefined;
    this.Word        = false;
    this.SpaceLen    = 0;
    this.SpacesCount = 0;

    this.Words       = 0;
    this.Spaces      = 0;
    this.Letters     = 0;
    this.SpacesSkip  = 0;
    this.LettersSkip = 0;
}

CParagraphRecalculateStateCounter.prototype =
{
    Reset : function(Paragraph, Range)
    {
        this.Paragraph   = Paragraph;
        this.Range       = Range;
        this.Word        = false;
        this.SpaceLen    = 0;
        this.SpacesCount = 0;

        this.Words       = 0;
        this.Spaces      = 0;
        this.Letters     = 0;
        this.SpacesSkip  = 0;
        this.LettersSkip = 0;
    }
};

function CParagraphRecalculateStateAlign()
{
    this.X             = 0; // Текущая позиция по горизонтали
    this.Y             = 0; // Текущая позиция по вертикали
    this.XEnd          = 0; // Предельная позиция по горизонтали
    this.JustifyWord   = 0; // Добавочная ширина символов
    this.JustifySpace  = 0; // Добавочная ширина пробелов
    this.SpacesCounter = 0; // Счетчик пробелов с добавочной шириной (чтобы пробелы в конце строки не трогать)
    this.SpacesSkip    = 0; // Количество пробелов, которые мы пропускаем в начале строки
    this.LettersSkip   = 0; // Количество букв, которые мы пропускаем (из-за таба)
    this.LastW         = 0; // Ширина последнего элемента (необходимо для позиционирования картинки)
    this.Paragraph     = undefined;
    this.RecalcResult  = 0x00;//recalcresult_NextElement;

    this.Y0            = 0; // Верхняя граница строки
    this.Y1            = 0; // Нижняя граница строки

    this.CurPage       = 0;
    this.PageY         = 0;
    this.PageX         = 0;

    this.RecalcFast    = false; // Если пересчет быстрый, тогда все "плавающие" объекты мы не трогаем
    this.RecalcFast2   = false; // Второй вариант быстрого пересчета
}

function CParagraphRecalculateStateInfo()
{
    this.Comments = [];
}

CParagraphRecalculateStateInfo.prototype =
{
    Reset : function(PrevInfo)
    {
        if ( null !== PrevInfo && undefined !== PrevInfo )
        {
            this.Comments = PrevInfo.Comments;
        }
        else
        {
            this.Comments = [];
        }
    },

    Add_Comment : function(Id)
    {
        this.Comments.push( Id );
    },

    Remove_Comment : function(Id)
    {
        var CommentsLen = this.Comments.length;
        for (var CurPos = 0; CurPos < CommentsLen; CurPos++)
        {
            if ( this.Comments[CurPos] === Id )
            {
                this.Comments.splice( CurPos, 1 );
                break;
            }
        }
    }
};

function CParagraphRecalculateObject()
{
    this.X      = 0;
    this.Y      = 0;
    this.XLimit = 0;
    this.YLimit = 0;

    this.Pages   = [];
    this.Lines   = [];
    this.Content = [];
}

CParagraphRecalculateObject.prototype =
{
    Save : function(Para)
    {
        this.X      = Para.X;
        this.Y      = Para.Y;
        this.XLimit = Para.XLimit;
        this.YLimit = Para.YLimit;

        this.Pages  = Para.Pages;
        this.Lines  = Para.Lines;

        var Content = Para.Content;
        var Count = Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index] = Content[Index].Save_RecalculateObject();
        }
    },

    Load : function(Para)
    {
        Para.X      = this.X;
        Para.Y      = this.Y;
        Para.XLimit = this.XLimit;
        Para.YLimit = this.YLimit;

        Para.Pages = this.Pages;
        Para.Lines = this.Lines;

        var Count = Para.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            Para.Content[Index].Load_RecalculateObject(this.Content[Index], Para);
        }
    },

    Get_DrawingFlowPos : function(FlowPos)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Get_DrawingFlowPos( FlowPos );
        }
    }
};