/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

// Import
var locktype_None = AscCommon.locktype_None;
var locktype_Mine = AscCommon.locktype_Mine;
var changestype_Paragraph_Content = AscCommon.changestype_Paragraph_Content;

if(typeof CDocument !== "undefined")
{
	CDocument.prototype.Document_Is_SelectionLocked = function(CheckType, AdditionalData, DontLockInFastMode, isFillingForm)
	{
		if (true === AscCommon.CollaborativeEditing.Get_GlobalLock() && true !== isFillingForm)
			return true;

		AscCommon.CollaborativeEditing.OnStart_CheckLock();

		this.private_DocumentIsSelectionLocked(CheckType);

		if ("undefined" != typeof(AdditionalData) && null != AdditionalData)
		{
			if (AscCommon.changestype_2_InlineObjectMove === AdditionalData.Type)
			{
				var PageNum = AdditionalData.PageNum;
				var X       = AdditionalData.X;
				var Y       = AdditionalData.Y;

				var NearestPara = this.Get_NearestPos(PageNum, X, Y).Paragraph;
				NearestPara.Document_Is_SelectionLocked(AscCommon.changestype_Document_Content);
			}
			else if (AscCommon.changestype_2_HdrFtr === AdditionalData.Type)
			{
				this.HdrFtr.Document_Is_SelectionLocked(AscCommon.changestype_HdrFtr);
			}
			else if (AscCommon.changestype_2_Comment === AdditionalData.Type)
			{
				this.Comments.Document_Is_SelectionLocked(AdditionalData.Id);
			}
			else if (AscCommon.changestype_2_Element_and_Type === AdditionalData.Type)
			{
				AdditionalData.Element.Document_Is_SelectionLocked(AdditionalData.CheckType, false);
			}
			else if (AscCommon.changestype_2_ElementsArray_and_Type === AdditionalData.Type)
			{
				var Count = AdditionalData.Elements.length;
				for (var Index = 0; Index < Count; Index++)
				{
					AdditionalData.Elements[Index].Document_Is_SelectionLocked(AdditionalData.CheckType, false);
				}
			}
			else if (AscCommon.changestype_2_AdditionalTypes === AdditionalData.Type)
			{
				var Count = AdditionalData.Types.length;
				for (var Index = 0; Index < Count; ++Index)
				{
					this.private_DocumentIsSelectionLocked(AdditionalData.Types[Index]);
				}
			}
		}

		var bResult = AscCommon.CollaborativeEditing.OnEnd_CheckLock(DontLockInFastMode);

		if (true === bResult)
		{
			this.Document_UpdateSelectionState();
			this.Document_UpdateInterfaceState();
			//this.Document_UpdateRulersState();
		}

		return bResult;
	};
	CDocument.prototype.private_DocumentIsSelectionLocked = function(CheckType)
	{
		if (AscCommon.changestype_None != CheckType)
		{
			if (AscCommon.changestype_Document_SectPr === CheckType)
			{
				this.Lock.Check(this.Get_Id());
			}
			else if (AscCommon.changestype_Document_Styles === CheckType)
			{
				this.Styles.Lock.Check(this.Styles.Get_Id());
			}
			else if (AscCommon.changestype_ColorScheme === CheckType)
			{
				this.DrawingObjects.Lock.Check(this.DrawingObjects.Get_Id());
			}
			else
			{
				this.Controller.IsSelectionLocked(CheckType);
			}
		}
	};
	CDocumentControllerBase.prototype.IsSelectionLocked  = function(CheckType)
	{
	};
	CLogicDocumentController.prototype.IsSelectionLocked = function(CheckType)
	{
		this.LogicDocument.controller_IsSelectionLocked(CheckType);
	};
	CDocument.prototype.controller_IsSelectionLocked = function(CheckType)
	{
		switch (this.Selection.Flag)
		{
			case selectionflag_Common :
			{
				if (true === this.Selection.Use)
				{
					var StartPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos );
					var EndPos   = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );

					if (StartPos != EndPos && AscCommon.changestype_Delete === CheckType)
						CheckType = AscCommon.changestype_Remove;

					for (var Index = StartPos; Index <= EndPos; Index++)
						this.Content[Index].Document_Is_SelectionLocked(CheckType);
				}
				else
				{
					var CurElement = this.Content[this.CurPos.ContentPos];

					if (AscCommon.changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd())
						AscCommon.CollaborativeEditing.Add_CheckLock(false);
					else
						this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
				}

				break;
			}
			case selectionflag_Numbering:
			{
				var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
				if (null != NumPr)
				{
					var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
					AbstrNum.Document_Is_SelectionLocked(CheckType);
				}

				this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);

				break;
			}
		}
	};
	CHdrFtrController.prototype.IsSelectionLocked = function(CheckType)
	{
		this.HdrFtr.Document_Is_SelectionLocked(CheckType);
	};
	CDrawingsController.prototype.IsSelectionLocked = function(CheckType)
	{
		this.DrawingObjects.documentIsSelectionLocked(CheckType);
	};
	CFootnotesController.prototype.IsSelectionLocked = function(CheckType)
	{
		for (var sId in this.Selection.Footnotes)
		{
			var oFootnote = this.Selection.Footnotes[sId];
			oFootnote.Document_Is_SelectionLocked(CheckType);
		}
	};
}

