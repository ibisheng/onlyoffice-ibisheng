/**
 * User: Ilja.Kirillov
 * Date: 29.05.13
 * Time: 12:02
 */

//----------------------------------------------------------------------------------------------------------------------
// CParagraphSearchElement
//         Найденные элементы в параграфе. Записаны в массиве Paragraph.SearchResults
//----------------------------------------------------------------------------------------------------------------------
function CParagraphSearchElement(StartPos, EndPos, Type)
{
    this.StartPos  = StartPos;
    this.EndPos    = EndPos;
    this.Type      = Type;
    this.ResultStr = "";
}

//----------------------------------------------------------------------------------------------------------------------
// CDocumentSearch
//         Механизм поиска. Хранит параграфы с найденной строкой
//----------------------------------------------------------------------------------------------------------------------
function CDocumentSearch()
{
    this.Text          = "";
    this.IsMatchCase   = false;

    this.Id            = 0;
    this.Count         = 0;
    this.Elements      = new Array();
    this.CurId         = -1;
    this.Direction     = true; // направление true - вперед, false - назад
    this.ClearOnRecalc = true; // Флаг, говорящий о том, запустился ли пересчет из-за Replace
    this.Selection     = false;
}

CDocumentSearch.prototype =
{
    Set : function(Text, Props)
    {
        this.Text        = Text;
        this.IsMatchCase = Props.IsMatchCase;
    },

    Compare : function(Text, Props)
    {
        if ( this.Text === Text && this.IsMatchCase === Props.IsMatchCase )
            return true;

        return false;
    },

    Clear : function()
    {
        this.Text          = "";
        this.IsMatchCase   = false;

        // Очищаем предыдущие элементы поиска
        for ( var Id in this.Elements )
        {
            var Paragraph = this.Elements[Id];
            Paragraph.SearchResults = new Object();
        }

        this.Id       = 0;
        this.Count    = 0;
        this.Elements = new Object();
    },

    Add : function(Paragraph)
    {
        this.Count++;
        this.Id++;
        this.Elements[this.Id] = Paragraph;
        return this.Id;
    },

    Select : function(Id)
    {
        var Paragraph = this.Elements[Id];
        if ( undefined != Paragraph )
        {
            var SearchElement = Paragraph.SearchResults[Id];
            if ( undefined != SearchElement )
            {
                Paragraph.Selection.Use      = true;
                Paragraph.Selection.Start    = false;
                Paragraph.Selection.StartPos = SearchElement.StartPos;
                Paragraph.Selection.EndPos   = SearchElement.EndPos;
                Paragraph.CurPos.ContentPos  = SearchElement.StartPos;

                Paragraph.Document_SetThisElementCurrent();
            }

            this.CurId = Id;
        }
    },

    Reset_Current : function()
    {
        this.CurId = -1;
    },

    Replace : function(NewStr, Id)
    {
        //var _NewStr =
        var Para = this.Elements[Id];
        if ( undefined != Para )
        {
            var SearchElement = Para.SearchResults[Id];
            if ( undefined != SearchElement )
            {
                var StartPos = SearchElement.StartPos;
                var EndPos   = SearchElement.EndPos;

                for ( var Pos = EndPos - 1; Pos >= StartPos; Pos-- )
                {
                    var ItemType = Para.Content[Pos].Type;
                    if ( para_TextPr != ItemType )
                        Para.Internal_Content_Remove(Pos);
                }


                var Len = NewStr.length;
                for ( var Pos = 0; Pos < Len; Pos++ )
                {
                    Para.Internal_Content_Add2( StartPos + Pos, new ParaText( NewStr[Pos] ) );
                }

                Para.RecalcInfo.Set_Type_0( pararecalc_0_All );
                Para.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );

                // Удаляем запись о данном элементе
                this.Count--;
                delete Para.SearchResults[Id];

                var ParaCount = 0;
                for ( var TempId in Para.SearchResults )
                {
                    ParaCount++;
                    break;
                }

                if ( ParaCount <= 0 )
                    delete this.Elements[Id];
            }
        }
    },

    Replace_All : function(NewStr)
    {
        var bSelect = true;
        for ( var Id in this.Elements )
        {
            if ( true === bSelect )
            {
                bSelect = false;
                this.Select( Id );
            }

            this.Replace( NewStr, Id );
        }

        this.Clear();
    },

    Set_Direction : function(bDirection)
    {
        this.Direction = bDirection;
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CDocument
//----------------------------------------------------------------------------------------------------------------------
CDocument.prototype.Search = function(Str, Props)
{
    var StartTime = new Date().getTime();

    if ( true === this.SearchEngine.Compare( Str, Props ) )
        return this.SearchEngine;

    this.SearchEngine.Clear();
    this.SearchEngine.Set( Str, Props );

    // Поиск в основном документе
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Search( Str, Props, this.SearchEngine, search_Common );
    }

    // Поиск в колонтитулах
    this.HdrFtr.Search( Str, Props, this.SearchEngine );

    this.DrawingDocument.ClearCachePages();
    this.DrawingDocument.FirePaint();

    //console.log( "Search logic: " + ((new Date().getTime() - StartTime) / 1000) + " s"  );

    return this.SearchEngine;
};

