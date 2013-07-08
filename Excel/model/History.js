var historyitem_Unknown = 0;

var historyitem_Workbook_SheetAdd = 1;
var historyitem_Workbook_SheetRemove = 2;
var historyitem_Workbook_SheetMove = 3;
var historyitem_Workbook_SheetPositions = 4;
var historyitem_Workbook_ChangeColorScheme = 5;

var historyitem_Worksheet_RemoveCell = 1;
var historyitem_Worksheet_RemoveRows = 2;
var historyitem_Worksheet_RemoveCols = 3;
var historyitem_Worksheet_AddRows = 4;
var historyitem_Worksheet_AddCols = 5;
var historyitem_Worksheet_ShiftCellsLeft = 6;
var historyitem_Worksheet_ShiftCellsTop = 7;
var historyitem_Worksheet_ShiftCellsRight = 8;
var historyitem_Worksheet_ShiftCellsBottom = 9;
var historyitem_Worksheet_ColProp = 10;
var historyitem_Worksheet_RowProp = 11;
var historyitem_Worksheet_Sort = 12;
var historyitem_Worksheet_MoveRange = 13;
var historyitem_Worksheet_Merge = 14;
var historyitem_Worksheet_Unmerge = 15;
var historyitem_Worksheet_SetHyperlink = 16;
var historyitem_Worksheet_RemoveHyperlink = 17;
var historyitem_Worksheet_Rename = 18;
var historyitem_Worksheet_Hide = 19;
var historyitem_Worksheet_CreateRow = 20;
var historyitem_Worksheet_CreateCol = 21;
var historyitem_Worksheet_CreateCell = 22;
var historyitem_Worksheet_SetViewSettings = 23;

var historyitem_RowCol_Fontname = 1;
var historyitem_RowCol_Fontsize = 2;
var historyitem_RowCol_Fontcolor = 3;
var historyitem_RowCol_Bold = 4;
var historyitem_RowCol_Italic = 5;
var historyitem_RowCol_Underline = 6;
var historyitem_RowCol_Strikeout = 7;
var historyitem_RowCol_FontAlign = 8;
var historyitem_RowCol_AlignVertical = 9;
var historyitem_RowCol_AlignHorizontal = 10;
var historyitem_RowCol_Fill = 11;
var historyitem_RowCol_Border = 12;
var historyitem_RowCol_ShrinkToFit = 13;
var historyitem_RowCol_Wrap = 14;
var historyitem_RowCol_NumFormat = 15;
var historyitem_RowCol_SetFont = 16;
var historyitem_RowCol_Angle = 17;
var historyitem_RowCol_SetStyle = 18;

var historyitem_Cell_Fontname = 1;
var historyitem_Cell_Fontsize = 2;
var historyitem_Cell_Fontcolor = 3;
var historyitem_Cell_Bold = 4;
var historyitem_Cell_Italic = 5;
var historyitem_Cell_Underline = 6;
var historyitem_Cell_Strikeout = 7;
var historyitem_Cell_FontAlign = 8;
var historyitem_Cell_AlignVertical = 9;
var historyitem_Cell_AlignHorizontal = 10;
var historyitem_Cell_Fill = 11;
var historyitem_Cell_Border = 12;
var historyitem_Cell_ShrinkToFit = 13;
var historyitem_Cell_Wrap = 14;
var historyitem_Cell_Numformat = 15;
var historyitem_Cell_ChangeValue = 16;
var historyitem_Cell_ChangeArrayValueFormat = 17;
var historyitem_Cell_SetStyle = 18;
var historyitem_Cell_SetFont = 19;
var historyitem_Cell_SetQuotePrefix = 20;
var historyitem_Cell_Angle = 21;

var historyitem_DrawingObject_Add = 1;
var historyitem_DrawingObject_Remove = 2;
var historyitem_DrawingObject_Edit = 3;
var historyitem_DrawingLayer = 4;

var historyitem_AutoShapes_Offset = 1;
var historyitem_AutoShapes_Extents = 2;
var historyitem_AutoShapes_Child_Offset = 3;
var historyitem_AutoShapes_Child_Extents = 4;
var historyitem_AutoShapes_Rotate = 5;
var historyitem_AutoShapes_Flips = 6;
var historyitem_AutoShapes_SetGuideValue = 7;

var historyitem_Comment_Add = 1;
var historyitem_Comment_Remove = 2;
var historyitem_Comment_Change = 3;

var historyitem_AutoFilter_Add		= 1;
var historyitem_AutoFilter_Sort		= 2;
var historyitem_AutoFilter_Empty	= 3;
var historyitem_AutoFilter_ApplyDF	= 4;
var historyitem_AutoFilter_ApplyMF	= 5;

