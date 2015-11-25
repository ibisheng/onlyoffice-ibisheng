"use strict";

asc_docs_api.prototype.asc_getEditorPermissions = function(licenseUrl, customerId) {
  var t = this;
  if (this.DocInfo && this.DocInfo.get_Id()) {

    var sUserFirstName = null, sUserLastName = null;
    var oUserInfo = this.DocInfo.get_UserInfo();
    if (oUserInfo) {
      sUserFirstName = oUserInfo.get_FirstName();
      sUserLastName = oUserInfo.get_LastName();
    }
    CheckLicense(licenseUrl, customerId, this.DocInfo.get_UserId(), sUserFirstName, sUserLastName, function(err, res) {
      t._onCheckLicenseEnd(err, res);
    });
  } else {
    // Фиктивный вызов
    this._onCheckLicenseEnd(true, false);
  }
  this._coAuthoringInit();
};
asc_docs_api.prototype._onCheckLicenseEnd = function(err, res) {
  this.licenseResult = {err: err, res: res};
  this._onEndPermissions();
};
asc_docs_api.prototype._onEndPermissions = function() {
  if (null !== this.licenseResult && this.isOnFirstConnectEnd) {
    var oResult = new window['Asc'].asc_CAscEditorPermissions();
    oResult.asc_setCanLicense(this.licenseResult.res);
    this.asc_fireCallback('asc_onGetEditorPermissions', oResult);
  }
};