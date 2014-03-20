/**
 * User: Ilja.Kirillov
 * Date: 29.05.13
 * Time: 12:02
 */

//----------------------------------------------------------------------------------------------------------------------
// CParagraphSearchElement
//         Найденные элементы в параграфе. Записаны в массиве Paragraph.SearchResults
//----------------------------------------------------------------------------------------------------------------------
function CParagraphSearchElement(StartPos, EndPos, Type, Id)
{
    this.StartPos  = StartPos;
    this.EndPos    = EndPos;
    this.Type      = Type;
    this.ResultStr = "";
    this.Id        = Id;

    this.ClassesS = new Array();
    this.ClassesE = new Array();
}

//----------------------------------------------------------------------------------------------------------------------
// CDocumentSearch
//         Механизм поиска. Хранит параграфы с найденной строкой
//----------------------------------------------------------------------------------------------------------------------
function CDocumentSearch()
{
    this.Text          = "";
    this.MatchCase     = false;

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
        this.Text      = Text;
        this.MatchCase = Props.MatchCase;
    },

    Compare : function(Text, Props)
    {
        if ( this.Text === Text && this.MatchCase === Props.MatchCase )
            return true;

        return false;
    },

    Clear : function()
    {
        this.Text        = "";
        this.MatchCase   = false;

        // Очищаем предыдущие элементы поиска
        for ( var Id in this.Elements )
        {
            var Paragraph = this.Elements[Id];

            if ( true !== Debug_ParaRunMode )
                Paragraph.SearchResults = new Object();
            else
                Paragraph.Clear_SearchResults();
        }

        this.Id        = 0;
        this.Count     = 0;
        this.Elements  = new Object();
        this.CurId     = -1;
        this.Direction = true;
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

                if ( true !== Debug_ParaRunMode )
                {
                    Paragraph.Selection.StartPos = SearchElement.StartPos;
                    Paragraph.Selection.EndPos   = SearchElement.EndPos;
                    Paragraph.CurPos.ContentPos  = SearchElement.StartPos;
                }
                else
                {
                    Paragraph.Set_SelectionContentPos(SearchElement.StartPos, SearchElement.EndPos);
                    Paragraph.Set_ParaContentPos(SearchElement.StartPos, false, -1, -1);
                }

                Paragraph.Document_SetThisElementCurrent(true);
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
        var Para = this.Elements[Id];
        if ( undefined != Para )
        {
            var SearchElement = Para.SearchResults[Id];
            if ( undefined != SearchElement )
            {
                if ( true !== Debug_ParaRunMode )
                {
                    var StartPos = SearchElement.StartPos;
                    var EndPos   = SearchElement.EndPos;

                    for ( var Pos = EndPos - 1; Pos >= StartPos; Pos-- )
                    {
                        var ItemType = Para.Content[Pos].Type;
                        if ( para_TextPr != ItemType && para_CollaborativeChangesStart != ItemType && para_CollaborativeChangesEnd != ItemType && para_CommentStart != ItemType && para_CommentEnd != ItemType && para_HyperlinkStart != ItemType && para_HyperlinkEnd != ItemType )
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
                else
                {
                    // Сначала в начальную позицию поиска добавляем новый текст
                    var StartContentPos = SearchElement.StartPos;
                    var StartRun = SearchElement.ClassesS[SearchElement.ClassesS.length - 1];

                    var RunPos = StartContentPos.Get( SearchElement.ClassesS.length - 1 );

                    var Len = NewStr.length;
                    for ( var Pos = 0; Pos < Len; Pos++ )
                    {
                        StartRun.Add_ToContent( RunPos + Pos, new ParaText( NewStr[Pos] ) );
                    }

                    // Выделяем старый объект поиска и удаляем его
                    Para.Selection.Use = true;
                    Para.Set_SelectionContentPos( SearchElement.StartPos, SearchElement.EndPos );
                    Para.Remove();

                    // Перемещаем курсор в конец поиска
                    Para.Selection_Remove();
                    Para.Set_ParaContentPos( SearchElement.StartPos, true, -1, -1 );

                    // Удаляем запись о данном элементе
                    this.Count--;

                    Para.Remove_SearchResult( Id );
                    delete this.Elements[Id];
                }
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

        var Id = ParaDrawing.Search_GetId( bNext, true );
        if ( null != Id )
            return Id;

        ParaDrawing.GoTo_Text( true === bNext ? false : true );
        this.DrawingObjects.resetSelection();
    }

    if ( docpostype_Content === this.CurPos.Type )
    {
        var Id = null;

        var Pos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag )
            Pos = ( true === bNext ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : Math.min(this.Selection.StartPos, this.Selection.EndPos) );

        var StartPos = Pos;

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

            Pos = 0;
            while ( Pos <= StartPos )
            {
                Id = this.Content[Pos].Search_GetId(true, false);

                if ( null != Id )
                    return Id;

                Pos++;
            }

            return null;
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

            Pos = this.Content.length - 1;
            while ( Pos >= StartPos )
            {
                Id = this.Content[Pos].Search_GetId(false, false);

                if ( null != Id )
                    return Id;

                Pos--;
            }

            return null;
        }
    }
    else if ( docpostype_HdrFtr === this.CurPos.Type )
    {
        return this.HdrFtr.Search_GetId( bNext );
    }

    return null;
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
    // Получим Id найденного элемента
    var Id = null;

    if ( true === bCurrent )
    {
        if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();

            Id = ParaDrawing.Search_GetId( bNext, true );
            if ( null != Id )
                return Id;

            ParaDrawing.GoTo_Text( true === bNext ? false : true );
        }

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

    if ( true !== Debug_ParaRunMode )
    {

        // Сначала найдем элементы поиска в данном параграфе
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type || para_CommentStart === Item.Type || para_CommentEnd === Item.Type || para_CollaborativeChangesStart === Item.Type || para_CollaborativeChangesEnd === Item.Type || para_HyperlinkStart === Item.Type || para_HyperlinkEnd === Item.Type )
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
                        var _TempType = this.Content[Pos2].Type;

                        // Пропускаем записи TextPr
                        while ( Pos2 < this.Content.length && ( para_Numbering === _TempType || para_PresentationNumbering === _TempType || para_TextPr === _TempType || para_CommentStart === _TempType || para_CommentEnd === _TempType || para_CollaborativeChangesStart === _TempType || para_CollaborativeChangesEnd === _TempType || para_HyperlinkStart === _TempType || para_HyperlinkEnd === _TempType ) )
                        {
                            Pos2++;
                            _TempType = this.Content[Pos2].Type;
                        }

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
    }
    else
    {
        var ParaSearch = new CParagraphSearch(this, Str, Props, SearchEngine, Type);

        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            ParaSearch.ContentPos.Update( CurPos, 0 );

            Element.Search( ParaSearch, 1 );
        }

        var MaxShowValue = 100;
        for ( var FoundId in this.SearchResults )
        {
            var StartPos = this.SearchResults[FoundId].StartPos;
            var EndPos   = this.SearchResults[FoundId].EndPos;
            var ResultStr = new String();

            var _Str = Str;

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

                var LeaveCount = MaxShowValue - _Str.length;
                var RunElementsAfter  = new CParagraphRunElements(EndPos, LeaveCount);
                var RunElementsBefore = new CParagraphRunElements(StartPos, LeaveCount);

                this.Get_NextRunElements(RunElementsAfter);
                this.Get_PrevRunElements(RunElementsBefore);

                var LeaveCount_2 = LeaveCount / 2;

                if ( RunElementsAfter.Elements.length >= LeaveCount_2 && RunElementsBefore.Elements.length >= LeaveCount_2 )
                {
                    for ( var Index = 0; Index < LeaveCount_2; Index++ )
                    {
                        var ItemB = RunElementsBefore.Elements[Index];
                        var ItemA = RunElementsAfter.Elements[Index];

                        ResultStr = (para_Text === ItemB.Type ? ItemB.Value : " ") + ResultStr + (para_Text === ItemA.Type ? ItemA.Value : " ");
                    }
                }
                else if ( RunElementsAfter.Elements.length < LeaveCount_2 )
                {
                    var TempCount = RunElementsAfter.Elements.length;
                    for ( var Index = 0; Index < TempCount; Index++ )
                    {
                        var ItemA = RunElementsAfter.Elements[Index];
                        ResultStr = ResultStr + (para_Text === ItemA.Type ? ItemA.Value : " ");
                    }

                    var TempCount = Math.min( 2 * LeaveCount_2 - RunElementsAfter.Elements.length, RunElementsBefore.Elements.length );
                    for ( var Index = 0; Index < TempCount; Index++ )
                    {
                        var ItemB = RunElementsBefore.Elements[Index];
                        ResultStr = (para_Text === ItemB.Type ? ItemB.Value : " ") + ResultStr;
                    }
                }
                else
                {
                    var TempCount = RunElementsAfter.Elements.length;
                    for ( var Index = 0; Index < TempCount; Index++ )
                    {
                        var ItemA = RunElementsAfter.Elements[Index];
                        ResultStr = ResultStr + (para_Text === ItemA.Type ? ItemA.Value : " ");
                    }

                    var TempCount = RunElementsBefore.Elements.length;
                    for ( var Index = 0; Index < TempCount; Index++ )
                    {
                        var ItemB = RunElementsBefore.Elements[Index];
                        ResultStr = (para_Text === ItemB.Type ? ItemB.Value : " ") + ResultStr;
                    }
                }
            }

            this.SearchResults[FoundId].ResultStr = ResultStr;
        }
    }
};

