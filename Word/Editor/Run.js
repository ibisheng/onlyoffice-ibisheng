/**
 * User: Ilja.Kirillov
 * Date: 03.12.13
 * Time: 18:28
 */

function ParaRun(Document,Parent)
{
    this.Id         = g_oIdCounter.Get_NewId();  // Id данного элемента
    this.Type       = para_Run;                  // тип данного элемента
    this.Document   = Document;                  // Ссылка на верхний класс документа
    this.Parent     = Parent;                    // Ссылка на родительский класс
    this.Paragraph  = Parent;                    // Ссылка на параграф
    this.Pr         = new CTextPr();             // Текстовые настройки данного run
    this.Content    = new Array();               // Содержимое данного run
    this.State      = new CParaRunState();       // Положение курсора и селекта в данного run
    this.CompiledPr = new CTextPr();             // Скомпилированные настройки
    this.RecalcInfo = new CParaRunRecalcInfo();  // Флаги для пересчета (там же флаг пересчета стиля)

    this.TextAscent  = 0; // текстовый ascent + linegap
    this.TextDescent = 0; // текстовый descent
    this.TextHeight  = 0; // высота текста
    this.TextAscent2 = 0; // текстовый ascent
    this.Ascent      = 0; // общий ascent
    this.Descent     = 0; // общий descent
    this.YOffset     = 0; // смещение по Y

    this.NeedAddNumbering = false;  // Нужно ли добавлять нумерацию (true - нужно, false - не нужно, первый элемент,
                                    // у которого будет false и будет элемент с нумерацией)

    this.Lines       = []; // Массив CParaRunLine
    this.Lines[0]    = new CParaRunLine();
    this.LinesLength = 0;

    this.Range = this.Lines[0].Ranges[0];

    this.StartLine   = 0; // Строка, с которой начинается данный ран
    this.StartRange  = 0;

    this.CollaborativeMarks = new Array(); // Массив CParaRunCollaborativeMark

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaRun.prototype =
{
//-----------------------------------------------------------------------------------
// Функции для работы с Id
//-----------------------------------------------------------------------------------
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Set_Parent : function(Paragraph)
    {
        this.Parent = Paragraph;
    },

    Get_Parent : function()
    {
        return this.Parent;
    },

    Get_Paragraph : function()
    {
        return this.Parent;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с содержимым данного рана
//-----------------------------------------------------------------------------------

    // Проверяем пустой ли ран
    Is_Empty : function(SkipAnchor)
    {
        var Count = this.Content.length;

        if ( true !== SkipAnchor )
        {
            if ( Count > 0 )
                return false;
            else
                return true;
        }
        else
        {
            for ( var CurPos = 0; CurPos < this.Content.length; CurPos++ )
            {
                var Item = this.Content[CurPos];

                if ( para_Drawing !== Item.Type || false !== Item.Is_Inline()  )
                    return false;
            }

            return true;
        }
    },

    // Начинается ли данный ран с новой строки
    Is_StartFromNewLine : function()
    {
        if ( this.LinesLength < 2 || 0 != this.Lines[1].Ranges[0].StartPos )
            return false;

        return true;
    },

    // Добавляем элемент в текущую позицию
    Add : function(Item)
    {
        this.Add_ToContent( this.State.ContentPos, Item, true );
    },

    // Добавляем элемент в позицию с сохранием в историю
    Add_ToContent : function(Pos, Item, UpdatePosition)
    {
        History.Add( this, { Type : historyitem_Run_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
        this.Content.splice( Pos, 0, Item );

        if ( true === UpdatePosition )
        {
            // Обновляем текущую позицию
            if ( this.State.ContentPos >= Pos )
                this.State.ContentPos++;

            // Обновляем начало и конец селекта
            if ( true === this.State.Selection.Use )
            {
                if ( this.State.Selection.StartPos >= Pos )
                    this.State.Selection.StartPos++;

                if ( this.State.Selection.EndPos >= Pos )
                    this.State.Selection.EndPos++;
            }

            // Также передвинем всем метки переносов страниц и строк
            var LinesCount = this.Lines.length;
            for ( var CurLine = 0; CurLine < LinesCount; CurLine++ )
            {
                var RangesCount = this.Lines[CurLine].RangesLength;

                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var Range = this.Lines[CurLine].Ranges[CurRange];

                    if ( Range.StartPos > Pos )
                        Range.StartPos++;

                    if ( Range.EndPos > Pos )
                        Range.EndPos++;
                }
            }

            // TODO: Поиск, NearPos, SpellCheck

//            for ( var CurSearch in this.SearchResults )
//            {
//                if ( this.SearchResults[CurSearch].StartPos >= Pos )
//                    this.SearchResults[CurSearch].StartPos++;
//
//                if ( this.SearchResults[CurSearch].EndPos >= Pos )
//                    this.SearchResults[CurSearch].EndPos++;
//            }
//
//            for ( var Id in this.NearPosArray )
//            {
//                var NearPos = this.NearPosArray[Id];
//                if ( NearPos.ContentPos >= Pos )
//                    NearPos.ContentPos++;
//            }
//
//            this.SpellChecker.Update_OnAdd( this, Pos, Item );
        }

        // Отмечаем, что надо перемерить элементы в данном ране
        this.RecalcInfo.Measure = true;
    },

    Remove_FromContent : function(Pos, Count, UpdatePosition)
    {
        // Получим массив удаляемых элементов
        var DeletedItems = this.Content.slice( Pos, Pos + Count );
        History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

        this.Content.splice( Pos, Count );

        if ( true === UpdatePosition )
        {
            // Обновим текущую позицию
            if ( this.State.ContentPos > Pos + Count )
                this.State.ContentPos -= Count;
            else if ( this.State.ContentPos > Pos )
                this.State.ContentPos = Pos;

            // Обновим начало и конец селекта
            if ( true === this.Selection.Use )
            {
                if ( this.State.Selection.StartPos <= this.State.Selection.EndPos )
                {
                    if ( this.State.Selection.StartPos > Pos + Count )
                        this.State.Selection.StartPos -= Count;
                    else if ( this.State.Selection.StartPos > Pos )
                        this.State.Selection.StartPos = Pos;

                    if ( this.State.Selection.EndPos >= Pos + Count )
                        this.State.Selection.EndPos -= Count;
                    else if ( this.State.Selection.EndPos > Pos )
                        this.State.Selection.EndPos = Math.max( 0, Pos - 1 );
                }
                else
                {
                    if ( this.State.Selection.StartPos >= Pos + Count )
                        this.State.Selection.StartPos -= Count;
                    else if ( this.State.Selection.StartPos > Pos )
                        this.State.Selection.StartPos = Math.max( 0, Pos - 1 );

                    if ( this.State.Selection.EndPos > Pos + Count )
                        this.State.Selection.EndPos -= Count;
                    else if ( this.State.Selection.EndPos > Pos )
                        this.State.Selection.EndPos = Pos;
                }
            }


            // Также передвинем всем метки переносов страниц и строк
            var LinesCount = this.Lines.length;
            for ( var CurLine = 0; CurLine < LinesCount; CurLine++ )
            {
                var RangesCount = this.Lines[CurLine].RangesLength;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var Range = this.Lines[CurLine].Ranges[CurRange];

                    if ( Range.StartPos > Pos + Count )
                        Range.StartPos -= Count;
                    else if ( Range.StartPos > Pos )
                        Range.StartPos = Math.max( 0 , Pos );

                    if ( Range.EndPos >= Pos + Count )
                        Range.EndPos -= Count;
                    else if ( Range.EndPos >= Pos )
                        Range.EndPos = Math.max( 0 , Pos );
                }
            }

            // TODO: Поиск, NearPos, Spelling

//            for ( var Id in this.NearPosArray )
//            {
//                var NearPos = this.NearPosArray[Id];
//
//                if ( NearPos.ContentPos > Pos + Count )
//                    NearPos.ContentPos -= Count;
//                else if ( NearPos.ContentPos > Pos )
//                    NearPos.ContentPos = Math.max( 0 , Pos );
//            }
//
//            // Передвинем все метки слов для проверки орфографии
//            this.SpellChecker.Update_OnRemove( this, Pos, Count );
        }

        // Отмечаем, что надо перемерить элементы в данном ране
        this.RecalcInfo.Measure = true;
    },

    // Определим строку и отрезок текущей позиции
    Get_CurrentParaPos : function()
    {
        var Pos = this.State.ContentPos;

        var CurLine  = 0;
        var CurRange = 0;

        var LinesCount = this.LinesLength;
        for ( ; CurLine < LinesCount; CurLine++ )
        {
            var RangesCount = this.Lines[CurLine].RangesLength;
            for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Lines[CurLine].Ranges[CurRange];
                if ( Pos < Range.EndPos && Pos >= Range.StartPos )
                    return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
            }
        }

        return new CParaPos( ( LinesCount === 1 ? this.Lines[0].RangesLength - 1 + this.StartRange : this.Lines[0].RangesLength - 1 ), LinesCount - 1 + this.StartLine, 0, 0 );
    },

    Get_ParaPosByContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        var CurLine  = 0;
        var CurRange = 0;

        var LinesCount = this.LinesLength;
        for ( ; CurLine < LinesCount; CurLine++ )
        {
            var RangesCount = this.Lines[CurLine].RangesLength;
            for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Lines[CurLine].Ranges[CurRange];
                if ( Pos < Range.EndPos && Pos >= Range.StartPos )
                    return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
            }
        }

        return new CParaPos( ( LinesCount === 1 ? this.Lines[0].RangesLength - 1 + this.StartRange : this.Lines[0].RangesLength - 1 ), LinesCount - 1 + this.StartLine, 0, 0 );
    },

    Recalculate_CurPos : function(X, Y, CurrentRun, _CurRange, _CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        var Para = this.Paragraph;
        var NumberingItem = Para.Numbering.Item;

        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        var Pos = StartPos;
        var _EndPos = ( true === CurrentRun ? Math.min( EndPos, this.State.ContentPos ) : EndPos );
        for ( ; Pos < _EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( true === this.RecalcInfo.NumberingUse && Item === NumberingItem )
                X += Para.Numbering.WidthVisible;

            switch( Item.Type )
            {
                case para_Text:
                case para_Space:
                case para_Sym:
                case para_PageNum:
                case para_Tab:
                case para_End:
                case para_NewLine:
                {
                    X += Item.WidthVisible;
                    break;
                }
                case para_Drawing:
                {
                    if ( drawing_Inline != Item.DrawingType )
                        break;

                    X += Item.WidthVisible;
                    break;
                }
            }
        }

        // Если следующий элемент именно тот, к которому привязана нумерация, тогда добавляем сдвиг нумерации
        if ( true === this.RecalcInfo.NumberingUse && _EndPos < this.Content.length && this.Content[_EndPos] === NumberingItem )
            X += Para.Numbering.WidthVisible;

        if ( true === CurrentRun && Pos === this.State.ContentPos )
        {
            if ( true === UpdateCurPos )
            {
                // Обновляем позицию курсора в параграфе

                Para.CurPos.X        = X;
                Para.CurPos.Y        = Y;
                Para.CurPos.PagesPos = CurPage;

                if ( true === UpdateTarget )
                {
                    var CurTextPr = this.Get_CompiledPr(false);
                    g_oTextMeasurer.SetTextPr( CurTextPr );
                    g_oTextMeasurer.SetFontSlot( fontslot_ASCII, CurTextPr.Get_FontKoef() );
                    var Height    = g_oTextMeasurer.GetHeight();
                    var Descender = Math.abs( g_oTextMeasurer.GetDescender() );
                    var Ascender  = Height - Descender;

                    Para.DrawingDocument.SetTargetSize( Height );

                    if ( true === CurTextPr.Color.Auto )
                    {
                        // Выясним какая заливка у нашего текста
                        var Pr = Para.Get_CompiledPr();
                        var BgColor = undefined;
                        if ( undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value )
                        {
                            BgColor = Pr.ParaPr.Shd.Color;
                        }
                        else
                        {
                            // Нам надо выяснить заливку у родительского класса (возможно мы находимся в ячейке таблицы с забивкой)
                            BgColor = Para.Parent.Get_TextBackGroundColor();
                        }

                        // Определим автоцвет относительно заливки
                        var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );
                        Para.DrawingDocument.SetTargetColor( AutoColor.r, AutoColor.g, AutoColor.b );
                    }
                    else
                        Para.DrawingDocument.SetTargetColor( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b );

                    var TargetY = Y - Ascender - CurTextPr.Position;
                    switch( CurTextPr.VertAlign )
                    {
                        case vertalign_SubScript:
                        {
                            TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                            break;
                        }
                        case vertalign_SuperScript:
                        {
                            TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                            break;
                        }
                    }

                    var Page_Abs = Para.Get_StartPage_Absolute() + CurPage;
                    Para.DrawingDocument.UpdateTarget( X, TargetY, Page_Abs );

                    // TODO: Тут делаем, чтобы курсор не выходил за границы буквицы. На самом деле, надо делать, чтобы
                    //       курсор не выходил за границы строки, но для этого надо делать обрезку по строкам, а без нее
                    //       такой вариант будет смотреться плохо.
                    if ( undefined != Para.Get_FramePr() )
                    {
                        var __Y0 = TargetY, __Y1 = TargetY + Height;
                        var ___Y0 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Top;
                        var ___Y1 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Bottom;

                        var __Y0 = Math.max( __Y0, ___Y0 );
                        var __Y1 = Math.min( __Y1, ___Y1 );

                        Para.DrawingDocument.SetTargetSize( __Y1 - __Y0 );
                        Para.DrawingDocument.UpdateTarget( X, __Y0, Page_Abs );
                    }
                }
            }

            if ( true === ReturnTarget )
            {
                var CurTextPr = this.Get_CompiledPr(false);
                g_oTextMeasurer.SetTextPr( CurTextPr );
                g_oTextMeasurer.SetFontSlot( fontslot_ASCII, CurTextPr.Get_FontKoef() );
                var Height    = g_oTextMeasurer.GetHeight();
                var Descender = Math.abs( g_oTextMeasurer.GetDescender() );
                var Ascender  = Height - Descender;

                var TargetY = Y - Ascender - CurTextPr.Position;

                switch( CurTextPr.VertAlign )
                {
                    case vertalign_SubScript:
                    {
                        TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                        break;
                    }
                    case vertalign_SuperScript:
                    {
                        TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                        break;
                    }
                }

                return { X : X, Y : TargetY, Height : Height, Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
            }
            else
                return { X : X, Y : Y, PageNum : CurPage + Para.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
        }

        return { X : X };
    },

    // Проверяем, произошло ли простейшее изменение (набор или удаление текста)
    Is_SimpleChanges : function(Changes)
    {
        if ( Changes.length !== 1 )
            return false;

        var Type = Changes[0].Data.Type;
        if ( historyitem_Run_AddItem === Type || historyitem_Run_RemoveItem === Type )
            return true;

        return false;
    },

    // Возвращаем строку и отрезок, в котором произошли простейшие изменения
    Get_SimpleChanges_ParaPos : function(Changes)
    {
        var Change = Changes[0].Data;
        var Pos    = ( Changes[0].Data.Type === historyitem_Run_AddItem ? Change.Pos : Change.StartPos );

        var CurLine  = 0;
        var CurRange = 0;

        var LinesCount = this.LinesLength;
        for ( ; CurLine < LinesCount; CurLine++ )
        {
            var RangesCount = this.Lines[CurLine].RangesLength;
            for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Lines[CurLine].Ranges[CurRange];
                if ( Pos < Range.EndPos && Pos >= Range.StartPos )
                    return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
            }
        }

        return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    // Выставляем начальную строку и обнуляем массив строк
    Recalculate_Reset : function(StartLine, RecalcInfo)
    {
        this.StartLine   = StartLine;
        this.LinesLength = 0;

        if ( null === RecalcInfo )
            this.RecalcInfo.NumberingAdd = true;
        else
        {
            this.RecalcInfo.NumberingAdd = RecalcInfo.NumberingAdd;
        }

        this.RecalcInfo.NumberingUse  = false;
        this.RecalcInfo.NumberingItem = null;
    },

    // Пересчитываем размеры всех элементов
    Recalculate_MeasureContent : function()
    {
        if ( false === this.RecalcInfo.Measure )
            return;

        var Pr = this.Get_CompiledPr(false);
        g_oTextMeasurer.SetTextPr( Pr );
        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

        // Запрашиваем текущие метрики шрифта, под TextAscent мы будем понимать ascent + linegap(которые записаны в шрифте)
        this.TextHeight  = g_oTextMeasurer.GetHeight();
        this.TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
        this.TextAscent  = this.TextHeight - this.TextDescent;
        this.TextAscent2 = g_oTextMeasurer.GetAscender();
        this.YOffset     = Pr.Position;

        var ContentLength = this.Content.length;

        for ( var Pos = 0; Pos < ContentLength; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( para_Drawing === Item.Type )
            {
                Item.Parent          = this;
                Item.DocumentContent = this.Parent.Parent;
                Item.DrawingDocument = this.Parent.Parent.DrawingDocument;
            }

            Item.Measure( g_oTextMeasurer, Pr );
        }

        this.RecalcInfo.Recalc  = true;
        this.RecalcInfo.Measure = false;
    },

    Recalculate_Range : function( ParaPr)
    {
        // Сначала измеряем элементы (можно вызывать каждый раз, внутри разруливается, чтобы измерялось 1 раз)
        this.Recalculate_MeasureContent();

        var PRS = g_oPRSW;

        var CurLine  = PRS.Line - this.StartLine;

        if ( 0 !== CurLine )
        {
            this.Lines[CurLine] = new CParaRunLine();
            this.LinesLength    = CurLine + 1;
        }
        else
        {
            this.LinesLength  = CurLine + 1;
        }

        var Para = PRS.Paragraph;

        var RangeStartPos = 0;
        var RangeEndPos   = -1;

        // Вычислим RangeStartPos
        var CurRange = PRS.Range;

        if ( 0 === CurLine )
        {
            if ( 0 !== CurRange )
            {
                RangeStartPos = this.Lines[0].Ranges[CurRange - 1].EndPos;
            }
            else
            {
                RangeStartPos = 0;
            }
        }
        else if ( 0 === CurRange )
        {
            var _Line = this.Lines[CurLine - 1];
            RangeStartPos = _Line.Ranges[_Line.Ranges.length - 1].EndPos;
        }
        else
        {
            var _Line = this.Lines[CurLine];
            RangeStartPos = Line.Ranges[CurRange - 1].EndPos;
        }

        var MoveToLBP       = PRS.MoveToLBP;
        var NewRange        = PRS.NewRange;
        var ForceNewPage    = PRS.ForceNewPage;
        var NewPage         = PRS.NewPage;
        var BreakPageLine   = PRS.BreakPageLine;
        var End             = PRS.End;

        var Word            = PRS.Word;
        var StartWord       = PRS.StartWord;
        var FirstItemOnLine = PRS.FirstItemOnLine;
        var EmptyLine       = PRS.EmptyLine;

        var RangesCount     = PRS.RangesCount;

        var SpaceLen        = PRS.SpaceLen;
        var WordLen         = PRS.WordLen;

        var X               = PRS.X;
        var XEnd            = PRS.XEnd;

        var ParaLine        = PRS.Line;
        var ParaRange       = PRS.Range;

        var LineRule = ParaPr.Spacing.LineRule;

        var Pos = RangeStartPos;

        var UpdateLineMetricsText = false;
        var ContentLen = this.Content.length;
        for ( ; Pos < ContentLen; Pos++ )
        {
            if ( false === StartWord && true === FirstItemOnLine && Math.abs( XEnd - X ) < 0.001 && RangesCount > 0 )
            {
                NewRange    = true;
                RangeEndPos = Pos;
                break;
            }

            var Item     = this.Content[Pos];
            var ItemType = Item.Type;

            // Проверяем, не нужно ли добавить нумерацию к данному элементу
            if ( true === this.RecalcInfo.NumberingAdd && true === Item.Can_AddNumbering() )
            {
                var TempRes = this.Internal_Recalculate_Numbering( Item, PRS.Paragraph, ParaPr, X, PRS.LineAscent, PRS.Page, PRS.Line, PRS.Range );

                X              = TempRes.X;
                PRS.LineAscent = TempRes.LineAscent;
            }

            switch( Item.Type )
            {
                case para_Sym:
                case para_Text:
                {
                    // Отмечаем, что началось слово
                    StartWord = true;

                    UpdateLineMetricsText = true;

                    // При проверке, убирается ли слово, мы должны учитывать ширину предшествующих пробелов.
                    var LetterLen = Item.Width;
                    if ( true !== Word )
                    {
                        // Слово только началось. Делаем следующее:
                        // 1) Если до него на строке ничего не было и данная строка не
                        //    имеет разрывов, тогда не надо проверять убирается ли слово в строке.
                        // 2) В противном случае, проверяем убирается ли слово в промежутке.

                        // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
                        if ( true !== FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange) )
                        {
                            if ( X + SpaceLen + LetterLen > XEnd )
                            {
                                NewRange    = true;
                                RangeEndPos = Pos;
                            }
                        }

                        if ( true !== NewRange )
                        {
                            // Отмечаем начало нового слова
                            PRS.Set_LineBreakPos( Pos );
                            WordLen = Item.Width;
                            Word    = true;
                        }
                    }
                    else
                    {
                        if ( X + SpaceLen + WordLen + LetterLen > XEnd )
                        {
                            if ( true === FirstItemOnLine )
                            {
                                // Слово оказалось единственным элементом в промежутке, и, все равно,
                                // не умещается целиком. Делаем следующее:
                                //
                                // 1) Если у нас строка без вырезов, тогда ставим перенос строки на
                                //    текущей позиции.
                                // 2) Если у нас строка с вырезом, и данный вырез не последний, тогда
                                //    ставим перенос внутри строки в начале слова.
                                // 3) Если у нас строка с вырезом и вырез последний, тогда ставим перенос
                                //    строки в начале слова.

                                if ( false === Para.Internal_Check_Ranges(ParaLine, ParaRange)  )
                                {
                                    // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                    MoveToLBP = true;
                                    NewRange  = true;
                                }
                                else
                                {
                                    EmptyLine   = false;
                                    X          += WordLen;

                                    // Слово не убирается в отрезке, но, поскольку, слово 1 на строке и отрезок тоже 1,
                                    // делим слово в данном месте
                                    NewRange    = true;
                                    RangeEndPos = Pos;
                                }
                            }
                            else
                            {
                                // Слово не убирается в отрезке. Переносим слово в следующий отрезок
                                MoveToLBP = true;
                                NewRange  = true;
                            }
                        }

                        if ( true !== NewRange )
                        {
                            // Мы убираемся в пределах данной строки. Прибавляем ширину буквы к ширине слова
                            WordLen += LetterLen;

                            // Если текущий символ с переносом, например, дефис, тогда на нем заканчивается слово
                            if ( true === Item.SpaceAfter )
                            {
                                // Добавляем длину пробелов до слова и ширину самого слова.
                                X += SpaceLen + WordLen;

                                Word            = false;
                                FirstItemOnLine = false;
                                EmptyLine       = false;
                                SpaceLen        = 0;
                                WordLen         = 0;
                                //SpacesCount     = 0;
                            }
                        }
                    }

                    break;
                }
                case para_Space:
                {
                    FirstItemOnLine = false;

                    if ( true === Word )
                    {
                        // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                        // убирается ли слово, мы это проверяем при добавленнии букв.
                        X += SpaceLen + WordLen;

                        Word        = false;
                        EmptyLine   = false;
                        SpaceLen    = 0;
                        WordLen     = 0;
                        //SpacesCount = 1;
                    }
                    //else
                    //    SpacesCount++;

                    // На пробеле не делаем перенос. Перенос строки или внутристрочный
                    // перенос делаем при добавлении любого непробельного символа
                    SpaceLen += Item.Width;

                    break;
                }
                case para_Drawing:
                {
                    if ( true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape() )
                    {
                        if ( true !== Item.Is_Inline() )
                            Item.Set_DrawingType( drawing_Inline );

                        if ( true === StartWord )
                            FirstItemOnLine = false;

                        // Если до этого было слово, тогда не надо проверять убирается ли оно, но если стояли пробелы,
                        // тогда мы их учитываем при проверке убирается ли данный элемент, и добавляем только если
                        // данный элемент убирается
                        if ( true === Word || WordLen > 0 )
                        {
                            // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                            // убирается ли слово, мы это проверяем при добавленнии букв.
                            X += SpaceLen + WordLen;

                            Word        = false;
                            EmptyLine   = false;
                            SpaceLen    = 0;
                            WordLen     = 0;
                            //SpacesCount = 0;
                        }

                        if ( X + SpaceLen + Item.Width > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges( ParaLine, ParaRange ) ) )
                        {
                            // Автофигура не убирается, ставим перенос перед ней
                            NewRange    = true;
                            RangeEndPos = Pos;
                        }
                        else
                        {
                            // Обновим метрики строки
                            if ( linerule_Exact === ParaPr.Spacing.LineRule )
                            {
                                if ( PRS.LineAscent < Item.Height )
                                    PRS.LineAscent = Item.Height;
                            }
                            else
                            {
                                if ( PRS.LineAscent < Item.Height + this.YOffset )
                                    PRS.LineAscent = Item.Height + this.YOffset;

                                if ( PRS.LineDescent < -this.YOffset )
                                    PRS.LineDescent = -this.YOffset;
                            }

                            // Добавляем длину пробелов до автофигуры
                            X += SpaceLen + Item.Width;

                            FirstItemOnLine = false;
                            EmptyLine       = false;
                        }

                        SpaceLen    = 0;
                        //SpacesCount = 0;
                    }
                    else
                    {
                        // TODO: переделать здесь
                        Para.Internal_Recalculate_1_AnchorDrawing();

                        // Основная обработка происходит в Recalculate_Range_Spaces. Здесь обрабатывается единственный случай,
                        // когда после второго пересчета с уже добавленной картинкой оказывается, что место в параграфе, где
                        // идет картинка ушло на следующую страницу. В этом случае мы ставим перенос страницы перед картинкой.

                        var LogicDocument  = Para.Parent;
                        var LDRecalcInfo   = LogicDocument.RecalcInfo;
                        var DrawingObjects = LogicDocument.DrawingObjects;
                        var CurPage        = PRS.Page;

                        if ( true === LDRecalcInfo.Check_FlowObject(Item) && true === LDRecalcInfo.Is_PageBreakBefore() )
                        {
                            LDRecalcInfo.Reset();

                            // Добавляем разрыв страницы. Если это первая страница, тогда ставим разрыв страницы в начале параграфа,
                            // если нет, тогда в начале текущей строки.

                            if ( null != this.Get_DocumentPrev() && true != Para.Parent.Is_TableCellContent() && 0 === CurPage )
                            {
                                // TODO: Переделать
//                                // Мы должны из соответствующих FlowObjects удалить все Flow-объекты, идущие до этого места в параграфе
//                                for ( var TempPos = StartPos; TempPos < Pos; TempPos++ )
//                                {
//                                    var TempItem = this.Content[TempPos];
//                                    if ( para_Drawing === TempItem.Type && drawing_Anchor === TempItem.DrawingType && true === TempItem.Use_TextWrap() )
//                                    {
//                                        DrawingObjects.removeById( TempItem.PageNum, TempItem.Get_Id() );
//                                    }
//                                }

                                Para.Pages[CurPage].Set_EndLine( -1 );
                                if ( 0 === CurLine )
                                {
                                    Para.Lines[-1] = new CParaLine(0);
                                    Para.Lines[-1].Set_EndPos( -1 );
                                }

                                PRS.RecalcResult = recalcresult_NextPage;
                                return;
                            }
                            else
                            {
                                if ( ParaLine != Para.Pages[CurPage].FirstLine )
                                {
                                    this.Pages[CurPage].Set_EndLine( ParaLine - 1 );
                                    if ( 0 === ParaLine )
                                    {
                                        this.Lines[-1] = new CParaLine(0);
                                        this.Lines[-1].Set_EndPos( -1 );
                                    }

                                    PRS.RecalcResult = recalcresult_NextPage;
                                    return;
                                }
                                else
                                {
                                    RangeEndPos = Pos;
                                    NewRange     = true;
                                    ForceNewPage = true;
                                }
                            }


                            // Если до этого было слово, тогда не надо проверять убирается ли оно
                            if ( true === Word || WordLen > 0 )
                            {
                                // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                                // убирается ли слово, мы это проверяем при добавленнии букв.
                                X += SpaceLen + WordLen;

                                Word        = false;
                                SpaceLen    = 0;
                                WordLen     = 0;
                                //SpacesCount = 0;
                            }
                        }
                    }

                    break;
                }
                case para_PageNum:
                {
                    // Если до этого было слово, тогда не надо проверять убирается ли оно, но если стояли пробелы,
                    // тогда мы их учитываем при проверке убирается ли данный элемент, и добавляем только если
                    // данный элемент убирается
                    if ( true === Word || WordLen > 0 )
                    {
                        // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                        // убирается ли слово, мы это проверяем при добавленнии букв.
                        X += SpaceLen + WordLen;

                        Word        = false;
                        EmptyLine   = false;
                        SpaceLen    = 0;
                        WordLen     = 0;
                        //SpacesCount = 0;
                    }

                    // Если на строке начиналось какое-то слово, тогда данная строка уже не пустая
                    if ( true === StartWord )
                        FirstItemOnLine = false;

                    UpdateLineMetricsText = true;

                    if ( X + SpaceLen + Item.Width > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges( ParaLine, ParaRange ) ) )
                    {
                        // Данный элемент не убирается, ставим перенос перед ним
                        NewRange    = true;
                        RangeEndPos = Pos;
                    }
                    else
                    {
                        // Добавляем длину пробелов до слова и ширину данного элемента
                        X += SpaceLen + Item.Width;

                        FirstItemOnLine = false;
                        EmptyLine       = false;
                    }

                    SpaceLen    = 0;
                    //SpacesCount = 0;

                    break;
                }
                case para_Tab:
                {
                    // Сначала проверяем, если у нас уже есть таб, которым мы должны рассчитать, тогда высчитываем
                    // его ширину.

                    X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);

                    // Добавляем длину пробелов до слова + длина самого слова. Не надо проверять
                    // убирается ли слово, мы это проверяем при добавленнии букв.
                    X += SpaceLen + WordLen;
                    Word        = false;
                    SpaceLen    = 0;
                    WordLen     = 0;

                    var TabPos = Para.Internal_GetTabPos(X, ParaPr, PRS.CurPage);
                    var NewX     = TabPos.NewX;
                    var TabValue = TabPos.TabValue;

                    // Если таб не левый, значит он не может быть сразу рассчитан, а если левый, тогда
                    // рассчитываем его сразу здесь
                    if ( tab_Left !== TabValue )
                    {
                        PRS.LastTab.TabPos = NewX;
                        PRS.LastTab.Value  = TabValue;
                        PRS.LastTab.X      = X;
                        PRS.LastTab.Item   = Item;

                        Item.Width        = 0;
                        Item.WidthVisible = 0;
                    }
                    else
                    {
                        if ( NewX > XEnd && ( false === FirstItemOnLine || false === Para.Internal_Check_Ranges( ParaLine, ParaRange ) ) )
                        {
                            WordLen     = NewX - X;
                            RangeEndPos = Pos;
                            NewRange    = true;
                        }
                        else
                        {
                            Item.Width        = NewX - X;
                            Item.WidthVisible = NewX - X;

                            X = NewX;
                        }
                    }

                    // Если перенос идет по строке, а не из-за обтекания, тогда разрываем перед табом, а если
                    // из-за обтекания, тогда разрываем перед последним словом, идущим перед табом
                    if ( RangesCount === CurRange )
                    {
                        if ( true === StartWord )
                        {
                            FirstItemOnLine = false;
                            EmptyLine       = false;
                        }
                    }

                    // Считаем, что с таба начинается слово
                    PRS.Set_LineBreakPos( Pos );

                    StartWord = true;
                    Word      = true;

                    break;
                }
                case para_NewLine:
                {
                    if ( break_Page === Item.BreakType )
                    {
                        // PageBreak вне самого верхнего документа не надо учитывать, поэтому мы его с радостью удаляем
                        if ( !(Para.Parent instanceof CDocument) )
                        {
                            this.Internal_Content_Remove( Pos );
                            Pos--;
                            break;
                        }

                        NewPage       = true;
                        NewRange      = true;
                        BreakPageLine = true;
                    }
                    else
                    {
                        RangeEndPos = Pos + 1;

                        NewRange  = true;
                        EmptyLine = false;
                    }

                    X += WordLen;

                    if ( true === Word )
                    {
                        EmptyLine   = false;
                        Word        = false;
                        X          += SpaceLen;
                        SpaceLen    = 0;
                        //SpacesCount = 0;
                    }

                    break;
                }
                case para_End:
                {
                    if ( true === Word )
                    {
                        FirstItemOnLine = false;
                        EmptyLine       = false;
                    }

                    // false === PRS.ExtendBoundToBottom, потому что это уже делалось для PageBreak
                    if ( false === PRS.ExtendBoundToBottom )
                    {
                        X += WordLen;

                        if ( true === Word )
                        {
                            X += SpaceLen;
                            SpaceLen    = 0;
                            //SpacesCount = 0;
                            WordLen     = 0;
                        }

                        X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);
                    }

                    NewRange = true;
                    End      = true;

                    RangeEndPos = Pos + 1;

                    break;
                }
            }

            if ( true === NewRange )
                break;
        }

        if ( true === UpdateLineMetricsText )
        {
            // Пересчитаем метрику строки относительно размера данного текста
            if ( PRS.LineTextAscent < this.TextAscent )
                PRS.LineTextAscent = this.TextAscent;

            //if ( PRS.LineTextAscent2 < this.TextAscent2 )
                //PRS.LineTextAscent2 = this.TextAscent2;

            if ( PRS.LineTextDescent < this.TextDescent )
                PRS.LineTextDescent = this.TextDescent;

            if ( linerule_Exact === ParaPr.Spacing.LineRule )
            {
                // Смещение не учитывается в метриках строки, когда расстояние между строк точное
                if ( PRS.LineAscent < this.TextAscent )
                    PRS.LineAscent = this.TextAscent;

                if ( PRS.LineDescent < this.TextDescent )
                    PRS.LineDescent = this.TextDescent;
            }
            else
            {
                if ( PRS.LineAscent < this.TextAscent + this.YOffset  )
                    PRS.LineAscent = this.TextAscent + this.YOffset;

                if ( PRS.LineDescent < this.TextDescent - this.YOffset )
                    PRS.LineDescent = this.TextDescent - this.YOffset;
            }
        }

        PRS.MoveToLBP       = MoveToLBP;
        PRS.NewRange        = NewRange;
        PRS.ForceNewPage    = ForceNewPage;
        PRS.NewPage         = NewPage;
        PRS.BreakPageLine   = BreakPageLine;
        PRS.End             = End;

        PRS.Word            = Word;
        PRS.StartWord       = StartWord;
        PRS.FirstItemOnLine = FirstItemOnLine;
        PRS.EmptyLine       = EmptyLine;

        PRS.SpaceLen        = SpaceLen;
        PRS.WordLen         = WordLen;

        PRS.X               = X;
        PRS.XEnd            = XEnd;

        if ( Pos >= ContentLen )
        {
            RangeEndPos = Pos;

            // Удаляем лишние строки, оставшиеся после предыдущего пересчета в самом конце
            if ( this.Lines.length > this.LinesLength )
                this.Lines.length = this.LinesLength;
        }

        if ( 0 === CurLine && 0 === PRS.Range )
        {
            this.Range.StartPos = RangeStartPos;
            this.Range.EndPos   = RangeEndPos;
            this.Lines[0].RangesLength = 1;
        }
        else
            this.Lines[CurLine].Add_Range( PRS.Range, RangeStartPos, RangeEndPos );

        this.RecalcInfo.Recalc = false;
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = PRS.Range;
        var CurPos   = PRP.Get(Depth);

        this.Lines[CurLine].Ranges[CurRange].EndPos = CurPos;
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, CurRange)
    {
        var CurLine  = _CurLine - this.StartLine;
        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var NumberingItem = PRSC.Paragraph.Numbering.Item;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( true === this.RecalcInfo.NumberingUse && Item === NumberingItem )
                PRSC.Range.W += PRSC.Paragraph.Numbering.WidthVisible;

            switch( Item.Type )
            {
                case para_Sym:
                case para_Text:
                {
                    PRSC.Range.Letters++;

                    if ( true !== PRSC.Word )
                    {
                        PRSC.Word = true;
                        PRSC.Range.Words++;
                    }

                    PRSC.Range.W += Item.Width;
                    PRSC.Range.W += PRSC.SpaceLen;

                    PRSC.SpaceLen = 0;

                    // Пробелы перед первым словом в строке не считаем
                    if ( PRSC.Range.Words > 1 )
                        PRSC.Range.Spaces += PRSC.SpacesCount;
                    else
                        PRSC.Range.SpacesSkip += PRSC.SpacesCount;

                    PRSC.SpacesCount = 0;

                    // Если текущий символ, например, дефис, тогда на нем заканчивается слово
                    if ( true === Item.SpaceAfter )
                        PRSC.Word = false;

                    break;
                }
                case para_Space:
                {
                    if ( true === PRSC.Word )
                    {
                        PRSC.Word        = false;
                        PRSC.SpacesCount = 1;
                        PRSC.SpaceLen    = Item.Width;
                    }
                    else
                    {
                        PRSC.SpacesCount++;
                        PRSC.SpaceLen += Item.Width;
                    }

                    break;
                }
                case para_Drawing:
                {
                    PRSC.Range.Words++;
                    PRSC.Range.W += PRS2.SpaceLen;

                    if ( PRSC.Range.Words > 1 )
                        PRSC.Range.Spaces += PRSC.SpacesCount;
                    else
                        PRSC.Range.SpacesSkip += PRSC.SpacesCount;

                    PRSC.Word        = false;
                    PRSC.SpacesCount = 0;
                    PRSC.SpaceLen    = 0;

                    if ( true === Item.Is_Inline() || true === PRS2.Paragraph.Parent.Is_DrawingShape() )
                        PRSC.Range.W += Item.Width;

                    break;
                }
                case para_PageNum:
                {
                    PRSC.Range.Words++;
                    PRSC.Range.W += PRS2.SpaceLen;

                    if ( PRSC.Range.Words > 1 )
                        PRSC.Range.Spaces += PRSC.SpacesCount;
                    else
                        PRSC.Range.SpacesSkip += PRSC.SpacesCount;

                    PRSC.Word        = false;
                    PRSC.SpacesCount = 0;
                    PRSC.SpaceLen    = 0;

                    PRSC.Range.W += Item.Width;

                    break;
                }
                case para_Tab:
                {
                    PRSC.Range.W += Item.Width;
                    PRSC.Range.W += PRSC.SpaceLen;

                    // Учитываем только слова и пробелы, идущие после последнего таба

                    PRSC.Range.LettersSkip += PRSC.Range.Letters;
                    PRSC.Range.SpacesSkip  += PRSC.Range.Spaces;

                    PRSC.Range.Words   = 0;
                    PRSC.Range.Spaces  = 0;
                    PRSC.Range.Letters = 0;

                    PRSC.SpaceLen    = 0;
                    PRSC.SpacesCount = 0;
                    PRSC.Word        = false;

                    break;
                }

                case para_NewLine:
                {
                    if ( true === PRSC.Word && PRSC.Range.Words > 1 )
                        PRSC.Range.Spaces += PRSC.SpacesCount;

                    PRSC.SpacesCount = 0;
                    PRSC.Word        = false;

                    break;
                }
                case para_End:
                {
                    if ( true === PRSC.Word )
                        PRSC.Range.Spaces += PRSC.SpacesCount;

                    break;
                }
            }
        }
    },

    Recalculate_Range_Spaces : function(PRSA, _CurLine, CurRange, CurPage)
    {
        var CurLine = _CurLine - this.StartLine;
        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var NumberingItem = PRSA.Paragraph.Numbering.Item;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( true === this.RecalcInfo.NumberingUse && Item === NumberingItem )
                PRSA.X += PRSA.Paragraph.Numbering.WidthVisible;

            switch( Item.Type )
            {
                case para_Sym:
                case para_Text:
                {
                    if ( 0 !== PRSA.LettersSkip )
                    {
                        Item.WidthVisible = Item.Width;
                        PRSA.LettersSkip--;
                    }
                    else
                        Item.WidthVisible = Item.Width + PRSA.JustifyWord;

                    PRSA.X    += Item.WidthVisible;
                    PRSA.LastW = Item.WidthVisible;

                    break;
                }
                case para_Space:
                {
                    if ( 0 !== PRSA.SpacesSkip )
                    {
                        Item.WidthVisible = Item.Width;
                        PRSA.SpacesSkip--;
                    }
                    else if ( 0 !== PRSA.SpacesCounter )
                    {
                        Item.WidthVisible = Item.Width + PRSA.JustifySpace;
                        PRSA.SpacesCounter--;
                    }
                    else
                        Item.WidthVisible = Item.Width;

                    PRSA.X    += Item.WidthVisible;
                    PRSA.LastW = Item.WidthVisible;

                    break;
                }
                case para_Drawing:
                {
                    var Para = PRSA.Paragraph;
                    var DrawingObjects = Para.Parent.DrawingObjects;
                    var PageLimits     = Para.Parent.Get_PageLimits(Para.PageNum + CurPage);
                    var PageFields     = Para.Parent.Get_PageFields(Para.PageNum + CurPage);

                    var ColumnStartX = (0 === CurPage ? Para.X_ColumnStart : Para.Pages[CurPage].X     );
                    var ColumnEndX   = (0 === CurPage ? Para.X_ColumnEnd   : Para.Pages[CurPage].XLimit);

                    var Top_Margin    = Y_Top_Margin;
                    var Bottom_Margin = Y_Bottom_Margin;
                    var Page_H        = Page_Height;

                    if ( true === Para.Parent.Is_TableCellContent() && true == Item.Use_TextWrap() )
                    {
                        Top_Margin    = 0;
                        Bottom_Margin = 0;
                        Page_H        = 0;
                    }

                    if ( true != Item.Use_TextWrap() )
                    {
                        PageFields.X      = X_Left_Field;
                        PageFields.Y      = Y_Top_Field;
                        PageFields.XLimit = X_Right_Field;
                        PageFields.YLimit = Y_Bottom_Field;

                        PageLimits.X = 0;
                        PageLimits.Y = 0;
                        PageLimits.XLimit = Page_Width;
                        PageLimits.YLimit = Page_Height;
                    }

                    if ( true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape() )
                    {
                        Item.Update_Position( new CParagraphLayout( PRSA.X, PRSA.Y , Para.Get_StartPage_Absolute() + CurPage, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits );
                        Item.Reset_SavedPosition();

                        PRSA.X    += Item.WidthVisible;
                        PRSA.LastW = Item.WidthVisible;
                    }
                    else
                    {
                        // У нас Flow-объект. Если он с обтеканием, тогда мы останавливаем пересчет и
                        // запоминаем текущий объект. В функции Internal_Recalculate_2 пересчитываем
                        // его позицию и сообщаем ее внешнему классу.

                        if ( true === Item.Use_TextWrap() )
                        {
                            var LogicDocument = Para.Parent;
                            var LDRecalcInfo  = Para.Parent.RecalcInfo;
                            var Page_abs      = Para.Get_StartPage_Absolute() + CurPage;

                            if ( true === LDRecalcInfo.Can_RecalcObject() )
                            {
                                // Обновляем позицию объекта
                                Item.Update_Position( new CParagraphLayout( PRSA.X, PRSA.Y , Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits);
                                LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement );
                                PRSA.RecalcResult = recalcresult_CurPage;
                                return;
                            }
                            else if ( true === LDRecalcInfo.Check_FlowObject(Item) )
                            {
                                // Если мы находимся с таблице, тогда делаем как Word, не пересчитываем предыдущую страницу,
                                // даже если это необходимо. Такое поведение нужно для точного определения рассчиталась ли
                                // данная страница окончательно или нет. Если у нас будет ветка с переходом на предыдущую страницу,
                                // тогда не рассчитав следующую страницу мы о конечном рассчете текущей страницы не узнаем.

                                // Если данный объект нашли, значит он уже был рассчитан и нам надо проверить номер страницы
                                if ( Item.PageNum === Page_abs )
                                {
                                    // Все нормально, можно продолжить пересчет
                                    LDRecalcInfo.Reset();
                                    Item.Reset_SavedPosition();
                                }
                                else if ( true === Para.Parent.Is_TableCellContent() )
                                {
                                    // Картинка не на нужной странице, но так как это таблица
                                    // мы не персчитываем заново текущую страницу, а не предыдущую

                                    // Обновляем позицию объекта
                                    Item.Update_Position( new CParagraphLayout( PRSA.X, PRSA.Y, Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits);

                                    LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement );
                                    LDRecalcInfo.Set_PageBreakBefore( false );
                                    PRSA.RecalcResult = recalcresult_CurPage;
                                    return;
                                }
                                else
                                {
                                    LDRecalcInfo.Set_PageBreakBefore( true );
                                    DrawingObjects.removeById( Item.PageNum, Item.Get_Id() );
                                    PRSA.RecalcResult = recalcresult_PrevPage;
                                    return;
                                }
                            }
                            else
                            {
                                // Либо данный элемент уже обработан, либо будет обработан в будущем
                            }

                            continue;
                        }
                        else
                        {
                            // Картинка ложится на или под текст, в данном случае пересчет можно спокойно продолжать
                            Item.Update_Position( new CParagraphLayout( PRSA.X, PRSA.Y , Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits);
                            Item.Reset_SavedPosition();
                        }
                    }


                    break;
                }
                case para_PageNum:
                {
                    PRSA.X    += Item.WidthVisible;
                    PRSA.LastW = Item.WidthVisible;

                    break;
                }
                case para_Tab:
                {
                    PRSA.X += Item.WidthVisible;

                    break;
                }
                case para_End:
                {
                    PRSA.X += Item.Width;

                    break;
                }
                case para_NewLine:
                {
                    PRSA.X += Item.WidthVisible;

                    break;
                }

                    // TODO : Реализовать на уровен Run
//                case para_CommentStart:
//                {
//                    var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
//
//                    var CommentId = Item.Id;
//                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
//                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
//
//                    DocumentComments.Set_StartInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );
//
//                    break;
//                }
//
//                case para_CommentEnd:
//                {
//                    var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
//
//                    var CommentId = Item.Id;
//                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
//                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
//
//                    DocumentComments.Set_EndInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );
//                    break;
//                }
            }
        }
    },

    Internal_Recalculate_Numbering : function(Item, Para, ParaPr, _X, _LineAscent, CurPage, CurLine, CurRange)
    {
        var X = _X, LineAscent = _LineAscent;

        // Если нужно добавить нумерацию и на текущем элементе ее можно добавить, тогда добавляем её
        var NumberingItem = Para.Numbering;
        var NumberingType = Para.Numbering.Type;

        if ( para_Numbering === NumberingType )
        {
            var NumPr = ParaPr.NumPr;
            if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
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
                NumberingItem.Measure( g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr );

                // При рассчете высоты строки, если у нас параграф со списком, то размер символа
                // в списке влияет только на высоту строки над Baseline, но не влияет на высоту строки
                // ниже baseline.
                if ( LineAscent < NumberingItem.Height )
                    LineAscent = NumberingItem.Height;

                switch ( NumJc )
                {
                    case align_Right:
                    {
                        NumberingItem.WidthVisible = 0;
                        break;
                    }
                    case align_Center:
                    {
                        NumberingItem.WidthVisible = NumberingItem.WidthNum / 2;
                        break;
                    }
                    case align_Left:
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
                        g_oTextMeasurer.SetTextPr( NumTextPr );
                        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );
                        NumberingItem.WidthSuff = g_oTextMeasurer.Measure( " " ).Width;
                        g_oTextMeasurer.SetTextPr( OldTextPr );
                        break;
                    }
                    case numbering_suff_Tab:
                    {
                        var NewX = Para.Internal_GetTabPos(X, ParaPr, CurPage).NewX;

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
            var Bullet = Para.PresentationPr.Bullet;
            if ( numbering_presentationnumfrmt_None != Bullet.Get_Type() )
            {
                if ( ParaPr.Ind.FirstLine < 0 )
                    NumberingItem.WidthVisible = Math.max( NumberingItem.Width, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X );
                else
                    NumberingItem.WidthVisible = Math.max( Para.X + ParaPr.Ind.Left + NumberingItem.Width - X, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X );
            }

            X += NumberingItem.WidthVisible;
        }

        // Запоминаем, что на данном элементе была добавлена нумерация
        this.RecalcInfo.NumberingAdd  = false;
        this.RecalcInfo.NumberingUse  = true;
        this.RecalcInfo.NumberingItem = NumberingItem;

        // Заполним обратные данные в элементе нумерации
        NumberingItem.Item  = Item;
        NumberingItem.Run   = this;

        NumberingItem.Line  = CurLine;
        NumberingItem.Range = CurRange;

        return { X : X, LineAscent : LineAscent };
    },

    Internal_Recalculate_LineMetrics : function(PRS, SpacingLineRule)
    {
        if ( PRS.LineTextAscent < this.TextAscent )
            PRS.LineTextAscent = this.TextAscent;

        if ( PRS.LineTextAscent2 < this.TextAscent2 )
            PRS.LineTextAscent2 = this.TextAscent2;

        if ( PRS.LineTextDescent < this.TextDescent )
            PRS.LineTextDescent = this.TextDescent;

        if ( linerule_Exact === SpacingLineRule )
        {
            // Смещение не учитывается в метриках строки, когда расстояние между строк точное
            if ( PRS.LineAscent < this.TextAscent )
                PRS.LineAscent = this.TextAscent;

            if ( PRS.LineDescent < this.TextDescent )
                PRS.LineDescent = this.TextDescent;
        }
        else
        {
            if ( PRS.LineAscent < this.TextAscent + this.YOffset  )
                PRS.LineAscent = this.TextAscent + this.YOffset;

            if ( PRS.LineDescent < this.TextDescent - this.YOffset )
                PRS.LineDescent = this.TextDescent - this.YOffset;
        }
    },

    Internal_Recalculate_LastTab : function(LastTab, X, XEnd, Word, WordLen, SpaceLen)
    {
        if ( -1 !== LastTab.Value )
        {
            var TempXPos = X;

            if ( true === Word || WordLen > 0 )
                TempXPos += SpaceLen + WordLen;

            var TabItem   = LastTab.Item;
            var TabStartX = LastTab.X;
            var TabRangeW = TempXPos - TabStartX;
            var TabValue  = LastTab.Value;
            var TabPos    = LastTab.TabPos;

            var TabCalcW = 0;
            if ( tab_Right === TabValue )
                TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW), 0 );
            else if ( tab_Center === TabValue )
                TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW / 2), 0 );

            if ( X + TabCalcW > XEnd )
                TabCalcW = XEnd - X;

            TabItem.Width        = TabCalcW;
            TabItem.WidthVisible = TabCalcW;

            LastTab.Reset();

            return X + TabCalcW;
        }

        return X;
    },

    Refresh_RecalcData : function(Data)
    {
        this.Parent.Refresh_RecalcData2(0);
    },

    Save_Lines : function()
    {
        var Lines = new Array();

        for ( var CurLine = 0; CurLine < this.LinesLength; CurLine++ )
        {
            Lines.push( this.Lines[CurLine].Copy() );
        }

        return { Lines : Lines, LinesLength : this.LinesLength } ;
    },

    Restore_Lines : function(SL)
    {
        this.Lines       = SL.Lines;
        this.LinesLength = SL.LinesLength;
        this.Range       = this.Lines[0].Ranges[0];
    },

    Get_RecalcInfo : function()
    {
        return this.RecalcInfo;
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
        var pGraphics = PDSH.Graphics;

        var CurLine   = PDSH.Line - this.StartLine;
        var CurRange  = PDSH.Range;

        var aHigh     = PDSH.High;
        var aColl     = PDSH.Coll;
        var aFind     = PDSH.Find;
        var aComm     = PDSH.Comm;

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var Para     = PDSH.Paragraph;
        var SearchResults = Para.SearchResults;

        var bDrawFind = PDSH.DrawFind;
        var bDrawColl = PDSH.DrawColl;
        var bDrawComm = PDSH.DrawComm;

        //var CurParaPos = PDSH.CurPos.Copy();
        //var CurDepth   = CurParaPos.Add( 0 );

        var X  = PDSH.X;
        var Y0 = PDSH.Y0;
        var Y1 = PDSH.Y1;

        var bDrawComments = bDrawComm;
        var CommentsFlag  = PDSH.CommentsFlag;

        var HighLight = this.Get_CompiledPr(false).HighLight;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            //CurParaPos.Update( Pos, CurDepth );

            // Определим попадание в поиск и совместное редактирование. Попадание в комментарий определять не надо,
            // т.к. класс CParaRun попадает или не попадает в комментарий целиком.

            var bDrawSearch = false;
//            if ( true === bDrawSearch )
//            {
//                for ( var SId in SearchResults )
//                {
//                    var SResult = SearchResults[SId];
//                    if ( CurParaPos.Compare( SResult.StartPos ) >= 0 && CurParaPos.Compare( SResult.EndPos ) <= 0 )
//                    {
//                        bDrawSearch = true;
//                        break;
//                    }
//                }
//            }

            var nCollaborativeChanges = 0;
            if ( true === bDrawColl )
            {
                var CollCount = this.CollaborativeMarks.length;
                for ( var TempIndex = 0; TempIndex < CollCount; TempIndex++ )
                {
                    var CollMark = this.CollaborativeMarks[TempIndex];
                    if ( CollMark.Pos <= Pos && pararun_CollaborativeMark_Start === CollMark.Type  )
                        nCollaborativeChanges++;
                    else if ( CollMark.Pos <= Pos && pararun_CollaborativeMark_End === CollMark.Type )
                        nCollaborativeChanges--;
                }
            }

//            if ( 0 === CurParaPos.Compare( Para.Numbering.Pos ) )
//            {
//                var NumberingType = Para.Numbering.Type;
//                var NumberingItem = Para.Numbering;
//
//                if ( para_Numbering === NumberingType )
//                {
//                    var NumPr = Pr.ParaPr.NumPr;
//                    if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
//                    {
//                        // Ничего не делаем
//                    }
//                    else
//                    {
//                        var Numbering = Para.Parent.Get_Numbering();
//                        var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
//                        var NumJc     = NumLvl.Jc;
//                        var NumTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
//                        NumTextPr.Merge( Para.TextPr.Value );
//                        NumTextPr.Merge( NumLvl.TextPr );
//
//                        var X_start = X;
//
//                        if ( align_Right === NumJc )
//                            X_start = X - NumberingItem.WidthNum;
//                        else if ( align_Center === NumJc )
//                            X_start = X - NumberingItem.WidthNum / 2;
//
//                        // Если есть выделение текста, рисуем его сначала
//                        if ( highlight_None != NumTextPr.HighLight )
//                            aHigh.Add( Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, NumTextPr.HighLight.r, NumTextPr.HighLight.g, NumTextPr.HighLight.b );
//
//                        if ( nCollaborativeChanges > 0 )
//                            aColl.Add( Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, 0, 0, 0 );
//
//                        X += NumberingItem.WidthVisible;
//                    }
//                }
//                else if ( para_PresentationNumbering === NumberingType )
//                {
//                    X += NumberingItem.WidthVisible;
//                }
//            }

            switch( Item.Type )
            {
                case para_PageNum:
                case para_Drawing:
                case para_Tab:
                case para_Text:
                case para_Sym:
                {
                    if ( para_Drawing === Item.Type && drawing_Anchor === Item.DrawingType )
                        break;

                    if ( CommentsFlag != comments_NoComment && true === bDrawComments )
                        aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                    else if ( highlight_None != HighLight )
                        aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, HighLight.r, HighLight.g, HighLight.b );

                    if ( true === bDrawSearch )
                        aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                    else if ( nCollaborativeChanges > 0 )
                        aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                    if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                        X += Item.WidthVisible;

                    break;
                }
                case para_Space:
                {
                    // TODO: Переделать здесь

//                    // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
//                    if ( Pos >= _Range.StartPos2 && Pos <= _Range.EndPos2 )
//                    {
//                        if ( CommentsFlag != comments_NoComment && bDrawComments )
//                            aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
//                        else if ( highlight_None != HighLight )
//                            aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, HighLight.r, HighLight.g, HighLight.b );
//                    }

                    if ( CommentsFlag != comments_NoComment && bDrawComments )
                        aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                    else if ( highlight_None != HighLight )
                        aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, HighLight.r, HighLight.g, HighLight.b );

                    //-------------------------------------------

                    if ( true === bDrawSearch )
                        aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                    else if ( nCollaborativeChanges > 0 )
                        aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                    X += Item.WidthVisible;

                    break;
                }
                case para_End:
                {
                    if ( nCollaborativeChanges > 0 )
                        aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                    X += Item.Width;
                    break;
                }
                case para_NewLine:
                {
                    X += Item.WidthVisible;
                    break;
                }
            }
        }

        // Обновим позицию X
        PDSH.X = X;
    },

    Draw_Elements : function(PDSE)
    {
        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = PDSE.Range;

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        //var CurParaPos = PDSE.CurPos.Copy();
       // var CurDepth   = CurParaPos.Add( 0 );
        var Para       = PDSE.Paragraph;
        var NumItem    = PDSE.Paragraph.Numbering.Item;

        var pGraphics = PDSE.Graphics;
        var AutoColor = PDSE.AutoColor;

        var X = PDSE.X;
        var Y = PDSE.Y;

        var CurTextPr = this.Get_CompiledPr( false );
        pGraphics.SetTextPr( CurTextPr );

        if ( true === PDSE.VisitedHyperlink )
            pGraphics.b_color1( 128, 0, 151, 255 );
        else if ( true === CurTextPr.Color.Auto )
            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
        else
            pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            var TempY = Y;
            switch( CurTextPr.VertAlign )
            {
                case vertalign_SubScript:
                {
                    Y -= vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                    break;
                }
                case vertalign_SuperScript:
                {
                    Y -= vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                    break;
                }
            }

            //CurParaPos.Update( Pos, CurDepth );

            if ( true === this.RecalcInfo.NumberingUse && Item === NumItem )
            {
                var NumberingItem = Para.Numbering;
                if ( para_Numbering === Para.Numbering.Type )
                {
                    var Pr = Para.Get_CompiledPr2(false);
                    var NumPr = Pr.ParaPr.NumPr;
                    if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                    {
                        // Ничего не делаем
                    }
                    else
                    {
                        var Numbering = Para.Parent.Get_Numbering();
                        var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                        var NumSuff   = NumLvl.Suff;
                        var NumJc     = NumLvl.Jc;
                        var NumTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();

                        // Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
                        // символа параграфа.

                        var TextPr_temp = Para.TextPr.Value.Copy();
                        TextPr_temp.Underline = undefined;

                        NumTextPr.Merge( TextPr_temp );
                        NumTextPr.Merge( NumLvl.TextPr );

                        var X_start = X;

                        if ( align_Right === NumJc )
                            X_start = X - NumberingItem.WidthNum;
                        else if ( align_Center === NumJc )
                            X_start = X - NumberingItem.WidthNum / 2;

                        if ( true === NumTextPr.Color.Auto )
                            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        else
                            pGraphics.b_color1( NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255 );

                        // Рисуется только сам символ нумерации
                        switch ( NumJc )
                        {
                            case align_Right:
                                NumberingItem.Draw( X - NumberingItem.WidthNum, Y, pGraphics, Numbering, NumTextPr, NumPr );
                                break;

                            case align_Center:
                                NumberingItem.Draw( X - NumberingItem.WidthNum / 2, Y, pGraphics, Numbering, NumTextPr, NumPr );
                                break;

                            case align_Left:
                            default:
                                NumberingItem.Draw( X, Y, pGraphics, Numbering, NumTextPr, NumPr );
                                break;
                        }

                        if ( true === editor.ShowParaMarks && numbering_suff_Tab === NumSuff )
                        {
                            var TempWidth     = NumberingItem.WidthSuff;
                            var TempRealWidth = 3.143; // ширина символа "стрелка влево" в шрифте Wingding3,10

                            var X1 = X;
                            switch ( NumJc )
                            {
                                case align_Right:
                                    break;

                                case align_Center:
                                    X1 += NumberingItem.WidthNum / 2;
                                    break;

                                case align_Left:
                                default:
                                    X1 += NumberingItem.WidthNum;
                                    break;
                            }

                            var X0 = TempWidth / 2 - TempRealWidth / 2;

                            pGraphics.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );

                            if ( X0 > 0 )
                                pGraphics.FillText2( X1 + X0, Y, String.fromCharCode( tab_Symbol ), 0, TempWidth );
                            else
                                pGraphics.FillText2( X1, Y, String.fromCharCode( tab_Symbol ), TempRealWidth - TempWidth, TempWidth );
                        }

                        if ( true === NumTextPr.Strikeout || true === NumTextPr.Underline )
                        {
                            if ( true === NumTextPr.Color.Auto )
                                pGraphics.p_color( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.p_color( NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255 );
                        }

                        if ( true === NumTextPr.Strikeout )
                            pGraphics.drawHorLine(0, (Y - NumTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X_start, X_start + NumberingItem.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);

                        if ( true === NumTextPr.Underline )
                            pGraphics.drawHorLine( 0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X_start, X_start + NumberingItem.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);


                        X += NumberingItem.WidthVisible;
                    }
                }
                else if ( para_PresentationNumbering === this.Numbering.Type )
                {
                    if ( true != Para.IsEmpty() )
                    {
                        if ( Pr.ParaPr.Ind.FirstLine < 0 )
                            NumberingItem.Draw( X, Y, pGraphics, CurTextPr );
                        else
                            NumberingItem.Draw( Para.X + Pr.ParaPr.Ind.Left, Y, pGraphics, CurTextPr );
                    }

                    X += NumberingItem.WidthVisible;
                }

                // Восстановим настройки
                pGraphics.SetTextPr( CurTextPr );

                if ( true === PDSE.VisitedHyperlink )
                    pGraphics.b_color1( 128, 0, 151, 255 );
                else if ( true === CurTextPr.Color.Auto )
                    pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                else
                    pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
            }

            switch( Item.Type )
            {
                case para_PageNum:
                case para_Drawing:
                case para_Tab:
                case para_Text:
                case para_Sym:
                {
                    if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                    {
                        bFirstLineItem = false;

                        if ( para_PageNum != Item.Type )
                            Item.Draw( X, Y - this.YOffset, pGraphics );
                        else
                            Item.Draw( X, Y - this.YOffset, pGraphics, Para.Get_StartPage_Absolute() + CurPage, Pr.ParaPr.Jc );

                        X += Item.WidthVisible;
                    }

                    // Внутри отрисовки инлайн-автофигур могут изменится цвета и шрифт, поэтому восстанавливаем настройки
                    if ( para_Drawing === Item.Type && drawing_Inline === Item.DrawingType )
                    {
                        pGraphics.SetTextPr( CurTextPr );

                        if ( true === CurTextPr.Color.Auto )
                        {
                            pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            pGraphics.p_color( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        }
                        else
                        {
                            pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                            pGraphics.p_color( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        }
                    }

                    break;
                }
                case para_Space:
                {
                    Item.Draw( X, Y - this.YOffset, pGraphics );

                    X += Item.WidthVisible;

                    break;
                }
                case para_End:
                {
                    // Выставляем настройки для символа параграфа
                    var EndTextPr = Para.Get_CompiledPr2( false).TextPr.Copy();
                    EndTextPr.Merge( Para.TextPr.Value );

                    pGraphics.SetTextPr( EndTextPr );

                    if ( true === EndTextPr.Color.Auto )
                        pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                    else
                        pGraphics.b_color1( EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);

                    bEnd = true;
                    var bEndCell = false;
                    if ( null === Para.Get_DocumentNext() && true === Para.Parent.Is_TableCellContent() )
                        bEndCell = true;

                    Item.Draw( X, Y - this.YOffset, pGraphics, bEndCell );
                    X += Item.Width;

                    break;
                }
                case para_NewLine:
                {
                    Item.Draw( X, Y - this.YOffset, pGraphics );
                    X += Item.WidthVisible;
                    break;
                }
            }

            Y = TempY;
        }

        // Обновляем позицию
        PDSE.X = X;
    },

    Draw_Lines : function(PDSL)
    {
        var CurLine  = PDSL.Line - this.StartLine;
        var CurRange = PDSL.Range;

        var Range = this.Lines[CurLine].Ranges[CurRange];

        var X        = PDSL.X;
        var Y        = PDSL.Baseline;
        var UndOff   = PDSL.UnderlineOffset;

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        //var CurParaPos = PDSL.CurPos.Copy();
        //var CurDepth   = CurParaPos.Add( 0 );
        var Para       = PDSL.Paragraph;
        var NumItem    = PDSL.Paragraph.Numbering.Item;

        var aStrikeout  = PDSL.Strikeout;
        var aDStrikeout = PDSL.DStrikeout;
        var aUnderline  = PDSL.Underline;
        var aSpelling   = PDSL.Spelling;

        var CurTextPr = this.Get_CompiledPr( false );

        var StrikeoutY = Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27;
        var UnderlineY = Y + UndOff;
        var LineW      = (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm;

        var AutoColor = PDSL.AutoColor;
        var CurColor = new CDocumentColor( 0, 0, 0, false );
        // Выставляем цвет обводки
        if ( true === PDSL.VisitedHyperlink )
            CurColor.Set( 128, 0, 151, 255 );
        else if ( true === CurTextPr.Color.Auto )
            CurColor.Set( AutoColor.r, AutoColor.g, AutoColor.b );
        else
            CurColor.Set( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
           //CurParaPos.Update( Pos, CurDepth );
            var Item = this.Content[Pos];

            // TODO: Нумерация зачеркивается и подчеркивается отдельно в Draw_Elements (неплохо бы сюда перенести)
            if ( true === this.RecalcInfo.NumberingUse && Item === NumItem )
                X += Para.Numbering.WidthVisible;

            switch( Item.Type )
            {
                case para_End:
                case para_NewLine:
                {
                    X += Item.WidthVisible;

                    break;
                }

                case para_PageNum:
                case para_Drawing:
                case para_Tab:
                case para_Text:
                case para_Sym:
                {
                    if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                    {
                        if ( true === CurTextPr.DStrikeout )
                            aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
                        else if ( true === CurTextPr.Strikeout )
                            aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                        if ( true === CurTextPr.Underline )
                            aUnderline.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                        // TODO: Переделать орфографию
                        //if ( true === CheckSpelling[Pos] )
                        //    aSpelling.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, 0, 0, 0 );

                        X += Item.WidthVisible;
                    }

                    break;
                }
                case para_Space:
                {
                    // TODO: реализовать через счетчик пробелов в начале и в конце
//                    if ( Pos >= _Range.StartPos2 && Pos <= _Range.EndPos2 )
//                    {
//                        if ( true === CurTextPr.DStrikeout )
//                            aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
//                        else if ( true === CurTextPr.Strikeout )
//                            aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
//
//                        if ( true === CurTextPr.Underline )
//                            aUnderline.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
//                    }

                    if ( true === CurTextPr.DStrikeout )
                        aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
                    else if ( true === CurTextPr.Strikeout )
                        aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                    if ( true === CurTextPr.Underline )
                        aUnderline.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                    //-----------------------------------------------------------------------------------


                    X += Item.WidthVisible;

                    break;
                }
            }
        }

        // Обновляем позицию
        PDSL.X = X;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
    // Находится ли курсор в начале рана
    Cursor_Is_Start : function()
    {
        if ( this.State.ContentPos <= 0 )
            return true;

        return false;
    },

    // Проверяем нужно ли поправить позицию курсора
    Cursor_Is_NeededCorrectPos : function()
    {
        var NewRangeStart = false;
        var RangeEnd      = false;

        var Pos = this.State.ContentPos;

        var LinesLen = this.LinesLength;
        for ( var CurLine = 0; CurLine < LinesLen; CurLine++ )
        {
            var Line = this.Lines[CurLine];
            var RangesLen = Line.RangesLength;
            for ( var CurRange = 0; CurRange < RangesLen; CurRange++ )
            {
                var Range = Line.Ranges[CurRange];
                if ( 0 !== CurLine || 0 !== CurRange )
                {
                    if ( Pos === Range.StartPos )
                    {
                        NewRangeStart = true;
                    }
                }

                if ( Pos === Range.EndPos )
                {
                    RangeEnd = true;
                }
            }

            if ( true === NewRangeStart )
                break;
        }

        if ( true !== NewRangeStart && true !== RangeEnd && true === this.Cursor_Is_Start() )
            return true;

        return false;
    },

    Cursor_Is_End : function()
    {
        if ( this.State.ContentPos >= this.Content.length )
            return true;

        return false;
    },

    Cursor_MoveToStartPos : function()
    {
        this.State.ContentPos = 0;
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
        if ( true === SelectFromEnd )
        {
            var Selection = this.State.Selection;
            Selection.Use      = true;
            Selection.StartPos = this.Content.length;
            Selection.EndPos   = this.Content.length;
        }
        else
        {
            var CurPos = this.Content.length;

            while ( CurPos > 0 )
            {
                if ( para_End === this.Content[CurPos - 1].Type )
                    CurPos--;
                else
                    break;
            }

            this.State.ContentPos = CurPos;
        }
    },

    Get_ParaContentPosByXY : function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        var Result = false;

        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var NumberingItem = this.Paragraph.Numbering;
        var NumItem       = NumberingItem.Item;

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            var TempDx = 0;

            // Проверим попадание в нумерацию
            if ( true === this.RecalcInfo.NumberingUse && Item === NumItem )
            {
                var NumPr = this.Paragraph.Numbering_Get();
                if ( para_Numbering === NumberingItem.Type && undefined !== NumPr )
                {
                    var NumJc = this.Paragraph.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;

                    var NumX0 = SearchPos.CurX;
                    var NumX1 = SearchPos.CurX;

                    switch( NumJc )
                    {
                        case align_Right:
                        {
                            NumX0 -= NumberingItem.WidthNum;
                            break;
                        }
                        case align_Center:
                        {
                            NumX0 -= NumberingItem.WidthNum / 2;
                            NumX1 += NumberingItem.WidthNum / 2;
                            break;
                        }
                        case align_Left:
                        default:
                        {
                            NumX1 += NumberingItem.WidthNum;
                            break;
                        }
                    }

                    if ( SearchPos.X >= NumX0 && SearchPos.X <= NumX1 )
                    {
                        SearchPos.Numbering = true;
                    }
                }

                SearchPos.CurX += NumberingItem.WidthVisible;
            }

            if ( para_Drawing != Item.Type || true === Item.Is_Inline() )
            {
                TempDx = Item.WidthVisible;
            }

            // Проверяем, попали ли мы в данный элемент
            var Diff = SearchPos.X - SearchPos.CurX;
            if ( Math.abs( Diff ) < SearchPos.DiffX + 0.001 )
            {
                SearchPos.DiffX = Math.abs( Diff );
                SearchPos.Pos.Update( CurPos, Depth );
                Result = true;

                if ( Diff >= - 0.001 && Diff <= TempDx + 0.001 )
                {
                    SearchPos.InText = true;
                }
            }

            SearchPos.CurX += TempDx;

            // Заглушка для знака параграфа и конца строки
            if ( Math.abs( SearchPos.X - SearchPos.CurX ) < SearchPos.DiffX )
            {
                if ( para_End === Item.Type )
                {
                    SearchPos.End = true;

                    // Если мы ищем позицию для селекта, тогда нужно искать и за знаком параграфа
                    if ( true === StepEnd )
                        SearchPos.Pos.Update( this.Content.length, Depth );
                }
                else if ( CurPos === EndPos - 1 && para_NewLine != Item.Type )
                {
                    SearchPos.Pos.Update( EndPos, Depth );
                }
            }
        }

        return Result;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos)
    {
        var Pos = ( true !== bSelection ? this.State.ContentPos : ( false !== bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos ) );
        ContentPos.Add( Pos );
    },

    Set_ParaContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);
        this.State.ContentPos = Pos;
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length );

        while ( true )
        {
            CurPos--;

            var Item = this.Content[CurPos];
            if ( CurPos < 0 || para_Drawing !== Item.Type || false !== Item.Is_Inline() )
                break;
        }

        if ( CurPos >= 0 )
        {
            SearchPos.Found = true;
            SearchPos.Pos.Update( CurPos, Depth );
        }
    },

    Get_RightPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

        var Count = this.Content.length;
        while ( true )
        {
            CurPos++;

            // Мы встали в конец рана:
            //   Если мы перешагнули para_End или para_Drawing Anchor, тогда возвращаем false
            //   В противном случае true
            if ( Count === CurPos )
            {
                if ( CurPos === 0 )
                    return;

                var PrevItem = this.Content[CurPos - 1];
                if ( (true !== StepEnd && para_End === PrevItem.Type) || (para_Drawing === PrevItem.Type && false === PrevItem.Is_Inline()) )
                    return;

                break;
            }

            var Item = this.Content[CurPos];
            if ( CurPos > Count || (para_Drawing !== Item.Type && (false !== StepEnd || para_End !== Item.Type) ) || (para_Drawing === Item.Type && false !== Item.Is_Inline()))
                break;
        }

        if ( CurPos <= Count )
        {
            SearchPos.Found = true;
            SearchPos.Pos.Update( CurPos, Depth );
        }
    },

    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) - 1 : this.Content.length - 1 );

        if ( CurPos < 0 )
            return;

        SearchPos.Shift = true;

        var NeedUpdate = false;

        // На первом этапе ищем позицию первого непробельного элемента
        if ( 0 === SearchPos.Stage )
        {
            while ( true )
            {
                var Item = this.Content[CurPos];
                var Type = Item.Type;

                var bSpace = false;

                if ( para_Space === Type || para_Tab === Type || ( para_Text === Type && true === Item.Is_NBSP() ) || ( para_Drawing === Type && true !== Item.Is_Inline() ) )
                    bSpace = true;

                if ( true === bSpace )
                {
                    CurPos--;

                    // Выходим из данного рана
                    if ( CurPos < 0 )
                        return;
                }
                else
                {
                    // Если мы остановились на нетекстовом элементе, тогда его и возвращаем
                    if ( para_Text !== this.Content[CurPos].Type )
                    {
                        SearchPos.Pos.Update( CurPos, Depth );
                        SearchPos.Found     = true;
                        SearchPos.UpdatePos = true;
                        return;
                    }

                    SearchPos.Pos.Update( CurPos, Depth );
                    SearchPos.Stage       = 1;
                    SearchPos.Punctuation = this.Content[CurPos].Is_Punctuation();
                    NeedUpdate            = true;

                    break;
                }
            }
        }
        else
        {
            CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length );
        }

        // На втором этапе мы смотрим на каком элементе мы встали: если текст - пунктуация, тогда сдвигаемся
        // до конца всех знаков пунктуации

        while ( CurPos > 0 )
        {
            CurPos--;
            var Item = this.Content[CurPos]
            var TempType = Item.Type;

            if ( para_Text !== TempType || true === Item.Is_NBSP() || ( true === SearchPos.Punctuation && true !== Item.Is_Punctuation() ) || ( false === SearchPos.Punctuation && false !== Item.Is_Punctuation() ) )
            {
                SearchPos.Found = true;
                break;
            }
            else
            {
                SearchPos.Pos.Update( CurPos, Depth );
                NeedUpdate = true;
            }
        }

        SearchPos.UpdatePos = NeedUpdate;
    },

    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

        var ContentLen = this.Content.length;
        if ( CurPos >= ContentLen )
            return;

        var NeedUpdate = false;

        if ( 0 === SearchPos.Stage )
        {
            // На первом этапе ищем первый нетекстовый ( и не таб ) элемент
            while ( true )
            {
                var Item = this.Content[CurPos];
                var Type = Item.Type;
                var bText = false;

                if ( para_Text === Type && true != Item.Is_NBSP() && ( true === SearchPos.First || ( SearchPos.Punctuation === Item.Is_Punctuation() ) ) )
                    bText = true;

                if ( true === bText )
                {
                    if ( true === SearchPos.First )
                    {
                        SearchPos.First       = false;
                        SearchPos.Punctuation = Item.Is_Punctuation();
                    }

                    CurPos++;

                    // Отмечаем, что сдвиг уже произошел
                    SearchPos.Shift = true;

                    // Выходим из рана
                    if ( CurPos >= ContentLen )
                        return;
                }
                else
                {
                    SearchPos.Stage = 1;

                    // Первый найденный элемент не текстовый, смещаемся вперед
                    if ( true === SearchPos.First )
                    {
                        // Если первый найденный элемент - конец параграфа, тогда выходим из поиска
                        if ( para_End === Type )
                        {
                            if ( true === StepEnd )
                            {
                                SearchPos.Pos.Update( CurPos + 1, Depth );
                                SearchPos.Found     = true;
                                SearchPos.UpdatePos = true;
                            }

                            return;
                        }

                        CurPos++;

                        // Отмечаем, что сдвиг уже произошел
                        SearchPos.Shift = true;
                    }

                    break;
                }
            }
        }

        if ( CurPos >= ContentLen )
            return;


        // На втором этапе мы смотрим на каком элементе мы встали: если это не пробел, тогда
        // останавливаемся здесь. В противном случае сдвигаемся вперед, пока не попали на первый
        // не пробельный элемент.
        if ( !(para_Space === this.Content[CurPos].Type || ( para_Text === this.Content[CurPos].Type && true === this.Content[CurPos].Is_NBSP() ) ) )
        {
            SearchPos.Pos.Update( CurPos, Depth );
            SearchPos.Found     = true;
            SearchPos.UpdatePos = true;
        }
        else
        {
            while ( CurPos < ContentLen - 1 )
            {
                CurPos++;
                var Item = this.Content[CurPos]
                var TempType = Item.Type;

                if ( (true !== StepEnd && para_End === TempType) || !( para_Space === TempType || ( para_Text === TempType && true === Item.Is_NBSP() ) ) )
                {
                    SearchPos.Found = true;
                    break;
                }
            }

            // Обновляем позицию в конце каждого рана (хуже от этого не будет)
            SearchPos.Pos.Update( CurPos, Depth );
            SearchPos.UpdatePos = true;
        }
    },

    Get_EndRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var LastPos = -1;
        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];
            if ( !((para_Drawing === Item.Type && true !== Item.Is_Inline) || para_End === Item.Type || (para_NewLine === Item.Type && break_Line === Item.BreakType ) ) )
                LastPos = CurPos + 1;
        }

        // Проверяем, попал ли хоть один элемент в данный отрезок, если нет, тогда не регистрируем такой ран
        if ( -1 !== LastPos )
        {
            SearchPos.Pos.Update( LastPos, Depth );
            return true;
        }
        else
            return false;
    },

    Get_StartRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var FirstPos = -1;
        for ( var CurPos = EndPos - 1; CurPos >= StartPos; CurPos-- )
        {
            var Item = this.Content[CurPos];
            if ( !(para_Drawing === Item.Type && true !== Item.Is_Inline) )
                FirstPos = CurPos;
        }

        // Проверяем, попал ли хоть один элемент в данный отрезок, если нет, тогда не регистрируем такой ран
        if ( -1 !== FirstPos )
        {
            SearchPos.Pos.Update( FirstPos, Depth );
            return true;
        }
        else
            return false;
    },

    Get_StartPos : function(ContentPos, Depth)
    {
        ContentPos.Update( 0, Depth );
    },

    Get_EndPos : function(BehindEnd, ContentPos, Depth)
    {
        var ContentLen = this.Content.length;

        if ( true === BehindEnd )
            ContentPos.Update( ContentLen, Depth );
        else
        {
            for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
            {
                if ( para_End === this.Content[CurPos].Type )
                {
                    ContentPos.Update( CurPos, Depth );
                    return;
                }
            }

            // Не нашли para_End
            ContentPos.Update( ContentLen, Depth );
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
    Set_SelectionContentPos : function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        var StartPos = 0;
        switch (StartFlag)
        {
            case  1: StartPos = 0; break;
            case -1: StartPos = this.Content.length; break;
            case  0: StartPos = StartContentPos.Get(Depth); break;
        }

        var EndPos = 0;
        switch (EndFlag)
        {
            case  1: EndPos = 0; break;
            case -1: EndPos = this.Content.length; break;
            case  0: EndPos = EndContentPos.Get(Depth); break;
        }

        var Selection = this.State.Selection;
        Selection.StartPos = StartPos;
        Selection.EndPos   = EndPos;
        Selection.Use      = true;
    },

    Selection_Stop : function()
    {
    },

    Selection_Remove : function()
    {
        var Selection = this.State.Selection;

        Selection.Use      = false;
        Selection.StartPos = 0;
        Selection.EndPos   = 0;
    },

    Select_All : function(Direction)
    {
        var Selection = this.State.Selection;

        Selection.Use      = true;

        if ( -1 === Direction )
        {
            Selection.StartPos = this.Content.length;
            Selection.EndPos   = 0;
        }
        else
        {
            Selection.StartPos = 0;
            Selection.EndPos   = this.Content.length;
        }
    },

    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var Selection = this.State.Selection;
        var SelectionUse      = Selection.Use;
        var SelectionStartPos = Selection.StartPos;
        var SelectionEndPos   = Selection.EndPos;

        if ( SelectionStartPos > SelectionEndPos )
        {
            SelectionStartPos = Selection.EndPos;
            SelectionEndPos   = Selection.StartPos;
        }

        var FindStart = SelectionDraw.FindStart;

        var NumItem = ( true === this.RecalcInfo.NumberingUse ? this.Paragraph.Numbering.Item : null );

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var DrawSelection = false;

            if ( NumItem === Item )
            {
                if ( true === FindStart )
                    SelectionDraw.StartX += this.Paragraph.Numbering.WidthVisible;
                else // Такого не должно быть
                    SelectionDraw.W += this.Paragraph.Numbering.WidthVisible;
            }

            if ( true === FindStart )
            {
                if ( true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos )
                {
                    FindStart = false;

                    DrawSelection = true;
                }
                else
                {
                    SelectionDraw.StartX += Item.WidthVisible;
                }
            }
            else
            {
                if ( true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos )
                {
                    DrawSelection = true;
                }
            }

            if ( true === DrawSelection )
            {
                if ( para_Drawing === Item.Type && true !== Item.Is_Inline() )
                    Item.Draw_Selection();
                else
                    SelectionDraw.W += Item.WidthVisible;
            }
        }

        SelectionDraw.FindStart = FindStart;
    },

    Selection_IsEmpty : function(CheckEnd)
    {
        var Selection = this.State.Selection;
        if ( true !== Selection.Use )
            return true;

        var StartPos = Selection.StartPos;
        var EndPos   = Selection.EndPos;

        if ( StartPos > EndPos )
        {
            StartPos = Selection.EndPos;
            EndPos   = Selection.StartPos;
        }

        if ( true === CheckEnd )
            return ( EndPos > StartPos ? false : true );
        else
        {
            for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
            {
                if ( para_End !== this.Content[CurPos].Type )
                    return false;
            }
        }

        return true;
    },

    Selection_CheckParaEnd : function()
    {
        var Selection = this.State.Selection;
        if ( true !== Selection.Use )
            return false;

        var StartPos = Selection.StartPos;
        var EndPos   = Selection.EndPos;

        if ( StartPos > EndPos )
        {
            StartPos = Selection.EndPos;
            EndPos   = Selection.StartPos;
        }

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( para_End === Item.Type )
                return true;
        }

        return false;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с настройками текста свойств
