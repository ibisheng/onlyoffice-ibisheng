"use strict";

/* WorkbookView.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Jan 27, 2012
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
		var asc					= window["Asc"];
		var asc_applyFunction	= asc.applyFunction;
		var asc_round			= asc.round;
		var asc_typeof			= asc.typeOf;
		var asc_FP				= asc.FontProperties;
		var asc_CE				= asc.CellEditor;
		var asc_WSV				= asc.WorksheetView;
		var asc_CB				= asc.Clipboard;
		var asc_CMM				= asc.asc_CMouseMoveData;
		var asc_CPrintPagesData	= asc.CPrintPagesData;
		var asc_DC				= asc.DrawingContext;
		var asc_SR				= asc.StringRender;
		var asc_getcvt			= asc.getCvtRatio;
		var asc_CSP				= asc.asc_CStylesPainter;


		/**
		 * Widget for displaying and editing Workbook object
		 * -----------------------------------------------------------------------------
		 * @param {Workbook} model               					Workbook
		 * @param {EventsController} controller  					Events controller
		 * @param {HandlersList} handlers        					Events handlers for WorkbookView events
		 * @param {Element} elem                 					Container element
		 * @param {Element} inputElem            					Input element for top line editor
		 * @param {Object} Api
		 * @param {asc_CCollaborativeEditing} collaborativeEditing
		 * @param {c_oAscFontRenderingModeType} fontRenderingMode
		 * @param {Object} settings              					Settings
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode, settings) {
			if ( !(this instanceof WorkbookView) ) {
				return new WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode, settings);
			}

			this.defaults = {
				worksheetDefaults: {},
				scroll: {
					widthPx	: 16,
					heightPx: 16
				}
			};

			this.model					= model;
			this.controller				= controller;
			this.handlers				= handlers;
			this.element				= elem;
			this.input					= inputElem;
			this.settings				= $.extend(true, {}, this.defaults, settings);
			this.clipboard				= new asc_CB();
			this.Api					= Api;
			this.collaborativeEditing	= collaborativeEditing;
			this.lastSendInfoRange		= null;
			this.canUpdateAfterShiftUp	= false;	// Нужно ли обновлять информацию после отпускания Shift

			//----- declaration -----
			this.canvas = undefined;
			this.canvasOverlay = undefined;
			this.canvasGraphic = undefined;
			this.canvasGraphicOverlay = undefined;
			this.wsActive = -1;
			this.wsViews = [];
			this.cellEditor = undefined;
			this.fontRenderingMode = null;

			this._lockDraw = false;

			// Фонт, который выставлен в DrawingContext, он должен быть один на все DrawingContext-ы
			this.m_oFont = new asc_FP(this.model.getDefaultFont(), this.model.getDefaultSize());

			// Теперь у нас 2 FontManager-а на весь документ + 1 для автофигур (а не на каждом листе свой)
			this.fmgrGraphics = [];						// FontManager for draw (1 для обычного + 1 для поворотного текста)
			this.fmgrGraphics.push(new CFontManager());	// Для обычного
			this.fmgrGraphics.push(new CFontManager());	// Для поворотного
			this.fmgrGraphics.push(new CFontManager());	// Для автофигур

			this.fmgrGraphics[0].Initialize(true); // IE memory enable
			this.fmgrGraphics[1].Initialize(true); // IE memory enable
			this.fmgrGraphics[2].Initialize(true); // IE memory enable

			this.buffers = {};
			this.drawingCtx = undefined;
			this.overlayCtx = undefined;
			this.drawingGraphicCtx = undefined;
			this.overlayGraphicCtx = undefined;
			this.stringRender = undefined;
			this.drawingCtxCharts = undefined;

			// Максимальная ширина числа из 0,1,2...,9, померенная в нормальном шрифте(дефалтовый для книги) в px(целое)
			// Ecma-376 Office Open XML Part 1, пункт 18.3.1.13
			this.maxDigitWidth = 0;
			this.defaultFont = new asc_FP(this.model.getDefaultFont(), this.model.getDefaultSize());
			//-----------------------

            this.m_dScrollY         = 0;
            this.m_dScrollX         = 0;
            this.m_dScrollY_max     = 1;
            this.m_dScrollX_max     = 1;

            this.MobileTouchManager = null;

			this._init(fontRenderingMode);

			return this;
		}

		WorkbookView.prototype._init = function (fontRenderingMode) {
			var self = this;

			// Init font managers rendering
			// Изначально мы инициализируем c_oAscFontRenderingModeType.hintingAndSubpixeling
			this.setFontRenderingMode(fontRenderingMode, /*isInit*/true);

			// add style
            var _head = document.getElementsByTagName('head')[0];
            var style0 = document.createElement('style');
            style0.type = 'text/css';
            style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
            _head.appendChild(style0);

            // create canvas
			if (null != this.element) {
				this.element.innerHTML = '<div id="ws-canvas-outer">\
											<canvas id="ws-canvas"></canvas>\
											<canvas id="ws-canvas-overlay"></canvas>\
											<canvas id="ws-canvas-graphic"></canvas>\
											<canvas id="ws-canvas-graphic-overlay"></canvas>\
											<canvas id="id_target_cursor" class="block_elem" width="1" height="1"\
												style="width:2px;height:13px;display:none;z-index:1004;"></canvas>\
										</div>';

				this.canvas = document.getElementById("ws-canvas");
				this.canvasOverlay = document.getElementById("ws-canvas-overlay");
				this.canvasGraphic = document.getElementById("ws-canvas-graphic");
				this.canvasGraphicOverlay = document.getElementById("ws-canvas-graphic-overlay");
				this._canResize();
			}

			this.buffers.main = asc_DC({canvas: this.canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont});
			this.buffers.overlay = asc_DC({canvas: this.canvasOverlay, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont});
			this.buffers.overlay.ctx.isOverlay = true;		// Для разруливания _activateOverlayCtx / _deactivateOverlayCtx
			
			this.buffers.mainGraphic = asc_DC({canvas: this.canvasGraphic, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont});
			this.buffers.overlayGraphic = asc_DC({canvas: this.canvasGraphicOverlay, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont});
			

			this.drawingCtx = this.buffers.main;
			this.overlayCtx = this.buffers.overlay;
			this.drawingGraphicCtx = this.buffers.mainGraphic;
			this.overlayGraphicCtx = this.buffers.overlayGraphic;

			// Shapes
			this.buffers.shapeCtx = new CGraphics();
			this.buffers.shapeCtx.init(this.drawingGraphicCtx.ctx, this.drawingGraphicCtx.getWidth(0), this.drawingGraphicCtx.getHeight(0), this.drawingGraphicCtx.getWidth(3), this.drawingGraphicCtx.getHeight(3));
			this.buffers.shapeCtx.m_oFontManager = this.fmgrGraphics[2];

			this.buffers.shapeOverlayCtx = new CGraphics();
			this.buffers.shapeOverlayCtx.init(this.overlayGraphicCtx.ctx, this.overlayGraphicCtx.getWidth(0), this.overlayGraphicCtx.getHeight(0), this.overlayGraphicCtx.getWidth(3), this.overlayGraphicCtx.getHeight(3));
			this.buffers.shapeOverlayCtx.m_oFontManager = this.fmgrGraphics[2];

			this.drawingCtxCharts	= asc_DC({units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont});

			this.stringRender		= asc_SR(this.buffers.main);
			this.stringRender.setDefaultFont(this.defaultFont);

			// Мерить нужно только со 100% и один раз для всего документа
			this._calcMaxDigitWidth();

			if (!window["NATIVE_EDITOR_ENJINE"]) {
			    // initialize events controller
			    this.controller.init(this, this.element, /*this.canvasOverlay*/ this.canvasGraphicOverlay, /*handlers*/{
				    "resize":					function () {self.resize.apply(self, arguments);},
				    "reinitializeScroll":		function () {self._onScrollReinitialize.apply(self, arguments);},
				    "scrollY":					function () {self._onScrollY.apply(self, arguments);},
				    "scrollX":					function () {self._onScrollX.apply(self, arguments);},
				    "changeSelection":			function () {self._onChangeSelection.apply(self, arguments);},
				    "changeSelectionDone":		function () {self._onChangeSelectionDone.apply(self, arguments);},
				    "changeSelectionRightClick":function () {self._onChangeSelectionRightClick.apply(self, arguments);},
				    "selectionActivePointChanged":	function () {self._onSelectionActivePointChanged.apply(self, arguments);},
				    "updateWorksheet":			function () {self._onUpdateWorksheet.apply(self, arguments);},
				    "resizeElement":			function () {self._onResizeElement.apply(self, arguments);},
				    "resizeElementDone":		function () {self._onResizeElementDone.apply(self, arguments);},
				    "changeFillHandle":			function () {self._onChangeFillHandle.apply(self, arguments);},
				    "changeFillHandleDone":		function () {self._onChangeFillHandleDone.apply(self, arguments);},
				    "moveRangeHandle":			function () {self._onMoveRangeHandle.apply(self, arguments);},
				    "moveRangeHandleDone":		function () {self._onMoveRangeHandleDone.apply(self, arguments);},
				    "moveResizeRangeHandle":	function () {self._onMoveResizeRangeHandle.apply(self, arguments);},
				    "moveResizeRangeHandleDone":function () {self._onMoveResizeRangeHandleDone.apply(self, arguments);},
				    "editCell":          function () {self._onEditCell.apply(self, arguments);},
				    "stopCellEditing":   function () {return self._onStopCellEditing.apply(self, arguments);},
				    "empty":					function () {self._onEmpty.apply(self, arguments);},
				    "canEnterCellRange":		function () {
															    self.cellEditor.setFocus(false);
															    var ret = self.cellEditor.canEnterCellRange();
															    ret ? self.cellEditor.activateCellRange() : true;
															    return ret;
														    },
				    "enterCellRange":			function () {self.cellEditor.setFocus(false); self.getWorksheet().enterCellRange(self.cellEditor);},
				    "changeCellRange":			function () {self.getWorksheet().changeCellRange(self.cellEditor)},
				    "copy":						function () {self.copyToClipboard.apply(self, arguments);},
				    "paste":					function () {self.pasteFromClipboard.apply(self, arguments);},
				    "cut":						function () {self.cutToClipboard.apply(self, arguments);},
				    "undo":						function () {self.undo.apply(self, arguments);},
				    "redo":						function () {self.redo.apply(self, arguments);},
				    "addColumn":			function () {self._onAddColumn.apply(self, arguments);},
				    "addRow":					function () {self._onAddRow.apply(self, arguments);},
				    "mouseDblClick":						function () {self._onMouseDblClick.apply(self, arguments);},
				    "showNextPrevWorksheet":		function () {self._onShowNextPrevWorksheet.apply(self, arguments);},
				    "setFontAttributes":				function () {self._onSetFontAttributes.apply(self, arguments);},
				    "selectColumnsByRange":			function () {self._onSelectColumnsByRange.apply(self, arguments);},
				    "selectRowsByRange":				function () {self._onSelectRowsByRange.apply(self, arguments);},
				    "save":											function () {self.Api.asc_Save();},
				    "showCellEditorCursor":			function () {self._onShowCellEditorCursor.apply(self, arguments);},
				    "print":					function () {self.Api.asc_Print();},
				    "addFunction":				function () {self.insertFormulaInEditor.apply(self, arguments);},
				    "canvasClick": function () {self.enableKeyEventsHandler(true);},
				    "autoFiltersClick":			function () {self._onAutoFiltersClick.apply(self, arguments);},
				    "commentCellClick":			function () {self._onCommentCellClick.apply(self, arguments);},
				    "isGlobalLockEditCell":		function () {return self.collaborativeEditing.getGlobalLockEditCell();},
				    "updateSelectionName":		function () {self._onUpdateSelectionName.apply(self, arguments);},

				    // Shapes
				    "graphicObjectMouseDown":				function () {self._onGraphicObjectMouseDown.apply(self, arguments);},
				    "graphicObjectMouseMove":				function () {self._onGraphicObjectMouseMove.apply(self, arguments);},
				    "graphicObjectMouseUp":					function () {self._onGraphicObjectMouseUp.apply(self, arguments);},
				    "graphicObjectMouseUpEx":				function () {self._onGraphicObjectMouseUpEx.apply(self, arguments);},
				    "graphicObjectWindowKeyDown":			function () {return self._onGraphicObjectWindowKeyDown.apply(self, arguments);},
				    "graphicObjectWindowKeyPress":			function () {return self._onGraphicObjectWindowKeyPress.apply(self, arguments);},
				    "getGraphicsInfo":						function () {return self._onGetGraphicsInfo.apply(self, arguments);},
				    "getSelectedGraphicObjects":			function () {return self._onGetSelectedGraphicObjects.apply(self, arguments);},
				    "updateSelectionShape":			function () {return self._onUpdateSelectionShape.apply(self, arguments);}
			    });

			    this.model.handlers.add("cleanCellCache", function (wsId, range, canChangeColWidth, bLockDraw) {
				    var ws = self.getWorksheetById(wsId);
				    if (ws)
					    ws.changeWorksheet("updateRange", {range: range,
						    isLockDraw: bLockDraw || wsId != self.getWorksheet(self.wsActive).model.getId(),
						    canChangeColWidth: canChangeColWidth});
			    });
			    this.model.handlers.add("changeWorksheetUpdate", function (wsId, val) {
				    self.getWorksheetById(wsId).changeWorksheet("update", val);
			    });
			    this.model.handlers.add("insertCell", function (wsId, val, range) {
				    self.getWorksheetById(wsId).changeWorksheet("insCell", {val: val, range: range});
			    });
			    this.model.handlers.add("deleteCell", function (wsId, val, range) {
				    self.getWorksheetById(wsId).changeWorksheet("delCell", {val: val, range: range});
			    });
			    this.model.handlers.add("showWorksheet", function (wsId) {
				    self.showWorksheetById(wsId);
				    var ws = self.getWorksheetById(wsId);
				    if ( ws )
					    self.handlers.trigger("asc_onActiveSheetChanged", ws.model.getIndex());
			    });
			    this.model.handlers.add("setSelection", function () {
				    self._onSetSelection.apply(self, arguments);
			    });
			    this.model.handlers.add("getSelection", function () {
				    return self._onGetSelection.apply(self);
			    });
			    this.model.handlers.add("getSelectionState", function () {
				    return self._onGetSelectionState.apply(self);
			    });
			    this.model.handlers.add("setSelectionState", function () {
				    self._onSetSelectionState.apply(self, arguments);
			    });
			    this.model.handlers.add("reInit", function () {
				    self.reInit.apply(self, arguments);
			    });
			    this.model.handlers.add("drawWS", function () {
				    self.drawWS.apply(self, arguments);
			    });
			    this.model.handlers.add("showDrawingObjects", function () {
				    self.onShowDrawingObjects.apply(self, arguments);
			    });
			    this.model.handlers.add("lockDraw", function () {
				    self.lockDraw.apply(self, arguments);
			    });
			    this.model.handlers.add("setCanUndo", function (bCanUndo) {
				    self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
			    });
			    this.model.handlers.add("setCanRedo", function (bCanRedo) {
				    self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
			    });
			    this.model.handlers.add("setDocumentModified", function (bIsModified) {
				    self.handlers.trigger("asc_onDocumentModifiedChanged", bIsModified);
			    });
			    this.model.handlers.add("initCommentsToSave", function (bIsModified) {
				    self._initCommentsToSave();
			    });
			    this.model.handlers.add("replaceWorksheet", function (from, to) {
				    self.replaceWorksheet(from, to);
			    });
			    this.model.handlers.add("removeWorksheet", function (nIndex) {
				    self.removeWorksheet(nIndex);
			    });
			    this.model.handlers.add("spliceWorksheet", function () {
				    self.spliceWorksheet.apply(self, arguments);
			    });
			    this.model.handlers.add("updateWorksheetByModel", function () {
				    self.updateWorksheetByModel.apply(self, arguments);
			    });
			    this.model.handlers.add("undoRedoAddRemoveRowCols", function (sheetId, type, range, bUndo) {
				    if (true === bUndo) {
					    if (historyitem_Worksheet_AddRows === type) {
						    self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
					    } else if (historyitem_Worksheet_RemoveRows === type) {
						    self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
					    } else if (historyitem_Worksheet_AddCols === type) {
						    self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
					    } else if (historyitem_Worksheet_RemoveCols === type) {
						    self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
					    }
				    } else {
					    if (historyitem_Worksheet_AddRows === type) {
						    self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					    } else if (historyitem_Worksheet_RemoveRows === type) {
						    self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					    } else if (historyitem_Worksheet_AddCols === type) {
						    self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					    } else if (historyitem_Worksheet_RemoveCols === type) {
						    self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
						    self.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					    }
				    }
			    });
			    this.model.handlers.add("undoRedoHideSheet", function (sheetId) {
				    self.showWorksheet(sheetId);
				    // Посылаем callback об изменении списка листов
				    self.handlers.trigger("asc_onSheetsChanged");
			    });


				if (this.input && this.input.addEventListener) {
					this.input.addEventListener("focus", function () {
						self.input.isFocused = true;
						if (self.controller.settings.isViewerMode) {
							return;
						}
						self.controller.setStrictClose(true);
						self.cellEditor.callTopLineMouseup = true;
						if (!self.controller.isCellEditMode && !self.controller.isFillHandleMode) {
							self._onEditCell(0, 0, /*isCoord*/false, /*isFocus*/true);
						}
					}, false);
				}

			    this.cellEditor = new asc_CE(this.element, this.input, this.fmgrGraphics, this.m_oFont,
					    /*handlers*/{
						    "closed"   : function () {self._onCloseCellEditor.apply(self, arguments);},
						    "updated"  : function () {self.handlers.trigger.apply(self.handlers,
							    ["asc_onCellTextChanged"].concat(Array.prototype.slice.call(arguments)));},
						    "gotFocus" : function (hasFocus) {self.controller.setFocus(!hasFocus);},
						    "copy"     : function () {self.copyToClipboard.apply(self, arguments);},
						    "paste"    : function () {self.pasteFromClipboard.apply(self, arguments);},
						    "cut"      : function () {self.cutToClipboard.apply(self, arguments);},
						    "updateFormulaEditMod": function () {
									    self.controller.setFormulaEditMode.apply(self.controller, arguments);
									    var ws = self.getWorksheet();
									    if (ws) {
										    ws.cleanSelection();
										    ws.cleanFormulaRanges();
										    ws.setFormulaEditMode.apply(ws, arguments);
									    }
								    },
						    "updateEditorState"	:	function () {self.handlers.trigger.apply(self.handlers,
							    ["asc_onEditCell"].concat(Array.prototype.slice.call(arguments)));},
						    "isGlobalLockEditCell" : function () {return self.collaborativeEditing.getGlobalLockEditCell();},
						    "updateFormulaEditModEnd": function (rangeUpdated) {
							    self.getWorksheet().updateSelection();
						    },
						    "newRange"     				: function (range) { self.getWorksheet().addFormulaRange(range); },
						    "existedRange" 				: function (range) { self.getWorksheet().changeFormulaRange(range); },
						    "updateUndoRedoChanged"		: function (bCanUndo, bCanRedo) {
							    self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
							    self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
						    },
							"applyCloseEvent"			: function () {self.controller._onWindowKeyDown.apply(self.controller, arguments);}
					    },
					    /*settings*/{
						    font: this.defaultFont
					    });
			}

			this.clipboard.Api = this.Api;
			this.clipboard.init();

            if (this.Api.isMobileVersion){
                this.MobileTouchManager = new CMobileTouchManager();
                this.MobileTouchManager.Init(this);
            }
			return this;
		};

		WorkbookView.prototype.destroy = function () {
			this.controller.destroy();
			this.cellEditor.destroy();
			return this;
		};


		WorkbookView.prototype._createWorksheetView = function (wsModel) {
			var self = this, opt  = $.extend(true, {}, this.settings.worksheetDefaults);
			return new asc_WSV(wsModel, /*handlers*/{
				"getViewerMode"				: function () { return self.controller.getViewerMode ? self.controller.getViewerMode() : true; },
				"reinitializeScroll"		: function () {self.controller.reinitializeScroll(/*All*/);},
				"reinitializeScrollY"		: function () {self.controller.reinitializeScroll(/*vertical*/1);},
				"reinitializeScrollX"		: function () {self.controller.reinitializeScroll(/*horizontal*/2);},
				"selectionChanged"			: function () {self._onWSSelectionChanged.apply(self, arguments);},
				"selectionNameChanged"		: function () {self._onSelectionNameChanged.apply(self, arguments);},
				"selectionMathInfoChanged"	: function () {self._onSelectionMathInfoChanged.apply(self, arguments);},
				"onErrorEvent"				: function (errorId, level) {self.handlers.trigger("asc_onError", errorId, level);},
				"slowOperation"				: function (isStart) {self.handlers.trigger((isStart ? "asc_onStartAction" : "asc_onEndAction"), c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);},
				"setAutoFiltersDialog"  	: function (arrVal) {self.handlers.trigger("asc_onSetAFDialog", arrVal);},
				"selectionRangeChanged"		: function (val) {self.handlers.trigger("asc_onSelectionRangeChanged", val);},
				"getDCForCharts"			: function () { return self.drawingCtxCharts; },
				"onRenameCellTextEnd"		: function (countFind, countReplace) {self.handlers.trigger("asc_onRenameCellTextEnd", countFind, countReplace);}
			}, this.buffers, this.stringRender, this.maxDigitWidth, this.collaborativeEditing, opt);
		};

		WorkbookView.prototype._onSelectionNameChanged = function (name) {
			this.handlers.trigger("asc_onSelectionNameChanged", name);
		};

		WorkbookView.prototype._onSelectionMathInfoChanged = function (info) {
			this.handlers.trigger("asc_onSelectionMathChanged", info);
		};

		// Проверяет, сменили ли мы диапазон (для того, чтобы не отправлять одинаковую информацию о диапазоне)
		WorkbookView.prototype._isEqualRange = function (range, isSelectOnShape) {
			if (null === this.lastSendInfoRange)
				return false;

			return this.lastSendInfoRange.isEqual(range) && this.lastSendInfoRangeIsSelectOnShape === isSelectOnShape;
		};

		WorkbookView.prototype._onWSSelectionChanged = function (info) {
			var ws = this.getWorksheet();
			var ar = ws.activeRange;
			this.lastSendInfoRange = ar.clone(true);
			this.lastSendInfoRangeIsSelectOnShape = ws.getSelectionShape();

			if (null === info) {
				info = ws.getSelectionInfo();
			}
			// При редактировании ячейки не нужно пересылать изменения
			if (this.input && false === ws.getCellEditMode()) {
				// Сами запретим заходить в строку формул, когда выделен shape
				this.input.disabled = true === this.lastSendInfoRangeIsSelectOnShape;
				this.input.value = info.text;
			}
			this.handlers.trigger("asc_onSelectionChanged", info);
		};


		WorkbookView.prototype._onScrollReinitialize = function (whichSB, callback) {
			var ws = this.getWorksheet(),
			    vsize = !whichSB || whichSB === 1 ? ws.getVerticalScrollRange() : undefined,
			    hsize = !whichSB || whichSB === 2 ? ws.getHorizontalScrollRange() : undefined;

            if( vsize != undefined )
                this.m_dScrollY_max = Math.max(this.controller.settings.vscrollStep * (vsize + 1), 1);
            if( hsize != undefined )
                this.m_dScrollX_max = Math.max(this.controller.settings.hscrollStep * (hsize + 1), 1);

            asc_applyFunction(callback, vsize, hsize);
		};

		WorkbookView.prototype._onScrollY = function (pos) {
			var ws = this.getWorksheet();
			var delta = asc_round(pos - ws.getFirstVisibleRow(/*allowPane*/true));
			if (delta !== 0) {
				ws.scrollVertical(delta, this.cellEditor,this.Api.isMobileVersion);
			}
		};

		WorkbookView.prototype._onScrollX = function (pos) {
			var ws = this.getWorksheet();
			var delta = asc_round(pos - ws.getFirstVisibleCol(/*allowPane*/true));
			if (delta !== 0) {
				ws.scrollHorizontal(delta, this.cellEditor, this.Api.isMobileVersion);
			}
		};

		WorkbookView.prototype._onSetSelection = function (range, validRange) {
			var ws = this.getWorksheet();
			ws._checkSelectionShape();
			ws.setActiveRangeObj(range);
			var d = ws.setSelectionUndoRedo(range, validRange);
			if (d) {
				if (d.deltaX) {this.controller.scrollHorizontal(d.deltaX);}
				if (d.deltaY) {this.controller.scrollVertical(d.deltaY);}
			}
		};

		WorkbookView.prototype._onGetSelection = function () {
			var ws = this.getWorksheet();
			return ws.getActiveRangeObj();
		};

		WorkbookView.prototype._onGetSelectionState = function () {
			var ws = this.getWorksheet();
			return ws.objectRender.controller.getSelectionState();
		};

		WorkbookView.prototype._onSetSelectionState = function (state) {
			var index = 0;
			for ( var i = 0; i < this.wsViews.length; i++ ) {
				if (this.wsViews[i] &&  state.sheetId === this.wsViews[i].model.Id ) {
					index = this.wsViews[i].model.index;
					break;
				}
			}
			var ws = this.getWorksheet(index);
			ws.objectRender.controller.setSelectionState(state);
            ws.objectRender.controller.updateSelectionState();
			
			// Селектим после выставления состояния
			if (state && state.selectedObjects && 0 < state.selectedObjects.length)
				ws.setSelectionShape(true);
		};

		WorkbookView.prototype._onChangeSelection = function (isStartPoint, dc, dr, isCoord, isSelectMode, callback) {
			var ws = this.getWorksheet();
			var d = isStartPoint ?
					ws.changeSelectionStartPoint(dc, dr, isCoord, isSelectMode):
					ws.changeSelectionEndPoint(dc, dr, isCoord, isSelectMode);
			if (!isCoord && !isStartPoint && !isSelectMode) {
				// Выделение с зажатым shift
				this.canUpdateAfterShiftUp = true;
			}
			asc_applyFunction(callback, d);
		};

		// Окончание выделения
		WorkbookView.prototype._onChangeSelectionDone = function (x, y) {
			var ws = this.getWorksheet();
			ws.changeSelectionDone();
			this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
			// Проверим, нужно ли отсылать информацию о ячейке
			var ar = ws.activeRange;
			var isSelectOnShape = ws.getSelectionShape();
			if (!this._isEqualRange(ar, isSelectOnShape)) {
				this._onWSSelectionChanged(ws.getSelectionInfo());
				this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
			}

			var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

			if ("hyperlink" === ct.target) {
				// Проверим замерженность
				var isHyperlinkClick = false;
				if ((ar.c1 === ar.c2 && ar.r1 === ar.r2) || isSelectOnShape)
					isHyperlinkClick = true;
				else {
					var mergedRange = ws.model.getMergedByCell(ar.r1, ar.c1);
					if (mergedRange && ar.isEqual(mergedRange))
						isHyperlinkClick = true;
				}
				if (isHyperlinkClick) {
					if (false === ct.hyperlink.hyperlinkModel.getVisited() && !isSelectOnShape) {
						ct.hyperlink.hyperlinkModel.setVisited(true);
						if (ct.hyperlink.hyperlinkModel.Ref)
							ws.changeWorksheet("updateRange", {range: ct.hyperlink.hyperlinkModel.Ref.getBBox0(),
								isLockDraw: false, canChangeColWidth: false});
					}
					switch (ct.hyperlink.asc_getType()) {
						case c_oAscHyperlinkType.WebLink:
							this.handlers.trigger("asc_onHyperlinkClick", ct.hyperlink.asc_getHyperlinkUrl());
							break;
						case c_oAscHyperlinkType.RangeLink:
							// ToDo надо поправить отрисовку комментария для данной ячейки (с которой уходим)
							this.handlers.trigger("asc_onHideComment");
							this.Api._asc_setWorksheetRange(ct.hyperlink);
							break;
					}
				}
			}
		};

		// Обработка нажатия правой кнопки мыши
		WorkbookView.prototype._onChangeSelectionRightClick = function (dc, dr) {
			var ws = this.getWorksheet();
			ws.changeSelectionStartPointRightClick(dc, dr);
		};

		// Обработка движения в выделенной области
		WorkbookView.prototype._onSelectionActivePointChanged = function (dc, dr, callback) {
			var ws = this.getWorksheet();
			var d = ws.changeSelectionActivePoint(dc, dr);
			asc_applyFunction(callback, d);
		};

		WorkbookView.prototype._onUpdateWorksheet = function (canvasElem, x, y, ctrlKey, callback) {
			var ws = this.getWorksheet(), ct = undefined;
			var arrMouseMoveObjects = [];					// Теперь это массив из объектов, над которыми курсор

			//ToDo: включить определение target, если находимся в режиме редактирования ячейки.
			if (this.controller.isCellEditMode && !this.controller.isFormulaEditMode) {
				canvasElem.style.cursor = "";
			} else if (x === undefined && y === undefined) {
				ws.cleanHighlightedHeaders();
			} else {
				ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

				// Отправление эвента об удалении всего листа (именно удалении, т.к. если просто залочен, то не рисуем рамку вокруг)
				if (undefined !== ct.userIdAllSheet) {
					arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.LockedObject, x: ct.lockAllPosLeft,
						y: ct.lockAllPosTop, userId: ct.userIdAllSheet,
						lockedObjectType: c_oAscMouseMoveLockedObjectType.Sheet}));
				} else {
					// Отправление эвента о залоченности свойств всего листа (только если не удален весь лист)
					if (undefined !== ct.userIdAllProps) {
						arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.LockedObject, x: ct.lockAllPosLeft,
							y: ct.lockAllPosTop, userId: ct.userIdAllProps,
							lockedObjectType: c_oAscMouseMoveLockedObjectType.TableProperties}));
					}
				}
				// Отправление эвента о наведении на залоченный объект
				if (undefined !== ct.userId) {
					arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.LockedObject, x: ct.lockRangePosLeft,
						y: ct.lockRangePosTop, userId: ct.userId,
						lockedObjectType: c_oAscMouseMoveLockedObjectType.Range}));
				}

				// Проверяем комментарии ячейки
				if (undefined !== ct.commentIndexes) {
					arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.Comment,
						x: ct.commentCoords.asc_getLeftPX(), reverseX: ct.commentCoords.asc_getReverseLeftPX(), y: ct.commentCoords.asc_getTopPX(),
						aCommentIndexes: ct.commentIndexes}));
				}
				// Проверяем гиперссылку
				if (ct.target === "hyperlink") {
					if (true === ctrlKey) {
						// Мы без нажатия на гиперлинк
					} else {
						ct.cursor = ct.cellCursor.cursor;
					}
					arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.Hyperlink, x: x, y: y,
						hyperlink: ct.hyperlink}));
				}

				/* Проверяем, может мы на никаком объекте (такая схема оказалась приемлимой
				 * для отдела разработки приложений)
				 */
				if (0 === arrMouseMoveObjects.length) {
					// Отправляем эвент, что мы ни на какой области
					arrMouseMoveObjects.push(asc_CMM({type: c_oAscMouseMoveType.None}));
				}
				// Отсылаем эвент с объектами
				this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);

                if(ct.target === "moveRange" && ctrlKey && ct.cursor == "move"){
                    ct.cursor = "copy";
                }

				if (canvasElem.style.cursor !== ct.cursor) {
					canvasElem.style.cursor = ct.cursor;
				}
				if (ct.target === "colheader" || ct.target === "rowheader") {
					ws.drawHighlightedHeaders(ct.col, ct.row);
				} else {
					ws.cleanHighlightedHeaders();
				}
			}
			asc_applyFunction(callback, ct);
		};

		WorkbookView.prototype._onResizeElement = function (target, x, y) {
			if (target.target === "colresize") {
				this.getWorksheet().drawColumnGuides(target.col, x, y, target.mouseX);
			} else if (target.target === "rowresize") {
				this.getWorksheet().drawRowGuides(target.row, x, y, target.mouseY);
			}
		};

		WorkbookView.prototype._onResizeElementDone = function (target, x, y, isResizeModeMove) {
			var ws = this.getWorksheet();
			if (isResizeModeMove) {
				ws.objectRender.saveSizeDrawingObjects();
				if (target.target === "colresize") {
						ws.changeColumnWidth(target.col, x, target.mouseX);
				} else if (target.target === "rowresize") {
						ws.changeRowHeight(target.row, y, target.mouseY);
				}
				ws.objectRender.updateSizeDrawingObjects();
				ws.cellCommentator.updateCommentPosition();
			}
			ws.draw();
		};

		// Обработка автозаполнения
		WorkbookView.prototype._onChangeFillHandle = function (x, y, callback) {
			var ws = this.getWorksheet();
			var d = ws.changeSelectionFillHandle(x, y);
			asc_applyFunction(callback, d);
		};

		// Обработка окончания автозаполнения
		WorkbookView.prototype._onChangeFillHandleDone = function (x, y, ctrlPress) {
			var ws = this.getWorksheet();
			ws.applyFillHandle(x, y, ctrlPress);
		};

		// Обработка перемещения диапазона
		WorkbookView.prototype._onMoveRangeHandle = function (x, y, callback,ctrlKey) {
			var ws = this.getWorksheet();
			var d = ws.changeSelectionMoveRangeHandle(x, y,ctrlKey);
			asc_applyFunction(callback, d);
		};

		// Обработка окончания перемещения диапазона
		WorkbookView.prototype._onMoveRangeHandleDone = function (ctrlKey) {
			var ws = this.getWorksheet();
			ws.applyMoveRangeHandle(ctrlKey);
		};

		WorkbookView.prototype._onMoveResizeRangeHandle = function (x, y, target, callback) {
			var ws = this.getWorksheet();
			var res = ws.changeSelectionMoveResizeRangeHandle(x, y, target);
			if(res){
				if(0 == target.targetArr)
					ws.changeCellRange(this.cellEditor,res.ar);
				asc_applyFunction(callback, res.d);
			}
		};

		WorkbookView.prototype._onMoveResizeRangeHandleDone = function (target, callback) {
			var ws = this.getWorksheet();
			var d = ws.applyMoveResizeRangeHandle(target);
		};

		WorkbookView.prototype._onAutoFiltersClick = function (x, y) {
			var ws = this.getWorksheet();
			ws.autoFilters.autoFocusClick(x,y);
		};

		WorkbookView.prototype._onCommentCellClick = function (x, y) {
			var ws = this.getWorksheet();
			var comments = ws.cellCommentator.getCommentsXY(x, y);
			if (comments.length)
				ws.cellCommentator.asc_showComment(comments[0].asc_getId());
		};

		WorkbookView.prototype._onUpdateSelectionName = function () {
			if (this.canUpdateAfterShiftUp) {
				this.canUpdateAfterShiftUp = false;
				var ws = this.getWorksheet();
				this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
			}
		};

		// Shapes
		WorkbookView.prototype._onGraphicObjectMouseDown = function (e, x, y) {
			var ws = this.getWorksheet();
			ws.objectRender.graphicObjectMouseDown(e, x, y);
		};

		WorkbookView.prototype._onGraphicObjectMouseMove = function (e, x, y) {
			var ws = this.getWorksheet();
			ws.objectRender.graphicObjectMouseMove(e, x, y);
		};

		WorkbookView.prototype._onGraphicObjectMouseUp = function (e, x, y) {
			var ws = this.getWorksheet();
			ws.objectRender.graphicObjectMouseUp(e, x, y);
		};

		WorkbookView.prototype._onGraphicObjectMouseUpEx = function (e, x, y) {
			//var ws = this.getWorksheet();
			//ws.objectRender.coordsManager.calculateCell(x, y);
		};

		WorkbookView.prototype._onGraphicObjectWindowKeyDown = function (e) {
			var ws = this.getWorksheet();
			return ws.objectRender.graphicObjectKeyDown(e);
		};

		WorkbookView.prototype._onGraphicObjectWindowKeyPress = function (e) {
			var ws = this.getWorksheet();
			return ws.objectRender.graphicObjectKeyPress(e);
		};

		WorkbookView.prototype._onGetGraphicsInfo = function (x, y) {
			var ws = this.getWorksheet();
			return ws.objectRender.checkCursorDrawingObject(x, y);
		};

		WorkbookView.prototype._onGetSelectedGraphicObjects = function () {
			var ws = this.getWorksheet();
			return ws.objectRender.getSelectedGraphicObjects();
		};

		WorkbookView.prototype._onUpdateSelectionShape = function (isSelectOnShape) {
			var ws = this.getWorksheet();
			return ws.setSelectionShape(isSelectOnShape);
		};

		// Double click
		WorkbookView.prototype._onMouseDblClick = function (x, y, isHideCursor, callback) {
			var ws = this.getWorksheet();
			var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

			if (ct.target === "colresize" || ct.target === "rowresize") {
				ct.target === "colresize" ? ws.optimizeColWidth(ct.col) : ws.optimizeRowHeight(ct.row);
				asc_applyFunction(callback);
			} else {
				if (ct.col >=0 && ct.row >= 0) {
					this.controller.setStrictClose( !ws._isCellEmpty(ct.col, ct.row) );
				}
				// Для нажатия на колонку/строку/all обрабатывать dblClick не нужно
				if ("colheader" === ct.target || "rowheader" === ct.target || "corner" === ct.target) {
					asc_applyFunction(callback);
					return;
				}

				if (ws.objectRender.checkCursorDrawingObject(x, y)) {
					asc_applyFunction(callback);
					return;
				}

				// При dbl клике фокус выставляем в зависимости от наличия текста в ячейке
				this._onEditCell (x, y, /*isCoord*/true, /*isFocus*/undefined, /*isClearCell*/undefined,
					/*isHideCursor*/isHideCursor);
			}
		};

		WorkbookView.prototype._onEditCell = function (x, y, isCoord, isFocus, isClearCell, isHideCursor, callback, event) {
			var t = this;

			// Проверка глобального лока
			if (this.collaborativeEditing.getGlobalLock())
				return;

			var ws = t.getWorksheet();
			var activeCellRange = ws.getActiveCell(x, y, isCoord);
			var arn = ws.activeRange.clone(true);

			var editFunction = function() {
				t.controller.setCellEditMode(true);
				ws.setCellEditMode(true);
				if (!ws.openCellEditor(t.cellEditor, x, y, isCoord, /*fragments*/undefined,
					/*cursorPos*/undefined, isFocus, isClearCell,
					/*isHideCursor*/isHideCursor, /*activeRange*/arn)) {
					t.controller.setCellEditMode(false);
					t.controller.setStrictClose(false);
					t.controller.setFormulaEditMode(false);
					ws.setCellEditMode(false);
					ws.setFormulaEditMode(false);
					t.input.disabled = true;
					asc_applyFunction(callback, false);
					return;
				}

				t.input.disabled = false;
				t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
				// Эвент от предыдущего нажатия на символ или на backspace
				if (event) {
					if ("keydown" === event.type)
						t.cellEditor._onWindowKeyDown(event);
					else if ("keypress" === event.type)
						t.cellEditor._onWindowKeyPress(event);
				}

				// Эвент на обновление состояния редактора
				t.cellEditor._updateEditorState();
				asc_applyFunction(callback, true);
			};

			var editLockCallback = function (res) {
				if (!res) {
					t.controller.setCellEditMode(false);
					t.controller.setStrictClose(false);
					t.controller.setFormulaEditMode(false);
					ws.setCellEditMode(false);
					ws.setFormulaEditMode(false);
					t.input.disabled = true;

					// Выключаем lock для редактирования ячейки
					t.collaborativeEditing.onStopEditCell();
					t.cellEditor.close(false);
					t._onWSSelectionChanged(null);
				}
			};

			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				editFunction();
				editLockCallback(true);
			} else {
				// Стартуем редактировать ячейку
				this.collaborativeEditing.onStartEditCell();
				if (ws._isLockedCells(activeCellRange, /*subType*/null, editLockCallback))
					editFunction();
			}
		};

		WorkbookView.prototype._onStopCellEditing = function () {
			return this.cellEditor.close(true);
		};

		WorkbookView.prototype._onCloseCellEditor = function () {
			this.controller.setCellEditMode(false);
			this.controller.setStrictClose(false);
			this.controller.setFormulaEditMode(false);
			var ws = this.getWorksheet();
			var isCellEditMode = ws.getCellEditMode();
			ws.setCellEditMode(false);
			ws.setFormulaEditMode(false);
			ws.updateSelection();
			this.Api.lastFocused = null;
			if (isCellEditMode)
				this.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
			// Обновляем состояние Undo/Redo
			History._sendCanUndoRedo();
		};

		WorkbookView.prototype._onEmpty = function () {
			this.getWorksheet().emptySelection(c_oAscCleanOptions.Text);
		};

		WorkbookView.prototype._onAddColumn = function (isNotActive) {
			var res = this.getWorksheet().expandColsOnScroll(isNotActive);
			if (res) {
				this.controller.reinitializeScroll(/*horizontal*/2);
			}
		};

		WorkbookView.prototype._onAddRow = function (isNotActive) {
			var res = this.getWorksheet().expandRowsOnScroll(isNotActive);
			if (res) {  // Добавлены строки
				// после добавления controller.settings.wheelScrollLines
				// ws.scrollVertical() здесь не нужен, scroll.js сам все разрулит
				this.controller.reinitializeScroll(/*vertical*/1);
			}
		};

		WorkbookView.prototype._onShowNextPrevWorksheet = function (direction) {
			// Проверка на неправильное направление
			if (0 === direction)
				return false;
			// Колличество листов
			var countWorksheets = this.model.getWorksheetCount();
			// Покажем следующий лист или предыдущий (если больше нет)
			var i, ws;
			for (i = this.wsActive + direction; (0 > direction) ? (i >= 0) : (i < countWorksheets); i += direction) {
				ws = this.model.getWorksheet(i);
				if (false === ws.getHidden()) {
					this.showWorksheet(i);
					this.handlers.trigger("asc_onActiveSheetChanged", i);
					return true;
				}
			}

			return false;
		};

		WorkbookView.prototype._onSetFontAttributes = function (prop) {
			var val;
			var selectionInfo = this.getWorksheet().getSelectionInfo();
			switch (prop) {
				case "b":
					val = !(selectionInfo.asc_getFont().asc_getBold());
					break;
				case "i":
					val = !(selectionInfo.asc_getFont().asc_getItalic());
					break;
				case "u":
					// ToDo для двойного подчеркивания нужно будет немного переделать схему
					val = !(selectionInfo.asc_getFont().asc_getUnderline());
					val = val ? EUnderline.underlineSingle : EUnderline.underlineNone;
					break;
				case "s":
					val = !(selectionInfo.asc_getFont().asc_getStrikeout());
					break;
			}
			return this.setFontAttributes(prop, val);
		};

		WorkbookView.prototype._onSelectColumnsByRange = function () {
			this.getWorksheet()._selectColumnsByRange();
		};

		WorkbookView.prototype._onSelectRowsByRange = function () {
			this.getWorksheet()._selectRowsByRange();
		};

		WorkbookView.prototype._onShowCellEditorCursor = function () {
			var ws = this.getWorksheet();
			if (ws instanceof asc_WSV) {
				// Показываем курсор
				if (ws.getCellEditMode())
					this.cellEditor.showCursor();
			}
		};

		WorkbookView.prototype.getTablePictures = function () {
			var autoFilters = new asc.AutoFilters();
			return autoFilters.getTablePictures(this.model, this.fmgrGraphics, this.m_oFont);
		};

		WorkbookView.prototype.getCellStyles = function () {
			var oStylesPainter = new asc_CSP();
			oStylesPainter.generateStylesAll(this.model.CellStyles, this.fmgrGraphics, this.m_oFont, this.stringRender);
			return oStylesPainter;
		};

		WorkbookView.prototype.getWorksheetById = function (id) {
			var wsModel = this.model.getWorksheetById(id);
			if (wsModel)
				return this.getWorksheet(wsModel.getIndex());
			return null;
		};

		/**
		 * @param index {Number}
		 * @return {WorksheetView}
		 */
		WorkbookView.prototype.getWorksheet = function (index) {
			var wb = this.model;
			var i  = asc_typeof(index) === "number" && index >= 0 ? index : wb.getActive();
			var ws = this.wsViews[i];
			if (!(ws instanceof asc_WSV)) {
				ws = this.wsViews[i] = this._createWorksheetView(wb.getWorksheet(i));
				ws._prepareComments();
				ws._prepareDrawingObjects();
			}
			return ws;
		};

		WorkbookView.prototype.showWorksheetById = function (id) {
			var wsModel = this.model.getWorksheetById(id);
			if ( wsModel )
				this.showWorksheet(wsModel.getIndex());
		};

		/** @param index {Number} */
		WorkbookView.prototype.showWorksheet = function (index, isResized) {
			if (index === this.wsActive) {return this;}

			// Только если есть активный
			if (-1 !== this.wsActive) {
				var ws = this.getWorksheet();
				if (ws instanceof asc_WSV) {
					// Останавливаем ввод данных в редакторе ввода
					if (ws.getCellEditMode() && !isResized)
						this._onStopCellEditing();
					// Делаем очистку селекта
					ws.cleanSelection();
				}
			}

			var wb = this.model;
			if (asc_typeof(index) === "number" && index >= 0) {
				if (index !== wb.getActive()) {wb.setActive(index);}
			} else {
				index = wb.getActive();
			}
			this.wsActive = index;

			ws = this.getWorksheet(index);
			// Мы меняли zoom, но не перерисовывали данный лист (он был не активный)
			if (ws.updateZoom)
				ws.changeZoom(true);
			if (isResized)
				ws.objectRender.resizeCanvas();

			ws.objectRender.setScrollOffset();
			ws.draw();
			this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
			this._onWSSelectionChanged(ws.getSelectionInfo());
			this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
			this.controller.reinitializeScroll();
            if(this.Api.isMobileVersion)
                this.MobileTouchManager.Resize();
			// Zoom теперь на каждом листе одинаковый, не отправляем смену
			return this;
		};

		/** @param nIndex {Number} массив индексов */
		WorkbookView.prototype.removeWorksheet = function (nIndex) {
			this.wsViews.splice(nIndex, 1);
			// Сбрасываем активный (чтобы не досчитывать после смены)
			this.wsActive = -1;
		};

		// Меняет местами 2 элемента просмотра
		WorkbookView.prototype.replaceWorksheet = function (indexFrom, indexTo) {
			// Только если есть активный
			if (-1 !== this.wsActive) {
				var ws = this.getWorksheet(this.wsActive);
				if (ws instanceof asc_WSV) {
					// Останавливаем ввод данных в редакторе ввода
					if (ws.getCellEditMode())
						this._onStopCellEditing();
					// Делаем очистку селекта
					ws.cleanSelection();
				}

				this.wsActive = -1;
				// Чтобы поменять, нужно его добавить
				ws = this.getWorksheet(indexTo);
			}
			var movedSheet = this.wsViews.splice(indexFrom,1);
			this.wsViews.splice(indexTo,0,movedSheet[0])
		};

		// Копирует элемент перед другим элементом
		WorkbookView.prototype.copyWorksheet = function (index, insertBefore) {
			// Только если есть активный
			if (-1 !== this.wsActive) {
				var ws = this.getWorksheet();
				if (ws instanceof asc_WSV) {
					// Останавливаем ввод данных в редакторе ввода
					if (ws.getCellEditMode())
						this._onStopCellEditing();
					// Делаем очистку селекта
					ws.cleanSelection();
				}

				this.wsActive = -1;
			}

			if (null != insertBefore && insertBefore >= 0 && insertBefore < this.wsViews.length){
				// Помещаем нулевой элемент перед insertBefore
				this.wsViews.splice(insertBefore, 0, null);
			}
		};

		WorkbookView.prototype.updateWorksheetByModel = function () {
			//расставляем ws так как они идут в модели.
			var oNewWsViews = [];
			for(var i in this.wsViews)
			{
				var item = this.wsViews[i];
				if(null != item)
					oNewWsViews[item.model.getIndex()] = item;
			}
			this.wsViews = oNewWsViews;
		};

		WorkbookView.prototype.spliceWorksheet = function () {
			this.wsViews.splice.apply(this.wsViews, arguments);
			this.wsActive = -1;
		};

		WorkbookView.prototype._canResize = function () {
			var oldWidth = this.canvas.width;
			var oldHeight = this.canvas.height;
			var width = this.element.offsetWidth - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.widthPx);
			var height = this.element.offsetHeight - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.heightPx);

			if (oldWidth === width && oldHeight === height)
				return false;

			this.canvas.width = this.canvasOverlay.width = this.canvasGraphic.width = this.canvasGraphicOverlay.width = width;
			this.canvas.height = this.canvasOverlay.height = this.canvasGraphic.height = this.canvasGraphicOverlay.height = height;

			// При смене ориентации у планшета, сбрасываются флаги у canvas!
			this.drawingCtx.initContextSmoothing();
			this.overlayCtx.initContextSmoothing();
			this.drawingCtxCharts.initContextSmoothing();
			return true;
		};

		/** @param event {jQuery.Event} */
		WorkbookView.prototype.resize = function (event) {
			if (this._canResize()) {
				this.getWorksheet().resize();
				this.showWorksheet(undefined, true);

			} else {
				// ToDo не должно происходить ничего, но нам приходит resize сверху
				this.showWorksheet(undefined, true);
			}
		};

		// Получаем свойство: редактируем мы сейчас или нет
		WorkbookView.prototype.getCellEditMode = function () {
			return this.controller.isCellEditMode;
		};

		WorkbookView.prototype.getZoom = function () {
			return this.drawingCtx.getZoom();
		};

		WorkbookView.prototype.changeZoom = function (factor) {
			if (factor === this.getZoom())
				return;

			this.buffers.main.changeZoom(factor);
			this.buffers.overlay.changeZoom(factor);
			this.buffers.mainGraphic.changeZoom(factor);
			this.buffers.overlayGraphic.changeZoom(factor);
			this.drawingCtxCharts.changeZoom(factor);

			var item;
			var activeIndex = this.model.getActive();
			for(var i in this.wsViews) {
				if (this.wsViews.hasOwnProperty(i)) {
					item = this.wsViews[i];
					// Меняем zoom (для не активных сменим как только сделаем его активным)
					item.changeZoom(/*isDraw*/i == activeIndex);
					item.objectRender.changeZoom(this.drawingCtx.scaleFactor);
					if (i == activeIndex) {
						item.draw();
						//ToDo item.drawDepCells();
					}
				}
			}

			this.controller.reinitializeScroll();
			this.handlers.trigger("asc_onZoomChanged",this.getZoom());
		};

		WorkbookView.prototype.enableKeyEventsHandler = function (f) {
			this.controller.enableKeyEventsHandler(f);
			if (this.cellEditor)
				this.cellEditor.enableKeyEventsHandler(f);
		};

