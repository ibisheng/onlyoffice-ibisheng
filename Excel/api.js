/** @define {boolean} */
var ASC_SPREADSHEET_API_CO_AUTHORING_ENABLE = true;

var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";
(
	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {


		var asc = window["Asc"];
		var asc_CCollaborativeEditing = asc.CCollaborativeEditing;
		var asc_CAdjustPrint = asc.asc_CAdjustPrint;
		var asc_user  = asc.asc_CUser;
		var asc_CAscEditorPermissions = asc.asc_CAscEditorPermissions;
		var asc_CTrackFile = asc.CTrackFile;
		var prot;


		function spreadsheet_api(name, inputName, eventsController, eventsHandlers, options) {
			/************ private!!! **************/
			this.HtmlElementName = name;
			this.topLineEditorName = inputName;

			if ("function" === typeof(eventsController)) {
				var prot = eventsController.prototype;
				prot.init = prot["init"];
				prot.destroy = prot["destroy"];
				prot.enableKeyEventsHandler = prot["enableKeyEventsHandler"];
				prot.reinitializeScroll = prot["reinitializeScroll"];
				prot.scrollVertical = prot["scrollVertical"];
				prot.scrollHorizontal = prot["scrollHorizontal"];

				this.controller = new eventsController();
			} else {
				this.controller	= new asc.asc_CEventsController();
			}

			this.handlers = new asc.asc_CHandlersList(eventsHandlers);
			this.options = options;
			// Вид печати
			this.adjustPrint = null;
			// Рассчитанные данные для печати
			this.printPagesData = null;

			this.isMobileVersion = false;

			this.fontRenderingMode = c_oAscFontRenderingModeType.hintingAndSubpixeling;
			this.wb = null;
			this.wbModel = null;

			this.FontLoader = window.g_font_loader;
			this.FontLoader.put_Api(this);

			this.FontLoader.SetStandartFonts();
			this.LoadedObject = null;
			this.DocumentType = 0; // 0 - empty, 1 - test, 2 - document (from json)

			this.DocumentName = "";
			this.documentId = undefined;
			this.documentUrl = "null";
			this.documentTitle = "null";
			this.documentTitleWithoutExtention = "null";
			this.documentFormat = "null";
			this.documentVKey = null;
			this.documentOrigin = "";
			this.documentFormatSave = c_oAscFileType.XLSX;
			this.documentFormatSaveCsvCodepage = 65001;//utf8
			this.documentFormatSaveCsvDelimiter = c_oAscCsvDelimiter.Comma;
			this.cCharDelimiter = String.fromCharCode(5);
			this.chartEditor = undefined;
			this.documentOpenOptions = undefined;		// Опции при открытии (пока только опции для CSV)
			this.DocInfo = null;

			// объекты, нужные для отправки в тулбар (шрифты, стили)
			this.guiFonts = null;		// Переменная для сохранения фонтов для облегченной версии (переход в edit mod)
			this.guiStyles = null;		// Переменная для сохранения стилей ячеек
			this._gui_control_colors = null;
			this._gui_color_schemes = null;
			this.GuiControlColorsMap = null;
			this.IsSendStandartColors = false;

			this.tablePictures = null;  
			
			this.asyncMethodCallback = undefined;

			// Тип состояния на данный момент (сохранение, открытие или никакое)
			this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
			// Переменная отвечает, загрузились ли фонты
			this.FontLoadWaitComplete = false;
			// Переменная отвечает, получили ли мы ответ с сервера совместного редактирования
			this.ServerIdWaitComplete = false;
			// Переменная отвечает, отрисовали ли мы все (иначе при рестарте, получится переинициализация)
			this.DocumentLoadComplete = false;
			// Переменная, которая отвечает, послали ли мы окончание открытия документа
			this.IsSendDocumentLoadCompleate = false;

			// CoAuthoring and Chat
			this.User = undefined;
			this.CoAuthoringApi = new CDocsCoApi();
			this.collaborativeEditing = null;
			this.isCoAuthoringEnable = true;

			// AutoSave
			this.autoSaveGap = 0;				// Интервал автосохранения (0 - означает, что автосохранения нет) в милесекундах
			this.autoSaveTimeOutId = null;		// Идентификатор таймаута
			this.isAutoSave = false;			// Флаг, означает что запущено автосохранение
			this.autoSaveGapAsk = 5000;			// Константа для повторного запуска автосохранения, если не смогли сделать сразу lock (только при автосохранении) в милесекундах

			this.canSave = true;				//Флаг нужен чтобы не происходило сохранение пока не завершится предыдущее сохранение
			
			// Режим вставки диаграмм в редакторе документов
			this.isChartEditor = false;
			if(typeof ChartStyleManager !== "undefined")
				this.chartStyleManager = new ChartStyleManager();
			if(typeof ChartPreviewManager !== "undefined")
				this.chartPreviewManager = new ChartPreviewManager();
			
			// Chart
			this.chartTranslate = new asc_CChartTranslate();
			
			// Shapes
			this.isStartAddShape = false;
			this.ImageLoader = window.g_image_loader;
			this.ImageLoader.put_Api(this);
			this.shapeElementId = null;
			this.isImageChangeUrl = false;
			this.isShapeImageChangeUrl = false;
			
			//находится ли фокус в рабочей области редактора(используется для copy/paste в MAC)
			this.IsFocus = null;
			/**************************************/

			this.OpenDocumentProgress = {
				Type: c_oAscAsyncAction.Open,
				FontsCount: 0,
				CurrentFont: 0,
				ImagesCount: 0,
				CurrentImage: 0
			};
			
			// На этапе сборки значение переменной ASC_DOCS_API_USE_EMBEDDED_FONTS может менятся.
			// По дефолту встроенные шрифты использоваться не будут, как и при любом значении
			// ASC_DOCS_API_USE_EMBEDDED_FONTS, кроме "true"(написание от регистра не зависит).
			
			// Использовать ли обрезанные шрифты
			this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());
			
			this.TrackFile = null;
			
			var oThis = this;
			if ("undefined" != typeof(FileReader) && "undefined" != typeof(FormData)) {
				//var element = document.body;
				var element = document.getElementById(this.HtmlElementName);
				if(null != element)
				{
					element["ondragover"] = function(e) {
						e.preventDefault();
						if(CanDropFiles(e))
							e.dataTransfer.dropEffect = 'copy';
						else
							e.dataTransfer.dropEffect = 'none';
						return false;
					};
					element["ondrop"] = function(e) {
						e.preventDefault();
						var files = e.dataTransfer.files;
						var nError = ValidateUploadImage(files);
						if(c_oAscServerError.NoError == nError)
						{
							var worksheet = null;
							if(null != oThis.wbModel)
								worksheet = oThis.wbModel.getWorksheet(oThis.wbModel.getActive());
							if(null != worksheet)
							{
								oThis.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
								var file = files[0];
								var xhr = new XMLHttpRequest();
								var fd = new FormData();
								fd.append('file', file);
								xhr.open('POST', g_sUploadServiceLocalUrl+'?key=' + oThis.documentId + '&sheetId=' + worksheet.getId());
								xhr.onreadystatechange = function(){
									if(4 == this.readyState)
									{
										if((this.status == 200 || this.status == 1223))
										{
											var frameWindow = GetUploadIFrame();
											var content = this.responseText;
											frameWindow.document.open();
											frameWindow.document.write(content);
											frameWindow.document.close();
										}
										else
											oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
										oThis.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
									}
								};
								xhr.send(fd);
							}
						}
						else
							oThis.handlers.trigger("asc_onError", oThis.asc_mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
					}
				}
			}
		}

		spreadsheet_api.prototype = {
		
			asc_CheckGuiControlColors : function() {
				// потом реализовать проверку на то, что нужно ли посылать

				var arr_colors = new Array(10);
				var _count = arr_colors.length;
				for (var i = 0; i < _count; ++i)
				{
					var color = g_oColorManager.getThemeColor(i);
					arr_colors[i] = new CColor(color.getR(), color.getG(), color.getB());
				}

				// теперь проверим
				var bIsSend = false;
				if (this.GuiControlColorsMap != null)
				{
					for (var i = 0; i < _count; ++i)
					{
						var _color1 = this.GuiControlColorsMap[i];
						var _color2 = arr_colors[i];

						if ((_color1.r !== _color2.r) || (_color1.g !== _color2.g) || (_color1.b !== _color2.b))
						{
							bIsSend = true;
							break;
						}
					}
				}
				else
				{
					this.GuiControlColorsMap = new Array(_count);
					bIsSend = true;
				}

				if (bIsSend)
				{
					for (var i = 0; i < _count; ++i)
					{
						this.GuiControlColorsMap[i] = arr_colors[i];
					}

					this.asc_SendControlColors();
				}
			},
			
			asc_SendControlColors : function() {
				var standart_colors = null;
				if (!this.IsSendStandartColors)
				{
					var _c_s = g_oStandartColors.length;
					standart_colors = new Array(_c_s);

					for (var i = 0; i < _c_s; ++i)
					{
						standart_colors[i] = new CColor(g_oStandartColors[i]["R"], g_oStandartColors[i]["G"], g_oStandartColors[i]["B"]);
					}

					this.IsSendStandartColors =  true;
				}

				var _count = this.GuiControlColorsMap.length;

				var _ret_array = new Array(_count * 6);
				var _cur_index = 0;

				for (var i = 0; i < _count; ++i)
				{
					for(var j = 0, length = g_oThemeColorTint[i].length; j < length; ++j)
					{
						var tint = g_oThemeColorTint[i][j];
						var color = g_oColorManager.getThemeColor(i, tint);
						_ret_array[_cur_index] = new CColor(color.getR(), color.getG(), color.getB());
						_cur_index++;
					}
				}

				this.asc_SendThemeColors(_ret_array, standart_colors);
			},
			
			asc_SendThemeColorScheme : function() {
				var infos = new Array();
				var _index = 0;

				var _c = null;

				// user scheme
				var _count_defaults = g_oUserColorScheme.length;
				for (var i = 0; i < _count_defaults; ++i)
				{
					var _obj = g_oUserColorScheme[i];
					infos[_index] = new CAscColorScheme();
					infos[_index].Name = _obj["name"];

					_c = _obj["dk1"];
					infos[_index].Colors[0] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["lt1"];
					infos[_index].Colors[1] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["dk2"];
					infos[_index].Colors[2] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["lt2"];
					infos[_index].Colors[3] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent1"];
					infos[_index].Colors[4] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent2"];
					infos[_index].Colors[5] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent3"];
					infos[_index].Colors[6] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent4"];
					infos[_index].Colors[7] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent5"];
					infos[_index].Colors[8] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["accent6"];
					infos[_index].Colors[9] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["hlink"];
					infos[_index].Colors[10] = new CColor(_c["R"], _c["G"], _c["B"]);

					_c = _obj["folHlink"];
					infos[_index].Colors[11] = new CColor(_c["R"], _c["G"], _c["B"]);

					++_index;
				}

				// theme colors
				var _theme = this.wbModel.theme;
				var _extra = _theme.extraClrSchemeLst;
				var _count = _extra.length;
				var _rgba = {R:0, G: 0, B: 0, A: 255};
				for (var i = 0; i < _count; ++i)
				{
					var _scheme = _extra[i].clrScheme;

					infos[_index] = new CAscColorScheme();
					infos[_index].Name = _scheme.name;

					_scheme.colors[8].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[8].RGBA;
					infos[_index].Colors[0] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[12].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[12].RGBA;
					infos[_index].Colors[1] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[9].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[9].RGBA;
					infos[_index].Colors[2] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[13].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[13].RGBA;
					infos[_index].Colors[3] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[0].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[0].RGBA;
					infos[_index].Colors[4] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[1].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[1].RGBA;
					infos[_index].Colors[5] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[2].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[2].RGBA;
					infos[_index].Colors[6] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[3].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[3].RGBA;
					infos[_index].Colors[7] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[4].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[4].RGBA;
					infos[_index].Colors[8] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[5].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[5].RGBA;
					infos[_index].Colors[9] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[11].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[11].RGBA;
					infos[_index].Colors[10] = new CColor(_c.R, _c.G, _c.B);

					_scheme.colors[10].Calculate(_theme, null, null, null, _rgba);
					_c = _scheme.colors[10].RGBA;
					infos[_index].Colors[11] = new CColor(_c.R, _c.G, _c.B);

					_index++;
				}

				this.asc_SendThemeColorSchemes(infos);
			},

			asc_Init: function(fontsPath) {
				var t = this;
				asc["editor"] = ( asc["editor"] || t );
				t.FontLoader.fontFilesPath = fontsPath;
				t.asc_registerCallback("loadFonts", function (fonts, callback){t._loadFonts(fonts, callback);});
			},
			asc_setDocInfo: function (c_DocInfo) {
				if(c_DocInfo)
					this.DocInfo = c_DocInfo;			
			},
			asc_setLocale: function (val) {
			},
			asc_LoadDocument: function (c_DocInfo) {
				var t = this;
				
				this.asc_setDocInfo(c_DocInfo);
				
				if(this.DocInfo){
					this.documentId     		= this.DocInfo["Id"];
					this.documentUrl    		= this.DocInfo["Url"];
					this.documentTitle  		= this.DocInfo["Title"];
					this.documentFormat 		= this.DocInfo["Format"];
					this.documentVKey   		= this.DocInfo["VKey"];
					this.documentOrigin 		= this.DocInfo["Origin"];
					this.chartEditor			= this.DocInfo["ChartEditor"];
					this.documentOpenOptions 	= this.DocInfo["Options"];
					
					if(this.documentFormat)
					{
						switch(this.documentFormat)
						{
							case "xlsx" : this.documentFormatSave = c_oAscFileType.XLSX;break;
							case "xls"  : this.documentFormatSave = c_oAscFileType.XLS;break;
							case "ods"  : this.documentFormatSave = c_oAscFileType.ODS;break;
							case "csv"  : this.documentFormatSave = c_oAscFileType.CSV;break;
							case "htm"  :
							case "html" : this.documentFormatSave = c_oAscFileType.HTML;break;
						}
					}

					var nIndex = -1;
					if(this.documentTitle)
						nIndex = this.documentTitle.lastIndexOf(".");
					if(-1 != nIndex)
						this.documentTitleWithoutExtention = this.documentTitle.substring(0, nIndex);
					else
						this.documentTitleWithoutExtention = this.documentTitle;

					// Выставляем пользователя
					this.User = new asc_user();
					this.User.asc_setId(this.DocInfo["UserId"]);
					this.User.asc_setUserName(this.DocInfo["UserName"]);

					//Взято из редактора документов
					var sProtocol = window.location.protocol;
					var sHost = window.location.host;
					this.documentOrigin = "";
					if(sProtocol && sProtocol.length > 0)
						this.documentOrigin = sProtocol + "//" + sHost;
					else
						this.documentOrigin = sHost;
				}

                if (this.DocInfo["OfflineApp"] && (true == this.DocInfo["OfflineApp"])) {
                    this.isCoAuthoringEnable = false;

                    window['scriptBridge'] = {};
                    this.offlineModeInit();
                    this.offlineModeLoadDocument();
                    return;
                }

				this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
				if ( !this.chartEditor )
					this._asc_open(function (response) {t._startOpenDocument(response);});
			},
			
			asc_LoadEmptyDocument: function () {
				
				var emptyWorkbook = getEmptyWorkbook() + "";
				if	( emptyWorkbook.length && (c_oSerFormat.Signature === emptyWorkbook.substring(0, c_oSerFormat.Signature.length)) ) {
					this.isChartEditor = true;
					var wb = this.asc_OpenDocument("", emptyWorkbook);
					
					this._startOpenDocument({returnCode: 0, val:wb});
				}
			},
			
			asc_OpenDocument: function(url, data)
			{
				var wb = new Workbook(url, this.handlers, this);
				this.initGlobalObjects(wb);
				this.wbModel = wb;
				var oBinaryFileReader = new BinaryFileReader(url);
				oBinaryFileReader.Read(data, wb);
				return wb;
			},
			
			initGlobalObjects: function(wbModel)
			{
				// Histoey & global counters
				History = new CHistory(wbModel);

				g_oIdCounter = new CIdCounter();
				g_oTableId = new CTableId();
				if ( this.User )
					g_oIdCounter.Set_UserId(this.User.asc_getId());

				g_oUndoRedoCell = new UndoRedoCell(wbModel);
				g_oUndoRedoWorksheet = new UndoRedoWoorksheet(wbModel);
				g_oUndoRedoWorkbook = new UndoRedoWorkbook(wbModel);
				g_oUndoRedoCol = new UndoRedoRowCol(wbModel, false);
				g_oUndoRedoRow = new UndoRedoRowCol(wbModel, true);
				g_oUndoRedoComment = new UndoRedoComment(wbModel);
				g_oUndoRedoAutoFilters = new UndoRedoAutoFilters(wbModel);
				g_oUndoRedoGraphicObjects = new UndoRedoGraphicObjects(wbModel);
				g_oIdCounter.Set_Load(false);
			},
			
			asc_getEditorPermissions : function(){
				if (this.DocInfo && 
					this.DocInfo["Id"] &&
					this.DocInfo["Url"])
				{
					var t = this;
					var v = {};
					v["c"] = "getsettings";	
					v["id"] = this.DocInfo["Id"];
					v["format"] = this.DocInfo["Format"];
					v["vkey"] = this.DocInfo["VKey"];
					v["editorid"] = c_oEditorId.Excel;
					this._asc_sendCommand(function (response) {t._onGetEditorPermissions(response);}, v);
				}
				else
				{
					this.handlers.trigger("asc_onGetEditorPermissions", new asc_CAscEditorPermissions());
				}
			},
			
			asc_DownloadAs : function(typeFile){//передаем число соответствующее своему формату. например  c_oAscFileType.XLSX
                if (undefined != window['appBridge']) {
                    window['appBridge']['dummyCommandDownloadAs'] ();     // TEST
                    return;
                }

				this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
				var that = this;
				// Меняем тип состояния (на сохранение)
				this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
				this._asc_downloadAs(typeFile, function(incomeObject){
					if(null != incomeObject && "save" == incomeObject["type"])
						that.asc_processSavedFile(incomeObject["data"], false);
					// Меняем тип состояния (на никакое)
					that.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
					that.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
				}, true);
			},

			asc_Save : function (isAutoSave) {
                if (undefined != window['appBridge']) {
                    window['appBridge']['dummyCommandSave'] ();     // TEST
                    return;
                }

				if (!this.canSave || this.isChartEditor)
					return;

				// Не даем пользователю сохранять, пока не закончится сохранение
				this.canSave = false;
				this.isAutoSave = !!isAutoSave;
				if (!this.isAutoSave) {
					this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
					this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
				}
				// Нужно закрыть редактор
				this.asc_closeCellEditor();

				var t = this;
				this.CoAuthoringApi.askSaveChanges (function (e) { t.onSaveCallback (e); });
			},

			asc_OnSaveEnd : function (isDocumentSaved) {
				this.canSave = true;
				this.isAutoSave = false;
				this.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
				this.CoAuthoringApi.unSaveChanges();
				if (isDocumentSaved) {
					// Запускаем таймер автосохранения
					this.autoSaveInit();
				} else {
					this.CoAuthoringApi.disconnect();
				}
			},

			asc_Print: function(adjustPrint){
				if (adjustPrint)
					this.adjustPrint = adjustPrint;
				else {
					this.adjustPrint = new asc_CAdjustPrint();
				}

                if (undefined != window['appBridge']) {
                    this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
                    window['appBridge']['dummyCommandPrint'] ();
                    this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
                    return;
                }

				this.asc_DownloadAs(c_oAscFileType.PDFPRINT);
			},

			asc_Copy:function(){
				var result = this.wb.copyToClipboardButton();
				this.wb.restoreFocus();
				return result;
			},

			asc_Paste:function(){
				var result = this.wb.pasteFromClipboardButton();
				this.wb.restoreFocus();
				return result;
			},

			asc_Cut:function(){
				var result = this.wb.cutToClipboardButton();
				this.wb.restoreFocus();
				return result;
			},

			asc_Undo: function(){
				this.wb.undo();
				this.wb.restoreFocus();
			},

			asc_Redo: function(){
				this.wb.redo();
				this.wb.restoreFocus();
			},

			asc_Resize: function(){
				if (this.wb)
					this.wb.resize();
			},
			
			asc_addAutoFilter: function(lTable, addFormatTableOptionsObj){
				var ws = this.wb.getWorksheet();
				return ws.addAutoFilter(lTable, addFormatTableOptionsObj);
			},
			
			asc_applyAutoFilter: function(type,autoFilterObject){
				var ws = this.wb.getWorksheet();
				ws.applyAutoFilter(type,autoFilterObject);
			},
			
			asc_sortColFilter: function(type,cellId) {
				var ws = this.wb.getWorksheet();
				ws.sortColFilter(type,cellId);
			},
			
			asc_getAddFormatTableOptions: function () {
				var ws = this.wb.getWorksheet();
				return ws.getAddFormatTableOptions();
			},

			// Выставление интервала автосохранения (0 - означает, что автосохранения нет)
			asc_setAutoSaveGap: function (autoSaveGap) {
				if (typeof autoSaveGap === "number") {
					this.autoSaveGap = autoSaveGap * 1000; // Нам выставляют в секундах
					this.autoSaveInit();
				}
			},
			
			asc_setMobileVersion: function (isMobile){
				this.isMobileVersion = isMobile;
				this.options = (this.options || {});
				this.options.worksheetDefaults = (this.options.worksheetDefaults || {});
				this.options.worksheetDefaults.isMobile = isMobile;
				window.g_isMobileVersion = isMobile;
			},

			asc_getViewerMode: function () {
				return this.controller.getViewerMode ? this.controller.getViewerMode() : true;
			},

			asc_setViewerMode: function (isViewerMode) {
				if (this.controller.setViewerMode) {
					this.controller.setViewerMode(isViewerMode);
					if (this.collaborativeEditing)
						this.collaborativeEditing.setViewerMode(isViewerMode);
					if (false === isViewerMode) {
						// Загружаем не обрезанные шрифты для полной версии (при редактировании)
						if (this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
							this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
							this.asyncMethodCallback = function () {};
							var fonts = $.map(this.wbModel.generateFontMap(), function (fname) {return new CFont(fname, 0, "", 0);});
							this.FontLoader.LoadDocumentFonts(fonts);
						}
						
						this.isUseEmbeddedCutFonts = false;

						// Отправка стилей
						this._sendWorkbookStyles();
						if ( this.wb )
							this.wb._initCommentsToSave();

						if (this.IsSendDocumentLoadCompleate && this.collaborativeEditing) {
							// Принимаем чужие изменения
							this.collaborativeEditing.applyChanges();
							// Пересылаем свои изменения
							this.collaborativeEditing.sendChanges();
						}
					}
				}
			},
			
			asc_setUseEmbeddedCutFonts: function (bUse) {
				this.isUseEmbeddedCutFonts = bUse;
			},

			asc_setCoAuthoringEnable: function (isCoAuthoringEnable) {
				this.isCoAuthoringEnable = !!isCoAuthoringEnable;
			},

			/*
				idOption идентификатор дополнительного параметра, пока c_oAscAdvancedOptionsID.CSV.
				option - какие свойства применить, пока массив. для CSV объект asc_CCSVAdvancedOptions(codepage, delimiter)
				exp:	asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV, new Asc.asc_CCSVAdvancedOptions(1200, c_oAscCsvDelimiter.Comma) );
			*/
			asc_setAdvancedOptions:function(idOption,option){
				var t = this;
				switch(idOption){
					case c_oAscAdvancedOptionsID.CSV:
						// Проверяем тип состояния в данный момент
						if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
							this.documentFormatSaveCsvCodepage = option.asc_getCodePage();
							this.documentFormatSaveCsvDelimiter = option.asc_getDelimiter();
							var v = {"id":this.documentId, "format": this.documentFormat, "vkey": this.documentVKey, "editorid": c_oEditorId.Speadsheet, "c":"reopen", "url": this.documentUrl, "title": this.documentTitle, "embeddedfonts": this.isUseEmbeddedCutFonts, "delimiter": option.asc_getDelimiter(), "codepage": option.asc_getCodePage()};
							this._asc_sendCommand(function (response) {t._startOpenDocument(response);}, v);
						} else if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Save)
							this._asc_downloadAs(c_oAscFileType.CSV, function(incomeObject){
								if(null != incomeObject && "save" == incomeObject["type"])
									t.asc_processSavedFile(incomeObject["data"], false);
								// Меняем тип состояния (на никакое)
								t.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
								t.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
							}, true, option);
					break;
				}
			},
			asc_processSavedFile: function(url, bInner)
			{
				if(bInner)
					this.handlers.trigger("asc_onSaveUrl", url, function(hasError){});
				else
				{
					getFile(url);
				}
			},
			// Опции страницы (для печати)
			asc_setPageOptions: function (options, index) {
				var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
				this.wbModel.getWorksheet(sheetIndex).PagePrintOptions = options;
			},

			asc_getPageOptions: function (index) {
				var sheetIndex = (undefined !== index && null !== index) ? index : this.wbModel.getActive();
				return this.wbModel.getWorksheet(sheetIndex).PagePrintOptions;
			},

			_asc_sendCommand: function (callback, rdata) {
				var sData;
				//json не должен превышать размера g_nMaxJsonLength, иначе при его чтении будет exception
				if(null != rdata["data"] && "string" === typeof(rdata["data"]) && rdata["data"].length > g_nMaxJsonLengthChecked)
				{
					var sTemp = rdata["data"];
					rdata["data"] = null;
					sData = "mnuSaveAs" + cCharDelimiter + JSON.stringify(rdata) + cCharDelimiter + sTemp;
				}
				else
					sData = JSON.stringify(rdata);
				var oThis = this;
				asc_ajax({
					type: 'POST',
					url: g_sMainServiceLocalUrl,
					data: sData,
					error: function(jqXHR, textStatus, errorThrown){
						var result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
						oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
						if(callback)
							callback(result);
					},
					success: function(msg){
						var result;
						if(!msg || msg.length < 1){
							result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
							oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
							if(callback)
								callback(result);
							return;
						}
						else{
							var incomeObject = JSON.parse(msg);
							switch( incomeObject["type"] ){
								case "open":
									var sJsonUrl = g_sResourceServiceLocalUrl + incomeObject["data"];
									asc_ajax({
										url: sJsonUrl,
										dataType: "text",
										success: function(result, textStatus) {
											//получаем url к папке с файлом
											var url;
											var nIndex = sJsonUrl.lastIndexOf("/");
											if(-1 !== nIndex)
												url = sJsonUrl.substring(0, nIndex + 1);
											else
												url = sJsonUrl;
											if( c_oSerFormat.Signature === result.substring(0, c_oSerFormat.Signature.length))
											{
												var wb = oThis.asc_OpenDocument(url, result);
												if (callback)
													callback({returnCode: 0, val:wb});
											}
											else
											{
												oResult = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
												oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
												if(callback)
													callback(oResult);
											}
										},
										error:function(){
											result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
											oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
											if(callback)
												callback(result);
										}
									});
									break;
								case "needparams":
									// Проверяем, возможно нам пришли опции для CSV
									if (oThis.documentOpenOptions) {
										var codePageCsv = oThis.documentOpenOptions["codePage"];
										var delimiterCsv = oThis.documentOpenOptions["delimiter"];
										if (null !== codePageCsv && undefined !== codePageCsv &&
											null !== delimiterCsv && undefined !== delimiterCsv) {
											oThis.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV,
												new asc.asc_CCSVAdvancedOptions(codePageCsv, delimiterCsv));
											break;
										}
									}
									asc_ajax({
										url: incomeObject["data"],
										dataType: "text",
										success: function(result, textStatus) {
											var cp = JSON.parse(result);
											oThis.handlers.trigger("asc_onAdvancedOptions",  new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV,cp), oThis.advancedOptionsAction);
											//var value = {url: oThis.documentUrl, delimiter: c_oAscCsvDelimiter.Comma, codepage: 65001}; //65001 - utf8
											//oThis._asc_sendCommand(callback, "opencsv", oThis.documentTitle, value);
										},
										error:function(){
											result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
											oThis.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
											if(callback)
												callback(result);
										}
									});
									break;
								case "getcodepage":
									// Проверяем, возможно нам пришли опции для CSV
									if (oThis.documentOpenOptions) {
										var codePageCsv = oThis.documentOpenOptions["codePage"];
										var delimiterCsv = oThis.documentOpenOptions["delimiter"];
										if (null !== codePageCsv && undefined !== codePageCsv &&
											null !== delimiterCsv && undefined !== delimiterCsv) {
											oThis.asc_setAdvancedOptions(c_oAscAdvancedOptionsID.CSV,
												new asc.asc_CCSVAdvancedOptions(codePageCsv, delimiterCsv));
											break;
										}
									}
									var cp = JSON.parse(incomeObject["data"]);
									oThis.handlers.trigger("asc_onAdvancedOptions",  new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV,cp), oThis.advancedOptionsAction);
									//var value = {url: oThis.documentUrl, delimiter: c_oAscCsvDelimiter.Comma, codepage: 65001}; //65001 - utf8
									//oThis._asc_sendCommand(callback, "opencsv", oThis.documentTitle, value);
									break;
								case "save":
									if(callback)
										callback(incomeObject);
									break;
								case "waitopen":
									var rData = {"id":oThis.documentId, "format": oThis.documentFormat, "vkey": oThis.documentVKey, "editorid": c_oEditorId.Spreadsheet, "c":"chopen"};
									setTimeout(function(){oThis._asc_sendCommand(callback, rData);}, 3000);
									break;
								case "waitsave":
									var rData = {"id": oThis.documentId, "vkey": oThis.documentVKey, "title": oThis.documentTitleWithoutExtention, "c": "chsave", "data": incomeObject["data"]};
									setTimeout(function(){oThis._asc_sendCommand(callback, rData);}, 3000);
									break;
								case "savepart":
									var outputData = JSON.parse(incomeObject["data"]);
									oThis._asc_downloadAs(outputData["format"], callback, false, null, outputData["savekey"]);
									break;
								case "getsettings":
									if(callback)
										callback(incomeObject);
									break;									
								case "err":
									var nErrorLevel = c_oAscError.Level.NoCritical;
									//todo передалеть работу с callback
									if("getsettings" == rdata["c"] || "open" == rdata["c"] || "chopen" == rdata["c"] || "create" == rdata["c"])
										nErrorLevel = c_oAscError.Level.Critical;
									result = {returnCode: nErrorLevel, val:parseInt(incomeObject["data"])};
									oThis.handlers.trigger("asc_onError", oThis.asc_mapAscServerErrorToAscError(parseInt(incomeObject["data"])), nErrorLevel);
									if(callback)
										callback(result);
									break;
								default:
									if(callback)
										callback(incomeObject);
									break;
							}
						}
					},
					dataType: "text"});
			},
			
			_asc_sendTrack: function (callback, url, rdata) {
				var oThis = this;
				asc_ajax({
					type: 'POST',
					url: url,
					data: rdata,
					error: function(jqXHR, textStatus, errorThrown){
						var result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
						if(callback)
							callback(result);
					},
					success: function(msg){
						var result;
						if(!msg || msg.length < 1){
							result = {returnCode: c_oAscError.Level.Critical, val:c_oAscError.ID.Unknown};
							if(callback)
								callback(result);
							return;
						}
						else{
							var incomeObject = JSON.parse(msg);

							if(callback)
								callback(incomeObject);
						}
					},
					dataType: "text"});
			},
			
			
			_asc_open: function (fCallback) { //fCallback({returnCode:"", val:obj, ...})
				if ( this.chartEditor ) {
				} else if (!this.documentId || !this.documentUrl) {
					var data = getTestWorkbook();
					var sData = data + "";
					if( c_oSerFormat.Signature === sData.substring(0, c_oSerFormat.Signature.length))
					{
						var sUrlPath = "offlinedocs/test-workbook9/";
						var wb = this.asc_OpenDocument(sUrlPath, sData);
						fCallback({returnCode: 0, val:wb});
					}
				}
				else {
					if(this.documentOpenOptions && this.documentOpenOptions["isEmpty"])
					{
						var sEmptyWorkbook = getEmptyWorkbook();
						var v = {"id":this.documentId, "format": this.documentFormat, "vkey": this.documentVKey, "editorid": c_oEditorId.Speadsheet, "c":"create", "url": this.documentUrl, "title": this.documentTitle, "embeddedfonts": this.isUseEmbeddedCutFonts, "data": sEmptyWorkbook};
						this._asc_sendCommand (fCallback, v);
						var wb = this.asc_OpenDocument(g_sResourceServiceLocalUrl + this.documentId + "/", sEmptyWorkbook);
						fCallback({returnCode: 0, val:wb});
					}
					else
					{
						// Меняем тип состояния (на открытие)
						this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Open;
						var v = {"id":this.documentId, "format": this.documentFormat, "vkey": this.documentVKey, "editorid": c_oEditorId.Speadsheet, "c":"open", "url": this.documentUrl, "title": this.documentTitle, "embeddedfonts": this.isUseEmbeddedCutFonts};
						this._asc_sendCommand (fCallback, v);
					}
				}
			},

			_asc_save: function () {
				var that = this;
				this.wb._initCommentsToSave();
				var oBinaryFileWriter = new BinaryFileWriter(this.wbModel);
				var data = oBinaryFileWriter.Write();
				var oAdditionalData = new Object();
				oAdditionalData["c"] = "save";
				oAdditionalData["id"] = this.documentId;
				oAdditionalData["vkey"] = this.documentVKey;
				oAdditionalData["outputformat"] = this.documentFormatSave;
				if(c_oAscFileType.CSV == this.documentFormatSave)
				{
					oAdditionalData["codepage"] = this.documentFormatSaveCsvCodepage;
					oAdditionalData["delimiter"] = this.documentFormatSaveCsvDelimiter;
				}
				oAdditionalData["innersave"] = true;
				oAdditionalData["savetype"] = "completeall";
				oAdditionalData["data"] = data;
				this._asc_sendCommand (/*callback*/ function(incomeObject){
					if(null != incomeObject && "save" == incomeObject["type"])
						that.asc_processSavedFile(incomeObject["data"], true);
				}, oAdditionalData);
			},

			_asc_downloadAs: function (sFormat, fCallback, bStart, options, sSaveKey) { //fCallback({returnCode:"", ...})
				//sFormat: xlsx, xls, ods, csv, html
				var oAdditionalData = new Object();
				oAdditionalData["c"] = "save";
				oAdditionalData["id"] = this.documentId;
				oAdditionalData["vkey"] = this.documentVKey;
				oAdditionalData["outputformat"] = sFormat;
				if(null != sSaveKey)
					oAdditionalData["savekey"] = sSaveKey;
				var data;
				if(c_oAscFileType.PDFPRINT === sFormat)
				{
					if (null === this.printPagesData) {
						// Рассчитываем данные о страницах
						this.printPagesData = this.wb.calcPagesPrint(this.adjustPrint);
					}

					var pdf_writer = new CPdfPrinter(this.wbModel.sUrlPath);
					var isEndPrint = this.wb.printSheet(pdf_writer, this.printPagesData);

					data = pdf_writer.DocumentRenderer.Memory.GetBase64Memory();

					if (isEndPrint) {
						// Закончили печатить
						if (bStart) {
							// Первый раз отправляем данные
							oAdditionalData["savetype"] = "completeall";
						} else {
							// Не в первый раз отправляем данные
							oAdditionalData["savetype"] = "complete";
						}
						// Очищаем данные о печати
						this.printPagesData = null;
					} else {
						// Продолжаем печать
						if (bStart) {
							// Первый раз отправляем данные
							oAdditionalData["savetype"] = "partstart";
						} else {
							// Не в первый раз отправляем данные
							oAdditionalData["savetype"] = "part";
						}
					}
				} else if (c_oAscFileType.CSV === sFormat && !options) {
					var v = {"id":this.documentId, "vkey": this.documentVKey, "c":"getcodepage"};
					return this._asc_sendCommand (fCallback, v);
				} else {
					this.wb._initCommentsToSave();
					var oBinaryFileWriter = new BinaryFileWriter(this.wbModel);
					oAdditionalData["savetype"] = "completeall";
					if (c_oAscFileType.CSV === sFormat) {
						if (options instanceof asc.asc_CCSVAdvancedOptions) {
							oAdditionalData["codepage"] = options.asc_getCodePage();
							oAdditionalData["delimiter"] = options.asc_getDelimiter();
						}
					}
					data = oBinaryFileWriter.Write();

                    if (undefined != window['appBridge']) {
                        window['appBridge']['dummyCommandSave_CSV'] (data);
                        this.asc_OnSaveEnd(true);
                        return;
                    }
				}
				oAdditionalData["data"] = data;
				this._asc_sendCommand (fCallback, oAdditionalData);
			},


			asc_getDocumentName: function () {
				return this.documentTitle;
			},

			asc_getDocumentFormat: function () {
				return this.documentFormat;
			},

			asc_isDocumentModified: function () {
				if (!this.canSave) {
					// Пока идет сохранение, мы не закрываем документ
					return true;
				} else if (History && History.Is_Modified) {
					return History.Is_Modified();
				}
				return false;
			},


			// Actions and callbacks interface

			/*
			 * asc_onStartAction			(type, id)
			 * asc_onEndAction				(type, id)
			 * asc_onInitEditorFonts		(gui_fonts)
			 * asc_onInitEditorStyles		(gui_styles)
			 * asc_onOpenDocumentProgress	(_OpenDocumentProgress)
			 * asc_onAdvancedOptions		(asc_CAdvancedOptions, ascAdvancedOptionsAction)			- эвент на получение дополнительных опций (открытие/сохранение CSV)
			 * asc_onError					(c_oAscError.ID, c_oAscError.Level)
			 * asc_onEditCell				(c_oAscCellEditorState)										- эвент на редактирование ячейки с состоянием (переходами из формулы и обратно)
			 * asc_onCellTextChanged		(text, cursorPosition, isFormula, formulaPos, formulaName)
			 * asc_onSelectionChanged		(asc_CCellInfo);											- эвент на смену информации о выделении
			 * asc_onSelectionNameChanged	(sName);													- эвент на смену имени выделения (Id-ячейки, число выделенных столбцов/строк, имя диаграммы и др.)
			 * asc_onSelectionMathChanged	(asc_CSelectionMathInfo);									- эвент на смену математической информации о выделении
			 * asc_onZoomChanged			(zoom)
			 * asc_onSheetsChanged			()															- эвент на обновление списка листов
			 * asc_onActiveSheetChanged		(indexActiveSheet)											- эвент на обновление активного листа
			 * asc_onCanUndoChanged			(bCanUndo)													- эвент на обновление возможности undo
			 * asc_onCanRedoChanged			(bCanRedo)													- эвент на обновление возможности redo
			 * asc_onSaveUrl				(sUrl, callback(hasError))									- эвент на сохранение файла на сервер по url
			 * asc_onDocumentModifiedChanged(bIsModified)												- эвент на обновление статуса "изменен ли файл"
			 * asc_onMouseMove				(asc_CMouseMoveData)										- эвент на наведение мышкой на гиперлинк или комментарий
			 * asc_onHyperlinkClick			(sUrl)														- эвент на нажатие гиперлинка
			 * asc_onСoAuthoringDisconnect	()															- эвент об отключении от сервера без попытки reconnect
			 * asc_onSelectionRangeChanged	(selectRange)												- эвент о выборе диапазона для диаграммы (после нажатия кнопки выбора)
			 * asc_onRenameCellTextEnd		(countCellsFind, countCellsReplace)							- эвент об окончании замены текста в ячейках (мы не можем сразу прислать ответ)
			 * asc_onWorkbookLocked			(result)													- эвент залочена ли работа с листами или нет
			 * asc_onWorksheetLocked		(index, result)												- эвент залочен ли лист или нет
			 * asc_onGetEditorPermissions	(permission)												- эвент о правах редактора.
			 */

			asc_StartAction: function (type, id) {
				this.handlers.trigger("asc_onStartAction", type, id);
				//console.log("asc_onStartAction: type = " + type + " id = " + id);
			},

			asc_EndAction: function (type, id) {
				this.handlers.trigger("asc_onEndAction", type, id);
				//console.log("asc_onEndAction: type = " + type + " id = " + id);
			},

			asc_registerCallback: function (name, callback, replaceOldCallback) {
				this.handlers.add(name, callback, replaceOldCallback);

				/*
				 Не самая хорошая схема для отправки эвентов:
				 проверяем, подписан ли кто-то на эвент? Если да, то отправляем и больше ничего не делаем.
				 Если никто не подписан, то сохраняем у себя переменную и как только кто-то подписывается - отправляем ее
				 */
				if (null !== this.guiFonts && "asc_onInitEditorFonts" === name) {
					this.handlers.trigger("asc_onInitEditorFonts", this.guiFonts);
					this.guiFonts = null;
				} else if (null !== this.guiStyles && "asc_onInitEditorStyles" === name) {
					this.handlers.trigger("asc_onInitEditorStyles", this.guiStyles);
					this.guiStyles = null;
				} else if (null !== this.tablePictures && "asc_onInitTablePictures" === name) {
					this.handlers.trigger("asc_onInitTablePictures", this.tablePictures);
					this.tablePictures = null;
				} else if (null !== this._gui_control_colors && "asc_onSendThemeColors" === name) {
					this.handlers.trigger("asc_onSendThemeColors", this._gui_control_colors.Colors, this._gui_control_colors.StandartColors);
					this._gui_control_colors = null;
				} else if (null !== this._gui_color_schemes && "asc_onSendThemeColorSchemes" === name) {
					this.handlers.trigger("asc_onSendThemeColorSchemes", this._gui_color_schemes);
					this._gui_color_schemes = null;
				} else if ("asc_onInitEditorShapes" === name) {
					this.handlers.trigger("asc_onInitEditorShapes", g_oAutoShapesGroups, g_oAutoShapesTypes);
				} else if ("asc_onInitStandartTextures" === name) {
					var _count = g_oUserTexturePresets.length;
					var arr = new Array(_count);
					for (var i = 0; i < _count; ++i) {
						arr[i] = new asc_CTexture();
						arr[i].Id = i;
						arr[i].Image = g_oUserTexturePresets[i];
						this.ImageLoader.LoadImage(g_oUserTexturePresets[i], 1);
					}
					
					this.handlers.trigger("asc_onInitStandartTextures", arr);
				}
			},

			asc_unregisterCallback: function (name, callback) {
				this.handlers.remove(name, callback);
			},

			asc_getController: function() {
				return this.controller;
			},

			// Посылает эвент о том, что обновились листы
			sheetsChanged: function () {
				this.handlers.trigger("asc_onSheetsChanged");
			},


			// Fonts loading interface

			sync_InitEditorFonts: function (gui_fonts) {
				/*
				 Не самая хорошая схема для отправки эвентов:
				 проверяем, подписан ли кто-то на эвент? Если да, то отправляем и больше ничего не делаем.
				 Если никто не подписан, то сохраняем у себя переменную и как только кто-то подписывается - отправляем ее
				 */
				if (false === this.handlers.trigger("asc_onInitEditorFonts", gui_fonts))
					this.guiFonts = gui_fonts;
				else
					this.guiFonts = null;
			},

			asyncFontsDocumentStartLoaded: function () {
				this.OpenDocumentProgress.Type = c_oAscAsyncAction.LoadDocumentFonts;
				this.OpenDocumentProgress.FontsCount = this.FontLoader.fonts_loading.length;
				this.OpenDocumentProgress.CurrentFont = 0;
				this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);
			},

			asyncFontsDocumentEndLoaded: function () {
				this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

				if (this.asyncMethodCallback !== undefined) {
					this.asyncMethodCallback();
					this.asyncMethodCallback = undefined;
				} else {
					// Шрифты загрузились, возможно стоит подождать совместное редактирование
					this.FontLoadWaitComplete = true;
					if (this.ServerIdWaitComplete)
						this._openDocumentEndCallback();
				}
			},

			asyncFontStartLoaded: function () {
				this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
			},

			asyncFontEndLoaded: function (font) {
				this.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
			},

			SendOpenProgress: function () {
				var _OpenDocumentProgress = {
				"Type": this.OpenDocumentProgress.Type,
				"FontsCount": this.OpenDocumentProgress.FontsCount,
				"CurrentFont": this.OpenDocumentProgress.CurrentFont,
				"ImagesCount": this.OpenDocumentProgress.ImagesCount,
				"CurrentImage": this.OpenDocumentProgress.CurrentImage
				};
				this.handlers.trigger("asc_onOpenDocumentProgress", _OpenDocumentProgress);

                if (undefined != window['appBridge']) {
                    var progress = (this.OpenDocumentProgress.CurrentFont +
                        this.OpenDocumentProgress.CurrentImage) /
                        (this.OpenDocumentProgress.ImagesCount + this.OpenDocumentProgress.FontsCount);

                    window['appBridge']['dummyCommandOpenDocumentProgress'] (progress * 100);
                }
			},

			IsNeedDefaultFonts: function () {
				return false;
			},

			_loadFonts: function (fonts, callback) {
				this.asyncMethodCallback = callback;
				this.FontLoader.LoadDocumentFonts2(fonts.map(function(f){return {name: f};}));
			},

			_startOpenDocument: function (response) {
				if (response.returnCode !== 0) {return;}

				this.wbModel = response.val;

				// Начинаем соединение для совместного редактирования
				this.asyncServerIdStartLoaded();
				var fonts = $.map(this.wbModel.generateFontMap(), function (fname) {return new CFont(fname, 0, "", 0);});
				this.FontLoader.LoadDocumentFonts(fonts);

				// Какая-то непонятная заглушка, чтобы не падало в ipad
				if (this.isMobileVersion) {
					window.USER_AGENT_SAFARI_MACOS = false;
					PASTE_ELEMENT_ID = "wrd_pastebin";
					ELEMENT_DISPAY_STYLE = "none";
				}
				
				 if (window.USER_AGENT_SAFARI_MACOS)
					setInterval(SafariIntervalFocus, 10);
			},
			
			_onGetEditorPermissions: function(response) {
				if(null != response && "getsettings" == response.type){
					var oSettings = JSON.parse(response.data);
					
					//Set up coauthoring and spellcheker service
					window.g_cAscCoAuthoringUrl = oSettings['g_cAscCoAuthoringUrl'];
					window.g_cAscSpellCheckUrl = oSettings['g_cAscSpellCheckUrl'];
					
					var oEditorPermissions = new asc_CAscEditorPermissions(oSettings);
					
					this.handlers.trigger("asc_onGetEditorPermissions", oEditorPermissions);
												
					if(undefined != oSettings['trackingInfo'] &&
						null != oSettings['trackingInfo'])
					{
						this.TrackFile = new asc_CTrackFile(oSettings['trackingInfo']);
						
						this.TrackFile.setDocId(this.DocInfo.Id);
						this.TrackFile.setUserId(this.DocInfo.UserId);
						
						var oThis = this;
						var _sendTrack = function(callback, url, data){
							return oThis._asc_sendTrack(callback, url, data);
						};
						
						this.TrackFile.setTrackFunc(_sendTrack);
						
						var _isDocumentModified = function(){
							return oThis.asc_isDocumentModified()
						};
						
						this.TrackFile.setIsDocumentModifiedFunc(_isDocumentModified);
						
						if(undefined != oSettings['TrackingInterval'] &&
							null != oSettings['TrackingInterval'])
							this.TrackFile.setInterval(oSettings['TrackingInterval']);
							
						this.TrackFile.Start();							
					}
				}
			},

			// Стартуем соединение с сервером для совместного редактирования
			asyncServerIdStartLoaded: function() {
				//Инициализируем контрол для совместного редактирования
				this._coAuthoringInit();
			},

			// Соединились с сервером
			asyncServerIdEndLoaded: function(){
				// С сервером соединились, возможно стоит подождать загрузку шрифтов
				this.ServerIdWaitComplete = true;
				if (this.FontLoadWaitComplete)
					this._openDocumentEndCallback();
			},

			// Эвент о пришедщих изменениях
			syncCollaborativeChanges: function () {
				this.handlers.trigger("asc_onCollaborativeChanges");
			},

			// Применение изменений документа, пришедших при открытии
			// Их нужно применять после того, как мы создали WorkbookView
			// т.к. автофильтры, диаграммы, изображения и комментарии завязаны на WorksheetView (ToDo переделать)
			_applyFirstLoadChanges: function () {
				if (this.IsSendDocumentLoadCompleate)
					return;
				if (this.collaborativeEditing.applyChanges()) {
					// Изменений не было
					this.IsSendDocumentLoadCompleate = true;
					this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
				} else {
					// При открытии после принятия изменений мы должны сбросить пересчетные индексы
					this.collaborativeEditing.sendChanges();
				}
			},

			/////////////////////////////////////////////////////////////////////////
			///////////////////CoAuthoring and Chat api//////////////////////////////
			/////////////////////////////////////////////////////////////////////////
			_coAuthoringInit: function() {
				var t = this;

				if (undefined !== window['g_cAscCoAuthoringUrl'])
					window.g_cAscCoAuthoringUrl = window['g_cAscCoAuthoringUrl'];
				if (undefined !== window.g_cAscCoAuthoringUrl) {
					//Turn off CoAuthoring feature if it disabled
					if(!t.isCoAuthoringEnable)
						window.g_cAscCoAuthoringUrl = "";

					// Если есть в настройках сервер, то выставляем его для соединения
					t._coAuthoringSetServerUrl(window.g_cAscCoAuthoringUrl);
				}

				//Если User не задан, отключаем коавторинг.
				if (null == t.User || null == t.User.asc_getId()) {
					t.User = new asc_user();
					t.User.asc_setId("Unknown");
					t.User.asc_setUserName("Unknown");
					t._coAuthoringSetServerUrl("");
				}

				this.collaborativeEditing = new asc_CCollaborativeEditing(/*handlers*/{
					"askLock":							function () {t.CoAuthoringApi.askLock.apply(t.CoAuthoringApi, arguments);},
					"releaseLocks":						function () {t.CoAuthoringApi.releaseLocks.apply(t.CoAuthoringApi, arguments);},
					"sendChanges":						function () {t._onSaveChanges.apply(t, arguments);},
					"applyChanges":						function () {t._onApplyChanges.apply(t, arguments);},
					"updateAfterApplyChanges":			function () {t._onUpdateAfterApplyChanges.apply(t, arguments);},
					"drawSelection":					function () {t._onDrawSelection.apply(t, arguments);},
					"updateAllSheetsLock":				function () {t._onUpdateAllSheetsLock.apply(t, arguments);},
					"showDrawingObjects":				function () {t._onShowDrawingObjects.apply(t, arguments);},
					"resetLockedGraphicObjects":		function () {t._onResetLockedGraphicObjects.apply(t, arguments);},
					"tryResetLockedGraphicObject":		function () {return t._onTryResetLockedGraphicObject.apply(t, arguments);},
					"showComments":						function () {t._onShowComments.apply(t, arguments);},
					"unlockComments":					function () {t._onUnlockComments.apply(t);},
					"tryUnlockComment":					function () {t._onTryUnlockComment.apply(t, arguments);},
					"cleanSelection":					function () {t._onCleanSelection.apply(t, arguments);}
				}, this.asc_getViewerMode());

				if (!this.CoAuthoringApi) {
					this.asyncServerIdEndLoaded ();
					return; // Error
				}
				this.CoAuthoringApi.onParticipantsChanged   	= function (e) { t.handlers.trigger("asc_onParticipantsChanged", e); };
				this.CoAuthoringApi.onAuthParticipantsChanged  	= function (e) { t.handlers.trigger("asc_onAuthParticipantsChanged", e ); };
				this.CoAuthoringApi.onMessage               	= function (e) { t.handlers.trigger("asc_onCoAuthoringChatReceiveMessage", e ); };
				this.CoAuthoringApi.onConnectionStateChanged	= function (e) { t.handlers.trigger("asc_onConnectionStateChanged", e ); };
				this.CoAuthoringApi.onLocksAcquired				= function (e) {
					if ( 2 != e["state"] )
					{
						var elementValue = e["blockValue"];
						var lockElem = t.collaborativeEditing.getLockByElem (elementValue, c_oAscLockTypes.kLockTypeOther);
						if (null === lockElem) {
							lockElem = new asc.CLock (elementValue);
							t.collaborativeEditing.addUnlock (lockElem);
						}

						if (null != lockElem) {
							var oldType = lockElem.getType();
							if (c_oAscLockTypes.kLockTypeOther2 === oldType || c_oAscLockTypes.kLockTypeOther3 === oldType)
								lockElem.setType (c_oAscLockTypes.kLockTypeOther3, true);
							else
								lockElem.setType (c_oAscLockTypes.kLockTypeOther, true);

							// Выставляем ID пользователя, залочившего данный элемент
							lockElem.setUserId (e["user"]);
						}

						if (t.wb) {
							// Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно заблокировать toolbar
							t.wb._onWSSelectionChanged(/*info*/null);

							// Шлем update для листов
							t._onUpdateSheetsLock(lockElem);

							var ws = t.wb.getWorksheet();
							ws.cleanSelection();
							ws._drawSelection();
						}
					}
				};
				this.CoAuthoringApi.onLocksReleased				= function (e, bChanges) {
					var element = e["block"];
					var lockElem = t.collaborativeEditing.getLockByElem (element, c_oAscLockTypes.kLockTypeOther);
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
						} else if (curType === c_oAscLockTypes.kLockTypeOther2 || curType === c_oAscLockTypes.kLockTypeOther3)
							newType = c_oAscLockTypes.kLockTypeOther2;

						if (t.wb) {
							t.wb.getWorksheet().cleanSelection();
						}

						if (c_oAscLockTypes.kLockTypeNone !== newType)
							lockElem.setType (newType, true);
						else {
							// Удаляем из lock-ов, тот, кто правил ушел и не сохранил
							t.collaborativeEditing.removeUnlock (lockElem);
							
							if ( lockElem.Element["type"] == c_oAscLockTypeElem.Object )
								t._onTryResetLockedGraphicObject(lockElem.Element["rangeOrObjectId"]);
						}

						if (t.wb) {
							// Шлем update для листов
							t._onUpdateSheetsLock(lockElem);
						}
					}
				};
				this.CoAuthoringApi.onLocksReleasedEnd			= function () {
					if (t.wb) {
						// Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно сбросить блокировку toolbar
						t.wb._onWSSelectionChanged(/*info*/null);

						var worksheet = t.wb.getWorksheet();
						worksheet._drawSelection();
						worksheet.objectRender.showDrawingObjects(true);
						worksheet.cellCommentator.unlockComments();
					}
				};
				this.CoAuthoringApi.onSaveChanges				= function (e, bSendEvent) {
					// bSendEvent = false - это означает, что мы загружаем имеющиеся изменения при открытии
					var bAddChanges = false;
					var nCount = e.length;
					var nIndex = 0;
					var oElement = null;
					var oRecalcIndexColumns = null, oRecalcIndexRows = null;
					for (; nIndex < nCount; ++nIndex) {
						oElement = e[nIndex];
						if ("string" === typeof oElement) {
							t.collaborativeEditing.addChanges(oElement);
							bAddChanges = true;
						} else if (false !== bSendEvent && "object" === typeof oElement) {
							if ("0" === oElement["type"]) {
								// Это мы получили recalcIndexColumns
								oRecalcIndexColumns = t.collaborativeEditing.addRecalcIndex(oElement["type"], oElement["index"]);
							} else if ("1" === oElement["type"]) {
								// Это мы получили recalcIndexRows
								oRecalcIndexRows = t.collaborativeEditing.addRecalcIndex(oElement["type"], oElement["index"]);
							}
						}

						// Теперь нужно пересчитать индексы для lock-элементов
						if (null !== oRecalcIndexColumns && null !== oRecalcIndexRows) {
							t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeMine, oRecalcIndexColumns, oRecalcIndexRows);
							t.collaborativeEditing._recalcLockArray(c_oAscLockTypes.kLockTypeOther, oRecalcIndexColumns, oRecalcIndexRows);

							oRecalcIndexColumns = null;
							oRecalcIndexRows = null;
						}
					}

					// т.е. если bSendEvent не задан, то посылаем  сообщение + если мы уже открыли документ
					if (true === bAddChanges && false !== bSendEvent && t.IsSendDocumentLoadCompleate)
						t.syncCollaborativeChanges();
				};
				this.CoAuthoringApi.onFirstLoadChanges			= function (e) {
					t.CoAuthoringApi.onSaveChanges(e, false);
					t.asyncServerIdEndLoaded ();
				};
				this.CoAuthoringApi.onSetIndexUser				= function (e) {
                    g_oIdCounter.Set_UserId("" + e);
				};
				this.CoAuthoringApi.onStartCoAuthoring			= function (isStartEvent) {
					t.startCollaborationEditing();

					// На старте не нужно ничего делать
					if (!isStartEvent) {
						// Принимаем чужие изменения
						t.collaborativeEditing.applyChanges();
						// Пересылаем свои изменения
						t.collaborativeEditing.sendChanges();
					}
				};
				/**
				 * Event об отсоединении от сервера
				 * @param {jQuery} e  event об отсоединении с причиной
				 * @param {Bool} isDisconnectAtAll  окончательно ли отсоединяемся(true) или будем пробовать сделать reconnect(false) + сами отключились
				 * @param {Bool} isCloseCoAuthoring
				 */
				this.CoAuthoringApi.onDisconnect				= function (e, isDisconnectAtAll, isCloseCoAuthoring) {
					if (0 === t.CoAuthoringApi.get_state())
						t.asyncServerIdEndLoaded();
					if (isDisconnectAtAll) {
						// Посылаем наверх эвент об отключении от сервера
						t.handlers.trigger("asc_onСoAuthoringDisconnect");
						// И переходим в режим просмотра т.к. мы не можем сохранить таблицу
						t.asc_setViewerMode(true);
						if (!isCloseCoAuthoring) {
							t.handlers.trigger("asc_onError", c_oAscError.ID.CoAuthoringDisconnect, c_oAscError.Level.NoCritical);
						}
					}
				};

				this.CoAuthoringApi.init (t.User, t.documentId, 'fghhfgsjdgfjs', window.location.host, g_sMainServiceLocalUrl, function(){
				}, c_oEditorId.Speadsheet);
			},

			// Set CoAuthoring server url
			_coAuthoringSetServerUrl: function(url){
				if (!this.CoAuthoringApi)
					return; // Error

				this.CoAuthoringApi.set_url(url);
			},

			_onSaveChanges: function (recalcIndexColumns, recalcIndexRows) {
				if (this.IsSendDocumentLoadCompleate) {
					var arrChanges = this.wbModel.SerializeHistory();
					arrChanges.push({"index" : recalcIndexColumns, "type" : "0"});
					arrChanges.push({"index" : recalcIndexRows, "type" : "1"});
					this.CoAuthoringApi.saveChanges(arrChanges);
				}
			},

			_onApplyChanges: function (changes, fCallback) {
				this.wbModel.DeserializeHistory(changes, fCallback);
			},

			_onUpdateAfterApplyChanges: function () {
				if (!this.IsSendDocumentLoadCompleate) {
					this.IsSendDocumentLoadCompleate = true;
					this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
				}

				if (this.wb) {
					this.wb.getWorksheet().cellCommentator.unlockComments();
					// Нужно послать обновить свойства (иначе для удаления данных не обновится строка формул).
					// ToDo Возможно стоит обновлять только строку формул
					this.wb._onWSSelectionChanged(null);

					this.wb.getWorksheet().updateVisibleRange();
				}
			},

			_onCleanSelection: function () {
				if (this.wb)
					this.wb.getWorksheet().cleanSelection();
			},

			_onDrawSelection: function () {
				if (this.wb)
					this.wb.getWorksheet()._drawSelection();
			},

			_onUpdateAllSheetsLock: function () {
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
			},
			
			_onShowDrawingObjects: function () {
				if (this.wb) {
					this.wb.getWorksheet().objectRender.showDrawingObjects(true);
				}
			},
			
			_onResetLockedGraphicObjects: function () {
				if (this.wb) {
					this.wb.getWorksheet().objectRender.resetLockedGraphicObjects();
				}
			},
			
			_onTryResetLockedGraphicObject: function (id) {
				if (this.wb) {
					return this.wb.getWorksheet().objectRender.tryResetLockedGraphicObject(id);
				}
				return false;
			},
			
			_onShowComments: function () {
				if (this.wb) {
					this.wb.getWorksheet().cellCommentator.drawCommentCells();
				}
			},
			
			_onUnlockComments: function () {
				if (this.wb) {
					var ws = this.wb.getWorksheet();
					ws.cellCommentator.unlockComments();
				}
			},
			
			_onTryUnlockComment: function (id) {
				if (this.wb) {
					var ws = this.wb.getWorksheet();
					ws.cellCommentator.tryUnlockComment(id);
				}
			},

			_onUpdateSheetsLock: function (lockElem) {
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
			},

			_sendWorkbookStyles: function () {
				if(this.wbModel) {
					// Отправка стилей форматированных таблиц
					var tablePictures = this.wb.getTablePictures();
					var bResult = this.handlers.trigger("asc_onInitTablePictures", tablePictures);
					this.tablePictures = (false === bResult) ? tablePictures : null;

					// Отправка стилей ячеек
					var guiStyles = this.wb.getCellStyles();
					bResult = this.handlers.trigger("asc_onInitEditorStyles", guiStyles);
					this.guiStyles = (false === bResult) ? guiStyles : null;
				}
			},

			startCollaborationEditing: function () {
				// Начинаем совместное редактирование
				this.collaborativeEditing.startCollaborationEditing();
			},

			// End Load document
			_openDocumentEndCallback: function () {
				// Не инициализируем дважды
				if (this.DocumentLoadComplete)
					return;

				this.wb = new asc.WorkbookView(
					this.wbModel,
					this.controller,
					this.handlers,
					$("#" + this.HtmlElementName),
					$("#" + this.topLineEditorName),
					this,
					this.collaborativeEditing,
					this.fontRenderingMode,
					this.options);

				this.DocumentLoadComplete = true;
				
				this.asc_CheckGuiControlColors();
				this.asc_SendThemeColorScheme();
				this.asc_ApplyColorScheme(false);
				
				// Применяем пришедшие при открытии изменения
				this._applyFirstLoadChanges();
				// Меняем тип состояния (на никакое)
				this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;

				//this.asc_Resize(); // Убрал, т.к. сверху приходит resize (http://bugzserver/show_bug.cgi?id=14680)
				if( this.wbModel.startActionOn == false ){
					this.wbModel.startActionOn = true;
				} else {
					var t = this;
					setTimeout(function(){t.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc)},500);
				}

                if (undefined != window['appBridge']) {
                    window['appBridge']['dummyCommandOpenDocumentProgress'] (10000);
                }

				// Запускаем таймер автосохранения
				this.autoSaveInit();
			},

			// Переход на диапазон в листе
			_asc_setWorksheetRange: function (val) {
				// Получаем sheet по имени
				var ws = this.wbModel.getWorksheetByName (val.asc_getSheet());
				if (!ws || ws.getHidden())
					return;
				// Индекс листа
				var sheetIndex = ws.getIndex();
				// Если не совпали индекс листа и индекс текущего, то нужно сменить
				if (this.asc_getActiveWorksheetIndex() !== sheetIndex) {
					// Меняем активный лист
					this.asc_showWorksheet (sheetIndex);
					// Посылаем эвент о смене активного листа
					this.handlers.trigger ("asc_onActiveSheetChanged", sheetIndex);
				}
				var range = ws.getRange2 (val.asc_getRange());
				if (null !== range) {
					this.wb._onSetSelection (range.getBBox0(), /*validRange*/ true);
				}
			},

			onSaveCallback: function (e) {
				var t = this;
				var nState;
				if (false == e["savelock"]) {
					if (this.isAutoSave) {
						this.asc_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
						this.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
					}

					// Принимаем чужие изменения
					t.collaborativeEditing.applyChanges();

					// Сохраняем файл на сервер
					this._asc_save();

					// Cбросим флаги модификации
					History.Save();

					// Пересылаем, только если началось совместное редактирование, чтобы не отключилось undo
					if (this.collaborativeEditing.getCollaborativeEditing()) {
						// Пересылаем свои изменения
						this.collaborativeEditing.sendChanges();
						// Шлем update для toolbar-а, т.к. когда select в lock ячейке нужно заблокировать toolbar
						this.wb._onWSSelectionChanged(/*info*/null);
					}

					// Заканчиваем сохранение, т.к. мы хотим дать пользователю продолжать набирать документ
					// Но сохранять до прихода ответа от сервера не сможет
					this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
				} else {
					nState = t.CoAuthoringApi.get_state();
					if (3 === nState) {
						// Отключаемся от сохранения, соединение потеряно
						if (!this.isAutoSave) {
							this.asc_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
							this.asc_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
						}
						this.isAutoSave = false;
						this.canSave = true;
					} else {
						// Если автосохранение, то не будем ждать ответа, а просто перезапустим таймер на немного
						if (this.isAutoSave) {
							this.isAutoSave = false;
							this.canSave = true;
							this.autoSaveInit(this.autoSaveGapAsk);
							return;
						}

						setTimeout(function () {
							t.CoAuthoringApi.askSaveChanges(function (event) {
								// Функция может быть долгой (и в IE10 происходит disconnect). Поэтому вызовем через timeout
								window.setTimeout(function () {
									t.onSaveCallback(event);
								}, 10);
							});
						}, 1000);
					}
				}
			},

			_getIsLockObjectSheet: function (lockInfo, callback) {
				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					if ($.isFunction(callback)) {callback(true);}
					return;
				}

				if (false === this.collaborativeEditing.getCollaborativeEditing()) {
					// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
					if ($.isFunction(callback)) {callback(true);}
					callback = undefined;
				}
				if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
					// Редактируем сами
					if ($.isFunction(callback)) {callback(true);}
					return;
				} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
					// Уже ячейку кто-то редактирует
					if ($.isFunction(callback)) {callback(false);}
					return;
				}

				this.collaborativeEditing.onStartCheckLock();
				this.collaborativeEditing.addCheckLock(lockInfo);
				this.collaborativeEditing.onEndCheckLock(callback);
			},

			// Toolbar interface

			/*asc_getEditorFonts: function () {
				var _tmp = this.guiFonts;
				this.guiFonts = null;
				return _tmp;
			},

			asc_getThemeColorSchemes: function () {
				var _tmp = this._gui_color_schemes;
				this._gui_color_schemes = null;
				return _tmp;
			},

			asc_getEditorShapes: function () {
				return [g_oAutoShapesGroups, g_oAutoShapesTypes];
			},

			asc_getStandartTextures: function () {
				var _count = g_oUserTexturePresets.length;
				var arr = new Array(_count);
				for (var i = 0; i < _count; ++i) {
					arr[i] = new asc_CTexture();
					arr[i].Id = i;
					arr[i].Image = g_oUserTexturePresets[i];
					this.ImageLoader.LoadImage(g_oUserTexturePresets[i], 1);
				}

				return arr;
			},*/
			
			// Workbook interface

			asc_getWorksheetsCount: function () {
				return this.wbModel.getWorksheetCount();
			},

			asc_getWorksheetName: function (index) {
				return this.wbModel.getWorksheet(index).getName();
			},

			asc_getActiveWorksheetIndex: function () {
				return this.wbModel.getActive();
			},
			
			asc_getActiveWorksheetId: function () {
				var activeIndex = this.wbModel.getActive();
				return this.wbModel.getWorksheet(activeIndex).getId();
			},
			
			asc_getWorksheetId: function (index) {
				return this.wbModel.getWorksheet(index).getId();
			},

			asc_isWorksheetHidden: function (index) {
				return this.wbModel.getWorksheet(index).getHidden();
			},

			// Залочена ли работа с листом
			asc_isWorksheetLockedOrDeleted: function (index) {
				var ws = this.wbModel.getWorksheet(index);
				var sheetId = null;
				if (null === ws || undefined === ws)
					sheetId = this.asc_getActiveWorksheetId();
				else
					sheetId = ws.getId();

				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					return false;
				}

				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
				// Проверим, редактирует ли кто-то лист
				return (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
					c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false));
			},

			// Залочена ли работа с листами
			asc_isWorkbookLocked: function () {
				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					return false;
				}

				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, null, null);
				// Проверим, редактирует ли кто-то лист
				return (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
					c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false));
			},

			asc_getHiddenWorksheets: function () {
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
			},

			asc_showWorksheet: function (index) {
				if (typeof index === "number" && undefined !== index && null !== index) {
					var t = this;
					var ws = this.wbModel.getWorksheet(index);
					var isHidden = ws.getHidden();
					var showWorksheetCallback = function (res) {
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
					}
					else
						showWorksheetCallback(true);
				}
			},

			asc_showActiveWorksheet: function () {
				this.wb.showWorksheet(this.wbModel.getActive());
			},

			asc_hideWorksheet: function () {
				var t = this;
				// Колличество листов
				var countWorksheets = this.asc_getWorksheetsCount();
				// Колличество скрытых листов
				var arrHideWorksheets = this.asc_getHiddenWorksheets();
				var countHideWorksheets = arrHideWorksheets.length;
				// Вдруг остался один лист
				if (countWorksheets <= countHideWorksheets + 1)
					return false;

				var model = this.wbModel;
				// Активный лист
				var activeWorksheet = model.getActive();
				var sheetId = this.wbModel.getWorksheet(activeWorksheet).getId();
				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

				var hideWorksheetCallback = function (res) {
					if (res) {
						t.wbModel.getWorksheet(activeWorksheet).setHidden(true);
					}
				};

				this._getIsLockObjectSheet(lockInfo, hideWorksheetCallback);
				return true;
			},

			asc_renameWorksheet: function (name) {
				// Проверка глобального лока
				if (this.collaborativeEditing.getGlobalLock())
					return false;

				var i = this.wbModel.getActive();
				var sheetId = this.wbModel.getWorksheet(i).getId();
				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

				var t = this;
				var renameCallback = function (res) {
					if (res) {
						t.wbModel.getWorksheet(i).setName(name);
					}
				};

				this._getIsLockObjectSheet(lockInfo, renameCallback);
				return true;
			},

			asc_addWorksheet: function () {
				var active = this.wbModel.createWorksheet();
				this.asc_showWorksheet (active);
				// Посылаем callback об изменении списка листов
				this.sheetsChanged();
			},

			asc_insertWorksheet: function (name) {
				var i = this.wbModel.getActive();
				var j = this.wbModel.createWorksheet(i, name);
				this.wb.spliceWorksheet(i, 0, null);
				this.asc_showWorksheet (i);
				// Посылаем callback об изменении списка листов
				this.sheetsChanged();
			},

			// Удаление листа
			asc_deleteWorksheet: function () {
				// Проверка глобального лока
				if (this.collaborativeEditing.getGlobalLock())
					return false;

				var i = this.wbModel.getActive();
				var activeName = this.wbModel.getWorksheet(i).sName;
				var sheetId = this.wbModel.getWorksheet(i).getId();
				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);

				var t = this;
				var deleteCallback = function (res) {
					if (res) {
						
						History.Create_NewPoint();
						History.StartTransaction();
						
						// Нужно проверить все диаграммы, ссылающиеся на удаляемый лист
						for (var key in t.wb.wsViews) {
							var ws = t.wb.wsViews[key];
							ws.objectRender.updateChartReferences(activeName, ws.model.sName);
						}
						
						// Удаляем Worksheet и получаем новый активный индекс (-1 означает, что ничего не удалилось)
						var activeNow = t.wbModel.removeWorksheet(i);
						if (-1 !== activeNow){
							t.wb.removeWorksheet(i);
							t.asc_showWorksheet(activeNow);
							// Посылаем callback об изменении списка листов
							t.sheetsChanged();
						}
						
						History.EndTransaction();
					}
				};

				this._getIsLockObjectSheet(lockInfo, deleteCallback);
				return true;
			},

			asc_moveWorksheet: function (where) {
				var i = this.wbModel.getActive();
				var d = i < where ? +1 : -1;
				// Мы должны поместить слева от заданного значения, поэтому если идем вправо, то вычтем 1
				if (1 === d)
					where -= 1;

				this.wb.replaceWorksheet(i, where);
				this.wbModel.replaceWorksheet(i, where);

				// Обновим текущий номер
				this.asc_showWorksheet(where);
				// Посылаем callback об изменении списка листов
				this.sheetsChanged();
			},

			asc_copyWorksheet: function (where, newName) {
				var scale = this.asc_getZoom();
				var i = this.wbModel.getActive();

				// ToDo уйти от lock для листа при копировании
				var sheetId = this.wbModel.getWorksheet(i).getId();
				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
				var t = this;
				var copyWorksheet = function (res) {
					if (res) {
						t.wb._initCommentsToSave();
						t.wbModel.copyWorksheet(i, where, newName);
						t.wb.copyWorksheet(i, where);
						// Делаем активным скопированный
						t.asc_showWorksheet(where);
						t.asc_setZoom(scale);
						// Посылаем callback об изменении списка листов
						t.sheetsChanged();
					}
				};

				this._getIsLockObjectSheet(lockInfo, copyWorksheet);
			},

			asc_cleanSelection: function(){
				this.wb.getWorksheet().cleanSelection();
			},

			asc_getZoom: function () {
				return this.wb.getZoom();
			},

			asc_setZoom: function (scale) {
				this.wb.changeZoom(scale);
			},

			asc_enableKeyEvents: function (isEnabled) {
				if (this.wb)
					this.wb.enableKeyEventsHandler(isEnabled);
				//наличие фокуса в рабочей области редактора(используется для copy/paste в MAC)
				this.IsFocus = isEnabled;
			},

            asc_searchEnabled: function(bIsEnabled)
            {
            },

			asc_findText: function (text, scanByRows, scanForward, isMatchCase, isWholeCell) {
				var d = this.wb.findCellText({text: text, scanByRows: scanByRows, scanForward: scanForward,
					isMatchCase: isMatchCase, isWholeCell: isWholeCell, isNotSelect: false});
				if (d) {
					if (d.deltaX) {this.controller.scrollHorizontal(d.deltaX);}
					if (d.deltaY) {this.controller.scrollVertical(d.deltaY);}
				}
				return !!d;
			},

			asc_replaceText: function (findWhat, replaceWith, isReplaceAll, isMatchCase, isWholeCell) {
				this.wb.replaceCellText({findWhat: findWhat, replaceWith: replaceWith, isReplaceAll: isReplaceAll,
					isMatchCase: isMatchCase, isWholeCell: isWholeCell});
			},

			/**
			 * Делает активной указанную ячейку
			 * @param {String} reference  Ссылка на ячейку вида A1 или R1C1
			 */
			asc_findCell: function(reference) {
				var d = this.wb.findCell(reference);
				if (d) {
					if (d.deltaX) {this.controller.scrollHorizontal(d.deltaX);}
					if (d.deltaY) {this.controller.scrollVertical(d.deltaY);}
				}
			},

