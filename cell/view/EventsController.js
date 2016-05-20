"use strict";

(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		var AscBrowser = AscCommon.AscBrowser;

		var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
		var asc_applyFunction = AscCommonExcel.applyFunction;
		var c_oTargetType = AscCommonExcel.c_oTargetType;

		/**
		 * Desktop event controller for WorkbookView
		 * -----------------------------------------------------------------------------
		 * @constructor
		 * @memberOf Asc
		 */
		function asc_CEventsController() {
			if ( !(this instanceof asc_CEventsController) ) {
				return new asc_CEventsController();
			}

			//----- declaration -----
			this.defaults = {
				vscrollStep: 10,
				hscrollStep: 10,
				scrollTimeout: 20,
				showArrows: true,//показывать или нет стрелки у скролла
				//scrollBackgroundColor:"#DDDDDD",//цвет фона скролла
				//scrollerColor:"#EDEDED",//цвет ползунка скрола
				isViewerMode: false,
				wheelScrollLines: 3,
                isNeedInvertOnActive: false
			};

			this.view     = undefined;
			this.widget   = undefined;
			this.element  = undefined;
			this.handlers = undefined;
			this.settings = $.extend(true, {}, this.defaults);
			this.vsb	= undefined;
			this.vsbHSt	= undefined;
			this.vsbApi	= undefined;
			this.hsb	= undefined;
			this.hsbHSt	= undefined;
			this.hsbApi = undefined;
			this.resizeTimerId = undefined;
			this.scrollTimerId = undefined;
			this.moveRangeTimerId = undefined;
			this.moveResizeRangeTimerId = undefined;
			this.fillHandleModeTimerId = undefined;
			this.enableKeyEvents = true;
			this.isSelectMode = false;
			this.hasCursor = false;
			this.hasFocus = false;
			this.isCellEditMode = undefined;
			this.skipKeyPress = undefined;
			this.strictClose = false;
			this.lastKeyCode = undefined;
			this.targetInfo = undefined;
			this.isResizeMode = false;
			this.isResizeModeMove = false;
						
			// Режим автозаполнения
			this.isFillHandleMode = false;
			this.isMoveRangeMode = false;
			this.isMoveResizeRange = false;
			// Режим select-а для диалогов
			this.isSelectionDialogMode = false;
			// Режим формулы
			this.isFormulaEditMode = false;
			// Режим установки закреплённых областей
			this.frozenAnchorMode = false;
			
			// Обработчик кликов для граф.объектов
			this.clickCounter = new AscFormat.ClickCounter();
			this.isMousePressed = false;
			this.isShapeAction = false;
            this.isUpOnCanvas = false;

			// Был ли DblClick обработан в onMouseDown эвенте
			this.isDblClickInMouseDown = false;
			// Нужно ли обрабатывать эвент браузера dblClick
			this.isDoBrowserDblClick = false;
			// Последние координаты, при MouseDown (для IE)
			this.mouseDownLastCord = null;
			//-----------------------

            this.vsbApiLockMouse = false;
            this.hsbApiLockMouse = false;

			this.__handlers = null; // ToDo избавиться от этой переменной!


            return this;
		}

		/**
		 * @param {AscCommonExcel.WorkbookView} view
		 * @param {Element} widgetElem
		 * @param {Element} canvasElem
		 * @param {Object} handlers  Event handlers (resize, reinitializeScroll, scrollY, scrollX, changeSelection, ...)
		 */
		asc_CEventsController.prototype.init = function (view, widgetElem, canvasElem, handlers) {
			var self = this;

			this.view     = view;
			this.widget   = widgetElem;
			this.element  = canvasElem;
			this.handlers = new AscCommonExcel.asc_CHandlersList(handlers);
            this._createScrollBars();
            if( this.view.Api.isMobileVersion ){
                var __hasTouch = 'ontouchstart' in window;
                if (__hasTouch) {
                    this.widget.addEventListener("touchstart"	, function (e) {self._onTouchStart(e); return false;}			, false);
                    this.widget.addEventListener("touchmove"	, function (e) {self._onTouchMove(e); return false;}			, false);
                    this.widget.addEventListener("touchend"		, function (e) {self._onTouchEnd(e); return false;}	, false);
                } else {
                    this.widget.addEventListener("touchstart"	, function (e) {self._onMouseDown(e.touches[0]); return false;}			, false);
                    this.widget.addEventListener("touchmove"	, function (e) {self._onMouseMove(e.touches[0]); return false;}			, false);
                    this.widget.addEventListener("touchend"		, function (e) {self._onMouseUp(e.changedTouches[0]); return false;}	, false);
                }
                /*раньше события на ресайз вызывался из меню через контроллер. теперь контроллер в меню не доступен, для ресайза подписываемся на глобальный ресайз от window.*/
                window.addEventListener("resize", function () {self._onWindowResize.apply(self, arguments);}, false);
                return this;
            }

			// initialize events
			if (window.addEventListener) {
				window.addEventListener("resize"	, function () {self._onWindowResize.apply(self, arguments);}				, false);
				window.addEventListener("keydown"	, function () {return self._onWindowKeyDown.apply(self, arguments);}		, false);
				window.addEventListener("keypress"	, function () {return self._onWindowKeyPress.apply(self, arguments);}		, false);
				window.addEventListener("keyup"		, function () {return self._onWindowKeyUp.apply(self, arguments);}			, false);
				window.addEventListener("mousemove"	, function () {return self._onWindowMouseMove.apply(self, arguments);}		, false);
				window.addEventListener("mouseup"	, function () {return self._onWindowMouseUp.apply(self, arguments);}		, false);
				window.addEventListener("mouseleave", function () {return self._onWindowMouseLeaveOut.apply(self, arguments);}	, false);
				window.addEventListener("mouseout"	, function () {return self._onWindowMouseLeaveOut.apply(self, arguments);}	, false);
			}

			// prevent changing mouse cursor when 'mousedown' is occurred
			if (this.element.onselectstart) {
				this.element.onselectstart = function () {return false;};
			}

			if (this.element.addEventListener) {
				this.element.addEventListener("mousedown"	, function () {return self._onMouseDown.apply(self, arguments);}		, false);
				this.element.addEventListener("mouseup"		, function () {return self._onMouseUp.apply(self, arguments);}			, false);
				this.element.addEventListener("mousemove"	, function () {return self._onMouseMove.apply(self, arguments);}		, false);
				this.element.addEventListener("mouseleave"	, function () {return self._onMouseLeave.apply(self, arguments);}		, false);
				this.element.addEventListener("dblclick"	, function () {return self._onMouseDblClick.apply(self, arguments);}	, false);
			}
			if (this.widget.addEventListener) {
				// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
				// detect available wheel event
				var nameWheelEvent = "onwheel" in document.createElement("div") ? "wheel" :	// Modern browsers support "wheel"
						document.onmousewheel !== undefined ? "mousewheel" : 				// Webkit and IE support at least "mousewheel"
							"DOMMouseScroll";												// let's assume that remaining browsers are older Firefox

				this.widget.addEventListener(nameWheelEvent, function () {return self._onMouseWheel.apply(self, arguments);} , false);
			}

			// Курсор для графических объектов. Определяем mousedown и mouseup для выделения текста.
			var oShapeCursor = document.getElementById("id_target_cursor");
			if (null != oShapeCursor && oShapeCursor.addEventListener) {
				oShapeCursor.addEventListener("mousedown"	, function () {return self._onMouseDown.apply(self, arguments);}, false);
				oShapeCursor.addEventListener("mouseup"		, function () {return self._onMouseUp.apply(self, arguments);}, false);
				oShapeCursor.addEventListener("mousemove"	, function () {return self._onMouseMove.apply(self, arguments);}, false);
                oShapeCursor.addEventListener("mouseleave"	, function () {return self._onMouseLeave.apply(self, arguments);}, false);
			}

    		return this;
		};

		asc_CEventsController.prototype.destroy = function () {
			return this;
		};

		/** @param flag {Boolean} */
		asc_CEventsController.prototype.enableKeyEventsHandler = function (flag) {
			this.enableKeyEvents = !!flag;
		};

		/** @param flag {Boolean} */
		asc_CEventsController.prototype.setCellEditMode = function (flag) {
			this.isCellEditMode = !!flag;
		};

		/** @param isViewerMode {Boolean} */
		asc_CEventsController.prototype.setViewerMode = function (isViewerMode) {
			this.settings.isViewerMode = !!isViewerMode;
		};

		/** @return isViewerMode {Boolean} */
		asc_CEventsController.prototype.getViewerMode = function () {
			return this.settings.isViewerMode;
		};

		asc_CEventsController.prototype.setFocus = function (hasFocus) {
			this.hasFocus = !!hasFocus;
		};

		asc_CEventsController.prototype.setStrictClose = function (enabled) {
			this.strictClose = !!enabled;
		};

		/** @param isFormulaEditMode {Boolean} */
		asc_CEventsController.prototype.setFormulaEditMode = function (isFormulaEditMode) {
			this.isFormulaEditMode = !!isFormulaEditMode;
		};

		/** @param {Boolean} isSelectionDialogMode */
		asc_CEventsController.prototype.setSelectionDialogMode = function (isSelectionDialogMode) {
			this.isSelectionDialogMode = isSelectionDialogMode;
		};

		/**
		 * @param [whichSB] {Number}  Scroll bar to reinit (1=vertical, 2=horizontal)
		 * @param [endScroll] {Boolean}  Scroll in the end of document
		 * */
		asc_CEventsController.prototype.reinitializeScroll = function (whichSB, endScroll) {
		    if (window["NATIVE_EDITOR_ENJINE"])
		        return;

			var self = this,
			    opt = this.settings,
			    ws = self.view.getWorksheet(),
			    isVert = !whichSB || whichSB === 1,
			    isHoriz = !whichSB || whichSB === 2;

			if (isVert || isHoriz) {
				this.handlers.trigger("reinitializeScroll", whichSB, function (vSize, hSize) {
					if (isVert) {
						vSize = self.vsb.offsetHeight + Math.max( vSize * opt.vscrollStep, 1 );
//                        this.m_dScrollY_max = vSize;
    					self.vsbHSt.height = vSize + "px";
						self.vsbApi.endByY = !!endScroll;
						self.vsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleRow(/*allowPane*/true));
					}
					if (isHoriz) {
						hSize = self.hsb.offsetWidth + Math.max( hSize* opt.hscrollStep, 1 );
//                        this.m_dScrollX_max = hSize ;
						self.hsbApi.endByX = !!endScroll;
						self.hsbHSt.width = hSize + "px";
						self.hsbApi.Reinit(opt, opt.hscrollStep * ws.getFirstVisibleCol(/*allowPane*/true));
					}
				});
			}

			return this;
		};

		/**
		 * @param delta {{deltaX: number, deltaY: number}}
		 */
		asc_CEventsController.prototype.scroll = function (delta) {
			if (delta) {
				if (delta.deltaX) {this.scrollHorizontal(delta.deltaX);}
				if (delta.deltaY) {this.scrollVertical(delta.deltaY);}
			}
		};

		/**
		 * @param delta {Number}
		 * @param [event] {MouseEvent}
		 */
		asc_CEventsController.prototype.scrollVertical = function (delta, event) {
			if (window["NATIVE_EDITOR_ENJINE"])
				return;

			if (event && event.preventDefault)
				event.preventDefault();
			this.vsbApi.scrollByY(this.settings.vscrollStep * delta);
			return true;
		};

		/**
		 * @param delta {Number}
		 * @param [event] {MouseEvent}
		 */
		asc_CEventsController.prototype.scrollHorizontal = function (delta, event) {
			if (window["NATIVE_EDITOR_ENJINE"])
				return;

			if (event && event.preventDefault)
				event.preventDefault();
			this.hsbApi.scrollByX(this.settings.hscrollStep * delta);
			return true;
		};

		// Будем делать dblClick как в Excel
		asc_CEventsController.prototype.doMouseDblClick = function (event, isHideCursor) {
			var t = this;
			var ctrlKey = event.metaKey || event.ctrlKey;

			// Для формулы не нужно выходить из редактирования ячейки
			if (t.settings.isViewerMode || t.isFormulaEditMode || t.isSelectionDialogMode) {return true;}

			if(this.targetInfo && (this.targetInfo.target == c_oTargetType.MoveResizeRange ||
				this.targetInfo.target == c_oTargetType.MoveRange ||
				this.targetInfo.target == c_oTargetType.FillHandle))
				return true;

			if (t.handlers.trigger("getCellEditMode")) {if (!t.handlers.trigger("stopCellEditing")) {return true;}}

			var coord = t._getCoordinates(event);
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if (graphicsInfo )
				return;

			setTimeout(function () {
				var coord = t._getCoordinates(event);
				t.handlers.trigger("mouseDblClick", coord.x, coord.y, isHideCursor, function () {
					// Мы изменяли размеры колонки/строки, не редактируем ячейку. Обновим состояние курсора
					t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey,
						function (info) {t.targetInfo = info;});
				});
			}, 100);

			return true;
		};

		// Будем показывать курсор у редактора ячейки (только для dblClick)
		asc_CEventsController.prototype.showCellEditorCursor = function () {
			if (this.handlers.trigger("getCellEditMode")) {
				if (this.isDoBrowserDblClick) {
					this.isDoBrowserDblClick = false;
					this.handlers.trigger("showCellEditorCursor");
				}
			}
		};

		asc_CEventsController.prototype._createScrollBars = function () {
			var self = this, opt = this.settings;

			// vertical scroll bar
			this.vsb = document.createElement('div');
			this.vsb.id = "ws-v-scrollbar";
			this.vsb.innerHTML = '<div id="ws-v-scroll-helper"></div>';
			this.widget.appendChild(this.vsb);
			this.vsbHSt = document.getElementById("ws-v-scroll-helper").style;

			if (!this.vsbApi) {
				this.vsbApi = new AscCommon.ScrollObject(this.vsb.id, opt);
				this.vsbApi.bind("scrollvertical", function(evt) {
					self.handlers.trigger("scrollY", evt.scrollPositionY / opt.vscrollStep);
				});
				this.vsbApi.bind("scrollVEnd", function(evt) {
					self.handlers.trigger("addRow");
				});
				this.vsbApi.onLockMouse = function(evt){
                    self.vsbApiLockMouse = true;
				};
				this.vsbApi.offLockMouse = function(){
                    self.vsbApiLockMouse = false;
				};
			}

			// horizontal scroll bar
			this.hsb = document.createElement('div');
			this.hsb.id = "ws-h-scrollbar";
			this.hsb.innerHTML = '<div id="ws-h-scroll-helper"></div>';
			this.widget.appendChild(this.hsb);
			this.hsbHSt = document.getElementById("ws-h-scroll-helper").style;

			if (!this.hsbApi) {
				this.hsbApi = new AscCommon.ScrollObject(this.hsb.id, $.extend(true, {}, opt, {wheelScrollLines: 1}));
				this.hsbApi.bind("scrollhorizontal",function(evt) {
					self.handlers.trigger("scrollX", evt.scrollPositionX / opt.hscrollStep);
				});
				this.hsbApi.bind("scrollHEnd",function(evt) {
						self.handlers.trigger("addColumn");
					});
				this.hsbApi.onLockMouse = function(){
                    self.hsbApiLockMouse = true;
				};
				this.hsbApi.offLockMouse = function(){
                    self.hsbApiLockMouse = false;
				};
			}

            if(!this.view.Api.isMobileVersion){
                // right bottom corner
                var corner = document.createElement('div');
                corner.id = "ws-scrollbar-corner";
                this.widget.appendChild(corner);
            }
            else{
                this.hsb.style.zIndex = -10;
                this.hsb.style.right = 0;
                this.hsb.style.display = "none";
                this.vsb.style.zIndex = -10;
                this.vsb.style.bottom = 0;
                this.vsb.style.display = "none";
            }


		};

		/**
		 * @param event {MouseEvent}
		 * @param isSelectMode {Boolean}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._changeSelection = function (event, isSelectMode, callback) {
			var t = this;
			var coord = this._getCoordinates(event);

			if (t.isFormulaEditMode) {
				// для определения рэнджа под курсором и активизации его для WorksheetView
				if (false === t.handlers.trigger("canEnterCellRange")) {
					if (!t.handlers.trigger("stopCellEditing")) {return;}
				}
			}

			this.handlers.trigger("changeSelection", /*isStartPoint*/false, coord.x, coord.y,
				/*isCoord*/true, /*isSelectMode*/isSelectMode,
				function (d) {
					t.scroll(d);

					if (t.isFormulaEditMode)
						t.handlers.trigger("enterCellRange");
					else if (t.handlers.trigger("getCellEditMode"))
						if (!t.handlers.trigger("stopCellEditing")) {return;}

					asc_applyFunction(callback);
				});
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeSelection2 = function (event) {
			var t = this;

			var fn = function () { t._changeSelection2(event); };
			var callback = function () {
				if (t.isSelectMode && !t.hasCursor) {
					t.scrollTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.scrollTimerId);
			t.scrollTimerId = window.setTimeout(function () {
				if (t.isSelectMode && !t.hasCursor) {
					t._changeSelection(event, /*isSelectMode*/true, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveRangeHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._moveRangeHandle2(event);
			};

			var callback = function () {
				if (t.isMoveRangeMode && !t.hasCursor) {
					t.moveRangeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.moveRangeTimerId);
			t.moveRangeTimerId = window.setTimeout(function () {
				if (t.isMoveRangeMode && !t.hasCursor) {
					t._moveRangeHandle(event, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveResizeRangeHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._moveResizeRangeHandle2(event);
			};

			var callback = function () {
				if (t.isMoveResizeRange && !t.hasCursor) {
					t.moveResizeRangeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.moveResizeRangeTimerId);
			t.moveResizeRangeTimerId = window.setTimeout(function () {
				if (t.isMoveResizeRange && !t.hasCursor) {
					t._moveResizeRangeHandle(event, t.targetInfo, callback);
				}
			}, 0);
		};

		/**
		 * Окончание выделения
		 * @param event {MouseEvent}
		 */
		asc_CEventsController.prototype._changeSelectionDone = function (event) {
			var coord = this._getCoordinates(event);
			var ctrlKey = event.metaKey || event.ctrlKey;
			if (false === ctrlKey) {
				coord.x = -1;
				coord.y = -1;
			}
			this.handlers.trigger("changeSelectionDone", coord.x, coord.y);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._resizeElement = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElement", this.targetInfo, coord.x, coord.y);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._resizeElementDone = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElementDone", this.targetInfo, coord.x, coord.y, this.isResizeModeMove);
			this.isResizeModeMove = false;
		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._changeFillHandle = function (event, callback) {
			var t = this;
			// Обновляемся в режиме автозаполнения
			var coord = this._getCoordinates(event);
			this.handlers.trigger("changeFillHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				});
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeFillHandle2 = function (event) {
			var t = this;

			var fn = function () {
				t._changeFillHandle2(event);
			};

			var callback = function () {
				if (t.isFillHandleMode && !t.hasCursor) {
					t.fillHandleModeTimerId  = window.setTimeout(fn, t.settings.scrollTimeout);
				}
			};

			window.clearTimeout(t.fillHandleModeTimerId);
			t.fillHandleModeTimerId = window.setTimeout(function () {
				if (t.isFillHandleMode && !t.hasCursor) {
					t._changeFillHandle(event, callback);
				}
			}, 0);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._changeFillHandleDone = function (event) {
			// Закончили автозаполнение, пересчитаем
			var coord = this._getCoordinates(event);
			this.handlers.trigger("changeFillHandleDone", coord.x, coord.y, event.metaKey || event.ctrlKey);
		};

		/**
		 * @param event {MouseEvent}
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._moveRangeHandle = function (event, callback) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveRangeHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				}, event.metaKey || event.ctrlKey);
		};

		/**
		 * @param event {MouseEvent}
		 * @param target
		 */
		asc_CEventsController.prototype._moveFrozenAnchorHandle = function (event, target) {
			var t = this;
			var coord = t._getCoordinates(event);
			t.handlers.trigger("moveFrozenAnchorHandle", coord.x, coord.y, target);
		};
		
		/**
		 * @param event {MouseEvent}
		 * @param target
		 */
		asc_CEventsController.prototype._moveFrozenAnchorHandleDone = function (event, target) {
			// Закрепляем область
			var t = this;
			var coord = t._getCoordinates(event);
			t.handlers.trigger("moveFrozenAnchorHandleDone", coord.x, coord.y, target);
		};

		/**
		 * @param event {MouseEvent}
		 * @param target
		 * @param callback {Function}
		 */
		asc_CEventsController.prototype._moveResizeRangeHandle = function (event, target, callback) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveResizeRangeHandle", coord.x, coord.y, target,
				function (d) {
					if (!d) return;
					t.scroll(d);
					asc_applyFunction(callback);
				});
		};

		asc_CEventsController.prototype._autoFiltersClick = function (idFilter) {
			this.handlers.trigger("autoFiltersClick", idFilter);
		};

		asc_CEventsController.prototype._commentCellClick = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			this.handlers.trigger("commentCellClick", coord.x, coord.y);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._moveRangeHandleDone = function (event) {
			// Закончили перемещение диапазона, пересчитаем
			this.handlers.trigger("moveRangeHandleDone", event.metaKey || event.ctrlKey);
		};

		asc_CEventsController.prototype._moveResizeRangeHandleDone = function (event, target) {
			// Закончили перемещение диапазона, пересчитаем
			this.handlers.trigger("moveResizeRangeHandleDone", target);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowResize = function (event) {
			var self = this;
			window.clearTimeout(this.resizeTimerId);
			this.resizeTimerId = window.setTimeout(function () {self.handlers.trigger("resize", event);}, 150);
		};

		/** @param event {KeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyDown = function (event) {
			var t = this, dc = 0, dr = 0, isViewerMode = t.settings.isViewerMode;
			var ctrlKey = event.metaKey || event.ctrlKey;
			var shiftKey = event.shiftKey;

			var result = true;

			function stop(immediate) {
				event.stopPropagation();
				immediate ? event.stopImmediatePropagation() : true;
				event.preventDefault();
				result = false;
			}

			// для исправления Bug 15902 - Alt забирает фокус из приложения
			// этот код должен выполняться самым первым
			if (event.which === 18) {
				t.lastKeyCode = event.which;
			}

			var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
			if (!t.isMousePressed && graphicObjects.length && t.enableKeyEvents) {
				if (t.handlers.trigger("graphicObjectWindowKeyDown", event))
					return result;
			}

			// Двигаемся ли мы в выделенной области
			var selectionActivePointChanged = false;

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			while (t.handlers.trigger("getCellEditMode") && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode || t.isFillHandleMode || t.isMoveRangeMode || t.isMoveResizeRange) {

				if (t.handlers.trigger("getCellEditMode") && !t.strictClose && t.enableKeyEvents && event.which >= 37 && event.which <= 40) {
					// обрабатываем нажатие клавиш со стрелками, если редактор открыт не по F2 и включены эвенты
					break;
				}

				// Почему-то очень хочется обрабатывать лишние условия в нашем коде, вместо обработки наверху...
				if (!t.enableKeyEvents && ctrlKey && (80 === event.which/* || 83 === event.which*/)) {
					// Только если отключены эвенты и нажаты Ctrl+S или Ctrl+P мы их обработаем
					break;
				}

				return result;
			}

			t.skipKeyPress = true;

			switch (event.which) {

				case 113: // F2
					if (isViewerMode || t.handlers.trigger("getCellEditMode") || t.isSelectionDialogMode || graphicObjects.length) {return true;}
					if (AscBrowser.isOpera) {stop();}
					// Выставляем блокировку на выход из редактора по клавишам-стрелкам
					t.strictClose = true;
					// При F2 выставляем фокус в редакторе
					t.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/true, /*isClearCell*/false,
						/*isHideCursor*/undefined, /*isQuickInput*/false);
					return result;

				case 8: // backspace
					if (isViewerMode || t.handlers.trigger("getCellEditMode") || t.isSelectionDialogMode) {return true;}
					stop();

					// При backspace фокус не в редакторе (стираем содержимое)
					t.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/false, /*isClearCell*/true,
						/*isHideCursor*/undefined, /*isQuickInput*/false, /*callback*/undefined, event);
					return true;

				case 46: // Del
					if (isViewerMode || t.handlers.trigger("getCellEditMode") || t.isSelectionDialogMode) {return true;}
					// Удаляем содержимое
					t.handlers.trigger("empty");
					return result;

				case 9: // tab
					if (t.handlers.trigger("getCellEditMode")) {return true;}
					// Отключим стандартную обработку браузера нажатия tab
					stop();

					// Особый случай (возможно движение в выделенной области)
					selectionActivePointChanged = true;
					if (shiftKey){
						dc = -1;			// (shift + tab) - движение по ячейкам влево на 1 столбец
						shiftKey = false;	// Сбросим shift, потому что мы не выделяем
					} else {
						dc = +1;			// (tab) - движение по ячейкам вправо на 1 столбец
					}
					break;

				case 13:  // "enter"
					if (t.handlers.trigger("getCellEditMode")) {return true;}
					// Особый случай (возможно движение в выделенной области)
					selectionActivePointChanged = true;
					if (shiftKey) {
						dr = -1;			// (shift + enter) - движение по ячейкам наверх на 1 строку
						shiftKey = false;	// Сбросим shift, потому что мы не выделяем
					} else {
						dr = +1;			// (enter) - движение по ячейкам вниз на 1 строку
					}
					break;

				case 27: // Esc
					// (https://bugzilla.mozilla.org/show_bug.cgi?id=614304) - баг в Mozilla: Esc abort XMLHttpRequest and WebSocket
					// http://bugzserver/show_bug.cgi?id=14631 - наш баг на редактор
					// Перехватим Esc и отключим дефалтовую обработку
					stop();
					t.handlers.trigger("stopFormatPainter");
                    t.handlers.trigger("stopAddShape");
					return result;

				case 144: //Num Lock
				case 145: //Scroll Lock
					if (AscBrowser.isOpera) {stop();}
					return result;

				case 32: // Spacebar
					if (t.handlers.trigger("getCellEditMode")) {return true;}
					// Обработать как обычный текст
					if (!ctrlKey && !shiftKey) {
						t.skipKeyPress = false;
						return true;
					}
					// Отключим стандартную обработку браузера нажатия
					// Ctrl+Shift+Spacebar, Ctrl+Spacebar, Shift+Spacebar
					stop();
					// Обработать как спец селект
					if (ctrlKey && shiftKey) {
						t.handlers.trigger("changeSelection", /*isStartPoint*/true, 0,
							0, /*isCoord*/true, /*isSelectMode*/false);
					} else if (ctrlKey) {
						t.handlers.trigger("selectColumnsByRange");
					} else {
						t.handlers.trigger("selectRowsByRange");
					}
					return result;

				case 33: // PageUp
					// Отключим стандартную обработку браузера нажатия PageUp
					stop();
					if (ctrlKey) {
						// Перемещение по листам справа налево
						// В chrome не работает (т.к. там своя обработка на некоторые нажатия вместе с Ctrl
						t.handlers.trigger("showNextPrevWorksheet", -1);
						return true;
					} else {
						event.altKey ? dc = -0.5 : dr = -0.5;
					}
					break;

				case 34: // PageDown
					// Отключим стандартную обработку браузера нажатия PageDown
					stop();
					if (ctrlKey) {
						// Перемещение по листам слева направо
						// В chrome не работает (т.к. там своя обработка на некоторые нажатия вместе с Ctrl
						t.handlers.trigger("showNextPrevWorksheet", +1);
						return true;
					} else {
						event.altKey ? dc = +0.5 : dr = +0.5;
					}
					break;

				case 37: // left
					stop();                          // Отключим стандартную обработку браузера нажатия left
					dc = ctrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 38: // up
					stop();                          // Отключим стандартную обработку браузера нажатия up
					dr = ctrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 39: // right
					stop();                          // Отключим стандартную обработку браузера нажатия right
					dc = ctrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 40: // down
					stop();                          // Отключим стандартную обработку браузера нажатия down
					// Обработка Alt + down
					if (!isViewerMode && !t.handlers.trigger("getCellEditMode") && !t.isSelectionDialogMode && event.altKey) {
						t.handlers.trigger("showAutoComplete");
						return result;
					}
					dr = ctrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 36: // home
					stop();                          // Отключим стандартную обработку браузера нажатия home
					if( t.isFormulaEditMode ) break;
                    dc = -2.5;
					if (ctrlKey) {dr = -2.5;}
					break;

				case 35: // end
					stop();                          // Отключим стандартную обработку браузера нажатия end
                    if( t.isFormulaEditMode ) break;
                    dc = 2.5;
					if (ctrlKey) {
						dr = 2.5;
					}
					break;

				case 53: // make strikethrough	Ctrl + 5
				case 66: // make bold			Ctrl + b
				case 73: // make italic			Ctrl + i
				//case 83: // save				Ctrl + s
				case 85: // make underline		Ctrl + u
				case 86: // paste				Ctrl + v
				case 88: // cut					Ctrl + x
				case 89: // redo				Ctrl + y
				case 90: // undo				Ctrl + z
					if (isViewerMode || t.isSelectionDialogMode) {stop(); return result;}

				case 65: // select all      Ctrl + a
				case 67: // copy            Ctrl + c
					if (t.handlers.trigger("getCellEditMode")) { return true; }

				case 80: // print           Ctrl + p
					if (t.handlers.trigger("getCellEditMode")) { stop(); return result; }

					if (!ctrlKey) { t.skipKeyPress = false; return true; }

					if (67 !== event.which && 86 !== event.which && 88 !== event.which)
						stop();

					// Вызовем обработчик
					if (!t.__handlers) {
						t.__handlers = {
							53: function () {t.handlers.trigger("setFontAttributes", "s");},
							65: function () {t.handlers.trigger("changeSelection", /*isStartPoint*/true,
								-1, -1, /*isCoord*/true, /*isSelectMode*/false);},
							66: function () {t.handlers.trigger("setFontAttributes", "b");},
							73: function () {t.handlers.trigger("setFontAttributes", "i");},
							85: function () {t.handlers.trigger("setFontAttributes", "u");},
							80: function () {t.handlers.trigger("print");},
							//83: function () {t.handlers.trigger("save");},
							67: function () {t.handlers.trigger("copy");},
							86: function () {
								if (!window.GlobalPasteFlag)
								{
									if (!AscBrowser.isSafariMacOs)
									{
										window.GlobalPasteFlag = true;
										t.handlers.trigger("paste");
									}
									else
									{
										if (0 === window.GlobalPasteFlagCounter)
										{
											AscCommonExcel.SafariIntervalFocus2();
											window.GlobalPasteFlag = true;
											t.handlers.trigger("paste");
										}
									}
								}
								else
								{
									if (!AscBrowser.isSafariMacOs)
										stop();
								}
							},
							88: function () {t.handlers.trigger("cut");},
							89: function () {t.handlers.trigger("redo");},
							90: function () {t.handlers.trigger("undo");}
						};
					}
					t.__handlers[event.which]();
					return result;

				case 61:  // Firefox, Opera (+/=)
				case 187: // +/=
					if (isViewerMode || t.handlers.trigger("getCellEditMode") || t.isSelectionDialogMode) {return true;}

					if (event.altKey) {
						t.handlers.trigger('addFunction', 'SUM', Asc.c_oAscPopUpSelectorType.Func, true);
					} else {
						t.skipKeyPress = false;
					}
					return true;

				case 93:
					stop();
					this.handlers.trigger('onContextMenu', event);
					return result;

				default:
					// При зажатом Ctrl или Alt не вводим символ
					if (!ctrlKey && !event.altKey) {t.skipKeyPress = false;}
					return true;

			} // end of switch

			if ((dc !== 0 || dr !== 0) && false === t.handlers.trigger("isGlobalLockEditCell")) {

				// Проверка на движение в выделенной области
				if (selectionActivePointChanged) {
					t.handlers.trigger("selectionActivePointChanged", dc, dr, function (d) {t.scroll(d);});
				} else {
					if (this.handlers.trigger("getCellEditMode") && !this.isFormulaEditMode) {
						if (!t.handlers.trigger("stopCellEditing")) {return true;}
					}

					if (t.isFormulaEditMode) {
						// для определения рэнджа под курсором и активизации его для WorksheetView
						if (false === t.handlers.trigger("canEnterCellRange")) {
							if (!t.handlers.trigger("stopCellEditing")) {return true;}
						}
					}

					t.handlers.trigger("changeSelection", /*isStartPoint*/!shiftKey, dc, dr,
							/*isCoord*/false, /*isSelectMode*/false,
							function (d) {
								t.scroll(d);

								if (t.isFormulaEditMode) {
									t.handlers.trigger("enterCellRange");
								} else if (t.handlers.trigger("getCellEditMode")) {
									t.handlers.trigger("stopCellEditing");
								}
							});
				}
			}

			return result;
		};

		/** @param event {KeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyPress = function (event) {
			// Нельзя при отключенных эвентах возвращать false (это касается и ViewerMode)
			if (!this.enableKeyEvents) {return true;}

			// не вводим текст в режиме просмотра
			// если в FF возвращать false, то отменяется дальнейшая обработка серии keydown -> keypress -> keyup
			// и тогда у нас не будут обрабатываться ctrl+c и т.п. события
			if (this.settings.isViewerMode || this.isSelectionDialogMode) {return true;}

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			// Не можем вводить когда селектим или когда совершаем действия с объектом
			if (this.handlers.trigger("getCellEditMode") && !this.hasFocus || this.isSelectMode ||
				!this.handlers.trigger('canReceiveKeyPress'))
				return true;

			if (this.skipKeyPress || event.which < 32) {
				this.skipKeyPress = true;
				return true;
			}

			var graphicObjects = this.handlers.trigger("getSelectedGraphicObjects");
			if (graphicObjects.length && this.handlers.trigger("graphicObjectWindowKeyPress", event))
				return true;

			if (!this.handlers.trigger("getCellEditMode")) {
				// При нажатии символа, фокус не ставим
				// Очищаем содержимое ячейки
				this.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/false, /*isClearCell*/true,
					/*isHideCursor*/undefined, /*isQuickInput*/true, /*callback*/undefined, event);
			}
			return true;
		};

		/** @param event {KeyboardEvent} */
		asc_CEventsController.prototype._onWindowKeyUp = function (event) {
			var t = this;

			// для исправления Bug 15902 - Alt забирает фокус из приложения
			if (t.lastKeyCode === 18 && event.which === 18) {
				return false;
			}
			// При отпускании shift нужно переслать информацию о выделении
			if (16 === event.which) {
				this.handlers.trigger("updateSelectionName");
			}

			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseMove = function (event) {
			var coord = this._getCoordinates(event);
				
			if (this.isSelectMode && !this.hasCursor) {this._changeSelection2(event);}
			if (this.isResizeMode && !this.hasCursor) {
				this.isResizeModeMove = true;
				this._resizeElement(event);
			}
            if (this.hsbApiLockMouse)
                this.hsbApi.mouseDown ? this.hsbApi.evt_mousemove.call(this.hsbApi,event) : false;
            else if (this.vsbApiLockMouse)
                this.vsbApi.mouseDown ? this.vsbApi.evt_mousemove.call(this.vsbApi,event) : false;
				
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
				return true;
			}

			if (this.isShapeAction) {
				event.isLocked = this.isMousePressed;
				this.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
			}

			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseUp = function (event) {
			var coord = this._getCoordinates(event);
            if (this.hsbApiLockMouse)
                this.hsbApi.mouseDown ? this.hsbApi.evt_mouseup.call(this.hsbApi, event) : false;
            else if (this.vsbApiLockMouse)
                this.vsbApi.mouseDown ? this.vsbApi.evt_mouseup.call(this.vsbApi, event) : false;

			this.isMousePressed = false;
			// Shapes
			if (this.isShapeAction) {
                if(!this.isUpOnCanvas)
                {
                    event.isLocked = this.isMousePressed;
                    event.ClickCount = this.clickCounter.clickCount;
                    event.fromWindow = true;
                    this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
                    this._changeSelectionDone(event);
                }
                this.isUpOnCanvas = false;
				return true;
			}

			if (this.isSelectMode) {
				this.isSelectMode = false;
				this._changeSelectionDone(event);
			}

			if (this.isResizeMode) {
				this.isResizeMode = false;
				this._resizeElementDone(event);
			}

			// Режим автозаполнения
			if (this.isFillHandleMode) {
				// Закончили автозаполнение
				this.isFillHandleMode = false;
				this._changeFillHandleDone(event);
			}

			// Режим перемещения диапазона
			if (this.isMoveRangeMode) {
				// Закончили перемещение диапазона
				this.isMoveRangeMode = false;
				this._moveRangeHandleDone(event);
			}

			if (this.isMoveResizeRange) {
				this.isMoveResizeRange = false;
				this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
			}
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
				this.frozenAnchorMode = false;
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();


			return true;
		};

		/**
		 *
		 * @param event
		 * @param x
		 * @param y
		 */
		asc_CEventsController.prototype._onWindowMouseUpExternal = function (event, x, y) {
			// ToDo стоит переделать на нормальную схему, пока пропишем прямо в эвенте
			if (null != x && null != y)
				event.coord = {x: x, y: y};
			this._onWindowMouseUp(event);
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onWindowMouseLeaveOut = function (event) {
			// Когда обрабатывать нечего - выходим
			if (!this.isDoBrowserDblClick)
				return true;

			var relatedTarget = event.relatedTarget || event.fromElement;
			// Если мы двигаемся по редактору ячейки, то ничего не снимаем
			if (relatedTarget && ("ce-canvas-outer" === relatedTarget.id ||
				"ce-canvas" === relatedTarget.id || "ce-canvas-overlay" === relatedTarget.id ||
				"ce-cursor" === relatedTarget.id || "ws-canvas-overlay" === relatedTarget.id))
				return true;

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();
			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseDown = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			event.isLocked = t.isMousePressed = true;

			if (t.handlers.trigger("isGlobalLockEditCell"))
				return;

			if (!this.enableKeyEvents) {
				t.handlers.trigger("canvasClick");
			}

			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( asc["editor"].isStartAddShape || graphicsInfo ) {
				// При выборе диапазона не нужно выделять автофигуру
				if (t.isSelectionDialogMode)
					return;

				if (this.handlers.trigger("getCellEditMode") && !this.handlers.trigger("stopCellEditing"))
					return;

				t.isShapeAction = true;
                t.isUpOnCanvas = false;


				t.clickCounter.mouseDownEvent(coord.x, coord.y, event.button);
				event.ClickCount = t.clickCounter.clickCount;
				if (0 === event.ClickCount % 2)
					t.isDblClickInMouseDown = true;;
				
				t.handlers.trigger("graphicObjectMouseDown", event, coord.x, coord.y);
				t.handlers.trigger("updateSelectionShape", /*isSelectOnShape*/true);
				return;
			} else
				t.isShapeAction = false;

			if (2 === event.detail) {
				// Это означает, что это MouseDown для dblClick эвента (его обрабатывать не нужно)
				// Порядок эвентов для dblClick - http://javascript.ru/tutorial/events/mouse#dvoynoy-levyy-klik

				// Проверка для IE, т.к. он присылает DblClick при сдвиге мыши...
				if (this.mouseDownLastCord && coord.x === this.mouseDownLastCord.x && coord.y === this.mouseDownLastCord.y && 0 === event.button && !this.handlers.trigger('isFormatPainter')) {
					// Выставляем, что мы уже сделали dblClick (иначе вдруг браузер не поддерживает свойство detail)
					this.isDblClickInMouseDown = true;
					// Нам нужно обработать эвент браузера о dblClick (если мы редактируем ячейку, то покажем курсор, если нет - то просто ничего не произойдет)
					this.isDoBrowserDblClick = true;
					this.doMouseDblClick(event, /*isHideCursor*/false);
					// Обнуляем координаты
					this.mouseDownLastCord = null;
					return;
				}
			}
			// Для IE preventDefault делать не нужно
			if (!(AscBrowser.isIE || AscBrowser.isOpera)) {
				if (event.preventDefault)
					event.preventDefault();
				else
					event.returnValue = false;
			}

			if (!this.targetInfo)
				this.handlers.trigger("updateWorksheet", this.element, coord.x, coord.y, false, function (info){t.targetInfo = info;});

			// Запоминаем координаты нажатия
			this.mouseDownLastCord = coord;

			t.hasFocus = true;
			if (!t.handlers.trigger("getCellEditMode")) {
				if (event.shiftKey) {
					t.isSelectMode = true;
					t._changeSelection(event, /*isSelectMode*/true);
					return;
				}
				if (t.targetInfo){
					if (t.targetInfo.target === c_oTargetType.ColumnResize || t.targetInfo.target === c_oTargetType.RowResize) {
						t.isResizeMode = true;
						t._resizeElement(event);
						return;
					} else if (t.targetInfo && t.targetInfo.target === c_oTargetType.FillHandle && false === this.settings.isViewerMode) {
						// В режиме автозаполнения
						this.isFillHandleMode = true;
						t._changeFillHandle(event);
						return;
					} else if (t.targetInfo && t.targetInfo.target === c_oTargetType.MoveRange && false === this.settings.isViewerMode) {
						// В режиме перемещения диапазона
						this.isMoveRangeMode = true;
						t._moveRangeHandle(event);
						return;
					} else if (t.targetInfo && t.targetInfo.target === c_oTargetType.FilterObject && 0 === event.button) {
						  t._autoFiltersClick(t.targetInfo.idFilter);
						  return;
					} else if (t.targetInfo && undefined !== t.targetInfo.commentIndexes && false === this.settings.isViewerMode) {
						t._commentCellClick(event);
					} else if ( t.targetInfo && t.targetInfo.target === c_oTargetType.MoveResizeRange && false === this.settings.isViewerMode ){
						this.isMoveResizeRange = true;
						t._moveResizeRangeHandle(event, t.targetInfo);
						return;
					} else if (t.targetInfo && (t.targetInfo.target === c_oTargetType.FrozenAnchorV ||
						t.targetInfo.target === c_oTargetType.FrozenAnchorH) && false === this.settings.isViewerMode) {
						// Режим установки закреплённых областей
						this.frozenAnchorMode = t.targetInfo.target;
						t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
						return;
					}
				}
			} else {
				if (!t.isFormulaEditMode) {
					if (!t.handlers.trigger("stopCellEditing")) {return;}
				} else {
					if (event.shiftKey) {
						t.isSelectMode = true;
						t._changeSelection(event, /*isSelectMode*/true);
						return;
					} else {
						if (t.isFormulaEditMode) {
							// !!! в зависимости от цели делаем разные действия - либо селектим область либо мувим существующий диапазон
							if ( t.targetInfo && t.targetInfo.target === c_oTargetType.MoveResizeRange && false === this.settings.isViewerMode ){
								this.isMoveResizeRange = true;
								t._moveResizeRangeHandle(event, t.targetInfo);
								return;
							} else if (false === t.handlers.trigger("canEnterCellRange")) {
								// для определения рэнджа под курсором и активизации его для WorksheetView
								if (!t.handlers.trigger("stopCellEditing")) {return;}
							}
						}
						t.isSelectMode = true;
						t.handlers.trigger("changeSelection", /*isStartPoint*/true, coord.x, coord.y,
								/*isCoord*/true, /*isSelectMode*/true,
								function (d) {
									t.scroll(d);

									if (t.isFormulaEditMode) {
										t.handlers.trigger("enterCellRange");
									} else if (t.handlers.trigger("getCellEditMode")) {
										if (!t.handlers.trigger("stopCellEditing")) {return;}
									}
								});
						return;
					}
				}
			}

			// Если нажали правую кнопку мыши, то сменим выделение только если мы не в выделенной области
			if (2 === event.button) {
				t.handlers.trigger("changeSelectionRightClick", coord.x, coord.y);
			} else {
				if (t.targetInfo && t.targetInfo.target === c_oTargetType.FillHandle  && false === this.settings.isViewerMode){
					// В режиме автозаполнения
					t.isFillHandleMode = true;
					t._changeFillHandle(event);
				} else {
					t.isSelectMode = true;
					t.handlers.trigger("changeSelection", /*isStartPoint*/true, coord.x,
						coord.y, /*isCoord*/true, /*isSelectMode*/true);
				}
			}
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseUp = function (event) {
			if (2 === event.button) {
				this.handlers.trigger('onContextMenu', event);
				return true;
			}

			// Shapes
			var coord = this._getCoordinates(event);
			event.isLocked = this.isMousePressed = false;

			if (this.isShapeAction) {
				event.ClickCount = this.clickCounter.clickCount;
				this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
				this._changeSelectionDone(event);
                if (asc["editor"].isStartAddShape)
                {
                    event.preventDefault && event.preventDefault();
                    event.stopPropagation && event.stopPropagation();
                }
                else
                {
                    this.isUpOnCanvas = true;
                }

				return true;
			}

			if (this.isSelectMode) {
				this.isSelectMode = false;
				this._changeSelectionDone(event);
			}

			if (this.isResizeMode) {
				this.isResizeMode = false;
				this._resizeElementDone(event);
			}
			// Режим автозаполнения
			if (this.isFillHandleMode) {
				// Закончили автозаполнение
				this.isFillHandleMode = false;
				this._changeFillHandleDone(event);
			}
			// Режим перемещения диапазона
			if (this.isMoveRangeMode) {
				this.isMoveRangeMode = false;
				this._moveRangeHandleDone(event);
			}

			if (this.isMoveResizeRange) {
				this.isMoveResizeRange = false;
				this._moveResizeRangeHandleDone(event, this.targetInfo);
				return true;
			}
			// Режим установки закреплённых областей
			if (this.frozenAnchorMode) {
				this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
				this.frozenAnchorMode = false;
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseMove = function (event) {
			var t = this;
			var ctrlKey = event.metaKey || event.ctrlKey;
			var coord = t._getCoordinates(event);

			t.hasCursor = true;

			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( graphicsInfo )
				this.clickCounter.mouseMoveEvent(coord.x, coord.y);

			if (t.isSelectMode) {
				t._changeSelection(event, /*isSelectMode*/true);
				return true;
			}

			if (t.isResizeMode) {
				t._resizeElement(event);
				this.isResizeModeMove = true;
				return true;
			}

			// Режим автозаполнения
			if (t.isFillHandleMode) {
				t._changeFillHandle(event);
				return true;
			}

			// Режим перемещения диапазона
			if (t.isMoveRangeMode) {
				event.currentTarget.style.cursor = ctrlKey ? "copy" : "move";
				t._moveRangeHandle(event);
				return true;
			}

			if (t.isMoveResizeRange) {
				t._moveResizeRangeHandle(event, t.targetInfo);
				return true;
			}
			
			// Режим установки закреплённых областей
			if (t.frozenAnchorMode) {
				t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
				return true;
			}

			if (t.isShapeAction || graphicsInfo) {
				event.isLocked = t.isMousePressed;
				t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
				t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
				return true;
			}

			t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey, function(info){t.targetInfo = info;});
			return true;
		};

    	/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseLeave = function (event) {
			var t = this;
			this.hasCursor = false;
			if (!this.isSelectMode && !this.isResizeMode && !this.isMoveResizeRange) {
				this.targetInfo = undefined;
				this.handlers.trigger("updateWorksheet", this.element);
			}
			if (this.isMoveRangeMode) {
				t.moveRangeTimerId = window.setTimeout(function(){t._moveRangeHandle2(event)},0);
			}
			if (this.isMoveResizeRange) {
				t.moveResizeRangeTimerId = window.setTimeout(function(){t._moveResizeRangeHandle2(event)},0);
			}
			if (this.isFillHandleMode) {
				t.fillHandleModeTimerId = window.setTimeout(function(){t._changeFillHandle2(event)},0);
			}
			return true;
		};

		/** @param event {MouseEvent} */
		asc_CEventsController.prototype._onMouseWheel = function (event) {
			if (this.isFillHandleMode || this.isMoveRangeMode || this.isMoveResizeRange) {
				return true;
			}

			if (undefined !== window["AscDesktopEditor"])
            {
                if (false === window["AscDesktopEditor"]["CheckNeedWheel"]())
                    return true;
            }

			var delta = 0;
			if (undefined !== event.wheelDelta && 0 !== event.wheelDelta) {
				delta = -1 * event.wheelDelta / 40;
			} else if (undefined != event.detail && 0 !== event.detail) {
				// FF
				delta = event.detail;
			} else if (undefined != event.deltaY && 0 !== event.deltaY) {
				// FF
				delta = event.deltaY;
			}
			delta /= 3;

			var self = this;
			delta *= event.shiftKey ? 1 : this.settings.wheelScrollLines;
			this.handlers.trigger("updateWorksheet", this.element, /*x*/undefined, /*y*/undefined, /*ctrlKey*/undefined,
					function () {
						event.shiftKey ? self.scrollHorizontal(delta, event) : self.scrollVertical(delta, event);
						self._onMouseMove(event);
					});
			return true;
		};

		/** @param event {KeyboardEvent} */
		asc_CEventsController.prototype._onMouseDblClick = function(event) {
			if (this.handlers.trigger('isGlobalLockEditCell') || this.handlers.trigger('isFormatPainter')) {
				return false;
			}

			// Браузер не поддерживает свойство detail (будем делать по координатам)
			if (false === this.isDblClickInMouseDown) {
				return this.doMouseDblClick(event, /*isHideCursor*/false);
			}

			this.isDblClickInMouseDown = false;

			// Нужно отработать показ курсора, если dblClick был обработан в MouseDown
			this.showCellEditorCursor();
			return true;
		};

		/** @param event */
		asc_CEventsController.prototype._getCoordinates = function (event) {
			// ToDo стоит переделать
			if (event.coord)
				return event.coord;

			var offs = $(this.element).offset();
			var x = event.pageX - offs.left;
			var y = event.pageY - offs.top;

			// ToDo возможно стоит переделать
			if (AscBrowser.isRetina) {
				x <<= 1;
				y <<= 1;
			}

			return {x: x, y: y};
		};

        asc_CEventsController.prototype._onTouchStart = function (event){
            this.view.MobileTouchManager.onTouchStart(event);
        };
        asc_CEventsController.prototype._onTouchMove = function (event){
            this.view.MobileTouchManager.onTouchMove(event);
        };
        asc_CEventsController.prototype._onTouchEnd = function (event){
            this.view.MobileTouchManager.onTouchEnd(event);
        };

		//------------------------------------------------------------export---------------------------------------------------
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].asc_CEventsController = asc_CEventsController;
	}
)(jQuery, window);
