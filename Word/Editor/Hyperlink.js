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
    this.Selection = this.State.Selection;

    this.Content = new Array();

    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    this.StartLine  = 0;
    this.StartRange = 0;

    this.Lines       = []; // Массив CParaRunLine
    this.Lines[0]    = new CParaRunLine();
    this.LinesLength = 0;

    this.Range = this.Lines[0].Ranges[0];

    this.NearPosArray  = new Array();
    this.SearchMarks   = new Array();
    this.SpellingMarks = new Array();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaHyperlink.prototype =
{
    Get_Id : function()
    {
        return this.Id;
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

    Copy : function(Selected)
    {
        var NewHyperlink = new ParaHyperlink();

        NewHyperlink.Set_Value( this.Value );
        NewHyperlink.Set_ToolTip( this.ToolTip );

        var StartPos = 0;
        var EndPos   = this.Content.length - 1;

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

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( StartPos === CurPos || EndPos === CurPos )
                NewHyperlink.Add_ToContent( CurPos - StartPos, Item.Copy(Selected) );
            else
                NewHyperlink.Add_ToContent( CurPos - StartPos, Item.Copy(false) );
        }

        return NewHyperlink;
    },
    
    Get_AllDrawingObjects : function(DrawingObjs)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            
            if ( para_Run === Item.Type || para_Hyperlink === Item.Type )
                Item.Get_AllDrawingObjects(DrawingObjs);
        }
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

    Get_TextPr : function(_ContentPos, Depth)
    {
        if ( undefined === _ContentPos )
            return this.Content[0].Get_TextPr();
        else
            return this.Content[_ContentPos.Get(Depth)].Get_TextPr( _ContentPos, Depth + 1 );
    },

    Get_CompiledTextPr : function(Copy)
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

            TextPr = this.Content[StartPos].Get_CompiledTextPr(Copy);

            while ( null === TextPr && StartPos < EndPos )
            {
                StartPos++;
                TextPr = this.Content[StartPos].Get_CompiledTextPr(Copy);
            }

            for ( var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++ )
            {
                var CurTextPr = this.Content[CurPos].Get_CompiledPr(false);

                if ( null !== CurTextPr )
                    TextPr = TextPr.Compare( CurTextPr );
            }
        }
        else
        {
            var CurPos = this.State.ContentPos;

            if ( CurPos >= 0 && CurPos < this.Content.length )
                TextPr = this.Content[CurPos].Get_CompiledTextPr(Copy);
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

        // Обновляем позиции в NearestPos
        var NearPosLen = this.NearPosArray.length;
        for ( var Index = 0; Index < NearPosLen; Index++ )
        {
            var HyperNearPos = this.NearPosArray[Index];
            var ContentPos = HyperNearPos.NearPos.ContentPos;
            var Depth      = HyperNearPos.Depth;

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

        // Обновляем позиции в NearestPos
        var NearPosLen = this.NearPosArray.length;
        for ( var Index = 0; Index < NearPosLen; Index++ )
        {
            var HyperNearPos = this.NearPosArray[Index];
            var ContentPos = HyperNearPos.NearPos.ContentPos;
            var Depth      = HyperNearPos.Depth;

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

    Apply_TextPr : function(TextPr, IncFontSize, ApplyToAll)
    {
        if ( true === ApplyToAll )
        {
            var ContentLen = this.Content.length;
            for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
            {
                this.Content[CurPos].Apply_TextPr( TextPr, IncFontSize, true );
            }
        }
        else
        {
            var Selection = this.State.Selection;

            if ( true === Selection.Use )
            {
                var StartPos = Selection.StartPos;
                var EndPos   = Selection.EndPos;

                if ( StartPos === EndPos )
                {
                    var NewElements = this.Content[EndPos].Apply_TextPr( TextPr, IncFontSize, false );

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
                        this.Content[CurPos].Apply_TextPr( TextPr, IncFontSize, false );
                    }


                    var NewElements = this.Content[EndPos].Apply_TextPr( TextPr, IncFontSize, false );
                    if ( para_Run === this.Content[EndPos].Type )
                        this.Internal_ReplaceRun( EndPos, NewElements );

                    var NewElements = this.Content[StartPos].Apply_TextPr( TextPr, IncFontSize, false );
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
                var NewElements = Element.Apply_TextPr( TextPr, IncFontSize, false );

                if ( para_Run === Element.Type )
                {
                    var CenterRunPos = this.Internal_ReplaceRun( Pos, NewElements );
                    this.State.ContentPos = CenterRunPos;
                }
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

    Clear_TextPr : function()
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Clear_TextPr();
        }
    },

    Check_NearestPos : function(ParaNearPos, Depth)
    {
        var HyperNearPos = new CParagraphElementNearPos();
        HyperNearPos.NearPos = ParaNearPos.NearPos;
        HyperNearPos.Depth   = Depth;

        this.NearPosArray.push( HyperNearPos );
        ParaNearPos.Classes.push( this );

        var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
        this.Content[CurPos].Check_NearestPos( ParaNearPos, Depth + 1 );
    },

    Get_DrawingObjectRun : function(Id)
    {
        var Run = null;

        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];
            Run = Element.Get_DrawingObjectRun( Id );
            if ( null !== Run )
                return Run;
        }

        return Run;
    },

    Get_DrawingObjectContentPos : function(Id, ContentPos, Depth)
    {
        var ContentLen = this.Content.length;
        for ( var Index = 0; Index < ContentLen; Index++ )
        {
            var Element = this.Content[Index];

            if ( true === Element.Get_DrawingObjectContentPos(Id, ContentPos, Depth + 1) )
            {
                ContentPos.Update2( Index, Depth );
                return true;
            }
        }

        return false;
    },

    Get_Layout : function(DrawingLayout, UseContentPos, ContentPos, Depth)
    {
        var CurLine  = DrawingLayout.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? DrawingLayout.Range - this.StartRange : DrawingLayout.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        var CurContentPos = ( true === UseContentPos ? ContentPos.Get(Depth) : -1 );

        for ( var CurPos = StartPos; CurPos < EndPos; CurPos++ )
        {
            this.Content[CurPos].Get_Layout(DrawingLayout, ( CurPos === CurContentPos ? true : false ), ContentPos, Depth + 1 );

            if ( null !== DrawingLayout.Layout )
                return;
        }
    },

    Get_NextRunElements : function(RunElements, UseContentPos, Depth)
    {
        var CurPos     = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) : 0 );
        var ContentLen = this.Content.length;

        this.Content[CurPos].Get_NextRunElements( RunElements, UseContentPos,  Depth + 1 );

        if ( RunElements.Count <= 0 )
            return;

        CurPos++;

        while ( CurPos < ContentLen )
        {
            this.Content[CurPos].Get_NextRunElements( RunElements, false,  Depth + 1 );

            if ( RunElements.Count <= 0 )
                break;

            CurPos++;
        }
    },

    Get_PrevRunElements : function(RunElements, UseContentPos, Depth)
    {
        var CurPos = ( true === UseContentPos ? RunElements.ContentPos.Get(Depth) : this.Content.length - 1 );

        this.Content[CurPos].Get_PrevRunElements( RunElements, UseContentPos,  Depth + 1 );

        if ( RunElements.Count <= 0 )
            return;

        CurPos--;

        while ( CurPos >= 0 )
        {
            this.Content[CurPos].Get_PrevRunElements( RunElements, false,  Depth + 1 );

            if ( RunElements.Count <= 0 )
                break;

            CurPos--;
        }
    },

    Collect_DocumentStatistics : function(ParaStats)
    {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
            this.Content[Index].Collect_DocumentStatistics( ParaStats );
    },

    Create_FontMap : function(Map)
    {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
            this.Content[Index].Create_FontMap( Map );
    },

    Get_AllFontNames : function(AllFonts)
    {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
            this.Content[Index].Get_AllFontNames( AllFonts );
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

        if ( this.Paragraph !== PRS.Paragraph )
        {
            this.Paragraph = PRS.Paragraph;
            this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
        }

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

    Save_RecalculateObject : function(Copy)
    {
        var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
        RecalcObj.Save_Lines( this, Copy );
        RecalcObj.Save_Content( this, Copy );
        return RecalcObj;
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        RecalcObj.Load_Lines( this );
        RecalcObj.Load_Content( this );
    },

    Prepare_RecalculateObject : function()
    {
        this.Lines       = [];
        this.Lines[0]    = new CParaRunLine();
        this.LinesLength = 0;

        this.Range = this.Lines[0].Ranges[0];
        
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Prepare_RecalculateObject();
        }
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

    Get_ParaPosByContentPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        return this.Content[Pos].Get_ParaPosByContentPos( ContentPos, Depth + 1 );
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

    Recalculate_MinMaxContentWidth : function(MinMax)
    {
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            this.Content[Pos].Recalculate_MinMaxContentWidth(MinMax);
        }
    },

    Get_Range_VisibleWidth : function(RangeW, _CurLine, _CurRange)
    {
        var CurLine = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Get_Range_VisibleWidth(RangeW, CurLine, CurRange);
        }
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
        PDSE.VisitedHyperlink = this.Visited;

        var CurLine  = PDSE.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_Elements( PDSE );
        }

        PDSE.VisitedHyperlink = false;
    },

    Draw_Lines : function(PDSL)
    {
        PDSL.VisitedHyperlink = this.Visited;

        var CurLine  = PDSL.Line - this.StartLine;
        var CurRange = ( 0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range );

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            this.Content[CurPos].Draw_Lines( PDSL );
        }

        PDSL.VisitedHyperlink = false;
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
        var ContentLen = this.Content.length;
        var CurPos = 0;

        while ( CurPos < this.State.ContentPos && CurPos < this.Content.length - 1 )
        {
            if ( true === this.Content[CurPos].Is_Empty() )
                CurPos++;
            else
                return false;
        }

        return this.Content[CurPos].Cursor_Is_Start();
    },

    Cursor_Is_NeededCorrectPos : function()
    {
        return false;
    },

    Cursor_Is_End : function()
    {
        var CurPos = this.Content.length - 1;

        while ( CurPos > this.State.ContentPos && CurPos > 0 )
        {
            if ( true === this.Content[CurPos].Is_Empty() )
                CurPos--;
            else
                return false;
        }

        return this.Content[CurPos].Cursor_Is_End();
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

        if ( Pos >= this.Content.length )
            Pos = this.Content.length - 1;

        if ( Pos < 0 )
            Pos = 0;

        this.State.ContentPos = Pos;

        this.Content[Pos].Set_ParaContentPos( ContentPos, Depth + 1 );
    },

    Get_PosByElement : function(Class, ContentPos, Depth, UseRange, Range, Line)
    {
        if ( this === Class )
            return true;

        var ContentPos = new CParagraphContentPos();

        var StartPos = 0;
        var EndPos   = this.Content.length - 1;

        if ( true === UseRange )
        {
            var CurLine  = Line - this.StartLine;
            var CurRange = ( 0 === CurLine ? Range - this.StartRange : Range );

            if ( CurLine >= 0 && CurLine < this.Lines.length && CurRange >= 0 && CurRange < this.Lines[CurLine].Ranges.length )
            {
                StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
                EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;
            }
        }

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Element = this.Content[CurPos];

            ContentPos.Update( CurPos, Depth );

            if ( true === Element.Get_PosByElement(Class, ContentPos, 1, true, CurRange, CurLine) )
                return true;
        }

        return false;
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        var Pos = ContentPos.Get(Depth);

        return this.Content[Pos].Get_RunElementByPos( ContentPos, Depth + 1 );
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1 );

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
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1 );

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

        var Result = this.Content[StartPos].Get_StartRangePos( _CurLine, _CurRange, SearchPos, Depth + 1 );

        if ( true === Result )
            SearchPos.Pos.Update( StartPos, Depth );

        return Result;
    },

    Get_StartRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
    {
        var CurLine  = _CurLine - this.StartLine;
        var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

        var Pos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        ContentPos.Update( Pos, Depth );

        this.Content[Pos].Get_StartRangePos2( _CurLine, _CurRange, ContentPos, Depth + 1 );
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
        var Selection = this.State.Selection;

        var OldStartPos = Selection.StartPos;
        var OldEndPos   = Selection.EndPos;

        if ( OldStartPos > OldEndPos )
        {
            OldStartPos = Selection.EndPos;
            OldEndPos   = Selection.StartPos;
        }

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

        // Удалим отметки о старом селекте
        if ( OldStartPos < StartPos && OldStartPos < EndPos )
        {
            var TempLimit = Math.min( StartPos, EndPos );
            for ( var CurPos = OldStartPos; CurPos < TempLimit; CurPos++ )
            {
                this.Content[CurPos].Selection_Remove();
            }
        }

        if ( OldEndPos > StartPos && OldEndPos > EndPos )
        {
            var TempLimit = Math.max( StartPos, EndPos );
            for ( var CurPos = TempLimit + 1; CurPos <= OldEndPos; CurPos++ )
            {
                this.Content[CurPos].Selection_Remove();
            }
        }

        // Выставим метки нового селекта

        Selection.Use      = true;
        Selection.StartPos = StartPos;
        Selection.EndPos   = EndPos;

        if ( StartPos != EndPos )
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, null, Depth + 1, StartFlag, StartPos > EndPos ? 1 : -1 );
            this.Content[EndPos].Set_SelectionContentPos( null, EndContentPos, Depth + 1, StartPos > EndPos ? -1 : 1, EndFlag );

            var _StartPos = StartPos;
            var _EndPos   = EndPos;
            var Direction = 1;

            if ( _StartPos > _EndPos )
            {
                _StartPos = EndPos;
                _EndPos   = StartPos;
                Direction = -1;
            }

            for ( var CurPos = _StartPos + 1; CurPos < _EndPos; CurPos++ )
            {
                this.Content[CurPos].Select_All( Direction );
            }
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
        var EndPos   = this.State.Selection.EndPos;

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

    Is_SelectedAll : function(Props)
    {
        var Selection = this.State.Selection;

        if ( false === Selection.Use && true !== this.Is_Empty( Props ) )
            return false;

        var StartPos = Selection.StartPos;
        var EndPos   = Selection.EndPos;

        if ( EndPos < StartPos )
        {
            StartPos = Selection.EndPos;
            EndPos   = Selection.StartPos;
        }

        for ( var Pos = 0; Pos <= StartPos; Pos++ )
        {
            if ( false === this.Content[Pos].Is_SelectedAll( Props ) )
                return false;
        }

        var Count = this.Content.length;
        for ( var Pos = EndPos; Pos < Count; Pos++ )
        {
            if ( false === this.Content[Pos].Is_SelectedAll( Props ) )
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
            if ( true !== this.Content[Pos].Is_Empty( { SkipAnchor : true } ) )
                return false;
        }

        for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
        {
            if ( true === this.Content[Pos].Selection_CorrectLeftPos(Direction) )
            {
                if ( 1 === Direction )
                    this.Selection.StartPos = Pos + 1;
                else
                    this.Selection.EndPos   = Pos + 1;

                this.Content[Pos].Selection_Remove();
            }
            else
                return false;
        }

        return true;
    },
