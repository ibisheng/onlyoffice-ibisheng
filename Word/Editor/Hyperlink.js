/**
 * Created by Ilja.Kirillov on 17.02.14.
 */

function ParaHyperlink()
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type    = para_Hyperlink;
    this.Value   = "";
    this.Visited = false;
    this.ToolTip = "";

    this.State = new CParaRunState();

    this.Content = new Array();

    this.StartLine  = 0;
    this.StartRange = 0;

    this.Lines       = []; // Массив CParaRunLine
    this.Lines[0]    = new CParaRunLine();
    this.LinesLength = 0;

    this.Range = this.Lines[0].Ranges[0];

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaHyperlink.prototype =
{
    Get_Id : function()
    {
        return this.Id;
    },

    Set_Paragraph : function(Paragraph)
    {
        this.Paragraph = Paragraph;

        var ContentLen = this.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++)
        {
            this.Content[CurPos].Set_Paragraph( Paragraph );
        }
    },

    Is_Empty : function()
    {
        var ContentLen = this.Content.length;
        for ( var Index = 0; Index < ContentLen; Index++ )
        {
            if ( false === this.Content[Index].Is_Empty() )
                return false;
        }

        return true;
    },

    Is_StartFromNewLine : function()
    {
        if ( this.Content.length < 0 )
            return false;

        return this.Content[0].Is_StartFromNewLine();
    },

    Get_CompiledTextPr : function()
    {
        var TextPr = null;

        if ( true === this.State.Selection )
        {
            var StartPos = this.State.Selection.StartPos;
            var EndPos   = this.State.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.State.Selection.EndPos;
                EndPos   = this.State.Selection.StartPos;
            }

            TextPr = this.Content[StartPos].Get_CompiledTextPr();

            while ( null === TextPr && StartPos < EndPos )
            {
                StartPos++;
                TextPr = this.Content[StartPos].Get_CompiledTextPr();
            }

            for ( var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++ )
            {
                var CurTextPr = this.Content[CurPos].Get_CompiledPr();

                if ( null !== CurTextPr )
                    TextPr = TextPr.Compare( CurTextPr );
            }
        }
        else
        {
            var CurPos = this.State.ContentPos;

            if ( CurPos >= 0 && CurPos < this.Content.length )
                TextPr = this.Content[CurPos].Get_CompiledTextPr();
        }

        return TextPr;
    },

    Add_ToContent : function(Pos, Item, UpdatePosition)
    {
        History.Add( this, { Type : historyitem_Hyperlink_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
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
    },

    Remove_FromContent : function(Pos, Count, UpdatePosition)
    {
        // Получим массив удаляемых элементов
        var DeletedItems = this.Content.slice( Pos, Pos + Count );
        History.Add( this, { Type : historyitem_Hyperlink_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

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
    },

    Add : function(Item)
    {
        this.Content[this.State.ContentPos].Add( Item );
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
                StartPos = Selection.EndPos;
                EndPos   = Selection.StartPos;
            }

            if ( StartPos === EndPos )
            {
                this.Content[StartPos].Remove(Direction, bOnAddText);

                if ( StartPos !== this.Content.length - 1 && true === this.Content[StartPos].Is_Empty() )
                {
                    this.Remove_FromContent( StartPos, true );
                }
            }
            else
            {
                this.Content[EndPos].Remove(Direction, bOnAddText);

                if ( EndPos !== this.Content.length - 1 && true === this.Content[EndPos].Is_Empty() )
                {
                    this.Remove_FromContent( EndPos, true );
                }

                for ( var CurPos = EndPos - 1; CurPos > StartPos; CurPos-- )
                {
                    this.Remove_FromContent( EndPos, true );
                }

                this.Content[StartPos].Remove(Direction, bOnAddText);

                if ( true === this.Content[StartPos].Is_Empty() )
                    this.Remove_FromContent( StartPos, true );
            }
        }
        else
        {
            var ContentPos = this.State.ContentPos;

            if ( true === this.Cursor_Is_Start() || true === this.Cursor_Is_End() )
            {
                this.Select_All();
            }
            else
            {
                while ( false === this.Content[ContentPos].Remove( Direction, bOnAddText ) )
                {
                    if ( Direction < 0 )
                        ContentPos--;
                    else
                        ContentPos++;

                    if ( ContentPos < 0 || ContentPos >= this.Content.length )
                        break;

                    if ( Direction < 0 )
                        this.Content[ContentPos].Cursor_MoveToEndPos(false);
                    else
                        this.Content[ContentPos].Cursor_MoveToStartPos();

                }

                if ( ContentPos < 0 || ContentPos >= this.Content.length )
                    return false;
                else
                {
                    if ( ContentPos !== this.Content.length - 1 && true === this.Content[ContentPos].Is_Empty() )
                        this.Remove_FromContent( ContentPos, true );

                    this.State.ContentPos = ContentPos;
                }
            }
        }

        return true;
    },

    Get_CurrentParaPos : function()
    {
        var CurPos = this.State.ContentPos;

        if ( CurPos >= 0 && CurPos < this.Content.length )
            return this.Content[CurPos].Get_CurrentParaPos();

        return new CParaPos( this.StartRange, this.StartLine, 0, 0 );
    },

    Apply_TextPr : function(TextPr, IncFontSize)
    {
        var Selection = this.State.Selection;

        if ( true === Selection.Use )
        {
            var StartPos = Selection.StartPos;
            var EndPos   = Selection.EndPos;

            if ( StartPos === EndPos )
            {
                var NewElements = this.Content[EndPos].Apply_TextPr( TextPr, IncFontSize );

                if ( para_Run === this.Content[EndPos].Type )
                {
                    var CenterRunPos = this.Internal_ReplaceRun( EndPos, NewElements );

                    if ( StartPos === this.State.ContentPos )
                        this.State.ContentPos = CenterRunPos;

                    // Подправим метки селекта
                    Selection.StartPos = CenterRunPos;
                    Selection.EndPos   = CenterRunPos;
                }
            }
            else
            {
                var Direction = 1;
                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;

                    Direction = -1;
                }

                for ( var CurPos = StartPos + 1; CurPos < EndPos; CurPos++ )
                {
                    this.Content[CurPos].Apply_TextPr( TextPr, IncFontSize );
                }


                var NewElements = this.Content[EndPos].Apply_TextPr( TextPr, IncFontSize );
                if ( para_Run === this.Content[EndPos].Type )
                    this.Internal_ReplaceRun( EndPos, NewElements );

                var NewElements = this.Content[StartPos].Apply_TextPr( TextPr, IncFontSize );
                if ( para_Run === this.Content[StartPos].Type )
                    this.Internal_ReplaceRun( StartPos, NewElements );

                // Заметим, что здесь не нужно подправлять метки выделения, за счет того, что EndPos - StartPos > 1 и
                // сами метки подправляются в функциях Add_ToContent.
            }
        }
        else
        {
            var Pos = this.State.ContentPos;
            var Element = this.Content[Pos];
            var NewElements = Element.Apply_TextPr( TextPr, IncFontSize );

            if ( para_Run === Element.Type )
            {
                var CenterRunPos = this.Internal_ReplaceRun( Pos, NewElements );
                this.State.ContentPos = CenterRunPos;
            }
        }
    },

    Internal_ReplaceRun : function(Pos, NewRuns)
    {
        // По логике, можно удалить Run, стоящий в позиции Pos и добавить все раны, которые не null в массиве NewRuns.
        // Но, согласно работе ParaRun.Apply_TextPr, в массиве всегда идет ровно 3 рана (возможно null). Второй ран
        // всегда не null. Первый не null ран и есть ран, идущий в позиции Pos.

        var LRun = NewRuns[0];
        var CRun = NewRuns[1];
        var RRun = NewRuns[2];

        // CRun - всегда не null
        var CenterRunPos = Pos;

        if ( null !== LRun )
        {
            this.Add_ToContent( Pos + 1, CRun, true );
            CenterRunPos = Pos + 1;
        }
        else
        {
            // Если LRun - null, значит CRun - это и есть тот ран который стоит уже в позиции Pos
        }

        if ( null !== RRun )
            this.Add_ToContent( CenterRunPos + 1, RRun, true );

        return CenterRunPos;
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
        this.LinesLength = 0;
    },

    Recalculate_Range : function(ParaPr, Depth)
    {
        var PRS = g_oPRSW;

        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

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

        var ContentLen = this.Content.length;
        var Pos = RangeStartPos;
        for ( ; Pos < ContentLen; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( ( 0 === Pos && 0 === CurLine && 0 === CurRange ) || Pos !== RangeStartPos )
            {
                Item.Recalculate_Reset( PRS.Range, PRS.Line );
            }

            PRS.Update_CurPos( Pos, Depth );
            Item.Recalculate_Range( ParaPr, Depth + 1 );

            if ( true === PRS.NewRange )
            {
                break;
            }
        }

        if ( Pos >= ContentLen )
        {
            RangeEndPos = Pos - 1;

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

    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
        var CurLine  = PRS.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );
        var CurPos   = PRP.Get(Depth);

        this.Lines[CurLine].Ranges[CurRange].EndPos = CurPos;

        this.Content[CurPos].Recalculate_Set_RangeEndPos( PRS, PRP, Depth + 1 );
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Recalculate_Range_Width( PRSC, _CurLine, _CurRange );
        }
    },

    Recalculate_Range_Spaces : function(PRSA, _CurLine, _CurRange, _CurPage)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Recalculate_Range_Spaces( PRSA, _CurLine, _CurRange, _CurPage );
        }
    },

    Recalculate_PageEndInfo : function(PRSI, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Recalculate_PageEndInfo( PRSI, _CurLine, _CurRange );
        }
    },

    Save_Lines : function()
    {
        // TODO: Реализовать Save_Lines
    },

    Restore_Lines : function(SL)
    {
        // TODO: Реализовать Restore_Lines
    },

    Is_EmptyRange : function(_CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            if ( false === this.Content[CurPos].Is_EmptyRange(_CurLine, _CurRange) )
                return false;
        }

        return true;
    },

    Check_BreakPageInRange : function(_CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            if ( true === this.Content[CurPos].Check_BreakPageInRange(_CurLine, _CurRange) )
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

            if ( true !== Element.Check_BreakPageEnd(PBChecker) )
                return false;
        }

        return true;
    },

    Recalculate_CurPos : function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );
        var X = _X;

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];
            var Res = Item.Recalculate_CurPos( X, Y, (true === CurrentRun && CurPos === this.State.ContentPos ? true : false), _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget );

            if ( true === CurrentRun && CurPos === this.State.ContentPos )
                return Res;
            else
                X = Res.X;
        }

        return { X : X };
    },

    Refresh_RecalcData : function(Data)
    {
        this.Paragraph.Refresh_RecalcData2(0);
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
        var CurLine  = PDSH.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_HighLights( PDSH );
        }
    },

    Draw_Elements : function(PDSE)
    {
        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_Elements( PDSE );
        }
    },

    Draw_Lines : function(PDSL)
    {
        var CurLine  = PDSL.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_Lines( PDSL );
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
    Is_CursorPlaceable : function()
    {
        return true;
    },

    Cursor_Is_Start : function()
    {
        if ( 0 === this.State.ContentPos && this.Content.length > 0 )
            return this.Content[0].Cursor_Is_Start();

        return false;
    },

    Cursor_Is_NeededCorrectPos : function()
    {
        return false;
    },

    Cursor_Is_End : function()
    {
        if ( this.Content.length - 1 === this.State.ContentPos && this.Content.length > 0 )
            return this.Content[this.Content.length - 1].Cursor_Is_End();

        return false;
    },

    Cursor_MoveToStartPos : function()
    {
        this.State.ContentPos = 0;

        if ( this.Content.length > 0 )
        {
            this.Content[0].Cursor_MoveToStartPos();
        }
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
        var ContentLen = this.Content.length;

        if ( ContentLen > 0 )
        {
            this.State.ContentPos = ContentLen - 1;
            this.Content[ContentLen - 1].Cursor_MoveToEndPos( SelectFromEnd );
        }
    },

    Get_ParaContentPosByXY : function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        var Result = false;

        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( true === Item.Get_ParaContentPosByXY( SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd ) )
            {
                SearchPos.Pos.Update( CurPos, Depth );
                Result = true;
            }
        }

        return Result;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos)
    {
        var Pos = ( true === bSelection ? ( true === bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos ) : this.State.ContentPos );
        ContentPos.Add( Pos );

        this.Content[Pos].Get_ParaContentPos( bSelection, bStart, ContentPos );
    },

    Set_ParaContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);
        this.State.ContentPos = Pos;

        this.Content[Pos].Set_ParaContentPos( ContentPos, Depth + 1 );
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        return this.Content[Pos].Get_RunElementByPos( ContentPos, Depth + 1 );
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? this.Content.length - 1 : ContentPos.Get(Depth) );

        this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
        SearchPos.Pos.Update( CurPos, Depth );

        if ( true === SearchPos.Found )
            return true;

        CurPos--;

        while ( CurPos >= 0 )
        {
            this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, false);
            SearchPos.Pos.Update( CurPos, Depth );

            if ( true === SearchPos.Found )
                return true;

            CurPos--;
        }

        return false;
    },

    Get_RightPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

        this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
        SearchPos.Pos.Update( CurPos, Depth );

        if ( true === SearchPos.Found )
            return true;

        CurPos++;

        var Count = this.Content.length;
        while ( CurPos < this.Content.length )
        {
            this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
            SearchPos.Pos.Update( CurPos, Depth );

            if ( true === SearchPos.Found )
                return true;

            CurPos++;
        }

        return false;
    },

    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.lenght - 1 );

        this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);

        if ( true === SearchPos.UpdatePos )
            SearchPos.Pos.Update( CurPos, Depth );

        if ( true === SearchPos.Found )
            return;

        CurPos--;

        var Count = this.Content.length;
        while ( CurPos >= 0 )
        {
            this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, false);

            if ( true === SearchPos.UpdatePos )
                SearchPos.Pos.Update( CurPos, Depth );

            if ( true === SearchPos.Found )
                return;

            CurPos--;
        }
    },

    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : 0 );

        this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);

        if ( true === SearchPos.UpdatePos )
            SearchPos.Pos.Update( CurPos, Depth );

        if ( true === SearchPos.Found )
            return;

        CurPos++;

        var Count = this.Content.length;
        while ( CurPos < Count )
        {
            this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);

            if ( true === SearchPos.UpdatePos )
                SearchPos.Pos.Update( CurPos, Depth );

            if ( true === SearchPos.Found )
                return;

            CurPos++;
        }
    },

    Get_EndRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;

        if ( EndPos >= this.Content.length || EndPos < 0 )
            return false;

        var Result = this.Content[EndPos].Get_EndRangePos( _CurLine, _CurRange, SearchPos, Depth + 1 );

        if ( true === Result )
            SearchPos.Pos.Update( EndPos, Depth );

        return Result;

    },

    Get_StartRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;

        if ( StartPos >= this.Content.length || StartPos < 0 )
            return false;

        var Result = this.Content[StartPos].Get_EndRangePos( _CurLine, _CurRange, SearchPos, Depth + 1 );

        if ( true === Result )
            SearchPos.Pos.Update( StartPos, Depth );

        return Result;
    },

    Get_StartPos : function(ContentPos, Depth)
    {
        if ( this.Content.length > 0 )
        {
            ContentPos.Update( 0, Depth );

            this.Content[0].Get_StartPos( ContentPos, Depth + 1 );
        }
    },

    Get_EndPos : function(BehindEnd, ContentPos, Depth)
    {
        var ContentLen = this.Content.length;
        if ( ContentLen > 0 )
        {
            ContentPos.Update( ContentLen - 1, Depth );

            this.Content[ContentLen - 1].Get_EndPos( BehindEnd, ContentPos, Depth + 1 );
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
            case -1: StartPos = this.Content.length - 1; break;
            case  0: StartPos = StartContentPos.Get(Depth); break;
        }

        var EndPos = 0;
        switch (EndFlag)
        {
            case  1: EndPos = 0; break;
            case -1: EndPos = this.Content.length - 1; break;
            case  0: EndPos = EndContentPos.Get(Depth); break;
        }

        var Selection = this.State.Selection;
        Selection.StartPos = StartPos;
        Selection.EndPos   = EndPos;
        Selection.Use      = true;


        if ( StartPos != EndPos )
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, null, Depth + 1, StartFlag, StartPos > EndPos ? 1 : -1 );
            this.Content[EndPos].Set_SelectionContentPos( null, EndContentPos, Depth + 1, StartPos > EndPos ? -1 : 1, EndFlag );
        }
        else
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, EndContentPos, Depth + 1, StartFlag, EndFlag );
        }
    },

    Selection_IsUse : function()
    {
        return this.State.Selection.Use;
    },

    Selection_Stop : function()
    {
    },

    Selection_Remove : function()
    {
        var Selection = this.State.Selection;
        if ( true === Selection.Use )
        {
            var StartPos = Selection.StartPos;
            var EndPos   = Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = Selection.EndPos;
                EndPos   = Selection.StartPos;
            }

            for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
            {
                this.Content[CurPos].Selection_Remove();
            }
        }

        Selection.Use      = false;
        Selection.StartPos = 0;
        Selection.EndPos   = 0;
    },

    Select_All : function(Direction)
    {
        var ContentLen = this.Content.length;

        var Selection = this.State.Selection;

        Selection.Use = true;

        if ( -1 === Direction )
        {
            Selection.StartPos = this.Content.length - 1;
            Selection.EndPos   = 0;
        }
        else
        {
            Selection.StartPos = 0;
            Selection.EndPos   = this.Content.length - 1;
        }

        for ( var CurPos = 0; CurPos < this.Content.length; CurPos++ )
        {
            this.Content[CurPos].Select_All( Direction );
        }
    },

    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Selection_DrawRange( _CurLine, _CurRange, SelectionDraw );
        }
    },

    Selection_IsEmpty : function(CheckEnd)
    {
        var StartPos = this.State.Selection.StartPos;
        var EndPos   = this.State.Selection.StartPos;

        if ( StartPos > EndPos )
        {
            StartPos = this.State.Selection.EndPos;
            EndPos   = this.State.Selection.StartPos;
        }

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            if ( false === this.Content[CurPos].Selection_IsEmpty(CheckEnd) )
                return false;
        }

        return true;
    },

    Selection_CheckParaEnd : function()
    {
        // В гиперссылку не должен попадать ParaEnd

        return false;
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Write_ToBinary : function(Writer)
    {

    },

    Read_FromBinary : function(Reader)
    {

    },

    Write_ToBinary2 : function(Writer)
    {

    },

    Read_FromBinary2 : function(Reader)
    {

    },

    Save_Changes : function(Data, Writer)
    {

    },

    Load_Changes : function(Reader)
    {

    }
};
