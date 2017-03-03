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

(function(window, undefined)
{
	// Import
	var offlineMode = AscCommon.offlineMode;
	var c_oEditorId = AscCommon.c_oEditorId;
	var c_oCloseCode = AscCommon.c_oCloseCode;

	var c_oAscError           = Asc.c_oAscError;
	var c_oAscAsyncAction     = Asc.c_oAscAsyncAction;
	var c_oAscAsyncActionType = Asc.c_oAscAsyncActionType;

	var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";

	/** @constructor */
	function baseEditorsApi(config, editorId)
	{
		this.editorId      = editorId;
		this.isLoadFullApi = false;
		this.openResult    = null;

		this.HtmlElementName = config['id-view'] || '';
		this.HtmlElement     = null;

		this.isMobileVersion = (config['mobile'] === true);
		this.isEmbedVersion = (config['embedded'] === true);

		this.isViewMode = false;

		this.FontLoader  = null;
		this.ImageLoader = null;

		this.LoadedObject        = null;
		this.DocumentType        = 0; // 0 - empty, 1 - test, 2 - document (from json)
		this.DocInfo             = null;
		this.documentId          = undefined;
		this.documentUserId      = undefined;
		this.documentUrl         = "null";
		this.documentUrlChanges  = null;
		this.documentCallbackUrl = undefined;		// Ссылка для отправления информации о документе
		this.documentFormat      = "null";
		this.documentTitle       = "null";
		this.documentFormatSave  = Asc.c_oAscFileType.UNKNOWN;

		this.documentOpenOptions = undefined;		// Опции при открытии (пока только опции для CSV)

		// Тип состояния на данный момент (сохранение, открытие или никакое)
		this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.None;
		// Тип скачивания файлы(download или event).нужен для txt, csv. запоминаем на asc_DownloadAs используем asc_setAdvancedOptions
		this.downloadType          = AscCommon.DownloadType.None;
		this.OpenDocumentProgress  = new AscCommon.COpenProgress();
		var sProtocol              = window.location.protocol;
		this.documentOrigin        = ((sProtocol && '' !== sProtocol) ? sProtocol + '//' : '') + window.location.host; // for presentation theme url
		this.documentPathname      = window.location.pathname; // for presentation theme url

		// Переменная отвечает, получили ли мы ответ с сервера совместного редактирования
		this.ServerIdWaitComplete = false;

		// Long action
		this.IsLongActionCurrent       = 0;
		this.LongActionCallbacks       = [];
		this.LongActionCallbacksParams = [];

		// AutoSave
		this.autoSaveGap = 0;					// Интервал автосохранения (0 - означает, что автосохранения нет) в милесекундах
		this.lastSaveTime = null;				// Время последнего сохранения
		this.autoSaveGapFast = 2000;			// Интервал быстрого автосохранения (когда человек один) - 2 сек.
		this.autoSaveGapSlow = 10 * 60 * 1000;	// Интервал медленного автосохранения (когда совместно) - 10 минут
		this.intervalWaitAutoSave = 1000;

		// Unlock document
		this.canUnlockDocument = false;
		this.canUnlockDocument2 = false;		// Дублирующий флаг, только для saveChanges или unLockDocument
		this.canStartCoAuthoring = false;

		this.isDocumentCanSave = false;			// Флаг, говорит о возможности сохранять документ (активна кнопка save или нет)

		// Chart
		this.chartTranslate        = null;
		this.textArtTranslate      = null;
		this.chartPreviewManager   = null;
		this.textArtPreviewManager = null;
		this.shapeElementId        = null;
		// Режим вставки диаграмм в редакторе документов
		this.isChartEditor         = false;
		this.isOpenedChartFrame    = false;

		this.MathMenuLoad          = false;

		// CoAuthoring and Chat
		this.User                   = undefined;
		this.CoAuthoringApi         = new AscCommon.CDocsCoApi();
		this.isCoAuthoringEnable    = true;
		// Массив lock-ов, которые были на открытии документа
		this.arrPreOpenLocksObjects = [];

		// Spell Checking
		this.SpellCheckUrl = '';    // Ссылка сервиса для проверки орфографии

		// Результат получения лицензии
		this.licenseResult       = null;
		// Подключились ли уже к серверу
		this.isOnFirstConnectEnd = false;
		// Получили ли лицензию
		this.isOnLoadLicense     = false;

		this.canSave    = true;        // Флаг нужен чтобы не происходило сохранение пока не завершится предыдущее сохранение
		this.IsUserSave = false;    // Флаг, контролирующий сохранение было сделано пользователем или нет (по умолчанию - нет)
		this.isForceSaveOnUserSave = false;
        this.forceSaveButtonTimeout = null;
        this.forceSaveTimeoutTimeout = null;

		// Version History
		this.VersionHistory = null;				// Объект, который отвечает за точку в списке версий

		//Флаги для применения свойств через слайдеры
		this.noCreatePoint     = false;
		this.exucuteHistory    = false;
		this.exucuteHistoryEnd = false;

		// На этапе сборки значение переменной ASC_DOCS_API_USE_EMBEDDED_FONTS может менятся.
		// По дефолту встроенные шрифты использоваться не будут, как и при любом значении
		// ASC_DOCS_API_USE_EMBEDDED_FONTS, кроме "true"(написание от регистра не зависит).

		// Использовать ли обрезанные шрифты
		this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());

		this.isSendStandartTextures = false;

		this.tmpFocus = null;

		this.fCurCallback = null;

		this.pluginsManager = null;

		this.isLockTargetUpdate = false;

		return this;
	}

	baseEditorsApi.prototype._init                           = function()
	{
		var t            = this;
		//Asc.editor = Asc['editor'] = AscCommon['editor'] = AscCommon.editor = this; // ToDo сделать это!
		this.HtmlElement = document.getElementById(this.HtmlElementName);

		// init OnMessage
		AscCommon.InitOnMessage(function(error, url)
		{
			if (c_oAscError.ID.No !== error)
			{
				t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
			}
			else
			{
				t._addImageUrl(url);
			}

			t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
		});

		AscCommon.loadSdk(this._editorNameById(), function()
		{
			t.isLoadFullApi = true;

			if (t.DocInfo && t.DocInfo.get_OfflineApp())
			{
				t._OfflineAppDocumentStartLoad();
			}

			t._onEndLoadSdk();
			t.onEndLoadFile(null);
		});
	};
	baseEditorsApi.prototype._editorNameById                 = function()
	{
		var res = '';
		switch (this.editorId)
		{
			case c_oEditorId.Word:
				res = 'word';
				break;
			case c_oEditorId.Spreadsheet:
				res = 'cell';
				break;
			case c_oEditorId.Presentation:
				res = 'slide';
				break;
		}
		return res;
	};
	baseEditorsApi.prototype.getEditorId                     = function()
	{
		return this.editorId;
	};
	baseEditorsApi.prototype.asc_GetFontThumbnailsPath       = function()
	{
		return '../Common/Images/';
	};
	baseEditorsApi.prototype.asc_getDocumentName             = function()
	{
		return this.documentTitle;
	};
	baseEditorsApi.prototype.asc_setDocInfo                  = function(oDocInfo)
	{
		if (oDocInfo)
		{
			this.DocInfo = oDocInfo;
		}

		if (this.DocInfo)
		{
			this.documentId          = this.DocInfo.get_Id();
			this.documentUserId      = this.DocInfo.get_UserId();
			this.documentUrl         = this.DocInfo.get_Url();
			this.documentTitle       = this.DocInfo.get_Title();
			this.documentFormat      = this.DocInfo.get_Format();
			this.documentCallbackUrl = this.DocInfo.get_CallbackUrl();

			this.documentOpenOptions = this.DocInfo.asc_getOptions();

			this.User = new AscCommon.asc_CUser();
			this.User.setId(this.DocInfo.get_UserId());
			this.User.setUserName(this.DocInfo.get_UserName());
			this.User.setFirstName(this.DocInfo.get_FirstName());
			this.User.setLastName(this.DocInfo.get_LastName());

			//чтобы в versionHistory был один documentId для auth и open
			this.CoAuthoringApi.setDocId(this.documentId);
		}

		if (undefined !== window["AscDesktopEditor"] && offlineMode != this.documentUrl)
		{
			window["AscDesktopEditor"]["SetDocumentName"](this.documentTitle);
		}
	};
	baseEditorsApi.prototype.asc_enableKeyEvents             = function(isEnabled, isFromInput)
	{
	};
	// Copy/Past/Cut
	baseEditorsApi.prototype.asc_IsFocus                     = function(bIsNaturalFocus)
	{
		var _ret = false;
		if (this.WordControl.IsFocus)
			_ret = true;
		if (_ret && bIsNaturalFocus && this.WordControl.TextBoxInputFocus)
			_ret = false;
		return _ret;
	};
	// target pos
	baseEditorsApi.prototype.asc_LockTargetUpdate		     = function(isLock)
	{
		this.isLockTargetUpdate = isLock;
	};
	// Просмотр PDF
	baseEditorsApi.prototype.isPdfViewer                     = function()
	{
		return false;
	};
	// Events
	baseEditorsApi.prototype.sendEvent                       = function()
	{
	};
	baseEditorsApi.prototype.SendOpenProgress                = function()
	{
		this.sendEvent("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
	};
	baseEditorsApi.prototype.sync_InitEditorFonts            = function(gui_fonts)
	{
		if (!this.isViewMode) {
			this.sendEvent("asc_onInitEditorFonts", gui_fonts);
		}
	};
	baseEditorsApi.prototype.sync_StartAction                = function(type, id)
	{
		this.sendEvent('asc_onStartAction', type, id);
		//console.log("asc_onStartAction: type = " + type + " id = " + id);

		if (c_oAscAsyncActionType.BlockInteraction === type)
		{
			this.incrementCounterLongAction();
		}
	};
	baseEditorsApi.prototype.sync_EndAction                  = function(type, id)
	{
		this.sendEvent('asc_onEndAction', type, id);
		//console.log("asc_onEndAction: type = " + type + " id = " + id);

		if (c_oAscAsyncActionType.BlockInteraction === type)
		{
			this.decrementCounterLongAction();
		}
	};
	baseEditorsApi.prototype.sync_TryUndoInFastCollaborative = function()
	{
		this.sendEvent("asc_OnTryUndoInFastCollaborative");
	};
	baseEditorsApi.prototype.asc_setViewMode                 = function()
	{
	};
	baseEditorsApi.prototype.getViewMode                     = function()
	{
	};
	baseEditorsApi.prototype.isLongAction                    = function()
	{
		return (0 !== this.IsLongActionCurrent);
	};
	baseEditorsApi.prototype.incrementCounterLongAction      = function()
	{
		++this.IsLongActionCurrent;
	};
	baseEditorsApi.prototype.decrementCounterLongAction      = function()
	{
		this.IsLongActionCurrent--;
		if (this.IsLongActionCurrent < 0)
		{
			this.IsLongActionCurrent = 0;
		}

		if (!this.isLongAction())
		{
			var _length = this.LongActionCallbacks.length;
			for (var i = 0; i < _length; i++)
			{
				this.LongActionCallbacks[i](this.LongActionCallbacksParams[i]);
			}
			this.LongActionCallbacks.splice(0, _length);
			this.LongActionCallbacksParams.splice(0, _length);
		}
	};
	baseEditorsApi.prototype.checkLongActionCallback         = function(_callback, _param)
	{
		if (this.isLongAction())
		{
			this.LongActionCallbacks[this.LongActionCallbacks.length]             = _callback;
			this.LongActionCallbacksParams[this.LongActionCallbacksParams.length] = _param;
			return false;
		}
		else
		{
			return true;
		}
	};
	/**
	 * Функция для загрузчика шрифтов (нужно ли грузить default шрифты). Для Excel всегда возвращаем false
	 * @returns {boolean}
	 */
	baseEditorsApi.prototype.IsNeedDefaultFonts = function()
	{
		var res = false;
		switch (this.editorId)
		{
			case c_oEditorId.Word:
				res = !this.isPdfViewer();
				break;
			case c_oEditorId.Presentation:
				res = true;
				break;
		}
		return res;
	};
	baseEditorsApi.prototype.onPrint                             = function()
	{
		this.sendEvent("asc_onPrint");
	};
	// Open
	baseEditorsApi.prototype.asc_LoadDocument                    = function(versionHistory, isRepeat)
	{
		// Меняем тип состояния (на открытие)
		this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.Open;
		var rData                  = null;
		if (offlineMode !== this.documentUrl)
		{
			rData = {
				"c"             : 'open',
				"id"            : this.documentId,
				"userid"        : this.documentUserId,
				"format"        : this.documentFormat,
				"url"           : this.documentUrl,
				"title"         : this.documentTitle,
				"embeddedfonts" : this.isUseEmbeddedCutFonts
			};
			if (versionHistory)
			{
				rData["jwt"] = versionHistory.token;
				//чтобы результат пришел только этому соединению, а не всем кто в документе
				rData["userconnectionid"] = this.CoAuthoringApi.getUserConnectionId();
			}
		}
		if (versionHistory) {
			this.CoAuthoringApi.versionHistory(rData);
		} else {
			this.CoAuthoringApi.auth(this.getViewMode(), rData);
		}

		if (!isRepeat) {
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
		}

		if (offlineMode === this.documentUrl)
		{
			this.documentUrl = '/sdkjs/' + this._editorNameById() + '/document/';
			this.DocInfo.asc_putOfflineApp(true);
		}
	};
	baseEditorsApi.prototype._OfflineAppDocumentStartLoad        = function()
	{
		var t             = this;
		var scriptElem    = document.createElement('script');
		scriptElem.onload = scriptElem.onerror = function()
		{
			t._OfflineAppDocumentEndLoad();
		};

		scriptElem.setAttribute('src', this.documentUrl + 'editor.js');
		scriptElem.setAttribute('type', 'text/javascript');
		document.getElementsByTagName('head')[0].appendChild(scriptElem);
	};
	baseEditorsApi.prototype._onOpenCommand                      = function(data)
	{
	};
	baseEditorsApi.prototype._onNeedParams                       = function(data, opt_isPassword)
	{
	};
	baseEditorsApi.prototype.asyncServerIdEndLoaded              = function()
	{
	};
	baseEditorsApi.prototype.asyncFontStartLoaded                = function()
	{
		// здесь прокинуть евент о заморозке меню
		this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
	};
	baseEditorsApi.prototype.asyncImageStartLoaded               = function()
	{
		// здесь прокинуть евент о заморозке меню
	};
	baseEditorsApi.prototype.asyncImagesDocumentStartLoaded      = function()
	{
		// евент о заморозке не нужен... оно и так заморожено
		// просто нужно вывести информацию в статус бар (что началась загрузка картинок)
	};
	// Save
	baseEditorsApi.prototype.processSavedFile                    = function(url, downloadType)
	{
		if (AscCommon.DownloadType.None !== downloadType)
		{
			this.sendEvent(downloadType, url, function(hasError)
			{
			});
		}
		else
		{
			AscCommon.getFile(url);
		}
	};
	baseEditorsApi.prototype.forceSave = function()
	{
		this.CoAuthoringApi.forceSave()
	};
	baseEditorsApi.prototype.asc_setIsForceSaveOnUserSave = function(val)
	{
		this.isForceSaveOnUserSave = val;
	};
	// Функция автосохранения. Переопределяется во всех редакторах
	baseEditorsApi.prototype._autoSave = function () {
	};
	// Выставление интервала автосохранения (0 - означает, что автосохранения нет)
	baseEditorsApi.prototype.asc_setAutoSaveGap                  = function(autoSaveGap)
	{
		if (typeof autoSaveGap === "number")
		{
			this.autoSaveGap = autoSaveGap * 1000; // Нам выставляют в секундах
		}
	};
	// send chart message
	baseEditorsApi.prototype.asc_coAuthoringChatSendMessage      = function(message)
	{
		this.CoAuthoringApi.sendMessage(message);
	};
	// get chart messages
	baseEditorsApi.prototype.asc_coAuthoringChatGetMessages      = function()
	{
		this.CoAuthoringApi.getMessages();
	};
	// get users, возвращается массив users
	baseEditorsApi.prototype.asc_coAuthoringGetUsers             = function()
	{
		this.CoAuthoringApi.getUsers();
	};
	// get permissions
	baseEditorsApi.prototype.asc_getEditorPermissions            = function()
	{
		this._coAuthoringInit();
	};
	baseEditorsApi.prototype._onEndPermissions                   = function()
	{
		if (this.isOnFirstConnectEnd && this.isOnLoadLicense)
		{
			this.sendEvent('asc_onGetEditorPermissions', new AscCommon.asc_CAscEditorPermissions());
		}
	};
	// CoAuthoring
	baseEditorsApi.prototype._coAuthoringInit                    = function()
	{
		var t = this;
		//Если User не задан, отключаем коавторинг.
		if (null == this.User || null == this.User.asc_getId())
		{
			this.User = new AscCommon.asc_CUser();
			this.User.setId("Unknown");
			this.User.setUserName("Unknown");
		}
		//в обычном серверном режиме портим ссылку, потому что CoAuthoring теперь имеет встроенный адрес
		//todo надо использовать проверку get_OfflineApp
		if (!(window['NATIVE_EDITOR_ENJINE'] || offlineMode === this.documentUrl) || window['IS_NATIVE_EDITOR'])
		{
			this.CoAuthoringApi.set_url(null);
		}

		this.CoAuthoringApi.onMessage                 = function(e, clear)
		{
			t.sendEvent('asc_onCoAuthoringChatReceiveMessage', e, clear);
		};
		this.CoAuthoringApi.onServerVersion = function (buildVersion, buildNumber) {
			t.sendEvent('asc_onServerVersion', buildVersion, buildNumber);
		};
		this.CoAuthoringApi.onAuthParticipantsChanged = function(e, count)
		{
			t.sendEvent("asc_onAuthParticipantsChanged", e, count);
		};
		this.CoAuthoringApi.onParticipantsChanged     = function(e, CountEditUsers)
		{
			t.sendEvent("asc_onParticipantsChanged", e, CountEditUsers);
		};
		this.CoAuthoringApi.onSpellCheckInit          = function(e)
		{
			t.SpellCheckUrl = e;
			t._coSpellCheckInit();
		};
		this.CoAuthoringApi.onSetIndexUser            = function(e)
		{
			AscCommon.g_oIdCounter.Set_UserId('' + e);
		};
		this.CoAuthoringApi.onFirstLoadChangesEnd     = function()
		{
			t.asyncServerIdEndLoaded();
		};
		this.CoAuthoringApi.onFirstConnect            = function()
		{
			if (t.isOnFirstConnectEnd)
			{
				if (t.CoAuthoringApi.get_isAuth()) {
					t.CoAuthoringApi.auth(t.getViewMode());
				} else {
					//первый запрос или ответ не дошел надо повторить открытие
					t.asc_LoadDocument(undefined, true);
				}
			}
			else
			{
				t.isOnFirstConnectEnd = true;
				t._onEndPermissions();
			}
		};
		this.CoAuthoringApi.onLicense                 = function(res)
		{
			t.licenseResult   = res;
			t.isOnLoadLicense = true;
			t._onEndPermissions();
		};
		this.CoAuthoringApi.onWarning                 = function(code)
		{
			t.sendEvent('asc_onError', code || c_oAscError.ID.Warning, c_oAscError.Level.NoCritical);
		};
		this.CoAuthoringApi.onMeta                    = function(data)
		{
			var newDocumentTitle = data["title"];
			if (newDocumentTitle) {
				t.documentTitle = newDocumentTitle;
				if (t.DocInfo) {
					t.DocInfo.asc_putTitle(newDocumentTitle);
				}
			}
			t.sendEvent('asc_onMeta', data);
		};
		this.CoAuthoringApi.onSession = function(data) {
			var code = data["code"];
			var reason = data["reason"];
			var interval = data["interval"];
			var extendSession = true;
			if (c_oCloseCode.sessionIdle == code) {
				var lastTime = new Date().getTime();
				var idleTime = new Date().getTime() - lastTime;
				if (idleTime < interval) {
					t.CoAuthoringApi.extendSession(idleTime);
				} else {
					extendSession = false;
				}
			} else if (c_oCloseCode.sessionAbsolute == code) {
				extendSession = false;
			}
			if (!extendSession) {
				if (History.Have_Changes()) {
					//enter view mode because save async
					t.sendEvent('asc_onCoAuthoringDisconnect');
					t.asc_setViewMode(true);

					t.CoAuthoringApi.onUnSaveLock = function() {
						t.CoAuthoringApi.onUnSaveLock = null;

						t.CoAuthoringApi.disconnect(code, reason);
					};
					if (t.collaborativeEditing.applyChanges) {
						t.collaborativeEditing.applyChanges();
						t.collaborativeEditing.sendChanges();
					} else {
						AscCommon.CollaborativeEditing.Apply_Changes();
						AscCommon.CollaborativeEditing.Send_Changes();
					}
				} else {
					t.CoAuthoringApi.disconnect(code, reason);
				}
			}
		};
        this.CoAuthoringApi.onForceSave = function(data) {
            if (AscCommon.c_oAscForceSaveTypes.Button === data.type) {
                if (data.start) {
                    if (null === t.forceSaveButtonTimeout) {
                        t.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveButton);
                    } else {
                        clearInterval(t.forceSaveButtonTimeout);
                    }
                    t.forceSaveButtonTimeout = setInterval(function() {
                        t.forceSaveButtonTimeout = null;
                        t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveButton);
                    }, Asc.c_nMaxConversionTime);
                } else {
                    if (null !== t.forceSaveButtonTimeout) {
                        clearInterval(t.forceSaveButtonTimeout);
                        t.forceSaveButtonTimeout = null;
                        t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveButton);
                    }
                }
            } else {
                if (AscCommon.CollaborativeEditing.Is_Fast() || null !== t.forceSaveTimeoutTimeout) {
                    if (data.start) {
                        if (null === t.forceSaveTimeoutTimeout) {
                            t.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveTimeout);
                        } else {
                            clearInterval(t.forceSaveTimeoutTimeout);
                        }
                        t.forceSaveTimeoutTimeout = setInterval(function() {
                            t.forceSaveTimeoutTimeout = null;
                            t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveTimeout);
                        }, Asc.c_nMaxConversionTime);
                    } else {
                        if (null !== t.forceSaveTimeoutTimeout) {
                            clearInterval(t.forceSaveTimeoutTimeout);
                            t.forceSaveTimeoutTimeout = null;
                            t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.ForceSaveTimeout);
                        }
                    }
                }
            }
        };
		/**
		 * Event об отсоединении от сервера
		 * @param {jQuery} e  event об отсоединении с причиной
		 * @param {Bool} isDisconnectAtAll  окончательно ли отсоединяемся(true) или будем пробовать сделать reconnect(false) + сами отключились
		 * @param {Bool} isCloseCoAuthoring
		 */
		this.CoAuthoringApi.onDisconnect = function(e, errorCode)
		{
			if (AscCommon.ConnectionState.None === t.CoAuthoringApi.get_state())
			{
				t.asyncServerIdEndLoaded();
			}
			if (null != errorCode)
			{
				// Посылаем наверх эвент об отключении от сервера
				t.sendEvent('asc_onCoAuthoringDisconnect');
				// И переходим в режим просмотра т.к. мы не можем сохранить файл
				t.asc_setViewMode(true);
				t.sendEvent('asc_onError', errorCode, c_oAscError.Level.NoCritical);
			}
		};
		this.CoAuthoringApi.onDocumentOpen = function (inputWrap) {
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
										t.sendEvent("asc_onDocumentUpdateVersion", function () {
											if (t.isCoAuthoringEnable) {
												t.asc_coAuthoringDisconnect();
											}
											t._onOpenCommand(urls['Editor.bin']);
										})
									}
								} else {
									t.sendEvent("asc_onError", c_oAscError.ID.ConvertationOpenError,
										c_oAscError.Level.Critical);
								}
								break;
							case "needparams":
								t._onNeedParams(input["data"]);
								break;
							case "needpassword":
								t._onNeedParams(null, true);
								break;
							case "err":
								t.sendEvent("asc_onError",
									AscCommon.mapAscServerErrorToAscError(parseInt(input["data"]),
										Asc.c_oAscError.ID.ConvertationOpenError), c_oAscError.Level.Critical);
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
		this.CoAuthoringApi.init(this.User, this.documentId, this.documentCallbackUrl, 'fghhfgsjdgfjs', this.editorId, this.documentFormatSave, this.DocInfo);
	};
	baseEditorsApi.prototype._coAuthoringInitEnd                 = function()
	{
	};
	// server disconnect
	baseEditorsApi.prototype.asc_coAuthoringDisconnect           = function()
	{
		this.CoAuthoringApi.disconnect();
		this.isCoAuthoringEnable = false;

		// Выставляем view-режим
		this.asc_setViewMode(true);
	};
	baseEditorsApi.prototype.asc_stopSaving                      = function()
	{
		this.incrementCounterLongAction();
	};
	baseEditorsApi.prototype.asc_continueSaving                  = function()
	{
		this.decrementCounterLongAction();
	};
	// SpellCheck
	baseEditorsApi.prototype._coSpellCheckInit                   = function()
	{
	};
	// Images & Charts & TextArts
	baseEditorsApi.prototype.asc_setChartTranslate               = function(translate)
	{
		this.chartTranslate = translate;
	};
	baseEditorsApi.prototype.asc_setTextArtTranslate             = function(translate)
	{
		this.textArtTranslate = translate;
	};
	baseEditorsApi.prototype.asc_getChartPreviews                = function(chartType)
	{
		return this.chartPreviewManager.getChartPreviews(chartType);
	};
	baseEditorsApi.prototype.asc_getTextArtPreviews              = function()
	{
		return this.textArtPreviewManager.getWordArtStyles();
	};
	baseEditorsApi.prototype.asc_onOpenChartFrame                = function()
	{
		this.isOpenedChartFrame = true;
	};
	baseEditorsApi.prototype.asc_onCloseChartFrame               = function()
	{
		this.isOpenedChartFrame = false;
	};
	baseEditorsApi.prototype.asc_setInterfaceDrawImagePlaceShape = function(elementId)
	{
		this.shapeElementId = elementId;
	};
	baseEditorsApi.prototype.asc_getPropertyEditorShapes         = function()
	{
		return [AscCommon.g_oAutoShapesGroups, AscCommon.g_oAutoShapesTypes];
	};
	baseEditorsApi.prototype.asc_getPropertyEditorTextArts       = function()
	{
		return [AscCommon.g_oPresetTxWarpGroups, AscCommon.g_PresetTxWarpTypes];
	};
	// Add image
	baseEditorsApi.prototype._addImageUrl                        = function()
	{
	};
	baseEditorsApi.prototype.asc_addImage                        = function()
	{
		var t = this;
		AscCommon.ShowImageFileDialog(this.documentId, this.documentUserId, this.CoAuthoringApi.get_jwt(), function(error, files)
		{
			t._uploadCallback(error, files);
		}, function(error)
		{
			if (c_oAscError.ID.No !== error)
			{
				t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
			}
			t.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
		});
	};
	baseEditorsApi.prototype._uploadCallback                     = function(error, files)
	{
		var t = this;
		if (c_oAscError.ID.No !== error)
		{
			this.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
		}
		else
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			AscCommon.UploadImageFiles(files, this.documentId, this.documentUserId, this.CoAuthoringApi.get_jwt(), function(error, url)
			{
				if (c_oAscError.ID.No !== error)
				{
					t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
				}
				else
				{
					t._addImageUrl(url);
				}
				t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			});
		}
	};

	//метод, который подменяет callback загрузки в каждом редакторе, TODO: переделать, сделать одинаково в о всех редакторах
	baseEditorsApi.prototype.asc_replaceLoadImageCallback = function(fCallback)
	{
	};

	baseEditorsApi.prototype.asc_loadLocalImageAndAction = function(sLocalImage, fCallback)
	{
		var _loadedUrl = this.ImageLoader.LoadImage(AscCommon.getFullImageSrc2(sLocalImage), 1);
		if (_loadedUrl != null)
		    fCallback(_loadedUrl);
        else
        	this.asc_replaceLoadImageCallback(fCallback);
	};

	baseEditorsApi.prototype.asc_checkImageUrlAndAction = function(sImageUrl, fCallback)
	{
		var oThis = this;
		this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
		var fCallback2 = function()
		{
			oThis.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			fCallback.apply(oThis, arguments);
		};
		var sLocalImage = AscCommon.g_oDocumentUrls.getImageLocal(sImageUrl);
		if (sLocalImage)
		{
			this.asc_loadLocalImageAndAction(sLocalImage, fCallback2);
			return;
		}

		AscCommon.sendImgUrls(oThis, [sImageUrl], function(data)
		{
			if (data[0] && data[0].path != null)
			{
				oThis.asc_loadLocalImageAndAction(AscCommon.g_oDocumentUrls.imagePath2Local(data[0].path), fCallback2);
			}
		}, this.editorId === c_oEditorId.Spreadsheet);
	};

	baseEditorsApi.prototype.asc_addOleObject = function(oPluginData)
	{
		if(this.isViewMode){
			return;
		}
		Asc.CPluginData_wrap(oPluginData);
		var oThis      = this;
		var sImgSrc    = oPluginData.getAttribute("imgSrc");
		var nWidthPix  = oPluginData.getAttribute("widthPix");
		var nHeightPix = oPluginData.getAttribute("heightPix");
		var fWidth     = oPluginData.getAttribute("width");
		var fHeight    = oPluginData.getAttribute("height");
		var sData      = oPluginData.getAttribute("data");
		var sGuid      = oPluginData.getAttribute("guid");
		if (typeof sImgSrc === "string" && sImgSrc.length > 0 && typeof sData === "string"
			&& typeof sGuid === "string" && sGuid.length > 0
			&& AscFormat.isRealNumber(nWidthPix) && AscFormat.isRealNumber(nHeightPix)
			&& AscFormat.isRealNumber(fWidth) && AscFormat.isRealNumber(fHeight)
		)

			this.asc_checkImageUrlAndAction(sImgSrc, function(oImage)
			{
				oThis.asc_addOleObjectAction(AscCommon.g_oDocumentUrls.getImageLocal(oImage.src), sData, sGuid, fWidth, fHeight, nWidthPix, nHeightPix);
			});
	};

	baseEditorsApi.prototype.asc_editOleObject = function(oPluginData)
	{
		if(this.isViewMode){
			return;
		}
		Asc.CPluginData_wrap(oPluginData);
		var oThis      = this;
		var bResize    = oPluginData.getAttribute("resize");
		var sImgSrc    = oPluginData.getAttribute("imgSrc");
		var oOleObject = AscCommon.g_oTableId.Get_ById(oPluginData.getAttribute("objectId"));
		var nWidthPix  = oPluginData.getAttribute("widthPix");
		var nHeightPix = oPluginData.getAttribute("heightPix");
		var sData      = oPluginData.getAttribute("data");
		if (typeof sImgSrc === "string" && sImgSrc.length > 0 && typeof sData === "string"
			&& oOleObject && AscFormat.isRealNumber(nWidthPix) && AscFormat.isRealNumber(nHeightPix))
		{
			this.asc_checkImageUrlAndAction(sImgSrc, function(oImage)
			{
				oThis.asc_editOleObjectAction(bResize, oOleObject, AscCommon.g_oDocumentUrls.getImageLocal(oImage.src), sData, nWidthPix, nHeightPix);
			});
		}
	};

	baseEditorsApi.prototype.asc_addOleObjectAction = function(sLocalUrl, sData, sApplicationId, fWidth, fHeight)
	{
	};

	baseEditorsApi.prototype.asc_editOleObjectAction = function(bResize, oOleObject, sImageUrl, sData, nPixWidth, nPixHeight)
	{
	};


	baseEditorsApi.prototype.asc_startEditCurrentOleObject = function(){

	};
	// Version History
	baseEditorsApi.prototype.asc_showRevision   = function(newObj)
	{
	};
	baseEditorsApi.prototype.asc_undoAllChanges = function()
	{
	};
	/**
	 * Эта функция возвращает true, если есть изменения или есть lock-и в документе
	 */
	baseEditorsApi.prototype.asc_isDocumentCanSave = function()
	{
		return this.isDocumentCanSave;
	};
	// Offline mode
	baseEditorsApi.prototype.asc_isOffline  = function()
	{
		return (window.location.protocol.indexOf("file") == 0) ? true : false;
	};
	baseEditorsApi.prototype.asc_getUrlType = function(url)
	{
		return AscCommon.getUrlType(url);
	};

	baseEditorsApi.prototype.openDocument  = function()
	{
	};
	baseEditorsApi.prototype.onEndLoadFile = function(result)
	{
		if (result)
		{
			this.openResult = result;
		}
		if (this.isLoadFullApi && this.openResult)
		{
			this.openDocument(this.openResult);
		}

	};
	baseEditorsApi.prototype._onEndLoadSdk = function()
	{
		// init drag&drop
		var t = this;
		AscCommon.InitDragAndDrop(this.HtmlElement, function(error, files)
		{
			t._uploadCallback(error, files);
		});

		AscFonts.g_fontApplication.Init();

		this.FontLoader  = AscCommon.g_font_loader;
		this.ImageLoader = AscCommon.g_image_loader;
		this.FontLoader.put_Api(this);
		this.ImageLoader.put_Api(this);
		this.FontLoader.SetStandartFonts();

		this.chartTranslate        = this.chartTranslate ? this.chartTranslate : new Asc.asc_CChartTranslate();
		this.textArtTranslate      = this.textArtTranslate ? this.textArtTranslate : new Asc.asc_TextArtTranslate();
		this.chartPreviewManager   = new AscCommon.ChartPreviewManager();
		this.textArtPreviewManager = new AscCommon.TextArtPreviewManager();

		AscFormat.initStyleManager();

		if (null !== this.tmpFocus)
		{
			this.asc_enableKeyEvents(this.tmpFocus);
		}

		this.pluginsManager     = Asc.createPluginsManager(this);

		if (!window['IS_NATIVE_EDITOR']) {
			setInterval(function() {t._autoSave();}, 40);
		}
	};

	baseEditorsApi.prototype.sendStandartTextures = function()
	{
	    if (this.isSendStandartTextures)
	        return;

	    this.isSendStandartTextures = true;

		var _count = AscCommon.g_oUserTexturePresets.length;
		var arr    = new Array(_count);
		for (var i = 0; i < _count; ++i)
		{
			arr[i]       = new AscCommon.asc_CTexture();
			arr[i].Id    = i;
			arr[i].Image = AscCommon.g_oUserTexturePresets[i];
			this.ImageLoader.LoadImage(AscCommon.g_oUserTexturePresets[i], 1);
		}

		this.sendEvent('asc_onInitStandartTextures', arr);
	};

	baseEditorsApi.prototype.sendMathToMenu = function ()
	{
		if (this.MathMenuLoad)
			return;
		// GENERATE_IMAGES
		//var _MathPainter = new CMathPainter(this.m_oWordControl.m_oApi);
		//_MathPainter.StartLoad();
		//return;
		var _MathPainter = new AscFormat.CMathPainter(this);
		_MathPainter.Generate();
		this.MathMenuLoad = true;
	};

	baseEditorsApi.prototype.sendMathTypesToMenu         = function(_math)
	{
		this.sendEvent("asc_onMathTypes", _math);
	};

	baseEditorsApi.prototype.asyncFontEndLoaded_MathDraw = function(Obj)
	{
		this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
		Obj.Generate2();
	};

	baseEditorsApi.prototype.sendColorThemes = function (theme) {
		var result = AscCommon.g_oUserColorScheme.slice();

		// theme colors
		var elem, _c;
		var _extra = theme.extraClrSchemeLst;
		var _count = _extra.length;
		var _rgba = {R: 0, G: 0, B: 0, A: 255};
		for (var i = 0; i < _count; ++i) {
			var _scheme = _extra[i].clrScheme;

			elem = new AscCommon.CAscColorScheme();
			elem.name = _scheme.name;

			_scheme.colors[8].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[8].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[12].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[12].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[9].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[9].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[13].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[13].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[0].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[0].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[1].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[1].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[2].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[2].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[3].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[3].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[4].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[4].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[5].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[5].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[11].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[11].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

			_scheme.colors[10].Calculate(theme, null, null, null, _rgba);
			_c = _scheme.colors[10].RGBA;
			elem.colors.push(new AscCommon.CColor(_c.R, _c.G, _c.B));

            result.push(elem)
		}

		this.sendEvent("asc_onSendThemeColorSchemes", result);
		return result;
	};

	// plugins
	baseEditorsApi.prototype.asc_pluginsRegister   = function(basePath, plugins)
	{
		if (null != this.pluginsManager)
			this.pluginsManager.register(basePath, plugins);
	};
	baseEditorsApi.prototype.asc_pluginRun         = function(guid, variation, pluginData)
	{
		if (null != this.pluginsManager)
			this.pluginsManager.run(guid, variation, pluginData);
	};
	baseEditorsApi.prototype.asc_pluginResize      = function(pluginData)
	{
		if (null != this.pluginsManager)
			this.pluginsManager.runResize(pluginData);
	};
	baseEditorsApi.prototype.asc_pluginButtonClick = function(id)
	{
		if (null != this.pluginsManager)
			this.pluginsManager.buttonClick(id);
	};

	baseEditorsApi.prototype.asc_pluginEnableMouseEvents = function(isEnable)
	{
		if (!this.pluginsManager)
			return;

		var _pluginData = new Asc.CPluginData();
		_pluginData.setAttribute("type", "enableMouseEvent");
		_pluginData.setAttribute("isEnabled", isEnable);

		this.pluginsManager.sendMessage(_pluginData);
	};

	// Builder
	baseEditorsApi.prototype.asc_nativeInitBuilder = function()
	{
		this.asc_setDocInfo(new Asc.asc_CDocInfo());
	};
	baseEditorsApi.prototype.asc_SetSilentMode     = function()
	{
	};
	baseEditorsApi.prototype.asc_canPaste          = function()
	{
		return false;
	};
	baseEditorsApi.prototype.asc_Recalculate       = function()
	{
	};

	// input
	baseEditorsApi.prototype.Begin_CompositeInput = function()
	{
	};
	baseEditorsApi.prototype.Add_CompositeText = function(nCharCode)
	{
	};
	baseEditorsApi.prototype.Remove_CompositeText = function(nCount)
	{
	};
	baseEditorsApi.prototype.Replace_CompositeText = function(arrCharCodes)
	{
	};
	baseEditorsApi.prototype.Set_CursorPosInCompositeText = function(nPos)
	{
	};
	baseEditorsApi.prototype.Get_CursorPosInCompositeText = function()
	{
	};
	baseEditorsApi.prototype.End_CompositeInput = function()
	{
	};
	baseEditorsApi.prototype.Get_MaxCursorPosInCompositeText = function()
	{
	};
	baseEditorsApi.prototype.Input_UpdatePos = function()
	{
	};
	baseEditorsApi.prototype.asc_InputClearKeyboardElement = function()
	{
		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.nativeFocusElement = null;
	};

	baseEditorsApi.prototype.onKeyDown = function(e)
	{
	};
	baseEditorsApi.prototype.onKeyPress = function(e)
	{
	};
	baseEditorsApi.prototype.onKeyUp = function(e)
	{
	};
	baseEditorsApi.prototype.pre_Paste = function(_fonts, _images, callback)
	{
	};

	baseEditorsApi.prototype.asc_Remove = function()
	{
		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.emulateKeyDownApi(46);
	};

	// System input
	baseEditorsApi.prototype.SetTextBoxInputMode = function(bIsEnable)
	{
		AscCommon.TextBoxInputMode = bIsEnable;
		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.systemInputEnable(AscCommon.TextBoxInputMode);
	};
	baseEditorsApi.prototype.GetTextBoxInputMode = function()
	{
		return AscCommon.TextBoxInputMode;
	};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommon']                = window['AscCommon'] || {};
	window['AscCommon'].baseEditorsApi = baseEditorsApi;
})(window);