// Типы изменений в классе CTableId
var historyitem_TableId_Add   = 1; // Добавили новую ссылку в глобальную таблицу
var historyitem_TableId_Reset = 2; // Изменили Id ссылки


function CHistory(workbook)
{
	this.workbook = workbook;
    this.Index    = -1;
	this.SavePoint = null;
    this.Points   = new Array();
	this.CurPoint = null;
	this.IsModify = false;
    this.TurnOffHistory = 0;
	this.Transaction = 0;
}
CHistory.prototype =
{
    Clear : function()
    {
        this.Index         = -1;
		this.SavePoint = null;
        this.Points.length = 0;
		this.CurPoint = null;
		this.IsModify = false;
		this.TurnOffHistory = 0;
		this.Transaction = 0;
		this._sendCanUndoRedo();
    },
    Can_Undo : function()
    {
        if ( (null != this.CurPoint && this.CurPoint.Items.length > 0) || this.Index >= 0 )
            return true;

        return false;
    },

    Can_Redo : function()
    {
        if ( (null == this.CurPoint || 0 == this.CurPoint.Items.length) && this.Points.length > 0 && this.Index < this.Points.length - 1 )
            return true;

        return false;
    },

    Undo : function()
    {
        // Проверяем можно ли сделать Undo
        if ( true != this.Can_Undo() )
            return null;
		var bIsOn = false;
		
		this._checkCurPoint();

		var Point = this.Points[this.Index--];
		
		if(this.Is_On())
		{
			bIsOn = true;
			this.TurnOff();
		}
		/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
		lockDraw(this.workbook);
		
		this.workbook.handlers.trigger("lockDraw");

		var isReInit = false;
		var oCurWorksheet = this.workbook.getWorksheet(this.workbook.getActive());
		if(null != Point.nLastSheetId && Point.nLastSheetId != oCurWorksheet.getId())
			this.workbook.handlers.trigger("showWorksheet", Point.nLastSheetId);
		var aStartTriggerAction = new Object();
        // Откатываем все действия в обратном порядке (относительно их выполенения)
        for ( var Index = Point.Items.length - 1; Index >= 0; Index-- )
        {
            var Item = Point.Items[Index];
			if(null != Item.SheetId && null == aStartTriggerAction[Item.SheetId])
			{
				var ws = this.workbook.getWorksheetById(Item.SheetId);
				ws.onStartTriggerAction();
				aStartTriggerAction[Item.SheetId] = ws;
			}
            Item.Class.Undo( Item.Type, Item.Data, Item.SheetId );
			if (g_oUndoRedoWorksheet === Item.Class && historyitem_Worksheet_SetViewSettings === Item.Type)
				isReInit = true;
        }
		for(var i in aStartTriggerAction)
			aStartTriggerAction[i].onEndTriggerAction();
		var oSelectRange = null;
		if(null != Point.SelectRange)
			oSelectRange = Point.SelectRange;
		for(var i in Point.Triggers)
			this.workbook.handlers.trigger.apply(this.workbook.handlers, Point.Triggers[i]);
		for(var i in Point.UpdateRigions)
		{
			this.workbook.handlers.trigger("cleanCellCache", i, Point.UpdateRigions[i]);
			if(null != Point.nLastSheetId && i - 0 == Point.nLastSheetId && null == oSelectRange)
				oSelectRange = Point.UpdateRigions[i];
		}
		if(false == Point.bNoSelect && null != oSelectRange)
			this.workbook.handlers.trigger("setSelection", oSelectRange.clone(), /*validRange*/false);
		
		this._sendCanUndoRedo();

		if (isReInit)
			this.workbook.handlers.trigger("reInit");
		this.workbook.handlers.trigger("drawWS");
		
		/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
		helpFunction(this.workbook);
		unLockDraw(this.workbook);
		if(bIsOn)
			this.TurnOn();
    },
	RedoPrepare : function (oRedoObjectParam) {
		if (this.Is_On()) {
			oRedoObjectParam.bIsOn = true;
			this.TurnOff();
		}
		/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
        lockDraw(this.workbook);
		
		this.workbook.handlers.trigger("lockDraw");
	},
	RedoAdd : function(oRedoObjectParam, Class, Type, sheetid, range, Data, LocalChange)
	{
		//todo сделать что-нибудь с Is_On
		var bNeedOff = false;
		if(false == this.Is_On())
		{
			this.TurnOn();
			bNeedOff = true;
		}
		this.Add(Class, Type, sheetid, range, Data, LocalChange);
		if(bNeedOff)
			this.TurnOff();
		if(null != sheetid && null == oRedoObjectParam.aStartTriggerAction[sheetid])
		{
			var ws = this.workbook.getWorksheetById(sheetid);
			ws.onStartTriggerAction();
			oRedoObjectParam.aStartTriggerAction[sheetid] = ws;
		}
		Class.Redo( Type, Data, sheetid );
		if (g_oUndoRedoWorksheet === Class && historyitem_Worksheet_SetViewSettings === Type)
			oRedoObjectParam.bIsReInit = true;
	},
	RedoExecute : function(Point, oRedoObjectParam)
	{
		// Выполняем все действия в прямом порядке
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];
			if(null != Item.SheetId && null == oRedoObjectParam.aStartTriggerAction[Item.SheetId])
			{
				var ws = this.workbook.getWorksheetById(Item.SheetId);
				ws.onStartTriggerAction();
				oRedoObjectParam.aStartTriggerAction[Item.SheetId] = ws;
			}
            Item.Class.Redo( Item.Type, Item.Data, Item.SheetId );
			if (g_oUndoRedoWorksheet === Item.Class && historyitem_Worksheet_SetViewSettings === Item.Type)
				oRedoObjectParam.bIsReInit = true;
        }
	},
	RedoEnd : function(Point, oRedoObjectParam)
	{
		if(null == Point)
		{
			this._checkCurPoint();
			Point = this.Points[this.Index];
		}
		if(null == Point)
			return;
		for(var i in oRedoObjectParam.aStartTriggerAction)
			oRedoObjectParam.aStartTriggerAction[i].onEndTriggerAction();
		for(var i in Point.Triggers)
			this.workbook.handlers.trigger.apply(this.workbook.handlers, Point.Triggers[i]);
		var oSelectRange = null;
		if(null != Point.SelectRangeRedo)
			oSelectRange = Point.SelectRangeRedo;
		else if(null != Point.SelectRange)
			oSelectRange = Point.SelectRange;
		for(var i in Point.UpdateRigions)
		{
			this.workbook.handlers.trigger("cleanCellCache", i, Point.UpdateRigions[i]);
			if(null != Point.nLastSheetId && i - 0 == Point.nLastSheetId && null == oSelectRange)
				oSelectRange = Point.UpdateRigions[i];
		}
		if(false == Point.bNoSelect && null != oSelectRange)
			this.workbook.handlers.trigger("setSelection", oSelectRange.clone());
		
		this._sendCanUndoRedo();

		if (oRedoObjectParam.bIsReInit)
			this.workbook.handlers.trigger("reInit");
		this.workbook.handlers.trigger("drawWS");
		
		/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
		helpFunction(this.workbook);
		unLockDraw(this.workbook);
		if(oRedoObjectParam.bIsOn)
			this.TurnOn();
	},
    Redo : function()
	{
		// Проверяем можно ли сделать Redo
        if ( true != this.Can_Redo() )
            return null;

		var oRedoObjectParam = new Asc.RedoObjectParam();
		this.RedoPrepare(oRedoObjectParam);
		
		this.CurPoint = null;
        var Point = this.Points[++this.Index];
		
		var oCurWorksheet = this.workbook.getWorksheet(this.workbook.getActive());
		if(null != Point.nLastSheetId && Point.nLastSheetId != oCurWorksheet.getId())
			this.workbook.handlers.trigger("showWorksheet", Point.nLastSheetId);
		this.RedoExecute(Point, oRedoObjectParam);
		
		this.RedoEnd(Point, oRedoObjectParam);
	},
    Create_NewPoint : function()
    {
		if ( 0 !== this.TurnOffHistory || 0 !== this.Transaction )
            return;
		this._checkCurPoint();
        var Items = new Array();
		var UpdateRigions = new Object();
        var Time  = new Date().getTime();
		this.CurPoint = {
            Items : Items, // Массив изменений, начиная с текущего момента
			Triggers : new Array(),
			UpdateRigions : UpdateRigions,
			nLastSheetId : null,
			SelectRange : null,
			SelectRangeRedo : null,
			bNoSelect : false,
            Time  : Time   // Текущее время
        };
    },
	
    // Регистрируем новое изменение:
    // Class - объект, в котором оно произошло
    // Data  - сами изменения
    Add : function(Class, Type, sheetid, range, Data, LocalChange)
    {
        if ( 0 !== this.TurnOffHistory )
            return;

        if ( null == this.CurPoint )
            return;
		var oCurPoint = this.CurPoint;
        var Item =
        {
            Class : Class,
			Type  : Type,
			SheetId : sheetid,
			Range : null,
            Data  : Data,
			LocalChange : false
        };
		if(null != range)
			Item.Range = range.clone();
		if(null != LocalChange)
			Item.LocalChange = LocalChange;
		
        oCurPoint.Items.push( Item );
		if(null != range)
		{
			var updateRange = oCurPoint.UpdateRigions[sheetid];
			if(null != updateRange)
				updateRange.union2(range);
			else
				updateRange = range.clone();
			oCurPoint.UpdateRigions[sheetid] = updateRange;
		}
		oCurPoint.nLastSheetId = sheetid;
		if(1 == oCurPoint.Items.length)
			this._sendCanUndoRedo();
    },
	
	AddTrigger : function(aArgs)
    {
        if ( 0 !== this.TurnOffHistory )
            return;

        if ( null == this.CurPoint )
            return;
		var bEqual = false;
		for(var i = 0, length = this.CurPoint.Triggers.length; i < length; ++i)
		{
			if(Asc.isEqual(aArgs, this.CurPoint.Triggers[i]))
			{
				bEqual = true;
				break;
			}
		}
		if(false == bEqual)
			this.CurPoint.Triggers.push(aArgs);
    },
	_sendCanUndoRedo : function()
	{
		this.workbook.handlers.trigger("setCanUndo", this.Can_Undo());
		this.workbook.handlers.trigger("setCanRedo", this.Can_Redo());
		if(this.IsModify != this.Is_Modified())
		{
			this.IsModify = !this.IsModify;
			this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
		}
	},
	_checkCurPoint : function()
	{
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
		{
			// Создаем новую точку
			this.Points[++this.Index] = this.CurPoint;
			// Удаляем ненужные точки
			this.Points.length = this.Index + 1;
			this.CurPoint = null;
		}
	},
	SetSelection : function(range, bNoSelect)
    {
        if ( 0 !== this.TurnOffHistory || 0 !== this.Transaction )
            return;

        if ( null == this.CurPoint )
            return;
        this.CurPoint.SelectRange = range;
		if(null != bNoSelect)
			this.CurPoint.bNoSelect = bNoSelect
    },
	SetSelectionRedo : function(range, bNoSelect)
    {
        if ( 0 !== this.TurnOffHistory || 0 !== this.Transaction )
            return;

        if ( null == this.CurPoint )
            return;
        this.CurPoint.SelectRangeRedo = range;
		if(null != bNoSelect)
			this.CurPoint.bNoSelect = bNoSelect
    },
	
    TurnOff : function()
    {
        this.TurnOffHistory++;
    },

    TurnOn : function()
    {
        this.TurnOffHistory--;
		if(this.TurnOffHistory < 0)
			this.TurnOffHistory = 0;
    },
	
    StartTransaction : function()
    {
        this.Transaction++;
    },

    EndTransaction : function()
    {
        this.Transaction--;
		if(this.Transaction < 0)
			this.Transaction = 0;
    },

    Is_On : function()
    {
        return ( 0 === this.TurnOffHistory ? true : false ) ;
    },
	Save : function()
	{
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
			this.SavePoint = this.CurPoint;
		else if(this.Index >= 0 && this.Index < this.Points.length)
			this.SavePoint = this.Points[this.Index];
		if(true == this.IsModify)
		{
			this.IsModify = !this.IsModify;
			this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
		}
	},
	Is_Modified : function()
    {
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
		{
			if(null != this.SavePoint)
				return this.CurPoint != this.SavePoint;
			else
				return true;
		}
		else if(this.Index >= 0 && this.Index < this.Points.length)
		{
			if(null != this.SavePoint)
				return this.Points[this.Index] != this.SavePoint;
			else
				return true;
		}
		else if(null != this.SavePoint)
			return true;
		return false;
    },
	GetSerializeArray : function()
	{
		var aRes = new Array();
		for(var i = 0; i <= this.Index; ++i)
		{
			var point = this.Points[i];
			for(var j = 0, length2 = point.Items.length; j < length2; ++j)
			{
				var elem = point.Items[j];
				if(true != elem.LocalChange)
					aRes.push(new UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data));
			}
		}
		if(null != this.CurPoint)
		{
			for(var j = 0, length2 = this.CurPoint.Items.length; j < length2; ++j)
			{
				var elem = this.CurPoint.Items[j];
				if(true != elem.LocalChange)
					aRes.push(new UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data));
			}
		}
		return aRes;
	}
};