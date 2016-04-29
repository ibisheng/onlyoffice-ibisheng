"use strict";



// ---------------------------------------------------------------



// ---------------------------------------------------------------

function CAscTableStyle()
{
    this.Id     = "";
    this.Type   = 0;
    this.Image  = "";
}
CAscTableStyle.prototype.get_Id = function(){ return this.Id; };
CAscTableStyle.prototype.get_Image = function(){ return this.Image; };
CAscTableStyle.prototype.get_Type = function(){ return this.Type; };


// ---------------------------------------------------------------
function GenerateTableStyles(drawingDoc, logicDoc, tableLook)
{
    var _dst_styles = [];

    var _styles = logicDoc.Styles.Get_AllTableStyles();
    var _styles_len = _styles.length;

    if (_styles_len == 0)
        return _dst_styles;

    var _x_mar = 10;
    var _y_mar = 10;
    var _r_mar = 10;
    var _b_mar = 10;
    var _pageW = 297;
    var _pageH = 210;

    var W = (_pageW - _x_mar - _r_mar);
    var H = (_pageH - _y_mar - _b_mar);
    var Grid = [];

    var Rows = 5;
    var Cols = 5;

    for (var i = 0; i < Cols; i++)
        Grid[i] = W / Cols;

    var _canvas = document.createElement('canvas');
    if (!this.m_oWordControl.bIsRetinaSupport)
    {
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
    }
    else
    {
        _canvas.width = (TABLE_STYLE_WIDTH_PIX << 1);
        _canvas.height = (TABLE_STYLE_HEIGHT_PIX << 1);
    }
    var ctx = _canvas.getContext('2d');

    AscCommon.History.TurnOff();
    for (var i1 = 0; i1 < _styles_len; i1++)
    {
        var i = _styles[i1];
        var _style = logicDoc.Styles.Style[i];

        if (!_style || _style.Type != AscCommon.styletype_Table)
            continue;

        var table = new CTable(drawingDoc, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
        table.Set_Props({TableStyle : i});

        for (var j = 0; j < Rows; j++)
            table.Content[j].Set_Height(H / Rows, Asc.linerule_AtLeast);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _canvas.width, _canvas.height);

        var graphics = new AscCommon.CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
        graphics.m_oFontManager = AscCommon.g_fontManager;
        graphics.transform(1,0,0,1,0,0);

        table.Recalculate_Page(0);
        table.Draw(0, graphics);

        var _styleD = new CAscTableStyle();
        _styleD.Type = 0;
        _styleD.Image = _canvas.toDataURL("image/png");
        _styleD.Id = i;
        _dst_styles.push(_styleD);
    }
    AscCommon.History.TurnOn();

    return _dst_styles;
}

// Создаем глобальные дефолтовые стили, чтобы быстро можно было отдать дефолтовые настройки
var g_oDocumentDefaultTextPr       = new AscCommon.CTextPr();
var g_oDocumentDefaultParaPr       = new AscCommon.CParaPr();
var g_oDocumentDefaultTablePr      = new AscCommon.CTablePr();
var g_oDocumentDefaultTableCellPr  = new AscCommon.CTableCellPr();
var g_oDocumentDefaultTableRowPr   = new AscCommon.CTableRowPr();
var g_oDocumentDefaultTableStylePr = new AscCommon.CTableStylePr();
g_oDocumentDefaultTextPr.Init_Default();
g_oDocumentDefaultParaPr.Init_Default();
g_oDocumentDefaultTablePr.Init_Default();
g_oDocumentDefaultTableCellPr.Init_Default();
g_oDocumentDefaultTableRowPr.Init_Default();
g_oDocumentDefaultTableStylePr.Init_Default();
