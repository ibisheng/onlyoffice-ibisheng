/* EventsController.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   May 16, 2012
 */
(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
		var asc_applyFunction = asc.applyFunction;

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
				scrollBackgroundColor:"#DDDDDD",//цвет фона скролла
				scrollerColor:"#EDEDED",//цвет ползунка скрола
				isViewerMode: false,
				wheelScrollLines: 3
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
			this.isMoveResizeChartsRange = false;
			// Режим select-а для диалогов
			this.isSelectionDialogMode = false;
			// Режим формулы
			this.isFormulaEditMode = false;
			
			// Обработчик кликов для граф.объектов
			this.clickCounter = new ClickCounter();
			this.isLocked = false;

			// Был ли DblClick обработан в onMouseDown эвенте
			this.isDblClickInMouseDown = false;
			// Нужно ли обрабатывать эвент браузера dblClick
			this.isDoBrowserDblClick = false;
			// Последние координаты, при MouseDown (для IE)
			this.mouseDownLastCord = null;
			//-----------------------

            this.vsbApiLockMouse = false;
            this.hsbApiLockMouse = false;

            return this;
		}


		/**
		 * @param {WorkbookView} view
		 * @param {Element} widgetElem
		 * @param {Element} canvasElem
		 * @param {Object} handlers  Event handlers (resize, reinitializeScroll, scrollY, scrollX, changeSelection, updateWorksheet, editCell, stopCellEditing)
		 * @param {Object} settings
		 */
		asc_CEventsController.prototype.init = function (view, widgetElem, canvasElem, handlers, settings) {
			var self = this;

			this.view     = view;
			this.widget   = widgetElem;
			this.element  = canvasElem;
			this.handlers = new asc.asc_CHandlersList(handlers);
			this.settings = $.extend(true, {}, this.settings, settings);

			this._createScrollBars();

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

				this.element.addEventListener("mousewheel"	, function () {return self._onMouseWheel.apply(self, arguments);}		, false);
				// for Mozilla Firefox (можно делать проверку на window.MouseScrollEvent || window.WheelEvent для FF)
				this.element.addEventListener("DOMMouseScroll", function () {return self._onMouseWheel.apply(self, arguments);}		, false);

				this.element.addEventListener("touchstart"	, function (e) {self._onMouseDown(e.touches[0]); return false;}			, false);
				this.element.addEventListener("touchmove"	, function (e) {self._onMouseMove(e.touches[0]); return false;}			, false);
				this.element.addEventListener("touchend"	, function (e) {self._onMouseUp(e.changedTouches[0]); return false;}	, false);
			}

			// Курсор для графических объектов. Определяем mousedown и mouseup для выделения текста.
			var oShapeCursor = document.getElementById("id_target_cursor");
			if (null != oShapeCursor && oShapeCursor.addEventListener) {
				oShapeCursor.addEventListener("mousedown"	, function () {return self._onMouseDown.apply(self, arguments);}, false);
				oShapeCursor.addEventListener("mouseup"		, function () {return self._onMouseUp.apply(self, arguments);}	, false);
				oShapeCursor.addEventListener("mousemove"	, function () {return self._onMouseMove.apply(self, arguments);}, false);
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

		/**
		 *
		 * @param {Boolean} isSelectionDialogMode
		 */
		asc_CEventsController.prototype.setSelectionDialogMode = function (isSelectionDialogMode) {
			this.isSelectionDialogMode = isSelectionDialogMode;
		};

		/** @param whichSB {Number}  Scroll bar to reinit (1=vertical, 2=horizontal) */
		asc_CEventsController.prototype.reinitializeScroll = function (whichSB) {
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
						vSize = self.vsb.offsetHeight + Math.max(vSize * opt.vscrollStep, 1);
						self.vsbHSt.height = vSize + "px";
						self.vsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleRow(/*allowPane*/true));
					}
					if (isHoriz) {
						hSize = self.hsb.offsetWidth + Math.max(hSize * opt.hscrollStep, 1);
						self.hsbHSt.width = hSize + "px";
						self.hsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleCol(/*allowPane*/true));
					}
				});
			}

			return this;
		};

		/** @param delta {Number} */
		asc_CEventsController.prototype.scrollVertical = function (delta, event) {
			if( event && event.preventDefault )
				event.preventDefault();
			this.vsbApi.scrollByY(this.settings.vscrollStep * delta);
			return true;
		};

		/** @param delta {Number} */
		asc_CEventsController.prototype.scrollHorizontal = function (delta, event) {
			if( event && event.preventDefault )
				event.preventDefault();
			this.hsbApi.scrollByX(this.settings.hscrollStep * delta);
			return true;
		};

		// Будем делать dblClick как в Excel
		asc_CEventsController.prototype.doMouseDblClick = function (event, isHideCursor) {
			var t = this;

			// Для формулы не нужно выходить из редактирования ячейки
			if (t.settings.isViewerMode || t.isFormulaEditMode || t.isSelectionDialogMode) {return true;}

			if( this.targetInfo && ( this.targetInfo.target == "moveResizeRange" || this.targetInfo.target == "moveRange" || this.targetInfo.target == "fillhandle" ) ){
				return true;
			}

			if (t.isCellEditMode) {if (!t.handlers.trigger("stopCellEditing")) {return true;}}

			var coord = t._getCoordinates(event);
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( asc["editor"].isStartAddShape || (graphicsInfo && graphicsInfo.isGraphicObject) )
				return;

			setTimeout(function () {
				var coord = t._getCoordinates(event);
				t.handlers.trigger("mouseDblClick", coord.x, coord.y, isHideCursor, function () {
					// Мы изменяли размеры колонки/строки, не редактируем ячейку. Обновим состояние курсора
					t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, event.ctrlKey,
						function (info) {t.targetInfo = info;});
				});
			}, 100);

			return true;
		};

		// Будем показывать курсор у редактора ячейки (только для dblClick)
		asc_CEventsController.prototype.showCellEditorCursor = function () {
			if (this.isCellEditMode) {
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
				this.vsbApi = new ScrollObject(this.vsb.id, opt);
				this.vsbApi.bind("scrollvertical", function(evt) {
					self.handlers.trigger("scrollY", evt.scrollPositionY / opt.vscrollStep);
				});
				this.vsbApi.bind("scrollVEnd", function(evt) {
					self.handlers.trigger("addRow",true);
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
				this.hsbApi = new ScrollObject(this.hsb.id, $.extend(true, {}, opt, {wheelScrollLines: 1}));
				this.hsbApi.bind("scrollhorizontal",function(evt) {
					self.handlers.trigger("scrollX", evt.scrollPositionX / opt.hscrollStep);
				});
				this.hsbApi.bind("scrollHEnd",function(evt) {
						self.handlers.trigger("addColumn",true);
					});
				this.hsbApi.onLockMouse = function(){
                    self.hsbApiLockMouse = true;
				};
				this.hsbApi.offLockMouse = function(){
                    self.hsbApiLockMouse = false;
				};
			}

			// right bottom corner
			var corner = document.createElement('div');
			corner.id = "ws-scrollbar-corner";
			this.widget.appendChild(corner);
		};

		/**
		 * @param event {jQuery.Event}
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
						if (d.deltaX) {t.scrollHorizontal(d.deltaX);}
						if (d.deltaY) {t.scrollVertical(d.deltaY);}

						if (t.isFormulaEditMode) {
							t.handlers.trigger("enterCellRange");
						} else if (t.isCellEditMode) {
							if (!t.handlers.trigger("stopCellEditing")) {return;}
						}

						asc_applyFunction(callback);
					});
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._changeSelection2 = function (event) {
			var t = this;

			var fn = function () {
				t._changeSelection2(event);
			};

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

		/** @param event {jQuery.Event} */
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

		/** @param event {jQuery.Event} */
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

		// Окончание выделения
		asc_CEventsController.prototype._changeSelectionDone = function (event) {
			var coord = this._getCoordinates(event);
			if (false === event.ctrlKey) {
				coord.x = -1;
				coord.y = -1;
			}
			this.handlers.trigger("changeSelectionDone", coord.x, coord.y);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._resizeElement = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElement", this.targetInfo, coord.x, coord.y);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._resizeElementDone = function (event) {
			var coord = this._getCoordinates(event);
			this.handlers.trigger("resizeElementDone", this.targetInfo, coord.x, coord.y, this.isResizeModeMove);
			this.isResizeModeMove = false;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._changeFillHandle = function (event, callback) {
			var t = this;
			// Обновляемся в режиме автозаполнения
			var coord = this._getCoordinates(event);
			this.handlers.trigger("changeFillHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					if (d.deltaX) {
						t.scrollHorizontal(d.deltaX);
					}
					if (d.deltaY) {
						t.scrollVertical(d.deltaY);
					}
					asc_applyFunction(callback);
				});
		};

		asc_CEventsController.prototype._changeFillHandle2 = function (event){
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

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._changeFillHandleDone = function (event) {
			// Закончили автозаполнение, пересчитаем
			var coord = this._getCoordinates(event);
			var ctrlPress = event.ctrlKey;
			this.handlers.trigger("changeFillHandleDone", coord.x, coord.y, ctrlPress);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._moveRangeHandle = function (event, callback) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveRangeHandle", coord.x, coord.y,
				function (d) {
					if (!d) return;
					if (d.deltaX) {
						t.scrollHorizontal(d.deltaX);
					}
					if (d.deltaY) {
						t.scrollVertical(d.deltaY);
					}
					asc_applyFunction(callback);
				},
				event.ctrlKey);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._moveResizeRangeHandle = function (event, target, callback) {
			var t = this;
			// Обновляемся в режиме перемещения диапазона
			var coord = this._getCoordinates(event);
			this.handlers.trigger("moveResizeRangeHandle", coord.x, coord.y, target,
				function (d) {
					if (!d) return;
					if (d.deltaX) {
						t.scrollHorizontal(d.deltaX);
					}
					if (d.deltaY) {
						t.scrollVertical(d.deltaY);
					}
					asc_applyFunction(callback);
				});
		};

		asc_CEventsController.prototype._autoFiltersClick = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			this.handlers.trigger("autoFiltersClick", coord.x, coord.y);
		};

		asc_CEventsController.prototype._commentCellClick = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			this.handlers.trigger("commentCellClick", coord.x, coord.y);
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._moveRangeHandleDone = function (event) {
			// Закончили перемещение диапазона, пересчитаем
			this.handlers.trigger("moveRangeHandleDone",event.ctrlKey);
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

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowKeyDown = function (event) {
			var t = this, dc = 0, dr = 0, isViewerMode = t.settings.isViewerMode;

			t.__retval = true;

			//for Mac OS
			if ( event.metaKey )
				event.ctrlKey = true;

			function stop(immediate) {
				event.stopPropagation();
				immediate ? event.stopImmediatePropagation() : true;
				event.preventDefault();
				t.__retval = false;
			}

			// для исправления Bug 15902 - Alt забирает фокус из приложения
			// этот код должен выполняться самым первым
			if (event.which === 18) {
				t.lastKeyCode = event.which;
			}

			var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
			if ( graphicObjects.length && t.enableKeyEvents ) {
				if (t.handlers.trigger("graphicObjectWindowKeyDown", event))
					return true;
			}

			// Двигаемся ли мы в выделенной области
			var selectionActivePointChanged = false;

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			while (t.isCellEditMode && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode || t.isFillHandleMode || t.isMoveRangeMode || t.isMoveResizeRange) {

				if (t.isCellEditMode && !t.strictClose && event.which >= 37 && event.which <= 40) {
					// обрабатываем нажатие клавиш со стрелками, если редактор открыт не по F2
					break;
				}

				// Почему-то очень хочется обрабатывать лишние условия в нашем коде, вместо обработки наверху...
				if (!t.enableKeyEvents && event.ctrlKey && (80 === event.which/* || 83 === event.which*/)) {
					// Только если отключены эвенты и нажаты Ctrl+S или Ctrl+P мы их обработаем
					break;
				}

				return true;
			}

			t.skipKeyPress = true;

			switch (event.which) {

				case 113: // F2
					var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
					if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode || graphicObjects.length) {return true;}
					if (AscBrowser.isOpera) {stop();}
					// Выставляем блокировку на выход из редактора по клавишам-стрелкам
					t.strictClose = true;
					// При F2 выставляем фокус в редакторе
					t.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/true, /*isClearCell*/false, /*isHideCursor*/undefined);
					return t.__retval;

				case 8: // backspace
					if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {return true;}

					// При backspace фокус не в редакторе (стираем содержимое)
					t.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/false, /*isClearCell*/true,
						/*isHideCursor*/undefined, /*callback*/undefined, event);
					return true;

				case 46: // Del
					if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {return true;}
					// Удаляем содержимое
					t.handlers.trigger("emptyCell");
					return true;

				case 9: // tab
					if (t.isCellEditMode) {return true;}
					// Отключим стандартную обработку браузера нажатия tab
					stop();

					// Особый случай (возможно движение в выделенной области)
					selectionActivePointChanged = true;
					if (event.shiftKey){
						dc = -1;                 // (shift + tab) - движение по ячейкам влево на 1 столбец
						event.shiftKey = false;  // Сбросим shift, потому что мы не выделяем
					} else {
						dc = +1;                 // (tab) - движение по ячейкам вправо на 1 столбец
					}
					break;

				case 13:  // "enter"
					if (t.isCellEditMode) {return true;}
					// Особый случай (возможно движение в выделенной области)
					selectionActivePointChanged = true;
					if (event.shiftKey) {
						dr = -1;                 // (shift + enter) - движение по ячейкам наверх на 1 строку
						event.shiftKey = false;  // Сбросим shift, потому что мы не выделяем
					} else {
						dr = +1;                 // (enter) - движение по ячейкам вниз на 1 строку
					}
					break;

				case 27: // Esc
					// (https://bugzilla.mozilla.org/show_bug.cgi?id=614304) - баг в Mozilla: Esc abort XMLHttpRequest and WebSocket
					// http://bugzserver/show_bug.cgi?id=14631 - наш баг на редактор
					// Перехватим Esc и отключим дефалтовую обработку
					stop();
					return t.__retval;

				case 144: //Num Lock
				case 145: //Scroll Lock
					if (AscBrowser.isOpera) {stop();}
					return t.__retval;

				case 32: // Spacebar
					if (t.isCellEditMode) {return true;}
					// Обработать как обычный текст
					if (!event.ctrlKey && !event.shiftKey) {
						t.skipKeyPress = false;
						return true;
					}
					// Отключим стандартную обработку браузера нажатия
					// Ctrl+Shift+Spacebar, Ctrl+Spacebar, Shift+Spacebar
					stop();
					// Обработать как спец селект
					if (event.ctrlKey && event.shiftKey) {
						t.handlers.trigger("changeSelection", /*isStartPoint*/true, 0,
							0, /*isCoord*/true, /*isSelectMode*/false);
					} else if (event.ctrlKey) {
						t.handlers.trigger("selectColumnsByRange");
					} else {
						t.handlers.trigger("selectRowsByRange");
					}
					return t.__retval;

				case 33: // PageUp
					// Отключим стандартную обработку браузера нажатия PageUp
					stop();
					if (event.ctrlKey) {
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
					if (event.ctrlKey) {
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
					dc = event.ctrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 38: // up
					stop();                          // Отключим стандартную обработку браузера нажатия up
					dr = event.ctrlKey ? -1.5 : -1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 39: // right
					stop();                          // Отключим стандартную обработку браузера нажатия right
					dc = event.ctrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 40: // down
					stop();                          // Отключим стандартную обработку браузера нажатия down
					dr = event.ctrlKey ? +1.5 : +1;  // Движение стрелками (влево-вправо, вверх-вниз)
					break;

				case 36: // home
					stop();                          // Отключим стандартную обработку браузера нажатия home
					dc = -2.5;
					if (event.ctrlKey) {dr = -2.5;}
					break;

				case 35: // end
					stop();                          // Отключим стандартную обработку браузера нажатия end
					dc = 2.5;
					if (event.ctrlKey) {
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
					if (isViewerMode || t.isSelectionDialogMode) {stop(); return false;}

				case 65: // select all      Ctrl + a
				case 67: // copy            Ctrl + c
					if (t.isCellEditMode) { return true; }

				case 80: // print           Ctrl + p
					if (t.isCellEditMode) { stop(); return false; }

					if (!event.ctrlKey) { t.skipKeyPress = false; return true; }

					// Вызовем обработчик
					if (!t.__handlers) {
						t.__handlers = {
							53: function () {stop(); t.handlers.trigger("setFontAttributes", "s");},
							65: function () {stop(); t.handlers.trigger("changeSelection", /*isStartPoint*/true,
								0, 0, /*isCoord*/true, /*isSelectMode*/false);},
							66: function () {stop(); t.handlers.trigger("setFontAttributes", "b");},
							73: function () {stop(); t.handlers.trigger("setFontAttributes", "i");},
							85: function () {stop(); t.handlers.trigger("setFontAttributes", "u");},
							80: function () {stop(); t.handlers.trigger("print");},
							//83: function () {stop(); t.handlers.trigger("save");},
							67: function () {t.handlers.trigger("copy");},
							86: function () {
								if (!window.GlobalPasteFlag)
								{
									if (!window.USER_AGENT_SAFARI_MACOS)
									{
										window.GlobalPasteFlag = true;
										t.handlers.trigger("paste");
									}
									else
									{
										if (0 === window.GlobalPasteFlagCounter)
										{
											SafariIntervalFocus();
											window.GlobalPasteFlag = true;
											t.handlers.trigger("paste");
										}
									}
								}
								else
								{
									if (!window.USER_AGENT_SAFARI_MACOS)
										stop();
								}
							},
							88: function () {t.handlers.trigger("cut");},
							89: function () {stop(); t.handlers.trigger("redo");},
							90: function () {stop(); t.handlers.trigger("undo");}
						};
					}
					t.__handlers[event.which]();
					return t.__retval;

				case 61:  // Firefox, Opera (+/=)
				case 187: // +/=
					if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {return true;}

					if (event.altKey) {
						t.handlers.trigger("addFunction", /*functionName*/"SUM", /*autoComplet*/true);
					} else {
						t.skipKeyPress = false;
					}
					return true;

				default:
					// При зажатом Ctrl не вводим символ
					if (!event.ctrlKey) {t.skipKeyPress = false;}
					return true;

			} // end of switch

			if ((dc !== 0 || dr !== 0) && false === t.handlers.trigger("isGlobalLockEditCell")) {

				// Проверка на движение в выделенной области
				if (selectionActivePointChanged) {
					t.handlers.trigger("selectionActivePointChanged", dc, dr,
						function (d) {
							if (d.deltaX) {t.scrollHorizontal(d.deltaX);}
							if (d.deltaY) {t.scrollVertical(d.deltaY);}
						});
				} else {
					if (this.isCellEditMode && !this.isFormulaEditMode) {
						if (!t.handlers.trigger("stopCellEditing")) {return true;}
					}

					if (t.isFormulaEditMode) {
						// для определения рэнджа под курсором и активизации его для WorksheetView
						if (false === t.handlers.trigger("canEnterCellRange")) {
							if (!t.handlers.trigger("stopCellEditing")) {return true;}
						}
					}

					t.handlers.trigger("changeSelection", /*isStartPoint*/!event.shiftKey, dc, dr,
							/*isCoord*/false, /*isSelectMode*/false,
							function (d) {
								if (d.deltaX) {t.scrollHorizontal(d.deltaX);}
								if (d.deltaY) {t.scrollVertical(d.deltaY);}

								if (t.isFormulaEditMode) {
									t.handlers.trigger("enterCellRange");
								} else if (t.isCellEditMode) {
									if (!t.handlers.trigger("stopCellEditing")) {return true;}
								}
							});
				}
			}

			return t.__retval;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowKeyPress = function (event) {
			var t = this;

			// Нельзя при отключенных эвентах возвращать false (это касается и ViewerMode)
			if (!t.enableKeyEvents) {return true;}

			// не вводим текст в режиме просмотра
			// если в FF возвращать false, то отменяется дальнейшая обработка серии keydown -> keypress -> keyup
			// и тогда у нас не будут обрабатываться ctrl+c и т.п. события
			if (t.settings.isViewerMode || t.isSelectionDialogMode) {return true;}

			var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
			if ( graphicObjects.length && t.enableKeyEvents ) {
				if (!( (event.ctrlKey || event.metaKey) && (event.which == 99 || event.which == 118) )) {		// Mozilla Firefox Fix #20080
					if (t.handlers.trigger("graphicObjectWindowKeyPress", event))
						return true;
				}
			}

			// Для таких браузеров, которые не присылают отжатие левой кнопки мыши для двойного клика, при выходе из
			// окна редактора и отпускания кнопки, будем отрабатывать выход из окна (только Chrome присылает эвент MouseUp даже при выходе из браузера)
			this.showCellEditorCursor();

			if (t.isCellEditMode && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode) {
				return true;
			}

			if (t.skipKeyPress || event.which < 32) {
				t.skipKeyPress = true;
				return true;
			}

			if (!t.isCellEditMode) {
				// При нажатии символа, фокус не ставим
				// Очищаем содержимое ячейки
				t.handlers.trigger("editCell", 0, 0, /*isCoord*/false, /*isFocus*/false, /*isClearCell*/true,
					/*isHideCursor*/undefined, /*callback*/undefined, event);
			}
			return true;
		};

		/** @param event {jQuery.Event} */
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

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowMouseMove = function (event) {
			if (this.isSelectMode && !this.hasCursor) {this._changeSelection2(event);}
			if (this.isResizeMode && !this.hasCursor) {
				this.isResizeModeMove = true;
				this._resizeElement(event);
			}
            if( this.hsbApiLockMouse )
                this.hsbApi.mouseDown ? this.hsbApi.evt_mousemove.call(this.hsbApi,event) : false;

            else if( this.vsbApiLockMouse )
                this.vsbApi.mouseDown ? this.vsbApi.evt_mousemove.call(this.vsbApi,event) : false;

			return true;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowMouseUp = function (event) {

//            this.vsbApi.evt_mouseup(event);
//            this.hsbApi.evt_mouseup(event);
			// Shapes
			var coord = this._getCoordinates(event);
			if ( asc["editor"].isStartAddShape ) {
				event.fromWindow = true;
				this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
				this._changeSelectionDone(event);
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
				this.isMoveResizeChartsRange = false;
				this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();

            if( this.hsbApiLockMouse )
                this.hsbApi.mouseDown ? this.hsbApi.evt_mouseup.call(this.hsbApi,event) : false;

            else if( this.vsbApiLockMouse )
                this.vsbApi.mouseDown ? this.vsbApi.evt_mouseup.call(this.vsbApi,event) : false;

			return true;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onWindowMouseUpExternal = function (x, y) {
			if (this.isSelectMode) {
				this.isSelectMode = false;
				this.handlers.trigger("changeSelectionDone", x, y);
			}

			if (this.isResizeMode) {
				this.isResizeMode = false;
				this.handlers.trigger("resizeElementDone", this.targetInfo, x, y, this.isResizeModeMove);
				this.isResizeModeMove = false;
			}

			// Режим автозаполнения
			if (this.isFillHandleMode) {
				// Закончили автозаполнение
				this.isFillHandleMode = false;
				this.handlers.trigger("changeFillHandleDone", x, y, /*ctrlPress*/false);
			}

			// Режим перемещения диапазона
			if (this.isMoveRangeMode) {
				// Закончили перемещение диапазона
				this.isMoveRangeMode = false;
				this.handlers.trigger("moveRangeHandleDone");
			}

			if (this.isMoveResizeRange) {
				this.isMoveResizeRange = false;
				this.isMoveResizeChartsRange = false;
				this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();

			return true;
		};

		/** @param event {jQuery.Event} */
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

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onMouseDown = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			event.isLocked = true;
			t.isLocked = true;

			if (t.handlers.trigger("isGlobalLockEditCell"))
				return;

			if (!this.enableKeyEvents) {
				t.handlers.trigger("canvasClick");
			}

			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( asc["editor"].isStartAddShape || (graphicsInfo && graphicsInfo.isGraphicObject) ) {
				// При выборе диапазона не нужно выделять автофигуру
				if (t.isSelectionDialogMode)
					return;
				//for Mac OS
				if (event.metaKey)
					event.ctrlKey = true;

				this.clickCounter.mouseDownEvent(coord.x, coord.y, event.button);
				event.ClickCount = this.clickCounter.clickCount;

				if ( (event.ClickCount == 2) && asc["editor"].isStartAddShape )
					this.isDblClickInMouseDown = true;

				asc["editor"].isStartAddShape = true;
				t.handlers.trigger("graphicObjectMouseDown", event, coord.x, coord.y);

				if ( t.isCellEditMode )
					t.handlers.trigger("stopCellEditing");

				if (asc["editor"].isStartAddShape) {
					// SelectionChanged
					t.handlers.trigger("updateSelectionShape", /*isSelectOnShape*/true);
					return;
				}
			}

			if (2 === event.detail) {
				// Это означает, что это MouseDown для dblClick эвента (его обрабатывать не нужно)
				// Порядок эвентов для dblClick - http://javascript.ru/tutorial/events/mouse#dvoynoy-levyy-klik

				// Проверка для IE, т.к. он присылает DblClick при сдвиге мыши...
				if (this.mouseDownLastCord && coord.x === this.mouseDownLastCord.x && coord.y === this.mouseDownLastCord.y && 0 === event.button) {
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
			if (event.preventDefault)
				event.preventDefault();
			else
				event.returnValue = false;

			// Запоминаем координаты нажатия
			this.mouseDownLastCord = coord;

			t.hasFocus = true;
			if (!t.isCellEditMode) {
				if (event.shiftKey) {
					t.isSelectMode = true;
					t._changeSelection(event, /*isSelectMode*/true);
					return;
				}
				if (t.targetInfo){
					if (t.targetInfo.target === "colresize" || t.targetInfo.target === "rowresize") {
						t.isResizeMode = true;
						t._resizeElement(event);
						return;
					} else if (t.targetInfo && t.targetInfo.target === "fillhandle" && false === this.settings.isViewerMode){
						// В режиме автозаполнения
						this.isFillHandleMode = true;
						t._changeFillHandle(event);
						return;
					} else if ( t.targetInfo && t.targetInfo.target === "moveRange" && false === this.settings.isViewerMode ) {
						// В режиме перемещения диапазона
						this.isMoveRangeMode = true;
						t._moveRangeHandle(event);
						return;
					}
					else if (t.targetInfo && (t.targetInfo.target === "aFilterObject")) {
						  t._autoFiltersClick(event);
						  return;
					}
					else if (t.targetInfo && (undefined !== t.targetInfo.commentIndexes) && (false === this.settings.isViewerMode)) {
						t._commentCellClick(event);
					}
					else if ( t.targetInfo && t.targetInfo.target === "moveResizeRange" && false === this.settings.isViewerMode ){
						this.isMoveResizeRange = true;
						this.isMoveResizeChartsRange = true;
						t._moveResizeRangeHandle(event, t.targetInfo);
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
							if ( t.targetInfo && t.targetInfo.target === "moveResizeRange" && false === this.settings.isViewerMode ){
								this.isMoveResizeRange = true;
								t._moveResizeRangeHandle(event, t.targetInfo);
								return;
							}
							// для определения рэнджа под курсором и активизации его для WorksheetView
							else if (false === t.handlers.trigger("canEnterCellRange")) {
								if (!t.handlers.trigger("stopCellEditing")) {return;}
							}
						}
						t.isSelectMode = true;
						t.handlers.trigger("changeSelection", /*isStartPoint*/true, coord.x, coord.y,
								/*isCoord*/true, /*isSelectMode*/true,
								function (d) {
									if (d.deltaX) {t.scrollHorizontal(d.deltaX);}
									if (d.deltaY) {t.scrollVertical(d.deltaY);}

									if (t.isFormulaEditMode) {
										t.handlers.trigger("enterCellRange");
									} else if (t.isCellEditMode) {
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
				if (t.targetInfo && t.targetInfo.target === "fillhandle"  && false === this.settings.isViewerMode){
					// В режиме автозаполнения
					t.isFillHandleMode = true;
					t._changeFillHandle(event);
					return;
				} else {
					t.isSelectMode = true;
					t.handlers.trigger("changeSelection", /*isStartPoint*/true, coord.x,
						coord.y, /*isCoord*/true, /*isSelectMode*/true);
					return;
				}
			}
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onMouseUp = function (event) {

			// Shapes
			var coord = this._getCoordinates(event);
			event.isLocked = false;
			this.isLocked = false;

			this.handlers.trigger("graphicObjectMouseUpEx", event, coord.x, coord.y);
			if ( asc["editor"].isStartAddShape ) {

				//for Mac OS
				if ( event.metaKey )
					event.ctrlKey = true;

				//console.log("_onMouseUp: " + this.clickCounter.clickCount);

				event.ClickCount = this.clickCounter.clickCount;
				this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
				this._changeSelectionDone(event);
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
				this.isMoveResizeChartsRange = false;
				this._moveResizeRangeHandleDone(event, this.targetInfo);
				return true;
			}

			// Мы можем dblClick и не отработать, если вышли из области и отпустили кнопку мыши, нужно отработать
			this.showCellEditorCursor();
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onMouseMove = function (event) {
			var t = this;
			var coord = t._getCoordinates(event);
			event.isLocked = t.isLocked;

			t.hasCursor = true;

			// Shapes
			var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
			if ( graphicsInfo && graphicsInfo.isGraphicObject )
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
                if(event.ctrlKey){
                    event.currentTarget.style.cursor = "copy";
                }
                else{
                    event.currentTarget.style.cursor = "move";
                }
				t._moveRangeHandle(event);
				return true;
			}

			if (t.isMoveResizeRange) {
				t._moveResizeRangeHandle(event, t.targetInfo);
				return true;
			}

			if (asc["editor"].isStartAddShape || graphicsInfo) {
				t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
				t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, event.ctrlKey, function(info){t.targetInfo = info;});
				return true;
			}

			t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, event.ctrlKey, function(info){t.targetInfo = info;});
			return true;
		};

		/** @param event {jQuery.Event} */
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

		/**
		 * @param event
		 */
		asc_CEventsController.prototype._onMouseWheel = function (event) {
			if (this.isFillHandleMode || this.isMoveRangeMode || this.isMoveResizeChartsRange || this.isMoveResizeRange) {
				return true;
			}
			var delta = 0;
			if (undefined !== event.wheelDelta && 0 !== event.wheelDelta) {
				delta = -1 * event.wheelDelta / 120;
			} else if (undefined != event.detail && 0 !== event.detail) {
				// FF
				delta = event.detail / 3;
			}


			var self = this;
			delta *= event.shiftKey ? 1 : this.settings.wheelScrollLines;
			this.handlers.trigger("updateWorksheet", this.element, /*x*/undefined, /*y*/undefined, /*ctrlKey*/undefined,
					function () {
						event.shiftKey ? self.scrollHorizontal(delta, event) : self.scrollVertical(delta, event);
						self._onMouseMove(event);
					});
			return true;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._onMouseDblClick = function (event) {
			if (this.handlers.trigger("isGlobalLockEditCell"))
				return false;

			// Браузер не поддерживает свойство detail (будем делать по координатам)
			if (false === this.isDblClickInMouseDown)
				return this.doMouseDblClick(event, /*isHideCursor*/false);

			this.isDblClickInMouseDown = false;

			// Нужно отработать показ курсора, если dblClick был обработан в MouseDown
			this.showCellEditorCursor();
			return true;
		};

		/** @param event {jQuery.Event} */
		asc_CEventsController.prototype._getCoordinates = function (event) {
			var offs = $(this.element).offset();
			var x = event.pageX - offs.left;
			var y = event.pageY - offs.top;
			return {x: x, y: y};
		};


		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"]["asc_CEventsController"] = window["Asc"].asc_CEventsController = asc_CEventsController;


	}
)(jQuery, window);
