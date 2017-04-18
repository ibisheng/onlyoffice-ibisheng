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

// Import
var g_fontApplication = AscFonts.g_fontApplication;

var AscBrowser             = AscCommon.AscBrowser;
var g_anchor_left          = AscCommon.g_anchor_left;
var g_anchor_top           = AscCommon.g_anchor_top;
var g_anchor_right         = AscCommon.g_anchor_right;
var g_anchor_bottom        = AscCommon.g_anchor_bottom;
var CreateControlContainer = AscCommon.CreateControlContainer;
var CreateControl          = AscCommon.CreateControl;
var global_keyboardEvent   = AscCommon.global_keyboardEvent;
var global_mouseEvent      = AscCommon.global_mouseEvent;
var History                = AscCommon.History;
var g_dKoef_pix_to_mm      = AscCommon.g_dKoef_pix_to_mm;
var g_dKoef_mm_to_pix      = AscCommon.g_dKoef_mm_to_pix;

var g_bIsMobile = AscBrowser.isMobile;

var Page_Width  = 210;
var Page_Height = 297;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var X_Right_Field  = Page_Width - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;

var tableSpacingMinValue = 0.02;//0.02мм

var GlobalSkinTeamlab = {
	Name                   : "classic",
	RulersButton           : true,
	NavigationButtons      : true,
	BackgroundColor        : "#B0B0B0",
	RulerDark              : "#B0B0B0",
	RulerLight             : "EDEDED",
	BackgroundScroll       : "#D3D3D3",
	RulerOutline           : "#929292",
	RulerMarkersFillColor  : "#E7E7E7",
	PageOutline            : "#81878F",
	STYLE_THUMBNAIL_WIDTH  : 80,
	STYLE_THUMBNAIL_HEIGHT : 40
};
var GlobalSkinFlat    = {
	Name                   : "flat",
	RulersButton           : false,
	NavigationButtons      : false,
	BackgroundColor        : "#F4F4F4",
	RulerDark              : "#CFCFCF",
	RulerLight             : "#FFFFFF",
	BackgroundScroll       : "#F1F1F1",
	RulerOutline           : "#BBBEC2",
	RulerMarkersFillColor  : "#FFFFFF",
	PageOutline            : "#BBBEC2",
	STYLE_THUMBNAIL_WIDTH  : 104,
	STYLE_THUMBNAIL_HEIGHT : 38,
	isNeedInvertOnActive   : false
};

var GlobalSkin = GlobalSkinFlat;
if (AscCommon.TEMP_STYLE_THUMBNAIL_WIDTH !== undefined && AscCommon.TEMP_STYLE_THUMBNAIL_HEIGHT !== undefined)
{
	// TODO: переделать.
	GlobalSkin.STYLE_THUMBNAIL_WIDTH = AscCommon.TEMP_STYLE_THUMBNAIL_WIDTH;
	GlobalSkin.STYLE_THUMBNAIL_HEIGHT = AscCommon.TEMP_STYLE_THUMBNAIL_HEIGHT;
}

function updateGlobalSkin(newSkin)
{
	GlobalSkin.Name                   = newSkin.Name;
	GlobalSkin.RulersButton           = newSkin.RulersButton;
	GlobalSkin.NavigationButtons      = newSkin.NavigationButtons;
	GlobalSkin.BackgroundColor        = newSkin.BackgroundColor;
	GlobalSkin.RulerDark              = newSkin.RulerDark;
	GlobalSkin.RulerLight             = newSkin.RulerLight;
	GlobalSkin.BackgroundScroll       = newSkin.BackgroundScroll;
	GlobalSkin.RulerOutline           = newSkin.RulerOutline;
	GlobalSkin.RulerMarkersFillColor  = newSkin.RulerMarkersFillColor;
	GlobalSkin.PageOutline            = newSkin.PageOutline;
	GlobalSkin.STYLE_THUMBNAIL_WIDTH  = newSkin.STYLE_THUMBNAIL_WIDTH;
	GlobalSkin.STYLE_THUMBNAIL_HEIGHT = newSkin.STYLE_THUMBNAIL_HEIGHT;
	GlobalSkin.isNeedInvertOnActive   = newSkin.isNeedInvertOnActive;
}

