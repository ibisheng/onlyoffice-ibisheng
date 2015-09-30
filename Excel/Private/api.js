"use strict";

/* api.js
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

  asc['spreadsheet_api'].prototype.asc_addComment = function(oComment) {
    if (oComment.bDocument) {
      this.wb.cellCommentator.asc_addComment(oComment);
    } else {
      var ws = this.wb.getWorksheet();
      ws.cellCommentator.asc_addComment(oComment);
    }
  };

  asc['spreadsheet_api'].prototype.asc_getEditorPermissions = function(licenseUrl, companyId) {
    var t = this;
    if (this.DocInfo && this.DocInfo["Id"] && this.DocInfo["Url"]) {
      CheckLicense(licenseUrl, companyId, this.DocInfo["UserId"], function(err, res) {
        t._onCheckLicenseEnd(err, res);
      });
    } else {
      // Фиктивный вызов
      this._onCheckLicenseEnd(true, false);
    }
    this._coAuthoringInit();
  };
  asc['spreadsheet_api'].prototype._onCheckLicenseEnd = function(err, res) {
    this.licenseResult = {err: err, res: res};
    this._onEndPermissions();
  };
  asc['spreadsheet_api'].prototype._onEndPermissions = function() {
    if (null !== this.licenseResult && this.isOnFirstConnectEnd) {
      var oResult = new asc.asc_CAscEditorPermissions();
      oResult.asc_setCanLicense(this.licenseResult.res);
      this.handlers.trigger('asc_onGetEditorPermissions', oResult);
    }
  };

  prot = asc['spreadsheet_api'].prototype;
  prot['asc_addComment'] = prot.asc_addComment;
  prot['asc_getEditorPermissions'] = prot.asc_getEditorPermissions;
})(jQuery, window);
