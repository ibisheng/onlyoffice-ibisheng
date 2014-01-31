"use strict";

var editor = window["Asc"]["editor"];

DrawingObjectsController.prototype.getTheme = function()
{
    return window["Asc"]["editor"].wbModel.theme;
};
DrawingObjectsController.prototype.getSlide = function()
{
    return null;
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
    this.selectObject(shape);
    this.startRecalculate();
};
DrawingObjectsController.prototype.recalculate = function()
{
    for(var key in this.objectsForRecalculate)
    {
        this.objectsForRecalculate[key].recalculate();
    }
    this.objectsForRecalculate = {};
};

DrawingObjectsController.prototype.updateRecalcObjects = function()
{};

DrawingObjectsController.prototype.startRecalculate = function()
{
	History.Get_RecalcData();//Только для таблиц
    this.recalculate();
    this.drawingObjects.showDrawingObjects(true);
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
    e.CtrlKey = e.ctrlKey;
    return this.curState.onMouseDown(e, x, y);

};

DrawingObjectsController.prototype.onMouseMove = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.ctrlKey;
    this.curState.onMouseMove(e, x, y);
};

DrawingObjectsController.prototype.onMouseUp = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.ctrlKey;
    this.curState.onMouseUp(e, x, y);
};

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
    group.setDrawingObjects(this.drawingObjects);
    group.addToDrawingObjects();
    this.selectObject(group);
    group.addToRecalculate();
    this.startRecalculate();
};

DrawingObjectsController.prototype.addChartDrawingObject = function(asc_chart, options)
{
    History.Create_NewPoint();
    var chart = this.getChartSpace(asc_chart, options);
    if(chart)
    {
		chart.setStyle(2);
        this.resetSelection();
        var chartLeft = this.drawingObjects.convertMetric(options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css('width')) / 2) - c_oAscChartDefines.defaultChartWidth / 2, 0, 3);
        var chartTop = this.drawingObjects.convertMetric(options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css('height')) / 2) - c_oAscChartDefines.defaultChartHeight / 2, 0, 3);
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
        chart.setSpPr(new CSpPr());
        chart.spPr.setParent(chart);
        chart.spPr.setXfrm(new CXfrm());
        chart.spPr.xfrm.setParent(chart.spPr);
        chart.spPr.xfrm.setOffX(chartLeft);
        chart.spPr.xfrm.setOffY(chartTop);
        chart.spPr.xfrm.setExtX(w);
        chart.spPr.xfrm.setExtY(h);

        chart.setDrawingObjects(this.drawingObjects);
        chart.addToDrawingObjects();
        this.selectObject(chart);
        chart.addToRecalculate();
        this.startRecalculate();
    }
};

DrawingObjectsController.prototype.isPointInDrawingObjects = function(x, y, e)
{
    this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
    var ret = this.onMouseDown(e || {}, x, y);
    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
    return ret;
}

DrawingObjectsController.prototype.handleDoubleClickOnChart = function(chart)
{
	this.changeCurrentState(new NullState());
}

DrawingObjectsController.prototype.addImageFromParams = function(rasterImageId, x, y, extX, extY)
{
	History.Create_NewPoint();
    var image = this.createImage(rasterImageId, x, y, extX, extY);
    this.resetSelection();
    image.setDrawingObjects(this.drawingObjects);
    image.addToDrawingObjects();
    this.selectObject(image);
    image.addToRecalculate();
    this.startRecalculate();
}

DrawingObjectsController.prototype. isViewMode= function()
{
	return this.drawingObjects.isViewerMode();
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
				History.Create_NewPoint();
				this.paragraphAdd( new ParaText( String.fromCharCode( Code ) ) );
				this.startRecalculate();
			}, []);
		bRetValue = true;
	}
	if ( true == bRetValue )
		this.updateSelectionState();
	return bRetValue;
};

