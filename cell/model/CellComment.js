/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
	// Import
	var History = AscCommon.History;

	var c_oAscInsertOptions = Asc.c_oAscInsertOptions;
	var c_oAscDeleteOptions = Asc.c_oAscDeleteOptions;

	/** @constructor */
	function commentTooltipPosition() {
		this.dLeftPX = null;
		this.dReverseLeftPX = null;
		this.dTopPX = null;
	}

	/** @constructor */
	function asc_CCommentCoords() {
		this.nRow = null;
		this.nCol = null;

		this.nLeft = null;
		this.nLeftOffset = null;
		this.nTop = null;
		this.nTopOffset = null;
		this.nRight = null;
		this.nRightOffset = null;
		this.nBottom = null;
		this.nBottomOffset = null;

		this.dLeftMM = null;
		this.dTopMM = null;
		this.dWidthMM = null;
		this.dHeightMM = null;

		this.bMoveWithCells = false;
		this.bSizeWithCells = false;
	}

	asc_CCommentCoords.prototype.clone = function () {
		var res = new asc_CCommentCoords();
		res.nRow = this.nRow;
		res.nCol = this.nCol;

		res.nLeft = this.nLeft;
		res.nLeftOffset = this.nLeftOffset;
		res.nTop = this.nTop;
		res.nTopOffset = this.nTopOffset;
		res.nRight = this.nRight;
		res.nRightOffset = this.nRightOffset;
		res.nBottom = this.nBottom;
		res.nBottomOffset = this.nBottomOffset;

		res.dLeftMM = this.dLeftMM;
		res.dTopMM = this.dTopMM;

		res.dWidthMM = this.dWidthMM;
		res.dHeightMM = this.dHeightMM;

		res.bMoveWithCells = this.bMoveWithCells;
		res.bSizeWithCells = this.bSizeWithCells;

		return res;
	};
	asc_CCommentCoords.prototype.getType = function() {
		return AscCommonExcel.UndoRedoDataTypes.CommentCoords;
	};
	asc_CCommentCoords.prototype.Read_FromBinary2 = function(r) {
		this.nRow = r.GetLong();
		this.nCol = r.GetLong();

		this.nLeft = r.GetLong();
		this.nLeftOffset = r.GetLong();
		this.nTop = r.GetLong();
		this.nTopOffset = r.GetLong();
		this.nRight = r.GetLong();
		this.nRightOffset = r.GetLong();
		this.nBottom = r.GetLong();
		this.nBottomOffset = r.GetLong();

		this.dLeftMM = r.GetDouble();
		this.dTopMM = r.GetDouble();
		this.dWidthMM = r.GetDouble();
		this.dHeightMM = r.GetDouble();

		this.bMoveWithCells = r.GetBool();
		this.bSizeWithCells = r.GetBool();
	};
	asc_CCommentCoords.prototype.Write_ToBinary2 = function(w) {
		w.WriteLong(this.nRow);
		w.WriteLong(this.nCol);

		w.WriteLong(this.nLeft);
		w.WriteLong(this.nLeftOffset);
		w.WriteLong(this.nTop);
		w.WriteLong(this.nTopOffset);
		w.WriteLong(this.nRight);
		w.WriteLong(this.nRightOffset);
		w.WriteLong(this.nBottom);
		w.WriteLong(this.nBottomOffset);

		w.WriteDouble(this.dLeftMM);
		w.WriteDouble(this.dTopMM);
		w.WriteDouble(this.dWidthMM);
		w.WriteDouble(this.dHeightMM);

		w.WriteBool(this.bMoveWithCells);
		w.WriteBool(this.bSizeWithCells);
	};
	asc_CCommentCoords.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.nCol = collaborativeEditing.getLockMeColumn2(nSheetId, this.nCol);
		this.nRow = collaborativeEditing.getLockMeRow2(nSheetId, this.nRow);
	};

	/** @constructor */
	function asc_CCommentData() {
		this.bHidden = false;
		this.wsId = null;
		this.nCol = 0;
		this.nRow = 0;
		this.nId = null;
		this.oParent = null;
		this.nLevel = 0;

		// Common
		this.sText = "";
		this.sTime = "";
		this.sOOTime = "";
		this.sUserId = "";
		this.sUserName = "";
		this.bDocument = true; 	// For compatibility with 'Word Comment Control'
		this.bSolved = false;
		this.aReplies = [];

		this.coords = null;
	}

	asc_CCommentData.prototype.clone = function () {
		var res = new asc_CCommentData();
		res.updateData(this);
		res.coords = this.coords ? this.coords.clone() : null;
		return res;
	};
	asc_CCommentData.prototype.updateData = function (comment) {
		this.bHidden = comment.bHidden;
		this.wsId = comment.wsId;
		this.nCol = comment.nCol;
		this.nRow = comment.nRow;
		this.nId = comment.nId;
		this.oParent = comment.oParent;
		this.nLevel = (null === this.oParent) ? 0 : this.oParent.asc_getLevel() + 1;

		// Common
		this.sText = comment.sText;
		this.sTime = comment.sTime;
		this.sOOTime = comment.sOOTime;
		this.sUserId = comment.sUserId;
		this.sUserName = comment.sUserName;
		this.bDocument = comment.bDocument;
		this.bSolved = comment.bSolved;
		this.aReplies = [];

		for (var i = 0; i < comment.aReplies.length; i++) {
			this.aReplies.push(comment.aReplies[i].clone());
		}
	};
	asc_CCommentData.prototype.guid = function () {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	};
	asc_CCommentData.prototype.setId = function () {
		if (this.bDocument)
			this.nId = "doc_" + this.guid();
		else
			this.nId = "sheet" + this.wsId + "_" + this.guid();
	};

	asc_CCommentData.prototype.asc_putQuoteText = function(val) {};
	asc_CCommentData.prototype.asc_getQuoteText = function() {
		return this.bDocument ? null : AscCommon.g_oCellAddressUtils.getCellId(this.nRow, this.nCol);
	};

	asc_CCommentData.prototype.asc_putRow = function(val) { this.nRow = val; };
	asc_CCommentData.prototype.asc_getRow = function() { return this.nRow; };

	asc_CCommentData.prototype.asc_putCol = function(val) { this.nCol = val; };
	asc_CCommentData.prototype.asc_getCol = function() { return this.nCol; };

	asc_CCommentData.prototype.asc_putId = function(val) { this.nId = val; };
	asc_CCommentData.prototype.asc_getId = function() { return this.nId; };

	asc_CCommentData.prototype.asc_putLevel = function(val) { this.nLevel = val; };
	asc_CCommentData.prototype.asc_getLevel = function() { return this.nLevel; };

	asc_CCommentData.prototype.asc_putParent = function(obj) { this.oParent = obj; };
	asc_CCommentData.prototype.asc_getParent = function() { return this.oParent; };

	asc_CCommentData.prototype.asc_putText = function(val) { this.sText = val ? val.slice(0, Asc.c_oAscMaxCellOrCommentLength) : val; };
	asc_CCommentData.prototype.asc_getText = function() { return this.sText; };

	asc_CCommentData.prototype.asc_putTime = function(val) { this.sTime = val; };
	asc_CCommentData.prototype.asc_getTime = function() { return this.sTime; };

	asc_CCommentData.prototype.asc_putOnlyOfficeTime = function(val) { this.sOOTime = val; };
	asc_CCommentData.prototype.asc_getOnlyOfficeTime = function() { return this.sOOTime; };

	asc_CCommentData.prototype.asc_putUserId = function(val) { this.sUserId = val; };
	asc_CCommentData.prototype.asc_getUserId = function() { return this.sUserId; };

	asc_CCommentData.prototype.asc_putUserName = function(val) { this.sUserName = val; };
	asc_CCommentData.prototype.asc_getUserName = function() { return this.sUserName; };

	asc_CCommentData.prototype.asc_putDocumentFlag = function(val) { this.bDocument = val; };
	asc_CCommentData.prototype.asc_getDocumentFlag = function() { return this.bDocument; };

	asc_CCommentData.prototype.asc_putHiddenFlag = function(val) { this.bHidden = val; };
	asc_CCommentData.prototype.asc_getHiddenFlag = function() { return this.bHidden; };

	asc_CCommentData.prototype.asc_putSolved = function(val) { this.bSolved = val; };
	asc_CCommentData.prototype.asc_getSolved = function() { return this.bSolved; };

	asc_CCommentData.prototype.asc_getRepliesCount = function() { return this.aReplies.length; };
	asc_CCommentData.prototype.asc_getReply = function(index) { return this.aReplies[index]; };

	asc_CCommentData.prototype.asc_addReply = function(oReply) {

		oReply.asc_putParent(this);
		oReply.asc_putDocumentFlag(this.asc_getDocumentFlag());
		oReply.asc_putLevel((oReply.oParent == null) ? 0 : oReply.oParent.asc_getLevel() + 1);
		oReply.wsId = (oReply.oParent == null) ? -1 : oReply.oParent.wsId;
		oReply.setId();
		oReply.asc_putCol(this.nCol);
		oReply.asc_putRow(this.nRow);
		this.aReplies.push(oReply);

		return oReply;
	};

	asc_CCommentData.prototype.asc_getMasterCommentId = function () {
		return this.wsId;
	};

	//	For collaborative editing
	asc_CCommentData.prototype.getType = function() {
		return AscCommonExcel.UndoRedoDataTypes.CommentData;
	};

	asc_CCommentData.prototype.Read_FromBinary2 = function(r) {
		this.wsId = r.GetString2();
		this.nCol = r.GetLong();
		this.nRow = r.GetLong();
		this.nId = r.GetString2();
		this.nLevel = r.GetLong();
		this.sText = r.GetString2();
		this.sTime = r.GetString2();
		this.sOOTime = r.GetString2();
		this.sUserId = r.GetString2();
		this.sUserName = r.GetString2();
		this.bDocument = r.GetBool();
		this.bSolved = r.GetBool();
		this.bHidden = r.GetBool();

		var length = r.GetLong();
		for (var i = 0; i < length; ++i) {
			var reply = new asc_CCommentData();
			reply.Read_FromBinary2(r);
			this.aReplies.push(reply);
		}
	};

	asc_CCommentData.prototype.Write_ToBinary2 = function(w) {
		w.WriteString2(this.wsId);
		w.WriteLong(this.nCol);
		w.WriteLong(this.nRow);
		w.WriteString2(this.nId);
		w.WriteLong(this.nLevel);
		w.WriteString2(this.sText);
		w.WriteString2(this.sTime);
		w.WriteString2(this.sOOTime);
		w.WriteString2(this.sUserId);
		w.WriteString2(this.sUserName);
		w.WriteBool(this.bDocument);
		w.WriteBool(this.bSolved);
		w.WriteBool(this.bHidden);

		w.WriteLong(this.aReplies.length);
		for (var i = 0; i < this.aReplies.length; ++i) {
			this.aReplies[i].Write_ToBinary2(w);
		}
	};

	asc_CCommentData.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		if ( !this.bDocument ) {
			this.nCol = collaborativeEditing.getLockMeColumn2(nSheetId, this.nCol);
			this.nRow = collaborativeEditing.getLockMeRow2(nSheetId, this.nRow);
		}
	};

