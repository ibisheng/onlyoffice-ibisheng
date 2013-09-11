
var CLASS_TYPE_CHART_DATA = 9999;
function CChartAsGroup(parent/*(WordGraphicObject)*/, document, drawingDocument, group)
{
    this.parent = parent;
    this.document = document;
    this.group = isRealObject(group) ? group : null;

    this.chartTitle = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;

    this.chart = new asc_CChart();

    this.brush = new CBlipFill();
    this.spPr = new CSpPr();



    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.x = 0;
    this.y = 0;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;

    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);

    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();

    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.group = null;
    this.pageIndex = -1;

    this.selectedObjects =
        [];
    this.selected = false;
    this.mainGroup = null;
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    this.bFirstRecalc = true;
}


CChartAsGroup.prototype =
{
    asc_getChart: function()
    {
        return this.chart;
    },

    calculateAfterChangeTheme: function()
    {
        this.recalculate();
    },

    calculateAfterOpen10: function()
    {
        this.init();
        this.recalculate();
        this.recalculateTransform();
    },

    getArrayWrapPolygons: function()
    {
        if(this.spPr.geometry)
            return this.spPr.geometry.getArrayPolygons();

        return [];
    },

    getOwnTransform: function()
    {
        return this.transform;
    },


    getObjectType: function()
    {
        return CLASS_TYPE_CHART_AS_GROUP;
    },


    getParentObjects: function()
    {
        var parents = {slide: null, layout: null, master: null, theme: null};
        switch (this.parent.kind)
        {
            case SLIDE_KIND:
            {
                parents.slide = this.parent;
                parents.layout = this.parent.Layout;
                parents.master = this.parent.Layout.Master;
                parents.theme = this.parent.Layout.Master.Theme;
                parents.presentation = this.parent.Layout.Master.presentation;
                break;
            }
            case LAYOUT_KIND:
            {
                parents.layout = this.parent;
                parents.master = this.parent.Master;
                parents.theme = this.parent.Master.Theme;
                parents.presentation = this.parent.Master.presentation;
                break;
            }
            case MASTER_KIND:
            {
                parents.master = this.parent;
                parents.theme = this.parent.Theme;
                parents.presentation = this.parent.presentation;
                break;
            }
        }
        return parents;
    },

    setPageIndex: function(pageIndex)
    {
        this.pageIndex = pageIndex;
        if(isRealObject(this.chartTitle))
            this.chartTitle.pageIndex = pageIndex;
        if(isRealObject(this.hAxisTitle))
            this.hAxisTitle.pageIndex = pageIndex;
        if(isRealObject(this.vAxisTitle))
            this.vAxisTitle.pageIndex = pageIndex;
    },

    Get_Id: function()
    {
        return this.Id;
    },


    setDiagram: function(chart)
    {
        this.chart = chart;
        this.recalculate();
    },

    OnContentReDraw: function()
    {
        if(isRealObject(this.parent))
        {
            this.parent.OnContentReDraw();
        }
    },

    setSizes: function(posX, posY, w, h, flipH, flipV)
    {
        var data = {};
        data.Type = historyitem_SetSizes;
        data.oldW = this.extX;
        data.oldH = this.extY;
        data.newW = w;
        data.newH = h;
        data.oldFlipH = this.absFlipH;
        data.oldFlipV = this.absFlipV;
        data.newFlipH = flipH;
        data.newFlipV = flipV;
        data.oldPosX = this.x;
        data.oldPosY = this.y;
        data.newPosX = posX;
        data.newPosY = posY;

        History.Add(this, data);

        this.spPr.xfrm.extX = w;
        this.spPr.xfrm.extY = h;
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.extX = w;
        this.extY = h;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        this.x = posX;
        this.y = posY;
        if(this.parent)
        {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
            this.parent.flipH = flipH;
            this.parent.flipV = flipV;
        }
        this.calculateAfterResize();
    },

    calculateAfterResize: function()
    {
        if(isRealObject(this.parent))
        {
            this.parent.bNeedUpdateWH = true;
        }
        this.recalculate();
    },


    setDrawingObjects: function(drawingObjects)
    {
        var newValue = isRealObject(drawingObjects) ? drawingObjects.getWorksheet().model.getId() : null;
        var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.drawingObjects = drawingObjects;

    },

    getBoundsInGroup: function()
    {

        return {minX: this.x, minY: this.y, maxX: this.x + this.extX, maxY: this.y + this.extY};
        var r = this.rot;
        if((r >= 0 && r < Math.PI*0.25)
            || (r > 3*Math.PI*0.25 && r < 5*Math.PI*0.25)
            || (r > 7*Math.PI*0.25 && r < 2*Math.PI))
        {
        }
        else
        {
            var hc = this.extX*0.5;
            var vc = this.extY*0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return {minX: xc - vc, minY: yc - hc, maxX: xc + vc, maxY: yc + hc};
        }
    },

    hit: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var tx = invert_transform.TransformPointX(x, y);
        var ty = invert_transform.TransformPointY(x, y);
        return tx >=0 && tx <= this.extX && ty >=0 && ty <= this.extY;
    },

    hitInTextRect: function()
    {
        return false;
    },

    setGroup: function(group)
    {
        var oldId = isRealObject(this.group) ? this.group.Get_Id() : null;
        var newId = isRealObject(group) ? group.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetGroup, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.group = group;
    },


    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea(editor.WordControl.m_oDrawingDocument.CanvasHitContext, x_t, y_t);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(editor.WordControl.m_oDrawingDocument.CanvasHitContext, x_t, y_t);
        return false;
    },

    recalculateColors: function()
    {
        this.recalculate();
    },

    isChart: function()
    {
        return true;
    },

    isShape: function()
    {
        return false;
    },

    isImage: function()
    {
        return false;
    },

    isGroup: function()
    {
        return false;
    },

    Get_Props: function(OtherProps)
    {
        var Props = new Object();
        Props.Width  = this.extX;
        Props.Height = this.extY;

        if(!isRealObject(OtherProps))
            return Props;


        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;

        return OtherProps;
    },

    syncAscChart: function() {

        if ( this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content ) {
            this.chart.asc_getHeader().asc_setTitle(this.chartTitle.txBody.content.getTextString());
        }
        if ( this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content ) {
            this.chart.asc_getYAxis().asc_setTitle(this.vAxisTitle.txBody.content.getTextString());
        }
        if ( this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content ) {
            this.chart.asc_getXAxis().asc_setTitle(this.hAxisTitle.txBody.content.getTextString());
        }
    },

    setDrawingObjects: function(drawingObjects)
    {
        this.drawingObjects = drawingObjects;
        if(isRealObject(this.chartTitle))
            this.chartTitle.drawingObjects = drawingObjects;
        if(isRealObject(this.hAxisTitle))
            this.hAxisTitle.drawingObjects = drawingObjects;
        if(isRealObject(this.vAxisTitle))
            this.vAxisTitle.drawingObjects = drawingObjects;
    },

    addToDrawingObjects: function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataClosePath()), null);
        this.select(this.drawingObjects.controller);
        this.drawingObjects.addGraphicObject(this);
    },


    getTransform: function()
    {
        return this.transform;
    },

    recalculatePosExt: function()
    {
        if(!isRealObject(this.group))
        {
            if(this.spPr.xfrm.isNotNull())
            {
                var xfrm = this.spPr.xfrm;
                this.x = xfrm.offX;
                this.y = xfrm.offY;
                this.extX = xfrm.extX;
                this.extY = xfrm.extY;
                this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                this.flipH = xfrm.flipH === true;
                this.flipV = xfrm.flipV === true;
            }
            else
            {
                if(this.isPlaceholder())
                {
                    var hierarchy = this.getHierarchy();
                    for(var i = 0; i < hierarchy.length; ++i)
                    {
                        var hierarchy_sp = hierarchy[i];
                        if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                        {
                            var xfrm = hierarchy_sp.spPr.xfrm;
                            this.x = xfrm.offX;
                            this.y = xfrm.offY;
                            this.extX = xfrm.extX;
                            this.extY = xfrm.extY;
                            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                            this.flipH = xfrm.flipH === true;
                            this.flipV = xfrm.flipV === true;
                            break;
                        }
                    }
                    if(i === hierarchy.length)
                    {
                        this.x = 0;
                        this.y = 0;
                        this.extX = 5;
                        this.extY = 5;
                        this.rot = 0;
                        this.flipH = false;
                        this.flipV = false;
                    }
                }
                else
                {
                    this.x = 0;
                    this.y = 0;
                    this.extX = 5;
                    this.extY = 5;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
        }
        else
        {
            var xfrm;
            if(this.spPr.xfrm.isNotNull())
            {
                xfrm = this.spPr.xfrm;
            }
            else
            {
                if(this.isPlaceholder())
                {
                    var hierarchy = this.getHierarchy();
                    for(var i = 0; i < hierarchy.length; ++i)
                    {
                        var hierarchy_sp = hierarchy[i];
                        if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                        {
                            xfrm = hierarchy_sp.spPr.xfrm;
                            break;
                        }
                    }
                    if(i === hierarchy.length)
                    {
                        xfrm = new CXfrm();
                        xfrm.offX = 0;
                        xfrm.offX = 0;
                        xfrm.extX = 5;
                        xfrm.extY = 5;
                    }
                }
                else
                {
                    xfrm = new CXfrm();
                    xfrm.offX = 0;
                    xfrm.offY = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.transform.Reset();
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
    },

    recalculateTransform: function()
    {
        this.recalculatePosExt();
        this.recalculateMatrix();
    },

    getTransformMatrix: function()
    {
        return this.transform;
    },



    recalculateMatrix: function()
    {

        this.transform.Reset();
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransformMatrix());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);

        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.recalculateTransform();
            this.chartTitle.calculateTransformTextMatrix();
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.recalculateTransform();
            this.hAxisTitle.calculateTransformTextMatrix();
        }

        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.recalculateTransform();
            this.vAxisTitle.calculateTransformTextMatrix();
        }
    },



    setXfrmObject: function(xfrm)
    {
        var oldId = isRealObject(this.spPr.xfrm) ? this.spPr.xfrm.Get_Id() : null;
        var newId = isRealObject(xfrm) ? xfrm.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.spPr.xfrm = xfrm;
    },

    /* init: function()
     {
     var is_on = History.Is_On();
     if(is_on)
     History.TurnOff();
     if(isRealObject(this.chartTitle))
     {
     this.chartTitle.setType(CHART_TITLE_TYPE_TITLE);
     if(this.chartTitle.isEmpty())
     {
     var title_str = "Chart Title";
     this.chartTitle.setTextBody(new CTextBody(this.chartTitle));
     for(var i in title_str)
     this.chartTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);

     }
     else
     {
     var content = this.chartTitle.txBody.content;
     content.Parent = this.chartTitle.txBody;
     content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
     for(var i = 0; i < content.Content.length; ++i)
     {
     content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
     content.Content[i].Parent = content;
     }
     }
     var content2 =  this.chartTitle.txBody.content.Content;
     for(var i = 0; i < content2.length; ++i)
     {
     content2[i].Pr.PStyle = 3;
     }
     //  this.chart.header.title = this.chartTitle.txBody.content.getTextString();
     }

     if(isRealObject(this.hAxisTitle))
     {
     this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);
     this.hAxisTitle.drawingObjects = this.drawingObjects;
     if(this.hAxisTitle.isEmpty())
     {
     var title_str = "X Axis";
     this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
     for(var i in title_str)
     this.hAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);
     }
     else
     {
     var content = this.hAxisTitle.txBody.content;
     content.Parent = this.hAxisTitle.txBody;
     content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
     for(var i = 0; i < content.Content.length; ++i)
     {
     content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
     content.Content[i].Parent = content;
     }
     }
     var content2 =  this.hAxisTitle.txBody.content.Content;
     for(var i = 0; i < content2.length; ++i)
     {
     content2[i].Pr.PStyle = 3;
     }

     //  this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();
     }

     if(isRealObject(this.vAxisTitle))
     {
     this.chart.xAxis.title = "";
     this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);
     this.vAxisTitle.drawingObjects = this.drawingObjects;
     if(this.vAxisTitle.isEmpty())
     {
     var title_str = "Y Axis";
     this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
     this.vAxisTitle.txBody.bodyPr.vert = (nVertTTvert270);

     for(var i in title_str)
     this.vAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);

     this.vAxisTitle.txBody.content.Set_ApplyToAll(true);
     this.vAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
     this.vAxisTitle.txBody.content.Set_ApplyToAll(false);
     }
     else
     {
     this.vAxisTitle.txBody.bodyPr.vert = (nVertTTvert270);

     var content = this.vAxisTitle.txBody.content;
     content.Parent = this.vAxisTitle.txBody;
     content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
     for(var i = 0; i < content.Content.length; ++i)
     {
     content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
     content.Content[i].Parent = content;
     }
     content.Set_ApplyToAll(true);
     content.Set_ParagraphAlign(align_Center);
     content.Set_ApplyToAll(false);
     }
     var content2 =  this.vAxisTitle.txBody.content.Content;
     for(var i = 0; i < content2.length; ++i)
     {
     content2[i].Pr.PStyle = 3;
     }
     //  this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
     }

     if(is_on)
     History.TurnOn();
     //this.recalculate();
     },   */

    calculateAfterOpen: function()
    {
        this.init();
    },


    setChart: function(chart, bEdit)
    {
        if ( bEdit ) {

            History.Create_NewPoint();

            // type, subType, styleId
            if ( this.chart.type != chart.type ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_Type, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.type, chart.type)));
                this.chart.type = chart.type;
            }

            if ( this.chart.subType != chart.subType ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_SubType, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.subType, chart.subType)));
                this.chart.subType = chart.subType;
            }

            if ( this.chart.styleId != chart.styleId ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_Style, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.styleId, chart.styleId)));
                this.chart.styleId = chart.styleId;
            }

            // showValue, showBorder
            if ( this.chart.bShowValue != chart.bShowValue ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsShowValue, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.bShowValue, chart.bShowValue)));
                this.chart.bShowValue = chart.bShowValue;
            }

            if ( this.chart.bShowBorder != chart.bShowBorder ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsShowBorder, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.bShowBorder, chart.bShowBorder)));
                this.chart.bShowBorder = chart.bShowBorder;
            }

            // range
            if ( this.chart.range.interval != chart.range.interval ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_RangeInterval, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.range.interval, chart.range.interval)));
                this.chart.range.interval = chart.range.interval;
                this.chart.range.intervalObject = convertFormula(this.chart.range.interval, this.drawingObjects.getWorksheet());
                this.chart.rebuildSeries();
            }

            if ( this.chart.range.rows != chart.range.rows ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_RangeRowColumns, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.range.rows, chart.range.rows)));
                this.chart.range.rows = chart.range.rows;
                this.chart.range.columns = !chart.range.rows;
            }

            // header
            if ( this.chart.header.title != chart.header.title ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_HeaderTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.title, chart.header.title)));
                this.chart.header.title = chart.header.title;
            }

            if ( this.chart.header.subTitle != chart.header.subTitle ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_HeaderSubTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.subTitle, chart.header.subTitle)));
                this.chart.header.subTitle = chart.header.subTitle;
            }

            if ( this.chart.header.bDefaultTitle != chart.header.bDefaultTitle ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsDefaultHeaderTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.bDefaultTitle, chart.header.bDefaultTitle)));
                this.chart.header.bDefaultTitle = chart.header.bDefaultTitle;
            }

            // xAxis
            if ( this.chart.xAxis.title != chart.xAxis.title ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.title, chart.xAxis.title)));
                this.chart.xAxis.title = chart.xAxis.title;
            }

            if ( this.chart.xAxis.bDefaultTitle != chart.xAxis.bDefaultTitle ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsDefaultTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bDefaultTitle, chart.xAxis.bDefaultTitle)));
                this.chart.xAxis.bDefaultTitle = chart.xAxis.bDefaultTitle;
            }

            if ( this.chart.xAxis.bShow != chart.xAxis.bShow ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsShow, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bShow, chart.xAxis.bShow)));
                this.chart.xAxis.bShow = chart.xAxis.bShow;
            }

            if ( this.chart.xAxis.bGrid != chart.xAxis.bGrid ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsGrid, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bGrid, chart.xAxis.bGrid)));
                this.chart.xAxis.bGrid = chart.xAxis.bGrid;
            }

            // yAxis
            if ( this.chart.yAxis.title != chart.yAxis.title ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.title, chart.yAxis.title)));
                this.chart.yAxis.title = chart.yAxis.title;
            }

            if ( this.chart.yAxis.bDefaultTitle != chart.yAxis.bDefaultTitle ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsDefaultTitle, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bDefaultTitle, chart.yAxisbDefaultTitle)));
                this.chart.yAxis.bDefaultTitle = chart.yAxis.bDefaultTitle;
            }

            if ( this.chart.yAxis.bShow != chart.yAxis.bShow ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsShow, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bShow, chart.yAxis.bShow)));
                this.chart.yAxis.bShow = chart.yAxis.bShow;
            }

            if ( this.chart.yAxis.bGrid != chart.yAxis.bGrid ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsGrid, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bGrid, chart.yAxis.bGrid)));
                this.chart.yAxis.bGrid = chart.yAxis.bGrid;
            }

            // legend
            if ( this.chart.legend.position != chart.legend.position ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendPosition, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.position, chart.legend.position)));
                this.chart.legend.position = chart.legend.position;
            }

            if ( this.chart.legend.bShow != chart.legend.bShow ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendIsShow, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.bShow, chart.legend.bShow)));
                this.chart.legend.bShow = chart.legend.bShow;
            }

            if ( this.chart.legend.bOverlay != chart.legend.bOverlay ) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendIsOverlay, null, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.bOverlay, chart.legend.bOverlay)));
                this.chart.legend.bOverlay = chart.legend.bOverlay;
            }
            this.chart.rebuildSeries();
        }
        else
            this.chart = chart;
    },

    deleteDrawingBase: function()
    {
        var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
        if(isRealNumber(position))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
        }
    },




    setChartTitle: function(chartTitle)
    {
        this.chartTitle = chartTitle;
    },

    setXAxisTitle: function(xAxisTitle)
    {
        this.hAxisTitle = xAxisTitle;
    },

    setYAxisTitle: function(yAxisTitle)
    {
        this.vAxisTitle = yAxisTitle;
    },


    draw: function(graphics, pageIndex)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);

        graphics.reset();
        graphics.SetIntegerGrid(true);
        if(this.chartTitle)
            this.chartTitle.draw(graphics, pageIndex);
        if(this.hAxisTitle)
            this.hAxisTitle.draw(graphics, pageIndex);
        if(this.vAxisTitle)
            this.vAxisTitle.draw(graphics, pageIndex);
    },

    check_bounds: function(checker)
    {
        if (this.spPr.geometry)
        {
            this.spPr.geometry.check_bounds(checker);
        }
        else
        {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },

    isSimpleObject: function()
    {
        return false;
    },

    getArrGraphicObjects: function()
    {
        return [];
    },


    select: function(pageIndex)
    {
        this.selected = true;
        if(typeof pageIndex === "number")
            this.selectStartPage = pageIndex;

    },

    deselect: function()
    {
        this.selected = false;
        this.selectStartPage = -1;

        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.deselect();
        }
        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.deselect();
        }

        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.deselect();
        }
    },

    getPageIndex: function()
    {
        return this.pageIndex;
    },


    resetSelection: function()
    {
        if(isRealObject(this.chartTitle))
            this.chartTitle.deselect();
        if(isRealObject(this.hAxisTitle))
            this.hAxisTitle.deselect();
        if(isRealObject(this.vAxisTitle))
            this.vAxisTitle.deselect();
    },

    hitInBoundingRect: function()
    {
        return false;
    },

    hitToAdjustment: function(x, y)
    {
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },

    hitToHandles: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);

        var sqr_x = t_x*t_y, sqr_y = t_y*t_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 0;

        var hc = this.extX*0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 1;

        dist_x = t_x - this.extX;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 2;

        var vc = this.extY*0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 3;

        dist_y = t_y - this.extY;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 4;

        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 5;

        dist_x = t_x;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 6;

        dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 7;

        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

    },

    recalculate: function(updateImage)
    {
        var parents = this.getParentObjects();
        this.recalculatePosExt();
        this.recalculateTransform();
        if(isRealObject(this.chartTitle))
        {
            var max_title_width = this.extX*0.8;
            var title_width = this.chartTitle.txBody.getRectWidth(max_title_width);
            this.chartTitle.extX = title_width;
            this.chartTitle.extY = this.chartTitle.txBody.getRectHeight(this.extY, title_width);
            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            if(isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.x))
            {
                this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                if(this.chartTitle.x + this.chartTitle.extX > this.extX)
                    this.chartTitle.x = this.extX - this.chartTitle.extX;
                if(this.chartTitle.x < 0)
                    this.chartTitle.x = 0;
            }
            else
            {
                this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;
            }

            if(isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.y))
            {
                this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                if(this.chartTitle.y + this.chartTitle.extY > this.extY)
                    this.chartTitle.y = this.extY - this.chartTitle.extY;
                if(this.chartTitle.y < 0)
                    this.chartTitle.y = 0;
            }
            else
            {
                this.chartTitle.y = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7);
            }

            this.chartTitle.recalculateTransform();
            this.chartTitle.calculateContent();
            this.chartTitle.calculateTransformTextMatrix();
        }

        if(isRealObject(this.hAxisTitle))
        {
            var max_title_widh = this.extX*0.8;
            var title_width = this.hAxisTitle.txBody.getRectWidth(max_title_width);
            this.hAxisTitle.extX = title_width;
            this.hAxisTitle.extY = this.hAxisTitle.txBody.getRectHeight(this.extY, title_width);
            this.hAxisTitle.spPr.geometry.Recalculate(this.hAxisTitle.extX, this.hAxisTitle.extY);
        }

        if(isRealObject(this.vAxisTitle))
        {
            var max_title_height = this.extY*0.8;
            var body_pr = this.vAxisTitle.txBody.getBodyPr();
            this.vAxisTitle.extY = this.vAxisTitle.txBody.getRectWidth(max_title_height) - body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns;
            this.vAxisTitle.extX = this.vAxisTitle.txBody.getRectHeight(this.extX, this.vAxisTitle.extY) - (- body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns);
            this.vAxisTitle.spPr.geometry.Recalculate(this.vAxisTitle.extX, this.vAxisTitle.extY);

        }
        var lInd, tInd, rInd, bInd;
        tInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.chartTitle) ? this.chartTitle.extY : 0);
        lInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.vAxisTitle) ? this.vAxisTitle.extX : 0);
        rInd = 0;
        bInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.hAxisTitle) ? this.hAxisTitle.extY : 0);
        if(isRealObject(this.vAxisTitle))
        {
            if(isRealObject(this.vAxisTitle.layout) && isRealNumber(this.vAxisTitle.layout.x))
            {
                this.vAxisTitle.x = this.extX*this.vAxisTitle.layout.x;
                if(this.vAxisTitle.x + this.vAxisTitle.extX > this.extX)
                    this.vAxisTitle.x = this.extX - this.vAxisTitle.extX;
                if(this.vAxisTitle.x < 0)
                    this.vAxisTitle.x = 0;
            }
            else
            {
                this.vAxisTitle.x = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7);
            }

            if(isRealObject(this.vAxisTitle.layout) && isRealNumber(this.vAxisTitle.layout.y))
            {
                this.vAxisTitle.y = this.extY*this.vAxisTitle.layout.y;
                if(this.vAxisTitle.y + this.vAxisTitle.extY > this.extY)
                    this.vAxisTitle.y = this.extY - this.vAxisTitle.extY;
                if(this.vAxisTitle.y < 0)
                    this.vAxisTitle.y = 0;
            }
            else
            {
                this.vAxisTitle.y = (this.extY - this.vAxisTitle.extY)*0.5;
                if(this.vAxisTitle.y < tInd)
                    this.vAxisTitle.y = tInd;
            }
            this.vAxisTitle.recalculateTransform();
            this.vAxisTitle.calculateContent();
            this.vAxisTitle.calculateTransformTextMatrix();
        }
        if(isRealObject(this.hAxisTitle))
        {

            if(isRealObject(this.hAxisTitle.layout) && isRealNumber(this.hAxisTitle.layout.x))
            {
                this.hAxisTitle.x = this.extX*this.hAxisTitle.layout.x;
                if(this.hAxisTitle.x + this.hAxisTitle.extX > this.extX)
                    this.hAxisTitle.x = this.extX - this.hAxisTitle.extX;
                if(this.hAxisTitle.x < 0)
                    this.hAxisTitle.x = 0;
            }
            else
            {
                this.hAxisTitle.x = ((this.extX - rInd) - (lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25)) - this.hAxisTitle.extX)*0.5 + lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
                if(this.hAxisTitle.x < lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25))
                    this.hAxisTitle.x = lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
            }

            if(isRealObject(this.hAxisTitle.layout) && isRealNumber(this.hAxisTitle.layout.y))
            {
                this.hAxisTitle.y = this.extY*this.hAxisTitle.layout.y;
                if(this.hAxisTitle.y + this.hAxisTitle.extY > this.extY)
                    this.hAxisTitle.y = this.extY - this.hAxisTitle.extY;
                if(this.hAxisTitle.y < 0)
                    this.hAxisTitle.y = 0;
            }
            else
            {
                this.hAxisTitle.y = this.extY - bInd;
            }
            this.hAxisTitle.recalculateTransform();
            this.hAxisTitle.calculateContent();
            this.hAxisTitle.calculateTransformTextMatrix();
        }

        var title_margin = {w:0, h: 0}, key = {w:0, h: 0}, xAxisTitle = {w:0, h: 0}, yAxisTitle = {w:0, h: 0};
        if(isRealObject(this.chartTitle))
        {
            if(!this.chartTitle.overlay)
            {
                title_margin = {
                    w: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.chartTitle.extX),
                    h: 7+editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.chartTitle.extY)
                }
            }
        }

        if(isRealObject(this.hAxisTitle))
        {
            if(!this.hAxisTitle.overlay)
            {
                xAxisTitle = {
                    w: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.hAxisTitle.extX),
                    h: 7+editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.hAxisTitle.extY)
                }
            }
        }

        if(isRealObject(this.vAxisTitle))
        {
            if(!this.vAxisTitle.overlay)
            {
                yAxisTitle = {
                    w:  7 + editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.vAxisTitle.extX),
                    h: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.vAxisTitle.extY)
                }
            }
        }

        this.chart.margins =
        {
            key: key,

            xAxisTitle: xAxisTitle,

            yAxisTitle: yAxisTitle,
            title: title_margin
        };

        /*if ( !this.chart.range.intervalObject )
         this.drawingObjects.intervalToIntervalObject(this.chart);           */
        if(!(updateImage === false))
        {

            var options = {theme: parents.theme, slide: parents.slide, layout: parents.layout, master: parents.master};
            this.brush.fill.canvas = (new ChartRender(options)).insertChart(this.chart, null, editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.extX), editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.extY), undefined, undefined, options);
            this.brush.fill.RasterImageId = "";
            //editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.brush.fill.RasterImageId);
        }
    },

    getBase64Img: function()
    {
        return this.brush.fill.canvas.toDataURL();
    },

    initFromBinary: function(binary)
    {
        this.setChartBinary(binary);
    },

    chartModify: function(chart)
    {
        this.setChartBinary(chart);
        this.calculateAfterResize();
    },

    init: function()
    {
        var is_on = History.Is_On();
        if(is_on)
            History.TurnOff();
        if(isRealObject(this.parent))
        {
            var xfrm = this.spPr.xfrm;
            xfrm.offX = 0;
            xfrm.offY = 0;
            xfrm.extX = this.parent.Extent.W;
            xfrm.extY = this.parent.Extent.H;
        }

        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.setType(CHART_TITLE_TYPE_TITLE);
            if (this.chartTitle.txBody)
                this.chartTitle.txBody.content.Styles = this.chartTitle.getStyles();
            //this.chartTitle.drawingObjects = this.drawingObjects;
            if(this.chartTitle.isEmpty())
            {
                var title_str = "Chart Title";
                this.chartTitle.setTextBody(new CTextBody(this.chartTitle));

                for(var i in title_str)
                    this.chartTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);
            }
            else
            {
                var content = this.chartTitle.txBody.content;
                content.Parent = this.chartTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                }
            }
            var content = this.chartTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                content.Content[i].Pr.PStyle = this.chartTitle.txBody.content.Styles.Style.length - 1;
            }

            this.chartTitle.txBody.content.Set_ApplyToAll(true);
            this.chartTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.chartTitle.txBody.content.Set_ApplyToAll(false);
            // this.chart.header.title = this.chartTitle.txBody.content.getTextString();TODO
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);

            this.hAxisTitle.txBody.content.Styles = this.hAxisTitle.getStyles();
            //this.hAxisTitle.drawingObjects = this.drawingObjects;
            if(this.hAxisTitle.isEmpty())
            {
                var title_str = "X Axis";
                this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
                for(var i in title_str)
                    this.hAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);
            }
            else
            {
                var content = this.hAxisTitle.txBody.content;
                content.Parent = this.hAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                }
            }


            var content = this.hAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                content.Content[i].Pr.PStyle = this.hAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.hAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.hAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.hAxisTitle.txBody.content.Set_ApplyToAll(false);
            // this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();   TODO
        }

        if(isRealObject(this.vAxisTitle))
        {
            this.chart.xAxis.title = "";
            this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.txBody.content.Styles = this.vAxisTitle.getStyles();

            //  this.vAxisTitle.drawingObjects = this.drawingObjects;
            if(this.vAxisTitle.isEmpty())
            {
                var title_str = "Y Axis";
                this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
                this.vAxisTitle.txBody.bodyPr.vert = (nVertTTvert270);

                for(var i in title_str)
                    this.vAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);
            }
            else
            {
                this.vAxisTitle.txBody.bodyPr.setVert(nVertTTvert270);
                var content = this.vAxisTitle.txBody.content;
                content.Parent = this.vAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                    //content.Content[i].setTextPr(new ParaTextPr());
                }
            }
            var content = this.vAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                content.Content[i].Pr.PStyle = this.vAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.vAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.vAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.vAxisTitle.txBody.content.Set_ApplyToAll(false);
            //this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
        }
        if(is_on)
            History.TurnOn();

        this.recalculate();

    },

    hitToHandle: function(x, y, radius)
    {
        var _radius;
        if(!(typeof radius === "number"))
            _radius = editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        else
        {
            _radius = radius;
        }
        if(typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM))
            _radius *= global_mouseEvent.KoefPixToMM;

        var t_x, t_y;
        if(this.group != null)
        {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        }
        else
        {
            t_x = x;
            t_y = y;
        }
        this.calculateLeftTopPoint();
        var _temp_x = t_x - this.absXLT;
        var _temp_y = t_y - this.absYLT;

        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);


        var _relative_x = _temp_x*_cos + _temp_y*_sin;
        var _relative_y = -_temp_x*_sin + _temp_y*_cos;


        var _dist_x, _dist_y;
        if(!this.checkLine())
        {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 0};
            }

            _dist_x = _relative_x - this.extX;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 2};
            }

            _dist_y = _relative_y - this.extY;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 4};
            }

            _dist_x = _relative_x;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 6};
            }

            if(this.extY >= MIN_SHAPE_DIST)
            {
                var _vertical_center = this.extY*0.5;
                _dist_x = _relative_x;
                _dist_y = _relative_y - _vertical_center;

                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 7};
                }

                _dist_x = _relative_x - this.extX;

                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 3};
                }
            }

            var _horizontal_center = this.extX*0.5;
            if(this.extX >= MIN_SHAPE_DIST)
            {
                _dist_x = _relative_x - _horizontal_center;
                _dist_y = _relative_y;
                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 1};
                }

                _dist_y = _relative_y - this.extY;
                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 5};
                }
            }
        }
        else
        {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 0};
            }

            _dist_x = _relative_x - this.extX;
            _dist_y = _relative_y - this.extY;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 4};
            }
        }

        return {hit: false, handleRotate: false, handleNum: null};
    },

    setAbsoluteTransform: function(offsetX, offsetY, extX, extY, rot, flipH, flipV, open)
    {

        if(offsetX != null)
        {
            this.x = offsetX;
        }

        if(offsetY != null)
        {
            this.y = offsetY;
        }


        if(extX != null)
        {
            this.extX = extX;
        }

        if(extY != null)
        {
            this.extY = extY;
        }


        if(rot != null)
        {
            this.absRot = rot;
        }

        if(flipH != null)
        {
            this.absFlipH = flipH;
        }

        if(flipV != null)
        {
            this.absFlipV = flipV;
        }
        if(this.parent)
            this.parent.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV, true);

        if((extY == null))
        {
            this.recalculatePosExt();
            this.recalculateTransform();
        }
        else
        {
            this.recalculate(true);
        }
    },

    getInvertTransform: function()
    {
        return this.invertTransform;
    },

    drawAdjustments: function()
    {},

    hitInWorkArea: function(x, y)
    {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        return tx > 0 && tx < this.extX && ty > 0 && ty < this.extY;
    },

    canGroup: function()
    {
        return false;
    },

    canRotate: function()
    {
        return false;
    },

    canResize: function()
    {
        return true;//TODO
    },

    canMove: function()
    {
        return true;//TODO
    },

    createMoveTrack: function()
    {
        return new MoveTrackChart(this, true);
    },

    createTrackObjectForResize: function(handleNum, pageIndex)
    {
        return new ResizeTrackShape(this, handleNum, pageIndex, true);
    },

    getPresetGeom: function()
    {
        return "rect";
    },

    createTrackObjectForMove: function(majorOffsetX, majorOffsetY)
    {
        return new MoveTrackShape(this, majorOffsetX, majorOffsetY, true);
    },

    checkLine: function()
    {
        return false;
    },

    calculateTransformMatrix:function(){ this.recalculateTransform();},
    calculateLeftTopPoint: function()
    {
        var _horizontal_center = this.extX*0.5;
        var _vertical_enter = this.extY*0.5;
        var _sin = Math.sin(0);
        var _cos = Math.cos(0);
        this.absXLT = -_horizontal_center*_cos + _vertical_enter*_sin +this.x + _horizontal_center;
        this.absYLT = -_horizontal_center*_sin - _vertical_enter*_cos +this.y + _vertical_enter;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },

    getCardDirectionByNum: function(num)
    {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        return ((num - num_north) + CARD_DIRECTION_N + 8)%8;

    },

    getNumByCardDirection: function(cardDirection)
    {
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = false;
        var full_flip_v = false;
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                north_number = !full_flip_v ? 1 : 5;
                break;
            }
            case y3:
            {
                north_number = !full_flip_h ? 3 : 7;
                break;
            }
            case y5:
            {
                north_number = !full_flip_v ? 5 : 1;
                break;
            }
            default:
            {
                north_number = !full_flip_h ? 7 : 3;
                break;
            }
        }
        return (north_number + cardDirection)%8;
    },

    getResizeCoefficients: function(numHandle, x, y)
    {
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-t_x)/cx, kd2: (cy-t_y)/cy};
            case 1:
                return {kd1: (cy-t_y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-t_y)/cy, kd2: t_x/cx};
            case 3:
                return {kd1: t_x/cx, kd2: 0};
            case 4:
                return {kd1: t_x/cx, kd2: t_y/cy};
            case 5:
                return {kd1: t_y/cy, kd2: 0};
            case 6:
                return {kd1: t_y/cy, kd2:(cx-t_x)/cx};
            case 7:
                return {kd1:(cx-t_x)/cx, kd2: 0};
        }
        return {kd1: 1, kd2: 1};
    },

    getRectBounds: function()
    {
        var transform = this.getTransform();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{x:0, y:0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for(var i = 1; i < 4; ++i)
        {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if(cur_x < min_x)
                min_x = cur_x;
            if(cur_x > max_x)
                max_x = cur_x;

            if(cur_y < min_y)
                min_y = cur_y;
            if(cur_y > max_y)
                max_y = cur_y;
        }
        return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
    },

    setPosition: function(x, y)
    {
        this.spPr.xfrm.setPosition(x, y);
    },

    setExtents: function(extX, extY)
    {
        this.spPr.xfrm.setExtents(extX, extY);
    },

    calculateTransformTextMatrix: function()
    {},

    updateDrawingBaseCoordinates: function()
    {
        if(isRealObject(this.drawingBase))
            this.drawingBase.setGraphicObjectCoords();
    },

    numberToCardDirection: function(handleNumber)
    {
        var y1, y3, y5, y7, hc, vc, numN, x1, x3, x5, x7;

        hc = this.extX*0.5;
        vc = this.extY*0.5;

        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.extX, vc);
        x5 = t_m.TransformPointX(hc, this.extY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.extX, vc);
        y5 = t_m.TransformPointY(hc, this.extY);
        y7 = t_m.TransformPointY(0, vc);

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                numN=1;
                break;
            }
            case y3:
            {
                numN=3;
                break;
            }
            case y5:
            {
                numN=5;
                break;
            }
            case y7:
            {
                numN=7;
                break;
            }
            default:
            {
                numN=1;
            }
        }

        var tmpArr=[];
        if((x5 - x1)*(y3-y7) - (y5-y1)*(x3-x7) >= 0)
        {
            tmpArr[numN] = CARD_DIRECTION_N;
            tmpArr[(numN+1)%8] = CARD_DIRECTION_NE;
            tmpArr[(numN+2)%8] = CARD_DIRECTION_E;
            tmpArr[(numN+3)%8] = CARD_DIRECTION_SE;
            tmpArr[(numN+4)%8] = CARD_DIRECTION_S;
            tmpArr[(numN+5)%8] = CARD_DIRECTION_SW;
            tmpArr[(numN+6)%8] = CARD_DIRECTION_W;
            tmpArr[(numN+7)%8] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        }
        else
        {
            var t;
            tmpArr[numN] = CARD_DIRECTION_N;
            t=numN-1;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_NE;
            t=numN-2;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_E;
            t=numN-3;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_SE;
            t=numN-4;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_S;
            t=numN-5;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_SW;
            t=numN-6;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_W;
            t=numN-7;
            if(t<0) t+=8;
            tmpArr[t] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        }
    },

    cardDirectionToNumber: function(cardDirection)
    {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN, x1, x3, x5, x7;

        hc=this.extX*0.5;
        vc=this.extY*0.5;

        sin=Math.sin(this.absRot);
        cos=Math.cos(this.absRot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.extX, vc);
        x5 = t_m.TransformPointX(hc, this.extY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.extX, vc);
        y5 = t_m.TransformPointY(hc, this.extY);
        y7 = t_m.TransformPointY(0, vc);

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                numN = 1;
                break;
            }
            case y3:
            {
                numN = 3;
                break;
            }
            case y5:
            {
                numN=5;
                break;
            }
            case y7:
            {

                numN = 7;
                break;
            }
            default:
            {
                numN = 1;
            }
        }
        if((x5 - x1)*(y3-y7) - (y5-y1)*(x3-x7) >= 0)
        {
            return (cardDirection + numN) % 8;
        }
        else
        {
            var t = numN - cardDirection;
            if(t<0)
                return t+8;
            else
                return t;
        }
    },



    Save_Changes: function()
    {},

    Load_Changes: function()
    {},

    Refresh_RecalcData: function()
    {},

    Refresh_RecalcData2: function()
    {},

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetSizes:
            {
                this.spPr.xfrm.extX = data.oldW;
                this.spPr.xfrm.extY = data.oldH;
                this.spPr.xfrm.flipH = data.oldFlipH;
                this.spPr.xfrm.flipV = data.oldFlipV;
                this.extX = data.oldW;
                this.extY = data.oldH;
                this.absFlipH = data.oldFlipH;
                this.absFlipV = data.oldFlipV;
                this.x = data.oldPosX;
                this.y = data.oldPosY;
                if(this.parent)
                {
                    this.parent.absOffsetX = data.oldPosX;
                    this.parent.absOffsetY = data.oldPosY;
                    this.parent.absExtX = data.oldW;
                    this.parent.absExtY = data.oldH;
                    this.parent.flipH = data.oldFlipH;
                    this.parent.flipV = data.oldFlipV;
                }

                this.calculateAfterResize();
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetSizes:
            {
                this.spPr.xfrm.extX = data.oldW;
                this.spPr.xfrm.extY = data.oldH;
                this.spPr.xfrm.flipH = data.oldFlipH;
                this.spPr.xfrm.flipV = data.oldFlipV;
                this.extX = data.oldW;
                this.extY = data.oldH;
                this.absFlipH = data.oldFlipH;
                this.absFlipV = data.oldFlipV;
                this.x = data.oldPosX;
                this.y = data.oldPosY;
                if(this.parent)
                {
                    this.parent.absOffsetX = data.oldPosX;
                    this.parent.absOffsetY = data.oldPosY;
                    this.parent.absExtX = data.oldW;
                    this.parent.absExtY = data.oldH;
                    this.parent.flipH = data.oldFlipH;
                    this.parent.flipV = data.oldFlipV;
                }

                this.calculateAfterResize();
                break;
            }
        }
    },

    getChartBinary: function()
    {
        var w = new CMemory();
        w.WriteBool(isRealObject(this.chartTitle));
        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.writeToBinary(w);
        }

        w.WriteBool(isRealObject(this.vAxisTitle));
        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.writeToBinary(w);
        }

        w.WriteBool(isRealObject(this.hAxisTitle));
        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.writeToBinary(w);
        }

        this.chart.Write_ToBinary2(w);
        this.spPr.Write_ToBinary2(w);
        return w.pos + ";" + w.GetBase64Memory();
    },

    writeToBinaryForCopyPaste: function(w)
    {
        w.WriteLong(historyitem_type_ChartGroup);
        w.WriteBool(isRealObject(this.chartTitle));
        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.writeToBinary(w);
        }

        w.WriteBool(isRealObject(this.vAxisTitle));
        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.writeToBinary(w);
        }

        w.WriteBool(isRealObject(this.hAxisTitle));
        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.writeToBinary(w);
        }

        this.chart.Write_ToBinary2(w);
        this.spPr.Write_ToBinary2(w);
    },

    readFromBinaryForCopyPaste: function(r)
    {
        if(r.GetBool())
        {
            this.chartTitle = new CChartTitle(this, CHART_TITLE_TYPE_TITLE);
            this.chartTitle.readFromBinary(r);
        }

        if(r.GetBool())
        {
            this.vAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.readFromBinary(r);
        }
        if(r.GetBool())
        {
            this.hAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            this.hAxisTitle.readFromBinary(r);
        }
        this.chart.Read_FromBinary2(r);
        this.spPr.Read_FromBinary2(r);
        if(isRealObject(this.parent))
        {
            this.parent.Extent.W = this.spPr.xfrm.extX;
            this.parent.Extent.H = this.spPr.xfrm.extY;
        }
        this.init();
    },

    setChartBinary: function(binary)
    {
        // Приводим бинарник к внутренней структуре
        var r = CreateBinaryReader(binary, 0, binary.length);
        if(r.GetBool())
        {
            this.chartTitle = new CChartTitle(this, CHART_TITLE_TYPE_TITLE);
            this.chartTitle.readFromBinary(r);
        }

        if(r.GetBool())
        {
            this.vAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.readFromBinary(r);
        }
        if(r.GetBool())
        {
            this.hAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            this.hAxisTitle.readFromBinary(r);
        }
        this.chart.Read_FromBinary2(r);
        this.spPr.Read_FromBinary2(r);
        if(isRealObject(this.parent))
        {
            this.parent.Extent.W = this.spPr.xfrm.extX;
            this.parent.Extent.H = this.spPr.xfrm.extY;
        }
        this.init();
        this.recalculate();
    },

    copy: function(parent, group)
    {
        var _group = isRealObject(group) ? group : null;
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, _group);
        c.setChartBinary(this.getChartBinary());
        return c;
    },


    setParent: function(paraDrawing)
    {
        var data = {Type: historyitem_SetParent};
        if(isRealObject(this.parent))
        {
            data.oldParent = this.parent.Get_Id();
        }
        else
        {
            data.oldParent = null;
        }

        if(isRealObject(paraDrawing))
        {
            data.newParent = paraDrawing.Get_Id();
        }
        else
        {
            data.newParent = null;
        }
        History.Add(this, data);
        this.parent = paraDrawing;
    },

    Write_ToBinary2: function()
    {},

    Read_FromBinary2: function()
    {}

};

