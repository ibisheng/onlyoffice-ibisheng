"use strict";

function getChartTranslateManager()
{
    return editor.chartTranslate;
}


CChartSpace.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CChartSpace.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CChartSpace.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CChartSpace.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CChartSpace.prototype.setParent2 = CShape.prototype.setParent2;
CChartSpace.prototype.getDrawingObjectsController = CShape.prototype.getDrawingObjectsController;
CChartSpace.prototype.handleUpdateTheme = CShape.prototype.handleUpdateTheme;
CChartSpace.prototype.getIsSingleBody = CShape.prototype.getIsSingleBody;
CChartSpace.prototype.getSlideIndex = CShape.prototype.getSlideIndex;


CChartSpace.prototype.recalculateTransform = function()
{
    CShape.prototype.recalculateTransform.call(this);
    this.localTransform.Reset();
};
CChartSpace.prototype.recalcText = function()
{
    this.recalcInfo.recalculateAxisLabels = true;
    this.recalcTitles2();
    this.handleUpdateInternalChart();
};

CChartSpace.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.hitToHandles = CShape.prototype.hitToHandles;
CChartSpace.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CChartSpace.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CChartSpace.prototype.getInvertTransform = CShape.prototype.getInvertTransform;
CChartSpace.prototype.hit = CShape.prototype.hit;
CChartSpace.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CChartSpace.prototype.hitInPath = CShape.prototype.hitInPath;
CChartSpace.prototype.hitInTextRect = CShape.prototype.hitInTextRect;
CChartSpace.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CChartSpace.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CChartSpace.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CChartSpace.prototype.check_bounds = CShape.prototype.check_bounds;
CChartSpace.prototype.normalize = CShape.prototype.normalize;
CChartSpace.prototype.getFullFlipH = CShape.prototype.getFullFlipH;
CChartSpace.prototype.getFullFlipV = CShape.prototype.getFullFlipV;
CChartSpace.prototype.setWorksheet = CShape.prototype.setWorksheet;
CChartSpace.prototype.handleUpdateLn = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.addToRecalculate();
};
CChartSpace.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalcTitle: null,
        bRecalculatedTitle: false,
        recalculateTransform: true,
        recalculateBounds:    true,
        recalculateChart:     true,
        recalculateBaseColors: true,
        recalculateSeriesColors: true,
        recalculateMarkers: true,
        recalculateGridLines: true,
        recalculateDLbls: true,
        recalculateAxisLabels: true,
        dataLbls:[],
        axisLabels: [],
        recalculateAxisVal: true,
        recalculateAxisTickMark: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculatePlotAreaBrush: true,
        recalculatePlotAreaPen: true,
        recalculateHiLowLines: true,
        recalculateUpDownBars: true,
        recalculateLegend: true,
        recalculateReferences: true,
        recalculateBBox: true,
        recalculateFormulas: true,
        recalculatePenBrush: true,
        recalculateTextPr : true,
        recalculateBBoxRange: true
    };
    this.baseColors = [];
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
    this.chartObj = null;
    this.rectGeometry = ExecuteNoHistory(function(){return  CreateGeometry("rect");},  this, []);
    this.lockType = c_oAscLockTypes.kLockTypeNone;
};
CChartSpace.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CChartSpace.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CChartSpace.prototype.recalcChart = function()
{
    this.recalcInfo.recalculateChart = true;
};
CChartSpace.prototype.recalcBaseColors = function()
{
    this.recalcInfo.recalculateBaseColors = true;
};
CChartSpace.prototype.recalcSeriesColors = function()
{
    this.recalcInfo.recalculateSeriesColors = true;
};

CChartSpace.prototype.recalcDLbls = function()
{
    this.recalcInfo.recalculateDLbls = true;
};

CChartSpace.prototype.addToRecalculate = CShape.prototype.addToRecalculate;

