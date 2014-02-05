// При добавлении нового элемента ParagraphContent, добавить его обработку в
// следующие функции:
// Internal_Recalculate1, Internal_Recalculate2, Draw, Internal_RemoveBackward,
// Internal_RemoveForward, Add, Internal_GetStartPos, Internal_MoveCursorBackward,
// Internal_MoveCursorForward, Internal_AddTextPr, Internal_GetContentPosByXY,
// Selection_SetEnd, Selection_CalculateTextPr, IsEmpty, Selection_IsEmpty,
// Cursor_IsStart, Cursor_IsEnd, Is_ContentOnFirstPage
var type_Paragraph = 0x0001;

var UnknownValue  = null;

var Debug_ParaRunMode = false;

// Класс Paragraph
function Paragraph(DrawingDocument, Parent, PageNum, X, Y, XLimit, YLimit, bFromPresentation)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Prev = null;
    this.Next = null;

    this.Index = -1;

    this.Parent  = Parent;
    this.PageNum = PageNum;

    this.X      = X;
    this.Y      = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;

    this.CompiledPr =
    {
        Pr         : null,  // Скомпилированный (окончательный стиль параграфа)
        NeedRecalc : true   // Нужно ли пересчитать скомпилированный стиль
    };
    this.Pr = new CParaPr();

    // Рассчитанное положение рамки
    this.CalculatedFrame =
    {
        L : 0,       // Внутренний рект, по которому идет рассчет
        T : 0,
        W : 0,
        H : 0,
        L2 : 0,      // Внешний рект, с учетом границ
        T2 : 0,
        W2 : 0,
        H2 : 0,
        PageIndex : 0
    };

    // Данный TextPr будет относится только к символу конца параграфа
    this.TextPr = new ParaTextPr();
    this.TextPr.Parent = this;

    this.Bounds = new CDocumentBounds( X, Y, X_Right_Field, Y );

    this.RecalcInfo = new CParaRecalcInfo();

    this.Pages = new Array(); // Массив страниц (CParaPage)
    this.Lines = new Array(); // Массив строк (CParaLine)

    // Добавляем в контент элемент "конец параграфа"
    this.Content = new Array();

    if ( true !== Debug_ParaRunMode )
    {
        this.Content[0] = new ParaEnd();
        this.Content[1] = new ParaEmpty();
    }
    else
    {
        var EndRun = new ParaRun(editor, this);
        EndRun.Content[0] = new ParaEnd();

        this.Content[0] = EndRun;
    }

    this.Numbering = new ParaNumbering();

    this.CurPos  =
    {
        X           : 0,
        Y           : 0,
        ContentPos  : 0,  // Ближайшая позиция в контенте (между элементами)
        ContentPos2 : -1, // Реальный элемент
        Line        : -1,
        Range       : -1,
        RealX       : 0, // позиция курсора, без учета расположения букв
        RealY       : 0, // это актуально для клавиш вверх и вниз
        PagesPos    : 0  // позиция в массиве this.Pages
    };

    this.Selection = new CParagraphSelection();

    this.NeedReDraw = true;
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = editor && editor.isDocumentEditor ? editor.WordControl.m_oLogicDocument : null;
	this.bFromDocument = bFromPresentation === true ? false : !!this.LogicDocument;
    this.TurnOffRecalcEvent = false;

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.Lock = new CLock(); // Зажат ли данный параграф другим пользователем
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }

    this.DeleteCollaborativeMarks = true;
    this.DeleteCommentOnRemove    = true; // Удаляем ли комменты в функциях Internal_Content_Remove

    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    // Свойства необходимые для презентаций
    this.PresentationPr =
    {
        Level  : 0,
        Bullet : new CPresentationBullet()
    };

    this.FontMap =
    {
        Map        : {},
        NeedRecalc : true
    };

    this.SearchResults = new Object();

    this.SpellChecker = new CParaSpellChecker();

    this.NearPosArray = new Array();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

Paragraph.prototype =
{
    GetType : function()
    {
        return type_Paragraph;
    },

    GetId : function()
    {
        return this.Id;
    },

    SetId : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.GetId();
    },

    Set_Id : function(newId)
    {
        return this.SetId( newId );
    },

    Use_Wrap : function()
    {
        if ( undefined != this.Get_FramePr() )
            return false;

        return true;
    },

    Use_YLimit : function()
    {
        if ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument )
            return false;

        return true;
    },

	Set_Pr : function(oNewPr)
	{
        var Pr_old = this.Pr;
        var Pr_new = oNewPr;
        History.Add( this, { Type : historyitem_Paragraph_Pr, Old : Pr_old, New : Pr_new } );

        this.Pr = oNewPr;

        this.Recalc_CompiledPr();
	},
	
    Copy : function(Parent)
    {
        var Para = new Paragraph(this.DrawingDocument, Parent, 0, 0, 0, 0, 0);

        // Копируем настройки
	    Para.Set_Pr(this.Pr.Copy());

        Para.TextPr.Set_Value( this.TextPr.Value );

        // Удаляем содержимое нового параграфа
        Para.Internal_Content_Remove2(0, Para.Content.length);

        // Копируем содержимое параграфа
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            if ( true === Item.Is_RealContent() )
                Para.Internal_Content_Add( Para.Content.length, Item.Copy(), false );
        }

        return Para;
    },

    Get_AllDrawingObjects : function(DrawingObjs)
    {
        if ( undefined === DrawingObjs )
            DrawingObjs = new Array();

        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Drawing === Item.Type )
                DrawingObjs.push( Item );
        }

        return DrawingObjs;
    },

    Get_AllParagraphs_ByNumbering : function(NumPr, ParaArray)
    {
        var _NumPr = this.Numbering_Get();

        if ( undefined != _NumPr && _NumPr.NumId === NumPr.NumId && ( _NumPr.Lvl === NumPr.Lvl || undefined === NumPr.Lvl ) )
            ParaArray.push( this );

        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Drawing === Item.Type )
                Item.Get_AllParagraphs_ByNumbering( NumPr, ParaArray );
        }
    },

    Get_PageBounds : function(PageIndex)
    {
        return this.Pages[PageIndex].Bounds;
    },

    Get_EmptyHeight : function()
    {
        var Pr = this.Get_CompiledPr();
        var EndTextPr = Pr.TextPr.Copy();
        EndTextPr.Merge( this.TextPr.Value );

        g_oTextMeasurer.SetTextPr( EndTextPr );
        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

        return g_oTextMeasurer.GetHeight();
    },

    Reset : function (X,Y, XLimit, YLimit, PageNum)
    {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;

        this.PageNum = PageNum;

        // При первом пересчете параграфа this.Parent.RecalcInfo.Can_RecalcObject() всегда будет true, а вот при повторных уже нет
        if ( true === this.Parent.RecalcInfo.Can_RecalcObject() )
        {
            var Ranges = this.Parent.CheckRange( X, Y, XLimit, Y, Y, Y, X, XLimit, this.PageNum, true );
            if ( Ranges.length > 0 )
            {
                if ( Math.abs(Ranges[0].X0 - X ) < 0.001 )
                    this.X_ColumnStart = Ranges[0].X1;
                else
                    this.X_ColumnStart = X;

                if ( Math.abs(Ranges[Ranges.length - 1].X1 - XLimit ) < 0.001 )
                    this.X_ColumnEnd = Ranges[Ranges.length - 1].X0;
                else
                    this.X_ColumnEnd = XLimit;
            }
            else
            {
                this.X_ColumnStart = X;
                this.X_ColumnEnd   = XLimit;
            }
        }
    },

    // Копируем свойства параграфа
    CopyPr : function(OtherParagraph)
    {
        return this.CopyPr_Open(OtherParagraph);

        /*
        var bHistory = History.Is_On();
        History.TurnOff();

        OtherParagraph.X      = this.X;
        OtherParagraph.XLimit = this.XLimit;

        if ( "undefined" != typeof(OtherParagraph.NumPr) )
            OtherParagraph.Numbering_Remove();

        var NumPr = this.Numbering_Get();
        if ( null != NumPr  )
        {
            OtherParagraph.Numbering_Add( NumPr.NumId, NumPr.Lvl );
        }

        // Копируем прямые настройки параграфа в конце, потому что, например, нумерация может
        // их изменить.
        OtherParagraph.Pr = Common_CopyObj( this.Pr );
        OtherParagraph.Style_Add( this.Style_Get(), true );

        if ( true === bHistory )
            History.TurnOn();
            */
    },
    
    // Копируем свойства параграфа при открытии и копировании
    CopyPr_Open : function(OtherParagraph)
    {
        OtherParagraph.X      = this.X;
        OtherParagraph.XLimit = this.XLimit;

        if ( "undefined" != typeof(OtherParagraph.NumPr) )
            OtherParagraph.Numbering_Remove();

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr  )
        {
            OtherParagraph.Numbering_Set( NumPr.NumId, NumPr.Lvl );
        }

        var Bullet = this.Get_PresentationNumbering();
        if ( numbering_presentationnumfrmt_None != Bullet.Get_Type() )
            OtherParagraph.Add_PresentationNumbering( Bullet.Copy() );

        OtherParagraph.Set_PresentationLevel( this.PresentationPr.Level );

        // Копируем прямые настройки параграфа в конце, потому что, например, нумерация может
        // их изменить.
        var oOldPr = OtherParagraph.Pr;
        OtherParagraph.Pr = this.Pr.Copy();
        History.Add( OtherParagraph, { Type : historyitem_Paragraph_Pr, Old : oOldPr, New : OtherParagraph.Pr } );

        OtherParagraph.Style_Add( this.Style_Get(), true );
    },

    Split_Element_ByPos : function(SplitType, ContentPos)
    {
        // SplitType
        // 0 - только ран разбиваем

        var CurPos = ContentPos.Get(0);
        var Element = this.Content[CurPos];

        if ( 0 === SplitType )
        {
            var Result = Element.Split_Element_ByPos( SplitType, ContentPos, 1 );

            if ( para_Run === Element.Type )
            {
                this.Content[CurPos].Split_Element_ByPos( ContentPos, 1 );
            }
        }
        else
        {

        }
    },

    // Добавляем элемент в содержимое параграфа. (Здесь передвигаются все позиции
    // CurPos.ContentPos, Selection.StartPos, Selection.EndPos)
    Internal_Content_Add : function (Pos, Item, bCorrectPos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( true === Item.Is_RealContent() )
            {
                var ClearPos = this.Internal_Get_ClearPos( Pos );
                History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : ClearPos, EndPos : ClearPos, Items : [ Item ] } );
            }

            this.Content.splice( Pos, 0, Item );

            if ( this.CurPos.ContentPos >= Pos )
                this.Set_ContentPos( this.CurPos.ContentPos + 1, bCorrectPos );

            if ( this.Selection.StartPos >= Pos )
                this.Selection.StartPos++;

            if ( this.Selection.EndPos >= Pos )
                this.Selection.EndPos++;

            if ( this.Numbering.Pos >= Pos )
                this.Numbering.Pos++;

            // Также передвинем всем метки переносов страниц и строк
            var LinesCount = this.Lines.length;
            for ( var CurLine = 0; CurLine < LinesCount; CurLine++ )
            {
                if ( this.Lines[CurLine].StartPos > Pos )
                    this.Lines[CurLine].StartPos++;

                if ( this.Lines[CurLine].EndPos + 1 > Pos )
                    this.Lines[CurLine].EndPos++;

                var RangesCount = this.Lines[CurLine].Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    if ( this.Lines[CurLine].Ranges[CurRange].StartPos > Pos )
                        this.Lines[CurLine].Ranges[CurRange].StartPos++;
                }
            }

            // TODO: Как только мы избавимся от ParaNumbering в контенте параграфа, можно будет здесь такую обработку убрать
            //       и делать ее конкретно на Replace
            // Передвинем все метки поиска
            for ( var CurSearch in this.SearchResults )
            {
                if ( this.SearchResults[CurSearch].StartPos >= Pos )
                    this.SearchResults[CurSearch].StartPos++;

                if ( this.SearchResults[CurSearch].EndPos >= Pos )
                    this.SearchResults[CurSearch].EndPos++;
            }

            for ( var Id in this.NearPosArray )
            {
                var NearPos = this.NearPosArray[Id];
                if ( NearPos.ContentPos >= Pos )
                    NearPos.ContentPos++;
            }

            // Передвинем все метки слов для проверки орфографии
            this.SpellChecker.Update_OnAdd( this, Pos, Item );
        }
        else
        {
            History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
            this.Content.splice( Pos, 0, Item );

            if ( this.CurPos.ContentPos >= Pos )
                this.CurPos.ContentPos++;

            if ( this.Selection.StartPos >= Pos )
                this.Selection.StartPos++;

            if ( this.Selection.EndPos >= Pos )
                this.Selection.EndPos++;

            Item.Reset_Parent( this, this );
        }
    },

    Internal_Content_Add2 : function (Pos, Item, bCorrectPos)
    {
        if ( true === Item.Is_RealContent() )
        {
            var ClearPos = this.Internal_Get_ClearPos( Pos );
            History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : ClearPos, EndPos : ClearPos, Items : [ Item ] } );
        }

        this.Content.splice( Pos, 0, Item );

        // Передвинем все метки поиска
        for ( var CurSearch in this.SearchResults )
        {
            if ( this.SearchResults[CurSearch].StartPos >= Pos )
                this.SearchResults[CurSearch].StartPos++;

            if ( this.SearchResults[CurSearch].EndPos >= Pos )
                this.SearchResults[CurSearch].EndPos++;
        }

        for ( var Id in this.NearPosArray )
        {
            var NearPos = this.NearPosArray[Id];
            if ( NearPos.ContentPos >= Pos )
                NearPos.ContentPos++;
        }
    },

    // Добавляем несколько элементов в конец параграфа.
    Internal_Content_Concat : function(Items)
    {
        if ( true !== Debug_ParaRunMode )
        {
            // Добавляем только постоянные элементы параграфа
            var NewItems = new Array();
            var ItemsCount = Items.length;
            for ( var Index = 0; Index < ItemsCount; Index++ )
            {
                if ( true === Items[Index].Is_RealContent() )
                    NewItems.push( Items[Index] );
            }

            if ( NewItems.length <= 0 )
                return;

            var StartPos = this.Content.length;
            this.Content = this.Content.concat( NewItems );

            History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : this.Internal_Get_ClearPos( StartPos ), EndPos : this.Internal_Get_ClearPos( this.Content.length - 1 ), Items : NewItems } );

            this.RecalcInfo.Set_Type_0_Spell( pararecalc_0_Spell_All );
        }
        else
        {
            var StartPos = this.Content.length;
            this.Content = this.Content.concat( Items );

            History.Add( this, { Type : historyitem_Paragraph_AddItem, Pos : StartPos, EndPos : this.Content.length - 1, Items : Items } );

            // Нам нужно сбросить рассчет всех добавленных элементов и выставить у них родительский класс и параграф
            for ( var CurPos = StartPos; CurPos < this.Content.length; CurPos++ )
            {
                this.Content[CurPos].Reset_Parent( this, this );
                this.Content[CurPos].Reset_RecalcInfo();
            }

            // TODO: Разобраться с орфографией
        }
    },

    // Удаляем элемент из содержимого параграфа. (Здесь передвигаются все позиции
    // CurPos.ContentPos, Selection.StartPos, Selection.EndPos)
    Internal_Content_Remove : function (Pos, bCorrectPos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var Item = this.Content[Pos];
            if ( true === Item.Is_RealContent() )
            {
                var ClearPos = this.Internal_Get_ClearPos( Pos );
                History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : ClearPos, EndPos : ClearPos, Items : [ Item ] } );
            }

            if ( this.Selection.StartPos <= this.Selection.EndPos )
            {
                if ( this.Selection.StartPos > Pos )
                    this.Selection.StartPos--;

                if ( this.Selection.EndPos > Pos )
                    this.Selection.EndPos--;
            }
            else
            {
                if ( this.Selection.StartPos > Pos )
                    this.Selection.StartPos--;

                if ( this.Selection.EndPos > Pos )
                    this.Selection.EndPos--;
            }

            if ( this.Numbering.Pos > Pos )
                this.Numbering.Pos--;

            // Также передвинем всем метки переносов страниц и строк
            var LinesCount = this.Lines.length;
            for ( var CurLine = 0; CurLine < LinesCount; CurLine++ )
            {
                if ( this.Lines[CurLine].StartPos > Pos )
                    this.Lines[CurLine].StartPos--;

                if ( this.Lines[CurLine].EndPos >= Pos )
                    this.Lines[CurLine].EndPos--;

                var RangesCount = this.Lines[CurLine].Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    if ( this.Lines[CurLine].Ranges[CurRange].StartPos > Pos )
                        this.Lines[CurLine].Ranges[CurRange].StartPos--;
                }
            }

            // TODO: Как только мы избавимся от ParaNumbering в контенте параграфа, можно будет здесь такую обработку убрать
            //       и делать ее конкретно на Replace
            // Передвинем все метки поиска
            for ( var CurSearch in this.SearchResults )
            {
                if ( this.SearchResults[CurSearch].StartPos > Pos )
                    this.SearchResults[CurSearch].StartPos--;

                if ( this.SearchResults[CurSearch].EndPos > Pos )
                    this.SearchResults[CurSearch].EndPos--;
            }

            for ( var Id in this.NearPosArray )
            {
                var NearPos = this.NearPosArray[Id];
                if ( NearPos.ContentPos > Pos )
                    NearPos.ContentPos--;
            }

            this.Content.splice( Pos, 1 );

            if ( this.CurPos.ContentPos > Pos )
                this.Set_ContentPos( this.CurPos.ContentPos - 1, bCorrectPos );

            // Комментарий удаляем после, чтобы не нарушить позиции
            if ( true === this.DeleteCommentOnRemove && ( para_CommentStart === Item.Type || para_CommentEnd === Item.Type ) )
            {
                // Удаляем комментарий, если у него было удалено начало или конец

                if ( para_CommentStart === Item.Type )
                    editor.WordControl.m_oLogicDocument.Comments.Set_StartInfo( Item.Id, 0, 0, 0, 0, null );
                else
                    editor.WordControl.m_oLogicDocument.Comments.Set_EndInfo( Item.Id, 0, 0, 0, 0, null );

                editor.WordControl.m_oLogicDocument.Remove_Comment( Item.Id, true );
            }

            // Передвинем все метки слов для проверки орфографии
            this.SpellChecker.Update_OnRemove( this, Pos, 1 );
        }
        else
        {
            var Item = this.Content[Pos];
            History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
            this.Content.splice( Pos, 1 );

            if ( this.Selection.StartPos > Pos )
                this.Selection.StartPos--;

            if ( this.Selection.EndPos > Pos )
                this.Selection.EndPos--;

            if ( this.CurPos.ContentPos > Pos )
                this.CurPos.ContentPos--;
        }
    },

    // Удаляем несколько элементов
    Internal_Content_Remove2 : function(Pos, Count)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
            var CommentsToDelete = new Object();
            for ( var Index = Pos; Index < Pos + Count; Index++ )
            {
                var ItemType = this.Content[Index].Type;
                if ( true === this.DeleteCommentOnRemove && (para_CommentStart === ItemType || para_CommentEnd === ItemType) )
                {
                    if ( para_CommentStart === ItemType )
                        DocumentComments.Set_StartInfo( this.Content[Index].Id, 0, 0, 0, 0, null );
                    else
                        DocumentComments.Set_EndInfo( this.Content[Index].Id, 0, 0, 0, 0, null );

                    CommentsToDelete[this.Content[Index].Id] = 1;
                }
            }

            var LastArray = this.Content.slice( Pos, Pos + Count );

            // Добавляем только постоянные элементы параграфа
            var LastItems = new Array();
            var ItemsCount = LastArray.length;
            for ( var Index = 0; Index < ItemsCount; Index++ )
            {
                if ( true === LastArray[Index].Is_RealContent() )
                    LastItems.push( LastArray[Index] );
            }

            History.Add( this, { Type : historyitem_Paragraph_RemoveItem, Pos : this.Internal_Get_ClearPos( Pos ), EndPos : this.Internal_Get_ClearPos(Pos + Count - 1), Items : LastItems } );

            if ( this.CurPos.ContentPos > Pos )
            {
                if ( this.CurPos.ContentPos > Pos + Count )
                    this.Set_ContentPos( this.CurPos.ContentPos - Count, true, -1 );
                else
                    this.Set_ContentPos( Pos, true, -1 );
            }

            if ( this.Selection.StartPos <= this.Selection.EndPos )
            {
                if ( this.Selection.StartPos > Pos )
                {
                    if ( this.Selection.StartPos > Pos + Count )
                        this.Selection.StartPos -= Count;
                    else
                        this.Selection.StartPos = Pos;
                }

                if ( this.Selection.EndPos > Pos )
                {
                    if ( this.Selection.EndPos >= Pos + Count )
                        this.Selection.EndPos -= Count;
                    else
                        this.Selection.EndPos = Math.max( 0, Pos - 1 );
                }
            }
            else
            {
                if ( this.Selection.StartPos > Pos )
                {
                    if ( this.Selection.StartPos >= Pos + Count )
                        this.Selection.StartPos -= Count;
                    else
                        this.Selection.StartPos = Math.max( 0, Pos - 1 );
                }

                if ( this.Selection.EndPos > Pos )
                {
                    if ( this.Selection.EndPos > Pos + Count )
                        this.Selection.EndPos -= Count;
                    else
                        this.Selection.EndPos = Pos;
                }
            }

            // Также передвинем всем метки переносов страниц и строк
            var LinesCount = this.Lines.length;
            for ( var CurLine = 0; CurLine < LinesCount; CurLine++ )
            {
                if ( this.Lines[CurLine].StartPos > Pos )
                {
                    if ( this.Lines[CurLine].StartPos > Pos + Count )
                        this.Lines[CurLine].StartPos -= Count;
                    else
                        this.Lines[CurLine].StartPos = Math.max( 0 , Pos );
                }

                if ( this.Lines[CurLine].EndPos >= Pos )
                {
                    if ( this.Lines[CurLine].EndPos >= Pos + Count )
                        this.Lines[CurLine].EndPos -= Count;
                    else
                        this.Lines[CurLine].EndPos = Math.max( 0 , Pos );
                }

                var RangesCount = this.Lines[CurLine].Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    if ( this.Lines[CurLine].Ranges[CurRange].StartPos > Pos )
                    {
                        if ( this.Lines[CurLine].Ranges[CurRange].StartPos > Pos + Count )
                            this.Lines[CurLine].Ranges[CurRange].StartPos -= Count;
                        else
                            this.Lines[CurLine].Ranges[CurRange].StartPos = Math.max( 0 , Pos );
                    }
                }
            }

            for ( var Id in this.NearPosArray )
            {
                var NearPos = this.NearPosArray[Id];

                if ( NearPos.ContentPos > Pos + Count )
                    NearPos.ContentPos -= Count;
                else if ( NearPos.ContentPos > Pos )
                    NearPos.ContentPos = Math.max( 0 , Pos );
            }

            this.Content.splice( Pos, Count );

            // Комментарии удаляем после, чтобы не нарушить позиции
            for ( var Id in CommentsToDelete )
            {
                editor.WordControl.m_oLogicDocument.Remove_Comment( Id, true );
            }

            // Передвинем все метки слов для проверки орфографии
            this.SpellChecker.Update_OnRemove( this, Pos, Count );
        }
        else
        {
            // TODO: Реализовать по нормальному данную функцию

            for ( var Temp = 0; Temp < Count; Temp++ )
            {
                this.Internal_Content_Remove( Pos, true );
            }
        }
    },

    Internal_Check_EmptyHyperlink : function(Pos)
    {
        var Start = this.Internal_FindBackward( Pos, [ para_Text, para_Drawing, para_Space,  para_Tab, para_PageNum, para_Math, para_HyperlinkStart ] );
        var End   = this.Internal_FindForward ( Pos, [ para_Text, para_Drawing, para_Space,  para_Tab, para_PageNum, para_Math, para_HyperlinkEnd, para_End ] );

        if ( true === Start.Found && para_HyperlinkStart === Start.Type && true === End.Found && para_HyperlinkEnd === End.Type )
        {
            this.Internal_Content_Remove( End.LetterPos );
            this.Internal_Content_Remove( Start.LetterPos );
        }
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

    Get_CurrentParaPos : function()
    {
        // Сначала определим строку и отрезок
        var ParaPos = this.Content[this.CurPos.ContentPos].Get_CurrentParaPos();

        if ( -1 !== this.CurPos.Line )
        {
            ParaPos.Line  = this.CurPos.Line;
            ParaPos.Range = this.CurPos.Range;
        }

        var CurLine = ParaPos.Line;

        // Определим страницу
        var PagesCount = this.Pages.length;
        for ( var CurPage = PagesCount - 1; CurPage >= 0; CurPage-- )
        {
            var Page = this.Pages[CurPage];
            if ( CurLine >= Page.StartLine && CurLine <= Page.EndLine )
            {
                ParaPos.Page = CurPage;
                return ParaPos;
            }
        }

        return ParaPos;
    },

    Get_ParaPosByContentPos : function(ContentPos)
    {
        // Сначала определим строку и отрезок
        var ParaPos = this.Content[ContentPos.Get(0)].Get_ParaPosByContentPos(ContentPos, 1);
        var CurLine = ParaPos.Line;

        // Определим страницу
        var PagesCount = this.Pages.length;
        for ( var CurPage = PagesCount - 1; CurPage >= 0; CurPage-- )
        {
            var Page = this.Pages[CurPage];
            if ( CurLine >= Page.StartLine && CurLine <= Page.EndLine )
            {
                ParaPos.Page = CurPage;
                return ParaPos;
            }
        }

        return ParaPos;
    },

    Internal_Get_ParaPos_By_Pos : function(ContentPos)
    {
        var _ContentPos = Math.max( 0, Math.min( ContentPos, this.Content.length - 1 ) );

        while ( undefined === this.Content[_ContentPos].CurPage )
        {
            _ContentPos--;

            if ( _ContentPos < 0 )
                return new CParaPos( 0, 0, 0, 0 );
        }

        if ( _ContentPos === this.CurPos.ContentPos && -1 != this.CurPos.Line )
            return new CParaPos( this.Content[_ContentPos].CurRange, this.CurPos.Line, this.Content[_ContentPos].CurPage, ContentPos );

        return new CParaPos( this.Content[_ContentPos].CurRange, this.Content[_ContentPos].CurLine, this.Content[_ContentPos].CurPage, ContentPos );
    },

    Internal_Get_ParaPos_By_Page : function(Page)
    {
        var CurPage  = Page;
        var CurLine  = this.Pages[CurPage].StartLine;
        var CurRange = 0;
        var CurPos   = this.Lines[CurLine].StartPos;

        return new CParaPos( CurRange, CurLine, CurPage, CurPos );
    },

    Internal_Update_ParaPos : function(CurPage, CurLine, CurRange, CurPos)
    {
        var _CurPage  = CurPage;
        var _CurLine  = CurLine;
        var _CurRange = CurRange;

        // Проверяем переход на новую страницу
        while ( _CurPage < this.Pages.length - 1 )
        {
            if ( this.Lines[this.Pages[_CurPage + 1].StartLine].StartPos <= CurPos )
            {
                _CurPage++;
                _CurLine  = this.Pages[_CurPage].StartLine;
                _CurRange = 0;
            }
            else
                break;
        }

        while ( _CurLine < this.Lines.length - 1 )
        {
            if ( this.Lines[_CurLine + 1].StartPos <= CurPos )
            {
                _CurLine++;
                _CurRange = 0;
            }
            else
                break;
        }

        while ( _CurRange < this.Lines[_CurLine].Ranges.length - 1 )
        {
            if ( this.Lines[_CurLine].Ranges[_CurRange + 1].StartPos <= CurPos )
            {
                _CurRange++;
            }
            else
                break;
        }

        return new CParaPos( _CurRange, _CurLine, _CurPage, CurPos );
    },

    // Рассчитываем текст
    Internal_Recalculate_0 : function()
    {
        if ( pararecalc_0_None === this.RecalcInfo.Recalc_0_Type )
            return;

        var Pr        = this.Get_CompiledPr();
        var ParaPr    = Pr.ParaPr;
        var CurTextPr = Pr.TextPr;

        // Предполагается, что при вызове данной функции Content не содержит
        // рассчитанных переносов строк.

        g_oTextMeasurer.SetTextPr( CurTextPr );

        // Под Descent мы будем понимать descent + linegap (которые записаны в шрифте)
        var TextAscent  = 0;
        var TextHeight  = 0;
        var TextDescent = 0;

        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );
        TextHeight  = g_oTextMeasurer.GetHeight();
        TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
        TextAscent  = TextHeight - TextDescent;
        TextAscent2 = g_oTextMeasurer.GetAscender();

        var ContentLength = this.Content.length;

        if ( para_PresentationNumbering === this.Numbering.Type )
        {
            var Item = this.Numbering;
            var Level  = this.PresentationPr.Level;
            var Bullet = this.PresentationPr.Bullet;

            var BulletNum = 0;
            if ( Bullet.Get_Type() >= numbering_presentationnumfrmt_ArabicPeriod )
            {
                var Prev = this.Prev;
                while ( null != Prev && type_Paragraph === Prev.GetType() )
                {
                    var PrevLevel  = Prev.PresentationPr.Level;
                    var PrevBullet = Prev.Get_PresentationNumbering();

                    // Если предыдущий параграф более низкого уровня, тогда его не учитываем
                    if ( Level < PrevLevel )
                    {
                        Prev = Prev.Prev;
                        continue;
                    }
                    else if ( Level > PrevLevel )
                        break;
                    else if ( PrevBullet.Get_Type() === Bullet.Get_Type() && PrevBullet.Get_StartAt() === PrevBullet.Get_StartAt() )
                    {
                        if ( true != Prev.IsEmpty() )
                            BulletNum++;

                        Prev = Prev.Prev;
                    }
                    else
                        break;
                }
            }

            // Найдем настройки для первого текстового элемента
            var FirstTextPr = this.Internal_CalculateTextPr( this.Internal_GetStartPos() );

            Item.Bullet    = Bullet;
            Item.BulletNum = BulletNum + 1;
            Item.Measure( g_oTextMeasurer, FirstTextPr );
        }

        var PrevMathPos = -1;
        for ( var Pos = 0; Pos < ContentLength; Pos++ )
        {
            var Item = this.Content[Pos];

            switch( Item.Type )
            {
                case para_Text:
                case para_Space:
                case para_PageNum:
                {
                    PrevMathPos = -1;

                    Item.Measure( g_oTextMeasurer, CurTextPr);
                    break;
                }
                case para_Math:
                {
                    if ( -1 != PrevMathPos )
                    {
                        // TODO: нужно реализовать объединение формул
                    }

                    Item.Measure( g_oTextMeasurer, CurTextPr);
                    PrevMathPos = Pos;

                    // Проверим, является ли данная формула внутристроковой или нет
                    var Prev = this.Internal_FindBackward( Pos - 1, [para_Text, para_Space] );

                    break;
                }
                case para_Drawing:
                {
                    PrevMathPos = -1;

                    Item.Parent          = this;
                    Item.DocumentContent = this.Parent;
                    Item.DrawingDocument = this.Parent.DrawingDocument;

                    Item.Measure( g_oTextMeasurer, CurTextPr);
                    break;
                }
                case para_Tab:
                case para_NewLine:
                {
                    PrevMathPos = -1;
                    Item.Measure( g_oTextMeasurer);

                    break;
                }
                case para_TextPr:
                {
                    Item.Parent = this;

                    CurTextPr = this.Internal_CalculateTextPr( Pos );
                    Item.CalcValue = CurTextPr; // копировать не надо, т.к. CurTextPr здесь дальше не меняется, а в функции он создается изначально
                    g_oTextMeasurer.SetTextPr( CurTextPr );
                    g_oTextMeasurer.SetFontSlot( fontslot_ASCII );
                    TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
                    TextHeight  = g_oTextMeasurer.GetHeight();
                    TextAscent  = TextHeight - TextDescent;
                    TextAscent2 = g_oTextMeasurer.GetAscender();

                    break;
                }
                case para_End:
                {
                    var bEndCell = false;
                    if ( null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent() )
                        bEndCell = true;

                    var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge( this.TextPr.Value );
                    Item.TextPr = EndTextPr;
                    g_oTextMeasurer.SetTextPr( EndTextPr );
                    Item.Measure( g_oTextMeasurer, bEndCell );

                    TextDescent = Math.abs( g_oTextMeasurer.GetDescender() );
                    TextHeight  = g_oTextMeasurer.GetHeight();
                    TextAscent  = TextHeight - TextDescent;
                    TextAscent2 = g_oTextMeasurer.GetAscender();

                    g_oTextMeasurer.SetTextPr( CurTextPr );

                    break;
                }
            }

            Item.TextAscent  = TextAscent;
            Item.TextDescent = TextDescent;
            Item.TextHeight  = TextHeight;
            Item.TextAscent2 = TextAscent2;
            Item.YOffset     = CurTextPr.Position;
        }

        this.RecalcInfo.Set_Type_0( pararecalc_0_None );
    },

    // Пересчет переносов строк в параграфе, с учетом возможного обтекания
    Internal_Recalculate_1_ : function(StartPos, CurPage, _CurLine)
    {
        var Pr     = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;

        var CurLine = _CurLine;

        // Смещаемся в начало параграфа на первой странице или в начало страницы, если страница не первая
        var X, Y, XLimit, YLimit, _X, _XLimit;
        if ( 0 === CurPage || ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument ) )
        {
            X       = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            Y       = this.Y;
            XLimit  = this.XLimit - ParaPr.Ind.Right;
            YLimit  = this.YLimit;
            _X      = this.X;
            _XLimit = this.XLimit;
        }
        else
        {
            // Запрашиваем у документа начальные координаты на новой странице
            var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

            X       = ( 0 != CurLine ? PageStart.X + ParaPr.Ind.Left :  PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine );
            Y       = PageStart.Y;
            XLimit  = PageStart.XLimit - ParaPr.Ind.Right;
            YLimit  = PageStart.YLimit;
            _X      = PageStart.X;
            _XLimit = PageStart.XLimit;
        }

        // Предполагается, что при вызове данной функции Content не содержит
        // рассчитанных переносов строк в промежутке StartPos и EndPos.
        this.Pages.length = CurPage + 1;
        this.Pages[CurPage] = new CParaPage( _X, Y, _XLimit, YLimit, CurLine );
        this.Pages[CurPage].TextPr = this.Internal_CalculateTextPr( StartPos, Pr );

        var LineStart_Pos = StartPos;

        if ( 0 === CurPage )
        {
            // Пересчитываем правую и левую границы параграфа
            if ( ParaPr.Ind.FirstLine <= 0 )
                this.Bounds.Left = X;
            else
                this.Bounds.Left = this.X + ParaPr.Ind.Left;

            this.Bounds.Right = XLimit;
        }

        var bFirstItemOnLine  = true;  // контролируем первое появление текста на строке
        var bEmptyLine        = true;  // Есть ли в строке текст, картинки или др. видимые объекты
        var bStartWord        = false; // началось ли слово в строке
        var bWord             = false;
        var nWordStartPos     = 0;
        var nWordLen          = 0;
        var nSpaceLen         = 0;
        var nSpacesCount      = 0;
        var pLastTab =
        {
            TabPos : 0,
            X      : 0,
            Value  : -1,
            Item   : null
        };

        var bNewLine             = false;
        var bNewRange            = false;
        var bNewPage             = false;
        var bExtendBoundToBottom = false;
        var bEnd                 = false;
        var bForceNewPage        = false;
        var bBreakPageLine       = false;

        if ( CurPage > 1 )
            bAddNumbering = false;
        else if ( 0 === CurPage )
            bAddNumbering = true;
        else
        {
            // Проверим, есть ли какие-нибудь реальные элементы (к которым можно было бы
            // дорисовать нумерацию) до стартовой позиции текущей страницы

            for ( var Pos = 0; Pos < StartPos; Pos++ )
            {
                var Item = this.Content[Pos];
                if ( true === Item.Can_AddNumbering() )
                    bAddNumbering = false;
            }
        }

        // Получаем промежутки обтекания, т.е. промежутки, которые нам нельзя использовать
        var Ranges = [];//this.Parent.CheckRange( X, Y, XLimit, Y, Y, Y, this.PageNum + CurPage, true );
        var RangesCount = Ranges.length;

        // Под Descent мы будем понимать descent + linegap (которые записаны в шрифте)
        var TextAscent  = 0;
        var TextDescent = 0;
        var TextAscent2 = 0;

        this.Lines.length = CurLine + 1;
        this.Lines[CurLine] = new CParaLine(StartPos);

        var LineTextAscent  = 0;
        var LineTextDescent = 0;
        var LineTextAscent2 = 0;
        var LineAscent      = 0;
        var LineDescent     = 0;

        // Выставляем начальные сдвиги для промежутков. Начало промежутка = конец вырезаемого промежутка
        this.Lines[CurLine].Add_Range( X, (RangesCount == 0 ? XLimit : Ranges[0].X0) );
        this.Lines[CurLine].Set_RangeStartPos( 0, StartPos );
        for ( var Index = 1; Index < Ranges.length + 1; Index++ )
        {
            this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (Index == RangesCount ? XLimit : Ranges[Index].X0) );
        }

        var CurRange = 0;
        var XEnd = 0;

        if ( RangesCount == 0 )
            XEnd = XLimit;
        else
            XEnd = Ranges[0].X0;

        if ( this.Parent instanceof CDocument )
        {
            // Начинаем параграф с новой страницы
            if ( 0 === CurPage && true === ParaPr.PageBreakBefore )
            {
                // Если это первый элемент документа, тогда не надо начинать его с новой страницы
                var Prev = this.Get_DocumentPrev();
                if ( null != Prev )
                {
                    // Добавляем разрыв страницы
                    this.Pages[CurPage].Set_EndLine( CurLine - 1 );

                    if (  0 === CurLine )
                    {
                        this.Lines[-1] = new CParaLine(0);
                        this.Lines[-1].Set_EndPos( StartPos - 1, this );
                    }

                    return recalcresult_NextPage;
                }
            }
            else if  ( true === this.Parent.RecalcInfo.Check_WidowControl( this, CurLine ) )
            {
                this.Parent.RecalcInfo.Reset_WidowControl();

                this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine( 0 );
                    this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                }

                return recalcresult_NextPage;
            }
            else if ( true === this.Parent.RecalcInfo.Check_KeepNext(this) && 0 === CurPage && null != this.Get_DocumentPrev() )
            {
                this.Parent.RecalcInfo.Reset();

                this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine( 0 );
                    this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                }

                return recalcresult_NextPage;
            }
        }

        var RecalcResult = recalcresult_NextElement;

        var bAddNumbering = this.Internal_CheckAddNumbering( CurPage, CurLine, CurRange );
        for ( var Pos = LineStart_Pos; Pos < this.Content.length; Pos++ )
        {
            if ( false === bStartWord && true === bFirstItemOnLine && Math.abs(XEnd - X) < 0.001 && RangesCount > 0 )
            {
                if ( RangesCount == CurRange )
                {
                    Pos--;
                    bNewLine = true;
                }
                else
                {
                    Pos--;
                    bNewRange = true;
                }
            }

            if ( true != bNewLine && true != bNewRange )
            {
                var Item = this.Content[Pos];

                Item.Parent = this;
                Item.DocumentContent = this.Parent;
                Item.DrawingDocument = this.Parent.DrawingDocument;

                if ( undefined != Item.TextAscent )
                    TextAscent  = Item.TextAscent;

                if ( undefined != Item.TextAscent2 )
                    TextAscent2 = Item.TextAscent2;

                if ( undefined != Item.TextDescent )
                    TextDescent = Item.TextDescent;

                // Сохраним в элементе номер строки и отрезка
                Item.CurPage  = CurPage;
                Item.CurLine  = CurLine;
                Item.CurRange = CurRange;

                var bBreak = false;

                if ( true === bAddNumbering )
                {
                    // Проверим, возможно на текущем элементе стоит добавить нумерацию
                    if ( true === Item.Can_AddNumbering() )
                    {
                        var NumberingItem = this.Numbering;
                        var NumberingType = this.Numbering.Type;
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
                                var Numbering = this.Parent.Get_Numbering();
                                var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                                var NumSuff   = NumLvl.Suff;
                                var NumJc     = NumLvl.Jc;
                                var NumInfo   = this.Parent.Internal_GetNumInfo( this.Id, NumPr );
                                var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                                NumTextPr.Merge( this.TextPr.Value );
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
                                        X                         += NumberingItem.WidthNum / 2;
                                        break;
                                    }
                                    case align_Left:
                                    default:
                                    {
                                        NumberingItem.WidthVisible = NumberingItem.WidthNum;
                                        X                         += NumberingItem.WidthNum;
                                        break;
                                    }
                                }

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
                                        var NewX = null;
                                        var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

                                        // Если у данного параграфа есть табы, тогда ищем среди них
                                        var TabsCount = ParaPr.Tabs.Get_Count();

                                        // Добавим в качестве таба левую границу
                                        var TabsPos = new Array();
                                        var bCheckLeft = true;
                                        for ( var Index = 0; Index < TabsCount; Index++ )
                                        {
                                            var Tab = ParaPr.Tabs.Get(Index);
                                            var TabPos = Tab.Pos + PageStart.X;

                                            if ( true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left )
                                            {
                                                TabsPos.push( PageStart.X + ParaPr.Ind.Left );
                                                bCheckLeft = false;
                                            }

                                            if ( tab_Clear !=  Tab.Value )
                                                TabsPos.push( TabPos );
                                        }

                                        if ( true === bCheckLeft )
                                            TabsPos.push( PageStart.X + ParaPr.Ind.Left );

                                        TabsCount++;

                                        for ( var Index = 0; Index < TabsCount; Index++ )
                                        {
                                            var TabPos = TabsPos[Index];

                                            if ( X < TabPos )
                                            {
                                                NewX = TabPos;
                                                break;
                                            }
                                        }

                                        // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
                                        if ( null === NewX )
                                        {
                                            if ( X < PageStart.X + ParaPr.Ind.Left )
                                                NewX = PageStart.X + ParaPr.Ind.Left;
                                            else
                                            {
                                                NewX = this.X;
                                                while ( X >= NewX )
                                                    NewX += Default_Tab_Stop;
                                            }
                                        }

                                        NumberingItem.WidthSuff = NewX - X;

                                        break;
                                    }
                                }

                                NumberingItem.Width         = NumberingItem.WidthNum;
                                NumberingItem.WidthVisible += NumberingItem.WidthSuff;

                                X += NumberingItem.WidthSuff;
                                this.Numbering.Pos = Pos;
                            }
                        }
                        else if ( para_PresentationNumbering === NumberingType )
                        {
                            var Bullet = this.PresentationPr.Bullet;
                            if ( numbering_presentationnumfrmt_None != Bullet.Get_Type() )
                            {
                                if ( ParaPr.Ind.FirstLine < 0 )
                                    NumberingItem.WidthVisible = Math.max( NumberingItem.Width, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X );
                                else
                                    NumberingItem.WidthVisible = Math.max( this.X + ParaPr.Ind.Left + NumberingItem.Width - X, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X );
                            }

                            X += NumberingItem.WidthVisible;
                            this.Numbering.Pos = Pos;
                        }

                        bAddNumbering = false;
                    }
                }

                switch( Item.Type )
                {
                    case para_Math:
                    case para_Text:
                    {
                        bStartWord = true;

                        // При проверке, убирается ли слово, мы должны учитывать ширину
                        // предшевствующих пробелов.

                        if ( para_Text === Item.Type )
                        {
                            if ( LineTextAscent < TextAscent )
                                LineTextAscent = TextAscent;

                            if ( LineTextAscent2 < TextAscent2 )
                                LineTextAscent2 = TextAscent2;

                            if ( LineTextDescent < TextDescent )
                                LineTextDescent = TextDescent;

                            if ( linerule_Exact === ParaPr.Spacing.LineRule )
                            {
                                // Смещение не учитывается в метриках строки, когда расстояние между строк точное
                                if ( LineAscent < TextAscent )
                                    LineAscent = TextAscent;

                                if ( LineDescent < TextDescent )
                                    LineDescent = TextDescent;
                            }
                            else
                            {
                                if ( LineAscent < TextAscent + Item.YOffset  )
                                    LineAscent = TextAscent + Item.YOffset;

                                if ( LineDescent < TextDescent - Item.YOffset )
                                    LineDescent = TextDescent - Item.YOffset;
                            }
                        }
                        else //if ( para_Math === Item.Type )
                        {
                            var MathAscent  = Item.Ascent;
                            var MathDescent = Item.Descent;

                            if ( linerule_Exact === ParaPr.Spacing.LineRule )
                            {
                                // Смещение не учитывается в метриках строки, когда расстояние между строк точное
                                if ( LineAscent < MathAscent )
                                    LineAscent = MathAscent;

                                if ( LineDescent < MathDescent )
                                    LineDescent = MathDescent;
                            }
                            else
                            {
                                if ( LineAscent < MathAscent + Item.YOffset  )
                                    LineAscent = MathAscent + Item.YOffset;

                                if ( LineDescent < MathDescent - Item.YOffset )
                                    LineDescent = MathDescent - Item.YOffset;
                            }
                        }

                        if ( !bWord )
                        {
                            // Слово только началось. Делаем следующее:
                            // 1) Если до него на строке ничего не было и данная строка не
                            //    имеет разрывов, тогда не надо проверять убирается ли слово в строке.
                            // 2) В противном случае, проверяем убирается ли слово в промежутке.

                            // Если слово только началось, и до него на строке ничего не было, и в строке нет разрывов, тогда не надо проверять убирается ли оно на строке.
                            var LetterLen = Item.Width;
                            if ( !bFirstItemOnLine || false === this.Internal_Check_Ranges(CurLine, CurRange) )
                            {
                                if ( X + nSpaceLen + LetterLen > XEnd )
                                {
                                    if ( RangesCount == CurRange )
                                    {
                                        bNewLine = true;
                                        Pos--;
                                    }
                                    else
                                    {
                                        bNewRange = true;
                                        Pos--;
                                    }
                                }
                            }

                            if ( !bNewLine && !bNewRange )
                            {
                                nWordStartPos = Pos;
                                nWordLen = Item.Width;
                                bWord = true;

                                //this.Lines[CurLine].Words++;

                                //if ( !bNewRange )
                                //    this.Lines[CurLine].Ranges[CurRange].Words++;
                            }
                        }
                        else
                        {
                            var LetterLen = Item.Width;
                            if ( X + nSpaceLen + nWordLen + LetterLen > XEnd )
                            {
                                if ( bFirstItemOnLine )
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

                                    if ( false === this.Internal_Check_Ranges(CurLine, CurRange)  )
                                    {
                                        Pos = nWordStartPos - 1;

                                        if ( RangesCount != CurRange )
                                            bNewRange = true;
                                        else
                                            bNewLine = true;
                                    }
                                    else
                                    {
                                        bEmptyLine  = false;

                                        X += nWordLen;

                                        Pos--;

                                        if ( RangesCount != CurRange )
                                            bNewRange = true;
                                        else
                                            bNewLine = true;
                                    }
                                }
                                else
                                {
                                    // Слово не убирается в промежутке. Делаем следующее:
                                    // 1) Если у нас строка без вырезов или текущей вырез последний,
                                    //    тогда ставим перенос строки в начале слова.
                                    // 2) Если строка с вырезами и вырез не последний, ставим
                                    //    перенос внутри строки в начале слова.

                                    Pos = nWordStartPos;

                                    if ( RangesCount == CurRange )
                                    {
                                        Pos--;

                                        bNewLine = true;
                                        //this.Lines[CurLine].Words--;
                                        //this.Lines[CurLine].Ranges[CurRange].Words--;
                                    }
                                    else // if ( 0 != RangesCount && RangesCount != CurRange )
                                    {
                                        Pos--;

                                        bNewRange = true;
                                        //this.Lines[CurLine].Ranges[CurRange].Words--;
                                    }
                                }
                            }

                            if ( !bNewLine && !bNewRange )
                            {
                                nWordLen += LetterLen;

                                // Если текущий символ, например, дефис, тогда на нем заканчивается слово
                                if ( true === Item.SpaceAfter )
                                {
                                    // Добавляем длину пробелов до слова
                                    X += nSpaceLen;

                                    // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                                    X += nWordLen;

                                    // Пробелы перед первым словом в строке не считаем
                                    //if ( this.Lines[CurLine].Words > 1 )
                                    //    this.Lines[CurLine].Spaces += nSpacesCount;

                                    //if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                                    //    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                                    bWord            = false;
                                    bFirstItemOnLine = false;
                                    bEmptyLine       = false;
                                    nSpaceLen        = 0;
                                    nWordLen         = 0;
                                    nSpacesCount     = 0;
                                }
                            }
                        }

                        break;
                    }
                    case para_Space:
                    {
                        bFirstItemOnLine = false;

                        var SpaceLen = Item.Width;
                        if ( bWord )
                        {
                            // Добавляем длину пробелов до слова
                            X += nSpaceLen;

                            // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                            X += nWordLen;

                            // Пробелы перед первым словом в строке не считаем
                            //if ( this.Lines[CurLine].Words > 1 )
                            //    this.Lines[CurLine].Spaces += nSpacesCount;

                            //if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            //    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                            bWord        = false;
                            bEmptyLine   = false;
                            nSpaceLen    = 0;
                            nWordLen     = 0;
                            nSpacesCount = 1;
                        }
                        else
                            nSpacesCount++;

                        // На пробеле не делаем перенос. Перенос строки или внутристрочный
                        // перенос делаем при добавлении любого непробельного символа
                        nSpaceLen += SpaceLen;

                        break;
                    }
                    case para_Drawing:
                    {
                        if ( true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape() )
                        {
                            if ( true != Item.Is_Inline() )
                                Item.Set_DrawingType( drawing_Inline );

                            if ( true === bStartWord )
                                bFirstItemOnLine = false;

                            // Если до этого было слово, тогда не надо проверять убирается ли оно, но если стояли пробелы,
                            // тогда мы их учитываем при проверке убирается ли данный элемент, и добавляем только если
                            // данный элемент убирается
                            if ( bWord || nWordLen > 0 )
                            {
                                // Добавляем длину пробелов до слова
                                X += nSpaceLen;

                                // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                                X += nWordLen;

                                // Пробелы перед первым словом в строке не считаем
                                //if ( this.Lines[CurLine].Words > 1 )
                                //    this.Lines[CurLine].Spaces += nSpacesCount;

                                //if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                                //    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                                bWord        = false;
                                nSpaceLen    = 0;
                                nSpacesCount = 0;
                                nWordLen     = 0;
                            }

                            if ( X + nSpaceLen + Item.Width > XEnd && ( false === bFirstItemOnLine || false === this.Internal_Check_Ranges( CurLine, CurRange ) ) )
                            {
                                if ( RangesCount == CurRange )
                                {
                                    bNewLine = true;
                                    Pos--;
                                }
                                else
                                {
                                    bNewRange = true;
                                    Pos--;
                                }
                            }
                            else
                            {
                                // Добавляем длину пробелов до слова
                                X += nSpaceLen;

                                if ( linerule_Exact === ParaPr.Spacing.LineRule )
                                {
                                    if ( LineAscent < Item.Height )
                                        LineAscent = Item.Height;

                                    if ( Item.Height > this.Lines[CurLine].Metrics.Ascent )
                                        this.Lines[CurLine].Metrics.Ascent = Item.Height;
                                }
                                else
                                {
                                    if ( LineAscent < Item.Height + Item.YOffset )
                                        LineAscent = Item.Height + Item.YOffset;

                                    if ( Item.Height + Item.YOffset > this.Lines[CurLine].Metrics.Ascent )
                                        this.Lines[CurLine].Metrics.Ascent = Item.Height + Item.YOffset;

                                    if ( -Item.YOffset > this.Lines[CurLine].Metrics.Descent )
                                        this.Lines[CurLine].Metrics.Descent = -Item.YOffset;
                                }

                                X += Item.Width;

                                bFirstItemOnLine = false;
                                bEmptyLine       = false;

                                //this.Lines[CurLine].Words++;
                                //this.Lines[CurLine].Ranges[CurRange].Words++;

                                // Пробелы перед первым словом в строке не считаем
                                //if ( this.Lines[CurLine].Words > 1 )
                                //    this.Lines[CurLine].Spaces += nSpacesCount;

                                //if ( this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                                //   this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                            }

                            nSpaceLen    = 0;
                            nSpacesCount = 0;
                        }
                        else
                        {
                            // Основная обработка происходит в Internal_Recalculate_2. Здесь обрабатывается единственный случай,
                            // когда после второго пересчета с уже добавленной картинкой оказывается, что место в параграфе, где
                            // идет картинка ушло на следующую страницу. В этом случае мы ставим перенос страницы перед картинкой.

                            var LogicDocument  = this.Parent;
                            var LDRecalcInfo   = LogicDocument.RecalcInfo;
                            var DrawingObjects = LogicDocument.DrawingObjects;

                            if ( true === LDRecalcInfo.Check_FlowObject(Item) && true === LDRecalcInfo.Is_PageBreakBefore() )
                            {
                                LDRecalcInfo.Reset();

                                // Добавляем разрыв страницы. Если это первая страница, тогда ставим разрыв страницы в начале параграфа,
                                // если нет, тогда в начале текущей строки.

                                if ( null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage )
                                {
                                    // Мы должны из соответствующих FlowObjects удалить все Flow-объекты, идущие до этого места в параграфе
                                    for ( var TempPos = StartPos; TempPos < Pos; TempPos++ )
                                    {
                                        var TempItem = this.Content[TempPos];
                                        if ( para_Drawing === TempItem.Type && drawing_Anchor === TempItem.DrawingType && true === TempItem.Use_TextWrap() )
                                        {
                                            DrawingObjects.removeById( TempItem.PageNum, TempItem.Get_Id() );
                                        }
                                    }

                                    this.Pages[CurPage].Set_EndLine( -1 );
                                    if ( 0 === CurLine )
                                    {
                                        this.Lines[-1] = new CParaLine(0);
                                        this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                                    }

                                    RecalcResult = recalcresult_NextPage;
                                    return;
                                }
                                else
                                {
                                    if ( CurLine != this.Pages[CurPage].FirstLine )
                                    {
                                        this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                                        if ( 0 === CurLine )
                                        {
                                            this.Lines[-1] = new CParaLine(0);
                                            this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                                        }

                                        RecalcResult = recalcresult_NextPage;
                                        bBreak = true;
                                        break;
                                    }
                                    else
                                    {
                                        Pos--;
                                        bNewLine      = true;
                                        bForceNewPage = true;
                                    }
                                }

                                // Если до этого было слово, тогда не надо проверять убирается ли оно
                                if ( bWord || nWordLen > 0 )
                                {
                                    // Добавляем длину пробелов до слова
                                    X += nSpaceLen;

                                    // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                                    X += nWordLen;

                                    bWord        = false;
                                    nSpaceLen    = 0;
                                    nSpacesCount = 0;
                                    nWordLen     = 0;
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
                        if ( bWord || nWordLen > 0 )
                        {
                            // Добавляем длину пробелов до слова
                            X += nSpaceLen;

                            // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                            X += nWordLen;

                            bWord        = false;
                            nSpaceLen    = 0;
                            nSpacesCount = 0;
                            nWordLen     = 0;
                        }

                        if ( true === bStartWord )
                            bFirstItemOnLine = false;

                        if ( LineTextAscent < TextAscent )
                            LineTextAscent = TextAscent;

                        if ( LineTextAscent2 < TextAscent2 )
                            LineTextAscent2 = TextAscent2;

                        if ( LineTextDescent < TextDescent )
                            LineTextDescent = TextDescent;


                        if ( linerule_Exact === ParaPr.Spacing.LineRule )
                        {
                            if ( LineAscent < TextAscent )
                                LineAscent = TextAscent;

                            if ( LineDescent < TextDescent )
                                LineDescent = TextDescent;
                        }
                        else
                        {
                            if ( LineAscent < TextAscent + Item.YOffset )
                                LineAscent = TextAscent + Item.YOffset;

                            if ( LineDescent < TextDescent - Item.YOffset )
                                LineDescent = TextDescent - Item.YOffset;
                        }

                        if ( X + nSpaceLen + Item.Width > XEnd && ( false === bFirstItemOnLine || RangesCount > 0 ) )
                        {
                            if ( RangesCount == CurRange )
                            {
                                bNewLine = true;
                                Pos--;
                            }
                            else
                            {
                                bNewRange = true;
                                Pos--;
                            }
                        }
                        else
                        {
                            // Добавляем длину пробелов до слова
                            X += nSpaceLen;

                            X += Item.Width;
                            bFirstItemOnLine = false;
                            bEmptyLine       = false;
                        }

                        nSpaceLen    = 0;
                        nSpacesCount = 0;

                        break;
                    }
                    case para_Tab:
                    {
                        if ( -1 != pLastTab.Value )
                        {
                            var TempTabX = X;

                            if ( bWord || nWordLen > 0 )
                                TempTabX += nSpaceLen + nWordLen;

                            var TabItem   = pLastTab.Item;
                            var TabStartX = pLastTab.X;
                            var TabRangeW = TempTabX - TabStartX;
                            var TabValue  = pLastTab.Value;
                            var TabPos    = pLastTab.TabPos;

                            var TabCalcW = 0;
                            if ( tab_Right === TabValue )
                                TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW), 0 );
                            else if ( tab_Center === TabValue )
                                TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW / 2), 0 );

                            if ( X + TabCalcW > XEnd )
                                TabCalcW = XEnd - X;

                            TabItem.Width        = TabCalcW;
                            TabItem.WidthVisible = TabCalcW;

                            pLastTab.Value = -1;

                            X += TabCalcW;
                        }

                        // Добавляем длину пробелов до слова
                        X += nSpaceLen;

                        // Не надо проверять убирается ли слово, мы это проверяем при добавленнии букв
                        X += nWordLen;

                        bWord     = false;
                        nSpaceLen = 0;
                        nWordLen  = 0;


                        nSpacesCount = 0;
                        this.Lines[CurLine].Ranges[CurRange].Spaces = 0;
                        this.Lines[CurLine].Ranges[CurRange].TabPos = Pos;

                        var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );
                        if ( undefined != this.Get_FramePr() )
                            PageStart.X = 0;

                        // Если у данного параграфа есть табы, тогда ищем среди них
                        var TabsCount = ParaPr.Tabs.Get_Count();

                        // Добавим в качестве таба левую границу
                        var TabsPos = new Array();
                        var bCheckLeft = true;
                        for ( var Index = 0; Index < TabsCount; Index++ )
                        {
                            var Tab = ParaPr.Tabs.Get(Index);
                            var TabPos = Tab.Pos + PageStart.X;

                            if ( true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left )
                            {
                                TabsPos.push( PageStart.X + ParaPr.Ind.Left );
                                bCheckLeft = false;
                            }

                            if ( tab_Clear != Tab.Value )
                                TabsPos.push( Tab );
                        }

                        if ( true === bCheckLeft )
                            TabsPos.push( PageStart.X + ParaPr.Ind.Left );

                        TabsCount = TabsPos.length;

                        var Tab = null;
                        for ( var Index = 0; Index < TabsCount; Index++ )
                        {
                            var TempTab = TabsPos[Index];

                            if ( X < TempTab.Pos + PageStart.X )
                            {
                                Tab = TempTab;
                                break;
                            }
                        }

                        var NewX = null;

                        // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
                        if ( null === Tab )
                        {
                            if ( X < PageStart.X + ParaPr.Ind.Left )
                                NewX = PageStart.X + ParaPr.Ind.Left;
                            else
                            {
                                NewX = this.X;
                                while ( X >= NewX - 0.001 )
                                    NewX += Default_Tab_Stop;
                            }
                        }
                        else
                        {
                            // Если таб левый, тогда мы сразу смещаемся к нему
                            if ( tab_Left === Tab.Value )
                            {
                                NewX = Tab.Pos + PageStart.X;
                            }
                            else
                            {
                                pLastTab.TabPos = Tab.Pos + PageStart.X;
                                pLastTab.Value  = Tab.Value;
                                pLastTab.X      = X;
                                pLastTab.Item   = Item;

                                Item.Width        = 0;
                                Item.WidthVisible = 0;
                            }
                        }

                        if ( null != NewX )
                        {
                            if ( NewX > XEnd && ( false === bFirstItemOnLine || RangesCount > 0 ) )
                            {
                                nWordLen = NewX - X;

                                if ( RangesCount == CurRange )
                                {
                                    bNewLine = true;
                                    Pos--;
                                }
                                else
                                {
                                    bNewRange = true;
                                    Pos--;
                                }
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
                            if ( true === bStartWord )
                            {
                                bFirstItemOnLine = false;
                                bEmptyLine       = false;
                            }

                            nWordStartPos = Pos;
                        }

                        nSpacesCount = 0;
                        bStartWord = true;
                        bWord = true;
                        nWordStartPos = Pos;

                        break;
                    }
                    case para_TextPr:
                    {
                        break;
                    }
                    case para_NewLine:
                    {
                        if ( break_Page === Item.BreakType )
                        {
                            // PageBreak вне самого верхнего документа не надо учитывать, поэтому мы его с радостью удаляем
                            if ( !(this.Parent instanceof CDocument) )
                            {
                                this.Internal_Content_Remove( Pos );
                                Pos--;
                                break;
                            }

                            bNewPage = true;
                            bNewLine = true;

                            bBreakPageLine = true;
                        }
                        else
                        {
                            if ( RangesCount === CurRange )
                            {
                                bNewLine = true;
                            }
                            else // if ( 0 != RangesCount && RangesCount != CurRange )
                            {
                                bNewRange = true;
                            }

                            bEmptyLine  = false;
                        }

                        X += nWordLen;

                        if ( bWord && this.Lines[CurLine].Words > 1 )
                            this.Lines[CurLine].Spaces += nSpacesCount;

                        if ( bWord && this.Lines[CurLine].Ranges[CurRange].Words > 1 )
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;

                        if ( bWord )
                        {
                            bEmptyLine  = false;
                            bWord       = false;
                            X += nSpaceLen;
                            nSpaceLen = 0;
                        }

                        break;
                    }
                    case para_End:
                    {
                        if ( true === bWord )
                        {
                            bFirstItemOnLine = false;
                            bEmptyLine = false;
                        }

                        // false === bExtendBoundToBottom, потому что это уже делалось для PageBreak
                        if ( false === bExtendBoundToBottom )
                        {
                            X += nWordLen;

                            if ( bWord )
                            {
                                this.Lines[CurLine].Spaces += nSpacesCount;
                                this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                            }

                            if ( bWord )
                            {
                                X += nSpaceLen;
                                nSpaceLen = 0;
                            }

                            if ( -1 != pLastTab.Value )
                            {
                                var TabItem   = pLastTab.Item;
                                var TabStartX = pLastTab.X;
                                var TabRangeW = X - TabStartX;
                                var TabValue  = pLastTab.Value;
                                var TabPos    = pLastTab.TabPos;

                                var TabCalcW = 0;
                                if ( tab_Right === TabValue )
                                    TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW), 0 );
                                else if ( tab_Center === TabValue )
                                    TabCalcW = Math.max( TabPos - (TabStartX + TabRangeW / 2), 0 );

                                if ( X + TabCalcW > XEnd )
                                    TabCalcW = XEnd - X;

                                TabItem.Width        = TabCalcW;
                                TabItem.WidthVisible = TabCalcW;

                                pLastTab.Value = -1;

                                X += TabCalcW;
                            }
                        }

                        bNewLine    = true;
                        bEnd        = true;

                        break;
                    }
                }

                if ( bBreak )
                {
                    break;
                }
            }

            // Переносим строку
            if ( bNewLine )
            {
                pLastTab.Value = -1;
                nSpaceLen = 0;

                // Строка пустая, у нее надо выставить ненулевую высоту. Делаем как Word, выставляем высоту по размеру
                // текста, на котором закончилась данная строка.
                if ( true === bEmptyLine || LineAscent < 0.001 )
                {
                    if ( true === bEnd )
                    {
                        TextAscent  = Item.TextAscent;
                        TextDescent = Item.TextDescent;
                        TextAscent2 = Item.TextAscent2;
                    }

                    if ( LineTextAscent < TextAscent )
                        LineTextAscent = TextAscent;

                    if ( LineTextAscent2 < TextAscent2 )
                        LineTextAscent2 = TextAscent2;

                    if ( LineTextDescent < TextDescent )
                        LineTextDescent = TextDescent;

                    if ( LineAscent < TextAscent )
                        LineAscent = TextAscent;

                    if ( LineDescent < TextDescent )
                        LineDescent = TextDescent;
                }

                // Рассчитаем метрики строки
                this.Lines[CurLine].Metrics.Update( LineTextAscent, LineTextAscent2, LineTextDescent, LineAscent, LineDescent, ParaPr );

                bFirstItemOnLine  = true;
                bStartWord        = false;

                bNewLine          = false;
                bNewRange         = false;

                // Перед тем как перейти к новой строке мы должны убедиться, что вся высота строки
                // убирается в промежутках.

                var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
                if ( 0 === this.Pages[CurPage].FirstLine && ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore ) )
                    TempDy += ParaPr.Spacing.Before;

                if ( 0 === this.Pages[CurPage].FirstLine )
                {
                    if ( ( true === ParaPr.Brd.First || 1 === CurPage ) && border_Single === ParaPr.Brd.Top.Value )
                        TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                        TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                }

                var Top, Bottom;
                var Top2, Bottom2; // верх и низ без Pr.Spacing

                var LastPage_Bottom = this.Pages[CurPage].Bounds.Bottom;

                if ( true === this.Lines[CurLine].RangeY )
                {
                    Top  = Y;
                    Top2 = Y;
                    this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;

                    if ( 0 === CurLine )
                    {
                        if ( 0 === CurPage || true === this.Parent.Is_TableCellContent() )
                        {
                            Top2    = Top + ParaPr.Spacing.Before;
                            Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            Bottom  = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            if ( true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value )
                            {
                                Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom  += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                            else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                            {
                                Top2    += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                Bottom  += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                            }
                        }
                        else
                        {
                            // Параграф начинается с новой страницы
                            Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            Bottom  = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;

                            if ( border_Single === ParaPr.Brd.Top.Value )
                            {
                                Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom  += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                        }
                    }
                    else
                    {
                        Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
                        Bottom  = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                    }

                    if ( bEnd )
                    {
                        Bottom += ParaPr.Spacing.After;

                        // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                        if ( true === ParaPr.Brd.Last )
                        {
                            if ( border_Single === ParaPr.Brd.Bottom.Value )
                                Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                        }
                        else
                        {
                            if ( border_Single === ParaPr.Brd.Between.Value )
                                Bottom += ParaPr.Brd.Between.Space;
                        }

                        if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                            Bottom = this.YLimit;
                    }

                    this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

                    this.Bounds.Bottom = Bottom;
                    this.Pages[CurPage].Bounds.Bottom = Bottom;
                }
                else
                {
                    if ( 0 != CurLine )
                    {
                        if ( CurLine != this.Pages[CurPage].FirstLine )
                        {
                            Top     = Y + TempDy + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                            Bottom  = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            Top2    = Top;
                            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;

                            this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;

                            if ( bEnd )
                            {
                                Bottom += ParaPr.Spacing.After;

                                // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                                if ( true === ParaPr.Brd.Last )
                                {
                                    if ( border_Single === ParaPr.Brd.Bottom.Value )
                                        Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                                }
                                else
                                {
                                    if ( border_Single === ParaPr.Brd.Between.Value )
                                        Bottom += ParaPr.Brd.Between.Space;
                                }

                                if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                                    Bottom = this.YLimit;
                            }

                            this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

                            this.Bounds.Bottom = Bottom;
                            this.Pages[CurPage].Bounds.Bottom = Bottom;
                        }
                        else
                        {
                            Top     = this.Pages[CurPage].Y;
                            Bottom  = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            Top2    = Top;
                            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;

                            this.Lines[CurLine].Top = 0;

                            if ( bEnd )
                            {
                                Bottom += ParaPr.Spacing.After;

                                // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                                if ( true === ParaPr.Brd.Last )
                                {
                                    if ( border_Single === ParaPr.Brd.Bottom.Value )
                                        Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                                }
                                else
                                {
                                    if ( border_Single === ParaPr.Brd.Between.Value )
                                        Bottom += ParaPr.Brd.Between.Space;
                                }

                                if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                                    Bottom = this.YLimit;
                            }

                            this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

                            this.Bounds.Bottom = Bottom;
                            this.Pages[CurPage].Bounds.Bottom = Bottom;

                        }

                    }
                    else
                    {
                        Top  = Y;
                        Top2 = Y;

                        if ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore )
                        {
                            Top2    = Top + ParaPr.Spacing.Before;
                            Bottom  = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                            if ( true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value )
                            {
                                Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom  += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                            else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                            {
                                Top2    += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                Bottom  += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                            }
                        }
                        else
                        {
                            // Параграф начинается с новой страницы
                            Bottom  = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;

                            if ( border_Single === ParaPr.Brd.Top.Value )
                            {
                                Top2    += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom  += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                        }

                        if ( bEnd )
                        {
                            Bottom += ParaPr.Spacing.After;

                            // Если нижняя граница Between, тогда она учитывается в следующем параграфе
                            if ( true === ParaPr.Brd.Last )
                            {
                                if ( border_Single === ParaPr.Brd.Bottom.Value )
                                    Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                            }
                            else
                            {
                                if ( border_Single === ParaPr.Brd.Between.Value )
                                    Bottom += ParaPr.Brd.Between.Space;
                            }

                            if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                                Bottom = this.YLimit;
                        }

                        this.Lines[0].Top    = Top    - this.Pages[CurPage].Y;
                        this.Lines[0].Bottom = Bottom - this.Pages[CurPage].Y;

                        this.Bounds.Top    = Top;
                        this.Bounds.Bottom = Bottom;

                        this.Pages[CurPage].Bounds.Top    = Top;
                        this.Pages[CurPage].Bounds.Bottom = Bottom;
                    }
                }

                // Переносим строку по BreakPage, выясним есть ли в строке что-нибудь кроме BreakPage. Если нет,
                // тогда нам не надо проверять высоту строки и обтекание.
                var bBreakPageLineEmpty = false;
                if ( true === bBreakPageLine )
                {
                    bBreakPageLineEmpty = true;
                    for ( var _Pos = Pos - 1; _Pos >= LineStart_Pos; _Pos-- )
                    {
                        var _Item = this.Content[_Pos];
                        var _Type = _Item.Type;
                        if ( para_Drawing === _Type || para_End === _Type || (para_NewLine === _Type && break_Line === _Item.BreakType) || para_PageNum === _Type || para_Space === _Type || para_Tab === _Type || para_Text === _Type || para_Math === _Type )
                        {
                            bBreakPageLineEmpty = false;
                            break;
                        }
                    }
                }

                // Сначала проверяем не нужно ли сделать перенос страницы в данном месте
                // Перенос не делаем, если это первая строка на новой странице
                if ( true === this.Use_YLimit() && (Top > this.YLimit || Bottom2 > this.YLimit ) && ( CurLine != this.Pages[CurPage].FirstLine || ( 0 === CurPage && ( null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent() ) ) ) && false === bBreakPageLineEmpty )
                {
                    // Проверим висячую строку
                    if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() && true === ParaPr.WidowControl && CurLine - this.Pages[CurPage].StartLine <= 1 && CurLine >= 1 && true != bBreakPageLine && ( 0 === CurPage && null != this.Get_DocumentPrev() ) )
                    {
                        this.Parent.RecalcInfo.Set_WidowControl(this, CurLine - 1);
                        RecalcResult = recalcresult_CurPage;
                        break;
                    }
                    else
                    {
                        // Неразрывные абзацы не учитываются в таблицах
                        if ( true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage )
                        {
                            CurLine       = 0;
                            LineStart_Pos = 0;
                        }

                        // Восстанавливаем позицию нижней границы предыдущей страницы
                        this.Pages[CurPage].Bounds.Bottom = LastPage_Bottom;
                        this.Pages[CurPage].Set_EndLine( CurLine - 1 );

                        if ( 0 === CurLine )
                        {
                            this.Lines[-1] = new CParaLine(0);
                            this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                        }

                        // Добавляем разрыв страницы
                        RecalcResult = recalcresult_NextPage;

                        break;
                    }
                }

                bBreakPageLine = false;

                var Left   = ( 0 != CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine );
                var Right  = this.XLimit - ParaPr.Ind.Right;

                var PageFields = this.Parent.Get_PageFields( this.PageNum + CurPage );
                var Ranges2;
                if ( true === this.Use_Wrap() )
                    Ranges2 = this.Parent.CheckRange( Left, Top, Right, Bottom, Top2, Bottom2, PageFields.X, PageFields.XLimit, this.PageNum + CurPage, true );
                else
                    Ranges2 = new Array();

                // Проверяем совпали ли промежутки. Если совпали, тогда данная строчка рассчитана верно,
                // и мы переходим к следующей, если нет, тогда заново рассчитываем данную строчку, но
                // с новыми промежутками.
                // Заметим, что тут возможен случай, когда Ranges2 меньше, чем Ranges, такое может случится
                // при повторном обсчете строки. (После первого расчета мы выяснили что Ranges < Ranges2,
                // при повторном обсчете строки, т.к. она стала меньше, то у нее и рассчитанная высота могла
                // уменьшиться, а значит Ranges2 могло оказаться меньше чем Ranges). В таком случае не надо
                // делать повторный пересчет, иначе будет зависание.
                if ( -1 == FlowObjects_CompareRanges( Ranges, Ranges2 ) && true === FlowObjects_CheckInjection( Ranges, Ranges2 ) && false === bBreakPageLineEmpty )
                {
                    bEnd = false;

                    Ranges = Ranges2;

                    Pos = LineStart_Pos - 1;

                    if ( 0 == CurLine )
                        X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    else
                        X = this.X + ParaPr.Ind.Left;

                    this.Lines[CurLine].Reset();
                    //this.Lines[CurLine].Metrics.Update( TextAscent, TextAscent2, TextDescent, TextAscent, TextDescent, ParaPr );

                    LineTextAscent  = 0;
                    LineTextAscent2 = 0;
                    LineTextDescent = 0;
                    LineAscent      = 0;
                    LineDescent     = 0;

                    TextAscent  = 0;
                    TextDescent = 0;
                    TextAscent2 = 0;

                    RangesCount = Ranges.length;

                    // Выставляем начальные сдвиги для промежутков. Начало промежутка = конец вырезаемого промежутка
                    this.Lines[CurLine].Add_Range( ( 0 == CurLine ? this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : this.X + ParaPr.Ind.Left ), (RangesCount == 0 ? XLimit : Ranges[0].X0) );
                    this.Lines[CurLine].Set_RangeStartPos( 0, Pos + 1 );
                    for ( var Index = 1; Index < Ranges.length + 1; Index++ )
                    {
                        this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0) );
                    }

                    CurRange = 0;
                    XEnd = 0;

                    if ( RangesCount == 0 )
                        XEnd = XLimit;
                    else
                        XEnd = Ranges[0].X0;

                    bStartWord = false;
                    bWord = false;
                    bNewPage = false;
                    bForceNewPage = false;
                    bExtendBoundToBottom = false;
                    nWordLen = 0;
                    nSpacesCount = 0;
                    bAddNumbering = this.Internal_CheckAddNumbering( CurPage, CurLine, CurRange );
                }
                else
                {
                    if ( 0 != CurLine )
                        this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left;
                    else
                        this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;

                    if ( 0 == CurRange )
                    {
                        if ( 0 != CurLine )
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                        else
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                    }
                    else
                    {
                        if ( true === this.Lines[CurLine].Ranges[CurRange].FirstRange )
                        {
                            if ( ParaPr.Ind.FirstLine < 0 )
                                Ranges[CurRange - 1].X1 += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                            else
                                Ranges[CurRange - 1].X1 += ParaPr.Ind.FirstLine;
                        }

                        this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                    }

                    if ( true === bNewPage )
                    {
                        bNewPage = false;

                        // Если это последний элемент параграфа, тогда нам не надо переносить текущий параграф
                        // на новую страницу. Нам надо выставить границы так, чтобы следующий параграф начинался
                        // с новой страницы.

                        // TODO: заменить на функцию проверки
                        var ____Pos = Pos + 1;
                        var Next = this.Internal_FindForward( ____Pos, [ para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum, para_Math ] );
                        while ( true === Next.Found && para_Drawing === Next.Type && drawing_Anchor === this.Content[Next.LetterPos].Get_DrawingType() )
                            Next = this.Internal_FindForward( ++____Pos, [ para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum, para_Math ] );

                        if ( true === Next.Found && para_End === Next.Type )
                        {
                            Item.Flags.NewLine = false;
                            bExtendBoundToBottom = true;
                            continue;
                        }

                        if ( true === this.Lines[CurLine].RangeY )
                        {
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                        else
                        {
                            if ( CurLine > 0 )
                            {
                                // Первая линия на странице не должна двигаться
                                if ( CurLine != this.Pages[CurPage].FirstLine )
                                    Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap +  this.Lines[CurLine].Metrics.Ascent;

                                this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                            }
                        }

                        this.Pages[CurPage].Set_EndLine( CurLine );
                        this.Lines[CurLine].Set_EndPos( Pos, this );

                        RecalcResult = recalcresult_NextPage;
                        break;
                    }
                    else
                    {
                        if ( true === this.Lines[CurLine].RangeY )
                        {
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                        else
                        {
                            if ( CurLine > 0 )
                            {
                                // Первая линия на странице не должна двигаться
                                if ( CurLine != this.Pages[CurPage].FirstLine )
                                    Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap +  this.Lines[CurLine].Metrics.Ascent;

                                this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                            }
                        }

                        if ( ( true === bEmptyLine && RangesCount > 0 && LineStart_Pos < 0 ) || Pos < 0 )
                            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        else
                            X = this.X + ParaPr.Ind.Left;
                    }

                    if ( !bEnd )
                    {
                        // Если строка пустая в следствии того, что у нас было обтекание, тогда мы не
                        // добавляем новую строку, а просто текущую смещаем ниже.
                        if ( true === bEmptyLine && RangesCount > 0 )
                        {
                            Pos = LineStart_Pos - 1;

                            var RangesY = Ranges[0].Y1;
                            for ( var Index = 1; Index < Ranges.length; Index++ )
                            {
                                if ( RangesY > Ranges[Index].Y1 )
                                    RangesY = Ranges[Index].Y1;
                            }

                            if ( Math.abs(RangesY - Y) < 0.01  )
                                Y = RangesY + 1; // смещаемся по 1мм
                            else
                                Y = RangesY + 0.001;

                            if ( 0 === CurLine )
                                X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                            else
                                X = this.X + ParaPr.Ind.Left;
                        }
                        else
                        {
                            this.Lines[CurLine].Set_EndPos( Pos, this );
                            CurLine++;

                            if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Check_WidowControl(this, CurLine) )
                            {
                                this.Parent.RecalcInfo.Reset_WidowControl();

                                this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                                if ( 0 === CurLine )
                                {
                                    this.Lines[-1] = new CParaLine( 0 );
                                    this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                                }

                                RecalcResult = recalcresult_NextPage;
                                break;
                            }
                        }
                        this.Lines[CurLine] = new CParaLine(Pos + 1);
                        //this.Lines[CurLine].Metrics.Update( TextAscent, TextAscent2, TextDescent, TextAscent, TextDescent, ParaPr );

                        LineTextAscent  = 0;
                        LineTextDescent = 0;
                        LineTextAscent2 = 0;
                        LineAscent      = 0;
                        LineDescent     = 0;

                        TextAscent  = 0;
                        TextDescent = 0;
                        TextAscent2 = 0;

                        // Верх следующей строки
                        var TempY;
                        if ( true === bEmptyLine && RangesCount > 0 )
                        {
                            TempY = Y;
                            this.Lines[CurLine].RangeY = true;
                        }
                        else
                        {
                            if ( CurLine > 0 )
                            {
                                if ( CurLine != this.Pages[CurPage].FirstLine )
                                    TempY = TempDy + Y + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                                else
                                    TempY = this.Pages[CurPage].Y;
                            }
                            else
                                TempY = this.Y;
                        }

                        // Получаем промежутки обтекания, т.е. промежутки, которые нам нельзя использовать
                        Ranges = [];//this.Parent.CheckRange( X, TempY, XLimit, TempY, TempY, TempY, this.PageNum + CurPage, true );
                        RangesCount = Ranges.length;

                        // Выставляем начальные сдвиги для промежутков. Началао промежутка = конец вырезаемого промежутка
                        this.Lines[CurLine].Add_Range( X, (RangesCount == 0 ? XLimit : Ranges[0].X0) );
                        this.Lines[CurLine].Set_RangeStartPos( 0, Pos + 1 );
                        for ( var Index = 1; Index < Ranges.length + 1; Index++ )
                        {
                            this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0) );
                        }

                        CurRange = 0;
                        XEnd = 0;

                        if ( RangesCount == 0 )
                            XEnd = XLimit;
                        else
                            XEnd = Ranges[0].X0;


                        bWord = false;
                        nWordLen = 0;
                        nSpacesCount = 0;

                        LineStart_Pos = Pos + 1;

                        if ( true === bForceNewPage )
                        {
                            this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                            if ( 0 === CurLine )
                            {
                                this.Lines[-1] = new CParaLine( 0 );
                                this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                            }

                            RecalcResult = recalcresult_NextPage;
                            break;
                        }

                        bAddNumbering = this.Internal_CheckAddNumbering( CurPage, CurLine, CurRange );
                    }
                    else
                    {
                        for ( var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++ )
                            this.Lines[CurLine].Set_RangeStartPos( TempRange, Pos + 1 );

                        this.Lines[CurLine].Set_EndPos( Pos, this );

                        // Проверим висячую строку
                        if ( true === ParaPr.WidowControl && CurLine === this.Pages[CurPage].StartLine && CurLine >= 1 )
                        {
                            // Проверим не встречается ли в предыдущей строке BreakPage, если да, тогда не учитываем WidowControl
                            var bBreakPagePrevLine = false;
                            var StartPos = (CurLine == 2 ? this.Lines[CurLine - 2].StartPos : this.Lines[CurLine - 1].StartPos );
                            var EndPos   = this.Lines[CurLine - 1].EndPos;
                            for ( var TempPos = StartPos; TempPos <= EndPos; TempPos++ )
                            {
                                var TempItem = this.Content[TempPos];
                                if ( para_NewLine === TempItem.Type && break_Page === TempItem.BreakType )
                                {
                                    bBreakPagePrevLine = true;
                                    break;
                                }
                            }

                            if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() && false === bBreakPagePrevLine && ( 1 === CurPage && null != this.Get_DocumentPrev() ) && this.Lines[CurLine - 1].Ranges.length <= 1 )
                            {
                                this.Parent.RecalcInfo.Set_WidowControl(this, ( CurLine > 2 ? CurLine - 1 : 0 ) ); // Если у нас в параграфе 3 строки, тогда сразу начинаем параграф с новой строки
                                RecalcResult = recalcresult_PrevPage;
                                break;
                            }
                        }

                        if ( true === bEnd && true === bExtendBoundToBottom )
                        {
                            // Специальный случай с PageBreak, когда после самого PageBreak ничего нет
                            // в параграфе

                            this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
                            this.Bounds.Bottom = this.Pages[CurPage].YLimit;

                            this.Lines[CurLine].Set_EndPos( Pos, this );
                            this.Pages[CurPage].Set_EndLine( CurLine );

                            for ( var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++ )
                                this.Lines[CurLine].Set_RangeStartPos( TempRange, Pos );

                            // Если у нас нумерация относится к знаку конца параграфа, тогда в такой
                            // ситуации не рисуем нумерацию у такого параграфа.
                            if ( Pos === this.Numbering.Pos )
                                this.Numbering.Pos = -1;
                        }
                        else
                        {
                            this.Lines[CurLine].Set_EndPos( Pos, this );
                            this.Pages[CurPage].Set_EndLine( CurLine );

                            for ( var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++ )
                                this.Lines[CurLine].Set_RangeStartPos( TempRange, Pos + 1 );
                        }
                    }
                }

                bEmptyLine = true;
            }
            else if ( bNewRange )
            {
                pLastTab.Value = -1;

                this.Lines[CurLine].Set_RangeStartPos( CurRange + 1, Pos + 1 );

                nSpaceLen = 0;

                bNewRange     = false;

                bFirstItemOnLine = true;
                bStartWord       = false;

                if ( 0 == CurRange )
                {
                    if ( 0 != CurLine )
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                    else
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                }
                else
                {
                    if ( true === this.Lines[CurLine].Ranges[CurRange].FirstRange )
                    {
                        if ( ParaPr.Ind.FirstLine < 0 )
                            Ranges[CurRange - 1].X1 += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        else
                            Ranges[CurRange - 1].X1 += ParaPr.Ind.FirstLine;
                    }

                    this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                }

                CurRange++;

                if ( 0 === CurLine && true === bEmptyLine )
                {
                    if ( ParaPr.Ind.FirstLine < 0 )
                        this.Lines[CurLine].Ranges[CurRange].X += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    else
                        this.Lines[CurLine].Ranges[CurRange].X += ParaPr.Ind.FirstLine;

                    this.Lines[CurLine].Ranges[CurRange].FirstRange = true;
                }

                X = this.Lines[CurLine].Ranges[CurRange].X;

                if ( CurRange == RangesCount )
                    XEnd = XLimit;
                else
                    XEnd = Ranges[CurRange].X0;

                bWord = false;
                nWordLen = 0;
                nSpacesCount = 0;
                bAddNumbering = this.Internal_CheckAddNumbering( CurPage, CurLine, CurRange );
            }
        }

        // TODO: пока таким образом мы делаем, this.Y - был верхним краем параграфа
        //       Потом надо будет переделать.
        var StartLine = this.Pages[CurPage].FirstLine;
        var EndLine   = this.Lines.length - 1;

        var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
        if ( 0 === StartLine && ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore ) )
            TempDy += ParaPr.Spacing.Before;

        if ( 0 === StartLine )
        {
            if ( ( true === ParaPr.Brd.First || 1 === CurPage ) && border_Single === ParaPr.Brd.Top.Value )
                TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
        }

        for ( var Index = StartLine; Index <= EndLine; Index++ )
        {
            this.Lines[Index].Y += TempDy;
            if ( this.Lines[Index].Metrics.LineGap < 0 )
                this.Lines[Index].Y += this.Lines[Index].Metrics.LineGap;
        }

        return RecalcResult;
    },

    // Пересчет переносов строк в параграфе, с учетом возможного обтекания
    Recalculate_Page__ : function(CurPage)
    {
        var PRS = g_oPRSW;
        PRS.Paragraph = this;
        PRS.Page      = CurPage;

        var Pr     = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;

        var StartLine = ( CurPage > 0 ? this.Pages[CurPage - 1].EndLine + 1 : 0 );

        //-------------------------------------------------------------------------------------------------------------
        // Обрабатываем настройку "не отрывать от следующего"
        //-------------------------------------------------------------------------------------------------------------
        // Такая настройка срабатывает в единственном случае:
        // У предыдущего параграфа выставлена данная настройка, а текущий параграф сразу начинается с новой страницы
        // ( при этом у него не выставлен флаг "начать с новой страницы", иначе будет зацикливание здесь ).
        if ( 1 === CurPage && this.Pages[0].EndLine < 0 && this.Parent instanceof CDocument && false === ParaPr.PageBreakBefore )
        {
            // Если у предыдущего параграфа стоит настройка "не отрывать от следующего".
            // И сам параграф не разбит на несколько страниц и не начинается с новой страницы,
            // тогда мы должны пересчитать предыдущую страницу, с учетом того, что предыдущий параграф
            // надо начать с новой страницы.
            var Curr = this.Get_DocumentPrev();
            while ( null != Curr && type_Paragraph === Curr.GetType() )
            {
                var CurrKeepNext = Curr.Get_CompiledPr2(false).ParaPr.KeepNext;
                if ( (true === CurrKeepNext && Curr.Pages.length > 1) || false === CurrKeepNext )
                {
                    break;
                }
                else
                {
                    var Prev = Curr.Get_DocumentPrev();
                    if ( null === Prev || type_Paragraph != Prev.GetType() )
                        break;

                    var PrevKeepNext = Prev.Get_CompiledPr2(false).ParaPr.KeepNext;
                    if ( false === PrevKeepNext )
                    {
                        if ( true === this.Parent.RecalcInfo.Can_RecalcObject() )
                        {
                            this.Parent.RecalcInfo.Set_KeepNext(Curr);
                            PRS.RecalcResult = recalcresult_PrevPage;
                            return PRS.RecalcResult;
                        }
                        else
                            break;
                    }
                    else
                        Curr = Prev;
                }
            }
        }

        //-------------------------------------------------------------------------------------------------------------
        // Получаем начальные координаты параграфа
        //-------------------------------------------------------------------------------------------------------------
        // Если это первая страница параграфа (CurPage = 0), тогда мы должны использовать координаты, которые нам
        // были заданы сверху, а если не первая, тогда координаты мы должны запросить у родительского класса.

        var XStart, YStart, XLimit, YLimit;
        if ( 0 === CurPage )//|| ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument ) )
        {
            XStart = this.X;
            YStart = this.Y;
            XLimit = this.XLimit;
            YLimit = this.YLimit;
        }
        else
        {
            var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

            XStart = PageStart.X;
            YStart = PageStart.Y;
            XLimit = PageStart.XLimit;
            YLimit = PageStart.YLimit;
        }

        PRS.XStart = XStart;
        PRS.YStart = YStart;
        PRS.XLimit = XLimit;
        PRS.YLimit = YLimit;

        PRS.Y = YStart;
        //-------------------------------------------------------------------------------------------------------------
        // Создаем новую страницу
        //-------------------------------------------------------------------------------------------------------------
        var CurLine = StartLine;
        this.Pages.length = CurPage + 1
        this.Pages[CurPage] = new CParaPage( XStart, YStart, XLimit, YLimit, StartLine );

        // Изначально обнуляем промежутки обтекания
        PRS.Reset_Ranges();

        //-------------------------------------------------------------------------------------------------------------
        // Делаем проверки, не нужно ли сразу перенести параграф на новую страницу
        //-------------------------------------------------------------------------------------------------------------
        if ( this.Parent instanceof CDocument )
        {
            // Начинаем параграф с новой страницы
            if ( 0 === CurPage && true === ParaPr.PageBreakBefore )
            {
                // Если это первый элемент документа, тогда не надо начинать его с новой страницы
                var Prev = this.Get_DocumentPrev();
                if ( null != Prev )
                {
                    // Добавляем разрыв страницы
                    this.Pages[CurPage].Set_EndLine( CurLine - 1 );

                    if (  0 === CurLine )
                    {
                        this.Lines[-1] = new CParaLine(0);
                        this.Lines[-1].Set_EndPos( StartPos - 1, this );
                    }

                    PRS.RecalcResult = recalcresult_NextPage;
                    return PRS.RecalcResult;
                }
            }
            else if  ( true === this.Parent.RecalcInfo.Check_WidowControl( this, CurLine ) )
            {
                this.Parent.RecalcInfo.Reset_WidowControl();

                this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine( 0 );
                    this.Lines[-1].Set_EndPos( -1, this );
                }

                PRS.RecalcResult = recalcresult_NextPage;
                return PRS.RecalcResult;
            }
            else if ( true === this.Parent.RecalcInfo.Check_KeepNext(this) && 0 === CurPage && null != this.Get_DocumentPrev() )
            {
                this.Parent.RecalcInfo.Reset();

                this.Pages[CurPage].Set_EndLine( CurLine - 1 );
                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine( 0 );
                    this.Lines[-1].Set_EndPos( -1, this );
                }

                PRS.RecalcResult = recalcresult_NextPage;
                return PRS.RecalcResult;
            }
        }

        var RecalcResult = recalcresult_NextElement;
        while ( true )
        {
            //console.log( this.Index + " Line : " + CurLine  );
            PRS.Line = CurLine;
            PRS.RecalcResult = recalcresult_NextLine;

            this.Recalculate_Line(PRS, ParaPr);

            RecalcResult = PRS.RecalcResult;

            if ( recalcresult_NextLine === RecalcResult )
            {
                //console.log( "next "  );
                // В эту ветку мы попадаем, если строка пересчиталась в нормальном режиме и можно переходить к следующей.
                CurLine++;
                PRS.Reset_Ranges();
                continue;
            }
            else if ( recalcresult_CurLine === RecalcResult )
            {
                //console.log( "curline ");
                // В эту ветку мы попадаем, если нам необходимо заново пересчитать данную строку. Такое случается
                // когда у нас появляются плавающие объекты, относительно которых необходимо произвести обтекание.
                // В данном случае мы ничего не делаем, т.к. номер строки не меняется, а новые отрезки обтекания
                // были заполнены при последнем неудачном рассчете.
                continue;
            }
            else if ( recalcresult_NextElement === RecalcResult || recalcresult_NextPage === RecalcResult )
            {
                //console.log( "nextPageElement ");
                // В эту ветку мы попадаем, если мы достигли конца страницы или конца параграфа. Просто выходим
                // из цикла.
                break;
            }
            else //if ( recalcresult_CurPage === RecalcResult || recalcresult_PrevPage === RecalcResult )
            {
                //console.log( "curPrevPage ");
                // В эту ветку мы попадаем, если в нашем параграфе встретилось, что-то из-за чего надо пересчитывать
                // эту страницу или предыдущую страницу. Поэтому далее можно ничего не делать, а сообщать верхнему
                // классу об этом.
                return RecalcResult;
            }
        }

        //-------------------------------------------------------------------------------------------------------------
        // Выставляем Baseline в наших строках
        //-------------------------------------------------------------------------------------------------------------
        var EndLine = this.Lines.length - 1;

        var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
        if ( 0 === StartLine && ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore ) )
            TempDy += ParaPr.Spacing.Before;

        if ( 0 === StartLine )
        {
            if ( ( true === ParaPr.Brd.First || 1 === CurPage ) && border_Single === ParaPr.Brd.Top.Value )
                TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
        }

        for ( var Index = StartLine; Index <= EndLine; Index++ )
        {
            this.Lines[Index].Y += TempDy;
            if ( this.Lines[Index].Metrics.LineGap < 0 )
                this.Lines[Index].Y += this.Lines[Index].Metrics.LineGap;
        }

        //-------------------------------------------------------------------------------------------------------------
        // Рассчитываем ширину каждого отрезка, количество слов и пробелов в нем
        //-------------------------------------------------------------------------------------------------------------
        this.Recalculate_Lines_Width(CurPage);

        //-------------------------------------------------------------------------------------------------------------
        // Пересчитываем сдвиги элементов внутри параграфа и видимые ширины пробелов, в зависимости от align.
        //-------------------------------------------------------------------------------------------------------------
        var RecalcResultAlign = this.Recalculate_Lines_Align(PRS, CurPage, ParaPr);

        if ( recalcresult_NextElement !== RecalcResultAlign )
            return RecalcResultAlign;

        return RecalcResult;
    },

    // Пересчитываем сдвиги элементов внутри параграфа, в зависимости от align.
    // Пересчитываем текущую позицию курсора, и видимые ширины пробелов.
    Internal_Recalculate_2_ : function(StartPos, _CurPage, _CurLine)
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

        var Pr     = this.Get_CompiledPr2(false);
        var ParaPr = Pr.ParaPr;

        var CurRange = 0;
        var CurLine  = _CurLine;
        var CurPage  = _CurPage;

        // Если параграф переносится на новую страницу с первой строки
        if ( this.Pages[CurPage].EndLine < 0 )
            return recalcresult_NextPage;

        var EndPos = this.Lines[this.Pages[CurPage].EndLine].EndPos;

        var JustifyWord  = 0;
        var JustifySpace = 0;

        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

        var bFirstLineItem = true;

        var Range       = this.Lines[CurLine].Ranges[CurRange];
        var RangesCount = this.Lines[CurLine].Ranges.length;
        var RangeWidth  = Range.XEnd - Range.X;

        var X = 0;

        switch (ParaPr.Jc)
        {
            case align_Left   : X = Range.X; break;
            case align_Right  : X = Math.max(Range.X +  RangeWidth - Range.W, Range.X ); break;
            case align_Center : X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X); break
            case align_Justify:
            {
                X = Range.X;

                if ( 1 == Range.Words )
                {
                    if ( 1 == RangesCount && this.Lines.length > 1 )
                    {
                        // Подсчитаем количество букв в слове
                        var LettersCount = 0;
                        var TempPos      = StartPos;
                        var LastW        = 0;

                        var __CurLine  = CurLine;
                        var __CurRange = CurRange;

                        while ( this.Content[TempPos].Type != para_End )
                        {
                            var __Item = this.Content[TempPos];
                            if ( undefined != __Item.CurPage )
                            {
                                if ( __CurLine != __Item.CurLine || __CurRange != __Item.Range )
                                    break;
                            }

                            if ( para_Text == this.Content[TempPos].Type )
                            {
                                LettersCount++;
                                LastW = this.Content[TempPos].Width;
                            }

                            TempPos++;
                        }

                        // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                        if ( RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1 )
                            JustifyWord = (RangeWidth -  Range.W) / (LettersCount - 1);
                    }
                    else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1 ) )
                    {
                        // Ничего не делаем (выравниваем текст по левой границе)
                    }
                    else if ( CurRange == this.Lines[CurLine].Ranges.length - 1 )
                    {
                        X = Range.X +  RangeWidth - Range.W;
                    }
                    else
                    {
                        X = Range.X + (RangeWidth - Range.W) / 2;
                    }
                }
                else
                {
                    // Последний промежуток последней строки не надо растягивать по ширине.
                    if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1 ) )
                        JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                    else
                        JustifySpace = 0;
                }

                break;
            }
            default : X = Range.X; break;
        }

        var SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
        this.Lines[CurLine].X = X - this.X;

        var LastW = 0; // параметр нужен для позиционирования Flow-объектов

        for ( var ItemNum = StartPos; ItemNum <= EndPos; ItemNum++ )
        {
            var Item = this.Content[ItemNum];

            if ( undefined != Item.CurPage )
            {
                if ( CurLine < Item.CurLine )
                {
                    CurLine  = Item.CurLine;
                    CurRange = Item.CurRange;

                    JustifyWord  = 0;
                    JustifySpace = 0;

                    Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                    bFirstLineItem = true;

                    Range       = this.Lines[CurLine].Ranges[CurRange];
                    RangesCount = this.Lines[CurLine].Ranges.length;
                    RangeWidth  = Range.XEnd - Range.X;

                    switch (ParaPr.Jc)
                    {
                        case align_Left   : X = Range.X; break;
                        case align_Right  : X = Math.max(Range.X +  RangeWidth - Range.W, Range.X); break;
                        case align_Center : X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X); break
                        case align_Justify:
                        {
                            X = Range.X;

                            if ( 1 == Range.Words )
                            {
                                if ( 1 == RangesCount && this.Lines.length > 1 )
                                {
                                    // Подсчитаем количество букв в слове
                                    var LettersCount = 0;
                                    var TempPos      = ItemNum + 1;
                                    var LastW        = 0;

                                    var __CurLine  = CurLine;
                                    var __CurRange = CurRange;

                                    while ( this.Content[TempPos].Type != para_End )
                                    {
                                        var __Item = this.Content[TempPos];
                                        if ( undefined != __Item.CurPage )
                                        {
                                            if ( __CurLine != __Item.CurLine || __CurRange != __Item.Range )
                                                break;
                                        }

                                        if ( para_Text == this.Content[TempPos].Type )
                                        {
                                            LettersCount++;
                                            LastW = this.Content[TempPos].Width;
                                        }

                                        TempPos++;
                                    }

                                    // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                    if ( RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1 )
                                        JustifyWord = (RangeWidth -  Range.W) / (LettersCount - 1);
                                }
                                else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1 ) )
                                {
                                    // Ничего не делаем (выравниваем текст по левой границе)
                                }
                                else if ( CurRange == this.Lines[CurLine].Ranges.length - 1 )
                                {
                                    X = Range.X +  RangeWidth - Range.W;
                                }
                                else
                                {
                                    X = Range.X + (RangeWidth - Range.W) / 2;
                                }
                            }
                            else
                            {
                                // Последний промежуток последней строки не надо растягивать по ширине.
                                if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1 ) )
                                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                                else
                                    JustifySpace = 0;
                            }

                            break;
                        }
                        default : X = Range.X; break;
                    }

                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    this.Lines[CurLine].Ranges[CurRange].XVisible = X;
                    this.Lines[CurLine].X = X - this.X;
                }
                else if ( CurRange < Item.CurRange )
                {
                    CurRange = Item.CurRange;

                    Range      = this.Lines[CurLine].Ranges[CurRange];
                    RangeWidth = Range.XEnd - Range.X;

                    switch (ParaPr.Jc)
                    {
                        case align_Left   : X = Range.X; break;
                        case align_Right  : X = Math.max(Range.X +  RangeWidth - Range.W, Range.X); break;
                        case align_Center : X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X); break
                        case align_Justify:
                        {
                            X = Range.X;

                            if ( 1 == Range.Words )
                            {
                                if ( 1 == RangesCount && this.Lines.length > 1 )
                                {
                                    // Подсчитаем количество букв в слове
                                    var LettersCount = 0;
                                    var TempPos      = ItemNum + 1;
                                    var LastW        = 0;

                                    var __CurLine  = CurLine;
                                    var __CurRange = CurRange;

                                    while ( this.Content[TempPos].Type != para_End )
                                    {
                                        var __Item = this.Content[TempPos];
                                        if ( undefined != __Item.CurPage )
                                        {
                                            if ( __CurLine != __Item.CurLine || __CurRange != __Item.Range )
                                                break;
                                        }

                                        if ( para_Text == this.Content[TempPos].Type )
                                        {
                                            LettersCount++;
                                            LastW = this.Content[TempPos].Width;
                                        }

                                        TempPos++;
                                    }

                                    // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                    if ( RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1 )
                                        JustifyWord = (RangeWidth -  Range.W) / (LettersCount - 1);
                                }
                                else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1 ) )
                                {
                                    // Ничего не делаем (выравниваем текст по левой границе)
                                }
                                else if ( CurRange == this.Lines[CurLine].Ranges.length - 1 )
                                {
                                    X = Range.X +  RangeWidth - Range.W;
                                }
                                else
                                {
                                    X = Range.X + (RangeWidth - Range.W) / 2;
                                }
                            }
                            else
                            {
                                // Последний промежуток последней строки не надо растягивать по ширине.
                                if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1  ) )
                                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                                else
                                    JustifySpace = 0;
                            }

                            break;
                        }
                        default : X = Range.X; break;
                    }

                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    this.Lines[CurLine].Ranges[CurRange].XVisible = X;
                }
            }

            if ( ItemNum == this.CurPos.ContentPos )
            {
                this.CurPos.X = X;
                this.CurPos.Y = Y;
                this.CurPos.PagesPos = CurPage;
            }

            if ( ItemNum == this.Numbering.Pos )
                X += this.Numbering.WidthVisible;

            switch( Item.Type )
            {
                case para_Math:
                case para_Text:
                {
                    bFirstLineItem = false;
                    if ( CurLine != this.Lines.length - 1 && JustifyWord > 0 )
                        Item.WidthVisible = Item.Width + JustifyWord;
                    else
                        Item.WidthVisible = Item.Width;

                    X += Item.WidthVisible;
                    LastW = Item.WidthVisible;

                    break;
                }
                case para_Space:
                {
                    if ( !bFirstLineItem && CurLine != this.Lines.length - 1 && SpacesCounter > 0 && (ItemNum > this.Lines[CurLine].Ranges[CurRange].SpacePos) )
                    {
                        Item.WidthVisible = Item.Width + JustifySpace;
                        SpacesCounter--;
                    }
                    else
                        Item.WidthVisible = Item.Width;

                    X += Item.WidthVisible;
                    LastW = Item.WidthVisible;

                    break;
                }
                case para_Drawing:
                {
                    var DrawingObjects = this.Parent.DrawingObjects;
                    var PageLimits = this.Parent.Get_PageLimits(this.PageNum + CurPage);
                    var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);

                    var ColumnStartX = (0 === CurPage ? this.X_ColumnStart : this.Pages[CurPage].X);
                    var ColumnEndX   = (0 === CurPage ? this.X_ColumnEnd   : this.Pages[CurPage].XLimit);

                    var Top_Margin    = Y_Top_Margin;
                    var Bottom_Margin = Y_Bottom_Margin;
                    var Page_H        = Page_Height;

                    if ( true === this.Parent.Is_TableCellContent() && true == Item.Use_TextWrap() )
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

                    if ( true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape() )
                    {
                        Item.Update_Position( new CParagraphLayout(X, Y , this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y), PageLimits );
                        Item.Reset_SavedPosition();
                        bFirstLineItem = false;

                        X += Item.WidthVisible;
                        LastW = Item.WidthVisible;
                    }
                    else
                    {
                        // У нас Flow-объект. Если он с обтеканием, тогда мы останавливаем пересчет и
                        // запоминаем текущий объект. В функции Internal_Recalculate_2 пересчитываем
                        // его позицию и сообщаем ее внешнему классу.

                        if ( true === Item.Use_TextWrap() )
                        {
                            var LogicDocument = this.Parent;
                            var LDRecalcInfo  = this.Parent.RecalcInfo;
                            var Page_abs      = this.Get_StartPage_Absolute() + CurPage;

                            if ( true === LDRecalcInfo.Can_RecalcObject() )
                            {
                                // Обновляем позицию объекта
                                Item.Update_Position( new CParagraphLayout(X, Y , this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y), PageLimits);
                                LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement );
                                return recalcresult_CurPage;
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
                                else if ( true === this.Parent.Is_TableCellContent() )
                                {
                                    // Картинка не на нужной странице, но так как это таблица
                                    // мы не персчитываем заново текущую страницу, а не предыдущую

                                    // Обновляем позицию объекта
                                    Item.Update_Position( new CParagraphLayout(X, Y , this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y), PageLimits);

                                    LDRecalcInfo.Set_FlowObject( Item, 0, recalcresult_NextElement );
                                    LDRecalcInfo.Set_PageBreakBefore( false );
                                    return recalcresult_CurPage;
                                }
                                else
                                {
                                    LDRecalcInfo.Set_PageBreakBefore( true );
                                    DrawingObjects.removeById( Item.PageNum, Item.Get_Id() );
                                    return recalcresult_PrevPage;
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
                            Item.Update_Position( new CParagraphLayout(X, Y , this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y), PageLimits);
                            Item.Reset_SavedPosition();
                            continue;
                        }
                    }


                    break;
                }
                case para_PageNum:
                {
                    bFirstLineItem = false;
                    X += Item.WidthVisible;
                    LastW = Item.WidthVisible;

                    break;
                }
                case para_Tab:
                {
                    X += Item.WidthVisible;

                    break;
                }
                case para_TextPr:
                {
                    break;
                }
                case para_End:
                {
                    X += Item.Width;
                    break;
                }
                case para_NewLine:
                {
                    X += Item.WidthVisible;
                    break;
                }

                case para_CommentStart:
                {
                    var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;

                    var CommentId = Item.Id;
                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                    DocumentComments.Set_StartInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );

                    break;
                }

                case para_CommentEnd:
                {
                    var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;

                    var CommentId = Item.Id;
                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                    DocumentComments.Set_EndInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );
                    break;
                }
            }
        }

        return recalcresult_NextElement;
    },

    Recalculate_Range : function(ParaPr)
    {
        var PRS = g_oPRSW;

        var CurLine     = PRS.Line;
        var CurRange    = PRS.Range;
        var CurPage     = PRS.Page;
        var RangesCount = PRS.RangesCount;

        // Найдем начальную позицию данного отрезка
        var StartPos = 0;
        if ( 0 === CurLine && 0 === CurRange )
            StartPos = 0;
        else if ( CurRange > 0 )
            StartPos = this.Lines[CurLine].Ranges[CurRanges - 1].EndPos;
        else
            StartPos = this.Lines[CurLine - 1].Ranges[ this.Lines[CurLine - 1].Ranges.length - 1 ].EndPos;

        var Line = this.Lines[CurLine];
        var Range = Line.Ranges[CurRange];

        this.Lines[CurLine].Set_RangeStartPos( CurRange, StartPos );

        if ( 0 !== CurRange && 0 === CurLine && true === PRS.EmptyLine )
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
        var XEnd =  ( CurRange == RangesCount ? PRS.XLimit : PRS.Ranges[CurRange].X0 );

        // Обновляем состояние пересчета
        PRS.Reset_Range(X, XEnd);

        var ContentLen = this.Content.length;

        var Pos = StartPos;
        for ( ;Pos < ContentLen; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( ( 0 === Pos && 0 === CurLine ) || Pos !== StartPos )
            {
                Item.Recalculate_Reset( CurLine, ( 0 === Pos && 0 === CurLine ? null : this.Content[Pos - 1].Get_RecalcInfo() ) );
            }

            PRS.Update_CurPos( Pos, 0 );
            Item.Recalculate_Range(  ParaPr );

            if ( true === PRS.NewRange )
            {
                break;
            }
        }

        if ( Pos >= ContentLen )
            Pos = ContentLen;

        if ( recalcresult_NextLine === PRS.RecalcResult )
        {
            // У нас отрезок пересчитался нормально и тут возможны 2 варианта :
            // 1. Отрезок закончился в данной позиции
            // 2. Не все убралось в заданный отрезок и перенос нужно поставить в позиции PRS.LineBreakPos

            if ( true === PRS.MoveToLBP )
            {
                // Отмечаем, что в заданной позиции заканчивается отрезок
                this.Recalculate_Set_RangeEndPos( PRS, PRS.LineBreakPos, 0 );
            }
            else
                this.Lines[CurLine].Set_RangeEndPos( CurRange, Pos );
        }
    },

    Recalculate_Line : function(PRS, ParaPr)
    {
        var CurLine  = PRS.Line;
        var CurPage  = PRS.Page;
        var CurRange = 0;

        this.Lines.length = CurLine + 1;
        this.Lines[CurLine] = new CParaLine();

        // Проверим висячую строку
        if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Check_WidowControl(this, CurLine) )
        {
            this.Parent.RecalcInfo.Reset_WidowControl();

            this.Pages[CurPage].Set_EndLine( CurLine - 1 );
            if ( 0 === CurLine )
            {
                this.Lines[-1] = new CParaLine( 0 );
            }

            PRS.RecalcResult = recalcresult_NextPage;
            return;
        }

        // Параметры Ranges и RangesCount не обнуляются здесь, они задаются выше
        var Ranges      = PRS.Ranges;
        var RangesCount = PRS.RangesCount;

        // Обнуляем параметры PRS для строки
        PRS.Reset_Line();

        // Заполняем строку отрезками обтекания. Выставляем начальные сдвиги для отрезков. Начало промежутка = конец вырезаемого промежутка
        this.Lines[CurLine].Reset();
        this.Lines[CurLine].Add_Range( ( 0 == CurLine ? PRS.XStart + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : PRS.XStart + ParaPr.Ind.Left ), (RangesCount == 0 ? PRS.XLimit : Ranges[0].X0) );
        for ( var Index = 1; Index < Ranges.length + 1; Index++ )
        {
            this.Lines[CurLine].Add_Range( Ranges[Index - 1].X1, (RangesCount == Index ? PRS.XLimit : Ranges[Index].X0) );
        }

        while ( CurRange <= RangesCount )
        {
            PRS.Range = CurRange;
            this.Recalculate_Range( ParaPr );

            if ( true === PRS.ForceNewPage || true === PRS.NewPage )
                break;

            CurRange++;
        }

        //-------------------------------------------------------------------------------------------------------------
        // 1. Обновляем метрики данной строки
        //-------------------------------------------------------------------------------------------------------------

        // Строка пустая, у нее надо выставить ненулевую высоту. Делаем как Word, выставляем высоту по размеру
        // текста, на котором закончилась данная строка.
        if ( true === PRS.EmptyLine || PRS.LineAscent < 0.001 )
        {
            var LastItem = ( true === PRS.End ? this.Content[this.Content.length - 1] : this.Content[this.Lines[CurLine].EndPos] );

            if ( undefined !== LastItem )
            {
                if ( PRS.LineTextAscent < LastItem.TextAscent )
                    PRS.LineTextAscent = LastItem.TextAscent;

                if ( PRS.LineTextAscent2 < LastItem.TextAscent2 )
                    LineTextAscent2 = LastItem.TextAscent2;

                if ( PRS.LineTextDescent < LastItem.TextDescent )
                    PRS.LineTextDescent = LastItem.TextDescent;

                if ( PRS.LineAscent < LastItem.TextAscent )
                    PRS.LineAscent = LastItem.TextAscent;

                if ( PRS.LineDescent < LastItem.TextDescent )
                    PRS.LineDescent = LastItem.TextDescent;
            }
        }

        // Рассчитаем метрики строки
        this.Lines[CurLine].Metrics.Update( PRS.LineTextAscent, PRS.LineTextAscent2, PRS.LineTextDescent, PRS.LineAscent, PRS.LineDescent, ParaPr );

        //-------------------------------------------------------------------------------------------------------------
        // 2. Рассчитываем высоту строки, а также положение верхней и нижней границ
        //-------------------------------------------------------------------------------------------------------------

        // Рассчитаем высоту строки (заодно сохраним верх и низ)
        var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
        if ( 0 === this.Pages[CurPage].FirstLine && ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore ) )
            TempDy += ParaPr.Spacing.Before;

        if ( 0 === this.Pages[CurPage].FirstLine )
        {
            if ( ( true === ParaPr.Brd.First || 1 === CurPage ) && border_Single === ParaPr.Brd.Top.Value )
                TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            else if ( false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value )
                TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
        }

        var Top, Bottom;
        var Top2, Bottom2; // верх и низ без Pr.Spacing

        var LastPage_Bottom = this.Pages[CurPage].Bounds.Bottom;

        if ( true === this.Lines[CurLine].RangeY )
        {
            Top  = PRS.Y;
            Top2 = PRS.Y;

            if ( 0 === CurLine )
            {
                if ( 0 === CurPage || true === this.Parent.Is_TableCellContent() )
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
                    Top     = PRS.Y + TempDy + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
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

                if ( 0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore )
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

        Bottom = Bottom2 + this.Lines[CurLine].Metrics.LineGap;

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

            if ( false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After )
                Bottom = this.YLimit;
        }

        // Верхнюю границу мы сохраняем только для первой строки данной страницы
        if ( CurLine === this.Pages[CurPage].FirstLine && true !== this.Lines[CurLine].RangeY )
            this.Pages[CurPage].Bounds.Top = Top;

        this.Pages[CurPage].Bounds.Bottom = Bottom;

        this.Lines[CurLine].Top    = Top    - this.Pages[CurPage].Y;
        this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;

        //-------------------------------------------------------------------------------------------------------------
        // 3. Проверяем достигла ли данная строка конца страницы
        //-------------------------------------------------------------------------------------------------------------

        // Переносим строку по PageBreak. Если в строке ничего нет, кроме PageBreak, тогда нам не надо проверять высоту строки и обтекание.
        var bBreakPageLineEmpty = ( true === PRS.BreakPageLine && true === PRS.EmptyLine );

        // Сначала проверяем не нужно ли сделать перенос страницы в данном месте
        // Перенос не делаем, если это первая строка на новой странице
        if ( true === this.Use_YLimit() && (Top > this.YLimit || Bottom2 > this.YLimit ) && ( CurLine != this.Pages[CurPage].FirstLine || ( 0 === CurPage && ( null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent() ) ) ) && false === bBreakPageLineEmpty )
        {
            // Проверим висячую строку
            if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() &&
                true === ParaPr.WidowControl && CurLine - this.Pages[CurPage].StartLine <= 1 && CurLine >= 1 && true != PRS.BreakPageLine && ( 0 === CurPage && null != this.Get_DocumentPrev() ) )
            {
                // TODO: Здесь перенос нужно делать сразу же
                this.Parent.RecalcInfo.Set_WidowControl(this, CurLine - 1);
                PRS.RecalcResult = recalcresult_CurPage;
                return;
            }
            else
            {
                // Неразрывные абзацы не учитываются в таблицах
                if ( true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage )
                {
                    CurLine       = 0;
                    LineStart_Pos = 0;
                }

                // Восстанавливаем позицию нижней границы предыдущей страницы
                this.Pages[CurPage].Bounds.Bottom = LastPage_Bottom;
                this.Pages[CurPage].Set_EndLine( CurLine - 1 );

                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine(0);
                    this.Lines[-1].Set_EndPos( -1, this );
                }

                // Добавляем разрыв страницы
                PRS.RecalcResult = recalcresult_NextPage;
                return;
            }
        }

        //-------------------------------------------------------------------------------------------------------------
        // 4. Проверяем обтекание данной строки относитально плавающих объектов
        //-------------------------------------------------------------------------------------------------------------

        var Left   = ( 0 !== CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine );
        var Right  = this.XLimit - ParaPr.Ind.Right;

        var PageFields = this.Parent.Get_PageFields( this.PageNum + CurPage );
        var Ranges2;

        if ( true === this.Use_Wrap() )
            Ranges2 = this.Parent.CheckRange( Left, Top, Right, Bottom, Top2, Bottom2, PageFields.X, PageFields.XLimit, this.PageNum + CurPage, true );
        else
            Ranges2 = new Array();

        // Проверяем совпали ли промежутки. Если совпали, тогда данная строчка рассчитана верно, и мы переходим к
        // следующей, если нет, тогда заново рассчитываем данную строчку, но с новыми промежутками.
        // Заметим, что тут возможен случай, когда Ranges2 меньше, чем Ranges, такое может случится при повторном
        // обсчете строки. (После первого расчета мы выяснили что Ranges < Ranges2, при повторном обсчете строки, т.к.
        // она стала меньше, то у нее и рассчитанная высота могла уменьшиться, а значит Ranges2 могло оказаться
        // меньше чем Ranges). В таком случае не надо делать повторный пересчет, иначе будет зависание.
        if ( -1 == FlowObjects_CompareRanges( Ranges, Ranges2 ) && true === FlowObjects_CheckInjection( Ranges, Ranges2 ) && false === bBreakPageLineEmpty )
        {
            // Выставляем новые отрезки обтекания и сообщаем, что надо заново персчитать данную строку
            PRS.Ranges       = Ranges2;
            PRS.RangesCount  = Ranges2.length;
            PRS.RecalcResult = recalcresult_CurLine;
            return;
        }

        //-------------------------------------------------------------------------------------------------------------
        // 5. Выставляем вертикальное смещение данной строки
        //-------------------------------------------------------------------------------------------------------------
        if ( true === PRS.NewPage )
        {
            // Если это последний элемент параграфа, тогда нам не надо переносить текущий параграф
            // на новую страницу. Нам надо выставить границы так, чтобы следующий параграф начинался
            // с новой страницы.


            // Здесь проверяем специальный случай, когда у нас после PageBreak в параграфе ничего не идет кроме
            // плавающих объектов. В такой ситуации мы располагаем эти объекты на текущей странице.

            // TODO: Переделать тут (см DemoHyden v2)


//            var ____Pos = Pos + 1;
//            var Next = this.Internal_FindForward( ____Pos, [ para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum, para_Math ] );
//            while ( true === Next.Found && para_Drawing === Next.Type && drawing_Anchor === this.Content[Next.LetterPos].Get_DrawingType() )
//                Next = this.Internal_FindForward( ++____Pos, [ para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum, para_Math ] );
//
//            if ( true === Next.Found && para_End === Next.Type )
//            {
//                Item.Flags.NewLine = false;
//                bExtendBoundToBottom = true;
//                continue;
//            }


            if ( true === this.Lines[CurLine].RangeY )
            {
                this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
            }
            else
            {
                if ( CurLine > 0 )
                    this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                else
                    this.Lines[0].Y = 0;
            }

            this.Pages[CurPage].Set_EndLine( CurLine );
            PRS.RecalcResult = recalcresult_NextPage;
            return;
        }
        else
        {
            if ( true === this.Lines[CurLine].RangeY )
            {
                this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
            }
            else
            {
                if ( CurLine > 0 )
                {
                    // Первая линия на странице не должна двигаться
                    if ( CurLine != this.Pages[CurPage].FirstLine )
                        PRS.Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap +  this.Lines[CurLine].Metrics.Ascent;

                    this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
                }
                else
                    this.Lines[0].Y = 0;
            }
        }

        //-------------------------------------------------------------------------------------------------------------
        // 6. Последние проверки
        //-------------------------------------------------------------------------------------------------------------
        if ( true !== PRS.End )
        {
            // Если строка пустая в следствии того, что у нас было обтекание, тогда мы не добавляем новую строку,
            // а просто текущую смещаем ниже.
            if ( true === PRS.EmptyLine && RangesCount > 0 )
            {
                // Найдем верхнюю точку объектов обтекания (т.е. так чтобы при новом обсчете не учитывался только
                // этот объект, заканчивающийся выше всех)

                var RangesMaxY = Ranges[0].Y1;
                for ( var Index = 1; Index < Ranges.length; Index++ )
                {
                    if ( RangesMaxY > Ranges[Index].Y1 )
                        RangesMaxY = Ranges[Index].Y1;
                }

                if ( Math.abs(RangesMaxY - Y) < 0.001  )
                    PRS.Y = RangesMaxY + 1; // смещаемся по 1мм
                else
                    PRS.Y = RangesMaxY + 0.001; // Добавляем 0.001, чтобы избавиться от погрешности

                // Пересчитываем заново данную строку
                PRS.RecalcResult = recalcresult_CurLine;
                return;
            }

            if ( true === PRS.ForceNewPage )
            {
                this.Pages[CurPage].Set_EndLine( CurLine - 1 );

                if ( 0 === CurLine )
                {
                    this.Lines[-1] = new CParaLine();
                    this.Lines[-1].Set_EndPos( LineStart_Pos - 1, this );
                }

                PRS.RecalcResult = recalcresult_NextPage;
                return;
            }
        }
        else
        {
            // В последней строке могут быть заполнены не все отрезки обтекания
            for ( var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++ )
                this.Lines[CurLine].Set_RangeStartPos( TempRange, Pos );

            //this.Lines[CurLine].Set_EndPos( Pos, this );

            // Проверим висячую строку
            if ( true === ParaPr.WidowControl && CurLine === this.Pages[CurPage].StartLine && CurLine >= 1 )
            {
                // Проверим не встречается ли в предыдущей строке BreakPage, если да, тогда не учитываем WidowControl
                var bBreakPagePrevLine = false;
                var StartPos = (CurLine == 2 ? this.Lines[CurLine - 2].StartPos : this.Lines[CurLine - 1].StartPos );
                var EndPos   = this.Lines[CurLine - 1].EndPos;

                // TODO: Сделать проверку наличия PageBreak в предыдущей строке
                /*
                 for ( var TempPos = StartPos; TempPos <= EndPos; TempPos++ )
                 {
                 var TempItem = this.Content[TempPos];
                 if ( para_NewLine === TempItem.Type && break_Page === TempItem.BreakType )
                 {
                 bBreakPagePrevLine = true;
                 break;
                 }
                 }
                 */

                if ( this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() && false === bBreakPagePrevLine && ( 1 === CurPage && null != this.Get_DocumentPrev() ) && this.Lines[CurLine - 1].Ranges.length <= 1 )
                {
                    this.Parent.RecalcInfo.Set_WidowControl(this, ( CurLine > 2 ? CurLine - 1 : 0 ) ); // Если у нас в параграфе 3 строки, тогда сразу начинаем параграф с новой строки
                    PRS.RecalcResult = recalcresult_PrevPage;
                    return;
                }
            }

            // Специальный случай с PageBreak, когда после самого PageBreak ничего нет в параграфе
            if ( true === PRS.ExtendBoundToBottom )
            {
                this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;

                // TODO: Переделать тут

                // Если у нас нумерация относится к знаку конца параграфа, тогда в такой
                // ситуации не рисуем нумерацию у такого параграфа.
                //if ( Pos === this.Numbering.Pos )
                //    this.Numbering.Pos = -1;
            }

            this.Pages[CurPage].Set_EndLine( CurLine );

            PRS.RecalcResult = recalcresult_NextElement;
        }
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
        var CurLine  = PRS.Line;
        var CurRange = PRS.Range;
        var CurPos   = PRP.Get(Depth);

        // Сначала выставляем конечную позицию у внутреннего класса и только потом у текущего,
        // потому что на выставлении конечной позиции последнего отрезка происходит пересчет пробелов и слов.

        this.Content[CurPos].Recalculate_Set_RangeEndPos(PRS, PRP, Depth + 1);
        this.Lines[CurLine].Set_RangeEndPos( CurRange, CurPos );
    },

    Recalculate_Lines_Width : function(CurPage)
    {
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine   = this.Pages[CurPage].EndLine;

        var PRSC = g_oPRSC;

        for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
        {
            var Line = this.Lines[CurLine];
            var RangesCount = Line.Ranges.length;

            for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = Line.Ranges[CurRange];
                var StartPos = Range.StartPos;
                var EndPos   = Range.EndPos;

                PRSC.Reset( this, Range );

                if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
                    PRSC.Range.W += this.Numbering.WidthVisible;

                for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                {
                    var Item = this.Content[Pos];
                    Item.Recalculate_Range_Width( PRSC, CurLine, CurRange );
                }
            }
        }
    },

    Recalculate_Lines_Align : function(PRSW, CurPage, ParaPr)
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

        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine   = this.Pages[CurPage].EndLine;
        var LinesCount = this.Lines.length;

        var PRSA = g_oPRSA;
        PRSA.Paragraph = this;
        PRSA.LastW     = 0;

        for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
        {
            var Line = this.Lines[CurLine];
            var RangesCount = Line.Ranges.length;

            for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = Line.Ranges[CurRange];

                var JustifyWord  = 0;
                var JustifySpace = 0;
                var RangeWidth   = Range.XEnd - Range.X;

                // RangeWidth - ширина всего пространства в данном отрезке, а Range.W - ширина занимаемого пространства

                var X = 0;
                switch (ParaPr.Jc)
                {
                    case align_Left :
                    {
                        X = Range.X;
                        break;
                    }
                    case align_Right:
                    {
                        X = Math.max(Range.X +  RangeWidth - Range.W, Range.X);
                        break;
                    }
                    case align_Center:
                    {
                        X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X);
                        break;
                    }
                    case align_Justify:
                    {
                        X = Range.X;

                        if ( 1 == Range.Words )
                        {
                            if ( 1 == RangesCount && this.Lines.length > 1 )
                            {
                                // Либо слово целиком занимает строку, либо не целиком, но разница очень мала
                                if ( RangeWidth - Range.W <= 0.05 * RangeWidth && Range.Letters > 1 )
                                    JustifyWord = (RangeWidth -  Range.W) / (Range.Letters - 1);
                            }
                            else if ( 0 == CurRange || ( CurLine == this.Lines.length - 1 && CurRange == RangesCount - 1 ) )
                            {
                                // Ничего не делаем (выравниваем текст по левой границе)
                            }
                            else if ( CurRange == RangesCount - 1 )
                            {
                                X = Range.X +  RangeWidth - Range.W;
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
                            if ( Range.Spaces > 0 && ( CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1 ) )
                                JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
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

                PRSA.X = X;
                PRSA.Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                PRSA.JustifyWord   = JustifyWord;
                PRSA.JustifySpace  = JustifySpace;
                PRSA.SpacesCounter = Range.Spaces;
                PRSA.SpacesSkip    = Range.SpacesSkip;
                PRSA.LettersSkip   = Range.LettersSkip;
                PRSA.RecalcResult  = recalcresult_NextElement;

                this.Lines[CurLine].Ranges[CurRange].XVisible = X;

                if ( 0 === CurRange )
                    this.Lines[CurLine].X = X - PRSW.XStart;

                var StartPos = Range.StartPos;
                var EndPos   = Range.EndPos;

                if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
                    PRSA.X += this.Numbering.WidthVisible;

                for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                {
                    var Item = this.Content[Pos];
                    Item.Recalculate_Range_Spaces(PRSA, CurLine, CurRange, CurPage);

                    if ( recalcresult_NextElement !== PRSA.RecalcResult )
                        return PRSA.RecalcResult;
                }
            }
        }

        return recalcresult_NextElement;
    },

    // Пересчитываем заданную позицию элемента или текущую позицию курсора.
    Internal_Recalculate_CurPos : function(Pos, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( this.Lines.length <= 0 )
                return { X : 0, Y : 0, Height : 0, Internal : { Line : 0, Page : 0, Range : 0 } };

            var LinePos = this.Internal_Get_ParaPos_By_Pos( Pos );

            var CurLine  = LinePos.Line;
            var CurRange = LinePos.Range;
            var CurPage  = LinePos.Page;

            if ( Pos === this.CurPos.ContentPos && -1 != this.CurPos.Line )
                CurLine = this.CurPos.Line;

            var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

            if ( Pos < this.Lines[CurLine].Ranges[CurRange].StartPos )
            {
                // Если так случилось, что у нас заданная позиция идет до позиции с нумерацией, к которой привязана нумерация,
                // тогда добавляем ширину нумерации.

                var _X = X;
                if ( Pos < this.Numbering.Pos )
                    _X += this.Numbering.WidthVisible;

                if ( true === UpdateCurPos)
                    this.Internal_UpdateCurPos( _X, Y, Pos, CurLine, CurPage, UpdateTarget );

                if ( true === ReturnTarget )
                    return { X : _X, Y : Y, Height : 0, Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
                else
                    return { X : _X, Y : Y, PageNum : CurPage + this.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
            }

            for ( var ItemNum = this.Lines[CurLine].Ranges[CurRange].StartPos; ItemNum < this.Content.length; ItemNum++ )
            {
                var Item = this.Content[ItemNum];

                if ( ItemNum === this.Numbering.Pos )
                    X += this.Numbering.WidthVisible;

                if ( Pos === ItemNum )
                {
                    // Если так случилось, что у нас заданная позиция идет до позиции с нумерацией, к которой привязана нумерация,
                    // тогда добавляем ширину нумерации.

                    var _X = X;
                    if ( ItemNum < this.Numbering.Pos )
                        _X += this.Numbering.WidthVisible;

                    if ( true === UpdateCurPos)
                        this.Internal_UpdateCurPos( _X, Y, ItemNum, CurLine, CurPage, UpdateTarget );

                    if ( true === ReturnTarget )
                    {
                        var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
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

                        return { X : _X, Y : TargetY, Height : Height, Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
                    }
                    else
                        return { X : _X, Y : Y, PageNum : CurPage + this.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
                }

                switch( Item.Type )
                {
                    case para_Text:
                    case para_Space:
                    case para_PageNum:
                    case para_Tab:
                    case para_TextPr:
                    case para_End:
                    case para_NewLine:
                    case para_Math:
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

            if ( true === ReturnTarget )
                return { X : X, Y : TargetY, Height : Height, Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
            else
                return { X : X, Y : Y, PageNum : CurPage + this.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
        }
        else
        {
            if ( this.Lines.length <= 0 )
                return { X : 0, Y : 0, Height : 0, Internal : { Line : 0, Page : 0, Range : 0 } };

            var LinePos = this.Get_CurrentParaPos();

            var CurLine  = LinePos.Line;
            var CurRange = LinePos.Range;
            var CurPage  = LinePos.Page;

            // Если в текущей позиции явно указана строка
            if ( -1 != this.CurPos.Line )
            {
                CurLine  = this.CurPos.Line;
                CurRange = this.CurPos.Range;
            }

            var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

            var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
            var EndPos   = this.Lines[CurLine].Ranges[CurRange].EndPos;

            if ( true === this.Numbering.Check_Range( CurRange, CurLine ) )
                X += this.Numbering.WidthVisible;

            for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
            {
                var Item = this.Content[CurPos];
                var Res = Item.Recalculate_CurPos( X, Y, (CurPos === this.CurPos.ContentPos ? true : false), CurRange, CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget );

                if ( CurPos === this.CurPos.ContentPos )
                    return Res;
                else
                    X = Res.X;
            }

            return { X : X, Y : Y, PageNum : CurPage + this.Get_StartPage_Absolute(), Internal : { Line : CurLine, Page : CurPage, Range : CurRange } };
        }
    },

    Internal_UpdateCurPos : function(X, Y, CurPos, CurLine, CurPage, UpdateTarget)
    {
        this.CurPos.X        = X;
        this.CurPos.Y        = Y;
        this.CurPos.PagesPos = CurPage;

        if ( true === UpdateTarget )
        {
            var CurTextPr = this.Internal_CalculateTextPr(CurPos);
            g_oTextMeasurer.SetTextPr( CurTextPr );
            g_oTextMeasurer.SetFontSlot( fontslot_ASCII, CurTextPr.Get_FontKoef() );
            var Height    = g_oTextMeasurer.GetHeight();
            var Descender = Math.abs( g_oTextMeasurer.GetDescender() );
            var Ascender  = Height - Descender;

            this.DrawingDocument.SetTargetSize( Height );

            if ( true === CurTextPr.Color.Auto )
            {
                // Выясним какая заливка у нашего текста
                var Pr = this.Get_CompiledPr();
                var BgColor = undefined;
                if ( undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value )
                {
                    BgColor = Pr.ParaPr.Shd.Color;
                }
                else
                {
                    // Нам надо выяснить заливку у родительского класса (возможно мы находимся в ячейке таблицы с забивкой)
                    BgColor = this.Parent.Get_TextBackGroundColor();
                }

                // Определим автоцвет относительно заливки
                var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );
                this.DrawingDocument.SetTargetColor( AutoColor.r, AutoColor.g, AutoColor.b );
            }
            else
                this.DrawingDocument.SetTargetColor( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b );

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

            var Page_Abs = this.Get_StartPage_Absolute() + CurPage;
            this.DrawingDocument.UpdateTarget( X, TargetY, Page_Abs );

            // TODO: Тут делаем, чтобы курсор не выходил за границы буквицы. На самом деле, надо делать, чтобы
            //       курсор не выходил за границы строки, но для этого надо делать обрезку по строкам, а без нее
            //       такой вариант будет смотреться плохо.
            if ( undefined != this.Get_FramePr() )
            {
                var __Y0 = TargetY, __Y1 = TargetY + Height;
                var ___Y0 = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                var ___Y1 = this.Pages[CurPage].Y + this.Lines[CurLine].Bottom;

                var __Y0 = Math.max( __Y0, ___Y0 );
                var __Y1 = Math.min( __Y1, ___Y1 );

                this.DrawingDocument.SetTargetSize( __Y1 - __Y0 );
                this.DrawingDocument.UpdateTarget( X, __Y0, Page_Abs );
            }
        }
    },

    // Нужно ли добавлять нумерацию в начале данной строки
    Internal_CheckAddNumbering : function(CurPage, CurLine, CurRange)
    {
        var StartLine = this.Pages[CurPage].StartLine;

        var bRes = false;
        if ( CurLine != StartLine )
            bRes = false;
        else
        {
            if ( CurPage > 1 )
                bRes = false;
            else
            {
                var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
                bRes = true;
                // Проверим, есть ли какие-нибудь реальные элементы (к которым можно было бы
                // дорисовать нумерацию) до стартовой позиции текущей страницы

                for ( var Pos = 0; Pos < StartPos; Pos++ )
                {
                    var Item = this.Content[Pos];
                    if ( true === Item.Can_AddNumbering() )
                    {
                        bRes = false;
                        break;
                    }
                }
            }
        }

        if ( true === bRes )
            this.Numbering.Pos = -1;

        return bRes;
    },

    // Можно ли объединить границы двух параграфов с заданными настройками Pr1, Pr2
    Internal_CompareBrd : function(Pr1, Pr2)
    {
        // Сначала сравним правую и левую границы параграфов
        var Left_1  = Math.min( Pr1.Ind.Left, Pr1.Ind.Left + Pr1.Ind.FirstLine );
        var Right_1 = Pr1.Ind.Right;
        var Left_2  = Math.min( Pr2.Ind.Left, Pr2.Ind.Left + Pr2.Ind.FirstLine );
        var Right_2 = Pr2.Ind.Right;

        if ( Math.abs( Left_1 - Left_2 ) > 0.001 || Math.abs( Right_1 - Right_2 ) > 0.001 )
            return false;

        if ( false === Pr1.Brd.Top.Compare( Pr2.Brd.Top )   || false === Pr1.Brd.Bottom.Compare( Pr2.Brd.Bottom ) ||
             false === Pr1.Brd.Left.Compare( Pr2.Brd.Left ) || false === Pr1.Brd.Right.Compare( Pr2.Brd.Right )   ||
             false === Pr1.Brd.Between.Compare( Pr2.Brd.Between ) )
            return false;

        return true;
    },

    Internal_GetTabPos : function(X, ParaPr, CurPage)
    {
        var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );
        if ( undefined != this.Get_FramePr() )
            PageStart.X = 0;

        // Если у данного параграфа есть табы, тогда ищем среди них
        var TabsCount = ParaPr.Tabs.Get_Count();

        // Добавим в качестве таба левую границу
        var TabsPos = new Array();
        var bCheckLeft = true;
        for ( var Index = 0; Index < TabsCount; Index++ )
        {
            var Tab = ParaPr.Tabs.Get(Index);
            var TabPos = Tab.Pos + PageStart.X;

            if ( true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left )
            {
                TabsPos.push( new CParaTab(tab_Left, ParaPr.Ind.Left) );
                bCheckLeft = false;
            }

            if ( tab_Clear != Tab.Value )
                TabsPos.push( Tab );
        }

        if ( true === bCheckLeft )
            TabsPos.push( new CParaTab(tab_Left, ParaPr.Ind.Left) );

        TabsCount = TabsPos.length;

        var Tab = null;
        for ( var Index = 0; Index < TabsCount; Index++ )
        {
            var TempTab = TabsPos[Index];

            if ( X < TempTab.Pos + PageStart.X )
            {
                Tab = TempTab;
                break;
            }
        }

        var NewX = 0;

        // Если табов нет, либо их позиции левее текущей позиции ставим таб по умолчанию
        if ( null === Tab )
        {
            if ( X < PageStart.X + ParaPr.Ind.Left )
                NewX = PageStart.X + ParaPr.Ind.Left;
            else
            {
                NewX = PageStart.X;
                while ( X >= NewX - 0.001 )
                    NewX += Default_Tab_Stop;
            }
        }
        else
        {
            NewX = Tab.Pos + PageStart.X;
        }

        return { NewX : NewX, TabValue : ( null === Tab ? tab_Left : Tab.Value ) };
    },

    // Проверяем не пустые ли границы
    Internal_Is_NullBorders : function (Borders)
    {
        if ( border_None != Borders.Top.Value  || border_None != Borders.Bottom.Value ||
             border_None != Borders.Left.Value || border_None != Borders.Right.Value  ||
             border_None != Borders.Between.Value )
            return false;

        return true;
    },

    Internal_Check_Ranges : function(CurLine, CurRange)
    {
        var Ranges = this.Lines[CurLine].Ranges;
        var RangesCount = Ranges.length;

        if ( RangesCount <= 1 )
            return true;
        else if ( 2 === RangesCount )
        {
            var Range0 = Ranges[0];
            var Range1 = Ranges[1];

            if ( Range0.XEnd - Range0.X < 0.001 && 1 === CurRange && Range1.XEnd - Range1.X >= 0.001 )
                return true;
            else if ( Range1.XEnd - Range1.X < 0.001 && 0 === CurRange && Range0.XEnd - Range0.X >= 0.001 )
                return true;
            else
                return false
        }
        else if ( 3 === RangesCount && 1 === CurRange )
        {
            var Range0 = Ranges[0];
            var Range2 = Ranges[2];

            if ( Range0.XEnd - Range0.X < 0.001 && Range2.XEnd - Range2.X < 0.001 )
                return true;
            else
                return false;
        }
        else
            return false;
    },

    Internal_Get_NumberingTextPr : function()
    {
        var Pr     = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var NumPr  = ParaPr.NumPr;

        if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
            return new CTextPr();

        var Numbering = this.Parent.Get_Numbering();
        var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
        var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
        NumTextPr.Merge( this.TextPr.Value );
        NumTextPr.Merge( NumLvl.TextPr );

        NumTextPr.FontFamily.Name = NumTextPr.RFonts.Ascii.Name;

        return NumTextPr;
    },

    Internal_Get_ClearPos : function(Pos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            // TODO: Переделать. Надо ускорить. При пересчете параграфа запоминать
            // все позиции элементов para_NewLineRendered, para_InlineBreak, para_PageBreakRendered,
            // para_FlowObjectAnchor, para_CollaborativeChangesEnd, para_CollaborativeChangesStart

            var Counter = 0;
            for ( var Index = 0; Index < Math.min(Pos, this.Content.length - 1); Index++ )
            {
                if ( false === this.Content[Index].Is_RealContent() || para_Numbering === this.Content[Index].Type )
                    Counter++;
            }
            return Pos - Counter;
        }
        else
            return 0;
    },

    Internal_Get_RealPos : function(Pos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            // TODO: Переделать. Надо ускорить. При пересчете параграфа запоминать
            // все позиции элементов para_NewLineRendered, para_InlineBreak, para_PageBreakRendered,
            // para_FlowObjectAnchor, para_CollaborativeChangesEnd, para_CollaborativeChangesStart

            var Counter = Pos;
            for ( var Index = 0; Index <= Math.min(Counter, this.Content.length - 1); Index++ )
            {
                if ( false === this.Content[Index].Is_RealContent() || para_Numbering === this.Content[Index].Type )
                    Counter++;
            }

            return Counter;
        }
        else
            return 0;
    },

    Internal_Get_ClearContentLength : function()
    {
        var Len = this.Content.length;
        var ClearLen = Len;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Item = this.Content[Index];
            if ( false === Item.Is_RealContent() )
                ClearLen--;
        }

        return ClearLen;
    },

    Recalculate_Fast : function(SimpleChanges)
    {
        var Run = SimpleChanges[0].Class;

        var StartLine  = Run.StartLine;
        var StartRange = Run.StartRange;

        var StartPos = this.Lines[StartLine].Ranges[StartRange].StartPos;
        var EndPos   = this.Lines[StartLine].Ranges[StartRange].EndPos;

        var RunPos = -1;

        for ( RunPos = StartPos; RunPos <= EndPos; RunPos++ )
        {
            // TODO: переделать данную проверку, т.к. Run может быть вложенным
            if ( this.Content[RunPos] === Run )
                break;
        }

        // Не нашли нужный Run
        if ( RunPos > EndPos )
            return -1;

        var ParaPos = Run.Get_SimpleChanges_ParaPos(SimpleChanges);

        var Line  = ParaPos.Line;
        var Range = ParaPos.Range;

        // Мы должны пересчитать как минимум 3 отрезка: текущий, предыдущий и следующий, потому что при удалении элемента
        // или добавлении пробела первое слово в данном отрезке может убраться в предыдущем отрезке, и кроме того при
        // удалении возможен вариант, когда мы неправильно определили отрезок (т.е. более ранний взяли)

        if ( Range > 0 || Line > 0 )
        {
            var PrevLine  = Line;
            var PrevRange = 0;

            if ( Range > 0 )
                PrevRange = Range - 1;
            else
            {
                PrevLine  = Line - 1;
                PrevRange = this.Lines[PrevLine].Ranges.length - 1;
            }

            if ( -1 === this.Recalculate_Fast_Range(PrevLine, PrevRange) )
                return -1;
        }

        var Result = this.Recalculate_Fast_Range( Line, Range );
        if ( -1 === Result )
            return -1;

        if ( Range < this.Lines[Line].Ranges.length - 1 || Line < this.Lines.length - 1 )
        {
            var NextLine  = Line;
            var NextRange = 0;

            if ( Range < this.Lines[Line].Ranges.length - 1 )
                NextRange = Range + 1;
            else
            {
                NextLine  = Line + 1;
                NextRange = 0;
            }

            if ( -1 === this.Recalculate_Fast_Range(NextLine, NextRange) )
                return -1;
        }


        // Во время пересчета сбрасываем привязку курсора к строке.
        this.CurPos.Line = -1;

        return Result;
    },

    Recalculate_Fast_Range : function(_Line, _Range)
    {
        var PRS = g_oPRSW;

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
            return false;

        if ( 0 === CurPage )//|| ( undefined != this.Get_FramePr() && this.Parent instanceof CDocument ) )
        {
            XStart = this.X;
            YStart = this.Y;
            XLimit = this.XLimit;
            YLimit = this.YLimit;
        }
        else
        {
            var PageStart = this.Parent.Get_PageContentStartPos( this.PageNum + CurPage );

            XStart = PageStart.X;
            YStart = PageStart.Y;
            XLimit = PageStart.XLimit;
            YLimit = PageStart.YLimit;
        }

        PRS.XStart = XStart;
        PRS.YStart = YStart;
        PRS.XLimit = XLimit;
        PRS.YLimit = YLimit;

        // Обнуляем параметры PRS для строки и отрезка
        PRS.Reset_Line();

        PRS.Page  = 0;
        PRS.Line  = _Line;
        PRS.Range = _Range;


        PRS.Paragraph = this;

        var RangesCount = PRS.RangesCount;

        var Line  = this.Lines[CurLine];
        var Range = Line.Ranges[CurRange];

        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        // Обновляем состояние пересчета
        PRS.Reset_Range(Range.X, Range.XEnd);

        var ContentLen = this.Content.length;

        var ParaPr = this.Get_CompiledPr2( false).ParaPr;
        for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
        {
            var Item = this.Content[Pos];

            // TODO: разобраться с нумерацией
            PRS.Update_CurPos( Pos, 0 );

            var SL = Item.Save_Lines();
            var SavedLines = SL.Lines;

            Item.Recalculate_Range( ParaPr );

            if ( ( true === PRS.NewRange && Pos !== EndPos ) || ( Pos === EndPos && true !== PRS.NewRange ) )
                return -1;
            else if ( Pos === EndPos && true === PRS.NewRange && true === PRS.MoveToLBP )
            {
                Item.Recalculate_Set_RangeEndPos(PRS, PRS.LineBreakPos, 1);
            }


            // Нам нужно проверить только строку с номером CurLine
            if ( false === SavedLines[CurLine - Item.StartLine].Compare( Item.Lines[CurLine - Item.StartLine] ) )
                return -1;

            Item.Restore_Lines( SL );
        }

        // Recalculate_Lines_Width
        var PRSC = g_oPRSC;

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

        var RecalcResultAlign = this.Recalculate_Lines_Align(PRS, CurPage, ParaPr);

        if ( recalcresult_NextElement !== RecalcResultAlign )
            return -1;

        return this.Get_StartPage_Absolute() + CurPage;
    },

    Start_FromNewPage : function()
    {
        this.Pages.length = 1;

        // Добавляем разрыв страницы
        this.Pages[0].Set_EndLine( - 1 );
        this.Lines[-1] = new CParaLine(0);
        this.Lines[-1].Set_EndPos( - 1, this );
    },

    Reset_RecalculateCache : function()
    {

    },

    Recalculate_Page : function(_PageIndex)
    {
        if ( true !== Debug_ParaRunMode )
        {
            // Сбрасываем массив NearPos
            this.NearPosArray = new Array();

            // Во время пересчета сбрасываем привязку курсора к строке.
            this.CurPos.Line = -1;

            var PageIndex = _PageIndex - this.PageNum;

            var CurPage, StartPos, CurLine;
            if ( 0 === PageIndex )
            {
                CurPage  = 0;
                StartPos = 0;
                CurLine  = 0;
            }
            else
            {
                CurPage  = PageIndex;

                if ( CurPage > 0 )
                    CurLine  = this.Pages[CurPage - 1].EndLine + 1;
                else
                    CurLine = 0;

                if ( CurLine > 0 )
                    StartPos = this.Lines[CurLine - 1].EndPos  + 1;
                else
                    StartPos = 0;
            }

            // Если параграф начинается с новой страницы, и у самого параграфа нет настройки начать с новой страницы
            if ( 1 === CurPage && this.Pages[0].EndLine < 0 && this.Parent instanceof CDocument && false === this.Get_CompiledPr2(false).ParaPr.PageBreakBefore )
            {
                // Если у предыдущего параграфа стоит настройка "не отрывать от следующего".
                // И сам параграф не разбит на несколько страниц и не начинается с новой страницы,
                // тогда мы должны пересчитать предыдущую страницу, с учетом того, что предыдущий параграф
                // надо начать с новой страницы.
                var Curr = this.Get_DocumentPrev();
                while ( null != Curr && type_Paragraph === Curr.GetType() )
                {
                    var CurrKeepNext = Curr.Get_CompiledPr2(false).ParaPr.KeepNext;
                    if ( (true === CurrKeepNext && Curr.Pages.length > 1) || false === CurrKeepNext )
                    {
                        break;
                    }
                    else
                    {
                        var Prev = Curr.Get_DocumentPrev();
                        if ( null === Prev || type_Paragraph != Prev.GetType() )
                            break;

                        var PrevKeepNext = Prev.Get_CompiledPr2(false).ParaPr.KeepNext;
                        if ( false === PrevKeepNext )
                        {
                            if ( true === this.Parent.RecalcInfo.Can_RecalcObject() )
                            {
                                this.Parent.RecalcInfo.Set_KeepNext(Curr);
                                return recalcresult_PrevPage;
                            }
                            else
                                break;
                        }
                        else
                            Curr = Prev;
                    }
                }
            }

            // Пересчет параграфа:
            //  1. Сначала рассчитаем новые переносы строк, при этом подсчитав количество
            //     слов и пробелов между словами.
            //  2. Далее, в зависимости от прилегания(align) параграфа, проставим начальные
            //     позиции строк и проставим видимые размеры пробелов.

            this.FontMap.NeedRecalc = true;

            this.Internal_Recalculate_0();
            this.Internal_CheckSpelling();

            var RecalcResult_1 = this.Internal_Recalculate_1_(StartPos, CurPage, CurLine);
            var RecalcResult_2 = this.Internal_Recalculate_2_(StartPos, CurPage, CurLine);

            if ( true === this.Parent.RecalcInfo.WidowControlReset )
                this.Parent.RecalcInfo.Reset();

            var RecalcResult = ( recalcresult_NextElement != RecalcResult_2 ? RecalcResult_2 : RecalcResult_1 );

            return RecalcResult;
        }
        else
        {
            // Во время пересчета сбрасываем привязку курсора к строке.
            this.CurPos.Line = -1;

            var CurPage = _PageIndex - this.PageNum;
            var RecalcResult = this.Recalculate_Page__( CurPage );

            if ( true === this.Parent.RecalcInfo.WidowControlReset )
                this.Parent.RecalcInfo.Reset();

            return RecalcResult;
        }
    },

    Is_SimpleChanges : function(DataArray)
    {
        return false;
    },

    RecalculateCurPos : function()
    {
        if ( true !== Debug_ParaRunMode )
        {
            var Pos = this.CurPos.ContentPos2;
            if ( undefined !== this.Content[Pos] && para_Math === this.Content[Pos].Type )
                return this.Content[Pos].RecalculateCurPos();

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, true, false );
        }
        else
        {
            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, true, false );
        }
    },

    Recalculate_MinMaxContentWidth : function()
    {
        // Пересчитаем ширины всех элементов
        this.Internal_Recalculate_0();

        var bWord     = false;
        var nWordLen  = 0;
        var nSpaceLen = 0;
        var nMinWidth = 0;
        var nMaxWidth = 0;

        var nCurMaxWidth = 0;

        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];

            // TODO: Продумать здесь учет нумерации

            switch( Item.Type )
            {
                case para_Math:
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

        // добавляем 0.001, чтобы избавиться от погрешностей
        return { Min : ( nMinWidth > 0 ?  nMinWidth + 0.001 : 0 ), Max : ( nMaxWidth > 0 ?  nMaxWidth + 0.001 : 0 ) };
    },

    Draw : function(PageNum, pGraphics)
    {
        var CurPage = PageNum - this.PageNum;

        // Параграф начинается с новой страницы
        if ( this.Pages[CurPage].EndLine < 0 )
            return;

        var Pr = this.Get_CompiledPr();

        // Задаем обрезку, если данный параграф является рамкой
        var FramePr = this.Get_FramePr();
        if ( undefined != FramePr && this.Parent instanceof CDocument )
        {
            var PixelError = editor.WordControl.m_oLogicDocument.DrawingDocument.GetMMPerDot(1);
            var BoundsL = this.CalculatedFrame.L2 - PixelError;
            var BoundsT = this.CalculatedFrame.T2 - PixelError;
            var BoundsH = this.CalculatedFrame.H2 + 2 * PixelError;
            var BoundsW = this.CalculatedFrame.W2 + 2 * PixelError;

            pGraphics.SaveGrState();
            pGraphics.AddClipRect( BoundsL, BoundsT, BoundsW, BoundsH );
        }

        // Выясним какая заливка у нашего текста
        var BgColor = undefined;
        if ( undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value )
        {
            BgColor = Pr.ParaPr.Shd.Color;
        }
        else
        {
            // Нам надо выяснить заливку у родительского класса (возможно мы находимся в ячейке таблицы с забивкой)
            BgColor = this.Parent.Get_TextBackGroundColor();
        }

        // Определим автоцвет относительно заливки
        var AutoColor = ( undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor( 255, 255, 255, false ) : new CDocumentColor( 0, 0, 0, false ) );

        // 1 часть отрисовки :
        //    Рисуем слева от параграфа знак, если данный параграф зажат другим пользователем
        this.Internal_Draw_1( CurPage, pGraphics, Pr );

        // 2 часть отрисовки :
        //    Добавляем специальный символ слева от параграфа, для параграфов, у которых стоит хотя бы
        //    одна из настроек: не разрывать абзац(KeepLines), не отрывать от следующего(KeepNext),
        //    начать с новой страницы(PageBreakBefore)
        this.Internal_Draw_2( CurPage, pGraphics, Pr );

        // 3 часть отрисовки :
        //    Рисуем заливку параграфа и различные выделения текста (highlight, поиск, совместное редактирование).
        //    Кроме этого рисуем боковые линии обводки параграфа.
        this.Internal_Draw_3( CurPage, pGraphics, Pr );

        // 4 часть отрисовки :
        //    Рисуем сами элементы параграфа
        this.Internal_Draw_4( CurPage, pGraphics, Pr, AutoColor );

        // 5 часть отрисовки :
        //    Рисуем различные подчеркивания и зачеркивания.
        this.Internal_Draw_5( CurPage, pGraphics, Pr, AutoColor );

        // 6 часть отрисовки :
        //    Рисуем верхнюю, нижнюю и промежуточную границы
        this.Internal_Draw_6( CurPage, pGraphics, Pr );

        // Убираем обрезку
        if ( undefined != FramePr && this.Parent instanceof CDocument  )
        {
            pGraphics.RestoreGrState();
        }
    },

    Internal_Draw_1 : function(CurPage, pGraphics, Pr)
    {
        // Если данный параграф зажат другим пользователем, рисуем соответствующий знак
		if(this.bFromDocument)
		{
			if ( locktype_None != this.Lock.Get_Type() )
			{
				if ( ( CurPage > 0 || false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() ) )
				{
					var X_min = -1 + Math.min( this.Pages[CurPage].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
					var Y_top = this.Pages[CurPage].Bounds.Top;
					var Y_bottom = this.Pages[CurPage].Bounds.Bottom;

					if ( true === editor.isCoMarksDraw || locktype_Mine != this.Lock.Get_Type() )
						pGraphics.DrawLockParagraph(this.Lock.Get_Type(), X_min, Y_top, Y_bottom);
				}
			}
		}
    },

    Internal_Draw_2 : function(CurPage, pGraphics, Pr)
    {
        if ( this.bFromDocument && true === editor.ShowParaMarks && ( ( 0 === CurPage && ( this.Pages.length <= 1 || this.Pages[1].FirstLine > 0 ) ) || ( 1 === CurPage && this.Pages.length > 1 && this.Pages[1].FirstLine === 0 ) ) && ( true === Pr.ParaPr.KeepNext || true === Pr.ParaPr.KeepLines || true === Pr.ParaPr.PageBreakBefore ) )
        {
            var SpecFont = { FontFamily: { Name : "Arial", Index : -1 }, FontSize : 12, Italic : false, Bold : false };
            var SpecSym = String.fromCharCode( 0x25AA );
            pGraphics.SetFont( SpecFont );
            pGraphics.b_color1( 0, 0, 0, 255 );

            var CurLine  = this.Pages[CurPage].FirstLine;
            var CurRange = 0;
            var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

            var SpecW = 2.5; // 2.5 mm
            var SpecX = Math.min( X, this.X ) - SpecW;

            pGraphics.FillText( SpecX, Y, SpecSym );
        }
    },

    Internal_Draw_3 : function(CurPage, pGraphics, Pr)
    {
		if(!this.bFromDocument)
			return;
        if ( true !== Debug_ParaRunMode )
        {
            var _Page = this.Pages[CurPage];

            var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
            var bDrawComments    = ( DocumentComments.Is_Use() && true != editor.isViewMode);
            var CommentsFlag     = DocumentComments.Check_CurrentDraw();

            var CollaborativeChanges = 0;
            var StartPagePos = this.Lines[_Page.StartLine].StartPos;
            var DrawSearch = editor.WordControl.m_oLogicDocument.SearchEngine.Selection;

            // в PDF не рисуем метки совместного редактирования
            if ( undefined === pGraphics.RENDERER_PDF_FLAG  )
            {
                var Pos = 0;
                while ( Pos < StartPagePos )
                {
                    Item = this.Content[Pos];
                    if ( para_CollaborativeChangesEnd == Item.Type )
                        CollaborativeChanges--;
                    else if ( para_CollaborativeChangesStart == Item.Type )
                        CollaborativeChanges++;

                    Pos++;
                }
            }

            var CurTextPr = _Page.TextPr;

            var StartLine = _Page.StartLine;
            var EndLine   = _Page.EndLine;

            var aHigh = new CParaDrawingRangeLines();
            var aColl = new CParaDrawingRangeLines();
            var aFind = new CParaDrawingRangeLines();
            var aComm = new CParaDrawingRangeLines();

            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var _Line        = this.Lines[CurLine];
                var _LineMetrics = _Line.Metrics;

                var EndLinePos = _Line.EndPos;

                var Y0 = (_Page.Y + _Line.Y - _LineMetrics.Ascent);
                var Y1 = (_Page.Y + _Line.Y + _LineMetrics.Descent);
                if ( _LineMetrics.LineGap < 0 )
                    Y1 += _LineMetrics.LineGap;

                var RangesCount = _Line.Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var _Range = _Line.Ranges[CurRange];

                    aHigh.Clear();
                    aColl.Clear();
                    aFind.Clear();
                    aComm.Clear();

                    // Сначала проанализируем данную строку: в массивы aHigh, aColl, aFind
                    // сохраним позиции начала и конца продолжительных одинаковых настроек
                    // выделения, совместного редатирования и поиска соответственно.

                    var X = _Range.XVisible;

                    var StartPos = _Range.StartPos;
                    var EndPos   = ( CurRange === RangesCount - 1 ? EndLinePos : _Line.Ranges[CurRange + 1].StartPos - 1 );

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        var Item = this.Content[Pos];

                        var bSearchResult = false;
                        if ( true === DrawSearch )
                        {
                            for ( var SId in this.SearchResults )
                            {
                                var SResult = this.SearchResults[SId];
                                if ( Pos >= SResult.StartPos && Pos < SResult.EndPos )
                                {
                                    bSearchResult = true;
                                    break;
                                }
                            }
                        }

                        if ( Pos === this.Numbering.Pos )
                        {
                            var NumberingType = this.Numbering.Type;
                            var NumberingItem = this.Numbering;
                            if ( para_Numbering === NumberingType )
                            {
                                var NumPr = Pr.ParaPr.NumPr;
                                if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                                    break;

                                var Numbering = this.Parent.Get_Numbering();
                                var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                                var NumJc     = NumLvl.Jc;
                                var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                                NumTextPr.Merge( this.TextPr.Value );
                                NumTextPr.Merge( NumLvl.TextPr );

                                var X_start = X;

                                if ( align_Right === NumJc )
                                    X_start = X - NumberingItem.WidthNum;
                                else if ( align_Center === NumJc )
                                    X_start = X - NumberingItem.WidthNum / 2;

                                // Если есть выделение текста, рисуем его сначала
                                if ( highlight_None != NumTextPr.HighLight )
                                    aHigh.Add( Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, NumTextPr.HighLight.r, NumTextPr.HighLight.g, NumTextPr.HighLight.b );

                                if ( CollaborativeChanges > 0 )
                                    aColl.Add( Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, 0, 0, 0 );

                                X += NumberingItem.WidthVisible;
                            }
                            else if ( para_PresentationNumbering === NumberingType )
                            {
                                X += NumberingItem.WidthVisible;
                            }
                        }

                        switch( Item.Type )
                        {
                            case para_PageNum:
                            case para_Drawing:
                            case para_Tab:
                            case para_Text:
                            case para_Math:
                            {
                                if ( para_Drawing === Item.Type && drawing_Anchor === Item.DrawingType )
                                    break;

                                if ( CommentsFlag != comments_NoComment && true === bDrawComments )
                                    aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                                else if ( highlight_None != CurTextPr.HighLight )
                                    aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, CurTextPr.HighLight.r, CurTextPr.HighLight.g, CurTextPr.HighLight.b );

                                if ( true === bSearchResult )
                                    aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                                else if ( CollaborativeChanges > 0 )
                                    aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                                if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                                    X += Item.WidthVisible;

                                break;
                            }
                            case para_Space:
                            {
                                // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
                                if ( Pos >= _Range.StartPos2 && Pos <= _Range.EndPos2 )
                                {
                                    if ( CommentsFlag != comments_NoComment && bDrawComments )
                                        aComm.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, { Active : CommentsFlag === comments_ActiveComment ? true : false } );
                                    else if ( highlight_None != CurTextPr.HighLight )
                                        aHigh.Add( Y0, Y1, X, X + Item.WidthVisible, 0, CurTextPr.HighLight.r, CurTextPr.HighLight.g, CurTextPr.HighLight.b );
                                }

                                if ( true === bSearchResult )
                                    aFind.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );
                                else if ( CollaborativeChanges > 0 )
                                    aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                                X += Item.WidthVisible;

                                break;
                            }
                            case para_TextPr:
                            {
                                CurTextPr = Item.CalcValue;
                                break;
                            }
                            case para_End:
                            {
                                if ( CollaborativeChanges > 0 )
                                    aColl.Add( Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0  );

                                X += Item.Width;
                                break;
                            }
                            case para_NewLine:
                            {
                                X += Item.WidthVisible;
                                break;
                            }
                            case para_CollaborativeChangesStart:
                            {
                                CollaborativeChanges++;
                                break;
                            }

                            case para_CollaborativeChangesEnd:
                            {
                                CollaborativeChanges--;
                                break;
                            }

                            case para_CommentStart:
                            {
                                if ( undefined === pGraphics.RENDERER_PDF_FLAG )
                                {
                                    var CommentId = Item.Id;
                                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                                    DocumentComments.Set_StartInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );
                                    DocumentComments.Add_CurrentDraw( CommentId );
                                    CommentsFlag = DocumentComments.Check_CurrentDraw();
                                }
                                break;
                            }

                            case para_CommentEnd:
                            {
                                if ( undefined === pGraphics.RENDERER_PDF_FLAG )
                                {
                                    var CommentId = Item.Id;
                                    var CommentY  = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                                    var CommentH  = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                                    DocumentComments.Set_EndInfo( CommentId, this.Get_StartPage_Absolute() + CurPage, X, CommentY, CommentH, this.Id );
                                    DocumentComments.Remove_CurrentDraw( CommentId );
                                    CommentsFlag = DocumentComments.Check_CurrentDraw();
                                }
                                break;
                            }
                        }
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Заливка параграфа
                    //----------------------------------------------------------------------------------------------------------
                    if ( (_Range.W > 0.001 || true === this.IsEmpty() ) && ( ( this.Pages.length - 1 === CurPage ) || ( CurLine < this.Pages[CurPage + 1].FirstLine ) ) && shd_Clear === Pr.ParaPr.Shd.Value )
                    {
                        var TempX0 = this.Lines[CurLine].Ranges[CurRange].X;
                        if ( 0 === CurRange )
                            TempX0 = Math.min( TempX0, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );

                        var TempX1 = this.Lines[CurLine].Ranges[CurRange].XEnd;

                        var TempTop    = this.Lines[CurLine].Top;
                        var TempBottom = this.Lines[CurLine].Bottom;

                        if ( 0 === CurLine )
                        {
                            // Закрашиваем фон до параграфа, только если данный параграф не является первым
                            // на странице, предыдущий параграф тоже имеет не пустой фон и у текущего и предыдущего
                            // параграфов совпадают правая и левая границы фонов.

                            var PrevEl = this.Get_DocumentPrev();
                            var PrevPr = null;

                            var PrevLeft  = 0;
                            var PrevRight = 0;
                            var CurLeft  = Math.min( Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                            var CurRight = Pr.ParaPr.Ind.Right;
                            if ( null != PrevEl && type_Paragraph === PrevEl.GetType() )
                            {
                                PrevPr    = PrevEl.Get_CompiledPr2();
                                PrevLeft  = Math.min( PrevPr.ParaPr.Ind.Left, PrevPr.ParaPr.Ind.Left + PrevPr.ParaPr.Ind.FirstLine );
                                PrevRight = PrevPr.ParaPr.Ind.Right;
                            }

                            // Если данный параграф находится в группе параграфов с одинаковыми границами(с хотябы одной
                            // непустой), и он не первый, тогда закрашиваем вместе с расстоянием до параграфа
                            if ( true === Pr.ParaPr.Brd.First )
                            {
                                // Если следующий элемент таблица, тогда PrevPr = null
                                if ( null === PrevEl || true === this.Is_StartFromNewPage() || null === PrevPr || shd_Nil === PrevPr.ParaPr.Shd.Value || PrevLeft != CurLeft || CurRight != PrevRight || false === this.Internal_Is_NullBorders(PrevPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) )
                                {
                                    if ( false === this.Is_StartFromNewPage() || null === PrevEl )
                                        TempTop += Pr.ParaPr.Spacing.Before;
                                }
                            }
                        }

                        if ( this.Lines.length - 1 === CurLine )
                        {
                            // Закрашиваем фон после параграфа, только если данный параграф не является последним,
                            // на странице, следующий параграф тоже имеет не пустой фон и у текущего и следующего
                            // параграфов совпадают правая и левая границы фонов.

                            var NextEl = this.Get_DocumentNext();
                            var NextPr = null;

                            var NextLeft  = 0;
                            var NextRight = 0;
                            var CurLeft  = Math.min( Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                            var CurRight = Pr.ParaPr.Ind.Right;
                            if ( null != NextEl && type_Paragraph === NextEl.GetType() )
                            {
                                NextPr    = NextEl.Get_CompiledPr2();
                                NextLeft  = Math.min( NextPr.ParaPr.Ind.Left, NextPr.ParaPr.Ind.Left + NextPr.ParaPr.Ind.FirstLine );
                                NextRight = NextPr.ParaPr.Ind.Right;
                            }

                            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
                            {
                                TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            }
                            // Если данный параграф находится в группе параграфов с одинаковыми границами(с хотябы одной
                            // непустой), и он не последний, тогда закрашиваем вместе с расстоянием после параграфа
                            else if ( true === Pr.ParaPr.Brd.Last )
                            {
                                // Если следующий элемент таблица, тогда NextPr = null
                                if ( null === NextEl || true === NextEl.Is_StartFromNewPage() || null === NextPr || shd_Nil === NextPr.ParaPr.Shd.Value || NextLeft != CurLeft || CurRight != NextRight || false === this.Internal_Is_NullBorders(NextPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) )
                                    TempBottom -= Pr.ParaPr.Spacing.After;
                            }
                        }

                        if ( 0 === CurRange )
                        {
                            if ( Pr.ParaPr.Brd.Left.Value === border_Single )
                                TempX0 -= 1 + Pr.ParaPr.Brd.Left.Size + Pr.ParaPr.Brd.Left.Space;
                            else
                                TempX0 -= 1;
                        }

                        if ( this.Lines[CurLine].Ranges.length - 1 === CurRange )
                        {
                            if ( Pr.ParaPr.Brd.Right.Value === border_Single )
                                TempX1 += 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space;
                            else
                                TempX1 += 1;
                        }

                        pGraphics.b_color1( Pr.ParaPr.Shd.Color.r, Pr.ParaPr.Shd.Color.g, Pr.ParaPr.Shd.Color.b, 255 );
                        pGraphics.rect(TempX0, this.Pages[CurPage].Y + TempTop, TempX1 - TempX0, TempBottom - TempTop);
                        pGraphics.df();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение текста
                    //----------------------------------------------------------------------------------------------------------
                    var Element = aHigh.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.b_color1( Element.r, Element.g, Element.b, 255 );
                        pGraphics.rect( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        pGraphics.df();
                        Element = aHigh.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем комментарии
                    //----------------------------------------------------------------------------------------------------------
                    Element = aComm.Get_Next();
                    while ( null != Element )
                    {
                        if ( Element.Additional.Active === true )
                            pGraphics.b_color1( 240, 200, 120, 255 );
                        else
                            pGraphics.b_color1( 248, 231, 195, 255 );

                        pGraphics.rect( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        pGraphics.df();
                        Element = aComm.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение совместного редактирования
                    //----------------------------------------------------------------------------------------------------------
                    Element = aColl.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.drawCollaborativeChanges( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        Element = aColl.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение поиска
                    //----------------------------------------------------------------------------------------------------------
                    Element = aFind.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.drawSearchResult( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        Element = aFind.Get_Next();
                    }
                }

                //----------------------------------------------------------------------------------------------------------
                // Рисуем боковые линии границы параграфа
                //----------------------------------------------------------------------------------------------------------
                if ( ( this.Pages.length - 1 === CurPage ) || ( CurLine < this.Pages[CurPage + 1].FirstLine ) )
                {
                    var TempX0 = Math.min( this.Lines[CurLine].Ranges[0].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                    var TempX1 = this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].XEnd;

                    if ( true === this.Is_LineDropCap() )
                    {
                        TempX1 = TempX0 + this.Get_LineDropCapWidth();
                    }

                    var TempTop    = this.Lines[CurLine].Top;
                    var TempBottom = this.Lines[CurLine].Bottom;

                    if ( 0 === CurLine )
                    {
                        if ( true === Pr.ParaPr.Brd.First && ( Pr.ParaPr.Brd.Top.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value ) )
                        {
                            if ( false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() )
                                TempTop += Pr.ParaPr.Spacing.Before;
                        }
                    }

                    if ( this.Lines.length - 1 === CurLine )
                    {
                        var NextEl = this.Get_DocumentNext();
                        if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
                            TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        else if ( true === Pr.ParaPr.Brd.Last &&  ( Pr.ParaPr.Brd.Bottom.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value ) )
                            TempBottom -= Pr.ParaPr.Spacing.After;
                    }


                    if ( Pr.ParaPr.Brd.Right.Value === border_Single )
                    {
                        pGraphics.p_color( Pr.ParaPr.Brd.Right.Color.r, Pr.ParaPr.Brd.Right.Color.g, Pr.ParaPr.Brd.Right.Color.b, 255 );
                        pGraphics.drawVerLine( c_oAscLineDrawingRule.Right, TempX1 + 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Right.Size );
                    }

                    if ( Pr.ParaPr.Brd.Left.Value === border_Single )
                    {
                        pGraphics.p_color( Pr.ParaPr.Brd.Left.Color.r, Pr.ParaPr.Brd.Left.Color.g, Pr.ParaPr.Brd.Left.Color.b, 255 );
                        pGraphics.drawVerLine( c_oAscLineDrawingRule.Left, TempX0 - 1 - Pr.ParaPr.Brd.Left.Size - Pr.ParaPr.Brd.Left.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Left.Size );
                    }
                }

            }
        }
        else
        {
            var PDSH = g_oPDSH;

            var _Page = this.Pages[CurPage];

            var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
            var CommentsFlag     = DocumentComments.Check_CurrentDraw();

            var DrawComm = ( DocumentComments.Is_Use() && true != editor.isViewMode);
            var DrawFind = editor.WordControl.m_oLogicDocument.SearchEngine.Selection;
            var DrawColl = ( undefined === pGraphics.RENDERER_PDF_FLAG ? false : true );

            PDSH.Reset( this, pGraphics, DrawColl, DrawFind, DrawComm, CommentsFlag );

            var StartLine = _Page.StartLine;
            var EndLine   = _Page.EndLine;

            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var _Line        = this.Lines[CurLine];
                var _LineMetrics = _Line.Metrics;

                var EndLinePos = _Line.EndPos;

                var Y0 = (_Page.Y + _Line.Y - _LineMetrics.Ascent);
                var Y1 = (_Page.Y + _Line.Y + _LineMetrics.Descent);
                if ( _LineMetrics.LineGap < 0 )
                    Y1 += _LineMetrics.LineGap;

                var RangesCount = _Line.Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var _Range   = _Line.Ranges[CurRange];
                    var X        = _Range.XVisible;
                    var StartPos = _Range.StartPos;
                    var EndPos   = _Range.EndPos;

                    // Сначала проанализируем данную строку: в массивы aHigh, aColl, aFind
                    // сохраним позиции начала и конца продолжительных одинаковых настроек
                    // выделения, совместного редактирования и поиска соответственно.

                    PDSH.Reset_Range( CurPage, CurLine, CurRange, X, Y0, Y1, _Range.SpacesSkip + _Range.Spaces );

                    if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
                    {
                        var NumberingType = this.Numbering.Type;
                        var NumberingItem = this.Numbering;

                        if ( para_Numbering === NumberingType )
                        {
                            var NumPr = Pr.ParaPr.NumPr;
                            if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                            {
                                // Ничего не делаем
                            }
                            else
                            {
                                var Numbering = this.Parent.Get_Numbering();
                                var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                                var NumJc     = NumLvl.Jc;
                                var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                                NumTextPr.Merge( this.TextPr.Value );
                                NumTextPr.Merge( NumLvl.TextPr );

                                var X_start = X;

                                if ( align_Right === NumJc )
                                    X_start = X - NumberingItem.WidthNum;
                                else if ( align_Center === NumJc )
                                    X_start = X - NumberingItem.WidthNum / 2;

                                // Если есть выделение текста, рисуем его сначала
                                if ( highlight_None != NumTextPr.HighLight )
                                    PDSH.High.Add( Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, NumTextPr.HighLight.r, NumTextPr.HighLight.g, NumTextPr.HighLight.b );
                            }
                        }

                        PDSH.X += this.Numbering.WidthVisible;
                    }

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        var Item = this.Content[Pos];
                        Item.Draw_HighLights( PDSH );
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Заливка параграфа
                    //----------------------------------------------------------------------------------------------------------
                    if ( (_Range.W > 0.001 || true === this.IsEmpty() ) && ( ( this.Pages.length - 1 === CurPage ) || ( CurLine < this.Pages[CurPage + 1].FirstLine ) ) && shd_Clear === Pr.ParaPr.Shd.Value )
                    {
                        var TempX0 = this.Lines[CurLine].Ranges[CurRange].X;
                        if ( 0 === CurRange )
                            TempX0 = Math.min( TempX0, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );

                        var TempX1 = this.Lines[CurLine].Ranges[CurRange].XEnd;

                        var TempTop    = this.Lines[CurLine].Top;
                        var TempBottom = this.Lines[CurLine].Bottom;

                        if ( 0 === CurLine )
                        {
                            // Закрашиваем фон до параграфа, только если данный параграф не является первым
                            // на странице, предыдущий параграф тоже имеет не пустой фон и у текущего и предыдущего
                            // параграфов совпадают правая и левая границы фонов.

                            var PrevEl = this.Get_DocumentPrev();
                            var PrevPr = null;

                            var PrevLeft  = 0;
                            var PrevRight = 0;
                            var CurLeft  = Math.min( Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                            var CurRight = Pr.ParaPr.Ind.Right;
                            if ( null != PrevEl && type_Paragraph === PrevEl.GetType() )
                            {
                                PrevPr    = PrevEl.Get_CompiledPr2();
                                PrevLeft  = Math.min( PrevPr.ParaPr.Ind.Left, PrevPr.ParaPr.Ind.Left + PrevPr.ParaPr.Ind.FirstLine );
                                PrevRight = PrevPr.ParaPr.Ind.Right;
                            }

                            // Если данный параграф находится в группе параграфов с одинаковыми границами(с хотябы одной
                            // непустой), и он не первый, тогда закрашиваем вместе с расстоянием до параграфа
                            if ( true === Pr.ParaPr.Brd.First )
                            {
                                // Если следующий элемент таблица, тогда PrevPr = null
                                if ( null === PrevEl || true === this.Is_StartFromNewPage() || null === PrevPr || shd_Nil === PrevPr.ParaPr.Shd.Value || PrevLeft != CurLeft || CurRight != PrevRight || false === this.Internal_Is_NullBorders(PrevPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) )
                                {
                                    if ( false === this.Is_StartFromNewPage() || null === PrevEl )
                                        TempTop += Pr.ParaPr.Spacing.Before;
                                }
                            }
                        }

                        if ( this.Lines.length - 1 === CurLine )
                        {
                            // Закрашиваем фон после параграфа, только если данный параграф не является последним,
                            // на странице, следующий параграф тоже имеет не пустой фон и у текущего и следующего
                            // параграфов совпадают правая и левая границы фонов.

                            var NextEl = this.Get_DocumentNext();
                            var NextPr = null;

                            var NextLeft  = 0;
                            var NextRight = 0;
                            var CurLeft  = Math.min( Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
                            var CurRight = Pr.ParaPr.Ind.Right;
                            if ( null != NextEl && type_Paragraph === NextEl.GetType() )
                            {
                                NextPr    = NextEl.Get_CompiledPr2();
                                NextLeft  = Math.min( NextPr.ParaPr.Ind.Left, NextPr.ParaPr.Ind.Left + NextPr.ParaPr.Ind.FirstLine );
                                NextRight = NextPr.ParaPr.Ind.Right;
                            }

                            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
                            {
                                TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            }
                            // Если данный параграф находится в группе параграфов с одинаковыми границами(с хотябы одной
                            // непустой), и он не последний, тогда закрашиваем вместе с расстоянием после параграфа
                            else if ( true === Pr.ParaPr.Brd.Last )
                            {
                                // Если следующий элемент таблица, тогда NextPr = null
                                if ( null === NextEl || true === NextEl.Is_StartFromNewPage() || null === NextPr || shd_Nil === NextPr.ParaPr.Shd.Value || NextLeft != CurLeft || CurRight != NextRight || false === this.Internal_Is_NullBorders(NextPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) )
                                    TempBottom -= Pr.ParaPr.Spacing.After;
                            }
                        }

                        if ( 0 === CurRange )
                        {
                            if ( Pr.ParaPr.Brd.Left.Value === border_Single )
                                TempX0 -= 1 + Pr.ParaPr.Brd.Left.Size + Pr.ParaPr.Brd.Left.Space;
                            else
                                TempX0 -= 1;
                        }

                        if ( this.Lines[CurLine].Ranges.length - 1 === CurRange )
                        {
                            if ( Pr.ParaPr.Brd.Right.Value === border_Single )
                                TempX1 += 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space;
                            else
                                TempX1 += 1;
                        }

                        pGraphics.b_color1( Pr.ParaPr.Shd.Color.r, Pr.ParaPr.Shd.Color.g, Pr.ParaPr.Shd.Color.b, 255 );
                        pGraphics.rect(TempX0, this.Pages[CurPage].Y + TempTop, TempX1 - TempX0, TempBottom - TempTop);
                        pGraphics.df();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение текста
                    //----------------------------------------------------------------------------------------------------------
                    var aHigh = PDSH.High;
                    var Element = aHigh.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.b_color1( Element.r, Element.g, Element.b, 255 );
                        pGraphics.rect( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        pGraphics.df();
                        Element = aHigh.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем комментарии
                    //----------------------------------------------------------------------------------------------------------
                    var aComm = PDSH.High;
                    Element = aComm.Get_Next();
                    while ( null != Element )
                    {
                        if ( Element.Additional.Active === true )
                            pGraphics.b_color1( 240, 200, 120, 255 );
                        else
                            pGraphics.b_color1( 248, 231, 195, 255 );

                        pGraphics.rect( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        pGraphics.df();
                        Element = aComm.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение совместного редактирования
                    //----------------------------------------------------------------------------------------------------------
                    var aColl = PDSH.High;
                    Element = aColl.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.drawCollaborativeChanges( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        Element = aColl.Get_Next();
                    }

                    //----------------------------------------------------------------------------------------------------------
                    // Рисуем выделение поиска
                    //----------------------------------------------------------------------------------------------------------
                    var aFind = PDSH.High;
                    Element = aFind.Get_Next();
                    while ( null != Element )
                    {
                        pGraphics.drawSearchResult( Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0 );
                        Element = aFind.Get_Next();
                    }
                }

                //----------------------------------------------------------------------------------------------------------
                // Рисуем боковые линии границы параграфа
                //----------------------------------------------------------------------------------------------------------
                if ( ( this.Pages.length - 1 === CurPage ) || ( CurLine < this.Pages[CurPage + 1].FirstLine ) )
                {
                    var TempX0 = Math.min( this.Lines[CurLine].Ranges[0].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                    var TempX1 = this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].XEnd;

                    if ( true === this.Is_LineDropCap() )
                    {
                        TempX1 = TempX0 + this.Get_LineDropCapWidth();
                    }

                    var TempTop    = this.Lines[CurLine].Top;
                    var TempBottom = this.Lines[CurLine].Bottom;

                    if ( 0 === CurLine )
                    {
                        if ( true === Pr.ParaPr.Brd.First && ( Pr.ParaPr.Brd.Top.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value ) )
                        {
                            if ( false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() )
                                TempTop += Pr.ParaPr.Spacing.Before;
                        }
                    }

                    if ( this.Lines.length - 1 === CurLine )
                    {
                        var NextEl = this.Get_DocumentNext();
                        if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
                            TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        else if ( true === Pr.ParaPr.Brd.Last &&  ( Pr.ParaPr.Brd.Bottom.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value ) )
                            TempBottom -= Pr.ParaPr.Spacing.After;
                    }


                    if ( Pr.ParaPr.Brd.Right.Value === border_Single )
                    {
                        pGraphics.p_color( Pr.ParaPr.Brd.Right.Color.r, Pr.ParaPr.Brd.Right.Color.g, Pr.ParaPr.Brd.Right.Color.b, 255 );
                        pGraphics.drawVerLine( c_oAscLineDrawingRule.Right, TempX1 + 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Right.Size );
                    }

                    if ( Pr.ParaPr.Brd.Left.Value === border_Single )
                    {
                        pGraphics.p_color( Pr.ParaPr.Brd.Left.Color.r, Pr.ParaPr.Brd.Left.Color.g, Pr.ParaPr.Brd.Left.Color.b, 255 );
                        pGraphics.drawVerLine( c_oAscLineDrawingRule.Left, TempX0 - 1 - Pr.ParaPr.Brd.Left.Size - Pr.ParaPr.Brd.Left.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Left.Size );
                    }
                }

            }
        }
    },

    Internal_Draw_4 : function(CurPage, pGraphics, Pr, AutoColor)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var StartPagePos = this.Lines[this.Pages[CurPage].StartLine].StartPos;

            var HyperPos = this.Internal_FindBackward( StartPagePos, [para_HyperlinkStart, para_HyperlinkEnd] );
            var bVisitedHyperlink = false;

            if ( true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type )
                bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();

            var CurTextPr = this.Pages[CurPage].TextPr;

            // Выставляем шрифт и заливку текста
            pGraphics.SetTextPr( CurTextPr );

            if ( true === bVisitedHyperlink )
                pGraphics.b_color1( 128, 0, 151, 255 );
            else if ( true === CurTextPr.Color.Auto )
                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
            else
                pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

            var StartLine = this.Pages[CurPage].StartLine;
            var EndLine   = this.Pages[CurPage].EndLine;

            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var StartPos = this.Lines[CurLine].StartPos;
                var EndPos   = this.Lines[CurLine].EndPos;

                var bFirstLineItem = true;
                var CurRange = 0;
                var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                var X = this.Lines[CurLine].Ranges[CurRange].XVisible;

                var bEnd = false;

                for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                {
                    var Item = this.Content[Pos];

                    // Отслеживаем изменение позиции (отрезок)
                    // Изменении страницы и строки не отслеживаем
                    if ( undefined != Item.CurRange )
                    {
                        if ( Item.CurRange > CurRange )
                        {
                            CurRange = Item.CurRange;
                            X        = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        }
                    }

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

                    if ( Pos === this.Numbering.Pos )
                    {
                        var NumberingItem = this.Numbering;
                        if ( para_Numbering === this.Numbering.Type )
                        {
                            var NumPr = Pr.ParaPr.NumPr;
                            if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                                break;

                            var Numbering = this.Parent.Get_Numbering();
                            var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                            var NumSuff   = NumLvl.Suff;
                            var NumJc     = NumLvl.Jc;
                            var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();

                            // Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
                            // символа параграфа.

                            var TextPr_temp = this.TextPr.Value.Copy();
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

                            // Восстановим настройки
                            pGraphics.SetTextPr( CurTextPr );
                            if ( true === bVisitedHyperlink )
                                pGraphics.b_color1( 128, 0, 151, 255 );
                            else if ( true === CurTextPr.Color.Auto )
                                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        }
                        else if ( para_PresentationNumbering === this.Numbering.Type )
                        {
                            if ( true != this.IsEmpty() )
                            {
                                // Найдем настройки для первого текстового элемента
                                var FirstTextPr = this.Internal_CalculateTextPr( this.Internal_GetStartPos() );

                                if ( Pr.ParaPr.Ind.FirstLine < 0 )
                                    NumberingItem.Draw( X, Y, pGraphics, FirstTextPr );
                                else
                                    NumberingItem.Draw( this.X + Pr.ParaPr.Ind.Left, Y, pGraphics, FirstTextPr );
                            }

                            X += NumberingItem.WidthVisible;
                        }
                    }

                    switch( Item.Type )
                    {
                        case para_PageNum:
                        case para_Drawing:
                        case para_Tab:
                        case para_Text:
                        case para_Math:
                        {
                            if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                            {
                                bFirstLineItem = false;

                                if ( para_PageNum != Item.Type )
                                    Item.Draw( X, Y - Item.YOffset, pGraphics );
                                else
                                    Item.Draw( X, Y - Item.YOffset, pGraphics, this.Get_StartPage_Absolute() + CurPage, Pr.ParaPr.Jc );

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
                            Item.Draw( X, Y - Item.YOffset, pGraphics );

                            X += Item.WidthVisible;

                            break;
                        }
                        case para_TextPr:
                        {
                            CurTextPr = Item.CalcValue;//this.Internal_CalculateTextPr( Pos );
                            pGraphics.SetTextPr( CurTextPr );

                            if ( true === bVisitedHyperlink )
                                pGraphics.b_color1( 128, 0, 151, 255 );
                            else if ( true === CurTextPr.Color.Auto )
                                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                            break;
                        }
                        case para_End:
                        {
                            // Выставляем настройки для символа параграфа
                            var EndTextPr = Item.TextPr;

                            pGraphics.SetTextPr( EndTextPr );

                            if ( true === EndTextPr.Color.Auto )
                                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.b_color1( EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);

                            bEnd = true;
                            var bEndCell = false;
                            if ( null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent() )
                                bEndCell = true;

                            Item.Draw( X, Y - Item.YOffset, pGraphics, bEndCell );
                            X += Item.Width;
                            break;
                        }
                        case para_NewLine:
                        {
                            Item.Draw( X, Y - Item.YOffset, pGraphics );
                            X += Item.WidthVisible;
                            break;
                        }

                        case para_HyperlinkStart:
                        {
                            bVisitedHyperlink = Item.Get_Visited();

                            if ( true === bVisitedHyperlink )
                                pGraphics.b_color1( 128, 0, 151, 255 );
                            else if ( true === CurTextPr.Color.Auto )
                                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                            break;
                        }
                        case para_HyperlinkEnd:
                        {
                            bVisitedHyperlink = false;

                            if ( true === CurTextPr.Color.Auto )
                                pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
                            else
                                pGraphics.b_color1( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                            break;
                        }
                    }

                    Y = TempY;
                }
            }
        }
        else
        {
            var PDSE = g_oPDSE;
            PDSE.Reset( this, pGraphics, AutoColor );

            var StartLine = this.Pages[CurPage].StartLine;
            var EndLine   = this.Pages[CurPage].EndLine;

            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var Line = this.Lines[CurLine];
                var RangesCount = Line.Ranges.length;

                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                    var X = this.Lines[CurLine].Ranges[CurRange].XVisible;

                    var Range = Line.Ranges[CurRange];

                    PDSE.Reset_Range( CurPage, CurLine, CurRange, X, Y );

                    var StartPos = Range.StartPos;
                    var EndPos   = Range.EndPos;

                    // Отрисовка нумерации
                    if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
                    {
                        var NumberingItem = this.Numbering;
                        if ( para_Numbering === NumberingItem.Type )
                        {
                            var NumPr = Pr.ParaPr.NumPr;
                            if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                            {
                                // Ничего не делаем
                            }
                            else
                            {
                                var Numbering = this.Parent.Get_Numbering();
                                var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
                                var NumSuff   = NumLvl.Suff;
                                var NumJc     = NumLvl.Jc;
                                var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();

                                // Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
                                // символа параграфа.

                                var TextPr_temp = this.TextPr.Value.Copy();
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
                            }
                        }
                        else if ( para_PresentationNumbering === this.Numbering.Type )
                        {
                            if ( true != this.IsEmpty() )
                            {
                                if ( Pr.ParaPr.Ind.FirstLine < 0 )
                                    NumberingItem.Draw( X, Y, pGraphics, CurTextPr );
                                else
                                    NumberingItem.Draw( this.X + Pr.ParaPr.Ind.Left, Y, pGraphics, CurTextPr );
                            }
                        }

                        PDSE.X += NumberingItem.WidthVisible;
                    }

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        var Item = this.Content[Pos];
                        PDSE.CurPos.Update( Pos, 0 );

                        Item.Draw_Elements( PDSE );
                    }
                }
            }
        }
    },

    Internal_Draw_5 : function(CurPage, pGraphics, Pr, AutoColor)
    {
        if ( true !== Debug_ParaRunMode )
        {

            var _Page = this.Pages[CurPage];
            var StartPagePos = this.Lines[_Page.StartLine].StartPos;

            var HyperPos = this.Internal_FindBackward( StartPagePos, [para_HyperlinkStart, para_HyperlinkEnd] );
            var bVisitedHyperlink = false;

            if ( true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type )
                bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();

            var CurTextPr = _Page.TextPr;

            // Выставляем цвет обводки
            var CurColor;
            if ( true === bVisitedHyperlink )
                CurColor = new CDocumentColor( 128, 0, 151 );
            else if ( true === CurTextPr.Color.Auto )
                CurColor = new CDocumentColor( AutoColor.r, AutoColor.g, AutoColor.b );
            else
                CurColor = new CDocumentColor( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b );

            var StartLine = _Page.StartLine;
            var EndLine   = _Page.EndLine;

            var CheckSpelling = this.SpellChecker.Get_DrawingInfo();

            var aStrikeout  = new CParaDrawingRangeLines();
            var aDStrikeout = new CParaDrawingRangeLines();
            var aUnderline  = new CParaDrawingRangeLines();
            var aSpelling   = new CParaDrawingRangeLines();
            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var _Line      = this.Lines[CurLine];
                var EndLinePos = _Line.EndPos;
                var LineY      = _Page.Y + _Line.Y;
                var Y          = LineY;

                var LineM      = _Line.Metrics;
                var LineM_D_04 = LineM.TextDescent * 0.4;

                var RangesCount = _Line.Ranges.length;

                aStrikeout.Clear();
                aDStrikeout.Clear();
                aUnderline.Clear();
                aSpelling.Clear();

                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var _Range = _Line.Ranges[CurRange];

                    // Сначала проанализируем данную строку: в массивы aStrikeout, aDStrikeout, aUnderline
                    // aSpelling сохраним позиции начала и конца продолжительных одинаковых настроек зачеркивания,
                    // двойного зачеркивания, подчеркивания и подчеркивания орфографии.

                    var X = _Range.XVisible;

                    var StartPos = _Range.StartPos;
                    var EndPos   = ( CurRange === RangesCount - 1 ? EndLinePos : _Line.Ranges[CurRange + 1].StartPos - 1 );

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        var Item = this.Content[Pos];

                        // Нумерацию подчеркиваем и зачеркиваем в Internal_Draw_4
                        if ( Pos === this.Numbering.Pos )
                            X += this.Numbering.WidthVisible;

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
                            case para_Math:
                            {
                                if ( para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType )
                                {
                                    if ( true === CurTextPr.DStrikeout )
                                        aDStrikeout.Add( Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );
                                    else if ( true === CurTextPr.Strikeout )
                                        aStrikeout.Add( Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );

                                    if ( true === CurTextPr.Underline )
                                        aUnderline.Add( Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );

                                    if ( true === CheckSpelling[Pos] )
                                        aSpelling.Add( Y + LineM_D_04, Y + LineM_D_04, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, 0, 0, 0 );

                                    X += Item.WidthVisible;
                                }

                                break;
                            }
                            case para_Space:
                            {
                                // Пробелы в конце строки (и строку состоящую из пробелов) не подчеркиваем, не зачеркиваем и не выделяем
                                if ( Pos >= _Range.StartPos2 && Pos <= _Range.EndPos2 )
                                {
                                    if ( true === CurTextPr.DStrikeout )
                                        aDStrikeout.Add( Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );
                                    else if ( true === CurTextPr.Strikeout )
                                        aStrikeout.Add( Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );

                                    if ( true === CurTextPr.Underline )
                                        aUnderline.Add( Y + LineM_D_04, Y + LineM_D_04, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurColor.r, CurColor.g, CurColor.b );
                                }

                                X += Item.WidthVisible;

                                break;
                            }
                            case para_TextPr:
                            {
                                CurTextPr = Item.CalcValue;

                                // Выставляем цвет обводки
                                if ( true === bVisitedHyperlink )
                                    CurColor.Set( 128, 0, 151, 255 );
                                else if ( true === CurTextPr.Color.Auto )
                                    CurColor.Set( AutoColor.r, AutoColor.g, AutoColor.b );
                                else
                                    CurColor.Set( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                                switch( CurTextPr.VertAlign )
                                {
                                    case vertalign_SubScript:
                                    {
                                        Y = LineY - vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                                        break;
                                    }
                                    case vertalign_SuperScript:
                                    {
                                        Y = LineY - vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;

                                        break;
                                    }
                                    default :
                                    {
                                        Y = LineY;
                                        break;
                                    }
                                }

                                break;
                            }
                            case para_HyperlinkStart:
                            {
                                bVisitedHyperlink = Item.Get_Visited();

                                // Выставляем цвет обводки
                                if ( true === bVisitedHyperlink )
                                    CurColor.Set( 128, 0, 151, 255 );
                                else if ( true === CurTextPr.Color.Auto )
                                    CurColor.Set( AutoColor.r, AutoColor.g, AutoColor.b );
                                else
                                    CurColor.Set( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                                break;
                            }
                            case para_HyperlinkEnd:
                            {
                                bVisitedHyperlink = false;

                                if ( true === CurTextPr.Color.Auto )
                                    CurColor.Set( AutoColor.r, AutoColor.g, AutoColor.b );
                                else
                                    CurColor.Set( CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);

                                break;
                            }
                        }
                    }
                }

                // Рисуем зачеркивание
                var Element = aStrikeout.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aStrikeout.Get_Next();
                }

                // Рисуем двойное зачеркивание
                Element = aDStrikeout.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine2(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aDStrikeout.Get_Next();
                }

                // Рисуем подчеркивание
                aUnderline.Correct_w_ForUnderline();
                Element = aUnderline.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine(0, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aUnderline.Get_Next();
                }

                // Рисуем подчеркивание орфографии
				if(this.bFromDocument)
				{
					pGraphics.p_color( 255, 0, 0, 255 );
					var SpellingW = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
					Element = aSpelling.Get_Next();
					while ( null != Element )
					{
						pGraphics.DrawSpellingLine(Element.y0, Element.x0, Element.x1, SpellingW);
						Element = aSpelling.Get_Next();
					}
				}
            }
        }
        else
        {
            var PDSL = g_oPDSL;
            PDSL.Reset( this, pGraphics, AutoColor );

            var Page = this.Pages[CurPage];

            var StartLine = Page.StartLine;
            var EndLine   = Page.EndLine;

            var CheckSpelling = this.SpellChecker.Get_DrawingInfo();

            for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            {
                var Line      = this.Lines[CurLine];
                var LineM     = Line.Metrics;

                var Baseline        = Page.Y + Line.Y;
                var UnderlineOffset = LineM.TextDescent  * 0.4;

                PDSL.Reset_Line( CurPage, CurLine, Baseline, UnderlineOffset );

                // Сначала проанализируем данную строку: в массивы aStrikeout, aDStrikeout, aUnderline
                // aSpelling сохраним позиции начала и конца продолжительных одинаковых настроек зачеркивания,
                // двойного зачеркивания, подчеркивания и подчеркивания орфографии.

                var RangesCount = Line.Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var Range = Line.Ranges[CurRange];
                    var X = Range.XVisible;

                    PDSL.Reset_Range( CurRange, X, Range.SpacesSkip + Range.Spaces );

                    var StartPos = Range.StartPos;
                    var EndPos   = Range.EndPos;

                    // TODO: Нумерация подчеркивается и зачеркивается в Draw_Elements, неплохо бы сюда перенести
                    if ( true === this.Numbering.Check_Range( CurRange, CurLine ) )
                        PDSL.X += this.Numbering.WidthVisible;

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        PDSL.CurPos.Update( Pos, 0 );
                        var Item = this.Content[Pos];

                        Item.Draw_Lines(PDSL);
                    }
                }

                var aStrikeout  = PDSL.Strikeout;
                var aDStrikeout = PDSL.DStrikeout;
                var aUnderline  = PDSL.Underline;
                var aSpelling   = PDSL.Spelling;

                // Рисуем зачеркивание
                var Element = aStrikeout.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aStrikeout.Get_Next();
                }

                // Рисуем двойное зачеркивание
                Element = aDStrikeout.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine2(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aDStrikeout.Get_Next();
                }

                // Рисуем подчеркивание
                aUnderline.Correct_w_ForUnderline();
                Element = aUnderline.Get_Next();
                while ( null != Element )
                {
                    pGraphics.p_color( Element.r, Element.g, Element.b, 255 );
                    pGraphics.drawHorLine(0, Element.y0, Element.x0, Element.x1, Element.w );
                    Element = aUnderline.Get_Next();
                }

                // Рисуем подчеркивание орфографии
                pGraphics.p_color( 255, 0, 0, 255 );
                var SpellingW = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                Element = aSpelling.Get_Next();
                while ( null != Element )
                {
                    pGraphics.DrawSpellingLine(Element.y0, Element.x0, Element.x1, SpellingW);
                    Element = aSpelling.Get_Next();
                }
            }
        }
    },

    Internal_Draw_6 : function(CurPage, pGraphics, Pr)
    {
        var bEmpty  = this.IsEmpty();
        var X_left  = Math.min( this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine );
        var X_right = this.Pages[CurPage].XLimit - Pr.ParaPr.Ind.Right;

        if ( true === this.Is_LineDropCap() )
            X_right = X_left + this.Get_LineDropCapWidth();

        if ( Pr.ParaPr.Brd.Left.Value === border_Single )
            X_left -= 1 + Pr.ParaPr.Brd.Left.Space;
        else
            X_left -= 1;

        if ( Pr.ParaPr.Brd.Right.Value === border_Single )
            X_right += 1 + Pr.ParaPr.Brd.Right.Space;
        else
            X_right += 1;

        var LeftMW  = -( border_Single === Pr.ParaPr.Brd.Left.Value  ? Pr.ParaPr.Brd.Left.Size  : 0 );
        var RightMW =  ( border_Single === Pr.ParaPr.Brd.Right.Value ? Pr.ParaPr.Brd.Right.Size : 0 );

        // Рисуем линию до параграфа
        if ( true === Pr.ParaPr.Brd.First && border_Single === Pr.ParaPr.Brd.Top.Value && ( ( 0 === CurPage && ( false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev() ) ) || ( 1 === CurPage && true === this.Is_StartFromNewPage() )  ) )
        {
            var Y_top = this.Pages[CurPage].Y;
            if ( 0 === CurPage )
                Y_top += Pr.ParaPr.Spacing.Before;

            pGraphics.p_color( Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255 );

            // Учтем разрывы из-за обтекания
            var StartLine = this.Pages[CurPage].StartLine;
            var RangesCount = this.Lines[StartLine].Ranges.length;
            for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var X0 = ( 0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X );
                var X1 = ( RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd );

                if ( this.Lines[StartLine].Ranges[CurRange].W > 0.001 || ( true === bEmpty && 1 === RangesCount ) )
                    pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, Y_top, X0, X1, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW );
            }
        }
        else if ( false === Pr.ParaPr.Brd.First )
        {
            var bDraw = false;
            var Size = 0;
            var Y    = 0;
            if ( 1 === CurPage && true === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Top.Value )
            {
                pGraphics.p_color( Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255 );
                Size  = Pr.ParaPr.Brd.Top.Size;
                Y     = this.Pages[CurPage].Y + this.Lines[this.Pages[CurPage].FirstLine].Top;
                bDraw = true;
            }
            else if ( 0 === CurPage && false === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Between.Value )
            {
                pGraphics.p_color( Pr.ParaPr.Brd.Between.Color.r, Pr.ParaPr.Brd.Between.Color.g, Pr.ParaPr.Brd.Between.Color.b, 255 );
                Size  = Pr.ParaPr.Brd.Between.Size;
                Y     = this.Pages[CurPage].Y;
                bDraw = true;
            }

            if ( true === bDraw )
            {
                // Учтем разрывы из-за обтекания
                var StartLine = this.Pages[CurPage].StartLine;
                var RangesCount = this.Lines[StartLine].Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var X0 = ( 0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X );
                    var X1 = ( RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd );

                    if ( this.Lines[StartLine].Ranges[CurRange].W > 0.001 || ( true === bEmpty && 1 === RangesCount ) )
                        pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, Y, X0, X1, Size, LeftMW, RightMW );
                }
            }
        }

        var CurLine = this.Pages[CurPage].EndLine;
        var bEnd = ( this.Content.length - 2 <= this.Lines[CurLine].EndPos ? true : false );

        // Рисуем линию после параграфа
        if ( true === bEnd && true === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value )
        {
            var TempY = this.Pages[CurPage].Y;
            var NextEl = this.Get_DocumentNext();
            var DrawLineRule = c_oAscLineDrawingRule.Bottom;
            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
            {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                DrawLineRule = c_oAscLineDrawingRule.Top;
            }
            else
            {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Bottom - Pr.ParaPr.Spacing.After;
                DrawLineRule = c_oAscLineDrawingRule.Bottom;
            }

            pGraphics.p_color( Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255 );

            // Учтем разрывы из-за обтекания
            var EndLine = this.Pages[CurPage].EndLine;
            var RangesCount = this.Lines[EndLine].Ranges.length;
            for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var X0 = ( 0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X );
                var X1 = ( RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd );

                if ( this.Lines[EndLine].Ranges[CurRange].W > 0.001 || ( true === bEmpty && 1 === RangesCount ) )
                    pGraphics.drawHorLineExt( DrawLineRule, TempY, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW );
            }
        }
        else if ( true === bEnd && false === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value )
        {
            var NextEl = this.Get_DocumentNext();
            if ( null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage() )
            {
                pGraphics.p_color( Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255 );

                // Учтем разрывы из-за обтекания
                var EndLine = this.Pages[CurPage].EndLine;
                var RangesCount = this.Lines[EndLine].Ranges.length;
                for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                {
                    var X0 = ( 0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X );
                    var X1 = ( RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd );

                    if ( this.Lines[EndLine].Ranges[CurRange].W > 0.001 || ( true === bEmpty && 1 === RangesCount ) )
                        pGraphics.drawHorLineExt( c_oAscLineDrawingRule.Top, this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW );
                }
            }
        }

    },

    ReDraw : function()
    {
        this.Parent.OnContentReDraw( this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1 );
    },

    Shift : function(PageIndex, Dx, Dy)
    {
        if ( 0 === PageIndex )
        {
            this.X      += Dx;
            this.Y      += Dy;
            this.XLimit += Dx;
            this.YLimit += Dy;
        }

        var Page_abs = PageIndex + this.Get_StartPage_Absolute();
        this.Pages[PageIndex].Shift( Dx, Dy );

        var StartLine = this.Pages[PageIndex].FirstLine;
        var EndLine   = ( PageIndex >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PageIndex + 1].FirstLine - 1 );
        for ( var CurLine = StartLine; CurLine <= EndLine; CurLine++ )
            this.Lines[CurLine].Shift( Dx, Dy );

        // Пробегаемся по всем картинкам на данной странице и обновляем координаты
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Drawing === Item.Type && Item.PageNum === Page_abs )
            {
                Item.Shift( Dx, Dy );
            }
        }
    },

    Internal_Remove_CollaborativeMarks : function(bCorrectPos)
    {
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_CollaborativeChangesEnd === Item.Type || para_CollaborativeChangesStart === Item.Type )
            {
                this.Internal_Content_Remove(Pos, bCorrectPos);
                Pos--;
            }
        }
    },

    // Удаляем элементы параграфа
    // nCount - количество удаляемых элементов, > 0 удаляем элементы после курсора
    //                                          < 0 удаляем элементы до курсора
    // bOnlyText - true: удаляем только текст и пробелы, false - Удаляем любые элементы
    Remove : function(nCount, bOnlyText, bRemoveOnlySelection, bOnAddText)
    {
        if ( true !== Debug_ParaRunMode )
        {
            this.Internal_Remove_CollaborativeMarks(true);

            this.RecalcInfo.Set_Type_0(pararecalc_0_All);

            // Сначала проверим имеется ли у нас селект
            if ( true === this.Selection.Use )
            {
                var StartPos  = this.Selection.StartPos;
                var EndPos    = this.Selection.EndPos;
                var StartPos2 = this.Selection.StartPos2;
                var EndPos2   = this.Selection.EndPos2;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;

                    var Temp2 = EndPos2;
                    EndPos2   = StartPos2;
                    StartPos2 = Temp2;
                }

                this.Selection_Remove();

                if ( EndPos >= this.Content.length - 1 )
                {
                    var CurPos2 = -1;
                    if ( undefined !== this.Content[StartPos2] && para_Math === this.Content[StartPos2].Type )
                    {
                        if ( false === this.Content[StartPos2].Remove(nCount, bOnAddText) )
                        {
                            // Нам нужно удалить данный элемент
                            this.Internal_Content_Remove( StartPos2, 1 );
                            if ( StartPos > StartPos2 )
                                StartPos--;

                            if ( EndPos > StartPos2 )
                                EndPos--;
                        }
                        else
                        {
                            // Нам нужно удалить данный элемент
                            if ( StartPos === StartPos2 )
                                StartPos++;

                            CurPos2 = StartPos2;
                        }
                    }

                    for ( var Index = StartPos; Index < this.Content.length - 2; Index++ )
                    {
                        var Item = this.Content[Index];
                        if ( para_Drawing === Item.Type )
                        {
                            var ObjId = Item.Get_Id();
                            this.Parent.DrawingObjects.Remove_ById( ObjId );
                        }
                    }

                    var Hyper_start = null;
                    if ( StartPos < EndPos )
                        Hyper_start = this.Check_Hyperlink2( StartPos );

                    // Удаляем внутреннюю часть селекта (без знака параграфа)
                    this.Internal_Content_Remove2( StartPos, this.Content.length - 2 - StartPos );

                    // После удаления позиции могли измениться
                    StartPos = this.Selection.StartPos;
                    EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    this.CurPos.ContentPos2 = StartPos2;
                    this.Set_ContentPos( StartPos, true, -1 );

                    if ( null != Hyper_start )
                    {
                        this.Internal_Content_Add( StartPos, new ParaTextPr() );
                        this.Internal_Content_Add( StartPos, new ParaHyperlinkEnd() );
                    }

                    // Данный параграф надо объединить со следующим
                    return false;
                }
                else
                {
                    var CurPos2 = -1;
                    if ( undefined !== this.Content[EndPos2] && para_Math === this.Content[EndPos2].Type )
                    {
                        if ( false === this.Content[EndPos2].Remove(nCount, bOnAddText) )
                        {
                            // Нам нужно удалить данный элемент
                            this.Internal_Content_Remove( EndPos2, 1 );
                        }
                        else
                        {
                            if ( StartPos2 === EndPos2 )
                                CurPos2 = StartPos2;
                        }


                        if ( EndPos > EndPos2 )
                            EndPos--;
                    }

                    if ( undefined !== this.Content[StartPos2] && para_Math === this.Content[StartPos2].Type && StartPos2 !== EndPos2 )
                    {
                        if ( false === this.Content[EndPos2].Remove(nCount, bOnAddText) )
                        {
                            // Нам нужно удалить данный элемент
                            this.Internal_Content_Remove( EndPos2, 1 );

                            if ( StartPos > StartPos2 )
                                StartPos--;

                            if ( EndPos > StartPos2 )
                                EndPos--;
                        }
                        else
                        {
                            if ( StartPos === StartPos2 )
                                StartPos++;

                            if ( EndPos === StartPos2 )
                                EndPos--;

                            CurPos2 = StartPos2;
                        }
                    }

                    if ( EndPos <= StartPos )
                    {
                        var MathItem = this.Content[CurPos2];
                        if ( undefined !== MathItem && para_Math === MathItem.Type )
                        {
                            if ( true === MathItem.Selection_IsUse() && false === MathItem.Selection_IsEmpty() )
                                this.Internal_SelectMath( CurPos2 );
                        }

                        this.CurPos.ContentPos2 = CurPos2;
                        this.Set_ContentPos( StartPos, true, -1 );

                        return true;
                    }

                    var Hyper_start = this.Check_Hyperlink2( StartPos );
                    var Hyper_end   = this.Check_Hyperlink2( EndPos );

                    // Если встречалось какое-либо изменение настроек, сохраним его последние изменение
                    var LastTextPr = null;

                    for ( var Index = StartPos; Index < EndPos; Index++ )
                    {
                        var Item = this.Content[Index];
                        if ( para_Drawing === Item.Type )
                        {
                            var ObjId = Item.Get_Id();
                            this.Parent.DrawingObjects.Remove_ById( ObjId );
                        }
                        else if ( para_TextPr === Item.Type )
                            LastTextPr = Item;
                    }

                    this.Internal_Content_Remove2( StartPos, EndPos - StartPos );

                    // После удаления позиции могли измениться
                    StartPos = this.Selection.StartPos;
                    EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    if ( null != LastTextPr )
                        this.Internal_Content_Add( StartPos, new ParaTextPr( LastTextPr.Value ) );

                    this.CurPos.ContentPos2 = CurPos2;
                    this.Set_ContentPos( StartPos, true, -1 );

                    if ( Hyper_start != Hyper_end )
                    {
                        if ( null != Hyper_end )
                        {
                            this.Internal_Content_Add( StartPos, Hyper_end );
                            this.Set_ContentPos( this.CurPos.ContentPos + 1 );
                        }

                        if ( null != Hyper_start )
                        {
                            this.Internal_Content_Add( StartPos, new ParaHyperlinkEnd() );
                            this.Set_ContentPos( this.CurPos.ContentPos + 1 );
                        }
                    }
                    else
                    {
                        // TODO: Пока селект реализован так, что тут начало гиперссылки не попадает в выделение, а конец попадает.
                        //       Поэтому добавляем конец гиперссылки, и потом проверяем пустая ли она.
                        this.Internal_Content_Add( StartPos, new ParaHyperlinkEnd() );
                        this.Internal_Check_EmptyHyperlink( StartPos );
                    }
                }

                return;
            }

            if ( 0 == nCount )
                return;

            var absCount = ( nCount < 0 ? -nCount : nCount );

            for ( var Index = 0; Index < absCount; Index++ )
            {
                var OldPos = this.CurPos.ContentPos;

                if ( nCount < 0 )
                {
                    if ( false === this.Internal_RemoveBackward(bOnlyText) )
                        return false;
                }
                else
                {
                    if ( false === this.Internal_RemoveForward(bOnlyText) )
                        return false;
                }

                this.Internal_Check_EmptyHyperlink( OldPos );
            }

            return true;
        }
        else
        {
            // TODO: Разобраться с гиперссылками, комментариями при удалении

            var Direction = nCount;
            var Result = true;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                // Сразу проверим последний элемент на попадание ParaEnd в селект
                if ( EndPos === this.Content.length - 1 && true === this.Content[EndPos].Selection_CheckParaEnd() )
                    Result = false;

                if ( StartPos === EndPos )
                {
                    this.Content[StartPos].Remove(nCount, bOnAddText);

                    // Мы не удаляем последний элемент с ParaEnd
                    if ( StartPos !== this.Content.length - 1 && true === this.Content[StartPos].Is_Empty() )
                    {
                        this.Internal_Content_Remove( StartPos );

                        this.CurPos.ContentPos = StartPos;
                        this.Content[StartPos].Cursor_MoveToStartPos();
                    }
                }
                else
                {
                    this.Content[EndPos].Remove(nCount, bOnAddText);

                    // Мы не удаляем последний элемент с ParaEnd
                    if ( EndPos !== this.Content.length - 1 && true === this.Content[EndPos].Is_Empty() )
                    {
                        this.Internal_Content_Remove( EndPos );

                        this.CurPos.ContentPos = EndPos;
                        this.Content[EndPos].Cursor_MoveToStartPos();
                    }

                    for ( var CurPos = EndPos - 1; CurPos > StartPos; CurPos-- )
                    {
                        this.Internal_Content_Remove( CurPos );
                    }

                    this.Content[StartPos].Remove(nCount, bOnAddText);

                    // Мы не удаляем последний элемент с ParaEnd
                    if ( true === this.Content[StartPos].Is_Empty() )
                        this.Internal_Content_Remove( StartPos );
                }
            }
            else
            {
                var ContentPos = this.CurPos.ContentPos;

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
                    Result = false;
                else
                {
                    if ( ContentPos !== this.Content.length - 1 && true === this.Content[ContentPos].Is_Empty() )
                    {
                        this.Internal_Content_Remove( ContentPos );

                        this.CurPos.ContentPos = ContentPos;
                        this.Content[ContentPos].Cursor_MoveToStartPos();
                    }
                    else
                    {
                        this.CurPos.ContentPos = ContentPos;
                    }
                }

                if ( Direction < 0 && false === Result )
                {
                    // Мы стоим в начале параграфа и пытаемся удалить элемент влево. Действуем следующим образом:
                    // 1. Если у нас параграф с нумерацией, тогда удаляем нумерацию, но при этом сохраняем
                    //    значения отступов так как это делается в Word. (аналогично работаем с нумерацией в презентациях)
                    // 2. Если у нас отступ первой строки ненулевой, тогда:
                    //    2.1 Если он положительный делаем его нулевым.
                    //    2.2 Если он отрицательный сдвигаем левый отступ на значение отступа первой строки,
                    //        а сам отступ первой строки делаем нулевым.
                    // 3. Если у нас ненулевой левый отступ, делаем его нулевым
                    // 4. Если ничего из предыдущего не случается, тогда говорим родительскому классу, что удаление
                    //    не было выполнено.

                    Result = true;

                    var Pr = this.Get_CompiledPr2(false).ParaPr;
                    if ( undefined != this.Numbering_Get() )
                    {
                        this.Numbering_Remove();
                        this.Set_Ind( { FirstLine : 0, Left : Math.max( Pr.Ind.Left, Pr.Ind.Left + Pr.Ind.FirstLine ) }, false );
                    }
                    else if ( numbering_presentationnumfrmt_None != this.PresentationPr.Bullet.Get_Type() )
                    {
                        this.Remove_PresentationNumbering();
                    }
                    else if ( align_Right === Pr.Jc )
                    {
                        this.Set_Align( align_Center );
                    }
                    else if ( align_Center === Pr.Jc )
                    {
                        this.Set_Align( align_Left );
                    }
                    else if ( Math.abs(Pr.Ind.FirstLine) > 0.001 )
                    {
                        if ( Pr.Ind.FirstLine > 0 )
                            this.Set_Ind( { FirstLine : 0 }, false );
                        else
                            this.Set_Ind( { Left : Pr.Ind.Left + Pr.Ind.FirstLine, FirstLine : 0 }, false );
                    }
                    else if ( Math.abs(Pr.Ind.Left) > 0.001 )
                    {
                        this.Set_Ind( { Left : 0 }, false );
                    }
                    else
                        Result = false;
                }
            }

            return Result;
        }
    },

    Remove_ParaEnd : function()
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = ContentLen - 1; CurPos >= 0; CurPos-- )
        {
            var Element = this.Content[CurPos];

            // Предполагаем, что para_End лежит только в ране, который лежит только на самом верхнем уровне
            if ( para_Run === Element.Type && true === Element.Remove_ParaEnd() )
                return;
        }
    },

    Internal_RemoveBackward : function(bOnlyText)
    {
        var Line = this.Content;
        var CurPos  = this.CurPos.ContentPos;
        var CurPos2 = this.CurPos.ContentPos2;

        var MathItem = this.Content[CurPos2];
        if ( undefined !== MathItem && para_Math === MathItem.Type )
        {
            if ( false != MathItem.Remove(1) )
            {
                // TODO: тут надо проверить, не остался ли данный элемент пустым

                // После удаления в математическом элементе может остаться выделение
                if ( true === MathItem.Selection_IsUse() && false === MathItem.Selection_IsEmpty() )
                    this.Internal_SelectMath( CurPos2 );

                return true;
            }

            CurPos = CurPos2;
        }

        if ( !bOnlyText )
        {
            if ( CurPos == 0 )
                return false;
            else
            {
                // Просто удаляем элемент предстоящий текущей позиции и уменьшаем текущую позицию
                this.Internal_Content_Remove( CurPos - 1 );
            }
        }
        else
        {
            var LetterPos = CurPos - 1;

            var oPos = this.Internal_FindBackward( LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );

            if ( oPos.Found )
            {
                if ( para_Drawing === oPos.Type )
                {
                    this.Parent.Select_DrawingObject( this.Content[oPos.LetterPos].Get_Id() );
                }
                else if ( para_Math === oPos.Type )
                {
                    var MathElement = this.Content[oPos.LetterPos];
                    MathElement.Cursor_MoveToEndPos();
                    MathElement.Remove( -1, false );

                    if ( true === MathElement.Is_Empty() )
                    {
                        this.Internal_Content_Remove( oPos.LetterPos );
                        this.Set_ContentPos( oPos.LetterPos, true, -1 );
                    }
                    else
                    {
                        this.Set_ContentPos( oPos.LetterPos, true, -1 );

                        if ( true === MathElement.Selection_IsUse() && false === MathElement.Selection_IsEmpty() )
                            this.Internal_SelectMath( oPos.LetterPos );
                        else
                            this.CurPos.ContentPos2 = oPos.LetterPos;
                    }
                }
                else
                {
                    // Удаляем элемент в найденной позиции и уменьшаем текущую позицию
                    this.Internal_Content_Remove( oPos.LetterPos );
                    this.Set_ContentPos( oPos.LetterPos, true, -1 );
                }
            }
            else
            {
                // Мы стоим в начале параграфа и пытаемся удалить элемент влево. Действуем следующим образом:
                // 1. Если у нас параграф с нумерацией, тогда удаляем нумерацию, но при этом сохраняем
                //    значения отступов так как это делается в Word. (аналогично работаем с нумерацией в презентациях)
                // 2. Если у нас отступ первой строки ненулевой, тогда:
                //    2.1 Если он положительный делаем его нулевым.
                //    2.2 Если он отрицательный сдвигаем левый отступ на значение отступа первой строки,
                //        а сам отступ первой строки делаем нулевым.
                // 3. Если у нас ненулевой левый отступ, делаем его нулевым
                // 4. Если ничего из предыдущего не случается, тогда говорим родительскому классу, что удаление
                //    не было выполнено.

                var Pr = this.Get_CompiledPr2(false).ParaPr;
                if ( undefined != this.Numbering_Get() )
                {
                    this.Numbering_Remove();
                    this.Set_Ind( { FirstLine : 0, Left : Math.max( Pr.Ind.Left, Pr.Ind.Left + Pr.Ind.FirstLine ) }, false );
                }
                else if ( numbering_presentationnumfrmt_None != this.PresentationPr.Bullet.Get_Type() )
                {
                    this.Remove_PresentationNumbering();
                }
                else if ( align_Right === Pr.Jc )
                {
                    this.Set_Align( align_Center );
                }
                else if ( align_Center === Pr.Jc )
                {
                    this.Set_Align( align_Left );
                }
                else if ( Math.abs(Pr.Ind.FirstLine) > 0.001 )
                {
                    if ( Pr.Ind.FirstLine > 0 )
                        this.Set_Ind( { FirstLine : 0 }, false );
                    else
                        this.Set_Ind( { Left : Pr.Ind.Left + Pr.Ind.FirstLine, FirstLine : 0 }, false );
                }
                else if ( Math.abs(Pr.Ind.Left) > 0.001 )
                {
                    this.Set_Ind( { Left : 0 }, false );
                }
                else
                    return false;
            }
        }

        return true;
    },

    Internal_RemoveForward : function(bOnlyText)
    {
        var Line = this.Content;
        var CurPos  = this.CurPos.ContentPos;
        var CurPos2 = this.CurPos.ContentPos2;

        var MathItem = this.Content[CurPos2];
        if ( undefined !== MathItem && para_Math === MathItem.Type )
        {
            if ( false != MathItem.Remove(-1) )
            {
                // TODO: тут надо проверить, не остался ли данный элемент пустым


                // После удаления в математическом элементе может остаться выделение
                if ( true === MathItem.Selection_IsUse() && false === MathItem.Selection_IsEmpty() )
                    this.Internal_SelectMath( CurPos2 );

                return true;
            }

            CurPos = CurPos2 + 1;
        }

        if ( !bOnlyText )
        {
            if ( CurPos == Line.length - 1 )
            {
                return false;
            }
            else
            {
                // Просто удаляем элемент после текущей позиции
                this.Internal_Content_Remove( CurPos + 1 );
            }
        }
        else
        {
            var LetterPos = CurPos;

            var oPos = this.Internal_FindForward( LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );

            if ( oPos.Found )
            {
                if ( para_Drawing === oPos.Type )
                {
                    this.Parent.Select_DrawingObject( this.Content[oPos.LetterPos].Get_Id() );
                }
                else if ( para_Math === oPos.Type )
                {
                    var MathElement = this.Content[oPos.LetterPos];
                    MathElement.Cursor_MoveToStartPos();
                    MathElement.Remove( 1, false );

                    if ( true === MathElement.Is_Empty() )
                    {
                        this.Internal_Content_Remove( oPos.LetterPos );
                        this.Set_ContentPos( oPos.LetterPos, true, -1 );
                    }
                    else
                    {
                        this.Set_ContentPos( oPos.LetterPos, true, -1 );

                        if ( true === MathElement.Selection_IsUse() && false === MathElement.Selection_IsEmpty() )
                            this.Internal_SelectMath( oPos.LetterPos );
                        else
                            this.CurPos.ContentPos2 = oPos.LetterPos;
                    }
                }
                else
                {
                    // Удаляем элемент в найденной позиции и меняем текущую позицию
                    this.Internal_Content_Remove( oPos.LetterPos );
                    this.Set_ContentPos( oPos.LetterPos, true, -1 );
                }
            }
            else
            {
                return false;
            }
        }
        return true;
    },

    // Ищем первый элемент, при промотке вперед
    Internal_FindForward : function(CurPos, arrId)
    {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;

        if ( CurPos < 0 || CurPos >= this.Content.length )
            return { Found : false };

        while ( !bFound )
        {
            Type = this.Content[LetterPos].Type;

            for ( var Id = 0; Id < arrId.length; Id++ )
            {
                if ( arrId[Id] == Type )
                {
                    bFound = true;
                    break;
                }
            }

            if ( bFound )
                break;

            LetterPos++;
            if ( LetterPos > this.Content.length - 1 )
                break;
        }

        return { LetterPos : LetterPos, Found : bFound, Type : Type };
    },

    // Ищем первый элемент, при промотке назад
    Internal_FindBackward : function(CurPos, arrId)
    {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;

        if ( CurPos < 0 || CurPos >= this.Content.length )
            return { Found : false };

        while ( !bFound )
        {
            Type = this.Content[LetterPos].Type;
            for ( var Id = 0; Id < arrId.length; Id++ )
            {
                if ( arrId[Id] == Type )
                {
                    bFound = true;
                    break;
                }
            }

            if ( bFound )
                break;

            LetterPos--;
            if ( LetterPos < 0 )
                break;
        }

        return { LetterPos : LetterPos, Found : bFound, Type : Type };
    },

    Get_TextPr : function(_ContentPos)
    {
        var ContentPos = ( undefined === _ContentPos ? this.Get_ParaContentPos( false, false ) : _ContentPos );

        var CurPos = ContentPos.Get(0);

        return this.Content[CurPos].Get_TextPr( ContentPos, 1 );
    },

    Internal_CalculateTextPr : function (LetterPos, StartPr)
    {
        var Pr;
        if ( "undefined" != typeof(StartPr) )
        {
            Pr = this.Get_CompiledPr();
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        }
        else
        {
            Pr = this.Get_CompiledPr2(false);
        }

        // Выствляем начальные настройки текста у данного параграфа
        var TextPr = Pr.TextPr.Copy();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем настройки из символьного стиля
            if ( undefined != CurTextPr.RStyle )
            {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr( CurTextPr.RStyle, styletype_Character).TextPr;
                TextPr.Merge( StyleTextPr );
            }

            // Копируем прямые настройки
            TextPr.Merge( CurTextPr );
        }

        TextPr.FontFamily.Name  = TextPr.RFonts.Ascii.Name;
        TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;

        return TextPr;
    },

    Internal_GetLang : function(LetterPos)
    {
        var Lang = this.Get_CompiledPr2(false).TextPr.Lang.Copy();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return Lang;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;

            // Копируем настройки из символьного стиля
            if ( undefined != CurTextPr.RStyle )
            {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr( CurTextPr.RStyle, styletype_Character).TextPr;
                Lang.Merge( StyleTextPr.Lang );
            }

            // Копируем прямые настройки
            Lang.Merge( CurTextPr.Lang );
        }

        return Lang;
    },

    Internal_GetTextPr : function(LetterPos)
    {
        var TextPr = new CTextPr();

        // Ищем ближайший TextPr
        if ( LetterPos < 0 )
            return TextPr;

        // Ищем предыдущие записи с изменением текстовых свойств
        var Pos = this.Internal_FindBackward( LetterPos, [para_TextPr] );

        if ( true === Pos.Found )
        {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            TextPr.Merge( CurTextPr );
        }
        // Если ничего не нашли, то TextPr будет пустым, что тоже нормально

        return TextPr;
    },

    // Добавляем новый элемент к содержимому параграфа (на текущую позицию)
    Add : function(Item)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var CurPos  = this.CurPos.ContentPos;
            var CurPos2 = this.CurPos.ContentPos2;

            if ( "undefined" != typeof(Item.Parent) )
                Item.Parent = this;

            switch (Item.Type)
            {
                case para_Text:
                case para_Space:
                {
                    if ( undefined !== this.Content[CurPos2] && para_Math === this.Content[CurPos2].Type )
                        this.Content[CurPos2].Add( Item );
                    else
                        this.Internal_Content_Add( CurPos, Item );

                    break;
                }
                case para_TextPr:
                {
                    this.Internal_AddTextPr( Item.Value );
                    break;
                }
                case para_HyperlinkStart:
                {
                    this.Internal_AddHyperlink( Item );
                    break;
                }
                case para_Math:
                {
                    if ( undefined !== this.Content[CurPos2] && para_Math === this.Content[CurPos2].Type )
                        this.Content[CurPos2].Add( Item );
                    else
                    {
                        var TextPr = this.Internal_GetTextPr( CurPos );
                        var NewParaTextPr = new ParaTextPr( TextPr );
                        this.Internal_Content_Add( CurPos, Item );
                        this.Internal_Content_Add( CurPos + 1, NewParaTextPr );
                    }
                    break;
                }
                case para_PageNum:
                case para_Tab:
                case para_Drawing:
                default:
                {
                    this.Internal_Content_Add( CurPos, Item );

                    break;
                }
            }

            if ( para_TextPr != Item.Type )
                this.DeleteCollaborativeMarks = true;

            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        }
        else
        {

            // Выставляем родительский класс
            Item.Parent = this;

            switch (Item.Type)
            {
                case para_Text:
                case para_Space:
                case para_PageNum:
                case para_Tab:
                case para_Drawing:
                case para_NewLine:
                {
                    // Элементы данного типа добавляем во внутренний элемент
                    this.Content[this.CurPos.ContentPos].Add( Item );

                    break;
                }
                case para_TextPr:
                {
                    var TextPr = Item.Value;

                    if ( undefined != TextPr.FontFamily )
                    {
                        var FName  = TextPr.FontFamily.Name;
                        var FIndex = TextPr.FontFamily.Index;

                        TextPr.RFonts = new CRFonts();
                        TextPr.RFonts.Ascii    = { Name : FName, Index : FIndex };
                        TextPr.RFonts.EastAsia = { Name : FName, Index : FIndex };
                        TextPr.RFonts.HAnsi    = { Name : FName, Index : FIndex };
                        TextPr.RFonts.CS       = { Name : FName, Index : FIndex };
                    }

                    // Удалим все лишние пустые раны из параграфа
                    this.Remove_EmptyRuns();

                    if ( true === this.ApplyToAll )
                    {
                        // Применяем настройки ко всем элементам параграфа
                        var ContentLen = this.Content.length;

                        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
                        {
                            this.Content[CurPos].Apply_TextPr( TextPr );
                        }

                        // Выставляем настройки для символа параграфа
                        this.TextPr.Apply_TextPr( TextPr );
                    }
                    else
                    {
                        if ( true === this.Selection.Use )
                        {
                            this.Apply_TextPr(TextPr);
                        }
                        else
                        {
                            var CurParaPos = this.Get_ParaContentPos( false, false );
                            var CurPos = CurParaPos.Get(0);

                            // Сначала посмотрим на элемент слева и справа(текущий)
                            var SearchLPos = new CParagraphSearchPos();
                            this.Get_LeftPos( SearchLPos, CurParaPos );

                            var RItem = this.Get_RunElementByPos( CurParaPos );
                            var LItem = ( false === SearchLPos.Found ? null : this.Get_RunElementByPos( SearchLPos.Pos ) );

                            // 1. Если мы находимся в конце параграфа, тогда применяем заданную настройку к знаку параграфа
                            //    и добавляем пустой ран с заданными настройками.
                            // 2. Если мы находимся в середине слова (справа и слева текстовый элемент, причем оба не пунктуация),
                            //    тогда меняем настройки для данного слова.
                            // 3. Во всех остальных случаях вставляем пустой ран с заданными настройкми и переносим курсор в этот
                            //    ран, чтобы при последующем наборе текст отрисовывался с нужными настройками.

                            if ( null === RItem || para_End === RItem.Type )
                            {
                                this.Apply_TextPr( TextPr );
                                this.TextPr.Apply_TextPr( TextPr );
                            }
                            else if ( null !== RItem && null !== LItem && para_Text === RItem.Type && para_Text === LItem.Type && false === RItem.Is_Punctuation() && false === LItem.Is_Punctuation() )
                            {
                                var SearchSPos = new CParagraphSearchPos();
                                var SearchEPos = new CParagraphSearchPos();

                                this.Get_WordStartPos( SearchSPos, CurParaPos );
                                this.Get_WordEndPos( SearchEPos, CurParaPos );

                                // Такого быть не должно, т.к. мы уже проверили, что справа и слева точно есть текст
                                if ( true !== SearchSPos.Found || true !== SearchEPos.Found )
                                    return;

                                // Выставим временно селект от начала и до конца слова
                                this.Selection.Use = true;
                                this.Set_SelectionContentPos( SearchSPos.Pos, SearchEPos.Pos );

                                this.Apply_TextPr( TextPr );

                                // Убираем селект
                                this.Selection_Remove();
                            }
                            else
                            {
                                this.Apply_TextPr( TextPr );
                            }
                        }
                    }

                    break;
                }
                case para_HyperlinkStart:
                {
                    // TODO: Сделать добавление гиперссылок
                    break;
                }
                case para_Math:
                {
                    // TODO: Сделать добавление формул
                    break;
                }
            }
        }

    },

    // Данная функция вызывается, когда уже точно известно, что у нас либо выделение начинается с начала параграфа, либо мы стоим курсором в начале параграфа
    Add_Tab : function(bShift)
    {
        var NumPr = this.Numbering_Get();

        if ( undefined != NumPr )
        {
            if ( true != this.Selection.Use )
            {
                var NumId   = NumPr.NumId;
                var Lvl     = NumPr.Lvl;
                var NumInfo = this.Parent.Internal_GetNumInfo( this.Id, NumPr );

                if ( 0 === Lvl && NumInfo[Lvl] <= 1 )
                {
                    var Numbering   = this.Parent.Get_Numbering();
                    var AbstractNum = Numbering.Get_AbstractNum(NumId);

                    var NumLvl = AbstractNum.Lvl[Lvl];
                    var NumParaPr = NumLvl.ParaPr;

                    var ParaPr = this.Get_CompiledPr2(false).ParaPr;

                    if ( undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left )
                    {
                        var NewX = ParaPr.Ind.Left;
                        if ( true != bShift )
                            NewX += Default_Tab_Stop;
                        else
                        {
                            NewX -= Default_Tab_Stop;

                            if ( NewX < 0 )
                                NewX = 0;

                            if ( ParaPr.Ind.FirstLine < 0 && NewX + ParaPr.Ind.FirstLine < 0 )
                                NewX = -ParaPr.Ind.FirstLine;
                        }

                        AbstractNum.Change_LeftInd( NewX );

                        History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : undefined } );
                        History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : undefined } );

                        // При добавлении списка в параграф, удаляем все собственные сдвиги
                        this.Pr.Ind.FirstLine = undefined;
                        this.Pr.Ind.Left      = undefined;

                        // Надо пересчитать конечный стиль
                        this.CompiledPr.NeedRecalc = true;
                    }
                }
                else
                    this.Numbering_IndDec_Level( !bShift );
            }
            else
                this.Numbering_IndDec_Level( !bShift );
        }
        else if ( true === this.Is_SelectionUse() )
        {
            this.IncDec_Indent( !bShift );
        }
        else
        {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;

            if ( true != bShift )
            {
                if ( ParaPr.Ind.FirstLine < 0 )
                {
                    this.Set_Ind( { FirstLine : 0 }, false );
                    this.CompiledPr.NeedRecalc = true;
                }
                else if ( ParaPr.Ind.FirstLine < 12.5 )
                {
                    this.Set_Ind( { FirstLine : 12.5 }, false );
                    this.CompiledPr.NeedRecalc = true;
                }
                else if ( X_Right_Field - X_Left_Margin > ParaPr.Ind.Left + 25 )
                {
                    this.Set_Ind( { Left : ParaPr.Ind.Left + 12.5 }, false );
                    this.CompiledPr.NeedRecalc = true;
                }
            }
            else
            {
                if ( ParaPr.Ind.FirstLine > 0 )
                {
                    if ( ParaPr.Ind.FirstLine > 12.5 )
                        this.Set_Ind( { FirstLine : ParaPr.Ind.FirstLine - 12.5 }, false );
                    else
                        this.Set_Ind( { FirstLine : 0 }, false );

                    this.CompiledPr.NeedRecalc = true;
                }
                else
                {
                    var Left = ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    if ( Left < 0 )
                    {
                        this.Set_Ind( { Left : -ParaPr.Ind.FirstLine }, false );
                        this.CompiledPr.NeedRecalc = true;
                    }
                    else
                    {
                        if ( Left > 12.5 )
                            this.Set_Ind( { Left : ParaPr.Ind.Left - 12.5 }, false );
                        else
                            this.Set_Ind( { Left : -ParaPr.Ind.FirstLine }, false );

                        this.CompiledPr.NeedRecalc = true;
                    }
                }
            }
        }
    },

    // Расширяем параграф до позиции X
    Extend_ToPos : function(_X)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var Page = this.Pages[this.Pages.length - 1];

            var X0 = Page.X;
            var X1 = Page.XLimit - X0;
            var X  = _X - X0;

            if ( true === this.IsEmpty() )
            {
                if ( Math.abs(X - X1 / 2) < 12.5 )
                    return this.Set_Align( align_Center );
                else if ( X > X1 - 12.5 )
                    return this.Set_Align( align_Right );
                else if ( X < 12.5 )
                    return this.Set_Ind( { FirstLine : 12.5 }, false );
            }

            var Tabs = this.Get_CompiledPr2(false).ParaPr.Tabs.Copy();
            var CurPos = this.Internal_GetEndPos();

            if ( Math.abs(X - X1 / 2) < 12.5 )
                Tabs.Add( new CParaTab( tab_Center, X1 / 2 ) );
            else if ( X > X1 - 12.5 )
                Tabs.Add( new CParaTab( tab_Right, X1 - 0.001 ) );
            else
                Tabs.Add( new CParaTab( tab_Left, X ) );

            this.Set_Tabs( Tabs );
            this.Internal_Content_Add( CurPos, new ParaTab() );
        }
        else
        {
            var Page = this.Pages[this.Pages.length - 1];

            var X0 = Page.X;
            var X1 = Page.XLimit - X0;
            var X  = _X - X0;

            if ( true === this.IsEmpty() )
            {
                if ( Math.abs(X - X1 / 2) < 12.5 )
                    return this.Set_Align( align_Center );
                else if ( X > X1 - 12.5 )
                    return this.Set_Align( align_Right );
                else if ( X < 12.5 )
                    return this.Set_Ind( { FirstLine : 12.5 }, false );
            }

            var Tabs = this.Get_CompiledPr2(false).ParaPr.Tabs.Copy();

            if ( Math.abs(X - X1 / 2) < 12.5 )
                Tabs.Add( new CParaTab( tab_Center, X1 / 2 ) );
            else if ( X > X1 - 12.5 )
                Tabs.Add( new CParaTab( tab_Right, X1 - 0.001 ) );
            else
                Tabs.Add( new CParaTab( tab_Left, X ) );

            this.Set_Tabs( Tabs );

            this.Set_ParaContentPos( this.Get_EndPos( false ), -1, false );
            this.Add( new ParaTab() );
        }
    },

    Internal_IncDecFontSize : function(bIncrease, Value)
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
    },

    IncDec_FontSize : function(bIncrease)
    {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        var StartTextPr = this.Get_CompiledPr().TextPr;

        if ( true === this.ApplyToAll )
        {
            var StartFontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );
            this.Internal_Content_Add( 0, new ParaTextPr( { FontSize : StartFontSize } ) );

            for ( var Index = 1; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != Item.Value.FontSize )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            // Выставляем настройки для символа параграфа
            if ( undefined != this.TextPr.Value.FontSize )
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
            else
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );

            return true;
        }

        // найдем текущую позицию
        var Line   = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            // Если селект продолжается до конца параграфа, не ставим отметку в конце
            var LastPos = this.Internal_GetEndPos();
            var bEnd = false;
            if ( EndPos > LastPos )
            {
                EndPos = LastPos;
                bEnd = true;
            }

            // Рассчитываем настройки, которые используются после селекта
            var TextPr_end   = this.Internal_GetTextPr( EndPos );
            var TextPr_start = this.Internal_GetTextPr( StartPos );

            if ( undefined != TextPr_start.FontSize )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
            if ( false === bEnd )
                this.Internal_Content_Add( EndPos + 1, new ParaTextPr( TextPr_end ) );
            else
            {
                // Выставляем настройки для символа параграфа
                if ( undefined != this.TextPr.Value.FontSize )
                    this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
                else
                    this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
            }

            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                Item = this.Content[Pos];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != Item.Value.FontSize )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            return true;
        }

        // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
        // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
        // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

        var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
        var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        var CurType = this.Content[CurPos].Type;

        if ( !oEnd.Found )
            return false;

        if ( para_End == oEnd.Type )
        {
            // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
            var Pos = oEnd.LetterPos;
            var TextPr_start = this.Internal_GetTextPr( Pos );

            if ( undefined != TextPr_start.FontSize )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
            this.Set_ContentPos( Pos + 1, true, -1 );

            // Выставляем настройки для символа параграфа
            if ( undefined != this.TextPr.Value.FontSize )
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, this.TextPr.Value.FontSize ) );
            else
                this.TextPr.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );

            return true;
        }
        else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
        {
            var TextPr_old = this.Internal_GetTextPr( CurPos );
            var TextPr_new = TextPr_old.Copy();

            if ( undefined != TextPr_new.FontSize )
                TextPr_new.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_new.FontSize );
            else
                TextPr_new.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( CurPos, new ParaEmpty(true) );
            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

            this.Set_ContentPos( CurPos + 1, true, -1 );
            this.RecalculateCurPos();
            return false;
        }
        else
        {
            // Мы находимся посередине слова. В начале слова ставим запись о новом размере шрифта,
            // а в конце слова старый размер шрифта. Кроме этого, надо заменить все записи о размерах шрифте внутри слова.

            // Найдем начало слова
            var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
            if ( !oWordStart.Found )
                oWordStart = this.Internal_FindForward( 0, [para_Text] );
            else
                oWordStart.LetterPos++;

            var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

            if ( !oWordStart.Found || !oWordEnd.Found )
                return;

            // Рассчитываем настройки, которые используются после слова
            var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
            var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );

            if ( undefined != TextPr_start.FontSize )
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, TextPr_start.FontSize );
            else
                TextPr_start.FontSize = this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize );

            this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

            this.Set_ContentPos( CurPos + 1, true, -1 );

            // Если внутри слова были изменения размера шрифта, тогда заменяем их.
            for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
            {
                Item = this.Content[Pos];
                if ( para_TextPr === Item.Type )
                {
                    if ( undefined != Item.Value.FontSize )
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, Item.Value.FontSize ) );
                    else
                        Item.Set_FontSize( this.Internal_IncDecFontSize( bIncrease, StartTextPr.FontSize ) );
                }
            }

            return true;
        }
    },

    IncDec_Indent : function(bIncrease)
    {
        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr )
        {
            this.Numbering_IndDec_Level( bIncrease );
        }
        else
        {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;

            var LeftMargin = ParaPr.Ind.Left;
            if ( UnknownValue === LeftMargin )
                LeftMargin = 0;
            else if ( LeftMargin < 0 )
            {
                this.Set_Ind( { Left : 0 }, false );
                return;
            }

            var LeftMargin_new = 0;
            if ( true === bIncrease )
            {
                if ( LeftMargin >= 0 )
                {
                    LeftMargin = 12.5 * parseInt(10 * LeftMargin / 125);
                    LeftMargin_new = ( (LeftMargin - (10 * LeftMargin) % 125 / 10) / 12.5 + 1) * 12.5;
                }

                if ( LeftMargin_new < 0 )
                    LeftMargin_new = 12.5;
            }
            else
            {
                var TempValue = (125 - (10 * LeftMargin) % 125);
                TempValue = ( 125 === TempValue ? 0 : TempValue );
                LeftMargin_new = Math.max( ( (LeftMargin + TempValue / 10) / 12.5 - 1 ) * 12.5, 0 );
            }

            this.Set_Ind( { Left : LeftMargin_new }, false );
        }

        var NewPresLvl = ( true === bIncrease ? Math.min( 8, this.PresentationPr.Level + 1 ) : Math.max( 0, this.PresentationPr.Level - 1 ) );
        this.Set_PresentationLevel( NewPresLvl );
    },

    // Корректируем позицию курсора:
    // Если курсор находится в начале какого-либо рана, тогда мы его двигаем в конец предыдущего рана
    Correct_ContentPos : function(CorrectEndLinePos)
    {
        var Count  = this.Content.length;
        var CurPos = this.CurPos.ContentPos;

        // Если курсор попадает на конец строки, тогда мы его переносим в начало следующей
        if ( true === CorrectEndLinePos && true === this.Content[CurPos].Cursor_Is_End() )
        {
            var _CurPos = CurPos + 1;

            // Пропускаем пустые раны
            while ( true === this.Content[_CurPos].Is_Empty( { SkipAnchor : true } ) && _CurPos < Count )
                _CurPos++;

            if ( _CurPos < Count && true === this.Content[_CurPos].Is_StartFromNewLine() )
            {
                CurPos = _CurPos;
                this.Content[CurPos].Cursor_MoveToStartPos();
            }
        }

        while ( CurPos > 0 && true === this.Content[CurPos].Cursor_Is_NeededCorrectPos() )
        {
            CurPos--;
            this.Content[CurPos].Cursor_MoveToEndPos();
        }

        this.CurPos.ContentPos = CurPos;
    },

    Get_ParaContentPos : function(bSelection, bStart)
    {
        var ContentPos = new CParagraphContentPos();

        var Pos = ( true !== bSelection ? this.CurPos.ContentPos : ( false !== bStart ? this.Selection.StartPos : this.Selection.EndPos ) );

        ContentPos.Add( Pos );

        this.Content[Pos].Get_ParaContentPos( bSelection, bStart, ContentPos );

        return ContentPos;
    },

    Set_ParaContentPos : function(ContentPos, Line, CorrectEndLinePos)
    {
        var Pos = ContentPos.Get(0);

        this.CurPos.ContentPos = Pos;
        this.Content[Pos].Set_ParaContentPos( ContentPos, 1 );
        this.Correct_ContentPos(CorrectEndLinePos);

        this.CurPos.Line  = Line;
        this.CurPos.Range = 0;
    },

    Set_SelectionContentPos : function(StartContentPos, EndContentPos)
    {
        var Depth = 0;

        var OldStartPos = this.Selection.StartPos;
        var OldEndPos   = this.Selection.EndPos;

        if ( OldStartPos > OldEndPos )
        {
            OldStartPos = this.Selection.EndPos;
            OldEndPos   = this.Selection.StartPos;
        }

        var StartPos = StartContentPos.Get( Depth );
        var EndPos   = EndContentPos.Get(Depth);

        this.Selection.StartPos = StartPos;
        this.Selection.EndPos   = EndPos;

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

        if ( StartPos === EndPos )
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, EndContentPos, Depth + 1, 0, 0 );
        }
        else if ( StartPos > EndPos )
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, null, Depth + 1, 0, 1 );
            this.Content[EndPos].Set_SelectionContentPos( null, EndContentPos, Depth + 1, -1, 0 );

            for ( var CurPos = EndPos + 1; CurPos < StartPos; CurPos++ )
                this.Content[CurPos].Select_All( -1 );
        }
        else// if ( StartPos < EndPos )
        {
            this.Content[StartPos].Set_SelectionContentPos( StartContentPos, null, Depth + 1, 0, -1 );
            this.Content[EndPos].Set_SelectionContentPos( null, EndContentPos, Depth + 1, 1, 0 );

            for ( var CurPos = StartPos + 1; CurPos < EndPos; CurPos++ )
                this.Content[CurPos].Select_All( 1 );
        }
    },

    Get_ParaContentPosByXY : function(X, Y, PageNum, bYLine, StepEnd)
    {
        var SearchPos = new CParagraphSearchPosXY();

        if ( this.Lines.length <= 0 )
            return SearchPos;

        // Определим страницу
        var PNum = ( PageNum === -1 || undefined === PageNum ? 0 : PageNum - this.PageNum );

        // Сначала определим на какую строку мы попали
        if ( PNum >= this.Pages.length )
        {
            PNum   = this.Pages.length - 1;
            bYLine = true;
            Y      = this.Lines.length - 1;
        }
        else if ( PNum < 0 )
        {
            PNum   = 0;
            bYLine = true;
            Y      = 0;
        }

        var CurLine = 0;
        if ( true === bYLine )
            CurLine = Y;
        else
        {
            CurLine  = this.Pages[PNum].FirstLine;

            var bFindY   = false;
            var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            var LastLine = ( PNum >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PNum + 1].FirstLine - 1 );

            while ( !bFindY )
            {
                if ( Y < CurLineY )
                    break;
                if ( CurLine >= LastLine )
                    break;

                CurLine++;
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            }
        }

        // Определим отрезок, в который мы попадаем
        var CurRange = 0;
        var RangesCount = this.Lines[CurLine].Ranges.length;
        for ( ; CurRange < RangesCount; CurRange++ )
        {
            var _Range = this.Lines[CurLine].Ranges[CurRange];
            if ( X < _Range.XEnd )
                break;
        }

        if ( CurRange >= RangesCount )
            CurRange = Math.max(RangesCount - 1, 0);

        // Определим уже непосредственно позицию, куда мы попадаем
        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        SearchPos.CurX = Range.XVisible;
        SearchPos.X    = X;

        // Проверим попадание в нумерацию
        if ( true === this.Numbering.Check_Range(CurRange, CurLine) )
        {
            var NumPr = this.Numbering_Get();
            if ( para_Numbering === this.Numbering.Type && undefined !== NumPr )
            {
                var NumJc = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;

                var NumX0 = SearchPos.CurX;
                var NumX1 = SearchPos.CurX;

                switch( NumJc )
                {
                    case align_Right:
                    {
                        NumX0 -= this.Numbering.WidthNum;
                        break;
                    }
                    case align_Center:
                    {
                        NumX0 -= this.Numbering.WidthNum / 2;
                        NumX1 += this.Numbering.WidthNum / 2;
                        break;
                    }
                    case align_Left:
                    default:
                    {
                        NumX1 += this.Numbering.WidthNum;
                        break;
                    }
                }

                if ( SearchPos.X >= NumX0 && SearchPos.X <= NumX1 )
                {
                    SearchPos.Numbering = true;
                }
            }

            SearchPos.CurX += this.Numbering.WidthVisible;
        }

        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( true === Item.Get_ParaContentPosByXY( SearchPos, 1, CurLine, CurRange, StepEnd ) )
                SearchPos.Pos.Update( CurPos, 0 );
        }

        // По Х попали в какой-то элемент, проверяем по Y
        if ( true === SearchPos.InText && Y >= this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent - 0.01 && Y <= this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap + 0.01 )
            SearchPos.InText = true;
        else
            SearchPos.InText = false;

        SearchPos.Line = CurLine;

        return SearchPos;
    },

    Cursor_GetPos : function()
    {
        return { X : this.CurPos.RealX, Y : this.CurPos.RealY };
    },

    Cursor_MoveLeft : function(Count, AddToSelect, Word)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( 0 == Count || !Count )
                return;

            var absCount = ( Count < 0 ? -Count : Count );

            for ( var Index = 0; Index < absCount; Index++ )
            {
                if ( false === this.Internal_MoveCursorBackward(AddToSelect, Word) )
                    return false;
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;

            return true;
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var EndSelectionPos   = this.Get_ParaContentPos( true, false );
                var StartSelectionPos = this.Get_ParaContentPos( true, true );

                if ( true !== AddToSelect )
                {
                    // Найдем левую точку селекта
                    var SelectPos = StartSelectionPos;
                    if ( StartSelectionPos.Compare( EndSelectionPos ) > 0 )
                        SelectPos = EndSelectionPos;

                    this.Selection_Remove();
                    this.Set_ParaContentPos( SelectPos, -1, true );
                }
                else
                {
                    var SearchPos = new CParagraphSearchPos();

                    if ( true === Word )
                        this.Get_WordStartPos( SearchPos, EndSelectionPos );
                    else
                        this.Get_LeftPos( SearchPos, EndSelectionPos );

                    if ( true === SearchPos.Found )
                    {
                        this.Set_SelectionContentPos( StartSelectionPos, SearchPos.Pos );
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            else
            {
                var SearchPos  = new CParagraphSearchPos();
                var ContentPos = this.Get_ParaContentPos( false, false );

                if ( true === Word )
                    this.Get_WordStartPos( SearchPos, ContentPos );
                else
                    this.Get_LeftPos( SearchPos, ContentPos );

                if ( true === AddToSelect )
                {
                    if ( true === SearchPos.Found )
                    {
                        // Селекта еще нет, добавляем с текущей позиции
                        this.Selection.Use    = true;
                        this.Set_SelectionContentPos( ContentPos, SearchPos.Pos );
                    }
                    else
                    {
                        this.Selection.Use = false;
                        return false;
                    }
                }
                else
                {
                    if ( true === SearchPos.Found )
                    {
                        this.Set_ParaContentPos( SearchPos.Pos, -1, true );
                    }
                    else
                    {
                        return false;
                    }
                }
            }

            // Обновляем текущую позицию X,Y. Если есть селект, тогда обновляем по концу селекта
            if ( true === this.Selection.Use )
            {
                var SelectionEndPos = this.Get_ParaContentPos( true, false );
                this.Set_ParaContentPos( SelectionEndPos, -1, false );
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;

            return true;
        }
    },

    Cursor_MoveRight : function(Count, AddToSelect, Word)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( 0 == Count || !Count )
                return;

            var absCount = ( Count < 0 ? -Count : Count );

            for ( var Index = 0; Index < absCount; Index++ )
            {
                if ( false === this.Internal_MoveCursorForward(AddToSelect, Word) )
                    return false;
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;

            return true;
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var EndSelectionPos   = this.Get_ParaContentPos( true, false );
                var StartSelectionPos = this.Get_ParaContentPos( true, true );

                if ( true !== AddToSelect )
                {
                    // Проверим, попал ли конец параграфа в выделение
                    if ( true === this.Selection_CheckParaEnd() )
                    {
                        this.Selection_Remove();
                        this.Cursor_MoveToEndPos( false );
                        return false;
                    }
                    else
                    {
                        // Найдем левую точку селекта
                        var SelectPos = EndSelectionPos;
                        if ( StartSelectionPos.Compare( EndSelectionPos ) > 0 )
                            SelectPos = StartSelectionPos;

                        this.Selection_Remove();

                        this.Set_ParaContentPos( SelectPos, -1, true );
                    }
                }
                else
                {
                    var SearchPos = new CParagraphSearchPos();

                    if ( true === Word )
                        this.Get_WordEndPos( SearchPos, EndSelectionPos, true );
                    else
                        this.Get_RightPos( SearchPos, EndSelectionPos, true );

                    if ( true === SearchPos.Found )
                    {
                        this.Set_SelectionContentPos( StartSelectionPos, SearchPos.Pos );
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            else
            {
                var SearchPos  = new CParagraphSearchPos();
                var ContentPos = this.Get_ParaContentPos( false, false );

                if ( true === Word )
                    this.Get_WordEndPos( SearchPos, ContentPos, AddToSelect );
                else
                    this.Get_RightPos( SearchPos, ContentPos, AddToSelect );

                if ( true === AddToSelect )
                {
                    if ( true === SearchPos.Found )
                    {
                        // Селекта еще нет, добавляем с текущей позиции
                        this.Selection.Use    = true;
                        this.Set_SelectionContentPos( ContentPos, SearchPos.Pos );
                    }
                    else
                    {
                        this.Selection.Use = false;
                        return false;
                    }
                }
                else
                {
                    if ( true === SearchPos.Found )
                    {
                        this.Set_ParaContentPos( SearchPos.Pos, -1, true );
                    }
                    else
                    {
                        return false;
                    }
                }
            }

            // Обновляем текущую позицию X,Y. Если есть селект, тогда обновляем по концу селекта
            if ( true === this.Selection.Use )
            {
                var SelectionEndPos = this.Get_ParaContentPos( true, false );
                this.Set_ParaContentPos( SelectionEndPos, -1, false );
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;

            return true;
        }
    },

    Cursor_MoveAt : function(X,Y, bLine, bDontChangeRealPos, PageNum)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var TempPos = this.Internal_GetContentPosByXY( X, Y, bLine, PageNum );
            var Pos  = TempPos.Pos;
            var Line = TempPos.Line;

            if ( undefined !== this.Content[TempPos.Pos2] && para_Math === this.Content[TempPos.Pos2].Type )
            {
                this.Content[TempPos.Pos2].Cursor_MoveAt( X, Y );
                this.CurPos.ContentPos2 = TempPos.Pos2;
            }
            else
                this.CurPos.ContentPos2 = -1;

            if ( -1 != Pos )
            {
                this.Set_ContentPos( Pos, true, Line );
            }

            this.Internal_Recalculate_CurPos(Pos, false, false, false );

            if ( bDontChangeRealPos != true )
            {
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }

            if ( true != bLine )
            {
                this.CurPos.RealX = X;
                this.CurPos.RealY = Y;
            }
        }
        else
        {
            var SearchPosXY = this.Get_ParaContentPosByXY( X, Y, PageNum, bLine, false );

            this.Set_ParaContentPos( SearchPosXY.Pos, SearchPosXY.Line, false );
            this.Internal_Recalculate_CurPos(-1, false, false, false );

            if ( bDontChangeRealPos != true )
            {
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }

            if ( true != bLine )
            {
                this.CurPos.RealX = X;
                this.CurPos.RealY = Y;
            }
        }
    },

    // Получаем по заданной позиции элемент текста
    Get_RunElementByPos : function(ContentPos)
    {
        var CurPos = ContentPos.Get(0);
        var ContentLen = this.Content.length;

        // Сначала ищем в текущем элементе
        var Element = this.Content[CurPos].Get_RunElementByPos( ContentPos, 1 );

        // Если заданная позиция была последней в текущем элементе, то ищем в следующем
        while ( null === Element )
        {
            CurPos++;

            if ( CurPos >= ContentLen )
                break;

            Element = this.Content[CurPos].Get_RunElementByPos();
        }

        return Element;
    },

    Get_LeftPos : function(SearchPos, ContentPos)
    {
        var Depth  = 0;
        var CurPos = ContentPos.Get(Depth);

        this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, true);
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

    Get_RightPos : function(SearchPos, ContentPos, StepEnd)
    {
        var Depth  = 0;
        var CurPos = ContentPos.Get(Depth);

        this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, true, StepEnd);
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

    Get_WordStartPos : function(SearchPos, ContentPos)
    {
        var Depth  = 0;
        var CurPos = ContentPos.Get(Depth);

        this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, true);

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

        // Случай, когда слово шло с самого начала параграфа
        if ( true === SearchPos.Shift )
        {
            SearchPos.Found = true;
        }
    },

    Get_WordEndPos : function(SearchPos, ContentPos, StepEnd)
    {
        var Depth  = 0;
        var CurPos = ContentPos.Get(Depth);

        this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, true, StepEnd);

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

        // Случай, когда слово шло с самого начала параграфа
        if ( true === SearchPos.Shift )
        {
            SearchPos.Found = true;
        }
    },

    Get_EndRangePos : function(SearchPos, ContentPos)
    {
        var LinePos = this.Get_ParaPosByContentPos(ContentPos);

        var CurLine  = LinePos.Line;
        var CurRange = LinePos.Range;

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        SearchPos.Line = CurLine;

        // Ищем в данном отрезке
        for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
        {
            var Item = this.Content[CurPos];

            if ( true === Item.Get_EndRangePos( CurLine, CurRange, SearchPos, 1 ) )
                SearchPos.Pos.Update( CurPos, 0 );
        }
    },

    Get_StartRangePos : function(SearchPos, ContentPos)
    {
        var LinePos = this.Get_ParaPosByContentPos(ContentPos);

        var CurLine  = LinePos.Line;
        var CurRange = LinePos.Range;

        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos   = Range.EndPos;

        SearchPos.Line = CurLine;

        // Ищем в данном отрезке
        for ( var CurPos = EndPos; CurPos >= StartPos; CurPos-- )
        {
            var Item = this.Content[CurPos];

            if ( true === Item.Get_StartRangePos( CurLine, CurRange, SearchPos, 1 ) )
                SearchPos.Pos.Update( CurPos, 0 );
        }
    },

    Get_StartPos : function()
    {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;

        ContentPos.Update( 0, Depth );

        this.Content[0].Get_StartPos( ContentPos, Depth + 1 );
        return ContentPos;
    },

    Get_EndPos : function(BehindEnd)
    {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;

        var ContentLen = this.Content.length;
        ContentPos.Update( ContentLen - 1, Depth );

        this.Content[ContentLen - 1].Get_EndPos( BehindEnd, ContentPos, Depth + 1 );
        return ContentPos;
    },

    Cursor_MoveUp : function(Count, AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var CursorPos_max = this.Internal_GetEndPos();
            var CursorPos_min = this.Internal_GetStartPos();

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( !Count || 0 == Count )
                return;

            var absCount = ( Count < 0 ? -Count : Count );

            // Пока сделаем для Count = 1
            var CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

            var Result = true;
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    this.Set_ContentPos( this.Selection.EndPos, true, -1 );

                    // Пока сделаем для Count = 1
                    CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                    this.RecalculateCurPos();
                    this.CurPos.RealY = this.CurPos.Y;

                    if ( 0 == CurLine )
                    {
                        // Переходим в предыдущий элеменет документа
                        Result = false;
                        this.Selection.EndPos = this.Internal_GetStartPos();
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                        this.CurPos.RealY = this.CurPos.Y;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }

                    if ( this.Selection.StartPos == this.Selection.EndPos )
                    {
                        this.Selection_Remove();
                        this.Selection.Use = false;

                        this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                        this.RecalculateCurPos();

                        return Result;
                    }
                }
                else
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    this.Set_ContentPos( StartPos, true, -1 );
                    this.CurPos.ContentPos2 = -1;

                    this.Selection_Remove();

                    // Пока сделаем для Count = 1
                    CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                    this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;

                    if ( 0 == CurLine )
                    {
                        // Переходим в предыдущий элеменет документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                        this.CurPos.RealX = this.CurPos.X;
                        this.CurPos.RealY = this.CurPos.Y;
                    }

                }
            }
            else if ( true === AddToSelect )
            {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;

                // Пока сделаем для Count = 1
                CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;

                if ( 0 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                    this.Selection.EndPos = this.Internal_GetStartPos();
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return Result;
                }
            }
            else
            {
                var CurPos2     = this.CurPos.ContentPos2;
                var MathElement = this.Content[CurPos2];
                if ( undefined !== MathElement && para_Math === MathElement.Type )
                {
                    if ( true === MathElement.Cursor_MoveUp(false) )
                    {
                        if ( true === MathElement.Selection_IsUse() && false === MathElement.Selection_IsEmpty() )
                            this.Internal_SelectMath( CurPos2 );

                        return true;
                    }
                    else
                    {
                        this.CurPos.ContentPos2 = -1;
                    }
                }

                if ( 0 == CurLine )
                {
                    // Возвращяем значение false, это означает, что надо перейти в
                    // предыдущий элемент контента документа.
                    return false;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }

            return Result;
        }
        else
        {
            var Result = true;
            if ( true === this.Selection.Use )
            {
                var SelectionStartPos = this.Get_ParaContentPos( true , true );
                var SelectionEndPos   = this.Get_ParaContentPos( true , false );

                if ( true === AddToSelect )
                {
                    var LinePos = this.Get_ParaPosByContentPos( SelectionEndPos );
                    var CurLine = LinePos.Line;

                    if ( 0 == CurLine )
                    {
                        EndPos = this.Get_StartPos();

                        // Переходим в предыдущий элемент документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                        EndPos = this.Get_ParaContentPos(false, false);
                    }

                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( SelectionStartPos, EndPos );
                }
                else
                {
                    var TopPos = SelectionStartPos;
                    if ( SelectionStartPos.Compare( SelectionEndPos ) > 0 )
                        TopPos = SelectionEndPos;

                    var LinePos = this.Get_ParaPosByContentPos( TopPos );
                    var CurLine = LinePos.Line;

                    // Пересчитаем координату точки TopPos
                    this.Set_ParaContentPos( TopPos, CurLine, false );

                    this.Internal_Recalculate_CurPos(0, true, false, false );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;

                    this.Selection_Remove();

                    if ( 0 == CurLine )
                    {
                        return false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    }
                }
            }
            else
            {
                var LinePos = this.Get_CurrentParaPos();
                var CurLine = LinePos.Line;

                if ( true === AddToSelect )
                {
                    var StartPos = this.Get_ParaContentPos(false, false);
                    var EndPos   = null;

                    if ( 0 == CurLine )
                    {
                        EndPos = this.Get_StartPos();

                        // Переходим в предыдущий элемент документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                        EndPos = this.Get_ParaContentPos(false, false);
                    }

                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( StartPos, EndPos );
                }
                else
                {
                    if ( 0 == CurLine )
                    {
                        // Возвращяем значение false, это означает, что надо перейти в
                        // предыдущий элемент контента документа.
                        return false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine - 1, true, true );
                    }
                }
            }

            return Result;
        }
    },

    Cursor_MoveDown : function(Count, AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var CursorPos_max = this.Internal_GetEndPos();
            var CursorPos_min = this.Internal_GetStartPos();

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( !Count || 0 == Count )
                return;

            var absCount = ( Count < 0 ? -Count : Count );

            // Пока сделаем для Count = 1
            var CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

            var Result = true;
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    this.Set_ContentPos( this.Selection.EndPos, true, -1 );

                    // Пока сделаем для Count = 1
                    CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                    this.RecalculateCurPos();
                    this.CurPos.RealY = this.CurPos.Y;

                    if ( this.Lines.length - 1 == CurLine )
                    {
                        // Переходим в предыдущий элеменет документа
                        Result = false;
                        this.Selection.EndPos = this.Content.length - 1;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                        this.CurPos.RealY = this.CurPos.Y;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }

                    if ( this.Selection.StartPos == this.Selection.EndPos )
                    {
                        this.Selection_Remove();
                        this.Selection.Use = false;

                        this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                        this.RecalculateCurPos();

                        return Result;
                    }
                }
                else
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( EndPos, CursorPos_max ) ), true, -1 );
                    this.Selection_Remove();

                    // Пока сделаем для Count = 1
                    CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                    this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;

                    if ( this.Lines.length - 1 == CurLine )
                    {
                        // Переходим в предыдущий элеменет документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                        this.CurPos.RealX = this.CurPos.X;
                        this.CurPos.RealY = this.CurPos.Y;
                    }

                }
            }
            else if ( AddToSelect )
            {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;

                // Пока сделаем для Count = 1
                CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;

                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;

                if ( this.Lines.length - 1 == CurLine )
                {
                    // Переходим в предыдущий элеменет документа
                    Result = false;
                    this.Selection.EndPos = this.Content.length - 1;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return Result;
                }
            }
            else
            {
                var CurPos2     = this.CurPos.ContentPos2;
                var MathElement = this.Content[CurPos2];
                if ( undefined !== MathElement && para_Math === MathElement.Type )
                {
                    if ( true === MathElement.Cursor_MoveDown(false) )
                    {
                        if ( true === MathElement.Selection_IsUse() && false === MathElement.Selection_IsEmpty() )
                            this.Internal_SelectMath( CurPos2 );

                        return true;
                    }
                    else
                    {
                        this.CurPos.ContentPos2 = -1;
                    }
                }

                if ( this.Lines.length - 1 == CurLine )
                {
                    // Возвращяем значение false, это означает, что надо перейти в
                    // предыдущий элемент контента документа.
                    return false;
                }
                else
                {
                    this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }

            return Result;
        }
        else
        {
            var Result = true;
            if ( true === this.Selection.Use )
            {
                var SelectionStartPos = this.Get_ParaContentPos( true , true );
                var SelectionEndPos   = this.Get_ParaContentPos( true , false );

                if ( true === AddToSelect )
                {
                    var LinePos = this.Get_ParaPosByContentPos( SelectionEndPos );
                    var CurLine = LinePos.Line;

                    if ( this.Lines.length - 1 == CurLine )
                    {
                        EndPos = this.Get_EndPos(true);

                        // Переходим в предыдущий элемент документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                        EndPos = this.Get_ParaContentPos(false, false);
                    }

                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( SelectionStartPos, EndPos );
                }
                else
                {
                    var BottomPos = SelectionEndPos;
                    if ( SelectionStartPos.Compare( SelectionEndPos ) > 0 )
                        BottomPos = SelectionStartPos;

                    var LinePos = this.Get_ParaPosByContentPos( BottomPos );
                    var CurLine = LinePos.Line;

                    // Пересчитаем координату BottomPos
                    this.Set_ParaContentPos( BottomPos, CurLine, false );

                    this.Internal_Recalculate_CurPos(0, true, false, false );
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;

                    this.Selection_Remove();

                    if ( this.Lines.length - 1 == CurLine )
                    {
                        return false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    }
                }
            }
            else
            {
                var LinePos = this.Get_CurrentParaPos();
                var CurLine = LinePos.Line;

                if ( true === AddToSelect )
                {
                    var StartPos = this.Get_ParaContentPos(false, false);
                    var EndPos   = null;

                    if ( this.Lines.length - 1 == CurLine )
                    {
                        EndPos = this.Get_EndPos(true);

                        // Переходим в предыдущий элемент документа
                        Result = false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                        EndPos = this.Get_ParaContentPos(false, false);
                    }

                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( StartPos, EndPos );
                }
                else
                {
                    if ( this.Lines.length - 1 == CurLine )
                    {
                        // Возвращяем значение false, это означает, что надо перейти в
                        // предыдущий элемент контента документа.
                        return false;
                    }
                    else
                    {
                        this.Cursor_MoveAt( this.CurPos.RealX, CurLine + 1, true, true );
                    }
                }
            }

            return Result;
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var CursorPos_max = this.Internal_GetEndPos();
            var CursorPos_min = this.Internal_GetStartPos();

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                    this.Set_ContentPos( this.Selection.EndPos, true, -1 );
                else
                {
                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( CursorPos_max, ( this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos ) ) ), true, -1 );
                    this.Selection_Remove();
                }
            }

            var CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;
            var LineEndPos =  ( CurLine >= this.Lines.length - 1 ? this.Internal_GetEndPos() : this.Lines[CurLine + 1].StartPos - 1 );

            if ( true === this.Selection.Use && true === AddToSelect )
            {
                this.Selection.EndPos = LineEndPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return;
                }
            }
            else if ( AddToSelect )
            {
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use      = true;

                this.Selection.EndPos = LineEndPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return;
                }
            }
            else
            {
                this.Set_ContentPos( LineEndPos, true, -1 );

                this.RecalculateCurPos();
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var EndSelectionPos   = this.Get_ParaContentPos( true, false );
                var StartSelectionPos = this.Get_ParaContentPos( true, true );

                if ( true === AddToSelect )
                {
                    var SearchPos = new CParagraphSearchPos();
                    this.Get_EndRangePos( SearchPos, EndSelectionPos );

                    this.Set_SelectionContentPos( StartSelectionPos, SearchPos.Pos );
                }
                else
                {
                    var RightPos = EndSelectionPos;
                    if ( EndSelectionPos.Compare( StartSelectionPos ) < 0 )
                        RightPos = StartSelectionPos;

                    var SearchPos  = new CParagraphSearchPos();
                    this.Get_EndRangePos( SearchPos, RightPos );

                    this.Selection_Remove();

                    this.Set_ParaContentPos( SearchPos.Pos, SearchPos.Line, false );
                }
            }
            else
            {
                var SearchPos  = new CParagraphSearchPos();
                var ContentPos = this.Get_ParaContentPos( false, false );
                this.Get_EndRangePos( SearchPos, ContentPos );

                if ( true === AddToSelect )
                {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( ContentPos, SearchPos.Pos );
                }
                else
                {
                    this.Set_ParaContentPos( SearchPos.Pos, SearchPos.Line, false );
                }
            }

            // Обновляем текущую позицию X,Y. Если есть селект, тогда обновляем по концу селекта
            if ( true === this.Selection.Use )
            {
                var SelectionEndPos = this.Get_ParaContentPos( true, false );
                this.Set_ParaContentPos( SelectionEndPos, -1, false );
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var CursorPos_max = this.Internal_GetEndPos();
            var CursorPos_min = this.Internal_GetStartPos();

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                    this.Set_ContentPos( this.Selection.EndPos, true, -1 );
                else
                {
                    this.Set_ContentPos( ( this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos ), true, -1 );
                    this.Selection_Remove();
                }
            }

            var CurLine = this.Internal_Get_ParaPos_By_Pos( this.CurPos.ContentPos).Line;
            var LineStartPos = this.Lines[CurLine].StartPos;

            if ( true === this.Selection.Use && true === AddToSelect )
            {
                this.Selection.EndPos = LineStartPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return;
                }
            }
            else if ( AddToSelect )
            {
                this.Selection.EndPos = LineStartPos;

                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use      = true;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return;
                }
            }
            else
            {
                this.Set_ContentPos( LineStartPos, true, -1 );

                this.RecalculateCurPos();
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;

            }
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var EndSelectionPos   = this.Get_ParaContentPos( true, false );
                var StartSelectionPos = this.Get_ParaContentPos( true, true );

                if ( true === AddToSelect )
                {
                    var SearchPos = new CParagraphSearchPos();
                    this.Get_StartRangePos( SearchPos, EndSelectionPos );

                    this.Set_SelectionContentPos( StartSelectionPos, SearchPos.Pos );
                }
                else
                {
                    var LeftPos = StartSelectionPos;
                    if ( StartSelectionPos.Compare( EndSelectionPos ) > 0 )
                        LeftPos = EndSelectionPos;

                    var SearchPos  = new CParagraphSearchPos();
                    this.Get_StartRangePos( SearchPos, LeftPos );

                    this.Selection_Remove();

                    this.Set_ParaContentPos( SearchPos.Pos, SearchPos.Line, false );
                }
            }
            else
            {
                var SearchPos  = new CParagraphSearchPos();
                var ContentPos = this.Get_ParaContentPos( false, false );

                this.Get_StartRangePos( SearchPos, ContentPos );

                if ( true === AddToSelect )
                {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( ContentPos, SearchPos.Pos );
                }
                else
                {
                    this.Set_ParaContentPos( SearchPos.Pos, SearchPos.Line, false );
                }
            }

            // Обновляем текущую позицию X,Y. Если есть селект, тогда обновляем по концу селекта
            if ( true === this.Selection.Use )
            {
                var SelectionEndPos = this.Get_ParaContentPos( true, false );
                this.Set_ParaContentPos( SelectionEndPos, -1, false );
            }

            this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );

            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }
    },

    Cursor_MoveToStartPos : function(AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( true === AddToSelect )
            {
                if ( true === this.Selection.Use )
                {
                    var MathElement = this.Content[this.Selection.StartPos2];
                    if ( undefined !== MathElement && para_Math === MathElement.Type )
                        this.Selection.StartPos = this.Selection.StartPos2;
                    else
                        this.Selection.StartPos2 = -1;
                }
                else
                {
                    var MathElement = this.Content[this.CurPos.ContentPos2];
                    if ( undefined !== MathElement && para_Math === MathElement.Type )
                    {
                        this.Selection.StartPos  = this.CurPos.ContentPos2;
                        this.Selection.StartPos2 = this.CurPos.ContentPos2;
                    }
                    else
                    {
                        this.Selection.StartPos  = this.CurPos.ContentPos;
                        this.Selection.StartPos2 = -1;
                    }
                }

                this.Selection.Use   = true;
                this.Selection.Start = false;

                this.Selection.EndPos  = 0;
                this.Selection.EndPos2 = -1;

                this.Set_ContentPos( this.Internal_GetStartPos(), true, -1 );
                this.CurPos.ContentPos2 = -1;
            }
            else
            {
                this.Selection.Use = false;
                this.Set_ContentPos( this.Internal_GetStartPos(), true, -1 );
                this.CurPos.ContentPos2 = -1;
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                var StartPos = null;

                if ( true === this.Selection.Use )
                    StartPos = this.Get_ParaContentPos( true, true );
                else
                    StartPos = this.Get_ParaContentPos( false, false );

                var EndPos = this.Get_StartPos();

                this.Selection.Use   = true;
                this.Selection.Start = false;

                this.Set_SelectionContentPos( StartPos, EndPos );
            }
            else
            {
                this.Selection.Use   = false;
                this.Selection.Start = false;

                this.CurPos.ContentPos = 0;
                this.Content[0].Cursor_MoveToStartPos();
                this.Correct_ContentPos(false);
            }
        }
    },

    Cursor_MoveToEndPos : function(AddToSelect, StartSelectFromEnd)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( true === AddToSelect )
            {
                if ( true === this.Selection.Use )
                {
                    var MathElement = this.Content[this.Selection.StartPos2];
                    if ( undefined !== MathElement && para_Math === MathElement.Type )
                        this.Selection.StartPos = this.Selection.StartPos2;
                    else
                        this.Selection.StartPos2 = -1;
                }
                else
                {
                    var MathElement = this.Content[this.CurPos.ContentPos2];
                    if ( undefined !== MathElement && para_Math === MathElement.Type )
                    {
                        this.Selection.StartPos  = this.CurPos.ContentPos2;
                        this.Selection.StartPos2 = this.CurPos.ContentPos2;
                    }
                    else
                    {
                        this.Selection.StartPos  = this.CurPos.ContentPos;
                        this.Selection.StartPos2 = -1;
                    }
                }

                this.Selection.Use   = true;
                this.Selection.Start = false;

                this.Selection.EndPos  = this.Content.length - 1;
                this.Selection.EndPos2 = -1;

                this.Set_ContentPos( this.Internal_GetEndPos(), true, -1 );
                this.CurPos.ContentPos2 = -1;
            }
            else
            {
                this.Selection.Use = false;
                this.Set_ContentPos( this.Internal_GetEndPos(), true, -1 );
                this.CurPos.ContentPos2 = -1;
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                var StartPos = null;

                if ( true === this.Selection.Use )
                    StartPos = this.Get_ParaContentPos( true, true );
                else
                    StartPos = this.Get_ParaContentPos( false, false );

                var EndPos = this.Get_EndPos(true);

                this.Selection.Use   = true;
                this.Selection.Start = false;

                this.Set_SelectionContentPos( StartPos, EndPos );
            }
            else
            {
                if ( true === StartSelectFromEnd )
                {
                    this.Selection.Use   = true;
                    this.Selection.Start = false;

                    this.Selection.StartPos = this.Content.length - 1;
                    this.Selection.EndPos   = this.Content.length - 1;

                    this.CurPos.ContentPos  = this.Content.length - 1;

                    this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(true);
                }
                else
                {
                    this.Selection.Use   = false;
                    this.Selection.Start = false;

                    this.CurPos.ContentPos = this.Content.length - 1;
                    this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                    this.Correct_ContentPos(false);
                }
            }
        }
    },

    Cursor_MoveToNearPos : function(NearPos)
    {
        this.Selection.Use = false;
        this.Set_ContentPos( NearPos.ContentPos, true, -1 );
        this.CurPos.ContentPos2 = -1;
    },

    Cursor_MoveUp_To_LastRow : function(X, Y, AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;

            // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
            this.Cursor_MoveAt( X, this.Lines.length - 1, true, true, this.PageNum );

            if ( true === AddToSelect )
            {
                if ( false === this.Selection.Use )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.Content.length - 1;
                }
                this.Selection.EndPos = this.CurPos.ContentPos;
            }
        }
        else
        {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;

            // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
            this.Cursor_MoveAt( X, this.Lines.length - 1, true, true, this.PageNum );

            if ( true === AddToSelect )
            {
                if ( false === this.Selection.Use )
                {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( this.Get_EndPos(true), this.Get_ParaContentPos( false, false ) );
                }
                else
                {
                    this.Set_SelectionContentPos( this.Get_ParaContentPos( true, true ), this.Get_ParaContentPos( false, false ) );
                }
            }
        }
    },

    Cursor_MoveDown_To_FirstRow : function(X, Y, AddToSelect)
    {
        if ( true !== Debug_ParaRunMode )
        {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;

            // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
            this.Cursor_MoveAt( X, 0, true, true, this.PageNum );

            if ( true === AddToSelect )
            {
                if ( false === this.Selection.Use )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.Internal_GetStartPos();
                }
                this.Selection.EndPos = this.CurPos.ContentPos;
            }
        }
        else
        {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;

            // Перемещаем курсор в последнюю строку, с позицией, самой близкой по X
            var CurContentPos = this.Cursor_MoveAt( X, 0, true, true, this.PageNum );

            if ( true === AddToSelect )
            {
                if ( false === this.Selection.Use )
                {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos( this.Get_StartPos(), this.Get_ParaContentPos( false, false ) );
                }
                else
                {
                    this.Set_SelectionContentPos( this.Get_ParaContentPos( true, true ), this.Get_ParaContentPos( false, false ) );
                }
            }
        }
    },

    Cursor_MoveTo_Drawing : function(Id, bBefore)
    {
        if ( undefined === bBefore )
            bBefore = true;

        // Ставим курсор перед автофигурой с заданным Id
        var Pos = -1;
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Drawing === Item.Type && Id === Item.Get_Id() )
                Pos = Index;
        }

        if ( -1 === Pos )
            return;

        if ( true != bBefore )
            Pos = Pos + 1;

        this.Set_ContentPos( Pos, false, -1 );
        this.RecalculateCurPos();
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
    },

    Set_ContentPos : function(Pos, bCorrectPos, Line)
    {
        this.CurPos.ContentPos = Math.max( 0, Math.min( this.Content.length - 1, Pos ) );
        this.CurPos.Line       = ( undefined === Line ? -1 : Line );

        if ( false != bCorrectPos )
            this.Internal_Correct_ContentPos();
    },

    Internal_Correct_ContentPos : function()
    {
        // 1. Ищем ближайший справа элемент
        //    Это делается для того, чтобы если мы находимся в конце гиперссылки выйти из нее.
        var Count = this.Content.length;
        var CurPos = this.CurPos.ContentPos;

        var TempPos = CurPos;
        while ( TempPos >= 0 && TempPos < Count && undefined === this.Content[TempPos].CurLine )
            TempPos--;

        var CurLine = ( this.CurPos.Line === -1 ?  ( TempPos >= 0 && TempPos < Count ? this.Content[TempPos].CurLine : -1 ) : this.CurPos.Line );

        while ( CurPos < Count - 1 )
        {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;

            if ( para_Text === ItemType || para_Space === ItemType || para_End === ItemType || para_Tab === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline() ) || para_PageNum === ItemType || para_NewLine === ItemType || para_HyperlinkStart === ItemType || para_Math === ItemType )
                break;

            CurPos++;
        }

        // 2. Ищем ближайший слева (текcт, пробел, картинку, нумерацию и т.д.)
        //    Смещаемся к концу ближайшего левого элемента, чтобы продолжался набор с
        //    настройками левого ближайшего элемента.
        while ( CurPos > 0 )
        {
            CurPos--;
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;
            var bEnd = false;

            if ( para_Text === ItemType || para_Space === ItemType || para_End === ItemType || para_Tab === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline() ) || para_PageNum === ItemType || para_NewLine === ItemType || para_Math === ItemType )
            {
                this.CurPos.ContentPos = CurPos + 1;
                bEnd = true;
            }
            else if ( para_HyperlinkEnd === ItemType )
            {
                while ( CurPos < Count - 1 && para_TextPr === this.Content[CurPos + 1].Type )
                    CurPos++;

                this.CurPos.ContentPos = CurPos + 1;
                bEnd = true;
            }

            if ( true === bEnd )
            {
                TempPos = CurPos;
                while ( TempPos >= 0 && TempPos < Count && undefined === this.Content[TempPos].CurLine )
                    TempPos--;

                var NewLine = ( TempPos >= 0 && TempPos < Count ? this.Content[TempPos].CurLine : -1 );

                if ( NewLine != CurLine && -1 != CurLine )
                    this.CurPos.Line = CurLine;

                return;
            }
        }

        // 3. Если мы попали в начало параграфа, тогда пропускаем все TextPr
        if ( CurPos <= 0 )
        {
            CurPos = 0;
            while ( para_TextPr === this.Content[CurPos].Type || para_CollaborativeChangesEnd === this.Content[CurPos].Type || para_CollaborativeChangesStart === this.Content[CurPos].Type )
                CurPos++;

            this.CurPos.ContentPos = CurPos;
        }
    },

    Get_CurPosXY : function()
    {
        return { X : this.CurPos.RealX, Y : this.CurPos.RealY };
    },

    Is_SelectionUse : function()
    {
        return this.Selection.Use;
    },

    Internal_SelectMath : function(Pos)
    {
        if ( undefined === this.Content[Pos] || para_Math != this.Content[Pos].Type )
            return;

        this.Selection.Use       = true;
        this.Selection.Start     = false;
        this.Selection.StartPos  = Pos;
        this.Selection.EndPos    = Pos + 1;
        this.Selection.StartPos2 = Pos;
        this.Selection.EndPos2   = Pos;

        this.Document_SetThisElementCurrent();
    },

    // Функция определяет начальную позицию курсора в параграфе
    Internal_GetStartPos : function()
    {
        var oPos = this.Internal_FindForward( 0, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math] );
        if ( true === oPos.Found )
            return oPos.LetterPos;

        return 0;
    },

    // Функция определяет конечную позицию в параграфе
    Internal_GetEndPos : function()
    {
        var Res = this.Internal_FindBackward( this.Content.length - 1, [para_End] );
        if ( true === Res.Found )
            return Res.LetterPos;

        return 0;
    },

    Internal_MoveCursorBackward : function (AddToSelect, Word)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.Set_ContentPos( this.Selection.EndPos, true, -1 );
            }
            else
            {
                // В случае селекта, убираем селект и перемещаем курсор в начало селекта
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                var StartPos  = this.Selection.StartPos;
                var EndPos    = this.Selection.EndPos;
                var StartPos2 = this.Selection.StartPos2;
                var EndPos2   = this.Selection.EndPos2;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;

                    var Temp2 = EndPos2;
                    EndPos2   = StartPos2;
                    StartPos2 = Temp2;
                }

                this.Selection_Remove();

                if ( undefined != this.Content[StartPos2] && para_Math === this.Content[StartPos2].Type )
                {
                    this.Set_ContentPos( StartPos, true, -1 );
                    this.CurPos.ContentPos2 = StartPos2;

                    if ( true === this.Content[StartPos2].Cursor_MoveLeft(AddToSelect, Word) )
                    {
                        if ( true === this.Content[StartPos2].Selection_IsUse() && false === this.Content[StartPos2].Selection_IsEmpty() )
                            this.Internal_SelectMath( StartPos2 );
                    }
                }
                else
                    this.Set_ContentPos( StartPos, true, -1 );

                return true;
            }
        }

        if ( true === this.Selection.Use ) // Добавляем к селекту
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return true;
                }

                return true;
            }
            else
            {
                // Надо перейти в предыдущий элемент документа
                return false;
            }

        }
        else if ( true == AddToSelect )
        {
            var oPos;
            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            // Селекта еще нет, добавляем с текущей позиции
            this.Selection.StartPos = this.CurPos.ContentPos;
            this.Selection.Use      = true;

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                return true;
            }
            else
            {
                this.Selection.Use = false;
                // Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else
        {
            var CurPos2  = this.CurPos.ContentPos2;
            var MathItem = this.Content[CurPos2];
            if ( undefined !== MathItem && para_Math === MathItem.Type )
            {
                if ( true === MathItem.Cursor_MoveLeft(false, Word) )
                {
                    if ( true === MathItem.Selection_IsUse() && false === MathItem.Selection_IsEmpty() )
                        this.Internal_SelectMath( CurPos2 );

                    return true;
                }
                else
                {
                    this.CurPos.ContentPos  = CurPos2;
                    this.CurPos.ContensPos2 = -1;
                }
            }

            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindBackward( this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );
            else
                oPos = this.Internal_FindWordStart( this.CurPos.ContentPos - 1, CursorPos_min );

            if ( oPos.Found )
            {
                this.Set_ContentPos( oPos.LetterPos, true, -1 );

                if ( para_Math === oPos.Type )
                {
                    this.CurPos.ContentPos2 = oPos.LetterPos;
                    this.Content[oPos.LetterPos].Cursor_MoveToEndPos();
                }
                else
                    this.CurPos.ContentPos2 = -1;

                return true;
            }
            else
            {
                // Надо перейти в предыдущий элемент документа
                return false;
            }

        }
    },

    Internal_FindWordStart : function(Pos, Pos_min)
    {
        var LetterPos = Pos;

        if ( Pos < Pos_min || Pos >= this.Content.length )
            return { Found : false };

        // На первом этапе ищем первый непробельный ( и не таб ) элемент
        while ( true )
        {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bSpace = false;

            if ( para_TextPr       === Type || para_Space   === Type || para_HyperlinkStart  === Type ||
                 para_HyperlinkEnd === Type || para_Tab     === Type || para_Empty           === Type ||
                 para_CommentStart            === Type || para_CommentEnd                === Type ||
                 para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type ||
                ( para_Text === Type && true === Item.Is_NBSP() )
               )
                bSpace = true;

            if ( true === bSpace )
            {
                LetterPos--;

                if ( LetterPos < 0 )
                    break;
            }
            else
                break;
        }

        if ( LetterPos <= Pos_min )
            return { LetterPos : Pos_min, Found : true, Type : this.Content[Pos_min].Type };

        // На втором этапе мы смотрим на каком элементе мы встали: если это не текст, тогда
        // останавливаемся здесь. В противном случае сдвигаемся назад, пока не попали на первый
        // не текстовый элемент.
        if ( para_Text != this.Content[LetterPos].Type )
            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type };
        else
        {
            var bPunctuation = this.Content[LetterPos].Is_Punctuation();

            var TempPos = LetterPos;

            while ( TempPos > Pos_min )
            {
                TempPos--;
                var Item = this.Content[TempPos]
                var TempType = Item.Type;
                if ( !( true != Item.Is_RealContent() || para_TextPr === TempType ||
                        ( para_Text === TempType && true != Item.Is_NBSP() && ( ( true === bPunctuation && true === Item.Is_Punctuation() ) || ( false === bPunctuation && false === Item.Is_Punctuation() ) ) ) ||
                        para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType
                      )
                   )
                    break;
                else
                    LetterPos = TempPos;
            }

            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type }
        }

        return { Found : false };
    },

    Internal_FindWordEnd : function(Pos, Pos_max)
    {
        var LetterPos = Pos;

        if ( Pos > Pos_max || Pos >= this.Content.length )
            return { Found : false };

        var bFirst = true;
        var bFirstPunctuation = false; // является ли первый найденный символ знаком препинания

        // На первом этапе ищем первый нетекстовый ( и не таб ) элемент
        while ( true )
        {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bText = false;

            if ( para_TextPr          === Type ||
                 para_HyperlinkStart  === Type || para_HyperlinkEnd    === Type ||
                 para_Empty           === Type || ( para_Text === Type && true != Item.Is_NBSP() && ( true === bFirst || ( bFirstPunctuation === Item.Is_Punctuation() ) ) ) ||
                 para_CommentStart            === Type || para_CommentEnd                === Type ||
                 para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type
                )
            bText = true;

            if ( true === bText )
            {
                if ( true === bFirst && para_Text === Type )
                {
                    bFirst = false;
                    bFirstPunctuation = Item.Is_Punctuation();
                }

                LetterPos++;

                if ( LetterPos > Pos_max || LetterPos >= this.Content.length )
                    break;
            }
            else
                break;
        }

        // Первый найденный элемент не текстовый, смещаемся вперед
        if ( true === bFirst )
            LetterPos++;

        if ( LetterPos > Pos_max )
            return { Found : false };

        // На втором этапе мы смотрим на каком элементе мы встали: если это не пробел, тогда
        // останавливаемся здесь. В противном случае сдвигаемся вперед, пока не попали на первый
        // не пробельный элемент.
        if ( !(para_Space === this.Content[LetterPos].Type || ( para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP() ) ) )
            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type };
        else
        {
            var TempPos = LetterPos;
            while ( TempPos < Pos_max )
            {
                TempPos++;
                var Item = this.Content[TempPos]
                var TempType = Item.Type;
                if ( !( true != Item.Is_RealContent() || para_TextPr === TempType || para_Space === this.Content[LetterPos].Type ||
                        ( para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP() ) ||
                        para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType
                      )
                   )
                    break;
                else
                    LetterPos = TempPos;
            }

            return { LetterPos : LetterPos, Found : true, Type : this.Content[LetterPos].Type }
        }

        return { Found : false };
    },

    Internal_MoveCursorForward : function (AddToSelect, Word)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.Set_ContentPos( this.Selection.EndPos, false, -1 );
            }
            else
            {
                // В случае селекта, убираем селект и перемещаем курсор в конец селекта
                var StartPos  = this.Selection.StartPos;
                var EndPos    = this.Selection.EndPos;
                var StartPos2 = this.Selection.StartPos2;
                var EndPos2   = this.Selection.EndPos2;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;

                    var Temp2 = EndPos2;
                    EndPos2   = StartPos2;
                    StartPos2 = Temp2;
                }

                this.Selection_Remove();

                if ( undefined != this.Content[EndPos2] && para_Math === this.Content[EndPos2].Type )
                {
                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( EndPos, CursorPos_max ) ), true, -1 );
                    this.CurPos.ContentPos2 = EndPos2;

                    if ( true === this.Content[EndPos2].Cursor_MoveRight(AddToSelect, Word) )
                    {
                        if ( true === this.Content[EndPos2].Selection_IsUse() && false === this.Content[EndPos2].Selection_IsEmpty() )
                            this.Internal_SelectMath( EndPos2 );
                    }
                }
                else
                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( EndPos, CursorPos_max ) ), true, -1 );

                return true;
            }
        }

        if ( true == this.Selection.Use && true == AddToSelect )
        {
            var oPos;

            if ( true != Word )
                oPos = this.Internal_FindForward( this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty] );
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max + 1 );

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                if ( this.Selection.StartPos == this.Selection.EndPos )
                {
                    this.Selection_Remove();
                    this.Selection.Use = false;

                    this.Set_ContentPos( Math.max( CursorPos_min, Math.min( this.Selection.EndPos, CursorPos_max ) ), true, -1 );
                    this.RecalculateCurPos();

                    return;
                }

                return true;
            }
            else
            {
                // Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else if ( true == AddToSelect )
        {
            var oPos;
            if ( true != Word )
                oPos = this.Internal_FindForward( this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty] );
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max + 1 );

            // Селекта еще нет, добавляем с текущей позиции
            this.Selection.StartPos = this.CurPos.ContentPos;
            this.Selection.Use      = true;

            if ( oPos.Found )
            {
                this.Selection.EndPos = oPos.LetterPos;

                return true;
            }
            else
            {
                this.Selection.Use = false;
                // Надо перейти в предыдущий элемент документа
                return false;
            }
        }
        else
        {
            var CurPos2  = this.CurPos.ContentPos2;
            var MathItem = this.Content[CurPos2];
            if ( undefined !== MathItem && para_Math === MathItem.Type )
            {
                if ( true === MathItem.Cursor_MoveRight(false, Word) )
                {
                    if ( true === MathItem.Selection_IsUse() && false === MathItem.Selection_IsEmpty() )
                        this.Internal_SelectMath( CurPos2 );

                    return true;
                }
                else
                {
                    this.CurPos.ContentPos  = CurPos2 + 1;
                    this.CurPos.ContentPos2 = -1;
                }
            }

            var oPos;

            if ( true != Word )
            {
                oPos = this.Internal_FindForward( this.CurPos.ContentPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );
                if ( oPos.Found )
                    oPos.LetterPos++;
            }
            else
                oPos = this.Internal_FindWordEnd( this.CurPos.ContentPos, CursorPos_max );

            if ( oPos.Found )
            {
                this.Set_ContentPos( oPos.LetterPos, true, -1 );

                if ( para_Math === oPos.Type )
                {
                    this.CurPos.ContentPos2 = oPos.LetterPos - 1;
                    this.Content[oPos.LetterPos - 1].Cursor_MoveToStartPos();
                }
                else
                    this.CurPos.ContentPos2 = -1;

                return true;
            }
            else
            {
                // Надо перейти в следующий элемент документа
                return false;
            }

        }
    },

    Internal_Clear_EmptyTextPr : function()
    {
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count - 1; Pos++ )
        {
            if ( para_TextPr === this.Content[Pos].Type && para_TextPr === this.Content[Pos + 1].Type )
            {
                this.Internal_Content_Remove( Pos );
                Pos--;
                Count--;
            }
        }
    },

    Internal_AddTextPr : function(TextPr)
    {
        if ( undefined != TextPr.FontFamily )
        {
            var FName  = TextPr.FontFamily.Name;
            var FIndex = TextPr.FontFamily.Index;

            TextPr.RFonts = new CRFonts();
            TextPr.RFonts.Ascii    = { Name : FName, Index : FIndex };
            TextPr.RFonts.EastAsia = { Name : FName, Index : FIndex };
            TextPr.RFonts.HAnsi    = { Name : FName, Index : FIndex };
            TextPr.RFonts.CS       = { Name : FName, Index : FIndex };
        }

        if ( true !== Debug_ParaRunMode )
        {
            this.Internal_Clear_EmptyTextPr();

            if ( true === this.ApplyToAll )
            {
                this.Internal_Content_Add( 0, new ParaTextPr( TextPr ) );

                // Внутри каждого TextPr меняем те настройки, которые пришли в TextPr. Например,
                // у нас изменен только размер шрифта, то изменяем запись о размере шрифта.
                for ( var Pos = 0; Pos < this.Content.length; Pos++ )
                {
                    if ( this.Content[Pos].Type == para_TextPr )
                        this.Content[Pos].Apply_TextPr( TextPr );
                }

                // Выставляем настройки для символа параграфа
                this.TextPr.Apply_TextPr( TextPr );

                return;
            }

            // найдем текущую позицию
            var Line   = this.Content;
            var CurPos = this.CurPos.ContentPos;
            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                // Если селект продолжается до конца параграфа, не ставим отметку в конце
                var LastPos = this.Internal_GetEndPos();
                var bEnd = false;
                if ( EndPos > LastPos )
                {
                    EndPos = LastPos;
                    bEnd = true;
                }

                // Рассчитываем шрифт, который используется после слова
                var TextPr_end   = this.Internal_GetTextPr( EndPos );
                var TextPr_start = this.Internal_GetTextPr( StartPos );
                TextPr_start.Merge( TextPr );

                this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
                if ( false === bEnd )
                    this.Internal_Content_Add( EndPos + 1, new ParaTextPr( TextPr_end ) );
                else
                {
                    // Выставляем настройки для символа параграфа
                    this.TextPr.Apply_TextPr( TextPr );
                }

                // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
                // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
                for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
                {
                    if ( this.Content[Pos].Type == para_TextPr )
                    {
                        this.Content[Pos].Apply_TextPr( TextPr );
                    }
                }

                return;
            }

            // При изменении шрифта ведем себе следующим образом:
            // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
            // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
            // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

            var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
            var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
            var CurType = this.Content[CurPos].Type;

            if ( !oEnd.Found )
                return;

            if ( para_End == oEnd.Type )
            {
                // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
                var Pos = oEnd.LetterPos;

                var TextPr_start = this.Internal_GetTextPr( Pos );
                TextPr_start.Merge( TextPr );

                this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
                this.Set_ContentPos( Pos + 1, false, -1 );

                if ( true === this.IsEmpty() && undefined === this.Numbering_Get() )
                {
                    // Выставляем настройки для символа параграфа
                    this.TextPr.Apply_TextPr( TextPr );
                }
            }
            else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
            {
                var TextPr_old = this.Internal_GetTextPr( CurPos );
                var TextPr_new = TextPr_old.Copy();
                TextPr_new.Merge( TextPr );

                this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
                this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

                this.Set_ContentPos( CurPos + 1, false, -1 );
                this.RecalculateCurPos();
            }
            else
            {
                // Мы находимся посередине слова. В начале слова ставим запись о новом шрифте,
                // а в конце слова старый шрифт. Кроме этого, надо удалить все записи о шрифте внутри слова.

                // Найдем начало слова
                var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
                if ( !oWordStart.Found )
                    oWordStart = this.Internal_FindForward( 0, [para_Text] );
                else
                    oWordStart.LetterPos++;

                var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

                if ( !oWordStart.Found || !oWordEnd.Found )
                    return;

                // Рассчитываем настройки, которые используются после слова
                var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
                var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );
                TextPr_start.Merge( TextPr );

                this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
                this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

                this.Set_ContentPos( CurPos + 1, false, -1 );

                // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
                // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
                for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
                {
                    if ( this.Content[Pos].Type == para_TextPr )
                        this.Content[Pos].Apply_TextPr( TextPr );
                }
            }
        }
    },

    Remove_EmptyRuns : function()
    {
        var ContentLen = this.Content.length;
        for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
        {
            var Element = this.Content[CurPos];

            if ( para_Run === Element.Type )
            {
                if ( CurPos !== this.CurPos.ContentPos && true === Element.Is_Empty() )
                {
                    this.Internal_Content_Remove( CurPos );
                    CurPos--;
                    ContentLen--;
                }
            }
            else
                Element.Remove_EmptyRuns();
        }
    },

    Apply_TextPr : function(TextPr)
    {
        // Данная функция работает по следующему принципу: если задано выделение, тогда применяем настройки к
        // выделенной части, а если выделения нет, тогда в текущее положение вставляем пустой ран с заданными настройками
        // и переносим курсор в данный ран.

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos === EndPos )
            {
                var NewElements = this.Content[EndPos].Apply_TextPr( TextPr );

                if ( para_Run === this.Content[EndPos].Type )
                {
                    var CenterRunPos = this.Internal_ReplaceRun( EndPos, NewElements );

                    // TODO: разобраться здесь получше, как правильно обновлять позицию
                    if ( StartPos === this.CurPos.ContentPos )
                        this.CurPos.ContentPos = CenterRunPos;

                    // Подправим селект
                    this.Selection.StartPos = CenterRunPos;
                    this.Selection.EndPos   = CenterRunPos;

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
                    this.Content[CurPos].Apply_TextPr( TextPr );
                }


                var NewElements = this.Content[EndPos].Apply_TextPr( TextPr );
                if ( para_Run === this.Content[EndPos].Type )
                    this.Internal_ReplaceRun( EndPos, NewElements );

                var NewElements = this.Content[StartPos].Apply_TextPr( TextPr );
                if ( para_Run === this.Content[StartPos].Type )
                    this.Internal_ReplaceRun( StartPos, NewElements );

                // Заметим, что здесь не нужно подправлять метки выделения, за счет того, что EndPos - StartPos > 1 и
                // сами метки подправляются в функиях Internal_Content_Add.
            }
        }
        else
        {
            var Pos = this.CurPos.ContentPos;
            var Element = this.Content[Pos];
            var NewElements = Element.Apply_TextPr( TextPr );

            if ( para_Run === Element.Type )
            {
                var CenterRunPos = this.Internal_ReplaceRun( Pos, NewElements );
                this.CurPos.ContentPos = CenterRunPos;
                this.CurPos.Line       = -1;
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
            this.Internal_Content_Add( Pos + 1, CRun );
            CenterRunPos = Pos + 1;
        }
        else
        {
            // Если LRun - null, значит CRun - это и есть тот ран который стоит уже в позиции Pos
        }

        if ( null !== RRun )
            this.Internal_Content_Add( CenterRunPos + 1, RRun );

        return CenterRunPos;
    },

    Internal_AddHyperlink : function(Hyperlink_start)
    {
        // Создаем текстовую настройку для гиперссылки
        var Hyperlink_end = new ParaHyperlinkEnd();
        var RStyle = editor.WordControl.m_oLogicDocument.Get_Styles().Get_Default_Hyperlink();

        if ( true === this.ApplyToAll )
        {
            // TODO: Надо выяснить, нужно ли в данном случае делать гиперссылку
            return;
        }

        var CurPos = this.CurPos.ContentPos;
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            // Если селект продолжается до конца параграфа, не ставим отметку в конце
            var LastPos = this.Internal_GetEndPos();
            if ( EndPos > LastPos )
                EndPos = LastPos;

            var TextPr_end   = this.Internal_GetTextPr( EndPos );
            var TextPr_start = this.Internal_GetTextPr( StartPos );

            TextPr_start.RStyle    = RStyle;
            TextPr_start.Underline = undefined;
            TextPr_start.Color     = undefined;

            this.Internal_Content_Add( EndPos, new ParaTextPr( TextPr_end ) );
            this.Internal_Content_Add( EndPos, Hyperlink_end );
            this.Internal_Content_Add( StartPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( StartPos, Hyperlink_start );

            // Если внутри выделения были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = StartPos + 2; Pos < EndPos + 1; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                {
                    var Item = this.Content[Pos];
                    Item.Set_RStyle( RStyle );
                    Item.Set_Underline( undefined );
                    Item.Set_Color( undefined );
                }
            }

            return;
        }

        return;

        // При изменении шрифта ведем себе следующим образом:
        // 1. Если мы в конце параграфа, тогда добавляем запись о шрифте (применимо к знаку конца параграфа)
        // 2. Если справа или слева стоит пробел (начало параграфа или перенос строки(командный)), тогда ставим метку со шрифтом и фокусим канву.
        // 3. Если мы посередине слова, тогда меняем шрифт для данного слова

        var oEnd   = this.Internal_FindForward ( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine] );
        var oStart = this.Internal_FindBackward( CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine] );
        var CurType = this.Content[CurPos].Type;

        if ( !oEnd.Found )
            return;

        if ( para_End == oEnd.Type )
        {
            // Вставляем запись о новых настройках перед концом параграфа, а текущую позицию выставляем на конец параграфа
            var Pos = oEnd.LetterPos;

            var TextPr_start = this.Internal_GetTextPr( Pos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_start ) );
            this.Set_ContentPos( Pos + 1, false, -1 );
        }
        else if ( para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type )
        {
            var TextPr_old = this.Internal_GetTextPr( CurPos );
            var TextPr_new = TextPr_old.Copy();
            TextPr_new.Merge( TextPr );

            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( CurPos, new ParaTextPr( TextPr_new ) );

            this.Set_ContentPos( CurPos + 1, false, -1 );
            this.RecalculateCurPos();
        }
        else
        {
            // Мы находимся посередине слова. В начале слова ставим запись о новом шрифте,
            // а в конце слова старый шрифт. Кроме этого, надо удалить все записи о шрифте внутри слова.

            // Найдем начало слова
            var oWordStart = this.Internal_FindBackward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine] );
            if ( !oWordStart.Found )
                oWordStart = this.Internal_FindForward( 0, [para_Text] );
            else
                oWordStart.LetterPos++;

            var oWordEnd   = this.Internal_FindForward( CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine] );

            if ( !oWordStart.Found || !oWordEnd.Found )
                return;

            // Рассчитываем настройки, которые используются после слова
            var TextPr_end   = this.Internal_GetTextPr( oWordEnd.LetterPos );
            var TextPr_start = this.Internal_GetTextPr( oWordStart.LetterPos );
            TextPr_start.Merge( TextPr );

            this.Internal_Content_Add( oWordStart.LetterPos, new ParaTextPr( TextPr_start ) );
            this.Internal_Content_Add( oWordEnd.LetterPos + 1 /* из-за предыдущего Internal_Content_Add */, new ParaTextPr( TextPr_end ) );

            this.Set_ContentPos( CurPos + 1, false, -1 );

            // Если внутри слова были изменения текстовых настроек, тогда удаляем только те записи, которые
            // меняются сейчас. Например, у нас изменен только размер шрифта, то удаляем запись о размере шрифта.
            for ( var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++ )
            {
                if ( this.Content[Pos].Type == para_TextPr )
                    this.Content[Pos].Apply_TextPr( TextPr );
            }
        }
    },

    Internal_GetContentPosByXY : function(X,Y, bLine, PageNum, bCheckNumbering)
    {
        if ( this.Lines.length <= 0 )
            return {Pos : 0, End:false, InText : false};

        // Сначала определим на какую строку мы попали

        var PNum = 0;
        if ( "number" == typeof(PageNum) )
        {
            PNum = PageNum - this.PageNum;
        }
        else
            PNum = 0;

        if ( PNum >= this.Pages.length )
        {
            PNum = this.Pages.length - 1;
            bLine = true;
            Y = this.Lines.length - 1;
        }
        else if ( PNum < 0 )
        {
            PNum = 0;
            bLine = true;
            Y = 0;
        }

        var bFindY   = false;
        var CurLine  = this.Pages[PNum].FirstLine;
        var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
        var LastLine = ( PNum >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PNum + 1].FirstLine - 1 );

        if ( true === bLine )
            CurLine = Y;
        else
        {
            while ( !bFindY )
            {
                if ( Y < CurLineY )
                    break;
                if ( CurLine >= LastLine )
                    break;

                CurLine++;
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            }
        }

        // Ищем позицию в строке
        var CurRange = 0;

        var CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;

        var DiffX          = 1000000;//this.XLimit; // километра для ограничения должно хватить
        var NumberingDiffX = 1000000;//this.XLimit;
        var DiffPos = -1;
        var bEnd = false;
        var bInText = false;

        var Result = { Pos : 0, End : false };

        var StartPos   = this.Lines[CurLine].StartPos;
        var ResultLine = -1;
        var Pos2       = StartPos;
        var ItemNum    = StartPos;
        for ( ; ItemNum < this.Content.length; ItemNum++ )
        {
            var Item = this.Content[ItemNum];

            if ( undefined != Item.CurLine )
            {
                if ( CurLine != Item.CurLine )
                    break;

                if ( CurRange != Item.CurRange )
                {
                    CurRange = Item.CurRange;
                    CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                }
            }

            var TempDx = 0;
            var bCheck = false;

            if ( ItemNum === this.Numbering.Pos )
            {
                if ( para_Numbering === this.Numbering.Type )
                {
                    var NumberingItem = this.Numbering;
                    var NumPr = this.Numbering_Get();
                    var NumJc = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;

                    var NumX0 = CurX;
                    var NumX1 = CurX;

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

                    if ( X >= NumX0 && X <= NumX1 )
                        NumberingDiffX = 0;
                }

                CurX += this.Numbering.WidthVisible;

                if ( -1 != DiffPos )
                {
                    DiffX   = Math.abs( X - CurX );
                    DiffPos = ItemNum;
                }
            }

            switch( Item.Type )
            {
                case para_Drawing:
                {
                    if ( Item.DrawingType != drawing_Inline )
                    {
                        bCheck = false;
                        TempDx = 0;
                    }
                    else
                    {
                        TempDx     = Item.WidthVisible;
                        bCheck     = true;
                    }
                    break;
                }
                case para_PageNum:
                case para_Text:
                case para_Math:

                    TempDx = Item.WidthVisible;
                    bCheck = true;
                    break;
                case para_Space:

                    TempDx = Item.WidthVisible;
                    bCheck = true;
                    break;

                case para_Tab:

                    TempDx = Item.WidthVisible;
                    bCheck = true;
                    break;

                case para_NewLine:

                    bCheck = true;
                    TempDx = Item.WidthVisible;
                    break;

                case para_End:

                    bEnd = true;
                    bCheck = true;
                    TempDx = Item.WidthVisible;

                    break;

                case para_TextPr:
                case para_CommentEnd:
                case para_CommentStart:
                case para_CollaborativeChangesEnd:
                case para_CollaborativeChangesStart:
                case para_HyperlinkEnd:
                case para_HyperlinkStart:

                    bCheck = true;
                    TempDx = 0;
                    break;
            }

            if ( bCheck )
            {
                if ( Math.abs( X - CurX ) < DiffX + 0.001 )
                {
                    DiffX = Math.abs( X - CurX );
                    DiffPos = ItemNum;
                }

                if ( true != bEnd && ItemNum === this.Lines[CurLine].EndPos && X > CurX + TempDx && para_NewLine != Item.Type )
                {
                    ResultLine = CurLine;
                    DiffPos = ItemNum + 1;
                }

                // Заглушка для знака параграфа
                if ( bEnd )
                {
                    CurX += TempDx;
                    if ( Math.abs( X - CurX ) < DiffX )
                    {
                        Result.End = true;
                    }

                    break;
                }
            }

            if ( X >= CurX - 0.001 && X <= CurX + TempDx + 0.001 )
            {
                bInText = true;
                Pos2 = ItemNum;
            }

            CurX += TempDx;
        }

        // По Х попали в какой-то элемент, проверяем по Y
        if ( true === bInText && Y >= this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent - 0.01 && Y <= this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap + 0.01 )
            Result.InText = true;
        else
        {
            Result.InText = false;
            Pos2 = ItemNum - 1;
        }

        if ( NumberingDiffX <= DiffX )
            Result.Numbering = true;
        else
            Result.Numbering = false;

        Result.Pos  = DiffPos; // Позиция ближайшего элемента (по его начальной точке)
        Result.Pos2 = Pos2;    // Позиция элемента в который мы попали точно
        Result.Line = ResultLine;

        return Result;
    },

    Internal_GetXYByContentPos : function(Pos)
    {
        return this.Internal_Recalculate_CurPos(Pos, false, false, false);
    },

    Internal_Selection_CheckHyperlink : function()
    {
        // Если у нас начало селекта находится внутри гиперссылки, а конец
        // нет (или наоборот), тогда выделяем всю гиперссылку.

        var Direction = 1;
        var StartPos  = this.Selection.StartPos;
        var EndPos    = this.Selection.EndPos;

        if ( StartPos > EndPos )
        {
            StartPos  = this.Selection.EndPos;
            EndPos    = this.Selection.StartPos;
            Direction = -1;
        }

        var Hyperlink_start = this.Check_Hyperlink2( StartPos );
        var Hyperlink_end   = this.Check_Hyperlink2( EndPos );

        if ( null != Hyperlink_start && Hyperlink_end != Hyperlink_start )
            StartPos = this.Internal_FindBackward( StartPos, [para_HyperlinkStart]).LetterPos;

        if ( null != Hyperlink_end && Hyperlink_end != Hyperlink_start )
            EndPos = this.Internal_FindForward( EndPos, [para_HyperlinkEnd]).LetterPos + 1;

        if ( Direction > 0 )
        {
            this.Selection.StartPos = StartPos;
            this.Selection.EndPos   = EndPos;
        }
        else
        {
            this.Selection.StartPos = EndPos;
            this.Selection.EndPos   = StartPos;
        }
    },

    Check_Hyperlink : function(X, Y, PageNum)
    {
        var Result = this.Internal_GetContentPosByXY( X, Y, false, PageNum, false);
        if ( -1 != Result.Pos && true === Result.InText )
        {
            var Find = this.Internal_FindBackward( Result.Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                return this.Content[Find.LetterPos];
        }

        return null;
    },

    Check_Hyperlink2 : function(Pos, bCheckEnd, bNoSelectCheck)
    {
        if ( undefined === bNoSelectCheck )
            bNoSelectCheck = false;

        if ( undefined === bCheckEnd )
            bCheckEnd = true;

        // TODO : Специальная заглушка, для конца селекта. Неплохо бы переделать.
        if ( true === bCheckEnd && Pos > 0 )
        {
            while ( this.Content[Pos - 1].Type === para_TextPr || this.Content[Pos - 1].Type === para_HyperlinkEnd || this.Content[Pos - 1].Type === para_CollaborativeChangesStart || this.Content[Pos - 1].Type === para_CollaborativeChangesEnd )
            {
                Pos--;

                if ( Pos <= 0 )
                    return null;
            }
        }

        // TODO: специальная заглушка, для случая, когда курсор стоит перед гиперссылкой, чтобы мы определяли данную ситуацию как попадание в гиперссылку
        if ( true === bNoSelectCheck )
        {
            Pos = this.Internal_Correct_HyperlinkPos(Pos);
        }

        var Find = this.Internal_FindBackward( Pos - 1, [para_HyperlinkStart, para_HyperlinkEnd] );
        if ( true === Find.Found && para_HyperlinkStart === Find.Type )
            return this.Content[Find.LetterPos];

        return null;
    },

    Internal_Correct_HyperlinkPos : function(_Pos)
    {
        var Pos = _Pos;
        var Count = this.Content.length;
        while ( Pos < Count )
        {
            var TempType = this.Content[Pos].Type;
            if ( para_HyperlinkStart === TempType || para_TextPr === TempType || para_CollaborativeChangesEnd === TempType || para_CollaborativeChangesStart === TempType  )
                Pos++;
            else
                break;
        }

        return Pos;
    },

    Hyperlink_Add : function(HyperProps)
    {
        var Hyperlink = new ParaHyperlinkStart();
        Hyperlink.Set_Value( HyperProps.Value );

        if ( "undefined" != typeof(HyperProps.ToolTip) && null != HyperProps.ToolTip )
            Hyperlink.Set_ToolTip( HyperProps.ToolTip );

        if ( true === this.Selection.Use )
        {
            this.Add( Hyperlink );
        }
        else if ( null != HyperProps.Text && "" != HyperProps.Text ) // добавлять ссылку, без селекта и с пустым текстом нельзя
        {
            var TextPr_hyper = this.Internal_GetTextPr(this.CurPos.ContentPos);
            var Styles = editor.WordControl.m_oLogicDocument.Get_Styles();
            TextPr_hyper.RStyle    = Styles.Get_Default_Hyperlink();
            TextPr_hyper.Color     = undefined;
            TextPr_hyper.Underline = undefined;

            var TextPr_old = this.Internal_GetTextPr(this.CurPos.ContentPos);

            var Pos = this.CurPos.ContentPos;
            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_old ) );
            this.Internal_Content_Add( Pos, new ParaHyperlinkEnd() );
            this.Internal_Content_Add( Pos, new ParaTextPr( TextPr_hyper ) );
            this.Internal_Content_Add( Pos, Hyperlink );

            for ( var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++ )
            {
                var Char = HyperProps.Text.charAt( NewPos );
                if ( " " == Char )
                    this.Internal_Content_Add( Pos + 2 + NewPos, new ParaSpace() );
                else
                    this.Internal_Content_Add( Pos + 2 + NewPos, new ParaText(Char) );
            }

            this.Set_ContentPos( Pos + 2, false, -1 ); // чтобы курсор встал после TextPr
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        var Hyperlink = null;
        var Pos = -1;
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos   );

            if ( null != Hyper_start && Hyper_start === Hyper_end )
            {
                Hyperlink = Hyper_start;
                Pos       = this.Selection.StartPos;
            }
        }
        else
        {
            Hyperlink = this.Check_Hyperlink2( this.CurPos.ContentPos, false, true );
            Pos       = this.Internal_Correct_HyperlinkPos(this.CurPos.ContentPos);
        }

        if ( null != Hyperlink )
        {
            if ( "undefined" != typeof( HyperProps.Value) && null != HyperProps.Value )
                Hyperlink.Set_Value( HyperProps.Value );

            if ( "undefined" != typeof( HyperProps.ToolTip) && null != HyperProps.ToolTip )
                Hyperlink.Set_ToolTip( HyperProps.ToolTip );

            if ( null != HyperProps.Text )
            {
                var Find = this.Internal_FindBackward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
                if ( true != Find.Found || para_HyperlinkStart != Find.Type )
                    return false;

                var Start = Find.LetterPos;

                var Find = this.Internal_FindForward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
                if ( true != Find.Found || para_HyperlinkEnd != Find.Type )
                    return false;

                var End = Find.LetterPos;

                var TextPr = this.Internal_GetTextPr(End);
                TextPr.RStyle    = editor.WordControl.m_oLogicDocument.Get_Styles().Get_Default_Hyperlink();
                TextPr.Color     = undefined;
                TextPr.Underline = undefined;

                // TODO: тут не должно быть картинок, но все-таки если будет такая ситуация,
                //       тогда надо будет убрать записи о картинках.
                this.Internal_Content_Remove2( Start + 1, End - Start - 1 );
                this.Internal_Content_Add( Start + 1, new ParaTextPr( TextPr ) );
                for ( var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++ )
                {
                    var Char = HyperProps.Text.charAt( NewPos );
                    if ( " " == Char )
                        this.Internal_Content_Add( Start + 2 + NewPos, new ParaSpace() );
                    else
                        this.Internal_Content_Add( Start + 2 + NewPos, new ParaText(Char) );
                }

                if ( true === this.Selection.Use )
                {
                    this.Selection.StartPos = Start + 1;
                    this.Selection.EndPos   = Start + 2 + HyperProps.Text.length;
                    this.Set_ContentPos( this.Selection.EndPos );
                }
                else
                    this.Set_ContentPos( Start + 2, false ); // чтобы курсор встал после TextPr

                return true;
            }

            return false;
        }

        return false;
    },

    Hyperlink_Remove : function()
    {
        var Pos = -1;
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos   );

            if ( null != Hyper_start && Hyper_start === Hyper_end )
                Pos = ( this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos, false, true );
            if ( null != Hyper_cur )
                Pos = this.Internal_Correct_HyperlinkPos( this.CurPos.ContentPos );
        }

        if ( -1 != Pos )
        {
            var Find = this.Internal_FindForward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkEnd === Find.Type )
                this.Internal_Content_Remove( Find.LetterPos );

            var EndPos = Find.LetterPos - 2;

            Find = this.Internal_FindBackward( Pos, [para_HyperlinkStart, para_HyperlinkEnd] );
            if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                this.Internal_Content_Remove( Find.LetterPos );

            var StartPos = Find.LetterPos;
            var RStyle = editor.WordControl.m_oLogicDocument.Get_Styles().Get_Default_Hyperlink();

            // TODO: когда появятся стили текста, тут надо будет переделать
            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( para_TextPr === Item.Type && Item.Value.RStyle === RStyle )
                {
                    Item.Set_RStyle( undefined );
                }
            }

            // Пересчитаем TextPr
            this.RecalcInfo.Set_Type_0( pararecalc_0_All );
            this.Internal_Recalculate_0();

            // Запускаем перерисовку
            this.ReDraw();
            return true;
        }

        return false;
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        if ( true === bCheckInHyperlink )
        {
            if ( true === this.Selection.Use )
            {
                // Если у нас в выделение попадает начало или конец гиперссылки, или конец параграфа, или
                // у нас все выделение находится внутри гиперссылки, тогда мы не можем добавить новую. Во
                // всех остальных случаях разрешаем добавить.

                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                // Проверяем не находимся ли мы внутри гиперссылки
                var Find = this.Internal_FindBackward( StartPos, [para_HyperlinkStart, para_HyperlinkEnd] );
                if ( true === Find.Found && para_HyperlinkStart === Find.Type )
                    return false;

                for ( var Pos = StartPos; Pos < EndPos; Pos++ )
                {
                    var Item = this.Content[Pos];
                    switch ( Item.Type )
                    {
                        case para_HyperlinkStart:
                        case para_HyperlinkEnd:
                        case para_End:
                            return false;
                    }
                }

                return true;
            }
            else
            {
                // Внутри гиперссылки мы не можем задать ниперссылку
                var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos );
                if ( null != Hyper_cur )
                    return false;
                else
                    return true;
            }
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                // Если у нас в выделение попадает несколько гиперссылок или конец параграфа, тогда
                // возвращаем false, во всех остальных случаях true

                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                var bHyper = false;

                for ( var Pos = StartPos; Pos < EndPos; Pos++ )
                {
                    var Item = this.Content[Pos];
                    switch ( Item.Type )
                    {
                        case para_HyperlinkStart:
                        {
                            if ( true === bHyper )
                                return false;

                            bHyper = true;

                            break;
                        }
                        case para_HyperlinkEnd:
                        {
                            bHyper = true;

                            break;
                        }
                        case para_End:
                            return false;
                    }
                }

                return true;
            }
            else
            {
                return true;
            }
        }
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        if ( true === this.Selection.Use )
        {
            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos );

            if ( Hyper_start === Hyper_end && null != Hyper_start )
                return Hyper_start
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos, bCheckEnd );
            if ( null != Hyper_cur )
                return Hyper_cur;
        }

        return null;
    },

    Selection_SetStart : function(X,Y,PageNum, bTableBorder)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var Pos = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
            if ( -1 != Pos.Pos )
            {
                if ( true === Pos.End )
                    this.Selection.Set_StartPos( Pos.Pos + 1, Pos.Pos2 );
                else
                    this.Selection.Set_StartPos( Pos.Pos, Pos.Pos2 );

                // Если мы начинаем с математического элемента, тогда у него выставляем начало селекта
                if ( undefined !== this.Content[Pos.Pos2] && para_Math === this.Content[Pos.Pos2].Type )
                {
                    this.CurPos.ContentPos2 = Pos.Pos2;
                    this.Content[Pos.Pos2].Selection_SetStart(X, Y, PageNum);
                }

                this.Set_ContentPos( Pos.Pos, true , Pos.Line );

                this.Selection.Use      = true;
                this.Selection.Start    = true;
                this.Selection.Flag     = selectionflag_Common;

            }
        }
        else
        {
            // Избавляемся от старого селекта
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            // Найдем позицию в контенте, в которую мы попали (для селекта ищем и за знаком параграфа, для курсора только перед)
            var SearchPosXY  = this.Get_ParaContentPosByXY( X, Y, PageNum, false, true );
            var SearchPosXY2 = this.Get_ParaContentPosByXY( X, Y, PageNum, false, false );

            // Начинаем селект
            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.Flag     = selectionflag_Common;

            // Выставим текущую позицию
            this.Set_ParaContentPos( SearchPosXY2.Pos, SearchPosXY2.Line, true );

            // Выставляем селект
            this.Set_SelectionContentPos( SearchPosXY.Pos, SearchPosXY.Pos );
        }
    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X,Y,PageNum, MouseEvent, bTableBorder)
    {
        if ( true !== Debug_ParaRunMode )
        {
            var PagesCount = this.Pages.length;
            if ( false === editor.isViewMode && null === this.Parent.Is_HdrFtr(true) && null == this.Get_DocumentNext() && PageNum - this.PageNum >= PagesCount - 1 && Y > this.Pages[PagesCount - 1].Bounds.Bottom && MouseEvent.ClickCount >= 2 )
                return this.Parent.Extend_ToPos( X, Y );

            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;
            var Temp = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
            var Pos  = Temp.Pos;
            if ( -1 != Pos )
            {
                this.Set_ContentPos( Pos, true, Temp.Line );

                if ( true === Temp.End )
                {
                    if (  PageNum - this.PageNum >= PagesCount - 1 && X > this.Lines[this.Lines.length - 1].Ranges[this.Lines[this.Lines.length - 1].Ranges.length - 1].W && MouseEvent.ClickCount >= 2 && Y <= this.Pages[PagesCount - 1].Bounds.Bottom )
                    {
                        if ( false === editor.isViewMode && false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : this, CheckType : changestype_Paragraph_Content } ) )
                        {
                            History.Create_NewPoint();
                            History.Set_Additional_ExtendDocumentToPos();

                            this.Extend_ToPos( X );
                            this.Cursor_MoveToEndPos();
                            this.Document_SetThisElementCurrent(true);
                            editor.WordControl.m_oLogicDocument.Recalculate();
                            return;
                        }
                    }

                    this.Selection.Set_EndPos(Pos + 1, Temp.Pos2);
                }
                else
                    this.Selection.Set_EndPos(Pos, Temp.Pos2);


                // Обработка математических элементов:
                // 1. Проверяем конец селекта
                //    Если мы закончили на математическом элементе, тогда смотрим на начало селекта,
                //    если селект начался в другом элементе, тогда выставляем начало селекта в формуле
                //    в зависимости от направления, если селект начался в этом же параграфе, тогда проверяем,
                //    если начало селекта не тот же самый элемент, тогда выставляем начало
                // 2. Проверяем начало селекта
                //    Если у нас селект начался в данном параграфе, и начальный элемент -формула, и начало селекта
                //    не совпадает с концом селекта, тогда выставляем конец селекта у данного элемента

                var ParentSelectDirection = this.Parent.Selection_Is_OneElement();
                if ( undefined !== this.Content[Temp.Pos2] && para_Math === this.Content[Temp.Pos2].Type )
                {
                    // Если у нас совпали начальная и конечная позиции, тогда не нужно указывать начало селекта, т.к. оно
                    // было определено в Selection_SetStart, но это только в случае, когда выделение внутри 1 параграфа.
                    if ( 0 === ParentSelectDirection )
                    {
                        if ( this.Selection.EndPos2 != this.Selection.StartPos2 )
                        {
                            if ( this.Selection.StartPos2 < this.Selection.EndPos2 )
                                this.Content[Temp.Pos2].Selection_Beginning(true);
                            else
                                this.Content[Temp.Pos2].Selection_Ending(true);
                        }
                    }
                    else
                    {
                        if ( ParentSelectDirection > 0 )
                            this.Content[Temp.Pos2].Selection_Beginning(true);
                        else
                            this.Content[Temp.Pos2].Selection_Ending(true);
                    }

                    this.Content[Temp.Pos2].Selection_SetEnd(X, Y, PageNum, MouseEvent);
                }

                if ( undefined !== this.Content[this.Selection.StartPos2] && para_Math === this.Content[this.Selection.StartPos2].Type && 0 === ParentSelectDirection && this.Selection.EndPos2 != this.Selection.StartPos2 )
                {
                    if ( this.Selection.StartPos2 < this.Selection.EndPos2 )
                        this.Content[this.Selection.StartPos2].Selection_Ending(false);
                    else
                        this.Content[this.Selection.StartPos2].Selection_Beginning(false);
                }

                // Если мы закончили в математическом элементе и в нем нет селекта, тогда отменяем селект совсем и ставим курсор в формуле
                if ( g_mouse_event_type_up === MouseEvent.Type )
                {
                    if ( this.Selection.EndPos2 === this.Selection.StartPos2 && undefined !== this.Content[this.Selection.StartPos2] && para_Math === this.Content[this.Selection.StartPos2].Type && true === this.Content[this.Selection.StartPos2].Selection_IsEmpty() )
                    {
                        this.Selection_Remove();

                        this.CurPos.ContentPos2 = this.Selection.EndPos2;
                        this.Set_ContentPos( Pos, true, Temp.Line );

                        this.RecalculateCurPos();
                    }
                    else
                        this.CurPos.ContentPos2 = -1;
                }

                if ( this.Selection.EndPos == this.Selection.StartPos && g_mouse_event_type_up === MouseEvent.Type && ( this.Selection.EndPos2 != this.Selection.StartPos2 || undefined === this.Content[this.Selection.StartPos2] || para_Math !== this.Content[this.Selection.StartPos2].Type ) )
                {
                    var NumPr = this.Numbering_Get();
                    if ( true === Temp.Numbering && undefined != NumPr )
                    {
                        // Ставим именно 0, а не this.Internal_GetStartPos(), чтобы при нажатии на клавишу "направо"
                        // мы оказывались в начале параграфа.
                        this.Set_ContentPos( 0, true, -1 );
                        this.Parent.Document_SelectNumbering( NumPr );
                    }
                    else
                    {
                        var Temp2 = MouseEvent.ClickCount % 2;

                        if ( 1 >= MouseEvent.ClickCount )
                        {
                            this.Selection_Remove();
                            this.Selection.Use = false;

                            this.Set_ContentPos( Pos, true, Temp.Line );
                            this.RecalculateCurPos();

                            return;
                        }
                        else if ( 0 == Temp2 )
                        {
                            var oStart;
                            if ( this.Content[Pos].Type == para_Space )
                            {
                                oStart = this.Internal_FindBackward( Pos, [ para_Text, para_NewLine ] );
                                if ( !oStart.Found )
                                    oStart.LetterPos = this.Internal_GetStartPos();
                                else if ( oStart.Type == para_NewLine )
                                {
                                    oStart.LetterPos++; // смещаемся на начало следующей строки
                                }
                                else
                                {
                                    oStart = this.Internal_FindBackward( oStart.LetterPos, [ para_Tab, para_Space, para_NewLine ] );
                                    if ( !oStart.Found )
                                        oStart.LetterPos = this.Internal_GetStartPos();
                                    else
                                    {
                                        oStart = this.Internal_FindForward( oStart.LetterPos, [ para_Text ] );
                                        if ( !oStart.Found )
                                            oStart.LetterPos = this.Internal_GetStartPos();
                                    }
                                }
                            }
                            else
                            {
                                oStart = this.Internal_FindBackward( Pos, [ para_Tab, para_Space, para_NewLine ] );
                                if ( !oStart.Found )
                                    oStart.LetterPos = this.Internal_GetStartPos();
                                else
                                {
                                    oStart = this.Internal_FindForward( oStart.LetterPos, [ para_Text, para_NewLine ] );
                                    if ( !oStart.Found )
                                        oStart.LetterPos = this.Internal_GetStartPos();
                                }
                            }

                            var oEnd = this.Internal_FindForward( Pos, [ para_Tab, para_Space, para_NewLine ] );
                            if ( !oEnd.Found )
                                oEnd.LetterPos = this.Content.length - 1;
                            else if ( oEnd.Type != para_NewLine ) // при переносе строки селектим все до переноса строки
                            {
                                oEnd = this.Internal_FindForward( oEnd.LetterPos, [ para_Text ] );
                                if ( !oEnd.Found )
                                    oEnd.LetterPos = this.Content.length - 1;
                            }
                            this.Selection.StartPos = oStart.LetterPos;
                            this.Selection.EndPos   = oEnd.LetterPos;
                            this.Selection.Use = true;
                        }
                        else // ( 1 == Temp2 % 3 )
                        {
                            // Селектим параграф целиком
                            this.Selection.StartPos = this.Internal_GetStartPos();
                            this.Selection.EndPos   = this.Content.length - 1;
                            this.Selection.Use      = true;
                        }
                    }
                }
            }

            if ( -1 === this.Selection.EndPos )
            {
                //Temp = this.Internal_GetContentPosByXY( X, Y, false, PageNum );
                return;
            }
        }
        else
        {
            var PagesCount = this.Pages.length;

            if ( false === editor.isViewMode && null === this.Parent.Is_HdrFtr(true) && null == this.Get_DocumentNext() && PageNum - this.PageNum >= PagesCount - 1 && Y > this.Pages[PagesCount - 1].Bounds.Bottom && MouseEvent.ClickCount >= 2 )
                return this.Parent.Extend_ToPos( X, Y );

            // Обновляем позицию курсора
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;

            // Найдем позицию в контенте, в которую мы попали (для селекта ищем и за знаком параграфа, для курсора только перед)
            var SearchPosXY  = this.Get_ParaContentPosByXY( X, Y, PageNum, false, true );
            var SearchPosXY2 = this.Get_ParaContentPosByXY( X, Y, PageNum, false, false );

            // Выставим в полученном месте текущую позицию курсора
            this.Set_ParaContentPos( SearchPosXY2.Pos, SearchPosXY2.Line, true );

            if ( true === SearchPosXY.End )
            {
                if (  PageNum - this.PageNum >= PagesCount - 1 && X > this.Lines[this.Lines.length - 1].Ranges[this.Lines[this.Lines.length - 1].Ranges.length - 1].W && MouseEvent.ClickCount >= 2 && Y <= this.Pages[PagesCount - 1].Bounds.Bottom )
                {
                    if ( false === editor.isViewMode && false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : this, CheckType : changestype_Paragraph_Content } ) )
                    {
                        History.Create_NewPoint();
                        History.Set_Additional_ExtendDocumentToPos();

                        this.Extend_ToPos( X );
                        this.Cursor_MoveToEndPos();
                        this.Document_SetThisElementCurrent(true);
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        return;
                    }
                }
            }

            // Выставляем селект
            this.Set_SelectionContentPos( this.Get_ParaContentPos( true, true ), SearchPosXY.Pos );

            var SelectionStartPos = this.Get_ParaContentPos( true, true );
            var SelectionEndPos   = this.Get_ParaContentPos( true, false );

            if ( 0 === SelectionStartPos.Compare( SelectionEndPos ) && g_mouse_event_type_up === MouseEvent.Type )
            {
                var NumPr = this.Numbering_Get();
                if ( true === SearchPosXY.Numbering && undefined != NumPr )
                {
                    // Передвигаем курсор в начало параграфа
                    this.Set_ParaContentPos(this.Get_StartPos(), -1, true);

                    // Производим выделение нумерации
                    this.Parent.Document_SelectNumbering( NumPr );
                }
                else
                {
                    var ClickCounter = MouseEvent.ClickCount % 2;

                    if ( 1 >= MouseEvent.ClickCount )
                    {
                        // Убираем селект. Позицию курсора можно не выставлять, т.к. она у нас установлена на конец селекта
                        this.Selection_Remove();
                    }
                    else if ( 0 == ClickCounter )
                    {
                        // Выделяем слово, в котором находимся
                        var SearchPosS = new CParagraphSearchPos();
                        var SearchPosE = new CParagraphSearchPos();

                        this.Get_WordStartPos( SearchPosS, SearchPosXY.Pos );
                        this.Get_WordEndPos( SearchPosE, SearchPosXY.Pos );

                        var StartPos = ( true === SearchPosS.Found ? SearchPosS.Pos : this.Get_StartPos() );
                        var EndPos   = ( true === SearchPosE.Found ? SearchPosE.Pos : this.Get_EndPos(false) );

                        this.Selection.Use = true;
                        this.Set_SelectionContentPos( StartPos, EndPos );
                    }
                    else // ( 1 == ClickCounter % 2 )
                    {
                        // Выделяем весь параграф целиком

                        this.Select_All( 1 );
                    }
                }
            }
        }
    },

    Selection_Internal_Update : function()
    {
        var SelectDirection = this.Parent.Selection_Is_OneElement();
        var StartPos = this.Selection.StartPos2;
        if ( 0 !== SelectDirection && undefined !== this.Content[StartPos] && para_Math === this.Content[StartPos].Type )
        {
            if ( SelectDirection > 0 )
                this.Content[StartPos].Selection_Ending(false);
            else
                this.Content[StartPos].Selection_Beginning(false);
        }
    },

    Selection_Stop : function(X,Y,PageNum, MouseEvent)
    {
        this.Selection.Start = false;

        if ( true === Debug_ParaRunMode )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
            {
                this.Content[CurPos].Selection_Stop();
            }
        }
    },

    Selection_Remove : function()
    {
        if ( true !== Debug_ParaRunMode )
        {
            var StartPos = this.Selection.StartPos2;
            var EndPos   = this.Selection.EndPos2;

            if ( undefined !== this.Content[StartPos] && para_Math === this.Content[StartPos].Type )
                this.Content[StartPos].Selection_Remove();

            if ( undefined !== this.Content[EndPos] && para_Math === this.Content[EndPos].Type && StartPos != EndPos )
                this.Content[EndPos].Selection_Remove();

            this.Selection.Use = false;
            this.Selection.Flag = selectionflag_Common;
            this.Selection_Clear();
        }
        else
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
            {
                this.Content[CurPos].Selection_Remove();
            }

            this.Selection.Use      = false;
            this.Selection.Start    = false;
            this.Selection.Flag     = selectionflag_Common;
            this.Selection.StartPos = 0;
            this.Selection.EndPos   = 0;
            this.Selection_Clear();
        }
    },

    Selection_Clear : function()
    {
    },

    Selection_Draw_Page : function(Page_abs)
    {
        if ( true != this.Selection.Use )
            return;

        var CurPage = Page_abs - this.Get_StartPage_Absolute();
        if ( CurPage < 0 || CurPage >= this.Pages.length )
            return;

        if ( 0 === CurPage && this.Pages[0].EndLine < 0 )
            return;

        if ( true !== Debug_ParaRunMode )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    // Делаем подсветку
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    var _StartLine = this.Pages[CurPage].StartLine;
                    var _EndLine   = this.Pages[CurPage].EndLine;

                    if ( StartPos > this.Lines[_EndLine].EndPos + 1 || EndPos < this.Lines[_StartLine].StartPos )
                        return;
                    else
                    {
                        StartPos = Math.max( StartPos, this.Lines[_StartLine].StartPos );
                        EndPos   = Math.min( EndPos,   ( _EndLine != this.Lines.length - 1 ? this.Lines[_EndLine].EndPos + 1 : this.Content.length - 1 ) );
                    }

                    // Найдем линию, с которой начинается селект
                    var StartParaPos = this.Internal_Get_ParaPos_By_Pos( StartPos );
                    var CurLine  = StartParaPos.Line;
                    var CurRange = StartParaPos.Range;
                    var PNum     = StartParaPos.Page;

                    // Найдем начальный сдвиг в данном отрезке
                    var StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    var Pos, Item;

                    if ( this.Numbering.Pos >= this.Lines[CurLine].Ranges[CurRange].StartPos )
                        StartX += this.Numbering.WidthVisible;

                    for ( Pos = this.Lines[CurLine].Ranges[CurRange].StartPos; Pos <= StartPos - 1; Pos++ )
                    {
                        Item = this.Content[Pos];

                        if ( undefined != Item.WidthVisible && ( para_Drawing != Item.Type || drawing_Inline === Item.DrawingType  ) )
                            StartX += Item.WidthVisible;
                    }

                    if ( this.Pages[PNum].StartLine > CurLine )
                    {
                        CurLine = this.Pages[PNum].StartLine;
                        CurRange = 0;
                        StartX   = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        StartPos = this.Lines[this.Pages[PNum].StartLine].StartPos;
                    }

                    var StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                    var H      = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                    var W = 0;

                    // Отдельная отрисовка селекта для формул (используется только, если селект начинается с формулы
                    // или заканчивается формулой, во всех остальных случаях )
                    if ( undefined != this.Content[this.Selection.StartPos2] && para_Math === this.Content[this.Selection.StartPos2].Type )
                    {
                        this.Content[this.Selection.StartPos2].Selection_Draw();

                        if ( this.Selection.StartPos2 === StartPos )
                        {
                            StartPos++;
                            StartX  += this.Content[this.Selection.StartPos2].WidthVisible;
                        }
                        else if( this.Selection.StartPos2 === EndPos - 1 )
                            EndPos--;

                    }

                    if ( undefined != this.Content[this.Selection.EndPos2] && para_Math === this.Content[this.Selection.EndPos2].Type && this.Selection.EndPos2 !== this.Selection.StartPos2 )
                    {
                        this.Content[this.Selection.EndPos2].Selection_Draw();

                        if ( this.Selection.EndPos2 === StartPos )
                        {
                            StartPos++;
                            StartX  += this.Content[this.Selection.EndPos2].WidthVisible;
                        }
                        else if( this.Selection.EndPos2 === EndPos - 1 )
                            EndPos--;
                    }


                    // Рисуем остальной селект
                    for ( Pos = StartPos; Pos < EndPos; Pos++ )
                    {
                        Item = this.Content[Pos];

                        if ( undefined != Item.CurPage )
                        {
                            if ( CurLine < Item.CurLine )
                            {
                                this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);

                                CurLine  = Item.CurLine;
                                CurRange = Item.CurRange;

                                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                                H      = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                                W = 0;
                            }
                            else if ( CurRange < Item.CurRange )
                            {
                                this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);

                                CurRange = Item.CurRange;
                                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                W = 0;
                            }
                        }

                        if ( undefined != Item.WidthVisible )
                        {
                            if ( para_Drawing != Item.Type || drawing_Inline === Item.DrawingType  )
                                W += Item.WidthVisible;
                            else
                                Item.Draw_Selection();
                        }

                        if ( Pos == EndPos - 1 )
                        {
                            this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                        }
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    var ParaNum = this.Numbering;
                    var NumberingPos = this.Numbering.Pos;
                    if ( -1 === NumberingPos )
                        break;

                    var ParaNumPos = this.Internal_Get_ParaPos_By_Pos(NumberingPos);
                    if ( ParaNumPos.Page != CurPage )
                        break;

                    var CurRange = ParaNumPos.Range;
                    var CurLine  = ParaNumPos.Line;

                    var NumPr   = this.Numbering_Get();
                    var SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    var SelectW = ParaNum.WidthVisible;
                    var NumJc   = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;
                    switch ( NumJc )
                    {
                        case align_Center:
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum / 2;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum / 2;
                            break;
                        case align_Right:
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum;
                            break;
                        case align_Left:
                        default:
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            SelectW = ParaNum.WidthVisible;
                            break;
                    }

                    this.DrawingDocument.AddPageSelection(Page_abs, SelectX, this.Lines[CurLine].Top + this.Pages[CurPage].Y, SelectW, this.Lines[CurLine].Bottom - this.Lines[CurLine].Top);

                    break;
                }
            }
        }
        else
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    // Делаем подсветку
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        StartPos = this.Selection.EndPos;
                        EndPos   = this.Selection.StartPos;
                    }

                    var _StartLine = this.Pages[CurPage].StartLine;
                    var _EndLine   = this.Pages[CurPage].EndLine;

                    if ( StartPos > this.Lines[_EndLine].EndPos || EndPos < this.Lines[_StartLine].StartPos )
                        return;
                    else
                    {
                        StartPos = Math.max( StartPos, this.Lines[_StartLine].StartPos );
                        EndPos   = Math.min( EndPos,   ( _EndLine != this.Lines.length - 1 ? this.Lines[_EndLine].EndPos : this.Content.length - 1 ) );
                    }

                    var DrawSelection = new CParagraphDrawSelectionRange();

                    for ( var CurLine = _StartLine; CurLine <= _EndLine; CurLine++ )
                    {
                        var Line = this.Lines[CurLine];
                        var RangesCount = Line.Ranges.length;

                        // Определяем позицию и высоту строки
                        var StartY = this.Pages[CurPage].Y      + this.Lines[CurLine].Top;
                        var H      = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                        for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
                        {
                            var Range = Line.Ranges[CurRange];

                            var RStartPos = Range.StartPos;
                            var REndPos   = Range.EndPos;

                            // Если пересечение пустое с селектом, тогда пропускаем данный отрезок
                            if ( StartPos > REndPos || EndPos < RStartPos )
                                continue;

                            DrawSelection.StartX    = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            DrawSelection.W         = 0;
                            DrawSelection.FindStart = true;

                            if ( CurLine === this.Numbering.Line && CurRange === this.Numbering.Range )
                                DrawSelection.StartX += this.Numbering.WidthVisible;

                            for ( var CurPos = RStartPos; CurPos <= REndPos; CurPos++ )
                            {
                                var Item = this.Content[CurPos];
                                Item.Selection_DrawRange( CurLine, CurRange, DrawSelection );
                            }

                            var StartX = DrawSelection.StartX;
                            var W      = DrawSelection.W;

                            // Отрисовываем селект
                            if ( W > 0.001 )
                                this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                        }
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    var ParaNum = this.Numbering;
                    var NumberingRun = ParaNum.Run;

                    if ( null === NumberingRun )
                        break;

                    var CurLine  = ParaNum.Line;
                    var CurRange = ParaNum.Range;

                    var SelectY = this.Lines[CurLine].Top + this.Pages[CurPage].Y;
                    var SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    var SelectW = ParaNum.WidthVisible;
                    var SelectH = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;

                    var NumPr   = this.Numbering_Get();
                    var NumJc   = this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].Jc;

                    switch ( NumJc )
                    {
                        case align_Center:
                        {
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum / 2;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum / 2;
                            break;
                        }
                        case align_Right:
                        {
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum;
                            SelectW = ParaNum.WidthVisible + ParaNum.WidthNum;
                            break;
                        }
                        case align_Left:
                        default:
                        {
                            SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            SelectW = ParaNum.WidthVisible;
                            break;
                        }
                    }

                    this.DrawingDocument.AddPageSelection( Page_abs, SelectX, SelectY, SelectW, SelectH );

                    break;
                }
            }
        }
    },

    Selection_CheckParaEnd : function()
    {
        if ( true !== this.Selection.Use )
            return false;

        var EndPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );

        return this.Content[EndPos].Selection_CheckParaEnd();
    },

    Selection_Check : function(X, Y, Page_Abs, NearPos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( NearPos !== undefined  )
            {
                if ( NearPos.Paragraph === this && ( ( true === this.Selection.Use && NearPos.ContentPos >= this.Selection.StartPos && NearPos.ContentPos <= this.Selection.EndPos ) || ( true === this.ApplyToAll )  ) )
                    return true;

                return false;
            }
            else
            {
                var PageIndex = Page_Abs - this.Get_StartPage_Absolute();
                if ( PageIndex < 0 || PageIndex >= this.Pages.length || true != this.Selection.Use )
                    return false;

                var Start = this.Selection.StartPos;
                var End   = this.Selection.EndPos;

                if ( Start > End )
                {
                    Start = this.Selection.EndPos;
                    End   = this.Selection.StartPos;
                }

                var ContentPos = this.Internal_GetContentPosByXY( X, Y, false, PageIndex + this.PageNum, false );
                var Pos  = ContentPos.Pos;
                var Pos2 = ContentPos.Pos2;

                if ( -1 != Pos2 && undefined !== this.Content[Pos2] && para_Math === this.Content[Pos2].Type )
                    return this.Content[Pos2].Selection_Check( X, Y, Page_Abs );

                if ( -1 != Pos && Start <= Pos && End >= Pos )
                    return true;

                return false;
            }
        }
        else
        {
            // TODO: реализовать Selection_Check
            return false;
        }
    },

    Selection_CalculateTextPr : function()
    {
        if ( true === this.Selection.Use || true === this.ApplyToAll )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( true === this.ApplyToAll )
            {
                StartPos = 0;
                EndPos   = this.Content.length - 1;
            }

            if ( StartPos > EndPos )
            {
                var Temp = EndPos;
                EndPos   = StartPos;
                StartPos = Temp;
            }

            if ( EndPos >= this.Content.length )
                EndPos = this.Content.length - 1;
            if ( StartPos < 0 )
                StartPos = 0;

            if ( StartPos == EndPos )
                return this.Internal_CalculateTextPr( StartPos );

            while ( this.Content[StartPos].Type == para_TextPr )
                StartPos++;

            var oEnd = this.Internal_FindBackward( EndPos - 1, [ para_Text, para_Space ] );

            if ( oEnd.Found )
                EndPos = oEnd.LetterPos;
            else
            {
                while ( this.Content[EndPos].Type == para_TextPr )
                    EndPos--;
            }

            // Рассчитаем стиль в начале селекта
            var TextPr_start = this.Internal_CalculateTextPr( StartPos );
            var TextPr_vis   = TextPr_start;

            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                var Item = this.Content[Pos];
                if ( para_TextPr == Item.Type && Pos < this.Content.length - 1 && para_TextPr != this.Content[Pos + 1].Type )
                {
                    // Рассчитываем настройки в данной позиции
                    var TextPr_cur = this.Internal_CalculateTextPr( Pos );
                    TextPr_vis = TextPr_vis.Compare( TextPr_cur );
                }
            }

            return TextPr_vis;
        }
        else
            return new CTextPr();
    },

    Selection_SelectNumbering : function()
    {
        if ( undefined != this.Numbering_Get() )
        {
            this.Selection.Use  = true;
            this.Selection.Flag = selectionflag_Numbering;
        }
    },

    // Выставляем начало/конец селекта в начало/конец параграфа
    Selection_SetBegEnd : function(StartSelection, StartPara)
    {
        var ContentPos = ( true === StartPara ? this.Get_StartPos() : this.Get_EndPos(true) );

        if ( true === StartSelection )
        {
            this.Set_SelectionContentPos( ContentPos, this.Get_ParaContentPos( true, false ) );
        }
        else
        {
            this.Set_SelectionContentPos( this.Get_ParaContentPos( true, true ), ContentPos );
        }
    },

    Select_All : function(Direction)
    {
        if ( true !== Debug_ParaRunMode )
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = this.Internal_GetStartPos();
            this.Selection.EndPos   = this.Content.length - 1;
        }
        else
        {
            var Count = this.Content.length;

            this.Selection.Use = true;

            var StartPos = null, EndPos = null;
            if ( -1 === Direction )
            {
                StartPos = this.Get_EndPos( true );
                EndPos   = this.Get_StartPos();
            }
            else
            {
                StartPos = this.Get_StartPos();
                EndPos   = this.Get_EndPos( true );
            }

            this.Set_SelectionContentPos( StartPos, EndPos );
        }
    },

    // Возвращаем выделенный текст
    Get_SelectedText : function(bClearText)
    {
        if ( true === this.ApplyToAll )
        {
            var Str = "";

            var Count = this.Content.length;
            for ( var Pos = 0; Pos < Count; Pos++ )
            {
                var Item = this.Content[Pos];

                switch ( Item.Type )
                {
                    case para_Drawing:
                    case para_End:
                    case para_Numbering:
                    case para_PresentationNumbering:
                    case para_PageNum:
                    case para_Math:
                    {
                        if ( true === bClearText )
                            return null;

                        break;
                    }

                    case para_Text : Str += Item.Value; break;
                    case para_Space:
                    case para_Tab  : Str += " "; break;
                }
            }

            return Str;
        }

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( EndPos < StartPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            var Str = "";

            for ( var Pos = StartPos; Pos < EndPos; Pos++ )
            {
                var Item = this.Content[Pos];

                switch ( Item.Type )
                {
                    case para_Drawing:
                    case para_End:
                    case para_Numbering:
                    case para_PresentationNumbering:
                    case para_PageNum:
                    {
                        if ( true === bClearText )
                            return null;

                        break;
                    }

                    case para_Text : Str += Item.Value; break;
                    case para_Space:
                    case para_Tab  : Str += " "; break;
                }
            }

            return Str;
        }

        return "";
    },

    Get_SelectedElementsInfo : function(Info)
    {
        Info.Set_Paragraph( this );
    },

    Get_SelectedContent : function(DocContent)
    {
        if ( true !== this.Selection.Use )
            return;

        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;
        if ( StartPos > EndPos )
        {
            StartPos = this.Selection.EndPos;
            EndPos   = this.Selection.StartPos;
        }

        var _StartPos = this.Internal_GetStartPos();
        var _EndPos   = this.Internal_GetEndPos();

        // Если выделен параграф целиком, тогда просто его копируем
        if ( StartPos <= _StartPos && EndPos >= _EndPos )
        {
            DocContent.Add( new CSelectedElement( this.Copy(this.Parent), true ) );
            return;
        }

        var Para = new Paragraph(this.DrawingDocument, this.Parent, 0, 0, 0, 0, 0);

        // Копируем настройки
        Para.Set_Pr(this.Pr.Copy());
        Para.TextPr.Set_Value( this.TextPr.Value );
        Para.Internal_Content_Remove2(0, Para.Content.length);

        var StartTextPr = this.Internal_GetTextPr( StartPos );
        Para.Internal_Content_Add( Para.Content.length, new ParaTextPr( StartTextPr ), false );

        // Копируем содержимое параграфа
        for ( var Pos = StartPos; Pos < EndPos; Pos++ )
        {
            var Item     = this.Content[Pos];
            var ItemType = Item.Type;
            if ( true === Item.Is_RealContent() && para_End !== ItemType && para_Empty !== ItemType )
                Para.Internal_Content_Add( Para.Content.length, Item.Copy(), false );
        }

        Para.Internal_Content_Add( Para.Content.length, new ParaEnd(), false );
        Para.Internal_Content_Add( Para.Content.length, new ParaEmpty(), false );

        DocContent.Add( new CSelectedElement( Para, false ) );
    },

    // Проверяем пустой ли параграф
    IsEmpty : function()
    {
        if ( true !== Debug_ParaRunMode )
        {
            var Pos = this.Internal_FindForward( 0, [para_Tab, para_Drawing, para_PageNum, para_Text, para_Space, para_NewLine, para_Math] );
            return ( Pos.Found === true ? false : true );
        }
        else
        {
            var ContentLen = this.Content.length;
            for ( var CurPos = 0; CurPos < ContentLen; CurPos++ )
            {
                if ( false === this.Content[CurPos].Is_Empty( { SkipEnd : true } ) )
                    return false;
            }

            return true;
        }
    },

    // Проверяем, попали ли мы в текст
    Is_InText : function(X, Y, PageNum_Abs)
    {
        var PNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if ( PNum < 0 || PNum >= this.Pages.length )
            return null;

        var Result = this.Internal_GetContentPosByXY( X, Y, false, PNum + this.PageNum, false);
        if ( true === Result.InText )
            return this;

        return null;
    },

    Is_UseInDocument : function()
    {
        if ( null != this.Parent )
           return this.Parent.Is_UseInDocument(this.Get_Id());

        return false;
    },

    // Проверяем пустой ли селект
    Selection_IsEmpty : function(bCheckHidden)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( undefined === bCheckHidden )
                bCheckHidden = true;

            // TODO: при добавлении новых элементов в параграф, добавить их сюда
            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    var Temp = EndPos;
                    EndPos   = StartPos;
                    StartPos = Temp;
                }

                // Проверяем начальный и конечный элемент, если это формулы, тогда надо проверить внутри них селект
                if ( undefined != this.Content[this.Selection.StartPos2] && para_Math === this.Content[this.Selection.StartPos2].Type && false === this.Content[this.Selection.StartPos2].Selection_IsEmpty() )
                    return false;

                if ( undefined != this.Content[this.Selection.EndPos2] && para_Math === this.Content[this.Selection.EndPos2].Type && false === this.Content[this.Selection.EndPos2].Selection_IsEmpty() )
                    return false;

                var CheckArray = [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math];
                if ( true === bCheckHidden )
                    CheckArray.push( para_End );

                var Pos = this.Internal_FindForward( StartPos, CheckArray );
                if ( true != Pos.Found )
                    return true;

                if ( Pos.LetterPos >= EndPos )
                    return true;

                return false;
            }

            return true;
        }
        else
        {
            if ( undefined === bCheckHidden )
                bCheckHidden = true;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    EndPos   = this.Selection.StartPos;
                    StartPos = this.Selection.EndPos;
                }

                for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
                {
                    if ( true !== this.Content[CurPos].Selection_IsEmpty(bCheckHidden) )
                        return false;
                }
            }

            return true;
        }
    },

//-----------------------------------------------------------------------------------
// Функции для работы с нумерацией параграфов в документах
//-----------------------------------------------------------------------------------

    // Добавляем нумерацию к данному параграфу
    Numbering_Add : function(NumId, Lvl)
    {
        var ParaPr = this.Get_CompiledPr2(false).ParaPr;
        var NumPr_old = this.Numbering_Get();

        this.Numbering_Remove();

        var SelectionUse       = this.Is_SelectionUse();
        var SelectedOneElement = (this.Parent.Selection_Is_OneElement() === 0 ? true : false );

        // Рассчитаем количество табов, идущих в начале параграфа
        var Count = this.Content.length;
        var TabsCount = 0;
        var TabsPos = new Array();
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            var ItemType = Item.Type;

            if ( para_Tab === ItemType )
            {
                TabsCount++;
                TabsPos.push( Pos );
            }
            else if ( para_Text === ItemType || para_Space === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline() ) || para_PageNum === ItemType || para_Math === ItemType )
                break;
        }

        // Рассчитаем левую границу и сдвиг первой строки с учетом начальных табов
        var X = ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        var LeftX = X;

        if ( TabsCount > 0 && ParaPr.Ind.FirstLine < 0 )
        {
            X     = ParaPr.Ind.Left;
            LeftX = X;
            TabsCount--;
        }

        var ParaTabsCount = ParaPr.Tabs.Get_Count();
        while ( TabsCount )
        {
            // Ищем ближайший таб

            var TabFound = false;
            for ( var TabIndex = 0; TabIndex < ParaTabsCount; TabIndex++ )
            {
                var Tab = ParaPr.Tabs.Get(TabIndex);

                if ( Tab.Pos > X )
                {
                    X = Tab.Pos;
                    TabFound = true;
                    break;
                }
            }

            // Ищем по дефолтовому сдвигу
            if ( false === TabFound )
            {
                var NewX = 0;
                while ( X >= NewX )
                    NewX += Default_Tab_Stop;

                X = NewX;
            }

            TabsCount--;
        }

        var Numbering   = this.Parent.Get_Numbering();
        var AbstractNum = Numbering.Get_AbstractNum(NumId);

        // Если у параграфа не было никакой нумерации изначально
        if ( undefined === NumPr_old )
        {
            if ( true === SelectedOneElement || false === SelectionUse )
            {
                // Проверим сначала предыдущий элемент, если у него точно такая же нумерация, тогда копируем его сдвиги
                var Prev = this.Get_DocumentPrev();
                var PrevNumbering = ( null != Prev ? (type_Paragraph === Prev.GetType() ? Prev.Numbering_Get() : undefined) : undefined );
                if ( undefined != PrevNumbering && NumId === PrevNumbering.NumId && Lvl === PrevNumbering.Lvl )
                {
                    var NewFirstLine = Prev.Pr.Ind.FirstLine;
                    var NewLeft      = Prev.Pr.Ind.Left;
                    History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : NewFirstLine } );
                    History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : NewLeft } );

                    // При добавлении списка в параграф, удаляем все собственные сдвиги
                    this.Pr.Ind.FirstLine = NewFirstLine;
                    this.Pr.Ind.Left      = NewLeft;
                }
                else
                {
                    // Выставляем заданную нумерацию и сдвиги Ind.Left = X + NumPr.ParaPr.Ind.Left
                    var NumLvl = AbstractNum.Lvl[Lvl];
                    var NumParaPr = NumLvl.ParaPr;

                    if ( undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left )
                    {
                        AbstractNum.Change_LeftInd( X + NumParaPr.Ind.Left );

                        History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : undefined } );
                        History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : undefined } );

                        // При добавлении списка в параграф, удаляем все собственные сдвиги
                        this.Pr.Ind.FirstLine = undefined;
                        this.Pr.Ind.Left      = undefined;
                    }
                }

                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Set( NumId, Lvl );
                History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr_old, New : this.Pr.NumPr } );
            }
            else
            {
                // Если выделено несколько параграфов, тогда уже по сдвигу X определяем уровень данной нумерации

                var LvlFound = -1;
                var LvlsCount = AbstractNum.Lvl.length;
                for ( var LvlIndex = 0; LvlIndex < LvlsCount; LvlIndex++ )
                {
                    var NumLvl = AbstractNum.Lvl[LvlIndex];
                    var NumParaPr = NumLvl.ParaPr;

                    if ( undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left && X <= NumParaPr.Ind.Left )
                    {
                        LvlFound = LvlIndex;
                        break;
                    }
                }

                if ( -1 === LvlFound )
                    LvlFound = LvlsCount - 1;

                if ( undefined != this.Pr.Ind && undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left )
                {
                    History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : undefined } );
                    History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : undefined } );

                    // При добавлении списка в параграф, удаляем все собственные сдвиги
                    this.Pr.Ind.FirstLine = undefined;
                    this.Pr.Ind.Left      = undefined;
                }

                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Set( NumId, LvlFound );
                History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr_old, New : this.Pr.NumPr } );
            }

            // Удалим все табы идущие в начале параграфа
            TabsCount = TabsPos.length;
            while ( TabsCount )
            {
                var Pos = TabsPos[TabsCount - 1];
                this.Internal_Content_Remove( Pos );
                TabsCount--;
            }
        }
        else
        {
            // просто меняем список, так чтобы он не двигался
            this.Pr.NumPr = new CNumPr();
            this.Pr.NumPr.Set( NumId, Lvl );

            History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr_old, New : this.Pr.NumPr } );

            var Left      = ( NumPr_old.Lvl === Lvl ? undefined : ParaPr.Ind.Left );
            var FirstLine = ( NumPr_old.Lvl === Lvl ? undefined : ParaPr.Ind.FirstLine );

            History.Add( this, { Type : historyitem_Paragraph_Ind_First, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ), New : Left      } );
            History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  Old : ( undefined != this.Pr.Ind.Left      ? this.Pr.Ind.Left      : undefined ), New : FirstLine } );

            this.Pr.Ind.FirstLine = FirstLine;
            this.Pr.Ind.Left      = Left;
        }

        // Если у параграфа выставлен стиль, тогда не меняем его, если нет, тогда выставляем стандартный
        // стиль для параграфа с нумерацией.
        if ( undefined === this.Style_Get() )
        {
            this.Style_Add( this.Parent.Get_Styles().Get_Default_ParaList() );
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Добавляем нумерацию к данному параграфу, не делая никаких дополнительных действий
    Numbering_Set : function(NumId, Lvl)
    {
        var NumPr_old = this.Pr.NumPr;
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set( NumId, Lvl );

        History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr_old, New : this.Pr.NumPr } );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Изменяем уровень нумерации
    Numbering_IndDec_Level : function(bIncrease)
    {
        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr )
        {
            var NewLvl;
            if ( true === bIncrease )
                NewLvl = Math.min( 8, NumPr.Lvl + 1 );
            else
                NewLvl = Math.max( 0, NumPr.Lvl - 1 );

            this.Pr.NumPr = new CNumPr();
            this.Pr.NumPr.Set( NumPr.NumId, NewLvl );

            History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : NumPr, New : this.Pr.NumPr } );

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    // Добавление нумерации в параграф при открытии и копировании
    Numbering_Add_Open : function(NumId, Lvl)
    {
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set( NumId, Lvl );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Numbering_Get : function()
    {
        var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
        if ( undefined != NumPr && 0 != NumPr.NumId )
            return NumPr.Copy();

        return undefined;
    },

    // Удаляем нумерацию
    Numbering_Remove : function()
    {
        // Если у нас была задана нумерации в стиле, тогда чтобы ее отменить(не удаляя нумерацию в стиле)
        // мы проставляем NumPr с NumId undefined
        var OldNumPr = this.Numbering_Get();
        var NewNumPr = undefined;
        if ( undefined != this.CompiledPr.Pr.ParaPr.StyleNumPr )
        {
            NewNumPr = new CNumPr();
            NewNumPr.Set( 0, 0 );
        }

        History.Add( this, { Type : historyitem_Paragraph_Numbering, Old : undefined != this.Pr.NumPr ? this.Pr.NumPr : undefined, New : NewNumPr } );
        this.Pr.NumPr = NewNumPr;

        if ( undefined != this.Pr.Ind && undefined != OldNumPr )
        {
            // При удалении нумерации из параграфа, если отступ первой строки > 0, тогда
            // увеличиваем левый отступ параграфа, а первую сторку  делаем 0, а если отступ
            // первой строки < 0, тогда просто делаем оступ первой строки 0.

            if ( undefined === this.Pr.Ind.FirstLine || Math.abs( this.Pr.Ind.FirstLine ) < 0.001 )
            {
                if ( undefined != OldNumPr && undefined != OldNumPr.NumId )
                {
                    var Lvl = this.Parent.Get_Numbering().Get_AbstractNum(OldNumPr.NumId).Lvl[OldNumPr.Lvl];
                    if ( undefined != Lvl && undefined != Lvl.ParaPr.Ind && undefined != Lvl.ParaPr.Ind.Left )
                    {
                        var CurParaPr = this.Get_CompiledPr2(false).ParaPr;
                        var Left = CurParaPr.Ind.Left  + CurParaPr.Ind.FirstLine;

                        History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  New : Left, Old : this.Pr.Ind.Left } );
                        History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : 0,    Old : this.Pr.Ind.FirstLine } );
                        this.Pr.Ind.Left      = Left;
                        this.Pr.Ind.FirstLine = 0;
                    }
                }
            }
            else if ( this.Pr.Ind.FirstLine < 0 )
            {
                History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : 0, Old : this.Pr.Ind.FirstLine } );
                this.Pr.Ind.FirstLine = 0;
            }
            else if ( undefined != this.Pr.Ind.Left && this.Pr.Ind.FirstLine > 0 )
            {
                History.Add( this, { Type : historyitem_Paragraph_Ind_Left,  New : this.Pr.Ind.Left + this.Pr.Ind.FirstLine, Old : this.Pr.Ind.Left } );
                History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : 0, Old : this.Pr.Ind.FirstLine } );
                this.Pr.Ind.Left += this.Pr.Ind.FirstLine;
                this.Pr.Ind.FirstLine = 0;
            }
        }

        // При удалении проверяем стиль. Если данный стиль является стилем по умолчанию
        // для параграфов с нумерацией, тогда удаляем запись и о стиле.
        var StyleId = this.Style_Get();
        var NumStyleId = this.Parent.Get_Styles().Get_Default_ParaList();
        if ( StyleId === NumStyleId )
            this.Style_Remove();

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Используется ли заданная нумерация в параграфе
    Numbering_IsUse: function(NumId, Lvl)
    {
        var bLvl = (undefined === Lvl ? false : true);

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr && NumId === NumPr.NumId && ( false === bLvl || Lvl === NumPr.Lvl ) )
            return true;

        return false;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с нумерацией параграфов в презентациях
//-----------------------------------------------------------------------------------
    // Добавляем нумерацию к данному параграфу
    Add_PresentationNumbering : function(_Bullet)
    {
        var Bullet = _Bullet.Copy();

        History.Add( this, { Type : historyitem_Paragraph_PresentationPr_Bullet, New : Bullet, Old : this.PresentationPr.Bullet } );

        var OldType = this.PresentationPr.Bullet.Get_Type();
        var NewType = Bullet.Get_Type();
        this.PresentationPr.Bullet = Bullet;

        if ( OldType != NewType )
        {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftInd = Math.min( ParaPr.Ind.Left, ParaPr.Ind.Left + ParaPr.Ind.FirstLine );

            if ( numbering_presentationnumfrmt_None === NewType )
            {
                this.Set_Ind( { FirstLine : 0, Left : LeftInd } );
            }
            else if ( numbering_presentationnumfrmt_RomanLcPeriod === NewType || numbering_presentationnumfrmt_RomanUcPeriod === NewType )
            {
                this.Set_Ind( { Left : LeftInd + 15.9, FirstLine : -15.9 } );
            }
            else
            {
                this.Set_Ind( { Left : LeftInd + 14.3, FirstLine : -14.3 } );
            }
        }
    },

    Get_PresentationNumbering : function()
    {
        return this.PresentationPr.Bullet;
    },

    // Удаляем нумерацию
    Remove_PresentationNumbering : function()
    {
        this.Add_PresentationNumbering( new CPresentationBullet() );
    },

    Set_PresentationLevel : function(Level)
    {
        if ( this.PresentationPr.Level != Level )
        {
            History.Add( this, { Type : historyitem_Paragraph_PresentationPr_Level, Old : this.PresentationPr.Level, New : Level } );
            this.PresentationPr.Level = Level;
        }
    },
//-----------------------------------------------------------------------------------

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    // Также учитываем настройки предыдущего и последующего параграфов.
    Get_CompiledPr : function()
    {
        var Pr = this.Get_CompiledPr2();

        // При формировании конечных настроек параграфа, нужно учитывать предыдущий и последующий
        // параграфы. Например, для формирования интервала между параграфами.
        // max(Prev.After, Cur.Before) - реальное значение расстояния между параграфами.
        // Поэтому Prev.After = Prev.After (значение не меняем), а вот Cur.Before = max(Prev.After, Cur.Before) - Prev.After

        var StyleId = this.Style_Get();
        var PrevEl  = this.Get_DocumentPrev();
        var NextEl  = this.Get_DocumentNext();
        var NumPr   = this.Numbering_Get();

        if ( null != PrevEl && type_Paragraph === PrevEl.GetType() )
        {
            var PrevStyle      = PrevEl.Style_Get();
            var Prev_Pr        = PrevEl.Get_CompiledPr2(false).ParaPr;
            var Prev_After     = Prev_Pr.Spacing.After;
            var Prev_AfterAuto = Prev_Pr.Spacing.AfterAutoSpacing;
            var Cur_Before     = Pr.ParaPr.Spacing.Before;
            var Cur_BeforeAuto = Pr.ParaPr.Spacing.BeforeAutoSpacing;
            var Prev_NumPr     = PrevEl.Numbering_Get();

            if ( PrevStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
            {
                Pr.ParaPr.Spacing.Before = 0;
            }
            else
            {
                if ( true === Cur_BeforeAuto && PrevStyle === StyleId && undefined != Prev_NumPr && undefined != NumPr && Prev_NumPr.NumId === NumPr.NumId )
                    Pr.ParaPr.Spacing.Before = 0;
                else
                {
                    Cur_Before = this.Internal_CalculateAutoSpacing( Cur_Before, Cur_BeforeAuto, this );
                    Prev_After = this.Internal_CalculateAutoSpacing( Prev_After, Prev_AfterAuto, this );

                    if ( true === Prev_Pr.ContextualSpacing && PrevStyle === StyleId )
                        Prev_After = 0;

                    Pr.ParaPr.Spacing.Before = Math.max( Prev_After, Cur_Before ) - Prev_After;
                }
            }

            if ( false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd( Prev_Pr, Pr.ParaPr ) )
                Pr.ParaPr.Brd.First = false;
            else
                Pr.ParaPr.Brd.First = true;
        }
        else if ( null === PrevEl )
        {
            if ( true === Pr.ParaPr.Spacing.BeforeAutoSpacing )
            {
                Pr.ParaPr.Spacing.Before = 0;
            }
        }
        else if ( type_Table === PrevEl.GetType() )
        {
            if ( true === Pr.ParaPr.Spacing.BeforeAutoSpacing )
            {
                Pr.ParaPr.Spacing.Before = 14 * g_dKoef_pt_to_mm;
            }
        }

        if ( null != NextEl )
        {
            if ( type_Paragraph === NextEl.GetType() )
            {
                var NextStyle       = NextEl.Style_Get();
                var Next_Pr         = NextEl.Get_CompiledPr2(false).ParaPr;
                var Next_Before     = Next_Pr.Spacing.Before;
                var Next_BeforeAuto = Next_Pr.Spacing.BeforeAutoSpacing;
                var Cur_After       = Pr.ParaPr.Spacing.After;
                var Cur_AfterAuto   = Pr.ParaPr.Spacing.AfterAutoSpacing;
                var Next_NumPr      = NextEl.Numbering_Get();

                if ( NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
                {
                    Pr.ParaPr.Spacing.After = 0;
                }
                else
                {
                    if ( true === Cur_AfterAuto && NextStyle === StyleId && undefined != Next_NumPr && undefined != NumPr && Next_NumPr.NumId === NumPr.NumId )
                        Pr.ParaPr.Spacing.After = 0;
                    else
                    {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Cur_After, Cur_AfterAuto, this );
                    }
                }

                if ( false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd( Next_Pr, Pr.ParaPr ) )
                    Pr.ParaPr.Brd.Last = false;
                else
                    Pr.ParaPr.Brd.Last = true;
            }
            else if ( type_Table === NextEl.GetType() )
            {
                var TableFirstParagraph = NextEl.Get_FirstParagraph();
                if ( null != TableFirstParagraph && undefined != TableFirstParagraph )
                {
                    var NextStyle           = TableFirstParagraph.Style_Get();
                    var Next_Before         = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.Before;
                    var Next_BeforeAuto     = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.BeforeAutoSpacing;
                    var Cur_After           = Pr.ParaPr.Spacing.After;
                    var Cur_AfterAuto       = Pr.ParaPr.Spacing.AfterAutoSpacing;
                    if ( NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing )
                    {
                        Cur_After   = this.Internal_CalculateAutoSpacing( Cur_After,   Cur_AfterAuto,   this );
                        Next_Before = this.Internal_CalculateAutoSpacing( Next_Before, Next_BeforeAuto, this );

                        Pr.ParaPr.Spacing.After = Math.max( Next_Before, Cur_After ) - Cur_After;
                    }
                    else
                    {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Pr.ParaPr.Spacing.After, Cur_AfterAuto, this );
                    }
                }
            }
        }
        else
        {
            Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing( Pr.ParaPr.Spacing.After, Pr.ParaPr.Spacing.AfterAutoSpacing, this );
        }

        return Pr;
    },

    Recalc_CompiledPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
    },

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    // Без пересчета расстояния между параграфами.
    Get_CompiledPr2 : function(bCopy)
    {
        if ( true === this.CompiledPr.NeedRecalc )
        {
            this.CompiledPr.Pr = this.Internal_CompileParaPr();
            this.CompiledPr.NeedRecalc = false;
        }

        if ( false === bCopy )
            return this.CompiledPr.Pr;
        else
        {
            // Отдаем копию объекта, чтобы никто не поменял извне настройки скомпилированного стиля
            var Pr = {};
            Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
            Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();
            return Pr;
        }
    },

    // Формируем конечные свойства параграфа на основе стиля, возможной нумерации и прямых настроек.
    Internal_CompileParaPr : function()
    {
		if(this.bFromDocument)
		{
			var Styles     = this.Parent.Get_Styles();
			var Numbering  = this.Parent.Get_Numbering();
			var TableStyle = this.Parent.Get_TableStyleForPara();
			var StyleId    = this.Style_Get();

			// Считываем свойства для текущего стиля
			var Pr = Styles.Get_Pr( StyleId, styletype_Paragraph, TableStyle );

			// Если в стиле была задана нумерация сохраним это в специальном поле
			if ( undefined != Pr.ParaPr.NumPr )
				Pr.ParaPr.StyleNumPr = Pr.ParaPr.NumPr.Copy();

			var Lvl = -1;
			if ( undefined != this.Pr.NumPr )
			{
				if ( undefined != this.Pr.NumPr.NumId && 0 != this.Pr.NumPr.NumId )
				{
					Lvl = this.Pr.NumPr.Lvl;

					if ( Lvl >= 0 && Lvl <= 8 )
						Pr.ParaPr.Merge( Numbering.Get_ParaPr( this.Pr.NumPr.NumId, this.Pr.NumPr.Lvl ) );
					else
					{
						Lvl = -1;
						Pr.ParaPr.NumPr = undefined;
					}
				}
			}
			else if ( undefined != Pr.ParaPr.NumPr )
			{
				if ( undefined != Pr.ParaPr.NumPr.NumId && 0 != Pr.ParaPr.NumPr.NumId )
				{
					var AbstractNum = Numbering.Get_AbstractNum( Pr.ParaPr.NumPr.NumId );
					Lvl = AbstractNum.Get_LvlByStyle( StyleId );
					if ( -1 != Lvl )
					{}
					else
						Pr.ParaPr.NumPr = undefined;
				}
			}

			Pr.ParaPr.StyleTabs = ( undefined != Pr.ParaPr.Tabs ? Pr.ParaPr.Tabs.Copy() : new CParaTabs() );

			// Копируем прямые настройки параграфа.
			Pr.ParaPr.Merge( this.Pr );

			if ( -1 != Lvl && undefined != Pr.ParaPr.NumPr )
				Pr.ParaPr.NumPr.Lvl = Lvl;

			// Настройки рамки не наследуются
			if ( undefined === this.Pr.FramePr )
				Pr.ParaPr.FramePr = undefined;
			else
				Pr.ParaPr.FramePr = this.Pr.FramePr.Copy();

			return Pr;
		}
		else
		{
			return this.Internal_CompiledParaPrPresentation();
		}
    },
	
	Internal_CompiledParaPrPresentation: function()
	{
		var styleObject = this.Parent.Get_Styles(this.Pr.Lvl);
		var Styles     = styleObject.styles;
		var TableStyle = this.Parent.Get_TableStyleForPara();

		// Считываем свойства для текущего стиля
		var Pr = Styles.Get_Pr( styleObject.lastId, styletype_Paragraph, TableStyle );

		Pr.ParaPr.StyleTabs = ( undefined != Pr.ParaPr.Tabs ? Pr.ParaPr.Tabs.Copy() : new CParaTabs() );

		// Копируем прямые настройки параграфа.
		Pr.ParaPr.Merge( this.Pr );
		if(this.Pr.DefaultRunPr)
			Pr.TextPr.Merge( this.Pr.DefaultRunPr );
		return Pr;
	},
	// Сообщаем параграфу, что ему надо будет пересчитать скомпилированный стиль
    // (Такое может случится, если у данного параграфа есть нумерация или задан стиль,
    //  которые меняются каким-то внешним образом)
    Recalc_CompileParaPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
    },

    Internal_CalculateAutoSpacing : function(Value, UseAuto, Para)
    {
        var Result = Value;
        if ( true === UseAuto )
        {
            if ( true === Para.Parent.Is_TableCellContent() )
                Result = 0;
            else
                Result = 14 * g_dKoef_pt_to_mm;
        }

        return Result;
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        var ParaPr = this.Pr.Copy();
        return ParaPr;
    },

    Paragraph_Format_Paste : function(TextPr, ParaPr, ApplyPara)
    {
        // Применяем текстовые настройки всегда
        if ( null != TextPr )
            this.Add( new ParaTextPr( TextPr ) );

        var _ApplyPara = ApplyPara;
        if ( false === _ApplyPara )
        {
            if ( true === this.Selection.Use )
            {
                _ApplyPara = true;

                var Start = this.Selection.StartPos;
                var End   = this.Selection.EndPos;
                if ( Start > End )
                {
                    Start = this.Selection.EndPos;
                    End   = this.Selection.StartPos;
                }

                if ( true === this.Internal_FindForward( End, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math]).Found )
                    _ApplyPara = false;
                else if ( true === this.Internal_FindBackward( Start - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math]).Found )
                    _ApplyPara = false;
            }
            else
                _ApplyPara = true;
        }

        // Применяем настройки параграфа
        if ( true === _ApplyPara && null != ParaPr )
        {
            // Ind
            if ( undefined != ParaPr.Ind )
                this.Set_Ind( ParaPr.Ind, false );

            // Jc
            if ( undefined != ParaPr.Jc )
                this.Set_Align( ParaPr.Jc );

            // Spacing
            if ( undefined != ParaPr.Spacing )
                this.Set_Spacing( ParaPr.Spacing, false );

            // PageBreakBefore
            if ( undefined != ParaPr.PageBreakBefore )
                this.Set_PageBreakBefore( ParaPr.PageBreakBefore );

            // KeepLines
            if ( undefined != ParaPr.KeepLines )
                this.Set_KeepLines( ParaPr.KeepLines );

            // ContextualSpacing
            if ( undefined != ParaPr.ContextualSpacing )
                this.Set_ContextualSpacing( ParaPr.ContextualSpacing );

            // Shd
            if ( undefined != ParaPr.Shd )
                this.Set_Shd( ParaPr.Shd, false );

            // NumPr
            if ( undefined != ParaPr.NumPr )
                this.Numbering_Set( ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl );
            else
                this.Numbering_Remove();

            // StyleId
            if ( undefined != ParaPr.PStyle )
                this.Style_Add( ParaPr.PStyle, true );
            else
                this.Style_Remove();

            // Brd
            if ( undefined != ParaPr.Brd )
                this.Set_Borders( ParaPr.Brd );
        }
    },

    Style_Get : function()
    {
        if ( undefined != this.Pr.PStyle )
            return this.Pr.PStyle;

        return undefined;
    },

    Style_Add : function(Id, bDoNotDeleteProps)
    {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);

        var Id_old = this.Pr.PStyle;
        if ( undefined === this.Pr.PStyle )
            Id_old = null;
        else
            this.Style_Remove();

        if ( null === Id )
            return;

        // Если стиль является стилем по умолчанию для параграфа, тогда не надо его записывать.
        if ( Id != this.Parent.Get_Styles().Get_Default_Paragraph() )
        {
            History.Add( this, { Type : historyitem_Paragraph_PStyle, Old : Id_old, New : Id } );
            this.Pr.PStyle = Id;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;

        if ( true === bDoNotDeleteProps )
            return;

        // TODO: По мере добавления элементов в стили параграфа и текста добавить их обработку здесь.

        // Не удаляем форматирование, при добавлении списка к данному параграфу
        var DefNumId = this.Parent.Get_Styles().Get_Default_ParaList();
        if ( Id != DefNumId && ( Id_old != DefNumId || Id != this.Parent.Get_Styles().Get_Default_Paragraph() ) )
        {
            this.Set_ContextualSpacing( undefined );
            this.Set_Ind( new CParaInd(), true );
            this.Set_Align( undefined );
            this.Set_KeepLines( undefined );
            this.Set_KeepNext( undefined );
            this.Set_PageBreakBefore( undefined );
            this.Set_Spacing( new CParaSpacing(), true );
            this.Set_Shd( undefined, true );
            this.Set_WidowControl( undefined );
            this.Set_Tabs( new CParaTabs() );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Between );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Bottom );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Left );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Right );
            this.Set_Border( undefined, historyitem_Paragraph_Borders_Top );

            // При изменении стиля убираются только те текстовые настроки внутри параграфа,
            // которые присутствуют в стиле. Пока мы удалим вообще все настроки.
            // TODO : переделать
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                if ( para_TextPr === Item.Type )
                {
                    Item.Clear_Style();
                }
            }
        }
    },

    // Добавление стиля в параграф при открытии и копировании
    Style_Add_Open : function(Id)
    {
        this.Pr.PStyle = Id;

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Style_Remove : function()
    {
        if ( undefined != this.Pr.PStyle )
        {
            History.Add( this, { Type : historyitem_Paragraph_PStyle, Old : this.Pr.PStyle, New : undefined } );
            this.Pr.PStyle = undefined;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Проверяем находится ли курсор в конце параграфа
    Cursor_IsEnd : function(_ContentPos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( undefined === ContentPos )
                ContentPos = this.CurPos.ContentPos;

            var oPos = this.Internal_FindForward( ContentPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );

            if ( true === oPos.Found )
                return false;
            else
                return true;
        }
        else
        {
            // Просто попробуем переместится вправо от текущего положения, если мы не можем, значит
            // мы стоим в конце параграфа.

            var ContentPos = ( undefined === _ContentPos ? this.Get_ParaContentPos( false, false ) : _ContentPos );
            var SearchPos  = new CParagraphSearchPos();

            this.Get_RightPos( SearchPos, ContentPos, false );

            if ( true === SearchPos.Found )
                return false;
            else
                return true;
        }
    },

    // Проверяем находится ли курсор в начале параграфа
    Cursor_IsStart : function(_ContentPos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( undefined === ContentPos )
                ContentPos = this.CurPos.ContentPos;

            var oPos = this.Internal_FindBackward( ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_Math] );
            if ( true === oPos.Found )
                return false;
            else
                return true;
        }
        else
        {
            // Просто попробуем переместится вправо от текущего положения, если мы не можем, значит
            // мы стоим в конце параграфа.

            var ContentPos = ( undefined === _ContentPos ? this.Get_ParaContentPos( false, false ) : _ContentPos );
            var SearchPos  = new CParagraphSearchPos();

            this.Get_LeftPos( SearchPos, ContentPos );

            if ( true === SearchPos.Found )
                return false;
            else
                return true;
        }
    },

    // Проверим, начинается ли выделение с начала параграфа
    Selection_IsFromStart : function()
    {
        if ( true === this.Is_SelectionUse() )
        {
            var StartPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos );

            if ( true != this.Cursor_IsStart( StartPos ) )
                return false;

            return true;
        }

        return false;
    },

    // Очищение форматирования параграфа
    Clear_Formatting : function()
    {
        this.Style_Remove();
        this.Numbering_Remove();

        this.Set_ContextualSpacing(undefined);
        this.Set_Ind( new CParaInd(), true );
        this.Set_Align( undefined, false );
        this.Set_KeepLines( undefined );
        this.Set_KeepNext( undefined );
        this.Set_PageBreakBefore( undefined );
        this.Set_Spacing( new CParaSpacing(), true );
        this.Set_Shd( new CDocumentShd(), true );
        this.Set_WidowControl( undefined );
        this.Set_Tabs( new CParaTabs() );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Between );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Bottom );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Left );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Right );
        this.Set_Border( undefined, historyitem_Paragraph_Borders_Top );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Clear_TextFormatting : function()
    {
        var Styles = this.Parent.Get_Styles();
        var DefHyper = Styles.Get_Default_Hyperlink();
        // TODO: Сделать, чтобы данная функция работала по выделению
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_TextPr === Item.Type )
            {
                Item.Set_Bold( undefined );
                Item.Set_Italic( undefined );
                Item.Set_Strikeout( undefined );
                Item.Set_Underline( undefined );
                Item.Set_FontFamily( undefined );
                Item.Set_FontSize( undefined );
                Item.Set_Color( undefined );
                Item.Set_VertAlign( undefined );
                Item.Set_HighLight( undefined );
                Item.Set_Spacing( undefined );
                Item.Set_DStrikeout( undefined );
                Item.Set_Caps( undefined );
                Item.Set_SmallCaps( undefined );
                Item.Set_Position( undefined );
                Item.Set_RFonts2( undefined );
                Item.Set_Lang( undefined );

                if ( undefined === Item.Value.RStyle || Item.Value.RStyle != DefHyper )
                {
                    Item.Set_RStyle( undefined );
                }
            }
        }
    },

    Set_Ind : function(Ind, bDeleteUndefined)
    {
        if ( undefined === this.Pr.Ind )
            this.Pr.Ind = new CParaInd();

        if ( ( undefined != Ind.FirstLine || true === bDeleteUndefined ) && this.Pr.Ind.FirstLine !== Ind.FirstLine )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_First, New : Ind.FirstLine, Old : ( undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined ) } );
            this.Pr.Ind.FirstLine = Ind.FirstLine;
        }

        if ( ( undefined != Ind.Left || true === bDeleteUndefined ) && this.Pr.Ind.Left !== Ind.Left )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_Left, New : Ind.Left, Old : ( undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined ) } );
            this.Pr.Ind.Left = Ind.Left;
        }

        if ( ( undefined != Ind.Right || true === bDeleteUndefined ) && this.Pr.Ind.Right !== Ind.Right )
        {
            History.Add( this, { Type : historyitem_Paragraph_Ind_Right, New : Ind.Right, Old : ( undefined != this.Pr.Ind.Right ? this.Pr.Ind.Right : undefined ) } );
            this.Pr.Ind.Right = Ind.Right;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Spacing : function(Spacing, bDeleteUndefined)
    {
        if ( undefined === this.Pr.Spacing )
            this.Pr.Spacing = new CParaSpacing();

        if ( ( undefined != Spacing.Line || true === bDeleteUndefined ) && this.Pr.Spacing.Line !== Spacing.Line )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_Line, New : Spacing.Line, Old : ( undefined != this.Pr.Spacing.Line ? this.Pr.Spacing.Line : undefined ) } );
            this.Pr.Spacing.Line = Spacing.Line;
        }

        if ( ( undefined != Spacing.LineRule || true === bDeleteUndefined ) && this.Pr.Spacing.LineRule !== Spacing.LineRule )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_LineRule, New : Spacing.LineRule, Old : ( undefined != this.Pr.Spacing.LineRule ? this.Pr.Spacing.LineRule : undefined ) } );
            this.Pr.Spacing.LineRule = Spacing.LineRule;
        }

        if ( ( undefined != Spacing.Before || true === bDeleteUndefined ) && this.Pr.Spacing.Before !== Spacing.Before )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_Before, New : Spacing.Before, Old : ( undefined != this.Pr.Spacing.Before ? this.Pr.Spacing.Before : undefined ) } );
            this.Pr.Spacing.Before = Spacing.Before;
        }

        if ( ( undefined != Spacing.After || true === bDeleteUndefined ) && this.Pr.Spacing.After !== Spacing.After )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_After, New : Spacing.After, Old : ( undefined != this.Pr.Spacing.After ? this.Pr.Spacing.After : undefined ) } );
            this.Pr.Spacing.After = Spacing.After;
        }

        if ( ( undefined != Spacing.AfterAutoSpacing || true === bDeleteUndefined ) && this.Pr.Spacing.AfterAutoSpacing !== Spacing.AfterAutoSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_AfterAutoSpacing, New : Spacing.AfterAutoSpacing, Old : ( undefined != this.Pr.Spacing.AfterAutoSpacing ? this.Pr.Spacing.AfterAutoSpacing : undefined ) } );
            this.Pr.Spacing.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }

        if ( ( undefined != Spacing.BeforeAutoSpacing || true === bDeleteUndefined ) && this.Pr.Spacing.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_Spacing_BeforeAutoSpacing, New : Spacing.BeforeAutoSpacing, Old : ( undefined != this.Pr.Spacing.BeforeAutoSpacing ? this.Pr.Spacing.BeforeAutoSpacing : undefined ) } );
            this.Pr.Spacing.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Align : function(Align)
    {
        if ( this.Pr.Jc != Align )
        {
            History.Add( this, { Type : historyitem_Paragraph_Align, New : Align, Old : ( undefined != this.Pr.Jc ? this.Pr.Jc : undefined ) } );
            this.Pr.Jc = Align;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_Shd : function(_Shd, bDeleteUndefined)
    {
        if ( undefined === _Shd )
        {
            if ( undefined != this.Pr.Shd )
            {
                History.Add( this, { Type : historyitem_Paragraph_Shd, New : undefined, Old : this.Pr.Shd } );
                this.Pr.Shd = undefined;
            }
        }
        else
        {
            var Shd = new CDocumentShd();
            Shd.Set_FromObject( _Shd );

            if ( undefined === this.Pr.Shd )
                this.Pr.Shd = new CDocumentShd();

            if ( ( undefined != Shd.Value || true === bDeleteUndefined ) && this.Pr.Shd.Value !== Shd.Value )
            {
                History.Add( this, { Type : historyitem_Paragraph_Shd_Value, New : Shd.Value, Old : ( undefined != this.Pr.Shd.Value ? this.Pr.Shd.Value : undefined ) } );
                this.Pr.Shd.Value = Shd.Value;
            }

            if ( undefined != Shd.Color || true === bDeleteUndefined )
            {
                History.Add( this, { Type : historyitem_Paragraph_Shd_Color, New : Shd.Color, Old : ( undefined != this.Pr.Shd.Color ? this.Pr.Shd.Color : undefined ) } );
                this.Pr.Shd.Color = Shd.Color;
            }
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Tabs : function(Tabs)
    {
        var _Tabs = new CParaTabs();

        var StyleTabs = this.Get_CompiledPr2(false).ParaPr.StyleTabs;

        // 1. Ищем табы, которые уже есть в стиле (такие добавлять не надо)
        for ( var Index = 0; Index < Tabs.Tabs.length; Index++ )
        {
            var Value = StyleTabs.Get_Value( Tabs.Tabs[Index].Pos );
            if ( -1 === Value )
                _Tabs.Add( Tabs.Tabs[Index] );
        }

        // 2. Ищем табы в стиле, которые нужно отменить
        for ( var Index = 0; Index < StyleTabs.Tabs.length; Index++ )
        {
            var Value = _Tabs.Get_Value( StyleTabs.Tabs[Index].Pos );
            if ( tab_Clear != StyleTabs.Tabs[Index] && -1 === Value )
                _Tabs.Add( new CParaTab(tab_Clear, StyleTabs.Tabs[Index].Pos ) );
        }

        History.Add( this, { Type : historyitem_Paragraph_Tabs, New : _Tabs, Old : this.Pr.Tabs } );
        this.Pr.Tabs = _Tabs;

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_ContextualSpacing : function(Value)
    {
        if ( Value != this.Pr.ContextualSpacing )
        {
            History.Add( this, { Type : historyitem_Paragraph_ContextualSpacing, New : Value, Old : ( undefined != this.Pr.ContextualSpacing ? this.Pr.ContextualSpacing : undefined ) } );
            this.Pr.ContextualSpacing = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_PageBreakBefore : function(Value)
    {
        if ( Value != this.Pr.PageBreakBefore )
        {
            History.Add( this, { Type : historyitem_Paragraph_PageBreakBefore, New : Value, Old : ( undefined != this.Pr.PageBreakBefore ? this.Pr.PageBreakBefore : undefined ) } );
            this.Pr.PageBreakBefore = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_KeepLines : function(Value)
    {
        if ( Value != this.Pr.KeepLines )
        {
            History.Add( this, { Type : historyitem_Paragraph_KeepLines, New : Value, Old : ( undefined != this.Pr.KeepLines ? this.Pr.KeepLines : undefined ) } );
            this.Pr.KeepLines = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_KeepNext : function(Value)
    {
        if ( Value != this.Pr.KeepNext )
        {
            History.Add( this, { Type : historyitem_Paragraph_KeepNext, New : Value, Old : ( undefined != this.Pr.KeepNext ? this.Pr.KeepNext : undefined ) } );
            this.Pr.KeepNext = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_WidowControl : function(Value)
    {
        if ( Value != this.Pr.WidowControl )
        {
            History.Add( this, { Type : historyitem_Paragraph_WidowControl, New : Value, Old : ( undefined != this.Pr.WidowControl ? this.Pr.WidowControl : undefined ) } );
            this.Pr.WidowControl = Value;

            // Надо пересчитать конечный стиль
            this.CompiledPr.NeedRecalc = true;
        }
    },

    Set_Borders : function(Borders)
    {
        if ( undefined === Borders )
            return;

        var OldBorders = this.Get_CompiledPr2(false).ParaPr.Brd;

        if ( undefined != Borders.Between )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Between.Value /*&& border_Single === Borders.Between.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Between.Color ? new CDocumentColor( Borders.Between.Color.r, Borders.Between.Color.g, Borders.Between.Color.b ) : new CDocumentColor( OldBorders.Between.Color.r, OldBorders.Between.Color.g, OldBorders.Between.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Between.Space ? Borders.Between.Space : OldBorders.Between.Space );
                NewBorder.Size  = ( undefined != Borders.Between.Size  ? Borders.Between.Size  : OldBorders.Between.Size  );
                NewBorder.Value = ( undefined != Borders.Between.Value ? Borders.Between.Value : OldBorders.Between.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Between, New : NewBorder, Old : this.Pr.Brd.Between } );
            this.Pr.Brd.Between = NewBorder;
        }

        if ( undefined != Borders.Top )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Top.Value /*&& border_Single === Borders.Top.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Top.Color ? new CDocumentColor( Borders.Top.Color.r, Borders.Top.Color.g, Borders.Top.Color.b ) : new CDocumentColor( OldBorders.Top.Color.r, OldBorders.Top.Color.g, OldBorders.Top.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Top.Space ? Borders.Top.Space : OldBorders.Top.Space );
                NewBorder.Size  = ( undefined != Borders.Top.Size  ? Borders.Top.Size  : OldBorders.Top.Size  );
                NewBorder.Value = ( undefined != Borders.Top.Value ? Borders.Top.Value : OldBorders.Top.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Top, New : NewBorder, Old : this.Pr.Brd.Top } );
            this.Pr.Brd.Top = NewBorder;
        }

        if ( undefined != Borders.Right )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Right.Value /*&& border_Single === Borders.Right.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Right.Color ? new CDocumentColor( Borders.Right.Color.r, Borders.Right.Color.g, Borders.Right.Color.b ) : new CDocumentColor( OldBorders.Right.Color.r, OldBorders.Right.Color.g, OldBorders.Right.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Right.Space ? Borders.Right.Space : OldBorders.Right.Space );
                NewBorder.Size  = ( undefined != Borders.Right.Size  ? Borders.Right.Size  : OldBorders.Right.Size  );
                NewBorder.Value = ( undefined != Borders.Right.Value ? Borders.Right.Value : OldBorders.Right.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Right, New : NewBorder, Old : this.Pr.Brd.Right } );
            this.Pr.Brd.Right = NewBorder;
        }

        if ( undefined != Borders.Bottom )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Bottom.Value /*&& border_Single === Borders.Bottom.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Bottom.Color ? new CDocumentColor( Borders.Bottom.Color.r, Borders.Bottom.Color.g, Borders.Bottom.Color.b ) : new CDocumentColor( OldBorders.Bottom.Color.r, OldBorders.Bottom.Color.g, OldBorders.Bottom.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Bottom.Space ? Borders.Bottom.Space : OldBorders.Bottom.Space );
                NewBorder.Size  = ( undefined != Borders.Bottom.Size  ? Borders.Bottom.Size  : OldBorders.Bottom.Size  );
                NewBorder.Value = ( undefined != Borders.Bottom.Value ? Borders.Bottom.Value : OldBorders.Bottom.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Bottom, New : NewBorder, Old : this.Pr.Brd.Bottom } );
            this.Pr.Brd.Bottom = NewBorder;
        }

        if ( undefined != Borders.Left  )
        {
            var NewBorder = undefined;
            if ( undefined != Borders.Left.Value /*&& border_Single === Borders.Left.Value*/ )
            {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = ( undefined != Borders.Left.Color ? new CDocumentColor( Borders.Left.Color.r, Borders.Left.Color.g, Borders.Left.Color.b ) : new CDocumentColor( OldBorders.Left.Color.r, OldBorders.Left.Color.g, OldBorders.Left.Color.b ) );
                NewBorder.Space = ( undefined != Borders.Left.Space ? Borders.Left.Space : OldBorders.Left.Space );
                NewBorder.Size  = ( undefined != Borders.Left.Size  ? Borders.Left.Size  : OldBorders.Left.Size  );
                NewBorder.Value = ( undefined != Borders.Left.Value ? Borders.Left.Value : OldBorders.Left.Value );
            }

            History.Add( this, { Type : historyitem_Paragraph_Borders_Left, New : NewBorder, Old : this.Pr.Brd.Left } );
            this.Pr.Brd.Left = NewBorder;
        }

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    Set_Border : function(Border, HistoryType)
    {
        var OldValue;
        switch( HistoryType )
        {
            case historyitem_Paragraph_Borders_Between: OldValue = this.Pr.Brd.Between; this.Pr.Brd.Between = Border; break;
            case historyitem_Paragraph_Borders_Bottom:  OldValue = this.Pr.Brd.Bottom;  this.Pr.Brd.Bottom  = Border; break;
            case historyitem_Paragraph_Borders_Left:    OldValue = this.Pr.Brd.Left;    this.Pr.Brd.Left    = Border; break;
            case historyitem_Paragraph_Borders_Right:   OldValue = this.Pr.Brd.Right;   this.Pr.Brd.Right   = Border; break;
            case historyitem_Paragraph_Borders_Top:     OldValue = this.Pr.Brd.Top;     this.Pr.Brd.Top     = Border; break;
        }

        History.Add( this, { Type : HistoryType, New : Border, Old : OldValue } );

        // Надо пересчитать конечный стиль
        this.CompiledPr.NeedRecalc = true;
    },

    // Проверяем начинается ли текущий параграф с новой страницы.
    Is_StartFromNewPage : function()
    {
        // TODO: пока здесь стоит простая проверка. В будущем надо будет данную проверку улучшить.
        //       Например, сейчас не учитывается случай, когда в начале параграфа стоит PageBreak.

        if ( ( this.Pages.length > 1 && 0 === this.Pages[1].FirstLine ) || ( null === this.Get_DocumentPrev() ) )
            return true;

        return false;
    },

    Internal_GetPage : function(Pos)
    {
        if ( undefined === Pos )
            Pos = this.CurPos.ContentPos;

        return this.Internal_Get_ParaPos_By_Pos( Pos).Page;
    },

    // Ищем графический объект по Id и удаляем запись он нем в параграфе
    Remove_DrawingObject : function(Id)
    {
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Drawing === Item.Type && Id === Item.Get_Id() )
            {
                var HdrFtr = this.Parent.Is_HdrFtr(true);
                if ( null != HdrFtr && true != Item.Is_Inline() )
                    HdrFtr.RecalcInfo.NeedRecalc = true;

                this.Internal_Content_Remove( Index );
                return Index;
            }
        }

        return -1;
    },

    Internal_CorrectAnchorPos : function(Result, Drawing, PageNum)
    {
        // Поправляем позицию
        var RelH = Drawing.PositionH.RelativeFrom;
        var RelV = Drawing.PositionV.RelativeFrom;

        var ContentPos = 0;

        if ( c_oAscRelativeFromH.Character != RelH || c_oAscRelativeFromV.Line != RelV )
        {
            var CurLine = Result.Internal.Line;
            if ( c_oAscRelativeFromV.Line != RelV )
            {
                var CurPage = Result.Internal.Page;
                CurLine = this.Pages[CurPage].StartLine;
            }

            var StartLinesPos = this.Lines[CurLine].StartPos;
            var EndLinesPos   = this.Lines[CurLine].EndPos;
            var CurRange = this.Internal_Get_ParaPos_By_Pos( StartLinesPos).Range;
            Result.X = this.Lines[CurLine].Ranges[CurRange].X - 3.8;
            ContentPos = Math.min( StartLinesPos + 1, EndLinesPos );
        }

        if ( c_oAscRelativeFromV.Line != RelV )
        {
            var CurPage = Result.Internal.Page;
            var CurLine = this.Pages[CurPage].StartLine;
            Result.Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent;
        }

        if ( c_oAscRelativeFromH.Character === RelH  )
        {
            // Ничего не делаем
        }
        else if ( c_oAscRelativeFromV.Line === RelV )
        {
            var CurLine = this.Internal_Get_ParaPos_By_Pos( Result.ContentPos).Line;
            Result.ContentPos = this.Lines[CurLine].StartPos;
        }
        else
        {
            Result.ContentPos = ContentPos;
        }
    },

    // Получем ближающую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y, bAnchor, Drawing)
    {
        var ContentPos = this.Internal_GetContentPosByXY( X, Y, false, PageNum ).Pos;
        var Result = this.Internal_Recalculate_CurPos( ContentPos, false, false, true );

        // Сохраняем параграф и найденное место в параграфе
        Result.ContentPos = ContentPos;
        Result.Paragraph  = this;

        if ( true === bAnchor && undefined != Drawing && null != Drawing )
            this.Internal_CorrectAnchorPos( Result, Drawing, PageNum - this.PageNum );

        return Result;
    },

    Check_NearestPos : function(NearPos)
    {
        this.NearPosArray.push( NearPos );
    },

    Get_Layout : function(ContentPos, Drawing)
    {
        var LinePos = this.Internal_Get_ParaPos_By_Pos( ContentPos );

        var CurLine  = LinePos.Line;
        var CurRange = LinePos.Range;
        var CurPage  = LinePos.Page;

        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;

        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        if ( StartPos < this.Numbering.Pos )
            X += this.Numbering.WidthVisible;

        var LastW = 0;
        for ( var ItemNum = StartPos; ItemNum < this.Content.length; ItemNum++ )
        {
            var Item = this.Content[ItemNum];

            if ( ItemNum === ContentPos )
            {
                var DrawingObjects = this.Parent.DrawingObjects;
                var PageLimits = this.Parent.Get_PageLimits(this.PageNum + CurPage);
                var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);

                var ColumnStartX = (0 === CurPage ? this.X_ColumnStart : this.Pages[CurPage].X);
                var ColumnEndX   = (0 === CurPage ? this.X_ColumnEnd   : this.Pages[CurPage].XLimit);

                var Top_Margin    = Y_Top_Margin;
                var Bottom_Margin = Y_Bottom_Margin;
                var Page_H        = Page_Height;

                if ( true === this.Parent.Is_TableCellContent() && undefined != Drawing && true == Drawing.Use_TextWrap() )
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

                return { ParagraphLayout : new CParagraphLayout( X, Y , this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y ), PageLimits : PageLimits };
            }

            switch ( Item.Type )
            {
                case para_Text:
                case para_Space:
                case para_PageNum:
                {
                    LastW = Item.WidthVisible;

                    break;
                }
                case para_Drawing:
                {
                    if ( true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape() )
                    {
                        LastW = Item.WidthVisible;
                    }

                    break;
                }
            }

            X += Item.WidthVisible;
        }

        return undefined;
    },

    Get_AnchorPos : function(Drawing)
    {
        // Ищем, где находится наш объект
        var ContentPos = -1;
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];

            if ( para_Drawing === Item.Type && Item.Get_Id() === Drawing.Get_Id() )
            {
                ContentPos = Index;
                break;
            }
        }

        var CurPage = this.Internal_Get_ParaPos_By_Pos( ContentPos).Page;

        if ( -1 === ContentPos )
            return { X : 0, Y : 0, Height : 0 };

        var Result = this.Internal_Recalculate_CurPos( ContentPos, false, false, true );
        Result.Paragraph  = this;
        Result.ContentPos = ContentPos;
        this.Internal_CorrectAnchorPos( Result, Drawing, CurPage );

        return Result;
    },

    Set_DocumentNext : function(Object)
    {
        History.Add( this, { Type : historyitem_Paragraph_DocNext, New : Object, Old : this.Next } );
        this.Next = Object;
    },

    Set_DocumentPrev : function(Object)
    {
        History.Add( this, { Type : historyitem_Paragraph_DocPrev, New : Object, Old : this.Prev } );
        this.Prev = Object;
    },

    Get_DocumentNext : function()
    {
        return this.Next;
    },

    Get_DocumentPrev : function()
    {
        return this.Prev;
    },

    Set_DocumentIndex : function(Index)
    {
        this.Index = Index;
    },

    Set_Parent : function(ParentObject)
    {
        History.Add( this, { Type : historyitem_Paragraph_Parent, New : ParentObject, Old : this.Parent } );
        this.Parent = ParentObject;
    },

    Get_Parent : function()
    {
        return this.Parent;
    },

    Is_ContentOnFirstPage : function()
    {
        // Если параграф сразу переносится на новую страницу, тогда это значение обычно -1
        if ( this.Pages[0].EndLine < 0 )
            return false;

        return true;
    },

    Get_CurrentPage_Absolute : function()
    {
        // Обновляем позицию
        this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );
        return (this.Get_StartPage_Absolute() + this.CurPos.PagesPos);
    },

    Get_CurrentPage_Relative : function()
    {
        // Обновляем позицию
        this.Internal_Recalculate_CurPos( this.CurPos.ContentPos, true, false, false );
        return (this.PageNum + this.CurPos.PagesPos);
    },

    // на вход подается строка с как минимум 1 символом (поэтому тут это не проверяем)
    DocumentSearch : function(Str, ElementType)
    {
        var Pr = this.Get_CompiledPr();

        var StartPage = this.Get_StartPage_Absolute();

        var SearchResults = new Array();

        // Сначала найдем элементы поиска в данном параграфе
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type )
                continue;

            if ( (" " === Str[0] && para_Space === Item.Type) || ( para_Text === Item.Type && (Item.Value).toLowerCase() === Str[0].toLowerCase() ) )
            {
                if ( 1 === Str.length )
                    SearchResults.push( { StartPos : Pos, EndPos : Pos + 1 } );
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

                        if ( ( Pos2 >= this.Content.length ) || (" " === Str[Index] && para_Space != this.Content[Pos2].Type) || ( " " != Str[Index] && ( ( para_Text != this.Content[Pos2].Type ) || ( para_Text === this.Content[Pos2].Type && this.Content[Pos2].Value.toLowerCase() != Str[Index].toLowerCase() ) ) ) )
                        {
                            bFind = false;
                            break;
                        }

                        Pos2++;
                    }

                    if ( true === bFind )
                    {
                        SearchResults.push( { StartPos : Pos, EndPos : Pos2 } );
                    }
                }
            }
        }

        var MaxShowValue = 100;
        for ( var FoundIndex = 0; FoundIndex < SearchResults.length; FoundIndex++ )
        {
            var Rects = new Array();

            // Делаем подсветку
            var StartPos = SearchResults[FoundIndex].StartPos;
            var EndPos   = SearchResults[FoundIndex].EndPos;


            // Найдем линию, с которой начинается селект
            var StartParaPos = this.Internal_Get_ParaPos_By_Pos( StartPos );
            var CurLine  = StartParaPos.Line;
            var CurRange = StartParaPos.Range;
            var PNum     = StartParaPos.Page;

            // Найдем начальный сдвиг в данном отрезке
            var StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Pos, Item;
            for ( Pos = this.Lines[CurLine].Ranges[CurRange].StartPos; Pos <= StartPos - 1; Pos++ )
            {
                Item = this.Content[Pos];

                if ( Pos === this.Numbering.Pos )
                    StartX += this.Numbering.WidthVisible;
                if ( undefined != Item.WidthVisible && ( para_Drawing != Item.Type || drawing_Inline === Item.DrawingType  ) )
                    StartX += Item.WidthVisible;
            }

            if ( this.Pages[PNum].StartLine > CurLine )
            {
                CurLine = this.Pages[PNum].StartLine;
                CurRange = 0;
                StartX   = this.Lines[CurLine].Ranges[CurRange].XVisible;
                StartPos = this.Lines[this.Pages[PNum].StartLine].StartPos;
            }

            var StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
            var EndY   = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
            if ( this.Lines[CurLine].Metrics.LineGap < 0 )
                EndY += this.Lines[CurLine].Metrics.LineGap;

            var W = 0;


            for ( Pos = StartPos; Pos < EndPos; Pos++ )
            {
                Item = this.Content[Pos];

                if ( undefined != Item.CurPage )
                {
                    if ( Item.CurPage > PNum )
                        PNum = Item.CurPage;

                    if ( CurLine < Item.CurLine )
                    {
                        Rects.push( { PageNum : StartPage + PNum, X : StartX, Y : StartY, W : W, H : EndY - StartY } );

                        CurLine  = Item.CurLine;
                        CurRange = Item.CurRange;

                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;

                        StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
                        EndY   = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);

                        if ( this.Lines[CurLine].Metrics.LineGap < 0 )
                            EndY += this.Lines[CurLine].Metrics.LineGap;

                        W = 0;
                    }
                    else if ( CurRange < Item.CurRange )
                    {
                        Rects.push( { PageNum : StartPage + PNum, X : StartX, Y : StartY, W : W, H : EndY - StartY } );

                        CurRange = Item.CurRange;

                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;

                        W = 0;
                    }
                }

                if ( undefined != Item.WidthVisible )
                    W += Item.WidthVisible;

                if ( Pos == EndPos - 1 )
                    Rects.push( { PageNum : StartPage + PNum, X : StartX, Y : StartY, W : W, H : EndY - StartY } );
            }

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

            this.DrawingDocument.AddPageSearch( ResultStr, Rects, ElementType );
        }
    },

    DocumentStatistics : function(Stats)
    {
        var bEmptyParagraph = true;
        var bWord = false;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var bSymbol  = false;
            var bSpace   = false;
            var bNewWord = false;

            if ( (para_Text === Item.Type && false === Item.Is_NBSP()) || (para_PageNum === Item.Type) )
            {
                if ( false === bWord )
                    bNewWord = true;

                bWord   = true;
                bSymbol = true;
                bSpace  = false;
                bEmptyParagraph = false;
            }
            else if ( ( para_Text === Item.Type && true === Item.Is_NBSP() ) || para_Space === Item.Type || para_Tab === Item.Type )
            {
                bWord   = false;
                bSymbol = true;
                bSpace  = true;
            }

            if ( true === bSymbol )
                Stats.Add_Symbol( bSpace );

            if ( true === bNewWord )
                Stats.Add_Word();
        }

        var NumPr = this.Numbering_Get();
        if ( undefined != NumPr )
        {
            bEmptyParagraph = false;
            this.Parent.Get_Numbering().Get_AbstractNum( NumPr.NumId).DocumentStatistics( NumPr.Lvl, Stats );
        }

        if ( false === bEmptyParagraph )
            Stats.Add_Paragraph();
    },

    TurnOff_RecalcEvent : function()
    {
        this.TurnOffRecalcEvent = true;
    },

    TurnOn_RecalcEvent : function()
    {
        this.TurnOffRecalcEvent = false;
    },

    Set_ApplyToAll : function(bValue)
    {
        this.ApplyToAll = bValue;
    },

    Get_ApplyToAll : function()
    {
        return this.ApplyToAll;
    },

    Update_CursorType : function(X, Y, PageIndex)
    {
        var text_transform = null;
        var cur_parent = this.Parent;
        if(this.Parent.Is_TableCellContent())
        {
            while(isRealObject(cur_parent) && cur_parent.Is_TableCellContent())
            {
                cur_parent = cur_parent.Parent.Row.Table.Parent;
            }
        }
        if(cur_parent.Parent instanceof WordShape)
        {
            if(isRealObject(cur_parent.Parent.transformText))
            {
                text_transform = cur_parent.Parent.transformText;
            }
        }
        var MMData = new CMouseMoveData();
        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( X, Y, this.Get_StartPage_Absolute() + ( PageIndex - this.PageNum ), text_transform );
        MMData.X_abs = Coords.X;
        MMData.Y_abs = Coords.Y;

        var Hyperlink = this.Check_Hyperlink( X, Y, PageIndex );

        var PNum = PageIndex - this.PageNum;
        if ( null != Hyperlink && ( PNum >= 0 && PNum < this.Pages.length && Y <= this.Pages[PNum].Bounds.Bottom && Y >= this.Pages[PNum].Bounds.Top ) )
        {
            MMData.Type      = c_oAscMouseMoveDataTypes.Hyperlink;
            MMData.Hyperlink = new CHyperlinkProperty( Hyperlink );
        }
        else
            MMData.Type      = c_oAscMouseMoveDataTypes.Common;

        if ( null != Hyperlink && true === global_keyboardEvent.CtrlKey )
            this.DrawingDocument.SetCursorType( "pointer", MMData );
        else
            this.DrawingDocument.SetCursorType( "default", MMData );

        var PNum = Math.max( 0, Math.min( PageIndex - this.PageNum, this.Pages.length - 1 ) );
        var Bounds = this.Pages[PNum].Bounds;
        if ( true === this.Lock.Is_Locked() && X < Bounds.Right && X > Bounds.Left && Y > Bounds.Top && Y < Bounds.Bottom )
        {
            var _X = this.Pages[PNum].X;
            var _Y = this.Pages[PNum].Y;

            var MMData = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( _X, _Y, this.Get_StartPage_Absolute() + ( PageIndex - this.PageNum ), text_transform );
            MMData.X_abs            = Coords.X - 5;
            MMData.Y_abs            = Coords.Y;
            MMData.Type             = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId           = this.Lock.Get_UserId();
            MMData.HaveChanges      = this.Lock.Have_Changes();
            MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

            editor.sync_MouseMoveCallback( MMData );
        }
    },

    Document_CreateFontMap : function(FontMap)
    {
        if ( true === this.FontMap.NeedRecalc )
        {
            this.FontMap.Map = new Object();

            if ( true === this.CompiledPr.NeedRecalc )
            {
                this.CompiledPr.Pr = this.Internal_CompileParaPr();
                this.CompiledPr.NeedRecalc = false;
            }

            var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
            CurTextPr.Document_CreateFontMap( this.FontMap.Map );

            CurTextPr.Merge( this.TextPr.Value );
            CurTextPr.Document_CreateFontMap( this.FontMap.Map );

            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                if ( para_TextPr === Item.Type )
                {
                    // Выствляем начальные настройки текста у данного параграфа
                    CurTextPr = this.CompiledPr.Pr.TextPr.Copy();

                    var _CurTextPr = Item.Value;

                    // Копируем настройки из символьного стиля
                    if ( undefined != _CurTextPr.RStyle )
                    {
                        var Styles = this.Parent.Get_Styles();
                        var StyleTextPr = Styles.Get_Pr( _CurTextPr.RStyle, styletype_Character).TextPr;
                        CurTextPr.Merge( StyleTextPr );
                    }

                    // Копируем прямые настройки
                    CurTextPr.Merge( _CurTextPr );
                    CurTextPr.Document_CreateFontMap( this.FontMap.Map );
                }
            }
            this.FontMap.NeedRecalc = false;
        }

        for ( Key in this.FontMap.Map )
        {
            FontMap[Key] = this.FontMap.Map[Key];
        }
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        if ( true === this.CompiledPr.NeedRecalc )
        {
            this.CompiledPr.Pr = this.Internal_CompileParaPr();
            this.CompiledPr.NeedRecalc = false;
        }

        var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
        FontCharMap.StartFont( CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize );

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            if ( para_TextPr === Item.Type )
            {
                // Выставляем начальные настройки текста у данного параграфа
                CurTextPr = this.CompiledPr.Pr.TextPr.Copy();

                var _CurTextPr = Item.Value;

                // Копируем настройки из символьного стиля
                if ( undefined != _CurTextPr.RStyle )
                {
                    var Styles = this.Parent.Get_Styles();
                    var StyleTextPr = Styles.Get_Pr( _CurTextPr.RStyle, styletype_Character).TextPr;
                    CurTextPr.Merge( StyleTextPr );
                }

                // Копируем прямые настройки
                CurTextPr.Merge( _CurTextPr );
                FontCharMap.StartFont( CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize );
            }
            else if ( para_Text === Item.Type )
            {
                FontCharMap.AddChar( Item.Value );
            }
            else if ( para_Space === Item.Type )
            {
                FontCharMap.AddChar( ' ' );
            }
            else if ( para_Numbering === Item.Type )
            {
                var ParaPr = this.CompiledPr.Pr.ParaPr;
                var NumPr = ParaPr.NumPr;
                if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
                    continue;

                var Numbering = this.Parent.Get_Numbering();
                var NumInfo   = this.Parent.Internal_GetNumInfo( this.Id, NumPr );
                var NumTextPr = this.CompiledPr.Pr.TextPr.Copy();
                NumTextPr.Merge( this.TextPr.Value );
                NumTextPr.Merge( NumLvl.TextPr );

                Numbering.Document_CreateFontCharMap( FontCharMap, NumTextPr, NumPr, NumInfo );
                FontCharMap.StartFont( CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize );
            }
            else if ( para_PageNum === Item.Type )
            {
                Item.Document_CreateFontCharMap( FontCharMap );
            }
        }

        CurTextPr.Merge( this.TextPr.Value );
    },

    Document_Get_AllFontNames : function(AllFonts)
    {
        // Смотрим на знак конца параграфа
        this.TextPr.Value.Document_Get_AllFontNames( AllFonts );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_TextPr === Item.Type )
            {
                Item.Value.Document_Get_AllFontNames( AllFonts );
            }
            else if ( para_Drawing === Item.Type )
            {
                Item.documentGetAllFontNames( AllFonts );
            }
        }
    },

    // Обновляем линейку
    Document_UpdateRulersState : function()
    {
        var FramePr = this.Get_FramePr();
        if ( undefined === FramePr )
            this.Parent.DrawingDocument.Set_RulerState_Paragraph( null );
        else
        {
            var Frame = this.CalculatedFrame;
            this.Parent.DrawingDocument.Set_RulerState_Paragraph( { L : Frame.L, T : Frame.T, R : Frame.L + Frame.W, B : Frame.T + Frame.H, PageIndex : Frame.PageIndex, Frame : this } );
        }
    },

    // Пока мы здесь проверяем только, находимся ли мы внутри гиперссылки
    Document_UpdateInterfaceState : function()
    {
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            var Hyper_start = this.Check_Hyperlink2( this.Selection.StartPos );
            var Hyper_end   = this.Check_Hyperlink2( this.Selection.EndPos );

            if ( Hyper_start === Hyper_end && null != Hyper_start )
            {
                // Вычислим строку
                var Find = this.Internal_FindBackward( this.Selection.StartPos, [para_HyperlinkStart] );
                if ( true != Find.Found )
                    return;

                var Str = "";

                for ( var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++ )
                {
                    var Item = this.Content[Pos];
                    var bBreak = false;

                    switch ( Item.Type )
                    {
                        case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        {
                            Str = null;
                            bBreak = true;
                            break;
                        }

                        case para_Text : Str += Item.Value; break;
                        case para_Space:
                        case para_Tab  : Str += " "; break;
                        case para_HyperlinkEnd:
                        {
                            bBreak = true;
                            break;
                        }

                        case para_HyperlinkStart:
                            return;
                    }

                    if ( true === bBreak )
                        break;
                }

                var HyperProps = new CHyperlinkProperty( Hyper_start );
                HyperProps.put_Text( Str );

                editor.sync_HyperlinkPropCallback( HyperProps );
            }

            this.SpellChecker.Document_UpdateInterfaceState( StartPos, EndPos );
        }
        else
        {
            var Hyper_cur = this.Check_Hyperlink2( this.CurPos.ContentPos, false, true );
            if ( null != Hyper_cur )
            {
                // Вычислим строку
                var Find = this.Internal_FindBackward( this.CurPos.ContentPos, [para_HyperlinkStart] );
                if ( true != Find.Found )
                    return;

                var Str = "";

                for ( var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++ )
                {
                    var Item = this.Content[Pos];
                    var bBreak = false;

                    switch ( Item.Type )
                    {
                        case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        {
                            Str = null;
                            bBreak = true;
                            break;
                        }

                        case para_Text : Str += Item.Value; break;
                        case para_Space:
                        case para_Tab  : Str += " "; break;
                        case para_HyperlinkEnd:
                        {
                            bBreak = true;
                            break;
                        }

                        case para_HyperlinkStart:
                            return;
                    }

                    if ( true === bBreak )
                        break;
                }

                var HyperProps = new CHyperlinkProperty( Hyper_cur );
                HyperProps.put_Text( Str );

                editor.sync_HyperlinkPropCallback( HyperProps );
            }

            this.SpellChecker.Document_UpdateInterfaceState( this.CurPos.ContentPos, this.CurPos.ContentPos );
        }
    },

    // Функция, которую нужно вызвать перед удалением данного элемента
    PreDelete : function()
    {
        // Поскольку данный элемент удаляется, поэтому надо удалить все записи о
        // inline объектах в родительском классе, используемых в данном параграфе.
        // Кроме этого, если тут начинались или заканчивались комметарии, то их тоже
        // удаляем.

        this.Internal_Remove_CollaborativeMarks(false);

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_CommentEnd === Item.Type || para_CommentStart === Item.Type )
            {
                editor.WordControl.m_oLogicDocument.Remove_Comment( Item.Id, true );
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },

    Get_StartPage_Relative : function()
    {
        return this.PageNum;
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Document_SetThisElementCurrent : function(bUpdateStates)
    {
        this.Parent.Set_CurrentElement( this.Index, bUpdateStates );
    },

    Is_ThisElementCurrent : function()
    {
        var Parent = this.Parent;

        if ( docpostype_Content === Parent.CurPos.Type && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos )
            return this.Parent.Is_ThisElementCurrent();

        return false;
    },

    Is_Inline : function()
    {
        if ( undefined != this.Pr.FramePr )
            return false;

        return true;
    },

    Get_FramePr : function()
    {
        return this.Pr.FramePr;
    },

    Set_FramePr : function(FramePr, bDelete)
    {
        var FramePr_old = this.Pr.FramePr;
        if ( undefined === bDelete )
            bDelete = false;

        if ( true === bDelete )
        {
            this.Pr.FramePr = undefined;
            History.Add( this, { Type : historyitem_Paragraph_FramePr, Old : FramePr_old, New : undefined } );
            this.CompiledPr.NeedRecalc = true;
            return;
        }

        var FrameParas = this.Internal_Get_FrameParagraphs();

        // Тут FramePr- объект класса из api.js CParagraphFrame
        if ( true === FramePr.FromDropCapMenu && 1 === FrameParas.length )
        {
            // Здесь мы смотрим только на количество строк, шрифт, тип и горизонтальный отступ от текста
            var NewFramePr = FramePr_old.Copy();

            if ( undefined != FramePr.DropCap )
            {
                var OldLines = NewFramePr.Lines;
                NewFramePr.Init_Default_DropCap( FramePr.DropCap === c_oAscDropCap.Drop ? true : false );
                NewFramePr.Lines = OldLines;
            }

            if ( undefined != FramePr.Lines )
            {
                var AnchorPara = this.Get_FrameAnchorPara();

                if ( null === AnchorPara || AnchorPara.Lines.length <= 0 )
                    return;

                var LineH  = AnchorPara.Lines[0].Bottom - AnchorPara.Lines[0].Top;
                var LineTA = AnchorPara.Lines[0].Metrics.TextAscent2;
                var LineTD = AnchorPara.Lines[0].Metrics.TextDescent + AnchorPara.Lines[0].Metrics.LineGap;

                this.Set_Spacing( { LineRule : linerule_Exact, Line : FramePr.Lines * LineH }, false );
                this.Update_DropCapByLines( this.Internal_CalculateTextPr( this.Internal_GetStartPos() ), FramePr.Lines, LineH, LineTA, LineTD );
            }

            if ( undefined != FramePr.FontFamily )
            {
                var FF = new ParaTextPr( { RFonts : { Ascii : { Name : FramePr.FontFamily.Name, Index : -1 } }  } );
                this.Select_All();
                this.Add( FF );
                this.Selection_Remove();
            }

            if ( undefined != FramePr.HSpace )
                NewFramePr.HSpace = FramePr.HSpace;

            this.Pr.FramePr = NewFramePr;
        }
        else
        {
            var NewFramePr = FramePr_old.Copy();

            if ( undefined != FramePr.H )
                NewFramePr.H = FramePr.H;

            if ( undefined != FramePr.HAnchor )
                NewFramePr.HAnchor = FramePr.HAnchor;

            if ( undefined != FramePr.HRule )
                NewFramePr.HRule = FramePr.HRule;

            if ( undefined != FramePr.HSpace )
                NewFramePr.HSpace = FramePr.HSpace;

            if ( undefined != FramePr.Lines )
                NewFramePr.Lines = FramePr.Lines;

            if ( undefined != FramePr.VAnchor )
                NewFramePr.VAnchor = FramePr.VAnchor;

            if ( undefined != FramePr.VSpace )
                NewFramePr.VSpace = FramePr.VSpace;

            // Потому что undefined - нормальное значение (и W всегда заполняется в интерфейсе)
            NewFramePr.W = FramePr.W;

            if ( undefined != FramePr.Wrap )
                NewFramePr.Wrap = FramePr.Wrap;

            if ( undefined != FramePr.X )
                NewFramePr.X = FramePr.X;

            if ( undefined != FramePr.XAlign )
                NewFramePr.XAlign = FramePr.XAlign;

            if ( undefined != FramePr.Y )
                NewFramePr.Y = FramePr.Y;

            if ( undefined != FramePr.YAlign )
                NewFramePr.YAlign = FramePr.YAlign;

            this.Pr.FramePr = NewFramePr;
        }

        if ( undefined != FramePr.Brd )
        {
            var Count = FrameParas.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                FrameParas[Index].Set_Borders( FramePr.Brd );
            }
        }

        if ( undefined != FramePr.Shd )
        {
            var Count = FrameParas.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                FrameParas[Index].Set_Shd( FramePr.Shd );
            }
        }

        History.Add( this, { Type : historyitem_Paragraph_FramePr, Old : FramePr_old, New : this.Pr.FramePr } );
        this.CompiledPr.NeedRecalc = true;
    },

    Set_FramePr2 : function(FramePr)
    {
        History.Add( this, { Type : historyitem_Paragraph_FramePr, Old : this.Pr.FramePr, New : FramePr } );
        this.Pr.FramePr = FramePr;
        this.CompiledPr.NeedRecalc = true;
    },

    Set_FrameParaPr : function(Para)
    {
        Para.CopyPr( this );
        this.Set_Spacing( { After : 0 }, false );
        this.Numbering_Remove();
    },

    Get_FrameBounds : function(FrameX, FrameY, FrameW, FrameH)
    {
        var X0 = FrameX, Y0 = FrameY, X1 = FrameX + FrameW, Y1 = FrameY + FrameH;

        var Paras = this.Internal_Get_FrameParagraphs();
        var Count = Paras.length;
        var FramePr = this.Get_FramePr();

        if ( 0 >= Count )
            return { X : X0, Y : Y0, W : X1 - X0, H : Y1 - Y0 };

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Para   = Paras[Index];
            var ParaPr = Para.Get_CompiledPr2(false).ParaPr;
            var Brd    = ParaPr.Brd;

            var _X0 = X0 + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

            if ( undefined != Brd.Left && border_None != Brd.Left.Value )
                _X0 -= Brd.Left.Size + Brd.Left.Space + 1;

            if ( _X0 < X0 )
                X0 = _X0

            var _X1 = X1 - ParaPr.Ind.Right;

            if ( undefined != Brd.Right && border_None != Brd.Right.Value )
                _X1 += Brd.Right.Size + Brd.Right.Space + 1;

            if ( _X1 > X1 )
                X1 = _X1;
        }

        var _Y1 = Y1;
        var BottomBorder = Paras[Count - 1].Get_CompiledPr2(false).ParaPr.Brd.Bottom;
        if ( undefined != BottomBorder && border_None != BottomBorder.Value )
            _Y1 += BottomBorder.Size + BottomBorder.Space;

        if ( _Y1 > Y1 && ( heightrule_Auto === FramePr.HRule || ( heightrule_AtLeast === FramePr.HRule && FrameH >= FramePr.H ) ) )
            Y1 = _Y1;

        return { X : X0, Y : Y0, W : X1 - X0, H : Y1 - Y0 };
    },

    Set_CalculatedFrame : function(L, T, W, H, L2, T2, W2, H2, PageIndex)
    {
        this.CalculatedFrame.T = T;
        this.CalculatedFrame.L = L;
        this.CalculatedFrame.W = W;
        this.CalculatedFrame.H = H;
        this.CalculatedFrame.T2 = T2;
        this.CalculatedFrame.L2 = L2;
        this.CalculatedFrame.W2 = W2;
        this.CalculatedFrame.H2 = H2;
        this.CalculatedFrame.PageIndex = PageIndex;
    },

    Internal_Get_FrameParagraphs : function()
    {
        var FrameParas = new Array();

        var FramePr = this.Get_FramePr();
        if ( undefined === FramePr )
            return FrameParas;

        FrameParas.push( this );

        var Prev = this.Get_DocumentPrev();
        while ( null != Prev )
        {
            if ( type_Paragraph === Prev.GetType() )
            {
                var PrevFramePr = Prev.Get_FramePr();
                if ( undefined != PrevFramePr && true === FramePr.Compare( PrevFramePr ) )
                {
                    FrameParas.push(  Prev );
                    Prev = Prev.Get_DocumentPrev();
                }
                else
                    break;
            }
            else
                break;
        }

        var Next = this.Get_DocumentNext();
        while ( null != Next )
        {
            if ( type_Paragraph === Next.GetType() )
            {
                var NextFramePr = Next.Get_FramePr();
                if ( undefined != NextFramePr && true === FramePr.Compare( NextFramePr ) )
                {
                    FrameParas.push(  Next );
                    Next = Next.Get_DocumentNext();
                }
                else
                    break;
            }
            else
                break;
        }

        return FrameParas;
    },

    Is_LineDropCap : function()
    {
        var FrameParas = this.Internal_Get_FrameParagraphs();
        if ( 1 !== FrameParas.length || 1 !== this.Lines.length )
            return false;

        return true;
    },

    Get_LineDropCapWidth : function()
    {
        var W = this.Lines[0].Ranges[0].W;
        var ParaPr = this.Get_CompiledPr2(false).ParaPr;
        W += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

        return W;
    },

    Change_Frame : function(X, Y, W, H, PageIndex)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;

        var FramePr = this.Get_FramePr();
        if ( undefined === FramePr || ( Math.abs( Y - this.CalculatedFrame.T ) < 0.001 && Math.abs( X - this.CalculatedFrame.L ) < 0.001 && Math.abs( W - this.CalculatedFrame.W ) < 0.001 && Math.abs( H - this.CalculatedFrame.H ) < 0.001 && PageIndex === this.CalculatedFrame.PageIndex ) )
            return;

        var FrameParas = this.Internal_Get_FrameParagraphs();
        if ( false === LogicDocument.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : FrameParas, CheckType : changestype_Paragraph_Content } ) )
        {
            History.Create_NewPoint();
            var NewFramePr = FramePr.Copy();

            if ( Math.abs( X - this.CalculatedFrame.L ) > 0.001 )
            {
                NewFramePr.X       = X;
                NewFramePr.XAlign  = undefined;
                NewFramePr.HAnchor = c_oAscHAnchor.Page;
            }

            if ( Math.abs( Y - this.CalculatedFrame.T ) > 0.001 )
            {
                NewFramePr.Y       = Y;
                NewFramePr.YAlign  = undefined;
                NewFramePr.VAnchor = c_oAscVAnchor.Page;
            }

            if ( Math.abs( W - this.CalculatedFrame.W ) > 0.001 )
                NewFramePr.W = W;

            if ( Math.abs( H - this.CalculatedFrame.H ) > 0.001 )
            {
                if ( undefined != FramePr.DropCap && dropcap_None != FramePr.DropCap && 1 === FrameParas.length )
                {
                    var _H = Math.min( H, Page_Height );
                    NewFramePr.Lines = this.Update_DropCapByHeight( _H );
                    NewFramePr.HRule = linerule_Auto;
                }
                else
                {
                    if ( H <= this.CalculatedFrame.H )
                        NewFramePr.HRule = linerule_Exact;
                    else
                        NewFramePr.HRule = linerule_AtLeast;

                    NewFramePr.H = H;
                }
            }

            var Count = FrameParas.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Para = FrameParas[Index];
                Para.Set_FramePr( NewFramePr, false );
            }

            LogicDocument.Recalculate();
            LogicDocument.Document_UpdateInterfaceState();
        }
    },

    Supplement_FramePr : function(FramePr)
    {
        if ( undefined != FramePr.DropCap && dropcap_None != FramePr.DropCap )
        {
            var _FramePr = this.Get_FramePr();
            var FirstFramePara = this;
            var Prev = FirstFramePara.Get_DocumentPrev();
            while ( null != Prev )
            {
                if ( type_Paragraph === Prev.GetType() )
                {
                    var PrevFramePr = Prev.Get_FramePr();
                    if ( undefined != PrevFramePr && true === _FramePr.Compare( PrevFramePr ) )
                    {
                        FirstFramePara = Prev;
                        Prev = Prev.Get_DocumentPrev();
                    }
                    else
                        break;
                }
                else
                    break;
            }

            var TextPr = FirstFramePara.Internal_CalculateTextPr(0);
            FramePr.FontFamily =
            {
                Name  : TextPr.RFonts.Ascii.Name,
                Index : TextPr.RFonts.Ascii.Index
            };
        }

        var FrameParas = this.Internal_Get_FrameParagraphs();
        var Count = FrameParas.length;

        var ParaPr = FrameParas[0].Get_CompiledPr2(false).ParaPr.Copy();
        for ( var Index = 1; Index < Count; Index++ )
        {
            var TempPr= FrameParas[Index].Get_CompiledPr2(false).ParaPr;
            ParaPr = ParaPr.Compare(TempPr);
        }

        FramePr.Brd = ParaPr.Brd;
        FramePr.Shd = ParaPr.Shd;
    },

    Can_AddDropCap : function()
    {
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            if ( para_Text === this.Content[Pos].Type )
                return true;
        }

        return false;
    },

    Split_DropCap : function(NewParagraph)
    {
        // Если есть выделение, тогда мы проверяем элементы, идущие до конца выделения, если есть что-то кроме текста
        // тогда мы добавляем в буквицу только первый текстовый элемент, иначе добавляем все от начала параграфа и до
        // конца выделения, кроме этого в буквицу добавляем все табы идущие в начале.

        var Count      = this.Content.length;
        var EndPos     = this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos;
        var bSelection = false;
        var LastTextPr = null;

        if ( true === this.Selection.Use )
        {
            var EndPos = Math.min( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos, this.Content.length );

            bSelection = true;
            for (var Pos = 0; Pos < EndPos; Pos++ )
            {
                var Type = this.Content[Pos].Type;
                if ( para_Text != Type && para_TextPr != Type && para_Tab != Type )
                {
                    bSelection = false;
                    break;
                }
                else if ( para_TextPr === Type )
                    LastTextPr = this.Content[Pos];
            }

        }

        if ( false === bSelection )
        {
            var Pos = 0;
            for (; Pos < Count; Pos++ )
            {
                var Type = this.Content[Pos].Type;
                if ( para_Text === Type )
                    break;
                else if ( para_TextPr === Type )
                    LastTextPr = this.Content[Pos];
            }

            EndPos = Pos + 1;
        }

        for ( var Pos = 0; Pos < EndPos; Pos++ )
        {
            NewParagraph.Internal_Content_Add(Pos, this.Content[Pos]);
        }

        var TextPr = this.Internal_CalculateTextPr(EndPos);
        this.Internal_Content_Remove2( 0, EndPos );

        if ( null != LastTextPr )
            this.Internal_Content_Add( 0, new ParaTextPr(LastTextPr.Value) );

        return TextPr;
    },

    Update_DropCapByLines : function(TextPr, Count, LineH, LineTA, LineTD)
    {
        // Мы должны сделать так, чтобы высота данного параграфа была точно Count * LineH
        this.Set_Spacing( { Before : 0, After : 0, LineRule : linerule_Exact, Line : Count * LineH - 0.001 }, false );

        var FontSize = 72;
        TextPr.FontSize = FontSize;

        g_oTextMeasurer.SetTextPr(TextPr);
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);

        var TDescent = null;
        var TAscent  = null;

        var TempCount = this.Content.length;
        for ( var Index = 0; Index < TempCount; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Text === Item.Type )
            {
                var Temp = g_oTextMeasurer.Measure2( Item.Value );

                if ( null === TAscent || TAscent < Temp.Ascent )
                    TAscent = Temp.Ascent;

                if ( null === TDescent || TDescent > Temp.Ascent - Temp.Height )
                    TDescent = Temp.Ascent - Temp.Height;
            }
        }

        var THeight = 0;
        if ( null === TAscent || null === TDescent )
            THeight = g_oTextMeasurer.GetHeight();
        else
            THeight = -TDescent + TAscent;

        var EmHeight = THeight;

        var NewEmHeight = (Count - 1) * LineH + LineTA;
        var Koef = NewEmHeight / EmHeight;

        var NewFontSize = TextPr.FontSize * Koef;
        TextPr.FontSize = parseInt(NewFontSize * 2) / 2;

        g_oTextMeasurer.SetTextPr(TextPr);
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);

        var TNewDescent = null;
        var TNewAscent  = null;

        var TempCount = this.Content.length;
        for ( var Index = 0; Index < TempCount; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Text === Item.Type )
            {
                var Temp = g_oTextMeasurer.Measure2( Item.Value );

                if ( null === TNewAscent || TNewAscent < Temp.Ascent )
                    TNewAscent = Temp.Ascent;

                if ( null === TNewDescent || TNewDescent > Temp.Ascent - Temp.Height )
                    TNewDescent = Temp.Ascent - Temp.Height;
            }
        }

        var TNewHeight = 0;
        if ( null === TNewAscent || null === TNewDescent )
            TNewHeight = g_oTextMeasurer.GetHeight();
        else
            TNewHeight = -TNewDescent + TNewAscent;

        var Descent = g_oTextMeasurer.GetDescender();
        var Ascent  = g_oTextMeasurer.GetAscender();

        var Dy = Descent * (LineH * Count) / ( Ascent - Descent ) + TNewHeight - TNewAscent + LineTD;

        var PTextPr = new ParaTextPr( { RFonts : { Ascii : { Name : TextPr.RFonts.Ascii.Name, Index : -1 } }, FontSize : TextPr.FontSize, Position : Dy } );

        this.Select_All();
        this.Add( PTextPr );
        this.Selection_Remove();
    },

    Update_DropCapByHeight : function(Height)
    {
        // Ищем следующий параграф, к которому относится буквица
        var AnchorPara = this.Get_FrameAnchorPara();
        if ( null === AnchorPara || AnchorPara.Lines.length <= 0 )
            return 1;

        this.Set_Spacing( { LineRule : linerule_Exact, Line : Height }, false );

        var LineH  = AnchorPara.Lines[0].Bottom - AnchorPara.Lines[0].Top;
        var LineTA = AnchorPara.Lines[0].Metrics.TextAscent2;
        var LineTD = AnchorPara.Lines[0].Metrics.TextDescent + AnchorPara.Lines[0].Metrics.LineGap;

        // Посчитаем количество строк
        var LinesCount = Math.ceil( Height / LineH );

        var TextPr = this.Internal_CalculateTextPr(this.Internal_GetStartPos());
        g_oTextMeasurer.SetTextPr(TextPr);
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);


        var TDescent = null;
        var TAscent  = null;

        var TempCount = this.Content.length;
        for ( var Index = 0; Index < TempCount; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Text === Item.Type )
            {
                var Temp = g_oTextMeasurer.Measure2( Item.Value );

                if ( null === TAscent || TAscent < Temp.Ascent )
                    TAscent = Temp.Ascent;

                if ( null === TDescent || TDescent > Temp.Ascent - Temp.Height )
                    TDescent = Temp.Ascent - Temp.Height;
            }
        }

        var THeight = 0;
        if ( null === TAscent || null === TDescent )
            THeight = g_oTextMeasurer.GetHeight();
        else
            THeight = -TDescent + TAscent;

        var Koef = (Height - LineTD) / THeight;

        var NewFontSize = TextPr.FontSize * Koef;
        TextPr.FontSize = parseInt(NewFontSize * 2) / 2;

        g_oTextMeasurer.SetTextPr(TextPr);
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);

        var TNewDescent = null;
        var TNewAscent  = null;

        var TempCount = this.Content.length;
        for ( var Index = 0; Index < TempCount; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Text === Item.Type )
            {
                var Temp = g_oTextMeasurer.Measure2( Item.Value );

                if ( null === TNewAscent || TNewAscent < Temp.Ascent )
                    TNewAscent = Temp.Ascent;

                if ( null === TNewDescent || TNewDescent > Temp.Ascent - Temp.Height )
                    TNewDescent = Temp.Ascent - Temp.Height;
            }
        }

        var TNewHeight = 0;
        if ( null === TNewAscent || null === TNewDescent )
            TNewHeight = g_oTextMeasurer.GetHeight();
        else
            TNewHeight = -TNewDescent + TNewAscent;

        var Descent = g_oTextMeasurer.GetDescender();
        var Ascent  = g_oTextMeasurer.GetAscender();

        var Dy = Descent * (Height) / ( Ascent - Descent ) + TNewHeight - TNewAscent + LineTD;

        var PTextPr = new ParaTextPr( { RFonts : { Ascii : { Name : TextPr.RFonts.Ascii.Name, Index : -1 } }, FontSize : TextPr.FontSize, Position : Dy } );
        this.Select_All();
        this.Add( PTextPr );
        this.Selection_Remove();

        return LinesCount;
    },

    Get_FrameAnchorPara : function()
    {
        var FramePr = this.Get_FramePr();
        if ( undefined === FramePr )
            return null;

        var Next = this.Get_DocumentNext();
        while ( null != Next )
        {
            if ( type_Paragraph === Next.GetType() )
            {
                var NextFramePr = Next.Get_FramePr();
                if ( undefined === NextFramePr || false === FramePr.Compare( NextFramePr ) )
                    return Next;
            }

            Next = Next.Get_DocumentNext();
        }

        return Next;
    },

    // Разделяем данный параграф
    Split : function(NewParagraph, Pos)
    {
        if ( true !== Debug_ParaRunMode )
        {
            if ( "undefined" === typeof(Pos) || null === Pos )
                Pos = this.CurPos.ContentPos;

            // Копируем контент, начиная с текущей позиции в параграфе до конца параграфа,
            // в новый параграф (первым элементом выставляем настройки текста, рассчитанные
            // для текущей позиции). Проверим, находится ли данная позиция внутри гиперссылки,
            // если да, тогда в текущем параграфе закрываем гиперссылку, а в новом создаем ее копию.

            var Hyperlink = this.Check_Hyperlink2( Pos, false );

            var TextPr = this.Internal_CalculateTextPr( Pos );

            NewParagraph.DeleteCommentOnRemove = false;
            NewParagraph.Internal_Content_Remove2(0, NewParagraph.Content.length);
            NewParagraph.Internal_Content_Concat( this.Content.slice( Pos ) );
            NewParagraph.Internal_Content_Add( 0, new ParaTextPr( TextPr ) );
            NewParagraph.Set_ContentPos( 0 );
            NewParagraph.DeleteCommentOnRemove = true;

            NewParagraph.TextPr.Value = this.TextPr.Value.Copy();

            if ( null != Hyperlink )
                NewParagraph.Internal_Content_Add( 1, Hyperlink.Copy() );

            // Удаляем все элементы после текущей позиции и добавляем признак окончания параграфа.
            this.DeleteCommentOnRemove = false;
            this.Internal_Content_Remove2( Pos, this.Content.length - Pos );
            this.Internal_Remove_CollaborativeMarks(false);
            this.DeleteCommentOnRemove = true;

            if ( null != Hyperlink )
            {
                // Добавляем конец гиперссылки и пустые текстовые настройки
                this.Internal_Content_Add( this.Content.length, new ParaHyperlinkEnd() );
                this.Internal_Content_Add( this.Content.length, new ParaTextPr() );
            }

            this.Internal_Content_Add( this.Content.length, new ParaEnd() );
            this.Internal_Content_Add( this.Content.length, new ParaEmpty() );

            // Копируем все настройки в новый параграф. Делаем это после того как определили контент параграфов.
            this.CopyPr( NewParagraph );

            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            NewParagraph.RecalcInfo.Set_Type_0(pararecalc_0_All);
        }
        else
        {
            // TODO: Обработать здесь гиперссылки и комментарии


            // Обнулим селект и курсор
            this.Selection_Remove();
            NewParagraph.Selection_Remove();

            // Переносим контент, идущий с текущей позиции в параграфе и до конца параграфа,
            // в новый параграф.

            var ContentPos = this.Get_ParaContentPos(false, false);
            var CurPos = ContentPos.Get(0);

            var TextPr = this.Get_TextPr(ContentPos);

            // Разделяем текущий элемент (возвращается правая, отделившаяся часть, если она null, тогда заменяем
            // ее на пустой ран с заданными настройками).
            var NewElement = this.Content[CurPos].Split( ContentPos, 1 );

            if ( null === NewElement )
            {
                NewElement = new ParaRun( this.LogicDocument, NewParagraph );
                NewElement.Set_Pr( TextPr.Copy() );
            }

            // Теперь делим наш параграф на три части:
            // 1. До элемента с номером CurPos включительно (оставляем эту часть в исходном параграфе)
            // 2. После элемента с номером CurPos (добавляем эту часть в новый параграф)
            // 3. Новый элемент, полученный после разделения элемента с номером CurPos, который мы
            //    добавляем в начало нового параграфа.

            var NewContent = this.Content.slice( CurPos + 1 );
            this.Internal_Content_Remove2( CurPos + 1, this.Content.length - CurPos - 1 );

            // В старый параграф добавим ран с концом параграфа
            var EndRun = new ParaRun( this.LogicDocument, this );
            EndRun.Content[0] = new ParaEnd();

            this.Internal_Content_Add( this.Content.length, EndRun );

            // Очищаем новый параграф и добавляем в него Right элемент и NewContent
            NewParagraph.Internal_Content_Remove2( 0, NewParagraph.Content.length );
            NewParagraph.Internal_Content_Concat( NewContent );
            NewParagraph.Internal_Content_Add( 0, NewElement );

            // Копируем все настройки в новый параграф. Делаем это после того как определили контент параграфов.
            NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
            this.CopyPr( NewParagraph );

            this.Cursor_MoveToEndPos( false, false );
            NewParagraph.Cursor_MoveToStartPos( false );
        }
    },

    // Присоединяем контент параграфа Para к текущему параграфу
    Concat : function(Para)
    {
        if ( true !== Debug_ParaRunMode )
        {
            this.DeleteCommentOnRemove = false;
            this.Internal_Content_Remove2( this.Content.length - 2, 2 );
            this.DeleteCommentOnRemove = true;

            // Убираем нумерацию, если она была у следующего параграфа
            Para.Numbering_Remove();
            Para.Remove_PresentationNumbering();

            this.Internal_Content_Concat( Para.Content );

            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        }
        else
        {
            // TODO: разобраться с комментариями

            // Убираем метку конца параграфа у данного параграфа
            this.Remove_ParaEnd();

            // Добавляем содержимое второго параграфа к первому
            this.Internal_Content_Concat( Para.Content );
        }
    },

    // Копируем настройки параграфа и последние текстовые настройки в новый параграф
    Continue : function(NewParagraph)
    {
        if ( true !== Debug_ParaRunMode )
        {
            // Копируем настройки параграфа
            this.CopyPr( NewParagraph );

            // Копируем последние настройки текста
            var TextPr = this.Internal_CalculateTextPr( this.Internal_GetEndPos() );

            NewParagraph.Internal_Content_Add( 0, new ParaTextPr( TextPr ) );
            NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
        }
        else
        {
            // Копируем настройки параграфа
            this.CopyPr( NewParagraph );

            // Копируем последние настройки текста
            var TextPr = this.Get_TextPr();
            var NewRun = new ParaRun( this.LogicDocument, NewParagraph );
            NewRun.Set_Pr( TextPr );

            NewParagraph.Internal_Content_Add( 0, NewRun );
            NewParagraph.Cursor_MoveToStartPos( false );

            // Копируем настройки знака конца параграфа
            NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
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
            case  historyitem_Paragraph_AddItem:
            {
                var StartPos = this.Internal_Get_RealPos( Data.Pos );
                var EndPos   = this.Internal_Get_RealPos( Data.EndPos );

                this.Content.splice( StartPos, EndPos - StartPos + 1 );

                break;
            }

            case historyitem_Paragraph_RemoveItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr.NumPr = Old;
                else
                    this.Pr.NumPr = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                this.Pr.Jc = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.FirstLine = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.Left = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaSpacing();

                this.Pr.Ind.Right = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                this.Pr.ContextualSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                this.Pr.KeepLines = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                this.Pr.KeepNext = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                this.Pr.PageBreakBefore = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Line = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.LineRule = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Before = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.After = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.AfterAutoSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.BeforeAutoSpacing = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                if ( undefined != Data.Old && undefined === this.Pr.Shd )
                    this.Pr.Shd = new CDocumentShd();

                if ( undefined != Data.Old )
                    this.Pr.Shd.Value = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                if ( undefined != Data.Old && undefined === this.Pr.Shd )
                    this.Pr.Shd = new CDocumentShd();

                if ( undefined != Data.Old )
                    this.Pr.Shd.Color = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd:
            {
                this.Pr.Shd = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_WidowControl:
            {
                this.Pr.WidowControl = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                this.Pr.Tabs = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr.PStyle = Old;
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                this.Next = Data.Old;
                break;
            }

            case historyitem_Paragraph_DocPrev:
            {
                this.Prev = Data.Old;
                break;
            }

            case historyitem_Paragraph_Parent:
            {
                this.Parent = Data.Old;
                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                this.Pr.Brd.Between = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                this.Pr.Brd.Bottom = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                this.Pr.Brd.Left = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                this.Pr.Brd.Right = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                this.Pr.Brd.Top = Data.Old;

                this.CompiledPr.NeedRecalc = true;

                break;
            }
            
            case historyitem_Paragraph_Pr:
            {
                var Old = Data.Old;
                if ( undefined != Old )
                    this.Pr = Old;
                else
                    this.Pr = new CParaPr();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                this.PresentationPr.Bullet = Data.Old;
                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                this.PresentationPr.Level = Data.Old;
                break;
            }

            case historyitem_Paragraph_FramePr:
            {
                this.Pr.FramePr = Data.Old;
                this.CompiledPr.NeedRecalc = true;
                break;
            }
        }

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_Paragraph_AddItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                break;

            }

            case historyitem_Paragraph_RemoveItem:
            {
                var StartPos = this.Internal_Get_RealPos( Data.Pos );
                var EndPos   = this.Internal_Get_RealPos( Data.EndPos );

                this.Content.splice( StartPos, EndPos - StartPos + 1 );

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr.NumPr = New;
                else
                    this.Pr.NumPr = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                this.Pr.Jc = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.FirstLine = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.Left = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                this.Pr.Ind.Right = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                this.Pr.ContextualSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                this.Pr.KeepLines = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                this.Pr.KeepNext = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                this.Pr.PageBreakBefore = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Line = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.LineRule = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.Before = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.After = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.AfterAutoSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                this.Pr.Spacing.BeforeAutoSpacing = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                if ( undefined != Data.New && undefined === this.Pr.Shd )
                    this.Pr.Shd = new CDocumentShd();

                if ( undefined != Data.New )
                    this.Pr.Shd.Value = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                if ( undefined != Data.New && undefined === this.Pr.Shd )
                    this.Pr.Shd = new CDocumentShd();

                if ( undefined != Data.New )
                    this.Pr.Shd.Color = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd:
            {
                this.Pr.Shd = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }


            case historyitem_Paragraph_WidowControl:
            {
                this.Pr.WidowControl = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                this.Pr.Tabs = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr.PStyle = New;
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                this.Next = Data.New;
                break;
            }

            case historyitem_Paragraph_DocPrev:
            {
                this.Prev = Data.New;
                break;
            }

            case historyitem_Paragraph_Parent:
            {
                this.Parent = Data.New;
                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                this.Pr.Brd.Between = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                this.Pr.Brd.Bottom = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                this.Pr.Brd.Left = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                this.Pr.Brd.Right = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                this.Pr.Brd.Top = Data.New;

                this.CompiledPr.NeedRecalc = true;

                break;
            }
            
            case historyitem_Paragraph_Pr:
            {
                var New = Data.New;
                if ( undefined != New )
                    this.Pr = New;
                else
                    this.Pr = new CParaPr();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                this.PresentationPr.Bullet = Data.New;
                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                this.PresentationPr.Level = Data.New;
                break;
            }

            case historyitem_Paragraph_FramePr:
            {
                this.Pr.FramePr = Data.New;
                this.CompiledPr.NeedRecalc = true;
                break;
            }
        }

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },

    Get_SelectionState : function()
    {
        var ParaState = new Object();
        ParaState.CurPos  =
        {
            X          : this.CurPos.X,
            Y          : this.CurPos.Y,
            Line       : this.CurPos.Line,
            ContentPos : this.Internal_Get_ClearPos(this.CurPos.ContentPos),
            RealX      : this.CurPos.RealX,
            RealY      : this.CurPos.RealY,
            PagesPos   : this.CurPos.PagesPos
        };

        ParaState.Selection =
        {
            Start    : this.Selection.Start,
            Use      : this.Selection.Use,
            StartPos : this.Internal_Get_ClearPos(this.Selection.StartPos),
            EndPos   : this.Internal_Get_ClearPos(this.Selection.EndPos),
            StartPos : this.Internal_Get_ClearPos(this.Selection.StartPos2),
            EndPos   : this.Internal_Get_ClearPos(this.Selection.EndPos2),
            Flag     : this.Selection.Flag
        };

        return [ ParaState ];
    },

    Set_SelectionState : function(State, StateIndex)
    {
        if ( State.length <= 0 )
            return;

        var ParaState = State[StateIndex];

        this.CurPos  =
        {
            X          : ParaState.CurPos.X,
            Y          : ParaState.CurPos.Y,
            Line       : ParaState.CurPos.Line,
            ContentPos : this.Internal_Get_RealPos(ParaState.CurPos.ContentPos),
            RealX      : ParaState.CurPos.RealX,
            RealY      : ParaState.CurPos.RealY,
            PagesPos   : ParaState.CurPos.PagesPos
        };

        this.Selection.Start     = ParaState.Selection.Start;
        this.Selection.Use       = ParaState.Selection.Use;
        this.Selection.StartPos  = this.Internal_Get_RealPos(ParaState.Selection.StartPos);
        this.Selection.EndPos    = this.Internal_Get_RealPos(ParaState.Selection.EndPos);
        this.Selection.StartPos2 = this.Internal_Get_RealPos(ParaState.Selection.StartPos2);
        this.Selection.EndPos2   = this.Internal_Get_RealPos(ParaState.Selection.EndPos2);

        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        this.Set_ContentPos( Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos  ) ) );
        this.Selection.StartPos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.Selection.StartPos ) );
        this.Selection.EndPos   = Math.max( CursorPos_min, Math.min( CursorPos_max, this.Selection.EndPos   ) );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Parent.Get_ParentObject_or_DocumentPos(this.Index);
    },

    Refresh_RecalcData : function(Data)
    {
        var Type = Data.Type;

        var bNeedRecalc = false;

        var CurPage = 0;

        switch ( Type )
        {
            case historyitem_Paragraph_AddItem:
            case historyitem_Paragraph_RemoveItem:
            {
                for ( CurPage = this.Pages.length - 1; CurPage > 0; CurPage-- )
                {
                    if ( Data.Pos > this.Lines[this.Pages[CurPage].StartLine].StartPos )
                        break;
                }

                this.RecalcInfo.Set_Type_0(pararecalc_0_All);
                bNeedRecalc = true;
                break;
            }
            case historyitem_Paragraph_Numbering:
            case historyitem_Paragraph_PStyle:
            case historyitem_Paragraph_Pr:
            case historyitem_Paragraph_PresentationPr_Bullet:
            case historyitem_Paragraph_PresentationPr_Level:
            {
                this.RecalcInfo.Set_Type_0(pararecalc_0_All);
                bNeedRecalc = true;
                break;
            }

            case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_LineRule:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            case historyitem_Paragraph_Tabs:
            case historyitem_Paragraph_Parent:
            case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            case historyitem_Paragraph_FramePr:
            {
                bNeedRecalc = true;
                break;
            }
            case historyitem_Paragraph_Shd_Value:
            case historyitem_Paragraph_Shd_Color:
            case historyitem_Paragraph_Shd:
            case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            {
                // Пересчитывать этот элемент не надо при таких изменениях
                break;
            }
        }

        if ( true === bNeedRecalc )
        {
            var Prev = this.Get_DocumentPrev();
            if ( 0 === CurPage && null != Prev && type_Paragraph === Prev.GetType() && true === Prev.Get_CompiledPr2(false).ParaPr.KeepNext )
               Prev.Refresh_RecalcData2( Prev.Pages.length - 1 );

            // Сообщаем родительскому классу, что изменения произошли в элементе с номером this.Index и на странице this.PageNum
            return this.Refresh_RecalcData2(CurPage);
        }
    },

    Refresh_RecalcData2 : function(CurPage)
    {
        if ( undefined === CurPage )
            CurPage = 0;

        // Если Index < 0, значит данный элемент еще не был добавлен в родительский класс
        if ( this.Index >= 0 )
            this.Parent.Refresh_RecalcData2( this.Index, this.PageNum + CurPage );
    },

    Check_HistoryUninon : function(Data1, Data2)
    {
        var Type1 = Data1.Type;
        var Type2 = Data2.Type;

        if ( historyitem_Paragraph_AddItem === Type1 && historyitem_Paragraph_AddItem === Type2 )
        {
            if ( 1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && para_Text === Data1.Items[0].Type && para_Text === Data2.Items[0].Type )
                return true;
        }
        return false;
    },

    Is_SimpleChanges : function(DataArray)
    {
        // Здесь мы проверяем можно ли пересчитать только данный параграф
        var Count = DataArray.length;
        for ( var Index = 0; Index < Count; Index++ )
        {

        }
    },

//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        switch ( CheckType )
        {
            case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            {
                this.Lock.Check( this.Get_Id() );
                break;
            }
            case changestype_Remove:
            {
                // Если у нас нет выделения, и курсор стоит в начале, мы должны проверить в том же порядке, в каком
                // идут проверки при удалении в команде Internal_Remove_Backward.
                if ( true != this.Selection.Use && true == this.Cursor_IsStart() )
                {
                    var Pr = this.Get_CompiledPr2(false).ParaPr;
                    if ( undefined != this.Numbering_Get() || Math.abs(Pr.Ind.FirstLine) > 0.001 || Math.abs(Pr.Ind.Left) > 0.001 )
                    {
                        // Надо проверить только текущий параграф, а это будет сделано далее
                    }
                    else
                    {
                        var Prev = this.Get_DocumentPrev();
                        if ( null != Prev && type_Paragraph === Prev.GetType() )
                            Prev.Lock.Check( Prev.Get_Id() );
                    }
                }
                // Если есть выделение, и знак параграфа попал в выделение ( и параграф выделен не целиком )
                else if ( true === this.Selection.Use )
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    if ( EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos() )
                    {
                        var Next = this.Get_DocumentNext();
                        if ( null != Next && type_Paragraph === Next.GetType() )
                            Next.Lock.Check( Next.Get_Id() );
                    }
                }

                this.Lock.Check( this.Get_Id() );

                break;
            }
            case changestype_Delete:
            {
                // Если у нас нет выделения, и курсор стоит в конце, мы должны проверить следующий элемент
                if ( true != this.Selection.Use && true === this.Cursor_IsEnd() )
                {
                    var Next = this.Get_DocumentNext();
                    if ( null != Next && type_Paragraph === Next.GetType() )
                        Next.Lock.Check( Next.Get_Id() );
                }
                // Если есть выделение, и знак параграфа попал в выделение и параграф выделен не целиком
                else if ( true === this.Selection.Use )
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;

                    if ( StartPos > EndPos )
                    {
                        var Temp = EndPos;
                        EndPos   = StartPos;
                        StartPos = Temp;
                    }

                    if ( EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos() )
                    {
                        var Next = this.Get_DocumentNext();
                        if ( null != Next && type_Paragraph === Next.GetType() )
                            Next.Lock.Check( Next.Get_Id() );
                    }
                }

                this.Lock.Check( this.Get_Id() );

                break;
            }
            case changestype_Document_SectPr:
            case changestype_Table_Properties:
            case changestype_Table_RemoveCells:
            case changestype_HdrFtr:
            {
                CollaborativeEditing.Add_CheckLock(true);
                break;
            }
        }
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Paragraph );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case  historyitem_Paragraph_AddItem:
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

            case historyitem_Paragraph_RemoveItem:
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

            case historyitem_Paragraph_Numbering:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : NumPr (CNumPr)

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteDouble( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Spacing_LineRule:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === Data.New )
                {
                    Writer.WriteBool( true );
                }
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                // Bool : IsUndefined

                // Если false
                // Byte : Value

                var New = Data.New;
                if ( undefined != New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteByte( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                // Bool : IsUndefined

                // Если false
                // Variable : Color (CDocumentColor)

                var New = Data.New;
                if ( undefined != New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary(Writer);
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Shd:
            {
                // Bool : IsUndefined

                // Если false
                // Variable : Shd (CDocumentShd)

                var New = Data.New;
                if ( undefined != New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary(Writer);
                }
                else
                    Writer.WriteBool( true );

                break;
            }


            case historyitem_Paragraph_Tabs:
            {
                // Bool : IsUndefined
                // Есди false
                // Variable : CParaTabs

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                // Bool : Удаляем ли

                // Если false
                // String : StyleId

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            case historyitem_Paragraph_Parent:
            {
                // String : Id элемента

                if ( null != Data.New )
                    Writer.WriteString2( Data.New.Get_Id() );
                else
                    Writer.WriteString2( "" );

                break;
            }

            case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_Paragraph_Pr:
            {
                // Bool : удаляем ли

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                // Variable : Bullet
                Data.New.Write_ToBinary( Writer );

                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                // Long : Level
                Writer.WriteLong( Data.New );
                break;
            }

            case historyitem_Paragraph_FramePr:
            {
                // Bool : IsUndefined
                // false ->
                //   Variable : CFramePr

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

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
        if ( historyitem_type_Paragraph != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case  historyitem_Paragraph_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Элемент
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = this.Internal_Get_RealPos( this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() ) );
                    var Element = ParagraphContent_Read_FromBinary(Reader);

                    if ( null != Element )
                    {
                        if ( Element instanceof ParaCommentStart )
                        {
                            var Comment = g_oTableId.Get_ById( Element.Id );
                            if ( null != Comment )
                                Comment.Set_StartInfo( 0, 0, 0, 0, this.Get_Id() );
                        }
                        else if ( Element instanceof ParaCommentEnd )
                        {
                            var Comment = g_oTableId.Get_ById( Element.Id );
                            if ( null != Comment )
                                Comment.Set_EndInfo( 0, 0, 0, 0, this.Get_Id() );
                        }

                        // TODO: Подумать над тем как по минимуму вставлять отметки совместного редактирования
                        this.Content.splice( Pos, 0, new ParaCollaborativeChangesEnd() );
                        this.Content.splice( Pos, 0, Element );
                        this.Content.splice( Pos, 0, new ParaCollaborativeChangesStart() );

                        CollaborativeEditing.Add_ChangedClass(this);
                    }
                }

                this.DeleteCollaborativeMarks = false;

                break;
            }

            case historyitem_Paragraph_RemoveItem:
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

                    var Pos = this.Internal_Get_RealPos( ChangesPos );
                    this.Content.splice( Pos, 1 );
                }

                break;
            }

            case historyitem_Paragraph_Numbering:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : NumPr (CNumPr)

                if ( true === Reader.GetBool() )
                    this.Pr.NumPr = undefined;
                else
                {
                    this.Pr.NumPr = new CNumPr();
                    this.Pr.NumPr.Read_FromBinary(Reader);
                }

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Align:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( true === Reader.GetBool() )
                    this.Pr.Jc = undefined;
                else
                    this.Pr.Jc = Reader.GetLong();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_First:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.FirstLine = undefined;
                else
                    this.Pr.Ind.FirstLine = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Left:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.Left = undefined;
                else
                    this.Pr.Ind.Left = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Ind_Right:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Ind )
                    this.Pr.Ind = new CParaInd();

                if ( true === Reader.GetBool() )
                    this.Pr.Ind.Right = undefined;
                else
                    this.Pr.Ind.Right = Reader.GetDouble();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_ContextualSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( true === Reader.GetBool() )
                    this.Pr.ContextualSpacing = undefined;
                else
                    this.Pr.ContextualSpacing = Reader.GetBool();

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepLines:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.KeepLines = Reader.GetBool();
                else
                    this.Pr.KeepLines = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_KeepNext:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.KeepNext = Reader.GetLong();
                else
                    this.Pr.KeepNext = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PageBreakBefore:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.PageBreakBefore = Reader.GetBool();
                else
                    this.Pr.PageBreakBefore = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Line:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.Line = Reader.GetDouble();
                else
                    this.Pr.Spacing.Line = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_LineRule:
            {
                // Bool : IsUndefined

                // Если false
                // Long : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.LineRule = Reader.GetLong();
                else
                    this.Pr.Spacing.LineRule = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_Before:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.Before = Reader.GetDouble();
                else
                    this.Pr.Spacing.Before = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_After:
            {
                // Bool : IsUndefined

                // Если false
                // Double : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.After = Reader.GetDouble();
                else
                    this.Pr.Spacing.After = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
                else
                    this.Pr.Spacing.AfterAutoSpacing = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( undefined === this.Pr.Spacing )
                    this.Pr.Spacing = new CParaSpacing();

                if ( false === Reader.GetBool() )
                    this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
                else
                    this.Pr.Spacing.BeforeAutoSpacing = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Value:
            {
                // Bool : IsUndefined
                // Если false
                // Byte : Value

                if ( false === Reader.GetBool() )
                {
                    if ( undefined === this.Pr.Shd )
                        this.Pr.Shd = new CDocumentShd();

                    this.Pr.Shd.Value = Reader.GetByte();
                }
                else if ( undefined != this.Pr.Shd )
                    this.Pr.Shd.Value = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd_Color:
            {
                // Bool : IsUndefined

                // Если false
                // Variable : Color (CDocumentColor)

                if ( false === Reader.GetBool() )
                {
                    if ( undefined === this.Pr.Shd )
                        this.Pr.Shd = new CDocumentShd();

                    this.Pr.Shd.Color = new CDocumentColor(0,0,0);
                    this.Pr.Shd.Color.Read_FromBinary(Reader);
                }
                else if ( undefined != this.Pr.Shd )
                    this.Pr.Shd.Color = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Shd:
            {
                // Bool : IsUndefined
                // Если false
                // Byte : Value

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Shd = new CDocumentShd();
                    this.Pr.Shd.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Shd = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_WidowControl:
            {
                // Bool : IsUndefined

                // Если false
                // Bool : Value

                if ( false === Reader.GetBool() )
                    this.Pr.WidowControl = Reader.GetBool();
                else
                    this.Pr.WidowControl = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Tabs:
            {
                // Bool : IsUndefined
                // Есди false
                // Variable : CParaTabs

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Tabs = new CParaTabs();
                    this.Pr.Tabs.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Tabs = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PStyle:
            {
                // Bool : Удаляем ли

                // Если false
                // String : StyleId

                if ( false === Reader.GetBool() )
                    this.Pr.PStyle = Reader.GetString2();
                else
                    this.Pr.PStyle = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_DocNext:
            {
                // String : Id элемента

                //this.Next = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }
            case historyitem_Paragraph_DocPrev:
            {
                // String : Id элемента

                //this.Prev = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }
            case historyitem_Paragraph_Parent:
            {
                // String : Id элемента

                this.Parent = g_oTableId.Get_ById( Reader.GetString2() );

                break;
            }

            case historyitem_Paragraph_Borders_Between:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Between = new CDocumentBorder();
                    this.Pr.Brd.Between.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Between = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Bottom:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Bottom = new CDocumentBorder();
                    this.Pr.Brd.Bottom.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Bottom = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Left:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Left = new CDocumentBorder();
                    this.Pr.Brd.Left.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Left = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Right:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Right = new CDocumentBorder();
                    this.Pr.Brd.Right.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Right = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Borders_Top:
            {
                // Bool : IsUndefined
                // если false
                //  Variable : Border (CDocumentBorder)

                if ( false === Reader.GetBool() )
                {
                    this.Pr.Brd.Top = new CDocumentBorder();
                    this.Pr.Brd.Top.Read_FromBinary( Reader );
                }
                else
                    this.Pr.Brd.Top = undefined;

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_Pr:
            {
                // Bool : IsUndefined

                if ( true === Reader.GetBool() )
                    this.Pr = new CParaPr();
                else
                {
                    this.Pr = new CParaPr();
                    this.Pr.Read_FromBinary( Reader );
                }

                this.CompiledPr.NeedRecalc = true;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Bullet:
            {
                // Variable : Bullet

                var Bullet = new CPresentationBullet();
                Bullet.Read_FromBinary( Reader );
                this.PresentationPr.Bullet = Bullet;

                break;
            }

            case historyitem_Paragraph_PresentationPr_Level:
            {
                // Long : Level
                this.PresentationPr.Level = Reader.GetLong();
                break;
            }

            case historyitem_Paragraph_FramePr:
            {
                // Bool : IsUndefined
                // false ->
                //   Variable : CFramePr

                if ( false === Reader.GetBool() )
                {
                    this.Pr.FramePr = new CFramePr();
                    this.Pr.FramePr.Read_FromBinary( Reader );
                }
                else
                {
                    this.Pr.FramePr = undefined;
                }

                this.CompiledPr.NeedRecalc = true;

                break;
            }
        }

        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Paragraph );

        // String   : Id
        // String   : Id родительского класса
        // Variable : ParaPr
        // String   : Id TextPr
        // Long     : количество элементов, у которых Is_RealContent = true

        Writer.WriteString2( "" + this.Id );
        Writer.WriteString2( this.Parent.Get_Id() );
       // Writer.WriteString2( this.Parent.Get_Id() );

        this.Pr.Write_ToBinary( Writer );

        Writer.WriteString2( this.TextPr.Get_Id() );

        var StartPos = Writer.GetCurPosition();
        Writer.Skip( 4 );

        var Len = this.Content.length;
        var Count  = 0;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Item = this.Content[Index];
            if ( true === Item.Is_RealContent() )
            {
                Item.Write_ToBinary( Writer );
                Count++;
            }
        }

        var EndPos = Writer.GetCurPosition();
        Writer.Seek( StartPos );
        Writer.WriteLong( Count );
        Writer.Seek( EndPos );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id
        // String   : Id родительского класса
        // Variable : ParaPr
        // String   : Id TextPr
        // Long     : количество элементов, у которых Is_RealContent = true

        this.Id = Reader.GetString2();
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;

        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();

        this.Pr = new CParaPr();
        this.Pr.Read_FromBinary( Reader );

       // this.TextPr = g_oTableId.Get_ById( Reader.GetString2() );
        LinkData.TextPr = Reader.GetString2();
        CollaborativeEditing.Add_LinkData(this, LinkData);


        this.Content = new Array();
        var Count = Reader.GetLong();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = ParagraphContent_Read_FromBinary(Reader);

            if ( null != Element )
                this.Content.push( Element );
        }

        CollaborativeEditing.Add_NewObject( this );
    },

    Load_LinkData : function(LinkData)
    {
        if ( "undefined" != typeof(LinkData.Parent) )
            this.Parent = g_oTableId.Get_ById( LinkData.Parent );
        if ( "undefined" != typeof(LinkData.TextPr) )
            this.TextPr = g_oTableId.Get_ById( LinkData.TextPr );
    },

    Clear_CollaborativeMarks : function()
    {
        for ( var Pos = 0; Pos < this.Content.length; Pos++ )
        {
            var Item = this.Content[Pos];

            if ( Item.Type == para_CollaborativeChangesEnd || Item.Type == para_CollaborativeChangesStart )
            {
                this.Internal_Content_Remove( Pos );
                Pos--;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(Comment, bStart, bEnd)
    {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();

        if ( true === this.ApplyToAll )
        {
            if ( true === bEnd )
            {
                var PagePos = this.Internal_GetXYByContentPos( CursorPos_max );
                var Line    = this.Lines[PagePos.Internal.Line];
                var LineA   = Line.Metrics.Ascent;
                var LineH   = Line.Bottom - Line.Top;
                Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                var Item = new ParaCommentEnd(Comment.Get_Id());
                this.Internal_Content_Add( CursorPos_max, Item );
            }

            if ( true === bStart )
            {
                var PagePos = this.Internal_GetXYByContentPos( CursorPos_min );
                var Line    = this.Lines[PagePos.Internal.Line];
                var LineA   = Line.Metrics.Ascent;
                var LineH   = Line.Bottom - Line.Top;
                Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                var Item = new ParaCommentStart(Comment.Get_Id());
                this.Internal_Content_Add( CursorPos_min, Item );
            }
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                var StartPos, EndPos;
                if ( this.Selection.StartPos < this.Selection.EndPos )
                {
                    StartPos = this.Selection.StartPos;
                    EndPos   = this.Selection.EndPos;
                }
                else
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                if ( true === bEnd )
                {
                    EndPos = Math.max( CursorPos_min, Math.min( CursorPos_max, EndPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( EndPos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add( EndPos, Item );
                }

                if ( true === bStart )
                {
                    StartPos = Math.max( CursorPos_min, Math.min( CursorPos_max, StartPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( StartPos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add( StartPos, Item );
                }
            }
            else
            {
                if ( true === bEnd )
                {
                    var Pos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( Pos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add( Pos, Item );
                }

                if ( true === bStart )
                {
                    var Pos = Math.max( CursorPos_min, Math.min( CursorPos_max, this.CurPos.ContentPos ) );

                    var PagePos = this.Internal_GetXYByContentPos( Pos );
                    var Line    = this.Lines[PagePos.Internal.Line];
                    var LineA   = Line.Metrics.Ascent;
                    var LineH   = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add( Pos, Item );
                }
            }
        }
    },

    Add_Comment2 : function(Comment, ObjectId)
    {
        var Pos = -1;
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.Content[Index];
            if ( para_Drawing === Item.Type )
            {
                Pos = Index;
                break;
            }
        }

        if ( -1 != Pos )
        {
            var StartPos = Pos;
            var EndPos   = Pos + 1;

            var PagePos = this.Internal_GetXYByContentPos( EndPos );
            var Line    = this.Lines[PagePos.Internal.Line];
            var LineA   = Line.Metrics.Ascent;
            var LineH   = Line.Bottom - Line.Top;
            Comment.Set_EndInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

            var Item = new ParaCommentEnd(Comment.Get_Id());
            this.Internal_Content_Add( EndPos, Item );

            var PagePos = this.Internal_GetXYByContentPos( StartPos );
            var Line    = this.Lines[PagePos.Internal.Line];
            var LineA   = Line.Metrics.Ascent;
            var LineH   = Line.Bottom - Line.Top;
            Comment.Set_StartInfo( PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id() );

            var Item = new ParaCommentStart(Comment.Get_Id());
            this.Internal_Content_Add( StartPos, Item );
        }
    },

    CanAdd_Comment : function()
    {
        if ( true === this.Selection.Use && true != this.Selection_IsEmpty() )
            return true;

        return false;
    },

    Remove_CommentMarks : function(Id)
    {
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( ( para_CommentStart === Item.Type || para_CommentEnd === Item.Type ) && Id === Item.Id )
            {
                if ( para_CommentStart === Item.Type )
                    DocumentComments.Set_StartInfo( Item.Id, 0, 0, 0, 0, null );
                else
                    DocumentComments.Set_EndInfo( Item.Id, 0, 0, 0, 0, null );

                this.Internal_Content_Remove( Pos );
                Pos--;
                Count--;
            }
        }
    },

    Replace_MisspelledWord : function(Word, WordId)
    {
        var Element = this.SpellChecker.Elements[WordId];
        var StartPos = Element.StartPos;
        var EndPos   = Element.EndPos;

        for ( var Pos = EndPos; Pos >= StartPos; Pos-- )
        {
            var ItemType = this.Content[Pos].Type;
            if ( para_TextPr != ItemType )
                this.Internal_Content_Remove(Pos);
        }

        var Len = Word.length;
        for ( var Pos = 0; Pos < Len; Pos++ )
        {
            this.Internal_Content_Add( StartPos + Pos, new ParaText( Word[Pos] ) );
        }

        this.RecalcInfo.Set_Type_0( pararecalc_0_All );

        this.Selection.Use      = false;
        this.Selection.Start    = false;
        this.Selection.StartPos = EndPos;
        this.Selection.EndPos   = EndPos;
        this.Set_ContentPos( EndPos );
    },

    Ignore_MisspelledWord : function(WordId)
    {
        var Element = this.SpellChecker.Elements[WordId];
        Element.Checked = true;
        this.ReDraw();
    }

};

var pararecalc_0_All  = 0;
var pararecalc_0_None = 1;

var pararecalc_0_Spell_All  = 0;
var pararecalc_0_Spell_Pos  = 1;
var pararecalc_0_Spell_Lang = 2;
var pararecalc_0_Spell_None = 3;

function CParaRecalcInfo()
{
    this.Recalc_0_Type = pararecalc_0_All;
    this.Recalc_0_Spell =
    {
        Type      : pararecalc_0_All,
        StartPos  : 0,
        EndPos    : 0
    };
}

CParaRecalcInfo.prototype =
{
    Set_Type_0 : function(Type)
    {
        this.Recalc_0_Type = Type;
    },

    Set_Type_0_Spell : function(Type, StartPos, EndPos)
    {
        if ( pararecalc_0_Spell_All === this.Recalc_0_Spell.Type )
            return;
        else if ( pararecalc_0_Spell_None === this.Recalc_0_Spell.Type || pararecalc_0_Spell_Lang === this.Recalc_0_Spell.Type )
        {
            this.Recalc_0_Spell.Type = Type;
            if ( pararecalc_0_Spell_Pos === Type )
            {
                this.Recalc_0_Spell.StartPos = StartPos;
                this.Recalc_0_Spell.EndPos   = EndPos;
            }
        }
        else if ( pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type )
        {
            if ( pararecalc_0_Spell_All === Type )
                this.Recalc_0_Spell.Type = Type;
            else if ( pararecalc_0_Spell_Pos === Type )
            {
                this.Recalc_0_Spell.StartPos = Math.min( StartPos, this.Recalc_0_Spell.StartPos );
                this.Recalc_0_Spell.EndPos   = Math.max( EndPos,   this.Recalc_0_Spell.EndPos   );
            }
        }
    },

    Update_Spell_OnChange : function(Pos, Count, bAdd)
    {
        if ( pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type )
        {
            if ( true === bAdd )
            {
                if ( this.Recalc_0_Spell.StartPos > Pos )
                    this.Recalc_0_Spell.StartPos++;

                if ( this.Recalc_0_Spell.EndPos >= Pos )
                    this.Recalc_0_Spell.EndPos++;
            }
            else
            {
                if ( this.Recalc_0_Spell.StartPos > Pos )
                {
                    if ( this.Recalc_0_Spell.StartPos > Pos + Count )
                        this.Recalc_0_Spell.StartPos -= Count;
                    else
                        this.Recalc_0_Spell.StartPos = Pos;
                }

                if ( this.Recalc_0_Spell.EndPos >= Pos )
                {
                    if ( this.Recalc_0_Spell.EndPos >= Pos + Count )
                        this.Recalc_0_Spell.EndPos -= Count;
                    else
                        this.Recalc_0_Spell.EndPos = Math.max( 0, Pos - 1 );
                }
            }
        }
    }
};

function CParaLineRange(X, XEnd)
{
    this.X         = X;
    this.XVisible  = 0;
    this.XEnd      = XEnd;

    this.W         = 0;
    this.Words     = 0;
    this.Spaces    = 0;
    this.Letters   = 0;

    this.SpacesSkip  = 0;
    this.LettersSkip = 0;

    this.StartPos  = 0;  // Позиция в контенте параграфа, с которой начинается данный отрезок
    this.EndPos    = 0;  // Позиция в контенте параграфа, на которой заканчиваетсяданный отрезок

    this.SpacePos  = -1; // Позиция, с которой начинаем считать пробелы
    this.StartPos2 = -1; // Позиции начала и конца отрисовки выделения
    this.EndPos2   = -1; // текста(а также подчеркивания и зачеркивания)
}

CParaLineRange.prototype =
{
    Shift : function(Dx, Dy)
    {
        this.X        += Dx;
        this.XEnd     += Dx;
        this.XVisible += Dx;
    },

    Reset_Width : function()
    {
        this.W           = 0;
        this.Words       = 0;
        this.Spaces      = 0;
        this.Letters     = 0;
        this.SpacesSkip  = 0;
        this.LettersSkip = 0;
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
    },

    Recalculate_LineGap : function(ParaPr, TextAscent, TextDescent)
    {
        var LineGap = 0;
        switch ( ParaPr.Spacing.LineRule )
        {
            case linerule_Auto:
            {
                LineGap = ( TextAscent + TextDescent ) * ( ParaPr.Spacing.Line - 1 );
                break;
            }
            case linerule_Exact:
            {
                var ExactValue = Math.max( 1, ParaPr.Spacing.Line );
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
            case linerule_AtLeast:
            {
                var LineGap1 = ParaPr.Spacing.Line;
                var LineGap2 = TextAscent + TextDescent;
                LineGap = Math.max( LineGap1, LineGap2 ) - ( TextAscent + TextDescent );
                break;
            }

        }
        return LineGap;
    }
}

function CParaLine(StartPos)
{
    this.Y         = 0; //
    this.W         = 0;
    this.Top       = 0;
    this.Bottom    = 0;
    this.Words     = 0;
    this.Spaces    = 0; // Количество пробелов между словами в строке (пробелы, идущие в конце строки, не учитываются)
    this.Metrics   = new CParaLineMetrics();
    this.Ranges    = new Array(); // Массив CParaLineRanges
    this.RangeY    = false;
    this.StartPos  = StartPos; // Позиция в контенте параграфа, с которой начинается данная строка
    this.EndPos    = StartPos; // Позиция последнего элемента в данной строке
}

CParaLine.prototype =
{
    Add_Range : function(X, XEnd)
    {
        this.Ranges.push( new CParaLineRange( X, XEnd ) );
    },

    Shift : function(Dx, Dy)
    {
        var RangesCount = this.Ranges.length;
        for ( var Index = 0; Index < RangesCount; Index++ )
        {
            this.Ranges[Index].Shift( Dx, Dy );
        }
    },

    Set_RangeStartPos : function(CurRange, StartPos)
    {
        if ( 0 === CurRange )
            this.StartPos = StartPos;

        this.Ranges[CurRange].StartPos = StartPos;
    },

    Set_RangeEndPos : function(CurRange, EndPos)
    {
        this.Ranges[CurRange].EndPos = EndPos;

        if ( CurRange === this.Ranges.length - 1 )
            this.Set_EndPos( EndPos );
    },

    Reset : function(StartPos)
    {
        //this.Y        = 0; //
        this.Top      = 0;
        this.Bottom   = 0;
        this.Words    = 0;
        this.Spaces   = 0; // Количество пробелов между словами в строке (пробелы, идущие в конце строки, не учитываются)
        this.Metrics  = new CParaLineMetrics();
        this.Ranges   = new Array(); // Массив CParaLineRanges
        //this.RangeY   = false;
        this.StartPos = StartPos;
    },

    Set_EndPos : function(EndPos, Paragraph)
    {
        this.EndPos = EndPos;

        if ( true !== Debug_ParaRunMode )
        {
            var Content = Paragraph.Content;
            var RangesCount = this.Ranges.length;

            for ( var CurRange = 0; CurRange < RangesCount; CurRange++ )
            {
                var Range = this.Ranges[CurRange];

                var StartRangePos = Range.StartPos;
                var EndRangePos   = ( CurRange === RangesCount - 1 ? EndPos : this.Ranges[CurRange + 1].StartPos - 1 );

                var nSpacesCount = 0;
                var bWord        = false;
                var nSpaceLen    = 0;

                var nSpacePos  = -1;
                var nStartPos2 = -1;
                var nEndPos2   = -1;

                Range.W      = 0;
                Range.Words  = 0;
                Range.Spaces = 0;

                for ( var Pos = StartRangePos; Pos <= EndRangePos; Pos++ )
                {
                    var Item = Content[Pos];

                    if ( Pos === Paragraph.Numbering.Pos )
                        Range.W += Paragraph.Numbering.WidthVisible;

                    switch( Item.Type )
                    {
                        case para_Math:
                        case para_Text:
                        {
                            if ( true != bWord )
                            {
                                bWord = true;
                                Range.Words++;
                            }

                            Range.W += Item.Width;

                            // Если текущий символ, например, дефис, тогда на нем заканчивается слово
                            if ( true === Item.SpaceAfter )
                            {
                                Range.W += nSpaceLen;

                                // Пробелы перед первым словом в строке не считаем
                                if ( Range.Words > 1 )
                                    Range.Spaces += nSpacesCount;

                                bWord        = false;
                                nSpaceLen    = 0;
                                nSpacesCount = 0;
                            }

                            if ( EndRangePos === Pos )
                                Range.W += nSpaceLen;

                            if ( -1 === nSpacePos )
                                nSpacePos = Pos;

                            if ( -1 === nStartPos2 )
                                nStartPos2 = Pos;

                            nEndPos2 = Pos;

                            break;
                        }
                        case para_Space:
                        {
                            if ( true === bWord )
                            {
                                Range.W += nSpaceLen;

                                // Пробелы перед первым словом в строке не считаем
                                if ( Range.Words > 1 )
                                    Range.Spaces += nSpacesCount;

                                bWord        = false;
                                nSpacesCount = 1;
                                nSpaceLen    = 0;
                            }
                            else
                                nSpacesCount++;

                            nSpaceLen += Item.Width;

                            break;
                        }
                        case para_Drawing:
                        {
                            Range.Words++;
                            Range.W      += nSpaceLen;
                            Range.Spaces += nSpacesCount;

                            bWord        = false;
                            nSpacesCount = 0;
                            nSpaceLen    = 0;

                            if ( true === Item.Is_Inline() || true === Paragraph.Parent.Is_DrawingShape() )
                            {
                                Range.W += Item.Width;

                                if ( -1 === nSpacePos )
                                    nSpacePos = Pos;

                                if ( -1 === nStartPos2 )
                                    nStartPos2 = Pos;

                                nEndPos2 = Pos;
                            }

                            break;
                        }
                        case para_PageNum:
                        {
                            Range.Words++;
                            Range.W      += nSpaceLen;
                            Range.Spaces += nSpacesCount;

                            bWord        = false;
                            nSpacesCount = 0;
                            nSpaceLen    = 0;

                            Range.W += Item.Width;

                            if ( -1 === nSpacePos )
                                nSpacePos = Pos;

                            if ( -1 === nStartPos2 )
                                nStartPos2 = Pos;

                            nEndPos2 = Pos;

                            break;
                        }
                        case para_Tab:
                        {
                            Range.W += Item.Width;
                            Range.W += nSpaceLen;

                            Range.Words  = 0;
                            Range.Spaces = 0;

                            nSpaceLen    = 0;
                            nSpacesCount = 0;
                            bWord        = false;

                            nSpacePos = -1;

                            break;
                        }

                        case para_NewLine:
                        {
                            if ( bWord && Range.Words > 1 )
                                Range.Spaces += nSpacesCount;

                            nSpacesCount = 0;
                            bWord        = false;

                            break;
                        }
                        case para_End:
                        {
                            if ( true === bWord )
                                Range.Spaces += nSpacesCount;

                            break;
                        }
                    }
                }

                Range.SpacePos  = nSpacePos;
                Range.StartPos2 = ( nStartPos2 === -1 ? StartRangePos : nStartPos2 );
                Range.EndPos2   = ( nEndPos2   === -1 ? EndRangePos   : nEndPos2   );
            }
        }
    }
};

function CDocumentBounds(Left, Top, Right, Bottom)
{
    this.Bottom = Bottom;
    this.Left   = Left;
    this.Right  = Right;
    this.Top    = Top;
}

CDocumentBounds.prototype =
{
    Shift : function(Dx, Dy)
    {
        this.Bottom += Dy;
        this.Top    += Dy;
        this.Left   += Dx;
        this.Right  += Dx;
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
    }
};

function CParaPos(Range, Line, Page, Pos)
{
    this.Range = Range; // Номер промежутка в строке
    this.Line  = Line;  // Номер строки
    this.Page  = Page;  // Номер страницы
    this.Pos   = Pos;   // Позиция в общем массиве
}


// используется в Internal_Draw_3 и Internal_Draw_5
function CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional)
{
    this.y0 = y0;
    this.y1 = y1;
    this.x0 = x0;
    this.x1 = x1;
    this.w  = w;
    this.r  = r;
    this.g  = g;
    this.b  = b;

    this.Additional = Additional;
}


function CParaDrawingRangeLines()
{
    this.Elements = new Array();
}

CParaDrawingRangeLines.prototype =
{
    Clear : function()
    {
        this.Elements = new Array();
    },

    Add : function (y0, y1, x0, x1, w, r, g, b, Additional)
    {
        this.Elements.push( new CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional) );
    },

    Get_Next : function()
    {
        var Count = this.Elements.length;
        if ( Count <= 0 )
            return null;

        // Соединяем, начиная с конца, чтобы проще было обрезать массив
        var Element = this.Elements[Count - 1];
        Count--;

        while ( Count > 0 )
        {
            var PrevEl = this.Elements[Count - 1];

            if ( Math.abs( PrevEl.y0 - Element.y0 ) < 0.001 && Math.abs( PrevEl.y1 - Element.y1 ) < 0.001 && Math.abs( PrevEl.x1 - Element.x0 ) < 0.001 && Math.abs( PrevEl.w - Element.w ) < 0.001 && PrevEl.r === Element.r && PrevEl.g === Element.g && PrevEl.b === Element.b )
            {
                Element.x0 = PrevEl.x0;
                Count--;
            }
            else
                break;
        }

        this.Elements.length = Count;

        return Element;
    },

    Correct_w_ForUnderline : function()
    {
        var Count = this.Elements.length;
        if ( Count <= 0 )
            return;

        var CurElements = new Array();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            var CurCount = CurElements.length;

            if ( 0 === CurCount )
                CurElements.push( Element );
            else
            {
                var PrevEl = CurElements[CurCount - 1];

                if ( Math.abs( PrevEl.y0 - Element.y0 ) < 0.001 && Math.abs( PrevEl.y1 - Element.y1 ) < 0.001 && Math.abs( PrevEl.x1 - Element.x0 ) < 0.001 )
                {
                    // Сравниваем толщины линий
                    if ( Element.w > PrevEl.w )
                    {
                        for ( var Index2 = 0; Index2 < CurCount; Index2++ )
                            CurElements[Index2].w = Element.w;
                    }
                    else
                        Element.w = PrevEl.w;

                    CurElements.push( Element );
                }
                else
                {
                    CurElements.length = 0;
                    CurElements.push( Element );
                }
            }
        }
    }

};

function CParagraphSelection()
{
    this.Start     = false;
    this.Use       = false;
    this.StartPos  = 0;
    this.EndPos    = 0;
    this.StartPos2 = 0;
    this.EndPos2   = 0,
    this.Flag      = selectionflag_Common;
}

CParagraphSelection.prototype =
{
    Set_StartPos : function(Pos1, Pos2)
    {
        this.StartPos  = Pos1;
        this.StartPos2 = ( undefined != Pos2 ? Pos2 : Pos1 );
    },

    Set_EndPos : function(Pos1, Pos2)
    {
        this.EndPos  = Pos1;
        this.EndPos2 = ( undefined != Pos2 ? Pos2 : Pos1 );
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

function CParagraphContentPos()
{
    this.Data  = [0, 0, 0];
    this.Depth = 0;
}

CParagraphContentPos.prototype =
{
    Add : function (Pos)
    {
        this.Data[this.Depth] = Pos;
        this.Depth++;
    },

    Update : function(Pos, Depth)
    {
        this.Data[Depth] = Pos;
        this.Depth = Depth + 1;
    },

    Update2 : function(Pos, Depth)
    {
        this.Data[Depth] = Pos;
    },

    Set : function(OtherPos)
    {
        // Копируем позицию
        var Len = OtherPos.Depth;
        for ( var Pos = 0; Pos < Len; Pos++ )
            this.Data[Pos] = OtherPos.Data[Pos];

        this.Depth = OtherPos.Depth;

        if ( this.Data.length > this.Depth )
            this.Data.length = this.Depth;
    },

    Get : function(Depth)
    {
        return this.Data[Depth];
    },

    Get_Depth : function()
    {
        return this.Depth - 1;
    },

    Copy : function ()
    {
        var PRPos = new CParagraphContentPos();

        var Count = this.Data.length;
        for (var Index = 0; Index < Count; Index++)
        {
            PRPos.Add( this.Data[Index] );
        }

        return PRPos;
    },

    Compare : function(Pos)
    {
        var CurDepth = 0;

        var Len1 = this.Data.length;
        var Len2 = Pos.Data.length;
        var LenMin = Math.min( Len1, Len2 );

        while ( CurDepth < LenMin )
        {
            if ( this.Data[CurDepth] === Pos.Data[CurDepth] )
            {
                // Если попали в один и тот же элемент, тогда проверяем далее
                CurDepth++;
                continue;
            }
            else if ( this.Data[CurDepth] > Pos.Data[CurDepth] )
                return 1;
            else //if ( this.Data[CurDepth] < Pos.Data[CurDepth] )
                return -1;
        }

        // Такого не должно быть, но на всякий случай пошлем, что позиции не совпадают
        if ( Len1 !== Len2 )
            return -1;

        return 0;
    }
};

function CParagraphRecalculateStateWrap()
{
    this.Paragraph       = undefined;

    this.Page            = 0;
    this.Line            = 0;
    this.Range           = 0;

    this.Ranges          = new Array();
    this.RangesCount     = 0;

    this.FirstItemOnLine = true;
    this.EmptyLine       = true;
    this.StartWord       = false;
    this.Word            = false;
    this.AddNumbering    = true;

    this.BreakPageLine   = false;

    this.ExtendBoundToBottom = false;

    this.WordLen         = 0;
    this.SpaceLen        = 0;
    this.SpacesCount     = 0;
    this.LastTab         = new CParagraphRecalculateTabInfo();

    this.LineTextAscent  = 0;
    this.LineTextDescent = 0;
    this.LineTextAscent2 = 0;
    this.LineAscent      = 0;
    this.LineDescent     = 0;

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

    this.CurPos       = new CParagraphContentPos();

    this.NumberingPos = new CParagraphContentPos(); // Позиция элемента вместе с которым идет нумерация

    this.MoveToLBP    = false;                      // Делаем ли разрыв в позиции this.LineBreakPos
    this.LineBreakPos = new CParagraphContentPos(); // Последняя позиция в которой можно будет добавить разрыв
                                                    // отрезка или строки, если что-то не умещается (например,
                                                    // если у нас не убирается слово, то разрыв ставим перед ним)

    this.RecalcResult = 0x00;//recalcresult_NextElement;
}

CParagraphRecalculateStateWrap.prototype =
{
    // Обнуляем некоторые параметры перед новой строкой
    Reset_Line : function()
    {
        this.RecalcResult        = recalcresult_NextLine;

        this.EmptyLine           = true;
        this.BreakPageLine       = false;
        this.End                 = false;

        this.LineTextAscent      = 0;
        this.LineTextAscent2     = 0;
        this.LineTextDescent     = 0;
        this.LineAscent          = 0;
        this.LineDescent         = 0;

        this.NewPage             = false;
        this.ForceNewPage        = false;
        this.ExtendBoundToBottom = false;
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

        this.MoveToLBP    = false;
        this.LineBreakPos = new CParagraphContentPos();
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
        this.Ranges      = new Array();
        this.RangesCount = 0;
    }
};

function CParagraphRecalculateStateCounter()
{
    this.Paragraph   = undefined;
    this.Range       = undefined;
    this.Word        = false;
    this.SpaceLen    = 0;
    this.SpacesCount = 0;
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
    }
};

function CParagraphRecalculateStateAlign()
{
    this.X             = 0; // Текущая позиция по горизонтали
    this.Y             = 0; // Текущая позиция по вертикали
    this.JustifyWord   = 0; // Добавочная ширина символов
    this.JustifySpace  = 0; // Добавочная ширина пробелов
    this.SpacesCounter = 0; // Счетчик пробелов с добавочной шириной (чтобы пробелы в конце строки не трогать)
    this.SpacesSkip    = 0; // Количество пробелов, которые мы пропускаем в начале строки
    this.LettersSkip   = 0; // Количество букв, которые мы пропускаем (из-за таба)
    this.LastW         = 0; // Ширина последнего элемента (необходимо для позиционирования картинки)
    this.Paragraph     = undefined;
    this.RecalcResult  = 0x00;//recalcresult_NextElement;
}

var g_oPRSW = new CParagraphRecalculateStateWrap();
var g_oPRSC = new CParagraphRecalculateStateCounter();
var g_oPRSA = new CParagraphRecalculateStateAlign();

function CParagraphDrawStateHightlights()
{
    this.Page   = 0;
    this.Line   = 0;
    this.Range  = 0;

    this.CurPos = new CParagraphContentPos();

    this.DrawColl = false;
    this.DrawFind = false;
    this.DrawComm = false;

    this.CommentsFlag = comments_NoComment;

    this.High   = new CParaDrawingRangeLines();
    this.Coll   = new CParaDrawingRangeLines();
    this.Find   = new CParaDrawingRangeLines();
    this.Comm   = new CParaDrawingRangeLines();

    this.Paragraph = undefined;
    this.Graphics  = undefined;

    this.X  = 0;
    this.Y0 = 0;
    this.Y1 = 0;

    this.Spaces = 0;
}

CParagraphDrawStateHightlights.prototype =
{
    Reset : function(Paragraph, Graphics, DrawColl, DrawFind, DrawComm, CommentsFlag)
    {
        this.Paragraph = Paragraph;
        this.Graphics  = Graphics;

        this.DrawColl = DrawColl;
        this.DrawFind = DrawFind;
        this.DrawComm = DrawComm;
        this.CommentsFlag = CommentsFlag;

        this.CurPos = new CParagraphContentPos();
    },

    Reset_Range : function(Page, Line, Range, X, Y0, Y1, SpacesCount)
    {
        this.Page  = Page;
        this.Line  = Line;
        this.Range = Range;

        this.High.Clear();
        this.Coll.Clear();
        this.Find.Clear();
        this.Comm.Clear();

        this.X  = X;
        this.Y0 = Y0;
        this.Y1 = Y1;

        this.Spaces = SpacesCount;
    }
};

function CParagraphDrawStateElements()
{
    this.Paragraph = undefined;
    this.Graphics  = undefined;
    this.AutoColor = undefined;

    this.CurPos = new CParagraphContentPos();

    this.VisitedHyperlink = false;

    this.Page   = 0;
    this.Line   = 0;
    this.Range  = 0;

    this.X = 0;
    this.Y = 0;
}

CParagraphDrawStateElements.prototype =
{
    Reset : function(Paragraph, Graphics, AutoColor)
    {
        this.Paragraph = Paragraph;
        this.Graphics  = Graphics;
        this.AutoColor = AutoColor;

        this.VisitedHyperlink = false;

        this.CurPos = new CParagraphContentPos();
    },

    Reset_Range : function(Page, Line, Range, X, Y)
    {
        this.Page  = Page;
        this.Line  = Line;
        this.Range = Range;

        this.X = X;
        this.Y = Y;
    }
};

function CParagraphDrawStateLines()
{
    this.Paragraph = undefined;
    this.Graphics  = undefined;
    this.AutoColor = undefined;

    this.CurPos = new CParagraphContentPos();

    this.VisitedHyperlink = false;

    this.Strikeout  = new CParaDrawingRangeLines();
    this.DStrikeout = new CParaDrawingRangeLines();
    this.Underline  = new CParaDrawingRangeLines();
    this.Spelling   = new CParaDrawingRangeLines();

    this.Page  = 0;
    this.Line  = 0;
    this.Range = 0;

    this.X               = 0;
    this.BaseLine        = 0;
    this.UnderlineOffset = 0;
    this.Spaces          = 0;
}

CParagraphDrawStateLines.prototype =
{
    Reset : function(Paragraph, Graphics, AutoColor)
    {
        this.Paragraph = Paragraph;
        this.Graphics  = Graphics;
        this.AutoColor = AutoColor;

        this.VisitedHyperlink = false;

        this.CurPos = new CParagraphContentPos();
    },

    Reset_Line : function(Page, Line, Baseline, UnderlineOffset)
    {
        this.Page  = Page;
        this.Line  = Line;

        this.Baseline        = Baseline;
        this.UnderlineOffset = UnderlineOffset;

        this.Strikeout.Clear();
        this.DStrikeout.Clear();
        this.Underline.Clear();
        this.Spelling.Clear();
    },

    Reset_Range : function(Range, X, Spaces)
    {
        this.Range  = Range;
        this.X      = X;
        this.Spaces = Spaces;
    }
};

var g_oPDSH = new CParagraphDrawStateHightlights();
var g_oPDSE = new CParagraphDrawStateElements();
var g_oPDSL = new CParagraphDrawStateLines();

//----------------------------------------------------------------------------------------------------------------------
// Классы для работы с курсором
//----------------------------------------------------------------------------------------------------------------------

// Общий класс для нахождения позиции курсора слева/справа/начала и конца слова и т.д.
function CParagraphSearchPos()
{
    this.Pos   = new CParagraphContentPos(); // Искомая позиция
    this.Found = false;                      // Нашли или нет

    this.Line  = -1;

    this.Stage       = 0; // Номера этапов для поиска начала и конца слова
    this.Shift       = false;
    this.Punctuation = false;
    this.First       = true;
    this.UpdatePos   = false;
}

function CParagraphSearchPosXY()
{
    this.Pos = new CParagraphContentPos();

    this.CurX           = 0;
    this.X              = 0;
    this.DiffX          = 1000000; // километра для ограничения должно хватить
    this.NumberingDiffX = 1000000; // километра для ограничения должно хватить

    this.Line      = 0;
    this.InText    = false;
    this.Numbering = false;
    this.End       = false;
}

//----------------------------------------------------------------------------------------------------------------------
// Классы для работы с селектом
//----------------------------------------------------------------------------------------------------------------------
function CParagraphDrawSelectionRange()
{
    this.StartX    = 0;
    this.W         = 0;

    this.FindStart = true;
}