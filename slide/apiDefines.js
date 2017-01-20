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

/** @enum {number} */
var c_oAscZoomType = {
	Current  : 0,
	FitWidth : 1,
	FitPage  : 2
};

/** @enum {number} */
var c_oAscCollaborativeMarksShowType = {
	All         : 0,
	LastChanges : 1
};

/** @enum {number} */
var c_oAscVertAlignJc = {
	Top    : 0x00, // var vertalignjc_Top    = 0x00;
	Center : 0x01, // var vertalignjc_Center = 0x01;
	Bottom : 0x02  // var vertalignjc_Bottom = 0x02
};

/** @enum {number} */
var c_oAscAlignType = {
	LEFT    : 0,
	CENTER  : 1,
	RIGHT   : 2,
	JUSTIFY : 3,
	TOP     : 4,
	MIDDLE  : 5,
	BOTTOM  : 6
};

/** @enum {number} */
var c_oAscContextMenuTypes = {
	Main       : 0,
	Thumbnails : 1
};

var THEME_THUMBNAIL_WIDTH   = 180;
var THEME_THUMBNAIL_HEIGHT  = 135;
var LAYOUT_THUMBNAIL_WIDTH  = 180;
var LAYOUT_THUMBNAIL_HEIGHT = 135;

/** @enum {number} */
var c_oAscTableSelectionType = {
	Cell   : 0,
	Row    : 1,
	Column : 2,
	Table  : 3
};

/** @enum {number} */
var c_oAscAlignShapeType = {
	ALIGN_LEFT   : 0,
	ALIGN_RIGHT  : 1,
	ALIGN_TOP    : 2,
	ALIGN_BOTTOM : 3,
	ALIGN_CENTER : 4,
	ALIGN_MIDDLE : 5
};

/** @enum {number} */
var c_oAscTableLayout = {
	AutoFit : 0x00,
	Fixed   : 0x01
};

/** @enum {number} */
var c_oAscSlideTransitionTypes = {
	None    : 0,
	Fade    : 1,
	Push    : 2,
	Wipe    : 3,
	Split   : 4,
	UnCover : 5,
	Cover   : 6,
	Clock   : 7,
	Zoom    : 8
};

/** @enum {number} */
var c_oAscSlideTransitionParams = {
	Fade_Smoothly      : 0,
	Fade_Through_Black : 1,

	Param_Left        : 0,
	Param_Top         : 1,
	Param_Right       : 2,
	Param_Bottom      : 3,
	Param_TopLeft     : 4,
	Param_TopRight    : 5,
	Param_BottomLeft  : 6,
	Param_BottomRight : 7,

	Split_VerticalIn    : 8,
	Split_VerticalOut   : 9,
	Split_HorizontalIn  : 10,
	Split_HorizontalOut : 11,

	Clock_Clockwise        : 0,
	Clock_Counterclockwise : 1,
	Clock_Wedge            : 2,

	Zoom_In        : 0,
	Zoom_Out       : 1,
	Zoom_AndRotate : 2
};

/** @enum {number} */
var c_oAscLockTypeElemPresentation = {
	Object       : 1,
	Slide        : 2,
	Presentation : 3
};

var c_oSerFormat = {
	Version   : 1,
	Signature : "PPTY"
};

var TABLE_STYLE_WIDTH_PIX  = 70;
var TABLE_STYLE_HEIGHT_PIX = 50;

//------------------------------------------------------------export---------------------------------------------------
var prot;
window['Asc'] = window['Asc'] || {};

prot = window['Asc']['c_oAscCollaborativeMarksShowType'] = c_oAscCollaborativeMarksShowType;
prot['All']         = c_oAscCollaborativeMarksShowType.All;
prot['LastChanges'] = c_oAscCollaborativeMarksShowType.LastChanges;

prot = window['Asc']['c_oAscVertAlignJc'] = c_oAscVertAlignJc;
prot['Top']    = c_oAscVertAlignJc.Top;
prot['Center'] = c_oAscVertAlignJc.Center;
prot['Bottom'] = c_oAscVertAlignJc.Bottom;