/** @constructor */
function CCellCommentator(currentSheet) {
	this.worksheet = currentSheet;
	this.model = this.worksheet.model;
	this.overlayCtx = currentSheet.overlayCtx;
	this.drawingCtx = currentSheet.drawingCtx;

	// Drawing settings
	this.commentIconColor = new AscCommon.CColor(255, 144, 0);
	this.commentFillColor = new AscCommon.CColor(255, 255, 0);

	this.lastSelectedId = null;
	this.bSaveHistory = true;
}
CCellCommentator.sStartCommentId = 'comment_';

//-----------------------------------------------------------------------------------
// Public methods
//-----------------------------------------------------------------------------------

CCellCommentator.prototype.isViewerMode = function () {
	return this.worksheet.handlers.trigger("getViewerMode");
};
CCellCommentator.prototype.isLockedComment = function(oComment, callbackFunc) {
	var objectGuid = oComment.asc_getId();
	if (objectGuid) {
		// Комментарии не должны влиять на lock-листа, поэтому вместо добавления нового c_oAscLockTypeElem, поменяем имя листа
		var sheetId = CCellCommentator.sStartCommentId;
		if (!oComment.bDocument)
			sheetId += this.model.getId();

		var lockInfo = this.worksheet.collaborativeEditing.getLockInfo(AscCommonExcel.c_oAscLockTypeElem.Object, /*subType*/null,
			sheetId, objectGuid);
		this.worksheet.collaborativeEditing.lock([lockInfo], callbackFunc);
	}
};

	CCellCommentator.prototype.moveRangeComments = function (rangeFrom, rangeTo, copy) {
		if (rangeFrom && rangeTo) {
			var colOffset = rangeTo.c1 - rangeFrom.c1;
			var rowOffset = rangeTo.r1 - rangeFrom.r1;

			this.model.workbook.handlers.trigger("asc_onHideComment");
			var aComments = this.model.aComments;

			for (var i = 0; i < aComments.length; i++) {
				var comment = aComments[i];
				if (rangeFrom.contains(comment.nCol, comment.nRow)) {
					if (copy) {
						var newComment = comment.clone();
						newComment.nCol += colOffset;
						newComment.nRow += rowOffset;
						newComment.setId();
						this.addComment(newComment, true);
					} else {
						var from = comment.clone();
						comment.nCol += colOffset;
						comment.nRow += rowOffset;
						this.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);

						History.Create_NewPoint();
						History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Change, this.model.getId(),
							null, new AscCommonExcel.UndoRedoData_FromTo(from, comment.clone()));
						this.updateAreaComment(comment);
					}
				}
			}
		}
	};

