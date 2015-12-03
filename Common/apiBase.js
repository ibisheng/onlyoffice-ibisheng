"use strict";

var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";

/** @constructor */
function baseEditorsApi(name) {
  g_fontApplication.Init();

  this.HtmlElementName = name;

  this.isMobileVersion = false;

  this.FontLoader = window.g_font_loader;
  this.ImageLoader = window.g_image_loader;
  this.FontLoader.put_Api(this);
  this.ImageLoader.put_Api(this);
  this.FontLoader.SetStandartFonts();

  this.LoadedObject = null;
  this.DocumentType = 0; // 0 - empty, 1 - test, 2 - document (from json)
  this.DocInfo = null;
  this.documentId = undefined;
  this.documentUserId = undefined;
  this.documentUrl = "null";
  this.documentUrlChanges = null;
  this.documentCallbackUrl = undefined;		// Ссылка для отправления информации о документе
  this.documentFormat = "null";
  this.documentTitle = "null";

  // Тип состояния на данный момент (сохранение, открытие или никакое)
  this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
  this.OpenDocumentProgress = new COpenProgress();
  this.documentOrigin = ''; // ToDo скорее всего лишняя переменная и можно обойтись и без нее

  // AutoSave
  this.autoSaveGap = 0;					// Интервал автосохранения (0 - означает, что автосохранения нет) в милесекундах

  // Chart
  this.chartTranslate = new asc_CChartTranslate();
  this.textArtTranslate = new asc_TextArtTranslate();
  this.chartPreviewManager = new ChartPreviewManager();
  this.textArtPreviewManager = new TextArtPreviewManager();
  // Режим вставки диаграмм в редакторе документов
  this.isChartEditor = false;

  // CoAuthoring and Chat
  this.User = undefined;
  this.CoAuthoringApi = new window['CDocsCoApi']();
  this.isCoAuthoringEnable = true;
  // Массив lock-ов, которые были на открытии документа
  this.arrPreOpenLocksObjects = [];

  // Spell Checking
  this.SpellCheckUrl = '';    // Ссылка сервиса для проверки орфографии

  // Результат получения лицензии
  this.licenseResult = null;
  // Подключились ли уже к серверу
  this.isOnFirstConnectEnd = false;

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
}
baseEditorsApi.prototype.asc_GetFontThumbnailsPath = function() {
  return '../Common/Images/';
};
baseEditorsApi.prototype.asc_getDocumentName = function() {
  return this.documentTitle;
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
// Version History
baseEditorsApi.prototype.asc_showRevision = function(newObj) {
};
baseEditorsApi.prototype.asc_undoAllChanges = function() {
};