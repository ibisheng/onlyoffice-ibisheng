/**
 * User: Ilja.Kirillov
 * Date: 13.12.11
 * Time: 14:51
 */

var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;

var hdrftr_Default = 0x01;
var hdrftr_Even    = 0x02;
var hdrftr_First   = 0x03;

//-----------------------------------------------------------------------------------
// Класс работающий с одним колонтитулом
//-----------------------------------------------------------------------------------
function CHeaderFooter(Parent, LogicDocument, DrawingDocument, Type)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Parent          = Parent;
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument   = LogicDocument;

    // Содержимое колонтитула

    if ( "undefined" != typeof(LogicDocument) && null != LogicDocument )
    {
        if ( Type === hdrftr_Header )
        {
            this.Content = new CDocumentContent( this, DrawingDocument, 0, 0, 0, 0, false, true );
            this.Content.Content[0].Style_Add( this.Get_Styles().Get_Default_Header() );
        }
        else
        {
            this.Content = new CDocumentContent( this, DrawingDocument, 0, 0, 0, 0, false, true );
            this.Content.Content[0].Style_Add( this.Get_Styles().Get_Default_Footer() );
        }
    }

    this.Type = Type;

    this.BoundY  = -1; // Для верхнего колонтитула это нижняя граница, а для нижнего - верхняя
    this.BoundY2 = 0;  // Для верхнего колонтитула это верхняя граница, а для нижнего - нижняя

    this.RecalcInfo =
    {
        CurPage       : -1, // Текущий выставленный номер страницы
        RecalcObj     : {}, // Постраничные объекты пересчета данного колонтитула
        NeedRecalc    : {}, // Объект с ключом - номером страницы, нужно ли пересчитывать данную страницу
        SectPr        : {}  // Объект с ключом - номером страницы и полем - ссылкой на секцию
    };

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CHeaderFooter.prototype =
{
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },
    
    Set_Page : function(Page_abs)
    {
        if ( Page_abs !== this.RecalcInfo.CurPage )
        {
            var RecalcObj = this.RecalcInfo.RecalcObj[Page_abs];
            if ( undefined !== RecalcObj )
            {
                this.RecalcInfo.CurPage = Page_abs;
                this.Content.Load_RecalculateObject( RecalcObj );                
            }            
        }        
    },
    
    Is_NeedRecalculate : function(Page_abs)
    {
        if ( false === this.RecalcInfo.NeedRecalc[Page_abs] && undefined !== this.RecalcInfo.RecalcObj[Page_abs] )
            return false;
        
        return true;
    },
    
    Recalculate : function(Page_abs, SectPr)
    {
        // Логика пересчета колонтитулов следующая:
        // 1. При пересчете страницы каждый раз пересчитывается колонтитул (всмысле заходим в функцию Recalculate,т.е. сюда)
        // 2. Далее мы смотрим, нужно ли вообще пересчитывать данную страницу RecalcInfo.NeedRecalc[Page_abs] если это значение
        //    не false, тогда пересчитывать нужно, а если нет, тогда выходим
        // 3. Если нужно персчитывать, пересчитываем заново и смотрим, изменились ли границы пересчета и позиции плавающих 
        //    картинок, и выставляем RecalcInfo.NeedRecalc[Page_abs] = false.
        
        var bChanges = false;                
        var RecalcObj = this.RecalcInfo.RecalcObj[Page_abs];
        
        var OldSumH    = 0;
        var OldBounds  = null;
        var OldFlowPos = new Array();
            
        if ( undefined === RecalcObj )
            bChanges = true;
        else
        {
            OldSumH   = RecalcObj.Get_SummaryHeight();
            OldBounds = RecalcObj.Get_PageBounds(0);
            RecalcObj.Get_DrawingFlowPos( OldFlowPos );
        }
        
        // Пересчитаем заново данный колонтитул        
        this.Content.Set_StartPage( Page_abs );
        this.Content.Prepare_RecalculateObject();

        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while ( recalcresult2_End != RecalcResult  )
            RecalcResult = this.Content.Recalculate_Page( CurPage++, true );
        
        this.RecalcInfo.RecalcObj[Page_abs]  = this.Content.Save_RecalculateObject();
        this.RecalcInfo.NeedRecalc[Page_abs] = false;
        this.RecalcInfo.SectPr[Page_abs]     = false;
        
        // Если у нас до этого был какой-то пересчет, тогда сравним его с текущим.
        // 1. Сравним границы: у верхнего колонтитула смотрим на изменение нижней границы, а нижнего - верхней
        // 2. Сравним положение и размер Flow-объектов
        
        if ( false === bChanges )
        {
            var NewBounds = this.Content.Get_PageBounds( 0 );
            if ( ( Math.abs(NewBounds.Bottom - OldBounds.Bottom) > 0.001 && hdrftr_Header === this.Type ) || ( Math.abs(NewBounds.Top - OldBounds.Top) > 0.001 && hdrftr_Footer === this.Type ) )
                bChanges = true;
        }

        if ( false === bChanges )
        {
            var NewFlowPos = new Array();
            var AllDrawingObjects = this.Content.Get_AllDrawingObjects();
            var Count = AllDrawingObjects.length;

            for ( var Index = 0; Index < Count; Index++ )
            {
                var Obj = AllDrawingObjects[Index];
                if ( drawing_Anchor === Obj.Get_DrawingType() && true === Obj.Use_TextWrap() )
                {
                    var FlowPos =
                    {
                        X : Obj.X - Obj.Distance.L,
                        Y : Obj.Y - Obj.Distance.T,
                        W : Obj.W + Obj.Distance.R,
                        H : Obj.H + Obj.Distance.B
                    };

                    NewFlowPos.push( FlowPos );
                }
            }

            Count = NewFlowPos.length;
            if ( Count != OldFlowPos.length )
                bChanges = true;
            else
            {
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var OldObj = OldFlowPos[Index];
                    var NewObj = NewFlowPos[Index];
                    if ( Math.abs(OldObj.X - NewObj.X) > 0.001 || Math.abs(OldObj.Y - NewObj.Y) > 0.001 || Math.abs(OldObj.H - NewObj.H) > 0.001 || Math.abs(OldObj.W - NewObj.W) > 0.001 )
                    {
                        bChanges = true;
                        break;
                    }
                }
            }
        }

        if ( false === bChanges )
        {
            var NewSumH = this.Content.Get_SummaryHeight();
            if ( Math.abs( OldSumH - NewSumH ) > 0.001 )
                bChanges = true;
        }
        
        // Ежели текущая страница не задана, тогда выставляем ту, которая оказалась пересчитанной первой. В противном
        // случае, выставляем рассчет страницы, которая была до этого.
        if ( -1 === this.RecalcInfo.CurPage )
            this.RecalcInfo.CurPage = Page_abs;
        else            
        {
            var RecalcObj = this.RecalcInfo.RecalcObj[this.RecalcInfo.CurPage];
            this.Content.Load_RecalculateObject( RecalcObj );
        }
        
        return bChanges;
    },
    
    Recalculate2 : function(Page_abs)
    {
        this.Content.Set_StartPage( Page_abs );
        this.Content.Prepare_RecalculateObject();

        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while ( recalcresult2_End != RecalcResult  )
            RecalcResult = this.Content.Recalculate_Page( CurPage++, true );
    },

    Reset_RecalculateCache : function()
    {
        this.Content.Reset_RecalculateCache();
    },

    Get_Styles : function()
    {
        return this.LogicDocument.Get_Styles();
    },

    Get_TableStyleForPara : function()
    {
        return null;
    },

    Get_TextBackGroundColor : function()
    {
        return undefined;
    },

    Get_PageContentStartPos : function ()
    {
        return { X : this.Content.X, Y : 0, XLimit : this.Content.XLimit, YLimit : 0 };
    },

    Set_CurrentElement : function(bUpdateStates)
    {
        this.Parent.CurHdrFtr     = this;
        this.Parent.WaitMouseDown = true;

        this.LogicDocument.CurPos.Type = docpostype_HdrFtr;

        if ( true === bUpdateStates )
        {
            this.LogicDocument.Document_UpdateInterfaceState();
            this.LogicDocument.Document_UpdateRulersState();
            this.LogicDocument.Document_UpdateSelectionState();
        }
    },

    Is_ThisElementCurrent : function()
    {
        if ( this === this.Parent.CurHdrFtr && docpostype_HdrFtr === this.LogicDocument.CurPos.Type )
            return true;

        return false;
    },

    Reset : function(X,Y, XLimit, YLimit)
    {
        this.Content.Reset( X, Y, XLimit, YLimit );
    },

    Draw : function(nPageIndex, pGraphics)
    {
        var OldPage = this.RecalcInfo.CurPage;
        
        this.Set_Page( nPageIndex );
        this.Content.Draw( nPageIndex, pGraphics );
        
        if ( -1 !== OldPage )
            this.Set_Page( OldPage );
    },

    // Пришло сообщение о том, что контент изменился и пересчитался
    OnContentRecalculate : function(bChange, bForceRecalc)
    {
        return;
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },

    RecalculateCurPos : function()
    {
        this.Content.RecalculateCurPos();
    },

    Get_NearestPos : function(X, Y, bAnchor, Drawing)
    {
        return this.Content.Get_NearestPos( this.Content.StartPage, X, Y, bAnchor, Drawing );
    },

    Get_Numbering : function()
    {
        return this.LogicDocument.Get_Numbering();
    },

    Get_Styles : function()
    {
        return this.LogicDocument.Get_Styles();
    },

    Get_Bounds : function()
    {
        return this.Content.Get_PageBounds(0);
    },
    
    Get_DividingLine : function(PageIndex)
    {
        var OldPage = this.RecalcInfo.CurPage;
        
        this.Set_Page( PageIndex );
        var Bounds = this.Get_Bounds();
        
        if ( -1 !== OldPage )
            this.Set_Page( OldPage );
        
        if ( hdrftr_Footer === this.Type )
            return Bounds.Top;
        else
            return Bounds.Bottom;
    },

    Is_PointInDrawingObjects : function(X, Y)
    {
        return this.Content.Is_PointInDrawingObjects( X, Y, this.Content.Get_StartPage_Absolute() );
    },

    CheckRange : function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf)
    {
        return this.Content.CheckRange( X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, 0, false );
    },

    AddPageNum : function(Align)
    {
        var StyleId = null;
        if ( this.Type === hdrftr_Header )
            StyleId = this.Get_Styles().Get_Default_Header();
        else
            StyleId = this.Get_Styles().Get_Default_Footer();

        this.Content.HdrFtr_AddPageNum( Align, StyleId );
    },

    Is_Cell : function()
    {
        return false;
    },

    Is_HdrFtr : function(bReturnHdrFtr)
    {
        if ( true === bReturnHdrFtr )
            return this;

        return true;
    },

    Is_DrawingShape : function()
    {
        return false;
    },

    Is_TopDocument : function(bReturnTopDocument)
    {
        if ( true === bReturnTopDocument )
            return this.Content;

        return true;
    },

    Is_InTable : function(bReturnTopTable)
    {
        if ( true === bReturnTopTable )
            return null;

        return false;
    },

    Is_SelectionUse : function()
    {
        return this.Content.Is_SelectionUse();
    },

    Is_TextSelectionUse : function()
    {
        return this.Content.Is_TextSelectionUse();
    },

    Is_UseInDocument : function(Id)
    {
        if ( null != this.Parent )
            return this.Parent.Is_UseInDocument(this.Get_Id());

        return false;
    },

    Check_Page : function(PageIndex)
    {
        return this.Parent.Check_Page( this, PageIndex );
    },

    Get_CurPosXY : function()
    {
        return this.Content.Get_CurPosXY();
    },

    Get_SelectedText : function(bClearText)
    {
        return this.Content.Get_SelectedText(bClearText);
    },

    Get_SelectedElementsInfo : function(Info)
    {
        this.Content.Get_SelectedElementsInfo(Info);
    },

    Get_SelectedContent : function(SelectedContent)
    {
        this.Content.Get_SelectedContent( SelectedContent );
    },

    Update_CursorType : function(X, Y, PageNum_Abs)
    {
        if ( PageNum_Abs != this.Content.Get_StartPage_Absolute() )
            this.DrawingDocument.SetCursorType( "default", new CMouseMoveData() );
        else
            return this.Content.Update_CursorType( X, Y, PageNum_Abs );
    },

    Is_TableBorder : function(X, Y, PageNum_Abs)
    {
        this.Set_Page( PageNum_Abs );
        return this.Content.Is_TableBorder( X, Y, PageNum_Abs );
    },

    Is_InText : function(X, Y, PageNum_Abs)
    {
        this.Set_Page( PageNum_Abs );
        return this.Content.Is_InText( X, Y, PageNum_Abs );
    },

    Is_InDrawing : function(X, Y, PageNum_Abs)
    {
        this.Set_Page( PageNum_Abs );
        return this.Content.Is_InDrawing( X, Y, PageNum_Abs );
    },

    Document_UpdateInterfaceState : function()
    {
        this.Content.Document_UpdateInterfaceState();
    },

    Document_UpdateRulersState : function()
    {
        if ( -1 === this.RecalcInfo.CurPage )
            return;
        
        var Index  = this.LogicDocument.Pages[this.RecalcInfo.CurPage].Pos; 
        var SectPr = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
        var Bounds = this.Get_Bounds();
        
        // нужно обновить линейку
        if ( this.Type === hdrftr_Header )
        {
            this.DrawingDocument.Set_RulerState_HdrFtr( true, Bounds.Top, Math.max( Bounds.Bottom, ( orientation_Portrait === SectPr.Get_Orientation() ? SectPr.Get_PageMargin_Top() : SectPr.Get_PageMargin_Left() ) ) );
        }
        else
        {
            this.DrawingDocument.Set_RulerState_HdrFtr( false, Bounds.Top, ( orientation_Portrait === SectPr.Get_Orientation() ? SectPr.Get_PageHeight() : SectPr.Get_PageWidth() ) );
        }

        this.Content.Document_UpdateRulersState( this.Content.Get_StartPage_Absolute() );
    },

    Document_UpdateSelectionState : function()
    {
        if ( docpostype_DrawingObjects == this.Content.CurPos.Type )
        {
            return this.LogicDocument.DrawingObjects.documentUpdateSelectionState();
        }
        else //if ( docpostype_Content === this.Content.CurPos.Type )
        {
            // Если у нас есть выделение, тогда убираем курсор и рисуем выделение.
            // Если никакого выделения нет, тогда убираем его и восстанавливаем курсор.
            if ( true === this.Content.Is_SelectionUse() )
            {
                // Выделение нумерации
                if ( selectionflag_Numbering == this.Content.Selection.Flag )
                {
                    this.DrawingDocument.TargetEnd();
                    this.DrawingDocument.SelectEnabled(true);
                    this.DrawingDocument.SelectClear();
                    this.DrawingDocument.SelectShow();
                }
                // Обрабатываем движение границы у таблиц
                else if ( null != this.Content.Selection.Data && true === this.Content.Selection.Data.TableBorder && type_Table == this.Content.Content[this.Content.Selection.Data.Pos].GetType() )
                {
                    // Убираем курсор, если он был
                    this.DrawingDocument.TargetEnd();
                }
                else
                {
                    if ( false === this.Content.Selection_IsEmpty() )
                    {
                        this.DrawingDocument.TargetEnd();
                        this.DrawingDocument.SelectEnabled(true);
                        this.DrawingDocument.SelectClear();
                        this.DrawingDocument.SelectShow();
                    }
                    else
                    {
                        this.DrawingDocument.SelectEnabled(false);
                        this.RecalculateCurPos();

                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();
                    }
                }
            }
            else
            {
                this.DrawingDocument.SelectEnabled(false);
                this.RecalculateCurPos();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();
            }
        }
    },

