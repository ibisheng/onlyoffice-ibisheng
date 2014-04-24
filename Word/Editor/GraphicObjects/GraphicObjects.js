function CGraphicObjects(document, drawingDocument, api, documentContent)
{
    this.api = api;
    this.document = document;
    this.drawingDocument = drawingDocument;

    this.graphicPages = [];

    this.startTrackPos =
    {
        x: null,
        y: null,
        pageIndex: null
    };

    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.majorGraphicObject = null;
    this.zIndexManager = new ZIndexManager(this);


    this.curState = new NullState(this);

    this.selectionInfo =
    {
        selectionArray: []
    };

    this.currentPresetGeom = null;//выставляется при выборе автофигуры в меню (строка)

    this.maximalGraphicObjectZIndex = 1024;

    this.spline = null;
    this.polyline = null;

    this.drawingObjects = [];
    this.objectsMap = {};

    ////header footer graphicObjects

    this.firstPage = null;
    this.evenPage = null;
    this.oddPage = null;

    this.urlMap = [];
    this.recalcMap = {};
    this.arrForCalculateAfterOpen = [];


    this.recalculateMap = {};

    this.selectedObjects = [];
    this.selection =
    {
        groupSelection:       null,
        chartSelection:       null,
        textSelection:        null,
        wrapPolygonSelection: null
    };

    this.selectedObjects = [];

    this.headerFooter =
    {
        header:{
            first: null,
            even : null,
            odd  : null
        },

        footer: {
            first: null,
            even : null,
            odd  : null
        },

        commonFirst:
        {
            inlineObjects: [],
            behindDocObjects: [],
            wrappingObjects: [],
            beforeTextObjects: [],
            flowTables: []
        },

        commonEven:
        {
            inlineObjects: [],
            behindDocObjects: [],
            wrappingObjects: [],
            beforeTextObjects: [],
            flowTables: []
        },
        commonOdd:
        {
            inlineObjects: [],
            behindDocObjects: [],
            wrappingObjects: [],
            beforeTextObjects: [],
            flowTables: []
        }
    };

    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;

    this.nullState = new NullState(this);

    this.Id = g_oIdCounter.Get_NewId();
    this.Lock = new CLock();
    g_oTableId.Add( this, this.Id );
}