DrawingObjectsController.prototype.onKeyDown = function(e)
{

        var bUpdateSelection = true;
        var bRetValue = false;

        if ( e.KeyCode == 8 && false === this.isViewMode() ) // BackSpace
        {
            this.checkSelectedObjectsAndCallback(
			function(){
                History.Create_NewPoint();
                this.remove( -1, true );
				}, []);
            bRetValue = true;
        }
        else if ( e.KeyCode == 9 && false === this.isViewMode() ) // Tab
        {
			var cur_text_object = this.getCurrentTextObject();
			if(cur_text_object)
			{				
				var selected_info = new CSelectedElementsInfo();
				cur_text_object.getSelectedTextInfo(selected_info);
                if ( true === selected_info.Is_MixedSelection() )
                {
					this.checkSelectedObjectsAndFireCallback(function(shiftKey)
					{
						History.Create_NewPoint();		
						if ( true === e.ShiftKey )
							this.setParagraphIndent({ChangeLevel: -1});
						else
							this.setParagraphIndent({ChangeLevel: 1});
					}, [e.ShiftKey]);
                }
                else
                {
                    var Paragraph = SelectedInfo.Get_Paragraph();
                    var ParaPr    = Paragraph.Get_CompiledPr2(false).ParaPr;
                    if ( null != Paragraph && ( true === Paragraph.Cursor_IsStart() || true === Paragraph.Selection_IsFromStart() ) && ( undefined != Paragraph.Numbering_Get() || ( true != Paragraph.IsEmpty() && ParaPr.Tabs.Tabs.length <= 0 ) ) )
                    {
						this.checkSelectedObjectsAndFireCallback(function(shiftKey)
						{
							History.Create_NewPoint();		
                            Paragraph.Add_Tab(shiftKey);
                            this.Recalculate();

                            this.Document_UpdateInterfaceState();
                            this.Document_UpdateSelectionState();
						}, [e.ShiftKey]);
						
                    }
                    else
                    {
						this.checkSelectedObjectsAndFireCallback(function(shiftKey)
						{
							History.Create_NewPoint();
							this.paragraphAdd(new ParaTab());
						}, []);
                    }
                }
			}
			else
			{
				switch(state.id)
				{
					case STATES_ID_NULL:
					{
						var drawing_objects = this.getDrawingObjects();
						if(!e.ShiftKey)
						{
							var last_selected = null, last_selected_index = null;
							for(var i = drawing_objects.length - 1;  i > -1; --i)
							{
								if(drawing_objects[i].selected)
								{
									last_selected = drawing_objects[i];
									last_selected_index = i;
									break;
								}
							}
							if(isRealObject(last_selected))
							{
								bRetValue = true;
								drawingObjectsController.resetSelection();
								if(!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0)
								{
									if(last_selected_index < drawing_objects.length - 1)
									{
										this.select(drawing_objects[last_selected_index+1]);
									}
									else
									{
										this.select(drawing_objects[0]);
									}
								}
								else
								{
									this.select(last_selected);
									last_selected.select(last_selected.arrGraphicObjects[0]);
									this.changeCurrentState(new GroupState(this, last_selected));
								}
							}
						}
						else
						{
							var first_selected = null, first_selected_index = null;
							for(var i = 0; i < drawing_objects.length; ++i)
							{
								if(drawing_objects[i].selected)
								{
									first_selected = drawing_objects[i];
									first_selected_index = i;
									break;
								}
							}
							if(isRealObject(first_selected))
							{
								bRetValue = true;
								drawingObjectsController.resetSelection();
								if(first_selected_index > 0)
								{
									this.select(drawing_objects[first_selected_index - 1]);
								}
								else
								{
									this.select(drawing_objects[drawing_objects.length - 1]);
								}
							}
						}
						break;
					}
					case STATES_ID_GROUP:
					{
						var group = state.group;
						var arr_graphic_objects = group.arrGraphicObjects;
						if(!e.ShiftKey)
						{
							for(var i = arr_graphic_objects.length - 1; i > -1; --i)
							{
								if(arr_graphic_objects[i].selected)
								{
									break;
								}
							}
							group.resetSelection();
							if(i < arr_graphic_objects.length - 1)
							{
								group.select(arr_graphic_objects[i+1]);
							}
							else
							{
								this.resetSelectionState();
								var drawing_objects = this.getDrawingObjects();
								for(var i = 0; i < drawing_objects.length; ++i)
								{
									if(drawing_objects === group)
									{
										break;
									}
								}
								if(i < drawing_objects.length)
								{
									this.select(drawing_objects[i+1]);
								}
								else
								{
									this.select(drawing_objects[0]);
								}
							}
						}
						else
						{
							for(var i = 0; i < arr_graphic_objects.length; ++i)
							{
								if(arr_graphic_objects[i].selected)
								{
									break;
								}
							}
							group.resetSelection();
							if(i > 0)
							{
								this.group.select(arr_graphic_objects[i - 1]);
							}
							else
							{
								this.resetSelectionState();
								this.select(group);
							}
						}
						break;
					}
				}
			}
            bRetValue = true;
        }
        else if ( e.KeyCode == 13 && false === this.isViewMode() ) // Enter
        {
            var Hyperlink = this.Hyperlink_Check(false);
            if ( null != Hyperlink && false === e.ShiftKey )
            {
				//TODO: обработать нажатие Enter в гиперссылке в разных редакторах;
                /*editor.sync_HyperlinkClickCallback( Hyperlink.Get_Value() )
                Hyperlink.Set_Visited(true);

                // TODO: Пока сделаем так, потом надо будет переделать
                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();*/
            }
            else
            {
				var cur_text_object = this.getCurrentTextObject();
				if(cur_text_object)
				{
					this.checkSelectedObjectsAndFireCallback(function(e)
					{
						//TODO: Посмотреть поведение в PowerPoint;
						History.Create_NewPoint();
						this.Create_NewHistoryPoint();
						if ( e.ShiftKey )
						{
							this.paragraphAdd( new ParaNewLine( break_Line ) );
						}
						else if ( e.CtrlKey )
						{
						}
						else
						{
							this.addNewParagraph();
						}
					}, [e]);
				}
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 27 ) // Esc
        {
            //TODO:
            bRetValue = true;
        }
        else if ( e.KeyCode == 32 && false === this.isViewMode() ) // Space
        {
			var cur_text_object = this.getCurrentTextObject();
			if(cur_text_object)
			{
				this.checkSelectedObjectsAndFireCallback(function(e)
				{
					History.Create_NewPoint();
					if ( true === e.ShiftKey && true === e.CtrlKey )
					{
						this.paragraphAdd( new ParaText( String.fromCharCode( 0x00A0 ) ) );
					}
					else if ( true === e.CtrlKey )
					{
						this.paragraphClearFormatting();
					}
					else
					{
						this.paragraphAdd( new ParaSpace( 1 ) );
					}
				}, [e]);
			}
			else
			{
				//TODO: как устаканится с чартами реализовать
			}
            bRetValue = true;
        }
        else if ( e.KeyCode == 33 ) // PgUp
        {
            // TODO: Реализовать Ctrl + Shift + PgUp / Ctrl + PgUp / Shift + PgUp

            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage--;

                if ( this.CurPage < 0 )
                    this.CurPage = 0;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );

                bRetValue = true;
            }
            else
            {
                var TempXY = this.Cursor_GetPos();

                var X = TempXY.X;
                var Y = TempXY.Y;

                var Dy = this.DrawingDocument.GetVisibleMMHeight();
                if ( Y - Dy < 0 )
                {
                    this.CurPage--;
                    Dy -= Y;
                    Y = Page_Height;
                    while ( Dy > Page_Height )
                    {
                        Dy -= Page_Height;
                        this.CurPage--;
                    }

                    if ( this.CurPage < 0 )
                    {
                        this.CurPage = 0;
                        Dy = Page_Height - this.Content[0].Pages[this.Content[0].Pages.length - 1].Bounds.Top;
                    }
                }

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount;

                var StartX = X;
                var StartY = Y;
                var CurY   = Y;

                while ( Math.abs(StartY - Y) < 0.001 )
                {
                    var bBreak = false;
                    CurY -= Dy;

                    if ( CurY < 0 )
                    {
                        this.CurPage--;
                        CurY = Page_Height;

                        // Эта проверка нужна для выполнения PgUp в начале документа
                        if ( this.CurPage < 0 )
                        {
                            this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                            CurY = 0;
                        }

                        // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                        bBreak = true;
                    }

                    this.Cursor_MoveAt( StartX, CurY, false );
                    this.CurPos.RealX = StartX;
                    this.CurPos.RealY = CurY;

                    TempXY = this.Cursor_GetPos();
                    X = TempXY.X;
                    Y = TempXY.Y;

                    if ( true === bBreak )
                        break;
                }

                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            // TODO: Реализовать Ctrl + Shift + PgDn / Ctrl + PgDn / Shift + PgDn

            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage++;

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount - 1;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );

                bRetValue = true;
            }
            else
            {
                var TempXY = this.Cursor_GetPos();

                var X = TempXY.X;
                var Y = TempXY.Y;

                var Dy = this.DrawingDocument.GetVisibleMMHeight();
                if ( Y + Dy > Page_Height )
                {
                    this.CurPage++;
                    Dy -= Page_Height - Y;
                    Y = 0;
                    while ( Dy > Page_Height )
                    {
                        Dy -= Page_Height;
                        this.CurPage++;
                    }

                    // TODO: переделать данную проверку
                    if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    {
                        this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                        Dy = this.Content[this.Content.length - 1].Pages[this.Content[this.Content.length - 1].Pages.length - 1].Bounds.Bottom;
                    }
                }

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount;

                var StartX = X;
                var StartY = Y;
                var CurY   = Y;

                while ( Math.abs(StartY - Y) < 0.001 )
                {
                    var bBreak = false;
                    CurY += Dy;

                    if ( CurY > Page_Height )
                    {
                        this.CurPage++;
                        CurY = 0;

                        // TODO: переделать данную проверку
                        // Эта проверка нужна для выполнения PgDn в конце документа
                        if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                        {
                            var LastElement = this.Content[this.Content.length - 1];
                            this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                            CurY = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                        }

                        // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                        bBreak = true;
                    }

                    this.Cursor_MoveAt( StartX, CurY, false );
                    this.CurPos.RealX = StartX;
                    this.CurPos.RealY = CurY;

                    TempXY = this.Cursor_GetPos();
                    X = TempXY.X;
                    Y = TempXY.Y;

                    if ( true === bBreak )
                        break;
                }

                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
            if ( true === e.CtrlKey ) // Ctrl + End - переход в конец документа
            {
                this.Cursor_MoveToEndPos( true === e.ShiftKey );
            }
            else // Переходим в конец строки
            {
                this.Cursor_MoveEndOfLine( true === e.ShiftKey );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
            if ( true === e.CtrlKey ) // Ctrl + Home - переход в начало документа
            {
                this.Cursor_MoveToStartPos( true === e.ShiftKey );
            }
            else // Переходим в начало строки
            {
                this.Cursor_MoveStartOfLine( true === e.ShiftKey );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveLeft( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            // TODO: Реализовать Ctrl + Up/ Ctrl + Shift + Up
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveRight( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            // TODO: Реализовать Ctrl + Down/ Ctrl + Shift + Down
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveDown( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 45 ) // Insert
        {
            if ( true === e.CtrlKey ) // Ctrl + Insert (аналогично Ctrl + C)
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
            else if ( true === e.ShiftKey && false === this.isViewMode() ) // Shift + Insert (аналогично Ctrl + V)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 46 && false === this.isViewMode() ) // Delete
        {
            if ( true != e.ShiftKey )
            {
				this.checkSelectedObjectsAndFireCallback(function()
				{
					this.Create_NewHistoryPoint();
                    this.Remove( 1, true );
				}, []);
                bRetValue = true;
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
				this.checkSelectedObjectsAndFireCallback(function()
				{
                    this.Create_NewHistoryPoint();
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
				}, []);
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 49 && false === this.isViewMode() && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num1 - применяем стиль Heading1
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 1" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 50 && false === this.isViewMode() && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num2 - применяем стиль Heading2
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 2" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 51 && false === this.isViewMode() && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num3 - применяем стиль Heading3
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 3" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
        {
            this.Select_All();
            bRetValue = true;
        }
        else if ( e.KeyCode == 66 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Bold : TextPr.Bold === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + C - копирование форматирования текста
            {
                this.Document_Format_Copy();
                bRetValue = true;
            }
            else // Ctrl + C - copy
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 69 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + E + ...
        {
            if ( true !== e.AltKey ) // Ctrl + E - переключение прилегания параграфа между center и left
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = true;
                }
            }
            else // Ctrl + Alt + E - добавляем знак евро €
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();

                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.TargetShow();
                    this.Paragraph_Add( new ParaText( "€" ) );
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 73 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Italic : TextPr.Italic === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 74 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Justify ? align_Left : align_Justify );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 75 && false === this.isViewMode() && true === e.CtrlKey && false === e.ShiftKey ) // Ctrl + K - добавление гиперссылки
        {
            if ( true === this.Hyperlink_CanAdd(false) )
                editor.sync_DialogAddHyperlink();

            bRetValue = true;
        }
        else if ( e.KeyCode == 76 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + L + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + L - добавляем список к данному параграфу
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphNumbering( { Type : 0, SubType : 1 } );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
            else // Ctrl + L - переключение прилегания параграфа между left и justify
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Left ? align_Justify : align_Left );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 77 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + M + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + M - уменьшаем левый отступ
                editor.DecreaseIndent();
            else // Ctrl + M - увеличиваем левый отступ
                editor.IncreaseIndent();
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            if ( true === e.ShiftKey && false === this.isViewMode() ) // Ctrl + Shift + P - добавляем номер страницы в текущую позицию
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaPageNum() );
                }
                bRetValue = true;
            }
            else // Ctrl + P - print
            {
                this.DrawingDocument.m_oWordControl.m_oApi.asc_Print();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 82 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Right ? align_Left : align_Right );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 83 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + S - save
        {
            this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
            bRetValue = true;
        }
        else if ( e.KeyCode == 85 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Underline : TextPr.Underline === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 86 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + V - paste
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
                {
                    this.Create_NewHistoryPoint();
                    this.Document_Format_Paste();
                    bRetValue = true;
                }
                else // Ctrl + V - paste
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                    else
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                            bRetValue = true;
                    }
                }
            }
        }
		else if ( e.KeyCode == 88 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + X - cut
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
            }
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.KeyCode == 89 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + Y - Redo
        {
            this.Document_Redo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 90 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + Z - Undo
        {
            this.Document_Undo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 93 || 57351 == e.KeyCode /*в Opera такой код*/ ) // контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 121 && true === e.ShiftKey ) // Shift + F10 - контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 144 ) // Num Lock
        {
            // Ничего не делаем
            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 145 ) // Scroll Lock
        {
            // Ничего не делаем
            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 187 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    if ( true === e.ShiftKey )
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    else
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 189 && false === this.isViewMode() ) // Клавиша Num-
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();

                var Item = null;
                if ( true === e.CtrlKey && true === e.ShiftKey )
                {
                    Item = new ParaText( String.fromCharCode( 0x2013 ) );
                    Item.SpaceAfter = false;
                }
                else if ( true === e.ShiftKey )
                    Item = new ParaText( "_" );
                else
                    Item = new ParaText( "-" );

                this.Paragraph_Add( Item );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 190 && true === e.CtrlKey ) // Ctrl + .
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 219 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + [
        {
            editor.FontSizeOut();
            this.Document_UpdateInterfaceState();
        }
        else if ( e.KeyCode == 221 && false === this.isViewMode() && true === e.CtrlKey ) // Ctrl + ]
        {
            editor.FontSizeIn();
            this.Document_UpdateInterfaceState();
        }

        if ( true == bRetValue && true === bUpdateSelection )
            this.Document_UpdateSelectionState();
        
        return bRetValue;
};


    


function CheckRightButtonEvent(e)
{
	return e.button === 2;
}
