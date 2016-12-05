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
  function(window, undefined) {


  /*
   * Import
   * -----------------------------------------------------------------------------
   */
  var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
  var c_oAscFormatPainterState = AscCommon.c_oAscFormatPainterState;
  var AscBrowser = AscCommon.AscBrowser;
  var CColor = AscCommon.CColor;
  var cBoolLocal = AscCommon.cBoolLocal;
  var History = AscCommon.History;

  var asc = window["Asc"];
  var asc_applyFunction = AscCommonExcel.applyFunction;
  var asc_round = asc.round;
  var asc_typeof = asc.typeOf;
  var asc_CMM = AscCommonExcel.asc_CMouseMoveData;
  var asc_CPrintPagesData = AscCommonExcel.CPrintPagesData;
  var asc_getcvt = asc.getCvtRatio;
  var asc_CSP = AscCommonExcel.asc_CStylesPainter;
  var c_oTargetType = AscCommonExcel.c_oTargetType;
  var c_oAscError = asc.c_oAscError;
  var c_oAscCleanOptions = asc.c_oAscCleanOptions;
  var c_oAscSelectionDialogType = asc.c_oAscSelectionDialogType;
  var c_oAscMouseMoveType = asc.c_oAscMouseMoveType;
  var c_oAscCellEditorState = asc.c_oAscCellEditorState;
  var c_oAscPopUpSelectorType = asc.c_oAscPopUpSelectorType;
  var c_oAscAsyncAction = asc.c_oAscAsyncAction;
  var c_oAscFontRenderingModeType = asc.c_oAscFontRenderingModeType;
  var c_oAscAsyncActionType = asc.c_oAscAsyncActionType;


  function WorkbookCommentsModel(handlers, aComments) {
    this.workbook = {handlers: handlers};
    this.aComments = aComments;
  }

  WorkbookCommentsModel.prototype.getId = function() {
    return "workbook";
  };
  WorkbookCommentsModel.prototype.getMergedByCell = function() {
    return null;
  };

  function WorksheetViewSettings() {
    this.header = {
      style: [// Header colors
        { // kHeaderDefault
          background: new CColor(244, 244, 244), border: new CColor(213, 213, 213), color: new CColor(54, 54, 54)
        }, { // kHeaderActive
          background: new CColor(193, 193, 193), border: new CColor(146, 146, 146), color: new CColor(54, 54, 54)
        }, { // kHeaderHighlighted
          background: new CColor(223, 223, 223), border: new CColor(175, 175, 175), color: new CColor(101, 106, 112)
        }, { // kHeaderSelected
          background: new CColor(170, 170, 170), border: new CColor(117, 119, 122), color: new CColor(54, 54, 54)
        }], cornerColor: new CColor(193, 193, 193)
    };
    this.cells = {
      defaultState: {
        background: new CColor(255, 255, 255), border: new CColor(212, 212, 212), color: new CColor(0, 0, 0)
      }, padding: -1, /*px horizontal padding*/
      paddingPlusBorder: -1
    };
    this.activeCellBorderColor = new CColor(126, 152, 63);
    this.activeCellBorderColor2 = new CColor(255, 255, 255, 1);

    // Цвет закрепленных областей
    this.frozenColor = new CColor(105, 119, 62, 1);

    // Число знаков для математической информации
    this.mathMaxDigCount = 9;

    var cnv = document.createElement("canvas");
    cnv.width = 2;
    cnv.height = 2;
    var ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, 2, 2);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillRect(1, 1, 1, 1);
    this.ptrnLineDotted1 = ctx.createPattern(cnv, "repeat");

    return this;
  }


  /**
   * Widget for displaying and editing Workbook object
   * -----------------------------------------------------------------------------
   * @param {AscCommonExcel.Workbook} model                        Workbook
   * @param {AscCommonExcel.asc_CEventsController} controller          Events controller
   * @param {HandlersList} handlers                  Events handlers for WorkbookView events
   * @param {Element} elem                          Container element
   * @param {Element} inputElem                      Input element for top line editor
   * @param {Object} Api
   * @param {CCollaborativeEditing} collaborativeEditing
   * @param {c_oAscFontRenderingModeType} fontRenderingMode
   *
   * @constructor
   * @memberOf Asc
   */
  function WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode) {
    this.defaults = {
      scroll: {
        widthPx: 14, heightPx: 14
      }, worksheetView: new WorksheetViewSettings()
    };

    this.model = model;
    this.enableKeyEvents = true;
    this.controller = controller;
    this.handlers = handlers;
    this.wsViewHandlers = null;
    this.element = elem;
    this.input = inputElem;
    this.clipboard = new AscCommonExcel.Clipboard();
    this.Api = Api;
    this.collaborativeEditing = collaborativeEditing;
    this.lastSendInfoRange = null;
    this.oSelectionInfo = null;
    this.canUpdateAfterShiftUp = false;	// Нужно ли обновлять информацию после отпускания Shift

    //----- declaration -----
    this.canvas = undefined;
    this.canvasOverlay = undefined;
    this.canvasGraphic = undefined;
    this.canvasGraphicOverlay = undefined;
    this.wsActive = -1;
    this.wsMustDraw = false; // Означает, что мы выставили активный, но не отрисовали его
    this.wsViews = [];
    this.cellEditor = undefined;
    this.fontRenderingMode = null;
    this.lockDraw = false;		// Lock отрисовки на некоторое время

    this.isCellEditMode = false;

    this.isShowComments = true;

    this.formulasList = [];		// Список всех формул
    this.lastFormulaPos = -1; 		// Последняя позиция формулы
    this.lastFormulaNameLength = '';		// Последний кусок формулы
    this.skipHelpSelector = false;	// Пока true - не показываем окно подсказки
    // Константы для подстановке формулы (что не нужно добавлять скобки)
    this.arrExcludeFormulas = [];

    this.lastFindOptions = null;	// Последний поиск (параметры)
    this.lastFindResults = {};		// Результаты поиска (для поиска по всей книге, чтобы перейти на другой лист)
    this.fReplaceCallback = null;	// Callback для замены текста

    // Фонт, который выставлен в DrawingContext, он должен быть один на все DrawingContext-ы
    this.m_oFont = new asc.FontProperties(this.model.getDefaultFont(), this.model.getDefaultSize());

    // Теперь у нас 2 FontManager-а на весь документ + 1 для автофигур (а не на каждом листе свой)
    this.fmgrGraphics = [];						// FontManager for draw (1 для обычного + 1 для поворотного текста)
    this.fmgrGraphics.push(new AscFonts.CFontManager({mode:"cell"}));	// Для обычного
    this.fmgrGraphics.push(new AscFonts.CFontManager({mode:"cell"}));	// Для поворотного
    this.fmgrGraphics.push(new AscFonts.CFontManager());	// Для автофигур
    this.fmgrGraphics.push(new AscFonts.CFontManager({mode:"cell"}));	// Для измерений

    this.fmgrGraphics[0].Initialize(true); // IE memory enable
    this.fmgrGraphics[1].Initialize(true); // IE memory enable
    this.fmgrGraphics[2].Initialize(true); // IE memory enable
    this.fmgrGraphics[3].Initialize(true); // IE memory enable

    this.buffers = {};
    this.drawingCtx = undefined;
    this.overlayCtx = undefined;
    this.drawingGraphicCtx = undefined;
    this.overlayGraphicCtx = undefined;
    this.stringRender = undefined;

    this.stateFormatPainter = c_oAscFormatPainterState.kOff;
    this.rangeFormatPainter = null;

    this.selectionDialogType = c_oAscSelectionDialogType.None;
    this.copyActiveSheet = -1;

    // Комментарии для всего документа
    this.cellCommentator = null;

    // Флаг о подписке на эвенты о смене позиции документа (скролл) для меню
    this.isDocumentPlaceChangedEnabled = false;

    // Максимальная ширина числа из 0,1,2...,9, померенная в нормальном шрифте(дефалтовый для книги) в px(целое)
    // Ecma-376 Office Open XML Part 1, пункт 18.3.1.13
    this.maxDigitWidth = 0;
    this.defaultFont = new asc.FontProperties(this.model.getDefaultFont(), this.model.getDefaultSize());
    //-----------------------

    this.m_dScrollY = 0;
    this.m_dScrollX = 0;
    this.m_dScrollY_max = 1;
    this.m_dScrollX_max = 1;

    this.MobileTouchManager = null;

    this.defNameAllowCreate = true;

    this._init(fontRenderingMode);

    return this;
  }

  WorkbookView.prototype._init = function(fontRenderingMode) {
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
    }

    // Для мобильных не поддерживаем ретину
    if (this.Api.isMobileVersion) {
      AscBrowser.isRetina = false;
    }

    this.buffers.main = new asc.DrawingContext({
      canvas: this.canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
    });
    this.buffers.overlay = new asc.DrawingContext({
      canvas: this.canvasOverlay, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
    });

    this.buffers.mainGraphic = new asc.DrawingContext({
      canvas: this.canvasGraphic, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
    });
    this.buffers.overlayGraphic = new asc.DrawingContext({
      canvas: this.canvasGraphicOverlay, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics, font: this.m_oFont
    });

    this.drawingCtx = this.buffers.main;
    this.overlayCtx = this.buffers.overlay;
    this.drawingGraphicCtx = this.buffers.mainGraphic;
    this.overlayGraphicCtx = this.buffers.overlayGraphic;

    // Обновляем размеры (чуть ниже, потому что должны быть проинициализированы ctx)
    this._canResize();

    // Shapes
    var canvasWidth = this.drawingGraphicCtx.canvas.width;
    var canvasHeight = this.drawingGraphicCtx.canvas.height;
    this.buffers.shapeCtx = new AscCommon.CGraphics();
    this.buffers.shapeCtx.init(this.drawingGraphicCtx.ctx, canvasWidth, canvasHeight, (canvasWidth * 25.4 / this.drawingGraphicCtx.ppiX), (canvasHeight * 25.4 / this.drawingGraphicCtx.ppiY));
    this.buffers.shapeCtx.m_oFontManager = this.fmgrGraphics[2];

    var overlayWidth = this.overlayGraphicCtx.canvas.width;
    var overlayHeight = this.overlayGraphicCtx.canvas.height;
    this.buffers.shapeOverlayCtx = new AscCommon.CGraphics();
    this.buffers.shapeOverlayCtx.init(this.overlayGraphicCtx.ctx, overlayWidth, overlayHeight, (overlayWidth * 25.4 / this.overlayGraphicCtx.ppiX), (overlayHeight * 25.4 / this.overlayGraphicCtx.ppiY));
    this.buffers.shapeOverlayCtx.m_oFontManager = this.fmgrGraphics[2];

    this.stringRender = new AscCommonExcel.StringRender(this.buffers.main);
    this.stringRender.setDefaultFont(this.defaultFont);

    // Мерить нужно только со 100% и один раз для всего документа
    this._calcMaxDigitWidth();

    if (!window["NATIVE_EDITOR_ENJINE"]) {
      // initialize events controller
      this.controller.init(this, this.element, /*this.canvasOverlay*/ this.canvasGraphicOverlay, /*handlers*/{
        "resize": function () {
          self.resize.apply(self, arguments);
        }, "reinitializeScroll": function () {
          self._onScrollReinitialize.apply(self, arguments);
        }, "scrollY": function () {
          self._onScrollY.apply(self, arguments);
        }, "scrollX": function () {
          self._onScrollX.apply(self, arguments);
        }, "changeSelection": function () {
          self._onChangeSelection.apply(self, arguments);
        }, "changeSelectionDone": function () {
          self._onChangeSelectionDone.apply(self, arguments);
        }, "changeSelectionRightClick": function () {
          self._onChangeSelectionRightClick.apply(self, arguments);
        }, "selectionActivePointChanged": function () {
          self._onSelectionActivePointChanged.apply(self, arguments);
        }, "updateWorksheet": function () {
          self._onUpdateWorksheet.apply(self, arguments);
        }, "resizeElement": function () {
          self._onResizeElement.apply(self, arguments);
        }, "resizeElementDone": function () {
          self._onResizeElementDone.apply(self, arguments);
        }, "changeFillHandle": function () {
          self._onChangeFillHandle.apply(self, arguments);
        }, "changeFillHandleDone": function () {
          self._onChangeFillHandleDone.apply(self, arguments);
        }, "moveRangeHandle": function () {
          self._onMoveRangeHandle.apply(self, arguments);
        }, "moveRangeHandleDone": function () {
          self._onMoveRangeHandleDone.apply(self, arguments);
        }, "moveResizeRangeHandle": function () {
          self._onMoveResizeRangeHandle.apply(self, arguments);
        }, "moveResizeRangeHandleDone": function () {
          self._onMoveResizeRangeHandleDone.apply(self, arguments);
        }, "editCell": function () {
          self._onEditCell.apply(self, arguments);
        }, "stopCellEditing": function () {
          return self._onStopCellEditing.apply(self, arguments);
        }, "getCellEditMode": function () {
          return self.isCellEditMode;
        }, "empty": function () {
          self._onEmpty.apply(self, arguments);
        }, "canEnterCellRange": function () {
          self.cellEditor.setFocus(false);
          var ret = self.cellEditor.canEnterCellRange();
          ret ? self.cellEditor.activateCellRange() : true;
          return ret;
        }, "enterCellRange": function () {
          self.lockDraw = true;
          self.cellEditor.setFocus(false);
          self.getWorksheet().enterCellRange(self.cellEditor);
          self.lockDraw = false;
        }, "undo": function () {
          self.undo.apply(self, arguments);
        }, "redo": function () {
          self.redo.apply(self, arguments);
        }, "addColumn": function () {
          self._onAddColumn.apply(self, arguments);
        }, "addRow": function () {
          self._onAddRow.apply(self, arguments);
        }, "mouseDblClick": function () {
          self._onMouseDblClick.apply(self, arguments);
        }, "showNextPrevWorksheet": function () {
          self._onShowNextPrevWorksheet.apply(self, arguments);
        }, "setFontAttributes": function () {
          self._onSetFontAttributes.apply(self, arguments);
        }, "selectColumnsByRange": function () {
          self._onSelectColumnsByRange.apply(self, arguments);
        }, "selectRowsByRange": function () {
          self._onSelectRowsByRange.apply(self, arguments);
        }, "save": function () {
          self.Api.asc_Save();
        }, "showCellEditorCursor": function () {
          self._onShowCellEditorCursor.apply(self, arguments);
        }, "print": function () {
          self.Api.onPrint();
        }, "addFunction": function () {
          self.insertFormulaInEditor.apply(self, arguments);
        }, "canvasClick": function () {
          self.enableKeyEventsHandler(true);
        }, "autoFiltersClick": function () {
          self._onAutoFiltersClick.apply(self, arguments);
        }, "commentCellClick": function () {
          self._onCommentCellClick.apply(self, arguments);
        }, "isGlobalLockEditCell": function () {
          return self.collaborativeEditing.getGlobalLockEditCell();
        }, "updateSelectionName": function () {
          self._onUpdateSelectionName.apply(self, arguments);
        }, "stopFormatPainter": function () {
          self._onStopFormatPainter.apply(self, arguments);
        },

        // Shapes
        "graphicObjectMouseDown": function () {
          self._onGraphicObjectMouseDown.apply(self, arguments);
        }, "graphicObjectMouseMove": function () {
          self._onGraphicObjectMouseMove.apply(self, arguments);
        }, "graphicObjectMouseUp": function () {
          self._onGraphicObjectMouseUp.apply(self, arguments);
        }, "graphicObjectMouseUpEx": function () {
          self._onGraphicObjectMouseUpEx.apply(self, arguments);
        }, "graphicObjectWindowKeyDown": function () {
          return self._onGraphicObjectWindowKeyDown.apply(self, arguments);
        }, "graphicObjectWindowKeyPress": function () {
          return self._onGraphicObjectWindowKeyPress.apply(self, arguments);
        }, "getGraphicsInfo": function () {
          return self._onGetGraphicsInfo.apply(self, arguments);
        }, "updateSelectionShape": function () {
          return self._onUpdateSelectionShape.apply(self, arguments);
        }, "canReceiveKeyPress": function () {
          return self.getWorksheet().objectRender.controller.canReceiveKeyPress();
        }, "stopAddShape": function () {
          self.getWorksheet().objectRender.controller.checkEndAddShape();
        },

        // Frozen anchor
        "moveFrozenAnchorHandle": function () {
          self._onMoveFrozenAnchorHandle.apply(self, arguments);
        }, "moveFrozenAnchorHandleDone": function () {
          self._onMoveFrozenAnchorHandleDone.apply(self, arguments);
        },

        // AutoComplete
        "showAutoComplete": function () {
          self.showAutoComplete.apply(self, arguments);
        }, "onContextMenu": function (event) {
          self.handlers.trigger("asc_onContextMenu", event);
        },

        // FormatPainter
        'isFormatPainter': function () {
          return self.stateFormatPainter;
        }
      });

      if (this.input && this.input.addEventListener) {
        this.input.addEventListener("focus", function () {
          self.input.isFocused = true;
          if (self.controller.settings.isViewerMode) {
            return;
          }
          self._onStopFormatPainter();
          self.controller.setStrictClose(true);
          self.cellEditor.callTopLineMouseup = true;
          if (!self.getCellEditMode() && !self.controller.isFillHandleMode) {
            self._onEditCell(/*isFocus*/true);
          }
        }, false);

        this.input.addEventListener('keydown', function (event) {
          if (self.isCellEditMode) {
            self.handlers.trigger('asc_onInputKeyDown', event);
            if (!event.defaultPrevented) {
              self.cellEditor._onWindowKeyDown(event, true);
            }
          }
        }, false);
      }

      this.Api.onKeyDown = function (event) {
        self.controller._onWindowKeyDown(event);
        if (self.isCellEditMode) {
          self.cellEditor._onWindowKeyDown(event, false);
        }
      };
      this.Api.onKeyPress = function (event) {
        self.controller._onWindowKeyPress(event);
        if (self.isCellEditMode) {
          self.cellEditor._onWindowKeyPress(event);
        }
      };
      this.Api.onKeyUp = function (event) {
        self.controller._onWindowKeyUp(event);
        if (self.isCellEditMode) {
          self.cellEditor._onWindowKeyUp(event);
        }
      };
      this.Api.Begin_CompositeInput = function () {
        var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            oWSView.objectRender.Begin_CompositeInput();
          }
          return;
        }

        if (!self.isCellEditMode) {
          self._onEditCell(false, true, undefined, true, function () {
            self.cellEditor.Begin_CompositeInput();
          });
        } else {
          self.cellEditor.Begin_CompositeInput();
        }
      };
      this.Api.Replace_CompositeText = function (arrCharCodes) {
        var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            oWSView.objectRender.Replace_CompositeText(arrCharCodes);
          }
          return;
        }
        if (self.isCellEditMode) {
          self.cellEditor.Replace_CompositeText(arrCharCodes);
        }
      };
      this.Api.End_CompositeInput = function () {
        var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            oWSView.objectRender.End_CompositeInput();
          }
          return;
        }
        if (self.isCellEditMode) {
          self.cellEditor.End_CompositeInput();
        }
      };
      this.Api.Set_CursorPosInCompositeText = function (nPos) {
        var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            oWSView.objectRender.Set_CursorPosInCompositeText(nPos);
          }
          return;
        }
        if (self.isCellEditMode) {
          self.cellEditor.Set_CursorPosInCompositeText(nPos);
        }
      };
      this.Api.Get_CursorPosInCompositeText = function () {
        var res = 0;
        var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            res = oWSView.objectRender.Get_CursorPosInCompositeText();
          }
        }
        else if (self.isCellEditMode) {
          res = self.cellEditor.Get_CursorPosInCompositeText();
        }
        return res;
      };
      this.Api.Get_MaxCursorPosInCompositeText = function () {
        var res = 0; var oWSView = self.getWorksheet();
        if(oWSView && oWSView.isSelectOnShape){
          if(oWSView.objectRender){
            res = oWSView.objectRender.Get_CursorPosInCompositeText();
          }
        }
        else if (self.isCellEditMode) {
          res = self.cellEditor.Get_MaxCursorPosInCompositeText();
        }
        return res;
      };
      AscCommon.InitBrowserInputContext(this.Api, "id_target_cursor");
    }

    this.cellEditor =
      new AscCommonExcel.CellEditor(this.element, this.input, this.fmgrGraphics, this.m_oFont, /*handlers*/{
        "closed": function () {
          self._onCloseCellEditor.apply(self, arguments);
        }, "updated": function () {
          self._onUpdateCellEditor.apply(self, arguments);
        }, "gotFocus": function (hasFocus) {
          self.controller.setFocus(!hasFocus);
        }, "updateFormulaEditMod": function () {
          self.controller.setFormulaEditMode.apply(self.controller, arguments);
          var ws = self.getWorksheet();
          if (ws) {
            if (!self.lockDraw) {
              ws.cleanSelection();
            }
            for (var i in self.wsViews) {
              self.wsViews[i].cleanFormulaRanges();
            }
//            ws.cleanFormulaRanges();
            ws.setFormulaEditMode.apply(ws, arguments);
          }
        }, "updateEditorState": function (state) {
          self.handlers.trigger("asc_onEditCell", state);
        }, "isGlobalLockEditCell": function () {
          return self.collaborativeEditing.getGlobalLockEditCell();
        }, "updateFormulaEditModEnd": function () {
          if (!self.lockDraw) {
            self.getWorksheet().updateSelection();
          }
        }, "newRange": function (range, ws) {
          if (!ws) {
            self.getWorksheet().addFormulaRange(range);
          } else {
            self.getWorksheet(self.model.getWorksheetIndexByName(ws)).addFormulaRange(range);
          }
        }, "existedRange": function (range, ws) {
          var editRangeSheet = ws ? self.model.getWorksheetIndexByName(ws) : self.copyActiveSheet;
          if (-1 === editRangeSheet || editRangeSheet === self.wsActive) {
            self.getWorksheet().activeFormulaRange(range);
          } else {
            self.getWorksheet(editRangeSheet).removeFormulaRange(range);
            self.getWorksheet().addFormulaRange(range);
          }
        }, "updateUndoRedoChanged": function (bCanUndo, bCanRedo) {
          self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
          self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
        }, "applyCloseEvent": function () {
          self.controller._onWindowKeyDown.apply(self.controller, arguments);
        }, "isViewerMode": function () {
          return self.controller.settings.isViewerMode;
        }, "getFormulaRanges": function () {
          return self.cellFormulaEnterWSOpen ? self.cellFormulaEnterWSOpen.getFormulaRanges() :
            self.getWorksheet().getFormulaRanges();
        }, "getCellFormulaEnterWSOpen": function () {
          return self.cellFormulaEnterWSOpen;
        }, "getActiveWS": function () {
          return self.getWorksheet().model;
        }, "setStrictClose": function (val) {
          self.controller.setStrictClose(val);
        }, "updateEditorSelectionInfo": function (info) {
          self.handlers.trigger("asc_onEditorSelectionChanged", info);
        }, "onContextMenu": function (event) {
          self.handlers.trigger("asc_onContextMenu", event);
        }
      }, /*settings*/{
        font: this.defaultFont, padding: this.defaults.worksheetView.cells.padding
      });

    this.wsViewHandlers = new AscCommonExcel.asc_CHandlersList(/*handlers*/{
      "getViewerMode": function() {
        return self.controller.getViewerMode ? self.controller.getViewerMode() : true;
      }, "reinitializeScroll": function() {
        self.controller.reinitializeScroll(/*All*/);
      }, "reinitializeScrollY": function() {
        self.controller.reinitializeScroll(/*vertical*/1);
      }, "reinitializeScrollX": function() {
        self.controller.reinitializeScroll(/*horizontal*/2);
      }, "selectionChanged": function() {
        self._onWSSelectionChanged();
      }, "selectionNameChanged": function() {
        self._onSelectionNameChanged.apply(self, arguments);
      }, "selectionMathInfoChanged": function() {
        self._onSelectionMathInfoChanged.apply(self, arguments);
      }, "onErrorEvent": function(errorId, level) {
        self.handlers.trigger("asc_onError", errorId, level);
      }, "slowOperation": function(isStart) {
        (isStart ? self.Api.sync_StartAction : self.Api.sync_EndAction).call(self.Api, c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
      }, "setAutoFiltersDialog": function(arrVal) {
        self.handlers.trigger("asc_onSetAFDialog", arrVal);
      }, "selectionRangeChanged": function(val) {
        self.handlers.trigger("asc_onSelectionRangeChanged", val);
      }, "onRenameCellTextEnd": function(countFind, countReplace) {
        self.handlers.trigger("asc_onRenameCellTextEnd", countFind, countReplace);
      }, 'onStopFormatPainter': function() {
        self._onStopFormatPainter();
      }, 'getRangeFormatPainter': function() {
        return self.rangeFormatPainter;
      },"onDocumentPlaceChanged": function() {
        self._onDocumentPlaceChanged();
      }, "updateSheetViewSettings": function() {
        self.handlers.trigger("asc_onUpdateSheetViewSettings");
      }, "onScroll": function(d) {
        self.controller.scroll(d);
      }, "getLockDefNameManagerStatus": function() {
        return self.defNameAllowCreate;
      }, 'isActive': function() {
        return (-1 === self.copyActiveSheet || self.wsActive === self.copyActiveSheet);
      },
		"getCellEditMode": function() {
			return self.isCellEditMode;
		}
    });

    this.model.handlers.add("cleanCellCache", function(wsId, oRanges, bLockDraw, updateHeight) {
      var ws = self.getWorksheetById(wsId, true);
      if (ws) {
        ws.updateRanges(oRanges, bLockDraw || wsId != self.getWorksheet(self.wsActive).model.getId(), updateHeight);
      }
    });
    this.model.handlers.add("changeWorksheetUpdate", function(wsId, val) {
      var ws = self.getWorksheetById(wsId);
      if (ws) {
        ws.changeWorksheet("update", val);
      }
    });
    this.model.handlers.add("showWorksheet", function(wsId) {
      var wsModel = self.model.getWorksheetById(wsId), index;
      if (wsModel) {
        index = wsModel.getIndex();
        self.showWorksheet(index, false, true);
        self.handlers.trigger("asc_onActiveSheetChanged", index);
      }
    });
    this.model.handlers.add("setSelection", function() {
      self._onSetSelection.apply(self, arguments);
    });
    this.model.handlers.add("getSelectionState", function() {
      return self._onGetSelectionState.apply(self);
    });
    this.model.handlers.add("setSelectionState", function() {
      self._onSetSelectionState.apply(self, arguments);
    });
    this.model.handlers.add("reInit", function() {
      self.reInit.apply(self, arguments);
    });
    this.model.handlers.add("drawWS", function() {
      self.drawWS.apply(self, arguments);
    });
    this.model.handlers.add("showDrawingObjects", function() {
      self.onShowDrawingObjects.apply(self, arguments);
    });
    this.model.handlers.add("setCanUndo", function(bCanUndo) {
      self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
    });
    this.model.handlers.add("setCanRedo", function(bCanRedo) {
      self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
    });
    this.model.handlers.add("setDocumentModified", function(bIsModified) {
      self.Api.onUpdateDocumentModified(bIsModified);
    });
    this.model.handlers.add("replaceWorksheet", function(from, to) {
      self.replaceWorksheet(from, to);
    });
    this.model.handlers.add("removeWorksheet", function(nIndex) {
      self.removeWorksheet(nIndex);
    });
    this.model.handlers.add("spliceWorksheet", function() {
      self.spliceWorksheet.apply(self, arguments);
    });
    this.model.handlers.add("updateWorksheetByModel", function() {
      self.updateWorksheetByModel.apply(self, arguments);
    });
    this.model.handlers.add("undoRedoAddRemoveRowCols", function(sheetId, type, range, bUndo) {
      if (true === bUndo) {
        if (AscCH.historyitem_Worksheet_AddRows === type) {
          self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
          self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
        } else if (AscCH.historyitem_Worksheet_RemoveRows === type) {
          self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
          self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
        } else if (AscCH.historyitem_Worksheet_AddCols === type) {
          self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
          self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
        } else if (AscCH.historyitem_Worksheet_RemoveCols === type) {
          self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
          self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
        }
      } else {
        if (AscCH.historyitem_Worksheet_AddRows === type) {
          self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
          self.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
        } else if (AscCH.historyitem_Worksheet_RemoveRows === type) {
          self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
          self.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
        } else if (AscCH.historyitem_Worksheet_AddCols === type) {
          self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
          self.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
        } else if (AscCH.historyitem_Worksheet_RemoveCols === type) {
          self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
          self.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
        }
      }
    });
    this.model.handlers.add("undoRedoHideSheet", function(sheetId) {
      self.showWorksheet(sheetId);
      // Посылаем callback об изменении списка листов
      self.handlers.trigger("asc_onSheetsChanged");
    });

    this.handlers.add("asc_onLockDefNameManager", function(reason) {
      self.defNameAllowCreate = !(reason == Asc.c_oAscDefinedNameReason.LockDefNameManager);
    });
    this.handlers.add('addComment', function (id, data) {
      self._onWSSelectionChanged();
      self.handlers.trigger('asc_onAddComment', id, data);
    });
    this.handlers.add('removeComment', function (id) {
      self._onWSSelectionChanged();
      self.handlers.trigger('asc_onRemoveComment', id);
    });
    this.handlers.add('hiddenComments', function () {
      return !self.isShowComments;
    });

    this.cellCommentator = new AscCommonExcel.CCellCommentator({
      model: new WorkbookCommentsModel(this.handlers, this.model.aComments),
      collaborativeEditing: this.collaborativeEditing,
      draw: function() {
      },
      handlers: {
        trigger: function() {
          return true;
        }
      }
    });
    if (0 < this.model.aComments.length) {
      this.handlers.trigger("asc_onAddComments", this.model.aComments);
    }

    this.clipboard.Api = this.Api;

    this.initFormulasList();

    this.fReplaceCallback = function() {
      self._replaceCellTextCallback.apply(self, arguments);
    };

    if (this.Api.isMobileVersion) {
      this.MobileTouchManager = new AscCommonExcel.CMobileTouchManager();
      this.MobileTouchManager.Init(this);
    }
    return this;
  };

  WorkbookView.prototype.destroy = function() {
    this.controller.destroy();
    this.cellEditor.destroy();
    return this;
  };

  WorkbookView.prototype._createWorksheetView = function(wsModel) {
    return new AscCommonExcel.WorksheetView(wsModel, this.wsViewHandlers, this.buffers, this.stringRender, this.maxDigitWidth, this.collaborativeEditing, this.defaults.worksheetView);
  };

  WorkbookView.prototype._onSelectionNameChanged = function(name) {
    this.handlers.trigger("asc_onSelectionNameChanged", name);
  };

  WorkbookView.prototype._onSelectionMathInfoChanged = function(info) {
    this.handlers.trigger("asc_onSelectionMathChanged", info);
  };

  // Проверяет, сменили ли мы диапазон (для того, чтобы не отправлять одинаковую информацию о диапазоне)
  WorkbookView.prototype._isEqualRange = function(range, isSelectOnShape) {
    if (null === this.lastSendInfoRange) {
      return false;
    }

    return this.lastSendInfoRange.isEqual(range) && this.lastSendInfoRangeIsSelectOnShape === isSelectOnShape;
  };

  WorkbookView.prototype._updateSelectionInfo = function () {
    var ws = this.cellFormulaEnterWSOpen ? this.cellFormulaEnterWSOpen : this.getWorksheet();
    this.oSelectionInfo = ws.getSelectionInfo();
    this.lastSendInfoRange = ws.model.selectionRange.getLast().clone(true);
    this.lastSendInfoRangeIsSelectOnShape = ws.getSelectionShape();
  };
  WorkbookView.prototype._onWSSelectionChanged = function() {
    this._updateSelectionInfo();

    // При редактировании ячейки не нужно пересылать изменения
    if (this.input && false === this.getCellEditMode() && c_oAscSelectionDialogType.None === this.selectionDialogType) {
      // Сами запретим заходить в строку формул, когда выделен shape
      if (this.lastSendInfoRangeIsSelectOnShape) {
        this.input.disabled = true;
        this.input.value = '';
      } else {
        this.input.disabled = false;
        this.input.value = this.oSelectionInfo.text;
      }
    }
    this.handlers.trigger("asc_onSelectionChanged", this.oSelectionInfo);
    this.handlers.trigger("asc_onSelectionEnd");
  };


  WorkbookView.prototype._onScrollReinitialize = function(whichSB, callback) {
    var ws = this.getWorksheet(), vsize = !whichSB || whichSB === 1 ? ws.getVerticalScrollRange() : undefined, hsize = !whichSB || whichSB === 2 ? ws.getHorizontalScrollRange() : undefined;

    if (vsize != undefined) {
      this.m_dScrollY_max = Math.max(this.controller.settings.vscrollStep * (vsize + 1), 1);
    }
    if (hsize != undefined) {
      this.m_dScrollX_max = Math.max(this.controller.settings.hscrollStep * (hsize + 1), 1);
    }

    asc_applyFunction(callback, vsize, hsize);
  };

  WorkbookView.prototype._onScrollY = function(pos) {
    var ws = this.getWorksheet();
    var delta = asc_round(pos - ws.getFirstVisibleRow(/*allowPane*/true));
    if (delta !== 0) {
      ws.scrollVertical(delta, this.cellEditor);
    }
  };

  WorkbookView.prototype._onScrollX = function(pos) {
    var ws = this.getWorksheet();
    var delta = asc_round(pos - ws.getFirstVisibleCol(/*allowPane*/true));
    if (delta !== 0) {
      ws.scrollHorizontal(delta, this.cellEditor);
    }
  };

  WorkbookView.prototype._onSetSelection = function(range, validRange) {
    var ws = this.getWorksheet();
    ws._checkSelectionShape();
    var d = ws.setSelectionUndoRedo(range, validRange);
    this.controller.scroll(d);
  };

  WorkbookView.prototype._onGetSelectionState = function() {
    var res = null;
    var ws = this.getWorksheet(null, true);
    if (ws && AscCommon.isRealObject(ws.objectRender) && AscCommon.isRealObject(ws.objectRender.controller)) {
      res = ws.objectRender.controller.getSelectionState();
    }
    return (res && res[0] && res[0].focus) ? res : null;
  };

  WorkbookView.prototype._onSetSelectionState = function(state) {
    if (null !== state) {
      var ws = this.getWorksheetById(state[0].worksheetId);
      if (ws && ws.objectRender && ws.objectRender.controller) {
        ws.objectRender.controller.setSelectionState(state);
        ws.setSelectionShape(true);
        var d = ws._calcActiveCellOffset(ws.objectRender.getSelectedDrawingsRange());
        this.controller.scroll(d);
        ws.objectRender.showDrawingObjectsEx(true);
        ws.objectRender.controller.updateOverlay();
        ws.objectRender.controller.updateSelectionState();
      }
      // Селектим после выставления состояния
    }
  };

  WorkbookView.prototype._onChangeSelection = function (isStartPoint, dc, dr, isCoord, isSelectMode, isCtrl, callback) {
    var ws = this.getWorksheet();
    var d = isStartPoint ? ws.changeSelectionStartPoint(dc, dr, isCoord, isSelectMode, isCtrl) :
      ws.changeSelectionEndPoint(dc, dr, isCoord, isSelectMode);
    if (!isCoord && !isStartPoint && !isSelectMode) {
      // Выделение с зажатым shift
      this.canUpdateAfterShiftUp = true;
    }
    asc_applyFunction(callback, d);
  };

  // Окончание выделения
  WorkbookView.prototype._onChangeSelectionDone = function(x, y) {
    if (c_oAscSelectionDialogType.None !== this.selectionDialogType) {
      return;
    }
    var ws = this.getWorksheet();
    ws.changeSelectionDone();
    this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
    // Проверим, нужно ли отсылать информацию о ячейке
    var ar = ws.model.selectionRange.getLast();
    var isSelectOnShape = ws.getSelectionShape();
    if (!this._isEqualRange(ar, isSelectOnShape)) {
      this._onWSSelectionChanged();
      this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
    }

    // Нужно очистить поиск
    this._cleanFindResults();

    var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

    if (c_oTargetType.Hyperlink === ct.target) {
      // Проверим замерженность
      var isHyperlinkClick = false;
      if (ar.isOneCell() || isSelectOnShape) {
        isHyperlinkClick = true;
      } else {
        var mergedRange = ws.model.getMergedByCell(ar.r1, ar.c1);
        if (mergedRange && ar.isEqual(mergedRange)) {
          isHyperlinkClick = true;
        }
      }
      if (isHyperlinkClick) {
        if (false === ct.hyperlink.hyperlinkModel.getVisited() && !isSelectOnShape) {
          ct.hyperlink.hyperlinkModel.setVisited(true);
          if (ct.hyperlink.hyperlinkModel.Ref) {
            ws.updateRange(ct.hyperlink.hyperlinkModel.Ref.getBBox0(), false, false);
          }
        }
        switch (ct.hyperlink.asc_getType()) {
          case Asc.c_oAscHyperlinkType.WebLink:
            this.handlers.trigger("asc_onHyperlinkClick", ct.hyperlink.asc_getHyperlinkUrl());
            break;
          case Asc.c_oAscHyperlinkType.RangeLink:
            // ToDo надо поправить отрисовку комментария для данной ячейки (с которой уходим)
            this.handlers.trigger("asc_onHideComment");
            this.Api._asc_setWorksheetRange(ct.hyperlink);
            break;
        }
      }
    }
  };

  // Обработка нажатия правой кнопки мыши
  WorkbookView.prototype._onChangeSelectionRightClick = function(dc, dr) {
    var ws = this.getWorksheet();
    ws.changeSelectionStartPointRightClick(dc, dr);
  };

  // Обработка движения в выделенной области
  WorkbookView.prototype._onSelectionActivePointChanged = function(dc, dr, callback) {
    var ws = this.getWorksheet();
    var d = ws.changeSelectionActivePoint(dc, dr);
    asc_applyFunction(callback, d);
  };

  WorkbookView.prototype._onUpdateWorksheet = function(canvasElem, x, y, ctrlKey, callback) {
    var ws = this.getWorksheet(), ct = undefined;
    var arrMouseMoveObjects = [];					// Теперь это массив из объектов, над которыми курсор

    //ToDo: включить определение target, если находимся в режиме редактирования ячейки.
    if (this.getCellEditMode() && !this.controller.isFormulaEditMode) {
      canvasElem.style.cursor = "";
    } else if (x === undefined && y === undefined) {
      ws.cleanHighlightedHeaders();
    } else {
      ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

      // Отправление эвента об удалении всего листа (именно удалении, т.к. если просто залочен, то не рисуем рамку вокруг)
      if (undefined !== ct.userIdAllSheet) {
        arrMouseMoveObjects.push(new asc_CMM({
          type: c_oAscMouseMoveType.LockedObject,
          x: ct.lockAllPosLeft,
          y: ct.lockAllPosTop,
          userId: ct.userIdAllSheet,
          lockedObjectType: Asc.c_oAscMouseMoveLockedObjectType.Sheet
        }));
      } else {
        // Отправление эвента о залоченности свойств всего листа (только если не удален весь лист)
        if (undefined !== ct.userIdAllProps) {
          arrMouseMoveObjects.push(new asc_CMM({
            type: c_oAscMouseMoveType.LockedObject,
            x: ct.lockAllPosLeft,
            y: ct.lockAllPosTop,
            userId: ct.userIdAllProps,
            lockedObjectType: Asc.c_oAscMouseMoveLockedObjectType.TableProperties
          }));
        }
      }
      // Отправление эвента о наведении на залоченный объект
      if (undefined !== ct.userId) {
        arrMouseMoveObjects.push(new asc_CMM({
          type: c_oAscMouseMoveType.LockedObject,
          x: ct.lockRangePosLeft,
          y: ct.lockRangePosTop,
          userId: ct.userId,
          lockedObjectType: Asc.c_oAscMouseMoveLockedObjectType.Range
        }));
      }

      // Проверяем комментарии ячейки
      if (undefined !== ct.commentIndexes) {
        arrMouseMoveObjects.push(new asc_CMM({
          type: c_oAscMouseMoveType.Comment,
          x: ct.commentCoords.asc_getLeftPX(),
          reverseX: ct.commentCoords.asc_getReverseLeftPX(),
          y: ct.commentCoords.asc_getTopPX(),
          aCommentIndexes: ct.commentIndexes
        }));
      }
      // Проверяем гиперссылку
      if (ct.target === c_oTargetType.Hyperlink) {
        if (true === ctrlKey) {
          // Мы без нажатия на гиперлинк
        } else {
          ct.cursor = ct.cellCursor.cursor;
        }
        arrMouseMoveObjects.push(new asc_CMM({
          type: c_oAscMouseMoveType.Hyperlink, x: x, y: y, hyperlink: ct.hyperlink
        }));
      }

      /* Проверяем, может мы на никаком объекте (такая схема оказалась приемлимой
       * для отдела разработки приложений)
       */
      if (0 === arrMouseMoveObjects.length) {
        // Отправляем эвент, что мы ни на какой области
        arrMouseMoveObjects.push(new asc_CMM({type: c_oAscMouseMoveType.None}));
      }
      // Отсылаем эвент с объектами
      this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);

      if (ct.target === c_oTargetType.MoveRange && ctrlKey && ct.cursor == "move") {
        ct.cursor = "copy";
      }

      if (canvasElem.style.cursor !== ct.cursor) {
        canvasElem.style.cursor = ct.cursor;
      }
      if (ct.target === c_oTargetType.ColumnHeader || ct.target === c_oTargetType.RowHeader) {
        ws.drawHighlightedHeaders(ct.col, ct.row);
      } else {
        ws.cleanHighlightedHeaders();
      }
    }
    asc_applyFunction(callback, ct);
  };

  WorkbookView.prototype._onResizeElement = function(target, x, y) {
    var arrMouseMoveObjects = [];
    if (target.target === c_oTargetType.ColumnResize) {
      arrMouseMoveObjects.push(this.getWorksheet().drawColumnGuides(target.col, x, y, target.mouseX));
    } else if (target.target === c_oTargetType.RowResize) {
      arrMouseMoveObjects.push(this.getWorksheet().drawRowGuides(target.row, x, y, target.mouseY));
    }

    /* Проверяем, может мы на никаком объекте (такая схема оказалась приемлимой
     * для отдела разработки приложений)
     */
    if (0 === arrMouseMoveObjects.length) {
      // Отправляем эвент, что мы ни на какой области
      arrMouseMoveObjects.push(new asc_CMM({type: c_oAscMouseMoveType.None}));
    }
    // Отсылаем эвент с объектами
    this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);
  };

  WorkbookView.prototype._onResizeElementDone = function(target, x, y, isResizeModeMove) {
    var ws = this.getWorksheet();
    if (isResizeModeMove) {
      if (ws.objectRender) {
        ws.objectRender.saveSizeDrawingObjects();
      }
      if (target.target === c_oTargetType.ColumnResize) {
        ws.changeColumnWidth(target.col, x, target.mouseX);
      } else if (target.target === c_oTargetType.RowResize) {
        ws.changeRowHeight(target.row, y, target.mouseY);
      }

      ws.cellCommentator.updateCommentPosition();
      this._onDocumentPlaceChanged();
    }
    ws.draw();

    // Отсылаем окончание смены размеров (в FF не срабатывало обычное движение)
    this.handlers.trigger("asc_onMouseMove", [new asc_CMM({type: c_oAscMouseMoveType.None})]);
  };

  // Обработка автозаполнения
  WorkbookView.prototype._onChangeFillHandle = function(x, y, callback) {
    var ws = this.getWorksheet();
    var d = ws.changeSelectionFillHandle(x, y);
    asc_applyFunction(callback, d);
  };

  // Обработка окончания автозаполнения
  WorkbookView.prototype._onChangeFillHandleDone = function(x, y, ctrlPress) {
    var ws = this.getWorksheet();
    ws.applyFillHandle(x, y, ctrlPress);
  };

  // Обработка перемещения диапазона
  WorkbookView.prototype._onMoveRangeHandle = function(x, y, callback) {
    var ws = this.getWorksheet();
    var d = ws.changeSelectionMoveRangeHandle(x, y);
    asc_applyFunction(callback, d);
  };

  // Обработка окончания перемещения диапазона
  WorkbookView.prototype._onMoveRangeHandleDone = function(ctrlKey) {
    var ws = this.getWorksheet();
    ws.applyMoveRangeHandle(ctrlKey);
  };

  WorkbookView.prototype._onMoveResizeRangeHandle = function(x, y, target, callback) {
    var ws = this.getWorksheet();
    var d = ws.changeSelectionMoveResizeRangeHandle(x, y, target, this.cellEditor);
    asc_applyFunction(callback, d);
  };

  WorkbookView.prototype._onMoveResizeRangeHandleDone = function(target) {
    var ws = this.getWorksheet();
    ws.applyMoveResizeRangeHandle(target);
  };

  // Frozen anchor
  WorkbookView.prototype._onMoveFrozenAnchorHandle = function(x, y, target) {
    var ws = this.getWorksheet();
    ws.drawFrozenGuides(x, y, target);
  };

  WorkbookView.prototype._onMoveFrozenAnchorHandleDone = function(x, y, target) {
    // Закрепляем область
    var ws = this.getWorksheet();
    ws.applyFrozenAnchor(x, y, target);
  };

  WorkbookView.prototype.showAutoComplete = function() {
    var ws = this.getWorksheet();
    var arrValues = ws.getCellAutoCompleteValues(ws.model.selectionRange.activeCell);
    this.handlers.trigger('asc_onEntriesListMenu', arrValues);
  };

  WorkbookView.prototype._onAutoFiltersClick = function(idFilter) {
    this.getWorksheet().af_setDialogProp(idFilter);
  };

  WorkbookView.prototype._onCommentCellClick = function(x, y) {
    var ws = this.getWorksheet();
    var comments = ws.cellCommentator.getCommentsXY(x, y);
    if (comments.length) {
      ws.cellCommentator.showComment(comments[0].asc_getId());
    }
  };

  WorkbookView.prototype._onUpdateSelectionName = function() {
    if (this.canUpdateAfterShiftUp) {
      this.canUpdateAfterShiftUp = false;
      var ws = this.getWorksheet();
      this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
    }
  };

  WorkbookView.prototype._onStopFormatPainter = function() {
    if (this.stateFormatPainter) {
      this.formatPainter(c_oAscFormatPainterState.kOff);
    }
  };

  // Shapes
  WorkbookView.prototype._onGraphicObjectMouseDown = function(e, x, y) {
    var ws = this.getWorksheet();
    ws.objectRender.graphicObjectMouseDown(e, x, y);
  };

  WorkbookView.prototype._onGraphicObjectMouseMove = function(e, x, y) {
    var ws = this.getWorksheet();
    ws.objectRender.graphicObjectMouseMove(e, x, y);
  };

  WorkbookView.prototype._onGraphicObjectMouseUp = function(e, x, y) {
    var ws = this.getWorksheet();
    ws.objectRender.graphicObjectMouseUp(e, x, y);
  };

  WorkbookView.prototype._onGraphicObjectMouseUpEx = function(e, x, y) {
    //var ws = this.getWorksheet();
    //ws.objectRender.coordsManager.calculateCell(x, y);
  };

  WorkbookView.prototype._onGraphicObjectWindowKeyDown = function(e) {
    var objectRender = this.getWorksheet().objectRender;
    return (0 < objectRender.getSelectedGraphicObjects().length) ? objectRender.graphicObjectKeyDown(e) : false;
  };

  WorkbookView.prototype._onGraphicObjectWindowKeyPress = function(e) {
    var objectRender = this.getWorksheet().objectRender;
    return (0 < objectRender.getSelectedGraphicObjects().length) ? objectRender.graphicObjectKeyPress(e) : false;
  };

  WorkbookView.prototype._onGetGraphicsInfo = function(x, y) {
    var ws = this.getWorksheet();
    return ws.objectRender.checkCursorDrawingObject(x, y);
  };

  WorkbookView.prototype._onUpdateSelectionShape = function(isSelectOnShape) {
    var ws = this.getWorksheet();
    return ws.setSelectionShape(isSelectOnShape);
  };

  // Double click
  WorkbookView.prototype._onMouseDblClick = function(x, y, isHideCursor, callback) {
    var ws = this.getWorksheet();
    var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);

    if (ct.target === c_oTargetType.ColumnResize || ct.target === c_oTargetType.RowResize) {
      ct.target === c_oTargetType.ColumnResize ? ws.autoFitColumnWidth(ct.col, ct.col) : ws.autoFitRowHeight(ct.row, ct.row);
      asc_applyFunction(callback);
    } else {
      if (ct.col >= 0 && ct.row >= 0) {
        this.controller.setStrictClose(!ws._isCellEmptyText(ct.col, ct.row));
      }

      // Для нажатия на колонку/строку/all/frozenMove обрабатывать dblClick не нужно
      if (c_oTargetType.ColumnHeader === ct.target || c_oTargetType.RowHeader === ct.target || c_oTargetType.Corner === ct.target || c_oTargetType.FrozenAnchorH === ct.target || c_oTargetType.FrozenAnchorV === ct.target) {
        asc_applyFunction(callback);
        return;
      }

      if (ws.objectRender.checkCursorDrawingObject(x, y)) {
        asc_applyFunction(callback);
        return;
      }

      // При dbl клике фокус выставляем в зависимости от наличия текста в ячейке
      this._onEditCell(/*isFocus*/undefined, /*isClearCell*/undefined, /*isHideCursor*/isHideCursor, /*isQuickInput*/false);
    }
  };

  WorkbookView.prototype._onEditCell = function(isFocus, isClearCell, isHideCursor, isQuickInput, callback) {
    var t = this;

    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock() || this.controller.isResizeMode) {
      return;
    }

    var ws = t.getWorksheet();
    var activeCellRange = ws.getActiveCell(0, 0, false);
    var selectionRange = ws.model.selectionRange.clone();

    var editFunction = function() {
      t.setCellEditMode(true);
      ws.setCellEditMode(true);
      ws.openCellEditor(t.cellEditor, /*fragments*/undefined, /*cursorPos*/undefined, isFocus, isClearCell,
        /*isHideCursor*/isHideCursor, /*isQuickInput*/isQuickInput, selectionRange);
      t.input.disabled = false;
      t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);

      // Эвент на обновление состояния редактора
      t.cellEditor._updateEditorState();
      asc_applyFunction(callback, true);
    };

    var editLockCallback = function(res) {
      if (!res) {
        t.setCellEditMode(false);
        t.controller.setStrictClose(false);
        t.controller.setFormulaEditMode(false);
        ws.setCellEditMode(false);
        ws.setFormulaEditMode(false);
        t.input.disabled = true;

        // Выключаем lock для редактирования ячейки
        t.collaborativeEditing.onStopEditCell();
        t.cellEditor.close(false);
        t._onWSSelectionChanged();
      }
    };

    // Стартуем редактировать ячейку
    this.collaborativeEditing.onStartEditCell();
    if (ws._isLockedCells(activeCellRange, /*subType*/null, editLockCallback)) {
      editFunction();
    }
  };

  WorkbookView.prototype._onStopCellEditing = function() {
    return this.cellEditor.close(true);
  };

  WorkbookView.prototype._onCloseCellEditor = function() {
    this.setCellEditMode(false);
    this.controller.setStrictClose(false);
    this.controller.setFormulaEditMode(false);
      var ws = this.getWorksheet(), isCellEditMode, index;
	  isCellEditMode = ws.getCellEditMode();
      ws.setCellEditMode(false);

      if( this.cellFormulaEnterWSOpen ){
		  index = this.cellFormulaEnterWSOpen.model.getIndex();
		  isCellEditMode = isCellEditMode ? isCellEditMode : this.cellFormulaEnterWSOpen.getCellEditMode();
		  this.cellFormulaEnterWSOpen.setCellEditMode(false);
		  this.cellFormulaEnterWSOpen = null;
		  if( index != ws.model.getIndex() ){
			  this.showWorksheet(index);
			  this.handlers.trigger("asc_onActiveSheetChanged", index);
		  }
		  ws = this.getWorksheet(index);
     }

	  ws.cleanSelection();

	  for (var i in this.wsViews) {
		  this.wsViews[i].setFormulaEditMode(false);
		  this.wsViews[i].cleanFormulaRanges();
	  }

	  ws.updateSelectionWithSparklines();

    if (isCellEditMode) {
      this.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
    }
    // Обновляем состояние Undo/Redo
    History._sendCanUndoRedo();
    // Обновляем состояние информации
    this._onWSSelectionChanged();

    // Закрываем подбор формулы
    if (-1 !== this.lastFormulaPos) {
      this.handlers.trigger('asc_onFormulaCompleteMenu', null);
      this.lastFormulaPos = -1;
      this.lastFormulaNameLength = 0;
    }

  };

  WorkbookView.prototype._onEmpty = function() {
    this.getWorksheet().emptySelection(c_oAscCleanOptions.Text);
  };

  WorkbookView.prototype._onAddColumn = function() {
    var res = this.getWorksheet().expandColsOnScroll(true);
    this.controller.reinitializeScroll(/*horizontal*/2, !res);
  };

  WorkbookView.prototype._onAddRow = function() {
    var res = this.getWorksheet().expandRowsOnScroll(true);
    this.controller.reinitializeScroll(/*vertical*/1, !res);
  };

  WorkbookView.prototype._onShowNextPrevWorksheet = function(direction) {
    // Колличество листов
    var countWorksheets = this.model.getWorksheetCount();
    // Покажем следующий лист или предыдущий (если больше нет)
    var i = this.wsActive + direction, ws;
    while (i !== this.wsActive) {
      if (0 > i) {
        i = countWorksheets - 1;
      } else  if (i >= countWorksheets) {
        i = 0;
      }

      ws = this.model.getWorksheet(i);
      if (!ws.getHidden()) {
        this.showWorksheet(i);
        this.handlers.trigger("asc_onActiveSheetChanged", i);
        return true;
      }

      i += direction;
    }
    return false;
  };

  WorkbookView.prototype._onSetFontAttributes = function(prop) {
    var val;
    var selectionInfo = this.getWorksheet().getSelectionInfo().asc_getFont();
    switch (prop) {
      case "b":
        val = !(selectionInfo.asc_getBold());
        break;
      case "i":
        val = !(selectionInfo.asc_getItalic());
        break;
      case "u":
        // ToDo для двойного подчеркивания нужно будет немного переделать схему
        val = !(selectionInfo.asc_getUnderline());
        val = val ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
        break;
      case "s":
        val = !(selectionInfo.asc_getStrikeout());
        break;
    }
    return this.setFontAttributes(prop, val);
  };

  WorkbookView.prototype._onSelectColumnsByRange = function() {
    this.getWorksheet()._selectColumnsByRange();
  };

  WorkbookView.prototype._onSelectRowsByRange = function() {
    this.getWorksheet()._selectRowsByRange();
  };

  WorkbookView.prototype._onShowCellEditorCursor = function() {
    var ws = this.getWorksheet();
    // Показываем курсор
    if (ws.getCellEditMode()) {
      this.cellEditor.showCursor();
    }
  };

  WorkbookView.prototype._onDocumentPlaceChanged = function() {
    if (this.isDocumentPlaceChangedEnabled) {
      this.handlers.trigger("asc_onDocumentPlaceChanged");
    }
  };

  WorkbookView.prototype.getTablePictures = function(props) {
      return this.af_getTablePictures(this.model, this.fmgrGraphics, this.m_oFont, props);
  };

  WorkbookView.prototype.getCellStyles = function() {
    var oStylesPainter = new asc_CSP();
    oStylesPainter.generateStylesAll(this.model.CellStyles, this.fmgrGraphics, this.m_oFont, this.stringRender);
    return oStylesPainter;
  };

  WorkbookView.prototype.getWorksheetById = function(id, onlyExist) {
    var wsModel = this.model.getWorksheetById(id);
    if (wsModel) {
      return this.getWorksheet(wsModel.getIndex(), onlyExist);
    }
    return null;
  };

  /**
   * @param {Number} [index]
   * @param {Boolean} [onlyExist]
   * @return {AscCommonExcel.WorksheetView}
   */
  WorkbookView.prototype.getWorksheet = function(index, onlyExist) {
    var wb = this.model;
    var i = asc_typeof(index) === "number" && index >= 0 ? index : wb.getActive();
    var ws = this.wsViews[i];
    if (null == ws && !onlyExist) {
      ws = this.wsViews[i] = this._createWorksheetView(wb.getWorksheet(i));
      ws._prepareComments();
      ws._prepareDrawingObjects();
    }
    return ws;
  };

  /**
   *
   * @param index
   * @param [isResized]
   * @param [bLockDraw]
   * @returns {WorkbookView}
   */
  WorkbookView.prototype.showWorksheet = function (index, isResized, bLockDraw) {
    if (index === this.wsActive) {
      return this;
    }

    var isSendInfo = (-1 === this.wsActive) || !isResized, tmpWorksheet, selectionRange = null;
    // Только если есть активный
    if (-1 !== this.wsActive) {
      var ws = this.getWorksheet();
      // Останавливаем ввод данных в редакторе ввода. Если в режиме ввода формул, то продолжаем работать с cellEditor'ом, чтобы можно было
      // выбирать ячейки для формулы
      if (ws.getCellEditMode()) {
        if (this.cellEditor && this.cellEditor.formulaIsOperator()) {

          this.copyActiveSheet = this.wsActive;
          if (!this.cellFormulaEnterWSOpen) {
            this.cellFormulaEnterWSOpen = ws;
          } else {
            ws.setFormulaEditMode(false);
          }
        } else {
          if (!isResized) {
            this._onStopCellEditing();
          }
        }
      }
      // Делаем очистку селекта
      ws.cleanSelection();
      this.stopTarget(ws);

    }

    if (c_oAscSelectionDialogType.Chart === this.selectionDialogType) {
      // Когда идет выбор диапазона, то должны на закрываемом листе отменить выбор диапазона
      tmpWorksheet = this.getWorksheet();
      selectionRange = tmpWorksheet.model.selectionRange.getLast().clone(true);
      tmpWorksheet.setSelectionDialogMode(c_oAscSelectionDialogType.None);
    }
    if (this.stateFormatPainter) {
      // Должны отменить выбор на закрываемом листе
      this.getWorksheet().formatPainter(c_oAscFormatPainterState.kOff);
    }

    var wb = this.model;
    if (asc_typeof(index) === "number" && index >= 0) {
      if (index !== wb.getActive()) {
        wb.setActive(index);
      }
    } else {
      index = wb.getActive();
    }
    this.wsActive = index;
    this.wsMustDraw = bLockDraw;

    ws = this.getWorksheet(index);
    // Мы делали resize или меняли zoom, но не перерисовывали данный лист (он был не активный)
    if (ws.updateResize && ws.updateZoom) {
      ws.changeZoomResize();
    } else if (ws.updateResize) {
      ws.resize(true);
    } else if (ws.updateZoom) {
      ws.changeZoom(true);
    }

    if (this.cellEditor && this.cellFormulaEnterWSOpen) {
      if (ws === this.cellFormulaEnterWSOpen) {
        this.cellFormulaEnterWSOpen.setFormulaEditMode(true);
        this.cellEditor._showCanvas();
      } else if (this.cellFormulaEnterWSOpen.getCellEditMode() && this.cellEditor.isFormula()) {
        this.cellFormulaEnterWSOpen.setFormulaEditMode(false);
        /*скрываем cellEditor, в редактор добавляем %selected sheet name%+"!" */
        this.cellEditor._hideCanvas();
        ws.cleanSelection();
        ws.setFormulaEditMode(true);
      }
    }

    if (!bLockDraw) {
      ws.draw();
    }

    if (c_oAscSelectionDialogType.Chart === this.selectionDialogType) {
      // Когда идет выбор диапазона, то на показываемом листе должны выставить нужный режим
      ws.setSelectionDialogMode(this.selectionDialogType, selectionRange);
      this.handlers.trigger("asc_onSelectionRangeChanged", ws.getSelectionRangeValue());
    }
    if (this.stateFormatPainter) {
      // Должны отменить выбор на закрываемом листе
      this.getWorksheet().formatPainter(this.stateFormatPainter);
    }
    if (!bLockDraw) {
      ws.objectRender.controller.updateSelectionState();
      ws.objectRender.controller.updateOverlay();
    }

    if (isSendInfo) {
      this._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
      this._onWSSelectionChanged();
      this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
    }
    this.controller.reinitializeScroll();
    if (this.Api.isMobileVersion) {
      this.MobileTouchManager.Resize();
    }
    // Zoom теперь на каждом листе одинаковый, не отправляем смену

    // Нужно очистить поиск
    this._cleanFindResults();
    return this;
  };

  /** @param nIndex {Number} массив индексов */
  WorkbookView.prototype.removeWorksheet = function(nIndex) {
    this.stopTarget(null);
    this.wsViews.splice(nIndex, 1);
    // Сбрасываем активный (чтобы не досчитывать после смены)
    this.wsActive = -1;
  };

  // Меняет местами 2 элемента просмотра
  WorkbookView.prototype.replaceWorksheet = function(indexFrom, indexTo) {
    // Только если есть активный
    if (-1 !== this.wsActive) {
      var ws = this.getWorksheet(this.wsActive);
      // Останавливаем ввод данных в редакторе ввода
      if (ws.getCellEditMode()) {
        this._onStopCellEditing();
      }
      // Делаем очистку селекта
      ws.cleanSelection();

      this.stopTarget(ws);
      this.wsActive = -1;
      // Чтобы поменять, нужно его добавить
      this.getWorksheet(indexTo);
    }
    var movedSheet = this.wsViews.splice(indexFrom, 1);
    this.wsViews.splice(indexTo, 0, movedSheet[0])
  };

  WorkbookView.prototype.stopTarget = function(ws) {
    if (null === ws && -1 !== this.wsActive) {
      ws = this.getWorksheet(this.wsActive);
    }
    if (null !== ws && ws.objectRender && ws.objectRender.drawingDocument) {
      ws.objectRender.drawingDocument.TargetEnd();
    }
  };

  // Копирует элемент перед другим элементом
  WorkbookView.prototype.copyWorksheet = function(index, insertBefore) {
    // Только если есть активный
    if (-1 !== this.wsActive) {
      var ws = this.getWorksheet();
      // Останавливаем ввод данных в редакторе ввода
      if (ws.getCellEditMode()) {
        this._onStopCellEditing();
      }
      // Делаем очистку селекта
      ws.cleanSelection();

      this.stopTarget(ws);
      this.wsActive = -1;
    }

    if (null != insertBefore && insertBefore >= 0 && insertBefore < this.wsViews.length) {
      // Помещаем нулевой элемент перед insertBefore
      this.wsViews.splice(insertBefore, 0, null);
    }
  };

  WorkbookView.prototype.updateWorksheetByModel = function() {
    // ToDo Сделал небольшую заглушку с показом листа. Нужно как мне кажется перейти от wsViews на wsViewsId (хранить по id)
    var oldActiveWs;
    if (-1 !== this.wsActive) {
      oldActiveWs = this.wsViews[this.wsActive];
    }

    //расставляем ws так как они идут в модели.
    var oNewWsViews = [];
    for (var i in this.wsViews) {
      var item = this.wsViews[i];
      if (null != item && null != this.model.getWorksheetById(item.model.getId())) {
        oNewWsViews[item.model.getIndex()] = item;
      }
    }
    this.wsViews = oNewWsViews;
    var wsActive = this.model.getActive();

    var newActiveWs = this.wsViews[wsActive];
    if (undefined === newActiveWs || oldActiveWs !== newActiveWs) {
      // Если сменили, то покажем
      this.wsActive = -1;
      this.showWorksheet(undefined, false, true);
    } else {
      this.wsActive = wsActive;
    }
  };

  WorkbookView.prototype.spliceWorksheet = function() {
    this.stopTarget(null);
    this.wsViews.splice.apply(this.wsViews, arguments);
    this.wsActive = -1;
  };

  WorkbookView.prototype._canResize = function() {
    var oldWidth = this.canvas.width;
    var oldHeight = this.canvas.height;
    var width = this.element.offsetWidth - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.widthPx);
    var height = this.element.offsetHeight - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.heightPx);
    var styleWidth, styleHeight, isRetina = AscBrowser.isRetina;

    if (isRetina) {
      styleWidth = width;
      styleHeight = height;
      width <<= 1;
      height <<= 1;
    }

    if (oldWidth === width && oldHeight === height) {
      return false;
    }

    this.canvas.width = this.canvasOverlay.width = this.canvasGraphic.width = this.canvasGraphicOverlay.width = width;
    this.canvas.height = this.canvasOverlay.height = this.canvasGraphic.height = this.canvasGraphicOverlay.height = height;
    if (isRetina) {
      this.canvas.style.width = this.canvasOverlay.style.width = this.canvasGraphic.style.width = this.canvasGraphicOverlay.style.width = styleWidth + 'px';
      this.canvas.style.height = this.canvasOverlay.style.height = this.canvasGraphic.style.height = this.canvasGraphicOverlay.style.height = styleHeight + 'px';
    } else {
      this.canvas.style.width = this.canvasOverlay.style.width = this.canvasGraphic.style.width = this.canvasGraphicOverlay.style.width = width + 'px';
      this.canvas.style.height = this.canvasOverlay.style.height = this.canvasGraphic.style.height = this.canvasGraphicOverlay.style.height = height + 'px';
    }

    // При смене ориентации у планшета, сбрасываются флаги у canvas!
    // ToDo перепроверить на новых исходниках, должно поправиться, был баг в отрисовке!!!!!!!!!!!!!
    //this.drawingCtx.initContextSmoothing();
    //this.overlayCtx.initContextSmoothing();
    return true;
  };

  /** @param event {jQuery.Event} */
  WorkbookView.prototype.resize = function(event) {
    if (this._canResize()) {
      var item;
      var activeIndex = this.model.getActive();
      for (var i in this.wsViews) {
        item = this.wsViews[i];
        // Делаем resize (для не активных сменим как только сделаем его активным)
        item.resize(/*isDraw*/i == activeIndex);
      }
      this.showWorksheet(undefined, true);
    } else {
      // ToDo не должно происходить ничего, но нам приходит resize сверху, поэтому проверим отрисовывали ли мы
      if (-1 === this.wsActive || this.wsMustDraw) {
        this.showWorksheet(undefined, true);
      }
    }
    this.wsMustDraw = false;
  };

  WorkbookView.prototype.getSelectionInfo = function () {
    if (!this.oSelectionInfo) {
      this._updateSelectionInfo();
    }
    return this.oSelectionInfo;
  };

  // Получаем свойство: редактируем мы сейчас или нет
  WorkbookView.prototype.getCellEditMode = function() {
	  return this.isCellEditMode;
  };

	WorkbookView.prototype.setCellEditMode = function(flag) {
		this.isCellEditMode = !!flag;
	};

  WorkbookView.prototype.getIsTrackShape = function() {
    var ws = this.getWorksheet();
    if (!ws) {
      return false;
    }
    if (ws.objectRender && ws.objectRender.controller) {
      return ws.objectRender.controller.checkTrackDrawings();
    }
  };

  WorkbookView.prototype.getZoom = function() {
    return this.drawingCtx.getZoom();
  };

  WorkbookView.prototype.changeZoom = function(factor) {
    if (factor === this.getZoom()) {
      return;
    }

    this.buffers.main.changeZoom(factor);
    this.buffers.overlay.changeZoom(factor);
    this.buffers.mainGraphic.changeZoom(factor);
    this.buffers.overlayGraphic.changeZoom(factor);
    // Нужно сбросить кэш букв
    var i, length;
    for (i = 0, length = this.fmgrGraphics.length; i < length; ++i)
      this.fmgrGraphics[i].ClearFontsRasterCache();

    var item;
    var activeIndex = this.model.getActive();
    for (i in this.wsViews) {
      item = this.wsViews[i];
      // Меняем zoom (для не активных сменим как только сделаем его активным)
      item.changeZoom(/*isDraw*/i == activeIndex);
      item.objectRender.changeZoom(this.drawingCtx.scaleFactor);
      if (i == activeIndex) {
        item.draw();
        //ToDo item.drawDepCells();
      }
    }

    this.controller.reinitializeScroll();
    this.handlers.trigger("asc_onZoomChanged", this.getZoom());
  };

  WorkbookView.prototype.getEnableKeyEventsHandler = function(bIsNaturalFocus) {
    var res = this.enableKeyEvents;
    if (res && bIsNaturalFocus && this.getCellEditMode() && this.input.isFocused) {
      res = false;
    }
    return res;
  };
  WorkbookView.prototype.enableKeyEventsHandler = function(f) {
    this.enableKeyEvents = !!f;
    this.controller.enableKeyEventsHandler(this.enableKeyEvents);
    if (this.cellEditor) {
      this.cellEditor.enableKeyEventsHandler(this.enableKeyEvents);
    }
  };

  // Останавливаем ввод данных в редакторе ввода
  WorkbookView.prototype.closeCellEditor = function() {
    var ws = this.getWorksheet();
    // Останавливаем ввод данных в редакторе ввода
    if (ws.getCellEditMode() && !this.cellEditor.formulaIsOperator() /*&& !this.cellFormulaEnterWSOpen*/) {
      this._onStopCellEditing();
    }
  };

  WorkbookView.prototype.restoreFocus = function() {
    if (window["NATIVE_EDITOR_ENJINE"]) {
      return;
    }

    if (this.cellEditor.hasFocus) {
      this.cellEditor.restoreFocus();
    }
  };

  WorkbookView.prototype._onUpdateCellEditor = function(text, cursorPosition, isFormula, formulaPos, formulaName) {
    if (this.skipHelpSelector) {
      return;
    }
    // ToDo для ускорения можно завести объект, куда класть результаты поиска по формулам и второй раз не искать.
    var i, arrResult = [], defNamesList, defName;
    if (isFormula && formulaName) {
      formulaName = formulaName.toUpperCase();
      for (i = 0; i < this.formulasList.length; ++i) {
        if (0 === this.formulasList[i].indexOf(formulaName)) {
          arrResult.push(new AscCommonExcel.asc_CCompleteMenu(this.formulasList[i], c_oAscPopUpSelectorType.Func));
        }
      }
      defNamesList = this.getDefinedNames(Asc.c_oAscGetDefinedNamesList.WorksheetWorkbook);
      formulaName = formulaName.toLowerCase();
      for (i = 0; i < defNamesList.length; ++i) {
        defName = defNamesList[i];
        if (0 === defName.Name.toLowerCase().indexOf(formulaName)) {
          arrResult.push(new AscCommonExcel.asc_CCompleteMenu(defName.Name, !defName.isTable ? c_oAscPopUpSelectorType.Range : c_oAscPopUpSelectorType.Table));
        }
      }
    }
    if (0 < arrResult.length) {
      this.handlers.trigger('asc_onFormulaCompleteMenu', arrResult);

      this.lastFormulaPos = formulaPos;
      this.lastFormulaNameLength = formulaName.length;
    } else {
      this.handlers.trigger('asc_onFormulaCompleteMenu', null);

      this.lastFormulaPos = -1;
      this.lastFormulaNameLength = 0;
    }
  };

  // Вставка формулы в редактор
  WorkbookView.prototype.insertFormulaInEditor = function(name, type, autoComplete) {
    var t = this, ws = this.getWorksheet(), cursorPos, isNotFunction, tmp;

    if (c_oAscPopUpSelectorType.None === type) {
      this.getWorksheet().setSelectionInfo("value", name, /*onlyActive*/true);
      return;
    }

    isNotFunction = c_oAscPopUpSelectorType.Func !== type;

    // Проверяем, открыт ли редактор
    if (ws.getCellEditMode()) {
      if (isNotFunction) {
        this.skipHelpSelector = true;
      }
      if (-1 !== this.lastFormulaPos) {
        if (-1 === this.arrExcludeFormulas.indexOf(name) && !isNotFunction) {
          name += '('; // ToDo сделать проверки при добавлении, чтобы не вызывать постоянно окно
        } else {
          this.skipHelpSelector = true;
        }
        tmp = this.cellEditor.skipTLUpdate;
        this.cellEditor.skipTLUpdate = false;
        this.cellEditor.replaceText(this.lastFormulaPos, this.lastFormulaNameLength, name);
        this.cellEditor.skipTLUpdate = tmp;
      } else if (false === this.cellEditor.insertFormula(name, isNotFunction)) {
        // Не смогли вставить формулу, закроем редактор, с сохранением текста
        this.cellEditor.close(true);
      }
      this.skipHelpSelector = false;
    } else {
      // Проверка глобального лока
      if (this.collaborativeEditing.getGlobalLock()) {
        return false;
      }

      // Редактор закрыт
      var cellRange = null;
      // Если нужно сделать автозаполнение формулы, то ищем ячейки)
      if (autoComplete) {
        cellRange = ws.autoCompleteFormula(name);
      }
      if (isNotFunction) {
        name = "=" + name;
      } else {
        if (cellRange) {
          if (cellRange.notEditCell) {
            // Мы уже ввели все что нужно, редактор открывать не нужно
            return;
          }
          // Меняем значение ячейки
          name = "=" + name + "(" + cellRange.text + ")";
        } else {
          // Меняем значение ячейки
          name = "=" + name + "()";
        }
        // Вычисляем позицию курсора (он должен быть в функции)
        cursorPos = name.length - 1;
      }

      var selectionRange = ws.model.selectionRange.clone();

      var openEditor = function(res) {
        if (res) {
          // Выставляем переменные, что мы редактируем
          t.setCellEditMode(true);
          ws.setCellEditMode(true);

          t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
          if (isNotFunction) {
            t.skipHelpSelector = true;
          }
          // Открываем, с выставлением позиции курсора
          if (!ws.openCellEditorWithText(t.cellEditor, name, cursorPos, /*isFocus*/false, selectionRange)) {
            t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
            t.setCellEditMode(false);
            t.controller.setStrictClose(false);
            t.controller.setFormulaEditMode(false);
            ws.setCellEditMode(false);
            ws.setFormulaEditMode(false);
          }
          if (isNotFunction) {
            t.skipHelpSelector = false;
          }
        } else {
          t.setCellEditMode(false);
          t.controller.setStrictClose(false);
          t.controller.setFormulaEditMode(false);
          ws.setCellEditMode(false);
          ws.setFormulaEditMode(false);
        }
      };

      var activeCellRange = ws.getActiveCell(0, 0, false);
      ws._isLockedCells(activeCellRange, /*subType*/null, openEditor);
    }
  };

  WorkbookView.prototype.bIsEmptyClipboard = function() {
    return this.clipboard.bIsEmptyClipboard(this.getCellEditMode());
  };

   WorkbookView.prototype.checkCopyToClipboard = function(_clipboard, _formats) {
    var t = this, ws;
    ws = t.getWorksheet();
    t.clipboard.checkCopyToClipboard(ws, _clipboard, _formats);
  };

  WorkbookView.prototype.pasteData = function(_format, data1, data2, text_data) {
    var t = this, ws;
    ws = t.getWorksheet();
    t.clipboard.pasteData(ws, _format, data1, data2, text_data);
  };

  WorkbookView.prototype.selectionCut = function() {
    if (this.getCellEditMode()) {
      this.cellEditor.cutSelection();
    } else {
      this.getWorksheet().emptySelection(c_oAscCleanOptions.All);
    }
  };

  WorkbookView.prototype.undo = function() {
    var oFormulaLocaleInfo = AscCommonExcel.oFormulaLocaleInfo;
    oFormulaLocaleInfo.Parse = false;
    oFormulaLocaleInfo.DigitSep = false;
    if (!this.getCellEditMode()) {
      if (!History.Undo() && this.collaborativeEditing.getFast() && this.collaborativeEditing.getCollaborativeEditing()) {
        this.Api.sync_TryUndoInFastCollaborative();
      }
    } else {
      this.cellEditor.undo();
    }
    oFormulaLocaleInfo.Parse = true;
    oFormulaLocaleInfo.DigitSep = true;
  };

  WorkbookView.prototype.redo = function() {
    if (!this.getCellEditMode()) {
      History.Redo();
    } else {
      this.cellEditor.redo();
    }
  };

  WorkbookView.prototype.setFontAttributes = function(prop, val) {
    if (!this.getCellEditMode()) {
      this.getWorksheet().setSelectionInfo(prop, val);
    } else {
      this.cellEditor.setTextStyle(prop, val);
    }
  };

  WorkbookView.prototype.changeFontSize = function(prop, val) {
    if (!this.getCellEditMode()) {
      this.getWorksheet().setSelectionInfo(prop, val);
    } else {
      this.cellEditor.setTextStyle(prop, val);
    }
  };

  WorkbookView.prototype.emptyCells = function(options) {
    if (!this.getCellEditMode()) {
      this.getWorksheet().emptySelection(options);
      this.restoreFocus();
    } else {
      this.cellEditor.empty(options);
    }
  };

  WorkbookView.prototype.setSelectionDialogMode = function(selectionDialogType, selectRange) {
    if (selectionDialogType === this.selectionDialogType) {
      return;
    }

    if (c_oAscSelectionDialogType.None === selectionDialogType) {
      this.selectionDialogType = selectionDialogType;
      this.getWorksheet().setSelectionDialogMode(selectionDialogType, selectRange);
      if (this.copyActiveSheet !== this.wsActive) {
        this.showWorksheet(this.copyActiveSheet);
        // Посылаем эвент о смене активного листа
        this.handlers.trigger("asc_onActiveSheetChanged", this.copyActiveSheet);
      }
      this.copyActiveSheet = -1;
      this.input.disabled = false;
    } else {
      this.copyActiveSheet = this.wsActive;

      var index, tmpSelectRange = AscCommon.parserHelp.parse3DRef(selectRange);
      if (tmpSelectRange) {
        if (c_oAscSelectionDialogType.Chart === selectionDialogType) {
          // Получаем sheet по имени
          var ws = this.model.getWorksheetByName(tmpSelectRange.sheet);
          if (!ws || ws.getHidden()) {
            tmpSelectRange = null;
          } else {
            index = ws.getIndex();
            this.showWorksheet(index);
            // Посылаем эвент о смене активного листа
            this.handlers.trigger("asc_onActiveSheetChanged", index);

            tmpSelectRange = tmpSelectRange.range;
          }
        } else {
          tmpSelectRange = tmpSelectRange.range;
        }
      } else {
        // Это не 3D ссылка
        tmpSelectRange = selectRange;
      }

      this.getWorksheet().setSelectionDialogMode(selectionDialogType, tmpSelectRange);
      // Нужно выставить после, т.к. при смене листа не должны проставлять режим
      this.selectionDialogType = selectionDialogType;
      this.input.disabled = true;
    }
  };

  WorkbookView.prototype.formatPainter = function(stateFormatPainter) {
    // Если передали состояние, то выставляем его. Если нет - то меняем на противоположное.
    this.stateFormatPainter = (null != stateFormatPainter) ? stateFormatPainter : ((c_oAscFormatPainterState.kOff !== this.stateFormatPainter) ? c_oAscFormatPainterState.kOff : c_oAscFormatPainterState.kOn);

    this.rangeFormatPainter = this.getWorksheet().formatPainter(this.stateFormatPainter);
    if (this.stateFormatPainter) {
      this.copyActiveSheet = this.wsActive;
    } else {
      this.copyActiveSheet = -1;
      this.handlers.trigger('asc_onStopFormatPainter');
    }
  };

  WorkbookView.prototype._cleanFindResults = function() {
    this.lastFindOptions = null;
    this.lastFindResults = {};
  };

  // Поиск текста в листе
  WorkbookView.prototype.findCellText = function(options) {
    // Для поиска эта переменная не нужна (но она может остаться от replace)
    options.activeCell = null;

    var ws = this.getWorksheet();
    // Останавливаем ввод данных в редакторе ввода
    if (ws.getCellEditMode()) {
      this._onStopCellEditing();
    }
    var result = ws.findCellText(options);
    if (false === options.scanOnOnlySheet) {
      // Поиск по всей книге
      var key = result ? (result.c1 + "-" + result.r1) : null;
      if (null === key || options.isEqual(this.lastFindOptions)) {
        if (null === key || this.lastFindResults[key]) {
          // Мы уже находили данную ячейку, попробуем на другом листе
          var i, active = this.model.getActive(), start = 0, end = this.model.getWorksheetCount();
          var inc = options.scanForward ? +1 : -1;
          var tmpWs, tmpResult = null;
          for (i = active + inc; i < end && i >= start; i += inc) {
            tmpWs = this.getWorksheet(i);
            tmpResult = tmpWs.findCellText(options);
            if (tmpResult) {
              break;
            }
          }
          if (!tmpResult) {
            // Мы дошли до конца или начала (в зависимости от направления, теперь пойдем до активного)
            if (options.scanForward) {
              i = 0;
              end = active;
            } else {
              i = end - 1;
              start = active + 1;
            }
            inc *= -1;
            for (; i < end && i >= start; i += inc) {
              tmpWs = this.getWorksheet(i);
              tmpResult = tmpWs.findCellText(options);
              if (tmpResult) {
                break;
              }
            }
          }

          if (tmpResult) {
            ws = tmpWs;
            result = tmpResult;
            this.showWorksheet(i);
            // Посылаем эвент о смене активного листа
            this.handlers.trigger("asc_onActiveSheetChanged", i);
            key = result.c1 + "-" + result.r1;
          }

          this.lastFindResults = {};
        }
      }
      if (null !== key) {
        this.lastFindOptions = options.clone();
        this.lastFindResults[key] = true;
      }
    }

    if (result) {
      return ws.setSelectionUndoRedo(result);
    }
    this._cleanFindResults();
    return null;
  };

  // Замена текста в листе
  WorkbookView.prototype.replaceCellText = function(options) {
    var ws = this.getWorksheet();
    // Останавливаем ввод данных в редакторе ввода
    if (ws.getCellEditMode()) {
      this._onStopCellEditing();
    }

    History.Create_NewPoint();
    History.StartTransaction();

    options.clearFindAll();
    if (options.isReplaceAll) {
      // На ReplaceAll ставим медленную операцию
      this.Api.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
    }

    ws.replaceCellText(options, false, this.fReplaceCallback);
  };
  WorkbookView.prototype._replaceCellTextCallback = function(options) {
    options.updateFindAll();
    if (!options.scanOnOnlySheet && options.isReplaceAll) {
      // Замена на всей книге
      var i = ++options.sheetIndex;
      if (this.model.getActive() === i) {
        i = ++options.sheetIndex;
      }

      if (i < this.model.getWorksheetCount()) {
        var ws = this.getWorksheet(i);
        ws.replaceCellText(options, true, this.fReplaceCallback);
        return;
      }
    }

    this.handlers.trigger("asc_onRenameCellTextEnd", options.countFindAll, options.countReplaceAll);

    History.EndTransaction();
    if (options.isReplaceAll) {
      // Заканчиваем медленную операцию
      this.Api.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
    }
  };

  WorkbookView.prototype.getDefinedNames = function(defNameListId) {
    return this.model.getDefinedNamesWB(defNameListId);
  };

  WorkbookView.prototype.setDefinedNames = function(defName) {
    //ToDo проверка defName.ref на знак "=" в начале ссылки. знака нет тогда это либо число либо строка, так делает Excel.

    this.model.setDefinesNames(defName.Name, defName.Ref, defName.Scope);
    this.handlers.trigger("asc_onDefName");

  };

  WorkbookView.prototype.editDefinedNames = function(oldName, newName) {
    //ToDo проверка defName.ref на знак "=" в начале ссылки. знака нет тогда это либо число либо строка, так делает Excel.
    if (this.collaborativeEditing.getGlobalLock()) {
      return;
    }

    var ws = this.getWorksheet(), t = this;

    var editDefinedNamesCallback = function(res) {
      if (res) {
        t.model.editDefinesNames(oldName, newName);
        t.handlers.trigger("asc_onEditDefName", oldName, newName);
        //условие исключает второй вызов asc_onRefreshDefNameList(первый в unlockDefName)
        if(!(t.collaborativeEditing.getCollaborativeEditing() && t.collaborativeEditing.getFast()))
        {
          t.handlers.trigger("asc_onRefreshDefNameList");
        }
      } else {
        t.handlers.trigger("asc_onError", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical);
      }
      t._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
    };
    var defNameId;
    if (oldName) {
      defNameId = t.model.getDefinedName(oldName);
      defNameId = defNameId ? defNameId.nodeId : null;
    }

    var callback = function() {
      ws._isLockedDefNames(editDefinedNamesCallback, defNameId);
    };

    var tableRange;
    if(oldName && true === oldName.isTable)
    {
      var table = ws.model.autoFilters._getFilterByDisplayName(oldName.Name);
      if(table)
      {
        tableRange = table.Ref;
      }
    }
    if(tableRange)
    {
      ws._isLockedCells( tableRange, null, callback );
    }
    else
    {
      callback();
    }
  };

  WorkbookView.prototype.delDefinedNames = function(oldName) {
    //ToDo проверка defName.ref на знак "=" в начале ссылки. знака нет тогда это либо число либо строка, так делает Excel.
    if (this.collaborativeEditing.getGlobalLock()) {
      return;
    }

    var ws = this.getWorksheet(), t = this

    if (oldName) {

      var delDefinedNamesCallback = function(res) {
        if (res) {
          t.handlers.trigger("asc_onDelDefName", t.model.delDefinesNames(oldName));
          t.handlers.trigger("asc_onRefreshDefNameList");
        } else {
          t.handlers.trigger("asc_onError", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical);
        }
        t._onSelectionNameChanged(ws.getSelectionName(/*bRangeText*/false));
      };
      var defNameId = t.model.getDefinedName(oldName).nodeId;

      ws._isLockedDefNames(delDefinedNamesCallback, defNameId);

    }

  };

  WorkbookView.prototype.getDefaultDefinedName = function() {
    //ToDo проверка defName.ref на знак "=" в начале ссылки. знака нет тогда это либо число либо строка, так делает Excel.

    var ws = this.getWorksheet();

    return new Asc.asc_CDefName("", ws.getSelectionRangeValue(), null);

  };
  WorkbookView.prototype.unlockDefName = function() {
    this.model.unlockDefName();
    this.handlers.trigger("asc_onRefreshDefNameList");
    this.handlers.trigger("asc_onLockDefNameManager", Asc.c_oAscDefinedNameReason.OK);
  };

  WorkbookView.prototype._onCheckDefNameLock = function() {
    return this.model.checkDefNameLock();
  };

  // Печать
  WorkbookView.prototype.printSheets = function(pdf_writer, printPagesData) {
    var ws;
    if (0 === printPagesData.arrPages.length) {
      // Печать пустой страницы
      ws = this.getWorksheet();
      ws.drawForPrint(pdf_writer, null);
    } else {
      var indexWorksheet = -1;
      var indexWorksheetTmp = -1;
      for (var i = 0; i < printPagesData.arrPages.length; ++i) {
        indexWorksheetTmp = printPagesData.arrPages[i].indexWorksheet;
        if (indexWorksheetTmp !== indexWorksheet) {
          ws = this.getWorksheet(indexWorksheetTmp);
          indexWorksheet = indexWorksheetTmp;
        }
        ws.drawForPrint(pdf_writer, printPagesData.arrPages[i]);
      }
    }
  };

  WorkbookView.prototype.calcPagesPrint = function (adjustPrint) {
    var ws = null;
    var wb = this.model;
    var activeWs;
    var printPagesData = new asc_CPrintPagesData();
    var printType = adjustPrint.asc_getPrintType();
    if (printType === Asc.c_oAscPrintType.ActiveSheets) {
      activeWs = wb.getActive();
      ws = this.getWorksheet(activeWs);
      ws.calcPagesPrint(wb.getWorksheet(activeWs).PagePrintOptions, false, activeWs, printPagesData.arrPages);
    } else if (printType === Asc.c_oAscPrintType.EntireWorkbook) {
      // Колличество листов
      var countWorksheets = this.model.getWorksheetCount();
      for (var i = 0; i < countWorksheets; ++i) {
        ws = this.getWorksheet(i);
        ws.calcPagesPrint(wb.getWorksheet(i).PagePrintOptions, false, i, printPagesData.arrPages);
      }
    } else if (printType === Asc.c_oAscPrintType.Selection) {
      activeWs = wb.getActive();
      ws = this.getWorksheet(activeWs);
      ws.calcPagesPrint(wb.getWorksheet(activeWs).PagePrintOptions, true, activeWs, printPagesData.arrPages);
    }

    if (AscCommonExcel.c_kMaxPrintPages === printPagesData.arrPages.length) {
      this.handlers.trigger("asc_onError", c_oAscError.ID.PrintMaxPagesCount, c_oAscError.Level.NoCritical);
    }
    return printPagesData;
  };

  // Вызывать только для нативной печати
  WorkbookView.prototype._nativeCalculate = function() {
    var item;
    for (var i in this.wsViews) {
      item = this.wsViews[i];
      item._cleanCellsTextMetricsCache();
      item._prepareDrawingObjects();
    }
  };

  WorkbookView.prototype._initCommentsToSave = function() {
    var isFirst = true, wsView, wsModel, tmpWs;
    // Колличество листов
    var countWorksheets = this.model.getWorksheetCount();
    for (var i = 0; i < countWorksheets; ++i) {
      tmpWs = this.model.getWorksheet(i);
      if (tmpWs && (0 < tmpWs.aComments.length || isFirst)) {
        wsView = this.getWorksheet(i);
        wsModel = wsView.model;
        wsModel.aCommentsCoords = wsView.cellCommentator.getCoordsToSave();

        if (isFirst) {
          isFirst = false;
          tmpWs = this.cellCommentator.worksheet;
          this.cellCommentator.worksheet = wsView;
          this.cellCommentator.overlayCtx = wsView.overlayCtx;
          this.cellCommentator.drawingCtx = wsView.drawingCtx;
          this.model.aCommentsCoords = this.cellCommentator.getCoordsToSave();
          this.cellCommentator.worksheet = tmpWs;
        }
      }
    }
  };

  WorkbookView.prototype.reInit = function() {
    var ws = this.getWorksheet();
    ws._initCellsArea(AscCommonExcel.recalcType.full);
    ws._updateVisibleColsCount();
    ws._updateVisibleRowsCount();
  };
  WorkbookView.prototype.drawWS = function() {
    this.getWorksheet().draw();
  };
  WorkbookView.prototype.onShowDrawingObjects = function(clearCanvas) {
    var ws = this.getWorksheet();
    ws.objectRender.showDrawingObjects(clearCanvas);
  };

  WorkbookView.prototype.insertHyperlink = function(options) {
    var ws = this.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists()) {
      if (ws.objectRender.controller.canAddHyperlink()) {
        ws.objectRender.controller.insertHyperlink(options);
      }
    } else {
      // На всякий случай проверка (вдруг кто собирается вызвать...)
      this.closeCellEditor();
      ws.setSelectionInfo("hyperlink", options);
      this.restoreFocus();
    }
  };
  WorkbookView.prototype.removeHyperlink = function() {
    var ws = this.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists()) {
      ws.objectRender.controller.removeHyperlink();
    } else {
      ws.setSelectionInfo("rh");
    }
  };

  WorkbookView.prototype.setDocumentPlaceChangedEnabled = function(val) {
    this.isDocumentPlaceChangedEnabled = val;
  };

  WorkbookView.prototype.showComments = function (val) {
    if (this.isShowComments !== val) {
      this.isShowComments = val;
      this.drawWS();
    }
  };

  /*
   * @param {c_oAscRenderingModeType} mode Режим отрисовки
   * @param {Boolean} isInit инициализация или нет
   */
  WorkbookView.prototype.setFontRenderingMode = function(mode, isInit) {
    if (mode !== this.fontRenderingMode) {
      this.fontRenderingMode = mode;
      if (c_oAscFontRenderingModeType.noHinting === mode) {
        this._setHintsProps(false, false);
      } else if (c_oAscFontRenderingModeType.hinting === mode) {
        this._setHintsProps(true, false);
      } else if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode) {
        this._setHintsProps(true, true);
      }

      if (!isInit) {
        this.drawWS();
        this.cellEditor.setFontRenderingMode(mode);
      }
    }
  };

  WorkbookView.prototype.initFormulasList = function() {
    this.formulasList = [];
    var oFormulaList = AscCommonExcel.cFormulaFunctionLocalized ? AscCommonExcel.cFormulaFunctionLocalized :
      AscCommonExcel.cFormulaFunction;
    for (var f in oFormulaList) {
      this.formulasList.push(f);
    }
    this.arrExcludeFormulas = [cBoolLocal["t"].toUpperCase(), cBoolLocal["f"].toUpperCase()];
  };

  WorkbookView.prototype._setHintsProps = function(bIsHinting, bIsSubpixHinting) {
    var manager, hintProps;
    for (var i = 0, length = this.fmgrGraphics.length; i < length; ++i) {
      manager = this.fmgrGraphics[i];
      hintProps = manager.m_oLibrary.tt_hint_props;
      if (!hintProps) {
        continue;
      }

      // Последний без хинтования (только для измерения)
      if (i === length - 1) {
        bIsHinting = bIsSubpixHinting = false;
      }

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
    this.stringRender.measureString("0123456789", {
      wrapText: false, shrinkToFit: false, isMerged: false, textAlign: /*khaLeft*/AscCommon.align_Left
    });

    var ppiX = 96; // Мерить только с 96
    var ptConvToPx = asc_getcvt(1/*pt*/, 0/*px*/, ppiX);

    // Максимальная ширина в Pt
    var maxWidthInPt = this.stringRender.getWidestCharWidth();
    // Переводим в px и приводим к целому (int)
    this.model.maxDigitWidth = this.maxDigitWidth = asc_round(maxWidthInPt * ptConvToPx);
    // Проверка для Calibri 11 должно быть this.maxDigitWidth = 7

    if (!this.maxDigitWidth) {
      throw "Error: can't measure text string";
    }

    // Padding рассчитывается исходя из maxDigitWidth (http://social.msdn.microsoft.com/Forums/en-US/9a6a9785-66ad-4b6b-bb9f-74429381bd72/margin-padding-in-cell-excel?forum=os_binaryfile)
    this.defaults.worksheetView.cells.padding = Math.max(asc.ceil(this.maxDigitWidth / 4), 2);
    this.model.paddingPlusBorder = this.defaults.worksheetView.cells.paddingPlusBorder = 2 * this.defaults.worksheetView.cells.padding + 1;
  };

  WorkbookView.prototype.af_getTablePictures = function (wb, fmgrGraphics, oFont, props) {
    var styleThumbnailWidth = 61;
    var styleThumbnailHeight = 46;
    if (AscBrowser.isRetina) {
      styleThumbnailWidth <<= 1;
      styleThumbnailHeight <<= 1;
    }

    var canvas = document.createElement('canvas');
    canvas.width = styleThumbnailWidth;
    canvas.height = styleThumbnailHeight;
    var customStyles = wb.TableStyles.CustomStyles;
    var result = [];
    var options;
    var n = 0;
    if (customStyles) {
      for (var i in customStyles) {
        if (customStyles[i].table) {
          options = {
            name: i,
            displayName: customStyles[i].displayName,
            type: 'custom',
            image: this.af_getSmallIconTable(canvas, customStyles[i], fmgrGraphics, oFont, props)
          };
          result[n] = new AscCommonExcel.formatTablePictures(options);
          n++;
        }
      }
    }
    var defaultStyles = wb.TableStyles.DefaultStyles;
    if (defaultStyles) {
      for (var i in defaultStyles) {
        if (defaultStyles[i].table) {
          options = {
            name: i,
            displayName: defaultStyles[i].displayName,
            type: 'default',
            image: this.af_getSmallIconTable(canvas, defaultStyles[i], fmgrGraphics, oFont, props)
          };
          result[n] = new AscCommonExcel.formatTablePictures(options);
          n++;
        }
      }
    }
    return result;
  };

  WorkbookView.prototype.af_getSmallIconTable = function (canvas, style, fmgrGraphics, oFont, props) {
    var ctx = new Asc.DrawingContext({canvas: canvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});
    var styleOptions = style;

    //по умолчанию ставим строку заголовка и чередующиеся строки, позже нужно будет получать параметр
    var styleInfo;
    if (props) {
      styleInfo = {
        ShowColumnStripes: props.asc_getBandVer(),
        ShowFirstColumn: props.asc_getFirstCol(),
        ShowLastColumn: props.asc_getLastCol(),
        ShowRowStripes: props.asc_getBandHor(),
        HeaderRowCount: props.asc_getFirstRow(),
        TotalsRowCount: props.asc_getLastRow()
      };
    } else {
      styleInfo = {
        ShowColumnStripes: false,
        ShowFirstColumn: false,
        ShowLastColumn: false,
        ShowRowStripes: true,
        HeaderRowCount: true,
        TotalsRowCount: false
      };
    }


    var pxToMM = 72 / 96;
    var ySize = 45 * pxToMM;
    var xSize = 61 * pxToMM;

    var stepY = (ySize) / 5;
    var stepX = (60 * pxToMM) / 5;
    var whiteColor = new CColor(255, 255, 255);
    var blackColor = new CColor(0, 0, 0);

    //**draw background**
    var defaultColorBackground;
    if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
      defaultColorBackground = styleOptions.wholeTable.dxf.fill.bg;
    } else {
      defaultColorBackground = whiteColor;
    }

    var color;
    if (styleOptions != undefined) {
      if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
        ctx.setFillStyle(styleOptions.wholeTable.dxf.fill.bg);
        ctx.fillRect(0, 0, xSize, ySize);
      } else {
        ctx.setFillStyle(whiteColor);
        ctx.fillRect(0, 0, xSize, ySize);
      }
      if (styleInfo.ShowColumnStripes)//column stripes
      {
        for (k = 0; k < 6; k++) {
          color = defaultColorBackground;
          if (k % 2 == 0) {
            if (styleOptions.firstColumnStripe && styleOptions.firstColumnStripe.dxf.fill &&
              null != styleOptions.firstColumnStripe.dxf.fill.bg) {
              color = styleOptions.firstColumnStripe.dxf.fill.bg;
            } else if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill &&
              null != styleOptions.wholeTable.dxf.fill.bg) {
              color = styleOptions.wholeTable.dxf.fill.bg;
            }
          } else {
            if (styleOptions.secondColumnStripe && styleOptions.secondColumnStripe.dxf.fill &&
              null != styleOptions.secondColumnStripe.dxf.fill.bg) {
              color = styleOptions.secondColumnStripe.dxf.fill.bg;
            } else if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill &&
              null != styleOptions.wholeTable.dxf.fill.bg) {
              color = styleOptions.wholeTable.dxf.fill.bg;
            }
          }
          ctx.setFillStyle(color);
          ctx.fillRect(k * stepX, 0, stepX, ySize);
        }
      }

      if (styleInfo.ShowRowStripes)//row stripes
      {
        for (var k = 0; k < 6; k++) {
          color = null;

          if (k == 0 && styleInfo.HeaderRowCount) {
            continue;
          }

          if (styleInfo.HeaderRowCount) {
            if (k % 2 != 0) {
              if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill &&
                null != styleOptions.firstRowStripe.dxf.fill.bg) {
                color = styleOptions.firstRowStripe.dxf.fill.bg;
              }
            } else {
              if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill &&
                null != styleOptions.secondRowStripe.dxf.fill.bg) {
                color = styleOptions.secondRowStripe.dxf.fill.bg;
              }
            }
          } else {
            if (k % 2 != 0) {
              if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill &&
                null != styleOptions.secondRowStripe.dxf.fill.bg) {
                color = styleOptions.secondRowStripe.dxf.fill.bg;
              }
            } else {
              if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill &&
                null != styleOptions.firstRowStripe.dxf.fill.bg) {
                color = styleOptions.firstRowStripe.dxf.fill.bg;
              }
            }
          }

          if (color != null) {
            ctx.setFillStyle(color);
            ctx.fillRect(0, k * stepY, xSize, stepY);
          }
        }
      }

      if (styleInfo.ShowFirstColumn && styleOptions.firstColumn)//first column
      {
        color = null;
        if (styleOptions.firstColumn && styleOptions.firstColumn.dxf.fill &&
          null != styleOptions.firstColumn.dxf.fill.bg) {
          color = styleOptions.firstColumn.dxf.fill.bg;
        }

        if (color != null) {
          ctx.setFillStyle(color);
          ctx.fillRect(0, 0, stepX, ySize);
        }
      }
      if (styleInfo.ShowLastColumn)//last column
      {
        color = null;
        if (styleOptions.lastColumn && styleOptions.lastColumn.dxf.fill &&
          null != styleOptions.lastColumn.dxf.fill.bg) {
          color = styleOptions.lastColumn.dxf.fill.bg;
        }

        if (color != null) {
          ctx.setFillStyle(color);
          ctx.fillRect(4 * stepX + 1, 0, stepX, ySize);
        }

      }
      if (styleInfo.HeaderRowCount)//header row
      {
        if (styleOptions.headerRow && styleOptions.headerRow.dxf.fill && null != styleOptions.headerRow.dxf.fill.bg) {
          ctx.setFillStyle(styleOptions.headerRow.dxf.fill.bg);
        } else {
          ctx.setFillStyle(defaultColorBackground);
        }
        ctx.fillRect(0, 0, xSize, stepY);

      }
      if (styleInfo.TotalsRowCount)//total row
      {
        color = null;
        if (styleOptions.totalRow && styleOptions.totalRow.dxf.fill && null != styleOptions.totalRow.dxf.fill.bg) {
          color = styleOptions.totalRow.dxf.fill.bg;
        }

        if (color !== null) {
          ctx.setFillStyle(color);
          ctx.fillRect(0, stepY * 4, xSize, stepY);
        }
      }


      //первая ячейка
      if (styleOptions.firstHeaderCell && styleInfo.ShowFirstColumn) {
        if (styleOptions.firstHeaderCell && styleOptions.firstHeaderCell.dxf.fill &&
          null != styleOptions.firstHeaderCell.dxf.fill.bg) {
          ctx.setFillStyle(styleOptions.firstHeaderCell.dxf.fill.bg);
        } else {
          ctx.setFillStyle(defaultColorBackground);
        }
        ctx.fillRect(0, 0, stepX, stepY);
      }
      //последняя в первой строке
      if (styleOptions.lastHeaderCell && styleInfo.ShowLastColumn) {
        if (styleOptions.lastHeaderCell && styleOptions.lastHeaderCell.dxf.fill &&
          null != styleOptions.lastHeaderCell.dxf.fill.bg) {
          ctx.setFillStyle(styleOptions.lastHeaderCell.dxf.fill.bg);
        } else {
          ctx.setFillStyle(defaultColorBackground);
        }
        ctx.fillRect(4 * stepX, 0, stepX, stepY);
      }
      //первая в последней строке
      if (styleOptions.firstTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowFirstColumn) {
        if (styleOptions.firstTotalCell && styleOptions.firstTotalCell.dxf.fill &&
          null != styleOptions.firstTotalCell.dxf.fill.bg) {
          ctx.setFillStyle(styleOptions.firstTotalCell.dxf.fill.bg);
        } else {
          ctx.setFillStyle(defaultColorBackground);
        }
        ctx.fillRect(0, 4 * stepY, stepX, stepY);
      }
      //последняя ячейка
      if (styleOptions.lastTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowLastColumn) {
        if (styleOptions.lastTotalCell && styleOptions.lastTotalCell.dxf.fill &&
          null != styleOptions.lastTotalCell.dxf.fill.bg) {
          ctx.setFillStyle(styleOptions.lastTotalCell.dxf.fill.bg);
        } else {
          ctx.setFillStyle(defaultColorBackground);
        }
        ctx.fillRect(4 * stepX, 4 * stepY, stepX, ySize);
      }

    } else {
      ctx.setFillStyle(whiteColor);
      ctx.fillRect(0, 0, xSize, ySize);
    }


    //**draw vertical and horizontal lines**
    if (styleOptions != undefined) {
      ctx.setLineWidth(1);
      ctx.beginPath();
      if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.border) {
        var borders = styleOptions.wholeTable.dxf.border;
        if (borders.t.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.t.c);
          ctx.lineHor(0, 0, xSize);
        }
        if (borders.b.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.b.c);
          ctx.lineHor(0, ySize, xSize);
        }
        if (borders.l.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.l.c);
          ctx.lineVer(0, 0, ySize);
        }
        if (borders.r.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.r.c);
          ctx.lineVer(xSize - 1, 0, ySize);
        }
        if (borders.ih.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.ih.c);
          for (var n = 1; n < 5; n++) {
            ctx.lineHor(0, stepY * n, xSize);
          }
          ctx.stroke();
        }
        if (borders.iv.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(borders.iv.c);
          for (var n = 1; n < 5; n++) {
            ctx.lineVer(stepX * n, 0, ySize);
          }
          ctx.stroke();
        }

      }

      var border;
      if (styleInfo.ShowRowStripes) {
        if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.border) {
          border = styleOptions.firstRowStripe.dxf.border;
        } else if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.border) {
          border = styleOptions.secondRowStripe.dxf.border;
        }

        if (border) {
          for (n = 1; n < 5; n++) {
            ctx.lineHor(0, stepY * n, xSize);
          }
          ctx.stroke();
        }
      }
      if (styleOptions.totalRow && styleInfo.TotalsRowCount && styleOptions.totalRow.dxf.border) {
        border = styleOptions.totalRow.dxf.border;
        if (border.t.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(border.t.c);
          ctx.lineVer(0, xSize, ySize);
        }
      }
      if (styleOptions.headerRow && styleOptions.headerRow.dxf.border && styleInfo.HeaderRowCount)//header row
      {
        border = styleOptions.headerRow.dxf.border;
        if (border.t.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(border.t.c);
          ctx.lineHor(0, 0, xSize);
        }
        if (border.b.s !== c_oAscBorderStyles.None) {
          ctx.setStrokeStyle(border.b.c);
          ctx.lineHor(0, stepY, xSize);
        }
        ctx.stroke();
      }
      ctx.closePath();
    }

    //**draw marks line**
    var defaultColor;
    if (!styleOptions || !styleOptions.wholeTable || !styleOptions.wholeTable.dxf.font) {
      defaultColor = blackColor;
    } else {
      defaultColor = styleOptions.wholeTable.dxf.font.getColor();
    }
    for (var n = 1; n < 6; n++) {
      ctx.beginPath();
      color = null;
      if (n == 1 && styleOptions && styleOptions.headerRow && styleOptions.headerRow.dxf.font) {
        color = styleOptions.headerRow.dxf.font.getColor();
      } else if (n == 5 && styleOptions && styleOptions.totalRow && styleOptions.totalRow.dxf.font) {
        color = styleOptions.totalRow.dxf.font.getColor();
      } else if (styleOptions && styleOptions.headerRow && styleInfo.ShowRowStripes) {
        if ((n == 2 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe &&
          styleOptions.firstRowStripe.dxf.font) {
          color = styleOptions.firstRowStripe.dxf.font.getColor();
        } else if (n == 3 && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
          color = styleOptions.secondRowStripe.dxf.font.getColor();
        } else {
          color = defaultColor
        }
      } else if (styleOptions && !styleOptions.headerRow && styleInfo.ShowRowStripes) {
        if ((n == 1 || n == 3 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe &&
          styleOptions.firstRowStripe.dxf.font) {
          color = styleOptions.firstRowStripe.dxf.font.getColor();
        } else if ((n == 2 || n == 4) && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
          color = styleOptions.secondRowStripe.dxf.font.getColor();
        } else {
          color = defaultColor
        }
      } else {
        color = defaultColor;
      }
      ctx.setStrokeStyle(color);
      var k = 0;
      var strY = n * stepY - stepY / 2;
      while (k < 6) {
        ctx.lineHor(k * stepX + 3 * pxToMM, strY, (k + 1) * stepX - 2 * pxToMM);
        k++;
      }
      ctx.stroke();
      ctx.closePath();
    }

    return canvas.toDataURL("image/png");
  };

  //------------------------------------------------------------export---------------------------------------------------
  window['AscCommonExcel'] = window['AscCommonExcel'] || {};
  window["AscCommonExcel"].WorkbookView = WorkbookView;
})(window);
