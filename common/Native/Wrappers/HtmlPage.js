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

var g_bIsMobile =  AscCommon.AscBrowser.isMobile;

var Page_Width     = 210;
var Page_Height    = 297;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;

var docpostype_Content     = 0x00;
var docpostype_HdrFtr      = 0x02;

var selectionflag_Common        = 0x00;
var selectionflag_Numbering     = 0x01;
var selectionflag_DrawingObject = 0x002;

var tableSpacingMinValue = 0.02;//0.02мм

var GlobalSkinTeamlab = {
    Name : "classic",
    RulersButton : true,
    NavigationButtons : true,
    BackgroundColor : "#B0B0B0",
    RulerDark : "#B0B0B0",
    RulerLight : "EDEDED",
    BackgroundScroll : "#D3D3D3",
    RulerOutline : "#929292",
    RulerMarkersFillColor : "#E7E7E7",
    PageOutline : "#81878F",
    STYLE_THUMBNAIL_WIDTH : 80,
    STYLE_THUMBNAIL_HEIGHT : 40
};
var GlobalSkinFlat = {
    Name : "flat",
    RulersButton : false,
    NavigationButtons : false,
    BackgroundColor : "#F4F4F4",
    RulerDark : "#CFCFCF",
    RulerLight : "#FFFFFF",
    BackgroundScroll : "#F1F1F1",
    RulerOutline : "#BBBEC2",
    RulerMarkersFillColor : "#FFFFFF",
    PageOutline : "#BBBEC2",
    STYLE_THUMBNAIL_WIDTH : 109,
    STYLE_THUMBNAIL_HEIGHT : 45,
    isNeedInvertOnActive: false
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
    this.Name = "";

    this.X = 0;
    this.Y = 0;
    this.Width      = 10;
    this.Height     = 10;

    this.m_oDrawingDocument = new AscCommon.CDrawingDocument();
    this.m_oLogicDocument   = null;

    this.m_oDrawingDocument.m_oWordControl = this;
    this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;
    this.m_oApi = api;

    this.Init = function()
    {
    }

    this.CheckRetinaDisplay = function()
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

    this.initEvents2 = function()
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

    this.zoom_Fire = function(type, old_zoom)
    {
    }

    this.zoom_Out = function()
    {
    }

    this.zoom_In = function()
    {
    }

    this.ToSearchResult = function()
    {
    }

    this.ScrollToPosition = function(x, y, PageNum)
    {
    }

    this.onButtonTabsClick = function()
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

    this.checkViewerModeKeys = function(e)
    {        
    }

    this.ChangeReaderMode = function()
    {        
    }

    this.IncreaseReaderFontSize = function()
    {        
    }
    this.DecreaseReaderFontSize = function()
    {        
    }

    this.EnableReaderMode = function()
    {        
    }

    this.DisableReaderMode = function()
    {
    }

    this.CheckDestroyReader = function()
    {
    }

    this.TransformDivUseAnimation = function(_div, topPos)
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

    this.onKeyUp = function(e)
    {
    }
    this.onKeyPress = function(e)
    {
    }

    this.verticalScroll = function(sender,scrollPositionY,maxY,isAtTop,isAtBottom)
    {
    }
    this.CorrectSpeedVerticalScroll = function(newScrollPos)
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

    this.OnResize = function(isAttack)
    {
    }

    this.checkNeedRules = function()
    {
    }
    this.checkNeedHorScroll = function()
    {
    }

    this.getScrollMaxX = function(size)
    {
    }
    this.getScrollMaxY = function(size)
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

    this.OnUpdateSelection = function()
    {
    }

    this.OnCalculatePagesPlace = function()
    {
    }

    this.OnPaint = function()
    {
    }

    this.CheckRetinaElement = function(htmlElem)
    {
    }

    this.GetDrawingPageInfo = function(nPageIndex)
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

    this.ChangeHintProps = function()
    {
    }

    this.CalculateDocumentSize = function()
    {
    }

    this.InitDocument = function(bIsEmpty)
    {
    }

    this.InitControl = function()
    {
    }

    this.OpenDocument = function(info)
    {
    }

    this.AnimationFrame = function()
    {
    }

    this.onTimerScroll = function()
    {
    }

    this.StartMainTimer = function()
    {
    }

    this.onTimerScroll2 = function()
    {
    }

    this.onTimerScroll2_sync = function()
    {
    }

    this.UpdateHorRuler = function()
    {
    }
    this.UpdateVerRuler = function()
    {
    }

    this.SetCurrentPage = function(isNoUpdateRulers)
    {
    }
    this.SetCurrentPage2 = function()
    {
    }

    this.UpdateHorRulerBack = function()
    {
    }
    this.UpdateVerRulerBack = function()
    {
    }

    this.GoToPage = function(lPageNum)
    {
    }

    this.GetVerticalScrollTo = function(y, page)
    {
    }

    this.GetHorizontalScrollTo = function(x, page)
    {
    }

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
}

//------------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].GlobalSkinFlat = GlobalSkinFlat;
window['AscCommonWord'].GlobalSkin = GlobalSkin;
window['AscCommonWord'].updateGlobalSkin = updateGlobalSkin;
window['AscCommonWord'].CEditorPage = CEditorPage;

window['AscCommon'].Page_Width = Page_Width;
window['AscCommon'].Page_Height = Page_Height;
window['AscCommon'].X_Left_Margin = X_Left_Margin;
window['AscCommon'].X_Right_Margin = X_Right_Margin;
window['AscCommon'].Y_Bottom_Margin = Y_Bottom_Margin;
window['AscCommon'].Y_Top_Margin = Y_Top_Margin;