CGraphicObjects.prototype =
{
    handleAdjustmentHit: DrawingObjectsController.prototype.handleAdjustmentHit,
    handleHandleHit: DrawingObjectsController.prototype.handleHandleHit,
    handleMoveHit: DrawingObjectsController.prototype.handleMoveHit,

    rotateTrackObjects: DrawingObjectsController.prototype.rotateTrackObjects,
    handleRotateTrack: DrawingObjectsController.prototype.handleRotateTrack,
    trackResizeObjects: DrawingObjectsController.prototype.trackResizeObjects,
    resetInternalSelection: DrawingObjectsController.prototype.resetInternalSelection,
    handleTextHit: DrawingObjectsController.prototype.handleTextHit,

    Get_Id: function()
    {
        return this.Id;
    },

    AddHeaderOrFooter : function(Type, PageType)
    {

        var Content_old =
        {
            Header:
            {
                First: this.headerFooter.header.first,
                Even : this.headerFooter.header.even,
                Odd  : this.headerFooter.header.odd
            },

            Footer:
            {
                First: this.headerFooter.footer.first,
                Even : this.headerFooter.footer.even,
                Odd  : this.headerFooter.footer.odd
            }
        };

        var HdrFtr = new HeaderFooterGraphicObjects();
        switch( Type )
        {
            case hdrftr_Footer:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        if (null === this.headerFooter.footer.first)
                            this.headerFooter.footer.first = HdrFtr;

                        if (null === this.headerFooter.footer.even)
                            this.headerFooter.footer.even = HdrFtr;

                        this.headerFooter.footer.odd = HdrFtr;
                        break;
                    }
                    case hdrftr_Even :
                    {
                        this.headerFooter.footer.even = HdrFtr;

                        break;
                    }
                    case hdrftr_First :
                    {
                        this.headerFooter.footer.first = HdrFtr;
                        break;
                    }
                }
                break;
            }
            case hdrftr_Header:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        if ( null === this.headerFooter.header.first )
                            this.headerFooter.header.first = HdrFtr;

                        if ( null === this.headerFooter.header.even )
                            this.headerFooter.header.even  = HdrFtr;

                        this.headerFooter.header.odd  = HdrFtr;
                        break;
                    }
                    case hdrftr_Even :
                    {
                        this.headerFooter.header.even = HdrFtr;
                        break;
                    }
                    case hdrftr_First :
                    {
                        this.headerFooter.header.first = HdrFtr;
                        break;
                    }
                }
                break;
            }
        }
        var Content_new =
        {
            Header:
            {
                First: this.headerFooter.header.first,
                Even : this.headerFooter.header.even,
                Odd  : this.headerFooter.header.odd
            },

            Footer:
            {
                First: this.headerFooter.footer.first,
                Even : this.headerFooter.footer.even,
                Odd  : this.headerFooter.footer.odd
            }
        };
        History.Add(this, {Type: historyitem_GraphicObjectsAddHeaderOrFooter, oldPr: Content_old, newPr: Content_new});
        return HdrFtr;
    },

    RemoveHeaderOrFooter : function(Type, PageType)
    {
        var Content_old =
        {
            Header:
            {
                First: this.headerFooter.header.first,
                Even : this.headerFooter.header.even,
                Odd  : this.headerFooter.header.odd
            },

            Footer:
            {
                First: this.headerFooter.footer.first,
                Even : this.headerFooter.footer.even,
                Odd  : this.headerFooter.footer.odd
            }
        };


        switch( Type )
        {
            case hdrftr_Footer:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        var HdrFtr = this.headerFooter.footer.odd;

                        if ( HdrFtr === this.headerFooter.footer.first )
                            this.headerFooter.footer.first = null;

                        if ( HdrFtr === this.headerFooter.footer.even )
                            this.headerFooter.footer.even = null;

                        this.headerFooter.footer.odd = null;

                        break;
                    }
                    case hdrftr_Even :
                    {
                        if ( this.headerFooter.footer.odd != this.headerFooter.footer.even )
                            this.headerFooter.footer.even = this.headerFooter.footer.odd;

                        break;
                    }
                    case hdrftr_First :
                    {
                        if ( this.headerFooter.footer.odd != this.headerFooter.footer.first )
                            this.headerFooter.footer.first  = this.headerFooter.footer.odd;

                        break;
                    }
                }

                break;
            }
            case hdrftr_Header:
            {
                switch ( PageType )
                {
                    case hdrftr_Default:
                    {
                        var HdrFtr = this.headerFooter.header.odd;

                        if ( HdrFtr === this.headerFooter.header.first )
                            this.headerFooter.header.first = null;

                        if ( HdrFtr === this.headerFooter.header.even )
                            this.headerFooter.header.even = null;

                        this.headerFooter.header.odd = null;

                        break;
                    }
                    case hdrftr_Even :
                    {
                        if ( this.headerFooter.header.odd != this.headerFooter.header.even )
                        {
                            if ( this.headerFooter.header.even === this.headerFooter.header.first )
                                this.headerFooter.header.first = this.headerFooter.header.odd;

                            this.headerFooter.header.even = this.headerFooter.header.odd;
                        }

                        break;
                    }
                    case hdrftr_First :
                    {
                        if ( this.headerFooter.header.odd != this.headerFooter.header.first )
                            this.headerFooter.header.first  = this.headerFooter.Header.odd;

                        break;
                    }
                }

                break;
            }
        }

        var Content_new =
        {
            Header:
            {
                First: this.headerFooter.header.first,
                Even : this.headerFooter.header.even,
                Odd  : this.headerFooter.header.odd
            },

            Footer:
            {
                First: this.headerFooter.footer.first,
                Even : this.headerFooter.footer.even,
                Odd  : this.headerFooter.footer.odd
            }
        };
        History.Add(this, {Type: historyitem_GraphicObjectsAddHeaderOrFooter, oldPr: Content_old, newPr: Content_new});
    },


    sortDrawingArrays: function()
    {
        for(var i = 0; i < this.graphicPages.length; ++i)
        {
            this.graphicPages[i].sortDrawingArrays();
        }
        CGraphicPage.prototype.sortDrawingArrays.apply(this.headerFooter.commonEven, []);
        CGraphicPage.prototype.sortDrawingArrays.apply(this.headerFooter.commonFirst, []);
        CGraphicPage.prototype.sortDrawingArrays.apply(this.headerFooter.commonOdd, []);
    },

    getSelectedObjects: function()
    {
        return this.selectedObjects;
    },

    updateCursorType: function(pageIndex, x, y, e, bTextFlag)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex, bTextFlag);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            this.drawingDocument.SetCursorType(ret.cursorType);
            return true;
        }
        return false;
    },

    createImage: DrawingObjectsController.prototype.createImage,

    getChartSpace: DrawingObjectsController.prototype.getChartSpace,

    getProps: function()
    {
        //TODO
        var chart_props, shape_props, image_props;
        /*switch(this.curState.id)
         {
         case STATES_ID_GROUP:
         {
         var  props = {};
         props.fromGroup = true;
         var s_arr = this.curState.group.selectionInfo.selectionArray;
         for(var i = 0; i < s_arr.length; ++i)
         {
         if(s_arr[i].isImage() && s_arr[i].chart == null && props.ImageUrl !== null)
         {
         if(props.ImageUrl === undefined)
         props.ImageUrl = s_arr[i].getImageUrl();
         else
         {
         if(props.ImageUrl !== s_arr[i].getImageUrl())
         {
         props.ImageUrl = null;
         }
         }
         }
         if(s_arr[i].isShape())
         {
         if(props.ShapeProperties === undefined)
         {
         props.ShapeProperties =
         {
         type: s_arr[i].getPresetGeom(),
         fill: s_arr[i].getFill(),
         stroke: s_arr[i].getStroke(),
         canChangeArrows: s_arr[i].canChangeArrows()
         }
         }
         else
         {
         var ShapeProperties =
         {
         type: s_arr[i].getPresetGeom(),
         fill: s_arr[i].getFill(),
         stroke: s_arr[i].getStroke(),
         canChangeArrows: s_arr[i].canChangeArrows()
         };
         props.ShapeProperties = CompareShapeProperties(ShapeProperties, props.ShapeProperties);
         }
         }
         }
         if(s_arr.length === 1 && s_arr[0].isImage() && s_arr[0].chart != null)
         {
         props.ChartProperties = s_arr[0].chart;
         }
         return props;
         }
         default :
         {
         var pr;
         var sel_arr = this.selectionInfo.selectionArray;
         for(var index = 0; index < sel_arr.length; ++index)
         {
         pr = sel_arr[index].Get_Props(pr);
         }
         return pr;
         }

         }        */
        switch(this.curState.id)
        {
            case STATES_ID_GROUP:
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
                            image_props.Width  = c_obj.absExtX;
                            image_props.Height = c_obj.absExtY;
                            image_props.ImageUrl = c_obj.getImageUrl();
                        }
                        else
                        {
                            if(image_props.Width != null)
                            {
                                if(image_props.Width != c_obj.absExtX || image_props.Height != c_obj.absExtY)
                                {
                                    image_props.Width = null;
                                    image_props.Height = null;
                                }
                            }
                            if(image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl)
                                image_props.ImageUrl = null;
                        }
                    }
                    if(c_obj.isImage() && isRealObject(c_obj.chart))
                    {
                        if(!isRealObject(chart_props))
                        {
                            chart_props = {fromGroup: true};
                            g_oTableId.m_bTurnOff = true;
                            chart_props.ChartProperties = new asc_CChart(c_obj.chart);
                            g_oTableId.m_bTurnOff = false;
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
                            shape_props.Width  = c_obj.absExtX;
                            shape_props.Height = c_obj.absExtY;
                            shape_props.ShapeProperties =
                            {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows(),
                                canFill: c_obj.canFill()
                            };
                            shape_props.verticalTextAlign = c_obj.bodyPr.anchor;
                        }
                        else
                        {

                            if(shape_props.Width != null)
                            {
                                if(shape_props.Width != c_obj.absExtX || shape_props.Height != c_obj.absExtY)
                                {
                                    shape_props.Width = null;
                                    shape_props.Height = null;
                                }
                            }
                            var ShapeProperties =
                            {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows(),
                                canFill: c_obj.canFill()
                            };
                            shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                            shape_props.verticalTextAlign = undefined;
                        }
                    }

                    if(c_obj.chart)
                    {
                        if(!isRealObject(chart_props))
                        {
                            chart_props = {fromGroup: true};
                            chart_props.Width  = c_obj.absExtX;
                            chart_props.Height = c_obj.absExtY;
                            g_oTableId.m_bTurnOff = true;
                            chart_props.ChartProperties =  new asc_CChart(c_obj.chart);
                            g_oTableId.m_bTurnOff = false;
                        }
                        else
                        {
                            if(chart_props.Width != null)
                            {
                                if(chart_props.Width != c_obj.absExtX || chart_props.Height != c_obj.absExtY)
                                {
                                    chart_props.Width = null;
                                    chart_props.Height = null;
                                }
                            }
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
                }
                break;
            }
            default :
            {
                var s_arr = this.selectedObjects;
                for(i = 0; i < s_arr.length; ++i)
                {
                    c_obj = s_arr[i];
                    if(isRealObject(c_obj))
                    {
                        if(c_obj.isShape())
                        {
                            if(!isRealObject(shape_props))
                            {
                                shape_props = {};
                                shape_props =  s_arr[i].parent.Get_Props(null);
                                shape_props.ShapeProperties =
                                {
                                    type: c_obj.getPresetGeom(),
                                    fill: c_obj.getFill(),
                                    stroke: c_obj.getStroke(),
                                    canChangeArrows: c_obj.canChangeArrows(),
                                    paddings: c_obj.getPaddings(),
                                    canFill: true//c_obj.canFill()
                                };
                                shape_props.verticalTextAlign = undefined;//c_obj.bodyPr.anchor;
                            }
                            else
                            {
                                ShapeProperties =
                                {
                                    type: c_obj.getPresetGeom(),
                                    fill: c_obj.getFill(),
                                    stroke: c_obj.getStroke(),
                                    canChangeArrows: c_obj.canChangeArrows(),
                                    paddings: c_obj.getPaddings(),
                                    canFill: true//c_obj.canFill()
                                };
                                shape_props =  s_arr[i].parent.Get_Props(shape_props);
                                shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                                shape_props.verticalTextAlign = undefined;
                            }
                        }
                        if(c_obj.isImage() )
                        {
                            if(!isRealObject(image_props))
                            {
                                image_props = {};
                                image_props = s_arr[i].parent.Get_Props(null);
                                image_props.ImageUrl = ""
                            }
                            else
                            {
                                image_props = s_arr[i].parent.Get_Props(image_props);
                                if(image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl)
                                    image_props.ImageUrl = null;
                            }
                        }
                        if(c_obj.chart)
                        {
                            if(!isRealObject(chart_props))
                            {
                                chart_props = {};
                                chart_props = s_arr[i].parent.Get_Props(null);
                                g_oTableId.m_bTurnOff = true;
                                chart_props.ChartProperties =  new asc_CChart();
                                g_oTableId.m_bTurnOff = false;
                            }
                            else
                            {
                                chart_props = s_arr[i].parent.Get_Props(chart_props);
                                chart_props.severalCharts = true;
                                chart_props.severalChartStyles = true;
                            }
                        }

                        if(c_obj.isGroup())
                        {
                            shape_props = {};
                            shape_props =  s_arr[i].parent.Get_Props(null);
                        }
                    }
                }
                break;
            }
        }
        var ret = [];
        if(isRealObject(shape_props))
        {
            if(shape_props.ShapeProperties)
            {
                var pr = shape_props.ShapeProperties;
                if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP)
                {
                    this.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
                }
                else
                {
                    this.drawingDocument.DrawImageTextureFillShape(null);
                }

                shape_props.ShapeProperties = CreateAscShapePropFromProp(shape_props.ShapeProperties);
            }
            else
            {
                this.drawingDocument.DrawImageTextureFillShape(null);
            }

            if(shape_props.ChartProperties)
            {
                shape_props.ChartProperties = shape_props.ChartProperties.serializeChart();
            }
            ret.push(shape_props);
        }

        if(isRealObject(image_props))
        {
            if(image_props.ShapeProperties)
                image_props.ShapeProperties = CreateAscShapePropFromProp(image_props.ShapeProperties);
            if(image_props.ChartProperties)
            {
                image_props.ChartProperties = image_props.ChartProperties.serializeChart();
            }
            ret.push(image_props);
        }

        if(isRealObject(chart_props))
        {
            if(chart_props.ShapeProperties)
                chart_props.ShapeProperties = CreateAscShapePropFromProp(chart_props.ShapeProperties);

            /* if(chart_props.ChartProperties)
             {
             chart_props.ChartProperties = chart_props.ChartProperties.serializeChart();
             }          */
            ret.push(chart_props);
        }
        return ret;

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


    addToRecalculate: function(object)
    {
        if(typeof object.Get_Id === "function" && typeof object.recalculate === "function")
            History.RecalcData_Add({Type: historyrecalctype_Drawing, Object: object});
        return;
    },

    recalculate_: function(data)
    {
        if(data.All)
        {
            for(var i = 0; i < this.drawingObjects.length; ++i)
            {
                if(this.drawingObjects[i].GraphicObj)
                    this.drawingObjects[i].GraphicObj.recalculate();
            }
            for(var i = 0; i < this.drawingObjects.length; ++i)
            {
                if(this.drawingObjects[i].GraphicObj && this.drawingObjects[i].GraphicObj.recalculateText)
                    this.drawingObjects[i].GraphicObj.recalculateText();
            }
            this.zIndexManager.recalculate();
            //TODO
        }
        else
        {
            var map = data.Map;
            for(var key in map)
            {
                if(map.hasOwnProperty(key))
                    map[key].recalculate();
            }
        }
    },

    recalculateText_: function(data)
    {
        if(data.All)
        {
            //TODO
        }
        else
        {
            var map = data.Map;
            for(var key in map)
            {
                if(map.hasOwnProperty(key) && map[key].recalculateText)
                    map[key].recalculateText();
            }
        }
    },

    recalculate: function()
    {
        var b_update = false;
        for(var key in this.recalculateMap)
        {
            if(this.recalculateMap.hasOwnProperty(key))
                this.recalculateMap[key].recalculate();
        }
        this.recalculateMap = {};
    },


    addToZIndexManagerAfterOpen: function()
    {
        this.drawingObjects.sort(ComparisonByZIndexSimple);
        this.zIndexManager.bTurnOff = false;
        for(var i = 0; i < this.drawingObjects.length; ++i)
        {
            this.zIndexManager.addItem(null, this.drawingObjects);
        }
    },

    selectObject: DrawingObjectsController.prototype.selectObject,

    checkSelectedObjectsForMove: DrawingObjectsController.prototype.checkSelectedObjectsForMove,

    Document_Is_SelectionLocked: function(CheckType)
    {
        if(CheckType === changestype_ColorScheme)
        {
            this.Lock.Check(this.Get_Id());
        }
    },

    Get_Props: function()
    {
        return this.getProps();
    },

    setProps: function(props)
    {
        //TODO
        for(var i = 0;  i< this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].parent.Set_Props(props);
        }
        if(props.Group === 1)
        {
            this.groupSelectedObjects();
        }
        else if(props.Group === -1)
        {
            this.unGroupSelectedObjects();
        }

        switch(props.ChangeLevel)
        {
            case 0:
            {
                this.bringToFront();
                break;
            }
            case 1:
            {
                this.bringForward();
                break;
            }
            case 2:
            {
                this.sendToBack();
                break;
            }
            case 3:
            {
                this.bringBackward();
            }
        }
    },

    bringToFront : function()//перемещаем заселекченые объекты наверх
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : [this.selection.groupSelection.parent.Get_ParentParagraph()], CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.selection.groupSelection.bringToFront();
            }
        }
        else
        {
            History.Create_NewPoint();
            this.zIndexManager.bringToFront(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },

    bringForward : function()
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : [this.selection.groupSelection.parent.Get_ParentParagraph()], CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.selection.groupSelection.bringForward();
            }
        }
        else
        {
            History.Create_NewPoint();
            this.zIndexManager.bringForward(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },

    sendToBack : function()
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : [this.selection.groupSelection.parent.Get_ParentParagraph()], CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.selection.groupSelection.sendToBack();
            }
        }
        else
        {
            History.Create_NewPoint();
            this.zIndexManager.sendToBack(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },

    bringBackward : function()
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : [this.selection.groupSelection.parent.Get_ParentParagraph()], CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.selection.groupSelection.bringBackward();
            }
        }
        else
        {
            History.Create_NewPoint();
            this.zIndexManager.bringBackward(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },

    getArrZIndexSelectedObjects: function()
    {
        var ret = [];
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            ret.push(this.selectedObjects[i].parent.RelativeHeight);
        }
        return ret;
    },

    editChart: function(chart)
    {
        //TODO
        var gr_objects = this.selectionInfo.selectionArray;
        if(this.curState.id !== STATES_ID_GROUP)
        {
            for(var i = 0; i < gr_objects.length; ++i)
            {
                if(gr_objects[i].GraphicObj.chart != null)
                {
                    var para_drawing = gr_objects[i];

                    /* para_drawing.GraphicObj.setAbsoluteTransform(null, null,this.drawingDocument.GetMMPerDot(chart.width), this.drawingDocument.GetMMPerDot(chart.height), null, false, false);
                     para_drawing.GraphicObj.setXfrm(null, null, this.drawingDocument.GetMMPerDot(chart.width), this.drawingDocument.GetMMPerDot(chart.height), null, false, false);
                     para_drawing.GraphicObj.calculateAfterResize();      */
                    para_drawing.GraphicObj.chartModify(chart);
                    para_drawing.GraphicObj.setPageIndex(para_drawing.PageNum);
                    if(para_drawing.Is_Inline())
                    {
                        para_drawing.OnEnd_ResizeInline(para_drawing.GraphicObj.absExtX, para_drawing.GraphicObj.absExtY);
                    }
                    else
                    {
                        var bounds = para_drawing.getBounds();
                        para_drawing.OnEnd_ChangeFlow(para_drawing.GraphicObj.absOffsetX, para_drawing.GraphicObj.absOffsetY, para_drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t,
                            this.document.Get_NearestPos(para_drawing.pageIndex, bounds.l, bounds.t, true, para_drawing), true, true);
                    }
                    return;
                }
            }
        }
        else
        {
            var group = this.curState.group;
            var sel_arr = group.selectionInfo.selectionArray;
            if(sel_arr.length === 1)
            {
                if(sel_arr[0].chart != null )
                {
                    var diagramm = chart;
                    sel_arr[0].setAbsoluteTransform(null, null,sel_arr[0].drawingDocument.GetMMPerDot(diagramm.width), sel_arr[0].drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
                    sel_arr[0].setXfrm(null, null, sel_arr[0].drawingDocument.GetMMPerDot(diagramm.width), sel_arr[0].drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
                    sel_arr[0].calculateAfterResize(null, true);
                    sel_arr[0].chartModify(diagramm);
                    //  editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(diagramm.img);

                    this.curState.group.updateSizes();
                    this.curState.group.recalculate();
                    var bounds = this.curState.group.parent.getBounds();
                    if(!this.curState.group.parent.Is_Inline())
                        this.curState.group.parent.OnEnd_ChangeFlow(this.curState.group.absOffsetX, this.curState.group.absOffsetY, this.curState.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
                    else
                        this.curState.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                }

            }
        }
    },

    getChartObject: function()
    {
        //TODO
        var selected_arr = this.selectionInfo.selectionArray;
        for(var  i = 0;  i < selected_arr.length; ++i)
        {
            if(selected_arr[i].GraphicObj.chart != null)
                return selected_arr[i].GraphicObj;
        }

        var ret = new CChartAsGroup();
        g_oTableId.m_bTurnOff = true;
        ret.setAscChart(new asc_CChart());
        g_oTableId.m_bTurnOff = false;
        ret.chart.initDefault();
        ret.setChart(ret.chart);
        ret.spPr.xfrm.offX = 0;
        ret.spPr.xfrm.offY = 0;
        ret.spPr.xfrm.extX = this.drawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartWidth);
        ret.spPr.xfrm.extY = this.drawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartHeight);
        return ret;
    },


    addFloatTable: function(table)
    {
        if(!table.Table.Parent.Is_HdrFtr())
        {
            this.graphicPages[table.PageNum + table.PageController].addFloatTable(table);
        }
        else
        {
            var hdr_or_ftr = table.Table.Parent.Is_HdrFtr(true);
            return;
            var hdr_ftr_controller_content = this.document.HdrFtr.Content[0];
            var headers, footers;
            headers = hdr_ftr_controller_content.Header;
            footers = hdr_ftr_controller_content.Footer;
            var hdr_footer_objects, common_hdr_footer_objects = [];

            if(headers.First === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.header.first;
                common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                if(this.headerFooter.header.first === this.headerFooter.header.even)
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);
                if(this.headerFooter.header.first === this.headerFooter.header.odd)
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);

            }
            else if(footers.First === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.footer.first;
                common_hdr_footer_objects.push(this.headerFooter.commonFirst);

                if(this.headerFooter.header.first === this.headerFooter.header.even)
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);
                if(this.headerFooter.header.first === this.headerFooter.header.odd)
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);
            }
            else if(headers.Even === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.header.even;
                common_hdr_footer_objects.push(this.headerFooter.commonEven);

                if(this.headerFooter.header.even === this.headerFooter.header.first)
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                if(this.headerFooter.header.even === this.headerFooter.header.odd)
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);
            }
            else if(footers.Even === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.footer.even;
                common_hdr_footer_objects.push(this.headerFooter.commonEven);

                if(this.headerFooter.header.even === this.headerFooter.header.first)
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                if(this.headerFooter.header.even === this.headerFooter.header.odd)
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);
            }
            else if(headers.Odd === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.header.odd;
                common_hdr_footer_objects.push(this.headerFooter.commonOdd);

                if(this.headerFooter.header.odd === this.headerFooter.header.first)
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                if(this.headerFooter.header.odd === this.headerFooter.header.even)
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);
            }
            else if(footers.Odd === hdr_or_ftr)
            {
                hdr_footer_objects = this.headerFooter.footer.odd;
                common_hdr_footer_objects.push(this.headerFooter.commonOdd);

                if(this.headerFooter.header.odd === this.headerFooter.header.first)
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                if(this.headerFooter.header.odd === this.headerFooter.header.even)
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);
            }

            var i;
            if(hdr_footer_objects != null)
            {
                hdr_footer_objects.floatTables.push(table);
                for(i = 0; i < common_hdr_footer_objects.length; ++i)
                    common_hdr_footer_objects[i].flowTables.push(table);
            }
        }
    },

    removeFloatTableById: function(pageIndex, id)
    {
        var table = g_oTableId.Get_ById(id);
        if(!table.Parent.Is_HdrFtr())
            this.graphicPages[pageIndex].removeFloatTableById(id);
        else
        {
            var check_hdr_ftr_arrays = [];
            if(pageIndex === 0)
            {
                check_hdr_ftr_arrays.push(this.headerFooter.header.first);
                check_hdr_ftr_arrays.push(this.headerFooter.footer.first);
            }
            else
            {
                if(pageIndex  % 2 === 1)
                {
                    check_hdr_ftr_arrays.push(this.headerFooter.header.even);
                    check_hdr_ftr_arrays.push(this.headerFooter.footer.even);
                }
                else
                {
                    check_hdr_ftr_arrays.push(this.headerFooter.header.odd);
                    check_hdr_ftr_arrays.push(this.headerFooter.footer.odd);
                }
            }

            check_hdr_ftr_arrays.push(this.headerFooter.commonFirst);
            check_hdr_ftr_arrays.push(this.headerFooter.commonEven);
            check_hdr_ftr_arrays.push(this.headerFooter.commonOdd);


            function findTableInArrayAndRemove(drawingArray, Id)
            {
                for(var i = drawingArray.length-1; i >-1; --i)
                {
                    if(drawingArray[i].Table.Get_Id() === Id)
                        drawingArray.splice(i, 1);
                }
            }

            function findInArrayAndRemoveFromDrawingPage(drawingPage, Id)
            {
                if(!drawingPage)
                    return;
                if(Array.isArray(drawingPage.flowTables))
                {
                    findTableInArrayAndRemove(drawingPage.flowTables, Id);
                }
                else if(Array.isArray(drawingPage.floatTables))
                {
                    findTableInArrayAndRemove(drawingPage.floatTables, Id);
                }
            }
            for(var i = 0; i < check_hdr_ftr_arrays.length; ++i)
            {
                findInArrayAndRemoveFromDrawingPage(check_hdr_ftr_arrays[i], id);
            }
        }
    },

    selectionIsTableBorder: function()
    {
        var content = this.getTargetDocContent();
        if(content)
            return content.Selection_Is_TableBorderMove();
        return false;
    },


    getTableByXY: function(x, y, pageIndex, documentContent)
    {
        if(!documentContent.Is_HdrFtr())
            return this.graphicPages[pageIndex].getTableByXY(x, y, documentContent);

        var check_hdr_ftr_arrays = [];
        if(pageIndex === 0)
        {
            check_hdr_ftr_arrays.push(this.headerFooter.header.first);
            check_hdr_ftr_arrays.push(this.headerFooter.footer.first);
        }
        else
        {
            if(pageIndex  % 2 === 1)
            {
                check_hdr_ftr_arrays.push(this.headerFooter.header.even);
                check_hdr_ftr_arrays.push(this.headerFooter.footer.even);
            }
            else
            {
                check_hdr_ftr_arrays.push(this.headerFooter.header.odd);
                check_hdr_ftr_arrays.push(this.headerFooter.footer.odd);
            }
        }

        function findTableInArrayAndRemove(drawingArray, documentContent, x, y)
        {
            for(var i = drawingArray.length-1; i >-1; --i)
            {
                if(drawingArray[i].IsPointIn(x, y) && drawingArray[i].Table.Parent === documentContent)
                    return drawingArray[i];
            }
            return null;
        }

        function findInArrayAndRemoveFromDrawingPage(drawingPage, documentContent, x, y)
        {
            if(!drawingPage)
                return null;
            else if(Array.isArray(drawingPage.floatTables))
            {
                return findTableInArrayAndRemove(drawingPage.floatTables, documentContent, x, y);
            }
        }
        var ret;
        for(var i = 0; i < check_hdr_ftr_arrays.length; ++i)
        {
            ret = findInArrayAndRemoveFromDrawingPage(check_hdr_ftr_arrays[i], documentContent, x, y);
            if(ret)
                return ret;
        }

        return null;
    },

    OnMouseDown: function(e, x, y, pageIndex)
    {
        //console.log("down " + this.curState.id);
        this.curState.onMouseDown(e, x, y, pageIndex);
    },

    OnMouseMove: function(e, x, y, pageIndex)
    {

        //console.log("move " + this.curState.id);
        this.curState.onMouseMove(e, x, y, pageIndex);
    },

    OnMouseUp: function(e, x, y, pageIndex)
    {

        //console.log("up " + this.curState.id);
        this.curState.onMouseUp(e, x, y, pageIndex);
    },

    draw: function(pageIndex, graphics)
    {
        this.graphicPages[pageIndex].draw(graphics);
    },

    selectionDraw: function()
    {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },

    updateOverlay: function()
    {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },

    isPolylineAddition: function()
    {
        return this.curState.polylineFlag === true;
    },

    shapeApply: function(props, para_props)
    {
        //TODO
        var properties;
        if(props instanceof CImgProperty)
            properties = props.ShapeProperties;
        else
            properties = props;
        //this.urlMap = [];
        if(isRealObject(properties) || isRealObject(props))
        {
            var arr_pages = [];
            if(isRealObject(props) && typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign))
            {
                if(this.curState.id === STATES_ID_TEXT_ADD)
                {
                    if(typeof this.curState.textObject.GraphicObj.setTextVerticalAlign === "function")
                        this.curState.textObject.GraphicObj.setTextVerticalAlign(props.verticalTextAlign);
                }

                if(this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP)
                {
                    if(typeof this.curState.textObject.setTextVerticalAlign === "function")
                        this.curState.textObject.setTextVerticalAlign(props.verticalTextAlign);
                }
            }
            if(isRealObject(props.paddings))
            {
                if(this.curState.id === STATES_ID_TEXT_ADD)
                {
                    if(typeof this.curState.textObject.GraphicObj.setPaddings === "function")
                        this.curState.textObject.GraphicObj.setPaddings(props.paddings);
                }

                if(this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP)
                {
                    if(typeof this.curState.textObject.setPaddings === "function")
                        this.curState.textObject.setPaddings(props.paddings);
                }
            }
            if(!(this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) && isRealObject(properties))
            {
                var ArrGlyph = this.selectionInfo.selectionArray;
                for(var i = 0;  i< ArrGlyph.length; ++i)
                {
                    //                 if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : ArrGlyph[i].Parent, CheckType : changestype_Paragraph_Content} ))
                    {
                        var cur_page_index = ArrGlyph[i].pageIndex;
                        for(var j = 0; j < arr_pages.length; ++j)
                        {
                            if(arr_pages[j] === cur_page_index)
                                break;
                        }
                        if(j === arr_pages.length)
                            arr_pages.push(cur_page_index);
                        if(((ArrGlyph[i].GraphicObj.isShape()) || (ArrGlyph[i].GraphicObj.isGroup())))
                        {
                            if(properties.type != undefined && properties.type != -1)
                            {
                                ArrGlyph[i].GraphicObj.changePresetGeometry(properties.type);
                            }
                            if(properties.fill)
                            {
                                ArrGlyph[i].GraphicObj.changeFill(properties.fill);
                            }
                            if(properties.stroke)
                            {
                                ArrGlyph[i].GraphicObj.changeLine(properties.stroke);
                            }
                            if(isRealObject(properties.paddings))
                            {
                                ArrGlyph[i].GraphicObj.setPaddings(properties.paddings);
                            }

                        }
                    }

                    if(typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].GraphicObj.setTextVerticalAlign === "function")
                    {
                        ArrGlyph[i].GraphicObj.setTextVerticalAlign(props.verticalTextAlign);
                    }

                }
                arr_pages.sort(function(a, b){return a-b;});
                for(i = 0; i < arr_pages.length; ++i)
                {
                    this.drawingDocument.OnRecalculatePage(arr_pages[i], this.document.Pages[arr_pages[i]]);
                }
                this.drawingDocument.OnEndRecalculate(false, false);
            }
            else if(this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP)
            {
                //if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : this.curState.group.parent.Parent, CheckType : changestype_Paragraph_Content} ))
                {
                    if ( undefined != props.PositionH )
                        this.curState.group.parent.Set_PositionH( props.PositionH.RelativeFrom, props.PositionH.UseAlign, ( true === props.PositionH.UseAlign ? props.PositionH.Align : props.PositionH.Value ) );

                    if ( undefined != props.PositionV )
                        this.curState.group.parent.Set_PositionV( props.PositionV.RelativeFrom, props.PositionV.UseAlign, ( true === props.PositionV.UseAlign ? props.PositionV.Align : props.PositionV.Value ) );

                    ArrGlyph = this.curState.group.selectionInfo.selectionArray;
                    var b_change_diagram = false;
                    for(i = 0;  i< ArrGlyph.length; ++i)
                    {
                        if(ArrGlyph[i].isShape() && isRealObject(properties))
                        {
                            if(properties.type != undefined && properties.type != -1)
                            {
                                ArrGlyph[i].changePresetGeometry(properties.type);
                            }
                            if(properties.fill)
                            {
                                ArrGlyph[i].changeFill(properties.fill);
                            }
                            if(properties.stroke)
                            {
                                ArrGlyph[i].changeLine(properties.stroke);
                            }
                            if(isRealObject(properties.paddings))
                            {
                                ArrGlyph[i].setPaddings(properties.paddings);
                            }
                            if(isRealNumber(props.Width) && isRealNumber(props.Height))
                            {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if(ArrGlyph[i].spPr.geometry)
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                b_change_diagram = true;
                            }
                        }
                        else if(isRealObject(props) && typeof  props.ImageUrl === "string" && ArrGlyph[i].isImage() && ArrGlyph[i].chart == null)
                        {
                            ArrGlyph[i].setRasterImage2(props.ImageUrl);
                            if(isRealNumber(props.Width) && isRealNumber(props.Height))
                            {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if(ArrGlyph[i].spPr.geometry)
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                b_change_diagram = true;
                            }
                        }
                        else if(isRealObject(props) && isRealNumber(props.Width) && isRealNumber(props.Height) && ArrGlyph[i].isImage() && ArrGlyph[i].chart == null)
                        {
                            if(isRealNumber(props.Width) && isRealNumber(props.Height))
                            {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if(ArrGlyph[i].spPr.geometry)
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                b_change_diagram = true;
                            }
                        }
                        else if(ArrGlyph[i].chart != null && isRealObject(props) && isRealObject(props.ChartProperties))
                        {
                            b_change_diagram = true;
                            ArrGlyph[i].setDiagram(props.ChartProperties);
                            if(isRealNumber(props.Width) && isRealNumber(props.Height))
                            {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if(ArrGlyph[i].spPr.geometry)
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                b_change_diagram = true;
                            }
                        }
                        else if(ArrGlyph[i].chart != null && isRealObject(props) && isRealNumber(props.Width) && isRealNumber(props.Height))
                        {
                            b_change_diagram = true;
                            if(isRealNumber(props.Width) && isRealNumber(props.Height))
                            {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if(ArrGlyph[i].spPr.geometry)
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                b_change_diagram = true;
                            }
                        }

                        if(typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].setTextVerticalAlign === "function")
                        {
                            ArrGlyph[i].setTextVerticalAlign(props.verticalTextAlign);
                        }
                    }
                    if(b_change_diagram)
                    {
                        this.curState.group.updateSizes();
                        this.curState.group.recalculate();
                        var bounds = this.curState.group.parent.getBounds();
                        if(!this.curState.group.parent.Is_Inline())
                            this.curState.group.parent.OnEnd_ChangeFlow(this.curState.group.absOffsetX, this.curState.group.absOffsetY, this.curState.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
                        else
                            this.curState.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                    }
                }
            }
        }

        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },



    drawOnOverlay: function(overlay)
    {
        var _track_objects = this.arrTrackObjects;
        var _object_index;
        var _object_count = _track_objects.length;
        for(_object_index = 0; _object_index < _object_count; ++_object_index)
        {
            _track_objects[_object_index].draw(overlay);
        }
        if(this.curState.InlinePos)
        {
            this.drawingDocument.AutoShapesTrack.SetCurrentPage(this.curState.InlinePos.Page);
            this.drawingDocument.AutoShapesTrack.DrawInlineMoveCursor(this.curState.InlinePos.X, this.curState.InlinePos.Y, this.curState.InlinePos.Height, this.curState.InlinePos.transform)
        }
        //TODO Anchor Position
        return;
    },


    getAllFloatObjectsOnPage: function(pageIndex, docContent)
    {
        var arr, page, i, ret = [];
        if(!docContent.Is_HdrFtr())
        {

            page = this.graphicPages[pageIndex];
        }
        else
        {
            if(pageIndex === 0)
            {
                page = this.headerFooter.commonFirst;
            }
            else
            {
                if(pageIndex  % 2 === 1)
                {

                    page = this.headerFooter.commonEven;
                }
                else
                {
                    page = this.headerFooter.commonOdd;
                }
            }
        }
        arr = page.wrappingObjects.concat(page.behindDocObjects.concat(page.beforeTextObjects));
        for(i = 0; i < arr.length; ++i)
        {
            if(arr[i].parent.DocumentContent === docContent)
            {
                ret.push(arr[i].parent);
            }
        }
        return ret;
    },

    getAllFloatTablesOnPage: function(pageIndex, docContent)
    {
        if(!docContent)
        {
            docContent = this.document;
        }

        var tables, page;
        if(!docContent.Is_HdrFtr(false))
        {
            page = this.graphicPages[pageIndex];
        }
        else
        {
            if(pageIndex === 0)
            {
                page = this.headerFooter.commonFirst;
            }
            else
            {
                if(pageIndex  % 2 === 1)
                {

                    page = this.headerFooter.commonEven;
                }
                else
                {
                    page = this.headerFooter.commonOdd;
                }
            }
        }
        tables = page.flowTables;
        var ret = [];
        for(var i = 0; i < tables.length; ++i)
        {
            if(tables[i].Table.Parent === docContent)
                ret.push(tables[i]);
        }
        return ret;
    },

    getTargetDocContent: function()
    {
        var content;
        if(this.selection.textSelection)
        {
            content = this.selection.textSelection.getDocContent();
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.selection.textSelection)
        {
            content =  this.selection.groupSelection.selection.textSelection.getDocContent();
        }
        return content;
    },

    addInlineImage: function( W, H, Img, Chart, bFlow )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Add_InlineImage(W, H, Img, Chart, bFlow );
        }
    },

    addInlineTable: function( Cols, Rows )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Add_InlineTable(Cols, Rows);
        }
    },


    canAddComment: function()
    {
        var content = this.getTargetDocContent();
        return content && content.CanAdd_Comment();
    },

    addComment: function(commentData)
    {
        var content = this.getTargetDocContent();
        return content && content.Add_Comment(commentData);
    },

    documentIsSelectionLocked: function(CheckType)
    {
        var content = this.getTargetDocContent();
        content && content.Document_Is_SelectionLocked(CheckType);
        switch(CheckType)
        {
            case changestype_Drawing_Props:
            case changestype_Image_Properties:
            case changestype_Delete://TODO: Отдельная обработка
            case changestype_Remove:
            case changestype_Paragraph_Content:
            case changestype_Document_Content_Add:
            {
                var selection_array =  this.selectedObjects;
                for(var i = 0; i < selection_array.length; ++i)
                {
                    var par = selection_array[i].parent.Get_ParentParagraph();
                    par.Lock.Check(par.Get_Id());
                }
                break;
            }
        }
    },

    hyperlinkCheck: function(bCheckEnd)
    {
        var content = this.getTargetDocContent();
        if(content)
            return content.Hyperlink_Check(bCheckEnd);
        return null;
    },

    hyperlinkCanAdd: function(bCheckInHyperlink)
    {
        var content = this.getTargetDocContent();
        return content && content.Hyperlink_CanAdd(bCheckInHyperlink);
    },

    hyperlinkRemove: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Hyperlink_Remove();
    },

    hyperlinkModify: function( HyperProps )
    {
        var content = this.getTargetDocContent();
        return content && content.Hyperlink_Modify(HyperProps);
    },

    hyperlinkAdd: function( HyperProps )
    {
        var content = this.getTargetDocContent();
        return content && content.Hyperlink_Add(HyperProps);
    },

    isCurrentElementParagraph: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementParagraph();
    },
    isCurrentElementTable: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementTable();
    },


    Get_SelectedContent: function(SelectedContent)
    {
        var content = this.getTargetDocContent();
        return content && content.Get_SelectedContent(SelectedContent);
    },

    getCurrentPageAbsolute: function()
    {
        if(this.curState.majorObject)
        {
            return this.curState.majorObject.selectStartPage;
        }
        var selection_arr = this.selectedObjects;
        if(selection_arr[0].length > 0)
        {
            return selection_arr[0].selectStartPage;
        }
        return 0;
    },

    createGraphicPage: function(pageIndex)
    {
        if(!isRealObject(this.graphicPages[pageIndex]))
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
    },

    resetDrawingArrays : function(pageIndex, docContent)
    {
        if(isRealObject(this.graphicPages[pageIndex]))
            this.graphicPages[pageIndex].resetDrawingArrays(docContent);
    },

    onEndRecalculateDocument: function(pagesCount)
    {
        for(var i = 0; i < pagesCount; ++i)
        {
            if(!isRealObject(this.graphicPages[i]))
                this.graphicPages[i] = new CGraphicPage(i, this);
        }
        if(this.graphicPages.length > pagesCount)
        {
            for(i = pagesCount; i < this.graphicPages.length; ++i)
                delete  this.graphicPages[i];
        }
    },


    documentStatistics: function( CurPage, Statistics )
    {
        this.graphicPages[CurPage].documentStatistics(Statistics);
    },

    setSelectionState: function( state, stateIndex )
    {
        var selection_state = state[stateIndex];
        this.resetSelection();
        if(selection_state.textObject)
        {
            this.selectObject(selection_state.textObject, selection_state.selectStartPage);
            this.selection.textSelection = selection_state.textObject;
            selection_state.textObject.getDocContent().Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length-1);
        }
        else if(selection_state.groupObject)
        {
            this.selectObject(selection_state.groupObject, selection_state.selectStartPage);
            this.selection.groupSelection = selection_state.groupObject;
            selection_state.groupObject.setSelectionState(selection_state.groupSelection);
        }
        else if(selection_state.chartObject)
        {
            this.selectObject(selection_state.chartObject, selection_state.selectStartPage);
            this.selection.chartSelection = selection_state.chartObject;
            selection_state.chartObject.setSelectionState(selection_state.chartSelection);
        }
        else if(selection_state.wrapObject)
        {
            this.selectObject(selection_state.wrapObject, selection_state.selectStartPage);
            this.selection.wrapPolygonSelection = selection_state.wrapObject;
        }
        else
        {
            for(var i = 0; i < selection_state.selection.length; ++i)
            {
                this.selectObject(selection_state.selection[i].object, selection_state.selection[i].pageIndex);
            }
        }
    },


    getSelectionState: function()
    {
        var selection_state = {};
        if(this.selection.textSelection)
        {
            selection_state.textObject = this.selection.textSelection;
            selection_state.selectStartPage = this.selection.textSelection.selectStartPage;
            selection_state.textSelection = this.selection.textSelection.getDocContent().Get_SelectionState();
        }
        else if(this.selection.groupSelection)
        {
            selection_state.groupObject = this.selection.groupSelection;
            selection_state.selectStartPage = this.selection.groupSelection.selectStartPage;
            selection_state.groupSelection = this.selection.groupSelection.getSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            selection_state.chartObject = this.selection.chartSelection;
            selection_state.selectStartPage = this.selection.chartSelection.selectStartPage;
            selection_state.chartSelection = this.selection.chartSelection.getSelectionState();
        }
        else if(this.selection.wrapPolygonSelection)
        {
            selection_state.wrapObject = this.selection.wrapPolygonSelection;
            selection_state.selectStartPage = this.selection.wrapPolygonSelection.selectStartPage;
        }
        else
        {
            selection_state.selection = [];
            for(var i = 0; i < this.selectedObjects.length; ++i)
            {
                selection_state.selection.push({object: this.selectedObjects[i], pageIndex: this.selectedObjects[i].selectStartPage});
            }
        }
        return [selection_state];
    },



    documentUpdateSelectionState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.updateSelectionState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.documentUpdateSelectionState();
        }
        else
        {
            this.drawingDocument.SelectClear();
            this.drawingDocument.TargetEnd();
        }
    },


    getMajorParaDrawing: function()
    {
        return this.selectedObjects.length >  0  ? this.selectedObjects[0].parent : null;
    },

    documentUpdateRulersState: function()
    {
        if(this.selectedObjects.length === 1 && this.selectedObjects[0].documentUpdateRulersState)
            this.selectedObjects[0].documentUpdateRulersState();
    },

    documentUpdateInterfaceState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.getDocContent().Document_UpdateInterfaceState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateInterfaceState();
        }
        else
        {
            var para_pr = this.getParagraphParaPr();
            if(!(this.selectedObjects.length === 1 && this.selectedObjects[0].getObjectType() === historyitem_type_Shape && this.selectedObjects[0].getDocContent()))
            {
                if(this.selectedObjects[0])
                {
                    para_pr = this.selectedObjects[0].parent.Get_ParentParagraph().Get_CompiledPr2(true).ParaPr;
                }
            }
            editor.UpdateParagraphProp(para_pr);
            editor.UpdateTextPr(this.getParagraphTextPr());
        }
    },

    isNeedUpdateRulers: function()
    {
        if(this.selectedObjects.length === 1 && this.selectedObjects[0].getDocContent && this.selectedObjects[0].getDocContent())
        {
            return true;
        }
        return false;
    },

    documentCreateFontCharMap: function( FontCharMap )
    {
        //ToDo
        return;
    },

    documentCreateFontMap: function( FontCharMap )
    {
        //TODO
        return;
    },

    tableCheckSplit: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckSplit();
    },

    tableCheckMerge: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckMerge();
    },

    tableSelect: function( Type )
    {
        var content = this.getTargetDocContent();
        return content && content.Table_Select(Type);
    },

    tableRemoveTable: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveTable();
    },

    tableSplitCell: function(Cols, Rows)
    {
        var content = this.getTargetDocContent();
        return content && content.Table_SplitCell(Cols, Rows);
    },

    tableMergeCells: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_MergeCells();
    },

    tableRemoveCol: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveCol();
    },


    tableAddCol: function(bBefore)
    {
        var content = this.getTargetDocContent();
        return content && content.Table_AddCol(bBefore);
    },

    tableRemoveRow: function()
    {

        var content = this.getTargetDocContent();
        return content && content.Table_RemoveRow();
    },

    tableAddRow: function(bBefore)
    {

        var content = this.getTargetDocContent();
        return content && content.Table_AddRow(bBefore);
    },


    documentSearch: function( CurPage, String, search_Common )
    {
        this.graphicPages[CurPage].documentSearch(String, search_Common);
        CGraphicPage.prototype.documentSearch.call(this.getHdrFtrObjectsByPageIndex(CurPage), String, search_Common);
    },

    getSelectedElementsInfo: function( Info )
    {

        if(this.selectedObjects.length === 0)
            Info.Set_Drawing(-1);

        var content = this.getTargetDocContent();
        if(content)
        {
            Info.Set_Drawing(selected_DrawingObjectText);
            content.Get_SelectedElementsInfo(Info);
        }
        else
        {
            Info.Set_Drawing(selected_DrawingObject);
        }
        return Info;
    },

    selectNextObject: function(direction)
    {
        var selection_array = this.selectedObjects;
        if(selection_array.length > 0)
        {
            var i, graphic_page;
            if(direction > 0)
            {
                function selectNext(oThis, last_selected_object)
                {
                    var graphic_page;
                    if(last_selected_object.parent.DocumentContent.Is_HdrFtr(false))
                    {
                        graphic_page = oThis.getHdrFtrObjectsByPageIndex(last_selected_object.selectStartPage);
                    }
                    else
                    {
                        graphic_page = oThis.graphicPages[last_selected_object.selectStartPage];
                    }
                    var search_array = graphic_page.behindDocObjects.concat(graphic_page.wrappingObjects.concat(graphic_page.inlineObjects.concat(graphic_page.beforeTextObjects)));
                    if(search_array.length > 0)
                    {
                        for(var i = search_array.length-1; i > -1; --i)
                        {
                            if(search_array[i] === last_selected_object)
                                break;
                        }
                        if(i > -1)
                        {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i < search_array.length - 1 ? i+1 : 0], last_selected_object.selectStartPage);
                            return;
                        }
                        else
                        {
                            return;
                        }
                    }

                }

                if(this.selection.groupSelection)
                {
                    for(i = this.selection.groupSelection.arrGraphicObjects.length - 1; i > -1; --i)
                    {
                        if(this.selection.groupSelection.arrGraphicObjects[i].selected)
                            break;
                    }
                    if(i > -1)
                    {
                        if(i < this.selection.groupSelection.arrGraphicObjects.length-1)
                        {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i+1], this.selection.groupSelection.selectStartPage);
                        }
                        else
                        {
                            selectNext(this, this.selection.groupSelection);
                        }
                    }
                }
                //else if(this.selection.chartSelection)
                //{}
                else
                {
                    var last_selected_object = this.selectedObjects[this.selectedObjects.length-1];
                    if(last_selected_object.getObjectType() === historyitem_type_GroupShape)
                    {
                        this.resetSelection();
                        this.selectObject(last_selected_object, last_selected_object.selectStartPage);
                        this.selection.groupSelection = last_selected_object;
                        last_selected_object.selectObject(last_selected_object.arrGraphicObjects[0], last_selected_object.selectStartPage);
                    }
                    //else if(last_selected_object.getObjectType() === historyitem_type_ChartSpace)
                    //{TODO}
                    else
                    {
                        selectNext(this, last_selected_object)
                    }
                }
            }
            else
            {
                function selectPrev(oThis, first_selected_object)
                {
                    var graphic_page;
                    if(first_selected_object.parent.DocumentContent.Is_HdrFtr(false))
                    {
                        graphic_page = oThis.getHdrFtrObjectsByPageIndex(first_selected_object.selectStartPage);
                    }
                    else
                    {
                        graphic_page = oThis.graphicPages[first_selected_object.selectStartPage];
                    }
                    var search_array = graphic_page.behindDocObjects.concat(graphic_page.wrappingObjects.concat(graphic_page.inlineObjects.concat(graphic_page.beforeTextObjects)));
                    if(search_array.length > 0)
                    {
                        for(var i = 0; i < search_array.length; ++i)
                        {
                            if(search_array[i] === first_selected_object)
                                break;
                        }
                        if(i < search_array.length)
                        {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i > 0 ? i-1 : search_array.length-1], first_selected_object.selectStartPage);
                            return;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(this.selection.groupSelection)
                {
                    for(i = 0; i < this.selection.groupSelection.arrGraphicObjects.length; ++i)
                    {
                        if(this.selection.groupSelection.arrGraphicObjects[i].selected)
                            break;
                    }
                    if(i < this.selection.groupSelection.arrGraphicObjects.length)
                    {
                        if(i > 0)
                        {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i-1], this.selection.groupSelection.selectStartPage);
                        }
                        else
                        {
                            selectPrev(this, this.selection.groupSelection);
                        }
                    }
                    else
                    {

                        return;
                    }
                }
                //else if(this.selection.chartSelection)
                //{
                //
                //}
                else
                {
                    var first_selected_object = this.selectedObjects[0];
                    if(first_selected_object.getObjectType() === historyitem_type_GroupShape)
                    {
                        this.resetSelection();
                        this.selectObject(first_selected_object, first_selected_object.selectStartPage);
                        this.selection.groupSelection = first_selected_object;
                        first_selected_object.selectObject(first_selected_object.arrGraphicObjects[first_selected_object.arrGraphicObjects.length-1], first_selected_object.selectStartPage);
                    }
                    //else if(last_selected_object.getObjectType() === historyitem_type_ChartSpace)
                    //{TODO}
                    else
                    {
                        selectPrev(this, first_selected_object)
                    }
                }
            }
            this.updateOverlay();
        }
    },


    getCurrentParagraph: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_CurrentParagraph();
        }
        else
        {
            return null;
        }
    },

    getSelectedText: function(bClearText)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_SelectedText(bClearText);
        }
        else
        {
            return "";
        }
    },

    getCurPosXY: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_CurPosXY();
        }
        else
        {
            if(this.selectedObjects.length === 1)
            {
                return {X:this.selectedObjects[0].parent.X, Y: this.selectedObjects[0].parent.Y};
            }
            return {X: 0, Y: 0};
        }
    },

    isTextSelectionUse: function()
    {

        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Is_TextSelectionUse();
        }
        else
        {
            return false;
        }
    },


    isSelectionUse: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Is_TextSelectionUse();
        }
        else
        {
            return this.selectedObjects.length > 0;
        }
    },

    paragraphFormatPaste: function( CopyTextPr, CopyParaPr, Bool )
    {
        var content = this.getTargetDocContent();
        content && content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool );
    },

    getHdrFtrObjectsByPageIndex: function(pageIndex)
    {
        if(pageIndex === 0)
            return this.headerFooter.commonFirst;

        if(pageIndex % 2 === 1)
            return this.headerFooter.commonEven;

        return this.headerFooter.commonOdd;
    },

    getNearestPos: function(x, y, pageIndex, drawing)
    {
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        var cursor_type = this.nullState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(cursor_type && cursor_type.cursorType === "text")
        {
            var object = g_oTableId.Get_ById(cursor_type.objectId);
            if(object && object.getNearestPos)
            {
                return object.getNearestPos(x, y, pageIndex);
            }
        }
        return null;
    },

    selectionCheck: function( X, Y, Page_Abs, NearPos )
    {
        var text_object;
        if(this.selection.textSelection)
            text_object = this.selection.textSelection;
        else if(this.selection.groupSelection && this.selection.groupSelection.textSelection)
            text_object = this.selection.groupSelection.textSelection;
        if(text_object)
            text_object.selectionCheck( X, Y, Page_Abs, NearPos );
        return false;
    },

    getParagraphParaPrCopy: function()
    {
        return this.getParagraphParaPr();
    },

    getParagraphTextPrCopy: function()
    {
        return this.getParagraphTextPr();
    },

    getParagraphParaPr: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_Paragraph_ParaPr();
        }
        else
        {
            var result, cur_pr, selected_objects, i;
            function getPropsFromArr(arr)
            {
                var cur_pr, result_pr, content;
                for(var i = 0; i < arr.length; ++i)
                {
                    cur_pr = null;
                    if(arr[i].getObjectType() === historyitem_type_GroupShape)
                    {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    }
                    else
                    {
                        if(arr[i].getDocContent)
                        {
                            content = arr[i].getDocContent();
                            if(content)
                            {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_ParaPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }

                    if(cur_pr)
                    {
                        if(!result_pr)
                            result_pr = cur_pr;
                        else
                            result_pr.Compare(cur_pr);
                    }
                }
                return result_pr;
            }

            if(this.selection.groupSelection)
            {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            }
            else
            {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result ? result : new CParaPr();
        }
    },

    getParagraphTextPr: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_Paragraph_TextPr();
        }
        else
        {
            var result, cur_pr, selected_objects, i;
            function getPropsFromArr(arr)
            {
                var cur_pr, result_pr, content;
                for(var i = 0; i < arr.length; ++i)
                {
                    cur_pr = null;
                    if(arr[i].getObjectType() === historyitem_type_GroupShape)
                    {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    }
                    else
                    {
                        if(arr[i].getDocContent)
                        {
                            content = arr[i].getDocContent();
                            if(content)
                            {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_TextPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }

                    if(cur_pr)
                    {
                        if(!result_pr)
                            result_pr = cur_pr;
                        else
                            result_pr.Compare(cur_pr);
                    }
                }
                return result_pr;
            }

            if(this.selection.groupSelection)
            {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            }
            else
            {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result ? result : new CTextPr();
        }
    },

    isSelectedText: function()
    {
        return isRealObject(this.selection.textSelection || this.selection.groupSelection && this.selection.groupSelection.textSelection);
    },

    selectAll: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Select_All();
    },

    drawSelect: function(pageIndex)
    {
        var i;
        if(this.selection.textSelection)
        {
            if(this.selection.textSelection.selectStartPage === pageIndex)
                this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.textSelection.getTransformMatrix(), 0, 0, this.selection.textSelection.extX, this.selection.textSelection.extY, false, this.selection.textSelection.canRotate());
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selectStartPage === pageIndex)
            {
                this.drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.selection.groupSelection.getTransformMatrix(), 0, 0, this.selection.groupSelection.extX, this.selection.groupSelection.extY, false, this.selection.groupSelection.canRotate());
                if(this.selection.groupSelection.selection.textSelection)
                {
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length ; ++i)
                    {
                        this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, false, this.selection.groupSelection.selectedObjects[i].canRotate());
                    }
                }
                else if(this.selection.groupSelection.selection.chartSelection)
                {}
                else
                {
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length ; ++i)
                    {
                        this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, false, this.selection.groupSelection.selectedObjects[i].canRotate());
                    }
                }

                if(this.selection.groupSelection.selectedObjects.length === 1 && this.selection.groupSelection.selectedObjects[0].drawAdjustments)
                {
                    this.selection.groupSelection.selectedObjects[0].drawAdjustments(this.drawingDocument);
                }
            }
        }
        else if(this.selection.chartSelection)
        {

        }
        else if(this.selection.wrapPolygonSelection)
        {
            if(this.selection.wrapPolygonSelection.selectStartPage === pageIndex)
                this.drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.selection.wrapPolygonSelection.parent.wrappingPolygon.calculatedPoints, new CMatrix());
        }
        else
        {
            for(i = 0; i < this.selectedObjects.length; ++i)
            {
                if(this.selectedObjects[i].selectStartPage === pageIndex)
                {
                    this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selectedObjects[i].getTransformMatrix(), 0, 0, this.selectedObjects[i].extX, this.selectedObjects[i].extY, false, this.selectedObjects[i].canRotate());
              //      this.drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.selectedObjects[i].parent.wrappingPolygon.calculatedPoints, new CMatrix());
                }

            }
            if(this.selectedObjects.length === 1 && this.selectedObjects[0].drawAdjustments && this.selectedObjects[0].selectStartPage === pageIndex)
            {
                this.selectedObjects[0].drawAdjustments(this.drawingDocument);
            }
        }
        return;
    },

    drawBehindDoc: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawBehindDoc(graphics);
        graphics.shapePageIndex = null;
    },

    drawWrappingObjects: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawWrappingObjects(graphics);
        graphics.shapePageIndex = null;
    },

    drawBeforeObjects: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawBeforeObjects(graphics);
        graphics.shapePageIndex = null;
    },

    drawBehindDocHdrFtr: function(pageIndex, graphics)
    {

        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);

        if(hdr_footer_objects != null)
        {
            var behind_doc = hdr_footer_objects.behindDocObjects;
            for(var i = 0; i < behind_doc.length; ++i)
            {
                behind_doc[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },

    drawWrappingObjectsHdrFtr: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if(hdr_footer_objects != null)
        {
            var wrap_arr = hdr_footer_objects.wrappingObjects;
            for(var i = 0; i < wrap_arr.length; ++i)
            {
                wrap_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },


    drawBeforeObjectsHdrFtr: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if(hdr_footer_objects != null)
        {
            var bef_arr = hdr_footer_objects.beforeTextObjects;
            for(var i = 0; i < bef_arr.length; ++i)
            {
                bef_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },


    setStartTrackPos: function(x, y, pageIndex)
    {
        this.startTrackPos.x = x;
        this.startTrackPos.y = y;
        this.startTrackPos.pageIndex = pageIndex;
    },

    needUpdateOverlay: function()
    {
        return this.arrTrackObjects.length > 0 || this.curState.InlinePos;
    },

    changeCurrentState: function(state)
    {
        this.curState = state;
    },

    canGroup: function(bGetArray)
    {
        var selection_array = this.selectedObjects;
        if(selection_array.length < 2)
            return bGetArray ? [] :false;
        if(!selection_array[0].canGroup())
            return bGetArray ? [] : false;
        var first_page_index = selection_array[0].parent.pageIndex;
        for(var index = 1; index < selection_array.length; ++index)
        {
            if(!selection_array[index].canGroup())
                return  bGetArray ? [] : false;
            if(first_page_index !== selection_array[index].parent.pageIndex)
                return bGetArray ? [] : false;
        }
        if(bGetArray)
        {
            var ret = selection_array.concat([]);
            ret.sort(ComparisonByZIndexSimpleParent);
            return ret;
        }
        return true;
    },

    canUnGroup: function(bRetArray)
    {
        var _arr_selected_objects = this.selectedObjects;
        var ret_array = [];
        for(var _index = 0; _index < _arr_selected_objects.length; ++_index)
        {
            if(_arr_selected_objects[_index].getObjectType() === historyitem_type_GroupShape && !_arr_selected_objects[_index].parent.Is_Inline())
            {
                if(!(bRetArray === true))
                    return true;
                ret_array.push(_arr_selected_objects[_index]);

            }
        }
        return bRetArray === true ? ret_array : false;
    },


    getBoundsForGroup: DrawingObjectsController.prototype.getBoundsForGroup,


    getArrayForGrouping: function()
    {
        return this.canGroup(true);
    },

    getGroup: DrawingObjectsController.prototype.getGroup,

    addObjectOnPage: function(pageIndex, object)
    {
        if(!object.parent.DocumentContent.Is_HdrFtr())
        {
            if(!this.graphicPages[pageIndex])
            {
                this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
                for(var z = 0; z < pageIndex; ++z)
                {
                    if(!this.graphicPages[z])
                        this.graphicPages[z] = new CGraphicPage(z, this);
                }
            }
            var page = this.graphicPages[pageIndex];
            var array_type = object.parent.getDrawingArrayType();
            switch(array_type)
            {
                case DRAWING_ARRAY_TYPE_INLINE:
                {
                    page.inlineObjects.push(object);
                    break;
                }
                case DRAWING_ARRAY_TYPE_BEHIND:
                {
                    page.behindDocObjects.push(object);
                    page.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
                    break;
                }
                case DRAWING_ARRAY_TYPE_BEFORE:
                {
                    page.beforeTextObjects.push(object);
                    page.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
                    break;
                }
                case DRAWING_ARRAY_TYPE_WRAPPING:
                {
                    page.wrappingObjects.push(object);
                    page.wrappingObjects.sort(ComparisonByZIndexSimpleParent);
                    break;
                }
            }
        }
        else
        {
            return;
            if(isRealObject(object.parent) && isRealObject(object.parent.DocumentContent))
            {
                //var top_doc_content = ;
                var hdr_or_ftr = object.parent.DocumentContent.Is_HdrFtr(true);
                var hdr_ftr_controller_content = this.document.HdrFtr.Content[0];
                var headers, footers;
                headers = hdr_ftr_controller_content.Header;
                footers = hdr_ftr_controller_content.Footer;
                var hdr_footer_objects, common_hdr_footer_objects = [];

                if(headers.First === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.header.first;
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                    if(this.headerFooter.header.first === this.headerFooter.header.even)
                        common_hdr_footer_objects.push(this.headerFooter.commonEven);
                    if(this.headerFooter.header.first === this.headerFooter.header.odd)
                        common_hdr_footer_objects.push(this.headerFooter.commonOdd);

                }
                else if(footers.First === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.footer.first;
                    common_hdr_footer_objects.push(this.headerFooter.commonFirst);

                    if(this.headerFooter.header.first === this.headerFooter.header.even)
                        common_hdr_footer_objects.push(this.headerFooter.commonEven);
                    if(this.headerFooter.header.first === this.headerFooter.header.odd)
                        common_hdr_footer_objects.push(this.headerFooter.commonOdd);
                }
                else if(headers.Even === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.header.even;
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);

                    if(this.headerFooter.header.even === this.headerFooter.header.first)
                        common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                    if(this.headerFooter.header.even === this.headerFooter.header.odd)
                        common_hdr_footer_objects.push(this.headerFooter.commonOdd);
                }
                else if(footers.Even === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.footer.even;
                    common_hdr_footer_objects.push(this.headerFooter.commonEven);

                    if(this.headerFooter.header.even === this.headerFooter.header.first)
                        common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                    if(this.headerFooter.header.even === this.headerFooter.header.odd)
                        common_hdr_footer_objects.push(this.headerFooter.commonOdd);
                }
                else if(headers.Odd === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.header.odd;
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);

                    if(this.headerFooter.header.odd === this.headerFooter.header.first)
                        common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                    if(this.headerFooter.header.odd === this.headerFooter.header.even)
                        common_hdr_footer_objects.push(this.headerFooter.commonEven);
                }
                else if(footers.Odd === hdr_or_ftr)
                {
                    hdr_footer_objects = this.headerFooter.footer.odd;
                    common_hdr_footer_objects.push(this.headerFooter.commonOdd);

                    if(this.headerFooter.header.odd === this.headerFooter.header.first)
                        common_hdr_footer_objects.push(this.headerFooter.commonFirst);
                    if(this.headerFooter.header.odd === this.headerFooter.header.even)
                        common_hdr_footer_objects.push(this.headerFooter.commonEven);
                }

                var i;
                if(hdr_footer_objects != null)
                {
                    array_type = object.parent.getDrawingArrayType();
                    switch(array_type)
                    {
                        case DRAWING_ARRAY_TYPE_INLINE:
                        {
                            hdr_footer_objects.inlineArray.push(object);
                            for(i = 0; i < common_hdr_footer_objects.length; ++i)
                                common_hdr_footer_objects[i].inlineObjects.push(object);
                            break;
                        }
                        case DRAWING_ARRAY_TYPE_BEHIND:
                        {
                            hdr_footer_objects.behindDocArray.push(object);
                            for(i = 0; i < common_hdr_footer_objects.length; ++i)
                            {
                                common_hdr_footer_objects[i].behindDocObjects.push(object);
                                common_hdr_footer_objects[i].behindDocObjects.sort(ComparisonByZIndexSimpleParent);
                            }

                            break;
                        }
                        case DRAWING_ARRAY_TYPE_BEFORE:
                        {
                            hdr_footer_objects.beforeTextArray.push(object);
                            for(i = 0; i < common_hdr_footer_objects.length; ++i)
                            {
                                common_hdr_footer_objects[i].beforeTextObjects.push(object);
                                common_hdr_footer_objects[i].beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
                            }
                            break;
                        }
                        case DRAWING_ARRAY_TYPE_WRAPPING:
                        {
                            hdr_footer_objects.wrappingArray.push(object);
                            for(i = 0; i < common_hdr_footer_objects.length; ++i)
                            {
                                common_hdr_footer_objects[i].wrappingObjects.push(object);
                                common_hdr_footer_objects[i].wrappingObjects.sort(ComparisonByZIndexSimpleParent);
                            }
                            break;
                        }
                    }
                }
            }
        }
    },

    cursorGetPos: function()
    {
        var text_object;
        if(this.selection.textObject)
        {
            text_object = this.selection.textObject;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.textObject)
        {
            text_object = this.selection.groupSelection.textObject;
        }
        if(text_object)
            return text_object.cursorGetPos();

        return {X: 0, Y: 0};
    },

    getNewGroupPos: function()
    {
        var arrGraphicObjects = this.selectionInfo.selectionArray;
        var x_min, x_max, y_min, y_max;
        var cur_x_min, cur_x_max, cur_y_max, cur_y_min;
        for(var object_index = 0; object_index < arrGraphicObjects.length; object_index++)
        {
            arrGraphicObjects[object_index].deselect();
            var cur_graphic_object = arrGraphicObjects[object_index].GraphicObj;
            if(cur_graphic_object.isGroup())
            {
                var  cur_sp_tree = cur_graphic_object.spTree;
                for(var sp_index = 0; sp_index < cur_sp_tree.length; ++sp_index)
                {
                    var  cur_sp = cur_sp_tree[sp_index];
                    var full_rot = cur_sp.absRot + cur_graphic_object.absRot;
                    var hc, vc;
                    var xc, yc;
                    hc = cur_sp.absExtX*0.5;
                    vc = cur_sp.absExtY*0.5;
                    xc = cur_sp.transform.TransformPointX(hc, vc);
                    yc = cur_sp.transform.TransformPointY(hc, vc);
                    if((full_rot >= 0 && full_rot < Math.PI*0.25)
                        || (full_rot > 3*Math.PI*0.25 && full_rot < 5*Math.PI*0.25)
                        || (full_rot > 7*Math.PI*0.25 && full_rot < 2*Math.PI))
                    {
                        cur_x_min = xc - hc;
                        cur_x_max = xc + hc;
                        cur_y_min = yc - vc;
                        cur_y_max = yc + vc;
                    }
                    else
                    {
                        cur_x_min = xc - vc;
                        cur_x_max = xc + vc;
                        cur_y_min = yc - hc;
                        cur_y_max = yc + hc;
                    }
                    if(object_index === 0 && sp_index === 0)
                    {
                        x_max = cur_x_max;
                        x_min = cur_x_min;
                        y_max = cur_y_max;
                        y_min = cur_y_min;
                    }
                    else
                    {
                        if(cur_x_max > x_max)
                            x_max = cur_x_max;
                        if(cur_x_min < x_min)
                            x_min = cur_x_min;
                        if(cur_y_max > y_max)
                            y_max = cur_y_max;
                        if(cur_y_min < y_min)
                            y_min = cur_y_min;
                    }
                }
            }
            else
            {
                full_rot = cur_graphic_object.absRot;
                hc = cur_graphic_object.absExtX*0.5;
                vc = cur_graphic_object.absExtY*0.5;
                xc = cur_graphic_object.transform.TransformPointX(hc, vc);
                yc = cur_graphic_object.transform.TransformPointY(hc, vc);
                if((full_rot >= 0 && full_rot < Math.PI*0.25)
                    || (full_rot > 3*Math.PI*0.25 && full_rot < 5*Math.PI*0.25)
                    || (full_rot > 7*Math.PI*0.25 && full_rot < 2*Math.PI))
                {
                    cur_x_min = xc - hc;
                    cur_x_max = xc + hc;
                    cur_y_min = yc - vc;
                    cur_y_max = yc + vc;
                }
                else
                {
                    cur_x_min = xc - vc;
                    cur_x_max = xc + vc;
                    cur_y_min = yc - hc;
                    cur_y_max = yc + hc;
                }
                if(object_index === 0)
                {
                    x_max = cur_x_max;
                    x_min = cur_x_min;
                    y_max = cur_y_max;
                    y_min = cur_y_min;
                }
                else
                {
                    if(cur_x_max > x_max)
                        x_max = cur_x_max;
                    if(cur_x_min < x_min)
                        x_min = cur_x_min;
                    if(cur_y_max > y_max)
                        y_max = cur_y_max;
                    if(cur_y_min < y_min)
                        y_min = cur_y_min;
                }
            }
        }
        return {x: x_min, y: y_min};
    },

    checkCommonBounds: function(arrDrawings)
    {
        var l, t, r,b;
        var x_arr_min = [], y_arr_min = [];
        var x_arr_max = [], y_arr_max = [];
        for(var i = 0; i < arrDrawings.length; ++i)
        {
            var bounds = arrDrawings[i].bounds;
            l = bounds.l + arrDrawings[i].posX;
            r = bounds.r + arrDrawings[i].posX;
            t = bounds.t + arrDrawings[i].posY;
            b = bounds.b + arrDrawings[i].posY;
            x_arr_max.push(r);
            x_arr_min.push(l);
            y_arr_max.push(b);
            y_arr_min.push(t);
        }
        return {minX: Math.min.apply(Math, x_arr_min), maxX: Math.max.apply(Math, x_arr_max), minY: Math.min.apply(Math, y_arr_min), maxY: Math.max.apply(Math, y_arr_max)};
    },

    groupSelectedObjects: function()
    {
        var objects_for_grouping = this.canGroup(true);
        if(objects_for_grouping.length < 2)
            return;

        var check_paragraphs = [];
        var parent_paragraph, i, j;
        for(i = 0; i < objects_for_grouping.length; ++i)
        {
            parent_paragraph = objects_for_grouping[i].parent.Get_ParentParagraph();
            for(j = 0; j < check_paragraphs.length; ++j)
            {
                if(check_paragraphs[j] === parent_paragraph)
                    break;
            }
            if(j === check_paragraphs.length)
                check_paragraphs.push(parent_paragraph);
        }


        var common_bounds = this.checkCommonBounds(objects_for_grouping);


        History.Create_NewPoint();
        var para_drawing = new ParaDrawing(common_bounds.maxX - common_bounds.minX, common_bounds.maxY - common_bounds.minY, null, this.drawingDocument, null, null);
        para_drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        para_drawing.Set_DrawingType(drawing_Anchor);
        var group = this.getGroup(objects_for_grouping);
        group.spPr.xfrm.setOffX(0);
        group.spPr.xfrm.setOffY(0);
        group.setParent(para_drawing);
        para_drawing.Set_GraphicObject(group);

        var nearest_pos = this.document.Get_NearestPos(objects_for_grouping[0].parent.pageIndex, common_bounds.minX, common_bounds.minY, true, para_drawing);
        parent_paragraph = nearest_pos.Paragraph;
        for(j = 0; j < check_paragraphs.length; ++j)
        {
            if(check_paragraphs[j] === parent_paragraph)
                break;
        }
        if(j === check_paragraphs.length)
            check_paragraphs.push(parent_paragraph);

        if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
        {
            for(i = 0; i < objects_for_grouping.length; ++i)
            {
                objects_for_grouping[i].parent.Remove_FromDocument(false);
            }
            para_drawing.Set_XYForAdd( common_bounds.minX,  common_bounds.minY, nearest_pos, objects_for_grouping[0].parent.pageIndex);
            para_drawing.Add_ToDocument(nearest_pos, false);
            this.addGraphicObject(para_drawing);
            this.document.Recalculate();
        }
        else
        {
            this.document.Document_Undo();
        }
    },

    getParentParagraphsFromArr: function(drawings)
    {
        var ret = [];
        var i, j;
        for(i = 0; i < drawings.length; ++i)
        {
            var paragraph = drawings[i].parent.Get_ParentParagraph();
            for(j = 0; j < ret.length; ++j)
            {
                if(ret[j] === paragraph)
                    break;
            }
            if(j === ret.length)
                ret.push(paragraph);
        }
        return ret;
    },

    unGroupSelectedObjects: function()
    {
        if(!(editor.isViewMode === false))
            return;
        var ungroup_arr = this.canUnGroup(true);
        if(ungroup_arr.length > 0)
        {
            var check_paragraphs =  this.getParentParagraphsFromArr(ungroup_arr);
            //todo if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.resetSelection();
                var i, j, cur_page_index, nearest_pos, cur_group, sp_tree, sp, parent_paragraph, page_num;
                var a_objects = [];
                for(i = 0; i < ungroup_arr.length; ++i)
                {
                    cur_group = ungroup_arr[i];
                    parent_paragraph = cur_group.parent.Get_ParentParagraph();
                    page_num = cur_group.selectStartPage;
                    sp_tree = cur_group.spTree;
                    for(j = 0; j < sp_tree.length; ++j)
                    {
                        sp = sp_tree[j];
                        var drawing = new ParaDrawing(0, 0, sp_tree[j], this.drawingDocument, null, null);
                        drawing.Set_GraphicObject(sp);
                        sp.setParent(drawing);
                        drawing.Set_DrawingType(drawing_Anchor);
                        drawing.Set_WrappingType(cur_group.parent.wrappingType);
                        drawing.Update_Size(sp.bounds.w, sp.bounds.h);
                        sp.spPr.xfrm.setRot(normalizeRotate(sp.rot + cur_group.rot));
                        sp.spPr.xfrm.setOffX(0);
                        sp.spPr.xfrm.setOffY(0);
                        sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                        sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                        sp.setGroup(null);
                        nearest_pos = this.document.Get_NearestPos(page_num, sp.bounds.x + sp.posX, sp.bounds.y + sp.posY, true, drawing);

                        drawing.Set_XYForAdd(sp.bounds.x + sp.posX, sp.bounds.y + sp.posY, nearest_pos, page_num);
                        //drawing.Add_ToDocument2(parent_paragraph);
                        a_objects.push({drawing: drawing, par: parent_paragraph});
                        this.selectObject(sp, page_num);
                    }
                    cur_group.parent.Remove_FromDocument(false);
                }
                for(i = 0; i < a_objects.length; ++i)
                {
                    a_objects[i].drawing.Add_ToDocument2(a_objects[i].par);
                }
            }
        }
    },

    setTableProps: function(Props)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_TableProps(Props);
        }
    },

    moveSelectedObjects: function(dx, dy)
    {
        if(!(editor.isViewMode === false))
            return;

        this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
        this.swapTrackObjects();
        var move_state;
        if(!this.selection.groupSelection)
            move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
        else
            move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);

        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(dx, dy, this.arrTrackObjects[i].originalObject.selectStartPage);
        move_state.onMouseUp(global_mouseEvent, 0, 0, 0);
    },

    cursorMoveLeft: function(AddToSelect/*Shift*/, Word/*Ctrl*/)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveLeft(AddToSelect, Word);
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(-this.drawingDocument.GetMMPerDot(5), 0);
        }
    },

    cursorMoveRight: function(AddToSelect, Word)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveRight(AddToSelect, Word);
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(this.drawingDocument.GetMMPerDot(5), 0);
        }
    },


    cursorMoveUp: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveUp(AddToSelect);
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(0, -this.drawingDocument.GetMMPerDot(5));
        }
    },

    cursorMoveDown: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveDown(AddToSelect);
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(0, this.drawingDocument.GetMMPerDot(5));
        }
    },

    cursorMoveEndOfLine: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveEndOfLine(AddToSelect);
        }
    },

    selectionIsEmpty: function(bCheckHidden)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Selection_IsEmpty(bCheckHidden);
        }
        return false;
    },

    cursorMoveStartOfLine: function(AddToSelect)
    {

        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveStartOfLine(AddToSelect);
        }
    },

    cursorMoveAt: function( X, Y, AddToSelect )
    {
        var text_object;
        if(this.selection.textSelection)
        {
            text_object = this.selection.textSelection;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.textSelection)
        {
            text_object = this.selection.groupSelection.textSelection;
        }
        if(text_object)
        {
            text_object.cursorMoveAt( X, Y, AddToSelect );
        }
    },

    cursorMoveToCell: function(bNext )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveToCell(bNext);
        }
    },

    updateAnchorPos: function()
    {
        //TODO
    },

    resetSelection: function()
    {
        this.resetInternalSelection();
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].selected = false;
        }
        this.selectedObjects.length = 0;
        this.selection =
        {
            selectedObjects: [],
            groupSelection: null,
            chartSelection: null,
            textSelection: null
        };
    },

    resetSelection2: function()
    {
        var sel_arr = this.selectedObjects;
        if(sel_arr.length > 0)
        {
            var top_obj = sel_arr[0];
            for(var i = 1; i < sel_arr.length; ++i)
            {
                var cur_obj = sel_arr[i];
                if(cur_obj.selectStartPage < top_obj.selectStartPage)
                {
                    top_obj = cur_obj;
                }
                else if(cur_obj.selectStartPage === top_obj.selectStartPage)
                {
                    if(cur_obj.parent.Get_ParentParagraph().Y < top_obj.parent.Get_ParentParagraph().Y)
                        top_obj = cur_obj;
                }
            }
            this.resetSelection();
            top_obj.parent.GoTo_Text();
        }
    },

    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,

    remove: function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
        }
        else if(this.selectedObjects.length > 0)
        {
            if(this.selection.groupSelection)
            {
                if(this.selection.groupSelection.chartSelection)
                {
                    //TODO
                }
                else
                {
                    var group_map = {}, group_arr = [], i, cur_group, sp, xc, yc, hc, vc, rel_xc, rel_yc, j;
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i)
                    {
                        this.selection.groupSelection.selectedObjects[i].group.removeFromSpTree(this.selection.groupSelection.selectedObjects[i].Get_Id());
                        group_map[this.selection.groupSelection.selectedObjects[i].group.Get_Id()+""] = this.selection.groupSelection.selectedObjects[i].group;
                    }
                    for(var key in group_map)
                    {
                        if(group_map.hasOwnProperty(key))
                            group_arr.push(group_map[key]);
                    }
                    group_arr.sort(CompareGroups);
                    var a_objects  = [];
                    for(i = 0; i < group_arr.length; ++i)
                    {
                        cur_group = group_arr[i];
                        if(isRealObject(cur_group.group))
                        {
                            if(cur_group.spTree.length === 0)
                            {
                                cur_group.group.removeFromSpTree(cur_group.Get_Id());
                            }
                            else if(cur_group.spTree.length == 1)
                            {
                                sp = cur_group.spTree[0];
                                hc = sp.spPr.xfrm.extX/2;
                                vc = sp.spPr.xfrm.extY/2;
                                xc = sp.transform.TransformPointX(hc, vc);
                                yc = sp.transform.TransformPointY(hc, vc);
                                rel_xc = cur_group.group.invertTransform.TransformPointX(xc, yc);
                                rel_yc = cur_group.group.invertTransform.TransformPointY(xc, yc);
                                sp.spPr.xfrm.setOffX(rel_xc - hc);
                                sp.spPr.xfrm.setOffY(rel_yc - vc);
                                sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(cur_group.group);
                                for(j = 0; j < cur_group.group.spTree.length; ++j)
                                {
                                    if(cur_group.group.spTree[j] === cur_group)
                                    {
                                        cur_group.group.addToSpTreeToPos(j, sp);
                                        cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                    }
                                }
                            }
                        }
                        else
                        {
                            var para_drawing = cur_group.parent, para_drawing2 = null;
                            var paragraph = cur_group.parent.Get_ParentParagraph();
                            if(cur_group.spTree.length === 0)
                            {
                                this.resetInternalSelection();
                                this.remove();
                                return;
                            }
                            else if(cur_group.spTree.length === 1)
                            {
                                sp = cur_group.spTree[0];
                                sp.spPr.xfrm.setOffX(0);
                                sp.spPr.xfrm.setOffY(0);
                                sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(null);
                                para_drawing.Set_GraphicObject(sp);
                                this.resetSelection();
                                this.selectObject(sp, cur_group.selectStartPage);
                                if(para_drawing.Is_Inline())
                                {
                                    para_drawing.OnEnd_ResizeInline(sp.bounds.w, sp.bounds.h);
                                    return;
                                }
                                else
                                {
                                    var new_x, new_y;
                                    new_x = cur_group.x + sp.bounds.x;
                                    new_y = cur_group.y + sp.bounds.y;
                                    sp.recalcBounds();
                                    var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage, new_x, new_y, true, para_drawing);
                                    para_drawing.Remove_FromDocument(false);
                                    para_drawing.Set_XYForAdd(new_x, new_y, nearest_pos, cur_group.selectStartPage);
                                    para_drawing.Add_ToDocument2(para_drawing.Get_ParentParagraph());
                                    this.document.Recalculate();
                                    break;
                                }
                            }
                            else
                            {
                                var new_x, new_y;
                                new_x = cur_group.x + sp.bounds.x;
                                new_y = cur_group.y + sp.bounds.y;
                                sp.recalcBounds();
                                var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage, new_x, new_y, true, para_drawing);
                                para_drawing.Remove_FromDocument(false);
                                para_drawing.Set_XYForAdd(new_x, new_y, nearest_pos, cur_group.selectStartPage);
                                para_drawing.Add_ToDocument2(para_drawing.Get_ParentParagraph());
                                this.document.Recalculate();
                                break;
                            }

                            var d;
                            if(para_drawing2)
                                d = para_drawing2;
                            else
                                d = para_drawing;
                            var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage,cur_group.posX + d.GraphicObj.bounds.x,cur_group.posY + d.GraphicObj.bounds.y, true, d);
                            para_drawing.Remove_FromDocument(false);
                            d.Set_XYForAdd(cur_group.posX + d.GraphicObj.bounds.x, cur_group.posX + d.GraphicObj.bounds.y, nearest_pos, cur_group.selectStartPage);
                            d.Add_ToDocument2(paragraph);
                            this.document.Recalculate();
                            return;
                        }
                    }
                }
            }
            //else if(this.selection.chartSelection) TODO
            //{}
            else
            {
                this.selectedObjects[0].parent.GoTo_Text();
                for(var i = 0; i < this.selectedObjects.length; ++i)
                {
                    this.selectedObjects[i].parent.Remove_FromDocument(false);
                }
                this.resetSelection();
                this.document.Recalculate();
            }
        }
    },

    addGraphicObject: function(paraDrawing)
    {
        this.drawingObjects.push(paraDrawing);
        this.objectsMap["_" + paraDrawing.Get_Id()] = paraDrawing;
        this.zIndexManager.addItem(null, paraDrawing);
    },

    isPointInDrawingObjects: function(x, y, pageIndex)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(isRealObject(ret))
        {
            var object = g_oTableId.Get_ById(ret.objectId);
            if(isRealObject(object) && isRealObject(object.parent))
            {
                return ret.bMarker ?  DRAWING_ARRAY_TYPE_BEFORE : object.parent.getDrawingArrayType();
            }
        }
        return -1;
    },

    isPointInDrawingObjects2: function(x, y, pageIndex, epsilon)
    {
        return this.isPointInDrawingObjects(x, y, pageIndex, epsilon)
    },


    pointInObjInDocContent: function( docContent, X, Y, pageIndex )
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, X, Y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            var object = g_oTableId.Get_ById(ret.objectId);
            if(object)
            {
                var parent_drawing;
                if(!object.group && object.parent)
                {
                    parent_drawing = object;
                }
                else if(object.group)
                {
                    parent_drawing = object.group;
                    while(parent_drawing.group)
                        parent_drawing = parent_drawing.group;
                }
                if(parent_drawing &&  parent_drawing.parent)
                    return docContent === parent_drawing.parent.DocumentContent.Is_TopDocument(true);
            }
        }
        return false;
    },

    pointInSelectedObject: function(x, y, pageIndex)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            var object = g_oTableId.Get_ById(ret.objectId);
            if(object && object.selected && object.selectStartPage === pageIndex)
                return true;
        }
        return false;

    },

    canChangeWrapPolygon: function()
    {

        return !this.selection.groupSelection && !this.selection.textSelection && !this.selection.chartSelection
            && this.selectedObjects.length === 1 && this.selectedObjects[0].canChangeWrapPolygon && this.selectedObjects[0].canChangeWrapPolygon();
    },

    startChangeWrapPolygon: function()
    {
        if(this.canChangeWrapPolygon())
        {
            this.resetInternalSelection();
            this.selection.wrapPolygonSelection = this.selectedObjects[0];
            this.updateOverlay();
        }
    },

    getObjectById: function(id)
    {
        if(isRealObject(this.objectsMap["_" + id]))
            return this.objectsMap["_" + id];
        return null;
    },

    removeById: function(pageIndex, id)
    {
        var object = g_oTableId.Get_ById(id);
        if(isRealObject(object))
        {
            var hdr_ftr = object.DocumentContent.Is_HdrFtr(true);
            if(hdr_ftr != null)
            {
                function findInArrayAndRemove(drawingArray, Id)
                {
                    for(var i = drawingArray.length-1; i > -1; --i)
                    {
                        if(drawingArray[i].parent.Id === Id)
                            drawingArray.splice(i, 1);
                    }
                }

                function findInArrayAndRemoveFromDrawingPage(drawingPage, Id)
                {
                    if(!drawingPage)
                        return;
                    if(Array.isArray(drawingPage.inlineObjects))
                    {
                        findInArrayAndRemove(drawingPage.inlineObjects, Id);
                        findInArrayAndRemove(drawingPage.behindDocObjects, Id);
                        findInArrayAndRemove(drawingPage.wrappingObjects, Id);
                        findInArrayAndRemove(drawingPage.beforeTextObjects, Id);
                    }
                    else if(Array.isArray(drawingPage.inlineArray))
                    {
                        findInArrayAndRemove(drawingPage.inlineArray, Id);
                        findInArrayAndRemove(drawingPage.behindDocArray, Id);
                        findInArrayAndRemove(drawingPage.wrappingArray, Id);
                        findInArrayAndRemove(drawingPage.beforeTextArray, Id);
                    }
                }

                var check_hdr_ftr_arrays = [];
                if(pageIndex === 0)
                {
                    check_hdr_ftr_arrays.push(this.headerFooter.header.first);
                    check_hdr_ftr_arrays.push(this.headerFooter.footer.first);
                }
                else
                {
                    if(pageIndex  % 2 === 1)
                    {
                        check_hdr_ftr_arrays.push(this.headerFooter.header.even);
                        check_hdr_ftr_arrays.push(this.headerFooter.footer.even);
                    }
                    else
                    {
                        check_hdr_ftr_arrays.push(this.headerFooter.header.odd);
                        check_hdr_ftr_arrays.push(this.headerFooter.footer.odd);
                    }
                }

                check_hdr_ftr_arrays.push(this.headerFooter.commonFirst);
                check_hdr_ftr_arrays.push(this.headerFooter.commonEven);
                check_hdr_ftr_arrays.push(this.headerFooter.commonOdd);

                for(var i = 0; i < check_hdr_ftr_arrays.length; ++i)
                {
                    findInArrayAndRemoveFromDrawingPage(check_hdr_ftr_arrays[i], id);
                }
            }
            else
            {
                var page = this.graphicPages[object.pageIndex];
                if(isRealObject(page))
                {
                    var array_type = object.getDrawingArrayType();
                    page.delObjectById(id, array_type);
                }
            }
        }
    },

    Remove_ById: function(id)
    {
        for(var i = 0; i < this.graphicPages.length; ++i)
        {
            this.removeById(i, id)
        }
    },

    selectById: function(id, pageIndex)
    {
        this.resetSelection();
        var object = g_oTableId.Get_ById(id);
        object.GraphicObj.select(this, pageIndex);
    },

    calculateAfterChangeTheme: function()
    {
        /*todo*/
        for(var i = 0; i < this.drawingObjects.length; ++i)
        {
            this.drawingObjects[i].calculateAfterChangeTheme();
        }
        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },

    updateSelectionState: function()
    {
        return;
    },


    drawSelectionPage: function(pageIndex)
    {
        if(this.selection.textSelection)
        {
            if(this.selection.textSelection.selectStartPage === pageIndex)
            {
                this.drawingDocument.UpdateTargetTransform(this.selection.textSelection.transformText);
                this.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
            }
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selectStartPage === pageIndex)
            {
                this.selection.groupSelection.drawSelectionPage(pageIndex);
            }
        }
    },
    getAllRasterImagesOnPage: function(pageIndex)
    {
        var ret = [];
        var graphic_page = this.graphicPages[pageIndex];
        var hdr_ftr_page = this.getHdrFtrObjectsByPageIndex(pageIndex);

        var graphic_array = graphic_page.beforeTextObjects.concat(graphic_page.wrappingObjects).concat(graphic_page.inlineObjects).concat(graphic_page.behindDocObjects);
        graphic_array = graphic_array.concat(hdr_ftr_page.beforeTextObjects).concat(hdr_ftr_page.wrappingObjects).concat(hdr_ftr_page.inlineObjects).concat(hdr_ftr_page.behindDocObjects);
        for(var i = 0; i < graphic_array.length; ++i)
        {
            if(graphic_array[i].getAllRasterImages)
                graphic_array[i].getAllRasterImages(ret);
        }
        return ret;
    },


    addNewParagraph: function(bRecalculate)
    {
        var content = this.getTargetDocContent();
        content && content.Add_NewParagraph(bRecalculate);
    },


    paragraphClearFormatting: function()
    {
        var content = this.getTargetDocContent();
        content && content.Paragraph_ClearFormatting();
    },

    applyDocContentFunction: function(f, args)
    {
        function applyToArrayDrawings(arr)
        {
            for(var i = 0; i < arr.length; ++i)
            {
                if(arr[i].getObjectType() === historyitem_type_GroupShape)
                {
                    applyToArrayDrawings(arr[i].arrGraphicObjects);
                }
                else if(arr[i].getDocContent)
                {
                    var content = arr[i].getDocContent();
                    content.Set_ApplyToAll(true);
                    f.apply(content, args);
                    content.Set_ApplyToAll(false);
                }
            }
        }

        if(this.selection.textSelection)
        {
            f.apply(this.selection.textSelection.getDocContent(), args);
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.textSelection)
                f.apply(this.selection.groupSelection.textSelection.getDocContent(), args);
            else if(this.selection.groupSelection.chartSelection)
            {/*todo*/}
            else
                applyToArrayDrawings(this.selection.groupSelection.selectedObjects);
        }
        else if(this.selection.chartSelection)
        {/*todo*/}
        else
        {
            applyToArrayDrawings(this.selectedObjects);
        }
    },

    setParagraphSpacing: function(Spacing)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphSpacing, [Spacing]);
    },

    setParagraphTabs: function(Tabs)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphTabs(Tabs);
        }
    },

    setParagraphNumbering: function(NumInfo)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphNumbering, [NumInfo]);
    },

    setParagraphShd: function(Shd)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphShd, [Shd]);
    },


    setParagraphStyle: function(Style)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphStyle, [Style]);
    },


    setParagraphContextualSpacing: function(Value)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphContextualSpacing, [Value]);
    },

    setParagraphPageBreakBefore: function(Value)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_PageBreakBefore(Value);
        }
    },
    setParagraphKeepLines: function(Value)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphKeepLines(Value);
        }
    },

    setParagraphKeepNext: function(Value)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphKeepNext(Value);
        }
    },


    setParagraphWidowControl: function(Value)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphWidowControl(Value);
        }
    },

    setParagraphBorders: function(Value)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphBorders(Value);
        }
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else
        {
            var i;
            if(paraItem.Type === para_TextPr)
            {
                this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_Add, [paraItem, bRecalculate]);
            }
            else if(this.selectedObjects.length === 1
                && this.selectedObjects[0].getObjectType() === historyitem_type_Shape
                &&  !CheckLinePreset(this.selectedObjects[0].getPresetGeom()))
            {
                this.selection.textSelection = this.selectedObjects[0];
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
            }
            else if(this.selectedObjects.length > 0)
            {
                this.selectedObjects[0].parent.GoTo_Text();
                this.resetSelection();
            }
        }
        this.document.Recalculate();
    },

    paragraphIncDecFontSize: function(bIncrease)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecFontSize, [bIncrease]);
    },

    paragraphIncDecIndent: function(bIncrease)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecIndent, [bIncrease]);
    },

    setParagraphAlign: function(align)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphAlign, [align]);
    },

    setParagraphIndent: function(indent)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_ParagraphIndent(indent);
        }
        else
        {
            if(this.selectedObjects.length ===1)
            {
                content = this.selectedObjects[0].getDocContent ? this.selectedObjects[0].getDocContent() : null;
                if(content)
                {
                    content.Set_ApplyToAll(true);
                    content.Set_ParagraphIndent(indent);
                    content.Set_ApplyToAll(false);
                }
                else
                {
                    this.selectedObjects[0].parent.Get_ParentParagraph().Set_Ind(indent, true)
                }
            }
        }
    },


    CheckRange: function(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, PageNum, HdrFtrRanges, docContent)
    {
        if(isRealObject(this.graphicPages[PageNum]))
        {
            var Ranges = this.graphicPages[PageNum].CheckRange(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, HdrFtrRanges, docContent);

            var ResultRanges = new Array();

            // Уберем лишние отрезки
            var Count = Ranges.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Range = Ranges[Index];

                if ( Range.X1 > X0 && Range.X0 < X1 )
                {
                    Range.X0 = Math.max( X0, Range.X0 );
                    Range.X1 = Math.min( X1, Range.X1 );

                    ResultRanges.push( Range );
                }
            }

            return ResultRanges;
        }
        return HdrFtrRanges;
    },

    getTableProps: function()
    {
        var content = this.getTargetDocContent();
        if(content)
            return content.Interface_Update_TablePr( true );
        return null;
    },

    startAddShape: function(preset)
    {
        /*todo*/
        switch(preset)
        {
            case "spline":
            {
                this.changeCurrentState(new SplineBezierState(this));
                break;
            }
            case "polyline1":
            {
                this.changeCurrentState(new PolyLineAddState(this));
                break;
            }
            case "polyline2":
            {
                this.changeCurrentState(new AddPolyLine2State(this));
                break;
            }
            case "lineWithArrow":
            {
                this.currentPresetGeom = "line";
                this.changeCurrentState(new StartAddNewArrow(this, false, true));
                break;
            }
            case "lineWithTwoArrows":
            {
                this.currentPresetGeom = "line";
                this.changeCurrentState(new StartAddNewArrow(this, true, true));
                break;
            }

            case "bentConnector5WithArrow":
            {
                this.currentPresetGeom = "bentConnector5";
                this.changeCurrentState(new StartAddNewArrow(this, false, true));
                break;
            }

            case "bentConnector5WithTwoArrows":
            {
                this.currentPresetGeom = "bentConnector5";
                this.changeCurrentState(new StartAddNewArrow(this, true, true));
                break;
            }

            case "curvedConnector3WithArrow":
            {
                this.currentPresetGeom = "curvedConnector3";
                this.changeCurrentState(new StartAddNewArrow(this, false, true));
                break;
            }

            case "curvedConnector3WithTwoArrows":
            {
                this.currentPresetGeom = "curvedConnector3";
                this.changeCurrentState(new StartAddNewArrow(this, true, true));
                break;
            }
            default :
            {
                this.currentPresetGeom = preset;
                this.changeCurrentState(new StartAddNewShape(this, preset));
                break;
            }
        }
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ChangeColorScheme:
            {
                this.document.theme.themeElements.clrScheme = data.oldScheme;
                this.drawingDocument.CheckGuiControlColors();
                break;
            }
            case historyitem_GraphicObjectsAddHeaderOrFooter:
            {
                this.headerFooter.header.first = data.oldPr.Header.First;
                this.headerFooter.header.even = data.oldPr.Header.Even;
                this.headerFooter.header.odd = data.oldPr.Header.Odd;
                this.headerFooter.footer.first = data.oldPr.Footer.First;
                this.headerFooter.footer.even = data.oldPr.Footer.Even;
                this.headerFooter.footer.odd = data.oldPr.Footer.Odd;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ChangeColorScheme:
            {
                this.document.theme.themeElements.clrScheme = data.newScheme;
                this.drawingDocument.CheckGuiControlColors();
                break;
            }
            case historyitem_GraphicObjectsAddHeaderOrFooter:
            {
                this.headerFooter.header.first = data.newPr.Header.First;
                this.headerFooter.header.even = data.newPr.Header.Even;
                this.headerFooter.header.odd = data.newPr.Header.Odd;
                this.headerFooter.footer.first = data.newPr.Footer.First;
                this.headerFooter.footer.even = data.newPr.Footer.Even;
                this.headerFooter.footer.odd = data.newPr.Footer.Odd;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(historyitem_type_GrObjects);
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ChangeColorScheme:
            {
                data.newScheme.Write_ToBinary2(w);
                break;
            }
            case historyitem_GraphicObjectsAddHeaderOrFooter:
            {
                writeObject(w, data.newPr.Header.First);
                writeObject(w, data.newPr.Header.Even);
                writeObject(w, data.newPr.Header.Odd);
                writeObject(w, data.newPr.Footer.First);
                writeObject(w, data.newPr.Footer.Even);
                writeObject(w, data.newPr.Footer.Odd);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var class_type = r.GetLong();
        if(class_type != historyitem_type_GrObjects)
            return;
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ChangeColorScheme:
            {
                var clr_scheme = new ClrScheme();
                clr_scheme.Read_FromBinary2(r);
                this.document.theme.themeElements.clrScheme =clr_scheme;
                this.drawingDocument.CheckGuiControlColors();
                break;
            }
            case historyitem_GraphicObjectsAddHeaderOrFooter:
            {
                this.headerFooter.header.first = readObject(r);
                this.headerFooter.header.even  = readObject(r);
                this.headerFooter.header.odd   = readObject(r);
                this.headerFooter.footer.first = readObject(r);
                this.headerFooter.footer.even  = readObject(r);
                this.headerFooter.footer.odd   = readObject(r);
                break;
            }
        }
    },

    Refresh_RecalcData: function(data)
    {}
};


function ComparisonByZIndexSimpleParent(obj1, obj2)
{
    return obj1.parent.RelativeHeight - obj2.parent.RelativeHeight;
}

function ComparisonByZIndexSimple(obj1, obj2)
{
    return obj1.RelativeHeight - obj2.RelativeHeight;
}

function ComparisonByZIndex(obj1, obj2)
{
    var array_type1 = obj1.getDrawingArrayType();
    var array_type2 = obj2.getDrawingArrayType();
    if(array_type1 === array_type2)
        return ComparisonByZIndexSimple(obj1, obj2);
    else
        return array_type1 - array_type2;
}

function HeaderFooterGraphicObjects()
{
    this.behindDocArray = [];
    this.wrappingArray = [];
    this.inlineArray = [];
    this.beforeTextArray = [];
    this.floatTables = [];

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add( this, this.Id );
}

HeaderFooterGraphicObjects.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    addHeader: function()
    {
        this.bHeader = true;
        History.Add(this, {Type:historyitem_AddHdr});
    },


    addFooter: function()
    {
        this.bFooter = true;
        History.Add(this, {Type:historyitem_AddFtr});
    },

    removeHeader: function()
    {
        this.bHeader = false;
        History.Add(this, {Type:historyitem_RemoveHdr});
    },


    removeFooter: function()
    {
        this.bFooter = false;
        History.Add(this, {Type:historyitem_RemoveFtr});
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_HdrFtrGrObjects);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
        g_oTableId.Add( this, this.Id );
    },

    Refresh_RecalcData: function()
    {},

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_AddHdr:
            {
                this.bHeader = false;
                break;
            }

            case historyitem_AddFtr:
            {
                this.bFooter = false;
                break;
            }

            case historyitem_RemoveHdr:
            {
                this.bHeader = true;
                break;
            }

            case historyitem_RemoveFtr:
            {
                this.bFooter = true;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_AddHdr:
            {
                this.bHeader = true;
                break;
            }

            case historyitem_AddFtr:
            {
                this.bFooter = true;
                break;
            }

            case historyitem_RemoveHdr:
            {
                this.bHeader = false;
                break;
            }

            case historyitem_RemoveFtr:
            {
                this.bFooter = false;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(historyitem_type_HdrFtrGrObjects);
        w.WriteLong(data.Type);
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() !== historyitem_type_HdrFtrGrObjects)
            return;
        switch(r.GetLong())
        {
            case historyitem_AddHdr:
            {
                this.bHeader = true;
                break;
            }

            case historyitem_AddFtr:
            {
                this.bFooter = true;
                break;
            }

            case historyitem_RemoveHdr:
            {
                this.bHeader = false;
                break;
            }

            case historyitem_RemoveFtr:
            {
                this.bFooter = false;
                break;
            }
        }
    }



};

