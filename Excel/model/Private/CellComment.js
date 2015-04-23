"use strict";

/* CellComment.js
 *
 * Author: Alexander.Trofimov@avsmedia.net
 * Date:   Apr 23, 2015
*/
CCellCommentator.prototype.isLockedComment = function(oComment, callbackFunc) {
	if (false === this.worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) {
		// Запрещено совместное редактирование
		Asc.applyFunction(callbackFunc, true);
		return;
	}

	var objectGuid = oComment.asc_getId();
	if (objectGuid) {
		// Комментарии не должны влиять на lock-листа, поэтому вместо добавления нового c_oAscLockTypeElem, поменяем имя листа
		var sheetId = CCellCommentator.sStartCommentId;
		if (!oComment.bDocument)
			sheetId += this.worksheet.model.getId();

		var lockInfo = this.worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null,
			sheetId, objectGuid);

		if (false === this.worksheet.collaborativeEditing.getCollaborativeEditing()) {
			// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
			Asc.applyFunction(callbackFunc, true);
			callbackFunc = undefined;
		}
		if (false !== this.worksheet.collaborativeEditing.getLockIntersection(lockInfo,
			c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
			// Редактируем сами
			Asc.applyFunction(callbackFunc, true);
			return;
		} else if (false !== this.worksheet.collaborativeEditing.getLockIntersection(lockInfo,
			c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
			// Уже ячейку кто-то редактирует
			Asc.applyFunction(callbackFunc, false);
			return;
		}

		this.worksheet.collaborativeEditing.onStartCheckLock();
		this.worksheet.collaborativeEditing.addCheckLock(lockInfo);
		this.worksheet.collaborativeEditing.onEndCheckLock(callbackFunc);
	}
};