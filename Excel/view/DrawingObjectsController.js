"use strict";

if(window.editor === "undefined" && window["Asc"]["editor"])
{
    window.editor = window["Asc"]["editor"];
	window.editor;
}

// ToDo убрать это отсюда!!!
CContentChangesElement.prototype.Refresh_BinaryData = function()
{
	this.m_pData.Pos = this.m_aPositions[0];

	if(editor && editor.isPresentationEditor)
	{
		var Binary_Writer = History.BinaryWriter;
		var Binary_Pos = Binary_Writer.GetCurPosition();

		this.m_pData.Data.UseArray = true;
		this.m_pData.Data.PosArray = this.m_aPositions;
		Binary_Writer.WriteString2(this.m_pData.Class.Get_Id());
		this.m_pData.Class.Save_Changes( this.m_pData.Data, Binary_Writer );

		var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;

		this.m_pData.Binary.Pos = Binary_Pos;
		this.m_pData.Binary.Len = Binary_Len;
	}
};

function CheckIdSatetShapeAdd(state)
{
    return !(state instanceof NullState);
}
DrawingObjectsController.prototype.getTheme = function()
{
    return window["Asc"]["editor"].wbModel.theme;
};

DrawingObjectsController.prototype.getDrawingArray = function()
{
    var ret = [];
    var drawing_bases = this.drawingObjects.getDrawingObjects();
    for(var i = 0; i < drawing_bases.length; ++i)
    {
        ret.push(drawing_bases[i].graphicObject);
    }
    return ret;
};

DrawingObjectsController.prototype.setTableProps = function(props)
{
    var by_type = this.getSelectedObjectsByTypes();
    if(by_type.tables.length === 1)
    {
        var target_text_object = getTargetTextObject(this);
        if(target_text_object === by_type.tables[0])
        {
            by_type.tables[0].graphicObject.Set_Props(props);
        }
        else
        {
            by_type.tables[0].graphicObject.Select_All();
            by_type.tables[0].graphicObject.Set_Props(props);
            by_type.tables[0].graphicObject.Selection_Remove();
        }
        editor.WordControl.m_oLogicDocument.Check_GraphicFrameRowHeight(by_type.tables[0]);
    }
};

DrawingObjectsController.prototype.RefreshAfterChangeColorScheme = function()
{
    var drawings = this.getDrawingArray();
    for(var i = 0; i < drawings.length; ++i)
    {
        if(drawings[i])
        {
            drawings[i].handleUpdateFill();
            drawings[i].handleUpdateLn();
            drawings[i].addToRecalculate();
        }
    }
};
DrawingObjectsController.prototype.updateOverlay = function()
{
    this.drawingObjects.OnUpdateOverlay();
};
DrawingObjectsController.prototype.recalculate = function(bAll, Point)
{

    History.Get_RecalcData(Point);//Только для таблиц
    if(bAll)
    {
        var drawings = this.getDrawingObjects();
        for(var i = 0; i < drawings.length; ++i)
        {
            if(drawings[i].recalcText)
            {
                drawings[i].recalcText();
            }
            drawings[i].recalculate();
        }
    }
    else
    {
        for(var key in this.objectsForRecalculate)
        {
            this.objectsForRecalculate[key].recalculate();
        }
    }
    this.objectsForRecalculate = {};
};

DrawingObjectsController.prototype.recalculate2 = function(bAll)
{
    if(bAll)
    {
        var drawings = this.getDrawingObjects();
        for(var i = 0; i < drawings.length; ++i)
        {
            if(drawings[i].recalcText)
            {
                drawings[i].recalcText();
            }
            drawings[i].recalculate();
        }
    }
    else
    {
        for(var key in this.objectsForRecalculate)
        {
            this.objectsForRecalculate[key].recalculate();
        }
    }
    this.objectsForRecalculate = {};
};


DrawingObjectsController.prototype.updateRecalcObjects = function()
{};
DrawingObjectsController.prototype.getTheme = function()
{
    return window["Asc"]["editor"].wbModel.theme;
};

DrawingObjectsController.prototype.startRecalculate = function()
{
    this.recalculate();
    this.drawingObjects.showDrawingObjects(true);
    //this.updateSelectionState();
};

DrawingObjectsController.prototype.getDrawingObjects = function()
{
    //TODO: переделать эту функцию. Нужно где-то паралельно с массивом DrawingBas'ов хранить масси graphicObject'ов.
    var ret = [];
    var drawing_bases = this.drawingObjects.getDrawingObjects();
    for(var i = 0; i < drawing_bases.length; ++i)
    {
        ret.push(drawing_bases[i].graphicObject);
    }
    return ret;
};
DrawingObjectsController.prototype.checkSelectedObjectsForMove = function(group)
{
    var selected_object = group ? group.selectedObjects : this.selectedObjects;
    for(var i = 0; i < selected_object.length; ++i)
    {
        if(selected_object[i].canMove())
        {
            this.arrPreTrackObjects.push(selected_object[i].createMoveTrack());
        }
    }
};