Paragraph.prototype.Search_GetId = function(bNext, bCurrent)
{
    if ( true !== Debug_ParaRunMode )
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
            // Найдем ближайший элемент среди найденных элементов в самом параграфе
            for ( var ElemId in this.SearchResults )
            {
                var Element = this.SearchResults[ElemId];
                if ( Pos <= Element.StartPos && ( -1 === NearElementPos || NearElementPos > Element.StartPos ) )
                {
                    NearElementPos = Element.StartPos;
                    NearElementId  = ElemId;
                }
            }

            var StartPos = Math.max( Pos, 0 );
            var EndPos   = Math.min( ( null === NearElementId ? this.Content.length - 1 : Element.StartPos ), this.Content.length - 1 );

            // Проверяем автофигуры между StartPos и EndPos
            for ( var TempPos = StartPos; TempPos < EndPos; TempPos++ )
            {
                var Item = this.Content[TempPos];
                if ( para_Drawing === Item.Type )
                {
                    var TempElementId = Item.Search_GetId( true, false );
                    if ( null != TempElementId )
                        return TempElementId;
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

            var StartPos = Math.max( ( null === NearElementId ? 0 : Element.EndPos ), 0 );
            var EndPos   = Math.min( Pos, this.Content.length - 1 );

            // Проверяем автофигуры между StartPos и EndPos
            for ( var TempPos = EndPos - 1; TempPos >= StartPos; TempPos-- )
            {
                var Item = this.Content[TempPos];
                if ( para_Drawing === Item.Type )
                {
                    var TempElementId = Item.Search_GetId( false, false );
                    if ( null != TempElementId )
                        return TempElementId;
                }
            }
        }

        return NearElementId;
    }
    else
    {
        // Определим позицию, начиная с которой мы будем искать ближайший найденный элемент
        var ContentPos = null;

        if ( true === bCurrent )
        {
            if ( true === this.Selection.Use )
            {
                var SSelContentPos = this.Get_ParaContentPos( true, true );
                var ESelContentPos = this.Get_ParaContentPos( true, false );

                if ( SSelContentPos.Compare( ESelContentPos ) > 0 )
                {
                    var Temp = ESelContentPos;
                    ESelContentPos = SSelContentPos;
                    SSelContentPos = Temp;
                }

                if ( true === bNext )
                    ContentPos = ESelContentPos;
                else
                    ContentPos = SSelContentPos;
            }
            else
                ContentPos = this.Get_ParaContentPos( false, false );
        }
        else
        {
            if ( true === bNext )
                ContentPos = this.Get_StartPos();
            else
                ContentPos = this.Get_EndPos( false );
        }

        // Производим поиск ближайшего элемента
        if ( true === bNext )
        {
            var StartPos = ContentPos.Get(0);
            var ContentLen = this.Content.length;

            for ( var CurPos = StartPos; CurPos < ContentLen; CurPos++ )
            {
                var ElementId = this.Content[CurPos].Search_GetId( true, CurPos === StartPos ? true : false, ContentPos, 1 );
                if ( null !== ElementId )
                    return ElementId;
            }
        }
        else
        {
            var StartPos = ContentPos.Get(0);
            var ContentLen = this.Content.length;

            for ( var CurPos = StartPos; CurPos >= 0; CurPos-- )
            {
                var ElementId = this.Content[CurPos].Search_GetId( false, CurPos === StartPos ? true : false, ContentPos, 1 );
                if ( null !== ElementId )
                    return ElementId;
            }
        }

        return null;
    }
};

