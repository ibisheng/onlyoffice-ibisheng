"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Используем [] вместо new Array() для ускорения (http://jsperf.com/creation-array)
// Используем {} вместо new Object() для ускорения (http://jsperf.com/creation-object)
var c_oAscError = {
  Level: {
    Critical: -1,
    NoCritical: 0
  },
  ID: {
    ServerSaveComplete: 3,
    ConvertationProgress: 2,
    DownloadProgress: 1,
    No: 0,
    Unknown: -1,
    ConvertationTimeout: -2,
    ConvertationError: -3,
    DownloadError: -4,
    UnexpectedGuid: -5,
    Database: -6,
    FileRequest: -7,
    FileVKey: -8,
    UplImageSize: -9,
    UplImageExt: -10,
    UplImageFileCount: -11,
    NoSupportClipdoard: -12,
    PastInMergeAreaError: -13,
    StockChartError: -14,
    DataRangeError: -15,
    CannotMoveRange: -16,
    UplImageUrl: -17,
    CoAuthoringDisconnect: -18,
    ConvertationPassword: -19,

    VKeyEncrypt: -20,
    KeyExpire: -21,
    UserCountExceed: -22,

    /* для формул */
    FrmlWrongCountParentheses: -300,
    FrmlWrongOperator: -301,
    FrmlWrongMaxArgument: -302,
    FrmlWrongCountArgument: -303,
    FrmlWrongFunctionName: -304,
    FrmlAnotherParsingError: -305,
    FrmlWrongArgumentRange: -306,
    FrmlOperandExpected: -307,
    FrmlParenthesesCorrectCount: -308,
    FrmlWrongReferences: -309,

    InvalidReferenceOrName: -310,
    LockCreateDefName: -311,


    AutoFilterDataRangeError: -50,
    AutoFilterChangeFormatTableError: -51,
    AutoFilterChangeError: -52,
    AutoFilterMoveToHiddenRangeError: -53,
    LockedAllError: -54,
    LockedWorksheetRename: -55,

    PasteMaxRangeError: -65,

    MaxDataSeriesError: -80,
    CannotFillRange: -81,

    UserDrop: -100,
    Warning: -101,

    OpenWarning: 500
  }
};
var c_oAscConfirm = {
  ConfirmReplaceRange: 0
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

var c_oAscInsertOptions = {
  InsertCellsAndShiftRight: 1,
  InsertCellsAndShiftDown: 2,
  InsertColumns: 3,
  InsertRows: 4
};

var c_oAscDeleteOptions = {
  DeleteCellsAndShiftLeft: 1,
  DeleteCellsAndShiftTop: 2,
  DeleteColumns: 3,
  DeleteRows: 4
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

// selection type
var c_oAscSelectionType = {
  RangeCells: 1,
  RangeCol: 2,
  RangeRow: 3,
  RangeMax: 4,
  RangeImage: 5,
  RangeChart: 6,
  RangeShape: 7,
  RangeShapeText: 8,
  RangeChartText: 9,
  RangeFrozen: 10
};

var c_oAscSelectionDialogType = {
  None: 0,
  FormatTable: 1,
  Chart: 2,
  DefinedName: 3
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

var c_oAscCoAuthoringMeBorderColor = new window["CColor"](22, 156, 0);
var c_oAscCoAuthoringOtherBorderColor = new window["CColor"](238, 53, 37);
var c_oAscCoAuthoringLockTablePropertiesBorderColor = new window["CColor"](255, 144, 0);
var c_oAscCoAuthoringDottedWidth = 4;
var c_oAscCoAuthoringDottedDistance = 2;

var c_oAscFormulaRangeBorderColor = [
  new window["CColor"](95, 140, 237),
  new window["CColor"](235, 94, 96),
  new window["CColor"](141, 97, 194),
  new window["CColor"](45, 150, 57),
  new window["CColor"](191, 76, 145),
  new window["CColor"](227, 130, 34),
  new window["CColor"](55, 127, 158)
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

  window['Asc'] = window['Asc'] || {};
  window['Asc']['c_oAscError'] = window['Asc'].c_oAscError = c_oAscError;
  window['Asc']['c_oAscConfirm'] = window['Asc'].c_oAscConfirm = c_oAscConfirm;
  window['Asc']['c_oAscMergeOptions'] = window['Asc'].c_oAscMergeOptions = c_oAscMergeOptions;
  window['Asc']['c_oAscInsertOptions'] = window['Asc'].c_oAscInsertOptions = c_oAscInsertOptions;
  window['Asc']['c_oAscDeleteOptions'] = window['Asc'].c_oAscDeleteOptions = c_oAscDeleteOptions;
  window['Asc']['c_oAscBorderOptions'] = window['Asc'].c_oAscBorderOptions = c_oAscBorderOptions;
  window['Asc']['c_oAscCleanOptions'] = window['Asc'].c_oAscCleanOptions = c_oAscCleanOptions;
  window['Asc']['c_oAscSelectionType'] = window['Asc'].c_oAscSelectionType = c_oAscSelectionType;
  window['Asc']['c_oAscSelectionDialogType'] = window['Asc'].c_oAscSelectionDialogType = c_oAscSelectionDialogType;
  window['Asc']['c_oAscHyperlinkType'] = window['Asc'].c_oAscHyperlinkType = c_oAscHyperlinkType;
  window['Asc']['c_oAscMouseMoveType'] = window['Asc'].c_oAscMouseMoveType = c_oAscMouseMoveType;
  window['Asc']['c_oAscMouseMoveLockedObjectType'] = window['Asc'].c_oAscMouseMoveLockedObjectType = c_oAscMouseMoveLockedObjectType;
  window['Asc']['c_oAscPrintType'] = window['Asc'].c_oAscPrintType = c_oAscPrintType;
  window['Asc']['c_oAscCustomAutoFilter'] = window['Asc'].c_oAscCustomAutoFilter = c_oAscCustomAutoFilter;
  window['Asc']['c_oAscChangeFilterOptions'] = window['Asc'].c_oAscChangeFilterOptions = c_oAscChangeFilterOptions;
  window['Asc']['c_oAscCellEditorState'] = window['Asc'].c_oAscCellEditorState = c_oAscCellEditorState;
  window['Asc']['c_oAscAutoFilterTypes'] = window['Asc'].c_oAscAutoFilterTypes = c_oAscAutoFilterTypes;
  window['Asc']['c_oAscFindLookIn'] = window['Asc'].c_oAscFindLookIn = c_oAscFindLookIn;
  window['Asc']['c_oAscGetDefinedNamesList'] = window['Asc'].c_oAscGetDefinedNamesList = c_oAscGetDefinedNamesList;
  window['Asc']['c_oAscDefinedNameReason'] = window['Asc'].c_oAscDefinedNameReason = c_oAscDefinedNameReason;
  window['Asc']['c_oAscPopUpSelectorType'] = window['Asc'].c_oAscPopUpSelectorType = c_oAscPopUpSelectorType;
})(window);