CCellCommentator.prototype.deleteCommentsRange = function(range) {
	if ( range ) {
		var aCommentId = [], i;
		var aComments = this.model.aComments;
		for (i = 0; i < aComments.length; ++i) {
			var comment = aComments[i];
			if (range.contains(comment.nCol, comment.nRow)) {
				aCommentId.push(comment.asc_getId());
			}
		}
		History.StartTransaction();
		for (i = 0; i < aCommentId.length; i++) {
			this.removeComment(aCommentId[i]);
		}
		History.EndTransaction();
	}
};

	CCellCommentator.prototype.getCommentByXY = function (x, y) {
		var findCol = this.worksheet._findColUnderCursor(this.pxToPt(x), true);
		var findRow = this.worksheet._findRowUnderCursor(this.pxToPt(y), true);
		return (findCol && findRow) ? this.getComment(findCol.col, findRow.row) : null;
	};

	CCellCommentator.prototype.drawCommentCells = function () {

		if (this.isViewerMode() || this.hiddenComments()) {
			return;
		}

		this.drawingCtx.setFillStyle(this.commentIconColor);
		var commentCell, mergedRange, nCol, nRow, x, y, metrics;
		var aComments = this.model.aComments;
		for (var i = 0; i < aComments.length; ++i) {
			commentCell = aComments[i];
			if (this._checkHidden(commentCell)) {
				continue;
			}

			mergedRange = this.model.getMergedByCell(commentCell.nRow, commentCell.nCol);
			nCol = mergedRange ? mergedRange.c2 : commentCell.nCol;
			nRow = mergedRange ? mergedRange.r1 : commentCell.nRow;

			if (metrics = this.worksheet.getCellMetrics(nCol, nRow)) {
				if (0 === metrics.width || 0 === metrics.height) {
					continue;
				}
				x = metrics.left + metrics.width;
				y = metrics.top;
				this.drawingCtx.beginPath();
				this.drawingCtx.moveTo(x - this.pxToPt(7), y);
				this.drawingCtx.lineTo(x - this.pxToPt(1), y);
				this.drawingCtx.lineTo(x - this.pxToPt(1), y + this.pxToPt(6));
				this.drawingCtx.fill();
			}
		}
	};

	CCellCommentator.prototype.updateActiveComment = function () {
		if (this.lastSelectedId) {
			var comment = this.findComment(this.lastSelectedId);
			if (comment) {
				this.drawCommentCells();
				var coords = this.getCommentTooltipPosition(comment);
				var isVisible = (null !==
				this.worksheet.getCellVisibleRange(comment.asc_getCol(), comment.asc_getRow()));
				this.model.workbook.handlers.trigger("asc_onUpdateCommentPosition", [comment.asc_getId()],
					(isVisible ? coords.dLeftPX : -1), (isVisible ? coords.dTopPX : -1),
					(isVisible ? coords.dReverseLeftPX : -1));
			}
		}
	};

