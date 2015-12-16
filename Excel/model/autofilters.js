"use strict";
var maxValCol = 20000;
var maxValRow = 100000;

var maxIndividualValues = 10000;
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
		var prot;

		var g_oAutoFiltersOptionsElementsProperties = {
			val		    : 0,
			visible	    : 1,
			text        : 2,
			isDateFormat: 3
		};
		function AutoFiltersOptionsElements () {
			if ( !(this instanceof AutoFiltersOptionsElements) ) {return new AutoFiltersOptionsElements();}

			this.Properties = g_oAutoFiltersOptionsElementsProperties;

			this.val = null;
			this.text = null;
			this.visible = null;
			this.isDateFormat = null;
		}
		AutoFiltersOptionsElements.prototype = {
			constructor: AutoFiltersOptionsElements,

			getType: function () {
				return UndoRedoDataTypes.AutoFiltersOptionsElements;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.val: return this.val; break;
					case this.Properties.visible: return this.visible; break;
					case this.Properties.text: return this.text; break;
					case this.Properties.isDateFormat: return this.isDateFormat; break;
				}

				return null;
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.val: this.val = value;break;
					case this.Properties.visible: this.visible = value;break;
					case this.Properties.text: this.text = value;break;
					case this.Properties.isDateFormat: this.isDateFormat = value;break;
				}
			},
			
			clone : function()
			{
				var res = new AutoFiltersOptionsElements();
				
				res.val = this.val;
				res.text = this.text;
				res.visible = this.visible;
				res.isDateFormat = this.isDateFormat;
				res.Properties = this.Properties;
				
				return res;
			},
			
			asc_getVal: function () { return this.val; },
			asc_getVisible: function () { return this.visible; },
			asc_getText: function () { return this.text; },
			asc_getIsDateFormat: function () { return this.isDateFormat; },
			
			asc_setVal: function (val) { this.val = val; },
			asc_setVisible: function (val) { this.visible = val; },
			asc_setText: function (val) { this.text = val; },
			asc_setIsDateFormat: function (val) { this.isDateFormat = val; }
		};

		/** @constructor */
		function formatTablePictures (options) {
			if ( !(this instanceof formatTablePictures) ) {return new formatTablePictures(options);}

			this.name = options.name;
			this.displayName = options.displayName;
			this.type = options.type;
			this.image = options.image;
		}
		formatTablePictures.prototype = {
			constructor: formatTablePictures,

			asc_getName: function () { return this.name; },
			asc_getDisplayName: function () { return this.displayName; },
			asc_getType: function () { return this.type; },
			asc_getImage: function () { return this.image; }
		};
		
		var g_oAutoFiltersOptionsProperties = {
			cellId		: 0,
			values		: 1,
			filter		: 2, 
			automaticRowCount : 3,
			displayName: 4
		};
		function AutoFiltersOptions () {

			if ( !(this instanceof AutoFiltersOptions) ) {return new AutoFiltersOptions();}

			this.Properties = g_oAutoFiltersOptionsProperties;

			this.cellId  = null;
			this.values  = null;
			this.filter  = null;
			this.sortVal = null;
			this.automaticRowCount = null;
			this.displayName  = null;
			
			return this;
		}
		AutoFiltersOptions.prototype = {
			constructor: AutoFiltersOptions,

			getType : function () {
				return UndoRedoDataTypes.AutoFiltersOptions;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.cellId: return this.cellId; break;
					case this.Properties.values: return this.values; break;
					case this.Properties.filter: return this.filter; break;
					case this.Properties.automaticRowCount: return this.automaticRowCount; break;
					case this.Properties.displayName: return this.displayName; break;
				}

				return null;
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.cellId: this.cellId = value;break;
					case this.Properties.values: this.values = value;break;
					case this.Properties.filter: this.filter = value;break;
					case this.Properties.automaticRowCount: this.automaticRowCount = value;break;
					case this.Properties.displayName: this.displayName = value;break;
				}
			},
			
			asc_setCellId : function(cellId) { this.cellId = cellId;},
			asc_setValues : function(values) { this.values = values; },
			asc_setFilterObj : function(filter) { this.filter = filter; },
			
			asc_setSortState : function(sortVal) { this.sortVal = sortVal; },
			asc_setAutomaticRowCount : function(val) { this.automaticRowCount = val; },
			
			asc_setDiplayName : function(val) { this.displayName = val; },
			
			asc_getCellId : function() { return this.cellId; },
			asc_getValues : function() { return this.values; },
			asc_getFilterObj : function() { return this.filter; },
			
			asc_getSortState : function() { return this.sortVal; },
			asc_getDisplayName : function(val) { return this.displayName; }
		};
		
		var g_oAutoFilterObj = {
			type		: 0,
			filter		: 1
		};
		function AutoFilterObj () {

			if ( !(this instanceof AutoFilterObj) ) {return new AutoFilterObj();}

			this.Properties = g_oAutoFilterObj;
			
			this.type = null;
			this.filter = null;
			
			return this;
		}
		AutoFilterObj.prototype = {
			constructor: AutoFilterObj,
			getType : function () {
				return UndoRedoDataTypes.AutoFilterObj;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.type: return this.type; break;
					case this.Properties.filter: return this.filter; break;
				}
				return null;
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.type: this.type = value;break;
					case this.Properties.filter: this.filter = value;break;
				}
			},
			
			asc_setType : function(type) { this.type = type;},
			asc_setFilter : function(filter) { this.filter = filter;},

			asc_getType : function() { return this.type; },
			asc_getFilter : function() { return this.filter; }
		};
		
		var g_oAddFormatTableOptionsProperties = {
			range		: 0,
			isTitle		: 1
		};
		function AddFormatTableOptions () {

			if ( !(this instanceof AddFormatTableOptions) ) {return new AddFormatTableOptions();}

			this.Properties = g_oAddFormatTableOptionsProperties;
			
			this.range = null;
			this.isTitle = null;
			return this;
		}
		AddFormatTableOptions.prototype = {
			constructor: AddFormatTableOptions,
			getType : function () {
				return UndoRedoDataTypes.AddFormatTableOptions;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.range: return this.range; break;
					case this.Properties.isTitle: return this.isTitle; break;
				}
				return null;
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.range: this.range = value;break;
					case this.Properties.isTitle: this.isTitle = value;break;
				}
			},
			
			asc_setRange : function(range) { this.range = range;},
			asc_setIsTitle : function(isTitle) { this.isTitle = isTitle;},

			asc_getRange : function() { return this.range; },
			asc_getIsTitle : function() { return this.isTitle; }
		};
		
		/** @constructor */
		function AutoFilters(currentSheet) {
			this.worksheet = currentSheet;
			this.changeFilters = null;

			this.m_oColor = new CColor(120, 120, 120);
			return this;
		}

		AutoFilters.prototype = {

			constructor: AutoFilters,
			
			addAutoFilter: function(styleName, activeRange, addFormatTableOptionsObj, offLock, bWithoutFilter, tablePartDisplayName)
			{
				var aWs = this._getCurrentWS(), addNameColumn, filterRange, t = this, ws = this.worksheet, cloneFilter;
				var isTurnOffHistory = aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges;
				
				var tempRange =  new Asc.Range(activeRange.c1, activeRange.r1, activeRange.c2, activeRange.r2);
				if(addFormatTableOptionsObj === false)
					addNameColumn = true;
				else if(addFormatTableOptionsObj && typeof addFormatTableOptionsObj == 'object')
				{
					tempRange = addFormatTableOptionsObj.asc_getRange();
                    addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
					tempRange = Asc.g_oRangeCache.getAscRange(tempRange).clone();
				}
				else if(addFormatTableOptionsObj === true)
					addNameColumn = false;
				
				
				//expand range
				var tablePartsContainsRange = this._isTablePartsContainsRange(tempRange);
				if(tablePartsContainsRange)
				{
					filterRange = tablePartsContainsRange.Ref.clone();
				}
				else if(tempRange.isOneCell())
					filterRange = this._getAdjacentCellsAF(tempRange, aWs);
				else
					filterRange = tempRange;
				
				var rangeWithoutDiff = filterRange.clone();
				if(addNameColumn)
					filterRange.r2 = filterRange.r2 + 1;	
				
				
				//*****callBack on add filter
				var addFilterCallBack = function()
				{	
					History.Create_NewPoint();
					History.StartTransaction();
					
					if(tablePartsContainsRange)
					{
						cloneFilter = tablePartsContainsRange.clone(null);
						tablePartsContainsRange.AutoFilter = new AutoFilter();
						tablePartsContainsRange.AutoFilter.Ref = tablePartsContainsRange.Ref.clone();
						
						//history
						t._addHistoryObj(cloneFilter, historyitem_AutoFilter_Add,
							{activeCells: activeRange, styleName: styleName}, null, cloneFilter.Ref);
					}
					else
					{
						if(addNameColumn && filterRange.r2 >= gc_nMaxRow)
							filterRange.r2 = gc_nMaxRow - 1;
						
						if(styleName)
							aWs.getRange3(filterRange.r1, filterRange.c1, filterRange.r2, filterRange.c2).unmerge();
						
						if(addNameColumn && !isTurnOffHistory)
						{
							if(t._isEmptyCellsUnderRange(rangeWithoutDiff))
								aWs._moveRange(filterRange,  new Asc.Range(filterRange.c1, filterRange.r1 + 1, filterRange.c2, filterRange.r2));
							else
							{
								//shift down not empty range and move 
								aWs.getRange3(filterRange.r2, filterRange.c1, filterRange.r2, filterRange.c2).addCellsShiftBottom();
								aWs._moveRange(filterRange,  new Asc.Range(filterRange.c1, filterRange.r1 + 1, filterRange.c2, filterRange.r2));
								//if down tablePart
								t.insertRows("insCell", new Asc.Range(filterRange.c1, filterRange.r2, filterRange.c2, filterRange.r2), c_oAscInsertOptions.InsertCellsAndShiftDown);
							}	
						}

						//add to model
						var newTablePart = t._addNewFilter(filterRange, styleName, bWithoutFilter, tablePartDisplayName);
						var newDisplayName = newTablePart && newTablePart.DisplayName ? newTablePart.DisplayName : null;
						
						if(styleName)
							t._setColorStyleTable(aWs.TableParts[aWs.TableParts.length - 1].Ref, aWs.TableParts[aWs.TableParts.length - 1], null, true);
						
						//history
						t._addHistoryObj({Ref: filterRange}, historyitem_AutoFilter_Add,
							{activeCells: filterRange, styleName: styleName, addFormatTableOptionsObj: addFormatTableOptionsObj, displayName: newDisplayName}, null, filterRange, bWithoutFilter);
						History.SetSelectionRedo(filterRange);
					}
					
					//updates
					if(styleName && addNameColumn)
						ws.setSelection(filterRange);
					ws._onUpdateFormatTable(filterRange, !!(styleName), true);
					
					History.EndTransaction();
				};
				
				//не лочим в случае обыкновенного а/ф
				if(isTurnOffHistory || !styleName || offLock)
					addFilterCallBack(true);
				else
					ws._isLockedCells(filterRange, /*subType*/null, addFilterCallBack);
			},
			
			deleteAutoFilter: function(activeRange, offLock)
			{
				var aWs = this._getCurrentWS(), filterRange, t = this, ws = this.worksheet, cloneFilter;
				var isTurnOffHistory = aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges;
				activeRange = activeRange.clone();
				
				//expand range
				var tablePartsContainsRange = this._isTablePartsContainsRange(activeRange);
				if(tablePartsContainsRange)
					filterRange = tablePartsContainsRange.Ref.clone();
				else
					filterRange = aWs.AutoFilter.Ref;
					
					
				//*****callBack on delete filter
				var addFilterCallBack = function()
				{	
					History.Create_NewPoint();
					History.StartTransaction();
					
					if(tablePartsContainsRange)
					{
						cloneFilter = tablePartsContainsRange.clone(null);
						
						t._openHiddenRows(cloneFilter);
						tablePartsContainsRange.AutoFilter = null;
					}
					else
					{
						cloneFilter = aWs.AutoFilter.clone();
						
						aWs.AutoFilter = null;
						t._openHiddenRows(cloneFilter);
					}
					
					//history
					t._addHistoryObj(cloneFilter, historyitem_AutoFilter_Delete,
						{activeCells: activeRange}, null, cloneFilter.Ref);

					//updates
					t.drawAutoF(filterRange);
					t._setStyleTablePartsAfterOpenRows(filterRange);
					ws._onUpdateFormatTable(filterRange, false, true);
					
					History.EndTransaction();
				};
				
				//не лочим в случае обыкновенного а/ф
				if(isTurnOffHistory || offLock)
					addFilterCallBack(true);
				else
					ws._isLockedCells(filterRange, /*subType*/null, addFilterCallBack);
				
			},
			
			changeTableStyleInfo: function(styleName, activeRange, tableName)
			{
				var aWs = this._getCurrentWS(), filterRange, t = this, ws = this.worksheet, cloneFilter;
				var isTurnOffHistory = aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges;
				
				activeRange = activeRange.clone();
				
				//calculate lock range and callback parameters
				var isTablePartsContainsRange = this._isTablePartsContainsRange(activeRange);
				if(isTablePartsContainsRange !== null)//if one of the tableParts contains activeRange
					filterRange = isTablePartsContainsRange.Ref.clone();
				
				
				var addFilterCallBack = function()
				{
					History.Create_NewPoint();
					History.StartTransaction();
					
					cloneFilter = isTablePartsContainsRange.clone(null);
							
					isTablePartsContainsRange.TableStyleInfo.Name = styleName;
					t._setColorStyleTable(isTablePartsContainsRange.Ref, isTablePartsContainsRange);
					
					ws._onUpdateFormatTable(isTablePartsContainsRange.Ref, false, true);
					
					//history
					t._addHistoryObj(cloneFilter, historyitem_AutoFilter_ChangeTableStyle,
						{activeCells: activeRange, styleName: styleName}, null, filterRange);
					
					History.EndTransaction();
				};
				
					
				//не лочим в случае обыкновенного а/ф
				if(isTurnOffHistory || !styleName)
					addFilterCallBack(true);
				else
					ws._isLockedCells(filterRange, /*subType*/null, addFilterCallBack);
								
			},
			
			changeAutoFilterToTablePart: function(styleName, ar, addFormatTableOptionsObj)
			{
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var filterRange = aWs.AutoFilter.Ref.clone();
				var t = this;
				
				var addNameColumn = false;
				if(addFormatTableOptionsObj === false)
					addNameColumn = true;
				else if(typeof addFormatTableOptionsObj == 'object')
                    addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
				
				if(addNameColumn)
					filterRange.r2 = filterRange.r2 + 1;
				
				var addFilterCallBack = function()
				{
					History.Create_NewPoint();
					History.StartTransaction();
					
					t.deleteAutoFilter(ar, true);
					t.addAutoFilter(styleName, ar, addFormatTableOptionsObj, true);
					
					History.EndTransaction();
				};
				
				ws._isLockedCells(filterRange, /*subType*/null, addFilterCallBack);
			},
			
			applyAutoFilter: function (autoFiltersObject, ar) {
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var bUndoChanges = aWs.workbook.bUndoChanges;
				var bRedoChanges = aWs.workbook.bRedoChanges;
				
				//**get filter**
				var filterObj = this._getPressedFilter(ar, autoFiltersObject.cellId)
				var currentFilter = filterObj.filter;
				
				if(filterObj.filter === null)
					return;
				
				//for history				
				var oldFilter = filterObj.filter.clone(null);
				History.Create_NewPoint();
				History.StartTransaction();
				
				//change model
				var autoFilter = filterObj.filter;
				if(filterObj.filter.TableStyleInfo !== undefined)
					autoFilter = filterObj.filter.AutoFilter;	
				if(!autoFilter)
					autoFilter = new AutoFilter();
				var newFilterColumn;
				if(filterObj.index !== null)
				{
					newFilterColumn = autoFilter.FilterColumns[filterObj.index];
					newFilterColumn.clean();
				}
				else
				{
					newFilterColumn = autoFilter.addFilterColumn();
					newFilterColumn.ColId = filterObj.ColId;
				}	
				var allFilterOpenElements = newFilterColumn.createFilter(autoFiltersObject);
				if(allFilterOpenElements && autoFilter.FilterColumns[filterObj.index])
				{
					if(autoFilter.FilterColumns[filterObj.index].ShowButton !== false)
						autoFilter.FilterColumns.splice(filterObj.index, 1);//if all rows opened
					else
						autoFilter.FilterColumns[filterObj.index].clean();
				}
					
				
				//автоматическое расширение диапазона а/ф
				if(autoFiltersObject.automaticRowCount && filterObj.filter && filterObj.filter.Ref && filterObj.filter.getType() === g_nFiltersType.autoFilter)
				{
					var currentDiff = filterObj.filter.Ref.r2 - filterObj.filter.Ref.r1;
					var newDiff = autoFiltersObject.automaticRowCount - filterObj.filter.Ref.r1;
					
					if(newDiff > currentDiff)
						filterObj.filter.changeRef(null, newDiff - currentDiff);
				}
				
				//open/close rows
				if(!bUndoChanges && !bRedoChanges)
				{
					var hiddenObj = {start: currentFilter.Ref.r1 + 1, h: null};
					
					for(var i = currentFilter.Ref.r1 + 1; i <= currentFilter.Ref.r2; i++)
					{	
						var isHidden = false;
						if(autoFilter.FilterColumns && autoFilter.FilterColumns.length)
							isHidden = this._hiddenAnotherFilter(autoFilter.FilterColumns, filterObj.ColId, i, autoFilter.Ref.c1);
						
						if(!isHidden)
						{	
							var cell = aWs.getCell3(i, filterObj.ColId + autoFilter.Ref.c1);
							var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
							var currentValue = isDateTimeFormat ? cell.getValueWithoutFormat() : cell.getValueWithFormat();
							
							var isSetHidden = newFilterColumn.isHideValue(currentValue, isDateTimeFormat);
							
							//скрываем строки
							if(hiddenObj.h === null)
							{
								hiddenObj.h = isSetHidden;
								hiddenObj.start = i;
							}
							else if(hiddenObj.h !== isSetHidden)
							{
								aWs.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
								
								hiddenObj.h = isSetHidden;
								hiddenObj.start = i;
							}
							
							if(i === currentFilter.Ref.r2)
							{
								aWs.setRowHidden(hiddenObj.h, hiddenObj.start, i);
							}
						}
						else if(hiddenObj.h !== null)
						{
							aWs.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
							hiddenObj.h = null
						}
					}
				}
				
				//history
				this._addHistoryObj(oldFilter, historyitem_AutoFilter_ApplyMF,
					{activeCells: ar, autoFiltersObject: autoFiltersObject});
				History.EndTransaction();
				
				//updates
				this._reDrawFilters();
				if(!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges)
					ws._onUpdateFormatTable(oldFilter.Ref, false, true);
			},
			
			checkAddAutoFilter: function(activeRange, styleName, addFormatTableOptionsObj)
			{
				//write error, if not add autoFilter and return false
				var result = true;
				var aWs = this._getCurrentWS();
				var filter = aWs.AutoFilter;
				
				if(filter && styleName && filter.Ref.isIntersect(activeRange) && !(filter.Ref.containsRange(activeRange) && (activeRange.isOneCell() || (filter.Ref.isEqual(activeRange))) || (filter.Ref.r1 === activeRange.r1 && activeRange.containsRange(filter.Ref))))
				{
					aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
					result = false;
				}
				else if(!styleName && this._isEmptyRange(activeRange))//add filter to empty range
				{
					aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
					result = false;
				}
				else if(styleName && addFormatTableOptionsObj && addFormatTableOptionsObj.isTitle === false && this._isEmptyCellsUnderRange(activeRange) == false && this._isPartTablePartsUnderRange(activeRange))//add format table without title if down another format table
				{
					aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
					result = false;
				}
					
				return result;
			},
			
			checkRemoveTableParts: function(delRange, tableRange)
			{
				var result = true, firstRowRange;
				
				if(tableRange && delRange.containsRange(tableRange) == false)
				{
					firstRowRange = new Asc.Range(tableRange.c1, tableRange.r1, tableRange.c2, tableRange.r1);
					result = !firstRowRange.isIntersect(delRange);
				}
				
				return result;
			},
			
			checkCursor: function (x, y, offsetX, offsetY, frozenObj, r, c) {
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var result = false;
				var t = this;
				
				var checkFrozenArea = this._checkClickFrozenArea(x, y, offsetX, offsetY, frozenObj);
				if(checkFrozenArea)
				{
					x = checkFrozenArea.x;
					y = checkFrozenArea.y;
				}
				
				var checkCurrentFilter = function(filter, num)
				{
					var range = new Asc.Range(filter.Ref.c1, filter.Ref.r1, filter.Ref.c2, filter.Ref.r1);
					if(range.contains(c.col, r.row) && t._isShowButtonInFilter(c.col, filter))
					{
						var row = range.r1;
						for(var col = range.c1; col <= range.c2; col++)
						{
							if(col === c.col)
							{
								var width = 13;
								var height = 13;
								var rowHeight = ws.rows[row].height;
								if (rowHeight < height) {
									width = width*(rowHeight/height);
									height = rowHeight;
								}
								
								var x1 = ws.cols[col].left + ws.cols[col].width - width - 0.5;
								var y1 = ws.rows[row].top + ws.rows[row].height - height - 0.5;
								var x2 = ws.cols[col].left + ws.cols[col].width - 0.5;
								var y2 = ws.rows[row].top + ws.rows[row].height - 0.5;
	
								if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
									result = {id: {id: num, colId: col - range.c1}, target: c_oTargetType.FilterObject, col: -1, row: -1};
									return;
								}
							}
						}
					}
				};
				
				
				if(aWs.AutoFilter && aWs.AutoFilter.Ref)
				{
					checkCurrentFilter(aWs.AutoFilter, null);
				}
				
				if(aWs.TableParts && aWs.TableParts.length && !result)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						if(aWs.TableParts[i].AutoFilter)
							checkCurrentFilter(aWs.TableParts[i], i);
					}
				}
				
				return result;
			},
			
			//click on button
			onAutoFilterClick: function (idFilter) {
				this._showAutoFilterDialog(idFilter);
			},
			
			drawAutoF: function (updatedRange, offsetX, offsetY) {
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var t = this;
				
				if(aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges)
					return;
					
				var drawCurrentFilterButton = function(filter, isTablePart)
				{
					var range = new Asc.Range(filter.Ref.c1, filter.Ref.r1, filter.Ref.c2, filter.Ref.r1);
					if(range.isIntersect(updatedRange))
					{
						//TODO сделать isSetFilter
						var isSetFilter = false;
						var isShowButton = true;
						
						var row = range.r1;
						for(var col = range.c1; col <= range.c2; col++)
						{
							if(col >= updatedRange.c1 && col <= updatedRange.c2)
							{
								isSetFilter = false;
								isShowButton = true;
								
								if(filter.FilterColumns && filter.FilterColumns.length)
								{
									var colId = !isTablePart ? t._getTrueColId(filter, col - range.c1) : col - range.c1;
									var filterColumn = null, filterColumnWithMerge = null;
									
									for(var i = 0; i < filter.FilterColumns.length; i++)
									{	
										if(filter.FilterColumns[i].ColId === col - range.c1)
											filterColumn = filter.FilterColumns[i];

										if(colId === col - range.c1 && filterColumn !== null)
										{
											filterColumnWithMerge = filterColumn;
											break;
										}
										else if(filter.FilterColumns[i].ColId === colId)
											filterColumnWithMerge = filter.FilterColumns[i];
									}
									
									if(filterColumnWithMerge && filterColumnWithMerge.isApplyAutoFilter())
										isSetFilter = true;
									
									if(filterColumn && filterColumn.ShowButton === false)
										isShowButton = false;
									
								}
								
								if(isShowButton === false)
									continue;
								
								var width = 13;
								var height = 13;
								var rowHeight = ws.rows[row].height;
								if (rowHeight < height) {
									width = width*(rowHeight/height);
									height = rowHeight;
								}
								
								var x1 = ws.cols[col].left + ws.cols[col].width - width - 0.5;
								var y1 = ws.rows[row].top + ws.rows[row].height - height - 0.5;
								
								t._drawButton(x1 - offsetX,y1 - offsetY, {sortState: false, isSetFilter: isSetFilter, row: row, col: col});
							}
						}
					}
				};
				
				if(aWs.AutoFilter)
				{
					drawCurrentFilterButton(aWs.AutoFilter);
				}
				
				if(aWs.TableParts && aWs.TableParts.length)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						if(aWs.TableParts[i].AutoFilter)
							drawCurrentFilterButton(aWs.TableParts[i].AutoFilter, true);
					}
				}
			},
			
			getTablePictures: function(wb, fmgrGraphics, oFont)
			{
				var styleThumbnailWidth = 61;
				var styleThumbnailHeight = 46;
				if (AscBrowser.isRetina) {
					styleThumbnailWidth <<= 1;
					styleThumbnailHeight <<= 1;
				}

				var canvas = document.createElement('canvas');
				canvas.width = styleThumbnailWidth;
				canvas.height = styleThumbnailHeight;
				var customStyles = wb.TableStyles.CustomStyles;
				var result  = [];
				var options;
				var n = 0;
				if(customStyles)
				{
					for(var i in customStyles)
					{
						if(customStyles[i].table)
						{
							options = 
							{
								name: i,
								displayName: customStyles[i].displayName,
								type: 'custom',
								image: this._drawSmallIconTable(canvas, customStyles[i], fmgrGraphics, oFont)
							};
							result[n] = new formatTablePictures(options);
							n++;
						}
					}
				}
				var defaultStyles = wb.TableStyles.DefaultStyles;
				if(defaultStyles)
				{
					for(var i in defaultStyles)
					{
						if(defaultStyles[i].table)
						{
							options = 
							{
								name: i,
								displayName: defaultStyles[i].displayName,
								type: 'default',
								image: this._drawSmallIconTable(canvas, defaultStyles[i], fmgrGraphics, oFont)
							};
							result[n] = new formatTablePictures(options);
							n++;
						}
					}
				}
				return result;
			},
			
			addFiltersAfterOpen: function()
			{
				var aWs = this._getCurrentWS();
				if(aWs.TableParts && aWs.TableParts.length)
				{
					var tableParts = aWs.TableParts; 
					if(tableParts)
					{
						for(var i = 0; i < tableParts.length; i++)
						{
							this._setColorStyleTable(aWs.TableParts[i].Ref, aWs.TableParts[i]);
						}
					}
					
				}
			},
			
			searchRangeInTableParts: function(range)
			{
				var aWs = this._getCurrentWS();
				var containRangeId = -1, tableRange;
				var tableParts = aWs.TableParts;
				if(tableParts)
				{
					for(var i = 0; i < tableParts.length; ++i)
					{
						if (!(tableRange = tableParts[i].Ref))
							continue;

						if (range.isIntersect(tableRange)) {
							containRangeId = tableRange.containsRange(range) ? i : -2;
							break;
						}
					}
				}

				//если выделена часть форматир. таблицы, то отправляем -2
				//если форматировання таблица содержит данный диапазон, то id
				//если диапазон не затрагивает форматированную таблицу, то -1
				return containRangeId;
			},
			
			checkApplyFilterOrSort: function(tablePartId)
			{
				var aWs = this._getCurrentWS();
				var result = false;
				
				if(-1 !== tablePartId)
				{
					var tablePart = aWs.TableParts[tablePartId];
					if(tablePart.Ref && ((tablePart.AutoFilter && tablePart.AutoFilter.FilterColumns && tablePart.AutoFilter.FilterColumns.length) || (tablePart && tablePart.AutoFilter && tablePart.SortState && tablePart.SortState.SortConditions && tablePart.SortState.SortConditions[0])))
						result = {isFilterColumns: true, isAutoFilter: true};
					else if(tablePart.Ref && tablePart.AutoFilter && tablePart.AutoFilter !== null)
						result = {isFilterColumns: false, isAutoFilter: true};
					else
						result = {isFilterColumns: false, isAutoFilter: false};
				}
				else
				{
					if(aWs.AutoFilter && ((aWs.AutoFilter.FilterColumns && aWs.AutoFilter.FilterColumns.length && this._isFilterColumnsContainFilter(aWs.AutoFilter.FilterColumns)) || (aWs.AutoFilter.SortState && aWs.AutoFilter.SortState.SortConditions && aWs.AutoFilter.SortState.SortConditions[0])))
					{
						result = {isFilterColumns: true, isAutoFilter: true};
					}
					else if(aWs.AutoFilter)
					{
						result = {isFilterColumns: false, isAutoFilter: true};
					}
					else
					{
						result = {isFilterColumns: false, isAutoFilter: false};
					}
				}
				
				return result;
			},
			
			getSizeButton: function(c, r)
			{
				var ws = this.worksheet;
				var result = null;
				
				if(this.isCellContainsAutoFilterButton(c, r))
				{
					var height = 11;
					var width = 11;
					var rowHeight = ws.rows[r].height;
					var index = 1;
					if(rowHeight < height)
					{
						index = rowHeight / height;
						width = width * index;
						height = rowHeight;
					}
					result = 
					{
						width: width,
						height: height
					};
					return result;
				}

				return result;
			},
			
			getAddFormatTableOptions: function(activeCells, userRange)
			{
				var aWs = this._getCurrentWS();
				var objOptions = new AddFormatTableOptions();
				
				if(userRange)
					activeCells = Asc.g_oRangeCache.getAscRange(userRange);
				
				var alreadyAddFilter = this._searchFilters(activeCells, false);
				//в случае если меняем стиль фильтра
				if((alreadyAddFilter && alreadyAddFilter.changeStyle) ||(alreadyAddFilter && !alreadyAddFilter.containsFilter && !alreadyAddFilter.all))
					return false;
				
				var mainAdjacentCells;
				if(alreadyAddFilter && alreadyAddFilter.all && activeCells && alreadyAddFilter.range && !activeCells.containsRange(alreadyAddFilter.range) && !alreadyAddFilter.changeAllFOnTable)
					mainAdjacentCells = activeCells;
				else if(alreadyAddFilter && alreadyAddFilter.changeAllFOnTable && alreadyAddFilter.range)//если к фильтру применяем форматированную таблицу
					mainAdjacentCells = alreadyAddFilter.range;
				else if(activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2)//если ячейка выделенная одна
					mainAdjacentCells = this._getAdjacentCellsAF(activeCells,aWs);
				else//выделено > 1 ячейки
				{
					//TODO если выделен весь столбец - нужно посмотреть, нет ли пересекающих его объедененных строчек
					mainAdjacentCells = activeCells;
				}
					
				//имеется ввиду то, что при выставленном флаге title используется первая строка в качестве заголовка, в противном случае - добавлются заголовки
				var isTitle = this._isAddNameColumn(mainAdjacentCells);
				objOptions.asc_setIsTitle(isTitle);
				var tmpRange = mainAdjacentCells.clone();
				tmpRange.r1Abs = tmpRange.c1Abs = tmpRange.r2Abs = tmpRange.c2Abs = true;
				objOptions.asc_setRange(tmpRange.getName());
				return objOptions;
			},
			
			
			// Redo
			Redo: function (type, data) {
				History.TurnOff();
				switch (type) {
					case historyitem_AutoFilter_Add:
						this.addAutoFilter(data.styleName, data.activeCells, data.addFormatTableOptionsObj, null, data.bWithoutFilter, data.displayName);
						break;
					case historyitem_AutoFilter_Delete:
						this.deleteAutoFilter(data.activeCells);
						break;
					case historyitem_AutoFilter_ChangeTableStyle:
						this.changeTableStyleInfo(data.styleName, data.activeCells);
						break;
					case historyitem_AutoFilter_Sort:
						this.sortColFilter(data.type, data.cellId, data.activeCells, true);
						break;
					case historyitem_AutoFilter_Empty:
						this.isEmptyAutoFilters(data.activeCells);
						break;
					case historyitem_AutoFilter_ApplyMF:
						this.applyAutoFilter(data.autoFiltersObject, data.activeCells);
						break;
					case historyitem_AutoFilter_Move:
						this._moveAutoFilters(data.moveTo, data.moveFrom);
						break;
					case historyitem_AutoFilter_CleanAutoFilter:
						this.isApplyAutoFilterInCell(data.activeCells, true);
						break;
					case historyitem_AutoFilter_CleanFormat:
						this.cleanFormat(data.activeCells, true);
						break;
				}
				History.TurnOn();
			},
			
			// Undo
			Undo: function (type, data) {
				var aWs = this._getCurrentWS();
				var undoData = data.undo;
				var cloneData;
				
				if(!undoData)
					return;
				
				if(undoData.clone)
					cloneData = undoData.clone(null);
				else
					cloneData = undoData;
					
				if(!cloneData)
					return;
				if(cloneData.insCells)
					delete cloneData.insCells;

				//TODO переделать undo, по типам
				if(type === historyitem_AutoFilter_Move)//перемещение
				{
					this._moveAutoFilters(null, null, data);
				}
				else if(type === historyitem_AutoFilter_Empty)//было удаление, на undo добавляем
				{
					if(cloneData.TableStyleInfo)
					{
						if(!aWs.TableParts)
							aWs.TableParts = [];
						aWs.TableParts[aWs.TableParts.length] = cloneData;
						aWs.workbook.dependencyFormulas.addTableName(cloneData.DisplayName, aWs, cloneData.Ref);
						this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
					}
					else
						aWs.AutoFilter = cloneData;
				}
				else if(type === historyitem_AutoFilter_Change)//добавление/удаление строк/столбцов 
				{
					if(aWs.AutoFilter && cloneData.newFilterRef.isEqual(aWs.AutoFilter.Ref))
						aWs.AutoFilter = cloneData.oldFilter.clone(null);
					else if(aWs.TableParts)
					{
						for(var l = 0; l < aWs.TableParts.length; l++)
						{
							if(cloneData.newFilterRef && cloneData.oldFilter && cloneData.oldFilter.DisplayName === aWs.TableParts[l].DisplayName)
							{
								aWs.TableParts[l] = cloneData.oldFilter.clone(null);

								//чистим стиль от старой таблицы
								var clearRange = new Range(aWs, cloneData.newFilterRef.r1, cloneData.newFilterRef.c1, cloneData.newFilterRef.r2, cloneData.newFilterRef.c2);
								clearRange.setTableStyle(null);
								
								this._setColorStyleTable(cloneData.oldFilter.Ref, cloneData.oldFilter, null, true);
								
								//если на месте того, где находилась Ф/т находится другая, то применяем к ней стили
								this._setStyleTables(cloneData.newFilterRef);
								
								//event
								aWs.handlers.trigger("changeRefTablePart", cloneData.oldFilter.DisplayName, cloneData.oldFilter.Ref);
								
								break;
							}	
						}
					}
				}
				else if(type === historyitem_AutoFilter_Sort && cloneData.oldFilter)//сортировка
				{
					if(aWs.AutoFilter && cloneData.oldFilter.getType() === g_nFiltersType.autoFilter)
						aWs.AutoFilter = cloneData.oldFilter.clone(null);
					else if(aWs.TableParts)
					{
						for(var l = 0; l < aWs.TableParts.length; l++)
						{
							if(cloneData.oldFilter.DisplayName === aWs.TableParts[l].DisplayName)
							{
								aWs.TableParts[l] = cloneData.oldFilter.clone(null);
								break;
							}	
						}
					}
				}
				else if(type === historyitem_AutoFilter_CleanFormat)
				{
					if(aWs.TableParts && cloneData && cloneData.Ref)
					{
						for(var l = 0; l < aWs.TableParts.length; l++)
						{
							//TODO сравниваю не по DisplayName по следующей причине: делаем undo всему, затем redo, и форматированная таблицы добавляется с новым именем
							//если передавать в redo displaName -> конфликт при совместном ред.(1- ый добавляет ф/т + undo, 2-ой добавляет ф/т, первый делает redo->2 одинаковых имени)
							if(cloneData.Ref.isEqual(aWs.TableParts[l].Ref))
							{
								aWs.TableParts[l] = cloneData.clone(null);
								this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
								break;
							}	
						}
					}
				}
				else if(cloneData.FilterColumns || cloneData.AutoFilter || cloneData.TableColumns || (cloneData.Ref && (cloneData instanceof AutoFilter || cloneData instanceof TablePart)))//add
				{
					if(cloneData.Ref)
					{
						var isEn = false;
						if(aWs.AutoFilter && aWs.AutoFilter.Ref.isEqual(cloneData.Ref))
						{
							this._reDrawCurrentFilter(cloneData.FilterColumns);
							aWs.AutoFilter = cloneData;
							this._reDrawFilters(aWs.AutoFilter.Ref);
							isEn = true;
						}
						else if(aWs.TableParts)
						{
							for(var l = 0; l < aWs.TableParts.length; l++)
							{
								if(cloneData.Ref.isEqual(aWs.TableParts[l].Ref))
								{
									aWs.TableParts[l] = cloneData;
									if(cloneData.AutoFilter && cloneData.AutoFilter.FilterColumns)
										this._reDrawCurrentFilter(cloneData.AutoFilter.FilterColumns, aWs.TableParts[l]);
									else
										this._reDrawCurrentFilter(null, aWs.TableParts[l]);
									isEn = true;

									
									//перерисовываем фильтры, находящиеся на одном уровне с данным фильтром
									this._reDrawFilters(aWs.TableParts[l].Ref);
									
									break;
								}	
							}
						}
						
						if(!isEn)//добавляем фильтр
						{
							if(cloneData.TableStyleInfo)
							{
								if(!aWs.TableParts)
									aWs.TableParts = [];
								aWs.TableParts[aWs.TableParts.length] = cloneData;
                                aWs.workbook.dependencyFormulas.addTableName(cloneData.DisplayName, aWs, cloneData.Ref);
								this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
							}
							else
							{
								aWs.AutoFilter = cloneData;
							}
						}
					}
				}
				else if(cloneData.Ref) //удаление таблиц / автофильтров
				{
					if(aWs.AutoFilter && aWs.AutoFilter.Ref.isEqual(cloneData.Ref))
						aWs.AutoFilter = null;
					else if(aWs.TableParts)
					{
						for(var l = 0; l < aWs.TableParts.length; l++)
						{
							if(cloneData.Ref.isEqual(aWs.TableParts[l].Ref))
							{
								this._cleanStyleTable(cloneData.Ref);
                                aWs.workbook.dependencyFormulas.delTableName(aWs.TableParts[l].DisplayName,aWs.getName());
                                aWs.TableParts.splice(l,1);
							}	
						}
					}
				}
			},
			
			reDrawFilter: function(range, row)
			{
				if(!range && row == undefined)
					return;
				
				var aWs = this._getCurrentWS();
				var ws = this.worksheet;
				var tableParts = aWs.TableParts;
				if(tableParts)
				{
					if(range === null && row !== undefined)
					{
						range = new Asc.Range(0, row, ws.nColsCount - 1, row);
					}
					
					for(var i = 0; i < tableParts.length; i++)
					{
						var currentFilter = tableParts[i];
						if(currentFilter && currentFilter.Ref)
						{
							var tableRange = currentFilter.Ref;
							
							//проверяем, попадает хотя бы одна ячейка из диапазона в область фильтра
							if(range.isIntersect(tableRange))
								this._setColorStyleTable(tableRange, currentFilter);
						}
					}
				}
			},
			
			isEmptyAutoFilters: function(ar, insertType, exceptionArray)
			{
				var aWs = this._getCurrentWS();
				var activeCells = ar.clone();
				var t = this;
				
				var DeleteColumns = insertType && (insertType == c_oAscDeleteOptions.DeleteColumns || insertType == c_oAscInsertOptions.InsertColumns) ? true : false;
				var DeleteRows = insertType && (insertType == c_oAscDeleteOptions.DeleteRows || insertType == c_oAscInsertOptions.InsertRows) ? true : false;

				if(DeleteColumns)//в случае, если удаляем столбцы, тогда расширяем активную область область по всем строкам
				{
					activeCells.r1 = 0;
					activeCells.r2 = gc_nMaxRow - 1;
				}
				else if(DeleteRows)//в случае, если удаляем строки, тогда расширяем активную область область по всем столбцам
				{
					activeCells.c1 = 0;
					activeCells.c2 = gc_nMaxCol - 1;
				}
				
				History.StartTransaction();
				
				var changeFilter = function(filter, isTablePart)
				{
					var oldFilter = filter.clone(null);
					var oRange = Range.prototype.createFromBBox(aWs, oldFilter.Ref);

					var bbox = oRange.getBBox0();

					//смотрим находится ли фильтр(первая его строчка) внутри выделенного фрагмента
					if (activeCells.containsFirstLineRange(bbox)) {
						if(isTablePart)
							oRange.setTableStyle(null);
						else
							aWs.AutoFilter = null;
							
						//открываем скрытые строки
						if(oldFilter.isApplyAutoFilter())
							aWs.setRowHidden(false, bbox.r1, bbox.r2);

						//заносим в историю
						if(isTablePart){
							t._addHistoryObj(oldFilter, historyitem_AutoFilter_Empty, {activeCells: activeCells}, null, bbox);
                        }
						else
							t._addHistoryObj(oldFilter, historyitem_AutoFilter_Empty, {activeCells: activeCells}, null, oldFilter.Ref);
						
						if(isTablePart)
							aWs.workbook.dependencyFormulas.delTableName(oldFilter.DisplayName,aWs.getName())
					} else
						return oldFilter;
				};
				
				if(aWs.AutoFilter)
				{
					changeFilter(aWs.AutoFilter);
				}
				if(aWs.TableParts)
				{
					var newTableParts = [];
					
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						var filter = changeFilter(aWs.TableParts[i], true);
						if(filter)
							newTableParts.push(filter);
					}
					
					aWs.TableParts = newTableParts;
				}
				
				t._setStyleTablePartsAfterOpenRows(activeCells);
				
				History.EndTransaction();
			},
			
			cleanFormat: function(range)
			{
				var aWs = this._getCurrentWS();
				var t = this, selectedTableParts;
				//if first row AF in ActiveRange  - delete AF
				if(aWs.AutoFilter && aWs.AutoFilter.Ref && range.containsFirstLineRange(aWs.AutoFilter.Ref))
					this.isEmptyAutoFilters(aWs.AutoFilter.Ref);
				else
				{
					//*****callBack on delete filter
					var deleteFormatCallBack = function()
					{	
						History.Create_NewPoint();
						History.StartTransaction();
						
						for(var i = 0; i < selectedTableParts.length; i++)
						{
							var cloneFilter = selectedTableParts[i].clone(null);
							
							selectedTableParts[i].TableStyleInfo.Name = null;
							t._cleanStyleTable(selectedTableParts[i].Ref);
							
							t._addHistoryObj(cloneFilter, historyitem_AutoFilter_CleanFormat, {activeCells: range});
						}
						
						History.EndTransaction();
					};
					
					selectedTableParts = this._searchFiltersInRange(range, true);
					if(selectedTableParts && selectedTableParts.length)
						deleteFormatCallBack();
					else
					{
						//TODO сделать так, чтобы табличный стиль без таблицы не переносился. если делаем move из ф/т, копируем стиль таблицы из tableXfs в xfs
						History.Create_NewPoint();
						History.StartTransaction();
						this._cleanStyleTable(range);
						t._addHistoryObj(null, historyitem_AutoFilter_CleanFormat, {activeCells: range});
						History.EndTransaction();
					}
				}
			},
			
			isCheckMoveRange: function(arnFrom, arnTo)
			{	
				var aWs = this._getCurrentWS();
				
				var tableParts = aWs.TableParts;
				var tablePart;
				
				//1) если выделена часть форматированной таблицы и ещё часть(либо полностью)
				var counterIntersection = 0;
				var counterContains = 0;
				for(var i = 0; i < tableParts.length; i++)
				{
					tablePart = tableParts[i];
					if(tablePart.Ref.intersection(arnFrom))
					{
						if(arnFrom.containsRange(tablePart.Ref))
							counterContains++;
						else
							counterIntersection++;
					}
				}
				
				if((counterIntersection > 0 && counterContains > 0) || (counterIntersection > 1))
				{
					aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
					return false;
				}
				
				
				//2)если затрагиваем перемещаемым диапазоном часть а/ф со скрытыми строчками
				if(!this.checkMoveRangeIntoApplyAutoFilter(arnTo))
				{
					aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterMoveToHiddenRangeError, c_oAscError.Level.NoCritical)	
					return false;
				}
				
				return true;
			},
			
			checkMoveRangeIntoApplyAutoFilter: function(arnTo)
			{
				var aWs = this._getCurrentWS();
				if(aWs.AutoFilter && aWs.AutoFilter.Ref && arnTo.intersection(aWs.AutoFilter.Ref))
				{
					//если затрагиваем скрытые строки а/ф - выдаём ошибку
					if(this._searchHiddenRowsByFilter(aWs.AutoFilter, arnTo))
					{
						return false;
					}
				}
				return true;
			},
			
			//if active range contains in tablePart but not equal this active range
			isTablePartContainActiveRange: function()
			{
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var activeRange = ws.activeRange;
				
				var tableParts = aWs.TableParts;
				var tablePart;
				for(var i = 0; i < tableParts.length; i++)
				{
					tablePart = tableParts[i];
					if(tablePart && tablePart.Ref && tablePart.Ref.containsRange(activeRange) && !tablePart.Ref.isEqual(activeRange))
						return true;
				}
				return false;
			},
			
			insertColumn: function(type, activeRange, insertType)
			{
				var aWs = this._getCurrentWS();
				var t  = this;
				var bUndoChanges = aWs.workbook.bUndoChanges;
				var bRedoChanges = aWs.workbook.bRedoChanges;
				var DeleteColumns = ((insertType == c_oAscDeleteOptions.DeleteColumns && type == 'delCell') || insertType == c_oAscInsertOptions.InsertColumns) ? true : false;
				activeRange = activeRange.clone();
				var diff = activeRange.c2 - activeRange.c1 + 1;
				var redrawTablesArr = [];
				
				if(type === "delCell")
					diff = - diff;
				if(DeleteColumns)//в случае, если удаляем столбцы, тогда расширяем активную область область по всем строкам
				{
					activeRange.r1 = 0;
					activeRange.r2 = gc_nMaxRow - 1;
				}
				
				History.StartTransaction();
				History.Create_NewPoint();
				
				var cleanStylesTables = function(redrawTablesArr)
				{
					for(var i = 0; i < redrawTablesArr.length; i++)
					{
						t._cleanStyleTable(redrawTablesArr[i].oldfilterRef);
					}
				};
				
				var setStylesTables = function(redrawTablesArr)
				{
					for(var i = 0; i < redrawTablesArr.length; i++)
					{
						t._setColorStyleTable(redrawTablesArr[i].newFilter.Ref, redrawTablesArr[i].newFilter, null, true);
					}
				};
				
				var changeFilter = function(filter, bTablePart)
				{
					var ref = filter.Ref;
					var oldFilter = null;
					var diffColId = null;
					
					if(activeRange.r1 <= ref.r1 && activeRange.r2 >= ref.r2)
					{
						if(activeRange.c2 < ref.c1)//until
						{
							oldFilter = filter.clone(null);
							filter.moveRef(diff);
						}
						else if(activeRange.c1 <= ref.c1 && activeRange.c2 >= ref.c1)//parts of until filter
						{
							oldFilter = filter.clone(null);

							if(diff < 0)
							{
								diffColId = ref.c1 - activeRange.c2 - 1;
								
								if(bTablePart)
									filter.deleteTableColumns(activeRange);
								
								filter.changeRef(-diffColId, null, true);
							}
								
							filter.moveRef(diff);								
						}
						else if(activeRange.c1 > ref.c1 && activeRange.c2 >= ref.c2 && activeRange.c1 < ref.c2 && diff < 0)//parts of after filter
						{
							oldFilter = filter.clone(null);
							diffColId = activeRange.c1 - ref.c2 - 1;
							
							if(diff < 0 && bTablePart)
								filter.deleteTableColumns(activeRange);
							else if(bTablePart)
								filter.addTableColumns(activeRange, t);
							
							filter.changeRef(diffColId);						
						}
						else if((activeRange.c1 >= ref.c1 && activeRange.c1 <= ref.c2 && activeRange.c2 <= ref.c2) || (activeRange.c1 > ref.c1 && activeRange.c2 >= ref.c2 && activeRange.c1 < ref.c2 && diff > 0))//inside
						{
							oldFilter = filter.clone(null);
							
							if(diff < 0 && bTablePart)
								filter.deleteTableColumns(activeRange);
							else if(bTablePart)
								filter.addTableColumns(activeRange, t);	
							
							filter.changeRef(diff);
							
							diffColId = diff;
						}
						
						//change filterColumns
						if(diffColId !== null)
						{
							var autoFilter = bTablePart ? filter.AutoFilter : filter;
							if(autoFilter && autoFilter.FilterColumns && autoFilter.FilterColumns.length)
							{
								for(var j = 0; j < autoFilter.FilterColumns.length; j++)
								{
									var col = autoFilter.FilterColumns[j].ColId + ref.c1;
									if(col >= activeRange.c1)
									{
										var newColId = autoFilter.FilterColumns[j].ColId + diffColId;
										if(newColId < 0 || (diff < 0 && col >= activeRange.c1 && col <= activeRange.c2))
										{
											autoFilter.FilterColumns[j].clean();
											t._openHiddenRowsAfterDeleteColumn(autoFilter, autoFilter.FilterColumns[j].ColId);
											autoFilter.FilterColumns.splice(j, 1);
											j--;
										}	
										else
											autoFilter.FilterColumns[j].ColId = newColId;
									}
								}
							}
						}
						
						//History
						if(!bUndoChanges && !bRedoChanges /*&& !notAddToHistory*/ && oldFilter)
						{
							var changeElement = 
							{
								oldFilter: oldFilter,
								newFilterRef: filter.Ref.clone()
							};
							t._addHistoryObj(changeElement, historyitem_AutoFilter_Change, null, true, oldFilter.Ref, null, true);
						}
						
						//set style
						if(oldFilter && bTablePart)
							redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
					}
				};
				
				
				//change autoFilter
				if(aWs.AutoFilter)
					changeFilter(aWs.AutoFilter);
				
				//change TableParts
				var tableParts = aWs.TableParts;
				for(var i = 0; i < tableParts.length; i++)
					changeFilter(tableParts[i], true);
				
				
				//set styles for tables
				cleanStylesTables(redrawTablesArr);
				setStylesTables(redrawTablesArr);
				
				History.EndTransaction();
			},
			
			insertRows: function(type, activeRange, insertType)
			{
				var aWs = this._getCurrentWS();
				var t  = this;
				var bUndoChanges = aWs.workbook.bUndoChanges;
				var bRedoChanges = aWs.workbook.bRedoChanges;
				var DeleteRows = ((insertType == c_oAscDeleteOptions.DeleteRows && type == 'delCell') || insertType == c_oAscInsertOptions.InsertRows) ? true : false;
				activeRange = activeRange.clone();
				var diff = activeRange.r2 - activeRange.r1 + 1;
				var redrawTablesArr = [];
				
				if(type === "delCell")
					diff = - diff;
				
				if(DeleteRows)//в случае, если удаляем строки, тогда расширяем активную область область по всем столбцам
				{
					activeRange.c1 = 0;
					activeRange.c2 = gc_nMaxCol - 1;
				}
				
				History.StartTransaction();
				History.Create_NewPoint();
				
				var cleanStylesTables = function(redrawTablesArr)
				{
					for(var i = 0; i < redrawTablesArr.length; i++)
					{
						t._cleanStyleTable(redrawTablesArr[i].oldfilterRef);
					}
				};
				
				var setStylesTables = function(redrawTablesArr)
				{
					for(var i = 0; i < redrawTablesArr.length; i++)
					{
						t._setColorStyleTable(redrawTablesArr[i].newFilter.Ref, redrawTablesArr[i].newFilter, null, true);
					}
				};
				
				var changeFilter = function(filter, bTablePart)
				{
					var ref = filter.Ref;
					var oldFilter = null;
					if(activeRange.c1 <= ref.c1 && activeRange.c2 >= ref.c2)
					{
						if(activeRange.r1 <= ref.r1)//until
						{
							oldFilter = filter.clone(null);
							
							filter.moveRef(null, diff, t.worksheet);
						}
						else if(activeRange.r1 > ref.r1 && activeRange.r2 <= ref.r2)//inside
						{
							oldFilter = filter.clone(null);
							
							filter.changeRef(null, diff);
						}
						else if(activeRange.r1 > ref.r1 && activeRange.r2 > ref.r2 && activeRange.r1 < ref.r2)
						{
							oldFilter = filter.clone(null);
							
							filter.changeRef(null, diff + (activeRange.r2 - ref.r2));
						}
					}
					
					if(!bUndoChanges && !bRedoChanges /*&& !notAddToHistory*/ && oldFilter)
					{
						var changeElement =
						{
							oldFilter: oldFilter,
							newFilterRef: filter.Ref.clone()
						};
						t._addHistoryObj(changeElement, historyitem_AutoFilter_Change, null, true, oldFilter.Ref, null, true);
					}
					
					//set style
					if(oldFilter && bTablePart)
						redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
				};
				
				//change autoFilter
				if(aWs.AutoFilter)
					changeFilter(aWs.AutoFilter);
				
				//change TableParts
				var tableParts = aWs.TableParts;
				for(var i = 0; i < tableParts.length; i++)
					changeFilter(tableParts[i], true);
				
				//set styles for tables
				cleanStylesTables(redrawTablesArr);
				setStylesTables(redrawTablesArr);
				
				History.EndTransaction();
			},
			
			sortColFilter: function(type, cellId, activeRange, isTurnOffHistory, displayName) {
				var aWs = this._getCurrentWS();
				var ws = this.worksheet;
				var t = this;
				var bUndoChanges = aWs.workbook.bUndoChanges;
				var bRedoChanges = aWs.workbook.bRedoChanges;
				var curFilter, sortRange, filterRef, startCol, maxFilterRow;
				
				var onSortAutoFilterCallback = function(success)
				{
					if(success)
					{
						if(isTurnOffHistory)
							History.TurnOff();
						History.Create_NewPoint();
						History.StartTransaction();
						
						var oldFilter = curFilter.clone(null);
						
						//изменяем содержимое фильтра
						if(!curFilter.SortState)
						{
							curFilter.SortState = new SortState();
							curFilter.SortState.Ref = new Asc.Range(startCol, curFilter.Ref.r1, startCol, maxFilterRow);
							curFilter.SortState.SortConditions = [];
							curFilter.SortState.SortConditions[0] = new SortCondition();
						}
						if(!curFilter.SortState.SortConditions[0])
							curFilter.SortState.SortConditions[0] = new SortCondition();
							
						var cellIdRange = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r1);
						
						curFilter.SortState.SortConditions[0].Ref = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r2);
						curFilter.SortState.SortConditions[0].ConditionDescending = resType;
						
						//cellId = t._rangeToId(cellIdRange);
						
						//сама сортировка
						if(!bRedoChanges && !bUndoChanges)
							ws.cellCommentator.sortComments(sortRange.sort(resType, startCol));

						if(curFilter.TableStyleInfo)
							t._setColorStyleTable(curFilter.Ref, curFilter);
						t._addHistoryObj({oldFilter: oldFilter}, historyitem_AutoFilter_Sort,
							{activeCells: cellIdRange, type: type, cellId: cellId}, null, curFilter.Ref);
						History.EndTransaction();
						
						if(!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges)
							ws._onUpdateFormatTable(sortRange.bbox, false);
						
						if(isTurnOffHistory)
							History.TurnOn();
					}
				};
				
				//if(cellId)
					//activeRange = t._idToRange(cellId);
				
				var resType = type == 'ascending';
				var isCellIdString = false;
				if(cellId !== undefined && cellId != "" && typeof cellId == 'string')
				{
					activeRange = t._idToRange(cellId);
					displayName = undefined;
					isCellIdString = true;
				}
				
				if(displayName !== undefined)
				{
					curFilter = this._getFilterByDisplayName(displayName);
					filterRef = curFilter.Ref;
					
					if(cellId !== '')
						startCol = filterRef.c1 + cellId;
					else
						startCol = activeRange.startCol;
				}
				else
				{
					var filter = t.searchRangeInTableParts(activeRange);
					if(filter === -2)//если захвачена часть ф/т
						return;
						
					if(filter === -1)//если нет ф/т в выделенном диапазоне
					{
						if(aWs.AutoFilter && aWs.AutoFilter.Ref)
						{
							curFilter = aWs.AutoFilter;
							filterRef = curFilter.Ref;
						}
						
						//в данному случае может быть захвачен а/ф, если он присутвует(надо проверить), либо нажата кнопка а/ф
						if(curFilter && (filterRef.isEqual(activeRange) || cellId !== ''))
						{
							if(cellId !== '' && !isCellIdString)
								startCol = filterRef.c1 + cellId;
							else
								startCol = activeRange.startCol;
							
							if(startCol === undefined)
								startCol = activeRange.c1;
						}
						else//внутри а/ф либо без а/ф либо часть а/ф
						{
							ws.setSelectionInfo("sort", resType);
							return;
						}
					}
					else
					{
						//получаем данную ф/т
						curFilter = aWs.TableParts[filter];
						filterRef = curFilter.Ref;
						
						startCol = activeRange.startCol;
						if(startCol === undefined)
							startCol = activeRange.c1;
					}
				}
				
				
				maxFilterRow = filterRef.r2;
				if(curFilter.getType() === g_nFiltersType.autoFilter && curFilter.isApplyAutoFilter() === false)//нужно подхватить нижние ячейки в случае, если это не применен а/ф
				{
					var automaticRange = this._getAdjacentCellsAF(curFilter.Ref, aWs, true);
					var automaticRowCount = automaticRange.r2;
					
					if(automaticRowCount > maxFilterRow)
						maxFilterRow = automaticRowCount;
				}
				
				sortRange = aWs.getRange3(filterRef.r1 + 1, filterRef.c1, maxFilterRow, filterRef.c2);
				if(isTurnOffHistory)
					onSortAutoFilterCallback(true);
				else
					ws._isLockedCells (sortRange.bbox, /*subType*/null, onSortAutoFilterCallback);
			},
			
			//2 parameter - clean from found filter FilterColumns и SortState
			isApplyAutoFilterInCell: function(activeCell, clean)
			{
				var aWs = this._getCurrentWS();
				if(aWs.TableParts)
				{
					var tablePart;
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						tablePart = aWs.TableParts[i];
						
						//если применен фильтр или сортировка
						if(tablePart.isApplyAutoFilter() || tablePart.isApplySortConditions())
						{
							if(tablePart.Ref.containsRange(activeCell))
							{
								if(clean)
									this._cleanFilterColumnsAndSortState(tablePart, activeCell);
								return true;
							}
								
						}
						else
						{
							if(tablePart.Ref.containsRange(activeCell, activeCell))
								return false;
						}
					}
				}
				
				if(aWs.AutoFilter && (aWs.AutoFilter.isApplyAutoFilter() || aWs.AutoFilter.isApplySortConditions()))
				{
					if(clean)
						this._cleanFilterColumnsAndSortState(aWs.AutoFilter, activeCell);
					return true;
				}
				
				return false;
			},
			
			isActiveRangeIntersectionAutoFilter: function(addFormatTableOptionsObj)
			{
				var res = false;
				var aWs = this._getCurrentWS();

				var activeRange = Asc.g_oRangeCache.getAscRange(addFormatTableOptionsObj.asc_getRange());
				if(activeRange && aWs.AutoFilter && aWs.AutoFilter.Ref.intersection(activeRange))
					res = true;
					
				return res;
			},
			
			isChangeAutoFilterToTablePart: function(addFormatTableOptionsObj)
			{
				var res = false;
				var aWs = this._getCurrentWS();

				var activeRange = Asc.g_oRangeCache.getAscRange(addFormatTableOptionsObj.asc_getRange());
				if(activeRange && aWs.AutoFilter && activeRange.containsRange(aWs.AutoFilter.Ref) && activeRange.r1 === aWs.AutoFilter.Ref.r1)
					res = true;
					
				return res;
			},
			
			//если активный диапазон захватывает части нескольких табли, либо часть одной таблицы и одну целую
			isRangeIntersectionSeveralTableParts: function(activeRange, isWriteError)
			{
				//TODO сделать общую функцию с isActiveCellsCrossHalfFTable
				var aWs = this._getCurrentWS();
				var tableParts = aWs.TableParts; 
				
				var numPartOfTablePart = 0, isAllTablePart;
				for(var i = 0; i < tableParts.length; i++ )
				{
					if(activeRange.intersection(tableParts[i].Ref))
					{
						if(activeRange.containsRange(tableParts[i].Ref))
							isAllTablePart = true;
						else
							numPartOfTablePart++;
							
						if(numPartOfTablePart >= 2 || (numPartOfTablePart >= 1 && isAllTablePart === true))
						{
							if(isWriteError)
								aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
							return true;
						}
					}
				}
				
				return false;
			},
			
			isRangeIntersectionTableOrFilter: function(range)
			{
				var aWs = this._getCurrentWS();
				var tableParts = aWs.TableParts;
				
				for(var i = 0; i < tableParts.length; i++ )
				{
					if(range.intersection(tableParts[i].Ref))
					{
						return true;
					}
				}
				
				if(aWs.AutoFilter && aWs.AutoFilter.Ref && range.intersection(aWs.AutoFilter.Ref))
					return true;
				
				return false;
			},
			
			_setStyleTablePartsAfterOpenRows: function(ref)
			{
				var aWs = this._getCurrentWS();
				var tableParts = aWs.TableParts; 
				
				for(var i = 0; i < tableParts.length; i++ )
				{
					if((tableParts[i].Ref.r1 >= ref.r1 && tableParts[i].Ref.r1 <= ref.r2) || (tableParts[i].Ref.r2 >= ref.r1 && tableParts[i].Ref.r2 <= ref.r2))
					{
						this._setColorStyleTable(tableParts[i].Ref, tableParts[i]);
					}
				}
			},
			
			_moveAutoFilters: function(arnTo, arnFrom, data, copyRange, offLock)
			{
				//проверяем покрывает ли диапазон хотя бы один автофильтр
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var isUpdate;
				
				if(arnTo == null && arnFrom == null && data)
				{
					arnTo = data.moveFrom ? data.moveFrom : null;
					arnFrom = data.moveTo ? data.moveTo : null;
					data = data.undo;
					if(arnTo == null || arnFrom == null)
						return;
				}
				
				var cloneFilterColumns = function(filterColumns)
				{
					var cloneFilterColumns = [];
					if(filterColumns && filterColumns.length)
					{
						for(var i = 0; i < filterColumns.length; i++)
						{
							cloneFilterColumns[i] = filterColumns[i].clone();
						}
					}
					return cloneFilterColumns;
				};
				
				var addRedo = false;
				
				if(copyRange)
				{
					this._cloneCtrlAutoFilters(arnTo, arnFrom, offLock);
				}
				else
				{
					var findFilters = this._searchFiltersInRange(arnFrom);
					if(findFilters)
					{
						var diffCol = arnTo.c1 - arnFrom.c1;
						var diffRow = arnTo.r1 - arnFrom.r1;
						var ref;
						var range;
						var oCurFilter;
						//у найденных фильтров меняем Ref + скрытые строчки открываем
						for(var i = 0; i < findFilters.length; i++)
						{
							if(!oCurFilter)
								oCurFilter = [];
							oCurFilter[i] = findFilters[i].clone(null);
							ref = findFilters[i].Ref;
							range = ref;
							
							//move ref
							findFilters[i].moveRef(diffCol, diffRow);
							
							isUpdate = false;
							if((findFilters[i].AutoFilter && findFilters[i].AutoFilter.FilterColumns && findFilters[i].AutoFilter.FilterColumns.length) || (findFilters[i].FilterColumns && findFilters[i].FilterColumns.length))
							{
								aWs.setRowHidden(false, ref.r1, ref.r2);
								isUpdate = true;
							}

							if(!data && findFilters[i].AutoFilter && findFilters[i].AutoFilter.FilterColumns)
								findFilters[i].AutoFilter.cleanFilters();
							else if(!data && findFilters[i] && findFilters[i].FilterColumns)
								findFilters[i].cleanFilters();
							else if(data && data[i] && data[i].AutoFilter && data[i].AutoFilter.FilterColumns)
								findFilters[i].AutoFilter.FilterColumns = cloneFilterColumns(data[i].AutoFilter.FilterColumns);
							else if(data && data[i] && data[i].FilterColumns)
								findFilters[i].FilterColumns = cloneFilterColumns(data[i].FilterColumns);
							
							
							if(oCurFilter[i].TableStyleInfo && oCurFilter[i] && findFilters[i])
							{
								this._cleanStyleTable(oCurFilter[i].Ref);
								this._setColorStyleTable(findFilters[i].Ref, findFilters[i]);
							}
							
							if(!addRedo && !data)
							{
								this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Move, {worksheet: ws, arnTo: arnTo, arnFrom: arnFrom, activeCells: ws.activeRange});
								addRedo = true;
							}
							else if(!data && addRedo)
								this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Move);
								
							//обновляем в случае открытия строк
							if(isUpdate)
								ws._onUpdateFormatTable(range, null, true);
						}
					}
				}
				
				var arnToRange = new Asc.Range(arnTo.c1, arnTo.r1, arnTo.c2, arnTo.r2);
				var intersectionRangeWithTableParts = this._intersectionRangeWithTableParts(arnToRange, aWs);
				if(intersectionRangeWithTableParts && intersectionRangeWithTableParts.length)
				{	
					var tablePart;
					for(var i = 0; i < intersectionRangeWithTableParts.length; i++)
					{
						tablePart = intersectionRangeWithTableParts[i];
						this._setColorStyleTable(tablePart.Ref, tablePart);
						aWs.getRange3(tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2).unmerge();
					}
				}
				
			},
			
			//if active range intersect even a part tablePart(for insert(delete) cells)
			isActiveCellsCrossHalfFTable: function(activeCells, val, prop)
			{
				var InsertCellsAndShiftDown = val == c_oAscInsertOptions.InsertCellsAndShiftDown && prop == 'insCell';
				var InsertCellsAndShiftRight = val == c_oAscInsertOptions.InsertCellsAndShiftRight && prop == 'insCell';
				var DeleteCellsAndShiftLeft = val == c_oAscDeleteOptions.DeleteCellsAndShiftLeft && prop == 'delCell';
				var DeleteCellsAndShiftTop = val == c_oAscDeleteOptions.DeleteCellsAndShiftTop && prop == 'delCell';
				
				var DeleteColumns = val == c_oAscDeleteOptions.DeleteColumns && prop == 'delCell';
				var DeleteRows = val == c_oAscDeleteOptions.DeleteRows && prop == 'delCell';
				
				var aWs = this._getCurrentWS();
				var tableParts = aWs.TableParts;
				var autoFilter = aWs.AutoFilter;
				var result = null;

				var tableRange;
				var isExp;
				if(DeleteColumns || DeleteRows)
				{
					//меняем активную область
					var newActiveRange;
					if(DeleteRows)
					{
						newActiveRange = new Asc.Range(0, activeCells.r1, gc_nMaxCol - 1, activeCells.r2);
					}
					else
					{
						newActiveRange = new Asc.Range(activeCells.c1, 0, activeCells.c2, gc_nMaxRow - 1);
					}
					//если активной областью захвачена полнотью форматированная таблица(или её часть) + часть форматированной таблицы - выдаём ошибку
					if(tableParts)
					{
						isExp = false;
						var isPart = false;
						for(var i = 0; i < tableParts.length; i++ )
						{
							tableRange = tableParts[i].Ref;
							//если хотя бы одна ячейка активной области попадает внутрь форматированной таблицы
							if(newActiveRange.isIntersect(tableRange))
							{
								if(isExp && isPart)//часть + целая
								{
									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}	
								if(newActiveRange.c1 <= tableRange.c1 && newActiveRange.c2 >= tableRange.c2 && newActiveRange.r1 <= tableRange.r1 && newActiveRange.r2 >= tableRange.r2)
								{
									isExp = true;
									if(isPart)
									{
										aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
								}
								else if(isExp)
								{
									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								else if(isPart)//уже часть захвачена + ещё одна часть
								{
									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								else if(DeleteRows)
								{
									if(!this.checkRemoveTableParts(newActiveRange, tableRange))
									{
										aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
									else if(activeCells.r1 < tableRange.r1 && activeCells.r2 >= tableRange.r1 && activeCells.r2 < tableRange.r2)//TODO заглушка!!!
									{
										aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
								}
								else if(DeleteColumns && activeCells.c1 < tableRange.c1 && activeCells.c2 >= tableRange.c1 && activeCells.c2 < tableRange.c2)//TODO заглушка!!!
								{
									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								else	
									isPart = true;	
							}
						}
					}
					return result;
				}
				
				//проверка на то, что захвачен кусок форматированной таблицы
				if(tableParts)//при удалении в MS Excel ошибка может возникать только в случае форматированных таблиц
				{
					for(var i = 0; i < tableParts.length; i++ )
					{
						tableRange = tableParts[i].Ref;
						isExp = false;
						//если хотя бы одна ячейка активной области попадает внутрь форматированной таблицы
						if(activeCells.isIntersect(tableRange))
						{
							//если селектом засхвачена не вся таблица, то выдаём ошибку и возвращаем false
							if(activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2)
							{	
								result = true;
							}
							else
							{
								if(InsertCellsAndShiftDown)
								{
									if(activeCells.c1 <= tableRange.c1 && activeCells.c2 >= tableRange.c2 && activeCells.r1 <= tableRange.r1)
										isExp = true;
								}
								else if(InsertCellsAndShiftRight)
								{
									if(activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2 && activeCells.c1 <= tableRange.c1)
										isExp = true;
								}
								if(!isExp)
								{

									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
						}
						else
						{
							//проверка на то, что хотим сдвинуть часть отфильтрованного диапазона
							if(DeleteCellsAndShiftLeft)
							{
								//если данный фильтр находится справа
								if(tableRange.c1 > activeCells.c1 && (((tableRange.r1 <= activeCells.r1 && tableRange.r2 >= activeCells.r1) || (tableRange.r1 <= activeCells.r2  && tableRange.r2 >= activeCells.r2))  && !(tableRange.r1 == activeCells.r1 && tableRange.r2 == activeCells.r2)))
								{

									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
							else if(DeleteCellsAndShiftTop)
							{
								//если данный фильтр находится внизу
								if(tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2  && tableRange.c2 >= activeCells.c2))  && !(tableRange.c1 == activeCells.c1 && tableRange.c2 == activeCells.c2)))
								{

									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								
							}
							else if(InsertCellsAndShiftRight)
							{
								//если данный фильтр находится справа
								if(tableRange.c1 > activeCells.c1 && (((tableRange.r1 <= activeCells.r1 && tableRange.r2 >= activeCells.r1) || (tableRange.r1 <= activeCells.r2  && tableRange.r2 >= activeCells.r2)) && !(tableRange.r1 == activeCells.r1 && tableRange.r2 == activeCells.r2)))
								{

									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
							else
							{
								//если данный фильтр находится внизу
								if(tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2  && tableRange.c2 >= activeCells.c2))  && !(tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2)))
								{

									aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
						}
						
						//если сдвигаем данный фильтр
						if(DeleteCellsAndShiftLeft && tableRange.c1 > activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2)
						{
							result = true;
						}
						else if(DeleteCellsAndShiftTop && tableRange.r1 > activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2)
						{
							result = true;
						}
						else if(InsertCellsAndShiftRight && tableRange.c1 >= activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2)
						{
							result = true;
						}
						else if(InsertCellsAndShiftDown && tableRange.r1 >= activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2)
						{
							result = true;
						}
					}
				}
				
				//при вставке ошибка в MS Excel может возникать как в случае автофильтров, так и в случае форматированных таблиц
				if((DeleteCellsAndShiftLeft || DeleteCellsAndShiftTop || InsertCellsAndShiftDown || InsertCellsAndShiftRight) && autoFilter)
				{
					tableRange = autoFilter.Ref;
					//если хотя бы одна ячейка активной области попадает внутрь форматированной таблицы
					if(activeCells.isIntersect(tableRange))
					{
						if(activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2)
						{
							result = true;
						}
						else if((DeleteCellsAndShiftLeft || DeleteCellsAndShiftTop) && activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r1)
							result = true;
						else if(InsertCellsAndShiftDown && activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r1)
							result = true;
					}
					
					
					//если данный фильтр находится внизу, то ошибка
					if((InsertCellsAndShiftDown || DeleteCellsAndShiftTop) && tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2  && tableRange.c2 >= activeCells.c2))  && !(tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2)))
					{

						aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
						return false;
					}
					else if(InsertCellsAndShiftRight && activeCells.c1 <= tableRange.c1 && ((activeCells.r1 >= tableRange.r1 && activeCells.r1 <= tableRange.r2) || (activeCells.r2 >= tableRange.r1 && activeCells.r2 <= tableRange.r2)) && !(activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2))//если часть а/ф находится справа
					{
						aWs.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
						return false;
					}
					
					//если выделенная область находится до а/ф
					if(activeCells.c2 < tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2 && (DeleteCellsAndShiftLeft || InsertCellsAndShiftRight))
						result = true;
					else if(activeCells.r2 < tableRange.r1 && activeCells.c1 <= tableRange.c1 && activeCells.c2 >= tableRange.c2 && (InsertCellsAndShiftDown || DeleteCellsAndShiftTop))
						result = true;
				}

				return result;
			},
			
			//TODO избавиться от split, передавать cellId и tableName
			_getPressedFilter: function(activeRange, cellId)
			{
				var aWs = this._getCurrentWS();
				
				if(cellId !== undefined)
				{
					var curCellId = cellId.split('af')[0];
					var col = aWs.getCell(new CellAddress(curCellId)).first.col - 1;
					var row = aWs.getCell(new CellAddress(curCellId)).first.row - 1;
					activeRange =  new Asc.Range(col, row, col, row);
				}
				
				var ColId = null;
				var filter = null;
				var index = null;
				var autoFilter;
				if(aWs.AutoFilter)
				{
					if(aWs.AutoFilter.Ref.containsRange(activeRange))
					{
						filter = aWs.AutoFilter;
						autoFilter = filter;
						ColId = activeRange.c1 - aWs.AutoFilter.Ref.c1;
					}
				}
				
				if(aWs.TableParts && aWs.TableParts.length)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{	
						if(aWs.TableParts[i].Ref.containsRange(activeRange))
						{
							filter = aWs.TableParts[i];
							autoFilter = filter.AutoFilter;
							ColId = activeRange.c1 - aWs.TableParts[i].Ref.c1;
						}
					}
				}
				
				ColId = this._getTrueColId(filter, ColId);
				
				if(autoFilter && autoFilter.FilterColumns)
				{
					for(var i = 0; i < autoFilter.FilterColumns.length; i++)
					{
						if(autoFilter.FilterColumns[i].ColId === ColId)
						{
							index = i;
							break;
						}
					}
				}
				
				
				return {filter: filter, index: index, activeRange: activeRange, ColId: ColId};
			},
			
			_getFilterByDisplayName: function(displayName)
			{
				var res = null;
				var aWs = this._getCurrentWS();
				if(displayName === null)
					res = aWs.AutoFilter;
				else if(aWs.TableParts && aWs.TableParts.length)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{	
						if(aWs.TableParts[i].DisplayName === displayName)
						{
							res = aWs.TableParts[i];
							break;
						}
					}
				}
				
				return res;
			},
			
			_hiddenAnotherFilter: function(filterColumns, cellId, r, c)
			{
				var aWs = this._getCurrentWS();
				var result = false; 
				
				for(var j = 0; j < filterColumns.length; j++)
				{
					var colId = filterColumns[j].ColId;
					
					if(colId !== cellId)
					{
						var cell = aWs.getCell3(r, colId + c);
						var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						var val = isDateTimeFormat ? cell.getValueWithoutFormat() : cell.getValueWithFormat()

						if(filterColumns[j].isHideValue(val, isDateTimeFormat))
						{
							result = true;
							break;
						}
					}
				}
				
				return result;
			},
			
			_addHistoryObj: function (oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter) {
				var ws = this.worksheet;
				var oHistoryObject = new UndoRedoData_AutoFilter();
				oHistoryObject.undo = oldObj;

				if(redoObject)
				{
					oHistoryObject.activeCells			= redoObject.activeCells.clone();	// ToDo Слишком много клонирования, это долгая операция
					oHistoryObject.styleName			= redoObject.styleName;
					oHistoryObject.type					= redoObject.type;
					oHistoryObject.cellId				= redoObject.cellId;
					oHistoryObject.autoFiltersObject	= redoObject.autoFiltersObject;
					oHistoryObject.addFormatTableOptionsObj = redoObject.addFormatTableOptionsObj;
					oHistoryObject.moveFrom             = redoObject.arnFrom;
					oHistoryObject.moveTo               = redoObject.arnTo;
					oHistoryObject.bWithoutFilter       = bWithoutFilter ? bWithoutFilter : false;
					oHistoryObject.displayName          = redoObject.displayName;
				}
				else
				{
					oHistoryObject.activeCells			= ws.activeRange.clone();
					if(type !== historyitem_AutoFilter_Change)
						type = null;
				}
				
				if(!activeHistoryRange)
					activeHistoryRange = null;
				
				History.Add(g_oUndoRedoAutoFilters, type, ws.model.getId(), activeHistoryRange, oHistoryObject);
				if(deleteFilterAfterDeleteColRow)
					History.ChangeActionsEndToStart();
			},
			
			_drawSmallIconTable: function(canvas, style, fmgrGraphics, oFont)
			{
				//for test
				/*if(!document.getElementById('drawIcon'))
				{
					var canvas = document.createElement('canvas');
					canvas.id = 'drawIcon';
					canvas.style.position = 'absolute';
					canvas.style.top = '20px';
					canvas.style.left = '100px';
					canvas.width = '61';
					canvas.height = '46';
					canvas.style.zIndex = '10000';
					document.getElementById('wb-widget').appendChild(canvas);	
				}
				else 
					return
				var canvas = document.getElementById('drawIcon');*/
				
				var ctx = new Asc.DrawingContext({canvas: canvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});
				var styleOptions = style;
				//по умолчанию ставим строку заголовка и чередующиеся строки, позже нужно будет получать параметр
				var styleInfo = false;
				
				/*var tableParts = undefined;
				if(aWs && tableParts)
				{
					styleInfo = {
						ShowColumnStripes: tableParts.TableStyleInfo.ShowColumnStripes,
						ShowFirstColumn: tableParts.TableStyleInfo.ShowFirstColumn,
						ShowLastColumn: tableParts.TableStyleInfo.ShowLastColumn,
						ShowRowStripes: tableParts.TableStyleInfo.ShowRowStripes,
						TotalsRowCount: tableParts.TotalsRowCount
					}

				}*/

				if(!styleInfo)
				{
					styleInfo = {
						ShowColumnStripes: false,
						ShowFirstColumn: false,
						ShowLastColumn: false,
						ShowRowStripes: true,
						TotalsRowCount: 0
					}
				}
				
				var pxToMM = 72 / 96;
				var ySize = 45 * pxToMM;
				var xSize = 61 * pxToMM;

				var stepY = (ySize)/5;
				var stepX = (60 * pxToMM)/5;
				var whiteColor = new CColor(255, 255, 255);
				var blackColor = new CColor(0, 0, 0);
				
				//**draw background**
				var defaultColorBackground;
				if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill)
					defaultColorBackground = styleOptions.wholeTable.dxf.fill.bg;
				else
					defaultColorBackground = whiteColor;

				var color;
				if(styleOptions != undefined)
				{
					if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
					{
						ctx.setFillStyle(styleOptions.wholeTable.dxf.fill.bg);
						ctx.fillRect(0,0,xSize,ySize);
					}
					else
					{
						ctx.setFillStyle(whiteColor);
						ctx.fillRect(0,0,xSize,ySize);
					}
					if(styleInfo.ShowColumnStripes)//column stripes
					{
						for(k = 0; k < 6; k++)
						{
							color = defaultColorBackground;
							if((k)%2 == 0)
							{
								if(styleOptions.firstColumnStripe && styleOptions.firstColumnStripe.dxf.fill && null != styleOptions.firstColumnStripe.dxf.fill.bg)
									color =  styleOptions.firstColumnStripe.dxf.fill.bg;
								else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
									color =  styleOptions.wholeTable.dxf.fill.bg;
							}
							else
							{
								if(styleOptions.secondColumnStripe && styleOptions.secondColumnStripe.dxf.fill && null != styleOptions.secondColumnStripe.dxf.fill.bg)
									color = styleOptions.secondColumnStripe.dxf.fill.bg;
								else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
									color =  styleOptions.wholeTable.dxf.fill.bg;	
							}
							ctx.setFillStyle(color);
							ctx.fillRect(k*stepX,0,stepX,ySize);	
						}
					}
					
					if(styleInfo.ShowRowStripes)//row stripes
					{
						for(k = 0; k < 6; k++)
						{
							color = null;
							if(styleOptions)//styleOptions.headerRow
							{
								if(k ==0)
									k++;
								if((k)%2 != 0)
								{
									if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg)
										color = styleOptions.firstRowStripe.dxf.fill.bg;
								}
								else
								{
									if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg)
										color = styleOptions.secondRowStripe.dxf.fill.bg;
									else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
										color = styleOptions.wholeTable.dxf.fill.bg;
										
								}
								if(color != null)
								{
									ctx.setFillStyle(color);
									if(k == 1)
										ctx.fillRect(0, k*stepY, xSize, stepY);
									else if(k == 3)
										ctx.fillRect(0, k*stepY, xSize,stepY);
									else
										ctx.fillRect(0, k*stepY, xSize, stepY);
									//else
										//ctx.fillRect(0,k*stepY,xSize,stepY);
								}
								
							}
							else
							{
								color = null;
								if((k+1)%2 != 0)
								{
									if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg)
										color =  styleOptions.firstRowStripe.dxf.fill.bg;
								}
								else
								{
									if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg)
										color =  styleOptions.secondRowStripe.dxf.fill.bg;
									else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
										color =  styleOptions.wholeTable.dxf.fill.bg;
								}
								
								if(color != null)
								{
									ctx.setFillStyle(color);
									ctx.fillRect(0, k*stepY, xSize, stepY);	
								}
							}
							
						}
							
					}
					if(styleInfo.ShowFirstColumn && styleOptions.firstColumn)//first column
					{
						if(styleOptions.firstColumn && styleOptions.firstColumn.dxf.fill && null != styleOptions.firstColumn.dxf.fill.bg)
							ctx.setFillStyle(styleOptions.firstColumn.dxf.fill.bg);
						else
							ctx.setFillStyle(defaultColorBackground);
						ctx.fillRect(0,0,stepX,ySize);
					}
					if(styleInfo.ShowLastColumn)//last column
					{
						color = null;
						if(styleOptions.lastColumn && styleOptions.lastColumn.dxf.fill && null != styleOptions.lastColumn.dxf.fill.bg)
							color =styleOptions.lastColumn.dxf.fill.bg;

						if(color != null)
						{
							ctx.setFillStyle(color);
							ctx.fillRect(4*stepX,0,stepX,ySize);
						}
						
					}
					if(styleOptions)//header row
					{
						if(styleOptions.headerRow && styleOptions.headerRow.dxf.fill && null != styleOptions.headerRow.dxf.fill.bg)
						{
							ctx.setFillStyle(styleOptions.headerRow.dxf.fill.bg);
						}
						else
						{
							ctx.setFillStyle(defaultColorBackground);
						}
						ctx.fillRect(0, 0, xSize, stepY);
						
					}
					if(styleInfo.TotalsRowCount)//total row
					{
						color = null;
						if(styleOptions.totalRow && styleOptions.totalRow.dxf.fill && null != styleOptions.totalRow.dxf.fill.bg)
							color = styleOptions.totalRow.dxf.fill.bg;
						else
							color = defaultColorBackground;
						ctx.setFillStyle(color);
						ctx.fillRect(0, stepY*4, xSize, stepY);
					}
					
					
						//первая ячейка
					if(styleOptions.firstHeaderCell && styleInfo.ShowFirstColumn)
					{
						if(styleOptions.firstHeaderCell && styleOptions.firstHeaderCell.dxf.fill && null != styleOptions.firstHeaderCell.dxf.fill.bg)
							ctx.setFillStyle(styleOptions.firstHeaderCell.dxf.fill.bg);
						else
							ctx.setFillStyle(defaultColorBackground);
						ctx.fillRect(0,0,stepX,stepY);
					}					
					//последняя в первой строке
					if(styleOptions.lastHeaderCell && styleInfo.ShowLastColumn)
					{
						if(styleOptions.lastHeaderCell && styleOptions.lastHeaderCell.dxf.fill && null != styleOptions.lastHeaderCell.dxf.fill.bg)
							ctx.setFillStyle(styleOptions.lastHeaderCell.dxf.fill.bg);
						else
							ctx.setFillStyle(defaultColorBackground);
						ctx.fillRect(4*stepX,0,stepX,stepY);
					}
					//первая в последней строке	
					if(styleOptions.firstTotalCell  && styleInfo.TotalsRowCount && styleInfo.ShowFirstColumn)
					{
						if(styleOptions.firstTotalCell && styleOptions.firstTotalCell.dxf.fill && null != styleOptions.firstTotalCell.dxf.fill.bg)
							ctx.setFillStyle(styleOptions.firstTotalCell.dxf.fill.bg);
						else
							ctx.setFillStyle(defaultColorBackground);
						ctx.fillRect(0,4*stepY,stepX,stepY);
					}					
					//последняя ячейка	
					if(styleOptions.lastTotalCell  && styleInfo.TotalsRowCount && styleInfo.ShowLastColumn)
					{
						if(styleOptions.lastTotalCell && styleOptions.lastTotalCell.dxf.fill && null != styleOptions.lastTotalCell.dxf.fill.bg)
							ctx.setFillStyle(styleOptions.lastTotalCell.dxf.fill.bg);
						else
							ctx.setFillStyle(defaultColorBackground);
						ctx.fillRect(4*stepX,4*stepY,stepX,ySize);
					}
						
				}
				else
				{	
					ctx.setFillStyle(whiteColor);
					ctx.fillRect(0,0,xSize,ySize);
				}
			
				
				
				//**draw vertical and horizontal lines**
				if(styleOptions != undefined)
				{
					ctx.setLineWidth(1);
					ctx.beginPath();
					if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.border)
					{
						var borders = styleOptions.wholeTable.dxf.border;
						if(borders.t.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(borders.t.c);
							ctx.lineHor(0, 0, xSize);
						}
						if(borders.b.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(borders.b.c);
							ctx.lineHor(0, ySize, xSize);
						}					
						if(borders.l.s !== c_oAscBorderStyles.None)
						{	
							ctx.setStrokeStyle(borders.l.c);
							ctx.lineVer(0, 0, ySize);
						}
						if(borders.r.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(borders.r.c);
							ctx.lineVer(xSize - 1, 0, ySize);
						}
						if(borders.ih.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(borders.ih.c);
							for(var n = 1; n < 5; n++)
							{
								ctx.lineHor(0, stepY*n, xSize);
							}
							ctx.stroke();			
						}
						if(borders.iv.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(borders.iv.c);
							for(var n = 1; n < 5; n++)
							{
								ctx.lineVer(stepX*n, 0, ySize);
							}
							ctx.stroke();			
						}
						
					}

					var border;
					if(styleInfo.ShowRowStripes)
					{
						if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.border)
							border = styleOptions.firstRowStripe.dxf.border;
						else if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.border)
							border = styleOptions.secondRowStripe.dxf.border;
						
						if(border)
						{
							for(n = 1; n < 5; n++)
							{
								ctx.lineHor(0, stepY*n, xSize);
							}
							ctx.stroke();
						}
					}
					if(styleOptions.totalRow && styleInfo.TotalsRowCount && styleOptions.totalRow.dxf.border)
					{
						border = styleOptions.totalRow.dxf.border;
						if(border.t.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(border.t.c);
							ctx.lineVer(0, xSize, ySize);
						}
					}
					if(styleOptions.headerRow && styleOptions.headerRow.dxf.border)//header row
					{
						border = styleOptions.headerRow.dxf.border;
						if(border.t.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(border.t.c);
							ctx.lineHor(0, 0, xSize);
						}
						if(border.b.s !== c_oAscBorderStyles.None)
						{
							ctx.setStrokeStyle(border.b.c);
							ctx.lineHor(0, stepY, xSize);
						}
						ctx.stroke();
					}
					ctx.closePath();  
				}
				
				//**draw marks line**
				var defaultColor;
				if(!styleOptions || !styleOptions.wholeTable || !styleOptions.wholeTable.dxf.font)
					defaultColor = blackColor;
				else
					defaultColor = styleOptions.wholeTable.dxf.font.c;
				for(var n = 1; n < 6; n++)
				{
					ctx.beginPath();
					color = null;
					if(n == 1 && styleOptions && styleOptions.headerRow && styleOptions.headerRow.dxf.font)
						color = styleOptions.headerRow.dxf.font.c;
					else if(n == 5 && styleOptions && styleOptions.totalRow && styleOptions.totalRow.dxf.font)
						color = styleOptions.totalRow.dxf.font.c;
					else if(styleOptions && styleOptions.headerRow && styleInfo.ShowRowStripes)
					{
						if((n == 2 || (n == 5 && !styleOptions.totalRow)) &&  styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font)
							color  = styleOptions.firstRowStripe.dxf.font.c;
						else if(n == 3 && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font)
							color  = styleOptions.secondRowStripe.dxf.font.c;
						else
							color = defaultColor
					}
					else if(styleOptions && !styleOptions.headerRow && styleInfo.ShowRowStripes)
					{	
						if((n == 1 || n == 3 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font)
							color  = styleOptions.firstRowStripe.dxf.font.c;
						else if((n == 2 || n == 4) && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font)
							color  = styleOptions.secondRowStripe.dxf.font.c;
						else
							color = defaultColor
					}
					else
						color = defaultColor;
					ctx.setStrokeStyle(color);
					var k = 0;
					var strY = n*stepY - stepY/2;
					while(k < 6)
					{
						ctx.lineHor(k*stepX + 3 * pxToMM, strY, (k + 1)*stepX - 2 * pxToMM);
						k++;
					}
					ctx.stroke();
					ctx.closePath();  
				}
				
				return canvas.toDataURL("image/png");
			},
			
			_getCurrentWS : function() {
				var ws = this.worksheet;
				return ws.model;
			},
			
			_checkClickFrozenArea: function(x, y, offsetX, offsetY, frozenObj)
			{
				var ws = this.worksheet;
				var frosenPosX = frozenObj && frozenObj.cFrozen != undefined && ws.cols[frozenObj.cFrozen] ? ws.cols[frozenObj.cFrozen].left : null;
				var frosenPosY = frozenObj && frozenObj.rFrozen != undefined && ws.rows[frozenObj.rFrozen] ? ws.rows[frozenObj.rFrozen].top : null;
				var result;
				
				if(frosenPosX != null && frosenPosY != null && x < frosenPosX && y < frosenPosY)
				{
					result = {x: x, y: y};
				}
				else if(frosenPosX != null && x < frosenPosX)
				{
					result = {x: x, y: y + offsetY};
				}
				else if(frosenPosY != null && y < frosenPosY)
				{
					result = {x: x + offsetX, y: y};
				}
				else
				{
					result = {x: x + offsetX, y: y + offsetY};
				}
				
				return result;
			},

			renameTableColumn: function(range, bUndo)
			{
				var aWs = this._getCurrentWS();
				var val;
				var cell;
				var generateName;
				if(aWs.TableParts)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						var filter = aWs.TableParts[i];
						
						var ref = filter.Ref;
						var tableRange = new Asc.Range(ref.c1, ref.r1, ref.c2, ref.r1);
						
						//в этом случае нашли ячейки(ячейку), которая входит в состав заголовка фильтра
						var intersection = range.intersection(tableRange);
						if(intersection != null)
						{
							//проходимся по всем заголовкам
							for(var j = tableRange.c1; j <= tableRange.c2; j++)
							{
								if(j < range.c1 || j > range.c2)
									continue;	
									
								cell = aWs.getCell3(ref.r1, j);
								val = cell.getValue();
								//если не пустая изменяем TableColumns
								if(val != "" && intersection.c1 <= j && intersection.c2 >= j )
								{
									filter.TableColumns[j - tableRange.c1].Name = val;
									if(!bUndo)
										cell.setType(CellValueType.String);
								}	
								else if(val == "")//если пустая изменяем генерируем имя и добавляем его в TableColumns  
								{
									filter.TableColumns[j - tableRange.c1].Name = "";
									generateName = this._generateColumnName(filter.TableColumns);
									if(!bUndo)
									{
										cell.setValue(generateName);
										cell.setType(CellValueType.String);
									}									
									filter.TableColumns[j - tableRange.c1].Name = generateName;
								}
							}
						}
					}
				}
			},
			
			_isTablePartsContainsRange: function(range)
			{
				var aWs = this._getCurrentWS();
				var result = null;
				if(aWs.TableParts && aWs.TableParts.length)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						if(aWs.TableParts[i].Ref.containsRange(range))
						{
							result = aWs.TableParts[i];
							break;
						}
					}
				}
				return result;
			},
			
			_getAdjacentCellsAF2: function(ar, aWs) 
			{
				var ws = this.worksheet;
				var cloneActiveRange = ar.clone(true); // ToDo слишком много клонирования
				
				var isEnd = false, cell, result;
				
				var prevActiveRange = {r1: cloneActiveRange.r1, c1: cloneActiveRange.c1, r2: cloneActiveRange.r2, c2: cloneActiveRange.c2};
				
				while(isEnd === false)
				{
					//top
					var isEndWhile = false;
					var n = cloneActiveRange.r1;
					var k = cloneActiveRange.c1 - 1;
					while(!isEndWhile)
					{
						if(n < 0)
							n++;
						if(k < 0)
							k++;
						
						result = this._checkValueInCells(n,  k, cloneActiveRange);
						cloneActiveRange = result.cloneActiveRange;
						if(n == 0)
							isEndWhile = true;
							
						if(!result.isEmptyCell)
						{
							k = cloneActiveRange.c1 - 1; 
							n--;
						}
						else if(k == cloneActiveRange.c2 + 1)
							isEndWhile = true;
						else 
							k++;
					}
					
					//bottom
					isEndWhile = false;
					n = cloneActiveRange.r2;
					k = cloneActiveRange.c1 - 1;
					while(!isEndWhile)
					{
						if(n < 0)
							n++;
						if(k < 0)
							k++;
						
						result = this._checkValueInCells(n,  k, cloneActiveRange);
						cloneActiveRange = result.cloneActiveRange;
						if(n == ws.nRowsCount)
							isEndWhile = true;
							
						if(!result.isEmptyCell)
						{
							k = cloneActiveRange.c1 - 1; 
							n++;
						}
						else if(k == cloneActiveRange.c2 + 1)
							isEndWhile = true;
						else
							k++;
					}
					
					//left
					isEndWhile = false;
					n = cloneActiveRange.r1 - 1;
					k = cloneActiveRange.c1;
					while(!isEndWhile)
					{
						if(n < 0)
							n++;
						if(k < 0)
							k++;
						
						result = this._checkValueInCells(n++,  k, cloneActiveRange);
						cloneActiveRange = result.cloneActiveRange;
						if(k == 0)
							isEndWhile = true;
							
						if(!result.isEmptyCell)
						{
							n = cloneActiveRange.r1 - 1; 
							k--;
						}
						else if(n == cloneActiveRange.r2 + 1)
							isEndWhile = true;
					}
					
					//right
					isEndWhile = false;
					n = cloneActiveRange.r1 - 1;
					k = cloneActiveRange.c2 + 1;
					while(!isEndWhile)
					{
						if(n < 0)
							n++;
						if(k < 0)
							k++;
						
						result = this._checkValueInCells(n++,  k, cloneActiveRange);
						cloneActiveRange = result.cloneActiveRange;
						if(k == ws.nColsCount)
							isEndWhile = true;
							
						if(!result.isEmptyCell)
						{
							n = cloneActiveRange.r1 - 1; 
							k++;
						}
						else if(n == cloneActiveRange.r2 + 1)
							isEndWhile = true;
					}
					
					if(prevActiveRange.r1 == cloneActiveRange.r1 && prevActiveRange.c1 == cloneActiveRange.c1 && prevActiveRange.r2 == cloneActiveRange.r2 && prevActiveRange.c2 == cloneActiveRange.c2)
						isEnd = true;
					
					prevActiveRange = {r1: cloneActiveRange.r1, c1: cloneActiveRange.c1, r2: cloneActiveRange.r2, c2: cloneActiveRange.c2};
				}
				

				//проверяем есть ли пустые строчки и столбцы в диапазоне
				if(ar.r1 == cloneActiveRange.r1)
				{
					for(var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++)
					{
						cell = ws.model.getRange3(cloneActiveRange.r1, n, cloneActiveRange.r1, n);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.c2 && cloneActiveRange.c2 > cloneActiveRange.c1)
							cloneActiveRange.r1++;
					}
				}
				else if(ar.r1 == cloneActiveRange.r2)
				{
					for(var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++)
					{
						cell = ws.model.getRange3(cloneActiveRange.r2, n, cloneActiveRange.r2, n);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1)
							cloneActiveRange.r2--;
					}
				}
				
				if(ar.c1 == cloneActiveRange.c1)
				{
					for(var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++)
					{
						cell = ws.model.getRange3(n, cloneActiveRange.c1, n, cloneActiveRange.c1);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.r2 && cloneActiveRange.r2 > cloneActiveRange.r1)
							cloneActiveRange.c1++;
					}
				}
				else if(ar.c1 == cloneActiveRange.c2)
				{
					for(var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++)
					{
						cell = ws.model.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.r2 && cloneActiveRange.c2 > cloneActiveRange.c1)
							cloneActiveRange.c2--;
					}
				}
				
				//проверяем не вошёл ли другой фильтр в область нового фильтра
				if(aWs.AutoFilter || aWs.TableParts)
				{
					//var oldFilters = this.allAutoFilter;
					var oldFilters =[];
							
					if(aWs.AutoFilter)
					{
						oldFilters[0] = aWs.AutoFilter
					}
					
					if(aWs.TableParts)
					{
						var s = 1;
						if(!oldFilters[0])
							s = 0;
						for(k = 0; k < aWs.TableParts.length; k++)
						{
							if(aWs.TableParts[k].AutoFilter)
							{
								oldFilters[s] = aWs.TableParts[k];
								s++;
							}
						}
					}
							
					var newRange = {}, oldRange;
					for(var i = 0; i < oldFilters.length; i++)
					{
						if(!oldFilters[i].Ref || oldFilters[i].Ref == "")
							continue;

						oldRange = oldFilters[i].Ref;
						if(cloneActiveRange.r1 <= oldRange.r1 && cloneActiveRange.r2 >= oldRange.r2 && cloneActiveRange.c1 <= oldRange.c1 && cloneActiveRange.c2 >= oldRange.c2)
						{
							if(oldRange.r2 > ar.r1 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2)//top
								newRange.r2 = oldRange.r1 - 1;
							else if(oldRange.r1 < ar.r2 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2)//bottom
								newRange.r1 = oldRange.r2 + 1;
							else if(oldRange.c2 < ar.c1)//left
								newRange.c1 = oldRange.c2 + 1;
							else if(oldRange.c1 > ar.c2)//right
								newRange.c2 = oldRange.c1 - 1
						}
					}
					
					if(!newRange.r1)
						newRange.r1 = cloneActiveRange.r1;
					if(!newRange.c1)
						newRange.c1 = cloneActiveRange.c1;
					if(!newRange.r2)
						newRange.r2 = cloneActiveRange.r2;
					if(!newRange.c2)
						newRange.c2 = cloneActiveRange.c2;
					
					newRange = Asc.Range(newRange.c1, newRange.r1, newRange.c2, newRange.r2);
					
					cloneActiveRange = newRange;
				}
			

				if(cloneActiveRange)
					return cloneActiveRange;
				else
					return ar;

			},
			
			//TODO пока включаю протестированную функцию. позже доработать функцию _getAdjacentCellsAF2, она работает быстрее!
			_getAdjacentCellsAF: function(ar, aWs, ignoreAutoFilter) 
			{
				var ws = this.worksheet;
				var cloneActiveRange = ar.clone(true); // ToDo слишком много клонирования
				
				var isEnd = true, cell, merged, valueMerg, rowNum = cloneActiveRange.r1, isEmptyCell;
				
				//есть ли вообще на странице мерженные ячейки
				//TODO стоит пересмотреть проверку мерженных ячеек
				var allRange = aWs.getRange3(0, 0, ws.nRowsCount, ws.nColsCount);
				var isMergedCells = allRange.hasMerged();
				
				for(var n = cloneActiveRange.r1 - 1; n <= cloneActiveRange.r2 + 1; n++)
				{
					if(n < 0)
						continue;
					if(!isEnd)
					{
						rowNum = cloneActiveRange.r1;
						if(cloneActiveRange.r1 > 0)
							n = cloneActiveRange.r1 - 1;
						if(cloneActiveRange.c1 > 0)
							k = cloneActiveRange.c1 - 1;
					}
					
					if(n > cloneActiveRange.r1 && n < cloneActiveRange.r2 && k > cloneActiveRange.c1 && k < cloneActiveRange.c2)
						continue;
						
					isEnd  = true;
					for(var k = cloneActiveRange.c1 - 1; k <= cloneActiveRange.c2 + 1; k++)
					{
						if(k < 0)
							continue;
						
						//если находимся уже внутри выделенного фрагмента, то смысла его просматривать нет
						if(k >= cloneActiveRange.c1 && k <= cloneActiveRange.c2 && n >= cloneActiveRange.r1 && n <= cloneActiveRange.r2)
							continue;
							
						cell = aWs.getRange3(n, k, n, k);
						isEmptyCell = cell.isEmptyText();
						
						//если мерженная ячейка
						if(!(n == ar.r1 && k == ar.c1) && isMergedCells != null && isEmptyCell)
						{
							merged = cell.hasMerged();
							valueMerg = null;
							if(merged)
							{
								valueMerg = aWs.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
								if(valueMerg != null && valueMerg != "")
								{	
									if(merged.r1 < cloneActiveRange.r1)
									{
										cloneActiveRange.r1 = merged.r1;
										n = cloneActiveRange.r1 - 1;
									}	
									if(merged.r2 > cloneActiveRange.r2)
									{
										cloneActiveRange.r2 = merged.r2;
										n = cloneActiveRange.r2 - 1;
									}
									if(merged.c1 < cloneActiveRange.c1)
									{
										cloneActiveRange.c1 = merged.c1;
										k = cloneActiveRange.c1 - 1;
									}	
									if(merged.c2 > cloneActiveRange.c2)
									{
										cloneActiveRange.c2 = merged.c2;
										k = cloneActiveRange.c2 - 1;
									}
									if(n < 0)
										n = 0;
									if(k < 0)
										k = 0;
										
									cell = aWs.getRange3(n, k, n, k);	
								}
							}
						}
						
						if((!isEmptyCell || (valueMerg != null && valueMerg != "")) && cell.getTableStyle() == null)
						{
							if(k < cloneActiveRange.c1)
							{
								cloneActiveRange.c1 = k;isEnd = false;
								//TODO пересмотреть правку
								k = k - 2;
							}	
							else if(k > cloneActiveRange.c2)
							{
								cloneActiveRange.c2 = k;isEnd = false;
							}	
							if(n < cloneActiveRange.r1)
							{
								cloneActiveRange.r1 = n;isEnd = false;
							}	
							else if(n > cloneActiveRange.r2)
							{
								cloneActiveRange.r2 = n;isEnd = false;
							}
						}
					}
				}
				
				//проверяем есть ли пустые строчки и столбцы в диапазоне
				var mergeCells;
				if(ar.r1 == cloneActiveRange.r1)
				{
					for(var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++)
					{
						cell = aWs.getRange3(cloneActiveRange.r1, n, cloneActiveRange.r1, n);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1/*&& cloneActiveRange.c2 > cloneActiveRange.c1*/)
							cloneActiveRange.r1++;
					}
				}
				else if(ar.r1 == cloneActiveRange.r2)
				{
					for(var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++)
					{
						cell = aWs.getRange3(cloneActiveRange.r2, n, cloneActiveRange.r2, n);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1)
							cloneActiveRange.r2--;
					}
				}
				
				if(ar.c1 == cloneActiveRange.c1)
				{
					for(var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++)
					{
						cell = aWs.getRange3(n, cloneActiveRange.c1, n, cloneActiveRange.c1);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.r2 && cloneActiveRange.r2 > cloneActiveRange.r1)
							cloneActiveRange.c1++;
					}
				}
				else if(ar.c1 == cloneActiveRange.c2)
				{
					for(var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++)
					{
						cell = aWs.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.r2 && cloneActiveRange.c2 > cloneActiveRange.c1)
						{
							mergeCells = aWs.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2).hasMerged();
							if(!mergeCells || mergeCells === null)//если не мерженная ячейка
								cloneActiveRange.c2--;
							else if(aWs.getRange3(mergeCells.r1, mergeCells.c1, mergeCells.r2, mergeCells.c2).getValue() == "")//если мерженная ячейка пустая
								cloneActiveRange.c2--;
						}
					}
				}
				
				//проверяем не вошёл ли другой фильтр в область нового фильтра
				if(aWs.AutoFilter || aWs.TableParts)
				{
					//var oldFilters = this.allAutoFilter;
					var oldFilters =[];
							
					if(aWs.AutoFilter && !ignoreAutoFilter)
					{
						oldFilters[0] = aWs.AutoFilter
					}
					
					if(aWs.TableParts)
					{
						var s = 1;
						if(!oldFilters[0])
							s = 0;
						for(k = 0; k < aWs.TableParts.length; k++)
						{
							if(aWs.TableParts[k].AutoFilter)
							{
								oldFilters[s] = aWs.TableParts[k];
								s++;
							}
						}
					}
							
					var newRange = {};
					for(var i = 0; i < oldFilters.length; i++)
					{
						if(!oldFilters[i].Ref || oldFilters[i].Ref == "")
							continue;

						var oldRange = oldFilters[i].Ref;
						var intersection = oldRange.intersection ? oldRange.intersection(cloneActiveRange) : null;
						if(cloneActiveRange.r1 <= oldRange.r1 && cloneActiveRange.r2 >= oldRange.r2 && cloneActiveRange.c1 <= oldRange.c1 && cloneActiveRange.c2 >= oldRange.c2)
						{
							if(oldRange.r2 > ar.r1 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2)//top
								newRange.r2 = oldRange.r1 - 1;
							else if(oldRange.r1 < ar.r2 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2)//bottom
								newRange.r1 = oldRange.r2 + 1;
							else if(oldRange.c2 < ar.c1)//left
								newRange.c1 = oldRange.c2 + 1;
							else if(oldRange.c1 > ar.c2)//right
								newRange.c2 = oldRange.c1 - 1;
						}
						else if(intersection)
						{
							if(intersection.r1 >= cloneActiveRange.r1 && intersection.r1 <= cloneActiveRange.r2)//место пересечения ниже
							{
								cloneActiveRange.r2 = intersection.r1 - 1;
								if(cloneActiveRange.r2 < cloneActiveRange.r1)
									cloneActiveRange.r1 = cloneActiveRange.r2;
							}
						}
					}
					
					if(!newRange.r1)
						newRange.r1 = cloneActiveRange.r1;
					if(!newRange.c1)
						newRange.c1 = cloneActiveRange.c1;
					if(!newRange.r2)
						newRange.r2 = cloneActiveRange.r2;
					if(!newRange.c2)
						newRange.c2 = cloneActiveRange.c2;
					
					newRange = Asc.Range(newRange.c1, newRange.r1, newRange.c2, newRange.r2);
					
					cloneActiveRange = newRange;
				}
			
				//if(ar.r1 == cloneActiveRange.r1 && ar.r2 == cloneActiveRange.r2 && ar.c1 == cloneActiveRange.c1 && ar.c2 == cloneActiveRange.c2)
					//return false;
				//else
					if(cloneActiveRange)
						return cloneActiveRange;
					else
						return ar;

			},
			
			_addNewFilter: function(ref, style, bWithoutFilter, tablePartDisplayName)
			{
				var aWs = this._getCurrentWS();
				var newFilter;
				
				if(!style)
				{
					if(!aWs.AutoFilter)
					{
						newFilter = new AutoFilter();
						//ref = Asc.g_oRangeCache.getAscRange(val[0].id + ':' + val[val.length - 1].idNext).clone();
						newFilter.Ref =  ref;
						aWs.AutoFilter = newFilter;
					}
					
					//проходимся по 1 строчке в поиске мерженных областей
					var row = ref.r1;
					var cell, filterColumn;
					for(var col = ref.c1; col <= ref.c2; col++)
					{
						cell = aWs.getCell3(row, col);
						var isMerged = cell.hasMerged();
						var isMergedAllRow = (isMerged && isMerged.c2 + 1 == gc_nMaxCol && isMerged.c1 === 0) ? true : false;//если замержена вся ячейка
						
						if((isMerged && isMerged.c2 != col && !isMergedAllRow) || (isMergedAllRow && col !== ref.c1))
						{	
							filterColumn = aWs.AutoFilter.addFilterColumn();
							filterColumn.ColId = col - ref.c1;
							filterColumn.ShowButton = false;
						}
					}
					return 	aWs.AutoFilter;
				}
				else
				{
					var tableColumns = this._generateColumnNameWithoutTitle(ref);
					
					if(!aWs.TableParts)
						aWs.TableParts = [];
					//ref = Asc.g_oRangeCache.getAscRange(val[0].id + ':' + val[val.length - 1].idNext).clone();
					
					newFilter = aWs.createTablePart();
					newFilter.Ref = ref;
					
					if(!bWithoutFilter)
					{
						newFilter.AutoFilter = new AutoFilter();
						newFilter.AutoFilter.Ref = ref;
					}

					if(tablePartDisplayName)
					{
						newFilter.DisplayName = tablePartDisplayName;
						aWs.workbook.dependencyFormulas.addTableName(tablePartDisplayName, aWs, ref);
					}
					else
						newFilter.DisplayName = aWs.workbook.dependencyFormulas.getNextTableName(aWs, ref);
					
					newFilter.TableStyleInfo = new TableStyleInfo();
					newFilter.TableStyleInfo.Name = style;
					newFilter.TableStyleInfo.ShowColumnStripes = false;
					newFilter.TableStyleInfo.ShowFirstColumn = false;
					newFilter.TableStyleInfo.ShowLastColumn = false;
					newFilter.TableStyleInfo.ShowRowStripes = true;
					
					newFilter.TableColumns = tableColumns;
					
					aWs.TableParts[aWs.TableParts.length] = newFilter;

					return 	aWs.TableParts[aWs.TableParts.length - 1];
				}
			},
			
			//TODO пока функции отрисовки находятся в модели..
			_drawButton: function(x1, y1, options)
			{
				var ws = this.worksheet;
				var isSet = options.isSetFilter;
				var height = 11.25;
				var width = 11.25;
				var rowHeight = ws.rows[options.row].height;
				var colWidth = ws.cols[options.col].width;
				var index = 1;
				var diffX = 0;
				var diffY = 0;
				if((colWidth - 2) < width && rowHeight < (height + 2))
				{
					if(rowHeight < colWidth)
					{
						index = rowHeight/height;
						width = width*index;
						height = rowHeight;
					}
					else
					{
						index = colWidth/width;
						diffY = width - colWidth;
						diffX = width - colWidth;
						width = colWidth;
						height = height*index;
					}
				}
				else if((colWidth - 2) < width)
				{
					index = colWidth/width;
					//смещения по x и y
					diffY = width - colWidth;
					diffX = width - colWidth + 2;
					width = colWidth;
					height = height*index;
				}
				else if(rowHeight < height)
				{
					index = rowHeight/height;
					width = width*index;
					height = rowHeight;
				}
				//квадрат кнопки рисуем
				ws.drawingCtx
					.setFillStyle(ws.settings.cells.defaultState.background)
					.setLineWidth(1)
					.setStrokeStyle(ws.settings.cells.defaultState.border)
					.fillRect(x1 + diffX, y1 + diffY, width, height)
					.strokeRect(x1 + diffX, y1 + diffY, width, height);
						
				//координаты левого верхнего угла кнопки
				var upLeftXButton = x1 + diffX;
				var upLeftYButton = y1 + diffY;
				var centerX, centerY;
				if(isSet)
				{
					centerX = upLeftXButton + (width/2);
					var heigthObj = Math.ceil((height/2)/0.75)*0.75;
					var marginTop = Math.floor(((height - heigthObj)/2)/0.75)*0.75;
					
					centerY = upLeftYButton + heigthObj + marginTop;
					this._drawFilterMark(centerX, centerY, heigthObj, index);
				}
				else
				{
					//центр кнопки
					centerX = upLeftXButton + (width/2);
					centerY = upLeftYButton + (height/2);
					this._drawFilterDreieck(centerX, centerY, index);
				}
			},
			
			_drawFilterMark: function(x,y,height,index)
			{
				var ws = this.worksheet;
				var size = 5.25*index;
				var halfSize = Math.round((size/2)/0.75)*0.75;
				var meanLine = Math.round((size*Math.sqrt(3)/3)/0.75)*0.75;//длина биссектрисы равностороннего треугольника
				//округляем + смещаем
				x = Math.round((x)/0.75)*0.75;
				y = Math.round((y)/0.75)*0.75;
				var y1  = y - height;

				ws.drawingCtx
					.beginPath()
					.moveTo(x, y)
					.lineTo(x, y1)
					.setStrokeStyle(this.m_oColor)
					.stroke();
				
				ws.drawingCtx
					.beginPath()
					.lineTo(x + halfSize, y1)
					.lineTo(x, y1 + meanLine)
					.lineTo(x  - halfSize, y1)
					.lineTo(x ,y1)
					.setFillStyle(this.m_oColor)
					.fill();
			},
			
			_drawFilterDreieck: function(x,y,index)
			{
				var ws = this.worksheet;
				var size = 5.25*index;
				//сюда приходят координаты центра кнопки
				//чтобы кнопка была в центре, необходимо сместить 
				var leftDiff = size/2;
				var upDiff = Math.round(((size*Math.sqrt(3))/6)/0.75)*0.75;//радиус вписанной окружности в треугольник
				//округляем + смещаем
				x = Math.round((x - leftDiff)/0.75)*0.75;
				y = Math.round((y - upDiff)/0.75)*0.75;
				var meanLine = Math.round((size*Math.sqrt(3)/3)/0.75)*0.75;//длина биссектрисы равностороннего треугольника
				var halfSize = Math.round((size/2)/0.75)*0.75;
				//рисуем
				ws.drawingCtx
					.beginPath()
					.moveTo(x , y)
					.lineTo(x + size,y)
					.lineTo(x + halfSize,y + meanLine)
					.lineTo(x , y)
					.setFillStyle(this.m_oColor)
					.fill();
			},
			
			_showAutoFilterDialog: function(filterProp) {
				var ws = this.worksheet;
				var aWs  = this._getCurrentWS();
				
				//get filter
				var filter, autoFilter, displayName = null;
				if(filterProp.id === null)
				{
					autoFilter = aWs.AutoFilter;
					filter = aWs.AutoFilter;
				}
				else
				{
					autoFilter = aWs.TableParts[filterProp.id].AutoFilter;
					filter = aWs.TableParts[filterProp.id];
					displayName = filter.DisplayName;
				}
				
				//get values
				var colId = filterProp.colId;
				var openAndClosedValues = this._getOpenAndClosedValues(autoFilter, colId);
				var values = openAndClosedValues.values;
				var automaticRowCount = openAndClosedValues.automaticRowCount
				var filters = this._getFilterColumn(autoFilter, colId);	
				
				var rangeButton = Asc.Range(autoFilter.Ref.c1 + colId, autoFilter.Ref.r1, autoFilter.Ref.c1 + colId, autoFilter.Ref.r1);
				var cellId = this._rangeToId(rangeButton);
				
				//get filter object
				var filterObj = new Asc.AutoFilterObj();
				if(filters && filters.ColorFilter)
				{
					filterObj.type = c_oAscAutoFilterTypes.ColorFilter;
					filterObj.filter = filters.ColorFilter;
				}
				else if(filters && filters.CustomFiltersObj && filters.CustomFiltersObj.CustomFilters)
				{
					filterObj.type = c_oAscAutoFilterTypes.CustomFilters;
					filterObj.filter = filters.CustomFiltersObj;
				}
				else if(filters && filters.DynamicFilter)
				{
					filterObj.type = c_oAscAutoFilterTypes.DynamicFilter;
					filterObj.filter = filters.DynamicFilter;
				}
				else if(filters && filters.Top10)
				{
					filterObj.type = c_oAscAutoFilterTypes.Top10;
					filterObj.filter = filters.Top10;
				}
				else
					filterObj.type = c_oAscAutoFilterTypes.Filters;
				
				//get sort
				var sortVal = false;
				if(filter && filter.SortState && filter.SortState.SortConditions && filter.SortState.SortConditions[0])
				{
					if(rangeButton.r1 == filter.SortState.SortConditions[0].Ref.r1 && rangeButton.c1 == filter.SortState.SortConditions[0].Ref.c1)
					{
						if(filter.SortState.SortConditions[0].ConditionDescending == false)
							sortVal = 'descending';
						else
							sortVal = 'ascending';
					}
				}
				
				//set menu object
				var autoFilterObject = new Asc.AutoFiltersOptions();

				autoFilterObject.asc_setSortState(sortVal);
				autoFilterObject.asc_setCellId(cellId);
				autoFilterObject.asc_setValues(values);
				autoFilterObject.asc_setFilterObj(filterObj);
				autoFilterObject.asc_setAutomaticRowCount(automaticRowCount);
				autoFilterObject.asc_setDiplayName(displayName);
				
				ws.handlers.trigger("setAutoFiltersDialog", autoFilterObject);
			},
			
			_parseComplexSpecSymbols: function(val, filter, filterVal, type)
			{
				var result = null;

				if(filterVal != undefined && filter != undefined && (filterVal.indexOf("?") != -1 || filterVal.indexOf("*") != -1))
				{
					var isEqual = false;
					var isStartWithVal = false;
					var isConsist = false;
					var isEndWith = false;
					var endBlockEqual = false;
					var endSpecSymbol;
					var isConsistBlock;
					result = false;
					if(type == 1)
					{
						var splitFilterVal = filterVal.split("*");
						var positionPrevBlock = 0;
						var firstEnter = false;
						isConsist = true;
						isStartWithVal = false;
						isEqual = false;
						isEndWith = false;
						for(var i = 0; i < splitFilterVal.length;i++)
						{
							if(splitFilterVal[i] != '')
							{
								if(splitFilterVal[i].indexOf("?") == -1)
								{
									firstEnter = true;
									endSpecSymbol = false;
									isConsistBlock = val.indexOf(splitFilterVal[i],positionPrevBlock);
									if(isConsistBlock == 0)
										isStartWithVal = true;
									if(isConsistBlock == -1 || positionPrevBlock > isConsistBlock)
									{
										isConsist = false;
										break;
									}
									else
									{
										positionPrevBlock = isConsistBlock + splitFilterVal[i].length;
										if(i == (splitFilterVal.length - 1))
											endBlockEqual = true;
									}
								}
								else if(splitFilterVal[i].length != 1)
								{
									firstEnter = true;
									endSpecSymbol = false;
									var splitQuestion = splitFilterVal[i].split('?');
									var startText = 0;
									if(i == 0)
									{
										for(var k = 0; k < splitQuestion.length; k++)
										{
											if(splitQuestion[k] != '')
											{
												startText = k;
												break;
											}
										}
									}
									var tempPosition = 0;
									for(var k = 0; k < splitQuestion.length; k++)
									{
										/*if(((k != 0 && k != splitQuestion.length - 1) || (k != splitQuestion.length - 1)) && splitQuestion[k] != '' )
										{
											positionPrevBlock++;
											if(splitQuestion[k] == '')
												continue;
										}*/
										//позиция начала блока в val
										if(splitQuestion[k] == '')
											tempPosition++;
										else
											tempPosition = val.indexOf(splitQuestion[k],positionPrevBlock);
										if(tempPosition == startText)
											isStartWithVal = true;
										if(tempPosition != -1)
										{
											positionPrevBlock += splitQuestion[k].length;
											tempPosition += splitQuestion[k].length;
											if(i == (splitFilterVal.length - 1) && k == (splitQuestion.length - 1) && (tempPosition == (val.length)))
												endBlockEqual = true;
										}
										else
										{
											isConsist = false;
											break;
										}
									}
								}
								else if(!firstEnter)
									isStartWithVal = true;
								else
									endSpecSymbol = true;
							}
							else if(!firstEnter)
								isStartWithVal = true;
							else
								endSpecSymbol = true;	
						}
						
						
						if(isConsist && (positionPrevBlock == val.length || endSpecSymbol || endBlockEqual))
							isEndWith = true;
						if(isStartWithVal && isConsist)
							isStartWithVal = true;
						else
							isStartWithVal = false;
						if(isConsist && isStartWithVal && isEndWith)
							isEqual = true;
						
						if(val.length == 1)
						{
							isEndWith = true;
							isStartWithVal = true;
							isEqual = true;
							isConsist = true;
						}
					}
					switch (filter)
					{
						case 1://равно
						{
							if(isEqual)
								result = true;
							break;
						}
						case 2://больше
						{
							if(type == 1 && !isEqual)
								result = true;
							else if(val > filterVal && !isEqual)
								result = true;
							break;
						}
						case 3://больше или равно
						{
							if(val > filterVal || isEqual || type == 1)
								result = true;
							break;
						}
						case 4://меньше
						{
							if(type == 1 && !isEqual)
								result = false;
							else if(val < filterVal && !isEqual)
								result = true;
							break;
						}
						case 5://меньше или равно
						{
							if((val < filterVal && type != 1) || isEqual)
								result = true;
							break;
						}
						case 6://не равно
						{
							if(!isEqual)
								result = true;
							break;
						}
						case 7://начинается с
						{
							if(isStartWithVal)
								result = true;
							break;
						}
						case 8://не начинается с
						{
							if(!isStartWithVal)
								result = true;
							break;
						}
						case 9://заканчивается на
						{
							if(isEndWith)
								result = true;
							break;
						}
						case 10://не заканчивается на
						{
							if(!isEndWith)
								result = true;
							break;
						}
						case 11://содержит
						{
							if(isConsist)
								result = true;
							break;
						}
						case 12://не содержит
						{
							if(!isConsist)
								result = true;
							break;
							
						}
					}
					return result;
				}	
			},
			
			_getOpenAndClosedValues: function(filter, colId, isOpenHiddenRows)
			{
				var ref = filter.Ref;
				var filterColumns = filter.FilterColumns;
				var aWs = this._getCurrentWS(), temp = {}, isDateTimeFormat, /*dataValue,*/ values = [];
				
				colId = this._getTrueColId(filter, colId);
				
				var currentElemArray = this._getFilterColumnNum(filterColumns, colId);//номер данного фильтра в массиве фильтров
				
				var addValueToMenuObj = function(tempResult, count)
				{
					//TODO ветка для добавления даты(как заделаем разделение год/месяц/число в меню)
					/*if(isDateTimeFormat)
					{
						if(!result.dates.year)
							result.dates.year = [];
						if(!result.dates.year[dataValue.year])
							result.dates.year[dataValue.year] = {};
						
						if(!result.dates.year[dataValue.year].month)
							result.dates.year[dataValue.year].month = [];
						if(!result.dates.year[dataValue.year].month[dataValue.month])
							result.dates.year[dataValue.year].month[dataValue.month] = {};
						
						if(!result.dates.year[dataValue.year].month[dataValue.month].day)
							result.dates.year[dataValue.year].month[dataValue.month].day = [];
						if(!result.dates.year[dataValue.year].month[dataValue.month].day[dataValue.d])
							result.dates.year[dataValue.year].month[dataValue.month].day[dataValue.d] = {};
							
						result.dates.year[dataValue.year].month[dataValue.month].day[dataValue.d].val = tempResult;
					}
					else*/
						values[count] = tempResult;
				};
				
				var maxFilterRow = ref.r2;
				var automaticRowCount = null;
				if(filter.getType() === g_nFiltersType.autoFilter && filter.isApplyAutoFilter() === false)//нужно подхватить нижние ячейки в случае, если это не применен а/ф
				{
					var automaticRange = this._getAdjacentCellsAF(filter.Ref, aWs, true);
					automaticRowCount = automaticRange.r2;
					
					if(automaticRowCount > maxFilterRow)
						maxFilterRow = automaticRowCount;
				}
				
				var individualCount, count, tempResult;
				var isCustomFilters = currentElemArray !== null && filterColumns[currentElemArray] && filterColumns[currentElemArray].CustomFiltersObj;
				if(currentElemArray === null || (filterColumns[currentElemArray] && (filterColumns[currentElemArray].Filters || filterColumns[currentElemArray].Top10 || filterColumns[currentElemArray].ShowButton === false) || isCustomFilters))
				{
					individualCount = 0;
					count = 0;
					for(var i = ref.r1 + 1; i <= maxFilterRow; i++)
					{
						//max strings
						if(individualCount > maxIndividualValues)
							break;
						
						//not apply filter by current button
						if(currentElemArray === null && aWs.getRowHidden(i) === true)
						{
							individualCount++;
							continue;
						}
						
						//value in current column
						var cell = aWs.getCell3(i, colId + ref.c1);
						var text = cell.getValueWithFormat();
						var val = cell.getValueWithoutFormat();
						isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						
						//if(isDateTimeFormat)
							//dataValue = NumFormat.prototype.parseDate(val);
							
						//check duplicate value
						if(temp.hasOwnProperty(text))
							continue;
						
						//apply filter by current button
						if(currentElemArray !== null)
						{
							if(!this._hiddenAnotherFilter(filterColumns, colId, i, ref.c1))//filter another button
							{
								tempResult = new AutoFiltersOptionsElements();
								tempResult.val = val;
								tempResult.text = text;
								tempResult.isDateFormat = cell.getNumFormat().isDateTimeFormat();
								
								//filter current button
								var checkValue = isDateTimeFormat ? val : text;
								if(!filterColumns[currentElemArray].Top10 && !isCustomFilters && !filterColumns[currentElemArray].isHideValue(checkValue, isDateTimeFormat))
								{
									if(isOpenHiddenRows)
										aWs.setRowHidden(false, i, i);
									tempResult.visible = true;
								}
								else
								{
									if(isOpenHiddenRows)
										aWs.setRowHidden(false, i, i);
									tempResult.visible = false;
								}
									
								
								addValueToMenuObj(tempResult, count);
								
								temp[text] = 1;
								count++;
							}
						}
						else
						{
							tempResult = new AutoFiltersOptionsElements();
							tempResult.visible = true;
							tempResult.val = val;
							tempResult.text = text;
							tempResult.isDateFormat = cell.getNumFormat().isDateTimeFormat();
							
							if(isOpenHiddenRows)
								aWs.setRowHidden(false, i, i);
							
							addValueToMenuObj(tempResult, count);
							temp[text] = 1;
							count++;
						}
						
						individualCount++;
					}
				}

				return {values: this._sortArrayMinMax(values), automaticRowCount: automaticRowCount};
			},
			
			_getTrueColId: function(filter, colId)
			{
				//TODO - добавил условие, чтобы не было ошибки(bug 30007). возможно, второму пользователю нужно запретить все действия с измененной таблицей.
				if(filter === null)
					return null;
				
				var res = colId;
				if(filter.getType() !== g_nFiltersType.autoFilter)
					return res;
				
				//если находимся в мерженной ячейке, то возвращаем сдвинутый colId
				var aWs = this._getCurrentWS();
				var ref = filter.Ref;
				var cell = aWs.getCell3(ref.r1, colId + ref.c1);
				var hasMerged = cell.hasMerged();
				if(hasMerged)
				{
					res = hasMerged.c1 - ref.c1 >= 0 ? hasMerged.c1 - ref.c1 : res;
				}
				
				return res;
			},
			
			_sortArrayMinMax: function(elements)
			{
				elements.sort (function sortArr(a, b)
				{
					return a.val - b.val;
				});
				
				return elements;
			},
			
			_rangeToId: function(range)
			{
				var cell = new CellAddress(range.r1, range.c1, 0);
				return cell.getID();
			},
			
			_idToRange: function(id)
			{
				var cell = new CellAddress(id);
				return Asc.Range(cell.col - 1, cell.row - 1, cell.col - 1, cell.row - 1);
			},
			
			_reDrawFilters: function(exceptionRange)
			{
				var aWs = this._getCurrentWS();
				if(aWs.TableParts && aWs.TableParts.length > 0)
				{
					for(var tP = 0; tP < aWs.TableParts.length; tP++)
					{
						var ref = aWs.TableParts[tP].Ref;
						
						if(exceptionRange && !exceptionRange.isEqual(ref) && ((ref.r1 >= exceptionRange.r1 && ref.r1 <= exceptionRange.r2) || (ref.r2 >= exceptionRange.r1 && ref.r2 <= exceptionRange.r2)))
							this._setColorStyleTable(ref, aWs.TableParts[tP]);
						else if(!exceptionRange)
							this._setColorStyleTable(ref, aWs.TableParts[tP]);
					}
				}
			},
			
			_isFilterColumnsContainFilter: function(filterColumns)
			{
				if(!filterColumns || !filterColumns.length)
					return false;
				
				var filterColumn;
				for(var k = 0; k < filterColumns.length; k++)
				{
					filterColumn = filterColumns[k];
					if(filterColumn && (filterColumn.ColorFilter || filterColumn.ColorFilter || filterColumn.CustomFiltersObj || filterColumn.DynamicFilter || filterColumn.Filters || filterColumn.Top10))
						return true;
				}
			},
			
			_openHiddenRows: function(filter)
			{
				var aWs = this._getCurrentWS();
				var autoFilter = filter.getType() === g_nFiltersType.autoFilter ? filter : filter.AutoFilter;
				var isApplyFilter = autoFilter && autoFilter.FilterColumns && autoFilter.FilterColumns.length ? true : false;
				
				if(filter && filter.Ref && isApplyFilter)
				{
					aWs.setRowHidden(false, filter.Ref.r1, filter.Ref.r2);
				}
			},
			
			_openHiddenRowsAfterDeleteColumn: function(autoFilter, colId)
			{
				var ref = autoFilter.Ref;
				var filterColumns = autoFilter.FilterColumns;
				var aWs = this._getCurrentWS();
				
				colId = this._getTrueColId(autoFilter, colId);
				
				if(colId === null)
					return;
				
				for(var i = ref.r1 + 1; i <= ref.r2; i++)
				{
					if(aWs.getRowHidden(i) === false)
						continue;
						
					if(!this._hiddenAnotherFilter(filterColumns, colId, i, ref.c1))//filter another button
					{
						aWs.setRowHidden(false, i, i);
					}
				}
			},
			
			_openAllHiddenRowsByFilter: function(filter)
			{
				var autoFilter = filter && filter.getType() ===  g_nFiltersType.tablePart ? filter.AutoFilter : filter;
				if(autoFilter && autoFilter.FilterColumns)
				{
					var filterColumns = autoFilter.FilterColumns;
					for(var i = 0; i < filterColumns.length; i++)
					{
						this._openHiddenRowsAfterDeleteColumn(autoFilter, filterColumns[i].ColId);
					}
				}
			},
			
			//TODO CHANGE!!!
			_searchFilters: function(activeCells, isAll)
			{
				// ToDo по хорошему стоит порефакторить код. ws.model легко можно заменить на aWs (хотя aWs как мне кажется не совсем хорошее название)
				// Условие на вхождение диапазона заменить на containsRange. Возвращаемое значение привести к одному типу
				// После правки поправить функцию parserHelper.checkDataRange
				var aWs = this._getCurrentWS();
				var allF =[];
				
				if(aWs.AutoFilter)
				{
					allF[0] = aWs.AutoFilter
				}
				
				if(aWs.TableParts)
				{
					var s = 1;
					if(!allF[0])
						s = 0;
					for(var k = 0; k < aWs.TableParts.length; k++)
					{
						if(aWs.TableParts[k])
						{
							allF[s] = aWs.TableParts[k];
							s++;
						}
					}
				}
				
				var num = -1;
				var numAll = -1;
				if(typeof activeCells == 'string')
				{
					var newCell = aWs.getCell(new CellAddress(activeCells));
					if(newCell)
					{
						activeCells = 
						{
							c1: newCell.first.col -1,
							c2: newCell.first.col -1,
							r1: newCell.first.row -1,
							r2: newCell.first.row -1
						};
					}
					
				}
				for(var i = 0; i < allF.length; i++)
				{
					if(!allF[i].Ref || allF[i].Ref == "")
						continue;

					var range = allF[i].Ref;
					
					if(!allF[i].AutoFilter && !allF[i].TableStyleInfo)
					{
						numAll = 
						{
							num: i,
							range: range,
							all: true
						}
					}
					if(activeCells.c1 >= range.c1 && activeCells.c2 <= range.c2 && activeCells.r1 >= range.r1 && activeCells.r2 <= range.r2)
					{
						var curRange = range.clone();
						if(allF[i].TableStyleInfo)
						{
							if(!allF[i].AutoFilter)
							{
								num = 
								{
									num: i,
									range: range,
									all: false,
									containsFilter: false
								}
							}
							else
							{
								if(isAll)
								{
									num = 
									{
										num: i,
										range: range,
										all: false,
										containsFilter: true
									}
								}
								else
								{
									num = 
									{
										num: i,
										range: range,
										all: false,
										changeStyle: true
									}
								}
								
							}
						}
						else
						{
							if(allF[i].getType() ===  g_nFiltersType.autoFilter)
							{
								if(isAll === false && activeCells && range && !activeCells.containsRange(range) && !(range.containsRange(activeCells) && activeCells.c1 == activeCells.c2 && activeCells.r1 == activeCells.r2))//если задеваем часть примененного фильтра и добавляем форматированную таблицу
								{
									num = 'error';
								}
								else
								{
									num = 
									{
										num: i,
										range: range,
										all: true
									}
								}
							}
							else
							{
								num = 
								{
									num: i,
									range: range,
									all: false
								}
							}
						}
					}
					else if(num == -1)
					{
						if(this._crossRange(activeCells,range))
						{
							//если мы находимся в общем фильтре и нажали на кнопку общего фильтра - тогда нет ошибки
							if(!(allF[i].getType() ===  g_nFiltersType.autoFilter && allF[i].Ref.r1 === activeCells.r1))
							{
								if(!(aWs.AutoFilter && i == 0 && isAll == true)/* && allF[i].AutoFilter !== undefined*/)
									num = 'error';
							}
							
						}
					}
				}
				
				if(!isAll && num != -1 && curRange && activeCells.c1 >= curRange.c1 && activeCells.c2 <= curRange.c2 && activeCells.r1 >= curRange.r1 && activeCells.r2 <= curRange.r2 && num.all == true)
					num.changeAllFOnTable = true;
				
				if(isAll && num == -1 && numAll == -1)//значит в этом случае общий фильтр отключен
				{
					return false;
				}
				else if(isAll && num == -1)//в зоне общего фильтра
					return numAll;
				else if(num != -1)//внутри локального фильтра
					return num;
					
			},
			
			_isAddNameColumn: function(range)
			{
				//если в трёх первых строчках любых столбцов содержится текстовые данные
				var result = false;
				var aWs = this._getCurrentWS();
				if(range.r1 != range.r2)
				{
					for(var col = range.c1; col <= range.c2; col++)
					{	
						var valFirst = aWs.getCell3(range.r1,col);
						if(valFirst != '')
						{
							for(var row = range.r1; row <= range.r1 + 2; row++)
							{
								var cell = aWs.getCell3(row,col);
								var type = cell.getType();
								if(type == CellValueType.String)
								{
									result = true;
									break;
								}
							}
						}
					}
				}
				return result;
			},
			
			_generateColumnNameWithoutTitle: function(range)
			{
				var aWs = this._getCurrentWS();
				var newTableColumn;
				var tableColumns = [];
				var cell;
				var val;
				for(var col1 = range.c1; col1 <= range.c2; col1++)
				{
					cell = aWs.getCell3(range.r1, col1);
					val = cell.getValue();
					//если ячейка пустая, то генерируем название
					if(val == '')
						val = this._generateColumnName(tableColumns);
					//проверяем, не повторяется ли значение, которое лежит в данной ячейке
					var index = 2;
					var valNew = val;
					for(var s = 0; s < tableColumns.length; s++)
					{
						if(valNew == tableColumns[s].Name)
						{
							valNew = val + index;
							index++;
							s = -1;
						}
					}
					newTableColumn = new TableColumn();
					newTableColumn.Name = valNew;
					
					tableColumns[col1 - range.c1] = newTableColumn;
				}
				return tableColumns;
			},
			
			_generateColumnName: function(tableColumns,indexInsertColumn)
			{
				var index = 1;
				var isSequence = false;
				if(indexInsertColumn != undefined)
				{
					if(indexInsertColumn < 0)
						indexInsertColumn = 0;
					var nameStart;
					var nameEnd;
					if(tableColumns[indexInsertColumn] && tableColumns[indexInsertColumn].Name)
						nameStart = tableColumns[indexInsertColumn].Name.split("Column");
					if(tableColumns[indexInsertColumn + 1] && tableColumns[indexInsertColumn + 1].Name)
						nameEnd = tableColumns[indexInsertColumn + 1].Name.split("Column");
					if(nameStart && nameStart[1] && nameEnd && nameEnd[1] && !isNaN(parseInt(nameStart[1])) && !isNaN(parseInt(nameEnd[1])) && ((parseInt(nameStart[1]) + 1) == parseInt(nameEnd[1])))
						isSequence = true;
				}

				var name;
				if(indexInsertColumn == undefined || !isSequence)
				{
					for(var i = 0; i < tableColumns.length; i++)
					{
						if(tableColumns[i].Name)
							name = tableColumns[i].Name.split("Column");
						if(name && name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1]))
						{
							index++;
							i = -1;
						}
					}
					return "Column" + index;
				}
				else
				{
					if(tableColumns[indexInsertColumn] && tableColumns[indexInsertColumn].Name)
						name = tableColumns[indexInsertColumn].Name.split("Column");
					if(name && name[1] && !isNaN(parseFloat(name[1])))
						index = parseFloat(name[1]) + 1;
					
					for(var i = 0; i < tableColumns.length; i++)
					{
						if(tableColumns[i].Name)
							name = tableColumns[i].Name.split("Column");
						if(name && name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1]))
						{
							index = parseInt((index - 1) + "2"); 
							i = -1;
						}
					}
					return "Column" + index;
				}
			},
			
			_setColorStyleTable: function(range, options, isOpenFilter, isSetVal)
			{
				var aWs = this._getCurrentWS();
				var bRedoChanges = aWs.workbook.bRedoChanges;
				
				var bbox = range;
				//ограничим количество строчек/столбцов				
				if((bbox.r2 - bbox.r1) > maxValRow)
					bbox.r2 = bbox.r1 + maxValRow;
				if((bbox.c2 - bbox.c1) > maxValCol)
					bbox.c2 = bbox.c1 + maxValCol;
				
				var style = options.TableStyleInfo.clone();
				var styleForCurTable;
				//todo из файла
				var headerRowCount = 1;
				var totalsRowCount = 0;
				if(null != options.HeaderRowCount)
					headerRowCount = options.HeaderRowCount;
				if(null != options.TotalsRowCount)
					totalsRowCount = options.TotalsRowCount;
				if(style && style.Name && aWs.workbook.TableStyles && aWs.workbook.TableStyles.AllStyles && (styleForCurTable = aWs.workbook.TableStyles.AllStyles[style.Name]))
				{
					//заполняем названия столбцов
					if(true != isOpenFilter && headerRowCount > 0 && options.TableColumns)
					{
						for(var ncol = bbox.c1; ncol <= bbox.c2; ncol++)
						{
							var range = aWs.getCell3(bbox.r1, ncol);
							var num = ncol - bbox.c1;
							var tableColumn = options.TableColumns[num];
							if(null != tableColumn && null != tableColumn.Name && !bRedoChanges && isSetVal)
							{
								range.setValue(tableColumn.Name);
								range.setType(CellValueType.String);
							}
						}
					}
					//заполняем стили
					var aNoHiddenCol = [];
					for(var i = bbox.c1; i <= bbox.c2; i++)
					{
						if (!aWs.getColHidden(i))
							aNoHiddenCol.push(i);
					}
					aNoHiddenCol.sort(fSortAscending);
					//если скрыт первый или последний столбец, то их не надо сдвигать и показывать
					if(aNoHiddenCol.length > 0)
					{
						if(aNoHiddenCol[0] != bbox.c1)
							style.ShowFirstColumn = false;
						if(aNoHiddenCol[aNoHiddenCol.length - 1] != bbox.c2)
							style.ShowLastColumn = false;
					}
					var aNoHiddenRow = [];
					for(var i = bbox.r1; i <= bbox.r2; i++)
					{
						var row = aWs._getRowNoEmpty(i);
						if (!aWs.getRowHidden(i))
							aNoHiddenRow.push(i);
					}
					aNoHiddenRow.sort(fSortAscending);
					//если скрыты заголовок или итоги, то их не надо сдвигать и показывать
					if(aNoHiddenRow.length > 0)
					{
						if(aNoHiddenRow[0] != bbox.r1)
							headerRowCount = 0;
						if(aNoHiddenRow[aNoHiddenRow.length - 1] != bbox.r2)
							totalsRowCount = 0;
					}
					//изменяем bbox с учетом скрытых
					bbox = {r1: 0, c1: 0, r2: aNoHiddenRow.length - 1, c2: aNoHiddenCol.length - 1};
					for(var i = 0, length = aNoHiddenRow.length; i < length; i++)
					{
						var nRowIndexAbs = aNoHiddenRow[i];
						for(var j = 0, length2 = aNoHiddenCol.length; j < length2; j++)
						{
							var nColIndexAbs = aNoHiddenCol[j];
							var cell = aWs.getRange3(nRowIndexAbs, nColIndexAbs, nRowIndexAbs, nColIndexAbs);
							var dxf = styleForCurTable.getStyle(bbox, i, j, style, headerRowCount, totalsRowCount);
							if(null != dxf)
								cell.setTableStyle(dxf);
						}
					}
				}
			},
			
			_cleanStyleTable : function(sRef)
			{
				var aWs = this._getCurrentWS();
				var oRange = new Range(aWs, sRef.r1, sRef.c1, sRef.r2, sRef.c2);
				oRange.setTableStyle(null);
			},
					
			//TODO CHANGE!!!
			_reDrawCurrentFilter: function(fColumns, tableParts)
			{
				//TODO сделать открытие и закрытие строк
				//перерисовываем таблицу со стилем 
				if(tableParts)
				{
					var ref = tableParts.Ref;
					this._cleanStyleTable(ref);
					this._setColorStyleTable(ref, tableParts);
				}		
			},
			
			_checkExceptionArray: function(curRange, exceptionArray)
			{
				if(!curRange || !exceptionArray || (exceptionArray && !exceptionArray.length))
					return false;
					
				for(var e = 0; e < exceptionArray.length; e++)
				{
					if(exceptionArray[e] && exceptionArray[e].Ref && exceptionArray[e].Ref.isEqual(curRange))
						return true;
				}
				
				return false;
			},
			
			_preMoveAutoFilters: function(arnFrom, arnTo, copyRange)
			{
				var aWs = this._getCurrentWS();
				
				var diffCol = arnTo.c1 - arnFrom.c1;
				var diffRow = arnTo.r1 - arnFrom.r1;
				
				var applyStyleByCells = true;
				
				if(!copyRange)
				{
					var findFilters = this._searchFiltersInRange(arnFrom);
					if(findFilters)
					{
						for(var i = 0; i < findFilters.length; i++)
						{
							var ref = findFilters[i].Ref;
							var newRange = Asc.Range(ref.c1 + diffCol, ref.r1 + diffRow, ref.c2 + diffCol, ref.r2 + diffRow);
							
							//если затрагиваем форматированной таблицей часть а/ф
							if(aWs.AutoFilter && aWs.AutoFilter.Ref && newRange.intersection(aWs.AutoFilter.Ref) && aWs.AutoFilter !== findFilters[i])
							{
								this.deleteAutoFilter(aWs.AutoFilter.Ref);
							}
							
							//если область вставки содержит форматированную таблицу, которая пересекается с вставляемой форматированной таблицей
							var findFiltersFromTo = this._intersectionRangeWithTableParts(newRange , aWs, arnFrom);
							if(findFiltersFromTo && findFiltersFromTo.length)//удаляем данный фильтр
							{
								this.isEmptyAutoFilters(ref);
								continue;
							}
							
							this._openHiddenRows(findFilters[i]);
						}
						applyStyleByCells = false;
					}
					
					//TODO пока будем всегда чистить фильтры, которые будут в месте вставки. Позже сделать аналогично MS либо пересмотреть все возможные ситуации.
					var findFiltersTo = this._searchFiltersInRange(arnTo);
					if(arnTo && findFiltersTo)
					{
						for(var i = 0; i < findFiltersTo.length; i++)
						{
							var ref = findFiltersTo[i].Ref;
							
							//если переносим просто данные, причём шапки совпадают, то фильтр не очищаем
							if(!(arnTo.r1 === ref.r1 && arnTo.c1 === ref.c1) && !arnFrom.containsRange(ref))
								this.isEmptyAutoFilters(ref, null, findFilters);
						}
						applyStyleByCells = false;
					}
				}
				
				if(applyStyleByCells)
				{
					var intersectionRangeWithTablePartsFrom = this._intersectionRangeWithTableParts(arnFrom, aWs);
					var intersectionRangeWithTablePartsTo = this._intersectionRangeWithTableParts(arnTo, aWs);
					if(intersectionRangeWithTablePartsFrom && intersectionRangeWithTablePartsFrom.length === 1 && intersectionRangeWithTablePartsTo === false)
					{
						//проходимся по всем ячейкам
						var cell;
						for(var i = arnFrom.r1; i <= arnFrom.r2; i++)
						{
							for(var j = arnFrom.c1; j <= arnFrom.c2; j++)
							{
								cell = aWs._getCell(i, j);
								cell.setStyle(cell.compiledXfs);
							}
						}
					}
				}
			},
			
			_searchHiddenRowsByFilter: function(filter, range)
			{
				var ref = filter.Ref;
				var aWs = this._getCurrentWS();
				var intersection = filter.Ref.intersection(range);
				
				if(intersection && filter.isApplyAutoFilter())
				{
					for(var i = intersection.r1; i <= intersection.r2; i++)
					{
						if(aWs.getRowHidden(i) === true)
						{
							return true;
						}
					}
				}
				
				return false;
			},
			
			_searchFiltersInRange: function(range, bFindOnlyTableParts)//find filters in this range
			{
				var result = [];
				var aWs = this._getCurrentWS();
				range = Asc.Range(range.c1, range.r1, range.c2, range.r2);
				
				if(aWs.AutoFilter && !bFindOnlyTableParts)
				{
					if(range.containsRange(aWs.AutoFilter.Ref))
						result[result.length] = aWs.AutoFilter;
				}
				
				if(aWs.TableParts)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						if(aWs.TableParts[i])
						{
							if(range.containsRange(aWs.TableParts[i].Ref))
								result[result.length] = aWs.TableParts[i];
						}
					}
				}
				
				if(!result.length)
					result = false;
				
				return result;
			},
			
			//TODO пересмотреть!
			_crossRange: function(sRange, bRange)
			{
				var isIn = false;
				var isOut = false;
				for(var c = sRange.c1; c <= sRange.c2; c++)
				{
					for(var r = sRange.r1; r <= sRange.r2; r++)
					{
						if(r >= bRange.r1 && r <= bRange.r2 && c >= bRange.c1 && c <= bRange.c2)//определяем, что хотя бы одна ячейка внутри находится
							isIn = true;
						else //определяем, что хотя бы одна ячейка снаружи
							isOut = true;
					}
				}

				return isIn && isOut;
			},
			
			_intersectionRangeWithTableParts: function(range, aWs, exceptionRange)//находим фильтры, находящиеся в данном range
			{
				var result = [];
				var rangeFilter;
				
				if(aWs.TableParts)
				{
					for(var k = 0; k < aWs.TableParts.length; k++)
					{
						if(aWs.TableParts[k])
						{
							rangeFilter = aWs.TableParts[k].Ref;
							//TODO пересмотреть условие range.r1 === rangeFilter.r1 && range.c1 === rangeFilter.c1
							if(range.intersection(rangeFilter) && !(range.containsRange(rangeFilter) && !(range.r1 === rangeFilter.r1 && range.c1 === rangeFilter.c1)))
							{
								if(!exceptionRange || !(exceptionRange && exceptionRange.containsRange(rangeFilter)))
									result[result.length] = aWs.TableParts[k];
							}
						}
					}
				}
				if(!result.length)
					result = false;

				return result;
			},
			
			_cloneCtrlAutoFilters: function(arnTo, arnFrom, offLock)
			{
				var aWs = this._getCurrentWS();
				var findFilters = this._searchFiltersInRange(arnFrom);
				var bUndoRedoChanges = aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges;
				
				if(findFilters && findFilters.length)
				{
					var diffCol = arnTo.c1 - arnFrom.c1;
					var diffRow = arnTo.r1 - arnFrom.r1;
					var newRange, ref, bWithoutFilter;
					
					for(var i = 0; i < findFilters.length; i++)
					{
						if(findFilters[i].TableStyleInfo)
						{
							ref = findFilters[i].Ref;
							newRange = Asc.Range(ref.c1 + diffCol, ref.r1 + diffRow, ref.c2 + diffCol, ref.r2 + diffRow);
							bWithoutFilter = findFilters[i].AutoFilter === null;
							
							if(!ref.intersection(newRange) && !this._intersectionRangeWithTableParts(newRange, aWs, arnFrom))
							{
								//TODO позже не копировать стиль при перемещении всей таблицы
								if(!bUndoRedoChanges)
								{
									var cleanRange = new Range(aWs, newRange.r1, newRange.c1, newRange.r2, newRange.c2);
									cleanRange.cleanFormat();
								}
								this.addAutoFilter(findFilters[i].TableStyleInfo.Name, newRange, null, offLock);
							}	
						}
					}
				}
			},
			
			//с учётом последних скрытых строк
			_activeRangeContainsTablePart: function(activeRange, tablePartRef)
			{
				var aWs = this._getCurrentWS();
				var res = false;
				
				if(activeRange.r1 === tablePartRef.r1 && activeRange.c1 === tablePartRef.c1 && activeRange.c2 === tablePartRef.c2 && activeRange.r2 < tablePartRef.r2)
				{
					res = true;
					for(var i = activeRange.r2 + 1; i <= tablePartRef.r2; i++)
					{
						if(!aWs.getRowHidden(i))
						{
							res = false;
							break;
						}
					}
				}
				
				return res;
			},
			
			changeSelectionTablePart: function(activeRange)
			{
				if(activeRange.isOneCell())
					this._changeSelectionFromCellToColumn(activeRange);
				else
					this._changeSelectionToAllTablePart(activeRange);
			}, 
			
			_changeSelectionToAllTablePart: function(activeRange)
			{
				var aWs = this._getCurrentWS();
				var ws = this.worksheet;
				
				var tableParts = aWs.TableParts;
				var tablePart;
				for(var i = 0; i < tableParts.length; i++)
				{
					tablePart = tableParts[i];
					if(tablePart.Ref.intersection(activeRange))
					{
						if(this._activeRangeContainsTablePart(activeRange, tablePart.Ref))
						{
							var newActiveRange = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2, tablePart.Ref.r2);
							ws.setSelection(newActiveRange);
						}
							
						break;
					}
				}
			},
			
			_changeSelectionFromCellToColumn: function(activeRange)
			{
				var aWs = this._getCurrentWS();
				var ws = this.worksheet
				var tableParts = aWs.TableParts; 
				
				if(tableParts && tableParts.length && activeRange.isOneCell())
				{
					for(var i = 0; i < tableParts.length; i++ )
					{
						if(tableParts[i].Ref.containsFirstLineRange(activeRange))
						{
							var newActiveRange = new Asc.Range(activeRange.c1, activeRange.r1, activeRange.c1, tableParts[i].Ref.r2);
							if(!activeRange.isEqual(newActiveRange))
								ws.setSelection(newActiveRange);
							break;
						}
					}
				}
			},
			
			_isIntersectionTableParts: function(range)
			{
				var aWs = this._getCurrentWS();
				
				var tableParts = aWs.TableParts;
				var tablePart;
				for(var i = 0; i < tableParts.length; i++)
				{
					tablePart = tableParts[i];
					if(tablePart.Ref.intersection(range))
						return true;
				}
				return false;
			},
			
			_cleanFilterColumnsAndSortState: function(autoFilterElement, activeCells)
			{
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				var oldFilter = autoFilterElement.clone(null);
				
				if(autoFilterElement.SortState)
					autoFilterElement.SortState = null;
				
				aWs.setRowHidden(false, autoFilterElement.Ref.r1, autoFilterElement.Ref.r2);
				
				if(autoFilterElement.AutoFilter && autoFilterElement.AutoFilter.FilterColumns)
				{
					autoFilterElement.AutoFilter.FilterColumns = null;
				}
				else if(autoFilterElement.FilterColumns)
				{
					autoFilterElement.FilterColumns = null;
				}
				
				this._addHistoryObj(oldFilter, historyitem_AutoFilter_CleanAutoFilter, {activeCells: activeCells}, null, activeCells);

				this._reDrawFilters();
				
				if(!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges)
					ws._onUpdateFormatTable(oldFilter.Ref, false, true);
			},
			
			_checkValueInCells: function(n, k, cloneActiveRange)
			{
				var aWs = this._getCurrentWS();
				var cell = aWs.getRange3(n, k, n, k);
				var isEmptyCell = cell.isEmptyText();
				var isEnd = true, merged, valueMerg;
				
				//если мерженная ячейка
				if(isEmptyCell)
				{
					merged = cell.hasMerged();
					valueMerg = null;
					if(merged)
					{
						valueMerg = aWs.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
						if(valueMerg != null && valueMerg != "")
						{	
							if(merged.r1 < cloneActiveRange.r1)
							{
								cloneActiveRange.r1 = merged.r1;
								n = cloneActiveRange.r1 - 1; isEnd = false
							}	
							if(merged.r2 > cloneActiveRange.r2)
							{
								cloneActiveRange.r2 = merged.r2;
								n = cloneActiveRange.r2 - 1; isEnd = false
							}
							if(merged.c1 < cloneActiveRange.c1)
							{
								cloneActiveRange.c1 = merged.c1;
								k = cloneActiveRange.c1 - 1; isEnd = false
							}	
							if(merged.c2 > cloneActiveRange.c2)
							{
								cloneActiveRange.c2 = merged.c2;
								k = cloneActiveRange.c2 - 1; isEnd = false
							}
							if(n < 0)
								n = 0;
							if(k < 0)
								k = 0;
						}
					}
				}
				
				if(!isEmptyCell || (valueMerg != null && valueMerg != ""))
				{
					if(k < cloneActiveRange.c1)
					{
						cloneActiveRange.c1 = k; isEnd = false;
					}
					else if(k > cloneActiveRange.c2)
					{
						cloneActiveRange.c2 = k; isEnd = false;
					}
					if(n < cloneActiveRange.r1)
					{
						cloneActiveRange.r1 = n; isEnd = false;
					}
					else if(n > cloneActiveRange.r2)
					{
						cloneActiveRange.r2 = n; isEnd = false;
					}
				}
				
				return {isEmptyCell: isEmptyCell, isEnd: isEnd, cloneActiveRange: cloneActiveRange};
			},
			
			_getFilterColumn: function(autoFilter, colId)
			{
				var filters;
				if(autoFilter && autoFilter.FilterColumns)
				{
					filters = autoFilter.FilterColumns;
					for(var k= 0; k < filters.length; k++)
					{
						if(filters[k].ColId == colId)
						{
							filters = filters[k];
							break;
						}
					}
				}
				return filters;
			},
			
			_getFilterColumnNum: function(filterColumns, colId)
			{
				var currentElemArray = null;
				if(filterColumns && filterColumns.length)
				{
					for(var i = 0; i < filterColumns.length; i++)
					{
						if(colId === filterColumns[i].ColId)
						{
							currentElemArray = i;
							break;
						}
					}
				}
				return currentElemArray;
			},
			
			_isEmptyCellsUnderRange: function(range)
			{
				//если есть ячейки с непустыми значениями под активной областью, то возвращаем false
				var cell, isEmptyCell, result = true;
				var ws = this.worksheet;
				var aWs = this._getCurrentWS();
				
				for(var i = range.c1; i <= range.c2; i++)
				{
					cell = ws.model.getRange3(range.r2 + 1, i, range.r2 + 1, i);
					isEmptyCell = cell.isEmptyText();
					if(!isEmptyCell)
					{
						result = false;
						break;
					}
				}
				
				return result;
			},
			
			_isPartTablePartsUnderRange: function(range)
			{
				var aWs = this._getCurrentWS();
				var result = false;
				
				if(aWs.TableParts && aWs.TableParts.length)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						var tableRef = aWs.TableParts[i].Ref;
						if(tableRef.r1 >= range.r2)
						{
							if(range.c1 < tableRef.c1 && range.c2 < tableRef.c2 && range.c2 >= tableRef.c1)
							{
								result = true;
								break;
							}
							else if(range.c1 > tableRef.c1 && range.c2 > tableRef.c2 && range.c1 >= tableRef.c1)
							{
								result = true;
								break;
							}
							else if((range.c1 > tableRef.c1 && range.c2 <= tableRef.c2) || (range.c1 >= tableRef.c1 && range.c2 < tableRef.c2))
							{
								result = true;
								break;
							}
						}
					}
				}
				
				return result;
			},
			
			_isPartAutoFilterUnderRange: function(range)
			{
				var aWs = this._getCurrentWS();
				var result = false;
				
				if(aWs.AutoFilter)
				{
					if((aWs.AutoFilter.Ref.c1 < range.c1 || aWs.AutoFilter.Ref.c2 > range.c2) && aWs.AutoFilter.Ref.r1 >= range.r2)
					{
						result = true;
					}
				}
				
				return result;
			},
			
			_isEmptyRange: function(activeCells)
			{
				var aWs = this._getCurrentWS();
				var cell;
				for(var n = activeCells.r1 - 1; n <= activeCells.r2 + 1; n++)
				{
					if(n < 0)
						n = 0;
					
					for(var k = activeCells.c1 - 1; k <= activeCells.c2 + 1; k++)
					{
						if(k < 0)
							k = 0;
						cell = aWs.getCell3(n, k, n, k);
						
						if(cell.getValueWithoutFormat() != '')
							return false;
					}
				}
				return true;
			},
			
			_setStyleTables: function(range)
			{
				var aWs = this._getCurrentWS();
				if(aWs.TableParts && aWs.TableParts.length > 0)
				{
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						var ref = aWs.TableParts[i].Ref;
						if(ref.r1 >= range.r1 && ref.r2 <= range.r2)
							this._setColorStyleTable(ref, aWs.TableParts[i]);
					}
				}
			},
			
			isCellContainsAutoFilterButton: function(col, row)
			{
				var aWs = this._getCurrentWS();
				if(aWs.TableParts)
				{
					var tablePart;
					for(var i = 0; i < aWs.TableParts.length; i++)
					{
						tablePart = aWs.TableParts[i];
						//TODO добавить проверку на isHidden у кнопки
						if(tablePart.Ref.contains(col, row) && tablePart.Ref.r1 === row)
							return true;
					}
				}
				
				//TODO добавить проверку на isHidden у кнопки
				if(aWs.AutoFilter && aWs.AutoFilter.Ref.contains(col, row) && aWs.AutoFilter.Ref.r1 === row)
					return true;
				
				return false;
			},
			
			_isShowButtonInFilter: function(col, filter)
			{
				var result = true;
				var typeFilter = filter ? filter.getType() : null;
				var autoFilter = typeFilter !== null && typeFilter === g_nFiltersType.autoFilter ? filter : filter.AutoFilter;
				
				if(autoFilter && autoFilter.FilterColumns)//проверяем скрытые ячейки
				{
					var colId = col - autoFilter.Ref.c1;
					for(var i = 0; i < autoFilter.FilterColumns.length; i++)
					{
						if(autoFilter.FilterColumns[i].ColId === colId)
						{
							if(autoFilter.FilterColumns[i].ShowButton === false)
								result = false;
								
							break;
						}
					}
				}
				else if(typeFilter !== g_nFiltersType.autoFilter && autoFilter === null)//если форматированная таблица и отсутсвует а/ф
					result = false;
				
				return result;
			},
			
			_generateColumnName2: function(tableColumns, prevColumnName)
			{
				var columnName = "Column";
				var name = prevColumnName.split(columnName);
				var indexColumn = name[1];
				var nextIndex;
				
				//ищем среди tableColumns, возможно такое имя уже имеется
				var checkNextName = function()
				{
					var nextName = columnName + nextIndex;
					for(var i = 0; i < tableColumns.length; i++)
					{
						if(tableColumns[i].Name === nextName)
							return false;
					}
					return true;
				};
				
				//если сменилась первая цифра
				var checkChangeIndex = function()
				{
					if((nextIndex + 1).toString().substr(0, 1) !== (indexColumn).toString().substr(0, 1))
						return true;
					else 
						return false;
				};
				
				if(indexColumn && !isNaN(indexColumn))//если нашли числовой индекс
				{
					indexColumn = parseFloat(indexColumn);
					nextIndex = indexColumn + 1;
					var string = "";
					
					var firstInput = true;
					while(checkNextName() === false)
					{
						if(firstInput === true)
						{
							string += "1";
							nextIndex = parseFloat(indexColumn + "2");
						}
						else
						{
							if(checkChangeIndex())
							{
								string += "0";
								nextIndex = parseFloat(indexColumn + string);
							}
							else
								nextIndex++;
						}
						
						firstInput = false;
					}
					
				}
				else//если не нашли, то индекс начинаем с 1
				{
					var nextIndex = 1;
					while(checkNextName() === false)
					{
						nextIndex++;
					}
				}
				
				var res = columnName + nextIndex;
				return res;
			}			
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].AutoFilters				= AutoFilters;

		window["Asc"]["AutoFiltersOptions"]		= window["Asc"].AutoFiltersOptions = AutoFiltersOptions;
		prot									= AutoFiltersOptions.prototype;

		prot["asc_setSortState"]				= prot.asc_setSortState;
		prot["asc_getSortState"]				= prot.asc_getSortState;
		prot["asc_getValues"]					= prot.asc_getValues;
		prot["asc_getFilterObj"]				= prot.asc_getFilterObj;
		prot["asc_getCellId"]					= prot.asc_getCellId;
		prot["asc_getDisplayName"]				= prot.asc_getDisplayName;
		
		window["Asc"]["AutoFilterObj"]		    = window["Asc"].AutoFilterObj = AutoFilterObj;
		prot									= AutoFilterObj.prototype;
		prot["asc_getType"]						= prot.asc_getType;
		prot["asc_setFilter"]					= prot.asc_setFilter;
		prot["asc_setType"]						= prot.asc_setType;
		prot["asc_getFilter"]					= prot.asc_getFilter;
		
		window["Asc"]["AutoFiltersOptionsElements"]	= window["Asc"].AutoFiltersOptionsElements = AutoFiltersOptionsElements;
		prot									= AutoFiltersOptionsElements.prototype;
		prot["asc_getText"]						= prot.asc_getText;
		prot["asc_getVisible"]					= prot.asc_getVisible;
		prot["asc_setVisible"]					= prot.asc_setVisible;
		
		window["Asc"]["AddFormatTableOptions"]	= window["Asc"].AddFormatTableOptions = AddFormatTableOptions;
		prot									= AddFormatTableOptions.prototype;
		prot["asc_getRange"]					= prot.asc_getRange;
		prot["asc_getIsTitle"]					= prot.asc_getIsTitle;
		prot["asc_setRange"]					= prot.asc_setRange;
		prot["asc_setIsTitle"]					= prot.asc_setIsTitle;

		window["Asc"]["formatTablePictures"]	= window["Asc"].formatTablePictures = formatTablePictures;
		prot									= formatTablePictures.prototype;
		prot["asc_getName"]					   	= prot.asc_getName;
		prot["asc_getDisplayName"]				= prot.asc_getDisplayName;
		prot["asc_getType"]						= prot.asc_getType;
		prot["asc_getImage"]					= prot.asc_getImage;
	}
)(jQuery, window);