//-----------------------------------------------------------------------------------
// Работаем со значениями
//-----------------------------------------------------------------------------------
    Get_Text : function(Text)
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            this.Content[CurPos].Get_Text( Text );
        }
    },

    Set_Visited : function(Value)
    {
        this.Visited = Value;
    },

    Get_Visited : function()
    {
        return this.Visited;
    },

    Set_ToolTip : function(ToolTip)
    {
        History.Add( this, { Type : historyitem_Hyperlink_ToolTip, New : ToolTip, Old : this.ToolTip } );
        this.ToolTip = ToolTip;
    },

    Get_ToolTip : function()
    {
        if ( null === this.ToolTip )
        {
            if ( "string" === typeof(this.Value) )
                return this.Value;
            else
                return "";
        }
        else
            return this.ToolTip;
    },

    Get_Value : function()
    {
        return this.Value;
    },

    Set_Value : function(Value)
    {
        History.Add( this, { Type : historyitem_Hyperlink_Value, New : Value, Old : this.Value } );
        this.Value = Value;
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;
        switch(Type)
        {
            case historyitem_Hyperlink_AddItem :
            {
                this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_RemoveItem :
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_Value :
            {
                this.Value = Data.Old;
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                this.ToolTip = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;
        switch(Type)
        {
            case historyitem_Hyperlink_AddItem :
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_RemoveItem :
            {
                this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

                this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_Value :
            {
                this.Value = Data.New;
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                this.ToolTip = Data.New;
                break;
            }
        }
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Hyperlink );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch(Type)
        {
            case historyitem_Hyperlink_AddItem :
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Id элемента
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

                    Writer.WriteString2( Data.Items[Index].Get_Id() );
                }

                break;
            }

            case historyitem_Hyperlink_RemoveItem :
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

            case historyitem_Hyperlink_Value :
            {
                // String : Value
                Writer.WriteString2( Data.New );
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                // String : ToolTip
                Writer.WriteString2( Data.New );

                break;
            }
        }
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Hyperlink != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Hyperlink_AddItem :
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
                    var Element = g_oTableId.Get_ById( Reader.GetString2() );

                    if ( null != Element )
                    {
                        this.Content.splice( Pos, 0, Element );
                    }
                }

                if ( null !== this.Paragraph && undefined !== this.Paragraph )
                    this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_RemoveItem:
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

                    this.Content.splice( ChangesPos, 1 );
                }

                if ( null !== this.Paragraph && undefined !== this.Paragraph )
                    this.Paragraph.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                break;
            }

            case historyitem_Hyperlink_Value:
            {
                // String : Value
                this.Value = Reader.GetString2();
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                // String : ToolTip
                this.ToolTip = Reader.GetString2();

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Hyperlink );

        // String : Id
        // String : Value
        // String : ToolTip
        // Long   : Количество элементов
        // Array of Strings : массив с Id элементов

        Writer.WriteString2( this.Id );
        Writer.WriteString2( this.Value );
        Writer.WriteString2( this.ToolTip );

        var Count = this.Content.length;
        Writer.WriteLong( Count );

        for ( var Index = 0; Index < Count; Index++ )
        {
            Writer.WriteString2( this.Content[Index].Get_Id() );
        }
    },

    Read_FromBinary2 : function(Reader)
    {
        // String : Id
        // String : Value
        // String : ToolTip
        // Long   : Количество элементов
        // Array of Strings : массив с Id элементов

        this.Id      = Reader.GetString2();
        this.Value   = Reader.GetString2();
        this.ToolTip = Reader.GetString2();

        var Count = Reader.GetLong();
        this.Content = new Array();

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = g_oTableId.Get_ById( Reader.GetString2() );
            if ( null !== Element )
                this.Content.push( Element );
        }
    }
};
