/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */
function DrawingObjectsController(drawingObjects)
{
    this.drawingObjects = drawingObjects;

    this.curState = new NullState(this, drawingObjects);
    this.selectedObjects = [];
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.defaultColorMap = GenerateDefaultColorMap().color_map;
}

DrawingObjectsController.prototype =
{
    getColorMap: function()
    {
        return this.defaultColorMap;
    },

    getAscChartObject: function()
    {
        if(this.selectedObjects.length === 1)
        {
            if(this.selectedObjects[0].isChart())
                return this.selectedObjects[0].chart;
            if(isRealObject(this.curState.group))
            {
                if(this.curState.group.selectedObjects.length === 1)
                {
                    if(this.curState.group.selectedObjects[0].isChart())
                        return this.curState.group.selectedObjects[0].chart;
                }
            }
        }
        var chart = new asc_CChart();
        var worksheet = this.drawingObjects.getWorksheet();
        chart.range.interval = function() {
            var result = "";
            if (worksheet) {
                var selectedRange = worksheet.getSelectedRange();
                if (selectedRange) {
                    var box = selectedRange.getBBox0();
                    var startCell = new CellAddress(box.r1, box.c1, 0);
                    var endCell = new CellAddress(box.r2, box.c2, 0);

                    if (startCell && endCell) {
                        var wsName = worksheet.model.sName;
                        if ( !rx_test_ws_name.test(wsName) )
                            wsName = "'" + wsName + "'";

                        if (startCell.getID() == endCell.getID())
                            result = wsName + "!" + startCell.getID();
                        else
                            result = wsName + "!" + startCell.getID() + ":" + endCell.getID();
                    }
                }
            }
            return result;
        }();

        chart.range.intervalObject = function() {
            return worksheet ? worksheet.getSelectedRange() : null;
        }();
        return chart;
    },

    editChartDrawingObjects: function(chart)
    {
        if(this.selectedObjects.length === 1)
        {
            if(this.selectedObjects[0].isChart())
            {
                this.selectedObjects[0].setChart(chart);
                this.selectedObjects[0].recalculate();
                return;

            }
            if(isRealObject(this.curState.group))
            {
                if(this.curState.group.selectedObjects.length === 1)
                {
                    if(this.curState.group.selectedObjects[0].isChart())
                    {
                        this.curState.group.selectedObjects[0].setChart(chart);
                        this.curState.group.selectedObjects[0].recalculate();
                        return;
                    }
                }
            }
        }
    },

    addChartDrawingObject: function(chart, bWithoutHistory, options)
    {
        var chart_as_group = new CChartAsGroup(null, this.drawingObjects);
        chart_as_group.initFromChartObject(chart, bWithoutHistory, options);
    },

    changeCurrentState: function(newState)
    {
        this.curState = newState;
    },

    recalculateCurPos: function()
    {

        if(this.curState.id === STATES_ID_TEXT_ADD)
        {
            try
            {
                this.curState.textObject.recalculateCurPos();
            }
            catch (e)
            {

            }

        }
    },

    onMouseDown: function(e, x, y)
    {
        this.curState.onMouseDown(e, x, y);
        if(e.ClickCount < 2)
        {
            this.recalculateCurPos()
        }
    },

    onMouseMove: function(e, x, y)
    {
        this.curState.onMouseMove(e, x, y);
    },

    onMouseUp: function(e, x, y)
    {
        this.curState.onMouseUp(e, x, y);
    },

    onKeyDown: function(e)
    {
        this.curState.onKeyDown(e);
    },

    onKeyPress: function(e)
    {
        this.curState.onKeyPress(e);
    },

    resetSelectionState: function()
    {
        while(this.selectedObjects.length > 0)
            this.selectedObjects[0].deselect(this);
        this.changeCurrentState(new NullState(this, this.drawingObjects));
    },

    resetSelection: function()
    {
        while(this.selectedObjects.length > 0)
            this.selectedObjects[0].deselect(this);
    },

    clearPreTrackObjects: function()
    {
        this.arrPreTrackObjects.length = 0;
    },

    addPreTrackObject: function(preTrackObject)
    {
        this.arrPreTrackObjects.push(preTrackObject);
    },

    clearTrackObjects: function()
    {
        this.arrTrackObjects.length = 0;
    },

    addTrackObject: function(trackObject)
    {
        this.arrTrackObjects.push(trackObject);
    },

    swapTrackObjects: function()
    {
        this.clearTrackObjects();
        for(var i = 0; i < this.arrPreTrackObjects.length; ++i)
            this.addTrackObject(this.arrPreTrackObjects[i]);
        this.clearPreTrackObjects();
    },

    getTrackObjects: function()
    {
        return this.arrTrackObjects;
    },

    rotateTrackObjects: function(angle, e)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(angle, e);
    },

    trackNewShape: function(e, x, y)
    {
        this.arrTrackObjects[0].track(e, x, y);
    },

    trackMoveObjects: function(dx, dy)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(dx, dy);
    },

    trackAdjObject: function(x, y)
    {
        if(this.arrTrackObjects.length > 0)
            this.arrTrackObjects[0].track(x, y);
    },

    trackResizeObjects: function(kd1, kd2, e)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(kd1, kd2, e);
    },

    trackEnd: function()
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].trackEnd();
        this.drawingObjects.showDrawingObjects(true);
    },

    createGroup: function(drawingBase)
    {
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var grouped_objects = [];
        for(var i = 0; i < drawing_bases.length; ++i)
        {
            var cur_drawing_base = drawing_bases[i];
            if(cur_drawing_base.isGraphicObject() && cur_drawing_base.graphicObject.selected && cur_drawing_base.graphicObject.canGroup())
            {
                grouped_objects.push(cur_drawing_base.graphicObject);
            }
        }
        if(grouped_objects.length < 2)
            return null;

        this.resetSelection();
        var max_x, min_x, max_y, min_y;
        var bounds = grouped_objects[0].getBoundsInGroup();
        max_x = bounds.maxX;
        max_y = bounds.maxY;
        min_x = bounds.minX;
        min_y = bounds.minY;
        for(i = 1; i < grouped_objects.length; ++i)
        {
            bounds = grouped_objects[i].getBoundsInGroup();
            if(max_x < bounds.maxX)
                max_x = bounds.maxX;
            if(max_y < bounds.maxY)
                max_y = bounds.maxY;
            if(min_x > bounds.minX)
                min_x = bounds.minX;
            if(min_y > bounds.minY)
                min_y = bounds.minY;
        }
        var group = new CGroupShape(drawingBase, this.drawingObjects);
        group.setPosition(min_x, min_y);
        group.setExtents(max_x - min_x, max_y - min_y);
        group.setChildExtents(max_x - min_x, max_y - min_y);
        group.setChildOffsets(0, 0);
        for(i = 0; i < grouped_objects.length; ++i)
        {
            this.drawingObjects.deleteDrawingBase(grouped_objects[i].Id);
            grouped_objects[i].setDrawingBase(null);
            grouped_objects[i].setPosition(grouped_objects[i].x - min_x, grouped_objects[i].y - min_y);
            grouped_objects[i].setGroup(group);
            group.addToSpTree(grouped_objects[i]);
        }
        group.recalculate();
        group.select(this);
        return group;
    },

    unGroup: function()
    {
		if(isRealObject(this.curState.group) )
		{
			this.curState.group.resetSelection();
		}
		
		if(isRealObject(this.curState.chart) )
		{
			this.curState.chart.resetSelection();
		}
        var selected_objects = this.selectedObjects;
        var ungrouped_objects = [];
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i].isGroup() && selected_objects[i].canUnGroup())
            {
                ungrouped_objects.push(selected_objects[i]);

            }
        }
        for(i = 0; i < ungrouped_objects.length; ++i)
        {
            var ungrouped_sp_tree = ungrouped_objects[i].getUnGroupedSpTree();
            for(var j = 0; j < ungrouped_sp_tree.length; ++j)
            {
                ungrouped_sp_tree[j].recalculateTransform();
            }
            this.drawingObjects.insertUngroupedObjects(ungrouped_objects[i].drawingBase.id, ungrouped_sp_tree);
        }
		this.changeCurrentState(new NullState(this, this.drawingObjects));
		
    },

    canGroup: function()
    {
        return this.selectedObjects.length > 1;//TODO: сделать нормальную проверку
    },

    canUnGroup: function()
    {
        return true;
    },

    startTrackNewShape: function(presetGeom)
    {
        switch (presetGeom)
        {
            case "spline":
            {
                this.changeCurrentState(new SplineBezierState(this, this.drawingObjects));
                break;
            }
            case "polyline1":
            {
                this.changeCurrentState(new PolyLineAddState(this, this.drawingObjects));
                break;
            }
            case "polyline2":
            {
                this.changeCurrentState(new AddPolyLine2State(this, this.drawingObjects));
                break;
            }
            default :
            {
                this.changeCurrentState(new StartTrackNewShapeState(this, this.drawingObjects, presetGeom));
                break;
            }
        }
    },

    drawTracks: function(overlay)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].draw(overlay);
    },

    needUpdateOverlay: function()
    {
        return this.arrTrackObjects.length > 0;
    },

    drawSelection: function(drawingDocument)
    {
        this.curState.drawSelection(drawingDocument);
    },

    drawTextSelection: function()
    {
        if(isRealObject(this.curState.textObject) )
        {
            this.curState.textObject.drawTextSelection();
        }
    },

    isPointInDrawingObjects: function(x, y)
    {
        return this.curState.isPointInDrawingObjects(x, y);
    },
	
	getGraphicObjectProps: function()
	{
		var shape_props, image_props;
        
        switch (this.curState.id)
        {
            /*case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                var s_array = this.curState.group.selectionInfo.selectionArray;
                for(var i = 0; i< s_array.length; ++i)
                {
                    var c_obj = s_array[i];
                    if(c_obj.isImage() && c_obj.chart == null)
                    {
                        if(!isRealObject(image_props))
                        {
                            image_props = {fromGroup: true};
                            image_props.ImageUrl = c_obj.getImageUrl();
                        }
                        else
                        {
                            if(image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl)
                                image_props.ImageUrl = null;
                        }
                    }
                    if(c_obj.isImage() && isRealObject(c_obj.chart))
                    {
                        if(!isRealObject(chart_props))
                        {
                            chart_props = {fromGroup: true};
                            chart_props.ChartProperties = c_obj.chart;
                        }
                        else
                        {
                            chart_props.chart = null;
                            chart_props.severalCharts = true;
                            if(chart_props.severalChartTypes !== true)
                            {
                                if(!(chart_props.ChartProperties.type === c_obj.chart.type && chart_props.ChartProperties.subType === c_obj.chart.subType) )
                                    chart_props.severalChartTypes = true;
                            }
                            if(chart_props.severalChartStyles !== true)
                            {
                                if(chart_props.ChartProperties.styleId !== c_obj.chart.styleId )
                                    chart_props.severalChartStyles = true;
                            }
                        }
                    }
                    if(c_obj.isShape())
                    {
                        if(!isRealObject(shape_props))
                        {
                            shape_props = {fromGroup: true};
                            shape_props.ShapeProperties =
                            {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows()
                            };
                            shape_props.verticalTextAlign = c_obj.bodyPr.anchor;
                        }
                        else
                        {
                            var ShapeProperties =
                            {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows()
                            };
                            shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                            shape_props.verticalTextAlign = undefined;
                        }
                    }
                }
                break;
            }*/
            default :
            {
                var s_arr = this.selectedObjects;
                for(i = 0; i < s_arr.length; ++i)
                {
                    c_obj = s_arr[i];
                    if (isRealObject(c_obj))
                    {
                        if (c_obj.isShape())
                        {
                            if (!isRealObject(shape_props))
                            {
                                shape_props = {};
                                shape_props =  c_obj.Get_Props(null);
								shape_props.ShapeProperties = new asc_CShapeProperty();
								
								shape_props.ShapeProperties.type = c_obj.getPresetGeom();
                                shape_props.ShapeProperties.fill = c_obj.getFill();
                                shape_props.ShapeProperties.stroke = c_obj.getStroke();
                                shape_props.ShapeProperties.canChangeArrows = c_obj.canChangeArrows();
								
                                //shape_props.verticalTextAlign = c_obj.bodyPr.anchor;
                            }
                            else
                            {
								/* TODO
								ShapeProperties = new asc_CShapeProperty();
								ShapeProperties.type = c_obj.getPresetGeom();
                                ShapeProperties.fill = c_obj.getFill();
                                ShapeProperties.stroke = c_obj.getStroke();
                                ShapeProperties.canChangeArrows = c_obj.canChangeArrows();
								                                
                                shape_props =  c_obj.Get_Props(shape_props);
                                shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                                shape_props.verticalTextAlign = undefined;
								*/
                            }
                        }
                        if (c_obj.isImage())
                        {
                            if (!isRealObject(image_props))
                            {
                                image_props = new asc_CImgProperty;
                                image_props.Width = c_obj.extX;
								image_props.Height = c_obj.extY;
                                image_props.ImageUrl = c_obj.getImageUrl();
                            }
                            else
                            {
								/* TODO
                                image_props = c_obj.Get_Props(image_props);
                                if (image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl)
                                    image_props.ImageUrl = null;
								*/
                            }
                        }
                        
                        /*if (c_obj.isGroup())
                        {
                            var shape_props2 = c_obj.getShapeProps();
                            var image_props2 = c_obj.getImageProps2();
                            var chart_props2 = c_obj.getChartProps();
                            if(isRealObject(shape_props2))
                            {
                                if (!isRealObject(shape_props))
                                {
                                    shape_props = {};
                                    shape_props =  s_arr[i].Get_Props(null);
                                    shape_props.ShapeProperties = shape_props2.ShapeProperties;
                                }
                                else
                                {
                                    shape_props =  s_arr[i].Get_Props(shape_props);
                                    shape_props.ShapeProperties = CompareShapeProperties(shape_props2.ShapeProperties, shape_props.ShapeProperties);
                                }
                            }

                            if (isRealObject(image_props2))
                            {
                                if(!isRealObject(image_props))
                                {
                                    image_props = {};
                                    image_props = s_arr[i].Get_Props(null);
                                    image_props.ImageUrl = image_props2.ImageUrl;
                                }
                                else
                                {
                                    image_props = s_arr[i].Get_Props(image_props);
                                    if(image_props.ImageUrl != null && image_props2.ImageUrl !== image_props.ImageUrl)
                                        image_props.ImageUrl = null;
                                }
                            }
                            if (isRealObject(chart_props2))
                            {
                                if (!isRealObject(chart_props))
                                {
                                    chart_props = {};
                                    chart_props = s_arr[i].Get_Props(null);
                                    chart_props.ChartProperties = chart_props2.ChartProperties;
                                    chart_props.severalCharts = chart_props2.severalCharts;
                                    chart_props.severalChartTypes = chart_props2.severalChartTypes;
                                    chart_props.severalChartStyles = chart_props2.severalChartStyles;
                                }
                                else
                                {
                                    chart_props = s_arr[i].Get_Props(chart_props);
                                    chart_props.severalCharts = true;
                                    if(chart_props.severalChartTypes !== true)
                                    {
                                        if(chart_props2.severalChartTypes === true)
                                            chart_props.severalChartTypes = true;
                                        else
                                        {
                                            if(!(chart_props.ChartProperties.type === chart_props2.ChartProperties.type && chart_props.ChartProperties.subType === chart_props2.ChartProperties.subType) )
                                                chart_props.severalChartTypes = true;
                                            if(chart_props.ChartProperties.subType !== chart_props2.ChartProperties.subType  )
                                                chart_props.severalChartStyles = true;
                                        }
                                    }
                                }
                            }

                        }*/
                    }
                }
                break;
            }
        }
		
        var ret = [];
        if (isRealObject(shape_props))
        {
            if (shape_props.ShapeProperties)
            {
                var pr = shape_props.ShapeProperties;
                if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP)
                {
                    this.drawingObjects.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
                }
				shape_props.ShapeProperties.fill = CreateAscFillEx(c_obj.getFill());
				shape_props.ShapeProperties.stroke = CreateAscStrokeEx(c_obj.getStroke());

                //shape_props.ShapeProperties = CreateAscShapePropFromProp(shape_props.ShapeProperties);		// уже не надо, т.к. это asc_класс
            }
            
            ret.push(shape_props);
        }

        if (isRealObject(image_props))
        {
            //if (image_props.ShapeProperties)
            //    image_props.ShapeProperties = CreateAscShapePropFromProp(image_props.ShapeProperties);		// уже не надо, т.к. это asc_класс
            
            ret.push(image_props);
        }
			
		var ascSelectedObjects = [];
		for (var i = 0; i < ret.length; i++) {
			ascSelectedObjects.push(new asc_CSelectedObject( c_oAscTypeSelectElement.Image, new asc_CImgProperty(ret[i]) ));
		}
		
        return ascSelectedObjects;
	},
	
	setGraphicObjectProps: function(props)
	{
		var properties;
        if ( (props instanceof asc_CImgProperty) && props.ShapeProperties)
            properties = props.ShapeProperties;
        else
            properties = props;
        
        if (isRealObject(properties) || isRealObject(props))
        {		
			if (isRealObject(props) && typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign))
			{
				if (this.curState.id === STATES_ID_TEXT_ADD)
				{
					if(typeof this.curState.textObject.GraphicObj.setTextVerticalAlign === "function")
						this.curState.textObject.GraphicObj.setTextVerticalAlign(props.verticalTextAlign);
				}

				if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP)
				{
					if (typeof this.curState.textObject.setTextVerticalAlign === "function")
						this.curState.textObject.setTextVerticalAlign(props.verticalTextAlign);
				}
			}
			if (!(this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) && isRealObject(properties))
			{
				var ArrGlyph = this.selectedObjects;
				for (var i = 0;  i< ArrGlyph.length; ++i)
				{
					if ( undefined != properties.Width || undefined != properties.Height )
					{
						var result_width, result_height;
						var b_is_line = ArrGlyph[i].checkLine();
						if (properties.Width != undefined)
							if (properties.Width >= MIN_SHAPE_SIZE || b_is_line)
								result_width = properties.Width;
							else
								result_width = MIN_SHAPE_SIZE;
						else
							result_width = ArrGlyph[i].extX;

						if (properties.Height != undefined)
							if(properties.Height >= MIN_SHAPE_SIZE || b_is_line)
								result_height = properties.Height;
							else
								result_height = MIN_SHAPE_SIZE;
						else
							result_height = ArrGlyph[i].extY;

						if (ArrGlyph[i].isShape() || ArrGlyph[i].isImage())
						{
							ArrGlyph[i].setAbsoluteTransform(null, null, result_width, result_height, null, false, false);
							ArrGlyph[i].setXfrm(null, null, result_width, result_height, null, null, null);
							ArrGlyph[i].calculateAfterResize();
						}
					}
				
					else if (ArrGlyph[i].isImage())
					{
						ArrGlyph[i].setRasterImage(props.ImageUrl);
					}
					
					else if (((ArrGlyph[i].isShape()) || (ArrGlyph[i].isGroup())))
					{
						if (properties.type != undefined && properties.type != -1)
						{
							ArrGlyph[i].changePresetGeometry(properties.type);
						}
						if (properties.fill)
						{
							ArrGlyph[i].changeFill(properties.fill);
						}
						if (properties.stroke)
						{
							ArrGlyph[i].changeLine(properties.stroke);
						}
					}

					if (typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].setTextVerticalAlign === "function")
					{
						ArrGlyph[i].setTextVerticalAlign(props.verticalTextAlign);
					}

				}
			}
			else if (this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP)
			{
				if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : this.curState.group.parent.Parent, CheckType : changestype_Paragraph_Content} ))
				{
					if ( undefined != props.PositionH )
						this.curState.group.parent.Set_PositionH( props.PositionH.RelativeFrom, props.PositionH.UseAlign, ( true === props.PositionH.UseAlign ? props.PositionH.Align : props.PositionH.Value ) );

					if ( undefined != props.PositionV )
						this.curState.group.parent.Set_PositionV( props.PositionV.RelativeFrom, props.PositionV.UseAlign, ( true === props.PositionV.UseAlign ? props.PositionV.Align : props.PositionV.Value ) );

					ArrGlyph = this.curState.group.selectionInfo.selectionArray;
					var b_change_diagram = false;
					for (i = 0;  i< ArrGlyph.length; ++i)
					{
						if (ArrGlyph[i].isShape() && isRealObject(properties))
						{
							if (properties.type != undefined && properties.type != -1)
							{
								ArrGlyph[i].changePresetGeometry(properties.type);
							}
							if (properties.fill)
							{
								ArrGlyph[i].changeFill(properties.fill);
							}
							if (properties.stroke)
							{
								ArrGlyph[i].changeLine(properties.stroke);
							}
						}
						else if (isRealObject(props) && typeof  props.ImageUrl === "string" && ArrGlyph[i].isImage())
						{
							ArrGlyph[i].setRasterImage(props.ImageUrl);
						}

						if (typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].setTextVerticalAlign === "function")
						{
							ArrGlyph[i].setTextVerticalAlign(props.verticalTextAlign);
						}
					}
					if (b_change_diagram)
					{
						this.curState.group.updateSizes();
						this.curState.group.recalculate();
						var bounds = this.curState.group.parent.getBounds();
						if (!this.curState.group.parent.Is_Inline())
							this.curState.group.parent.OnEnd_ChangeFlow(this.curState.group.absOffsetX, this.curState.group.absOffsetY, this.curState.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
						else
							this.curState.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
					}
				}
			}
		}
		this.drawingObjects.showDrawingObjects(true);
		this.drawingObjects.sendGraphicObjectProps();
	}
};