CDocument.prototype.Search_Select = function(Id)
{
    this.Selection_Remove();
    this.SearchEngine.Select(Id);
    this.RecalculateCurPos();

    this.Document_UpdateInterfaceState();
    this.Document_UpdateSelectionState();
    this.Document_UpdateRulersState();
};

CDocument.prototype.Search_Replace = function(NewStr, bAll, Id)
{
    var bResult = false;

    this.Selection_Remove();

    var CheckParagraphs = [];
    if ( true === bAll )
    {
        for ( var Id in this.SearchEngine.Elements )
            CheckParagraphs.push( this.SearchEngine.Elements[Id] );
    }
    else
    {
        if ( undefined !== this.SearchEngine.Elements[Id] )
            CheckParagraphs.push( this.SearchEngine.Elements[Id] );
    }

    var AllCount = this.SearchEngine.Count;

    if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : CheckParagraphs, CheckType : changestype_Paragraph_Content } ) )
    {
        History.Create_NewPoint();

        if ( true === bAll )
            this.SearchEngine.Replace_All( NewStr );
        else
            this.SearchEngine.Replace( NewStr, Id );

        this.SearchEngine.ClearOnRecalc = false;
        this.Recalculate();
        this.SearchEngine.ClearOnRecalc = true;

        this.RecalculateCurPos();

        bResult = true;

        if ( true === bAll )
            editor.sync_ReplaceAllCallback(AllCount, AllCount);
    }
    else
    {
        if ( true === bAll )
            editor.sync_ReplaceAllCallback(0, AllCount);
    }

    this.Document_UpdateInterfaceState();
    this.Document_UpdateSelectionState();
    this.Document_UpdateRulersState();

    return bResult;
};

CDocument.prototype.Search_GetId = function(bNext)
{
    this.SearchEngine.Set_Direction( bNext );

    // Получим Id найденного элемента
    if ( docpostype_DrawingObjects === this.CurPos.Type )
    {
        var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
        ParaDrawing.Parent.Document_SetThisElementCurrent();
    }

    if ( docpostype_Content === this.CurPos.Type )
    {
        var Id = null;

        var Pos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag )
            Pos = ( true === bNext ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : Math.min(this.Selection.StartPos, this.Selection.EndPos) );


        if ( true === bNext )
        {
            Id = this.Content[Pos].Search_GetId(true, true);

            if ( null != Id )
                return Id;

            Pos++;

            var Count = this.Content.length;
            while ( Pos < Count )
            {
                Id = this.Content[Pos].Search_GetId(true, false);

                if ( null != Id )
                    return Id;

                Pos++;
            }
        }
        else
        {
            Id = this.Content[Pos].Search_GetId(false, true);

            if ( null != Id )
                return Id;

            Pos--;

            while ( Pos >= 0 )
            {
                Id = this.Content[Pos].Search_GetId(false, false);

                if ( null != Id )
                    return Id;

                Pos--;
            }
        }
    }
    else if ( docpostype_HdrFtr === this.CurPos.Type )
    {
        return this.HdrFtr.Search_GetId( bNext );
    }
};

