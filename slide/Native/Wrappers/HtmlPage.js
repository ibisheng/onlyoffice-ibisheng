/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
}


CEditorPage.prototype.MainScrollLock = function()
{
};


CEditorPage.prototype.MainScrollUnLock = function()
{
};

CEditorPage.prototype.checkBodySize = function()
{
};

CEditorPage.prototype.Init = function()
{

};

CEditorPage.prototype.CheckRetinaDisplay = function()
{

};

CEditorPage.prototype.CheckRetinaElement = function(htmlElem)
{

};

CEditorPage.prototype.ShowOverlay = function()
{
};

CEditorPage.prototype.UnShowOverlay = function()
{
};

CEditorPage.prototype.CheckUnShowOverlay = function()
{
};

CEditorPage.prototype.CheckShowOverlay = function()
{
};

CEditorPage.prototype.initEvents = function()
{

};

CEditorPage.prototype.initEvents2MobileAdvances = function()
{
};

CEditorPage.prototype.onButtonRulersClick = function()
{
};

CEditorPage.prototype.HideRulers = function()
{
};

CEditorPage.prototype.zoom_FitToWidth = function()
{
};

CEditorPage.prototype.zoom_FitToPage = function()
{
};

CEditorPage.prototype.zoom_Fire = function(type)
{
};

CEditorPage.prototype.zoom_Out = function()
{
};

CEditorPage.prototype.zoom_In = function()
{
};

CEditorPage.prototype.DisableRulerMarkers = function()
{
};

CEditorPage.prototype.EnableRulerMarkers = function()
{
};

CEditorPage.prototype.ToSearchResult = function()
{
};

CEditorPage.prototype.onButtonTabsClick = function()
{
};

CEditorPage.prototype.onButtonTabsDraw = function()
{
};

CEditorPage.prototype.onPrevPage = function()
{
};

CEditorPage.prototype.onNextPage = function()
{
};

CEditorPage.prototype.horRulerMouseDown = function(e)
{
};

CEditorPage.prototype.horRulerMouseUp = function(e)
{
};

CEditorPage.prototype.horRulerMouseMove = function(e)
{
};

CEditorPage.prototype.verRulerMouseDown = function(e)
{
};

CEditorPage.prototype.verRulerMouseUp = function(e)
{
};

CEditorPage.prototype.verRulerMouseMove = function(e)
{
};

CEditorPage.prototype.SelectWheel = function()
{
};

CEditorPage.prototype.createSplitterDiv = function(bIsVert)
{
};

CEditorPage.prototype.onBodyMouseDown = function(e)
{
};

CEditorPage.prototype.onBodyMouseMove = function(e)
{
};

CEditorPage.prototype.OnResizeSplitter = function()
{
};

CEditorPage.prototype.onBodyMouseUp = function(e)
{
};

CEditorPage.prototype.onMouseDown = function(e)
{
};

CEditorPage.prototype.onMouseMove = function(e)
{
};
CEditorPage.prototype.onMouseMove2 = function()
{
};
CEditorPage.prototype.onMouseUp = function(e, bIsWindow)
{
};

CEditorPage.prototype.onMouseUpExternal = function(x, y)
{
};

CEditorPage.prototype.onMouseWhell = function(e)
{
};

CEditorPage.prototype.onKeyUp = function(e)
{
};

CEditorPage.prototype.onKeyDown = function(e)
{
};

CEditorPage.prototype.onKeyDownNoActiveControl = function(e)
{
};

CEditorPage.prototype.onKeyDownTBIM = function(e)
{
};

CEditorPage.prototype.DisableTextEATextboxAttack = function()
{
};

CEditorPage.prototype.onKeyPress = function(e)
{
};

// -------------------------------------------------------- //
// -----------------end demonstration---------------------- //
// -------------------------------------------------------- //

CEditorPage.prototype.verticalScroll = function(sender,scrollPositionY,maxY,isAtTop,isAtBottom)
{
};

CEditorPage.prototype.verticalScrollMouseUp = function(sender, e)
{
};

CEditorPage.prototype.CorrectSpeedVerticalScroll = function(newScrollPos)
{
};

CEditorPage.prototype.CorrectVerticalScrollByYDelta = function(delta)
{
};

CEditorPage.prototype.horizontalScroll = function(sender,scrollPositionX,maxX,isAtLeft,isAtRight)
{
};

CEditorPage.prototype.UpdateScrolls = function()
{
};

CEditorPage.prototype.OnRePaintAttack = function()
{
};

CEditorPage.prototype.DeleteVerticalScroll = function()
{

};

CEditorPage.prototype.OnResize = function(isAttack)
{
};

CEditorPage.prototype.OnResize2 = function(isAttack)
{

};

CEditorPage.prototype.checkNeedRules = function()
{

};

CEditorPage.prototype.checkNeedHorScroll = function()
{
};