if(typeof CHeaderFooterController !== "undefined")
{
    CHeaderFooterController.prototype.Document_Is_SelectionLocked = function(CheckType)
    {
        // Любое действие внутри колонтитула лочит его
        this.Lock.Check(this.Get_Id());
    };
}

CAbstractNum.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case AscCommon.changestype_Paragraph_Properties:
        {
            this.Lock.Check( this.Get_Id() );
            break;
        }
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Image_Properties:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};

if(typeof CGraphicObjects !== "undefined")
{
    CGraphicObjects.prototype.Document_Is_SelectionLocked = function(CheckType)
    {
        if(CheckType === AscCommon.changestype_ColorScheme)
        {
            this.Lock.Check(this.Get_Id());
        }
    };


    CGraphicObjects.prototype.documentIsSelectionLocked = function(CheckType)
    {
        var oDrawing, i;
        if(AscCommon.changestype_Drawing_Props === CheckType
            || AscCommon.changestype_Image_Properties === CheckType
            || AscCommon.changestype_Delete === CheckType
            || AscCommon.changestype_Remove === CheckType
            || changestype_Paragraph_Content === CheckType
            || AscCommon.changestype_Paragraph_Properties === CheckType
            || AscCommon.changestype_Document_Content_Add === CheckType)
        {
            for(i = 0; i < this.selectedObjects.length; ++i)
            {
                oDrawing = this.selectedObjects[i].parent;
                oDrawing.Lock.Check(oDrawing.Get_Id());
            }
        }
    };
}

