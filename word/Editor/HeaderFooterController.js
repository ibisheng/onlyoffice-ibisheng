"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:33
 */


// TODO: На самом деле этот класс не нужен. Его нужно совместить с классом CHeaderFooterController, пока он будет сделан
// как оберточный класс над CHeaderFooterController

/**
 * Специальный класс-обработчик команд в колонтитулах
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @param {CHeaderFooterController} HdrFtr - ССылка на объект, управляющий колонтитулами
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CHdrFtrController(LogicDocument, HdrFtr)
{
	CHdrFtrController.superclass.constructor.call(this, LogicDocument);
	this.HdrFtr = HdrFtr;
}
AscCommon.extendClass(CHdrFtrController, CDocumentControllerBase);

CHdrFtrController.prototype.CanTargetUpdate = function()
{
	return true;
};
CHdrFtrController.prototype.RecalculateCurPos = function()
{
	return this.HdrFtr.RecalculateCurPos();
};
CHdrFtrController.prototype.GetCurPage = function()
{
	var CurHdrFtr = this.HdrFtr.CurHdrFtr;
	if (null !== CurHdrFtr && -1 !== CurHdrFtr.RecalcInfo.CurPage)
		return CurHdrFtr.RecalcInfo.CurPage;

	return -1;
};
CHdrFtrController.prototype.AddNewParagraph = function(bRecalculate, bForceAdd)
{
	return this.HdrFtr.Add_NewParagraph(bRecalculate, bForceAdd);
};
CHdrFtrController.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow)
{
	this.HdrFtr.Add_InlineImage(nW, nH, oImage, oChart, bFlow);
};
CHdrFtrController.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	this.HdrFtr.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
};
CHdrFtrController.prototype.AddTextArt = function(nStyle)
{
	this.HdrFtr.Add_TextArt(nStyle);
};
CHdrFtrController.prototype.EditChart = function(Chart)
{
	this.HdrFtr.Edit_Chart(Chart);
};
CHdrFtrController.prototype.AddInlineTable = function(Cols, Rows)
{
	this.HdrFtr.Add_InlineTable(Cols, Rows);
};
CHdrFtrController.prototype.ClearParagraphFormatting = function()
{
	this.HdrFtr.Paragraph_ClearFormatting();
};
CHdrFtrController.prototype.AddToParagraph = function(oItem, bRecalculate)
{
	if (para_NewLine === oItem.Type && true === oItem.Is_PageOrColumnBreak())
		return;

	this.HdrFtr.Paragraph_Add(oItem, bRecalculate);
	this.LogicDocument.Document_UpdateSelectionState();
	this.LogicDocument.Document_UpdateUndoRedoState();
};
CHdrFtrController.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	var nResult = this.HdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);

	if (null !== this.HdrFtr.CurHdtr && docpostype_DrawingObjects !== this.HdrFtr.CurHdrFtr.Content.CurPos.Type)
	{
		this.Selection_Remove();
		this.Selection.Use = false;
	}

	return nResult;
};
CHdrFtrController.prototype.GetCursorPosXY = function()
{
	return this.HdrFtr.Cursor_GetPos();
};
CHdrFtrController.prototype.MoveCursorToStartPos = function(AddToSelect)
{
	this.HdrFtr.Cursor_MoveToStartPos(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToEndPos = function(AddToSelect)
{
	this.HdrFtr.Cursor_MoveToEndPos(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
};
CHdrFtrController.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste)
{
	return this.HdrFtr.Cursor_MoveRight(AddToSelect, Word, FromPaste);
};
CHdrFtrController.prototype.MoveCursorUp = function(AddToSelect)
{
	var RetValue = this.HdrFtr.Cursor_MoveUp(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CHdrFtrController.prototype.MoveCursorDown = function(AddToSelect)
{
	var RetValue = this.HdrFtr.Cursor_MoveDown(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CHdrFtrController.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect)
{
	return this.HdrFtr.Cursor_MoveAt(X, Y, PageAbs, AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToCell = function(bNext)
{
	return this.HdrFtr.Cursor_MoveToCell(bNext);
};
CHdrFtrController.prototype.SetParagraphAlign = function(Align)
{
	this.HdrFtr.Set_ParagraphAlign(Align);
};
CHdrFtrController.prototype.SetParagraphSpacing = function (Spacing)
{
	this.HdrFtr.Set_ParagraphSpacing(Spacing);
};
CHdrFtrController.prototype.SetParagraphTabs = function(Tabs)
{
	this.HdrFtr.Set_ParagraphTabs(Tabs);
};
CHdrFtrController.prototype.SetParagraphIndent = function(Ind)
{
	this.HdrFtr.Set_ParagraphIndent(Ind);
};
CHdrFtrController.prototype.SetParagraphNumbering = function(NumInfo)
{
	this.HdrFtr.Set_ParagraphNumbering(NumInfo);
};
CHdrFtrController.prototype.SetParagraphShd = function(Shd)
{
	this.HdrFtr.Set_ParagraphShd(Shd);
};
CHdrFtrController.prototype.SetParagraphStyle = function(Name)
{
	this.HdrFtr.Set_ParagraphStyle(Name);
};
CHdrFtrController.prototype.SetParagraphContextualSpacing = function(Value)
{
	this.HdrFtr.Set_ParagraphContextualSpacing(Value);
};
CHdrFtrController.prototype.SetParagraphPageBreakBefore = function(Value)
{
	this.HdrFtr.Set_ParagraphPageBreakBefore(Value);
};
CHdrFtrController.prototype.SetParagraphKeepLines = function(Value)
{
	this.HdrFtr.Set_ParagraphKeepLines(Value);
};
CHdrFtrController.prototype.SetParagraphKeepNext = function(Value)
{
	this.HdrFtr.Set_ParagraphKeepNext(Value);
};
CHdrFtrController.prototype.SetParagraphWidowControl = function(Value)
{
	this.HdrFtr.Set_ParagraphWidowControl(Value);
};
CHdrFtrController.prototype.SetParagraphBorders = function(Borders)
{
	this.HdrFtr.Set_ParagraphBorders(Borders);
};
CHdrFtrController.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	this.HdrFtr.Set_ParagraphFramePr(FramePr, bDelete);
};
CHdrFtrController.prototype.IncreaseOrDecreaseParagraphFontSize = function(bIncrease)
{
	this.HdrFtr.Paragraph_IncDecFontSize(bIncrease);
};
CHdrFtrController.prototype.IncreaseOrDecreaseParagraphIndent = function(bIncrease)
{
	this.HdrFtr.Paragraph_IncDecIndent(bIncrease);
};
CHdrFtrController.prototype.SetImageProps = function(Props)
{
	this.HdrFtr.Set_ImageProps(Props);
};
CHdrFtrController.prototype.SetTableProps = function(Props)
{
	this.HdrFtr.Set_TableProps(Props);
};
CHdrFtrController.prototype.GetCurrentParaPr = function()
{
	return this.HdrFtr.Get_Paragraph_ParaPr();
};
CHdrFtrController.prototype.GetCurrentTextPr = function()
{
	return this.HdrFtr.Get_Paragraph_TextPr();
};
CHdrFtrController.prototype.GetDirectParaPr = function()
{
	return this.HdrFtr.Get_Paragraph_ParaPr_Copy();
};
CHdrFtrController.prototype.GetDirectTextPr = function()
{
	return this.HdrFtr.Get_Paragraph_TextPr_Copy();
};
CHdrFtrController.prototype.RemoveSelection = function(bNoCheckDrawing)
{
	this.HdrFtr.Selection_Remove(bNoCheckDrawing);
};
CHdrFtrController.prototype.IsEmptySelection = function(bCheckHidden)
{
	return this.HdrFtr.Selection_IsEmpty(bCheckHidden);
};
CHdrFtrController.prototype.DrawSelectionOnPage = function(PageAbs)
{
	this.HdrFtr.Selection_Draw_Page(PageAbs);
};
CHdrFtrController.prototype.GetSelectionBounds = function()
{
	return this.HdrFtr.Get_SelectionBounds();
};
CHdrFtrController.prototype.IsMovingTableBorder = function()
{
	return this.HdrFtr.Selection_Is_TableBorderMove();
};
CHdrFtrController.prototype.CheckPosInSelection = function(X, Y, PageAbs, NearPos)
{
	return this.HdrFtr.Selection_Check(X, Y, PageAbs, NearPos);
};
CHdrFtrController.prototype.SelectAll = function()
{
	this.HdrFtr.Select_All();
};
CHdrFtrController.prototype.GetSelectedContent = function(SelectedContent)
{
	this.HdrFtr.Get_SelectedContent(SelectedContent);
};
CHdrFtrController.prototype.UpdateCursorType = function(X, Y, PageAbs, MouseEvent)
{
	this.HdrFtr.Update_CursorType(X, Y, PageAbs, MouseEvent);
};
CHdrFtrController.prototype.PasteFormatting = function(TextPr, ParaPr)
{
	this.HdrFtr.Paragraph_Format_Paste(TextPr, ParaPr, false);
};
CHdrFtrController.prototype.IsSelectionUse = function()
{
	return this.HdrFtr.Is_SelectionUse();
};
CHdrFtrController.prototype.IsTextSelectionUse = function()
{
	return this.HdrFtr.Is_TextSelectionUse();
};
CHdrFtrController.prototype.GetCurPosXY = function()
{
	return this.HdrFtr.Get_CurPosXY();
};
CHdrFtrController.prototype.GetSelectedText = function(bClearText)
{
	return this.HdrFtr.Get_SelectedText(bClearText);
};
CHdrFtrController.prototype.GetCurrentParagraph = function()
{
	return this.HdrFtr.Get_CurrentParagraph();
};
CHdrFtrController.prototype.GetSelectedElementsInfo = function(oInfo)
{
	this.HdrFtr.Get_SelectedElementsInfo(oInfo);
};
CHdrFtrController.prototype.AddTableRow = function(bBefore)
{
	this.HdrFtr.Table_AddRow(bBefore);
};
CHdrFtrController.prototype.AddTableCol = function(bBefore)
{
	this.HdrFtr.Table_AddCol(bBefore);
};
CHdrFtrController.prototype.RemoveTableRow = function()
{
	this.HdrFtr.Table_RemoveRow();
};
CHdrFtrController.prototype.RemoveTableCol = function()
{
	this.HdrFtr.Table_RemoveCol();
};
CHdrFtrController.prototype.MergeTableCells = function()
{
	this.HdrFtr.Table_MergeCells();
};
CHdrFtrController.prototype.SplitTableCells = function(Cols, Rows)
{
	this.HdrFtr.Table_SplitCell(Cols, Rows);
};
CHdrFtrController.prototype.RemoveTable = function()
{
	this.HdrFtr.Table_RemoveTable();
};
CHdrFtrController.prototype.SelectTable = function(Type)
{
	this.HdrFtr.Table_Select(Type);
};
CHdrFtrController.prototype.CanMergeTableCells = function()
{
	return this.HdrFtr.Table_CheckMerge();
};
CHdrFtrController.prototype.CanSplitTableCells = function()
{
	return this.HdrFtr.Table_CheckSplit();
};
CHdrFtrController.prototype.UpdateInterfaceState = function()
{
	this.LogicDocument.Interface_Update_HdrFtrPr();
	this.HdrFtr.Document_UpdateInterfaceState();
};
CHdrFtrController.prototype.UpdateRulersState = function()
{
	this.DrawingDocument.Set_RulerState_Paragraph(null);
	this.HdrFtr.Document_UpdateRulersState(this.LogicDocument.CurPage);
};
CHdrFtrController.prototype.UpdateSelectionState = function()
{
	this.HdrFtr.Document_UpdateSelectionState();
	this.LogicDocument.Document_UpdateTracks();
};
CHdrFtrController.prototype.GetSelectionState = function()
{
	return this.HdrFtr.Get_SelectionState();
};
CHdrFtrController.prototype.SetSelectionState = function(State, StateIndex)
{
	this.HdrFtr.Set_SelectionState(State, StateIndex);	
};
CHdrFtrController.prototype.AddHyperlink = function(Props)
{
	this.HdrFtr.Hyperlink_Add(Props);
};
CHdrFtrController.prototype.ModifyHyperlink = function(Props)
{
	this.HdrFtr.Hyperlink_Modify(Props);
};
CHdrFtrController.prototype.RemoveHyperlink = function()
{
	this.HdrFtr.Hyperlink_Remove();
};
CHdrFtrController.prototype.CanAddHyperlink = function(bCheckInHyperlink)
{
	return this.HdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);
};
CHdrFtrController.prototype.IsCursorInHyperlink = function(bCheckEnd)
{
	return this.HdrFtr.Hyperlink_Check(bCheckEnd);
};
CHdrFtrController.prototype.AddComment = function(Comment)
{
	this.HdrFtr.Add_Comment(Comment);
};
CHdrFtrController.prototype.CanAddComment = function()
{
	return this.HdrFtr.CanAdd_Comment();
};
CHdrFtrController.prototype.GetSelectionAnchorPos = function()
{
	return this.HdrFtr.Get_SelectionAnchorPos();
};
CHdrFtrController.prototype.StartSelectionFromCurPos = function()
{
	this.HdrFtr.Start_SelectionFromCurPos();
};
CHdrFtrController.prototype.SaveDocumentStateBeforeLoadChanges = function(State)
{
	var HdrFtr = this.HdrFtr.Get_CurHdrFtr();
	if (null !== HdrFtr)
	{
		var HdrFtrContent = HdrFtr.Get_DocumentContent();
		State.HdrFtr      = HdrFtr;

		State.HdrFtrDocPosType = HdrFtrContent.CurPos.Type;
		State.HdrFtrSelection  = HdrFtrContent.Selection.Use;

		if (docpostype_Content === HdrFtrContent.Get_DocPosType())
		{
			State.Pos      = HdrFtrContent.Get_ContentPosition(false, false, undefined);
			State.StartPos = HdrFtrContent.Get_ContentPosition(true, true, undefined);
			State.EndPos   = HdrFtrContent.Get_ContentPosition(true, false, undefined);
		}
		else if (docpostype_DrawingObjects === HdrFtrContent.Get_DocPosType())
		{
			this.LogicDocument.DrawingObjects.Save_DocumentStateBeforeLoadChanges(State);
		}
	}
};
CHdrFtrController.prototype.RestoreDocumentStateAfterLoadChanges = function(State)
{
	var HdrFtr = State.HdrFtr;
	if (null !== HdrFtr && undefined !== HdrFtr && true === HdrFtr.Is_UseInDocument())
	{
		this.HdrFtr.Set_CurHdrFtr(HdrFtr);
		var HdrFtrContent = HdrFtr.Get_DocumentContent();
		if (docpostype_Content === State.HdrFtrDocPosType)
		{
			HdrFtrContent.Set_DocPosType(docpostype_Content);
			HdrFtrContent.Selection.Use = State.HdrFtrSelection;
			if (true === HdrFtrContent.Selection.Use)
			{
				HdrFtrContent.Set_ContentPosition(State.StartPos, 0, 0);
				HdrFtrContent.Set_ContentSelection(State.StartPos, State.EndPos, 0, 0, 0);
			}
			else
			{
				HdrFtrContent.Set_ContentPosition(State.Pos, 0, 0);
				this.LogicDocument.NeedUpdateTarget = true;
			}
		}
		else if (docpostype_DrawingObjects === State.HdrFtrDocPosType)
		{
			HdrFtrContent.Set_DocPosType(docpostype_DrawingObjects);

			if (true !== this.LogicDocument.DrawingObjects.Load_DocumentStateAfterLoadChanges(State))
			{
				HdrFtrContent.Set_DocPosType(docpostype_Content);
				this.LogicDocument.Cursor_MoveAt(State.X ? State.X : 0, State.Y ? State.Y : 0, false);
			}
		}
	}
	else
	{
		this.LogicDocument.Document_End_HdrFtrEditing();
	}
};