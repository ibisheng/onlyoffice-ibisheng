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

var c_oSerFormat = {
  Version		: 1,
  Signature	: "PPTY"
};

var TABLE_STYLE_WIDTH_PIX = 70;
var TABLE_STYLE_HEIGHT_PIX = 50;

//------------------------------------------------------------export---------------------------------------------------
var prot;
window['Asc'] = window['Asc'] || {};
window['Asc']['c_oAscCollaborativeMarksShowType'] = c_oAscCollaborativeMarksShowType;
prot = c_oAscCollaborativeMarksShowType;
prot['All'] = prot.All;
prot['LastChanges'] = prot.LastChanges;
window['Asc']['c_oAscVertAlignJc'] = c_oAscVertAlignJc;
prot = c_oAscVertAlignJc;
prot['Top'] = prot.Top;
prot['Center'] = prot.Center;
prot['Bottom'] = prot.Bottom;
window['Asc']['c_oAscContextMenuTypes'] = c_oAscContextMenuTypes;
prot = c_oAscContextMenuTypes;
prot['Main'] = prot.Main;
prot['Thumbnails'] = prot.Thumbnails;
window['Asc']['c_oAscAlignShapeType'] = c_oAscAlignShapeType;
prot = c_oAscAlignShapeType;
prot['ALIGN_LEFT'] = prot.ALIGN_LEFT;
prot['ALIGN_RIGHT'] = prot.ALIGN_RIGHT;
prot['ALIGN_TOP'] = prot.ALIGN_TOP;
prot['ALIGN_BOTTOM'] = prot.ALIGN_BOTTOM;
prot['ALIGN_CENTER'] = prot.ALIGN_CENTER;
prot['ALIGN_MIDDLE'] = prot.ALIGN_MIDDLE;
window['Asc']['c_oAscTableLayout'] = c_oAscTableLayout;
prot = c_oAscTableLayout;
prot['AutoFit'] = prot.AutoFit;
prot['Fixed'] = prot.Fixed;
window['Asc']['c_oAscSlideTransitionTypes'] = c_oAscSlideTransitionTypes;
prot = c_oAscSlideTransitionTypes;
prot['None'] = prot.None;
prot['Fade'] = prot.Fade;
prot['Push'] = prot.Push;
prot['Wipe'] = prot.Wipe;
prot['Split'] = prot.Split;
prot['UnCover'] = prot.UnCover;
prot['Cover'] = prot.Cover;
prot['Clock'] = prot.Clock;
prot['Zoom'] = prot.Zoom;
window['Asc']['c_oAscSlideTransitionParams'] = c_oAscSlideTransitionParams;
prot = c_oAscSlideTransitionParams;
prot['Fade_Smoothly'] = prot.Fade_Smoothly;
prot['Fade_Through_Black'] = prot.Fade_Through_Black;
prot['Param_Left'] = prot.Param_Left;
prot['Param_Top'] = prot.Param_Top;
prot['Param_Right'] = prot.Param_Right;
prot['Param_Bottom'] = prot.Param_Bottom;
prot['Param_TopLeft'] = prot.Param_TopLeft;
prot['Param_TopRight'] = prot.Param_TopRight;
prot['Param_BottomLeft'] = prot.Param_BottomLeft;
prot['Param_BottomRight'] = prot.Param_BottomRight;
prot['Split_VerticalIn'] = prot.Split_VerticalIn;
prot['Split_VerticalOut'] = prot.Split_VerticalOut;
prot['Split_HorizontalIn'] = prot.Split_HorizontalIn;
prot['Split_HorizontalOut'] = prot.Split_HorizontalOut;
prot['Clock_Clockwise'] = prot.Clock_Clockwise;
prot['Clock_Counterclockwise'] = prot.Clock_Counterclockwise;
prot['Clock_Wedge'] = prot.Clock_Wedge;
prot['Zoom_In'] = prot.Zoom_In;
prot['Zoom_Out'] = prot.Zoom_Out;
prot['Zoom_AndRotate'] = prot.Zoom_AndRotate;

window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].c_oSerFormat = c_oSerFormat;
window['AscCommon'].CurFileVersion = c_oSerFormat.Version;
