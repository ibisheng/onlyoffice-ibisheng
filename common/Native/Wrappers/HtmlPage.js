var g_dDpiX = 96.0;
var g_dDpiY = 96.0;

var g_dKoef_mm_to_pix = g_dDpiX / 25.4;
var g_dKoef_pix_to_mm = 25.4 / g_dDpiX;

var g_bIsMobile =  AscCommon.AscBrowser.isMobile;

var Page_Width     = 210;
var Page_Height    = 297;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var X_Left_Field   = X_Left_Margin;
var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field    = Y_Top_Margin;

var docpostype_Content     = 0x00;
var docpostype_HdrFtr      = 0x02;

var selectionflag_Common        = 0x00;
var selectionflag_Numbering     = 0x01;
var selectionflag_DrawingObject = 0x002;

var orientation_Portrait  = 0x00;
var orientation_Landscape = 0x01;

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

function CEditorPage(api)
{
    this.Name = "";

    this.X = 0;
    this.Y = 0;
    this.Width      = 10;
    this.Height     = 10;

    this.m_oDrawingDocument = new CDrawingDocument();
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
};