"use strict";

/* api.js
 *
 * Author: Alexander.Trofimov@avsmedia.net
 * Date:   Apr 23, 2015
 */
(
	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
		function ($, window, undefined) {

		var asc = window["Asc"];

		asc['spreadsheet_api'].prototype.asc_addComment = function (oComment) {
			if (oComment.bDocument)
				this.wb.cellCommentator.asc_addComment(oComment);
			else {
				var ws = this.wb.getWorksheet();
				ws.cellCommentator.asc_addComment(oComment);
			}
		};
	}
	)(jQuery, window);
