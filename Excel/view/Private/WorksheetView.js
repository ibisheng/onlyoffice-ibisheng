"use strict";

/* WorksheetView.js
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


		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"];
		var asc_applyFunction = asc.applyFunction;

		// Залочена ли панель для закрепления
		asc.WorksheetView.prototype._isLockedFrozenPane = function (callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return;
			}
			var sheetId = this.model.getId();
			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameFrozenPane);

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
		// Залочен ли весь лист
		asc.WorksheetView.prototype.prototype._isLockedAll = function (callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return;
			}
			var sheetId = this.model.getId();
			var subType = c_oAscLockTypeElemSubType.ChangeProperties;
			var ar = this.activeRange;

			var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
				sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				asc_applyFunction(callback, true);
				callback = undefined;
			}
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/true)) {
				// Редактируем сами
				asc_applyFunction(callback, true);
				return;
			} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
				c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true)) {
				// Уже ячейку кто-то редактирует
				asc_applyFunction(callback, false);
				return;
			}

			this.collaborativeEditing.onStartCheckLock();
			this.collaborativeEditing.addCheckLock(lockInfo);
			this.collaborativeEditing.onEndCheckLock(callback);
		};
		// Функция проверки lock (возвращаемый результат нельзя использовать в качестве ответа, он нужен только для редактирования ячейки)
		asc.WorksheetView.prototype._isLockedCells = function (range, subType, callback) {
			if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
				// Запрещено совместное редактирование
				asc_applyFunction(callback, true);
				return true;
			}
			var sheetId = this.model.getId();
			var isIntersection = false;
			var newCallback = callback;
			var t = this;

			this.collaborativeEditing.onStartCheckLock();
			var isArrayRange = Array.isArray(range);
			var nLength = isArrayRange ? range.length : 1;
			var nIndex = 0;
			var ar = null;

			for (; nIndex < nLength; ++nIndex) {
				ar = isArrayRange ? range[nIndex].clone(true) : range.clone(true);

				if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
				}

				if (false === isIntersection) {
					var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
						sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

					if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
						// Уже ячейку кто-то редактирует
						asc_applyFunction(callback, false);
						return false;
					} else {
						if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
									t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
									t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
									t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
								}
								callback(isSuccess);
							};
						} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
							newCallback = function (isSuccess) {
								if (isSuccess) {
									t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
									t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
								}
								callback(isSuccess);
							};
						}
						this.collaborativeEditing.addCheckLock(lockInfo);
					}
				} else {
					if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
						t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
						t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
						t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
						t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
						t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
						t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
					} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
						t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
						t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
					}
				}
			}

			if (false === this.collaborativeEditing.getCollaborativeEditing()) {
				// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
				newCallback(true);
				newCallback = undefined;
			}
			this.collaborativeEditing.onEndCheckLock(newCallback);
			return true;
		};
	}
)(jQuery, window);
