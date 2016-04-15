"use strict";

var c_oAscZoomType = {
  Current: 0,
  FitWidth: 1,
  FitPage: 2
};

var c_oAscCollaborativeMarksShowType = {
  All: 0,
  LastChanges: 1
};

var c_oAscVertAlignJc = {
  Top: 0x00, // var vertalignjc_Top    = 0x00;
  Center: 0x01, // var vertalignjc_Center = 0x01;
  Bottom: 0x02  // var vertalignjc_Bottom = 0x02
};

// Right = 0; Left = 1; Center = 2; Justify = 3;
var c_oAscAlignType = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
  JUSTIFY: 3,
  TOP: 4,
  MIDDLE: 5,
  BOTTOM: 6
};

/*Error level & ID*/
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
    StockChartError: -16,
    CoAuthoringDisconnect: -18,
    ConvertationPassword: -19,
    VKeyEncrypt: -20,
    KeyExpire: -21,
    UserCountExceed: -22,
    SplitCellMaxRows: -23,
    SplitCellMaxCols: -24,
    SplitCellRowsDivider: -25,

    UserDrop: -100,
    Warning: -101
  }
};


var c_oAscContextMenuTypes = {
  Main: 0,
  Thumbnails: 1
};

var THEME_THUMBNAIL_WIDTH = 180;
var THEME_THUMBNAIL_HEIGHT = 135;
var LAYOUT_THUMBNAIL_WIDTH = 180;
var LAYOUT_THUMBNAIL_HEIGHT = 135;

var c_oAscTableSelectionType = {
  Cell: 0,
  Row: 1,
  Column: 2,
  Table: 3
};

var c_oAscAlignShapeType = {
  ALIGN_LEFT: 0,
  ALIGN_RIGHT: 1,
  ALIGN_TOP: 2,
  ALIGN_BOTTOM: 3,
  ALIGN_CENTER: 4,
  ALIGN_MIDDLE: 5
};


var c_oAscTableLayout = {
  AutoFit: 0x00,
  Fixed: 0x01
};

var c_oAscMouseMoveDataTypes = {
  Common: 0,
  Hyperlink: 1,
  LockedObject: 2
};

var c_oAscSlideTransitionTypes = {
  None: 0,
  Fade: 1,
  Push: 2,
  Wipe: 3,
  Split: 4,
  UnCover: 5,
  Cover: 6,
  Clock: 7,
  Zoom: 8
};

var c_oAscSlideTransitionParams = {
  Fade_Smoothly: 0,
  Fade_Through_Black: 1,

  Param_Left: 0,
  Param_Top: 1,
  Param_Right: 2,
  Param_Bottom: 3,
  Param_TopLeft: 4,
  Param_TopRight: 5,
  Param_BottomLeft: 6,
  Param_BottomRight: 7,

  Split_VerticalIn: 8,
  Split_VerticalOut: 9,
  Split_HorizontalIn: 10,
  Split_HorizontalOut: 11,

  Clock_Clockwise: 0,
  Clock_Counterclockwise: 1,
  Clock_Wedge: 2,

  Zoom_In: 0,
  Zoom_Out: 1,
  Zoom_AndRotate: 2
};

var c_oAscLockTypeElemPresentation = {
  Object: 1,
  Slide: 2,
  Presentation: 3
};

var TABLE_STYLE_WIDTH_PIX = 70;
var TABLE_STYLE_HEIGHT_PIX = 50;

//------------------------------------------------------------export---------------------------------------------------
if (undefined === window['Asc']) {
  window['Asc'] = {};
}
window['Asc']['c_oAscCollaborativeMarksShowType'] = c_oAscCollaborativeMarksShowType;
window['Asc']['c_oAscVertAlignJc'] = c_oAscVertAlignJc;
window['Asc']['c_oAscTableLayout'] = c_oAscTableLayout;
window['Asc']['c_oAscError'] = window['Asc'].c_oAscError = c_oAscError;
window['Asc']['c_oAscContextMenuTypes'] = c_oAscContextMenuTypes;
window['Asc']['c_oAscAlignShapeType'] = c_oAscAlignShapeType;
window['Asc']['c_oAscSlideTransitionTypes'] = c_oAscSlideTransitionTypes;
window['Asc']['c_oAscSlideTransitionParams'] = c_oAscSlideTransitionParams;
