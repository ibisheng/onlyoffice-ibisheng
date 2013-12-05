
var CLASS_TYPE_CHART_DATA = 9999;
function CChartAsGroup(parent/*(WordGraphicObject)*/, document, drawingDocument, group)
{
    if(parent instanceof ParaDrawing)
        this.parent = parent;
    this.document = document;
    this.drawingDocument = drawingDocument;
    this.group = isRealObject(group) ? group : null;

    if(parent instanceof WordGroupShapes)
    {
        this.group = parent;
    }
    this.chartTitle = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;

    // this.chart = new asc_CChart();

    this.brush = new CBlipFill();
    this.spPr = new CSpPr();



    this.x = null;
    this.y = null;
    this.absExtX = null;
    this.absExtY = null;
    this.absOffsetX = 0;
    this.absOffsetY = 0;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;

    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);

    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();

    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.ownTransform = new CMatrix();
    //this.group = null;
    this.pageIndex = -1;

    this.selectedObjects =
        [];
    this.selected = false;
    this.mainGroup = null;
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

    setAscChart: function(chart)
    {
        History.Add(this, {Type:historyitem_AutoShapes_AddChart, oldPr: this.chart, newPr: chart});
        this.chart = chart;
    },

    hitToTextRect: function()
    {
        return false;
    },

    calculateAfterChangeTheme: function()
    {
        this.recalculate();
    },

    calculateAfterOpen10: function()
    {
        this.init();
        this.recalcAllTitles();
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
        History.Add(this, {Type:historyitem_AutoShapes_RecalculateChartUndo});
        this.setAscChart(chart);
        this.recalculate();
        History.Add(this, {Type:historyitem_AutoShapes_RecalculateChartRedo});
    },

    OnContentReDraw: function()
    {
        if(isRealObject(this.parent))
        {
            this.parent.OnContentReDraw();
        }
    },

    recalcAllColors: function()
    {},

    recalcAll: function()
    {},

    documentGetAllFontNames: function(AllFonts)
    {
        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.getAllFonts(AllFonts);
        }

        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.getAllFonts(AllFonts);
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.getAllFonts(AllFonts);
        }
        this.chart.legend && this.chart.legend.font && typeof  this.chart.legend.font.name === "string"
            && this.chart.legend.font.name !== "" && (AllFonts[this.chart.legend.font.name] = true);
    },

    documentCreateFontMap: function(AllFonts)
    {
        if(isRealObject(this.chartTitle))
        {
            this.chartTitle.getAllFonts(AllFonts);
        }

        if(isRealObject(this.vAxisTitle))
        {
            this.vAxisTitle.getAllFonts(AllFonts);
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.getAllFonts(AllFonts);
        }
        this.chart.legend && this.chart.legend.font && typeof  this.chart.legend.font.name === "string"
            && this.chart.legend.font.name !== "" && (AllFonts[this.chart.legend.font.name] = true);
    },

    setSizes: function(posX, posY, w, h, flipH, flipV)
    {
        var data = {};
        data.Type = historyitem_SetSizes;
        data.oldW = this.absExtX;
        data.oldH = this.absExtY;
        data.newW = w;
        data.newH = h;
        data.oldFlipH = this.absFlipH;
        data.oldFlipV = this.absFlipV;
        data.newFlipH = flipH;
        data.newFlipV = flipV;
        data.oldPosX = this.absOffsetX;
        data.oldPosY = this.absOffsetY;
        data.newPosX = posX;
        data.newPosY = posY;

        History.Add(this, data);

        this.spPr.xfrm.extX = w;
        this.spPr.xfrm.extY = h;
        //this.spPr.xfrm.flipH = flipH;
        //this.spPr.xfrm.flipV = flipV;
        this.absExtX = w;
        this.absExtY = h;
        //this.absFlipH = flipH;
        //this.absFlipV = flipV;
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        if(this.parent)
        {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
            //this.parent.flipH = flipH;
            //this.parent.flipV = flipV;
        }
        this.calculateAfterResize();
    },

    calculateAfterResize: function()
    {
        if(isRealObject(this.parent))
        {
            this.parent.bNeedUpdateWH = true;
        }
        this.recalcAllTitles();
        this.recalculate();
    },

    updateCursorTypes: function()
    {
        this.cursorTypes = [];
        var transform = this.transform;
        if(transform == null)
        {
            transform = new CMatrix();
        }
        var vc = this.spPr.xfrm.extX*0.5;
        var hc = this.spPr.xfrm.extY*0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt-xc;
        var vy = yc-yt;
        var angle = Math.atan2(vy, vx)+Math.PI/8;
        if(angle < 0)
        {
            angle+=2*Math.PI;
        }
        if(angle > 2*Math.PI)
        {
            angle-=2*Math.PI;
        }

        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt-xc;
        var vy_lt = yc-ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";

        var _index = Math.floor(angle/(Math.PI/4));
        var _index2, t;
        if(vx_lt*vy-vx*vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for(var i = 0; i<8; ++i)
            {
                t = i- _index + 17;
                _index2 =  t - ((t/8) >> 0)*8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
        else
        {
            for(i = 0; i<8; ++i)
            {
                t = -i-_index+19;
                _index2 = t - ((t/8) >> 0)*8;//(-i-_index+19)%8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
    },


    setXfrm: function(offsetX, offsetY, extX, extY, rot, flipH, flipV)
    {
        var data = {Type: historyitem_SetXfrmShape};

        var _xfrm = this.spPr.xfrm;
        if(offsetX !== null)
        {
            data.oldOffsetX = _xfrm.offX;
            data.newOffsetX = offsetX;
            _xfrm.offX = offsetX;
        }

        if(offsetY !== null)
        {
            data.oldOffsetY = _xfrm.offY;
            data.newOffsetY = offsetY;
            _xfrm.offY = offsetY;
        }


        if(extX !== null)
        {
            data.oldExtX = _xfrm.extX;
            data.newExtX = extX;
            _xfrm.extX = extX;
        }

        if(extY !== null)
        {
            data.oldExtY = _xfrm.extY;
            data.newExtY = extY;
            _xfrm.extY = extY;
        }

        if(rot !== null)
        {
            data.oldRot = _xfrm.rot == null ? 0 : _xfrm.rot;
            data.newRot = rot;
            _xfrm.rot = rot;
        }

        if(flipH !== null)
        {
            data.oldFlipH = _xfrm.flipH == null ? false : _xfrm.flipH;
            data.newFlipH = flipH;
            _xfrm.flipH = flipH;
        }

        if(flipV !== null)
        {
            data.oldFlipV = _xfrm.flipV == null ? false : _xfrm.flipV;
            data.newFlipV = flipV;
            _xfrm.flipV = flipV;
        }

        History.Add(this, data);
    },

    getBoundsInGroup: function()
    {

        return {minX: this.x, minY: this.y, maxX: this.x + this.absExtX, maxY: this.y + this.absExtY};
        var r = this.rot;
        if((r >= 0 && r < Math.PI*0.25)
            || (r > 3*Math.PI*0.25 && r < 5*Math.PI*0.25)
            || (r > 7*Math.PI*0.25 && r < 2*Math.PI))
        {
        }
        else
        {
            var hc = this.absExtX*0.5;
            var vc = this.absExtY*0.5;
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
        return tx >=0 && tx <= this.absExtX && ty >=0 && ty <= this.absExtY;
    },

    hitInTextRect: function()
    {
        return false;
    },

    setGroup: function(group)
    {
        var data = {};
        data.Type = historyitem_SetGroup;
        data.oldGroup = this.group;
        data.newGroup = group;
        History.Add(this, data);
        this.group = group;
    },


    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
        return x_t > 0 && x_t < this.absExtX && y_t > 0 && y_t < this.absExtY;
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
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
        Props.Width  = this.absExtX;
        Props.Height = this.absExtY;

        if(!isRealObject(OtherProps))
            return Props;


        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;

        return OtherProps;
    },




    getTransform: function()
    {
        return this.transform;
    },
    calculateContent: function()
    {},

    hitToPath: function()
    {
        return false;
    },

    recalculatePosExt: function()
    {
        var xfrm;
        xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            /*    if(isRealObject(this.parent))
             {
             var ext = this.parent.Extent;
             this.absExtX = ext.W;
             this.absExtY = ext.H;
             }
             else
             {     */
            //this.absOffsetX = 0;
            //this.absOffsetY = 0;
            this.absExtX = xfrm.extX;
            this.absExtY = xfrm.extY;
            //}
        }
        else
        {
            this.absOffsetX = xfrm.offX;
            this.absOffsetY = xfrm.offY;
            this.absExtX = xfrm.extX;
            this.absExtY = xfrm.extY;
        }

        if(this.parent)
        {
            //this.parent.absOffsetX = data.oldPosX;
            //this.parent.absOffsetY = data.oldPosY;
            this.parent.absExtX = this.absExtX;
            this.parent.absExtY = this.absExtY;
        }
        this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
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
        var hc, vc;
        hc = this.absExtX*0.5;
        vc = this.absExtY*0.5;
        this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);

        global_MatrixTransformer.TranslateAppend(this.transform, this.absOffsetX + hc, this.absOffsetY + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        this.ownTransform = this.transform.CreateDublicate();
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




    calculateAfterOpen: function()
    {
        this.init();
    },


    syncAscChart: function() {

        if ( this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content ) {
            this.chart.asc_getHeader().asc_setTitle(getTextString(this.chartTitle.txBody.content));
        }
        if ( this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content ) {
            this.chart.asc_getYAxis().asc_setTitle(getTextString(this.vAxisTitle.txBody.content));
        }
        if ( this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content ) {
            this.chart.asc_getXAxis().asc_setTitle(getTextString(this.hAxisTitle.txBody.content));
        }
    },



    setChart: function(chart, bEdit)
    {

        if(typeof  this.chart.header.title === "string")
        {
            var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_TITLE);
            var tx_body = new CTextBody(chart_title);
            var title_str = chart.header.title;
            for(var i in title_str)
            {
                tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
            }
            chart_title.setTextBody(tx_body);
            this.addTitle(chart_title);
        }
        else
        {
            this.addTitle(null);
        }

        if(typeof  this.chart.xAxis.title === "string")
        {
            var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            var tx_body = new CTextBody(chart_title);
            var title_str = this.chart.xAxis.title;
            for(var i in title_str)
            {
                tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
            }
            chart_title.setTextBody(tx_body);
            this.addXAxis(chart_title);
        }
        if(typeof  this.chart.yAxis.title === "string")
        {
            var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            var tx_body = new CTextBody(chart_title);
            var title_str = this.chart.yAxis.title;
            for(var i in title_str)
            {
                tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
            }
            chart_title.setTextBody(tx_body);
            this.addYAxis(chart_title);
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

        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform);
        graphics.AddClipRect(-1, -1, this.absExtX + 1, this.absExtY + 1);
        if(this.chartTitle)
            this.chartTitle.draw(graphics, pageIndex);
        if(this.hAxisTitle)
            this.hAxisTitle.draw(graphics, pageIndex);
        if(this.vAxisTitle)
            this.vAxisTitle.draw(graphics, pageIndex);
        graphics.RestoreGrState();


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
            checker._l(this.absExtX, 0);
            checker._l(this.absExtX, this.absExtY);
            checker._l(0, this.absExtY);
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


    applyTextPr: function(paraItem, bRecalculate)
    {
        if(this.chartTitle)
        {
            this.chartTitle.applyTextPr(paraItem, bRecalculate);
        }
        if(this.hAxisTitle)
        {
            this.hAxisTitle.applyTextPr(paraItem, bRecalculate);
        }
        if(this.vAxisTitle)
        {
            this.vAxisTitle.applyTextPr(paraItem, bRecalculate);
        }
    },

    transformPointRelativeShape: function(x, y)
    {
        //this.calculateLeftTopPoint();
        //
        //var _sin = Math.sin(this.absRot);
        //var _cos = Math.cos(this.absRot);
        //
        //var _temp_x = x - this.absXLT;
        //var _temp_y = y - this.absYLT;
        //
        //var _relative_x = _temp_x*_cos + _temp_y*_sin;
        //var _relative_y = -_temp_x*_sin + _temp_y*_cos;

        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        return {x: t_x, y: t_y};
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

        var hc = this.absExtX*0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 1;

        dist_x = t_x - this.absExtX;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 2;

        var vc = this.absExtY*0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 3;

        dist_y = t_y - this.absExtY;
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

    Refresh_RecalcData : function(Data)
    {
        if(this.group == null && isRealObject(this.parent))
            this.parent.Refresh_RecalcData();
        else
        {
            if(isRealObject(this.group))
            {
                var cur_group = this.group;
                while(isRealObject(cur_group.group))
                    cur_group = cur_group.group;
                if(isRealObject(cur_group.parent))
                    cur_group.parent.Refresh_RecalcData();
            }
        }
    },

    Refresh_RecalcData2 : function()
    {
        if(this.group == null && isRealObject(this.parent))
            History.RecalcData_Add({ Type : historyrecalctype_Flow, Data : this.parent});
        else
        {
            if(isRealObject(this.group))
            {
                var cur_group = this.group;
                while(isRealObject(cur_group.group))
                    cur_group = cur_group.group;
                if(isRealObject(cur_group.parent))
                    History.RecalcData_Add({ Type : historyrecalctype_Flow, Data : cur_group.parent});
            }

        }
    },

    recalculate: function(updateImage)
    {
        try
        {
            this.recalculatePosExt();
            this.recalculateTransform();
            if(isRealObject(this.chartTitle))
            {
                var max_title_width = this.absExtX*0.8;
                var title_width = this.chartTitle.txBody.getRectWidth(max_title_width);
                this.chartTitle.extX = title_width;
                var bodyPr = this.chartTitle.txBody.getBodyPr();
                this.chartTitle.extY = this.chartTitle.txBody.getRectHeight(this.absExtY, title_width - (bodyPr.rIns + bodyPr.lIns));
                this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
                if(isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.x))
                {
                    this.chartTitle.x = this.absExtX*this.chartTitle.layout.x;
                    if(this.chartTitle.x + this.chartTitle.extX > this.absExtX)
                        this.chartTitle.x = this.absExtX - this.chartTitle.extX;
                    if(this.chartTitle.x < 0)
                        this.chartTitle.x = 0;
                }
                else
                {
                    this.chartTitle.x = (this.absExtX - this.chartTitle.extX)*0.5;
                }

                if(isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.y))
                {
                    this.chartTitle.y = this.absExtY*this.chartTitle.layout.y;
                    if(this.chartTitle.y + this.chartTitle.extY > this.absExtY)
                        this.chartTitle.y = this.absExtY - this.chartTitle.extY;
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
                var max_title_widh = this.absExtX*0.8;
                var title_width = this.hAxisTitle.txBody.getRectWidth(max_title_width);
                this.hAxisTitle.extX = title_width;
                var bodyPr = this.hAxisTitle.txBody.getBodyPr();
                this.hAxisTitle.extY = this.hAxisTitle.txBody.getRectHeight(this.absExtY, title_width - (bodyPr.rIns + bodyPr.lIns));
                this.hAxisTitle.spPr.geometry.Recalculate(this.hAxisTitle.extX, this.hAxisTitle.extY);
            }

            if(isRealObject(this.vAxisTitle))
            {
                var max_title_height = this.absExtY*0.8;
                var body_pr = this.vAxisTitle.txBody.getBodyPr();
                this.vAxisTitle.extY = this.vAxisTitle.txBody.getRectWidth(max_title_height) - body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns;
                this.vAxisTitle.extX = this.vAxisTitle.txBody.getRectHeight(this.absExtX, this.vAxisTitle.extY) - (- body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns);
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
                    this.vAxisTitle.x = this.absExtX*this.vAxisTitle.layout.x;
                    if(this.vAxisTitle.x + this.vAxisTitle.extX > this.absExtX)
                        this.vAxisTitle.x = this.absExtX - this.vAxisTitle.extX;
                    if(this.vAxisTitle.x < 0)
                        this.vAxisTitle.x = 0;
                }
                else
                {
                    this.vAxisTitle.x = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7);
                }

                if(isRealObject(this.vAxisTitle.layout) && isRealNumber(this.vAxisTitle.layout.y))
                {
                    this.vAxisTitle.y = this.absExtY*this.vAxisTitle.layout.y;
                    if(this.vAxisTitle.y + this.vAxisTitle.extY > this.absExtY)
                        this.vAxisTitle.y = this.absExtY - this.vAxisTitle.extY;
                    if(this.vAxisTitle.y < 0)
                        this.vAxisTitle.y = 0;
                }
                else
                {
                    this.vAxisTitle.y = (this.absExtY - this.vAxisTitle.extY)*0.5;
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
                    this.hAxisTitle.x = this.absExtX*this.hAxisTitle.layout.x;
                    if(this.hAxisTitle.x + this.hAxisTitle.extX > this.absExtX)
                        this.hAxisTitle.x = this.absExtX - this.hAxisTitle.extX;
                    if(this.hAxisTitle.x < 0)
                        this.hAxisTitle.x = 0;
                }
                else
                {
                    this.hAxisTitle.x = ((this.absExtX - rInd) - (lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25)) - this.hAxisTitle.extX)*0.5 + lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
                    if(this.hAxisTitle.x < lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25))
                        this.hAxisTitle.x = lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
                }

                if(isRealObject(this.hAxisTitle.layout) && isRealNumber(this.hAxisTitle.layout.y))
                {
                    this.hAxisTitle.y = this.absExtY*this.hAxisTitle.layout.y;
                    if(this.hAxisTitle.y + this.hAxisTitle.extY > this.absExtY)
                        this.hAxisTitle.y = this.absExtY - this.hAxisTitle.extY;
                    if(this.hAxisTitle.y < 0)
                        this.hAxisTitle.y = 0;
                }
                else
                {
                    this.hAxisTitle.y = this.absExtY - bInd;
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

            if(!(updateImage === false))
            {
                this.brush.fill.canvas = (new ChartRender()).insertChart(this.chart, editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.absExtX), editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.absExtY));
                this.brush.fill.RasterImageId = "";
                //editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.brush.fill.RasterImageId);
            }

        }
        catch(e)
        {
        }

    },

    getBase64Img: function()
    {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;

        //return this.brush.fill.canvas.toDataURL();
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
        var xfrm = this.spPr.xfrm;
        if(isRealObject(this.parent) && isRealObject(this.parent.Extent) && isRealNumber(this.parent.Extent.W) &&isRealNumber(this.parent.Extent.H)
            && (!isRealNumber(xfrm.offX)||!isRealNumber(xfrm.offY)|| !isRealNumber(xfrm.extX)||!isRealNumber(xfrm.extY)))
        {
            if(!this.group)
            {
                xfrm.offX = 0;
                xfrm.offY = 0;
            }
            xfrm.extX = this.parent.Extent.W;
            xfrm.extY = this.parent.Extent.H;
        }
        if(isRealObject(this.parent) && isRealObject(this.parent.Extent))
        {
            this.parent.Extent.W = xfrm.extX;
            this.parent.Extent.H = xfrm.extY;
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
                if(this.chartTitle.txBody.content && this.chartTitle.txBody.shape instanceof CChartTitle)
                {
                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };
                    TextPr.Bold = true;
                    if(this.chartTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.chartTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.chartTitle.txBody.content.Styles = styles;
                    this.chartTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);
                }
                //this.chartTitle.txBody.content.Styles = this.chartTitle.getStyles();
                for(var i in title_str)
                    this.chartTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {
                if(this.chartTitle.txBody.content && this.chartTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.chartTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Jc = align_Center;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.chartTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.chartTitle.txBody.content.Styles = styles;
                    this.chartTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                var content = this.chartTitle.txBody.content;
                content.Parent = this.chartTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;
                    this.chartTitle.txBody.content.Content[i].Style_Add_Open(default_legend_style.Id);
                }
            }
            var content = this.chartTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.chartTitle.txBody.content.Styles.Style.length - 1;
            }

            this.chartTitle.txBody.content.Set_ApplyToAll(true);
            this.chartTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.chartTitle.txBody.content.Set_ApplyToAll(false);
            // this.chart.header.title = this.chartTitle.txBody.content.getTextString();TODO
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);

            //this.hAxisTitle.drawingObjects = this.drawingObjects;
            if(this.hAxisTitle.isEmpty())
            {
                var title_str = "X Axis";
                this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
                if(this.hAxisTitle.txBody.content && this.hAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.hAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.hAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.hAxisTitle.txBody.content.Styles = styles;
                    this.hAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                for(var i in title_str)
                    this.hAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {

                var content = this.hAxisTitle.txBody.content;
                content.Parent = this.hAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                if(this.hAxisTitle.txBody.content && this.hAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.hAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.hAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.hAxisTitle.txBody.content.Styles = styles;
                    this.hAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;
                    content.Content[i].Style_Add_Open(default_legend_style.Id);
                }

            }


            var content = this.hAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.hAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.hAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.hAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.hAxisTitle.txBody.content.Set_ApplyToAll(false);
            // this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();   TODO
        }

        if(isRealObject(this.vAxisTitle))
        {
           //this.chart.xAxis.title = "";
            this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);

            //  this.vAxisTitle.drawingObjects = this.drawingObjects;
            if(this.vAxisTitle.isEmpty())
            {
                var title_str = "Y Axis";
                this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
                if(this.vAxisTitle.txBody.content && this.vAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.vAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.vAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.vAxisTitle.txBody.content.Styles = styles;
                    this.vAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                this.vAxisTitle.txBody.bodyPr.vert = (nVertTTvert270);

                for(var i in title_str)
                    this.vAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {
                this.vAxisTitle.txBody.bodyPr.setVert(nVertTTvert270);
                var content = this.vAxisTitle.txBody.content;

                if(this.vAxisTitle.txBody.content && this.vAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.vAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.vAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.vAxisTitle.txBody.content.Styles = styles;

                }

                content.Parent = this.vAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;

                    this.vAxisTitle.txBody.content.Content[i].Style_Add_Open(default_legend_style.Id);
                    //content.Content[i].setTextPr(new ParaTextPr());
                }
            }
            var content = this.vAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.vAxisTitle.txBody.content.Styles.Style.length - 1;
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

    init2: function()
    {
        var is_on = History.Is_On();
        if(is_on)
            History.TurnOff();
        var xfrm = this.spPr.xfrm;
        if(isRealObject(this.parent) && isRealObject(this.parent.Extent) && isRealNumber(this.parent.Extent.W) &&isRealNumber(this.parent.Extent.H)
            && (!isRealNumber(xfrm.offX)||!isRealNumber(xfrm.offY)|| !isRealNumber(xfrm.extX)||!isRealNumber(xfrm.extY)))
        {
            if(!this.group)
            {
                xfrm.offX = 0;
                xfrm.offY = 0;
            }
            xfrm.extX = this.parent.Extent.W;
            xfrm.extY = this.parent.Extent.H;
        }
        if(isRealObject(this.parent) && isRealObject(this.parent.Extent))
        {
            this.parent.Extent.W = xfrm.extX;
            this.parent.Extent.H = xfrm.extY;
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
                if(this.chartTitle.txBody.content && this.chartTitle.txBody.shape instanceof CChartTitle)
                {
                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };
                    TextPr.Bold = true;
                    if(this.chartTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.chartTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.chartTitle.txBody.content.Styles = styles;
                    this.chartTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);
                }
                //this.chartTitle.txBody.content.Styles = this.chartTitle.getStyles();
                for(var i in title_str)
                    this.chartTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {
                if(this.chartTitle.txBody.content && this.chartTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.chartTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Jc = align_Center;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.chartTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.chartTitle.txBody.content.Styles = styles;
                    this.chartTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                var content = this.chartTitle.txBody.content;
                content.Parent = this.chartTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;
                    this.chartTitle.txBody.content.Content[i].Style_Add_Open(default_legend_style.Id);
                }
            }
            var content = this.chartTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.chartTitle.txBody.content.Styles.Style.length - 1;
            }

            this.chartTitle.txBody.content.Set_ApplyToAll(true);
            this.chartTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.chartTitle.txBody.content.Set_ApplyToAll(false);
            // this.chart.header.title = this.chartTitle.txBody.content.getTextString();TODO
        }

        if(isRealObject(this.hAxisTitle))
        {
            this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);

            //this.hAxisTitle.drawingObjects = this.drawingObjects;
            if(this.hAxisTitle.isEmpty())
            {
                var title_str = "X Axis";
                this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
                if(this.hAxisTitle.txBody.content && this.hAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.hAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;

                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.hAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.hAxisTitle.txBody.content.Styles = styles;
                    this.hAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                for(var i in title_str)
                    this.hAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {

                var content = this.hAxisTitle.txBody.content;
                content.Parent = this.hAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                if(this.hAxisTitle.txBody.content && this.hAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.hAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.hAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.hAxisTitle.txBody.content.Styles = styles;
                    this.hAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;
                    content.Content[i].Style_Add_Open(default_legend_style.Id);
                }

            }


            var content = this.hAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.hAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.hAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.hAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.hAxisTitle.txBody.content.Set_ApplyToAll(false);
        }

        if(isRealObject(this.vAxisTitle))
        {
            //this.chart.xAxis.title = "";
            this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);

            //  this.vAxisTitle.drawingObjects = this.drawingObjects;
            if(this.vAxisTitle.isEmpty())
            {
                var title_str = "Y Axis";
                this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
                if(this.vAxisTitle.txBody.content && this.vAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.vAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.vAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.vAxisTitle.txBody.content.Styles = styles;
                    this.vAxisTitle.txBody.content.Content[0].Style_Add_Open(default_legend_style.Id);

                }
                this.vAxisTitle.txBody.bodyPr.vert = (nVertTTvert270);

                for(var i in title_str)
                    this.vAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
            }
            else
            {
                this.vAxisTitle.txBody.bodyPr.setVert(nVertTTvert270);
                var content = this.vAxisTitle.txBody.content;

                if(this.vAxisTitle.txBody.content && this.vAxisTitle.txBody.shape instanceof CChartTitle)
                {

                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);

                    var TextPr = {FontFamily:{}};
                    TextPr.FontFamily.Name = "Calibri";
                    TextPr.Bold = true;
                    if(this.vAxisTitle.txBody.shape.getTitleType() === CHART_TITLE_TYPE_TITLE)
                        TextPr.FontSize = 18;
                    else
                        TextPr.FontSize = 10;
                    TextPr.RFonts = {};
                    TextPr.RFonts.Ascii =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.EastAsia =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.HAnsi =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    TextPr.RFonts.CS =
                    {
                        Name  : "Calibri",
                        Index : -1
                    };

                    default_legend_style.TextPr.Set_FromObject(TextPr);
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;

                    //TODO:ParaPr: default_legend_style.ParaPr.Ind
                    var tx_pr;
                    if(isRealObject(this.vAxisTitle.txBody.txPr))
                    {
                        //TODO
                    }
                    styles.Style[default_legend_style.Id] = default_legend_style;
                    this.vAxisTitle.txBody.content.Styles = styles;

                }

                content.Parent = this.vAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                for(var i = 0; i < content.Content.length; ++i)
                {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    content.Content[i].Parent = content;

                    this.vAxisTitle.txBody.content.Content[i].Style_Add_Open(default_legend_style.Id);
                    //content.Content[i].setTextPr(new ParaTextPr());
                }
            }
            var content = this.vAxisTitle.txBody.content;
            for(var i = 0; i < content.Content.length; ++i)
            {
                //content.Content[i].Pr.PStyle = this.vAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.vAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.vAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.vAxisTitle.txBody.content.Set_ApplyToAll(false);
            //this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
        }
        if(is_on)
            History.TurnOn();
    },

    getSelectedTitle: function()
    {
        if(this.chartTitle && this.chartTitle.selected)
        {
            return this.chartTitle;
        }
        else if(this.hAxisTitle && this.hAxisTitle.selected)
        {
            return this.hAxisTitle;
        }
        else if(this.vAxisTitle && this.vAxisTitle.selected)
        {
            return this.vAxisTitle;
        }
        return null;
    },

    calculateSnapArrays: function(snapArrayX, snapArrayY)
    {
        var t = this.transform;
        var _t = t;
        if(isRealObject(this.parent))
        {
            if(this.parent.Is_Inline())
            {
                if(this.parent.DocumentContent instanceof  CDocumentContent)
                {
                    var cur_doc_content = this.parent.DocumentContent;
                    while(cur_doc_content.Is_TableCellContent())
                    {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;

                    }
                    if((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape))
                    {
                        _t = t.CreateDublicate();
                        global_MatrixTransformer.MultiplyAppend(_t, cur_doc_content.Parent.transformText);
                    }
                }
            }
        }
        snapArrayX.push(_t.TransformPointX(0, 0));
        snapArrayY.push(_t.TransformPointY(0, 0));
        snapArrayX.push(_t.TransformPointX(this.absExtX, 0));
        snapArrayY.push(_t.TransformPointY(this.absExtX, 0));

        snapArrayX.push(t.TransformPointX(this.absExtX*0.5, this.absExtY*0.5));
        snapArrayY.push(t.TransformPointY(this.absExtX*0.5, this.absExtY*0.5))
        snapArrayX.push(_t.TransformPointX(this.absExtX, this.absExtY));
        snapArrayY.push(_t.TransformPointY(this.absExtX, this.absExtY));
        snapArrayX.push(_t.TransformPointX(0, this.absExtY));
        snapArrayY.push(_t.TransformPointY(0, this.absExtY));
    },

    hitToHandle: function(x, y, radius)
    {

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
        var result_x, result_y;
        result_x = t_x;
        result_y = t_y;
        if(isRealObject(this.parent))
        {
            if(this.parent.Is_Inline())
            {
                if(this.parent.DocumentContent instanceof  CDocumentContent)
                {
                    var cur_doc_content = this.parent.DocumentContent;
                    while(cur_doc_content.Is_TableCellContent())
                    {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;

                    }
                    if((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape))
                    {
                        var invert_matrix = cur_doc_content.Parent.invertTextMatrix;
                        result_x = invert_matrix.TransformPointX(t_x, t_y);
                        result_y = invert_matrix.TransformPointY(t_x, t_y);
                    }
                }
            }
        }

        var _radius;
        if(!(typeof radius === "number"))
            _radius = editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        else
            _radius = radius;

        if(typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM))
            _radius *= global_mouseEvent.KoefPixToMM;

        this.calculateLeftTopPoint();
        var _temp_x = result_x - this.absXLT;
        var _temp_y = result_y - this.absYLT;

        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);


        var _relative_x = _temp_x*_cos + _temp_y*_sin;
        var _relative_y = -_temp_x*_sin + _temp_y*_cos;

        if(this.absFlipH)
            _relative_x = this.absExtX - _relative_x;
        if(this.absFlipV)
            _relative_y = this.absExtY - _relative_y;

        var _dist_x, _dist_y;
        if(!this.checkLine())
        {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 0};
            }

            _dist_x = _relative_x - this.absExtX;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 2};
            }

            _dist_y = _relative_y - this.absExtY;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 4};
            }

            _dist_x = _relative_x;
            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: false, handleNum: 6};
            }

            if(this.absExtY >= MIN_SHAPE_DIST)
            {
                var _vertical_center = this.absExtY*0.5;
                _dist_x = _relative_x;
                _dist_y = _relative_y - _vertical_center;

                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 7};
                }

                _dist_x = _relative_x - this.absExtX;

                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 3};
                }
            }

            var _horizontal_center = this.absExtX*0.5;
            if(this.absExtX >= MIN_SHAPE_DIST)
            {
                _dist_x = _relative_x - _horizontal_center;
                _dist_y = _relative_y;
                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 1};
                }

                _dist_y = _relative_y - this.absExtY;
                if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
                {
                    return {hit: true, handleRotate: false, handleNum: 5};
                }
            }

            _dist_x = _relative_x - _horizontal_center;
            _dist_y = _relative_y + editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);

            if(Math.sqrt(_dist_x*_dist_x + _dist_y*_dist_y) < _radius)
            {
                return {hit: true, handleRotate: true, handleNum: 8};
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

            _dist_x = _relative_x - this.absExtX;
            _dist_y = _relative_y - this.absExtY;
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
            this.absOffsetX = offsetX;
        }

        if(offsetY != null)
        {
            this.absOffsetY = offsetY;
        }


        if(extX != null)
        {
            this.absExtX = extX;
        }

        if(extY != null)
        {
            this.absExtY = extY;
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
            this.recalcAllTitles();
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
        return tx > 0 && tx < this.absExtX && ty > 0 && ty < this.absExtY;
    },

    canGroup: function()
    {
        return true;
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
        var _horizontal_center = this.absExtX*0.5;
        var _vertical_enter = this.absExtY*0.5;
        var _sin = Math.sin(0);
        var _cos = Math.cos(0);
        this.absXLT = -_horizontal_center*_cos + _vertical_enter*_sin +this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center*_sin - _vertical_enter*_cos +this.absOffsetY + _vertical_enter;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.absExtX != 0 ? this.absExtX : 0.1;
        var _tmp_y = this.absExtY != 0 ? this.absExtY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },

    getCardDirectionByNum: function(num)
    {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        return ((num - num_north) + CARD_DIRECTION_N + 8)%8;

    },

    getNumByCardDirection: function(cardDirection)
    {
        var hc = this.absExtX*0.5;
        var vc = this.absExtY*0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.absExtX, vc);
        y5 = transform.TransformPointY(hc, this.absExtY);
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
        cx= this.absExtX > 0 ? this.absExtX : 0.01;
        cy= this.absExtY > 0 ? this.absExtY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = x - this.absOffsetX;//invert_transform.TransformPointX(x, y);
        var t_y = y - this.absOffsetY;//invert_transform.TransformPointY(x, y);

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
        var w = this.absExtX;
        var h = this.absExtY;
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

        hc = this.absExtX*0.5;
        vc = this.absExtY*0.5;

        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
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
        if((x5 - x1)*(y3-y7) - (y5-y1)*(x3-x7) < 0)
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

        hc=this.absExtX*0.5;
        vc=this.absExtY*0.5;

        sin=Math.sin(this.absRot);
        cos=Math.cos(this.absRot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
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
        if((x5 - x1)*(y3-y7) - (y5-y1)*(x3-x7) < 0)
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

    normalizeXfrm2: function(kw, kh)
    {
        var xfrm = this.spPr.xfrm;
        xfrm.offX *= kw;
        xfrm.offY *= kh;
        xfrm.extX *= kw;
        xfrm.extY *= kh;
    },

    calculateAfterOpenInGroup: function()
    {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.parent = new ParaDrawing(null, null, this, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        this.parent.Set_GraphicObject(this);
        this.init2();
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if(this.spPr.geometry)
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
    },

    calculateAfterOpenInGroup2: function()
    {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.init();
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if(this.spPr.geometry)
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
    },

    setGroupAfterOpen: function(group)
    {
        this.group = group;
    },

    setMainGroup: function(group)
    {
        var data = {};
        data.Type = historyitem_SetMainGroup;
        data.oldGroup = this.mainGroup;
        data.newGroup = group;
        History.Add(this, data);
        this.mainGroup = group;
    },

    recalculateDocContent: function()
    {
        this.recalculate();
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetMainGroup:
            {
                this.mainGroup = data.oldGroup;
                break;
            }
            case historyitem_SetGroup:
            {
                this.group = data.oldGroup;
                break;
            }
            case historyitem_AutoShapes_RecalculateChartUndo:
            {
                this.recalculate();
                break;
            }
            case historyitem_SetParent:
            {
                if(data.oldParent == null)
                    this.parent = null;
                else
                    this.parent = g_oTableId.Get_ById(data.oldParent);
                break;
            }
            case historyitem_SetSizes:
            {
                this.spPr.xfrm.extX = data.oldW;
                this.spPr.xfrm.extY = data.oldH;
                //this.spPr.xfrm.flipH = data.oldFlipH;
                //this.spPr.xfrm.flipV = data.oldFlipV;
                this.absExtX = data.oldW;
                this.absExtY = data.oldH;
                //this.absFlipH = data.oldFlipH;
                //this.absFlipV = data.oldFlipV;
                this.absOffsetX = data.oldPosX;
                this.absOffsetY = data.oldPosY;
                if(this.parent)
                {
                    this.parent.absOffsetX = data.oldPosX;
                    this.parent.absOffsetY = data.oldPosY;
                    this.parent.absExtX = data.oldW;
                    this.parent.absExtY = data.oldH;
                    //this.parent.flipH = data.oldFlipH;
                    //this.parent.flipV = data.oldFlipV;
                }

                this.calculateAfterResize();
                break;
            }
            case historyitem_AutoShapes_AddXAxis:
            {
                this.hAxisTitle = g_oTableId.Get_ById(data.oldPr);
                break;
            }
            case historyitem_AutoShapes_AddYAxis:
            {
                this.vAxisTitle = g_oTableId.Get_ById(data.oldPr);
                break;
            }
            case historyitem_AutoShapes_AddTitle:
            {
                this.chartTitle = g_oTableId.Get_ById(data.oldPr);
                break;
            }
            case historyitem_AutoShapes_AddChart:
            {
                this.chart = data.oldPr;
                break;
            }
            case historyitem_SetSetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }

            case historyitem_SetXfrmShape:
            {
                var xfrm = this.spPr.xfrm;
                if(typeof data.oldOffsetX === "number")
                    xfrm.offX = data.oldOffsetX;

                if(typeof data.oldOffsetY === "number")
                    xfrm.offY = data.oldOffsetY;

                if(typeof data.oldExtX === "number")
                    xfrm.extX = data.oldExtX;

                if(typeof data.oldExtY === "number")
                    xfrm.extY = data.oldExtY;

                if(typeof data.oldRot === "number")
                    xfrm.rot = data.oldRot;

                if(data.oldFlipH != null)
                    xfrm.flipH = data.oldFlipH;
                if(data.oldFlipV != null)
                    xfrm.flipV = data.oldFlipV;

                if(typeof data.oldExtX === "number" || typeof data.oldExtY === "number")
                {
                    if(this.spPr.geometry)
                        this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
                var posX, posY;
                if(this.group == null)
                {
                    posX = null;
                    posY = null;
                }
                else
                {
                    posX = xfrm.offX;
                    posY = xfrm.offY;
                }
                this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        var writer = w;
        w.WriteLong(historyitem_type_Chart);
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_SetXfrmShape:
            {
                bool = typeof data.newOffsetX === "number";
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteDouble(data.newOffsetX);
                }

                bool = typeof data.newOffsetY === "number";
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteDouble(data.newOffsetY);
                }


                bool = typeof data.newExtX === "number";
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteDouble(data.newExtX);
                }

                bool = typeof data.newExtY === "number";
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteDouble(data.newExtY);
                }

                bool = typeof data.newRot === "number";
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteDouble(data.newRot);
                }

                bool = data.newFlipH != null;
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteBool(data.newFlipH);
                }

                bool = data.newFlipV != null;
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteBool(data.newFlipV);
                }
                break;
            }
            case historyitem_SetParent:
            {
                writer.WriteBool(data.newParent != null);
                if(data.newParent != null)
                {
                    writer.WriteString2(data.newParent);
                }
                break;
            }
            case historyitem_SetSizes:
            {
                writer.WriteDouble(data.newPosX);
                writer.WriteDouble(data.newPosY);
                writer.WriteDouble(data.newW);
                writer.WriteDouble(data.newH);
                writer.WriteBool(data.newFlipH);
                writer.WriteBool(data.newFlipV);
                break;
            }
            case historyitem_AutoShapes_AddXAxis:
            case historyitem_AutoShapes_AddYAxis:
            case historyitem_AutoShapes_AddTitle:
            {
                w.WriteBool(typeof data.newPr === "string");
                if(typeof data.newPr === "string")
                    w.WriteString2(data.newPr);
                break;
            }
            case historyitem_SetSetSpPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    data.newPr.Write_ToBinary2(w);
                }
                break;
            }
            case historyitem_AutoShapes_AddChart:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    data.newPr.Write_ToBinary2(w);
                }
                break;
            }
            case historyitem_SetGroup:
            case historyitem_SetMainGroup:
            {
                bool = data.newGroup != null;
                writer.WriteBool(bool);
                if(bool)
                {
                    writer.WriteString2(data.newGroup.Get_Id());
                }
                break;
            }

        }
    },

    Load_Changes: function(reader)
    {
        var ClassType = reader.GetLong();
        if ( historyitem_type_Chart != ClassType )
            return;
        var r = reader;
        var type = reader.GetLong();
        switch(type)
        {
            case historyitem_SetMainGroup:
            {
                if(reader.GetBool())
                {
                    this.mainGroup = g_oTableId.Get_ById(reader.GetString2());
                }
                else
                {
                    this.mainGroup = null;
                }
                break;
            }
            case historyitem_SetGroup:
            {
                if(reader.GetBool())
                {
                    this.group = g_oTableId.Get_ById(reader.GetString2());
                }
                else
                {
                    this.group = null;
                }
                break;
            }
            case historyitem_AutoShapes_RecalculateChartRedo:
            {
                this.recalculate();
                break;
            }
            case historyitem_CalculateAfterCopyInGroup:
            {
                this.recalculate();
            }
            case historyitem_SetXfrmShape:
            {
                var xfrm = this.spPr.xfrm;
                if(reader.GetBool())
                {
                    xfrm.offX = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    xfrm.offY = reader.GetDouble();
                }


                if(reader.GetBool())
                {
                    xfrm.extX = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    xfrm.extY = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    xfrm.rot = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    xfrm.flipH = reader.GetBool();
                }

                if(reader.GetBool())
                {
                    xfrm.flipV = reader.GetBool();
                }


                if(this.spPr.geometry)
                    this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                var posX, posY;
                if(this.group == null)
                {
                    posX = null;
                    posY = null;
                }
                else
                {
                    posX = xfrm.offX;
                    posY = xfrm.offY;
                }
                this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
                break;
            }
            case historyitem_SetParent:
            {
                if(reader.GetBool())
                {
                    this.parent = g_oTableId.Get_ById(reader.GetString2());
                }
                else
                {
                    this.parent = null;
                }
                break;
            }
            case historyitem_SetSizes:
            {
                var posX = reader.GetDouble();
                var posY = reader.GetDouble();
                var extX = reader.GetDouble();
                var extY = reader.GetDouble();
                var flipH = reader.GetBool();
                var flipV = reader.GetBool();
                this.spPr.xfrm.extX = extX;
                this.spPr.xfrm.extY = extY;
                //this.spPr.xfrm.flipH = flipH;
                //this.spPr.xfrm.flipV = flipV;
                this.absExtX = extX;
                this.absExtY = extY;
                //this.absFlipH = flipH;
                //this.absFlipV = flipV;
                this.absOffsetX = posX;
                this.absOffsetY = posY;
                if(this.parent)
                {
                    this.parent.absOffsetX = posX;
                    this.parent.absOffsetY = posY;
                    this.parent.absExtX = extX;
                    this.parent.absExtY = extY;
                    //this.parent.absFlipH = flipH;
                    //this.parent.absFlipV = flipV;
                }

                this.calculateAfterResize();
                break;
            }
            case historyitem_AutoShapes_AddXAxis:
            {
                if(r.GetBool())
                {
                    this.hAxisTitle = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.hAxisTitle = null;
                }
                break;
            }
            case historyitem_AutoShapes_AddYAxis:
            {
                if(r.GetBool())
                {
                    this.vAxisTitle = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.vAxisTitle = null;
                }
                break;
            }
            case historyitem_AutoShapes_AddTitle:
            {
                if(r.GetBool())
                {
                    this.chartTitle = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.chartTitle = null;
                }
                break;
            }
            case historyitem_SetSetSpPr:
            {

                this.spPr = new CSpPr();
                if(r.GetBool())
                {
                    this.spPr.Read_FromBinary2(r);
                }
                break;
            }
            case historyitem_AutoShapes_AddChart:
            {
                if(r.GetBool())
                {
                    g_oTableId.m_bTurnOff = true;
                    this.chart = new asc_CChart();
                    g_oTableId.m_bTurnOff = false;
                    //r.GetLong();
                    this.chart.Read_FromBinary2(r);
                }
                else
                {
                    this.chart = null;
                }
                break;
            }
            case historyitem_AutoShapes_RecalculateAfterResize:
            {
                this.recalculatePosExt();

                this.recalcAllTitles();
                this.init();
                this.recalculate();
                if(this.parent)
                {
                    this.recalcAllTitles();
                    editor.WordControl.m_oLogicDocument.DrawingObjects.arrForCalculateAfterOpen.push(this.parent);
                }
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetMainGroup:
            {
                this.mainGroup = data.newGroup;
                break;
            }
            case historyitem_SetGroup:
            {
                this.group = data.newGroup;
                break;
            }
            case historyitem_AutoShapes_RecalculateChartRedo:
            {
                this.recalculate();
                break;
            }
            case historyitem_SetSizes:
            {
                this.spPr.xfrm.extX = data.oldW;
                this.spPr.xfrm.extY = data.oldH;
                //this.spPr.xfrm.flipH = data.oldFlipH;
                //this.spPr.xfrm.flipV = data.oldFlipV;
                this.absExtX = data.oldW;
                this.absExtY = data.oldH;
                //this.absFlipH = data.oldFlipH;
                //this.absFlipV = data.oldFlipV;
                this.absOffsetX = data.oldPosX;
                this.absOffsetY = data.oldPosY;
                if(this.parent)
                {
                    this.parent.absOffsetX = data.oldPosX;
                    this.parent.absOffsetY = data.oldPosY;
                    this.parent.absExtX = data.oldW;
                    this.parent.absExtY = data.oldH;
                    //this.parent.flipH = data.oldFlipH;
                    //this.parent.flipV = data.oldFlipV;
                }

                this.calculateAfterResize();
                break;
            }
            case historyitem_SetXfrmShape:
            {
                var xfrm = this.spPr.xfrm;
                if(typeof data.newOffsetX === "number")
                    xfrm.offX = data.newOffsetX;

                if(typeof data.newOffsetY === "number")
                    xfrm.offY = data.newOffsetY;

                if(typeof data.newExtX === "number")
                    xfrm.extX = data.newExtX;

                if(typeof data.newExtY === "number")
                    xfrm.extY = data.newExtY;

                if(typeof data.newRot === "number")
                    xfrm.rot = data.newRot;

                if(data.newFlipH != null)
                    xfrm.flipH = data.newFlipH;
                if(data.newFlipV != null)
                    xfrm.flipV = data.newFlipV;

                if(typeof data.newExtX === "number" || typeof data.newExtY === "number")
                {
                    if(this.spPr.geometry)
                        this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
                var posX, posY;
                if(this.group == null)
                {
                    posX = null;
                    posY = null;
                }
                else
                {
                    posX = xfrm.offX;
                    posY = xfrm.offY;
                }
                this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
                break;
            }
            case historyitem_AutoShapes_AddXAxis:
            {
                this.hAxisTitle = g_oTableId.Get_ById(data.newPr);
                break;
            }
            case historyitem_AutoShapes_AddYAxis:
            {
                this.vAxisTitle = g_oTableId.Get_ById(data.newPr);
                break;
            }
            case historyitem_AutoShapes_AddTitle:
            {
                this.chartTitle = g_oTableId.Get_ById(data.newPr);
                break;
            }
            case historyitem_AutoShapes_AddChart:
            {
                this.chart = data.newPr;
                break;
            }
            case historyitem_SetSetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_SetParent:
            {
                if(data.newParent == null)
                    this.parent = null;
                else
                    this.parent = g_oTableId.Get_ById(data.newParent);
                break;
            }
        }
    },


    recalcAllTitles: function()
    {
        if(this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content)
        {
            var content = this.chartTitle.txBody.content.Content;
            for(var i = 0; i < content.length; ++i)
            {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }

        if(this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content)
        {
            var content = this.hAxisTitle.txBody.content.Content;
            for(var i = 0; i < content.length; ++i)
            {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }
        if(this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content)
        {
            var content = this.vAxisTitle.txBody.content.Content;
            for(var i = 0; i < content.length; ++i)
            {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }
    },

    getChartBinary: function()
    {
        this.syncAscChart();
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
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.readFromBinary(r);
        }

        if(r.GetBool())
        {
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.readFromBinary(r);
        }
        if(r.GetBool())
        {
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.readFromBinary(r);
        }
        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart();
        g_oTableId.m_bTurnOff = false;

        chart.Read_FromBinary2(r, true);
        this.setAscChart(chart);
        this.spPr.Read_FromBinary2(r);
        if(isRealObject(this.parent))
        {
            this.parent.Extent.W = this.spPr.xfrm.extX;
            this.parent.Extent.H = this.spPr.xfrm.extY;
        }
        this.init();
    },

    addXAxis: function(title)
    {
        var oldValue = isRealObject(this.hAxisTitle) ? this.hAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.hAxisTitle = title;
        History.Add(this, {Type: historyitem_AutoShapes_AddXAxis, oldPr: oldValue, newPr: newValue});
    },

    addYAxis: function(title)
    {
        var oldValue = isRealObject(this.vAxisTitle) ? this.vAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.vAxisTitle = title;
        History.Add(this, {Type: historyitem_AutoShapes_AddYAxis, oldPr: oldValue, newPr: newValue});
    },

    addTitle: function(title)
    {
        var oldValue = isRealObject(this.chartTitle) ? this.chartTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.chartTitle = title;
        History.Add(this, {Type: historyitem_AutoShapes_AddTitle, oldPr: oldValue, newPr: newValue});
    },


    setSpPr: function(spPr)
    {
        History.Add(this, {Type:historyitem_SetSetSpPr, oldPr: this.spPr, newPr: spPr});
        this.spPr = spPr;
    },


    setChartBinary: function(binary)
    {

        var r = CreateBinaryReader(binary, 0, binary.length);
        if(r.GetBool())
        {
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.readFromBinary(r);
        }
        else
        {
            this.addTitle(null);
        }

        if(r.GetBool())
        {
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.readFromBinary(r);
        }
        else
        {
            this.addYAxis(null);
        }
        if(r.GetBool())
        {
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.readFromBinary(r);
        }
        else
        {
            this.addXAxis(null);
        }


        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart();
        g_oTableId.m_bTurnOff = false;


        chart.Read_FromBinary2(r, true);
        this.setAscChart(chart);
        var spPr = new CSpPr();
        spPr.Read_FromBinary2(r);
        this.setSpPr(spPr);
        if(isRealObject(this.parent))
        {
            this.parent.setExtent(this.spPr.xfrm.extX, this.spPr.xfrm.extY);
        }
        this.init();
        this.recalculate();
        History.Add(this, {Type: historyitem_AutoShapes_RecalculateAfterResize});

    },

    copy: function(parent, group)
    {
        return this.copy3(parent, group);
        var _group = isRealObject(group) ? group : null;
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, _group);
        c.setChartBinary(this.getChartBinary());
        return c;
    },

    copy3: function(parent, group)
    {
        var _group = isRealObject(group) ? group : null;
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, _group);
        //var r = CreateBinaryReader(binary, 0, binary.length);
        if(this.chartTitle)
        {
            c.addTitle(this.chartTitle.copy(c, CHART_TITLE_TYPE_TITLE));
        }
        else
        {
            c.addTitle(null);
        }

        if(this.vAxisTitle)
        {
            c.addYAxis(this.vAxisTitle.copy(c, CHART_TITLE_TYPE_V_AXIS));
        }
        else
        {
            c.addYAxis(null);
        }
        if(this.hAxisTitle)
        {
            c.addXAxis(this.hAxisTitle.copy(c, CHART_TITLE_TYPE_H_AXIS));
        }
        else
        {
            c.addXAxis(null);
        }
        c.setSpPr(this.spPr.createDuplicate());
        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart(this.chart);
        g_oTableId.m_bTurnOff = false;
        c.setAscChart(chart);
        if(isRealObject(c.parent))
        {
            c.parent.setExtent(c.spPr.xfrm.extX, c.spPr.xfrm.extY);
        }
        History.Add(this, {Type: historyitem_AutoShapes_RecalculateAfterResize});
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

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_Chart);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    }

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