//-----------------------------------------------------------------------------------
    Recalc_CompiledPr : function(RecalcMeasure)
    {
        this.RecalcInfo.TextPr  = true;

        // Если изменение какой-то текстовой настройки требует пересчета элементов
        if ( true === RecalcMeasure )
            this.RecalcInfo.Measure = true;
    },

    Get_CompiledPr : function(bCopy)
    {
        if ( true === this.RecalcInfo.TextPr )
        {
            this.CompiledPr = this.Internal_Compile_Pr();
            this.RecalcInfo.TextPr = false;
        }

        if ( false === bCopy )
            return this.CompiledPr;
        else
            return this.CompiledPr.Copy(); // Отдаем копию объекта, чтобы никто не поменял извне настройки стиля
    },

    Internal_Compile_Pr : function ()
    {
        if ( undefined === this.Parent )
        {
            // Сюда мы никогда не должны попадать, но на всякий случай,
            // чтобы не выпадало ошибок сгенерим дефолтовые настройки
            var TextPr = new CTextPr();
            TextPr.Init_Default();
            return new CTextPr();
        }

        // Получим настройки текста, для данного параграфа
        var TextPr = this.Parent.Get_CompiledPr2(false).TextPr.Copy();

        // Если в прямых настройках задан стиль, тогда смержим настройки стиля
        if ( undefined != this.Pr.RStyle )
        {
            var Styles = this.Document.Get_Styles();
            var StyleTextPr = Styles.Get_Pr( this.Pr.RStyle, styletype_Character ).TextPr;
            TextPr.Merge( StyleTextPr );
        }

        // Мержим прямые настройки данного рана
        TextPr.Merge( this.Pr );

        // Для совместимости со старыми версиями запишем FontFamily
        TextPr.FontFamily.Name  = TextPr.RFonts.Ascii.Name;
        TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;

        return TextPr;
    },

    // В данной функции мы жестко меняем настройки на те, которые пришли (т.е. полностью удаляем старые)
    Set_Pr : function(TextPr)
    {
        var OldValue = this.Pr;
        this.Pr = Value;

        History.Add( this, { Type : historyitem_ParaRun_TextPr, New : Value, Old : OldValue } );
        this.Recalc_CompiledPr(true);
    },

    // В данной функции мы применяем приходящие настройки поверх старых, т.е. старые не удаляем
    Apply_Pr : function(TextPr)
    {
        if ( undefined != TextPr.Bold )
            this.Set_Bold( TextPr.Bold );

        if ( undefined != TextPr.Italic )
            this.Set_Italic( TextPr.Italic );

        if ( undefined != TextPr.Strikeout )
            this.Set_Strikeout( TextPr.Strikeout );

        if ( undefined != TextPr.Underline )
            this.Set_Underline( TextPr.Underline );

        if ( undefined != TextPr.FontSize )
            this.Set_FontSize( TextPr.FontSize );

        if ( undefined != TextPr.Color )
            this.Set_Color( TextPr.Color );

        if ( undefined != TextPr.VertAlign )
            this.Set_VertAlign( TextPr.VertAlign );

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( TextPr.HighLight );

        if ( undefined != TextPr.RStyle )
            this.Set_RStyle( TextPr.RStyle );

        if ( undefined != TextPr.Spacing )
            this.Set_Spacing( TextPr.Spacing );

        if ( undefined != TextPr.DStrikeout )
            this.Set_DStrikeout( TextPr.DStrikeout );

        if ( undefined != TextPr.Caps )
            this.Set_Caps( TextPr.Caps );

        if ( undefined != TextPr.SmallCaps )
            this.Set_SmallCaps( TextPr.SmallCaps );

        if ( undefined != TextPr.Position )
            this.Set_Position( TextPr.Position );

        if ( undefined != TextPr.RFonts )
            this.Set_RFonts2( TextPr.RFonts );

        if ( undefined != TextPr.Lang )
            this.Set_Lang( TextPr.Lang );
    },

    Set_Bold : function(Value)
    {
        if ( Value !== this.Pr.Bold )
        {
            var OldValue = this.Pr.Bold;
            this.Pr.Bold = Value;

            History.Add( this, { Type : historyitem_ParaRun_Bold, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr(true);
        }
    },

    Get_Bold : function()
    {
        return this.Get_CompiledPr(false).Bold;
    },

    Set_Italic : function(Value)
    {
        if ( Value !== this.Pr.Italic )
        {
            var OldValue = this.Pr.Italic;
            this.Pr.Italic = Value;

            History.Add( this, { Type : historyitem_ParaRun_Italic, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( true );
        }
    },

    Get_Italic : function()
    {
        return this.Get_CompiledPr(false).Italic;
    },

    Set_Strikeout : function(Value)
    {
        if ( Value !== this.Pr.Strikeout )
        {
            var OldValue = this.Pr.Strikeout;
            this.Pr.Strikeout = Value;

            History.Add( this, { Type : historyitem_ParaRun_Strikeout, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( false );
        }
    },

    Get_Strikeout : function()
    {
        return this.Get_CompiledPr(false).Strikeout;
    },

    Set_Underline : function(Value)
    {
        if ( Value !== this.Pr.Underline )
        {
            var OldValue = this.Pr.Underline;
            this.Pr.Underline = Value;

            History.Add( this, { Type : historyitem_ParaRun_Underline, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( false );
        }
    },

    Get_Underline : function()
    {
        return this.Get_CompiledPr(false).Underline;
    },

    Set_FontSize : function(Value)
    {
        if ( Value !== this.Pr.FontSize )
        {
            var OldValue = this.Pr.FontSize;
            this.Pr.FontSize = Value;

            History.Add( this, { Type : historyitem_ParaRun_FontSize, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( true );
        }
    },

    Get_FontSize : function()
    {
        return this.Get_CompiledPr(false).FontSize;
    },

    Set_Color : function(Value)
    {
        if ( ( undefined === Value && undefined !== this.Pr.Color ) || ( Value instanceof CDocumentColor && ( undefined === this.Pr.Color || false === Value.Compare(this.Pr.Color) ) ) )
        {
            var OldValue = this.Pr.Color;
            this.Pr.Color = Value;

            History.Add( this, { Type : historyitem_ParaRun_Color, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( false );
        }
    },

    Get_Color : function()
    {
        return this.Get_CompiledPr(false).Color;
    },

    Set_VertAlign : function(Value)
    {
        if ( Value !== this.Pr.Value )
        {
            var OldValue = this.Pr.VertAlign;
            this.Pr.VertAlign = Value;

            History.Add( this, { Type : historyitem_ParaRun_VertAlign, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( true );
        }
    },

    Get_VertAlign : function()
    {
        return this.Get_CompiledPr(false).VertAlign;
    },

    Set_HighLight : function(Value)
    {
        var OldValue = this.Pr.HighLight;
        if ( (undefined === Value && undefined !== OldValue) || ( highlight_None === Value && highlight_None !== OldValue ) || ( Value instanceof CDocumentColor && ( undefined === OldValue || highlight_None === OldValue || false === Value.Compare(OldValue) ) ) )
        {
            this.Pr.HighLight = Value;
            History.Add( this, { Type : historyitem_ParaRun_HighLight, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( false );
        }
    },

    Get_HighLight : function()
    {
        return this.Get_CompiledPr(false).HighLight;
    },

    Set_RStyle : function(Value)
    {
        if ( Value !== this.Pr.RStyle )
        {
            var OldValue = this.Pr.RStyle;
            this.Pr.RStyle = Value;

            History.Add( this, { Type : historyitem_ParaRun_RStyle, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( true );
        }
    },

    Set_Spacing : function(Value)
    {
        if ( Value !== this.Pr.Value )
        {
            var OldValue = this.Pr.Spacing;
            this.Pr.Spacing = Value;

            History.Add( this, { Type : historyitem_ParaRun_Spacing, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( true );
        }
    },

    Get_Spacing : function()
    {
        return this.Get_CompiledPr(false).Spacing;
    },

    Set_DStrikeout : function(Value)
    {
        if ( Value !== this.Pr.Value )
        {
            var OldValue = this.Pr.DStrikeout;
            this.Pr.DStrikeout = Value;

            History.Add( this, { Type : historyitem_ParaRun_DStrikeout, New : Value, Old : OldValue } );

            this.Recalc_CompiledPr( false );
        }
    },

    Get_DStrikeout : function()
    {
        return this.Get_CompiledPr(false).DStrikeout;
    },

    Set_Caps : function(Value)
    {
        if ( Value !== this.Pr.Caps )
        {
            var OldValue = this.Pr.Caps;
            this.Pr.Caps = Value;

            History.Add( this, { Type : historyitem_ParaRun_Caps, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr( true );
        }
    },

    Get_Caps : function()
    {
        return this.Get_CompiledPr(false).Caps;
    },

    Set_SmallCaps : function(Value)
    {
        if ( Value !== this.Pr.SmallCaps )
        {
            var OldValue = this.Pr.SmallCaps;
            this.Pr.SmallCaps = Value;

            History.Add( this, { Type : historyitem_ParaRun_SmallCaps, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr( true );
        }
    },

    Get_SmallCaps : function()
    {
        return this.Get_CompiledPr(false).SmallCaps;
    },

    Set_Position : function(Value)
    {
        if ( Value !== this.Pr.Position )
        {
            var OldValue = this.Pr.Position;
            this.Pr.Position = Value;

            History.Add( this, { Type : historyitem_ParaRun_Position, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr( false );
        }
    },

    Get_Position : function()
    {
        return this.Get_CompiledPr(false).Position;
    },

    Set_RFonts : function(Value)
    {
        var OldValue = this.Pr.RFonts;
        this.Pr.RFonts = Value;

        History.Add( this, { Type : historyitem_ParaRun_RFonts, New : Value, Old : OldValue } );

        this.Recalc_CompiledPr( true );
    },

    Get_RFonts : function()
    {
        return this.Get_CompiledPr(false).RFonts;
    },

    Set_RFonts2 : function(RFonts)
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
    },

    Set_RFonts_Ascii : function(Value)
    {
        if ( Value !== this.Pr.RFonts.Ascii )
        {
            var OldValue = this.Pr.RFonts.Ascii;
            this.Pr.RFonts.Ascii = Value;

            History.Add( this, { Type : historyitem_ParaRun_RFonts_Ascii, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(true);
        }
    },

    Set_RFonts_HAnsi : function(Value)
    {
        if ( Value !== this.Pr.RFonts.HAnsi )
        {
            var OldValue = this.Pr.RFonts.HAnsi;
            this.Pr.RFonts.HAnsi = Value;

            History.Add( this, { Type : historyitem_ParaRun_RFonts_HAnsi, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(true);
        }
    },

    Set_RFonts_CS : function(Value)
    {
        if ( Value !== this.Pr.RFonts.CS )
        {
            var OldValue = this.Pr.RFonts.CS;
            this.Pr.RFonts.CS = Value;

            History.Add( this, { Type : historyitem_ParaRun_RFonts_CS, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(true);
        }
    },

    Set_RFonts_EastAsia : function(Value)
    {
        if ( Value !== this.Pr.RFonts.EastAsia )
        {
            var OldValue = this.Pr.RFonts.EastAsia;
            this.Pr.RFonts.EastAsia = Value;

            History.Add( this, { Type : historyitem_ParaRun_RFonts_EastAsia, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(true);
        }
    },

    Set_RFonts_Hint : function(Value)
    {
        if ( Value !== this.Pr.RFonts.Hint )
        {
            var OldValue = this.Pr.RFonts.Hint;
            this.Pr.RFonts.Hint = Value;

            Hstory.Add( this, { Type : historyitem_ParaRun_RFonts_Hint, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(true);
        }
    },

    Set_Lang : function(Value)
    {
        var OldValue = this.Pr.Lang;

        this.Pr.Lang = new CLang();
        if ( undefined != Value )
            this.Pr.Lang.Set_FromObject( Value );

        History.Add( this, { Type : historyitem_ParaRun_Lang, New : NewValue, Old : OldValue } );
        this.Recalc_CompiledPr(false);
    },

    Set_Lang_Bidi : function(Value)
    {
        if ( Value !== this.Pr.Land.Bidi )
        {
            var OldValue = this.Pr.Lang.Bidi;
            this.Pr.Lang.Bidi = Value;

            History.Add( this, { Type : historyitem_ParaRun_Lang_Bidi, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(false);
        }
    },

    Set_Lang_EastAsia : function(Value)
    {
        if ( Value !== this.Pr.Lang.EastAsia )
        {
            var OldValue = this.Pr.Lang.EastAsia;
            this.Pr.Lang.EastAsia = Value;

            History.Add( this, { Type : historyitem_ParaRun_Lang_EastAsia, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(false);
        }
    },

    Set_Lang_Val : function(Value)
    {
        if ( Value !== this.Pr.Lang.Val )
        {
            var OldValue = this.Pr.Lang.Val;
            this.Pr.Lang.Val = Value;

            History.Add( this, { Type : historyitem_ParaRun_Lang_Val, New : Value, Old : OldValue } );
            this.Recalc_CompiledPr(false);
        }
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
        }
    },

//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {

    },

    Load_Changes : function(Reader)
    {

    }

};

function CParaRunSelection()
{
    this.Use      = false;
    this.StartPos = false;
    this.EndPos   = false;
}

function CParaRunState()
{
    this.Selection  = new CParaRunSelection();
    this.ContentPos = 0;
}

function CParaRunRecalcInfo()
{
    this.TextPr  = true; // Нужно ли пересчитать скомпилированные настройки
    this.Measure = true; // Нужно ли перемерять элементы
    this.Recalc  = true; // Нужно ли пересчитывать (только если текстовый ран)
    this.RunLen  = 0;

    // Далее идут параметры, которые выставляются после пересчета данного Range, такие как пересчитывать ли нумерацию
    this.NumberingItem = null;
    this.NumberingUse  = false; // Используется ли нумерация в данном ране
    this.NumberingAdd  = true;  // Нужно ли в следующем ране использовать нумерацию
}

CParaRunRecalcInfo.prototype =
{

};

function CParaRunRange(StartPos, EndPos)
{
    this.StartPos = StartPos; // Начальная позиция в контенте, с которой начинается данный отрезок
    this.EndPos   = EndPos;   // Конечная позиция в контенте, на которой заканчивается данный отрезок (перед которой)
}

function CParaRunLine()
{
    this.Ranges       = [];
    this.Ranges[0]    = new CParaRunRange( 0, 0 );
    this.RangesLength = 0;
}

CParaRunLine.prototype =
{
    Add_Range : function(RangeIndex, StartPos, EndPos)
    {
        if ( 0 !== RangeIndex )
        {
            this.Ranges[RangeIndex] = new CParaRunRange( StartPos, EndPos );
            this.RangesLength  = RangeIndex + 1;
        }
        else
        {
            this.Ranges[0].StartPos = StartPos;
            this.Ranges[0].EndPos   = EndPos;
            this.RangesLength = 1;
        }
    },

    Copy : function()
    {
        var NewLine = new CParaRunLine();

        NewLine.RangesLength = this.RangesLength;

        for ( var CurRange = 0; CurRange < this.RangesLength; CurRange++ )
        {
            var Range = this.Ranges[CurRange];
            NewLine.Ranges[CurRange] = new CParaRunRange( Range.StartPos, Range.EndPos );
        }

        return NewLine;
    },


    Compare : function(OtherLine)
    {
        if ( this.RangesLength !== OtherLine.RangesLength )
            return false;

        for ( var CurRange = 0; CurRange < this.RangesLength; CurRange++ )
        {
            var OtherRange = OtherLine.Ranges[CurRange];
            var ThisRange  = this.Ranges[CurRange];

            if ( OtherRange.StartPos !== ThisRange.StartPos || OtherRange.EndPos !== ThisRange.EndPos )
                return false;
        }

        return true;
    }


};

// Метка о конце или начале изменений пришедших от других соавторов документа
var pararun_CollaborativeMark_Start = 0x00;
var pararun_CollaborativeMark_End   = 0x01;

function CParaRunCollaborativeMark(Pos, Type)
{
    this.Pos  = Pos;
    this.Type = Type;
}