CDocument.prototype.Search_Set_Selection = function(bSelection)
{
    var OldValue = this.SearchEngine.Selection;
    if ( OldValue === bSelection )
        return;

    this.SearchEngine.Selection = bSelection;
    this.DrawingDocument.ClearCachePages();
    this.DrawingDocument.FirePaint();
};

CDocument.prototype.Search_Get_Selection = function()
{
    return this.SearchEngine.Selection;
};

//----------------------------------------------------------------------------------------------------------------------
// CDocumentContent
//----------------------------------------------------------------------------------------------------------------------
CDocumentContent.prototype.Search = function(Str, Props, SearchEngine, Type)
{
    // Поиск в основном документе
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Search( Str, Props, SearchEngine, Type );
    }
};

CDocumentContent.prototype.Search_GetId = function(bNext, bCurrent)
{
    if ( true === bCurrent )
    {
        // Получим Id найденного элемента
        if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var ParaDrawing = this.LogicDocument.DrawingObjects.getMajorParaDrawing();
            ParaDrawing.Parent.Document_SetThisElementCurrent();
        }

        var Id = null;

        var Pos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag )
            Pos = ( true === bNext ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : Math.min(this.Selection.StartPos, this.Selection.EndPos) );

        if ( true === bNext )
        {
            Id = this.Content[Pos].Search_GetId(true, true);

            if ( null != Id )
                return Id;

            Pos++;

            var Count = this.Content.length;
            while ( Pos < Count )
            {
                Id = this.Content[Pos].Search_GetId(true, false);
                if ( null != Id )
                    return Id;

                Pos++;
            }
        }
        else
        {
            Id = this.Content[Pos].Search_GetId(false, true);

            if ( null != Id )
                return Id;

            Pos--;

            while ( Pos >= 0 )
            {
                Id = this.Content[Pos].Search_GetId(false, false);
                if ( null != Id )
                    return Id;

                Pos--;
            }
        }
    }
    else
    {
        var Count = this.Content.length;
        if ( true === bNext )
        {
            var Pos = 0;
            while ( Pos < Count )
            {
                Id = this.Content[Pos].Search_GetId(true, false);
                if ( null != Id )
                    return Id;

                Pos++;
            }
        }
        else
        {
            var Pos = Count - 1;
            while ( Pos >= 0 )
            {
                Id = this.Content[Pos].Search_GetId(false, false);
                if ( null != Id )
                    return Id;

                Pos--;
            }
        }
    }

    return null;
};

//----------------------------------------------------------------------------------------------------------------------
// CHeaderFooter
//----------------------------------------------------------------------------------------------------------------------
CHeaderFooter.prototype.Search = function(Str, Props, SearchEngine, Type)
{
    this.Content.Search( Str, Props, SearchEngine, Type );
};

CHeaderFooter.prototype.Search_GetId = function(bNext, bCurrent)
{
    return this.Content.Search_GetId( bNext, bCurrent );
};

