"use strict";

asc_docs_api.prototype.asc_addComment = function(AscCommentData) {
  if (true === CollaborativeEditing.Get_GlobalLock()) {
    return;
  }

  if (null == this.WordControl.m_oLogicDocument) {
    return;
  }

  // Комментарий без цитаты позволяем добавить всегда
  if (true !== this.can_AddQuotedComment() || false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
    var CommentData = new CCommentData();
    CommentData.Read_FromAscCommentData(AscCommentData);

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddComment);
    var Comment = this.WordControl.m_oLogicDocument.Add_Comment(CommentData);
    if (null != Comment) {
      this.sync_AddComment(Comment.Get_Id(), CommentData);
    }

    return Comment.Get_Id();
  }
};
asc_docs_api.prototype.asc_getEditorPermissions = function(licenseUrl, customerId) {
  var t = this;
  if (this.DocInfo && this.DocInfo.get_Id()) {
    CheckLicense(licenseUrl, customerId, this.DocInfo.get_UserId(), function(err, res) {
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