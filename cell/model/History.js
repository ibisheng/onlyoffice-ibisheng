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

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
	//------------------------------------------------------------export--------------------------------------------------
	window['AscCH'] = window['AscCH'] || {};
	window['AscCH'].historyitem_Unknown = 0;

	window['AscCH'].historyitem_Workbook_SheetAdd = 1;
	window['AscCH'].historyitem_Workbook_SheetRemove = 2;
	window['AscCH'].historyitem_Workbook_SheetMove = 3;
	window['AscCH'].historyitem_Workbook_ChangeColorScheme = 5;
	window['AscCH'].historyitem_Workbook_AddFont = 6;
	window['AscCH'].historyitem_Workbook_DefinedNamesChange = 7;
	window['AscCH'].historyitem_Workbook_DefinedNamesChangeUndo = 8;

	window['AscCH'].historyitem_Worksheet_RemoveCell = 1;
	window['AscCH'].historyitem_Worksheet_RemoveRows = 2;
	window['AscCH'].historyitem_Worksheet_RemoveCols = 3;
	window['AscCH'].historyitem_Worksheet_AddRows = 4;
	window['AscCH'].historyitem_Worksheet_AddCols = 5;
	window['AscCH'].historyitem_Worksheet_ShiftCellsLeft = 6;
	window['AscCH'].historyitem_Worksheet_ShiftCellsTop = 7;
	window['AscCH'].historyitem_Worksheet_ShiftCellsRight = 8;
	window['AscCH'].historyitem_Worksheet_ShiftCellsBottom = 9;
	window['AscCH'].historyitem_Worksheet_ColProp = 10;
	window['AscCH'].historyitem_Worksheet_RowProp = 11;
	window['AscCH'].historyitem_Worksheet_Sort = 12;
	window['AscCH'].historyitem_Worksheet_MoveRange = 13;
	window['AscCH'].historyitem_Worksheet_Rename = 18;
	window['AscCH'].historyitem_Worksheet_Hide = 19;
//не добавляем в историю события historyitem_Worksheet_CreateRow, CreateCol, CreateCell - потому что появляется много ошибок(например удаление строк, если снизу были данные и undo)
//они решают только одну проблему, что когда есть стиль колонки, а мы создаем ячейку, при полном undo не отменится стиль ячейки.
	window['AscCH'].historyitem_Worksheet_CreateRow = 20;
	window['AscCH'].historyitem_Worksheet_CreateCol = 21;
	window['AscCH'].historyitem_Worksheet_CreateCell = 22;

	window['AscCH'].historyitem_Worksheet_ChangeMerge = 25;
	window['AscCH'].historyitem_Worksheet_ChangeHyperlink = 26;
	window['AscCH'].historyitem_Worksheet_SetTabColor = 27;
	window['AscCH'].historyitem_Worksheet_RowHide = 28;
	window['AscCH'].historyitem_Worksheet_SetDisplayGridlines = 31;
	window['AscCH'].historyitem_Worksheet_SetDisplayHeadings = 32;