ParaDrawing.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    if(CheckType === AscCommon.changestype_Drawing_Props)
    {
        this.Lock.Check(this.Get_Id());
    }
};
CStyle.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case AscCommon.changestype_Paragraph_Properties:
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Image_Properties:
        case AscCommon.changestype_Remove:
        case AscCommon.changestype_Delete:
        case AscCommon.changestype_Document_SectPr:
        case AscCommon.changestype_Table_Properties:
        case AscCommon.changestype_Table_RemoveCells:
        case AscCommon.changestype_HdrFtr:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CStyles.prototype.Document_Is_SelectionLocked = function(CheckType)
{
    switch ( CheckType )
    {
        case changestype_Paragraph_Content:
        case AscCommon.changestype_Paragraph_Properties:
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Image_Properties:
        case AscCommon.changestype_Remove:
        case AscCommon.changestype_Delete:
        case AscCommon.changestype_Document_SectPr:
        case AscCommon.changestype_Table_Properties:
        case AscCommon.changestype_Table_RemoveCells:
        case AscCommon.changestype_HdrFtr:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
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

                        if ( StartPos != EndPos && AscCommon.changestype_Delete === CheckType )
                            CheckType = AscCommon.changestype_Remove;

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                            this.Content[Index].Document_Is_SelectionLocked(CheckType);
                    }
                    else
                    {
                        var CurElement = this.Content[this.CurPos.ContentPos];

                        if ( AscCommon.changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd() )
                            AscCommon.CollaborativeEditing.Add_CheckLock(false);
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
        case AscCommon.changestype_Paragraph_Properties:
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Image_Properties:
        {
            this.Lock.Check( this.Get_Id() );
            break;
        }
        case AscCommon.changestype_Remove:
        {
            // Если у нас нет выделения, и курсор стоит в начале, мы должны проверить в том же порядке, в каком
            // идут проверки при удалении в команде Internal_Remove_Backward.
            if ( true != this.Selection.Use && true == this.IsCursorAtBegin() )
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
        case AscCommon.changestype_Delete:
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
        case AscCommon.changestype_Document_SectPr:
        case AscCommon.changestype_Table_Properties:
        case AscCommon.changestype_Table_RemoveCells:
        case AscCommon.changestype_HdrFtr:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CTable.prototype.Document_Is_SelectionLocked = function(CheckType, bCheckInner)
{
    switch (CheckType)
    {
        case changestype_Paragraph_Content:
        case AscCommon.changestype_Paragraph_Properties:
        case AscCommon.changestype_Document_Content:
        case AscCommon.changestype_Document_Content_Add:
        case AscCommon.changestype_Delete:
        case AscCommon.changestype_Image_Properties:
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
        case AscCommon.changestype_Remove:
        {
			if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type))
				this.Lock.Check(this.Get_Id());
			else
				this.CurCell.Content.Document_Is_SelectionLocked(CheckType);

            break;
        }
        case AscCommon.changestype_Table_Properties:
        {
            if ( false != bCheckInner && true === this.Is_InnerTable() )
                this.CurCell.Content.Document_Is_SelectionLocked( CheckType );
            else
                this.Lock.Check( this.Get_Id() );

            break;
        }
        case AscCommon.changestype_Table_RemoveCells:
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
        case AscCommon.changestype_Document_SectPr:
        case AscCommon.changestype_HdrFtr:
        {
            AscCommon.CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    }
};
CBlockLevelSdt.prototype.Document_Is_SelectionLocked = function(CheckType, bCheckInner)
{
	return this.Content.Document_Is_SelectionLocked(CheckType, bCheckInner);
};
if(typeof CComments !== "undefined")
{
    CComments.prototype.Document_Is_SelectionLocked = function(Id)
    {
        var Comment = this.Get_ById( Id );
        if ( null != Comment )
            Comment.Lock.Check( Comment.Get_Id() );
    };
}

if(typeof CPresentation !== "undefined")
{
    CPresentation.prototype.Document_Is_SelectionLocked =  function(CheckType, AdditionalData)
    {
        if ( true === AscCommon.CollaborativeEditing.Get_GlobalLock() )
            return true;
        if(this.Slides.length === 0)
            return false;
        if(AscCommon.changestype_Document_SectPr === CheckType)
        {
            return true;
        }

        if(CheckType === AscCommon.changestype_None && AscCommon.isRealObject(AdditionalData) && AdditionalData.CheckType === AscCommon.changestype_Table_Properties)
        {
            CheckType = AscCommon.changestype_Drawing_Props;
        }


        var cur_slide = this.Slides[this.CurPage];
        var slide_id = cur_slide.deleteLock.Get_Id();


        AscCommon.CollaborativeEditing.OnStart_CheckLock();

        if(CheckType === AscCommon.changestype_Drawing_Props)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for(var i = 0; i < selected_objects.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": selected_objects[i].Get_Id(),
                    "guid": selected_objects[i].Get_Id()
                };
                selected_objects[i].Lock.Check(check_obj);
            }
        }

        if(CheckType === AscCommon.changestype_AddShape || CheckType === AscCommon.changestype_AddComment)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Object,
                "slideId": slide_id,
                "objId": AdditionalData.Get_Id(),
                "guid": AdditionalData.Get_Id()
            };
            AdditionalData.Lock.Check(check_obj);
        }
        if(CheckType === AscCommon.changestype_AddShapes)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            for(var i = 0; i < AdditionalData.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": AdditionalData[i].Get_Id(),
                    "guid": AdditionalData[i].Get_Id()
                };
                AdditionalData[i].Lock.Check(check_obj);
            }
        }

        if(CheckType === AscCommon.changestype_MoveComment)
        {
            var comment = AscCommon.g_oTableId.Get_ById(AdditionalData);
            if(AscCommon.isRealObject(comment))
            {
                var slides = this.Slides;
                var check_slide = null;
                for(var i = 0; i < slides.length; ++i)
                {
                    if(slides[i].slideComments)
                    {
                        var comments = slides[i].slideComments.comments;
                        for(var j = 0; j < comments.length; ++j)
                        {
                            if(comments[j] === comment)
                            {
                                check_slide = slides[i];
                                break;
                            }
                        }
                        if(j < comments.length)
                        {
                            break;
                        }
                    }
                }
                if(AscCommon.isRealObject(check_slide))
                {
                    if(check_slide.deleteLock.Lock.Type !== locktype_Mine && check_slide.deleteLock.Lock.Type !== locktype_None)
                        return true;
                    var check_obj =
                    {
                        "type": c_oAscLockTypeElemPresentation.Object,
                        "slideId": slide_id,
                        "objId": comment.Get_Id(),
                        "guid": comment.Get_Id()
                    };
                    comment.Lock.Check(check_obj);
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }


        }

        if(CheckType === AscCommon.changestype_SlideBg)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].backgroundLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].backgroundLock.Get_Id()
                };
                this.Slides[selected_slides[i]].backgroundLock.Lock.Check(check_obj);
            }
        }

        if(CheckType === AscCommon.changestype_SlideTiming)
        {
            if(!AdditionalData || !AdditionalData.All)
            {
                    var check_obj =
                    {
                        "type": c_oAscLockTypeElemPresentation.Slide,
                        "val": this.Slides[this.CurPage].timingLock.Get_Id(),
                        "guid": this.Slides[this.CurPage].timingLock.Get_Id()
                    };
                    this.Slides[this.CurPage].timingLock.Lock.Check(check_obj);
            }
            else{
                for(var i = 0; i < this.Slides.length; ++i)
                {
                    var check_obj =
                    {
                        "type": c_oAscLockTypeElemPresentation.Slide,
                        "val": this.Slides[i].timingLock.Get_Id(),
                        "guid": this.Slides[i].timingLock.Get_Id()
                    };
                    this.Slides[i].timingLock.Lock.Check(check_obj);
                }
            }

        }

        if(CheckType === AscCommon.changestype_Text_Props)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for(var i = 0; i < selected_objects.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": selected_objects[i].Get_Id(),
                    "guid":selected_objects[i].Get_Id()
                };
                selected_objects[i].Lock.Check(check_obj);
            }
        }

        if(CheckType === AscCommon.changestype_RemoveSlide)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                if(this.Slides[selected_slides[i]].isLockedObject())
                    return true;
            }
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].deleteLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].deleteLock.Get_Id()
                };
                this.Slides[selected_slides[i]].deleteLock.Lock.Check(check_obj);
            }
        }

        if(CheckType === AscCommon.changestype_Theme)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.themeLock.Get_Id(),
                "guid": this.themeLock.Get_Id()
            };
            this.themeLock.Lock.Check(check_obj);
        }

        if(CheckType === AscCommon.changestype_Layout)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].layoutLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].layoutLock.Get_Id()
                };
                this.Slides[selected_slides[i]].layoutLock.Lock.Check(check_obj);
            }
        }
        if(CheckType === AscCommon.changestype_ColorScheme)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.schemeLock.Get_Id(),
                "guid": this.schemeLock.Get_Id()
            };
            this.schemeLock.Lock.Check(check_obj);
        }

        if(CheckType === AscCommon.changestype_SlideSize)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.slideSizeLock.Get_Id(),
                "guid": this.slideSizeLock.Get_Id()
            };
            this.slideSizeLock.Lock.Check(check_obj);
        }

        var bResult = AscCommon.CollaborativeEditing.OnEnd_CheckLock();

        if ( true === bResult )
        {
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }

        return bResult;
    };
}