/*
 * (c) Copyright Ascensio System SIA 2010-2016
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

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

        if (!_style || _style.Type != styletype_Table)
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
var g_oDocumentDefaultTextPr       = new CTextPr();
var g_oDocumentDefaultParaPr       = new CParaPr();
var g_oDocumentDefaultTablePr      = new CTablePr();
var g_oDocumentDefaultTableCellPr  = new CTableCellPr();
var g_oDocumentDefaultTableRowPr   = new CTableRowPr();
var g_oDocumentDefaultTableStylePr = new CTableStylePr();
g_oDocumentDefaultTextPr.Init_Default();
g_oDocumentDefaultParaPr.Init_Default();
g_oDocumentDefaultTablePr.Init_Default();
g_oDocumentDefaultTableCellPr.Init_Default();
g_oDocumentDefaultTableRowPr.Init_Default();
g_oDocumentDefaultTableStylePr.Init_Default();

//------------------------------------------------------------export----------------------------------------------------
CAscTableStyle.prototype['get_Id'] = CAscTableStyle.prototype.get_Id;
CAscTableStyle.prototype['get_Image'] = CAscTableStyle.prototype.get_Image;
CAscTableStyle.prototype['get_Type'] = CAscTableStyle.prototype.get_Type;