// Frozen cell
	window['AscCH'].historyitem_Worksheet_ChangeFrozenCell = 30;

	window['AscCH'].historyitem_RowCol_Fontname = 1;
	window['AscCH'].historyitem_RowCol_Fontsize = 2;
	window['AscCH'].historyitem_RowCol_Fontcolor = 3;
	window['AscCH'].historyitem_RowCol_Bold = 4;
	window['AscCH'].historyitem_RowCol_Italic = 5;
	window['AscCH'].historyitem_RowCol_Underline = 6;
	window['AscCH'].historyitem_RowCol_Strikeout = 7;
	window['AscCH'].historyitem_RowCol_FontAlign = 8;
	window['AscCH'].historyitem_RowCol_AlignVertical = 9;
	window['AscCH'].historyitem_RowCol_AlignHorizontal = 10;
	window['AscCH'].historyitem_RowCol_Fill = 11;
	window['AscCH'].historyitem_RowCol_Border = 12;
	window['AscCH'].historyitem_RowCol_ShrinkToFit = 13;
	window['AscCH'].historyitem_RowCol_Wrap = 14;
	window['AscCH'].historyitem_RowCol_NumFormat = 15;
	window['AscCH'].historyitem_RowCol_SetFont = 16;
	window['AscCH'].historyitem_RowCol_Angle = 17;
	window['AscCH'].historyitem_RowCol_SetStyle = 18;
	window['AscCH'].historyitem_RowCol_SetCellStyle = 19;

	window['AscCH'].historyitem_Cell_Fontname = 1;
	window['AscCH'].historyitem_Cell_Fontsize = 2;
	window['AscCH'].historyitem_Cell_Fontcolor = 3;
	window['AscCH'].historyitem_Cell_Bold = 4;
	window['AscCH'].historyitem_Cell_Italic = 5;
	window['AscCH'].historyitem_Cell_Underline = 6;
	window['AscCH'].historyitem_Cell_Strikeout = 7;
	window['AscCH'].historyitem_Cell_FontAlign = 8;
	window['AscCH'].historyitem_Cell_AlignVertical = 9;
	window['AscCH'].historyitem_Cell_AlignHorizontal = 10;
	window['AscCH'].historyitem_Cell_Fill = 11;
	window['AscCH'].historyitem_Cell_Border = 12;
	window['AscCH'].historyitem_Cell_ShrinkToFit = 13;
	window['AscCH'].historyitem_Cell_Wrap = 14;
	window['AscCH'].historyitem_Cell_Numformat = 15;
	window['AscCH'].historyitem_Cell_ChangeValue = 16;
	window['AscCH'].historyitem_Cell_ChangeArrayValueFormat = 17;
	window['AscCH'].historyitem_Cell_SetStyle = 18;
	window['AscCH'].historyitem_Cell_SetFont = 19;
	window['AscCH'].historyitem_Cell_SetQuotePrefix = 20;
	window['AscCH'].historyitem_Cell_Angle = 21;
	window['AscCH'].historyitem_Cell_Style = 22;
	window['AscCH'].historyitem_Cell_ChangeValueUndo = 23;

	window['AscCH'].historyitem_Comment_Add = 1;
	window['AscCH'].historyitem_Comment_Remove = 2;
	window['AscCH'].historyitem_Comment_Change = 3;

	window['AscCH'].historyitem_AutoFilter_Add		= 1;
	window['AscCH'].historyitem_AutoFilter_Sort		= 2;
	window['AscCH'].historyitem_AutoFilter_Empty	= 3;
	window['AscCH'].historyitem_AutoFilter_ApplyDF	= 4;
	window['AscCH'].historyitem_AutoFilter_ApplyMF	= 5;
	window['AscCH'].historyitem_AutoFilter_Move     = 6;
	window['AscCH'].historyitem_AutoFilter_CleanAutoFilter  = 7;
	window['AscCH'].historyitem_AutoFilter_Delete   = 8;
	window['AscCH'].historyitem_AutoFilter_ChangeTableStyle = 9;
	window['AscCH'].historyitem_AutoFilter_Change = 10;
	window['AscCH'].historyitem_AutoFilter_CleanFormat  = 11;
	window['AscCH'].historyitem_AutoFilter_ChangeTableInfo = 12;
	window['AscCH'].historyitem_AutoFilter_ChangeTableRef = 13;
	window['AscCH'].historyitem_AutoFilter_ChangeTableName = 14;
	window['AscCH'].historyitem_AutoFilter_ClearFilterColumn = 15;
	window['AscCH'].historyitem_AutoFilter_ChangeColumnName = 16;
	window['AscCH'].historyitem_AutoFilter_ChangeTotalRow = 17;

	window['AscCH'].historyitem_Sparkline_Type = 1;
	window['AscCH'].historyitem_Sparkline_LineWeight = 2;
	window['AscCH'].historyitem_Sparkline_DisplayEmptyCellsAs = 3;
	window['AscCH'].historyitem_Sparkline_Markers = 4;
	window['AscCH'].historyitem_Sparkline_High = 5;
	window['AscCH'].historyitem_Sparkline_Low = 6;
	window['AscCH'].historyitem_Sparkline_First = 7;
	window['AscCH'].historyitem_Sparkline_Last = 8;
	window['AscCH'].historyitem_Sparkline_Negative = 9;
	window['AscCH'].historyitem_Sparkline_DisplayXAxis = 10;
	window['AscCH'].historyitem_Sparkline_DisplayHidden = 11;
	window['AscCH'].historyitem_Sparkline_MinAxisType = 12;
	window['AscCH'].historyitem_Sparkline_MaxAxisType = 13;
	window['AscCH'].historyitem_Sparkline_RightToLeft = 14;
	window['AscCH'].historyitem_Sparkline_ManualMax = 15;
	window['AscCH'].historyitem_Sparkline_ManualMin = 16;
	window['AscCH'].historyitem_Sparkline_DateAxis = 17;
	window['AscCH'].historyitem_Sparkline_ColorSeries = 18;
	window['AscCH'].historyitem_Sparkline_ColorNegative = 19;
	window['AscCH'].historyitem_Sparkline_ColorAxis = 20;
	window['AscCH'].historyitem_Sparkline_ColorMarkers = 21;
	window['AscCH'].historyitem_Sparkline_ColorFirst = 22;
	window['AscCH'].historyitem_Sparkline_colorLast = 23;
	window['AscCH'].historyitem_Sparkline_ColorHigh = 24;
	window['AscCH'].historyitem_Sparkline_ColorLow = 25;
	window['AscCH'].historyitem_Sparkline_F = 26;
	window['AscCH'].historyitem_Sparkline_ChangeData = 27;
	window['AscCH'].historyitem_Sparkline_RemoveData = 28;
	window['AscCH'].historyitem_Sparkline_RemoveSparkline = 29;