Paragraph.prototype.Add_SearchResult = function(Id, StartContentPos, EndContentPos, Type)
{
    var SearchResult = new CParagraphSearchElement( StartContentPos, EndContentPos, Type, Id );

    this.SearchResults[Id] = SearchResult;

    SearchResult.ClassesS.push( this );
    SearchResult.ClassesE.push( this );

    this.Content[StartContentPos.Get(0)].Add_SearchResult( SearchResult, true, StartContentPos, 1 );
    this.Content[EndContentPos.Get(0)].Add_SearchResult( SearchResult, false, EndContentPos, 1 );
};

Paragraph.prototype.Clear_SearchResults = function()
{
    for ( var Id in this.SearchResults )
    {
        var SearchResult = this.SearchResults[Id];

        var ClassesCount = SearchResult.ClassesS.length;
        for ( var Pos = 1; Pos < ClassesCount; Pos++ )
        {
            SearchResult.ClassesS[Pos].Clear_SearchResults();
        }

        var ClassesCount = SearchResult.ClassesE.length;
        for ( var Pos = 1; Pos < ClassesCount; Pos++ )
        {
            SearchResult.ClassesE[Pos].Clear_SearchResults();
        }
    }

    this.SearchResults = new Object();
};

Paragraph.prototype.Remove_SearchResult = function(Id)
{
    var SearchResult = this.SearchResults[Id];
    if ( undefined !== SearchResult )
    {
        var ClassesCount = SearchResult.ClassesS.length;
        for ( var Pos = 1; Pos < ClassesCount; Pos++ )
        {
            SearchResult.ClassesS[Pos].Remove_SearchResult(SearchResult);
        }

        var ClassesCount = SearchResult.ClassesE.length;
        for ( var Pos = 1; Pos < ClassesCount; Pos++ )
        {
            SearchResult.ClassesE[Pos].Remove_SearchResult(SearchResult);
        }

        delete this.SearchResults[Id];
    }
};

