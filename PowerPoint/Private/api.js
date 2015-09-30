"use strict";

asc_docs_api.prototype.asc_addComment = function(AscCommentData) {
  //if ( true === CollaborativeEditing.Get_GlobalLock() )
  //   return;

  if (null == this.WordControl.m_oLogicDocument) {
    return;
  }

  var CommentData = new CCommentData();
  CommentData.Read_FromAscCommentData(AscCommentData);

  var Comment = this.WordControl.m_oLogicDocument.Add_Comment(CommentData);
  if (Comment) {
    return Comment.Get_Id();
  }
};
asc_docs_api.prototype.asc_getEditorPermissions = function(licenseUrl, companyId) {
  var t = this;
  if (this.DocInfo && this.DocInfo.get_Id()) {
    CheckLicense(licenseUrl, companyId, this.DocInfo.get_UserId(), function(err, res) {
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