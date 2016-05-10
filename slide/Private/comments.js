"use strict";

Asc.asc_docs_api.prototype.asc_addComment = function(AscCommentData) {
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

Asc.asc_docs_api.prototype['asc_addComment'] = asc_docs_api.prototype.asc_addComment;