function CHistory()
{
	this.workbook = null;
    this.Index    = -1;
    this.Points   = [];
    this.TurnOffHistory = 0;
    this.Transaction = 0;
    this.LocalChange = false;//если true все добавленный изменения не пойдут в совместное редактирование.
	this.RecIndex = -1;
	this.lastDrawingObjects = null;
	this.LastState = null;
	this.LoadFonts = {};//собираем все загруженные шрифты между моментами сохранения
	this.HasLoadFonts = false;
	this.CanNotAddChanges = false;//флаг для отслеживания ошибок добавления изменений без точки:Create_NewPoint->Add->Save_Changes->Add

	this.SavedIndex = null;			// Номер точки отката, на которой произошло последнее сохранение
  this.ForceSave  = false;       // Нужно сохранение, случается, когда у нас точка SavedIndex смещается из-за объединения точек, и мы делаем Undo

  // Параметры для специального сохранения для локальной версии редактора
  this.UserSaveMode   = false;
  this.UserSavedIndex = null;  // Номер точки, на которой произошло последнее сохранение пользователем (не автосохранение)
}
CHistory.prototype.init = function(workbook) {
	this.workbook = workbook;
};
CHistory.prototype.Is_UserSaveMode = function() {
  return this.UserSaveMode;
};
CHistory.prototype.Is_Clear = function() {
    if ( this.Points.length <= 0 )
        return true;

    return false;
};
CHistory.prototype.Clear = function()
{
	this.Index         = -1;
	this.Points.length = 0;
	this.TurnOffHistory = 0;
	this.Transaction = 0;
	this.LoadFonts = {};
	this.HasLoadFonts = false;

	this.SavedIndex = null;
  this.ForceSave= false;
  this.UserSavedIndex = null;

	this._sendCanUndoRedo();
};
/** @returns {boolean} */
CHistory.prototype.Can_Undo = function()
{
	return this.Index >= 0;
};
/** @returns {boolean} */
CHistory.prototype.Can_Redo = function()
{
	return this.Points.length > 0 && this.Index < this.Points.length - 1;
};
/** @returns {boolean} */
CHistory.prototype.Undo = function()
{
  // Проверяем можно ли сделать Undo
  if (true !== this.Can_Undo()) {
    return false;
  }

	if (this.Index === this.Points.length - 1)
		this.LastState = this.workbook.handlers.trigger("getSelectionState");

	var Point = this.Points[this.Index--];
	var oRedoObjectParam = new AscCommonExcel.RedoObjectParam();
	this.UndoRedoPrepare(oRedoObjectParam, true);

	// Откатываем все действия в обратном порядке (относительно их выполенения)
	for ( var Index = Point.Items.length - 1; Index >= 0; Index-- )
	{
		var Item = Point.Items[Index];



		if(!Item.Class.Read_FromBinary2 && !Item.Class.IsChangesClass)
			Item.Class.Undo( Item.Type, Item.Data, Item.SheetId );
		else
		{
            if (Item.Class && Item.Class.IsChangesClass && Item.Class.IsChangesClass())
            {
                Item.Class.Undo();
                Item.Class.RefreshRecalcData();
            }
            else
            {
                Item.Class.Undo(Item.Type);
                Item.Class.Refresh_RecalcData && Item.Class.Refresh_RecalcData(Item.Type);
            }
        }

		this._addRedoObjectParam(oRedoObjectParam, Item);
	}
	this.UndoRedoEnd(Point, oRedoObjectParam, true);
  return true;
};
CHistory.prototype.UndoRedoPrepare = function (oRedoObjectParam, bUndo) {
	if (this.Is_On()) {
		oRedoObjectParam.bIsOn = true;
		this.TurnOff();
	}
	/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
	this.workbook.dependencyFormulas.lockRecal();

	if (bUndo)
		this.workbook.bUndoChanges = true;
	else
		this.workbook.bRedoChanges = true;

	if (!window["NATIVE_EDITOR_ENJINE"]) {
		var wsViews = Asc["editor"].wb.wsViews;
		for (var i = 0; i < wsViews.length; ++i) {
			if (wsViews[i]) {
				if (wsViews[i].objectRender && wsViews[i].objectRender.controller) {
					wsViews[i].objectRender.controller.resetSelection(undefined, true);
				}
				wsViews[i].endEditChart();
			}
		}
	}
	if (window["NATIVE_EDITOR_ENJINE"] || !this.workbook.oApi.IsSendDocumentLoadCompleate) {
		oRedoObjectParam.bChangeActive = true;
	}
};
CHistory.prototype.RedoAdd = function(oRedoObjectParam, Class, Type, sheetid, range, Data, LocalChange)
{
	//todo сделать что-нибудь с Is_On
	var bNeedOff = false;
	if(false == this.Is_On())
	{
		this.TurnOn();
		bNeedOff = true;
	}
	//if(Class)
	this.Add(Class, Type, sheetid, range, Data, LocalChange);
	if(bNeedOff)
		this.TurnOff();

	var bChangeActive = oRedoObjectParam.bChangeActive && AscCommonExcel.g_oUndoRedoWorkbook === Class;
	if (bChangeActive && null != oRedoObjectParam.activeSheet) {
		//it can be delete action, so set active and get after action
		this.workbook.setActiveById(oRedoObjectParam.activeSheet);
	}

	// ToDo Убрать это!!!
	if(Class && !Class.Load_Changes && !Class.Load)
	{
		Class.Redo( Type, Data, sheetid );
	}
	else
	{
		if(Class && Data && !Data.isDrawingCollaborativeData)
			Class.Redo(Data);
		else
		{
			if(!Class){
				if(Data.isDrawingCollaborativeData){
			Data.oBinaryReader.Seek2(Data.nPos);
                    var nReaderPos   = Data.oBinaryReader.GetCurPos();
                    var nChangesType = Data.oBinaryReader.GetLong();

                    var changedObject = AscCommon.g_oTableId.Get_ById(Data.sChangedObjectId);
                    if(changedObject){

                        var fChangesClass = AscDFH.changesFactory[nChangesType];
                        if (fChangesClass)
			{
                            var oChange = new fChangesClass(changedObject);
                            oChange.ReadFromBinary(Data.oBinaryReader);
                            oChange.Load(new CDocumentColor(255, 255, 255));
			}
                        else
			{
                            Data.oBinaryReader.Seek2(nReaderPos);
                            changedObject.Load_Changes(Data.oBinaryReader, null, new CDocumentColor(255, 255, 255));
			}
		}
	}
			}
		}
	}
	if (bChangeActive) {
		oRedoObjectParam.activeSheet = this.workbook.getActiveWs().getId();
	}
    var curPoint = this.Points[this.Index];
    if (curPoint) {
        this._addRedoObjectParam(oRedoObjectParam, curPoint.Items[curPoint.Items.length - 1]);
    }
};