//-----------------------------------------------------------------------------------
// ASC Classes
//-----------------------------------------------------------------------------------

function asc_CColor() {
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;

    this.Mods = new Array();
    this.ColorSchemeId = -1;
}

asc_CColor.prototype = {
	asc_getR: function() { return this.r },
	asc_putR: function(v) { this.r = v; this.hex = undefined; },
	asc_getG: function() { return this.g; },
	asc_putG: function(v) { this.g = v; this.hex = undefined; },
	asc_getB: function() { return this.b; },
	asc_putB: function(v) { this.b = v; this.hex = undefined; },
	asc_getA: function() { return this.a; },
	asc_putA: function(v) { this.a = v; this.hex = undefined; },
	asc_getType: function() { return this.type; },
	asc_putType: function(v) { this.type = v; },
	asc_getValue: function() { return this.value; },
	asc_putValue: function(v) { this.value = v; },
	asc_getHex: function() {
		if(!this.hex)
		{
			var a = this.a.toString(16);
			var r = this.r.toString(16);
			var g = this.g.toString(16);
			var b = this.b.toString(16);
			this.hex = ( a.length == 1? "0" + a: a) +
						( r.length == 1? "0" + r: r) +
						( g.length == 1? "0" + g: g) +
						( b.length == 1? "0" + b: b);
		}
		return this.hex;
	},
	asc_getColor: function() {
		var ret = new CColor(this.r, this.g, this.b);
		return ret;
	}
}