//			не используется (и не стоит так делать)
//			asc_openCellEditor: function (text, cursorPos) {
//				this.wb.openCellEditor(text, cursorPos, /*isFocus*/false);
//			},

			asc_closeCellEditor: function () {
				this.wb.closeCellEditor();
			},


			// Spreadsheet interface

			asc_getColumnWidth: function () {
				var ws = this.wb.getWorksheet();
				return ws.getColumnWidthInSymbols(ws.getSelectedColumnIndex());
			},

			asc_setColumnWidth: function (width) {
				this.wb.getWorksheet().changeWorksheet("colWidth", width);
			},

			asc_insertColumnsBefore: function (count) {
				this.wb.getWorksheet().changeWorksheet("insColBefore", count);
			},

			asc_insertColumnsAfter: function (count){
				this.wb.getWorksheet().changeWorksheet("insColAfter", count);
			},

			asc_deleteColumns: function() {
				this.wb.getWorksheet().changeWorksheet("delCol");
			},

			asc_showColumns: function () {
				this.wb.getWorksheet().changeWorksheet("showCols");
			},

			asc_hideColumns: function () {
				this.wb.getWorksheet().changeWorksheet("hideCols");
			},

			asc_getRowHeight: function () {
				var ws = this.wb.getWorksheet();
				return ws.getRowHeight(ws.getSelectedRowIndex(), 1/*pt*/, /*isHeightReal*/true);
			},

			asc_setRowHeight: function (height) {
				this.wb.getWorksheet().changeWorksheet("rowHeight", height);
			},

			asc_insertRowsBefore: function(count) {
				this.wb.getWorksheet().changeWorksheet("insRowBefore", count);
			},

			asc_insertRowsAfter: function (count) {
				this.wb.getWorksheet().changeWorksheet("insRowAfter", count);
			},

			asc_deleteRows: function () {
				this.wb.getWorksheet().changeWorksheet("delRow");
			},

			asc_showRows: function () {
				this.wb.getWorksheet().changeWorksheet("showRows");
			},

			asc_hideRows: function () {
				this.wb.getWorksheet().changeWorksheet("hideRows");
			},

			asc_insertCells: function (options) {
				this.wb.getWorksheet().changeWorksheet("insCell", options);
			},

			asc_deleteCells: function (options) {
				this.wb.getWorksheet().changeWorksheet("delCell", options);
			},

			asc_mergeCells: function (options) {
				this.wb.getWorksheet().setSelectionInfo("merge", options);
			},

			asc_sortCells: function (options) {
				this.wb.getWorksheet().setSelectionInfo("sort", options);
			},

			asc_emptyCells: function (options) {
				this.wb.emptyCells(options);
			},

			asc_drawDepCells:function(se){
				/* ToDo
				if( se != c_oAscDrawDepOptions.Clear )
					this.wb.getWorksheet().prepareDepCells(se);
				else
					this.wb.getWorksheet().cleanDepCells();*/
			},
			
			// Потеряем ли мы что-то при merge ячеек
			asc_mergeCellsDataLost: function (options) {
				return this.wb.getWorksheet().getSelectionMergeInfo(options);
			},

			asc_getSheetViewSettings: function () {
				return this.wb.getWorksheet().getSheetViewSettings();
			},

			asc_setSheetViewSettings: function (options) {
				this.wb.getWorksheet().changeWorksheet("sheetViewSettings", options);
			},

			// Images & Charts
			
			asc_setChartTranslate: function(translate) {
				this.chartTranslate = translate;
			},

			asc_drawingObjectsExist: function(chart) {
				for (var i = 0; i < this.wb.model.aWorksheets.length; i++) {
					if ( this.wb.model.aWorksheets[i].Drawings && this.wb.model.aWorksheets[i].Drawings.length )
						return true;
				}
				return false;
			},

			asc_getChartObject: function() {		// Return new or existing chart. For image return null
				var ws = this.wb.getWorksheet();
				return ws.objectRender.getAscChartObject();
			},

			asc_addChartDrawingObject: function(chart) {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.addChartDrawingObject(chart, this.isChartEditor);
			},

			asc_editChartDrawingObject: function(chart) {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.editChartDrawingObject(chart);
			},

			asc_addImageDrawingObject: function(imageUrl) {
				var rData = {"id":this.documentId, "vkey": this.documentVKey, "c":"imgurl", "data": imageUrl};
				var oThis = this;
				this.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
				this._asc_sendCommand( function(incomeObject){
					if(null != incomeObject && "imgurl" == incomeObject["type"])
					{
						var ws = oThis.wb.getWorksheet();
						return ws.objectRender.addImageDrawingObject(incomeObject["data"], null);
					}
					oThis.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
				}, rData );
			},

			asc_showImageFileDialog: function (options) {
                if (undefined != window['appBridge']) {
                    window['appBridge']['dummyCommandAddImage'] ();
                    return;
                }

				var ws = this.wb.getWorksheet();
				ws.objectRender.showImageFileDialog(this.documentId, this.documentFormat);
			},

			asc_setSelectedDrawingObjectLayer: function(layerType) {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.setGraphicObjectLayer(layerType);
			},
			
			asc_getChartPreviews: function(chartType, chartSubType) {
				
				if ( this.chartPreviewManager.isReady() ) {
					return this.chartPreviewManager.getChartPreviews(chartType, chartSubType);
				}
			},
			
			asc_checkChartInterval: function(type, subtype, interval, isRows) {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.checkChartInterval(type, subtype, interval, isRows);
			},
			
			// Для вставки диаграмм в Word
			asc_getBinaryFileWriter: function() {
				this.wb._initCommentsToSave();
				return new BinaryFileWriter(this.wbModel);
			},
			
			asc_getWordChartObject: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.getWordChartObject();
			},
			
			asc_cleanWorksheet: function() {
				var ws = this.wb.getWorksheet();	// Для удаления данных листа и диаграмм
				ws.objectRender.cleanWorksheet();
			},
			
			// Cell comment interface
			asc_addComment: function(oComment) {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_addComment(oComment);					
			},
			
			asc_changeComment: function(id, oComment) {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_changeComment(id, oComment);
			},
			
			asc_selectComment: function(id) {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_selectComment(id, /*bMove*/true);
			},
			
			asc_showComment: function(id, bNew) {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_showComment(id, bNew);
			},
			
			asc_findComment: function(id) {
				var ws = this.wb.getWorksheet();
				return ws.cellCommentator.asc_findComment(id);
			},
			
			asc_removeComment: function(id) {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_removeComment(id);
			},
			
			asc_getComments: function(col, row) {
				var ws = this.wb.getWorksheet();
				return ws.cellCommentator.asc_getComments(col, row);
			},
			
			asc_getDocumentComments: function() {
				var ws = this.wb.getWorksheet();
				return ws.cellCommentator.asc_getDocumentComments();
			},
			
			asc_showComments: function() {
				var ws = this.wb.getWorksheet();
				return ws.cellCommentator.asc_showComments();
			},
			
			asc_hideComments: function() {
				var ws = this.wb.getWorksheet();
				return ws.cellCommentator.asc_hideComments();
			},
			
			asc_getWorkbookComments: function() {
				var _this = this, comments = [];
				if ( _this.wb ) {
					for (var i = 0; i < _this.wb.model.aWorksheets.length; i++) {
						for (var j = 0; j < _this.wb.model.aWorksheets[i].aComments.length; j++) {
							comments.push( { "Id": _this.wb.model.aWorksheets[i].aComments[j].asc_getId(), "Comment": _this.wb.model.aWorksheets[i].aComments[j] } );
						}
					}
				}
				return comments;
			},

			// Shapes
            setStartPointHistory: function(){History.Create_NewPoint(); History.StartTransaction()},
            setEndPointHistory: function(){History.EndTransaction()},

			asc_startAddShape: function(sPreset) {
				this.isStartAddShape = true;
				var ws = this.wb.getWorksheet();
				ws.objectRender.controller.startTrackNewShape(sPreset);
			},
			
			asc_endAddShape: function() {
				this.isStartAddShape = false;
				this.handlers.trigger("asc_onEndAddShape");
			},
			
			asc_isAddAutoshape: function() {
				return this.isStartAddShape;
			},
			
			asc_canAddShapeHyperlink: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.controller.canAddHyperlink();
			},
			
			asc_canGroupGraphicsObjects: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.controller.canGroup();
			},
			
			asc_groupGraphicsObjects: function() {
				var ws = this.wb.getWorksheet();
				ws.objectRender.groupGraphicObjects();
			},
			
			asc_canUnGroupGraphicsObjects: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.controller.canUnGroup();
			},
			
			asc_unGroupGraphicsObjects: function() {
				var ws = this.wb.getWorksheet();
				ws.objectRender.unGroupGraphicObjects();
			},
			
			asc_changeShapeType: function(value) {
				this.asc_setGraphicObjectProps(new asc_CImgProperty( {ShapeProperties:{type:value}} ));
			},
			
			asc_getGraphicObjectProps: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.controller.getGraphicObjectProps();
			},
			
			asc_setGraphicObjectProps: function(props) {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.setGraphicObjectProps(props);
			},
			
			asc_getOriginalImageSize: function() {
				var ws = this.wb.getWorksheet();
				return ws.objectRender.getOriginalImageSize();
			},
			
			asc_setInterfaceDrawImagePlaceShape: function(elementId) {
				this.shapeElementId = elementId;
			},
			
			asc_changeImageFromFile: function() {
				this.isImageChangeUrl = true;
				this.asc_showImageFileDialog();
			},
			
			asc_changeShapeImageFromFile: function() {
				this.isShapeImageChangeUrl = true;
				this.asc_showImageFileDialog();
			},
			
			asc_putPrLineSpacing: function(type, value) {
				var ws = this.wb.getWorksheet();
				ws.objectRender.controller.putPrLineSpacing(type, value);
			},
			
			asc_putLineSpacingBeforeAfter: function(type,value) { // "type == 0" means "Before", "type == 1" means "After"
				var ws = this.wb.getWorksheet();
				ws.objectRender.controller.putLineSpacingBeforeAfter(type, value);
			},
			
			asc_setDrawImagePlaceParagraph: function(element_id, props) {
				var ws = this.wb.getWorksheet();
				ws.objectRender.setDrawImagePlaceParagraph(element_id, props);
			},
			
			asyncImageStartLoaded: function() {
			},
			
			asyncImageEndLoaded: function(_image) {
				if ( this.wb ) {
					var ws = this.wb.getWorksheet();
					if ( ws.objectRender.asyncImageEndLoaded )
						ws.objectRender.asyncImageEndLoaded(_image);
				}
			},
			
			asyncImagesDocumentStartLoaded: function() {				
			},
			
			asyncImagesDocumentEndLoaded: function() {
				if ( this.wb ) {
					var ws = this.wb.getWorksheet();
					if ( ws.objectRender.asyncImagesDocumentEndLoaded )
						ws.objectRender.asyncImagesDocumentEndLoaded();
				}
			},
			
			asyncImageEndLoadedBackground: function() {
			},
			
			// Cell interface
			asc_getCellInfo: function (bExt) {
				return this.wb.getWorksheet().getSelectionInfo(!!bExt);
			},

			// Получить координаты активной ячейки
			asc_getActiveCellCoord: function () {
				return this.wb.getWorksheet().getActiveCellCoord();
			},

			// Получаем свойство: редактируем мы сейчас или нет
			asc_getCellEditMode: function () {
				return this.wb.getCellEditMode();
			},

			asc_setCellFontName: function (fontName) {
				var t = this;
				t._loadFonts([fontName], function () {
					var ws = t.wb.getWorksheet();
					if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontName )
						ws.objectRender.controller.setCellFontName(fontName);
					else {
						t.wb.setFontAttributes("fn", fontName);
						t.wb.restoreFocus();
					}
				});
			},

			asc_setCellFontSize: function (fontSize) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellFontSize )
					ws.objectRender.controller.setCellFontSize(fontSize);
				else {
					this.wb.setFontAttributes("fs", fontSize);
					this.wb.restoreFocus();
				}
			},

			asc_setCellBold: function (isBold) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBold )
					ws.objectRender.controller.setCellBold(isBold);
				else {
					this.wb.setFontAttributes("b", isBold);
					this.wb.restoreFocus();
				}
			},

			asc_setCellItalic: function (isItalic) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellItalic )
					ws.objectRender.controller.setCellItalic(isItalic);
				else {
					this.wb.setFontAttributes("i", isItalic);
					this.wb.restoreFocus();
				}
			},

			asc_setCellUnderline: function (isUnderline) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellUnderline )
					ws.objectRender.controller.setCellUnderline(isUnderline);
				else {
					this.wb.setFontAttributes("u", isUnderline ? "single" : "none");
					this.wb.restoreFocus();
				}
			},

			asc_setCellStrikeout: function (isStrikeout) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellStrikeout )
					ws.objectRender.controller.setCellStrikeout(isStrikeout);
				else {
					this.wb.setFontAttributes("s", isStrikeout);
					this.wb.restoreFocus();
				}
			},

			asc_setCellSubscript: function (isSubscript) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSubscript )
					ws.objectRender.controller.setCellSubscript(isSubscript);
				else {
					this.wb.setFontAttributes("fa", isSubscript ? "subscript" : "none");
					this.wb.restoreFocus();
				}
			},

			asc_setCellSuperscript: function (isSuperscript) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellSuperscript )
					ws.objectRender.controller.setCellSuperscript(isSuperscript);
				else {
					this.wb.setFontAttributes("fa", isSuperscript ? "superscript" : "none");
					this.wb.restoreFocus();
				}
			},

			asc_setCellAlign: function (align) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAlign )
					ws.objectRender.controller.setCellAlign(align);
				else {
					this.wb.getWorksheet().setSelectionInfo("a", align);
					this.wb.restoreFocus();
				}
			},

			asc_setCellVertAlign: function (align) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellVertAlign )
					ws.objectRender.controller.setCellVertAlign(align);
				else {
					this.wb.getWorksheet().setSelectionInfo("va", align);
					this.wb.restoreFocus();
				}
			},

			asc_setCellTextWrap: function (isWrapped) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextWrap )
					ws.objectRender.controller.setCellTextWrap(isWrapped);
				else {
					this.wb.getWorksheet().setSelectionInfo("wrap", isWrapped);
					this.wb.restoreFocus();
				}
			},

			asc_setCellTextShrink: function (isShrinked) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextShrink )
					ws.objectRender.controller.setCellTextShrink(isShrinked);
				else {
					this.wb.getWorksheet().setSelectionInfo("shrink", isShrinked);
					this.wb.restoreFocus();
				}
			},

			asc_setCellTextColor: function (color) {
					var ws = this.wb.getWorksheet();
					if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellTextColor )
						ws.objectRender.controller.setCellTextColor(color);
					else {
                        if (color instanceof CAscColor) {
                            color = CorrectAscColor(color);
                            this.wb.setFontAttributes("c", color);
                            this.wb.restoreFocus();
                        }
					}

			},

			asc_setCellBackgroundColor: function (color) {
                var ws = this.wb.getWorksheet();
                if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellBackgroundColor )
                    ws.objectRender.controller.setCellBackgroundColor(color);
                else
                {
                    if(color instanceof CAscColor || null == color)
                    {
						if(null != color)
							color = CorrectAscColor(color);
                        this.wb.getWorksheet().setSelectionInfo("bc", color);
                        this.wb.restoreFocus();
                    }
                }
			},

			asc_setCellBorders: function (borders) {
				this.wb.getWorksheet().setSelectionInfo("border", borders);
				this.wb.restoreFocus();
			},