CCellCommentator.prototype.updateCommentsDependencies = function(bInsert, operType, updateRange) {
	// ToDo переделать функцию, странная какая-то
	var t = this;
	var UpdatePair = function (comment, bChange) {
		this.comment = comment;
		this.bChange = bChange;
	};
	var aChangedComments = [];		// Array of UpdatePair

	function updateCommentsList(aComments) {
		if (aComments.length) {
			var changeArray = [];
			var removeArray = [];

			for (var i = 0; i < aComments.length; i++) {
				if (aComments[i].bChange) {
					t.bSaveHistory = false;
					t.changeComment(aComments[i].comment.asc_getId(), aComments[i].comment,
						/*bChangeCoords*/true, /*bNoEvent*/true, /*bNoAscLock*/true, /*bNoDraw*/false);
					changeArray.push({"Id": aComments[i].comment.asc_getId(), "Comment": aComments[i].comment});
					t.bSaveHistory = true;
				} else {
					t.removeComment(aComments[i].comment.asc_getId(), /*bNoEvent*/true,
						/*bNoAscLock*/true, /*bNoDraw*/false);
					removeArray.push(aComments[i].comment.asc_getId());
				}
			}

			if (changeArray.length)
				t.model.workbook.handlers.trigger("asc_onChangeComments", changeArray);
			if (removeArray.length)
				t.model.workbook.handlers.trigger("asc_onRemoveComments", removeArray);
		}
	}

	var i, comment;
	var aComments = this.model.aComments;
	if (bInsert) {
		switch (operType) {
			case c_oAscInsertOptions.InsertCellsAndShiftDown:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if ((comment.nRow >= updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
						comment.nRow += updateRange.r2 - updateRange.r1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					}
				}
				break;

			case c_oAscInsertOptions.InsertCellsAndShiftRight:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if ((comment.nCol >= updateRange.c1) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
						comment.nCol += updateRange.c2 - updateRange.c1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					}
				}
				break;

			case c_oAscInsertOptions.InsertColumns:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if (comment.nCol >= updateRange.c1) {
						comment.nCol += updateRange.c2 - updateRange.c1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					}
				}
				break;

			case c_oAscInsertOptions.InsertRows:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if (comment.nRow >= updateRange.r1) {
						comment.nRow += updateRange.r2 - updateRange.r1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					}
				}
				break;
		}
	} else {
		switch (operType) {
			case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if ((comment.nRow > updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
						comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					} else if (updateRange.contains(comment.nCol, comment.nRow)) {
						aChangedComments.push(new UpdatePair(comment, false));
					}
				}
				break;

			case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if ((comment.nCol > updateRange.c2) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
						comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					} else if (updateRange.contains(comment.nCol, comment.nRow)) {
						aChangedComments.push(new UpdatePair(comment, false));
					}
				}
				break;

			case c_oAscDeleteOptions.DeleteColumns:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if (comment.nCol > updateRange.c2) {
						comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					} else if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol)) {
						aChangedComments.push(new UpdatePair(comment, false));
					}
				}
				break;

			case c_oAscDeleteOptions.DeleteRows:
				for (i = 0; i < aComments.length; i++) {
					comment = aComments[i].clone();
					if (comment.nRow > updateRange.r2) {
						comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
						aChangedComments.push(new UpdatePair(comment, true));
					} else if ((updateRange.r1 <= comment.nRow) && (updateRange.r2 >= comment.nRow)) {
						aChangedComments.push(new UpdatePair(comment, false));
					}
				}
				break;
		}
	}
	updateCommentsList(aChangedComments);
};

CCellCommentator.prototype.sortComments = function(sortData) {
	if (null === sortData)
		return;
	var comment, places = sortData.places, i = 0, l = places.length, j, row, line;
	var range = sortData.bbox, oComments = this.getRangeComments(new Asc.Range(range.c1, range.r1, range.c2, range.r2));
	if (null === oComments)
		return;

	History.StartTransaction();

	for (; i < l; ++i) {
		if (oComments.hasOwnProperty((row = places[i].from))) {
			for (j = 0, line = oComments[row]; j < line.length; ++j) {
				comment = line[j].clone();
				comment.nRow = places[i].to;
				this.changeComment(comment.asc_getId(), comment, true, false, true, true);
			}
		}
	}

	History.EndTransaction();
};

CCellCommentator.prototype.resetLastSelectedId = function() {
	this.model.workbook.handlers.trigger('asc_onHideComment');
	this.cleanLastSelection();
	this.lastSelectedId = null;
};