window["Asc"].CChartAsGroup = CChartAsGroup;
window["Asc"]["CChartAsGroup"] = CChartAsGroup;
prot = CChartAsGroup.prototype;

prot["asc_getChart"] = prot.asc_getChart;

var CLASS_TYPE_TABLE_ID = 0;
var CLASS_TYPE_DOCUMENT_CONTENT = 1;
var CLASS_TYPE_SHAPE = 2;
var CLASS_TYPE_IMAGE = 3;
var CLASS_TYPE_GROUP = 4;
var CLASS_TYPE_XFRM = 5;
var CLASS_TYPE_GEOMETRY = 6;
var CLASS_TYPE_PATH = 7;
var CLASS_TYPE_PARAGRAPH = 8;
var CLASS_TYPE_TEXT_BODY = 9;
var CLASS_TYPE_TEXT_PR = 10;
var CLASS_TYPE_UNI_FILL = 11;
var CLASS_TYPE_PATTERN_FILL = 12;
var CLASS_TYPE_GRAD_FILL = 13;
var CLASS_TYPE_SOLID_FILL = 14;
var CLASS_TYPE_UNI_COLOR = 15;
var CLASS_TYPE_SCHEME_COLOR = 16;
var CLASS_TYPE_RGB_COLOR = 17;
var CLASS_TYPE_PRST_COLOR = 18;
var CLASS_TYPE_SYS_COLOR = 19;
var CLASS_TYPE_LINE = 20;
var CLASS_TYPE_CHART_AS_GROUP = 21;
var CLASS_TYPE_CHART_LEGEND = 22;
var CLASS_TYPE_CHART_TITLE = 23;
var CLASS_TYPE_COLOR_MOD = 24;
var CLASS_TYPE_LEGEND_ENTRY = 22;
//var CLASS_TYPE_CHART_DATA = 23;