//-----------------------------------------------------------------------------------
// Функции для работы с контентом
//-----------------------------------------------------------------------------------
    Add_NewParagraph : function()
    {
        this.Content.Add_NewParagraph();
    },

    Add_FlowImage : function(W, H, Img)
    {
        this.Content.Add_FlowImage(W,H,Img);
    },

    Add_InlineImage : function(W, H, Img, Chart, bFlow)
    {
        this.Content.Add_InlineImage(W,H,Img, Chart, bFlow);
    },

    Edit_Chart : function(Chart)
    {
        this.Content.Edit_Chart( Chart );
    },

    Add_InlineTable : function(Cols, Rows)
    {
        this.Content.Add_InlineTable( Cols, Rows );
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        this.Content.Paragraph_Add( ParaItem, bRecalculate );
    },

    Paragraph_ClearFormatting : function()
    {
        this.Content.Paragraph_ClearFormatting();
    },

    Paragraph_Format_Paste : function(TextPr, ParaPr, ApplyPara)
    {
        this.Content.Paragraph_Format_Paste( TextPr, ParaPr, ApplyPara );
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        this.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
    },

    Cursor_GetPos : function()
    {
        return this.Content.Cursor_GetPos();
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        var bRetValue = this.Content.Cursor_MoveLeft( AddToSelect, Word );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        var bRetValue = this.Content.Cursor_MoveRight( AddToSelect, Word );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveUp( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveDown( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveEndOfLine( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveStartOfLine( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveToStartPos : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveToStartPos( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveToEndPos : function(AddToSelect)
    {
        var bRetValue = this.Content.Cursor_MoveToEndPos( AddToSelect );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();

        return bRetValue;
    },

    Cursor_MoveAt : function( X, Y, PageIndex, AddToSelect, bRemoveOldSelection )
    {
        this.Set_Page( PageIndex );
        return this.Content.Cursor_MoveAt( X, Y, AddToSelect, bRemoveOldSelection );
    },

    Cursor_MoveToCell : function(bNext)
    {
        this.Content.Cursor_MoveToCell(bNext);
    },

    Set_ParagraphAlign : function(Align)
    {
        return this.Content.Set_ParagraphAlign( Align );
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        return this.Content.Set_ParagraphSpacing( Spacing );
    },

    Set_ParagraphIndent : function(Ind)
    {
        return this.Content.Set_ParagraphIndent( Ind );
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        return this.Content.Set_ParagraphNumbering( NumInfo );
    },

    Set_ParagraphShd : function(Shd)
    {
        return this.Content.Set_ParagraphShd( Shd );
    },

    Set_ParagraphStyle : function(Name)
    {
        return this.Content.Set_ParagraphStyle( Name );
    },

    Set_ParagraphTabs : function(Tabs)
    {
        return this.Content.Set_ParagraphTabs( Tabs );
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        return this.Content.Set_ParagraphContextualSpacing( Value );
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        return this.Content.Set_ParagraphPageBreakBefore( Value );
    },

    Set_ParagraphKeepLines : function(Value)
    {
        return this.Content.Set_ParagraphKeepLines( Value );
    },

    Set_ParagraphKeepNext : function(Value)
    {
        return this.Content.Set_ParagraphKeepNext( Value );
    },

    Set_ParagraphWidowControl : function(Value)
    {
        return this.Content.Set_ParagraphWidowControl( Value );
    },

    Set_ParagraphBorders : function(Value)
    {
        return this.Content.Set_ParagraphBorders( Value );
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        return this.Content.Paragraph_IncDecFontSize(bIncrease);
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        return this.Content.Paragraph_IncDecIndent(bIncrease);
    },

    Set_ImageProps : function(Props)
    {
        return this.Content.Set_ImageProps( Props );
    },

    Set_TableProps : function(Props)
    {
        return this.Content.Set_TableProps( Props );
    },

    Get_Paragraph_ParaPr : function()
    {
        return this.Content.Get_Paragraph_ParaPr();
    },

    Get_Paragraph_TextPr : function()
    {
        return this.Content.Get_Paragraph_TextPr();
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        return this.Content.Get_Paragraph_TextPr_Copy();
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        return this.Content.Get_Paragraph_ParaPr_Copy();
    },

    Get_AllParagraphs_ByNumbering : function(NumPr, ParaArray)
    {
        return this.Content.Get_AllParagraphs_ByNumbering( NumPr, ParaArray );
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        return null;
    },

    // Убираем селект
    Selection_Remove : function()
    {
        return this.Content.Selection_Remove();
    },

    // Рисуем селект
    Selection_Draw_Page : function(Page_abs)
    {
        return this.Content.Selection_Draw_Page(Page_abs, true, true);
    },

    Selection_Clear : function()
    {
        return this.Content.Selection_Clear();
    },

    Selection_SetStart : function(X,Y, PageIndex, MouseEvent)
    {
        this.Set_Page( PageIndex );

        if ( true === editor.isStartAddShape )
        {
            this.Content.CurPos.Type = docpostype_DrawingObjects;
            this.Content.Selection.Use   = true;
            this.Content.Selection.Start = true;

            if ( true != this.LogicDocument.DrawingObjects.isPolylineAddition() )
                this.LogicDocument.DrawingObjects.startAddShape( editor.addShapePreset );

            this.LogicDocument.DrawingObjects.OnMouseDown(MouseEvent, X, Y, PageIndex);
        }
        else
            return this.Content.Selection_SetStart( X, Y, PageIndex, MouseEvent );
    },

    Selection_SetEnd : function(X, Y, PageIndex, MouseEvent)
    {
        this.Set_Page( PageIndex );
        return this.Content.Selection_SetEnd(X, Y, PageIndex, MouseEvent);
    },

    Selection_Is_TableBorderMove : function()
    {
        return this.Content.Selection_Is_TableBorderMove();
    },

    Selection_Check : function(X, Y, Page_Abs, NearPos)
    {
        var HdrFtrPage = this.Content.Get_StartPage_Absolute();
        if ( HdrFtrPage === Page_Abs  )
            return this.Content.Selection_Check( X, Y, Page_Abs, NearPos );

        return false;
    },

    // Селектим весь параграф
    Select_All : function()
    {
        return this.Content.Select_All();
    },

    Get_CurrentParagraph : function()
    {
        return this.Content.Get_CurrentParagraph();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return 0;
    },

    Get_StartPage_Relative : function()
    {
        return 0;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        this.Content.Table_AddRow( bBefore );
        this.Recalculate();
    },

    Table_AddCol : function(bBefore)
    {
        this.Content.Table_AddCol( bBefore );
        this.Recalculate();
    },

    Table_RemoveRow : function()
    {
        this.Content.Table_RemoveRow();
        this.Recalculate();
    },

    Table_RemoveCol : function()
    {
        this.Content.Table_RemoveCol();
        this.Recalculate();
    },

    Table_MergeCells : function()
    {
        this.Content.Table_MergeCells();
        this.Recalculate();
    },

    Table_SplitCell : function( Cols, Rows )
    {
        this.Content.Table_SplitCell( Cols, Rows );
        this.Recalculate();
    },

    Table_RemoveTable : function()
    {
        this.Content.Table_RemoveTable();
        this.Recalculate();
    },

    Table_Select : function(Type)
    {
        this.Content.Table_Select(Type);
    },

    Table_CheckMerge : function()
    {
        return this.Content.Table_CheckMerge();
    },

    Table_CheckSplit : function()
    {
        return this.Content.Table_CheckSplit();
    },

    Check_TableCoincidence : function(Table)
    {
        return false;
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------    
    Get_ParentObject_or_DocumentPos : function()
    {
        return { Type : historyrecalctype_HdrFtr, Data : this };
    },

    Refresh_RecalcData : function(Data)
    {
        this.Refresh_RecalcData2();
    },

    Refresh_RecalcData2 : function()
    {
        // Сохраняем пересчитаные страницы в старый пересчет, а текущий обнуляем
        this.RecalcInfo.NeedRecalc = {};
        this.RecalcInfo.SectPr     = {};
        this.RecalcInfo.CurPage    = -1;
        
        History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this } );
    },
    
    Refresh_RecalcData_BySection : function(SectPr)
    {
        // Найдем среди пересчитанных страниц те, которые пересчитывались в заданной секции,
        // и среди них найдем ключ с наименьшим номером. Далее, отметим все страницы с номером большим, чем найденный,
        // как не пересчитанные.
        
        var MinPageIndex = -1;
        for ( var PageIndex in this.RecalcInfo.NeedRecalc )
        {
            if ( SectPr === this.RecalcInfo.SectPr[PageIndex] && ( -1 === MinPageIndex || PageIndex < MinPageIndex ) )
                MinPageIndex = PageIndex;                
        }
        
        for ( var PageIndex in this.RecalcInfo.NeedRecalc )
        {
            if ( PageIndex >= MinPageIndex )
            {
                delete this.RecalcInfo.NeedRecalc[PageIndex];
                delete this.RecalcInfo.SectPr[PageIndex];                    
            }
        }
    },
//-----------------------------------------------------------------------------------
// Поиск
//-----------------------------------------------------------------------------------
    DocumentSearch : function(SearchString, Type)
    {
        this.Content.DocumentSearch( SearchString, Type );
    },
//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        this.Content.Hyperlink_Add(HyperProps);
    },

    Hyperlink_Modify : function(HyperProps)
    {
        this.Content.Hyperlink_Modify(HyperProps);
    },

    Hyperlink_Remove : function()
    {
        this.Content.Hyperlink_Remove();
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        return this.Content.Hyperlink_CanAdd(bCheckInHyperlink);
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        return this.Content.Hyperlink_Check(bCheckEnd);
    },
//-----------------------------------------------------------------------------------
// Функции для работы с генерацией карты шрифтов
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function(FontMap)
    {
        this.Content.Document_CreateFontMap(FontMap);
    },

    Document_CrateFontCharMap : function(FontCharMap)
    {
        this.Content.Document_CreateFontCharMap( FontCharMap );
    },

    Document_Get_AllFontNames : function(AllFonts)
    {
        this.Content.Document_Get_AllFontNames(AllFonts);
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_HdrFtr );

        // String   : Id
        // Long     : Type
        // Double   : BoundY
        // Double   : BoundY2
        // String   : Content Id

        Writer.WriteString2( this.Id );
        Writer.WriteLong( this.Type );
        Writer.WriteDouble( this.BoundY );
        Writer.WriteDouble( this.BoundY2 );
        Writer.WriteString2( this.Content.Get_Id() );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id
        // Long     : Type
        // Double   : BoundY
        // Double   : BoundY2
        // String   : Content Id

        var LogicDocument = editor.WordControl.m_oLogicDocument;

        this.Parent          = LogicDocument.HdrFtr;
        this.DrawingDocument = LogicDocument.DrawingDocument;
        this.LogicDocument   = LogicDocument;

        this.Id      = Reader.GetString2();
        this.Type    = Reader.GetLong();
        this.BoundY  = Reader.GetDouble();
        this.BoundY2 = Reader.GetDouble();

        this.Content = g_oTableId.Get_ById( Reader.GetString2() );        
    },

    Load_LinkData : function(LinkData)
    {
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(Comment)
    {
        this.Content.Add_Comment( Comment, true, true );
    },

    CanAdd_Comment : function()
    {
        return this.Content.CanAdd_Comment();
    }
}

//-----------------------------------------------------------------------------------
// Класс для работы с колонтитулами
//-----------------------------------------------------------------------------------
function CHeaderFooterController(LogicDocument, DrawingDocument)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.DrawingDocument = DrawingDocument;
    this.LogicDocument   = LogicDocument;

    // В контенте лежат все колонтитулы
    this.Content = new Array();
    this.Content[0] =
    {
        Header :
        {
            First : null,
            Even  : null,
            Odd   : null
        },

        Footer :
        {
            First : null,
            Even  : null,
            Odd   : null
        }
    };

    // Текущий колонтитул
    this.CurHdrFtr = null;

    this.Pages   = {};
    this.CurPage = 0;
    this.ChangeCurPageOnEnd = true;

    this.WaitMouseDown = true;

    this.Lock = new CLock();   

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CHeaderFooterController.prototype =
{
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с колонтитулами
//-----------------------------------------------------------------------------------

    AddHeaderOrFooter : function(Type, PageType)
    {
        this.LogicDocument.DrawingObjects.AddHeaderOrFooter( Type, PageType );

        var BoundY2 = Y_Default_Header;
        if ( Type === hdrftr_Footer )
            BoundY2 = Page_Height - Y_Default_Footer;

        var Content_old =
        {
            Header :
            {
                First : this.Content[0].Header.First,
                Even  : this.Content[0].Header.Even,
                Odd   : this.Content[0].Header.Odd
            },

            Footer :
            {
                First : this.Content[0].Footer.First,
                Even  : this.Content[0].Footer.Even,
                Odd   : this.Content[0].Footer.Odd
            }
        };

        var HdrFtr = new CHeaderFooter( this, this.LogicDocument, this.DrawingDocument, Type, BoundY2 );
        switch( Type )
        {
            case hdrftr_Footer:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        if ( null === this.Content[0].Footer.First )
                            this.Content[0].Footer.First = HdrFtr;

                        if ( null === this.Content[0].Footer.Even )
                            this.Content[0].Footer.Even  = HdrFtr;

                        this.Content[0].Footer.Odd   = HdrFtr;
                        break;
                    }
                    case hdrftr_Even :
                    {
                        this.Content[0].Footer.Even  = HdrFtr;

                        break;
                    }
                    case hdrftr_First :
                    {
                        this.Content[0].Footer.First  = HdrFtr;

                        break;
                    }
                }

                break;
            }
            case hdrftr_Header:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        if ( null === this.Content[0].Header.First )
                            this.Content[0].Header.First = HdrFtr;

                        if ( null === this.Content[0].Header.Even )
                            this.Content[0].Header.Even  = HdrFtr;

                        this.Content[0].Header.Odd   = HdrFtr;
                        break;
                    }
                    case hdrftr_Even :
                    {
                        this.Content[0].Header.Even  = HdrFtr;

                        break;
                    }
                    case hdrftr_First :
                    {
                        this.Content[0].Header.First  = HdrFtr;
                        break;
                    }
                }

                break;
            }
        }

        History.Add( this, { Type : historyitem_HdrFtrController_AddItem, Old : Content_old, New : this.Content[0] } );

        this.LogicDocument.Recalculate();

        this.CurHdrFtr = this.Internal_GetContentByXY( 0, 0, this.CurPage );
        this.CurHdrFtr.Cursor_MoveAt( 0, 0, this.CurPage, false, false );

        return HdrFtr;
    },

    RemoveHeaderOrFooter : function(Type, PageType)
    {
        this.LogicDocument.DrawingObjects.RemoveHeaderOrFooter( Type, PageType );

        var Content_old =
        {
            Header :
            {
                First : this.Content[0].Header.First,
                Even  : this.Content[0].Header.Even,
                Odd   : this.Content[0].Header.Odd
            },

            Footer :
            {
                First : this.Content[0].Footer.First,
                Even  : this.Content[0].Footer.Even,
                Odd   : this.Content[0].Footer.Odd
            }
        };

        switch( Type )
        {
            case hdrftr_Footer:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        var HdrFtr = this.Content[0].Footer.Odd;

                        if ( HdrFtr === this.Content[0].Footer.First )
                            this.Content[0].Footer.First = null;

                        if ( HdrFtr === this.Content[0].Footer.Even )
                            this.Content[0].Footer.Even = null;

                        this.Content[0].Footer.Odd = null;

                        break;
                    }
                    case hdrftr_Even :
                    {
                        if ( this.Content[0].Footer.Odd != this.Content[0].Footer.Even )
                            this.Content[0].Footer.Even = this.Content[0].Footer.Odd;

                        break;
                    }
                    case hdrftr_First :
                    {
                        if ( this.Content[0].Footer.Odd != this.Content[0].Footer.First )
                            this.Content[0].Footer.First  = this.Content[0].Footer.Odd;

                        break;
                    }
                }

                break;
            }
            case hdrftr_Header:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        var HdrFtr = this.Content[0].Header.Odd;

                        if ( HdrFtr === this.Content[0].Header.First )
                            this.Content[0].Header.First = null;

                        if ( HdrFtr === this.Content[0].Header.Even )
                            this.Content[0].Header.Even = null;

                        this.Content[0].Header.Odd = null;

                        break;
                    }
                    case hdrftr_Even :
                    {
                        if ( this.Content[0].Header.Odd != this.Content[0].Header.Even )
                        {
                            if ( this.Content[0].Header.Even === this.Content[0].Header.First )
                                this.Content[0].Header.First = this.Content[0].Header.Odd;

                            this.Content[0].Header.Even = this.Content[0].Header.Odd;
                        }

                        break;
                    }
                    case hdrftr_First :
                    {
                        if ( this.Content[0].Header.Odd != this.Content[0].Header.First )
                            this.Content[0].Header.First  = this.Content[0].Header.Odd;

                        break;
                    }
                }

                break;
            }
        }

        History.Add( this, { Type : historyitem_HdrFtrController_AddItem, Old : Content_old, New : this.Content[0] } );

        this.CurHdrFtr = this.Internal_GetContentByXY( 0, 0, this.CurPage );
        this.CurHdrFtr.Cursor_MoveAt( 0, 0, this.CurPage, false, false );

        this.LogicDocument.ContentLastChangePos = 0;
        this.LogicDocument.Recalculate();
    },

    AddPageNum : function(PageIndex, AlignV, AlignH)
    {
        // Номер страницы добавляется только в тот колонтитул, который соответствует текущей странице
        var bFirst = (0 === PageIndex ? true : false);
        var bEven  = (PageIndex  % 2 === 1 ? true : false); // 0, потому что нумерация начинается с 0, а не 1

        var Header = null;
        var Footer = null;

        if ( true === bFirst )
        {
            Header = this.Content[0].Header.First;
            Footer = this.Content[0].Footer.First;
        }
        else if ( true === bEven )
        {
            Header = this.Content[0].Header.Even;
            Footer = this.Content[0].Footer.Even;
        }
        else
        {
            Header = this.Content[0].Header.Odd;
            Footer = this.Content[0].Footer.Odd;
        }

        switch ( AlignV )
        {
            case hdrftr_Header:
            {
                if ( null === Header)
                {
                    // На странице нет колонтитула, значит колонтитулов вообще никаких пока нет
                    // Значит мы должны добавить стандартный(Default) колонтитул
                    Header = this.AddHeaderOrFooter( hdrftr_Header, hdrftr_Default );
                }

                Header.AddPageNum( AlignH );
                break;
            }
            case hdrftr_Footer:
            {
                if ( null === Footer)
                {
                    // На странице нет колонтитула, значит колонтитулов вообще никаких пока нет
                    // Значит мы должны добавить стандартный(Default) колонтитул
                    Footer = this.AddHeaderOrFooter( hdrftr_Footer, hdrftr_Default );
                }

                Footer.AddPageNum( AlignH );
                break;
            }
        }
    },

    Get_CurPage : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Content.Get_StartPage_Absolute();

        return 0;
    },

    // Получаем своства колонтитула для интерфейса
    Get_Props : function()
    {
        if ( null != this.CurHdrFtr && -1 !== this.CurHdrFtr.RecalcInfo.CurPage )
        {
            var Pr = new Object();
            Pr.Type = this.CurHdrFtr.Type;
            
            if ( undefined === this.LogicDocument.Pages[this.CurHdrFtr.RecalcInfo.CurPage] )
                return Pr;
            
            var Index  = this.LogicDocument.Pages[this.CurHdrFtr.RecalcInfo.CurPage].Pos;            
            var SectPr = this.LogicDocument.SectionsInfo.Get_SectPr( Index).SectPr;

            if ( hdrftr_Footer === Pr.Type )
                Pr.Position = SectPr.Get_PageMargins_Footer();
            else
                Pr.Position = SectPr.Get_PageMargins_Header();
            
            Pr.DifferentFirst   = SectPr.Get_TitlePage();
            Pr.DifferentEvenOdd = EvenAndOddHeaders;

            Pr.Locked = this.Lock.Is_Locked();

            return Pr;
        }
        else
            return null;
    },

    Set_CurHdrFtr_ById : function(Id)
    {
        if ( null != this.Content[0].Header.First && Id === this.Content[0].Header.First.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Header.First;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }
        else if ( null != this.Content[0].Header.Odd && Id === this.Content[0].Header.Odd.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Header.Odd;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }
        else if ( null != this.Content[0].Header.Even && Id === this.Content[0].Header.Even.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Header.Even;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }
        else if ( null != this.Content[0].Footer.First && Id === this.Content[0].Footer.First.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Footer.First;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }
        else if ( null != this.Content[0].Footer.Odd && Id === this.Content[0].Footer.Odd.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Footer.Odd;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }
        else if ( null != this.Content[0].Footer.Even && Id === this.Content[0].Footer.Even.Get_Id() )
        {
            this.CurHdrFtr = this.Content[0].Footer.Even;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        }

        return false;
    },