prot = window['Asc']['c_oAscContextMenuTypes'] = window['Asc'].c_oAscContextMenuTypes = c_oAscContextMenuTypes;
prot['Main']       = c_oAscContextMenuTypes.Main;
prot['Thumbnails'] = c_oAscContextMenuTypes.Thumbnails;

prot = window['Asc']['c_oAscAlignShapeType'] = c_oAscAlignShapeType;
prot['ALIGN_LEFT']   = c_oAscAlignShapeType.ALIGN_LEFT;
prot['ALIGN_RIGHT']  = c_oAscAlignShapeType.ALIGN_RIGHT;
prot['ALIGN_TOP']    = c_oAscAlignShapeType.ALIGN_TOP;
prot['ALIGN_BOTTOM'] = c_oAscAlignShapeType.ALIGN_BOTTOM;
prot['ALIGN_CENTER'] = c_oAscAlignShapeType.ALIGN_CENTER;
prot['ALIGN_MIDDLE'] = c_oAscAlignShapeType.ALIGN_MIDDLE;

prot = window['Asc']['c_oAscTableLayout'] = c_oAscTableLayout;
prot['AutoFit'] = c_oAscTableLayout.AutoFit;
prot['Fixed']   = c_oAscTableLayout.Fixed;

prot = window['Asc']['c_oAscSlideTransitionTypes'] = c_oAscSlideTransitionTypes;
prot['None']    = c_oAscSlideTransitionTypes.None;
prot['Fade']    = c_oAscSlideTransitionTypes.Fade;
prot['Push']    = c_oAscSlideTransitionTypes.Push;
prot['Wipe']    = c_oAscSlideTransitionTypes.Wipe;
prot['Split']   = c_oAscSlideTransitionTypes.Split;
prot['UnCover'] = c_oAscSlideTransitionTypes.UnCover;
prot['Cover']   = c_oAscSlideTransitionTypes.Cover;
prot['Clock']   = c_oAscSlideTransitionTypes.Clock;
prot['Zoom']    = c_oAscSlideTransitionTypes.Zoom;

prot = window['Asc']['c_oAscSlideTransitionParams'] = c_oAscSlideTransitionParams;
prot['Fade_Smoothly']          = c_oAscSlideTransitionParams.Fade_Smoothly;
prot['Fade_Through_Black']     = c_oAscSlideTransitionParams.Fade_Through_Black;
prot['Param_Left']             = c_oAscSlideTransitionParams.Param_Left;
prot['Param_Top']              = c_oAscSlideTransitionParams.Param_Top;
prot['Param_Right']            = c_oAscSlideTransitionParams.Param_Right;
prot['Param_Bottom']           = c_oAscSlideTransitionParams.Param_Bottom;
prot['Param_TopLeft']          = c_oAscSlideTransitionParams.Param_TopLeft;
prot['Param_TopRight']         = c_oAscSlideTransitionParams.Param_TopRight;
prot['Param_BottomLeft']       = c_oAscSlideTransitionParams.Param_BottomLeft;
prot['Param_BottomRight']      = c_oAscSlideTransitionParams.Param_BottomRight;
prot['Split_VerticalIn']       = c_oAscSlideTransitionParams.Split_VerticalIn;
prot['Split_VerticalOut']      = c_oAscSlideTransitionParams.Split_VerticalOut;
prot['Split_HorizontalIn']     = c_oAscSlideTransitionParams.Split_HorizontalIn;
prot['Split_HorizontalOut']    = c_oAscSlideTransitionParams.Split_HorizontalOut;
prot['Clock_Clockwise']        = c_oAscSlideTransitionParams.Clock_Clockwise;
prot['Clock_Counterclockwise'] = c_oAscSlideTransitionParams.Clock_Counterclockwise;
prot['Clock_Wedge']            = c_oAscSlideTransitionParams.Clock_Wedge;
prot['Zoom_In']                = c_oAscSlideTransitionParams.Zoom_In;
prot['Zoom_Out']               = c_oAscSlideTransitionParams.Zoom_Out;
prot['Zoom_AndRotate']         = c_oAscSlideTransitionParams.Zoom_AndRotate;

window['AscCommon']                = window['AscCommon'] || {};
window['AscCommon'].c_oSerFormat   = c_oSerFormat;
window['AscCommon'].CurFileVersion = c_oSerFormat.Version;
