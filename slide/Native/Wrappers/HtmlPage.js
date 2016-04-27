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

var X_Left_Field   = X_Left_Margin;
var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field    = Y_Top_Margin;



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

function sendStatus(Message)
{
    editor.sync_StatusMessage(Message);
}