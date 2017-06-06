/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

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
		switch (_this.type) {
		
			case FrozenAreaType.Top: {
				if (!_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(), 0, _this.worksheet.getLastVisibleCol(), _this.frozenCell.row - 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Bottom: {
				if (!_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(0, _this.worksheet.getFirstVisibleRow(), _this.worksheet.getLastVisibleCol(), _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Left: {
				if (_this.frozenCell.col && !_this.frozenCell.row)
					_this.range = new asc_Range(0, 0, _this.frozenCell.col - 1, _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Right: {
				if (_this.frozenCell.col && !_this.frozenCell.row)
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(), 0, _this.worksheet.getLastVisibleCol(), _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.Center: {
				if (!_this.frozenCell.col && !_this.frozenCell.row)
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(true), _this.worksheet.getFirstVisibleRow(true), _this.worksheet.getLastVisibleCol(), _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
			
			// Other
			case FrozenAreaType.LeftTop: {
				if (_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(0, 0, _this.frozenCell.col - 1, _this.frozenCell.row - 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.RightTop: {
				if (_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(), 0, _this.worksheet.getLastVisibleCol(), _this.frozenCell.row - 1);
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.LeftBottom: {
				if (_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(0, _this.worksheet.getFirstVisibleRow(), _this.frozenCell.col - 1, _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
			
			case FrozenAreaType.RightBottom: {
				if (_this.frozenCell.col && _this.frozenCell.row)
					_this.range = new asc_Range(_this.worksheet.getFirstVisibleCol(), _this.worksheet.getFirstVisibleRow(), _this.worksheet.getLastVisibleCol(), _this.worksheet.getLastVisibleRow());
				else
					_this.isValid = false;
			}
			break;
		}
	};
	
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
	};
	
	_this.getRect = function(bEvent) {
		var rect = { x: 0, y: 0, w: 0, h: 0, r: 0, b: 0 };
		rect.x = _this.worksheet.getCellLeftRelative(_this.range.c1, 0);
		rect.y = _this.worksheet.getCellTopRelative(_this.range.r1, 0);
		rect.w = _this.worksheet.getCellLeftRelative(_this.range.c2, 0) + _this.worksheet.getColumnWidth(_this.range.c2, 0) - rect.x;
		rect.h = _this.worksheet.getCellTopRelative(_this.range.r2, 0) + _this.worksheet.getRowHeight(_this.range.r2, 0) - rect.y;

        rect.r = rect.x + rect.w;
        rect.b = rect.y + rect.h;


        switch (_this.type) {

            case FrozenAreaType.Top:
            {
                rect.w = +Infinity;
                rect.r = +Infinity;
                if(bEvent)
                {
                    rect.x = -Infinity;
                    rect.y = -Infinity;
                }
                break;
            }

            case FrozenAreaType.Bottom:
            {
                rect.w = +Infinity;
                rect.h = +Infinity;
                rect.r = +Infinity;
                rect.b = +Infinity;

                if(bEvent)
                {
                    rect.x = -Infinity;
                }
                break;
            }

            case FrozenAreaType.Left:
            {
                rect.h = +Infinity;
                rect.b = +Infinity;

                if(bEvent)
                {
                    rect.x = -Infinity;
                    rect.y = -Infinity;
                }
                break;
            }

            case FrozenAreaType.Right:
            {

                rect.w = +Infinity;
                rect.h = +Infinity;
                rect.r = +Infinity;
                rect.b = +Infinity;

                if(bEvent)
                {
                    rect.y = -Infinity;
                }
                break;
            }

            case FrozenAreaType.Center:
            {
                rect.w = +Infinity;
                rect.h = +Infinity;
                rect.r = +Infinity;
                rect.b = +Infinity;
                if(bEvent)
                {
                    rect.x = -Infinity;
                    rect.y = -Infinity;
                }
                break;
            }
            // Other
            case FrozenAreaType.LeftTop:
            {
                if(bEvent)
                {
                    rect.x = -Infinity;
                    rect.y = -Infinity;
                }
                break;
            }

            case FrozenAreaType.RightTop:
            {
                rect.w = +Infinity;
                rect.r = +Infinity;
                if(bEvent)
                {
                    rect.y = -Infinity;
                }
                break;
            }

            case FrozenAreaType.LeftBottom:
            {
                rect.h = +Infinity;
                rect.b = +Infinity;
                if(bEvent)
                {
                    rect.x = -Infinity;
                }
                break;
            }

            case FrozenAreaType.RightBottom:
            {
                rect.w = +Infinity;
                rect.h = +Infinity;
                rect.r = +Infinity;
                rect.b = +Infinity;
                break;
            }
        }

		return rect;
	};

    _this.getRect2 = function() {
        var rect = { x: 0, y: 0, w: 0, h: 0 };
        rect.x = _this.worksheet.getCellLeftRelative(_this.range.c1, 0);
        rect.y = _this.worksheet.getCellTopRelative(_this.range.r1, 0);
        rect.w = _this.worksheet.getCellLeftRelative(_this.range.c2, 0) + _this.worksheet.getColumnWidth(_this.range.c2, 0) - rect.x;
        rect.h = _this.worksheet.getCellTopRelative(_this.range.r2, 0) + _this.worksheet.getRowHeight(_this.range.r2, 0) - rect.y;
        return rect;
    };



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
	};
	
	_this.isPointInside = function(x, y, bEvent)
    {
        var rect = _this.getRect(bEvent);
         var result = (x >= rect.x ) && (y >= rect.y) && (x <= rect.r) && (y <= rect.b);
         if ( log && result )
         console.log( x + "," + y + " in " + _this.type);
         return result;
	};
	
	_this.isCellInside = function(cell) {
		var result = false;
		if (cell && _this.range) {
			var cellRange = new asc_Range(cell.col, cell.row, cell.col, cell.row);
			result = _this.range.isIntersect(cellRange);
		}
		return result;
	};
	
	_this.isObjectInside = function(object) {
		// TODO Нужно учитывать collOff, rowOff

        var boundsFromTo = object.boundsFromTo;
		var objectRange = new asc_Range(boundsFromTo.from.col, boundsFromTo.from.row, boundsFromTo.to.col, boundsFromTo.to.row);
		return _this.range.isIntersect(objectRange);
	};
	
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
	};
	
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
	};
	
	_this.clip = function(canvas) {
		var rect = _this.getRect2();
		canvas.m_oContext.save();
		canvas.m_oContext.beginPath();
		canvas.m_oContext.rect(rect.x, rect.y, rect.w, rect.h);
		canvas.m_oContext.clip();
        // этот сэйв нужен для восстановления сложных вложенных клипов
        canvas.m_oContext.save();
	};
	
	_this.restore = function(canvas) {
		canvas.m_oContext.restore();
		// этот рестор нужен для восстановления сложных вложенных клипов
        canvas.m_oContext.restore();
	};
	
	_this.drawObject = function(object) {
		var canvas = _this.worksheet.objectRender.getDrawingCanvas();
		_this.setTransform(canvas.shapeCtx, canvas.shapeOverlayCtx, canvas.autoShapeTrack);
		
		_this.clip(canvas.shapeCtx);
		object.graphicObject.draw(canvas.shapeCtx);
		
		// Lock
		if ( (object.graphicObject.lockType != undefined) && (object.graphicObject.lockType != AscCommon.c_oAscLockTypes.kLockTypeNone) ) {
			canvas.shapeCtx.SetIntegerGrid(false);
			canvas.shapeCtx.transform3(object.graphicObject.transform, false);
			canvas.shapeCtx.DrawLockObjectRect(object.graphicObject.lockType, 0, 0, object.graphicObject.extX, object.graphicObject.extY );
			canvas.shapeCtx.reset();
			canvas.shapeCtx.SetIntegerGrid(true);
		}
					
		_this.restore(canvas.shapeCtx);
	};
	
	_this.setTransform = function(shapeCtx, shapeOverlayCtx, autoShapeTrack, trackOverlay) {
		
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
        if(trackOverlay && trackOverlay.m_oHtmlPage)
        {
            var width = trackOverlay.m_oHtmlPage.drawingPage.right -  trackOverlay.m_oHtmlPage.drawingPage.left;
            var height = trackOverlay.m_oHtmlPage.drawingPage.bottom -  trackOverlay.m_oHtmlPage.drawingPage.top;
            trackOverlay.m_oHtmlPage.drawingPage.left = x;
            trackOverlay.m_oHtmlPage.drawingPage.top  = y;
            trackOverlay.m_oHtmlPage.drawingPage.right = x + width;
            trackOverlay.m_oHtmlPage.drawingPage.bottom  = y + height;
        }
	};
	
	// Range constructor	
	_this.initRange();
}

// Container
function DrawingArea(ws) {

    var asc = window["Asc"];
    this.api = asc["editor"];

    this.worksheet = ws;
    this.frozenPlaces = [];
}

DrawingArea.prototype.init = function() {
    this.frozenPlaces = [];
    if ( this.worksheet ) {
        var place;
        if ( this.worksheet.topLeftFrozenCell ) {
            place = new FrozenPlace(this.worksheet, FrozenAreaType.Top);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.Bottom);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.Left);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.Right);
            if ( place.isValid )
                this.frozenPlaces.push(place);

            place = new FrozenPlace(this.worksheet, FrozenAreaType.LeftTop);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.RightTop);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.LeftBottom);
            if ( place.isValid )
                this.frozenPlaces.push(place);
            place = new FrozenPlace(this.worksheet, FrozenAreaType.RightBottom);
            if ( place.isValid )
                this.frozenPlaces.push(place);
        }
        else
            this.frozenPlaces.push(new FrozenPlace(this.worksheet, FrozenAreaType.Center));
    }
};

DrawingArea.prototype.clear = function() {
    this.worksheet.drawingGraphicCtx.clear();
};

DrawingArea.prototype.drawObject = function(object) {
    for ( var i = 0; i < this.frozenPlaces.length; i++ ) {
        if ( this.frozenPlaces[i].isObjectInside(object) ) {
            this.frozenPlaces[i].drawObject(object);
        }
    }
};

DrawingArea.prototype.reinitRanges = function() {
    for ( var i = 0; i < this.frozenPlaces.length; i++ ) {
        this.frozenPlaces[i].initRange();
    }
};

DrawingArea.prototype.drawSelection = function(drawingDocument) {

    var canvas = this.worksheet.objectRender.getDrawingCanvas();
    var shapeCtx = canvas.shapeCtx;
    var shapeOverlayCtx = canvas.shapeOverlayCtx;
    var autoShapeTrack = canvas.autoShapeTrack;
    var trackOverlay = canvas.trackOverlay;

    var ctx = trackOverlay.m_oContext;
    trackOverlay.Clear();
    drawingDocument.Overlay = trackOverlay;

    this.worksheet.overlayCtx.clear();
    this.worksheet.overlayGraphicCtx.clear();
    this.worksheet._drawCollaborativeElements();

    if ( !this.worksheet.objectRender.controller.selectedObjects.length && !this.api.isStartAddShape )
        this.worksheet._drawSelection();

    var chart;
    var controller = this.worksheet.objectRender.controller;
    var selected_objects = controller.selection.groupSelection ? controller.selection.groupSelection.selectedObjects : controller.selectedObjects;
    if(selected_objects.length === 1 && selected_objects[0].getObjectType() === AscDFH.historyitem_type_ChartSpace)
    {
        chart = selected_objects[0];
        this.worksheet.objectRender.selectDrawingObjectRange(chart);
        //shapeOverlayCtx.ClearMode = true;
        ////selected_objects[0].draw(shapeOverlayCtx);
        //shapeOverlayCtx.ClearMode = false;
    }
    for ( var i = 0; i < this.frozenPlaces.length; i++ ) {

        this.frozenPlaces[i].setTransform(shapeCtx, shapeOverlayCtx, autoShapeTrack, trackOverlay);

        // Clip
        this.frozenPlaces[i].clip(shapeOverlayCtx);

        if (true) {
            if (drawingDocument.m_bIsSelection) {
				drawingDocument.SelectionMatrix = null;
				trackOverlay.m_oControl.HtmlElement.style.display = "block";

				if (null == trackOverlay.m_oContext)
					trackOverlay.m_oContext = trackOverlay.m_oControl.HtmlElement.getContext('2d');

                drawingDocument.private_StartDrawSelection(trackOverlay);
                this.worksheet.objectRender.controller.drawTextSelection();
                drawingDocument.private_EndDrawSelection();

				this.worksheet.handlers.trigger("drawMobileSelection");
            }

            ctx.globalAlpha = 1.0;

            this.worksheet.objectRender.controller.drawSelection(drawingDocument);
            if ( this.worksheet.objectRender.controller.needUpdateOverlay() ) {
                trackOverlay.Show();
                autoShapeTrack.Graphics.put_GlobalAlpha(true, 0.5);
                this.worksheet.objectRender.controller.drawTracks(autoShapeTrack);
                autoShapeTrack.Graphics.put_GlobalAlpha(true, 1);
            }
        }

        // Restore
        this.frozenPlaces[i].restore(autoShapeTrack);
    }
};

DrawingArea.prototype.getOffsets = function(x, y, bEvents) {
        for ( var i = 0; i < this.frozenPlaces.length; i++ ) {
            if ( this.frozenPlaces[i].isPointInside(x, y, bEvents) ) {
                return { x: this.frozenPlaces[i].getHorizontalScroll(), y: this.frozenPlaces[i].getVerticalScroll() }
            }
        }
        return null;
    };

	//--------------------------------------------------------export----------------------------------------------------
	window['AscFormat'] = window['AscFormat'] || {};
	window['AscFormat'].DrawingArea = DrawingArea;
})(window);