//-----------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------
    RecalculateCurPos : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.RecalculateCurPos();
    },

    Recalculate : function(PageIndex)    
    {
        // Определим четность страницы и является ли она первой в данной секции. Заметим, что четность страницы 
        // отсчитывается от начала текущей секции и не зависит от настроек нумерации страниц для данной секции.
        var FirstPage = this.LogicDocument.Get_SectionFirstPage( PageIndex );
        
        var bFirst = ( FirstPage === PageIndex ? true : false );
        var bEven  = ( 0 === ( ( PageIndex - FirstPage ) % 2 ) ? false : true ); // потому что у нас страницы с 0 нумеруются
        
        // Запросим нужный нам колонтитул 
        var HdrFtr = this.LogicDocument.Get_SectionHdrFtr( PageIndex, bFirst, bEven );
        
        var Header = HdrFtr.Header;
        var Footer = HdrFtr.Footer;
        var SectPr = HdrFtr.SectPr;

        this.Pages[PageIndex] = new CHdrFtrPage();
        this.Pages[PageIndex].Header = Header;
        this.Pages[PageIndex].Footer = Footer;
        
        var X, XLimit;
        
        var Orient = SectPr.Get_Orientation();
        if ( orientation_Portrait === Orient )
        {        
            X      = SectPr.Get_PageMargin_Left();
            XLimit = SectPr.Get_PageWidth() - SectPr.Get_PageMargin_Right();
        }
        else
        {
            X      = SectPr.Get_PageMargin_Bottom();
            XLimit = SectPr.Get_PageHeight() - SectPr.Get_PageMargin_Top();
        }
        
        var bRecalcHeader = false;
        
        // Рассчитываем верхний колонтитул
        if ( null !== Header )
        {
            if ( true === Header.Is_NeedRecalculate( PageIndex ) )
            {
                var Y      = SectPr.Get_PageMargins_Header();
                var YLimit = (orientation_Portrait === Orient ? SectPr.Get_PageHeight() / 2 : SectPr.Get_PageWidth() / 2);

                Header.Reset( X, Y, XLimit, YLimit );
                bRecalcHeader = Header.Recalculate(PageIndex);
            }
            else 
            {
                if ( -1 === Header.RecalcInfo.CurPage )
                    Header.Set_Page(PageIndex);
            }
        }
        
        var bRecalcFooter = false;
        
        // Рассчитываем нижний колонтитул
        if ( null !== Footer )
        {
            if ( true === Footer.Is_NeedRecalculate( PageIndex ) )
            {
                // Нижний колонтитул рассчитываем 2 раза. Сначала, с 0 позиции, чтобы рассчитать суммарную высоту колонитула.
                // Исходя из уже известной высоты располагаем и рассчитываем колонтитул.

                var Y      = 0;
                var YLimit = (orientation_Portrait === Orient ? SectPr.Get_PageHeight() : SectPr.Get_PageWidth() );

                Footer.Reset( X, Y, XLimit, YLimit );
                Footer.Recalculate2(PageIndex);

                var SummaryHeight = Footer.Content.Get_SummaryHeight();
                Y = Math.max( 2 * YLimit / 3, YLimit - SectPr.Get_PageMargins_Footer() - SummaryHeight );

                Footer.Reset( X, Y, XLimit, YLimit );
                bRecalcFooter = Footer.Recalculate(PageIndex);
            }
            else
            {
                if ( -1 === Footer.RecalcInfo.CurPage )
                    Footer.Set_Page(PageIndex);
            }
        }
        
        if ( true === bRecalcHeader || true === bRecalcFooter )
            return true;
        
        return false;
    },

    Reset_RecalculateCache : function()
    {
        if ( null != this.Content[0].Header.First )
        {
            this.Content[0].Header.First.Reset_RecalculateCache();
        }

        if ( null != this.Content[0].Header.Odd && this.Content[0].Header.Odd !== this.Content[0].Header.First )
        {
            this.Content[0].Header.Odd.Reset_RecalculateCache();
        }

        if ( null != this.Content[0].Header.Even && this.Content[0].Header.Even !== this.Content[0].Header.Odd && this.Content[0].Header.Even != this.Content[0].Header.First )
        {
            this.Content[0].Header.Even.Reset_RecalculateCache();
        }

        if ( null != this.Content[0].Footer.First )
        {
            this.Content[0].Footer.First.Reset_RecalculateCache();
        }

        if ( null != this.Content[0].Footer.Odd && this.Content[0].Footer.Odd !== this.Content[0].Footer.First )
        {
            this.Content[0].Footer.Odd.Reset_RecalculateCache();
        }

        if ( null != this.Content[0].Footer.Even && this.Content[0].Footer.Even !== this.Content[0].Footer.Odd && this.Content[0].Footer.Even != this.Content[0].Footer.First )
        {
            this.Content[0].Footer.Even.Reset_RecalculateCache();
        }
    },

    // Отрисовка колонтитулов на данной странице
    Draw : function(nPageIndex, pGraphics)
    {
        var Header = this.Pages[nPageIndex].Header;
        var Footer = this.Pages[nPageIndex].Footer;
        
        if ( null !== Header )
            Header.Draw( nPageIndex, pGraphics );

        if ( null !== Footer )
            Footer.Draw( nPageIndex, pGraphics );
    },

    CheckRange : function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageIndex)
    {
        var bFirst = (0 === PageIndex ? true : false);
        var bEven  = (PageIndex  % 2 === 1 ? true : false); // 0, потому что нумерация начинается с 0, а не 1

        var Header = null;
        var Footer = null;

        if ( true === bFirst )
        {
            Header = this.Content[0].Header.First;
            Footer = this.Content[0].Footer.First;
        }
        else if ( true === bEven )
        {
            Header = this.Content[0].Header.Even;
            Footer = this.Content[0].Footer.Even;

        }
        else
        {
            Header = this.Content[0].Header.Odd;
            Footer = this.Content[0].Footer.Odd;
        }

        var HeaderRange = [];
        var FooterRange = [];

        if ( null != Header )
            HeaderRange = Header.CheckRange( X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf );

        if ( null != Footer )
            FooterRange = Footer.CheckRange( X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf );

        return HeaderRange.concat( FooterRange );
    },

    // Запрашиваем низ у верхнего колонтитула для данной страницы
    Get_HdrFtrLines : function(PageIndex)
    {
        var Header = null;
        var Footer = null;
        
        if ( undefined !== this.Pages[PageIndex] )
        {
            Header = this.Pages[PageIndex].Header;
            Footer = this.Pages[PageIndex].Footer;
        }
        
        var Top = null; 
        if ( null !== Header )
            Top = Header.Get_DividingLine(PageIndex);
        
        var Bottom = null;
        if ( null !== Footer )
            Bottom = Footer.Get_DividingLine(PageIndex);
        
        return { Top : Top, Bottom : Bottom };
    },

    Update_CursorType : function( X, Y, PageNum_Abs )
    {
        if ( true === this.Lock.Is_Locked() )
        {
            var PageLimits = this.LogicDocument.Get_PageContentStartPos( PageNum_Abs );

            var MMData_header = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( PageLimits.X, PageLimits.Y, PageNum_Abs );
            MMData_header.X_abs            = Coords.X;
            MMData_header.Y_abs            = Coords.Y + 2;
            MMData_header.Type             = c_oAscMouseMoveDataTypes.LockedObject;
            MMData_header.UserId           = this.Lock.Get_UserId();
            MMData_header.HaveChanges      = this.Lock.Have_Changes();
            MMData_header.LockedObjectType = c_oAscMouseMoveLockedObjectType.Header;
            editor.sync_MouseMoveCallback( MMData_header );

            var MMData_footer = new CMouseMoveData();
            Coords = this.DrawingDocument.ConvertCoordsToCursorWR( PageLimits.X, PageLimits.YLimit, PageNum_Abs );
            MMData_footer.X_abs            = Coords.X;
            MMData_footer.Y_abs            = Coords.Y - 2;
            MMData_footer.Type             = c_oAscMouseMoveDataTypes.LockedObject;
            MMData_footer.UserId           = this.Lock.Get_UserId();
            MMData_footer.HaveChanges      = this.Lock.Have_Changes();
            MMData_footer.LockedObjectType = c_oAscMouseMoveLockedObjectType.Footer;
            editor.sync_MouseMoveCallback( MMData_footer );
        }

        // TODO: Сделать выбор в зависимости колонтитула от номера страница PageNum_Abs
        if ( null != this.CurHdrFtr )
        {
            // Если мы попадаем в заселекченную автофигуру, пусть она даже выходит за пределы
            if ( true === this.LogicDocument.DrawingObjects.pointInSelectedObject(X, Y, PageNum_Abs) )
            {
                var NewPos = this.DrawingDocument.ConvertCoordsToAnotherPage(X, Y, PageNum_Abs, this.CurPage);
                var _X = NewPos.X;
                var _Y = NewPos.Y;
                return this.CurHdrFtr.Update_CursorType( _X, _Y, this.CurPage );
            }
            else
                return this.CurHdrFtr.Update_CursorType( X, Y, PageNum_Abs );
        }
    },

    Is_TableBorder : function( X, Y, PageNum_Abs )
    {
        var HdrFtr = this.Internal_GetContentByXY( X, Y, PageNum_Abs );
        if ( null != HdrFtr )
            return HdrFtr.Is_TableBorder( X, Y, PageNum_Abs );

        return null;
    },

    Is_InText : function(X,Y, PageNum_Abs)
    {
        var HdrFtr = this.Internal_GetContentByXY( X, Y, PageNum_Abs );
        if ( null != HdrFtr )
            return HdrFtr.Is_InText( X, Y, PageNum_Abs );

        return null;
    },

    Is_InDrawing : function(X,Y, PageNum_Abs)
    {
        var HdrFtr = this.Internal_GetContentByXY( X, Y, PageNum_Abs );
        if ( null != HdrFtr )
            return HdrFtr.Is_InDrawing( X, Y, PageNum_Abs );

        return null;
    },

    Document_UpdateInterfaceState : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Document_UpdateInterfaceState();
    },

    Document_UpdateRulersState : function(CurPage)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Document_UpdateRulersState(CurPage);
    },

    Document_UpdateSelectionState : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Document_UpdateSelectionState();
    },

    Is_SelectionUse : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Is_SelectionUse();

        return false;
    },

    Is_TextSelectionUse : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Is_TextSelectionUse();

        return false;
    },

    Is_UseInDocument : function(Id)
    {
        if ( null != this.Content[0].Header.First && Id === this.Content[0].Header.First.Get_Id() )
            return true;

        if ( null != this.Content[0].Header.Even && Id === this.Content[0].Header.Even.Get_Id() )
            return true;

        if ( null != this.Content[0].Header.Odd && Id === this.Content[0].Header.Odd.Get_Id() )
            return true;

        if ( null != this.Content[0].Footer.First && Id === this.Content[0].Footer.First.Get_Id() )
            return true;

        if ( null != this.Content[0].Footer.Even && Id === this.Content[0].Footer.Even.Get_Id() )
            return true;

        if ( null != this.Content[0].Footer.Odd && Id === this.Content[0].Footer.Odd.Get_Id() )
            return true;

        return false;
    },

    Check_Page : function(HdrFtr, PageIndex)
    {
        var bHeader = (HdrFtr.Type === hdrftr_Header ? true : false);
        var bFirst  = (0 === PageIndex ? true : false);
        var bEven   = (PageIndex  % 2 === 1 ? true : false); // 0, потому что нумерация начинается с 0, а не 1

        if ( true === bFirst )
        {
            if ( ( true === bHeader && HdrFtr === this.Content[0].Header.First ) || ( true != bHeader && HdrFtr === this.Content[0].Footer.First ) )
                return true;
        }
        else if ( true === bEven )
        {
            if ( ( true === bHeader && HdrFtr === this.Content[0].Header.Even ) || ( true != bHeader && HdrFtr === this.Content[0].Footer.Even ) )
                return true;
        }
        else
        {
            if ( ( true === bHeader && HdrFtr === this.Content[0].Header.Odd ) || ( true != bHeader && HdrFtr === this.Content[0].Footer.Odd ) )
                return true;
        }

        return false;
    },

    Get_CurPosXY : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_CurPosXY();

        return { X : 0, Y : 0 };
    },

    Get_SelectedText : function(bClearText)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_SelectedText(bClearText);

        return null;
    },

    Get_SelectedElementsInfo : function(Info)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Get_SelectedElementsInfo(Info);
    },

    Get_SelectedContent : function(SelectedContent)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Get_SelectedContent( SelectedContent );
    },