//{ asc_CColor export
window["Asc"].asc_CColor = asc_CColor;
window["Asc"]["asc_CColor"] = asc_CColor;
prot = asc_CColor.prototype;

prot["asc_getR"] = prot.asc_getR;
prot["asc_putR"] = prot.asc_putR;
prot["asc_getG"] = prot.asc_getG;
prot["asc_putG"] = prot.asc_putG;
prot["asc_getB"] = prot.asc_getB;
prot["asc_putB"] = prot.asc_putB;
prot["asc_getA"] = prot.asc_getA;
prot["asc_putA"] = prot.asc_putA;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getHex"] = prot.asc_getHex;
prot["asc_getColor"] = prot.asc_getColor;
//}

function CreateAscColorCustomEx(r, g, b) {
    var ret = new asc_CColor();
    ret.type = c_oAscColor.COLOR_TYPE_SRGB;
    ret.r = r;
    ret.g = g;
    ret.b = b;
    ret.a = 255;
    return ret;
}

function CreateAscColorEx(unicolor) {
    if (null == unicolor || null == unicolor.color)
        return new asc_CColor();

    var ret = new asc_CColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;

    var _color = unicolor.color;
    switch (_color.type)
    {
        case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        {
            break;
        }
        case COLOR_TYPE_PRST:
        {
            ret.type = c_oAscColor.COLOR_TYPE_PRST;
            ret.value = _color.id;
            break;
        }
        case COLOR_TYPE_SCHEME:
        {
            ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
            ret.value = _color.id;
            break;
        }
        default:
            break;
    }
    return ret;
}

