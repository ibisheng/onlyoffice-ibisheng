"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:31
 */

/**
 * Специальный класс-обработчик команд в автофигурах
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @param {CDrawingsObjects} DrawingsObjects - ССылка на объект, работающий с автофигурами
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CDrawingsController(LogicDocument, DrawingsObjects)
{
	CDrawingsController.superclass.constructor.call(this, LogicDocument);

	this.DrawingObjects = DrawingsObjects;
}
AscCommon.extendClass(CDrawingsController, CDocumentControllerBase);

CDrawingsController.prototype.CanTargetUpdate = function()
{
	return true;
};
CDrawingsController.prototype.RecalculateCurPos = function()
{
	this.DrawingObjects.recalculateCurPos();
};
CDrawingsController.prototype.GetCurPage = function()
{
	var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
	if (null !== ParaDrawing)
		return ParaDrawing.PageNum;

	return -1;
};
CDrawingsController.prototype.AddNewParagraph = function(bRecalculate, bForceAdd)
{
	return this.DrawingObjects.addNewParagraph(bRecalculate, bForceAdd);
};
CDrawingsController.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow)
{
	return this.DrawingObjects.addInlineImage(nW, nH, oImage, oChart, bFlow);
};
CDrawingsController.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	this.DrawingObjects.addOleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
};
CDrawingsController.prototype.AddTextArt = function(nStyle)
{
	// ничего не делаем
};
CDrawingsController.prototype.EditChart = function(Chart)
{
	this.DrawingObjects.editChart(Chart);
};
CDrawingsController.prototype.AddInlineTable = function(Cols, Rows)
{
	this.DrawingObjects.addInlineTable(Cols, Rows);
};
CDrawingsController.prototype.ClearParagraphFormatting = function()
{
	this.DrawingObjects.paragraphClearFormatting();
};
CDrawingsController.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	return this.DrawingObjects.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
};
CDrawingsController.prototype.GetCursorPosXY = function()
{
	return this.DrawingObjects.cursorGetPos();
};
CDrawingsController.prototype.MoveCursorToStartPos = function(AddToSelect)
{
	if (true === AddToSelect)
	{
		// TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
		//       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
		//       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
	}
	else
	{
		this.LogicDocument.controller_MoveCursorToStartPos(false);
	}
};
CDrawingsController.prototype.MoveCursorToEndPos = function(AddToSelect)
{
	if (true === AddToSelect)
	{
		// TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
		//       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
		//       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
	}
	else
	{
		this.LogicDocument.controller_MoveCursorToEndPos(false);
	}
};
CDrawingsController.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return this.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
};
CDrawingsController.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste)
{
	return this.DrawingObjects.cursorMoveRight(AddToSelect, Word, FromPaste);
};
CDrawingsController.prototype.MoveCursorUp = function(AddToSelect)
{
	var RetValue = this.DrawingObjects.cursorMoveUp(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CDrawingsController.prototype.MoveCursorDown = function(AddToSelect)
{
	var RetValue = this.DrawingObjects.cursorMoveDown(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CDrawingsController.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return this.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
};
CDrawingsController.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return this.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
};
CDrawingsController.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect)
{
	return this.DrawingObjects.cursorMoveAt(X, Y, AddToSelect);
};
CDrawingsController.prototype.MoveCursorToCell = function(bNext)
{
	return this.DrawingObjects.cursorMoveToCell(bNext);
};
CDrawingsController.prototype.SetParagraphAlign = function(Align)
{
	if (true != this.DrawingObjects.isSelectedText())
	{
		var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
		if (null != ParaDrawing)
		{
			var Paragraph = ParaDrawing.Parent;
			Paragraph.Set_Align(Align);
		}
	}
	else
	{
		this.DrawingObjects.setParagraphAlign(Align);
	}
};
CDrawingsController.prototype.SetParagraphSpacing = function (Spacing)
{
	if (true != this.DrawingObjects.isSelectedText())
	{
		var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
		if (null != ParaDrawing)
		{
			var Paragraph = ParaDrawing.Parent;
			Paragraph.Set_Spacing(Spacing, false);
			this.Recalculate();
		}
	}
	else
	{
		this.DrawingObjects.setParagraphSpacing(Spacing);
	}
};
CDrawingsController.prototype.SetParagraphTabs = function(Tabs)
{
	this.DrawingObjects.setParagraphTabs(Tabs);
};
CDrawingsController.prototype.SetParagraphIndent = function(Ind)
{
	this.DrawingObjects.setParagraphIndent(Ind);
};
CDrawingsController.prototype.SetParagraphNumbering = function(NumInfo)
{
	this.DrawingObjects.setParagraphNumbering(NumInfo);
};
CDrawingsController.prototype.SetParagraphShd = function(Shd)
{
	this.DrawingObjects.setParagraphShd(Shd);
};
CDrawingsController.prototype.SetParagraphStyle = function(Name)
{
	this.DrawingObjects.setParagraphStyle(Name);
};
CDrawingsController.prototype.SetParagraphContextualSpacing = function(Value)
{
	this.DrawingObjects.setParagraphContextualSpacing(Value);
};
CDrawingsController.prototype.SetParagraphPageBreakBefore = function(Value)
{
	this.DrawingObjects.setParagraphPageBreakBefore(Value);
};
CDrawingsController.prototype.SetParagraphKeepLines = function(Value)
{
	this.DrawingObjects.setParagraphKeepLines(Value);
};
CDrawingsController.prototype.SetParagraphKeepNext = function(Value)
{
	this.DrawingObjects.setParagraphKeepNext(Value);
};
CDrawingsController.prototype.SetParagraphWidowControl = function(Value)
{
	this.DrawingObjects.setParagraphWidowControl(Value);
};
CDrawingsController.prototype.SetParagraphBorders = function(Borders)
{
	this.DrawingObjects.setParagraphBorders(Borders);
};
CDrawingsController.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	// Не добавляем и не работаем с рамками в автофигурах
};
CDrawingsController.prototype.IncreaseOrDecreaseParagraphFontSize = function(bIncrease)
{
	this.DrawingObjects.paragraphIncDecFontSize(bIncrease);
};
CDrawingsController.prototype.IncreaseOrDecreaseParagraphIndent = function(bIncrease)
{
	if (true != this.DrawingObjects.isSelectedText())
	{
		var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
		if (null != ParaDrawing)
		{
			var Paragraph = ParaDrawing.Parent;
			Paragraph.IncDec_Indent(bIncrease);
		}
	}
	else
	{
		this.DrawingObjects.paragraphIncDecIndent(bIncrease);
	}
};
CDrawingsController.prototype.SetImageProps = function(Props)
{
	this.DrawingObjects.setProps(Props);
};
CDrawingsController.prototype.SetTableProps = function(Props)
{
	this.DrawingObjects.setTableProps(Props);
};
CDrawingsController.prototype.GetCurrentParaPr = function()
{
	return this.DrawingObjects.getParagraphParaPr();
};
CDrawingsController.prototype.GetCurrentTextPr = function()
{
	return this.DrawingObjects.getParagraphTextPr();
};
CDrawingsController.prototype.GetDirectParaPr = function()
{
	return this.DrawingObjects.getParagraphParaPrCopy();
};
CDrawingsController.prototype.GetDirectTextPr = function()
{
	return this.DrawingObjects.getParagraphTextPrCopy();
};
CDrawingsController.prototype.RemoveSelection = function(bNoCheckDrawing)
{
	var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
	if (ParaDrawing)
	{
		ParaDrawing.GoTo_Text(undefined, false);
	}
	return this.DrawingObjects.resetSelection(undefined, bNoCheckDrawing);
};
CDrawingsController.prototype.IsEmptySelection = function(bCheckHidden)
{
	return false;
};
CDrawingsController.prototype.DrawSelectionOnPage = function(PageAbs)
{
	this.DrawingDocument.SetTextSelectionOutline(true);
	this.DrawingObjects.drawSelectionPage(PageAbs);
};
CDrawingsController.prototype.GetSelectionBounds = function()
{
	return this.DrawingObjects.Get_SelectionBounds();
};
CDrawingsController.prototype.IsMovingTableBorder = function()
{
	return this.DrawingObjects.selectionIsTableBorder();
};
CDrawingsController.prototype.CheckPosInSelection = function(X, Y, PageAbs, NearPos)
{
	return this.DrawingObjects.selectionCheck(X, Y, PageAbs, NearPos);
};
CDrawingsController.prototype.SelectAll = function()
{
	this.DrawingObjects.selectAll();
};

CDrawingsController.prototype.AddToParagraph = function(oItem, bRecalculate)
{
	if (para_NewLine === oItem.Type && true === oItem.Is_PageOrColumnBreak())
		return;

	this.DrawingObjects.paragraphAdd(oItem, bRecalculate);
	this.LogicDocument.Document_UpdateSelectionState();
	this.LogicDocument.Document_UpdateUndoRedoState();
	this.LogicDocument.Document_UpdateInterfaceState();
};


