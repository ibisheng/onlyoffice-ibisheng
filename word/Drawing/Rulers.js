"use strict";

// Import
var c_oAscDocumentUnits = Asc.c_oAscDocumentUnits;

function CTab(pos,type)
{
    this.pos   = pos;
    this.type  = type;
}

var g_array_objects_length = 1;

var RULER_OBJECT_TYPE_PARAGRAPH = 1;
var RULER_OBJECT_TYPE_HEADER    = 2;
var RULER_OBJECT_TYPE_FOOTER    = 4;
var RULER_OBJECT_TYPE_TABLE     = 8;
var RULER_OBJECT_TYPE_COLUMNS   = 16;

function CHorRulerRepaintChecker()
{
    // zoom/section check
    this.Width = 0;
    this.Height = 0;

    // ruler type check
    this.Type = 0;

    // margin check
    this.MarginLeft = 0;
    this.MarginRight = 0;

    // table column check
    this.tableCols = [];
    this.marginsLeft = [];
    this.marginsRight = [];

    this.columns = null; // CColumnsMarkup

    // blit to main params
    this.BlitAttack = false;
    this.BlitLeft = 0;
    this.BlitIndentLeft = 0;
    this.BlitIndentLeftFirst = 0;
    this.BlitIndentRight = 0;
    this.BlitDefaultTab = 0;
    this.BlitTabs = null;

    this.BlitMarginLeftInd = 0;
    this.BlitMarginRightInd = 0;
}

function CVerRulerRepaintChecker()
{
    // zoom/section check
    this.Width = 0;
    this.Height = 0;

    // ruler type check
    this.Type = 0;

    // margin check
    this.MarginTop = 0;
    this.MarginBottom = 0;

    // header/footer check
    this.HeaderTop = 0;
    this.HeaderBottom = 0;

    // table column check
    this.rowsY = [];
    this.rowsH = [];

    // blit params
    this.BlitAttack = false;
    this.BlitTop = 0;
}

function RulerCorrectPosition(_ruler, val, margin)
{
    if (global_keyboardEvent.AltKey)
        return val;

    var mm_1_4 = 10 / 4;

    if (_ruler.Units == c_oAscDocumentUnits.Inch)
        mm_1_4 = 25.4 / 16;
    else if (_ruler.Units == c_oAscDocumentUnits.Point)
        mm_1_4 = 25.4 / 12;

    var mm_1_8 = mm_1_4 / 2;

    if (undefined === margin)
        return (((val + mm_1_8) / mm_1_4) >> 0) * mm_1_4;

    if (val >= margin)
        return margin + (((val - margin + mm_1_8) / mm_1_4) >> 0) * mm_1_4;

    return margin + (((val - margin - mm_1_8) / mm_1_4) >> 0) * mm_1_4;
}

function RulerCheckSimpleChanges()
{
    this.X = -1;
    this.Y = -1;
    this.IsSimple = true;

    this.IsDown   = false;
}
RulerCheckSimpleChanges.prototype =
{
    Clear : function()
    {
        this.X = -1;
        this.Y = -1;
        this.IsSimple = true;
        this.IsDown = false;
    },

    Reinit : function()
    {
        this.X = global_mouseEvent.X;
        this.Y = global_mouseEvent.Y;
        this.IsSimple = true;
        this.IsDown = true;
    },

    CheckMove : function()
    {
        if (!this.IsDown)
            return;
        if (!this.IsSimple)
            return;

        if (Math.abs(global_mouseEvent.X - this.X) > 0 || Math.abs(global_mouseEvent.Y - this.Y) > 0)
            this.IsSimple = false;
    }
};