function CorrectUniColorEx(asc_color, unicolor) {
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.asc_getType();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_PRST)
            {
                ret.color = new CPrstColor();
            }
            ret.color.id = asc_color.asc_getValue();
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME)
            {
                ret.color = new CSchemeColor();
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.asc_getValue());
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.id = array_colors_types[_id];

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            if (1 <= _pos && _pos <= 5)
            {
                var _mods = g_oThemeColorsDefaultMods[_pos - 1];
                var _ind = 0;
                for (var k in _mods)
                {
                    ret.Mods.Mods[_ind] = new CColorMod();
                    ret.Mods.Mods[_ind].name = k;
                    ret.Mods.Mods[_ind].val = _mods[k];
                    _ind++;
                }
            }

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB)
            {
                ret.color = new CRGBColor();
            }
            ret.color.RGBA.R = asc_color.asc_getR();
            ret.color.RGBA.G = asc_color.asc_getG();
            ret.color.RGBA.B = asc_color.asc_getB();
            ret.color.RGBA.A = asc_color.asc_getA();
        }
    }
    return ret;
}

function asc_CShapeFill() {
    this.type = null;
    this.fill = null;
    this.transparent = null;
}

asc_CShapeFill.prototype = {
	asc_getType: function() { return this.type; },
	asc_putType: function(v) { this.type = v; },
	asc_getFill: function() { return this.fill; },
	asc_putFill: function(v) { this.fill = v; },
	asc_getTransparent: function() { return this.transparent; },
	asc_putTransparent: function(v) { this.transparent = v; }
}

