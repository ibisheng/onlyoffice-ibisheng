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
		var asc_applyFunction = asc.applyFunction;

		asc.spreadsheet_api.prototype._getIsLockObjectSheet = function (lockInfo, callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return;
			}

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};
		// Залочена ли панель для закрепления
		asc.spreadsheet_api.prototype._isLockedTabColor = function (index, callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return;
			}
			var sheetId = this.wbModel.getWorksheet(index).getId();
			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameTabColor);

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};
	}
)(jQuery, window);