function CEditorPage(api)
{
	this.Name = "";

	this.X      = 0;
	this.Y      = 0;
	this.Width  = 10;
	this.Height = 10;

	this.m_oBody        = null;
	this.m_oMenu        = null;
	this.m_oPanelRight  = null;
	this.m_oScrollHor   = null;
	this.m_oMainContent = null;
	this.m_oLeftRuler   = null;
	this.m_oTopRuler    = null;
	this.m_oMainView    = null;
	this.m_oEditor      = null;
	this.m_oOverlay     = null;

	this.TextBoxBackground = null;

	this.ReaderModeDivWrapper = null;
	this.ReaderModeDiv        = null;

	this.m_oOverlayApi = new AscCommon.COverlay();
	this.m_bIsIE       = (AscBrowser.isIE || window.opera) ? true : false;

	this.m_oPanelRight_buttonRulers   = null;
	this.m_oPanelRight_vertScroll     = null;
	this.m_oPanelRight_buttonPrevPage = null;
	this.m_oPanelRight_buttonNextPage = null;

	this.m_oLeftRuler_buttonsTabs = null;
	this.m_oLeftRuler_vertRuler   = null;

	this.m_oTopRuler_horRuler = null;

	this.m_bIsHorScrollVisible          = false;
	this.m_bIsRuler                     = (api.isMobileVersion === true) ? false : true;
	this.m_bDocumentPlaceChangedEnabled = false;

	this.m_nZoomValue        = 100;
	this.m_oBoundsController = new AscFormat.CBoundsController();
	this.m_nTabsType         = 0;

	this.m_dScrollY           = 0;
	this.m_dScrollX           = 0;
	this.m_dScrollY_max       = 1;
	this.m_dScrollX_max       = 1;
	this.m_bIsRePaintOnScroll = true;

	this.m_dDocumentWidth      = 0;
	this.m_dDocumentHeight     = 0;
	this.m_dDocumentPageWidth  = 0;
	this.m_dDocumentPageHeight = 0;

	this.NoneRepaintPages = false;

	this.m_bIsScroll    = false;
	this.ScrollsWidthPx = 14;

	this.m_oHorRuler = new CHorRuler();
	this.m_oVerRuler = new CVerRuler();

	this.m_oDrawingDocument = new AscCommon.CDrawingDocument();
	this.m_oLogicDocument   = null;

	this.m_oDrawingDocument.m_oWordControl   = this;
	this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;

	this.m_bIsUpdateHorRuler       = false;
	this.m_bIsUpdateVerRuler       = false;
	this.m_bIsUpdateTargetNoAttack = false;

	this.m_bIsFullRepaint = false;

	this.m_oScrollHor_ = null;
	this.m_oScrollVer_ = null;

	this.m_oScrollHorApi = null;
	this.m_oScrollVerApi = null;

	this.arrayEventHandlers = [];

	this.m_oTimerScrollSelect = -1;
	this.IsFocus              = true;
	this.m_bIsMouseLock       = false;

	this.DrawingFreeze      = false;

	this.m_oHorRuler.m_oWordControl = this;
	this.m_oVerRuler.m_oWordControl = this;

	this.IsKeyDownButNoPress = false;

	this.MouseDownDocumentCounter = 0;

	this.bIsUseKeyPress = true;
	this.bIsEventPaste  = false;
	this.bIsDoublePx    = true;//поддерживает ли браузер нецелые пикселы
	var oTestSpan       = document.createElement("span");
	oTestSpan.setAttribute("style", "font-size:8pt");
	document.body.appendChild(oTestSpan);
	var defaultView   = oTestSpan.ownerDocument.defaultView;
	var computedStyle = defaultView.getComputedStyle(oTestSpan, null);
	if (null != computedStyle)
	{
		var fontSize = computedStyle.getPropertyValue("font-size");
		if (-1 != fontSize.indexOf("px") && parseFloat(fontSize) == parseInt(fontSize))
			this.bIsDoublePx = false;
	}
	document.body.removeChild(oTestSpan);

	this.m_nPaintTimerId          = -1;
	this.m_nTimerScrollInterval   = 40;
	this.m_nCurrentTimeClearCache = 0;

	this.m_bIsMouseUpSend = false;

	this.zoom_values = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
	this.m_nZoomType = 0; // 0 - custom, 1 - fitToWodth, 2 - fitToPage

	this.MobileTouchManager = null;
	this.ReaderTouchManager = null;
	this.ReaderModeCurrent  = 0;

	this.ReaderFontSizeCur = 2;
	this.ReaderFontSizes   = [12, 14, 16, 18, 22, 28, 36, 48, 72];

	this.bIsRetinaSupport         = true;
	this.bIsRetinaNoSupportAttack = false;

	this.IsUpdateOverlayOnlyEnd       = false;
	this.IsUpdateOverlayOnlyEndReturn = false;
	this.IsUpdateOverlayOnEndCheck    = false;

	this.m_oApi = api;
	var oThis   = this;

	//this.UseRequestAnimationFrame = false;
	this.UseRequestAnimationFrame = AscCommon.AscBrowser.isChrome;
	this.RequestAnimationFrame    = (function()
	{
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame || null;
	})();
	this.CancelAnimationFrame     = (function()
	{
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame || null;
	})();

	if (this.UseRequestAnimationFrame)
	{
		if (null == this.RequestAnimationFrame)
			this.UseRequestAnimationFrame = false;
	}
	this.RequestAnimationOldTime = -1;

	this.IsInitControl = false;

	this.checkBodyOffset = function()
	{
		var off = jQuery("#" + this.Name).offset();

		if (off)
		{
			this.X = off.left;
			this.Y = off.top;
		}
	}

	this.checkBodySize = function()
	{
		this.checkBodyOffset();

		var el = document.getElementById(this.Name);

		var _newW = el.offsetWidth;
		var _newH = el.offsetHeight;

		var _left_border_w = 0;
		if (window.getComputedStyle)
		{
			var _computed_style = window.getComputedStyle(el, null);
			if (_computed_style)
			{
				var _value = _computed_style.getPropertyValue("border-left-width");

				if (typeof _value == "string")
				{
					_left_border_w = parseInt(_value);
				}
			}
		}

		_newW -= _left_border_w;
		if (this.Width != _newW || this.Height != _newH)
		{
			this.Width  = _newW;
			this.Height = _newH;
			return true;
		}
		return false;
	};

	this.Init = function()
	{
		this.m_oBody = CreateControlContainer(this.Name);

		var scrollWidthMm = this.ScrollsWidthPx * g_dKoef_pix_to_mm;

		this.m_oScrollHor = CreateControlContainer("id_horscrollpanel");
		this.m_oScrollHor.Bounds.SetParams(0, 0, scrollWidthMm, 0, false, false, true, true, -1, scrollWidthMm);
		this.m_oScrollHor.Anchor = (g_anchor_left | g_anchor_right | g_anchor_bottom);
		this.m_oBody.AddControl(this.m_oScrollHor);

		// panel right --------------------------------------------------------------
		this.m_oPanelRight = CreateControlContainer("id_panel_right");
		this.m_oPanelRight.Bounds.SetParams(0, 0, 1000, 0, false, true, false, true, scrollWidthMm, -1);
		this.m_oPanelRight.Anchor = (g_anchor_top | g_anchor_right | g_anchor_bottom);

		this.m_oBody.AddControl(this.m_oPanelRight);
		if (this.m_oApi.isMobileVersion)
		{
			this.m_oPanelRight.HtmlElement.style.zIndex = -1;

			var hor_scroll          = document.getElementById('id_horscrollpanel');
			hor_scroll.style.zIndex = -1;
		}

		this.m_oPanelRight_buttonRulers = CreateControl("id_buttonRulers");
		this.m_oPanelRight_buttonRulers.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, scrollWidthMm);
		this.m_oPanelRight_buttonRulers.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
		this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonRulers);

		var _vertScrollTop = scrollWidthMm;
		if (GlobalSkin.RulersButton === false)
		{
			this.m_oPanelRight_buttonRulers.HtmlElement.style.display = "none";
			_vertScrollTop                                            = 0;
		}

		this.m_oPanelRight_buttonNextPage = CreateControl("id_buttonNextPage");
		this.m_oPanelRight_buttonNextPage.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, scrollWidthMm);
		this.m_oPanelRight_buttonNextPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
		this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonNextPage);

		this.m_oPanelRight_buttonPrevPage = CreateControl("id_buttonPrevPage");
		this.m_oPanelRight_buttonPrevPage.Bounds.SetParams(0, 0, 1000, scrollWidthMm, false, false, false, true, -1, scrollWidthMm);
		this.m_oPanelRight_buttonPrevPage.Anchor = (g_anchor_left | g_anchor_bottom | g_anchor_right);
		this.m_oPanelRight.AddControl(this.m_oPanelRight_buttonPrevPage);

		var _vertScrollBottom = 2 * scrollWidthMm;
		if (GlobalSkin.NavigationButtons == false)
		{
			this.m_oPanelRight_buttonNextPage.HtmlElement.style.display = "none";
			this.m_oPanelRight_buttonPrevPage.HtmlElement.style.display = "none";
			_vertScrollBottom                                           = 0;
		}

		this.m_oPanelRight_vertScroll = CreateControl("id_vertical_scroll");
		this.m_oPanelRight_vertScroll.Bounds.SetParams(0, _vertScrollTop, 1000, _vertScrollBottom, false, true, false, true, -1, -1);
		this.m_oPanelRight_vertScroll.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
		this.m_oPanelRight.AddControl(this.m_oPanelRight_vertScroll);
		// --------------------------------------------------------------------------

		// main content -------------------------------------------------------------
		this.m_oMainContent = CreateControlContainer("id_main");
		if (!this.m_oApi.isMobileVersion)
			this.m_oMainContent.Bounds.SetParams(0, 0, scrollWidthMm, 0, false, true, true, true, -1, -1);
		else
			this.m_oMainContent.Bounds.SetParams(0, 0, 0, 0, false, true, true, true, -1, -1);
		this.m_oMainContent.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
		this.m_oBody.AddControl(this.m_oMainContent);

		// --- left ---
		this.m_oLeftRuler = CreateControlContainer("id_panel_left");
		this.m_oLeftRuler.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, 5, -1);
		this.m_oLeftRuler.Anchor = (g_anchor_left | g_anchor_top | g_anchor_bottom);
		this.m_oMainContent.AddControl(this.m_oLeftRuler);

		this.m_oLeftRuler_buttonsTabs = CreateControl("id_buttonTabs");
		this.m_oLeftRuler_buttonsTabs.Bounds.SetParams(0, 0.8, 1000, 1000, false, true, false, false, -1, 5);
		this.m_oLeftRuler_buttonsTabs.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
		this.m_oLeftRuler.AddControl(this.m_oLeftRuler_buttonsTabs);

		this.m_oLeftRuler_vertRuler = CreateControl("id_vert_ruler");
		this.m_oLeftRuler_vertRuler.Bounds.SetParams(0, 7, 1000, 1000, false, true, false, false, -1, -1);
		this.m_oLeftRuler_vertRuler.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
		this.m_oLeftRuler.AddControl(this.m_oLeftRuler_vertRuler);
		// ------------

		// --- top ----
		this.m_oTopRuler = CreateControlContainer("id_panel_top");
		this.m_oTopRuler.Bounds.SetParams(5, 0, 1000, 1000, true, false, false, false, -1, 7);
		this.m_oTopRuler.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right);
		this.m_oMainContent.AddControl(this.m_oTopRuler);

		this.m_oTopRuler_horRuler = CreateControl("id_hor_ruler");
		this.m_oTopRuler_horRuler.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
		this.m_oTopRuler_horRuler.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
		this.m_oTopRuler.AddControl(this.m_oTopRuler_horRuler);
		// ------------

		this.m_oMainView = CreateControlContainer("id_main_view");
		this.m_oMainView.Bounds.SetParams(5, 7, 1000, 1000, true, true, false, false, -1, -1);
		this.m_oMainView.Anchor = (g_anchor_left | g_anchor_right | g_anchor_top | g_anchor_bottom);
		this.m_oMainContent.AddControl(this.m_oMainView);

		this.m_oEditor = CreateControl("id_viewer");
		this.m_oEditor.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
		this.m_oEditor.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
		this.m_oMainView.AddControl(this.m_oEditor);

		this.m_oOverlay = CreateControl("id_viewer_overlay");
		this.m_oOverlay.Bounds.SetParams(0, 0, 1000, 1000, false, false, false, false, -1, -1);
		this.m_oOverlay.Anchor = (g_anchor_left | g_anchor_top | g_anchor_right | g_anchor_bottom);
		this.m_oMainView.AddControl(this.m_oOverlay);
		// --------------------------------------------------------------------------

		this.m_oDrawingDocument.TargetHtmlElement = document.getElementById('id_target_cursor');

		if (this.m_oApi.isMobileVersion)
		{
			this.MobileTouchManager = new AscCommon.CMobileTouchManager( { eventsElement : "word_mobile_element" } );
			this.MobileTouchManager.Init(this.m_oApi);
		}

		this.checkNeedRules();
		this.initEvents2();

		this.m_oOverlayApi.m_oControl  = this.m_oOverlay;
		this.m_oOverlayApi.m_oHtmlPage = this;
		this.m_oOverlayApi.Clear();
		this.ShowOverlay();

		this.m_oDrawingDocument.AutoShapesTrack = new AscCommon.CAutoshapeTrack();
		this.m_oDrawingDocument.AutoShapesTrack.init2(this.m_oOverlayApi);

		this.OnResize(true);
	};

	this.CheckRetinaDisplay = function()
	{
		var old = this.bIsRetinaSupport;
		if (!this.bIsRetinaNoSupportAttack)
		{
			this.bIsRetinaSupport       = AscBrowser.isRetina;
			this.m_oOverlayApi.IsRetina = this.bIsRetinaSupport;
		}
		else
		{
			this.bIsRetinaSupport = false;
			this.m_oOverlayApi.IsRetina = this.bIsRetinaSupport;
		}

		if (old != this.bIsRetinaSupport)
		{
			this.m_oDrawingDocument.ClearCachePages();
			this.onButtonTabsDraw();
		}
	};

	this.ShowOverlay        = function()
	{
		this.m_oOverlay.HtmlElement.style.display = "block";

		if (null == this.m_oOverlayApi.m_oContext)
			this.m_oOverlayApi.m_oContext = this.m_oOverlayApi.m_oControl.HtmlElement.getContext('2d');
	};
	this.UnShowOverlay      = function()
	{
		this.m_oOverlay.HtmlElement.style.display = "none";
	};
	this.CheckUnShowOverlay = function()
	{
		var drDoc = this.m_oDrawingDocument;
		if (!drDoc.m_bIsSearching && !drDoc.m_bIsSelection && !this.MobileTouchManager)
		{
			this.UnShowOverlay();
			return false;
		}
		return true;
	};
	this.CheckShowOverlay   = function()
	{
		var drDoc = this.m_oDrawingDocument;
		if (drDoc.m_bIsSearching || drDoc.m_bIsSelection || this.MobileTouchManager)
			this.ShowOverlay();
	};

	this.initEvents2 = function()
	{
		this.arrayEventHandlers[0] = new AscCommon.button_eventHandlers("", "0px 0px", "0px -16px", "0px -32px", this.m_oPanelRight_buttonRulers, this.onButtonRulersClick);
		this.arrayEventHandlers[1] = new AscCommon.button_eventHandlers("", "0px 0px", "0px -16px", "0px -32px", this.m_oPanelRight_buttonPrevPage, this.onPrevPage);
		this.arrayEventHandlers[2] = new AscCommon.button_eventHandlers("", "0px -48px", "0px -64px", "0px -80px", this.m_oPanelRight_buttonNextPage, this.onNextPage);

		this.m_oLeftRuler_buttonsTabs.HtmlElement.onclick = this.onButtonTabsClick;//new Function("onButtonTabsClick();");

		this.m_oEditor.HtmlElement.onmousedown = this.onMouseDown;//new Function("event", "return Editor_OnMouseDown(event);");
		this.m_oEditor.HtmlElement.onmousemove = this.onMouseMove;//new Function("event", "return Editor_OnMouseMove(event);");
		this.m_oEditor.HtmlElement.onmouseup   = this.onMouseUp;//new Function("event", "return Editor_OnMouseUp(event);");

		this.m_oOverlay.HtmlElement.onmousedown = this.onMouseDown;//new Function("event", "return Editor_OnMouseDown(event);");
		this.m_oOverlay.HtmlElement.onmousemove = this.onMouseMove;//new Function("event", "return Editor_OnMouseMove(event);");
		this.m_oOverlay.HtmlElement.onmouseup   = this.onMouseUp;//new Function("event", "return Editor_OnMouseUp(event);");

		var _cur         = document.getElementById('id_target_cursor');
		_cur.onmousedown = this.onMouseDown;//new Function("event", "return Editor_OnMouseDown(event);");
		_cur.onmousemove = this.onMouseMove;//new Function("event", "return Editor_OnMouseMove(event);");
		_cur.onmouseup   = this.onMouseUp;//new Function("event", "return Editor_OnMouseUp(event);");

		this.m_oMainContent.HtmlElement.onmousewheel = this.onMouseWhell;//new Function("event", "return Editor_OnMouseWhell(event);");
		if (this.m_oMainContent.HtmlElement.addEventListener)
		{
			//this.m_oMainContent.HtmlElement.addEventListener("DOMMouseScroll", new Function("event", "return Editor_OnMouseWhell(event);"), false);
			this.m_oMainContent.HtmlElement.addEventListener("DOMMouseScroll", this.onMouseWhell, false);
		}

		this.m_oTopRuler_horRuler.HtmlElement.onmousedown = this.horRulerMouseDown;//new Function("event", "horRulerMouseDown(event);");
		this.m_oTopRuler_horRuler.HtmlElement.onmouseup   = this.horRulerMouseUp;//new Function("event", "horRulerMouseUp(event);");
		this.m_oTopRuler_horRuler.HtmlElement.onmousemove = this.horRulerMouseMove;//new Function("event", "horRulerMouseMove(event);");

		this.m_oLeftRuler_vertRuler.HtmlElement.onmousedown = this.verRulerMouseDown;//new Function("event", "verRulerMouseDown(event);");
		this.m_oLeftRuler_vertRuler.HtmlElement.onmouseup   = this.verRulerMouseUp;//new Function("event", "verRulerMouseUp(event);");
		this.m_oLeftRuler_vertRuler.HtmlElement.onmousemove = this.verRulerMouseMove;//new Function("event", "verRulerMouseMove(event);");

		/*
		 // теперь все делает AscCommon.InitBrowserSystemContext
		 window.onkeydown = this.onKeyDown;//Editor_OnKeyDown;
		 window.onkeypress = this.onKeyPress;//Editor_OnKeyPress;
		 window.onkeyup = this.onKeyUp;
		 */

		this.m_oBody.HtmlElement.oncontextmenu = function()
		{
			return false;
		};
		//window.oncontextmenu = function() { return false; };

		this.initEvents2MobileAdvances();
	};

	this.initEvents2MobileAdvances = function()
	{
		/*
		 this.m_oEditor.HtmlElement["ontouchstart"] = function (e){
		 if (oThis.TouchManager.StartTouches(e, oThis.m_bIsHorScrollVisible ? oThis.m_dScrollX : undefined, oThis.m_dScrollY) === false)
		 {
		 oThis.onMouseUp(e.touches[0]);
		 return false;
		 }

		 oThis.onMouseDown(e.touches[0]);
		 return false;
		 }
		 this.m_oEditor.HtmlElement["ontouchmove"] = function (e){
		 if (oThis.TouchManager.MoveTouches(e) === false)
		 return false;

		 oThis.onMouseMove(e.touches[0]);
		 return false;
		 }
		 this.m_oEditor.HtmlElement["ontouchend"] = function (e){
		 if (oThis.TouchManager.EndTouches(e) === false)
		 return false;

		 oThis.onMouseUp(e.changedTouches[0]);
		 return false;
		 }

		 this.m_oOverlay.HtmlElement["ontouchstart"] = function (e){
		 if (oThis.TouchManager.StartTouches(e, oThis.m_bIsHorScrollVisible ? oThis.m_dScrollX : undefined, oThis.m_dScrollY) === false)
		 {
		 oThis.onMouseUp(e.touches[0]);
		 return false;
		 }

		 oThis.onMouseDown(e.touches[0]);
		 return false;
		 }
		 this.m_oOverlay.HtmlElement["ontouchmove"] = function (e){
		 if (oThis.TouchManager.MoveTouches(e) === false)
		 return false;

		 oThis.onMouseMove(e.touches[0]);
		 return false;
		 }
		 this.m_oOverlay.HtmlElement["ontouchend"] = function (e){
		 if (oThis.TouchManager.EndTouches(e) === false)
		 return false;

		 oThis.onMouseUp(e.changedTouches[0]);
		 return false;
		 }
		 */

		this.m_oTopRuler_horRuler.HtmlElement["ontouchstart"] = function(e)
		{
			oThis.horRulerMouseDown(e.touches[0]);
			return false;
		};
		this.m_oTopRuler_horRuler.HtmlElement["ontouchmove"]  = function(e)
		{
			oThis.horRulerMouseMove(e.touches[0]);
			return false;
		};
		this.m_oTopRuler_horRuler.HtmlElement["ontouchend"]   = function(e)
		{
			oThis.horRulerMouseUp(e.changedTouches[0]);
			return false;
		};

		this.m_oLeftRuler_vertRuler.HtmlElement["ontouchstart"] = function(e)
		{
			oThis.verRulerMouseDown(e.touches[0]);
			return false;
		};
		this.m_oLeftRuler_vertRuler.HtmlElement["ontouchmove"]  = function(e)
		{
			oThis.verRulerMouseMove(e.touches[0]);
			return false;
		};
		this.m_oLeftRuler_vertRuler.HtmlElement["ontouchend"]   = function(e)
		{
			oThis.verRulerMouseUp(e.changedTouches[0]);
			return false;
		};

		if (!this.m_oApi.isMobileVersion)
		{
			var _check_e = function(e)
			{
				if (e.touches && e.touches[0])
					return e.touches[0];
				if (e.changedTouches && e.changedTouches[0])
					return e.changedTouches[0];
				return e;
			};

			var _cur = document.getElementById('id_target_cursor');

			_cur["ontouchstart"] = this.m_oEditor.HtmlElement["ontouchstart"] = this.m_oOverlay.HtmlElement["ontouchstart"] 	= function(e) {
				//console.log("start: " + AscCommon.isTouch);
				if (AscCommon.isTouch)
					return;

				var _old = global_mouseEvent.KoefPixToMM;
				global_mouseEvent.KoefPixToMM = 5;
				AscCommon.isTouch 			= true;
				AscCommon.isTouchMove 		= false;
				AscCommon.TouchStartTime 	= new Date().getTime();
				AscCommon.stopEvent(e);
				var _ret = this.onmousedown(_check_e(e), true);
				global_mouseEvent.KoefPixToMM = _old;

				if ((document.activeElement !== undefined) &&
					(AscCommon.g_inputContext != null) &&
					(document.activeElement != AscCommon.g_inputContext.HtmlArea))
				{
					AscCommon.g_inputContext.HtmlArea.focus();
				}

				return _ret;
			};
			_cur["ontouchmove"] = this.m_oEditor.HtmlElement["ontouchmove"] = this.m_oOverlay.HtmlElement["ontouchmove"] 		= function(e) {
				//console.log("move: " + AscCommon.isTouch);

				var _old = global_mouseEvent.KoefPixToMM;
				global_mouseEvent.KoefPixToMM = 5;
				AscCommon.isTouch 		= true;
				AscCommon.isTouchMove 	= true;
				AscCommon.stopEvent(e);
				var _ret = this.onmousemove(_check_e(e), true);
				global_mouseEvent.KoefPixToMM = _old;
				return _ret;
			};
			_cur["ontouchend"] = this.m_oEditor.HtmlElement["ontouchend"] = this.m_oOverlay.HtmlElement["ontouchend"] 		= function(e) {
				//console.log("end: " + AscCommon.isTouch);

				if (!AscCommon.isTouch)
					return;

				var _old = global_mouseEvent.KoefPixToMM;
				global_mouseEvent.KoefPixToMM = 5;
				AscCommon.isTouch = false;
				AscCommon.stopEvent(e);
				var _natE = _check_e(e);
				var _ret = this.onmouseup(_natE, undefined, true);
				global_mouseEvent.KoefPixToMM = _old;

				if (!AscCommon.isTouchMove && (-1 != AscCommon.TouchStartTime) && (Math.abs(AscCommon.TouchStartTime - (new Date().getTime())) > 900))
				{
					var _eContextMenu = {
						pageX   : _natE.pageX,
						pageY   : _natE.pageY,
						clientX : _natE.clientX,
						clientY : _natE.clientY,

						altKey   : _natE.altKey,
						shiftKey : _natE.shiftKey,
						ctrlKey  : _natE.ctrlKey,
						metaKey  : _natE.metaKey,

						button : AscCommon.g_mouse_button_right,

						target     : e.target,
						srcElement : e.srcElement
					};

					AscCommon.isTouch = true;
					this.onmousedown(_eContextMenu, true);
					this.onmouseup(_eContextMenu, undefined, true);
					AscCommon.isTouch = false;
				}
				AscCommon.isTouchMove = false;
				AscCommon.TouchStartTime = -1;

				return _ret;
			};
			_cur["ontouchcancel"] = this.m_oEditor.HtmlElement["ontouchcancel"] = this.m_oOverlay.HtmlElement["ontouchcancel"] 	= function(e) {
				//console.log("cancel: " + AscCommon.isTouch);

				if (!AscCommon.isTouch)
					return;

				var _old = global_mouseEvent.KoefPixToMM;
				global_mouseEvent.KoefPixToMM = 5;
				AscCommon.isTouch = false;
				AscCommon.stopEvent(e);
				var _natE = _check_e(e);
				var _ret = this.onmouseup(_natE, undefined, true);
				global_mouseEvent.KoefPixToMM = _old;

				if (!AscCommon.isTouchMove && (-1 != AscCommon.TouchStartTime) && (Math.abs(AscCommon.TouchStartTime - (new Date().getTime())) > 900))
				{
					var _eContextMenu = {
						pageX   : _natE.pageX,
						pageY   : _natE.pageY,
						clientX : _natE.clientX,
						clientY : _natE.clientY,

						altKey   : _natE.altKey,
						shiftKey : _natE.shiftKey,
						ctrlKey  : _natE.ctrlKey,
						metaKey  : _natE.metaKey,

						button : AscCommon.g_mouse_button_right,

						target     : e.target,
						srcElement : e.srcElement
					};

					AscCommon.isTouch = true;
					this.onmousedown(_eContextMenu, true);
					this.onmouseup(_eContextMenu, undefined, true);
					AscCommon.isTouch = false;
				}
				AscCommon.isTouchMove = false;
				AscCommon.TouchStartTime = -1;

				return _ret;
			};
		}
	};

	this.initEventsMobile = function()
	{
        if (this.m_oApi.isMobileVersion)
		{
		    this.TextBoxBackground = CreateControl(AscCommon.g_inputContext.HtmlArea.id);
            this.TextBoxBackground.HtmlElement.parentNode.parentNode.style.zIndex = 10;

            this.MobileTouchManager.initEvents(AscCommon.g_inputContext.HtmlArea.id);

			if (AscBrowser.isAndroid)
			{
				this.TextBoxBackground.HtmlElement["oncontextmenu"] = function(e)
				{
					if (e.preventDefault)
						e.preventDefault();

					e.returnValue = false;
					return false;
				};

				this.TextBoxBackground.HtmlElement["onselectstart"] = function(e)
				{
					oThis.m_oLogicDocument.Select_All();

					if (e.preventDefault)
						e.preventDefault();

					e.returnValue = false;
					return false;
				};
			}
		}
	}

	this.onButtonRulersClick       = function()
	{
		if (false === oThis.m_oApi.bInit_word_control || true === oThis.m_oApi.isViewMode)
			return;

		oThis.m_bIsRuler = !oThis.m_bIsRuler;
		oThis.checkNeedRules();
		oThis.OnResize(true);
	};

	this.HideRulers = function()
	{
		//if (false === oThis.m_oApi.bInit_word_control)
		//    return;

		if (oThis.m_bIsRuler === false)
			return;

		oThis.m_bIsRuler = !oThis.m_bIsRuler;
		oThis.checkNeedRules();
		oThis.OnResize(true);
	};

	this.calculate_zoom_FitToWidth = function()
	{
		var w = this.m_oEditor.AbsolutePosition.R - this.m_oEditor.AbsolutePosition.L;

		var Zoom = 100;
		if (0 != this.m_dDocumentPageWidth)
		{
			Zoom = 100 * (w - 10) / this.m_dDocumentPageWidth;

			if (Zoom < 5)
				Zoom = 5;

			if (this.m_oApi.isMobileVersion)
			{
				var _w = this.m_oEditor.HtmlElement.width;
				if (this.bIsRetinaSupport)
				{
					_w /= AscCommon.AscBrowser.retinaPixelRatio;
				}
				Zoom = 100 * _w * g_dKoef_pix_to_mm / this.m_dDocumentPageWidth;
			}
		}
		return (Zoom - 0.5) >> 0;
	};

	this.zoom_FitToWidth = function()
	{
		var _new_value = this.calculate_zoom_FitToWidth();

		this.m_nZoomType = 1;
		if (_new_value != this.m_nZoomValue)
		{
			var _old_val      = this.m_nZoomValue;
			this.m_nZoomValue = _new_value;
			this.zoom_Fire(1, _old_val);

			if (this.MobileTouchManager)
				this.MobileTouchManager.CheckZoomCriticalValues(this.m_nZoomValue);

			return true;
		}
		else
		{
			this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 1);
		}
		return false;
	};
	this.zoom_FitToPage  = function()
	{
		var w = parseInt(this.m_oEditor.HtmlElement.width) * g_dKoef_pix_to_mm;
		var h = parseInt(this.m_oEditor.HtmlElement.height) * g_dKoef_pix_to_mm;

		if (this.bIsRetinaSupport)
		{
			w = AscCommon.AscBrowser.convertToRetinaValue(w);
			h = AscCommon.AscBrowser.convertToRetinaValue(h);
		}

		var _hor_Zoom = 100;
		if (0 != this.m_dDocumentPageWidth)
			_hor_Zoom = (100 * (w - 10)) / this.m_dDocumentPageWidth;
		var _ver_Zoom = 100;
		if (0 != this.m_dDocumentPageHeight)
			_ver_Zoom = (100 * (h - 10)) / this.m_dDocumentPageHeight;

		var _new_value = parseInt(Math.min(_hor_Zoom, _ver_Zoom) - 0.5);

		if (_new_value < 5)
			_new_value = 5;

		this.m_nZoomType = 2;
		if (_new_value != this.m_nZoomValue)
		{
			var _old_val      = this.m_nZoomValue;
			this.m_nZoomValue = _new_value;
			this.zoom_Fire(2, _old_val);
			return true;
		}
		else
		{
			this.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, 2);
		}
		return false;
	};

	this.zoom_Fire = function(type, old_zoom)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		// нужно проверить режим и сбросить кеш грамотно (ie version)
		AscCommon.g_fontManager.ClearRasterMemory();

		if (AscCommon.g_fontManager2)
			AscCommon.g_fontManager2.ClearRasterMemory();

		var oWordControl = oThis;

		oWordControl.m_bIsRePaintOnScroll = false;

		var xScreen1 = oWordControl.m_oEditor.AbsolutePosition.R - oWordControl.m_oEditor.AbsolutePosition.L;
		var yScreen1 = oWordControl.m_oEditor.AbsolutePosition.B - oWordControl.m_oEditor.AbsolutePosition.T;
		xScreen1 *= g_dKoef_mm_to_pix;
		yScreen1 *= g_dKoef_mm_to_pix;

		xScreen1 >>= 1;
		yScreen1 >>= 1;

		var posDoc = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(xScreen1, yScreen1, true, undefined, old_zoom);

		oWordControl.CheckZoom();
		oWordControl.CalculateDocumentSize();

		var lCurPage = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (-1 != lCurPage)
		{
			oWordControl.m_oHorRuler.CreateBackground(oWordControl.m_oDrawingDocument.m_arrPages[lCurPage]);
			oWordControl.m_bIsUpdateHorRuler = true;
			oWordControl.m_oVerRuler.CreateBackground(oWordControl.m_oDrawingDocument.m_arrPages[lCurPage]);
			oWordControl.m_bIsUpdateVerRuler = true;
		}

		oWordControl.OnCalculatePagesPlace();
		var posScreenNew = oWordControl.m_oDrawingDocument.ConvertCoordsToCursor(posDoc.X, posDoc.Y, posDoc.Page);

		var _x_pos = oWordControl.m_oScrollHorApi.getCurScrolledX() + posScreenNew.X - xScreen1;
		var _y_pos = oWordControl.m_oScrollVerApi.getCurScrolledY() + posScreenNew.Y - yScreen1;

		_x_pos = Math.max(0, Math.min(_x_pos, oWordControl.m_dScrollX_max));
		_y_pos = Math.max(0, Math.min(_y_pos, oWordControl.m_dScrollY_max));

		// TODO: заглушка под открытие. мы любим открывать файлы с зумом. И тогда документ не в начале открывается, а с
		// малениким проскролливанием
		if (oWordControl.m_dScrollY == 0)
			_y_pos = 0;

		oWordControl.m_oScrollVerApi.scrollToY(_y_pos);
		oWordControl.m_oScrollHorApi.scrollToX(_x_pos);

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize();

		oWordControl.m_oApi.sync_zoomChangeCallback(this.m_nZoomValue, type);
		oWordControl.m_bIsUpdateTargetNoAttack = true;
		oWordControl.m_bIsRePaintOnScroll      = true;


		oWordControl.OnScroll();

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize_After();
	};

	this.zoom_Out = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		oThis.m_nZoomType = 0;

		var _zooms = oThis.zoom_values;
		var _count = _zooms.length;

		var _Zoom = _zooms[0];
		for (var i = (_count - 1); i >= 0; i--)
		{
			if (this.m_nZoomValue > _zooms[i])
			{
				_Zoom = _zooms[i];
				break;
			}
		}

		if (oThis.m_nZoomValue <= _Zoom)
			return;

		var _old_val       = oThis.m_nZoomValue;
		oThis.m_nZoomValue = _Zoom;
		oThis.zoom_Fire(0, _old_val);
	};

	this.zoom_In = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		oThis.m_nZoomType = 0;

		var _zooms = oThis.zoom_values;
		var _count = _zooms.length;

		var _Zoom = _zooms[_count - 1];
		for (var i = 0; i < _count; i++)
		{
			if (this.m_nZoomValue < _zooms[i])
			{
				_Zoom = _zooms[i];
				break;
			}
		}

		if (oThis.m_nZoomValue >= _Zoom)
			return;

		var _old_val       = oThis.m_nZoomValue;
		oThis.m_nZoomValue = _Zoom;
		oThis.zoom_Fire(0, _old_val);
	};

	this.ToSearchResult = function()
	{
		var naviG = this.m_oDrawingDocument.CurrentSearchNavi;

		var navi = naviG[0];
		var x    = navi.X;
		var y    = navi.Y;

		var type    = (naviG.Type & 0xFF);
		var PageNum = navi.PageNum;

		if (navi.Transform)
		{
			var xx = navi.Transform.TransformPointX(x, y);
			var yy = navi.Transform.TransformPointY(x, y);

			x = xx;
			y = yy;
		}

		var rectSize = (navi.H * this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
		var pos      = this.m_oDrawingDocument.ConvertCoordsToCursor2(x, y, PageNum);

		if (true === pos.Error)
			return;

		var boxX = 0;
		var boxY = 0;
		var boxR = this.m_oEditor.HtmlElement.width - 2;
		var boxB = this.m_oEditor.HtmlElement.height - rectSize;

		/*
		 if (true == this.m_bIsRuler)
		 {
		 boxX += Number(5 * g_dKoef_mm_to_pix);
		 boxY += Number(7 * g_dKoef_mm_to_pix);
		 boxR += Number(5 * g_dKoef_mm_to_pix);
		 boxB += Number(7 * g_dKoef_mm_to_pix);
		 }
		 */

		var nValueScrollHor = 0;
		if (pos.X < boxX)
		{
			//nValueScrollHor = boxX - pos.X;
			//nValueScrollHor = pos.X;
			nValueScrollHor = this.GetHorizontalScrollTo(x, PageNum);
		}
		if (pos.X > boxR)
		{
			//nValueScrollHor = boxR - pos.X;
			//nValueScrollHor = pos.X + this.m_oWordControl.m_oEditor.HtmlElement.width;
			var _mem        = x - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.width * 100 / this.m_nZoomValue;
			nValueScrollHor = this.GetHorizontalScrollTo(_mem, PageNum);
		}

		var nValueScrollVer = 0;
		if (pos.Y < boxY)
		{
			//nValueScrollVer = boxY - pos.Y;
			//nValueScrollVer = pos.Y;
			nValueScrollVer = this.GetVerticalScrollTo(y, PageNum);
		}
		if (pos.Y > boxB)
		{
			//nValueScrollVer = boxB - pos.Y;
			//nValueScrollHor = pos.Y + this.m_oWordControl.m_oEditor.HtmlElement.height;
			var _mem        = y + navi.H + 10 - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.height * 100 / this.m_nZoomValue;
			nValueScrollVer = this.GetVerticalScrollTo(_mem, PageNum);
		}

		var isNeedScroll = false;
		if (0 != nValueScrollHor)
		{
			isNeedScroll                   = true;
			this.m_bIsUpdateTargetNoAttack = true;
			var temp                       = nValueScrollHor * this.m_dScrollX_max / (this.m_dDocumentWidth - this.m_oEditor.HtmlElement.width);
			this.m_oScrollHorApi.scrollToX(parseInt(temp), false);
		}
		if (0 != nValueScrollVer)
		{
			isNeedScroll                   = true;
			this.m_bIsUpdateTargetNoAttack = true;
			var temp                       = nValueScrollVer * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
			this.m_oScrollVerApi.scrollToY(parseInt(temp), false);
		}

		if (true === isNeedScroll)
		{
			this.OnScroll();
			return;
		}

		// и, в самом конце, перерисовываем оверлей
		this.OnUpdateOverlay();
	};

	this.ScrollToPosition = function(x, y, PageNum)
	{
		if (PageNum < 0 || PageNum >= this.m_oDrawingDocument.m_lCountCalculatePages)
			return;

		var _h       = 5;
		var rectSize = (_h * g_dKoef_mm_to_pix / 100);
		var pos      = this.m_oDrawingDocument.ConvertCoordsToCursor2(x, y, PageNum);

		if (true === pos.Error)
			return;

		var boxX = 0;
		var boxY = 0;
		var boxR = this.m_oEditor.HtmlElement.width - 2;
		var boxB = this.m_oEditor.HtmlElement.height - rectSize;

		var nValueScrollHor = 0;
		if (pos.X < boxX)
		{
			nValueScrollHor = this.GetHorizontalScrollTo(x, PageNum);
		}
		if (pos.X > boxR)
		{
			var _mem        = x - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.width * 100 / this.m_nZoomValue;
			nValueScrollHor = this.GetHorizontalScrollTo(_mem, PageNum);
		}

		var nValueScrollVer = 0;
		if (pos.Y < boxY)
		{
			nValueScrollVer = this.GetVerticalScrollTo(y, PageNum);
		}
		if (pos.Y > boxB)
		{
			var _mem        = y + _h + 10 - g_dKoef_pix_to_mm * this.m_oEditor.HtmlElement.height * 100 / this.m_nZoomValue;
			nValueScrollVer = this.GetVerticalScrollTo(_mem, PageNum);
		}

		var isNeedScroll = false;
		if (0 != nValueScrollHor)
		{
			isNeedScroll                   = true;
			this.m_bIsUpdateTargetNoAttack = true;
			var temp                       = nValueScrollHor * this.m_dScrollX_max / (this.m_dDocumentWidth - this.m_oEditor.HtmlElement.width);
			this.m_oScrollHorApi.scrollToX(parseInt(temp), false);
		}
		if (0 != nValueScrollVer)
		{
			isNeedScroll                   = true;
			this.m_bIsUpdateTargetNoAttack = true;
			var temp                       = nValueScrollVer * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
			this.m_oScrollVerApi.scrollToY(parseInt(temp), false);
		}

		if (true === isNeedScroll)
		{
			this.OnScroll();
			return;
		}
	};

	this.onButtonTabsClick = function()
	{
		var oWordControl = oThis;
		if (oWordControl.m_nTabsType == AscCommon.g_tabtype_left)
		{
			oWordControl.m_nTabsType = AscCommon.g_tabtype_center;
			oWordControl.onButtonTabsDraw();
		}
		else if (oWordControl.m_nTabsType == AscCommon.g_tabtype_center)
		{
			oWordControl.m_nTabsType = AscCommon.g_tabtype_right;
			oWordControl.onButtonTabsDraw();
		}
		else
		{
			oWordControl.m_nTabsType = AscCommon.g_tabtype_left;
			oWordControl
				.onButtonTabsDraw();
		}
	};

	this.onButtonTabsDraw = function()
	{
		var _ctx = this.m_oLeftRuler_buttonsTabs.HtmlElement.getContext('2d');
		if (this.bIsRetinaSupport)
		{
			_ctx.setTransform(AscCommon.AscBrowser.retinaPixelRatio, 0, 0, AscCommon.AscBrowser.retinaPixelRatio, 0, 0);
		}
		else
		{
			_ctx.setTransform(1, 0, 0, 1, 0, 0);
		}

		var _width  = 19;
		var _height = 19;

		_ctx.clearRect(0, 0, 19, 19);

		_ctx.lineWidth   = 1;
		_ctx.strokeStyle = "#BBBEC2";
		_ctx.strokeRect(2.5, 3.5, 14, 14);
		_ctx.beginPath();

		_ctx.strokeStyle = "#3E3E3E";

		_ctx.lineWidth = 2;
		if (this.m_nTabsType == AscCommon.g_tabtype_left)
		{
			_ctx.moveTo(8, 9);
			_ctx.lineTo(8, 14);
			_ctx.lineTo(13, 14);
		}
		else if (this.m_nTabsType == AscCommon.g_tabtype_center)
		{
			_ctx.moveTo(6, 14);
			_ctx.lineTo(14, 14);
			_ctx.moveTo(10, 9);
			_ctx.lineTo(10, 14);
		}
		else
		{
			_ctx.moveTo(12, 9);
			_ctx.lineTo(12, 14);
			_ctx.lineTo(7, 14);
		}

		_ctx.stroke();
		_ctx.beginPath();
	};

	this.onPrevPage = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;
		if (0 < oWordControl.m_oDrawingDocument.m_lCurrentPage)
		{
			oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lCurrentPage - 1);
		}
		else
		{
			oWordControl.GoToPage(0);
		}
	};
	this.onNextPage = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;
		if ((oWordControl.m_oDrawingDocument.m_lPagesCount - 1) > oWordControl.m_oDrawingDocument.m_lCurrentPage)
		{
			oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lCurrentPage + 1);
		}
		else if (oWordControl.m_oDrawingDocument.m_lPagesCount > 0)
		{
			oWordControl.GoToPage(oWordControl.m_oDrawingDocument.m_lPagesCount - 1);
		}
	};

	this.horRulerMouseDown = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oHorRuler.OnMouseDown(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
	};
	this.horRulerMouseUp   = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oHorRuler.OnMouseUp(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
	};
	this.horRulerMouseMove = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oHorRuler.OnMouseMove(oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.left, 0, e);
	};

	this.verRulerMouseDown = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oVerRuler.OnMouseDown(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
	};
	this.verRulerMouseUp   = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oVerRuler.OnMouseUp(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
	};
	this.verRulerMouseMove = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		var _cur_page = oWordControl.m_oDrawingDocument.m_lCurrentPage;
		if (_cur_page < 0 || _cur_page >= oWordControl.m_oDrawingDocument.m_lPagesCount)
			return;

		oWordControl.m_oVerRuler.OnMouseMove(0, oWordControl.m_oDrawingDocument.m_arrPages[_cur_page].drawingPage.top, e);
	};

	this.SelectWheel = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;
		var positionMinY = oWordControl.m_oMainContent.AbsolutePosition.T * g_dKoef_mm_to_pix + oWordControl.Y;
		if (oWordControl.m_bIsRuler)
			positionMinY = (oWordControl.m_oMainContent.AbsolutePosition.T + oWordControl.m_oTopRuler_horRuler.AbsolutePosition.B) * g_dKoef_mm_to_pix +
				oWordControl.Y;

		// если находимся в самом верху (без тулбара) - то наверх не будем скроллиться
		// делаем заглушку
		var minPosY = 20;
		if (oThis.bIsRetinaSupport)
			minPosY *= AscCommon.AscBrowser.retinaPixelRatio;
		if (positionMinY < minPosY)
			positionMinY = minPosY;

		var positionMaxY = oWordControl.m_oMainContent.AbsolutePosition.B * g_dKoef_mm_to_pix + oWordControl.Y;

		var scrollYVal = 0;
		if (global_mouseEvent.Y < positionMinY)
		{
			var delta = 30;
			if (20 > (positionMinY - global_mouseEvent.Y))
				delta = 10;

			scrollYVal = -delta;
			//oWordControl.m_oScrollVerApi.scrollByY(-delta, false);
			//oWordControl.onMouseMove2();
			//return;
		}
		else if (global_mouseEvent.Y > positionMaxY)
		{
			var delta = 30;
			if (20 > (global_mouseEvent.Y - positionMaxY))
				delta = 10;

			scrollYVal = delta;
			//oWordControl.m_oScrollVerApi.scrollByY(delta, false);
			//oWordControl.onMouseMove2();
			//return;
		}

		var scrollXVal = 0;
		if (oWordControl.m_bIsHorScrollVisible)
		{
			var positionMinX = oWordControl.m_oMainContent.AbsolutePosition.L * g_dKoef_mm_to_pix + oWordControl.X;
			if (oWordControl.m_bIsRuler)
				positionMinX += oWordControl.m_oLeftRuler.AbsolutePosition.R * g_dKoef_mm_to_pix;

			var positionMaxX = oWordControl.m_oMainContent.AbsolutePosition.R * g_dKoef_mm_to_pix + oWordControl.X;

			if (global_mouseEvent.X < positionMinX)
			{
				var delta = 30;
				if (20 > (positionMinX - global_mouseEvent.X))
					delta = 10;

				scrollXVal = -delta;
				//oWordControl.m_oScrollHorApi.scrollByX(-delta, false);
				//oWordControl.onMouseMove2();
				//return;
			}
			else if (global_mouseEvent.X > positionMaxX)
			{
				var delta = 30;
				if (20 > (global_mouseEvent.X - positionMaxX))
					delta = 10;

				scrollXVal = delta;
				//oWordControl.m_oScrollVerApi.scrollByX(delta, false);
				//oWordControl.onMouseMove2();
				//return;
			}
		}

		if (0 != scrollYVal)
			oWordControl.m_oScrollVerApi.scrollByY(scrollYVal, false);
		if (0 != scrollXVal)
			oWordControl.m_oScrollHorApi.scrollByX(scrollXVal, false);

		if (scrollXVal != 0 || scrollYVal != 0)
			oWordControl.onMouseMove2();
	};

	this.onMouseDown = function(e, isTouch)
	{
		oThis.m_oApi.checkLastWork();

		//console.log("down: " + isTouch + ", " + AscCommon.isTouch);
		if (false === oThis.m_oApi.bInit_word_control || (AscCommon.isTouch && undefined === isTouch))
			return;

		if (!oThis.m_bIsIE)
		{
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		}

		if (AscCommon.g_inputContext && AscCommon.g_inputContext.externalChangeFocus())
			return;

		var oWordControl = oThis;

		if (this.id == "id_viewer" && oThis.m_oOverlay.HtmlElement.style.display == "block")
			return;

		var _xOffset = oWordControl.X;
		var _yOffset = oWordControl.Y;

		if (true === oWordControl.m_bIsRuler)
		{
			_xOffset += (5 * g_dKoef_mm_to_pix);
			_yOffset += (7 * g_dKoef_mm_to_pix);
		}

		if (window['closeDialogs'] != undefined)
			window['closeDialogs']();

		AscCommon.check_MouseDownEvent(e, true);
		global_mouseEvent.LockMouse();

		// у Илюхи есть проблема при вводе с клавы, пока нажата кнопка мыши
		if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button))
		{
			oWordControl.m_bIsMouseLock = true;
		}

		oWordControl.StartUpdateOverlay();
		var bIsSendSelectWhell = false;

		if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button))
		{
			var pos = null;
			if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1)
				pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
			else
				pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);

			if (pos.Page == -1)
			{
				oWordControl.EndUpdateOverlay();
				return;
			}

			if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page))
			{
				oWordControl.EndUpdateOverlay();
				return;
			}

			if (null == oWordControl.m_oDrawingDocument.m_oDocumentRenderer)
			{
				// теперь проверить трек таблиц
				var ret = oWordControl.m_oDrawingDocument.checkMouseDown_Drawing(pos);
				if (ret === true)
					return;

				if (-1 == oWordControl.m_oTimerScrollSelect)
				{
					// добавим это и здесь, чтобы можно было отменять во время LogicDocument.OnMouseDown
					oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
					bIsSendSelectWhell                = true;
				}

				oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = true;
				oWordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
				oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = false;

				oWordControl.MouseDownDocumentCounter++;
			}
			else
			{
				oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseDown(pos.Page, pos.X, pos.Y);
				oWordControl.MouseDownDocumentCounter++;
			}
		}
		else if (global_mouseEvent.Button == 2)
			oWordControl.MouseDownDocumentCounter++;

		if (!bIsSendSelectWhell && -1 == oWordControl.m_oTimerScrollSelect)
		{
			oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
		}

		oWordControl.EndUpdateOverlay();
	};

	this.onMouseMove  = function(e, isTouch)
	{
		oThis.m_oApi.checkLastWork();

		if (false === oThis.m_oApi.bInit_word_control || (AscCommon.isTouch && undefined === isTouch))
			return;

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		var oWordControl = oThis;

		//if (this.id == "id_viewer" && oThis.m_oOverlay.HtmlElement.style.display == "block")
		//    return;

		AscCommon.check_MouseMoveEvent(e);
		var pos = null;
		if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1)
			pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
		else
			pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);

		if (pos.Page == -1)
			return;

		if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page))
			return;

		if (oWordControl.m_oDrawingDocument.m_sLockedCursorType != "")
			oWordControl.m_oDrawingDocument.SetCursorType("default");
		if (oWordControl.m_oDrawingDocument.m_oDocumentRenderer != null)
		{
			oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseMove(pos.Page, pos.X, pos.Y);
			return;
		}

		oWordControl.StartUpdateOverlay();
		var is_drawing = oWordControl.m_oDrawingDocument.checkMouseMove_Drawing(pos);
		if (is_drawing === true)
			return;

		oWordControl.m_oDrawingDocument.TableOutlineDr.bIsNoTable = true;
		oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);

		if (oWordControl.m_oDrawingDocument.TableOutlineDr.bIsNoTable === false)
		{
			// TODO: нужно посмотреть, может в ЭТОМ же месте трек для таблицы уже нарисован
			oWordControl.ShowOverlay();
			oWordControl.OnUpdateOverlay();
		}

		oWordControl.EndUpdateOverlay();
	};
	this.onMouseMove2 = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;
		var pos          = null;
		if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1)
			pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
		else
			pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);

		if (pos.Page == -1)
			return;

		if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseMove(pos.Page, pos.X, pos.Y);
			return;
		}

		if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page))
			return;

		oWordControl.StartUpdateOverlay();

		var is_drawing = oWordControl.m_oDrawingDocument.checkMouseMove_Drawing(pos);
		if (is_drawing === true)
			return;

		oWordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
		oWordControl.EndUpdateOverlay();
	};
	this.onMouseUp    = function(e, bIsWindow, isTouch)
	{
		oThis.m_oApi.checkLastWork();

		//console.log("up: " + isTouch + ", " + AscCommon.isTouch);
		if (false === oThis.m_oApi.bInit_word_control || (AscCommon.isTouch && undefined === isTouch))
			return;
		//if (true == global_mouseEvent.IsLocked)
		//    return;

		var oWordControl = oThis;
		if (!global_mouseEvent.IsLocked && 0 == oWordControl.MouseDownDocumentCounter)
			return;

		if (this.id == "id_viewer" && oThis.m_oOverlay.HtmlElement.style.display == "block" && undefined == bIsWindow)
			return;

		if ((global_mouseEvent.Sender != oThis.m_oEditor.HtmlElement &&
			global_mouseEvent.Sender != oThis.m_oOverlay.HtmlElement &&
			global_mouseEvent.Sender != oThis.m_oDrawingDocument.TargetHtmlElement) &&
			(oThis.TextBoxBackground && oThis.TextBoxBackground.HtmlElement != global_mouseEvent.Sender))
			return;

		if (-1 != oWordControl.m_oTimerScrollSelect)
		{
			clearInterval(oWordControl.m_oTimerScrollSelect);
			oWordControl.m_oTimerScrollSelect = -1;
		}

		if (oWordControl.m_oHorRuler.m_bIsMouseDown)
			oWordControl.m_oHorRuler.OnMouseUpExternal();

		if (oWordControl.m_oVerRuler.DragType != 0)
			oWordControl.m_oVerRuler.OnMouseUpExternal();

		if (oWordControl.m_oScrollVerApi.getIsLockedMouse())
		{
			oWordControl.m_oScrollVerApi.evt_mouseup(e);
		}
		if (oWordControl.m_oScrollHorApi.getIsLockedMouse())
		{
			oWordControl.m_oScrollHorApi.evt_mouseup(e);
		}

		AscCommon.check_MouseUpEvent(e);
		var pos = null;
		if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1)
			pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
		else
			pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);

		if (pos.Page == -1)
			return;

		if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page))
			return;

		oWordControl.m_oDrawingDocument.UnlockCursorType();

		oWordControl.StartUpdateOverlay();

		// восстанавливаем фокус
		oWordControl.m_bIsMouseLock = false;

		var is_drawing = oWordControl.m_oDrawingDocument.checkMouseUp_Drawing(pos);
		if (is_drawing === true)
			return;

		if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseUp();

			oWordControl.MouseDownDocumentCounter--;
			if (oWordControl.MouseDownDocumentCounter < 0)
				oWordControl.MouseDownDocumentCounter = 0;

			oWordControl.EndUpdateOverlay();
			return;
		}

		oWordControl.m_bIsMouseUpSend = true;

		if (2 == global_mouseEvent.Button)
		{
			// пошлем сначала моусдаун
			//oWordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
		}
		oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = true;
		oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
		oWordControl.m_oDrawingDocument.NeedScrollToTargetFlag = false;

		oWordControl.MouseDownDocumentCounter--;
		if (oWordControl.MouseDownDocumentCounter < 0)
			oWordControl.MouseDownDocumentCounter = 0;

		oWordControl.m_bIsMouseUpSend = false;
		oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		oWordControl.m_oLogicDocument.Document_UpdateRulersState();

		oWordControl.EndUpdateOverlay();
	};

	this.onMouseUpMainSimple = function()
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;

		global_mouseEvent.Type = AscCommon.g_mouse_event_type_up;

		AscCommon.MouseUpLock.MouseUpLockedSend = true;

		global_mouseEvent.Sender = null;

		global_mouseEvent.UnLockMouse();

		global_mouseEvent.IsPressed = false;

		if (-1 != oWordControl.m_oTimerScrollSelect)
		{
			clearInterval(oWordControl.m_oTimerScrollSelect);
			oWordControl.m_oTimerScrollSelect = -1;
		}
	};

	this.onMouseUpExternal = function(x, y)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl = oThis;

		//---
		global_mouseEvent.X = x;
		global_mouseEvent.Y = y;

		global_mouseEvent.Type = AscCommon.g_mouse_event_type_up;

		AscCommon.MouseUpLock.MouseUpLockedSend = true;

		if (oWordControl.m_oHorRuler.m_bIsMouseDown)
			oWordControl.m_oHorRuler.OnMouseUpExternal();

		if (oWordControl.m_oVerRuler.DragType != 0)
			oWordControl.m_oVerRuler.OnMouseUpExternal();

		if (oWordControl.m_oScrollVerApi.getIsLockedMouse())
		{
			var __e = {clientX : x, clientY : y};
			oWordControl.m_oScrollVerApi.evt_mouseup(__e);
		}
		if (oWordControl.m_oScrollHorApi.getIsLockedMouse())
		{
			var __e = {clientX : x, clientY : y};
			oWordControl.m_oScrollHorApi.evt_mouseup(__e);
		}

		if (window.g_asc_plugins)
            window.g_asc_plugins.onExternalMouseUp();

		global_mouseEvent.Sender = null;

		global_mouseEvent.UnLockMouse();

		global_mouseEvent.IsPressed = false;

		if (-1 != oWordControl.m_oTimerScrollSelect)
		{
			clearInterval(oWordControl.m_oTimerScrollSelect);
			oWordControl.m_oTimerScrollSelect = -1;
		}

		//---
		var pos = null;
		if (oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum == -1)
			pos = oWordControl.m_oDrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
		else
			pos = oWordControl.m_oDrawingDocument.ConvetToPageCoords(global_mouseEvent.X, global_mouseEvent.Y, oWordControl.m_oDrawingDocument.AutoShapesTrackLockPageNum);

		if (pos.Page == -1)
			return;

		if (oWordControl.m_oDrawingDocument.IsFreezePage(pos.Page))
			return;

		oWordControl.m_oDrawingDocument.UnlockCursorType();

		oWordControl.StartUpdateOverlay();

		// восстанавливаем фокус
		oWordControl.m_bIsMouseLock = false;

		var is_drawing = oWordControl.m_oDrawingDocument.checkMouseUp_Drawing(pos);
		if (is_drawing === true)
			return;

		if (null != oWordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnMouseUp();

			oWordControl.MouseDownDocumentCounter--;
			if (oWordControl.MouseDownDocumentCounter < 0)
				oWordControl.MouseDownDocumentCounter = 0;

			oWordControl.EndUpdateOverlay();
			return;
		}

		oWordControl.m_bIsMouseUpSend = true;

		if (2 == global_mouseEvent.Button)
		{
			// пошлем сначала моусдаун
			//oWordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
		}
		oWordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);

		oWordControl.MouseDownDocumentCounter--;
		if (oWordControl.MouseDownDocumentCounter < 0)
			oWordControl.MouseDownDocumentCounter = 0;

		oWordControl.m_bIsMouseUpSend = false;
		oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		oWordControl.m_oLogicDocument.Document_UpdateRulersState();

		oWordControl.EndUpdateOverlay();
	};

	this.onMouseWhell = function(e)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		if (undefined !== window["AscDesktopEditor"])
		{
			if (false === window["AscDesktopEditor"]["CheckNeedWheel"]())
				return;
		}

		var _ctrl = false;
		if (e.metaKey !== undefined)
			_ctrl = e.ctrlKey || e.metaKey;
		else
			_ctrl = e.ctrlKey;

		if (true === _ctrl)
		{
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;

			return false;
		}

		var delta  = 0;
		var deltaX = 0;
		var deltaY = 0;

		if (undefined != e.wheelDelta && e.wheelDelta != 0)
		{
			//delta = (e.wheelDelta > 0) ? -45 : 45;
			delta = -45 * e.wheelDelta / 120;
		}
		else if (undefined != e.detail && e.detail != 0)
		{
			//delta = (e.detail > 0) ? 45 : -45;
			delta = 45 * e.detail / 3;
		}

		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;

		if (oThis.m_bIsHorScrollVisible)
		{
			if (e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS)
			{
				deltaY = 0;
				deltaX = delta;
			}

			// Webkit
			if (undefined !== e.wheelDeltaY && 0 !== e.wheelDeltaY)
			{
				//deltaY = (e.wheelDeltaY > 0) ? -45 : 45;
				deltaY = -45 * e.wheelDeltaY / 120;
			}
			if (undefined !== e.wheelDeltaX && 0 !== e.wheelDeltaX)
			{
				//deltaX = (e.wheelDeltaX > 0) ? -45 : 45;
				deltaX = -45 * e.wheelDeltaX / 120;
			}
		}

		deltaX >>= 0;
		deltaY >>= 0;

		if (0 != deltaX)
			oThis.m_oScrollHorApi.scrollBy(deltaX, 0, false);
		else if (0 != deltaY)
			oThis.m_oScrollVerApi.scrollBy(0, deltaY, false);

		// здесь - имитируем моус мув ---------------------------
		var _e   = {};
		_e.pageX = global_mouseEvent.X;
		_e.pageY = global_mouseEvent.Y;

		_e.clientX = global_mouseEvent.X;
		_e.clientY = global_mouseEvent.Y;

		_e.altKey   = global_mouseEvent.AltKey;
		_e.shiftKey = global_mouseEvent.ShiftKey;
		_e.ctrlKey  = global_mouseEvent.CtrlKey;
		_e.metaKey  = global_mouseEvent.CtrlKey;

		_e.srcElement = global_mouseEvent.Sender;

		oThis.onMouseMove(_e);
		// ------------------------------------------------------

		if (e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;

		return false;
	};

	this.checkViewerModeKeys = function(e)
	{
		var isSendEditor = false;
		if (e.KeyCode == 33) // PgUp
		{
			//
		}
		else if (e.KeyCode == 34) // PgDn
		{
			//
		}
		else if (e.KeyCode == 35) // клавиша End
		{
			if (true === e.CtrlKey) // Ctrl + End - переход в конец документа
			{
				oThis.m_oScrollVerApi.scrollTo(0, oThis.m_dScrollY_max);
			}
		}
		else if (e.KeyCode == 36) // клавиша Home
		{
			if (true === e.CtrlKey) // Ctrl + Home - переход в начало документа
			{
				oThis.m_oScrollVerApi.scrollTo(0, 0);
			}
		}
		else if (e.KeyCode == 37) // Left Arrow
		{
			if (oThis.m_bIsHorScrollVisible)
			{
				oThis.m_oScrollHorApi.scrollBy(-30, 0, false);
			}
		}
		else if (e.KeyCode == 38) // Top Arrow
		{
			oThis.m_oScrollVerApi.scrollBy(0, -30, false);
		}
		else if (e.KeyCode == 39) // Right Arrow
		{
			if (oThis.m_bIsHorScrollVisible)
			{
				oThis.m_oScrollHorApi.scrollBy(30, 0, false);
			}
		}
		else if (e.KeyCode == 40) // Bottom Arrow
		{
			oThis.m_oScrollVerApi.scrollBy(0, 30, false);
		}
		else if (e.KeyCode == 65 && true === e.CtrlKey) // Ctrl + A - выделяем все
		{
			isSendEditor = true;
		}
		else if (e.KeyCode == 67 && true === e.CtrlKey) // Ctrl + C + ...
		{
			if (false === e.ShiftKey)
			{
				AscCommon.Editor_Copy(oThis.m_oApi);
				//не возвращаем true чтобы не было preventDefault
			}
		}
		return isSendEditor;
	};

	this.ChangeReaderMode = function()
	{
		if (this.ReaderModeCurrent)
			this.DisableReaderMode();
		else
			this.EnableReaderMode();
	};

	this.IncreaseReaderFontSize = function()
	{
		if (null == this.ReaderModeDiv)
			return;

		if (this.ReaderFontSizeCur >= (this.ReaderFontSizes.length - 1))
		{
			this.ReaderFontSizeCur = this.ReaderFontSizes.length - 1;
			return;
		}
		this.ReaderFontSizeCur++;
		this.ReaderModeDiv.style.fontSize = this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt";

		this.ReaderTouchManager.ChangeFontSize();
	};
	this.DecreaseReaderFontSize = function()
	{
		if (null == this.ReaderModeDiv)
			return;

		if (this.ReaderFontSizeCur <= 0)
		{
			this.ReaderFontSizeCur = 0;
			return;
		}
		this.ReaderFontSizeCur--;
		this.ReaderModeDiv.style.fontSize = this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt";

		this.ReaderTouchManager.ChangeFontSize();
	};

	this.IsReaderMode        = function()
	{
		return (this.ReaderModeCurrent == 1);
	};
	this.UpdateReaderContent = function()
	{
		if (this.ReaderModeCurrent == 1 && this.ReaderModeDivWrapper != null)
		{
			this.ReaderModeDivWrapper.innerHTML = "<div id=\"reader_id\" style=\"width:100%;display:block;z-index:9;font-family:arial;font-size:" +
				this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt;position:absolute;resize:none;-webkit-box-sizing:border-box;box-sizing:border-box;padding-left:5%;padding-right:5%;padding-top:10%;padding-bottom:10%;background-color:#FFFFFF;\">" +
				this.m_oApi.ContentToHTML(true) + "</div>";
		}
	};

	this.EnableReaderMode = function()
	{
		this.ReaderModeCurrent = 1;
		if (this.ReaderTouchManager)
		{
			this.TransformDivUseAnimation(this.ReaderModeDivWrapper, 0);
			return;
		}

		this.ReaderModeDivWrapper = document.createElement('div');
		this.ReaderModeDivWrapper.setAttribute("style", "z-index:11;font-family:arial;font-size:12pt;position:absolute;\
            resize:none;padding:0px;display:block;\
            margin:0px;left:0px;top:0px;background-color:#FFFFFF");

		var _c_h                               = parseInt(oThis.m_oMainView.HtmlElement.style.height);
		this.ReaderModeDivWrapper.style.top    = _c_h + "px";
		this.ReaderModeDivWrapper.style.width  = this.m_oMainView.HtmlElement.style.width;
		this.ReaderModeDivWrapper.style.height = this.m_oMainView.HtmlElement.style.height;

		this.ReaderModeDivWrapper.id        = "wrapper_reader_id";
		this.ReaderModeDivWrapper.innerHTML = "<div id=\"reader_id\" style=\"width:100%;display:block;z-index:9;font-family:arial;font-size:" +
			this.ReaderFontSizes[this.ReaderFontSizeCur] + "pt;position:absolute;resize:none;-webkit-box-sizing:border-box;box-sizing:border-box;padding-left:5%;padding-right:5%;padding-top:10%;padding-bottom:10%;background-color:#FFFFFF;\">" +
			this.m_oApi.ContentToHTML(true) + "</div>";

		this.m_oMainView.HtmlElement.appendChild(this.ReaderModeDivWrapper);

		this.ReaderModeDiv = document.getElementById("reader_id");

		if (this.MobileTouchManager)
		{
			this.MobileTouchManager.Destroy();
			this.MobileTouchManager = null;
		}

		this.ReaderTouchManager = new AscCommon.CReaderTouchManager();
		this.ReaderTouchManager.Init(this.m_oApi);

		this.TransformDivUseAnimation(this.ReaderModeDivWrapper, 0);

		var __hasTouch = 'ontouchstart' in window;

		if (__hasTouch)
		{
			this.ReaderModeDivWrapper["ontouchcancel"] = function(e)
			{
				return oThis.ReaderTouchManager.onTouchEnd(e);
			}

			this.ReaderModeDivWrapper["ontouchstart"] = function(e)
			{
				return oThis.ReaderTouchManager.onTouchStart(e);
			}
			this.ReaderModeDivWrapper["ontouchmove"]  = function(e)
			{
				return oThis.ReaderTouchManager.onTouchMove(e);
			}
			this.ReaderModeDivWrapper["ontouchend"]   = function(e)
			{
				return oThis.ReaderTouchManager.onTouchEnd(e);
			}
		}
		else
		{
			this.ReaderModeDivWrapper["onmousedown"] = function(e)
			{
				return oThis.ReaderTouchManager.onTouchStart(e);
			}
			this.ReaderModeDivWrapper["onmousemove"] = function(e)
			{
				return oThis.ReaderTouchManager.onTouchMove(e);
			}
			this.ReaderModeDivWrapper["onmouseup"]   = function(e)
			{
				return oThis.ReaderTouchManager.onTouchEnd(e);
			}
		}

		//this.m_oEditor.HtmlElement.style.display = "none";
		//this.m_oOverlay.HtmlElement.style.display = "none";
	};

	this.DisableReaderMode = function()
	{
		this.ReaderModeCurrent = 0;
		if (null == this.ReaderModeDivWrapper)
			return;

		this.TransformDivUseAnimation(this.ReaderModeDivWrapper, parseInt(this.ReaderModeDivWrapper.style.height) + 10);
		setTimeout(this.CheckDestroyReader, 500);
		return;
	};

	this.CheckDestroyReader = function()
	{
		if (oThis.ReaderModeDivWrapper != null)
		{
			if (parseInt(oThis.ReaderModeDivWrapper.style.top) > parseInt(oThis.ReaderModeDivWrapper.style.height))
			{
				oThis.m_oMainView.HtmlElement.removeChild(oThis.ReaderModeDivWrapper);

				oThis.ReaderModeDivWrapper = null;
				oThis.ReaderModeDiv        = null;

				oThis.ReaderTouchManager.Destroy();
				oThis.ReaderTouchManager = null;

				oThis.ReaderModeCurrent = 0;

				if (oThis.m_oApi.isMobileVersion)
				{
					oThis.MobileTouchManager = new AscCommon.CMobileTouchManager();
					oThis.MobileTouchManager.Init(oThis.m_oApi);
					oThis.MobileTouchManager.Resize();
				}

				return;
			}

			if (oThis.ReaderModeCurrent == 0)
			{
				setTimeout(oThis.CheckDestroyReader, 200);
			}
		}
	};

	this.TransformDivUseAnimation = function(_div, topPos)
	{
		_div.style[window.asc_sdk_transitionProperty] = "top";
		_div.style[window.asc_sdk_transitionDuration] = "1000ms";
		_div.style.top                                = topPos + "px";
	};

	this.onKeyDown = function(e)
	{
		oThis.m_oApi.checkLastWork();

		if (oThis.m_oApi.isLongAction())
		{
			e.preventDefault();
			return;
		}

		var oWordControl = oThis;
		if (false === oWordControl.m_oApi.bInit_word_control)
		{
			AscCommon.check_KeyboardEvent2(e);
			e.preventDefault();
			return;
		}

		if (oWordControl.m_bIsRuler && oWordControl.m_oHorRuler.m_bIsMouseDown)
		{
			AscCommon.check_KeyboardEvent2(e);
			e.preventDefault();
			return;
		}

		// Esc даем делать с клавы, даже когда мышка зажата, чтобы можно было сбросить drag-n-drop, но если у нас
		// идет работа с автофигурами (любые движения), тогда не пропускаем.
		if (oWordControl.m_bIsMouseLock === true && (27 !== e.keyCode || true === oWordControl.m_oLogicDocument.Is_TrackingDrawingObjects()))
		{
			if (!window.USER_AGENT_MACOS)
			{
				AscCommon.check_KeyboardEvent2(e);
				e.preventDefault();
				return;
			}

			// на масОс есть мега выделение на трекпаде. там моусАп приходит с задержкой.
			// нужно лдибо копить команды клавиатуры, либо насильно заранее сделать моусАп самому.
			// мы выбараем второе

			oWordControl.onMouseUpExternal(global_mouseEvent.X, global_mouseEvent.Y);
		}

		AscCommon.check_KeyboardEvent(e);
		if (oWordControl.IsFocus === false)
		{
			// некоторые команды нужно продолжать обрабатывать
			if (!oWordControl.onKeyDownNoActiveControl(global_keyboardEvent))
				return;
		}

		/*
		 if (oThis.ChangeHintProps())
		 {
		 e.preventDefault();
		 oThis.OnScroll();
		 return;
		 }
		 */
		if (null == oWordControl.m_oLogicDocument)
		{
			var bIsPrev = (oWordControl.m_oDrawingDocument.m_oDocumentRenderer.OnKeyDown(global_keyboardEvent) === true) ? false : true;
			if (false === bIsPrev)
			{
				e.preventDefault();
			}
			return;
		}
		/*
		 if (oWordControl.m_oDrawingDocument.IsFreezePage(oWordControl.m_oDrawingDocument.m_lCurrentPage))
		 {
		 e.preventDefault();
		 return;
		 }
		 */
		/*
		 if (oWordControl.m_oApi.isViewMode)
		 {
		 var isSendToEditor = oWordControl.checkViewerModeKeys(global_keyboardEvent);
		 if (false === isSendToEditor)
		 return;
		 }
		 */

		oWordControl.StartUpdateOverlay();

		oWordControl.IsKeyDownButNoPress = true;
		var _ret_mouseDown               = oWordControl.m_oLogicDocument.OnKeyDown(global_keyboardEvent);
		oWordControl.bIsUseKeyPress      = ((_ret_mouseDown & keydownresult_PreventKeyPress) != 0) ? false : true;

		oWordControl.EndUpdateOverlay();

		if ((_ret_mouseDown & keydownresult_PreventDefault) != 0)// || (true === global_keyboardEvent.AltKey && !AscBrowser.isMacOs))
		{
			// убираем превент с альтом. Уж больно итальянцы недовольны.
			e.preventDefault();
		}

		/*
		 if (false === oWordControl.TextboxUsedForSpecials)
		 {
		 if (false === oWordControl.bIsUseKeyPress || true === global_keyboardEvent.AltKey)
		 {
		 e.preventDefault();
		 }
		 }
		 else
		 {
		 if (true !== global_keyboardEvent.AltKey && true !== global_keyboardEvent.CtrlKey)
		 {
		 if (false === oWordControl.bIsUseKeyPress)
		 e.preventDefault();
		 }
		 }
		 */
	};

	this.onKeyDownNoActiveControl = function(e)
	{
		var bSendToEditor = false;

		if (e.CtrlKey && !e.ShiftKey)
		{
			switch (e.KeyCode)
			{
				case 80: // P
				case 83: // S
					bSendToEditor = true;
					break;
				default:
					break;
			}
		}

		return bSendToEditor;
	};

	this.onKeyUp    = function(e)
	{
		global_keyboardEvent.AltKey   = false;
		global_keyboardEvent.CtrlKey  = false;
		global_keyboardEvent.ShiftKey = false;
		global_keyboardEvent.AltGr    = false;
	}
	this.onKeyPress = function(e)
	{
		if (AscCommon.g_clipboardBase.IsWorking())
			return;

		if (oThis.m_oApi.isLongAction())
		{
			e.preventDefault();
			return;
		}

		var oWordControl = oThis;
		if (false === oWordControl.m_oApi.bInit_word_control || oWordControl.IsFocus === false || oWordControl.m_bIsMouseLock === true)
			return;

		if (window.opera && !oWordControl.IsKeyDownButNoPress)
		{
			oWordControl.StartUpdateOverlay();
			oWordControl.onKeyDown(e);
			oWordControl.EndUpdateOverlay();
		}
		oWordControl.IsKeyDownButNoPress = false;

		if (false === oWordControl.bIsUseKeyPress)
			return;

		if (null == oWordControl.m_oLogicDocument)
			return;

		AscCommon.check_KeyboardEvent(e);

		oWordControl.StartUpdateOverlay();
		var retValue = oWordControl.m_oLogicDocument.OnKeyPress(global_keyboardEvent);
		oWordControl.EndUpdateOverlay();
		if (true === retValue)
			e.preventDefault();
	};

	this.verticalScroll             = function(sender, scrollPositionY, maxY, isAtTop, isAtBottom)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl                       = oThis;
		oWordControl.m_dScrollY                = Math.max(0, Math.min(scrollPositionY, maxY));
		oWordControl.m_dScrollY_max            = maxY;
		oWordControl.m_bIsUpdateVerRuler       = true;
		oWordControl.m_bIsUpdateTargetNoAttack = true;

		if (oWordControl.m_bIsRePaintOnScroll === true)
			oWordControl.OnScroll();

		if (oWordControl.MobileTouchManager && oWordControl.MobileTouchManager.iScroll)
		{
			oWordControl.MobileTouchManager.iScroll.y = -oWordControl.m_dScrollY;
		}
	};
	this.CorrectSpeedVerticalScroll = function(newScrollPos)
	{
		// без понтов.
		//return pos;

		// понты
		var res = {isChange : false, Pos : newScrollPos};
		if (newScrollPos <= 0 || newScrollPos >= this.m_dScrollY_max)
			return res;

		var _heightPageMM = Page_Height;
		if (this.m_oDrawingDocument.m_arrPages.length > 0)
			_heightPageMM = this.m_oDrawingDocument.m_arrPages[0].height_mm;
		var del = 20 + (g_dKoef_mm_to_pix * _heightPageMM * this.m_nZoomValue / 100 + 0.5) >> 0;

		var delta = Math.abs(newScrollPos - this.m_dScrollY);
		if (this.m_oDrawingDocument.m_lPagesCount <= 10)
			return res;
		else if (this.m_oDrawingDocument.m_lPagesCount <= 100 && (delta < del * 0.3))
			return res;
		else if (delta < del * 0.2)
			return res;

		var canvas = this.m_oEditor.HtmlElement;
		if (null == canvas)
			return;

		var _height      = canvas.height;
		var documentMaxY = this.m_dDocumentHeight - _height;
		if (documentMaxY <= 0)
			return res;

		var lCurrentTopInDoc = parseInt(newScrollPos * documentMaxY / this.m_dScrollY_max);
		var lCount           = parseInt(lCurrentTopInDoc / del);

		res.isChange = true;
		res.Pos      = parseInt((lCount * del) * this.m_dScrollY_max / documentMaxY);

		if (res.Pos < 0)
			res.Pos = 0;
		if (res.Pos > this.m_dScrollY_max)
			res.Pos = this.m_dScrollY_max;

		return res;
	};

	this.horizontalScroll = function(sender, scrollPositionX, maxX, isAtLeft, isAtRight)
	{
		if (false === oThis.m_oApi.bInit_word_control)
			return;

		var oWordControl                       = oThis;
		oWordControl.m_dScrollX                = scrollPositionX;
		oWordControl.m_dScrollX_max            = maxX;
		oWordControl.m_bIsUpdateHorRuler       = true;
		oWordControl.m_bIsUpdateTargetNoAttack = true;

		if (oWordControl.m_bIsRePaintOnScroll === true)
		{
			oWordControl.OnScroll();
		}

		if (oWordControl.MobileTouchManager && oWordControl.MobileTouchManager.iScroll)
		{
			oWordControl.MobileTouchManager.iScroll.x = -oWordControl.m_dScrollX;
		}
	};

	this.UpdateScrolls = function()
	{
		if (window["NATIVE_EDITOR_ENJINE"])
			return;

		var settings = {
			showArrows           : true,
			animateScroll        : false,
			//                scrollBackgroundColor: GlobalSkin.BackgroundScroll,
			//                scrollerColor:"#EDEDED",
			screenW              : this.m_oEditor.HtmlElement.width,
			screenH              : this.m_oEditor.HtmlElement.height,
			vscrollStep          : 45,
			hscrollStep          : 45,
			isNeedInvertOnActive : GlobalSkin.isNeedInvertOnActive
		};

		if (this.bIsRetinaSupport)
		{
			settings.screenW = AscCommon.AscBrowser.convertToRetinaValue(settings.screenW);
			settings.screenH = AscCommon.AscBrowser.convertToRetinaValue(settings.screenH);
		}

		if (this.m_oScrollHor_)
			this.m_oScrollHor_.Repos(settings, this.m_bIsHorScrollVisible);
		else
		{
			this.m_oScrollHor_ = new AscCommon.ScrollObject("id_horizontal_scroll", settings);

			this.m_oScrollHor_.onLockMouse  = function(evt)
			{
				AscCommon.check_MouseDownEvent(evt, true);
				global_mouseEvent.LockMouse();
			}
			this.m_oScrollHor_.offLockMouse = function(evt)
			{
				AscCommon.check_MouseUpEvent(evt);
			}
			this.m_oScrollHor_.bind("scrollhorizontal", function(evt)
			{
				oThis.horizontalScroll(this, evt.scrollD, evt.maxScrollX);
			})
			this.m_oScrollHorApi = this.m_oScrollHor_;
		}

		if (this.m_oScrollVer_)
		{
			this.m_oScrollVer_.Repos(settings, undefined, true);
		}
		else
		{
			this.m_oScrollVer_ = new AscCommon.ScrollObject("id_vertical_scroll", settings);

			this.m_oScrollVer_.onLockMouse  = function(evt)
			{
				AscCommon.check_MouseDownEvent(evt, true);
				global_mouseEvent.LockMouse();
			}
			this.m_oScrollVer_.offLockMouse = function(evt)
			{
				AscCommon.check_MouseUpEvent(evt);
			}
			this.m_oScrollVer_.bind("scrollvertical", function(evt)
			{
				oThis.verticalScroll(this, evt.scrollD, evt.maxScrollY);
			});
			this.m_oScrollVer_.bind("correctVerticalScroll", function(yPos)
			{
				return oThis.CorrectSpeedVerticalScroll(yPos);
			});
			this.m_oScrollVerApi = this.m_oScrollVer_;
		}

		this.m_oApi.sendEvent("asc_onUpdateScrolls", this.m_dDocumentWidth, this.m_dDocumentHeight);

		this.m_dScrollX_max = this.m_oScrollHorApi.getMaxScrolledX();
		this.m_dScrollY_max = this.m_oScrollVerApi.getMaxScrolledY();

		if (this.m_dScrollX >= this.m_dScrollX_max)
			this.m_dScrollX = this.m_dScrollX_max;
		if (this.m_dScrollY >= this.m_dScrollY_max)
			this.m_dScrollY = this.m_dScrollY_max;
	};

	this.OnRePaintAttack = function()
	{
		this.m_bIsFullRepaint = true;
		this.OnScroll();
	};

	this.OnResize = function(isAttack)
	{
		AscBrowser.checkZoom();

		var isNewSize = this.checkBodySize();
		if (!isNewSize && false === isAttack)
			return;

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize_Before();

		this.CheckRetinaDisplay();
		this.m_oBody.Resize(this.Width * g_dKoef_pix_to_mm, this.Height * g_dKoef_pix_to_mm, this);
		this.onButtonTabsDraw();

		if (AscCommon.g_inputContext)
			AscCommon.g_inputContext.onResize("id_main_view");

		if (this.TextBoxBackground != null)
		{
			// это мега заглушка. чтобы не показывалась клавиатура при тыкании на тулбар
			this.TextBoxBackground.HtmlElement.style.top = "10px";
		}

		if (this.checkNeedHorScroll())
			return;

		// теперь проверим необходимость перезуммирования
		if (1 == this.m_nZoomType)
		{
			if (true === this.zoom_FitToWidth())
			{
				this.m_oBoundsController.ClearNoAttack();
				this.onTimerScroll2_sync();
				return;
			}
		}
		if (2 == this.m_nZoomType)
		{
			if (true === this.zoom_FitToPage())
			{
				this.m_oBoundsController.ClearNoAttack();
				this.onTimerScroll2_sync();
				return;
			}
		}

		this.m_bIsUpdateHorRuler = true;
		this.m_bIsUpdateVerRuler = true;

		this.m_oHorRuler.RepaintChecker.BlitAttack = true;
		this.m_oVerRuler.RepaintChecker.BlitAttack = true;

		this.UpdateScrolls();

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize();

		if (this.ReaderTouchManager)
			this.ReaderTouchManager.Resize();

		this.m_bIsUpdateTargetNoAttack = true;
		this.m_bIsRePaintOnScroll      = true;

		this.m_oBoundsController.ClearNoAttack();

		this.OnScroll();
		this.onTimerScroll2_sync();

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize_After();
	};

	this.checkNeedRules     = function()
	{
		if (this.m_bIsRuler)
		{
			this.m_oLeftRuler.HtmlElement.style.display = 'block';
			this.m_oTopRuler.HtmlElement.style.display  = 'block';

			this.m_oMainView.Bounds.L = 5;
			this.m_oMainView.Bounds.T = 7;

			/*
			 this.m_oEditor.Bounds.L = 5;
			 this.m_oEditor.Bounds.T = 7;

			 this.m_oOverlay.Bounds.L = 5;
			 this.m_oOverlay.Bounds.T = 7;
			 */
		}
		else
		{
			this.m_oLeftRuler.HtmlElement.style.display = 'none';
			this.m_oTopRuler.HtmlElement.style.display  = 'none';

			this.m_oMainView.Bounds.L = 0;
			this.m_oMainView.Bounds.T = 0;

			/*
			 this.m_oEditor.Bounds.L = 0;
			 this.m_oEditor.Bounds.T = 0;

			 this.m_oOverlay.Bounds.L = 0;
			 this.m_oOverlay.Bounds.T = 0;
			 */
		}
	};
	this.checkNeedHorScroll = function()
	{
		if (this.m_oApi.isMobileVersion)
		{
			this.m_oPanelRight.Bounds.B  = 0;
			this.m_oMainContent.Bounds.B = 0;

			// этот флаг для того, чтобы не делался лишний зум и т.д.
			this.m_bIsHorScrollVisible = false;

			var hor_scroll         = document.getElementById('panel_hor_scroll');
			hor_scroll.style.width = this.m_dDocumentWidth + "px";

			return false;
		}

		var _editor_width = this.m_oEditor.HtmlElement.width;
		if (this.bIsRetinaSupport)
			_editor_width /= AscCommon.AscBrowser.retinaPixelRatio;

		var oldVisible = this.m_bIsHorScrollVisible;
		if (this.m_dDocumentWidth <= _editor_width)
		{
			this.m_bIsHorScrollVisible = false;
		}
		else
		{
			this.m_bIsHorScrollVisible = true;
		}

		var hor_scroll         = document.getElementById('panel_hor_scroll');
		hor_scroll.style.width = this.m_dDocumentWidth + "px";

		if (this.m_bIsHorScrollVisible)
		{
			this.m_oScrollHor.HtmlElement.style.display = 'block';

			this.m_oPanelRight.Bounds.B  = this.ScrollsWidthPx * g_dKoef_pix_to_mm;
			this.m_oMainContent.Bounds.B = this.ScrollsWidthPx * g_dKoef_pix_to_mm;
		}
		else
		{
			this.m_oPanelRight.Bounds.B                 = 0;
			this.m_oMainContent.Bounds.B                = 0;
			this.m_oScrollHor.HtmlElement.style.display = 'none';
		}

		if (this.m_bIsHorScrollVisible != oldVisible)
		{
			this.m_dScrollX = 0;
			this.OnResize(true);
			return true;
		}
		return false;
	};

	this.getScrollMaxX = function(size)
	{
		if (size >= this.m_dDocumentWidth)
			return 1;
		return this.m_dDocumentWidth - size;
	};
	this.getScrollMaxY = function(size)
	{
		if (size >= this.m_dDocumentHeight)
			return 1;
		return this.m_dDocumentHeight - size;
	};

	this.StartUpdateOverlay = function()
	{
		this.IsUpdateOverlayOnlyEnd = true;
	};
	this.EndUpdateOverlay   = function()
	{
		if (this.IsUpdateOverlayOnlyEndReturn)
			return;

		this.IsUpdateOverlayOnlyEnd = false;
		if (this.IsUpdateOverlayOnEndCheck)
			this.OnUpdateOverlay();
		this.IsUpdateOverlayOnEndCheck = false;
	};

	this.OnUpdateOverlay = function()
	{
		if (this.IsUpdateOverlayOnlyEnd)
		{
			this.IsUpdateOverlayOnEndCheck = true;
			return false;
		}

		this.m_oApi.checkLastWork();

		//console.log("update_overlay");
		var overlay = this.m_oOverlayApi;
		//if (!overlay.m_bIsShow)
		//    return;

		overlay.Clear();
		var ctx = overlay.m_oContext;

		var drDoc = this.m_oDrawingDocument;
		drDoc.SelectionMatrix = null;
		if (drDoc.m_lDrawingFirst < 0 || drDoc.m_lDrawingEnd < 0)
			return true;

		if (drDoc.m_bIsSearching)
		{
			ctx.fillStyle = "rgba(255,200,0,1)";
			ctx.beginPath();

			var drDoc = this.m_oDrawingDocument;
			for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
			{
				var drawPage                  = drDoc.m_arrPages[i].drawingPage;
				drDoc.m_arrPages[i].pageIndex = i;
				drDoc.m_arrPages[i].DrawSearch(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc);
			}

			ctx.globalAlpha = 0.5;
			ctx.fill();
			ctx.beginPath();
			ctx.globalAlpha = 1.0;
		}

		if (null == drDoc.m_oDocumentRenderer)
		{
			if (drDoc.m_bIsSelection)
			{
				this.CheckShowOverlay();
				drDoc.private_StartDrawSelection(overlay);

				if (!this.MobileTouchManager)
				{
					for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
					{
						if (!drDoc.IsFreezePage(i))
							this.m_oLogicDocument.Selection_Draw_Page(i);
					}
				}
				else
				{
					for (var i = 0; i <= drDoc.m_lPagesCount; i++)
					{
						if (!drDoc.IsFreezePage(i))
							this.m_oLogicDocument.Selection_Draw_Page(i);
					}
				}

				drDoc.private_EndDrawSelection();

				if (this.MobileTouchManager)
					this.MobileTouchManager.CheckSelect(overlay);
			}

			if (this.MobileTouchManager)
				this.MobileTouchManager.CheckTableRules(overlay);

			ctx.globalAlpha = 1.0;

			var _table_outline = drDoc.TableOutlineDr.TableOutline;
			if (_table_outline != null && !this.MobileTouchManager)
			{
				var _page = _table_outline.PageNum;
				if (_page >= drDoc.m_lDrawingFirst && _page <= drDoc.m_lDrawingEnd)
				{
					var drawPage = drDoc.m_arrPages[_page].drawingPage;
					drDoc.m_arrPages[_page].DrawTableOutline(overlay,
						drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc.TableOutlineDr);
				}
			}

			// drawShapes (+ track)
			if (this.m_oLogicDocument.DrawingObjects)
			{
				for (var indP = drDoc.m_lDrawingFirst; indP <= drDoc.m_lDrawingEnd; indP++)
				{
					this.m_oDrawingDocument.AutoShapesTrack.PageIndex = indP;
					this.m_oLogicDocument.DrawingObjects.drawSelect(indP);
				}

				if (this.m_oLogicDocument.DrawingObjects.needUpdateOverlay())
				{
					overlay.Show();
					this.m_oDrawingDocument.AutoShapesTrack.PageIndex = -1;
					this.m_oLogicDocument.DrawingObjects.drawOnOverlay(this.m_oDrawingDocument.AutoShapesTrack);
					this.m_oDrawingDocument.AutoShapesTrack.CorrectOverlayBounds();
				}
			}

			if (drDoc.TableOutlineDr.bIsTracked)
			{
				drDoc.DrawTableTrack(overlay);
			}

			if (drDoc.FrameRect.IsActive)
			{
				drDoc.DrawFrameTrack(overlay);
			}

			if (drDoc.MathRect.IsActive)
			{
				drDoc.DrawMathTrack(overlay);
			}

			if (drDoc.FieldTrack.IsActive)
			{
				drDoc.DrawFieldTrack(overlay);
			}

			if (drDoc.InlineTextTrackEnabled && null != drDoc.InlineTextTrack)
			{
				var _oldPage        = drDoc.AutoShapesTrack.PageIndex;
				var _oldCurPageInfo = drDoc.AutoShapesTrack.CurrentPageInfo;

				drDoc.AutoShapesTrack.PageIndex = drDoc.InlineTextTrackPage;
				drDoc.AutoShapesTrack.DrawInlineMoveCursor(drDoc.InlineTextTrack.X, drDoc.InlineTextTrack.Y, drDoc.InlineTextTrack.Height, drDoc.InlineTextTrack.transform);

				drDoc.AutoShapesTrack.PageIndex       = _oldPage;
				drDoc.AutoShapesTrack.CurrentPageInfo = _oldCurPageInfo;
			}

			drDoc.DrawHorVerAnchor();
		}
		else
		{
			ctx.globalAlpha = 0.2;

			if (drDoc.m_oDocumentRenderer.SearchResults.IsSearch)
			{
				this.m_oOverlayApi.Show();

				if (drDoc.m_oDocumentRenderer.SearchResults.Show)
				{
					ctx.globalAlpha = 0.5;
					ctx.fillStyle   = "rgba(255,200,0,1)";
					ctx.beginPath();
					for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
					{
						var _searching = drDoc.m_oDocumentRenderer.SearchResults.Pages[i];

						if (0 != _searching.length)
						{
							var drawPage = drDoc.m_arrPages[i].drawingPage;
							drDoc.m_arrPages[i].DrawSearch2(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, _searching);
						}
					}
					ctx.fill();
					ctx.globalAlpha = 0.2;
				}
				ctx.beginPath();

				if (drDoc.CurrentSearchNavi && drDoc.m_oDocumentRenderer.SearchResults.Show)
				{
					var _pageNum  = drDoc.CurrentSearchNavi[0].PageNum;
					ctx.fillStyle = "rgba(51,102,204,255)";
					if (_pageNum >= drDoc.m_lDrawingFirst && _pageNum <= drDoc.m_lDrawingEnd)
					{
						var drawPage = drDoc.m_arrPages[_pageNum].drawingPage;
						drDoc.m_arrPages[_pageNum].DrawSearchCur(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc.CurrentSearchNavi);
					}
				}
			}

			ctx.fillStyle = "rgba(51,102,204,255)";
			ctx.beginPath();

			for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
			{
				var drawPage = drDoc.m_arrPages[i].drawingPage;
				drDoc.m_oDocumentRenderer.DrawSelection(i, overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
			}

			ctx.fill();
			ctx.beginPath();
			ctx.globalAlpha = 1.0;
		}

		return true;
	};

	this.OnUpdateSelection = function()
	{
		if (this.m_oDrawingDocument.m_bIsSelection)
		{
			this.m_oOverlayApi.Clear();
			this.m_oOverlayApi.m_oContext.beginPath();
			this.m_oOverlayApi.m_oContext.fillStyle = "rgba(51,102,204,255)";
		}

		for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++)
		{
			if (i < this.m_oDrawingDocument.m_lDrawingFirst || i > this.m_oDrawingDocument.m_lDrawingEnd)
			{
				continue;
			}

			var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;

			if (this.m_oDrawingDocument.m_bIsSelection)
			{
				this.m_oDrawingDocument.m_arrPages[i].DrawSelection(this.m_oOverlayApi, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
			}
		}

		if (this.m_oDrawingDocument.m_bIsSelection)
		{
			this.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
			this.m_oOverlayApi.m_oContext.fill();
			this.m_oOverlayApi.m_oContext.globalAlpha = 1.0;

			// нужно очистить набивку пата
			this.m_oOverlayApi.m_oContext.beginPath();
		}
	};

	this.OnCalculatePagesPlace = function()
	{
		if (this.MobileTouchManager && !this.MobileTouchManager.IsWorkedPosition())
			this.MobileTouchManager.ClearContextMenu();

		var canvas = this.m_oEditor.HtmlElement;
		if (null == canvas)
			return;

		var _width  = canvas.width;
		var _height = canvas.height;

		if (this.bIsRetinaSupport)
		{
			_width = AscCommon.AscBrowser.convertToRetinaValue(_width);
			_height = AscCommon.AscBrowser.convertToRetinaValue(_height);
		}

		var bIsFoundFirst = false;
		var bIsFoundEnd   = false;

		var hor_pos_median = parseInt(_width / 2);
		if (0 != this.m_dScrollX || (this.m_dDocumentWidth > _width))
		{
			//var part = this.m_dScrollX / Math.max(this.m_dScrollX_max, 1);
			//hor_pos_median = parseInt(this.m_dDocumentWidth / 2 + part * (_width - this.m_dDocumentWidth));
			hor_pos_median = parseInt(this.m_dDocumentWidth / 2 - this.m_dScrollX);
		}

		var lCurrentTopInDoc = parseInt(this.m_dScrollY);

		var dKoef  = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);
		var lStart = 0;
		for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++)
		{
			var _pageWidth  = (this.m_oDrawingDocument.m_arrPages[i].width_mm * dKoef + 0.5) >> 0;
			var _pageHeight = (this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef + 0.5) >> 0;

			if (false === bIsFoundFirst)
			{
				if (lStart + 20 + _pageHeight > lCurrentTopInDoc)
				{
					this.m_oDrawingDocument.m_lDrawingFirst = i;
					bIsFoundFirst                           = true;
				}
			}

			var xDst = hor_pos_median - parseInt(_pageWidth / 2);
			var wDst = _pageWidth;
			var yDst = lStart + 20 - lCurrentTopInDoc;
			var hDst = _pageHeight;

			if (false === bIsFoundEnd)
			{
				if (yDst > _height)
				{
					this.m_oDrawingDocument.m_lDrawingEnd = i - 1;
					bIsFoundEnd                           = true;
				}
			}

			var drawRect = this.m_oDrawingDocument.m_arrPages[i].drawingPage;

			drawRect.left      = xDst;
			drawRect.top       = yDst;
			drawRect.right     = xDst + wDst;
			drawRect.bottom    = yDst + hDst;
			drawRect.pageIndex = i;

			lStart += (20 + _pageHeight);
		}

		if (false === bIsFoundEnd)
		{
			this.m_oDrawingDocument.m_lDrawingEnd = this.m_oDrawingDocument.m_lPagesCount - 1;
		}

		if ((-1 == this.m_oDrawingDocument.m_lPagesCount) && (0 != this.m_oDrawingDocument.m_lPagesCount))
		{
			this.m_oDrawingDocument.m_lCurrentPage = 0;
			this.SetCurrentPage();
		}

		// отправляем евент о текущей странице. только в мобильной версии
		if ((this.m_oApi.isMobileVersion || this.m_oApi.isViewMode) && (!window["NATIVE_EDITOR_ENJINE"]))
		{
			var lPage = this.m_oApi.GetCurrentVisiblePage();
			this.m_oApi.sendEvent("asc_onCurrentVisiblePage", this.m_oApi.GetCurrentVisiblePage());

			if (null != this.m_oDrawingDocument.m_oDocumentRenderer)
			{
				this.m_oDrawingDocument.m_lCurrentPage = lPage;
				this.m_oApi.sendEvent("asc_onCurrentPage", lPage);
			}
		}

		if (this.m_bDocumentPlaceChangedEnabled)
			this.m_oApi.sendEvent("asc_onDocumentPlaceChanged");
	};

	this.OnPaint = function()
	{
		if (this.DrawingFreeze || true === window["DisableVisibleComponents"])
		{
			this.m_oApi.checkLastWork();
			return;
		}
		//console.log("paint");

		var canvas = this.m_oEditor.HtmlElement;
		if (null == canvas)
		{
			this.m_oApi.checkLastWork();
			return;
		}

		var context       = canvas.getContext("2d");
		context.fillStyle = GlobalSkin.BackgroundColor;

		if (this.m_oDrawingDocument.m_lDrawingFirst < 0 || this.m_oDrawingDocument.m_lDrawingEnd < 0)
			return;

		//this.m_oBoundsController.Clear(context);
		// сначала посморим, изменились ли ректы страниц
		var rectsPages = [];
		for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++)
		{
			var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;

			if (!this.bIsRetinaSupport)
			{
				var _cur_page_rect = new AscCommon._rect();
				_cur_page_rect.x   = drawPage.left;
				_cur_page_rect.y   = drawPage.top;
				_cur_page_rect.w   = drawPage.right - drawPage.left;
				_cur_page_rect.h   = drawPage.bottom - drawPage.top;

				rectsPages.push(_cur_page_rect);
			}
			else
			{
				var _cur_page_rect = new AscCommon._rect();
				_cur_page_rect.x   = (drawPage.left * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
				_cur_page_rect.y   = (drawPage.top * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
				_cur_page_rect.w   = ((drawPage.right * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - _cur_page_rect.x;
				_cur_page_rect.h   = ((drawPage.bottom * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - _cur_page_rect.y;

				rectsPages.push(_cur_page_rect);
			}
		}
		this.m_oBoundsController.CheckPageRects(rectsPages, context);

		if (this.m_oDrawingDocument.m_bIsSelection)
		{
			this.m_oOverlayApi.Clear();
			this.m_oOverlayApi.m_oContext.beginPath();
			this.m_oOverlayApi.m_oContext.fillStyle   = "rgba(51,102,204,255)";
			this.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
		}

		if (this.NoneRepaintPages)
		{
			this.m_bIsFullRepaint = false;

			for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++)
			{
				var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;

				if (!this.bIsRetinaSupport)
				{
					this.m_oDrawingDocument.m_arrPages[i].Draw(context, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
					//this.m_oBoundsController.CheckRect(drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
				}
				else
				{
					var __x = (drawPage.left * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
					var __y = (drawPage.top * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
					var __w = ((drawPage.right * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - __x;
					var __h = ((drawPage.bottom * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - __y;
					this.m_oDrawingDocument.m_arrPages[i].Draw(context, __x, __y, __w, __h);
					//this.m_oBoundsController.CheckRect(__x, __y, __w, __h);
				}
			}
		}
		else
		{
			for (var i = 0; i < this.m_oDrawingDocument.m_lDrawingFirst; i++)
				this.m_oDrawingDocument.StopRenderingPage(i);

			for (var i = this.m_oDrawingDocument.m_lDrawingEnd + 1; i < this.m_oDrawingDocument.m_lPagesCount; i++)
				this.m_oDrawingDocument.StopRenderingPage(i);

			for (var i = this.m_oDrawingDocument.m_lDrawingFirst; i <= this.m_oDrawingDocument.m_lDrawingEnd; i++)
			{
				var drawPage = this.m_oDrawingDocument.m_arrPages[i].drawingPage;

				if (this.m_bIsFullRepaint === true)
				{
					this.m_oDrawingDocument.StopRenderingPage(i);
				}

				var __x = drawPage.left;
				var __y = drawPage.top;
				var __w = drawPage.right - __x;
				var __h = drawPage.bottom - __y;
				if (this.bIsRetinaSupport)
				{
					__x = (__x * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
					__y = (__y * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
					__w = (__w * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
					__h = (__h * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
				}

				this.m_oDrawingDocument.CheckRecalculatePage(__w, __h, i);
				if (null == drawPage.cachedImage)
				{
					this.m_oDrawingDocument.StartRenderingPage(i);
				}

				this.m_oDrawingDocument.m_arrPages[i].Draw(context, __x, __y, __w, __h);
				//this.m_oBoundsController.CheckRect(__x, __y, __w, __h);
			}
		}

		this.m_bIsFullRepaint = false;

		this.OnUpdateOverlay();

		if (this.m_bIsUpdateHorRuler)
		{
			this.UpdateHorRuler();
			this.m_bIsUpdateHorRuler = false;
		}
		if (this.m_bIsUpdateVerRuler)
		{
			this.UpdateVerRuler();
			this.m_bIsUpdateVerRuler = false;
		}
		if (this.m_bIsUpdateTargetNoAttack)
		{
			this.m_oDrawingDocument.UpdateTargetNoAttack();
			this.m_bIsUpdateTargetNoAttack = false;
		}
	};

	this.CheckRetinaElement = function(htmlElem)
	{
		if (this.bIsRetinaSupport)
		{
			if (htmlElem.id == "id_viewer" ||
				(htmlElem.id == "id_viewer_overlay" && this.m_oOverlayApi.IsRetina) ||
				htmlElem.id == "id_hor_ruler" ||
				htmlElem.id == "id_vert_ruler" ||
				htmlElem.id == "id_buttonTabs")
				return true;
		}
		return false;
	};

	this.GetDrawingPageInfo = function(nPageIndex)
	{
		return this.m_oDrawingDocument.m_arrPages[nPageIndex];
	};

	this.CheckFontCache = function()
	{
		var _c = oThis;
		_c.m_nCurrentTimeClearCache++;
		if (_c.m_nCurrentTimeClearCache > 750) // 30 секунд. корректировать при смене интервала главного таймера!!!
		{
			_c.m_nCurrentTimeClearCache = 0;
			_c.m_oDrawingDocument.CheckFontCache();
		}

		oThis.m_oLogicDocument.Continue_CheckSpelling();
		oThis.m_oLogicDocument.Continue_TrackRevisions();
	};
	this.OnScroll       = function()
	{
		this.OnCalculatePagesPlace();
		this.m_bIsScroll = true;
	};

	this.CheckZoom = function()
	{
		if (!this.NoneRepaintPages)
			this.m_oDrawingDocument.ClearCachePages();
	};

	this.ChangeHintProps = function()
	{
		var bFlag = false;
		if (global_keyboardEvent.CtrlKey)
		{
			if (null != this.m_oLogicDocument)
			{
				if (49 == global_keyboardEvent.KeyCode)
				{
					AscCommon.SetHintsProps(false, false);
					bFlag = true;
				}
				else if (50 == global_keyboardEvent.KeyCode)
				{
					AscCommon.SetHintsProps(true, false);
					bFlag = true;
				}
				else if (51 == global_keyboardEvent.KeyCode)
				{
					AscCommon.SetHintsProps(true, true);
					bFlag = true;
				}
			}
		}

		if (bFlag)
		{
			this.m_oDrawingDocument.ClearCachePages();
			AscCommon.g_fontManager.ClearFontsRasterCache();

			if (AscCommon.g_fontManager2)
				AscCommon.g_fontManager2.ClearFontsRasterCache();
		}

		return bFlag;
	};

	this.CalculateDocumentSize = function()
	{
		this.m_dDocumentWidth      = 0;
		this.m_dDocumentHeight     = 0;
		this.m_dDocumentPageWidth  = 0;
		this.m_dDocumentPageHeight = 0;

		var dKoef = (this.m_nZoomValue * g_dKoef_mm_to_pix / 100);

		for (var i = 0; i < this.m_oDrawingDocument.m_lPagesCount; i++)
		{
			var mm_w = this.m_oDrawingDocument.m_arrPages[i].width_mm;
			var mm_h = this.m_oDrawingDocument.m_arrPages[i].height_mm;

			if (mm_w > this.m_dDocumentPageWidth)
				this.m_dDocumentPageWidth = mm_w;
			if (mm_h > this.m_dDocumentPageHeight)
				this.m_dDocumentPageHeight = mm_h;

			var _pageWidth  = (mm_w * dKoef) >> 0;
			var _pageHeight = (mm_h * dKoef + 0.5) >> 0;

			if (_pageWidth > this.m_dDocumentWidth)
				this.m_dDocumentWidth = _pageWidth;

			this.m_dDocumentHeight += 20;
			this.m_dDocumentHeight += _pageHeight;
		}

		this.m_dDocumentHeight += 20;

		// теперь увеличим ширину документа, чтобы он не был плотно к краям
		if (!this.m_oApi.isMobileVersion)
			this.m_dDocumentWidth += 40;

		// теперь проверим необходимость перезуммирования
		if (1 == this.m_nZoomType)
		{
			if (true === this.zoom_FitToWidth())
				return;
		}
		if (2 == this.m_nZoomType)
		{
			if (true === this.zoom_FitToPage())
				return;
		}

		// теперь нужно выставить размеры для скроллов
		this.checkNeedHorScroll();

		document.getElementById('panel_right_scroll').style.height = this.m_dDocumentHeight + "px";

		this.UpdateScrolls();

		if (this.MobileTouchManager)
			this.MobileTouchManager.Resize();

		if (this.ReaderTouchManager)
			this.ReaderTouchManager.Resize();

		if (this.m_bIsRePaintOnScroll === true)
			this.OnScroll();
	};

	this.InitDocument = function(bIsEmpty)
	{
		this.m_oDrawingDocument.m_oWordControl   = this;
		this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;

		if (false === bIsEmpty)
		{
			this.m_oLogicDocument.LoadTestDocument();
		}

		this.CalculateDocumentSize();
		//setInterval(this.onTimerScroll, this.m_nTimerScrollInterval);
		this.StartMainTimer();

		this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.UpdateHorRuler();
		this.UpdateVerRuler();
	};

	this.InitControl = function()
	{
		if (this.IsInitControl)
			return;

		this.CalculateDocumentSize();

		if (window["AscDesktopEditor"] && this.m_oDrawingDocument.m_oDocumentRenderer)
		{
			var _new_value = this.calculate_zoom_FitToWidth();
			if (_new_value < this.m_nZoomValue)
			{
				// сначала добавим нужные параметры зума
				var _newValues = [];
				_new_value     = ((_new_value / 10) >> 0) * 10 - 1;
				for (var _test_param = 10; _test_param < this.zoom_values[0]; _test_param += 10)
				{
					if (_new_value < _test_param)
						_newValues.push(_test_param);
				}
				this.zoom_values = [].concat(_newValues, this.zoom_values);

				this.zoom_FitToWidth();
			}
		}

		//setInterval(this.onTimerScroll, this.m_nTimerScrollInterval);

		if (!this.m_oApi.isOnlyReaderMode)
			this.StartMainTimer();

		this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.UpdateHorRuler();
		this.UpdateVerRuler();

		if (window["AutoTester"] !== undefined)
		{
			window["AutoTester"]["RunTest"]();
		}

        if (true)
        {
            AscCommon.InitBrowserInputContext(this.m_oApi, "id_target_cursor");
            if (AscCommon.g_inputContext)
                AscCommon.g_inputContext.onResize("id_main_view");

            if (this.m_oApi.isMobileVersion)
                this.initEventsMobile();
        }

		//this.m_oDrawingDocument.CheckFontCache();

		this.IsInitControl = true;
	};

	this.OpenDocument = function(info)
	{
		this.m_oDrawingDocument.m_oWordControl   = this;
		this.m_oDrawingDocument.m_oLogicDocument = this.m_oLogicDocument;

		this.m_oLogicDocument.fromJfdoc(info);

		this.CalculateDocumentSize();
		//setInterval(this.onTimerScroll, 40);
		this.StartMainTimer();

		this.m_oHorRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.m_oVerRuler.CreateBackground(this.m_oDrawingDocument.m_arrPages[0]);
		this.UpdateHorRuler();
		this.UpdateVerRuler();
	};

	this.AnimationFrame = function()
	{
		var now = Date.now();
		if (-1 == oThis.RequestAnimationOldTime || (now >= (oThis.RequestAnimationOldTime + 40)))
		{
			oThis.RequestAnimationOldTime = now;
			oThis.onTimerScroll2(true);
		}
		oThis.RequestAnimationFrame.call(window, oThis.AnimationFrame);
	};

	this.onTimerScroll = function()
	{
		var oWordControl = oThis;
		if (oWordControl.m_bIsScroll)
		{
			oWordControl.m_bIsScroll = false;
			window.postMessage(_message_update, "*");
			//setTimeout("oWordControl.OnPaint();", 0);
		}
		else if (null != oWordControl.m_oLogicDocument)
		{
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
			oWordControl.m_oLogicDocument.CheckTargetUpdate();
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;
		}
		if (null != oWordControl.m_oLogicDocument)
		{
			oWordControl.CheckFontCache();
			oWordControl.m_oDrawingDocument.CheckTrackTable();
		}
	};

	this.StartMainTimer = function()
	{
		if (this.UseRequestAnimationFrame)
		{
			this.AnimationFrame();
			return;
		}
		if (-1 == this.m_nPaintTimerId)
			this.onTimerScroll2();
	};

	this.onTimerScroll2_internal = function(is_no_timer)
	{
		var oWordControl = oThis;

		if (!oWordControl.m_oApi.bInit_word_control)
			return;

        if (oWordControl.m_oApi.isLongAction())
            return;

		var isRepaint                   = oWordControl.m_bIsScroll;
		if (oWordControl.m_bIsScroll)
		{
			oWordControl.m_bIsScroll = false;
			oWordControl.OnPaint();

			if (null != oWordControl.m_oLogicDocument && oWordControl.m_oApi.bInit_word_control)
				oWordControl.m_oLogicDocument.Viewer_OnChangePosition();
		}
		if (null != oWordControl.m_oLogicDocument && !oWordControl.m_oApi.isLockTargetUpdate)
		{
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
			oWordControl.m_oLogicDocument.CheckTargetUpdate();
			oWordControl.m_oDrawingDocument.CheckTargetShow();
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;

			oWordControl.CheckFontCache();
			oWordControl.m_oDrawingDocument.CheckTrackTable();
		}

		oWordControl.m_oDrawingDocument.Collaborative_TargetsUpdate(isRepaint);

		oWordControl.m_oApi.sendEvent("asc_onPaintTimer");
		//window.requestAnimationFrame(oWordControl.onTimerScroll2);
	};
	this.onTimerScroll2          = function(is_no_timer)
	{
		try
		{
			oThis.onTimerScroll2_internal(is_no_timer);
		}
		catch (err)
		{
		}

		if (true !== is_no_timer)
			this.m_nPaintTimerId = setTimeout(oThis.onTimerScroll2, oThis.m_nTimerScrollInterval);
	};

	this.onTimerScroll2_sync = function()
	{
		var oWordControl = oThis;

		if (!oWordControl.m_oApi.bInit_word_control || oWordControl.m_oApi.isOnlyReaderMode)
			return;

		var isRepaint                   = oWordControl.m_bIsScroll;
		if (oWordControl.m_bIsScroll)
		{
			oWordControl.m_bIsScroll = false;
			oWordControl.OnPaint();

			if (null != oWordControl.m_oLogicDocument && oWordControl.m_oApi.bInit_word_control)
				oWordControl.m_oLogicDocument.Viewer_OnChangePosition();
		}
		if (null != oWordControl.m_oLogicDocument)
		{
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
			oWordControl.m_oLogicDocument.CheckTargetUpdate();
			oWordControl.m_oDrawingDocument.CheckTargetShow();
			oWordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;

			oWordControl.CheckFontCache();
			oWordControl.m_oDrawingDocument.CheckTrackTable();
		}
		oWordControl.m_oDrawingDocument.Collaborative_TargetsUpdate(isRepaint);
	};

	this.UpdateHorRuler = function()
	{
		if (!this.m_bIsRuler)
			return;

		var _left = 0;
		var lPage = this.m_oDrawingDocument.m_lCurrentPage;
		if (0 <= lPage && lPage < this.m_oDrawingDocument.m_lPagesCount)
		{
			_left = this.m_oDrawingDocument.m_arrPages[lPage].drawingPage.left;
		}
		else if (this.m_oDrawingDocument.m_lPagesCount != 0)
		{
			_left = this.m_oDrawingDocument.m_arrPages[this.m_oDrawingDocument.m_lPagesCount - 1].drawingPage.left;
		}
		this.m_oHorRuler.BlitToMain(_left, 0, this.m_oTopRuler_horRuler.HtmlElement);
	};
	this.UpdateVerRuler = function()
	{
		if (!this.m_bIsRuler)
			return;

		var _top  = 0;
		var lPage = this.m_oDrawingDocument.m_lCurrentPage;
		if (0 <= lPage && lPage < this.m_oDrawingDocument.m_lPagesCount)
		{
			_top = this.m_oDrawingDocument.m_arrPages[lPage].drawingPage.top;
		}
		else if (this.m_oDrawingDocument.m_lPagesCount != 0)
		{
			_top = this.m_oDrawingDocument.m_arrPages[this.m_oDrawingDocument.m_lPagesCount - 1].drawingPage.top;
		}
		this.m_oVerRuler.BlitToMain(0, _top, this.m_oLeftRuler_vertRuler.HtmlElement);
	};

	this.SetCurrentPage  = function(isNoUpdateRulers)
	{
		var drDoc = this.m_oDrawingDocument;

		if (isNoUpdateRulers === undefined)
		{
			if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount)
			{
				this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
				this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);

				this.m_oHorRuler.IsCanMoveMargins = true;
				this.m_oVerRuler.IsCanMoveMargins = true;
			}
		}

		this.m_bIsUpdateHorRuler = true;
		this.m_bIsUpdateVerRuler = true;

		this.OnScroll();

		this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
	};
	this.SetCurrentPage2 = function()
	{
		var drDoc = this.m_oDrawingDocument;
		if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount)
		{
			this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
			this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
		}

		this.m_bIsUpdateHorRuler = true;
		this.m_bIsUpdateVerRuler = true;

		this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
	};

	this.UpdateHorRulerBack = function(isattack)
	{
		var drDoc = this.m_oDrawingDocument;
		if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount)
		{
			this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage], isattack);
		}
		this.UpdateHorRuler();
	};
	this.UpdateVerRulerBack = function(isattack)
	{
		var drDoc = this.m_oDrawingDocument;
		if (0 <= drDoc.m_lCurrentPage && drDoc.m_lCurrentPage < drDoc.m_lPagesCount)
		{
			this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage], isattack);
		}
		this.UpdateVerRuler();
	};

	this.GoToPage = function(lPageNum)
	{
		var drDoc = this.m_oDrawingDocument;
		if (lPageNum < 0 || lPageNum >= drDoc.m_lPagesCount)
			return;

		// сначала вычислим место для скролла
		var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;

		var lYPos = 0;
		for (var i = 0; i < lPageNum; i++)
		{
			lYPos += (20 + parseInt(this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef));
		}

		drDoc.m_lCurrentPage = lPageNum;
		this.m_oHorRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);
		this.m_oVerRuler.CreateBackground(drDoc.m_arrPages[drDoc.m_lCurrentPage]);

		this.m_bIsUpdateHorRuler = true;
		this.m_bIsUpdateVerRuler = true;

		if (this.m_dDocumentHeight > (this.m_oEditor.HtmlElement.height + 10))
		{
			var y = lYPos * this.m_dScrollY_max / (this.m_dDocumentHeight - this.m_oEditor.HtmlElement.height);
			this.m_oScrollVerApi.scrollTo(0, y + 1);
		}

		if (this.m_oApi.isViewMode === false && null != this.m_oLogicDocument)
		{
			if (false === drDoc.IsFreezePage(drDoc.m_lCurrentPage))
			{
				this.m_oLogicDocument.Set_DocPosType(docpostype_Content);
				this.m_oLogicDocument.Set_CurPage(drDoc.m_lCurrentPage);
				this.m_oLogicDocument.MoveCursorToXY(0, 0, false);
				this.m_oLogicDocument.RecalculateCurPos();
				this.m_oLogicDocument.Document_UpdateSelectionState();

				this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
			}
		}
		else
		{
			this.m_oApi.sync_currentPageCallback(drDoc.m_lCurrentPage);
		}
	};

	this.GetVerticalScrollTo = function(y, page)
	{
		var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;

		var lYPos = 0;
		for (var i = 0; i < page; i++)
		{
			lYPos += (20 + (this.m_oDrawingDocument.m_arrPages[i].height_mm * dKoef + 0.5) >> 0);
		}

		lYPos += y * dKoef;
		return lYPos;
	};

	this.GetHorizontalScrollTo = function(x, page)
	{
		var dKoef = g_dKoef_mm_to_pix * this.m_nZoomValue / 100;
		return 5 + dKoef * x;
	};
}

var _message_update = "zero_delay_update";

//------------------------------------------------------------export----------------------------------------------------
window['AscCommon']                      = window['AscCommon'] || {};
window['AscCommonWord']                  = window['AscCommonWord'] || {};
window['AscCommonWord'].GlobalSkinFlat   = GlobalSkinFlat;
window['AscCommonWord'].GlobalSkin       = GlobalSkin;
window['AscCommonWord'].updateGlobalSkin = updateGlobalSkin;
window['AscCommonWord'].CEditorPage      = CEditorPage;

window['AscCommon'].Page_Width      = Page_Width;
window['AscCommon'].Page_Height     = Page_Height;
window['AscCommon'].X_Left_Margin   = X_Left_Margin;
window['AscCommon'].X_Right_Margin  = X_Right_Margin;
window['AscCommon'].Y_Bottom_Margin = Y_Bottom_Margin;
window['AscCommon'].Y_Top_Margin    = Y_Top_Margin;
