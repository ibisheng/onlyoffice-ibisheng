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
    this._onCheckLicenseEnd(true, g_oLicenseResult.Error);
  }
  this._coAuthoringInit();
};