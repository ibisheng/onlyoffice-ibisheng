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

var g_bIsMobile = AscCommon.AscBrowser.isMobile;

var Page_Width     = 297;
var Page_Height    = 210;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var Y_Default_Header = 12.5; // 1.25 cm
var Y_Default_Footer = 12.5; // 1.25 cm

var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;

var GlobalSkinTeamlab = {
    Name : "classic",
    RulersButton : true,
    NavigationButtons : true,
    BackgroundColor : "#B0B0B0",
    BackgroundColorThumbnails : "#EBEBEB",
    RulerDark : "#B0B0B0",
    RulerLight : "EDEDED",
    RulerOutline : "#929292",
    RulerMarkersFillColor : "#E7E7E7",
    PageOutline : "#81878F",
    STYLE_THUMBNAIL_WIDTH : 80,
    STYLE_THUMBNAIL_HEIGHT : 40,
    BorderSplitterColor : "#787878",
    SupportNotes : true,
    SplitterWidthMM : 1.5,
    ThumbnailScrollWidthNullIfNoScrolling : true
};
var GlobalSkinFlat = {
    Name : "flat",
    RulersButton : false,
    NavigationButtons : false,
    BackgroundColor : "#F4F4F4",
    BackgroundColorThumbnails : "#F4F4F4",
    RulerDark : "#CFCFCF",
    RulerLight : "#FFFFFF",
    RulerOutline : "#BBBEC2",
    RulerMarkersFillColor : "#FFFFFF",
    PageOutline : "#BBBEC2",
    STYLE_THUMBNAIL_WIDTH : 109,
    STYLE_THUMBNAIL_HEIGHT : 45,
    BorderSplitterColor : "#CBCBCB",
    SupportNotes : false,
    SplitterWidthMM : 1,
    ThumbnailScrollWidthNullIfNoScrolling : false
};

var GlobalSkin = GlobalSkinTeamlab;

function updateGlobalSkin(newSkin) {
    GlobalSkin.Name = newSkin.Name;
    GlobalSkin.RulersButton = newSkin.RulersButton;
    GlobalSkin.NavigationButtons = newSkin.NavigationButtons;
    GlobalSkin.BackgroundColor = newSkin.BackgroundColor;
    GlobalSkin.RulerDark = newSkin.RulerDark;
    GlobalSkin.RulerLight = newSkin.RulerLight;
    GlobalSkin.BackgroundScroll = newSkin.BackgroundScroll;
    GlobalSkin.RulerOutline = newSkin.RulerOutline;
    GlobalSkin.RulerMarkersFillColor = newSkin.RulerMarkersFillColor;
    GlobalSkin.PageOutline = newSkin.PageOutline;
    GlobalSkin.STYLE_THUMBNAIL_WIDTH = newSkin.STYLE_THUMBNAIL_WIDTH;
    GlobalSkin.STYLE_THUMBNAIL_HEIGHT = newSkin.STYLE_THUMBNAIL_HEIGHT;
    GlobalSkin.isNeedInvertOnActive = newSkin.isNeedInvertOnActive;
}