CCellCommentator.prototype.cleanLastSelection = function() {
	var metrics;
	if (this.lastSelectedId) {
		var lastComment = this.findComment(this.lastSelectedId);
		if (lastComment && (metrics = this.worksheet.getCellMetrics(lastComment.nCol, lastComment.nRow))) {
			var extraOffset = this.pxToPt(1);
			this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
		}
	}
};

	CCellCommentator.prototype.updateAreaComments = function () {
		var aComments = this.model.aComments;
		for (var i = 0; i < aComments.length; ++i) {
			this.updateAreaComment(aComments[i]);
		}
	};

	CCellCommentator.prototype.updateAreaComment = function (comment) {
		var lastCoords = comment.coords && comment.coords.clone();
		if (!comment.coords) {
			comment.coords = new asc_CCommentCoords();
		}
		var coords = comment.coords;
		var dWidthPT = 108;
		var dHeightPT = 59.25;
		coords.dWidthMM = this.ptToMm(dWidthPT);
		coords.dHeightMM = this.ptToMm(dHeightPT);

		coords.nCol = comment.nCol;
		coords.nRow = comment.nRow;

		var mergedRange = this.model.getMergedByCell(comment.nRow, comment.nCol);
		/*coords.nLeft = (mergedRange ? mergedRange.c2 : comment.nCol) + 1;
		 if ( !this.worksheet.cols[coords.nLeft] ) {
		 this.worksheet.expandColsOnScroll(true);
		 this.worksheet.handlers.trigger("reinitializeScrollX");
		 }

		 coords.nTop = mergedRange ? mergedRange.r1 : comment.nRow;
		 coords.nLeftOffset = 0;
		 coords.nTopOffset = 0;*/

		var pos;
		var left = mergedRange ? mergedRange.c2 : comment.nCol;
		var x = this.worksheet.getCellLeft(left, 1) + this.worksheet.getColumnWidth(left, 1) + 10.5;
		coords.dLeftMM = this.ptToMm(x);
		pos = this.worksheet._findColUnderCursor(x, true);
		coords.nLeft = pos ? pos.col : 0;
		coords.nLeftOffset = this.ptToPx(x - this.worksheet.getCellLeft(coords.nLeft, 1));

		var top = mergedRange ? mergedRange.r1 : comment.nRow;
		var y = this.worksheet.getCellTop(top, 1) + - 8.25;
		coords.dTopMM = this.ptToMm(y);
		pos = this.worksheet._findRowUnderCursor(y, true);
		coords.nTop = pos ? pos.row : 0;
		coords.nTopOffset = this.ptToPx(y - this.worksheet.getCellTop(coords.nTop, 1));

		x += dWidthPT;
		pos = this.worksheet._findColUnderCursor(x, true);
		coords.nRight = pos ? pos.col : 0;
		coords.nRightOffset = this.ptToPx(x - this.worksheet.getCellLeft(coords.nRight, 1));

		y += dHeightPT;
		pos = this.worksheet._findRowUnderCursor(y, true);
		coords.nBottom = pos ? pos.row : 0;
		coords.nBottomOffset = this.ptToPx(y - this.worksheet.getCellTop(coords.nBottom, 1));

		History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Coords, this.model.getId(), null,
			new AscCommonExcel.UndoRedoData_FromTo(lastCoords, coords.clone()));
	};

	CCellCommentator.prototype.getCommentTooltipPosition = function(comment) {
		var pos = new commentTooltipPosition();

		var fvr = this.worksheet.getFirstVisibleRow(false);
		var fvc = this.worksheet.getFirstVisibleCol(false);

		var headerCellsOffset = this.worksheet.getCellsOffset(1);

		var mergedRange = this.model.getMergedByCell(comment.nRow, comment.nCol);
		var left = mergedRange ? mergedRange.c2 : comment.nCol;
		var top = mergedRange ? mergedRange.r1 : comment.nRow;

		var frozenOffset = this.worksheet.getFrozenPaneOffset();
		if (this.worksheet.topLeftFrozenCell) {
			if (comment.nCol < fvc) {
				frozenOffset.offsetX = 0;
				fvc = 0;
			}
			if (comment.nRow < fvr) {
				frozenOffset.offsetY = 0;
				fvr = 0;
			}
		}

		var dReverseLeftPT = this.worksheet.getCellLeft(left, 1) - this.worksheet.getCellLeft(fvc, 1) +
			headerCellsOffset.left + frozenOffset.offsetX;
		pos.dReverseLeftPX = this.ptToPx(dReverseLeftPT);
		pos.dLeftPX = this.ptToPx(dReverseLeftPT + this.worksheet.getColumnWidth(left, 1));
		pos.dTopPX = this.ptToPx(this.worksheet.getCellTop(top, 1) + ((this.worksheet.getRowHeight(top, 1) / 2) | 0) -
			this.worksheet.getCellTop(fvr, 1) + headerCellsOffset.top + frozenOffset.offsetY);

		if (AscCommon.AscBrowser.isRetina) {
			pos.dLeftPX = AscCommon.AscBrowser.convertToRetinaValue(pos.dLeftPX);
			pos.dTopPX = AscCommon.AscBrowser.convertToRetinaValue(pos.dTopPX);
			pos.dReverseLeftPX = AscCommon.AscBrowser.convertToRetinaValue(pos.dReverseLeftPX);
		}
		return pos;
	};

	CCellCommentator.prototype.cleanSelectedComment = function () {
		var metrics;
		if (this.lastSelectedId) {
			var comment = this.findComment(this.lastSelectedId);
			if (comment && !this._checkHidden(comment) &&
				(metrics = this.worksheet.getCellMetrics(comment.asc_getCol(), comment.asc_getRow()))) {
				this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width, metrics.height);
			}
		}
	};

	//-----------------------------------------------------------------------------------
	// Misc methods
	//-----------------------------------------------------------------------------------

	CCellCommentator.prototype.pxToPt = function (val) {
		return val * this.ascCvtRatio(0, 1);
	};

	CCellCommentator.prototype.ptToPx = function(val) {
		return val * this.ascCvtRatio(1, 0);
	};

	CCellCommentator.prototype.ptToMm = function(val) {
		return val * this.ascCvtRatio(1, 3);
	};

	CCellCommentator.prototype.mmToPx = function (val) {
		return val * this.ascCvtRatio(3, 0);
	};

	CCellCommentator.prototype.ascCvtRatio = function (fromUnits, toUnits) {
		return Asc.getCvtRatio(fromUnits, toUnits, this.overlayCtx.getPPIX());
	};

	CCellCommentator.prototype.showCommentById = function (id, bNew) {
		this._showComment(this.findComment(id), bNew);
	};
	CCellCommentator.prototype.showCommentByXY = function (x, y) {
		this._showComment(this.getCommentByXY(x, y), false);
	};

	CCellCommentator.prototype._showComment = function (comment, bNew) {
		if (comment && !this._checkHidden(comment)) {
			var coords = this.getCommentTooltipPosition(comment);
			this.model.workbook.handlers.trigger("asc_onShowComment", [comment.asc_getId()], coords.dLeftPX,
				coords.dTopPX, coords.dReverseLeftPX, bNew);
			this.drawCommentCells();
			this.lastSelectedId = comment.asc_getId();
		} else {
			this.lastSelectedId = null;
		}
	};