//{ asc_CShapeFill export
window["Asc"].asc_CShapeFill = asc_CShapeFill;
window["Asc"]["asc_CShapeFill"] = asc_CShapeFill;
prot = asc_CShapeFill.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;

prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;

prot["asc_getTransparent"] = prot.asc_getTransparent;
prot["asc_putTransparent"] = prot.asc_putTransparent;
//}

function asc_CFillBlip() {
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}

asc_CFillBlip.prototype = {
	asc_getType: function(){return this.type},
	asc_putType: function(v){this.type = v;},
	asc_getUrl: function(){return this.url;},
	asc_putUrl: function(v){this.url = v;},
	asc_getTextureId: function(){return this.texture_id;},
	asc_putTextureId: function(v){this.texture_id = v;}
}

//{ asc_CFillBlip export
window["Asc"].asc_CFillBlip = asc_CFillBlip;
window["Asc"]["asc_CFillBlip"] = asc_CFillBlip;
prot = asc_CFillBlip.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;

prot["asc_getUrl"] = prot.asc_getUrl;
prot["asc_putUrl"] = prot.asc_putUrl;

prot["asc_getTextureId"] = prot.asc_getTextureId;
prot["asc_putTextureId"] = prot.asc_putTextureId;
//}

function asc_CFillSolid() {
    this.color = new CAscColor();
}