CChartSpace.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.recalcBounds();
    //  this.recalcDLbls();
    //this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateExtents = function()
{
    this.recalcChart();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcTitles();
    this.handleUpdateInternalChart();
};
CChartSpace.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    //this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateChart = function()
{
    this.recalcChart();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateStyle = function()
{
    this.recalcInfo.recalculateSeriesColors = true;
    this.recalcInfo.recalculateLegend = true;
    this.recalcInfo.recalculatePlotAreaBrush = true;
    this.recalcInfo.recalculatePlotAreaPen = true;
    this.recalcInfo.recalculateBrush = true;
    this.recalcInfo.recalculatePen = true;
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateFill = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.recalcInfo.recalculateChart = true;
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateLn = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.recalcInfo.recalculateChart = true;
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.canGroup = CShape.prototype.canGroup;
CChartSpace.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CChartSpace.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CChartSpace.prototype.getHierarchy = CShape.prototype.getHierarchy;
CChartSpace.prototype.getParentObjects = CShape.prototype.getParentObjects;
CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateChart = function()
{
    if(this.chartObj == null)
        this.chartObj =  new CChartsDrawer();
    this.chartObj.reCalculate(this);
};
CChartSpace.prototype.canResize = CShape.prototype.canResize;
CChartSpace.prototype.canMove = CShape.prototype.canMove;
CChartSpace.prototype.canRotate = function()
{
    return false;
};


CChartSpace.prototype.createResizeTrack = CShape.prototype.createResizeTrack;
CChartSpace.prototype.createMoveTrack = CShape.prototype.createMoveTrack;
CChartSpace.prototype.getAspect = CShape.prototype.getAspect;
CChartSpace.prototype.getRectBounds = CShape.prototype.getRectBounds;

CChartSpace.prototype.recalculateBounds = function()
{
    var transform = this.transform;
    var a_x = [];
    var a_y = [];
    a_x.push(transform.TransformPointX(0, 0));
    a_y.push(transform.TransformPointY(0, 0));
    a_x.push(transform.TransformPointX(this.extX, 0));
    a_y.push(transform.TransformPointY(this.extX, 0));
    a_x.push(transform.TransformPointX(this.extX, this.extY));
    a_y.push(transform.TransformPointY(this.extX, this.extY));
    a_x.push(transform.TransformPointX(0, this.extY));
    a_y.push(transform.TransformPointY(0, this.extY));
    this.bounds.l = Math.min.apply(Math, a_x);
    this.bounds.t = Math.min.apply(Math, a_y);
    this.bounds.r = Math.max.apply(Math, a_x);
    this.bounds.b = Math.max.apply(Math, a_y);
    this.bounds.w = this.bounds.r - this.bounds.l;
    this.bounds.h = this.bounds.b - this.bounds.t;
    this.bounds.x = this.bounds.l;
    this.bounds.y = this.bounds.t;
};




CChartSpace.prototype.recalculate = function()
{
    if(this.bDeleted || !this.parent)
        return;
    ExecuteNoHistory(function()
    {
        this.updateLinks();

        if(this.recalcInfo.recalcTitle)
        {
            this.recalculateChartTitleEditMode();
            this.recalcInfo.recalcTitle.updatePosition(this.transform.tx, this.transform.ty);
            this.recalcInfo.recalcTitle = null;
            this.recalcInfo.bRecalculatedTitle = true;
        }
        var b_transform = false;
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.rectGeometry.Recalculate(this.extX, this.extY);
            this.recalcInfo.recalculateTransform = false;
            this.calculateSnapArrays();
            b_transform = true;
        }
        if(this.recalcInfo.recalculateReferences)
        {
            this.recalculateReferences();
            this.recalcInfo.recalculateReferences = false;
        }
        if(this.recalcInfo.recalculateBBox)
        {
            this.recalculateBBox();
            this.recalcInfo.recalculateBBox = false;
        }
        if(this.recalcInfo.recalculateBaseColors)
        {
            this.recalculateBaseColors();
            this.recalcInfo.recalculateBaseColors = false;
        }
        if(this.recalcInfo.recalculateMarkers)
        {
            this.recalculateMarkers();
            this.recalcInfo.recalculateMarkers = false;
        }
        if(this.recalcInfo.recalculateSeriesColors)
        {
            this.recalculateSeriesColors();
            this.recalcInfo.recalculateSeriesColors = false;
        }
        if(this.recalcInfo.recalculateGridLines)
        {
            this.recalculateGridLines();
            this.recalcInfo.recalculateGridLines = false;
        }
        if(this.recalcInfo.recalculateAxisTickMark)
        {
            this.recalculateAxisTickMark();
            this.recalcInfo.recalculateAxisTickMark = false;
        }
        if(this.recalcInfo.recalculateDLbls)
        {
            this.recalculateDLbls();
            this.recalcInfo.recalculateDLbls = false;
        }

        if(this.recalcInfo.recalculateBrush)
        {
            this.recalculateChartBrush();
            this.recalcInfo.recalculateBrush = false;
        }

        if(this.recalcInfo.recalculatePen)
        {
            this.recalculateChartPen();
            this.recalcInfo.recalculatePen = false;
        }

        if(this.recalcInfo.recalculateHiLowLines)
        {
            this.recalculateHiLowLines();
            this.recalcInfo.recalculateHiLowLines = false;
        }
        if(this.recalcInfo.recalculatePlotAreaBrush)
        {
            this.recalculatePlotAreaChartBrush();
            this.recalcInfo.recalculatePlotAreaBrush = false;
        }
        if(this.recalcInfo.recalculatePlotAreaPen)
        {
            this.recalculatePlotAreaChartPen();
            this.recalcInfo.recalculatePlotAreaPen = false;
        }
        if(this.recalcInfo.recalculateUpDownBars)
        {
            this.recalculateUpDownBars();
            this.recalcInfo.recalculateUpDownBars = false;
        }


        var b_recalc_legend = false;
        if(this.recalcInfo.recalculateLegend)
        {
            this.recalculateLegend();
            this.recalcInfo.recalculateLegend = false;
            b_recalc_legend = true;
        }

        var b_recalc_labels = false;
        if(this.recalcInfo.recalculateAxisLabels)
        {
            this.recalculateAxisLabels();
            this.recalcInfo.recalculateAxisLabels = false;
            b_recalc_labels = true;
        }

        if(this.recalcInfo.recalculateAxisVal)
        {
            this.recalculateAxis();
            this.recalcInfo.recalculateAxisVal = false;
        }



        if(this.recalcInfo.recalculatePenBrush)
        {
            this.recalculatePenBrush();
            this.recalcInfo.recalculatePenBrush = false;
        }

        if(this.recalcInfo.recalculateChart)
        {
            this.recalculateChart();
            this.recalcInfo.recalculateChart = false;
        }


        for(var i = 0; i < this.recalcInfo.dataLbls.length; ++i)
        {
            var series = this.chart.plotArea.chart.series;
            if(this.recalcInfo.dataLbls[i].series && this.recalcInfo.dataLbls[i].pt)
            {

                var ser_idx = this.recalcInfo.dataLbls[i].series.idx; //сделаем проверку лежит ли серия с индексом this.recalcInfo.dataLbls[i].series.idx в сериях первой диаграммы
                for(var j = 0;  j < series.length; ++j)
                {
                    if(series[j].idx === this.recalcInfo.dataLbls[i].series.idx)
                    {
                        var pos = this.chartObj.reCalculatePositionText("dlbl", this, /*this.recalcInfo.dataLbls[i].series.idx todo здесь оставить как есть в chartDrawere выбирать серии по индексу*/j, this.recalcInfo.dataLbls[i].pt.idx);//
                        this.recalcInfo.dataLbls[i].setPosition(pos.x, pos.y);
                        break;
                    }
                }
            }
        }
        this.recalcInfo.dataLbls.length = 0;

        if(b_recalc_labels)
        {
            if(this.chart && this.chart.title)
            {
                var pos = this.chartObj.reCalculatePositionText("title", this, this.chart.title);
                this.chart.title.setPosition(pos.x, pos.y);
            }

            if(this.chart && this.chart.plotArea && this.chart.plotArea)
            {
                var hor_axis = this.chart.plotArea.getHorizontalAxis();
                if(hor_axis && hor_axis.title)
                {
                    var old_cat_ax = this.chart.plotArea.catAx;
                    this.chart.plotArea.catAx = hor_axis;
                    var pos = this.chartObj.reCalculatePositionText("catAx", this, hor_axis.title);
                    hor_axis.title.setPosition(pos.x, pos.y);

                    this.chart.plotArea.catAx = old_cat_ax;
                }
                var vert_axis = this.chart.plotArea.getVerticalAxis();
                if(vert_axis && vert_axis.title)
                {
                    var old_val_ax = this.chart.plotArea.valAx;
                    this.chart.plotArea.valAx = vert_axis;
                    var pos = this.chartObj.reCalculatePositionText("valAx", this, vert_axis.title);
                    vert_axis.title.setPosition(pos.x, pos.y);
                    this.chart.plotArea.valAx = old_val_ax;
                }
            }
        }

        if(b_recalc_legend && this.chart && this.chart.legend)
        {
            var pos = this.chartObj.reCalculatePositionText("legend", this, this.chart.legend);
            this.chart.legend.setPosition(pos.x, pos.y);
        }

        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }

        if(this.recalcInfo.recalculateTextPr)
        {
            this.recalculateTextPr();
            this.recalcInfo.recalculateTextPr = false;
        }
        // if(b_transform)
        {
            this.updateChildLabelsTransform(this.transform.tx, this.transform.ty);
        }
        this.recalcInfo.dataLbls.length = 0;
        this.recalcInfo.axisLabels.length = 0;
        this.bNeedUpdatePosition = true;

    }, this, []);
};



CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.getDrawingDocument = CShape.prototype.getDrawingDocument;
CChartSpace.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;

CChartSpace.prototype.Get_Theme = CShape.prototype.Get_Theme;
CChartSpace.prototype.Get_ColorMap = CShape.prototype.Get_ColorMap;

CTable.prototype.Get_TableOffsetCorrection = function()
{
    return 0;
};

CTable.prototype.Selection_Draw_Page = function(Page_abs)
{
    if ( false === this.Selection.Use )
        return;

    var CurPage = Page_abs - this.Get_StartPage_Absolute();
    if ( CurPage < 0 || CurPage >= this.Pages.length )
        return;

    switch( this.Selection.Type )
    {
        case table_Selection_Cell:
        {
            var Row_prev_index = -1;
            for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
            {
                var Pos = this.Selection.Data[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell( Pos.Cell );
                var CellInfo = Row.Get_CellInfo( Pos.Cell );
                var CellMar = Cell.Get_Margins();

                if ( -1 === Row_prev_index || Row_prev_index != Pos.Row )
                    Row_prev_index = Pos.Row;

                var X_start = CellInfo.X_cell_start;
                var X_end   = CellInfo.X_cell_end;

                var Cell_Pages   = Cell.Content_Get_PagesCount();
                var Cell_PageRel = Page_abs - Cell.Content.Get_StartPage_Absolute();
                if ( Cell_PageRel < 0 || Cell_PageRel >= Cell_Pages )
                    continue;

                var Bounds = Cell.Content_Get_PageBounds( Cell_PageRel );
                var Y_offset = Cell.Temp.Y_VAlign_offset[Cell_PageRel];

                if ( 0 != Cell_PageRel )
                {
                    // мы должны определить ряд, на котором случился перенос на новую страницу
                    var TempRowIndex = this.Pages[CurPage].FirstRow;
                    this.DrawingDocument.AddPageSelection( Page_abs, X_start, this.RowsInfo[TempRowIndex].Y[CurPage] + this.RowsInfo[TempRowIndex].TopDy[CurPage] +  Y_offset, X_end - X_start, this.RowsInfo[TempRowIndex].H[CurPage] );
                }
                else
                {
                    this.DrawingDocument.AddPageSelection( Page_abs, X_start, this.RowsInfo[Pos.Row].Y[CurPage] + this.RowsInfo[Pos.Row].TopDy[CurPage] +  Y_offset, X_end - X_start, this.RowsInfo[Pos.Row].H[CurPage] );
                }
            }
            break;
        }
        case table_Selection_Text:
        {
            var Cell = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell( this.Selection.StartPos.Pos.Cell );
            Cell.Content.Selection_Draw_Page(Page_abs);

            break;
        }
    }
};

CStyle.prototype.Create_NormalTable = function()
{
    var TablePr =
    {
        TableInd :
        {
            W    : 0,
            Type : tblwidth_Mm
        },
        TableCellMar :
        {
            Top :
            {
                W    : 1.27,
                Type : tblwidth_Mm
            },

            Left :
            {
                W    : 2.54, // 5.4pt
                Type : tblwidth_Mm
            },

            Bottom :
            {
                W    : 1.27,
                Type : tblwidth_Mm
            },

            Right :
            {
                W    : 2.54, // 5.4pt
                Type : tblwidth_Mm
            }
        }
    };

    this.Set_UiPriority( 99 );
    this.Set_SemiHidden( true );
    this.Set_UnhideWhenUsed( true );
    this.Set_TablePr( TablePr );
};

CTablePr.prototype.Init_Default = function()
{
    this.TableStyleColBandSize = 1;
    this.TableStyleRowBandSize = 1;
    this.Jc                    = align_Left;
    this.Shd                   = new CDocumentShd();
    this.TableBorders.Bottom   = new CDocumentBorder();
    this.TableBorders.Left     = new CDocumentBorder();
    this.TableBorders.Right    = new CDocumentBorder();
    this.TableBorders.Top      = new CDocumentBorder();
    this.TableBorders.InsideH  = new CDocumentBorder();
    this.TableBorders.InsideV  = new CDocumentBorder();
    this.TableCellMar.Bottom   = new CTableMeasurement(tblwidth_Mm, 1.27);
    this.TableCellMar.Left     = new CTableMeasurement(tblwidth_Mm, 2.54/*5.4 * g_dKoef_pt_to_mm*/); // 5.4pt
    this.TableCellMar.Right    = new CTableMeasurement(tblwidth_Mm, 2.54/*5.4 * g_dKoef_pt_to_mm*/); // 5.4pt
    this.TableCellMar.Top      = new CTableMeasurement(tblwidth_Mm, 1.27);
    this.TableCellSpacing      = null;
    this.TableInd              = 0;
    this.TableW                = new CTableMeasurement(tblwidth_Auto, 0);
    this.TableLayout           = tbllayout_AutoFit;
};