CCellCommentator.prototype.selectComment = function(id, bMove) {
	var comment = this.findComment(id);
	var metrics;

	// Чистим предыдущий селект
	this.cleanLastSelection();
	this.lastSelectedId = null;

	if (comment && !this._checkHidden(comment)) {

		this.lastSelectedId = id;

		var col = comment.asc_getCol();
		var row = comment.asc_getRow();
		var fvc = this.worksheet.getFirstVisibleCol(true);
		var fvr = this.worksheet.getFirstVisibleRow(true);
		var lvc = this.worksheet.getLastVisibleCol();
		var lvr = this.worksheet.getLastVisibleRow();

		var offset;
		if ( bMove ) {
			if ( (row < fvr) || (row > lvr) ) {
				offset = row - fvr - Math.round(( lvr - fvr ) / 2);
				this.worksheet.scrollVertical(offset);
				this.worksheet.handlers.trigger("reinitializeScrollY");
			}
			if ( (col < fvc) || (col > lvc) ) {
				offset = col - fvc - Math.round(( lvc - fvc ) / 2);
				this.worksheet.scrollHorizontal(offset);
				this.worksheet.handlers.trigger("reinitializeScrollX");
			}
		}

		if (metrics = this.worksheet.getCellMetrics(col, row)) {
			var extraOffset = this.pxToPt(1);
			this.overlayCtx.ctx.globalAlpha = 0.2;
			this.overlayCtx.beginPath();
			this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
			this.overlayCtx.setFillStyle(this.commentFillColor);
			this.overlayCtx.fillRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
			this.overlayCtx.ctx.globalAlpha = 1;
		}
	}
};

CCellCommentator.prototype.findComment = function(id) {
	function checkCommentId(id, commentObject) {

		if (commentObject.asc_getId() == id)
			return commentObject;

		for (var i = 0; i < commentObject.aReplies.length; i++) {
			var comment = checkCommentId(id, commentObject.aReplies[i]);
			if (comment)
				return comment;
		}
		return null;
	}

	var aComments = this.model.aComments;
	for (var i = 0; i < aComments.length; i++) {
		var commentCell = aComments[i];
		var obj = checkCommentId(id, commentCell);
		if (obj)
			return obj;
	}
	return null;
};

CCellCommentator.prototype.addComment = function(comment, bIsNotUpdate) {
};

CCellCommentator.prototype.changeComment = function(id, oComment, bChangeCoords, bNoEvent, bNoAscLock, bNoDraw) {
	var t = this;
	var comment = this.findComment(id);
	if (null === comment)
		return;

	var onChangeCommentCallback = function (isSuccess) {
		if (false === isSuccess)
			return;

		var from = comment.clone();
		if (comment) {
			if ( bChangeCoords ) {
				comment.asc_putCol(oComment.asc_getCol());
				comment.asc_putRow(oComment.asc_getRow());
			}
			comment.asc_putText(oComment.asc_getText());
			comment.asc_putQuoteText(oComment.asc_getQuoteText());
			comment.asc_putUserId(oComment.asc_getUserId());
			comment.asc_putUserName(oComment.asc_getUserName());
			comment.asc_putTime(oComment.asc_getTime());
			comment.asc_putSolved(oComment.asc_getSolved());
			comment.asc_putHiddenFlag(oComment.asc_getHiddenFlag());
			comment.aReplies = [];

			var count = oComment.asc_getRepliesCount();
			for (var i = 0; i < count; i++) {
				comment.asc_addReply(oComment.asc_getReply(i));
			}
			if ( !bNoEvent )
				t.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
		}

		if ( t.bSaveHistory ) {
			History.Create_NewPoint();
			History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Change, t.model.getId(), null,
				new AscCommonExcel.UndoRedoData_FromTo(from, comment.clone()));
			if (bChangeCoords) {
				this.updateAreaComment(comment);
			}
		}

		if (!bNoDraw)
			t.drawCommentCells();
	};

	if (bNoAscLock)
		onChangeCommentCallback(true);
	else
		this.isLockedComment(comment, onChangeCommentCallback);
};

CCellCommentator.prototype.removeComment = function(id, bNoEvent, bNoAscLock, bNoDraw) {
	var t = this;
	var comment = this.findComment(id);
	if (null === comment)
		return;

	var onRemoveCommentCallback = function (isSuccess) {
		if (false === isSuccess)
			return;

		t._removeComment(comment, bNoEvent, !bNoDraw);
	};

	if (bNoAscLock)
		onRemoveCommentCallback(true);
	else
		this.isLockedComment(comment, onRemoveCommentCallback);
};

