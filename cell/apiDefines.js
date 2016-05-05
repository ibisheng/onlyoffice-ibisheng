"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Используем [] вместо new Array() для ускорения (http://jsperf.com/creation-array)
// Используем {} вместо new Object() для ускорения (http://jsperf.com/creation-object)

  // Import
  var CColor = AscCommon.CColor;

var c_oAscConfirm = {
  ConfirmReplaceRange: 0,
  ConfirmPutMergeRange: 1
};

var c_oAscAlignType = {
  NONE: "none",
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
  JUSTIFY: "justify",
  TOP: "top",
  MIDDLE: "center",
  BOTTOM: "bottom"
};

var c_oAscMergeOptions = {
  Unmerge: 0,
  Merge: 1,
  MergeCenter: 2,
  MergeAcross: 3
};

var c_oAscSortOptions = {
  Ascending: 1,
  Descending: 2
};

var c_oAscBorderOptions = {
  Top: 0,
  Right: 1,
  Bottom: 2,
  Left: 3,
  DiagD: 4,
  DiagU: 5,
  InnerV: 6,
  InnerH: 7
};

var c_oAscCleanOptions = {
  All: 0,
  Text: 1,
  Format: 2,
  Formula: 4,
  Comments: 5,
  Hyperlinks: 6
};

var c_oAscDrawDepOptions = {
  Master: 0,
  Slave: 1,
  Clear: 2
};

var c_oAscSelectionDialogType = {
  None: 0,
  FormatTable: 1,
  Chart: 2,
  DefinedName: 3,
  FormatTableChangeRange: 4
};

var c_oAscGraphicOption = {
  ScrollVertical: 1,
  ScrollHorizontal: 2
};

var c_oAscHyperlinkType = {
  WebLink: 1,
  RangeLink: 2
};

var c_oAscMouseMoveType = {
  None: 0,
  Hyperlink: 1,
  Comment: 2,
  LockedObject: 3,
  ResizeColumn: 4,
  ResizeRow: 5
};

var c_oAscMouseMoveLockedObjectType = {
  None: -1,
  Range: 0,
  TableProperties: 1,
  Sheet: 2
};



var c_oAscLockTypeElem = {
  Range: 1,
  Object: 2,
  Sheet: 3
};

var c_oAscLockTypeElemSubType = {
  DeleteColumns: 1,
  InsertColumns: 2,
  DeleteRows: 3,
  InsertRows: 4,
  ChangeProperties: 5,
  DefinedNames: 6
};

var c_oAscRecalcIndexTypes = {
  RecalcIndexAdd: 1,
  RecalcIndexRemove: 2
};

// Тип печати
var c_oAscPrintType = {
  ActiveSheets: 0,	// Активные листы
  EntireWorkbook: 1,	// Всю книгу
  Selection: 2		// Выделенный фрагмент
};

/** @enum */
var c_oAscCustomAutoFilter = {
  equals: 1,
  isGreaterThan: 2,
  isGreaterThanOrEqualTo: 3,
  isLessThan: 4,
  isLessThanOrEqualTo: 5,
  doesNotEqual: 6,
  beginsWith: 7,
  doesNotBeginWith: 8,
  endsWith: 9,
  doesNotEndWith: 10,
  contains: 11,
  doesNotContain: 12
};

var c_oAscChangeFilterOptions = {
  filter: 1,
  style: 2
};

var c_oAscChangeSelectionFormatTable = {
    all: 1,
    data: 2,
    row: 3,
    column: 4
};

var c_oAscChangeTableStyleInfo = {
    columnFirst: 1,
    columnLast: 2,
    columnBanded: 3,
    rowHeader: 4,
    rowTotal: 5,
    rowBanded: 6,
	filterButton: 7
};

// Состояние редактора ячейки
var c_oAscCellEditorState = {
  editEnd: 0,				// Окончание редактирования
  editStart: 1,				// Начало редактирования
  editEmptyCell: 2,				// Редактирование пустой ячейки (доступны функции и свойства текста)
  editText: 3,				// Редактирование текста, числа, даты и др. формата, кроме формулы
  editFormula: 4				// Редактирование формулы
};

// Состояние select-а
var c_oAscCellEditorSelectState = {
  no    : 0,
  char  : 1,
  word  : 2
};

// Пересчитывать ли ширину столбца
var c_oAscCanChangeColWidth = {
  none: 0,	// not recalc
  numbers: 1,	// only numbers
  all: 2	// numbers + text
};

var c_oAscPaneState = {
  Frozen: "frozen",
  FrozenSplit: "frozenSplit"
};