//----------------------------------------------------------------------------------------------------------------------
// ParaRun
//----------------------------------------------------------------------------------------------------------------------
ParaRun.prototype.Search = function(ParaSearch, Depth)
{
    this.SearchMarks = new Array();

    var Para         = ParaSearch.Paragraph;
    var Str          = ParaSearch.Str;
    var Props        = ParaSearch.Props;
    var SearchEngine = ParaSearch.SearchEngine;
    var Type         = ParaSearch.Type;

    var MatchCase    = Props.MatchCase;

    var ContentLen = this.Content.length;

    for ( var Pos = 0; Pos < ContentLen; Pos++ )
    {
        var Item = this.Content[Pos];

        if ( para_Drawing === Item.Type )
        {
            Item.Search( Str, Props, SearchEngine, Type );
            ParaSearch.Reset();
        }

        if ( (" " === Str[ParaSearch.SearchIndex] && para_Space === Item.Type) || ( para_Text === Item.Type && (  ( true != MatchCase && (Item.Value).toLowerCase() === Str[ParaSearch.SearchIndex].toLowerCase() ) || ( true === MatchCase && Item.Value === Str[ParaSearch.SearchIndex] ) ) ) )
        {
            if ( 0 === ParaSearch.SearchIndex )
            {
                var StartContentPos = ParaSearch.ContentPos.Copy();
                StartContentPos.Update( Pos, Depth );
                ParaSearch.StartPos = StartContentPos;
            }

            ParaSearch.SearchIndex++;

            if ( ParaSearch.SearchIndex === Str.length )
            {
                var EndContentPos = ParaSearch.ContentPos.Copy();
                EndContentPos.Update( Pos + 1, Depth );

                var Id = SearchEngine.Add( Para );
                Para.Add_SearchResult( Id, ParaSearch.StartPos, EndContentPos, Type );

                // Обнуляем поиск
                ParaSearch.Reset();
            }
        }
        else if ( 0 !== ParaSearch.SearchIndex )
        {
            // Обнуляем поиск
            ParaSearch.Reset();
        }
    }
};