//-----------------------------------------------------------------------------------
// Функции для работы с контентом
//-----------------------------------------------------------------------------------
    Add_NewParagraph : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Add_NewParagraph();
    },

    Add_FlowImage : function(W, H, Img)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Add_FlowImage(W,H,Img);
    },

    Add_InlineImage : function(W, H, Img, Chart, bFlow)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Add_InlineImage(W,H,Img, Chart, bFlow);
    },

    Edit_Chart : function(Chart)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Edit_Chart( Chart );
    },

    Add_InlineTable : function(Cols, Rows)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Add_InlineTable( Cols, Rows );
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        // PageBreak убираем из колонтитула
        if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
            return;

        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Paragraph_Add( ParaItem, bRecalculate );
    },

    Paragraph_ClearFormatting : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Paragraph_ClearFormatting();
    },

    Paragraph_Format_Paste : function(TextPr, ParaPr, ApplyPara)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Paragraph_Format_Paste( TextPr, ParaPr, ApplyPara );
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
    },

    Cursor_GetPos : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_GetPos();
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveLeft( AddToSelect, Word );
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveRight( AddToSelect, Word );
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveUp( AddToSelect );
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveDown( AddToSelect );
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveEndOfLine( AddToSelect );
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveStartOfLine( AddToSelect );
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveAt( X, Y, AddToSelect );
    },

    Cursor_MoveToStartPos : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveToStartPos( AddToSelect );
    },

    Cursor_MoveToEndPos : function(AddToSelect)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Cursor_MoveToEndPos( AddToSelect );
    },

    Cursor_MoveToCell : function(bNext)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Cursor_MoveToCell(bNext);
    },

    Set_ParagraphAlign : function(Align)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphAlign( Align );
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphSpacing( Spacing );
    },

    Set_ParagraphIndent : function(Ind)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphIndent( Ind );
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphNumbering( NumInfo );
    },

    Set_ParagraphShd : function(Shd)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphShd( Shd );
    },

    Set_ParagraphStyle : function(Name)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphStyle( Name );
    },

    Set_ParagraphTabs : function(Tabs)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphTabs( Tabs );
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphContextualSpacing( Value );
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphPageBreakBefore( Value );
    },

    Set_ParagraphKeepLines : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphKeepLines( Value );
    },

    Set_ParagraphKeepNext : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphKeepNext( Value );
    },

    Set_ParagraphWidowControl : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphWidowControl( Value );
    },

    Set_ParagraphBorders : function(Value)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ParagraphBorders( Value );
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Paragraph_IncDecFontSize(bIncrease);
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Paragraph_IncDecIndent(bIncrease);
    },

    Set_ImageProps : function(Props)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_ImageProps( Props );
    },

    Set_TableProps : function(Props)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Set_TableProps( Props );
    },

    Get_Paragraph_ParaPr : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_Paragraph_ParaPr();
    },

    Get_Paragraph_TextPr : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_Paragraph_TextPr();
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_Paragraph_TextPr_Copy();

        return null;
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Get_Paragraph_ParaPr_Copy();

        return null;
    },

    Get_AllParagraphs_ByNumbering : function(NumPr, ParaArray)
    {
        var SectHdrFtr = this.Content[0];
        var Headers = SectHdrFtr.Header;
        var Footers = SectHdrFtr.Footer;

        if ( Headers.First != Headers.Odd && Headers.First != Headers.Even && null != Headers.First )
            Headers.First.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        if ( Headers.Even != Headers.Odd && null != Headers.Even )
            Headers.Even.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        if ( null != Headers.Odd )
            Headers.Odd.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        if ( Footers.First != Footers.Odd && Footers.First != Footers.Even && null != Footers.First )
            Footers.First.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        if ( Footers.Even != Footers.Odd && null != Footers.Even )
            Footers.Even.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        if ( null != Footers.Odd )
            Footers.Odd.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
    },

    // Убираем селект
    Selection_Remove : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Selection_Remove();
    },

    // Рисуем селект
    Selection_Draw_Page : function(Page_abs)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Selection_Draw_Page(Page_abs);
    },

    Selection_Clear : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Selection_Clear();
    },

    Selection_SetStart : function(X,Y, PageIndex, MouseEvent, bActivate)
    {
        // Если мы попадаем в заселекченную автофигуру, пусть она даже выходит за пределы
        if ( true === this.LogicDocument.DrawingObjects.pointInSelectedObject(X, Y, PageIndex) )
        {
            var NewPos = this.DrawingDocument.ConvertCoordsToAnotherPage(X, Y, PageIndex, this.CurPage);
            var _X = NewPos.X;
            var _Y = NewPos.Y;
            this.CurHdrFtr.Selection_SetStart( _X, _Y, this.CurPage, MouseEvent );
            this.ChangeCurPageOnEnd = false;

            this.WaitMouseDown = false;

            return true;
        }

        this.ChangeCurPageOnEnd = true;

        var OldPage = this.CurPage;

        // Сначала проверяем, не попали ли мы в контент документа. Если да, тогда надо
        // активировать работу с самим документом (просто вернуть false здесь)

        var TempHdrFtr = null;
        var PageMetrics = this.LogicDocument.Get_PageContentStartPos( PageIndex );
        
        if ( MouseEvent.ClickCount >= 2 && true != editor.isStartAddShape &&
            !( Y <= PageMetrics.Y      || ( null !== ( TempHdrFtr = this.Pages[PageIndex].Header ) && true === TempHdrFtr.Is_PointInDrawingObjects( X, Y ) ) ) &&
            !( Y >= PageMetrics.YLimit || ( null !== ( TempHdrFtr = this.Pages[PageIndex].Footer ) && true === TempHdrFtr.Is_PointInDrawingObjects( X, Y ) ) ) )
        {
            // Убираем селект, если он был
            if ( null != this.CurHdrFtr )
            {
                this.CurHdrFtr.Selection_Remove();
            }

            MouseEvent.ClickCount = 1;
            return false;
        }

        this.CurPage = PageIndex;

        var HdrFtr = null;

        // Проверяем попали ли мы в колонтитул, если он есть. Если мы попали в
        // область колонтитула, а его там нет, тогда добавим новый колонтитул.
        if ( Y <= PageMetrics.Y || ( null !== ( TempHdrFtr = this.Pages[PageIndex].Header ) && true === TempHdrFtr.Is_PointInDrawingObjects( X, Y ) ) || true === editor.isStartAddShape )
        {
            if ( null === this.Pages[PageIndex].Header )
            {
                if ( false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
                {
                    // Меняем старый режим редактирования, чтобы при Undo/Redo возвращаться в режим редактирования документа
                    this.LogicDocument.CurPos.Type = docpostype_Content;
                    History.Create_NewPoint();
                    this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                    HdrFtr = this.LogicDocument.Create_SectionHdrFtr( hdrftr_Header, PageIndex );
                    this.LogicDocument.Recalculate();
                }
                else
                    return false;
            }
            else
                HdrFtr = this.Pages[PageIndex].Header;
        }
        else if ( Y >= PageMetrics.YLimit || ( null !== ( TempHdrFtr = this.Pages[PageIndex].Footer ) && true === TempHdrFtr.Is_PointInDrawingObjects( X, Y ) ) )
        {
            if ( null === this.Pages[PageIndex].Footer )
            {
                if ( false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
                {
                    // Меняем старый режим редактирования, чтобы при Undo/Redo возвращаться в режим редактирования документа
                    this.LogicDocument.CurPos.Type = docpostype_Content;
                    History.Create_NewPoint();
                    this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                    HdrFtr = this.LogicDocument.Create_SectionHdrFtr( hdrftr_Footer, PageIndex );
                    this.LogicDocument.Recalculate();
                }
                else
                    return false;
            }
            else
                HdrFtr = this.Pages[PageIndex].Footer;
        }

        if ( null === HdrFtr )
        {
            // Ничего не делаем и отключаем дальнейшую обработку MouseUp и MouseMove
            this.WaitMouseDown = true;

            return true;
        }
        else
        {
            this.WaitMouseDown = false;
        }

        // В зависимости от страницы и позиции на странице мы активируем(делаем текущим)
        // соответствующий колонтитул

        var OldHdrFtr = this.CurHdrFtr;
        this.CurHdrFtr = HdrFtr;

        if ( null != OldHdrFtr && (OldHdrFtr != this.CurHdrFtr || OldPage != this.CurPage) )
        {
            // Удаляем селект, если он был на предыдущем колонтитуле
            OldHdrFtr.Selection_Remove();
        }

        if ( null != this.CurHdrFtr )
        {
            this.CurHdrFtr.Selection_SetStart( X, Y, PageIndex, MouseEvent );
            if ( true === bActivate )
            {
                var NewMouseEvent = new Object();
                NewMouseEvent.Type       = g_mouse_event_type_up;
                NewMouseEvent.ClickCount = 1;
                this.CurHdrFtr.Selection_SetEnd( X, Y, PageIndex, NewMouseEvent );
            }
        }

        return true;
    },

    Selection_SetEnd : function(X, Y, PageIndex, MouseEvent)
    {
        if ( true === this.WaitMouseDown )
            return;

        if ( null != this.CurHdrFtr )
        {
            // Селект может происходить только внутри одного колонтитула, а колонтитул
            // не может быть разбит на несколько страниц
            var ResY = Y;

            if ( docpostype_DrawingObjects != this.CurHdrFtr.Content.CurPos.Type )
            {
                if ( PageIndex > this.CurPage )
                    ResY = this.LogicDocument.Get_PageLimits(this.CurPage).YLimit + 10;
                else if ( PageIndex < this.CurPage )
                    ResY = -10;

                PageIndex = this.CurPage;
            }

            this.CurHdrFtr.Selection_SetEnd(X, ResY, PageIndex, MouseEvent);

            if ( false === this.ChangeCurPageOnEnd )
            {
                this.CurHdrFtr.Set_Page( this.CurPage );
            }
        }
    },

    Selection_Is_TableBorderMove : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Selection_Is_TableBorderMove();

        return false;
    },

    Selection_Check : function(X, Y, Page_Abs, NearPos)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Selection_Check( X, Y, Page_Abs, NearPos );
    },

    // Селектим весь параграф
    Select_All : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Select_All();
    },

    Get_NearestPos : function(PageNum, X, Y, bAnchor, Drawing)
    {
        var HdrFtr = this.Internal_GetContentByXY( X, Y, PageNum );
        if ( null != HdrFtr )
            return HdrFtr.Get_NearestPos( X, Y, bAnchor, Drawing );
        else
            return { X : -1, Y : -1, Height : -1 };
    },

    Get_CurrentParagraph : function()
    {
        return this.CurHdrFtr.Get_CurrentParagraph();
    },