var c_oAscFindLookIn = {
  Formulas: 1,
  Value: 2,
  Annotations: 3
};

var c_oTargetType = {
  None: 0,
  ColumnResize: 1,
  RowResize: 2,
  FillHandle: 3,
  MoveRange: 4,
  MoveResizeRange: 5,
  FilterObject: 6,
  ColumnHeader: 7,
  RowHeader: 8,
  Corner: 9,
  Hyperlink: 10,
  Cells: 11,
  Shape: 12,
  FrozenAnchorH: 14,
  FrozenAnchorV: 15
};

var c_oAscAutoFilterTypes = {
  ColorFilter: 0,
  CustomFilters: 1,
  DynamicFilter: 2,
  Top10: 3,
  Filters: 4
};

var c_oAscCoAuthoringMeBorderColor = new CColor(22, 156, 0);
var c_oAscCoAuthoringOtherBorderColor = new CColor(238, 53, 37);
var c_oAscCoAuthoringLockTablePropertiesBorderColor = new CColor(255, 144, 0);
var c_oAscCoAuthoringDottedWidth = 4;
var c_oAscCoAuthoringDottedDistance = 2;

var c_oAscFormulaRangeBorderColor = [
  new CColor(95, 140, 237),
  new CColor(235, 94, 96),
  new CColor(141, 97, 194),
  new CColor(45, 150, 57),
  new CColor(191, 76, 145),
  new CColor(227, 130, 34),
  new CColor(55, 127, 158)
];

var c_oAscLockNameFrozenPane = "frozenPane";
var c_oAscLockNameTabColor = "tabColor";

var c_oAscGetDefinedNamesList = {
  Worksheet: 0,
  WorksheetWorkbook: 1,
  All: 2
};

var c_oAscDefinedNameReason = {
  WrongName: -1,
  IsLocked: -2,
  Existed: -3,
  LockDefNameManager: -4,
  NameReserved: -5,
  OK: 0
};

