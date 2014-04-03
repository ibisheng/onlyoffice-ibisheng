/**
 * User: Ilja.Kirillov
 * Date: 03.12.13
 * Time: 18:28
 */

function ParaRun(Paragraph, bMathRun, Parent)
{
    this.Id         = g_oIdCounter.Get_NewId();  // Id данного элемента
    this.Type       = para_Run;                  // тип данного элемента
    this.Paragraph  = Paragraph;                 // Ссылка на параграф
    this.Pr         = new CTextPr();             // Текстовые настройки данного run
    this.Content    = new Array();               // Содержимое данного run
    this.State      = new CParaRunState();       // Положение курсора и селекта в данного run
    this.Selection  = this.State.Selection;
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

    this.CollaborativeMarks = new CRunCollaborativeMarks();
    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    this.NearPosArray  = new Array();
    this.SearchMarks   = new Array();
    this.SpellingMarks = new Array();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );

    if(bMathRun)
    {
        this.typeObj = MATH_PARA_RUN;
        this.Parent = Parent;
        this.size =
        {
            ascent: 0,
            height: 0,
            width: 0
        };
    }
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

    Get_Paragraph : function()
    {
        return this.Paragraph;
    },

    Set_Paragraph : function(Paragraph)
    {
        this.Paragraph = Paragraph;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с содержимым данного рана
//-----------------------------------------------------------------------------------
    Copy : function(Selected)
    {
        var NewRun = new ParaRun(this.Paragraph);

        NewRun.Set_Pr( this.Pr.Copy() );

        var StartPos = 0;
        var EndPos   = this.Content.length;

        if ( true === Selected && true === this.State.Selection.Use )
        {
            StartPos = this.State.Selection.StartPos;
            EndPos   = this.State.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.State.Selection.EndPos;
                EndPos   = this.State.Selection.StartPos;
            }
        }

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            // TODO: Как только перенесем para_End в сам параграф (как и нумерацию) убрать здесь
            if ( para_End !== Item.Type )
                NewRun.Add_ToContent( CurPos - StartPos, Item.Copy(), false );
        }

        return NewRun;
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    },

    Get_Text : function(Text)
    {
        if ( null === Text.Text )
            return;

        var ContentLen = this.Content.length;

        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var bBreak = false;

            switch ( Item.Type )
            {
                case para_Drawing:
                case para_End:
                case para_PageNum:
                {
                    Text.Text = null;
                    bBreak = true;
                    break;
                }

                case para_Text : Text.Text += Item.Value; break;
                case para_Space:
                case para_Tab  : Text.Text += " "; break;
            }

            if ( true === bBreak )
                break;
        }
    },

    // Проверяем пустой ли ран
    Is_Empty : function(Props)
    {
        var SkipAnchor = (undefined !== Props ? Props.SkipAnchor : false);
        var SkipEnd    = (undefined !== Props ? Props.SkipEnd    : false);

        var Count = this.Content.length;

        if ( true !== SkipAnchor && true !== SkipEnd )
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

                if ( ( true !== SkipAnchor || para_Drawing !== Item.Type || false !== Item.Is_Inline() ) && ( true !== SkipEnd || para_End !== Item.Type ) )
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

    Remove : function(Direction, bOnAddText)
    {
        var Selection = this.State.Selection;

        if ( true === Selection.Use )
        {
            var StartPos = Selection.StartPos;
            var EndPos   = Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            // Если в выделение попадает ParaEnd, тогда удаляем все кроме этого элемента
            if ( true === this.Selection_CheckParaEnd() )
            {
                for ( var CurPos = EndPos - 1; CurPos >= StartPos; CurPos-- )
                {
                    if ( para_End !== this.Content[CurPos].Type )
                        this.Remove_FromContent( CurPos, 1, true );
                }
            }
            else
            {
                this.Remove_FromContent( StartPos, EndPos - StartPos, true );
            }

            this.Selection_Remove();
            this.State.ContentPos = StartPos;
        }
        else
        {
            var CurPos = this.State.ContentPos;

            if ( Direction < 0 )
            {
                if ( CurPos <= 0 )
                    return false;

                // Проверяем, возможно предыдущий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                if ( para_Drawing == this.Content[CurPos - 1].Type && true === this.Content[CurPos - 1].Is_Inline() )
                {
                    return this.Paragraph.Parent.Select_DrawingObject( this.Content[CurPos - 1].Get_Id() );
                }

                this.Remove_FromContent( CurPos - 1, 1, true );

                this.State.ContentPos = CurPos - 1;
            }
            else
            {
                if ( CurPos >= this.Content.length || para_End === this.Content[CurPos].Type )
                    return false;

                // Проверяем, возможно следующий элемент - инлайн картинка, тогда мы его не удаляем, а выделяем как картинку
                if ( para_Drawing == this.Content[CurPos].Type && true === this.Content[CurPos].Is_Inline() )
                {
                    return this.Paragraph.Parent.Select_DrawingObject( this.Content[CurPos].Get_Id() );
                }

                this.Remove_FromContent( CurPos, 1, true );

                this.State.ContentPos = CurPos;
            }
        }

        return true;
    },

    Remove_ParaEnd : function()
    {
        var Pos = -1;

        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            if ( para_End === this.Content[CurPos].Type )
            {
                Pos = CurPos;
                break;
            }
        }

        if ( -1 === Pos )
            return false;

        this.Remove_FromContent( Pos, ContentLen - Pos, true );

        return true;
    },

    // Добавляем элемент в позицию с сохранием в историю
    Add_ToContent : function(Pos, Item, UpdatePosition)
    {
        History.Add( this, { Type : historyitem_ParaRun_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
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

                // Особый случай, когда мы добавляем элемент в самый последний ран
                if ( Pos === this.Content.length - 1 && LinesCount - 1 === CurLine )
                {
                    this.Lines[CurLine].Ranges[RangesCount - 1].EndPos++;
                }
            }
        }

        // Обновляем позиции в NearestPos
        var NearPosLen = this.NearPosArray.length;
        for ( var Index = 0; Index < NearPosLen; Index++ )
        {
            var RunNearPos = this.NearPosArray[Index];
            var ContentPos = RunNearPos.NearPos.ContentPos;
            var Depth      = RunNearPos.Depth;

            if ( ContentPos.Data[Depth] >= Pos )
                ContentPos.Data[Depth]++;
        }

        // Обновляем позиции в поиске
        var SearchMarksCount = this.SearchMarks.length;
        for ( var Index = 0; Index < SearchMarksCount; Index++ )
        {
            var Mark       = this.SearchMarks[Index];
            var ContentPos = ( true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos );
            var Depth      = Mark.Depth;

            if ( ContentPos.Data[Depth] >= Pos )
                ContentPos.Data[Depth]++;
        }

        // Обновляем позиции для орфографии
        var SpellingMarksCount = this.SpellingMarks.length;
        for ( var Index = 0; Index < SpellingMarksCount; Index++ )
        {
            var Mark       = this.SpellingMarks[Index];
            var ContentPos = ( true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos );
            var Depth      = Mark.Depth;

            if ( ContentPos.Data[Depth] >= Pos )
                ContentPos.Data[Depth]++;
        }

        this.Paragraph.SpellChecker.Update_OnAdd( this, Pos, Item );

        // Обновляем позиции меток совместного редактирования
        this.CollaborativeMarks.Update_OnAdd( Pos );

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
            if ( true === this.State.Selection.Use )
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
        }

        // Обновляем позиции в NearestPos
        var NearPosLen = this.NearPosArray.length;
        for ( var Index = 0; Index < NearPosLen; Index++ )
        {
            var RunNearPos = this.NearPosArray[Index];
            var ContentPos = RunNearPos.NearPos.ContentPos;
            var Depth      = RunNearPos.Depth;

            if ( ContentPos.Data[Depth] > Pos + Count )
                ContentPos.Data[Depth] -= Count;
            else if ( ContentPos.Data[Depth] > Pos )
                ContentPos.Data[Depth] = Math.max( 0 , Pos );
        }

        // Обновляем позиции в поиске
        var SearchMarksCount = this.SearchMarks.length;
        for ( var Index = 0; Index < SearchMarksCount; Index++ )
        {
            var Mark       = this.SearchMarks[Index];
            var ContentPos = ( true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos );
            var Depth      = Mark.Depth;

            if ( ContentPos.Data[Depth] > Pos + Count )
                ContentPos.Data[Depth] -= Count;
            else if ( ContentPos.Data[Depth] > Pos )
                ContentPos.Data[Depth] = Math.max( 0 , Pos );
        }

        // Обновляем позиции для орфографии
        var SpellingMarksCount = this.SpellingMarks.length;
        for ( var Index = 0; Index < SpellingMarksCount; Index++ )
        {
            var Mark       = this.SpellingMarks[Index];
            var ContentPos = ( true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos );
            var Depth      = Mark.Depth;

            if ( ContentPos.Data[Depth] > Pos + Count )
                ContentPos.Data[Depth] -= Count;
            else if ( ContentPos.Data[Depth] > Pos )
                ContentPos.Data[Depth] = Math.max( 0 , Pos );
        }

        this.Paragraph.SpellChecker.Update_OnRemove( this, Pos, Count );

        // Обновляем позиции меток совместного редактирования
        this.CollaborativeMarks.Update_OnRemove( Pos, Count );

        // Отмечаем, что надо перемерить элементы в данном ране
        this.RecalcInfo.Measure = true;
    },

    Concat_ToContent : function(NewItems)
    {
        var StartPos = this.Content.length;
        this.Content = this.Content.concat( NewItems );

        History.Add( this, { Type : historyitem_ParaRun_AddItem, Pos : StartPos, EndPos : this.Content.length - 1, Items : NewItems } );

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

        // Значит курсор стоит в самом конце, поэтому посылаем последний отрезок
        return new CParaPos( ( LinesCount <= 1 ? this.Lines[0].RangesLength - 1 + this.StartRange : this.Lines[LinesCount - 1].RangesLength - 1 ), LinesCount - 1 + this.StartLine, 0, 0 );
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

        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        var Pos = StartPos;
        var _EndPos = ( true === CurrentRun ? Math.min( EndPos, this.State.ContentPos ) : EndPos );
        for ( ; Pos < _EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

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
        if ( historyitem_ParaRun_AddItem === Type || historyitem_ParaRun_RemoveItem === Type )
            return true;

        return false;
    },

    // Возвращаем строку и отрезок, в котором произошли простейшие изменения
    Get_SimpleChanges_ParaPos : function(Changes)
    {
        var Change = Changes[0].Data;
        var Type   = Changes[0].Data.Type;
        var Pos    = Change.Pos;

        var CurLine  = 0;
        var CurRange = 0;

        var LinesCount = this.LinesLength;
        for ( ; CurLine < LinesCount; CurLine++ )
        {
            var RangesCount = this.Lines[CurLine].RangesLength;
            for ( CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Lines[CurLine].Ranges[CurRange];
                if  ( ( historyitem_ParaRun_AddItem === Type && Pos < Range.EndPos && Pos >= Range.StartPos ) || ( historyitem_ParaRun_RemoveItem === Type && Pos < Range.EndPos && Pos >= Range.StartPos ) || ( historyitem_ParaRun_RemoveItem === Type && Pos >= Range.EndPos && CurLine === LinesCount - 1 && CurRange === RangesCount - 1 ) )
                {
                    // Если отрезок остается пустым, тогда надо все заново пересчитывать
                    if ( Range.StartPos === Range.EndPos )
                        return null;

                    return new CParaPos( ( CurLine === 0 ? CurRange + this.StartRange : CurRange ), CurLine + this.StartLine, 0, 0 );
                }
            }
        }

        // Если отрезок остается пустым, тогда надо все заново пересчитывать
        if ( this.Range.StartPos === this.Range.EndPos )
            return null;

        return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
    },

    Split : function (ContentPos, Depth)
    {
        var CurPos = ContentPos.Get(Depth);

        // Создаем новый ран
        var NewRun = new ParaRun(this.Paragraph);

        // Копируем настройки
        NewRun.Set_Pr( this.Pr.Copy() );

        // Разделяем содержимое по ранам
        NewRun.Concat_ToContent( this.Content.slice(CurPos) );
        this.Remove_FromContent( CurPos, this.Content.length - CurPos, true );

        // Если были точки орфографии, тогда переместим их в новый ран
        var SpellingMarksCount = this.SpellingMarks.length;
        for ( var Index = 0; Index < SpellingMarksCount; Index++ )
        {
            var Mark    = this.SpellingMarks[Index];
            var MarkPos = ( true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth) );

            if ( MarkPos >= ContentPos )
            {
                var MarkElement = Mark.Element;
                if ( true === Mark.Start )
                {
                    MarkElement.ClassesS[Mark.Depth]       = NewRun;
                    MarkElement.StartPos.Data[Mark.Depth] -= ContentPos;
                }
                else
                {
                    MarkElement.ClassesE[Mark.Depth]     = NewRun;
                    MarkElement.EndPos.Data[Mark.Depth] -= ContentPos;
                }

                NewRun.SpellingMarks.push( Mark );

                this.SpellingMarks.splice( Index, 1 );
                SpellingMarksCount--;
                Index--;
            }
        }

        return NewRun;
    },

    Check_NearestPos : function(ParaNearPos, Depth)
    {
        var RunNearPos = new CParagraphElementNearPos();
        RunNearPos.NearPos = ParaNearPos.NearPos;
        RunNearPos.Depth   = Depth;

        this.NearPosArray.push( RunNearPos );
        ParaNearPos.Classes.push( this );
    },

    Get_DrawingObjectRun : function(Id)
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
                return this;
        }

        return null;
    },

    Get_DrawingObjectContentPos : function(Id, ContentPos, Depth)
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
            {
                ContentPos.Update( CurPos, Depth );
                return true;
            }
        }

        return false;
    },

    Remove_DrawingObject : function(Id)
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            if ( para_Drawing === Element.Type && Id === Element.Get_Id() )
            {
                this.Remove_FromContent( CurPos, 1 );
                return;
            }
        }
    },

    Get_Layout : function(DrawingLayout, UseContentPos, ContentPos, Depth)
    {
        var CurLine  = DrawingLayout.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? DrawingLayout.Range - this.StartRange : DrawingLayout.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        var CurContentPos = ( true === UseContentPos ? ContentPos.Get(Depth) : -1 );

        var CurPos = StartPos;
        for ( ; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( CurContentPos === CurPos )
                break;

            switch ( Item.Type )
            {
                case para_Text:
                case para_Space:
                case para_PageNum:
                {
                    DrawingLayout.LastW = Item.WidthVisible;

                    break;
                }
                case para_Drawing:
                {
                    if ( true === Item.Is_Inline() || true === DrawingLayout.Paragraph.Parent.Is_DrawingShape() )
                    {
                        DrawingLayout.LastW = Item.WidthVisible;
                    }

                    break;
                }
            }

            DrawingLayout.X += Item.WidthVisible;
        }

        if ( CurContentPos === CurPos )
        {
            var Para    = DrawingLayout.Paragraph;
            var CurPage = DrawingLayout.Page;
            var Drawing = DrawingLayout.Drawing;

            var DrawingObjects = Para.Parent.DrawingObjects;
            var PageLimits     = Para.Parent.Get_PageLimits(Para.PageNum + CurPage);
            var PageFields     = Para.Parent.Get_PageFields(Para.PageNum + CurPage);

            var ColumnStartX = (0 === CurPage ? Para.X_ColumnStart : Para.Pages[CurPage].X);
            var ColumnEndX   = (0 === CurPage ? Para.X_ColumnEnd   : Para.Pages[CurPage].XLimit);

            var Top_Margin    = Y_Top_Margin;
            var Bottom_Margin = Y_Bottom_Margin;
            var Page_H        = Page_Height;

            if ( true === Para.Parent.Is_TableCellContent() && undefined != Drawing && true == Drawing.Use_TextWrap() )
            {
                Top_Margin    = 0;
                Bottom_Margin = 0;
                Page_H        = 0;
            }

            if ( undefined != Drawing && true != Drawing.Use_TextWrap() )
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

            DrawingLayout.Layout = new CParagraphLayout( DrawingLayout.X, DrawingLayout.Y , Para.Get_StartPage_Absolute() + CurPage, DrawingLayout.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y );
            DrawingLayout.Limits = PageLimits;
        }
    },

    Get_NextRunElements : function(RunElements, UseContentPos, Depth)
    {
        var StartPos   = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) : 0 );
        var ContentLen = this.Content.length;

        for ( var CurPos = StartPos; CurPos < ContentLen; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;

            if ( para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType )
            {
                RunElements.Elements.push( Item );
                RunElements.Count--;

                if ( RunElements.Count <= 0 )
                    return;
            }
        }
    },

    Get_PrevRunElements : function(RunElements, UseContentPos, Depth)
    {
        var StartPos   = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) - 1 : this.Content.length - 1 );
        var ContentLen = this.Content.length;

        for ( var CurPos = StartPos; CurPos >= 0; CurPos-- )
        {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;

            if ( para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType )
            {
                RunElements.Elements.push( Item );
                RunElements.Count--;

                if ( RunElements.Count <= 0 )
                    return;
            }
        }
    },

    Collect_DocumentStatistics : function(ParaStats)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];

            var bSymbol  = false;
            var bSpace   = false;
            var bNewWord = false;

            if ( (para_Text === Item.Type && false === Item.Is_NBSP()) || (para_PageNum === Item.Type) )
            {
                if ( false === ParaStats.Word )
                    bNewWord = true;

                bSymbol = true;
                bSpace  = false;

                ParaStats.Word           = true;
                ParaStats.EmptyParagraph = false;
            }
            else if ( ( para_Text === Item.Type && true === Item.Is_NBSP() ) || para_Space === Item.Type || para_Tab === Item.Type )
            {
                bSymbol = true;
                bSpace  = true;

                ParaStats.Word = false;
            }

            if ( true === bSymbol )
                ParaStats.Stats.Add_Symbol( bSpace );

            if ( true === bNewWord )
                ParaStats.Stats.Add_Word();
        }
    },

    Create_FontMap : function(Map)
    {
        var TextPr = this.Get_CompiledPr(false);
        TextPr.Document_CreateFontMap( Map );
    },

    Get_AllFontNames : function(AllFonts)
    {
        this.Pr.Document_Get_AllFontNames( AllFonts );

        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Item = this.Content[Index];

            if ( para_Drawing === Item.Type )
                Item.documentGetAllFontNames( AllFonts );
        }
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    // Выставляем начальную строку и обнуляем массив строк
    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
        this.LinesLength = 0;
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
                Item.Parent          = this.Paragraph;
                Item.DocumentContent = this.Paragraph.Parent;
                Item.DrawingDocument = this.Paragraph.Parent.DrawingDocument;
            }

            Item.Measure( g_oTextMeasurer, Pr );
        }

        this.RecalcInfo.Recalc  = true;
        this.RecalcInfo.Measure = false;
    },

    Recalculate_Range : function(ParaPr, Depth)
    {
        var PRS = g_oPRSW;

        if ( this.Paragraph !== g_oPRSW.Paragraph )
        {
            this.Paragraph = g_oPRSW.Paragraph;
            this.RecalcInfo.TextPr = true;

            this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
        }

        // Сначала измеряем элементы (можно вызывать каждый раз, внутри разруливается, чтобы измерялось 1 раз)
        this.Recalculate_MeasureContent();

        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

        // Если мы рассчитываем первый отрезок в первой строке, тогда нам нужно обновить информацию о нумерации
        if ( 0 === CurRange && 0 === CurLine )
        {
            var PrevRecalcInfo = PRS.RunRecalcInfoLast;

            // Либо до этого ничего не было (изначально первая строка и первый отрезок), либо мы заново пересчитываем
            // первую строку и первый отрезок (из-за обтекания, например).
            if ( null === PrevRecalcInfo )
                this.RecalcInfo.NumberingAdd = true;
            else
                this.RecalcInfo.NumberingAdd = PrevRecalcInfo.NumberingAdd;

            this.RecalcInfo.NumberingUse  = false;
            this.RecalcInfo.NumberingItem = null;
        }

        // Сохраняем ссылку на информацию пересчета данного рана
        PRS.RunRecalcInfoLast = this.RecalcInfo;

        // Если это первый отрезок в данной строке, тогда нам надо добавить строку (первую строку не добавляем,
        // т.к. она всегда есть)
        if ( 0 === CurRange )
        {
            if ( 0 !== CurLine )
            {
                this.Lines[CurLine] = new CParaRunLine();
                this.LinesLength    = CurLine + 1;
            }
            else
            {
                this.LinesLength  = CurLine + 1;
            }
        }

        var Para = PRS.Paragraph;

        var RangeStartPos = 0;
        var RangeEndPos   = 0;

        // Вычислим RangeStartPos
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
            RangeStartPos = _Line.Ranges[CurRange - 1].EndPos;
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
            if ( false === StartWord && true === FirstItemOnLine && XEnd - X < 0.001 && RangesCount > 0 )
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
                    }

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

                        Item.YOffset = this.YOffset;

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
                    }
                    else
                    {
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

                            if ( null != Para.Get_DocumentPrev() && true != Para.Parent.Is_TableCellContent() && 0 === CurPage )
                            {
                                Para.Recalculate_Drawing_AddPageBreak( 0, 0, true );
                                PRS.RecalcResult = recalcresult_NextPage;
                                return;
                            }
                            else
                            {
                                if ( ParaLine != Para.Pages[CurPage].FirstLine )
                                {
                                    Para.Recalculate_Drawing_AddPageBreak( CurLine, CurPage, false );
                                    PRS.RecalcResult = recalcresult_NextPage;
                                    return;
                                }
                                else
                                {
                                    RangeEndPos  = Pos;
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
                    X += WordLen;

                    if ( true === Word )
                    {
                        EmptyLine   = false;
                        Word        = false;
                        X          += SpaceLen;
                        SpaceLen    = 0;
                    }

                    if ( break_Page === Item.BreakType )
                    {
                        if ( true === PRS.SkipPageBreak && Item === PRS.PageBreak )
                            continue;

                        Item.Flags.NewLine = true;

                        // PageBreak вне самого верхнего документа не надо учитывать
                        if ( !(Para.Parent instanceof CDocument) )
                        {
                            // TODO: Продумать, как избавиться от данного элемента, т.к. удалять его при пересчете нельзя,
                            //       иначе будут проблемы с совместным редактированием.

                            continue;
                        }

                        NewPage       = true;
                        NewRange      = true;
                        BreakPageLine = true;

                        PRS.PageBreak = Item;
                    }
                    else
                    {
                        NewRange  = true;
                        EmptyLine = false;
                    }

                    RangeEndPos = Pos + 1;

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

        if ( 0 === CurLine && 0 === CurRange )
        {
            this.Range.StartPos = RangeStartPos;
            this.Range.EndPos   = RangeEndPos;
            this.Lines[0].RangesLength = 1;

            if ( this.Lines[0].Ranges.length > 1 )
                this.Lines[0].Ranges.length = 1;
        }
        else
            this.Lines[CurLine].Add_Range( CurRange, RangeStartPos, RangeEndPos );

        this.RecalcInfo.Recalc = false;
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );
        var CurPos   = PRP.Get(Depth);

        this.Lines[CurLine].Ranges[CurRange].EndPos = CurPos;
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, _CurRange)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

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
                    PRSC.Range.W += PRSC.SpaceLen;

                    if ( PRSC.Range.Words > 1 )
                        PRSC.Range.Spaces += PRSC.SpacesCount;
                    else
                        PRSC.Range.SpacesSkip += PRSC.SpacesCount;

                    PRSC.Word        = false;
                    PRSC.SpacesCount = 0;
                    PRSC.SpaceLen    = 0;

                    if ( true === Item.Is_Inline() || true === PRSC.Paragraph.Parent.Is_DrawingShape() )
                        PRSC.Range.W += Item.Width;

                    break;
                }
                case para_PageNum:
                {
                    PRSC.Range.Words++;
                    PRSC.Range.W += PRSC.SpaceLen;

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

    Recalculate_Range_Spaces : function(PRSA, _CurLine, _CurRange, CurPage)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

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
                        if ( true === PRSA.RecalcFast )
                        {
                            // Если у нас быстрый пересчет, тогда мы не трогаем плавающие картинки
                            // TODO: Если здесь привязка к символу, тогда быстрый пересчет надо отменить
                            break;
                        }

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
                            Item.Update_Position( new CParagraphLayout( PRSA.X, PRSA.Y , Para.Get_StartPage_Absolute() + CurPage, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits);
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
                    var SectPr = PRSA.Paragraph.Get_SectionPr();
                    if ( undefined !== SectPr )
                    {
                        // Нас интересует следующая секция
                        var LogicDocument = PRSA.Paragraph.LogicDocument;
                        var NextSectPr = LogicDocument.SectionsInfo.Get_SectPr(PRSA.Paragraph.Index + 1).SectPr;

                        Item.Update_SectionPr(NextSectPr, PRSA.XEnd - PRSA.X);
                    }
                    else
                        Item.Clear_SectionPr();

                    PRSA.X += Item.Width;

                    break;
                }
                case para_NewLine:
                {
                    if ( break_Page === Item.BreakType )
                        Item.Update_String( PRSA.XEnd - PRSA.X );

                    PRSA.X += Item.WidthVisible;

                    break;
                }
            }
        }
    },

    Recalculate_PageEndInfo : function(PRSI, _CurLine, _CurRange)
    {
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
        this.Paragraph.Refresh_RecalcData2(0);
    },

    Save_Lines : function()
    {
        var RunLines = new CParagraphLinesInfo(this.StartLine, this.StartRange);

        for ( var CurLine = 0; CurLine < this.LinesLength; CurLine++ )
        {
            RunLines.Lines.push( this.Lines[CurLine].Copy() );
        }

        RunLines.LinesLength = this.LinesLength;

        return RunLines;
    },

    Restore_Lines : function(RunLines)
    {
        this.Lines       = RunLines.Lines;
        this.LinesLength = RunLines.LinesLength;
        this.Range       = this.Lines[0].Ranges[0];
    },

    Is_EmptyRange : function(_CurLine, _CurRange)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        if ( EndPos <= StartPos )
            return true;

        return false;
    },

    Check_BreakPageInRange : function(_CurLine, _CurRange)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Element = this.Content[CurPos];
            if ( para_NewLine === Element.Type && break_Page === Element.BreakType )
                return true;
        }

        return false;
    },

    Check_BreakPageEnd : function(PBChecker)
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            if ( true === PBChecker.FindPB )
            {
                if ( Element === PBChecker.PageBreak )
                {
                    PBChecker.FindPB = false;
                    PBChecker.PageBreak.Flags.NewLine = true;
                }
            }
            else
            {
                if ( para_End === Element.Type )
                    return true;
                else if ( para_Drawing !== Element.Type || drawing_Anchor !== Element.Get_DrawingType() )
                    return false;
            }
        }

        return true;
    },

    Recalculate_MinMaxContentWidth : function(MinMax)
    {
        this.Recalculate_MeasureContent();

        var bWord        = MinMax.bWord;
        var nWordLen     = MinMax.nWordLen;
        var nSpaceLen    = MinMax.nSpaceLen;
        var nMinWidth    = MinMax.nMinWidth;
        var nMaxWidth    = MinMax.nMaxWidth;
        var nCurMaxWidth = MinMax.nCurMaxWidth;

        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];

            switch( Item.Type )
            {
                case para_Text:
                {
                    if ( false === bWord )
                    {
                        bWord    = true;
                        nWordLen = Item.Width;
                    }
                    else
                    {
                        nWordLen += Item.Width;

                        if ( true === Item.SpaceAfter )
                        {
                            if ( nMinWidth < nWordLen )
                                nMinWidth = nWordLen;

                            bWord    = false;
                            nWordLen = 0;
                        }
                    }

                    if ( nSpaceLen > 0 )
                    {
                        nCurMaxWidth += nSpaceLen;
                        nSpaceLen     = 0;
                    }

                    nCurMaxWidth += Item.Width;

                    break;
                }

                case para_Space:
                {
                    if ( true === bWord )
                    {
                        if ( nMinWidth < nWordLen )
                            nMinWidth = nWordLen;

                        bWord    = false;
                        nWordLen = 0;
                    }

                    // Мы сразу не добавляем ширину пробелов к максимальной ширине, потому что
                    // пробелы, идущие в конце параграфа или перед переносом строки(явным), не
                    // должны учитываться.
                    nSpaceLen += Item.Width;

                    break;
                }

                case para_Drawing:
                {
                    if ( true === bWord )
                    {
                        if ( nMinWidth < nWordLen )
                            nMinWidth = nWordLen;

                        bWord    = false;
                        nWordLen = 0;
                    }

                    if ( ( true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape() ) && Item.Width > nMinWidth )
                        nMinWidth = Item.Width;

                    if ( nSpaceLen > 0 )
                    {
                        nCurMaxWidth += nSpaceLen;
                        nSpaceLen     = 0;
                    }

                    nCurMaxWidth += Item.Width;

                    break;
                }

                case para_PageNum:
                {
                    if ( true === bWord )
                    {
                        if ( nMinWidth < nWordLen )
                            nMinWidth = nWordLen;

                        bWord    = false;
                        nWordLen = 0;
                    }

                    if ( Item.Width > nMinWidth )
                        nMinWidth = Item.Width;

                    if ( nSpaceLen > 0 )
                    {
                        nCurMaxWidth += nSpaceLen;
                        nSpaceLen     = 0;
                    }

                    nCurMaxWidth += Item.Width;

                    break;
                }

                case para_Tab:
                {
                    nWordLen += Item.Width;

                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;

                    if ( nSpaceLen > 0 )
                    {
                        nCurMaxWidth += nSpaceLen;
                        nSpaceLen     = 0;
                    }

                    nCurMaxWidth += Item.Width;

                    break;
                }

                case para_NewLine:
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    bWord    = false;
                    nWordLen = 0;

                    nSpaceLen = 0;

                    if ( nCurMaxWidth > nMaxWidth )
                        nMaxWidth = nCurMaxWidth;

                    nCurMaxWidth = 0;

                    break;
                }

                case para_End:
                {
                    if ( nMinWidth < nWordLen )
                        nMinWidth = nWordLen;

                    if ( nCurMaxWidth > nMaxWidth )
                        nMaxWidth = nCurMaxWidth;

                    break;
                }
            }
        }

        MinMax.bWord        = bWord;
        MinMax.nWordLen     = nWordLen;
        MinMax.nSpaceLen    = nSpaceLen;
        MinMax.nMinWidth    = nMinWidth;
        MinMax.nMaxWidth    = nMaxWidth;
        MinMax.nCurMaxWidth = nCurMaxWidth;
    },

    Get_Range_VisibleWidth : function(RangeW, _CurLine, _CurRange)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            switch( Item.Type )
            {
                case para_Sym:
                case para_Text:
                case para_Space:
                {
                    RangeW.W += Item.WidthVisible;

                    break;
                }

                case para_Drawing:
                {
                    if ( true === Item.Is_Inline() )
                        RangeW.W += Item.Width;

                    break;
                }
                case para_PageNum:
                case para_Tab:
                {
                    RangeW.W += Item.Width;
                    break;
                }
                case para_NewLine:
                {
                    RangeW.W += Item.WidthVisible;

                    break;
                }
                case para_End:
                {
                    RangeW.W += Item.WidthVisible;
                    RangeW.End = true;

                    break;
                }
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
        var pGraphics = PDSH.Graphics;

        var CurLine   = PDSH.Line - this.StartLine;
        var CurRange  = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

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

        var X  = PDSH.X;
        var Y0 = PDSH.Y0;
        var Y1 = PDSH.Y1;

        var CommentsFlag  = PDSH.CommentsFlag;

        var HighLight = this.Get_CompiledPr(false).HighLight;

        var SearchMarksCount = this.SearchMarks.length;

        this.CollaborativeMarks.Init_Drawing();

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            // Определим попадание в поиск и совместное редактирование. Попадание в комментарий определять не надо,
            // т.к. класс CParaRun попадает или не попадает в комментарий целиком.

            for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
            {
                var Mark = this.SearchMarks[SPos];
                var MarkPos = Mark.SearchResult.StartPos.Get(Mark.Depth);

                if ( Pos === MarkPos && true === Mark.Start )
                    PDSH.SearchCounter++;
            }

            var DrawSearch = ( PDSH.SearchCounter > 0 ? true : false );

            var DrawColl = this.CollaborativeMarks.Check( Pos );

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

                    if ( CommentsFlag != comments_NoComment )
                        aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                    else if ( highlight_None != HighLight )
                        aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, HighLight.r, HighLight.g, HighLight.b );

                    if ( true === DrawSearch )
                        aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                    else if ( true === DrawColl )
                        aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                    if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                        X += Item.WidthVisible;

                    break;
                }
                case para_Space:
                {
                    // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
                    if ( PDSH.Spaces > 0 )
                    {
                        if ( CommentsFlag != comments_NoComment )
                            aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                        else if ( highlight_None != HighLight )
                            aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, HighLight.r, HighLight.g, HighLight.b );

                        PDSH.Spaces--;
                    }

                    if ( true === DrawSearch )
                        aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                    else if ( true === DrawColl )
                        aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                    X += Item.WidthVisible;

                    break;
                }
                case para_End:
                {
                    if ( true === DrawColl )
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

            for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
            {
                var Mark = this.SearchMarks[SPos];
                var MarkPos = Mark.SearchResult.EndPos.Get(Mark.Depth);

                if ( Pos + 1 === MarkPos && true !== Mark.Start )
                    PDSH.SearchCounter--;
            }
        }

        // Обновим позицию X
        PDSH.X = X;
    },

    Draw_Elements : function(PDSE)
    {
        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );
        var CurPage  = PDSE.Page;

        var Range    = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var Para      = PDSE.Paragraph;
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
                        {
                            var ParaJc = Para.Get_CompiledPr2(false).ParaPr.Jc;
                            Item.Draw( X, Y - this.YOffset, pGraphics, Para.Get_StartPage_Absolute() + CurPage, ParaJc );
                        }

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
                    var SectPr = Para.Get_SectionPr();

                    if ( undefined === SectPr )
                    {
                        // Выставляем настройки для символа параграфа
                        var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                        EndTextPr.Merge(Para.TextPr.Value);

                        pGraphics.SetTextPr(EndTextPr);

                        if (true === EndTextPr.Color.Auto)
                            pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        else
                            pGraphics.b_color1(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);

                        bEnd = true;
                        var bEndCell = false;
                        if (null === Para.Get_DocumentNext() && true === Para.Parent.Is_TableCellContent())
                            bEndCell = true;

                        Item.Draw(X, Y - this.YOffset, pGraphics, bEndCell);
                        X += Item.Width;
                    }
                    else
                    {
                        Item.Draw(X, Y - this.YOffset, pGraphics, false);
                        X += Item.Width;
                    }

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
        var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

        var Range = this.Lines[CurLine].Ranges[CurRange];

        var X        = PDSL.X;
        var Y        = PDSL.Baseline;
        var UndOff   = PDSL.UnderlineOffset;

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        var Para       = PDSL.Paragraph;

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

        var SpellingMarksArray = new Object();
        var SpellingMarksCount = this.SpellingMarks.length;
        for ( var SPos = 0; SPos < SpellingMarksCount; SPos++)
        {
            var Mark = this.SpellingMarks[SPos];

            if ( false === Mark.Element.Checked )
            {
                if ( true === Mark.Start )
                {
                    var MarkPos = Mark.Element.StartPos.Get(Mark.Depth);

                    if ( undefined === SpellingMarksArray[MarkPos] )
                        SpellingMarksArray[MarkPos] = 1;
                    else
                        SpellingMarksArray[MarkPos] += 1;
                }
                else
                {
                    var MarkPos = Mark.Element.EndPos.Get(Mark.Depth);

                    if ( undefined === SpellingMarksArray[MarkPos] )
                        SpellingMarksArray[MarkPos] = 2;
                    else
                        SpellingMarksArray[MarkPos] += 2;
                }
            }
        }

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( 1 === SpellingMarksArray[Pos] || 3 === SpellingMarksArray[Pos] )
                PDSL.SpellingCounter++;

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

                        if ( PDSL.SpellingCounter > 0 )
                            aSpelling.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, 0, 0, 0 );

                        X += Item.WidthVisible;
                    }

                    break;
                }
                case para_Space:
                {
                    // Пробелы, идущие в конце строки, не подчеркиваем и не зачеркиваем
                    if ( PDSL.Spaces > 0 )
                    {
                        if ( true === CurTextPr.DStrikeout )
                            aDStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );
                        else if ( true === CurTextPr.Strikeout )
                            aStrikeout.Add( StrikeoutY, StrikeoutY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                        if ( true === CurTextPr.Underline )
                            aUnderline.Add( UnderlineY, UnderlineY, X, X + Item.WidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b );

                        PDSL.Spaces--;
                    }

                    X += Item.WidthVisible;

                    break;
                }
            }

            if ( 2 === SpellingMarksArray[Pos + 1] || 3 === SpellingMarksArray[Pos + 1] )
                PDSL.SpellingCounter--;
        }

        // Обновляем позицию
        PDSL.X = X;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
    // Находится ли курсор в начале рана
    Is_CursorPlaceable : function()
    {
        return true;
    },

    Cursor_Is_Start : function()
    {
        if ( this.State.ContentPos <= 0 )
            return true;

        return false;
    },

    // Проверяем нужно ли поправить позицию курсора
    Cursor_Is_NeededCorrectPos : function()
    {
        if ( true === this.Is_Empty(false) )
            return true;

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

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            var TempDx = 0;

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

        // Такое возможно, если все раны до этого (в том числе и этот) были пустыми, тогда, чтобы не возвращать
        // неправильную позицию вернем позицию начала данного путого рана.
        if ( SearchPos.DiffX > 1000000 - 1 )
        {
            SearchPos.Pos.Update( StartPos, Depth );
            Result = true;
        }

        return Result;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos)
    {
        var Pos = ( true !== bSelection ? this.State.ContentPos : ( false !== bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos ) );
        ContentPos.Add(Pos);
    },

    Set_ParaContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        if ( Pos > this.Content.length )
            Pos = this.Content.length;

        if ( Pos < 0 )
            Pos = 0;

        this.State.ContentPos = Pos;
    },

    Get_PosByElement : function(Class, ContentPos, Depth, UseRange, Range, Line)
    {
        if ( this === Class )
            return true;

        return false;
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        if ( undefined !== ContentPos )
        {
            var CurPos = ContentPos.Get(Depth);
            var ContentLen = this.Content.length;

            if ( CurPos >= this.Content.length || CurPos < 0 )
                return null;

            return this.Content[CurPos];
        }
        else
        {
            if ( this.Content.length > 0 )
                return this.Content[0];
            else
                return null;
        }
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

    Get_StartRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Pos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        ContentPos.Update( Pos, Depth );
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

    Selection_IsUse : function()
    {
        return this.State.Selection.Use;
    },

    Is_SelectedAll : function(Props)
    {
        var Selection = this.State.Selection;
        if ( false === Selection.Use && true !== this.Is_Empty( Props ) )
            return false;

        var SkipAnchor = Props.SkipAnchor;
        var SkipEnd    = Props.SkipEnd;

        var StartPos = Selection.StartPos;
        var EndPos   = Selection.EndPos;

        if ( EndPos < StartPos )
        {
            StartPos = Selection.EndPos;
            EndPos   = Selection.StartPos;
        }

        for ( var Pos = 0; Pos < StartPos; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( !( ( true === SkipAnchor && ( para_Drawing === Item.Type && true !== Item.Is_Inline() ) ) || ( true === SkipEnd && para_End === Item.Type ) ) )
                return false;
        }

        var Count = this.Content.length;
        for ( var Pos = EndPos; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( !( ( true === SkipAnchor && ( para_Drawing === Item.Type && true !== Item.Is_Inline() ) ) || ( true === SkipEnd && para_End === Item.Type ) ) )
                return false;
        }

        return true;
    },

    Selection_CorrectLeftPos : function(Direction)
    {
        if ( false === this.Selection.Use || true === this.Is_Empty( { SkipAnchor : true } ) )
            return true;

        var Selection = this.State.Selection;
        var StartPos = Math.min( Selection.StartPos, Selection.EndPos );
        var EndPos   = Math.max( Selection.StartPos, Selection.EndPos );

        for ( var Pos = 0; Pos < StartPos; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Drawing !== Item.Type || true === Item.Is_Inline() )
                return false;
        }

        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Drawing ===  Item.Type && true !== Item.Is_Inline() )
            {
                if ( 1 === Direction )
                    Selection.StartPos = Pos + 1;
                else
                    Selection.EndPos   = Pos + 1;
            }
            else
                return false;
        }

        return true;
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

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var DrawSelection = false;

            if ( true === FindStart )
            {
                if ( true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos )
                {
                    FindStart = false;

                    DrawSelection = true;
                }
                else
                {
                    if ( para_Drawing !== Item.Type || true === Item.Is_Inline() )
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
    Get_TextPr : function()
    {
        return this.Pr.Copy();
    },

    Get_CompiledTextPr : function(Copy)
    {
        if ( true === this.State.Selection.Use && true === this.Selection_CheckParaEnd() )
        {
            var ThisTextPr = this.Get_CompiledPr( true );

            var Para       = this.Paragraph;
            var EndTextPr  = Para.Get_CompiledPr2(false).TextPr.Copy();
            EndTextPr.Merge( Para.TextPr.Value );

            ThisTextPr = ThisTextPr.Compare( EndTextPr );

            return ThisTextPr;
        }
        else
            return this.Get_CompiledPr(Copy);
    },

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
        if ( undefined === this.Paragraph )
        {
            // Сюда мы никогда не должны попадать, но на всякий случай,
            // чтобы не выпадало ошибок сгенерим дефолтовые настройки
            var TextPr = new CTextPr();
            TextPr.Init_Default();
            return new CTextPr();
        }

        // Получим настройки текста, для данного параграфа
        var TextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();

        // Если в прямых настройках задан стиль, тогда смержим настройки стиля
        if ( undefined != this.Pr.RStyle )
        {
            var Styles = this.Paragraph.Parent.Get_Styles();
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
        this.Pr = TextPr;

        History.Add( this, { Type : historyitem_ParaRun_TextPr, New : TextPr, Old : OldValue } );
        this.Recalc_CompiledPr(true);

        // TODO: Орфография: пока сделаем так, в будущем надо будет переделать
        this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
    },

    Apply_TextPr : function(TextPr, IncFontSize, ApplyToAll)
    {
        if ( true === ApplyToAll )
        {
            if ( undefined === IncFontSize )
            {
                this.Apply_Pr( TextPr );
            }
            else
            {
                var _TextPr = new CTextPr();
                var CurTextPr = this.Get_CompiledPr( false );

                this.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
            }
        }
        else
        {
            var Result = [];
            var LRun = this, CRun = null, RRun = null;

            if ( true === this.State.Selection.Use )
            {
                var StartPos = this.State.Selection.StartPos;
                var EndPos   = this.State.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }

                // Если выделено не до конца, тогда разделяем по последней точке
                if ( EndPos < this.Content.length )
                {
                    RRun = LRun.Split_Run( EndPos );
                }

                // Если выделено не с начала, тогда делим по начальной точке
                if ( StartPos > 0 )
                {
                    CRun = LRun.Split_Run( StartPos );
                }
                else
                {
                    CRun = LRun;
                    LRun = null;
                }

                if ( null !== LRun )
                    LRun.Selection_Remove();

                CRun.Select_All();

                if ( undefined === IncFontSize )
                    CRun.Apply_Pr( TextPr );
                else
                {
                    var _TextPr = new CTextPr();
                    var CurTextPr = this.Get_CompiledPr( false );

                    CRun.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
                }

                if ( null !== RRun )
                    RRun.Selection_Remove();

                // Дополнительно проверим, если у нас para_End лежит в данном ране и попадает в выделение, тогда
                // применим заданные настроки к символу конца параграфа

                // TODO: Возможно, стоит на этапе пересчета запонимать, лежит ли para_End в данном ране. Чтобы в каждом
                //       ране потом не бегать каждый раз по всему массиву в поисках para_End.

                if ( true === this.Selection_CheckParaEnd() )
                {
                    if ( undefined === IncFontSize )
                        this.Paragraph.TextPr.Apply_TextPr( TextPr );
                    else
                    {
                        var Para = this.Paragraph;

                        // Выставляем настройки для символа параграфа
                        var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                        EndTextPr.Merge( Para.TextPr.Value );

                        // TODO: Как только перенесем историю изменений TextPr в сам класс CTextPr, переделать тут
                        Para.TextPr.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, EndTextPr.FontSize ) );
                    }
                }
            }
            else
            {
                var CurPos = this.State.ContentPos;

                // Если выделено не до конца, тогда разделяем по последней точке
                if ( CurPos < this.Content.length )
                {
                    RRun = LRun.Split_Run( CurPos );
                }

                if ( CurPos > 0 )
                {
                    CRun = LRun.Split_Run( CurPos );
                }
                else
                {
                    CRun = LRun;
                    LRun = null;
                }

                if ( null !== LRun )
                    LRun.Selection_Remove();

                CRun.Selection_Remove();
                CRun.Cursor_MoveToStartPos();

                if ( undefined === IncFontSize )
                {
                    CRun.Apply_Pr( TextPr );
                }
                else
                {
                    var _TextPr = new CTextPr();
                    var CurTextPr = this.Get_CompiledPr( false );

                    CRun.Set_FontSize( FontSize_IncreaseDecreaseValue( IncFontSize, CurTextPr.FontSize ) );
                }


                if ( null !== RRun )
                    RRun.Selection_Remove();
            }

            Result.push( LRun );
            Result.push( CRun );
            Result.push( RRun );

            return Result;
        }
    },

    Split_Run : function(Pos)
    {
        // Создаем новый ран
        var NewRun = new ParaRun(this.Paragraph);

        // Копируем настройки
        NewRun.Set_Pr( this.Pr.Copy() );

        var OldCrPos = this.State.ContentPos;
        var OldSSPos = this.State.Selection.StartPos;
        var OldSEPos = this.State.Selection.EndPos;

        // Разделяем содержимое по ранам
        NewRun.Concat_ToContent( this.Content.slice(Pos) );
        this.Remove_FromContent( Pos, this.Content.length - Pos, true );

        // Подправим точки селекта и текущей позиции
        if ( OldCrPos >= Pos )
        {
            NewRun.State.ContentPos = OldCrPos - Pos;
            this.State.ContentPos   = this.Content.length;
        }
        else
        {
            NewRun.State.ContentPos = 0;
        }

        if ( OldSSPos >= Pos )
        {
            NewRun.State.Selection.StartPos = OldSSPos - Pos;
            this.State.Selection.StartPos   = this.Content.length;
        }
        else
        {
            NewRun.State.Selection.StartPos = 0;
        }

        if ( OldSEPos >= Pos )
        {
            NewRun.State.Selection.EndPos = OldSEPos - Pos;
            this.State.Selection.EndPos   = this.Content.length;
        }
        else
        {
            NewRun.State.Selection.EndPos = 0;
        }

        // Если были точки орфографии, тогда переместим их в новый ран
        var SpellingMarksCount = this.SpellingMarks.length;
        for ( var Index = 0; Index < SpellingMarksCount; Index++ )
        {
            var Mark    = this.SpellingMarks[Index];
            var MarkPos = ( true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth) );

            if ( MarkPos >= Pos )
            {
                var MarkElement = Mark.Element;
                if ( true === Mark.Start )
                {
                    MarkElement.ClassesS[Mark.Depth]       = NewRun;
                    MarkElement.StartPos.Data[Mark.Depth] -= Pos;
                }
                else
                {
                    MarkElement.ClassesE[Mark.Depth]     = NewRun;
                    MarkElement.EndPos.Data[Mark.Depth] -= Pos;
                }

                NewRun.SpellingMarks.push( Mark );

                this.SpellingMarks.splice( Index, 1 );
                SpellingMarksCount--;
                Index--;
            }
        }


        return NewRun;
    },

    Clear_TextPr : function()
    {
        this.Set_Pr( new CTextPr() );
    },

    // В данной функции мы применяем приходящие настройки поверх старых, т.е. старые не удаляем
    Apply_Pr : function(TextPr)
    {
        if ( undefined != TextPr.Bold )
            this.Set_Bold( null === TextPr.Bold ? undefined : TextPr.Bold );

        if ( undefined != TextPr.Italic )
            this.Set_Italic( null === TextPr.Italic ? undefined : TextPr.Italic );

        if ( undefined != TextPr.Strikeout )
            this.Set_Strikeout( null === TextPr.Strikeout ? undefined : TextPr.Strikeout );

        if ( undefined !== TextPr.Underline )
            this.Set_Underline( null === TextPr.Underline ? undefined : TextPr.Underline );

        if ( undefined != TextPr.FontSize )
            this.Set_FontSize( null === TextPr.FontSize ? undefined : TextPr.FontSize );

        if ( undefined !== TextPr.Color )
            this.Set_Color( null === TextPr.Color ? undefined : TextPr.Color );

        if ( undefined != TextPr.VertAlign )
            this.Set_VertAlign( null === TextPr.VertAlign ? undefined : TextPr.VertAlign );

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( null === TextPr.HighLight ? undefined : TextPr.HighLight );

        if ( undefined !== TextPr.RStyle )
            this.Set_RStyle( null === TextPr.RStyle ? undefined : TextPr.RStyle );

        if ( undefined != TextPr.Spacing )
            this.Set_Spacing( null === TextPr.Spacing ? undefined : TextPr.Spacing );

        if ( undefined != TextPr.DStrikeout )
            this.Set_DStrikeout( null === TextPr.DStrikeout ? undefined : TextPr.DStrikeout );

        if ( undefined != TextPr.Caps )
            this.Set_Caps( null === TextPr.Caps ? undefined : TextPr.Caps );

        if ( undefined != TextPr.SmallCaps )
            this.Set_SmallCaps( null === TextPr.SmallCaps ? undefined : TextPr.SmallCaps );

        if ( undefined != TextPr.Position )
            this.Set_Position( null === TextPr.Position ? undefined : TextPr.Position );

        if ( undefined != TextPr.RFonts )
            this.Set_RFonts2( TextPr.RFonts );

        if ( undefined != TextPr.Lang )
            this.Set_Lang2( TextPr.Lang );
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

            this.YOffset = this.Get_Position();
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

        History.Add( this, { Type : historyitem_ParaRun_Lang, New : this.Pr.Lang, Old : OldValue } );
        this.Recalc_CompiledPr(false);
    },

    Set_Lang2 : function(Lang)
    {
        if ( undefined != Lang )
        {
            if ( undefined != Lang.Bidi )
                this.Set_Lang_Bidi( Lang.Bidi );

            if ( undefined != Lang.EastAsia )
                this.Set_Lang_EastAsia( Lang.EastAsia );

            if ( undefined != Lang.Val )
                this.Set_Lang_Val( Lang.Val );

            // TODO: Орфография: пока сделаем так, в будущем надо будет переделать
            this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
        }
    },

    Set_Lang_Bidi : function(Value)
    {
        if ( Value !== this.Pr.Lang.Bidi )
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
            case historyitem_ParaRun_AddItem :
            {
                this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

                this.RecalcInfo.Measure = true;
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_RemoveItem :
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                this.RecalcInfo.Measure = true;
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_TextPr:
            {
                if ( undefined != Data.Old )
                    this.Pr = Data.Old;
                else
                    this.Pr = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Bold:
            {
                if ( undefined != Data.Old )
                    this.Pr.Bold = Data.Old;
                else
                    this.Pr.Bold = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Italic:
            {
                if ( undefined != Data.Old )
                    this.Pr.Italic = Data.Old;
                else
                    this.Pr.Italic = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Strikeout:
            {
                if ( undefined != Data.Old )
                    this.Pr.Strikeout = Data.Old;
                else
                    this.Pr.Strikeout = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_Underline:
            {
                if ( undefined != Data.Old )
                    this.Pr.Underline = Data.Old;
                else
                    this.Pr.Underline = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_FontSize:
            {
                if ( undefined != Data.Old )
                    this.Pr.FontSize = Data.Old;
                else
                    this.Pr.FontSize = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Color:
            {
                if ( undefined != Data.Old )
                    this.Pr.Color = Data.Old;
                else
                    this.Pr.Color = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_VertAlign:
            {
                if ( undefined != Data.Old )
                    this.Pr.VertAlign = Data.Old;
                else
                    this.Pr.VertAlign = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_HighLight:
            {
                if ( undefined != Data.Old )
                    this.Pr.HighLight = Data.Old;
                else
                    this.Pr.HighLight = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_RStyle:
            {
                if ( undefined != Data.Old )
                    this.Pr.RStyle = Data.Old;
                else
                    this.Pr.RStyle = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Spacing:
            {
                if ( undefined != Data.Old )
                    this.Pr.Spacing = Data.Old;
                else
                    this.Pr.Spacing = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }
            case historyitem_ParaRun_DStrikeout:
            {
                if ( undefined != Data.Old )
                    this.Pr.DStrikeout = Data.Old;
                else
                    this.Pr.DStrikeout = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }
            case historyitem_ParaRun_Caps:
            {
                if ( undefined != Data.Old )
                    this.Pr.Caps = Data.Old;
                else
                    this.Pr.Caps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }
            case historyitem_ParaRun_SmallCaps:
            {
                if ( undefined != Data.Old )
                    this.Pr.SmallCaps = Data.Old;
                else
                    this.Pr.SmallCaps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Position:
            {
                if ( undefined != Data.Old )
                    this.Pr.Position = Data.Old;
                else
                    this.Pr.Position = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts = Data.Old;
                else
                    this.Pr.RFonts = new CRFonts();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Ascii:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts.Ascii = Data.Old;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_HAnsi:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts.Ascii = Data.Old;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_CS:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts.Ascii = Data.Old;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_EastAsia:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts.Ascii = Data.Old;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Hint:
            {
                if ( undefined != Data.Old )
                    this.Pr.RFonts.Ascii = Data.Old;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang:
            {
                if ( undefined != Data.Old )
                    this.Pr.Lang = Data.Old;
                else
                    this.Pr.Lang = new CLang();

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_Bidi:
            {
                if ( undefined != Data.Old )
                    this.Pr.Lang.Bidi = Data.Old;
                else
                    this.Pr.Lang.Bidi = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_EastAsia:
            {
                if ( undefined != Data.Old )
                    this.Pr.Lang.EastAsia = Data.Old;
                else
                    this.Pr.Lang.EastAsia = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_Val:
            {
                if ( undefined != Data.Old )
                    this.Pr.Lang.Val = Data.Old;
                else
                    this.Pr.Lang.Val = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_ParaRun_AddItem:
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                this.RecalcInfo.Measure = true;
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;

            }

            case historyitem_ParaRun_RemoveItem:
            {
                this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

                this.RecalcInfo.Measure = true;
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_TextPr:
            {
                if ( undefined != Data.New )
                    this.Pr = Data.New;
                else
                    this.Pr = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Bold:
            {
                if ( undefined != Data.New )
                    this.Pr.Bold = Data.New;
                else
                    this.Pr.Bold = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Italic:
            {
                if ( undefined != Data.New )
                    this.Pr.Italic = Data.New;
                else
                    this.Pr.Italic = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Strikeout:
            {
                if ( undefined != Data.New )
                    this.Pr.Strikeout = Data.New;
                else
                    this.Pr.Strikeout = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_Underline:
            {
                if ( undefined != Data.New )
                    this.Pr.Underline = Data.New;
                else
                    this.Pr.Underline = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_FontSize:
            {
                if ( undefined != Data.New )
                    this.Pr.FontSize = Data.New;
                else
                    this.Pr.FontSize = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Color:
            {
                if ( undefined != Data.New )
                    this.Pr.Color = Data.New;
                else
                    this.Pr.Color = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_VertAlign:
            {
                if ( undefined != Data.New )
                    this.Pr.VertAlign = Data.New;
                else
                    this.Pr.VertAlign = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_HighLight:
            {
                if ( undefined != Data.New )
                    this.Pr.HighLight = Data.New;
                else
                    this.Pr.HighLight = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_RStyle:
            {
                if ( undefined != Data.New )
                    this.Pr.RStyle = Data.New;
                else
                    this.Pr.RStyle = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Spacing:
            {
                if ( undefined != Data.New )
                    this.Pr.Spacing = Data.New;
                else
                    this.Pr.Spacing = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }
            case historyitem_ParaRun_DStrikeout:
            {
                if ( undefined != Data.New )
                    this.Pr.DStrikeout = Data.New;
                else
                    this.Pr.DStrikeout = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }
            case historyitem_ParaRun_Caps:
            {
                if ( undefined != Data.New )
                    this.Pr.Caps = Data.New;
                else
                    this.Pr.Caps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }
            case historyitem_ParaRun_SmallCaps:
            {
                if ( undefined != Data.New )
                    this.Pr.SmallCaps = Data.New;
                else
                    this.Pr.SmallCaps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Position:
            {
                if ( undefined != Data.New )
                    this.Pr.Position = Data.New;
                else
                    this.Pr.Position = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts = Data.New;
                else
                    this.Pr.RFonts = new CRFonts();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Ascii:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts.Ascii = Data.New;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_HAnsi:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts.Ascii = Data.New;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_CS:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts.Ascii = Data.New;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_EastAsia:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts.Ascii = Data.New;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Hint:
            {
                if ( undefined != Data.New )
                    this.Pr.RFonts.Ascii = Data.New;
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang:
            {
                if ( undefined != Data.New )
                    this.Pr.Lang = Data.New;
                else
                    this.Pr.Lang = new CLang();

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_Bidi:
            {
                if ( undefined != Data.New )
                    this.Pr.Lang.Bidi = Data.New;
                else
                    this.Pr.Lang.Bidi = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_EastAsia:
            {
                if ( undefined != Data.New )
                    this.Pr.Lang.EastAsia = Data.New;
                else
                    this.Pr.Lang.EastAsia = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_Lang_Val:
            {
                if ( undefined != Data.New )
                    this.Pr.Lang.Val = Data.New;
                else
                    this.Pr.Lang.Val = undefined;

                this.Recalc_CompiledPr(false);
                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }
        }
    },

//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_ParaRun );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_ParaRun_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Элемент
                //  }

                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                Writer.WriteLong( Count );

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                        Writer.WriteLong( Data.PosArray[Index] );
                    else
                        Writer.WriteLong( Data.Pos + Index );

                    Data.Items[Index].Write_ToBinary(Writer);
                }

                break;
            }

            case historyitem_ParaRun_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                var StartPos = Writer.GetCurPosition();
                Writer.Skip(4);
                var RealCount = Count;

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                    {
                        if ( false === Data.PosArray[Index] )
                            RealCount--;
                        else
                            Writer.WriteLong( Data.PosArray[Index] );
                    }
                    else
                        Writer.WriteLong( Data.Pos );
                }

                var EndPos = Writer.GetCurPosition();
                Writer.Seek( StartPos );
                Writer.WriteLong( RealCount );
                Writer.Seek( EndPos );

                break;
            }

            case historyitem_ParaRun_TextPr:
            {
                // CTextPr
                this.Pr.Write_ToBinary( Writer );

                break;
            }

            case historyitem_ParaRun_Bold:
            case historyitem_ParaRun_Italic:
            case historyitem_ParaRun_Strikeout:
            case historyitem_ParaRun_Underline:
            {
                // Bool : IsUndefined
                // Bool : Value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_FontSize:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_ParaRun_Color:
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_ParaRun_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteLong(Data.New);
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_ParaRun_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNone
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    if ( highlight_None != Data.New )
                    {
                        Writer.WriteBool( false );
                        Data.New.Write_ToBinary( Writer );
                    }
                    else
                        Writer.WriteBool( true );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_ParaRun_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_Spacing:
            case historyitem_ParaRun_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_DStrikeout:
            case historyitem_ParaRun_Caps:
            case historyitem_ParaRun_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_RFonts_Ascii:
            case historyitem_ParaRun_RFonts_HAnsi:
            case historyitem_ParaRun_RFonts_CS:
            case historyitem_ParaRun_RFonts_EastAsia:
            {
                // Bool : undefined?
                // false -> String

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New.Name );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_RFonts_Hint:
            {
                // Bool : undefined?
                // false -> Long

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_Lang:
            {
                // Bool : undefined ?
                // false -> CLang
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_ParaRun_Lang_Bidi:
            case historyitem_ParaRun_Lang_EastAsia:
            case historyitem_ParaRun_Lang_Val:
            {
                // Bool : undefined ?
                // false -> Long
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_ParaRun != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_ParaRun_AddItem :
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Id Элемента
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() );
                    var Element = ParagraphContent_Read_FromBinary(Reader);

                    if ( null != Element )
                    {
                        this.CollaborativeMarks.Update_OnAdd( Pos );
                        this.CollaborativeMarks.Add( Pos, Pos + 1 );
                        this.Content.splice( Pos, 0, Element );

                        CollaborativeEditing.Add_ChangedClass(this);
                    }
                }

                this.RecalcInfo.Measure = true;

                if ( undefined !== this.Paragraph && null !== this.Paragraph )
                    this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, Reader.GetLong() );

                    // действие совпало, не делаем его
                    if ( false === ChangesPos )
                        continue;

                    this.CollaborativeMarks.Update_OnRemove( ChangesPos, 1 );
                    this.Content.splice( ChangesPos, 1 );
                }

                this.RecalcInfo.Measure = true;

                if ( undefined !== this.Paragraph && null !== this.Paragraph )
                    this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_ParaRun_TextPr:
            {
                // CTextPr
                this.Pr = new CTextPr();
                this.Pr.Read_FromBinary( Reader );

                break;
            }

            case historyitem_ParaRun_Bold:
            {
                // Bool : IsUndefined
                // Bool : Bold

                if ( true === Reader.GetBool() )
                    this.Pr.Bold = undefined;
                else
                    this.Pr.Bold = Reader.GetBool();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Italic:
            {
                // Bool : IsUndefined
                // Bool : Italic

                if ( true === Reader.GetBool() )
                    this.Pr.Italic = undefined;
                else
                    this.Pr.Italic = Reader.GetBool();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Strikeout:
            {
                // Bool : IsUndefined
                // Bool : Strikeout

                if ( true === Reader.GetBool() )
                    this.Pr.Strikeout = undefined;
                else
                    this.Pr.Strikeout = Reader.GetBool();

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_Underline:
            {
                // Bool   : IsUndefined?
                // Bool   : Underline

                if ( true != Reader.GetBool() )
                    this.Pr.Underline = Reader.GetBool();
                else
                    this.Pr.Underline = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_FontSize:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( true != Reader.GetBool() )
                    this.Pr.FontSize = Reader.GetDouble();
                else
                    this.Pr.FontSize = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Color:
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    var r = Reader.GetByte();
                    var g = Reader.GetByte();
                    var b = Reader.GetByte();
                    this.Pr.Color = new CDocumentColor( r, g, b );
                }
                else
                    this.Pr.Color = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( true != Reader.GetBool() )
                    this.Pr.VertAlign = Reader.GetLong();
                else
                    this.Pr.VertAlign = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNull
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    if ( true != Reader.GetBool() )
                    {
                        this.Pr.HighLight = new CDocumentColor(0,0,0);
                        this.Pr.HighLight.Read_FromBinary(Reader);
                    }
                    else
                        this.Pr.HighLight = highlight_None;
                }
                else
                    this.Pr.HighLight = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( true != Reader.GetBool() )
                    this.Pr.RStyle = Reader.GetString2();
                else
                    this.Pr.RStyle = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Spacing:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( true != Reader.GetBool() )
                    this.Pr.Spacing = Reader.GetDouble();
                else
                    this.Pr.Spacing = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_DStrikeout:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : DStrikeout

                if ( true != Reader.GetBool() )
                    this.Pr.DStrikeout = Reader.GetBool();
                else
                    this.Pr.DStrikeout = undefined;

                this.Recalc_CompiledPr(false);

                break;
            }

            case historyitem_ParaRun_Caps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : Caps

                if ( true != Reader.GetBool() )
                    this.Value.Caps = Reader.GetBool();
                else
                    this.Value.Caps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : SmallCaps

                if ( true != Reader.GetBool() )
                    this.Pr.SmallCaps = Reader.GetBool();
                else
                    this.Pr.SmallCaps = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Position

                if ( true != Reader.GetBool() )
                    this.Pr.Position = Reader.GetDouble();
                else
                    this.Pr.Position = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( false === Reader.GetBool() )
                {
                    this.Pr.RFonts = new CRFonts();
                    this.Pr.RFonts.Read_FromBinary( Reader );
                }
                else
                    this.Pr.RFonts = new CRFonts();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Ascii:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Pr.RFonts.Ascii =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_HAnsi:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Pr.RFonts.HAnsi =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Pr.RFonts.HAnsi = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_CS:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Pr.RFonts.CS =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Pr.RFonts.CS = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_EastAsia:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Pr.RFonts.EastAsia =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Pr.RFonts.Ascii = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_RFonts_Hint:
            {
                // Bool : undefined ?
                // false -> Long
                if ( false === Reader.GetBool() )
                    this.Pr.RFonts.Hint = Reader.GetLong();
                else
                    this.Pr.RFonts.Hint = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang:
            {
                // Bool : undefined ?
                // false -> Lang
                if ( false === Reader.GetBool() )
                {
                    this.Pr.Lang = new CLang();
                    this.Pr.Lang.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Lang = new CLang();

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang_Bidi:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Pr.Lang.Bidi = Reader.GetLong();
                else
                    this.Pr.Lang.Bidi = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang_EastAsia:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Pr.Lang.EastAsia = Reader.GetLong();
                else
                    this.Pr.Lang.EastAsia = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }

            case historyitem_ParaRun_Lang_Val:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Pr.Lang.Val = Reader.GetLong();
                else
                    this.Pr.Lang.Val = undefined;

                this.Recalc_CompiledPr(true);

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_ParaRun );

        // String   : Id
        // String   : Paragraph Id
        // Variable : CTextPr
        // Long     : Количество элементов
        // Array of variable : массив с элементами

        Writer.WriteString2( this.Id );
        Writer.WriteString2( null !== this.Paragraph && undefined !== this.Paragraph ? this.Paragraph.Get_Id() : "" );
        this.Pr.Write_ToBinary( Writer );

        var Count = this.Content.length;
        Writer.WriteLong( Count );
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            Item.Write_ToBinary( Writer );
        }
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id
        // String   : Paragraph Id
        // Variable : CTextPr
        // Long     : Количество элементов
        // Array of variable : массив с элементами

        this.Id     = Reader.GetString2();
        this.Parent = g_oTableId.Get_ById( Reader.GetString2() );
        this.Pr     = new CTextPr();
        this.Pr.Read_FromBinary( Reader );

        var Count = Reader.GetLong();
        this.Content = new Array();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = ParagraphContent_Read_FromBinary( Reader );
            if ( null !== Element )
                this.Content.push( Element );
        }
    },

    Clear_CollaborativeMarks : function()
    {
        this.CollaborativeMarks.Clear();
    }
};

function CParaRunSelection()
{
    this.Use      = false;
    this.StartPos = 0;
    this.EndPos   = 0;
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
    Reset : function()
    {
        this.TextPr  = true;
        this.Measure = true;
        this.Recalc  = true;
        this.RunLen  = 0;
    }

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

        if ( this.Ranges.length > this.RangesLength )
            this.Ranges.legth = this.RangesLength;
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


    Compare : function(OtherLine, CurRange)
    {
        // Сначала проверим наличие данного отрезка в обеих строках
        if ( this.RangesLength <= CurRange || OtherLine.RangesLength <= CurRange )
            return false;

        var OtherRange = OtherLine.Ranges[CurRange];
        var ThisRange  = this.Ranges[CurRange];

        if ( OtherRange.StartPos !== ThisRange.StartPos || OtherRange.EndPos !== ThisRange.EndPos )
            return false;

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

function FontSize_IncreaseDecreaseValue(bIncrease, Value)
{
    // Закон изменения размеров :
    // 1. Если значение меньше 8, тогда мы увеличиваем/уменьшаем по 1 (от 1 до 8)
    // 2. Если значение больше 72, тогда мы увеличиваем/уменьшаем по 10 (от 80 до бесконечности
    // 3. Если значение в отрезке [8,72], тогда мы переходим по следующим числам 8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72

    var Sizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];

    var NewValue = Value;
    if ( true === bIncrease )
    {
        if ( Value < Sizes[0] )
        {
            if ( Value >= Sizes[0] - 1 )
                NewValue = Sizes[0];
            else
                NewValue = Math.floor(Value + 1);
        }
        else if ( Value >= Sizes[Sizes.length - 1] )
        {
            NewValue = Math.min( 300, Math.floor( Value / 10 + 1 ) * 10 );
        }
        else
        {
            for ( var Index = 0; Index < Sizes.length; Index++ )
            {
                if ( Value < Sizes[Index] )
                {
                    NewValue = Sizes[Index];
                    break;
                }
            }
        }
    }
    else
    {
        if ( Value <= Sizes[0] )
        {
            NewValue = Math.max( Math.floor( Value - 1 ), 1 );
        }
        else if ( Value > Sizes[Sizes.length - 1] )
        {
            if ( Value <= Math.floor( Sizes[Sizes.length - 1] / 10 + 1 ) * 10 )
                NewValue = Sizes[Sizes.length - 1];
            else
                NewValue = Math.floor( Math.ceil(Value / 10) - 1 ) * 10;
        }
        else
        {
            for ( var Index = Sizes.length - 1; Index >= 0; Index-- )
            {
                if ( Value > Sizes[Index] )
                {
                    NewValue = Sizes[Index];
                    break;
                }
            }
        }
    }

    return NewValue;
}


function CRunCollaborativeMarks()
{
    this.Ranges = new Array();
    this.DrawingObj = new Object();
}

CRunCollaborativeMarks.prototype =
{
    Add : function(PosS, PosE)
    {
        var Count = this.Ranges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Range = this.Ranges[Index];

            if ( PosE < Range.PosS )
                continue;
            else if ( PosS >= Range.PosS && PosS <= Range.PosE && PosE >= Range.PosS && PosE <= Range.PosE )
            {
                return;
            }
            else if ( PosS > Range.PosE )
            {
                this.Ranges.splice( Index + 1, 0, new CRunCollaborativeRange(PosS, PosE) );
                return;
            }
            else if ( PosS < Range.PosS && PosE > Range.PosE )
            {
                Range.PosS = PosS;
                Range.PosE = PosE;
                return;
            }
            else if ( PosS < Range.PosS ) // && PosE <= Range.PosE )
            {
                Range.PosS = PosS;
                return;
            }
            else //if ( PosS >= Range.PosS && PosE > Range.Pos.E )
            {
                Range.PosE = PosE;
                return;
            }
        }

        this.Ranges.push( new CRunCollaborativeRange(PosS, PosE) );
    },

    Update_OnAdd : function(Pos)
    {
        var Count = this.Ranges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Range = this.Ranges[Index];

            if ( Pos <= Range.PosS )
            {
                Range.PosS++;
                Range.PosE++;
            }
            else if ( Pos > Range.PosS && Pos < Range.PosE )
            {
                var NewRange = new CRunCollaborativeRange( Pos + 1, Range.PosE + 1 );
                this.Ranges.splice( Index + 1, 0, NewRange );
                Range.PosE = Pos;
                Count++;
                Index++;
            }
            //else if ( Pos < Range.PosE )
            //    Range.PosE++;
        }
    },

    Update_OnRemove : function(Pos, Count)
    {
        var Len = this.Ranges.length;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Range = this.Ranges[Index];

            var PosE = Pos + Count;
            if ( Pos < Range.PosS )
            {
                if ( PosE <= Range.PosS )
                {
                    Range.PosS -= Count;
                    Range.PosE -= Count;
                }
                else if ( PosE >= Range.PosE )
                {
                    this.Ranges.splice( Index, 1 );
                    Len--;
                    Index--;
                    continue;
                }
                else
                {
                    Range.PosS = Pos;
                    Range.PosE -= Count;
                }
            }
            else if ( Pos >= Range.PosS && Pos < Range.PosE )
            {
                if ( PosE >= Range.PosE )
                    Range.PosE = Pos;
                else
                    Range.PosE -= Count;
            }
            else
                continue;
        }
    },

    Clear : function()
    {
        this.Ranges = new Array();
    },

    Init_Drawing  : function()
    {
        this.DrawingObj = new Object();

        var Count = this.Ranges.length;
        for ( var CurPos = 0; CurPos < Count; CurPos++ )
        {
            var Range = this.Ranges[CurPos];

            for ( var Pos = Range.PosS; Pos < Range.PosE; Pos++ )
                this.DrawingObj[Pos] = true;
        }
    },

    Check : function(Pos)
    {
        if ( true === this.DrawingObj[Pos] )
            return true;

        return false;
    }
};

function CRunCollaborativeRange(PosS, PosE)
{
    this.PosS = PosS;
    this.PosE = PosE;
}



ParaRun.prototype.Math_SetPosition = function(_pos)
{
    var pos = {x: _pos.x, y: _pos.y - this.size.ascent};

    for(var i = 0; i < this.Content.length; i++)
    {
        this.Content[i].setPosition(pos);
        pos.x += this.Content[i].size.width;
    }
}
ParaRun.prototype.Math_Draw = function(x, y, pGraphics)
{
    var X = x;
    var Y = y + this.size.ascent;

    // var oWPrp = this.Get_CompiledPr(true);
    var oWPrp = this.Pr.Copy();
    this.Math_applyArgSize(oWPrp);

    oWPrp.Italic = false;

    pGraphics.SetFont(oWPrp);
    pGraphics.b_color1(0,0,0,255);

    for(var i=0; i < this.Content.length;i++)
    {
        this.Content[i].draw(X, Y, pGraphics);
    }

}
ParaRun.prototype.Math_Recalculate = function(RecalcInfo)
{
    var RangeStartPos = 0;
    var RangeEndPos = this.Content.length;

    // обновляем позиции start и end для Range
    this.Lines[0].Add_Range(0, RangeStartPos, RangeEndPos);

    var width = 0,
        ascent = 0, descent = 0;

    //var oWPrp = this.Get_CompiledPr(true);
    var oWPrp = this.Pr.Copy();
    this.Math_applyArgSize(oWPrp);
    //oWPrp.Merge(RecalcInfo.Composition.DEFAULT_RUN_PRP.getTxtPrp());

    oWPrp.Italic = false;

    // TODO
    // смержить еще с math_Run_Prp

    g_oTextMeasurer.SetFont(oWPrp);

    for (var Pos = 0 ; Pos < this.Content.length; Pos++ )
    {
        RecalcInfo.leftRunPrp = RecalcInfo.currRunPrp;
        RecalcInfo.Left = RecalcInfo.Current;

        RecalcInfo.currRunPrp = oWPrp;
        RecalcInfo.Current = this.Content[Pos];
        RecalcInfo.setGaps();

        this.Content[Pos].Resize(g_oTextMeasurer);

        var oSize = this.Content[Pos].size;
        //var gps = this.Content[Pos].gaps;

        //width += oSize.width + gps.left + gps.right;
        width += oSize.width;

        ascent = ascent > oSize.ascent ? ascent : oSize.ascent;
        var oDescent = oSize.height - oSize.ascent;
        descent =  descent < oDescent ? oDescent : descent;
    }

    this.size = {width: width, height: ascent + descent, ascent: ascent};
}
ParaRun.prototype.Math_Update_Cursor = function(X, Y, CurPage, UpdateTarget)
{
    var runPrp = this.Get_CompiledPr(true);
    this.Math_applyArgSize(runPrp);


    var sizeCursor = runPrp.FontSize*g_dKoef_pt_to_mm;

    Y -= sizeCursor*0.8;

    for(var i = 0; i < this.State.ContentPos; i++)
        X += this.Content[i].size.width;


    if ( null !== this.Paragraph && undefined !== this.Paragraph && UpdateTarget == true)
    {
        this.Paragraph.DrawingDocument.SetTargetSize(sizeCursor);
        //Para.DrawingDocument.UpdateTargetFromPaint = true;
        this.Paragraph.DrawingDocument.UpdateTarget( X, Y, this.Paragraph.Get_StartPage_Absolute() + CurPage );
        //Para.DrawingDocument.UpdateTargetFromPaint = false;
    }

    return {X: X, Y: Y, Height: sizeCursor};
}
ParaRun.prototype.Math_applyArgSize = function(oWPrp)
{
    var tPrp = new CTextPr();
    var defaultRPrp = this.Parent.Composition.GetDefaultRunPrp();
    var gWPrp = defaultRPrp.getMergedWPrp();
    tPrp.Merge(gWPrp);
    tPrp.Merge(oWPrp);

    var FSize = tPrp.FontSize;

    if(this.argSize == -1)
    {
        //aa: 0.0013  bb: 0.66  cc: 0.5
        //aa: 0.0009  bb: 0.68  cc: 0.26
        FSize = 0.0009*FSize*FSize + 0.68*FSize + 0.26;
        //FSize = 0.001*FSize*FSize + 0.723*FSize - 1.318;
        //FSize = 0.0006*FSize*FSize + 0.743*FSize - 1.53;
    }
    else if(this.argSize == -2)
    {
        // aa: -0.0004  bb: 0.66  cc: 0.87
        // aa: -0.0014  bb: 0.71  cc: 0.39
        // aa: 0  bb: 0.63  cc: 1.11
        //FSize = 0.63*FSize + 1.11;
        FSize = -0.0004*FSize*FSize + 0.66*FSize + 0.87;
        //tPrp.FontSize *= 0.473;
    }

    tPrp.FontSize = FSize;

    oWPrp.Merge(tPrp);

    /*
     if(this.argSize == -1)
     //tPrp.FontSize *= 0.8;
     tPrp.FontSize *= 0.728;
     //tPrp.FontSize *= 0.65;
     else if(this.argSize == -2)
     //tPrp.FontSize *= 0.65;
     tPrp.FontSize *= 0.53;
     //tPrp.FontSize *= 0.473;*/
}