asc_CFillSolid.prototype = {
	asc_getColor: function() { return this.color },
	asc_putColor: function(v) { this.color = v; }
}

//{ asc_CFillSolid export
window["Asc"].asc_CFillSolid = asc_CFillSolid;
window["Asc"]["asc_CFillSolid"] = asc_CFillSolid;
prot = asc_CFillSolid.prototype;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
//}

function CreateAscFillEx(unifill) {
    if (null == unifill || null == unifill.fill)
        return new asc_CShapeFill();

    var ret = new asc_CShapeFill();

    var _fill = unifill.fill;
    switch (_fill.type)
    {
        case FILL_TYPE_SOLID:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new asc_CFillSolid();
            ret.fill.color = CreateAscColorEx(_fill.color);
            break;
        }
        case FILL_TYPE_PATT:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new asc_CFillSolid();
            ret.fill.color = CreateAscColorEx(_fill.fgClr);
            break;
        }
        case FILL_TYPE_GRAD:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new asc_CFillSolid();

            if (_fill.colors.length > 0)
                ret.fill.color = CreateAscColorEx(_fill.colors[0].color);
            break;
        }
        case FILL_TYPE_BLIP:
        {
            ret.type = c_oAscFill.FILL_TYPE_BLIP;
            ret.fill = new asc_CFillBlip();

            ret.fill.url = _fill.RasterImageId;
            ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
            break;
        }
        default:
            break;
    }

    ret.transparent = unifill.transparent;
    return ret;
}

