
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

