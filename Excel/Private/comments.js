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
      this.wb.cellCommentator.addComment(oComment);
    } else {
      var ws = this.wb.getWorksheet();
      ws.cellCommentator.addComment(oComment);
    }
  };

  prot = asc['spreadsheet_api'].prototype;
  prot['asc_addComment'] = prot.asc_addComment;
})(jQuery, window);
