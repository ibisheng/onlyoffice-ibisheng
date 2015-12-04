"use strict";

/* license.js
 *
 * Author: Alexander.Trofimov@avsmedia.net
 * Date:   Apr 23, 2015
 */
(/**
 * @param {jQuery} $
 * @param {Window} window
 * @param {undefined} undefined
 */
  function($, window, undefined) {

  var asc = window["Asc"];
  var prot;

  asc['spreadsheet_api'].prototype.asc_getEditorPermissions = function(licenseUrl, customerId) {
    var t = this;
    if (this.DocInfo && this.DocInfo.asc_getId() && this.DocInfo.asc_getUrl()) {

      var sUserFirstName = null, sUserLastName = null;
      var oUserInfo = this.DocInfo.get_UserInfo();
      if (oUserInfo) {
        sUserFirstName = oUserInfo.get_FirstName();
        sUserLastName = oUserInfo.get_LastName();
      }
      CheckLicense(licenseUrl, customerId, this.DocInfo.asc_getUserId(), sUserFirstName, sUserLastName, function(err, res) {
        t._onCheckLicenseEnd(err, res);
      });
    } else {
      // Фиктивный вызов
      this._onCheckLicenseEnd(true, g_oLicenseResult.Error);
    }
    this._coAuthoringInit();
  };

  prot = asc['spreadsheet_api'].prototype;
  prot['asc_getEditorPermissions'] = prot.asc_getEditorPermissions;
})(jQuery, window);
