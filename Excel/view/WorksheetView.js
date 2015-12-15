"use strict";

/* WorksheetView.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Nov 21, 2011
 */
(
	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {


		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"];
		var asc_applyFunction = asc.applyFunction;
		var asc_calcnpt = asc.calcNearestPt;
		var asc_getcvt  = asc.getCvtRatio;
		var asc_floor   = asc.floor;
		var asc_ceil    = asc.ceil;
		var asc_obj2Color = asc.colorObjToAscColor;
		var asc_typeof  = asc.typeOf;
		var asc_incDecFonSize  = asc.incDecFonSize;
		var asc_debug   = asc.outputDebugStr;
		var asc_Range   = asc.Range;
		var asc_ActiveRange   = asc.ActiveRange;
		var asc_CMM		= asc.asc_CMouseMoveData;
		var asc_VR		= asc.VisibleRange;

		var asc_CCellFlag		= asc.asc_CCellFlag;
		var asc_CFont			= asc.asc_CFont;
		var asc_CFill			= asc.asc_CFill;
		var asc_CCellInfo		= asc.asc_CCellInfo;
		var asc_CHyperlink		= asc.asc_CHyperlink;
		var asc_CPageOptions	= asc.asc_CPageOptions;
		var asc_CPageSetup		= asc.asc_CPageSetup;
		var asc_CPageMargins	= asc.asc_CPageMargins;
		var asc_CPagePrint		= asc.CPagePrint;
		var asc_CSelectionMathInfo = asc.asc_CSelectionMathInfo;
		var asc_CAutoFilterInfo	   = asc.asc_CAutoFilterInfo;

		/*
		* Constants
		* -----------------------------------------------------------------------------
		*/

		/**
		 * header styles
		 * @const
		 */
		var kHeaderDefault     = 0;
		var kHeaderActive      = 1;
		var kHeaderHighlighted = 2;
		var kHeaderSelected    = 3;

		/**
		 * text alignment style
		 * @const
		 */
		var khaLeft   = "left";
		var khaCenter = "center";
		var khaRight  = "right";
		var khaJustify= "justify";
		var kvaTop    = "top";
		var kvaCenter = "center";
		var kvaBottom = "bottom";

		var kNone     = "none";

		/**
		 * cursor styles
		 * @const
		 */
		var kCurDefault		= "default";
		var kCurCorner		= "pointer";
		var kCurColSelect	= "pointer";
		var kCurColResize	= "col-resize";
		var kCurRowSelect	= "pointer";
		var kCurRowResize	= "row-resize";
		// Курсор для автозаполнения
		var kCurFillHandle	= "crosshair";
		// Курсор для гиперссылки
		var kCurHyperlink	= "pointer";
		// Курсор для перемещения области выделения
		var kCurMove		= "move";
		var kCurSEResize	= "se-resize";
		var kCurNEResize	= "ne-resize";
		var kCurAutoFilter	= "pointer";
		var kCurCells		= '';
		var kCurFormatPainterExcel = '';
		if (AscBrowser.isIE) {
			// Пути указаны относительно html в меню, не надо их исправлять
			// и коммитить на пути относительно тестового меню
			kCurCells = 'url(../../../sdk/Common/Images/plus.cur), pointer';
			kCurFormatPainterExcel = 'url(../../../sdk/Common/Images/plus_copy.cur), pointer';
		} else if (AscBrowser.isOpera) {
			kCurCells = 'cell';
			kCurFormatPainterExcel = 'pointer';
		} else {
			kCurCells = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFJJREFUeNpidHFxYcAC/qPxGdEVMDHgALt37wZjXACnRkKA/hpZsAQEMYHFwAAM1f+kApAeipzK4OrqijU6cMnBNDJSNQEMznjECnAFCgwABBgAcX1BU/hbd0sAAAAASUVORK5CYII=') 6 6, pointer";
			kCurFormatPainterExcel = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK1JREFUeNrUk+ESxBAMhG3Hm+GpeTfF0Eld0uLcj9uZTP3xdZMsxBjVRhXYsRNora2n5HSxbjLGtKPSX7uqCiHkD1adUlcfLnMdKw6zq94plXbOiVskKm1575GAF1iS6DQBSjECdUp+gFcoJ9LyBe6B09BuluCA09A8fwCK7AHsopiljCxOBLY5xVnVO2KWd779W/uKy2qLk5DjVyhGwz+qn7T/P1D9FPRVnQIMABDnBAmTp4GtAAAAAElFTkSuQmCC') 6 12, pointer";
		}

		var kNewLine = "\n";

		var kMaxAutoCompleteCellEdit = 20000;

		function calcDecades(num) {
			return Math.abs(num) < 10 ? 1 : 1 + calcDecades( asc_floor(num * 0.1) );
		}

		function CacheElement() {
			if ( !(this instanceof CacheElement) ) {
				return new CacheElement();
			}
			this.columnsWithText = {};							// Колонки, в которых есть текст
			this.columns = {};
			this.erased = {};
			return this;
		}

		function Cache() {
			if ( !(this instanceof Cache) ) {
				return new Cache();
			}

			this.rows = {};
			this.sectors = [];

			this.reset = function () {
				this.rows = {};
				this.sectors = [];
			};

			// Structure of cache
			//
			// cache : {
			//
			//   rows : {
			//     0 : {
			//       columns : {
			//         0 : {
			//           text : {
			//             cellHA  : String,
			//             cellVA  : String,
			//             cellW   : Number,
			//             color   : String,
			//             metrics : TextMetrics,
			//             sideL   : Number,
			//             sideR   : Number,
			//             state   : StringRenderInternalState
			//           }
			//         }
			//       },
			//       erased : {
			//         1 : true, 2 : true
			//       }
			//     }
			//   },
			//
			//   sectors: [
			//     0 : Range
			//   ]
			//
			// }
		}

		function CellFlags() {
			this.wrapText = false;
			this.shrinkToFit = false;
			this.merged = null;
			this.textAlign = kNone;
		}
		CellFlags.prototype.clone = function () {
			var oRes = new CellFlags();
			oRes.wrapText = this.wrapText;
			oRes.shrinkToFit = this.shrinkToFit;
			oRes.merged = this.merged ? this.merged.clone() : null;
			oRes.textAlign = this.textAlign;
			return oRes;
		};
		CellFlags.prototype.isMerged = function () {
			return null !== this.merged;
		};

		function CellBorderObject (borders, mergeInfo, col, row) {
			this.borders = borders;
			this.mergeInfo = mergeInfo;

			this.col = col;
			this.row = row;
		}
		CellBorderObject.prototype.isMerge = function () {
			return null != this.mergeInfo;
		};
		CellBorderObject.prototype.getLeftBorder = function () {
			if (!this.borders || (this.isMerge() && (this.col !== this.mergeInfo.c1 || this.col - 1 !== this.mergeInfo.c2)))
				return null;
			return this.borders.l;
		};
		CellBorderObject.prototype.getRightBorder = function () {
			if (!this.borders || (this.isMerge() && (this.col - 1 !== this.mergeInfo.c1 || this.col !== this.mergeInfo.c2)))
				return null;
			return this.borders.r;
		};

		CellBorderObject.prototype.getTopBorder = function () {
			if (!this.borders || (this.isMerge() && (this.row !== this.mergeInfo.r1 || this.row - 1 !== this.mergeInfo.r2)))
				return null;
			return this.borders.t;
		};
		CellBorderObject.prototype.getBottomBorder = function () {
			if (!this.borders || (this.isMerge() && (this.row - 1 !== this.mergeInfo.r1 || this.row !== this.mergeInfo.r2)))
				return null;
			return this.borders.b;
		};


		/**
		 * Widget for displaying and editing Worksheet object
		 * -----------------------------------------------------------------------------
		 * @param {Woorksheet} model  Worksheet
		 * @param {asc_CHandlersList} handlers  Event handlers
		 * @param {Object} buffers    DrawingContext + Overlay
		 * @param {StringRender} stringRender    StringRender
		 * @param {Number} maxDigitWidth    Максимальный размер цифры
		 * @param {CCollaborativeEditing} collaborativeEditing
		 * @param {Object} settings  Settings
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function WorksheetView(model, handlers, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings) {
			this.settings = settings;

			this.vspRatio = 1.275;

			this.handlers = handlers;
			this.model = model;

			this.buffers = buffers;
			this.drawingCtx = this.buffers.main;
			this.overlayCtx = this.buffers.overlay;
			
			this.drawingGraphicCtx = this.buffers.mainGraphic;
			this.overlayGraphicCtx = this.buffers.overlayGraphic;
			
			this.shapeCtx = this.buffers.shapeCtx;
			this.shapeOverlayCtx = this.buffers.shapeOverlayCtx;

			this.stringRender = stringRender;

			// Флаг, сигнализирует о том, что мы сделали resize, но это не активный лист (поэтому как только будем показывать, нужно перерисовать и пересчитать кеш)
			this.updateResize = false;
			// Флаг, сигнализирует о том, что мы сменили zoom, но это не активный лист (поэтому как только будем показывать, нужно перерисовать и пересчитать кеш)
			this.updateZoom = false;
			// ToDo Флаг-заглушка, для того, чтобы на mobile не было изменения высоты строк при zoom (по правильному высота просто не должна меняться)
			this.notUpdateRowHeight = false;

			this.cache = new Cache();

			//---member declaration---
			// Максимальная ширина числа из 0,1,2...,9, померенная в нормальном шрифте(дефалтовый для книги) в px(целое)
			// Ecma-376 Office Open XML Part 1, пункт 18.3.1.13
			this.maxDigitWidth = maxDigitWidth;

			this.nBaseColWidth = 8; // Число символов для дефалтовой ширины (по умолчинию 8)
			this.defaultColWidthChars = 0;
			this.defaultColWidth = 0;
			this.defaultRowHeight = 0;
			this.defaultRowDescender = 0;
			this.headersLeft = 0;
			this.headersTop = 0;
			this.headersWidth = 0;
			this.headersHeight = 0;
			this.headersHeightByFont = 0;	// Размер по шрифту (размер без скрытия заголовков)
			this.cellsLeft = 0;
			this.cellsTop = 0;
			this.cols = [];
			this.rows = [];
			this.width_1px = 0;
			this.width_2px = 0;
			this.width_3px = 0;
			this.width_4px = 0;
			this.width_padding = 0;
			this.height_1px = 0;
			this.height_2px = 0;
			this.height_3px = 0;
			this.height_4px = 0;
			this.highlightedCol = -1;
			this.highlightedRow = -1;
			this.topLeftFrozenCell = null;	// Верхняя ячейка для закрепления диапазона
			this.visibleRange = new asc_Range(0, 0, 0, 0);
			this.activeRange = new asc_ActiveRange(0, 0, 0, 0);
			this.isChanged = false;
			this.isCellEditMode = false;
			this.isFormulaEditMode = false;
			this.isChartAreaEditMode = false;
			this.lockDraw = false;
			this.isSelectOnShape = false;	// Выделен shape

			this.stateFormatPainter = c_oAscFormatPainterState.kOff;

			this.selectionDialogType = c_oAscSelectionDialogType.None;
			this.isSelectionDialogMode = false;
			this.copyActiveRange = null;

			this.startCellMoveResizeRange = null;
			this.startCellMoveResizeRange2 = null;
			this.moveRangeDrawingObjectTo = null;

			// Координаты ячейки начала перемещения диапазона
			this.startCellMoveRange = null;
			// Дипазон перемещения
			this.activeMoveRange = null;
			// Координаты fillHandle ("квадрата" автозаполнения)
			this.fillHandleL = 0;
			this.fillHandleT = 0;
			this.fillHandleR = 0;
			this.fillHandleB = 0;
			// Range fillHandle
			this.activeFillHandle = null;
			// Горизонтальное (0) или вертикальное (1) направление автозаполнения
			this.fillHandleDirection = -1;
			// Зона автозаполнения
			this.fillHandleArea = -1;
			this.nRowsCount = 0;
			this.nColsCount = 0;
			// Массив ячеек для текущей формулы
			this.arrActiveFormulaRanges = [];
			this.arrActiveChartsRanges = [];
			//------------------------
			
			this.collaborativeEditing = collaborativeEditing;
			
			// Auto filters
			this.autoFilters = new asc.AutoFilters(this);
			this.drawingArea = new DrawingArea(this);
			this.cellCommentator = new CCellCommentator(this);
			this.objectRender = null;

			this._init();

			return this;
		}

		WorksheetView.prototype.getCellVisibleRange = function (col, row) {
			var vr, offsetX = 0, offsetY = 0, cFrozen, rFrozen;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0() - 1;
				rFrozen = this.topLeftFrozenCell.getRow0() - 1;
				if (col <= cFrozen && row <= rFrozen)
					vr = new asc_Range(0, 0, cFrozen, rFrozen);
				else if (col <= cFrozen) {
					vr = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
					offsetY -= this.rows[rFrozen + 1].top - this.cellsTop;
				} else if (row <= rFrozen) {
					vr = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
					offsetX -= this.cols[cFrozen + 1].left - this.cellsLeft;
				} else {
					vr = this.visibleRange;
					offsetX -= this.cols[cFrozen + 1].left - this.cellsLeft;
					offsetY -= this.rows[rFrozen + 1].top - this.cellsTop;
				}
			} else
				vr = this.visibleRange;

			offsetX += this.cols[vr.c1].left - this.cellsLeft;
			offsetY += this.rows[vr.r1].top - this.cellsTop;

			return vr.contains(col, row) ? new asc_VR(vr, offsetX, offsetY) : null;
		};

		WorksheetView.prototype.getCellMetrics = function (col, row) {
			var vr, nColSize, nRowSize;
			if (vr = this.getCellVisibleRange(col, row)) {
				nColSize = this.getColSize(col);
				nRowSize = this.getRowSize(row);
				if (nColSize && nRowSize)
					return {
						left: nColSize.left - vr.offsetX, top: nRowSize.top - vr.offsetY,
						width: nColSize.width, height: nRowSize.height
					};
			}
			return null;
		};

		WorksheetView.prototype.getColSize = function (col) {
			return (col >= 0 && col < this.cols.length) ? this.cols[col] : null;
		};

		WorksheetView.prototype.getRowSize = function (row) {
			return (row >= 0 && row < this.rows.length) ? this.rows[row] : null;
		};

		WorksheetView.prototype.getFrozenCell = function () {
			return this.topLeftFrozenCell;
		};

		WorksheetView.prototype.getVisibleRange = function () {
			return this.visibleRange;
		};

		WorksheetView.prototype.updateVisibleRange = function () {
			return this._updateCellsRange(this.getVisibleRange());
		};

		WorksheetView.prototype.getFirstVisibleCol = function (allowPane) {
			var tmp = 0;
			if (allowPane && this.topLeftFrozenCell)
				tmp = this.topLeftFrozenCell.getCol0();
			return this.visibleRange.c1 - tmp;
		};

		WorksheetView.prototype.getLastVisibleCol = function () {
			return this.visibleRange.c2;
		};

		WorksheetView.prototype.getFirstVisibleRow = function (allowPane) {
			var tmp = 0;
			if (allowPane && this.topLeftFrozenCell)
				tmp = this.topLeftFrozenCell.getRow0();
			return this.visibleRange.r1 - tmp;
		};

		WorksheetView.prototype.getLastVisibleRow = function () {
			return this.visibleRange.r2;
		};

		WorksheetView.prototype.getHorizontalScrollRange = function () {
			var ctxW = this.drawingCtx.getWidth() - this.cellsLeft;
			for (var w = 0, i = this.cols.length - 1; i >= 0; --i) {
				w += this.cols[i].width;
				if (w > ctxW) {break;}
			}
			return i; // Диапазон скрола должен быть меньше количества столбцов, чтобы не было прибавления столбцов при перетаскивании бегунка
		};

		WorksheetView.prototype.getVerticalScrollRange = function () {
			var ctxH = this.drawingCtx.getHeight() - this.cellsTop;
			for (var h = 0, i = this.rows.length - 1; i >= 0; --i) {
				h += this.rows[i].height;
				if (h > ctxH) {break;}
			}
			return i; // Диапазон скрола должен быть меньше количества строк, чтобы не было прибавления строк при перетаскивании бегунка
		};

		WorksheetView.prototype.getCellsOffset = function (units) {
			var u = units >= 0 && units <= 3 ? units : 0;
			return {
				left: this.cellsLeft * asc_getcvt( 1/*pt*/, u, this._getPPIX() ),
				top: this.cellsTop * asc_getcvt( 1/*pt*/, u, this._getPPIY() )
			};
		};

		WorksheetView.prototype.getCellLeft = function (column, units) {
			if (column >= 0 && column < this.cols.length) {
				var u = units >= 0 && units <= 3 ? units : 0;
				return this.cols[column].left * asc_getcvt( 1/*pt*/, u, this._getPPIX() );
			}
			return null;
		};

		WorksheetView.prototype.getCellTop = function (row, units) {
			if (row >= 0 && row < this.rows.length) {
				var u = units >= 0 && units <= 3 ? units : 0;
				return this.rows[row].top * asc_getcvt( 1/*pt*/, u, this._getPPIY() );
			}
			return null;
		};

		WorksheetView.prototype.getCellLeftRelative = function (col, units) {
			if (col < 0 || col >= this.cols.length)
				return null;
			// С учетом видимой области
			var offsetX = 0;
			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0();
				offsetX = (col < cFrozen) ? 0 : this.cols[this.visibleRange.c1].left - this.cols[cFrozen].left;
			} else
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;

			var u = units >= 0 && units <= 3 ? units : 0;
			return (this.cols[col].left - offsetX) * asc_getcvt(1/*pt*/, u, this._getPPIX());
		};

		WorksheetView.prototype.getCellTopRelative = function (row, units) {
			if (row < 0 || row >= this.rows.length)
				return null;
			// С учетом видимой области
			var offsetY = 0;
			if (this.topLeftFrozenCell) {
				var rFrozen = this.topLeftFrozenCell.getRow0();
				offsetY = (row < rFrozen) ? 0 : this.rows[this.visibleRange.r1].top - this.rows[rFrozen].top;
			} else
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;

			var u = units >= 0 && units <= 3 ? units : 0;
			return (this.rows[row].top - offsetY) * asc_getcvt(1/*pt*/, u, this._getPPIY());
		};

		WorksheetView.prototype.getColumnWidth = function (index, units) {
			if (index >= 0 && index < this.cols.length) {
				var u = units >= 0 && units <= 3 ? units : 0;
				return this.cols[index].width * asc_getcvt( 1/*pt*/, u, this._getPPIX() );
			}
			return null;
		};

		WorksheetView.prototype.getColumnWidthInSymbols = function (index) {
			if (index >= 0 && index < this.cols.length) {
				return this.cols[index].charCount;
			}
			return null;
		};

		WorksheetView.prototype.getRowHeight = function (index, units, isHeightReal) {
			if (index >= 0 && index < this.rows.length) {
				var u = units >= 0 && units <= 3 ? units : 0;
				var h = isHeightReal ? this.rows[index].heightReal : this.rows[index].height;
				return h * asc_getcvt(1/*pt*/, u, this._getPPIY());
			}
			return null;
		};

		WorksheetView.prototype.getSelectedColumnIndex = function () {
			return this.activeRange.startCol;
		};

		WorksheetView.prototype.getSelectedRowIndex = function () {
			return this.activeRange.startRow;
		};

		WorksheetView.prototype.getSelectedRange = function () {
			return this._getRange(this.activeRange.c1, this.activeRange.r1, this.activeRange.c2, this.activeRange.r2);
		};

		WorksheetView.prototype.resize = function (isUpdate) {
			if (isUpdate) {
				this._initCellsArea(true);
				this._normalizeViewRange();
				this._cleanCellsTextMetricsCache();
				this._prepareCellTextMetricsCache();
				this.updateResize = false;
				
				this.objectRender.resizeCanvas();
			} else {
				this.updateResize = true;
			}
			return this;
		};

		WorksheetView.prototype.getZoom = function () {
			return this.drawingCtx.getZoom();
		};

		WorksheetView.prototype.changeZoom = function (isUpdate) {
			if (isUpdate) {
				this.notUpdateRowHeight = true;
				this.cleanSelection();
				this._initCellsArea(false);
				this._normalizeViewRange();
				this._cleanCellsTextMetricsCache();
				this._shiftVisibleRange();
				this._prepareCellTextMetricsCache();
				this._shiftVisibleRange();
				this.cellCommentator.updateCommentPosition();
				this.handlers.trigger("onDocumentPlaceChanged");
				this.updateZoom = false;
				this.notUpdateRowHeight = false;
			} else {
				this.updateZoom = true;
			}
			return this;
		};
		WorksheetView.prototype.changeZoomResize = function () {
			this.cleanSelection();
			this._initCellsArea(true);
			this._normalizeViewRange();
			this._cleanCellsTextMetricsCache();
			this._shiftVisibleRange();
			this._prepareCellTextMetricsCache();
			this._shiftVisibleRange();
			this.cellCommentator.updateCommentPosition();
			this.handlers.trigger("onDocumentPlaceChanged");

			this.updateResize = false;
			this.updateZoom = false;
		};

		WorksheetView.prototype.getCellTextMetrics = function (col, row) {
			var ct = this._getCellTextCache(col, row);
			return ct ? $.extend({}, ct.metrics) : undefined;
		};

		WorksheetView.prototype.getSheetViewSettings = function () {
			return this.model.getSheetViewSettings();
		};

		WorksheetView.prototype.getFrozenPaneOffset = function (noX, noY) {
			var offsetX = 0, offsetY = 0,
				c = this.cols, r = this.rows;
			if (this.topLeftFrozenCell) {
				if (!noX) {
					var cFrozen = this.topLeftFrozenCell.getCol0();
					offsetX = c[cFrozen].left - c[0].left;
				}
				if (!noY) {
					var rFrozen = this.topLeftFrozenCell.getRow0();
					offsetY = r[rFrozen].top - r[0].top;
				}
			}
			return {offsetX: offsetX, offsetY: offsetY};
		};


		// mouseX - это разница стартовых координат от мыши при нажатии и границы
		WorksheetView.prototype.changeColumnWidth = function (col, x2, mouseX) {
			var t = this;

			x2 *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
			// Учитываем координаты точки, где мы начали изменение размера
			x2 += mouseX;

            var offsetFrozenX = 0;
            var c1 = t.visibleRange.c1;
            if (this.topLeftFrozenCell) {
                var cFrozen = this.topLeftFrozenCell.getCol0() - 1;
                if (0 <= cFrozen) {
                    if (col < c1)
                        c1 = 0;
                    else
                        offsetFrozenX = t.cols[cFrozen].left + t.cols[cFrozen].width - t.cols[0].left;
                }
            }
			var offsetX = t.cols[c1].left - t.cellsLeft;
			offsetX -= offsetFrozenX;

			var x1 = t.cols[col].left - offsetX - this.width_1px;
			var w = Math.max(x2 - x1, 0);
			if (w === t.cols[col].width)
				return;
			var cc = Math.min(t._colWidthToCharCount(w), c_oAscMaxColumnWidth);
			var cw = t._charCountToModelColWidth(cc);

			var onChangeWidthCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.model.setColWidth(cw, col, col);
				t._cleanCache(new asc_Range(0, 0, t.cols.length - 1, t.rows.length - 1));
				t.changeWorksheet("update", {reinitRanges: true});
				t._updateVisibleColsCount();
			};
			this._isLockedAll(onChangeWidthCallback);
		};

		// mouseY - это разница стартовых координат от мыши при нажатии и границы
		WorksheetView.prototype.changeRowHeight = function (row, y2, mouseY) {
			var t = this;

			y2 *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
			// Учитываем координаты точки, где мы начали изменение размера
			y2 += mouseY;

            var offsetFrozenY = 0;
            var r1 = t.visibleRange.r1;
            if (this.topLeftFrozenCell) {
                var rFrozen = this.topLeftFrozenCell.getRow0() - 1;
                if (0 <= rFrozen) {
                    if (row < r1)
                        r1 = 0;
                    else
                        offsetFrozenY = t.rows[rFrozen].top + t.rows[rFrozen].height - t.rows[0].top;
                }
            }
			var offsetY = t.rows[r1].top - t.cellsTop;
			offsetY -= offsetFrozenY;

			var y1 = t.rows[row].top - offsetY - this.height_1px;
			var newHeight = Math.min(t.maxRowHeight, Math.max(y2 - y1, 0));
			if (newHeight === t.rows[row].height)
				return;

			var onChangeHeightCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.model.setRowHeight(newHeight, row, row);
				t.autoFilters.reDrawFilter(null, row);
				t._cleanCache(new asc_Range(0, row, t.cols.length - 1, row));
				t.changeWorksheet("update", {reinitRanges: true});
				t._updateVisibleRowsCount();
			};

			this._isLockedAll (onChangeHeightCallback);
		};


		// Проверяет, есть ли числовые значения в диапазоне
		WorksheetView.prototype._hasNumberValueInActiveRange = function () {
			var cell, cellType, isNumberFormat, arrCols = null, arrRows = null;
			if (this._rangeIsSingleCell(this.activeRange)) {
				// Для одной ячейки не стоит ничего делать
				return null;
			}
			var mergedRange = this.model.getMergedByCell(this.activeRange.r1, this.activeRange.c1);
			if (mergedRange && mergedRange.isEqual(this.activeRange)) {
				// Для одной ячейки не стоит ничего делать
				return null;
			}

			for (var c = this.activeRange.c1; c <= this.activeRange.c2; ++c) {
				for (var r = this.activeRange.r1; r <= this.activeRange.r2; ++r) {
					cell = this._getCellTextCache(c, r);
					if (cell) {
						// Нашли не пустую ячейку, проверим формат
						cellType = cell.cellType;
						isNumberFormat = (null == cellType || CellValueType.Number === cellType);
						if (isNumberFormat) {
							if (!arrCols) {
								arrCols = [];
								arrRows = [];
							}
							arrCols.push(c);
							arrRows.push(r);
						}
					}
				}
			}
			if (arrCols) {
				// Делаем массивы уникальными и сортируем
        arrCols = arrCols.filter(fOnlyUnique);
        arrRows = arrRows.filter(fOnlyUnique);
        return {arrCols: arrCols.sort(fSortAscending), arrRows: arrRows.sort(fSortAscending)};
			} else {
        return null;
      }
		};

		// Автодополняет формулу диапазоном, если это возможно
		WorksheetView.prototype.autoCompleteFormula = function (functionName) {
			var t = this;
			this.activeRange.normalize();
			var ar = this.activeRange;
			var arCopy = null;
			var arHistorySelect = ar.clone(true);
			var vr = this.visibleRange;

			// Первая верхняя не числовая ячейка
			var topCell = null;
			// Первая левая не числовая ячейка
			var leftCell = null;

			var r = ar.startRow - 1;
			var c = ar.startCol - 1;
			var cell, cellType, isNumberFormat;
			var result = {};
			// Проверим, есть ли числовые значения в диапазоне
			var hasNumber = this._hasNumberValueInActiveRange();
			var val, text;

			if (hasNumber) {
				var i;
				// Есть ли значения в последней строке и столбце
				var hasNumberInLastColumn = (ar.c2 === hasNumber.arrCols[hasNumber.arrCols.length - 1]);
				var hasNumberInLastRow = (ar.r2 === hasNumber.arrRows[hasNumber.arrRows.length - 1]);

				// Нужно уменьшить зону выделения (если она реально уменьшилась)
				var startCol = hasNumber.arrCols[0];
				var startRow = hasNumber.arrRows[0];
				// Старые границы диапазона
				var startColOld = ar.c1;
				var startRowOld = ar.r1;
				// Нужно ли перерисовывать
				var bIsUpdate = false;
				if (startColOld !== startCol || startRowOld !== startRow) {
					bIsUpdate = true;
				}
				if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
					bIsUpdate = true;
				}
				if (bIsUpdate) {
					this.cleanSelection();
					ar.c1 = startCol;
					ar.r1 = startRow;
					if (false === ar.contains(ar.startCol, ar.startRow)) {
						// Передвинуть первую ячейку в выделении
						ar.startCol = startCol;
						ar.startRow = startRow;
					}
					if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
						// Мы расширяем диапазон
						if (1 === hasNumber.arrRows.length) {
							// Одна строка или только в последней строке есть значения... (увеличиваем вправо)
							ar.c2 += 1;
						} else {
							// Иначе вводим в строку вниз
							ar.r2 += 1;
						}
					}
					this._drawSelection();
				}

				arCopy = ar.clone(true);

				var functionAction = null;
				var changedRange = null;

				if (false === hasNumberInLastColumn && false === hasNumberInLastRow) {
					// Значений нет ни в последней строке ни в последнем столбце (значит нужно сделать формулы в каждой последней ячейке)
					changedRange = [new asc_Range(hasNumber.arrCols[0], arCopy.r2,
						hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2), new asc_Range(arCopy.c2,
						hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1])];
					functionAction = function () {
						// Пройдемся по последней строке
						for (i = 0; i < hasNumber.arrCols.length; ++i) {
							c = hasNumber.arrCols[i];
							cell = t._getVisibleCell(c, arCopy.r2);
							text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
							val = "=" + functionName + "(" + text + ")";
							// ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
							cell.setValue(val);
						}
						// Пройдемся по последнему столбцу
						for (i = 0; i < hasNumber.arrRows.length; ++i) {
							r = hasNumber.arrRows[i];
							cell = t._getVisibleCell(arCopy.c2, r);
							text = t._getCellTitle (arCopy.c1, r) + ":" + t._getCellTitle (arCopy.c2 - 1, r);
							val = "=" + functionName + "(" + text + ")";
							cell.setValue(val);
						}
						// Значение в правой нижней ячейке
						cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
						text = t._getCellTitle (arCopy.c1, arCopy.r2) + ":" + t._getCellTitle (arCopy.c2 - 1, arCopy.r2);
						val = "=" + functionName + "(" + text + ")";
						cell.setValue(val);
					};
				} else if (true === hasNumberInLastRow && false === hasNumberInLastColumn) {
					// Есть значения только в последней строке (значит нужно заполнить только последнюю колонку)
					changedRange = new asc_Range(arCopy.c2, hasNumber.arrRows[0],
						arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1]);
					functionAction = function () {
						// Пройдемся по последнему столбцу
						for (i = 0; i < hasNumber.arrRows.length; ++i) {
							r = hasNumber.arrRows[i];
							cell = t._getVisibleCell(arCopy.c2, r);
							text = t._getCellTitle (arCopy.c1, r) + ":" + t._getCellTitle (arCopy.c2 - 1, r);
							val = "=" + functionName + "(" + text + ")";
							cell.setValue(val);
						}
					};
				} else if (false === hasNumberInLastRow && true === hasNumberInLastColumn) {
					// Есть значения только в последнем столбце (значит нужно заполнить только последнюю строчку)
					changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2,
						hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
					functionAction = function () {
						// Пройдемся по последней строке
						for (i = 0; i < hasNumber.arrCols.length; ++i) {
							c = hasNumber.arrCols[i];
							cell = t._getVisibleCell(c, arCopy.r2);
							text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
							val = "=" + functionName + "(" + text + ")";
							cell.setValue(val);
						}
					};
				} else {
					// Есть значения и в последнем столбце, и в последней строке
					if (1 === hasNumber.arrRows.length) {
						changedRange = new asc_Range(arCopy.c2, arCopy.r2, arCopy.c2, arCopy.r2);
						functionAction = function () {
							// Одна строка или только в последней строке есть значения...
							cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
							// ToDo вводить в первое свободное место, а не сразу за диапазоном
							text = t._getCellTitle (arCopy.c1, arCopy.r2) + ":" + t._getCellTitle (arCopy.c2 - 1, arCopy.r2);
							val = "=" + functionName + "(" + text + ")";
							cell.setValue(val);
						};
					} else {
						changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2,
							hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
						functionAction = function () {
							// Иначе вводим в строку вниз
							for (i = 0; i < hasNumber.arrCols.length; ++i) {
								c = hasNumber.arrCols[i];
								cell = t._getVisibleCell(c, arCopy.r2);
								// ToDo вводить в первое свободное место, а не сразу за диапазоном
								text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
								val = "=" + functionName + "(" + text + ")";
								cell.setValue(val);
							}
						};
					}
				}

				var onAutoCompleteFormula = function (isSuccess) {
					if (false === isSuccess)
						return;

					History.Create_NewPoint();
					History.SetSelection(arHistorySelect.clone());
					History.SetSelectionRedo(arCopy.clone());
					History.StartTransaction();

					asc_applyFunction(functionAction);
					t.handlers.trigger("selectionMathInfoChanged", t.getSelectionMathInfo());

					History.EndTransaction();
				};

				// Можно ли применять автоформулу
				this._isLockedCells(changedRange, /*subType*/null, onAutoCompleteFormula);

				result.notEditCell = true;
				return result;
			}

			// Ищем первую ячейку с числом
			for (; r >= vr.r1; --r) {
				cell = this._getCellTextCache(ar.startCol, r);
				if (cell) {
					// Нашли не пустую ячейку, проверим формат
					cellType = cell.cellType;
					isNumberFormat = (null === cellType || CellValueType.Number === cellType);
					if (isNumberFormat) {
						// Это число, мы нашли то, что искали
						topCell = {
							c: ar.startCol,
							r: r,
							isFormula: cell.isFormula
						};
						// смотрим вторую ячейку
						if (topCell.isFormula && r-1 >= vr.r1) {
							cell = this._getCellTextCache(ar.startCol, r-1);
							if (cell && cell.isFormula) {
								topCell.isFormulaSeq = true;
							}
						}
						break;
					}
				}
			}
			// Проверим, первой все равно должна быть колонка
			if (null === topCell || topCell.r !== ar.startRow - 1 || topCell.isFormula && !topCell.isFormulaSeq) {
				for (; c >= vr.c1; --c) {
					cell = this._getCellTextCache(c, ar.startRow);
					if (cell) {
						// Нашли не пустую ячейку, проверим формат
						cellType = cell.cellType;
						isNumberFormat = (null === cellType || CellValueType.Number === cellType);
						if (isNumberFormat) {
							// Это число, мы нашли то, что искали
							leftCell = {
								r: ar.startRow,
								c: c
							};
							break;
						}
					}
					if (null !== topCell) {
						// Если это не первая ячейка слева от текущей и мы нашли верхнюю, то дальше не стоит искать
						break;
					}
				}
			}

			if (leftCell) {
				// Идем влево до первой не числовой ячейки
				--c;
				for (; c >= 0; --c) {
					cell = this._getCellTextCache(c, ar.startRow);
					if (!cell) {
						// Могут быть еще не закешированные данные
						this._addCellTextToCache (c, ar.startRow);
						cell = this._getCellTextCache (c, ar.startRow);
						if (!cell)
							break;
					}
					cellType = cell.cellType;
					isNumberFormat = (null === cellType || CellValueType.Number === cellType);
					if (!isNumberFormat)
						break;
				}
				// Мы ушли чуть дальше
				++c;
				// Диапазон или только 1 ячейка
				if (ar.startCol - 1 !== c) {
					// Диапазон
					result = new asc_Range(c, leftCell.r, ar.startCol - 1, leftCell.r);
				} else {
					// Одна ячейка
					result = new asc_Range(c, leftCell.r, c, leftCell.r);
				}
				result.type = c_oAscSelectionType.RangeCells;
				this._fixSelectionOfMergedCells(result);
				if (result.c1 === result.c2 && result.r1 === result.r2)
					result.text = this._getCellTitle (result.c1, result.r1);
				else
					result.text = this._getCellTitle (result.c1, result.r1) + ":" + this._getCellTitle (result.c2, result.r2);
				return result;
			}

			if (topCell) {
				// Идем вверх до первой не числовой ячейки
				--r;
				for (; r >= 0; --r) {
					cell = this._getCellTextCache(ar.startCol, r);
					if (!cell) {
						// Могут быть еще не закешированные данные
						this._addCellTextToCache (ar.startCol, r);
						cell = this._getCellTextCache (ar.startCol, r);
						if (!cell)
							break;
					}
					cellType = cell.cellType;
					isNumberFormat = (null === cellType || CellValueType.Number === cellType);
					if (!isNumberFormat)
						break;
				}
				// Мы ушли чуть дальше
				++r;
				// Диапазон или только 1 ячейка
				if (ar.startRow - 1 !== r) {
					// Диапазон
					result = new asc_Range(topCell.c, r, topCell.c, ar.startRow - 1);
				} else {
					// Одна ячейка
					result = new asc_Range(topCell.c, r, topCell.c, r);
				}
				result.type = c_oAscSelectionType.RangeCells;
				this._fixSelectionOfMergedCells(result);
				if (result.c1 === result.c2 && result.r1 === result.r2)
					result.text = this._getCellTitle(result.c1, result.r1);
				else
					result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
				return result;
			}
		};

		// ----- Initialization -----

		WorksheetView.prototype._init = function () {
			this._initConstValues();
			this._initWorksheetDefaultWidth();
			this._initPane();
			this._initCellsArea(true);
			this.autoFilters.addFiltersAfterOpen();
			this._initConditionalFormatting();
			this._cleanCellsTextMetricsCache();
			this._prepareCellTextMetricsCache();

			// initializing is completed
			this.handlers.trigger("initialized");
		};

		WorksheetView.prototype._initConditionalFormatting = function () {
			var oGradient = null;
			var aCFs = this.model.aConditionalFormatting;
			var aRules, oRule;
			var oRuleElement = null;
			var min = Number.MAX_VALUE;
			var max = -Number.MAX_VALUE;
			var tmp;
			var arrayCells = [];
			for (var i in aCFs) {
				aRules = aCFs[i].aRules;
				if (0 >= aRules.length)
					continue;
				for (var j in aRules) {
					oRule = aRules[j];
					// ToDo aboveAverage, beginsWith, cellIs, containsBlanks, containsErrors,
					// ToDo containsText, dataBar, duplicateValues, endsWith, expression, iconSet, notContainsBlanks,
					// ToDo notContainsErrors, notContainsText, timePeriod, top10, uniqueValues (page 2679)
					switch (oRule.Type) {
						case Asc.ECfType.colorScale:
							if (1 !== oRule.aRuleElements.length)
								break;
							oRuleElement = oRule.aRuleElements[0];
							// ToDo убрать null === aCFs[i].SqRefRange когда научимся мультиселект обрабатывать (\\192.168.5.2\source\DOCUMENTS\XLSX\Matematika Quantum Sedekah.xlsx)
							if (!(oRuleElement instanceof asc.CColorScale) || null === aCFs[i].SqRefRange)
								break;
							aCFs[i].SqRefRange._setPropertyNoEmpty(null, null, function (c) {
								if (CellValueType.Number === c.getType() && false === c.isEmptyTextString()) {
									tmp = parseFloat(c.getValueWithoutFormat());
									if (isNaN(tmp))
										return;
									arrayCells.push({cell: c, val: tmp});
									min = Math.min(min, tmp);
									max = Math.max(max, tmp);
								}
							});

							// ToDo CFVO Type (formula, max, min, num, percent, percentile) (page 2681)
							// ToDo support 3 colors in rule
							if (0 < arrayCells.length && 2 === oRuleElement.aColors.length) {
								oGradient = new asc.CGradient(oRuleElement.aColors[0], oRuleElement.aColors[1]);
								oGradient.init(min, max);

								for (var cell in arrayCells) {
									var dxf = new CellXfs();
									dxf.fill = new Fill({bg:oGradient.calculateColor(arrayCells[cell].val)});
									arrayCells[cell].cell.setConditionalFormattingStyle(dxf);
								}
							}

							arrayCells.splice(0, arrayCells.length);
							min = Number.MAX_VALUE;
							max = -Number.MAX_VALUE;
							break;
					}
				}
			}
		};

		WorksheetView.prototype._prepareComments = function () {
			// Теперь получение всех комментариев через asc_getWorkbookComments
			var commentList = this.cellCommentator.prepareComments(this.model.aComments);
			if (0 < commentList.length)
				this.model.workbook.handlers.trigger("asc_onAddComments", commentList);
		};

		WorksheetView.prototype._prepareDrawingObjects = function () {
			this.objectRender = new DrawingObjects();
			if (!window["NATIVE_EDITOR_ENJINE"])
				this.objectRender.init(this);
		};

		WorksheetView.prototype._initWorksheetDefaultWidth = function () {
			this.nBaseColWidth = this.model.oSheetFormatPr.nBaseColWidth || this.nBaseColWidth;
			// Теперь рассчитываем число px
			var defaultColWidthChars = this._charCountToModelColWidth(this.nBaseColWidth);
			this.defaultColWidthPx = this._modelColWidthToColWidth(defaultColWidthChars) * asc_getcvt(1/*pt*/, 0/*px*/, 96);
			// Делаем кратным 8 (http://support.microsoft.com/kb/214123)
			this.defaultColWidthPx = asc_ceil(this.defaultColWidthPx / 8) * 8;
			this.defaultColWidthChars = this._colWidthToCharCount(this.defaultColWidthPx * asc_getcvt(0/*px*/, 1/*pt*/, 96));

			gc_dDefaultColWidthCharsAttribute = this._charCountToModelColWidth(this.defaultColWidthChars);
			this.defaultColWidth = this._modelColWidthToColWidth(gc_dDefaultColWidthCharsAttribute);

			var defaultFontSize = this.model.getDefaultFontSize();
			// ToDo разобраться со значениями
			this.maxRowHeight = asc_calcnpt(c_oAscMaxRowHeight, this._getPPIY());
			this.defaultRowDescender = this._calcRowDescender(defaultFontSize);
			gc_dDefaultRowHeightAttribute = this.defaultRowHeight = this.model.getDefaultHeight() ||
				asc_calcnpt(defaultFontSize * this.vspRatio, this._getPPIY()) + this.height_1px;

			this._setFont(undefined, this.model.getDefaultFontName(), defaultFontSize);
			var tm = this._roundTextMetrics(this.stringRender.measureString("A"));
			this.headersHeightByFont = tm.height;

			// Инициализируем число колонок и строк (при открытии). Причем нужно поставить на 1 больше,
			// чтобы могли показать последнюю строку/столбец (http://bugzserver/show_bug.cgi?id=23513)
			this.nColsCount = Math.min(this.model.getColsCount() + 1, gc_nMaxCol);
			this.nRowsCount = Math.min(this.model.getRowsCount() + 1, gc_nMaxRow);
		};

		WorksheetView.prototype._initConstValues = function () {
			var ppiX = this._getPPIX();
			var ppiY = this._getPPIY();
			this.width_1px = asc_calcnpt(0, ppiX, 1/*px*/);
			this.width_2px = asc_calcnpt(0, ppiX, 2/*px*/);
			this.width_3px = asc_calcnpt(0, ppiX, 3/*px*/);
			this.width_4px = asc_calcnpt(0, ppiX, 4/*px*/);
			this.width_padding = asc_calcnpt(0, ppiX, this.settings.cells.padding/*px*/);

			this.height_1px = asc_calcnpt(0, ppiY, 1/*px*/);
			this.height_2px = asc_calcnpt(0, ppiY, 2/*px*/);
			this.height_3px = asc_calcnpt(0, ppiY, 3/*px*/);
			this.height_4px = asc_calcnpt(0, ppiY, 4/*px*/);
		};

		WorksheetView.prototype._initCellsArea = function (fullRecalc) {
			// calculate rows heights and visible rows
			if (!(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight)) {
				this._calcHeaderRowHeight();
				this._calcHeightRows(fullRecalc ? 1 : 0);
			}
			this.visibleRange.r2 = 0;
			this._calcVisibleRows();
			this._updateVisibleRowsCount(/*skipScrolReinit*/true);

			// calculate columns widths and visible columns
			if (!(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight)) {
				this._calcHeaderColumnWidth();
				this._calcWidthColumns(fullRecalc ? 1 : 0);
			}
			this.visibleRange.c2 = 0;
			this._calcVisibleColumns();
			this._updateVisibleColsCount(/*skipScrolReinit*/true);
		};

		WorksheetView.prototype._initPane = function () {
			var pane = this.model.sheetViews[0].pane;
			if (null !== pane && pane.isInit()) {
				this.topLeftFrozenCell = pane.topLeftFrozenCell;
				this.visibleRange.r1 = this.topLeftFrozenCell.getRow0();
				this.visibleRange.c1 = this.topLeftFrozenCell.getCol0();
			}
		};

		WorksheetView.prototype._fixVisibleRange = function (range) {
			var tmp;
			if (null !== this.topLeftFrozenCell) {
				tmp = this.topLeftFrozenCell.getRow0();
				if (range.r1 < tmp) {
					range.r1 = tmp;
					tmp = this._findVisibleRow(range.r1, +1);
					if (0 < tmp)
						range.r1 = tmp;
				}
				tmp = this.topLeftFrozenCell.getCol0();
				if (range.c1 < tmp) {
					range.c1 = tmp;
					tmp = this._findVisibleCol(range.c1, +1);
					if (0 < tmp)
						range.c1 = tmp;
				}
			}
		};

		/**
		 * Вычисляет ширину столбца для заданного количества символов
		 * @param {Number} count  Количество символов
		 * @returns {Number}      Ширина столбца в символах
		 */
		WorksheetView.prototype._charCountToModelColWidth = function (count) {
			if (count <= 0) { return 0; }
			return asc_floor((count * this.maxDigitWidth + this.settings.cells.paddingPlusBorder) / this.maxDigitWidth * 256) / 256;
		};

		/**
		 * Вычисляет ширину столбца в пунктах
		 * @param {Number} mcw  Количество символов
		 * @returns {Number}    Ширина столбца в пунктах (pt)
		 */
		WorksheetView.prototype._modelColWidthToColWidth = function (mcw) {
			var px = asc_floor(((256 * mcw + asc_floor(128 / this.maxDigitWidth)) / 256) * this.maxDigitWidth);
			return px * asc_getcvt(0/*px*/, 1/*pt*/, 96);
		};

		/**
		 * Вычисляет количество символов по ширине столбца
		 * @param {Number} w  Ширина столбца в пунктах
		 * @returns {Number}  Количество символов
		 */
		WorksheetView.prototype._colWidthToCharCount = function (w) {
			var px = w * asc_getcvt(1/*pt*/, 0/*px*/, 96);
			var pxInOneCharacter = this.maxDigitWidth + this.settings.cells.paddingPlusBorder;
			// Когда меньше 1 символа, то просто считаем по пропорции относительно размера 1-го символа
			return px < pxInOneCharacter ? (1 - asc_floor(100 * (pxInOneCharacter - px) / pxInOneCharacter + 0.49999) / 100) :
				asc_floor((px - this.settings.cells.paddingPlusBorder) / this.maxDigitWidth * 100 + 0.5) / 100;
		};

		/**
		 * Вычисляет ширину столбца для отрисовки
		 * @param {Number} w  Ширина столбца в символах
		 * @returns {Number}  Ширина столбца в пунктах (pt)
		 */
		WorksheetView.prototype._calcColWidth = function (w) {
			var t = this;
			var res = {};
			var useDefault = w === undefined || w === null || w === -1;
			var width;
			res.width = useDefault ? t.defaultColWidth : (width = t._modelColWidthToColWidth(w), (width < t.width_1px ? 0 : width));
			res.innerWidth = Math.max(res.width - this.width_padding * 2 - this.width_1px, 0);
			res.charCount = t._colWidthToCharCount(res.width);
			return res;
		};

		/**
		 * Вычисляет Descender строки
		 * @param {Number} fontSize
		 * @returns {Number}
		 */
		WorksheetView.prototype._calcRowDescender = function (fontSize) {
			return asc_calcnpt(fontSize * (this.vspRatio - 1), this._getPPIY()); // ToDo возможно стоит тоже использовать 96
		};

		/** Вычисляет ширину колонки заголовков (в pt) */
		WorksheetView.prototype._calcHeaderColumnWidth = function () {
			if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
				this.headersWidth = 0;
			else {
				// Ширина колонки заголовков считается  - max число знаков в строке - перевести в символы - перевести в пикселы
				var numDigit = Math.max( calcDecades(this.visibleRange.r2 + 1), 3);
				var nCharCount = this._charCountToModelColWidth(numDigit);
				this.headersWidth = this._modelColWidthToColWidth(nCharCount);
			}

			//var w = this.emSize * Math.max( calcDecades(this.visibleRange.r2 + 1), 3) * 1.25;
			//this.headersWidth = asc_calcnpt(w, this._getPPIX());

			this.cellsLeft = this.headersLeft + this.headersWidth;
		};

		/** Вычисляет высоту строки заголовков (в pt) */
		WorksheetView.prototype._calcHeaderRowHeight = function () {
			if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
				this.headersHeight = 0;
			else
				//this.headersHeight = this.model.getDefaultHeight() || this.defaultRowHeight;
				this.headersHeight = this.headersHeightByFont + this.height_1px;

			//this.headersHeight = asc_calcnpt( this.settings.header.fontSize * this.vspRatio, this._getPPIY() );
			this.cellsTop = this.headersTop + this.headersHeight;
		};

		/**
		 * Вычисляет ширину и позицию колонок (в pt)
		 * @param {Number} fullRecalc  0 - без пересчета; 1 - пересчитываем все; 2 - пересчитываем новые строки
		 */
		WorksheetView.prototype._calcWidthColumns = function (fullRecalc) {
			var x = this.cellsLeft;
			var visibleW = this.drawingCtx.getWidth();
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var l = Math.max(this.model.getColsCount() + 1, this.nColsCount, obr.maxCol);
			var i = 0, w, column, isBestFit, hiddenW = 0;

			// Берем дефалтовую ширину документа
			var defaultWidth = this.model.getDefaultWidth();
			defaultWidth = (typeof defaultWidth === "number" && defaultWidth >= 0) ? defaultWidth : -1;

			if (1 === fullRecalc) {
				this.cols = [];
			} else if (2 === fullRecalc) {
				i = this.cols.length;
				x = this.cols[i - 1].left + this.cols[i - 1].width;
			}
			for (; ((0 !== fullRecalc) ? i < l || x + hiddenW < visibleW : i < this.cols.length) && i < gc_nMaxCol; ++i) {
				// Получаем свойства колонки
				column = this.model._getColNoEmptyWithAll(i);
				if (!column) {
					w = defaultWidth; // Используем дефолтное значение
					isBestFit = true; // Это уже оптимальная ширина
				} else if (column.hd) {
					w = 0;            // Если столбец скрытый, ширину выставляем 0
					isBestFit = false;
					hiddenW += this._calcColWidth(column.width).width;
				} else {
					w = column.width || defaultWidth;
					isBestFit = !!(column.BestFit || (null === column.BestFit && null === column.CustomWidth));
				}
				this.cols[i] = this._calcColWidth(w);
				this.cols[i].isCustomWidth = !isBestFit;
				this.cols[i].left = x;
				x += this.cols[i].width;
			}

			this.nColsCount = Math.min(Math.max(this.nColsCount, i), gc_nMaxCol);
		};

		/**
		 * Вычисляет высоту и позицию строк (в pt)
		 * @param {Number} fullRecalc  0 - без пересчета; 1 - пересчитываем все; 2 - пересчитываем новые строки
		 */
		WorksheetView.prototype._calcHeightRows = function (fullRecalc) {
			var y = this.cellsTop;
			var visibleH = this.drawingCtx.getHeight();
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var l = Math.max(this.model.getRowsCount() + 1, this.nRowsCount, obr.maxRow);
			var defaultH = this.defaultRowHeight;
			var i = 0, h, hR, isCustomHeight, row, hiddenH = 0;

			if (1 === fullRecalc) {
				this.rows = [];
			} else if (2 === fullRecalc) {
				i = this.rows.length;
				y = this.rows[i - 1].top + this.rows[i - 1].height;
			}
			for (; ((0 !== fullRecalc) ? i < l || y + hiddenH < visibleH : i < this.rows.length) && i < gc_nMaxRow; ++i) {
				row = this.model._getRowNoEmptyWithAll(i);
				if (!row) {
					h = -1; // Будет использоваться дефолтная высота строки
					isCustomHeight = false;
				} else if (0 != (g_nRowFlag_hd & row.flags)) {
					hR = h = 0;  // Скрытая строка, высоту выставляем 0
					isCustomHeight = true;
					hiddenH += row.h > 0 ? row.h - this.height_1px : defaultH;
				} else {
					isCustomHeight = 0 != (g_nRowFlag_CustomHeight & row.flags);
					// Берем высоту из модели, если она custom(баг 15618), либо дефолтную
					if (row.h > 0 && isCustomHeight) {
						hR = row.h;
						h = hR / 0.75; h = (h | h) * 0.75;			// 0.75 - это размер 1px в pt (можно было 96/72)
					} else
						h = -1;
				}
				h = h < 0 ? (hR = defaultH) : h;
				this.rows[i] = {
					top: y,
					height: h,												// Высота с точностью до 1 px
					heightReal: hR,											// Реальная высота из файла (может быть не кратна 1 px, в Excel можно выставить через меню строки)
					descender: this.defaultRowDescender,
					isCustomHeight: isCustomHeight,
					isDefaultHeight: !(row && row.h > 0 && isCustomHeight)  // Высота строки, вычисленная на основе текста
				};
				y += this.rows[i].height;
			}

			this.nRowsCount = Math.min(Math.max(this.nRowsCount, i), gc_nMaxRow);
		};

		/** Вычисляет диапазон индексов видимых колонок */
		WorksheetView.prototype._calcVisibleColumns = function () {
			var l = this.cols.length;
			var w = this.drawingCtx.getWidth();
			var sumW = this.topLeftFrozenCell ? this.cols[this.topLeftFrozenCell.getCol0()].left : this.cellsLeft;
			for (var i = this.visibleRange.c1, f = false; i < l && sumW < w; ++i) {
				sumW += this.cols[i].width;
				f = true;
			}
			this.visibleRange.c2 = i - (f ? 1 : 0);
		};

		/** Вычисляет диапазон индексов видимых строк */
		WorksheetView.prototype._calcVisibleRows = function () {
			var l = this.rows.length;
			var h = this.drawingCtx.getHeight();
			var sumH = this.topLeftFrozenCell ? this.rows[this.topLeftFrozenCell.getRow0()].top : this.cellsTop;
			for (var i = this.visibleRange.r1, f = false; i < l && sumH < h; ++i) {
				sumH += this.rows[i].height;
				f = true;
			}
			this.visibleRange.r2 = i - (f ? 1 : 0);
		};

		/** Обновляет позицию колонок (в pt) */
		WorksheetView.prototype._updateColumnPositions = function () {
			var x = this.cellsLeft;
			for (var l = this.cols.length, i = 0; i < l; ++i) {
				this.cols[i].left = x;
				x += this.cols[i].width;
			}
		};

		/** Обновляет позицию строк (в pt) */
		WorksheetView.prototype._updateRowPositions = function () {
			var y = this.cellsTop;
			for (var l = this.rows.length, i = 0; i < l; ++i) {
				this.rows[i].top = y;
				y += this.rows[i].height;
			}
		};

		/**
		 * Добавляет колонки, пока общая ширина листа не превысит rightSide
		 * @param {Number} rightSide Правая граница
		 */
		WorksheetView.prototype._appendColumns = function (rightSide) {
			var i = this.cols.length;
			var lc = this.cols[i - 1];
			var done = false;

			for (var x = lc.left + lc.width; i < gc_nMaxCol && (x < rightSide || !done); ++i) {
				if (x >= rightSide) {
					// add +1 column at the end and exit cycle
					done = true;
				}
				this.cols[i] = this._calcColWidth( this.model.getColWidth(i) );
				this.cols[i].left = x;
				x += this.cols[i].width;
				this.isChanged = true;
			}
			this.nColsCount = Math.min(Math.max(this.nColsCount, i), gc_nMaxCol);
		};

		/** Устанаваливает видимый диапазон ячеек максимально возможным */
		WorksheetView.prototype._normalizeViewRange = function () {
			var t = this;
			var vr = t.visibleRange;
			var w = t.drawingCtx.getWidth() - t.cellsLeft;
			var h = t.drawingCtx.getHeight() - t.cellsTop;
			var c = t.cols;
			var r = t.rows;
			var vw = c[vr.c2].left + c[vr.c2].width - c[vr.c1].left;
			var vh = r[vr.r2].top + r[vr.r2].height - r[vr.r1].top;
			var i;

			var offsetFrozen = t.getFrozenPaneOffset();
			vw += offsetFrozen.offsetX;
			vh += offsetFrozen.offsetY;

			if (vw < w) {
				for (i = vr.c1 - 1; i >= 0; --i) {
					vw += c[i].width;
					if (vw > w) {break;}
				}
				vr.c1 = i + 1;
				if (vr.c1 >= vr.c2) {vr.c1 = vr.c2 - 1;}
				if (vr.c1 < 0) {vr.c1 = 0;}
			}

			if (vh < h) {
				for (i = vr.r1 - 1; i >= 0; --i) {
					vh += r[i].height;
					if (vh > h) {break;}
				}
				vr.r1 = i + 1;
				if (vr.r1 >= vr.r2) {vr.r1 = vr.r2 - 1;}
				if (vr.r1 < 0) {vr.r1 = 0;}
			}
		};

		WorksheetView.prototype._shiftVisibleRange = function (range) {
			var t = this;
			var vr = t.visibleRange;
			var arn = range ? range : t.activeRange.clone(true);
			var i;

			var cFrozen = 0, rFrozen = 0;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				rFrozen = this.topLeftFrozenCell.getRow0();
			}

			do {
				if (arn.r2 > vr.r2) {
					i = arn.r2 - vr.r2;
					vr.r1 += i;
					vr.r2 += i;
					t._calcVisibleRows();
					continue;
				}
				if (t._isRowDrawnPartially(arn.r2, vr.r1)) {
					vr.r1 += 1;
					t._calcVisibleRows();
				}
				if (arn.r1 < vr.r1 && arn.r1 >= rFrozen) {
					i = arn.r1 - vr.r1;
					vr.r1 += i;
					vr.r2 += i;
					t._calcVisibleRows();
				}
				break;
			} while (1);

			do {
				if (arn.c2 > vr.c2) {
					i = arn.c2 - vr.c2;
					vr.c1 += i;
					vr.c2 += i;
					t._calcVisibleColumns();
					continue;
				}
				if (t._isColDrawnPartially(arn.c2, vr.c1)) {
					vr.c1 += 1;
					t._calcVisibleColumns();
				}
				if (arn.c1 < vr.c1 && arn.c1 >= cFrozen) {
					i = arn.c1 - vr.c1;
					vr.c1 += i;
					vr.c2 += i;
					if (vr.c1 < 0) { vr.c1 = 0; vr.c2 -= vr.c1; }
					t._calcVisibleColumns();
				}
				break;
			} while (1);
		};

		// ----- Drawing for print -----
		WorksheetView.prototype.calcPagesPrint = function (pageOptions, printOnlySelection, indexWorksheet, layoutPageType) {
			var range;
			var maxCols = this.model.getColsCount();
			var maxRows = this.model.getRowsCount();
			var lastC = -1, lastR = -1;
			var activeRange = printOnlySelection ? this.activeRange : null;

			if (null === activeRange) {
				range = new asc_Range(0, 0, maxCols, maxRows);
				this._prepareCellTextMetricsCache(range);
				for (var c = 0; c < maxCols; ++c) {
					for (var r = 0; r < maxRows; ++r) {
						if (!this._isCellEmptyOrMergedOrBackgroundColorOrBorders(c, r)) {
								var rightSide = 0;
								var ct = this._getCellTextCache(c, r);
								if (ct !== undefined) {
									if (!ct.flags.isMerged() && !ct.flags.wrapText)
										rightSide = ct.sideR;
								}

								lastC = Math.max(lastC, c + rightSide);
								lastR = Math.max(lastR, r);
							}
					}
				}
				maxCols = lastC + 1;
				maxRows = lastR + 1;

				// Получаем максимальную колонку/строку для изображений/чатов
				var maxObjectsCoord = this.objectRender.getDrawingAreaMetrics();
				if (maxObjectsCoord) {
					maxCols = Math.max (maxCols, maxObjectsCoord.maxCol);
					maxRows = Math.max (maxRows, maxObjectsCoord.maxRow);
				}
			} else {
				maxCols = activeRange.c2 + 1;
				maxRows = activeRange.r2 + 1;
				range = new asc_Range(0, 0, maxCols, maxRows);
				this._prepareCellTextMetricsCache(range);
			}

			var pageMargins, pageSetup, pageGridLines, pageHeadings;
			if (pageOptions instanceof asc_CPageOptions) {
				pageMargins = pageOptions.asc_getPageMargins();
				pageSetup = pageOptions.asc_getPageSetup();
				pageGridLines = pageOptions.asc_getGridLines();
				pageHeadings = pageOptions.asc_getHeadings();
			}

			var pageWidth, pageHeight, pageOrientation;
			if (pageSetup instanceof asc_CPageSetup) {
					pageWidth = pageSetup.asc_getWidth();
					pageHeight = pageSetup.asc_getHeight();
					pageOrientation = pageSetup.asc_getOrientation();
				}

			var pageLeftField, pageRightField, pageTopField, pageBottomField;
			if (pageMargins instanceof asc_CPageMargins) {
				pageLeftField = pageMargins.asc_getLeft();
				pageRightField = pageMargins.asc_getRight();
				pageTopField = pageMargins.asc_getTop();
				pageBottomField = pageMargins.asc_getBottom();
			}

			if (null == pageGridLines) { pageGridLines = c_oAscPrintDefaultSettings.PageGridLines; }
			if (null == pageHeadings) { pageHeadings = c_oAscPrintDefaultSettings.PageHeadings; }

			if (null == pageWidth) { pageWidth = c_oAscPrintDefaultSettings.PageWidth; }
			if (null == pageHeight) { pageHeight = c_oAscPrintDefaultSettings.PageHeight; }
			if (null == pageOrientation) { pageOrientation = c_oAscPrintDefaultSettings.PageOrientation; }

			if (null == pageLeftField) { pageLeftField = c_oAscPrintDefaultSettings.PageLeftField; }
			if (null == pageRightField) { pageRightField = c_oAscPrintDefaultSettings.PageRightField; }
			if (null == pageTopField) { pageTopField = c_oAscPrintDefaultSettings.PageTopField; }
			if (null == pageBottomField) { pageBottomField = c_oAscPrintDefaultSettings.PageBottomField; }

			if (c_oAscPageOrientation.PageLandscape === pageOrientation) {
				var tmp = pageWidth;
				pageWidth = pageHeight;
				pageHeight = tmp;
			}

			var arrResult = [];
			if (0 === maxCols || 0 === maxRows) {
				// Ничего нет, возвращаем пустой массив
				return null;
			} else {
				var pageWidthWithFields = pageWidth - pageLeftField - pageRightField;
				var pageHeightWithFields = pageHeight - pageTopField - pageBottomField;
				var leftFieldInPt = pageLeftField / vector_koef;
				var topFieldInPt = pageTopField / vector_koef;
				var rightFieldInPt = pageRightField / vector_koef;
				var bottomFieldInPt = pageBottomField / vector_koef;

				if (pageHeadings) {
					// Рисуем заголовки, нужно чуть сдвинуться
					leftFieldInPt += this.cellsLeft;
					topFieldInPt += this.cellsTop;
				}

				var pageWidthWithFieldsHeadings = (pageWidth - pageRightField) / vector_koef - leftFieldInPt;
				var pageHeightWithFieldsHeadings = (pageHeight - pageBottomField) / vector_koef - topFieldInPt;

				var currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
				var currentWidth = 0;
				var currentRowIndex = (null !== activeRange) ? activeRange.r1 : 0;
				var currentHeight = 0;
				var isCalcColumnsWidth = true;

				var bIsAddOffset = false;
				var nCountOffset = 0;

				while (true) {
					if (currentColIndex === maxCols && currentRowIndex === maxRows)
						break;

					var newPagePrint = new asc_CPagePrint();

					var colIndex = currentColIndex, rowIndex = currentRowIndex;

					newPagePrint.indexWorksheet = indexWorksheet;

					newPagePrint.pageWidth = pageWidth;
					newPagePrint.pageHeight = pageHeight;
					newPagePrint.pageClipRectLeft = pageLeftField / vector_koef;
					newPagePrint.pageClipRectTop = pageTopField / vector_koef;
					newPagePrint.pageClipRectWidth = pageWidthWithFields / vector_koef;
					newPagePrint.pageClipRectHeight = pageHeightWithFields / vector_koef;

					newPagePrint.leftFieldInPt = leftFieldInPt;
					newPagePrint.topFieldInPt = topFieldInPt;
					newPagePrint.rightFieldInPt = rightFieldInPt;
					newPagePrint.bottomFieldInPt = bottomFieldInPt;

					for (rowIndex = currentRowIndex; rowIndex < maxRows; ++rowIndex) {
						var currentRowHeight = this.rows[rowIndex].height;
						if (currentHeight + currentRowHeight > pageHeightWithFieldsHeadings) {
							// Закончили рисовать страницу
							break;
						}
						if (isCalcColumnsWidth) {
							for (colIndex = currentColIndex; colIndex < maxCols; ++colIndex) {
								var currentColWidth = this.cols[colIndex].width;
								if (bIsAddOffset) {
									newPagePrint.startOffset = ++nCountOffset;
									newPagePrint.startOffsetPt = (pageWidthWithFieldsHeadings * newPagePrint.startOffset);
									currentColWidth -= newPagePrint.startOffsetPt;
								}

								if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth + currentColWidth > pageWidthWithFieldsHeadings && colIndex !== currentColIndex)
									break;

								currentWidth += currentColWidth;

								if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth > pageWidthWithFieldsHeadings && colIndex === currentColIndex) {
									// Смещаем в селедующий раз ячейку
									bIsAddOffset = true;
									++colIndex;
									break;
								} else
									bIsAddOffset = false;
							}
							isCalcColumnsWidth = false;
							if (pageHeadings) {
								currentWidth += this.cellsLeft;
							}

							if (c_oAscLayoutPageType.FitToWidth === layoutPageType) {
								newPagePrint.pageClipRectWidth = Math.max(currentWidth, newPagePrint.pageClipRectWidth);
								newPagePrint.pageWidth = newPagePrint.pageClipRectWidth * vector_koef + (pageLeftField + pageRightField);
							} else {
								newPagePrint.pageClipRectWidth = Math.min(currentWidth, newPagePrint.pageClipRectWidth);
							}
						}

						currentHeight += currentRowHeight;
						currentWidth = 0;
					}

					// Нужно будет пересчитывать колонки
					isCalcColumnsWidth = true;

					// Рисуем сетку
					if (pageGridLines) {
						newPagePrint.pageGridLines = true;
					}

					if (pageHeadings) {
						// Нужно отрисовать заголовки
						newPagePrint.pageHeadings = true;
					}

					newPagePrint.pageRange = new asc_Range(currentColIndex, currentRowIndex, colIndex - 1, rowIndex - 1);

					if (bIsAddOffset) {
						// Мы еще не дорисовали колонку
						colIndex -= 1;
					} else {
						nCountOffset = 0;
					}

					if (colIndex < maxCols) {
						// Мы еще не все колонки отрисовали
						currentColIndex = colIndex;
						currentHeight = 0;
					}
					else {
						// Мы дорисовали все колонки, нужна новая строка и стартовая колонка
						currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
						currentRowIndex = rowIndex;
						currentHeight = 0;
					}

					if (rowIndex === maxRows) {
						// Мы вышли, т.к. дошли до конца отрисовки по строкам
						if (colIndex < maxCols) {
							currentColIndex = colIndex;
							currentHeight = 0;
						} else {
							// Мы дошли до конца отрисовки
							currentColIndex = colIndex;
							currentRowIndex = rowIndex;
						}
					}

					arrResult.push(newPagePrint);
				}
			}

			return arrResult;
		};
		WorksheetView.prototype.drawForPrint = function (drawingCtx, printPagesData) {
            var isAppBridge = (undefined != window['appBridge']);

			if (null === printPagesData) {
				// Напечатаем пустую страницу
				drawingCtx.BeginPage (c_oAscPrintDefaultSettings.PageWidth, c_oAscPrintDefaultSettings.PageHeight);
				drawingCtx.EndPage();
			} else {
				drawingCtx.BeginPage (printPagesData.pageWidth, printPagesData.pageHeight);
				drawingCtx.AddClipRect (printPagesData.pageClipRectLeft, printPagesData.pageClipRectTop,
					printPagesData.pageClipRectWidth, printPagesData.pageClipRectHeight);

                if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                var offsetCols = printPagesData.startOffsetPt;
				var range = printPagesData.pageRange;
				var offsetX = this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols;
				var offsetY = this.rows[range.r1].top - printPagesData.topFieldInPt;

				var tmpVisibleRange = this.visibleRange;
				// Сменим visibleRange для прохождения проверок отрисовки
				this.visibleRange = range;

				if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

				// Нужно отрисовать заголовки
				if (printPagesData.pageHeadings) {
					this._drawColumnHeaders(drawingCtx, range.c1, range.c2, /*style*/ undefined,
						offsetX, printPagesData.topFieldInPt - this.cellsTop);
					this._drawRowHeaders(drawingCtx, range.r1, range.r2, /*style*/ undefined,
						printPagesData.leftFieldInPt - this.cellsLeft, offsetY);
				}

				if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

				// Рисуем сетку
				if (printPagesData.pageGridLines) {
					this._drawGrid(drawingCtx, range, offsetX, offsetY,
						printPagesData.pageWidth / vector_koef, printPagesData.pageHeight / vector_koef);
				}

				if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

				// Отрисовываем ячейки и бордеры
				this._drawCellsAndBorders(drawingCtx, range, offsetX, offsetY);

                if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

				var drawingPrintOptions = {
					ctx: drawingCtx,
					printPagesData: printPagesData
				};
				this.objectRender.showDrawingObjectsEx(false, null, drawingPrintOptions);
				this.visibleRange = tmpVisibleRange;

                if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                drawingCtx.RemoveClipRect();
				drawingCtx.EndPage();
			}
		};

		// ----- Drawing -----

		WorksheetView.prototype.draw = function (lockDraw) {
			if (lockDraw || this.model.workbook.bCollaborativeChanges)
				return this;
			this._clean();
			this._drawCorner();
			this._drawColumnHeaders(/*drawingCtx*/ undefined);
			this._drawRowHeaders(/*drawingCtx*/ undefined);
			this._drawGrid(/*drawingCtx*/ undefined);
			this._drawCellsAndBorders(/*drawingCtx*/undefined);
			this._drawFrozenPane();
			this._drawFrozenPaneLines();
			this._fixSelectionOfMergedCells();
			this._drawAutoF();
			this.cellCommentator.drawCommentCells();
			this.objectRender.showDrawingObjectsEx(true);
			if (this.overlayCtx) {
				this._drawSelection();
			}

			return this;
		};

		WorksheetView.prototype._clean = function () {
			this.drawingCtx
				.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(0, 0, this.drawingCtx.getWidth(), this.drawingCtx.getHeight());
			if (this.overlayCtx) {
				this.overlayCtx.clear();
			}
		};

		WorksheetView.prototype.drawHighlightedHeaders = function (col, row) {
			this._activateOverlayCtx();
			if (col >= 0 && col !== this.highlightedCol) {
				this._doCleanHighlightedHeaders();
				this.highlightedCol = col;
				this._drawColumnHeaders(/*drawingCtx*/ undefined, col, col, kHeaderHighlighted);
			} else if (row >= 0 && row !== this.highlightedRow) {
				this._doCleanHighlightedHeaders();
				this.highlightedRow = row;
				this._drawRowHeaders(/*drawingCtx*/ undefined, row, row, kHeaderHighlighted);
			}
			this._deactivateOverlayCtx();
			return this;
		};

		WorksheetView.prototype.cleanHighlightedHeaders = function () {
			this._activateOverlayCtx();
			this._doCleanHighlightedHeaders();
			this._deactivateOverlayCtx();
			return this;
		};

		WorksheetView.prototype._activateOverlayCtx = function () {
			this.drawingCtx = this.buffers.overlay;
		};

		WorksheetView.prototype._deactivateOverlayCtx = function () {
			this.drawingCtx = this.buffers.main;
		};

		WorksheetView.prototype._doCleanHighlightedHeaders = function () {
			var hlc = this.highlightedCol,
				hlr = this.highlightedRow,
				arn = this.activeRange.clone(true);
			var hStyle = this.objectRender.selectedGraphicObjectsExists() ? kHeaderDefault : kHeaderActive;
			if (hlc >= 0) {
				if (hlc >= arn.c1 && hlc <= arn.c2) {
					this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc, hlc, hStyle);
				} else {
					this._cleanColumnHeaders(hlc);
					if (hlc + 1 === arn.c1) {
						this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc + 1, hlc + 1, kHeaderActive);
					} else if (hlc - 1 === arn.c2) {
						this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc - 1, hlc - 1, hStyle);
					}
				}
				this.highlightedCol = -1;
			}
			if (hlr >= 0) {
				if (hlr >= arn.r1 && hlr <= arn.r2) {
					this._drawRowHeaders(/*drawingCtx*/ undefined, hlr, hlr, hStyle);
				} else {
					this._cleanRowHeades(hlr);
					if (hlr + 1 === arn.r1) {
						this._drawRowHeaders(/*drawingCtx*/ undefined, hlr + 1, hlr + 1, kHeaderActive);
					} else if (hlr - 1 === arn.r2) {
						this._drawRowHeaders(/*drawingCtx*/ undefined, hlr - 1, hlr - 1, hStyle);
					}
				}
				this.highlightedRow = -1;
			}
		};

		WorksheetView.prototype._drawActiveHeaders = function () {
			var arn = this.activeRange.clone(true),
				vr = this.visibleRange,
				c1 = Math.max(vr.c1, arn.c1),
				c2 = Math.min(vr.c2, arn.c2),
				r1 = Math.max(vr.r1, arn.r1),
				r2 = Math.min(vr.r2, arn.r2);
			this._activateOverlayCtx();
			this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2, kHeaderActive);
			this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2, kHeaderActive);
			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0() - 1;
				var rFrozen = this.topLeftFrozenCell.getRow0() - 1;
				if (0 <= cFrozen) {
					c1 = Math.max(0, arn.c1);
					c2 = Math.min(cFrozen, arn.c2);
					this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2, kHeaderActive);
				}
				if (0 <= rFrozen) {
					r1 = Math.max(0, arn.r1);
					r2 = Math.min(rFrozen, arn.r2);
					this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2, kHeaderActive);
				}
			}
			this._deactivateOverlayCtx();
		};

		WorksheetView.prototype._drawCorner = function () {
			if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
				return;
			var x2 = this.headersLeft + this.headersWidth;
			var x1 = x2 - this.headersHeight;
			var y2 = this.headersTop + this.headersHeight;
			var y1 = this.headersTop;

			var dx = 4 * this.width_1px;
			var dy = 4 * this.height_1px;

			this._drawHeader(/*drawingCtx*/ undefined, this.headersLeft, this.headersTop,
				this.headersWidth, this.headersHeight, kHeaderDefault, true, -1);
			this.drawingCtx.beginPath()
				.moveTo(x2 - dx, y1 + dy)
				.lineTo(x2 - dx, y2 - dy)
				.lineTo(x1 + dx, y2 - dy)
				.lineTo(x2 - dx, y1 + dy)
				.setFillStyle(this.settings.header.cornerColor)
				.fill();
		};

		/** Рисует заголовки видимых колонок */
		WorksheetView.prototype._drawColumnHeaders = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
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

			// draw column headers
			for (var i = start; i <= end; ++i) {
				this._drawHeader(drawingCtx, c[i].left - offsetX, offsetY,
					c[i].width, this.headersHeight, style, true, i);
			}
		};

		/** Рисует заголовки видимых строк */
		WorksheetView.prototype._drawRowHeaders = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
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

			// draw row headers
			for (var i = start; i <= end; ++i) {
				this._drawHeader(drawingCtx, offsetX, r[i].top - offsetY,
					this.headersWidth, r[i].height, style, false, i);
			}
		};

		/**
		* Рисует заголовок, принимает координаты и размеры в pt
		* @param {DrawingContext} drawingCtx
		* @param {Number} x  Координата левого угла в pt
		* @param {Number} y  Координата левого угла в pt
		* @param {Number} w  Ширина в pt
		* @param {Number} h  Высота в pt
		* @param {Number} style  Стиль заголовка (kHeaderDefault, kHeaderActive, kHeaderHighlighted, kHeaderSelected)
		* @param {Boolean} isColHeader  Тип заголовка: true - колонка, false - строка
		* @param {Number} index  Индекс столбца/строки или -1
		*/
		WorksheetView.prototype._drawHeader = function (drawingCtx, x, y, w, h, style, isColHeader, index) {
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
					.fillRect(x, y, w, h);
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
			ctx.lineVerPrevPx(x2, y, y2);
			// Bottom border
			ctx.lineHorPrevPx(x, y2, x2);

			if (style !== kHeaderDefault && isColHeader) {
				// Select col (left border)
				ctx.lineVerPrevPx(x, y, y2);
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

		WorksheetView.prototype._cleanColumnHeaders = function (colStart, colEnd) {	
			var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
			var i, cFrozen = 0;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				offsetX -= this.cols[cFrozen].left - this.cols[0].left;
			}

			if (colEnd === undefined) {colEnd = colStart;}
			var colStartTmp = Math.max(this.visibleRange.c1, colStart);
			var colEndTmp = Math.min(this.visibleRange.c2, colEnd);
			for (i = colStartTmp; i <= colEndTmp; ++i) {
				this.drawingCtx.clearRectByX(this.cols[i].left - offsetX, this.headersTop,
					this.cols[i].width, this.headersHeight);
			}
			if (0 !== cFrozen) {
				offsetX = this.cols[0].left - this.cellsLeft;
				// Почистим для pane
				colStart = Math.max(0, colStart);
				colEnd = Math.min(cFrozen, colEnd);
				for (i = colStart; i <= colEnd; ++i) {
					this.drawingCtx.clearRectByX(this.cols[i].left - offsetX, this.headersTop,
						this.cols[i].width, this.headersHeight);
				}
			}
		};

		WorksheetView.prototype._cleanRowHeades = function (rowStart, rowEnd) {
			var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
			var i, rFrozen = 0;
			if (this.topLeftFrozenCell) {
				rFrozen = this.topLeftFrozenCell.getRow0();
				offsetY -= this.rows[rFrozen].top - this.rows[0].top;
			}

			if (rowEnd === undefined) {rowEnd = rowStart;}
			var rowStartTmp = Math.max(this.visibleRange.r1, rowStart);
			var rowEndTmp = Math.min(this.visibleRange.r2, rowEnd);
			for (i = rowStartTmp; i <= rowEndTmp; ++i) {
				if (this.height_1px > this.rows[i].height)
					continue;
				this.drawingCtx.clearRectByY(this.headersLeft, this.rows[i].top - offsetY,
					this.headersWidth, this.rows[i].height);
			}
			if (0 !== rFrozen) {
				offsetY = this.rows[0].top - this.cellsTop;
				// Почистим для pane
				rowStart = Math.max(0, rowStart);
				rowEnd = Math.min(rFrozen, rowEnd);
				for (i = rowStart; i <= rowEnd; ++i) {
					if (this.height_1px > this.rows[i].height)
						continue;
					this.drawingCtx.clearRectByY(this.headersLeft, this.rows[i].top - offsetY,
						this.headersWidth, this.rows[i].height);
				}
			}
		};

		WorksheetView.prototype._cleanColumnHeadersRect = function () {
			this.drawingCtx.clearRect(
				this.cellsLeft, this.headersTop,
				this.drawingCtx.getWidth() - this.cellsLeft, this.headersHeight);
		};

		/** Рисует сетку таблицы */
		WorksheetView.prototype._drawGrid = function (drawingCtx, range, leftFieldInPt, topFieldInPt, width, height) {
			// Возможно сетку не нужно рисовать (при печати свои проверки)
			if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowGridLines())
				return;

			if (range === undefined) {
				range = this.visibleRange;
			}
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			var c = this.cols;
			var r = this.rows;
			var widthCtx = (width) ? width : ctx.getWidth();
			var heightCtx = (height) ? height : ctx.getHeight();
			var offsetX = (undefined !== leftFieldInPt) ? leftFieldInPt : c[this.visibleRange.c1].left - this.cellsLeft;
			var offsetY = (undefined !== topFieldInPt) ? topFieldInPt : r[this.visibleRange.r1].top - this.cellsTop;
			if (undefined === drawingCtx && this.topLeftFrozenCell) {
				if (undefined === leftFieldInPt) {
					var cFrozen = this.topLeftFrozenCell.getCol0();
					offsetX -= c[cFrozen].left - c[0].left;
				}
				if (undefined === topFieldInPt) {
					var rFrozen = this.topLeftFrozenCell.getRow0();
					offsetY -= r[rFrozen].top - r[0].top;
				}
			}
			var x1  = c[range.c1].left - offsetX;
			var y1  = r[range.r1].top - offsetY;
			var x2  = Math.min(c[range.c2].left - offsetX + c[range.c2].width, widthCtx);
			var y2  = Math.min(r[range.r2].top - offsetY + r[range.r2].height, heightCtx);
			ctx.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(x1, y1, x2 - x1, y2 - y1)
				.setStrokeStyle(this.settings.cells.defaultState.border)
				.setLineWidth(1).beginPath();

			var w, h;
			for (var i = range.c1, x = x1; i <= range.c2 && x <= x2; ++i) {
				w = c[i].width;
				x += w;
				if (w >= this.width_1px)
					ctx.lineVerPrevPx(x, y1, y2);
			}
			for (var j = range.r1, y = y1; j <= range.r2 && y <= y2; ++j) {
				h = r[j].height;
				y += h;
				if (h >= this.height_1px)
					ctx.lineHorPrevPx(x1, y, x2);
			}

			ctx.stroke();
		};

		WorksheetView.prototype._drawCellsAndBorders = function (drawingCtx, range, offsetXForDraw, offsetYForDraw) {
			if (range === undefined) {
				range = this.visibleRange;
			}

			var left, top, cFrozen, rFrozen;
			var offsetX = (undefined === offsetXForDraw) ? this.cols[this.visibleRange.c1].left - this.cellsLeft : offsetXForDraw;
			var offsetY = (undefined === offsetYForDraw) ? this.rows[this.visibleRange.r1].top - this.cellsTop : offsetYForDraw;
			if (undefined === drawingCtx && this.topLeftFrozenCell) {
				if (undefined === offsetXForDraw) {
					cFrozen = this.topLeftFrozenCell.getCol0();
					offsetX -= this.cols[cFrozen].left - this.cols[0].left;
				}
				if (undefined === offsetYForDraw) {
					rFrozen = this.topLeftFrozenCell.getRow0();
					offsetY -= this.rows[rFrozen].top - this.rows[0].top;
				}
			}

			if (!drawingCtx) {
				left = this.cols[range.c1].left;
				top = this.rows[range.r1].top;
				// set clipping rect to cells area
				this.drawingCtx.save()
					.beginPath()
					.rect(left - offsetX, top - offsetY,
					Math.min(this.cols[range.c2].left - left + this.cols[range.c2].width, this.drawingCtx.getWidth() - this.cellsLeft),
					Math.min(this.rows[range.r2].top - top + this.rows[range.r2].height, this.drawingCtx.getHeight() - this.cellsTop))
					.clip();
			}

			var mergedCells = this._drawCells(drawingCtx, range, offsetX, offsetY);
			this._drawCellsBorders(drawingCtx, range, offsetX, offsetY, mergedCells);

			if (!drawingCtx) {
				// restore canvas' original clipping range
				this.drawingCtx.restore();
			}
		};

		/** Рисует ячейки таблицы */
		WorksheetView.prototype._drawCells = function (drawingCtx, range, offsetX, offsetY) {
			this._prepareCellTextMetricsCache(range);

			var mergedCells = {}, mc, i;
			for (var row = range.r1; row <= range.r2; ++row) {
				$.extend( mergedCells,
					this._drawRowBG(drawingCtx, row, range.c1, range.c2, offsetX, offsetY, null),
					this._drawRowText(drawingCtx, row, range.c1, range.c2, offsetX, offsetY) );
			}
			// draw merged cells at last stage to fix cells background issue
			for (i in mergedCells) {
				mc = mergedCells[i];
				this._drawRowBG(drawingCtx, mc.r1, mc.c1, mc.c1, offsetX, offsetY, mc);
				this._drawCellText(drawingCtx, mc.c1, mc.r1, range.c1, range.c2, offsetX, offsetY, true);
			}
			return mergedCells;
		};

		/** Рисует фон ячеек в строке */
		WorksheetView.prototype._drawRowBG = function (drawingCtx, row, colStart, colEnd, offsetX, offsetY, oMergedCell) {
			if (this.rows[row].height < this.height_1px && null === oMergedCell) {return {};}

			var mergedCells = {};
			var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
			for (var col = colStart; col <= colEnd; ++col) {
				if (this.cols[col].width < this.width_1px && null === oMergedCell) {continue;}

				// ToDo подумать, может стоит не брать ячейку из модели (а брать из кеш-а)
				var c = this._getVisibleCell(col, row);
				if (!c) {continue;}

				var bg = c.getFill();
				var mc = null;
				var mwidth = 0, mheight = 0;

				if (null === oMergedCell) {
					mc = this.model.getMergedByCell(row, col);
					if (null !== mc) {
						mergedCells[mc.r1 + "_" + mc.c1] = {c1: mc.c1, r1: mc.r1, c2: mc.c2, r2: mc.r2};
						col = mc.c2;
						continue;
					}
				} else
					mc = oMergedCell;

				if (null !== mc) {
					if (col !== mc.c1 || row !== mc.r1) {continue;}
					for (var i = mc.c1 + 1; i <= mc.c2 && i < this.cols.length; ++i) {mwidth += this.cols[i].width;}
					for (var j = mc.r1 + 1; j <= mc.r2 && j < this.rows.length; ++j) {mheight += this.rows[j].height;}
				} else {
					if (bg === null) {
						if (col === colEnd && col < this.cols.length - 1 && row < this.rows.length - 1) {
							var c2 = this._getVisibleCell(col + 1, row);
							if (c2) {
								var bg2 = c2.getFill();
								if (bg2 !== null) {
									ctx.setFillStyle(bg2)
											.fillRect(
													this.cols[col + 1].left - offsetX - this.width_1px,
													this.rows[row].top - offsetY - this.height_1px,
													this.width_1px,
													this.rows[row].height + this.height_1px);
								}
							}
							var c3 = this._getVisibleCell(col, row + 1);
							if (c3) {
								var bg3 = c3.getFill();
								if (bg3 !== null) {
									ctx.setFillStyle(bg3)
											.fillRect(
													this.cols[col].left - offsetX - this.width_1px,
													this.rows[row + 1].top - offsetY - this.height_1px,
													this.cols[col].width + this.width_1px,
													this.height_1px);
								}
							}
						}
						continue;
					}
				}

				var x = this.cols[col].left - (bg !== null ? this.width_1px : 0);
				var y = this.rows[row].top - (bg !== null ? this.height_1px : 0);
				var w = this.cols[col].width + this.width_1px * (bg !== null ? +1 : -1) + mwidth;
				var h = this.rows[row].height + this.height_1px * (bg !== null ? +1 : -1) + mheight;
				var color = bg !== null ? bg : this.settings.cells.defaultState.background;
				ctx.setFillStyle(color).fillRect(x - offsetX, y - offsetY, w, h);
			}
			return mergedCells;
		};

		/** Рисует текст ячеек в строке */
		WorksheetView.prototype._drawRowText = function (drawingCtx, row, colStart, colEnd, offsetX, offsetY) {
			if (this.rows[row].height < this.height_1px) {return {};}

			var dependentCells = {}, mergedCells = {}, i, mc, col;
			// draw cells' text
			for (col = colStart; col <= colEnd; ++col) {
				if (this.cols[col].width < this.width_1px) {continue;}
				mc = this._drawCellText(drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, false);
				if (mc !== null) {mergedCells[mc.index] = {c1: mc.c1, r1: mc.r1, c2: mc.c2, r2: mc.r2};}
				// check if long text overlaps this cell
				i = this._findSourceOfCellText(col, row);
				if (i >= 0) {
					dependentCells[i] = (dependentCells[i] || []);
					dependentCells[i].push(col);
				}
			}
			// draw long text that overlaps own cell's borders
			for (i in dependentCells) {
				var arr = dependentCells[i], j = arr.length - 1;
				col = i >> 0;
				// if source cell belongs to cells range then skip it (text has been drawn already)
				if (col >= arr[0] && col <= arr[j]) {continue;}
				// draw long text fragment
				this._drawCellText(drawingCtx, col, row, arr[0], arr[j], offsetX, offsetY, false);
			}
			return mergedCells;
		};

        /** Рисует текст ячейки */
		WorksheetView.prototype._drawCellText = function (drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, drawMergedCells) {
            var ct = this._getCellTextCache(col, row);
            if (ct === undefined)
                return null;

            var isMerged = ct.flags.isMerged(), range = undefined, isWrapped = ct.flags.wrapText;
            var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;

            if (isMerged) {
                range = ct.flags.merged;
                if (!drawMergedCells) {return {c1: range.c1, r1: range.r1, c2: range.c2, r2: range.r2, index: range.r1 + "_" + range.c1};}
                if (col !== range.c1 || row !== range.r1) {return null;}
            }

            var colL = isMerged ? range.c1 : Math.max(colStart, col - ct.sideL);
            var colR = isMerged ? Math.min(range.c2, this.nColsCount - 1) : Math.min(colEnd, col + ct.sideR);
            var rowT = isMerged ? range.r1 : row;
            var rowB = isMerged ? Math.min(range.r2, this.nRowsCount - 1) : row;
            var isTrimmedR = !isMerged && colR !== col + ct.sideR;

            if (!(ct.angle || 0)) {
                if (!isMerged && !isWrapped) {
                    this._eraseCellRightBorder(drawingCtx, colL, colR + (isTrimmedR ? 1 : 0), row, offsetX, offsetY);
                }
            }

            var x1 = this.cols[colL].left - offsetX;
            var y1 = this.rows[rowT].top - offsetY;
            var w  = this.cols[colR].left + this.cols[colR].width - offsetX - x1;
            var h  = this.rows[rowB].top + this.rows[rowB].height - offsetY - y1;
            var x2 = x1 + w - (isTrimmedR ? 0 : this.width_1px);
            var y2 = y1 + h - this.height_1px;
            var bl = !isMerged ? (y2 - this.rows[rowB].descender) : (y2 - ct.metrics.height + ct.metrics.baseline - this.height_1px);
            var x1ct  = isMerged ? x1 : this.cols[col].left - offsetX;
            var x2ct  = isMerged ? x2 : x1ct + this.cols[col].width - this.width_1px;
            var textX = this._calcTextHorizPos(x1ct, x2ct, ct.metrics, ct.cellHA);
            var textY = this._calcTextVertPos(y1, y2, bl, ct.metrics, ct.cellVA);
            var textW = this._calcTextWidth(x1ct, x2ct, ct.metrics, ct.cellHA);

            var xb1, yb1, wb, hb, colLeft, colRight, i;
            var txtRotX, txtRotW, clipUse = false;

            if (drawingCtx) {

                // для печати

                if (ct.angle || 0) {

                    xb1         =   this.cols[col].left - offsetX;
                    yb1         =   this.rows[row].top - offsetY;
                    wb          =   this.cols[col].width;
                    hb          =   this.rows[row].height;

                    txtRotX     =   ct.textBound.sx + xb1;
                    txtRotW     =   ct.textBound.sw + xb1;

                    if (isMerged) {

                        wb = 0;

                        for (i = colL; i <= colR && i < this.nColsCount; ++i) {
                            wb += this.cols[i].width;
                        }

                        hb = 0;

                        for (i = rowT; i <= rowB && i < this.nRowsCount; ++i) {
                            hb += this.rows[i].height;
                        }

                        ctx.AddClipRect (xb1, yb1, wb, hb);
                        clipUse = true;
                    }

                    this.stringRender.angle             =   ct.angle;
                    this.stringRender.fontNeedUpdate    =   true;

                    if (90 === ct.angle || -90 === ct.angle) {
                        // клип по ячейке
                        if (!isMerged) {
                            ctx.AddClipRect (xb1, yb1, wb, hb);
                            clipUse = true;
                        }
                    } else {
                        // клип по строке
                        if (!isMerged) {
                            ctx.AddClipRect (0, yb1, this.drawingCtx.getWidth(), h);
                            clipUse = true;
                        }

                        if (!isMerged && !isWrapped) {
                            colLeft = col;
                            if (0 !== txtRotX) {
                                while (true) {
                                    if (0 == colLeft) break;
                                    if (txtRotX >= this.cols[colLeft].left) break;
                                    --colLeft;
                                }
                            }

                            colRight = Math.min(col, this.nColsCount - 1);
                            if (0 !== txtRotW) {
                                while (true) {
                                    ++colRight;
                                    if (colRight >= this.nColsCount) { --colRight; break; }
                                    if (txtRotW <= this.cols[colRight].left) { --colRight; break; }
                                }
                            }

                            colLeft     =   isMerged ? range.c1 : colLeft;
                            colRight    =   isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;

                            this._eraseCellRightBorder(drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row,  offsetX, offsetY);
                        }
                    }

                    this.stringRender.rotateAtPoint(drawingCtx, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy);
                    this.stringRender.restoreInternalState(ct.state).renderForPrint(drawingCtx, 0, 0, textW, ct.color);
                    this.stringRender.resetTransform(drawingCtx);

                    if (clipUse) ctx.RemoveClipRect();
                } else {
                    ctx.AddClipRect (x1, y1, w, h);
                    this.stringRender.restoreInternalState(ct.state).renderForPrint(drawingCtx, textX, textY, textW, ct.color);
                    ctx.RemoveClipRect();
                }
            } else {

                // для отрисовки

                if (ct.angle || 0) {

                    xb1         =   this.cols[col].left - offsetX;
                    yb1         =   this.rows[row].top - offsetY;
                    wb          =   this.cols[col].width;
                    hb          =   this.rows[row].height;

                    txtRotX     =   ct.textBound.sx + xb1;
                    txtRotW     =   ct.textBound.sw + xb1;

                    if (isMerged) {

                        wb = 0;

                        for (i = colL; i <= colR && i < this.nColsCount; ++i) {
                            wb += this.cols[i].width;
                        }

                        hb = 0;

                        for (i = rowT; i <= rowB && i < this.nRowsCount; ++i) {
                            hb += this.rows[i].height;
                        }

                        ctx.save().beginPath().rect(xb1, yb1, wb, hb).clip();
                        clipUse = true;
                    }

                    this.stringRender.angle             =   ct.angle;
                    this.stringRender.fontNeedUpdate    =   true;

                    if (90 === ct.angle || -90 === ct.angle) {
                       // клип по ячейке
                       if (!isMerged) {
                           ctx.save().beginPath().rect(xb1, yb1, wb, hb).clip();
                           clipUse = true;
                       }
                    } else {
                        // клип по строке
                        if (!isMerged) {
                            ctx.save().beginPath().rect(0, y1, this.drawingCtx.getWidth(), h).clip();
                            clipUse = true;
                        }

                        if (!isMerged && !isWrapped) {
                            colLeft = col;
                            if (0 !== txtRotX) {
                                while (true) {
                                    if (0 == colLeft) break;
                                    if (txtRotX >= this.cols[colLeft].left) break;
                                    --colLeft;
                                }
                            }

                            colRight = Math.min(col, this.nColsCount - 1);
                            if (0 !== txtRotW) {
                                while (true) {
                                    ++colRight;
                                    if (colRight >= this.nColsCount) { --colRight; break; }
                                    if (txtRotW <= this.cols[colRight].left) { --colRight; break; }
                                }
                            }

                            colLeft  = isMerged ? range.c1 : colLeft;
                            colRight = isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;

                            this._eraseCellRightBorder(drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row,  offsetX, offsetY);
                        }
                    }

                    this.stringRender.rotateAtPoint(null, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy);
                    this.stringRender.restoreInternalState(ct.state).render(0, 0, textW, ct.color);
                    this.stringRender.resetTransform(null);

                    if (clipUse) ctx.restore();

                } else {
                    ctx.save().beginPath().rect(x1, y1, w, h).clip();
                    this.stringRender.restoreInternalState(ct.state).render(textX, textY, textW, ct.color);
                    ctx.restore();
                }
            }

            return null;
        };

		/** Удаляет вертикальные границы ячейки, если текст выходит за границы и соседние ячейки пусты */
		WorksheetView.prototype._eraseCellRightBorder = function (drawingCtx, colBeg, colEnd, row, offsetX, offsetY) {
			if (colBeg >= colEnd) {return;}
			var nextCell = -1;
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			ctx.setFillStyle(this.settings.cells.defaultState.background);
			for (var col = colBeg; col < colEnd; ++col) {
				var c = -1 !== nextCell ? nextCell : this._getCell(col, row);
				var bg = null !== c ? c.getFill() : null;
				if (bg !== null) {continue;}

				nextCell = this._getCell(col + 1, row);
				bg = null !== nextCell ? nextCell.getFill() : null;
				if (bg !== null) {continue;}

				ctx.fillRect(
					this.cols[col].left + this.cols[col].width - offsetX - this.width_1px,
					this.rows[row].top - offsetY,
					this.width_1px,
					this.rows[row].height - this.height_1px);
			}
		};

		/** Рисует рамки для ячеек */
		WorksheetView.prototype._drawCellsBorders = function (drawingCtx, range, offsetX, offsetY, mergedCells) {
			//TODO: использовать стили линий при рисовании границ
			var t = this;
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			var c = this.cols;
			var r = this.rows;

			var objectMergedCells = {}; // Двумерный map вида строка-колонка {1: {1: range, 4: range}}
			var i, mergeCellInfo, startCol, endRow, endCol, col, row;
			for (i in mergedCells) {
				mergeCellInfo = mergedCells[i];
				startCol = Math.max(range.c1, mergeCellInfo.c1);
				endRow = Math.min(mergeCellInfo.r2, range.r2, this.nRowsCount);
				endCol = Math.min(mergeCellInfo.c2, range.c2, this.nColsCount);
				for (row = Math.max(range.r1, mergeCellInfo.r1); row <= endRow; ++row) {
					if (!objectMergedCells.hasOwnProperty(row))
						objectMergedCells[row] = {};
					for (col = startCol; col <= endCol; ++col)
						objectMergedCells[row][col] = mergeCellInfo;
				}
			}

			var bc = null, bw = -1, isNotFirst = false; // cached border color

			function drawBorder(type, border, x1, y1, x2, y2) {
				var isStroke = false,
					isNewColor = !g_oColorManager.isEqual(bc, border.c),
					isNewWidth = bw !== border.w;
				if (isNotFirst && (isNewColor || isNewWidth)) {
					ctx.stroke();
					isStroke = true;
				}

				if (isNewColor) {
					bc = border.c;
					ctx.setStrokeStyle(bc);
				}
				if (isNewWidth) {
					bw = border.w;
					ctx.setLineWidth(border.w);
				}

				if (isStroke || false === isNotFirst) {
					isNotFirst = true;
					ctx.beginPath();
				}

				switch (type) {
					case c_oAscBorderType.Hor:
						ctx.lineHor(x1, y1, x2);
						break;
					case c_oAscBorderType.Ver:
						ctx.lineVer(x1, y1, y2);
						break;
					case c_oAscBorderType.Diag:
						ctx.lineDiag(x1, y1, x2, y2);
						break;
				}
			}

			function drawVerticalBorder(borderLeftObject, borderRightObject, x, y1, y2) {
				var border, borderLeft = borderLeftObject ? borderLeftObject.borders : null,
					borderRight = borderRightObject ? borderRightObject.borders : null;

				if (borderLeft && borderLeft.r.w)
					border = borderLeft.r;
				else if (borderRight && borderRight.l.w)
					border = borderRight.l;
				if (!border || border.w < 1) {return;}

				// ToDo переделать рассчет
				var tbw = t._calcMaxBorderWidth(borderLeftObject && borderLeftObject.getTopBorder(),
						borderRightObject && borderRightObject.getTopBorder()); // top border width
				var bbw = t._calcMaxBorderWidth(borderLeftObject && borderLeftObject.getBottomBorder(),
						borderRightObject && borderRightObject.getBottomBorder()); // bottom border width
				var dy1 = tbw > border.w ? tbw - 1 : (tbw > 1 ? -1 : 0);
				var dy2 = bbw > border.w ? -2 : (bbw > 2 ? 1 : 0);

				drawBorder(c_oAscBorderType.Ver, border, x, y1 + (-1 + dy1) * t.height_1px, x, y2 + (1 + dy2) * t.height_1px);
			}

			function drawHorizontalBorder(borderTopObject, borderBottomObject, x1, y, x2) {
				var border, borderTop = borderTopObject ? borderTopObject.borders : null,
					borderBottom = borderBottomObject ? borderBottomObject.borders : null;

				if (borderTop && borderTop.b.w)
					border = borderTop.b;
				else if (borderBottom && borderBottom.t.w)
					border = borderBottom.t;

				if (border && border.w > 0) {
					// ToDo переделать рассчет
					var lbw = t._calcMaxBorderWidth(borderTopObject && borderTopObject.getLeftBorder(),
							borderBottomObject && borderBottomObject.getLeftBorder());
					var rbw = t._calcMaxBorderWidth(borderTopObject && borderTopObject.getRightBorder(),
							borderTopObject && borderTopObject.getRightBorder());
					var dx1 = border.w > lbw ? (lbw > 1 ? -1 : 0) : (lbw > 2 ? 2 : 1);
					var dx2 = border.w > rbw ? (rbw > 2 ? 1 : 0) : (rbw > 1 ? -2 : -1);
					drawBorder(c_oAscBorderType.Hor, border, x1 + (-1 + dx1) * t.width_1px, y, x2 + (1 + dx2) * t.width_1px, y);
				}
			}

			var arrPrevRow = [], arrCurrRow = [], arrNextRow = [];
			var objMCPrevRow = null, objMCRow = null, objMCNextRow = null;
			var bCur, bPrev, bNext, bTopCur, bTopPrev, bTopNext, bBotCur, bBotPrev, bBotNext;
			bCur = bPrev = bNext = bTopCur = bTopNext = bBotCur = bBotNext = null;
			row = range.r1 - 1;
			var prevCol = range.c1 - 1;
			// Определим первую колонку (т.к. могут быть скрытые колонки)
			while (0 <= prevCol && c[prevCol].width < t.width_1px)
				--prevCol;

			// Сначала пройдемся по верхней строке (над отрисовываемым диапазоном)
			while (0 <= row) {
				if (r[row].height >= t.height_1px) {
					objMCPrevRow = objectMergedCells[row];
					for (col = prevCol; col <= range.c2 && col < t.nColsCount; ++col) {
						if (0 > col || c[col].width < t.width_1px) {continue;}
						arrPrevRow[col] = new CellBorderObject(t._getVisibleCell(col, row).getBorder(),
							objMCPrevRow ? objMCPrevRow[col] : null, col, row);
					}
					break;
				}
				--row;
			}

			var mc = null, nextRow, isFirstRow = true;
			var isPrevColExist = (0 <= prevCol);
			for (row = range.r1; row <= range.r2 && row < t.nRowsCount; row = nextRow) {
				nextRow = row + 1;
				if (r[row].height < t.height_1px) {continue;}
				// Нужно отсеять пустые снизу
				for (; nextRow <= range.r2 && nextRow < t.nRowsCount; ++nextRow)
					if (r[nextRow].height >= t.height_1px) {break;}

				var isFirstRowTmp = isFirstRow, isLastRow = nextRow > range.r2 || nextRow >= t.nRowsCount;
				isFirstRow = false; // Это уже не первая строка (определяем не по совпадению с range.r1, а по видимости)

				objMCRow = isFirstRowTmp ? objectMergedCells[row] : objMCNextRow;
				objMCNextRow = objectMergedCells[nextRow];

				var rowCache = t._fetchRowCache(row);
				var y1 = r[row].top - offsetY;
				var y2 = y1 + r[row].height - t.height_1px;

				var nextCol, isFirstCol = true;
				for (col = range.c1; col <= range.c2 && col < t.nColsCount; col = nextCol) {
					nextCol = col + 1;
					if (c[col].width < t.width_1px) {continue;}
					// Нужно отсеять пустые справа
					for (; nextCol <= range.c2 && nextCol < t.nColsCount; ++nextCol)
						if (c[nextCol].width >= t.width_1px) {break;}

					var isFirstColTmp = isFirstCol, isLastCol = nextCol > range.c2 || nextCol >= t.nColsCount;
					isFirstCol = false; // Это уже не первая колонка (определяем не по совпадению с range.c1, а по видимости)

					mc = objMCRow ? objMCRow[col] : null;

					var x1 = c[col].left - offsetX;
					var x2 = x1 + c[col].width - this.width_1px;

					if (row === t.nRowsCount) {
						bBotPrev = bBotCur = bBotNext = null;
					} else {
						if (isFirstColTmp) {
							bBotPrev = arrNextRow[prevCol] = new CellBorderObject(isPrevColExist ?
								t._getVisibleCell(prevCol, nextRow).getBorder() : null,
								objMCNextRow ? objMCNextRow[prevCol] : null, prevCol, nextRow);
							bBotCur = arrNextRow[col] =
								new CellBorderObject(t._getVisibleCell(col, nextRow).getBorder(),
									objMCNextRow ? objMCNextRow[col] : null, col, nextRow);
						} else {
							bBotPrev = bBotCur;
							bBotCur = bBotNext;
						}
					}

					if (isFirstColTmp) {
						bPrev = arrCurrRow[prevCol] = new CellBorderObject(isPrevColExist ?
							t._getVisibleCell(prevCol, row).getBorder() : null,
							objMCRow ? objMCRow[prevCol] : null, prevCol, row);
						bCur = arrCurrRow[col] = new CellBorderObject(t._getVisibleCell(col, row).getBorder(), mc, col, row);
						bTopPrev = arrPrevRow[prevCol];
						bTopCur = arrPrevRow[col];
					} else {
						bPrev = bCur;
						bCur = bNext;
						bTopPrev = bTopCur;
						bTopCur = bTopNext;
					}

					if (col === t.nColsCount) {
						bNext = null;
						bTopNext = null;
					} else {
						bNext = arrCurrRow[nextCol] =
							new CellBorderObject(t._getVisibleCell(nextCol, row).getBorder(),
								objMCRow ? objMCRow[nextCol] : null, nextCol, row);
						bTopNext = arrPrevRow[nextCol];

						if (row === t.nRowsCount)
							bBotNext = null;
						else
							bBotNext = arrNextRow[nextCol] =
								new CellBorderObject(t._getVisibleCell(nextCol, nextRow).getBorder(),
									objMCNextRow ? objMCNextRow[nextCol] : null, nextCol, nextRow);
					}

					if (mc && row !== mc.r1 && row !== mc.r2 && col !== mc.c1 && col !== mc.c2)
						continue;

					// draw diagonal borders
					if ((bCur.borders.dd || bCur.borders.du) && (!mc || (row === mc.r1 && col === mc.c1))) {
						var x2Diagonal = x2;
						var y2Diagonal = y2;
						if (mc) {
							// Merge cells
							x2Diagonal = c[mc.c2].left + c[mc.c2].width - offsetX - t.width_1px;
							y2Diagonal = r[mc.r2].top + r[mc.r2].height - offsetY - t.height_1px;
						}
						// ToDo Clip diagonal borders
						/*ctx.save()
							 .beginPath()
							 .rect(x1 + this.width_1px * (lb.w < 1 ? -1 : (lb.w < 3 ? 0 : +1)),
								 y1 + this.width_1px * (tb.w < 1 ? -1 : (tb.w < 3 ? 0 : +1)),
								 c[col].width + this.width_1px * ( -1 + (lb.w < 1 ? +1 : (lb.w < 3 ? 0 : -1)) + (rb.w < 1 ? +1 : (rb.w < 2 ? 0 : -1)) ),
								 r[row].height + this.height_1px * ( -1 + (tb.w < 1 ? +1 : (tb.w < 3 ? 0 : -1)) + (bb.w < 1 ? +1 : (bb.w < 2 ? 0 : -1)) ))
							 .clip();
						 */
						if (bCur.borders.dd) {
							// draw diagonal line l,t - r,b
							drawBorder(c_oAscBorderType.Diag, bCur.borders.d, x1 - t.width_1px, y1 - t.height_1px, x2Diagonal, y2Diagonal);
						}
						if (bCur.borders.du) {
							// draw diagonal line l,b - r,t
							drawBorder(c_oAscBorderType.Diag, bCur.borders.d, x1 - t.width_1px, y2Diagonal, x2Diagonal, y1 - t.height_1px);
						}
						// ToDo Clip diagonal borders
						//ctx.restore();
						// canvas context has just been restored, so destroy border color cache
						//bc = undefined;
					}

					// draw left border
					if (isFirstColTmp && !t._isLeftBorderErased(col, rowCache)) {
						drawVerticalBorder(bPrev, bCur, x1 - t.width_1px, y1, y2);
						// Если мы в печати и печатаем первый столбец, то нужно напечатать бордеры
//						if (lb.w >= 1 && drawingCtx && 0 === col) {
							// Иначе они будут не такой ширины
							// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawVerticalBorder(lb, tb, tbPrev, bb, bbPrev, x1, y1, y2);
//						}
					}
					// draw right border
					if ((!mc || col === mc.c2 || isLastCol) && !t._isRightBorderErased(col, rowCache)) {
						drawVerticalBorder(bCur, bNext, x2, y1, y2);
					}
					// draw top border
					if (isFirstRowTmp) {
						drawHorizontalBorder(bTopCur, bCur, x1, y1 - t.height_1px, x2);
						// Если мы в печати и печатаем первую строку, то нужно напечатать бордеры
//						if (tb.w > 0 && drawingCtx && 0 === row) {
							// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawHorizontalBorder.call(this, tb, lb, lbPrev, rb, rbPrev, x1, y1, x2);
//						}
					}
					if (!mc || row === mc.r2 || isLastRow) {
						// draw bottom border
						drawHorizontalBorder(bCur, bBotCur, x1, y2, x2);
					}
				}

				arrPrevRow = arrCurrRow;
				arrCurrRow = arrNextRow;
				arrNextRow = [];
			}

			if (isNotFirst)
				ctx.stroke();
		};

		/** Рисует закрепленные области областей */
		WorksheetView.prototype._drawFrozenPane = function (noCells) {
			if (this.topLeftFrozenCell) {
				var row = this.topLeftFrozenCell.getRow0();
				var col = this.topLeftFrozenCell.getCol0();

				var tmpRange, offsetX, offsetY;
				if (0 < row && 0 < col) {
					offsetX = this.cols[0].left - this.cellsLeft;
					offsetY = this.rows[0].top - this.cellsTop;
					tmpRange = new asc_Range(0, 0, col - 1, row - 1);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCellsAndBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
				if (0 < row) {
					row -= 1;
					offsetX = undefined;
					offsetY = this.rows[0].top - this.cellsTop;
					tmpRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, row);
					this._drawRowHeaders(/*drawingCtx*/ undefined, 0, row, kHeaderDefault, offsetX, offsetY);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCellsAndBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
				if (0 < col) {
					col -= 1;
					offsetX = this.cols[0].left - this.cellsLeft;
					offsetY = undefined;
					tmpRange = new asc_Range(0, this.visibleRange.r1, col, this.visibleRange.r2);
					this._drawColumnHeaders(/*drawingCtx*/ undefined, 0, col, kHeaderDefault, offsetX, offsetY);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCellsAndBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
			}
		};

		/** Рисует закрепление областей */
		WorksheetView.prototype._drawFrozenPaneLines = function (drawingCtx) {
			// Возможно стоит отрисовывать на overlay, а не на основной канве
			var ctx = drawingCtx ? drawingCtx : this.drawingCtx;
			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null,
				this.model.getId(), c_oAscLockNameFrozenPane);
			var isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, false);
			var color = isLocked ? c_oAscCoAuthoringOtherBorderColor : this.settings.frozenColor;
			ctx.setLineWidth(1).setStrokeStyle(color).beginPath();
			var fHorLine, fVerLine;
			if (isLocked) {
				fHorLine = ctx.dashLineCleverHor;
				fVerLine = ctx.dashLineCleverVer;
			} else {
				fHorLine = ctx.lineHorPrevPx;
				fVerLine = ctx.lineVerPrevPx;
			}

			if (this.topLeftFrozenCell) {
				var row = this.topLeftFrozenCell.getRow0();
				var col = this.topLeftFrozenCell.getCol0();
				if (0 < row)
					fHorLine.apply(ctx, [0, this.rows[row].top, ctx.getWidth()]);
				else
					fHorLine.apply(ctx, [0, this.headersHeight, this.headersWidth]);

				if (0 < col)
					fVerLine.apply(ctx, [this.cols[col].left, 0, ctx.getHeight()]);
				else
					fVerLine.apply(ctx, [this.headersWidth, 0, this.headersHeight]);
			} else if (this.model.sheetViews[0].asc_getShowRowColHeaders()) {
				fHorLine.apply(ctx, [0, this.headersHeight, this.headersWidth]);
				fVerLine.apply(ctx, [this.headersWidth, 0, this.headersHeight]);
			}

			ctx.stroke();
		};

		WorksheetView.prototype.drawFrozenGuides = function (x, y, target) {
			var data, offsetFrozen;
			var ctx = this.overlayCtx;

			ctx.clear();
			this._drawSelection();

			switch (target) {
				case c_oTargetType.FrozenAnchorV:
					x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
					data = this._findColUnderCursor(x, true, true);
					if (data) {
						data.col += 1;
						if (0 <= data.col && data.col < this.cols.length) {
							var h = ctx.getHeight();
							var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
							offsetFrozen = this.getFrozenPaneOffset(false, true);
							offsetX -= offsetFrozen.offsetX;
							ctx.setFillPattern(this.settings.ptrnLineDotted1)
								.fillRect(this.cols[data.col].left - offsetX - this.width_1px, 0, this.width_1px, h);
						}
					}
					break;
				case c_oTargetType.FrozenAnchorH:
					y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());
					data = this._findRowUnderCursor(y, true, true);
					if (data) {
						data.row += 1;
						if (0 <= data.row && data.row < this.rows.length) {
							var w = ctx.getWidth();
							var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
							offsetFrozen = this.getFrozenPaneOffset(true, false);
							offsetY -= offsetFrozen.offsetY;
							ctx.setFillPattern(this.settings.ptrnLineDotted1)
								.fillRect(0, this.rows[data.row].top - offsetY - this.height_1px, w, this.height_1px);
						}
					}
					break;
			}
		};
		
		WorksheetView.prototype._isFrozenAnchor = function(x, y) {
			
			var result = {result: false, cursor: "move", name: ""};
			if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
				return result;
				
			var _this = this;
			var frozenCell = this.topLeftFrozenCell ? this.topLeftFrozenCell : new CellAddress(0, 0, 0);
			
			x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
			y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());
			
			function isPointInAnchor(x, y, rectX, rectY, rectW, rectH) {
				var delta = 2 * asc_getcvt(0/*px*/, 1/*pt*/, _this._getPPIX());
				return (x >= rectX - delta) && (x <= rectX + rectW + delta) && (y >= rectY - delta) && (y <= rectY + rectH + delta);
			}
			
			// vertical
			var _x = this.getCellLeft(frozenCell.getCol0(), 1) - 0.5;
			var _y = _this.headersTop;
			var w = 0;
			var h = _this.headersHeight;
			if (isPointInAnchor(x, y, _x, _y, w, h)) {
				result.result = true;
				result.name = c_oTargetType.FrozenAnchorV;
			}
			
			// horizontal
			_x = _this.headersLeft;
			_y = this.getCellTop(frozenCell.getRow0(), 1) - 0.5;
			w = _this.headersWidth - 0.5;
			h = 0;
			if (isPointInAnchor(x, y, _x, _y, w, h)) {
				result.result = true;
				result.name = c_oTargetType.FrozenAnchorH;
			}
			
			return result;
		};
		
		WorksheetView.prototype.applyFrozenAnchor = function(x, y, target) {
			var t = this;
			var onChangeFrozenCallback = function (isSuccess) {
				if (false === isSuccess) {
					t.overlayCtx.clear();
					t._drawSelection();
					return;
				}
				var lastCol = 0, lastRow = 0, data;
				if (t.topLeftFrozenCell) {
					lastCol = t.topLeftFrozenCell.getCol0();
					lastRow = t.topLeftFrozenCell.getRow0();
				}
				switch (target) {
					case c_oTargetType.FrozenAnchorV:
						x *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIX());
						data = t._findColUnderCursor(x, true, true);
						if (data) {
							data.col += 1;
							if (0 <= data.col && data.col < t.cols.length)
								lastCol = data.col;
						}
						break;
					case c_oTargetType.FrozenAnchorH:
						y *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIY());
						data = t._findRowUnderCursor(y, true, true);
						if (data) {
							data.row += 1;
							if (0 <= data.row && data.row < t.rows.length)
								lastRow = data.row;
						}
						break;
				}
				t._updateFreezePane(lastCol, lastRow);
			};

			this._isLockedFrozenPane (onChangeFrozenCallback);
		};
		
		/** Для api закрепленных областей */

		WorksheetView.prototype.freezePane = function () {
			var t = this;
			var ar = this.activeRange.clone();
			var onChangeFreezePane = function (isSuccess) {
				if (false === isSuccess)
					return;
				var col, row, mc;
				if (null !== t.topLeftFrozenCell)
					col = row = 0;
				else {
					col = ar.startCol;
					row = ar.startRow;

					if (0 !== row || 0 !== col) {
						mc = t.model.getMergedByCell(row, col);
						if (mc) {
							col = mc.c1;
							row = mc.r1;
						}
					}

					if (0 === col && 0 === row) {
						col = ((t.visibleRange.c2 - t.visibleRange.c1) / 2) >> 0;
						row = ((t.visibleRange.r2 - t.visibleRange.r1) / 2) >> 0;
					}
				}
				t._updateFreezePane(col, row);
			};

			return this._isLockedFrozenPane(onChangeFreezePane);
		};

		WorksheetView.prototype._updateFreezePane = function(col, row, lockDraw) {
			var lastCol = 0, lastRow = 0;
			if (this.topLeftFrozenCell) {
				lastCol = this.topLeftFrozenCell.getCol0();
				lastRow = this.topLeftFrozenCell.getRow0();
			}
			History.Create_NewPoint();
			var oData = new UndoRedoData_FromTo(new UndoRedoData_BBox(new asc_Range(lastCol, lastRow, lastCol, lastRow)),
				new UndoRedoData_BBox(new asc_Range(col, row, col, row)), null);
			History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeFrozenCell, this.model.getId(), null, oData);

			var isUpdate = false;
			if (0 === col && 0 === row) { // Очистка
				if (null !== this.topLeftFrozenCell)
					isUpdate = true;
				this.topLeftFrozenCell = this.model.sheetViews[0].pane = null;
			} else { // Создание
				if (null === this.topLeftFrozenCell)
					isUpdate = true;
				var pane = this.model.sheetViews[0].pane = new asc.asc_CPane();
				this.topLeftFrozenCell = pane.topLeftFrozenCell = new CellAddress(row, col, 0);
			}
			this.visibleRange.c1 = col;
			this.visibleRange.r1 = row;
			if (col >= this.nColsCount)
				this.expandColsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
			if (row >= this.nRowsCount)
				this.expandRowsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры

			this.visibleRange.r2 = 0;
			this._calcVisibleRows();
			this.visibleRange.c2 = 0;
			this._calcVisibleColumns();
			this.handlers.trigger("reinitializeScroll");

            if(this.objectRender && this.objectRender.drawingArea)
            {
                this.objectRender.drawingArea.init();
            }
			if (!lockDraw)
				this.draw();

			// Эвент на обновление
			if (isUpdate && !this.model.workbook.bUndoChanges && !this.model.workbook.bRedoChanges)
				this.handlers.trigger("updateSheetViewSettings");
		};

		/** */
		
		WorksheetView.prototype._drawSelectionElement = function (visibleRange, offsetX, offsetY, args) {
			var range = args[0], isDashLine = args[1], lineWidth = args[2], strokeColor = args[3],
				fillColor = args[4], isAllRange = args[5];
			var ctx = this.overlayCtx, c = this.cols, r = this.rows;
			var oIntersection = range.intersectionSimple(visibleRange);
			if (!oIntersection)
				return;

			var fHorLine, fVerLine;
			if (isDashLine) {
				fHorLine = ctx.dashLineCleverHor;
				fVerLine = ctx.dashLineCleverVer;
			} else {
				fHorLine = ctx.lineHorPrevPx;
				fVerLine = ctx.lineVerPrevPx;
			}

			var firstCol = oIntersection.c1 === visibleRange.c1 && !isAllRange;
			var firstRow = oIntersection.r1 === visibleRange.r1 && !isAllRange;

			var drawLeftSide	= oIntersection.c1 === range.c1;
			var drawRightSide	= oIntersection.c2 === range.c2;
			var drawTopSide		= oIntersection.r1 === range.r1;
			var drawBottomSide	= oIntersection.r2 === range.r2;

			var x1 = c[oIntersection.c1].left - offsetX;
			var x2 = c[oIntersection.c2].left + c[oIntersection.c2].width - offsetX;
			var y1 = r[oIntersection.r1].top - offsetY;
			var y2 = r[oIntersection.r2].top + r[oIntersection.r2].height - offsetY;

			ctx.setLineWidth(lineWidth).setStrokeStyle(strokeColor);
			if (fillColor)
				ctx.setFillStyle(fillColor);
			ctx.beginPath();

			if (drawTopSide && !firstRow)
				fHorLine.apply(ctx, [x1, y1, x2]);
			if (drawBottomSide)
				fHorLine.apply(ctx, [x1, y2, x2]);
			if (drawLeftSide && !firstCol)
				fVerLine.apply(ctx, [x1, y1, y2]);
			if (drawRightSide)
				fVerLine.apply(ctx, [x2, y1, y2]);

			// Отрисовка квадратов для move/resize
			if (fillColor) {
				if (drawLeftSide && drawTopSide)
					ctx.fillRect(x1 - this.width_1px, y1 - this.height_1px, this.width_4px, this.height_4px);
				if (drawRightSide && drawTopSide)
					ctx.fillRect(x2 - this.width_4px, y1 - this.height_1px, this.width_4px, this.height_4px);
				if (drawRightSide && drawBottomSide)
					ctx.fillRect(x2 - this.width_4px, y2 - this.height_4px, this.width_4px, this.height_4px);
				if (drawLeftSide && drawBottomSide)
					ctx.fillRect(x1 - this.width_1px, y2 - this.height_4px, this.width_4px, this.height_4px);
			}

			ctx.closePath().stroke();
		};
		/**Отрисовывает диапазон с заданными параметрами*/
		WorksheetView.prototype._drawElements = function (thisArg, drawFunction) {
			var cFrozen = 0, rFrozen = 0, args = Array.prototype.slice.call(arguments, 2),
				c = this.cols, r = this.rows,
				offsetX = c[this.visibleRange.c1].left - this.cellsLeft,
				offsetY = r[this.visibleRange.r1].top - this.cellsTop;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				rFrozen = this.topLeftFrozenCell.getRow0();
				offsetX -= this.cols[cFrozen].left - this.cols[0].left;
				offsetY -= this.rows[rFrozen].top - this.rows[0].top;

				var oFrozenRange;
				cFrozen -= 1; rFrozen -= 1;
				if (0 <= cFrozen && 0 <= rFrozen) {
					oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
					drawFunction.call(thisArg, oFrozenRange, c[0].left - this.cellsLeft, r[0].top - this.cellsTop, args);
				}
				if (0 <= cFrozen) {
					oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
					drawFunction.call(thisArg, oFrozenRange, c[0].left - this.cellsLeft, offsetY, args);
				}
				if (0 <= rFrozen) {
					oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
					drawFunction.call(thisArg, oFrozenRange, offsetX, r[0].top - this.cellsTop, args);
				}
			}

			// Можно вместо call попользовать apply, но тогда нужно каждый раз соединять массив аргументов и 3 объекта
			drawFunction.call(thisArg, this.visibleRange, offsetX, offsetY, args);
		};

		/**
		 * Рисует выделение вокруг ячеек
		 * @param {Asc.Range} [range]
		 */
		WorksheetView.prototype._drawSelection = function (range) {
			if (!this.isSelectionDialogMode) {
				this._drawCollaborativeElements(/*bIsDrawObjects*/true);
				this._drawSelectionRange(range);
			} else {
				this._drawSelectionRange(range);
			}
		};

		WorksheetView.prototype._drawSelectionRange = function (range, isFrozen) {
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
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;

				if (!isFrozen) {
					var oFrozenRange;
					cFrozen -= 1; rFrozen -= 1;
					if (0 <= cFrozen && 0 <= rFrozen) {
						oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
						this._drawSelectionRange(oFrozenRange, true);
					}
					if (0 <= cFrozen) {
						oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
						this._drawSelectionRange(oFrozenRange, true);
					}
					if (0 <= rFrozen) {
						oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
						this._drawSelectionRange(oFrozenRange, true);
					}
				}
			}

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

			if (!range && !aFHIntersection && !this.isFormulaEditMode && !this.activeMoveRange && !this.isChartAreaEditMode) {
				if (!isFrozen) {
					this._drawActiveHeaders();
					if (this.isSelectionDialogMode) {
						this._drawSelectRange(this.activeRange.clone(true));
					}
				}
				return;
			}

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
			ctx.save()
				.beginPath()
				.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
				.clip();

			// draw frame around cells range
			l = drawLeftSide ? -this.width_1px : 0;
			r = drawRightSide ? this.width_1px : 0;
			t = drawTopSide ? -this.height_1px : 0;
			b = drawBottomSide ? this.height_2px : 0;

			ctx.setStrokeStyle(opt.activeCellBorderColor)
				.setLineWidth(3)
				.beginPath();

			if (aFHIntersection) {
				// Считаем координаты автозаполнения
				xFH1 = this.cols[aFHIntersection.c1].left - offsetX - this.width_1px;
				xFH2 = this.cols[aFHIntersection.c2].left + this.cols[aFHIntersection.c2].width - offsetX - this.width_1px;
				yFH1 = this.rows[aFHIntersection.r1].top - offsetY;
				yFH2 = this.rows[aFHIntersection.r2].top + this.rows[aFHIntersection.r2].height - offsetY - this.height_1px;
				drawLeftFillHandle = aFHIntersection.c1 === aFH.c1;
				drawRightFillHandle = aFHIntersection.c2 === aFH.c2;
				drawTopFillHandle = aFHIntersection.r1 === aFH.r1;
				drawBottomFillHandle = aFHIntersection.r2 === aFH.r2;

				// Если мы не в нулевом состоянии, то рисуем обводку автозаполнения (толстой линией)
				if (aFHIntersection.c1 !== aFHIntersection.c2 || aFHIntersection.r1 !== aFHIntersection.r2 || 2 !== this.fillHandleArea) {
					if (drawTopFillHandle)    {ctx.lineHor(xFH1 + l, yFH1 - this.height_1px, xFH2 + this.width_1px + r);}
					if (drawBottomFillHandle) {ctx.lineHor(xFH1 + l, yFH2, xFH2 + this.width_1px + r);}
					if (drawLeftFillHandle)   {ctx.lineVer(xFH1, yFH1 + t, yFH2 + b);}
					if (drawRightFillHandle)  {ctx.lineVer(xFH2, yFH1 + t, yFH2 + b);}
				}

				// Для некоторых вариантов областей нужно дорисовывать обводку для выделенной области
				switch (this.fillHandleArea){
					case 1:
						switch(this.fillHandleDirection){
							case 0:
								// Горизонтальный
								if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
								break;
							case 1:
								// Вертикальный
								if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
								break;
						}
						break;
					case 2:
						// Для внутренней области нужны все обводки
						if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
						if (drawBottomSide) {ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);}
						if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
						if (drawRightSide)  {ctx.lineVer(x2, y1 + t, y2 + b);}
						break;
					case 3:
						switch(this.fillHandleDirection){
							case 0:
								// Горизонтальный
								if (range && aFH.c2 !== range.c2){
									if (drawRightSide)  {ctx.lineVer(x2, y1 + t, y2 + b);}
								}
								break;
							case 1:
								// Вертикальный
								if (range && aFH.r2 !== range.r2){
									if (drawBottomSide) {ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r);}
								}
								break;
						}
						break;
				}

				ctx.stroke();
			} else {
				// Автозаполнения нет, просто рисуем обводку
				if (drawTopSide)    {ctx.lineHor(x1 + l, y1 - this.height_1px, x2 + this.width_1px + r);}
				if (drawBottomSide) {
					if (isFrozen && !drawRightSide)
						fillHandleWidth = 0;
					ctx.lineHor(x1 + l, y2, x2 + this.width_1px + r - fillHandleWidth);
				}
				if (drawLeftSide)   {ctx.lineVer(x1, y1 + t, y2 + b);}
				if (drawRightSide)  {
					if (isFrozen && !drawBottomSide)
						fillHandleHeight = 0;
					ctx.lineVer(x2, y1 + t, y2 + b - fillHandleHeight);
				}
			}
			ctx.stroke();

			// draw cells overlay
			if (range) {
				var lRect = x1 + (drawLeftSide ? this.width_3px : this.width_1px),
					rRect = x2 - (drawRightSide ? this.width_2px : 0),
					tRect = y1 + (drawTopSide ? this.height_2px : 0),
					bRect = y2 - (drawBottomSide ? this.width_2px : 0);
				ctx.setFillStyle( opt.activeCellBackground )
						.fillRect(lRect, tRect, rRect - lRect, bRect - tRect);

				var lRect2 = x1 + (drawLeftSide ? this.width_2px : this.width_1px),
					rRect2 = x2 - (drawRightSide ? this.width_2px : 0),
					tRect2 = y1 + (drawTopSide ? this.height_1px : 0),
					bRect2 = y2 - (drawBottomSide ? this.width_2px : 0);
				ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath()
					.strokeRect(lRect2, tRect2, rRect2 - lRect2, bRect2 - tRect2);

				var firstCell = (!this.isSelectionDialogMode) ? this.activeRange : this.copyActiveRange;
				cr = this.model.getMergedByCell(firstCell.startRow, firstCell.startCol);
				// Получаем активную ячейку в выделении
				cr = range.intersection(null !== cr ? cr : new asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
				if (cr !== null) {
					ctx.save().beginPath().rect(lRect, tRect, rRect - lRect, bRect - tRect).clip();
					var _l = this.cols[cr.c1].left - offsetX - this.width_1px,
					_r = this.cols[cr.c2].left + this.cols[cr.c2].width - offsetX,
					_t = this.rows[cr.r1].top - offsetY - this.height_1px,
					_b = this.rows[cr.r2].top + this.rows[cr.r2].height - offsetY;
					ctx.clearRect(_l, _t, _r - _l, _b - _t).restore();
				}

				if (!(isFrozen && (!drawRightSide || !drawBottomSide))) {
					// Рисуем "квадрат" для автозаполнения (располагается "квадрат" в правом нижнем углу последней ячейки выделения)
					cr = range.intersection(new asc_Range(range.c2, range.r2, range.c2, range.r2));
					if (cr !== null) {
						this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
						this.fillHandleR = this.fillHandleL + fillHandleWidth;
						this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
						this.fillHandleB = this.fillHandleT + fillHandleHeight;

						ctx.setFillStyle(opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);

						ctx.setStrokeStyle(opt.activeCellBorderColor2).setLineWidth(1).beginPath();
						ctx.lineHorPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleR);
						ctx.lineVerPrevPx(this.fillHandleL, this.fillHandleT, this.fillHandleB);
						ctx.stroke();
					}
				}
			}

			// draw fill handle select
			if (this.activeFillHandle !== null) {
				if (2 === this.fillHandleArea && (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2)){
					// Для внутренней области мы должны "залить" еще и область автозаполнения
					var lFH = xFH1 + (drawLeftFillHandle ? this.width_3px : this.width_1px),
						rFH = xFH2 - (drawRightFillHandle ? this.width_2px : 0),
						tFH = yFH1 + (drawTopFillHandle ? this.height_2px : 0),
						bFH = yFH2 - (drawBottomFillHandle ? this.width_2px : 0);
					ctx.setFillStyle( opt.activeCellBackground )
						.fillRect(lFH, tFH, rFH - lFH, bFH - tFH);
				}

				ctx.setStrokeStyle(opt.fillHandleBorderColorSelect).setLineWidth(1).beginPath();

				if (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2 || 2 !== this.fillHandleArea) {
					// Рисуем обводку для области автозаполнения, если мы выделили что-то
					if (drawTopFillHandle)    {ctx.lineHor(xFH1 + l + this.width_1px, yFH1 - this.height_1px, xFH2 + r);}
					if (drawBottomFillHandle) {ctx.lineHor(xFH1 + l + this.width_1px, yFH2, xFH2 + r);}
					if (drawLeftFillHandle)   {ctx.lineVer(xFH1, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);}
					if (drawRightFillHandle)  {ctx.lineVer(xFH2, yFH1 + t + this.height_1px, yFH2 + b - this.height_1px);}
				}

				if (2 === this.fillHandleArea){
					// Если мы внутри, еще рисуем обводку для выделенной области
					if (drawTopSide)    {ctx.lineHor(x1 + l + this.width_1px, y1 - this.height_1px, x2 + r - this.width_1px);}
					if (drawBottomSide) {ctx.lineHor(x1 + l + this.width_1px, y2, x2 + r - this.width_1px);}
					if (drawLeftSide)   {ctx.lineVer(x1, y1 + t + this.height_1px, y2 + b - this.height_1px);}
					if (drawRightSide)  {ctx.lineVer(x2, y1 + t + this.height_1px, y2 + b - this.height_1px);}
				}

				ctx.stroke();
			}

			if (!isFrozen && this.isFormulaEditMode) {
				this._drawFormulaRanges(this.arrActiveFormulaRanges);
			}

			if (!isFrozen && this.isChartAreaEditMode) {
				this._drawFormulaRanges(this.arrActiveChartsRanges);
			}

			if (!isFrozen && this.isSelectionDialogMode) {
				this._drawSelectRange(this.activeRange.clone(true));
			}
			if (!isFrozen && this.stateFormatPainter)
				this._drawFormatPainterRange();

			if (null !== this.activeMoveRange) {
				ctx.setStrokeStyle(new CColor(0, 0, 0))
					.setLineWidth(1)
					.beginPath();
				var aActiveMoveRangeIntersection = this.activeMoveRange.intersection(tmpRange !== undefined ? tmpRange : this.visibleRange);
				if (aActiveMoveRangeIntersection) {
					var drawLeftSideMoveRange   = aActiveMoveRangeIntersection.c1 === this.activeMoveRange.c1;
					var drawRightSideMoveRange  = aActiveMoveRangeIntersection.c2 === this.activeMoveRange.c2;
					var drawTopSideMoveRange    = aActiveMoveRangeIntersection.r1 === this.activeMoveRange.r1;
					var drawBottomSideMoveRange = aActiveMoveRangeIntersection.r2 === this.activeMoveRange.r2;

					var xMoveRange1 = this.cols[aActiveMoveRangeIntersection.c1].left - offsetX - this.width_1px;
					var xMoveRange2 = this.cols[aActiveMoveRangeIntersection.c2].left + this.cols[aActiveMoveRangeIntersection.c2].width - offsetX - this.width_1px;
					var yMoveRange1 = this.rows[aActiveMoveRangeIntersection.r1].top - offsetY;
					var yMoveRange2 = this.rows[aActiveMoveRangeIntersection.r2].top + this.rows[aActiveMoveRangeIntersection.r2].height - offsetY - this.height_1px;

					if (drawTopSideMoveRange)    {ctx.lineHor(xMoveRange1, yMoveRange1 - this.height_1px, xMoveRange2 + this.width_1px);}
					if (drawBottomSideMoveRange) {ctx.lineHor(xMoveRange1, yMoveRange2, xMoveRange2 + this.width_1px);}
					if (drawLeftSideMoveRange)   {ctx.lineVer(xMoveRange1, yMoveRange1, yMoveRange2);}
					if (drawRightSideMoveRange)  {ctx.lineVer(xMoveRange2, yMoveRange1, yMoveRange2);}
				}
				ctx.stroke();
			}

			// restore canvas' original clipping range
			ctx.restore();

			if (!isFrozen) {
				this._drawActiveHeaders();
			}
		};

		WorksheetView.prototype._drawFormatPainterRange = function () {
			var lineWidth = 1, isDashLine = true, strokeColor = new CColor(0, 0, 0);
			this._drawElements(this, this._drawSelectionElement, this.copyActiveRange, isDashLine, lineWidth, strokeColor);
		};

		WorksheetView.prototype._drawFormulaRanges = function (arrRanges){
			var i, lineWidth = 1, isDashLine = false, length = c_oAscFormulaRangeBorderColor.length;
			var strokeColor, fillColor, colorIndex, uniqueColorIndex = 0, tmpColors = [];
			for (i = 0; i < arrRanges.length; ++i) {
				var oFormulaRange = arrRanges[i].clone(true);

				colorIndex = asc.getUniqueRangeColor(arrRanges, i, tmpColors);
				if (null == colorIndex)
					colorIndex = uniqueColorIndex++;
				tmpColors.push(colorIndex);

				strokeColor = fillColor = c_oAscFormulaRangeBorderColor[colorIndex % length];
				this._drawElements(this, this._drawSelectionElement, oFormulaRange, isDashLine, lineWidth,
					strokeColor, fillColor);
			}
		};

		WorksheetView.prototype._drawSelectRange = function (oSelectRange) {
			var lineWidth = 1, isDashLine = true, strokeColor = c_oAscCoAuthoringOtherBorderColor;
			this._drawElements(this, this._drawSelectionElement, oSelectRange, isDashLine, lineWidth, strokeColor);
		};

		WorksheetView.prototype._drawCollaborativeElements = function (bIsDrawObjects) {
			if (this.collaborativeEditing.getCollaborativeEditing()) {
				this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeMine, bIsDrawObjects);
				this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeOther, bIsDrawObjects);
				this._drawCollaborativeElementsAllLock();
			}
		};

		WorksheetView.prototype._drawCollaborativeElementsAllLock = function () {
			var currentSheetId = this.model.getId();
			var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
			if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
				var lineWidth = 1, isDashLine = true, isAllRange = true,
					strokeColor = (c_oAscMouseMoveLockedObjectType.TableProperties === nLockAllType) ?
						c_oAscCoAuthoringLockTablePropertiesBorderColor : c_oAscCoAuthoringOtherBorderColor,
					oAllRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
				this._drawElements(this, this._drawSelectionElement, oAllRange, isDashLine, lineWidth, strokeColor, null, isAllRange);
			}
		};

		WorksheetView.prototype._drawCollaborativeElementsMeOther = function (type, bIsDrawObjects) {
			var currentSheetId = this.model.getId(),
				i, lineWidth = 1, isDashLine = true, strokeColor, arrayCells, oCellTmp;
			if (c_oAscLockTypes.kLockTypeMine === type) {
				strokeColor = c_oAscCoAuthoringMeBorderColor;
				arrayCells = this.collaborativeEditing.getLockCellsMe(currentSheetId);

				arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
				arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));
			} else {
				strokeColor = c_oAscCoAuthoringOtherBorderColor;
				arrayCells = this.collaborativeEditing.getLockCellsOther(currentSheetId);
			}

			for (i = 0; i < arrayCells.length; ++i) {
				oCellTmp = new asc_Range(arrayCells[i].c1, arrayCells[i].r1, arrayCells[i].c2, arrayCells[i].r2);
				this._drawElements(this, this._drawSelectionElement, oCellTmp, isDashLine, lineWidth, strokeColor);
			}
		};

		WorksheetView.prototype._drawAutoF = function (updatedRange, offsetX, offsetY) {
			if (updatedRange) {
				this.autoFilters.drawAutoF(updatedRange, offsetX, offsetY);
			} else {
				this._drawElements(this, this._drawAutoF);
			}
		};

		WorksheetView.prototype.cleanSelection = function (range, isFrozen) {
			isFrozen = !!isFrozen;
			if (range === undefined)
				range = this.visibleRange;
			var ctx = this.overlayCtx;
			var arn = this.activeRange.clone(true);
			var arnIntersection = arn.intersectionSimple(range);
			var width = ctx.getWidth();
			var height = ctx.getHeight();
			var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
			var x1 = Number.MAX_VALUE;
			var x2 = -Number.MAX_VALUE;
			var y1 = Number.MAX_VALUE;
			var y2 = -Number.MAX_VALUE;
			var i;

			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;

				if (!isFrozen) {
					var oFrozenRange;
					cFrozen -= 1; rFrozen -= 1;
					if (0 <= cFrozen && 0 <= rFrozen) {
						oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
						this.cleanSelection(oFrozenRange, true);
					}
					if (0 <= cFrozen) {
						oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
						this.cleanSelection(oFrozenRange, true);
					}
					if (0 <= rFrozen) {
						oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
						this.cleanSelection(oFrozenRange, true);
					}
				}
			}
			if (isFrozen) {
				if (range.c1 !== this.visibleRange.c1)
					diffWidth = 0;
				if (range.r1 !== this.visibleRange.r1)
					diffHeight = 0;
				offsetX = this.cols[range.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[range.r1].top - this.cellsTop - diffHeight;
			} else {
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
			}

			if (arnIntersection) {
				x1 = this.cols[arnIntersection.c1].left - offsetX - this.width_2px;
				x2 = this.cols[arnIntersection.c2].left + this.cols[arnIntersection.c2].width - offsetX + this.width_1px + /* Это ширина "квадрата" для автофильтра от границы ячейки */this.width_2px;
				y1 = this.rows[arnIntersection.r1].top - offsetY - this.height_2px;
				y2 = this.rows[arnIntersection.r2].top + this.rows[arnIntersection.r2].height - offsetY + this.height_1px + /* Это высота "квадрата" для автофильтра от границы ячейки */this.height_2px;
			}

			if (!isFrozen) {
				this._activateOverlayCtx();
				this._cleanColumnHeaders(arn.c1, arn.c2);
				this._cleanRowHeades(arn.r1, arn.r2);
				this._deactivateOverlayCtx();
			}

			// Если есть активное автозаполнения, то нужно его тоже очистить
			if (this.activeFillHandle !== null) {
				var activeFillClone = this.activeFillHandle.clone(true);

				// Координаты для автозаполнения
				var xFH1 = this.cols[activeFillClone.c1].left - offsetX - this.width_2px;
				var xFH2 = this.cols[activeFillClone.c2].left + this.cols[activeFillClone.c2].width - offsetX + this.width_1px + this.width_2px;
				var yFH1 = this.rows[activeFillClone.r1].top - offsetY - this.height_2px;
				var yFH2 = this.rows[activeFillClone.r2].top + this.rows[activeFillClone.r2].height - offsetY + this.height_1px + this.height_2px;

				// Выбираем наибольший range для очистки
				x1 = Math.min(x1, xFH1);
				x2 = Math.max(x2, xFH2);
				y1 = Math.min(y1, yFH1);
				y2 = Math.max(y2, yFH2);
			}

			if (this.collaborativeEditing.getCollaborativeEditing ()) {
				var currentSheetId = this.model.getId();

				var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
				if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
					this.overlayCtx.clear();
				} else {
					var arrayElementsMe = this.collaborativeEditing.getLockCellsMe(currentSheetId);
					var arrayElementsOther = this.collaborativeEditing.getLockCellsOther(currentSheetId);
					var arrayElements = arrayElementsMe.concat (arrayElementsOther);
					arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
					arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));

					for (i = 0; i < arrayElements.length; ++i) {
						var arFormulaTmp = new asc_Range(arrayElements[i].c1, arrayElements[i].r1, arrayElements[i].c2, arrayElements[i].r2);

						var aFormulaIntersection = arFormulaTmp.intersection(range);

						if (aFormulaIntersection) {
							// Координаты для автозаполнения
							var xCE1 = this.cols[aFormulaIntersection.c1].left - offsetX - this.width_2px;
							var xCE2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX + this.width_1px + this.width_2px;
							var yCE1 = this.rows[aFormulaIntersection.r1].top - offsetY - this.height_2px;
							var yCE2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY + this.height_1px + this.height_2px;

							// Выбираем наибольший range для очистки
							x1 = Math.min(x1, xCE1);
							x2 = Math.max(x2, xCE2);
							y1 = Math.min(y1, yCE1);
							y2 = Math.max(y2, yCE2);
						}
					}
				}
			}

			if (0 < this.arrActiveFormulaRanges.length) {
				for (i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
					var activeFormula = this.arrActiveFormulaRanges[i].clone(true);

					activeFormula = activeFormula.intersection(range);
					if (null === activeFormula) {
						// это ссылка из формулы на еще не добавленный рэндж
						continue;
					}

					// Координаты для range формулы
					var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
					var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
					var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
					var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;

					// Выбираем наибольший range для очистки
					x1 = Math.min(x1, xF1);
					x2 = Math.max(x2, xF2);
					y1 = Math.min(y1, yF1);
					y2 = Math.max(y2, yF2);
				}

				// Вышли из редактора, очистим массив
				if (false === this.isFormulaEditMode && !isFrozen) {
					this.arrActiveFormulaRanges = [];
				}
			}

			if (0 < this.arrActiveChartsRanges.length) {
				for (i = 0; i <  this.arrActiveChartsRanges.length; ++i) {
					var activeFormula = this.arrActiveChartsRanges[i].clone(true);

					activeFormula = activeFormula.intersection(range);
					if (null === activeFormula) {
						// это ссылка из формулы на еще не добавленный рэндж
						continue;
					}

					// Координаты для range формулы
					var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
					var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
					var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
					var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;

					// Выбираем наибольший range для очистки
					x1 = Math.min(x1, xF1);
					x2 = Math.max(x2, xF2);
					y1 = Math.min(y1, yF1);
					y2 = Math.max(y2, yF2);
				}
			}

			if (null !== this.activeMoveRange) {
				var activeMoveRangeClone = this.activeMoveRange.clone(true);

				// Увеличиваем, если выходим за область видимости // Critical Bug 17413
				while ( !this.cols[activeMoveRangeClone.c2] ) {
					this.expandColsOnScroll(true);
					this.handlers.trigger("reinitializeScrollX");
				}
				while ( !this.rows[activeMoveRangeClone.r2] ) {
					this.expandRowsOnScroll(true);
					this.handlers.trigger("reinitializeScrollY");
				}

				// Координаты для перемещения диапазона
				var xMR1 = this.cols[activeMoveRangeClone.c1].left - offsetX - this.width_2px;
				var xMR2 = this.cols[activeMoveRangeClone.c2].left + this.cols[activeMoveRangeClone.c2].width - offsetX + this.width_1px + this.width_2px;
				var yMR1 = this.rows[activeMoveRangeClone.r1].top - offsetY - this.height_2px;
				var yMR2 = this.rows[activeMoveRangeClone.r2].top + this.rows[activeMoveRangeClone.r2].height - offsetY + this.height_1px + this.height_2px;

				// Выбираем наибольший range для очистки
				x1 = Math.min(x1, xMR1);
				x2 = Math.max(x2, xMR2);
				y1 = Math.min(y1, yMR1);
				y2 = Math.max(y2, yMR2);
			}

			if (null !== this.copyActiveRange) {
				// Координаты для перемещения диапазона
				var xCopyAr1 = this.cols[this.copyActiveRange.c1].left - offsetX - this.width_2px;
				var xCopyAr2 = this.cols[this.copyActiveRange.c2].left + this.cols[this.copyActiveRange.c2].width - offsetX + this.width_1px + this.width_2px;
				var yCopyAr1 = this.rows[this.copyActiveRange.r1].top - offsetY - this.height_2px;
				var yCopyAr2 = this.rows[this.copyActiveRange.r2].top + this.rows[this.copyActiveRange.r2].height - offsetY + this.height_1px + this.height_2px;

				// Выбираем наибольший range для очистки
				x1 = Math.min(x1, xCopyAr1);
				x2 = Math.max(x2, xCopyAr2);
				y1 = Math.min(y1, yCopyAr1);
				y2 = Math.max(y2, yCopyAr2);
			}

			if (!(Number.MAX_VALUE === x1 && -Number.MAX_VALUE === x2 &&
				Number.MAX_VALUE === y1 && -Number.MAX_VALUE === y2)) {
				ctx.save()
						.beginPath()
						.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
						.clip()
						.clearRect(x1, y1, x2 - x1, y2 - y1)
						.restore();
			}
			return this;
		};

		WorksheetView.prototype.updateSelection = function () {
			this.cleanSelection();
			this._drawSelection();
		};

		// mouseX - это разница стартовых координат от мыши при нажатии и границы
		WorksheetView.prototype.drawColumnGuides = function (col, x, y, mouseX) {
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			// Учитываем координаты точки, где мы начали изменение размера
			x += mouseX;

			var ctx = this.overlayCtx;
			var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
			var offsetFrozen = this.getFrozenPaneOffset(false, true);
			offsetX -= offsetFrozen.offsetX;

			var x1 = this.cols[col].left - offsetX - this.width_1px;
			var h = ctx.getHeight();
			var widthPt = (x - x1);
			if (0 > widthPt)
				widthPt = 0;

			ctx.clear();
			this._drawSelection();
			ctx.setFillPattern(this.settings.ptrnLineDotted1)
				.fillRect(x1, 0, this.width_1px, h)
				.fillRect(x, 0, this.width_1px, h);

			return new asc_CMM({type: c_oAscMouseMoveType.ResizeColumn, sizeCCOrPt: this._colWidthToCharCount(widthPt),
				sizePx: widthPt * 96 / 72, x: (x1 + this.cols[col].width) * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX()),
				y: this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY())});
		};

		// mouseY - это разница стартовых координат от мыши при нажатии и границы
		WorksheetView.prototype.drawRowGuides = function (row, x, y, mouseY) {
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
			// Учитываем координаты точки, где мы начали изменение размера
			y += mouseY;

			var ctx = this.overlayCtx;
			var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
			var offsetFrozen = this.getFrozenPaneOffset(true, false);
			offsetY -= offsetFrozen.offsetY;

			var y1 = this.rows[row].top - offsetY - this.height_1px;
			var w = ctx.getWidth();
			var heightPt = (y - y1);
			if (0 > heightPt)
				heightPt = 0;

			ctx.clear();
			this._drawSelection();
			ctx.setFillPattern(this.settings.ptrnLineDotted1)
				.fillRect(0, y1, w, this.height_1px)
				.fillRect(0, y, w, this.height_1px);

			return new asc_CMM({type: c_oAscMouseMoveType.ResizeRow, sizeCCOrPt: heightPt, sizePx: heightPt * 96 / 72,
				x: this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX()),
				y: (y1 + this.rows[row].height) * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY())});
		};

		// --- Cache ---

		WorksheetView.prototype._cleanCache = function (range) {
			var r, c, row;

			if (range === undefined) {range = this.activeRange.clone(true);}

			for (r = range.r1; r <= range.r2; ++r) {
				row = this.cache.rows[r];
				if (row !== undefined) {
					// Должны еще крайнюю удалить
					c = range.c1;
					if (row.erased[c - 1]) {delete row.erased[c - 1];}
					for (; c <= range.c2; ++c) {
						if (row.columns[c]) {delete row.columns[c];}
						if (row.columnsWithText[c]) {delete row.columnsWithText[c];}
						if (row.erased[c]) {delete row.erased[c];}
					}
				}
			}
		};


		// ----- Cell text cache -----

		/** Очищает кэш метрик текста ячеек */
		WorksheetView.prototype._cleanCellsTextMetricsCache = function () {
			var s = this.cache.sectors = [];
			var vr = this.visibleRange;
			var h = vr.r2 + 1 - vr.r1;
			var rl = this.rows.length;
			var rc = asc_floor(rl / h) + (rl % h > 0 ? 1 : 0);
			var range = new asc_Range(0, 0, this.cols.length - 1, h - 1);
			var j;
			for (j = rc; j > 0; --j, range.r1 += h, range.r2 += h) {
				if (j === 1 && rl % h > 0) {
					range.r2 = rl - 1;
				}
				s.push(range.clone());
			}
		};

		/**
		 * Обновляет общий кэш и кэширует метрики текста ячеек для указанного диапазона
		 * @param {Asc.Range} [range]  Диапазон кэширования текта
		 */
		WorksheetView.prototype._prepareCellTextMetricsCache = function (range) {
			var firstUpdateRow = null;
			if (!range) {
				range = this.visibleRange;
				if (this.topLeftFrozenCell) {
					var row = this.topLeftFrozenCell.getRow0();
					var col = this.topLeftFrozenCell.getCol0();
					if (0 < row && 0 < col)
						firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow,
							this._prepareCellTextMetricsCache2(new Asc.Range(0, 0, col - 1, row - 1)));
					if (0 < row)
						firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow,
							this._prepareCellTextMetricsCache2(new Asc.Range(this.visibleRange.c1, 0,
								this.visibleRange.c2, row - 1)));
					if (0 < col)
						firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow,
							this._prepareCellTextMetricsCache2(new Asc.Range(0, this.visibleRange.r1,
									col - 1, this.visibleRange.r2)));
				}
			}

			firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow, this._prepareCellTextMetricsCache2(range));
			if (null !== firstUpdateRow) {
				// Убрал это из _calcCellsTextMetrics, т.к. вызов был для каждого сектора(добавляло тормоза: баг 20388)
				// Код нужен для бага http://bugzserver/show_bug.cgi?id=13875
				this._updateRowPositions();
				this._calcVisibleRows();

				if (this.objectRender){
                    this.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: firstUpdateRow}, true);
                }
			}
		};

		/**
		 * Обновляет общий кэш и кэширует метрики текста ячеек для указанного диапазона (сама реализация, напрямую не вызывать, только из _prepareCellTextMetricsCache)
		 * @param {Asc.Range} [range]  Диапазон кэширования текта
		 */
		WorksheetView.prototype._prepareCellTextMetricsCache2 = function (range) {
			var firstUpdateRow = null;
			var s = this.cache.sectors;
			for (var i = 0; i < s.length; ) {
				if (s[i].isIntersect(range)) {
					this._calcCellsTextMetrics(s[i]);
					s.splice(i, 1);
					firstUpdateRow = null !== firstUpdateRow ? Math.min(range.r1, firstUpdateRow) : range.r1;
					continue;
				}
				++i;
			}
			return firstUpdateRow;
		};

		/**
		 * Кэширует метрики текста для диапазона ячеек
		 * @param {Asc.Range} range  description
		 */
		WorksheetView.prototype._calcCellsTextMetrics = function (range) {
			var colsLength = this.cols.length;
			if (range === undefined) {
				range = new Asc.Range(0, 0, colsLength - 1, this.rows.length - 1);
			}
			var rowModel, rowCells, cellColl;
			for (var row = range.r1; row <= range.r2; ++row) {
				if (this.height_1px > this.rows[row].height) {continue;}
				// Теперь получаем только не пустые ячейки для строки
				rowModel = this.model._getRowNoEmpty(row);
				if (null === rowModel)
					continue;
				rowCells = rowModel.getCells();
				for (cellColl in rowCells) {
					cellColl = cellColl - 0;
					if (colsLength <= cellColl || this.width_1px > this.cols[cellColl].width) {continue;}

					this._addCellTextToCache(cellColl, row);
				}
			}
			this.isChanged = false;
		};

		WorksheetView.prototype._fetchRowCache = function (row) {
			return (this.cache.rows[row] = ( this.cache.rows[row] || new CacheElement() ));
		};

		WorksheetView.prototype._fetchCellCache = function (col, row) {
			var r = this._fetchRowCache(row);
			return (r.columns[col] = ( r.columns[col] || {} ));
		};

		WorksheetView.prototype._fetchCellCacheText = function (col, row) {
			var r = this._fetchRowCache(row);
			return (r.columnsWithText[col] = ( r.columnsWithText[col] || {} ));
		};

		WorksheetView.prototype._getRowCache = function (row) {
			return this.cache.rows[row];
		};

		WorksheetView.prototype._getCellCache = function (col, row) {
			var r = this.cache.rows[row];
			return r ? r.columns[col] : undefined;
		};

		WorksheetView.prototype._getCellTextCache = function (col, row, dontLookupMergedCells) {
			var r = this.cache.rows[row], c = r ? r.columns[col] : undefined;
			if (c && c.text) {
				return c.text;
			} else if (!dontLookupMergedCells) {
				// ToDo проверить это условие, возможно оно избыточно
				var range = this.model.getMergedByCell(row, col);
				return null !== range ? this._getCellTextCache(range.c1, range.r1, true) : undefined;
			}
			return undefined;
		};

		WorksheetView.prototype._changeColWidth = function (col, width, pad) {
			var cc = Math.min(this._colWidthToCharCount(width + pad), c_oAscMaxColumnWidth);
			var modelw = this._charCountToModelColWidth(cc);
			var colw = this._calcColWidth(modelw);

			if (colw.width > this.cols[col].width) {
				this.cols[col].width = colw.width;
				this.cols[col].innerWidth = colw.innerWidth;
				this.cols[col].charCount = colw.charCount;

				History.Create_NewPoint();
				History.StartTransaction();
				// Выставляем, что это bestFit
				this.model.setColBestFit (true, modelw, col, col);
				History.EndTransaction();

				this._updateColumnPositions();
				this.isChanged = true;
			}
		};

    WorksheetView.prototype._addCellTextToCache = function(col, row, canChangeColWidth) {
      var self = this;

      function makeFnIsGoodNumFormat(flags, width) {
        return function(str) {
          return self.stringRender.measureString(str, flags, width).width <= width;
        };
      }

      var c = this._getCell(col, row);
      if (null === c) {
        return col;
      }

      var bUpdateScrollX = false;
      var bUpdateScrollY = false;
      // Проверка на увеличение колличества столбцов
      if (col >= this.cols.length) {
        bUpdateScrollX = this.expandColsOnScroll(/*isNotActive*/ false, /*updateColsCount*/ true);
      }
      // Проверка на увеличение колличества строк
      if (row >= this.rows.length) {
        bUpdateScrollY = this.expandRowsOnScroll(/*isNotActive*/ false, /*updateRowsCount*/ true);
      }
      if (bUpdateScrollX && bUpdateScrollY) {
        this.handlers.trigger("reinitializeScroll");
      } else if (bUpdateScrollX) {
        this.handlers.trigger("reinitializeScrollX");
      } else if (bUpdateScrollY) {
        this.handlers.trigger("reinitializeScrollY");
      }

      var str, tm, isMerged = false, strCopy;

      // Range для замерженной ячейки
      var fl = this._getCellFlags(c);
      var mc = fl.merged;
      var fMergedColumns = false;	// Замержены ли колонки (если да, то автоподбор ширины не должен работать)
      var fMergedRows = false;	// Замержены ли строки (если да, то автоподбор высоты не должен работать)
      if (null !== mc) {
        if (col !== mc.c1 || row !== mc.r1) {
          return mc.c2;
        } // skip other merged cell from range
        if (mc.c1 !== mc.c2) {
          fMergedColumns = true;
        }
        if (mc.r1 !== mc.r2) {
          fMergedRows = true;
        }
        isMerged = true;
      }

      var angle = c.getAngle();
      if (this._isCellEmptyTextString(c)) {
        if (!angle && c.isNotDefaultFont()) {
          // Пустая ячейка с измененной гарнитурой или размером, учитвается в высоте
          str = c.getValue2();
          if (0 < str.length) {
            // Без текста не будет толка
            strCopy = [str[0].clone()];
            strCopy[0].text = 'A';
            tm = this._roundTextMetrics(this.stringRender.measureString(strCopy, fl));
            this._updateRowHeight(tm, col, row, isMerged, fMergedRows);
          }
        }

        return mc ? mc.c2 : col;
      }

      var dDigitsCount = 0;
      var colWidth = 0;
      var cellType = c.getType();
      fl.isNumberFormat = (null === cellType || CellValueType.String !== cellType); // Автоподбор делается по любому типу (кроме строки)
      var numFormatStr = c.getNumFormatStr();
      var pad = this.width_padding * 2 + this.width_1px;
      var sstr, sfl, stm;

      if (!this.cols[col].isCustomWidth && fl.isNumberFormat && !fMergedColumns && (c_oAscCanChangeColWidth.numbers === canChangeColWidth || c_oAscCanChangeColWidth.all === canChangeColWidth)) {
        colWidth = this.cols[col].innerWidth;
        // Измеряем целую часть числа
        sstr = c.getValue2(gc_nMaxDigCountView, function() {
          return true;
        });
        if ("General" === numFormatStr && c_oAscCanChangeColWidth.all !== canChangeColWidth) {
          // asc.truncFracPart изменяет исходный массив, поэтому клонируем
          var fragmentsTmp = [];
          for (var k = 0; k < sstr.length; ++k)
            fragmentsTmp.push(sstr[k].clone());
          sstr = asc.truncFracPart(fragmentsTmp);
        }
        sfl = fl.clone();
        sfl.wrapText = false;
        stm = this._roundTextMetrics(this.stringRender.measureString(sstr, sfl, colWidth));
        // Если целая часть числа не убирается в ячейку, то расширяем столбец
        if (stm.width > colWidth) {
          this._changeColWidth(col, stm.width, pad);
        }
        // Обновленная ячейка
        dDigitsCount = this.cols[col].charCount;
        colWidth = this.cols[col].innerWidth;
      } else if (null === mc) {
        // Обычная ячейка
        dDigitsCount = this.cols[col].charCount;
        colWidth = this.cols[col].innerWidth;
        // подбираем ширину
        if (!this.cols[col].isCustomWidth && !fMergedColumns && !fl.wrapText && c_oAscCanChangeColWidth.all === canChangeColWidth) {
          sstr = c.getValue2(gc_nMaxDigCountView, function() {
            return true;
          });
          stm = this._roundTextMetrics(this.stringRender.measureString(sstr, fl, colWidth));
          if (stm.width > colWidth) {
            this._changeColWidth(col, stm.width, pad);
            // Обновленная ячейка
            dDigitsCount = this.cols[col].charCount;
            colWidth = this.cols[col].innerWidth;
          }
        }
      } else {
        // Замерженная ячейка, нужна сумма столбцов
        for (var i = mc.c1; i <= mc.c2 && i < this.cols.length; ++i) {
          colWidth += this.cols[i].width;
          dDigitsCount += this.cols[i].charCount;
        }
        colWidth -= pad;
      }

      // ToDo dDigitsCount нужно рассчитывать исходя не из дефалтового шрифта и размера, а исходя из текущего шрифта и размера ячейки
      str = c.getValue2(dDigitsCount, makeFnIsGoodNumFormat(fl, colWidth));
      var ha = c.getAlignHorizontalByValue().toLowerCase();
      var va = c.getAlignVertical().toLowerCase();
      var maxW = fl.wrapText || fl.shrinkToFit || isMerged || asc.isFixedWidthCell(str) ? this._calcMaxWidth(col, row, mc) : undefined;
      tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
      var cto = (isMerged || fl.wrapText) ? {
        maxWidth: maxW - this.cols[col].innerWidth + this.cols[col].width,
        leftSide: 0,
        rightSide: 0
      } : this._calcCellTextOffset(col, row, ha, tm.width);

      // check right side of cell text and append columns if it exceeds existing cells borders
      if (!isMerged) {
        var rside = this.cols[col - cto.leftSide].left + tm.width;
        var lc = this.cols[this.cols.length - 1];
        if (rside > lc.left + lc.width) {
          this._appendColumns(rside);
          cto = this._calcCellTextOffset(col, row, ha, tm.width);
        }
      }
      var oFontColor = c.getFontcolor();
      var rowHeight = this.rows[row].height;
      var textBound = {};

      if (angle) {
        //  повернутый текст учитывает мерж ячеек по строкам
        if (fMergedRows) {
          rowHeight = 0;

          for (var j = mc.r1; j <= mc.r2 && j < this.nRowsCount; ++j) {
            rowHeight += this.rows[j].height;
          }
        }

        textBound = this.stringRender.getTransformBound(angle, 0, 0, colWidth, rowHeight, tm.width, ha, va, maxW);

//  NOTE: надо сделать как в экселе если проекция строчки на Y больше высоты ячейки подставлять # и рисовать все по центру

//                    if (fl.isNumberFormat) {
//                        var prj = Math.abs(Math.sin(angle * Math.PI / 180.0) * tm.width);
//                        if (prj > rowHeight) {
//                            //if (maxW === undefined) {}
//                            maxW = rowHeight / Math.abs(Math.cos(angle * Math.PI / 180.0));
//                            str  =  c.getValue2(gc_nMaxDigCountView, makeFnIsGoodNumFormat(fl, maxW));
//
//                            for (i = 0; i < str.length; ++i) {
//                                var f = str[i].format;
//                                if (f) f.repeat = true;
//                            }
//
//                            tm   =  this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
//                        }
//                    }
      }

      this._fetchCellCache(col, row).text = {
        state: this.stringRender.getInternalState(),
        flags: fl,
        color: (oFontColor || this.settings.cells.defaultState.color),
        metrics: tm,
        cellW: cto.maxWidth,
        cellHA: ha,
        cellVA: va,
        sideL: cto.leftSide,
        sideR: cto.rightSide,
        cellType: cellType,
        isFormula: c.isFormula(),
        angle: angle,
        textBound: textBound
      };

      this._fetchCellCacheText(col, row).hasText = true;

      if (!angle && (cto.leftSide !== 0 || cto.rightSide !== 0)) {
        this._addErasedBordersToCache(col - cto.leftSide, col + cto.rightSide, row);
      }

      this._updateRowHeight(tm, col, row, isMerged, fMergedRows, va, ha, angle, maxW, colWidth, textBound);

      return mc ? mc.c2 : col;
    };

		WorksheetView.prototype._updateRowHeight = function (tm, col, row, isMerged, fMergedRows, va, ha, angle,
															 maxW, colWidth, textBound) {
			var rowInfo = this.rows[row], rowHeight;
			// update row's descender
			if (va !== kvaTop && va !== kvaCenter && !isMerged) {
				rowInfo.descender = Math.max(rowInfo.descender, tm.height - tm.baseline);
			}

			rowHeight = rowInfo.height;

			// update row's height
			if (!rowInfo.isCustomHeight && !(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight)) {
				// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
				if (!fMergedRows) {
					var newHeight = tm.height;
					if (angle) {
						if (textBound) {
							newHeight = textBound.height;
						}
					}

					rowInfo.heightReal = rowInfo.height = Math.min(this.maxRowHeight,
						Math.max(rowInfo.height, newHeight));
					if (rowHeight !== rowInfo.height) {
						if (!rowInfo.isDefaultHeight)
							this.model.setRowHeight(rowInfo.height + this.height_1px, row, row);

						if (angle) {
							this._fetchCellCache(col, row).text.textBound   =
								this.stringRender.getTransformBound(angle, 0, 0, colWidth, rowInfo.height, tm.width,
									ha, va, maxW);
						}

						this.isChanged = true;
					}
				}
			}
		};

		WorksheetView.prototype._calcMaxWidth = function (col, row, mc) {
			if (null === mc) {return this.cols[col].innerWidth;}

			var width = this.cols[mc.c1].innerWidth;
			for (var c = mc.c1 + 1; c <= mc.c2 && c < this.cols.length; ++c) {
				width += this.cols[c].width;
			}
			return width;
		};

		WorksheetView.prototype._calcCellTextOffset = function (col, row, textAlign, textWidth) {
			var sideL = [0], sideR = [0], i;
			var maxWidth = this.cols[col].width;
			var ls = 0, rs = 0;
			var pad = this.settings.cells.padding * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			var textW = textAlign === khaCenter ? (textWidth + maxWidth) * 0.5 : textWidth + pad;

			if (textAlign === khaRight || textAlign === khaCenter) {
				sideL = this._calcCellsWidth(col, 0, row);
				// condition (sideL.lenght >= 1) is always true
				for (i = 0; i < sideL.length && textW > sideL[i]; ++i) {/* do nothing */}
				ls = i !== sideL.length ? i : i - 1;
			}

			if (textAlign !== khaRight) {
				sideR = this._calcCellsWidth(col, this.cols.length - 1, row);
				// condition (sideR.lenght >= 1) is always true
				for (i = 0; i < sideR.length && textW > sideR[i]; ++i) {/* do nothing */}
				rs = i !== sideR.length ? i : i - 1;
			}

			if (textAlign === khaCenter) {
				maxWidth = (sideL[ls] - sideL[0]) + sideR[rs];
			} else {
				maxWidth = textAlign === khaRight ? sideL[ls] : sideR[rs];
			}

			return {
				maxWidth:  maxWidth,
				leftSide:  ls,
				rightSide: rs
			};
		};

		WorksheetView.prototype._calcCellsWidth = function (colBeg, colEnd, row) {
			var inc = colBeg <= colEnd ? 1 : -1, res = [];
			for (var i = colBeg; (colEnd - i) * inc >= 0; i += inc) {
				if ( i !== colBeg && !this._isCellEmptyOrMerged(i, row) ) {break;}
				res.push(this.cols[i].width);
				if (res.length > 1) {res[res.length - 1] += res[res.length - 2];}
			}
			return res;
		};

		// Ищет текст в строке (columnsWithText - это колонки, в которых есть текст)
		WorksheetView.prototype._findSourceOfCellText = function (col, row) {
			var r = this._getRowCache(row);
			if (r) {
				for (var i in r.columnsWithText) {
					if (!r.columns[i] || 0 === this.cols[i].width) {continue;}
					var ct = r.columns[i].text;
					if (!ct) {continue;}
					i >>= 0;
					var lc = i - ct.sideL,
						rc = i + ct.sideR;
					if (col >= lc && col <= rc) {return i;}
				}
			}
			return -1;
		};


		// ----- Merged cells cache -----

		WorksheetView.prototype._isMergedCells = function (range) {
			return range.isEqual(this.model.getMergedByCell(range.r1, range.c1));
		};

		// ----- Cell borders cache -----

		WorksheetView.prototype._addErasedBordersToCache = function (colBeg, colEnd, row) {
			var rc = this._fetchRowCache(row);
			for (var col = colBeg; col < colEnd; ++col) {
				rc.erased[col] = true;
			}
		};

		WorksheetView.prototype._isLeftBorderErased = function (col, rowCache) {
			return rowCache.erased[col - 1] === true;
		};
		WorksheetView.prototype._isRightBorderErased = function (col, rowCache) {
			return rowCache.erased[col] === true;
		};

		WorksheetView.prototype._calcMaxBorderWidth = function (b1, b2) {
			// ToDo пересмотреть
			return Math.max(b1 && b1.w, b2 && b2.w);
		};


		// ----- Cells utilities -----

		/**
		 * Возвращает заголовок колонки по индексу
		 * @param {Number} col  Индекс колонки
		 * @return {String}
		 */
		WorksheetView.prototype._getColumnTitle = function (col) {
			return g_oCellAddressUtils.colnumToColstrFromWsView(col + 1);
		};

		/**
		 * Возвращает заголовок строки по индексу
		 * @param {Number} row  Индекс строки
		 * @return {String}
		 */
		WorksheetView.prototype._getRowTitle = function (row) {
			return "" + (row + 1);
		};

		/**
		 * Возвращает заголовок ячейки по индексу
		 * @param {Number} col  Индекс колонки
		 * @param {Number} row  Индекс строки
		 * @return {String}
		 */
		WorksheetView.prototype._getCellTitle = function (col, row) {
			return this._getColumnTitle(col) + this._getRowTitle(row);
		};

		/**
		 * Возвращает ячейку таблицы (из Worksheet)
		 * @param {Number} col  Индекс колонки
		 * @param {Number} row  Индекс строки
		 * @return {Range}
		 */
		WorksheetView.prototype._getCell = function (col, row) {
			if (this.nRowsCount < this.model.getRowsCount() + 1)
				this.expandRowsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
			if (this.nColsCount < this.model.getColsCount() + 1)
				this.expandColsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры

			if (col < 0 || col >= this.nColsCount || row < 0 || row >= this.nRowsCount)
				return null;

			return this.model.getCell3(row, col);
		};

		WorksheetView.prototype._getVisibleCell = function (col, row) {
			return this.model.getCell3(row, col);
		};

		WorksheetView.prototype._getCellFlags = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			var fl = new CellFlags();
			if (null !== c) {
				fl.wrapText = c.getWrap();
				fl.shrinkToFit = c.getShrinkToFit();
				fl.merged = c.hasMerged();
				fl.textAlign = c.getAlignHorizontalByValue().toLowerCase();
			}
			return fl;
		};

		WorksheetView.prototype._isCellEmptyText = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			return null === c || c.isEmptyText();
		};
		WorksheetView.prototype._isCellEmptyTextString = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			return null === c || c.isEmptyTextString();
		};

		WorksheetView.prototype._isCellEmptyOrMerged = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			if (null === c)
				return true;
			if (!c.isEmptyText())
				return false;
			return (null === c.hasMerged());
		};

		WorksheetView.prototype._isCellEmptyOrMergedOrBackgroundColorOrBorders = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			if (null === c)
				return true;
			if (!c.isEmptyTextString())
				return false;
			if (null !== c.hasMerged())
				return false;
			var bg = c.getFill();
			if (null !== bg)
				return false;
			var cb = c.getBorder();
			return !((cb.l && c_oAscBorderStyles.None !== cb.l.s) || (cb.r && c_oAscBorderStyles.None !== cb.r.s) ||
				(cb.t && c_oAscBorderStyles.None !== cb.t.s) || (cb.b && c_oAscBorderStyles.None !== cb.b.s) ||
				(cb.dd && c_oAscBorderStyles.None !== cb.dd.s)  || (cb.du && c_oAscBorderStyles.None !== cb.du.s));
		};

		WorksheetView.prototype._getRange = function (c1, r1, c2, r2) {
			return this.model.getRange3(r1, c1, r2, c2);
		};

		WorksheetView.prototype._selectColumnsByRange = function () {
			var ar = this.activeRange;
			if (c_oAscSelectionType.RangeMax === ar.type)
				return;
			else {
				this.cleanSelection();
				if (c_oAscSelectionType.RangeRow === ar.type) {
					ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
					ar.type = c_oAscSelectionType.RangeMax;
				}
				else {
					ar.type = c_oAscSelectionType.RangeCol;
					ar.assign(ar.c1, 0, ar.c2, this.rows.length - 1);
				}
				this._drawSelection();
			}
		};

		WorksheetView.prototype._selectRowsByRange = function () {
			var ar = this.activeRange;
			if (c_oAscSelectionType.RangeMax === ar.type)
				return;
			else {
				this.cleanSelection();

				if (c_oAscSelectionType.RangeCol === ar.type) {
					ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
					ar.type = c_oAscSelectionType.RangeMax;
				}
				else {
					ar.type = c_oAscSelectionType.RangeRow;
					ar.assign(0, ar.r1, this.cols.length - 1, ar.r2);
				}

				this._drawSelection();
			}
		};

		/**
		 * Возвращает true, если диапазон больше видимой области, и операции над ним могут привести к задержкам
		 * @param {Asc.Range} range  Диапазон для проверки
		 * @returns {Boolean}
		 */
		WorksheetView.prototype._isLargeRange = function (range) {
			var vr = this.visibleRange;
			return range.c2 - range.c1 + 1 > (vr.c2 - vr.c1 + 1) * 3 ||
				range.r2 - range.r1 + 1 > (vr.r2 - vr.r1 + 1) * 3;
		};

		/**
		 * Возвращает true, если диапазон состоит из одной ячейки
		 * @param {Asc.Range} range  Диапазон
		 * @returns {Boolean}
		 */
		WorksheetView.prototype._rangeIsSingleCell = function (range) {
			return range.c1 === range.c2 && range.r1 === range.r2;
		};

		WorksheetView.prototype.drawDepCells  = function (){
			var ctx = this.overlayCtx,
				_cc = this.cellCommentator,
				c,node, that = this;

			ctx.clear();
			this._drawSelection();

			var color = new CColor(0, 0, 255);

			function draw_arrow(context, fromx, fromy, tox, toy) {
				var headlen = 9,
					showArrow = tox > that.getCellLeft(0, 0) && toy > that.getCellTop(0, 0),
					dx = tox - fromx,
					dy = toy - fromy,
					tox = tox > that.getCellLeft(0, 0)? tox: that.getCellLeft(0, 0),
					toy = toy > that.getCellTop(0, 0)? toy: that.getCellTop(0, 0),
					angle = Math.atan2(dy, dx),
					_a = Math.PI / 18;

				// ToDo посмотреть на четкость moveTo, lineTo
				context.save()
					.setLineWidth(1)
					.beginPath()
					.lineDiag
					.moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy))
					.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy));
					// .dashLine(_cc.pxToPt(fromx-.5), _cc.pxToPt(fromy-.5), _cc.pxToPt(tox-.5), _cc.pxToPt(toy-.5), 15, 5)
				if( showArrow )
					context
						.moveTo(
							_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
							_cc.pxToPt(toy - headlen * Math.sin(angle - _a)))
						.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy))
						.lineTo(
							_cc.pxToPt(tox - headlen * Math.cos(angle + _a)),
							_cc.pxToPt(toy - headlen * Math.sin(angle + _a)))
						.lineTo(
							_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
							_cc.pxToPt(toy - headlen * Math.sin(angle - _a)));

				context
					.setStrokeStyle(color)
					.setFillStyle(color)
					.stroke()
					.fill()
					.closePath()
					.restore();
			}
			function gCM(_this,col,row){
				var metrics = { top: 0, left: 0, width: 0, height: 0, result: false }; 	// px

				var fvr = _this.getFirstVisibleRow();
				var fvc = _this.getFirstVisibleCol();
				var mergedRange = _this.model.getMergedByCell(row, col);

				if (mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2)) {

					var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
					var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;

					metrics.top = _this.getCellTop(startRow, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
					metrics.left = _this.getCellLeft(startCol, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);

					for (var i = startCol; i <= mergedRange.c2; i++) {
						metrics.width += _this.getColumnWidth(i, 0)
					}
					for (var i = startRow; i <= mergedRange.r2; i++) {
						metrics.height += _this.getRowHeight(i, 0)
					}
					metrics.result = true;
				}
				else{

					metrics.top = _this.getCellTop(row, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
					metrics.left = _this.getCellLeft(col, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
					metrics.width = _this.getColumnWidth(col, 0);
					metrics.height = _this.getRowHeight(row, 0);
					metrics.result = true;
				}
			
				return metrics
			}

			for(var id in this.depDrawCells ){
				c = this.depDrawCells[id].from;
				node = this.depDrawCells[id].to;
				var mainCellMetrics = gCM(this,c.nCol,c.nRow), nodeCellMetrics,
					_t1, _t2;
				for(var id in node){
					if( !node[id].isArea ){
						_t1 = gCM(this,node[id].returnCell().nCol,node[id].returnCell().nRow)
						nodeCellMetrics = { t: _t1.top, l: _t1.left, w: _t1.width, h: _t1.height, apt: _t1.top+_t1.height/2, apl: _t1.left+_t1.width/4};
					}
					else{
						var _t1 = gCM(_wsV,me[id].getBBox().c1,me[id].getBBox().r1),
						_t2 = gCM(_wsV,me[id].getBBox().c2,me[id].getBBox().r2);

						nodeCellMetrics = { t: _t1.top, l: _t1.left, w: _t2.left+_t2.width-_t1.left, h: _t2.top+_t2.height-_t1.top,
											apt: _t1.top+_t1.height/2, apl:_t1.left+_t1.width/4  };
					}

					var x1 = Math.floor(nodeCellMetrics.apl),
						y1 = Math.floor(nodeCellMetrics.apt),
						x2 = Math.floor(mainCellMetrics.left+mainCellMetrics.width/4),
						y2 = Math.floor(mainCellMetrics.top+mainCellMetrics.height/2);

					if( x1<0 && x2<0 || y1<0 && y2<0)
						continue;

					if(y1<this.getCellTop(0, 0))
						y1-=this.getCellTop(0, 0);

					if(y1<0 && y2>0){
						var _x1 = Math.floor(Math.sqrt((x1-x2)*(x1-x2)*y1*y1/((y2-y1)*(y2-y1))));
						// x1 -= (x1-x2>0?1:-1)*_x1;
						if( x1 > x2){
							x1 -= _x1;
						}
						else if( x1 < x2 ){
							x1 += _x1;
						}
					}
					else if(y1>0 && y2<0){
						var _x2 = Math.floor(Math.sqrt((x1-x2)*(x1-x2)*y2*y2/((y2-y1)*(y2-y1))));
						// x2 -= (x2-x1>0?1:-1)*_x2;
						if( x2 > x1){
							x2 -= _x2;
						}
						else if( x2 < x1){
							x2 += _x2;
						}
					}

					if(x1<0 && x2>0){
						var _y1 = Math.floor(Math.sqrt((y1-y2)*(y1-y2)*x1*x1/((x2-x1)*(x2-x1))))
						// y1 -= (y1-y2>0?1:-1)*_y1;
						if( y1 > y2){
							y1 -= _y1;
						}
						else if( y1 < y2 ){
							y1 += _y1;
						}
					}
					else if(x1>0 && x2<0){
						var _y2 = Math.floor(Math.sqrt((y1-y2)*(y1-y2)*x2*x2/((x2-x1)*(x2-x1))))
						// y2 -= (y2-y1>0?1:-1)*_y2;
						if( y2 > y1 ){
							y2 -= _y2;
						}
						else if( y2 < y1 ){
							y2 += _y2;
						}
					}

					draw_arrow(ctx, x1<this.getCellLeft(0, 0)?this.getCellLeft(0, 0):x1, y1<this.getCellTop(0, 0)?this.getCellTop(0, 0):y1, x2, y2);
					// draw_arrow(ctx, x1, y1, x2, y2);

					// ToDo посмотреть на четкость rect
					if( nodeCellMetrics.apl > this.getCellLeft(0, 0) && nodeCellMetrics.apt > this.getCellTop(0, 0) )
						ctx.save()
							.beginPath()
							.arc(_cc.pxToPt(Math.floor(nodeCellMetrics.apl)),
								_cc.pxToPt(Math.floor(nodeCellMetrics.apt)),
								3,0, 2 * Math.PI, false,-0.5,-0.5)
							.setFillStyle(color)
							.fill()
							.closePath()
							.setLineWidth(1)
							.setStrokeStyle(color)
							.rect( _cc.pxToPt(nodeCellMetrics.l),_cc.pxToPt(nodeCellMetrics.t),_cc.pxToPt(nodeCellMetrics.w-1),_cc.pxToPt(nodeCellMetrics.h-1) )
							.stroke()
							.restore();
				}
			}
		};

		WorksheetView.prototype.prepareDepCells = function (se){
			var activeCell = this.activeRange,
				mc = this.model.getMergedByCell(activeCell.startRow, activeCell.startCol),
				c1 = mc ? mc.c1 : activeCell.startCol,
				r1 = mc ? mc.r1 : activeCell.startRow,
				c = this._getVisibleCell(c1, r1),
				nodes = (se == c_oAscDrawDepOptions.Master) ? this.model.workbook.dependencyFormulas.getMasterNodes(this.model.getId(),c.getName()) : this.model.workbook.dependencyFormulas.getSlaveNodes(this.model.getId(),c.getName());

			if(!nodes)
				return;

			if( !this.depDrawCells )
				this.depDrawCells = {};

			if(se == c_oAscDrawDepOptions.Master){
				c = c.getCells()[0];
				var id = getVertexId(this.model.getId(),c.getName());
				this.depDrawCells[id] = {from:c,to:nodes};
			}
			else{
				var to = {}, to1,
					id = getVertexId(this.model.getId(),c.getName());
					to[getVertexId(this.model.getId(),c.getName())]= this.model.workbook.dependencyFormulas.getNode(this.model.getId(),c.getName());
					to1 = this.model.workbook.dependencyFormulas.getNode(this.model.getId(),c.getName());
				for(var id2 in nodes){
					if( this.depDrawCells[id2] )
						$.extend(this.depDrawCells[id2].to,to)
					else{
						this.depDrawCells[id2] = {}
						this.depDrawCells[id2].from = nodes[id2].returnCell()
						this.depDrawCells[id2].to = {}
						this.depDrawCells[id2].to[id] = to1;
					}
				}
			}
			this.drawDepCells();

		};

		WorksheetView.prototype.cleanDepCells = function (){
			this.depDrawCells = null;
			this.drawDepCells();
		};

		// ----- Text drawing -----

		WorksheetView.prototype._getPPIX = function () {
			return this.drawingCtx.getPPIX();
		};

		WorksheetView.prototype._getPPIY = function () {
			return this.drawingCtx.getPPIY();
		};

		WorksheetView.prototype._setFont = function (drawingCtx, name, size) {
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			ctx.setFont(new asc.FontProperties(name, size));
		};

		/**
		 * @param {Asc.TextMetrics} tm
		 * @return {Asc.TextMetrics}
		 */
		WorksheetView.prototype._roundTextMetrics = function (tm) {
			tm.width    = asc_calcnpt( tm.width, this._getPPIX() );
			tm.height   = asc_calcnpt(tm.height, 96);
			tm.baseline = asc_calcnpt(tm.baseline, 96);
			if (tm.centerline !== undefined) {
				tm.centerline = asc_calcnpt(tm.centerline, 96);
			}
			return tm;
		};

		WorksheetView.prototype._calcTextHorizPos = function (x1, x2, tm, halign) {
			switch (halign) {
				case khaCenter:
					return asc_calcnpt(0.5 * (x1 + x2 + this.width_1px - tm.width), this._getPPIX());
				case khaRight:
					return x2 + this.width_1px - this.width_padding - tm.width;
				case khaJustify:
				default:
					return x1 + this.width_padding;
			}
		};

		WorksheetView.prototype._calcTextVertPos = function (y1, y2, baseline, tm, valign) {
			switch (valign) {
				case kvaCenter:
					return asc_calcnpt(0.5 * (y1 + y2 - tm.height), this._getPPIY()) - this.height_1px; // ToDo возможно стоит тоже использовать 96
				case kvaTop:
					return y1 - this.height_1px;
				default:
					return baseline - tm.baseline;
			}
		};

		WorksheetView.prototype._calcTextWidth = function (x1, x2, tm, halign) {
			switch (halign) {
				case khaJustify:
					return x2 + this.width_1px - this.width_padding * 2 - x1;
				default:
					return tm.width;
			}
		};

		// ----- Scrolling -----

		WorksheetView.prototype._calcCellPosition = function (c, r, dc, dr) {
			var t = this;
			var vr = t.visibleRange;

			function findNextCell(col, row, dx, dy) {
				var state = t._isCellEmptyText(col, row);
				var i = col + dx;
				var j = row + dy;
				while (i >= 0 && i < t.cols.length && j >= 0 && j < t.rows.length) {
					var newState = t._isCellEmptyText(i, j);
					if (newState !== state) {
						var ret = {};
						ret.col = state ? i : i - dx;
						ret.row = state ? j : j - dy;
						if (ret.col !== col || ret.row !== row || state) { return ret; }
						state = newState;
					}
					i += dx;
					j += dy;
				}
				// Проверки для перехода в самый конец (ToDo пока убрал, чтобы не добавлять тормозов)
				/*if (i === t.cols.length && state)
					i = gc_nMaxCol;
				if (j === t.rows.length && state)
					j = gc_nMaxRow;*/
				return { col: i - dx, row: j- dy };
			}

			function findEnd(col, row) {
				var nc1, nc2 = col;
				do {
					nc1 = nc2;
					nc2 = findNextCell(nc1, row, +1, 0).col;
				} while (nc1 !== nc2);
				return nc2;
			}

			function findEOT() {
				var obr = t.objectRender ? t.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
				var maxCols = t.model.getColsCount();
				var maxRows = t.model.getRowsCount();
				var lastC = -1, lastR = -1;

				for (var col = 0; col < maxCols; ++col) {
					for (var row = 0; row < maxRows; ++row) {
						if (!t._isCellEmptyText(col, row)) {
							lastC = Math.max(lastC, col);
							lastR = Math.max(lastR, row);
						}
					}
				}
				return {col: Math.max(lastC, obr.maxCol), row: Math.max(lastR, obr.maxRow)};
			}

			var eot = dc > +2.0001 && dc < +2.9999 && dr > +2.0001 && dr < +2.9999 ? findEOT() : null;

			var newCol = (function () {
				if (dc > +0.0001 && dc < +0.9999) { return c + (vr.c2 - vr.c1 + 1); }        // PageDown
				if (dc < -0.0001 && dc > -0.9999) { return c - (vr.c2 - vr.c1 + 1); }        // PageUp
				if (dc > +1.0001 && dc < +1.9999) { return findNextCell(c, r, +1, 0).col; }  // Ctrl + ->
				if (dc < -1.0001 && dc > -1.9999) { return findNextCell(c, r, -1, 0).col; }  // Ctrl + <-
				if (dc > +2.0001 && dc < +2.9999) { return !eot ? findEnd(c,r) : eot.col; }  // End
				if (dc < -2.0001 && dc > -2.9999) { return 0; }                              // Home
				return c + dc;
			})();
			var newRow = (function () {
				if (dr > +0.0001 && dr < +0.9999) { return r + (vr.r2 - vr.r1 + 1); }
				if (dr < -0.0001 && dr > -0.9999) { return r - (vr.r2 - vr.r1 + 1); }
				if (dr > +1.0001 && dr < +1.9999) { return findNextCell(c, r, 0, +1).row; }
				if (dr < -1.0001 && dr > -1.9999) { return findNextCell(c, r, 0, -1).row; }
				if (dr > +2.0001 && dr < +2.9999) { return !eot ? 0 : eot.row; }
				if (dr < -2.0001 && dr > -2.9999) { return 0; }
				return r + dr;
			})();

			if (newCol >= t.cols.length && newCol <= gc_nMaxCol0) {
				t.nColsCount = newCol + 1;
				t._calcWidthColumns(/*fullRecalc*/2);
			}
			if (newRow >= t.rows.length && newRow <= gc_nMaxRow0) {
				t.nRowsCount = newRow + 1;
				t._calcHeightRows(/*fullRecalc*/2);
			}

			return {
				col: newCol < 0 ? 0 : Math.min(newCol, t.cols.length - 1),
				row: newRow < 0 ? 0 : Math.min(newRow, t.rows.length - 1)
			};
		};

		WorksheetView.prototype._isColDrawnPartially = function (col, leftCol, diffWidth) {
			if (col <= leftCol || col >= this.nColsCount)
				return false;
			diffWidth = diffWidth ? diffWidth : 0;
			var c = this.cols;
			return c[col].left + c[col].width - c[leftCol].left + this.cellsLeft + diffWidth > this.drawingCtx.getWidth();
		};

		WorksheetView.prototype._isRowDrawnPartially = function (row, topRow, diffHeight) {
			if (row <= topRow || row >= this.nRowsCount)
				return false;
			diffHeight = diffHeight ? diffHeight : 0;
			var r = this.rows;
			return r[row].top + r[row].height - r[topRow].top + this.cellsTop + diffHeight > this.drawingCtx.getHeight();
		};

		WorksheetView.prototype._isVisibleX = function () {
			var vr = this.visibleRange;
			var c = this.cols;
			var x = c[vr.c2].left + c[vr.c2].width;
			var offsetFrozen = this.getFrozenPaneOffset(false, true);
			x += offsetFrozen.offsetX;
			return x - c[vr.c1].left + this.cellsLeft < this.drawingCtx.getWidth();
		};

		WorksheetView.prototype._isVisibleY = function () {
			var vr = this.visibleRange;
			var r = this.rows;
			var y = r[vr.r2].top + r[vr.r2].height;
			var offsetFrozen = this.getFrozenPaneOffset(true, false);
			y += offsetFrozen.offsetY;
			return y - r[vr.r1].top + this.cellsTop < this.drawingCtx.getHeight();
		};

		WorksheetView.prototype._updateVisibleRowsCount = function (skipScrollReinit) {
			var isUpdate = false;
			this._calcVisibleRows();
			while (this._isVisibleY() && !this.isMaxRow()) {
				// Добавим еще строки, чтоб не было видно фон под таблицей
				this.expandRowsOnScroll(true);
				this._calcVisibleRows();
				isUpdate = true;
			}
			if (!skipScrollReinit && isUpdate)
				this.handlers.trigger("reinitializeScrollY");
		};

		WorksheetView.prototype._updateVisibleColsCount = function (skipScrollReinit) {
			var isUpdate = false;
			this._calcVisibleColumns();
			while (this._isVisibleX() && !this.isMaxCol()) {
				// Добавим еще столбцы, чтоб не было видно фон под таблицей
				this.expandColsOnScroll(true);
				this._calcVisibleColumns();
				isUpdate = true;
			}
			if (!skipScrollReinit && isUpdate)
				this.handlers.trigger("reinitializeScrollX");
		};

		WorksheetView.prototype.isMaxRow = function () {
			var rowsCountCurrent = this.rows.length;
			if (gc_nMaxRow === rowsCountCurrent)
				return true;

			var rowsCount = this.model.getRowsCount() + 1;
			return rowsCount <= rowsCountCurrent && this.model.isDefaultHeightHidden();
		};

		WorksheetView.prototype.isMaxCol = function () {
			var colsCountCurrent = this.cols.length;
			if (gc_nMaxCol === colsCountCurrent)
				return true;

			var colsCount = this.model.getColsCount() + 1;
			return colsCount <= colsCountCurrent && this.model.isDefaultWidthHidden();
		};

		WorksheetView.prototype.scrollVertical = function (delta, editor) {
			var vr = this.visibleRange;
			var start = this._calcCellPosition(vr.c1, vr.r1, 0, delta).row;
			var fixStartRow = new asc_Range(vr.c1, start, vr.c2, start);
			fixStartRow.startCol = vr.c1;
			fixStartRow.startRow = start;
			this._fixSelectionOfHiddenCells(0, delta >= 0 ? +1 : -1, fixStartRow);
			this._fixVisibleRange(fixStartRow);
			var reinitScrollY = start !== fixStartRow.r1;
			if (reinitScrollY && 0 > delta) // Для скролла вверх обычный сдвиг + дорисовка
				delta += fixStartRow.r1 - start;
			start = fixStartRow.r1;

			if (start === vr.r1) {
				if (reinitScrollY)
					this.handlers.trigger("reinitializeScrollY");
				return this;
			}

			this.cleanSelection();
			this.cellCommentator.cleanSelectedComment();

			var ctx = this.drawingCtx;
			var ctxW   = ctx.getWidth();
			var ctxH   = ctx.getHeight();
			var offsetX, offsetY, diffWidth = 0, diffHeight = 0, cFrozen = 0, rFrozen = 0;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				rFrozen = this.topLeftFrozenCell.getRow0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;
			}
			var oldVRE_isPartial = this._isRowDrawnPartially(vr.r2, vr.r1, diffHeight);

			var oldEnd = vr.r2;
			var oldDec = Math.max(calcDecades(oldEnd + 1), 3);
			var oldW, x, dx;
			var dy   = this.rows[start].top - this.rows[vr.r1].top;
			var oldH = ctxH - this.cellsTop - Math.abs(dy) - diffHeight;
			var scrollDown = (dy > 0 && oldH > 0);
			var y    = this.cellsTop + (scrollDown ? dy : 0) + diffHeight;
			var lastRowHeight = (scrollDown && oldVRE_isPartial) ?
				ctxH - (this.rows[oldEnd].top - this.rows[vr.r1].top + this.cellsTop + diffHeight) : 0;

			if (this.isCellEditMode && editor && this.activeRange.r1 >= rFrozen) {
				editor.move(0, -dy, this.cellsLeft + (this.activeRange.c1 >= cFrozen ? diffWidth : 0),
						this.cellsTop + diffHeight, ctxW, ctxH);
			}

			vr.r1 = start;
			this._updateVisibleRowsCount();

			var widthChanged = Math.max(calcDecades(vr.r2 + 1), 3) !== oldDec;
			if (widthChanged) {
				x = this.cellsLeft;
				this._calcHeaderColumnWidth();
				this._updateColumnPositions();
				this._calcVisibleColumns();
				this._drawCorner();
				this._cleanColumnHeadersRect();
				this._drawColumnHeaders(/*drawingCtx*/ undefined);

				dx   = this.cellsLeft - x;
				oldW = ctxW - x - Math.abs(dx);

				if (rFrozen) {
					ctx.drawImage(ctx.getCanvas(), x, this.cellsTop, oldW, diffHeight, x + dx, this.cellsTop, oldW, diffHeight);
					// ToDo Посмотреть с объектами!!!
				}
				this._drawFrozenPane(true);
			} else {
				dx   = 0;
				x    = this.headersLeft;
				oldW = ctxW;
			}

			// Перемещаем область
			var moveHeight = oldH - lastRowHeight;
			if (moveHeight > 0) {
				ctx.drawImage(ctx.getCanvas(), x, y, oldW, moveHeight, x + dx, y - dy, oldW, moveHeight);

				// Заглушка для safari (http://bugzserver/show_bug.cgi?id=25546). Режим 'copy' сначала затирает, а
				// потом рисует (а т.к. мы рисуем сами на себе, то уже картинка будет пустой)
				if (AscBrowser.isSafari)
					this.drawingGraphicCtx.moveImageDataSafari(x, y, oldW, moveHeight, x + dx, y - dy);
				else
					this.drawingGraphicCtx.moveImageData(x, y, oldW, moveHeight, x + dx, y - dy);
			}
			// Очищаем область
			var clearTop = this.cellsTop + diffHeight + (scrollDown && moveHeight > 0 ? moveHeight : 0);
			var clearHeight = (moveHeight > 0) ? Math.abs(dy) + lastRowHeight : ctxH - (this.cellsTop + diffHeight);
			ctx.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(this.headersLeft, clearTop, ctxW, clearHeight);
			this.drawingGraphicCtx.clearRect(this.headersLeft, clearTop, ctxW, clearHeight);

			if(this.objectRender && this.objectRender.drawingArea)
				this.objectRender.drawingArea.reinitRanges();

			// Дорисовываем необходимое
			if (dy < 0 || vr.r2 !== oldEnd || oldVRE_isPartial || dx !== 0) {
				var r1, r2;
				if (moveHeight > 0) {
					if (scrollDown) {
						r1 = oldEnd + (oldVRE_isPartial ? 0 : 1);
						r2 = vr.r2;
					} else {
						r1 = vr.r1;
						r2 = vr.r1 - 1 - delta;
					}
				} else {
					r1 = vr.r1;
					r2 = vr.r2;
				}
				var range = new asc_Range(vr.c1, r1, vr.c2, r2);
				// Это необходимо для того, чтобы строки, у которых высота по тексту, рассчитались (баг http://bugzserver/show_bug.cgi?id=21552)
				this._prepareCellTextMetricsCache(range);
				if (dx === 0) {
					this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2);
				} else {
					// redraw all headres, because number of decades in row index has been changed
					this._drawRowHeaders(/*drawingCtx*/ undefined);
					if (dx < 0) {
						// draw last column
						var r_;
						var r1_ = r2 + 1;
						var r2_ = vr.r2;
						if (r2_ >= r1_) {
							r_ = new asc_Range(vr.c2, r1_, vr.c2, r2_);
							this._drawGrid(/*drawingCtx*/ undefined, r_);
							this._drawCellsAndBorders(/*drawingCtx*/undefined, r_);
						}
						if (0 < rFrozen) {
							r_ = new asc_Range(vr.c2, 0, vr.c2, rFrozen - 1);
							offsetY = this.rows[0].top - this.cellsTop;
							this._drawGrid(/*drawingCtx*/ undefined, r_, /*offsetXForDraw*/undefined, offsetY);
							this._drawCellsAndBorders(/*drawingCtx*/undefined, r_, /*offsetXForDraw*/undefined, offsetY);
						}
					}
				}
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
				this._drawGrid(/*drawingCtx*/ undefined, range);
				this._drawCellsAndBorders(/*drawingCtx*/undefined, range);
				this._drawAutoF(range, offsetX, offsetY);
				this.objectRender.showDrawingObjectsEx(false, new GraphicOption(this,
					c_oAscGraphicOption.ScrollVertical, range, {offsetX: offsetX, offsetY: offsetY}));
				if (0 < cFrozen) {
					range.c1 = 0;
					range.c2 = cFrozen - 1;
					offsetX = this.cols[0].left - this.cellsLeft;
					this._drawGrid(/*drawingCtx*/ undefined, range, offsetX);
					this._drawCellsAndBorders(/*drawingCtx*/undefined, range, offsetX);
					this._drawAutoF(range, offsetX, offsetY);
					this.objectRender.showDrawingObjectsEx(false, new GraphicOption(this,
						c_oAscGraphicOption.ScrollVertical, range, {offsetX: offsetX, offsetY: offsetY}));
				}
				// Отрисовывать нужно всегда, вдруг бордеры
				this._drawFrozenPaneLines();
				this._fixSelectionOfMergedCells();
				this._drawSelection();

				if (widthChanged) {this.handlers.trigger("reinitializeScrollX");}
			}

			if (reinitScrollY)
				this.handlers.trigger("reinitializeScrollY");

			this.handlers.trigger("onDocumentPlaceChanged");
			//ToDo this.drawDepCells();
			this.cellCommentator.updateCommentPosition();
			this.cellCommentator.drawCommentCells();
			return this;
		};

		WorksheetView.prototype.scrollHorizontal = function (delta, editor) {
			var vr = this.visibleRange;
			var start = this._calcCellPosition(vr.c1, vr.r1, delta, 0).col;
			var fixStartCol = new asc_Range(start, vr.r1, start, vr.r2);
			fixStartCol.startCol = start;
			fixStartCol.startRow = vr.r1;
			this._fixSelectionOfHiddenCells(delta >= 0 ? +1 : -1, 0, fixStartCol);
			this._fixVisibleRange(fixStartCol);
			var reinitScrollX = start !== fixStartCol.c1;
			if (reinitScrollX && 0 > delta) // Для скролла влево обычный сдвиг + дорисовка
				delta += fixStartCol.c1 - start;
			start = fixStartCol.c1;

			if (start === vr.c1) {
				if (reinitScrollX)
					this.handlers.trigger("reinitializeScrollX");
				return this;
			}

			this.cleanSelection();
			this.cellCommentator.cleanSelectedComment();

			var ctx = this.drawingCtx;
			var ctxW    = ctx.getWidth();
			var ctxH    = ctx.getHeight();
			var dx      = this.cols[start].left - this.cols[vr.c1].left;
			var oldEnd  = vr.c2;
			var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
			var oldW = ctxW - this.cellsLeft - Math.abs(dx);
			var scrollRight = (dx > 0 && oldW > 0);
			var x = this.cellsLeft + (scrollRight ? dx : 0);
			var y = this.headersTop;
			var cFrozen = 0, rFrozen = 0;
			if (this.topLeftFrozenCell) {
				rFrozen = this.topLeftFrozenCell.getRow0();
				cFrozen = this.topLeftFrozenCell.getCol0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;
				x += diffWidth;
				oldW -= diffWidth;
			}
			var oldVCE_isPartial = this._isColDrawnPartially(vr.c2, vr.c1, diffWidth);

			var lastColWidth = (scrollRight && oldVCE_isPartial) ?
				ctxW - (this.cols[oldEnd].left - this.cols[vr.c1].left + this.cellsLeft + diffWidth) : 0;

			if (this.isCellEditMode && editor && this.activeRange.c1 >= cFrozen) {
				editor.move(-dx, 0, this.cellsLeft + diffWidth,
						this.cellsTop + (this.activeRange.r1 >= rFrozen ? diffHeight : 0), ctxW, ctxH);
			}

			vr.c1 = start;
            this._updateVisibleColsCount();

			// Перемещаем область
			var moveWidth = oldW - lastColWidth;
			if (moveWidth > 0) {
				ctx.drawImage(ctx.getCanvas(), x, y, moveWidth, ctxH, x - dx, y, moveWidth, ctxH);

				// Заглушка для safari (http://bugzserver/show_bug.cgi?id=25546). Режим 'copy' сначала затирает, а
				// потом рисует (а т.к. мы рисуем сами на себе, то уже картинка будет пустой)
				if (AscBrowser.isSafari)
					this.drawingGraphicCtx.moveImageDataSafari(x, y, moveWidth, ctxH, x - dx, y);
				else
					this.drawingGraphicCtx.moveImageData(x, y, moveWidth, ctxH, x - dx, y);
			}
			// Очищаем область
			var clearLeft = this.cellsLeft + diffWidth + (scrollRight && moveWidth > 0 ? moveWidth : 0);
			var clearWidth = (moveWidth > 0) ? Math.abs(dx) + lastColWidth : ctxW - (this.cellsLeft + diffWidth);
			ctx.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(clearLeft, y, clearWidth, ctxH);
			this.drawingGraphicCtx.clearRect(clearLeft, y, clearWidth, ctxH);

			if(this.objectRender && this.objectRender.drawingArea)
				this.objectRender.drawingArea.reinitRanges();

			// Дорисовываем необходимое
			if (dx < 0 || vr.c2 !== oldEnd || oldVCE_isPartial) {
				var c1, c2;
				if (moveWidth > 0) {
					if (scrollRight) {
						c1 = oldEnd + (oldVCE_isPartial ? 0 : 1);
						c2 = vr.c2;
					} else {
						c1 = vr.c1;
						c2 = vr.c1 - 1 - delta;
					}
				} else {
					c1 = vr.c1;
					c2 = vr.c2;
				}
				var range = new asc_Range(c1, vr.r1, c2, vr.r2);
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
				this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2);
				this._drawGrid(/*drawingCtx*/ undefined, range);
				this._drawCellsAndBorders(/*drawingCtx*/undefined, range);
				this._drawAutoF(range, offsetX, offsetY);
				this.objectRender.showDrawingObjectsEx(false, new GraphicOption(this,
					c_oAscGraphicOption.ScrollHorizontal, range, {offsetX: offsetX, offsetY: offsetY}));
				if (rFrozen) {
					range.r1 = 0;
					range.r2 = rFrozen - 1;
					offsetY = this.rows[0].top - this.cellsTop;
					this._drawGrid(/*drawingCtx*/ undefined, range, undefined, offsetY);
					this._drawCellsAndBorders(/*drawingCtx*/undefined, range, undefined, offsetY);
					this._drawAutoF(range, offsetX, offsetY);
					this.objectRender.showDrawingObjectsEx(false, new GraphicOption(this,
						c_oAscGraphicOption.ScrollHorizontal, range, {offsetX: offsetX, offsetY: offsetY}));
				}
				// Отрисовывать нужно всегда, вдруг бордеры
				this._drawFrozenPaneLines();
				this._fixSelectionOfMergedCells();
				this._drawSelection();
			}

			if (reinitScrollX)
				this.handlers.trigger("reinitializeScrollX");

			this.handlers.trigger("onDocumentPlaceChanged");
			//ToDo this.drawDepCells();
			this.cellCommentator.updateCommentPosition();
			this.cellCommentator.drawCommentCells();
			return this;
		};

		// ----- Selection -----

		// x,y - абсолютные координаты относительно листа (без учета заголовков)
		WorksheetView.prototype.findCellByXY = function (x, y, canReturnNull, skipCol, skipRow) {
			var r = 0, c = 0, tmpRow, tmpCol, result = new CCellObjectInfo();
			if (canReturnNull) {
				result.col = result.row = null;
			}

			x += this.cellsLeft;
			y += this.cellsTop;
			if (!skipCol) {
				while (c < this.cols.length) {
					tmpCol = this.cols[c];
					if (x <= tmpCol.left + tmpCol.width) {
						result.col = c;
						break;
					}
					++c;
				}

				if (null !== result.col)
					result.colOff = x - this.cols[result.col].left;
			}
			if (!skipRow) {
				while (r < this.rows.length) {
					tmpRow = this.rows[r];
					if (y <= tmpRow.top + tmpRow.height) {
						result.row = r;
						break;
					}
					++r;
				}

				if (null !== result.row)
					result.rowOff = y - this.rows[result.row].top;
			}

			return result;
		};

		// dX = true - считать с половиной следующей ячейки
		WorksheetView.prototype._findColUnderCursor = function (x, canReturnNull, dX) {
			var c = this.visibleRange.c1,
				offset = this.cols[c].left - this.cellsLeft,
				c2, x1, x2, cFrozen, widthDiff = 0;
			if (x >= this.cellsLeft) {
				if (this.topLeftFrozenCell) {
					cFrozen = this.topLeftFrozenCell.getCol0();
					widthDiff = this.cols[cFrozen].left - this.cols[0].left;
					if (x < this.cellsLeft + widthDiff && 0 !== widthDiff) {
						c = 0;
						widthDiff = 0;
					}
				}
				for (x1 = this.cellsLeft + widthDiff, c2 = this.cols.length - 1; c <= c2; ++c, x1 = x2) {
					x2 = x1 + this.cols[c].width;
					if (x1 <= x && x < x2) {
						if (dX){
							// Учитываем половину ячейки
							if (x1 <= x && x < x1 + this.cols[c].width / 2.0){
								// Это предыдущая ячейка
								--c;
								// Можем вернуть и -1 (но это только для fillHandle)
							}
						}
						return {col: c, left: x1, right: x2};
					}
				}
				if (!canReturnNull) {return {col: c2, left: this.cols[c2].left - offset, right: x2};}
			} else {
				if (this.topLeftFrozenCell) {
					cFrozen = this.topLeftFrozenCell.getCol0();
					if (0 !== cFrozen) {
						c = 0;
						offset = this.cols[c].left - this.cellsLeft;
					}
				}
				for (x2 = this.cellsLeft + this.cols[c].width, c2 = 0; c >= c2; --c, x2 = x1) {
					x1 = this.cols[c].left - offset;
					if (x1 <= x && x < x2) {
						if (dX){
							// Учитываем половину ячейки
							if (x1 <= x && x < x1 + this.cols[c].width / 2.0){
								// Это предыдущая ячейка
								--c;
								// Можем вернуть и -1 (но это только для fillHandle)
							}
						}
						return {col: c, left: x1, right: x2};
					}
				}
				if (!canReturnNull) {
					if (dX) {
						// Это предыдущая ячейка
						--c2;
						// Можем вернуть и -1 (но это только для fillHandle)
						return {col: c2};
					}
					return {col: c2, left: x1, right: x1 + this.cols[c2].width};
				}
			}
			return null;
		};

		// dY = true - считать с половиной следующей ячейки
		WorksheetView.prototype._findRowUnderCursor = function (y, canReturnNull, dY) {
			var r = this.visibleRange.r1,
				offset = this.rows[r].top - this.cellsTop,
				r2, y1, y2, rFrozen, heightDiff = 0;
			if (y >= this.cellsTop) {
				if (this.topLeftFrozenCell) {
					rFrozen = this.topLeftFrozenCell.getRow0();
					heightDiff = this.rows[rFrozen].top - this.rows[0].top;
					if (y < this.cellsTop + heightDiff && 0 !== heightDiff) {
						r = 0;
						heightDiff = 0;
					}
				}
				for (y1 = this.cellsTop + heightDiff, r2 = this.rows.length - 1; r <= r2; ++r, y1 = y2) {
					y2 = y1 + this.rows[r].height;
					if (y1 <= y && y < y2) {
						if (dY){
							// Учитываем половину ячейки
							if (y1 <= y && y < y1 + this.rows[r].height / 2.0){
								// Это предыдущая ячейка
								--r;
								// Можем вернуть и -1 (но это только для fillHandle)
							}
						}
						return {row: r, top: y1, bottom: y2};
					}
				}
				if (!canReturnNull) {return {row: r2, top: this.rows[r2].top - offset, bottom: y2};}
			} else {
				if (this.topLeftFrozenCell) {
					rFrozen = this.topLeftFrozenCell.getRow0();
					if (0 !== rFrozen) {
						r = 0;
						offset = this.rows[r].top - this.cellsTop;
					}
				}
				for (y2 = this.cellsTop + this.rows[r].height, r2 = 0; r >= r2; --r, y2 = y1) {
					y1 = this.rows[r].top - offset;
					if (y1 <= y && y < y2) {
						if (dY){
							// Учитываем половину ячейки
							if (y1 <= y && y < y1 + this.rows[r].height / 2.0){
								// Это предыдущая ячейка
								--r;
								// Можем вернуть и -1 (но это только для fillHandle)
							}
						}
						return {row: r, top: y1, bottom: y2};
					}
				}
				if (!canReturnNull) {
					if (dY) {
						// Это предыдущая ячейка
						--r2;
						// Можем вернуть и -1 (но это только для fillHandle)
						return {row: r2};
					}
					return {row: r2, top: y1, bottom: y1 + this.rows[r2].height};
				}
			}
			return null;
		};

		WorksheetView.prototype._getCursorFormulaOrChart = function (vr, x, y, offsetX, offsetY) {
			var i, l;
			var cursor, oFormulaRange, oFormulaRangeIn, xFormula1, xFormula2, yFormula1, yFormula2;
			var col = -1, row = -1;
			var arrRanges = this.isFormulaEditMode ? this.arrActiveFormulaRanges : this.arrActiveChartsRanges,
				targetArr = this.isFormulaEditMode ? 0 : -1;
			for (i = 0, l = arrRanges.length; i < l; ++i) {
				oFormulaRange = arrRanges[i].clone(true);
				oFormulaRangeIn = oFormulaRange.intersectionSimple(vr);
				if (oFormulaRangeIn) {
					xFormula1 = this.cols[oFormulaRangeIn.c1].left - offsetX;
					xFormula2 = this.cols[oFormulaRangeIn.c2].left + this.cols[oFormulaRangeIn.c2].width - offsetX;
					yFormula1 = this.rows[oFormulaRangeIn.r1].top - offsetY;
					yFormula2 = this.rows[oFormulaRangeIn.r2].top + this.rows[oFormulaRangeIn.r2].height - offsetY;

					if (
						(x >= xFormula1 + 5 && x <= xFormula2 - 5) && ((y >= yFormula1 - this.height_2px && y <= yFormula1 + this.height_2px) || (y >= yFormula2 - this.height_2px && y <= yFormula2 + this.height_2px))
						||
						(y >= yFormula1 + 5 && y <= yFormula2 - 5) && ((x >= xFormula1 - this.width_2px && x <= xFormula1 + this.width_2px) || (x >= xFormula2 - this.width_2px && x <= xFormula2 + this.width_2px))
					){
						cursor = kCurMove;
						break;
					} else if( x >= xFormula1 && x < xFormula1 + 5 && y >= yFormula1 && y < yFormula1 + 5 ){
						cursor = kCurSEResize;
						col = oFormulaRange.c2;
						row = oFormulaRange.r2;
						break;
					} else if ( x > xFormula2 - 5 && x <= xFormula2 && y > yFormula2 - 5 && y <= yFormula2 ){
						cursor = kCurSEResize;
						col = oFormulaRange.c1;
						row = oFormulaRange.r1;
						break;
					} else if( x > xFormula2 - 5 && x <= xFormula2 && y >= yFormula1 && y < yFormula1 + 5 ){
						cursor = kCurNEResize;
						col = oFormulaRange.c1;
						row = oFormulaRange.r2;
						break;
					} else if( x >= xFormula1 && x < xFormula1 + 5 && y > yFormula2 - 5 && y <= yFormula2 ){
						cursor = kCurNEResize;
						col = oFormulaRange.c2;
						row = oFormulaRange.r1;
						break;
					}
				}
			}
			return cursor ? {cursor: cursor, target: c_oTargetType.MoveResizeRange, col: col, row: row,
				formulaRange: oFormulaRange, indexFormulaRange: i, targetArr: targetArr} : null;
		};
		WorksheetView.prototype._isCursorOnSelectionBorder = function (ar, vr, x, y) {
			var arIntersection = ar.intersectionSimple(vr);
			var left, top, right, bottom, wEps = this.width_2px, hEps = this.height_2px;
			if (arIntersection) {
				left = ar.c1 === arIntersection.c1 ? this.cols[ar.c1].left : null;
				right = ar.c2 === arIntersection.c2 ? this.cols[ar.c2].left + this.cols[ar.c2].width : null;
				top = ar.r1 === arIntersection.r1 ? this.rows[ar.r1].top : null;
				bottom = ar.r2 === arIntersection.r2 ? this.rows[ar.r2].top + this.rows[ar.r2].height : null;
				var isLeft = (null !== left && x >= left - wEps && x <= left + wEps),
					isRight = (null !== right && x >= right - wEps && x <= right + wEps),
					isTop = (null !== top && y >= top - hEps && y <= top + hEps),
					isBottom = (null !== bottom && y >= bottom - hEps && y <= bottom + hEps),
					isHorMiddle = ((null === left || x >= left - wEps) && (null === right || x <= right + wEps)),
					isVerMiddle = ((null === top || y >= top - hEps) && (null === bottom || y <= bottom + hEps));

				if (((isLeft || isRight) && isVerMiddle) || ((isTop || isBottom) && isHorMiddle)) {
					// Мы навели на границу выделения
					return true;
				}
			}
			return false;
		};

		WorksheetView.prototype.getCursorTypeFromXY = function (x, y, isViewerMode) {
			var c, r, f, i, offsetX, offsetY, cellCursor, sheetId = this.model.getId(), userId,
				lockRangePosLeft, lockRangePosTop, lockInfo, oHyperlink, widthDiff = 0, heightDiff = 0,
				isLocked = false, ar = this.activeRange, target = c_oTargetType.Cells, row = -1, col = -1,
				isSelGraphicObject, isNotFirst;
				
			var frozenCursor = this._isFrozenAnchor(x, y);
			if (!isViewerMode && frozenCursor.result) {
				lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameFrozenPane);
				isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
				if (false !== isLocked) {
					// Кто-то сделал lock
					var frozenCell = this.topLeftFrozenCell ? this.topLeftFrozenCell : new CellAddress(0, 0, 0);
					userId = isLocked.UserId;
					lockRangePosLeft = this.getCellLeft(frozenCell.getCol0(), 0);
					lockRangePosTop = this.getCellTop(frozenCell.getRow0(), 0);
				}
				return {cursor: frozenCursor.cursor, target: frozenCursor.name, col: -1, row: -1, userId: userId,
					lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop};
			}

			var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
            if (asc["editor"].isStartAddShape && CheckIdSatetShapeAdd(this.objectRender.controller.curState))
				return {cursor: kCurFillHandle, target: c_oTargetType.Shape, col: -1, row: -1};

			if (drawingInfo && drawingInfo.id) {
				// Возможно картинка с lock
				lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, drawingInfo.id);
				isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
				if (false !== isLocked) {
					// Кто-то сделал lock
					userId = isLocked.UserId;
					lockRangePosLeft = drawingInfo.object.getVisibleLeftOffset(true);
					lockRangePosTop = drawingInfo.object.getVisibleTopOffset(true);
				}

				if (drawingInfo.hyperlink instanceof ParaHyperlink) {
					oHyperlink = new Hyperlink();
					oHyperlink.Tooltip = drawingInfo.hyperlink.ToolTip;
					var spl = drawingInfo.hyperlink.Value.split("!");
					if (spl.length === 2)
						oHyperlink.setLocation(drawingInfo.hyperlink.Value);
					else
						oHyperlink.Hyperlink = drawingInfo.hyperlink.Value;

					cellCursor = {cursor: drawingInfo.cursor, target: c_oTargetType.Cells, col: -1, row: -1, userId: userId};
					return {cursor: kCurHyperlink, target: c_oTargetType.Hyperlink,
							hyperlink: new asc_CHyperlink(oHyperlink), cellCursor: cellCursor, userId: userId};
				}

				return {cursor: drawingInfo.cursor, target: c_oTargetType.Shape, drawingId: drawingInfo.id, col: -1, row: -1,
					userId: userId, lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop};
			}

			x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
			y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

			if (this.stateFormatPainter) {
				if (x <= this.cellsLeft && y >= this.cellsTop) {
					r = this._findRowUnderCursor(y, true);
					if (r !== null) {
						target = c_oTargetType.RowHeader;
						row = r.row;
					}
				}
				if (y <= this.cellsTop && x >= this.cellsLeft) {
					c = this._findColUnderCursor(x, true);
					if (c !== null) {
						target = c_oTargetType.ColumnHeader;
						col = c.col;
					}
				}
				return {cursor: kCurFormatPainterExcel, target: target, col: col, row: row};
			}

			var oResDefault = {cursor: kCurDefault, target: c_oTargetType.None, col: -1, row: -1};
			if (x < this.cellsLeft && y < this.cellsTop) {
				return {cursor: kCurCorner, target: c_oTargetType.Corner, col: -1, row: -1};
			}

			var cFrozen = -1, rFrozen = -1;
			offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
			offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				rFrozen = this.topLeftFrozenCell.getRow0();
				widthDiff = this.cols[cFrozen].left - this.cols[0].left;
				heightDiff = this.rows[rFrozen].top - this.rows[0].top;

				offsetX = (x < this.cellsLeft + widthDiff) ? 0 : offsetX - widthDiff;
				offsetY = (y < this.cellsTop + heightDiff) ? 0 : offsetY - heightDiff;
			}

			if (x <= this.cellsLeft && y >= this.cellsTop) {
				r = this._findRowUnderCursor(y, true);
				if (r === null)
					return oResDefault;
				isNotFirst = (r.row !== (-1 !== rFrozen ? 0 : this.visibleRange.r1));
				f = !isViewerMode && (isNotFirst && y < r.top + 3 || y >= r.bottom - 3);
				// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
				return {
					cursor: f ? kCurRowResize : kCurRowSelect,
					target: f ? c_oTargetType.RowResize : c_oTargetType.RowHeader,
					col: -1,
					row: r.row + (isNotFirst && f && y < r.top + 3 ? -1 : 0),
					mouseY: f ? ((y < r.top + 3) ? (r.top - y - this.height_1px): (r.bottom - y - this.height_1px))  : null
				};
			}
			if (y <= this.cellsTop && x >= this.cellsLeft) {
				c = this._findColUnderCursor(x, true);
				if (c === null)
					return oResDefault;
				isNotFirst = c.col !== (-1 !== cFrozen ? 0 : this.visibleRange.c1);
				f = !isViewerMode && (isNotFirst && x < c.left + 3 || x >= c.right - 3);
				// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
				return {
					cursor: f ? kCurColResize : kCurColSelect,
					target: f ? c_oTargetType.ColumnResize : c_oTargetType.ColumnHeader,
					col: c.col + (isNotFirst && f && x < c.left + 3 ? -1 : 0),
					row: -1,
					mouseX: f ? ((x < c.left + 3) ? (c.left - x - this.width_1px): (c.right - x - this.width_1px))  : null
				};
			}

			if (this.isFormulaEditMode || this.isChartAreaEditMode) {
				var oFormulaOrChartCursor = this._getCursorFormulaOrChart(this.visibleRange, x, y, offsetX, offsetY);
				if (oFormulaOrChartCursor)
					return oFormulaOrChartCursor;
			}

			var xWithOffset = x + offsetX;
			var yWithOffset = y + offsetY;

			isSelGraphicObject = this.objectRender.selectedGraphicObjectsExists();
			if (!isViewerMode && !isSelGraphicObject) {
				// Эпсилон для fillHandle
				var fillHandleEpsilon = this.width_1px;
				if (!this.isChartAreaEditMode &&
					x >= (this.fillHandleL - fillHandleEpsilon) && x <= (this.fillHandleR + fillHandleEpsilon) &&
					y >= (this.fillHandleT - fillHandleEpsilon) && y <= (this.fillHandleB + fillHandleEpsilon)) {
					// Мы на "квадрате" для автозаполнения
					return {cursor: kCurFillHandle, target: c_oTargetType.FillHandle, col: -1, row: -1};
				}

				// Навели на выделение (стоит вынести в отдельный метод)
				if (this._isCursorOnSelectionBorder(ar, this.visibleRange, xWithOffset, yWithOffset))
					return {cursor: kCurMove, target: c_oTargetType.MoveRange, col: -1, row: -1};
				if (this.topLeftFrozenCell) {
					var oFrozenRange;
					cFrozen -= 1; rFrozen -= 1;
					if (0 <= cFrozen && 0 <= rFrozen) {
						oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
						if (this._isCursorOnSelectionBorder(ar, oFrozenRange, x, y))
							return {cursor: kCurMove, target: c_oTargetType.MoveRange, col: -1, row: -1};
					}
					if (0 <= cFrozen) {
						oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
						if (this._isCursorOnSelectionBorder(ar, oFrozenRange, x, yWithOffset))
							return {cursor: kCurMove, target: c_oTargetType.MoveRange, col: -1, row: -1};
					}
					if (0 <= rFrozen) {
						oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
						if (this._isCursorOnSelectionBorder(ar, oFrozenRange, xWithOffset, y))
							return {cursor: kCurMove, target: c_oTargetType.MoveRange, col: -1, row: -1};
					}
				}
			}

			if (x > this.cellsLeft && y > this.cellsTop) {
				c = this._findColUnderCursor(x, true);
				r = this._findRowUnderCursor(y, true);
				if (c === null || r === null)
					return oResDefault;

				// Проверка на совместное редактирование
				var lockRange = undefined;
				var lockAllPosLeft = undefined;
				var lockAllPosTop = undefined;
				var userIdAllProps = undefined;
				var userIdAllSheet = undefined;
				if (!isViewerMode && this.collaborativeEditing.getCollaborativeEditing()) {
					var c1Recalc = null, r1Recalc = null;
					var selectRangeRecalc = new asc_Range(c.col, r.row, c.col, r.row);
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, selectRangeRecalc);
					if (false === isIntersection) {
						lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
							sheetId, new asc.asc_CCollaborativeRange(selectRangeRecalc.c1, selectRangeRecalc.r1,
								selectRangeRecalc.c2, selectRangeRecalc.r2));
						isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
							c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false);
						if (false !== isLocked) {
							// Кто-то сделал lock
							userId = isLocked.UserId;
							lockRange = isLocked.Element["rangeOrObjectId"];

							c1Recalc = this.collaborativeEditing.m_oRecalcIndexColumns[sheetId].getLockOther(
								lockRange["c1"], c_oAscLockTypes.kLockTypeOther);
							r1Recalc = this.collaborativeEditing.m_oRecalcIndexRows[sheetId].getLockOther(
								lockRange["r1"], c_oAscLockTypes.kLockTypeOther);
							if (null !== c1Recalc && null !== r1Recalc) {
								lockRangePosLeft = this.getCellLeft(c1Recalc, /*pt*/1);
								lockRangePosTop = this.getCellTop(r1Recalc, /*pt*/1);
								// Пересчитываем X и Y относительно видимой области
								lockRangePosLeft -= offsetX;
								lockRangePosTop -= offsetY;
								// Пересчитываем в px
								lockRangePosLeft *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
								lockRangePosTop *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
							}
						}
					} else {
						lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
							sheetId, null);
					}
					// Проверим не удален ли весь лист (именно удален, т.к. если просто залочен, то не рисуем рамку вокруг)
					lockInfo["type"] = c_oAscLockTypeElem.Sheet;
					isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true);
					if (false !== isLocked) {
						// Кто-то сделал lock
						userIdAllSheet = isLocked.UserId;
						lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
						lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
					}

					// Проверим не залочены ли все свойства листа (только если не удален весь лист)
					if (undefined === userIdAllSheet) {
						lockInfo["type"] = c_oAscLockTypeElem.Range;
						lockInfo["subType"] = c_oAscLockTypeElemSubType.InsertRows;
						isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
							c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true);
						if (false !== isLocked) {
							// Кто-то сделал lock
							userIdAllProps = isLocked.UserId;

							lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
							lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
						}
					}
				}
				
				var autoFilterInfo = this.autoFilters.checkCursor(x, y, offsetX, offsetY, {cFrozen: cFrozen, rFrozen: rFrozen}, r, c);
				if (autoFilterInfo && !isViewerMode)
					return {cursor: kCurAutoFilter, target: c_oTargetType.FilterObject, col: -1, row: -1, idFilter: autoFilterInfo.id};
				
				// Проверим есть ли комменты
				var comments = this.cellCommentator.getComments(c.col, r.row);
				var coords = undefined;
				var indexes = undefined;

				if (0 < comments.length) {
					indexes = [];
					for (i = 0; i < comments.length; ++i) {
						indexes.push(comments[i].asc_getId());
					}
					coords = this.cellCommentator.getCommentsCoords(comments);
				}

				// Проверим, может мы в гиперлинке
				oHyperlink = this.model.getHyperlinkByCell(r.row, c.col);
				cellCursor = {cursor: kCurCells, target: c_oTargetType.Cells, col: (c ? c.col : -1),
					row: (r ? r.row : -1), userId: userId,
					lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop,
					userIdAllProps: userIdAllProps, lockAllPosLeft: lockAllPosLeft,
					lockAllPosTop: lockAllPosTop, userIdAllSheet: userIdAllSheet,
					commentIndexes: indexes, commentCoords: coords};
				if (null !== oHyperlink) {
					return {cursor: kCurHyperlink, target: c_oTargetType.Hyperlink,
						hyperlink: new asc_CHyperlink(oHyperlink), cellCursor: cellCursor,
						userId: userId, lockRangePosLeft: lockRangePosLeft,
						lockRangePosTop: lockRangePosTop, userIdAllProps: userIdAllProps,
						userIdAllSheet: userIdAllSheet, lockAllPosLeft: lockAllPosLeft,
						lockAllPosTop: lockAllPosTop, commentIndexes: indexes, commentCoords: coords};
				}
				return cellCursor;
			}

			return oResDefault;
		};

		WorksheetView.prototype._fixSelectionOfMergedCells = function (fixedRange) {
			var ar = fixedRange ? fixedRange : ((this.isFormulaEditMode) ?
				this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange);

			if (!ar) { return; }

			if (ar.type && ar.type !== c_oAscSelectionType.RangeCells) { return; }

			// ToDo - переделать этот момент!!!!
			var res = this.model.expandRangeByMerged(ar.clone(true));

			if (ar.c1 !== res.c1 && ar.c1 !== res.c2) {ar.c1 = ar.c1 <= ar.c2 ? res.c1 : res.c2;}
			ar.c2 = ar.c1 === res.c1 ? res.c2 : (res.c1);
			if (ar.r1 !== res.r1 && ar.r1 !== res.r2) {ar.r1 = ar.r1 <= ar.r2 ? res.r1 : res.r2;}
			ar.r2 = ar.r1 === res.r1 ? res.r2 : res.r1;
			ar.normalize();
		};

		WorksheetView.prototype._findVisibleCol = function (from, dc, flag) {
			var to = dc < 0 ? -1 : this.cols.length, c;
			for (c = from; c !== to; c += dc) {
				if (this.cols[c].width > this.width_1px) {return c;}
			}
			return flag ? -1 : this._findVisibleCol(from, dc * -1, true);
		};
		WorksheetView.prototype._findVisibleRow = function (from, dr, flag) {
			var to = dr < 0 ? -1 : this.rows.length, r;
			for (r = from; r !== to; r += dr) {
				if (this.rows[r].height > this.height_1px) {return r;}
			}
			return flag ? -1 : this._findVisibleRow(from, dr * -1, true);
		};

		WorksheetView.prototype._fixSelectionOfHiddenCells = function (dc, dr, range) {
			var ar = (range) ? range : this.activeRange, c1, c2, r1, r2, mc, i, arn = ar.clone(true);

			if (dc === undefined) {dc = +1;}
			if (dr === undefined) {dr = +1;}

			if (ar.c2 === ar.c1) {
				if (this.cols[ar.c1].width < this.width_1px) {
					c1 = c2 = this._findVisibleCol(ar.c1, dc);
				}
			} else {
				if (0 !== dc && this.nColsCount > ar.c2 && this.cols[ar.c2].width < this.width_1px) {
					// Проверка для одновременно замерженных и скрытых ячеек (A1:C1 merge, B:C hidden)
					for (mc = null, i = arn.r1; i <= arn.r2; ++i) {
						mc = this.model.getMergedByCell(i, ar.c2);
						if (mc) {break;}
					}
					if (!mc) {c2 = this._findVisibleCol(ar.c2, dc);}
				}
			}
			if (c1 < 0 || c2 < 0) {throw "Error: all columns are hidden";}

			if (ar.r2 === ar.r1) {
				if (this.rows[ar.r1].height < this.height_1px) {
					r1 = r2 = this._findVisibleRow(ar.r1, dr);
				}
			} else {
				if (0 !== dr && this.nRowsCount > ar.r2 && this.rows[ar.r2].height < this.height_1px) {
					//Проверка для одновременно замерженных и скрытых ячеек (A1:A3 merge, 2:3 hidden)
					for (mc = null, i = arn.c1; i <= arn.c2; ++i) {
						mc = this.model.getMergedByCell(ar.r2, i);
						if (mc) {break;}
					}
					if (!mc) {r2 = this._findVisibleRow(ar.r2, dr);}
				}
			}
			if (r1 < 0 || r2 < 0) {throw "Error: all rows are hidden";}

			ar.assign(
				c1 !== undefined ? c1 : ar.c1,
				r1 !== undefined ? r1 : ar.r1,
				c2 !== undefined ? c2 : ar.c2,
				r2 !== undefined ? r2 : ar.r2);

			// ToDo возможно это избыточные проверки
			if (c1 >= 0) {ar.startCol = c1;}
			if (r1 >= 0) {ar.startRow = r1;}

			if (0 !== dc && this.cols[ar.startCol].width < this.width_1px) {
				c1 = this._findVisibleCol(ar.startCol, dc);
				if (c1 >= 0) {ar.startCol = c1;}
			}
			if (0 !== dr && this.rows[ar.startRow].height < this.height_1px) {
				r1 = this._findVisibleRow(ar.startRow, dr);
				if (r1 >= 0) {ar.startRow = r1;}
			}
		};

		WorksheetView.prototype._moveActiveCellToXY = function (x, y) {
			var c, r;
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;

			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

			if (x < this.cellsLeft && y < this.cellsTop) {
				ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
				ar.type = c_oAscSelectionType.RangeMax;
				ar.startCol = 0;
				ar.startRow = 0;
				this._fixSelectionOfHiddenCells();
			} else if (x < this.cellsLeft) {
				r = this._findRowUnderCursor(y).row;
				ar.assign(0, r, this.cols.length - 1, r);
				ar.type = c_oAscSelectionType.RangeRow;
				ar.startCol = 0;
				ar.startRow = r;
				this._fixSelectionOfHiddenCells();
			} else if (y < this.cellsTop) {
				c = this._findColUnderCursor(x).col;
				ar.assign(c, 0, c, this.rows.length - 1);
				ar.type = c_oAscSelectionType.RangeCol;
				ar.startCol = c;
				ar.startRow = 0;
				this._fixSelectionOfHiddenCells();
			} else {
				c = this._findColUnderCursor(x).col;
				r = this._findRowUnderCursor(y).row;
				ar.assign(c, r, c, r);
				ar.startCol = c;
				ar.startRow = r;
				ar.type = c_oAscSelectionType.RangeCells;
				this._fixSelectionOfMergedCells();
			}
		};

		WorksheetView.prototype._moveActiveCellToOffset = function (dc, dr) {
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
			var c  = mc ? ( dc < 0 ? mc.c1 : dc > 0 ? Math.min(mc.c2, this.nColsCount - 1 - dc) : ar.startCol) : ar.startCol;
			var r  = mc ? ( dr < 0 ? mc.r1 : dr > 0 ? Math.min(mc.r2, this.nRowsCount - 1 - dr) : ar.startRow ) : ar.startRow;
			var p  = this._calcCellPosition(c, r, dc, dr);
			ar.assign(p.col, p.row, p.col, p.row);
			ar.type = c_oAscSelectionType.RangeCells;
			ar.startCol = p.col;
			ar.startRow = p.row;
			this._fixSelectionOfMergedCells();
			this._fixSelectionOfHiddenCells(dc>=0?+1:-1, dr>=0?+1:-1);
		};

		// Движение активной ячейки в выделенной области
		WorksheetView.prototype._moveActivePointInSelection = function (dc, dr) {
			var ar = this.activeRange;
			var arn = this.activeRange.clone(true);

			// Если мы на скрытой строке или ячейке, то двигаться в выделении нельзя (так делает и Excel)
			if (this.width_1px > this.cols[ar.startCol].width || this.height_1px > this.rows[ar.startRow].height)
				return;

			// Set active cell
			ar.startCol += dc;
			ar.startRow += dr;

			do {
				var done = true;

				// Обработка выхода за границы выделения
				if (ar.startCol < arn.c1) {
					ar.startCol = arn.c2;
					ar.startRow -= 1;
					if (ar.startRow < arn.r1) { ar.startRow = arn.r2; }
				} else if (ar.startCol > arn.c2) {
					ar.startCol = arn.c1;
					ar.startRow += 1;
					if (ar.startRow > arn.r2) { ar.startRow = arn.r1; }
				}
				if (ar.startRow < arn.r1){
					ar.startRow = arn.r2;
					ar.startCol -= 1;
					if (ar.startCol < arn.c1) { ar.startCol = arn.c2; }
				} else if (ar.startRow > arn.r2){
					ar.startRow = arn.r1;
					ar.startCol += 1;
					if (ar.startCol > arn.c2) { ar.startCol = arn.c1; }
				}

				// Обработка движения active point через merged cells
				var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);

				if (mc) {
					if (dc > 0 && (ar.startCol > mc.c1 || ar.startRow !== mc.r1)) {
						// Движение слева направо
						ar.startCol = mc.c2 + 1;
						done = false;
					} else if (dc < 0 && (ar.startCol < mc.c2 || ar.startRow !== mc.r1)) {
						// Движение справа налево
						ar.startCol = mc.c1 - 1;
						done = false;
					}
					if (dr > 0 && (ar.startRow > mc.r1 || ar.startCol !== mc.c1)) {
						// Движение сверху вниз
						ar.startRow = mc.r2 + 1;
						done = false;
					} else if (dr < 0 && (ar.startRow < mc.r2 || ar.startCol !== mc.c1)) {
						// Движение снизу вверх
						ar.startRow = mc.r1 - 1;
						done = false;
					}
				}
				if (!done) { continue; }

				// Обработка движения через скрытые столбцы/строки
				while (ar.startCol >= arn.c1 && ar.startCol <= arn.c2 && this.cols[ar.startCol].width < this.width_1px) {
					ar.startCol += dc || (dr > 0 ? +1 : -1);
					done = false;
				}
				if (!done) { continue; }

				while (ar.startRow >= arn.r1 && ar.startRow <= arn.r2 && this.rows[ar.startRow].height < this.height_1px) {
					ar.startRow += dr || (dc > 0 ? +1 : -1);
					done = false;
				}
			} while (!done);
		};

		WorksheetView.prototype._calcSelectionEndPointByXY = function (x, y) {
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

			var res = new asc_Range(ar.startCol, ar.startRow, this._findColUnderCursor(x).col, this._findRowUnderCursor(y).row, true);
			if (ar.type === c_oAscSelectionType.RangeCells)
				this._fixSelectionOfMergedCells(res);
			return res;
			/*return {
				c2: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? this._findColUnderCursor(x).col : ar.c2,
				r2: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? this._findRowUnderCursor(y).row : ar.r2
			};*/
		};

		WorksheetView.prototype._calcSelectionEndPointByOffset = function (dc, dr) {
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			var startCol = ar.startCol, startRow = ar.startRow;
			var c1, r1, c2, r2, tmp;
			tmp = asc.getEndValueRange(dc, startCol, ar.c1, ar.c2); c1 = tmp.x1; c2 = tmp.x2;
			tmp = asc.getEndValueRange(dr, startRow, ar.r1, ar.r2); r1 = tmp.x1; r2 = tmp.x2;

			var p1 = this._calcCellPosition(c2, r2, dc, dr), p2;
			var res = new asc_Range(c1, r1, c2 = p1.col, r2 = p1.row, true);
			dc = Math.sign(dc); dr = Math.sign(dr);
			if (c_oAscSelectionType.RangeCells === ar.type) {
				this._fixSelectionOfMergedCells(res);
				while (ar.isEqual(res)) {
					p2 = this._calcCellPosition(c2, r2, dc, dr);
					res.assign(c1, r1, c2 = p2.col, r2 = p2.row, true);
					this._fixSelectionOfMergedCells(res);
					if (p1.c2 === p2.c2 && p1.r2 === p2.r2)
						break;
					p1 = p2;
				}
			}
			var bIsHidden = false;
			if (0 !== dc && this.cols[c2].width < this.width_1px) {
				c2 = this._findVisibleCol(c2, dc);
				bIsHidden = true;
			}
			if (0 !== dr && this.rows[r2].height < this.height_1px) {
				r2 = this._findVisibleRow(r2, dr);
				bIsHidden = true;
			}
			if (bIsHidden)
				res.assign(c1, r1, c2, r2, true);
			return res;
		};

		WorksheetView.prototype._calcActiveRangeOffsetIsCoord = function (x,y) {
			var vr = this.visibleRange;
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			if (this.isFormulaEditMode) {
				// Для формул нужно сделать ограничение по range (у нас хранится полный диапазон)
				if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
					ar = ar.clone(true);
					ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
					ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
				}
			}

            x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
            y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

            var d={};

            if (y <= this.cellsTop + this.height_2px /*+ offsetFrozen.offsetY*/ ){
                d.deltaY = -1;
            }else if ( y >= this.drawingCtx.getHeight() - this.height_2px)
                d.deltaY = 1;

            if (x <= this.cellsLeft + this.width_2px /*+ offsetFrozen.offsetX*/ ){
                d.deltaX = -1;
            }else if ( x >= this.drawingCtx.getWidth() - this.width_2px)
                d.deltaX = 1;

            if (ar.type === c_oAscSelectionType.RangeRow)
                d.deltaX = 0;
            else if (ar.type === c_oAscSelectionType.RangeCol)
                d.deltaY = 0;
            else if (ar.type === c_oAscSelectionType.RangeMax) {
                d.deltaX = 0;
                d.deltaY = 0;
            }

            return d;

		};

        WorksheetView.prototype._calcActiveRangeOffset = function () {
            var vr = this.visibleRange;
            var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
            if (this.isFormulaEditMode) {
                // Для формул нужно сделать ограничение по range (у нас хранится полный диапазон)
                if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
                    ar = ar.clone(true);
                    ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
                    ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
                }
            }
            var arn = ar.clone(true);
            var isMC = this._isMergedCells(arn);
            var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
            var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
            var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
            var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;

            var offsetFrozen = this.getFrozenPaneOffset();

            if (adjustRight) {
                while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX, offsetFrozen.offsetX)) {++incX;}
            }
            if (adjustBottom) {
                while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY, offsetFrozen.offsetY)) {++incY;}
            }
            return {
                deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
                deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
            };
        };

		/**
		 * @param {ActiveRange} [range]
		 * @returns {{deltaX: number, deltaY: number}}
		 */
		WorksheetView.prototype._calcActiveCellOffset = function (range) {
			var vr = this.visibleRange;
			var ar = range ? range : this.activeRange;
			var arn = ar.clone(true);
			var isMC = this._isMergedCells(arn);
			var adjustRight = ar.startCol >= vr.c2 || ar.startCol >= vr.c2 && isMC;
			var adjustBottom = ar.startRow >= vr.r2 || ar.startRow >= vr.r2 && isMC;
			var incX = ar.startCol < vr.c1 && isMC ? arn.startCol - vr.c1 : ar.startCol < vr.c1 ? ar.startCol - vr.c1 : 0;
			var incY = ar.startRow < vr.r1 && isMC ? arn.startRow - vr.r1 : ar.startRow < vr.r1 ? ar.startRow - vr.r1 : 0;

			var offsetFrozen = this.getFrozenPaneOffset();

			if (adjustRight) {
				while (this._isColDrawnPartially(isMC ? arn.startCol : ar.startCol, vr.c1 + incX, offsetFrozen.offsetX)) {++incX;}
			}
			if (adjustBottom) {
				while (this._isRowDrawnPartially(isMC ? arn.startRow : ar.startRow, vr.r1 + incY, offsetFrozen.offsetY)) {++incY;}
			}
			return {
				deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
				deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
			};
		};

		WorksheetView.prototype._calcFillHandleOffset = function (range) {
			var vr = this.visibleRange;
			var ar = range ? range : this.activeFillHandle;
			var arn = ar.clone(true);
			var isMC = this._isMergedCells(arn);
			var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
			var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
			var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
			var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;

			var offsetFrozen = this.getFrozenPaneOffset();

			if (adjustRight) {
				try{
					while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX, offsetFrozen.offsetX)) {++incX;}
				}
				catch(e){
					this.expandColsOnScroll(true);
					this.handlers.trigger("reinitializeScrollX");
				}
			}
			if (adjustBottom) {
				try{
					while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY, offsetFrozen.offsetY)) {++incY;}
				}
				catch(e){
					this.expandRowsOnScroll(true);
					this.handlers.trigger("reinitializeScrollY");
				}
			}
			return {
				deltaX: incX,
				deltaY: incY
			};
		};

		// Потеряем ли мы что-то при merge ячеек
		WorksheetView.prototype.getSelectionMergeInfo = function (options) {
			var arn = this.activeRange.clone(true);
			var notEmpty = false;
			var r, c;

			if (this.cellCommentator.isMissComments(arn))
				return true;

			switch (options) {
				case c_oAscMergeOptions.Merge:
				case c_oAscMergeOptions.MergeCenter:
					for (r = arn.r1; r <= arn.r2; ++r) {
						for (c = arn.c1; c <= arn.c2; ++c) {
							if (false === this._isCellEmptyText(c, r)) {
								if (notEmpty)
									return true;
								notEmpty = true;
							}
						}
					}
					break;
				case c_oAscMergeOptions.MergeAcross:
					for (r = arn.r1; r <= arn.r2; ++r) {
						notEmpty = false;
						for (c = arn.c1; c <= arn.c2; ++c) {
							if (false === this._isCellEmptyText(c, r)) {
								if (notEmpty)
									return true;
								notEmpty = true;
							}
						}
					}
					break;
			}

			return false;
		};

		WorksheetView.prototype.getSelectionMathInfo = function () {
			var ar = this.activeRange;
			var range = this.model.getRange3(ar.r1, ar.c1, ar.r2, ar.c2);
			var tmp;
			var oSelectionMathInfo = new asc_CSelectionMathInfo();
			var sum = 0;
			range._setPropertyNoEmpty(null, null, function (c) {
				if (false === c.isEmptyTextString()) {
					++oSelectionMathInfo.count;
					if (CellValueType.Number === c.getType()) {
						tmp = parseFloat(c.getValueWithoutFormat());
						if (isNaN(tmp))
							return;
						if (0 === oSelectionMathInfo.countNumbers)
							oSelectionMathInfo.min = oSelectionMathInfo.max = tmp;
						else {
							oSelectionMathInfo.min = Math.min(oSelectionMathInfo.min, tmp);
							oSelectionMathInfo.max = Math.max(oSelectionMathInfo.max, tmp);
						}
						++oSelectionMathInfo.countNumbers;
						sum += tmp;
					}
				}
			});
			// Показываем только данные для 2-х или более ячеек (http://bugzserver/show_bug.cgi?id=24115)
			if (1 < oSelectionMathInfo.countNumbers) {
				// Мы должны отдавать в формате активной ячейки
				var numFormat = range.getNumFormat();
				if (c_oAscNumFormatType.Time === numFormat.getType()) {
					// Для времени нужно отдавать в формате [h]:mm:ss (http://bugzserver/show_bug.cgi?id=26271)
					numFormat = oNumFormatCache.get('[h]:mm:ss');
				}

				oSelectionMathInfo.sum = numFormat.formatToMathInfo(sum, CellValueType.Number, this.settings.mathMaxDigCount);
				oSelectionMathInfo.average = numFormat.formatToMathInfo(sum / oSelectionMathInfo.countNumbers,
					CellValueType.Number, this.settings.mathMaxDigCount);

				oSelectionMathInfo.min = numFormat.formatToMathInfo(oSelectionMathInfo.min, CellValueType.Number,
					this.settings.mathMaxDigCount);
				oSelectionMathInfo.max = numFormat.formatToMathInfo(oSelectionMathInfo.max, CellValueType.Number,
					this.settings.mathMaxDigCount);
			}
			return oSelectionMathInfo;
		};

		WorksheetView.prototype.getSelectionName = function (bRangeText) {
			if (this.isSelectOnShape)
				return " ";	// Пока отправим пустое имя(с пробелом, пустое не воспринимаем в меню..) ToDo

			var ar = this.activeRange;
			var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
			var c1 = mc ? mc.c1 : ar.startCol,
                r1 = mc ? mc.r1 : ar.startRow,
                ar_norm = ar.normalize(),
                mc_norm = mc ? mc.normalize() : null,
                c2 = mc_norm ? mc_norm.isEqual(ar_norm)? mc_norm.c1 : ar_norm.c2 : ar_norm.c2,
			    r2 = mc_norm ? mc_norm.isEqual(ar_norm)? mc_norm.r1 : ar_norm.r2 : ar_norm.r2,
                selectionSize = !bRangeText ? "" : (function (r) {
                    var rc = Math.abs(r.r2 - r.r1) + 1;
                    var cc = Math.abs(r.c2 - r.c1) + 1;
                    switch (r.type) {
                        case c_oAscSelectionType.RangeCells: return rc + "R x " + cc + "C";
                        case c_oAscSelectionType.RangeCol: return cc + "C";
                        case c_oAscSelectionType.RangeRow: return rc + "R";
                        case c_oAscSelectionType.RangeMax: return gc_nMaxRow + "R x " + gc_nMaxCol + "C";
                    }
                    return "";
                })(ar ),
                cellName =  this._getColumnTitle( c1 ) + this._getRowTitle( r1 ),
                defName = null,
                dN = new Asc.Range(ar_norm.c1, ar_norm.r1, c2 ,r2, true ).normalize();

            /*if( c1==c2 && r1==r2 ){
                defName = this.model.getName() + "!" + dN.getAbsName();
            }
            else{
                defName = this.model.getName() + "!" + dN.getAbsName();
            }*/

            defName = parserHelp.getEscapeSheetName(this.model.getName()) + "!" + dN.getAbsName();

            defName = defName ? this.model.workbook.findDefinesNames(defName,this.model.getId()) : null;

			return selectionSize || defName || cellName;
		};

		WorksheetView.prototype.getSelectionRangeValue = function () {
			// ToDo проблема с выбором целого столбца/строки
			var ar = this.activeRange.clone(true);
//			ar.r1Abs = ar.c1Abs = ar.r2Abs = ar.c2Abs = true;
			var sName = ar.getAbsName();
			return (c_oAscSelectionDialogType.FormatTable === this.selectionDialogType) ? sName :
				parserHelp.get3DRef(this.model.getName(), sName);
		};

		WorksheetView.prototype.getSelectionInfo = function (bExt) {
			return this.objectRender.selectedGraphicObjectsExists() ?
				this._getSelectionInfoObject(bExt) : this._getSelectionInfoCell(bExt);
		};

		WorksheetView.prototype._getSelectionInfoCell = function (bExt) {
			var c_opt = this.settings.cells;
			var activeCell = this.activeRange;
			var mc = this.model.getMergedByCell(activeCell.startRow, activeCell.startCol);
			var c1 = mc ? mc.c1 : activeCell.startCol;
			var r1 = mc ? mc.r1 : activeCell.startRow;
			var c = this._getVisibleCell(c1, r1);

			if (c === undefined) {
				asc_debug("log", "Unknown cell's info: col = " + c1 + ", row = " + r1);
				return {};
			}

			var fc = c.getFontcolor();
			var bg = c.getFill();
			var fa = c.getFontAlign().toLowerCase();
			var cellType = c.getType();
			var isNumberFormat = (!cellType || CellValueType.Number === cellType);

			var cell_info = new asc_CCellInfo();
			cell_info.name =  this._getColumnTitle(c1) + this._getRowTitle(r1);
			cell_info.formula = c.getFormula();

			cell_info.text = c.getValueForEdit();

			cell_info.halign = c.getAlignHorizontalByValue().toLowerCase();
			cell_info.valign = c.getAlignVertical().toLowerCase();
			
			var tablePartsOptions = this.autoFilters.searchRangeInTableParts(activeCell);
			var curTablePart = tablePartsOptions >= 0 ? this.model.TableParts[tablePartsOptions] : null;
			
			cell_info.autoFilterInfo = new asc_CAutoFilterInfo();
			cell_info.autoFilterInfo.tableStyleName = curTablePart ? curTablePart.TableStyleInfo.Name : null;
			cell_info.autoFilterInfo.tableName = curTablePart ? curTablePart.DisplayName : null;
			if (-2 === tablePartsOptions) {
				cell_info.autoFilterInfo.isAutoFilter = null;
				cell_info.autoFilterInfo.isApplyAutoFilter = false;
			} else {
				var checkApplyFilterOrSort = this.autoFilters.checkApplyFilterOrSort(tablePartsOptions);
				cell_info.autoFilterInfo.isAutoFilter = checkApplyFilterOrSort.isAutoFilter;
				cell_info.autoFilterInfo.isApplyAutoFilter = checkApplyFilterOrSort.isFilterColumns;
			}
			
			cell_info.styleName = c.getStyleName();
			cell_info.angle = c.getAngle();

			cell_info.flags = new asc_CCellFlag();
			cell_info.flags.shrinkToFit = c.getShrinkToFit();
			cell_info.flags.wrapText = c.getWrap();

			cell_info.flags.selectionType = this.activeRange.type;

			cell_info.flags.lockText = ("" !== cell_info.text && (isNumberFormat || "" !== cell_info.formula));

			cell_info.font = new asc_CFont();
			cell_info.font.name = c.getFontname();
			cell_info.font.size = c.getFontsize();
			cell_info.font.bold = c.getBold();
			cell_info.font.italic = c.getItalic();
			cell_info.font.underline = (Asc.EUnderline.underlineNone !== c.getUnderline()); // ToDo убрать, когда будет реализовано двойное подчеркивание
			cell_info.font.strikeout = c.getStrikeout();
			cell_info.font.subscript = fa === "subscript";
			cell_info.font.superscript = fa === "superscript";
			cell_info.font.color = (fc ? asc_obj2Color(fc) : new asc_CColor(c_opt.defaultState.color));

			cell_info.fill = new asc_CFill((null != bg) ? asc_obj2Color(bg) : bg);

			cell_info.numFormatType = c.getNumFormatType();

			// Получаем гиперссылку
			var ar = this.activeRange.clone();
			var range = this.model.getRange3(ar.r1, ar.c1, ar.r2, ar.c2);
			var hyperlink = range.getHyperlink();
			var oHyperlink;
			if (null !== hyperlink) {
				// Гиперлинк
				oHyperlink = new asc_CHyperlink(hyperlink);
				oHyperlink.asc_setText(cell_info.text);
				cell_info.hyperlink = oHyperlink;
			} else
				cell_info.hyperlink = null;

			cell_info.comments = this.cellCommentator.getComments(ar.c1, ar.r1);
			cell_info.flags.merge = null !== range.hasMerged();

			if (bExt) {
				cell_info.innertext = c.getValue();
				cell_info.numFormat = c.getNumFormatStr();
			}

      var sheetId = this.model.getId();
      // Пересчет для входящих ячеек в добавленные строки/столбцы
      var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
      if (false === isIntersection) {
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
          sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

        if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
          c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
          // Уже ячейку кто-то редактирует
          cell_info.isLocked = true;
        }
      }
			
			return cell_info;
		};

		WorksheetView.prototype._getSelectionInfoObject = function () {
			var objectInfo = new asc_CCellInfo();

			objectInfo.flags = new asc_CCellFlag();
			var graphicObjects = this.objectRender.getSelectedGraphicObjects();
			if (graphicObjects.length)
				objectInfo.flags.selectionType = this.objectRender.getGraphicSelectionType(graphicObjects[0].Id);

			var textPr = this.objectRender.controller.getParagraphTextPr();
            var theme = this.objectRender.controller.getTheme();
            if(textPr && theme && theme.themeElements && theme.themeElements.fontScheme)
            {
                if(textPr.FontFamily)
                {
                    textPr.FontFamily.Name =  theme.themeElements.fontScheme.checkFont(textPr.FontFamily.Name);
                }
                if(textPr.RFonts)
                {
                    if(textPr.RFonts.Ascii)
                        textPr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(textPr.RFonts.Ascii.Name);
                    if(textPr.RFonts.EastAsia)
                        textPr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(textPr.RFonts.EastAsia.Name);
                    if(textPr.RFonts.HAnsi)
                        textPr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(textPr.RFonts.HAnsi.Name);
                    if(textPr.RFonts.CS)
                        textPr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(textPr.RFonts.CS.Name);
                }
            }

			var paraPr = this.objectRender.controller.getParagraphParaPr();
			if (textPr && paraPr) {
				objectInfo.text = this.objectRender.controller.Get_SelectedText(true);

				var horAlign = "center";
				switch (paraPr.Jc) {
					case align_Left		: horAlign = "left";	break;
					case align_Right	: horAlign = "right";	break;
					case align_Center	: horAlign = "center";	break;
					case align_Justify	: horAlign = "justify";	break;
				}
				var vertAlign = "center";
                var shape_props = this.objectRender.controller.getDrawingProps().shapeProps;
				var angle = null;
                if(shape_props)
                {
                    switch (shape_props.verticalTextAlign) {
                        case VERTICAL_ANCHOR_TYPE_BOTTOM:			vertAlign = "bottom"; break;
                        case VERTICAL_ANCHOR_TYPE_CENTER:			vertAlign = "center"; break;

                        case VERTICAL_ANCHOR_TYPE_TOP:
                        case VERTICAL_ANCHOR_TYPE_DISTRIBUTED:
                        case VERTICAL_ANCHOR_TYPE_JUSTIFIED:		vertAlign = "top"; break;
                    }
                    switch (shape_props.vert) {
                        case nVertTTvert:			angle = 90; break;
                        case nVertTTvert270:		angle = 270; break;
                        default:		            angle = 0; break;
                    }

                }

				objectInfo.halign = horAlign;
				objectInfo.valign = vertAlign;
				objectInfo.angle = angle;

				objectInfo.font = new asc_CFont();
				objectInfo.font.name = textPr.FontFamily ? textPr.FontFamily.Name : "";
				objectInfo.font.size = textPr.FontSize;
				objectInfo.font.bold = textPr.Bold;
				objectInfo.font.italic = textPr.Italic;
				objectInfo.font.underline = textPr.Underline;
				objectInfo.font.strikeout = textPr.Strikeout;
				objectInfo.font.subscript = textPr.VertAlign == vertalign_SubScript;
				objectInfo.font.superscript = textPr.VertAlign == vertalign_SuperScript;
				if (textPr.Color)
					objectInfo.font.color = CreateAscColorCustom(textPr.Color.r, textPr.Color.g, textPr.Color.b);

				var shapeHyperlink = this.objectRender.controller.getHyperlinkInfo();
				if (shapeHyperlink && (shapeHyperlink instanceof ParaHyperlink)) {

					var hyperlink = new Hyperlink();
					hyperlink.Tooltip = shapeHyperlink.ToolTip;

					var spl = shapeHyperlink.Value.split("!");
					if (spl.length === 2) {
						hyperlink.setLocation(shapeHyperlink.Value);
					} else
						hyperlink.Hyperlink = shapeHyperlink.Value;

					objectInfo.hyperlink = new asc_CHyperlink(hyperlink);
                    objectInfo.hyperlink.asc_setText(shapeHyperlink.Get_SelectedText(true, true));
				}
			} else
            {
				// Может быть не задано текста, поэтому выставим по умолчанию
				objectInfo.font = new asc_CFont();
				objectInfo.font.name = this.model.getDefaultFontName();
				objectInfo.font.size = this.model.getDefaultFontSize();
			}

			// Заливка не нужна как таковая
			objectInfo.fill = new asc_CFill(null);

			// ToDo locks

			return objectInfo;
		};

		// Получаем координаты активной ячейки
		WorksheetView.prototype.getActiveCellCoord = function () {
			var offsetX = 0, offsetY = 0;
			var vrCol = this.visibleRange.c1, vrRow = this.visibleRange.r1;
			if (this.topLeftFrozenCell) {
				var offsetFrozen = this.getFrozenPaneOffset();
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				if (this.activeRange.startCol >= cFrozen)
					offsetX = offsetFrozen.offsetX;
				else
					vrCol = 0;

				if (this.activeRange.startRow >= rFrozen)
					offsetY = offsetFrozen.offsetY;
				else
					vrRow = 0;
			}

			var xL = this.getCellLeft(this.activeRange.startCol, /*pt*/1);
			var yL = this.getCellTop(this.activeRange.startRow, /*pt*/1);
			// Пересчитываем X и Y относительно видимой области
			xL -= (this.cols[vrCol].left - this.cellsLeft);
			yL -= (this.rows[vrRow].top - this.cellsTop);
			// Пересчитываем X и Y относительно закрепленной области
			xL += offsetX;
			yL += offsetY;

			// Пересчитываем в px
			xL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() );
			yL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() );

			var width = this.getColumnWidth (this.activeRange.startCol, /*px*/0);
			var height = this.getRowHeight(this.activeRange.startRow, /*px*/0);

      if (AscBrowser.isRetina) {
        xL >>= 1;
        yL >>= 1;
        width >>= 1;
        height >>= 1;
      }

			return new asc_CRect (xL, yL, width, height);
		};

		WorksheetView.prototype._checkSelectionShape = function () {
			var isSelectOnShape = this.isSelectOnShape;
			if (this.isSelectOnShape) {
				this.isSelectOnShape = false;
				this.objectRender.unselectDrawingObjects();
			}
			return isSelectOnShape;
		};

		WorksheetView.prototype._updateSelectionNameAndInfo = function () {
			this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
			this.handlers.trigger("selectionChanged", this.getSelectionInfo());
			this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
		};

		WorksheetView.prototype.getSelectionShape = function () {
			return this.isSelectOnShape;
		};
		WorksheetView.prototype.setSelectionShape = function (isSelectOnShape) {
			this.isSelectOnShape = isSelectOnShape;
			// отправляем евент для получения свойств картинки, шейпа или группы
            this.model.workbook.handlers.trigger("asc_onHideComment");
			this._updateSelectionNameAndInfo();
		};
		WorksheetView.prototype.getActiveRangeObj = function (){
			return this.activeRange.clone(true);
		};
		WorksheetView.prototype.setSelection = function (range, validRange) {
			// Проверка на валидность range.
			if (validRange && (range.c2 >= this.nColsCount || range.r2 >= this.nRowsCount)) {
				if (range.c2 >= this.nColsCount)
					this.expandColsOnScroll(false, true, range.c2 + 1);
				if (range.r2 >= this.nRowsCount)
					this.expandRowsOnScroll(false, true, range.r2 + 1);
			}

			this.cleanSelection();
			// Проверка на всякий случай
			if (!(range instanceof asc_Range)) {
				range = new asc_Range(range.c1, range.r1, range.c2, range.r2);
			}
			if(gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2)
			{
				range = range.clone();
				if(gc_nMaxCol0 === range.c2)
					range.c2 = this.cols.length - 1;
				if(gc_nMaxRow0 === range.r2)
					range.r2 = this.rows.length - 1;
			}

			this.activeRange = new asc_ActiveRange(range);
			this.activeRange.type = c_oAscSelectionType.RangeCells;
			this.activeRange.startCol = range.c1;
			this.activeRange.startRow = range.r1;

			// Нормализуем range
			this.activeRange.normalize();
			this._drawSelection();

			this._updateSelectionNameAndInfo();
			return this._calcActiveCellOffset();
		};

		WorksheetView.prototype.setSelectionUndoRedo = function (range, validRange) {
			var ar = (range instanceof asc_ActiveRange) ? range.clone() : new asc_ActiveRange(range);

			// Проверка на валидность range.
			if (validRange && (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount)) {
				if (ar.c2 >= this.nColsCount)
					this.expandColsOnScroll(false, true, ar.c2 + 1);
				if (ar.r2 >= this.nRowsCount)
					this.expandRowsOnScroll(false, true, ar.r2 + 1);
			}
			var oRes = null;
			var type = ar.type;
			if (type == c_oAscSelectionType.RangeCells || type == c_oAscSelectionType.RangeCol ||
				type == c_oAscSelectionType.RangeRow || type == c_oAscSelectionType.RangeMax) {
				this.cleanSelection();
				this.activeRange = ar;
				this._drawSelection();

				this._updateSelectionNameAndInfo();
				oRes = this._calcActiveCellOffset();
			}
			return oRes;
		};

		WorksheetView.prototype.changeSelectionStartPoint = function (x, y, isCoord, isSelectMode) {
			var ar = ((this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange).clone();
			var ret = {};
			var isChangeSelectionShape = false;

			this.cleanSelection();

			var commentList = this.cellCommentator.getCommentsXY(x, y);
			if (!commentList.length) {
				this.model.workbook.handlers.trigger("asc_onHideComment");
				this.cellCommentator.resetLastSelectedId();
			}

			if (isCoord) {
				// move active range to coordinates x,y
				this._moveActiveCellToXY(x, y);
				isChangeSelectionShape = this._checkSelectionShape();
			} else {
				// move active range to offset x,y
				this._moveActiveCellToOffset(x, y);
                var x1 = this.getCellLeftRelative(this.activeRange.c1, /*pt*/0 ),
                    y1 = this.getCellTopRelative(this.activeRange.r1, /*pt*/0);
				if( isCoord )
                    ret = this._calcActiveRangeOffsetIsCoord(x1,y1);
                else
                    ret = this._calcActiveRangeOffset();

			}

			if (this.isSelectionDialogMode) {
				if (!this.activeRange.isEqual(ar)) {
					// Смена диапазона
					this.handlers.trigger("selectionRangeChanged", this.getSelectionRangeValue());
				}
			} else if (!this.isCellEditMode) {
				if (isChangeSelectionShape || (!isCoord && !this.activeRange.isEqual(ar)) ||
					(isCoord && (this.activeRange.startCol !== ar.startCol || this.activeRange.startRow !== ar.startRow))) {
					this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
					if (!isSelectMode) {
						this.handlers.trigger("selectionChanged", this.getSelectionInfo());
						this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
					}
				}
			}

			if (!isChangeSelectionShape)
				this._drawSelection();

			//ToDo this.drawDepCells();

			return ret;
		};

		// Смена селекта по нажатию правой кнопки мыши
		WorksheetView.prototype.changeSelectionStartPointRightClick = function (x, y) {
			var ar = this.activeRange;
			var isChangeSelectionShape = this._checkSelectionShape();
			this.model.workbook.handlers.trigger("asc_onHideComment");

			// Получаем координаты левого верхнего угла выделения
			var xL = this.getCellLeft(ar.c1, /*pt*/1);
			var yL = this.getCellTop(ar.r1, /*pt*/1);
			// Получаем координаты правого нижнего угла выделения
			var xR = this.getCellLeft(ar.c2, /*pt*/1) + this.cols[ar.c2].width;
			var yR = this.getCellTop(ar.r2, /*pt*/1) + this.rows[ar.r2].height;

			// Пересчитываем координаты
			var _x = x * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			var _y = y * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

			var isInSelection = false;
			var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft,
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
			var offsetFrozen = this.getFrozenPaneOffset();
			offsetX -= offsetFrozen.offsetX;
			offsetY -= offsetFrozen.offsetY;

			// Проверяем попали ли мы в выделение
			if ((_x < this.cellsLeft || _y < this.cellsTop) && c_oAscSelectionType.RangeMax === ar.type) {
				// Выделено все
				isInSelection = true;
			} else if (_x > this.cellsLeft && _y > this.cellsTop) {
				// Пересчитываем X и Y относительно видимой области
				_x += offsetX;
				_y += offsetY;

				if (xL <= _x && _x <= xR && yL <= _y && _y <= yR) {
					// Попали в выделение ячеек
					isInSelection = true;
				}
			} else if (_x <= this.cellsLeft && _y >= this.cellsTop && c_oAscSelectionType.RangeRow === ar.type) {
				// Выделены строки
				// Пересчитываем Y относительно видимой области
				_y += offsetY;

				if (yL <= _y && _y <= yR) {
					// Попали в выделение ячеек
					isInSelection = true;
				}
			} else if (_y <= this.cellsTop && _x >= this.cellsLeft && c_oAscSelectionType.RangeCol === ar.type) {
				// Выделены столбцы
				// Пересчитываем X относительно видимой области
				_x += offsetX;
				if (xL <= _x && _x <= xR) {
					// Попали в выделение ячеек
					isInSelection = true;
				}
			}

			if (!isInSelection) {
				// Не попали в выделение (меняем первую точку)
				this.cleanSelection();
				this._moveActiveCellToXY(x, y);
				this._drawSelection();

				this._updateSelectionNameAndInfo();
				return false;
			} else if (isChangeSelectionShape) {
				// Попали в выделение, но были в объекте
				this.cleanSelection();
				this._drawSelection();

				this._updateSelectionNameAndInfo();
			}

			return true;
		};

		/**
		 *
		 * @param x - координата или прибавка к column
		 * @param y - координата или прибавка к row
		 * @param isCoord - выделение с помощью мышки (true) или с клавиатуры (false)
		 * @param isSelectMode - при выделении с помощью мышки, не нужно отправлять эвенты о смене выделения и информации
		 * @returns {*}
		 */
		WorksheetView.prototype.changeSelectionEndPoint = function (x, y, isCoord, isSelectMode) {
			var isChangeSelectionShape = false;
			if (isCoord)
				isChangeSelectionShape = this._checkSelectionShape();
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;

			var newRange = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
			var isEqual = newRange.isEqual(ar);
			if (isEqual && !isCoord) {
				// При движении стрелками можем попасть на замерженную ячейку
			}
			if (!isEqual || isChangeSelectionShape) {
				this.cleanSelection();
				ar.assign2(newRange);
				this._drawSelection();
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
			}

			this.model.workbook.handlers.trigger("asc_onHideComment");

            return isCoord ? this._calcActiveRangeOffsetIsCoord( x, y ) :
                             this._calcActiveRangeOffsetIsCoord( this.getCellLeftRelative(x<0?this.activeRange.c1:this.activeRange.c2, /*pt*/0 ),
                                                                 this.getCellTopRelative(y<0?this.activeRange.r1:this.activeRange.r2, /*pt*/0) );
		};

		// Окончание выделения
		WorksheetView.prototype.changeSelectionDone = function () {
			if (this.stateFormatPainter)
				this.applyFormatPainter();
		};

		// Обработка движения в выделенной области
		WorksheetView.prototype.changeSelectionActivePoint = function (dc, dr) {
			var ret;
			var ar = this.activeRange;
			var mc = this.model.getMergedByCell (ar.r1, ar.c1);

			// Если в выделенной области только одна ячейка, то просто сдвигаемся
			if (ar.c1 === ar.c2 && ar.r1 === ar.r2 || mc && ar.isEqual(mc))
				return this.changeSelectionStartPoint(dc, dr, /*isCoord*/false, /*isSelectMode*/false);

			// Очищаем выделение
			this.cleanSelection();
			// Двигаемся по выделенной области
			this._moveActivePointInSelection(dc, dr);
			// Перерисовываем
			this._drawSelection();

			// Смотрим, ушли ли мы за границу видимой области
			ret = this._calcActiveCellOffset();

			// Эвент обновления
			this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
			this.handlers.trigger("selectionChanged", this.getSelectionInfo());

			return ret;
		};


		// ----- Changing cells -----

		WorksheetView.prototype.applyFormatPainter = function () {
			var t = this;
			var from = t.copyActiveRange.getAllRange(), to = t.activeRange.getAllRange();
			var oTmpRange = this._getRange(0, 0, 0, 0);
			var onApplyFormatPainterCallback = function (isSuccess) {
				// Очищаем выделение
				t.cleanSelection();

				if (true === isSuccess)
					oTmpRange.promoteFromTo(from, to);

				t.expandColsOnScroll(false, true, to.c2 + 1);
				t.expandRowsOnScroll(false, true, to.r2 + 1);

				// Сбрасываем параметры
				t._updateCellsRange(to, /*canChangeColWidth*/c_oAscCanChangeColWidth.none, /*lockDraw*/true);
				if (c_oAscFormatPainterState.kMultiple !== t.stateFormatPainter)
					t.formatPainter();
				// Перерисовываем
				t._recalculateAfterUpdate([to]);
			};

			var result = oTmpRange.preparePromoteFromTo(from, to);
			if (!result) {
				// ToDo вывести ошибку
				onApplyFormatPainterCallback(false);
				return;
			}

			this._isLockedCells(to, null, onApplyFormatPainterCallback);
		};
		WorksheetView.prototype.formatPainter = function (stateFormatPainter) {
			// Если передали состояние, то выставляем его. Если нет - то меняем на противоположное.
			this.stateFormatPainter = (null != stateFormatPainter) ? stateFormatPainter :
				((c_oAscFormatPainterState.kOff !== this.stateFormatPainter) ? c_oAscFormatPainterState.kOff :
					c_oAscFormatPainterState.kOn);

			if (this.stateFormatPainter) {
				this.copyActiveRange = this.activeRange.clone(true);
				this._drawFormatPainterRange();
			} else {
				this.cleanSelection();
				this.copyActiveRange = null;
				this._drawSelection();
				this.handlers.trigger("onStopFormatPainter");
			}
		};

		/* Функция для работы автозаполнения (selection). (x, y) - координаты точки мыши на области */
		WorksheetView.prototype.changeSelectionFillHandle = function (x, y) {
			// Возвращаемый результат
			var ret = null;
			// Если мы только первый раз попали сюда, то копируем выделенную область
			if (null === this.activeFillHandle) {
				this.activeFillHandle = this.activeRange.clone(true);
				// Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
				this.activeFillHandle.normalize();
				return ret;
			}

			// Пересчитываем координаты
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

			// Очищаем выделение, будем рисовать заново
			this.cleanSelection();
			// Копируем выделенную область
			var ar = this.activeRange.clone(true);
			// Получаем координаты левого верхнего угла выделения
			var xL = this.getCellLeft(ar.c1, /*pt*/1);
			var yL = this.getCellTop(ar.r1, /*pt*/1);
			// Получаем координаты правого нижнего угла выделения
			var xR = this.getCellLeft(ar.c2, /*pt*/1) + this.cols[ar.c2].width;
			var yR = this.getCellTop(ar.r2, /*pt*/1) + this.rows[ar.r2].height;

			// range для пересчета видимой области
			var activeFillHandleCopy;

			// Колонка по X и строка по Y
			var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/true).col;
			var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dX*/true).row;
			// Колонка по X и строка по Y (без половинчатого счета). Для сдвига видимой области
			var colByXNoDX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
			var rowByYNoDY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dX*/false).row;
			// Сдвиг в столбцах и строках от крайней точки
			var dCol;
			var dRow;

			// Пересчитываем X и Y относительно видимой области
			x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
			y += (this.rows[this.visibleRange.r1].top - this.cellsTop);

			// Вычисляем расстояние от (x, y) до (xL, yL)
			var dXL = x - xL;
			var dYL = y - yL;
			// Вычисляем расстояние от (x, y) до (xR, yR)
			var dXR = x - xR;
			var dYR = y - yR;
			var dXRMod;
			var dYRMod;

			// Определяем область попадания и точку
			/*
					(1)					(2)					(3)

			 	------------|-----------------------|------------
							|						|
			 		(4)		|			(5)			|		(6)
							|						|
			 	------------|-----------------------|------------

			 		(7)					(8)					(9)
			*/

			// Область точки (x, y)
			var _tmpArea = 0;
			if (dXR <= 0){
				// Области (1), (2), (4), (5), (7), (8)
				if (dXL <= 0){
					// Области (1), (4), (7)
					if (dYR <= 0) {
						// Области (1), (4)
						if (dYL <= 0) {
							// Область (1)
							_tmpArea = 1;
						}
						else {
							// Область (4)
							_tmpArea = 4;
						}
					}
					else {
						// Область (7)
						_tmpArea = 7;
					}
				}
				else {
					// Области (2), (5), (8)
					if (dYR <= 0) {
						// Области (2), (5)
						if (dYL <= 0) {
							// Область (2)
							_tmpArea = 2;
						}
						else {
							// Область (5)
							_tmpArea = 5;
						}
					}
					else {
						// Область (3)
						_tmpArea = 8;
					}
				}
			}
			else {
				// Области (3), (6), (9)
				if (dYR <= 0){
					// Области (3), (6)
					if (dYL <= 0){
						// Область (3)
						_tmpArea = 3;
					}
					else {
						// Область (6)
						_tmpArea = 6;
					}
				}
				else {
					// Область (9)
					_tmpArea = 9;
				}
			}

			// Проверяем, в каком направлении движение
			switch (_tmpArea){
				case 2:
				case 8:
					// Двигаемся по вертикали.
					this.fillHandleDirection = 1;
					break;
				case 4:
				case 6:
					// Двигаемся по горизонтали.
					this.fillHandleDirection = 0;
					break;
				case 1:
					// Сравниваем расстояния от точки до левого верхнего угла выделения
					dXRMod = Math.abs(x - xL);
					dYRMod = Math.abs(y - yL);
					// Сдвиги по столбцам и строкам
					dCol = Math.abs(colByX - ar.c1);
					dRow = Math.abs(rowByY - ar.r1);
					// Определим направление позднее
					this.fillHandleDirection = -1;
					break;
				case 3:
					// Сравниваем расстояния от точки до правого верхнего угла выделения
					dXRMod = Math.abs(x - xR);
					dYRMod = Math.abs(y - yL);
					// Сдвиги по столбцам и строкам
					dCol = Math.abs(colByX - ar.c2);
					dRow = Math.abs(rowByY - ar.r1);
					// Определим направление позднее
					this.fillHandleDirection = -1;
					break;
				case 7:
					// Сравниваем расстояния от точки до левого нижнего угла выделения
					dXRMod = Math.abs(x - xL);
					dYRMod = Math.abs(y - yR);
					// Сдвиги по столбцам и строкам
					dCol = Math.abs(colByX - ar.c1);
					dRow = Math.abs(rowByY - ar.r2);
					// Определим направление позднее
					this.fillHandleDirection = -1;
					break;
				case 5:
				case 9:
					// Сравниваем расстояния от точки до правого нижнего угла выделения
					dXRMod = Math.abs(dXR);
					dYRMod = Math.abs(dYR);
					// Сдвиги по столбцам и строкам
					dCol = Math.abs(colByX - ar.c2);
					dRow = Math.abs(rowByY - ar.r2);
					// Определим направление позднее
					this.fillHandleDirection = -1;
					break;
			}

			//console.log(_tmpArea);

			// Возможно еще не определили направление
			if (-1 === this.fillHandleDirection) {
				// Проверим сдвиги по столбцам и строкам, если не поможет, то рассчитываем по расстоянию
				if (0 === dCol && 0 !== dRow) {
					// Двигаемся по вертикали.
					this.fillHandleDirection = 1;
				}
				else if (0 !== dCol && 0 === dRow) {
					// Двигаемся по горизонтали.
					this.fillHandleDirection = 0;
				}
				else if (dXRMod >= dYRMod){
					// Двигаемся по горизонтали.
					this.fillHandleDirection = 0;
				}
				else {
					// Двигаемся по вертикали.
					this.fillHandleDirection = 1;
				}
			}

			// Проверяем, в каком направлении движение
			if (0 === this.fillHandleDirection) {
				// Определяем область попадания и точку
				/*
							|						|
							|						|
					(1)		|			(2)			|		(3)
							|						|
							|						|
				*/
				if (dXR <= 0){
					// Область (1) или (2)
					if (dXL <= 0) {
						// Область (1)
						this.fillHandleArea = 1;
					}
					else {
						// Область (2)
						this.fillHandleArea = 2;
					}
				}
				else {
					// Область (3)
					this.fillHandleArea = 3;
				}

				// Находим колонку для точки
				this.activeFillHandle.c2 = colByX;

				switch(this.fillHandleArea) {
					case 1:
						// Первая точка (xR, yR), вторая точка (x, yL)
						this.activeFillHandle.c1 = ar.c2;
						this.activeFillHandle.r1 = ar.r2;

						this.activeFillHandle.r2 = ar.r1;

						// Когда идем назад, должна быть колонка на 1 больше
						this.activeFillHandle.c2 += 1;
						// Случай, если мы еще не вышли из внутренней области
						if (this.activeFillHandle.c2 == ar.c1)
							this.fillHandleArea = 2;
						break;
					case 2:
						// Первая точка (xR, yR), вторая точка (x, yL)
						this.activeFillHandle.c1 = ar.c2;
						this.activeFillHandle.r1 = ar.r2;

						this.activeFillHandle.r2 = ar.r1;

						// Когда идем назад, должна быть колонка на 1 больше
						this.activeFillHandle.c2 += 1;

						if (this.activeFillHandle.c2 > this.activeFillHandle.c1){
							// Ситуация половинки последнего столбца
							this.activeFillHandle.c1 = ar.c1;
							this.activeFillHandle.r1 = ar.r1;

							this.activeFillHandle.c2 = ar.c1;
							this.activeFillHandle.r2 = ar.r1;
						}
						break;
					case 3:
						// Первая точка (xL, yL), вторая точка (x, yR)
						this.activeFillHandle.c1 = ar.c1;
						this.activeFillHandle.r1 = ar.r1;

						this.activeFillHandle.r2 = ar.r2;
						break;
				}

				// Копируем в range для пересчета видимой области
				activeFillHandleCopy = this.activeFillHandle.clone();
				activeFillHandleCopy.c2 = colByXNoDX;
			}
			else {
				// Определяем область попадания и точку
				/*
									(1)
						____________________________


									(2)

				 		____________________________

				 					(3)
				*/
				if (dYR <= 0){
					// Область (1) или (2)
					if (dYL <= 0) {
						// Область (1)
						this.fillHandleArea = 1;
					}
					else {
						// Область (2)
						this.fillHandleArea = 2;
					}
				}
				else {
					// Область (3)
					this.fillHandleArea = 3;
				}

				// Находим строку для точки
				this.activeFillHandle.r2 = rowByY;

				switch(this.fillHandleArea) {
					case 1:
						// Первая точка (xR, yR), вторая точка (xL, y)
						this.activeFillHandle.c1 = ar.c2;
						this.activeFillHandle.r1 = ar.r2;

						this.activeFillHandle.c2 = ar.c1;

						// Когда идем назад, должна быть строка на 1 больше
						this.activeFillHandle.r2 += 1;
						// Случай, если мы еще не вышли из внутренней области
						if (this.activeFillHandle.r2 == ar.r1)
							this.fillHandleArea = 2;
						break;
					case 2:
						// Первая точка (xR, yR), вторая точка (xL, y)
						this.activeFillHandle.c1 = ar.c2;
						this.activeFillHandle.r1 = ar.r2;

						this.activeFillHandle.c2 = ar.c1;

						// Когда идем назад, должна быть строка на 1 больше
						this.activeFillHandle.r2 += 1;

						if (this.activeFillHandle.r2 > this.activeFillHandle.r1){
							// Ситуация половинки последней строки
							this.activeFillHandle.c1 = ar.c1;
							this.activeFillHandle.r1 = ar.r1;

							this.activeFillHandle.c2 = ar.c1;
							this.activeFillHandle.r2 = ar.r1;
						}
						break;
					case 3:
						// Первая точка (xL, yL), вторая точка (xR, y)
						this.activeFillHandle.c1 = ar.c1;
						this.activeFillHandle.r1 = ar.r1;

						this.activeFillHandle.c2 = ar.c2;
						break;
				}

				// Копируем в range для пересчета видимой области
				activeFillHandleCopy = this.activeFillHandle.clone();
				activeFillHandleCopy.r2 = rowByYNoDY;
			}

			//console.log ("row1: " + this.activeFillHandle.r1 + " col1: " + this.activeFillHandle.c1 + " row2: " + this.activeFillHandle.r2 + " col2: " + this.activeFillHandle.c2);
			// Перерисовываем
			this._drawSelection();

			// Смотрим, ушли ли мы за границу видимой области
			ret = this._calcFillHandleOffset(activeFillHandleCopy);
			this.model.workbook.handlers.trigger("asc_onHideComment");
			
			return ret;
		};

		/* Функция для применения автозаполнения */
		WorksheetView.prototype.applyFillHandle = function (x, y, ctrlPress) {
			var t = this;

			// Текущее выделение (к нему применится автозаполнение)
			var arn = t.activeRange.clone(true);
			arn.normalize();
			var range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);

			// Были ли изменения
			var bIsHaveChanges = false;
			// Вычисляем индекс сдвига
			var nIndex = 0; /*nIndex*/
			if (0 === this.fillHandleDirection){
					// Горизонтальное движение
					nIndex = this.activeFillHandle.c2 - arn.c1;
					if (2 === this.fillHandleArea) {
						// Для внутренности нужно вычесть 1 из значения
						bIsHaveChanges = arn.c2 !== (this.activeFillHandle.c2 - 1);
					}
					else
						bIsHaveChanges = arn.c2 !== this.activeFillHandle.c2;
				}
			else {
					// Вертикальное движение
					nIndex = this.activeFillHandle.r2 - arn.r1;
					if (2 === this.fillHandleArea) {
						// Для внутренности нужно вычесть 1 из значения
						bIsHaveChanges = arn.r2 !== (this.activeFillHandle.r2 - 1);
					}
					else
						bIsHaveChanges = arn.r2 !== this.activeFillHandle.r2;
				}

			// Меняли ли что-то
			if (bIsHaveChanges && (this.activeFillHandle.r1 !== this.activeFillHandle.r2 ||
				this.activeFillHandle.c1 !== this.activeFillHandle.c2)){

				// Диапазон ячеек, который мы будем менять
				var changedRange = this.activeRange.clone(true);

				// Очищаем выделение
				this.cleanSelection();
				if (2 === this.fillHandleArea) {
					// Мы внутри, будет удаление, нормируем и cбрасываем первую ячейку
					this.activeRange.normalize();
					// Проверяем, удалили ли мы все (если да, то область не меняется)
					if (arn.c1 !== this.activeFillHandle.c2 ||
						arn.r1 !== this.activeFillHandle.r2) {
						// Уменьшаем диапазон (мы удалили не все)
						if (0 === this.fillHandleDirection){
							// Горизонтальное движение (для внутренности необходимо вычесть 1)
							this.activeRange.c2 = this.activeFillHandle.c2 - 1;

							changedRange.c1 = changedRange.c2;
							changedRange.c2 = this.activeFillHandle.c2;
						}
						else {
							// Вертикальное движение (для внутренности необходимо вычесть 1)
							this.activeRange.r2 = this.activeFillHandle.r2 - 1;

							changedRange.r1 = changedRange.r2;
							changedRange.r2 = this.activeFillHandle.r2;
						}
					}
				}
				else {
					// Мы вне выделения. Увеличиваем диапазон
					if (0 === this.fillHandleDirection){
						// Горизонтальное движение
						if (1 === this.fillHandleArea){
							this.activeRange.c1 = this.activeFillHandle.c2;

							changedRange.c2 = changedRange.c1 - 1;
							changedRange.c1 = this.activeFillHandle.c2;
						}
						else {
							this.activeRange.c2 = this.activeFillHandle.c2;

							changedRange.c1 = changedRange.c2 + 1;
							changedRange.c2 = this.activeFillHandle.c2;
						}
					}
					else {
						// Вертикальное движение
						if (1 === this.fillHandleArea){
							this.activeRange.r1 = this.activeFillHandle.r2;

							changedRange.r2 = changedRange.r1 - 1;
							changedRange.r1 = this.activeFillHandle.r2;
						}
						else {
							this.activeRange.r2 = this.activeFillHandle.r2;

							changedRange.r1 = changedRange.r2 + 1;
							changedRange.r2 = this.activeFillHandle.r2;
						}
					}

					// После увеличения, нужно обновить больший range
					arn = this.activeRange.clone(true);
				}

				changedRange.normalize();

				var applyFillHandleCallback = function (res) {
					if (res) {
						// Автозаполняем ячейки
					    if (range.promote(/*bCtrl*/ctrlPress, /*bVertical*/(1 === t.fillHandleDirection), nIndex)) {
					        // Вызываем функцию пересчета для заголовков форматированной таблицы
					        t.autoFilters.renameTableColumn(arn);
					    } else {
							t.handlers.trigger("onErrorEvent", c_oAscError.ID.CannotFillRange, c_oAscError.Level.NoCritical);
							t.activeRange.assign2(range.bbox);
						}
					}

					// Сбрасываем параметры автозаполнения
					t.activeFillHandle = null;
					t.fillHandleDirection = -1;

					// Обновляем выделенные ячейки
					t.isChanged = true;
					t._updateCellsRange(arn);
				};

				// Можно ли применять автозаполнение ?
				this._isLockedCells(changedRange, /*subType*/null, applyFillHandleCallback);
			}
			else {
				// Ничего не менялось, сбрасываем выделение
				this.cleanSelection();
				// Сбрасываем параметры автозаполнения
				this.activeFillHandle = null;
				this.fillHandleDirection = -1;
				// Перерисовываем
				this._drawSelection();
			}
		};

		/* Функция для работы перемещения диапазона (selection). (x, y) - координаты точки мыши на области
			*  ToDo нужно переделать, чтобы moveRange появлялся только после сдвига от текущей ячейки
			*/
		WorksheetView.prototype.changeSelectionMoveRangeHandle = function (x, y, ctrlKey) {
			// Возвращаемый результат
			var ret = null;
			// Пересчитываем координаты
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
			
			//если выделена ячейка заголовка ф/т, меняем выделение с ячейки на столбец ф/т
			//если выделена вся видимая часть форматированной таблицы, но не выделены последние скрытые строчки
			if (null === this.startCellMoveRange)
				this.autoFilters.changeSelectionTablePart(this.activeRange);
			
			var ar = this.activeRange.clone(true);

			// Колонка по X и строка по Y
			var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
			var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;

            if( ar.type == c_oAscSelectionType.RangeRow ){
                colByX = 0;
            }
            if( ar.type == c_oAscSelectionType.RangeCol ){
                rowByY = 0;
            }
            if( ar.type == c_oAscSelectionType.RangeMax ){
                colByX = 0;
                rowByY = 0;
            }

			// Если мы только первый раз попали сюда, то копируем выделенную область
			if (null === this.startCellMoveRange) {
				// Учитываем погрешность (мы должны быть внутри диапазона при старте)
				if (colByX < ar.c1) { colByX = ar.c1; }
				else if (colByX > ar.c2) { colByX = ar.c2; }
				if (rowByY < ar.r1) { rowByY = ar.r1; }
				else if (rowByY > ar.r2) { rowByY = ar.r2; }
				this.startCellMoveRange = new asc_Range(colByX, rowByY, colByX, rowByY);
				this.startCellMoveRange.isChanged = false;	// Флаг, сдвигались ли мы от первоначального диапазона
				return ret;
			}

			// Разница, на сколько мы сдвинулись
			var colDelta = colByX - this.startCellMoveRange.c1;
			var rowDelta = rowByY - this.startCellMoveRange.r1;

			// Проверяем, нужно ли отрисовывать перемещение (сдвигались или нет)
			if (false === this.startCellMoveRange.isChanged && 0 === colDelta && 0 === rowDelta)
				return ret;
			// Выставляем флаг
			this.startCellMoveRange.isChanged = true;

			// Очищаем выделение, будем рисовать заново
			this.cleanSelection();

			this.activeMoveRange = ar;
			// Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
			this.activeMoveRange.normalize();

			// Выставляем
			this.activeMoveRange.c1 += colDelta;
			if (0 > this.activeMoveRange.c1) {
				colDelta -= this.activeMoveRange.c1;
				this.activeMoveRange.c1 = 0;
			}
			this.activeMoveRange.c2 += colDelta;

			this.activeMoveRange.r1 += rowDelta;
			if (0 > this.activeMoveRange.r1) {
				rowDelta -= this.activeMoveRange.r1;
				this.activeMoveRange.r1 = 0;
			}
			this.activeMoveRange.r2 += rowDelta;
			this.activeMoveRange._updateAdditionalData();

			// Увеличиваем, если выходим за область видимости // Critical Bug 17413
			while (!this.cols[this.activeMoveRange.c2]) {
				this.expandColsOnScroll(true);
				this.handlers.trigger("reinitializeScrollX");
			}
			while (!this.rows[this.activeMoveRange.r2]) {
				this.expandRowsOnScroll(true);
				this.handlers.trigger("reinitializeScrollY");
			}

			// Перерисовываем
			this._drawSelection();
            var d = {};
			/*var d = {
				deltaX : this.activeMoveRange.c1 < this.visibleRange.c1 ? this.activeMoveRange.c1-this.visibleRange.c1 :
					this.activeMoveRange.c2>this.visibleRange.c2 ? this.activeMoveRange.c2-this.visibleRange.c2 : 0,
				deltaY : this.activeMoveRange.r1 < this.visibleRange.r1 ? this.activeMoveRange.r1-this.visibleRange.r1 :
					this.activeMoveRange.r2>this.visibleRange.r2 ? this.activeMoveRange.r2-this.visibleRange.r2 : 0
			};
			while ( this._isColDrawnPartially( this.activeMoveRange.c2, this.visibleRange.c1 + d.deltaX) ) {++d.deltaX;}
			while ( this._isRowDrawnPartially( this.activeMoveRange.r2, this.visibleRange.r1 + d.deltaY) ) {++d.deltaY;}*/

            if (y <= this.cellsTop + this.height_2px ){
                d.deltaY = -1;
            }else if ( y >= this.drawingCtx.getHeight() - this.height_2px)
                d.deltaY = 1;

            if (x <= this.cellsLeft + this.width_2px ){
                d.deltaX = -1;
            }else if ( x >= this.drawingCtx.getWidth() - this.width_2px)
                d.deltaX = 1;

			this.model.workbook.handlers.trigger("asc_onHideComment");

            if (this.activeMoveRange.type === c_oAscSelectionType.RangeRow)
                d.deltaX = 0;
            else if (this.activeMoveRange.type === c_oAscSelectionType.RangeCol)
                d.deltaY = 0;
            else if (this.activeMoveRange.type === c_oAscSelectionType.RangeMax) {
                d.deltaX = 0;
                d.deltaY = 0;
            }

			return d;
		};

		WorksheetView.prototype.changeSelectionMoveResizeRangeHandle = function (x, y, targetInfo, editor) {
			// Возвращаемый результат
			if (!targetInfo)
				return null;
			var indexFormulaRange = targetInfo.indexFormulaRange, d = {deltaY:0,deltaX:0}, newFormulaRange = null;
			// Пересчитываем координаты
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
			var ar = 0 == targetInfo.targetArr ? this.arrActiveFormulaRanges[indexFormulaRange].clone(true) :
				this.arrActiveChartsRanges[indexFormulaRange].clone(true);

			// Колонка по X и строка по Y
			var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
			var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;

			// Если мы только первый раз попали сюда, то копируем выделенную область
			if (null === this.startCellMoveResizeRange) {
				if ((targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize)) {
					this.startCellMoveResizeRange = ar.clone(true);
					this.startCellMoveResizeRange2 = new asc_Range(targetInfo.col, targetInfo.row, targetInfo.col, targetInfo.row, true);
				} else {
					this.startCellMoveResizeRange = ar.clone(true);
					if (colByX < ar.c1) { colByX = ar.c1; }
					else if (colByX > ar.c2) { colByX = ar.c2; }
					if (rowByY < ar.r1) { rowByY = ar.r1; }
					else if (rowByY > ar.r2) { rowByY = ar.r2; }
					this.startCellMoveResizeRange2 = new asc_Range(colByX, rowByY, colByX, rowByY);
				}
				return null;
			}

			// Очищаем выделение, будем рисовать заново
			// this.cleanSelection();
			this.overlayCtx.clear();

			if (targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize) {

				if (colByX < this.startCellMoveResizeRange2.c1) {
                    ar.c2 = this.startCellMoveResizeRange2.c1;
					ar.c1 = colByX;
				} else if (colByX > this.startCellMoveResizeRange2.c1) {
                    ar.c1 = this.startCellMoveResizeRange2.c1;
					ar.c2 = colByX;
				} else {
					ar.c1 = this.startCellMoveResizeRange2.c1;
					ar.c2 = this.startCellMoveResizeRange2.c1
				}

				if (rowByY < this.startCellMoveResizeRange2.r1) {
                    ar.r2 = this.startCellMoveResizeRange2.r2;
            	    ar.r1 = rowByY;
				} else if (rowByY > this.startCellMoveResizeRange2.r1) {
                    ar.r1 = this.startCellMoveResizeRange2.r1;
                    ar.r2 = rowByY;
				} else {
                    ar.r1 = this.startCellMoveResizeRange2.r1;
					ar.r2 = this.startCellMoveResizeRange2.r1;
				}

			} else {
				this.startCellMoveResizeRange.normalize();
				var colDelta = this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeRow && this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeMax ? colByX - this.startCellMoveResizeRange2.c1 : 0;
				var rowDelta = this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeCol && this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeMax ? rowByY - this.startCellMoveResizeRange2.r1 : 0;

				ar.c1 = this.startCellMoveResizeRange.c1 + colDelta;
				if (0 > ar.c1) {
					colDelta -= ar.c1;
					ar.c1 = 0;
				}
				ar.c2 = this.startCellMoveResizeRange.c2 + colDelta;

				ar.r1 = this.startCellMoveResizeRange.r1 + rowDelta;
				if (0 > ar.r1) {
					rowDelta -= ar.r1;
					ar.r1 = 0;
				}
				ar.r2 = this.startCellMoveResizeRange.r2 + rowDelta;

			}

            if (y <= this.cellsTop + this.height_2px ){
                d.deltaY = -1;
            }else if ( y >= this.drawingCtx.getHeight() - this.height_2px){
                d.deltaY = 1;
            }

            if (x <= this.cellsLeft + this.width_2px ){
                d.deltaX = -1;
            }else if ( x >= this.drawingCtx.getWidth() - this.width_2px){
                d.deltaX = 1;
            }

            if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeRow){
                d.deltaX = 0;
            }
            else if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeCol){
                d.deltaY = 0;
            }
            else if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeMax) {
                d.deltaX = 0;
                d.deltaY = 0;
            }

			if (0 == targetInfo.targetArr) {
				var _p = this.arrActiveFormulaRanges[indexFormulaRange].cursorePos,
					_l = this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength;
				this.arrActiveFormulaRanges[indexFormulaRange] = ar.clone(true);
				this.arrActiveFormulaRanges[indexFormulaRange].cursorePos = _p;
				this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength = _l;
				newFormulaRange = this.arrActiveFormulaRanges[indexFormulaRange];
			} else {
				this.arrActiveChartsRanges[indexFormulaRange] = ar.clone(true);
				this.moveRangeDrawingObjectTo = ar;
			}
			this._drawSelection();

			if (newFormulaRange)
				editor.changeCellRange(newFormulaRange);

			return d;
		};

		WorksheetView.prototype._cleanSelectionMoveRange = function () {
			// Перерисовываем и сбрасываем параметры
			this.cleanSelection();
			this.activeMoveRange = null;
			this.startCellMoveRange = null;
			this._drawSelection();
		};

		/* Функция для применения перемещения диапазона */
		WorksheetView.prototype.applyMoveRangeHandle = function (ctrlKey) {
			if (null === this.activeMoveRange) {
				// Сбрасываем параметры
				this.startCellMoveRange = null;
				return;
			}

			var arnFrom = this.activeRange.clone(true);
			var arnTo = this.activeMoveRange.clone(true);
			if (arnFrom.isEqual(arnTo)) {
				this._cleanSelectionMoveRange();
				return;
			}

			var resmove = this.model._prepareMoveRange(arnFrom, arnTo);
			if (resmove === -2) {
				this.handlers.trigger("onErrorEvent", c_oAscError.ID.CannotMoveRange, c_oAscError.Level.NoCritical);
				this._cleanSelectionMoveRange();
			} else if (resmove === -1 && this.autoFilters.checkMoveRangeIntoApplyAutoFilter(arnTo)) {
				var t = this;
				this.model.workbook.handlers.trigger("asc_onConfirmAction", c_oAscConfirm.ConfirmReplaceRange,
					function (can) {
						if (can)
							t.moveRangeHandle(arnFrom, arnTo, ctrlKey);
						else
							t._cleanSelectionMoveRange();
					});
			} else
				this.moveRangeHandle(arnFrom, arnTo, ctrlKey);
		};

		WorksheetView.prototype.applyMoveResizeRangeHandle = function (target){
			if( -1 == target.targetArr && !this.startCellMoveResizeRange.isEqual(this.moveRangeDrawingObjectTo) ) {
                this.objectRender.moveRangeDrawingObject( this.startCellMoveResizeRange, this.moveRangeDrawingObjectTo);
            }

			this.startCellMoveResizeRange = null;
			this.startCellMoveResizeRange2 = null;
            this.moveRangeDrawingObjectTo = null;
		};

		WorksheetView.prototype.moveRangeHandle = function (arnFrom, arnTo, copyRange){
			var t = this;
			var onApplyMoveRangeHandleCallback = function (isSuccess) {
				if (false === isSuccess) {
					t._cleanSelectionMoveRange();
					return;
				}
				
				var onApplyMoveAutoFiltersCallback = function(isSuccess)
				{
					if (false === isSuccess) {
						t._cleanSelectionMoveRange();
						return;
					}
					
					// Очищаем выделение
					t.cleanSelection();

					//ToDo t.cleanDepCells();
					History.Create_NewPoint();
					History.SetSelection(arnFrom.clone());
					History.SetSelectionRedo(arnTo.clone());
					History.StartTransaction();
					
					t.autoFilters._preMoveAutoFilters(arnFrom, arnTo, copyRange);
					
					t.model._moveRange(arnFrom, arnTo, copyRange);
					t.cellCommentator.moveRangeComments(arnFrom, arnTo);
					t.objectRender.moveRangeDrawingObject(arnFrom, arnTo);
					
					t.autoFilters._moveAutoFilters(arnTo, arnFrom, null, copyRange, true);
					// Вызываем функцию пересчета для заголовков форматированной таблицы
					t.autoFilters.renameTableColumn(arnFrom);
					t.autoFilters.renameTableColumn(arnTo);
					t.autoFilters.reDrawFilter(arnFrom);

					History.EndTransaction();

					t._updateCellsRange(arnTo, false, true);
					t.activeRange = arnTo.clone(true);
					// Сбрасываем параметры
					t.activeMoveRange = null;
					t.startCellMoveRange = null;
					t._updateCellsRange(arnFrom, false, true);
					// Тут будет отрисовка select-а
					t._recalculateAfterUpdate([arnFrom, arnTo]);

					// Вызовем на всякий случай, т.к. мы можем уже обновиться из-за формул ToDo возможно стоит убрать это в дальнейшем (но нужна переработка формул) - http://bugzserver/show_bug.cgi?id=24505
					t._updateSelectionNameAndInfo();
				};
				
				if(t.autoFilters._searchFiltersInRange(arnFrom))
					t._isLockedAll(onApplyMoveAutoFiltersCallback);
				else
					onApplyMoveAutoFiltersCallback();
			};
			
			if (this.autoFilters.isCheckMoveRange(arnFrom, arnTo))
				this._isLockedCells([arnFrom, arnTo], null, onApplyMoveRangeHandleCallback);
			else
				this._cleanSelectionMoveRange();
		};

		WorksheetView.prototype.emptySelection = function (options) {
			// Удаляем выделенные графичекие объекты
			if (this.objectRender.selectedGraphicObjectsExists())
				this.objectRender.controller.deleteSelectedObjects();
			else
				this.setSelectionInfo("empty", options);
		};

		WorksheetView.prototype.setSelectionInfo = function (prop, val, onlyActive, isLocal) {
			// Проверка глобального лока
			if (this.collaborativeEditing.getGlobalLock())
				return;

			var t = this;
			var checkRange = null;
			var arn = t.activeRange.clone(true);
			if (onlyActive) {
				checkRange = new asc_Range(arn.startCol, arn.startRow, arn.startCol, arn.startRow);
			} else {
				checkRange = arn.getAllRange();
			}

			var onSelectionCallback = function (isSuccess) {
				if (false === isSuccess)
					return;
				var range;
				var canChangeColWidth = c_oAscCanChangeColWidth.none;
				var bIsUpdate = true;

				if (onlyActive) {
					range = t.model.getRange3(arn.startRow, arn.startCol, arn.startRow, arn.startCol);
				} else {
					if (c_oAscSelectionType.RangeMax === arn.type) {
						range = t.model.getRange3(/*arn.r1*/0, /*arn.c1*/0, gc_nMaxRow0, gc_nMaxCol0);
					} else if (c_oAscSelectionType.RangeCol === arn.type) {
						range = t.model.getRange3(/*arn.r1*/0, arn.c1, gc_nMaxRow0, arn.c2);
					} else if (c_oAscSelectionType.RangeRow === arn.type) {
						range = t.model.getRange3(arn.r1, /*arn.c1*/0, arn.r2, gc_nMaxCol0);
					} else {
						range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
					}
				}

				var isLargeRange = t._isLargeRange(range.bbox), callTrigger = false;
				var res;
				var mc, r, c, cell;

				function makeBorder(b) {
					var border = new BorderProp();
					if (b === false) {
						border.setStyle(c_oAscBorderStyles.None);
					} else if (b) {
						if (b.style !== null && b.style !== undefined) {border.setStyle(b.style);}
						if (b.color !== null && b.color !== undefined) {
							if(b.color instanceof asc_CColor)
								border.c = CorrectAscColor(b.color);
						}
					}
					return border;
				}

				History.Create_NewPoint();
				History.StartTransaction();

				switch (prop) {
					case "fn": range.setFontname(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
					case "fs": range.setFontsize(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
					case "b":  range.setBold(val); break;
					case "i":  range.setItalic(val); break;
					case "u":  range.setUnderline(val); break;
					case "s":  range.setStrikeout(val); break;
					case "fa": range.setFontAlign(val); break;
					case "a":  range.setAlignHorizontal(val); break;
					case "va": range.setAlignVertical(val); break;
					case "c":  range.setFontcolor(val); break;
					case "bc": range.setFill((val) ? (val) : null); break; // ToDo можно делать просто отрисовку
					case "wrap":   range.setWrap(val); break;
					case "shrink": range.setShrinkToFit(val); break;
					case "value":  range.setValue(val); break;
					case "format": range.setNumFormat(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
                    case "angle": range.setAngle(val); break;
				    case "rh": range.removeHyperlink(null, true); break;
					case "border":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						// None
						if (val.length < 1) {
							range.setBorder(null);
							break;
						}
						res = new Border();
						// Diagonal
						res.d = makeBorder( val[c_oAscBorderOptions.DiagD] || val[c_oAscBorderOptions.DiagU] );
						res.dd = val[c_oAscBorderOptions.DiagD] ? true : false;
						res.du = val[c_oAscBorderOptions.DiagU] ? true : false;
						// Vertical
						res.l = makeBorder( val[c_oAscBorderOptions.Left] );
						res.iv = makeBorder( val[c_oAscBorderOptions.InnerV] );
						res.r = makeBorder( val[c_oAscBorderOptions.Right] );
						// Horizontal
						res.t = makeBorder( val[c_oAscBorderOptions.Top] );
						res.ih = makeBorder( val[c_oAscBorderOptions.InnerH] );
						res.b = makeBorder( val[c_oAscBorderOptions.Bottom] );
						// Change border
						range.setBorder(res);
						break;
					case "merge":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						switch (val) {
							case c_oAscMergeOptions.MergeCenter:
							case c_oAscMergeOptions.Merge:
								range.merge(val);
								t.cellCommentator.mergeComments(range.getBBox0());
								break;
							case c_oAscMergeOptions.Unmerge:
								range.unmerge();
								break;
							case c_oAscMergeOptions.MergeAcross:
								for (res = arn.r1; res <= arn.r2; ++res) {
									t.model.getRange3(res, arn.c1, res, arn.c2).merge(val);
									cell = new asc_Range(arn.c1, res, arn.c2, res);
									t.cellCommentator.mergeComments(cell);
								}
								break;
						}
						break;

					case "sort":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						t.cellCommentator.sortComments(range.sort(val, arn.startCol));
						break;

					case "empty":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
						lockDraw(t.model.workbook);
						
						// Если нужно удалить автофильтры - удаляем
						if(val === c_oAscCleanOptions.All || val === c_oAscCleanOptions.Text)
							t.autoFilters.isEmptyAutoFilters(arn);
						else if(val === c_oAscCleanOptions.Format)
							t.autoFilters.cleanFormat(arn);
						
						if (val === c_oAscCleanOptions.All) {
							range.cleanAll();
							// Удаляем комментарии
							t.cellCommentator.deleteCommentsRange(arn);
						} else if (val === c_oAscCleanOptions.Text || val === c_oAscCleanOptions.Formula)
							range.cleanText();
						else if (val === c_oAscCleanOptions.Format)
							range.cleanFormat();
						else if (val === c_oAscCleanOptions.Comments)
							t.cellCommentator.deleteCommentsRange(arn);
						else if (val === c_oAscCleanOptions.Hyperlinks)
							range.cleanHyperlinks();

						// Вызываем функцию пересчета для заголовков форматированной таблицы
						t.autoFilters.renameTableColumn(arn);

						/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
						buildRecalc(t.model.workbook);
						unLockDraw(t.model.workbook);
						break;

					case "changeDigNum":
						res = t.cols.slice(arn.c1, arn.c2+1).reduce(function(r,c){r.push(c.charCount);return r;}, []);
						range.shiftNumFormat(val, res);
						canChangeColWidth = c_oAscCanChangeColWidth.numbers;
						break;
					case "changeFontSize":
						mc = t.model.getMergedByCell(arn.startRow, arn.startCol);
						c = mc ? mc.c1 : arn.startCol;
						r = mc ? mc.r1 : arn.startRow;
						cell = t._getVisibleCell(c, r);
						if (undefined !== cell) {
							var oldFontSize = cell.getFontsize();
							var newFontSize = asc_incDecFonSize(val, oldFontSize);
							if (null !== newFontSize) {
								range.setFontsize(newFontSize);
								canChangeColWidth = c_oAscCanChangeColWidth.numbers;
							}
						}
						break;
					case "style":
						range.setCellStyle(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
						break;
					case "paste":
						// Вставляем текст из локального буфера или нет
						isLocal ? t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive) : t._pasteFromGlobalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth);
						bIsUpdate = false;
						break;
					case "hyperlink":
						if (val && val.hyperlinkModel) {
							if (c_oAscHyperlinkType.RangeLink === val.asc_getType()) {
								var hyperlinkRangeTmp = t.model.getRange2(val.asc_getRange ());
								if (null === hyperlinkRangeTmp) {
									bIsUpdate = false;
									break;
								}
							}
							val.hyperlinkModel.Ref = range;
							range.setHyperlink(val.hyperlinkModel);
							// Вставим текст в активную ячейку (а не так, как MSExcel в первую ячейку диапазона)
							mc = t.model.getMergedByCell(arn.startRow, arn.startCol);
							c = mc ? mc.c1 : arn.startCol;
							r = mc ? mc.r1 : arn.startRow;
							if (null !== val.asc_getText()) {
								t.model.getRange3(r, c, r, c).setValue(val.asc_getText());
								// Вызываем функцию пересчета для заголовков форматированной таблицы
								t.autoFilters.renameTableColumn(arn);
							}
							break;
						} else {
							bIsUpdate = false;
							break;
						}

					default:
						bIsUpdate = false;
						break;
				}

				if (bIsUpdate) {
					if (callTrigger) { t.handlers.trigger("slowOperation", false); }
					t.isChanged = true;
					t._updateCellsRange(arn, canChangeColWidth);
				}
				
				if(!(prop === "paste" && !isLocal))
					History.EndTransaction();
			};
			if ("paste" === prop && val.onlyImages !== true) {
				// Для past свой диапазон
				if(isLocal === "binary")
					checkRange = t._pasteFromBinary(val, true);
				else
					checkRange = t._setInfoAfterPaste(val, onlyActive, true);
			}
			if("paste" === prop && val.onlyImages === true)
				onSelectionCallback();
			else
				this._isLockedCells(checkRange, /*subType*/null, onSelectionCallback);
		};
		
		WorksheetView.prototype._pasteFromLocalBuff = function (isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive) {
			var t = this;
			var callTrigger = false;
			if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
			
			lockDraw(t.model.workbook);
			var selectData;
			if(isLocal === 'binary')
				selectData = t._pasteFromBinary(val);
			else
				selectData = t._setInfoAfterPaste(val,onlyActive);
			
			t.autoFilters.renameTableColumn(t.activeRange);
			
			if (!selectData) {
				bIsUpdate = false;
				History.EndTransaction();
				buildRecalc(t.model.workbook);
				unLockDraw(t.model.workbook);
				return;
			}
			t.expandColsOnScroll();
			t.expandRowsOnScroll();
			
			var arrFormula = selectData[1];
			for (var i = 0; i < arrFormula.length; ++i) {//!!!
				var rangeF = arrFormula[i].range;
				var valF = arrFormula[i].val;
				if(rangeF.isOneCell())
					rangeF.setValue(valF, null, true);
				else {
					var oBBox = rangeF.getBBox0();
					t.model._getCell(oBBox.r1, oBBox.c1).setValue(valF, null, true);
				}
			}
			
			buildRecalc(t.model.workbook);
			unLockDraw(t.model.workbook);
			var arn = selectData[0];
			var selectionRange = arn.clone(true);

			//добавляем автофильтры и форматированные таблицы
			if(isLocal === true && val.lStorage && val.lStorage.autoFilters && val.lStorage.autoFilters.length)
			{
				var aFilters = val.lStorage.autoFilters;
				var range;
				for(var aF = 0; aF < aFilters.length; aF++)
				{
					range = t.model.getRange3(aFilters[aF].range.r1 + selectionRange.r1, aFilters[aF].range.c1 + selectionRange.c1, aFilters[aF].range.r2 + selectionRange.r1, aFilters[aF].range.c2 + selectionRange.c1);
					if(aFilters[aF].style)
						range.cleanFormat();
					t.autoFilters.addAutoFilter(aFilters[aF].style, range.bbox, true, true);
					if(!aFilters[aF].autoFilter)
						t.autoFilters.addAutoFilter(null, range.bbox, true, true);
				}
			}
			else if(isLocal === 'binary' && val.TableParts && val.TableParts.length)
			{
				var aFilters = val.TableParts;
				var range;
				var tablePartRange;
				var activeRange = window["Asc"]["editor"].wb.clipboard.activeRange;
				var refInsertBinary = Asc.g_oRangeCache.getAscRange(activeRange);
				var diffRow;
				var diffCol;
				for(var aF = 0; aF < aFilters.length; aF++)
				{
					tablePartRange = aFilters[aF].Ref;
					diffRow = tablePartRange.r1 - refInsertBinary.r1;
					diffCol = tablePartRange.c1 - refInsertBinary.c1;
					range = t.model.getRange3(diffRow + selectionRange.r1, diffCol + selectionRange.c1, diffRow + selectionRange.r1 + (tablePartRange.r2 - tablePartRange.r1), diffCol + selectionRange.c1 + (tablePartRange.c2 - tablePartRange.c1));
					if(aFilters[aF].style)
						range.cleanFormat();
						
					var bWithoutFilter = false;
					if(!aFilters[aF].AutoFilter)
						bWithoutFilter = true;
						
					t.autoFilters.addAutoFilter(aFilters[aF].TableStyleInfo.Name, range.bbox, true, true, bWithoutFilter);
				}
			}
			
			//делаем unmerge ф/т
			var arnToRange = t.activeRange;
			var intersectionRangeWithTableParts = t.autoFilters._intersectionRangeWithTableParts(arnToRange, this.model);
			if(intersectionRangeWithTableParts && intersectionRangeWithTableParts.length)
			{	
				var tablePart;
				for(var i = 0; i < intersectionRangeWithTableParts.length; i++)
				{
					tablePart = intersectionRangeWithTableParts[i];
					this.model.getRange3(tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2).unmerge();
				}
			}

			if (bIsUpdate) {
				if (callTrigger) { t.handlers.trigger("slowOperation", false); }
				t.isChanged = true;
				t._updateCellsRange(arn, canChangeColWidth);
				t._prepareCellTextMetricsCache(arn);
			}

			History.EndTransaction();
			var oSelection = History.GetSelection();
			if(null != oSelection)
			{
				oSelection = oSelection.clone();
				oSelection.assign(selectionRange.c1, selectionRange.r1, selectionRange.c2, selectionRange.r2);
				History.SetSelection(oSelection);
				History.SetSelectionRedo(oSelection);
			}
		};

		WorksheetView.prototype._pasteFromGlobalBuff = function (isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth) {
			var t = this;
			
			//загрузка шрифтов, в случае удачи на callback вставляем текст
			t._loadFonts(val.fontsNew, function () {

				var api = asc["editor"];
				if (val.addImages && val.addImages.length != 0 && !(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor)) 
				{	
					if(val.onlyImages !== true)
						t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth);
					api.wb.clipboard._insertImagesFromHTML(t, val);
				}
				else if(val.addImagesFromWord && val.addImagesFromWord.length != 0 && !(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
				{
					var oObjectsForDownload = GetObjectsForImageDownload(val._aPastedImages);

                    sendImgUrls(api, oObjectsForDownload.aUrls, function (data) {
                        var oImageMap = {};
                        ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);

                        if(val.onlyImages !== true)
                            t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth);
                        api.wb.clipboard._insertImagesFromBinaryWord(t, val, oImageMap);
                    }, true);
				}
				else if(val.onlyImages !== true)
						t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth);
				
				History.EndTransaction();
			});
		};
		
		WorksheetView.prototype._setInfoAfterPaste = function (values,clipboard,isCheckSelection) {
			var t = this;
			var wb = window["Asc"]["editor"].wb;
			var arn = wb && wb.clipboard && wb.clipboard.activeRange ? wb.clipboard.activeRange : t.activeRange.clone(true);
			
			if(!clipboard)
				clipboard = wb && wb.clipboard ? wb.clipboard : null;
			
			var arrFormula = [];
			var numFor = 0;
			var rMax = values.length + values.rowSpanSpCount;
			if(values.rowCount && values.rowCount !== 0 && values.isOneTable)
				rMax = values.rowCount + arn.r1;

			var cMax = values.cellCount + arn.c1;

			var isMultiple = false;
			var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
			var isMergedFirstCell = firstCell.hasMerged();
			var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
			var isOneMerge = false;


			//если вставляем в мерженную ячейку, диапазон которой больше или равен
			if (arn.c2 >= cMax -1 && arn.r2 >= rMax - 1 &&
			    isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
			    cMax - arn.c1 === values[arn.r1][arn.c1][0].colSpan && rMax - arn.r1  === values[arn.r1][arn.c1][0].rowSpan)
			{
				if(!isCheckSelection)
				{
				values[arn.r1][arn.c1][0].colSpan = isMergedFirstCell.c2 -isMergedFirstCell.c1 + 1;
				values[arn.r1][arn.c1][0].rowSpan = isMergedFirstCell.r2 -isMergedFirstCell.r1 + 1;
				}
				isOneMerge = true;
			}
			else if(arn.c2 >= cMax -1 && arn.r2 >= rMax - 1  && values.isOneTable)
			{
				//если область кратная куску вставки
				var widthArea = arn.c2 - arn.c1 + 1;
				var heightArea = arn.r2 - arn.r1 + 1;
				var widthPasteFr = cMax -  arn.c1;
				var heightPasteFr =  rMax -  arn.r1;
				//если кратны, то обрабатываем
				if(widthArea%widthPasteFr === 0 && heightArea%heightPasteFr === 0)
				{
					isMultiple = true;
				}
				else if(firstCell.hasMerged() !== null)//в противном случае ошибка
				{
					if(isCheckSelection)
					{
						return arn;
					}
					else
					{
						this.handlers.trigger ("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
						return;
					}
				}
			}
			else
			{
				//проверка на наличие части объединённой ячейки в области куда осуществляем вставку
				for (var rFirst = arn.r1;rFirst < rMax; ++rFirst) {
					for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
						range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
						var merged = range.hasMerged();
						if(merged)
						{
							if(merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax-1)
							{
								//ошибка в случае если вставка происходит в часть объедененной ячейки
								if(isCheckSelection)
								{
									return arn;
								}
								else
								{
									this.handlers.trigger ("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
									return;
								}
							}
						}
					}
				}
			}
			var rMax2 = rMax;
			var cMax2 = cMax;
			var rMax = values.length;
			var trueArn = t.activeRange;
			if(isCheckSelection)
			{
				var newArr = arn.clone(true);
				newArr.r2 = rMax2 - 1;
				newArr.c2 = cMax2 -1;
				if(isMultiple || isOneMerge)
				{
					newArr.r2 = trueArn.r2;
					newArr.c2 = trueArn.c2;
				}
				return newArr;
			}
			//если не возникает конфликт, делаем unmerge
			rangeUnMerge.unmerge();
			if(!isOneMerge)
			{
				arn.r2 = (rMax2 - 1 > 0) ? (rMax2 - 1) : 0;
				arn.c2 = (cMax2 - 1 > 0) ? (cMax2 - 1) : 0;
			}

			var mergeArr = [];

			var n = 0;
			if(isMultiple)//случай автозаполнения сложных форм
			{
					t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
				var maxARow = heightArea/heightPasteFr;
				var maxACol = widthArea/widthPasteFr;
				var plRow = (rMax2 - arn.r1);
				var plCol = (arn.c2 - arn.c1) + 1;
			}
			else
			{
				var maxARow = 1;
				var maxACol = 1;
				var plRow = 0;
				var plCol = 0;
			}
			if(isMultiple)
			{
				if(values[arn.r1] && values[arn.r1][arn.c1])
				{
					var currentObj = values[arn.r1][arn.c1][0];
					var valFormat = '';
					if(currentObj[0] !== undefined)
						valFormat = currentObj[0].text;
				}
			}
			for (var autoR = 0;autoR < maxARow; ++autoR) {
				for (var autoC = 0;autoC < maxACol; ++autoC) {
					for (var r = arn.r1;r < rMax; ++r) {
						for (var c = arn.c1; c < values[r].length; ++c) {
							if(undefined !== values[r][c])
							{
								var range = t.model.getRange3(r + autoR*plRow, c + autoC*plCol, r + autoR*plRow, c + autoC*plCol);

								var currentObj = values[r][c][0];
								if( currentObj.length === 1 ){
									//if(!isMultiple)
									//{
										var valFormat = currentObj[0].text;
										var nameFormat = false;
									//}
									if( currentObj[0].cellFrom ){
										var offset = range.getCells()[0].getOffset2(currentObj[0].cellFrom),
											assemb,
											_p_ = new parserFormula(currentObj[0].text.substring(1),"",range.worksheet);

										if( _p_.parse() ){
											assemb = _p_.changeOffset(offset).assemble();
											//range.setValue("="+assemb);
											arrFormula[numFor] = {};
											arrFormula[numFor].range = range;
											arrFormula[numFor].val = "=" + assemb;
											numFor++;
										}
									}
									else
										range.setValue(valFormat);
									if(nameFormat)
										range.setNumFormat(nameFormat);
									range.setBold(currentObj[0].format.b);
									range.setItalic(currentObj[0].format.i);
									range.setStrikeout(currentObj[0].format.s);
									if(!isOneMerge && currentObj[0].format && currentObj[0].format.c != null && currentObj[0].format.c != undefined)
										range.setFontcolor(currentObj[0].format.c);
									range.setUnderline(currentObj[0].format.u);
									range.setAlignVertical(currentObj.va);
									range.setFontname(currentObj[0].format.fn);
									range.setFontsize(currentObj[0].format.fs);
								}
								else{
									range.setValue2(currentObj);
									range.setAlignVertical(currentObj.va);
								}

								if(currentObj.length === 1 && currentObj[0].format.fs !== '' && currentObj[0].format.fs !== null && currentObj[0].format.fs !== undefined)
									range.setFontsize(currentObj[0].format.fs);
								if(!isOneMerge)
									range.setAlignHorizontal(currentObj.a);
								var isMerged = false;
								for(var mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
								{
									if(r + 1 + autoR*plRow <= mergeArr[mergeCheck].r2 && r + 1 + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol + 1 <= mergeArr[mergeCheck].c2 && c + 1 + autoC*plCol >= mergeArr[mergeCheck].c1)
										isMerged = true;
								}

								//обработка для мерженных ячеек
								if((currentObj.colSpan > 1 || currentObj.rowSpan > 1) && !isMerged)
								{
									range.setOffsetLast({offsetCol: currentObj.colSpan -1, offsetRow: currentObj.rowSpan -1});
									mergeArr[n] = {
										r1: range.first.row,
										r2: range.last.row,
										c1: range.first.col,
										c2: range.last.col
									};
									n++;
									if(currentObj[0] == undefined)
										range.setValue('');
									range.merge(c_oAscMergeOptions.Merge);
								}
								if(!isOneMerge)
									range.setBorderSrc(currentObj.borders);
								range.setWrap(currentObj.wrap);
								if(currentObj.bc && currentObj.bc.rgb)
									range.setFill(currentObj.bc);
								var link = values[r][c][0].hyperLink;
								if(link)
								{
									var newHyperlink = new Hyperlink();
									if(values[r][c][0].hyperLink.search('#') === 0)
										newHyperlink.setLocation(link.replace('#',''));
									else
										newHyperlink.Hyperlink = link;
									newHyperlink.Ref = range;
									newHyperlink.Tooltip = values[r][c][0].toolTip;
									range.setHyperlink(newHyperlink);
								}
							}
						}
					}
				}
			}
			if(isMultiple)
			{
				arn.r2 = trueArn.r2;
				arn.c2 = trueArn.c2;
			}

			t.isChanged = true;
			t.activeRange.c2 = arn.c2;
			t.activeRange.r2 = arn.r2;
			var arnFor = [];
			arnFor[0] = arn;
			arnFor[1] = arrFormula;
			return arnFor;
		};

		WorksheetView.prototype._pasteFromBinary = function (val,isCheckSelection){
			var t = this;
			var arn = t.activeRange.clone(true);
			var arrFormula = [];
			var numFor = 0;

			var pasteRange = window["Asc"]["editor"].wb.clipboard.activeRange;
			var activeCellsPasteFragment = Asc.g_oRangeCache.getAscRange(pasteRange);
			var rMax = (activeCellsPasteFragment.r2 - activeCellsPasteFragment.r1) + arn.r1 + 1;
			var cMax = (activeCellsPasteFragment.c2 - activeCellsPasteFragment.c1) + arn.c1 + 1;
			
			if(cMax > gc_nMaxCol0)
				cMax = gc_nMaxCol0;	
			if(rMax > gc_nMaxRow0)
				rMax = gc_nMaxRow0;

			var isMultiple = false;
			var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
			var isMergedFirstCell = firstCell.hasMerged();
			var isOneMerge = false;


			var startCell = val.getCell3(activeCellsPasteFragment.r1, activeCellsPasteFragment.c1);
			var isMergedStartCell = startCell.hasMerged();

			var firstValuesCol;
			var firstValuesRow;
			if(isMergedStartCell != null)
			{
				firstValuesCol = isMergedStartCell.c2 - isMergedStartCell.c1;
				firstValuesRow = isMergedStartCell.r2 - isMergedStartCell.r1;
			}
			else
			{
				firstValuesCol = 0;
				firstValuesRow = 0;
			}

			var rowDiff = arn.r1 - activeCellsPasteFragment.r1;
			var colDiff = arn.c1 - activeCellsPasteFragment.c1;
			var newPasteRange = new Asc.Range(arn.c1 - colDiff, arn.r1 - rowDiff, arn.c2 - colDiff, arn.r2 - rowDiff);
			//если вставляем в мерженную ячейку, диапазон которой больше или меньше, но не равен выделенной области
			if (isMergedFirstCell && isMergedFirstCell.isEqual(arn) && cMax - arn.c1 === (firstValuesCol + 1) && rMax - arn.r1  === (firstValuesRow + 1) && !newPasteRange.isEqual(activeCellsPasteFragment))
			{
				isOneMerge = true;
				rMax = arn.r2 + 1;
				cMax = arn.c2 + 1;
			}
			else if(arn.c2 >= cMax -1 && arn.r2 >= rMax - 1)
			{
				//если область кратная куску вставки
				var widthArea = arn.c2 - arn.c1 + 1;
				var heightArea = arn.r2 - arn.r1 + 1;
				var widthPasteFr = cMax -  arn.c1;
				var heightPasteFr =  rMax -  arn.r1;
				//если кратны, то обрабатываем
				if(widthArea%widthPasteFr === 0 && heightArea%heightPasteFr === 0)
				{
					isMultiple = true;
				}
				else if(firstCell.hasMerged() !== null)//в противном случае ошибка
				{
					if(isCheckSelection)
					{
						return arn;
					}
					else
					{
						this.handlers.trigger ("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
						return;
					}
				}
			}
			else
			{
				//проверка на наличие части объединённой ячейки в области куда осуществляем вставку
				for (var rFirst = arn.r1;rFirst < rMax; ++rFirst) {
					for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
						range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
						var merged = range.hasMerged();
						if(merged)
						{
							if(merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax-1)
							{
								//ошибка в случае если вставка происходит в часть объедененной ячейки
								if(isCheckSelection)
								{
									return arn;
								}
								else
								{
									this.handlers.trigger ("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
									return;
								}
							}
						}
					}
				}
			}
			
			var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
			
			var rMax2 = rMax;
			var cMax2 = cMax;
			//var rMax = values.length;
			var trueArn = t.activeRange;
			if(isCheckSelection)
			{
				var newArr = arn.clone(true);
				newArr.r2 = rMax2 - 1;
				newArr.c2 = cMax2 - 1;
				if(isMultiple || isOneMerge)
				{
					newArr.r2 = trueArn.r2;
					newArr.c2 = trueArn.c2;
				}
				return newArr;
			}
			//если не возникает конфликт, делаем unmerge
			rangeUnMerge.unmerge();
			if(!isOneMerge)
			{
				arn.r2 = rMax2 - 1;
				arn.c2 = cMax2 -1;
			}

			var mergeArr = [];

			var n = 0;
			if(isMultiple)//случай автозаполнения сложных форм
			{
				t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
				var maxARow = heightArea/heightPasteFr;
				var maxACol = widthArea/widthPasteFr;
				var plRow = (rMax2 - arn.r1);
				var plCol = (arn.c2 - arn.c1) + 1;
			}
			else
			{
				var maxARow = 1;
				var maxACol = 1;
				var plRow = 0;
				var plCol = 0;
			}

			var newVal;
			var curMerge;
			var nRow, nCol;
			for (var autoR = 0;autoR < maxARow; ++autoR) {
				for (var autoC = 0;autoC < maxACol; ++autoC) {
					for (var r = arn.r1;r < rMax; ++r) {
						for (var c = arn.c1; c < cMax; ++c) {
							var pasteRow = r - arn.r1 + activeCellsPasteFragment.r1;
							var pasteCol = c - arn.c1 + activeCellsPasteFragment.c1;
							newVal = val.getCell3(pasteRow, pasteCol);

							curMerge = newVal.hasMerged();

							if(undefined !== newVal)
							{
								var isMerged = false, mergeCheck;
								
								nRow =  r + autoR*plRow;
								if(nRow > gc_nMaxRow0)
									nRow = gc_nMaxRow0;
								nCol = c + autoC*plCol;
								if(nCol > gc_nMaxCol0)
									nCol = gc_nMaxCol0;
									
								var range = t.model.getRange3(nRow, nCol, nRow, nCol);
								//range может далее изменится в связи с наличием мерженных ячеек, firstRange  - не меняется(ему делаем setValue, как первой ячейке в диапазоне мерженных)
								var firstRange = range.clone();
								
								//****paste comments****
								if(val.aComments && val.aComments.length)
								{
									var comment;
									for(var i = 0; i < val.aComments.length; i++)
									{
										comment = val.aComments[i];
										if (comment.nCol == pasteCol && comment.nRow == pasteRow) {
											var commentData = new asc_CCommentData(comment);
											//change nRow, nCol
											commentData.asc_putCol(c + autoC*plCol);
											commentData.asc_putRow(r + autoR*plRow);
											t.cellCommentator.addComment(commentData, true);
										}
									}
								}

								if(!isOneMerge)
								{
									for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
									{
										if(r + autoR*plRow <= mergeArr[mergeCheck].r2 && r + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol  <= mergeArr[mergeCheck].c2 && c + autoC*plCol >= mergeArr[mergeCheck].c1)
											isMerged = true;
									}
									if(curMerge != null && !isMerged)
									{
										var offsetCol = curMerge.c2 - curMerge.c1;
										if(offsetCol + c + autoC*plCol >= gc_nMaxCol0)
											offsetCol = gc_nMaxCol0 - (c + autoC*plCol);

										var offsetRow = curMerge.r2 - curMerge.r1;
										if(offsetRow + r + autoR*plRow >= gc_nMaxRow0)
											offsetRow = gc_nMaxRow0 - (r + autoR*plRow);
										
										range.setOffsetLast({offsetCol: offsetCol, offsetRow: offsetRow});
										range.merge(c_oAscMergeOptions.Merge);
										mergeArr[n] = {
											r1: curMerge.r1 + arn.r1 - activeCellsPasteFragment.r1 + autoR*plRow,
											r2: curMerge.r2 + arn.r1 - activeCellsPasteFragment.r1 + autoR*plRow,
											c1: curMerge.c1 + arn.c1 - activeCellsPasteFragment.c1 + autoC*plCol,
											c2: curMerge.c2 + arn.c1 - activeCellsPasteFragment.c1 + autoC*plCol
										};
										n++;
									}
								}
								else
								{
									for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
									{
										if(r + autoR*plRow <= mergeArr[mergeCheck].r2 && r + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol  <= mergeArr[mergeCheck].c2 && c + autoC*plCol >= mergeArr[mergeCheck].c1)
											isMerged = true;
									}
									if(!isMerged)
									{
										range.setOffsetLast({offsetCol: (isMergedFirstCell.c2 -isMergedFirstCell.c1), offsetRow: (isMergedFirstCell.r2 -isMergedFirstCell.r1)});
										range.merge(c_oAscMergeOptions.Merge);
										mergeArr[n] = {
											r1: isMergedFirstCell.r1,
											r2: isMergedFirstCell.r2,
											c1: isMergedFirstCell.c1,
											c2: isMergedFirstCell.c2
										};
										n++;
									}
								}
								
								//set style
								var cellStyle = newVal.getStyleName();
								if(cellStyle && !isOneMerge)
									range.setCellStyle(cellStyle);
								
								//add formula
								var numFormula = null;
								var skipFormat = null;
								var noSkipVal = null;
								var value2 = newVal.getValue2();
								for(var nF = 0; nF < value2.length;nF++)
								{
									if(value2[nF] && value2[nF].sId)
									{
										numFormula = nF;
										break;
									}
									else if(value2[nF] && value2[nF].format && value2[nF].format.skip)
										skipFormat = true;
									else if(value2[nF] && value2[nF].format && !value2[nF].format.skip)
										noSkipVal = nF;
								}
								
								
								if(!isOneMerge)//settings for cell(format)
								{
									//format
									var numFormat = newVal.getNumFormat();
									var nameFormat;
									if(numFormat && numFormat.sFormat)
										nameFormat = numFormat.sFormat;
									if(nameFormat)
										range.setNumFormat(nameFormat);
								}
								
								//TODO вместо range где возможно использовать cell
								var cellFrom, cellTo;
								if(value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal!= null))
								{
									if(numFormula == null)
										numFormula = 0;
									var numStyle = 0;
									if(skipFormat != null && noSkipVal!= null)
										numStyle = noSkipVal;
										
									//formula	
									if(newVal.getFormula() && !isOneMerge){
										var offset = range.getCells()[numFormula].getOffset2(value2[numFormula].sId),
											assemb,
											_p_ = new parserFormula(value2[numFormula].sFormula,"",range.worksheet);

										if( _p_.parse() ){
											assemb = _p_.changeOffset(offset).assemble();

											arrFormula[numFor] = {};
											arrFormula[numFor].range = range;
											arrFormula[numFor].val = "=" + assemb;
											numFor++;
										}
									}
									else
									{
										cellFrom = newVal.getCells();
										if(isOneMerge && range && range.bbox)
											cellTo = this._getCell(range.bbox.c1, range.bbox.r1).getCells();
										else
											cellTo = firstRange.getCells();
										
										if(cellFrom && cellTo && cellFrom[0] && cellTo[0])
											cellTo[0].setValueData(cellFrom[0].getValueData());
									}

									if(!isOneMerge)//settings for text
									{
										range.setBold(value2[numStyle].format.b);
										range.setItalic(value2[numStyle].format.i);
										range.setStrikeout(value2[numStyle].format.s);
										if(value2[numStyle].format && null != value2[numStyle].format.c)
											range.setFontcolor(value2[numStyle].format.c);
										range.setUnderline(value2[numStyle].format.u);
										range.setFontname(value2[numStyle].format.fn);
										range.setFontsize(value2[numStyle].format.fs);
									}
								}
								else
									firstRange.setValue2(value2);

								
								if(!isOneMerge)//settings for cell
								{
									//vertical align
									range.setAlignVertical(newVal.getAlignVertical());
									
									//horizontal align
									range.setAlignHorizontal(newVal.getAlignHorizontal());
									
									//borders
									var fullBorders = newVal.getBorderFull();
									if(range.bbox.c2 !== range.bbox.c1 && curMerge && fullBorders)
									{
										//для мерженных ячеек, правая границу
										var endMergeCell = val.getCell3(pasteRow, curMerge.c2);
										var fullBordersEndMergeCell = endMergeCell.getBorderFull();
										if(fullBordersEndMergeCell && fullBordersEndMergeCell.r)
											fullBorders.r = fullBordersEndMergeCell.r;
									}
									range.setBorder(fullBorders);
									

									//fill
									range.setFill(newVal.getFill());

									//wrap
									range.setWrap(newVal.getWrap());

									//angle
									range.setAngle(newVal.getAngle());

									//hyperLink
									var hyperLink =  newVal.getHyperlink();
									if(hyperLink != null)
									{
										hyperLink.Ref = range;
										range.setHyperlink(hyperLink);
									}
								}
								//если замержили range
								c = range.bbox.c2 - autoC*plCol;	
								if(c === cMax)
									r = range.bbox.r2 - autoC*plCol;
							}
						}
					}
				}
			}
			if(isMultiple)
			{
				arn.r2 = trueArn.r2;
				arn.c2 = trueArn.c2;
			}
			
			t.isChanged = true;
			t.activeRange.c2 = arn.c2;
			t.activeRange.r2 = arn.r2;
			var arnFor = [];
			arnFor[0] = arn;
			arnFor[1] = arrFormula;
			return arnFor;
		};

		// Залочена ли панель для закрепления
		WorksheetView.prototype._isLockedFrozenPane = function (callback) {
			var sheetId = this.model.getId();
			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameFrozenPane);

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};

    WorksheetView.prototype._isLockedDefNames = function (callback,defNameId) {
			var sheetId = this.model.getId();
			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null/*c_oAscLockTypeElemSubType.DefinedNames*/, -1, defNameId);

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};

		// Залочен ли весь лист
		WorksheetView.prototype._isLockedAll = function (callback) {
			var sheetId = this.model.getId();
			var subType = c_oAscLockTypeElemSubType.ChangeProperties;
			var ar = this.activeRange;

			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
				sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/true)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};
		// Пересчет для входящих ячеек в добавленные строки/столбцы
		WorksheetView.prototype._recalcRangeByInsertRowsAndColumns = function (sheetId, ar) {
			var isIntersection = false, isIntersectionC1 = true, isIntersectionC2 = true,
				isIntersectionR1 = true, isIntersectionR2 = true;
			do {
				if (isIntersectionC1 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c1))
					ar.c1 += 1;
				else
					isIntersectionC1 = false;

				if (isIntersectionR1 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r1))
					ar.r1 += 1;
				else
					isIntersectionR1 = false;

				if (isIntersectionC2 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c2))
					ar.c2 -= 1;
				else
					isIntersectionC2 = false;

				if (isIntersectionR2 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r2))
					ar.r2 -= 1;
				else
					isIntersectionR2 = false;


				if (ar.c1 > ar.c2 || ar.r1 > ar.r2) {
					isIntersection = true;
					break;
				}
			}
			while (isIntersectionC1 || isIntersectionC2 || isIntersectionR1 || isIntersectionR2)
				;

			if (false === isIntersection) {
				ar.c1 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c1);
				ar.c2 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c2);
				ar.r1 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r1);
				ar.r2 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r2);
			}

			return isIntersection;
		};
		// Функция проверки lock (возвращаемый результат нельзя использовать в качестве ответа, он нужен только для редактирования ячейки)
		WorksheetView.prototype._isLockedCells = function (range, subType, callback) {
			var sheetId = this.model.getId();
			var isIntersection = false;
			var newCallback = callback;
			var t = this;

			this.collaborativeEditing.onStartCheckLock();
			var isArrayRange = Array.isArray(range);
			var nLength = isArrayRange ? range.length : 1;
			var nIndex = 0;
			var ar = null;

			for (; nIndex < nLength; ++nIndex) {
				ar = isArrayRange ? range[nIndex].clone(true) : range.clone(true);

				if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
				}

				if (false === isIntersection) {
					var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
						sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

					if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
						// Уже ячейку кто-то редактирует
						asc_applyFunction(callback, false);
						return false;
					} else {
						if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
									t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
									t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
									t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
									t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
								}
								callback(isSuccess);
							};
						}
						this.collaborativeEditing.addCheckLock(lockInfo);
					}
				} else {
					if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
						t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
						t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
						t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
						t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
						t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
						t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
						t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
						t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					}
				}
			}

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				newCallback(true);
				newCallback = undefined;
			}
			this.collaborativeEditing.onEndCheckLock(newCallback);
			return true;
		};

		WorksheetView.prototype.changeWorksheet = function (prop, val) {
			// Проверка глобального лока
			if (this.collaborativeEditing.getGlobalLock())
				return;

			var t = this;
			var arn = t.activeRange.clone(true);
			var checkRange = arn.getAllRange();

			var range;
			var fullRecalc = false;
			var reinitRanges = false;
			var cw;
			var isUpdateCols = false, isUpdateRows = false;
			var isCheckChangeAutoFilter;
			var functionModelAction = null;
			var lockDraw = false;	// Параметр, при котором не будет отрисовки (т.к. мы просто обновляем информацию на неактивном листе)
			var oChangeData = new CChangeTableData(null, null, null, null); // Обновление для диаграмм

			var onChangeWorksheetCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				asc_applyFunction(functionModelAction);

				t._initCellsArea(fullRecalc);
				if (fullRecalc)
					t.cache.reset();
				t._cleanCellsTextMetricsCache();
				t._prepareCellTextMetricsCache();
				if (reinitRanges && t.objectRender && t.objectRender.drawingArea)
					t.objectRender.drawingArea.reinitRanges();
                t.objectRender.rebuildChartGraphicObjects(oChangeData);
				t.draw(lockDraw);

				t.handlers.trigger("reinitializeScroll");

				if (isUpdateCols) { t._updateVisibleColsCount(); }
				if (isUpdateRows) { t._updateVisibleRowsCount(); }

				t.handlers.trigger("selectionChanged", t.getSelectionInfo());
				t.handlers.trigger("selectionMathInfoChanged", t.getSelectionMathInfo());
			};

			switch (prop) {
				case "colWidth":
					functionModelAction = function () {
						cw = t._charCountToModelColWidth(val);
						t.model.setColWidth(cw, checkRange.c1, checkRange.c2);
						isUpdateCols = true;
						fullRecalc = true;
						reinitRanges = true;
					};
					this._isLockedAll(onChangeWorksheetCallback);
					break;
				case "showCols":
					functionModelAction = function () {
						t.model.setColHidden(/*bHidden*/false, arn.c1, arn.c2);
						fullRecalc = true;
                        reinitRanges = true;
					};
					oChangeData.hided = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
					this._isLockedAll(onChangeWorksheetCallback);
					break;
				case "hideCols":
					functionModelAction = function () {
						t.model.setColHidden(/*bHidden*/true, arn.c1, arn.c2);
						fullRecalc = true;
                        reinitRanges = true;
					};
					oChangeData.hided = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
					this._isLockedAll(onChangeWorksheetCallback);
					break;
				case "rowHeight":
					functionModelAction = function () {
						// Приводим к px (чтобы было ровно)
						val = val / 0.75; val = (val | val) * 0.75;		// 0.75 - это размер 1px в pt (можно было 96/72)
						t.model.setRowHeight(Math.min(val, t.maxRowHeight), checkRange.r1, checkRange.r2);
						isUpdateRows = true;
						fullRecalc = true;
						reinitRanges = true;
					};
					return this._isLockedAll(onChangeWorksheetCallback);
				case "showRows":
					functionModelAction = function () {
						t.model.setRowHidden(/*bHidden*/false, arn.r1, arn.r2);
						t.autoFilters.reDrawFilter(arn);
						fullRecalc = true;
                        reinitRanges = true;
					};
					oChangeData.hided = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
					this._isLockedAll(onChangeWorksheetCallback);
					break;
				case "hideRows":
					functionModelAction = function () {
						t.model.setRowHidden(/*bHidden*/true, arn.r1, arn.r2);
						t.autoFilters.reDrawFilter(arn);
						fullRecalc = true;
                        reinitRanges = true;
					};
					oChangeData.hided = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
					this._isLockedAll(onChangeWorksheetCallback);
					break;
				case "insCell":
					range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
					switch (val) {
						case c_oAscInsertOptions.InsertCellsAndShiftRight:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(arn, c_oAscInsertOptions.InsertCellsAndShiftRight, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
								History.Create_NewPoint();
								History.StartTransaction();
								if (range.addCellsShiftRight()) {
									fullRecalc = true;
                                    reinitRanges = true;
									if(isCheckChangeAutoFilter === true)
										t.autoFilters.insertColumn(prop, arn, c_oAscInsertOptions.InsertCellsAndShiftRight);
									t.cellCommentator.updateCommentsDependencies(true, val, arn);
									t.objectRender.updateDrawingObject(true, val, arn);
								}
								History.EndTransaction();
							};

							oChangeData.changedRange = new asc_Range(arn.c1, arn.r1, gc_nMaxCol0, arn.r2);
							this._isLockedCells(oChangeData.changedRange, null, onChangeWorksheetCallback);
							break;
						case c_oAscInsertOptions.InsertCellsAndShiftDown:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(arn, c_oAscInsertOptions.InsertCellsAndShiftDown, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
								History.Create_NewPoint();
								History.StartTransaction();
								if (range.addCellsShiftBottom()) {
									fullRecalc = true;
                                    reinitRanges = true;
									if(isCheckChangeAutoFilter === true)
										t.autoFilters.insertRows(prop, arn, c_oAscInsertOptions.InsertCellsAndShiftDown);
									t.cellCommentator.updateCommentsDependencies(true, val, arn);
									t.objectRender.updateDrawingObject(true, val, arn);
								}
								History.EndTransaction();
							};

							oChangeData.changedRange = new asc_Range(arn.c1, arn.r1, arn.c2, gc_nMaxRow0);
							this._isLockedCells(oChangeData.changedRange, null, onChangeWorksheetCallback);
							break;
						case c_oAscInsertOptions.InsertColumns:
							isCheckChangeAutoFilter = t.autoFilters.isRangeIntersectionSeveralTableParts(arn, true);
							if(isCheckChangeAutoFilter === true)
								return;
						
							functionModelAction = function () {
								History.Create_NewPoint();
								History.StartTransaction();
								fullRecalc = true;
                                reinitRanges = true;
								t.model.insertColsBefore(arn.c1, arn.c2 - arn.c1 + 1);
								t.autoFilters.insertColumn(prop, arn, c_oAscInsertOptions.InsertColumns);
								t.objectRender.updateDrawingObject(true, val, arn);
								t.cellCommentator.updateCommentsDependencies(true, val, arn);
								History.EndTransaction();
							};

							oChangeData.added = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
							this._isLockedCells(oChangeData.added, c_oAscLockTypeElemSubType.InsertColumns,
								onChangeWorksheetCallback);
							break;
						case c_oAscInsertOptions.InsertRows:
							functionModelAction = function () {
								fullRecalc = true;
                                reinitRanges = true;
								t.model.insertRowsBefore(arn.r1, arn.r2 - arn.r1 + 1);
								t.autoFilters.insertRows(prop, arn, c_oAscInsertOptions.InsertRows);
								t.objectRender.updateDrawingObject(true, val, arn);
								t.cellCommentator.updateCommentsDependencies(true, val, arn);
							};

							oChangeData.added = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
							this._isLockedCells(oChangeData.added, c_oAscLockTypeElemSubType.InsertRows,
								onChangeWorksheetCallback);
							break;
					}
					break;
				case "delCell":
					range = t.model.getRange3(checkRange.r1, checkRange.c1, checkRange.r2, checkRange.c2);
					switch (val) {
						case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(arn, c_oAscDeleteOptions.DeleteCellsAndShiftLeft, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
								History.Create_NewPoint();
								History.StartTransaction();
								if(isCheckChangeAutoFilter === true)
									t.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteCellsAndShiftLeft);
								if (range.deleteCellsShiftLeft(function () {
									t._cleanCache(oChangeData.changedRange);
									t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
								})) {
									// ToDo проверить, может перенести в функцию prechange
									if(isCheckChangeAutoFilter === true)
										t.autoFilters.insertColumn(prop, checkRange, c_oAscDeleteOptions.DeleteCellsAndShiftLeft);
									t.objectRender.updateDrawingObject(false, val, checkRange);
								}
								History.EndTransaction();
                                reinitRanges = true;
							};

							oChangeData.changedRange = new asc_Range(checkRange.c1, checkRange.r1, gc_nMaxCol0, checkRange.r2);
							this._isLockedCells(oChangeData.changedRange, null, onChangeWorksheetCallback);
							break;
						case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(arn, c_oAscDeleteOptions.DeleteCellsAndShiftTop, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
									History.Create_NewPoint();
									History.StartTransaction();
									if(isCheckChangeAutoFilter === true)
										t.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteCellsAndShiftTop);
									if (range.deleteCellsShiftUp(function () {
										t._cleanCache(oChangeData.changedRange);
										t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
									})) {
										// ToDo проверить, может перенести в функцию prechange
										if(isCheckChangeAutoFilter === true)
											t.autoFilters.insertRows(prop, checkRange, c_oAscDeleteOptions.DeleteCellsAndShiftTop);
										t.objectRender.updateDrawingObject(false, val, checkRange);
									}
									History.EndTransaction();

                                    reinitRanges = true;
							};

							oChangeData.changedRange = new asc_Range(checkRange.c1, checkRange.r1, checkRange.c2, gc_nMaxRow0);
							this._isLockedCells(oChangeData.changedRange, null, onChangeWorksheetCallback);
							break;
						case c_oAscDeleteOptions.DeleteColumns:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(checkRange, c_oAscDeleteOptions.DeleteColumns, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
								fullRecalc = true;
                                reinitRanges = true;
								History.Create_NewPoint();
								History.StartTransaction();
								t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
								t.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteColumns);
								t.model.removeCols(checkRange.c1, checkRange.c2);
								t.autoFilters.insertColumn(prop, arn, c_oAscDeleteOptions.DeleteColumns);
								t.objectRender.updateDrawingObject(false, val, checkRange);
								History.EndTransaction();
							};

							oChangeData.removed = new asc_Range(checkRange.c1, 0, checkRange.c2, gc_nMaxRow0);
							this._isLockedCells(oChangeData.removed, c_oAscLockTypeElemSubType.DeleteColumns,
								onChangeWorksheetCallback);
							break;
						case c_oAscDeleteOptions.DeleteRows:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(checkRange, c_oAscDeleteOptions.DeleteRows, prop);
							if(isCheckChangeAutoFilter === false)
								return;

							functionModelAction = function () {
								fullRecalc = true;
                                reinitRanges = true;
								History.Create_NewPoint();
								History.StartTransaction();
								t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
								t.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteRows);
								t.model.removeRows(checkRange.r1, checkRange.r2);
								t.autoFilters.insertRows(prop, checkRange, c_oAscDeleteOptions.DeleteRows);
								t.objectRender.updateDrawingObject(false, val, checkRange);
								History.EndTransaction();
							};

							oChangeData.removed = new asc_Range(0, checkRange.r1, gc_nMaxCol0, checkRange.r2);
							this._isLockedCells(oChangeData.removed, c_oAscLockTypeElemSubType.DeleteRows,
								onChangeWorksheetCallback);
							break;
					}
					break;
				case "sheetViewSettings":
					functionModelAction = function () {
						t.model.setSheetViewSettings(val);

						isUpdateCols = true;
						isUpdateRows = true;
						fullRecalc = true;
                        reinitRanges = true;
					};

					this._isLockedAll (onChangeWorksheetCallback);
					break;
				case "update":
					if (val !== undefined) {
						fullRecalc = !!val.fullRecalc;
						lockDraw = true === val.lockDraw;
						reinitRanges = !!val.reinitRanges;
					}
					onChangeWorksheetCallback(true);
					break;
			}
		};

		WorksheetView.prototype.expandColsOnScroll = function (isNotActive, updateColsCount, newColsCount) {
			var t = this;
			var arn;
			var bIsMaxCols = false;
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var maxc = Math.max(this.model.getColsCount() + 1, this.cols.length, obr.maxCol);
			if (newColsCount) {
				maxc = Math.max(maxc, newColsCount);
			}

			// Сохраняем старое значение
			var nLastCols = this.nColsCount;
			if(isNotActive){
				this.nColsCount = maxc + 1;
			} else if (updateColsCount) {
				this.nColsCount = maxc;
				if (this.cols.length < this.nColsCount)
					nLastCols = this.cols.length;
			} else {
				arn = t.activeRange.clone(true);
				if (arn.c2 >= t.cols.length - 1) {
					this.nColsCount = maxc;
					if(arn.c2 >= this.nColsCount - 1)
						this.nColsCount = arn.c2 + 2;
				}
			}
			// Проверяем ограничения по столбцам
			if (gc_nMaxCol < this.nColsCount) {
				this.nColsCount = gc_nMaxCol;
				bIsMaxCols = true;
			}

			t._calcWidthColumns(/*fullRecalc*/2);

            if(this.objectRender && this.objectRender.drawingArea)
                this.objectRender.drawingArea.reinitRanges();
			return (nLastCols !== this.nColsCount || bIsMaxCols);
		};

		WorksheetView.prototype.expandRowsOnScroll = function (isNotActive, updateRowsCount, newRowsCount) {
			var t = this;
			var arn;
			var bIsMaxRows = false;
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var maxr = Math.max(this.model.getRowsCount() + 1, this.rows.length, obr.maxRow);
			if (newRowsCount) {
				maxr = Math.max(maxr, newRowsCount);
			}

			// Сохраняем старое значение
			var nLastRows = this.nRowsCount;
			if(isNotActive){
				this.nRowsCount = maxr + 1;
			} else if (updateRowsCount) {
				this.nRowsCount = maxr;
				if (this.rows.length < this.nRowsCount)
					nLastRows = this.rows.length;
			} else {
				arn = t.activeRange.clone(true);
				if (arn.r2 >= t.rows.length - 1) {
					this.nRowsCount = maxr;
					if(arn.r2 >= this.nRowsCount - 1)
						this.nRowsCount = arn.r2 + 2;
				}
			}
			// Проверяем ограничения по строкам
			if (gc_nMaxRow < this.nRowsCount) {
				this.nRowsCount = gc_nMaxRow;
				bIsMaxRows = true;
			}

			t._calcHeightRows(/*fullRecalc*/2);
            if(this.objectRender && this.objectRender.drawingArea)
                this.objectRender.drawingArea.reinitRanges();
			return (nLastRows !== this.nRowsCount || bIsMaxRows);
		};

		WorksheetView.prototype.onChangeWidthCallback = function (col, r1, r2, onlyIfMore) {
			var width = null;
			var row, ct, c, fl, str, maxW, tm, mc, isMerged, oldWidth, oldColWidth;
			var lastHeight = null;
			var filterButton = null;
			if (null == r1)
				r1 = 0;
			if (null == r2)
				r2 = this.rows.length - 1;

			oldColWidth = this.cols[col].charCount;

			this.cols[col].isCustomWidth = false;
			for (row = r1; row <= r2; ++row) {
				// пересчет метрик текста
				this._addCellTextToCache(col, row, /*canChangeColWidth*/c_oAscCanChangeColWidth.all);
				ct = this._getCellTextCache(col, row);
				if (ct === undefined) {continue;}
				fl = ct.flags;
				isMerged = fl.isMerged();
				if (isMerged) {
					mc = fl.merged;
					// Для замерженных ячеек (с 2-мя или более колонками) оптимизировать не нужно
					if (mc.c1 !== mc.c2)
						continue;
				}

				if (ct.metrics.height > this.maxRowHeight) {
					if (isMerged) {continue;}
					// Запоминаем старую ширину (в случае, если у нас по высоте не уберется)
					oldWidth = ct.metrics.width;
					lastHeight = null;
					// вычисление новой ширины столбца, чтобы высота текста была меньше maxRowHeight
					c = this._getCell(col, row);
					str = c.getValue2();
					maxW = ct.metrics.width + this.maxDigitWidth;
					while (1) {
						tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
						if (tm.height <= this.maxRowHeight) {break;}
						if (lastHeight === tm.height) {
							// Ситуация, когда у нас текст не уберется по высоте (http://bugzserver/show_bug.cgi?id=19974)
							tm.width = oldWidth;
							break;
						}
						lastHeight = tm.height;
						maxW += this.maxDigitWidth;
					}
					width = Math.max(width, tm.width);
				} else {
					filterButton = this.autoFilters.getSizeButton(col, row);
					if (null !== filterButton && CellValueType.String === ct.cellType)
						width = Math.max(width, ct.metrics.width + filterButton.width);
					else
						width = Math.max(width, ct.metrics.width);
				}
			}

			var pad, cc, cw;
			if (width > 0) {
				pad = this.width_padding * 2 + this.width_1px;
				cc = Math.min(this._colWidthToCharCount(width + pad), c_oAscMaxColumnWidth);
				cw = this._charCountToModelColWidth(cc);
			} else {
				cw = gc_dDefaultColWidthCharsAttribute;
				cc = this.defaultColWidthChars;
			}

			if (onlyIfMore && cc < oldColWidth)
				return -1;

			History.Create_NewPoint();
			if (!onlyIfMore) {
				var oSelection = History.GetSelection();
				if (null != oSelection) {
					oSelection = oSelection.clone();
					oSelection.assign(col, 0, col, gc_nMaxRow0);
					oSelection.type = c_oAscSelectionType.RangeCol;
					History.SetSelection(oSelection);
					History.SetSelectionRedo(oSelection);
				}
			}
			History.StartTransaction();
			// Выставляем, что это bestFit
			this.model.setColBestFit(true, cw, col, col);
			History.EndTransaction();
			return oldColWidth !== cc ? cw : -1;
		};

		WorksheetView.prototype.optimizeColWidth = function (col) {
			var t = this;
			return this._isLockedAll (function (isSuccess) {
				if (false === isSuccess)
					return;
				var w = t.onChangeWidthCallback(col, null, null);
				if (-1 !== w) {
					t.cols[col] = t._calcColWidth(w);
					t.cols[col].isCustomWidth = false;

					t._updateColumnPositions();
					t._updateVisibleColsCount();
					t._cleanCache(new asc_Range(col, 0, col, t.rows.length - 1));
					t.changeWorksheet("update");
				}
			});
		};

		WorksheetView.prototype.optimizeRowHeight = function (row) {
			var t = this;

			var onChangeHeightCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				var height = t.defaultRowHeight;
				var col, ct, mc;

				for (col = 0; col < t.rows.length; ++col) {
					ct = t._getCellTextCache(col, row);
					if (ct === undefined) {continue;}
					if (ct.flags.isMerged()) {
						mc = ct.flags.merged;
						// Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
						if (mc.r1 !== mc.r2)
							continue;
					}

					height = Math.max(height, ct.metrics.height);
				}

				History.Create_NewPoint();
				var oSelection = History.GetSelection();
				if(null != oSelection)
				{
					oSelection = oSelection.clone();
					oSelection.assign(0, row, gc_nMaxCol0, row);
					oSelection.type = c_oAscSelectionType.RangeRow;
					History.SetSelection(oSelection);
					History.SetSelectionRedo(oSelection);
				}
				History.StartTransaction();
				// Выставляем, что это bestFit
				t.model.setRowBestFit(true, Math.min(height + t.height_1px, t.maxRowHeight), row, row);
				History.EndTransaction();

				t.nRowsCount = 0;
				t._calcHeightRows(/*fullRecalc*/0);
				t._updateVisibleRowsCount();
				t._cleanCache(new asc_Range(0, row, t.cols.length - 1, row));
				t.changeWorksheet("update");
			};
			return this._isLockedAll (onChangeHeightCallback);
		};


		// ----- Search -----

		WorksheetView.prototype._setActiveCell = function (col, row) {
			var ar = this.activeRange, sc = ar.startCol, sr = ar.startRow, offs;

			this.cleanSelection();

			ar.assign(col, row, col, row);
			ar.type = c_oAscSelectionType.RangeCells;
			ar.startCol = col;
			ar.startRow = row;

			this._fixSelectionOfMergedCells();
			this._fixSelectionOfHiddenCells();
			this._drawSelection();

            var x1 = this.getCellLeftRelative(this.activeRange.c1, /*pt*/0 ),
                y1 = this.getCellTopRelative(this.activeRange.r1, /*pt*/0);

			offs = this._calcActiveRangeOffset(x1,y1);
			if (sc !== ar.startCol || sr !== ar.startRow) {
				this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				this.handlers.trigger("selectionChanged", this.getSelectionInfo());
			}
			return offs;
		};

		WorksheetView.prototype._isCellEqual = function (c, r, options) {
			var cell, cellText;
			// Не пользуемся RegExp, чтобы не возиться со спец.символами
			var mc = this.model.getMergedByCell(r, c);
			cell = mc ? this._getVisibleCell(mc.c1, mc.r1) : this._getVisibleCell(c, r);
			cellText = (options.lookIn === c_oAscFindLookIn.Formulas) ? cell.getValueForEdit() : cell.getValue();
			if (true !== options.isMatchCase)
				cellText = cellText.toLowerCase();
			if ((cellText.indexOf(options.findWhat) >= 0) &&
				(true !== options.isWholeCell || options.findWhat.length === cellText.length))
				return (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r));
			return null;
		};
		WorksheetView.prototype.findCellText = function (options) {
			var self = this;
			if (true !== options.isMatchCase)
				options.findWhat = options.findWhat.toLowerCase();
			var ar = options.activeRange ? options.activeRange : this.activeRange;
			var c = ar.startCol;
			var r = ar.startRow;
			var minC = 0;
			var minR = 0;
			var maxC = this.cols.length - 1;
			var maxR = this.rows.length - 1;
			var inc = options.scanForward ? +1 : -1;
			var isEqual;

			// ToDo стоит переделать это место, т.к. для поиска не нужны измерения, а нужен только сам текст (http://bugzserver/show_bug.cgi?id=26136)
			this._prepareCellTextMetricsCache(new Asc.Range(0, 0, this.model.getColsCount(), this.model.getRowsCount()));

			function findNextCell() {
				var ct = undefined;
				do {
					if (options.scanByRows) {
						c += inc;
						if (c < minC || c > maxC) {c = options.scanForward ? minC : maxC; r += inc;}
					} else {
						r += inc;
						if (r < minR || r > maxR) {r = options.scanForward ? minR : maxR; c += inc;}
					}
					if (c < minC || c > maxC || r < minR || r > maxR) {return undefined;}
					ct = self._getCellTextCache(c, r, true);
				} while (!ct);
				return ct;
			}
			while (findNextCell()) {
				isEqual = this._isCellEqual(c, r, options);
				if (null !== isEqual)
					return isEqual;
			}

			// Продолжаем циклический поиск
			if (options.scanForward){
				// Идем вперед с первой ячейки
				minC = 0;
				minR = 0;
				if (options.scanByRows) {
					c = -1;
					r = 0;

					maxC = this.cols.length - 1;
					maxR = ar.startRow;
				} else {
					c = 0;
					r = -1;

					maxC = ar.startCol;
					maxR = this.rows.length - 1;
				}
			} else {
				// Идем назад с последней
				c = this.cols.length - 1;
				r = this.rows.length - 1;
				if (options.scanByRows) {
					minC = 0;
					minR = ar.startRow;
				} else {
					minC = ar.startCol;
					minR = 0;
				}
				maxC = this.cols.length - 1;
				maxR = this.rows.length - 1;
			}
			while (findNextCell()) {
				isEqual = this._isCellEqual(c, r, options);
				if (null !== isEqual)
					return isEqual;
			}
			return null;
		};

		WorksheetView.prototype.replaceCellText = function (options, lockDraw, callback) {
			if (true !== options.isMatchCase)
				options.findWhat = options.findWhat.toLowerCase();

			// Очищаем результаты
			options.countFind = 0;
			options.countReplace = 0;

			var t = this;
			var ar = this.activeRange.clone();
			var aReplaceCells = [];
			if (options.isReplaceAll) {
				var aReplaceCellsIndex = {};
				options.activeRange = ar;
				var findResult, index;
				while (true) {
					findResult = t.findCellText(options);
					if (null === findResult)
						break;
					index = findResult.c1 + '-' + findResult.r1;
					if (aReplaceCellsIndex[index])
						break;
					aReplaceCellsIndex[index] = true;
					aReplaceCells.push(findResult);
					ar.startCol = findResult.c1;
					ar.startRow = findResult.r1;
				}
			} else {
				// Попробуем сначала найти
				var isEqual = this._isCellEqual(ar.startCol, ar.startRow, options);
				if (null === isEqual)
					return callback(options);

				aReplaceCells.push(isEqual);
			}

			if (0 > aReplaceCells.length)
				return callback(options);

			return this._replaceCellsText(aReplaceCells, options, lockDraw, callback);
		};

		WorksheetView.prototype._replaceCellsText = function (aReplaceCells, options, lockDraw, callback) {
			var t = this;
			var findFlags = "g"; // Заменяем все вхождения
			if (true !== options.isMatchCase)
				findFlags += "i"; // Не чувствителен к регистру

			var valueForSearching = options.findWhat
				.replace( /(\\)/g, "\\\\" ).replace( /(\^)/g, "\\^" )
				.replace( /(\()/g, "\\(" ).replace( /(\))/g, "\\)" )
				.replace( /(\+)/g, "\\+" ).replace( /(\[)/g, "\\[" )
				.replace( /(\])/g, "\\]" ).replace( /(\{)/g, "\\{" )
				.replace( /(\})/g, "\\}" ).replace( /(\$)/g, "\\$" )
				.replace( /(~)?\*/g, function ( $0, $1 ) { return $1 ? $0 : '(.*)'; } )
				.replace( /(~)?\?/g, function ( $0, $1 ) { return $1 ? $0 : '.'; } )
				.replace( /(~\*)/g, "\\*" ).replace( /(~\?)/g, "\\?" );
			valueForSearching = new RegExp(valueForSearching, findFlags);

			options.indexInArray = 0;
			options.countFind = aReplaceCells.length;
			options.countReplace = 0;
			if (options.isReplaceAll && false === this.collaborativeEditing.getCollaborativeEditing())
				this._isLockedCells(aReplaceCells, /*subType*/null, function () {
					t._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, true);
				});
			else
				this._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, false);
		};

		WorksheetView.prototype._replaceCellText = function (aReplaceCells, valueForSearching, options,
															 lockDraw, callback, oneUser) {
			var t = this;
			if (options.indexInArray >= aReplaceCells.length) {
				this.draw(lockDraw);
				return callback(options);
			}

			var onReplaceCallback = function (isSuccess) {
				var cell = aReplaceCells[options.indexInArray];
				++options.indexInArray;
				if (false !== isSuccess) {
					++options.countReplace;

					var c = t._getVisibleCell(cell.c1, cell.r1);

					if (c === undefined) {
						asc_debug("log", "Unknown cell's info: col = " + cell.c1 + ", row = " + cell.r1);
					} else {
						var cellValue = c.getValueForEdit();
						cellValue = cellValue.replace(valueForSearching, options.replaceWith);

						var oCellEdit = new asc_Range(cell.c1, cell.r1, cell.c1, cell.r1);
						var v, newValue;
						// get first fragment and change its text
						v = c.getValueForEdit2().slice(0, 1);
						// Создаем новый массив, т.к. getValueForEdit2 возвращает ссылку
						newValue = [];
						newValue[0] = new Fragment({text: cellValue, format: v[0].format.clone()});

						t._saveCellValueAfterEdit(oCellEdit, c, newValue, /*flags*/undefined, /*skipNLCheck*/false,
							/*isNotHistory*/true, /*lockDraw*/true);
					}
				}

				window.setTimeout(function () {
					t._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, oneUser);
				}, 1);
			};

			return oneUser ? onReplaceCallback(true) : this._isLockedCells(aReplaceCells[options.indexInArray], /*subType*/null, onReplaceCallback);
		};

		WorksheetView.prototype.findCell = function (reference) {
            var range = asc.g_oRangeCache.getAscRange( reference );
            if ( !range ) {

                var _C2H50H_ = this.model.workbook.getDefinesNames( reference, this.model.workbook.getActiveWs().getId() ), sheetName, ref;

                if ( !_C2H50H_ ) {

                    var actRange = this.getActiveRangeObj(), ascRange,
                        mc = this.model.getMergedByCell( actRange.startRow, actRange.startCol ),
                        c1 = mc ? mc.c1 : actRange.c1,
                        r1 = mc ? mc.r1 : actRange.r1,
                        ar_norm = actRange.normalize(),
                        mc_norm = mc ? mc.normalize() : null,
                        c2 = mc_norm ? ( mc_norm.isEqual( ar_norm ) ? mc_norm.c1 : ar_norm.c2 ) : ar_norm.c2,
                        r2 = mc_norm ? ( mc_norm.isEqual( ar_norm ) ? mc_norm.r1 : ar_norm.r2 ) : ar_norm.r2,
                        defName;

                    ascRange = new asc_Range( c1, r1, c2, r2 );
                    /*TODO: сделать поиск по названиям автофигур, должен искать до того как вызвать поиск по именованным диапазонам*/
                    defName = new Asc.asc_CDefName( reference, this.model.getName() + "!" + ascRange.getAbsName() );

                    if ( this.collaborativeEditing.getGlobalLock() || !this.handlers.trigger( "getLockDefNameManagerStatus" ) ) {
                        this.handlers.trigger( "onErrorEvent", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical );
                        this._updateSelectionNameAndInfo();
                        return true;
                    }

                    _C2H50H_ = this.model.workbook.editDefinesNames( null, defName );
                }

                if ( _C2H50H_ ) {
                    range = true;
                    this._isLockedDefNames( null, _C2H50H_.nodeId );

                    if ( _C2H50H_.isTable ) {
                        sheetName = _C2H50H_.Ref.split( "!" );
                        ref = sheetName[1];
                        sheetName = sheetName[0];
                        if ( sheetName[0] == "'" && sheetName[sheetName.length - 1] == "'" ) {
                            sheetName = sheetName.substring( 1, sheetName.length - 1 );
                        }
                        range = asc.g_oRangeCache.getAscRange( ref );
                        sheetName = this.model.workbook.getWorksheetByName( sheetName );
                    }
                    else if ( _C2H50H_.parsedRef.RefPos.length == 1 && _C2H50H_.parsedRef.outStack.length == 1 ) {
                        ref = _C2H50H_.parsedRef.outStack[0];
                        if ( ref.type == cElementType.cell3D ) {
                            range = ref.range.getBBox0().clone( true );
                            sheetName = ref.getWS();
                        }
                        else if ( ref.type == cElementType.cellsRange3D && ref.wsFrom == ref.wsTo ) {
                            range = ref.getRange()[0].getBBox0().clone( true );
                            sheetName = this.model.workbook.getWorksheetById( ref.wsFrom );
                        }

                    }

                    if ( range && sheetName ) {
                        ar_norm = range.normalize();
                        mc = sheetName.getMergedByCell( ar_norm.r1, ar_norm.c1 )
                        range = {range: mc ? mc : range, sheet: sheetName.getName()};
                    }
                }
            }
            else {
                var ar_norm = range.normalize(),
                    mc = this.model.getMergedByCell( ar_norm.r1, ar_norm.c1 );

                range = {range: mc ? mc : range, sheet: this.model.getName()};
            }
            return range;// ? this.setSelection(range, true) : null;
		};

		/* Ищет дополнение для ячейки */
		WorksheetView.prototype.getCellAutoCompleteValues = function (col, row, maxCount) {
			var arrValues = [], objValues = {};
			var range = this.findCellAutoComplete(col, row, 1, maxCount);
			this.getColValues(range, col, arrValues, objValues);
			range = this.findCellAutoComplete(col, row, -1, maxCount);
			this.getColValues(range, col, arrValues, objValues);

			arrValues.sort();
			return arrValues;
		};

		/* Ищет дополнение для ячейки (снизу или сверху) */
		WorksheetView.prototype.findCellAutoComplete = function (col, row, step, maxCount) {
			row += step;
			if (!maxCount)
				maxCount = Number.MAX_VALUE;
			var count = 0, cell, end = 0 < step ? this.model.getRowsCount() - 1: 0, isEnd = true,
				colsCount = this.model.getColsCount(), range = new asc_Range(col, row, col, row);
			for (; row * step <= end && count < maxCount; row += step, isEnd = true, ++count) {
				for (col = range.c1; col <= range.c2; ++col) {
					cell = this.model._getCellNoEmpty(row, col);
					if (cell && false === cell.isEmptyText()) {
						isEnd = false;
						break;
					}
				}
				// Идем влево по колонкам
				for (col = range.c1 - 1; col >= 0; --col) {
					cell = this.model._getCellNoEmpty(row, col);
					if (null === cell || cell.isEmptyText())
						break;
					isEnd = false;
				}
				range.c1 = col + 1;
				// Идем вправо по колонкам
				for (col = range.c2 + 1; col < colsCount; ++col) {
					cell = this.model._getCellNoEmpty(row, col);
					if (null === cell || cell.isEmptyText())
						break;
					isEnd = false;
				}
				range.c2 = col - 1;

				if (isEnd)
					break;
			}
			if (0 < step)
				range.r2 = row - 1;
			else
				range.r1 = row + 1;
			return range.r1 <= range.r2 ? range : null;
		};

		/* Формирует уникальный массив */
		WorksheetView.prototype.getColValues = function (range, col, arrValues, objValues) {
			if (null === range)
				return;
			var row, cell, value, valueLowCase;
			for (row = range.r1; row <= range.r2; ++row) {
				cell = this.model._getCellNoEmpty(row, col);
				if (cell) {
					value = cell.getValue();
					if (!isNumber(value)) {
						valueLowCase = value.toLowerCase();
						if (!objValues.hasOwnProperty(valueLowCase)) {
							arrValues.push(value);
							objValues[valueLowCase] = 1;
						}
					}
				}
			}
		};

		// ----- Cell Editor -----

		WorksheetView.prototype.setCellEditMode = function (isCellEditMode) {
			this.isCellEditMode = isCellEditMode;
		};

		WorksheetView.prototype.setFormulaEditMode = function (isFormulaEditMode) {
			this.isFormulaEditMode = isFormulaEditMode;
		};

		WorksheetView.prototype.setSelectionDialogMode = function (selectionDialogType, selectRange) {
			if (selectionDialogType === this.selectionDialogType)
				return;
            var oldSelectionDialogType = this.selectionDialogType;
			this.selectionDialogType = selectionDialogType;
			this.isSelectionDialogMode = c_oAscSelectionDialogType.None !== this.selectionDialogType;
			this.cleanSelection();

			if (false === this.isSelectionDialogMode) {
				if (null !== this.copyActiveRange)
					this.activeRange = this.copyActiveRange.clone(true);
				this.copyActiveRange = null;
                if(oldSelectionDialogType === c_oAscSelectionDialogType.Chart)
                {
                    this.objectRender.controller.checkChartForProps(false);
                }
			} else {

				this.copyActiveRange = this.activeRange.clone(true);
				if (selectRange) {
					if (typeof selectRange === 'string') {
						selectRange = this.model.getRange2(selectRange);
						if (selectRange)
							selectRange = selectRange.getBBox0();
					}

					if (null != selectRange)
						this.activeRange.assign(selectRange.c1, selectRange.r1, selectRange.c2, selectRange.r2);
				}
                if(selectionDialogType === c_oAscSelectionDialogType.Chart)
                {
                    this.objectRender.controller.checkChartForProps(true);
                }
			}
			this._drawSelection();
		};

		// Получаем свойство: редактируем мы сейчас или нет
		WorksheetView.prototype.getCellEditMode = function () {
			return this.isCellEditMode;
		};

		WorksheetView.prototype._isFormula = function (val) {
			return (0 < val.length && 1 < val[0].text.length && '=' === val[0].text.charAt(0));
		};

		WorksheetView.prototype.getActiveCell = function (x, y, isCoord) {
			var t = this;
			var col, row;
			if (isCoord) {
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
				col = t._findColUnderCursor(x, true);
				row = t._findRowUnderCursor(y, true);
				if (!col || !row) {return false;}
				col = col.col;
				row = row.row;
			} else {
				col = t.activeRange.startCol;
				row = t.activeRange.startRow;
			}

			// Проверим замерженность
			var mergedRange = this.model.getMergedByCell(row, col);
			return mergedRange ? mergedRange : new asc_Range(col, row, col, row);
		};

		WorksheetView.prototype._saveCellValueAfterEdit = function (oCellEdit, c, val, flags, skipNLCheck,
																	isNotHistory, lockDraw) {
			var t = this;
			var oldMode = t.isFormulaEditMode;
			t.isFormulaEditMode = false;

			if (!isNotHistory) {
				History.Create_NewPoint();
				History.StartTransaction();
			}

			var isFormula = t._isFormula(val);

			if (isFormula) {
				var ftext = val.reduce(function (pv,cv) {return pv + cv.text;}, "");
				var ret = true;
				// ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
				c.setValue(ftext, function(r){ret = r;});
				if(!ret) {
					t.isFormulaEditMode = oldMode;
					History.EndTransaction();
					return false;
				}
				isFormula = c.isFormula();
			} else {
				c.setValue2(val);
				// Вызываем функцию пересчета для заголовков форматированной таблицы
				t.autoFilters.renameTableColumn(oCellEdit);
			}

			if (!isFormula) {
				// Нужно ли выставлять WrapText (ищем символ новой строки в тексте)
				var bIsSetWrap = false;
				if (!skipNLCheck) {
					for (var i = 0; i < val.length; ++i) {
						if (val[i].text.indexOf(kNewLine) >= 0) {
							bIsSetWrap = true;
							break;
						}
					}
				}
				if (bIsSetWrap)
					c.setWrap(true);

				// Для формулы обновление будет в коде рассчета формулы
				t._updateCellsRange(oCellEdit, /*canChangeColWidth*/c_oAscCanChangeColWidth.numbers, lockDraw);
			}

			if (!isNotHistory) {
				History.EndTransaction();
			}

			// если вернуть false, то редактор не закроется
			return true;
		};

		WorksheetView.prototype.openCellEditor = function (editor, x, y, isCoord, fragments, cursorPos,
														   isFocus, isClearCell, isHideCursor, isQuickInput, activeRange) {
			var t = this, vr, tc = this.cols, tr = this.rows, col, row, c, fl, mc, bg, isMerged;
			var offsetX = 0, offsetY = 0;
			var ar = this.activeRange;
			if (activeRange)
				this.activeRange = activeRange.clone();

			if (this.objectRender.checkCursorDrawingObject(x, y))
				return false;

			function getLeftSide(col) {
				var i, res = [], offs = t.cols[vr.c1].left - t.cols[0].left - offsetX;
				for (i = col; i >= vr.c1; --i) {
					if (t.width_1px < t.cols[i].width)
						res.push(t.cols[i].left - offs);
				}
				return res;
			}

			function getRightSide(col) {
				var i, w, res = [], offs = t.cols[vr.c1].left - t.cols[0].left - offsetX;

				// Для замерженных ячеек, можем уйти за границу
				if (isMerged && col > vr.c2)
					col = vr.c2;

				for (i = col; i <= vr.c2; ++i) {
					w = t.cols[i].width;
					if (t.width_1px < w)
						res.push(t.cols[i].left + w - offs);
				}
				w = t.drawingCtx.getWidth();
				if (res[res.length - 1] > w) {
					res[res.length - 1] = w;
				}
				return res;
			}

			function getBottomSide(row) {
				var i, h, res = [], offs = t.rows[vr.r1].top - t.rows[0].top - offsetY;

				// Для замерженных ячеек, можем уйти за границу
				if (isMerged && row > vr.r2)
					row = vr.r2;

				for (i = row; i <= vr.r2; ++i) {
					h = t.rows[i].height;
					if (t.height_1px < h)
						res.push(t.rows[i].top + h - offs);
				}
				h = t.drawingCtx.getHeight();
				if (res[res.length - 1] > h) {
					res[res.length - 1] = h;
				}
				return res;
			}

			if (isCoord) {
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
				col = this._findColUnderCursor(x, true);
				row = this._findRowUnderCursor(y, true);
				if (!col || !row) {return false;}
				col = col.col;
				row = row.row;
			} else {
				col = ar.startCol;
				row = ar.startRow;
			}

			// Возможно стоит заменить на ячейку из кеша
			c = this._getVisibleCell(col, row);
			if (!c) {throw "Can not get cell data (col=" + col + ", row=" + row + ")";}

			fl = this._getCellFlags(c);
			isMerged = fl.isMerged();
			if (isMerged) {
				mc = fl.merged;
				c = this._getVisibleCell(mc.c1, mc.r1);
				if (!c) {throw "Can not get merged cell data (col=" + mc.c1 + ", row=" + mc.r1 + ")";}
				fl = this._getCellFlags(c);
			}

			// Выставляем режим 'не редактируем' (иначе мы попытаемся переместить редактор, который еще не открыт)
			this.isCellEditMode = false;
			this.handlers.trigger("onScroll", this._calcActiveCellOffset());
			this.isCellEditMode = true;

			vr = this.visibleRange.clone();
			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				if (0 < cFrozen) {
					if (col >= cFrozen)
						offsetX = tc[cFrozen].left - tc[0].left;
					else {
						vr.c1 = 0;
						vr.c2 = cFrozen - 1;
					}
				}
				if (0 < rFrozen) {
					if (row >= rFrozen)
						offsetY = tr[rFrozen].top - tr[0].top;
					else {
						vr.r1 = 0;
						vr.r2 = rFrozen - 1;
					}
				}
			}

			bg = c.getFill();
			this.isFormulaEditMode = false;
			// Очищаем массив ячеек для текущей формулы
			this.arrActiveFormulaRanges = [];

			var oFontColor = c.getFontcolor();
			// Скрываем окно редактирования комментария
			this.model.workbook.handlers.trigger("asc_onHideComment");

			if (fragments === undefined) {
				var _fragmentsTmp = c.getValueForEdit2();
				fragments = [];
				for (var i = 0; i < _fragmentsTmp.length; ++i)
					fragments.push(_fragmentsTmp[i].clone());
			}

			var arrAutoComplete = this.getCellAutoCompleteValues(col, row, kMaxAutoCompleteCellEdit);
			var arrAutoCompleteLC = asc.arrayToLowerCase(arrAutoComplete);

			editor.open({
				cellX: this.cellsLeft + tc[!isMerged ? col : mc.c1].left - tc[vr.c1].left + offsetX,
				cellY: this.cellsTop + tr[!isMerged ? row : mc.r1].top - tr[vr.r1].top + offsetY,
				leftSide: getLeftSide(!isMerged ? col : mc.c1),
				rightSide: getRightSide(!isMerged ? col : mc.c2),
				bottomSide: getBottomSide(!isMerged ? row : mc.r2),
				fragments: fragments,
				flags: fl,
				font: new asc.FontProperties(c.getFontname(), c.getFontsize()),
				background: bg || this.settings.cells.defaultState.background,
				textColor: oFontColor || this.settings.cells.defaultState.color,
				cursorPos: cursorPos,
				zoom: this.getZoom(),
				focus: isFocus,
				isClearCell: isClearCell,
				isHideCursor: isHideCursor,
				isQuickInput: isQuickInput,
				isAddPersentFormat: isQuickInput && c_oAscNumFormatType.Percent === c.getNumFormat().getType(),
				autoComplete: arrAutoComplete,
				autoCompleteLC: arrAutoCompleteLC,
				saveValueCallback: function (val, flags, skipNLCheck) {
					var oCellEdit = isMerged ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(col, row, col, row);
					return t._saveCellValueAfterEdit(oCellEdit, c, val, flags,
						skipNLCheck, /*isNotHistory*/false, /*lockDraw*/false);
				}
			});
			return true;
		};

		WorksheetView.prototype.openCellEditorWithText = function (editor, text, cursorPos, isFocus, activeRange) {
			var t = this;
			var ar = (activeRange) ? activeRange : t.activeRange;
			var c = t._getVisibleCell(ar.startCol, ar.startRow);
			var v, copyValue;

			if (!c) {throw "Can not get cell data (col=" +  ar.startCol + ", row=" +  ar.startCol + ")";}

			// get first fragment and change its text
			v = c.getValueForEdit2().slice(0, 1);
			// Создаем новый массив, т.к. getValueForEdit2 возвращает ссылку
			copyValue = [];
			copyValue[0] = new Fragment({text: text, format: v[0].format.clone()});

			var bSuccess = t.openCellEditor(editor, 0, 0, /*isCoord*/false, /*fragments*/undefined,
				/*cursorPos*/undefined, isFocus, /*isClearCell*/true, /*isHideCursor*/false,
				/*isQuickInput*/false, activeRange);
			if (bSuccess) {
				editor.paste(copyValue, cursorPos);
			}
			return bSuccess;
		};

		WorksheetView.prototype.getFormulaRanges = function () {
			return this.arrActiveFormulaRanges;
		};

		/**
		 *
		 * @param {Object} ranges
		 * @param canChangeColWidth
		 * @param lockDraw
		 * @param updateHeight
		 */
		WorksheetView.prototype.updateRanges = function (ranges, canChangeColWidth, lockDraw, updateHeight) {
			var arrRanges = [], range;
			for (var i in ranges) {
				range = ranges[i];
				this.updateRange(range, canChangeColWidth, true);
				arrRanges.push(range);
			}

			if (0 < arrRanges.length) {
				if (updateHeight)
					this.isChanged = true;

				this._recalculateAfterUpdate(arrRanges, lockDraw);
			}
		};
		// ToDo избавиться от этой функции!!!!Заглушка для принятия изменений
		WorksheetView.prototype._checkUpdateRange = function (range) {
			// Для принятия изменения нужно делать расширение диапазона
			if (this.model.workbook.bCollaborativeChanges) {
				var bIsUpdateX = false, bIsUpdateY = false;
				if (range.c2 >= this.nColsCount) {
					this.expandColsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
					// Проверка, вдруг пришел диапазон за пределами существующей области
					if (range.c2 >= this.nColsCount) {
						if (range.c1 >= this.nColsCount)
							return;
						range.c2 = this.nColsCount - 1;
					}
					bIsUpdateX = true;
				}
				if (range.r2 >= this.nRowsCount) {
					this.expandRowsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
					// Проверка, вдруг пришел диапазон за пределами существующей области
					if (range.r2 >= this.nRowsCount) {
						if (range.r1 >= this.nRowsCount)
							return;
						range.r2 = this.nRowsCount - 1;
					}
					bIsUpdateY = true;
				}

				if (bIsUpdateX && bIsUpdateY)
					this.handlers.trigger("reinitializeScroll");
				else if (bIsUpdateX)
					this.handlers.trigger("reinitializeScrollX");
				else if (bIsUpdateY)
					this.handlers.trigger("reinitializeScrollY");
			}
		};
		WorksheetView.prototype.updateRange = function (range, canChangeColWidth, lockDraw) {
			this._checkUpdateRange(range);
			this._updateCellsRange(range, canChangeColWidth, lockDraw);
		};

		WorksheetView.prototype._updateCellsRange = function (range, canChangeColWidth, lockDraw) {
			var r, c, h, d, ct, isMerged;
			var mergedRange, bUpdateRowHeight;

			if (range === undefined) {
        range = this.activeRange.clone(true);
      } else {
        // ToDo заглушка..пора уже переделать обновление данных
        if (range.r1 >= this.nRowsCount || range.c1 >= this.nColsCount)
          return;
        range.r2 = Math.min(range.r2, this.nRowsCount - 1);
        range.c2 = Math.min(range.c2, this.nColsCount - 1);
      }

			if(gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2)
			{
				range = range.clone();
				if(gc_nMaxCol0 === range.c2)
					range.c2 = this.cols.length - 1;
				if(gc_nMaxRow0 === range.r2)
					range.r2 = this.rows.length - 1;
			}

			this._cleanCache(range);

			// Если размер диапазона превышает размер видимой области больше чем в 3 раза, то очищаем весь кэш
			if (this._isLargeRange(range)) {
				this.changeWorksheet("update", {lockDraw: lockDraw});

				this._updateSelectionNameAndInfo();
				return;
			}

			var cto;
			for (r = range.r1; r <= range.r2; ++r) {
				if (this.height_1px > this.rows[r].height) {continue;}
				for (c = range.c1; c <= range.c2; ++c) {
					if (this.width_1px > this.cols[c].width) {continue;}
					c = this._addCellTextToCache(c, r, canChangeColWidth); // may change member 'this.isChanged'
				}
				for (h = this.defaultRowHeight, d = this.defaultRowDescender, c = 0; c < this.cols.length; ++c) {
					ct = this._getCellTextCache(c, r, true);
					if (!ct) {continue;}

					/**
					 * Пробегаемся по строке и смотрим не продолжается ли ячейка на соседние.
					 * С помощью этой правки уйдем от обновления всей строки при каких-либо действиях
					 */
					if ((c < range.c1 || c > range.c2) && (0 !== ct.sideL || 0 !== ct.sideR)) {
						cto = this._calcCellTextOffset(c, r, ct.cellHA, ct.metrics.width);
						ct.cellW = cto.maxWidth;
						ct.sideL = cto.leftSide;
						ct.sideR = cto.rightSide;
					}

					// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
					isMerged = ct.flags.isMerged();
					if (!isMerged) {
						bUpdateRowHeight = true;
					} else {
						mergedRange = ct.flags.merged;
						// Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
						bUpdateRowHeight = mergedRange.r1 === mergedRange.r2;
					}
					if (bUpdateRowHeight)
						h = Math.max(h, ct.metrics.height);

					if (ct.cellVA !== kvaTop && ct.cellVA !== kvaCenter && !isMerged) {
						d = Math.max(d, ct.metrics.height - ct.metrics.baseline);
					}
				}
				if (Math.abs(h - this.rows[r].height) > 0.000001 && !this.rows[r].isCustomHeight) {
					if (!this.rows[r].isDefaultHeight) {
						this.rows[r].heightReal = this.rows[r].height = Math.min(h, this.maxRowHeight);
						this.model.setRowHeight(this.rows[r].height + this.height_1px, r, r);
						this.isChanged = true;
					}
				}
				if (Math.abs(d - this.rows[r].descender) > 0.000001) {
					this.rows[r].descender = d;
					this.isChanged = true;
				}
			}

			if (!lockDraw)
				this._recalculateAfterUpdate([range]);
		};

		WorksheetView.prototype._recalculateAfterUpdate = function (arrChanged, lockDraw) {
			if (this.isChanged) {
				this.isChanged = false;
				this._initCellsArea(true);
				this.cache.reset();
				this._cleanCellsTextMetricsCache();
				this._prepareCellTextMetricsCache();
				this.handlers.trigger("reinitializeScroll");
			}
			if (!lockDraw)
				this._updateSelectionNameAndInfo();

			this.objectRender.rebuildChartGraphicObjects(new CChangeTableData(null, null, null, null, arrChanged));
			this.cellCommentator.updateCommentPosition();
			this.handlers.trigger("onDocumentPlaceChanged");
			this.draw(lockDraw);
		};

		WorksheetView.prototype.enterCellRange = function (editor) {
			if (!this.isFormulaEditMode)
				return;

			var currentRange = this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1].clone();
			var startCol = currentRange.startCol, startRow = currentRange.startRow;
			// Замерженную ячейку должны отдать только левую верхнюю.
			var mergedRange = this.model.getMergedByCell(currentRange.r1, currentRange.c1);
			if (mergedRange && currentRange.isEqual(mergedRange)) {
				currentRange.r2 = currentRange.r1;
				currentRange.c2 = currentRange.c1;
			}

/*            var defName = this.model.workbook.findDefinesNames(this.model.getName()+"!"+currentRange.getAbsName(),this.model.getId());
            console.log("defName #2 " + defName);*/
            editor.enterCellRange(/*defName || */currentRange.getName());

			for (var tmpRange, i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
				tmpRange = this.arrActiveFormulaRanges[i];
				if (tmpRange.isEqual(currentRange)) {
					tmpRange.startCol = startCol;
					tmpRange.startRow = startRow;
					break;
				}
			}
		};

		WorksheetView.prototype.addFormulaRange = function (range) {
			var r = range !== undefined ? range :
				new asc_ActiveRange(this.activeRange.c1, this.activeRange.r1, this.activeRange.c2, this.activeRange.r2);
			this.arrActiveFormulaRanges.push(r);
			this._fixSelectionOfMergedCells();
		};

		WorksheetView.prototype.activeFormulaRange = function (range) {
			for (var i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
				if (this.arrActiveFormulaRanges[i].isEqual(range)) {
					var r = this.arrActiveFormulaRanges[i];
					this.arrActiveFormulaRanges.splice(i, 1);
					this.arrActiveFormulaRanges.push(r);
					return;
				}
			}
		};

		WorksheetView.prototype.cleanFormulaRanges = function () {
			// Очищаем массив ячеек для текущей формулы
			this.arrActiveFormulaRanges = [];
		};

		WorksheetView.prototype.addAutoFilter = function (styleName, addFormatTableOptionsObj) {
			// Проверка глобального лока
			if (this.collaborativeEditing.getGlobalLock())
				return;

            if(!this.handlers.trigger("getLockDefNameManagerStatus")){
                this.handlers.trigger("onErrorEvent",c_oAscError.ID.LockCreateDefName,c_oAscError.Level.NoCritical);
                return;
            }
			
			var t = this;
			var ar = t.activeRange.clone(true);
			
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
				{
					t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.LockedAllError, c_oAscError.Level.NoCritical);
					t.handlers.trigger("selectionChanged", t.getSelectionInfo());
					return;
				}
				
				if(addFormatTableOptionsObj && t.autoFilters.isChangeAutoFilterToTablePart(addFormatTableOptionsObj) === true)
					t.autoFilters.changeAutoFilterToTablePart(styleName, ar, addFormatTableOptionsObj);
				else
					t.autoFilters.addAutoFilter(styleName, ar, addFormatTableOptionsObj);
			};
			
			if(t.autoFilters.checkAddAutoFilter(ar, styleName, addFormatTableOptionsObj) === true){
				this._isLockedAll (onChangeAutoFilterCallback);
                this._isLockedDefNames(null,null);
            }
			else//для того, чтобы в случае ошибки кнопка отжималась!
				t.handlers.trigger("selectionChanged", t.getSelectionInfo());
		};
		
		WorksheetView.prototype.changeAutoFilter = function (tableName, optionType, val) {
			// Проверка глобального лока
			if (this.collaborativeEditing.getGlobalLock())
				return;
			
			var t = this;
			var ar = t.activeRange.clone(true);
			
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
				{
					t.handlers.trigger("selectionChanged", t.getSelectionInfo());
					return;
				}
				
				switch (optionType) {
					case c_oAscChangeFilterOptions.filter:
					{
						if(!val)
							t.autoFilters.deleteAutoFilter(ar, tableName);
						else
							t.autoFilters.addAutoFilter(null, ar);
						
						break;
					}
					case c_oAscChangeFilterOptions.style:
					{
						t.autoFilters.changeTableStyleInfo(val, ar, tableName);
						break;
					}
				}
			};
			
			this._isLockedAll (onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.applyAutoFilter = function (type, autoFilterObject) {
			var t = this;
			var ar = t.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.autoFilters.applyAutoFilter(autoFilterObject, ar);
			};
			this._isLockedAll(onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.sortColFilter = function (type, cellId, displayName) {
			var t = this;
			var ar = this.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.autoFilters.sortColFilter(type, cellId, ar, null, displayName);
			};
			this._isLockedAll(onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.getAddFormatTableOptions = function (range) {
			var ar = this.activeRange.clone(true);
			return this.autoFilters.getAddFormatTableOptions(ar, range);
		};
		
		WorksheetView.prototype.clearFilter = function () {
			var t = this;
			var ar = this.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;
				
				t.autoFilters.isApplyAutoFilterInCell(ar, true);
			};
			this._isLockedAll(onChangeAutoFilterCallback);
		};

		/**
		 * Обновление при изменениях форматированной таблицы
		 * @param range - обновляемый диапазон (он же диапазон для выделения)
		 * @param recalc - делать ли автоподбор по названию столбца
		 * @param changeRowsOrMerge - менялись ли строки (скрытие раскрытие) или был unmerge
		 * @private
		 */
		WorksheetView.prototype._onUpdateFormatTable = function (range, recalc, changeRowsOrMerge) {
			//ToDo заглушка, чтобы не падало. Нужно полностью переделывать этот код!!!! (Перенес выше из-за бага http://bugzserver/show_bug.cgi?id=26705)
			this._checkUpdateRange(range);

			if (!recalc) {
				// При скрытии/открытии строк стоит делать update всему
				if (changeRowsOrMerge)
					this.isChanged = true;
				// Пока вызовем updateRange, но стоит делать просто draw
				this._updateCellsRange(range);
				return;
			}

			if (!this.activeRange.isEqual(range))
				this.setSelection(range);

			var i, r = range.r1, bIsUpdate = false, w;
			for (i = range.c1; i <= range.c2; ++i) {
				w = this.onChangeWidthCallback(i, r, r, /*onlyIfMore*/true);
				if (-1 !== w) {
					this.cols[i] = this._calcColWidth(w);
					this._cleanCache(new asc_Range(i, 0, i, this.rows.length - 1));
					bIsUpdate = true;
				}
			}

			if (bIsUpdate) {
				this._updateColumnPositions();
				this._updateVisibleColsCount();
				this.changeWorksheet("update");
			} else if (changeRowsOrMerge) {
				// Был merge, нужно обновить (ToDo)
				this._initCellsArea(true);
				this.cache.reset();
				this._cleanCellsTextMetricsCache();
				this._prepareCellTextMetricsCache();
				if (this.objectRender && this.objectRender.drawingArea)
					this.objectRender.drawingArea.reinitRanges();
				var oChangeData = new CChangeTableData(null, null, null, null); // Обновление для диаграмм
				oChangeData.change = new asc_Range(range.c1, 0, range.c2, gc_nMaxRow0);
				this.objectRender.rebuildChartGraphicObjects(oChangeData);
				this.draw();
				this.handlers.trigger("reinitializeScroll");
			} else {
				// Просто отрисуем
				this.draw();
			}

		};

		WorksheetView.prototype._loadFonts = function (fonts, callback) {
			var api = window["Asc"]["editor"];
			api._loadFonts(fonts, callback);
		};

		WorksheetView.prototype.setData = function (oData) {
			History.Clear();
			History.TurnOff();
			var oAllRange = new Range(this.model, 0, 0, this.nRowsCount - 1, this.nColsCount - 1);
			oAllRange.cleanAll();

			var row, oCell;
			for (var r = 0; r < oData.length; ++r) {
				row = oData[r];
				for (var c = 0; c < row.length; ++c) {
					if (row[c]) {
						oCell = this._getVisibleCell(c, r);
						oCell.setValue(row[c]);
					}
				}
			}
			History.TurnOn();
			this._updateCellsRange(oAllRange.bbox); // ToDo Стоит обновить nRowsCount и nColsCount
		};
    WorksheetView.prototype.getData = function() {
      var arrResult, arrCells = [], cell, c, r, row, lastC = -1, lastR = -1, val;
      var maxCols = Math.min(this.model.getColsCount(), gc_nMaxCol);
      var maxRows = Math.min(this.model.getRowsCount(), gc_nMaxRow);

      for (r = 0; r < maxRows; ++r) {
        row = [];
        for (c = 0; c < maxCols; ++c) {
          cell = this.model._getCellNoEmpty(r, c);
          if (cell && '' !== (val = cell.getValue())) {
            lastC = Math.max(lastC, c);
            lastR = Math.max(lastR, r);
          } else {
            val = '';
          }
          row.push(val);
        }
        arrCells.push(row);
      }

      arrResult = arrCells.slice(0, lastR + 1);
      ++lastC;
      if (lastC < maxCols) {
        for (r = 0; r < arrResult.length; ++r) {
          arrResult[r] = arrResult[r].slice(0, lastC);
        }
      }
      return arrResult;
    };

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].WorksheetView = WorksheetView;


	}
)(jQuery, window);
