
window["Asc"].WorksheetView = WorksheetView;

WorksheetView.prototype._drawColumnHeaders_Local = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
    if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
        return;
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
        this._drawHeader(drawingCtx, c[i].left - c[start].left - offsetX, offsetY,
            c[i].width, this.headersHeight, style, true, i);
    }
};

WorksheetView.prototype._drawRowHeaders_Local = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
    if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
        return;
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
        this._drawHeader(drawingCtx, offsetX, r[i].top - r[start].top - offsetY,
            this.headersWidth, r[i].height, style, false, i);
    }
};

WorksheetView.prototype._drawGrid_Local = function (drawingCtx, c1, r1, c2, r2, leftFieldInPt, topFieldInPt, width, height) {
    this._drawGrid(drawingCtx,  new asc_Range(c1, r1, c2, r2), leftFieldInPt, topFieldInPt, width, height);
};

WorksheetView.prototype._drawCellsAndBorders_Local = function (drawingCtx,  c1, r1, c2, r2, offsetXForDraw, offsetYForDraw) {
    this._drawCellsAndBorders(drawingCtx, new asc_Range(c1, r1, c2, r2), offsetXForDraw, offsetYForDraw);
};

WorksheetView.prototype._getDrawSelection_Local = function (c1, r1, c2, r2, isFrozen) {

    var range = undefined;

    this.visibleRange = new asc_Range(c1, r1, c2, r2);

    isFrozen = !!isFrozen;
    if (asc["editor"].isStartAddShape || this.objectRender.selectedGraphicObjectsExists()) {
        if (this.isChartAreaEditMode) {
            this._drawFormulaRanges(this.arrActiveChartsRanges);
        }
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
    var x1 = (range) ? (this.cols[range.c1].left - offsetX - this.width_1px) : 0;
    var x2 = (range) ? (this.cols[range.c2].left + this.cols[range.c2].width - offsetX - this.width_1px) : 0;
    var y1 = (range) ? (this.rows[range.r1].top - offsetY) : 0;
    var y2 = (range) ? (this.rows[range.r2].top + this.rows[range.r2].height - offsetY - this.height_1px) : 0;
    var drawLeftSide   = (range) ? (range.c1 === arn.c1) : false;
    var drawRightSide  = (range) ? (range.c2 === arn.c2) : false;
    var drawTopSide    = (range) ? (range.r1 === arn.r1) : false;
    var drawBottomSide = (range) ? (range.r2 === arn.r2) : false;
    var l, t, r, b, cr;
    // Размеры "квадрата" автозаполнения
    var fillHandleWidth = 2 * this.width_2px + this.width_1px;
    var fillHandleHeight = 2 * this.height_2px + this.height_1px;

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
    l = drawLeftSide ? -this.width_1px : 0;
    r = drawRightSide ? this.width_1px : 0;
    t = drawTopSide ? -this.height_1px : 0;
    b = drawBottomSide ? this.height_2px : 0;

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

        return [x1, y1, x2, y2, this.activeRange.type];
    }

    return null;

    //ctx.stroke();

    // draw cells overlay
    if (range) {
        //var lRect = x1 + (drawLeftSide ? this.width_3px : this.width_1px),
        //	rRect = x2 - (drawRightSide ? this.width_2px : 0),
        //	tRect = y1 + (drawTopSide ? this.height_2px : 0),
        //	bRect = y2 - (drawBottomSide ? this.width_2px : 0);
        //ctx.setFillStyle( opt.activeCellBackground )
        //	.fillRect(lRect, tRect, rRect - lRect, bRect - tRect);
        //
        //var lRect2 = x1 + (drawLeftSide ? this.width_2px : this.width_1px),
        //	rRect2 = x2 - (drawRightSide ? this.width_2px : 0),
        //	tRect2 = y1 + (drawTopSide ? this.height_1px : 0),
        //	bRect2 = y2 - (drawBottomSide ? this.width_2px : 0);
        //ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath()
        //	.strokeRect(lRect2, tRect2, rRect2 - lRect2, bRect2 - tRect2);
        //
        //var firstCell = (!this.isSelectionDialogMode) ? this.activeRange : this.copyActiveRange;
        //cr = this.model.getMergedByCell(firstCell.startRow, firstCell.startCol);
        //// Получаем активную ячейку в выделении
        //cr = range.intersection(null !== cr ? cr : new asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
        //if (cr !== null) {
        //	ctx.save().beginPath().rect(lRect, tRect, rRect - lRect, bRect - tRect).clip();
        //	var _l = this.cols[cr.c1].left - offsetX - this.width_1px,
        //		_r = this.cols[cr.c2].left + this.cols[cr.c2].width - offsetX,
        //		_t = this.rows[cr.r1].top - offsetY - this.height_1px,
        //		_b = this.rows[cr.r2].top + this.rows[cr.r2].height - offsetY;
        //	ctx.clearRect(_l, _t, _r - _l, _b - _t).restore();
        //}
        //
        //if (!(isFrozen && (!drawRightSide || !drawBottomSide))) {
        //	// Рисуем "квадрат" для автозаполнения (располагается "квадрат" в правом нижнем углу последней ячейки выделения)
        //	cr = range.intersection(new asc_Range(range.c2, range.r2, range.c2, range.r2));
        //	if (cr !== null) {
        //		this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
        //		this.fillHandleR = this.fillHandleL + fillHandleWidth;
        //		this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
        //		this.fillHandleB = this.fillHandleT + fillHandleHeight;
        //
        //		ctx.setFillStyle(opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);
        //
        //		ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath();
        //		ctx.lineHorPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleR);
        //		ctx.lineVerPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleB);
        //		ctx.stroke();
        //	}
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

    if (!isFrozen && this.isFormulaEditMode) {
        //	this._drawFormulaRanges(this.arrActiveFormulaRanges);
    }

    if (!isFrozen && this.isChartAreaEditMode) {
        //	this._drawFormulaRanges(this.arrActiveChartsRanges);
    }

    if (!isFrozen && this.isSelectionDialogMode) {
        //	this._drawSelectRange(this.activeRange.clone(true));
    }
    if (!isFrozen && this.stateFormatPainter) {
        //	this._drawFormatPainterRange();
    }
    if (null !== this.activeMoveRange) {
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
    }

    // restore canvas' original clipping range
    //ctx.restore();

    //if (!isFrozen) {
    //	this._drawActiveHeaders();
    //}
};