CHistory.prototype.CheckXfrmChanges = function(xfrm)
{
};

CHistory.prototype.RedoExecute = function(Point, oRedoObjectParam)
{
	// Выполняем все действия в прямом порядке
	for ( var Index = 0; Index < Point.Items.length; Index++ )
	{
		var Item = Point.Items[Index];
		if(!Item.Class.Read_FromBinary2 && !Item.Class.IsChangesClass)
			Item.Class.Redo( Item.Type, Item.Data, Item.SheetId );
		else
		{
			if(!Item.Data || !Item.Data.isDrawingCollaborativeData)
			{
                if (Item.Class && Item.Class.IsChangesClass && Item.Class.IsChangesClass())
                {
                    Item.Class.Redo();
                    Item.Class.RefreshRecalcData();
                }
			else
			{
                    Item.Class.Redo(Item.Type);
                    Item.Class.Refresh_RecalcData && Item.Class.Refresh_RecalcData(Item.Type);
                }

            }
			else
			{
				Item.Data.oBinaryReader.Seek(Item.Data.nPos);
				Item.Class.Load_Changes(Item.Data.oBinaryReader, null, new CDocumentColor(255, 255, 255));
			}
		}
		this._addRedoObjectParam(oRedoObjectParam, Item);
	}
	AscCommon.CollaborativeEditing.Apply_LinkData();
	var wsViews = Asc["editor"].wb.wsViews;
	this.Get_RecalcData(Point);
	for(var i = 0; i < wsViews.length; ++i)
	{
		if(wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller)
		{
			wsViews[i].objectRender.controller.recalculate2(undefined);
		}
	}
};
CHistory.prototype.UndoRedoEnd = function (Point, oRedoObjectParam, bUndo) {
	var wsViews, i, oState = null, bCoaut = false;
	if (!bUndo && null == Point) {
		Point = this.Points[this.Index];
		AscCommon.CollaborativeEditing.Apply_LinkData();
		bCoaut = true;
        if(!window["NATIVE_EDITOR_ENJINE"] || window['IS_NATIVE_EDITOR']) {
            this.Get_RecalcData(Point);
            wsViews = Asc["editor"].wb.wsViews;
            for (i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                    wsViews[i].objectRender.controller.recalculate2(true);
                }
            }
        }
	}

	/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
	this.workbook.dependencyFormulas.unlockRecal();

	if (null != Point) {
		//синхронизация index и id worksheet
		if (oRedoObjectParam.bUpdateWorksheetByModel)
			this.workbook.handlers.trigger("updateWorksheetByModel");

		if(!bCoaut)
		{
			oState = bUndo ? Point.SelectionState : ((this.Index === this.Points.length - 1) ?
				this.LastState : this.Points[this.Index + 1].SelectionState);
		}

		if (this.workbook.bCollaborativeChanges) {
		    //active может поменяться только при remove, hide листов
            var ws = this.workbook.getActiveWs();
            this.workbook.handlers.trigger('showWorksheet', ws.getId());
		}
		else {
		    // ToDo какое-то не очень решение брать 0-й элемент и у него получать индекс!
		    var nSheetId = (null !== oState) ? oState[0].worksheetId : ((this.workbook.bRedoChanges && null != Point.RedoSheetId) ? Point.RedoSheetId : Point.UndoSheetId);
		    if (null !== nSheetId)
		        this.workbook.handlers.trigger('showWorksheet', nSheetId);
		}
		//changeWorksheetUpdate before cleanCellCache to call _calcHeightRows
		for (i in oRedoObjectParam.oChangeWorksheetUpdate)
			this.workbook.handlers.trigger("changeWorksheetUpdate",
				oRedoObjectParam.oChangeWorksheetUpdate[i],{lockDraw: true, reinitRanges: true});

		for (i in Point.UpdateRigions)
			this.workbook.handlers.trigger("cleanCellCache", i, {'0': Point.UpdateRigions[i]}, true, oRedoObjectParam.bAddRemoveRowCol);

		if (oRedoObjectParam.bOnSheetsChanged)
			this.workbook.handlers.trigger("asc_onSheetsChanged");
		for (i in oRedoObjectParam.oOnUpdateTabColor) {
			var curSheet = this.workbook.getWorksheetById(i);
			if (curSheet)
				this.workbook.handlers.trigger("asc_onUpdateTabColor", curSheet.getIndex());
		}

        if(!window["NATIVE_EDITOR_ENJINE"] || window['IS_NATIVE_EDITOR']) {
            this.Get_RecalcData(Point);
            wsViews = Asc["editor"].wb.wsViews;
            for (i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                    wsViews[i].objectRender.controller.recalculate2(undefined);
                }
            }
        }

        if (bUndo) {
            if (Point.SelectionState) {
                this.workbook.handlers.trigger("setSelectionState", Point.SelectionState);
            } else {
                this.workbook.handlers.trigger("setSelection", Point.SelectRange.clone(), /*validRange*/false);
            }
        } else {
            if (null !== oState && oState[0] && oState[0].focus) {
                this.workbook.handlers.trigger("setSelectionState", oState);
            } else {
                var oSelectRange = null;
                if (null != Point.SelectRangeRedo)
                    oSelectRange = Point.SelectRangeRedo;
                else if (null != Point.SelectRange)
                    oSelectRange = Point.SelectRange;
                if (null != oSelectRange)
                    this.workbook.handlers.trigger("setSelection", oSelectRange.clone());
            }
        }

		if (oRedoObjectParam.oOnUpdateSheetViewSettings[this.workbook.getWorksheet(this.workbook.getActive()).getId()])
			this.workbook.handlers.trigger("asc_onUpdateSheetViewSettings");

		this._sendCanUndoRedo();
		if (bUndo)
			this.workbook.bUndoChanges = false;
		else
			this.workbook.bRedoChanges = false;
		if (oRedoObjectParam.bIsReInit)
			this.workbook.handlers.trigger("reInit");
		this.workbook.handlers.trigger("drawWS");
		if (bUndo) {
			if (AscCommon.isRealObject(this.lastDrawingObjects)) {
				this.lastDrawingObjects.sendGraphicObjectProps();
				this.lastDrawingObjects = null;
			}
		}
		if (oRedoObjectParam.bChangeActive && null != oRedoObjectParam.activeSheet) {
			this.workbook.setActiveById(oRedoObjectParam.activeSheet);
		}
	}


    if(!window["NATIVE_EDITOR_ENJINE"])
    {
        var wsView = window["Asc"]["editor"].wb.getWorksheet();
        if(wsView && wsView.objectRender && wsView.objectRender.controller)
        {
        	wsView.objectRender.controller.updateOverlay();
            wsView.objectRender.controller.updateSelectionState();
        }
    }

	if (oRedoObjectParam.bIsOn)
		this.TurnOn();
};
CHistory.prototype.Redo = function()
{
	// Проверяем можно ли сделать Redo
	if ( true != this.Can_Redo() )
		return;

	var oRedoObjectParam = new AscCommonExcel.RedoObjectParam();
	this.UndoRedoPrepare(oRedoObjectParam, false);

	var Point = this.Points[++this.Index];

	this.RedoExecute(Point, oRedoObjectParam);

	this.UndoRedoEnd(Point, oRedoObjectParam, false);
};
CHistory.prototype._addRedoObjectParam = function (oRedoObjectParam, Point) {
	if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class &&
		(AscCH.historyitem_Worksheet_SetDisplayGridlines === Point.Type ||
		AscCH.historyitem_Worksheet_SetDisplayHeadings === Point.Type)) {
		oRedoObjectParam.bIsReInit = true;
		oRedoObjectParam.oOnUpdateSheetViewSettings[Point.SheetId] = Point.SheetId;
	}
	else if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class && (AscCH.historyitem_Worksheet_RowProp == Point.Type || AscCH.historyitem_Worksheet_ColProp == Point.Type || AscCH.historyitem_Worksheet_RowHide == Point.Type))
		oRedoObjectParam.oChangeWorksheetUpdate[Point.SheetId] = Point.SheetId;
	else if (AscCommonExcel.g_oUndoRedoWorkbook === Point.Class && (AscCH.historyitem_Workbook_SheetAdd === Point.Type || AscCH.historyitem_Workbook_SheetRemove === Point.Type || AscCH.historyitem_Workbook_SheetMove === Point.Type)) {
		oRedoObjectParam.bUpdateWorksheetByModel = true;
		oRedoObjectParam.bOnSheetsChanged = true;
	}
	else if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class && (AscCH.historyitem_Worksheet_Rename === Point.Type || AscCH.historyitem_Worksheet_Hide === Point.Type))
		oRedoObjectParam.bOnSheetsChanged = true;
	else if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class && AscCH.historyitem_Worksheet_SetTabColor === Point.Type)
		oRedoObjectParam.oOnUpdateTabColor[Point.SheetId] = Point.SheetId;
	else if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class && AscCH.historyitem_Worksheet_ChangeFrozenCell === Point.Type)
		oRedoObjectParam.oOnUpdateSheetViewSettings[Point.SheetId] = Point.SheetId;
	else if (AscCommonExcel.g_oUndoRedoWorksheet === Point.Class && (AscCH.historyitem_Worksheet_RemoveRows === Point.Type || AscCH.historyitem_Worksheet_RemoveCols === Point.Type || AscCH.historyitem_Worksheet_AddRows === Point.Type || AscCH.historyitem_Worksheet_AddCols === Point.Type))
		oRedoObjectParam.bAddRemoveRowCol = true;
	else if(AscCommonExcel.g_oUndoRedoAutoFilters === Point.Class && AscCH.historyitem_AutoFilter_ChangeTableInfo === Point.Type)
		oRedoObjectParam.oChangeWorksheetUpdate[Point.SheetId] = Point.SheetId;

	if (null != Point.SheetId) {
		oRedoObjectParam.activeSheet = Point.SheetId;
	}
};
CHistory.prototype.Get_RecalcData = function(Point2)
{
	//if ( this.Index >= 0 )
	{
		//for ( var Pos = this.RecIndex + 1; Pos <= this.Index; Pos++ )
		{
			// Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
			var Point;
			if(Point2)
			{
				Point = Point2;
			}
			else
			{
				Point = this.Points[this.Index];
			}
			if(Point)
			{
				// Выполняем все действия в прямом порядке
				for ( var Index = 0; Index < Point.Items.length; Index++ )
				{
					var Item = Point.Items[Index];

					if (Item.Class && Item.Class.Refresh_RecalcData )
						Item.Class.Refresh_RecalcData( Item.Type );
					else if (Item.Class && Item.Class.RefreshRecalcData )
                        Item.Class.RefreshRecalcData();
					if(Item.Type === AscCH.historyitem_Workbook_ChangeColorScheme && Item.Class === AscCommonExcel.g_oUndoRedoWorkbook)
					{
						var wsViews = Asc["editor"].wb.wsViews;
						for(var i = 0; i < wsViews.length; ++i)
						{
							if(wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller)
							{
								wsViews[i].objectRender.controller.RefreshAfterChangeColorScheme();
							}
						}
					}
				}
			}
		}
	}
};