function CEditorPage(api)
{
    // ------------------------------------------------------------------
    this.Name = "";
    this.IsSupportNotes = false;

    this.EditorType = "presentations";

    this.X = 0;
    this.Y = 0;
    this.Width      = 10;
    this.Height     = 10;


    this.m_oDrawingDocument = new AscCommon.CDrawingDocument();
    this.m_oLogicDocument   = null;

    this.m_oDrawingDocument.m_oWordControl = this;
    this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
    this.m_oApi = api;
    this.Native = window["native"];


    this.MainScrollLock = function()
    {
    }
    this.MainScrollUnLock = function()
    {
    }

    this.checkBodySize = function()
    {
    }

    this.Init = function()
    {

    }

    this.CheckLayouts = function(){

    }

    this.CheckRetinaDisplay = function()
    {

    }

    this.CheckRetinaElement = function(htmlElem)
    {

    }

    this.ShowOverlay = function()
    {
    }
    this.UnShowOverlay = function()
    {
    }
    this.CheckUnShowOverlay = function()
    {
    }
    this.CheckShowOverlay = function()
    {
    }

    this.initEvents = function()
    {

    }

    this.initEvents2MobileAdvances = function()
    {
    }
    this.onButtonRulersClick = function()
    {
    }

    this.HideRulers = function()
    {
    }

    this.zoom_FitToWidth = function()
    {
    }
    this.zoom_FitToPage = function()
    {
    }

    this.zoom_Fire = function(type)
    {
    }

    this.zoom_Out = function()
    {
    }

    this.zoom_In = function()
    {
    }

    this.DisableRulerMarkers = function()
    {
    }

    this.EnableRulerMarkers = function()
    {
    }

    this.ToSearchResult = function()
    {
    }

    this.onButtonTabsClick = function()
    {
    }

    this.onButtonTabsDraw = function()
    {
    }

    this.onPrevPage = function()
    {
    }
    this.onNextPage = function()
    {
    }

    this.horRulerMouseDown = function(e)
    {
    }
    this.horRulerMouseUp = function(e)
    {
    }
    this.horRulerMouseMove = function(e)
    {
    }

    this.verRulerMouseDown = function(e)
    {
    }
    this.verRulerMouseUp = function(e)
    {
    }
    this.verRulerMouseMove = function(e)
    {
    }

    this.SelectWheel = function()
    {
    }

    this.createSplitterDiv = function(bIsVert)
    {
    }

    this.onBodyMouseDown = function(e)
    {
    }

    this.onBodyMouseMove = function(e)
    {
    }

    this.OnResizeSplitter = function()
    {
    }

    this.onBodyMouseUp = function(e)
    {
    }

    this.onMouseDown = function(e)
    {
    }

    this.onMouseMove = function(e)
    {
    }
    this.onMouseMove2 = function()
    {
    }
    this.onMouseUp = function(e, bIsWindow)
    {
    }

    this.onMouseUpExternal = function(x, y)
    {
    }

    this.onMouseWhell = function(e)
    {
    }

    this.onKeyUp = function(e)
    {
    }

    this.onKeyDown = function(e)
    {
    }

    this.onKeyDownNoActiveControl = function(e)
    {
    }

    this.onKeyDownTBIM = function(e)
    {
    }

    this.DisableTextEATextboxAttack = function()
    {
    }

    this.onKeyPress = function(e)
    {
    }

    // -------------------------------------------------------- //
    // -----------------end demonstration---------------------- //
    // -------------------------------------------------------- //

    this.verticalScroll = function(sender,scrollPositionY,maxY,isAtTop,isAtBottom)
    {
    }
    this.verticalScrollMouseUp = function(sender, e)
    {
    }
    this.CorrectSpeedVerticalScroll = function(newScrollPos)
    {
    }
    this.CorrectVerticalScrollByYDelta = function(delta)
    {
    }

    this.horizontalScroll = function(sender,scrollPositionX,maxX,isAtLeft,isAtRight)
    {
    }

    this.UpdateScrolls = function()
    {
    }

    this.OnRePaintAttack = function()
    {
    }

    this.DeleteVerticalScroll = function()
    {

    }

    this.OnResize = function(isAttack)
    {
    }

    this.OnResize2 = function(isAttack)
    {

    }

    this.checkNeedRules = function()
    {

    }
    this.checkNeedHorScroll = function()
    {
    }

    this.StartUpdateOverlay = function()
    {
    }
    this.EndUpdateOverlay = function()
    {
    }

    this.OnUpdateOverlay = function()
    {
    }

    this.GetDrawingPageInfo = function(nPageIndex)
    {
    }

    this.OnCalculatePagesPlace = function()
    {
    }

    this.OnPaint = function()
    {
    }

    this.CheckFontCache = function()
    {
    }
    this.OnScroll = function()
    {
    }

    this.CheckZoom = function()
    {
    }

    this.CalculateDocumentSize = function(bIsAttack)
    {
    }

    this.CheckCalculateDocumentSize = function(_bounds)
    {
    }

    this.InitDocument = function(bIsEmpty)
    {
    }

    this.InitControl = function()
    {
    }

    this.StartMainTimer = function()
    {
    }

    this.onTimerScroll = function(isThUpdateSync)
    {
    }

    this.onTimerScroll_sync = function(isThUpdateSync)
    {
    }

    this.UpdateHorRuler = function()
    {
    }
    this.UpdateVerRuler = function()
    {
    }

    this.SetCurrentPage = function()
    {
    }

    this.UpdateHorRulerBack = function()
    {
    }
    this.UpdateVerRulerBack = function()
    {
    }

    this.CreateBackgroundHorRuler = function(margins)
    {
    }
    this.CreateBackgroundVerRuler = function(margins)
    {
    }

    this.ThemeGenerateThumbnails = function(_master)
    {
    }

    this.CheckLayouts = function(bIsAttack)
    {
    }

    this.GoToPage = function(lPageNum)
    {
        this.Native["WC_GoToPage"](lPageNum);
    }

    this.GetVerticalScrollTo = function(y)
    {
    }

    this.GetHorizontalScrollTo = function(x)
    {
    }

    // -------------------------------------------------------- //
    // -------------------- east asian fonts ------------------ //
    // -------------------------------------------------------- //

    this.ReinitTB = function()
    {
    }

    this.SetTextBoxMode = function(isEA)
    {
    }

    this.TextBoxFocus = function()
    {
    }

    this.OnTextBoxInput = function()
    {
    }

    this.CheckTextBoxSize = function()
    {
    }

    this.TextBoxOnKeyDown = function(e)
    {
    }

    this.onChangeTB = function()
    {
    }
    this.CheckTextBoxInputPos = function()
    {
    }

    this.SaveDocument = function()
    {
    }
}

//------------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommonSlide'] = window['AscCommonSlide'] || {};
window['AscCommonSlide'].GlobalSkinFlat = GlobalSkinFlat;
window['AscCommonSlide'].GlobalSkin = GlobalSkin;
window['AscCommonSlide'].updateGlobalSkin = updateGlobalSkin;
window['AscCommonSlide'].CEditorPage = CEditorPage;

window['AscCommon'].Page_Width = Page_Width;
window['AscCommon'].Page_Height = Page_Height;
window['AscCommon'].X_Left_Margin = X_Left_Margin;
window['AscCommon'].X_Right_Margin = X_Right_Margin;
window['AscCommon'].Y_Bottom_Margin = Y_Bottom_Margin;
window['AscCommon'].Y_Top_Margin = Y_Top_Margin;
