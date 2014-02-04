function CDrawingDocument()
{
    this.Native = null;
    this.Api    = null;

    this.IsLockObjectsEnable    = false;
    this.LogicDocument          = null;

    this.m_dTargetSize          = 0;
    this.m_lCurrentPage         = -1;

    this.Frame = null;
    this.Table = null;
    this.AutoShapesTrack        = null;

    ///

    this.m_arrPages         = new Array();
    this.m_lPagesCount      = 0;

    this.m_lDrawingFirst    = -1;
    this.m_lDrawingEnd      = -1;
    this.m_lCurrentPage     = -1;

    this.FrameRect = { IsActive : false, Rect : { X : 0, Y : 0, R : 0, B : 0 }, Frame : null,
        Track : { X : 0, Y : 0, L : 0, T : 0, R : 0, B : 0, PageIndex : 0, Type : -1 }, IsTracked : false, PageIndex : 0 };

    this.m_oCacheManager    = new CCacheManager();

    this.m_lCountCalculatePages = 0;

    this.m_lTimerTargetId = -1;
    this.m_dTargetX = -1;
    this.m_dTargetY = -1;
    this.m_lTargetPage = -1;
    this.m_dTargetSize = 1;

    this.NeedScrollToTarget = true;
    this.NeedScrollToTargetFlag = false;

    this.TargetHtmlElement = null;
    this.TargetHtmlElementLeft = 0;
    this.TargetHtmlElementTop = 0;

    this.m_bIsBreakRecalculate = false;
    this.m_bIsUpdateDocSize = false;

    this.m_bIsSelection = false;
    this.m_bIsSearching = false;
    this.m_lCountRect = 0;

    this.CurrentSearchNavi = null;
    this.SearchTransform = null;

    this.m_lTimerUpdateTargetID = -1;
    this.m_tempX = 0;
    this.m_tempY = 0;
    this.m_tempPageIndex = 0;

    var oThis = this;
    this.m_sLockedCursorType = "";
    this.TableOutlineDr = new CTableOutlineDr();

    this.m_lCurrentRendererPage = -1;
    this.m_oDocRenderer = null;
    this.m_bOldShowMarks = false;

    this.UpdateTargetFromPaint = false;
    this.UpdateTargetCheck = false;
    this.NeedTarget = true;
    this.TextMatrix = null;
    this.TargetShowFlag = false;
    this.TargetShowNeedFlag = false;

    this.CanvasHit = document.createElement('canvas');
    this.CanvasHit.width = 10;
    this.CanvasHit.height = 10;
    this.CanvasHitContext = this.CanvasHit.getContext('2d');

    this.TargetCursorColor = {R: 0, G: 0, B: 0};

    this.GuiControlColorsMap = null;
    this.IsSendStandartColors = false;

    this.GuiCanvasFillTextureParentId = "";
    this.GuiCanvasFillTexture = null;
    this.GuiCanvasFillTextureCtx = null;
    this.LastDrawingUrl = "";

    this.GuiCanvasTextProps = null;
    this.GuiCanvasTextPropsId = "gui_textprops_canvas_id";
    this.GuiLastTextProps = null;

    this.TableStylesLastLook = null;
    this.LastParagraphMargins = null;

    this.TableStylesSheckLook = null;
    this.TableStylesSheckLookFlag = false;

    // параметры для SelectShow
    this.min_PageAddSelection = 100000;
    this.max_PageAddSelection = -1;
    this.IsShowSelectAttack = false;

    this.InlineTextTrackEnabled = false;
    this.InlineTextTrack = null;
    this.InlineTextTrackPage = -1;

    this.AutoShapesTrack = null;
    this.AutoShapesTrackLockPageNum = -1;

    this.Overlay = null;
    this.IsTextMatrixUse = false;

    this.HorVerAnchors = [];
}