DrawingObjectsController.prototype.checkSelectedObjectsAndFireCallback = function(callback, args)
{
    var selection_state = this.getSelectionState();
    this.drawingObjects.objectLocker.reset();
    for(var i = 0; i < this.selectedObjects.length; ++i)
    {
        this.drawingObjects.objectLocker.addObjectId(this.selectedObjects[i].Get_Id());
    }
    var _this = this;
    var callback2 = function(bLock, bSync)
    {
        if(bLock)
        {
            if(bSync !== true)
            {
                _this.setSelectionState(selection_state);
            }
            callback.apply(_this, args);
        }
    };
    this.drawingObjects.objectLocker.checkObjects(callback2);
};
DrawingObjectsController.prototype.onMouseDown = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.metaKey || e.ctrlKey;
    e.Button = e.button;
    e.Type = g_mouse_event_type_down;
    var ret = this.curState.onMouseDown(e, x, y, 0);
    if(e.ClickCount < 2)
    {
        this.updateOverlay();
        this.updateSelectionState();
    }
    return ret;
};

DrawingObjectsController.prototype.OnMouseDown = DrawingObjectsController.prototype.onMouseDown;

DrawingObjectsController.prototype.onMouseMove = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.metaKey || e.ctrlKey;
    e.Button = e.button;
    e.Type = g_mouse_event_type_move;
    this.curState.onMouseMove(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseMove = DrawingObjectsController.prototype.onMouseMove;


DrawingObjectsController.prototype.onMouseUp = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.metaKey || e.ctrlKey;
    e.Button = e.button;
    e.Type = g_mouse_event_type_up;
    this.curState.onMouseUp(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseUp = DrawingObjectsController.prototype.onMouseUp;

DrawingObjectsController.prototype.createGroup = function()
{
    var group = this.getGroup();
    if(group)
    {
        var group_array = this.getArrayForGrouping();
        for(var i = group_array.length - 1; i > -1; --i)
        {
            group_array[i].deleteDrawingBase();
        }
        this.resetSelection();
        this.drawingObjects.getWorksheetModel && group.setWorksheet(this.drawingObjects.getWorksheetModel());
        group.setDrawingObjects(this.drawingObjects);
        if(this.drawingObjects && this.drawingObjects.cSld)
        {
            group.setParent(this.drawingObjects);
        }
        group.addToDrawingObjects();
        group.checkDrawingBaseCoords();
        this.selectObject(group, 0);
        group.addToRecalculate();
        this.startRecalculate();
    }
};
DrawingObjectsController.prototype.handleChartDoubleClick = function()
{
    var drawingObjects = this.drawingObjects;
    this.checkSelectedObjectsAndFireCallback(function(){drawingObjects.showChartSettings();}, []);
};

DrawingObjectsController.prototype.addChartDrawingObject = function(options)
{
    History.Create_NewPoint();
    var chart = this.getChartSpace(this.drawingObjects.getWorksheetModel(), options);
    if(chart)
    {
        chart.setWorksheet(this.drawingObjects.getWorksheetModel());
        chart.setStyle(2);
        chart.setBDeleted(false);
        this.resetSelection();
        var w, h;
        if(isRealObject(options) && isRealNumber(options.width) && isRealNumber(options.height))
        {
            w = this.drawingObjects.convertMetric(options.width, 0, 3);
            h = this.drawingObjects.convertMetric(options.height, 0, 3);
        }
        else
        {
            w = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartWidth, 0, 3);
            h = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartHeight, 0, 3);
        }

        var chartLeft, chartTop;
        if(options && isRealNumber(options.left) && options.left >= 0 && isRealNumber(options.top) && options.top >= 0)
        {
            chartLeft = this.drawingObjects.convertMetric(options.left, 0, 3);
            chartTop = this.drawingObjects.convertMetric(options.top, 0, 3);
        }
        else
        {
            chartLeft =  this.drawingObjects.convertMetric((this.drawingObjects.getContextWidth()  - w) / 2, 0, 3);
            if(chartLeft < 0)
            {
                chartLeft = 0;
            }
            chartTop =  this.drawingObjects.convertMetric((this.drawingObjects.getContextHeight()  - h) / 2, 0, 3);
            if(chartTop < 0)
            {
                chartTop = 0;
            }
        }


        chart.setSpPr(new CSpPr());
        chart.spPr.setParent(chart);
        chart.spPr.setXfrm(new CXfrm());
        chart.spPr.xfrm.setParent(chart.spPr);
        chart.spPr.xfrm.setOffX(chartLeft);
        chart.spPr.xfrm.setOffY(chartTop);
        chart.spPr.xfrm.setExtX(w);
        chart.spPr.xfrm.setExtY(h);

        chart.setDrawingObjects(this.drawingObjects);
        chart.setWorksheet(this.drawingObjects.getWorksheetModel());
        chart.addToDrawingObjects();
        this.resetSelection();
        this.selectObject(chart, 0);
        if(options)
        {
            var old_range = options.getRange();
            options.putRange(null);
            this.editChartCallback(options);
            options.putRange(old_range);
        }
        chart.addToRecalculate();
        chart.checkDrawingBaseCoords();
        this.startRecalculate();
        this.drawingObjects.sendGraphicObjectProps();
    }
};

