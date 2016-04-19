"use strict";

// Import
var offlineMode = AscCommon.offlineMode;
var c_oEditorId = AscCommon.c_oEditorId;

var c_oAscError = Asc.c_oAscError;
var c_oAscAsyncAction = Asc.c_oAscAsyncAction;
var c_oAscAsyncActionType = Asc.c_oAscAsyncActionType;

var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";

/** @constructor */
function baseEditorsApi(name) {
  g_fontApplication.Init();

  this.editorId = null;

  this.HtmlElementName = name;
  this.HtmlElement = null;

  this.isMobileVersion = false;

  this.FontLoader = window.g_font_loader;
  this.ImageLoader = window.g_image_loader;
  this.FontLoader.put_Api(this);
  this.ImageLoader.put_Api(this);
  this.FontLoader.SetStandartFonts();

  this.LoadedObject = null;
  this.DocumentType = 0; // 0 - empty, 1 - test, 2 - document (from json)
  this.DocInfo = null;
  this.documentVKey = null;
  this.documentId = undefined;
  this.documentUserId = undefined;
  this.documentUrl = "null";
  this.documentUrlChanges = null;
  this.documentCallbackUrl = undefined;		// Ссылка для отправления информации о документе
  this.documentFormat = "null";
  this.documentTitle = "null";
  this.documentFormatSave = Asc.c_oAscFileType.UNKNOWN;

  this.documentOpenOptions = undefined;		// Опции при открытии (пока только опции для CSV)

  // Тип состояния на данный момент (сохранение, открытие или никакое)
  this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.None;
  // Тип скачивания файлы(download или event).нужен для txt, csv. запоминаем на asc_DownloadAs используем asc_setAdvancedOptions
  this.downloadType = AscCommon.DownloadType.None;
  this.OpenDocumentProgress = new AscCommon.COpenProgress();
  var sProtocol = window.location.protocol;
  this.documentOrigin = ((sProtocol && '' !== sProtocol) ? sProtocol + '//' : '') + window.location.host; // for presentation theme url
  this.documentPathname = window.location.pathname; // for presentation theme url

  // Переменная отвечает, получили ли мы ответ с сервера совместного редактирования
  this.ServerIdWaitComplete = false;

  // Long action
  this.IsLongActionCurrent = 0;
  this.LongActionCallbacks = [];
  this.LongActionCallbacksParams = [];

  // AutoSave
  this.autoSaveGap = 0;					// Интервал автосохранения (0 - означает, что автосохранения нет) в милесекундах

  this.isDocumentCanSave = false;			// Флаг, говорит о возможности сохранять документ (активна кнопка save или нет)

  // Chart
  this.chartTranslate = new asc_CChartTranslate();
  this.textArtTranslate = new Asc.asc_TextArtTranslate();
  this.chartPreviewManager = new ChartPreviewManager();
  this.textArtPreviewManager = new TextArtPreviewManager();
  // Режим вставки диаграмм в редакторе документов
  this.isChartEditor = false;
  this.isOpenedChartFrame = false;

  // CoAuthoring and Chat
  this.User = undefined;
  this.CoAuthoringApi = new AscCommon.CDocsCoApi();
  this.isCoAuthoringEnable = true;
  // Массив lock-ов, которые были на открытии документа
  this.arrPreOpenLocksObjects = [];

  // Spell Checking
  this.SpellCheckUrl = '';    // Ссылка сервиса для проверки орфографии

  // Результат получения лицензии
  this.licenseResult = null;
  // Подключились ли уже к серверу
  this.isOnFirstConnectEnd = false;
  // Получили ли лицензию
  this.isOnLoadLicense = false;

  this.canSave = true;        // Флаг нужен чтобы не происходило сохранение пока не завершится предыдущее сохранение
  this.IsUserSave = false;    // Флаг, контролирующий сохранение было сделано пользователем или нет (по умолчанию - нет)

  // Version History
  this.VersionHistory = null;				// Объект, который отвечает за точку в списке версий

  //Флаги для применения свойств через слайдеры
  this.noCreatePoint = false;
  this.exucuteHistory = false;
  this.exucuteHistoryEnd = false;

  // На этапе сборки значение переменной ASC_DOCS_API_USE_EMBEDDED_FONTS может менятся.
  // По дефолту встроенные шрифты использоваться не будут, как и при любом значении
  // ASC_DOCS_API_USE_EMBEDDED_FONTS, кроме "true"(написание от регистра не зависит).

  // Использовать ли обрезанные шрифты
  this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());

  this.fCurCallback = null;

  this._baseInit();
  return this;
}
baseEditorsApi.prototype._baseInit = function() {
  var t = this;
  this.HtmlElement = document.getElementById(this.HtmlElementName);

  // init OnMessage
  AscCommon.InitOnMessage(function(error, url) {
    if (c_oAscError.ID.No !== error) {
      t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
    } else {
      t._addImageUrl(url);
    }

    t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
  });
  // init drag&drop
  AscCommon.InitDragAndDrop(this.HtmlElement, function(error, files) {
    t._uploadCallback(error, files);
  });

  CHART_STYLE_MANAGER = new CChartStyleManager();
};
baseEditorsApi.prototype._editorNameById = function() {
  var res = '';
  switch (this.editorId) {
    case c_oEditorId.Word:
      res = 'Word';
      break;
    case c_oEditorId.Spreadsheet:
      res = 'Excel';
      break;
    case c_oEditorId.Presentation:
      res = 'PowerPoint';
      break;
  }
  return res;
};
baseEditorsApi.prototype.asc_GetFontThumbnailsPath = function() {
  return '../Common/Images/';
};
baseEditorsApi.prototype.asc_getDocumentName = function() {
  return this.documentTitle;
};
baseEditorsApi.prototype.asc_setDocInfo = function(oDocInfo) {
  if (oDocInfo) {
    this.DocInfo = oDocInfo;
  }

  if (this.DocInfo) {
    this.documentId = this.DocInfo.get_Id();
    this.documentUserId = this.DocInfo.get_UserId();
    this.documentUrl = this.DocInfo.get_Url();
    this.documentTitle = this.DocInfo.get_Title();
    this.documentFormat = this.DocInfo.get_Format();
    this.documentCallbackUrl = this.DocInfo.get_CallbackUrl();
    this.documentVKey = this.DocInfo.get_VKey();

    this.documentOpenOptions = this.DocInfo.asc_getOptions();

    this.User = new AscCommon.asc_CUser();
    this.User.setId(this.DocInfo.get_UserId());
    this.User.setUserName(this.DocInfo.get_UserName());
  }

  if (undefined !== window["AscDesktopEditor"] && offlineMode != this.documentUrl) {
    window["AscDesktopEditor"]["SetDocumentName"](this.documentTitle);
  }
};
baseEditorsApi.prototype.asc_SetFontsPath = function(path) {
  this.FontLoader.fontFilesPath = path;
};
baseEditorsApi.prototype.asc_enableKeyEvents = function(isEnabled) {
};
// Copy/Past/Cut
baseEditorsApi.prototype.asc_IsFocus = function(bIsNaturalFocus) {
};
// Просмотр PDF
baseEditorsApi.prototype.isPdfViewer = function() {
  return false;
};
// Events
baseEditorsApi.prototype.sendEvent = function() {
};
baseEditorsApi.prototype.SendOpenProgress = function() {
  this.sendEvent("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
};
baseEditorsApi.prototype.sync_InitEditorFonts = function(gui_fonts) {
  this.sendEvent("asc_onInitEditorFonts", gui_fonts);
};
baseEditorsApi.prototype.sync_StartAction = function(type, id) {
  this.sendEvent('asc_onStartAction', type, id);
  //console.log("asc_onStartAction: type = " + type + " id = " + id);

  if (c_oAscAsyncActionType.BlockInteraction === type) {
    this.incrementCounterLongAction();
  }
};
baseEditorsApi.prototype.sync_EndAction = function(type, id) {
  this.sendEvent('asc_onEndAction', type, id);
  //console.log("asc_onEndAction: type = " + type + " id = " + id);

  if (c_oAscAsyncActionType.BlockInteraction === type) {
    this.decrementCounterLongAction();
  }
};
baseEditorsApi.prototype.sync_TryUndoInFastCollaborative = function()
{
  this.sendEvent("asc_OnTryUndoInFastCollaborative");
};
baseEditorsApi.prototype.asc_setViewMode = function() {
};
baseEditorsApi.prototype.getViewMode = function() {
};
baseEditorsApi.prototype.isLongAction = function() {
  return (0 !== this.IsLongActionCurrent);
};
baseEditorsApi.prototype.incrementCounterLongAction = function() {
  ++this.IsLongActionCurrent;
};
baseEditorsApi.prototype.decrementCounterLongAction = function() {
  this.IsLongActionCurrent--;
  if (this.IsLongActionCurrent < 0) {
    this.IsLongActionCurrent = 0;
  }

  if (!this.isLongAction()) {
    var _length = this.LongActionCallbacks.length;
    for (var i = 0; i < _length; i++) {
      this.LongActionCallbacks[i](this.LongActionCallbacksParams[i]);
    }
    this.LongActionCallbacks.splice(0, _length);
    this.LongActionCallbacksParams.splice(0, _length);
  }
};
baseEditorsApi.prototype.checkLongActionCallback = function(_callback, _param) {
  if (this.isLongAction()) {
    this.LongActionCallbacks[this.LongActionCallbacks.length] = _callback;
    this.LongActionCallbacksParams[this.LongActionCallbacksParams.length] = _param;
    return false;
  } else {
    return true;
  }
};
/**
 * Функция для загрузчика шрифтов (нужно ли грузить default шрифты). Для Excel всегда возвращаем false
 * @returns {boolean}
 */
baseEditorsApi.prototype.IsNeedDefaultFonts = function() {
  var res = false;
  switch (this.editorId) {
    case c_oEditorId.Word:
      res = !this.isPdfViewer();
      break;
    case c_oEditorId.Presentation:
      res = true;
      break;
  }
  return res;
};
baseEditorsApi.prototype.onPrint = function() {
  this.sendEvent("asc_onPrint");
};
// Open
baseEditorsApi.prototype.asc_LoadDocument = function(isVersionHistory) {
  // Меняем тип состояния (на открытие)
  this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.Open;
  this.CoAuthoringApi.auth(this.getViewMode());

  this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

  if (offlineMode === this.documentUrl) {
    // ToDo убрать зависимость от this.FontLoader.fontFilesPath
    this.documentUrl = this.FontLoader.fontFilesPath + '../' + this._editorNameById() + '/document/';
    this.DocInfo.asc_putOfflineApp(true);
    this._OfflineAppDocumentStartLoad();
  } else {
    var rData = {
      "c": 'open',
      "id": this.documentId,
      "userid": this.documentUserId,
      "format": this.documentFormat,
      "vkey": this.documentVKey,
      "editorid": this.editorId,
      "url": this.documentUrl,
      "title": this.documentTitle,
      "embeddedfonts": this.isUseEmbeddedCutFonts,
      "viewmode": this.getViewMode()
    };
    if (isVersionHistory) {
      //чтобы результат пришел только этому соединению, а не всем кто в документе
      rData["userconnectionid"] = this.CoAuthoringApi.getUserConnectionId();
    }
    AscCommon.sendCommand(this, null, rData);
  }
};
baseEditorsApi.prototype._OfflineAppDocumentStartLoad = function() {
  var t = this;
  var scriptElem = document.createElement('script');
  scriptElem.onload = scriptElem.onerror = function() {
    t._OfflineAppDocumentEndLoad();
  };

  scriptElem.setAttribute('src', this.documentUrl + 'editor.js');
  scriptElem.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(scriptElem);
};
baseEditorsApi.prototype._onOpenCommand = function(data) {
};
baseEditorsApi.prototype._onNeedParams = function(data) {
};
baseEditorsApi.prototype.asyncServerIdEndLoaded = function() {
};
baseEditorsApi.prototype.asyncFontStartLoaded = function() {
  // здесь прокинуть евент о заморозке меню
  this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
};
baseEditorsApi.prototype.asyncImageStartLoaded = function() {
  // здесь прокинуть евент о заморозке меню
};
baseEditorsApi.prototype.asyncImagesDocumentStartLoaded = function() {
  // евент о заморозке не нужен... оно и так заморожено
  // просто нужно вывести информацию в статус бар (что началась загрузка картинок)
};
// Save
baseEditorsApi.prototype.processSavedFile = function(url, downloadType) {
  if (AscCommon.DownloadType.None !== downloadType) {
    this.sendEvent(downloadType, url, function(hasError) {
    });
  } else {
    AscCommon.getFile(url);
  }
};
// Выставление интервала автосохранения (0 - означает, что автосохранения нет)
baseEditorsApi.prototype.asc_setAutoSaveGap = function(autoSaveGap) {
  if (typeof autoSaveGap === "number") {
    this.autoSaveGap = autoSaveGap * 1000; // Нам выставляют в секундах
  }
};
// send chart message
baseEditorsApi.prototype.asc_coAuthoringChatSendMessage = function(message) {
  this.CoAuthoringApi.sendMessage(message);
};
// get chart messages
baseEditorsApi.prototype.asc_coAuthoringChatGetMessages = function() {
  this.CoAuthoringApi.getMessages();
};
// get users, возвращается массив users
baseEditorsApi.prototype.asc_coAuthoringGetUsers = function() {
  this.CoAuthoringApi.getUsers();
};
// get permissions
baseEditorsApi.prototype.asc_getEditorPermissions = function() {
  this._coAuthoringInit();
};
baseEditorsApi.prototype._onEndPermissions = function() {
  if (this.isOnFirstConnectEnd && this.isOnLoadLicense) {
    this.sendEvent('asc_onGetEditorPermissions', new AscCommon.asc_CAscEditorPermissions());
  }
};
// CoAuthoring
baseEditorsApi.prototype._coAuthoringInit = function() {
  var t = this;
  //Если User не задан, отключаем коавторинг.
  if (null == this.User || null == this.User.asc_getId()) {
    this.User = new AscCommon.asc_CUser();
    this.User.setId("Unknown");
    this.User.setUserName("Unknown");
  }
  //в обычном серверном режиме портим ссылку, потому что CoAuthoring теперь имеет встроенный адрес
  //todo надо использовать проверку get_OfflineApp
  if (!(window['NATIVE_EDITOR_ENJINE'] || offlineMode === this.documentUrl)) {
    this.CoAuthoringApi.set_url(null);
  }

  this.CoAuthoringApi.onMessage = function(e, clear) {
    t.sendEvent('asc_onCoAuthoringChatReceiveMessage', e, clear);
  };
  this.CoAuthoringApi.onAuthParticipantsChanged = function(e, count) {
    t.sendEvent("asc_onAuthParticipantsChanged", e, count);
  };
  this.CoAuthoringApi.onParticipantsChanged = function(e, CountEditUsers) {
    t.sendEvent("asc_onParticipantsChanged", e, CountEditUsers);
  };
  this.CoAuthoringApi.onSpellCheckInit = function(e) {
    t.SpellCheckUrl = e;
    t._coSpellCheckInit();
  };
  this.CoAuthoringApi.onSetIndexUser = function(e) {
    AscCommon.g_oIdCounter.Set_UserId('' + e);
  };
  this.CoAuthoringApi.onFirstLoadChangesEnd = function() {
    t.asyncServerIdEndLoaded();
  };
  this.CoAuthoringApi.onFirstConnect = function() {
    t.isOnFirstConnectEnd = true;
    t._onEndPermissions();
  };
  this.CoAuthoringApi.onLicense = function(res) {
    t.licenseResult = res;
    t.isOnLoadLicense = true;
    t._onEndPermissions();
  };
  this.CoAuthoringApi.onWarning = function(e) {
    t.sendEvent('asc_onError', c_oAscError.ID.Warning, c_oAscError.Level.NoCritical);
  };
  /**
   * Event об отсоединении от сервера
   * @param {jQuery} e  event об отсоединении с причиной
   * @param {Bool} isDisconnectAtAll  окончательно ли отсоединяемся(true) или будем пробовать сделать reconnect(false) + сами отключились
   * @param {Bool} isCloseCoAuthoring
   */
  this.CoAuthoringApi.onDisconnect = function(e, isDisconnectAtAll, isCloseCoAuthoring) {
    if (AscCommon.ConnectionState.None === t.CoAuthoringApi.get_state()) {
      t.asyncServerIdEndLoaded();
    }
    if (isDisconnectAtAll) {
      // Посылаем наверх эвент об отключении от сервера
      t.sendEvent('asc_onCoAuthoringDisconnect');
      // И переходим в режим просмотра т.к. мы не можем сохранить файл
      t.asc_setViewMode(true);
      t.sendEvent('asc_onError', isCloseCoAuthoring ? c_oAscError.ID.UserDrop : c_oAscError.ID.CoAuthoringDisconnect, c_oAscError.Level.NoCritical);
    }
  };
  this.CoAuthoringApi.onDocumentOpen = function(inputWrap) {
    if (inputWrap["data"]) {
      var input = inputWrap["data"];
      switch (input["type"]) {
        case 'reopen':
        case 'open':
          switch (input["status"]) {
            case "updateversion":
            case "ok":
              var urls = input["data"];
              AscCommon.g_oDocumentUrls.init(urls);
              if (null != urls['Editor.bin']) {
                if ('ok' === input["status"] || t.getViewMode()) {
                  t._onOpenCommand(urls['Editor.bin']);
                } else {
                  t.sendEvent("asc_onDocumentUpdateVersion", function() {
                    if (t.isCoAuthoringEnable) {
                      t.asc_coAuthoringDisconnect();
                    }
                    t._onOpenCommand(urls['Editor.bin']);
                  })
                }
              } else {
                t.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.Critical);
              }
              break;
            case "needparams":
              t._onNeedParams(input["data"]);
              break;
            case "err":
              t.sendEvent("asc_onError", AscCommon.mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.Critical);
              break;
          }
          break;
        default:
          if (t.fCurCallback) {
            t.fCurCallback(input);
            t.fCurCallback = null;
          } else {
            t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
          }
          break;
      }
    }
  };

  this._coAuthoringInitEnd();
  this.CoAuthoringApi.init(this.User, this.documentId, this.documentCallbackUrl, 'fghhfgsjdgfjs', this.editorId, this.documentFormatSave);
};
baseEditorsApi.prototype._coAuthoringInitEnd = function() {
};
// server disconnect
baseEditorsApi.prototype.asc_coAuthoringDisconnect = function() {
  this.CoAuthoringApi.disconnect();
  this.isCoAuthoringEnable = false;

  // Выставляем view-режим
  this.asc_setViewMode(true);
};
baseEditorsApi.prototype.asc_stopSaving = function() {
  this.incrementCounterLongAction();
};
baseEditorsApi.prototype.asc_continueSaving = function() {
  this.decrementCounterLongAction();
};
// SpellCheck
baseEditorsApi.prototype._coSpellCheckInit = function() {
};
// Images & Charts & TextArts
baseEditorsApi.prototype.asc_setChartTranslate = function(translate) {
  this.chartTranslate = translate;
};
baseEditorsApi.prototype.asc_setTextArtTranslate = function(translate) {
  this.textArtTranslate = translate;
};
baseEditorsApi.prototype.asc_getChartPreviews = function(chartType) {
  return this.chartPreviewManager.getChartPreviews(chartType);
};
baseEditorsApi.prototype.asc_getTextArtPreviews = function() {
  return this.textArtPreviewManager.getWordArtStyles();
};
baseEditorsApi.prototype.asc_onOpenChartFrame = function() {
    this.isOpenedChartFrame = true;
};
baseEditorsApi.prototype.asc_onCloseChartFrame = function() {
    this.isOpenedChartFrame = false;
};
// Add image
baseEditorsApi.prototype._addImageUrl = function() {
};
baseEditorsApi.prototype.asc_addImage = function() {
  var t = this;
  AscCommon.ShowImageFileDialog(this.documentId, this.documentUserId, function(error, files) {
    t._uploadCallback(error, files);
  }, function(error) {
    if (c_oAscError.ID.No !== error) {
      t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
    }
    t.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
  });
};
baseEditorsApi.prototype._uploadCallback = function(error, files) {
  var t = this;
  if (c_oAscError.ID.No !== error) {
    this.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
  } else {
    this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
    AscCommon.UploadImageFiles(files, this.documentId, this.documentUserId, function(error, url) {
      if (c_oAscError.ID.No !== error) {
        t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
      } else {
        t._addImageUrl(url);
      }
      t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
    });
  }
};
// Version History
baseEditorsApi.prototype.asc_showRevision = function(newObj) {
};
baseEditorsApi.prototype.asc_undoAllChanges = function() {
};
/**
 * Эта функция возвращает true, если есть изменения или есть lock-и в документе
 */
baseEditorsApi.prototype.asc_isDocumentCanSave = function() {
  return this.isDocumentCanSave;
};
// Offline mode
baseEditorsApi.prototype.asc_isOffline = function() {
	return false;
};
baseEditorsApi.prototype.asc_getUrlType = function(url) {
	return AscCommon.getUrlType(url);
};