CEditorPage.prototype.StartUpdateOverlay = function()
{
};

CEditorPage.prototype.EndUpdateOverlay = function()
{
};

CEditorPage.prototype.OnUpdateOverlay = function()
{
    if(!this.m_oLogicDocument)
    {
        return false;
    }
    if (this.IsUpdateOverlayOnlyEnd)
    {
        this.IsUpdateOverlayOnEndCheck = true;
        return false;
    }
    var drDoc = this.m_oDrawingDocument;
    this.Native["DD_Overlay_UpdateStart"]();
    drDoc.AutoShapesTrack.SetCurrentPage(-100);
    this.Native["DD_Overlay_Clear"]();
    if (drDoc.m_bIsSelection)
    {
        this.Native["DD_Overlay_StartDrawSelection"]();
        drDoc.AutoShapesTrack.SetCurrentPage(-101);
        if (this.m_oLogicDocument.CurPage > -1)
        {
            this.m_oLogicDocument.Slides[this.m_oLogicDocument.CurPage].drawSelect(1);
        }
        drDoc.AutoShapesTrack.SetCurrentPage(-100);
        this.Native["DD_Overlay_EndDrawSelection"]();
    }
    if (this.m_oLogicDocument && this.m_oLogicDocument.CurPage > -1)
    {
        drDoc.AutoShapesTrack.SetCurrentPage(-101);
        this.m_oLogicDocument.Slides[this.m_oLogicDocument.CurPage].drawSelect(2);
        drDoc.AutoShapesTrack.SetCurrentPage(-100);
        var elements = this.m_oLogicDocument.Slides[this.m_oLogicDocument.CurPage].graphicObjects;
        if (!elements.canReceiveKeyPress())
        {
            elements.DrawOnOverlay(drDoc.AutoShapesTrack);
            drDoc.AutoShapesTrack.CorrectOverlayBounds();
        }
    }
    this.Native["DD_Overlay_UpdateEnd"]();
    return true;
};

CEditorPage.prototype.GetDrawingPageInfo = function(nPageIndex)
{
};

CEditorPage.prototype.OnCalculatePagesPlace = function()
{
};

CEditorPage.prototype.OnPaint = function()
{
};

CEditorPage.prototype.CheckFontCache = function()
{
};

CEditorPage.prototype.OnScroll = function()
{
};

CEditorPage.prototype.CheckZoom = function()
{
};

CEditorPage.prototype.CalculateDocumentSize = function(bIsAttack)
{
};

CEditorPage.prototype.CheckCalculateDocumentSize = function(_bounds)
{
};

CEditorPage.prototype.InitDocument = function(bIsEmpty)
{
};

CEditorPage.prototype.InitControl = function()
{
};

CEditorPage.prototype.StartMainTimer = function()
{
};

CEditorPage.prototype.onTimerScroll = function(isThUpdateSync)
{
};

CEditorPage.prototype.onTimerScroll_sync = function(isThUpdateSync)
{
};

CEditorPage.prototype.UpdateHorRuler = function()
{
};

CEditorPage.prototype.UpdateVerRuler = function()
{
};

CEditorPage.prototype.SetCurrentPage = function()
{
};

CEditorPage.prototype.UpdateHorRulerBack = function()
{
};

CEditorPage.prototype.UpdateVerRulerBack = function()
{
};

CEditorPage.prototype.CreateBackgroundHorRuler = function(margins)
{
};

CEditorPage.prototype.CreateBackgroundVerRuler = function(margins)
{
};

CEditorPage.prototype.ThemeGenerateThumbnails = function(_master)
{
};

CEditorPage.prototype.CheckLayouts = function(bIsAttack)
{
};

CEditorPage.prototype.GoToPage = function(lPageNum)
{
    this.Native["DD_SetCurrentPage"](lPageNum);
};

CEditorPage.prototype.GetVerticalScrollTo = function(y)
{
};

CEditorPage.prototype.GetHorizontalScrollTo = function(x)
{
};

// -------------------------------------------------------- //
// -------------------- east asian fonts ------------------ //
// -------------------------------------------------------- //

CEditorPage.prototype.ReinitTB = function()
{
};

CEditorPage.prototype.SetTextBoxMode = function(isEA)
{
};

CEditorPage.prototype.TextBoxFocus = function()
{
};

CEditorPage.prototype.OnTextBoxInput = function()
{
};

CEditorPage.prototype.CheckTextBoxSize = function()
{
};

CEditorPage.prototype.TextBoxOnKeyDown = function(e)
{
};

CEditorPage.prototype.onChangeTB = function()
{
};

CEditorPage.prototype.setNodesEnable = function()
{};

CEditorPage.prototype.CheckTextBoxInputPos = function()
{
};

CEditorPage.prototype.SaveDocument = function()
{
};

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
