/**
 * User: Ilja.Kirillov
 * Date: 23.04.15
 * Time: 15:08
 */

CDocument.prototype.Document_Is_SelectionLocked = function(CheckType, AdditionalData)
{
    if ( true === CollaborativeEditing.Get_GlobalLock() )
        return true;

    CollaborativeEditing.OnStart_CheckLock();

    if ( changestype_None != CheckType )
    {
        if ( changestype_Document_SectPr === CheckType )
        {
            this.Lock.Check( this.Get_Id() );
        }
        else if(changestype_ColorScheme === CheckType )
        {
            this.DrawingObjects.Lock.Check( this.DrawingObjects.Get_Id());
        }
        else
        {
            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Document_Is_SelectionLocked(CheckType);
            }
            else if ( docpostype_DrawingObjects == this.CurPos.Type )
            {
                this.DrawingObjects.documentIsSelectionLocked(CheckType);
            }
            else if ( docpostype_Content == this.CurPos.Type )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common :
                    {
                        if ( true === this.Selection.Use )
                        {
                            var StartPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos );
                            var EndPos   = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );

                            if ( StartPos != EndPos && changestype_Delete === CheckType )
                                CheckType = changestype_Remove;

                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                                this.Content[Index].Document_Is_SelectionLocked(CheckType);
                        }
                        else
                        {
                            var CurElement = this.Content[this.CurPos.ContentPos];

                            if ( changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd() )
                                CollaborativeEditing.Add_CheckLock(false);
                            else
                                this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
                        }

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        if ( null != NumPr )
                        {
                            var AbstrNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                            AbstrNum.Document_Is_SelectionLocked(CheckType);
                        }

                        this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);

                        break;
                    }
                }
            }
        }
    }

    if ( "undefined" != typeof(AdditionalData) && null != AdditionalData )
    {
        if ( changestype_2_InlineObjectMove === AdditionalData.Type )
        {
            var PageNum = AdditionalData.PageNum;
            var X       = AdditionalData.X;
            var Y       = AdditionalData.Y;

            var NearestPara = this.Get_NearestPos(PageNum, X, Y).Paragraph;
            NearestPara.Document_Is_SelectionLocked(changestype_Document_Content);
        }
        else if ( changestype_2_HdrFtr === AdditionalData.Type )
        {
            this.HdrFtr.Document_Is_SelectionLocked(changestype_HdrFtr);
        }
        else if ( changestype_2_Comment === AdditionalData.Type )
        {
            this.Comments.Document_Is_SelectionLocked( AdditionalData.Id );
        }
        else if ( changestype_2_Element_and_Type === AdditionalData.Type )
        {
            AdditionalData.Element.Document_Is_SelectionLocked( AdditionalData.CheckType, false );
        }
        else if ( changestype_2_ElementsArray_and_Type === AdditionalData.Type )
        {
            var Count = AdditionalData.Elements.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                AdditionalData.Elements[Index].Document_Is_SelectionLocked( AdditionalData.CheckType, false );
            }
        }
    }

    var bResult = CollaborativeEditing.OnEnd_CheckLock();

    if ( true === bResult )
    {
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        //this.Document_UpdateRulersState();
    }

    return bResult;
};
CHeaderFooterController.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    // Любое действие внутри колонтитула лочит его
    this.Lock.Check(this.Get_Id());
};
CAbstractNum.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case changestype_Paragraph_Properties:
        {
            this.Lock.Check( this.Get_Id() );
            break;
        }
        case changestype_Document_Content:
        case changestype_Document_Content_Add:
        case changestype_Image_Properties:
        {
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CGraphicObjects.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    if(CheckType === changestype_ColorScheme)
    {
        this.Lock.Check(this.Get_Id());
    }
};
ParaDrawing.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    if(CheckType === changestype_Drawing_Props)
    {
        this.Lock.Check(this.Get_Id());
    }
};
CStyle.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case changestype_Paragraph_Properties:
        case changestype_Document_Content:
        case changestype_Document_Content_Add:
        case changestype_Image_Properties:
        case changestype_Remove:
        case changestype_Delete:
        case changestype_Document_SectPr:
        case changestype_Table_Properties:
        case changestype_Table_RemoveCells:
        case changestype_HdrFtr:
        {
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CStyles.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case changestype_Paragraph_Properties:
        case changestype_Document_Content:
        case changestype_Document_Content_Add:
        case changestype_Image_Properties:
        case changestype_Remove:
        case changestype_Delete:
        case changestype_Document_SectPr:
        case changestype_Table_Properties:
        case changestype_Table_RemoveCells:
        case changestype_HdrFtr:
        {
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CDocumentContent.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    if ( true === this.ApplyToAll )
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Set_ApplyToAll( true );
            this.Content[Index].Document_Is_SelectionLocked(CheckType);
            this.Content[Index].Set_ApplyToAll( false );
        }
        return;
    }
    else
    {
        if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.LogicDocument.DrawingObjects.documentIsSelectionLocked(CheckType);
        }
        else if ( docpostype_Content == this.CurPos.Type )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common :
                {
                    if ( true === this.Selection.Use )
                    {
                        var StartPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos );
                        var EndPos   = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );

                        if ( StartPos != EndPos && changestype_Delete === CheckType )
                            CheckType = changestype_Remove;

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                            this.Content[Index].Document_Is_SelectionLocked(CheckType);
                    }
                    else
                    {
                        var CurElement = this.Content[this.CurPos.ContentPos];

                        if ( changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd() )
                            CollaborativeEditing.Add_CheckLock(false);
                        else
                            this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                    if ( null != NumPr )
                    {
                        var AbstrNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                        AbstrNum.Document_Is_SelectionLocked(CheckType);
                    }

                    this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);

                    break;
                }
            }
        }
    }
};
Paragraph.prototype.Document_Is_SelectionLocked = function(CheckType)
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
};
CTable.prototype.Document_Is_SelectionLocked = function(CheckType, bCheckInner)
{
    switch (CheckType)
    {
        case changestype_Paragraph_Content:
        case changestype_Paragraph_Properties:
        case changestype_Document_Content:
        case changestype_Document_Content_Add:
        case changestype_Delete:
        case changestype_Image_Properties:
        {
            if ( true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) )
            {
                var Cells_array = this.Internal_Get_SelectionArray();

                var Count = Cells_array.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos  = Cells_array[Index];
                    var Cell = this.Content[Pos.Row].Get_Cell( Pos.Cell );

                    Cell.Content.Set_ApplyToAll( true );
                    Cell.Content.Document_Is_SelectionLocked( CheckType );
                    Cell.Content.Set_ApplyToAll( false );
                }
            }
            else
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );

            break;
        }
        case changestype_Remove:
        {
            this.Lock.Check( this.Get_Id() );

            break;
        }
        case changestype_Table_Properties:
        {
            if ( false != bCheckInner && true === this.Is_InnerTable() )
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
            else
                this.Lock.Check( this.Get_Id() );

            break;
        }
        case changestype_Table_RemoveCells:
        {
            /*
             // Проверяем все ячейки
             if ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type )
             {
             var Count = this.Selection.Data.length;
             for ( var Index = 0; Index < Count; Index++ )
             {
             var Pos = this.Selection.Data[Index];
             var Cell = this.Content[Pos.Row].Get_Cell( Pos.Cell );
             Cell.Content.Document_Is_SelectionLocked( CheckType );
             }
             }
             else
             this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
             */

            // Проверяем саму таблицу

            if ( false != bCheckInner && true === this.Is_InnerTable() )
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
            else
                this.Lock.Check( this.Get_Id() );

            break;
        }
        case changestype_Document_SectPr:
        case changestype_HdrFtr:
        {
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CComments.prototype.Document_Is_SelectionLocked = function(Id)
{
    var Comment = this.Get_ById( Id );
    if ( null != Comment )
        Comment.Lock.Check( Comment.Get_Id() );
};
CGraphicObjects.prototype.documentIsSelectionLocked = function(CheckType)
{
    var oDrawing, i;
    if(changestype_Drawing_Props === CheckType
        || changestype_Image_Properties === CheckType
        || changestype_Delete === CheckType
        || changestype_Remove === CheckType
        || changestype_Paragraph_Content === CheckType
        || changestype_Document_Content_Add === CheckType)
    {
        for(i = 0; i < this.selectedObjects.length; ++i)
        {
            oDrawing = this.selectedObjects[i].parent;
            oDrawing.Lock.Check(oDrawing.Get_Id());
        }
    }
};