//-----------------------------------------------------------------------------------
// Внутренние(вспомогательные) функции
//-----------------------------------------------------------------------------------

    // Возвращаем колонтитул по данной позиции
    Internal_GetContentByXY : function( X, Y, PageIndex )
    {
        var Header = null;
        var Footer = null;

        if ( undefined !== this.Pages[PageIndex] )
        {
            Header = this.Pages[PageIndex].Header;
            Footer = this.Pages[PageIndex].Footer;
        }
        
        var PageH = this.LogicDocument.Get_PageLimits( PageIndex).YLimit;

        if ( Y <= PageH / 2 && null != Header )
            return Header;
        else if ( Y >= PageH / 2 && null != Footer )
            return Footer;
        else if ( null != Header )
            return Header;
        else
            return Footer;

        return null;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_AddRow( bBefore );
    },

    Table_AddCol : function(bBefore)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_AddCol( bBefore );
    },

    Table_RemoveRow : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_RemoveRow();
    },

    Table_RemoveCol : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_RemoveCol();
    },

    Table_MergeCells : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_MergeCells();
    },

    Table_SplitCell : function( Cols, Rows )
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_SplitCell( Cols, Rows );
    },

    Table_RemoveTable : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_RemoveTable();
    },

    Table_Select : function(Type)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Table_Select(Type);
    },

    Table_CheckMerge : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Table_CheckMerge();
    },

    Table_CheckSplit : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Table_CheckSplit();
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Get_SelectionState : function()
    {
        var HdrFtrState = new Object();
        HdrFtrState.CurHdrFtr = this.CurHdrFtr;

        var State = null;
        if ( null != this.CurHdrFtr )
            State = this.CurHdrFtr.Content.Get_SelectionState();
        else
            State = new Array();

        State.push( HdrFtrState );

        return State;
    },

    Set_SelectionState : function(State, StateIndex)
    {
        if ( State.length <= 0 )
            return;

        var HdrFtrState = State[StateIndex];
        this.CurHdrFtr = HdrFtrState.CurHdrFtr;

        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Content.Set_SelectionState(State, StateIndex - 1);
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_HdrFtrController_AddItem:
            {
                this.Content[0] = Data.Old;
                break;
            }

            case historyitem_HdrFtrController_RemoveItem:
            {
                this.Content[0] = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_HdrFtrController_AddItem:
            {
                this.Content[0] = Data.New;
                break;
            }

            case historyitem_HdrFtrController_RemoveItem:
            {
                this.Content[0] = Data.New;
                break;
            }
        }
    },

    Refresh_RecalcData : function(Data)
    {
        // При любых изменениях пересчитываем все колонтитулы

        if ( null != this.Content[0].Header.First )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Header.First } );

        if ( null != this.Content[0].Header.Even )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Header.Even } );

        if ( null != this.Content[0].Header.Odd )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Header.Odd } );

        if ( null != this.Content[0].Footer.First )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Footer.First } );

        if ( null != this.Content[0].Footer.Even )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Footer.Even } );

        if ( null != this.Content[0].Footer.Odd )
            History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.Content[0].Footer.Odd } );
    },