CHistory.prototype.Reset_RecalcIndex = function()
{
	this.RecIndex = this.Index;
};

CHistory.prototype.Add_RecalcNumPr = function()
{};

CHistory.prototype.Set_Additional_ExtendDocumentToPos = function()
{

};


CHistory.prototype.Check_UninonLastPoints = function()
{
	// Не объединяем точки истории, если на предыдущей точке произошло сохранение
	if ( this.Points.length < 2)
		return;

	var Point1 = this.Points[this.Points.length - 2];
	var Point2 = this.Points[this.Points.length - 1];

	// Не объединяем слова больше 63 элементов
	if ( Point1.Items.length > 63 )
		return;

	var PrevItem = null;
	var Class = null;
	for ( var Index = 0; Index < Point1.Items.length; Index++ )
	{
		var Item = Point1.Items[Index];

		if ( null === Class )
			Class = Item.Class;
		else if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
			return;

		PrevItem = Item;
	}

	for ( var Index = 0; Index < Point2.Items.length; Index++ )
	{
		var Item = Point2.Items[Index];

		if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
			return;

		PrevItem = Item;
	}

	var NewPoint =
	{
		State : Point1.State,
		Items : Point1.Items.concat(Point2.Items),
		Time  : Point1.Time,
		Additional : {}
	};

	if ( this.SavedIndex >= this.Points.length - 2 && null !== this.SavedIndex )
		this.Set_SavedIndex(this.Points.length - 3);

	this.Points.splice( this.Points.length - 2, 2, NewPoint );
	if ( this.Index >= this.Points.length )
	{
		var DiffIndex = -this.Index + (this.Points.length - 1);
		this.Index    += DiffIndex;
		this.RecIndex += Math.max( -1, this.RecIndex + DiffIndex);
	}
};