//----------------------------------------------------------------------------------------------------------------------
// CHeaderFooterController
//----------------------------------------------------------------------------------------------------------------------
CHeaderFooterController.prototype.Search = function(Str, Props, SearchEngine)
{
    var bHdr_first = false;
    var bHdr_even  = false;

    if ( this.Content[0].Header.First != this.Content[0].Header.Odd )
        bHdr_first = true;

    if ( this.Content[0].Header.Even != this.Content[0].Header.Odd )
        bHdr_even = true;

    if ( true === bHdr_even && true === bHdr_first )
    {
        if ( null != this.Content[0].Header.First )
            this.Content[0].Header.First.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_First  );

        if ( null != this.Content[0].Header.Even )
            this.Content[0].Header.Even.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_Even );

        if ( null != this.Content[0].Header.Odd )
            this.Content[0].Header.Odd.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_Odd_no_First );
    }
    else if ( true === bHdr_even )
    {
        if ( null != this.Content[0].Header.Even )
            this.Content[0].Header.Even.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_Even );

        if ( null != this.Content[0].Header.Odd )
            this.Content[0].Header.Odd.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_Odd );
    }
    else if ( true === bHdr_first )
    {
        if ( null != this.Content[0].Header.First )
            this.Content[0].Header.First.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_First );

        if ( null != this.Content[0].Header.Odd )
            this.Content[0].Header.Odd.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_All_no_First );
    }
    else
    {
        if ( null != this.Content[0].Header.Odd )
            this.Content[0].Header.Odd.Search( Str, Props, SearchEngine, search_Header | search_HdrFtr_All );
    }

    var bFtr_first = false;
    var bFtr_even  = false;

    if ( this.Content[0].Footer.First != this.Content[0].Footer.Odd )
        bFtr_first = true;

    if ( this.Content[0].Footer.Even != this.Content[0].Footer.Odd )
        bFtr_even = true;

    if ( true === bFtr_even && true === bFtr_first )
    {
        if ( null != this.Content[0].Footer.First )
            this.Content[0].Footer.First.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_First );

        if ( null != this.Content[0].Footer.Even )
            this.Content[0].Footer.Even.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_Even );

        if ( null != this.Content[0].Footer.Odd )
            this.Content[0].Footer.Odd.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_Odd_no_First );
    }
    else if ( true === bFtr_even )
    {
        if ( null != this.Content[0].Footer.Even )
            this.Content[0].Footer.Even.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_Even );

        if ( null != this.Content[0].Footer.Odd )
            this.Content[0].Footer.Odd.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_Odd );
    }
    else if ( true === bFtr_first )
    {
        if ( null != this.Content[0].Footer.First )
            this.Content[0].Footer.First.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_First );

        if ( null != this.Content[0].Footer.Odd )
            this.Content[0].Footer.Odd.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_All_no_First );
    }
    else
    {
        if ( null != this.Content[0].Footer.Odd )
            this.Content[0].Footer.Odd.Search( Str, Props, SearchEngine, search_Footer | search_HdrFtr_All );
    }
};

