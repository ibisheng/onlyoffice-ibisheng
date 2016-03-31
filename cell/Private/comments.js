"use strict";

/* comments.js
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
    var oPlace = oComment.bDocument ? this.wb : this.wb.getWorksheet();
    oPlace.cellCommentator.addComment(oComment);
  };

  prot = asc['spreadsheet_api'].prototype;
  prot['asc_addComment'] = prot.asc_addComment;
})(jQuery, window);

CCellCommentator.prototype.addComment = function(comment, bIsNotUpdate) {
  var t = this;
  var oComment = comment;
  var bChange = false;
  oComment.wsId = this.worksheet.model.getId();
  oComment.setId();

  if (!oComment.bDocument) {
    if (!bIsNotUpdate) {
      oComment.asc_putCol(this.worksheet.getSelectedColumnIndex());
      oComment.asc_putRow(this.worksheet.getSelectedRowIndex());
    }

    var existComments = this.getComments(oComment.nCol, oComment.nRow);
    if (existComments.length) {
      oComment = existComments[0];
      bChange = true;
    } else {
      if ((oComment.nCol != null) && (oComment.nRow != null)) {
        var cellAddress = new CellAddress(oComment.nRow, oComment.nCol, 0);
        oComment.sQuoteText = cellAddress.getID() + " : " + this.worksheet.model.getCell(cellAddress).getValueWithFormat();
      }
    }
  }

  var onAddCommentCallback = function (isSuccess) {
    if (false === isSuccess)
      return;
    t._addComment(oComment, bChange, bIsNotUpdate);
  };
  this.isLockedComment(oComment, onAddCommentCallback);
};