DrawingObjectsController.prototype.isPointInDrawingObjects = function(x, y, e)
{
    this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
    var ret = this.curState.onMouseDown(e || {}, x, y, 0);
    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
    return ret;
};

DrawingObjectsController.prototype.handleDoubleClickOnChart = function(chart)
{
    this.changeCurrentState(new NullState());
};

DrawingObjectsController.prototype.addImageFromParams = function(rasterImageId, x, y, extX, extY)
{
    History.Create_NewPoint();
    var image = this.createImage(rasterImageId, x, y, extX, extY);
    this.resetSelection();
    image.setWorksheet(this.drawingObjects.getWorksheetModel());
    image.setDrawingObjects(this.drawingObjects);
    image.addToDrawingObjects();
    image.checkDrawingBaseCoords();
    this.selectObject(image, 0);
    image.addToRecalculate();
    this.startRecalculate();
};


DrawingObjectsController.prototype.addTextArtFromParams = function(nStyle, dRectX, dRectY, dRectW, dRectH, wsmodel)
{
    History.Create_NewPoint();
    var oTextArt = this.createTextArt(nStyle, false, wsmodel);
    this.resetSelection();
    oTextArt.setWorksheet(this.drawingObjects.getWorksheetModel());
    oTextArt.setDrawingObjects(this.drawingObjects);
    oTextArt.addToDrawingObjects();
    oTextArt.checkExtentsByDocContent();
    var dNewPoX = dRectX + (dRectW - oTextArt.spPr.xfrm.extX) / 2;
    if(dNewPoX < 0)
        dNewPoX = 0;
    var dNewPoY = dRectY + (dRectH - oTextArt.spPr.xfrm.extY) / 2;
    if(dNewPoY < 0)
        dNewPoY = 0;
    oTextArt.spPr.xfrm.setOffX(dNewPoX);
    oTextArt.spPr.xfrm.setOffY(dNewPoY);

    oTextArt.checkDrawingBaseCoords();
    this.selectObject(oTextArt, 0);
    var oContent = oTextArt.getDocContent();
    this.selection.textSelection = oTextArt;
    oContent.Select_All();
    oTextArt.addToRecalculate();
    this.startRecalculate();
};

DrawingObjectsController.prototype.isViewMode= function()
{
    return this.drawingObjects.isViewerMode();
};

DrawingObjectsController.prototype.getDrawingDocument = function()
{
    return this.drawingObjects.drawingDocument;
};
DrawingObjectsController.prototype.convertPixToMM = function(pix)
{
    return this.drawingObjects ? this.drawingObjects.convertMetric(pix, 0, 3) : 0;
};

DrawingObjectsController.prototype.setParagraphNumbering = function(Bullet)
{
    this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphPresentationNumbering, [Bullet], CTable.prototype.Set_ParagraphPresentationNumbering);
};

DrawingObjectsController.prototype.setParagraphIndent = function(Indent)
{
    if(isRealObject(Indent) && isRealNumber(Indent.Left) && Indent.Left < 0)
    {
        Indent.Left = 0;
    }
    this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphIndent, [Indent], CTable.prototype.Set_ParagraphIndent);
};

DrawingObjectsController.prototype.paragraphIncDecIndent = function(bIncrease)
{
    this.applyDocContentFunction(CDocumentContent.prototype.Increase_ParagraphLevel, [bIncrease], CTable.prototype.Increase_ParagraphLevel);
};

DrawingObjectsController.prototype.canIncreaseParagraphLevel = function(bIncrease)
{
    var content = this.getTargetDocContent();
    if(content)
    {
        var target_text_object = getTargetTextObject(this);
        if(target_text_object && target_text_object.getObjectType() === historyitem_type_Shape
            && (!target_text_object.isPlaceholder() || !target_text_object.getPhType() !== phType_title && target_text_object.getPhType() !== phType_ctrTitle))
        {
            return content.Can_IncreaseParagraphLevel(bIncrease);
        }
    }
    return false;
};


DrawingObjectsController.prototype.onKeyPress = function(e)
{
    if ( true === this.isViewMode())
        return false;
    if(e.CtrlKey || e.AltKey)
        return false;

    var Code;
    if (null != e.Which)
        Code = e.Which;
    else if (e.KeyCode)
        Code = e.KeyCode;
    else
        Code = 0;//special char

    var bRetValue = false;
    if ( Code > 0x20 )
    {
        if( window["Asc"]["editor"].collaborativeEditing.getFast()){
            this.checkSelectedObjectsAndCallbackNoCheckLock(function(){
                this.paragraphAdd( new ParaText( String.fromCharCode( Code ) ) );
            }, [], false, historydescription_Spreadsheet_ParagraphAdd);
        }
        else{
            this.checkSelectedObjectsAndCallback(function(){
                this.paragraphAdd( new ParaText( String.fromCharCode( Code ) ) );
            }, [], false, historydescription_Spreadsheet_ParagraphAdd);
        }
        bRetValue = true;
    }
    //if ( true == bRetValue )
    //    this.updateSelectionState();
    return bRetValue;
};