//-----------------------------------------------------------------------------------
// Поиск
//-----------------------------------------------------------------------------------
    DocumentSearch : function(SearchString)
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
                this.Content[0].Header.First.DocumentSearch( SearchString, search_Header | search_HdrFtr_First  );

            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.DocumentSearch( SearchString, search_Header | search_HdrFtr_Even );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.DocumentSearch( SearchString, search_Header | search_HdrFtr_Odd_no_First );
        }
        else if ( true === bHdr_even )
        {
            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.DocumentSearch( SearchString, search_Header | search_HdrFtr_Even );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.DocumentSearch( SearchString, search_Header | search_HdrFtr_Odd );
        }
        else if ( true === bHdr_first )
        {
            if ( null != this.Content[0].Header.First )
                this.Content[0].Header.First.DocumentSearch( SearchString, search_Header | search_HdrFtr_First );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.DocumentSearch( SearchString, search_Header | search_HdrFtr_All_no_First );
        }
        else
        {
            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.DocumentSearch( SearchString, search_Header | search_HdrFtr_All );
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
                this.Content[0].Footer.First.DocumentSearch( SearchString, search_Footer | search_HdrFtr_First );

            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.DocumentSearch( SearchString, search_Footer | search_HdrFtr_Even );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.DocumentSearch( SearchString, search_Footer | search_HdrFtr_Odd_no_First );
        }
        else if ( true === bFtr_even )
        {
            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.DocumentSearch( SearchString, search_Footer | search_HdrFtr_Even );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.DocumentSearch( SearchString, search_Footer | search_HdrFtr_Odd );
        }
        else if ( true === bFtr_first )
        {
            if ( null != this.Content[0].Footer.First )
                this.Content[0].Footer.First.DocumentSearch( SearchString, search_Footer | search_HdrFtr_First );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.DocumentSearch( SearchString, search_Footer | search_HdrFtr_All_no_First );
        }
        else
        {
            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.DocumentSearch( SearchString, search_Footer | search_HdrFtr_All );
        }

    },
