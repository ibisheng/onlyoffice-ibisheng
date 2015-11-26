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

  // Тип состояния на данный момент (сохранение, открытие или никакое)
  this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;

  // Chart
  this.chartTranslate = new asc_CChartTranslate();
  this.textArtTranslate = new asc_TextArtTranslate();

  // CoAuthoring and Chat
  this.User = undefined;
  this.CoAuthoringApi = new window['CDocsCoApi']();
  this.isCoAuthoringEnable = true;

  // Результат получения лицензии
  this.licenseResult = null;
  // Подключились ли уже к серверу
  this.isOnFirstConnectEnd = false;

  this.canSave = true;        // Флаг нужен чтобы не происходило сохранение пока не завершится предыдущее сохранение
}
baseEditorsApi.prototype.asc_GetFontThumbnailsPath = function() {
  return '../Common/Images/';
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