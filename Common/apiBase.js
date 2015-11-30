"use strict";

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

  // Тип состояния на данный момент (сохранение, открытие или никакое)
  this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
  this.OpenDocumentProgress = new COpenProgress();

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
}
baseEditorsApi.prototype.asc_GetFontThumbnailsPath = function() {
  return '../Common/Images/';
};
// Events
baseEditorsApi.prototype.sendEvent = function() {
};
baseEditorsApi.prototype.SendOpenProgress = function() {
  this.sendEvent("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
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
// Images & Charts
baseEditorsApi.prototype.asc_setChartTranslate = function(translate) {
  this.chartTranslate = translate;
};
baseEditorsApi.prototype.asc_setTextArtTranslate = function(translate) {
  this.textArtTranslate = translate;
};
// Version History
baseEditorsApi.prototype.asc_showRevision = function(newObj) {
};
baseEditorsApi.prototype.asc_undoAllChanges = function() {
};