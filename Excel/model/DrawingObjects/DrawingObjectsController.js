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
}

DrawingObjectsController.prototype =
{
    changeCurrentState: function(newState)
    {
        this.curState = newState;
    },

    recalculateCurPos: function()
    {
        if(this.curState.id === STATES_ID_TEXT_ADD)
            this.curState.textObject.recalculateCurPos();
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
	
	getGraphicObjectProps: function()	// Все свойства делаем чераз asc_классы
	{
		var shape_props, image_props;
        
        switch(this.curState.id)
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
                    this.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
                }

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
	}
};