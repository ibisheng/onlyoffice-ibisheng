"use strict";

/* WorksheetView.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Nov 21, 2011
 */
(	/**
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
		var asc_round   = asc.round;
		var asc_obj2Color = asc.colorObjToAscColor;
		var asc_typeof  = asc.typeOf;
		var asc_incDecFonSize  = asc.incDecFonSize;
		var asc_debug   = asc.outputDebugStr;
		var asc_Range   = asc.Range;
		var asc_ActiveRange   = asc.ActiveRange;
		var asc_FP      = asc.FontProperties;
		var asc_AF     = asc.AutoFilters;

		var asc_CCellFlag		= asc.asc_CCellFlag;
		var asc_CFont			= asc.asc_CFont;
		var asc_CFill			= asc.asc_CFill;
		var asc_CCellInfo		= asc.asc_CCellInfo;
		var asc_CCellRect		= asc.asc_CCellRect;
		var asc_CHyperlink		= asc.asc_CHyperlink;
		var asc_CPageOptions	= asc.asc_CPageOptions;
		var asc_CPageSetup		= asc.asc_CPageSetup;
		var asc_CPageMargins	= asc.asc_CPageMargins;
		var asc_CPagePrint		= asc.CPagePrint;
		var asc_CCollaborativeRange = asc.asc_CCollaborativeRange;
		var asc_CCellCommentator = asc.asc_CCellCommentator;
		var asc_CSelectionMathInfo = asc.asc_CSelectionMathInfo;

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
		var kCurCells		= "cell";
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

		// ToDo стоит перенести в common-ы
		var kCurFormatPainter = "";
		if (AscBrowser.isIE)
			kCurFormatPainter = "url(../Common/Images/copy_format.cur), pointer";
		else if (AscBrowser.isOpera)
			kCurFormatPainter = "pointer";
		else
			kCurFormatPainter = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK\
			T2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AU\
			kSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXX\
			Pues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgAB\
			eNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAt\
			AGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3\
			AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dX\
			Lh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+\
			5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk\
			5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd\
			0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA\
			4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzA\
			BhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/ph\
			CJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5\
			h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+\
			Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhM\
			WE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQ\
			AkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+Io\
			UspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdp\
			r+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZ\
			D5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61Mb\
			U2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY\
			/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllir\
			SKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79u\
			p+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6Vh\
			lWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1\
			mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lO\
			k06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry\
			FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3I\
			veRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+B\
			Z7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/\
			0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5p\
			DoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5q\
			PNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIs\
			OpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5\
			hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQ\
			rAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9\
			rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1d\
			T1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aX\
			Dm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7\
			vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3S\
			PVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKa\
			RptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO\
			32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21\
			e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfV\
			P1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i\
			/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8\
			IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADq\
			YAAAOpgAABdvkl/FRgAAANNJREFUeNqslD0OhCAQhR8rXMaEU9hY2djYUngqC0/gETyFidd52yxm\
			+BEx2UkMzPD4mJkIiiRemBQr6euCUG64rG1bAMB5nhRzqCgjWmsv5ziOGHSJrbV+PZsRmqYpleah\
			FDqVBWmtq5oV65JdxpgqUKzTcf0ZEOOGl0Dsui4R+Ni+7wksOZAk+75nycQ6fl8S054+DEN1P25L\
			M8Zg27Zb0DiOj6CPDE7TlB1rMgpAT2MJpEjSOff436zrGvjOuSCm+PL6z/MMAFiWJZirfz0j3wEA\
			emp/gv47IxYAAAAASUVORK5CYII=') 14 8, pointer";

		var kNewLine = "\n";

		var kPaneStateFrozen = "frozen";
		var kPaneStateFrozenSplit = "frozenSplit";

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


		function WorksheetViewSettings() {
			if ( !(this instanceof WorksheetViewSettings) ) {
				return new WorksheetViewSettings();
			}
			this.header = {
				style: [
				// Header colors
				{ // kHeaderDefault
					background: new CColor(244, 244, 244),
					border: new CColor(213, 213, 213),
					color: new CColor(54, 54, 54)
				},
				{ // kHeaderActive
					background: new CColor(193, 193, 193),
					border: new CColor(146, 146, 146),
					color: new CColor(54, 54, 54)
				},
				{ // kHeaderHighlighted
					background: new CColor(223, 223, 223),
					border: new CColor(175, 175, 175),
					color: new CColor(101, 106, 112)
				},
				{ // kHeaderSelected
					background: new CColor(170, 170, 170),
					border: new CColor(117, 119, 122),
					color: new CColor(54, 54, 54)
				}
				],
				cornerColor: new CColor(193, 193, 193)
			};
			this.cells = {
				fontName: "Calibri",
				fontSize: 11,
				defaultState: {
					background: new CColor(255, 255, 255),
					border: new CColor(218, 220, 221),
					color: new CColor(0, 0, 0)
				},
				padding: 2/*px horizontal padding*/
			};
			this.activeCellBorderColor			= new CColor(105, 119, 62, 0.7);
			this.activeCellBackground			= new CColor(157, 185, 85, 0.2);

			this.formulaRangeBorderColor		= [	new CColor(0, 53, 214) , new CColor(216, 0, 0) , new CColor(214, 160, 0),
													new CColor(107, 214, 0), new CColor(0, 214, 53), new CColor(0, 214, 214),
													new CColor(107, 0, 214), new CColor(214, 0, 160)];
			// Цвет заливки границы выделения области автозаполнения
			this.fillHandleBorderColorSelect	= new CColor(255, 255, 255, 1);

			// Цвет закрепленных областей
			this.frozenColor					= new CColor(0, 0, 0, 1);
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
			this.isMerged = false;
			this.textAlign = kNone;
		}
		CellFlags.prototype.clone = function () {
			var oRes = new CellFlags();
			oRes.wrapText = this.wrapText;
			oRes.shrinkToFit = this.shrinkToFit;
			oRes.isMerged = this.isMerged;
			oRes.textAlign = this.textAlign;
			return oRes;
		};


		/**
		 * Widget for displaying and editing Worksheet object
		 * -----------------------------------------------------------------------------
		 * @param {Worksheet} model  Worksheet
		 * @param {Object} handlers  Event handlers
		 * @param {Array} buffers    DrawingContext + Overlay
		 * @param {StringRender} stringRender    StringRender
		 * @param {Number} maxDigitWidth    Максимальный размер цифры
		 * @param {asc_CCollaborativeEditing} collaborativeEditing
		 * @param {Object} settings  Settings
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function WorksheetView(model, handlers, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings) {
			if ( !(this instanceof WorksheetView) ) {
				return new WorksheetView(model, handlers, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings);
			}

			this.defaults = new WorksheetViewSettings();
			this.settings = $.extend(true, {}, this.defaults, settings);

			var cells = this.settings.cells;
			cells.fontName = model.workbook.getDefaultFont();
			cells.fontSize = model.workbook.getDefaultSize();

			this.vspRatio = 1.275;

			this.handlers = new asc.asc_CHandlersList(handlers);

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

			var cnv = document.createElement("canvas");
			cnv.width = 2;
			cnv.height = 2;
			var ctx = cnv.getContext("2d");
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, 1, 1);
			ctx.fillRect(1, 1, 1, 1);
			this.ptrnLineDotted1 = ctx.createPattern(cnv, "repeat");

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
			this.visibleRange = asc_Range(0, 0, 0, 0);
			this.activeRange = new asc_ActiveRange(0, 0, 0, 0);
			this.isChanged = false;
			this.isCellEditMode = false;
			this.isFormulaEditMode = false;
			this.isChartAreaEditMode = false;
			this.lockDraw = false;
			this.isSelectOnShape = false;	// Выделен shape

			this.isFormatPainter = false;

			this.isSelectionDialogMode = false;
			this.copyOfActiveRange = null;

			this.startCellMoveResizeRange = null;
			this.startCellMoveResizeRange2 = null;
			
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
			this.autoFilters = new asc_AF(this);
			this.drawingArea = new DrawingArea(this);
			this.cellCommentator = new asc_CCellCommentator(this);
			this.objectRender = null;

			this._init();

			return this;
		}

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
				this._prepareCellTextMetricsCache(this.visibleRange);
				this.updateResize = false;
				
				this.objectRender.resizeCanvas();
				this.objectRender.setScrollOffset();
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
				this.cleanSelection();
				this._initConstValues();
				this._initCellsArea(false);
				this._normalizeViewRange();
				this._cleanCellsTextMetricsCache();
				this._shiftVisibleRange();
				this._prepareCellTextMetricsCache(this.visibleRange);
				this._shiftVisibleRange();
				this.cellCommentator.updateCommentPosition();
				this.updateZoom = false;
			} else {
				this.updateZoom = true;
			}
			return this;
		};
		WorksheetView.prototype.changeZoomResize = function () {
			this.cleanSelection();
			this._initConstValues();
			this._initCellsArea(true);
			this._normalizeViewRange();
			this._cleanCellsTextMetricsCache();
			this._shiftVisibleRange();
			this._prepareCellTextMetricsCache(this.visibleRange);
			this._shiftVisibleRange();
			this.cellCommentator.updateCommentPosition();

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
                        offsetFrozenX = t.cols[cFrozen].left - t.cols[0].left;
                }
            }
			var offsetX = t.cols[c1].left - t.cellsLeft;
			offsetX -= offsetFrozenX;

			var x1 = t.cols[col].left - offsetX - this.width_1px;
			var w = Math.max(x2 - x1, 0);
			var cc = Math.min(t._colWidthToCharCount(w), /*max col width*/255);
			var cw = t._charCountToModelColWidth(cc);

			var onChangeWidthCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.model.setColWidth(cw, col, col);
				t._cleanCache(asc_Range(0, 0, t.cols.length - 1, t.rows.length - 1));
				t.changeWorksheet("update");
				t._updateVisibleColsCount();
			};
			return this._isLockedAll (onChangeWidthCallback);
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
                        offsetFrozenY = t.rows[rFrozen].left - t.rows[0].left;
                }
            }
			var offsetY = t.rows[r1].top - t.cellsTop;
			offsetY -= offsetFrozenY;

			var y1 = t.rows[row].top - offsetY - this.height_1px;

			var onChangeHeightCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.model.setRowHeight(Math.min(t.maxRowHeight, Math.max(y2 - y1 + t.height_1px, 0)), row, row);
				t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
				t.changeWorksheet("update");
				t._updateVisibleRowsCount();
			};
			return this._isLockedAll (onChangeHeightCallback);
		};


		// Проверяет, есть ли числовые значения в диапазоне
		WorksheetView.prototype._hasNumberValueInActiveRange = function () {
			var cell, cellType, isNumberFormat;
			var result = null;
			if (this._rangeIsSingleCell(this.activeRange)) {
				// Для одной ячейки не стоит ничего делать
				return result;
			}
			var mergedRange = this.model.getMergedByCell(this.activeRange.r1, this.activeRange.c1);
			if (mergedRange && mergedRange.isEqual(this.activeRange)) {
				// Для одной ячейки не стоит ничего делать
				return result;
			}

			function cmpNum(a, b) {return a - b;}

			for (var c = this.activeRange.c1; c <= this.activeRange.c2; ++c) {
				for (var r = this.activeRange.r1; r <= this.activeRange.r2; ++r) {
					cell = this._getCellTextCache(c, r);
					if (cell) {
						// Нашли не пустую ячейку, проверим формат
						cellType = cell.cellType;
						isNumberFormat = (null == cellType || CellValueType.Number === cellType);
						if (isNumberFormat) {
							if (null === result) {
								result = {};
								result.arrCols = [];
								result.arrRows = [];
							}
							result.arrCols.push(c);
							result.arrRows.push(r);
						}
					}
				}
			}
			if (null !== result) {
				// Делаем массивы уникальными и сортируем
				$.unique(result.arrCols);
				$.unique(result.arrRows);
				result.arrCols = result.arrCols.sort(cmpNum);
				result.arrRows = result.arrRows.sort(cmpNum);
			}
			return result;
		};

		// Автодополняет формулу диапазоном, если это возможно
		WorksheetView.prototype.autoCompletFormula = function (functionName) {
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

				var onAutoCompletFormula = function (isSuccess) {
					if (false === isSuccess)
						return;

					History.Create_NewPoint();
					History.SetSelection(arHistorySelect.clone());
					History.SetSelectionRedo(arCopy.clone());
					History.StartTransaction();

					asc_applyFunction(functionAction);

					History.EndTransaction();
				};

				// Можно ли применять автоформулу
				this._isLockedCells (changedRange, /*subType*/null, onAutoCompletFormula);

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
					result = asc_Range(c, leftCell.r, ar.startCol - 1, leftCell.r);
				} else {
					// Одна ячейка
					result = asc_Range(c, leftCell.r, c, leftCell.r);
				}
				result.type = c_oAscSelectionType.RangeCells;
				this._fixSelectionOfMergedCells(result);
				result.normalize();
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
					result = asc_Range(topCell.c, r, topCell.c, ar.startRow - 1);
				} else {
					// Одна ячейка
					result = asc_Range(topCell.c, r, topCell.c, r);
				}
				result.type = c_oAscSelectionType.RangeCells;
				this._fixSelectionOfMergedCells(result);
				result.normalize();
				if (result.c1 === result.c2 && result.r1 === result.r2)
					result.text = this._getCellTitle(result.c1, result.r1);
				else
					result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
				return result;
			}
		};

		// ToDo переделать на полную отрисовку на нашем контексте
		WorksheetView.prototype.getDrawingContextCharts = function () {
			return this.handlers.trigger("getDCForCharts");
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
			this._prepareCellTextMetricsCache(this.visibleRange);

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
				if (!aCFs.hasOwnProperty(i) )
					continue;
				aRules = aCFs[i].aRules;
				if (0 >= aRules.length)
					continue;
				for (var j in aRules) {
					if (!aRules.hasOwnProperty(j))
						continue;

					oRule = aRules[j];
					// ToDo aboveAverage, beginsWith, cellIs, containsBlanks, containsErrors,
					// ToDo containsText, dataBar, duplicateValues, endsWith, expression, iconSet, notContainsBlanks,
					// ToDo notContainsErrors, notContainsText, timePeriod, top10, uniqueValues (page 2679)
					switch (oRule.Type) {
						case "colorScale":
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
									if (arrayCells.hasOwnProperty(cell)) {
										var dxf = new CellXfs();
										dxf.fill = new Fill({bg:oGradient.calculateColor(arrayCells[cell].val)});
										arrayCells[cell].cell.setConditionalFormattingStyle(dxf);
									}
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
			var commentList = [];
			for (var i = 0; i < this.model.aComments.length; i++) {
				var comment = { "Id": this.model.aComments[i].asc_getId(), "Comment": this.model.aComments[i] };
				this.cellCommentator.addCommentSerialize(comment["Comment"]);
				commentList.push(comment);
			}
			if ( commentList.length )
				this.model.workbook.handlers.trigger("asc_onAddComments", commentList);
		};

		WorksheetView.prototype._prepareDrawingObjects = function () {
			this.objectRender = new DrawingObjects();
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

			gc_dDefaultColWidthCharsAttribute = this._charCountToModelColWidth(this.defaultColWidthChars, true);
			this.defaultColWidth = this._modelColWidthToColWidth(gc_dDefaultColWidthCharsAttribute);

			// ToDo разобраться со значениями
			this.maxRowHeight = asc_calcnpt(409, this._getPPIY());
			this.defaultRowDescender = this._calcRowDescender(this.settings.cells.fontSize);
			this.defaultRowHeight = asc_calcnpt(this.settings.cells.fontSize * this.vspRatio, this._getPPIY()) + this.height_1px;
			gc_dDefaultRowHeightAttribute = this.model.getDefaultHeight() || this.defaultRowHeight;

			var cells = this.settings.cells;
			this._setFont(undefined, cells.fontName, cells.fontSize);
			var sr = this.stringRender;
			var tm = this._roundTextMetrics(sr.measureString("A"));
			this.headersHeightByFont = tm.height;
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
			this._calcHeaderRowHeight();
			this._calcRowHeights(fullRecalc ? 1 : 0);
			this.visibleRange.r2 = 0;
			this._calcVisibleRows();
			this._updateVisibleRowsCount(/*skipScrolReinit*/true);

			// calculate columns widths and visible columns
			this._calcHeaderColumnWidth();
			this._calcColumnWidths(fullRecalc ? 1 : 0);
			this.visibleRange.c2 = 0;
			this._calcVisibleColumns();
			this._updateVisibleColsCount(/*skipScrolReinit*/true);
		};

		WorksheetView.prototype._initPane = function () {
			var pane = this.model.sheetViews[0].pane;
			if (null !== pane) {
				// ToDo Обрабатываем пока только frozen и frozenSplit
				if (kPaneStateFrozen === pane.state || kPaneStateFrozenSplit === pane.state) {
					this.topLeftFrozenCell = new CellAddress(pane.topLeftCell);
					if (!this.topLeftFrozenCell.isValid())
						this.topLeftFrozenCell = null;
					else {
						this.visibleRange.r1 = this.topLeftFrozenCell.getRow0();
						this.visibleRange.c1 = this.topLeftFrozenCell.getCol0();
					}
				}
			}
		};

		/**
		 * Вычисляет ширину столбца для заданного количества символов
		 * @param {Number} count  Количество символов
		 * @param {Boolean} displayWidth  При расчете использовать целое число пикселов
		 * @returns {Number}      Ширина столбца в символах
		 */
		WorksheetView.prototype._charCountToModelColWidth = function (count, displayWidth) {
			if (count <= 0) { return 0; }
			var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
			return asc_floor((count * maxw + 5) / maxw * 256) / 256; // 5 - Это padding + border
		};

		/**
		 * Вычисляет ширину столбца в пунктах
		 * @param {Number} mcw  Количество символов
		 * @param {Boolean} displayWidth  При расчете использовать целое число пикселов
		 * @returns {Number}    Ширина столбца в пунктах (pt)
		 */
		WorksheetView.prototype._modelColWidthToColWidth = function (mcw, displayWidth) {
			var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
			var px = asc_floor( (( 256 * mcw + asc_floor(128 / maxw) ) / 256) * maxw );
			return px * asc_getcvt( 0/*px*/, 1/*pt*/, 96 );
		};

		/**
		 * Вычисляет количество символов по ширине столбца
		 * @param {Number} w  Ширина столбца в пунктах
		 * @returns {Number}  Количество символов
		 */
		WorksheetView.prototype._colWidthToCharCount = function (w) {
			var px = w * asc_getcvt( 1/*pt*/, 0/*px*/, 96 );
			return px <= 5 ? 0 : asc_floor( (px - 5) / asc_round(this.maxDigitWidth) * 100 + 0.5 ) / 100;
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
			return asc_calcnpt(fontSize * (this.vspRatio - 1), this._getPPIY());
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
		WorksheetView.prototype._calcColumnWidths = function (fullRecalc) {
			var x = this.cellsLeft;
			var visibleW = this.drawingCtx.getWidth();
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var l = Math.max(this.model.getColsCount(), this.nColsCount, obr.maxCol);
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
		};

		/**
		 * Вычисляет высоту и позицию строк (в pt)
		 * @param {Number} fullRecalc  0 - без пересчета; 1 - пересчитываем все; 2 - пересчитываем новые строки
		 */
		WorksheetView.prototype._calcRowHeights = function (fullRecalc) {
			var y = this.cellsTop;
			var visibleH = this.drawingCtx.getHeight();
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var l = Math.max(this.model.getRowsCount() , this.nRowsCount, obr.maxRow);
			var defaultH = this.model.getDefaultHeight() || this.defaultRowHeight;
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
				} else if (row.hd) {
					hR = h = 0;  // Скрытая строка, высоту выставляем 0
					isCustomHeight = true;
					hiddenH += row.h > 0 ? row.h - this.height_1px : defaultH;
				} else {
					isCustomHeight = !!row.CustomHeight;
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

			for (var x = lc.left + lc.width; x < rightSide || !done; ++i) {
				if (x >= rightSide) {
					// add +1 column at the end and exit cycle
					done = true;
				}
				this.cols[i] = this._calcColWidth( this.model.getColWidth(i) );
				this.cols[i].left = x;
				x += this.cols[i].width;
				this.isChanged = true;
			}
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

		WorksheetView.prototype._shiftVisibleRange = function () {
			var t = this;
			var vr = t.visibleRange;
			var arn = t.activeRange.clone(true);
			var i;

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
				if (arn.r1 < vr.r1) {
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
				if (arn.c1 < vr.c1) {
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
				range = asc_Range(0, 0, maxCols, maxRows);
				this._prepareCellTextMetricsCache(range);
				for (var c = 0; c < maxCols; ++c) {
					for (var r = 0; r < maxRows; ++r) {
						if (!this._isCellEmptyOrMergedOrBackgroundColorOrBorders(c, r)) {
								var rightSide = 0;
								var ct = this._getCellTextCache(c, r);
								if (ct !== undefined) {
									var isMerged = ct.flags.isMerged, isWrapped = ct.flags.wrapText;
									if (!isMerged && !isWrapped)
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
				range = asc_Range(0, 0, maxCols, maxRows);
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

			if (null === pageGridLines || undefined === pageGridLines) { pageGridLines = c_oAscPrintDefaultSettings.PageGridLines; }
			if (null === pageHeadings || undefined === pageHeadings) { pageHeadings = c_oAscPrintDefaultSettings.PageHeadings; }

			if (null === pageWidth || undefined === pageWidth) { pageWidth = c_oAscPrintDefaultSettings.PageWidth; }
			if (null === pageHeight || undefined === pageHeight) { pageHeight = c_oAscPrintDefaultSettings.PageHeight; }
			if (null === pageOrientation || undefined === pageOrientation) { pageOrientation = c_oAscPrintDefaultSettings.PageOrientation; }

			if (null === pageLeftField || undefined === pageLeftField) { pageLeftField = c_oAscPrintDefaultSettings.PageLeftField; }
			if (null === pageRightField || undefined === pageRightField) { pageRightField = c_oAscPrintDefaultSettings.PageRightField; }
			if (null === pageTopField || undefined === pageTopField) { pageTopField = c_oAscPrintDefaultSettings.PageTopField; }
			if (null === pageBottomField || undefined === pageBottomField) { pageBottomField = c_oAscPrintDefaultSettings.PageBottomField; }

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

					newPagePrint.pageRange = asc_Range(currentColIndex, currentRowIndex, colIndex - 1, rowIndex - 1);

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

				// Отрисовываем ячейки
				this._drawCells(drawingCtx, range, offsetX, offsetY);

				if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

				// Отрисовываем бордеры
				this._drawCellsBorders(drawingCtx, range, offsetX, offsetY);

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
			if( lockDraw ) return this;
			this._clean();
			this._drawCorner();
			this._drawColumnHeaders(/*drawingCtx*/ undefined);
			this._drawRowHeaders(/*drawingCtx*/ undefined);
			this._drawGrid(/*drawingCtx*/ undefined);
			this._drawCells(/*drawingCtx*/undefined);
			this._drawCellsBorders(/*drawingCtx*/undefined);
			this._drawFrozenPane();
			this._drawFrozenPaneLines();
			this._fixSelectionOfMergedCells();
			this._fixSelectionOfHiddenCells();
			this._drawAutoF();
			this.cellCommentator.drawCommentCells();
			this.objectRender.showDrawingObjects(false);
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
			var cells = this.settings.cells;
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

			this._setFont(drawingCtx, cells.fontName, cells.fontSize);

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
			var cells = this.settings.cells;
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

			this._setFont(drawingCtx, cells.fontName, cells.fontSize);

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
			var x2 = x + w - this.width_1px;
			var y2 = y + h - this.height_1px;

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
				ctx.lineHor(x, y - this.height_1px, x2 + this.width_1px);
			}
			// Right border
			ctx.lineVer(x2, y, y2);
			// Bottom border
			ctx.lineHor(x, y2, x2 + this.width_1px);
			if (style !== kHeaderDefault && isColHeader) {
				// Select col (left border)
				ctx.lineVer(x - this.width_1px, y, y2 + this.height_1px);
			}
			ctx.stroke();

			// Для невидимых кроме border-а ничего не рисуем
			if (isZeroHeader || -1 === index)
				return;

			// draw text
			var text  = isColHeader ? this._getColumnTitle(index) : this._getRowTitle(index);
			var sr    = this.stringRender;
			var tm    = this._roundTextMetrics( sr.measureString(text) );
			var bl    = y2 - (isColHeader ? this.defaultRowDescender : this.rows[index].descender);
			var textX = this._calcTextHorizPos(x, x2, tm, tm.width < w ? khaCenter : khaLeft);
			var textY = this._calcTextVertPos(y, y2, bl, tm, kvaBottom);
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
				this.drawingCtx.clearRect(
					this.cols[i].left - offsetX - this.width_1px, this.headersTop,
					this.cols[i].width + this.width_1px, this.headersHeight);
			}
			if (0 !== cFrozen) {
				offsetX = this.cols[0].left - this.cellsLeft;
				// Почистим для pane
				colStart = Math.max(0, colStart);
				colEnd = Math.min(cFrozen, colEnd);
				for (i = colStart; i <= colEnd; ++i) {
					this.drawingCtx.clearRect(
						this.cols[i].left - offsetX - this.width_1px, this.headersTop,
						this.cols[i].width + this.width_1px, this.headersHeight);
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
				this.drawingCtx.clearRect(
					this.headersLeft, this.rows[i].top - offsetY - this.height_1px,
					this.headersWidth, this.rows[i].height + this.height_1px);
			}
			if (0 !== rFrozen) {
				offsetY = this.rows[0].top - this.cellsTop;
				// Почистим для pane
				rowStart = Math.max(0, rowStart);
				rowEnd = Math.min(rFrozen, rowEnd);
				for (i = rowStart; i <= rowEnd; ++i) {
					if (this.height_1px > this.rows[i].height)
						continue;
					this.drawingCtx.clearRect(
						this.headersLeft, this.rows[i].top - offsetY - this.height_1px,
						this.headersWidth, this.rows[i].height + this.height_1px);
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
			for (var i = range.c1, x = x1 - this.width_1px; i <= range.c2 && x <= x2; ++i) {
				w = c[i].width;
				x += w;
				if (w >= this.width_1px)
					ctx.lineVer(x, y1, y2);
			}
			for (var j = range.r1, y = y1 - this.height_1px; j <= range.r2 && y <= y2; ++j) {
				h = r[j].height;
				y += h;
				if (h >= this.height_1px)
					ctx.lineHor(x1, y, x2);
			}

			ctx.stroke();
		};

		/** Рисует ячейки таблицы */
		WorksheetView.prototype._drawCells = function (drawingCtx, range, offsetXForDraw, offsetYForDraw) {
			if (range === undefined) {
				range = this.visibleRange;
			}

			this._prepareCellTextMetricsCache(range);

			var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
			var offsetX = (undefined === offsetXForDraw) ? this.cols[this.visibleRange.c1].left - this.cellsLeft : offsetXForDraw;
			var offsetY = (undefined === offsetYForDraw) ? this.rows[this.visibleRange.r1].top - this.cellsTop : offsetYForDraw;
			if (undefined === drawingCtx && this.topLeftFrozenCell) {
				if (undefined === offsetXForDraw) {
					var cFrozen = this.topLeftFrozenCell.getCol0();
					offsetX -= this.cols[cFrozen].left - this.cols[0].left;
				}
				if (undefined === offsetYForDraw) {
					var rFrozen = this.topLeftFrozenCell.getRow0();
					offsetY -= this.rows[rFrozen].top - this.rows[0].top;
				}
			}
			var mergedCells = {}, mc, i;

			if (!drawingCtx) {
				// set clipping rect to cells area
				ctx.save()
					.beginPath()
					.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
					.clip();
			}

			for (var row = range.r1; row <= range.r2; ++row) {
				$.extend( mergedCells,
				          this._drawRowBG(drawingCtx, row, range.c1, range.c2, offsetX, offsetY, null),
				          this._drawRowText(drawingCtx, row, range.c1, range.c2, offsetX, offsetY) );
			}
			// draw merged cells at last stage to fix cells background issue
			for (i in mergedCells) if (mergedCells.hasOwnProperty(i)) {
				mc = mergedCells[i];
				this._drawRowBG(drawingCtx, mc.r1, mc.c1, mc.c1, offsetX, offsetY, mc);
				this._drawCellText(drawingCtx, mc.c1, mc.r1, range.c1, range.c2, offsetX, offsetY, true);
			}

			if (!drawingCtx) {
				// restore canvas' original clipping range
				ctx.restore();
			}
		};

		/** Рисует фон ячеек в строке */
		WorksheetView.prototype._drawRowBG = function (drawingCtx, row, colStart, colEnd, offsetX, offsetY, oMergedCell) {
			if (this.rows[row].height < this.height_1px && null === oMergedCell) {return {};}

			var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
			for (var mergedCells = {}, col = colStart; col <= colEnd; ++col) {
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
					for (var i = mc.c1 + 1; i <= mc.c2 && i < this.nColsCount; ++i) {mwidth += this.cols[i].width;}
					for (var j = mc.r1 + 1; j <= mc.r2 && j < this.nRowsCount; ++j) {mheight += this.rows[j].height;}
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
				ctx.setFillStyle(color)
					.fillRect(x - offsetX, y - offsetY, w, h);
			}
			return mergedCells;
		};

		/** Рисует текст ячеек в строке */
		WorksheetView.prototype._drawRowText = function (drawingCtx, row, colStart, colEnd, offsetX, offsetY) {
			if (this.rows[row].height < this.height_1px) {return {};}

			var dependentCells = {}, mergedCells = {}, i = undefined, mc;
			// draw cells' text
			for (var col = colStart; col <= colEnd; ++col) {
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
			for (i in dependentCells) if (dependentCells.hasOwnProperty(i)) {
				var arr = dependentCells[i], j = arr.length - 1;
				col = parseInt(i, 10);
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

            var isMerged = ct.flags.isMerged, range = undefined, isWrapped = ct.flags.wrapText;
            var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;

            if (isMerged) {
                range = ct.mc;
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
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			ctx.setFillStyle(this.settings.cells.defaultState.background);
			for (var col = colBeg; col < colEnd; ++col) {
				var c = this._getCell(col, row);
				var bg = c !== undefined ? c.getFill() : null;
				if (bg !== null) {continue;}
				ctx.fillRect(
					this.cols[col].left + this.cols[col].width - offsetX - this.width_1px,
					this.rows[row].top - offsetY,
					this.width_1px,
					this.rows[row].height - this.height_1px);
			}
		};

		/** Рисует рамки для ячеек */
		WorksheetView.prototype._drawCellsBorders = function (drawingCtx, range, leftFieldInPt, topFieldInPt) {
			//TODO: использовать стили линий при рисовании границ
			if (range === undefined) {
				range = this.visibleRange;
			}
			var t = this;
			var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
			var c = this.cols;
			var r = this.rows;
			var offsetX = (undefined !== leftFieldInPt) ? leftFieldInPt : c[this.visibleRange.c1].left - this.cellsLeft;
			var offsetY = (undefined !== topFieldInPt) ? topFieldInPt : r[this.visibleRange.r1].top - this.cellsTop;
			var bc = undefined; // cached border color
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

			// ToDo в одну функцию
			function drawBorderHor(border, x1, y, x2) {
				if (border.s !== c_oAscBorderStyles.None) {
					if (bc !== border.c) {
						bc = border.c;
						ctx.setStrokeStyle(bc);
					}
					ctx.setLineWidth(border.w)
						.beginPath()
						.lineHor(x1, y, x2)
						.stroke();
				}
			}

			function drawBorderVer(border, x1, y1, y2) {
				if (border.s !== c_oAscBorderStyles.None) {
					if (bc !== border.c) {
						bc = border.c;
						ctx.setStrokeStyle(bc);
					}
					ctx.setLineWidth(border.w)
						.beginPath()
						.lineVer(x1, y1, y2)
						.stroke();
				}
			}

			function drawDiagonal(border, x1, y1, x2, y2) {
				if (border.s !== c_oAscBorderStyles.None) {
					if (bc !== border.c) {
						bc = border.c;
						ctx.setStrokeStyle(bc);
					}
					ctx.setLineWidth(border.w)
						.beginPath()
						.lineDiag(x1, y1, x2, y2)
						.stroke();
				}
			}

			function drawVerticalBorder(borderLeft, borderRight, x, y1, y2) {
				var border;
				if (borderLeft && borderLeft.r.w)
					border = borderLeft.r;
				else if (borderRight && borderRight.l.w)
					border = borderRight.l;
				if (!border || border.w < 1) {return;}

				// ToDo переделать рассчет
				var tbw = t._calcMaxBorderWidth(borderLeft && borderLeft.t, borderRight && borderRight.t); // top border width
				var bbw = t._calcMaxBorderWidth(borderLeft && borderLeft.b, borderRight && borderRight.b); // bottom border width
				var dy1 = tbw > border.w ? tbw - 1 : (tbw > 1 ? -1 : 0);
				var dy2 = bbw > border.w ? -2 : (bbw > 2 ? 1 : 0);

				drawBorderVer(border, x, y1 + (-1 + dy1) * t.height_1px, y2 + (1 + dy2) * t.height_1px);
			}

			function drawHorizontalBorder(borderTop, borderBottom, x1, y, x2) {
				var border;
				if (borderTop && borderTop.b.w)
					border = borderTop.b;
				else if (borderBottom && borderBottom.t.w)
					border = borderBottom.t;

				if (border && border.w > 0) {
					// ToDo переделать рассчет
					var lbw = t._calcMaxBorderWidth(borderTop && borderTop.l, borderBottom && borderBottom.l);
					var rbw = t._calcMaxBorderWidth(borderTop && borderTop.r, borderBottom && borderBottom.r);
					var dx1 = border.w > lbw ? (lbw > 1 ? -1 : 0) : (lbw > 2 ? 2 : 1);
					var dx2 = border.w > rbw ? (rbw > 2 ? 1 : 0) : (rbw > 1 ? -2 : -1);
					drawBorderHor(border, x1 + (-1 + dx1) * t.width_1px, y, x2 + (1 + dx2) * t.width_1px);
				}
			}

			// set clipping rect to cells area
			if (!drawingCtx) {
				ctx.save()
					.beginPath()
					.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
					.clip();
			}

			var arrPrevRow = [];
			var arrCurrRow = [];
			var arrNextRow = [];
			var bCur, bPrev, bNext, bTopCur, bTopPrev, bTopNext, bBotCur, bBotPrev, bBotNext;
			var row = range.r1 - 1, col, prevCol = range.c1 - 1;
			// Сначала пройдемся по верхней строке (над отрисовываемым диапазоном)
			while (0 <= row) {
				if (r[row].height >= t.height_1px) {
					for (col = prevCol; col <= range.c2 && col < t.nColsCount; ++col) {
						if (0 > col || c[col].width < t.width_1px) {continue;}
						arrPrevRow[col] = t._getVisibleCell(col, row).getBorder();
					}
					break;
				}
				--row;
			}
			// Теперь определим первую колонку (т.к. могут быть скрытые колонки)
			while (0 <= prevCol && c[prevCol].width < t.width_1px)
				--prevCol;

			var mc, isMerged;
			var isPrevColExist = (0 <= prevCol);
			for (row = range.r1; row <= range.r2 && row < t.nRowsCount; ++row) {
				if (r[row].height < t.height_1px) {continue;}
				var isFirstRow = row === range.r1;
				var isLastRow  = row === range.r2;
				var nextRow = row + 1;

				var rowCache = t._fetchRowCache(row);
				var y1 = r[row].top - offsetY;
				var y2 = y1 + r[row].height - this.height_1px;

				for (col = range.c1, isMerged = false; col <= range.c2 && col < t.nColsCount; ++col, isMerged = false) {
					if (c[col].width < this.width_1px) {continue;}
					var isFirstCol = col === range.c1;
					var isLastCol = col === range.c2;
					var nextCol = col + 1;

					if (mc && mc.c2 >= col) {
						isMerged = true;
					} else {
						mc = this.model.getMergedByCell(row, col);
						if (mc)
							isMerged = true;
					}

					var x1 = c[col].left - offsetX;
					var x2 = x1 + c[col].width - this.width_1px;

					if (row === t.nRowsCount) {
						bBotPrev = bBotCur = bBotNext = undefined;
					} else {
						if (isFirstCol) {
							bBotPrev = arrNextRow[prevCol] = isPrevColExist ?
								t._getVisibleCell(prevCol, nextRow).getBorder() : undefined;
							bBotCur = arrNextRow[col] = t._getVisibleCell(col, nextRow).getBorder();
						} else {
							bBotPrev = bBotCur;
							bBotCur = bBotNext;
						}
					}

					if (isFirstCol) {
						bPrev = arrCurrRow[prevCol] = isPrevColExist ?
							t._getVisibleCell(prevCol, row).getBorder() : undefined;
						arrCurrRow[col] = bCur = t._getVisibleCell(col, row).getBorder();
						bTopPrev = arrPrevRow[prevCol];
						bTopCur = arrPrevRow[col];
					} else {
						bPrev = bCur;
						bCur = bNext;
						bTopPrev = bTopCur;
						bTopCur = bTopNext;
					}

					if (col === t.nColsCount) {
						bNext = undefined;
						bTopNext = undefined;
					} else {
						bNext = arrCurrRow[nextCol] = t._getVisibleCell(nextCol, row).getBorder();
						bTopNext = arrPrevRow[nextCol];

						if (row === t.nRowsCount)
							bBotNext = undefined;
						else
							bBotNext = arrNextRow[nextCol] = t._getVisibleCell(nextCol, nextRow).getBorder();
					}

					if (isMerged && row !== mc.r1 && row !== mc.r2 && col !== mc.c1 && col !== mc.c2)
						continue;

					// draw diagonal borders
					if ((bCur.dd || bCur.du) && (!isMerged || (row === mc.r1 && col === mc.c1))) {
						var x2Diagonal = x2;
						var y2Diagonal = y2;
						if (isMerged) {
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
						if (bCur.dd) {
							// draw diagonal line l,t - r,b
							drawDiagonal(bCur.d, x1 - t.width_1px, y1 - t.height_1px, x2Diagonal, y2Diagonal);
						}
						if (bCur.du) {
							// draw diagonal line l,b - r,t
							drawDiagonal(bCur.d, x1 - t.width_1px, y2Diagonal, x2Diagonal, y1 - t.height_1px);
						}
						// ToDo Clip diagonal borders
						//ctx.restore();
						// canvas context has just been restored, so destroy border color cache
						//bc = undefined;
					}

					// draw left border
					if (isFirstCol && !t._isLeftBorderErased1(col, rowCache)) {
						drawVerticalBorder(bPrev, bCur, x1 - t.width_1px, y1, y2);
						// Если мы в печати и печатаем первый столбец, то нужно напечатать бордеры
//						if (lb.w >= 1 && drawingCtx && 0 === col) {
							// Иначе они будут не такой ширины
							// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawVerticalBorder(lb, tb, tbPrev, bb, bbPrev, x1, y1, y2);
//						}
					}
					// draw right border
					if ((!isMerged || isLastCol) && !t._isRightBorderErased1(col, rowCache)) {
						drawVerticalBorder(bCur, bNext, x2, y1, y2);
					}
					// draw top border
					if (isFirstRow) {
						drawHorizontalBorder(bTopCur, bCur, x1, y1 - t.height_1px, x2);
						// Если мы в печати и печатаем первую строку, то нужно напечатать бордеры
//						if (tb.w > 0 && drawingCtx && 0 === row) {
							// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawHorizontalBorder.call(this, tb, lb, lbPrev, rb, rbPrev, x1, y1, x2);
//						}
					}
					if (!isMerged || isLastRow) {
						// draw bottom border
						drawHorizontalBorder(bCur, bBotCur, x1, y2, x2);
					}
				}

				mc = undefined;

				arrPrevRow = arrCurrRow;
				arrCurrRow = arrNextRow;
				arrNextRow = [];
			}

			if (!drawingCtx)
				ctx.restore();
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
					tmpRange = asc_Range(0, 0, col - 1, row - 1);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCells(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
						this._drawCellsBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
				if (0 < row) {
					row -= 1;
					offsetX = undefined;
					offsetY = this.rows[0].top - this.cellsTop;
					tmpRange = asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, row);
					this._drawRowHeaders(/*drawingCtx*/ undefined, 0, row, kHeaderDefault, offsetX, offsetY);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCells(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
						this._drawCellsBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
				if (0 < col) {
					col -= 1;
					offsetX = this.cols[0].left - this.cellsLeft;
					offsetY = undefined;
					tmpRange = asc_Range(0, this.visibleRange.r1, col, this.visibleRange.r2);
					this._drawColumnHeaders(/*drawingCtx*/ undefined, 0, col, kHeaderDefault, offsetX, offsetY);
					if (!noCells) {
						this._drawGrid(/*drawingCtx*/ undefined, tmpRange, offsetX, offsetY);
						this._drawCells(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
						this._drawCellsBorders(/*drawingCtx*/undefined, tmpRange, offsetX, offsetY);
					}
				}
			}
		};

		/** Рисует закрепление областей */
		WorksheetView.prototype._drawFrozenPaneLines = function (canvas) {
			
				var _this = this;
				var callback = function(result) {
					var color = _this.settings.activeCellBorderColor;
					if ( !result )
						color = c_oAscCoAuthoringOtherBorderColor;
						
					function drawAnchor(x, y, w, h, bVertical) {
						_this.drawingCtx.beginPath().setStrokeStyle(color);
						if ( bVertical )
							_this.drawingCtx.dashLineCleverVer(x, y, y + h);
						else
							_this.drawingCtx.dashLineCleverHor(x, y, x + w);
						_this.drawingCtx.stroke();
					}
					
					// Anchor
					if ( _this.model.sheetViews[0].asc_getShowRowColHeaders() ) {
						var frozenCell = _this.topLeftFrozenCell ? _this.topLeftFrozenCell : new CellAddress(0, 0, 0);
						
						// vertical
						var _x = _this.getCellLeft(frozenCell.getCol0(), 1) - 0.5;
						var _y = _this.headersTop;
						var w = 0;
						var h = _this.headersHeight;
						drawAnchor(_x, _y, w, h, true);
						
						// horizontal
						_x = _this.headersLeft;
						_y = _this.getCellTop(frozenCell.getRow0(), 1) - 0.5;
						w = _this.headersWidth - 0.5;
						h = 0;
						drawAnchor(_x, _y, w, h, false);
					}
				
					// Lines
					if (_this.topLeftFrozenCell) {
						var ctx = canvas ? canvas : _this.drawingCtx;
						var row = _this.topLeftFrozenCell.getRow0();
						var col = _this.topLeftFrozenCell.getCol0();
						ctx.setLineWidth(1).setStrokeStyle(color).beginPath();
						if (0 < row) {
							ctx.dashLineCleverHor(0, _this.rows[row].top - _this.height_1px, ctx.getWidth());
						}
						if (0 < col) {
							ctx.dashLineCleverVer(_this.cols[col].left - _this.width_1px, 0, ctx.getHeight());
						}
						ctx.stroke();
					}
				}
				_this.objectRender.objectLocker.reset();
				_this.objectRender.objectLocker.bLock = false;
				_this.objectRender.objectLocker.addObjectId(_this.getFrozenCellId());
				_this.objectRender.objectLocker.checkObjects(callback);
		};
		
		WorksheetView.prototype._isFrozenAnchor = function(x, y) {
			
			var result = { result: false, cursor: "move", name: "" };
			if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
				return result;
				
			var _this = this;
			var frozenCell = this.topLeftFrozenCell ? this.topLeftFrozenCell : new CellAddress(0, 0, 0);
			
			x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
			y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());
			
			function isPointInAnchor(x, y, rectX, rectY, rectW, rectH) {
				var delta = 2 * asc_getcvt(0/*px*/, 1/*pt*/, _this._getPPIX());
				if ( (x >= rectX - delta) && (x <= rectX + rectW + delta) && (y >= rectY - delta) && (y <= rectY + rectH + delta) )
					return true;
				else
					return false;
			}
			
			// vertical
			var _x = this.getCellLeft(frozenCell.getCol0(), 1) - 0.5;
			var _y = _this.headersTop;
			var w = 0;
			var h = _this.headersHeight;
			if ( isPointInAnchor(x, y, _x, _y, w, h) ) {
				result.result = true;
				result.name = "frozenAnchorV";
			}
			
			// horizontal
			_x = _this.headersLeft;
			_y = this.getCellTop(frozenCell.getRow0(), 1) - 0.5;
			w = _this.headersWidth - 0.5;
			h = 0;
			if ( isPointInAnchor(x, y, _x, _y, w, h) ) {
				result.result = true;
				result.name = "frozenAnchorH";
			}
			
			return result;
		};
		
		WorksheetView.prototype._applyFrozenAnchor = function(x, y, targetInfo, bMove) {
			if ( !targetInfo )
				return;
		
			var _this = this;
			var col = 0, row = 0;
			var ctx = _this.overlayCtx;
			if ( bMove )
				ctx.clear();
				
			x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
			y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());
			
			switch (targetInfo.target) {
				case "frozenAnchorV":
					var _col = _this._findColUnderCursor(x, true);
					if ( _col && (_col.col >= 0) ) {
						col = _col.col;
						if ( bMove ) {
							ctx.setLineWidth(1).setStrokeStyle(_this.settings.activeCellBorderColor).beginPath();
							ctx.dashLineCleverVer(_this.cols[col].left - _this.width_1px, 0, ctx.getHeight());
							ctx.stroke();
						}
						else {
							if ( _this.topLeftFrozenCell )
								_this.setFrozenCell(col, _this.topLeftFrozenCell.getRow0(), false, true);
							else
								_this.setFrozenCell(col, 0, true, true);
						}
					}
					break;
				case "frozenAnchorH":
					var _row = _this._findRowUnderCursor(y, true);
					if ( _row && (_row.row >= 0) ) {
						row = _row.row;
						if ( bMove ) {
							ctx.setLineWidth(1).setStrokeStyle(_this.settings.activeCellBorderColor).beginPath();
							ctx.dashLineCleverHor(0, _this.rows[row].top - _this.height_1px, ctx.getWidth());
							ctx.stroke();
						}
						else {
							if ( _this.topLeftFrozenCell )
								_this.setFrozenCell(_this.topLeftFrozenCell.getCol0(), row, false, true);
							else
								_this.setFrozenCell(0, row, true, true);
						}
					}
					break;
			}
		};
		
		WorksheetView.prototype.setFrozenCell = function(col, row, bNew, bRedraw) {
			var _this = this;
			var callback = function(result) {
				if ( result ) {
					if ( bNew ) {
						History.Create_NewPoint();
						History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddFrozenCell, _this.model.getId(), null, new UndoRedoData_FrozenCell(row, col));
						
						_this.topLeftFrozenCell = new CellAddress(row, col, 0);
						_this.visibleRange.c1 = col;
						_this.visibleRange.r1 = row;
					}
					else {
						var compositeFroze = new UndoRedoData_CompositeFrozenCell(new UndoRedoData_FrozenCell(_this.topLeftFrozenCell.getRow0(), _this.topLeftFrozenCell.getCol0()), new UndoRedoData_FrozenCell(row, col));
						
						History.Create_NewPoint();
						History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeFrozenCell, _this.model.getId(), null, compositeFroze);
						
						_this.topLeftFrozenCell = new CellAddress(row, col, 0);
						_this.visibleRange.c1 = col;
						_this.visibleRange.r1 = row;
					}
					
					_this.objectRender.drawingArea.init();
					if ( bRedraw )
						_this.draw();
				}
				else {
					_this.overlayCtx.clear();
					_this._drawSelection();
				}
			}
		
			_this.objectRender.objectLocker.reset();
			_this.objectRender.objectLocker.addObjectId(_this.getFrozenCellId());
			_this.objectRender.objectLocker.checkObjects(callback);
		}
		
		WorksheetView.prototype.getFrozenCellId = function() {
			return "frozenCell_" + this.model.Id;
		}
		
		/** Для api закрепленных областей */
		
		WorksheetView.prototype.clearFrozenCell = function() {
			this.topLeftFrozenCell = null;
			this.visibleRange.c1 = 0;
			this.visibleRange.r1 = 0;
			this.objectRender.drawingArea.init();
			this.draw();
		}
		
		WorksheetView.prototype.setSelectedFrozenCell = function() {
			this.setFrozenCell(this.getSelectedColumnIndex(), this.getSelectedRowIndex(), true, true);
		}
		
		WorksheetView.prototype.setFirstFrozenCol = function() {
			this.setFrozenCell(1, 0, true, true);
		}
		
		WorksheetView.prototype.setFirstFrozenRow = function() {
			this.setFrozenCell(0, 1, true, true);
		}

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
				fHorLine = ctx.lineHor;
				fVerLine = ctx.lineVer;
			}

			var firstCol = oIntersection.c1 === visibleRange.c1 && !isAllRange;
			var firstRow = oIntersection.r1 === visibleRange.r1 && !isAllRange;

			var drawLeftSide	= oIntersection.c1 === range.c1;
			var drawRightSide	= oIntersection.c2 === range.c2;
			var drawTopSide		= oIntersection.r1 === range.r1;
			var drawBottomSide	= oIntersection.r2 === range.r2;

			var x1 = c[oIntersection.c1].left - offsetX - this.width_1px;
			var x2 = c[oIntersection.c2].left + c[oIntersection.c2].width - offsetX - this.width_1px;
			var y1 = r[oIntersection.r1].top - offsetY;
			var y2 = r[oIntersection.r2].top + r[oIntersection.r2].height - offsetY - this.height_1px;

			ctx.setLineWidth(lineWidth).setStrokeStyle(strokeColor);
			if (fillColor)
				ctx.setFillStyle(fillColor);
			ctx.beginPath();

			if (drawTopSide && !firstRow)
				fHorLine.apply(ctx, [x1 + this.width_1px, y1 - this.height_1px, x2 + this.width_1px]);
			if (drawBottomSide)
				fHorLine.apply(ctx, [x1 + this.width_1px, y2, x2 + this.width_1px]);
			if (drawLeftSide && !firstCol)
				fVerLine.apply(ctx, [x1, y1 - this.width_1px * !firstRow, y2 + this.width_1px]);
			if (drawRightSide)
				fVerLine.apply(ctx, [x2, y1, y2]);

			// Отрисовка квадратов для move/resize
			if (fillColor) {
				if (drawLeftSide && drawTopSide)
					ctx.fillRect(x1 + this.width_1px, y1, this.width_4px, this.height_4px);
				if (drawRightSide && drawTopSide)
					ctx.fillRect(x2 - this.width_4px, y1, this.width_4px, this.height_4px);
				if (drawRightSide && drawBottomSide)
					ctx.fillRect(x2 - this.width_4px, y2 - this.height_4px, this.width_4px, this.height_4px);
				if (drawLeftSide && drawBottomSide)
					ctx.fillRect(x1 + this.width_1px, y2 - this.height_4px, this.width_4px, this.height_4px);
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
			 * @param {Asc.Range} range
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
				range = this.copyOfActiveRange.intersection(range !== undefined ? range : this.visibleRange);

			// Copy fill Handle
			var aFH = null;
			// Вхождение range
			var aFHIntersection = null;
			if (this.activeFillHandle !== null) {
				// Мы в режиме автозаполнения
				aFH = this.activeFillHandle.clone(true);
				aFHIntersection = this.activeFillHandle.intersection(this.visibleRange);
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

			var arn = (!this.isSelectionDialogMode) ? this.activeRange.clone(true) : this.copyOfActiveRange.clone(true);
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

				var firstCell = (!this.isSelectionDialogMode) ? this.activeRange : this.copyOfActiveRange;
				cr = this.model.getMergedByCell(firstCell.startRow, firstCell.startCol);
				// Получаем активную ячейку в выделении
				cr = range.intersection(null !== cr ? cr : asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
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
					cr = range.intersection(asc_Range(range.c2, range.r2, range.c2, range.r2));
					if (cr !== null) {
						this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
						this.fillHandleR = this.fillHandleL + fillHandleWidth;
						this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
						this.fillHandleB = this.fillHandleT + fillHandleHeight;

						ctx.setFillStyle (opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);
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
			if (!isFrozen && this.isFormatPainter)
				this._drawFormatPainterRange();

			if (null !== this.activeMoveRange) {
				ctx.setStrokeStyle(new CColor(0, 0, 0))
					.setLineWidth(1)
					.beginPath();
				var aActiveMoveRangeIntersection = this.activeMoveRange.intersection(this.visibleRange);
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
			this._drawElements(this, this._drawSelectionElement, this.copyOfActiveRange, isDashLine, lineWidth, strokeColor);
		};

		WorksheetView.prototype._drawFormulaRanges = function (arrRanges){
			var lineWidth = 1, isDashLine = false,
				opt = this.settings, lengthColors = opt.formulaRangeBorderColor.length;
			var strokeColor, fillColor;
			for (var i in arrRanges) {
				if (!arrRanges.hasOwnProperty(i))
					continue;
				var oFormulaRange = arrRanges[i].clone(true);
				strokeColor = fillColor = opt.formulaRangeBorderColor[i%lengthColors];
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
					oAllRange = asc_Range (0, 0, gc_nMaxCol0, gc_nMaxRow0);
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

			if (bIsDrawObjects) {
				var arrayObjects = (c_oAscLockTypes.kLockTypeMine === type) ?
					this.collaborativeEditing.getLockObjectsMe(currentSheetId) : this.collaborativeEditing.getLockObjectsOther(currentSheetId);

				for (i = 0; i < arrayObjects.length; ++i) {
					this.objectRender.setGraphicObjectLockState(arrayObjects[i], type);
				}
			}

			for (i = 0; i < arrayCells.length; ++i) {
				oCellTmp = asc_Range (arrayCells[i].c1, arrayCells[i].r1, arrayCells[i].c2, arrayCells[i].r2);
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
			var ctx = this.overlayCtx;
			var arn = this.activeRange.clone(true);
			var arnIntersection = arn.intersectionSimple(range ? range : this.visibleRange);
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
						var arFormulaTmp = asc_Range (arrayElements[i].c1, arrayElements[i].r1, arrayElements[i].c2, arrayElements[i].r2);

						var aFormulaIntersection = arFormulaTmp.intersection(range ? range : this.visibleRange);

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

					activeFormula = activeFormula.intersection(range ? range : activeFormula);
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
				if (false === this.isFormulaEditMode) {
					this.arrActiveFormulaRanges = [];
				}
			}

			if (0 < this.arrActiveChartsRanges.length) {
				for (i in this.arrActiveChartsRanges ) {
					var activeFormula = this.arrActiveChartsRanges[i].clone(true);

					activeFormula = activeFormula.intersection(range ? range : activeFormula);
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
				// if (false === this.isFormulaEditMode) {
					// this.arrActiveFormulaRanges = [];
				// }
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

			if (null !== this.copyOfActiveRange) {
				// Координаты для перемещения диапазона
				var xCopyAr1 = this.cols[this.copyOfActiveRange.c1].left - offsetX - this.width_2px;
				var xCopyAr2 = this.cols[this.copyOfActiveRange.c2].left + this.cols[this.copyOfActiveRange.c2].width - offsetX + this.width_1px + this.width_2px;
				var yCopyAr1 = this.rows[this.copyOfActiveRange.r1].top - offsetY - this.height_2px;
				var yCopyAr2 = this.rows[this.copyOfActiveRange.r2].top + this.rows[this.copyOfActiveRange.r2].height - offsetY + this.height_1px + this.height_2px;

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
			var t = this;

			x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
			// Учитываем координаты точки, где мы начали изменение размера
			x += mouseX;

			var ctx = t.overlayCtx;
			var offsetX = t.cols[t.visibleRange.c1].left - t.cellsLeft;
			var offsetFrozen = t.getFrozenPaneOffset(false, true);
			offsetX -= offsetFrozen.offsetX;

			var x1 = t.cols[col].left - offsetX - this.width_1px;
			var h = ctx.getHeight();

			// ToDo для вывода при смене мышкой
			//var test = t._colWidthToCharCount(x - x1);
			//console.log("width = " + ((x - x1) * 96 / 72) + "px; widthS = " + test  + "; val = " + (x * 96 / 72) + "px");

			ctx.clear();
			t._drawSelection();
			ctx.setFillPattern(t.ptrnLineDotted1)
				.fillRect(x1, 0, this.width_1px, h)
				.fillRect(x, 0, this.width_1px, h);
		};

		// mouseY - это разница стартовых координат от мыши при нажатии и границы
		WorksheetView.prototype.drawRowGuides = function (row, x, y, mouseY) {
			var t = this;

			y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
			// Учитываем координаты точки, где мы начали изменение размера
			y += mouseY;

			var ctx = t.overlayCtx;
			var offsetY = t.rows[t.visibleRange.r1].top - t.cellsTop;
			var offsetFrozen = t.getFrozenPaneOffset(true, false);
			offsetY -= offsetFrozen.offsetY;

			var y1 = t.rows[row].top - offsetY - this.height_1px;
			var w = ctx.getWidth();

			// ToDo для вывода при смене мышкой
			//console.log("height = " + ((y - y1) * 96 / 72) + "px; heightPt: " + (y - y1) + "; val = " + (y * 96 / 72) + "px");

			ctx.clear();
			t._drawSelection();
			ctx.setFillPattern(t.ptrnLineDotted1)
				.fillRect(0, y1, w, this.height_1px)
				.fillRect(0, y, w, this.height_1px);
		};


		// --- Cache ---

		WorksheetView.prototype._cleanCache = function (range) {
			var t = this, r, c, row;

			if (range === undefined) {range = t.activeRange.clone(true);}

			for (r = range.r1; r <= range.r2; ++r) {
				row = t.cache.rows[r];
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
		 * @param {Asc.Range} range  Диапазон кэширования текта
		 */
		WorksheetView.prototype._prepareCellTextMetricsCache = function (range) {
			var self = this;
			var s = this.cache.sectors;
			var isUpdateRows = false;

			if (s.length < 1) {return;}

			for (var i = 0; i < s.length; ) {
				if (s[i].intersection(range) !== null) {
					self._calcCellsTextMetrics(s[i]);
					s.splice(i, 1);
					isUpdateRows = true;
					continue;
				}
				++i;
			}
			if (isUpdateRows) {
				// Убрал это из _calcCellsTextMetrics, т.к. вызов был для каждого сектора(добавляло тормоза: баг 20388)
				// Код нужен для бага http://bugzserver/show_bug.cgi?id=13875
				this._updateRowPositions();
				this._calcVisibleRows();
			}
		};

		/**
		 * Кэширует метрики текста для диапазона ячеек
		 * @param {Asc.Range} range  description
		 */
		WorksheetView.prototype._calcCellsTextMetrics = function (range) {
			if (range === undefined) {
				range = asc_Range(0, 0, this.cols.length - 1, this.rows.length - 1);
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
					if (!rowCells.hasOwnProperty(cellColl))
						continue;
					cellColl = cellColl - 0;
					if (this.width_1px > this.cols[cellColl].width) {continue;}

					this._addCellTextToCache(cellColl, row);
				}
			}
			this.isChanged = false;
		};

		WorksheetView.prototype._fetchRowCache = function (row) {
			var rc = this.cache.rows[row] = ( this.cache.rows[row] || new CacheElement() );
			return rc;
		};

		WorksheetView.prototype._fetchCellCache = function (col, row) {
			var r = this._fetchRowCache(row), c = r.columns[col] = ( r.columns[col] || {} );
			return c;
		};

		WorksheetView.prototype._fetchCellCacheText = function (col, row) {
			var r = this._fetchRowCache(row), cwt = r.columnsWithText[col] = ( r.columnsWithText[col] || {} );
			return cwt;
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

		WorksheetView.prototype._addCellTextToCache = function (col, row, canChangeColWidth) {
            var self = this;

            function isFixedWidthCell(frag) {
				for (var i = 0; i < frag.length; ++i) {
                    var f = frag[i].format;
                    if (f && f.repeat) {return true;}
                }
                return false;
            }

            function truncFracPart(frag) {
                var s = frag.reduce(function (prev,val) {return prev + val.text;}, "");
                // Проверка scientific format
                if (s.search(/E/i) >= 0) {
                    return frag;
                }
                // Поиск десятичной точки
                var pos = s.search(/[,\.]/);
                if (pos >= 0) {
                    frag[0].text = s.slice(0, pos);
                    frag.splice(1, frag.length - 1);
                }
                return frag;
            }

            function makeFnIsGoodNumFormat(flags, width) {
                return function (str) {
                    return self.stringRender.measureString(str, flags, width).width <= width;
                };
            }

            function changeColWidth(col, width, pad) {
                var cc = Math.min(self._colWidthToCharCount(width + pad), /*max col width*/255);
                var modelw = self._charCountToModelColWidth(cc, true);
                var colw = self._calcColWidth(modelw);

                if (colw.width > self.cols[col].width) {
                    self.cols[col].width = colw.width;
                    self.cols[col].innerWidth = colw.innerWidth;
                    self.cols[col].charCount = colw.charCount;

                    History.Create_NewPoint();
                    History.StartTransaction();
                    // Выставляем, что это bestFit
                    self.model.setColBestFit (true, modelw, col, col);
                    History.EndTransaction();

                    self._updateColumnPositions();
                    self.isChanged = true;
                }
            }

            var c = this._getCell(col, row);
            if (c === undefined) {return col;}

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

            // Range для замерженной ячейки
            var mc = this.model.getMergedByCell(row, col);
            var fl = this._getCellFlags(c);
            var fMergedColumns = false;	// Замержены ли колонки (если да, то автоподбор ширины не должен работать)
            var fMergedRows = false;	// Замержены ли строки (если да, то автоподбор высоты не должен работать)
            if (null !== mc) {
                if (col !== mc.c1 || row !== mc.r1) {return mc.c2;} // skip other merged cell from range
                if (mc.c1 !== mc.c2)
                    fMergedColumns = true;
                if (mc.r1 !== mc.r2)
                    fMergedRows = true;
            }

            if (this._isCellEmpty(c)) {return mc ? mc.c2 : col;}

            var dDigitsCount = 0;
            var colWidth = 0;
            var cellType = c.getType();
			fl.isNumberFormat = (!cellType || CellValueType.Number === cellType);
            var numFormatStr = c.getNumFormatStr();
            var pad = this.width_padding * 2 + this.width_1px;
            var sstr, sfl, stm;

            if (!this.cols[col].isCustomWidth && fl.isNumberFormat && !fMergedColumns &&
                (c_oAscCanChangeColWidth.numbers === canChangeColWidth ||
                c_oAscCanChangeColWidth.all === canChangeColWidth)) {
                colWidth = this.cols[col].innerWidth;
                // Измеряем целую часть числа
				sstr = c.getValue2(gc_nMaxDigCountView, function(){return true;});
                if ("General" === numFormatStr) {
					// truncFracPart изменяет исходный массив, поэтому клонируем
					var fragmentsTmp = [];
					for (var k = 0; k < sstr.length; ++k)
						fragmentsTmp.push(sstr[k].clone());
					sstr = truncFracPart(fragmentsTmp);
				}
                sfl = fl.clone();
                sfl.wrapText = false;
                stm = this._roundTextMetrics( this.stringRender.measureString(sstr, sfl, colWidth) );
                // Если целая часть числа не убирается в ячейку, то расширяем столбец
                if (stm.width > colWidth) {changeColWidth(col, stm.width, pad);}
                // Обновленная ячейка
                dDigitsCount = this.cols[col].charCount;
                colWidth = this.cols[col].innerWidth;
            } else if (null === mc) {
                // Обычная ячейка
                dDigitsCount = this.cols[col].charCount;
                colWidth = this.cols[col].innerWidth;
                // подбираем ширину
                if (!this.cols[col].isCustomWidth && !fMergedColumns && !fl.wrapText &&
                    c_oAscCanChangeColWidth.all === canChangeColWidth) {
                    sstr = c.getValue2(gc_nMaxDigCountView, function(){return true;});
                    stm = this._roundTextMetrics( this.stringRender.measureString(sstr, fl, colWidth) );
                    if (stm.width > colWidth) {
                        changeColWidth(col, stm.width, pad);
                        // Обновленная ячейка
                        dDigitsCount = this.cols[col].charCount;
                        colWidth = this.cols[col].innerWidth;
                    }
                }
            } else {
                // Замерженная ячейка, нужна сумма столбцов
                for (var i = mc.c1; i <= mc.c2 && i < this.nColsCount; ++i) {
                    colWidth += this.cols[i].width;
                }
                colWidth -= pad;
                dDigitsCount = gc_nMaxDigCountView;
            }

            // ToDo dDigitsCount нужно рассчитывать исходя не из дефалтового шрифта и размера, а исходя из текущего шрифта и размера ячейки
            var str  = c.getValue2(dDigitsCount, makeFnIsGoodNumFormat(fl, colWidth));
            var ha   = c.getAlignHorizontalByValue().toLowerCase();
            var va   = c.getAlignVertical().toLowerCase();
            var maxW = fl.wrapText || fl.shrinkToFit || fl.isMerged || isFixedWidthCell(str) ? this._calcMaxWidth(col, row, mc) : undefined;
            var tm   = this._roundTextMetrics( this.stringRender.measureString(str, fl, maxW) );
			var angle = c.getAngle();
            var cto  = (fl.isMerged || fl.wrapText) ?
            {
                maxWidth:  maxW - this.cols[col].innerWidth + this.cols[col].width,
                leftSide: 0,
                rightSide: 0
            } : this._calcCellTextOffset(col, row, ha, tm.width);

            // check right side of cell text and append columns if it exceeds existing cells borders
            if (!fl.isMerged) {
                var rside = this.cols[col - cto.leftSide].left + tm.width;
                var lc    = this.cols[this.cols.length - 1];
                if (rside > lc.left + lc.width) {
                    this._appendColumns(rside);
                    cto = this._calcCellTextOffset(col, row, ha, tm.width);
                }
            }
            var oFontColor = c.getFontcolor();
			var rowInfo = this.rows[row];
            var rowHeight = rowInfo.height;
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
                state		: this.stringRender.getInternalState(),
                flags		: fl,
                color		: (oFontColor || this.settings.cells.defaultState.color),
                metrics		: tm,
                cellW		: cto.maxWidth,
                cellHA		: ha,
                cellVA		: va,
                sideL		: cto.leftSide,
                sideR		: cto.rightSide,
                cellType	: cellType,
                isFormula	: c.getFormula().length > 0,
                angle		: angle,
                textBound	: textBound,
                mc			: mc
            };

            this._fetchCellCacheText(col, row).hasText = true;

            if (cto.leftSide !== 0 || cto.rightSide !== 0) {
				this._addErasedBordersToCache(col - cto.leftSide, col + cto.rightSide, row);
			}

            // update row's descender
            if (va !== kvaTop && va !== kvaCenter && !fl.isMerged) {
				rowInfo.descender = Math.max(rowInfo.descender, tm.height - tm.baseline);
            }

			rowHeight = rowInfo.height;

            // update row's height
            if (!rowInfo.isCustomHeight) {
				// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
				if (!fMergedRows) {
					var newHeight = tm.height;
					if (angle) {
						if (textBound) {
							newHeight = textBound.height;
						}
					}

					rowInfo.heightReal = rowInfo.height = Math.min(this.maxRowHeight, Math.max(rowInfo.height, newHeight));
					if (rowHeight !== rowInfo.height) {
						if (!rowInfo.isDefaultHeight) {
							this.model.setRowHeight(rowInfo.height + this.height_1px, row, row);
						}

						if (angle) {
							this._fetchCellCache(col, row).text.textBound   =
								this.stringRender.getTransformBound(angle, 0, 0, colWidth, rowInfo.height, tm.width, ha, va, maxW);
						}

						this.isChanged = true;
					}
				}
            }

            return mc ? mc.c2 : col;
        };

		WorksheetView.prototype._calcMaxWidth = function (col, row, mc) {
			if (null === mc) {return this.cols[col].innerWidth;}

			var width = this.cols[mc.c1].innerWidth;
			for (var c = mc.c1 + 1; c <= mc.c2 && c < this.nColsCount; ++c) {
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
					i = parseInt(i);
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

		WorksheetView.prototype._isLeftBorderErased1 = function (col, rowCache) {
			return rowCache.erased[col - 1] === true;
		};
		WorksheetView.prototype._isRightBorderErased1 = function (col, rowCache) {
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
			this.nRowsCount = Math.max(this.model.getRowsCount() , this.rows.length);
			this.nColsCount = Math.max(this.model.getColsCount(), this.cols.length);
			if ( col < 0 || col >= this.nColsCount || row < 0 || row >= this.nRowsCount ) {
				return undefined;
			}
			return this.model.getCell3(row, col);
		};

		WorksheetView.prototype._getVisibleCell = function (col, row) {
			return this.model.getCell3(row, col);
		};

		WorksheetView.prototype._getCellFlags = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			var fl = new CellFlags();
			if (c !== undefined) {
				fl.wrapText = c.getWrap();
				fl.shrinkToFit = c.getShrinkToFit();
				fl.isMerged = c.hasMerged() !== null;
				fl.textAlign = c.getAlignHorizontalByValue().toLowerCase();
			}
			return fl;
		};

		WorksheetView.prototype._isCellEmpty = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			return c === undefined || c.getValue().search(/[^ ]/) < 0;
		};

		WorksheetView.prototype._isCellEmptyOrMerged = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			if (undefined === c)
				return true;
			if (null !== c.hasMerged())
				return false;
			return c.getValue().search(/[^ ]/) < 0;
		};

		WorksheetView.prototype._isCellEmptyOrMergedOrBackgroundColorOrBorders = function (col, row) {
			var c = row !== undefined ? this._getCell(col, row) : col;
			if (undefined === c)
				return true;
			if (null !== c.hasMerged())
				return false;
			var bg = c.getFill();
			if (null !== bg)
				return false;
			var cb = c.getBorder();
			if ((cb.l && c_oAscBorderStyles.None !== cb.l.s) || (cb.r && c_oAscBorderStyles.None !== cb.r.s) ||
				(cb.t && c_oAscBorderStyles.None !== cb.t.s) || (cb.b && c_oAscBorderStyles.None !== cb.b.s) ||
				(cb.dd && c_oAscBorderStyles.None !== cb.dd.s)  || (cb.du && c_oAscBorderStyles.None !== cb.du.s))
				return false;
			return c.getValue().search(/[^ ]/) < 0;
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
				var mainCellMetrics = gCM(this,c.getCellAddress().getCol0(),c.getCellAddress().getRow0()), nodeCellMetrics,
					_t1, _t2;
				for(var id in node){
					if( !node[id].isArea ){
						_t1 = gCM(this,node[id].returnCell().getCellAddress().getCol0(),node[id].returnCell().getCellAddress().getRow0())
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
			ctx.setFont( new asc_FP(name, size) );
		};

		/**
		 * @param {Asc.TextMetrics} tm
		 * @return {Asc.TextMetrics}
		 */
		WorksheetView.prototype._roundTextMetrics = function (tm) {
			tm.width    = asc_calcnpt( tm.width, this._getPPIX() );
			tm.height   = asc_calcnpt( tm.height, this._getPPIY() );
			tm.baseline = asc_calcnpt( tm.baseline, this._getPPIY() );
			if (tm.centerline !== undefined) {
				tm.centerline = asc_calcnpt( tm.centerline, this._getPPIY() );
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
					return asc_calcnpt(0.5 * (y1 + y2 - tm.height), this._getPPIY()) - this.height_1px;
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
				var state = t._isCellEmpty(col, row);
				var i = col + dx;
				var j = row + dy;
				while (i >= 0 && i < t.cols.length && j >= 0 && j < t.rows.length) {
					var newState = t._isCellEmpty(i, j);
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
						if (!t._isCellEmpty(col, row)) {
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
				t._calcColumnWidths(/*fullRecalc*/2);
			}
			if (newRow >= t.rows.length && newRow <= gc_nMaxRow0) {
				t.nRowsCount = newRow + 1;
				t._calcRowHeights(/*fullRecalc*/2);
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

		WorksheetView.prototype._updateVisibleRowsCount = function (skipScrollReinit,isMobile) {
			this._calcVisibleRows();
			if (this._isVisibleY()) {
				do {  // Добавим еще строки, чтоб не было видно фон под таблицей
					this.expandRowsOnScroll(true);
					this._calcVisibleRows();
					if (this.rows[this.rows.length - 1].height < 0.000001) {break;}
				} while (this._isVisibleY());
				if (!skipScrollReinit) {
					this.handlers.trigger("reinitializeScrollY");
				}
			}
		};

		WorksheetView.prototype._updateVisibleColsCount = function (skipScrollReinit,isMobile) {
			this._calcVisibleColumns();
			if (this._isVisibleX()) {
				do {  // Добавим еще столбцы, чтоб не было видно фон под таблицей
					this.expandColsOnScroll(true);
					this._calcVisibleColumns();
					if (this.cols[this.cols.length - 1].width < 0.000001) {break;}
				} while (this._isVisibleX());
				if (!skipScrollReinit) {
					this.handlers.trigger("reinitializeScrollX");
				}
			}
		};

		WorksheetView.prototype.scrollVertical = function (delta, editor, isMobile) {
			var vr = this.visibleRange;
			var start = this._calcCellPosition(vr.c1, vr.r1, 0, delta).row;
			var fixStartRow = asc_Range(vr.c1, start, vr.c2, start);
			fixStartRow.startCol = vr.c1;
			fixStartRow.startRow = start;
			this._fixSelectionOfHiddenCells(0, delta >= 0 ? +1 : -1, fixStartRow);
			var reinitScrollY = start !== fixStartRow.r1;
			if (reinitScrollY && 0 > delta) // Для скролла вверх обычный сдвиг + дорисовка
				delta += fixStartRow.r1 - start;
			start = fixStartRow.r1;

			if (start === vr.r1) {return this;}

			this.cleanSelection();
			this.cellCommentator.cleanSelectedComment();

			var ctx = this.drawingCtx;
			var ctxW   = ctx.getWidth();
			var ctxH   = ctx.getHeight();
			var dy     = this.rows[start].top - this.rows[vr.r1].top;
			var oldEnd = vr.r2;
			var oldDec = Math.max(calcDecades(oldEnd + 1), 3);
			var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
			var oldVRE_isPartial;
			var oldH = ctxH - this.cellsTop - Math.abs(dy);
			var y    = this.cellsTop + (dy > 0 && oldH > 0 ? dy : 0);
			var oldW, x, dx, cFrozen = 0, rFrozen = 0;
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				rFrozen = this.topLeftFrozenCell.getRow0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;
				y += diffHeight;
				if (dy > 0)
					oldH -= diffHeight;
			}
			oldVRE_isPartial = this._isRowDrawnPartially(vr.r2, vr.r1, diffHeight);

			if (this.isCellEditMode && editor) {editor.move(0, -dy);}

			vr.r1 = start;
			this._updateVisibleRowsCount(false,isMobile);

			this.objectRender.setScrollOffset();

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
				}
				this._drawFrozenPane(true);
			} else {
				dx   = 0;
				x    = this.headersLeft;
				oldW = ctxW;
			}

			if (oldH > 0) {
				ctx.drawImage(ctx.getCanvas(), x, y, oldW, oldH, x + dx, y - dy, oldW, oldH);
			}
			ctx.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(this.headersLeft, y + (dy > 0 && oldH > 0 ? oldH - dy : 0),
					ctxW, ctxH - this.cellsTop - (oldH > 0 ? oldH : 0));

			var rangeGraphic = null;
			if ( !(dy > 0 && vr.r2 === oldEnd && !oldVRE_isPartial && dx === 0) ) {
				var c1 = vr.c1;
				var r1 = dy > 0 && oldH > 0 ? oldEnd + (oldVRE_isPartial ? 0 : 1) : vr.r1;
				var c2 = vr.c2;
				var r2 = dy > 0 || oldH <= 0 ? vr.r2 : vr.r1 - 1 - delta; /* delta < 0 here */
				var range = asc_Range(c1, r1, c2, r2);
				rangeGraphic = range.clone();
				// Это необходимо для того, чтобы строки, у которых высота по тексту рассчитались (баг http://bugzserver/show_bug.cgi?id=21552)
				this._prepareCellTextMetricsCache(range);
				if (dx === 0) {
					this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2);
				} else {
					// redraw all headres, because number of decades in row index has been changed
					this._drawRowHeaders(/*drawingCtx*/ undefined);
					if (dx < 0) {
						// draw last column
						var r1_ = dy > 0 ? vr.r1 : r2 + 1;
						var r2_ = dy > 0 ? r1 - 1 : vr.r2;
						var r_ = asc_Range(c2, r1_, c2, r2_);
						if (r2_ >= r1_) {
							this._drawGrid(/*drawingCtx*/ undefined, r_);
							this._drawCells(/*drawingCtx*/undefined, r_);
							this._drawCellsBorders(/*drawingCtx*/undefined, r_);
						}
					}
				}
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
				this._drawGrid(/*drawingCtx*/ undefined, range);
				this._drawCells(/*drawingCtx*/undefined, range);
				this._drawCellsBorders(/*drawingCtx*/undefined, range);
				this._drawAutoF(range, offsetX, offsetY);
				if (0 < cFrozen) {
					range.c1 = 0;
					range.c2 = cFrozen - 1;
					offsetX = this.cols[0].left - this.cellsLeft;
					this._drawGrid(/*drawingCtx*/ undefined, range, offsetX);
					this._drawCells(/*drawingCtx*/undefined, range, offsetX);
					this._drawCellsBorders(/*drawingCtx*/undefined, range, offsetX);
					this._drawAutoF(range, offsetX, offsetY);
				}
				// Отрисовывать нужно всегда, вдруг бордеры
				this._drawFrozenPaneLines();
				this._fixSelectionOfMergedCells();
				this._drawSelection();

				if (widthChanged) {this.handlers.trigger("reinitializeScrollX");}
			}

			if (reinitScrollY)
				this.handlers.trigger("reinitializeScrollY");

			this.cellCommentator.updateCommentPosition();
			this.cellCommentator.drawCommentCells();
			//ToDo this.drawDepCells();
			this.objectRender.showDrawingObjects(false, new GraphicOption(this, c_oAscGraphicOption.ScrollVertical, rangeGraphic));
			return this;
		};

		WorksheetView.prototype.scrollHorizontal = function (delta, editor, isMobile) {
			var vr = this.visibleRange;
			var start = this._calcCellPosition(vr.c1, vr.r1, delta, 0).col;
			var fixStartCol = asc_Range(start, vr.r1, start, vr.r2);
			fixStartCol.startCol = start;
			fixStartCol.startRow = vr.r1;
			this._fixSelectionOfHiddenCells(delta >= 0 ? +1 : -1, 0, fixStartCol);
			var reinitScrollX = start !== fixStartCol.c1;
			if (reinitScrollX && 0 > delta) // Для скролла влево обычный сдвиг + дорисовка
				delta += fixStartCol.c1 - start;
			start = fixStartCol.c1;

			if (start === vr.c1) {return this;}

			this.cleanSelection();
			this.cellCommentator.cleanSelectedComment();

			var ctx = this.drawingCtx;
			var ctxW    = ctx.getWidth();
			var ctxH    = ctx.getHeight();
			var dx      = this.cols[start].left - this.cols[vr.c1].left;
			var oldEnd  = vr.c2;
			var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
			var oldW = ctxW - this.cellsLeft - Math.abs(dx);
			var x = this.cellsLeft + (dx > 0 && oldW > 0 ? dx : 0);
			var y = this.headersTop;
			var cFrozen, rFrozen;
			if (this.topLeftFrozenCell) {
				rFrozen = this.topLeftFrozenCell.getRow0();
				cFrozen = this.topLeftFrozenCell.getCol0();
				diffWidth = this.cols[cFrozen].left - this.cols[0].left;
				diffHeight = this.rows[rFrozen].top - this.rows[0].top;
				x += diffWidth;
				if (dx > 0)
					oldW -= diffWidth;
			}
			var oldVCE_isPartial = this._isColDrawnPartially(vr.c2, vr.c1, diffWidth);

			if (this.isCellEditMode && editor) {editor.move(-dx, 0);}

			vr.c1 = start;
            this._updateVisibleColsCount(false,isMobile);

			this.objectRender.setScrollOffset();

			if (oldW > 0) {
				ctx.drawImage(ctx.getCanvas(), x, y, oldW, ctxH, x - dx, y, oldW, ctxH);
			}
			ctx.setFillStyle(this.settings.cells.defaultState.background)
				.fillRect(x + (dx > 0 && oldW > 0 ? oldW - dx : 0), y,
				          ctxW - this.cellsLeft - (oldW > 0 ? oldW : 0), ctxH);

			var rangeGraphic = null;
			if ( !(dx > 0 && vr.c2 === oldEnd && !oldVCE_isPartial) ) {
				var c1 = dx > 0 && oldW > 0 ? oldEnd + (oldVCE_isPartial ? 0 : 1) : vr.c1;
				var r1 = vr.r1;
				var c2 = dx > 0 || oldW <= 0 ? vr.c2 : vr.c1 - 1 - delta; /* delta < 0 here */
				var r2 = vr.r2;
				var range = asc_Range(c1, r1, c2, r2);
				rangeGraphic = range.clone();
				offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
				offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
				this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2);
				this._drawGrid(/*drawingCtx*/ undefined, range);
				this._drawCells(/*drawingCtx*/undefined, range);
				this._drawCellsBorders(/*drawingCtx*/undefined, range);
				this._drawAutoF(range, offsetX, offsetY);
				if (rFrozen) {
					range.r1 = 0;
					range.r2 = rFrozen - 1;
					offsetY = this.rows[0].top - this.cellsTop;
					this._drawGrid(/*drawingCtx*/ undefined, range, undefined, offsetY);
					this._drawCells(/*drawingCtx*/undefined, range, undefined, offsetY);
					this._drawCellsBorders(/*drawingCtx*/undefined, range, undefined, offsetY);
					this._drawAutoF(range, offsetX, offsetY);
				}
				// Отрисовывать нужно всегда, вдруг бордеры
				this._drawFrozenPaneLines();
				this._fixSelectionOfMergedCells();
				this._drawSelection();
			}

			if (reinitScrollX)
				this.handlers.trigger("reinitializeScrollX");

			this.cellCommentator.updateCommentPosition();
			this.cellCommentator.drawCommentCells();
			//ToDo this.drawDepCells();
			this.objectRender.showDrawingObjects(false, new GraphicOption(this, c_oAscGraphicOption.ScrollHorizontal, rangeGraphic));
			return this;
		};

		// ----- Selection -----

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

		WorksheetView.prototype._getCursorFormulaOrChart = function (x, y, offsetX, offsetY) {
			var i;
			if (this.isFormulaEditMode || this.isChartAreaEditMode) {
				var cursor, oFormulaRange, oFormulaIn, xFormula1, xFormula2, yFormula1, yFormula2;
				var col = -1, row = -1;
				var arrRanges = this.isFormulaEditMode ? this.arrActiveFormulaRanges : this.arrActiveChartsRanges,
					targetArr = this.isFormulaEditMode ? 0 : -1;
				for (i in arrRanges) {
					if (!arrRanges.hasOwnProperty(i))
						continue;
					oFormulaRange = arrRanges[i].clone(true);

					oFormulaIn = oFormulaRange.intersection(this.visibleRange);
					if (oFormulaIn) {
						xFormula1 = this.cols[oFormulaIn.c1].left - offsetX;
						xFormula2 = this.cols[oFormulaIn.c2].left + this.cols[oFormulaIn.c2].width - offsetX;
						yFormula1 = this.rows[oFormulaIn.r1].top - offsetY;
						yFormula2 = this.rows[oFormulaIn.r2].top + this.rows[oFormulaIn.r2].height - offsetY;

						if (
							(x >= xFormula1 + 5 && x <= xFormula2 - 5) && ((y >= yFormula1 - this.height_2px && y <= yFormula1 + this.height_2px) || (y >= yFormula2 - this.height_2px && y <= yFormula2 + this.height_2px))
								||
								(y >= yFormula1 + 5 && y <= yFormula2 - 5) && ((x >= xFormula1 - this.width_2px && x <= xFormula1 + this.width_2px) || (x >= xFormula2 - this.width_2px && x <= xFormula2 + this.width_2px))
							){
							cursor = kCurMove;
							break;
						} else if( x >= xFormula1 && x < xFormula1 + 5 && y >= yFormula1 && y < yFormula1 + 5 ){
							cursor = kCurSEResize;
							col = oFormulaIn.c2;
							row = oFormulaIn.r2;
							break;
						} else if ( x > xFormula2 - 5 && x <= xFormula2 && y > yFormula2 - 5 && y <= yFormula2 ){
							cursor = kCurSEResize;
							col = oFormulaIn.c1;
							row = oFormulaIn.r1;
							break;
						} else if( x > xFormula2 - 5 && x <= xFormula2 && y >= yFormula1 && y < yFormula1 + 5 ){
							cursor = kCurNEResize;
							col = oFormulaIn.c1;
							row = oFormulaIn.r2;
							break;
						} else if( x >= xFormula1 && x < xFormula1 + 5 && y > yFormula2 - 5 && y <= yFormula2 ){
							cursor = kCurNEResize;
							col = oFormulaIn.c2;
							row = oFormulaIn.r1;
							break;
						}
					}
				}
				if (cursor) {
					return {cursor: cursor, target: "moveResizeRange", col: col, row: row,
						formulaRange: oFormulaRange, indexFormulaRange: i, targetArr: targetArr};
				}
			}
			return null;
		};

		WorksheetView.prototype.getCursorTypeFromXY = function (x, y, isViewerMode) {
			var c, r, f, i, offsetX, offsetY, arIntersection, left, top, right, bottom, cellCursor,
				sheetId = this.model.getId(), userId, lockRangePosLeft, lockRangePosTop, lockInfo, oHyperlink,
				widthDiff = 0, heightDiff = 0, isLocked = false, ar = this.activeRange, target = "cells", row = -1, col = -1;
				
			var frozenCursor = this._isFrozenAnchor(x, y);
			if (frozenCursor.result) {
				return {cursor: frozenCursor.cursor, target: frozenCursor.name, col: -1, row: -1};
			}

			var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
			if (asc["editor"].isStartAddShape && CheckIdSatetShapeAdd(this.objectRender.controller.curState.id))
				return {cursor: kCurFillHandle, target: "shape", col: -1, row: -1};

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

				if (drawingInfo.hyperlink instanceof ParaHyperlinkStart) {
					oHyperlink = new Hyperlink();
					oHyperlink.Tooltip = drawingInfo.hyperlink.ToolTip;
					var spl = drawingInfo.hyperlink.Value.split("!");
					if (spl.length === 2)
						oHyperlink.setLocation(drawingInfo.hyperlink.Value);
					else
						oHyperlink.Hyperlink = drawingInfo.hyperlink.Value;

					cellCursor = {cursor: drawingInfo.cursor, target: "cells", col: -1, row: -1, userId: userId};
					return {cursor: kCurHyperlink, target: "hyperlink",
							hyperlink: new asc_CHyperlink(oHyperlink), cellCursor: cellCursor, userId: userId};
				}

				return {cursor: drawingInfo.cursor, target: "shape", drawingId: drawingInfo.id, col: -1, row: -1,
					userId: userId, lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop};
			}

			x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
			y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

			if (this.isFormatPainter) {
				if (x <= this.cellsLeft && y >= this.cellsTop) {
					r = this._findRowUnderCursor(y, true);
					if (r !== null) {
						target = "rowheader";
						row = r.row;
					}
				}
				if (y <= this.cellsTop && x >= this.cellsLeft) {
					c = this._findColUnderCursor(x, true);
					if (c !== null) {
						target = "colheader";
						col = c.col;
					}
				}
				return {cursor: kCurFormatPainter, target: target, col: col, row: row};
			}

			var autoFilterInfo = this.autoFilters.checkCursor(x, y);
			if (autoFilterInfo)
				return {cursor: kCurAutoFilter, target: "aFilterObject", col: -1, row: -1, idFilter: autoFilterInfo.id};

			offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
			offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				widthDiff = this.cols[cFrozen].left - this.cols[0].left;
				heightDiff = this.rows[rFrozen].top - this.rows[0].top;
				if (x < this.cellsLeft + widthDiff)
					widthDiff = 0;
				if (y < this.cellsTop + heightDiff)
					heightDiff = 0;
				offsetX -= widthDiff;
				offsetY -= heightDiff;
			}

			var oFormulaOrChartCursor = this._getCursorFormulaOrChart(x, y, offsetX, offsetY);
			if (oFormulaOrChartCursor)
				return oFormulaOrChartCursor;

			var oResDefault = {cursor: kCurDefault, target: "none", col: -1, row: -1};
			// Эпсилон для fillHandle
			var fillHandleEpsilon = this.width_1px;
			if (!isViewerMode && !this.isChartAreaEditMode &&
				x >= (this.fillHandleL - fillHandleEpsilon) && x <= (this.fillHandleR + fillHandleEpsilon) &&
				y >= (this.fillHandleT - fillHandleEpsilon) && y <= (this.fillHandleB + fillHandleEpsilon)) {
				// Мы на "квадрате" для автозаполнения
				if (!this.objectRender.selectedGraphicObjectsExists())
					return {cursor: kCurFillHandle, target: "fillhandle", col: -1, row: -1};
			}

			var xWithOffset = x + offsetX;
			var yWithOffset = y + offsetY;

			// Навели на выделение
			arIntersection = ar.intersectionSimple(this.visibleRange);
			if (!isViewerMode && arIntersection) {
				left = ar.c1 === arIntersection.c1 ? this.cols[ar.c1].left : null;
				right = ar.c2 === arIntersection.c2 ? this.cols[ar.c2].left + this.cols[ar.c2].width : null;
				top = ar.r1 === arIntersection.r1 ? this.rows[ar.r1].top : null;
				bottom = ar.r2 === arIntersection.r2 ? this.rows[ar.r2].top + this.rows[ar.r2].height : null;
				if ((((null !== left && xWithOffset >= left - this.width_2px && xWithOffset <= left + this.width_2px) ||
					(null !== right && xWithOffset >= right - this.width_2px && xWithOffset <= right + this.width_2px)) &&
					null !== top && null !== bottom && yWithOffset >= top - this.height_2px && yWithOffset <= bottom + this.height_2px) ||
					(((null !== top && yWithOffset >= top - this.height_2px && yWithOffset <= top + this.height_2px) ||
					(null !== bottom && yWithOffset >= bottom - this.height_2px && yWithOffset <= bottom + this.height_2px)) &&
					null !== left && null !== right && xWithOffset >= left - this.width_2px && xWithOffset <= right + this.width_2px)) {
					// Мы навели на границу выделения
					if ( !this.objectRender.selectedGraphicObjectsExists() )
						return {cursor: kCurMove, target: "moveRange", col: -1, row: -1};
				}
			}

			if (x < this.cellsLeft && y < this.cellsTop) {
				return {cursor: kCurCorner, target: "corner", col: -1, row: -1};
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
					var selectRangeRecalc = asc_Range(c.col, r.row, c.col, r.row);
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, selectRangeRecalc);
					if (false === isIntersection) {
						lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
							sheetId, new asc_CCollaborativeRange(selectRangeRecalc.c1, selectRangeRecalc.r1,
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
								lockRangePosLeft -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
								lockRangePosTop -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
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

				// Проверим есть ли комменты
				var comments = this.cellCommentator.asc_getComments(c.col, r.row);
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
				cellCursor = {cursor: kCurCells, target: "cells", col: (c ? c.col : -1),
					row: (r ? r.row : -1), userId: userId,
					lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop,
					userIdAllProps: userIdAllProps, lockAllPosLeft: lockAllPosLeft,
					lockAllPosTop: lockAllPosTop, userIdAllSheet: userIdAllSheet,
					commentIndexes: indexes, commentCoords: coords};
				if (null !== oHyperlink) {
					return {cursor: kCurHyperlink, target: "hyperlink",
						hyperlink: new asc_CHyperlink(oHyperlink), cellCursor: cellCursor,
						userId: userId, lockRangePosLeft: lockRangePosLeft,
						lockRangePosTop: lockRangePosTop, userIdAllProps: userIdAllProps,
						userIdAllSheet: userIdAllSheet, lockAllPosLeft: lockAllPosLeft,
						lockAllPosTop: lockAllPosTop, commentIndexes: indexes, commentCoords: coords};
				}
				return cellCursor;
			}

			if (x <= this.cellsLeft && y >= this.cellsTop) {
				r = this._findRowUnderCursor(y, true);
				if (r === null)
					return oResDefault;
				f = !isViewerMode && (r.row !== this.visibleRange.r1 && y < r.top + 3 || y >= r.bottom - 3);
				// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
				return {
					cursor: f ? kCurRowResize : kCurRowSelect,
					target: f ? "rowresize" : "rowheader",
					col: -1,
					row: r.row + (r.row !== this.visibleRange.r1 && f && y < r.top + 3 ? -1 : 0),
					mouseY: f ? ((y < r.top + 3) ? (r.top - y - this.height_1px): (r.bottom - y - this.height_1px))  : null
				};
			}

			if (y <= this.cellsTop && x >= this.cellsLeft) {
				c = this._findColUnderCursor(x, true);
				if (c === null)
					return oResDefault;
				f = !isViewerMode && (c.col !== this.visibleRange.c1 && x < c.left + 3 || x >= c.right - 3);
				// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
				return {
					cursor: f ? kCurColResize : kCurColSelect,
					target: f ? "colresize" : "colheader",
					col: c.col + (c.col !== this.visibleRange.c1 && f && x < c.left + 3 ? -1 : 0),
					row: -1,
					mouseX: f ? ((x < c.left + 3) ? (c.left - x - this.width_1px): (c.right - x - this.width_1px))  : null
				};
			}

			return oResDefault;
		};

		WorksheetView.prototype._fixSelectionOfMergedCells = function (fixedRange) {
			var t = this;

			var ar = fixedRange ? fixedRange : ((this.isFormulaEditMode) ?
				t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1] : t.activeRange);

			if (!ar) { return; }

			if (ar.type && ar.type !== c_oAscSelectionType.RangeCells) { return; }

			var res = this.model.expandRangeByMerged(ar.clone(true));

			if (ar.c1 !== res.c1 && ar.c1 !== res.c2) {ar.c1 = ar.c1 <= ar.c2 ? res.c1 : res.c2;}
			ar.c2 = ar.c1 === res.c1 ? res.c2 : (res.c1);
			if (ar.r1 !== res.r1 && ar.r1 !== res.r2) {ar.r1 = ar.r1 <= ar.r2 ? res.r1 : res.r2;}
			ar.r2 = ar.r1 === res.r1 ? res.r2 : res.r1;
		};

		WorksheetView.prototype._fixSelectionOfHiddenCells = function (dc, dr, range) {
			var t = this, ar = (range) ? range : t.activeRange, c1, c2, r1, r2, mc, i, arn = ar.clone(true);

			if (dc === undefined) {dc = +1;}
			if (dr === undefined) {dr = +1;}

			function findVisibleCol(from, dc, flag) {
				var to = dc < 0 ? -1 : t.cols.length, c;
				for (c = from; c !== to; c += dc) {
					if (t.cols[c].width > t.width_1px) {return c;}
				}
				return flag ? -1 : findVisibleCol(from, dc * -1, true);
			}

			function findVisibleRow(from, dr, flag) {
				var to = dr < 0 ? -1 : t.rows.length, r;
				for (r = from; r !== to; r += dr) {
					if (t.rows[r].height > t.height_1px) {return r;}
				}
				return flag ? -1 : findVisibleRow(from, dr * -1, true);
			}

			if (ar.c2 === ar.c1) {
				if (t.cols[ar.c1].width < t.width_1px) {
					c1 = c2 = findVisibleCol(ar.c1, dc);
				}
			} else {
				if (0 !== dc && t.nColsCount > ar.c2 && t.cols[ar.c2].width < t.width_1px) {
					// Проверка для одновременно замерженных и скрытых ячеек (A1:C1 merge, B:C hidden)
					for (mc = null, i = arn.r1; i <= arn.r2; ++i) {
						mc = t.model.getMergedByCell(i, ar.c2);
						if (mc) {break;}
					}
					if (!mc) {c2 = findVisibleCol(ar.c2, dc);}
				}
			}
			if (c1 < 0 || c2 < 0) {throw "Error: all columns are hidden";}

			if (ar.r2 === ar.r1) {
				if (t.rows[ar.r1].height < t.height_1px) {
					r1 = r2 = findVisibleRow(ar.r1, dr);
				}
			} else {
				if (0 !== dr && t.nRowsCount > ar.r2 && t.rows[ar.r2].height < t.height_1px) {
					//Проверка для одновременно замерженных и скрытых ячеек (A1:A3 merge, 2:3 hidden)
					for (mc = null, i = arn.c1; i <= arn.c2; ++i) {
						mc = t.model.getMergedByCell(ar.r2, i);
						if (mc) {break;}
					}
					if (!mc) {r2 = findVisibleRow(ar.r2, dr);}
				}
			}
			if (r1 < 0 || r2 < 0) {throw "Error: all rows are hidden";}

			ar.assign(
				c1 !== undefined ? c1 : ar.c1,
				r1 !== undefined ? r1 : ar.r1,
				c2 !== undefined ? c2 : ar.c2,
				r2 !== undefined ? r2 : ar.r2);

			if (c1 >= 0) {ar.startCol = c1;}
			if (r1 >= 0) {ar.startRow = r1;}

			if (t.cols[ar.startCol].width < t.width_1px) {
				c1 = findVisibleCol(ar.startCol, dc);
				if (c1 >= 0) {ar.startCol = c1;}
			}
			if (t.rows[ar.startRow].height < t.height_1px) {
				r1 = findVisibleRow(ar.startRow, dr);
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
			ar.normalize();
			this._fixSelectionOfHiddenCells(dc>=0?+1:-1, dr>=0?+1:-1);
		};

		// Движение активной ячейки в выделенной области
		WorksheetView.prototype._moveActivePointInSelection = function (dc, dr) {
			var ar = this.activeRange;
			var arn = this.activeRange.clone(true);

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

				// Обработка движения через срытые столбцы/строки
				while (ar.startCol >= arn.c1 && ar.startCol <= arn.c2 && this.cols[ar.startCol].width < 0.000001) {
					ar.startCol += dc || (dr > 0 ? +1 : -1);
					done = false;
				}
				if (!done) { continue; }

				while (ar.startRow >= arn.r1 && ar.startRow <= arn.r2 && this.rows[ar.startRow].height < 0.000001) {
					ar.startRow += dr || (dc > 0 ? +1 : -1);
					done = false;
				}
			} while (!done);
		};

		WorksheetView.prototype._calcSelectionEndPointByXY = function (x, y) {
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
			return {
				c2: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? this._findColUnderCursor(x).col : ar.c2,
				r2: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? this._findRowUnderCursor(y).row : ar.r2
			};
		};

		WorksheetView.prototype._calcSelectionEndPointByOffset = function (dc, dr) {
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			var mc = this.model.getMergedByCell(ar.r2, ar.c2);
			var c  = mc ? ( dc <= 0 ? mc.c1 : mc.c2 ) : ar.c2;
			var r  = mc ? ( dr <= 0 ? mc.r1 : mc.r2 ) : ar.r2;
			var p  = this._calcCellPosition(c, r, dc, dr);
			return {c2: p.col, r2: p.row};
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

			if (adjustRight) {
				while ( this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX) ) {++incX;}
			}
			if (adjustBottom) {
				while ( this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY) ) {++incY;}
			}
			return {
				deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
				deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
			};
		};

		WorksheetView.prototype._calcActiveCellOffset = function () {
			var vr = this.visibleRange;
			var ar = this.activeRange;
			var arn = ar.clone(true);
			var isMC = this._isMergedCells(arn);
			var adjustRight = ar.startCol >= vr.c2 || ar.startCol >= vr.c2 && isMC;
			var adjustBottom = ar.startRow >= vr.r2 || ar.startRow >= vr.r2 && isMC;
			var incX = ar.startCol < vr.c1 && isMC ? arn.startCol - vr.c1 : ar.startCol < vr.c1 ? ar.startCol - vr.c1 : 0;
			var incY = ar.startRow < vr.r1 && isMC ? arn.startRow - vr.r1 : ar.startRow < vr.r1 ? ar.startRow - vr.r1 : 0;

			if (adjustRight) {
				while ( this._isColDrawnPartially(isMC ? arn.startCol : ar.startCol, vr.c1 + incX) ) {++incX;}
			}
			if (adjustBottom) {
				while ( this._isRowDrawnPartially(isMC ? arn.startRow : ar.startRow, vr.r1 + incY) ) {++incY;}
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

			if (adjustRight) {
				try{
					while ( this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX) ) {++incX;}
				}
				catch(e){
					this.expandColsOnScroll(true);
					this.handlers.trigger("reinitializeScrollX");
				}
			}
			if (adjustBottom) {
				try{
					while ( this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY) ) {++incY;}
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
			var t = this;
			var arn = t.activeRange.clone(true);
			var notEmpty = false;
			var r, c;

			switch (options) {
				case c_oAscMergeOptions.Merge:
				case c_oAscMergeOptions.MergeCenter:
					for (r = arn.r1; r <= arn.r2; ++r) {
						for (c = arn.c1; c <= arn.c2; ++c) {
							if (false === this._isCellEmpty(c, r)) {
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
							if (false === this._isCellEmpty(c, r)) {
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
			var sum = 0, countNumbers = 0;
			range._setPropertyNoEmpty(null, null, function (c) {
				++oSelectionMathInfo.count;
				if (CellValueType.Number === c.getType() && false === c.isEmptyTextString()) {
					tmp = parseFloat(c.getValueWithoutFormat());
					if (isNaN(tmp))
						return;
					++countNumbers;
					sum += tmp;
				}
			});
			if (0 !== countNumbers) {
				oSelectionMathInfo.sum = sum;
				oSelectionMathInfo.average = sum / countNumbers;
			}
			return oSelectionMathInfo;
		};

		WorksheetView.prototype.getSelectionName = function (bRangeText) {
			if (this.isSelectOnShape)
				return " ";	// Пока отправим пустое имя(с пробелом, пустое не воспринимаем в меню..) ToDo

			var ar = this.activeRange;
			var mc = this.model.getMergedByCell(ar.startRow, ar.startCol);
			var c1 = mc ? mc.c1 : ar.startCol;
			var r1 = mc ? mc.r1 : ar.startRow;

			var selectionSize = !bRangeText ? "" : (function (r) {
				var rc = Math.abs(r.r2 - r.r1) + 1;
				var cc = Math.abs(r.c2 - r.c1) + 1;
				switch (r.type) {
					case c_oAscSelectionType.RangeCells: return rc + "R x " + cc + "C";
					case c_oAscSelectionType.RangeCol: return cc + "C";
					case c_oAscSelectionType.RangeRow: return rc + "R";
					case c_oAscSelectionType.RangeMax: return gc_nMaxRow + "R x " + gc_nMaxCol + "C";
				}
				return "";
			})(ar);

			var cellName =  this._getColumnTitle(c1) + this._getRowTitle(r1);
			return selectionSize || cellName;
		};

		WorksheetView.prototype.getSelectionRangeValue = function () {
			var sListName = this.model.getName();
			return sListName + "!" + this.getActiveRange(this.activeRange.clone(true));
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

			cell_info.isFormatTable = (null !== this.autoFilters.searchRangeInTableParts(activeCell));
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
			cell_info.font.underline = (EUnderline.underlineNone !== c.getUnderline()); // ToDo убрать, когда будет реализовано двойное подчеркивание
			cell_info.font.strikeout = c.getStrikeout();
			cell_info.font.subscript = fa === "subscript";
			cell_info.font.superscript = fa === "superscript";
			cell_info.font.color = (fc ? asc_obj2Color(fc) : new CAscColor(c_opt.defaultState.color));

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

			cell_info.comments = this.cellCommentator.asc_getComments(ar.c1, ar.r1);
			cell_info.flags.merge = null !== range.hasMerged();

			if (bExt) {
				cell_info.innertext = c.getValue();
				cell_info.numFormat = c.getNumFormatStr();
			}

			if (false !== this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Разрешено совместное редактирование
				var sheetId = this.model.getId();
				// Пересчет для входящих ячеек в добавленные строки/столбцы
				var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
				if (false === isIntersection) {
					var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
						sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

					if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
						// Уже ячейку кто-то редактирует
						cell_info.isLocked = true;
					}
				}
			}

			return cell_info;
		};

		WorksheetView.prototype._getSelectionInfoObject = function (bExt) {
			var objectInfo = new asc_CCellInfo();
			var defaults = this.settings.cells;
			var selectionType = c_oAscSelectionType.RangeShape;

			objectInfo.flags = new asc_CCellFlag();
			var graphicObjects = this.objectRender.getSelectedGraphicObjects();
			if (graphicObjects.length)
				selectionType = objectInfo.flags.selectionType = this.objectRender.getGraphicSelectionType(graphicObjects[0].Id);

			var textPr = this.objectRender.controller.getParagraphTextPr();
			var paraPr = this.objectRender.controller.getParagraphParaPr();
			if (textPr && paraPr) {
				objectInfo.text = this.objectRender.controller.Get_SelectedText();

				var horAlign = "center";
				switch (paraPr.Jc) {
					case align_Left		: horAlign = "left";	break;
					case align_Right	: horAlign = "right";	break;
					case align_Center	: horAlign = "center";	break;
					case align_Justify	: horAlign = "justify";	break;
				}
				var vertAlign = "center";
				switch (paraPr.anchor) {
					case VERTICAL_ANCHOR_TYPE_BOTTOM:			vertAlign = "bottom"; break;
					case VERTICAL_ANCHOR_TYPE_CENTER:			vertAlign = "center"; break;

					case VERTICAL_ANCHOR_TYPE_TOP:
					case VERTICAL_ANCHOR_TYPE_DISTRIBUTED:
					case VERTICAL_ANCHOR_TYPE_JUSTIFIED:		vertAlign = "top"; break;
				}

				objectInfo.halign = horAlign;
				objectInfo.valign = vertAlign;

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
				if (shapeHyperlink && (shapeHyperlink instanceof ParaHyperlinkStart)) {

					var hyperlink = new Hyperlink();
					hyperlink.Tooltip = shapeHyperlink.ToolTip;

					var spl = shapeHyperlink.Value.split("!");
					if (spl.length === 2) {
						hyperlink.setLocation(shapeHyperlink.Value);
					} else
						hyperlink.Hyperlink = shapeHyperlink.Value;

					objectInfo.hyperlink = new asc_CHyperlink(hyperlink);
				}
			} else if (c_oAscSelectionType.RangeShape == selectionType) {
				// Может быть не задано текста, поэтому выставим по умолчанию
				objectInfo.font = new asc_CFont();
				objectInfo.font.name = defaults.fontName;
				objectInfo.font.size = defaults.fontSize;
			}

			// Заливка не нужна как таковая
			objectInfo.fill = new asc_CFill(null);

			// ToDo locks

			return objectInfo;
		};

		// Получаем координаты активной ячейки
		WorksheetView.prototype.getActiveCellCoord = function () {
			var xL = this.getCellLeft(this.activeRange.startCol, /*pt*/1);
			var yL = this.getCellTop(this.activeRange.startRow, /*pt*/1);
			// Пересчитываем X и Y относительно видимой области
			xL -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
			yL -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
			// Пересчитываем в px
			xL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() );
			yL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() );
			var width = this.getColumnWidth (this.activeRange.startCol, /*px*/0);
			var height = this.getRowHeight(this.activeRange.startRow, /*px*/0);
			return new asc_CCellRect (xL, yL, width, height);
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
			this.handlers.trigger("selectionNameChanged", this.getSelectionName());
			this.handlers.trigger("selectionChanged", this.getSelectionInfo());
			this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
		};
		WorksheetView.prototype.getActiveRangeObj = function (){
			return this.activeRange.clone(true);
		};
		WorksheetView.prototype.setActiveRangeObj = function (val){
			this.activeRange = val.clone();
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
				range = asc_Range (range.c1, range.r1, range.c2, range.r2);
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

			this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
			this.handlers.trigger("selectionChanged", this.getSelectionInfo());
			this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());

			return this._calcActiveCellOffset();
		};

		WorksheetView.prototype.setSelectionUndoRedo = function (range, validRange) {
			// Проверка на валидность range.
			if (validRange && (range.c2 >= this.nColsCount || range.r2 >= this.nRowsCount)) {
				if (range.c2 >= this.nColsCount)
					this.expandColsOnScroll(false, true, range.c2 + 1);
				if (range.r2 >= this.nRowsCount)
					this.expandRowsOnScroll(false, true, range.r2 + 1);
			}
			var oRes = null;
			var type = this.activeRange.type;
			if(type == c_oAscSelectionType.RangeCells || type == c_oAscSelectionType.RangeCol ||
				type == c_oAscSelectionType.RangeRow || type == c_oAscSelectionType.RangeMax)
			{
				this.cleanSelection();

				this._drawSelection();

				this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				this.handlers.trigger("selectionChanged", this.getSelectionInfo());
				this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());

				oRes = this._calcActiveCellOffset();
			}
			return oRes;
		};

		WorksheetView.prototype.changeSelectionStartPoint = function (x, y, isCoord, isSelectMode) {
		
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1]: this.activeRange;
			var sc = ar.startCol, sr = ar.startRow, ret = {};
			var isChangeSelectionShape = false;

			this.cleanSelection();

			var commentList = this.cellCommentator.getCommentsXY(x, y);
			if ( !commentList.length ) {
				this.model.workbook.handlers.trigger("asc_onHideComment");
				this.cellCommentator.resetLastSelectedId();
			}

			if (isCoord) {
				// move active range to coordinates x,y
				this._moveActiveCellToXY(x, y);
				isChangeSelectionShape = this._checkSelectionShape();
			}
			else {
				// move active range to offset x,y
				this._moveActiveCellToOffset(x, y);
				ret = this._calcActiveRangeOffset();
			}


			if (!this.isCellEditMode && (sc !== ar.startCol || sr !== ar.startRow || isChangeSelectionShape)) {
				if (!this.isSelectionDialogMode) {
					this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
					if (!isSelectMode) {
						this.handlers.trigger("selectionChanged", this.getSelectionInfo());
						this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
					}
				} else {
					// Смена диапазона
					this.handlers.trigger("selectionRangeChanged", this.getSelectionRangeValue());
				}
			}

			if ( !isChangeSelectionShape )
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

		WorksheetView.prototype.changeSelectionEndPoint = function (x, y, isCoord, isSelectMode) {
			var isChangeSelectionShape = false;
			if (isCoord)
				isChangeSelectionShape = this._checkSelectionShape();
			var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
			var arOld = ar.clone();
			var arnOld = ar.clone(true);
			var ep = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
			var epOld, ret;

			if (ar.c2 !== ep.c2 || ar.r2 !== ep.r2 || isChangeSelectionShape) {
				this.cleanSelection();
				ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
				if (ar.type === c_oAscSelectionType.RangeCells) {
					this._fixSelectionOfMergedCells();
					while (!isCoord && arnOld.isEqual( ar.clone(true) )) {
						ar.c2 = ep.c2;
						ar.r2 = ep.r2;
						epOld = $.extend({}, ep);
						ep = this._calcSelectionEndPointByOffset(x<0?-1:x>0?+1:0, y<0?-1:y>0?+1:0);
						ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
						this._fixSelectionOfMergedCells();
						if (ep.c2 === epOld.c2 && ep.r2 === epOld.r2) {break;}
					}
				}
				if (!isCoord)
					this._fixSelectionOfHiddenCells(ar.c2 - arOld.c2 >= 0 ? +1 : -1, ar.r2 - arOld.r2 >= 0 ? +1 : -1);
				this._drawSelection();
				//ToDo this.drawDepCells();
			}

			ret = this._calcActiveRangeOffset();

			if (!this.isCellEditMode && !arnOld.isEqual(ar.clone(true))) {
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
			this.model.workbook.handlers.trigger("asc_onHideComment");

			return ret;
		};

		// Окончание выделения
		WorksheetView.prototype.changeSelectionDone = function () {
			if (this.isFormulaEditMode && this.arrActiveFormulaRanges.length > 0) {
				// Нормализуем range
				this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1].normalize();
			} else {
				// Нормализуем range
				this.activeRange.normalize();
				if (this.isFormatPainter)
					this.applyFormatPainter();
			}
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
			var onApplyMoveRangeHandleCallback = function (isSuccess) {
				// Очищаем выделение
				t.cleanSelection();

				if (true === isSuccess)
					t._getRange(0, 0, 0, 0).promoteFromTo(t.copyOfActiveRange, t.activeRange);

				// Сбрасываем параметры
				t._updateCellsRange(t.activeRange, /*canChangeColWidth*/c_oAscCanChangeColWidth.none, /*lockDraw*/true);
				t.formatPainter();
				// Перерисовываем
				t.draw();
			};

			this._isLockedCells (this.activeRange, null, onApplyMoveRangeHandleCallback);
		};
		WorksheetView.prototype.formatPainter = function () {
			this.isFormatPainter = !this.isFormatPainter;
			if (this.isFormatPainter) {
				this.copyOfActiveRange = this.activeRange.clone(true);
				this._drawFormatPainterRange();
			} else {
				this.cleanSelection();
				this.copyOfActiveRange = null;
				this._drawSelection();
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
						range.promote(/*bCtrl*/ctrlPress, /*bVertical*/(1 === t.fillHandleDirection), nIndex);
						// Вызываем функцию пересчета для заголовков форматированной таблицы
						t.autoFilters._renameTableColumn(arn);
					}

					// Сбрасываем параметры автозаполнения
					t.activeFillHandle = null;
					t.fillHandleDirection = -1;

					// Обновляем выделенные ячейки
					t.isChanged = true;
					t._updateCellsRange(arn);
				};

				// Можно ли применять автозаполнение ?
				this._isLockedCells (changedRange, /*subType*/null, applyFillHandleCallback);
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
			var ar = this.activeRange.clone(true);

			// Колонка по X и строка по Y
			var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
			var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;

			// Если мы только первый раз попали сюда, то копируем выделенную область
			if (null === this.startCellMoveRange) {
				// Учитываем погрешность (мы должны быть внутри диапазона при старте)
				if (colByX < ar.c1) { colByX = ar.c1; }
				else if (colByX > ar.c2) { colByX = ar.c2; }
				if (rowByY < ar.r1) { rowByY = ar.r1; }
				else if (rowByY > ar.r2) { rowByY = ar.r2; }
				this.startCellMoveRange = asc_Range(colByX, rowByY, colByX, rowByY);
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
			var d = {
				deltaX : this.activeMoveRange.c1 < this.visibleRange.c1 ? this.activeMoveRange.c1-this.visibleRange.c1 :
					this.activeMoveRange.c2>this.visibleRange.c2 ? this.activeMoveRange.c2-this.visibleRange.c2 : 0,
				deltaY : this.activeMoveRange.r1 < this.visibleRange.r1 ? this.activeMoveRange.r1-this.visibleRange.r1 :
					this.activeMoveRange.r2>this.visibleRange.r2 ? this.activeMoveRange.r2-this.visibleRange.r2 : 0
			};
			while ( this._isColDrawnPartially( this.activeMoveRange.c2, this.visibleRange.c1 + d.deltaX) ) {++d.deltaX;}
			while ( this._isRowDrawnPartially( this.activeMoveRange.r2, this.visibleRange.r1 + d.deltaY) ) {++d.deltaY;}
			
			this.model.workbook.handlers.trigger("asc_onHideComment");
			
			return d;
		};

		WorksheetView.prototype.changeSelectionMoveResizeRangeHandle = function (x, y, targetInfo) {
			// Возвращаемый результат
			if( !targetInfo )
				return null;
			var indexFormulaRange = targetInfo.indexFormulaRange, d, ret;
			// Пересчитываем координаты
			x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
			y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
			var ar = 0 == targetInfo.targetArr ? this.arrActiveFormulaRanges[indexFormulaRange].clone(true) : this.arrActiveChartsRanges[indexFormulaRange].clone(true);

			// Колонка по X и строка по Y
			var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
			var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;

			// Если мы только первый раз попали сюда, то копируем выделенную область
			if (null === this.startCellMoveResizeRange) {
				if( (targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize) /* && 0 == targetInfo.targetArr */ ){
					this.startCellMoveResizeRange = ar.clone(true);
					// this.startCellMoveResizeRange2 = asc_Range(this.startCellMoveResizeRange.c1, this.startCellMoveResizeRange.r1, this.startCellMoveResizeRange.c1, this.startCellMoveResizeRange.r1,true);
					this.startCellMoveResizeRange2 = asc_Range(targetInfo.col, targetInfo.row, targetInfo.col, targetInfo.row,true);
				}
				else{
					this.startCellMoveResizeRange = ar.clone(true);
					if (colByX < ar.c1) { colByX = ar.c1; }
					else if (colByX > ar.c2) { colByX = ar.c2; }
					if (rowByY < ar.r1) { rowByY = ar.r1; }
					else if (rowByY > ar.r2) { rowByY = ar.r2; }
					this.startCellMoveResizeRange2 = asc_Range(colByX, rowByY, colByX, rowByY);
				}
				return null;
			}

			// Очищаем выделение, будем рисовать заново
			// this.cleanSelection();
			this.overlayCtx.clear();

			if( targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize ){
				if( colByX < this.startCellMoveResizeRange2.c1 ){
					ar.c2 = this.startCellMoveResizeRange2.c1;
					ar.c1 = colByX;
				}
				else if( colByX > this.startCellMoveResizeRange2.c1 ){
					ar.c1 = this.startCellMoveResizeRange2.c1;
					ar.c2 = colByX;
				}
				else{
					ar.c1 = this.startCellMoveResizeRange2.c1;
					ar.c2 = this.startCellMoveResizeRange2.c1
				}

				if( rowByY < this.startCellMoveResizeRange2.r1 ){
					if(this.visibleRange.r2 > ar.r2)
						ar.r2 = this.startCellMoveResizeRange2.r2;
					ar.r1 = rowByY;
				}
				else if( rowByY > this.startCellMoveResizeRange2.r1 ){
					if(this.visibleRange.r1 < ar.r1)
						ar.r1 = this.startCellMoveResizeRange2.r1;

					if(this.visibleRange.r2 > ar.r2)
						ar.r2 = rowByY;
				}
				else{
					ar.r1 = this.startCellMoveResizeRange2.r1;
					ar.r2 = this.startCellMoveResizeRange2.r1;
				}
			}
			else{
				this.startCellMoveResizeRange.normalize();
				var colDelta = colByX - this.startCellMoveResizeRange2.c1;
				var rowDelta = rowByY - this.startCellMoveResizeRange2.r1;

				ar.c1 = this.startCellMoveResizeRange.c1+colDelta;
				if (0 > ar.c1) {
					colDelta -= ar.c1;
					ar.c1 = 0;
				}
				ar.c2 = this.startCellMoveResizeRange.c2+colDelta;

				ar.r1 = this.startCellMoveResizeRange.r1+rowDelta;
				if (0 > ar.r1) {
					rowDelta -= ar.r1;
					ar.r1 = 0;
				}
				ar.r2 = this.startCellMoveResizeRange.r2+rowDelta;

				d = { deltaX : ar.c1 <= this.visibleRange.c1 ? ar.c1-this.visibleRange.c1 :
																				ar.c2>=this.visibleRange.c2 ? ar.c2-this.visibleRange.c2 : 0,
					  deltaY : ar.r1 <= this.visibleRange.r1 ? ar.r1-this.visibleRange.r1 :
																				ar.r2>=this.visibleRange.r2 ? ar.r2-this.visibleRange.r2 : 0
					}
			}

			if( 0 == targetInfo.targetArr ){
				var _p = this.arrActiveFormulaRanges[indexFormulaRange].cursorePos,
					_l = this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength,
					_a = this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute;
				this.arrActiveFormulaRanges[indexFormulaRange] = ar.clone(true);
				this.arrActiveFormulaRanges[indexFormulaRange].cursorePos = _p;
				this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength = _l;
				this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute = _a;
				ret = this.arrActiveFormulaRanges[indexFormulaRange];
			}
			else{
				this.arrActiveChartsRanges[indexFormulaRange] = ar.clone(true);
				this.moveRangeDrawingObjectTo = ar;
			}
			this._drawSelection();

			return { ar: ret, d:d };
		};

		/* Функция для применения перемещения диапазона */
		WorksheetView.prototype.applyMoveRangeHandle = function (ctrlKey) {
			var t = this;

			if (null === t.activeMoveRange) {
				// Сбрасываем параметры
				t.startCellMoveRange = null;
				return;
			}

			var arnFrom = t.activeRange.clone(true);
			var arnTo = t.activeMoveRange.clone(true);
			var resmove = t.model._prepareMoveRange(arnFrom, arnTo);
			if( resmove == -2 ){
				t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.CannotMoveRange, c_oAscError.Level.NoCritical);
				// Сбрасываем параметры
				t.activeMoveRange = null;
				t.startCellMoveRange = null;
				t.isChanged = true;
				t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2,
					arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), /*canChangeColWidth*/c_oAscCanChangeColWidth.none);
				// Перерисовываем
				t.cleanSelection();
				t._drawSelection();
				return false;
			} else if( resmove == -1 ){
				t.model.workbook.handlers.trigger("asc_onConfirmAction",
												  c_oAscConfirm.ConfirmReplaceRange,
												  function(can){t.moveRangeHandle(arnFrom, arnTo, can, ctrlKey)}
				);

			} else {
				t.moveRangeHandle(arnFrom, arnTo, true, ctrlKey)
			}

		};

		WorksheetView.prototype.applyMoveResizeRangeHandle = function (target){
			if( -1 == target.targetArr )
				this.objectRender.moveRangeDrawingObject(this.startCellMoveResizeRange, this.moveRangeDrawingObjectTo, true);

			this.startCellMoveResizeRange = null;
			this.startCellMoveResizeRange2 = null;
		};

		WorksheetView.prototype.moveRangeHandle = function (arnFrom, arnTo, can, copyRange){
			var t = this;
			var onApplyMoveRangeHandleCallback = function (isSuccess) {
				// Очищаем выделение
				t.cleanSelection();

				if (true === isSuccess && !arnFrom.isEqual(arnTo) && can) {
					//ToDo t.cleanDepCells();
					History.Create_NewPoint();
					History.SetSelection(arnFrom.clone());
					History.SetSelectionRedo(arnTo.clone());
					History.StartTransaction();
                    if( !copyRange ) t.autoFilters._preMoveAutoFilters(arnFrom);
					t.model._moveRange(arnFrom, arnTo, copyRange);
					t._updateCellsRange(arnTo);
					t.cleanSelection();
					t.activeRange = arnTo.clone(true);
					t.cellCommentator.moveRangeComments(arnFrom, arnTo);
					t.objectRender.moveRangeDrawingObject(arnFrom, arnTo, false);
                    if( !copyRange ) {
                        t.autoFilters._moveAutoFilters(arnTo, arnFrom);
					    // Вызываем функцию пересчета для заголовков форматированной таблицы
                        t.autoFilters._renameTableColumn( arnFrom );
                        t.autoFilters._renameTableColumn( arnTo );
                        t.autoFilters.reDrawFilter( arnFrom );
                    }
					History.EndTransaction();
				}

				// Сбрасываем параметры
				t.activeMoveRange = null;
				t.startCellMoveRange = null;
				t.isChanged = true;
				t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2,
					arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), /*canChangeColWidth*/c_oAscCanChangeColWidth.none);
				// Перерисовываем
				t.cleanSelection();
				t._drawSelection();
			};

			this._isLockedCells ([arnFrom, arnTo], null, onApplyMoveRangeHandleCallback);
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
				if (c_oAscSelectionType.RangeMax === arn.type) {
					checkRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
				} else if (c_oAscSelectionType.RangeCol === arn.type) {
					checkRange = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
				} else if (c_oAscSelectionType.RangeRow === arn.type) {
					checkRange = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
				} else {
					checkRange = arn;
				}
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

				var isLargeRange = t._isLargeRange(range), callTrigger = false;
				var res;
				var mc, r, c, cell;

				function makeBorder(b) {
					var border = new BorderProp();
					if (b === false) {
						border.setStyle(c_oAscBorderStyles.None);
					} else if (b) {
						if (b.style !== null && b.style !== undefined) {border.setStyle(b.style);}
						if (b.color !== null && b.color !== undefined) {
							if(b.color instanceof CAscColor)
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
					case "bc": range.setFill((val) ? (val) : null); break;
					case "wrap":   range.setWrap(val); break;
					case "shrink": range.setShrinkToFit(val); break;
					case "value":  range.setValue(val); break;
					case "format": range.setNumFormat(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
                    case "angle": range.setAngle(val); break;
					case "rh": /*ToDo удаление гиперссылки из range*/ break;

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
							case c_oAscMergeOptions.Unmerge:     range.unmerge(); break;
							case c_oAscMergeOptions.MergeCenter: range.merge(val); break;
							case c_oAscMergeOptions.MergeAcross:
								for (res = arn.r1; res <= arn.r2; ++res)
									t.model.getRange3(res, arn.c1, res, arn.c2).merge(val);
								break;
							case c_oAscMergeOptions.Merge:       range.merge(val); break;
						}
						break;

					case "sort":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						var changes = range.sort(val, arn.startCol);
						t.cellCommentator.sortComments(arn, changes);
						break;

					case "empty":
						if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
						/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
						lockDraw(t.model.workbook);
						if (val === c_oAscCleanOptions.All)
							range.cleanAll();
						if (val & c_oAscCleanOptions.Text || val & c_oAscCleanOptions.Formula)
							range.cleanText();
						if (val & c_oAscCleanOptions.Format)
							range.cleanFormat();

						// Если нужно удалить автофильтры - удаляем
						t.autoFilters.isEmptyAutoFilters(arn);
						// Вызываем функцию пересчета для заголовков форматированной таблицы
						t.autoFilters._renameTableColumn(arn);
						// Удаляем комментарии
						t.cellCommentator.deleteCommentsRange(arn);

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
						isLocal ? t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive) : t._pasteFromGlobalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive);
						return;
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
								t.autoFilters._renameTableColumn(arn);
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

				History.EndTransaction();
			};
			if ("paste" === prop && val.onlyImages !== true) {
				// Для past свой диапазон
				if(isLocal === "binary")
					checkRange = t._pasteFromBinary(val, true);
				else if(isLocal === true)
					checkRange = t._pasteFromLS(val, true);
				else
					checkRange = t._setInfoAfterPaste(val, onlyActive, true);
			}
			if("paste" === prop && val.onlyImages === true)
				onSelectionCallback();
			else
				this._isLockedCells (checkRange, /*subType*/null, onSelectionCallback);
		};
		
		WorksheetView.prototype._pasteFromLocalBuff = function (isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive) {
			var t = this;
			var callTrigger = false;
			if (isLargeRange) { callTrigger = true; t.handlers.trigger("slowOperation", true); }
			var selectData;
			if(isLocal === 'binary')
				selectData = t._pasteFromBinary(val);
			else if (isLocal === true)
				selectData = t._pasteFromLS(val);
			else
				selectData = t._setInfoAfterPaste(val,onlyActive);

			if (!selectData) {
				bIsUpdate = false;
				History.EndTransaction();
				return;
			}
			t.expandColsOnScroll();
			t.expandRowsOnScroll();
			var arrFormula = selectData[1];
			lockDraw(t.model.workbook);
			for (var i = 0; i < arrFormula.length; ++i) {//!!!
				var rangeF = arrFormula[i].range;
				var valF = arrFormula[i].val;
				if(rangeF.isOneCell())
					rangeF.setValue(valF);
				else {
					var oBBox = rangeF.getBBox0();
					t.model._getCell(oBBox.r1, oBBox.c1).setValue(valF);
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
					t.autoFilters.addAutoFilter(aFilters[aF].style, range.bbox, null, null, true);
					if(!aFilters[aF].autoFilter)
						t.autoFilters.addAutoFilter(null, range.bbox, null, null, true);
				}
			}
			else if(isLocal === 'binary' && val.TableParts && val.TableParts.length)
			{
				var aFilters = val.TableParts;
				var range;
				var tablePartRange;
				var activeRange = window["Asc"]["editor"].wb.clipboard.activeRange;
				var refInsertBinary = t.autoFilters._refToRange(activeRange);
				var diffRow;
				var diffCol;
				for(var aF = 0; aF < aFilters.length; aF++)
				{
					tablePartRange = t.autoFilters._refToRange(aFilters[aF].Ref);
					diffRow = tablePartRange.r1 - refInsertBinary.r1;
					diffCol = tablePartRange.c1 - refInsertBinary.c1;
					range = t.model.getRange3(diffRow + selectionRange.r1, diffCol + selectionRange.c1, diffRow + selectionRange.r1 + (tablePartRange.r2 - tablePartRange.r1), diffCol + selectionRange.c1 + (tablePartRange.c2 - tablePartRange.c1));
					if(aFilters[aF].style)
						range.cleanFormat();
					t.autoFilters.addAutoFilter(aFilters[aF].TableStyleInfo.Name, range.bbox, null, null, true);
					if(!aFilters[aF].AutoFilter)
						t.autoFilters.addAutoFilter(null, range.bbox, null, null, true);
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

		WorksheetView.prototype._pasteFromGlobalBuff = function (isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth, onlyActive) {
			var t = this;
			//загрузка шрифтов, в случае удачи на callback вставляем текст
			t._loadFonts(val.fontsNew, function () {
				t._pasteFromLocalBuff(isLargeRange, isLocal, val, bIsUpdate, canChangeColWidth);
				var a_drawings = [];
				if (val.addImages && val.addImages.length != 0) {
					var api = asc["editor"];
					var aImagesSync = [];
					for (var im = 0; im < val.addImages.length; im++) {
							aImagesSync.push(val.addImages[im].tag.src);
						}
					t.objectRender.asyncImagesDocumentEndLoaded = function() {
						//вставляем изображения
						for (var im = 0; im < val.addImages.length; im++) {
							var src = val.addImages[im].tag.src;

							var binary_shape = val.addImages[im].tag.getAttribute("alt");
							var sub;
							if (typeof binary_shape === "string")
								sub = binary_shape.substr(0, 18);
							if (typeof binary_shape === "string" &&( sub === "TeamLabShapeSheets" || sub === "TeamLabImageSheets" || sub === "TeamLabChartSheets" || sub === "TeamLabGroupSheets")) {
									var reader = CreateBinaryReader(binary_shape, 18, binary_shape.length);
									reader.GetLong();
									if (isRealObject(reader))
										reader.oImages = this.oImages;
									var first_string = null;
									if (reader !== null && typeof  reader === "object") {
										first_string = sub;
									}
									var positionX = null;
									var positionY = null;

									if (t.cols && val.addImages[im].curCell && val.addImages[im].curCell.col != undefined && t.cols[val.addImages[im].curCell.col].left != undefined)
										positionX = t.cols[val.addImages[im].curCell.col].left - t.getCellLeft(0, 1);
									if (t.rows && val.addImages[im].curCell && val.addImages[im].curCell.row != undefined && t.rows[val.addImages[im].curCell.row].top != undefined)
										positionY = t.rows[val.addImages[im].curCell.row].top - t.getCellTop(0, 1);

									var Drawing;
									switch(first_string) {
										case "TeamLabImageSheets": {
											Drawing = new CImageShape(null, t.objectRender);
											break;
										}
										case "TeamLabShapeSheets": {
											Drawing = new CShape(null, t.objectRender);
											break;
										}
										case "TeamLabGroupSheets": {
											Drawing = new CGroupShape(null, t.objectRender);
											break;
										}
										case "TeamLabChartSheets": {
											Drawing = new CChartAsGroup(null, t.objectRender);
											break;
										}
										default : {
											Drawing = CreateImageFromBinary(src);
											break;
										}
									}
									if (positionX && positionY && t.objectRender)
										Drawing.readFromBinaryForCopyPaste(reader,null, t.objectRender,t.objectRender.convertMetric(positionX,1,3),t.objectRender.convertMetric(positionY,1,3));
									else
										Drawing.readFromBinaryForCopyPaste(reader,null, t.objectRender);
									Drawing.drawingObjects = t.objectRender;
									a_drawings.push(Drawing);
									//Drawing.addToDrawingObjects();
								} else if (src && 0 != src.indexOf("file://")) {
								var drawing = CreateImageDrawingObject(src,  { cell: val.addImages[im].curCell, width: val.addImages[im].tag.width, height: val.addImages[im].tag.height },  t.objectRender);
								if(drawing && drawing.graphicObject)
									a_drawings.push(drawing.graphicObject);
							}
						}

						t.objectRender.objectLocker.reset();

						function callbackUngroupedObjects(result) {
								if ( result ) {
									for (var j = 0; j < a_drawings.length; ++j) {
										a_drawings[j].recalculateTransform();
										History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(a_drawings[j].Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
										a_drawings[j].addToDrawingObjects();
										a_drawings[j].select( t.objectRender.controller);
									}
								}
							}
						for(var j = 0; j < a_drawings.length; ++j)
						{
								t.objectRender.objectLocker.addObjectId(a_drawings[j].Get_Id());
							}
						t.objectRender.objectLocker.checkObjects(callbackUngroupedObjects);
					};

					api.ImageLoader.LoadDocumentImages(aImagesSync, null, t.objectRender.asyncImagesDocumentEndLoaded);
				}
			});
		};
		
		WorksheetView.prototype._setInfoAfterPaste = function (values,clipboard,isCheckSelection) {
			var t = this;
			var arn = t.activeRange.clone(true);
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
				var currentObj = values[arn.r1][arn.c1][0];
				var valFormat = '';
				if(currentObj[0] !== undefined)
					valFormat = currentObj[0].text;
				if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
				{
					var nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
					valFormat = clipboard._decode(currentObj.format.split(';')[1]);
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
										if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
										{
											nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
											valFormat = clipboard._decode(currentObj.format.split(';')[1]);
										}
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

		WorksheetView.prototype._pasteFromLS = function (val,isCheckSelection){
			var t = this;
			var arn = t.activeRange.clone(true);
			var arrFormula = [];
			var numFor = 0;
			var rMax = val.lStorage.length + arn.r1;

			var cMax = val.lStorage[0].length + arn.c1;
			var values = val.lStorage;

			var isMultiple = false;
			var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
			var isMergedFirstCell = firstCell.hasMerged();
			var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
			var isOneMerge = false;


			var firstValuesCol;
			var firstValuesRow;
			if(values[0][0].merge != null)
			{
				firstValuesCol = values[0][0].merge.c2-values[0][0].merge.c1;
				firstValuesRow = values[0][0].merge.r2-values[0][0].merge.r1;
			}
			else
			{
				firstValuesCol = 0;
				firstValuesRow = 0;
			}

			//если вставляем в мерженную ячейку, диапазон которой больше или равен
			if (arn.c2 >= cMax -1 && arn.r2 >= rMax - 1 &&
			isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
			cMax - arn.c1 === (firstValuesCol + 1) && rMax - arn.r1  === (firstValuesRow + 1))
			{
				if(!isCheckSelection)
				{
					/*values[0][0].merge =
					{
						r1: 0,
						r2: isMergedFirstCell.r2 -isMergedFirstCell.r1,
						c1: 0,
						c2: isMergedFirstCell.c2 -isMergedFirstCell.c1
					}*/
					/*val[0][0].colSpan = isMergedFirstCell.c2 -isMergedFirstCell.c1 + 1;
					val[0][0].rowSpan = isMergedFirstCell.r2 -isMergedFirstCell.r1 + 1;*/
				}
				isOneMerge = true;
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
			/*if(isMultiple)
			{
				var currentObj = values[arn.r1][arn.c1][0];
				var valFormat = '';
				if(currentObj[0] !== undefined)
					valFormat = currentObj[0].text;
				if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
				{
					var nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
					valFormat = clipboard._decode(currentObj.format.split(';')[1]);
				}
			}*/
			for (var autoR = 0;autoR < maxARow; ++autoR) {
				for (var autoC = 0;autoC < maxACol; ++autoC) {
					for (var r = arn.r1;r < rMax; ++r) {
						for (var c = arn.c1; c < cMax; ++c) {
							var newVal = values[r - arn.r1][c - arn.c1];
							if(undefined !== newVal)
							{
								var isMerged = false, mergeCheck;
								var range = t.model.getRange3(r + autoR*plRow, c + autoC*plCol, r + autoR*plRow, c + autoC*plCol);
								if(!isOneMerge)
								{
									for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
									{
										if(r + autoR*plRow <= mergeArr[mergeCheck].r2 && r + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol  <= mergeArr[mergeCheck].c2 && c + autoC*plCol >= mergeArr[mergeCheck].c1)
											isMerged = true;
									}
									if(newVal.merge != null && !isMerged)
									{
										range.setOffsetLast({offsetCol: (newVal.merge.c2 - newVal.merge.c1), offsetRow: (newVal.merge.r2 - newVal.merge.r1)});
										range.merge(c_oAscMergeOptions.Merge);
										mergeArr[n] = {
											r1: newVal.merge.r1 + arn.r1 - values.fromRow + autoR*plRow,
											r2: newVal.merge.r2 + arn.r1 - values.fromRow + autoR*plRow,
											c1: newVal.merge.c1 + arn.c1 - values.fromCol + autoC*plCol,
											c2: newVal.merge.c2 + arn.c1 - values.fromCol + autoC*plCol
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
								//add formula
								var numFormula = null;
								var skipFormat = null;
								var noSkipVal = null;
								for(var nF = 0; nF < newVal.value2.length;nF++)
								{
									if(newVal.value2[nF] && newVal.value2[nF].sId)
									{
										numFormula = nF;
										break;
									}
									else if(newVal.value2[nF] && newVal.value2[nF].format && newVal.value2[nF].format.skip)
										skipFormat = true;
									else if(newVal.value2[nF] && newVal.value2[nF].format && !newVal.value2[nF].format.skip)
										noSkipVal = nF;
								}

								if(newVal.value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal!= null))
								{
									if(numFormula == null)
										numFormula = 0;
									var numStyle = 0;
									if(skipFormat != null && noSkipVal!= null)
										numStyle = noSkipVal;
									if( newVal.value2[numFormula].sId){
										var offset = range.getCells()[numFormula].getOffset2(newVal.value2[numFormula].sId),
											assemb,
											_p_ = new parserFormula(newVal.value2[numFormula].sFormula,"",range.worksheet);

										if( _p_.parse() ){
											assemb = _p_.changeOffset(offset).assemble();
											//range.setValue("="+assemb);
											arrFormula[numFor] = {};
											arrFormula[numFor].range = range;
											arrFormula[numFor].val = "=" + assemb;
											numFor++;
										}
									}
									else if(newVal.valWithoutFormat)
										range.setValue(newVal.valWithoutFormat);
									else
										range.setValue(newVal.value2[numStyle].text);

									range.setBold(newVal.value2[numStyle].format.b);
									range.setItalic(newVal.value2[numStyle].format.i);
									range.setStrikeout(newVal.value2[numStyle].format.s);
									if(!isOneMerge && newVal.value2[numStyle].format && null != newVal.value2[numStyle].format.c)
										range.setFontcolor(newVal.value2[numStyle].format.c);
									range.setUnderline(newVal.value2[numStyle].format.u);
									//range.setAlignVertical(currentObj.va);
									range.setFontname(newVal.value2[numStyle].format.fn);
									range.setFontsize(newVal.value2[numStyle].format.fs);
								}
								else
									range.setValue2(newVal.value2);

								range.setAlignVertical(newVal.verAlign);
								if(!isOneMerge)
									range.setAlignHorizontal(newVal.horAlign);
								if(!isOneMerge)
									range.setBorderSrc(newVal.borders);

								var nameFormat;
								/*if(newVal.format.oPositiveFormat)
								{
									var output = {};
									var bRes = newVal.format.shiftFormat(output, 0);
									if(true == bRes)
										nameFormat = output.format;
								}*/
								if(newVal.format && newVal.format.sFormat)
									nameFormat = newVal.format.sFormat;
								if(nameFormat)
									range.setNumFormat(nameFormat);
								range.setFill(newVal.fill);

								range.setWrap(newVal.wrap);

								if(newVal.angle)
									range.setAngle(newVal.angle);

								if(newVal.hyperlink != null)
								{
									newVal.hyperlink.Ref = range;
									range.setHyperlink(newVal.hyperlink);
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
			var activeCellsPasteFragment = this.autoFilters._refToRange(pasteRange);
			var rMax = (activeCellsPasteFragment.r2 - activeCellsPasteFragment.r1) + arn.r1 + 1;
			var cMax = (activeCellsPasteFragment.c2 - activeCellsPasteFragment.c1) + arn.c1 + 1;

			var isMultiple = false;
			var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
			var isMergedFirstCell = firstCell.hasMerged();
			var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
			var isOneMerge = false;


			var startCell = val.getCell( new CellAddress(activeCellsPasteFragment.r1, activeCellsPasteFragment.c1, 0));
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

			//если вставляем в мерженную ячейку, диапазон которой больше или равен
			if (arn.c2 >= cMax -1 && arn.r2 >= rMax - 1 &&
				isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
				cMax - arn.c1 === (firstValuesCol + 1) && rMax - arn.r1  === (firstValuesRow + 1))
			{
				isOneMerge = true;
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
			for (var autoR = 0;autoR < maxARow; ++autoR) {
				for (var autoC = 0;autoC < maxACol; ++autoC) {
					for (var r = arn.r1;r < rMax; ++r) {
						for (var c = arn.c1; c < cMax; ++c) {
							var pasteRow = r - arn.r1 + activeCellsPasteFragment.r1;
							var pasteCol = c - arn.c1 + activeCellsPasteFragment.c1;
							newVal = val.getCell( new CellAddress(pasteRow, pasteCol, 0));

							curMerge = newVal.hasMerged();

							if(undefined !== newVal)
							{
								var isMerged = false, mergeCheck;
								var range = t.model.getRange3(r + autoR*plRow, c + autoC*plCol, r + autoR*plRow, c + autoC*plCol);
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
											commentData.nCol = c + autoC*plCol;
											commentData.nRow = r + autoR*plRow;
											commentData.setId();
											t.cellCommentator.addCommentSerialize(commentData);
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
										range.setOffsetLast({offsetCol: (curMerge.c2 - curMerge.c1), offsetRow: (curMerge.r2 - curMerge.r1)});
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

								if(value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal!= null))
								{
									if(numFormula == null)
										numFormula = 0;
									var numStyle = 0;
									if(skipFormat != null && noSkipVal!= null)
										numStyle = noSkipVal;
									if(newVal.getFormula()){
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
										range.setValue(value2[numStyle].text);

									range.setBold(value2[numStyle].format.b);
									range.setItalic(value2[numStyle].format.i);
									range.setStrikeout(value2[numStyle].format.s);
									if(!isOneMerge && value2[numStyle].format && null != value2[numStyle].format.c)
										range.setFontcolor(value2[numStyle].format.c);
									range.setUnderline(value2[numStyle].format.u);
									range.setFontname(value2[numStyle].format.fn);
									range.setFontsize(value2[numStyle].format.fs);
								}
								else
									range.setValue2(value2);

								range.setAlignVertical(newVal.getAlignVertical());
								if(!isOneMerge)
									range.setAlignHorizontal(newVal.getAlignHorizontal());
								if(!isOneMerge)
									range.setBorderSrc(newVal.getBorderFull());

								var numFormat = newVal.getNumFormat();
								var nameFormat;
								if(numFormat && numFormat.sFormat)
									nameFormat = numFormat.sFormat;
								if(nameFormat)
									range.setNumFormat(nameFormat);

								range.setFill(newVal.getFill());

								range.setWrap(newVal.getWrap());

								var angle = newVal.getAngle();
								if(angle)
									range.setAngle(angle);

								var hyperLink =  newVal.getHyperlink();
								if(hyperLink != null)
								{
									hyperLink.Ref = range;
									range.setHyperlink(hyperLink);
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

		// Залочен ли весь лист
		WorksheetView.prototype._isLockedAll = function (callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return;
			}
			var sheetId = this.model.getId();
			var subType = c_oAscLockTypeElemSubType.ChangeProperties;
			var ar = this.activeRange;

			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
				sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

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
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return true;
			}
			var sheetId = this.model.getId();
			var isIntersection = false;
			var newCallback = callback;
			var t = this;

			this.collaborativeEditing.onStartCheckLock();
			var nLength = ("array" === asc_typeof(range)) ? range.length : 1;
			var nIndex = 0;
			var ar = null;

			for (; nIndex < nLength; ++nIndex) {
				ar = ("array" === asc_typeof(range)) ? range[nIndex].clone(true) : range.clone(true);

				if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
				}

				if (false === isIntersection) {
					var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

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
			var checkRange = null;
			var arn = t.activeRange.clone(true);
			if (c_oAscSelectionType.RangeMax === arn.type) {
				checkRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
			} else if (c_oAscSelectionType.RangeCol === arn.type) {
				checkRange = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
			} else if (c_oAscSelectionType.RangeRow === arn.type) {
				checkRange = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
			} else {
				checkRange = arn;
			}

			var range;
			var fullRecalc = undefined;
			var pad, cw;
			var isUpdateCols = false, isUpdateRows = false;
			var cleanCacheCols = false, cleanCacheRows = false;
			var _updateRangeIns, _updateRangeDel, bUndoRedo;
			var functionModelAction = null;
			var lockDraw = false;	// Параметр, при котором не будет отрисовки (т.к. мы просто обновляем информацию на неактивном листе)

			var onChangeWorksheetCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				asc_applyFunction(functionModelAction);

				t._initCellsArea(fullRecalc);
				if (fullRecalc) {
					t.cache.reset();
				} else {
					if (cleanCacheCols) { t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1)); }
					if (cleanCacheRows) { t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2)); }
				}
				t._cleanCellsTextMetricsCache();
				t._prepareCellTextMetricsCache(t.visibleRange);
				t.objectRender.setScrollOffset();
				t.draw();

				t.handlers.trigger("reinitializeScroll");

				if (isUpdateCols) { t._updateVisibleColsCount(); }
				if (isUpdateRows) { t._updateVisibleRowsCount(); }

				t.objectRender.rebuildChartGraphicObjects();
				t.objectRender.showDrawingObjects(true);
			};

			switch (prop) {
				case "colWidth":
					functionModelAction = function () {
						pad = t.width_padding * 2 + t.width_1px;
						cw = t._charCountToModelColWidth(val, true);
						t.model.setColWidth(cw, checkRange.c1, checkRange.c2);
						isUpdateCols = true;
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);

				case "insColBefore":
					functionModelAction = function () {
						fullRecalc = true;
						t.autoFilters.insertColumn(prop, val, arn);
						t.model.insertColsBefore(arn.c1, val);
					};
					return this._isLockedCells (new asc_Range(arn.c1, 0, arn.c1 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
				case "insColAfter":
					functionModelAction = function () {
						fullRecalc = true;
						t.autoFilters.insertColumn(prop, val, arn);
						t.model.insertColsAfter(arn.c2, val);
					};
					return this._isLockedCells (new asc_Range(arn.c2, 0, arn.c2 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
				case "delCol":
					functionModelAction = function () {
						fullRecalc = true;
						t.model.removeCols(arn.c1, arn.c2);
					};
					return this._isLockedCells (new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns, onChangeWorksheetCallback);
				case "showCols":
					functionModelAction = function () {
						t.model.setColHidden(/*bHidden*/false, arn.c1, arn.c2);
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);
				case "hideCols":
					functionModelAction = function () {
						t.model.setColHidden(/*bHidden*/true, arn.c1, arn.c2);
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);

				case "rowHeight":
					functionModelAction = function () {
						// Приводим к px (чтобы было ровно)
						val = val / 0.75; val = (val | val) * 0.75;		// 0.75 - это размер 1px в pt (можно было 96/72)
						t.model.setRowHeight(Math.min(val, t.maxRowHeight), checkRange.r1, checkRange.r2);
						isUpdateRows = true;
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);
				case "insRowBefore":
					functionModelAction = function () {
						fullRecalc = true;
						t.model.insertRowsBefore(arn.r1, val);
					};
					return this._isLockedCells (new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
				case "insRowAfter":
					functionModelAction = function () {
						fullRecalc = true;
						t.model.insertRowsAfter(arn.r2, val);
					};
					return this._isLockedCells (new asc_Range(0, arn.r2, gc_nMaxCol0, arn.r2 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
				case "delRow":
					functionModelAction = function () {
						fullRecalc = true;
						t.model.removeRows(arn.r1, arn.r2);
					};
					return this._isLockedCells (new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1), c_oAscLockTypeElemSubType.DeleteRows, onChangeWorksheetCallback);
				case "showRows":
					functionModelAction = function () {
						t.model.setRowHidden(/*bHidden*/false, arn.r1, arn.r2);
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);
				case "hideRows":
					functionModelAction = function () {
						t.model.setRowHidden(/*bHidden*/true, arn.r1, arn.r2);
						fullRecalc = true;
					};
					return this._isLockedAll (onChangeWorksheetCallback);

				case "insCell":
					bUndoRedo = val.range != undefined;
					if (val && val.range) {
						_updateRangeIns = val.range;
						val = val.val;
					} else {
						_updateRangeIns = arn;
					}
					range = t.model.getRange3(_updateRangeIns.r1, _updateRangeIns.c1, _updateRangeIns.r2, _updateRangeIns.c2);
					switch (val) {
						case c_oAscInsertOptions.InsertCellsAndShiftRight:
							functionModelAction = function () {
								var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeIns, c_oAscInsertOptions.InsertCellsAndShiftRight, prop, bUndoRedo);
								if(!isCheckChangeAutoFilter)
									return;
								if (range.addCellsShiftRight()) {
									fullRecalc = true;
									if(isCheckChangeAutoFilter == 'changeAutoFilter')
									{
										if(gUndoInsDelCellsFlag == true)
											t.autoFilters.insertColumn(prop, _updateRangeIns, arn);
										else if(gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data)
											t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
										gUndoInsDelCellsFlag = true;
									}
									t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
									t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
								}
							};

							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1,
									gc_nMaxCol0, _updateRangeIns.r2), null, onChangeWorksheetCallback);
							return;
						case c_oAscInsertOptions.InsertCellsAndShiftDown:
							functionModelAction = function () {
								var isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeIns, c_oAscInsertOptions.InsertCellsAndShiftDown, prop, bUndoRedo);
								if(!isCheckChangeAutoFilter)
									return;
								if (range.addCellsShiftBottom()) {
									fullRecalc = true;
									if(isCheckChangeAutoFilter == 'changeAutoFilter')
									{
										if(gUndoInsDelCellsFlag == true)
											t.autoFilters.insertRows(prop,_updateRangeIns, _updateRangeIns);
										else if(gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data)
											t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
										gUndoInsDelCellsFlag = true;
									}
									t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
									t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
								}
							};

							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1,
									_updateRangeIns.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
							return;
						case c_oAscInsertOptions.InsertColumns:
							functionModelAction = function () {
								fullRecalc = true;
								t.model.insertColsBefore(_updateRangeIns.c1, _updateRangeIns.c2 - _updateRangeIns.c1 + 1);
								if(gUndoInsDelCellsFlag == true)
									t.autoFilters.insertColumn(prop, _updateRangeIns, arn);
								else if(gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data)
									t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
								gUndoInsDelCellsFlag = true;
								t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
								t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
							};
							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeIns.c1, 0, _updateRangeIns.c2,
									gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns,
									onChangeWorksheetCallback);
							return;
						case c_oAscInsertOptions.InsertRows:
							functionModelAction = function () {
								fullRecalc = true;
								t.model.insertRowsBefore(_updateRangeIns.r1, _updateRangeIns.r2 - _updateRangeIns.r1 + 1);
								if(gUndoInsDelCellsFlag == true)
									t.autoFilters.insertRows(prop,_updateRangeIns, arn);
								else if(gUndoInsDelCellsFlag && typeof gUndoInsDelCellsFlag == "object" && gUndoInsDelCellsFlag.arg1 && gUndoInsDelCellsFlag.arg2 && gUndoInsDelCellsFlag.data)
									t.autoFilters._setColorStyleTable(gUndoInsDelCellsFlag.arg1, gUndoInsDelCellsFlag.arg2, gUndoInsDelCellsFlag.data, null, true);
								gUndoInsDelCellsFlag = true;
								t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
								t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
							};
							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(0, _updateRangeIns.r1, gc_nMaxCol0,
									_updateRangeIns.r2), c_oAscLockTypeElemSubType.InsertRows,
									onChangeWorksheetCallback);
							return;
						default: return;
					}
					break;

				case "delCell":
					var isCheckChangeAutoFilter;
					bUndoRedo = val.range != undefined;
					if (val && val.range) {
						_updateRangeDel = val.range;
						val = val.val;
					} else {
						_updateRangeDel = arn;
					}
					range = t.model.getRange3(_updateRangeDel.r1, _updateRangeDel.c1, _updateRangeDel.r2, _updateRangeDel.c2);
					switch (val) {
						case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftLeft, prop, bUndoRedo);
							if(!isCheckChangeAutoFilter)
								return;

							functionModelAction = function () {
								History.Create_NewPoint();
								History.StartTransaction();
								//t.autoFilters.isEmptyAutoFilters(arn);
								if (range.deleteCellsShiftLeft()) {
									fullRecalc = true;
									if(isCheckChangeAutoFilter == 'changeAutoFilter')
										t.autoFilters.insertColumn(prop, _updateRangeDel, arn, c_oAscDeleteOptions.DeleteCellsAndShiftLeft);
									t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
									t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
								}
								History.EndTransaction();
							};

							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1,
									gc_nMaxCol0, _updateRangeDel.r2), null, onChangeWorksheetCallback);
							return;
						case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftTop, prop, bUndoRedo);
							if(!isCheckChangeAutoFilter)
								return;

							functionModelAction = function () {
									History.Create_NewPoint();
									History.StartTransaction();
									//t.autoFilters.isEmptyAutoFilters(arn);
									if (range.deleteCellsShiftUp()) {
										fullRecalc = true;
										if(isCheckChangeAutoFilter == 'changeAutoFilter')
											t.autoFilters.insertRows(prop, _updateRangeDel, _updateRangeDel, c_oAscDeleteOptions.DeleteCellsAndShiftTop);
										t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
										t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
									}
									History.EndTransaction();
							};

							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1,
									_updateRangeDel.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
							return;
						case c_oAscDeleteOptions.DeleteColumns:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteColumns, prop, bUndoRedo);
							if(!isCheckChangeAutoFilter)
								return;
							functionModelAction = function () {
								fullRecalc = true;
								History.Create_NewPoint();
								History.StartTransaction();
								t.model.removeCols(_updateRangeDel.c1, _updateRangeDel.c2);
								t.autoFilters.insertColumn(prop,_updateRangeDel, arn, c_oAscDeleteOptions.DeleteColumns);
								History.EndTransaction();

								t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
								t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
							};
							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(_updateRangeDel.c1, 0, _updateRangeDel.c2,
									gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns,
									onChangeWorksheetCallback);
							return;
						case c_oAscDeleteOptions.DeleteRows:
							isCheckChangeAutoFilter = t.autoFilters.isActiveCellsCrossHalfFTable(_updateRangeDel, c_oAscDeleteOptions.DeleteRows, prop, bUndoRedo);
							if(!isCheckChangeAutoFilter)
								return;
							functionModelAction = function () {
								fullRecalc = true;
								History.Create_NewPoint();
								History.StartTransaction();
								t.model.removeRows(_updateRangeDel.r1, _updateRangeDel.r2);
								t.autoFilters.insertRows(prop,_updateRangeDel, arn, c_oAscDeleteOptions.DeleteRows);
								History.EndTransaction();

								t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
								t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
							};
							if(bUndoRedo)
								onChangeWorksheetCallback(true);
							else
								this._isLockedCells (new asc_Range(0, _updateRangeDel.r1, gc_nMaxCol0,
									_updateRangeDel.r2), c_oAscLockTypeElemSubType.DeleteRows,
									onChangeWorksheetCallback);
							return;
						default: return;
					}
					break;

				case "sheetViewSettings":
					functionModelAction = function () {
						t.model.setSheetViewSettings(val);

						isUpdateCols = true;
						isUpdateRows = true;
						fullRecalc = true;
					};

					return this._isLockedAll (onChangeWorksheetCallback);

				case "update":
					if (val !== undefined) {
						fullRecalc = !!val.fullRecalc;
						lockDraw = true === val.lockDraw;
					}
					break;

				case "updateRange":
					if (val && val.range) {
						t._updateCellsRange(val.range, val.canChangeColWidth, val.isLockDraw);
					}
					return;

				default: return;
			}

			t._initCellsArea(fullRecalc);
			if (fullRecalc) {
				t.cache.reset();
			} else {
				if (cleanCacheCols) { t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1)); }
				if (cleanCacheRows) { t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2)); }
			}
			t._cleanCellsTextMetricsCache();
			t._prepareCellTextMetricsCache(t.visibleRange);
			t.draw(lockDraw);

			t.handlers.trigger("reinitializeScroll");

			if (isUpdateCols) { t._updateVisibleColsCount(); }
			if (isUpdateRows) { t._updateVisibleRowsCount(); }

			if (false === lockDraw)
				t.objectRender.showDrawingObjects(true);
		};

		WorksheetView.prototype.expandColsOnScroll = function (isNotActive, updateColsCount, newColsCount) {
			var t = this;
			var arn;
			var bIsMaxCols = false;
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var maxc = Math.max(this.model.getColsCount(), this.cols.length, obr.maxCol);
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

			t._calcColumnWidths(/*fullRecalc*/2);
			return (nLastCols !== this.nColsCount || bIsMaxCols);
		};

		WorksheetView.prototype.expandRowsOnScroll = function (isNotActive, updateRowsCount, newRowsCount) {
			var t = this;
			var arn;
			var bIsMaxRows = false;
			var obr = this.objectRender ? this.objectRender.getDrawingAreaMetrics() : {maxCol: 0, maxRow: 0};
			var maxr = Math.max(this.model.getRowsCount() , this.rows.length, obr.maxRow);
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

			t._calcRowHeights(/*fullRecalc*/2);
			return (nLastRows !== this.nRowsCount || bIsMaxRows);
		};

		WorksheetView.prototype.optimizeColWidth = function (col) {
			var t = this;

			var onChangeWidthCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				var width = null;
				var row, ct, c, fl, str, maxW, tm, mc;
				var oldWidth;
				var lastHeight = null;
				var filterButton = null;

				t.cols[col].isCustomWidth = false;

				for (row = 0; row < t.rows.length; ++row) {
					// пересчет метрик текста
					t._addCellTextToCache(col, row, /*canChangeColWidth*/c_oAscCanChangeColWidth.all);
					ct = t._getCellTextCache(col, row);
					if (ct === undefined) {continue;}
					if (ct.flags.isMerged) {
						mc = ct.mc;
						// Для замерженных ячеек (с 2-мя или более колонками) оптимизировать не нужно
						if (mc.c1 !== mc.c2)
							continue;
					}

					if (ct.metrics.height > t.maxRowHeight) {
						// Запоминаем старую ширину (в случае, если у нас по высоте не уберется)
						oldWidth = ct.metrics.width;
						lastHeight = null;
						// вычисление новой ширины столбца, чтобы высота текста была меньше maxRowHeight
						c = t._getCell(col, row);
						fl = t._getCellFlags(c);
						if (fl.isMerged) {continue;}
						str = c.getValue2();
						maxW = ct.metrics.width + t.maxDigitWidth;
						while (1) {
							tm = t._roundTextMetrics( t.stringRender.measureString(str, fl, maxW) );
							if (tm.height <= t.maxRowHeight) {break;}
							if (lastHeight === tm.height) {
								// Ситуация, когда у нас текст не уберется по высоте (http://bugzserver/show_bug.cgi?id=19974)
								tm.width = oldWidth;
								break;
							}
							lastHeight = tm.height;
							maxW += t.maxDigitWidth;
						}
						width = Math.max(width, tm.width);
					} else {
						filterButton = t.autoFilters.getSizeButton({c1: col, r1: row});
						if (null !== filterButton && CellValueType.String === ct.cellType)
							width = Math.max(width, ct.metrics.width + filterButton.width);
						else
							width = Math.max(width, ct.metrics.width);
					}
				}

				if (width > 0) {
					var pad = t.width_padding * 2 + t.width_1px;
					var cc = Math.min(t._colWidthToCharCount(width + pad), /*max col width*/255);
					var cw = t._charCountToModelColWidth(cc, true);
				} else {
					cw = gc_dDefaultColWidthCharsAttribute;
				}

				History.Create_NewPoint();
				var oSelection = History.GetSelection();
				if(null != oSelection)
				{
					oSelection = oSelection.clone();
					oSelection.assign(col, 0, col, gc_nMaxRow0);
					oSelection.type = c_oAscSelectionType.RangeCol;
					History.SetSelection(oSelection);
					History.SetSelectionRedo(oSelection);
				}
				History.StartTransaction();
				// Выставляем, что это bestFit
				t.model.setColBestFit(true, cw, col, col);
				History.EndTransaction();

				t.nColsCount = 0;
				t._calcColumnWidths(/*fullRecalc*/0);
				t._updateVisibleColsCount();
				t._cleanCache(asc_Range(col, 0, col, t.rows.length - 1));
				t.changeWorksheet("update");
			};
			return this._isLockedAll (onChangeWidthCallback);
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
					if (ct.flags.isMerged) {
						mc = ct.mc;
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
				t.model.setRowBestFit (true, Math.min(height + t.height_1px, t.maxRowHeight), row, row);
				History.EndTransaction();

				t.nRowsCount = 0;
				t._calcRowHeights(/*fullRecalc*/0);
				t._updateVisibleRowsCount();
				t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
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

			offs = this._calcActiveRangeOffset();
			if (sc !== ar.startCol || sr !== ar.startRow) {
				this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				this.handlers.trigger("selectionChanged", this.getSelectionInfo());
			}
			return offs;
		};

		WorksheetView.prototype.findCellText = function (options) {
			var self = this;
			if (true !== options.isMatchCase)
				options.text = options.text.toLowerCase();
			var ar = options.activeRange ? options.activeRange : this.activeRange;
			var c = ar.startCol;
			var r = ar.startRow;
			var minC = 0;
			var minR = 0;
			var maxC = this.cols.length - 1;
			var maxR = this.rows.length - 1;
			var inc = options.scanForward ? +1 : -1;
			var ct, mc, excluded = [];
			var _tmpCell, cellText;

			function isExcluded(col, row) {
				for (var i = 0; i < excluded.length; ++i) {
					if (excluded[i].contains(col, row)) {return true;}
				}
				return false;
			}

			function findNextCell() {
				var ct = undefined;
				do {
					do {
						mc = self.model.getMergedByCell(r, c);
						if (mc) {excluded.push(mc);}
						if (options.scanByRows) {
							c += mc ? (options.scanForward ? mc.c2 + 1 - c : mc.c1 - 1 - c) : inc;
							if (c < minC || c > maxC) {c = options.scanForward ? minC : maxC; r += inc;}
						} else {
							r += mc ? (options.scanForward ? mc.r2 + 1 - r : mc.r1 - 1 - r) : inc;
							if (r < minR || r > maxR) {r = options.scanForward ? minR : maxR; c += inc;}
						}
						if (c < minC || c > maxC || r < minR || r > maxR) {return undefined;}
					} while ( isExcluded(c, r) );
					ct = self._getCellTextCache(c, r);
				} while (!ct);
				return ct;
			}

			for (ct = findNextCell(); ct; ct = findNextCell()) {
				// Не пользуемся RegExp, чтобы не возиться со спец.символами
				mc = this.model.getMergedByCell(r, c);
				if (mc)
					_tmpCell = this.model.getCell (new CellAddress(mc.r1, mc.c1, 0));
				else
					_tmpCell = this.model.getCell (new CellAddress(r, c, 0));
				cellText = _tmpCell.getValueForEdit();
				if (true !== options.isMatchCase)
					cellText = cellText.toLowerCase();
				if (cellText.indexOf(options.text) >= 0) {
					if (true !== options.isWholeCell || options.text.length === cellText.length)
						return (options.isNotSelect) ? (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r)) : this._setActiveCell(c, r);
				}
			}

			// Сбрасываем замерженные
			excluded = [];
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
				}
				else {
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
				}
				else {
					minC = ar.startCol;
					minR = 0;
				}
				maxC = this.cols.length - 1;
				maxR = this.rows.length - 1;
			}
			for (ct = findNextCell(); ct; ct = findNextCell()) {
				// Не пользуемся RegExp, чтобы не возиться со спец.символами
				mc = this.model.getMergedByCell(r, c);
				if (mc)
					_tmpCell = this.model.getCell (new CellAddress(mc.r1, mc.c1, 0));
				else
					_tmpCell = this.model.getCell (new CellAddress(r, c, 0));
				cellText = _tmpCell.getValueForEdit();
				if (true !== options.isMatchCase)
					cellText = cellText.toLowerCase();
				if (cellText.indexOf(options.text) >= 0) {
					if (true !== options.isWholeCell || options.text.length === cellText.length)
						return (options.isNotSelect) ? (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r)) : this._setActiveCell(c, r);
				}
			}
			return undefined;
		};

		WorksheetView.prototype.replaceCellText = function (options) {
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
			var t = this;
			var ar = this.activeRange.clone();
			var aReplaceCells = [];
			if (options.isReplaceAll) {
				// На ReplaceAll ставим медленную операцию
				t.handlers.trigger("slowOperation", true);
				var aReplaceCellsIndex = {};
				var optionsFind = {text: options.findWhat, scanByRows: true, scanForward: true,
					isMatchCase: options.isMatchCase, isWholeCell: options.isWholeCell, isNotSelect: true, activeRange: ar};
				var findResult, index;
				while (true) {
					findResult = t.findCellText(optionsFind);
					if (undefined === findResult)
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
				var mc = t.model.getMergedByCell(ar.startRow, ar.startCol);
				var c1 = mc ? mc.c1 : ar.startCol;
				var r1 = mc ? mc.r1 : ar.startRow;
				var c = t._getVisibleCell(c1, r1);

				if (c === undefined) {
					asc_debug("log", "Unknown cell's info: col = " + c1 + ", row = " + r1);
					t.handlers.trigger("onRenameCellTextEnd", 0, 0);
					return;
				}

				var cellValue = c.getValueForEdit();

				// Попробуем сначала найти
				if ((true === options.isWholeCell && cellValue.length !== options.findWhat.length) ||
					0 > cellValue.search(valueForSearching)) {
					t.handlers.trigger("onRenameCellTextEnd", 0, 0);
					return;
				}

				aReplaceCells.push(new asc_Range(c1, r1, c1, r1));
			}

			if (0 > aReplaceCells.length) {
				t.handlers.trigger("onRenameCellTextEnd", 0, 0);
				return;
			}
			this._replaceCellsText(aReplaceCells, valueForSearching, options);
		};

		WorksheetView.prototype._replaceCellsText = function (aReplaceCells, valueForSearching, options) {
			History.Create_NewPoint();
			History.StartTransaction();

			options.indexInArray = 0;
			options.countFind = aReplaceCells.length;
			options.countReplace = 0;
			this._replaceCellText(aReplaceCells, valueForSearching, options);
		};

		WorksheetView.prototype._replaceCellText = function (aReplaceCells, valueForSearching, options) {
			var t = this;
			if (options.indexInArray >= aReplaceCells.length) {
				History.EndTransaction();
				if (options.isReplaceAll) {
					// Завершаем медленную операцию
					t.handlers.trigger("slowOperation", false);
				}

				t.handlers.trigger("onRenameCellTextEnd", options.countFind, options.countReplace);
				return;
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
							/*isNotHistory*/true);
					}
				}

				window.setTimeout(function () {t._replaceCellText(aReplaceCells, valueForSearching, options)}, 1);
			};

			this._isLockedCells (aReplaceCells[options.indexInArray], /*subType*/null, onReplaceCallback);
		};

		WorksheetView.prototype.findCell = function (reference) {
			var t = this;
			var match = (/(?:R(\d+)C(\d+)|([A-Z]+[0-9]+))(?::(?:R(\d+)C(\d+)|([A-Z]+[0-9]+)))?/i).exec(reference);
			if (!match) {return null;}

			function _findCell(match1, match2, match3) {
				var addr = typeof match1 === "string" ?
						new CellAddress(parseInt(match1), parseInt(match2)) :
						typeof match3 === "string" ? new CellAddress(match3) : null;
				if (addr && addr.isValid() && addr.getRow0() >= t.rows.length) {
					t.nRowsCount = addr.getRow0() + 1;
					t._calcRowHeights(/*fullRecalc*/2);
				}
				if (addr && addr.isValid() && addr.getCol0() >= t.cols.length) {
					t.nColsCount = addr.getCol0() + 1;
					t._calcColumnWidths(/*fullRecalc*/2);
				}
				return addr && addr.isValid() ? addr : null;
			}

			var addr1 = _findCell(match[1], match[2], match[3]);
			var addr2 = _findCell(match[4], match[5], match[6]);
			if (!addr1 && !addr2) {
				return {};
			}
			var delta = t._setActiveCell(addr1.getCol0(), addr1.getRow0());
			return !addr2 ? delta :
				t.changeSelectionEndPoint(addr2.getCol0() - addr1.getCol0(), addr2.getRow0() - addr1.getRow0(),
				/*isCoord*/false, /*isSelectMode*/false);
		};


		// ----- Cell Editor -----

		WorksheetView.prototype.setCellEditMode = function (isCellEditMode) {
			this.isCellEditMode = isCellEditMode;
		};

		WorksheetView.prototype.setFormulaEditMode = function (isFormulaEditMode) {
			this.isFormulaEditMode = isFormulaEditMode;
		};

		WorksheetView.prototype.getFormulaEditMode = function () {
			return this.isFormulaEditMode;
		};

		WorksheetView.prototype.setSelectionDialogMode = function (isSelectionDialogMode, selectRange) {
			if (isSelectionDialogMode === this.isSelectionDialogMode)
				return;
			this.isSelectionDialogMode = isSelectionDialogMode;
			this.cleanSelection();

			if (false === this.isSelectionDialogMode) {
				if (null !== this.copyOfActiveRange) {
					this.activeRange = this.copyOfActiveRange.clone(true);
				}
				this.copyOfActiveRange = null;
			} else {
				this.copyOfActiveRange = this.activeRange.clone(true);
				if (selectRange) {
					selectRange = parserHelp.parse3DRef(selectRange);
					if (selectRange) {
						// ToDo стоит менять и лист
						selectRange = this.model.getRange2(selectRange.range);
						if (null !== selectRange)
						{
							var bbox = selectRange.getBBox0();
							this.activeRange.assign(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
						}
					}
				}
			}

			this._drawSelection();
		};

		// Получаем свойство: редактируем мы сейчас или нет
		WorksheetView.prototype.getCellEditMode = function () {
			return this.isCellEditMode;
		};

		WorksheetView.prototype._isFormula = function (val) {
			return val.length > 0 && val[0].text.length > 1 && val[0].text.charAt(0) === "=" ? true : false;
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
			return mergedRange ? mergedRange : asc_Range(col, row, col, row);
		};

		WorksheetView.prototype._saveCellValueAfterEdit = function (oCellEdit, c, val, flags, skipNLCheck, isNotHistory) {
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
				t.autoFilters._renameTableColumn(oCellEdit);
			}

			if (!isFormula) {
				// Нужно ли выставлять WrapText (ищем символ новой строки в тексте)
				var bIsSetWrap = false;
				if (!skipNLCheck) {
					for (var key in val) {
						if (val[key].text.indexOf(kNewLine) >= 0) {
							bIsSetWrap = true;
							break;
						}
					}
				}
				if (bIsSetWrap)
					c.setWrap(true);

				// Для формулы обновление будет в коде рассчета формулы
				t._updateCellsRange(oCellEdit, /*canChangeColWidth*/c_oAscCanChangeColWidth.numbers);
			}

			if (!isNotHistory) {
				History.EndTransaction();
			}

			// если вернуть false, то редактор не закроется
			return true;
		};

		WorksheetView.prototype.openCellEditor = function (editor, x, y, isCoord, fragments, cursorPos,
														   isFocus, isClearCell, isHideCursor, activeRange) {
			var t = this, vr = t.visibleRange.clone(), tc = t.cols, tr = t.rows, col, row, c, fl, mc, bg;
			var offsetX = 0, offsetY = 0;
			var ar = t.activeRange;
			if (activeRange)
				t.activeRange = activeRange.clone();

			if (t.objectRender.checkCursorDrawingObject(x, y))
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
				if (fl.isMerged && col > vr.c2)
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
				if (fl.isMerged && row > vr.r2)
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
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
				col = t._findColUnderCursor(x, true);
				row = t._findRowUnderCursor(y, true);
				if (!col || !row) {return false;}
				col = col.col;
				row = row.row;
			} else {
				col = ar.startCol;
				row = ar.startRow;
			}

			// Возможно стоит заменить на ячейку из кеша
			c = t._getVisibleCell(col, row);
			if (!c) {throw "Can not get cell data (col=" + col + ", row=" + row + ")";}

			fl = t._getCellFlags(c);
			if (fl.isMerged) {
				mc = t.model.getMergedByCell(row, col);
				c = t._getVisibleCell(mc.c1, mc.r1);
				if (!c) {throw "Can not get merged cell data (col=" + mc.c1 + ", row=" + mc.r1 + ")";}
				fl = t._getCellFlags(c);

				// Первую ячейку нужно сделать видимой
				var bIsUpdateX = false;
				var bIsUpdateY = false;
				if (mc.c1 < vr.c1) {
					t.visibleRange.c1 = vr.c1 = mc.c1;
					bIsUpdateX = true;
					t._calcVisibleColumns();
				}
				if (mc.r1 < vr.r1) {
					t.visibleRange.r1 = vr.r1 = mc.r1;
					bIsUpdateY = true;
					t._calcVisibleRows();
				}
				if (bIsUpdateX && bIsUpdateY) {
					this.handlers.trigger("reinitializeScroll");
				} else if (bIsUpdateX) {
					this.handlers.trigger("reinitializeScrollX");
				} else if (bIsUpdateY) {
					this.handlers.trigger("reinitializeScrollY");
				}

				if (bIsUpdateX || bIsUpdateY) {
					t.draw();
				}
			}

			if (this.topLeftFrozenCell) {
				var cFrozen = this.topLeftFrozenCell.getCol0();
				var rFrozen = this.topLeftFrozenCell.getRow0();
				if (0 < cFrozen) {
					if (col > cFrozen)
						offsetX = tc[cFrozen].left - tc[0].left;
					else {
						vr.c1 = 0;
						vr.c2 = cFrozen - 1;
					}
				}
				if (0 < rFrozen) {
					if (row > rFrozen)
						offsetY = tr[rFrozen].top - tr[0].top;
					else {
						vr.r1 = 0;
						vr.r2 = rFrozen - 1;
					}
				}
			}

			bg = c.getFill();
			t.isFormulaEditMode = false;
			// Очищаем массив ячеек для текущей формулы
			t.arrActiveFormulaRanges = [];

			var oFontColor = c.getFontcolor();
			// Скрываем окно редактирования комментария
			this.model.workbook.handlers.trigger("asc_onHideComment");

			if (fragments === undefined) {
				var _fragmentsTmp = c.getValueForEdit2();
				fragments = [];
				for (var i = 0; i < _fragmentsTmp.length; ++i)
					fragments.push(_fragmentsTmp[i].clone());
			}

			editor.open({
				cellX: t.cellsLeft + tc[!fl.isMerged ? col : mc.c1].left - tc[vr.c1].left + offsetX,
				cellY: t.cellsTop + tr[!fl.isMerged ? row : mc.r1].top - tr[vr.r1].top + offsetY,
				leftSide: getLeftSide(!fl.isMerged ? col : mc.c1),
				rightSide: getRightSide(!fl.isMerged ? col : mc.c2),
				bottomSide: getBottomSide(!fl.isMerged ? row : mc.r2),
				fragments: fragments,
				flags: fl,
				font: new asc_FP(c.getFontname(), c.getFontsize()),
				background: bg !== null ? bg : t.settings.cells.defaultState.background,
				textColor: oFontColor || t.settings.cells.defaultState.color,
				cursorPos: cursorPos,
				zoom: t.getZoom(),
				focus: isFocus,
				isClearCell: isClearCell,
				isHideCursor: isHideCursor,
				saveValueCallback: function (val, flags, skipNLCheck) {
					var oCellEdit = fl.isMerged ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(col, row, col, row);
					return t._saveCellValueAfterEdit(oCellEdit, c, val, flags, skipNLCheck, /*isNotHistory*/false);
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

			var bSuccess = t.openCellEditor(editor, 0, 0, /*isCoord*/false, /*fragments*/undefined, /*cursorPos*/undefined, isFocus, /*isClearCell*/true,
				/*isHideCursor*/false, activeRange);
			if (bSuccess) {
				editor.paste(copyValue, cursorPos);
			}
			return bSuccess;
		};

		WorksheetView.prototype._updateCellsRange = function (range, canChangeColWidth, lockDraw) {
			var t = this, r, c, h, d, ct;
			var mergedRange, bUpdateRowHeight;

			if (range === undefined) {range = t.activeRange.clone(true);}

			if(gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2)
			{
				range = range.clone();
				if(gc_nMaxCol0 === range.c2)
					range.c2 = this.cols.length - 1;
				if(gc_nMaxRow0 === range.r2)
					range.r2 = this.rows.length - 1;
			}

			t._cleanCache(range);

			// Если размер диапазона превышает размер видимой области больше чем в 3 раза, то очищаем весь кэш
			if (t._isLargeRange(range)) {
				t.changeWorksheet("update", {lockDraw: lockDraw});
				return;
			}

			var cto;
			for (r = range.r1; r <= range.r2; ++r) {
				if (t.height_1px > t.rows[r].height) {continue;}
				for (c = range.c1; c <= range.c2; ++c) {
					if (t.width_1px > t.cols[c].width) {continue;}
					c = t._addCellTextToCache(c, r, canChangeColWidth); // may change member 'this.isChanged'
				}
				for (h = t.defaultRowHeight, d = t.defaultRowDescender, c = 0; c < t.cols.length; ++c) {
					ct = t._getCellTextCache(c, r, true);
					if (!ct) {continue;}

					/**
					 * Пробегаемся по строке и смотрим не продолжается ли ячейка на соседние.
					 * С помощью этой правки уйдем от обновления всей строки при каких-либо действиях
					 */
					if ((c < range.c1 || c > range.c2) && (0 !== ct.sideL || 0 !== ct.sideR)) {
						cto = t._calcCellTextOffset(c, r, ct.cellHA, ct.metrics.width);
						ct.cellW = cto.maxWidth;
						ct.sideL = cto.leftSide;
						ct.sideR = cto.rightSide;
					}

					// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
					if (!ct.flags.isMerged) {
						bUpdateRowHeight = true;
					} else {
						mergedRange = ct.mc;
						// Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
						bUpdateRowHeight = mergedRange.r1 === mergedRange.r2;
					}
					if (bUpdateRowHeight)
						h = Math.max(h, ct.metrics.height);

					if (ct.cellVA !== kvaTop && ct.cellVA !== kvaCenter && !ct.flags.isMerged) {
						d = Math.max(d, ct.metrics.height - ct.metrics.baseline);
					}
				}
				if (Math.abs(h - t.rows[r].height) > 0.000001 && !t.rows[r].isCustomHeight) {
					if (!t.rows[r].isDefaultHeight) {
						t.rows[r].heightReal = t.rows[r].height = Math.min(h, t.maxRowHeight);
						t.model.setRowHeight(t.rows[r].height + this.height_1px, r, r);
						t.isChanged = true;
					}
				}
				if (Math.abs(d - t.rows[r].descender) > 0.000001) {
					t.rows[r].descender = d;
					t.isChanged = true;
				}
			}

			if (t.isChanged) {
				t.isChanged = false;
				t._initCellsArea(true);
				t.cache.reset();
				t._cleanCellsTextMetricsCache();
				t._prepareCellTextMetricsCache(t.visibleRange);
				t.handlers.trigger("reinitializeScroll");
				t.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				t.handlers.trigger("selectionChanged", t.getSelectionInfo());
				t.handlers.trigger("selectionMathInfoChanged", t.getSelectionMathInfo());
			}

			t.objectRender.rebuildChartGraphicObjects(t.activeRange.clone(true));
			t.cellCommentator.updateCommentPosition();
			t.draw(lockDraw);
		};

		WorksheetView.prototype.enterCellRange = function (editor) {
			var t = this;

			if (!t.isFormulaEditMode)
				return;

			var ar = t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1].clone(true);
			// Замерженную ячейку должны отдать только левую верхнюю.
			var mergedRange = this.model.getMergedByCell(ar.r1, ar.c1);
			if (mergedRange && ar.isEqual(mergedRange)) {
				ar.r2 = ar.r1;
				ar.c2 = ar.c1;
			}

			var s = t.getActiveRange(ar);

			editor.enterCellRange(s);
		};

		WorksheetView.prototype.changeCellRange = function (editor,range){
			var s = this.getActiveRange(range);
			if( range.isAbsolute ){
				var ra = range.isAbsolute.split(":"), _s;
				if( ra.length >= 1 ){
					var sa = s.split(":");
					for( var ind = 0; ind < sa.length; ind++ ){
						if( ra[ra.length>1?ind:0].indexOf("$") == 0 ){
							sa[ind] = "$"+sa[ind];
						}
						if( ra[ra.length>1?ind:0].lastIndexOf("$") != 0 ){
							for(var i = 0; i< sa[ind].length; i++){
								if(sa[ind].charAt(i).match(/[0-9]/gi)){
									_s = i;
									break;
								}
							}
							sa[ind] = sa[ind].substr(0,_s) + "$" +sa[ind].substr(_s,sa[ind].length);
						}
					}
					s = "";
					sa.forEach(function(e,i){
						s += (i!=0?":":"");
						s += e;
					})
				}
			}
			editor.changeCellRange(range,s);
			return true;
		};

		WorksheetView.prototype.getActiveRange = function (ar) {
			if (ar.c1 === ar.c2 && ar.r1 === ar.r2) {return this._getCellTitle(ar.c1, ar.r1);}
			if (ar.c1 === ar.c2 && ar.r1 === 0 && ar.r2 === this.rows.length -1) {var ct = this._getColumnTitle(ar.c1); return ct + ":" + ct;}
			if (ar.r1 === ar.r2 && ar.c1 === 0 && ar.c2 === this.cols.length -1) {var rt = this._getRowTitle(ar.r1); return rt + ":" + rt;}
			if (ar.r1 === 0 && ar.r2 === gc_nMaxRow0 || ar.r1 === 1 && ar.r2 === gc_nMaxRow ){return this._getColumnTitle(ar.c1) + ":" + this._getColumnTitle(ar.c2);}
			if (ar.c1 === 0 && ar.c2 === gc_nMaxCol0 || ar.c1 === 1 && ar.c2 === gc_nMaxCol ){return this._getRowTitle(ar.r1) + ":" + this._getRowTitle(ar.r2);}
			return this._getCellTitle(ar.c1, ar.r1) + ":" + this._getCellTitle(ar.c2, ar.r2);
		};

		WorksheetView.prototype.addFormulaRange = function (range) {
			var r = range !== undefined ? range :
				new asc_Range(this.activeRange.c1, this.activeRange.r1, this.activeRange.c2, this.activeRange.r2);
			if (r.startCol === undefined || r.startRow === undefined) {
				r.startCol = r.c1;
				r.startRow = r.r1;
			}
			this.arrActiveFormulaRanges.push(r);
			this._fixSelectionOfMergedCells();
		};

		WorksheetView.prototype.changeFormulaRange = function (range) {
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

		WorksheetView.prototype.addAutoFilter = function (lTable, addFormatTableOptionsObj) {
			var t = this;
			var ar = t.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.autoFilters.addAutoFilter(lTable, ar, undefined, false, addFormatTableOptionsObj);
			};
			this._isLockedAll (onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.applyAutoFilter = function (type, autoFilterObject) {
			var t = this;
			var ar = t.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.autoFilters.applyAutoFilter(type, autoFilterObject, ar);
			};
			this._isLockedAll (onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.sortColFilter = function (type,cellId) {
			var t = this;
			var ar = this.activeRange.clone(true);
			var onChangeAutoFilterCallback = function (isSuccess) {
				if (false === isSuccess)
					return;

				t.autoFilters.sortColFilter(type, cellId, ar);
			};
			this._isLockedAll (onChangeAutoFilterCallback);
		};

		WorksheetView.prototype.getAddFormatTableOptions = function () {
			var ar = this.activeRange.clone(true);
			return this.autoFilters.getAddFormatTableOptions(ar);
		};

		WorksheetView.prototype._loadFonts = function (fonts, callback) {
			var api = window["Asc"]["editor"];
			api._loadFonts(fonts, callback);
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].WorksheetView = WorksheetView;


	}
)(jQuery, window);