function CHorRuler()
{
    this.m_oPage        = null;     // текущая страница. Нужна для размеров и маргинов в режиме RULER_OBJECT_TYPE_PARAGRAPH
    
    this.m_nTop         = 0;        // начало прямогулольника линейки
    this.m_nBottom      = 0;        // конец прямоугольника линейки

    // реализация tab'ов
    this.m_dDefaultTab              = 12.5;
    this.m_arrTabs                  = [];
    this.m_lCurrentTab              = -1;
    this.m_dCurrentTabNewPosition   = -1;
    this.m_dMaxTab                  = 0;
    this.IsDrawingCurTab            = true; // это подсказка для пользователя - будет ли оставлен таб после отпускания мышки, или будет выкинут

    this.m_dMarginLeft              = 20;
    this.m_dMarginRight             = 190;

    this.m_dIndentLeft          = 10;
    this.m_dIndentRight         = 20;
    this.m_dIndentLeftFirst     = 20;

    this.m_oCanvas              = null;

    this.m_dZoom                = 1;

    this.DragType = 0;  // 0 - none
                        // 1 - left margin, 2 - right margin
                        // 3 - indent left + indent left first, 4 - indent left // 5 - indent left first, 6 - indent right
                        // 7 - tabs
                        // 8 - table
                        // 9 - column size
                        // 10 - column move

    this.m_dIndentLeft_old      = -10000;
    this.m_dIndentLeftFirst_old = -10000;
    this.m_dIndentRight_old     = -10000;

    // отдельные настройки для текущего объекта линейки
    this.CurrentObjectType  = RULER_OBJECT_TYPE_PARAGRAPH;
    this.m_oTableMarkup     = null;
    this.m_oColumnMarkup    = null;
    this.DragTablePos       = -1;

    this.TableMarginLeft = 0;
    this.TableMarginLeftTrackStart = 0;
    this.TableMarginRight   = 0;

    this.m_oWordControl = null;

    this.RepaintChecker = new CHorRulerRepaintChecker();
    this.m_bIsMouseDown = false;

    // presentations addons
    this.IsCanMoveMargins = true;
    this.IsCanMoveAnyMarkers = true;
    this.IsDrawAnyMarkers = true;

    this.SimpleChanges = new RulerCheckSimpleChanges();

    this.Units = c_oAscDocumentUnits.Millimeter;

    this.InitTablePict = function()
    {
        var _data = g_memory.ctx.createImageData(7, 8);
        var _px = _data.data;
        var is2 = false;

        var black_level = 100;

        for (var j = 0; j < 8; j++)
        {
            var ind = j * 4 * 7;
            if (is2)
            {
                for (i = 0; i < 7; i++)
                {
                    _px[ind++] = black_level;
                    _px[ind++] = black_level;
                    _px[ind++] = black_level;
                    _px[ind++] = 255;
                }
            }
            else
            {
                var is22 = false;
                for (var i = 0; i < 7; i++)
                {
                    if (is22)
                    {
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = 255;
                    }
                    else
                    {
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                    }
                    is22 = !is22;
                }
            }
            is2 = !is2;
        }
        return _data;
    }

    this.InitTablePict2 = function()
    {
        var _data = g_memory.ctx.createImageData(14, 16);
        var _px = _data.data;

        var black_level = 100;

        for (var j = 0; j < 16; j++)
        {
            var ind = j * 4 * 14;
            var is2 = j - ((j >> 2) << 2);

            if (is2 >= 2)
            {
                for (i = 0; i < 14; i++)
                {
                    _px[ind++] = black_level;
                    _px[ind++] = black_level;
                    _px[ind++] = black_level;
                    _px[ind++] = 255;
                }
            }
            else
            {
                var is22 = false;
                for (var i = 0; i < 7; i++)
                {
                    if (is22)
                    {
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = 255;
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = black_level;
                        _px[ind++] = 255;
                    }
                    else
                    {
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                        _px[ind++] = 255;
                    }
                    is22 = !is22;
                }
            }
        }
        return _data;
    }

    this.CheckTableSprite = function(is_retina)
    {
        if (null != this.tableSprite)
        {
            if (!is_retina && this.tableSprite.width == 7)
                return;
            if (is_retina && this.tableSprite.width == 14)
                return;
        }
        if (!is_retina)
            this.tableSprite = this.InitTablePict();
        else
            this.tableSprite = this.InitTablePict2();
    }

    this.tableSprite = null;

    this.CheckCanvas = function()
    {
        this.m_dZoom = this.m_oWordControl.m_nZoomValue / 100;
        this.IsRetina = this.m_oWordControl.bIsRetinaSupport;

        this.CheckTableSprite(this.IsRetina);

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;
        if (this.IsRetina)
            dKoef_mm_to_pix *= 2;

        var widthNew    = dKoef_mm_to_pix * this.m_oPage.width_mm;

        var _width      = 10 + widthNew;
        if (this.IsRetina)
            _width += 10;

        var _height     = 8 * g_dKoef_mm_to_pix;

        if (this.IsRetina)
            _height *= 2;

        var intW = _width >> 0;
        var intH = _height >> 0;
        if (null == this.m_oCanvas)
        {
            this.m_oCanvas = document.createElement('canvas');
            this.m_oCanvas.width    = intW;
            this.m_oCanvas.height   = intH;
        }
        else
        {
            var oldW = this.m_oCanvas.width;
            var oldH = this.m_oCanvas.height;

            if ((oldW != intW) || (oldH != intH))
            {
                delete this.m_oCanvas;
                this.m_oCanvas = document.createElement('canvas');
                this.m_oCanvas.width    = intW;
                this.m_oCanvas.height   = intH;
            }
        }
        return widthNew;
    }

    this.CreateBackground = function(cachedPage, isattack)
    {
        if (window["NATIVE_EDITOR_ENJINE"])
            return;
            
        if (null == cachedPage || undefined == cachedPage)
            return;

        this.m_oPage = cachedPage;
        var width = this.CheckCanvas();

        if (this.IsRetina)
            width >>= 1;

        if (0 == this.DragType)
        {
            this.m_dMarginLeft  = cachedPage.margin_left;
            this.m_dMarginRight = cachedPage.margin_right;
        }

        // check old state
        var checker = this.RepaintChecker;
        var markup = this.m_oTableMarkup;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
            markup = this.m_oColumnMarkup;

        if (isattack !== true && this.CurrentObjectType == checker.Type && width == checker.Width)
        {
            if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
            {
                if (this.m_dMarginLeft == checker.MarginLeft && this.m_dMarginRight == checker.MarginRight)
                    return;
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
            {
                var oldcount = checker.tableCols.length;
                var newcount = 1 + markup.Cols.length;

                if (oldcount == newcount)
                {
                    var arr1 = checker.tableCols;
                    var arr2 = markup.Cols;

                    if (arr1[0] == markup.X)
                    {
                        var _break = false;
                        for (var i = 1; i < newcount; i++)
                        {
                            if (arr1[i] != arr2[i - 1])
                            {
                                _break = true;
                                break;
                            }
                        }

                        if (!_break)
                        {
                            --newcount;
                            var _margs = markup.Margins;

                            for (var i = 0; i < newcount; i++)
                            {
                                if (_margs[i].Left != checker.marginsLeft[i] || _margs[i].Right != checker.marginsRight[i])
                                {
                                    _break = true;
                                    break;
                                }
                            }

                            if (!_break)
                                return;
                        }
                    }
                }
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
            {
                if (this.m_oColumnMarkup.X == checker.columns.X)
                {
                    if (markup.EqualWidth == checker.columns.EqualWidth)
                    {
                        if (markup.EqualWidth)
                        {
                            if (markup.Num == checker.columns.Num && markup.Space == checker.columns.Space && markup.R == checker.columns.R)
                                return;
                        }
                        else
                        {
                            var _arr1 = markup.Cols;
                            var _arr2 = checker.columns.Cols;
                            if (_arr1 && _arr2 && _arr1.length == _arr2.length)
                            {
                                var _len = _arr1.length;
                                var _index = 0;
                                for (_index = 0; _index < _len; _index++)
                                {
                                    if (_arr1[_index].W != _arr2[_index].W || _arr1[_index].Space != _arr2[_index].Space)
                                        break;
                                }

                                if (_index == _len)
                                    return;
                            }
                        }
                    }
                }
            }
        }

        //console.log("horizontal");

        checker.Width = width;
        checker.Type = this.CurrentObjectType;
        checker.BlitAttack = true;

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;

        // не править !!!
        this.m_nTop     = 6;//(1.8 * g_dKoef_mm_to_pix) >> 0;
        this.m_nBottom  = 19;//(5.2 * g_dKoef_mm_to_pix) >> 0;

        var context = this.m_oCanvas.getContext('2d');
        if (!this.IsRetina)
            context.setTransform(1, 0, 0, 1, 5, 0);
        else
            context.setTransform(2, 0, 0, 2, 10, 0);

        context.fillStyle = GlobalSkin.BackgroundColor;
        context.fillRect(0, 0, this.m_oCanvas.width, this.m_oCanvas.height);

        var left_margin  = 0;
        var right_margin = 0;

        if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
        {
            left_margin  = (this.m_dMarginLeft * dKoef_mm_to_pix) >> 0;
            right_margin = (this.m_dMarginRight * dKoef_mm_to_pix) >> 0;

            checker.MarginLeft = this.m_dMarginLeft;
            checker.MarginRight = this.m_dMarginRight;
        }
        else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE && null != markup)
        {
            var _cols = checker.tableCols;
            if (0 != _cols.length)
                _cols.splice(0, _cols.length);

            _cols[0] = markup.X;
            var _ml = checker.marginsLeft;
            if (0 != _ml.length)
                _ml.splice(0, _ml.length);

            var _mr = checker.marginsRight;
            if (0 != _mr.length)
                _mr.splice(0, _mr.length);

            var _count_ = markup.Cols.length;

            for (var i = 0; i < _count_; i++)
            {
                _cols[i + 1] = markup.Cols[i];
                _ml[i] = markup.Margins[i].Left;
                _mr[i] = markup.Margins[i].Right;
            }

            if (0 != _count_)
            {
                var _start = 0;
                for (var i = 0; i < _count_; i++)
                {
                    _start += markup.Cols[i];
                }

                left_margin  = ((markup.X + markup.Margins[0].Left) * dKoef_mm_to_pix) >> 0;
                right_margin = ((markup.X + _start - markup.Margins[markup.Margins.length - 1].Right) * dKoef_mm_to_pix) >> 0;
            }
        }
        else if (this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS && null != markup)
        {
            left_margin  = (markup.X * dKoef_mm_to_pix) >> 0;
            right_margin = (markup.R * dKoef_mm_to_pix) >> 0;

            checker.MarginLeft = this.m_dMarginLeft;
            checker.MarginRight = this.m_dMarginRight;

            checker.columns = this.m_oColumnMarkup.CreateDuplicate();
        }

        context.fillStyle = GlobalSkin.RulerLight;
        context.fillRect(left_margin + 0.5, this.m_nTop + 0.5, right_margin - left_margin, this.m_nBottom - this.m_nTop);

        var intW = width >> 0;

        if (window["flat_desine"] === true)
        {
            context.beginPath();
            context.fillStyle = GlobalSkin.RulerDark;

            context.fillRect(0.5, this.m_nTop + 0.5, left_margin, this.m_nBottom - this.m_nTop);
            context.fillRect(right_margin + 0.5, this.m_nTop + 0.5, Math.max(intW - right_margin, 1), this.m_nBottom - this.m_nTop);
            context.beginPath();
        }

        //context.shadowBlur = 0;
        //context.shadowColor = "#81878F";

        context.strokeStyle = GlobalSkin.RulerOutline;

        context.lineWidth = 1;
        context.strokeRect(0.5, this.m_nTop + 0.5, Math.max(intW - 1, 1), this.m_nBottom - this.m_nTop);
        context.beginPath();
        context.moveTo(left_margin + 0.5, this.m_nTop + 0.5);
        context.lineTo(left_margin + 0.5, this.m_nBottom - 0.5);

        context.moveTo(right_margin + 0.5, this.m_nTop + 0.5);
        context.lineTo(right_margin + 0.5, this.m_nBottom - 0.5);

        context.stroke();
        context.beginPath();

        context.strokeStyle = "#585B5E";
        context.fillStyle = "#585B5E";

        var mm_1_4 = 10 * dKoef_mm_to_pix / 4;
        var inch_1_8 = 25.4 * dKoef_mm_to_pix / 8;

        var middleVert = (this.m_nTop + this.m_nBottom) / 2;
        var part1 = 1;
        var part2 = 2.5;

        context.font = "7pt Arial";

        if (this.Units == c_oAscDocumentUnits.Millimeter)
        {
            var lCount1 = ((width - left_margin) / mm_1_4) >> 0;
            var lCount2 = (left_margin / mm_1_4) >> 0;

        var index = 0;
        var num = 0;
        for (var i = 1; i < lCount1; i++)
        {
            var lXPos = ((left_margin + i * mm_1_4) >> 0) + 0.5;
            index++;

            if (index == 4)
                index = 0;

            if (0 == index)
            {
                num++;
                // number
                var strNum = "" + num;
                var lWidthText = context.measureText(strNum).width;
                lXPos -= (lWidthText / 2.0);
                context.fillText(strNum, lXPos, this.m_nBottom - 3);
            }
            else if (1 == index)
            {
                // 1/4
                context.beginPath();
                context.moveTo(lXPos, middleVert - part1);
                context.lineTo(lXPos, middleVert + part1);
                context.stroke();
            }
            else if (2 == index)
            {
                // 1/2
                context.beginPath();
                context.moveTo(lXPos, middleVert - part2);
                context.lineTo(lXPos, middleVert + part2);
                context.stroke();
            }
            else
            {
                // 1/4
                context.beginPath();
                context.moveTo(lXPos, middleVert - part1);
                context.lineTo(lXPos, middleVert + part1);
                context.stroke();
            }
        }

        index = 0;
        num = 0;
        for (var i = 1; i <= lCount2; i++)
        {
            var lXPos = ((left_margin - i * mm_1_4) >> 0) + 0.5;
            index++;

            if (index == 4)
                index = 0;

            if (0 == index)
            {
                num++;
                // number
                var strNum = "" + num;
                var lWidthText = context.measureText(strNum).width;
                lXPos -= (lWidthText / 2.0);
                context.fillText(strNum, lXPos, this.m_nBottom - 3);
            }
            else if (1 == index)
            {
                // 1/4
                context.beginPath();
                context.moveTo(lXPos, middleVert - part1);
                context.lineTo(lXPos, middleVert + part1);
                context.stroke();
            }
            else if (2 == index)
            {
                // 1/2
                context.beginPath();
                context.moveTo(lXPos, middleVert - part2);
                context.lineTo(lXPos, middleVert + part2);
                context.stroke();
            }
            else
            {
                // 1/4
                context.beginPath();
                context.moveTo(lXPos, middleVert - part1);
                context.lineTo(lXPos, middleVert + part1);
                context.stroke();
            }
        }
        }
        else if (this.Units == c_oAscDocumentUnits.Inch)
        {
            var lCount1 = ((width - left_margin) / inch_1_8) >> 0;
            var lCount2 = (left_margin / inch_1_8) >> 0;

            var index = 0;
            var num = 0;
            for (var i = 1; i < lCount1; i++)
            {
                var lXPos = ((left_margin + i * inch_1_8) >> 0) + 0.5;
                index++;

                if (index == 8)
                    index = 0;

                if (0 == index)
                {
                    num++;
                    // number
                    var strNum = "" + num;
                    var lWidthText = context.measureText(strNum).width;
                    lXPos -= (lWidthText / 2.0);
                    context.fillText(strNum, lXPos, this.m_nBottom - 3);
                }
                else if (4 == index)
                {
                    // 1/2
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part2);
                    context.lineTo(lXPos, middleVert + part2);
                    context.stroke();
                }
                else if (inch_1_8 > 8)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part1);
                    context.lineTo(lXPos, middleVert + part1);
                    context.stroke();
                }
            }

            index = 0;
            num = 0;
            for (var i = 1; i <= lCount2; i++)
            {
                var lXPos = ((left_margin - i * inch_1_8) >> 0) + 0.5;
                index++;

                if (index == 8)
                    index = 0;

                if (0 == index)
                {
                    num++;
                    // number
                    var strNum = "" + num;
                    var lWidthText = context.measureText(strNum).width;
                    lXPos -= (lWidthText / 2.0);
                    context.fillText(strNum, lXPos, this.m_nBottom - 3);
                }
                else if (4 == index)
                {
                    // 1/2
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part2);
                    context.lineTo(lXPos, middleVert + part2);
                    context.stroke();
                }
                else if (inch_1_8 > 8)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part1);
                    context.lineTo(lXPos, middleVert + part1);
                    context.stroke();
                }
            }
        }
        else if (this.Units == c_oAscDocumentUnits.Point)
        {
            var point_1_12 = 25.4 * dKoef_mm_to_pix / 12;

            var lCount1 = ((width - left_margin) / point_1_12) >> 0;
            var lCount2 = (left_margin / point_1_12) >> 0;

            var index = 0;
            var num = 0;
            for (var i = 1; i < lCount1; i++)
            {
                var lXPos = ((left_margin + i * point_1_12) >> 0) + 0.5;
                index++;

                if (index == 12)
                    index = 0;

                if (0 == index || 6 == index)
                {
                    num++;
                    // number
                    var strNum = "" + (num * 36);
                    var lWidthText = context.measureText(strNum).width;
                    lXPos -= (lWidthText / 2.0);
                    context.fillText(strNum, lXPos, this.m_nBottom - 3);
                }
                else if (point_1_12 > 5)
                {
                    // 1/12
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part1);
                    context.lineTo(lXPos, middleVert + part1);
                    context.stroke();
                }
            }

            index = 0;
            num = 0;
            for (var i = 1; i <= lCount2; i++)
            {
                var lXPos = ((left_margin - i * point_1_12) >> 0) + 0.5;
                index++;

                if (index == 12)
                    index = 0;

                if (0 == index || 6 == index)
                {
                    num++;
                    // number
                    var strNum = "" + (num * 36);
                    var lWidthText = context.measureText(strNum).width;
                    lXPos -= (lWidthText / 2.0);
                    context.fillText(strNum, lXPos, this.m_nBottom - 3);
                }
                else if (point_1_12 > 5)
                {
                    // 1/12
                    context.beginPath();
                    context.moveTo(lXPos, middleVert - part1);
                    context.lineTo(lXPos, middleVert + part1);
                    context.stroke();
                }
            }
        }

        if (null != markup && this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
        {
            var _count = markup.Cols.length;
            if (0 != _count)
            {
                context.fillStyle = GlobalSkin.RulerDark;
                context.strokeStyle = GlobalSkin.RulerOutline;

                var _offset = markup.X;
                for (var i = 0; i <= _count; i++)
                {
                    var __xID = 0;
                    if (!this.IsRetina)
                        __xID = (2.5 + _offset * dKoef_mm_to_pix) >> 0;
                    else
                        __xID = ((2.5 + _offset * dKoef_mm_to_pix) * 2) >> 0;

                    var __yID = this.m_nBottom - 10;
                    if (this.IsRetina)
                        __yID <<= 1;

                    if (0 == i)
                    {
                        context.putImageData(this.tableSprite, __xID, __yID);
                        _offset += markup.Cols[i];
                        continue;
                    }
                    if (i == _count)
                    {
                        context.putImageData(this.tableSprite, __xID, __yID);
                        break;
                    }

                    var __x = (((_offset - markup.Margins[i-1].Right) * dKoef_mm_to_pix) >> 0) + 0.5;
                    var __r = (((_offset + markup.Margins[i].Left) * dKoef_mm_to_pix) >> 0) + 0.5;

                    context.fillRect(__x, this.m_nTop + 0.5, __r - __x, this.m_nBottom - this.m_nTop);
                    context.strokeRect(__x, this.m_nTop + 0.5, __r - __x, this.m_nBottom - this.m_nTop);

                    if (!this.IsRetina)
                        context.putImageData(this.tableSprite, __xID, __yID);
                    else
                        context.putImageData(this.tableSprite, __xID, __yID);

                    _offset += markup.Cols[i];
                }
            }
        }

        if (null != markup && this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            var _array = markup.EqualWidth ? [] : markup.Cols;
            if (markup.EqualWidth)
            {
                var _w = ((markup.R - markup.X) - markup.Space * (markup.Num - 1)) / markup.Num;

                for (var i = 0; i < markup.Num; i++)
                {
                    var _cur = new CColumnsMarkupColumn();
                    _cur.W = _w;
                    _cur.Space = markup.Space;
                    _array.push(_cur);
                }
            }

            var _count = _array.length;
            if (0 != _count)
            {
                context.fillStyle = GlobalSkin.RulerDark;
                context.strokeStyle = GlobalSkin.RulerOutline;

                var _offsetX = markup.X;
                for (var i = 0; i < _count; i++)
                {
                    var __xTmp = _offsetX + _array[i].W;
                    var __rTmp = __xTmp + _array[i].Space;

                    var _offset = (__xTmp + __rTmp) / 2;

                    if (i == (_count - 1))
                        continue;

                    var __xID = 0;
                    if (!this.IsRetina)
                        __xID = (2.5 + _offset * dKoef_mm_to_pix) >> 0;
                    else
                        __xID = (5 + _offset * dKoef_mm_to_pix * 2) >> 0;

                    var __yID = this.m_nBottom - 10;
                    if (this.IsRetina)
                        __yID <<= 1;

                    var __x = ((__xTmp * dKoef_mm_to_pix) >> 0) + 0.5;
                    var __r = ((__rTmp * dKoef_mm_to_pix) >> 0) + 0.5;

                    context.fillRect(__x, this.m_nTop + 0.5, __r - __x, this.m_nBottom - this.m_nTop);
                    context.strokeRect(__x, this.m_nTop + 0.5, __r - __x, this.m_nBottom - this.m_nTop);

                    if (!markup.EqualWidth)
                        context.putImageData(this.tableSprite, __xID, __yID);

                    if ((__r - __x) > 10)
                    {
                        context.fillStyle = GlobalSkin.RulerLight;
                        context.strokeStyle = "#81878F";
                        context.fillRect(__x + 3, this.m_nTop + 0.5 + 3, 3, this.m_nBottom - this.m_nTop - 6);
                        context.fillRect(__r - 6, this.m_nTop + 0.5 + 3, 3, this.m_nBottom - this.m_nTop - 6);
                        context.strokeRect(__x + 3, this.m_nTop + 0.5 + 3, 3, this.m_nBottom - this.m_nTop - 6);
                        context.strokeRect(__r - 6, this.m_nTop + 0.5 + 3, 3, this.m_nBottom - this.m_nTop - 6);
                        context.fillStyle = GlobalSkin.RulerDark;
                        context.strokeStyle = GlobalSkin.RulerOutline;
                    }

                    _offsetX += (_array[i].W + _array[i].Space);
                }
            }
        }
    }

    this.CorrectTabs = function()
    {
        this.m_dMaxTab = 0;
        var _old_c = this.m_arrTabs.length;
        if (0 == _old_c)
            return;

        var _old = this.m_arrTabs;
        var _new = [];

        for (var i = 0; i < _old_c; i++)
        {
            for (var j = i + 1; j < _old_c; j++)
            {
                if (_old[j].pos < _old[i].pos)
                {
                    var temp = _old[i];
                    _old[i] = _old[j];
                    _old[j] = temp;
                }
            }
        }

        var _new_len = 0;
        _new[_new_len++] = _old[0];
        for (var i = 1; i < _old_c; i++)
        {
            if (_new[_new_len - 1].pos != _old[i].pos)
                _new[_new_len++] = _old[i];
        }
        this.m_arrTabs = null;
        this.m_arrTabs = _new;

        this.m_dMaxTab = this.m_arrTabs[_new_len - 1].pos;
    }

    this.CalculateMargins = function()
    {
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
        {
            this.TableMarginLeft = 0;
            this.TableMarginRight = 0;

            var markup = this.m_oTableMarkup;
            var margin_left = markup.X;

            var _col = markup.CurCol;
            for (var i = 0; i < _col; i++)
                margin_left += markup.Cols[i];

            this.TableMarginLeft = margin_left + markup.Margins[_col].Left;
            this.TableMarginRight = margin_left + markup.Cols[_col] - markup.Margins[_col].Right;
        }
        else if (this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            this.TableMarginLeft = 0;
            this.TableMarginRight = 0;

            var markup = this.m_oColumnMarkup;

            if (markup.EqualWidth)
            {
                var _w = ((markup.R - markup.X) - markup.Space * (markup.Num - 1)) / markup.Num;

                this.TableMarginLeft = markup.X + (_w  + markup.Space) * markup.CurCol;
                this.TableMarginRight = this.TableMarginLeft + _w;
            }
            else
            {
                var margin_left = markup.X;
                var _col = markup.CurCol;
                for (var i = 0; i < _col; i++)
                    margin_left += (markup.Cols[i].W + markup.Cols[i].Space);

                this.TableMarginLeft = margin_left;
                this.TableMarginRight = margin_left + markup.Cols[_col].W;

                var _x = markup.X;

                var _len = markup.Cols.length;
                for (var i = 0; i < _len; i++)
                {
                    _x += markup.Cols[i].W;

                    if (i != (_len - 1))
                        _x += markup.Cols[i].Space;
                }

                markup.R = _x;
            }
        }
    }

    this.OnMouseMove = function(left, top, e)
    {
        var word_control = this.m_oWordControl;
        
        check_MouseMoveEvent(e);

        this.SimpleChanges.CheckMove();

        var hor_ruler = word_control.m_oTopRuler_horRuler;
        var dKoefPxToMM = 100 * g_dKoef_pix_to_mm / word_control.m_nZoomValue;

        var _x = global_mouseEvent.X - 5 * g_dKoef_mm_to_pix - left - word_control.X - word_control.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix;
        _x *= dKoefPxToMM;
        var _y = (global_mouseEvent.Y - word_control.Y) * g_dKoef_pix_to_mm;

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;
        var mm_1_4 = 10 / 4;
        var mm_1_8 = mm_1_4 / 2;

        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        var _presentations = false;
        if (word_control.EditorType === "presentations")
            _presentations = true;

        switch (this.DragType)
        {
            case 0:
            {
                var position = this.CheckMouseType(_x, _y);
                if ((1 == position) || (2 == position) || (8 == position) || (9 == position) || (10 == position))
                    word_control.m_oDrawingDocument.SetCursorType("w-resize");
                else
                    word_control.m_oDrawingDocument.SetCursorType("default");

                break;
            }
            case 1:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                if (newVal < 0)
                    newVal = 0;

                var max = this.m_dMarginRight - 20;
                if (0 < this.m_dIndentRight)
                    max = (this.m_dMarginRight - this.m_dIndentRight - 20);
                if (newVal > max)
                    newVal = max;

                var _max_ind = Math.max(this.m_dIndentLeft, this.m_dIndentLeftFirst);
                if ((newVal + _max_ind) > max)
                    newVal = max - _max_ind;

                this.m_dMarginLeft = newVal;
                word_control.UpdateHorRulerBack();

                var pos = left + this.m_dMarginLeft * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("w-resize");
                break;
            }
            case 2:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                var min = this.m_dMarginLeft;
                if ((this.m_dMarginLeft + this.m_dIndentLeft) > min)
                    min = this.m_dMarginLeft + this.m_dIndentLeft;
                if ((this.m_dMarginLeft + this.m_dIndentLeftFirst) > min)
                    min = this.m_dMarginLeft + this.m_dIndentLeftFirst;

                min += 20;
                if (newVal < min)
                    newVal = min;
                if (newVal > this.m_oPage.width_mm)
                    newVal = this.m_oPage.width_mm;

                if ((newVal - this.m_dIndentRight) < min)
                    newVal = min + this.m_dIndentRight;

                this.m_dMarginRight = newVal;
                word_control.UpdateHorRulerBack();

                var pos = left + this.m_dMarginRight * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("w-resize");
                break;
            }
            case 3:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                var min = 0;
                if (this.m_dIndentLeftFirst < this.m_dIndentLeft)
                    min = this.m_dIndentLeft - this.m_dIndentLeftFirst;

                if (newVal < min)
                    newVal = this.m_dIndentLeft_old;

                if (_presentations)
                {
                    min = _margin_left;
                    if (this.m_dIndentLeftFirst < this.m_dIndentLeft)
                        min += (this.m_dIndentLeft - this.m_dIndentLeftFirst);
                    if (newVal < min)
                        newVal = min;
                }

                var max = _margin_right;
                if (0 < this.m_dIndentRight)
                    max = _margin_right - this.m_dIndentRight;
                if (this.m_dIndentLeftFirst > this.m_dIndentLeft)
                {
                    max = max + (this.m_dIndentLeft - this.m_dIndentLeftFirst);
                }

                if (newVal > (max - 20))
                    newVal = Math.max(max - 20, (this.m_dIndentLeft_old + _margin_left));

                var newIndent = newVal - _margin_left;
                this.m_dIndentLeftFirst = (this.m_dIndentLeftFirst - this.m_dIndentLeft) + newIndent;
                this.m_dIndentLeft = newIndent;
                word_control.UpdateHorRulerBack();

                var pos = left + (_margin_left + this.m_dIndentLeft) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                break;
            }
            case 4:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                if (newVal < 0)
                    newVal = 0;

                var max = _margin_right - 20;
                if (0 < this.m_dIndentRight)
                    max -= this.m_dIndentRight;

                if (_presentations)
                {
                    if (newVal < _margin_left)
                        newVal = _margin_left;
                }

                if (newVal > max)
                    newVal = Math.max(max, _margin_left + this.m_dIndentLeft_old);

                this.m_dIndentLeft = newVal - _margin_left;
                word_control.UpdateHorRulerBack();

                var pos = left + (_margin_left + this.m_dIndentLeft) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                break;
            }
            case 5:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                if (newVal < 0)
                    newVal = 0;

                var max = _margin_right - 20;
                if (0 < this.m_dIndentRight)
                    max -= this.m_dIndentRight;

                if (_presentations)
                {
                    if (newVal < _margin_left)
                        newVal = _margin_left;
                }

                if (newVal > max)
                    newVal = Math.max(max, _margin_left + this.m_dIndentLeftFirst_old);

                this.m_dIndentLeftFirst = newVal - _margin_left;
                word_control.UpdateHorRulerBack();

                var pos = left + (_margin_left + this.m_dIndentLeftFirst) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                break;
            }
            case 6:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                if (newVal > (this.m_oPage.width_mm))
                    newVal = this.m_oPage.width_mm;

                var min = _margin_left;
                if ((_margin_left + this.m_dIndentLeft) > min)
                    min = _margin_left + this.m_dIndentLeft;
                if ((_margin_left + this.m_dIndentLeftFirst) > min)
                    min = _margin_left + this.m_dIndentLeftFirst;

                min += 20;

                if (newVal < min)
                    newVal = Math.min(min, _margin_right - this.m_dIndentRight_old);

                if (_presentations)
                {
                    if (newVal > _margin_right)
                        newVal = _margin_right;
                }

                this.m_dIndentRight = _margin_right - newVal;
                word_control.UpdateHorRulerBack();

                var pos = left + (_margin_right - this.m_dIndentRight) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                break;
            }
            case 7:
            {
                var newVal = RulerCorrectPosition(this, _x, _margin_left);

                this.m_dCurrentTabNewPosition = newVal - _margin_left;

                var pos = left + (_margin_left + this.m_dCurrentTabNewPosition) * dKoef_mm_to_pix;

                if (_y <= 3 || _y > 5.6)
                {
                    this.IsDrawingCurTab = false;
                    word_control.OnUpdateOverlay();
                }
                else
                {
                    this.IsDrawingCurTab = true;
                }

                word_control.UpdateHorRulerBack();

                if (this.IsDrawingCurTab)
                    word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 8:
            {
                var newVal = RulerCorrectPosition(this, _x, this.TableMarginLeftTrackStart);

                // сначала определим граничные условия
                var _min = 0;
                var _max = this.m_oPage.width_mm;

                var markup = this.m_oTableMarkup;
                var _left = 0;

                if (this.DragTablePos > 0)
                {
                    var start = markup.X;
                    for (var i = 1; i < this.DragTablePos; i++)
                        start += markup.Cols[i - 1];
                    _left = start;

                    start += markup.Margins[this.DragTablePos - 1].Left;
                    start += markup.Margins[this.DragTablePos - 1].Right;

                    _min = start;
                }

                if (newVal < _min)
                    newVal = _min;
                if (newVal > _max)
                    newVal = _max;

                if (0 == this.DragTablePos)
                {
                    markup.X = newVal;
                }
                else
                {
                    markup.Cols[this.DragTablePos - 1] = newVal - _left;
                }

                this.CalculateMargins();
                word_control.UpdateHorRulerBack();

                var pos = left + newVal * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 9:
            {
                var newVal = RulerCorrectPosition(this, _x, this.TableMarginLeftTrackStart);

                // сначала определим граничные условия
                var markup = this.m_oColumnMarkup;

                if (markup.EqualWidth)
                {
                    if (0 == this.DragTablePos)
                    {
                        var _min = 0;
                        var _max = markup.R - markup.Num * 10 - (markup.Num - 1) * markup.Space;

                        if (newVal < _min)
                            newVal = _min;
                        if (newVal > _max)
                            newVal = _max;

                        markup.X = newVal;
                    }
                    else if ((2 * markup.Num - 1) == this.DragTablePos)
                    {
                        var _min = markup.X + markup.Num * 10 + (markup.Num - 1) * markup.Space;
                        var _max = this.m_oPage.width_mm;

                        if (newVal < _min)
                            newVal = _min;
                        if (newVal > _max)
                            newVal = _max;

                        markup.R = newVal;
                    }
                    else
                    {
                        var bIsLeftSpace = ((this.DragTablePos & 1) == 1);
                        var _spaceMax = (markup.R - markup.X - 10 * markup.Num) / (markup.Num - 1);

                        var _col = ((this.DragTablePos + 1) >> 1);
                        var _center = _col * (markup.R - markup.X + markup.Space) / markup.Num - markup.Space / 2;

                        newVal -= markup.X;

                        if (bIsLeftSpace)
                        {
                            var _min = _center - _spaceMax / 2;
                            var _max = _center;

                            if (newVal < _min)
                                newVal = _min;
                            if (newVal > _max)
                                newVal = _max;

                            markup.Space = Math.abs((newVal - _center) * 2);
                        }
                        else
                        {
                            var _min = _center;
                            var _max = _center + _spaceMax / 2;

                            if (newVal < _min)
                                newVal = _min;
                            if (newVal > _max)
                                newVal = _max;

                            markup.Space = Math.abs((newVal - _center) * 2);
                        }

                        newVal += markup.X;
                    }
                }
                else
                {
                    var bIsLeftSpace = ((this.DragTablePos & 1) == 1);
                    var nSpaceNumber = ((this.DragTablePos + 1) >> 1);
                    var _min = 0;
                    var _max = this.m_oPage.width_mm;

                    if (0 == nSpaceNumber)
                    {
                        _max = markup.X + markup.Cols[0].W - 10;

                        if (newVal < _min)
                            newVal = _min;
                        if (newVal > _max)
                            newVal = _max;

                        var _delta = markup.X - newVal;
                        markup.X -= _delta;
                        markup.Cols[0].W += _delta;
                    }
                    else
                    {
                        var _offsetX = markup.X;
                        for (var i = 0; i < nSpaceNumber; i++)
                        {
                            _min = _offsetX;

                            _offsetX += markup.Cols[i].W;
                            if (!bIsLeftSpace || i != (nSpaceNumber - 1))
                            {
                                _min = _offsetX;
                                _offsetX += markup.Cols[i].Space;
                            }
                        }

                        if (bIsLeftSpace)
                        {
                            if (nSpaceNumber != markup.Num)
                                _max = _min + markup.Cols[nSpaceNumber - 1].W + markup.Cols[nSpaceNumber - 1].Space;

                            var _natMin = _min + 10;

                            if (newVal < _natMin)
                                newVal = _natMin;
                            if (newVal > _max)
                                newVal = _max;

                            markup.Cols[nSpaceNumber - 1].W = newVal - _min;
                            markup.Cols[nSpaceNumber - 1].Space = _max - newVal;

                            if (nSpaceNumber == markup.Num)
                            {
                                markup.R = newVal;
                            }
                        }
                        else
                        {
                            _max = _min + markup.Cols[nSpaceNumber - 1].Space + markup.Cols[nSpaceNumber].W;
                            var _natMax = _max - 10;

                            if (newVal < _min)
                                newVal = _min;
                            if (newVal > _natMax)
                                newVal = _natMax;

                            markup.Cols[nSpaceNumber - 1].Space = newVal - _min;
                            markup.Cols[nSpaceNumber].W = _max - newVal;
                        }
                    }
                }

                this.CalculateMargins();
                word_control.UpdateHorRulerBack();

                var pos = left + newVal * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 10:
            {
                var newVal = RulerCorrectPosition(this, _x, this.TableMarginLeftTrackStart);

                // сначала определим граничные условия
                var markup = this.m_oColumnMarkup;

                var _min = markup.X;
                for (var i = 0; i < this.DragTablePos; i++)
                {
                    _min += (markup.Cols[i].W + markup.Cols[i].Space);
                }

                var _max = _min + markup.Cols[this.DragTablePos].W + markup.Cols[this.DragTablePos].Space;
                _max += markup.Cols[this.DragTablePos + 1].W;

                var _space = markup.Cols[this.DragTablePos].Space;

                var _natMin = _min + _space / 2 + 10;
                var _natMax = _max - _space / 2 - 10;

                if (newVal < _natMin)
                    newVal = _natMin;
                if (newVal > _natMax)
                    newVal = _natMax;

                var _delta = newVal - (_min + markup.Cols[this.DragTablePos].W + markup.Cols[this.DragTablePos].Space / 2);
                markup.Cols[this.DragTablePos].W += _delta;
                markup.Cols[this.DragTablePos + 1].W -= _delta;

                this.CalculateMargins();
                word_control.UpdateHorRulerBack();

                var pos = left + newVal * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
        }
    }

    this.CheckMouseType = function(x, y, isMouseDown)
    {
        var _top = 1.8;
        var _bottom = 5.2;

        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        var posL = _margin_left;
        if ((_margin_left + this.m_dIndentLeft) > posL)
            posL = _margin_left + this.m_dIndentLeft;
        if ((_margin_left + this.m_dIndentLeftFirst) > posL)
            posL = _margin_left + this.m_dIndentLeftFirst;

        var posR = _margin_right;
        if (this.m_dIndentRight > 0)
            posR = _margin_right - this.m_dIndentRight;

        if (this.IsCanMoveAnyMarkers && posL < posR)
        {
            // tabs
            if (y >= 3 && y <= _bottom)
            {
                var _count_tabs = this.m_arrTabs.length;
                for (var i = 0; i < _count_tabs; i++)
                {
                    var _pos = _margin_left + this.m_arrTabs[i].pos;
                    if ((x >= (_pos - 1)) && (x <= (_pos + 1)))
                    {
                        if (true === isMouseDown)
                            this.m_lCurrentTab = i;
                        return 7;
                    }
                }
            }

            // left indent
            var dCenterX = _margin_left +  this.m_dIndentLeft;

            var var1 = dCenterX - 1;
            var var2 = 1.4;
            var var3 = 1.5;
            var var4 = dCenterX + 1;

            if ((x >= var1) && (x <= var4))
            {
                if ((y >= _bottom) && (y < (_bottom + var2)))
                    return 3;
                else if ((y > (_bottom - var3)) && (y < _bottom))
                    return 4;
            }

            // right indent
            dCenterX = _margin_right -  this.m_dIndentRight;

            var1 = dCenterX - 1;
            var4 = dCenterX + 1;

            if ((x >= var1) && (x <= var4))
            {
                if ((y > (_bottom - var3)) && (y < _bottom))
                    return 6;
            }

            // first line indent
            dCenterX = _margin_left +  this.m_dIndentLeftFirst;

            var1 = dCenterX - 1;
            var4 = dCenterX + 1;

            if ((x >= var1) && (x <= var4))
            {
                if ((y > (_top - 1)) && (y < (_top + 1.68)))
                {
                    if (0 == this.m_dIndentLeftFirst && 0 == this.m_dIndentLeft && this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH && this.IsCanMoveMargins)
                    {
                        if (y > (_top + 1))
                            return 1;
                    }
                    return 5;
                }
            }
        }

        if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH && this.IsCanMoveMargins)
        {
            if (y >= _top && y <= _bottom)
            {
                // ������ �������
                if (Math.abs(x - this.m_dMarginLeft) < 1)
                {
                    return 1;
                }
                else if (Math.abs(x - this.m_dMarginRight) < 1)
                {
                    return 2;
                }
            }
        }
        else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
        {
            if (y >= _top && y <= _bottom)
            {
                var markup = this.m_oTableMarkup;
                var pos = markup.X;
                var _count = markup.Cols.length;
                for (var i = 0; i <= _count; i++)
                {
                    if (Math.abs(x - pos) < 1)
                    {
                        this.DragTablePos = i;
                        return 8;
                    }
                    if (i == _count)
                        break;
                    
                    pos += markup.Cols[i];
                }
            }
        }
        else if (this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            if (y >= _top && y <= _bottom)
            {
                var markup = this.m_oColumnMarkup;
                if (markup.EqualWidth)
                {
                    var _w = ((markup.R - markup.X) - markup.Space * (markup.Num - 1)) / markup.Num;
                    var _x = markup.X;

                    var _index = 0;
                    for (var i = 0; i < markup.Num; i++)
                    {
                        if (0 == i)
                        {
                            if (Math.abs(x - _x) < 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }
                        else
                        {
                            if (x < _x + 1 && x > _x - 2)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }

                        ++_index;
                        _x += _w;

                        if (i == markup.Num - 1)
                        {
                            if (Math.abs(x - _x) < 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }
                        else
                        {
                            if (x < _x + 2 && x > _x - 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }

                        ++_index;
                        _x += markup.Space;
                    }
                }
                else
                {
                    var _x = markup.X;

                    var _index = 0;
                    for (var i = 0; i < markup.Cols.length; i++)
                    {
                        if (0 == i)
                        {
                            if (Math.abs(x - _x) < 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }
                        else
                        {
                            if (x < _x + 1 && x > _x - 2)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }

                        ++_index;
                        _x += markup.Cols[i].W;

                        if (i == markup.Num - 1)
                        {
                            if (Math.abs(x - _x) < 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }
                        else
                        {
                            if (x < _x + 2 && x > _x - 1)
                            {
                                this.DragTablePos = _index;
                                return 9;
                            }
                        }

                        if (i != markup.Cols.length - 1)
                        {
                            if (Math.abs(x - (_x + markup.Cols[i].Space / 2)) < 1)
                            {
                                this.DragTablePos = i;
                                return 10;
                            }
                        }

                        ++_index;
                        _x += markup.Cols[i].Space;
                    }
                }
            }
        }
        return 0;
    }

    this.OnMouseDown = function(left, top, e)
    {
        var word_control = this.m_oWordControl;
        check_MouseDownEvent(e);
        global_mouseEvent.LockMouse();

        this.SimpleChanges.Reinit();

        var dKoefPxToMM = 100 * g_dKoef_pix_to_mm / word_control.m_nZoomValue;
        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;
        
        var _x = global_mouseEvent.X - 5 * g_dKoef_mm_to_pix - left - word_control.X - word_control.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix;
        _x *= dKoefPxToMM;
        var _y = (global_mouseEvent.Y - word_control.Y) * g_dKoef_pix_to_mm;

        this.DragType = this.CheckMouseType(_x, _y, true);

        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        this.m_bIsMouseDown = true;

        switch (this.DragType)
        {
            case 1:
            {
                var pos = left + _margin_left * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 2:
            {
                var pos = left + _margin_right * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 3:
            {
                var pos = left + (_margin_left + this.m_dIndentLeft) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.m_dIndentLeft_old      = this.m_dIndentLeft;
                this.m_dIndentLeftFirst_old = this.m_dIndentLeftFirst;
                break;
            }
            case 4:
            {
                var pos = left + (_margin_left + this.m_dIndentLeft) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.m_dIndentLeft_old      = this.m_dIndentLeft;
                break;
            }
            case 5:
            {
                var pos = left + (_margin_left + this.m_dIndentLeftFirst) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.m_dIndentLeftFirst_old = this.m_dIndentLeftFirst;
                break;
            }
            case 6:
            {
                var pos = left + (_margin_right - this.m_dIndentRight) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.m_dIndentRight_old     = this.m_dIndentRight;
                break;
            }
            case 7:
            {
                var pos = left + (_margin_left + this.m_arrTabs[this.m_lCurrentTab].pos) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                break;
            }
            case 8:
            {
                var markup = this.m_oTableMarkup;
                var pos = markup.X;
                var _count = markup.Cols.length;
                for (var i = 0; i < this.DragTablePos; i++)
                {
                    pos += markup.Cols[i];
                }
                pos = left + pos * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.TableMarginLeftTrackStart = this.TableMarginLeft;
                break;
            }
            case 9:
            {
                var markup = this.m_oColumnMarkup;
                var pos = 0;
                if (markup.EqualWidth)
                {
                    var _w = ((markup.R - markup.X) - markup.Space * (markup.Num - 1)) / markup.Num;
                    var _x = markup.X + (this.DragTablePos >> 1) * (_w + markup.Space);
                    if (this.DragTablePos & 1 == 1)
                        _x += _w;

                    pos = _x;
                }
                else
                {
                    var _x = markup.X;

                    var _index = 0;
                    for (var i = 0; i < markup.Cols.length && _index < this.DragTablePos; i++)
                    {
                        if (_index == this.DragTablePos)
                            break;

                        ++_index;
                        _x += markup.Cols[i].W;

                        if (_index == this.DragTablePos)
                            break;

                        ++_index;
                        _x += markup.Cols[i].Space;
                    }

                    pos = _x;
                }

                pos = left + pos * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);

                this.TableMarginLeftTrackStart = markup.X;
                break;
            }
            case 10:
            {
                var markup = this.m_oColumnMarkup;
                var pos = markup.X;

                var _index = 0;
                for (var i = 0; i < markup.Cols.length && i < this.DragTablePos; i++)
                {
                    if (_index == this.DragTablePos)
                        break;

                    pos += markup.Cols[i].W;
                    pos += markup.Cols[i].Space;
                }

                if (this.DragTablePos < markup.Cols.length)
                {
                    pos += markup.Cols[this.DragTablePos].W;
                    pos += markup.Cols[this.DragTablePos].Space / 2;
                }

                pos = left + pos * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
                this.TableMarginLeftTrackStart = markup.X;
                break;
            }
        }

        if (0 == this.DragType)
        {
            // посмотрим - может это добавляется таб
            var _top = 1.8;
            var _bottom = 5.2;

            // tabs
            if (_y >= 3 && _y <= _bottom && _x >= (_margin_left + this.m_dIndentLeft) && _x <= (_margin_right - this.m_dIndentRight))
            {
                var mm_1_4 = 10 / 4;
                var mm_1_8 = mm_1_4 / 2;

                var _new_tab_pos = RulerCorrectPosition(this, _x, _margin_left);
                _new_tab_pos -= _margin_left;

                this.m_arrTabs[this.m_arrTabs.length] = new CTab(_new_tab_pos, word_control.m_nTabsType);
                //this.CorrectTabs();
                word_control.UpdateHorRuler();

                this.m_lCurrentTab = this.m_arrTabs.length - 1;
                /*
                var _len = this.m_arrTabs.length;
                for (var i = 0; i < _len; i++)
                {
                    if (this.m_arrTabs[i].pos == _new_tab_pos)
                    {
                        this.m_lCurrentTab = i;
                        break;
                    }
                }
                */

                this.DragType = 7;
                this.m_dCurrentTabNewPosition = _new_tab_pos;

                var pos = left + (_margin_left + _new_tab_pos) * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.VertLine(pos);
            }
        }

        word_control.m_oDrawingDocument.LockCursorTypeCur();
    }
    this.OnMouseUp = function(left, top, e)
    {
        var word_control = this.m_oWordControl;
        this.m_oWordControl.OnUpdateOverlay();
        var lockedElement = check_MouseUpEvent(e);

        this.m_dIndentLeft_old      = -10000;
        this.m_dIndentLeftFirst_old = -10000;
        this.m_dIndentRight_old     = -10000;

        if (7 != this.DragType)
        {
            word_control.UpdateHorRuler();
            //word_control.m_oOverlayApi.UnShow();
        }

        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        switch (this.DragType)
        {
            case 1:
            case 2:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetMarginProperties();
                break;
            }
            case 3:
            case 4:
            case 5:
            case 6:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetPrProperties();
                else
                    word_control.OnUpdateOverlay();
                break;
            }
            case 7:
            {
                // смотрим, сохраняем ли таб
                var _y = (global_mouseEvent.Y - word_control.Y) * g_dKoef_pix_to_mm;
                if (_y <= 3 || _y > 5.6 || this.m_dCurrentTabNewPosition < this.m_dIndentLeft || (this.m_dCurrentTabNewPosition + _margin_left) > (_margin_right - this.m_dIndentRight))
                {
					if (-1 != this.m_lCurrentTab)
						this.m_arrTabs.splice(this.m_lCurrentTab, 1);
                }
                else
                {
					if (this.m_lCurrentTab < this.m_arrTabs.length)
						this.m_arrTabs[this.m_lCurrentTab].pos = this.m_dCurrentTabNewPosition;
                }

                this.m_lCurrentTab = -1;
                this.CorrectTabs();
                this.m_oWordControl.UpdateHorRuler();
                this.SetTabsProperties();
                break;
            }
            case 8:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetTableProperties();
                this.DragTablePos = -1;
                break;
            }
            case 9:
            case 10:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetColumnsProperties();
                this.DragTablePos = -1;
                break;
            }
        }

        if (7 == this.DragType)
        {
            word_control.UpdateHorRuler();
            //word_control.m_oOverlayApi.UnShow();
        }

        this.IsDrawingCurTab = true;
        this.DragType = 0;
        this.m_bIsMouseDown = false;

        this.m_oWordControl.m_oDrawingDocument.UnlockCursorType();
        this.SimpleChanges.Clear();
    }

    this.OnMouseUpExternal = function()
    {
        var word_control = this.m_oWordControl;
        this.m_oWordControl.OnUpdateOverlay();

        this.m_dIndentLeft_old      = -10000;
        this.m_dIndentLeftFirst_old = -10000;
        this.m_dIndentRight_old     = -10000;

        if (7 != this.DragType)
        {
            word_control.UpdateHorRuler();
            //word_control.m_oOverlayApi.UnShow();
        }

        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        switch (this.DragType)
        {
            case 1:
            case 2:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetMarginProperties();
                break;
            }
            case 3:
            case 4:
            case 5:
            case 6:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetPrProperties();
                break;
            }
            case 7:
            {
                // смотрим, сохраняем ли таб
                var _y = (global_mouseEvent.Y - word_control.Y) * g_dKoef_pix_to_mm;
                if (_y <= 3 || _y > 5.6 || this.m_dCurrentTabNewPosition < this.m_dIndentLeft || (this.m_dCurrentTabNewPosition + _margin_left) > (_margin_right - this.m_dIndentRight))
                {
					if (-1 != this.m_lCurrentTab)
						this.m_arrTabs.splice(this.m_lCurrentTab, 1);
                }
                else
                {
					if (this.m_lCurrentTab < this.m_arrTabs.length)
						this.m_arrTabs[this.m_lCurrentTab].pos = this.m_dCurrentTabNewPosition;
                }
                this.m_lCurrentTab = -1;
                this.CorrectTabs();
                this.m_oWordControl.UpdateHorRuler();
                this.SetTabsProperties();
                break;
            }
            case 8:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetTableProperties();
                this.DragTablePos = -1;
                break;
            }
            case 9:
            case 10:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetColumnsProperties();
                this.DragTablePos = -1;
                break;
            }
        }

        if (7 == this.DragType)
        {
            word_control.UpdateHorRuler();
            //word_control.m_oOverlayApi.UnShow();
        }

        this.IsDrawingCurTab = true;
        this.DragType = 0;
        this.m_bIsMouseDown = false;

        this.m_oWordControl.m_oDrawingDocument.UnlockCursorType();
        this.SimpleChanges.Clear();
    }

    this.SetTabsProperties = function()
    {
        // потом заменить на объекты CTab (когда Илюха реализует не только левые табы)
        var _arr = new CParaTabs();
        var _c = this.m_arrTabs.length;
        for (var i = 0; i < _c; i++)
        {
            if (this.m_arrTabs[i].type == g_tabtype_left)
                _arr.Add( new CParaTab( tab_Left, this.m_arrTabs[i].pos ) );
            else if (this.m_arrTabs[i].type == g_tabtype_right)
                _arr.Add( new CParaTab( tab_Right, this.m_arrTabs[i].pos ) );
            else if (this.m_arrTabs[i].type == g_tabtype_center)
                _arr.Add( new CParaTab( tab_Center, this.m_arrTabs[i].pos ) );
        }
        
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphTabs);
            this.m_oWordControl.m_oLogicDocument.Set_ParagraphTabs(_arr);
        }
    }

    this.SetPrProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Properties) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphIndentFromRulers);
            this.m_oWordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : this.m_dIndentLeft, Right : this.m_dIndentRight,
                FirstLine: (this.m_dIndentLeftFirst - this.m_dIndentLeft) } );
            this.m_oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        }
    }
    this.SetMarginProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetDocumentMargin_Hor);
            this.m_oWordControl.m_oLogicDocument.Set_DocumentMargin( { Left : this.m_dMarginLeft, Right : this.m_dMarginRight });
        }
        //oWordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : this.m_dIndentLeft, Right : this.m_dIndentRight,
        //    FirstLine: (this.m_dIndentLeftFirst - this.m_dIndentLeft) } );
    }

    this.SetTableProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTableMarkup_Hor);

            this.m_oTableMarkup.CorrectTo();
            this.m_oTableMarkup.Table.Update_TableMarkupFromRuler(this.m_oTableMarkup, true, this.DragTablePos);
            this.m_oTableMarkup.CorrectFrom();

            this.m_oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            this.m_oWordControl.m_oLogicDocument.Document_UpdateRulersState();
        }
    }

    this.SetColumnsProperties = function()
    {
        this.m_oWordControl.m_oLogicDocument.Update_ColumnsMarkupFromRuler(this.m_oColumnMarkup);
    }

    this.BlitToMain = function(left, top, htmlElement)
    {
        var _margin_left = this.m_dMarginLeft;
        var _margin_right = this.m_dMarginRight;
        if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE || this.CurrentObjectType == RULER_OBJECT_TYPE_COLUMNS)
        {
            _margin_left = this.TableMarginLeft;
            _margin_right = this.TableMarginRight;
        }

        var checker = this.RepaintChecker;
        if (!checker.BlitAttack && left == checker.BlitLeft && !this.m_bIsMouseDown)
        {
            if (checker.BlitIndentLeft == this.m_dIndentLeft && checker.BlitIndentLeftFirst == this.m_dIndentLeftFirst
                && checker.BlitIndentRight == this.m_dIndentRight && checker.BlitDefaultTab == this.m_dDefaultTab &&
                _margin_left == checker.BlitMarginLeftInd && _margin_right == checker.BlitMarginRightInd)
            {
                // осталось проверить только табы кастомные
                var _count1 = 0;
                if (null != checker.BlitTabs)
                    _count1 = checker.BlitTabs.length;

                var _count2 =  this.m_arrTabs.length;
                if (_count1 == _count2)
                {
                    var bIsBreak = false;
                    for (var ii = 0; ii < _count1; ii++)
                    {
                        if ((checker.BlitTabs[ii].type != this.m_arrTabs[ii].type) || (checker.BlitTabs[ii].pos != this.m_arrTabs[ii].pos))
                        {
                            bIsBreak = true;
                            break;
                        }
                    }
                    if (false === bIsBreak)
                        return;
                }
            }
        }

        checker.BlitAttack = false;
        htmlElement.width = htmlElement.width;
        var context = htmlElement.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (null != this.m_oCanvas)
        {
            checker.BlitLeft = left;
            checker.BlitIndentLeft = this.m_dIndentLeft;
            checker.BlitIndentLeftFirst = this.m_dIndentLeftFirst;
            checker.BlitIndentRight = this.m_dIndentRight;
            checker.BlitDefaultTab = this.m_dDefaultTab;
            checker.BlitTabs = null;
            if (0 != this.m_arrTabs.length)
            {
                checker.BlitTabs = [];
                var _len = this.m_arrTabs.length;
                for (var ii = 0; ii < _len; ii++)
                {
                    checker.BlitTabs[ii] = { type: this.m_arrTabs[ii].type, pos: this.m_arrTabs[ii].pos };
                }
            }

            //context.drawImage(this.m_oCanvas, left - 5, 0, this.m_oCanvas.width, this.m_oCanvas.height,
            //    0, 0, this.m_oCanvas.width, this.m_oCanvas.height);

            if (!this.IsRetina)
            {
                context.drawImage(this.m_oCanvas, 5, 0, this.m_oCanvas.width - 10, this.m_oCanvas.height,
                    left, 0, this.m_oCanvas.width - 10, this.m_oCanvas.height);
            }
            else
            {
                context.drawImage(this.m_oCanvas, 10, 0, this.m_oCanvas.width - 20, this.m_oCanvas.height,
                    left << 1, 0, this.m_oCanvas.width - 20, this.m_oCanvas.height);
                context.setTransform(2, 0, 0, 2, 0, 0);
            }

            if (!this.IsDrawAnyMarkers)
                return;

            var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;

            var dCenterX = 0;
            var var1 = 0;
            var var2 = 0;
            var var3 = 0;
            var var4 = 0;

            var _positon_y = this.m_nBottom - 5;

            context.strokeStyle = "#81878F";
            // не менять!!!
            var2 = 5;//(1.4 * g_dKoef_mm_to_pix) >> 0;
            var3 = 3;//(1 * g_dKoef_mm_to_pix) >> 0;

            checker.BlitMarginLeftInd = _margin_left;
            checker.BlitMarginRightInd = _margin_right;

            // old position --------------------------------------
            context.fillStyle = "#CDD1D6";
            if ((-10000 != this.m_dIndentLeft_old) && (this.m_dIndentLeft_old != this.m_dIndentLeft))
            {
                dCenterX = left + (_margin_left +  this.m_dIndentLeft_old) * dKoef_mm_to_pix;

                var1 = parseInt(dCenterX - 1 * g_dKoef_mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + 1 * g_dKoef_mm_to_pix) + 0.5;

                context.beginPath();
                context.moveTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5 + var2);
                context.lineTo(var1, this.m_nBottom + 0.5 + var2);
                context.lineTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var1, this.m_nBottom + 0.5 - var3);
                context.lineTo((var1 + var4) / 2, this.m_nBottom - var2 * 1.2);
                context.lineTo(var4, this.m_nBottom + 0.5 - var3);
                context.lineTo(var4, this.m_nBottom + 0.5);

                context.fill();
                context.stroke();
            }
            if ((-10000 != this.m_dIndentLeftFirst_old) && (this.m_dIndentLeftFirst_old != this.m_dIndentLeftFirst))
            {
                dCenterX = left + (_margin_left +  this.m_dIndentLeftFirst_old) * dKoef_mm_to_pix;
                var1 = parseInt(dCenterX - 1 * g_dKoef_mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + 1 * g_dKoef_mm_to_pix) + 0.5;

                // first line indent
                context.beginPath();
                context.moveTo(var1, this.m_nTop + 0.5);
                context.lineTo(var1, this.m_nTop + 0.5 - var3);
                context.lineTo(var4, this.m_nTop + 0.5 - var3);
                context.lineTo(var4, this.m_nTop + 0.5);
                context.lineTo((var1 + var4) / 2, this.m_nTop + var2 * 1.2);
                context.closePath();

                context.fill();
                context.stroke();
            }
            if ((-10000 != this.m_dIndentRight_old) && (this.m_dIndentRight_old != this.m_dIndentRight))
            {
                dCenterX = left + (_margin_right -  this.m_dIndentRight_old) * dKoef_mm_to_pix;
                var1 = parseInt(dCenterX - 1 * g_dKoef_mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + 1 * g_dKoef_mm_to_pix) + 0.5;

                context.beginPath();
                context.moveTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5 - var3);
                context.lineTo((var1 + var4) / 2, this.m_nBottom - var2 * 1.2);
                context.lineTo(var1, this.m_nBottom + 0.5 - var3);
                context.closePath();

                context.fill();
                context.stroke();
            }

            if (-1 != this.m_lCurrentTab && this.m_lCurrentTab < this.m_arrTabs.length)
            {
                var _tab = this.m_arrTabs[this.m_lCurrentTab];
                var _x = parseInt((_margin_left + _tab.pos) * dKoef_mm_to_pix) + left;

                var _old_w = context.lineWidth;
                context.lineWidth = 2;
                switch (_tab.type)
                {
                    case g_tabtype_left:
                    {
                        context.beginPath();
                        context.moveTo(_x, _positon_y);
                        context.lineTo(_x, _positon_y + 5);
                        context.lineTo(_x + 5, _positon_y + 5);
                        context.stroke();
                        break;
                    }
                    case g_tabtype_right:
                    {
                        context.beginPath();
                        context.moveTo(_x, _positon_y);
                        context.lineTo(_x, _positon_y + 5);
                        context.lineTo(_x - 5, _positon_y + 5);
                        context.stroke();
                        break;
                    }
                    case g_tabtype_center:
                    {
                        context.beginPath();
                        context.moveTo(_x, _positon_y);
                        context.lineTo(_x, _positon_y + 5);
                        context.moveTo(_x - 5, _positon_y + 5);
                        context.lineTo(_x + 5, _positon_y + 5);
                        context.stroke();
                        break;
                    }
                    default:
                        break;
                }

                context.lineWidth = _old_w;
            }
            
            // ---------------------------------------------------

            // рисуем инденты, только если они корректны
            var posL = _margin_left;
            if ((_margin_left + this.m_dIndentLeft) > posL)
                posL = _margin_left + this.m_dIndentLeft;
            if ((_margin_left + this.m_dIndentLeftFirst) > posL)
                posL = _margin_left + this.m_dIndentLeftFirst;

            var posR = _margin_right;
            if (this.m_dIndentRight > 0)
                posR = _margin_right - this.m_dIndentRight;

            if (posL < posR)
            {
                context.fillStyle = GlobalSkin.RulerMarkersFillColor;

                // left indent
                dCenterX = left + (_margin_left +  this.m_dIndentLeft) * dKoef_mm_to_pix;

                var _1mm_to_pix = g_dKoef_mm_to_pix;

                var1 = parseInt(dCenterX - _1mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + _1mm_to_pix) + 0.5;

                context.beginPath();
                context.moveTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5 + var2);
                context.lineTo(var1, this.m_nBottom + 0.5 + var2);
                context.lineTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var1, this.m_nBottom + 0.5 - var3);
                context.lineTo((var1 + var4) / 2, this.m_nBottom - var2 * 1.2);
                context.lineTo(var4, this.m_nBottom + 0.5 - var3);
                context.lineTo(var4, this.m_nBottom + 0.5);

                context.fill();
                context.stroke();

                // right indent
                dCenterX = left + (_margin_right - this.m_dIndentRight) * dKoef_mm_to_pix;
                var1 = parseInt(dCenterX - _1mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + _1mm_to_pix) + 0.5;

                context.beginPath();
                context.moveTo(var1, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5);
                context.lineTo(var4, this.m_nBottom + 0.5 - var3);
                context.lineTo((var1 + var4) / 2, this.m_nBottom - var2 * 1.2);
                context.lineTo(var1, this.m_nBottom + 0.5 - var3);
                context.closePath();

                context.fill();
                context.stroke();

                // first line indent
                dCenterX = left + (_margin_left +  this.m_dIndentLeftFirst) * dKoef_mm_to_pix;
                var1 = parseInt(dCenterX - _1mm_to_pix) - 0.5;
                var4 = parseInt(dCenterX + _1mm_to_pix) + 0.5;

                context.beginPath();
                context.moveTo(var1, this.m_nTop + 0.5);
                context.lineTo(var1, this.m_nTop + 0.5 - var3);
                context.lineTo(var4, this.m_nTop + 0.5 - var3);
                context.lineTo(var4, this.m_nTop + 0.5);
                context.lineTo((var1 + var4) / 2, this.m_nTop + var2 * 1.2);
                context.closePath();

                context.fill();
                context.stroke();
            }

            // теперь рисуем табы ----------------------------------------
            // default
            var position_default_tab = this.m_dDefaultTab;
            _positon_y = this.m_nBottom + 1.5;

            var _min_default_value = Math.max(0, this.m_dMaxTab);
            if (this.m_dDefaultTab > 0.01)
            {
                while (true)
                {
                    if ((_margin_left + position_default_tab) > this.m_dMarginRight)
                        break;

                    if (position_default_tab < _min_default_value)
                    {
                        position_default_tab += this.m_dDefaultTab;
                        continue;
                    }

                    var _x = parseInt((_margin_left + position_default_tab) * dKoef_mm_to_pix) + left + 0.5;
                    context.beginPath();
                    context.moveTo(_x, _positon_y);
                    context.lineTo(_x, _positon_y + 3);
                    context.stroke();

                    position_default_tab += this.m_dDefaultTab;
                }
            }

            // custom tabs
            var _len_tabs = this.m_arrTabs.length;
            if (0 != _len_tabs)
            {
                context.strokeStyle = "#000000";
                context.lineWidth = 2;

                _positon_y = this.m_nBottom - 5;
                for (var i = 0; i < _len_tabs; i++)
                {
                    var tab = this.m_arrTabs[i];
                    var _x = 0;

                    if (i == this.m_lCurrentTab)
                    {
                        if (!this.IsDrawingCurTab)
                            continue;
                        // рисуем вместо него - позицию нового
                        _x = parseInt((_margin_left + this.m_dCurrentTabNewPosition) * dKoef_mm_to_pix) + left;
                    }
                    else
                    {
                        //if (tab.pos < 0 || tab.pos > this.m_dMarginRight)
                        if (tab.pos < this.m_dIndentLeft || (tab.pos + _margin_left) > (_margin_right - this.m_dIndentRight))
                            continue;

                        _x = parseInt((_margin_left + tab.pos) * dKoef_mm_to_pix) + left;
                    }

                    switch (tab.type)
                    {
                        case g_tabtype_left:
                        {
                            context.beginPath();
                            context.moveTo(_x, _positon_y);
                            context.lineTo(_x, _positon_y + 5);
                            context.lineTo(_x + 5, _positon_y + 5);
                            context.stroke();
                            break;
                        }
                        case g_tabtype_right:
                        {
                            context.beginPath();
                            context.moveTo(_x, _positon_y);
                            context.lineTo(_x, _positon_y + 5);
                            context.lineTo(_x - 5, _positon_y + 5);
                            context.stroke();
                            break;
                        }
                        case g_tabtype_center:
                        {
                            context.beginPath();
                            context.moveTo(_x, _positon_y);
                            context.lineTo(_x, _positon_y + 5);
                            context.moveTo(_x - 5, _positon_y + 5);
                            context.lineTo(_x + 5, _positon_y + 5);
                            context.stroke();
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            // -----------------------------------------------------------
        }
    }
}

function CVerRuler()
{
    this.m_oPage        = null;

    this.m_nLeft         = 0;        // �������� � �������� - �������� �� ����� �������
    this.m_nRight      = 0;          // �������� � �������� - �������� �� ����� �������
    // (�.�. ������ ������� � �������� = (this.m_nRight - this.m_nLeft))

    this.m_dMarginTop           = 20;
    this.m_dMarginBottom        = 250;

    this.m_oCanvas              = null;

    this.m_dZoom                = 1;

    this.DragType = 0;          // 0 - none
                                // 1 - top margin, 2 - bottom margin
                                // 3 - header_top, 4 - header_bottom
                                // 5 - table rows

    // отдельные настройки для текущего объекта линейки
    this.CurrentObjectType  = RULER_OBJECT_TYPE_PARAGRAPH;
    this.m_oTableMarkup     = null;
    this.header_top         = 0;
    this.header_bottom      = 0;

    this.DragTablePos       = -1;

    this.RepaintChecker     = new CVerRulerRepaintChecker();

    // presentations addons
    this.IsCanMoveMargins = true;

    this.m_oWordControl = null;
    this.IsRetina = false;

    this.SimpleChanges = new RulerCheckSimpleChanges();

    this.Units = c_oAscDocumentUnits.Millimeter;

    this.CheckCanvas = function()
    {
        this.m_dZoom = this.m_oWordControl.m_nZoomValue / 100;
        this.IsRetina = this.m_oWordControl.bIsRetinaSupport;

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;
        if (this.IsRetina)
            dKoef_mm_to_pix *= 2;

        var heightNew    = dKoef_mm_to_pix * this.m_oPage.height_mm;

        var _height      = 10 + heightNew;
        if (this.IsRetina)
            _height += 10;

        var _width       = 5 * g_dKoef_mm_to_pix;

        if (this.IsRetina)
            _width *= 2;

        var intW = _width >> 0;
        var intH = _height >> 0;
        if (null == this.m_oCanvas)
        {
            this.m_oCanvas = document.createElement('canvas');
            this.m_oCanvas.width    = intW;
            this.m_oCanvas.height   = intH;
        }
        else
        {
            var oldW = this.m_oCanvas.width;
            var oldH = this.m_oCanvas.height;

            if ((oldW != intW) || (oldH != intH))
            {
                delete this.m_oCanvas;
                this.m_oCanvas = document.createElement('canvas');
                this.m_oCanvas.width    = intW;
                this.m_oCanvas.height   = intH;
            }
        }
        return heightNew;
    }

    this.CreateBackground = function(cachedPage, isattack)
    {
        if (window["NATIVE_EDITOR_ENJINE"])
            return;
            
        if (null == cachedPage || undefined == cachedPage)
            return;
        
        this.m_oPage = cachedPage;
        var height = this.CheckCanvas();

        if (this.IsRetina)
            height >>= 1;

        if (0 == this.DragType)
        {
            this.m_dMarginTop       = cachedPage.margin_top;
            this.m_dMarginBottom    = cachedPage.margin_bottom;
        }

        // check old state
        var checker = this.RepaintChecker;
        var markup = this.m_oTableMarkup;

        if (isattack !== true && this.CurrentObjectType == checker.Type && height == checker.Height)
        {
            if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
            {
                if (this.m_dMarginTop == checker.MarginTop && this.m_dMarginBottom == checker.MarginBottom)
                    return;
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_HEADER || this.CurrentObjectType == RULER_OBJECT_TYPE_FOOTER)
            {
                if (this.header_top == checker.HeaderTop && this.header_bottom == checker.HeaderBottom)
                    return;
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
            {
                var oldcount = checker.rowsY.length;
                var newcount = markup.Rows.length;

                if (oldcount == newcount)
                {
                    var arr1 = checker.rowsY;
                    var arr2 = checker.rowsH;

                    var rows = markup.Rows;

                    var _break = false;
                    for (var i = 0; i < oldcount; i++)
                    {
                        if ((arr1[i] != rows[i].Y) || (arr2[i] != rows[i].H))
                        {
                            _break = true;
                            break;
                        }
                    }

                    if (!_break)
                        return;
                }
            }
        }

        //console.log("vertical");

        checker.Height = height;
        checker.Type = this.CurrentObjectType;
        checker.BlitAttack = true;

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;

        // не править !!!
        this.m_nLeft   = 3;//(0.8 * g_dKoef_mm_to_pix) >> 0;
        this.m_nRight  = 15;//(4.2 * g_dKoef_mm_to_pix) >> 0;

        var context = this.m_oCanvas.getContext('2d');
        if (!this.IsRetina)
            context.setTransform(1, 0, 0, 1, 0, 5);
        else
            context.setTransform(2, 0, 0, 2, 0, 10);

        context.fillStyle = GlobalSkin.BackgroundColor;
        context.fillRect(0, 0, this.m_oCanvas.width, this.m_oCanvas.height);

        var top_margin = 0;
        var bottom_margin = 0;

        if (RULER_OBJECT_TYPE_PARAGRAPH == this.CurrentObjectType)
        {
            top_margin = (this.m_dMarginTop * dKoef_mm_to_pix) >> 0;
            bottom_margin = (this.m_dMarginBottom * dKoef_mm_to_pix) >> 0;

            checker.MarginTop = this.m_dMarginTop;
            checker.MarginBottom = this.m_dMarginBottom;
        }
        else if (RULER_OBJECT_TYPE_HEADER == this.CurrentObjectType || RULER_OBJECT_TYPE_FOOTER == this.CurrentObjectType)
        {
            top_margin = (this.header_top * dKoef_mm_to_pix) >> 0;
            bottom_margin = (this.header_bottom * dKoef_mm_to_pix) >> 0;

            checker.HeaderTop = this.header_top;
            checker.HeaderBottom = this.header_bottom;
        }
        else if (RULER_OBJECT_TYPE_TABLE == this.CurrentObjectType)
        {
            var _arr1 = checker.rowsY;
            var _arr2 = checker.rowsH;

            if (0 != _arr1.length)
                _arr1.splice(0, _arr1.length);

            if (0 != _arr2.length)
                _arr2.splice(0, _arr2.length);

            var _count = this.m_oTableMarkup.Rows.length;

            for (var i = 0; i < _count; i++)
            {
                _arr1[i] = markup.Rows[i].Y;
                _arr2[i] = markup.Rows[i].H;
            }

            if (_count != 0)
            {
                top_margin = (markup.Rows[0].Y * dKoef_mm_to_pix) >> 0;
                bottom_margin = ((markup.Rows[_count - 1].Y + markup.Rows[_count - 1].H) * dKoef_mm_to_pix) >> 0;
            }
        }

        if (bottom_margin > top_margin)
        {
            context.fillStyle = GlobalSkin.RulerLight;
            context.fillRect(this.m_nLeft + 0.5, top_margin + 0.5, this.m_nRight - this.m_nLeft, bottom_margin - top_margin);
        }

        var intH = height >> 0;

        if (window["flat_desine"] === true)
        {
            context.beginPath();
            context.fillStyle = GlobalSkin.RulerDark;

            context.fillRect(this.m_nLeft + 0.5, 0.5, this.m_nRight - this.m_nLeft, top_margin);
            context.fillRect(this.m_nLeft + 0.5, bottom_margin + 0.5, this.m_nRight - this.m_nLeft, Math.max(intH - bottom_margin, 1));
            context.beginPath();
        }

        // �����
        context.strokeStyle = GlobalSkin.RulerOutline;

        context.lineWidth = 1;
        context.strokeRect(this.m_nLeft + 0.5, 0.5, this.m_nRight - this.m_nLeft, Math.max(intH - 1, 1));
        context.beginPath();
        context.moveTo(this.m_nLeft + 0.5, top_margin + 0.5);
        context.lineTo(this.m_nRight - 0.5, top_margin + 0.5);

        context.moveTo(this.m_nLeft + 0.5, bottom_margin + 0.5);
        context.lineTo(this.m_nRight - 0.5, bottom_margin + 0.5);

        context.stroke();
        context.beginPath();

        context.strokeStyle = "#585B5E";
        context.fillStyle = "#585B5E";

        var mm_1_4 = 10 * dKoef_mm_to_pix / 4;
        var inch_1_8 = 25.4 * dKoef_mm_to_pix / 8;

        var middleHor = (this.m_nLeft + this.m_nRight) / 2;
        var part1 = 1;
        var part2 = 2.5;

        context.font = "7pt Arial";

        if (this.Units == c_oAscDocumentUnits.Millimeter)
        {
            var lCount1 = ((height - top_margin) / mm_1_4) >> 0;
            var lCount2 = (top_margin / mm_1_4) >> 0;

        var index = 0;
        var num = 0;
        for (var i = 1; i < lCount1; i++)
        {
            var lYPos = ((top_margin + i * mm_1_4) >> 0) + 0.5;
            index++;

            if (index == 4)
                index = 0;

            if (0 == index)
            {
                num++;
                // number

                var strNum = "" + num;
                var lWidthText = context.measureText(strNum).width;

                context.translate(middleHor, lYPos);
                context.rotate(-Math.PI / 2);
                context.fillText(strNum, -lWidthText / 2.0, 4);

                if (!this.IsRetina)
                    context.setTransform(1, 0, 0, 1, 0, 5);
                else
                    context.setTransform(2, 0, 0, 2, 0, 10);
            }
            else if (1 == index)
            {
                // 1/4
                context.beginPath();
                context.moveTo(middleHor - part1, lYPos);
                context.lineTo(middleHor + part1, lYPos);
                context.stroke();
            }
            else if (2 == index)
            {
                // 1/2
                context.beginPath();
                context.moveTo(middleHor - part2, lYPos);
                context.lineTo(middleHor + part2, lYPos);
                context.stroke();
            }
            else
            {
                // 1/4
                context.beginPath();
                context.moveTo(middleHor - part1, lYPos);
                context.lineTo(middleHor + part1, lYPos);
                context.stroke();
            }
        }

        index = 0;
        num = 0;
        for (var i = 1; i <= lCount2; i++)
        {
            var lYPos = ((top_margin - i * mm_1_4) >> 0) + 0.5;
            index++;

            if (index == 4)
                index = 0;

            if (0 == index)
            {
                num++;
                // number
                var strNum = "" + num;
                var lWidthText = context.measureText(strNum).width;

                context.translate(middleHor, lYPos);
                context.rotate(-Math.PI / 2);
                context.fillText(strNum, -lWidthText / 2.0, 4);

                if (!this.IsRetina)
                    context.setTransform(1, 0, 0, 1, 0, 5);
                else
                    context.setTransform(2, 0, 0, 2, 0, 10);
            }
            else if (1 == index)
            {
                // 1/4
                context.beginPath();
                context.moveTo(middleHor - part1, lYPos);
                context.lineTo(middleHor + part1, lYPos);
                context.stroke();
            }
            else if (2 == index)
            {
                // 1/2
                context.beginPath();
                context.moveTo(middleHor - part2, lYPos);
                context.lineTo(middleHor + part2, lYPos);
                context.stroke();
            }
            else
            {
                // 1/4
                context.beginPath();
                context.moveTo(middleHor - part1, lYPos);
                context.lineTo(middleHor + part1, lYPos);
                context.stroke();
            }
        }
        }
        else if (this.Units == c_oAscDocumentUnits.Inch)
        {
            var lCount1 = ((height - top_margin) / inch_1_8) >> 0;
            var lCount2 = (top_margin / inch_1_8) >> 0;

            var index = 0;
            var num = 0;
            for (var i = 1; i < lCount1; i++)
            {
                var lYPos = ((top_margin + i * inch_1_8) >> 0) + 0.5;
                index++;

                if (index == 8)
                    index = 0;

                if (0 == index)
                {
                    num++;
                    // number

                    var strNum = "" + num;
                    var lWidthText = context.measureText(strNum).width;

                    context.translate(middleHor, lYPos);
                    context.rotate(-Math.PI / 2);
                    context.fillText(strNum, -lWidthText / 2.0, 4);

                    if (!this.IsRetina)
                        context.setTransform(1, 0, 0, 1, 0, 5);
                    else
                        context.setTransform(2, 0, 0, 2, 0, 10);
                }
                else if (4 == index)
                {
                    // 1/2
                    context.beginPath();
                    context.moveTo(middleHor - part2, lYPos);
                    context.lineTo(middleHor + part2, lYPos);
                    context.stroke();
                }
                else if (inch_1_8 > 8)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(middleHor - part1, lYPos);
                    context.lineTo(middleHor + part1, lYPos);
                    context.stroke();
                }
            }

            index = 0;
            num = 0;
            for (var i = 1; i <= lCount2; i++)
            {
                var lYPos = ((top_margin - i * inch_1_8) >> 0) + 0.5;
                index++;

                if (index == 8)
                    index = 0;

                if (0 == index)
                {
                    num++;
                    // number
                    var strNum = "" + num;
                    var lWidthText = context.measureText(strNum).width;

                    context.translate(middleHor, lYPos);
                    context.rotate(-Math.PI / 2);
                    context.fillText(strNum, -lWidthText / 2.0, 4);

                    if (!this.IsRetina)
                        context.setTransform(1, 0, 0, 1, 0, 5);
                    else
                        context.setTransform(2, 0, 0, 2, 0, 10);
                }
                else if (4 == index)
                {
                    // 1/2
                    context.beginPath();
                    context.moveTo(middleHor - part2, lYPos);
                    context.lineTo(middleHor + part2, lYPos);
                    context.stroke();
                }
                else if (inch_1_8 > 8)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(middleHor - part1, lYPos);
                    context.lineTo(middleHor + part1, lYPos);
                    context.stroke();
                }
            }
        }
        else if (this.Units == c_oAscDocumentUnits.Point)
        {
            var point_1_12 = 25.4 * dKoef_mm_to_pix / 12;

            var lCount1 = ((height - top_margin) / point_1_12) >> 0;
            var lCount2 = (top_margin / point_1_12) >> 0;

            var index = 0;
            var num = 0;
            for (var i = 1; i < lCount1; i++)
            {
                var lYPos = ((top_margin + i * point_1_12) >> 0) + 0.5;
                index++;

                if (index == 12)
                    index = 0;

                if (0 == index || 6 == index)
                {
                    num++;
                    // number

                    var strNum = "" + (num * 36);
                    var lWidthText = context.measureText(strNum).width;

                    context.translate(middleHor, lYPos);
                    context.rotate(-Math.PI / 2);
                    context.fillText(strNum, -lWidthText / 2.0, 4);

                    if (!this.IsRetina)
                        context.setTransform(1, 0, 0, 1, 0, 5);
                    else
                        context.setTransform(2, 0, 0, 2, 0, 10);
                }
                else if (point_1_12 > 5)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(middleHor - part1, lYPos);
                    context.lineTo(middleHor + part1, lYPos);
                    context.stroke();
                }
            }

            index = 0;
            num = 0;
            for (var i = 1; i <= lCount2; i++)
            {
                var lYPos = ((top_margin - i * point_1_12) >> 0) + 0.5;
                index++;

                if (index == 12)
                    index = 0;

                if (0 == index || 6 == index)
                {
                    num++;
                    // number
                    var strNum = "" + (num * 36);
                    var lWidthText = context.measureText(strNum).width;

                    context.translate(middleHor, lYPos);
                    context.rotate(-Math.PI / 2);
                    context.fillText(strNum, -lWidthText / 2.0, 4);

                    if (!this.IsRetina)
                        context.setTransform(1, 0, 0, 1, 0, 5);
                    else
                        context.setTransform(2, 0, 0, 2, 0, 10);
                }
                else if (point_1_12 > 5)
                {
                    // 1/8
                    context.beginPath();
                    context.moveTo(middleHor - part1, lYPos);
                    context.lineTo(middleHor + part1, lYPos);
                    context.stroke();
                }
            }
        }

        if ((this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE) && (null != markup))
        {
            var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;

            // не будет нулевых таблиц.
            var _count = markup.Rows.length;

            if (0 == _count)
                return;

            var start_dark = (((markup.Rows[0].Y + markup.Rows[0].H) * dKoef_mm_to_pix) >> 0) + 0.5;
            var end_dark = 0;

            context.fillStyle = GlobalSkin.RulerDark;
            context.strokeStyle = GlobalSkin.RulerOutline;

            var _x = this.m_nLeft + 0.5;
            var _w = this.m_nRight - this.m_nLeft;
            for (var i = 1; i < _count; i++)
            {
                end_dark = ((markup.Rows[i].Y * dKoef_mm_to_pix) >> 0) + 0.5;
                context.fillRect(_x, start_dark, _w, Math.max(end_dark - start_dark, 7));
                context.strokeRect(_x, start_dark, _w, Math.max(end_dark - start_dark, 7));

                start_dark = (((markup.Rows[i].Y + markup.Rows[i].H) * dKoef_mm_to_pix) >> 0) + 0.5;
            }
        }
    }

    this.OnMouseMove = function(left, top, e)
    {
        var word_control = this.m_oWordControl;
        check_MouseMoveEvent(e);

        this.SimpleChanges.CheckMove();
        var ver_ruler = word_control.m_oLeftRuler_vertRuler;
        var dKoefPxToMM = 100 * g_dKoef_pix_to_mm / word_control.m_nZoomValue;

        // ������ ���������� ������� ������������ ����� �������. ��� � �����������
        var _y = global_mouseEvent.Y - 7 * g_dKoef_mm_to_pix - top - word_control.Y;
        _y *= dKoefPxToMM;
        var _x = left * g_dKoef_pix_to_mm;

        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;
        var mm_1_4 = 10 / 4;
        var mm_1_8 = mm_1_4 / 2;

        switch (this.DragType)
        {
            case 0:
            {
                if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
                {
                    if (this.IsCanMoveMargins && ((Math.abs(_y - this.m_dMarginTop) < 1) || (Math.abs(_y - this.m_dMarginBottom) < 1)))
                        word_control.m_oDrawingDocument.SetCursorType("s-resize");
                    else
                        word_control.m_oDrawingDocument.SetCursorType("default");
                }
                else if (this.CurrentObjectType == RULER_OBJECT_TYPE_HEADER)
                {
                    if ((Math.abs(_y - this.header_top) < 1) || (Math.abs(_y - this.header_bottom) < 1))
                        word_control.m_oDrawingDocument.SetCursorType("s-resize");
                    else
                        word_control.m_oDrawingDocument.SetCursorType("default");
                }
                else if (this.CurrentObjectType == RULER_OBJECT_TYPE_FOOTER)
                {
                    if (Math.abs(_y - this.header_top) < 1)
                        word_control.m_oDrawingDocument.SetCursorType("s-resize");
                    else
                        word_control.m_oDrawingDocument.SetCursorType("default");
                }
                else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE)
                {
                    var type = this.CheckMouseType(2, _y);
                    if (type == 5)
                        word_control.m_oDrawingDocument.SetCursorType("s-resize");
                    else
                        word_control.m_oDrawingDocument.SetCursorType("default");
                }

                break;
            }
            case 1:
            {
                var newVal = RulerCorrectPosition(this, _y, this.m_dMarginTop);

                if (newVal > (this.m_dMarginBottom - 30))
                    newVal = this.m_dMarginBottom - 30;
                if (newVal < 0)
                    newVal = 0;

                this.m_dMarginTop = newVal;
                word_control.UpdateVerRulerBack();

                var pos = top + this.m_dMarginTop * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("s-resize");

                break;
            }
            case 2:
            {
                var newVal = RulerCorrectPosition(this, _y, this.m_dMarginTop);

                if (newVal < (this.m_dMarginTop + 30))
                    newVal = this.m_dMarginTop + 30;
                if (newVal > this.m_oPage.height_mm)
                    newVal = this.m_oPage.height_mm;

                this.m_dMarginBottom = newVal;
                word_control.UpdateVerRulerBack();

                var pos = top + this.m_dMarginBottom * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("s-resize");

                break;
            }
            case 3:
            {
                var newVal = RulerCorrectPosition(this, _y, this.m_dMarginTop);

                if (newVal > this.header_bottom)
                    newVal = this.header_bottom;
                if (newVal < 0)
                    newVal = 0;

                this.header_top = newVal;
                word_control.UpdateVerRulerBack();

                var pos = top + this.header_top * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("s-resize");

                break;
            }
            case 4:
            {
                var newVal = RulerCorrectPosition(this, _y, this.m_dMarginTop);

                if (newVal < 0)
                    newVal = 0;
                if (newVal > this.m_oPage.height_mm)
                    newVal = this.m_oPage.height_mm;

                this.header_bottom = newVal;
                word_control.UpdateVerRulerBack();

                var pos = top + this.header_bottom * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("s-resize");

                break;
            }
            case 5:
            {
                // сначала нужно определить минимум и максимум сдвига
                var _min = 0;
                var _max = this.m_oPage.height_mm;

                if (0 < this.DragTablePos)
                {
                    _min = this.m_oTableMarkup.Rows[this.DragTablePos - 1].Y;
                }
                if (this.DragTablePos < this.m_oTableMarkup.Rows.length)
                {
                    _max = this.m_oTableMarkup.Rows[this.DragTablePos].Y + this.m_oTableMarkup.Rows[this.DragTablePos].H;
                }

                var newVal = RulerCorrectPosition(this, _y, this.m_dMarginTop);

                if (newVal < _min)
                    newVal = _min;
                if (newVal > _max)
                    newVal = _max;

                if (0 == this.DragTablePos)
                {
                    var _bottom = this.m_oTableMarkup.Rows[0].Y + this.m_oTableMarkup.Rows[0].H;
                    this.m_oTableMarkup.Rows[0].Y = newVal;
                    this.m_oTableMarkup.Rows[0].H = _bottom - newVal;
                }
                else
                {
                    var oldH = this.m_oTableMarkup.Rows[this.DragTablePos - 1].H;
                    this.m_oTableMarkup.Rows[this.DragTablePos - 1].H = newVal - this.m_oTableMarkup.Rows[this.DragTablePos - 1].Y;

                    var delta = this.m_oTableMarkup.Rows[this.DragTablePos - 1].H - oldH;
                    for (var i = this.DragTablePos; i < this.m_oTableMarkup.Rows.length; i++)
                    {
                        this.m_oTableMarkup.Rows[i].Y += delta;
                    }
                }

                word_control.UpdateVerRulerBack();

                var pos = top + newVal * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);

                word_control.m_oDrawingDocument.SetCursorType("s-resize");
            }
        }
    }

    this.CheckMouseType = function(x, y)
    {
        if (this.IsCanMoveMargins === false)
            return 0;

        if (x >= 0.8 && x <= 4.2)
        {
            if (this.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
            {
                if (Math.abs(y - this.m_dMarginTop) < 1)
                {
                    return 1;
                }
                else if (Math.abs(y - this.m_dMarginBottom) < 1)
                {
                    return 2;
                }
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_HEADER)
            {
                if (Math.abs(y - this.header_top) < 1)
                {
                    return 3;
                }
                else if (Math.abs(y - this.header_bottom) < 1)
                {
                    return 4;
                }
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_FOOTER)
            {
                if (Math.abs(y - this.header_top) < 1)
                {
                    return 3;
                }
            }
            else if (this.CurrentObjectType == RULER_OBJECT_TYPE_TABLE && null != this.m_oTableMarkup)
            {
                // не будет нулевых таблиц.
                var markup = this.m_oTableMarkup;
                var _count = markup.Rows.length;

                if (0 == _count)
                    return 0;

                var _start = markup.Rows[0].Y;
                var _end = _start - 2;

                for (var i = 0; i <= _count; i++)
                {
                    if (i == _count)
                    {
                        _end = markup.Rows[i - 1].Y + markup.Rows[i - 1].H;
                        _start = _end + 2;
                    }
                    else if (i != 0)
                    {
                        _end = markup.Rows[i - 1].Y + markup.Rows[i - 1].H;
                        _start = markup.Rows[i].Y;
                    }

                    if ((_end - 1) < y && y < (_start + 1))
                    {
                        this.DragTablePos = i;
                        return 5;
                    }
                }
            }
        }
        return 0;
    }

    this.OnMouseDown = function(left, top, e)
    {
        var word_control = this.m_oWordControl;
        check_MouseDownEvent(e);

        this.SimpleChanges.Reinit();
        global_mouseEvent.LockMouse();

        var dKoefPxToMM = 100 * g_dKoef_pix_to_mm / word_control.m_nZoomValue;
        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_dZoom;

        var _y = global_mouseEvent.Y - 7 * g_dKoef_mm_to_pix - top - word_control.Y;
        _y *= dKoefPxToMM;
        var _x = (global_mouseEvent.X - word_control.X) * g_dKoef_pix_to_mm - word_control.m_oMainContent.AbsolutePosition.L;

        this.DragType = this.CheckMouseType(_x, _y);

        switch (this.DragType)
        {
            case 1:
            {
                var pos = top + this.m_dMarginTop * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);
                break;
            }
            case 2:
            {
                var pos = top + this.m_dMarginBottom * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);
                break;
            }
            case 3:
            {
                var pos = top + this.header_top * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);
                break;
            }
            case 4:
            {
                var pos = top + this.header_bottom * dKoef_mm_to_pix;
                word_control.m_oOverlayApi.HorLine(pos);
                break;
            }
            case 5:
            {
                var pos = 0;
                if (0 == this.DragTablePos)
                {
                    pos = top + this.m_oTableMarkup.Rows[0].Y * dKoef_mm_to_pix;
                    word_control.m_oOverlayApi.HorLine(pos);
                }
                else
                {
                    pos = top + (this.m_oTableMarkup.Rows[this.DragTablePos - 1].Y + this.m_oTableMarkup.Rows[this.DragTablePos - 1].H) * dKoef_mm_to_pix;
                    word_control.m_oOverlayApi.HorLine(pos);
                }
            }
        }

        word_control.m_oDrawingDocument.LockCursorTypeCur();
    }

    this.OnMouseUp = function(left, top, e)
    {
        var lockedElement = check_MouseUpEvent(e);

        //this.m_oWordControl.m_oOverlayApi.UnShow();
        this.m_oWordControl.OnUpdateOverlay();

        switch (this.DragType)
        {
            case 1:
            case 2:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetMarginProperties();
                break;
            }
            case 3:
            case 4:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetHeaderProperties();
                break;
            }
            case 5:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetTableProperties();
                this.DragTablePos = -1;
                break;
            }
        }

        this.DragType = 0;
        this.m_oWordControl.m_oDrawingDocument.UnlockCursorType();

        this.SimpleChanges.Clear();
    }

    this.OnMouseUpExternal = function()
    {
        //this.m_oWordControl.m_oOverlayApi.UnShow();
        this.m_oWordControl.OnUpdateOverlay();

        switch (this.DragType)
        {
            case 1:
            case 2:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetMarginProperties();
                break;
            }
            case 3:
            case 4:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetHeaderProperties();
                break;
            }
            case 5:
            {
                if (!this.SimpleChanges.IsSimple)
                    this.SetTableProperties();
                this.DragTablePos = -1;
                break;
            }
        }

        this.DragType = 0;
        this.m_oWordControl.m_oDrawingDocument.UnlockCursorType();

        this.SimpleChanges.Clear();
    }

    this.BlitToMain = function(left, top, htmlElement)
    {
        if (!this.RepaintChecker.BlitAttack && top == this.RepaintChecker.BlitTop)
            return;
        this.RepaintChecker.BlitTop = top;
        this.RepaintChecker.BlitAttack = false;

        htmlElement.width = htmlElement.width;
        var context = htmlElement.getContext('2d');

        if (null != this.m_oCanvas)
        {
            if (!this.IsRetina)
            {
                context.drawImage(this.m_oCanvas, 0, 5, this.m_oCanvas.width, this.m_oCanvas.height - 10,
                    0, top, this.m_oCanvas.width, this.m_oCanvas.height - 10);
            }
            else
            {
                context.drawImage(this.m_oCanvas, 0, 10, this.m_oCanvas.width, this.m_oCanvas.height - 20,
                    0, top << 1, this.m_oCanvas.width, this.m_oCanvas.height - 20);
            }
        }
    }

    // выставление параметров логическому документу
    this.SetMarginProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetDocumentMargin_Ver);
            this.m_oWordControl.m_oLogicDocument.Set_DocumentMargin( { Top : this.m_dMarginTop, Bottom : this.m_dMarginBottom });
        }
    }
    this.SetHeaderProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_HdrFtr) )
        {
            // TODO: в данной функции при определенных параметрах может меняться верхнее поле. Поэтому, надо
            //       вставить проверку на залоченность с типом changestype_Document_SectPr

            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetHdrFtrBounds);
            this.m_oWordControl.m_oLogicDocument.Document_SetHdrFtrBounds(this.header_top, this.header_bottom);
        }
    }
    this.SetTableProperties = function()
    {
        if ( false === this.m_oWordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties) )
        {
            this.m_oWordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTableMarkup_Ver);

            this.m_oTableMarkup.CorrectTo();
            this.m_oTableMarkup.Table.Update_TableMarkupFromRuler(this.m_oTableMarkup, false, this.DragTablePos);
            this.m_oTableMarkup.CorrectFrom();
        }
    }
}