ParaRun.prototype.Add_SearchResult = function(SearchResult, Start, ContentPos, Depth)
{
    if ( true === Start )
        SearchResult.ClassesS.push( this );
    else
        SearchResult.ClassesE.push( this );

    this.SearchMarks.push( new CParagraphSearchMark( SearchResult, Start, Depth ) );
};

ParaRun.prototype.Clear_SearchResults = function()
{
    this.SearchMarks = new Array();
};

ParaRun.prototype.Remove_SearchResult = function(SearchResult)
{
    var MarksCount = this.SearchMarks.length;
    for ( var Index = 0; Index < MarksCount; Index++ )
    {
        var Mark = this.SearchMarks[Index];
        if ( SearchResult === Mark.SearchResult )
        {
            this.SearchMarks.splice( Index, 1 );
            Index--;
            MarksCount--;
        }
    }
};

ParaRun.prototype.Search_GetId = function(bNext, bUseContentPos, ContentPos, Depth)
{
    var StartPos = 0;

    if ( true === bUseContentPos )
    {
        StartPos = ContentPos.Get( Depth );
    }
    else
    {
        if ( true === bNext )
        {
            StartPos = 0;
        }
        else
        {
            StartPos = this.Content.length;
        }
    }

    var NearElementId = null;

    if ( true === bNext )
    {
        var NearPos = this.Content.length;

        var SearchMarksCount = this.SearchMarks.length;
        for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
        {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.StartPos.Get(Mark.Depth);

            if ( MarkPos >= StartPos && MarkPos < NearPos )
            {
                NearElementId = Mark.SearchResult.Id;
                NearPos       = MarkPos;
            }
        }

        for ( var CurPos = StartPos; CurPos < NearPos; CurPos++ )
        {
            var Item = this.Content[CurPos];
            if ( para_Drawing === Item.Type )
            {
                var TempElementId = Item.Search_GetId( true, false );
                if ( null != TempElementId )
                    return TempElementId;
            }
        }
    }
    else
    {
        var NearPos = -1;

        var SearchMarksCount = this.SearchMarks.length;
        for ( var SPos = 0; SPos < SearchMarksCount; SPos++)
        {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.StartPos.Get(Mark.Depth);

            if ( MarkPos < StartPos && MarkPos > NearPos )
            {
                NearElementId = Mark.SearchResult.Id;
                NearPos       = MarkPos;
            }
        }

        StartPos = Math.min( this.Content.length - 1, StartPos );
        for ( var CurPos = StartPos; CurPos > NearPos; CurPos-- )
        {
            var Item = this.Content[CurPos];
            if ( para_Drawing === Item.Type )
            {
                var TempElementId = Item.Search_GetId( false, false );
                if ( null != TempElementId )
                    return TempElementId;
            }
        }

    }

    return NearElementId;
};

//----------------------------------------------------------------------------------------------------------------------
// ParaHyperlink
//----------------------------------------------------------------------------------------------------------------------
ParaHyperlink.prototype.Search = function(ParaSearch, Depth)
{
    this.SearchMarks = new Array();

    var ContentLen = this.Content.length;
    for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
    {
        var Element = this.Content[CurPos];

        ParaSearch.ContentPos.Update( CurPos, Depth );

        Element.Search( ParaSearch, Depth + 1 );
    }
};

ParaHyperlink.prototype.Add_SearchResult = function(SearchResult, Start, ContentPos, Depth)
{
    if ( true === Start )
        SearchResult.ClassesS.push( this );
    else
        SearchResult.ClassesE.push( this );

    this.SearchMarks.push( new CParagraphSearchMark( SearchResult, Start, Depth ) );

    this.Content[ContentPos.Get(Depth)].Add_SearchResult( SearchResult, Start, ContentPos, Depth + 1 );
};