CHeaderFooterController.prototype.Search_GetId = function(bNext)
{
    var HdrFtrs = new Array();
    var CurPos  = -1;

    if ( null != this.Content[0].Header.First )
    {
        HdrFtrs.push( this.Content[0].Header.First );

        if ( this.CurHdrFtr === this.Content[0].Header.First )
            CurPos = HdrFtrs.length - 1;
    }

    if ( null != this.Content[0].Footer.First )
    {
        HdrFtrs.push( this.Content[0].Footer.First );

        if ( this.CurHdrFtr === this.Content[0].Footer.First )
            CurPos = HdrFtrs.length - 1;
    }

    if ( null === Id && null != this.Content[0].Header.Even && this.Content[0].Header.First != this.Content[0].Header.Even )
    {
        HdrFtrs.push( this.Content[0].Header.Even );

        if ( this.CurHdrFtr === this.Content[0].Header.Even )
            CurPos = HdrFtrs.length - 1;
    }

    if ( null === Id && null != this.Content[0].Footer.Even && this.Content[0].Footer.First != this.Content[0].Footer.Even )
    {
        HdrFtrs.push( this.Content[0].Footer.Even );

        if ( this.CurHdrFtr === this.Content[0].Footer.Even )
            CurPos = HdrFtrs.length - 1;
    }

    if ( null === Id && null != this.Content[0].Header.Odd && this.Content[0].Header.First != this.Content[0].Header.Odd && this.Content[0].Header.First != this.Content[0].Header.Odd )
    {
        HdrFtrs.push( this.Content[0].Header.Odd );

        if ( this.CurHdrFtr === this.Content[0].Header.Odd  )
            CurPos = HdrFtrs.length - 1;
    }

    if ( null === Id && null != this.Content[0].Footer.Odd && this.Content[0].Footer.First != this.Content[0].Footer.Odd && this.Content[0].Footer.First != this.Content[0].Footer.Odd )
    {
        HdrFtrs.push( this.Content[0].Footer.Odd );

        if ( this.CurHdrFtr === this.Content[0].Footer.Odd )
            CurPos = HdrFtrs.length - 1;
    }

    var Count = HdrFtrs.length;

    if ( -1 != CurPos )
    {
        var Id = this.CurHdrFtr.Search_GetId( bNext, true );
        if ( null != Id )
            return Id;

        if ( true === bNext )
        {
            for ( var Index = CurPos + 1; Index < Count; Index++ )
            {
                Id = HdrFtrs[Index].Search_GetId( bNext, false );

                if ( null != Id )
                    return Id;
            }
        }
        else
        {
            for ( var Index = CurPos - 1; Index >= 0; Index-- )
            {
                Id = HdrFtrs[Index].Search_GetId( bNext, false );

                if ( null != Id )
                    return Id;
            }
        }
    }

    return null;
};
//----------------------------------------------------------------------------------------------------------------------
// CTable
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Search = function(Str, Props, SearchEngine, Type)
{
    for ( var CurRow = 0; CurRow < this.Content.length; CurRow++ )
    {
        var Row = this.Content[CurRow];
        var CellsCount = Row.Get_CellsCount();

        for ( var CurCell = 0; CurCell < CellsCount; CurCell++ )
        {
            Row.Get_Cell( CurCell ).Content.Search( Str, Props, SearchEngine, Type );
        }
    }
};

