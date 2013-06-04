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
    this.Id       = 0;
    this.Count    = 0;
    this.Elements = new Array();
}

CDocumentSearch.prototype =
{
    Clear : function()
    {
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
        }
    },

    Replace : function(NewStr, Id)
    {
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
                    Para.Internal_Content_Add( StartPos + Pos, new ParaText( NewStr[Pos] ) );
                }

                Para.RecalcInfo.Set_Type_0( pararecalc_0_All );
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
    }
};

//----------------------------------------------------------------------------------------------------------------------
// CDocument
//----------------------------------------------------------------------------------------------------------------------
CDocument.prototype.Search = function(Str, Props)
{
    var StartTime = new Date().getTime();

    this.SearchEngine.Clear();

    // Поиск в колонтитулах
    this.HdrFtr.Search( Str, Props, this.SearchEngine );

    // Поиск в основном документе
    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        this.Content[Index].Search( Str, Props, this.SearchEngine, search_Common );
    }

    this.DrawingDocument.ClearCachePages();
    this.DrawingDocument.FirePaint();

    console.log( "Search logic: " + ((new Date().getTime() - StartTime) / 1000) + " s"  );

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

    if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : CheckParagraphs, CheckType : changestype_Paragraph_Content } ) )
    {
        History.Create_NewPoint();

        if ( true === bAll )
            this.SearchEngine.Replace_All( NewStr );
        else
            this.SearchEngine.Replace( NewStr, Id );

        this.Recalculate();
        this.RecalculateCurPos();

        bResult = true;
    }

    this.Document_UpdateInterfaceState();
    this.Document_UpdateSelectionState();
    this.Document_UpdateRulersState();

    return bResult;
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

//----------------------------------------------------------------------------------------------------------------------
// CHeaderFooter
//----------------------------------------------------------------------------------------------------------------------
CHeaderFooter.prototype.Search = function(Str, Props, SearchEngine, Type)
{
    this.Content.Search( Str, Props, SearchEngine, Type );
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