/*		WorkbookView.prototype.openCellEditor = function (text, cursorPos, isFocus) {
			var t = this;
			if(t.cellEditor.hasFocus){//предполагаю, что если cellEditor.hasFocus == true, то он открыт - закрываем редактор.
				t.cellEditor.close();
			}
			var ws = this.getWorksheet();
			t.controller.setCellEditMode(true);
			ws.setCellEditMode(true);
			if (!ws.openCellEditorWithText(t.cellEditor, text, cursorPos, isFocus)) {
				t.controller.setCellEditMode(false);
				t.controller.setStrictClose(false);
				t.controller.setFormulaEditMode(false);
				ws.setCellEditMode(false);
				ws.setFormulaEditMode(false);
			}
		};
*/

		// Останавливаем ввод данных в редакторе ввода
		WorkbookView.prototype.closeCellEditor = function () {
			var ws = this.getWorksheet();
			// Останавливаем ввод данных в редакторе ввода
			if (ws instanceof asc_WSV && ws.getCellEditMode())
				this._onStopCellEditing();
		};

		WorkbookView.prototype.restoreFocus = function () {
			if (this.cellEditor.hasFocus) {
				this.cellEditor.restoreFocus();
			}
		};

		// Вставка формулы в редактор
		WorkbookView.prototype.insertFormulaInEditor = function (functionName, autoComplet) {
			var t = this;
			var ws = this.getWorksheet();

			// Проверяем, открыт ли редактор
			if (ws.getCellEditMode()) {
				if (false === this.cellEditor.insertFormula (functionName)) {
					// Не смогли вставить формулу, закроем редактор, с сохранением текста
					this.cellEditor.close(true);
				}
			} else {
				// Он закрыт
				var cellRange = null;
				// Если нужно сделать автозаполнение формулы, то ищем ячейки)
				if (autoComplet) {
					cellRange = ws.autoCompletFormula(functionName);
				}
				if (cellRange) {
					if (cellRange.notEditCell) {
						// Мы уже ввели все что нужно, редактор открывать не нужно
						return;
					}
					// Меняем значение ячейки
					functionName = "=" + functionName + "(" + cellRange.text + ")";
				} else {
					// Меняем значение ячейки
				functionName = "=" + functionName + "()";
				}

				// Вычисляем позицию курсора (он должен быть в функции)
				var cursorPos = functionName.length - 1;

				// Проверка глобального лока
				if (this.collaborativeEditing.getGlobalLock())
					return false;

				var arn = ws.activeRange.clone(true);

				var openEditor = function (res) {
					if (res) {
						// Выставляем переменные, что мы редактируем
						t.controller.setCellEditMode(true);
						ws.setCellEditMode(true);

						// Открываем, с выставлением позиции курсора
						if (!ws.openCellEditorWithText(t.cellEditor, functionName, cursorPos, /*isFocus*/false,
							/*activeRange*/arn)) {
							t.controller.setCellEditMode(false);
							t.controller.setStrictClose(false);
							t.controller.setFormulaEditMode(false);
							ws.setCellEditMode(false);
							ws.setFormulaEditMode(false);
						}
					} else {
						t.controller.setCellEditMode(false);
						t.controller.setStrictClose(false);
						t.controller.setFormulaEditMode(false);
						ws.setCellEditMode(false);
						ws.setFormulaEditMode(false);
					}
				};

				var activeCellRange = ws.getActiveCell(0, 0, /*isCoord*/false);

				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					openEditor(true);
				} else {
					ws._isLockedCells(activeCellRange, /*subType*/null, openEditor);
				}
			}
		};

		WorkbookView.prototype.copyToClipboard = function () {
			var t = this, ws, v;
			if (!t.controller.isCellEditMode) {
				ws = t.getWorksheet();
				t.clipboard.copyRange(ws.getSelectedRange(), ws);
			} else {
				v = t.cellEditor.copySelection();
				if (v) {t.clipboard.copyCellValue(v);}
			}
		};

		WorkbookView.prototype.copyToClipboardButton = function () {
			var t = this, ws, v;
			if (!t.controller.isCellEditMode) {
				ws = t.getWorksheet();
				return t.clipboard.copyRangeButton(ws.getSelectedRange(), ws);
			} else {
				v = t.cellEditor.copySelection();
				if (v) {return t.clipboard.copyCellValueButton(v);}
				else {return true;}
			}
		};

		WorkbookView.prototype.pasteFromClipboard = function () {
			var t = this;
			if (!t.controller.isCellEditMode) {
				var ws = t.getWorksheet();
				t.clipboard.pasteRange(ws);
			} else {
				// t.clipboard.pasteCellValue(function (text, fonts) {
					// if (fonts.length > 0) {
						// t.handlers.trigger("loadFonts", fonts, function(){t.cellEditor.paste(fragments)});
					// } else {
						// t.cellEditor.pasteText(text);
					// }
				// });
				t.clipboard.pasteAsText(function (text) {
					t.cellEditor.pasteText(text);
				});
			}
		};

		WorkbookView.prototype.pasteFromClipboardButton = function () {
			var t = this;
			if (!t.controller.isCellEditMode) {
				var ws = t.getWorksheet();
				return t.clipboard.pasteRangeButton(ws);
			} else {
				return t.clipboard.pasteAsTextButton(function (text) {
					t.cellEditor.pasteText(text);
				});
			}
		};

		WorkbookView.prototype.cutToClipboard = function () {
			var t = this, ws, v;
			if (!t.controller.isCellEditMode && !window.USER_AGENT_SAFARI_MACOS) {
				ws = t.getWorksheet();

				// Запрещаем копирование диаграмм в iframe
				if ( t.Api.isChartEditor && ws.objectRender.selectedGraphicObjectsExists() )
					return;

				t.clipboard.copyRange(ws.getSelectedRange(), ws, true);
				ws.emptySelection(c_oAscCleanOptions.All);
			} else if(!window.USER_AGENT_SAFARI_MACOS){
				v = t.cellEditor.cutSelection();
				if (v) {t.clipboard.copyCellValue(v);}
			}
		};

		WorkbookView.prototype.cutToClipboardButton = function () {
			var t = this, ws, v;
			if (!t.controller.isCellEditMode) {
				ws = t.getWorksheet();
				var result = t.clipboard.copyRangeButton(ws.getSelectedRange(), ws, true);
				if(result)
					ws.emptySelection(c_oAscCleanOptions.All);
				return result;
			} else {
				v = t.cellEditor.cutSelection();
				if (v) {return t.clipboard.copyCellValueButton(v);}
				else {return true;}
			}
		};

		WorkbookView.prototype.undo = function () {
			if (!this.controller.isCellEditMode) {
				History.Undo();
			} else {
				this.cellEditor.undo();
			}
		};

		WorkbookView.prototype.redo = function () {
			if (!this.controller.isCellEditMode) {
				History.Redo();
			} else {
				this.cellEditor.redo();
			}
		};

		WorkbookView.prototype.setFontAttributes = function (prop, val) {
			if (!this.controller.isCellEditMode) {
				this.getWorksheet().setSelectionInfo(prop, val);
			} else {
				this.cellEditor.setTextStyle(prop, val);
			}
		};

		WorkbookView.prototype.changeFontSize = function (prop, val) {
			if (!this.controller.isCellEditMode) {
				this.getWorksheet().setSelectionInfo(prop, val);
			} else {
				this.cellEditor.setTextStyle(prop, val);
			}
		};

		WorkbookView.prototype.emptyCells = function (options) {
			if (!this.controller.isCellEditMode) {
				this.getWorksheet().emptySelection(options);
				this.restoreFocus();
			} else {
				this.cellEditor.empty(options);
			}
		};

		WorkbookView.prototype.setSelectionDialogMode = function (isSelectionDialogMode, selectRange) {
			this.getWorksheet().setSelectionDialogMode(isSelectionDialogMode, selectRange);
		};

		// Поиск текста в листе
		WorkbookView.prototype.findCellText = function (options) {
			var ws = this.getWorksheet();
			// Останавливаем ввод данных в редакторе ввода
			if (ws.getCellEditMode())
				this._onStopCellEditing();
			return ws.findCellText(options);
		};

		// Замена текста в листе
		WorkbookView.prototype.replaceCellText = function (options) {
			var ws = this.getWorksheet();
			// Останавливаем ввод данных в редакторе ввода
			if (ws.getCellEditMode())
				this._onStopCellEditing();
			ws.replaceCellText(options);
		};

		// Поиск ячейки по ссылке
		WorkbookView.prototype.findCell = function (reference) {
			var ws = this.getWorksheet();
			// Останавливаем ввод данных в редакторе ввода
			if (ws.getCellEditMode())
				this._onStopCellEditing();
			return ws.findCell(reference);
		};

		// Печать
		WorkbookView.prototype.printSheet = function (pdf_writer, printPagesData) {
			var ws;
			// Закончили печать или нет
			var isEndPrint = false;
			if (null === printPagesData.arrPages || 0 === printPagesData.arrPages.length) {
				// Печать пустой страницы
				ws = this.getWorksheet();
				ws.drawForPrint(pdf_writer, null);
				isEndPrint = true;
			} else {
				var currentIndex = printPagesData.currentIndex;
				var indexWorksheet = -1;
				var indexWorksheetTmp = -1;
				for (var i = currentIndex; i < printPagesData.arrPages.length && i < currentIndex + printPagesData.c_maxPagesCount; ++i) {
					indexWorksheetTmp = printPagesData.arrPages[i].indexWorksheet;
					if (indexWorksheetTmp !== indexWorksheet) {
						ws = this.getWorksheet(indexWorksheetTmp);
						indexWorksheet = indexWorksheetTmp;
					}
					ws.drawForPrint(pdf_writer, printPagesData.arrPages[i]);
				}
				isEndPrint = (i === printPagesData.arrPages.length);
				printPagesData.currentIndex = i;
			}

			return isEndPrint;
		};

		WorkbookView.prototype.calcPagesPrint = function (adjustPrint) {
			var ws = null;
			var wb = this.model;
			var activeWs;
			var printPagesData = new asc_CPrintPagesData();
			var printType = adjustPrint.asc_getPrintType();
			var layoutPageType = adjustPrint.asc_getLayoutPageType();
			if (printType == c_oAscPrintType.ActiveSheets) {
				activeWs = wb.getActive();
				ws = this.getWorksheet();
				printPagesData.arrPages = ws.calcPagesPrint (wb.getWorksheet(activeWs).PagePrintOptions, /*printOnlySelection*/false, /*indexWorksheet*/activeWs, layoutPageType);
			} else if (printType == c_oAscPrintType.EntireWorkbook) {
				// Колличество листов
				var countWorksheets = this.model.getWorksheetCount();
				for (var i = 0; i < countWorksheets; ++i) {
					ws = this.getWorksheet(i);
					var arrPages = ws.calcPagesPrint (wb.getWorksheet(i).PagePrintOptions, /*printOnlySelection*/false, /*indexWorksheet*/i, layoutPageType);
					if (null !== arrPages) {
						if (null === printPagesData.arrPages)
							printPagesData.arrPages = [];
						printPagesData.arrPages = printPagesData.arrPages.concat(arrPages);
					}
				}
			} else if (printType == c_oAscPrintType.Selection) {
				activeWs = wb.getActive();
				ws = this.getWorksheet();
				printPagesData.arrPages = ws.calcPagesPrint (wb.getWorksheet(activeWs).PagePrintOptions, /*printOnlySelection*/true, /*indexWorksheet*/activeWs, layoutPageType);
			}

			return printPagesData;
		};

