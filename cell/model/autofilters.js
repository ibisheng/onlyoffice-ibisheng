/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var CellValueType = AscCommon.CellValueType;
		var CellAddress = AscCommon.CellAddress;
		var History = AscCommon.History;
		
		var UndoRedoDataTypes = AscCommonExcel.UndoRedoDataTypes;

		var c_oAscError = Asc.c_oAscError;
		var c_oAscInsertOptions = Asc.c_oAscInsertOptions;
		var c_oAscDeleteOptions = Asc.c_oAscDeleteOptions;
		var c_oAscChangeTableStyleInfo = Asc.c_oAscChangeTableStyleInfo;

		var prot;

		var maxIndividualValues = 10000;
		var maxValCol = 20000;
		var maxValRow = 100000;

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
			displayName: 4,
            isTextFilter: 5
		};
		function AutoFiltersOptions () {

			if ( !(this instanceof AutoFiltersOptions) ) {return new AutoFiltersOptions();}

			this.Properties = g_oAutoFiltersOptionsProperties;

			this.cellId  = null;
            this.cellCoord  = null;
			this.values  = null;
			this.filter  = null;
			this.sortVal = null;
			this.automaticRowCount = null;
			this.displayName  = null;
            this.isTextFilter = null;
            this.colorsFill = null;
            this.colorsFont = null;
            this.sortColor = null;
			
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
                    case this.Properties.isTextFilter: return this.isTextFilter; break;
                    case this.Properties.colorsFill: return this.colorsFill; break;
                    case this.Properties.colorsFont: return this.colorsFont; break;
                    case this.Properties.sortColor: return this.sortColor; break;
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
                    case this.Properties.isTextFilter: this.IsTextFilter = value;break;
                    case this.Properties.colorsFill: this.colorsFill = value;break;
                    case this.Properties.colorsFont: this.colorsFont = value;break;
                    case this.Properties.sortColor: this.sortColor = value;break;
				}
			},
			
			asc_setCellId : function(cellId) { this.cellId = cellId;},
            asc_setCellCoord : function(val) { this.cellCoord = val; },
			asc_setValues : function(values) { this.values = values; },
			asc_setFilterObj : function(filter) { this.filter = filter; },
			
			asc_setSortState : function(sortVal) { this.sortVal = sortVal; },
			asc_setAutomaticRowCount : function(val) { this.automaticRowCount = val; },
			
			asc_setDiplayName : function(val) { this.displayName = val; },
            asc_setIsTextFilter : function(val) { this.isTextFilter = val; },
            asc_setColorsFill : function(val) { this.colorsFill = val; },
            asc_setColorsFont : function(val) { this.colorsFont = val; },
            asc_setSortColor : function(val) { this.sortColor = val; },
			
			asc_getCellId : function() { return this.cellId; },
            asc_getCellCoord : function() { return this.cellCoord; },
			asc_getValues : function() { return this.values; },
			asc_getFilterObj : function() { return this.filter; },
			
			asc_getSortState : function() { return this.sortVal; },
			asc_getDisplayName : function() { return this.displayName; },
            asc_getIsTextFilter : function() { return this.isTextFilter; },
            asc_getColorsFill : function() { return this.colorsFill; },
            asc_getColorsFont : function() { return this.colorsFont; },
            asc_getSortColor : function() { return this.sortColor; }
		};
		
		var g_oAdvancedTableInfoSettings = {
			title		: 0,
			description: 1
		};
		
		function AdvancedTableInfoSettings () {

			if ( !(this instanceof AdvancedTableInfoSettings) ) {return new AdvancedTableInfoSettings();}

			this.Properties = g_oAdvancedTableInfoSettings;

			this.title  = undefined;
			this.description  = undefined;
			
			return this;
		}
		AdvancedTableInfoSettings.prototype = {
			constructor: AdvancedTableInfoSettings,

			getType : function () {
				return UndoRedoDataTypes.AdvancedTableInfoSettings;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.title: return this.title; break;
					case this.Properties.description: return this.description; break;
				}

				return null;
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.title: this.title = value;break;
					case this.Properties.description: this.description = value;break;
				}
			},
			
			asc_setTitle : function(val) { this.title = val;},
			asc_setDescription : function(val) { this.description = val; },

			asc_getTitle : function() { return this.title; },
			asc_getDescription : function() { return this.description; }
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

			this.m_oColor = new AscCommon.CColor(120, 120, 120);
			return this;
		}

		AutoFilters.prototype = {

			constructor: AutoFilters,
			
			addAutoFilter: function(styleName, activeRange, addFormatTableOptionsObj, offLock, props)
			{
				var worksheet = this.worksheet, t = this, cloneFilter;
				var isTurnOffHistory = worksheet.workbook.bUndoChanges || worksheet.workbook.bRedoChanges;
				
				
				var filterInfo = this._getFilterInfoByAddTableProps(activeRange, addFormatTableOptionsObj);
				var addNameColumn = filterInfo.addNameColumn;
				var filterRange = filterInfo.filterRange;
				var rangeWithoutDiff = filterInfo.rangeWithoutDiff;
				var tablePartsContainsRange = filterInfo.tablePartsContainsRange;
				
				//props from paste
				var bWithoutFilter, displayName, tablePart, offset;
				if(props)
				{
					bWithoutFilter = props.bWithoutFilter;
					displayName = props.displayName;
					tablePart = props.tablePart;
					offset = props.offset;
				}
				
				//*****callBack on add filter
				var addFilterCallBack = function()
				{
					//TODO воможно стоит добавлять точку в историю в верхних функциях
					History.Create_NewPoint();
					History.StartTransaction();

					if(tablePartsContainsRange)
					{
						cloneFilter = tablePartsContainsRange.clone(null);
						tablePartsContainsRange.AutoFilter = new AscCommonExcel.AutoFilter();
						tablePartsContainsRange.AutoFilter.Ref = tablePartsContainsRange.Ref.clone();

						//history
						t._addHistoryObj(cloneFilter, AscCH.historyitem_AutoFilter_Add,
							{activeCells: activeRange, styleName: styleName}, null, cloneFilter.Ref);
					}
					else
					{
						if(addNameColumn && filterRange.r2 >= AscCommon.gc_nMaxRow)
							filterRange.r2 = AscCommon.gc_nMaxRow - 1;

						if(styleName)
							worksheet.getRange3(filterRange.r1, filterRange.c1, filterRange.r2, filterRange.c2).unmerge();

						if(addNameColumn && !isTurnOffHistory)
						{
							if(t._isEmptyCellsUnderRange(rangeWithoutDiff))
								worksheet._moveRange(rangeWithoutDiff,  new Asc.Range(filterRange.c1, filterRange.r1 + 1, filterRange.c2, filterRange.r2));
							else
							{
								//shift down not empty range and move
								worksheet.getRange3(filterRange.r2, filterRange.c1, filterRange.r2, filterRange.c2).addCellsShiftBottom();
								worksheet._moveRange(rangeWithoutDiff,  new Asc.Range(filterRange.c1, filterRange.r1 + 1, filterRange.c2, filterRange.r2));
							}
						}
						else if(!addNameColumn)
						{
							if(filterRange.r1 === filterRange.r2)
							{
								if(t._isEmptyCellsUnderRange(rangeWithoutDiff))
								{
									filterRange.r2++;
								}
								else
								{
									filterRange.r2++;
									//shift down not empty range and move
									if(!isTurnOffHistory)
									{
										worksheet.getRange3(filterRange.r2, filterRange.c1, filterRange.r2, filterRange.c2).addCellsShiftBottom();
									}
								}
							}
						}
						

						//add to model
						var newTablePart = t._addNewFilter(filterRange, styleName, bWithoutFilter, displayName, tablePart, offset);
						var newDisplayName = newTablePart && newTablePart.DisplayName ? newTablePart.DisplayName : null;

						//history
						t._addHistoryObj({Ref: filterRange}, AscCH.historyitem_AutoFilter_Add,
							{activeCells: filterRange, styleName: styleName, addFormatTableOptionsObj: addFormatTableOptionsObj, displayName: newDisplayName, tablePart: tablePart}, null, filterRange, bWithoutFilter);
						History.SetSelectionRedo(filterRange);
						
						if(styleName)
						{
							t._setColorStyleTable(worksheet.TableParts[worksheet.TableParts.length - 1].Ref, worksheet.TableParts[worksheet.TableParts.length - 1], null, true);
						}	
					}

					History.EndTransaction();
				};

                addFilterCallBack();
			},
			
			deleteAutoFilter: function(activeRange, offLock)
			{
				var worksheet = this.worksheet, filterRange, t = this, cloneFilter;
				activeRange = activeRange.clone();
				
				//expand range
				var tablePartsContainsRange = this._isTablePartsContainsRange(activeRange);
				if(tablePartsContainsRange && tablePartsContainsRange.Ref)
					filterRange = tablePartsContainsRange.Ref.clone();
				else if(worksheet.AutoFilter)
					filterRange = worksheet.AutoFilter.Ref;

				if(!filterRange)
					return;
					
				//*****callBack on delete filter
				var deleteFilterCallBack = function()
				{	
					if(!tablePartsContainsRange && !worksheet.AutoFilter)
						return;
					
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
						cloneFilter = worksheet.AutoFilter.clone();
						
						worksheet.AutoFilter = null;
						t._openHiddenRows(cloneFilter);
					}
					
					//history
					t._addHistoryObj(cloneFilter, AscCH.historyitem_AutoFilter_Delete,
						{activeCells: activeRange}, null, cloneFilter.Ref);

					t._setStyleTablePartsAfterOpenRows(filterRange);
					
					History.EndTransaction();
				};

				deleteFilterCallBack(true);
			},
			
			changeTableStyleInfo: function(styleName, activeRange, tableName)
			{
				var filterRange, t = this, cloneFilter;
				
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

                    if(!isTablePartsContainsRange.TableStyleInfo)
                        isTablePartsContainsRange.TableStyleInfo = new AscCommonExcel.TableStyleInfo();
					isTablePartsContainsRange.TableStyleInfo.Name = styleName;

					t._setColorStyleTable(isTablePartsContainsRange.Ref, isTablePartsContainsRange);
					
					//history
					t._addHistoryObj(cloneFilter, AscCH.historyitem_AutoFilter_ChangeTableStyle,
						{activeCells: activeRange, styleName: styleName}, null, filterRange);
					
					History.EndTransaction();
				};
				
				addFilterCallBack(true);
			},
			
			changeAutoFilterToTablePart: function(styleName, ar, addFormatTableOptionsObj)
			{
				var t = this;

				var addFilterCallBack = function()
				{
					History.Create_NewPoint();
					History.StartTransaction();
					
					t.deleteAutoFilter(ar, true);
					t.addAutoFilter(styleName, ar, addFormatTableOptionsObj, true);
					
					History.EndTransaction();
				};
				
				addFilterCallBack();
			},
			
			applyAutoFilter: function (autoFiltersObject, ar) 
			{
				var worksheet = this.worksheet;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				
				var minChangeRow = null;
                var rangeOldFilter = null;
				
				//**get filter**
				var filterObj = this._getPressedFilter(ar, autoFiltersObject.cellId)
				var currentFilter = filterObj.filter;
				
				if(filterObj.filter === null)
					return;
				
				//if apply a/f from context menu
				if(autoFiltersObject && null === autoFiltersObject.automaticRowCount && currentFilter.isAutoFilter() && currentFilter.isApplyAutoFilter() === false)
				{
					var automaticRange = this._getAdjacentCellsAF(currentFilter.Ref, true);
					var automaticRowCount = automaticRange.r2;
					
					var maxFilterRow = currentFilter.Ref.r2;
					if(automaticRowCount > currentFilter.Ref.r2)
						maxFilterRow = automaticRowCount;
					
					autoFiltersObject.automaticRowCount = maxFilterRow;
				}
				
				//for history				
				var oldFilter = filterObj.filter.clone(null);
				History.Create_NewPoint();
				History.StartTransaction();

                rangeOldFilter = oldFilter.Ref;

				//change model
				var autoFilter = filterObj.filter;
				if(filterObj.filter.TableStyleInfo !== undefined)
					autoFilter = filterObj.filter.AutoFilter;	
				if(!autoFilter)
				{
					autoFilter = new AscCommonExcel.AutoFilter();
					autoFilter.Ref = currentFilter.Ref.clone();
					
					filterObj.filter.AutoFilter = autoFilter;
				}
				
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
				newFilterColumn.init(worksheet.getRange3(autoFilter.Ref.r1 + 1, filterObj.ColId + autoFilter.Ref.c1, autoFilter.Ref.r2, filterObj.ColId + autoFilter.Ref.c1));
				//for add to history
				if(newFilterColumn.Top10 && newFilterColumn.Top10.FilterVal && autoFiltersObject.filter && autoFiltersObject.filter.filter)
				{
					autoFiltersObject.filter.filter.FilterVal = newFilterColumn.Top10.FilterVal;
				}
				
				if(allFilterOpenElements && autoFilter.FilterColumns[filterObj.index])
				{
					if(autoFilter.FilterColumns[filterObj.index].ShowButton !== false)
						autoFilter.FilterColumns.splice(filterObj.index, 1);//if all rows opened
					else
						autoFilter.FilterColumns[filterObj.index].clean();
				}
					
				
				//автоматическое расширение диапазона а/ф
				if(autoFiltersObject.automaticRowCount && filterObj.filter && filterObj.filter.Ref && filterObj.filter.isAutoFilter())
				{
					var currentDiff = filterObj.filter.Ref.r2 - filterObj.filter.Ref.r1;
					var newDiff = autoFiltersObject.automaticRowCount - filterObj.filter.Ref.r1;
					
					if(newDiff > currentDiff)
						filterObj.filter.changeRef(null, newDiff - currentDiff);
				}
				
				
				//****open/close rows****
				var nOpenRowsCount = null;
				var nAllRowsCount = null;
				if(!bUndoChanges && !bRedoChanges)
				{
					var startRow = autoFilter && autoFilter.Ref ? autoFilter.Ref.r1 + 1 : currentFilter.Ref.r1 + 1;
					var endRow = autoFilter && autoFilter.Ref ? autoFilter.Ref.r2 : currentFilter.Ref.r2;
					if(currentFilter && !currentFilter.isAutoFilter() && currentFilter.TotalsRowCount)
					{
						endRow--;
					}
					
					var hiddenObj = {start: currentFilter.Ref.r1 + 1, h: null};
					var nHiddenRowCount = 0;
					var nRowsCount = 0;
					for(var i = startRow; i <= endRow; i++)
					{	
						var isHidden = false;
						if(autoFilter.FilterColumns && autoFilter.FilterColumns.length)
							isHidden = this._hiddenAnotherFilter(autoFilter.FilterColumns, filterObj.ColId, i, autoFilter.Ref.c1);
						
						if(!isHidden)
						{	
							var cell = worksheet.getCell3(i, filterObj.ColId + autoFilter.Ref.c1);
							var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
							var isNumberFilter = false;
							if(newFilterColumn.CustomFiltersObj || newFilterColumn.Top10 || newFilterColumn.DynamicFilter)
							{
								isNumberFilter = true;
							}
							
							var currentValue = (isDateTimeFormat || isNumberFilter) ? cell.getValueWithoutFormat() : cell.getValueWithFormat();
							
							var isSetHidden = newFilterColumn.isHideValue(currentValue, isDateTimeFormat, null, cell);
							
							if(isSetHidden !== worksheet.getRowHidden(i) && minChangeRow === null)
								minChangeRow = i;
							
							//скрываем строки
							if(hiddenObj.h === null)
							{
								hiddenObj.h = isSetHidden;
								hiddenObj.start = i;
							}
							else if(hiddenObj.h !== isSetHidden)
							{
								worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
								if(true === hiddenObj.h)
								{
									nHiddenRowCount += i - hiddenObj.start;
								}
								
								hiddenObj.h = isSetHidden;
								hiddenObj.start = i;
							}
							
							if(i === endRow)
							{
								worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i);
								if(true === hiddenObj.h)
								{
									nHiddenRowCount += i + 1 - hiddenObj.start;
								}
							}
							nRowsCount++;
						}
						else if(hiddenObj.h !== null)
						{
							worksheet.setRowHidden(hiddenObj.h, hiddenObj.start, i - 1);
							if(true === hiddenObj.h)
							{
								nHiddenRowCount += i - hiddenObj.start;
							}
							hiddenObj.h = null
						}
					}
					nOpenRowsCount = nRowsCount - nHiddenRowCount;
					nAllRowsCount = endRow - startRow + 1;
				}
				
				//history
				this._addHistoryObj(oldFilter, AscCH.historyitem_AutoFilter_ApplyMF,
					{activeCells: ar, autoFiltersObject: autoFiltersObject});
				History.EndTransaction();
				
				if(!bUndoChanges && !bRedoChanges)
				{
					this._resetTablePartStyle();
				}
				
				return {minChangeRow: minChangeRow, rangeOldFilter: rangeOldFilter, nOpenRowsCount: nOpenRowsCount, nAllRowsCount: nAllRowsCount};
			},
			
			reapplyAutoFilter: function (displayName, ar) 
			{
				var worksheet = this.worksheet;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				var minChangeRow;
				
				//**get filter**
				var filter = this._getFilterByDisplayName(displayName);
				var autoFilter = filter && false === filter.isAutoFilter() ? filter.AutoFilter : filter;
				
				if(filter === null)
					return false;
				
				History.Create_NewPoint();
				History.StartTransaction();
				
				//open/close rows
				if(!bUndoChanges && !bRedoChanges)
				{
					var hiddenObj = {start: filter.Ref.r1 + 1, h: null};
					
					//TODO скрытие оптимизировать аналогично функции applyAutoFilter
					var startRow = autoFilter && autoFilter.Ref ? autoFilter.Ref.r1 + 1 : filter.Ref.r1 + 1;
					var endRow = autoFilter && autoFilter.Ref ? autoFilter.Ref.r2 : filter.Ref.r2;
					for(var i = startRow; i <= endRow; i++)
					{	
						var isHidden = false;
						if(autoFilter.FilterColumns && autoFilter.FilterColumns.length)
							isHidden = this._hiddenAnotherFilter(autoFilter.FilterColumns, null, i, autoFilter.Ref.c1);
						
						if(isHidden !== worksheet.getRowHidden(i))
						{
							if(minChangeRow === null)
							{
								minChangeRow = i;
							}
						}
						
						if(true === isHidden)
						{
							worksheet.setRowHidden(isHidden, i, i);
						}
					}
				}
				
				History.EndTransaction();
				
				return {minChangeRow: minChangeRow, updateRange: filter.Ref, filter: filter};
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
			
			searchRangeInTableParts: function(range)
			{
				var worksheet = this.worksheet;
				var containRangeId = -1, tableRange;
				var tableParts = worksheet.TableParts;
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
				var worksheet = this.worksheet;
				var result = false;
				
				if(-1 !== tablePartId)
				{
					var tablePart = worksheet.TableParts[tablePartId];
					if(tablePart.Ref && ((tablePart.AutoFilter && tablePart.AutoFilter.FilterColumns && tablePart.AutoFilter.FilterColumns.length) || (tablePart && tablePart.AutoFilter && tablePart.SortState && tablePart.SortState.SortConditions && tablePart.SortState.SortConditions[0])))
						result = {isFilterColumns: true, isAutoFilter: true};
					else if(tablePart.Ref && tablePart.AutoFilter && tablePart.AutoFilter !== null)
						result = {isFilterColumns: false, isAutoFilter: true};
					else
						result = {isFilterColumns: false, isAutoFilter: false};
				}
				else
				{
					if(worksheet.AutoFilter && ((worksheet.AutoFilter.FilterColumns && worksheet.AutoFilter.FilterColumns.length && this._isFilterColumnsContainFilter(worksheet.AutoFilter.FilterColumns)) || (worksheet.AutoFilter.SortState && worksheet.AutoFilter.SortState.SortConditions && worksheet.AutoFilter.SortState.SortConditions[0])))
					{
						result = {isFilterColumns: true, isAutoFilter: true};
					}
					else if(worksheet.AutoFilter)
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
			
			getAddFormatTableOptions: function(activeCells, userRange)
			{
				var res;
				
				if(userRange)
				{
					activeCells = AscCommonExcel.g_oRangeCache.getAscRange(userRange);
				}
				
				//данная функция возвращает false в двух случаях - при смене стиля ф/т или при поптыке добавить ф/т к части а/ф
				
				//TODO переделать взаимодействие с меню. если находимся внутри ф/т - вызывать сразу из меню смену стиля ф/т. 
				//для проверки возможности добавить ф/т - попробовать использовать parserHelper.checkDataRange
				var bIsInFilter = this._searchRangeInFilters(activeCells);
				var addRange;
				
				if(false === bIsInFilter)
				{
					bIsInFilter = null;
				}
				
				if(null === bIsInFilter)
				{
					if(activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2 && !userRange)//если ячейка выделенная одна
					{
						addRange = this._getAdjacentCellsAF(activeCells);
					}
					else
					{
						addRange = activeCells;
					}
				}
				else//range внутри а/ф или ф/т
				{
					if(bIsInFilter.isAutoFilter())
					{
						addRange = bIsInFilter.Ref;
					}
					else
					{
						res = false;
					}
				}
				
				if(false !== res)
				{
					res = new AddFormatTableOptions();

					var bIsTitle = this._isAddNameColumn(addRange);
					var range = addRange.clone();
					
					addRange.setAbs(true, true, true, true);
					res.asc_setIsTitle(bIsTitle);
					res.asc_setRange(range.getAbsName());
				}
				
				return res;
			},
			
			
			// Redo
			Redo: function (type, data) {
				History.TurnOff();
				switch (type) {
					case AscCH.historyitem_AutoFilter_Add:
						this.addAutoFilter(data.styleName, data.activeCells, data.addFormatTableOptionsObj, null, data);
						break;
					case AscCH.historyitem_AutoFilter_Delete:
						this.deleteAutoFilter(data.activeCells);
						break;
					case AscCH.historyitem_AutoFilter_ChangeTableStyle:
						this.changeTableStyleInfo(data.styleName, data.activeCells);
						break;
					case AscCH.historyitem_AutoFilter_Sort:
						this.sortColFilter(data.type, data.cellId, data.activeCells, null, data.displayName, data.color);
						break;
					case AscCH.historyitem_AutoFilter_Empty:
						this.isEmptyAutoFilters(data.activeCells, null, null, data.val);
						break;
					case AscCH.historyitem_AutoFilter_ApplyMF:
						this.applyAutoFilter(data.autoFiltersObject, data.activeCells);
						break;
					case AscCH.historyitem_AutoFilter_Move:
						this._moveAutoFilters(data.moveTo, data.moveFrom);
						break;
					case AscCH.historyitem_AutoFilter_CleanAutoFilter:
						this.isApplyAutoFilterInCell(data.activeCells, true);
						break;
					case AscCH.historyitem_AutoFilter_CleanFormat:
						this.cleanFormat(data.activeCells, true);
						break;
					case AscCH.historyitem_AutoFilter_Change:
						if(data !== null && data.displayName)
						{
							var redrawTablesArr;
							if(data.type === true)
							{
								redrawTablesArr = this.insertLastTableColumn(data.displayName, data.activeCells);
							}	
							else if(data.type === false)
							{
								redrawTablesArr = this.insertLastTableRow(data.displayName, data.activeCells);
							}
							this.redrawStylesTables(redrawTablesArr);
						}
						break;
					case AscCH.historyitem_AutoFilter_ChangeTableInfo:
						this.changeFormatTableInfo(data.displayName, data.type, data.val);
						break;
					case AscCH.historyitem_AutoFilter_ChangeTableRef:
						this.changeTableRange(data.displayName, data.moveTo);
						break;
					case AscCH.historyitem_AutoFilter_ChangeTableName:
						this.changeDisplayNameTable(data.displayName, data.val);
						break;
					case AscCH.historyitem_AutoFilter_ClearFilterColumn:
						this.clearFilterColumn(data.cellId, data.displayName);
						break;
					case AscCH.historyitem_AutoFilter_ChangeColumnName:
						this.renameTableColumn(null, null, data);
						break;
					case AscCH.historyitem_AutoFilter_ChangeTotalRow:
						this.renameTableColumn(null, null, data);
						break;
				}
				History.TurnOn();
			},
			
			// Undo
			Undo: function (type, data) {
				var worksheet = this.worksheet;
				var undoData = data.undo;
				var cloneData;
				
				if(!undoData)
					return;
				
				if (undoData.clone) {
					cloneData = undoData.clone(null);
				} else
					cloneData = undoData;
					
				if(!cloneData)
					return;
				if(cloneData.insCells)
					delete cloneData.insCells;

				//TODO переделать undo, по типам
				if(type === AscCH.historyitem_AutoFilter_ChangeColumnName || type === AscCH.historyitem_AutoFilter_ChangeTotalRow)//перемещение
				{
					this.renameTableColumn(null, null, undoData);
				}
				else if(type === AscCH.historyitem_AutoFilter_Move)//перемещение
				{
					this._moveAutoFilters(null, null, data);
				}
				else if(type === AscCH.historyitem_AutoFilter_Empty)//было удаление, на undo добавляем
				{
					if(cloneData.TableStyleInfo)
					{
						worksheet.addTablePart(cloneData ,true);
						this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
					}
					else
						worksheet.AutoFilter = cloneData;
				}
				else if(type === AscCH.historyitem_AutoFilter_Change || type === AscCH.historyitem_AutoFilter_ChangeTableInfo || type === AscCH.historyitem_AutoFilter_ChangeTableRef)
				{
					if(worksheet.AutoFilter && (cloneData.newFilterRef.isEqual(worksheet.AutoFilter.Ref) || (cloneData.oldFilter && cloneData.oldFilter.isAutoFilter())))
						worksheet.AutoFilter = cloneData.oldFilter.clone(null);
					else if(worksheet.TableParts)
					{
						for(var l = 0; l < worksheet.TableParts.length; l++)
						{
							if(cloneData.newFilterRef && cloneData.oldFilter && cloneData.oldFilter.DisplayName === worksheet.TableParts[l].DisplayName)
							{
								worksheet.changeTablePart(l, cloneData.oldFilter.clone(null), false);

								//чистим стиль от старой таблицы
								var clearRange = new AscCommonExcel.Range(worksheet, cloneData.newFilterRef.r1, cloneData.newFilterRef.c1, cloneData.newFilterRef.r2, cloneData.newFilterRef.c2);
								clearRange.setTableStyle(null);
								
								this._setColorStyleTable(cloneData.oldFilter.Ref, cloneData.oldFilter, null, true);
								
								//если на месте того, где находилась Ф/т находится другая, то применяем к ней стили
								this._setStyleTables(cloneData.newFilterRef);
								
								//event
								worksheet.handlers.trigger("changeRefTablePart", cloneData.oldFilter);
								
								break;
							}	
						}
					}
				}
				else if(type === AscCH.historyitem_AutoFilter_ChangeTableName)
				{
					var oldName = cloneData.newDisplayName;
					
					for(var l = 0; l < worksheet.TableParts.length; l++)
					{
						if(oldName === worksheet.TableParts[l].DisplayName)
						{
							worksheet.changeTablePart(l, cloneData.oldFilter.clone(null), true);
							break;
						}
					}
				}
				else if((type === AscCH.historyitem_AutoFilter_Sort || type === AscCH.historyitem_AutoFilter_ClearFilterColumn) && cloneData.oldFilter)//сортировка
				{
					if(worksheet.AutoFilter && cloneData.oldFilter.isAutoFilter())
						worksheet.AutoFilter = cloneData.oldFilter.clone(null);
					else if(worksheet.TableParts)
					{
						for(var l = 0; l < worksheet.TableParts.length; l++)
						{
							if(cloneData.oldFilter.DisplayName === worksheet.TableParts[l].DisplayName)
							{
								worksheet.changeTablePart(l, cloneData.oldFilter.clone(null), false);
								break;
							}	
						}
					}
				}
				else if(type === AscCH.historyitem_AutoFilter_CleanFormat)
				{
					if(worksheet.TableParts && cloneData && cloneData.Ref)
					{
						for(var l = 0; l < worksheet.TableParts.length; l++)
						{
							//TODO сравниваю не по DisplayName по следующей причине: делаем undo всему, затем redo, и форматированная таблицы добавляется с новым именем
							//если передавать в redo displaName -> конфликт при совместном ред.(1- ый добавляет ф/т + undo, 2-ой добавляет ф/т, первый делает redo->2 одинаковых имени)
							if(cloneData.Ref.isEqual(worksheet.TableParts[l].Ref))
							{
								worksheet.changeTablePart(l, cloneData.clone(null), false);
								this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
								break;
							}	
						}
					}
				}
				else if(cloneData.FilterColumns || cloneData.AutoFilter || cloneData.TableColumns || (cloneData.Ref && (cloneData instanceof AscCommonExcel.AutoFilter || cloneData instanceof AscCommonExcel.TablePart)))//add
				{
					if(cloneData.Ref)
					{
						var isEn = false;
						if(worksheet.AutoFilter && worksheet.AutoFilter.Ref.isEqual(cloneData.Ref))
						{
							this._reDrawCurrentFilter(cloneData.FilterColumns);
							worksheet.AutoFilter = cloneData;
							this._resetTablePartStyle(worksheet.AutoFilter.Ref);
							isEn = true;
						}
						else if(worksheet.TableParts)
						{
							for(var l = 0; l < worksheet.TableParts.length; l++)
							{
								if(cloneData.Ref.isEqual(worksheet.TableParts[l].Ref))
								{
									worksheet.changeTablePart(l, cloneData, false);
									if(cloneData.AutoFilter && cloneData.AutoFilter.FilterColumns)
										this._reDrawCurrentFilter(cloneData.AutoFilter.FilterColumns, worksheet.TableParts[l]);
									else
										this._reDrawCurrentFilter(null, worksheet.TableParts[l]);
									isEn = true;

									
									//перерисовываем фильтры, находящиеся на одном уровне с данным фильтром
									this._resetTablePartStyle(worksheet.TableParts[l].Ref);
									
									break;
								}	
							}
						}
						
						if(!isEn)//добавляем фильтр
						{
							if(cloneData.TableStyleInfo)
							{
								worksheet.addTablePart.push(cloneData);
								this._setColorStyleTable(cloneData.Ref, cloneData, null, true);
							}
							else
							{
								worksheet.AutoFilter = cloneData;
							}
						}
					}
				}
				else if(cloneData.Ref) //удаление таблиц / автофильтров
				{
					if(worksheet.AutoFilter && worksheet.AutoFilter.Ref.isEqual(cloneData.Ref))
						worksheet.AutoFilter = null;
					else if(worksheet.TableParts)
					{
						for(var l = 0; l < worksheet.TableParts.length; l++)
						{
							if(cloneData.Ref.isEqual(worksheet.TableParts[l].Ref))
							{
								this._cleanStyleTable(cloneData.Ref);
								worksheet.deleteTablePart(l);
							}	
						}
					}
				}
			},
			
			reDrawFilter: function(range, row)
			{
				if(!range && row == undefined)
					return;
				
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts;
				if(tableParts)
				{
					if(range === null && row !== undefined)
					{
						//TODO передавать wsview
						range = new Asc.Range(0, row, worksheet.nColsCount - 1, row);
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
			
			isEmptyAutoFilters: function(ar, insertType, exceptionArray, bConvertTableFormulaToRef)
			{
				var worksheet = this.worksheet;
				var activeCells = ar.clone();
				var t = this;
				
				var DeleteColumns = insertType && (insertType == c_oAscDeleteOptions.DeleteColumns || insertType == c_oAscInsertOptions.InsertColumns) ? true : false;
				var DeleteRows = insertType && (insertType == c_oAscDeleteOptions.DeleteRows || insertType == c_oAscInsertOptions.InsertRows) ? true : false;

				if(DeleteColumns)//в случае, если удаляем столбцы, тогда расширяем активную область область по всем строкам
				{
					activeCells.r1 = 0;
					activeCells.r2 = AscCommon.gc_nMaxRow - 1;
				}
				else if(DeleteRows)//в случае, если удаляем строки, тогда расширяем активную область область по всем столбцам
				{
					activeCells.c1 = 0;
					activeCells.c2 = AscCommon.gc_nMaxCol - 1;
				}
				
				History.StartTransaction();
				
				var changeFilter = function(filter, isTablePart, index)
				{
					var bRes = false;
					var oldFilter = filter.clone(null);
					var oRange = AscCommonExcel.Range.prototype.createFromBBox(worksheet, oldFilter.Ref);

					var bbox = oRange.getBBox0();

					//смотрим находится ли фильтр(первая его строчка) внутри выделенного фрагмента
					if ((activeCells.containsFirstLineRange(bbox) && !isTablePart) || (isTablePart && activeCells.containsRange(bbox))) {
						if(isTablePart) {
							oRange.setTableStyle(null);
							//write formulas history before filter history
							worksheet.deleteTablePart(index, bConvertTableFormulaToRef);
						} else
							worksheet.AutoFilter = null;
							
						//открываем скрытые строки
						if(oldFilter.isApplyAutoFilter())
							worksheet.setRowHidden(false, bbox.r1, bbox.r2);

						//заносим в историю
						if(isTablePart){
							t._addHistoryObj(oldFilter, AscCH.historyitem_AutoFilter_Empty, {activeCells: activeCells, val: bConvertTableFormulaToRef}, null, bbox);
                        }
						else
							t._addHistoryObj(oldFilter, AscCH.historyitem_AutoFilter_Empty, {activeCells: activeCells}, null, oldFilter.Ref);
						bRes = true;
					}
					return bRes;
				};
				
				if(worksheet.AutoFilter)
				{
					changeFilter(worksheet.AutoFilter);
				}
				if(worksheet.TableParts)
				{
					for (var i = worksheet.TableParts.length - 1; i >= 0; i--)
					{
						var tablePart = worksheet.TableParts[i];
						changeFilter(tablePart, true, i);
					}
				}
				
				t._setStyleTablePartsAfterOpenRows(activeCells);
				
				History.EndTransaction();
			},
			
			cleanFormat: function(range)
			{
				var worksheet = this.worksheet;
				var t = this, selectedTableParts;
				//if first row AF in Range  - delete AF
				if(worksheet.AutoFilter && worksheet.AutoFilter.Ref && range.containsFirstLineRange(worksheet.AutoFilter.Ref))
					this.isEmptyAutoFilters(worksheet.AutoFilter.Ref);
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

                            if(selectedTableParts[i].TableStyleInfo)
							    selectedTableParts[i].TableStyleInfo.Name = null;

							t._cleanStyleTable(selectedTableParts[i].Ref);
							
							t._addHistoryObj(cloneFilter, AscCH.historyitem_AutoFilter_CleanFormat, {activeCells: range});
						}
						
						History.EndTransaction();
					};
					
					selectedTableParts = this._searchFiltersInRange(range, true);
					if(selectedTableParts && selectedTableParts.length)
                    {
                        deleteFormatCallBack();
                    }
				}
			},
			
			
			//if active range contains in tablePart but not equal this active range
			isTablePartContainActiveRange: function(activeRange)
			{
				var worksheet = this.worksheet;
				
				var tableParts = worksheet.TableParts;
				var tablePart;
				for(var i = 0; i < tableParts.length; i++)
				{
					tablePart = tableParts[i];
					if(tablePart && tablePart.Ref && tablePart.Ref.containsRange(activeRange) && !tablePart.Ref.isEqual(activeRange))
						return true;
				}
				return false;
			},
			_cleanStylesTables: function(redrawTablesArr) {
				for(var i = 0; i < redrawTablesArr.length; i++) {
					this._cleanStyleTable(redrawTablesArr[i].oldfilterRef);
				}
			},
			_setStylesTables: function(redrawTablesArr) {
				for(var i = 0; i < redrawTablesArr.length; i++) {
					this._setColorStyleTable(redrawTablesArr[i].newFilter.Ref, redrawTablesArr[i].newFilter, null, true);
				}
			},
			redrawStylesTables: function(redrawTablesArr) {
				//set styles for tables
				this._cleanStylesTables(redrawTablesArr);
				this._setStylesTables(redrawTablesArr);
			},
			insertColumn: function(type, activeRange, insertType, displayNameFormatTable, bHistoryStyles)
			{
				var worksheet = this.worksheet;
				var t  = this;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				var DeleteColumns = ((insertType == c_oAscDeleteOptions.DeleteColumns && type == 'delCell') || insertType == c_oAscInsertOptions.InsertColumns) ? true : false;
				activeRange = activeRange.clone();
				var diff = activeRange.c2 - activeRange.c1 + 1;
				var redrawTablesArr = [];
				
				if(type === "delCell")
					diff = - diff;
				if(DeleteColumns)//в случае, если удаляем столбцы, тогда расширяем активную область область по всем строкам
				{
					activeRange.r1 = 0;
					activeRange.r2 = AscCommon.gc_nMaxRow - 1;
				}
				
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
						else if(activeRange.c1 > ref.c1 && activeRange.c2 >= ref.c2 && activeRange.c1 <= ref.c2 && diff < 0)//parts of after filter
						{
							oldFilter = filter.clone(null);
							diffColId = activeRange.c1 - ref.c2 - 1;
							
							if(diff < 0 && bTablePart)
								filter.deleteTableColumns(activeRange);
							else if(bTablePart)
								filter.addTableColumns(activeRange, t);
							
							filter.changeRef(diffColId);						
						}
						else if((activeRange.c1 >= ref.c1 && activeRange.c1 <= ref.c2 && activeRange.c2 <= ref.c2) || (activeRange.c1 > ref.c1 && activeRange.c2 >= ref.c2 && activeRange.c1 < ref.c2 && diff > 0) || (activeRange.c1 >= ref.c1 && activeRange.c1 <= ref.c2 && activeRange.c2 > ref.c2 && diff > 0))//inside
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
							t._addHistoryObj(changeElement, AscCH.historyitem_AutoFilter_Change, null, true, oldFilter.Ref, null, activeRange);
						}
						
						//set style
						if(oldFilter && bTablePart)
							redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
					}
				};
				
				
				//change autoFilter
				if(worksheet.AutoFilter)
					changeFilter(worksheet.AutoFilter);
				
				//change TableParts
				var tableParts = worksheet.TableParts;
				for(var i = 0; i < tableParts.length; i++)
					changeFilter(tableParts[i], true);
				
				if(displayNameFormatTable && type == 'insCells')
				{
					redrawTablesArr = redrawTablesArr.concat(this.insertLastTableColumn(displayNameFormatTable, activeRange));
				}
				return redrawTablesArr;
			},
			
			insertLastTableColumn: function(displayNameFormatTable, activeRange)
			{
				var worksheet = this.worksheet;
				var t  = this;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				
				var redrawTablesArr = [];
				
				var changeFilter = function(filter)
				{
					var oldFilter = filter.clone(null);
					filter.addTableLastColumn(null, t);
					filter.changeRef(1);
						
					//History
					if(!bUndoChanges && !bRedoChanges /*&& !notAddToHistory*/ && oldFilter)
					{
						var changeElement = 
						{
							oldFilter: oldFilter,
							newFilterRef: filter.Ref.clone()
						};
						t._addHistoryObj(changeElement, AscCH.historyitem_AutoFilter_Change, {displayName: displayNameFormatTable, activeCells: activeRange, type: true}, false, oldFilter.Ref, null, activeRange);
					}
					
					redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
				};
				
				var tablePart = t._getFilterByDisplayName(displayNameFormatTable);
				
				if(tablePart)
				{
					//change TableParts
					changeFilter(tablePart);
				}
				
				
				return redrawTablesArr;
			},
			
			insertRows: function(type, activeRange, insertType, displayNameFormatTable)
			{
				var worksheet = this.worksheet;
				var t  = this;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				var DeleteRows = ((insertType == c_oAscDeleteOptions.DeleteRows && type == 'delCell') || insertType == c_oAscInsertOptions.InsertRows) ? true : false;
				activeRange = activeRange.clone();
				var diff = activeRange.r2 - activeRange.r1 + 1;
				var redrawTablesArr = [];
				
				if(type === "delCell")
					diff = - diff;
				
				if(DeleteRows)//в случае, если удаляем строки, тогда расширяем активную область область по всем столбцам
				{
					activeRange.c1 = 0;
					activeRange.c2 = AscCommon.gc_nMaxCol - 1;
				}
				
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
						else if(activeRange.r1 >= ref.r1 && activeRange.r2 <= ref.r2)//inside
						{
							oldFilter = filter.clone(null);
							
							if(diff < 0 && bTablePart && activeRange.r1 <= ref.r2 && activeRange.r2 >= ref.r2)
							{
								filter.TotalsRowCount = null;
							}
							
							filter.changeRef(null, diff);
						}
						else if(activeRange.r1 > ref.r1 && activeRange.r2 > ref.r2 && activeRange.r1 <= ref.r2)
						{
							oldFilter = filter.clone(null);
							if(diff < 0)
							{
								filter.changeRef(null, diff + (activeRange.r2 - ref.r2));
							}
							else
							{
								filter.changeRef(null, diff);
							}
						}
					}
					
					if(!bUndoChanges && !bRedoChanges /*&& !notAddToHistory*/ && oldFilter)
					{
						var changeElement =
						{
							oldFilter: oldFilter,
							newFilterRef: filter.Ref.clone()
						};
						t._addHistoryObj(changeElement, AscCH.historyitem_AutoFilter_Change, null, true, oldFilter.Ref, null, activeRange);
					}
					
					//set style
					if(oldFilter && bTablePart)
						redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
				};
				
				//change autoFilter
				if(worksheet.AutoFilter)
					changeFilter(worksheet.AutoFilter);
				
				//change TableParts
				var tableParts = worksheet.TableParts;
				for(var i = 0; i < tableParts.length; i++)
					changeFilter(tableParts[i], true);
				
				if(displayNameFormatTable && type == 'insCell')
				{
					redrawTablesArr = redrawTablesArr.concat(this.insertLastTableRow(displayNameFormatTable, activeRange));
				}
				
				return redrawTablesArr;
			},
			
			insertLastTableRow: function(displayNameFormatTable, activeRange)
			{
				var worksheet = this.worksheet;
				var t  = this;
				var bUndoChanges = worksheet.workbook.bUndoChanges;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				
				var redrawTablesArr = [];
				
				var changeFilter = function(filter)
				{
					var oldFilter = filter.clone(null);
					filter.changeRef(null, 1);
						
					//History
					if(!bUndoChanges && !bRedoChanges /*&& !notAddToHistory*/ && oldFilter)
					{
						var changeElement = 
						{
							oldFilter: oldFilter,
							newFilterRef: filter.Ref.clone()
						};
						t._addHistoryObj(changeElement, AscCH.historyitem_AutoFilter_Change, {displayName: displayNameFormatTable, activeCells: activeRange, type: false}, false, oldFilter.Ref, null, activeRange);
					}
					
					redrawTablesArr.push({oldfilterRef: oldFilter.Ref, newFilter: filter});
				};
				
				var tablePart = t._getFilterByDisplayName(displayNameFormatTable);
				
				if(tablePart)
				{
					//change TableParts
					changeFilter(tablePart);
				}
				return redrawTablesArr;
			},
			
			sortColFilter: function(type, cellId, activeRange, sortProps, displayName, color) {
				var curFilter, sortRange, filterRef, startCol, maxFilterRow;
				var t = this;
				
				if(!sortProps)
					sortProps = this.getPropForSort(cellId, activeRange, displayName);
					
				curFilter = sortProps.curFilter, sortRange = sortProps.sortRange, filterRef = sortProps.filterRef, startCol = sortProps.startCol, maxFilterRow = sortProps.maxFilterRow;
				
				var onSortAutoFilterCallback = function(type)
				{
					History.Create_NewPoint();
					History.StartTransaction();
					
					var oldFilter = curFilter.clone(null);
					
					//изменяем содержимое фильтра
					if(!curFilter.SortState)
					{
						curFilter.SortState = new AscCommonExcel.SortState();
						curFilter.SortState.Ref = new Asc.Range(startCol, curFilter.Ref.r1, startCol, maxFilterRow);
						curFilter.SortState.SortConditions = [];
						curFilter.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
					}
					else
					{
						curFilter.SortState.Ref = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r2);
						curFilter.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
					}
						
					var cellIdRange = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r1);
					
					curFilter.SortState.SortConditions[0].Ref = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r2);
					curFilter.SortState.SortConditions[0].ConditionDescending = type === Asc.c_oAscSortOptions.Ascending;

					if(curFilter.TableStyleInfo)
					{
						t._setColorStyleTable(curFilter.Ref, curFilter);
					}
					
					t._addHistoryObj({oldFilter: oldFilter}, AscCH.historyitem_AutoFilter_Sort,
						{activeCells: cellIdRange, type: type, cellId: cellId, displayName: displayName}, null, curFilter.Ref);
					History.EndTransaction();
				};
				
				
				var onSortColorAutoFilterCallback = function(type)
				{
					History.Create_NewPoint();
					History.StartTransaction();
					
					var oldFilter = curFilter.clone(null);
					
					//изменяем содержимое фильтра
					if(!curFilter.SortState)
					{
						curFilter.SortState = new AscCommonExcel.SortState();
						curFilter.SortState.Ref = new Asc.Range(startCol, curFilter.Ref.r1, startCol, maxFilterRow);
						curFilter.SortState.SortConditions = [];
						curFilter.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
					}
					else
					{
						curFilter.SortState.Ref = new Asc.Range(startCol, curFilter.Ref.r1, startCol, maxFilterRow);
						curFilter.SortState.SortConditions[0] = new AscCommonExcel.SortCondition();
					}
						
					var cellIdRange = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r1);
					
					curFilter.SortState.SortConditions[0].Ref = new Asc.Range(startCol, filterRef.r1, startCol, filterRef.r2);
					curFilter.SortState.SortConditions[0].dxf = new AscCommonExcel.CellXfs();
					
					if(type === Asc.c_oAscSortOptions.ByColorFill)
					{
						curFilter.SortState.SortConditions[0].dxf.fill = new AscCommonExcel.Fill();
						curFilter.SortState.SortConditions[0].dxf.fill.bg = color;
						curFilter.SortState.SortConditions[0].ConditionSortBy = Asc.ESortBy.sortbyCellColor;
					}
					else
					{
						curFilter.SortState.SortConditions[0].dxf.font = new AscCommonExcel.Font();
						curFilter.SortState.SortConditions[0].dxf.font.setColor(color);
						curFilter.SortState.SortConditions[0].ConditionSortBy = Asc.ESortBy.sortbyFontColor;
					}

					if(curFilter.TableStyleInfo)
					{
						t._setColorStyleTable(curFilter.Ref, curFilter);
					}
					
					t._addHistoryObj({oldFilter: oldFilter}, AscCH.historyitem_AutoFilter_Sort,
						{activeCells: cellIdRange, type: type, cellId: cellId, color: color, displayName: displayName}, null, curFilter.Ref);
					History.EndTransaction();
				};
				
				switch(type)
				{
					case Asc.c_oAscSortOptions.Ascending:
					case Asc.c_oAscSortOptions.Descending:
					{
						onSortAutoFilterCallback(type);
						break;
					}
					case Asc.c_oAscSortOptions.ByColorFill:
					case Asc.c_oAscSortOptions.ByColorFont:
					{
						onSortColorAutoFilterCallback(type);
						break;
					}
				}
			},
			
			getPropForSort: function(cellId, activeRange, displayName)
			{
				var worksheet = this.worksheet;
				var t = this;
				var curFilter, sortRange, filterRef, startCol, maxFilterRow;
			
				var isCellIdString = false;
				if(cellId !== undefined && cellId != "" && typeof cellId == 'string')
				{
					activeRange = t._idToRange(cellId);
					displayName = undefined;
					isCellIdString = true;
				}
				
				
				curFilter = this._getFilterByDisplayName(displayName);
				if(null !== curFilter)
				{
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
						return false;
						
					if(filter === -1)//если нет ф/т в выделенном диапазоне
					{
						if(worksheet.AutoFilter && worksheet.AutoFilter.Ref)
						{
							curFilter = worksheet.AutoFilter;
							filterRef = curFilter.Ref;
						}
						
						//в данному случае может быть захвачен а/ф, если он присутвует(надо проверить), либо нажата кнопка а/ф
						if(curFilter && (filterRef.isEqual(activeRange) || cellId !== '' || activeRange.isOneCell()))
						{
							if(cellId !== '' && !isCellIdString)
								startCol = filterRef.c1 + cellId;
							else
								startCol = activeRange.startCol;
							
							if(startCol === undefined)
								startCol = activeRange.c1;
						}
						else//внутри а/ф либо без а/ф либо часть а/ф(делаем ws.setSelectionInfo("sort", resType);)
						{
							return null;
						}
					}
					else
					{
						//получаем данную ф/т
						curFilter = worksheet.TableParts[filter];
						filterRef = curFilter.Ref;
						
						startCol = activeRange.startCol;
						if(startCol === undefined)
							startCol = activeRange.c1;
					}
				}
				
				var ascSortRange = curFilter.getRangeWithoutHeaderFooter();
				maxFilterRow = ascSortRange.r2;
				if(curFilter.isAutoFilter() && curFilter.isApplyAutoFilter() === false)//нужно подхватить нижние ячейки в случае, если это не применен а/ф
				{
					var automaticRange = this._getAdjacentCellsAF(curFilter.Ref, true);
					var automaticRowCount = automaticRange.r2;
					
					if(automaticRowCount > maxFilterRow)
						maxFilterRow = automaticRowCount;
				}
				
				sortRange = worksheet.getRange3(ascSortRange.r1, ascSortRange.c1, maxFilterRow, ascSortRange.c2);
				
				return {sortRange: sortRange, curFilter: curFilter, filterRef: filterRef, startCol: startCol, maxFilterRow: maxFilterRow};
			},
			
			//2 parameter - clean from found filter FilterColumns и SortState
			isApplyAutoFilterInCell: function(activeCell, clean)
			{
				var worksheet = this.worksheet;
				if(worksheet.TableParts)
				{
					var tablePart;
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						tablePart = worksheet.TableParts[i];
						
						//если применен фильтр или сортировка
						if(tablePart.isApplyAutoFilter() || tablePart.isApplySortConditions())
						{
							if(tablePart.Ref.containsRange(activeCell))
							{
								if(clean)
								{
									return this._cleanFilterColumnsAndSortState(tablePart, activeCell);
								}
							}	
						}
						else
						{
							if(tablePart.Ref.containsRange(activeCell, activeCell))
								return false;
						}
					}
				}

				if (worksheet.AutoFilter &&
					(worksheet.AutoFilter.isApplyAutoFilter() || worksheet.AutoFilter.isApplySortConditions())) {
					if (clean) {
						return this._cleanFilterColumnsAndSortState(worksheet.AutoFilter, activeCell);
					}
				}
				
				return false;
			},
			
			isActiveRangeIntersectionAutoFilter: function(addFormatTableOptionsObj)
			{
				var res = false;
				var worksheet = this.worksheet;

				var activeRange = AscCommonExcel.g_oRangeCache.getAscRange(addFormatTableOptionsObj.asc_getRange());
				if(activeRange && worksheet.AutoFilter && worksheet.AutoFilter.Ref.intersection(activeRange))
					res = true;
					
				return res;
			},
			
			//если активный диапазон захватывает части нескольких табли, либо часть одной таблицы и одну целую
			isRangeIntersectionSeveralTableParts: function(activeRange)
			{
				//TODO сделать общую функцию с isActiveCellsCrossHalfFTable
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts; 
				
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
							return true;
						}
					}
				}
				
				return false;
			},
			
			isRangeIntersectionTableOrFilter: function(range)
			{
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts;
				
				for(var i = 0; i < tableParts.length; i++ )
				{
					if(range.intersection(tableParts[i].Ref))
					{
						return true;
					}
				}
				
				//пересекается, но не равен фильтрованному диапазону. если равен - то фильтр превращается в таблицу
				if(worksheet.AutoFilter && worksheet.AutoFilter.Ref && range.intersection(worksheet.AutoFilter.Ref) && !range.isEqual(worksheet.AutoFilter.Ref))
					return true;
				
				return false;
			},
			
			isStartRangeContainIntoTableOrFilter: function(activeCell)
			{
				var res = null;
				
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts;
				
				var startRange = new Asc.Range(activeCell.col, activeCell.row, activeCell.col, activeCell.row);
				
				for(var i = 0; i < tableParts.length; i++ )
				{
					if(startRange.intersection(tableParts[i].Ref))
					{
						res = i;
						break;
					}
				}
				
				//пересекается, но не равен фильтрованному диапазону. если равен - то фильтр превращается в таблицу
				if(worksheet.AutoFilter && worksheet.AutoFilter.Ref && startRange.intersection(worksheet.AutoFilter.Ref))
				{
					res = -1;
				}
				
				return res;
			},
			
			unmergeTablesAfterMove: function(arnTo)
			{
				var worksheet = this.worksheet;
				
				var intersectionRangeWithTableParts = this._intersectionRangeWithTableParts(arnTo);
				if(intersectionRangeWithTableParts && intersectionRangeWithTableParts.length)
				{
					for(var i = 0; i < intersectionRangeWithTableParts.length; i++)
					{
						var tablePart = intersectionRangeWithTableParts[i];
						worksheet.mergeManager.remove(tablePart.Ref.clone());
					}
				}
			},
			
			getMaxColRow: function()
			{
				var r = -1, c = -1;
				this.worksheet.TableParts.forEach(function (item) {
					r = Math.max(r, item.Ref.r2);
					c = Math.max(c, item.Ref.c2);
				});
				
				return new AscCommon.CellBase(r, c);
			},
			
			_setStyleTablePartsAfterOpenRows: function(ref)
			{
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts; 
				
				for(var i = 0; i < tableParts.length; i++ )
				{
					if(this._intersectionRowRanges(tableParts[i].Ref, ref) === true)
					{
						this._setColorStyleTable(tableParts[i].Ref, tableParts[i]);
					}
				}
			},
			
			_intersectionRowRanges: function(range1, range2)
			{	
				var res = false;
				
				if(!range1 || !range2)
					return false;
				
				if((range1.r1 >= range2.r1 && range1.r1 <= range2.r2) || (range1.r2 >= range2.r1 && range1.r2 <= range2.r2))
				{
					res = true;
				}
				else if((range2.r1 >= range1.r1 && range2.r1 <= range1.r2) || (range2.r2 >= range1.r1 && range2.r2 <= range1.r2))
				{
					res = true;
				}
				
				return res;
			},
			
			_moveAutoFilters: function(arnTo, arnFrom, data, copyRange, offLock, activeRange)
			{
				//проверяем покрывает ли диапазон хотя бы один автофильтр
				var worksheet = this.worksheet;
				var isUpdate = null;

                var bUndoChanges = worksheet.workbook.bUndoChanges;
                var bRedoChanges = worksheet.workbook.bRedoChanges;
				
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
								worksheet.setRowHidden(false, ref.r1, ref.r2);
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

                            if(!bUndoChanges && !bRedoChanges )
                            {
                                if(!addRedo && !data)
                                {
                                    this._addHistoryObj(oCurFilter, AscCH.historyitem_AutoFilter_Move, {arnTo: arnTo, arnFrom: arnFrom, activeCells: activeRange});
                                    addRedo = true;
                                }
                                else if(!data && addRedo)
                                    this._addHistoryObj(oCurFilter, AscCH.historyitem_AutoFilter_Move, null, null, null, null, activeRange);
                            }
						}
					}
				}
				
				var arnToRange = new Asc.Range(arnTo.c1, arnTo.r1, arnTo.c2, arnTo.r2);
				var intersectionRangeWithTableParts = this._intersectionRangeWithTableParts(arnToRange);
				if(intersectionRangeWithTableParts && intersectionRangeWithTableParts.length)
				{	
					var tablePart;
					for(var i = 0; i < intersectionRangeWithTableParts.length; i++)
					{
						tablePart = intersectionRangeWithTableParts[i];
						this._setColorStyleTable(tablePart.Ref, tablePart);
						worksheet.getRange3(tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2).unmerge();
					}
				}
				
				return isUpdate ? range : null;
			},
			
			afterMoveAutoFilters: function(arnFrom, arnTo)
			{
				//если переносим часть ф/т, применяем стиль к ячейкам arnTo
				//todo пересмотреть перенос ячеек из ф/т. скорее всего нужно будет внести правки со стилями внутри moveRange
				var worksheet = this.worksheet;
				
				var intersectionRangeWithTablePartsFrom = this._intersectionRangeWithTableParts(arnFrom);
				var intersectionRangeWithTablePartsTo = this._intersectionRangeWithTableParts(arnTo);
				if(intersectionRangeWithTablePartsFrom && intersectionRangeWithTablePartsFrom.length === 1 && intersectionRangeWithTablePartsTo === false)
				{
					var refTable = intersectionRangeWithTablePartsFrom[0] ? intersectionRangeWithTablePartsFrom[0].Ref : null;
					if(refTable && !arnFrom.containsRange(refTable))
					{
						var intersection = refTable.intersection(arnFrom);
						//проходимся по всем ячейкам
						var cell, cellTo;
						var diffRow = arnTo.r1 - arnFrom.r1;
						var diffCol = arnTo.c1 - arnFrom.c1;
						for(var i = intersection.r1; i <= intersection.r2; i++)
						{
							for(var j = intersection.c1; j <= intersection.c2; j++)
							{
								cell = worksheet._getCell(i, j);
								cellTo = worksheet._getCell(i + diffRow, j + diffCol);
								
								var xfsTo = cellTo.getCompiledStyle();
								if(null === xfsTo)
								{
									var xfsFrom = cell.getCompiledStyle();
									cellTo.setStyle(xfsFrom);
								}
							}
						}
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
				
				var worksheet = this.worksheet;
				var tableParts = worksheet.TableParts;
				var autoFilter = worksheet.AutoFilter;
				var result = null;

				var tableRange;
				var isExp;
				if(DeleteColumns || DeleteRows)
				{
					//меняем активную область
					var newActiveRange;
					if(DeleteRows)
					{
						newActiveRange = new Asc.Range(0, activeCells.r1, AscCommon.gc_nMaxCol - 1, activeCells.r2);
					}
					else
					{
						newActiveRange = new Asc.Range(activeCells.c1, 0, activeCells.c2, AscCommon.gc_nMaxRow - 1);
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
									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}	
								if(newActiveRange.c1 <= tableRange.c1 && newActiveRange.c2 >= tableRange.c2 && newActiveRange.r1 <= tableRange.r1 && newActiveRange.r2 >= tableRange.r2)
								{
									isExp = true;
									if(isPart)
									{
										worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
								}
								else if(isExp)
								{
									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								else if(isPart)//уже часть захвачена + ещё одна часть
								{
									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								else if(DeleteRows)
								{
									if(!this.checkRemoveTableParts(newActiveRange, tableRange))
									{
										worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
									else if(activeCells.r1 < tableRange.r1 && activeCells.r2 >= tableRange.r1 && activeCells.r2 < tableRange.r2)//TODO заглушка!!!
									{
										worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
										return false;
									}
								}
								else if(DeleteColumns && activeCells.c1 < tableRange.c1 && activeCells.c2 >= tableRange.c1 && activeCells.c2 < tableRange.c2)//TODO заглушка!!!
								{
									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
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

									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
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

									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
							else if(DeleteCellsAndShiftTop)
							{
								//если данный фильтр находится внизу
								if(tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2  && tableRange.c2 >= activeCells.c2))  && !(tableRange.c1 == activeCells.c1 && tableRange.c2 == activeCells.c2)))
								{

									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
								
							}
							else if(InsertCellsAndShiftRight)
							{
								//если данный фильтр находится справа
								if(tableRange.c1 > activeCells.c1 && (((tableRange.r1 <= activeCells.r1 && tableRange.r2 >= activeCells.r1) || (tableRange.r1 <= activeCells.r2  && tableRange.r2 >= activeCells.r2)) && !(tableRange.r1 == activeCells.r1 && tableRange.r2 == activeCells.r2)))
								{

									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
									return false;
								}
							}
							else
							{
								//если данный фильтр находится внизу
								if(tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2  && tableRange.c2 >= activeCells.c2))  && !(tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2)))
								{

									worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
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

						worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
						return false;
					}
					else if(InsertCellsAndShiftRight && activeCells.c1 <= tableRange.c1 && ((activeCells.r1 >= tableRange.r1 && activeCells.r1 <= tableRange.r2) || (activeCells.r2 >= tableRange.r1 && activeCells.r2 <= tableRange.r2)) && !(activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2))//если часть а/ф находится справа
					{
						worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
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
			
			getTableIntersectionRange: function(range)
			{
				var worksheet = this.worksheet;
				var res = [];
				
				var tableParts = worksheet.TableParts; 
				if(tableParts)
				{
					for(var i = 0; i < tableParts.length; i++)
					{
						if(tableParts[i].Ref.intersection(range))
						{
							res.push(worksheet.TableParts[i]);
						}
					}
				}
				
				return res;
			},
			
			changeFormatTableInfo: function(tableName, optionType, val)
			{	
				var worksheet = this.worksheet;
				var isSetValue = false;
				var isSetType = false;
				
				var tablePart = this._getFilterByDisplayName(tableName);
				
				if(!tablePart)
				{
					return false;
				}
				
				History.Create_NewPoint();
				History.StartTransaction();
				
				var oldFilter = tablePart.clone(null);
				var bAddHistoryPoint = true;
				
				switch(optionType)
				{
					case c_oAscChangeTableStyleInfo.columnBanded:
					{
						tablePart.TableStyleInfo.ShowColumnStripes = !tablePart.TableStyleInfo.ShowColumnStripes;
						break;
					}
					case c_oAscChangeTableStyleInfo.columnFirst:
					{
						tablePart.TableStyleInfo.ShowFirstColumn = !tablePart.TableStyleInfo.ShowFirstColumn;
						break;
					}
					case c_oAscChangeTableStyleInfo.columnLast:
					{
						tablePart.TableStyleInfo.ShowLastColumn = !tablePart.TableStyleInfo.ShowLastColumn;
						break;
					}
					case c_oAscChangeTableStyleInfo.rowBanded:
					{
						tablePart.TableStyleInfo.ShowRowStripes = !tablePart.TableStyleInfo.ShowRowStripes;
						break;
					}
					case c_oAscChangeTableStyleInfo.rowTotal:
					{	
						if(val === false)//снимаем галку - удаляем строку итогов
						{
							var clearRange = new AscCommonExcel.Range(worksheet, tablePart.Ref.r2, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2);
							this._clearRange(clearRange, true);
							
							tablePart.TotalsRowCount = tablePart.TotalsRowCount === null ? 1 : null;
							tablePart.changeRef(null, -1);
						}
						else
						{
							//если сверху пустая строка, то просто увеличиваем диапазон и меняем флаг
							var rangeUpTable = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2, tablePart.Ref.r2 + 1); 
							if(this._isEmptyRange(rangeUpTable, 0) && this.searchRangeInTableParts(rangeUpTable) === -1)
							{
								isSetValue = true;
								isSetType = true;
								
								tablePart.TotalsRowCount = tablePart.TotalsRowCount === null ? 1 : null;
								tablePart.changeRef(null, 1);
							}
							else
							{
								worksheet.getRange3(tablePart.Ref.r2 + 1, tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2).addCellsShiftBottom();
									
								isSetValue = true;
								isSetType = true;
								
								tablePart.TotalsRowCount = tablePart.TotalsRowCount === null ? 1 : null;
								tablePart.changeRef(null, 1);
							}
							
							if(val === true)
							{
								tablePart.generateTotalsRowLabel(worksheet);
							}
						}
						
						break;
					}
					case c_oAscChangeTableStyleInfo.rowHeader:
					{
						if(val === false)//снимаем галку
						{
							var clearRange = new AscCommonExcel.Range(worksheet, tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2);
							this._clearRange(clearRange, true);
							
							tablePart.HeaderRowCount = tablePart.HeaderRowCount === null ? 0 : null;
							tablePart.changeRef(null, 1, true);
							
							if(tablePart.AutoFilter)
							{
								this._openHiddenRows(tablePart);
								tablePart.AutoFilter = null;
							}
						}
						else
						{
							//если сверху пустая строка, то просто увеличиваем диапазон и меняем флаг
							var rangeUpTable = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 - 1, tablePart.Ref.c2, tablePart.Ref.r1 - 1); 
							if(rangeUpTable.r1 >= 0 && this._isEmptyRange(rangeUpTable, 0) && this.searchRangeInTableParts(rangeUpTable) === -1)
							{
								isSetValue = true;
								
								tablePart.HeaderRowCount = tablePart.HeaderRowCount === null ? 0 : null;
								tablePart.changeRef(null, -1, true);
							}
							else
							{
								worksheet.getRange3(tablePart.Ref.r2 + 1, tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2).addCellsShiftBottom();
								worksheet._moveRange(tablePart.Ref,  new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 + 1, tablePart.Ref.c2, tablePart.Ref.r2 + 1));
									
								isSetValue = true;
								
								tablePart.HeaderRowCount = tablePart.HeaderRowCount === null ? 0 : null;
								tablePart.changeRef(null, -1, true);
							}
							
							if(null === tablePart.AutoFilter)
							{
								tablePart.AutoFilter = new AscCommonExcel.AutoFilter();
								tablePart.AutoFilter.Ref = tablePart.Ref.clone();
							}
						}
						
						
						break;
					}
					case c_oAscChangeTableStyleInfo.filterButton:
					{
						tablePart.showButton(val);
						
						break;
					}
					case c_oAscChangeTableStyleInfo.advancedSettings:
					{
						var title = val.asc_getTitle()
						var description = val.asc_getDescription();
						
						//если ничего не меняется в advancedSettings, не заносим точку в историю
						bAddHistoryPoint = false;
						if(undefined !== title)
						{
							tablePart.changeAltText(title);
							bAddHistoryPoint = true;
						}
						if(undefined !== description)
						{
							tablePart.changeAltTextSummary(description);
							bAddHistoryPoint = true;
						}
						
						break;
					}
				}
				
				if(bAddHistoryPoint)
				{
					this._addHistoryObj({oldFilter: oldFilter, newFilterRef: tablePart.Ref.clone()}, AscCH.historyitem_AutoFilter_ChangeTableInfo,
						{activeCells: tablePart.Ref.clone(), type: optionType, val: val, displayName: tableName});
				}
				
				this._cleanStyleTable(tablePart.Ref);
				this._setColorStyleTable(tablePart.Ref, tablePart, null, isSetValue, isSetType);
				History.EndTransaction();
				
				return tablePart.Ref.clone();
			},
			
			changeTableRange: function(tableName, range)
			{
				var tablePart = this._getFilterByDisplayName(tableName);
				
				if(!tablePart)
				{
					return false;
				}
				
				var oldFilter = tablePart.clone(null);
				
				tablePart.changeRefOnRange(range, this, true);
				
				this._addHistoryObj({oldFilter: oldFilter, newFilterRef: tablePart.Ref.clone()}, AscCH.historyitem_AutoFilter_ChangeTableRef,
						{activeCells: tablePart.Ref.clone(), arnTo: range, displayName: tableName});
				
				this._cleanStyleTable(oldFilter.Ref);
				this._setColorStyleTable(tablePart.Ref, tablePart, null, true);
			},
			
			changeDisplayNameTable: function(tableName, newName)
			{
				var tablePart = this._getFilterByDisplayName(tableName);
				var worksheet = this.worksheet;
				
				if(!tablePart)
				{
					return false;
				}
				
				var oldFilter = tablePart.clone(null);
				History.Create_NewPoint();
				History.StartTransaction();

				worksheet.workbook.dependencyFormulas.changeTableName(tableName, newName);
				
				tablePart.changeDisplayName(newName);
				
				this._addHistoryObj({oldFilter: oldFilter, newFilterRef: tablePart.Ref.clone(), newDisplayName: newName}, AscCH.historyitem_AutoFilter_ChangeTableName,
						{activeCells: tablePart.Ref.clone(), val: newName, displayName: tableName});
				
				History.EndTransaction();
			},
			
			checkDeleteAllRowsFormatTable: function(range, emptyRange)
			{
				var worksheet = this.worksheet;
		
				if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var table = worksheet.TableParts[i];
						var intersection = range.intersection(table.Ref);
						if(null !== intersection && intersection.r1 === table.Ref.r1 + 1)
						{
							if(intersection.r2 >= table.Ref.r2 || (table.TotalsRowCount > 0 && intersection.r2 === table.Ref.r2 - 1))
							{
								range.r1++;
								if(emptyRange)
								{
									var deleteRange = this.worksheet.getRange3(table.Ref.r1 + 1, table.Ref.c1, table.Ref.r1 + 1, table.Ref.c2);
									deleteRange.cleanText()
								}
								break;
							}
						}
					}
				}
				
				return range;
			},
			
			convertTableToRange: function(tableName)
			{
				History.Create_NewPoint();
				History.StartTransaction();
				
				var table = this._getFilterByDisplayName(tableName);
				this._convertTableStyleToStyle(table);
				this.isEmptyAutoFilters(table.Ref, null, null, true);
				
				History.EndTransaction();
			},
			
			_convertTableStyleToStyle: function(table)
			{
				if(!table)
				{
					return;
				}
				
				for(var i = table.Ref.r1; i <= table.Ref.r2; i++)
				{
					for(var j = table.Ref.c1; j <= table.Ref.c2; j++)
					{
						var cell = this.worksheet._getCell(i, j);
						
						var xfsFrom = cell.getCompiledStyle();
						cell.setStyle(xfsFrom);
					}
				}
			},
			
			_clearRange: function(range, isClearText)
			{
				range.setTableStyle(null);
				if(isClearText)
				{
					History.TurnOff();
					range.cleanText();
					History.TurnOn();
				}
			},
			
			//TODO избавиться от split, передавать cellId и tableName
			_getPressedFilter: function(activeRange, cellId)
			{
				var worksheet = this.worksheet;
				
				if(cellId !== undefined)
				{
					var curCellId = cellId.split('af')[0];
					activeRange =  AscCommonExcel.g_oRangeCache.getAscRange(curCellId).clone();
				}
				
				var ColId = null;
				var filter = null;
				var index = null;
				var autoFilter;
				if(worksheet.AutoFilter)
				{
					if(worksheet.AutoFilter.Ref.containsRange(activeRange))
					{
						filter = worksheet.AutoFilter;
						autoFilter = filter;
						ColId = activeRange.c1 - worksheet.AutoFilter.Ref.c1;
					}
				}
				
				if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{	
						if(worksheet.TableParts[i].Ref.containsRange(activeRange))
						{
							filter = worksheet.TableParts[i];
							autoFilter = filter.AutoFilter;
							ColId = activeRange.c1 - worksheet.TableParts[i].Ref.c1;
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
				var worksheet = this.worksheet;
				if(displayName === null)
					res = worksheet.AutoFilter;
				else if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{	
						if(worksheet.TableParts[i].DisplayName === displayName)
						{
							res = worksheet.TableParts[i];
							break;
						}
					}
				}
				
				return res;
			},
			
			_getColIdColumn: function(filter, cellId)
			{
				var res = null;
				
				var autoFilter = filter && false === filter.isAutoFilter() ? filter.AutoFilter : filter;
				
				if(autoFilter && autoFilter.FilterColumns && autoFilter.FilterColumns.length)
				{
					
					var rangeCellId = this._idToRange(cellId);
					var colId = rangeCellId.c1 - autoFilter.Ref.c1;
					res = this._getTrueColId(filter, colId);
				}
				
				return res;
			},
			
			_getColIdColumnByRange: function(filter, range)
			{
				var res = null;
				
				var autoFilter = filter && false === filter.isAutoFilter() ? filter.AutoFilter : filter;
				
				if(autoFilter && autoFilter.FilterColumns && autoFilter.FilterColumns.length)
				{
					var colId = range.colStart - autoFilter.Ref.c1;
					res = this._getTrueColId(filter, colId);
				}
				
				return res;
			},
			
			_getIndexByColId: function(autoFilter, colId)
			{
				var res = null;
				
				for(var i = 0; i < autoFilter.FilterColumns.length; i++)
				{
					if(autoFilter.FilterColumns[i].ColId === colId)
					{
						res = i;
						break;
					}
				}
				
				return res;
			},
			
			_hiddenAnotherFilter: function(filterColumns, cellId, r, c)
			{
				var worksheet = this.worksheet;
				var result = false; 
				
				for(var j = 0; j < filterColumns.length; j++)
				{
					var colId = filterColumns[j].ColId;
					
					if(colId !== cellId)
					{
						var cell = worksheet.getCell3(r, colId + c);
						var isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						
						var isNumberFilter = false;
						if(filterColumns[j].CustomFiltersObj || filterColumns[j].Top10 || filterColumns[j].DynamicFilter)
						{
							isNumberFilter = true;
						}
						
						var val = (isDateTimeFormat || isNumberFilter) ? cell.getValueWithoutFormat() : cell.getValueWithFormat()
			
						if(filterColumns[j].isHideValue(val, isDateTimeFormat, null, cell))
						{
							result = true;
							break;
						}
					}
				}
				
				return result;
			},
			
			_addHistoryObj: function (oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter, activeRange) {
				var ws = this.worksheet;
				var oHistoryObject = new AscCommonExcel.UndoRedoData_AutoFilter();
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
					oHistoryObject.val                  = redoObject.val;
					oHistoryObject.color                = redoObject.color;
					oHistoryObject.tablePart       	    = redoObject.tablePart;
					oHistoryObject.nCol       	        = redoObject.nCol;
					oHistoryObject.nRow         	    = redoObject.nRow;
					oHistoryObject.formula         	    = redoObject.formula;
				}
				else
				{
					oHistoryObject.activeCells			= activeRange ? activeRange.clone() : null;
					if(type !== AscCH.historyitem_AutoFilter_Change)
						type = null;
				}
				
				if(!activeHistoryRange)
					activeHistoryRange = null;
				
				History.Add(AscCommonExcel.g_oUndoRedoAutoFilters, type, ws.getId(), activeHistoryRange, oHistoryObject);
			},
			
			_getCurrentWS : function() {
				var ws = this.worksheet;
				return ws.model;
			},

			renameTableColumn: function(range, bUndo, props)
			{
				var worksheet = this.worksheet;
				var val;
				var cell;
				var generateName;
				
				var checkRepeateColumnName = function(val, tableColumns, exeptionCol)
				{
					var res = false;
					
					if(tableColumns && tableColumns.length)
					{
						for(var i = 0; i < tableColumns.length; i++)
						{
							if(tableColumns[i].Name.toLowerCase() === val.toLowerCase() && i !== exeptionCol)
							{
								res = true;
								break;
							}
						}
					}
					
					return res;
				};
				
				if(props)
				{
					range = new Asc.Range(props.nCol, props.nRow, props.nCol, props.nRow);
				}
				
				if(worksheet.TableParts)
				{
					worksheet.workbook.dependencyFormulas.buildDependency();
					//without lockRecal each setValue call calculation
					worksheet.workbook.dependencyFormulas.lockRecal();
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var filter = worksheet.TableParts[i];
						
						var ref = filter.Ref;
						var tableRange = new Asc.Range(ref.c1, ref.r1, ref.c2, ref.r1);
						
						
						//в этом случае нашли ячейки(ячейку), которая входит в состав заголовка фильтра
						var intersection = range.intersection(tableRange);
						if(null !== intersection && 0 !== filter.HeaderRowCount)
						{
							var toHistory = [];
							//проходимся по всем заголовкам
							for(var j = tableRange.c1; j <= tableRange.c2; j++)
							{
								if(j < range.c1 || j > range.c2)
									continue;	
									
								cell = worksheet.getCell3(ref.r1, j);
								val = props ? props.val : cell.getValue();
								
								//проверка на повторение уже существующих заголовков
								if(checkRepeateColumnName(val, filter.TableColumns, j - tableRange.c1))
								{
									val = "";
								}
								
								//если не пустая изменяем TableColumns
								var oldVal = filter.TableColumns[j - tableRange.c1].Name;
								var newVal = null;
								if(val != "" && intersection.c1 <= j && intersection.c2 >= j )
								{
									filter.TableColumns[j - tableRange.c1].Name = val;
									if(!bUndo)
									{
										cell.setType(CellValueType.String);
									}
									newVal = val;
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
									newVal = generateName;
								}

								if(null !== newVal)
								{
									toHistory.push([{nCol: cell.bbox.c1, nRow: cell.bbox.r1, val: oldVal}, AscCH.historyitem_AutoFilter_ChangeColumnName, {activeCells: range, nCol: cell.bbox.c1, nRow: cell.bbox.r1, val: newVal}]);
								}
							}
							//write formulas history before filter history
							worksheet.handlers.trigger("changeColumnTablePart", filter.DisplayName);
							for (var k = 0; k < toHistory.length; ++k) {
								this._addHistoryObj.apply(this, toHistory[k]);
							}
						}
						else
						{
							this._changeTotalsRowData(filter, range, props);
						}
					}
					worksheet.workbook.dependencyFormulas.unlockRecal();
				}
			},
			
			_changeTotalsRowData: function(tablePart, range, props)
			{
				if(!tablePart || !range || !tablePart.TotalsRowCount)
				{
					return false;
				}
				
				var worksheet = this.worksheet;
				
				var tableRange = tablePart.Ref;
				var totalRange = new Asc.Range(tableRange.c1, tableRange.r2, tableRange.c2, tableRange.r2);
				var isIntersection = totalRange.intersection(range);
				
				if(isIntersection)
				{
					for(var j = isIntersection.c1; j <= isIntersection.c2; j++)
					{
						var cell = worksheet.getCell3(tableRange.r2, j);
						var tableColumn = tablePart.TableColumns[j - tableRange.c1];
						
						var formula = null;
						var label = null;
						if(props)
						{
							if(props.formula)
							{
								formula = props.formula;
							}
							else
							{
								label = props.val;
							}
						}
						else
						{
							if(cell.isFormula())
							{
								formula = cell.getFormula();
							}
							else
							{
								label = cell.getValue();
							}
						}
						
						var oldLabel = tableColumn.TotalsRowLabel;
						var oldFormula = tableColumn.getTotalsRowFormula();
						
						if(null !== formula)
						{
							tableColumn.setTotalsRowFormula(formula, worksheet);
						}
						else
						{
							tableColumn.setTotalsRowLabel(label);
							cell.setType(CellValueType.String);
						}
						
						this._addHistoryObj({nCol: cell.bbox.c1, nRow: cell.bbox.r1, formula: oldFormula, val: oldLabel}, AscCH.historyitem_AutoFilter_ChangeTotalRow, {activeCells: range, nCol: cell.bbox.c1, nRow: cell.bbox.r1, formula: formula, val: label});
					}
				}
			},
			
			_isTablePartsContainsRange: function(range)
			{
				var worksheet = this.worksheet;
				var result = null;
				if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						if(worksheet.TableParts[i].Ref.containsRange(range))
						{
							result = worksheet.TableParts[i];
							break;
						}
					}
				}
				return result;
			},
			
			_getAdjacentCellsAF2: function(ar) 
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
				if(ws.AutoFilter || ws.TableParts)
				{
					//var oldFilters = this.allAutoFilter;
					var oldFilters =[];
							
					if(ws.AutoFilter)
					{
						oldFilters[0] = ws.AutoFilter
					}
					
					if(ws.TableParts)
					{
						var s = 1;
						if(!oldFilters[0])
							s = 0;
						for(k = 0; k < ws.TableParts.length; k++)
						{
							if(ws.TableParts[k].AutoFilter)
							{
								oldFilters[s] = ws.TableParts[k];
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
			_getAdjacentCellsAF: function(ar, ignoreAutoFilter) 
			{
				var ws = this.worksheet;
				var cloneActiveRange = ar.clone(true); // ToDo слишком много клонирования
				
				var isEnd = true, cell, merged, valueMerg, rowNum = cloneActiveRange.r1, isEmptyCell;
				
				//есть ли вообще на странице мерженные ячейки
				//TODO стоит пересмотреть проверку мерженных ячеек
				var allRange = ws.getRange3(0, 0, ws.nRowsCount, ws.nColsCount);
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
							
						cell = ws.getRange3(n, k, n, k);
						isEmptyCell = cell.isEmptyText();
						
						//если мерженная ячейка
						if(!(n == ar.r1 && k == ar.c1) && isMergedCells != null && isEmptyCell)
						{
							merged = cell.hasMerged();
							valueMerg = null;
							if(merged)
							{
								valueMerg = ws.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
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
										
									cell = ws.getRange3(n, k, n, k);	
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
						cell = ws.getRange3(cloneActiveRange.r1, n, cloneActiveRange.r1, n);
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
						cell = ws.getRange3(cloneActiveRange.r2, n, cloneActiveRange.r2, n);
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
						cell = ws.getRange3(n, cloneActiveRange.c1, n, cloneActiveRange.c1);
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
						cell = ws.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2);
						if(cell.getValueWithoutFormat() != '')
							break;
						if(n == cloneActiveRange.r2 && cloneActiveRange.c2 > cloneActiveRange.c1)
						{
							mergeCells = ws.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2).hasMerged();
							if(!mergeCells || mergeCells === null)//если не мерженная ячейка
								cloneActiveRange.c2--;
							else if(ws.getRange3(mergeCells.r1, mergeCells.c1, mergeCells.r2, mergeCells.c2).getValue() == "")//если мерженная ячейка пустая
								cloneActiveRange.c2--;
						}
					}
				}
				
				//проверяем не вошёл ли другой фильтр в область нового фильтра
				if(ws.AutoFilter || ws.TableParts)
				{
					//var oldFilters = this.allAutoFilter;
					var oldFilters =[];
							
					if(ws.AutoFilter && !ignoreAutoFilter)
					{
						oldFilters[0] = ws.AutoFilter
					}
					
					if(ws.TableParts)
					{
						var s = 1;
						if(!oldFilters[0])
							s = 0;
						for(k = 0; k < ws.TableParts.length; k++)
						{
							if(ws.TableParts[k].AutoFilter)
							{
								oldFilters[s] = ws.TableParts[k];
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
			
				if(cloneActiveRange)
					return cloneActiveRange;
				else
					return ar;
			},
			
			_addNewFilter: function(ref, style, bWithoutFilter, tablePartDisplayName, tablePart, offset)
			{
				var worksheet = this.worksheet;
				var newFilter;
				var newTableName = tablePartDisplayName ? tablePartDisplayName : worksheet.workbook.dependencyFormulas.getNextTableName();
				
				if(!style)
				{
					if(!worksheet.AutoFilter)
					{
						newFilter = new AscCommonExcel.AutoFilter();
						//ref = Asc.g_oRangeCache.getAscRange(val[0].id + ':' + val[val.length - 1].idNext).clone();
						newFilter.Ref =  ref;
						worksheet.AutoFilter = newFilter;
					}
					
					//проходимся по 1 строчке в поиске мерженных областей
					var row = ref.r1;
					var cell, filterColumn;
					for(var col = ref.c1; col <= ref.c2; col++)
					{
						cell = worksheet.getCell3(row, col);
						var isMerged = cell.hasMerged();
						var isMergedAllRow = (isMerged && isMerged.c2 + 1 == AscCommon.gc_nMaxCol && isMerged.c1 === 0) ? true : false;//если замержена вся ячейка
						
						if((isMerged && isMerged.c2 != col && !isMergedAllRow) || (isMergedAllRow && col !== ref.c1))
						{	
							filterColumn = worksheet.AutoFilter.addFilterColumn();
							filterColumn.ColId = col - ref.c1;
							filterColumn.ShowButton = false;
						}
					}
					return 	worksheet.AutoFilter;
				}
				else
				{	
					//ref = Asc.g_oRangeCache.getAscRange(val[0].id + ':' + val[val.length - 1].idNext).clone();
					
					newFilter = worksheet.createTablePart();
					newFilter.Ref = ref;
					
					if(!bWithoutFilter)
					{
						newFilter.AutoFilter = new AscCommonExcel.AutoFilter();
						newFilter.AutoFilter.Ref = ref;
					}
					
					newFilter.TableStyleInfo = new AscCommonExcel.TableStyleInfo();
					newFilter.TableStyleInfo.Name = style;
					
					if(tablePart && tablePart.TableStyleInfo && tablePart.TableStyleInfo.ShowColumnStripes !== null && tablePart.TableStyleInfo.ShowColumnStripes !== undefined)
					{
						newFilter.TableStyleInfo.ShowColumnStripes = tablePart.TableStyleInfo.ShowColumnStripes;
						newFilter.TableStyleInfo.ShowFirstColumn = tablePart.TableStyleInfo.ShowFirstColumn;
						newFilter.TableStyleInfo.ShowLastColumn = tablePart.TableStyleInfo.ShowLastColumn;
						newFilter.TableStyleInfo.ShowRowStripes = tablePart.TableStyleInfo.ShowRowStripes;
						
						newFilter.HeaderRowCount = tablePart.HeaderRowCount;
						newFilter.TotalsRowCount = tablePart.TotalsRowCount;
					}
					else
					{
						newFilter.TableStyleInfo.ShowColumnStripes = false;
						newFilter.TableStyleInfo.ShowFirstColumn = false;
						newFilter.TableStyleInfo.ShowLastColumn = false;
						newFilter.TableStyleInfo.ShowRowStripes = true;
					}
					
					newFilter.DisplayName = newTableName;

					var tableColumns;
					if(tablePart && tablePart.TableColumns)
					{
						var cloneTableColumns = [];
						for(var i = 0; i < tablePart.TableColumns.length; i++) {
							cloneTableColumns.push(tablePart.TableColumns[i].clone());
						}
						tableColumns = cloneTableColumns;
					}
					else
					{
						tableColumns = this._generateColumnNameWithoutTitle(ref);
					}
					
					newFilter.TableColumns = tableColumns;
					worksheet.addTablePart(newFilter, true);
					//TODO возможно дублируется при всавке(ф-ия _pasteFromBinary) - пересмотреть
					if (tablePart) {
						var renameParams = {};
						renameParams.offset = offset;
						renameParams.tableNameMap = {};
						renameParams.tableNameMap[tablePart.DisplayName] = newTableName;
						newFilter.renameSheetCopy(worksheet, renameParams);
					}
					
					return worksheet.TableParts[worksheet.TableParts.length - 1];
				}
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
				//filter - TablePart or AutoFilter
				//autoFilter - only autoFilter
				var isTablePart = !filter.isAutoFilter();
				var autoFilter = isTablePart ? filter.AutoFilter : filter;
				var ref = filter.Ref;
				var filterColumns = autoFilter.FilterColumns;
				var worksheet = this.worksheet, temp = {}, isDateTimeFormat, /*dataValue,*/ values = [];
				
				colId = this._getTrueColId(autoFilter, colId);

				var currentFilterColumn = this._getFilterColumn(autoFilter, colId);
				
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
				
				if(!isTablePart && filter.isApplyAutoFilter() === false)//нужно подхватить нижние ячейки в случае, если это не применен а/ф
				{
					var automaticRange = this._getAdjacentCellsAF(filter.Ref, true);
					automaticRowCount = automaticRange.r2;
					
					if(automaticRowCount > maxFilterRow)
						maxFilterRow = automaticRowCount;
				}
				
				if(isTablePart && filter.TotalsRowCount)
				{
					maxFilterRow--;
				}
				
				var individualCount = 0, count = 0, tempResult;
				for(var i = ref.r1 + 1; i <= maxFilterRow; i++)
				{
					//max strings
					if(individualCount > maxIndividualValues)
						break;
					
					//not apply filter by current button
					if(null === currentFilterColumn && worksheet.getRowHidden(i) === true)
					{
						individualCount++;
						continue;
					}
					
					//value in current column
					var cell = worksheet.getCell3(i, colId + ref.c1);
					var text = cell.getValueWithFormat();
					var val = cell.getValueWithoutFormat();
					var textLowerCase = text.toLowerCase();
					
					isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
					
					//if(isDateTimeFormat)
						//dataValue = NumFormat.prototype.parseDate(val);
						
					//check duplicate value
					if(temp.hasOwnProperty(textLowerCase))
						continue;
					
					//apply filter by current button
					if(null !== currentFilterColumn)
					{
						if(!this._hiddenAnotherFilter(filterColumns, colId, i, ref.c1))//filter another button
						{
							tempResult = new AutoFiltersOptionsElements();
							tempResult.val = val;
							tempResult.text = text;
							tempResult.isDateFormat = cell.getNumFormat().isDateTimeFormat();
							
							//filter current button
							var checkValue = isDateTimeFormat ? val : text;
							if (!currentFilterColumn.Top10 && !currentFilterColumn.CustomFiltersObj &&
								!currentFilterColumn.ColorFilter && !currentFilterColumn.DynamicFilter && !currentFilterColumn.isHideValue(checkValue, isDateTimeFormat))
							{
								if(isOpenHiddenRows)
									worksheet.setRowHidden(false, i, i);
								tempResult.visible = true;
							}
							else
							{
								if(isOpenHiddenRows)
									worksheet.setRowHidden(false, i, i);
								tempResult.visible = false;
							}
								
							
							addValueToMenuObj(tempResult, count);
							
							temp[textLowerCase] = 1;
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
							worksheet.setRowHidden(false, i, i);
						
						addValueToMenuObj(tempResult, count);
						temp[textLowerCase] = 1;
						count++;
					}
					
					individualCount++;
				}

				return {values: this._sortArrayMinMax(values), automaticRowCount: automaticRowCount};
			},
			
			_getTrueColId: function(filter, colId)
			{
				//TODO - добавил условие, чтобы не было ошибки(bug 30007). возможно, второму пользователю нужно запретить все действия с измененной таблицей.
				if(filter === null)
					return null;
				
				var res = colId;
				if(!filter.isAutoFilter())
					return res;
				
				//если находимся в мерженной ячейке, то возвращаем сдвинутый colId
				var worksheet = this.worksheet;
				var ref = filter.Ref;
				var cell = worksheet.getCell3(ref.r1, colId + ref.c1);
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

            _resetTablePartStyle: function(exceptionRange)
			{
				var worksheet = this.worksheet;
				if(worksheet.TableParts && worksheet.TableParts.length > 0)
				{
					for(var tP = 0; tP < worksheet.TableParts.length; tP++)
					{
						var ref = worksheet.TableParts[tP].Ref;
						
						if(exceptionRange && !exceptionRange.isEqual(ref) && ((ref.r1 >= exceptionRange.r1 && ref.r1 <= exceptionRange.r2) || (ref.r2 >= exceptionRange.r1 && ref.r2 <= exceptionRange.r2)))
							this._setColorStyleTable(ref, worksheet.TableParts[tP]);
						else if(!exceptionRange)
							this._setColorStyleTable(ref, worksheet.TableParts[tP]);
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
				var worksheet = this.worksheet;
				var autoFilter = filter.isAutoFilter() ? filter : filter.AutoFilter;
				var isApplyFilter = autoFilter && autoFilter.FilterColumns && autoFilter.FilterColumns.length ? true : false;
				
				if(filter && filter.Ref && isApplyFilter)
				{
					worksheet.setRowHidden(false, filter.Ref.r1, filter.Ref.r2);
				}
			},
			
			_openHiddenRowsAfterDeleteColumn: function(autoFilter, colId)
			{
				var ref = autoFilter.Ref;
				var filterColumns = autoFilter.FilterColumns;
				var worksheet = this.worksheet;
				
				colId = this._getTrueColId(autoFilter, colId);
				
				if(colId === null)
					return;
				
				for(var i = ref.r1 + 1; i <= ref.r2; i++)
				{
					if(worksheet.getRowHidden(i) === false)
						continue;
						
					if(!this._hiddenAnotherFilter(filterColumns, colId, i, ref.c1))//filter another button
					{
						worksheet.setRowHidden(false, i, i);
					}
				}
			},
			
			_openAllHiddenRowsByFilter: function(filter)
			{
				var autoFilter = filter && !filter.isAutoFilter() ? filter.AutoFilter : filter;
				if(autoFilter && autoFilter.FilterColumns)
				{
					var filterColumns = autoFilter.FilterColumns;
					for(var i = 0; i < filterColumns.length; i++)
					{
						this._openHiddenRowsAfterDeleteColumn(autoFilter, filterColumns[i].ColId);
					}
				}
			},
			
			_isAddNameColumn: function(range)
			{
				//если в трёх первых строчках любых столбцов содержится текстовые данные
				var result = false;
				var worksheet = this.worksheet;
				if(range.r1 != range.r2)
				{
					for(var col = range.c1; col <= range.c2; col++)
					{	
						var valFirst = worksheet.getCell3(range.r1,col);
						if(valFirst != '')
						{
							for(var row = range.r1; row <= range.r1 + 2; row++)
							{
								var cell = worksheet.getCell3(row,col);
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
			
			_generateColumnNameWithoutTitle: function(ref)
			{
				var tableColumns = [], newTableColumn;
				var range = this.worksheet.getRange3(ref.r1, ref.c1, ref.r1, ref.c2);
				var defaultName = 'Column';
				var uniqueColumns = {}, val, valTemplate, valLower, index = 1, isDuplicate = false, emptyCells = false;
				var valuesAndMap = range._getValuesAndMap(true);
				var values = valuesAndMap.values;
				var length = values.length;
				if (0 === length) {
					// Выделили всю строку без значений
					length = ref.c2 - ref.c1 + 1;
					emptyCells = true;
				}
				var map = valuesAndMap.map;
				for (var i = 0; i < length; ++i) {
					if (emptyCells || '' === (valTemplate = val = values[i].v)) {
						valTemplate = defaultName;
						val = valTemplate + index;
						++index;
					}

					while(true) {
						if (isDuplicate) {
							val = valTemplate + (++index);
						}

						valLower = val.toLowerCase();
						if (uniqueColumns[valLower]) {
							isDuplicate = true;
						} else {
							if (isDuplicate && map[valLower]) {
								continue;
							}
							uniqueColumns[valLower] = true;

							newTableColumn = new AscCommonExcel.TableColumn();
							newTableColumn.Name = val;
							tableColumns.push(newTableColumn);
							isDuplicate = false;
							break;
						}
					}
				}
				return tableColumns;
			},
			
			_generateColumnName: function(tableColumns, indexInsertColumn)
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
			
			//TODO убрать начеркивание
			_setColorStyleTable: function(range, options, isOpenFilter, isSetVal, isSetTotalRowType)
			{
				var worksheet = this.worksheet;
				var bRedoChanges = worksheet.workbook.bRedoChanges;
				
				var bbox = range;
				//ограничим количество строчек/столбцов				
				if((bbox.r2 - bbox.r1) > maxValRow)
					bbox.r2 = bbox.r1 + maxValRow;
				if((bbox.c2 - bbox.c1) > maxValCol)
					bbox.c2 = bbox.c1 + maxValCol;
				
				var style = options.TableStyleInfo ? options.TableStyleInfo.clone() : null;
				var styleForCurTable;
				//todo из файла
				var headerRowCount = 1;
				var totalsRowCount = 0;
				if(null != options.HeaderRowCount)
					headerRowCount = options.HeaderRowCount;
				if(null != options.TotalsRowCount)
					totalsRowCount = options.TotalsRowCount;
				
				worksheet.workbook.dependencyFormulas.lockRecal();
				if(style && worksheet.workbook.TableStyles && worksheet.workbook.TableStyles.AllStyles)
				{
					//заполняем названия столбцов
					if(true != isOpenFilter && isSetVal && !bRedoChanges)
					{
						if((headerRowCount > 0 || totalsRowCount > 0)  && options.TableColumns)
						{
							for(var ncol = bbox.c1; ncol <= bbox.c2; ncol++)
							{
								var range = worksheet.getCell3(bbox.r1, ncol);
								var num = ncol - bbox.c1;
								var tableColumn = options.TableColumns[num];
								if(null != tableColumn && null != tableColumn.Name && headerRowCount > 0)
								{
									range.setValue(tableColumn.Name);
									range.setType(CellValueType.String);
								}
								
								if(tableColumn !== null && totalsRowCount > 0)
								{
									range = worksheet.getCell3(bbox.r2, ncol);
									
									if(null !== tableColumn.TotalsRowLabel)
									{
										range.setValue(tableColumn.TotalsRowLabel);
										range.setType(CellValueType.String);
									}
									
									var formula = tableColumn.getTotalRowFormula(options);
									if(null !== formula)
									{
										range.setValue("=" + formula, null, true);
										if(isSetTotalRowType)
										{
											var numFormatType = this._getFormatTableColumnRange(options, tableColumn.Name);
											if(null !== numFormatType)
											{
												range.setNumFormat(numFormatType);
											}
										}
									}
								}
							}
						}
					}
					
					if(!style.Name || (style.Name && !worksheet.workbook.TableStyles.AllStyles[style.Name]))
					{
						return;
					}
					else
					{
						styleForCurTable = worksheet.workbook.TableStyles.AllStyles[style.Name]
					}
					
					//заполняем стили
					var aNoHiddenCol = [];
					for(var i = bbox.c1; i <= bbox.c2; i++)
					{
						if (!worksheet.getColHidden(i))
							aNoHiddenCol.push(i);
					}
					aNoHiddenCol.sort(AscCommon.fSortAscending);
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
						if (!worksheet.getRowHidden(i))
							aNoHiddenRow.push(i);
					}
					aNoHiddenRow.sort(AscCommon.fSortAscending);
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
							var cell = worksheet.getRange3(nRowIndexAbs, nColIndexAbs, nRowIndexAbs, nColIndexAbs);
							var dxf = styleForCurTable.getStyle(bbox, i, j, style, headerRowCount, totalsRowCount);
							if(null != dxf)
								cell.setTableStyle(dxf);
						}
					}
				}
				worksheet.workbook.dependencyFormulas.unlockRecal();
			},
			
			getTableCellStyle: function(row, col)
			{
				var worksheet = this.worksheet;
				var res = null;
				
				var tableIndex = this.searchRangeInTableParts(Asc.Range(col, row, col, row));
				if(tableIndex > -1)
				{
					var table = worksheet.TableParts[tableIndex];
					var style = table.TableStyleInfo;
					var styleForCurTable = worksheet.workbook.TableStyles.AllStyles[style.Name];
					
					if(styleForCurTable)
					{
						var startCol = table.Ref.c1 - col;
						var startRow = table.Ref.r1 - row;
						var bbox = Asc.Range(startCol, startRow, startCol, startRow);
						res = styleForCurTable.getStyle(bbox, startRow, startCol, style, /*headerRowCount*/0, /*totalsRowCount*/0);
					}
				}
				
				return res;
			},
			
			_getFormatTableColumnRange: function(table, columnName)
			{
				var worksheet = this.worksheet;
				var arrFormat = [];
				var res = null;
				
				var tableRange = table.getTableRangeForFormula({param: AscCommon.FormulaTablePartInfo.columns, startCol: columnName, endCol: columnName});
				if(null !== tableRange)
				{
					for(var i = tableRange.r1; i <= tableRange.r2; i++)
					{
						var cell = worksheet.getCell3(i, tableRange.c1);
						var format = cell.getNumFormat();
						var sFromatString = format.sFormat;
						var type = format ? format.getType : null;
						
						if(null !== type)
						{	
							res = true;
							if(!arrFormat[sFromatString])
							{
								arrFormat[sFromatString] = 0;
							}
							arrFormat[sFromatString]++;
						}
					}
				}
				
				if(res)
				{
					var maxCount = 0;
					for(var i in arrFormat)
					{
						if(arrFormat[i] > maxCount)
						{
							maxCount = arrFormat[i];
							res = i;
						}
					}
				}
				
				return res;
			},
			
			_cleanStyleTable : function(sRef)
			{
				var oRange = new AscCommonExcel.Range(this.worksheet, sRef.r1, sRef.c1, sRef.r2, sRef.c2);
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
				var worksheet = this.worksheet;
				
				var diffCol = arnTo.c1 - arnFrom.c1;
				var diffRow = arnTo.r1 - arnFrom.r1;
				
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
							if(worksheet.AutoFilter && worksheet.AutoFilter.Ref && newRange.intersection(worksheet.AutoFilter.Ref) && worksheet.AutoFilter !== findFilters[i])
							{
								this.deleteAutoFilter(worksheet.AutoFilter.Ref);
							}
							
							//если область вставки содержит форматированную таблицу, которая пересекается с вставляемой форматированной таблицей
							var findFiltersFromTo = this._intersectionRangeWithTableParts(newRange , arnFrom);
							if(findFiltersFromTo && findFiltersFromTo.length)//удаляем данный фильтр
							{
								this.isEmptyAutoFilters(ref);
								continue;
							}
							
							this._openHiddenRows(findFilters[i]);
						}
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
					}
				}
			},
			
			_searchHiddenRowsByFilter: function(filter, range)
			{
				var ref = filter.Ref;
				var worksheet = this.worksheet;
				var intersection = filter.Ref.intersection(range);
				
				if(intersection && filter.isApplyAutoFilter())
				{
					for(var i = intersection.r1; i <= intersection.r2; i++)
					{
						if(worksheet.getRowHidden(i) === true)
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
				var worksheet = this.worksheet;
				range = Asc.Range(range.c1, range.r1, range.c2, range.r2);
				
				if(worksheet.AutoFilter && !bFindOnlyTableParts)
				{
					if(range.containsRange(worksheet.AutoFilter.Ref))
						result[result.length] = worksheet.AutoFilter;
				}
				
				if(worksheet.TableParts)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						if(worksheet.TableParts[i])
						{
							if(range.containsRange(worksheet.TableParts[i].Ref))
								result[result.length] = worksheet.TableParts[i];
						}
					}
				}
				
				if(!result.length)
					result = false;
				
				return result;
			},
			
			_searchRangeInFilters: function(range)//find filters in this range
			{
				var result = null;
				var worksheet = this.worksheet;
				
				if(worksheet.AutoFilter)
				{
					if(worksheet.AutoFilter.Ref.containsRange(range))
					{
						result = worksheet.AutoFilter;
					}
					else if(worksheet.AutoFilter.Ref.intersection(range))
					{
						result = false;
					}
				}
				
				if(worksheet.TableParts && null === result)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						if(worksheet.TableParts[i])
						{
							if(worksheet.TableParts[i].Ref.containsRange(range))
							{
								result = worksheet.TableParts[i];
								break;
							}
						}
					}
				}
				
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
			
			_intersectionRangeWithTableParts: function(range, exceptionRange)//находим фильтры, находящиеся в данном range
			{
				var result = [];
				var rangeFilter;
                var worksheet = this.worksheet;

				if(worksheet.TableParts)
				{
					for(var k = 0; k < worksheet.TableParts.length; k++)
					{
						if(worksheet.TableParts[k])
						{
							rangeFilter = worksheet.TableParts[k].Ref;
							//TODO пересмотреть условие range.r1 === rangeFilter.r1 && range.c1 === rangeFilter.c1
							if(range.intersection(rangeFilter) && !(range.containsRange(rangeFilter) && !(range.r1 === rangeFilter.r1 && range.c1 === rangeFilter.c1)))
							{
								if(!exceptionRange || !(exceptionRange && exceptionRange.containsRange(rangeFilter)))
									result[result.length] = worksheet.TableParts[k];
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
				var worksheet = this.worksheet;
				var findFilters = this._searchFiltersInRange(arnFrom);
				var bUndoRedoChanges = worksheet.workbook.bUndoChanges || worksheet.workbook.bRedoChanges;
				
				if(findFilters && findFilters.length)
				{
					var diffCol = arnTo.c1 - arnFrom.c1;
					var diffRow = arnTo.r1 - arnFrom.r1;
					var offset = {offsetCol: diffCol, offsetRow: diffRow};
					var newRange, ref, bWithoutFilter;
					
					for(var i = 0; i < findFilters.length; i++)
					{
						if(findFilters[i].TableStyleInfo)
						{
							ref = findFilters[i].Ref;
							newRange = Asc.Range(ref.c1 + diffCol, ref.r1 + diffRow, ref.c2 + diffCol, ref.r2 + diffRow);
							bWithoutFilter = findFilters[i].AutoFilter === null;
							
							if(!ref.intersection(newRange) && !this._intersectionRangeWithTableParts(newRange, arnFrom))
							{
								//TODO позже не копировать стиль при перемещении всей таблицы
								if(!bUndoRedoChanges)
								{
									var cleanRange = new AscCommonExcel.Range(worksheet, newRange.r1, newRange.c1, newRange.r2, newRange.c2);
									cleanRange.cleanFormat();
								}
								this.addAutoFilter(findFilters[i].TableStyleInfo.Name, newRange, null, offLock, {tablePart: findFilters[i], offset: offset});
							}	
						}
					}
				}
			},
			
			//с учётом последних скрытых строк
			_activeRangeContainsTablePart: function(activeRange, tablePartRef)
			{
				var worksheet = this.worksheet;
				var res = false;
				
				if(activeRange.r1 === tablePartRef.r1 && activeRange.c1 === tablePartRef.c1 && activeRange.c2 === tablePartRef.c2 && activeRange.r2 < tablePartRef.r2)
				{
					res = true;
					for(var i = activeRange.r2 + 1; i <= tablePartRef.r2; i++)
					{
						if(!worksheet.getRowHidden(i))
						{
							res = false;
							break;
						}
					}
				}
				
				return res;
			},
			
			_cleanFilterColumnsAndSortState: function(autoFilterElement, activeCells)
			{
				var worksheet = this.worksheet;
				var oldFilter = autoFilterElement.clone(null);
				
				if(autoFilterElement.SortState)
					autoFilterElement.SortState = null;
				
				worksheet.setRowHidden(false, autoFilterElement.Ref.r1, autoFilterElement.Ref.r2);
				
				if(autoFilterElement.AutoFilter && autoFilterElement.AutoFilter.FilterColumns)
				{
					autoFilterElement.AutoFilter.FilterColumns = null;
				}
				else if(autoFilterElement.FilterColumns)
				{
					autoFilterElement.FilterColumns = null;
				}
				
				this._addHistoryObj(oldFilter, AscCH.historyitem_AutoFilter_CleanAutoFilter, {activeCells: activeCells}, null, activeCells);

				this._resetTablePartStyle();
				
				return oldFilter.Ref;
			},
			
			clearFilterColumn: function(cellId, displayName)
			{
				var filter = this._getFilterByDisplayName(displayName);
				var autoFilter = filter && false === filter.isAutoFilter() ? filter.AutoFilter : filter;
				
				var oldFilter = filter.clone(null);
				
				var colId = this._getColIdColumn(filter, cellId);
				
				History.Create_NewPoint();
				History.StartTransaction();
				
				if(colId !== null)
				{
					var index = this._getIndexByColId(autoFilter, colId);
					this._openHiddenRowsAfterDeleteColumn(autoFilter, colId);
					
					autoFilter.FilterColumns.splice(index, 1);
					
					this._resetTablePartStyle();
				}
				
				this._addHistoryObj(oldFilter, AscCH.historyitem_AutoFilter_ClearFilterColumn, {cellId: cellId, displayName: displayName, activeCells: filter.Ref}, null, filter.Ref);
				
				History.EndTransaction();
				
				return filter.Ref;
			},
			
			_checkValueInCells: function(n, k, cloneActiveRange)
			{
				var worksheet = this.worksheet;
				var cell = worksheet.getRange3(n, k, n, k);
				var isEmptyCell = cell.isEmptyText();
				var isEnd = true, merged, valueMerg;
				
				//если мерженная ячейка
				if(isEmptyCell)
				{
					merged = cell.hasMerged();
					valueMerg = null;
					if(merged)
					{
						valueMerg = worksheet.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
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
				var res = null;
				var filters;
				if(autoFilter && autoFilter.FilterColumns)
				{
					filters = autoFilter.FilterColumns;
					for(var k = 0; k < filters.length; k++)
					{
						if(filters[k].ColId == colId)
						{
							res = filters[k];
							break;
						}
					}
				}
				return res;
			},
			
			_isEmptyCellsUnderRange: function(range)
			{
				//если есть ячейки с непустыми значениями под активной областью, то возвращаем false
				var cell, isEmptyCell, result = true;
				var worksheet = this.worksheet;
				
				for(var i = range.c1; i <= range.c2; i++)
				{
					cell = worksheet.getRange3(range.r2 + 1, i, range.r2 + 1, i);
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
				var worksheet = this.worksheet;
				var result = false;
				
				if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var tableRef = worksheet.TableParts[i].Ref;
						if(tableRef.r1 >= range.r2)
						{
							if(tableRef.c1 < range.c1 && tableRef.c2 > range.c1 && tableRef.c2 <= range.c2)
							{
								result = true;
								break;
							}
							else if(tableRef.c1 >= range.c1 && tableRef.c1 < range.c2 && tableRef.c2 > range.c2)
							{
								result = true;
								break;
							}
							else if((tableRef.c1 <= range.c1 && tableRef.c2 > range.c2) || (tableRef.c1 < range.c1 && tableRef.c2 >= range.c2))
							{
								result = true;
								break;
							}
						}
					}
				}
				
				return result;
			},
			
			isPartTablePartsRightRange: function(range)
			{
				var worksheet = this.worksheet;
				var result = false;
				
				if(worksheet.TableParts && worksheet.TableParts.length)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var tableRef = worksheet.TableParts[i].Ref;
						
						if(tableRef.c1 >= range.c2)
						{
							if(tableRef.r1 < range.r1 && tableRef.r2 > range.r1 && tableRef.r2 <= range.r2)
							{
								result = true;
								break;
							}
							else if(tableRef.r1 >= range.r1 && tableRef.r1 < range.r2 && tableRef.r2 > range.r2)
							{
								result = true;
								break;
							}
							else if((tableRef.r1 <= range.r1 && tableRef.r2 > range.r2) || (tableRef.r1 < range.r1 && tableRef.r2 >= range.r2))
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
				var worksheet = this.worksheet;
				var result = false;
				
				if(worksheet.AutoFilter)
				{
					if((worksheet.AutoFilter.Ref.c1 < range.c1 || worksheet.AutoFilter.Ref.c2 > range.c2) && worksheet.AutoFilter.Ref.r1 >= range.r2)
					{
						result = true;
					}
				}
				
				return result;
			},
			
			_isEmptyRange: function(ar, addDelta)
			{
				var range = this.worksheet.getRange3(Math.max(0, ar.r1 - addDelta), Math.max(0, ar.c1 - addDelta), ar.r2 + addDelta, ar.c2 + addDelta);
				var res = true;
				range._foreachNoEmpty(function (cell) {
					if (!cell.isEmptyText()) {
						res = false;
						return true;
					}
				});
				return res;
			},
			
			_setStyleTables: function(range)
			{
				var worksheet = this.worksheet;
				if(worksheet.TableParts && worksheet.TableParts.length > 0)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var ref = worksheet.TableParts[i].Ref;
						if(ref.r1 >= range.r1 && ref.r2 <= range.r2)
							this._setColorStyleTable(ref, worksheet.TableParts[i]);
					}
				}
			},
			
			resetTableStyles: function(range)
			{
				var worksheet = this.worksheet;
				
				if(worksheet.TableParts && worksheet.TableParts.length > 0)
				{
					for(var i = 0; i < worksheet.TableParts.length; i++)
					{
						var ref = worksheet.TableParts[i].Ref;
						if(ref.isIntersect(range))
						{
							this._setColorStyleTable(ref, worksheet.TableParts[i]);
						}
					}
				}
			},
			
			_generateColumnName2: function(tableColumns)
			{
				// ToDo почему 2 функции generateColumnName?
				var columnName = "Column";
				//var indexColumn = name[1]; name - не определено!
				var indexColumn = undefined;
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
			},

			_getFilterInfoByAddTableProps: function(ar, addFormatTableOptionsObj)
			{
				var tempRange =  new Asc.Range(ar.c1, ar.r1, ar.c2, ar.r2);
				var addNameColumn, filterRange, bIsManualOptions = false;

				if(addFormatTableOptionsObj === false)
				{
					addNameColumn = true;
				}
				else if(addFormatTableOptionsObj && typeof addFormatTableOptionsObj == 'object')
				{
					tempRange = addFormatTableOptionsObj.asc_getRange();
					addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
					tempRange = AscCommonExcel.g_oRangeCache.getAscRange(tempRange).clone();
					bIsManualOptions = true;
				}
				else if(addFormatTableOptionsObj === true)
				{
					addNameColumn = false;
				}

				//expand range
				var tablePartsContainsRange = this._isTablePartsContainsRange(tempRange);
				if(tablePartsContainsRange)
				{
					filterRange = tablePartsContainsRange.Ref.clone();
				}
				else if(tempRange.isOneCell() && !bIsManualOptions)
				{
					filterRange = this._getAdjacentCellsAF(tempRange, this.worksheet);
				}
				else
				{
					filterRange = tempRange;
				}

				var rangeWithoutDiff = filterRange.clone();
				if(addNameColumn)
				{
					filterRange.r2 = filterRange.r2 + 1;
				}
				
				return {filterRange: filterRange, addNameColumn: addNameColumn, rangeWithoutDiff: rangeWithoutDiff, tablePartsContainsRange: tablePartsContainsRange};
			}
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].AutoFilters				= AutoFilters;
		
		window["Asc"]["AutoFiltersOptions"]		= window["Asc"].AutoFiltersOptions = AutoFiltersOptions;
		prot									= AutoFiltersOptions.prototype;
		prot["asc_setSortState"]				= prot.asc_setSortState;
		prot["asc_getSortState"]				= prot.asc_getSortState;
		prot["asc_getValues"]					= prot.asc_getValues;
		prot["asc_getFilterObj"]				= prot.asc_getFilterObj;
		prot["asc_getCellId"]					= prot.asc_getCellId;
        prot["asc_getCellCoord"]				= prot.asc_getCellCoord;
		prot["asc_getDisplayName"]				= prot.asc_getDisplayName;
        prot["asc_getIsTextFilter"]				= prot.asc_getIsTextFilter;
        prot["asc_getColorsFill"]				= prot.asc_getColorsFill;
        prot["asc_getColorsFont"]				= prot.asc_getColorsFont;
        prot["asc_getSortColor"]				= prot.asc_getSortColor;
		prot["asc_setFilterObj"]				= prot.asc_setFilterObj;
		
		window["Asc"]["AutoFilterObj"]		    = window["Asc"].AutoFilterObj = AutoFilterObj;
		prot									= AutoFilterObj.prototype;
		prot["asc_getType"]						= prot.asc_getType;
		prot["asc_setFilter"]					= prot.asc_setFilter;
		prot["asc_setType"]						= prot.asc_setType;
		prot["asc_getFilter"]					= prot.asc_getFilter;
		
		window["Asc"]["AdvancedTableInfoSettings"] = window["Asc"].AdvancedTableInfoSettings = AdvancedTableInfoSettings;
		prot									= AdvancedTableInfoSettings.prototype;
		prot["asc_getTitle"]					= prot.asc_getTitle;
		prot["asc_getDescription"]				= prot.asc_getDescription;
		prot["asc_setTitle"]					= prot.asc_setTitle;
		prot["asc_setDescription"]				= prot.asc_setDescription;
		
		window["AscCommonExcel"].AutoFiltersOptionsElements = AutoFiltersOptionsElements;
		prot									= AutoFiltersOptionsElements.prototype;
		prot["asc_getText"]						= prot.asc_getText;
		prot["asc_getVisible"]					= prot.asc_getVisible;
		prot["asc_setVisible"]					= prot.asc_setVisible;
		
		window["AscCommonExcel"].AddFormatTableOptions = AddFormatTableOptions;
		prot									= AddFormatTableOptions.prototype;
		prot["asc_getRange"]					= prot.asc_getRange;
		prot["asc_getIsTitle"]					= prot.asc_getIsTitle;
		prot["asc_setRange"]					= prot.asc_setRange;
		prot["asc_setIsTitle"]					= prot.asc_setIsTitle;

		window["AscCommonExcel"].formatTablePictures = formatTablePictures;
		prot									= formatTablePictures.prototype;
		prot["asc_getName"]					   	= prot.asc_getName;
		prot["asc_getDisplayName"]				= prot.asc_getDisplayName;
		prot["asc_getType"]						= prot.asc_getType;
		prot["asc_getImage"]					= prot.asc_getImage;
	}
)(window);