CTable.prototype.Search_GetId = function(bNext, bCurrent)
{
    if ( true === bCurrent )
    {
        var Id = null;
        var CurRow  = 0;
        var CurCell = 0;
        if ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type )
        {
            var Pos = ( true === bNext ? this.Selection.Data[this.Selection.Data.length - 1] : this.Selection.Data[0] );
            CurRow  = Pos.Row;
            CurCell = Pos.CurCell;
        }
        else
        {
            Id = this.CurCell.Content.Search_GetId(bNext, true);
            if ( Id != null )
                return Id;

            CurRow  = this.CurCell.Row.Index;
            CurCell = this.CurCell.Index;
        }

        var Rows_Count = this.Content.length;
        if ( true === bNext )
        {
            for ( var _CurRow = CurRow; _CurRow < Rows_Count; _CurRow++ )
            {
                var Row = this.Content[_CurRow];
                var Cells_Count = Row.Get_CellsCount();
                var StartCell = ( _CurRow === CurRow ? CurCell + 1 : 0 );
                for ( var _CurCell = StartCell; _CurCell < Cells_Count; _CurCell++ )
                {
                    var Cell = Row.Get_Cell(_CurCell);
                    Id = Cell.Content.Search_GetId( true, false );
                    if ( null != Id )
                        return Id;
                }
            }
        }
        else
        {
            for ( var _CurRow = CurRow; _CurRow >= 0; _CurRow-- )
            {
                var Row = this.Content[_CurRow];
                var Cells_Count = Row.Get_CellsCount();
                var StartCell = ( _CurRow === CurRow ? CurCell - 1 : Cells_Count - 1 );
                for ( var _CurCell = StartCell; _CurCell >= 0; _CurCell-- )
                {
                    var Cell = Row.Get_Cell(_CurCell);
                    Id = Cell.Content.Search_GetId( false, false );
                    if ( null != Id )
                        return Id;
                }
            }

        }
    }
    else
    {
        var Rows_Count = this.Content.length;
        if ( true === bNext )
        {
            for ( var _CurRow = 0; _CurRow < Rows_Count; _CurRow++ )
            {
                var Row = this.Content[_CurRow];
                var Cells_Count = Row.Get_CellsCount();
                for ( var _CurCell = 0; _CurCell < Cells_Count; _CurCell++ )
                {
                    var Cell = Row.Get_Cell(_CurCell);
                    Id = Cell.Content.Search_GetId( true, false );
                    if ( null != Id )
                        return Id;
                }
            }
        }
        else
        {
            for ( var _CurRow = Rows_Count - 1; _CurRow >= 0; _CurRow-- )
            {
                var Row = this.Content[_CurRow];
                var Cells_Count = Row.Get_CellsCount();
                for ( var _CurCell = Cells_Count - 1; _CurCell >= 0; _CurCell-- )
                {
                    var Cell = Row.Get_Cell(_CurCell);
                    Id = Cell.Content.Search_GetId( false, false );
                    if ( null != Id )
                        return Id;
                }
            }

        }
    }

    return Id;
};
//----------------------------------------------------------------------------------------------------------------------
// Paragraph
//----------------------------------------------------------------------------------------------------------------------
Paragraph.prototype.Search = function(Str, Props, SearchEngine, Type)
{
    var bMatchCase = Props.MatchCase;

    // Сначала найдем элементы поиска в данном параграфе
    for ( var Pos = 0; Pos < this.Content.length; Pos++ )
    {
        var Item = this.Content[Pos];
        if ( para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type )
            continue;

        if ( para_Drawing === Item.Type )
            Item.Search(Str, Props, SearchEngine, Type);

        if ( (" " === Str[0] && para_Space === Item.Type) || ( para_Text === Item.Type && (  ( true != bMatchCase && (Item.Value).toLowerCase() === Str[0].toLowerCase() ) || ( true === bMatchCase && Item.Value === Str[0] ) ) ) )
        {
            if ( 1 === Str.length )
            {
                var Id = SearchEngine.Add( this );
                this.SearchResults[Id] = new CParagraphSearchElement(Pos, Pos + 1, Type );
            }
            else
            {
                var bFind = true;
                var Pos2 = Pos + 1;
                // Проверяем
                for ( var Index = 1; Index < Str.length; Index++ )
                {
                    // Пропускаем записи TextPr
                    while ( Pos2 < this.Content.length && ( para_TextPr === this.Content[Pos2].Type ) )
                        Pos2++;

                    if ( ( Pos2 >= this.Content.length ) || (" " === Str[Index] && para_Space != this.Content[Pos2].Type) || ( " " != Str[Index] && ( ( para_Text != this.Content[Pos2].Type ) || ( para_Text === this.Content[Pos2].Type && !(  ( true != bMatchCase && (this.Content[Pos2].Value).toLowerCase() === Str[Index].toLowerCase() ) || ( true === bMatchCase && this.Content[Pos2].Value === Str[Index] ) ) ) ) ) )
                    {
                        bFind = false;
                        break;
                    }

                    Pos2++;
                }

                if ( true === bFind )
                {
                    var Id = SearchEngine.Add( this );
                    this.SearchResults[Id] = new CParagraphSearchElement(Pos, Pos2, Type );
                }
            }
        }
    }

    var MaxShowValue = 100;
    for ( var FoundId in this.SearchResults )
    {
        var StartPos = this.SearchResults[FoundId].StartPos;
        var EndPos   = this.SearchResults[FoundId].EndPos;
        var ResultStr = new String();

        var _Str = "";
        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            Item = this.Content[Pos];

            if ( para_Text === Item.Type )
                _Str += Item.Value;
            else if ( para_Space === Item.Type )
                _Str += " ";
        }

        // Теперь мы должны сформировать строку
        if ( _Str.length >= MaxShowValue )
        {
            ResultStr = "\<b\>";
            for ( var Index = 0; Index < MaxShowValue - 1; Index++ )
                ResultStr += _Str[Index];

            ResultStr += "\</b\>...";
        }
        else
        {
            ResultStr = "\<b\>" + _Str + "\</b\>";

            var Pos_before = StartPos - 1;
            var Pos_after  = EndPos;
            var LeaveCount = MaxShowValue - _Str.length;

            var bAfter = true;
            while ( LeaveCount > 0 && ( Pos_before >= 0 || Pos_after < this.Content.length ) )
            {
                var TempPos = ( true === bAfter ? Pos_after : Pos_before );
                var Flag = 0;
                while ( ( ( TempPos >= 0 && false === bAfter ) || ( TempPos < this.Content.length && true === bAfter ) ) && para_Text != this.Content[TempPos].Type && para_Space != this.Content[TempPos].Type )
                {
                    if ( true === bAfter )
                    {
                        TempPos++;
                        if ( TempPos >= this.Content.length )
                        {
                            TempPos = Pos_before;
                            bAfter = false;
                            Flag++;
                        }
                    }
                    else
                    {
                        TempPos--;
                        if ( TempPos < 0 )
                        {
                            TempPos = Pos_after;
                            bAfter = true;
                            Flag++;
                        }
                    }

                    // Дошли до обоих концов параграфа
                    if ( Flag >= 2 )
                        break;
                }

                if ( Flag >= 2 || !( ( TempPos >= 0 && false === bAfter ) || ( TempPos < this.Content.length && true === bAfter ) ) )
                    break;

                if ( true === bAfter )
                {
                    ResultStr += (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value);
                    Pos_after = TempPos + 1;
                    LeaveCount--;

                    if ( Pos_before >= 0 )
                        bAfter = false;

                    if ( Pos_after >= this.Content.length )
                        bAfter = false;
                }
                else
                {
                    ResultStr = (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value) + ResultStr;
                    Pos_before = TempPos - 1;
                    LeaveCount--;

                    if ( Pos_after < this.Content.length )
                        bAfter = true;

                    if ( Pos_before < 0 )
                        bAfter = true;
                }
            }
        }

        this.SearchResults[FoundId].ResultStr = ResultStr;
    }
};