CHistory.prototype.Add_RecalcTableGrid = function()
{};

CHistory.prototype.Create_NewPoint = function()
{
	if ( 0 !== this.TurnOffHistory || 0 !== this.Transaction )
		return;

	this.CanNotAddChanges = false;

	if (null !== this.SavedIndex && this.Index < this.SavedIndex)
		this.Set_SavedIndex(this.Index);

	var Items = [];
	var UpdateRigions = {};
	var Time  = new Date().getTime();
	var UndoSheetId = null, oSelectionState = this.workbook.handlers.trigger("getSelectionState");
	var oSelectRange = null;
	var wsActive = this.workbook.getWorksheet(this.workbook.getActive());
	if (wsActive) {
		UndoSheetId = wsActive.getId();
		// ToDo Берем всегда, т.к. в случае с LastState мы можем не попасть на нужный лист и не заселектить нужный диапазон!
		oSelectRange = wsActive.selectionRange.getLast(); // ToDo get only last selection range
	}

    // Создаем новую точку
    this.Points[++this.Index] = {
		Items : Items, // Массив изменений, начиная с текущего момента
		UpdateRigions : UpdateRigions,
		UndoSheetId: UndoSheetId,
        RedoSheetId: null,
		SelectRange : oSelectRange,
		SelectRangeRedo : oSelectRange,
		Time  : Time,   // Текущее время
		SelectionState : oSelectionState
    };

    // Удаляем ненужные точки
    this.Points.length = this.Index + 1;

	this._addFonts(true);
};