CDrawingDocument.prototype =
{
    // init lock objects draw
    Start_CollaborationEditing : function()
    {
        this.IsLockObjectsEnable = true;
        this.Native["Start_CollaborationEditing"]();
    },

    // cursor types
    SetCursorType : function(sType, Data)
    {
        this.m_sLockedCursorType = sType;
        this.Native["SetCursorType"](sType, Data);
    },
    LockCursorType : function(sType)
    {
        this.m_sLockedCursorType = sType;
        this.Native["LockCursorType"](sType);
    },
    LockCursorTypeCur : function()
    {
        this.m_sLockedCursorType = this.Native["get_LockCursorType"]();
    },
    UnlockCursorType : function()
    {
        this.m_sLockedCursorType = "";
        this.Native["UnlockCursorType"]();
    },

    // calculatePages
    OnStartRecalculate : function(pageCount)
    {
        this.Native["OnStartRecalculate"](pageCount);
    },
    OnRecalculatePage : function(index, pageObject)
    {
        this.Native["OnRecalculatePage"](index, pageObject.Width, pageObject.Height,
            pageObject.Margins.Left, pageObject.Margins.Top, pageObject.Margins.Right, pageObject.Margins.Bottom);
    },
    OnEndRecalculate : function(isFull, isBreak)
    {
        this.Native["OnEndRecalculate"](isFull, isBreak);
    },

    // repaint pages
    OnRepaintPage : function(index)
    {
        this.Native["OnRepaintPage"](index);
    },
    ChangePageAttack : function(pageIndex)
    {
        // unused function
    },
    ClearCachePages : function()
    {
        this.Native["ClearCachePages"]();
    },

    // is freeze
    IsFreezePage : function(pageIndex)
    {
        return this.Native["IsFreezePage"](pageIndex);
    },

    RenderPageToMemory : function(pageIndex)
    {
        var _stream = new CDrawingStream();
        _stream.Native = this.Native["GetPageStream"]();
        this.LogicDocument.DrawPage(pageIndex, _stream);
        return _stream.Native;
    },

    CheckRasterImageOnScreen : function(src, pageIndex)
    {
        if (!this.LogicDocument || !this.LogicDocument.DrawingObjects)
            return false;

        var _imgs = this.LogicDocument.DrawingObject.getAllRasterImagesOnPage(i);
        var _len = _imgs.length;
        for (var j = 0; j < _len; j++)
        {
            if (_imgs[j] == src)
                return true;
        }
        return false;
    },

    FirePaint : function()
    {
        this.Native["FirePaint"]();
    },

    IsCursorInTableCur : function(x, y, page)
    {
        return this.Native["IsCursorInTable"](x, y, page);
    },

    // convert coords
    ConvertCoordsToCursorWR : function(x, y, pageIndex, transform)
    {
        var _return = this.Native["ConvertCoordsToCursor"](x, y, pageIndex, transform);
        return { X : _return[0], Y : _return[1], Error: _return[2] };
    },

    ConvertCoordsToAnotherPage : function(x, y, pageCoord, pageNeed)
    {
        var _return = this.Native["ConvertCoordsToAnotherPage"](x, y, pageCoord, pageNeed);
        return { X : _return[0], Y : _return[1], Error: _return[2] };
    },

    // targer
    TargetStart : function()
    {
        this.Native["TargetStart"]();
    },
    TargetEnd : function()
    {
        this.Native["TargetEnd"]();
    },
    SetTargetColor : function(r, g, b)
    {
        this.Native["SetTargetColor"](r, g, b);
    },
    UpdateTargetTransform : function(matrix)
    {
        if (matrix)
            this.Native["UpdateTargetTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.Native["RemoveTargetTransform"]();
    },
    UpdateTarget : function(x, y, pageIndex)
    {
        this.LogicDocument.Set_TargetPos( x, y, pageIndex );
        this.Native["UpdateTarget"](x, y, pageIndex);
    },
    SetTargetSize : function(size)
    {
        this.m_dTargetSize = size;
        this.Native["SetTargetSize"](size);
    },
    TargetShow : function()
    {
        this.Native["TargetShow"]();
    },

    // track images
    StartTrackImage : function(obj, x, y, w, h, type, pagenum)
    {
        // unused function
    },

    // track tables
    StartTrackTable : function(obj, transform)
    {
        // TODO:
    },
    EndTrackTable : function(pointer, bIsAttack)
    {
        // TODO:
    },

    // current page
    SetCurrentPage : function(PageIndex)
    {
        this.m_lCurrentPage = this.Native["SetCurrentPage"](PageIndex);
    },

    // select
    SelectEnabled : function(bIsEnabled)
    {
        this.Native["SelectEnabled"](bIsEnabled);
    },
    SelectClear : function()
    {
        this.Native["SelectClear"]();
    },
    AddPageSelection : function(pageIndex, x, y, w, h)
    {
        this.Native["AddPageSelection"](pageIndex, x, y, w, h);
    },
    OnSelectEnd : function()
    {
        // none
    },
    SelectShow : function()
    {
    },

    // search
    StartSearch : function()
    {
        this.Native["StartSearch"]();
    },
    EndSearch : function(bIsChange)
    {
        this.Native["EndSearch"](bIsChange);
    },

    // ruler states
    Set_RulerState_Table : function(markup, transform)
    {
        this.Frame = null;
        this.Table = markup.Table;

        // TODO:
        this.Native["Set_RulerState_Table"](markup, transform);
    },

    Set_RulerState_Paragraph : function(margins)
    {
        this.Table = null;
        if (margins && margins.Frame)
        {
            this.Native["Set_RulerState_Paragraph"](margins.L, margins.T, margins.R, margins.B, true, margins.PageIndex);
            this.Frame = margins.Frame;
        }
        else if (margins)
        {
            this.Frame = null;
            this.Native["Set_RulerState_Paragraph"](margins.L, margins.T, margins.R, margins.B);
        }
        else
        {
            this.Frame = null;
            this.Native["Set_RulerState_Paragraph"]();
        }
    },

    Set_RulerState_HdrFtr : function(bHeader, Y0, Y1)
    {
        this.Frame = null;
        this.Table = null;
        this.Native["Set_RulerState_HdrFtr"](bHeader, Y0, Y1);
    },

    Update_ParaTab : function(Default_Tab, ParaTabs)
    {
        var _arr_pos = [];
        var _arr_types = [];

        var __tabs = ParaTabs.Tabs;
        if (undefined === __tabs)
            __tabs = ParaTabs;

        var _len = __tabs.length;
        for (var i = 0; i < _len; i++)
        {
            if (__tabs[i].Value == tab_Left)
                _arr_types.push(g_tabtype_left);
            else if (__tabs[i].Value == tab_Center)
                _arr_types.push(g_tabtype_center);
            else if (__tabs[i].Value == tab_Right)
                _arr_types.push(g_tabtype_right);
            else
                _arr_types.push(g_tabtype_left);

            _arr_pos.push(__tabs[i].Pos);
        }

        this.Native["Update_ParaTab"](Default_Tab, _arr_pos, _arr_types);
    },

    CorrectRulerPosition : function(pos)
    {
        if (global_keyboardEvent.AltKey)
            return pos;

        return ((pos / 2.5 + 0.5) >> 0) * 2.5;
    },

    UpdateTableRuler : function(isCols, index, position)
    {
        this.Native["UpdateTableRuler"](isCols, index, position);
    },

    // convert pixels
    GetDotsPerMM : function(value)
    {
        return value * this.Native["GetDotsPerMM"]();
    },
    GetMMPerDot : function(value)
    {
        return value / this.GetDotsPerMM( 1 );
    },
    GetVisibleMMHeight : function()
    {
        return this.Native["GetVisibleMMHeight"]();
    },

    // вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
    CheckFontCache : function()
    {
        var map_used = this.LogicDocument.Document_CreateFontMap();

        for (var i in map_used)
        {
            this.Native["CheckFontCacheAdd"](map_used[i].Name, map_used[i].Style, map_used[i].Size);
        }
        this.Native["CheckFontCache"]();
    },

    // при загрузке документа - нужно понять какие шрифты используются
    CheckFontNeeds : function()
    {
    },

    // треки
    DrawTrack : function(type, matrix, left, top, width, height, isLine, canRotate)
    {
        if (matrix)
            this.AutoShapesTrack["TrackMatrix"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.AutoShapesTrack["TrackMatrix"]();

        this.AutoShapesTrack["DrawTrack"](type, left, top, width, height, isLine, canRotate);
    },
    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.AutoShapesTrack["DrawTrackSelectShapes"](x, y, w, h);
    },
    DrawAdjustment : function(matrix, x, y)
    {
        if (matrix)
            this.AutoShapesTrack["TrackMatrix"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.AutoShapesTrack["TrackMatrix"]();

        this.AutoShapesTrack["DrawAdjustment"](x, y);
    },

    LockTrackPageNum : function(nPageNum)
    {
        this.Native["AutoShapesTrackLockPageNum"](nPageNum);
    },
    UnlockTrackPageNum : function()
    {
        this.Native["AutoShapesTrackLockPageNum"](-1);
    },

    IsMobileVersion : function()
    {
        return false;
    },

    DrawVerAnchor : function(pageNum, xPos)
    {
        this.Native["DrawVerAnchor"](pageNum, xPos);
    },
    DrawHorAnchor : function(pageNum, yPos)
    {
        this.Native["DrawHorAnchor"](pageNum, yPos);
    },

    // track text (inline)
    StartTrackText : function()
    {
        this.Native["StartTrackText"]();
    },
    EndTrackText : function()
    {
        this.Native["EndTrackText"]();
    }
};