// Extra functions

	CCellCommentator.prototype.getComment = function (col, row) {
		// Array of root items
		var comment = null;
		var _col = col, _row = row, mergedRange = null;
		var aComments = this.model.aComments;
		var length = aComments.length;

		if (this.hiddenComments()) {
			return comment;
		}

		if (0 < length) {
			if (null == _col || null == _row) {
				var activeCell = this.model.selectionRange.activeCell;
				_col = activeCell.col;
				_row = activeCell.row;
			} else {
				mergedRange = this.model.getMergedByCell(row, col);
			}

			for (var i = 0; i < length; i++) {
				var commentCell = aComments[i];
				if (!mergedRange) {
					if (_col === commentCell.nCol && _row === commentCell.nRow) {
						comment = commentCell;
					}
				} else {
					if (mergedRange.contains(commentCell.nCol, commentCell.nRow)) {
						comment = commentCell;
					}
				}
				if (comment) {
					return this._checkHidden(comment) ? null : comment;
				}
			}
		}
		return comment;
	};

	CCellCommentator.prototype.getRangeComments = function (range) {
		var oComments = {};
		if (this.hiddenComments()) {
			return null;
		}

		var aComments = this.model.aComments;
		var i, length, comment, bEmpty = true;
		for (i = 0, length = aComments.length; i < length; ++i) {
			comment = aComments[i];
			if (range.contains(comment.nCol, comment.nRow)) {
				bEmpty = false;
				if (!oComments.hasOwnProperty(comment.nRow)) {
					oComments[comment.nRow] = [];
				}
				oComments[comment.nRow].push(comment);
			}
		}

		return bEmpty ? null : oComments;
	};

	CCellCommentator.prototype._checkHidden = function (comment) {
		return this.hiddenComments() || comment.asc_getDocumentFlag() || comment.asc_getHiddenFlag() ||
			(comment.asc_getSolved() && !this.showSolved()) || 0 !== comment.nLevel;
	};

CCellCommentator.prototype._addComment = function (oComment, bChange, bIsNotUpdate) {
	// Add new comment
	if (!bChange) {
		History.Create_NewPoint();
		History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Add, this.model.getId(), null, oComment.clone());
		if (!oComment.bDocument) {
			this.updateAreaComment(oComment);
		}

		this.model.aComments.push(oComment);

		if (!bIsNotUpdate)
			this.drawCommentCells();
	}
	this.model.workbook.handlers.trigger('addComment', oComment.asc_getId(), oComment);
};

	CCellCommentator.prototype._removeComment = function (comment, bNoEvent, isDraw) {
		if (!comment) {
			return;
		}

		var aComments = this.model.aComments;
		var i, id = comment.asc_getId();
		if (comment.oParent) {
			for (i = 0; i < comment.oParent.aReplies.length; ++i) {
				if (comment.asc_getId() == comment.oParent.aReplies[i].asc_getId()) {

					if (this.bSaveHistory) {
						History.Create_NewPoint();
						History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Remove,
							this.model.getId(), null, comment.oParent.aReplies[i].clone());
					}

					comment.oParent.aReplies.splice(i, 1);
					break;
				}
			}
		} else {
			for (i = 0; i < aComments.length; i++) {
				if (comment.asc_getId() == aComments[i].asc_getId()) {

					if (this.bSaveHistory) {
						History.Create_NewPoint();
						if (!aComments[i].bDocument) {
							History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Coords,
								this.model.getId(), null,
								new AscCommonExcel.UndoRedoData_FromTo(aComments[i].coords.clone(), null));
						}
						History.Add(AscCommonExcel.g_oUndoRedoComment, AscCH.historyitem_Comment_Remove,
							this.model.getId(), null, aComments[i].clone());
					}

					aComments.splice(i, 1);
					break;
				}
			}
			if (isDraw) {
				this.worksheet.draw();
			}
		}

		if (isDraw) {
			this.drawCommentCells();
		}
		if (!bNoEvent) {
			this.model.workbook.handlers.trigger('removeComment', id);
		}
	};

CCellCommentator.prototype.isMissComments = function (range) {
	var aComments = this.model.aComments;
	var oComment, bMiss = false;
	for (var i = 0, length = aComments.length; i < length; ++i) {
		oComment = aComments[i];
		if (!oComment.bHidden && range.contains(oComment.nCol, oComment.nRow)) {
			if (bMiss)
				return true;
			bMiss = true;
		}
	}

	return false;
};

CCellCommentator.prototype.mergeComments = function (range) {
	var aComments = this.model.aComments;
	var i, length, deleteComments = [], oComment, r1 = range.r1, c1 = range.c1, mergeComment = null;
	for (i = 0, length = aComments.length; i < length; ++i) {
		oComment = aComments[i];
		if (range.contains(oComment.nCol, oComment.nRow)) {
			if (null === mergeComment)
				mergeComment = oComment;
			else if (oComment.nRow <= mergeComment.nRow && oComment.nCol < mergeComment.nCol) {
				deleteComments.push(mergeComment);
				mergeComment = oComment;
			} else
				deleteComments.push(oComment);
		}
	}

	if (mergeComment && (mergeComment.nCol !== c1 || mergeComment.nRow !== r1)) {
		this._removeComment(mergeComment, false, false);

		// add Comment
		mergeComment.nCol = c1;
		mergeComment.nRow = r1;
		this._addComment(mergeComment, false, true);
	}
	for (i = 0, length = deleteComments.length; i < length; ++i) {
		this._removeComment(deleteComments[i], false, false);
	}
};

// Undo/Redo