//			/**
//			 * Устанавливает текст в ячейке или в редакторе ячейки
//			 * @param {String} v    новый текст
//			 * @param {Number} pos  позиция текста в редакторе (для редактора ячейки)
//			 * @param {Number} len  длина замещаемого текста (для редактора ячейки)
//			 */
//			asc_setCellValue: function (v, pos, len) {
//				this.wb.setCellValue(v, pos, len);
//			}, - не используется (и не стоит так делать)

			asc_setCellFormat: function (format) {
				this.wb.getWorksheet().setSelectionInfo("format", format);
				this.wb.restoreFocus();
			},

            asc_setCellAngle: function (angle) {

                var ws = this.wb.getWorksheet();
                if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.setCellAngle )
                    ws.objectRender.controller.setCellAngle(angle);
                else
                {
                    this.wb.getWorksheet().setSelectionInfo("angle", angle);
                    this.wb.restoreFocus();
                }
            },

			asc_setCellStyle: function (name) {
				this.wb.getWorksheet().setSelectionInfo("style", name);
				this.wb.restoreFocus();
			},

			asc_increaseCellDigitNumbers: function () {
				this.wb.getWorksheet().setSelectionInfo("changeDigNum", +1);
				this.wb.restoreFocus();
			},

			asc_decreaseCellDigitNumbers: function () {
				this.wb.getWorksheet().setSelectionInfo("changeDigNum", -1);
				this.wb.restoreFocus();
			},

			// Увеличение размера шрифта
			asc_increaseFontSize: function () {
                var ws = this.wb.getWorksheet();
                if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.increaseFontSize )
                    ws.objectRender.controller.increaseFontSize();
                else{
                    this.wb.changeFontSize("changeFontSize", true);
                    this.wb.restoreFocus();
                }
			},

			// Уменьшение размера шрифта
			asc_decreaseFontSize: function () {
                var ws = this.wb.getWorksheet();
                if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.decreaseFontSize )
                    ws.objectRender.controller.decreaseFontSize();
                else{
                    this.wb.changeFontSize("changeFontSize", false);
                    this.wb.restoreFocus();
                }
			},

			asc_onMouseUp: function (x, y) {
				this.controller._onWindowMouseUpExternal(x, y);
			},


			//

			asc_selectFunction: function () {

			},

			asc_insertHyperlink: function (options) {
				var ws = this.wb.getWorksheet();
				if ( ws.objectRender.selectedGraphicObjectsExists() && ws.objectRender.controller.canAddHyperlink() )
					ws.objectRender.controller.insertHyperlink(options);
				else {
					// На всякий случай проверка (вдруг кто собирается вызвать...)
					this.wb.closeCellEditor();
					this.wb.getWorksheet().setSelectionInfo("hyperlink", options);
					this.wb.restoreFocus();
				}
			},
			
			asc_removeHyperlink: function () {
				if ( ws.objectRender.selectedGraphicObjectsExists() )
					ws.objectRender.controller.removeHyperlink();
			},

			asc_insertFormula: function (functionName, autoComplet) {
				this.wb.insertFormulaInEditor(functionName, autoComplet);
				this.wb.restoreFocus();
			},

			asc_getFormulasInfo: function () {
				return getFormulasInfo();
			},

			asc_recalc : function(){
				this.wbModel.recalcWB();
				// this.wb.getWorksheet().changeWorksheet("update");
			},

			asc_setFontRenderingMode: function (mode) {
				if (mode !== this.fontRenderingMode) {
					this.fontRenderingMode = mode;
					if (this.wb)
						this.wb.setFontRenderingMode(mode, /*isInit*/false);
				}
			},

			/**
			 * Режим выбора диапазона
			 * @param {Boolean} isSelectionDialogMode
			 * @param selectRange
			 */
			asc_setSelectionDialogMode: function (isSelectionDialogMode, selectRange) {
				this.controller.setSelectionDialogMode(isSelectionDialogMode);
				if (this.wb)
					this.wb.setSelectionDialogMode(isSelectionDialogMode, selectRange);
			},

			asc_SendThemeColors : function (colors, standart_colors) {
				this._gui_control_colors = { Colors : colors, StandartColors : standart_colors };
				var ret = this.handlers.trigger("asc_onSendThemeColors", colors, standart_colors);
				if (ret)
					this._gui_control_colors = null;
			},
			
			asc_SendThemeColorSchemes : function (param) {
				this._gui_color_schemes = param;
				var ret = this.handlers.trigger("asc_onSendThemeColorSchemes", param);
				if (ret)
					this._gui_color_schemes = null;
			},
			asc_ChangeColorScheme : function (index_scheme) {
				var t = this;
				var onChangeColorScheme = function (res) {
					if (res) {
						var theme = t.wbModel.theme;

						var oldClrScheme = theme.themeElements.clrScheme;
						var _count_defaults = g_oUserColorScheme.length;
						if (index_scheme < _count_defaults) {
							var _obj = g_oUserColorScheme[index_scheme];
							var scheme = new ClrScheme();
							scheme.name = _obj["name"];
							var _c;

							_c = _obj["dk1"];
							scheme.colors[8] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["lt1"];
							scheme.colors[12] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["dk2"];
							scheme.colors[9] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["lt2"];
							scheme.colors[13] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent1"];
							scheme.colors[0] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent2"];
							scheme.colors[1] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent3"];
							scheme.colors[2] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent4"];
							scheme.colors[3] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent5"];
							scheme.colors[4] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["accent6"];
							scheme.colors[5] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["hlink"];
							scheme.colors[11] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							_c = _obj["folHlink"];
							scheme.colors[10] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

							theme.themeElements.clrScheme = scheme;
						} else {
							index_scheme -= _count_defaults;

							if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
								return;

							theme.themeElements.clrScheme = theme.extraClrSchemeLst[index_scheme].clrScheme.createDuplicate();
						}
						History.Create_NewPoint();
						//не делаем Duplicate потому что предполагаем что схема не будет менять частями, а только обьектом целиком.
						History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_ChangeColorScheme, null, null, new UndoRedoData_ClrScheme(oldClrScheme, theme.themeElements.clrScheme));
						t.asc_AfterChangeColorScheme();
					}
				};
				// ToDo поправить заглушку, сделать новый тип lock element-а
				var sheetId = -1; // Делаем не существующий лист и не существующий объект
				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId, sheetId);
				this._getIsLockObjectSheet(lockInfo, onChangeColorScheme);
			},
			asc_AfterChangeColorScheme : function() {
				this.wbModel.rebuildColors();
				this.asc_CheckGuiControlColors();
				this.asc_ApplyColorScheme(true);
			},
			asc_ApplyColorScheme : function(bRedraw) {
				
				var ws = this.wb.getWorksheet();
				ws.objectRender.controller.applyColorScheme();

				// На view-режиме не нужно отправлять стили
				if (this.controller.getViewerMode && true !== this.controller.getViewerMode()) {
					// Отправка стилей
					this._sendWorkbookStyles();
				}
					
				if (bRedraw) {
					this.chartStyleManager.init();
					this.chartPreviewManager.init();
					this.handlers.trigger("asc_onUpdateChartStyles");
					
					var ws = this.wb.getWorksheet();
					// ToDo - от _reDrawFilters в будущем стоит избавиться, ведь она проставляет стили ячейкам, а это не нужно делать (сменить отрисовку)
					// ToDo - и еще, в _reDrawFilters делается отрисовка + в drawWS делается отрисовка
					ws.autoFilters._reDrawFilters(true);
					this.wb.drawWS();
				}
			},
			
			/////////////////////////////////////////////////////////////////////////
			///////////////////CoAuthoring and Chat api//////////////////////////////
			/////////////////////////////////////////////////////////////////////////
			// send chart message
			asc_coAuthoringChatSendMessage: function(message) {
				if (!this.CoAuthoringApi)
					return; // Error
				this.CoAuthoringApi.sendMessage(message);
			},
			// get chart messages, возвращается массив CChatMessage
			asc_coAuthoringChatGetMessages: function() {
				if (!this.CoAuthoringApi)
					return; // Error
				this.CoAuthoringApi.getMessages();
			},
			// get users, возвращается массив users
			asc_coAuthoringGetUsers: function() {
				if (!this.CoAuthoringApi)
					return; // Error
				this.CoAuthoringApi.getUsers();
			},
			// server disconnect
			asc_coAuthoringDisconnect: function () {
				if (!this.CoAuthoringApi)
					return; // Error
				this.CoAuthoringApi.disconnect();
			},
			/////////////////////////////////////////////////////////////////////////
			////////////////////////////AutoSave api/////////////////////////////////
			/////////////////////////////////////////////////////////////////////////
			autoSaveInit: function (autoSaveGap) {
				// Очищаем предыдущий таймер
				if (null !== this.autoSaveTimeOutId)
					clearTimeout(this.autoSaveTimeOutId);

				if (autoSaveGap || this.autoSaveGap) {
					var t = this;
					this.autoSaveTimeOutId = setTimeout(function () {
						t.autoSaveTimeOutId = null;
						if (t.asc_getViewerMode()) {
							/*
								1) При загрузке файла на просмотре при совместном редактировании загрузится
									файл уже с последними изменениями.
								2) Далее при срабатывании автосохранения должны накатываться новые изменения
									(это надо делать) при этом файл отсылаться не должен, т.к. изменений во вьювере нет.
								3) Если пользователь отключил автосохранение, то изменения к нему приходить не
									будут, поскольку это его решение.
							*/
							// Принимаем чужие изменения
							t.collaborativeEditing.applyChanges();
							t.autoSaveInit();
						} else if (t.asc_isDocumentModified()) {
							// Если мы редактируем ячейку, то запустим автосохранение чуть позднее
							if (t.asc_getCellEditMode())
								t.autoSaveInit(t.autoSaveGapAsk);
							else
								t.asc_Save(/*isAutoSave*/true);
						} else
							t.autoSaveInit();
					}, (autoSaveGap || this.autoSaveGap));
				}
			},

            // offline mode

            offlineModeInit: function() {
                var t = this;

                if (window['scriptBridge']) {
                    if (!window['scriptBridge']['_self']) {
                        window['scriptBridge']['_self'] = t;
                    }

                    if (!window['scriptBridge']['workPath']) {
                        window['scriptBridge']['workPath'] = function () {
                            return t.documentUrl;
                        };
                    }

                    if (!window['scriptBridge']['print']) {
                        window['scriptBridge']['print'] = function() {

                            var oAdditionalData = new Object();
                            oAdditionalData["documentId"] = t.documentId+ "." + t.documentFormat;
                            oAdditionalData["vkey"] = t.documentVKey;
                            oAdditionalData["outputformat"] = c_oAscFileType.PDFPRINT;

                            var bStart = false;

                            t.adjustPrint = new asc_CAdjustPrint();
                            t.printPagesData = t.wb.calcPagesPrint(t.adjustPrint);

                            var pdf_writer = new CPdfPrinter(t.wbModel.sUrlPath);
                            var isEndPrint = t.wb.printSheet(pdf_writer, t.printPagesData);

                            return pdf_writer.DocumentRenderer.Memory.GetBase64Memory();
                        };
                    }

                    if (!window['scriptBridge']['addFileImage']) {
                        window['scriptBridge']['addFileImage'] = function(imageUrl, x, y, width, height) {
                            
                            var ws = t.wb.getWorksheet();
                            ws.model.workbook.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);

                            var options = null;
                            if (x && y) {
                                var picker = ws.objectRender.getPositionInfo(x,y);
                                options = {cell: {col: picker.col, row: picker.row}, width: width, height: height};
                                // console.log(picker);
                            }

                            ws.objectRender.addImageDrawingObject(imageUrl, options);
                            ws.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                        };
                    }

                    if (!window['scriptBridge']['isDocumentModified']) {
                        window['scriptBridge']['isDocumentModified'] = function() {
                            var f = t.asc_isDocumentModified();
                            t.isDocumentModify = false;
                            t.handlers.trigger("asc_onDocumentModifiedChanged", false);
                            return f;
                        };
                    }

                    if (!window['scriptBridge']['save']) {
                        window['scriptBridge']['save'] = function(sFormat) {
                            var oAdditionalData = new Object();
                            oAdditionalData["documentId"] = t.documentId + "." + t.documentFormat;
                            oAdditionalData["vkey"] = t.documentVKey;
                            oAdditionalData["outputformat"] = sFormat;

                            t.wb._initCommentsToSave();
                            var oBinaryFileWriter = new BinaryFileWriter(t.wbModel);
                            oAdditionalData["savetype"] = "completeall";

                            var data = oBinaryFileWriter.Write();
                            t.asc_OnSaveEnd(true);
                            return data;
                        }
                    }

                    if (!window['scriptBridge']['saveEnd']) {
                        window['scriptBridge']['saveEnd'] = function() {
                            t.asc_OnSaveEnd(true);
                        }
                    }

                    if (!window['scriptBridge']['showAdvancedOptionsDialog']) {
                        window['scriptBridge']['showAdvancedOptionsDialog'] = function(codepages) {
                            var cp = JSON.parse(codepages);
                            t.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
                            t.handlers.trigger("asc_onAdvancedOptions",  new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.CSV,cp), t.advancedOptionsAction);
                        }
                    }

                    if (!window['scriptBridge']['updateTitle']) {
                        window['scriptBridge']['updateTitle'] = function(title) {
                            t.documentTitle = title;
                        }
                    }

                    if (!window['scriptBridge']['loadDocumentFromString']) {
                        window['scriptBridge']['loadDocumentFromString'] = function(workbook) {
							var wb = t.asc_OpenDocument("", workbook);
                            t._startOpenDocument({returnCode: 0, val:wb});
                        }
                    }
                }
            },
            offlineModeLoadDocument: function() {
                var t = this;

                t.asc_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

                function loadDocument (data) {

                    var workbook = data;
                    if (!data || c_oSerFormat.Signature !== data.substring(0, c_oSerFormat.Signature.length)) {
                        workbook = "XLSY;v1;1001;BAKAAgAAAwwDAAAEHwMAAADgAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIgAAAAAHgAAAAEZAAAAAAAAAAABAAAAAAIAAAAABAAAAAAFAAAAAAIdAAAAAxgAAAAGBAAAAAAHBAAAAAAIBAAAAAAJBAAAAAAECgAAAAUAAAAABQAAAAAGLwAAAAcqAAAAAQYGAAAAAAQAAAD/BAYOAAAAQwBhAGwAaQBiAHIAaQAGBQAAAAAAACZADwAAAAAAAAAAAQUAAAACAAAAAL0AAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADEAAQQBAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADIAAQQCAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAAOgAAAAEYAAAAAAYMAAAAUwBoAGUAZQB0ADMAAQQDAAAABAQAAABBADEACwoAAAABBQAAAAAAAC5ACQAAAAAFAAAAAAAAAAA=";
                    }
					var wb = t.asc_OpenDocument("", workbook);
                    t._startOpenDocument({returnCode: 0, val:wb});
                }

                $.ajax({
                    type: 'GET',
                    url : t.documentUrl + "editor.js?callback=?",
                    jsonpCallback: 'jsonCallback',
                    async: false,
                    cache: false,
                    dataType: 'jsonp',
                    contentType: "application/json",
                    crossDomain: true,
                    success: function(data) {
                        loadDocument(data);
                    },
                    error: function(jqXHR, textStatus, ex) {
                        // console.log(textStatus + "," + ex + "," + jqXHR.responseText);
                        loadDocument(undefined);
                    }
                });
            },

            asc_openNewDocument: function () {
                if (undefined != window['appBridge']) {
                     window['appBridge']['dummyCommandNewDocument'] ();
                 }
            },
            asc_loadDocumentFromDisk: function () {
                if (undefined != window['appBridge']) {
                    window['appBridge']['dummyCommandLoadDocumentFromDisk'] ();
                }
            },
			asc_mapAscServerErrorToAscError: function(nServerError)
			{
				var nRes = c_oAscError.ID.Unknown;
				switch(nServerError)
				{
					case c_oAscServerError.NoError : nRes = c_oAscError.ID.No;break;
					case c_oAscServerError.TaskQueue :
					case c_oAscServerError.TaskResult : nRes = c_oAscError.ID.Database;break;
					case c_oAscServerError.ConvertDownload : nRes = c_oAscError.ID.DownloadError;break;
					case c_oAscServerError.ConvertTimeout : nRes = c_oAscError.ID.ConvertationTimeout;break;
					case c_oAscServerError.ConvertMS_OFFCRYPTO : nRes = c_oAscError.ID.ConvertationPassword;break;
					case c_oAscServerError.ConvertUnknownFormat :
					case c_oAscServerError.ConvertReadFile :
					case c_oAscServerError.Convert : nRes = c_oAscError.ID.ConvertationError;break;
					case c_oAscServerError.UploadContentLength : nRes = c_oAscError.ID.UplImageSize;break;
					case c_oAscServerError.UploadExtension : nRes = c_oAscError.ID.UplImageExt;break;
					case c_oAscServerError.UploadCountFiles : nRes = c_oAscError.ID.UplImageFileCount;break;
					case c_oAscServerError.VKey : nRes = c_oAscError.ID.FileVKey;break;
					case c_oAscServerError.VKeyEncrypt : nRes = c_oAscError.ID.VKeyEncrypt;break;
					case c_oAscServerError.VKeyKeyExpire : nRes = c_oAscError.ID.KeyExpire;break;
					case c_oAscServerError.VKeyUserCountExceed : nRes = c_oAscError.ID.UserCountExceed;break;
					case c_oAscServerError.Storage :
					case c_oAscServerError.StorageFileNoFound :
					case c_oAscServerError.StorageRead :
					case c_oAscServerError.StorageWrite :
					case c_oAscServerError.StorageRemoveDir :
					case c_oAscServerError.StorageCreateDir :
					case c_oAscServerError.StorageGetInfo :
					case c_oAscServerError.Upload :
					case c_oAscServerError.ReadRequestStream :
					case c_oAscServerError.Unknown : nRes = c_oAscError.ID.Unknown;break;
				}
				return nRes;
			}
		};

		function asc_ajax(obj){
			var url = "", type = "GET",
				async = true, data = null, dataType = "text/xml",
				error = null, success = null, httpRequest = null,

			init = function (obj){

				if ( typeof obj.url !== 'undefined' ){
					url = obj.url;
				}
				if ( typeof obj.type !== 'undefined' ){
					type = obj.type;
				}
				if ( typeof obj.async !== 'undefined' ){
					async = obj.async;
				}
				if ( typeof obj.data !== 'undefined' ){
					data = obj.data;
				}
				if ( typeof obj.dataType !== 'undefined' ){
					dataType = obj.dataType;
				}
				if ( typeof obj.error !== 'undefined' ){
					error = obj.error;
				}
				if ( typeof obj.success !== 'undefined' ){
					success = obj.success;
				}

				if (window.XMLHttpRequest) { // Mozilla, Safari, ...
					httpRequest = new XMLHttpRequest();
					if (httpRequest.overrideMimeType) {
						httpRequest.overrideMimeType(dataType);
					}
				}
				else if (window.ActiveXObject) { // IE
					try {
						httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
					}
					catch (e) {
						try {
							httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
						}
						catch (e) {}
					}
				}

				httpRequest.onreadystatechange = function(){
					respons(this);
				};
				send();
			},

			send = function(){
				httpRequest.open(type, url, async);
				if (type === "POST")
					httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				httpRequest.send(data);
			},

			respons = function(httpRequest){
				switch (httpRequest.readyState)
				{
					case 0:
						// The object has been created, but not initialized (the open method has not been called).
						break;
					case 1:
						// A request has been opened, but the send method has not been called.
						break;
					case 2:
						// The send method has been called. No data is available yet.
						break;
					case 3:
						// Some data has been received; however, neither responseText nor responseBody is available.
						break;
					case 4:
						if (httpRequest.status === 200 || httpRequest.status === 1223) {
							if (typeof success === "function")
								success(httpRequest.responseText);
						} else {
							if (typeof error === "function")
								error(httpRequest,httpRequest.statusText,httpRequest.status);
						}
						break;
				}
			};

			init(obj);
		};
		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */

		asc["spreadsheet_api"] = spreadsheet_api;
		prot = spreadsheet_api.prototype;

		prot["asc_Init"] = prot.asc_Init;
		prot["asc_setDocInfo"] = prot.asc_setDocInfo;
		prot["asc_setLocale"] = prot.asc_setLocale;
		prot["asc_getEditorPermissions"] = prot.asc_getEditorPermissions;
		prot["asc_LoadDocument"] = prot.asc_LoadDocument;
		prot["asc_LoadEmptyDocument"] = prot.asc_LoadEmptyDocument;
		prot["asc_DownloadAs"] = prot.asc_DownloadAs;
		prot["asc_Save"] = prot.asc_Save;
		prot["asc_OnSaveEnd"] = prot.asc_OnSaveEnd;
		prot["asc_Print"] = prot.asc_Print;
		prot["asc_Resize"] = prot.asc_Resize;
		prot["asc_Copy"] = prot.asc_Copy;
		prot["asc_Paste"] = prot.asc_Paste;
		prot["asc_Cut"] = prot.asc_Cut;
		prot["asc_Undo"] = prot.asc_Undo;
		prot["asc_Redo"] = prot.asc_Redo;

		prot["asc_getDocumentName"] = prot.asc_getDocumentName;
		prot["asc_getDocumentFormat"] = prot.asc_getDocumentFormat;
		prot["asc_isDocumentModified"] = prot.asc_isDocumentModified;

		prot["asc_setAutoSaveGap"] = prot.asc_setAutoSaveGap;

		prot["asc_setMobileVersion"] = prot.asc_setMobileVersion;
		prot["asc_setViewerMode"] = prot.asc_setViewerMode;
		prot["asc_setUseEmbeddedCutFonts"] = prot.asc_setUseEmbeddedCutFonts;
		prot["asc_setCoAuthoringEnable"] = prot.asc_setCoAuthoringEnable;
		prot["asc_setAdvancedOptions"] = prot.asc_setAdvancedOptions;
		prot["asc_setPageOptions"] = prot.asc_setPageOptions;
		prot["asc_getPageOptions"] = prot.asc_getPageOptions;

		prot["asc_registerCallback"] = prot.asc_registerCallback;
		prot["asc_unregisterCallback"] = prot.asc_unregisterCallback;

		prot["asc_getController"] = prot.asc_getController;

		// Toolbar interface

		/*prot["asc_getEditorFonts"] = prot.asc_getEditorFonts;
		prot["asc_getThemeColorSchemes"] = prot.asc_getThemeColorSchemes;
		prot["asc_getEditorShapes"] = prot.asc_getEditorShapes;
		prot["asc_getStandartTextures"] = prot.asc_getStandartTextures;*/

		// Workbook interface

		prot["asc_getWorksheetsCount"] = prot.asc_getWorksheetsCount;
		prot["asc_getWorksheetName"] = prot.asc_getWorksheetName;
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
		prot["asc_findCell"] = prot.asc_findCell;
		//prot["asc_openCellEditor"] = prot.asc_openCellEditor; - не используется (и не стоит так делать)
		prot["asc_closeCellEditor"] = prot.asc_closeCellEditor;

		// Spreadsheet interface

		prot["asc_getColumnWidth"] = prot.asc_getColumnWidth;
		prot["asc_setColumnWidth"] = prot.asc_setColumnWidth;
		prot["asc_insertColumnsBefore"] = prot.asc_insertColumnsBefore;
		prot["asc_insertColumnsAfter"] = prot.asc_insertColumnsAfter;
		prot["asc_deleteColumns"] = prot.asc_deleteColumns;
		prot["asc_showColumns"] = prot.asc_showColumns;
		prot["asc_hideColumns"] = prot.asc_hideColumns;
		prot["asc_getRowHeight"] = prot.asc_getRowHeight;
		prot["asc_setRowHeight"] = prot.asc_setRowHeight;
		prot["asc_insertRowsBefore"] = prot.asc_insertRowsBefore;
		prot["asc_insertRowsAfter"] = prot.asc_insertRowsAfter;
		prot["asc_deleteRows"] = prot.asc_deleteRows;
		prot["asc_showRows"] = prot.asc_showRows;
		prot["asc_hideRows"] = prot.asc_hideRows;
		prot["asc_insertCells"] = prot.asc_insertCells;
		prot["asc_deleteCells"] = prot.asc_deleteCells;
		prot["asc_mergeCells"] = prot.asc_mergeCells;
		prot["asc_sortCells"] = prot.asc_sortCells;
		prot["asc_emptyCells"] = prot.asc_emptyCells;
		prot["asc_mergeCellsDataLost"] = prot.asc_mergeCellsDataLost;
		prot["asc_getSheetViewSettings"] = prot.asc_getSheetViewSettings;
		prot["asc_setSheetViewSettings"] = prot.asc_setSheetViewSettings;
		
		// Auto filters interface
		prot["asc_addAutoFilter"] = prot.asc_addAutoFilter;
		prot["asc_applyAutoFilter"] = prot.asc_applyAutoFilter;
		prot["asc_sortColFilter"] = prot.asc_sortColFilter;
		prot["asc_getAddFormatTableOptions"] = prot.asc_getAddFormatTableOptions;
		
		// Drawing objects interface

		prot["asc_showDrawingObjects"] = prot.asc_showDrawingObjects;
		prot["asc_setChartTranslate"] = prot.asc_setChartTranslate;
		prot["asc_drawingObjectsExist"] = prot.asc_drawingObjectsExist;
		prot["asc_getChartObject"] = prot.asc_getChartObject;
		prot["asc_addChartDrawingObject"] = prot.asc_addChartDrawingObject;
		prot["asc_editChartDrawingObject"] = prot.asc_editChartDrawingObject;
		prot["asc_addImageDrawingObject"] = prot.asc_addImageDrawingObject;
		prot["asc_setSelectedDrawingObjectLayer"] = prot.asc_setSelectedDrawingObjectLayer;
		prot["asc_getChartPreviews"] = prot.asc_getChartPreviews;
		prot["asc_checkChartInterval"] = prot.asc_checkChartInterval;
		prot["asc_getBinaryFileWriter"] = prot.asc_getBinaryFileWriter;
		prot["asc_getWordChartObject"] = prot.asc_getWordChartObject;
		prot["asc_cleanWorksheet"] = prot.asc_cleanWorksheet;
		prot["asc_showImageFileDialog"] = prot.asc_showImageFileDialog;
		
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
		prot["asc_getWorkbookComments"] = prot.asc_getWorkbookComments;
		
		// Shapes
        prot["setStartPointHistory"] = prot.setStartPointHistory;
        prot["setEndPointHistory"] = prot.setEndPointHistory;
		prot["asc_startAddShape"] = prot.asc_startAddShape;
		prot["asc_endAddShape"] = prot.asc_endAddShape;
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
		prot["asc_changeImageFromFile"] = prot.asc_changeImageFromFile;
		prot["asc_putPrLineSpacing"] = prot.asc_putPrLineSpacing;
		prot["asc_putLineSpacingBeforeAfter"] = prot.asc_putLineSpacingBeforeAfter;
		prot["asc_setDrawImagePlaceParagraph"] = prot.asc_setDrawImagePlaceParagraph;
		prot["asc_changeShapeImageFromFile"] = prot.asc_changeShapeImageFromFile;
		
		// Cell interface
		prot["asc_getCellInfo"] = prot.asc_getCellInfo;
		prot["asc_getActiveCellCoord"] = prot.asc_getActiveCellCoord;
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
		//prot["asc_setCellValue"] = prot.asc_setCellValue; - не используется (и не стоит так делать)
		prot["asc_setCellFormat"] = prot.asc_setCellFormat;
        prot["asc_setCellAngle"] = prot.asc_setCellAngle;
		prot["asc_setCellStyle"] = prot.asc_setCellStyle;
		prot["asc_increaseCellDigitNumbers"] = prot.asc_increaseCellDigitNumbers;
		prot["asc_decreaseCellDigitNumbers"] = prot.asc_decreaseCellDigitNumbers;
		prot["asc_increaseFontSize"] = prot.asc_increaseFontSize;
		prot["asc_decreaseFontSize"] = prot.asc_decreaseFontSize;

		prot["asc_onMouseUp"] = prot.asc_onMouseUp;
		prot["asc_mapAscServerErrorToAscError"] = prot.asc_mapAscServerErrorToAscError;

		prot["asc_selectFunction"] = prot.asc_selectFunction;
		prot["asc_insertHyperlink"] = prot.asc_insertHyperlink;
		prot["asc_removeHyperlink"] = prot.asc_removeHyperlink;
		prot["asc_insertFormula"] = prot.asc_insertFormula;
		prot["asc_getFormulasInfo"] = prot.asc_getFormulasInfo;
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

        // offline mode

        prot["asc_openNewDocument"] = prot.asc_openNewDocument;
        prot["asc_loadDocumentFromDisk"] = prot. asc_loadDocumentFromDisk;
	}
)(jQuery, window);
