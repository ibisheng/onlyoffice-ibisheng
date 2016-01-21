
window["Asc"].WorksheetView = WorksheetView;

WorksheetView.prototype._drawColumnHeaders_Local = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
    if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
        return;

    var range = new asc_Range(start, 0, end, 1);
    this._prepareCellTextMetricsCache(range);

    var vr  = this.visibleRange;
    var c = this.cols;
    var offsetX = (undefined !== offsetXForDraw) ? offsetXForDraw : c[vr.c1].left - this.cellsLeft;
    var offsetY = (undefined !== offsetYForDraw) ? offsetYForDraw : this.headersTop;
    if (undefined === drawingCtx && this.topLeftFrozenCell && undefined === offsetXForDraw) {
        var cFrozen = this.topLeftFrozenCell.getCol0();
        if (start < vr.c1)
            offsetX = c[0].left - this.cellsLeft;
        else
            offsetX -= c[cFrozen].left - c[0].left;
    }

    if (asc_typeof(start) !== "number") {start = vr.c1;}
    if (asc_typeof(end) !== "number") {end = vr.c2;}
    if (style === undefined) {style = kHeaderDefault;}

    this._setFont(drawingCtx, this.model.getDefaultFontName(), this.model.getDefaultFontSize());

    var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
    var st = this.settings.header.style[style];
    ctx.setFillStyle(st.border)
        .fillRect( - offsetX, offsetY, c[end].left - c[start].left, this.headersHeight * 2);

    // draw column headers
    for (var i = start; i <= end; ++i) {
        this._drawHeader_Local(drawingCtx, c[i].left - c[start].left - offsetX, offsetY,
            c[i].width, this.headersHeight, style, true, i);
    }
};

WorksheetView.prototype._drawHeader_Local = function (drawingCtx, x, y, w, h, style, isColHeader, index) {
    // Для отрисовки невидимого столбца/строки
    var isZeroHeader = false;
    if (-1 !== index) {
        if (isColHeader) {
            if (w < this.width_1px) {
                // Это невидимый столбец
                isZeroHeader = true;
                // Отрисуем только границу
                w = this.width_1px;
                // Возможно мы уже рисовали границу невидимого столбца (для последовательности невидимых)
                if (0 < index && 0 === this.cols[index - 1].width) {
                    // Мы уже нарисовали border для невидимой границы
                    return;
                }
            } else if (0 < index && 0 === this.cols[index - 1].width) {
                // Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседнего столбца)
                w -= this.width_1px;
                x += this.width_1px;
            }
        } else {
            if (h < this.height_1px) {
                // Это невидимая строка
                isZeroHeader = true;
                // Отрисуем только границу
                h = this.height_1px;
                // Возможно мы уже рисовали границу невидимой строки (для последовательности невидимых)
                if (0 < index && 0 === this.rows[index - 1].height) {
                    // Мы уже нарисовали border для невидимой границы
                    return;
                }
            } else if (0 < index && 0 === this.rows[index - 1].height) {
                // Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседней строки)
                h -= this.height_1px;
                y += this.height_1px;
            }
        }
    }

    var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
    var st = this.settings.header.style[style];
    var x2 = x + w;
    var y2 = y + h;
    var x2WithoutBorder = x2 - this.width_1px;
    var y2WithoutBorder = y2 - this.height_1px;

    // background только для видимых
    if (!isZeroHeader) {
        // draw background
        ctx.setFillStyle(st.background)
            .fillRect(x, y, w + 20, h + 20);
    }
    // draw border
    ctx.setStrokeStyle(st.border)
        .setLineWidth(1)
        .beginPath();
    if (style !== kHeaderDefault && !isColHeader) {
        // Select row (top border)
        ctx.lineHorPrevPx(x, y, x2);
    }

    // Right border
    if (isColHeader) ctx.lineVerPrevPx(x2, y, y2);
    // Bottom border
    if (!isColHeader)ctx.lineHorPrevPx(x, y2, x2);

    if (style !== kHeaderDefault && isColHeader) {
        // Select col (left border)
        //ctx.lineVerPrevPx(x, y, y2);
    }
    ctx.stroke();

    // Для невидимых кроме border-а ничего не рисуем
    if (isZeroHeader || -1 === index)
        return;

    // draw text
    var text  = isColHeader ? this._getColumnTitle(index) : this._getRowTitle(index);
    var sr    = this.stringRender;
    var tm    = this._roundTextMetrics( sr.measureString(text) );
    var bl    = y2WithoutBorder - (isColHeader ? this.defaultRowDescender : this.rows[index].descender);
    var textX = this._calcTextHorizPos(x, x2WithoutBorder, tm, tm.width < w ? khaCenter : khaLeft);
    var textY = this._calcTextVertPos(y, y2WithoutBorder, bl, tm, kvaBottom);
    if (drawingCtx) {
        ctx.AddClipRect(x, y, w, h);
        ctx.setFillStyle(st.color)
            .fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths);
        ctx.RemoveClipRect();
    } else {
        ctx.save()
            .beginPath()
            .rect(x, y, w, h)
            .clip()
            .setFillStyle(st.color)
            .fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths)
            .restore();
    }
};