//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Hyperlink_Add(HyperProps);
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Hyperlink_Modify(HyperProps);
    },

    Hyperlink_Remove : function()
    {
        if ( null != this.CurHdrFtr )
            this.CurHdrFtr.Hyperlink_Remove();
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);

        return false;
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Hyperlink_Check(bCheckEnd);

        return null;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с генерацией карты шрифтов
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function(FontMap)
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
                this.Content[0].Header.First.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontMap( FontMap );
        }
        else if ( true === bHdr_even )
        {
            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontMap( FontMap );
        }
        else if ( true === bHdr_first )
        {
            if ( null != this.Content[0].Header.First )
                this.Content[0].Header.First.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontMap( FontMap );
        }
        else
        {
            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontMap( FontMap );
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
                this.Content[0].Footer.First.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontMap( FontMap );
        }
        else if ( true === bFtr_even )
        {
            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontMap( FontMap );
        }
        else if ( true === bFtr_first )
        {
            if ( null != this.Content[0].Footer.First )
                this.Content[0].Footer.First.Document_CreateFontMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontMap( FontMap );
        }
        else
        {
            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontMap( FontMap );
        }
    },

    Document_CreateFontCharMap : function(FontMap)
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
                this.Content[0].Header.First.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontCharMap( FontMap );
        }
        else if ( true === bHdr_even )
        {
            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontCharMap( FontMap );
        }
        else if ( true === bHdr_first )
        {
            if ( null != this.Content[0].Header.First )
                this.Content[0].Header.First.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontCharMap( FontMap );
        }
        else
        {
            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_CreateFontCharMap( FontMap );
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
                this.Content[0].Footer.First.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontCharMap( FontMap );
        }
        else if ( true === bFtr_even )
        {
            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontCharMap( FontMap );
        }
        else if ( true === bFtr_first )
        {
            if ( null != this.Content[0].Footer.First )
                this.Content[0].Footer.First.Document_CreateFontCharMap( FontMap );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontCharMap( FontMap );
        }
        else
        {
            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_CreateFontCharMap( FontMap );
        }
    },

    Document_Get_AllFontNames : function(AllFonts)
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
                this.Content[0].Header.First.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else if ( true === bHdr_even )
        {
            if ( null != this.Content[0].Header.Even )
                this.Content[0].Header.Even.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else if ( true === bHdr_first )
        {
            if ( null != this.Content[0].Header.First )
                this.Content[0].Header.First.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else
        {
            if ( null != this.Content[0].Header.Odd )
                this.Content[0].Header.Odd.Document_Get_AllFontNames( AllFonts );
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
                this.Content[0].Footer.First.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else if ( true === bFtr_even )
        {
            if ( null != this.Content[0].Footer.Even )
                this.Content[0].Footer.Even.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else if ( true === bFtr_first )
        {
            if ( null != this.Content[0].Footer.First )
                this.Content[0].Footer.First.Document_Get_AllFontNames( AllFonts );

            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_Get_AllFontNames( AllFonts );
        }
        else
        {
            if ( null != this.Content[0].Footer.Odd )
                this.Content[0].Footer.Odd.Document_Get_AllFontNames( AllFonts );
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        // Любое действие внутри колонтитула лочит его
        this.Lock.Check( this.Get_Id() );
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_HdrFtrController );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_HdrFtrController_AddItem:
            case historyitem_HdrFtrController_RemoveItem:
            {
                // Long   : Флаг (для header), первые три бита - null или нет колонтитулы, следующие три бита - совпадение колонтитулов
                //  в зависимости от флага
                //  String : Id Header.First
                //  String : Id Header.Even
                //  String : Id Header.Odd
                // Long   : Флаг (для footer), первые три бита - null или нет колонтитулы, следующие три бита - совпадение колонтитулов
                //  в зависимости от флага
                //  String : Id Header.First
                //  String : Id Header.Even
                //  String : Id Header.Odd

                var HeaderFlag = 0;
                if ( null != Data.New.Header.First )
                    HeaderFlag |= 1;

                if ( null != Data.New.Header.Even )
                    HeaderFlag |= 2;

                if ( null != Data.New.Header.Odd )
                    HeaderFlag |= 4;

                if ( Data.New.Header.First === Data.New.Header.Even )
                    HeaderFlag |= 8;

                if ( Data.New.Header.First === Data.New.Header.Odd )
                    HeaderFlag |= 16;

                if ( Data.New.Header.Even === Data.New.Header.Odd )
                    HeaderFlag |= 32;

                Writer.WriteLong( HeaderFlag );

                if ( HeaderFlag & 1 )
                    Writer.WriteString2( Data.New.Header.First.Get_Id() );

                if ( HeaderFlag & 2 && !(HeaderFlag & 8) )
                    Writer.WriteString2( Data.New.Header.Even.Get_Id() );

                if ( HeaderFlag & 4 && !(HeaderFlag & 16) && !(HeaderFlag & 32) )
                    Writer.WriteString2( Data.New.Header.Odd.Get_Id() );

                var FooterFlag = 0;
                if ( null != Data.New.Footer.First )
                    FooterFlag |= 1;

                if ( null != Data.New.Footer.Even )
                    FooterFlag |= 2;

                if ( null != Data.New.Footer.Odd )
                    FooterFlag |= 4;

                if ( Data.New.Footer.First === Data.New.Footer.Even )
                    FooterFlag |= 8;

                if ( Data.New.Footer.First === Data.New.Footer.Odd )
                    FooterFlag |= 16;

                if ( Data.New.Footer.Even === Data.New.Footer.Odd )
                    FooterFlag |= 32;

                Writer.WriteLong( FooterFlag );

                if ( FooterFlag & 1 )
                    Writer.WriteString2( Data.New.Footer.First.Get_Id() );

                if ( FooterFlag & 2 && !(FooterFlag & 8) )
                    Writer.WriteString2( Data.New.Footer.Even.Get_Id() );

                if ( FooterFlag & 4 && !(FooterFlag & 16) && !(FooterFlag & 32) )
                    Writer.WriteString2( Data.New.Footer.Odd.Get_Id() );

                break;
            }
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        return false;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_HdrFtrController != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_HdrFtrController_AddItem:
            case historyitem_HdrFtrController_RemoveItem:
            {
                // Long   : Флаг (для header), первые три бита - null или нет колонтитулы, следующие три бита - совпадение колонтитулов
                //  в зависимости от флага
                //  String : Id Header.First
                //  String : Id Header.Even
                //  String : Id Header.Odd
                // Long   : Флаг (для footer), первые три бита - null или нет колонтитулы, следующие три бита - совпадение колонтитулов
                //  в зависимости от флага
                //  String : Id Header.First
                //  String : Id Header.Even
                //  String : Id Header.Odd

                var HeaderFlag = Reader.GetLong();
                if ( HeaderFlag & 1 )
                    this.Content[0].Header.First = g_oTableId.Get_ById( Reader.GetString2() );
                else
                    this.Content[0].Header.First = null;

                if ( HeaderFlag & 2 )
                {
                    if ( !(HeaderFlag & 8) )
                        this.Content[0].Header.Even = g_oTableId.Get_ById( Reader.GetString2() );
                    else
                        this.Content[0].Header.Even = this.Content[0].Header.First
                }
                else
                    this.Content[0].Header.Even = null;

                if ( HeaderFlag & 4 )
                {
                    if ( !(HeaderFlag & 16) && !(HeaderFlag & 32) )
                        this.Content[0].Header.Odd = g_oTableId.Get_ById( Reader.GetString2() );
                    else if ( !(HeaderFlag & 16) )
                        this.Content[0].Header.Odd = this.Content[0].Header.First;
                    else
                        this.Content[0].Header.Odd = this.Content[0].Header.Even;
                }
                else
                    this.Content[0].Header.Odd = null;

                var FooterFlag = Reader.GetLong();
                if ( FooterFlag & 1 )
                    this.Content[0].Footer.First = g_oTableId.Get_ById( Reader.GetString2() );
                else
                    this.Content[0].Footer.First = null;

                if ( FooterFlag & 2 )
                {
                    if ( !(FooterFlag & 8) )
                        this.Content[0].Footer.Even = g_oTableId.Get_ById( Reader.GetString2() );
                    else
                        this.Content[0].Footer.Even = this.Content[0].Footer.First
                }
                else
                    this.Content[0].Footer.Even = null;

                if ( FooterFlag & 4 )
                {
                    if ( !(FooterFlag & 16) && !(FooterFlag & 32) )
                        this.Content[0].Footer.Odd = g_oTableId.Get_ById( Reader.GetString2() );
                    else if ( FooterFlag & 16 )
                        this.Content[0].Footer.Odd = this.Content[0].Footer.First;
                    else
                        this.Content[0].Footer.Odd = this.Content[0].Footer.Even;
                }
                else
                    this.Content[0].Footer.Odd = null;

                break;
            }
        }
    },

    Load_LinkData : function(LinkData)
    {
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(Comment)
    {
        if ( null != this.CurHdrFtr )
        {
            // Отмечаем, что данный комментарий добавлен к колонтитулу
            Comment.Set_TypeInfo( comment_type_HdrFtr, this.CurHdrFtr );
            this.CurHdrFtr.Add_Comment( Comment );
        }
    },

    CanAdd_Comment : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.CanAdd_Comment();

        return false;
    },
    
    Get_SelectionAnchorPos : function()
    {
        if ( null != this.CurHdrFtr )
            return this.CurHdrFtr.Content.Get_SelectionAnchorPos();
        
        return { X : 0, Y : 0, Page : 0 };
    }
    
}

function CHdrFtrPage()
{
    this.Header = null;
    this.Footer = null;
}