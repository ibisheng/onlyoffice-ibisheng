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

var editor;
(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
  function(window, undefined) {
  var asc = window["Asc"];
  var prot;

  var c_oAscAdvancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction;
  var DownloadType = AscCommon.DownloadType;
  var c_oAscLockTypes = AscCommon.c_oAscLockTypes;
  var CColor = AscCommon.CColor;
  var g_oDocumentUrls = AscCommon.g_oDocumentUrls;
  var sendCommand = AscCommon.sendCommand;
  var mapAscServerErrorToAscError = AscCommon.mapAscServerErrorToAscError;
  var parserHelp = AscCommon.parserHelp;
  var g_oIdCounter = AscCommon.g_oIdCounter;
  var g_oTableId = AscCommon.g_oTableId;

  var c_oAscLockTypeElem = AscCommonExcel.c_oAscLockTypeElem;

  var c_oAscError = asc.c_oAscError;
  var c_oAscFileType = asc.c_oAscFileType;
  var c_oAscAsyncAction = asc.c_oAscAsyncAction;
  var c_oAscAdvancedOptionsID = asc.c_oAscAdvancedOptionsID;
  var c_oAscAsyncActionType = asc.c_oAscAsyncActionType;

  var History = null;


  /**
   *
   * @param config
   * @param eventsHandlers
   * @constructor
   * @returns {spreadsheet_api}
   * @extends {AscCommon.baseEditorsApi}
   */
  function spreadsheet_api(config) {
    spreadsheet_api.superclass.constructor.call(this, config, AscCommon.c_oEditorId.Spreadsheet);

    /************ private!!! **************/
    this.topLineEditorName = config['id-input'] || '';
    this.topLineEditorElement = null;

    this.controller = null;

    this.handlers = new AscCommonExcel.asc_CHandlersList();
    // Вид печати
    this.adjustPrint = null;

    this.fontRenderingMode = Asc.c_oAscFontRenderingModeType.hintingAndSubpixeling;
    this.wb = null;
    this.wbModel = null;
    this.tmpLocale = null;
    this.tmpLocalization = null;

    this.documentFormatSave = c_oAscFileType.XLSX;

    // объекты, нужные для отправки в тулбар (шрифты, стили)
    this._gui_control_colors = null;
    this.GuiControlColorsMap = null;
    this.IsSendStandartColors = false;

    this.asyncMethodCallback = undefined;

    // Переменная отвечает, загрузились ли фонты
    this.FontLoadWaitComplete = false;
    // Переменная отвечает, отрисовали ли мы все (иначе при рестарте, получится переинициализация)
    this.DocumentLoadComplete = false;
    // Переменная, которая отвечает, послали ли мы окончание открытия документа
    this.IsSendDocumentLoadCompleate = false;
    //текущий обьект куда записываются информация для update, когда принимаются изменения в native редакторе
    this.oRedoObjectParamNative = null;

    this.collaborativeEditing = null;

    // AutoSave
    this.lastSaveTime = null;				// Время последнего сохранения
    this.autoSaveGapRealTime = 30;	  // Интервал быстрого автосохранения (когда выставлен флаг realtime) - 30 мс.
    this.autoSaveGapFast = 2000;			// Интервал быстрого автосохранения (когда человек один) - 2 сек.
    this.autoSaveGapSlow = 10 * 60 * 1000;	// Интервал медленного автосохранения (когда совместно) - 10 минут

    // Shapes
    this.isStartAddShape = false;
    this.shapeElementId = null;
    this.textArtElementId = null;
    this.isImageChangeUrl = false;
    this.isShapeImageChangeUrl = false;
    this.isTextArtChangeUrl = false;


	  // Styles sizes
      this.styleThumbnailWidth = 112;
	  this.styleThumbnailHeight = 38;

    this.formulasList = null;	// Список всех формул

    this._init();
    return this;
  }
  AscCommon.extendClass(spreadsheet_api, AscCommon.baseEditorsApi);

  spreadsheet_api.prototype.sendEvent = function() {
    this.handlers.trigger.apply(this.handlers, arguments);
  };

  spreadsheet_api.prototype._init = function() {
    spreadsheet_api.superclass._init.call(this);
    this.topLineEditorElement = document.getElementById(this.topLineEditorName);
    // ToDo нужно ли это
    asc['editor'] = ( asc['editor'] || this );
    AscCommon.AscBrowser.checkZoom();
  };

  spreadsheet_api.prototype.asc_CheckGuiControlColors = function() {
    // потом реализовать проверку на то, что нужно ли посылать

    var arr_colors = new Array(10);
    var _count = arr_colors.length;
    for (var i = 0; i < _count; ++i) {
      var color = AscCommonExcel.g_oColorManager.getThemeColor(i);
      arr_colors[i] = new CColor(color.getR(), color.getG(), color.getB());
    }

    // теперь проверим
    var bIsSend = false;
    if (this.GuiControlColorsMap != null) {
      for (var i = 0; i < _count; ++i) {
        var _color1 = this.GuiControlColorsMap[i];
        var _color2 = arr_colors[i];

        if ((_color1.r !== _color2.r) || (_color1.g !== _color2.g) || (_color1.b !== _color2.b)) {
          bIsSend = true;
          break;
        }
      }
    } else {
      this.GuiControlColorsMap = new Array(_count);
      bIsSend = true;
    }

    if (bIsSend) {
      for (var i = 0; i < _count; ++i) {
        this.GuiControlColorsMap[i] = arr_colors[i];
      }

      this.asc_SendControlColors();
    }
  };

  spreadsheet_api.prototype.asc_SendControlColors = function() {
    var standart_colors = null;
    if (!this.IsSendStandartColors) {
      var standartColors = AscCommon.g_oStandartColors;
      var _c_s = standartColors.length;
      standart_colors = new Array(_c_s);

      for (var i = 0; i < _c_s; ++i) {
        standart_colors[i] = new CColor(standartColors[i].R, standartColors[i].G, standartColors[i].B);
      }

      this.IsSendStandartColors = true;
    }

    var _count = this.GuiControlColorsMap.length;

    var _ret_array = new Array(_count * 6);
    var _cur_index = 0;

    for (var i = 0; i < _count; ++i) {
      var basecolor = AscCommonExcel.g_oColorManager.getThemeColor(i);
      var aTints = AscCommonExcel.g_oThemeColorsDefaultModsSpreadsheet[AscCommon.GetDefaultColorModsIndex(basecolor.getR(), basecolor.getG(), basecolor.getB())];
      for (var j = 0, length = aTints.length; j < length; ++j) {
        var tint = aTints[j];
        var color = AscCommonExcel.g_oColorManager.getThemeColor(i, tint);
        _ret_array[_cur_index] = new CColor(color.getR(), color.getG(), color.getB());
        _cur_index++;
      }
    }

    this.asc_SendThemeColors(_ret_array, standart_colors);
  };

  spreadsheet_api.prototype.asc_getCurrencySymbols = function () {
		var result = {};
		for (var key in AscCommon.g_aCultureInfos) {
			result[key] = AscCommon.g_aCultureInfos[key].CurrencySymbol;
		}
		return result;
	};
	spreadsheet_api.prototype.asc_getLocaleExample = function(format, value, culture) {
		var cultureInfo = AscCommon.g_aCultureInfos[culture] || AscCommon.g_oDefaultCultureInfo;
		var numFormat = AscCommon.oNumFormatCache.get(format);
		var res;
		if (null == value) {
			var ws = this.wbModel.getActiveWs();
			var activeCell = ws.selectionRange.activeCell;
			var cell = ws._getCellNoEmpty(activeCell.row, activeCell.col);
			if (cell) {
				res = cell.getValueForExample(numFormat, cultureInfo);
			} else {
				res = '';
			}
		} else {
			res = numFormat.formatToChart(value, cultureInfo);
		}
		return res;
	};
	spreadsheet_api.prototype.asc_getFormatCells = function(info) {
		return AscCommon.getFormatCells(info);
	};
  spreadsheet_api.prototype.asc_getLocaleCurrency = function(val) {
    var cultureInfo = AscCommon.g_aCultureInfos[val];
    if (!cultureInfo) {
      cultureInfo = AscCommon.g_aCultureInfos[1033];
    }
    return AscCommonExcel.getCurrencyFormat(cultureInfo, 2, true, true);
  };
  spreadsheet_api.prototype.asc_setLocale = function(val) {
    if (!this.isLoadFullApi) {
      this.tmpLocale = val;
      return;
    }
    if (null === val) {
      return;
    }
    if (AscCommon.setCurrentCultureInfo(val)) {
      parserHelp.setDigitSeparator(AscCommon.g_oDefaultCultureInfo.NumberDecimalSeparator);
      if (this.wbModel) {
        AscCommon.oGeneralEditFormatCache.cleanCache();
        AscCommon.oNumFormatCache.cleanCache();
        this.wbModel.rebuildColors();
        if (this.IsSendDocumentLoadCompleate) {
          this._onUpdateAfterApplyChanges();
        }
      }
    }
  };

  spreadsheet_api.prototype.asc_LoadEmptyDocument = function() {
    this.CoAuthoringApi.auth(this.getViewMode());
    this.onEndLoadFile(true);
  };

  spreadsheet_api.prototype._openDocument = function(data) {
    var wb = new AscCommonExcel.Workbook(this.handlers, this);
    this.initGlobalObjects(wb);
    this.wbModel = wb;
    var oBinaryFileReader = new AscCommonExcel.BinaryFileReader();
    oBinaryFileReader.Read(data, wb);
    g_oIdCounter.Set_Load(false);
    return wb;
  };

  spreadsheet_api.prototype.initGlobalObjects = function(wbModel) {
    // History & global counters
    History.init(wbModel);

    g_oTableId.init();
    AscCommonExcel.g_oUndoRedoCell = new AscCommonExcel.UndoRedoCell(wbModel);
    AscCommonExcel.g_oUndoRedoWorksheet = new AscCommonExcel.UndoRedoWoorksheet(wbModel);
    AscCommonExcel.g_oUndoRedoWorkbook = new AscCommonExcel.UndoRedoWorkbook(wbModel);
    AscCommonExcel.g_oUndoRedoCol = new AscCommonExcel.UndoRedoRowCol(wbModel, false);
    AscCommonExcel.g_oUndoRedoRow = new AscCommonExcel.UndoRedoRowCol(wbModel, true);
    AscCommonExcel.g_oUndoRedoComment = new AscCommonExcel.UndoRedoComment(wbModel);
    AscCommonExcel.g_oUndoRedoAutoFilters = new AscCommonExcel.UndoRedoAutoFilters(wbModel);
    AscCommonExcel.g_oUndoRedoSparklines = new AscCommonExcel.UndoRedoSparklines(wbModel);
    AscCommonExcel.g_DefNameWorksheet = new AscCommonExcel.Woorksheet(wbModel, -1);
  };

  spreadsheet_api.prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent) {//передаем число соответствующее своему формату. например  c_oAscFileType.XLSX
    if (!this.canSave || this.isChartEditor || c_oAscAdvancedOptionsAction.None !== this.advancedOptionsAction) {
      return;
    }

    if (c_oAscFileType.PDF === typeFile) {
      this.adjustPrint = new Asc.asc_CAdjustPrint();
    }
    this._asc_downloadAs(typeFile, c_oAscAsyncAction.DownloadAs, {downloadType: bIsDownloadEvent ? DownloadType.Download: DownloadType.None});
  };

  spreadsheet_api.prototype.asc_Save = function(isAutoSave) {
	  if (!this.canSave || this.isChartEditor || c_oAscAdvancedOptionsAction.None !== this.advancedOptionsAction ||
		  this.isLongAction() || !(this.asc_isDocumentCanSave() || this.collaborativeEditing.haveOtherChanges())) {
      return;
    }

    this.IsUserSave = !isAutoSave;
    if (this.IsUserSave) {
      this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
    }
    /* Нужно закрыть редактор (до выставления флага canSave, т.к. мы должны успеть отправить
     asc_onDocumentModifiedChanged для подписки на сборку) Баг http://bugzilla.onlyoffice.com/show_bug.cgi?id=28331 */
    this.asc_closeCellEditor();

    // Не даем пользователю сохранять, пока не закончится сохранение
    this.canSave = false;

    var t = this;
    this.CoAuthoringApi.askSaveChanges(function(e) {
      t.onSaveCallback(e);
    });
  };

  spreadsheet_api.prototype.asc_Print = function(adjustPrint, bIsDownloadEvent) {
    if (window["AscDesktopEditor"]) {
      window.AscDesktopEditor_PrintData = adjustPrint;
      window["AscDesktopEditor"]["Print"]();
      return;
    }

    this.adjustPrint = adjustPrint ? adjustPrint : new Asc.asc_CAdjustPrint();
    this._asc_downloadAs(c_oAscFileType.PDF, c_oAscAsyncAction.Print, {downloadType: bIsDownloadEvent ? DownloadType.Print: DownloadType.None});
  };

  spreadsheet_api.prototype.asc_Copy = function() {
    if (window["AscDesktopEditor"])
    {
      window["asc_desktop_copypaste"](this, "Copy");
      return true;
    }
    return AscCommon.g_clipboardBase.Button_Copy();
  };

  spreadsheet_api.prototype.asc_Paste = function() {
    if (window["AscDesktopEditor"])
    {
      window["asc_desktop_copypaste"](this, "Paste");
      return true;
    }
    if (!AscCommon.g_clipboardBase.IsWorking()) {
      return AscCommon.g_clipboardBase.Button_Paste();
    }
    return false;
  };

  spreadsheet_api.prototype.asc_Cut = function() {
    if (window["AscDesktopEditor"])
    {
      window["asc_desktop_copypaste"](this, "Cut");
      return true;
    }
    return AscCommon.g_clipboardBase.Button_Cut();
  };

  spreadsheet_api.prototype.asc_PasteData = function (_format, data1, data2, text_data) {
    if (!this.getViewMode()) {
      this.wb.pasteData(_format, data1, data2, text_data);
    }
  };

  spreadsheet_api.prototype.asc_CheckCopy = function (_clipboard /* CClipboardData */, _formats) {
    return this.wb.checkCopyToClipboard(_clipboard, _formats);
  };

  spreadsheet_api.prototype.asc_SelectionCut = function () {
    if (!this.getViewMode()) {
      this.wb.selectionCut();
    }
  };

  spreadsheet_api.prototype.asc_bIsEmptyClipboard = function() {
    var result = this.wb.bIsEmptyClipboard();
    this.wb.restoreFocus();
    return result;
  };

  spreadsheet_api.prototype.asc_Undo = function() {
    this.wb.undo();
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_Redo = function() {
    this.wb.redo();
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_Resize = function () {
    AscCommon.AscBrowser.checkZoom();
    if (this.wb) {
      this.wb.resize();

      if (AscCommon.g_inputContext) {
        AscCommon.g_inputContext.onResize("ws-canvas-outer");
      }
    }
  };

  spreadsheet_api.prototype.asc_addAutoFilter = function(styleName, addFormatTableOptionsObj) {
    var ws = this.wb.getWorksheet();
    return ws.addAutoFilter(styleName, addFormatTableOptionsObj);
  };

  spreadsheet_api.prototype.asc_changeAutoFilter = function(tableName, optionType, val) {
    var ws = this.wb.getWorksheet();
    return ws.changeAutoFilter(tableName, optionType, val);
  };

  spreadsheet_api.prototype.asc_applyAutoFilter = function(autoFilterObject) {
    var ws = this.wb.getWorksheet();
    ws.applyAutoFilter(autoFilterObject);
  };
  
  spreadsheet_api.prototype.asc_applyAutoFilterByType = function(autoFilterObject) {
    var ws = this.wb.getWorksheet();
    ws.applyAutoFilterByType(autoFilterObject);
  };
  
  spreadsheet_api.prototype.asc_reapplyAutoFilter = function(displayName) {
    var ws = this.wb.getWorksheet();
    ws.reapplyAutoFilter(displayName);
  };

  spreadsheet_api.prototype.asc_sortColFilter = function(type, cellId, displayName, color, bIsExpandRange) {
    var ws = this.wb.getWorksheet();
    ws.sortRange(type, cellId, displayName, color, bIsExpandRange);
  };

  spreadsheet_api.prototype.asc_getAddFormatTableOptions = function(range) {
    var ws = this.wb.getWorksheet();
    return ws.getAddFormatTableOptions(range);
  };

  spreadsheet_api.prototype.asc_clearFilter = function() {
    var ws = this.wb.getWorksheet();
    return ws.clearFilter();
  };
  
  spreadsheet_api.prototype.asc_clearFilterColumn = function(cellId, displayName) {
    var ws = this.wb.getWorksheet();
    return ws.clearFilterColumn(cellId, displayName);
  };
  
  spreadsheet_api.prototype.asc_changeSelectionFormatTable = function(tableName, optionType) {
    var ws = this.wb.getWorksheet();
    return ws.af_changeSelectionFormatTable(tableName, optionType);
  };
  
  spreadsheet_api.prototype.asc_changeFormatTableInfo = function(tableName, optionType, val) {
    var ws = this.wb.getWorksheet();
    return ws.af_changeFormatTableInfo(tableName, optionType, val);
  };
  
  spreadsheet_api.prototype.asc_insertCellsInTable = function(tableName, optionType) {
    var ws = this.wb.getWorksheet();
    return ws.af_insertCellsInTable(tableName, optionType);
  };
  
  spreadsheet_api.prototype.asc_deleteCellsInTable = function(tableName, optionType) {
    var ws = this.wb.getWorksheet();
    return ws.af_deleteCellsInTable(tableName, optionType);
  };
  
  spreadsheet_api.prototype.asc_changeDisplayNameTable = function(tableName, newName) {
    var ws = this.wb.getWorksheet();
    return ws.af_changeDisplayNameTable(tableName, newName);
  };
  
  spreadsheet_api.prototype.asc_changeTableRange = function(tableName, range) {
    var ws = this.wb.getWorksheet();
    return ws.af_changeTableRange(tableName, range);
  };

  spreadsheet_api.prototype.asc_convertTableToRange = function(tableName) {
    var ws = this.wb.getWorksheet();
    return ws.af_convertTableToRange(tableName);
  };

  spreadsheet_api.prototype.asc_getTablePictures = function (props) 
  { 
	return this.wb.getTablePictures(props); 
  };

  spreadsheet_api.prototype.asc_setMobileVersion = function(isMobile) {
    this.isMobileVersion = isMobile;
    AscCommon.AscBrowser.isMobileVersion = isMobile;
  };

  spreadsheet_api.prototype.getViewMode = function() {
    return this.isViewMode;
  };

  spreadsheet_api.prototype.asc_setViewMode = function (isViewMode) {
    this.isViewMode = !!isViewMode;
    if (!this.isLoadFullApi) {
      return;
    }
    this.controller.setViewerMode(isViewMode);
    if (this.collaborativeEditing) {
      this.collaborativeEditing.setViewerMode(isViewMode);
    }

    if (false === isViewMode) {
      // Загружаем не обрезанные шрифты для полной версии (при редактировании)
      if (this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
        this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
        this.asyncMethodCallback = undefined;
        this.FontLoader.LoadDocumentFonts(this.wbModel.generateFontMap2());
      }

      this.isUseEmbeddedCutFonts = false;

      // Отправка стилей
      this._sendWorkbookStyles();
      if (this.IsSendDocumentLoadCompleate && this.collaborativeEditing) {
        // Принимаем чужие изменения
        this.collaborativeEditing.applyChanges();
        // Пересылаем свои изменения
        this.collaborativeEditing.sendChanges();
      }
    }
  };

  spreadsheet_api.prototype.asc_setUseEmbeddedCutFonts = function(bUse) {
    this.isUseEmbeddedCutFonts = bUse;
  };

  /*
   idOption идентификатор дополнительного параметра, пока c_oAscAdvancedOptionsID.CSV.
   option - какие свойства применить, пока массив. для CSV объект asc_CCSVAdvancedOptions(codepage, delimiter)
   exp:	asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new Asc.asc_CCSVAdvancedOptions(1200, c_oAscCsvDelimiter.Comma) );
   */
  spreadsheet_api.prototype.asc_setAdvancedOptions = function(idOption, option) {
    switch (idOption) {
      case c_oAscAdvancedOptionsID.CSV:
        // Проверяем тип состояния в данный момент
        if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
          var v = {
            "id": this.documentId,
            "userid": this.documentUserId,
            "format": this.documentFormat,
            "c": "reopen",
            "url": this.documentUrl,
            "title": this.documentTitle,
            "embeddedfonts": this.isUseEmbeddedCutFonts,
            "delimiter": option.asc_getDelimiter(),
            "codepage": option.asc_getCodePage()};

          sendCommand(this, null, v);
        } else if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Save) {
          var options = {CSVOptions: option, downloadType: this.downloadType};
          this.downloadType = DownloadType.None;
          this._asc_downloadAs(c_oAscFileType.CSV, c_oAscAsyncAction.DownloadAs, options);
        }
        break;
      case c_oAscAdvancedOptionsID.DRM:
        // Проверяем тип состояния в данный момент
        if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
          var v = {
            "id": this.documentId,
            "userid": this.documentUserId,
            "format": this.documentFormat,
            "c": "reopen",
            "url": this.documentUrl,
            "title": this.documentTitle,
            "embeddedfonts": this.isUseEmbeddedCutFonts,
            "password": option.asc_getPassword()
          };

          sendCommand(this, null, v);
        }
        break;
    }
  };
  // Опции страницы (для печати)
  spreadsheet_api.prototype.asc_setPageOptions = function(options, index) {
    var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
    this.wbModel.getWorksheet(sheetIndex).PagePrintOptions = options;
  };

  spreadsheet_api.prototype.asc_getPageOptions = function(index) {
    var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
    return this.wbModel.getWorksheet(sheetIndex).PagePrintOptions;
  };

  spreadsheet_api.prototype._onNeedParams = function(data, opt_isPassword) {
    var t = this;
    // Проверяем, возможно нам пришли опции для CSV
    if (this.documentOpenOptions && !opt_isPassword) {
      var codePageCsv = AscCommon.c_oAscEncodingsMap[this.documentOpenOptions["codePage"]] || AscCommon.c_oAscCodePageUtf8, delimiterCsv = this.documentOpenOptions["delimiter"];
      if (null != codePageCsv && null != delimiterCsv) {
        this.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new asc.asc_CCSVAdvancedOptions(codePageCsv, delimiterCsv));
        return;
      }
    }
    if (opt_isPassword) {
      t.handlers.trigger("asc_onAdvancedOptions", new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.DRM), this.advancedOptionsAction);
    } else if (data) {
      AscCommon.loadFileContent(data, function(result) {
        if (null === result) {
          t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
          return;
        }
        var cp = JSON.parse(result);
        cp['encodings'] = AscCommon.getEncodingParams();
        t.handlers.trigger("asc_onAdvancedOptions", new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), t.advancedOptionsAction);
      });
    } else {
      t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
    }
  };
  spreadsheet_api.prototype._onOpenCommand = function(data) {
    var t = this;
    AscCommon.openFileCommand(data, this.documentUrlChanges, AscCommon.c_oSerFormat.Signature, function(error, result) {
      if (error || !result.bSerFormat) {
        var oError = {returnCode: c_oAscError.Level.Critical, val: c_oAscError.ID.Unknown};
        t.handlers.trigger("asc_onError", oError.val, oError.returnCode);
        return;
      }

      t.onEndLoadFile(result.data);
    });
  };

  spreadsheet_api.prototype._OfflineAppDocumentEndLoad = function() {
    var data = getTestWorkbook();
    var sData = data + "";
    if (AscCommon.c_oSerFormat.Signature === sData.substring(0, AscCommon.c_oSerFormat.Signature.length)) {
      this.openDocument(sData);
    }
  };

  spreadsheet_api.prototype._asc_save2 = function () {
    var oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.wbModel);
    var dataContainer = {data: null, part: null, index: 0, count: 0};
    dataContainer.data = oBinaryFileWriter.Write();
    var filetype = 0x1002;
    var oAdditionalData = {};
    oAdditionalData["c"] = "sfct";
    oAdditionalData["id"] = this.documentId;
    oAdditionalData["userid"] = this.documentUserId;
    oAdditionalData["jwt"] = this.CoAuthoringApi.get_jwt();
    oAdditionalData["outputformat"] = filetype;
    oAdditionalData["title"] =
        AscCommon.changeFileExtention(this.documentTitle, AscCommon.getExtentionByFormat(filetype));
    oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.CompleteAll;
    var t = this;
    t.fCurCallback = function (incomeObject) {
      if (null != input && "save" == input["type"]) {
        if ('ok' == input["status"]) {
          var url = input["data"];
          if (url) {
            t.processSavedFile(url, false);
          } else {
            t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
          }
        } else {
          t.handlers.trigger("asc_onError",
              mapAscServerErrorToAscError(parseInt(input["data"]), AscCommon.c_oAscAdvancedOptionsAction.Save),
              c_oAscError.Level.NoCritical);
        }
      } else {
        t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
      }
    };
    AscCommon.saveWithParts(function (fCallback1, oAdditionalData1, dataContainer1) {
      sendCommand(t, fCallback1, oAdditionalData1, dataContainer1);
    }, t.fCurCallback, null, oAdditionalData, dataContainer);
  };

  spreadsheet_api.prototype._asc_downloadAs = function(sFormat, actionType, options) { //fCallback({returnCode:"", ...})
    var t = this;
    if (!options) {
      options = {};
    }
    if (actionType) {
      this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, actionType);
    }
    // Меняем тип состояния (на сохранение)
    this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
    
    //sFormat: xlsx, xls, ods, csv, html
    var dataContainer = {data: null, part: null, index: 0, count: 0};
    var command = "save";
    var oAdditionalData = {};
    oAdditionalData["c"] = command;
    oAdditionalData["id"] = this.documentId;
    oAdditionalData["userid"] = this.documentUserId;
    oAdditionalData["jwt"] = this.CoAuthoringApi.get_jwt();
    oAdditionalData["outputformat"] = sFormat;
    oAdditionalData["title"] = AscCommon.changeFileExtention(this.documentTitle, AscCommon.getExtentionByFormat(sFormat));
    if (DownloadType.Print === options.downloadType) {
      oAdditionalData["inline"] = 1;
    }
    if (c_oAscFileType.PDF === sFormat) {
      var printPagesData = this.wb.calcPagesPrint(this.adjustPrint);
      var pdf_writer = new AscCommonExcel.CPdfPrinter();
      this.wb.printSheets(pdf_writer, printPagesData);

      dataContainer.data = pdf_writer.DocumentRenderer.Memory.GetBase64Memory();
    } else if (c_oAscFileType.CSV === sFormat && !options.CSVOptions) {
      // Мы открывали команду, надо ее закрыть.
      if (actionType) {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
      }
      var cp = {'delimiter': AscCommon.c_oAscCsvDelimiter.Comma, 'codepage': AscCommon.c_oAscCodePageUtf8, 'encodings': AscCommon.getEncodingParams()};
      this.downloadType = options.downloadType;
      this.handlers.trigger("asc_onAdvancedOptions", new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV, cp), this.advancedOptionsAction);
      return;
    } else {
      var oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.wbModel);
      if (c_oAscFileType.CSV === sFormat) {
        if (options.CSVOptions instanceof asc.asc_CCSVAdvancedOptions) {
          oAdditionalData["codepage"] = options.CSVOptions.asc_getCodePage();
          oAdditionalData["delimiter"] = options.CSVOptions.asc_getDelimiter();
        }
      }
      dataContainer.data = oBinaryFileWriter.Write();
    }
    var fCallback = function(input) {
      var error = c_oAscError.ID.Unknown;
      if (null != input && command == input["type"]) {
        if ('ok' == input["status"]) {
          var url = input["data"];
          if (url) {
            error = c_oAscError.ID.No;
            t.processSavedFile(url, options.downloadType);
          }
        } else {
          error = mapAscServerErrorToAscError(parseInt(input["data"]), AscCommon.c_oAscAdvancedOptionsAction.Save);
        }
      }
      if (c_oAscError.ID.No != error) {
        t.handlers.trigger("asc_onError", error, c_oAscError.Level.NoCritical);
      }
      // Меняем тип состояния (на никакое)
      t.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
      if (actionType) {
        t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
      }
    };
    t.fCurCallback = fCallback;
    AscCommon.saveWithParts(function(fCallback1, oAdditionalData1, dataContainer1) {
      sendCommand(t, fCallback1, oAdditionalData1, dataContainer1);
    }, fCallback, null, oAdditionalData, dataContainer);
  };

  spreadsheet_api.prototype.asc_isDocumentModified = function() {
    if (!this.canSave || this.asc_getCellEditMode()) {
      // Пока идет сохранение или редактирование ячейки, мы не закрываем документ
      return true;
    } else if (History && History.Have_Changes) {
      return History.Have_Changes();
    }
    return false;
  };

  spreadsheet_api.prototype.asc_getCanUndo = function() {
    return History.Can_Undo();
  };
  spreadsheet_api.prototype.asc_getCanRedo = function() {
    return History.Can_Redo();
  };


  // Actions and callbacks interface

  /*
   * asc_onStartAction			(type, id)
   * asc_onEndAction				(type, id)
   * asc_onInitEditorFonts		(gui_fonts)
   * asc_onInitEditorStyles		(gui_styles)
   * asc_onOpenDocumentProgress	(AscCommon.COpenProgress)
   * asc_onAdvancedOptions		(asc_CAdvancedOptions, ascAdvancedOptionsAction)	- эвент на получение дополнительных опций (открытие/сохранение CSV)
   * asc_onError					(c_oAscError.ID, c_oAscError.Level)					- эвент об ошибке
   * asc_onEditCell				(Asc.c_oAscCellEditorState)								- эвент на редактирование ячейки с состоянием (переходами из формулы и обратно)
   * asc_onEditorSelectionChanged	(asc_CFont)											- эвент на смену информации о выделении в редакторе ячейки
   * asc_onSelectionChanged		(asc_CCellInfo)										- эвент на смену информации о выделении
   * asc_onSelectionNameChanged	(sName)												- эвент на смену имени выделения (Id-ячейки, число выделенных столбцов/строк, имя диаграммы и др.)
   * asc_onSelection
   *
   * Changed	(asc_CSelectionMathInfo)							- эвент на смену математической информации о выделении
   * asc_onZoomChanged			(zoom)
   * asc_onSheetsChanged			()													- эвент на обновление списка листов
   * asc_onActiveSheetChanged		(indexActiveSheet)									- эвент на обновление активного листа
   * asc_onCanUndoChanged			(bCanUndo)											- эвент на обновление возможности undo
   * asc_onCanRedoChanged			(bCanRedo)											- эвент на обновление возможности redo
   * asc_onSaveUrl				(sUrl, callback(hasError))							- эвент на сохранение файла на сервер по url
   * asc_onDocumentModifiedChanged(bIsModified)										- эвент на обновление статуса "изменен ли файл"
   * asc_onMouseMove				(asc_CMouseMoveData)								- эвент на наведение мышкой на гиперлинк или комментарий
   * asc_onHyperlinkClick			(sUrl)												- эвент на нажатие гиперлинка
   * asc_onCoAuthoringDisconnect	()													- эвент об отключении от сервера без попытки reconnect
   * asc_onSelectionRangeChanged	(selectRange)										- эвент о выборе диапазона для диаграммы (после нажатия кнопки выбора)
   * asc_onRenameCellTextEnd		(countCellsFind, countCellsReplace)					- эвент об окончании замены текста в ячейках (мы не можем сразу прислать ответ)
   * asc_onWorkbookLocked			(result)											- эвент залочена ли работа с листами или нет
   * asc_onWorksheetLocked		(index, result)										- эвент залочен ли лист или нет
   * asc_onGetEditorPermissions	(permission)										- эвент о правах редактора
   * asc_onStopFormatPainter		()													- эвент об окончании форматирования по образцу
   * asc_onUpdateSheetSettings	()													- эвент об обновлении свойств листа (закрепленная область, показывать сетку/заголовки)
   * asc_onUpdateTabColor			(index)												- эвент об обновлении цвета иконки листа
   * asc_onDocumentCanSaveChanged	(bIsCanSave)										- эвент об обновлении статуса "можно ли сохранять файл"
   * asc_onDocumentUpdateVersion	(callback)											- эвент о том, что файл собрался и не может больше редактироваться
   * asc_onContextMenu			(event)												- эвент на контекстное меню
   * asc_onDocumentContentReady ()                        - эвент об окончании загрузки документа
   * asc_onFilterInfo	        (countFilter, countRecords)								- send count filtered and all records
   */

  spreadsheet_api.prototype.asc_registerCallback = function(name, callback, replaceOldCallback) {
    this.handlers.add(name, callback, replaceOldCallback);
    return;

    /*
     Не самая хорошая схема для отправки эвентов:
     проверяем, подписан ли кто-то на эвент? Если да, то отправляем и больше ничего не делаем.
     Если никто не подписан, то сохраняем у себя переменную и как только кто-то подписывается - отправляем ее
     */
    if (null !== this._gui_control_colors && "asc_onSendThemeColors" === name) {
      this.handlers.trigger("asc_onSendThemeColors", this._gui_control_colors.Colors, this._gui_control_colors.StandartColors);
      this._gui_control_colors = null;
    }
  };

  spreadsheet_api.prototype.asc_unregisterCallback = function(name, callback) {
    this.handlers.remove(name, callback);
  };

  spreadsheet_api.prototype.asc_getController = function() {
    return this.controller;
//				return null;
  };

  spreadsheet_api.prototype.asc_SetDocumentPlaceChangedEnabled = function(val) {
    this.wb.setDocumentPlaceChangedEnabled(val);
  };

  spreadsheet_api.prototype.asc_SetFastCollaborative = function(bFast) {
    if (this.collaborativeEditing) {
      AscCommon.CollaborativeEditing.Set_Fast(bFast);
      this.collaborativeEditing.setFast(bFast);
    }
  };

	spreadsheet_api.prototype.asc_setThumbnailStylesSizes = function (width, height) {
		this.styleThumbnailWidth = width;
		this.styleThumbnailHeight = height;
	};

  // Посылает эвент о том, что обновились листы
  spreadsheet_api.prototype.sheetsChanged = function() {
    this.handlers.trigger("asc_onSheetsChanged");
  };

  spreadsheet_api.prototype.asyncFontsDocumentStartLoaded = function() {
    this.OpenDocumentProgress.Type = c_oAscAsyncAction.LoadDocumentFonts;
    this.OpenDocumentProgress.FontsCount = this.FontLoader.fonts_loading.length;
    this.OpenDocumentProgress.CurrentFont = 0;
    this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
  };

  spreadsheet_api.prototype.asyncFontsDocumentEndLoaded = function() {
    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

    if (this.asyncMethodCallback !== undefined) {
      this.asyncMethodCallback();
      this.asyncMethodCallback = undefined;
    } else {
      // Шрифты загрузились, возможно стоит подождать совместное редактирование
      this.FontLoadWaitComplete = true;
      if (this.ServerIdWaitComplete) {
        this._openDocumentEndCallback();
      }
    }
  };

  spreadsheet_api.prototype.asyncFontEndLoaded = function(font) {
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
  };

  spreadsheet_api.prototype._loadFonts = function(fonts, callback) {
    if (window["NATIVE_EDITOR_ENJINE"]) {
      return callback();
    }
    this.asyncMethodCallback = callback;
    var arrLoadFonts = [];
    for (var i in fonts)
      arrLoadFonts.push(new AscFonts.CFont(i, 0, "", 0));
    History.loadFonts(arrLoadFonts);
    this.FontLoader.LoadDocumentFonts2(arrLoadFonts);
  };

  spreadsheet_api.prototype.openDocument = function(sData) {
    if (true === sData) {
      // Empty Document
      sData = AscCommonExcel.getEmptyWorkbook() + "";
      if (sData.length && (AscCommon.c_oSerFormat.Signature === sData.substring(0, AscCommon.c_oSerFormat.Signature.length))) {
        this.isChartEditor = true;
      } else {
        return;
      }
    }

    this.wbModel = this._openDocument(sData);

    this.FontLoader.LoadDocumentFonts(this.wbModel.generateFontMap2());

    // Какая-то непонятная заглушка, чтобы не падало в ipad
    if (this.isMobileVersion) {
      AscCommon.AscBrowser.isSafariMacOs = false;
      AscCommon.PasteElementsId.PASTE_ELEMENT_ID = "wrd_pastebin";
      AscCommon.PasteElementsId.ELEMENT_DISPAY_STYLE = "none";
    }
  };

  // Соединились с сервером
  spreadsheet_api.prototype.asyncServerIdEndLoaded = function() {
    // С сервером соединились, возможно стоит подождать загрузку шрифтов
    this.ServerIdWaitComplete = true;
    if (this.FontLoadWaitComplete) {
      this._openDocumentEndCallback();
    }
  };

  // Эвент о пришедщих изменениях
  spreadsheet_api.prototype.syncCollaborativeChanges = function() {
    // Для быстрого сохранения уведомлять не нужно.
    if (!this.collaborativeEditing.getFast()) {
      this.handlers.trigger("asc_onCollaborativeChanges");
    }
  };

  // Применение изменений документа, пришедших при открытии
  // Их нужно применять после того, как мы создали WorkbookView
  // т.к. автофильтры, диаграммы, изображения и комментарии завязаны на WorksheetView (ToDo переделать)
  spreadsheet_api.prototype._applyFirstLoadChanges = function() {
    if (this.IsSendDocumentLoadCompleate) {
      return;
    }
    if (this.collaborativeEditing.applyChanges()) {
      // Изменений не было
      this.IsSendDocumentLoadCompleate = true;
      this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
      this.handlers.trigger('asc_onDocumentContentReady');
    }
  };

  /////////////////////////////////////////////////////////////////////////
  ///////////////////CoAuthoring and Chat api//////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  spreadsheet_api.prototype._coAuthoringInitEnd = function() {
    var t = this;
    this.collaborativeEditing = new AscCommonExcel.CCollaborativeEditing(/*handlers*/{
      "askLock": function() {
        t.CoAuthoringApi.askLock.apply(t.CoAuthoringApi, arguments);
      },
      "releaseLocks": function() {
        t.CoAuthoringApi.releaseLocks.apply(t.CoAuthoringApi, arguments);
      },
      "sendChanges": function() {
        t._onSaveChanges.apply(t, arguments);
      },
      "applyChanges": function() {
        t._onApplyChanges.apply(t, arguments);
      },
      "updateAfterApplyChanges": function() {
        t._onUpdateAfterApplyChanges.apply(t, arguments);
      },
      "drawSelection": function() {
        t._onDrawSelection.apply(t, arguments);
      },
      "drawFrozenPaneLines": function() {
        t._onDrawFrozenPaneLines.apply(t, arguments);
      },
      "updateAllSheetsLock": function() {
        t._onUpdateAllSheetsLock.apply(t, arguments);
      },
      "showDrawingObjects": function() {
        t._onShowDrawingObjects.apply(t, arguments);
      },
      "showComments": function() {
        t._onShowComments.apply(t, arguments);
      },
      "cleanSelection": function() {
        t._onCleanSelection.apply(t, arguments);
      },
      "updateDocumentCanSave": function() {
        t._onUpdateDocumentCanSave();
      },
      "checkCommentRemoveLock": function(lockElem) {
        return t._onCheckCommentRemoveLock(lockElem);
      },
      "unlockDefName": function() {
        t._onUnlockDefName.apply(t, arguments);
      },
      "checkDefNameLock": function(lockElem) {
        return t._onCheckDefNameLock(lockElem);
      }
    }, this.getViewMode());

    this.CoAuthoringApi.onConnectionStateChanged = function(e) {
      t.handlers.trigger("asc_onConnectionStateChanged", e);
    };
    this.CoAuthoringApi.onLocksAcquired = function(e) {
      if (!t.IsSendDocumentLoadCompleate) {
        // Пока документ еще не загружен, будем сохранять функцию и аргументы
        t.arrPreOpenLocksObjects.push(function(){t.CoAuthoringApi.onLocksAcquired(e);});
        return;
      }

      if (2 != e["state"]) {
        var elementValue = e["blockValue"];
        var lockElem = t.collaborativeEditing.getLockByElem(elementValue, c_oAscLockTypes.kLockTypeOther);
        if (null === lockElem) {
          lockElem = new AscCommonExcel.CLock(elementValue);
          t.collaborativeEditing.addUnlock(lockElem);
        }

        var drawing, lockType = lockElem.Element["type"];
        var oldType = lockElem.getType();
        if (c_oAscLockTypes.kLockTypeOther2 === oldType || c_oAscLockTypes.kLockTypeOther3 === oldType) {
          lockElem.setType(c_oAscLockTypes.kLockTypeOther3, true);
        } else {
          lockElem.setType(c_oAscLockTypes.kLockTypeOther, true);
        }

        // Выставляем ID пользователя, залочившего данный элемент
        lockElem.setUserId(e["user"]);

        if (lockType === c_oAscLockTypeElem.Object) {
          drawing = g_oTableId.Get_ById(lockElem.Element["rangeOrObjectId"]);
          if (drawing) {
            drawing.lockType = lockElem.Type;
          }
        }

        if (t.wb) {
          // Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно заблокировать toolbar
          t.wb._onWSSelectionChanged();

          // Шлем update для листов
          t._onUpdateSheetsLock(lockElem);

          t._onUpdateDefinedNames(lockElem);

          var ws = t.wb.getWorksheet();
          var lockSheetId = lockElem.Element["sheetId"];
          if (lockSheetId === ws.model.getId()) {
            if (lockType === c_oAscLockTypeElem.Object) {
              // Нужно ли обновлять закрепление областей
              if (t._onUpdateFrozenPane(lockElem)) {
                ws.draw();
              } else if (drawing && ws.model === drawing.worksheet) {
                if (ws.objectRender) {
                  ws.objectRender.showDrawingObjects(true);
                }
              }
            } else if (lockType === c_oAscLockTypeElem.Range || lockType === c_oAscLockTypeElem.Sheet) {
              ws.updateSelection();
            }
          } else if (-1 !== lockSheetId && 0 === lockSheetId.indexOf(AscCommonExcel.CCellCommentator.sStartCommentId)) {
            // Коммментарий
            t.handlers.trigger("asc_onLockComment", lockElem.Element["rangeOrObjectId"], e["user"]);
          }
        }
      }
    };
    this.CoAuthoringApi.onLocksReleased = function(e, bChanges) {
      if (!t.IsSendDocumentLoadCompleate) {
        // Пока документ еще не загружен, будем сохранять функцию и аргументы
        t.arrPreOpenLocksObjects.push(function(){t.CoAuthoringApi.onLocksReleased(e, bChanges);});
        return;
      }

      var element = e["block"];
      var lockElem = t.collaborativeEditing.getLockByElem(element, c_oAscLockTypes.kLockTypeOther);
      if (null != lockElem) {
        var curType = lockElem.getType();

        var newType = c_oAscLockTypes.kLockTypeNone;
        if (curType === c_oAscLockTypes.kLockTypeOther) {
          if (true != bChanges) {
            newType = c_oAscLockTypes.kLockTypeNone;
          } else {
            newType = c_oAscLockTypes.kLockTypeOther2;
          }
        } else if (curType === c_oAscLockTypes.kLockTypeMine) {
          // Такого быть не должно
          newType = c_oAscLockTypes.kLockTypeMine;
        } else if (curType === c_oAscLockTypes.kLockTypeOther2 || curType === c_oAscLockTypes.kLockTypeOther3) {
          newType = c_oAscLockTypes.kLockTypeOther2;
        }

        if (t.wb) {
          t.wb.getWorksheet().cleanSelection();
        }

        var drawing;
        if (c_oAscLockTypes.kLockTypeNone !== newType) {
          lockElem.setType(newType, true);
        } else {
          // Удаляем из lock-ов, тот, кто правил ушел и не сохранил
          t.collaborativeEditing.removeUnlock(lockElem);
          if (!t._onCheckCommentRemoveLock(lockElem.Element)) {
            if (lockElem.Element["type"] === c_oAscLockTypeElem.Object) {
              drawing = g_oTableId.Get_ById(lockElem.Element["rangeOrObjectId"]);
              if (drawing) {
                drawing.lockType = c_oAscLockTypes.kLockTypeNone;
              }
            }
          }
        }
        if (t.wb) {
          // Шлем update для листов
          t._onUpdateSheetsLock(lockElem);
          /*снимаем лок для DefName*/
          t.handlers.trigger("asc_onLockDefNameManager",Asc.c_oAscDefinedNameReason.OK);
        }
      }
    };
    this.CoAuthoringApi.onLocksReleasedEnd = function() {
      if (!t.IsSendDocumentLoadCompleate) {
        // Пока документ еще не загружен ничего не делаем
        return;
      }

      if (t.wb) {
        // Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно сбросить блокировку toolbar
        t.wb._onWSSelectionChanged();

        var worksheet = t.wb.getWorksheet();
        worksheet.cleanSelection();
        worksheet._drawSelection();
        worksheet._drawFrozenPaneLines();
        if (worksheet.objectRender) {
          worksheet.objectRender.showDrawingObjects(true);
        }
      }
    };
    this.CoAuthoringApi.onSaveChanges = function(e, userId, bFirstLoad) {
      t.collaborativeEditing.addChanges(e);
      if (!bFirstLoad && t.IsSendDocumentLoadCompleate) {
        t.syncCollaborativeChanges();
      }
    };
    this.CoAuthoringApi.onRecalcLocks = function(excelAdditionalInfo) {
      if (!excelAdditionalInfo) {
        return;
      }

      var tmpAdditionalInfo = JSON.parse(excelAdditionalInfo);
      // Это мы получили recalcIndexColumns и recalcIndexRows
      var oRecalcIndexColumns = t.collaborativeEditing.addRecalcIndex('0', tmpAdditionalInfo['indexCols']);
      var oRecalcIndexRows = t.collaborativeEditing.addRecalcIndex('1', tmpAdditionalInfo['indexRows']);

      // Теперь нужно пересчитать индексы для lock-элементов
      if (null !== oRecalcIndexColumns || null !== oRecalcIndexRows) {
        t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeMine, oRecalcIndexColumns, oRecalcIndexRows);
        t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeOther, oRecalcIndexColumns, oRecalcIndexRows);
      }
    };
    this.CoAuthoringApi.onStartCoAuthoring = function(isStartEvent) {
      t.startCollaborationEditing();

      // На старте не нужно ничего делать
      if (!isStartEvent) {
        // Когда документ еще не загружен, нужно отпустить lock (при быстром открытии 2-мя пользователями)
        if (!t.IsSendDocumentLoadCompleate) {
          t.CoAuthoringApi.unLockDocument(false);
        } else {
          // Принимаем чужие изменения
          t.collaborativeEditing.applyChanges();
          // Пересылаем свои изменения
          t.collaborativeEditing.sendChanges();
        }
      }
    };
    this.CoAuthoringApi.onEndCoAuthoring = function(isStartEvent) {
      t.endCollaborationEditing();
    };
  };

  spreadsheet_api.prototype._onSaveChanges = function(recalcIndexColumns, recalcIndexRows) {
    if (this.IsSendDocumentLoadCompleate) {
      var arrChanges = this.wbModel.SerializeHistory();
      var deleteIndex = History.Get_DeleteIndex();
      var excelAdditionalInfo = null;
      if (this.collaborativeEditing.getCollaborativeEditing()) {
        // Пересчетные индексы добавляем только если мы не одни
        if (recalcIndexColumns || recalcIndexRows) {
          excelAdditionalInfo = {"indexCols": recalcIndexColumns, "indexRows": recalcIndexRows};
        }
      }
      if (0 < arrChanges.length || null !== deleteIndex || null !== excelAdditionalInfo) {
        this.CoAuthoringApi.saveChanges(arrChanges, deleteIndex, excelAdditionalInfo);
        History.CanNotAddChanges = true;
      } else {
        this.CoAuthoringApi.unLockDocument(true);
      }
    }
  };

  spreadsheet_api.prototype._onApplyChanges = function(changes, fCallback) {
    this.wbModel.DeserializeHistory(changes, fCallback);
  };

  spreadsheet_api.prototype._onUpdateAfterApplyChanges = function() {
    if (!this.IsSendDocumentLoadCompleate) {
      // При открытии после принятия изменений мы должны сбросить пересчетные индексы
      this.collaborativeEditing.clearRecalcIndex();
      this.IsSendDocumentLoadCompleate = true;
      this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
      this.handlers.trigger('asc_onDocumentContentReady');
    } else if (this.wb && !window["NATIVE_EDITOR_ENJINE"]) {
      // Нужно послать 'обновить свойства' (иначе для удаления данных не обновится строка формул).
      // ToDo Возможно стоит обновлять только строку формул
      AscCommon.CollaborativeEditing.Load_Images();
      this.wb._onWSSelectionChanged();
      History.TurnOff();
      this.wb.getWorksheet().updateVisibleRange();
      History.TurnOn();
    }
  };

  spreadsheet_api.prototype._onCleanSelection = function() {
    if (this.wb) {
      this.wb.getWorksheet().cleanSelection();
    }
  };

  spreadsheet_api.prototype._onDrawSelection = function() {
    if (this.wb) {
      this.wb.getWorksheet()._drawSelection();
    }
  };

  spreadsheet_api.prototype._onDrawFrozenPaneLines = function() {
    if (this.wb) {
      this.wb.getWorksheet()._drawFrozenPaneLines();
    }
  };

  spreadsheet_api.prototype._onUpdateAllSheetsLock = function() {
    var t = this;
    if (t.wbModel) {
      // Шлем update для листов
      t.handlers.trigger("asc_onWorkbookLocked", t.asc_isWorkbookLocked());
      var i, length, wsModel, wsIndex;
      for (i = 0, length = t.wbModel.getWorksheetCount(); i < length; ++i) {
        wsModel = t.wbModel.getWorksheet(i);
        wsIndex = wsModel.getIndex();
        t.handlers.trigger("asc_onWorksheetLocked", wsIndex, t.asc_isWorksheetLockedOrDeleted(wsIndex));
      }
    }
  };

  spreadsheet_api.prototype._onShowDrawingObjects = function() {
    if (this.wb) {
      var ws = this.wb.getWorksheet();
      if (ws && ws.objectRender) {
        ws.objectRender.showDrawingObjects(true);
      }
    }
  };

  spreadsheet_api.prototype._onShowComments = function() {
    if (this.wb) {
      this.wb.getWorksheet().cellCommentator.drawCommentCells();
    }
  };

  spreadsheet_api.prototype._onUpdateSheetsLock = function(lockElem) {
    var t = this;
    // Шлем update для листов, т.к. нужно залочить лист
    if (c_oAscLockTypeElem.Sheet === lockElem.Element["type"]) {
      t.handlers.trigger("asc_onWorkbookLocked", t.asc_isWorkbookLocked());
    }
    // Шлем update для листа
    var wsModel = t.wbModel.getWorksheetById(lockElem.Element["sheetId"]);
    if (wsModel) {
      var wsIndex = wsModel.getIndex();
      t.handlers.trigger("asc_onWorksheetLocked", wsIndex, t.asc_isWorksheetLockedOrDeleted(wsIndex));
    }
  };

  spreadsheet_api.prototype._onUpdateFrozenPane = function(lockElem) {
    return (c_oAscLockTypeElem.Object === lockElem.Element["type"] && lockElem.Element["rangeOrObjectId"] === AscCommonExcel.c_oAscLockNameFrozenPane);
  };

	spreadsheet_api.prototype._sendWorkbookStyles = function () {
		if (this.wbModel) {

			if (window["NATIVE_EDITOR_ENJINE"]) {
				// Для нативной версии (сборка и приложение) не генерируем стили
				return;
			}

			// Отправка стилей ячеек
			this.handlers.trigger("asc_onInitEditorStyles",
				this.wb.getCellStyles(this.styleThumbnailWidth, this.styleThumbnailHeight));
		}
	};

  spreadsheet_api.prototype.startCollaborationEditing = function() {
    // Начинаем совместное редактирование
    this.collaborativeEditing.startCollaborationEditing();
  };

  spreadsheet_api.prototype.endCollaborationEditing = function() {
    // Временно заканчиваем совместное редактирование
    this.collaborativeEditing.endCollaborationEditing();
  };

  // End Load document
  spreadsheet_api.prototype._openDocumentEndCallback = function() {
    // Не инициализируем дважды
    if (this.DocumentLoadComplete) {
      return;
    }

    this.wb = new AscCommonExcel.WorkbookView(this.wbModel, this.controller, this.handlers, this.HtmlElement, this.topLineEditorElement, this, this.collaborativeEditing, this.fontRenderingMode);

    if (this.isMobileVersion) {

        var _container = document.getElementById(this.HtmlElementName);
        if (_container)
          _container.style.overflow = "hidden";
        this.wb.MobileTouchManager = new AscCommonExcel.CMobileTouchManager({ eventsElement : "cell_mobile_element" });
        this.wb.MobileTouchManager.Init(this);

        // input context must be created!!!
        var _areaId = AscCommon.g_inputContext.HtmlArea.id;
        var _element = document.getElementById(_areaId);
        _element.parentNode.parentNode.style.zIndex = 10;

        this.wb.MobileTouchManager.initEvents(AscCommon.g_inputContext.HtmlArea.id);
    }

    this.DocumentLoadComplete = true;

    this.asc_CheckGuiControlColors();
    this.sendColorThemes(this.wbModel.theme);
    this.asc_ApplyColorScheme(false);

    this.sendStandartTextures();
    this.sendMathToMenu();

    // Применяем пришедшие при открытии изменения
    this._applyFirstLoadChanges();
    // Применяем все lock-и (ToDo возможно стоит пересмотреть вообще Lock-и)
    for (var i = 0; i < this.arrPreOpenLocksObjects.length; ++i) {
      this.arrPreOpenLocksObjects[i]();
    }
    this.arrPreOpenLocksObjects = [];

    // Меняем тип состояния (на никакое)
    this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;

    // Были ошибки при открытии, посылаем предупреждение
    if (0 < this.wbModel.openErrors.length) {
      this.sendEvent('asc_onError', c_oAscError.ID.OpenWarning, c_oAscError.Level.NoCritical);
    }

    //this.asc_Resize(); // Убрал, т.к. сверху приходит resize (http://bugzilla.onlyoffice.com/show_bug.cgi?id=14680)
  };

  // Переход на диапазон в листе
  spreadsheet_api.prototype._asc_setWorksheetRange = function(val) {
    // Получаем sheet по имени
    var ws = this.wbModel.getWorksheetByName(val.asc_getSheet());
    if (!ws) {
      this.handlers.trigger("asc_onHyperlinkClick", null);
      return;
    } else if (ws.getHidden()) {
      return;
    }
    // Индекс листа
    var sheetIndex = ws.getIndex();
    // Если не совпали индекс листа и индекс текущего, то нужно сменить
    if (this.asc_getActiveWorksheetIndex() !== sheetIndex) {
      // Меняем активный лист
      this.asc_showWorksheet(sheetIndex);
      // Посылаем эвент о смене активного листа
      this.handlers.trigger("asc_onActiveSheetChanged", sheetIndex);
    }
    var range = ws.getRange2(val.asc_getRange());
    if (null !== range) {
      this.wb._onSetSelection(range.getBBox0(), /*validRange*/ true);
    }
  };

  spreadsheet_api.prototype.onSaveCallback = function(e) {
    var t = this;
    var nState;
    if (false == e["saveLock"]) {
      if (this.isLongAction()) {
        // Мы не можем в этот момент сохранять, т.к. попали в ситуацию, когда мы залочили сохранение и успели нажать вставку до ответа
        // Нужно снять lock с сохранения
        this.CoAuthoringApi.onUnSaveLock = function() {
          t.canSave = true;
          t.IsUserSave = false;
          t.lastSaveTime = null;
        };
        this.CoAuthoringApi.unSaveLock();
        return;
      }

      if (!this.IsUserSave) {
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
      }

      AscCommon.CollaborativeEditing.Clear_CollaborativeMarks();
      // Принимаем чужие изменения
      this.collaborativeEditing.applyChanges();

      this.CoAuthoringApi.onUnSaveLock = function() {
        t.CoAuthoringApi.onUnSaveLock = null;

        if (t.collaborativeEditing.getCollaborativeEditing()) {
          // Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно заблокировать toolbar
          t.wb._onWSSelectionChanged();
        }

        t.canSave = true;
        t.IsUserSave = false;
        t.lastSaveTime = null;

        t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
        // Обновляем состояние возможности сохранения документа
        t.onUpdateDocumentModified(History.Have_Changes());

        if (undefined !== window["AscDesktopEditor"]) {
          window["AscDesktopEditor"]["OnSave"]();
        }
      };

      // Пересылаем всегда, но чистим только если началось совместное редактирование
      // Пересылаем свои изменения
      this.collaborativeEditing.sendChanges(this.IsUserSave);
    } else {
      nState = t.CoAuthoringApi.get_state();
      if (AscCommon.ConnectionState.ClosedCoAuth === nState || AscCommon.ConnectionState.ClosedAll === nState) {
        // Отключаемся от сохранения, соединение потеряно
        if (this.IsUserSave) {
          this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
        }
        this.IsUserSave = false;
        this.canSave = true;
      } else {
        // Если автосохранение, то не будем ждать ответа, а просто перезапустим таймер на немного
        if (!this.IsUserSave) {
          this.canSave = true;
          return;
        }

        setTimeout(function() {
          t.CoAuthoringApi.askSaveChanges(function(event) {
            t.onSaveCallback(event);
          });
        }, 1000);
      }
    }
  };

  spreadsheet_api.prototype._getIsLockObjectSheet = function(lockInfo, callback) {
    if (false === this.collaborativeEditing.getCollaborativeEditing()) {
      // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
      AscCommonExcel.applyFunction(callback, true);
      callback = undefined;
    }
    if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
      // Редактируем сами
      AscCommonExcel.applyFunction(callback, true);
      return;
    } else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
      // Уже ячейку кто-то редактирует
      AscCommonExcel.applyFunction(callback, false);
      return;
    }

    this.collaborativeEditing.onStartCheckLock();
    this.collaborativeEditing.addCheckLock(lockInfo);
    this.collaborativeEditing.onEndCheckLock(callback);
  };
  // Залочена ли панель для закрепления
  spreadsheet_api.prototype._isLockedTabColor = function(index, callback) {
    var sheetId = this.wbModel.getWorksheet(index).getId();
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, AscCommonExcel.c_oAscLockNameTabColor);

    if (false === this.collaborativeEditing.getCollaborativeEditing()) {
      // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
      AscCommonExcel.applyFunction(callback, true);
      callback = undefined;
    }
    if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
      // Редактируем сами
      AscCommonExcel.applyFunction(callback, true);
      return;
    } else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
      // Уже ячейку кто-то редактирует
      AscCommonExcel.applyFunction(callback, false);
      return;
    }

    this.collaborativeEditing.onStartCheckLock();
    this.collaborativeEditing.addCheckLock(lockInfo);
    this.collaborativeEditing.onEndCheckLock(callback);
  };
  spreadsheet_api.prototype._isLockedSparkline = function (id, callback) {
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null,
        this.asc_getActiveWorksheetId(), id);
    if (false === this.collaborativeEditing.getCollaborativeEditing()) {
      // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
      AscCommonExcel.applyFunction(callback, true);
      callback = undefined;
    }
    if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, false)) {
      // Редактируем сами
      AscCommonExcel.applyFunction(callback, true);
      return;
    } else if (false !==
        this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
      // Уже ячейку кто-то редактирует
      AscCommonExcel.applyFunction(callback, false);
      return;
    }

    this.collaborativeEditing.onStartCheckLock();
    this.collaborativeEditing.addCheckLock(lockInfo);
    this.collaborativeEditing.onEndCheckLock(callback);
  };

  spreadsheet_api.prototype._addWorksheet = function (name, i) {
    var t = this;
    var addWorksheetCallback = function(res) {
      if (res) {
        t.wbModel.createWorksheet(i, name);
        t.wb.spliceWorksheet(i, 0, null);
        t.asc_showWorksheet(i);
        // Посылаем callback об изменении списка листов
        t.sheetsChanged();
      }
    };

    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null,
      AscCommonExcel.c_oAscLockAddSheet, AscCommonExcel.c_oAscLockAddSheet);
    this._getIsLockObjectSheet(lockInfo, addWorksheetCallback);
  };

  // Workbook interface

  spreadsheet_api.prototype.asc_getWorksheetsCount = function() {
    return this.wbModel.getWorksheetCount();
  };

  spreadsheet_api.prototype.asc_getWorksheetName = function(index) {
    return this.wbModel.getWorksheet(index).getName();
  };

  spreadsheet_api.prototype.asc_getWorksheetTabColor = function(index) {
    return this.wbModel.getWorksheet(index).getTabColor();
  };
  spreadsheet_api.prototype.asc_setWorksheetTabColor = function(index, color) {
    var t = this;
    var changeTabColorCallback = function(res) {
      if (res) {
        color = AscCommonExcel.CorrectAscColor(color);
        t.wbModel.getWorksheet(index).setTabColor(color);
      }
    };
    this._isLockedTabColor(index, changeTabColorCallback);
  };

  spreadsheet_api.prototype.asc_getActiveWorksheetIndex = function() {
    return this.wbModel.getActive();
  };

  spreadsheet_api.prototype.asc_getActiveWorksheetId = function() {
    var activeIndex = this.wbModel.getActive();
    return this.wbModel.getWorksheet(activeIndex).getId();
  };

  spreadsheet_api.prototype.asc_getWorksheetId = function(index) {
    return this.wbModel.getWorksheet(index).getId();
  };

  spreadsheet_api.prototype.asc_isWorksheetHidden = function(index) {
    return this.wbModel.getWorksheet(index).getHidden();
  };

  spreadsheet_api.prototype.asc_getDefinedNames = function(defNameListId) {
    return this.wb.getDefinedNames(defNameListId);
  };

  spreadsheet_api.prototype.asc_setDefinedNames = function(defName) {
//            return this.wb.setDefinedNames(defName);
    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock()) {
      return;
    }
    return this.wb.editDefinedNames(null, defName);
  };

  spreadsheet_api.prototype.asc_editDefinedNames = function(oldName, newName) {
    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock()) {
      return;
    }

    return this.wb.editDefinedNames(oldName, newName);
  };

  spreadsheet_api.prototype.asc_delDefinedNames = function(oldName) {
    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock()) {
      return;
    }
    return this.wb.delDefinedNames(oldName);
  };

  spreadsheet_api.prototype.asc_checkDefinedName = function(checkName, scope) {
    return this.wbModel.checkDefName(checkName, scope);
  };

  spreadsheet_api.prototype.asc_getDefaultDefinedName = function() {
    return this.wb.getDefaultDefinedName();
  };

  spreadsheet_api.prototype._onUpdateDefinedNames = function(lockElem) {
//      if( lockElem.Element["subType"] == AscCommonExcel.c_oAscLockTypeElemSubType.DefinedNames ){
      if( lockElem.Element["sheetId"] == -1 && lockElem.Element["rangeOrObjectId"] != -1 && !this.collaborativeEditing.getFast() ){
          var dN = this.wbModel.dependencyFormulas.getDefNameByNodeId(lockElem.Element["rangeOrObjectId"]);
          if (dN) {
              dN.isLock = lockElem.UserId;
              this.handlers.trigger("asc_onRefreshDefNameList",dN.getAscCDefName());
          }
          this.handlers.trigger("asc_onLockDefNameManager",Asc.c_oAscDefinedNameReason.LockDefNameManager);
      }
  };

  spreadsheet_api.prototype._onUnlockDefName = function() {
    this.wb.unlockDefName();
  };

  spreadsheet_api.prototype._onCheckDefNameLock = function() {
    return this.wb._onCheckDefNameLock();
  };

  // Залочена ли работа с листом
  spreadsheet_api.prototype.asc_isWorksheetLockedOrDeleted = function(index) {
    var ws = this.wbModel.getWorksheet(index);
    var sheetId = null;
    if (null === ws || undefined === ws) {
      sheetId = this.asc_getActiveWorksheetId();
    } else {
      sheetId = ws.getId();
    }

    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
    // Проверим, редактирует ли кто-то лист
    return (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false));
  };

  // Залочена ли работа с листами
  spreadsheet_api.prototype.asc_isWorkbookLocked = function() {
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, null, null);
    // Проверим, редактирует ли кто-то лист
    return (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false));
  };

  spreadsheet_api.prototype.asc_getHiddenWorksheets = function() {
    var model = this.wbModel;
    var len = model.getWorksheetCount();
    var i, ws, res = [];

    for (i = 0; i < len; ++i) {
      ws = model.getWorksheet(i);
      if (ws.getHidden()) {
        res.push({"index": i, "name": ws.getName()});
      }
    }
    return res;
  };

  spreadsheet_api.prototype.asc_showWorksheet = function(index) {
    if (typeof index === "number" && undefined !== index && null !== index) {
      var t = this;
      var ws = this.wbModel.getWorksheet(index);
      var isHidden = ws.getHidden();
      var showWorksheetCallback = function(res) {
        if (res) {
          t.wbModel.getWorksheet(index).setHidden(false);
          t.wb.showWorksheet(index);
          if (isHidden) {
            // Посылаем callback об изменении списка листов
            t.sheetsChanged();
          }
        }
      };
      if (isHidden) {
        var sheetId = this.wbModel.getWorksheet(index).getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
        this._getIsLockObjectSheet(lockInfo, showWorksheetCallback);
      } else {
        showWorksheetCallback(true);
      }
    }
  };

  spreadsheet_api.prototype.asc_showActiveWorksheet = function() {
    this.wb.showWorksheet(this.wbModel.getActive());
  };

  spreadsheet_api.prototype.asc_hideWorksheet = function() {
    var t = this;
    // Колличество листов
    var countWorksheets = this.asc_getWorksheetsCount();
    // Колличество скрытых листов
    var arrHideWorksheets = this.asc_getHiddenWorksheets();
    var countHideWorksheets = arrHideWorksheets.length;
    // Вдруг остался один лист
    if (countWorksheets <= countHideWorksheets + 1) {
      return false;
    }

    var model = this.wbModel;
    // Активный лист
    var activeWorksheet = model.getActive();
    var sheetId = this.wbModel.getWorksheet(activeWorksheet).getId();
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

    var hideWorksheetCallback = function(res) {
      if (res) {
        t.wbModel.getWorksheet(activeWorksheet).setHidden(true);
      }
    };

    this._getIsLockObjectSheet(lockInfo, hideWorksheetCallback);
    return true;
  };

  spreadsheet_api.prototype.asc_renameWorksheet = function(name) {
    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock()) {
      return false;
    }

    var i = this.wbModel.getActive();
    var sheetId = this.wbModel.getWorksheet(i).getId();
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

    var t = this;
    var renameCallback = function(res) {
      if (res) {
        t.wbModel.getWorksheet(i).setName(name);
        t.sheetsChanged();
      } else {
        t.handlers.trigger("asc_onError", c_oAscError.ID.LockedWorksheetRename, c_oAscError.Level.NoCritical);
      }
    };

    this._getIsLockObjectSheet(lockInfo, renameCallback);
    return true;
  };

  spreadsheet_api.prototype.asc_addWorksheet = function(name) {
    var i = this.wbModel.getActive();
    this._addWorksheet(name, i + 1);
  };

  spreadsheet_api.prototype.asc_insertWorksheet = function(name) {
    var i = this.wbModel.getActive();
    this._addWorksheet(name, i);
  };

  // Удаление листа
  spreadsheet_api.prototype.asc_deleteWorksheet = function() {
    // Проверка глобального лока
    if (this.collaborativeEditing.getGlobalLock()) {
      return false;
    }

    var i = this.wbModel.getActive();
    var activeSheet = this.wbModel.getWorksheet(i);
    var activeName = activeSheet.sName;
    var sheetId = activeSheet.getId();
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

    var t = this;
    var deleteCallback = function(res) {
      if (res) {

        History.Create_NewPoint();
        History.StartTransaction();
        t.wbModel.dependencyFormulas.lockRecal();
        // Нужно проверить все диаграммы, ссылающиеся на удаляемый лист
        for (var key in t.wb.model.aWorksheets) {
          var wsModel = t.wb.model.aWorksheets[key];
          if (wsModel) {
            History.TurnOff();
            var ws = t.wb.getWorksheet(wsModel.index);
            History.TurnOn();
            wsModel.oDrawingOjectsManager.updateChartReferencesWidthHistory(parserHelp.getEscapeSheetName(activeName), parserHelp.getEscapeSheetName(wsModel.sName));
            if (ws && ws.objectRender && ws.objectRender.controller) {
              ws.objectRender.controller.recalculate2(true);
            }
          }
        }

        // Удаляем Worksheet и получаем новый активный индекс (-1 означает, что ничего не удалилось)
        var activeNow = t.wbModel.removeWorksheet(i);
        if (-1 !== activeNow) {
          t.wb.removeWorksheet(i);
          t.asc_showWorksheet(activeNow);
          // Посылаем callback об изменении списка листов
          t.sheetsChanged();
        }
        t.wbModel.dependencyFormulas.unlockRecal();
        History.EndTransaction();
      }
    };

    this._getIsLockObjectSheet(lockInfo, deleteCallback);
    return true;
  };

  spreadsheet_api.prototype.asc_moveWorksheet = function(where) {
    var i = this.wbModel.getActive();
    var d = i < where ? +1 : -1;
    // Мы должны поместить слева от заданного значения, поэтому если идем вправо, то вычтем 1
    if (1 === d) {
      where -= 1;
    }
    History.Create_NewPoint();
    this.wb.replaceWorksheet(i, where);
    this.wbModel.replaceWorksheet(i, where);

    // Обновим текущий номер
    this.asc_showWorksheet(where);
    // Посылаем callback об изменении списка листов
    this.sheetsChanged();
  };

  spreadsheet_api.prototype.asc_copyWorksheet = function(where, newName) {
    var scale = this.asc_getZoom();
    var i = this.wbModel.getActive();

    // ToDo уйти от lock для листа при копировании
    var sheetId = this.wbModel.getWorksheet(i).getId();
    var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
    var t = this;
    var copyWorksheet = function(res) {
      if (res) {
        // ToDo перейти от wsViews на wsViewsId (сейчас вызываем раньше, чем в модели, т.к. там будет sortDependency
        // и cleanCellCache, который создаст уже скопированный лист(и splice сработает неправильно))
        History.Create_NewPoint();
        t.wb.copyWorksheet(i, where);
        t.wbModel.copyWorksheet(i, where, newName);
        // Делаем активным скопированный
        t.asc_showWorksheet(where);
        t.asc_setZoom(scale);
        // Посылаем callback об изменении списка листов
        t.sheetsChanged();
      }
    };

    this._getIsLockObjectSheet(lockInfo, copyWorksheet);
  };

  spreadsheet_api.prototype.asc_cleanSelection = function() {
    this.wb.getWorksheet().cleanSelection();
  };

  spreadsheet_api.prototype.asc_getZoom = function() {
    return this.wb.getZoom();
  };

  spreadsheet_api.prototype.asc_setZoom = function(scale) {
    this.wb.changeZoom(scale);
  };

  spreadsheet_api.prototype.asc_enableKeyEvents = function(isEnabled, isFromInput) {
    if (!this.isLoadFullApi) {
      this.tmpFocus = isEnabled;
      return;
    }

    if (this.wb) {
      this.wb.enableKeyEventsHandler(isEnabled);
    }

    if (isFromInput !== true && AscCommon.g_inputContext)
      AscCommon.g_inputContext.setInterfaceEnableKeyEvents(isEnabled);
  };

  spreadsheet_api.prototype.asc_IsFocus = function(bIsNaturalFocus) {
    var res = true;
	if(this.wb.cellEditor.isTopLineActive)
	{
		res = false;
	}
    else if (this.wb) 
	{
      res = this.wb.getEnableKeyEventsHandler(bIsNaturalFocus);
    }
	
    return res;
  };

  spreadsheet_api.prototype.asc_searchEnabled = function(bIsEnabled) {
  };

  spreadsheet_api.prototype.asc_findText = function(options) {
    if (window["NATIVE_EDITOR_ENJINE"]) {
      if (this.wb.findCellText(options)) {
        var ws = this.wb.getWorksheet();
        var activeCell = this.wbModel.getActiveWs().selectionRange.activeCell;
        return [ws.getCellLeftRelative(activeCell.col, 0), ws.getCellTopRelative(activeCell.row, 0)];
      }

      return null;
    }

    var d = this.wb.findCellText(options);
    if (d) {
      if (d.deltaX) {
        this.controller.scrollHorizontal(d.deltaX);
      }
      if (d.deltaY) {
        this.controller.scrollVertical(d.deltaY);
      }
    }
    return !!d;
  };

  spreadsheet_api.prototype.asc_replaceText = function(options) {
    options.lookIn = Asc.c_oAscFindLookIn.Formulas; // При замене поиск только в формулах
    this.wb.replaceCellText(options);
  };

  spreadsheet_api.prototype.asc_endFindText = function() {
    // Нужно очистить поиск
    this.wb._cleanFindResults();
  };

  /**
   * Делает активной указанную ячейку
   * @param {String} reference  Ссылка на ячейку вида A1 или R1C1
   */
  spreadsheet_api.prototype.asc_findCell = function (reference) {
    if (this.asc_getCellEditMode()) {
      return;
    }
    var ws = this.wb.getWorksheet();
    var d = ws.findCell(reference, this.isViewMode);
    if (0 === d.length) {
      return;
    }

    // Получаем sheet по имени
    ws = d[0].getWorksheet();
    if (!ws || ws.getHidden()) {
      return;
    }
    // Индекс листа
    var sheetIndex = ws.getIndex();
    // Если не совпали индекс листа и индекс текущего, то нужно сменить
    if (this.asc_getActiveWorksheetIndex() !== sheetIndex) {
      // Меняем активный лист
      this.asc_showWorksheet(sheetIndex);
      // Посылаем эвент о смене активного листа
      this.handlers.trigger("asc_onActiveSheetChanged", sheetIndex);
    }

    ws = this.wb.getWorksheet();
    d = ws.setSelection(d[0].getBBox0(), true);
    if (d.deltaX) {
      this.controller.scrollHorizontal(d.deltaX);
    }
    if (d.deltaY) {
      this.controller.scrollVertical(d.deltaY);
    }
  };

  spreadsheet_api.prototype.asc_closeCellEditor = function() {
    if(this.wb){
        this.wb.closeCellEditor();
    }
  };


  // Spreadsheet interface

  spreadsheet_api.prototype.asc_getColumnWidth = function() {
    var ws = this.wb.getWorksheet();
    return ws.getSelectedColumnWidthInSymbols();
  };

  spreadsheet_api.prototype.asc_setColumnWidth = function(width) {
    this.wb.getWorksheet().changeWorksheet("colWidth", width);
  };

  spreadsheet_api.prototype.asc_showColumns = function() {
    this.wb.getWorksheet().changeWorksheet("showCols");
  };

  spreadsheet_api.prototype.asc_hideColumns = function() {
    this.wb.getWorksheet().changeWorksheet("hideCols");
  };

  spreadsheet_api.prototype.asc_autoFitColumnWidth = function() {
    this.wb.getWorksheet().autoFitColumnWidth(null);
  };

  spreadsheet_api.prototype.asc_getRowHeight = function() {
    var ws = this.wb.getWorksheet();
    return ws.getSelectedRowHeight();
  };

  spreadsheet_api.prototype.asc_setRowHeight = function(height) {
    this.wb.getWorksheet().changeWorksheet("rowHeight", height);
  };
  spreadsheet_api.prototype.asc_autoFitRowHeight = function() {
    this.wb.getWorksheet().autoFitRowHeight(null);
  };

  spreadsheet_api.prototype.asc_showRows = function() {
    this.wb.getWorksheet().changeWorksheet("showRows");
  };

  spreadsheet_api.prototype.asc_hideRows = function() {
    this.wb.getWorksheet().changeWorksheet("hideRows");
  };

  spreadsheet_api.prototype.asc_insertCells = function(options) {
    this.wb.getWorksheet().changeWorksheet("insCell", options);
  };

  spreadsheet_api.prototype.asc_deleteCells = function(options) {
    this.wb.getWorksheet().changeWorksheet("delCell", options);
  };

  spreadsheet_api.prototype.asc_mergeCells = function(options) {
    this.wb.getWorksheet().setSelectionInfo("merge", options);
  };

  spreadsheet_api.prototype.asc_sortCells = function(options) {
    this.wb.getWorksheet().setSelectionInfo("sort", options);
  };

  spreadsheet_api.prototype.asc_emptyCells = function(options) {
    this.wb.emptyCells(options);
  };

  spreadsheet_api.prototype.asc_drawDepCells = function(se) {
    /* ToDo
     if( se != AscCommonExcel.c_oAscDrawDepOptions.Clear )
     this.wb.getWorksheet().prepareDepCells(se);
     else
     this.wb.getWorksheet().cleanDepCells();*/
  };

  // Потеряем ли мы что-то при merge ячеек
  spreadsheet_api.prototype.asc_mergeCellsDataLost = function(options) {
    return this.wb.getWorksheet().getSelectionMergeInfo(options);
  };
  
  //нужно ли спрашивать пользователя о расширении диапазона
  spreadsheet_api.prototype.asc_sortCellsRangeExpand = function() {
    return this.wb.getWorksheet().getSelectionSortInfo();
  };
  
  spreadsheet_api.prototype.asc_getSheetViewSettings = function() {
    return this.wb.getWorksheet().getSheetViewSettings();
  };

	spreadsheet_api.prototype.asc_setDisplayGridlines = function (value) {
		this.wb.getWorksheet()
			.changeWorksheet("sheetViewSettings", {type: AscCH.historyitem_Worksheet_SetDisplayGridlines, value: value});
	};

	spreadsheet_api.prototype.asc_setDisplayHeadings = function (value) {
		this.wb.getWorksheet()
			.changeWorksheet("sheetViewSettings", {type: AscCH.historyitem_Worksheet_SetDisplayHeadings, value: value});
	};

  // Images & Charts

  spreadsheet_api.prototype.asc_drawingObjectsExist = function() {
    for (var i = 0; i < this.wb.model.aWorksheets.length; i++) {
      if (this.wb.model.aWorksheets[i].Drawings && this.wb.model.aWorksheets[i].Drawings.length) {
        return true;
      }
    }
    return false;
  };

  spreadsheet_api.prototype.asc_getChartObject = function() {		// Return new or existing chart. For image return null
    this.asc_onOpenChartFrame();
    var ws = this.wb.getWorksheet();
    return ws.objectRender.getAscChartObject();
  };

  spreadsheet_api.prototype.asc_addChartDrawingObject = function(chart) {
    var ws = this.wb.getWorksheet();
    var ret = ws.objectRender.addChartDrawingObject(chart);
    this.asc_onCloseChartFrame();
    return ret;
  };

  spreadsheet_api.prototype.asc_editChartDrawingObject = function(chart) {
    var ws = this.wb.getWorksheet();
    var ret = ws.objectRender.editChartDrawingObject(chart);
    this.asc_onCloseChartFrame();
    return ret;
  };

  spreadsheet_api.prototype.asc_addImageDrawingObject = function (imageUrl) {
    var rData = {
      "id": this.documentId,
      "userid": this.documentUserId,
      "c": "imgurl",
      "saveindex": g_oDocumentUrls.getMaxIndex(),
      "data": imageUrl
    };

    var t = this;
    this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
    this.fCurCallback = function (input) {
      if (null != input && "imgurl" == input["type"]) {
        if ("ok" == input["status"]) {
          var data = input["data"];
          var urls = {};
          var firstUrl;
          for (var i = 0; i < data.length; ++i) {
            var elem = data[i];
            if (elem.url) {
              if (!firstUrl) {
                firstUrl = elem.url;
              }
              urls[elem.path] = elem.url;
            }
          }
          g_oDocumentUrls.addUrls(urls);
          if (firstUrl) {
            var ws = t.wb.getWorksheet();
            ws.objectRender.addImageDrawingObject(firstUrl, null);
          } else {
            t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
          }
        } else {
          t.handlers.trigger("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])),
              c_oAscError.Level.NoCritical);
        }
      } else {
        t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
      }
      t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
    };
    sendCommand(this, null, rData);
  };


  spreadsheet_api.prototype.asc_AddMath = function(Type)
  {
    var t = this, fonts = {};
    fonts["Cambria Math"] = 1;
    t._loadFonts(fonts, function() {t.asc_AddMath2(Type);});
  };

  spreadsheet_api.prototype.asc_AddMath2 = function(Type)
  {
    var ws = this.wb.getWorksheet();
    var ret = ws.objectRender.addMath(Type);
  };

  spreadsheet_api.prototype.asc_SetMathProps = function(MathProps)
  {
    var ws = this.wb.getWorksheet();
    var ret = ws.objectRender.setMathProps(MathProps);
  };

  spreadsheet_api.prototype.asc_showImageFileDialog = function() {
    // ToDo заменить на общую функцию для всех
    this.asc_addImage();
  };
  spreadsheet_api.prototype._addImageUrl = function(url) {
    var ws = this.wb.getWorksheet();
    if (ws) {
      if (this.isImageChangeUrl || this.isShapeImageChangeUrl || this.isTextArtChangeUrl) {
        ws.objectRender.editImageDrawingObject(url);
      } else {
        ws.objectRender.addImageDrawingObject(url, null);
      }
    }
  };
  spreadsheet_api.prototype.asc_setSelectedDrawingObjectLayer = function(layerType) {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.setGraphicObjectLayer(layerType);
  };
  spreadsheet_api.prototype.asc_addTextArt = function(nStyle) {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.addTextArt(nStyle);
  };

  spreadsheet_api.prototype.asc_checkDataRange = function(dialogType, dataRange, fullCheck, isRows, chartType) {
    return parserHelp.checkDataRange(this.wbModel, this.wb, dialogType, dataRange, fullCheck, isRows, chartType);
  };

  // Для вставки диаграмм в Word
  spreadsheet_api.prototype.asc_getBinaryFileWriter = function() {
    return new AscCommonExcel.BinaryFileWriter(this.wbModel);
  };

  spreadsheet_api.prototype.asc_getWordChartObject = function() {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.getWordChartObject();
  };

  spreadsheet_api.prototype.asc_cleanWorksheet = function() {
    var ws = this.wb.getWorksheet();	// Для удаления данных листа и диаграмм
    if (ws.objectRender) {
      ws.objectRender.cleanWorksheet();
    }
  };

  // Выставление данных (пока используется только для MailMerge)
  spreadsheet_api.prototype.asc_setData = function(oData) {
    this.wb.getWorksheet().setData(oData);
  };
  // Получение данных
  spreadsheet_api.prototype.asc_getData = function() {
    this.asc_closeCellEditor();
    return this.wb.getWorksheet().getData();
  };

  // Cell comment interface
  spreadsheet_api.prototype.asc_addComment = function(oComment) {
  };

  spreadsheet_api.prototype.asc_changeComment = function(id, oComment) {
    if (oComment.bDocument) {
      this.wb.cellCommentator.changeComment(id, oComment);
    } else {
      var ws = this.wb.getWorksheet();
      ws.cellCommentator.changeComment(id, oComment);
    }
  };

  spreadsheet_api.prototype.asc_selectComment = function(id) {
    var ws = this.wb.getWorksheet();
    ws.cellCommentator.selectComment(id, /*bMove*/true);
  };

  spreadsheet_api.prototype.asc_showComment = function(id, bNew) {
    var ws = this.wb.getWorksheet();
    ws.cellCommentator.showComment(id, bNew);
  };

  spreadsheet_api.prototype.asc_findComment = function(id) {
    var ws = this.wb.getWorksheet();
    return ws.cellCommentator.findComment(id);
  };

  spreadsheet_api.prototype.asc_removeComment = function(id) {
    var ws = this.wb.getWorksheet();
    ws.cellCommentator.removeComment(id);
    this.wb.cellCommentator.removeComment(id);
  };

  spreadsheet_api.prototype.asc_getComments = function(col, row) {
    var ws = this.wb.getWorksheet();
    return ws.cellCommentator.getComments(col, row);
  };

  spreadsheet_api.prototype.asc_getDocumentComments = function() {
    return this.wb.cellCommentator.getDocumentComments();
  };

  spreadsheet_api.prototype.asc_showComments = function () {
    this.wb.showComments(true);
  };
  spreadsheet_api.prototype.asc_hideComments = function () {
    this.wb.showComments(false);
  };

  // Shapes
  spreadsheet_api.prototype.setStartPointHistory = function() {
    this.noCreatePoint = true;
    this.exucuteHistory = true;
    this.asc_stopSaving();
  };

  spreadsheet_api.prototype.setEndPointHistory = function() {
    this.noCreatePoint = false;
    this.exucuteHistoryEnd = true;
    this.asc_continueSaving();
  };

  spreadsheet_api.prototype.asc_startAddShape = function(sPreset) {
    this.isStartAddShape = this.controller.isShapeAction = true;
    var ws = this.wb.getWorksheet();
    ws.objectRender.controller.startTrackNewShape(sPreset);
  };

  spreadsheet_api.prototype.asc_endAddShape = function() {
    this.isStartAddShape = false;
    this.handlers.trigger("asc_onEndAddShape");
  };


    spreadsheet_api.prototype.asc_addShapeOnSheet = function(sPreset) {
        if(this.wb){
          var ws = this.wb.getWorksheet();
          if(ws && ws.objectRender){
            ws.objectRender.addShapeOnSheet(sPreset);
          }
        }
    };

  spreadsheet_api.prototype.asc_addOleObjectAction = function(sLocalUrl, sData, sApplicationId, fWidth, fHeight, nWidthPix, nHeightPix)
  {
    var _image = this.ImageLoader.LoadImage(AscCommon.getFullImageSrc2(sLocalUrl), 1);
    if (null != _image){
        var ws = this.wb.getWorksheet();
      if(ws.objectRender){
        ws.objectRender.addOleObject(fWidth, fHeight, nWidthPix, nHeightPix, sLocalUrl, sData, sApplicationId);
      }
    }
  };

  spreadsheet_api.prototype.asc_editOleObjectAction = function(bResize, oOleObject, sImageUrl, sData, nPixWidth, nPixHeight)
  {
    if (oOleObject)
    {
      var ws = this.wb.getWorksheet();
      if(ws.objectRender){
        ws.objectRender.editOleObject(oOleObject, sData, sImageUrl, nPixWidth, nPixHeight, bResize);
      }
    }
  };


    spreadsheet_api.prototype.asc_startEditCurrentOleObject = function(){
        var ws = this.wb.getWorksheet();
        if(ws && ws.objectRender){
            ws.objectRender.startEditCurrentOleObject();
        }
    };

  spreadsheet_api.prototype.asc_isAddAutoshape = function() {
    return this.isStartAddShape;
  };

  spreadsheet_api.prototype.asc_canAddShapeHyperlink = function() {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.controller.canAddHyperlink();
  };

  spreadsheet_api.prototype.asc_canGroupGraphicsObjects = function() {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.controller.canGroup();
  };

  spreadsheet_api.prototype.asc_groupGraphicsObjects = function() {
    var ws = this.wb.getWorksheet();
    ws.objectRender.groupGraphicObjects();
  };

  spreadsheet_api.prototype.asc_canUnGroupGraphicsObjects = function() {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.controller.canUnGroup();
  };

  spreadsheet_api.prototype.asc_unGroupGraphicsObjects = function() {
    var ws = this.wb.getWorksheet();
    ws.objectRender.unGroupGraphicObjects();
  };

  spreadsheet_api.prototype.asc_changeShapeType = function(value) {
    this.asc_setGraphicObjectProps(new Asc.asc_CImgProperty({ShapeProperties: {type: value}}));
  };

  spreadsheet_api.prototype.asc_getGraphicObjectProps = function() {
    var ws = this.wb.getWorksheet();
    if (ws && ws.objectRender && ws.objectRender.controller) {
      return ws.objectRender.controller.getGraphicObjectProps();
    }
    return null;
  };

  spreadsheet_api.prototype.asc_setGraphicObjectProps = function(props) {

    var ws = this.wb.getWorksheet();
    var fReplaceCallback = null, sImageUrl = null;
    if(!AscCommon.isNullOrEmptyString(props.ImageUrl)){
      if(!g_oDocumentUrls.getImageLocal(props.ImageUrl)){
        sImageUrl = props.ImageUrl;
        fReplaceCallback = function(sLocalUrl){
          props.ImageUrl = sLocalUrl;
        }
      }
    }
    else if(props.ShapeProperties && props.ShapeProperties.fill && props.ShapeProperties.fill.fill &&
    !AscCommon.isNullOrEmptyString(props.ShapeProperties.fill.fill.url)){
      if(!g_oDocumentUrls.getImageLocal(props.ShapeProperties.fill.fill.url)){
        sImageUrl = props.ShapeProperties.fill.fill.url;
        fReplaceCallback = function(sLocalUrl){
          props.ShapeProperties.fill.fill.url = sLocalUrl;
        }
      }
    }
    if(fReplaceCallback){

      if (window["AscDesktopEditor"])
      {
        var firstUrl = window["AscDesktopEditor"]["LocalFileGetImageUrl"](sImageUrl);
		firstUrl = g_oDocumentUrls.getImageUrl(firstUrl);
        fReplaceCallback(firstUrl);
        ws.objectRender.setGraphicObjectProps(props);
        return;
      }

      var rData = {
        "id": this.documentId,
        "userid": this.documentUserId,
        "c": "imgurl",
        "saveindex": g_oDocumentUrls.getMaxIndex(),
        "data": sImageUrl};

      var t = this;
      this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
      this.fCurCallback = function(input) {
        if (null != input && "imgurl" == input["type"]) {
          if ("ok" == input["status"]) {
            var data = input["data"];
            var urls = {};
            var firstUrl;
            for (var i = 0; i < data.length; ++i) {
              var elem = data[i];
              if (elem.url) {
                if (!firstUrl) {
                  firstUrl = elem.url;
                }
                urls[elem.path] = elem.url;
              }
            }
            g_oDocumentUrls.addUrls(urls);
            if (firstUrl) {
              fReplaceCallback(firstUrl);
              ws.objectRender.setGraphicObjectProps(props);
            } else {
              t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
            }
          } else {
            t.handlers.trigger("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
          }
        } else {
          t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
        }
        t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
      };
      sendCommand(this, null, rData);
    }
    else{
      ws.objectRender.setGraphicObjectProps(props);
    }
  };

  spreadsheet_api.prototype.asc_getOriginalImageSize = function() {
    var ws = this.wb.getWorksheet();
    return ws.objectRender.getOriginalImageSize();
  };

  spreadsheet_api.prototype.asc_setInterfaceDrawImagePlaceTextArt = function(elementId) {
    this.textArtElementId = elementId;
  };

  spreadsheet_api.prototype.asc_changeImageFromFile = function() {
    this.isImageChangeUrl = true;
    this.asc_addImage();
  };

  spreadsheet_api.prototype.asc_changeShapeImageFromFile = function() {
    this.isShapeImageChangeUrl = true;
    this.asc_addImage();
  };

  spreadsheet_api.prototype.asc_changeArtImageFromFile = function() {
    this.isTextArtChangeUrl = true;
    this.asc_addImage();
  };

  spreadsheet_api.prototype.asc_putPrLineSpacing = function(type, value) {
    var ws = this.wb.getWorksheet();
    ws.objectRender.controller.putPrLineSpacing(type, value);
  };

  spreadsheet_api.prototype.asc_putLineSpacingBeforeAfter = function(type, value) { // "type == 0" means "Before", "type == 1" means "After"
    var ws = this.wb.getWorksheet();
    ws.objectRender.controller.putLineSpacingBeforeAfter(type, value);
  };

  spreadsheet_api.prototype.asc_setDrawImagePlaceParagraph = function(element_id, props) {
    var ws = this.wb.getWorksheet();
    ws.objectRender.setDrawImagePlaceParagraph(element_id, props);
  };

    spreadsheet_api.prototype.asc_replaceLoadImageCallback = function(fCallback){
        if(this.wb){
            var ws = this.wb.getWorksheet();
            if(ws.objectRender){
                ws.objectRender.asyncImageEndLoaded = fCallback;
            }
        }
    };

  spreadsheet_api.prototype.asyncImageEndLoaded = function(_image) {
    if (this.wb) {
      var ws = this.wb.getWorksheet();
      if (ws.objectRender.asyncImageEndLoaded) {
        ws.objectRender.asyncImageEndLoaded(_image);
      }
    }
  };

  spreadsheet_api.prototype.asyncImagesDocumentEndLoaded = function() {
    if (c_oAscAdvancedOptionsAction.None === this.advancedOptionsAction && this.wb && !window["NATIVE_EDITOR_ENJINE"]) {
      var ws = this.wb.getWorksheet();
      ws.objectRender.showDrawingObjects(true);
      ws.objectRender.controller.getGraphicObjectProps();
    }
  };

  spreadsheet_api.prototype.asyncImageEndLoadedBackground = function() {
    var worksheet = this.wb.getWorksheet();
    if (worksheet && worksheet.objectRender) {
      var drawing_area = worksheet.objectRender.drawingArea;
      if (drawing_area) {
        for (var i = 0; i < drawing_area.frozenPlaces.length; ++i) {
          worksheet.objectRender.showDrawingObjects(false, new AscFormat.GraphicOption(worksheet, AscCommonExcel.c_oAscGraphicOption.ScrollVertical, drawing_area.frozenPlaces[i].range, {offsetX: 0, offsetY: 0}));
            worksheet.objectRender.controller && worksheet.objectRender.controller.getGraphicObjectProps();
        }
      }
    }
  };

  // Frozen pane
  spreadsheet_api.prototype.asc_freezePane = function () {
    this.wb.getWorksheet().freezePane();
  };

	spreadsheet_api.prototype.asc_setSparklineGroup = function (id, oSparklineGroup) {
		var t = this;
		var changeSparkline = function (res) {
			if (res) {
				var changedSparkline = AscCommon.g_oTableId.Get_ById(id);
				if (changedSparkline) {
					History.Create_NewPoint();
					History.StartTransaction();
					changedSparkline.set(oSparklineGroup);
					History.EndTransaction();
					t.wb._onWSSelectionChanged();
					t.wb.getWorksheet().draw();
				}
			}
		};
		this._isLockedSparkline(id, changeSparkline);
	};

  // Cell interface
  spreadsheet_api.prototype.asc_getCellInfo = function() {
    return this.wb.getSelectionInfo();
  };

  // Получить координаты активной ячейки
  spreadsheet_api.prototype.asc_getActiveCellCoord = function() {
    return this.wb.getWorksheet().getActiveCellCoord();
  };

  // Получить координаты для каких-либо действий (для общей схемы)
  spreadsheet_api.prototype.asc_getAnchorPosition = function() {
    return this.asc_getActiveCellCoord();
  };

  // Получаем свойство: редактируем мы сейчас или нет
  spreadsheet_api.prototype.asc_getCellEditMode = function() {
    return this.wb ? this.wb.getCellEditMode() : false;
  };

  spreadsheet_api.prototype.asc_getIsTrackShape = function()  {
    return this.wb ? this.wb.getIsTrackShape() : false;
  };

  spreadsheet_api.prototype.asc_setCellFontName = function(fontName) {
    var t = this, fonts = {};
    fonts[fontName] = 1;
    t._loadFonts(fonts, function() {
      var ws = t.wb.getWorksheet();
      if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontName) {
        ws.objectRender.controller.setCellFontName(fontName);
      } else {
        t.wb.setFontAttributes("fn", fontName);
        t.wb.restoreFocus();
      }
    });
  };

  spreadsheet_api.prototype.asc_setCellFontSize = function(fontSize) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontSize) {
      ws.objectRender.controller.setCellFontSize(fontSize);
    } else {
      this.wb.setFontAttributes("fs", fontSize);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellBold = function(isBold) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBold) {
      ws.objectRender.controller.setCellBold(isBold);
    } else {
      this.wb.setFontAttributes("b", isBold);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellItalic = function(isItalic) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellItalic) {
      ws.objectRender.controller.setCellItalic(isItalic);
    } else {
      this.wb.setFontAttributes("i", isItalic);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellUnderline = function(isUnderline) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellUnderline) {
      ws.objectRender.controller.setCellUnderline(isUnderline);
    } else {
      this.wb.setFontAttributes("u", isUnderline ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellStrikeout = function(isStrikeout) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellStrikeout) {
      ws.objectRender.controller.setCellStrikeout(isStrikeout);
    } else {
      this.wb.setFontAttributes("s", isStrikeout);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellSubscript = function(isSubscript) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSubscript) {
      ws.objectRender.controller.setCellSubscript(isSubscript);
    } else {
      this.wb.setFontAttributes("fa", isSubscript ? AscCommon.vertalign_SubScript : null);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellSuperscript = function(isSuperscript) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSuperscript) {
      ws.objectRender.controller.setCellSuperscript(isSuperscript);
    } else {
      this.wb.setFontAttributes("fa", isSuperscript ? AscCommon.vertalign_SuperScript : null);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellAlign = function(align) {
    var ha = AscCommonExcel.horizontalAlignFromString(align);
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAlign) {
      ws.objectRender.controller.setCellAlign(ha);
    } else {
      this.wb.getWorksheet().setSelectionInfo("a", ha);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellVertAlign = function(align) {
    var va = AscCommonExcel.verticalAlignFromString(align);
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellVertAlign) {
      ws.objectRender.controller.setCellVertAlign(va);
    } else {
      this.wb.getWorksheet().setSelectionInfo("va", va);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellTextWrap = function(isWrapped) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextWrap) {
      ws.objectRender.controller.setCellTextWrap(isWrapped);
    } else {
      this.wb.getWorksheet().setSelectionInfo("wrap", isWrapped);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellTextShrink = function(isShrinked) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextShrink) {
      ws.objectRender.controller.setCellTextShrink(isShrinked);
    } else {
      this.wb.getWorksheet().setSelectionInfo("shrink", isShrinked);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellTextColor = function(color) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextColor) {
      ws.objectRender.controller.setCellTextColor(color);
    } else {
      if (color instanceof Asc.asc_CColor) {
        color = AscCommonExcel.CorrectAscColor(color);
        this.wb.setFontAttributes("c", color);
        this.wb.restoreFocus();
      }
    }

  };

  spreadsheet_api.prototype.asc_setCellBackgroundColor = function(color) {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBackgroundColor) {
      ws.objectRender.controller.setCellBackgroundColor(color);
    } else {
      if (color instanceof Asc.asc_CColor || null == color) {
        if (null != color) {
          color = AscCommonExcel.CorrectAscColor(color);
        }
        this.wb.getWorksheet().setSelectionInfo("bc", color);
        this.wb.restoreFocus();
      }
    }
  };

  spreadsheet_api.prototype.asc_setCellBorders = function(borders) {
    this.wb.getWorksheet().setSelectionInfo("border", borders);
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_setCellFormat = function(format) {
    this.wb.setCellFormat(format);
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_setCellAngle = function(angle) {

    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAngle) {
      ws.objectRender.controller.setCellAngle(angle);
    } else {
      this.wb.getWorksheet().setSelectionInfo("angle", angle);
      this.wb.restoreFocus();
    }
  };

  spreadsheet_api.prototype.asc_setCellStyle = function(name) {
    this.wb.getWorksheet().setSelectionInfo("style", name);
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_increaseCellDigitNumbers = function() {
    this.wb.getWorksheet().setSelectionInfo("changeDigNum", +1);
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_decreaseCellDigitNumbers = function() {
    this.wb.getWorksheet().setSelectionInfo("changeDigNum", -1);
    this.wb.restoreFocus();
  };

  // Увеличение размера шрифта
  spreadsheet_api.prototype.asc_increaseFontSize = function() {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.increaseFontSize) {
      ws.objectRender.controller.increaseFontSize();
    } else {
      this.wb.changeFontSize("changeFontSize", true);
      this.wb.restoreFocus();
    }
  };

  // Уменьшение размера шрифта
  spreadsheet_api.prototype.asc_decreaseFontSize = function() {
    var ws = this.wb.getWorksheet();
    if (ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.decreaseFontSize) {
      ws.objectRender.controller.decreaseFontSize();
    } else {
      this.wb.changeFontSize("changeFontSize", false);
      this.wb.restoreFocus();
    }
  };

  // Формат по образцу
  spreadsheet_api.prototype.asc_formatPainter = function(stateFormatPainter) {
    if (this.wb) {
      this.wb.formatPainter(stateFormatPainter);
    }
  };

  spreadsheet_api.prototype.asc_showAutoComplete = function() {
    this.wb.showAutoComplete();
  };

  spreadsheet_api.prototype.asc_onMouseUp = function(event, x, y) {
    this.controller._onWindowMouseUpExternal(event, x, y);
  };

  //

  spreadsheet_api.prototype.asc_selectFunction = function() {

  };

  spreadsheet_api.prototype.asc_insertHyperlink = function(options) {
    this.wb.insertHyperlink(options);
  };

  spreadsheet_api.prototype.asc_removeHyperlink = function() {
    this.wb.removeHyperlink();
  };

  spreadsheet_api.prototype.asc_insertFormula = function(functionName, type, autoComplete) {
    this.wb.insertFormulaInEditor(functionName, type, autoComplete);
    this.wb.restoreFocus();
  };

  spreadsheet_api.prototype.asc_getFormulasInfo = function() {
    return this.formulasList;
  };
  spreadsheet_api.prototype.asc_getFormulaLocaleName = function(name) {
    return AscCommonExcel.cFormulaFunctionToLocale ? AscCommonExcel.cFormulaFunctionToLocale[name] : name;
  };

  spreadsheet_api.prototype.asc_recalc = function(isRecalcWB) {
    this.wbModel.recalcWB(isRecalcWB);
  };

  spreadsheet_api.prototype.asc_setFontRenderingMode = function(mode) {
    if (mode !== this.fontRenderingMode) {
      this.fontRenderingMode = mode;
      if (this.wb) {
        this.wb.setFontRenderingMode(mode, /*isInit*/false);
      }
    }
  };

  /**
   * Режим выбора диапазона
   * @param {Asc.c_oAscSelectionDialogType} selectionDialogType
   * @param selectRange
   */
  spreadsheet_api.prototype.asc_setSelectionDialogMode = function(selectionDialogType, selectRange) {
    this.controller.setSelectionDialogMode(Asc.c_oAscSelectionDialogType.None !== selectionDialogType);
    if (this.wb) {
      this.wb._onStopFormatPainter();
      this.wb.setSelectionDialogMode(selectionDialogType, selectRange);
    }
  };

  spreadsheet_api.prototype.asc_SendThemeColors = function(colors, standart_colors) {
    this._gui_control_colors = { Colors: colors, StandartColors: standart_colors };
    var ret = this.handlers.trigger("asc_onSendThemeColors", colors, standart_colors);
    if (false !== ret) {
      this._gui_control_colors = null;
    }
  };

	spreadsheet_api.prototype.asc_ChangeColorScheme = function (index) {
		var t = this;
		var onChangeColorScheme = function (res) {
			if (res) {
				if (t.wbModel.changeColorScheme(index)) {
					t.asc_AfterChangeColorScheme();
				}
			}
		};
		// ToDo поправить заглушку, сделать новый тип lock element-а
		var sheetId = -1; // Делаем не существующий лист и не существующий объект
		var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId,
			sheetId);
		this._getIsLockObjectSheet(lockInfo, onChangeColorScheme);
	};
  spreadsheet_api.prototype.asc_AfterChangeColorScheme = function() {
    this.asc_CheckGuiControlColors();
    this.asc_ApplyColorScheme(true);
  };
  spreadsheet_api.prototype.asc_ApplyColorScheme = function(bRedraw) {

    if (window['IS_NATIVE_EDITOR'] || !window["NATIVE_EDITOR_ENJINE"]) {
      var wsViews = Asc["editor"].wb.wsViews;
      for (var i = 0; i < wsViews.length; ++i) {
        if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
          wsViews[i].objectRender.controller.startRecalculate();
        }
      }
      this.chartPreviewManager.clearPreviews();
      this.textArtPreviewManager.clear();
    }

    // На view-режиме не нужно отправлять стили
    if (true !== this.getViewMode()) {
      // Отправка стилей
      this._sendWorkbookStyles();
    }

    if (bRedraw) {
      this.handlers.trigger("asc_onUpdateChartStyles");
      this.handlers.trigger("asc_onSelectionChanged", this.asc_getCellInfo());
      this.wb.drawWS();
    }
  };

  /////////////////////////////////////////////////////////////////////////
  ////////////////////////////AutoSave api/////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  spreadsheet_api.prototype._autoSave = function() {
    if ((0 === this.autoSaveGap && (!this.collaborativeEditing.getFast() || !this.collaborativeEditing.getCollaborativeEditing()))
      || this.asc_getCellEditMode() || this.asc_getIsTrackShape() || this.isOpenedChartFrame ||
      !History.IsEndTransaction() || !this.canSave) {
      return;
    }
    if (!History.Have_Changes(true) && !(this.collaborativeEditing.getCollaborativeEditing() && 0 !== this.collaborativeEditing.getOwnLocksLength())) {
      if (this.collaborativeEditing.getFast() && this.collaborativeEditing.haveOtherChanges()) {
        AscCommon.CollaborativeEditing.Clear_CollaborativeMarks();

        // Принимаем чужие изменения
        this.collaborativeEditing.applyChanges();
        // Пересылаем свои изменения (просто стираем чужие lock-и, т.к. своих изменений нет)
        this.collaborativeEditing.sendChanges();
        // Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно заблокировать toolbar
        this.wb._onWSSelectionChanged();
      }
      return;
    }
    if (null === this.lastSaveTime) {
      this.lastSaveTime = new Date();
      return;
    }
    var saveGap = this.collaborativeEditing.getFast() ? this.autoSaveGapRealTime :
      (this.collaborativeEditing.getCollaborativeEditing() ? this.autoSaveGapSlow : this.autoSaveGapFast);
    var gap = new Date() - this.lastSaveTime - saveGap;
    if (0 <= gap) {
      this.asc_Save(true);
    }
  };

  spreadsheet_api.prototype._onUpdateDocumentCanSave = function() {
    // Можно модифицировать это условие на более быстрое (менять самим состояние в аргументах, а не запрашивать каждый раз)
    var tmp = History.Have_Changes() || (this.collaborativeEditing.getCollaborativeEditing() && 0 !== this.collaborativeEditing.getOwnLocksLength());
    if (tmp !== this.isDocumentCanSave) {
      this.isDocumentCanSave = tmp;
      this.handlers.trigger('asc_onDocumentCanSaveChanged', this.isDocumentCanSave);
    }
  };

  spreadsheet_api.prototype._onCheckCommentRemoveLock = function(lockElem) {
    var res = false;
    var sheetId = lockElem["sheetId"];
    if (-1 !== sheetId && 0 === sheetId.indexOf(AscCommonExcel.CCellCommentator.sStartCommentId)) {
      // Коммментарий
      res = true;
      this.handlers.trigger("asc_onUnLockComment", lockElem["rangeOrObjectId"]);
    }
    return res;
  };

  spreadsheet_api.prototype.onUpdateDocumentModified = function(bIsModified) {
    // Обновляем только после окончания сохранения
    if (this.canSave) {
      this.handlers.trigger("asc_onDocumentModifiedChanged", bIsModified);
      this._onUpdateDocumentCanSave();

      if (undefined !== window["AscDesktopEditor"]) {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](bIsModified);
      }
    }
  };

	// Выставление локали
	spreadsheet_api.prototype.asc_setLocalization = function (oLocalizedData) {
		if (!this.isLoadFullApi) {
			this.tmpLocalization = oLocalizedData;
			return;
		}

		if (null == oLocalizedData) {
			AscCommonExcel.cFormulaFunctionLocalized = null;
			AscCommonExcel.cFormulaFunctionToLocale = null;
		} else {
			AscCommonExcel.cFormulaFunctionLocalized = {};
			AscCommonExcel.cFormulaFunctionToLocale = {};
			var localName;
			for (var i in AscCommonExcel.cFormulaFunction) {
				localName = oLocalizedData[i] ? oLocalizedData[i] : null;
				localName = localName ? localName : i;
				AscCommonExcel.cFormulaFunctionLocalized[localName] = AscCommonExcel.cFormulaFunction[i];
				AscCommonExcel.cFormulaFunctionToLocale[i] = localName;
			}
		}
		AscCommon.build_local_rx(oLocalizedData ? oLocalizedData["LocalFormulaOperands"] : null);
		if (this.wb) {
			this.wb.initFormulasList();
		}
		if (this.wbModel) {
			this.wbModel.rebuildColors();
		}
	};

  spreadsheet_api.prototype.asc_nativeOpenFile = function(base64File, version, isUser) {
    asc["editor"] = this;

    this.SpellCheckUrl = '';
 
    if (undefined == isUser) {
        this.User = new AscCommon.asc_CUser();
        this.User.setId("TM");
        this.User.setUserName("native");
    }

    this.wbModel = new AscCommonExcel.Workbook(this.handlers, this);
    this.initGlobalObjects(this.wbModel);

    var oBinaryFileReader = new AscCommonExcel.BinaryFileReader();

    if (undefined === version) {
      oBinaryFileReader.Read(base64File, this.wbModel);
    } else {
      AscCommon.CurFileVersion = version;
      oBinaryFileReader.ReadData(base64File, this.wbModel);
    }
    g_oIdCounter.Set_Load(false);

    this._coAuthoringInit();
    this.wb = new AscCommonExcel.WorkbookView(this.wbModel, this.controller, this.handlers, window["_null_object"], window["_null_object"], this, this.collaborativeEditing, this.fontRenderingMode);
  };

  spreadsheet_api.prototype.asc_nativeCalculateFile = function() {
    window['DoctRendererMode'] = true;	
    this.wb._nativeCalculate();
  };

  spreadsheet_api.prototype.asc_nativeApplyChanges = function(changes) {
    for (var i = 0, l = changes.length; i < l; ++i) {
      this.CoAuthoringApi.onSaveChanges(changes[i], null, true);
    }
    this.collaborativeEditing.applyChanges();
  };

  spreadsheet_api.prototype.asc_nativeApplyChanges2 = function(data, isFull) {
    if (null != this.wbModel) {
      this.oRedoObjectParamNative = this.wbModel.DeserializeHistoryNative(this.oRedoObjectParamNative, data, isFull);
    }
    if (isFull) {
      this._onUpdateAfterApplyChanges();
    }
  };

  spreadsheet_api.prototype.asc_nativeGetFile = function() {
    var oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.wbModel);
    return oBinaryFileWriter.Write();
  };
  spreadsheet_api.prototype.asc_nativeGetFileData = function() {
    var oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(this.wbModel);
    oBinaryFileWriter.Write2();

    var _header = oBinaryFileWriter.WriteFileHeader(oBinaryFileWriter.Memory.GetCurPosition());
    window["native"]["Save_End"](_header, oBinaryFileWriter.Memory.GetCurPosition());

    return oBinaryFileWriter.Memory.ImData.data;
  };

  spreadsheet_api.prototype.asc_nativeCheckPdfRenderer = function(_memory1, _memory2) {
    if (true) {
      // pos не должен минимизироваться!!!

      _memory1.Copy = _memory1["Copy"];
      _memory1.ClearNoAttack = _memory1["ClearNoAttack"];
      _memory1.WriteByte = _memory1["WriteByte"];
      _memory1.WriteBool = _memory1["WriteBool"];
      _memory1.WriteLong = _memory1["WriteLong"];
      _memory1.WriteDouble = _memory1["WriteDouble"];
      _memory1.WriteString = _memory1["WriteString"];
      _memory1.WriteString2 = _memory1["WriteString2"];

      _memory2.Copy = _memory1["Copy"];
      _memory2.ClearNoAttack = _memory1["ClearNoAttack"];
      _memory2.WriteByte = _memory1["WriteByte"];
      _memory2.WriteBool = _memory1["WriteBool"];
      _memory2.WriteLong = _memory1["WriteLong"];
      _memory2.WriteDouble = _memory1["WriteDouble"];
      _memory2.WriteString = _memory1["WriteString"];
      _memory2.WriteString2 = _memory1["WriteString2"];
    }

    var _printer = new AscCommonExcel.CPdfPrinter();
    _printer.DocumentRenderer.Memory = _memory1;
    _printer.DocumentRenderer.VectorMemoryForPrint = _memory2;
    return _printer;
  };

  spreadsheet_api.prototype.asc_nativeCalculate = function() {
  };

  spreadsheet_api.prototype.asc_nativePrint = function (_printer, _page, _param) {
    var _adjustPrint = window.AscDesktopEditor_PrintData || new Asc.asc_CAdjustPrint();
    window.AscDesktopEditor_PrintData = undefined;

    var isOnePage = ((_param & 0x0100) == 0x0100);
    _param &= 0xFF;
    if (1 == _param) {
      _adjustPrint.asc_setPrintType(Asc.c_oAscPrintType.EntireWorkbook);
      var pageSetup;
      var countWorksheets = this.wbModel.getWorksheetCount();
      for (var j = 0; j < countWorksheets; ++j) {
        pageSetup = this.wbModel.getWorksheet(j).PagePrintOptions.asc_getPageSetup();
        pageSetup.asc_setFitToWidth(true);
        pageSetup.asc_setFitToHeight(true);
      }
    }

    var _printPagesData = this.wb.calcPagesPrint(_adjustPrint);

    if (undefined === _printer && _page === undefined) {
      var pdf_writer = new AscCommonExcel.CPdfPrinter();
      this.wb.printSheets(pdf_writer, _printPagesData);

      if (undefined !== window["AscDesktopEditor"]) {
        var pagescount = pdf_writer.DocumentRenderer.m_lPagesCount;

        window["AscDesktopEditor"]["Print_Start"](this.documentId + "/", pagescount, "", -1);

        for (var i = 0; i < pagescount; i++) {
          var _start = pdf_writer.DocumentRenderer.m_arrayPages[i].StartOffset;
          var _end = pdf_writer.DocumentRenderer.Memory.pos;
          if (i != (pagescount - 1)) {
            _end = pdf_writer.DocumentRenderer.m_arrayPages[i + 1].StartOffset;
          }

          window["AscDesktopEditor"]["Print_Page"](
            pdf_writer.DocumentRenderer.Memory.GetBase64Memory2(_start, _end - _start),
            pdf_writer.DocumentRenderer.m_arrayPages[i].Width, pdf_writer.DocumentRenderer.m_arrayPages[i].Height);
        }

        window["AscDesktopEditor"]["Print_End"]();
      }
      return pdf_writer.DocumentRenderer.Memory;
    }

    this.wb.printSheets(_printer, _printPagesData);
    return _printer.DocumentRenderer.Memory;
  };

  spreadsheet_api.prototype.asc_nativePrintPagesCount = function() {
    return 1;
  };

  spreadsheet_api.prototype.asc_nativeGetPDF = function(_param) {
    var _ret = this.asc_nativePrint(undefined, undefined, _param);

    window["native"]["Save_End"]("", _ret.GetCurPosition());
    return _ret.data;
  };

  spreadsheet_api.prototype.asc_canPaste = function () {
    History.Create_NewPoint();
    History.StartTransaction();
    return true;
  };
  spreadsheet_api.prototype.asc_endPaste = function () {
    History.EndTransaction();
  };
  spreadsheet_api.prototype.asc_Recalculate = function () {
      History.EndTransaction();
      this._onUpdateAfterApplyChanges();
  };


  spreadsheet_api.prototype.pre_Paste = function(_fonts, _images, callback)
  {
    var oFontMap = {};
    for(var i = 0; i < _fonts.length; ++i){
      oFontMap[_fonts[i].name] = 1;
    }
    this._loadFonts(oFontMap, function() {

      var aImages = [];
      for(var key in _images){
        if(_images.hasOwnProperty(key)){
          aImages.push(_images[key])
        }
      }
      if(aImages.length > 0)      {
         window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImages, null);
      }
      callback();
    });
  };

	spreadsheet_api.prototype._onEndLoadSdk = function () {
		History = AscCommon.History;

		if (this.isMobileVersion) {
			this.asc_setMobileVersion(true);
		}

		spreadsheet_api.superclass._onEndLoadSdk.call(this);

		this.controller = new AscCommonExcel.asc_CEventsController();

		this.formulasList = AscCommonExcel.getFormulasInfo();
		this.asc_setLocale(this.tmpLocale);
		this.asc_setLocalization(this.tmpLocalization);
		this.asc_setViewMode(this.isViewMode);
	};

  /*
   * Export
   * -----------------------------------------------------------------------------
   */

  window["AscDesktopEditor_Save"] = function() {
    return window["Asc"]["editor"].asc_Save(false);
  };

  asc["spreadsheet_api"] = spreadsheet_api;
  prot = spreadsheet_api.prototype;

  prot["asc_GetFontThumbnailsPath"] = prot.asc_GetFontThumbnailsPath;
  prot["asc_setDocInfo"] = prot.asc_setDocInfo;
	prot['asc_getCurrencySymbols'] = prot.asc_getCurrencySymbols;
	prot['asc_getLocaleExample'] = prot.asc_getLocaleExample;
	prot['asc_getFormatCells'] = prot.asc_getFormatCells;
  prot["asc_getLocaleCurrency"] = prot.asc_getLocaleCurrency;
  prot["asc_setLocale"] = prot.asc_setLocale;
  prot["asc_getEditorPermissions"] = prot.asc_getEditorPermissions;
  prot["asc_LoadDocument"] = prot.asc_LoadDocument;
  prot["asc_LoadEmptyDocument"] = prot.asc_LoadEmptyDocument;
  prot["asc_DownloadAs"] = prot.asc_DownloadAs;
  prot["asc_Save"] = prot.asc_Save;
  prot["asc_Print"] = prot.asc_Print;
  prot["asc_Resize"] = prot.asc_Resize;
  prot["asc_Copy"] = prot.asc_Copy;
  prot["asc_Paste"] = prot.asc_Paste;
  prot["asc_Cut"] = prot.asc_Cut;
  prot["asc_Undo"] = prot.asc_Undo;
  prot["asc_Redo"] = prot.asc_Redo;

  prot["asc_getDocumentName"] = prot.asc_getDocumentName;
  prot["asc_isDocumentModified"] = prot.asc_isDocumentModified;
  prot["asc_isDocumentCanSave"] = prot.asc_isDocumentCanSave;
  prot["asc_getCanUndo"] = prot.asc_getCanUndo;
  prot["asc_getCanRedo"] = prot.asc_getCanRedo;

  prot["asc_setAutoSaveGap"] = prot.asc_setAutoSaveGap;

  prot["asc_setMobileVersion"] = prot.asc_setMobileVersion;
  prot["asc_setViewMode"] = prot.asc_setViewMode;
  prot["asc_setUseEmbeddedCutFonts"] = prot.asc_setUseEmbeddedCutFonts;
  prot["asc_setAdvancedOptions"] = prot.asc_setAdvancedOptions;
  prot["asc_setPageOptions"] = prot.asc_setPageOptions;
  prot["asc_getPageOptions"] = prot.asc_getPageOptions;

  prot["asc_registerCallback"] = prot.asc_registerCallback;
  prot["asc_unregisterCallback"] = prot.asc_unregisterCallback;

  prot["asc_getController"] = prot.asc_getController;
  prot["asc_changeArtImageFromFile"] = prot.asc_changeArtImageFromFile;

  prot["asc_SetDocumentPlaceChangedEnabled"] = prot.asc_SetDocumentPlaceChangedEnabled;
  prot["asc_SetFastCollaborative"] = prot.asc_SetFastCollaborative;
	prot["asc_setThumbnailStylesSizes"] = prot.asc_setThumbnailStylesSizes;

  // Workbook interface

  prot["asc_getWorksheetsCount"] = prot.asc_getWorksheetsCount;
  prot["asc_getWorksheetName"] = prot.asc_getWorksheetName;
  prot["asc_getWorksheetTabColor"] = prot.asc_getWorksheetTabColor;
  prot["asc_setWorksheetTabColor"] = prot.asc_setWorksheetTabColor;
  prot["asc_getActiveWorksheetIndex"] = prot.asc_getActiveWorksheetIndex;
  prot["asc_getActiveWorksheetId"] = prot.asc_getActiveWorksheetId;
  prot["asc_getWorksheetId"] = prot.asc_getWorksheetId;
  prot["asc_isWorksheetHidden"] = prot.asc_isWorksheetHidden;
  prot["asc_isWorksheetLockedOrDeleted"] = prot.asc_isWorksheetLockedOrDeleted;
  prot["asc_isWorkbookLocked"] = prot.asc_isWorkbookLocked;
  prot["asc_getHiddenWorksheets"] = prot.asc_getHiddenWorksheets;
  prot["asc_showWorksheet"] = prot.asc_showWorksheet;
  prot["asc_showActiveWorksheet"] = prot.asc_showActiveWorksheet;
  prot["asc_hideWorksheet"] = prot.asc_hideWorksheet;
  prot["asc_renameWorksheet"] = prot.asc_renameWorksheet;
  prot["asc_addWorksheet"] = prot.asc_addWorksheet;
  prot["asc_insertWorksheet"] = prot.asc_insertWorksheet;
  prot["asc_deleteWorksheet"] = prot.asc_deleteWorksheet;
  prot["asc_moveWorksheet"] = prot.asc_moveWorksheet;
  prot["asc_copyWorksheet"] = prot.asc_copyWorksheet;
  prot["asc_cleanSelection"] = prot.asc_cleanSelection;
  prot["asc_getZoom"] = prot.asc_getZoom;
  prot["asc_setZoom"] = prot.asc_setZoom;
  prot["asc_enableKeyEvents"] = prot.asc_enableKeyEvents;
  prot["asc_searchEnabled"] = prot.asc_searchEnabled;
  prot["asc_findText"] = prot.asc_findText;
  prot["asc_replaceText"] = prot.asc_replaceText;
  prot["asc_endFindText"] = prot.asc_endFindText;
  prot["asc_findCell"] = prot.asc_findCell;
  prot["asc_closeCellEditor"] = prot.asc_closeCellEditor;

  // Spreadsheet interface

  prot["asc_getColumnWidth"] = prot.asc_getColumnWidth;
  prot["asc_setColumnWidth"] = prot.asc_setColumnWidth;
  prot["asc_showColumns"] = prot.asc_showColumns;
  prot["asc_hideColumns"] = prot.asc_hideColumns;
  prot["asc_autoFitColumnWidth"] = prot.asc_autoFitColumnWidth;
  prot["asc_getRowHeight"] = prot.asc_getRowHeight;
  prot["asc_setRowHeight"] = prot.asc_setRowHeight;
  prot["asc_autoFitRowHeight"] = prot.asc_autoFitRowHeight;
  prot["asc_showRows"] = prot.asc_showRows;
  prot["asc_hideRows"] = prot.asc_hideRows;
  prot["asc_insertCells"] = prot.asc_insertCells;
  prot["asc_deleteCells"] = prot.asc_deleteCells;
  prot["asc_mergeCells"] = prot.asc_mergeCells;
  prot["asc_sortCells"] = prot.asc_sortCells;
  prot["asc_emptyCells"] = prot.asc_emptyCells;
  prot["asc_mergeCellsDataLost"] = prot.asc_mergeCellsDataLost;
  prot["asc_getSheetViewSettings"] = prot.asc_getSheetViewSettings;
	prot["asc_setDisplayGridlines"] = prot.asc_setDisplayGridlines;
	prot["asc_setDisplayHeadings"] = prot.asc_setDisplayHeadings;

  // Defined Names
  prot["asc_getDefinedNames"] = prot.asc_getDefinedNames;
  prot["asc_setDefinedNames"] = prot.asc_setDefinedNames;
  prot["asc_editDefinedNames"] = prot.asc_editDefinedNames;
  prot["asc_delDefinedNames"] = prot.asc_delDefinedNames;
  prot["asc_getDefaultDefinedName"] = prot.asc_getDefaultDefinedName;
  prot["asc_checkDefinedName"] = prot.asc_checkDefinedName;

  // Auto filters interface + format as table
  prot["asc_addAutoFilter"] = prot.asc_addAutoFilter;
  prot["asc_changeAutoFilter"] = prot.asc_changeAutoFilter;
  prot["asc_applyAutoFilter"] = prot.asc_applyAutoFilter;
  prot["asc_applyAutoFilterByType"] = prot.asc_applyAutoFilterByType;
  prot["asc_reapplyAutoFilter"] = prot.asc_reapplyAutoFilter;
  prot["asc_sortColFilter"] = prot.asc_sortColFilter;
  prot["asc_getAddFormatTableOptions"] = prot.asc_getAddFormatTableOptions;
  prot["asc_clearFilter"] = prot.asc_clearFilter;
  prot["asc_clearFilterColumn"] = prot.asc_clearFilterColumn;
  prot["asc_changeSelectionFormatTable"] = prot.asc_changeSelectionFormatTable;
  prot["asc_changeFormatTableInfo"] = prot.asc_changeFormatTableInfo;
  prot["asc_insertCellsInTable"] = prot.asc_insertCellsInTable;
  prot["asc_deleteCellsInTable"] = prot.asc_deleteCellsInTable;
  prot["asc_changeDisplayNameTable"] = prot.asc_changeDisplayNameTable;
  prot["asc_changeTableRange"] = prot.asc_changeTableRange;
  prot["asc_convertTableToRange"] = prot.asc_convertTableToRange;
  prot["asc_getTablePictures"] = prot.asc_getTablePictures;

  // Drawing objects interface

  prot["asc_showDrawingObjects"] = prot.asc_showDrawingObjects;
  prot["asc_setChartTranslate"] = prot.asc_setChartTranslate;
  prot["asc_setTextArtTranslate"] = prot.asc_setTextArtTranslate;
  prot["asc_drawingObjectsExist"] = prot.asc_drawingObjectsExist;
  prot["asc_getChartObject"] = prot.asc_getChartObject;
  prot["asc_addChartDrawingObject"] = prot.asc_addChartDrawingObject;
  prot["asc_editChartDrawingObject"] = prot.asc_editChartDrawingObject;
  prot["asc_addImageDrawingObject"] = prot.asc_addImageDrawingObject;
  prot["asc_setSelectedDrawingObjectLayer"] = prot.asc_setSelectedDrawingObjectLayer;
  prot["asc_getChartPreviews"] = prot.asc_getChartPreviews;
  prot["asc_getTextArtPreviews"] = prot.asc_getTextArtPreviews;
  prot['asc_getPropertyEditorShapes'] = prot.asc_getPropertyEditorShapes;
  prot['asc_getPropertyEditorTextArts'] = prot.asc_getPropertyEditorTextArts;
  prot["asc_checkDataRange"] = prot.asc_checkDataRange;
  prot["asc_getBinaryFileWriter"] = prot.asc_getBinaryFileWriter;
  prot["asc_getWordChartObject"] = prot.asc_getWordChartObject;
  prot["asc_cleanWorksheet"] = prot.asc_cleanWorksheet;
  prot["asc_showImageFileDialog"] = prot.asc_showImageFileDialog;
  prot["asc_addImage"] = prot.asc_addImage;
  prot["asc_setData"] = prot.asc_setData;
  prot["asc_getData"] = prot.asc_getData;
  prot["asc_onCloseChartFrame"] = prot.asc_onCloseChartFrame;

  // Cell comment interface
  prot["asc_addComment"] = prot.asc_addComment;
  prot["asc_changeComment"] = prot.asc_changeComment;
  prot["asc_findComment"] = prot.asc_findComment;
  prot["asc_removeComment"] = prot.asc_removeComment;
  prot["asc_showComment"] = prot.asc_showComment;
  prot["asc_selectComment"] = prot.asc_selectComment;

  prot["asc_showComments"] = prot.asc_showComments;
  prot["asc_hideComments"] = prot.asc_hideComments;

  prot["asc_getComments"] = prot.asc_getComments;
  prot["asc_getDocumentComments"] = prot.asc_getDocumentComments;

  // Shapes
  prot["setStartPointHistory"] = prot.setStartPointHistory;
  prot["setEndPointHistory"] = prot.setEndPointHistory;
  prot["asc_startAddShape"] = prot.asc_startAddShape;
  prot["asc_endAddShape"] = prot.asc_endAddShape;
  prot["asc_addShapeOnSheet"] = prot.asc_addShapeOnSheet;
  prot["asc_isAddAutoshape"] = prot.asc_isAddAutoshape;
  prot["asc_canAddShapeHyperlink"] = prot.asc_canAddShapeHyperlink;
  prot["asc_canGroupGraphicsObjects"] = prot.asc_canGroupGraphicsObjects;
  prot["asc_groupGraphicsObjects"] = prot.asc_groupGraphicsObjects;
  prot["asc_canUnGroupGraphicsObjects"] = prot.asc_canUnGroupGraphicsObjects;
  prot["asc_unGroupGraphicsObjects"] = prot.asc_unGroupGraphicsObjects;
  prot["asc_getGraphicObjectProps"] = prot.asc_getGraphicObjectProps;
  prot["asc_setGraphicObjectProps"] = prot.asc_setGraphicObjectProps;
  prot["asc_getOriginalImageSize"] = prot.asc_getOriginalImageSize;
  prot["asc_changeShapeType"] = prot.asc_changeShapeType;
  prot["asc_setInterfaceDrawImagePlaceShape"] = prot.asc_setInterfaceDrawImagePlaceShape;
  prot["asc_setInterfaceDrawImagePlaceTextArt"] = prot.asc_setInterfaceDrawImagePlaceTextArt;
  prot["asc_changeImageFromFile"] = prot.asc_changeImageFromFile;
  prot["asc_putPrLineSpacing"] = prot.asc_putPrLineSpacing;
  prot["asc_addTextArt"] = prot.asc_addTextArt;
  prot["asc_putLineSpacingBeforeAfter"] = prot.asc_putLineSpacingBeforeAfter;
  prot["asc_setDrawImagePlaceParagraph"] = prot.asc_setDrawImagePlaceParagraph;
  prot["asc_changeShapeImageFromFile"] = prot.asc_changeShapeImageFromFile;
  prot["asc_AddMath"] = prot.asc_AddMath;
  prot["asc_SetMathProps"] = prot.asc_SetMathProps;
  //----------------------------------------------------------------------------------------------------------------------

  // Frozen pane
  prot["asc_freezePane"] = prot.asc_freezePane;

  // Sparklines
  prot["asc_setSparklineGroup"] = prot.asc_setSparklineGroup;

  // Cell interface
  prot["asc_getCellInfo"] = prot.asc_getCellInfo;
  prot["asc_getActiveCellCoord"] = prot.asc_getActiveCellCoord;
  prot["asc_getAnchorPosition"] = prot.asc_getAnchorPosition;
  prot["asc_setCellFontName"] = prot.asc_setCellFontName;
  prot["asc_setCellFontSize"] = prot.asc_setCellFontSize;
  prot["asc_setCellBold"] = prot.asc_setCellBold;
  prot["asc_setCellItalic"] = prot.asc_setCellItalic;
  prot["asc_setCellUnderline"] = prot.asc_setCellUnderline;
  prot["asc_setCellStrikeout"] = prot.asc_setCellStrikeout;
  prot["asc_setCellSubscript"] = prot.asc_setCellSubscript;
  prot["asc_setCellSuperscript"] = prot.asc_setCellSuperscript;
  prot["asc_setCellAlign"] = prot.asc_setCellAlign;
  prot["asc_setCellVertAlign"] = prot.asc_setCellVertAlign;
  prot["asc_setCellTextWrap"] = prot.asc_setCellTextWrap;
  prot["asc_setCellTextShrink"] = prot.asc_setCellTextShrink;
  prot["asc_setCellTextColor"] = prot.asc_setCellTextColor;
  prot["asc_setCellBackgroundColor"] = prot.asc_setCellBackgroundColor;
  prot["asc_setCellBorders"] = prot.asc_setCellBorders;
  prot["asc_setCellFormat"] = prot.asc_setCellFormat;
  prot["asc_setCellAngle"] = prot.asc_setCellAngle;
  prot["asc_setCellStyle"] = prot.asc_setCellStyle;
  prot["asc_increaseCellDigitNumbers"] = prot.asc_increaseCellDigitNumbers;
  prot["asc_decreaseCellDigitNumbers"] = prot.asc_decreaseCellDigitNumbers;
  prot["asc_increaseFontSize"] = prot.asc_increaseFontSize;
  prot["asc_decreaseFontSize"] = prot.asc_decreaseFontSize;
  prot["asc_formatPainter"] = prot.asc_formatPainter;
  prot["asc_showAutoComplete"] = prot.asc_showAutoComplete;

  prot["asc_onMouseUp"] = prot.asc_onMouseUp;

  prot["asc_selectFunction"] = prot.asc_selectFunction;
  prot["asc_insertHyperlink"] = prot.asc_insertHyperlink;
  prot["asc_removeHyperlink"] = prot.asc_removeHyperlink;
  prot["asc_insertFormula"] = prot.asc_insertFormula;
  prot["asc_getFormulasInfo"] = prot.asc_getFormulasInfo;
  prot["asc_getFormulaLocaleName"] = prot.asc_getFormulaLocaleName;
  prot["asc_setFontRenderingMode"] = prot.asc_setFontRenderingMode;
  prot["asc_setSelectionDialogMode"] = prot.asc_setSelectionDialogMode;
  prot["asc_ChangeColorScheme"] = prot.asc_ChangeColorScheme;
  /////////////////////////////////////////////////////////////////////////
  ///////////////////CoAuthoring and Chat api//////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  prot["asc_coAuthoringChatSendMessage"] = prot.asc_coAuthoringChatSendMessage;
  prot["asc_coAuthoringGetUsers"] = prot.asc_coAuthoringGetUsers;
  prot["asc_coAuthoringChatGetMessages"] = prot.asc_coAuthoringChatGetMessages;
  prot["asc_coAuthoringDisconnect"] = prot.asc_coAuthoringDisconnect;

  // other
  prot["asc_stopSaving"] = prot.asc_stopSaving;
  prot["asc_continueSaving"] = prot.asc_continueSaving;

  // Version History
  prot["asc_undoAllChanges"] = prot.asc_undoAllChanges;

  prot["asc_setLocalization"] = prot.asc_setLocalization;

  // native
  prot["asc_nativeOpenFile"] = prot.asc_nativeOpenFile;
  prot["asc_nativeCalculateFile"] = prot.asc_nativeCalculateFile;
  prot["asc_nativeApplyChanges"] = prot.asc_nativeApplyChanges;
  prot["asc_nativeApplyChanges2"] = prot.asc_nativeApplyChanges2;
  prot["asc_nativeGetFile"] = prot.asc_nativeGetFile;
  prot["asc_nativeGetFileData"] = prot.asc_nativeGetFileData;
  prot["asc_nativeCheckPdfRenderer"] = prot.asc_nativeCheckPdfRenderer;
  prot["asc_nativeCalculate"] = prot.asc_nativeCalculate;
  prot["asc_nativePrint"] = prot.asc_nativePrint;
  prot["asc_nativePrintPagesCount"] = prot.asc_nativePrintPagesCount;
  prot["asc_nativeGetPDF"] = prot.asc_nativeGetPDF;
  
  prot['asc_isOffline'] = prot.asc_isOffline;
  prot['asc_getUrlType'] = prot.asc_getUrlType;

  // Builder
  prot['asc_nativeInitBuilder'] = prot.asc_nativeInitBuilder;
  prot['asc_SetSilentMode'] = prot.asc_SetSilentMode;

  // plugins
  prot["asc_pluginsRegister"]       = prot.asc_pluginsRegister;
  prot["asc_pluginRun"]             = prot.asc_pluginRun;
  prot["asc_pluginResize"]          = prot.asc_pluginResize;
  prot["asc_pluginButtonClick"]     = prot.asc_pluginButtonClick;
  prot["asc_addOleObject"]          = prot.asc_addOleObject;
  prot["asc_editOleObject"]         = prot.asc_editOleObject;
  prot["asc_startEditCurrentOleObject"]         = prot.asc_startEditCurrentOleObject;
  prot["asc_pluginEnableMouseEvents"] = prot.asc_pluginEnableMouseEvents;

  // system input
  prot["SetTextBoxInputMode"]       = prot.SetTextBoxInputMode;
  prot["GetTextBoxInputMode"]       = prot.GetTextBoxInputMode;

  prot["asc_InputClearKeyboardElement"] = prot.asc_InputClearKeyboardElement;

  // mobile
  prot["asc_Remove"] = prot.asc_Remove;
})(window);