CCellCommentator.prototype.Undo = function(type, data) {
	var aComments = this.model.aComments;
	var i, comment;
	switch (type) {

		case AscCH.historyitem_Comment_Add:
			if (data.oParent) {
				comment = this.findComment(data.oParent.asc_getId());
				for (i = 0; i < comment.aReplies.length; i++) {
					if (comment.aReplies[i].asc_getId() == data.asc_getId()) {
						comment.aReplies.splice(i, 1);
						break;
					}
				}
			} else {
				for (i = 0; i < aComments.length; i++) {
					if (aComments[i].asc_getId() == data.asc_getId()) {
						aComments.splice(i, 1);
						this.model.workbook.handlers.trigger('removeComment', data.asc_getId());
						break;
					}
				}
			}
			break;

		case AscCH.historyitem_Comment_Remove:
			if (data.oParent) {
				comment = this.findComment(data.oParent.asc_getId());
				comment.aReplies.push(data);
			} else {
				aComments.push(data);
				this.model.workbook.handlers.trigger('addComment', data.asc_getId(), data);
			}
			break;

		case AscCH.historyitem_Comment_Change:
			if (data.to.oParent) {
				comment = this.findComment(data.to.oParent.asc_getId());
				for (i = 0; i < comment.aReplies.length; i++) {
					if (comment.aReplies[i].asc_getId() == data.asc_getId()) {
						comment.aReplies.splice(i, 1);
						comment.aReplies.push(data.from);
						break;
					}
				}
			} else {
				comment = this.findComment(data.to.asc_getId());
				comment.updateData(data.from);
				this.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
			}
			break;

		case AscCH.historyitem_Comment_Coords:
			if (data.from) {
				comment = this.getComment(data.from.nCol, data.from.nRow);
				if (comment) {
					comment.coords = data.from.clone();
				}
			}
			break;
	}
};

CCellCommentator.prototype.Redo = function(type, data) {
	var aComments = this.model.aComments;
	var comment, i;
	switch (type) {

		case AscCH.historyitem_Comment_Add:
			if (data.oParent) {
				comment = this.findComment(data.oParent.asc_getId());
				comment.aReplies.push(data);
			} else {
				aComments.push(data);
				this.model.workbook.handlers.trigger('addComment', data.asc_getId(), data);
			}
			break;

		case AscCH.historyitem_Comment_Remove:
			if (data.oParent) {
				comment = this.findComment(data.oParent.asc_getId());
				for (i = 0; i < comment.aReplies.length; i++) {
					if (comment.aReplies[i].asc_getId() == data.asc_getId()) {
						comment.aReplies.splice(i, 1);
						break;
					}
				}
			} else {
				for (i = 0; i < aComments.length; i++) {
					if (aComments[i].asc_getId() == data.asc_getId()) {
						aComments.splice(i, 1);
						this.model.workbook.handlers.trigger('removeComment', data.asc_getId());
						break;
					}
				}
			}
			break;

		case AscCH.historyitem_Comment_Change:
			if (data.from.oParent) {
				comment = this.findComment(data.from.oParent.asc_getId());
				for (i = 0; i < comment.aReplies.length; i++) {
					if (comment.aReplies[i].asc_getId() == data.asc_getId()) {
						comment.aReplies.splice(i, 1);
						comment.aReplies.push(data.to);
						break;
					}
				}
			} else {
				comment = this.findComment(data.from.asc_getId());
				comment.updateData(data.to);
				this.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
			}
			break;

		case AscCH.historyitem_Comment_Coords:
			if (data.to) {
				comment = this.getComment(data.to.nCol, data.to.nRow);
				if (comment) {
					comment.coords = data.to.clone();
				}
			}
			break;
	}
};

	CCellCommentator.prototype.hiddenComments = function () {
		return this.model.workbook.handlers.trigger('hiddenComments');
	};
	CCellCommentator.prototype.showSolved = function () {
		return this.model.workbook.handlers.trigger('showSolved');
	};

	//----------------------------------------------------------export----------------------------------------------------
	var prot;
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window["AscCommonExcel"].asc_CCommentCoords = asc_CCommentCoords;
	window["AscCommonExcel"].CCellCommentator = CCellCommentator;

	window['Asc'] = window['Asc'] || {};
	window["Asc"]["asc_CCommentData"] = window["Asc"].asc_CCommentData = asc_CCommentData;
	prot = asc_CCommentData.prototype;
	prot["asc_putRow"] = prot.asc_putRow;
	prot["asc_getRow"] = prot.asc_getRow;
	prot["asc_putCol"] = prot.asc_putCol;
	prot["asc_getCol"] = prot.asc_getCol;
	prot["asc_putId"] = prot.asc_putId;
	prot["asc_getId"] = prot.asc_getId;
	prot["asc_putLevel"] = prot.asc_putLevel;
	prot["asc_getLevel"] = prot.asc_getLevel;
	prot["asc_putParent"] = prot.asc_putParent;
	prot["asc_getParent"] = prot.asc_getParent;
	prot["asc_putText"] = prot.asc_putText;
	prot["asc_getText"] = prot.asc_getText;
	prot["asc_putQuoteText"] = prot.asc_putQuoteText;
	prot["asc_getQuoteText"] = prot.asc_getQuoteText;
	prot["asc_putTime"] = prot.asc_putTime;
	prot["asc_getTime"] = prot.asc_getTime;
	prot["asc_putOnlyOfficeTime"] = prot.asc_putOnlyOfficeTime;
	prot["asc_getOnlyOfficeTime"] = prot.asc_getOnlyOfficeTime;
	prot["asc_putUserId"] = prot.asc_putUserId;
	prot["asc_getUserId"] = prot.asc_getUserId;
	prot["asc_putUserName"] = prot.asc_putUserName;
	prot["asc_getUserName"] = prot.asc_getUserName;
	prot["asc_putDocumentFlag"] = prot.asc_putDocumentFlag;
	prot["asc_getDocumentFlag"] = prot.asc_getDocumentFlag;
	prot["asc_putHiddenFlag"] = prot.asc_putHiddenFlag;
	prot["asc_getHiddenFlag"] = prot.asc_getHiddenFlag;
	prot["asc_putSolved"] = prot.asc_putSolved;
	prot["asc_getSolved"] = prot.asc_getSolved;
	prot["asc_getRepliesCount"] = prot.asc_getRepliesCount;
	prot["asc_getReply"] = prot.asc_getReply;
	prot["asc_addReply"] = prot.asc_addReply;
	prot["asc_getMasterCommentId"] = prot.asc_getMasterCommentId;
})(window);