var c_oAscPopUpSelectorType = {
  None: 0,
  Func: 1,
  Range: 2,
  Table: 3
};
  /** @enum */
  var c_oSerFormat = {
    Version		: 2, //1.0.0.2
    Signature	: "XLSY"
  };

  //----------------------------------------------------------export----------------------------------------------------
  window['AscCommonExcel'] = window['AscCommonExcel'] || {};
  window['AscCommonExcel'].c_oAscAlignType = c_oAscAlignType;
  window['AscCommonExcel'].c_oAscSortOptions = c_oAscSortOptions;
  window['AscCommonExcel'].c_oAscDrawDepOptions = c_oAscDrawDepOptions;
  window['AscCommonExcel'].c_oAscGraphicOption = c_oAscGraphicOption;
  window['AscCommonExcel'].c_oAscLockTypeElem = c_oAscLockTypeElem;
  window['AscCommonExcel'].c_oAscLockTypeElemSubType = c_oAscLockTypeElemSubType;
  window['AscCommonExcel'].c_oAscRecalcIndexTypes = c_oAscRecalcIndexTypes;
  window['AscCommonExcel'].c_oAscCellEditorSelectState = c_oAscCellEditorSelectState;
  window['AscCommonExcel'].c_oAscCanChangeColWidth = c_oAscCanChangeColWidth;
  window['AscCommonExcel'].c_oAscPaneState = c_oAscPaneState;
  window['AscCommonExcel'].c_oTargetType = c_oTargetType;
  window['AscCommonExcel'].c_oAscCoAuthoringMeBorderColor = c_oAscCoAuthoringMeBorderColor;
  window['AscCommonExcel'].c_oAscCoAuthoringOtherBorderColor = c_oAscCoAuthoringOtherBorderColor;
  window['AscCommonExcel'].c_oAscCoAuthoringLockTablePropertiesBorderColor = c_oAscCoAuthoringLockTablePropertiesBorderColor;
  window['AscCommonExcel'].c_oAscCoAuthoringDottedWidth = c_oAscCoAuthoringDottedWidth;
  window['AscCommonExcel'].c_oAscCoAuthoringDottedDistance = c_oAscCoAuthoringDottedDistance;
  window['AscCommonExcel'].c_oAscFormulaRangeBorderColor = c_oAscFormulaRangeBorderColor;
  window['AscCommonExcel'].c_oAscLockNameFrozenPane = c_oAscLockNameFrozenPane;
  window['AscCommonExcel'].c_oAscLockNameTabColor = c_oAscLockNameTabColor;

  window['AscCommon'] = window['AscCommon'] || {};
  window['AscCommon'].c_oSerFormat = c_oSerFormat;
  window['AscCommon'].CurFileVersion = c_oSerFormat.Version;

  var prot;
  window['Asc'] = window['Asc'] || {};
  window['Asc']['c_oAscConfirm'] = window['Asc'].c_oAscConfirm = c_oAscConfirm;
  prot = c_oAscConfirm;
  prot['ConfirmReplaceRange'] = prot.ConfirmReplaceRange;
  prot['ConfirmPutMergeRange'] = prot.ConfirmPutMergeRange;
  window['Asc']['c_oAscMergeOptions'] = window['Asc'].c_oAscMergeOptions = c_oAscMergeOptions;
  prot = c_oAscMergeOptions;
  prot['Unmerge'] = prot.Unmerge;
  prot['Merge'] = prot.Merge;
  prot['MergeCenter'] = prot.MergeCenter;
  prot['MergeAcross'] = prot.MergeAcross;
  window['Asc']['c_oAscBorderOptions'] = window['Asc'].c_oAscBorderOptions = c_oAscBorderOptions;
  prot = c_oAscBorderOptions;
  prot['Top'] = prot.Top;
  prot['Right'] = prot.Right;
  prot['Bottom'] = prot.Bottom;
  prot['Left'] = prot.Left;
  prot['DiagD'] = prot.DiagD;
  prot['DiagU'] = prot.DiagU;
  prot['InnerV'] = prot.InnerV;
  prot['InnerH'] = prot.InnerH;
  window['Asc']['c_oAscCleanOptions'] = window['Asc'].c_oAscCleanOptions = c_oAscCleanOptions;
  prot = c_oAscCleanOptions;
  prot['All'] = prot.All;
  prot['Text'] = prot.Text;
  prot['Format'] = prot.Format;
  prot['Formula'] = prot.Formula;
  prot['Comments'] = prot.Comments;
  prot['Hyperlinks'] = prot.Hyperlinks;
  window['Asc']['c_oAscSelectionDialogType'] = window['Asc'].c_oAscSelectionDialogType = c_oAscSelectionDialogType;
  prot = c_oAscSelectionDialogType;
  prot['None'] = prot.None;
  prot['FormatTable'] = prot.FormatTable;
  prot['Chart'] = prot.Chart;
  prot['DefinedName'] = prot.DefinedName;
  prot['FormatTableChangeRange'] = prot.FormatTableChangeRange;
  window['Asc']['c_oAscHyperlinkType'] = window['Asc'].c_oAscHyperlinkType = c_oAscHyperlinkType;
  prot = c_oAscHyperlinkType;
  prot['WebLink'] = prot.WebLink;
  prot['RangeLink'] = prot.RangeLink;
  window['Asc']['c_oAscMouseMoveType'] = window['Asc'].c_oAscMouseMoveType = c_oAscMouseMoveType;
  prot = c_oAscMouseMoveType;
  prot['None'] = prot.None;
  prot['Hyperlink'] = prot.Hyperlink;
  prot['Comment'] = prot.Comment;
  prot['LockedObject'] = prot.LockedObject;
  prot['ResizeColumn'] = prot.ResizeColumn;
  prot['ResizeRow'] = prot.ResizeRow;
  window['Asc']['c_oAscMouseMoveLockedObjectType'] = window['Asc'].c_oAscMouseMoveLockedObjectType = c_oAscMouseMoveLockedObjectType;
  prot = c_oAscMouseMoveLockedObjectType;
  prot['None'] = prot.None;
  prot['Range'] = prot.Range;
  prot['TableProperties'] = prot.TableProperties;
  prot['Sheet'] = prot.Sheet;
  window['Asc']['c_oAscPrintType'] = window['Asc'].c_oAscPrintType = c_oAscPrintType;
  prot = c_oAscPrintType;
  prot['ActiveSheets'] = prot.ActiveSheets;
  prot['EntireWorkbook'] = prot.EntireWorkbook;
  prot['Selection'] = prot.Selection;
  window['Asc']['c_oAscCustomAutoFilter'] = window['Asc'].c_oAscCustomAutoFilter = c_oAscCustomAutoFilter;
  prot = c_oAscCustomAutoFilter;
  prot['equals'] = prot.equals;
  prot['isGreaterThan'] = prot.isGreaterThan;
  prot['isGreaterThanOrEqualTo'] = prot.isGreaterThanOrEqualTo;
  prot['isLessThan'] = prot.isLessThan;
  prot['isLessThanOrEqualTo'] = prot.isLessThanOrEqualTo;
  prot['doesNotEqual'] = prot.doesNotEqual;
  prot['beginsWith'] = prot.beginsWith;
  prot['doesNotBeginWith'] = prot.doesNotBeginWith;
  prot['endsWith'] = prot.endsWith;
  prot['doesNotEndWith'] = prot.doesNotEndWith;
  prot['contains'] = prot.contains;
  prot['doesNotContain'] = prot.doesNotContain;
  window['Asc']['c_oAscChangeFilterOptions'] = window['Asc'].c_oAscChangeFilterOptions = c_oAscChangeFilterOptions;
  prot = c_oAscChangeFilterOptions;
  prot['filter'] = prot.filter;
  prot['style'] = prot.style;
  window['Asc']['c_oAscCellEditorState'] = window['Asc'].c_oAscCellEditorState = c_oAscCellEditorState;
  prot = c_oAscCellEditorState;
  prot['editEnd'] = prot.editEnd;
  prot['editStart'] = prot.editStart;
  prot['editEmptyCell'] = prot.editEmptyCell;
  prot['editText'] = prot.editText;
  prot['editFormula'] = prot.editFormula;
  window['Asc']['c_oAscChangeSelectionFormatTable'] = window['Asc'].c_oAscChangeSelectionFormatTable = c_oAscChangeSelectionFormatTable;
  prot = c_oAscChangeSelectionFormatTable;
  prot['all'] = prot.all;
  prot['data'] = prot.data;
  prot['row'] = prot.row;
  prot['column'] = prot.column;
  window['Asc']['c_oAscChangeTableStyleInfo'] = window['Asc'].c_oAscChangeTableStyleInfo = c_oAscChangeTableStyleInfo;
  prot = c_oAscChangeTableStyleInfo;
  prot['columnFirst'] = prot.columnFirst;
  prot['columnLast'] = prot.columnLast;
  prot['columnBanded'] = prot.columnBanded;
  prot['rowHeader'] = prot.rowHeader;
  prot['rowTotal'] = prot.rowTotal;
  prot['rowBanded'] = prot.rowBanded;
  prot['filterButton'] = prot.filterButton;
  window['Asc']['c_oAscAutoFilterTypes'] = window['Asc'].c_oAscAutoFilterTypes = c_oAscAutoFilterTypes;
  prot = c_oAscAutoFilterTypes;
  prot['ColorFilter'] = prot.ColorFilter;
  prot['CustomFilters'] = prot.CustomFilters;
  prot['DynamicFilter'] = prot.DynamicFilter;
  prot['Top10'] = prot.Top10;
  prot['Filters'] = prot.Filters;
  window['Asc']['c_oAscFindLookIn'] = window['Asc'].c_oAscFindLookIn = c_oAscFindLookIn;
  prot = c_oAscFindLookIn;
  prot['Formulas'] = prot.Formulas;
  prot['Value'] = prot.Value;
  prot['Annotations'] = prot.Annotations;
  window['Asc']['c_oAscGetDefinedNamesList'] = window['Asc'].c_oAscGetDefinedNamesList = c_oAscGetDefinedNamesList;
  prot = c_oAscGetDefinedNamesList;
  prot['Worksheet'] = prot.Worksheet;
  prot['WorksheetWorkbook'] = prot.WorksheetWorkbook;
  prot['All'] = prot.All;
  window['Asc']['c_oAscDefinedNameReason'] = window['Asc'].c_oAscDefinedNameReason = c_oAscDefinedNameReason;
  prot = c_oAscDefinedNameReason;
  prot['WrongName'] = prot.WrongName;
  prot['IsLocked'] = prot.IsLocked;
  prot['Existed'] = prot.Existed;
  prot['LockDefNameManager'] = prot.LockDefNameManager;
  prot['NameReserved'] = prot.NameReserved;
  prot['OK'] = prot.OK;
  window['Asc']['c_oAscPopUpSelectorType'] = window['Asc'].c_oAscPopUpSelectorType = c_oAscPopUpSelectorType;
  prot = c_oAscPopUpSelectorType;
  prot['None'] = prot.None;
  prot['Func'] = prot.Func;
  prot['Range'] = prot.Range;
  prot['Table'] = prot.Table;
  window['Asc']['c_oAscChangeSelectionFormatTable'] = c_oAscChangeSelectionFormatTable;
  window['Asc']['c_oAscChangeTableStyleInfo'] = c_oAscChangeTableStyleInfo;
})(window);