WorksheetView.prototype._drawRowHeaders_Local = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
    if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
        return;

    var range = new asc_Range(0, start, 1, end);
    this._prepareCellTextMetricsCache(range);

    var vr  = this.visibleRange;
    var r = this.rows;
    var offsetX = (undefined !== offsetXForDraw) ? offsetXForDraw : this.headersLeft;
    var offsetY = (undefined !== offsetYForDraw) ? offsetYForDraw : r[vr.r1].top - this.cellsTop;
    if (undefined === drawingCtx && this.topLeftFrozenCell && undefined === offsetYForDraw) {
        var rFrozen = this.topLeftFrozenCell.getRow0();
        if (start < vr.r1)
            offsetY = r[0].top - this.cellsTop;
        else
            offsetY -= r[rFrozen].top - r[0].top;
    }

    if (asc_typeof(start) !== "number") {start = vr.r1;}
    if (asc_typeof(end) !== "number") {end = vr.r2;}
    if (style === undefined) {style = kHeaderDefault;}

    this._setFont(drawingCtx, this.model.getDefaultFontName(), this.model.getDefaultFontSize());

    var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
    var st = this.settings.header.style[style];
    ctx.setFillStyle(st.border)
        .fillRect(offsetX, -offsetY, this.headersWidth * 2, r[end].top - r[start].top);

    // draw row headers
    for (var i = start; i <= end; ++i) {
        this._drawHeader_Local(drawingCtx, offsetX, r[i].top - r[start].top - offsetY,
            this.headersWidth, r[i].height, style, false, i);
    }
};

WorksheetView.prototype._drawGrid_Local = function (drawingCtx, c1, r1, c2, r2, leftFieldInPt, topFieldInPt, width, height) {
    var range = new asc_Range(c1, r1, c2, r2);
    this._prepareCellTextMetricsCache(range);
    this._drawGrid(drawingCtx, range, leftFieldInPt, topFieldInPt, width, height);
};

WorksheetView.prototype._drawCellsAndBorders_Local = function (drawingCtx,  c1, r1, c2, r2, offsetXForDraw, offsetYForDraw) {
    var range = new asc_Range(c1, r1, c2, r2);

    this._drawCellsAndBorders(drawingCtx, range, offsetXForDraw, offsetYForDraw);

    var oldrange = this.visibleRange;
    this.visibleRange = range;

    var cellsLeft_Local = this.cellsLeft;
    var cellsTop_Local  = this.cellsTop;

    this.cellsLeft = -(offsetXForDraw - this.cols[c1].left);
    this.cellsTop = -(offsetYForDraw - this.rows[r1].top);

    // TODO: frozen places implementation native only
    if (this.drawingArea.frozenPlaces.length) {
        this.drawingArea.frozenPlaces[0].range = range;
    }

    window.native["SwitchMemoryLayer"]();

    this.objectRender.showDrawingObjectsEx(false);

    this.cellsLeft = cellsLeft_Local;
    this.cellsTop = cellsTop_Local;
    this.visibleRange = oldrange;
};