//		не используется
//		WorkbookView.prototype.setCellValue = function (v, pos, len) {
//			if (!this.controller.isCellEditMode) {
//				this.getWorksheet().setSelectionInfo("value", v, /*onlyActive*/true);
//			} else {
//				this.cellEditor.replaceText(pos, len, v);
//			}
//		};

		WorkbookView.prototype._initCommentsToSave  = function () {
			for (var wsKey in this.wsViews)
			{
				var wsView = this.wsViews[wsKey];
				var wsModel = wsView.model;
				wsView.cellCommentator.prepareCommentsToSave();
				wsModel.aComments = wsView.cellCommentator.aComments;
				wsModel.aCommentsCoords = wsView.cellCommentator.aCommentCoords;
			}
		};

		WorkbookView.prototype.reInit = function () {
			var ws = this.getWorksheet();
			ws._initCellsArea(/*fullRecalc*/true);
			ws._updateVisibleColsCount();
			ws._updateVisibleRowsCount();
		};
		WorkbookView.prototype.drawWS = function (){
			this._lockDraw = false;
			this.getWorksheet().draw(this._lockDraw);
		};
		WorkbookView.prototype.onShowDrawingObjects = function (clearCanvas) {
			var ws = this.getWorksheet();
			ws.objectRender.showDrawingObjects(clearCanvas);
		};

		WorkbookView.prototype.lockDraw = function (){
			this._lockDraw = true;
		};

		WorkbookView.prototype.insertHyperlink = function (options) {
			var ws = this.getWorksheet();
			if ( ws.objectRender.selectedGraphicObjectsExists() ) {
				if ( ws.objectRender.controller.canAddHyperlink() )
					ws.objectRender.controller.insertHyperlink(options);
			} else {
				// На всякий случай проверка (вдруг кто собирается вызвать...)
				this.closeCellEditor();
				ws.setSelectionInfo("hyperlink", options);
				this.restoreFocus();
			}
		};
		WorkbookView.prototype.removeHyperlink = function () {
			var ws = this.getWorksheet();
			if (ws.objectRender.selectedGraphicObjectsExists())
				ws.objectRender.controller.removeHyperlink();
			else {
				ws.setSelectionInfo("rh");
			}
		};

		/*
		 * @param {c_oAscRenderingModeType} mode Режим отрисовки
		 * @param {Boolean} isInit инициализация или нет
		 */
		WorkbookView.prototype.setFontRenderingMode = function (mode, isInit) {
			var ws;
			if (mode !== this.fontRenderingMode) {
				this.fontRenderingMode = mode;
				if (c_oAscFontRenderingModeType.noHinting === mode)
					this._setHintsProps(false, false);
				else if (c_oAscFontRenderingModeType.hinting === mode)
					this._setHintsProps(true, false);
				else if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode)
					this._setHintsProps(true, true);

				if (!isInit) {
					ws = this.getWorksheet();
					ws.draw();
					this.cellEditor.setFontRenderingMode(mode);
				}
			}
		};

		WorkbookView.prototype._setHintsProps = function (bIsHinting, bIsSubpixHinting) {
			var index, manager, hintProps;
			for (index in this.fmgrGraphics) {
				if (!this.fmgrGraphics.hasOwnProperty(index))
					continue;

				manager = this.fmgrGraphics[index];
				hintProps = manager.m_oLibrary.tt_hint_props;
				if (!hintProps)
					continue;

				if (bIsHinting && bIsSubpixHinting) {
					hintProps.TT_USE_BYTECODE_INTERPRETER = true;
					hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = true;

					manager.LOAD_MODE = 40968;
				} else if (bIsHinting) {
					hintProps.TT_USE_BYTECODE_INTERPRETER = true;
					hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;

					manager.LOAD_MODE = 40968;
				} else {
					hintProps.TT_USE_BYTECODE_INTERPRETER = true;
					hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;

					manager.LOAD_MODE = 40970;
				}

				manager.ClearFontsRasterCache();
			}
		};

		WorkbookView.prototype._calcMaxDigitWidth = function () {
			// set default worksheet header font for calculations
			this.buffers.main.setFont(this.defaultFont);
			// Измеряем в pt
			this.stringRender.measureString(
				"0123456789", {wrapText: false, shrinkToFit: false, isMerged: false, textAlign: /*khaLeft*/"left"});

			var ppiX = 96; // Мерить только с 96
			var ptConvToPx = asc_getcvt(1/*pt*/, 0/*px*/, ppiX);

			// Максимальная ширина в Pt
			var maxWidthInPt = this.stringRender.getWidestCharWidth();
			// Переводим в px и приводим к целому (int)
			this.maxDigitWidth = asc_round(maxWidthInPt * ptConvToPx);
			// Проверка для Calibri 11 должно быть this.maxDigitWidth = 7

			if (!this.maxDigitWidth) {throw "Error: can't measure text string";}
		};


		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].WorkbookView = WorkbookView;


	}
)(jQuery, window);