Paragraph.prototype.Search_GetId = function(bNext, bCurrent)
{
    var Pos = -1;
    if ( true === bCurrent )
    {
        Pos = this.CurPos.ContentPos;
        if ( true == this.Selection.Use )
            Pos = ( true === bNext ? Math.max(this.Selection.StartPos,this.Selection.EndPos) : Math.min(this.Selection.StartPos,this.Selection.EndPos)  );
    }
    else
    {
        if ( true === bNext )
            Pos = -1;
        else
            Pos = this.Content.length - 1;
    }

    var NearElementId  = null;
    var NearElementPos = -1;

    if ( true === bNext )
    {
        for ( var ElemId in this.SearchResults )
        {
            var Element = this.SearchResults[ElemId];
            if ( Pos <= Element.StartPos && ( -1 === NearElementPos || NearElementPos > Element.StartPos ) )
            {
                NearElementPos = Element.StartPos;
                NearElementId  = ElemId;
            }
        }
    }
    else
    {
        for ( var ElemId in this.SearchResults )
        {
            var Element = this.SearchResults[ElemId];
            if ( Pos >= Element.EndPos && ( -1 === NearElementPos || NearElementPos < Element.EndPos ) )
            {
                NearElementPos = Element.EndPos;
                NearElementId  = ElemId;
            }
        }
    }

    return NearElementId;
};