WorksheetView.prototype._getDrawSelection_Local = function (c1, r1, c2, r2, isFrozen) {

    var native_selection = [];

    var range = undefined;

    this.visibleRange = new asc_Range(c1, r1, c2, r2);

    isFrozen = !!isFrozen;
    if (asc["editor"].isStartAddShape || this.objectRender.selectedGraphicObjectsExists()) {
        //if (this.isChartAreaEditMode) {
        //    this._drawFormulaRanges(this.arrActiveChartsRanges);
        //}
        return;
    }

    if (c_oAscSelectionType.RangeMax === this.activeRange.type) {
        this.activeRange.c2 = this.cols.length - 1;
        this.activeRange.r2 = this.rows.length - 1;
    } else if (c_oAscSelectionType.RangeCol === this.activeRange.type) {
        this.activeRange.r2 = this.rows.length - 1;
    } else if (c_oAscSelectionType.RangeRow === this.activeRange.type) {
        this.activeRange.c2 = this.cols.length - 1;
    }

    var diffWidth = 0, diffHeight = 0;
    if (this.topLeftFrozenCell) {
        //var cFrozen = this.topLeftFrozenCell.getCol0();
        //var rFrozen = this.topLeftFrozenCell.getRow0();
        //diffWidth = this.cols[cFrozen].left - this.cols[0].left;
        //diffHeight = this.rows[rFrozen].top - this.rows[0].top;
        //
        //if (!isFrozen) {
        //	var oFrozenRange;
        //	cFrozen -= 1; rFrozen -= 1;
        //	if (0 <= cFrozen && 0 <= rFrozen) {
        //		oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
        //		this._drawSelectionRange(oFrozenRange, true);
        //	}
        //	if (0 <= cFrozen) {
        //		oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
        //		this._drawSelectionRange(oFrozenRange, true);
        //	}
        //	if (0 <= rFrozen) {
        //		oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
        //		this._drawSelectionRange(oFrozenRange, true);
        //	}
        //}
    }

    //console.log('this.visibleRange c1: ' + this.visibleRange.c1 + ' r1: ' + this.visibleRange.r1 + ' c2: ' + this.visibleRange.c2 + ' r2: ' + this.visibleRange.r2);
    //console.log('this.activeRange c1: ' + this.activeRange.c1 + ' r1: ' + this.activeRange.r1 + ' c2: ' + this.activeRange.c2 + ' r2: ' + this.activeRange.r2);

    var tmpRange = range;
    if (!this.isSelectionDialogMode)
        range = this.activeRange.intersection(range !== undefined ? range : this.visibleRange);
    else
        range = this.copyActiveRange.intersection(range !== undefined ? range : this.visibleRange);

    // Copy fill Handle
    var aFH = null;
    // Вхождение range
    var aFHIntersection = null;
    if (this.activeFillHandle !== null) {
        // Мы в режиме автозаполнения
        aFH = this.activeFillHandle.clone(true);
        aFHIntersection = this.activeFillHandle.intersection(tmpRange !== undefined ? tmpRange : this.visibleRange);
    }

    //if (!range && !aFHIntersection && !this.isFormulaEditMode && !this.activeMoveRange && !this.isChartAreaEditMode) {
    //	if (!isFrozen) {
    //		//this._drawActiveHeaders();
    //		if (this.isSelectionDialogMode) {
    //			this._drawSelectRange(this.activeRange.clone(true));
    //		}
    //	}
    //	return;
    //}

    var ctx = this.overlayCtx;
    var opt = this.settings;
    var offsetX, offsetY;
    if (isFrozen) {
        if (tmpRange.c1 !== this.visibleRange.c1)
            diffWidth = 0;
        if (tmpRange.r1 !== this.visibleRange.r1)
            diffHeight = 0;
        offsetX = this.cols[tmpRange.c1].left - this.cellsLeft - diffWidth;
        offsetY = this.rows[tmpRange.r1].top - this.cellsTop - diffHeight;
    } else {
        offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
        offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
    }

    //console.log('range c1: ' + range.c1 + ' r1: ' + range.r1 + ' c2: ' + range.c2 + ' r2: ' + range.r2);

    var arn = (!this.isSelectionDialogMode) ? this.activeRange.clone(true) : this.copyActiveRange.clone(true);
//    var x1 = (range) ? (this.cols[range.c1].left - offsetX - this.width_1px* 0) : 0;
//    var x2 = (range) ? (this.cols[range.c2].left + this.cols[range.c2].width - offsetX - this.width_1px * 0) : 0;
//    var y1 = (range) ? (this.rows[range.r1].top - offsetY) : 0;
//    var y2 = (range) ? (this.rows[range.r2].top + this.rows[range.r2].height - offsetY - this.height_1px * 0) : 0;
//    var drawLeftSide   = (range) ? (range.c1 === arn.c1) : false;
//    var drawRightSide  = (range) ? (range.c2 === arn.c2) : false;
//    var drawTopSide    = (range) ? (range.r1 === arn.r1) : false;
//    var drawBottomSide = (range) ? (range.r2 === arn.r2) : false;
    var l, t, r, b, cr;
    // Размеры "квадрата" автозаполнения
    //var fillHandleWidth = 2 * this.width_2px + this.width_1px;
    //var fillHandleHeight = 2 * this.height_2px + this.height_1px;

    // active range

    native_selection.push(this.activeRange.type);

    native_selection.push(range.c1);
    native_selection.push(range.c2);
    native_selection.push(range.r1);
    native_selection.push(range.r2);

    native_selection.push(this.cols[range.c1].left - offsetX);
    native_selection.push(this.rows[range.r1].top  - offsetY);
    native_selection.push(this.cols[range.c2].left + this.cols[range.c2].width  - this.cols[range.c1].left);
    native_selection.push(this.rows[range.r2].top  + this.rows[range.r2].height - this.rows[range.r1].top);

    // Координаты выделения для автозаполнения
    var xFH1 = 0;
    var xFH2 = 0;
    var yFH1 = 0;
    var yFH2 = 0;
    // Рисуем ли мы стороны автозаполнения
    var drawLeftFillHandle;
    var drawRightFillHandle;
    var drawTopFillHandle;
    var drawBottomFillHandle;

    // set clipping rect to cells area
    //ctx.save()
    //	.beginPath()
    //	.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
    //	.clip();

    // draw frame around cells range
//    l = drawLeftSide ? -this.width_1px* 0 : 0;
//    r = drawRightSide ? this.width_1px* 0 : 0;
//    t = drawTopSide ? -this.height_1px* 0 : 0;
//    b = drawBottomSide ? this.height_2px* 0 : 0;

    //ctx.setStrokeStyle(opt.activeCellBorderColor)
    //	.setLineWidth(3)
    //	.beginPath();

    if (aFHIntersection) {
        //// Считаем координаты автозаполнения
        //xFH1 = this.cols[aFHIntersection.c1].left - offsetX - this.width_1px;
        //xFH2 = this.cols[aFHIntersection.c2].left + this.cols[aFHIntersection.c2].width - offsetX - this.width_1px;
        //yFH1 = this.rows[aFHIntersection.r1].top - offsetY;
        //yFH2 = this.rows[aFHIntersection.r2].top + this.rows[aFHIntersection.r2].height - offsetY - this.height_1px;
        //drawLeftFillHandle = aFHIntersection.c1 === aFH.c1;
        //drawRightFillHandle = aFHIntersection.c2 === aFH.c2;
        //drawTopFillHandle = aFHIntersection.r1 === aFH.r1;
        //drawBottomFillHandle = aFHIntersection.r2 === aFH.r2;
        //
        //// Если мы не в нулевом состоянии, то рисуем обводку автозаполнения (толстой линией)
        //if (aFHIntersection.c1 !== aFHIntersection.c2 || aFHIntersection.r1 !== aFHIntersection.r2 || 2 !== this.fillHandleArea) {
        //	if (drawTopFillHandle)    {ctx.lineHor(xFH1 + l, yFH1 - this.height_1px, xFH2 + this.width_1px + r);}
        //	if (drawBottomFillHandle) {ctx.lineHor(xFH1 + l, yFH2, xFH2 + this.width_1px + r);}
        //	if (drawLeftFillHandle)   {ctx.lineVer(xFH1, yFH1 + t, yFH2 + b);}
        //	if (drawRightFillHandle)  {ctx.lineVer(xFH2, yFH1 + t, yFH2 + b);}
        //}
        //
        //// Для некоторых вариантов областей нужно дорисовывать обводку для выделенной области
        //switch (this.fillHandleArea){
        //	case 1:
        //		switch(this.fillHandleDirection){
        //			case 0:
        //				// Горизонтальный
        //				if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
        //				break;
        //			case 1:
        //				// Вертикальный
        //				if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
        //				break;
        //		}
        //		break;
        //	case 2:
        //		// Для внутренней области нужны все обводки
        //		if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
        //		if (drawBottomSide) {ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);}
        //		if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
        //		if (drawRightSide)  {ctx.lineVer(x2, y1 + t, y2 + b);}
        //		break;
        //	case 3:
        //		switch(this.fillHandleDirection){
        //			case 0:
        //				// Горизонтальный
        //				if (range && aFH.c2 !== range.c2){
        //					if (drawRightSide)  {ctx.lineVer(x2, y1 + t, y2 + b);}
        //				}
        //				break;
        //			case 1:
        //				// Вертикальный
        //				if (range && aFH.r2 !== range.r2){
        //					if (drawBottomSide) {ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);}
        //				}
        //				break;
        //		}
        //		break;
        //}
        //ctx.stroke();
    } else {
        // Автозаполнения нет, просто рисуем обводку
        //if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
        //if (drawBottomSide) {
        //	if (isFrozen && !drawRightSide)
        //		fillHandleWidth = 0;
        //	ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r - fillHandleWidth);
        //}
        //if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
        //if (drawRightSide)  {
        //	if (isFrozen && !drawBottomSide)
        //		fillHandleHeight = 0;
        //	//ctx.lineVer(x2, y1 + t, y2 + b - fillHandleHeight);
        //}

        // native_selection = [x1, y1, x2, y2, this.activeRange.type];

        //return [x1, y1, x2, y2, this.activeRange.type ];
    }

    //ctx.stroke();

    // draw cells overlay
    if (range) {
//        var lRect = x1 + (drawLeftSide ? this.width_3px* 0 : this.width_1px* 0),
//            rRect = x2 - (drawRightSide ? this.width_2px* 0 : 0),
//            tRect = y1 + (drawTopSide ? this.height_2px* 0 : 0),
//            bRect = y2 - (drawBottomSide ? this.width_2px* 0 : 0);
//
//        var lRect2 = x1 + (drawLeftSide ? this.width_2px* 0 : this.width_1px* 0),
//            rRect2 = x2 - (drawRightSide ? this.width_2px* 0 : 0),
//            tRect2 = y1 + (drawTopSide ? this.height_1px* 0 : 0),
//            bRect2 = y2 - (drawBottomSide ? this.width_2px* 0 : 0);
        //ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath()
        //	.strokeRect(lRect2, tRect2, rRect2 - lRect2, bRect2 - tRect2);

        var firstCell = (!this.isSelectionDialogMode) ? this.activeRange : this.copyActiveRange;
        cr = this.model.getMergedByCell(firstCell.startRow, firstCell.startCol);
        // Получаем активную ячейку в выделении
        cr = range.intersection(null !== cr ? cr : new asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
        if (cr !== null) {

            var _l = this.cols[cr.c1].left - offsetX,
                _r  = this.cols[cr.c2].left + this.cols[cr.c2].width - offsetX,
                _t  = this.rows[cr.r1].top - offsetY,
                _b  = this.rows[cr.r2].top + this.rows[cr.r2].height - offsetY;

            native_selection.push(cr.c1);
            native_selection.push(cr.c2);
            native_selection.push(cr.r1);
            native_selection.push(cr.r2);

            native_selection.push(this.cols[cr.c1].left - offsetX);
            native_selection.push(this.rows[cr.r1].top  - offsetY);
            native_selection.push(this.cols[cr.c2].left + this.cols[cr.c2].width  - this.cols[cr.c1].left);
            native_selection.push(this.rows[cr.r2].top  + this.rows[cr.r2].height - this.rows[cr.r1].top);
        }

        //if (!(isFrozen && (!drawRightSide || !drawBottomSide))) {
        // Рисуем "квадрат" для автозаполнения (располагается "квадрат" в правом нижнем углу последней ячейки выделения)
        //cr = range.intersection(new asc_Range(range.c2, range.r2, range.c2, range.r2));
        //if (cr !== null) {
        //	this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
        //	this.fillHandleR = this.fillHandleL + fillHandleWidth;
        //	this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
        //	this.fillHandleB = this.fillHandleT + fillHandleHeight;
        //
        //	ctx.setFillStyle(opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);
        //
        //	ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath();
        //	ctx.lineHorPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleR);
        //	ctx.lineVerPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleB);
        //	ctx.stroke();
        //}
        //}
    }

    // draw fill handle select
    if (this.activeFillHandle !== null) {
        //if (2 === this.fillHandleArea && (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2)){
        //	// Для внутренней области мы должны "залить" еще и область автозаполнения
        //	var lFH = xFH1 + (drawLeftFillHandle ? this.width_3px : this.width_1px),
        //		rFH = xFH2 - (drawRightFillHandle ? this.width_2px : 0),
        //		tFH = yFH1 + (drawTopFillHandle ? this.height_2px : 0),
        //		bFH = yFH2 - (drawBottomFillHandle ? this.width_2px : 0);
        //	ctx.setFillStyle( opt.activeCellBackground )
        //		.fillRect(lFH, tFH, rFH - lFH, bFH - tFH);
        //}
        //
        //ctx.setStrokeStyle(opt.fillHandleBorderColorSelect).setLineWidth(1).beginPath();
        //
        //if (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2 || 2 !== this.fillHandleArea) {
        //	// Рисуем обводку для области автозаполнения, если мы выделили что-то
        //	if (drawTopFillHandle)    {ctx.lineHor(xFH1 + l + this.width_1px, yFH1 - this.height_1px, xFH2 + r);}
        //	if (drawBottomFillHandle) {ctx.lineHor(xFH1 + l + this.width_1px, yFH2, xFH2 + r);}
        //	if (drawLeftFillHandle)   {ctx.lineVer(xFH1, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);}
        //	if (drawRightFillHandle)  {ctx.lineVer(xFH2, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);}
        //}
        //
        //if (2 === this.fillHandleArea){
        //	// Если мы внутри, еще рисуем обводку для выделенной области
        //	if (drawTopSide)    {ctx.lineHor(x1 + l + this.width_1px, y1 - this.height_1px, x2 + r - this.width_1px);}
        //	if (drawBottomSide) {ctx.lineHor(x1 + l + this.width_1px, y2, x2 + r - this.width_1px);}
        //	if (drawLeftSide)   {ctx.lineVer(x1, y1 + t + this.height_1px, y2 + b - this.height_1px);}
        //	if (drawRightSide)  {ctx.lineVer(x2, y1 + t + this.height_1px, y2 + b - this.height_1px);}
        //}
        //
        //ctx.stroke();
    }

    var formulaRanges = [];

    if (!isFrozen && this.isFormulaEditMode) {
        formulaRanges = this.__drawFormulaRanges(this.arrActiveFormulaRanges, offsetX, offsetY);
    }

    return {'selection': native_selection, 'formulaRanges': formulaRanges};

    //if (!isFrozen && this.isChartAreaEditMode) {
    //	this._drawFormulaRanges(this.arrActiveChartsRanges);
    //}

    //if (!isFrozen && this.isSelectionDialogMode) {
    //	this._drawSelectRange(this.activeRange.clone(true));
    //}
    //if (!isFrozen && this.stateFormatPainter) {
    //	this._drawFormatPainterRange();
    //}
    //if (null !== this.activeMoveRange) {
    //	ctx.setStrokeStyle(new CColor(0, 0, 0))
    //		.setLineWidth(1)
    //		.beginPath();
    //	var aActiveMoveRangeIntersection = this.activeMoveRange.intersection(tmpRange !== undefined ? tmpRange : this.visibleRange);
    //	if (aActiveMoveRangeIntersection) {
    //		var drawLeftSideMoveRange   = aActiveMoveRangeIntersection.c1 === this.activeMoveRange.c1;
    //		var drawRightSideMoveRange  = aActiveMoveRangeIntersection.c2 === this.activeMoveRange.c2;
    //		var drawTopSideMoveRange    = aActiveMoveRangeIntersection.r1 === this.activeMoveRange.r1;
    //		var drawBottomSideMoveRange = aActiveMoveRangeIntersection.r2 === this.activeMoveRange.r2;
    //
    //		var xMoveRange1 = this.cols[aActiveMoveRangeIntersection.c1].left - offsetX - this.width_1px;
    //		var xMoveRange2 = this.cols[aActiveMoveRangeIntersection.c2].left + this.cols[aActiveMoveRangeIntersection.c2].width - offsetX - this.width_1px;
    //		var yMoveRange1 = this.rows[aActiveMoveRangeIntersection.r1].top - offsetY;
    //		var yMoveRange2 = this.rows[aActiveMoveRangeIntersection.r2].top + this.rows[aActiveMoveRangeIntersection.r2].height - offsetY - this.height_1px;
    //
    //		if (drawTopSideMoveRange)    {ctx.lineHor(xMoveRange1, yMoveRange1 - this.height_1px, xMoveRange2 + this.width_1px);}
    //		if (drawBottomSideMoveRange) {ctx.lineHor(xMoveRange1, yMoveRange2, xMoveRange2 + this.width_1px);}
    //		if (drawLeftSideMoveRange)   {ctx.lineVer(xMoveRange1, yMoveRange1, yMoveRange2);}
    //		if (drawRightSideMoveRange)  {ctx.lineVer(xMoveRange2, yMoveRange1, yMoveRange2);}
    //	}
    //	ctx.stroke();
    //}

    // restore canvas' original clipping range
    //ctx.restore();

    //if (!isFrozen) {
    //	this._drawActiveHeaders();
    //}
};

WorksheetView.prototype._updateCache = function(c1, r1, c2, r2) {
    var range = new asc_Range(c1, r1, c2, r2);
    this._prepareCellTextMetricsCache(range);
};

WorksheetView.prototype._changeSelectionTopLeft = function (x, y, isCoord, isSelectMode, isTopLeft) {
    //var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;

    var isMoveActiveCellToLeftTop = false;
    var ar = this.activeRange;
    var copy = this.activeRange.clone();

    var col = ar.startCol;
    var row = ar.startRow;

    if (isTopLeft) {
        this.activeRange.startCol = this.leftTopRange.c2;
        this.activeRange.startRow = this.leftTopRange.r2;
    } else {
        this.activeRange.startCol = this.leftTopRange.c1;
        this.activeRange.startRow = this.leftTopRange.r1;
    }

    var newRange = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
    var isEqual = newRange.isEqual(ar);

    if (!isEqual) {

        if (newRange.c1 > col) {
            col = newRange.c1;
            isMoveActiveCellToLeftTop = true;
        }

        if (newRange.r1 > row) {
            row = newRange.r1;
            isMoveActiveCellToLeftTop = true;
        }

        ar.assign2(newRange);

        this.activeRange.startCol = col;
        this.activeRange.startRow = row;

        if (isMoveActiveCellToLeftTop) {
            this.activeRange.startCol = newRange.c1;
            this.activeRange.startRow = newRange.r1;
        }

        //ToDo this.drawDepCells();

        if (!this.isCellEditMode) {
            if (!this.isSelectionDialogMode) {
                this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/true));
                if (!isSelectMode) {
                    this.handlers.trigger("selectionChanged", this.getSelectionInfo(false));
                    this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
                }
            } else {
                // Смена диапазона
                this.handlers.trigger("selectionRangeChanged", this.getSelectionRangeValue());
            }
        }
    } else {
        this.activeRange.startCol = col;
        this.activeRange.startRow = row;
    }

    this.model.workbook.handlers.trigger("asc_onHideComment");

    return this._calcActiveRangeOffset(x,y);
};