function CorrectUniFillEx(asc_fill, unifill) {
    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.asc_getFill();
    var _type = asc_fill.asc_getType();

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.fill = new CNoFill();
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP)
                {
                    ret.fill = new CBlipFill();
                }

                var _url = _fill.asc_getUrl();
                var _tx_id = _fill.asc_getTextureId();
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length))
                {
                    _url = g_oUserTexturePresets[_tx_id];
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.RasterImageId = _url;

                if (ret.fill.RasterImageId == null)
                    ret.fill.RasterImageId = "";

                var tile = _fill.asc_getType();
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.tile = null;
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.tile = true;

                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID)
                {
                    ret.fill = new CSolidFill();
                }
                ret.fill.color = CorrectUniColorEx(_fill.asc_getColor(), ret.fill.color);
            }
        }
    }

    var _alpha = asc_fill.asc_getTransparent();
    if (null != _alpha)
        ret.transparent = _alpha;

    return ret;
}

function asc_CStroke() {
    this.type = null;
    this.width = null;
    this.color = null;

    this.LineJoin = null;
    this.LineCap = null;

    this.LineBeginStyle = null;
    this.LineBeginSize = null;

    this.LineEndStyle = null;
    this.LineEndSize = null;

    this.canChangeArrows = false;
}

asc_CStroke.prototype = {
	asc_getType: function(){return this.type;},
	asc_putType: function(v){this.type = v;},
	asc_getWidth: function(){return this.width;},
	asc_putWidth: function(v){this.width = v;},
	asc_getColor: function(){return this.color;},
	asc_putColor: function(v){this.color = v;},

	asc_getLinejoin: function(){return this.LineJoin;},
	asc_putLinejoin: function(v){this.LineJoin = v;},
	asc_getLinecap: function(){return this.LineCap;},
	asc_putLinecap: function(v){this.LineCap = v;},

	asc_getLinebeginstyle: function(){return this.LineBeginStyle;},
	asc_putLinebeginstyle: function(v){this.LineBeginStyle = v;},
	asc_getLinebeginsize: function(){return this.LineBeginSize;},
	asc_putLinebeginsize: function(v){this.LineBeginSize = v;},
	asc_getLineendstyle: function(){return this.LineEndStyle;},
	asc_putLineendstyle: function(v){this.LineEndStyle = v;},
	asc_getLineendsize: function(){return this.LineEndSize;},
	asc_putLineendsize: function(v){this.LineEndSize = v;},

	asc_getCanChangeArrows: function(){return this.canChangeArrows;}
}

//{ asc_CStroke export
window["Asc"].asc_CStroke = asc_CStroke;
window["Asc"]["asc_CStroke"] = asc_CStroke;
prot = asc_CStroke.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;