function CreateImageFromBinary(bin, nW, nH)
{
    var w, h;

    if (nW === undefined || nH === undefined)
    {
        var _image = editor.ImageLoader.map_image_index[bin];
        if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete)
        {
            var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
            var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));

            var bIsCorrect = false;
            if (_image.Image != null)
            {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);

                var dKoef = Math.max(__w / _w, __h / _h);
                if (dKoef > 1)
                {
                    _w = Math.max(5, __w / dKoef);
                    _h = Math.max(5, __h / dKoef);

                    bIsCorrect = true;
                }
                else
                {
                    _w = __w;
                    _h = __h;
                }
            }

            w = __w;
            h = __h;
        }
        else
        {
            w = 50;
            h = 50;
        }
    }
    else
    {
        w = nW;
        h = nH;
    }
    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = new WordImage(para_drawing,  editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
    word_image.init(bin, w, h, null, null);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}

function CreateImageFromBinary2(bin, w, h)
{

    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = new WordImage(para_drawing,  editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
    word_image.init(bin, w, h, null, null);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}

function CreateParaDrawingFromBinary(reader, bNoRecalc)
{
    var para_drawing = new ParaDrawing(null, null, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    para_drawing.readFromBinaryForCopyPaste(reader, bNoRecalc);
    return para_drawing;
}

function CompareGroups(a, b)
{
    if(a.group == null && b.group == null)
        return 0;
    if(a.group == null)
        return 1;
    if(b.group == null)
        return -1;

    var count1 = 0;
    var cur_group = a.group;
    while(cur_group != null)
    {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while(cur_group != null)
    {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}

function ZIndexManager(drawingObjects)
{
    this.drawingObjects = drawingObjects;
    this.Content = [];//индекс ParaDrawing в этом массиве равен z-индексу элемента
    this.m_oContentChanges = new CContentChanges();
    this.bTurnOff = true;
    this.startRefreshIndex = -1;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

ZIndexManager.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    addToRecalculate: function()
    {
        this.drawingObjects.addToRecalculate(this);
    },

    removeItem: function(pos)
    {
        History.Add(this, {Type: historyitem_ZIndexManagerRemoveItem, Pos: pos, Item: this.Content[pos]});
        return this.Content.splice(pos, 1)[0];
    },

    addItem: function(pos, item)
    {
        if(this.bTurnOff)
            return;
        if(!isRealNumber(pos))
            pos = this.Content.length;
        History.Add(this, {Type: historyitem_ZIndexManagerAddItem, Pos: pos, Item: item});
        this.Content.splice(pos, 0, item);

        if(this.startRefreshIndex < 0 || this.startRefreshIndex > pos)
            this.startRefreshIndex = pos;
    },

    recalculate: function()
    {
        if(this.startRefreshIndex > -1)
        {
            for(var i = this.startRefreshIndex; i < this.Content.length; ++i)
            {
                this.Content[i].RelativeHeight = i;
            }
            this.startRefreshIndex = -1;
        }
        this.drawingObjects.sortDrawingArrays();
    },

    bringToFront: function(arrInd)//
    {
        arrInd.sort(function(a, b){return a-b});
        var arrDrawings = [];
        var i;
        for(i = arrInd.length-1; i > -1; --i)
        {
            arrDrawings.push(this.removeItem(arrInd[i]));
        }
        for(i = arrDrawings.length-1; i > -1; --i)
        {
            this.addItem(null, arrDrawings[i]);
        }
    },

    bringForward: function(arrInd)
    {
        arrInd.sort(function(a, b){return a - b;});
        var i;
        var item;
        if(arrInd[arrInd.length-1] < this.Content.length-1)
        {
            item = this.removeItem(arrInd[arrInd.length-1]);
            this.addItem(++arrInd[arrInd.length-1], item);
        }
        for(i = arrInd.length-2; i > -1; --i)
        {
            if((arrInd[i+1] - arrInd[i]) > 1  )
            {
                item = this.removeItem(arrInd[i]);
                this.addItem(++arrInd[i], item);
            }
        }
    },

    sendToBack: function(arrInd)
    {
        arrInd.sort(function(a, b){return a-b});
        var i;
        var arrDrawings = [];
        for(i = arrInd.length-1; i > -1; --i)
        {
            arrDrawings.push(this.removeItem(arrInd[i]));
        }
        arrDrawings.reverse();
        for(i = 0; i < arrDrawings.length; ++i)
        {
            this.addItem(i, arrDrawings[i]);
        }
    },

    bringBackward: function(arrInd)
    {
        arrInd.sort(function(a, b){return a - b});
        var i, item;
        if(arrInd[0] > 0)
        {
            item = this.removeItem(arrInd[0]);
            this.addItem(--arrInd[0]);
        }
        for(i = 1; i < arrInd.length; ++i)
        {
            if(arrInd[i] - arrInd[i-1] > 1)
            {
                item = this.removeItem(arrInd[i]);
                this.addItem(--arrInd[i], item);
            }
        }
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ZIndexManagerRemoveItem:
            {
                this.Content.splice(data.Pos, 0, data.Item);
                break;
            }
            case historyitem_ZIndexManagerAddItem:
            {
                this.Content.splice(data.Pos, 1);
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ZIndexManagerRemoveItem:
            {
                this.Content.splice(data.Pos, 1);
                break;
            }
            case historyitem_ZIndexManagerAddItem:
            {
                this.Content.splice(data.Pos, 0, data.Item);
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        var Pos;
        switch(data.Type)
        {
            case historyitem_ZIndexManagerRemoveItem:
            {
                Pos = data.UseArray ? data.PosArray[0] : data.Pos;
                w.WriteLong(Pos);
                break;
            }
            case historyitem_ZIndexManagerAddItem:
            {
                Pos = data.UseArray ? data.PosArray[0] : data.Pos;
                w.WriteLong(Pos);
                w.WriteString2(data.Item.Get_Id());
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        var Pos;
        switch(type)
        {
            case historyitem_ZIndexManagerRemoveItem:
            {
                Pos = r.GetLong();
                this.Content.splice(Pos, 1);
                break;
            }
            case historyitem_ZIndexManagerAddItem:
            {
                Pos = r.GetLong();
                var Id = r.GetString2();
                this.Content.splice(Pos, 0, g_oTableId.Get_ById(Id));
                break;
            }
        }
    },

    Refresh_RecalcData: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ZIndexManagerRemoveItem:
            case historyitem_ZIndexManagerAddItem:
            {
                if(this.startRefreshIndex < 0)
                    this.startRefreshIndex = data.Pos;
                else if(this.startRefreshIndex > data.Pos)
                {
                    this.startRefreshIndex = data.Pos;
                }
                break;
            }
        }
        this.Refresh_RecalcData2();
    },

    Refresh_RecalcData2: function()
    {
        this.drawingObjects.addToRecalculate(this);
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    }
};