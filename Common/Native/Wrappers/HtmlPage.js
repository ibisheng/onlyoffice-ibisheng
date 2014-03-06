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