prot["asc_getLinejoin"] = prot.asc_getLinejoin;
prot["asc_putLinejoin"] = prot.asc_putLinejoin;
prot["asc_getLinecap"] = prot.asc_getLinecap;
prot["asc_putLinecap"] = prot.asc_putLinecap;

prot["asc_getLinebeginstyle"] = prot.asc_getLinebeginstyle;
prot["asc_putLinebeginstyle"] = prot.asc_putLinebeginstyle;
prot["asc_getLinebeginsize"] = prot.asc_getLinebeginsize;
prot["asc_putLinebeginsize"] = prot.asc_putLinebeginsize;
prot["asc_getLineendstyle"] = prot.asc_getLineendstyle;
prot["asc_putLineendstyle"] = prot.asc_putLineendstyle;
prot["asc_getLineendsize"] = prot.asc_getLineendsize;
prot["asc_putLineendsize"] = prot.asc_putLineendsize;

prot["asc_getCanChangeArrows"] = prot.asc_getCanChangeArrows;
//}

function CreateAscStrokeEx(ln, _canChangeArrows) {
    if (null == ln || null == ln.Fill || ln.Fill.fill == null)
        return new asc_CStroke();

    var ret = new asc_CStroke();

    var _fill = ln.Fill.fill;
    if(_fill != null)
    {
        switch (_fill.type)
        {
            case FILL_TYPE_BLIP:
            {
                break;
            }
            case FILL_TYPE_SOLID:
            {
                ret.color = CreateAscColorEx(_fill.color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_GRAD:
            {
                var _c = _fill.colors;
                if (_c != 0)
                {
                    ret.color = CreateAscColorEx(_fill.colors[0]);
                    ret.type = c_oAscStrokeType.STROKE_COLOR;
                }

                break;
            }
            case FILL_TYPE_PATT:
            {
                ret.color = CreateAscColorEx(_fill.fgClr);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_NOFILL:
            {
                ret.color = null;
                ret.type = c_oAscStrokeType.STROKE_NONE;
                break;
            }
            default:
            {
                break;
            }
        }
    }


    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000.0;

    if (ln.cap != null)
        ret.asc_putLinecap(ln.cap);

    if (ln.LineJoin != null)
        ret.asc_putLinejoin(ln.LineJoin.type);

    if (ln.headEnd != null)
    {
        ret.asc_putLinebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);

        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);

        ret.asc_putLinebeginsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLinebeginstyle(LineEndType.None);
    }

    if (ln.tailEnd != null)
    {
        ret.asc_putLineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);

        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);

        ret.asc_putLineendsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLineendstyle(LineEndType.None);
    }

    if (true === _canChangeArrows)
        ret.canChangeArrows = true;

    return ret;
}

function CorrectUniStrokeEx(asc_stroke, unistroke) {
    if (null == asc_stroke)
        return unistroke;

    var ret = unistroke;
    if (null == ret)
        ret = new CLn();

    var _type = asc_stroke.asc_getType();
    var _w = asc_stroke.asc_getWidth();

    if (_w != null && _w !== undefined)
        ret.w = _w * 36000.0;

    var _color = asc_stroke.asc_getColor();
    if (_type == c_oAscStrokeType.STROKE_NONE)
    {
        ret.Fill = new CUniFill();
        ret.Fill.fill = new CNoFill();
    }
    else if (_type != null)
    {
        if (null != _color && undefined !== _color)
        {
            ret.Fill = new CUniFill();
            ret.Fill.type = FILL_TYPE_SOLID;
            ret.Fill.fill = new CSolidFill();
            ret.Fill.fill.color = CorrectUniColorEx(_color, ret.Fill.fill.color);
        }
    }

    var _join = asc_stroke.asc_getLinejoin();
    if (null != _join)
    {
        ret.LineJoin = new LineJoin();
        ret.LineJoin.type = _join;
    }

    var _cap = asc_stroke.asc_getLinecap();
    if (null != _cap)
    {
        ret.cap = _cap;
    }

    var _begin_style = asc_stroke.asc_getLinebeginstyle();
    if (null != _begin_style)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.type = _begin_style;
    }

    var _end_style = asc_stroke.asc_getLineendstyle();
    if (null != _end_style)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.type = _end_style;
    }

    var _begin_size = asc_stroke.asc_getLinebeginsize();
    if (null != _begin_size)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.w = 2 - ((_begin_size/3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }

    var _end_size = asc_stroke.asc_getLineendsize();
    if (null != _end_size)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.w = 2 - ((_end_size/3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }

    return ret;
}