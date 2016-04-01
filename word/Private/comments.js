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
asc_docs_api.prototype['asc_addComment'] = asc_docs_api.prototype.asc_addComment;