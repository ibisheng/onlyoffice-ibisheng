"use strict";

//-----------------------------------------------------------------------------------
// Drawing area manager
//-----------------------------------------------------------------------------------

// Type
var FrozenAreaType = {

	Top				: "Top",
	Bottom			: "Bottom",
	Left			: "Left",
	Right			: "Right",
	Center			: "Center",		// Default without frozen places
	
	LeftTop			: "LeftTop",
	RightTop		: "RightTop",
	LeftBottom		: "LeftBottom",
	RightBottom		: "RightBottom"
};

// Frozen place
function FrozenPlace(ws, type) {
	var log = false;
	var _this = this;
	var asc = window["Asc"];
	var asc_Range = asc.Range;
	
	_this.worksheet = ws;
	_this.type = type;
	_this.range = null;
	_this.frozenCell = {
		col: _this.worksheet.topLeftFrozenCell ? _this.worksheet.topLeftFrozenCell.getCol0() : 0,
		row: _this.worksheet.topLeftFrozenCell ? _this.worksheet.topLeftFrozenCell.getRow0() : 0
	};
	_this.isValid = true;
	
	var convertMetrics = _this.worksheet.objectRender.convertMetric;
		
	// Methods	
	_this.initRange = function() {
		
		checkCol(_this.worksheet.getLastVisibleCol() + 1);
		checkRow(_this.worksheet.getLastVisibleRow() + 1);
		
		switch (_this.type) {
		
			case FrozenAreaType.Top: {
				if ( !_this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(0, 0, _this.worksheet.getLastVisibleCol() + 1, _this.frozenCell.row);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Bottom: {
				if ( !_this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(0, _this.frozenCell.row, _this.worksheet.getLastVisibleCol() + 1, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Left: {
				if ( _this.frozenCell.col && !_this.frozenCell.row )
					_this.range = new asc_Range(0, 0, _this.frozenCell.col, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Right: {
				if ( _this.frozenCell.col && !_this.frozenCell.row )
					_this.range = new asc_Range(_this.frozenCell.col, 0, _this.worksheet.getLastVisibleCol() + 1, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Center: {
				if ( !_this.frozenCell.col && !_this.frozenCell.row )
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(true), _this.worksheet.getFirstVisibleRow(true), _this.worksheet.getLastVisibleCol() + 1, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
			
			// Other
			case FrozenAreaType.LeftTop: {
				if ( _this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(0, 0, _this.frozenCell.col, _this.frozenCell.row);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.RightTop: {
				if ( _this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(_this.frozenCell.col, 0, _this.worksheet.getLastVisibleCol() + 1, _this.frozenCell.row);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.LeftBottom: {
				if ( _this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(0, _this.frozenCell.row, _this.frozenCell.col, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.RightBottom: {
				if ( _this.frozenCell.col && _this.frozenCell.row )
					_this.range = new asc_Range(_this.frozenCell.col, _this.frozenCell.row, _this.worksheet.getLastVisibleCol() + 1, _this.worksheet.getLastVisibleRow() + 1);
				else
					_this.isValid = false;
			}
			break;
		}
	}
	
	_this.getVisibleRange = function() {
		var vr = _this.range.clone();
		var fv = _this.getFirstVisible();
		
		switch (_this.type) {
			// Two places
			case FrozenAreaType.Top: {
				// without changes
			}
			break;
			case FrozenAreaType.Bottom: {
				vr.r1 = fv.row;
				vr.r2 = _this.worksheet.getLastVisibleRow();
			}
			break;
			case FrozenAreaType.Left: {
				vr.r1 = fv.row;
				vr.r2 = _this.worksheet.getLastVisibleRow();
			}
			break;
			case FrozenAreaType.Right: {
				vr.c1 = fv.col;
				vr.c2 = _this.worksheet.getLastVisibleCol();
			}
			break;
			
			// Four places
			case FrozenAreaType.LeftTop: {
				// without changes
			}
			break;
			case FrozenAreaType.RightTop: {
				vr.c1 = fv.col;
				vr.c2 = _this.worksheet.getLastVisibleCol();
			}
			break;
			case FrozenAreaType.LeftBottom: {
				vr.r1 = fv.row;
				vr.r2 = _this.worksheet.getLastVisibleRow();
			}
			break;
			case FrozenAreaType.RightBottom: {
				vr.c1 = fv.col;
				vr.c2 = _this.worksheet.getLastVisibleCol();
				vr.r1 = fv.row;
				vr.r2 = _this.worksheet.getLastVisibleRow();
			}
			break;
			
			// No frozen areas
			case FrozenAreaType.Center: {
				vr.c1 = fv.col;
				vr.c2 = _this.worksheet.getLastVisibleCol();
				vr.r1 = fv.row;
				vr.r2 = _this.worksheet.getLastVisibleRow();
			}
			break;
		}
		return vr;
	}
	
	_this.getRect = function() {
		var rect = { x: 0, y: 0, w: 0, h: 0 };
		rect.x = _this.worksheet.getCellLeft(_this.range.c1, 0);
		rect.y = _this.worksheet.getCellTop(_this.range.r1, 0);
		rect.w = _this.worksheet.getCellLeft(_this.range.c2, 0) - rect.x;
		rect.h = _this.worksheet.getCellTop(_this.range.r2, 0) - rect.y;
		return rect;
	}
	
	_this.getFirstVisible = function() {
		var fv = { col: 0, row: 0 };
		
		switch (_this.type) {
			// Two places
			case FrozenAreaType.Top: {
				fv.col = _this.worksheet.getFirstVisibleCol();
			}
			break;
			
			case FrozenAreaType.Bottom: {
				fv.col = _this.worksheet.getFirstVisibleCol();
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
			
			case FrozenAreaType.Left: {
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
			
			case FrozenAreaType.Right: {
				fv.col = _this.worksheet.getFirstVisibleCol();
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
			
			// Four places
			case FrozenAreaType.LeftTop: {
			}
			break;
			
			case FrozenAreaType.RightTop: {
				fv.col = _this.worksheet.getFirstVisibleCol();
			}
			break;
			
			case FrozenAreaType.LeftBottom: {
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
			
			case FrozenAreaType.RightBottom: {
				fv.col = _this.worksheet.getFirstVisibleCol();
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
			
			// No frozen areas
			case FrozenAreaType.Center: {
				fv.col = _this.worksheet.getFirstVisibleCol();
				fv.row = _this.worksheet.getFirstVisibleRow();
			}
			break;
		}
		
		return fv;
	}
	
	_this.isPointInside = function(x, y) {
		var rect = _this.getRect();
		var result = (x > rect.x ) && (y > rect.y) && (x <= rect.x + rect.w) && (y <= rect.y + rect.h);
		if ( log && result )
			console.log( x + "," + y + " in " + _this.type);
		return result;			
	}
	
	_this.isCellInside = function(cell) {
		var result = false;
		if ( cell &&  _this.range ) {
			var cellRange = new asc_Range(cell.col, cell.row, cell.col, cell.row);
			var _r = _this.range.intersection(cellRange);
			if ( _r ) {
				if ( log )
					console.log( cell.col + "," + cell.row + " in " + _this.type);
				result = true;
			}
		}
		return result;
	}
	
	_this.isObjectInside = function(object) {
		// TODO Нужно учитывать collOff, rowOff
		
		var result = false;
		var objectRange = new asc_Range(object.from.col, object.from.row, object.to.col, object.to.row);
		var _r = _this.range.intersection(objectRange);
		if ( _r )
			result = true;
		return result;
	}
	
	_this.getVerticalScroll = function() {
		
		// No scroll for Top, LeftTop, RightTop
		var scroll = 0;
		var fv = _this.getFirstVisible();
		var headerPx = _this.worksheet.getCellTop(0, 0);
		
		switch (_this.type) {
			// Two places
			case FrozenAreaType.Top: {
				scroll = headerPx;
			}
			break;
			
			case FrozenAreaType.Bottom: {
				//scroll = _this.worksheet.getCellTop(fv.row, 0) - _this.worksheet.getCellTop(_this.frozenCell.row, 0) + headerPx;
				scroll = -convertMetrics((_this.worksheet.rows[fv.row].top - _this.worksheet.rows[_this.frozenCell.row].top), 1, 0) + headerPx;
			}
			break;
			
			case FrozenAreaType.Left:
			case FrozenAreaType.Right: {
				//scroll = _this.worksheet.getCellTop(fv.row, 0) - headerPx - headerPx;
				scroll = -convertMetrics((_this.worksheet.rows[fv.row].top - _this.worksheet.cellsTop), 1, 0) + headerPx;
			}
			break;
			
			// Four places
			case FrozenAreaType.LeftTop:
			case FrozenAreaType.RightTop: {
				scroll = headerPx;
			}
			break;
			
			case FrozenAreaType.LeftBottom:
			case FrozenAreaType.RightBottom: {
				//scroll = _this.worksheet.getCellTop(fv.row, 0) - _this.worksheet.getCellTop(_this.frozenCell.row, 0) + headerPx;
				scroll = -convertMetrics((_this.worksheet.rows[fv.row].top - _this.worksheet.rows[_this.frozenCell.row].top), 1, 0) + headerPx;
			}
			break;
			
			// No frozen areas
			case FrozenAreaType.Center: {
				//scroll = _this.worksheet.getCellTop(fv.row, 0);// - headerPx - headerPx;
				scroll = -convertMetrics((_this.worksheet.rows[fv.row].top - _this.worksheet.cellsTop), 1, 0) + headerPx;
			}
			break;
		}
		return scroll;
	}
	
	_this.getHorizontalScroll = function() {
		
		// No scroll for Left, LeftTop, LeftBottom
		var scroll = 0;
		var fv = _this.getFirstVisible();
		var headerPx = _this.worksheet.getCellLeft(0, 0);
		
		switch (_this.type) {
			// Two places
			case FrozenAreaType.Top:
			case FrozenAreaType.Bottom: {
				//scroll = _this.worksheet.getCellLeft(fv.col, 0) - headerPx - headerPx;
				scroll = -convertMetrics((_this.worksheet.cols[fv.col].left - _this.worksheet.cellsLeft), 1, 0) + headerPx;
			}
			break;
			
			case FrozenAreaType.Left: {
				scroll = headerPx;
			}
			break;
			
			case FrozenAreaType.Right: {
				//scroll = _this.worksheet.getCellLeft(fv.col, 0) - _this.worksheet.getCellLeft(_this.frozenCell.col, 0) + headerPx;
				scroll = -convertMetrics((_this.worksheet.cols[fv.col].left - _this.worksheet.cols[_this.frozenCell.col].left), 1, 0) + headerPx;
			}
			break;
			
			// Four places
			case FrozenAreaType.LeftTop:
			case FrozenAreaType.LeftBottom: {
				scroll = headerPx;
			}
			break;
			
			case FrozenAreaType.RightTop:
			case FrozenAreaType.RightBottom: {
				//scroll = _this.worksheet.getCellLeft(fv.col, 0) - _this.worksheet.getCellLeft(_this.frozenCell.col, 0) + headerPx;
				scroll = -convertMetrics((_this.worksheet.cols[fv.col].left - _this.worksheet.cols[_this.frozenCell.col].left), 1, 0) + headerPx;
			}
			break;			
			
			// No frozen areas
			case FrozenAreaType.Center: {
				//scroll = _this.worksheet.getCellLeft(fv.col, 0);// - headerPx - headerPx;
				scroll = -convertMetrics((_this.worksheet.cols[fv.col].left - _this.worksheet.cellsLeft), 1, 0) + headerPx;
			}
			break;
		}
		return scroll;
	}
	
	_this.clip = function(canvas) {
		var rect = _this.getRect();
		canvas.m_oContext.save();
		canvas.m_oContext.beginPath();
		canvas.m_oContext.rect(rect.x, rect.y, rect.w, rect.h);
		canvas.m_oContext.clip();
        // этот сэйв нужен для восстановления сложных вложенных клипов
        canvas.m_oContext.save();
	}
	
	_this.restore = function(canvas) {
		canvas.m_oContext.restore();
		// этот рестор нужен для восстановления сложных вложенных клипов
        canvas.m_oContext.restore();
	}
	
	_this.clear = function(isOverlay) {
		var rect = _this.getRect();
		var x = convertMetrics(rect.x, 0, 1);
		var y = convertMetrics(rect.y, 0, 1);
		var w = convertMetrics(rect.w, 0, 1);
		var h = convertMetrics(rect.h, 0, 1);
		
		if ( isOverlay ) 
			_this.worksheet.overlayGraphicCtx.clearRect( x, y, w, h );
		else {
			_this.worksheet.drawingGraphicCtx.clearRect( x, y, w, h );
		}
	}
	
	_this.drawObject = function(object) {
		var canvas = _this.worksheet.objectRender.getDrawingCanvas();
		_this.setTransform(canvas.shapeCtx, canvas.shapeOverlayCtx, canvas.autoShapeTrack);
		
		_this.clip(canvas.shapeCtx);
		object.graphicObject.draw(canvas.shapeCtx);
		
		// Lock
		if ( (object.graphicObject.lockType != undefined) && (object.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) ) {
			canvas.shapeCtx.SetIntegerGrid(false);
			canvas.shapeCtx.transform3(object.graphicObject.transform, false);
			canvas.shapeCtx.DrawLockObjectRect(object.graphicObject.lockType, 0, 0, object.graphicObject.extX, object.graphicObject.extY );
			canvas.shapeCtx.reset();
			canvas.shapeCtx.SetIntegerGrid(true);
		}
					
		_this.restore(canvas.shapeCtx);
	}
	
	_this.setTransform = function(shapeCtx, shapeOverlayCtx, autoShapeTrack) {
		
		if ( shapeCtx && shapeOverlayCtx && autoShapeTrack ) {
			
			var x = _this.getHorizontalScroll();
			var y = _this.getVerticalScroll();

			shapeCtx.m_oCoordTransform.tx = x;
			shapeCtx.m_oCoordTransform.ty = y;
			shapeCtx.CalculateFullTransform();
			
			shapeOverlayCtx.m_oCoordTransform.tx = x;
			shapeOverlayCtx.m_oCoordTransform.ty = y;
			shapeOverlayCtx.CalculateFullTransform();
			
			autoShapeTrack.Graphics.m_oCoordTransform.tx = x;
			autoShapeTrack.Graphics.m_oCoordTransform.ty = y;
			autoShapeTrack.Graphics.CalculateFullTransform();
            _this.worksheet.objectRender.controller.recalculateCurPos();
		}
	}
	
	_this.calculateCell = function(x, y) {
		
		var cell = { col: 0, colOff: 0, colOffPx: 0,
					 row: 0, rowOff: 0, rowOffPx: 0 };
					 
		if ( _this.isPointInside(x, y) ) {
		
			var fv = _this.getFirstVisible();

			var _x = x + _this.worksheet.getCellLeft(0, 0);
			var _y = y + _this.worksheet.getCellTop(0, 0);
		
			var xPt = _this.worksheet.objectRender.convertMetric(_x, 0, 1);
			var yPt = _this.worksheet.objectRender.convertMetric(_y, 0, 1);
			
			var offsetX = 0;// _this.worksheet.cols[fv.col].left - _this.worksheet.cellsLeft;
			var offsetY = 0;//_this.worksheet.rows[fv.row].top - _this.worksheet.cellsTop;
			
			/* Проверки на максимум в листе */
			var isMaxCol = function() {
				var result = false;
				if ( _this.worksheet.cols.length >= gc_nMaxCol )
					result = true;
				return result;
			}
			
			var isMaxRow = function() {
				var result = false;
				if ( _this.worksheet.rows.length >= gc_nMaxRow )
					result = true;
				return result;
			}
			//
			
			var delta = 0;
			var what = roundPlus(xPt - offsetX, 3);
			var col = _this.worksheet._findColUnderCursor( what, true );
			while (col == null) {
				if ( isMaxCol() ) {
					col = _this.worksheet._findColUnderCursor( _this.worksheet.cols[gc_nMaxCol - 1].left - 1, true );
					break;
				}
				_this.worksheet.expandColsOnScroll(true);
				_this.worksheet.handlers.trigger("reinitializeScrollX");
				col = _this.worksheet._findColUnderCursor( what + delta, true );
				if ( what < 0 )
					delta++;
			}
			cell.col = col.col;
			cell.colOffPx = Math.max(0, _x - _this.worksheet.getCellLeft(cell.col, 0));
			cell.colOff = _this.worksheet.objectRender.convertMetric(cell.colOffPx, 0, 3);

			delta = 0;
			what = roundPlus(yPt - offsetY, 3);
			var row = _this.worksheet._findRowUnderCursor( what, true );
			while (row == null) {
				if ( isMaxRow() ) {
					row = _this.worksheet._findRowUnderCursor( _this.worksheet.rows[gc_nMaxRow - 1].top - 1, true );
					break;
				}
				_this.worksheet.expandRowsOnScroll(true);
				_this.worksheet.handlers.trigger("reinitializeScrollY");
				row = _this.worksheet._findRowUnderCursor( what + delta, true );
				if ( what < 0 )
					delta++;
			}
			cell.row = row.row;
			cell.rowOffPx = Math.max(0, _y - _this.worksheet.getCellTop(cell.row, 0));
			cell.rowOff = _this.worksheet.objectRender.convertMetric(cell.rowOffPx, 0, 3);
		}		
		return cell;
		
	}
	
	// Range constructor	
	_this.initRange();
	
	// Misc
	
	function checkCol(col) {
		while ( (col > 0) && !_this.worksheet.cols[col] )
			_this.worksheet.expandColsOnScroll(true);
	}
	
	function checkRow(row) {
		while ( (row > 0) && !_this.worksheet.rows[row] )
			_this.worksheet.expandRowsOnScroll(true);
	}
}

// Container
function DrawingArea(ws) {

	var _this = this;
	var asc = window["Asc"];
	var api = asc["editor"];
	
	_this.worksheet = ws;
	_this.frozenPlaces = [];
	
	// Methods
	_this.init = function() {
		if ( _this.worksheet ) {
			if ( _this.worksheet.topLeftFrozenCell ) {
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.Top);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.Bottom);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.Left);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.Right);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
					
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.LeftTop);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.RightTop);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.LeftBottom);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
				var place = new FrozenPlace(_this.worksheet, FrozenAreaType.RightBottom);
				if ( place.isValid )
					_this.frozenPlaces.push(place);
			}
			else
				_this.frozenPlaces.push(new FrozenPlace(_this.worksheet, FrozenAreaType.Center));
		}
	}

	_this.clear = function() {
		for ( var i = 0; i < _this.frozenPlaces.length; i++ ) {
			_this.frozenPlaces[i].clear();
		}
	}
	
	_this.drawObject = function(object) {
		for ( var i = 0; i < _this.frozenPlaces.length; i++ ) {
			if ( _this.frozenPlaces[i].isObjectInside(object) ) {
				_this.frozenPlaces[i].drawObject(object);
			}
		}
	}
	
	_this.drawSelection = function(drawingDocument) {
		
		var canvas = _this.worksheet.objectRender.getDrawingCanvas();
		var shapeCtx = canvas.shapeCtx;
		var shapeOverlayCtx = canvas.shapeOverlayCtx;
		var autoShapeTrack = canvas.autoShapeTrack;
		var trackOverlay = canvas.trackOverlay;
		
		var ctx = trackOverlay.m_oContext;
        trackOverlay.Clear();
        drawingDocument.Overlay = trackOverlay;
		
		_this.worksheet.overlayCtx.clear();
		_this.worksheet.overlayGraphicCtx.clear();
		_this.worksheet._drawCollaborativeElements(false);
		
		if ( !_this.worksheet.objectRender.controller.selectedObjects.length && !api.isStartAddShape )
			_this.worksheet._drawSelection();
		
		/*for ( var i = 0; i < _this.worksheet.objectRender.controller.selectedObjects.length; i++ ) {
			if ( _this.worksheet.objectRender.controller.selectedObjects[i].isChart() ) {
				_this.selectDrawingObjectRange(_this.controller.selectedObjects[i].Id);
				shapeOverlayCtx.ClearMode = true;
				_this.worksheet.objectRender.controller.selectedObjects[i].draw(shapeOverlayCtx);
				shapeOverlayCtx.ClearMode = false;
			}
		}*/
		
		for ( var i = 0; i < _this.frozenPlaces.length; i++ ) {
		
			_this.frozenPlaces[i].setTransform(shapeCtx, shapeOverlayCtx, autoShapeTrack);
			
			// Clip
			_this.frozenPlaces[i].clip(shapeOverlayCtx);

			if (null == drawingDocument.m_oDocumentRenderer) {
				if (drawingDocument.m_bIsSelection) {
					if (drawingDocument.m_bIsSelection) {
						trackOverlay.m_oControl.HtmlElement.style.display = "block";

						if (null == trackOverlay.m_oContext)
							trackOverlay.m_oContext = trackOverlay.m_oControl.HtmlElement.getContext('2d');
					}
					drawingDocument.private_StartDrawSelection(trackOverlay);
					_this.worksheet.objectRender.controller.drawTextSelection();
					drawingDocument.private_EndDrawSelection();
				}

				ctx.globalAlpha = 1.0;

				_this.worksheet.objectRender.controller.drawSelection(drawingDocument);
				if ( _this.worksheet.objectRender.controller.needUpdateOverlay() ) {
					trackOverlay.Show();
					shapeOverlayCtx.put_GlobalAlpha(true, 0.5);
					_this.worksheet.objectRender.controller.drawTracks(shapeOverlayCtx);
					shapeOverlayCtx.put_GlobalAlpha(true, 1);
				}
			}
			else {
				ctx.fillStyle = "rgba(51,102,204,255)";
				ctx.beginPath();

				for (var i = drawingDocument.m_lDrawingFirst; i <= drawingDocument.m_lDrawingEnd; i++) {
					var drawPage = drawingDocument.m_arrPages[i].drawingPage;
					drawingDocument.m_oDocumentRenderer.DrawSelection(i, trackOverlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
				}

				ctx.globalAlpha = 0.2;
				ctx.fill();
				ctx.beginPath();
				ctx.globalAlpha = 1.0;
			}
			
			// Restore
			_this.frozenPlaces[i].restore(shapeOverlayCtx);
		}
		_this.worksheet._drawFrozenPaneLines(_this.worksheet.drawingGraphicCtx);
	}
	
	_this.getOffsets = function(x, y) {
		for ( var i = 0; i < _this.frozenPlaces.length; i++ ) {
			if ( _this.frozenPlaces[i].isPointInside(x, y) ) {
				return { x: _this.frozenPlaces[i].getHorizontalScroll(), y: _this.frozenPlaces[i].getVerticalScroll() }
			}
		}
		return null;
	}
	
	_this.calculateCell = function(x, y) {
		var cell = { col: 0, colOff: 0, colOffPx: 0,
					 row: 0, rowOff: 0, rowOffPx: 0 };
					 
		for ( var i = 0; i < _this.frozenPlaces.length; i++ ) {
			if ( _this.frozenPlaces[i].isPointInside(x, y) ) {
				cell = _this.frozenPlaces[i].calculateCell(x, y);
				break;
			}
		}
		return cell;
	}
	
	_this.calculateCoords = function(cell) {
	}
}