ParaHyperlink.prototype.Clear_SearchResults = function()
{
    this.SearchMarks = new Array();
};

ParaHyperlink.prototype.Remove_SearchResult = function(SearchResult)
{
    var MarksCount = this.SearchMarks.length;
    for ( var Index = 0; Index < MarksCount; Index++ )
    {
        var Mark = this.SearchMarks[Index];
        if ( SearchResult === Mark.SearchResult )
        {
            this.SearchMarks.splice( Index, 1 );
            Index--;
            MarksCount--;
        }
    }
};

ParaHyperlink.prototype.Search_GetId = function(bNext, bUseContentPos, ContentPos, Depth)
{
    // Определим позицию, начиная с которой мы будем искать ближайший найденный элемент
    var StartPos = 0;

    if ( true === bUseContentPos )
    {
        StartPos = ContentPos.Get( Depth );
    }
    else
    {
        if ( true === bNext )
        {
            StartPos = 0;
        }
        else
        {
            StartPos = this.Content.length - 1;
        }
    }

    // Производим поиск ближайшего элемента
    if ( true === bNext )
    {
        var ContentLen = this.Content.length;

        for ( var CurPos = StartPos; CurPos < ContentLen; CurPos++ )
        {
            var ElementId = this.Content[CurPos].Search_GetId( true, bUseContentPos && CurPos === StartPos ? true : false, ContentPos, Depth + 1 );
            if ( null !== ElementId )
                return ElementId;
        }
    }
    else
    {
        var ContentLen = this.Content.length;

        for ( var CurPos = StartPos; CurPos >= 0; CurPos-- )
        {
            var ElementId = this.Content[CurPos].Search_GetId( false, bUseContentPos && CurPos === StartPos ? true : false, ContentPos, Depth + 1 );
            if ( null !== ElementId )
                return ElementId;
        }
    }

    return null;
};

//----------------------------------------------------------------------------------------------------------------------
// ParaComment
//----------------------------------------------------------------------------------------------------------------------
ParaComment.prototype.Search = function(ParaSearch, Depth)
{
};

ParaComment.prototype.Add_SearchResult = function(SearchResult, Start, ContentPos, Depth)
{
};

ParaComment.prototype.Clear_SearchResults = function()
{
};

ParaComment.prototype.Remove_SearchResult = function(SearchResult)
{
};

ParaComment.prototype.Search_GetId = function(bNext, bUseContentPos, ContentPos, Depth)
{
    return null;
};
//----------------------------------------------------------------------------------------------------------------------
// ParaMath
//----------------------------------------------------------------------------------------------------------------------
ParaMath.prototype.Search = function(ParaSearch, Depth)
{
    // Обнуляем поиск
    ParaSearch.Reset();
};

ParaMath.prototype.Add_SearchResult = function(SearchResult, Start, ContentPos, Depth)
{
};

ParaMath.prototype.Clear_SearchResults = function()
{
};

ParaMath.prototype.Remove_SearchResult = function(SearchResult)
{
};

ParaMath.prototype.Search_GetId = function(bNext, bUseContentPos, ContentPos, Depth)
{
    return null;
};

//----------------------------------------------------------------------------------------------------------------------
// Вспомогательные классы для поиска внутри параграфа
//----------------------------------------------------------------------------------------------------------------------
function CParagraphSearch(Paragraph, Str, Props, SearchEngine, Type)
{
    this.Paragraph    = Paragraph;
    this.Str          = Str;
    this.Props        = Props;
    this.SearchEngine = SearchEngine;
    this.Type         = Type;

    this.ContentPos   = new CParagraphContentPos();

    this.StartPos     = null; // Запоминаем здесь стартовую позицию поиска
    this.SearchIndex  = 0;    // Номер символа, с которым мы проверяем совпадение
}

CParagraphSearch.prototype =
{
    Reset : function()
    {
        this.StartPos    = null;
        this.SearchIndex = 0;
    }
};

function CParagraphSearchMark(SearchResult, Start, Depth)
{
    this.SearchResult = SearchResult;
    this.Start        = Start;
    this.Depth        = Depth;
}