// Регистрируем новое изменение:
// Class - объект, в котором оно произошло
// Data  - сами изменения
CHistory.prototype.Add = function(Class, Type, sheetid, range, Data, LocalChange)
{
	if ( 0 !== this.TurnOffHistory || this.Index < 0 )
		return;

	this._CheckCanNotAddChanges();

	var Item;
	if ( this.RecIndex >= this.Index )
		this.RecIndex = this.Index - 1;
		Item =
		{
			Class : Class,
			Type  : Type,
			SheetId : sheetid,
			Range : null,
			Data  : Data,
			LocalChange: this.LocalChange
		};
	if(null != range)
		Item.Range = range.clone();
	if(null != LocalChange)
		Item.LocalChange = LocalChange;

    var curPoint = this.Points[this.Index];
	curPoint.Items.push( Item );
	if (null != range && null != sheetid)
	{
		var updateRange = curPoint.UpdateRigions[sheetid];
		if(null != updateRange)
			updateRange.union2(range);
		else
			updateRange = range.clone();
		curPoint.UpdateRigions[sheetid] = updateRange;
	}
	if (null != sheetid)
		curPoint.UndoSheetId = sheetid;
	if(1 == curPoint.Items.length)
		this._sendCanUndoRedo();
};

CHistory.prototype._sendCanUndoRedo = function()
{
	this.workbook.handlers.trigger("setCanUndo", this.Can_Undo());
	this.workbook.handlers.trigger("setCanRedo", this.Can_Redo());
	this.workbook.handlers.trigger("setDocumentModified", this.Have_Changes());
};
CHistory.prototype.SetSelection = function(range)
{
	if ( 0 !== this.TurnOffHistory )
		return;
    var curPoint = this.Points[this.Index];
	if (curPoint) {
        curPoint.SelectRange = range;
    }
};
CHistory.prototype.SetSelectionRedo = function(range)
{
	if ( 0 !== this.TurnOffHistory )
		return;
    var curPoint = this.Points[this.Index];
	if (curPoint) {
        curPoint.SelectRangeRedo = range;
    }
};
CHistory.prototype.GetSelection = function()
{
	var oRes = null;
    var curPoint = this.Points[this.Index];
	if(curPoint)
		oRes = curPoint.SelectRange;
	return oRes;
};
CHistory.prototype.GetSelectionRedo = function()
{
	var oRes = null;
    var curPoint = this.Points[this.Index];
    if (curPoint) {
        oRes = curPoint.SelectRangeRedo;
    }
	return oRes;
};
CHistory.prototype.SetSheetRedo = function (sheetId) {
    if (0 !== this.TurnOffHistory)
        return;
    var curPoint = this.Points[this.Index];
    if (curPoint) {
        curPoint.RedoSheetId = sheetId;
    }
};
CHistory.prototype.SetSheetUndo = function (sheetId) {
    if (0 !== this.TurnOffHistory)
        return;
    var curPoint = this.Points[this.Index];
    if (curPoint) {
        curPoint.UndoSheetId = sheetId;
    }
};
CHistory.prototype.TurnOff = function()
{
	this.TurnOffHistory++;
};

