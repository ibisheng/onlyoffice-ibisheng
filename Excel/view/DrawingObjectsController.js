"use strict";

var editor = window["Asc"]["editor"];


function CContentChangesElement(Type, Pos, Count, Data)
{
    this.m_nType  = Type;  // Тип изменений (удаление или добавление)
    this.m_nPos   = Pos;   // Позиция, в которой произошли изменения
    this.m_nCount = Count; // Количество добавленных/удаленных элементов
    this.m_pData  = Data;  // Связанные с данным изменением данные из истории

    this.Refresh_BinaryData = function()
    {
        this.m_pData.oldValue = this.m_aPositions[0];
    };

    this.Check_Changes = function(Type, Pos)
    {
        var CurPos = Pos;
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos <= this.m_aPositions[Index] )
                        this.m_aPositions[Index]++;
                    else
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                }
            }
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos < this.m_aPositions[Index] )
                        this.m_aPositions[Index]--;
                    else if ( CurPos > this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                    else //if ( CurPos === this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Remove === this.m_nType )
                        {
                            // Отмечаем, что действия совпали
                            this.m_aPositions[Index] = false;
                            return false;
                        }
                        else
                        {
                            CurPos++;
                        }
                    }
                }
            }
        }

        return CurPos;
    };

    this.Make_ArrayOfSimpleActions = function(Type, Pos, Count)
    {
        // Разбиваем действие на простейшие
        var Positions = [];
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos + Index;
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos;
        }

        return Positions;
    };

    // Разбиваем сложное действие на простейшие
    this.m_aPositions = this.Make_ArrayOfSimpleActions( Type, Pos, Count );
}

function CContentChanges()
{
    this.m_aChanges = [];



    this.Add = function(Changes)
    {
        this.m_aChanges.push( Changes );
    };

    this.Clear = function()
    {
        this.m_aChanges.length = 0;
    };

    this.Check = function(Type, Pos)
    {
        var CurPos = Pos;
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var NewPos = this.m_aChanges[Index].Check_Changes(Type, CurPos);
            if ( false === NewPos )
                return false;

            CurPos = NewPos;
        }

        return CurPos;
    };

    this.Refresh = function()
    {
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.m_aChanges[Index].Refresh_BinaryData();
        }
    };
}

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

DrawingObjectsController.prototype.getSlide = function()
{
    return null;
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
DrawingObjectsController.prototype.getLayout = function()
{
    return null;
};
DrawingObjectsController.prototype.getMaster = function()
{
    return null;
};
DrawingObjectsController.prototype.updateOverlay = function()
{
    this.drawingObjects.OnUpdateOverlay();
};
DrawingObjectsController.prototype.endTrackNewShape = function()
{
    History.Create_NewPoint();
    var shape = this.arrTrackObjects[0].getShape();
    shape.setDrawingObjects(this.drawingObjects);
    shape.addToDrawingObjects();
    shape.addToRecalculate();
    this.arrTrackObjects.length = 0;
    this.changeCurrentState(new NullState(this));
    this.resetSelection();
    this.selectObject(shape, 0);
    this.startRecalculate();
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

DrawingObjectsController.prototype.updateRecalcObjects = function()
{};
DrawingObjectsController.prototype. getTheme = function()
{
    return window["Asc"]["editor"].wbModel.theme;
};

DrawingObjectsController.prototype.startRecalculate = function()
{
    this.recalculate();
    this.drawingObjects.showDrawingObjects(true);
    this.updateSelectionState();
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
    var callback2 = function(bLock)
    {
        if(bLock)
        {
            _this.setSelectionState(selection_state);
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
    History.Create_NewPoint();
    var group = this.getGroup();
    var group_array = this.getArrayForGrouping();
    for(var i = group_array.length - 1; i > -1; --i)
    {
        group_array[i].deleteDrawingBase();
    }
    this.resetSelection();
    group.setWorksheet(this.drawingObjects.getWorksheetModel());
    group.setDrawingObjects(this.drawingObjects);
    group.addToDrawingObjects();
    this.selectObject(group, 0);
    group.addToRecalculate();
    this.startRecalculate();
};
DrawingObjectsController.prototype.handleChartDoubleClick = function()
{
    var drawingObjects = this.drawingObjects;
    this.checkSelectedObjectsAndFireCallback(function(){this.drawingObjects.showChartSettings();}, []);
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
        this.startRecalculate();
        this.drawingObjects.sendGraphicObjectProps();
    }
};

DrawingObjectsController.prototype.isPointInDrawingObjects = function(x, y, e)
{
    this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
    var ret = this.curState.onMouseDown(e || {}, x, y);
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
    this.selectObject(image, 0);
    image.addToRecalculate();
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
        this.checkSelectedObjectsAndCallback(function()
        {
            this.paragraphAdd( new ParaText( String.fromCharCode( Code ) ) );
        }, []);
        bRetValue = true;
    }
    if ( true == bRetValue )
        this.updateSelectionState();
    return bRetValue;
};

function CheckRightButtonEvent(e)
{
    return e.button === 2;
}