WorksheetView.prototype.__chartsRanges = function() {

    if (asc["editor"].isStartAddShape || this.objectRender.selectedGraphicObjectsExists()) {
        if (this.isChartAreaEditMode) {
            return this.__drawFormulaRanges(this.arrActiveChartsRanges, 0, 0);
        }
    }

    return null;
};

WorksheetView.prototype.__drawFormulaRanges = function (arrRanges, offsetX, offsetY) {
    var ranges = [],i = 0, type = 0, left = 0, right  = 0, top = 0, bottom = 0;

    for (i = 0; i < arrRanges.length; ++i) {
        ranges.push(arrRanges[i].type);
        ranges.push(arrRanges[i].c1);
        ranges.push(arrRanges[i].c2);
        ranges.push(arrRanges[i].r1);
        ranges.push(arrRanges[i].r2);

        type = arrRanges[i].type;

        if (1 == type) {            // cells
            left    = this.cols[arrRanges[i].c1].left - offsetX;
            top     = this.rows[arrRanges[i].r1].top - offsetY;
            right   = this.cols[arrRanges[i].c2].left + this.cols[arrRanges[i].c2].width - offsetX;
            bottom  = this.rows[arrRanges[i].r2].top + this.rows[arrRanges[i].r2].height - offsetY;
        }
        else if (2 == type) {       // column range
            left    = this.cols[arrRanges[i].c1].left - offsetX;
            top     = this.rows[arrRanges[i].r1].top - offsetY;
            right   = this.cols[arrRanges[i].c2].left + this.cols[arrRanges[i].c2].width - offsetX;
            bottom  = 0;
        }
        else if (3 == type) {       // row range
            left    = this.cols[arrRanges[i].c1].left - offsetX;
            top     = this.rows[arrRanges[i].r1].top - offsetY;
            right   = 0;
            bottom  = this.rows[arrRanges[i].r2].top + this.rows[arrRanges[i].r2].height - offsetY;
        }
        else if (4 == type) {       // max
            left    = this.cols[arrRanges[i].c1].left - offsetX;
            top     = this.rows[arrRanges[i].r1].top - offsetY;
            right   = 0;
            bottom  = 0;
        }

        ranges.push(left);
        ranges.push(top);
        ranges.push(right);
        ranges.push(bottom);
    }

    return ranges;
};


