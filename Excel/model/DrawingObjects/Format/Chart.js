
function CChartAsGroup(drawingBase, drawingObjects)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = drawingObjects;

    this.chartTitle = null;
    this.chartLegend = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;

    this.chart = new asc_CChart();

    this.brush = new CBlipFill();
    this.spPr = new CSpPr();

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;

    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);

    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();

    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.group = null;

    this.recalculateInfo =
    {
        recalculateAll: true
    };

    this.selectedObjects =
    [];

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CChartAsGroup.prototype =
{
    getObjectType: function()
    {
        return CLASS_TYPE_CHART_AS_GROUP;
    },

    Get_Id: function()
    {
        return this.Id;
    },


    setDrawingObjects: function(drawingObjects)
    {
        var newValue = isRealObject(drawingObjects) ? drawingObjects.getWorksheet().model.getId() : null;
        var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.drawingObjects = drawingObjects;

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
        if(isRealObject(this.chartLegend))
            this.chartLegend.drawingObjects = drawingObjects;
    },

    addToDrawingObjects: function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataClosePath()), null);
        this.drawingObjects.addGraphicObject(this);
    },


    getTransform: function()
    {
        return this.transform;
    },

    recalculatePosExt: function()
    {
        var xfrm;
     /*   if(isRealObject(this.drawingBase))
        {

            var metrics = this.drawingBase.getGraphicObjectMetrics();
            xfrm = {offX: metrics.x, offY: metrics.y, extX: metrics.extX, extY: metrics.extY};
        }
        else  */
        xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
        }
        this.spPr.geometry.Recalculate(this.extX, this.extY);
    },

    recalculateTransform: function()
    {
        this.recalculatePosExt();
        this.recalculateMatrix();
    },

    recalculateMatrix: function()
    {
        this.transform.Reset();
        var hc, vc;
        hc = this.extX*0.5;
        vc = this.extY*0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);

        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
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

    recalculateTransform2: function()
    {
        var xfrm;
        if(isRealObject(this.drawingBase))
        {
            xfrm = this.drawingBase.getGraphicObjectMetrics();
            xfrm.offX = xfrm.x;
            xfrm.offY = xfrm.y;
        }
        else
            xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
        }
        this.transform.Reset();
        var hc, vc;
        hc = this.extX*0.5;
        vc = this.extY*0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);

        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },

   /* recalculate: function()
    {
        if(this.recalculateInfo.recalculateAll)
        {
            var xfrm = this.spPr.xfrm;
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.transform.Reset();
            global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
            if(isRealObject(this.group))
                global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
            if(isRealObject(this.chartTitle))
            {
                var title = this.chartTitle;
                var max_content_width = this.extX
            }
        }
    },           */

    initAfterOpen: function(aImagesSync)
    {
        this.recalculateTransform2();
        var t_inset = 0, r_inset = 0, b_inset = 0, l_inset = 0;
        if(isRealObject(this.chartTitle))
        {
            var chart_title = this.chartTitle;
            var body_pr = chart_title.txBody.bodyPr;
            var r_ins = isRealNumber(body_pr.rIns) ? body_pr.rIns : 0.3;//0.5;
            var l_ins = isRealNumber(body_pr.lIns) ? body_pr.lIns : 0.1;//1;
            var t_ins = isRealNumber(body_pr.tIns) ? body_pr.tIns : 0.3;//0.5;
            var b_ins = isRealNumber(body_pr.bIns) ? body_pr.bIns : 0;//0.5;
            var max_width = chart_title.chartGroup.extX*0.8 - r_ins - l_ins;
            var title_content = chart_title.txBody.content;
            for(var i = 0; i < title_content.Content.length; ++i)
            {
                title_content.Content[i].Pr.Spacing.After = 0;
            }
            for(var i = 0; i < title_content.Content.length; ++i)
            {
                title_content.Content[i].Pr.Spacing.Before = 0.75;
            }
            title_content.Reset(0, 0, max_width, 20000);
            title_content.Recalculate_Page(0, true);
            var result_width;
            if(!(title_content.Content.length > 1 || title_content.Content[0].Lines.length > 1))
            {
                if(title_content.Content[0].Lines[0].Ranges[0].W < max_width)
                {
                    title_content.Reset(0, 0, title_content.Content[0].Lines[0].Ranges[0].W, 20000);
                    title_content.Recalculate_Page(0, true);
                }
                result_width = title_content.Content[0].Lines[0].Ranges[0].W + r_ins + l_ins;
            }
            else
            {
                var width = 0;
                for(var i = 0; i < title_content.Content.length; ++i)
                {
                    var par = title_content.Content[i];
                    for(var j = 0; j < par.Lines.length; ++j)
                    {
                        if(par.Lines[j].Ranges[0].W > width)
                            width = par.Lines[j].Ranges[0].W;
                    }
                }
                result_width = width + r_ins + l_ins;
            }
            chart_title.extX = result_width;
            chart_title.extY = title_content.Get_SummaryHeight() + r_ins + l_ins;
            chart_title.x = chart_title.chartGroup.extX*0.5 - chart_title.extX*0.5;
            chart_title.y = this.drawingObjects.convertMetric(7, 0, 3);
            chart_title.transform.Reset();
            global_MatrixTransformer.TranslateAppend(chart_title.transform, chart_title.x, chart_title.y);
            global_MatrixTransformer.MultiplyAppend(chart_title.transform, this.transform);
            chart_title.transformText.Reset();
            global_MatrixTransformer.TranslateAppend(chart_title.transformText, chart_title.x + l_ins, chart_title.y + t_ins);
            global_MatrixTransformer.MultiplyAppend(chart_title.transformText, this.transform);
        }
        if ( !this.chart.range.intervalObject )
            this.drawingObjects.intervalToIntervalObject(this.chart);
        this.chart.margins =
        {
            key:
            {
                position: null,//"right",
                w: 0,
                h: 0
            },

            xAxisTitle:
            {
                w: 0,
                h: 0
            },


            yAxisTitle:
            {
                w: 0,
                h: 0
            },

            title:
            {
                w: chart_title ? this.drawingObjects.convertMetric(chart_title.extX, 3, 0) : 0,
                h: chart_title ? this.drawingObjects.convertMetric(chart_title.extY + chart_title.y, 3, 0) : 0
            }
        };
        this.brush.fill.RasterImageId = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingBase.getWidthFromTo(), this.drawingBase.getHeightFromTo());
        aImagesSync[aImagesSync.length] = this.brush.fill.RasterImageId;
    },

    /*init: function(aImagesSync)
    {
        this.recalculateTransform2();
       // this.recalculateTitleAfterMove();
        var chart_title_height = 0;
        if(isRealObject(this.chartTitle))
        {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;

            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;

            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight() + body_pr.tIns + body_pr.bIns;
                this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);

                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;

            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();

                if(this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                else
                    this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;

                if(this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                else
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);

                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height =  this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }
            chart_title_height = this.chartTitle.extY;
            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            this.chartTitle.txBody.calculateContent();
        }


        var h_axis_h = 0;
        if(isRealObject(this.hAxisTitle))
        {
            var title = this.hAxisTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;

            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;
            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                title.extX = result_width;
                title.extY = tx_body.content.Get_SummaryHeight();
                title.x = (this.extX - title.extX)*0.5;
                title.y = this.drawingObjects.convertMetric(7, 0, 3);
            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                title.extX = result_width;
                title.extY = tx_body.content.Get_SummaryHeight();

                if(title.layout.xMode === LAYOUT_MODE_EDGE)
                    title.x = this.extX*title.layout.x;
                else
                    title.x = (this.extX - title.extX)*0.5;

                if(title.layout.yMode === LAYOUT_MODE_EDGE)
                    title.y = this.extY*title.layout.y;
                else
                    title.y = this.drawingObjects.convertMetric(7, 0, 3);
            }
            h_axis_h = title.extY;
        }

        if(isRealObject(this.vAxisTitle))
        {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;
            body_pr.vert = nVertTTvert;

            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;

            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extY*0.8 - (body_pr.tIns + body_pr.bIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.tIns + body_pr.bIns;
                }
                title.extY = result_width;
                title.extX = tx_body.content.Get_SummaryHeight();

                title.x = ()
                title.x = (this.extX - this.chartTitle.extX)*0.5;
                title.y = this.drawingObjects.convertMetric(7, 0, 3);
                title.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);

                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;

            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();

                if(this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                else
                    this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;

                if(this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                else
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);

                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height =  this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }

            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            this.chartTitle.txBody.calculateContent();
        }

        if(isRealObject(this.hAxisTitle))
        {
            var title = this.hAxisTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;

            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;

            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                title.extX = result_width;
                title.extY = tx_body.content.Get_SummaryHeight();
                title.x = (this.extX - title.extX)*0.5;
                title.y = this.drawingObjects.convertMetric(7, 0, 3);
                title.transform.Reset();
                global_MatrixTransformer.TranslateAppend(title.transform, title.x, title.y);
                global_MatrixTransformer.MultiplyAppend(title.transform, this.transform);

                title.invertTransform = global_MatrixTransformer.Invert(title.transform);
                title.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;

            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();

                if(this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                else
                    this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;

                if(this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                else
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);

                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height =  this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }

            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            this.chartTitle.txBody.calculateContent();
        }

        var title_margin = {w:0, h: 0}, key = {w:0, h: 0}, xAxisTitle = {w:0, h: 0}, yAxisTitle = {w:0, h: 0};
        if(isRealObject(this.chartTitle))
        {
            if(!this.chartTitle.overlay)
            {
                title_margin = {
                    w: this.drawingObjects.convertMetric(title_width, 3, 0),
                    h: this.drawingObjects.convertMetric(title_height, 3, 0)
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

        if ( !this.chart.range.intervalObject )
            this.drawingObjects.intervalToIntervalObject(this.chart);
        this.brush.fill.RasterImageId = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingObjects.convertMetric(this.extX, 3, 0),this.drawingObjects.convertMetric(this.extY, 3, 0));
        aImagesSync[aImagesSync.length] = this.brush.fill.RasterImageId;
    }, */

    /*init: function(aImagesSync)
    {
        if(isRealObject(this.drawingBase))
        {
            var metrics = this.drawingBase.getGraphicObjectMetrics();
            this.spPr.xfrm.setPosition(metrics.x, metrics.y);
            this.spPr.xfrm.setExtents(metrics.extX, metrics.extY);
        }
        this.recalculatePosExt();

        var title_h, title_w;
        if(isRealObject(this.chartTitle))
        {
            var title = this.chartTitle;
            var body_pr = title.txBody.bodyPr;
            body_pr.setChartTitleInsets();
            var content = title.txBody.content;
            content.Set_ApplyToAll(true);
            content.Set_ParagraphSpacing({Before: 0, After: 0, Line: 1});
            content.Set_ParagraphAlign(align_Center);
            content.Set_ApplyToAll(false);
            var max_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
            content.Reset(0, 0, max_width, 20000);
            content.Recalculate_Page(0, true);

            var content_width, content_height;
            if(!(content.Content[0].length > 1 || content.Content[0].Lines.length > 1))
            {
                content_width = content.Content[0].Lines[0].Ranges[0].W+5;
                content.Reset(0, 0, content_width, 20000);
                content.Recalculate_Page(0, true);
            }
            else
            {
                content_width = max_width;
            }
            content_height = content.Get_SummaryHeight();
            title.extX = content_width + body_pr.rIns + body_pr.rIns;
            title.extY = content_height + body_pr.tIns + body_pr.bIns;

            title.spPr.geometry.Recalculate(title.extX, title.extY);

            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                title.x = (this.extX - title.extX)*0.5;
                title.y = this.drawingObjects.convertMetric(7, 0, 3);
            }
            else
            {
                if(title.layout.xMode === LAYOUT_MODE_EDGE)
                {
                    var pos_x = this.extX*title.layout.x;
                    if(pos_x + title.extX> this.extX)
                        pos_x = this.extX - title.extX;
                    if(pos_x < 0)
                        pos_x = 0;

                    title.x = pos_x;
                }
                else
                    title.x = (this.extX - title.extX)*0.5;



                if(title.layout.yMode === LAYOUT_MODE_EDGE)
                {
                    var pos_y = this.extY*title.layout.y;
                    if(pos_y + title.extY> this.extY)
                        pos_y = this.extY - title.extY;
                    if(pos_y < 0)
                        pos_y = 0;

                    title.y = pos_y;
                }
                else
                    title.y = (this.extY - title.extY)*0.5;
            }
            title_w = this.drawingObjects.convertMetric(title.extX, 3, 0);
            title_h = this.drawingObjects.convertMetric(title.extY + title.y, 3, 0);
        }

        if(isRealObject(this.hAxisTitle))
        {
            var title = this.hAxisTitle;
            var body_pr = title.txBody.bodyPr;
            body_pr.setChartTitleInsets();
            var content = title.txBody.content;
            content.Set_ApplyToAll(true);
            content.Set_ParagraphSpacing({Before: 0, After: 0, Line: 1});
            content.Set_ParagraphAlign(align_Center);
            content.Set_ApplyToAll(false);
            var max_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
            content.Reset(0, 0, max_width, 20000);
            content.Recalculate_Page(0, true);

            var content_width, content_height;
            if(!(content.Content[0].length > 1 || content.Content[0].Lines.length > 1))
            {
                content_width = content.Content[0].Lines[0].Ranges[0].W+5;
                content.Reset(0, 0, content_width, 20000);
                content.Recalculate_Page(0, true);
            }
            else
            {
                content_width = max_width;
            }
            content_height = content.Get_SummaryHeight();
            title.extX = content_width + body_pr.rIns + body_pr.rIns;
            title.extY = content_height + body_pr.tIns + body_pr.bIns;
            title.spPr.geometry.Recalculate(title.extX, title.extY);
        }

        if(isRealObject(this.vAxisTitle))
        {
            var title = this.vAxisTitle;
            var body_pr = title.txBody.bodyPr;
            body_pr.setChartTitleInsets();
            body_pr.setVert(nVertTTvert270);
            var content = title.txBody.content;
            content.Set_ApplyToAll(true);
            content.Set_ParagraphSpacing({Before: 0, After: 0, Line: 1});
            content.Set_ParagraphAlign(align_Center);
            content.Set_ApplyToAll(false);

            var max_width = this.extY*0.8 - (body_pr.tIns + body_pr.bIns);
            content.Reset(0, 0, max_width, 20000);
            content.Recalculate_Page(0, true);
            var content_width, content_height;
            if(!(content.Content[0].length > 1 || content.Content[0].Lines.length > 1))
            {
                content_width = content.Content[0].Lines[0].Ranges[0].W+5;
                content.Reset(0, 0, content_width, 20000);
                content.Recalculate_Page(0, true);
            }
            else
            {
                content_width = max_width;
            }
            content_height = content.Get_SummaryHeight();
            title.extX = content_height + body_pr.lIns + body_pr.rIns;
            title.extY = content_width + body_pr.tIns + body_pr.bIns;

            var top_inset = 0;
            if(isRealObject(this.chartTitle))
            {
                top_inset = 2*this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }
            if(isRealObject(this.chartLegend))
            {
                //TODO
            }

            if(!(isRealObject(title.layout) && title.layout.isManual))
            {

                var pos_y = (this.extY - title.extY)*0.5;
                if(pos_y < top_inset)
                {
                    pos_y = top_inset;
                }
                title.y = pos_y;

                pos_x = this.drawingObjects.convertMetric(6, 0, 3);
                if(isRealObject(this.chartLegend))
                {
                    //TODO
                }

                title.x = pos_x;
            }
            else
            {
                if(title.layout.xMode === LAYOUT_MODE_EDGE)
                {
                    pos_x = this.extX*title.layout.x;
                    if(pos_x + title.extX > this.extX)
                        pos_x = this.extX - title.extX;
                    if(pos_x < 0)
                        pos_x = 0;
                }
                else
                {
                    pos_x = this.drawingObjects.convertMetric(6, 0, 3);
                    if(isRealObject(this.chartLegend))
                    {
                        //TODO
                    }

                    title.x = pos_x;
                }

                if(title.layout.yMode === LAYOUT_MODE_EDGE)
                {
                    pos_y = this.extY*title.layout.y;
                    if(pos_y + title.extY > this.extY)
                        pos_y = this.extY - title.extY;
                    if(pos_y < 0)
                        pos_y = 0;
                }
                else
                {
                    pos_y = (this.extY - title.extY)*0.5;
                    if(pos_y < top_inset)
                    {
                        pos_y = top_inset;
                    }
                    title.y = pos_y;
                }
            }

            if(isRealObject(this.hAxisTitle))
            {
                if(!(isRealObject(this.hAxisTitle.layout) && this.hAxisTitle.layout.isManual))
                {
                    var left_inset = this.drawingObjects.convertMetric(14, 0, 3);
                    var x_axis_start_pos = left_inset + this.drawingObjects.convertMetric(25, 0, 3) + title.extX;
                    var x_axis_end_pos = this.extX - this.drawingObjects.convertMetric(14, 0, 3);
                    if(isRealObject(this.chartLegend))
                    {
                        //TODO
                    }
                    var x_axis_length = x_axis_end_pos - x_axis_start_pos;
                    if(this.hAxisTitle.extX < (x_axis_length))
                        this.hAxisTitle.x = x_axis_start_pos + (x_axis_length - this.hAxisTitle.extX)*0.5;
                    else
                        this.hAxisTitle.x = x_axis_start_pos;

                    this.hAxisTitle.y = this.extY - (this.drawingObjects.convertMetric(14, 0, 3) + this.hAxisTitle.extY);
                }
                else
                {
                    if(this.hAxisTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    {
                        this.hAxisTitle.x = this.hAxisTitle.layout.x*this.extX;
                        if(this.hAxisTitle.x + this.hAxisTitle.extX > this.extX)
                            this.hAxisTitle.x = this.extX - this.hAxisTitle.extX;
                        if(this.hAxisTitle.x < 0)
                            this.hAxisTitle.x = 0;
                    }
                    else
                    {
                        var left_inset = this.drawingObjects.convertMetric(14, 0, 3);
                        var x_axis_start_pos = left_inset + this.drawingObjects.convertMetric(25, 0, 3) + title.extX;
                        var x_axis_end_pos = this.extX - this.drawingObjects.convertMetric(14, 0, 3);
                        if(this.isRealObject(this.chartLegend))
                        {
                            //TODO
                        }
                        var x_axis_length = x_axis_end_pos - x_axis_start_pos;
                        if(this.hAxisTitle.extX < (x_axis_length))
                            this.hAxisTitle.x = x_axis_start_pos + (x_axis_length - this.hAxisTitle.extX)*0.5;
                        else
                            this.hAxisTitle.x = x_axis_start_pos;
                    }

                    if(this.hAxisTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    {
                        this.hAxisTitle.y = this.hAxisTitle.layout.y*this.extY;
                        if(this.hAxisTitle.y + this.hAxisTitle.extY > this.extY)
                            this.hAxisTitle.y = this.extY - this.hAxisTitle.extY;
                        if(this.hAxisTitle.y < 0)
                            this.hAxisTitle.y = 0;
                    }
                    else
                    {
                        this.hAxisTitle.y = this.extY - (this.drawingObjects.convertMetric(14, 0, 3) + this.hAxisTitle.extY);
                    }
                }
            }

            title.spPr.geometry.Recalculate(title.extX, title.extY);
        }
        else
        {
            if(isRealObject(this.hAxisTitle))
            {
                if(!(isRealObject(this.hAxisTitle.layout) && this.hAxisTitle.layout.isManual))
                {
                    var left_inset = this.drawingObjects.convertMetric(14, 0, 3);
                    var x_axis_start_pos = left_inset + this.drawingObjects.convertMetric(25, 0, 3);
                    var x_axis_end_pos = this.extX - this.drawingObjects.convertMetric(14, 0, 3);
                    if(this.isRealObject(this.chartLegend))
                    {
                        //TODO
                    }
                    var x_axis_length = x_axis_end_pos - x_axis_start_pos;
                    if(this.hAxisTitle.extX < (x_axis_length))
                        this.hAxisTitle.x = x_axis_start_pos + (x_axis_length - this.hAxisTitle.extX)*0.5;
                    else
                        this.hAxisTitle.x = x_axis_start_pos;

                    this.hAxisTitle.y = this.extY - (this.drawingObjects.convertMetric(14, 0, 3) + this.hAxisTitle.extY);
                }
                else
                {
                    if(this.hAxisTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    {
                        this.hAxisTitle.x = this.hAxisTitle.layout.x*this.extX;
                        if(this.hAxisTitle.x + this.hAxisTitle.extX > this.extX)
                            this.hAxisTitle.x = this.extX - this.hAxisTitle.extX;
                        if(this.hAxisTitle.x < 0)
                            this.hAxisTitle.x = 0;
                    }
                    else
                    {
                        var left_inset = this.drawingObjects.convertMetric(14, 0, 3);
                        var x_axis_start_pos = left_inset + this.drawingObjects.convertMetric(25, 0, 3);
                        var x_axis_end_pos = this.extX - this.drawingObjects.convertMetric(14, 0, 3);
                        if(this.isRealObject(this.chartLegend))
                        {
                            //TODO
                        }
                        var x_axis_length = x_axis_end_pos - x_axis_start_pos;
                        if(this.hAxisTitle.extX < (x_axis_length))
                            this.hAxisTitle.x = x_axis_start_pos + (x_axis_length - this.hAxisTitle.extX)*0.5;
                        else
                            this.hAxisTitle.x = x_axis_start_pos;
                    }

                    if(this.hAxisTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    {
                        this.hAxisTitle.y = this.hAxisTitle.layout.y*this.extY;
                        if(this.hAxisTitle.y + this.hAxisTitle.extY > this.extY)
                            this.hAxisTitle.y = this.extY - this.hAxisTitle.extY;
                        if(this.hAxisTitle.y < 0)
                            this.hAxisTitle.y = 0;
                    }
                    else
                    {
                        this.hAxisTitle.y = this.extY - (this.drawingObjects.convertMetric(14, 0, 3) + this.hAxisTitle.extY);
                    }
                }
            }
        }

        this.recalculateMatrix();

        this.chart.margins =
        {
            key:
            {
                position: null,//"right",
                w: 0,
                h: 0
            },

            xAxisTitle:
            {
                w: isRealObject(this.hAxisTitle) && !this.hAxisTitle.overlay ? this.drawingObjects.convertMetric(this.hAxisTitle.extX, 3, 0) : 0,
                h: isRealObject(this.hAxisTitle) && !this.hAxisTitle.overlay ? this.drawingObjects.convertMetric(this.hAxisTitle.extY, 3, 0) + 14 : 0
            },


            yAxisTitle:
            {
                w: isRealObject(this.vAxisTitle) && !this.vAxisTitle.overlay ? this.drawingObjects.convertMetric(this.vAxisTitle.extX, 3, 0) + 14: 0,
                h: isRealObject(this.vAxisTitle) && !this.vAxisTitle.overlay ? this.drawingObjects.convertMetric(this.vAxisTitle.extY, 3, 0) : 0
            },

            title:
            {
                w: isRealObject(this.chartTitle) && !this.chartTitle.overlay? this.drawingObjects.convertMetric(this.chartTitle.extX, 3, 0) : 0,
                h: isRealObject(this.chartTitle) && !this.chartTitle.overlay? this.drawingObjects.convertMetric(this.chartTitle.extY, 3, 0) + 7: 0
            }
        };
        if ( !this.chart.range.intervalObject )
            this.drawingObjects.intervalToIntervalObject(this.chart);
        this.brush.fill.RasterImageId = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingBase.getWidthFromTo(), this.drawingBase.getHeightFromTo());
        aImagesSync[aImagesSync.length] = this.brush.fill.RasterImageId;
        //TODO: пока предеполагаем, что легенды у нас нет
    }, */


    setXfrmObject: function(xfrm)
    {
        var oldId = isRealObject(this.spPr.xfrm) ? this.spPr.xfrm.Get_Id() : null;
        var newId = isRealObject(xfrm) ? xfrm.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.spPr.xfrm = xfrm;
    },

    init: function()
    {
        if(isRealObject(this.drawingBase))
        {
            var metrics = this.drawingBase.getGraphicObjectMetrics();
            this.setXfrmObject(new CXfrm());
            this.spPr.xfrm.setPosition(metrics.x, metrics.y);
            this.spPr.xfrm.setExtents(metrics.extX, metrics.extY);
        }
        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.setType(CHART_TITLE_TYPE_TITLE);
            this.chartTitle.drawingObjects = this.drawingObjects;
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
                content.setParent(this.chartTitle.txBody);
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                }
            }
            this.chart.header.title = this.chartTitle.txBody.content.getTextString();
            /*this.chart.header.font = new asc_CChartFont();
            this.chartTitle.txBody.content.Set_ApplyToAll(true);
            this.chartTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.chartTitle.txBody.content.Set_ApplyToAll(false);*/
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
                content.setParent(this.hAxisTitle.txBody);
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                }
            }

            this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();
            /*this.hAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.hAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.hAxisTitle.txBody.content.Set_ApplyToAll(false);      */
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
                this.vAxisTitle.txBody.bodyPr.setVert(nVertTTvert270);

                for(var i in title_str)
                    this.vAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_str[i]), false);
            }
            else
            {
                this.vAxisTitle.txBody.bodyPr.setVert(nVertTTvert270);
                var content = this.vAxisTitle.txBody.content;
                content.setParent(this.vAxisTitle.txBody)
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                }
            }

            this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
           /* this.vAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.vAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.vAxisTitle.txBody.content.Set_ApplyToAll(false);  */
        }

       /* if(isRealObject(this.chartLegend))
        {
            this.chartLegend.setChartGroup(this);
            this.chartLegend.init();
        }                   */
        this.recalculate();
    },


    setChart: function(chart)
    {
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

    initFromChartObject: function(chart, bWithoutHistory, options)
    {
        this.setChart(chart);
        this.spPr.xfrm = new CXfrm();
        var xfrm = this.spPr.xfrm;
        var chartLeft = this.drawingObjects.convertMetric(options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css('width')) / 2) - c_oAscChartDefines.defaultChartWidth / 2, 0, 3);
        var chartTop = this.drawingObjects.convertMetric(options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css('height')) / 2) - c_oAscChartDefines.defaultChartHeight / 2, 0, 3);
        xfrm.setPosition(chartLeft, chartTop);
        var w = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartWidth, 0, 3), h = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartHeight, 0, 3);
        if(isRealObject(options))
        {
            if(isRealNumber(options.width) && isRealNumber(options.height))
            {
                w = this.drawingObjects.convertMetric(options.width, 0, 3);
                h = this.drawingObjects.convertMetric(options.height, 0, 3);
            }
        }
        xfrm.setExtents(w, h);
        if(isRealObject(this.chart.header))
        {
            var title_string;
            if(this.chart.header.bDefaultTitle || !(typeof this.chart.header.title === "string"))
                title_string = "Chart Title";
            else
                title_string = this.chart.header.title;

            this.setChartTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.setTextBody(new CTextBody(this.chartTitle));
            for(var i in title_string)
                this.chartTitle.txBody.content.Paragraph_Add(new ParaText(title_string[i]), false);
        }

        if(isRealObject(this.chart.xAxis) && this.chart.xAxis.bShow)
        {
            if(this.chart.xAxis.bDefaultTitle || !(typeof this.chart.xAxis.title === "string"))
                title_string = "X Axis";
            else
                title_string = this.chart.xAxis.title;

            this.setXAxisTitle(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
            for(var i in title_string)
                this.hAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_string[i]), false);


            this.chart.xAxis.bDefaultTitle = false;
            this.chart.xAxis.bShow = false;
            this.chart.xAxis.title = "";
        }

        if(isRealObject(this.chart.yAxis) && this.chart.yAxis.bShow)
        {
            if(this.chart.yAxis.bDefaultTitle || !(typeof this.chart.yAxis.title === "string"))
                title_string = "Y Axis";
            else
                title_string = this.chart.yAxis.title;

            this.setYAxisTitle(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
            for(var i in title_string)
                this.vAxisTitle.txBody.content.Paragraph_Add(new ParaText(title_string[i]), false);


            this.chart.yAxis.bDefaultTitle = false;
            this.chart.yAxis.bShow = false;
            this.chart.yAxis.title = "";
        }

        /*TODO: Не забыть про легенду*/
        this.init();
        this.addToDrawingObjects()
    },

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
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

    recalculateTitleAfterMove: function()
    {
        if(isRealObject(this.chartTitle))
        {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;

            var paragraphs = tx_body.content.Content;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;

            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;

            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();

                if(this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                else
                    this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;

                if(this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                else
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);

                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height =  this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }
        }
    },

    draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this.spPr.geometry);
        graphics.reset();
        graphics.SetIntegerGrid(true);
        if(this.chartTitle)
            this.chartTitle.draw(graphics);
        if(this.hAxisTitle)
            this.hAxisTitle.draw(graphics);
        if(this.vAxisTitle)
            this.vAxisTitle.draw(graphics);
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

    select: function(drawingObjectsController)
    {
        this.selected = true;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
                break;
        }
        if(i === selected_objects.length)
            selected_objects.push(this);
    },

    deselect: function(drawingObjectsController)
    {
        this.selected = false;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
            {
                selected_objects.splice(i, 1);
                break;
            }
        }

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



    recalculate: function()
    {
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
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
            }

            this.chartTitle.recalculateTransform();
            this.chartTitle.calculateContent();
            this.chartTitle.calculateTransformTextMatrix();
        }
        if(isRealObject(this.chartLegend))
        {
            //TODO
            /*switch(this.chartLegend.legendPos)
            {
                case c_oAscChartLegend.left:
                case c_oAscChartLegend.right:
                {
                    var legend_entries = this.chartLegend.calculatedEntry;
                    for(var i = 0; i < legend_entries.length; ++i)
                    {
                        var cur_entry = legend_entries[i];
                        cur_entry
                    }
                    break;
                }
                case c_oAscChartLegend.top:
                {
                    break;
                }
                case c_oAscChartLegend.bottom:
                {
                    break;
                }
            } */
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
        tInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.chartTitle) ? this.chartTitle.extY : 0);
        lInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.vAxisTitle) ? this.vAxisTitle.extX : 0);
        rInd = 0;//this.drawingObjects.convertMetric(7, 0, 3) + this.vAxisTitle.extX;
        bInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.hAxisTitle) ? this.hAxisTitle.extY : 0);
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
                this.vAxisTitle.x = this.drawingObjects.convertMetric(7, 0, 3);
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

                this.hAxisTitle.x = ((this.extX - rInd) - (lInd + this.drawingObjects.convertMetric(25, 0, 3)) - this.hAxisTitle.extX)*0.5 + lInd + this.drawingObjects.convertMetric(25, 0, 3);
                if(this.hAxisTitle.x < lInd + this.drawingObjects.convertMetric(25, 0, 3))
                    this.hAxisTitle.x = lInd + this.drawingObjects.convertMetric(25, 0, 3);
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
                    w: this.drawingObjects.convertMetric(this.chartTitle.extX, 3, 0),
                    h: 7+this.drawingObjects.convertMetric(this.chartTitle.extY, 3, 0)
                }
            }
        }

        if(isRealObject(this.hAxisTitle))
        {
            if(!this.hAxisTitle.overlay)
            {
                xAxisTitle = {
                    w: this.drawingObjects.convertMetric(this.hAxisTitle.extX, 3, 0),
                    h: 7+this.drawingObjects.convertMetric(this.hAxisTitle.extY, 3, 0)
                }
            }
        }

        if(isRealObject(this.vAxisTitle))
        {
            if(!this.vAxisTitle.overlay)
            {
                yAxisTitle = {
                    w:  7 + this.drawingObjects.convertMetric(this.vAxisTitle.extX, 3, 0),
                    h: this.drawingObjects.convertMetric(this.vAxisTitle.extY, 3, 0)
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

        if ( !this.chart.range.intervalObject )
            this.drawingObjects.intervalToIntervalObject(this.chart);
        this.brush.fill.RasterImageId = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingObjects.convertMetric(this.extX, 3, 0),this.drawingObjects.convertMetric(this.extY, 3, 0));
        this.drawingObjects.loadImageRedraw(this.brush.fill.RasterImageId);
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
        return new MoveTrackChart(this);
    },

    createResizeTrack: function(cardDirection)
    {
        return new ResizeTrackChart(this, cardDirection);
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

    recalculateAfterResize: function()
    {
        this.recalculateTransform2();
        // this.recalculateTitleAfterMove();
        if(isRealObject(this.chartTitle))
        {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;

            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;

            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;

            var title_height, title_width;
            if(!(isRealObject(title.layout) && title.layout.isManual))
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);

                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;

            }
            else
            {
                var max_content_width = this.extX*0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if(!(tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1))
                {
                    if(tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width)
                    {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                }
                else
                {
                    var width = 0;
                    for(var i = 0; i < tx_body.content.Content.length; ++i)
                    {
                        var par = tx_body.content.Content[i];
                        for(var j = 0; j < par.Lines.length; ++j)
                        {
                            if(par.Lines[j].Ranges[0].W > width)
                                width = par.Lines[j].Ranges[0].W;
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();

                if(this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.x = this.extX*this.chartTitle.layout.x;
                else
                    this.chartTitle.x = (this.extX - this.chartTitle.extX)*0.5;

                if(this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE)
                    this.chartTitle.y = this.extY*this.chartTitle.layout.y;
                else
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);

                if(this.chartTitle.x + this.chartTitle.extX > this.extX)
                    this.chartTitle.x = this.extX - this.chartTitle.extX;
                if(this.chartTitle.x < 0)
                    this.chartTitle.x = 0;

                if(this.chartTitle.y + this.chartTitle.extY > this.extY)
                    this.chartTitle.y = this.extY - this.chartTitle.extY;
                if(this.chartTitle.y < 0)
                    this.chartTitle.y = 0;


                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();

                title_width = this.chartTitle.extX;
                title_height =  this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }

            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            this.chartTitle.txBody.calculateContent();
        }

        var title_margin = {w:0, h: 0}, key = {w:0, h: 0}, xAxisTitle = {w:0, h: 0}, yAxisTitle = {w:0, h: 0};
        if(isRealObject(this.chartTitle))
        {
            if(!this.chartTitle.overlay)
            {
                title_margin = {
                    w: this.drawingObjects.convertMetric(title_width, 3, 0),
                    h: this.drawingObjects.convertMetric(title_height, 3, 0)
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

        if ( !this.chart.range.intervalObject )
            this.drawingObjects.intervalToIntervalObject(this.chart);
        this.brush.fill.RasterImageId = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingObjects.convertMetric(this.extX, 3, 0),this.drawingObjects.convertMetric(this.extY, 3, 0));
        this.drawingObjects.loadImageRedraw(this.brush.fill.RasterImageId);
    },

    Undo: function(type, data)
    {
        switch(type)
        {
            case historyitem_AutoShapes_RecalculateTransformUndo:
            {
                this.recalculate();
            }
        }
    },

    Redo: function(type, data)
    {
        switch(type)
        {
            case historyitem_AutoShapes_RecalculateTransformRedo:
            {
                this.recalculate();
            }
        }
    }

};