CHistory.prototype.TurnOn = function()
{
	this.TurnOffHistory--;
	if(this.TurnOffHistory < 0)
		this.TurnOffHistory = 0;
};

CHistory.prototype.StartTransaction = function()
{
	this.Transaction++;
};

CHistory.prototype.EndTransaction = function()
{
	this.Transaction--;
	if(this.Transaction < 0)
		this.Transaction = 0;
};
/** @returns {boolean} */
CHistory.prototype.IsEndTransaction = function()
{
	return (0 === this.Transaction);
};
/** @returns {boolean} */
CHistory.prototype.Is_On = function()
{
	return (0 === this.TurnOffHistory);
};
CHistory.prototype.Reset_SavedIndex = function(IsUserSave) {
  this.SavedIndex = this.Index;
  if (this.Is_UserSaveMode()) {
    if (IsUserSave) {
      this.UserSavedIndex = this.Index;
      this.ForceSave  = false;
    }
  } else {
    this.ForceSave  = false;
  }
};
CHistory.prototype.Set_SavedIndex = function(Index) {
  this.SavedIndex = Index;
  if (this.Is_UserSaveMode()) {
    if (null !== this.UserSavedIndex && this.UserSavedIndex > this.SavedIndex) {
      this.UserSavedIndex = Index;
      this.ForceSave = true;
    }
  } else {
    this.ForceSave = true;
  }
};
/** @returns {number|null} */
CHistory.prototype.Get_DeleteIndex = function () {
	var DeletePointIndex = null !== this.SavedIndex ? Math.min(this.SavedIndex + 1, this.Index + 1) : null;
	if (null === DeletePointIndex)
		return null;
	var DeleteIndex = 0;
	for (var i = 0; i < DeletePointIndex; ++i) {
		var point = this.Points[i];
		for (var j = 0; j < point.Items.length; ++j) {
			if (!point.Items[j].LocalChange) {//LocalChange изменения не пойдут в совместное редактирование.
				DeleteIndex += 1;
			}
		}
	}
	return DeleteIndex;
};
/** @returns {boolean} */
CHistory.prototype.Have_Changes = function(IsNotUserSave) {
  var checkIndex = (this.Is_UserSaveMode() && !IsNotUserSave) ? this.UserSavedIndex : this.SavedIndex;
  if (-1 === this.Index && null === checkIndex && false === this.ForceSave) {
    return false;
  }

  return (this.Index != checkIndex || true === this.ForceSave);
};
CHistory.prototype.GetSerializeArray = function()
{
	var aRes = [];
	var i = 0;
	if (null != this.SavedIndex)
		i = this.SavedIndex + 1;
	for(; i <= this.Index; ++i)
	{
		var point = this.Points[i];
		var aPointChanges = [];
		for(var j = 0, length2 = point.Items.length; j < length2; ++j)
		{
			var elem = point.Items[j];
			aPointChanges.push(new AscCommonExcel.UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data, elem.LocalChange));
		}
		aRes.push(aPointChanges);
	}
	return aRes;
};
//функция, которая перемещает последнее действие на первую позицию(в текущей точке)
CHistory.prototype.ChangeActionsEndToStart = function()
{
	var curPoint = this.Points[this.Index];
	if(curPoint && curPoint.Items.length > 0)
	{
		var endAction = curPoint.Items.pop();
		curPoint.Items.unshift(endAction);
	}
};
CHistory.prototype.loadFonts = function (fonts) {
    for (var i = 0; i < fonts.length; ++i) {
		this.LoadFonts[fonts[i].name] = 1;
		this.HasLoadFonts = true;
	}
	this._addFonts(false);
};
CHistory.prototype._addFonts = function (isCreateNew) {
	// Если мы начали транзакцию или мы только создаем точку, то можно добавлять
	if (this.HasLoadFonts && (isCreateNew || !this.IsEndTransaction())) {
		var arrFonts = [];
		for (var i in this.LoadFonts)
			arrFonts.push(i);
		this.Add(AscCommonExcel.g_oUndoRedoWorkbook, AscCH.historyitem_Workbook_AddFont, null, null, new AscCommonExcel.UndoRedoData_SingleProperty(arrFonts));

		this.LoadFonts = {};
		this.HasLoadFonts = false;
	}
};
CHistory.prototype._CheckCanNotAddChanges = function () {
    try {
        if (this.CanNotAddChanges) {
            var tmpErr = new Error();
            if (tmpErr.stack) {
                this.workbook.oApi.CoAuthoringApi.sendChangesError(tmpErr.stack);
            }
        }
    } catch (e) {
    }
};

	//------------------------------------------------------------export--------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CHistory = CHistory;
	window['AscCommon'].History = new CHistory();
})(window);