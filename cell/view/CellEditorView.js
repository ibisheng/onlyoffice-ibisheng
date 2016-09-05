/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined) {


	/*
	 * Import
	 * -----------------------------------------------------------------------------
	 */
	var asc = window["Asc"];
	
	var AscBrowser = AscCommon.AscBrowser;
	
	var cElementType = AscCommonExcel.cElementType;
	var c_oAscCellEditorSelectState = AscCommonExcel.c_oAscCellEditorSelectState;
	var c_oAscCellEditorState = asc.c_oAscCellEditorState;
	var Fragment = AscCommonExcel.Fragment;

	var asc_calcnpt = asc.calcNearestPt;
	var asc_getcvt = asc.getCvtRatio;
	var asc_round = asc.round;
	var asc_search = asc.search;
	var asc_lastidx = asc.lastIndexOf;

	var asc_HL = AscCommonExcel.HandlersList;
	var asc_incDecFonSize = asc.incDecFonSize;


	/** @const */
	var kLeftAlign = "left";
	/** @const */
	var kRightAlign = "right";
	/** @const */
	var kCenterAlign = "center";

	/** @const */
	var kBeginOfLine = -1;
	/** @const */
	var kBeginOfText = -2;
	/** @const */
	var kEndOfLine = -3;
	/** @const */
	var kEndOfText = -4;
	/** @const */
	var kNextChar = -5;
	/** @const */
	var kNextWord = -6;
	/** @const */
	var kNextLine = -7;
	/** @const */
	var kPrevChar = -8;
	/** @const */
	var kPrevWord = -9;
	/** @const */
	var kPrevLine = -10;
	/** @const */
	var kPosition = -11;
	/** @const */
	var kPositionLength = -12;

	/** @const */
	var kNewLine = "\n";


	/**
	 * CellEditor widget
	 * -----------------------------------------------------------------------------
	 * @constructor
	 * @param {Element} elem
	 * @param {Element} input
	 * @param {Array} fmgrGraphics
	 * @param {FontProperties} oFont
	 * @param {HandlersList} handlers
	 * @param {Object} settings
	 */
	function CellEditor( elem, input, fmgrGraphics, oFont, handlers, settings ) {
		this.element = elem;
		this.input = input;
		this.handlers = new asc_HL( handlers );
		this.options = {};
		this.sides = undefined;

		//---declaration---
		this.canvasOuter = undefined;
		this.canvasOuterStyle = undefined;
		this.canvas = undefined;
		this.canvasOverlay = undefined;
		this.cursor = undefined;
		this.cursorStyle = undefined;
		this.cursorTID = undefined;
		this.cursorPos = 0;
		this.beginCompositePos = -1;
		this.compositeLength = 0;
		this.topLineIndex = 0;
		this.m_oFont = oFont;
		this.fmgrGraphics = fmgrGraphics;
		this.drawingCtx = undefined;
		this.overlayCtx = undefined;
		this.textRender = undefined;
		this.textFlags = undefined;
		this.kx = 1;
		this.ky = 1;
		this.skipKeyPress = undefined;
		this.undoList = [];
		this.redoList = [];
		this.undoMode = false;
		this.noUpdateMode = false;
		this.selectionBegin = -1;
		this.selectionEnd = -1;
		this.isSelectMode = c_oAscCellEditorSelectState.no;
		this.hasCursor = false;
		this.hasFocus = false;
		this.newTextFormat = null;
		this.selectionTimer = undefined;
		this.enableKeyEvents = true;
		this.isTopLineActive = false;
		this.skipTLUpdate = true;
		this.isOpened = false;
		this.callTopLineMouseup = false;
		this.lastKeyCode = undefined;
		this.m_nEditorState = c_oAscCellEditorState.editEnd; // Состояние редактора

		// Функции, которые будем отключать
		this.fKeyMouseUp = null;
		this.fKeyMouseMove = null;
		//-----------------

		this.objAutoComplete = {};

		/** @type RegExp */
		this.reReplaceNL = /\r?\n|\r/g;
		/** @type RegExp */
		this.reReplaceTab = /[\t\v\f]/g;
		// RegExp с поддержкой рэнджей вида $E1:$F2
		this.reRangeStr = "[^a-z0-9_$!](\\$?[a-z]+\\$?\\d+:\\$?[a-z]+\\$?\\d+|\\$?[a-z]+:\\$?[a-z]+|\\$?\\d+:\\$?\\d+|\\$?[a-z]+\\$?\\d+)(?=[^a-z0-9_]|$)";
		this.rangeChars = ["=", "-", "+", "*", "/", "(", "{", ",", "<", ">", "^", "!", "&", ":", ";", " "];
		this.reNotFormula = new XRegExp( "[^\\p{L}0-9_]", "i" );
		this.reFormula = new XRegExp( "^([\\p{L}][\\p{L}0-9_]*)", "i" );

		this.defaults = {
			padding: -1, selectColor: new AscCommon.CColor( 190, 190, 255, 0.5 ),

			canvasZIndex: 500, blinkInterval: 500, cursorShape: "text"
		};

		this.dontUpdateText = false;

		this._formula = null;

		// Обработчик кликов
		this.clickCounter = new AscFormat.ClickCounter();

		this._init( settings );

		return this;
	}

	CellEditor.prototype._init = function (settings) {
		var t = this;
		var z = t.defaults.canvasZIndex;
		this.defaults.padding = settings.padding;

		if (null != this.element) {
			t.canvasOuter = document.createElement('div');
			t.canvasOuter.id = "ce-canvas-outer";
			t.canvasOuter.style.display = "none";
			t.canvasOuter.style.zIndex = z;
			var innerHTML = '<canvas id="ce-canvas" style="z-index: ' + (z + 1) + '"></canvas>';
			innerHTML += '<canvas id="ce-canvas-overlay" style="z-index: ' + (z + 2) + '; cursor: ' + t.defaults.cursorShape +
				'"></canvas>';
			innerHTML += '<div id="ce-cursor" style="display: none; z-index: ' + (z + 3) + '"></div>';
			t.canvasOuter.innerHTML = innerHTML;
			this.element.appendChild(t.canvasOuter);

			t.canvasOuterStyle = t.canvasOuter.style;
			t.canvas = document.getElementById("ce-canvas");
			t.canvasOverlay = document.getElementById("ce-canvas-overlay");
			t.cursor = document.getElementById("ce-cursor");
			t.cursorStyle = t.cursor.style;
		}

		// create text render
		t.drawingCtx = new asc.DrawingContext({
			canvas: t.canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
		});
		t.overlayCtx = new asc.DrawingContext({
			canvas: t.canvasOverlay, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
		});
		t.textRender = new AscCommonExcel.CellTextRender(t.drawingCtx);
		t.textRender.setDefaultFont(settings.font.clone());

		// bind event handlers
		if (t.canvasOuter && t.canvasOuter.addEventListener) {
			t.canvasOuter.addEventListener("mousedown", function () {
				return t._onMouseDown.apply(t, arguments);
			}, false);
			t.canvasOuter.addEventListener("mouseup", function () {
				return t._onMouseUp.apply(t, arguments);
			}, false);
			t.canvasOuter.addEventListener("mousemove", function () {
				return t._onMouseMove.apply(t, arguments);
			}, false);
			t.canvasOuter.addEventListener("mouseleave", function () {
				return t._onMouseLeave.apply(t, arguments);
			}, false);
		}

		// check input, it may have zero len, for mobile version
		if (t.input && t.input.addEventListener) {
			t.input.addEventListener("focus", function () {
				return t.isOpened ? t._topLineGotFocus.apply(t, arguments) : true;
			}, false);
			t.input.addEventListener("mousedown", function () {
				return t.isOpened ? (t.callTopLineMouseup = true) : true;
			}, false);
			t.input.addEventListener("mouseup", function () {
				return t.isOpened ? t._topLineMouseUp.apply(t, arguments) : true;
			}, false);
			t.input.addEventListener("input", function () {
				return t._onInputTextArea.apply(t, arguments);
			}, false);

			// Не поддерживаем drop на верхнюю строку
			t.input.addEventListener("drop", function (e) {
				e.preventDefault();
				return false;
			}, false);
		}

		this.fKeyMouseUp = function () {
			return t._onWindowMouseUp.apply(t, arguments);
		};
		this.fKeyMouseMove = function () {
			return t._onWindowMouseMove.apply(t, arguments);
		};
	};

	CellEditor.prototype.destroy = function () {
	};

	/**
	 * @param {Object} options
	 *   fragments  - text fragments
	 *   flags      - text flags (wrapText, textAlign)
	 *   font
	 *   background
	 *   textColor
	 *   saveValueCallback
	 */
	CellEditor.prototype.open = function ( options ) {
		var b = this.input.selectionStart;

		this.isOpened = true;
		if ( window.addEventListener ) {
			window.addEventListener( "mouseup", this.fKeyMouseUp, false );
			window.addEventListener( "mousemove", this.fKeyMouseMove, false );
		}
		this._setOptions( options );
		this.isTopLineActive = true === this.input.isFocused;

		this._updateFormulaEditMod( /*bIsOpen*/true );
		this._draw();

		if ( !(options.cursorPos >= 0) ) {
			if ( this.isTopLineActive ) {
				if ( typeof b !== "undefined" ) {
					if ( this.cursorPos !== b ) {
						this._moveCursor( kPosition, b );
					}
				}
				else {
					this._moveCursor( kEndOfText );
				}
			}
			else if ( options.isClearCell ) {
				this._selectChars( kEndOfText );
			}
			else {
				this._moveCursor( kEndOfText );
			}
		}
		/*
		 * Выставляем фокус при открытии
		 * При нажатии символа, фокус не ставим
		 * При F2 выставляем фокус в редакторе
		 * При dbl клике фокус выставляем в зависимости от наличия текста в ячейке
		 */
		this.setFocus( this.isTopLineActive ? true : (undefined !== options.focus) ? options.focus : this._haveTextInEdit() ? true : false );
		this._updateUndoRedoChanged();
	};

	CellEditor.prototype.close = function (saveValue) {
		var opt = this.options, ret;

		if (saveValue && "function" === typeof opt.saveValueCallback) {
			var isFormula = this.isFormula();
			// Для формул делаем пересчет всегда. Для остального - только если мы изменили что-то. http://bugzilla.onlyoffice.com/show_bug.cgi?id=31889
			// Сюда же добавляется и ячейка с wrap-текстом, у которой выключен wrap.
			// Иначе F2 по ячейке с '\n', у которой выключен wrap, не станет снова wrap. http://bugzilla.onlyoffice.com/show_bug.cgi?id=17590
			if (0 < this.undoList.length || isFormula || this.textFlags.wrapOnlyNL) {
				// Делаем замену текста на автодополнение, если есть select и текст полностью совпал.
				if (this.selectionBegin !== this.selectionEnd && !isFormula) {
					var s = this._getFragmentsText(this.options.fragments);
					if (!AscCommon.isNumber(s)) {
						var arrAutoComplete = this._getAutoComplete(s.toLowerCase());
						if (1 === arrAutoComplete.length) {
							var newValue = arrAutoComplete[0];
							this.selectionBegin = this.textRender.getBeginOfText();
							this.cursorPos = this.selectionEnd = this.textRender.getEndOfText();
							this.noUpdateMode = true;
							this._addChars(newValue);
							this.noUpdateMode = false;
						}
					}
				}

				ret = opt.saveValueCallback(opt.fragments, this.textFlags, /*skip NL check*/ret);
				if (!ret) {
					// При ошибке нужно выставить флаг, чтобы по стрелкам не закрывался редактор
					this.handlers.trigger('setStrictClose', true);
					return false;
				}
			}
		}

		this.isOpened = false;

		this._formula = null;

		if (!window['IS_NATIVE_EDITOR']) {
			if (window.removeEventListener) {
				window.removeEventListener("mouseup", this.fKeyMouseUp, false);
				window.removeEventListener("mousemove", this.fKeyMouseMove, false);
			}
			this.input.blur();
			this.isTopLineActive = false;
			this.input.isFocused = false;
			this._hideCursor();
			// hide
			this._hideCanvas();
		}

		// delete autoComplete
		this.objAutoComplete = {};

		// Сброс состояния редактора
		this.m_nEditorState = c_oAscCellEditorState.editEnd;
		this.handlers.trigger("closed");
		return true;
	};

	CellEditor.prototype.setTextStyle = function (prop, val) {
		var t = this, opt = t.options, begin, end, i, first, last;

		if (t.selectionBegin !== t.selectionEnd) {
			begin = Math.min(t.selectionBegin, t.selectionEnd);
			end = Math.max(t.selectionBegin, t.selectionEnd);

			// save info to undo/redo
			if (end - begin < 2) {
				t.undoList.push({fn: t._addChars, args: [t.textRender.getChars(begin, 1), begin]});
			} else {
				t.undoList.push({fn: t._addFragments, args: [t._getFragments(begin, end - begin), begin]});
			}

			t._extractFragments(begin, end - begin);

			first = t._findFragment(begin);
			last = t._findFragment(end - 1);

			if (first && last) {
				for (i = first.index; i <= last.index; ++i) {
					var valTmp = t._setFormatProperty(opt.fragments[i].format, prop, val);
					// Только для горячих клавиш
					if (null === val) {
						val = valTmp;
					}
				}
				// merge fragments with equal formats
				t._mergeFragments();
				t._update();

				// Обновляем выделение
				t._cleanSelection();
				t._drawSelection();

				// save info to undo/redo
				t.undoList.push({fn: t._removeChars, args: [begin, end - begin]});
				t.redoList = [];
			}

		} else {
			first = t._findFragmentToInsertInto(t.cursorPos);
			if (first) {
				if (!t.newTextFormat) {
					t.newTextFormat = opt.fragments[first.index].format.clone();
				}
				t._setFormatProperty(t.newTextFormat, prop, val);
			}

		}
	};

	CellEditor.prototype.empty = function ( options ) {
		// Чистка для редактирования только All
		if ( Asc.c_oAscCleanOptions.All !== options ) {
			return;
		}

		// Удаляем только selection
		this._removeChars();
	};

	CellEditor.prototype.undo = function () {
		this._performAction( this.undoList, this.redoList );
	};

	CellEditor.prototype.redo = function () {
		this._performAction( this.redoList, this.undoList );
	};

	CellEditor.prototype.getZoom = function () {
		return this.drawingCtx.getZoom();
	};

	CellEditor.prototype.changeZoom = function ( factor ) {
		this.drawingCtx.changeZoom( factor );
		this.overlayCtx.changeZoom( factor );
	};

	CellEditor.prototype.canEnterCellRange = function () {
		var fR = this._findRangeUnderCursor();
		var isRange = (fR.range !== null && !fR.range.isName);
		var prevChar = this.textRender.getChars(this.cursorPos - 1, 1);
		return isRange || this.rangeChars.indexOf(prevChar) >= 0;
	};

	CellEditor.prototype.activateCellRange = function () {
		var res = this._findRangeUnderCursor();

		res.range ? this.handlers.trigger("existedRange", res.range, res.wsName) : this.handlers.trigger("newRange");
	};

	CellEditor.prototype.enterCellRange = function (rangeStr) {
		var res = this._findRangeUnderCursor();

		if (res.range) {
			this._moveCursor(kPosition, res.index);
			this._selectChars(kPosition, res.index + res.length);
		}

		var lastAction = this.undoList.length > 0 ? this.undoList[this.undoList.length - 1] : null;

		while (lastAction && lastAction.isRange) {
			this.undoList.pop();
			lastAction = this.undoList.length > 0 ? this.undoList[this.undoList.length - 1] : null;
		}

		var tmp = this.skipTLUpdate;
		this.skipTLUpdate = false;
		this._addChars(rangeStr, undefined, /*isRange*/true);
		this.skipTLUpdate = tmp;
	};

	CellEditor.prototype.changeCellRange = function (range) {
		var t = this;
		t._moveCursor(kPosition, range.cursorePos/* -length */);
		t._selectChars(kPositionLength, range.formulaRangeLength);
		t._addChars(range.getName(), undefined, /*isRange*/true);
		t._moveCursor(kEndOfText);
	};

	CellEditor.prototype.move = function ( l, t, r, b ) {
		this.sides = this.options.getSides();
		this.left = this.sides.cellX;
		this.top = this.sides.cellY;
		this.right = this.sides.r[0];
		this.bottom = this.sides.b[0];
		// ToDo вынести в отдельную функцию
		var canExpW = true, canExpH = true, tm, expW, expH, fragments = this._getRenderFragments();
		if ( 0 < fragments.length ) {
			tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
			expW = tm.width > this._getContentWidth();
			expH = tm.height > this._getContentHeight();

			while ( expW && canExpW || expH && canExpH ) {
				if ( expW ) {
					canExpW = this._expandWidth();
				}
				if ( expH ) {
					canExpH = this._expandHeight();
				}

				if ( !canExpW ) {
					this.textFlags.wrapText = true;
					tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
				}
				else {
					tm = this.textRender.measure( this._getContentWidth() );
				}
				expW = tm.width > this._getContentWidth();
				expH = tm.height > this._getContentHeight();
			}
		}

		if ( this.left < l || this.top < t || this.left > r || this.top > b ) {
			// hide
			this._hideCanvas();
		}
		else {
			this._adjustCanvas();
			this._showCanvas();
			this._renderText();
			this._drawSelection();
		}
	};

	CellEditor.prototype.setFocus = function (hasFocus) {
		this.hasFocus = !!hasFocus;
		this.handlers.trigger("gotFocus", this.hasFocus);
	};

	CellEditor.prototype.restoreFocus = function () {
		if (this.isTopLineActive) {
			this.input.focus();
		}
	};

	CellEditor.prototype.copySelection = function () {
		var t = this;
		var res = null;
		if ( t.selectionBegin !== t.selectionEnd ) {
			var start = t.selectionBegin;
			var end = t.selectionEnd;
			if ( start > end ) {
				var temp = start;
				start = end;
				end = temp;
			}
			res = t._getFragments( start, end - start );
		}
		return res;
	};

	CellEditor.prototype.cutSelection = function () {
		var t = this;
		var f = null;
		if ( t.selectionBegin !== t.selectionEnd ) {
			var start = t.selectionBegin;
			var end = t.selectionEnd;
			if ( start > end ) {
				var temp = start;
				start = end;
				end = temp;
			}
			f = t._getFragments( start, end - start );
			t._removeChars();
		}
		return f;
	};

	CellEditor.prototype.pasteText = function (text) {
		text = text.replace(/\t/g, " ");
		text = text.replace(/\r/g, "");
		text = text.replace(/^\n+|\n+$/g, "");

		var length = text.length;
		if (!(length > 0)) {
			return;
		}
		if (!this._checkMaxCellLength(length)) {
			return;
		}

		var wrap = -1 !== text.indexOf(kNewLine);
		if (this.selectionBegin !== this.selectionEnd) {
			this._removeChars();
		} else {
			this.undoList.push({fn: "fake", args: []});
		}//фейковый undo(потому что у нас делает undo по 2 действия)

		// save info to undo/redo
		this.undoList.push({fn: this._removeChars, args: [this.cursorPos, length]});
		this.redoList = [];

		var opt = this.options;
		var nInsertPos = this.cursorPos;
		var fr;
		fr = this._findFragmentToInsertInto(nInsertPos - (nInsertPos > 0 ? 1 : 0));
		if (fr) {
			var oCurFragment = opt.fragments[fr.index];
			if (fr.end <= nInsertPos) {
				oCurFragment.text += text;
			} else {
				var sNewText = oCurFragment.text.substring(0, nInsertPos);
				sNewText += text;
				sNewText += oCurFragment.text.substring(nInsertPos);
				oCurFragment.text = sNewText;
			}
			this.cursorPos = nInsertPos + length;
			this._update();
		}

		if (wrap) {
			this._wrapText();
			this._update();
		}
	};

	CellEditor.prototype.paste = function (fragments, cursorPos) {
		if (!(fragments.length > 0)) {
			return;
		}
		var length = this._getFragmentsLength(fragments);
		if (!this._checkMaxCellLength(length)) {
			return;
		}

		var wrap = fragments.some(function (val) {
			return -1 !== val.text.indexOf(kNewLine);
		});

		this._cleanFragments(fragments);

		if (this.selectionBegin !== this.selectionEnd) {
			this._removeChars();
		}

		// save info to undo/redo
		this.undoList.push({fn: this._removeChars, args: [this.cursorPos, length]});
		this.redoList = [];

		this._addFragments(fragments, this.cursorPos);

		if (wrap) {
			this._wrapText();
			this._update();
		}

		// Сделано только для вставки формулы в ячейку (когда не открыт редактор)
		if (undefined !== cursorPos) {
			this._moveCursor(kPosition, cursorPos);
		}
	};

	/** @param flag {Boolean} */
	CellEditor.prototype.enableKeyEventsHandler = function ( flag ) {
		var oldValue = this.enableKeyEvents;
		this.enableKeyEvents = !!flag;
		if ( this.isOpened && oldValue !== this.enableKeyEvents ) {
			this.enableKeyEvents ? this.showCursor() : this._hideCursor();
		}
	};

	CellEditor.prototype.isFormula = function () {
		var fragments = this.options.fragments;
		return fragments && fragments.length > 0 && fragments[0].text.length > 0 && fragments[0].text.charAt( 0 ) === "=";
	};

	CellEditor.prototype.formulaIsOperator = function () {
		var elem;
		return this.isFormula() &&
			(null !== (elem = this._formula.getElementByPos(this.cursorPos - 1)) && elem.type === cElementType.operator ||
			null === elem || this._formula.operand_expected);
	};

	CellEditor.prototype.insertFormula = function ( functionName, isDefName ) {
		// Проверим форула ли это
		if ( false === this.isFormula() ) {
			// Может это просто текста нет
			var fragments = this.options.fragments;
			if ( 1 === fragments.length && 0 === fragments[0].text.length ) {
				// Это просто нет текста, добавим форумулу
				functionName = "=" + functionName + "()";
			}
			else {
				// Не смогли добавить...
				return false;
			}
		}
		else {
			if ( !isDefName )
			// Это уже форула, добавляем без '='
			{
				functionName = functionName + "()";
			}
		}

		var tmp = this.skipTLUpdate;
		this.skipTLUpdate = false;
		// Вставим форумулу в текущую позицию
		this._addChars( functionName );
		// Меняем позицию курсора внутрь скобок
		if ( !isDefName ) {
			this._moveCursor( kPosition, this.cursorPos - 1 );
		}
		this.skipTLUpdate = tmp;
	};

	CellEditor.prototype.replaceText = function (pos, len, newText) {
		this._moveCursor(kPosition, pos);
		this._selectChars(kPosition, pos + len);
		this._addChars(newText);
	};

	CellEditor.prototype.setFontRenderingMode = function () {
		if ( this.isOpened ) {
			this._draw();
		}
	};

	// Private

	CellEditor.prototype._setOptions = function ( options ) {
		var opt = this.options = options;
		var ctx = this.drawingCtx;
		var u = ctx.getUnits();

		this.textFlags = opt.flags.clone();
		if ( this.textFlags.textAlign.toLowerCase() === "justify" || this.isFormula() ) {
			this.textFlags.textAlign = "left";
		}

		this._cleanFragments( opt.fragments );
		this.textRender.setString( opt.fragments, this.textFlags );
		this.newTextFormat = null;

		if ( opt.zoom > 0 ) {
			this.overlayCtx.setFont( this.drawingCtx.getFont() );
			this.changeZoom( opt.zoom );
		}

		this.kx = asc_getcvt( u, 0/*px*/, ctx.getPPIX() );
		this.ky = asc_getcvt( u, 0/*px*/, ctx.getPPIY() );

		this.sides = opt.getSides();

		this.left = this.sides.cellX;
		this.top = this.sides.cellY;
		this.right = this.sides.r[0];
		this.bottom = this.sides.b[0];

		this.cursorPos = opt.cursorPos !== undefined ? opt.cursorPos : 0;
		this.topLineIndex = 0;
		this.selectionBegin = -1;
		this.selectionEnd = -1;
		this.isSelectMode = c_oAscCellEditorSelectState.no;
		this.hasCursor = false;

		this.undoList = [];
		this.redoList = [];
		this.undoMode = false;
		this.skipKeyPress = false;
	};

	CellEditor.prototype._parseRangeStr = function (s) {
		var range = AscCommonExcel.g_oRangeCache.getActiveRange(s);
		return range ? range.clone() : null;
	};

	CellEditor.prototype._parseFormulaRanges = function () {
		var s = this._getFragmentsText( this.options.fragments ), t = this, ret = false, range,
			wsOPEN = this.handlers.trigger( "getCellFormulaEnterWSOpen" ),
			ws = wsOPEN ? wsOPEN.model : this.handlers.trigger( "getActiveWS" );

		if ( s.length < 1 || s.charAt( 0 ) !== "=" || this.options.cellNumFormat == Asc.c_oAscNumFormatType.Text ) {
			return ret;
		}

		/*function cb(ref){
		 for(var id in ref){
		 console.log(ref[id])
		 if(!ref[id].isRef) continue;

		 range = t._parseRangeStr(ref[id].ref)
		 if(range){
		 ret = true;
		 range.cursorePos = ref[id].offset;
		 range.formulaRangeLength = ref[id].length;
		 t.handlers.trigger("newRange", range);
		 }
		 }
		 }*/

//             var __s__ = new Date().getTime();
//             var parres = parserTest.parse(s,cb);
//             var __e__ = new Date().getTime();
//             console.log("e-s "+ (__e__ - __s__));

		this._formula = new AscCommonExcel.parserFormula( s.substr( 1 ), this.options.cellName, ws );
		this._formula.parse();

		var r, offset, _e, _s, wsName = null, refStr, isName = false,
			_sColorPos;

		if ( this._formula.RefPos && this._formula.RefPos.length > 0 ) {
			for ( var index = 0; index < this._formula.RefPos.length; index++ ) {
				wsName = null;
				isName = false;
				r = this._formula.RefPos[index];

				offset = r.end;
				_e = r.end;
				_sColorPos = _s = r.start;


				switch ( r.oper.type ) {
					case cElementType.cell          :
					{
						if ( wsOPEN ) {
							wsName = wsOPEN.model.getName();
						}
						ret = true;
						refStr = r.oper.value;
						break;
					}
					case cElementType.cell3D        :
					{
						ret = true;
						wsName = r.oper.ws.getName();
						_s = _e - r.oper.value.length;
						_sColorPos = _e - r.oper.toString().length;
						refStr = r.oper.value;
						break;
					}
					case cElementType.cellsRange    :
					{
						if ( wsOPEN ) {
							wsName = wsOPEN.model.getName();
						}
						ret = true;
						refStr = r.oper.value;
						break;
					}
					case cElementType.cellsRange3D  :
					{
						if ( !r.oper.isSingleSheet() ) {
							continue;
						}
						ret = true;
						refStr = r.oper.value;
						wsName = r.oper.getWS().getName();
						_s = _e - r.oper.value.length;
						_sColorPos = _e - r.oper.toString().length;
						break;
					}
					case cElementType.table          :
					case cElementType.name          :
					{
						var nameRef = r.oper.toRef();
						if( nameRef instanceof AscCommonExcel.cError ) continue;
						switch ( nameRef.type ) {

							case cElementType.cellsRange3D          :{
								if ( !nameRef.isSingleSheet() ) {
									continue;
								}
							}
							case cElementType.cellsRange          :
							case cElementType.cell3D        :
							{
								ret = true;
								refStr = nameRef.value;
								wsName = nameRef.getWS().getName();
								_s = _e - r.oper.value.length;
								break;
							}
						}
						isName = true;
						break;
					}
					default                         :
						continue;
				}

				if ( ret ) {
					range = t._parseRangeStr( refStr );
					if(!range) return false;
					range.cursorePos = offset - (_e - _s) + 1;
					range.formulaRangeLength = _e - _s;
					range.colorRangePos = offset - (_e - _sColorPos) + 1;
					range.colorRangeLength = _e - _sColorPos;
					if ( isName )range.isName = isName;
					t.handlers.trigger( "newRange", range, wsName );
				}
			}
		}
		return ret;
	};

	CellEditor.prototype._findRangeUnderCursor = function () {
		var t = this, s = t.textRender.getChars(0, t.textRender.getCharsCount()), range, arrFR = this.handlers.trigger(
			"getFormulaRanges"), a;

		for (var id = 0; id < arrFR.length; id++) {
			/*так как у нас уже есть некий массив с рейнджами, которые в формуле, то пробегаемся по ним и смотрим,
			 * находится ли курсор в позиции над этим диапазоном, дабы не парсить всю формулу заново
			 * необходимо чтобы парсить случаи когда используется что-то такое sumnas2:K2 - sumnas2 невалидная ссылка.
			 * */
			a = arrFR[id];
			if (t.cursorPos >= a.cursorePos && t.cursorPos <= a.cursorePos + a.formulaRangeLength) {
				range = a.clone(true);
				range.isName = a.isName;
				return {index: a.cursorePos, length: a.formulaRangeLength, range: range};
			}
		}

		/*не нашли диапазонов под курсором, парсим формулу*/
		var r, offset, _e, _s, wsName = null, ret = false, refStr, isName = false, _sColorPos, wsOPEN = this.handlers.trigger(
			"getCellFormulaEnterWSOpen"), ws = wsOPEN ? wsOPEN.model : this.handlers.trigger("getActiveWS");

		this._formula = new AscCommonExcel.parserFormula(s.substr(1), this.options.cellName, ws);
		this._formula.parse();

		if (this._formula.RefPos && this._formula.RefPos.length > 0) {
			for (var index = 0; index < this._formula.RefPos.length; index++) {
				wsName = null;
				r = this._formula.RefPos[index];

				offset = r.end;
				_e = r.end;
				_sColorPos = _s = r.start;

				switch (r.oper.type) {
					case cElementType.cell          : {
						if (wsOPEN) {
							wsName = wsOPEN.model.getName();
						}
						refStr = r.oper.value;
						ret = true;
						break;
					}
					case cElementType.cell3D        : {
						refStr = r.oper.value;
						ret = true;
						wsName = r.oper.ws.getName();
						_s = _e - r.oper.value.length + 1;
						_sColorPos = _e - r.oper.toString().length;
						break;
					}
					case cElementType.cellsRange    : {
						if (wsOPEN) {
							wsName = wsOPEN.model.getName();
						}
						refStr = r.oper.value;
						ret = true;
						break;
					}
					case cElementType.cellsRange3D  : {
						if (!r.oper.isSingleSheet()) {
							continue;
						}
						ret = true;
						refStr = r.oper.value;
						wsName = r.oper.getWS().getName();
						_s = _e - r.oper.value.length + 1;
						break;
					}
					case cElementType.table          :
					case cElementType.name          : {
						var nameRef = r.oper.toRef();
						if (nameRef instanceof AscCommonExcel.cError) {
							continue;
						}
						switch (nameRef.type) {

							case cElementType.cellsRange3D          : {
								if (!nameRef.isSingleSheet()) {
									continue;
								}
							}
							case cElementType.cellsRange          :
							case cElementType.cell3D        : {
								ret = true;
								refStr = nameRef.value;
								wsName = nameRef.getWS().getName();
								_s = _e - r.oper.value.length;
								break;
							}
						}
						isName = true;
						break;
					}
					default                         :
						continue;
				}

				if (ret && t.cursorPos > _s && t.cursorPos <= _s + r.oper.value.length) {
					range = t._parseRangeStr(r.oper.value);
					if (range) {
						if (this.handlers.trigger("getActiveWS") && this.handlers.trigger("getActiveWS").getName() != wsName) {
							return {index: -1, length: 0, range: null};
						}
						range.isName = isName
						return {index: _s, length: r.oper.value.length, range: range, wsName: wsName};
					}
				}
			}
		}
		range ? range.isName = isName : null;
		return !range ? {index: -1, length: 0, range: null} :
		{index: _s, length: r.oper.value.length, range: range, wsName: wsName};
	};

	CellEditor.prototype._updateFormulaEditMod = function ( bIsOpen ) {
		var isFormula = this.isFormula();
		if ( !bIsOpen ) {
			this._updateEditorState( isFormula );
		}
		this.handlers.trigger( "updateFormulaEditMod", isFormula );
		this._parseFormulaRanges();
		this.handlers.trigger( "updateFormulaEditModEnd" );
	};

	// Обновляем состояние Undo/Redo
	CellEditor.prototype._updateUndoRedoChanged = function () {
		this.handlers.trigger( "updateUndoRedoChanged", 0 < this.undoList.length, 0 < this.redoList.length );
	};

	CellEditor.prototype._haveTextInEdit = function () {
		var fragments = this.options.fragments;
		return fragments.length > 0 && fragments[0].text.length > 0;
	};

	CellEditor.prototype._updateEditorState = function ( isFormula ) {
		if ( undefined === isFormula ) {
			isFormula = this.isFormula();
		}
		var editorState = isFormula ? c_oAscCellEditorState.editFormula : "" === this._getFragmentsText( this.options.fragments ) ? c_oAscCellEditorState.editEmptyCell : c_oAscCellEditorState.editText;

		if ( this.m_nEditorState !== editorState ) {
			this.m_nEditorState = editorState;
			this.handlers.trigger( "updateEditorState", this.m_nEditorState );
		}
	};

	CellEditor.prototype._getRenderFragments = function () {
		var opt = this.options, fragments = opt.fragments, i, j, first, last, val, lengthColors, tmpColors, colorIndex, uniqueColorIndex;
		if ( this.isFormula() ) {
			var arrRanges = this.handlers.trigger( "getFormulaRanges" );
			if ( 0 < arrRanges.length ) {
				fragments = [];
				for ( i = 0; i < opt.fragments.length; ++i )
					fragments.push( opt.fragments[i].clone() );

				lengthColors = AscCommonExcel.c_oAscFormulaRangeBorderColor.length;
				tmpColors = [];
				uniqueColorIndex = 0;
				for ( i = 0; i < arrRanges.length; ++i ) {
					val = arrRanges[i];

					colorIndex = asc.getUniqueRangeColor( arrRanges, i, tmpColors );
					if ( null == colorIndex ) {
						colorIndex = uniqueColorIndex++;
					}
					tmpColors.push( colorIndex );

					this._extractFragments( val.colorRangePos, val.colorRangeLength, fragments );

					first = this._findFragment( val.cursorePos, fragments );
					last = this._findFragment( val.cursorePos + val.formulaRangeLength - 1, fragments );
					if ( first && last ) {
						for ( j = first.index; j <= last.index; ++j )
							fragments[j].format.c = AscCommonExcel.c_oAscFormulaRangeBorderColor[colorIndex % lengthColors];
					}
				}
			}
		}

		return fragments;
	};

	// Rendering

	CellEditor.prototype._draw = function () {
		var canExpW = true, canExpH = true, tm, expW, expH, fragments = this._getRenderFragments();

		if ( 0 < fragments.length ) {
			tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
			expW = tm.width > this._getContentWidth();
			expH = tm.height > this._getContentHeight();

			while ( expW && canExpW || expH && canExpH ) {
				if ( expW ) {
					canExpW = this._expandWidth();
				}
				if ( expH ) {
					canExpH = this._expandHeight();
				}

				if ( !canExpW ) {
					this.textFlags.wrapText = true;
					tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
				}
				else {
					tm = this.textRender.measure( this._getContentWidth() );
				}
				expW = tm.width > this._getContentWidth();
				expH = tm.height > this._getContentHeight();
			}
		}

		this._cleanText();
		this._cleanSelection();
		this._adjustCanvas();
		this._showCanvas();
		this._renderText();
		this.input.value = this._getFragmentsText( fragments );
		this._updateCursorPosition();
		this._showCursor();
	};

	CellEditor.prototype._update = function () {
		this._updateFormulaEditMod( /*bIsOpen*/false );

		var tm, canExpW, canExpH, oldLC, doAjust = false, fragments = this._getRenderFragments();

		if ( 0 < fragments.length ) {
			oldLC = this.textRender.getLinesCount();
			tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
			if ( this.textRender.getLinesCount() < oldLC ) {
				this.topLineIndex -= oldLC - this.textRender.getLinesCount();
			}

			canExpW = !this.textFlags.wrapText;
			while ( tm.width > this._getContentWidth() && canExpW ) {
				canExpW = this._expandWidth();
				if ( !canExpW ) {
					this.textFlags.wrapText = true;
					tm = this.textRender.measureString( fragments, this.textFlags, this._getContentWidth() );
				}
				doAjust = true;
			}

			canExpH = true;
			while ( tm.height > this._getContentHeight() && canExpH ) {
				canExpH = this._expandHeight();
				doAjust = true;
			}
			if ( this.textRender.isLastCharNL() && !doAjust && canExpH ) {
				var lm = this.textRender.calcCharHeight( this.textRender.getCharsCount() - 1 );
				if ( tm.height + lm.th > this._getContentHeight() ) {
					this._expandHeight();
					doAjust = true;
				}
			}
		}
		if ( doAjust ) {
			this._adjustCanvas();
		}

		this._renderText();  // вызов нужен для пересчета поля line.startX, которое используется в _updateCursorPosition
		this._fireUpdated(); // вызов нужен для обновление текста верхней строки, перед обновлением позиции курсора
		this._updateCursorPosition( true );
		this._showCursor();

		this._updateUndoRedoChanged();

		if ( window['IS_NATIVE_EDITOR'] && !this.dontUpdateText ) {
			window['native'].onCellEditorChangeText( this._getFragmentsText( this.options.fragments ) );
		}
	};

	CellEditor.prototype._fireUpdated = function () {
		var t = this;
		var s = t._getFragmentsText( t.options.fragments );
		var isFormula = s.charAt( 0 ) === "=";
		var funcPos, funcName, match;

		if ( !t.isTopLineActive || !t.skipTLUpdate || t.undoMode ) {
			t.input.value = s;
		}

		if ( isFormula ) {
			funcPos = asc_lastidx( s, t.reNotFormula, t.cursorPos ) + 1;
			if ( funcPos > 0 ) {
				match = s.slice( funcPos, t.cursorPos ).match( t.reFormula );
			}
			if ( match ) {
				funcName = match[1];
			}
			else {
				funcPos = undefined;
				funcName = undefined;
			}
		}

		t.handlers.trigger( "updated", s, t.cursorPos, isFormula, funcPos, funcName );
	};

	CellEditor.prototype._expandWidth = function () {
		var t = this, l = false, r = false, leftSide = this.sides.l, rightSide = this.sides.r;

		function expandLeftSide() {
			var i = asc_search( leftSide, function ( v ) {
				return v < t.left;
			} );
			if ( i >= 0 ) {
				t.left = leftSide[i];
				return true;
			}
			var val = leftSide[leftSide.length - 1];
			if ( Math.abs( t.left - val ) > 0.000001 ) { // left !== leftSide[len-1]
				t.left = val;
			}
			return false;
		}

		function expandRightSide() {
			var i = asc_search( rightSide, function ( v ) {
				return v > t.right;
			} );
			if ( i >= 0 ) {
				t.right = rightSide[i];
				return true;
			}
			var val = rightSide[rightSide.length - 1];
			if ( Math.abs( t.right - val ) > 0.000001 ) { // right !== rightSide[len-1]
				t.right = val;
			}
			return false;
		}

		switch ( t.textFlags.textAlign ) {
			case kRightAlign:
				r = expandLeftSide();
				break;
			case kCenterAlign:
				l = expandLeftSide();
				r = expandRightSide();
				break;
			case kLeftAlign:
			default:
				r = expandRightSide();
		}
		return l || r;
	};

	CellEditor.prototype._expandHeight = function () {
		var t = this, bottomSide = this.sides.b, i = asc_search( bottomSide, function ( v ) {
			return v > t.bottom;
		} );
		if ( i >= 0 ) {
			t.bottom = bottomSide[i];
			return true;
		}
		var val = bottomSide[bottomSide.length - 1];
		if ( Math.abs( t.bottom - val ) > 0.000001 ) { // bottom !== bottomSide[len-1]
			t.bottom = val;
		}
		return false;
	};

	CellEditor.prototype._cleanText = function () {
		this.drawingCtx.clear();
	};

	CellEditor.prototype._showCanvas = function () {
		this.canvasOuterStyle.display = 'block';
	};
	CellEditor.prototype._hideCanvas = function () {
		this.canvasOuterStyle.display = 'none';
	};

	CellEditor.prototype._adjustCanvas = function () {
		var z = this.defaults.canvasZIndex;
		var left = this.left * this.kx;
		var top = this.top * this.ky;
		var widthStyle = (this.right - this.left) * this.kx - 1; // ToDo разобраться с '-1'
		var heightStyle = (this.bottom - this.top) * this.ky - 1;
		var isRetina = AscBrowser.isRetina;
		var width = widthStyle, height = heightStyle;

		if ( isRetina ) {
			left >>= 1;
			top >>= 1;

			widthStyle >>= 1;
			heightStyle >>= 1;

			width = widthStyle << 1;
			height = heightStyle << 1;
		}

		this.canvasOuterStyle.left = left + 'px';
		this.canvasOuterStyle.top = top + 'px';
		this.canvasOuterStyle.width = widthStyle + 'px';
		this.canvasOuterStyle.height = heightStyle + 'px';
		this.canvasOuterStyle.zIndex = this.top <= 0 ? -1 : z;

		this.canvas.width = this.canvasOverlay.width = width;
		this.canvas.height = this.canvasOverlay.height = height;
		if ( isRetina ) {
			this.canvas.style.width = this.canvasOverlay.style.width = widthStyle + 'px';
			this.canvas.style.height = this.canvasOverlay.style.height = heightStyle + 'px';
		}
	};

	CellEditor.prototype._renderText = function ( dy ) {
		var t = this, opt = t.options, ctx = t.drawingCtx;

		if ( !window['IS_NATIVE_EDITOR'] ) {
			ctx.setFillStyle( opt.background )
				.fillRect( 0, 0, ctx.getWidth(), ctx.getHeight() );
		}

		if ( opt.fragments.length > 0 ) {
			t.textRender.render( t._getContentLeft(), (dy === undefined ? 0 : dy), t._getContentWidth(), opt.textColor );
		}
	};

	CellEditor.prototype._cleanSelection = function () {
		this.overlayCtx.clear();
	};

	CellEditor.prototype._drawSelection = function () {
		var ctx = this.overlayCtx, ppix = ctx.getPPIX(), ppiy = ctx.getPPIY();
		var begPos, endPos, top, top1, top2, begInfo, endInfo, line1, line2, i, selection = [];

		function drawRect( x, y, w, h ) {
			if ( window['IS_NATIVE_EDITOR'] ) {
				selection.push( [asc_calcnpt( x, ppix ), asc_calcnpt( y, ppiy ), asc_calcnpt( w, ppix ), asc_calcnpt( h, ppiy )] );
			}
			else {
				ctx.fillRect( asc_calcnpt( x, ppix ), asc_calcnpt( y, ppiy ), asc_calcnpt( w, ppix ), asc_calcnpt( h, ppiy ) );
			}
		}

		begPos = this.selectionBegin;
		endPos = this.selectionEnd;

		if ( !window['IS_NATIVE_EDITOR'] ) {
			ctx.setFillStyle( this.defaults.selectColor ).clear();
		}

		if ( begPos !== endPos && !this.isTopLineActive ) {
			top = this.textRender.calcLineOffset( this.topLineIndex );
			begInfo = this.textRender.calcCharOffset( Math.min( begPos, endPos ) );
			line1 = this.textRender.getLineInfo( begInfo.lineIndex );
			top1 = this.textRender.calcLineOffset( begInfo.lineIndex );
			endInfo = this.textRender.calcCharOffset( Math.max( begPos, endPos ) );
			if ( begInfo.lineIndex === endInfo.lineIndex ) {
				drawRect( begInfo.left, top1 - top, endInfo.left - begInfo.left, line1.th );
			}
			else {
				line2 = this.textRender.getLineInfo( endInfo.lineIndex );
				top2 = this.textRender.calcLineOffset( endInfo.lineIndex );
				drawRect( begInfo.left, top1 - top, line1.tw - begInfo.left + line1.startX, line1.th );
				if ( line2 ) {
					drawRect( line2.startX, top2 - top, endInfo.left - line2.startX, line2.th );
				}
				top = top1 - top + line1.th;
				for ( i = begInfo.lineIndex + 1; i < endInfo.lineIndex; ++i, top += line1.th ) {
					line1 = this.textRender.getLineInfo( i );
					drawRect( line1.startX, top, line1.tw, line1.th );
				}
			}
		}

		return selection;
	};

	// Cursor

	CellEditor.prototype.showCursor = function () {
		if ( window['IS_NATIVE_EDITOR'] ) {
			return;
		}

		if ( !this.options ) {
			this.options = {};
		}
		this.options.isHideCursor = false;
		this._showCursor();
	};

	CellEditor.prototype._showCursor = function () {
		if ( window['IS_NATIVE_EDITOR'] ) {
			return;
		}

		var t = this;
		if ( true === t.options.isHideCursor || t.isTopLineActive === true ) {
			return;
		}
		window.clearInterval( t.cursorTID );
		t.cursorStyle.display = "block";
		t.cursorTID = window.setInterval( function () {
			t.cursorStyle.display = ("none" === t.cursorStyle.display) ? "block" : "none";
		}, t.defaults.blinkInterval );
	};

	CellEditor.prototype._hideCursor = function () {
		if ( window['IS_NATIVE_EDITOR'] ) {
			return;
		}

		var t = this;
		window.clearInterval( t.cursorTID );
		t.cursorStyle.display = "none";
	};

	CellEditor.prototype._updateCursorPosition = function (redrawText) {
		// ToDo стоит переправить данную функцию
		var h = this.canvas.height;
		var y = -this.textRender.calcLineOffset(this.topLineIndex);
		var cur = this.textRender.calcCharOffset(this.cursorPos);
		var charsCount = this.textRender.getCharsCount();
		var curLeft = asc_round(
			((kRightAlign !== this.textFlags.textAlign || this.cursorPos !== charsCount) && cur !== null &&
			cur.left !== null ? cur.left : this._getContentPosition()) * this.kx);
		var curTop = asc_round(((cur !== null ? cur.top : 0) + y) * this.ky);
		var curHeight = asc_round((cur !== null ? cur.height : this._getContentHeight()) * this.ky);
		var i, dy, nCount = this.textRender.getLinesCount();

		while (1 < nCount) {
			if (curTop + curHeight - 1 > h) {
				i = i === undefined ? 0 : i + 1;
				if (i === nCount) {
					break;
				}
				dy = this.textRender.getLineInfo(i).th;
				y -= dy;
				curTop -= asc_round(dy * this.ky);
				++this.topLineIndex;
				continue;
			}
			if (curTop < 0) {
				--this.topLineIndex;
				dy = this.textRender.getLineInfo(this.topLineIndex).th;
				y += dy;
				curTop += asc_round(dy * this.ky);
				continue;
			}
			break;
		}

		if (dy !== undefined || redrawText) {
			this._renderText(y);
		}

		if (AscBrowser.isRetina) {
			curLeft >>= 1;
			curTop >>= 1;
		}


		if (window['IS_NATIVE_EDITOR']) {
			this.curLeft = curLeft;
			this.curTop = curTop;
			this.curHeight = curHeight;
		} else {
			this.cursorStyle.left = curLeft + "px";
			this.cursorStyle.top = curTop + "px";
			this.cursorStyle.height = curHeight + "px";
		}

		if (AscCommon.g_inputContext) {
			AscCommon.g_inputContext.move(this.left * this.kx + curLeft, this.top * this.ky + curTop);
		}

		if (cur) {
			this.input.scrollTop = this.input.clientHeight * cur.lineIndex;
		}
		if (this.isTopLineActive && !this.skipTLUpdate) {
			this._updateTopLineCurPos();
		}
		this._updateSelectionInfo();
	};

	CellEditor.prototype._moveCursor = function (kind, pos) {
		var t = this;
		switch (kind) {
			case kPrevChar:
				t.cursorPos = t.textRender.getPrevChar(t.cursorPos);
				break;
			case kNextChar:
				t.cursorPos = t.textRender.getNextChar(t.cursorPos);
				break;
			case kPrevWord:
				t.cursorPos = t.textRender.getPrevWord(t.cursorPos);
				break;
			case kNextWord:
				t.cursorPos = t.textRender.getNextWord(t.cursorPos);
				break;
			case kBeginOfLine:
				t.cursorPos = t.textRender.getBeginOfLine(t.cursorPos);
				break;
			case kEndOfLine:
				t.cursorPos = t.textRender.getEndOfLine(t.cursorPos);
				break;
			case kBeginOfText:
				t.cursorPos = t.textRender.getBeginOfText(t.cursorPos);
				break;
			case kEndOfText:
				t.cursorPos = t.textRender.getEndOfText(t.cursorPos);
				break;
			case kPrevLine:
				t.cursorPos = t.textRender.getPrevLine(t.cursorPos);
				break;
			case kNextLine:
				t.cursorPos = t.textRender.getNextLine(t.cursorPos);
				break;
			case kPosition:
				t.cursorPos = pos;
				break;
			case kPositionLength:
				t.cursorPos += pos;
				break;
			default:
				return;
		}
		if (t.selectionBegin !== t.selectionEnd) {
			t.selectionBegin = t.selectionEnd = -1;
			t._cleanSelection();
		}
		t._updateCursorPosition();
		t._showCursor();
	};

	CellEditor.prototype._findCursorPosition = function ( coord ) {
		var t = this;
		var lc = t.textRender.getLinesCount();
		var i, h, w, li, chw;
		for ( h = 0, i = Math.max( t.topLineIndex, 0 ); i < lc; ++i ) {
			li = t.textRender.getLineInfo( i );
			h += li.th;
			if ( coord.y <= h ) {
				for ( w = li.startX, i = li.beg; i <= li.end; ++i ) {
					chw = t.textRender.getCharWidth( i );
					if ( coord.x <= w + chw ) {
						return coord.x <= w + chw / 2 ? i : i + 1 > li.end ? kEndOfLine : i + 1;
					}
					w += chw;
				}
				return i < t.textRender.getCharsCount() ? i - 1 : kEndOfText;
			}
		}
		return kNextLine;
	};

	CellEditor.prototype._updateTopLineCurPos = function () {
		var t = this;
		var isSelected = t.selectionBegin !== t.selectionEnd;
		var b = isSelected ? t.selectionBegin : t.cursorPos;
		var e = isSelected ? t.selectionEnd : t.cursorPos;
		if ( t.input.setSelectionRange ) {
			t.input.setSelectionRange( Math.min( b, e ), Math.max( b, e ) );
		}
	};

	CellEditor.prototype._topLineGotFocus = function () {
		var t = this;
		t.isTopLineActive = true;
		t.input.isFocused = true;
		t.setFocus(true);
		t._hideCursor();
		t._updateTopLineCurPos();
		t._cleanSelection();
	};

	CellEditor.prototype._topLineMouseUp = function () {
		var t = this;
		this.callTopLineMouseup = false;
		// при такой комбинации ctrl+a, click, ctrl+a, click не обновляется selectionStart
		// поэтому выполняем обработку после обработчика системы
		setTimeout(function () {
			var b = t.input.selectionStart;
			var e = t.input.selectionEnd;
			if (typeof b !== "undefined") {
				if (t.cursorPos !== b || t.selectionBegin !== t.selectionEnd) {
					t._moveCursor(kPosition, b);
				}
				if (b !== e) {
					t._selectChars(kPosition, e);
				}
			}
		});
	};

	CellEditor.prototype._syncEditors = function () {
		var t = this;
		var s1 = t._getFragmentsText(t.options.fragments);
		var s2 = t.input.value;
		var l = Math.min(s1.length, s2.length);
		var i1 = 0, i2 = 0;

		while (i1 < l && s1.charAt(i1) === s2.charAt(i1)) {
			++i1;
		}
		i2 = i1 + 1;
		if (i2 >= l) {
			i2 = Math.max(s1.length, s2.length);
		} else {
			while (i2 < l && s1.charAt(i1) !== s2.charAt(i2)) {
				++i2;
			}
		}

		t._addChars(s2.slice(i1, i2), i1);
	};

	// Content

	CellEditor.prototype._getContentLeft = function () {
		return asc_calcnpt( 0, this.drawingCtx.getPPIX(), this.defaults.padding/*px*/ );
	};

	CellEditor.prototype._getContentWidth = function () {
		return this.right - this.left - asc_calcnpt( 0, this.drawingCtx.getPPIX(), this.defaults.padding + this.defaults.padding + 1/*px*/ );
	};

	CellEditor.prototype._getContentHeight = function () {
		var t = this;
		return t.bottom - t.top;
	};

	CellEditor.prototype._getContentPosition = function () {
		var ppix = this.drawingCtx.getPPIX();

		switch ( this.textFlags.textAlign ) {
			case kRightAlign:
				return asc_calcnpt( this.right - this.left, ppix, -this.defaults.padding - 1 );
			case kCenterAlign:
				return asc_calcnpt( 0.5 * (this.right - this.left), ppix, 0 );
		}
		return asc_calcnpt( 0, ppix, this.defaults.padding );
	};

	CellEditor.prototype._wrapText = function () {
		this.textFlags.wrapOnlyNL = true;
	};

	CellEditor.prototype._addChars = function (str, pos, isRange) {
		var opt = this.options, f, l, s, length = str.length;

		if (!this._checkMaxCellLength(length)) {
			return false;
		}

		this.dontUpdateText = true;

		if (this.selectionBegin !== this.selectionEnd) {
			var copyFragment = this._findFragmentToInsertInto(Math.min(this.selectionBegin, this.selectionEnd) + 1);
			if (copyFragment && !this.newTextFormat) {
				this.newTextFormat = opt.fragments[copyFragment.index].format.clone();
			}

			this._removeChars(undefined, undefined, isRange);
		}

		this.dontUpdateText = false;

		if (pos === undefined) {
			pos = this.cursorPos;
		}

		if (!this.undoMode) {
			// save info to undo/redo
			this.undoList.push({fn: this._removeChars, args: [pos, length], isRange: isRange});
			this.redoList = [];
		}

		if (this.newTextFormat) {
			var oNewObj = new Fragment({format: this.newTextFormat, text: str});
			this._addFragments([oNewObj], pos);
			this.newTextFormat = null;
		} else {
			f = this._findFragmentToInsertInto(pos);
			if (f) {
				l = pos - f.begin;
				s = opt.fragments[f.index].text;
				opt.fragments[f.index].text = s.slice(0, l) + str + s.slice(l);
			}
		}

		this.cursorPos = pos + str.length;
		if (!this.noUpdateMode) {
			this._update();
		}
	};

	CellEditor.prototype._addNewLine = function () {
		this._wrapText();
		this._addChars( kNewLine );
	};

	CellEditor.prototype._removeChars = function (pos, length, isRange) {
		var t = this, opt = t.options, b, e, l, first, last;

		if (t.selectionBegin !== t.selectionEnd) {
			b = Math.min(t.selectionBegin, t.selectionEnd);
			e = Math.max(t.selectionBegin, t.selectionEnd);
			t.selectionBegin = t.selectionEnd = -1;
			t._cleanSelection();
		} else if (length === undefined) {
			switch (pos) {
				case kPrevChar:
					b = t.textRender.getPrevChar(t.cursorPos);
					e = t.cursorPos;
					break;
				case kNextChar:
					b = t.cursorPos;
					e = t.textRender.getNextChar(t.cursorPos);
					break;
				case kPrevWord:
					b = t.textRender.getPrevWord(t.cursorPos);
					e = t.cursorPos;
					break;
				case kNextWord:
					b = t.cursorPos;
					e = t.textRender.getNextWord(t.cursorPos);
					break;
				default:
					return;
			}
		} else {
			b = pos;
			e = pos + length;
		}

		if (b === e) {
			return;
		}

		// search for begin and end positions
		first = t._findFragment(b);
		last = t._findFragment(e - 1);

		if (!t.undoMode) {
			// save info to undo/redo
			if (e - b < 2 && opt.fragments[first.index].text.length > 1) {
				t.undoList.push({fn: t._addChars, args: [t.textRender.getChars(b, 1), b], isRange: isRange});
			} else {
				t.undoList.push({fn: t._addFragments, args: [t._getFragments(b, e - b), b], isRange: isRange});
			}
			t.redoList = [];
		}

		if (first && last) {
			// remove chars
			if (first.index === last.index) {
				l = opt.fragments[first.index].text;
				opt.fragments[first.index].text = l.slice(0, b - first.begin) + l.slice(e - first.begin);
			} else {
				opt.fragments[first.index].text = opt.fragments[first.index].text.slice(0, b - first.begin);
				opt.fragments[last.index].text = opt.fragments[last.index].text.slice(e - last.begin);
				l = last.index - first.index;
				if (l > 1) {
					opt.fragments.splice(first.index + 1, l - 1);
				}
			}
			// merge fragments with equal formats
			t._mergeFragments();
		}

		t.cursorPos = b;
		if (!t.noUpdateMode) {
			t._update();
		}
	};

	CellEditor.prototype._selectChars = function (kind, pos) {
		var t = this;
		var begPos, endPos;

		begPos = t.selectionBegin === t.selectionEnd ? t.cursorPos : t.selectionBegin;
		t._moveCursor(kind, pos);
		endPos = t.cursorPos;

		t.selectionBegin = begPos;
		t.selectionEnd = endPos;
		t._drawSelection();
		if (t.isTopLineActive && !t.skipTLUpdate) {
			t._updateTopLineCurPos();
		}
	};

	CellEditor.prototype._changeSelection = function (coord) {
		var t = this;

		function doChangeSelection(coordTmp) {
			// ToDo реализовать для слова.
			if (c_oAscCellEditorSelectState.word === t.isSelectMode) {
				return;
			}
			var pos = t._findCursorPosition(coordTmp);
			if (pos !== undefined) {
				pos >= 0 ? t._selectChars(kPosition, pos) : t._selectChars(pos);
			}
		}

		if (window['IS_NATIVE_EDITOR']) {
			doChangeSelection(coord);
		} else {
			window.clearTimeout(t.selectionTimer);
			t.selectionTimer = window.setTimeout(function () {
				doChangeSelection(coord);
			}, 0);
		}
	};

	CellEditor.prototype._findFragment = function ( pos, fragments ) {
		var i, begin, end;
		if ( !fragments ) {
			fragments = this.options.fragments;
		}

		for ( i = 0, begin = 0; i < fragments.length; ++i ) {
			end = begin + fragments[i].text.length;
			if ( pos >= begin && pos < end ) {
				return {index: i, begin: begin, end: end};
			}
			if ( i < fragments.length - 1 ) {
				begin = end;
			}
		}
		return pos === end ? {index: i - 1, begin: begin, end: end} : undefined;
	};

	CellEditor.prototype._findFragmentToInsertInto = function ( pos ) {
		var opt = this.options, i, begin, end;

		for ( i = 0, begin = 0; i < opt.fragments.length; ++i ) {
			end = begin + opt.fragments[i].text.length;
			if ( pos >= begin && pos <= end ) {
				return {index: i, begin: begin, end: end};
			}
			if ( i < opt.fragments.length - 1 ) {
				begin = end;
			}
		}
		return undefined;
	};

	CellEditor.prototype._isWholeFragment = function ( pos, len ) {
		var fr = this._findFragment( pos );
		return fr && pos === fr.begin && len === fr.end - fr.begin;
	};

	CellEditor.prototype._splitFragment = function ( f, pos, fragments ) {
		var fr;
		if ( !fragments ) {
			fragments = this.options.fragments;
		}

		if ( pos > f.begin && pos < f.end ) {
			fr = fragments[f.index];
			Array.prototype.splice.apply( fragments, [f.index, 1].concat( [new Fragment( {
				format: fr.format.clone(), text: fr.text.slice( 0, pos - f.begin )
			} ), new Fragment( {format: fr.format.clone(), text: fr.text.slice( pos - f.begin )} )] ) );
		}
	};

	CellEditor.prototype._getFragments = function ( startPos, length ) {
		var t = this, opt = t.options, endPos = startPos + length - 1, res = [], fr, i;
		var first = t._findFragment( startPos );
		var last = t._findFragment( endPos );

		if ( !first || !last ) {
			throw "Can not extract fragment of text";
		}

		if ( first.index === last.index ) {
			fr = opt.fragments[first.index].clone();
			fr.text = fr.text.slice( startPos - first.begin, endPos - first.begin + 1 );
			res.push( fr );
		}
		else {
			fr = opt.fragments[first.index].clone();
			fr.text = fr.text.slice( startPos - first.begin );
			res.push( fr );
			for ( i = first.index + 1; i < last.index; ++i ) {
				fr = opt.fragments[i].clone();
				res.push( fr );
			}
			fr = opt.fragments[last.index].clone();
			fr.text = fr.text.slice( 0, endPos - last.begin + 1 );
			res.push( fr );
		}

		return res;
	};

	CellEditor.prototype._extractFragments = function ( startPos, length, fragments ) {
		var fr;

		fr = this._findFragment( startPos, fragments );
		if ( !fr ) {
			throw "Can not extract fragment of text";
		}
		this._splitFragment( fr, startPos, fragments );

		fr = this._findFragment( startPos + length, fragments );
		if ( !fr ) {
			throw "Can not extract fragment of text";
		}
		this._splitFragment( fr, startPos + length, fragments );
	};

	CellEditor.prototype._addFragments = function ( f, pos ) {
		var t = this, opt = t.options, fr;

		fr = t._findFragment( pos );
		if ( fr && pos < fr.end ) {
			t._splitFragment( fr, pos );
			fr = t._findFragment( pos );
			Array.prototype.splice.apply( opt.fragments, [fr.index, 0].concat( f ) );
		}
		else {
			opt.fragments = opt.fragments.concat( f );
		}

		// merge fragments with equal formats
		t._mergeFragments();

		t.cursorPos = pos + t._getFragmentsLength( f );
		if ( !t.noUpdateMode ) {
			t._update();
		}
	};

	CellEditor.prototype._mergeFragments = function () {
		var t = this, opt = t.options, i;

		for (i = 0; i < opt.fragments.length;) {
			if (opt.fragments[i].text.length < 1 && opt.fragments.length > 1) {
				opt.fragments.splice(i, 1);
				continue;
			}
			if (i < opt.fragments.length - 1) {
				var fr = opt.fragments[i];
				var nextFr = opt.fragments[i + 1];
				if (fr.format.isEqual(nextFr.format)) {
					opt.fragments.splice(i, 2, new Fragment({format: fr.format, text: fr.text + nextFr.text}));
					continue;
				}
			}
			++i;
		}
	};

	CellEditor.prototype._cleanFragments = function (fr) {
		var t = this, i, s, f, wrap = t.textFlags.wrapText || t.textFlags.wrapOnlyNL;

		for (i = 0; i < fr.length; ++i) {
			s = fr[i].text;
			if (!wrap && -1 !== s.indexOf(kNewLine)) {
				this._wrapText();
			}
			fr[i].text = s;
			f = fr[i].format;
			if (f.fn === "") {
				f.fn = t.options.font.FontFamily.Name;
			}
			if (f.fs === 0) {
				f.fs = t.options.font.FontSize;
			}
		}
	};

	CellEditor.prototype._getFragmentsLength = function ( f ) {
		return f.length > 0 ? f.reduce( function ( pv, cv ) {
			return pv + cv.text.length;
		}, 0 ) : 0;
	};

	CellEditor.prototype._getFragmentsText = function ( f ) {
		return f.length > 0 ? f.reduce( function ( pv, cv ) {
			return pv + cv.text;
		}, "" ) : "";
	};

	CellEditor.prototype._setFormatProperty = function (format, prop, val) {
		switch (prop) {
			case "fn":
				format.fn = val;
				format.scheme = Asc.EFontScheme.fontschemeNone;
				break;
			case "fs":
				format.fs = val;
				break;
			case "b":
				val = (null === val) ? ((format.b) ? !format.b : true) : val;
				format.b = val;
				break;
			case "i":
				val = (null === val) ? ((format.i) ? !format.i : true) : val;
				format.i = val;
				break;
			case "u":
				val = (null === val) ? ((Asc.EUnderline.underlineSingle !== format.u) ? Asc.EUnderline.underlineSingle :
					Asc.EUnderline.underlineNone) : val;
				format.u = val;
				break;
			case "s":
				val = (null === val) ? ((format.s) ? !format.s : true) : val;
				format.s = val;
				break;
			case "fa":
				format.va = val;
				break;
			case "c":
				format.c = val;
				break;
			case "changeFontSize":
				var newFontSize = asc_incDecFonSize(val, format.fs);
				if (null !== newFontSize) {
					format.fs = newFontSize;
				}
				break;
		}
		return val;
	};

	CellEditor.prototype._performAction = function ( list1, list2 ) {
		var t = this, action, str, pos, len;

		if ( list1.length < 1 ) {
			return;
		}

		action = list1.pop();

		if ( action.fn === t._removeChars ) {
			pos = action.args[0];
			len = action.args[1];
			if ( len < 2 && !t._isWholeFragment( pos, len ) ) {
				list2.push( {fn: t._addChars, args: [t.textRender.getChars( pos, len ), pos], isRange: action.isRange} );
			}
			else {
				list2.push( {fn: t._addFragments, args: [t._getFragments( pos, len ), pos], isRange: action.isRange} );
			}
		}
		else if ( action.fn === t._addChars ) {
			str = action.args[0];
			pos = action.args[1];
			list2.push( {fn: t._removeChars, args: [pos, str.length], isRange: action.isRange} );
		}
		else if ( action.fn === t._addFragments ) {
			pos = action.args[1];
			len = t._getFragmentsLength( action.args[0] );
			list2.push( {fn: t._removeChars, args: [pos, len], isRange: action.isRange} );
		}
		else {
			return;
		}

		t.undoMode = true;
		if ( t.selectionBegin !== t.selectionEnd ) {
			t.selectionBegin = t.selectionEnd = -1;
			t._cleanSelection();
		}
		action.fn.apply( t, action.args );
		t.undoMode = false;
	};

	CellEditor.prototype._tryCloseEditor = function (event) {
		if (this.close(true)) {
			this.handlers.trigger("applyCloseEvent", event);
		}
	};

	CellEditor.prototype._getAutoComplete = function ( str ) {
		// ToDo можно ускорить делая поиск каждый раз не в большом массиве, а в уменьшенном (по предыдущим символам)
		var oLastResult = this.objAutoComplete[str];
		if ( oLastResult ) {
			return oLastResult;
		}

		var arrAutoComplete = this.options.autoComplete;
		var arrAutoCompleteLC = this.options.autoCompleteLC;
		var i, length, arrResult = [];
		for ( i = 0, length = arrAutoCompleteLC.length; i < length; ++i ) {
			if ( 0 === arrAutoCompleteLC[i].indexOf( str ) ) {
				arrResult.push( arrAutoComplete[i] );
			}
		}
		return this.objAutoComplete[str] = arrResult;
	};

	CellEditor.prototype._updateSelectionInfo = function () {
		var tmp = this.cursorPos;
		tmp = this._findFragmentToInsertInto( tmp );
		if ( !tmp ) {
			return;
		}
		tmp = this.options.fragments[tmp.index].format;

		var result = new AscCommonExcel.asc_CFont();
		result.name = tmp.fn;
		result.size = tmp.fs;
		result.bold = tmp.b;
		result.italic = tmp.i;
		result.underline = (Asc.EUnderline.underlineNone !== tmp.u); // ToDo убрать, когда будет реализовано двойное подчеркивание
		result.strikeout = tmp.s;
		result.subscript = tmp.va === "subscript";
		result.superscript = tmp.va === "superscript";
		result.color = (tmp.c ? asc.colorObjToAscColor( tmp.c ) : new Asc.asc_CColor( this.options.textColor ));

		this.handlers.trigger( "updateEditorSelectionInfo", result );
	};

	CellEditor.prototype._checkMaxCellLength = function ( length ) {
		var newLength = this._getFragmentsLength( this.options.fragments ) + length;
		// Ограничение на ввод
		if ( newLength > Asc.c_oAscMaxCellOrCommentLength ) {
			if ( this.selectionBegin === this.selectionEnd ) {
				return false;
			}

			var b = Math.min( this.selectionBegin, this.selectionEnd );
			var e = Math.max( this.selectionBegin, this.selectionEnd );
			if ( newLength - this._getFragmentsLength( this._getFragments( b, e - b ) ) > Asc.c_oAscMaxCellOrCommentLength ) {
				return false;
			}
		}
		return true;
	};

	// Event handlers

	/**
	 *
	 * @param event {KeyboardEvent}
	 * @param isInput {boolean}
	 * @returns {boolean}
	 */
	CellEditor.prototype._onWindowKeyDown = function (event, isInput) {
		var t = this, kind = undefined, hieroglyph = false;
		var ctrlKey = event.metaKey || event.ctrlKey;

		if (!t.isOpened || (!isInput && !t.enableKeyEvents)) {
			return true;
		}

		// для исправления Bug 15902 - Alt забирает фокус из приложения
		if (event.which === 18) {
			t.lastKeyCode = event.which;
		}

		t.skipKeyPress = true;
		t.skipTLUpdate = false;

		// определение ввода иероглифов
		if (t.isTopLineActive && t._getFragmentsLength(t.options.fragments) !== t.input.value.length) {
			hieroglyph = true;
		}

		switch (event.which) {

			case 27:  // "esc"
				if (t.handlers.trigger("isGlobalLockEditCell")) {
					return false;
				}
				t.close();
				event.stopPropagation();
				event.preventDefault();
				return false;

			case 13:  // "enter"
				if (window['IS_NATIVE_EDITOR']) {
					t._addNewLine();
				} else {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					if (!(event.altKey && event.shiftKey)) {
						if (event.altKey) {
							t._addNewLine();
						} else {
							if (false === t.handlers.trigger("isGlobalLockEditCell")) {
								t._tryCloseEditor(event);
							}
						}
					}
				}
				event.stopPropagation();
				event.preventDefault();
				return false;

			case 9: // tab
				if (!t.hasFocus) {
					t.setFocus(true);
				}
				if (hieroglyph) {
					t._syncEditors();
				}

				if (false === t.handlers.trigger("isGlobalLockEditCell")) {
					t._tryCloseEditor(event);
				}
				return false;

			case 8:   // "backspace"
				if (!this.enableKeyEvents) {
					break;
				}

				if (window['IS_NATIVE_EDITOR']) {
					t._removeChars(ctrlKey ? kPrevWord : kPrevChar);
				} else {
					// Отключим стандартную обработку браузера нажатия backspace
					event.stopPropagation();
					event.preventDefault();
					if (hieroglyph) {
						t._syncEditors();
					}
					t._removeChars(ctrlKey ? kPrevWord : kPrevChar);
				}
				return false;

			case 46:  // "del"
				if (!this.enableKeyEvents) {
					break;
				}

				if (!t.hasFocus) {
					t.setFocus(true);
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				event.stopPropagation();
				event.preventDefault();
				t._removeChars(ctrlKey ? kNextWord : kNextChar);
				return true;

			case 37:  // "left"
				if (!this.enableKeyEvents) {
					break;
				}

				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				kind = ctrlKey ? kPrevWord : kPrevChar;
				event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
				return false;

			case 39:  // "right"
				if (!this.enableKeyEvents) {
					break;
				}

				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				kind = ctrlKey ? kNextWord : kNextChar;
				event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
				return false;

			case 38:  // "up"
				if (!this.enableKeyEvents) {
					break;
				}

				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				event.shiftKey ? t._selectChars(kPrevLine) : t._moveCursor(kPrevLine);
				return false;

			case 40:  // "down"
				if (!this.enableKeyEvents) {
					break;
				}

				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				event.shiftKey ? t._selectChars(kNextLine) : t._moveCursor(kNextLine);
				return false;

			case 35:  // "end"
				if (!this.enableKeyEvents) {
					break;
				}

				// Отключим стандартную обработку браузера нажатия end
				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				kind = ctrlKey ? kEndOfText : kEndOfLine;
				event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
				return false;

			case 36:  // "home"
				if (!this.enableKeyEvents) {
					break;
				}

				// Отключим стандартную обработку браузера нажатия home
				event.stopPropagation();
				event.preventDefault();
				if (!t.hasFocus) {
					break;
				}
				if (hieroglyph) {
					t._syncEditors();
				}
				kind = ctrlKey ? kBeginOfText : kBeginOfLine;
				event.shiftKey ? t._selectChars(kind) : t._moveCursor(kind);
				return false;

			case 53: // 5
				if (ctrlKey) {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					// Отключим стандартную обработку браузера нажатия ctrl + 5
					event.stopPropagation();
					event.preventDefault();
					if (hieroglyph) {
						t._syncEditors();
					}
					t.setTextStyle("s", null);
					return true;
				}
				break;

			case 65: // A
				if (ctrlKey) {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					// Отключим стандартную обработку браузера нажатия ctrl + a
					if (!t.isTopLineActive) {
						event.stopPropagation();
						event.preventDefault();
					}
					t._moveCursor(kBeginOfText);
					t._selectChars(kEndOfText);
					return true;
				}
				break;

			case 66: // B
				if (ctrlKey) {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					// Отключим стандартную обработку браузера нажатия ctrl + b
					event.stopPropagation();
					event.preventDefault();
					if (hieroglyph) {
						t._syncEditors();
					}
					t.setTextStyle("b", null);
					return true;
				}
				break;

			case 73: // I
				if (ctrlKey) {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					// Отключим стандартную обработку браузера нажатия ctrl + i
					event.stopPropagation();
					event.preventDefault();
					if (hieroglyph) {
						t._syncEditors();
					}
					t.setTextStyle("i", null);
					return true;
				}
				break;

			/*case 83: // S
			 if (ctrlKey) {
			 if (!t.hasFocus) {t.setFocus(true);}
			 if (hieroglyph) {t._syncEditors();}

			 if (false === t.handlers.trigger("isGlobalLockEditCell"))
			 t._tryCloseEditor(event);
			 return false;
			 }
			 break;*/

			case 85: // U
				if (ctrlKey) {
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					// Отключим стандартную обработку браузера нажатия ctrl + u
					event.stopPropagation();
					event.preventDefault();
					if (hieroglyph) {
						t._syncEditors();
					}
					t.setTextStyle("u", null);
					return true;
				}
				break;

			case 144://Num Lock
			case 145://Scroll Lock
				if (AscBrowser.isOpera) {
					event.stopPropagation();
					event.preventDefault();
				}
				return false;

			case 80: // print           Ctrl + p
				if (ctrlKey) {
					event.stopPropagation();
					event.preventDefault();
					return false;
				}
				break;
			case 89:  // ctrl + y
			case 90:  // ctrl + z
				if (!this.enableKeyEvents) {
					break;
				}

				if (ctrlKey) {
					event.stopPropagation();
					event.preventDefault();
					if (!t.hasFocus) {
						t.setFocus(true);
					}
					event.which === 90 ? t.undo() : t.redo();
					return false;
				}
				break;

			case 113: // F2
				if (AscBrowser.isOpera) {
					event.stopPropagation();
					event.preventDefault();
				}
				return false;

			case 115: // F4
				var res = this._findRangeUnderCursor();
				if (res.range) {
					res.range.switchReference();
					this.enterCellRange(res.range.getName());
				}

				event.stopPropagation();
				event.preventDefault();
				return false;
		}

		t.skipKeyPress = false;
		t.skipTLUpdate = true;
		return true;
	};

	/** @param event {KeyboardEvent} */
	CellEditor.prototype._onWindowKeyPress = function (event) {
		var t = this;
		var ctrlKey = event.metaKey || event.ctrlKey;

		if (!window['IS_NATIVE_EDITOR']) {

			if (!t.isOpened || !t.enableKeyEvents) {
				return true;
			}

			if (t.skipKeyPress || event.which < 32 || event.altKey || ctrlKey) {
				t.skipKeyPress = true;
				return true;
			}

			// Проверим, есть ли глобальный lock
			//if (t.handlers.trigger("isGlobalLockEditCell"))
			//	return true;

			if (!t.hasFocus) {
				t.setFocus(true);
			}

			// определение ввода иероглифов
			if (t.isTopLineActive && t._getFragmentsLength(t.options.fragments) !== t.input.value.length) {
				t._syncEditors();
			}

			//t.setFocus(true);
		}

		var tmpCursorPos;
		var newChar = String.fromCharCode(event.which);
		t._addChars(newChar);
		// При первом быстром вводе стоит добавить в конце проценты (для процентного формата и только для числа)
		if (t.options.isAddPersentFormat && AscCommon.isNumber(newChar)) {
			t.options.isAddPersentFormat = false;
			tmpCursorPos = t.cursorPos;
			t.undoMode = true;
			t._addChars("%");
			t.cursorPos = tmpCursorPos;
			t.undoMode = false;
			t._updateCursorPosition();
		}
		if (t.textRender.getEndOfText() === t.cursorPos && !t.isFormula()) {
			var s = t._getFragmentsText(t.options.fragments);
			if (!AscCommon.isNumber(s)) {
				var arrAutoComplete = t._getAutoComplete(s.toLowerCase());
				var lengthInput = s.length;
				if (1 === arrAutoComplete.length) {
					var newValue = arrAutoComplete[0];
					tmpCursorPos = t.cursorPos;
					t._addChars(newValue.substring(lengthInput));
					t.selectionBegin = tmpCursorPos;
					t._selectChars(kEndOfText);
				}
			}
		}

		return t.isTopLineActive ? true : false; // prevent event bubbling
	};

	/** @param event {KeyboardEvent} */
	CellEditor.prototype._onWindowKeyUp = function ( event ) {
		var t = this;

		// для исправления Bug 15902 - Alt забирает фокус из приложения
		if ( t.lastKeyCode === 18 && event.which === 18 ) {
			return false;
		}
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onWindowMouseUp = function ( event ) {
		this.isSelectMode = c_oAscCellEditorSelectState.no;
		if ( this.callTopLineMouseup ) {
			this._topLineMouseUp();
		}
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onWindowMouseMove = function ( event ) {
		if ( c_oAscCellEditorSelectState.no !== this.isSelectMode && !this.hasCursor ) {
			this._changeSelection( this._getCoordinates( event ) );
		}
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onMouseDown = function ( event ) {
		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.externalChangeFocus();

		var pos;
		var coord = this._getCoordinates( event );
		if ( !window['IS_NATIVE_EDITOR'] ) {
			this.clickCounter.mouseDownEvent( coord.x, coord.y, event.button );
		}

		this.setFocus( true );

		this.isTopLineActive = false;
		this.input.isFocused = false;

		if ( 0 === event.button ) {
			if ( 1 === this.clickCounter.getClickCount() % 2 ) {
				this.isSelectMode = c_oAscCellEditorSelectState.char;
				if ( !event.shiftKey ) {
					this._showCursor();
					pos = this._findCursorPosition( coord );
					if ( pos !== undefined ) {
						pos >= 0 ? this._moveCursor( kPosition, pos ) : this._moveCursor( pos );
					}
				}
				else {
					this._changeSelection( coord );
				}
			}
			else {
				// Dbl click
				this.isSelectMode = c_oAscCellEditorSelectState.word;
				// Окончание слова
				var endWord = this.textRender.getNextWord( this.cursorPos );
				// Начало слова (ищем по окончанию, т.к. могли попасть в пробел)
				var startWord = this.textRender.getPrevWord( endWord );

				this._moveCursor( kPosition, startWord );
				this._selectChars( kPosition, endWord );
			}
		}
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onMouseUp = function ( event ) {
		if ( 2 === event.button ) {
			this.handlers.trigger( 'onContextMenu', event );
			return true;
		}
		this.isSelectMode = c_oAscCellEditorSelectState.no;
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onMouseMove = function (event) {
		var coord = this._getCoordinates(event);
		this.clickCounter.mouseMoveEvent(coord.x, coord.y);
		this.hasCursor = true;
		if (c_oAscCellEditorSelectState.no !== this.isSelectMode) {
			this._changeSelection(coord);
		}
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._onMouseLeave = function ( event ) {
		this.hasCursor = false;
		return true;
	};

	/** @param event {jQuery.Event} */
	CellEditor.prototype._onInputTextArea = function (event) {
		if (this.handlers.trigger("isViewerMode")) {
			return true;
		}
		this.skipTLUpdate = true;
		this.replaceText(0, this.textRender.getEndOfLine(this.cursorPos), this.input.value);
		return true;
	};

	/** @param event {MouseEvent} */
	CellEditor.prototype._getCoordinates = function (event) {
		if (window['IS_NATIVE_EDITOR']) {
			return {x: event.pageX, y: event.pageY};
		}

		var offs = this.canvasOverlay.getBoundingClientRect();
		var x = (((event.pageX * AscBrowser.zoom) >> 0) - offs.left) / this.kx;
		var y = (((event.pageY * AscBrowser.zoom) >> 0) - offs.top) / this.ky;

		return {x: x, y: y};
	};

	CellEditor.prototype.Begin_CompositeInput = function () {
		if (this.selectionBegin === this.selectionEnd) {
			this.beginCompositePos = this.cursorPos;
			this.compositeLength = 0;
		} else {
			this.beginCompositePos = this.selectionBegin;
			this.compositeLength = this.selectionEnd - this.selectionBegin;
		}
		this.setTextStyle('u', Asc.EUnderline.underlineSingle);
	};
	CellEditor.prototype.Replace_CompositeText = function (arrCharCodes) {
		if (!this.isOpened) {
			return;
		}

		var code, codePt, newText = '';
		for (var i = 0; i < arrCharCodes.length; ++i) {
			code = arrCharCodes[i];
			if (code < 0x10000) {
				newText += String.fromCharCode(code);
			} else {
				codePt = code - 0x10000;
				newText += String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
			}
		}
		this.replaceText(this.beginCompositePos, this.compositeLength, newText);
		this.compositeLength = newText.length;

		var tmpBegin = this.selectionBegin, tmpEnd = this.selectionEnd;

		this.selectionBegin = this.beginCompositePos;
		this.selectionEnd = this.beginCompositePos + this.compositeLength;
		this.setTextStyle('u', Asc.EUnderline.underlineSingle);

		this.selectionBegin = tmpBegin;
		this.selectionEnd = tmpEnd;

		// Обновляем выделение
		this._cleanSelection();
		this._drawSelection();
	};
	CellEditor.prototype.End_CompositeInput = function () {
		var tmpBegin = this.selectionBegin, tmpEnd = this.selectionEnd;

		this.selectionBegin = this.beginCompositePos;
		this.selectionEnd = this.beginCompositePos + this.compositeLength;
		this.setTextStyle('u', Asc.EUnderline.underlineNone);

		this.beginCompositePos = -1;
		this.compositeLength = 0;
		this.selectionBegin = tmpBegin;
		this.selectionEnd = tmpEnd;

		// Обновляем выделение
		this._cleanSelection();
		this._drawSelection();
	};
	CellEditor.prototype.Set_CursorPosInCompositeText = function (nPos) {
		if (-1 !== this.beginCompositePos) {
			nPos = Math.min(nPos, this.compositeLength);
			this._moveCursor(kPosition, this.beginCompositePos + nPos);
		}
	};
	CellEditor.prototype.Get_CursorPosInCompositeText = function () {
		return this.cursorPos - this.beginCompositePos;
	};
	CellEditor.prototype.Get_MaxCursorPosInCompositeText = function () {
		return this.compositeLength;
	};


	//------------------------------------------------------------export---------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window["AscCommonExcel"].CellEditor = CellEditor;
})(window);
