function CDrawingDocument()
{
    this.Native = window.native;
    this.Api    = window.editor;

    this.IsLockObjectsEnable    = false;
    this.LogicDocument          = null;

    this.m_dTargetSize          = 0;
    this.m_lCurrentPage         = -1;

    this.Frame = null;
    this.Table = null;
    this.AutoShapesTrack        = null;
}

CDrawingDocument.prototype =
{
	RenderPage : function(nPageIndex)
	{
		var _graphics = new CDrawingStream();
		this.LogicDocument.DrawPage(nPageIndex, _graphics);
	},
    // init lock objects draw
    Start_CollaborationEditing : function()
    {
        this.IsLockObjectsEnable = true;
        this.Native["DD_Start_CollaborationEditing"]();
    },

    // cursor types
    SetCursorType : function(sType, Data)
    {
        this.m_sLockedCursorType = sType;
        this.Native["DD_SetCursorType"](sType, Data);
    },
    LockCursorType : function(sType)
    {
        this.m_sLockedCursorType = sType;
        this.Native["DD_LockCursorType"](sType);
    },
    LockCursorTypeCur : function()
    {
        this.m_sLockedCursorType = this.Native["DD_get_LockCursorType"]();
    },
    UnlockCursorType : function()
    {
        this.m_sLockedCursorType = "";
        this.Native["DD_UnlockCursorType"]();
    },

    // calculatePages
    OnStartRecalculate : function(pageCount)
    {
        this.Native["DD_OnStartRecalculate"](pageCount);
    },
    OnRecalculatePage : function(index, pageObject)
    {
        this.Native["DD_OnRecalculatePage"](index, pageObject.Width, pageObject.Height,
            pageObject.Margins.Left, pageObject.Margins.Top, pageObject.Margins.Right, pageObject.Margins.Bottom);
    },
    OnEndRecalculate : function(isFull, isBreak)
    {
        this.Native["DD_OnEndRecalculate"](isFull, isBreak);
    },

    // repaint pages
    OnRepaintPage : function(index)
    {
        this.Native["DD_OnRepaintPage"](index);
    },
    ChangePageAttack : function(pageIndex)
    {
        // unused function
    },
    ClearCachePages : function()
    {
        this.Native["DD_ClearCachePages"]();
    },

    // is freeze
    IsFreezePage : function(pageIndex)
    {
        return this.Native["DD_IsFreezePage"](pageIndex);
    },

    RenderPageToMemory : function(pageIndex)
    {
        var _stream = new CDrawingStream();
        _stream.Native = this.Native["DD_GetPageStream"]();
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
        this.Native["DD_FirePaint"]();
    },

    IsCursorInTableCur : function(x, y, page)
    {
        return this.Native["DD_IsCursorInTable"](x, y, page);
    },

    // convert coords
    ConvertCoordsToCursorWR : function(x, y, pageIndex, transform)
    {
        var _return = null;
        if (!transform)
            _return = this.Native["DD_ConvertCoordsToCursor"](x, y, pageIndex);
        else
            _return = this.Native["DD_ConvertCoordsToCursor"](x, y, pageIndex,
                transform.sx, transform.shy, transform.shx, transform.sy, transform.tx, transform.ty);
        return { X : _return[0], Y : _return[1], Error: _return[2] };
    },

    ConvertCoordsToAnotherPage : function(x, y, pageCoord, pageNeed)
    {
        var _return = this.Native["DD_ConvertCoordsToAnotherPage"](x, y, pageCoord, pageNeed);
        return { X : _return[0], Y : _return[1], Error: _return[2] };
    },

    // targer
    TargetStart : function()
    {
        this.Native["DD_TargetStart"]();
    },
    TargetEnd : function()
    {
        this.Native["DD_TargetEnd"]();
    },
    SetTargetColor : function(r, g, b)
    {
        this.Native["DD_SetTargetColor"](r, g, b);
    },
    UpdateTargetTransform : function(matrix)
    {
        if (matrix)
            this.Native["DD_UpdateTargetTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.Native["DD_RemoveTargetTransform"]();
    },
    UpdateTarget : function(x, y, pageIndex)
    {
        this.LogicDocument.Set_TargetPos( x, y, pageIndex );
        this.Native["DD_UpdateTarget"](x, y, pageIndex);
    },
    SetTargetSize : function(size)
    {
        this.m_dTargetSize = size;
        this.Native["DD_SetTargetSize"](size);
    },
    TargetShow : function()
    {
        this.Native["DD_TargetShow"]();
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
        this.m_lCurrentPage = this.Native["DD_SetCurrentPage"](PageIndex);
    },

    // select
    SelectEnabled : function(bIsEnabled)
    {
        this.Native["DD_SelectEnabled"](bIsEnabled);
    },
    SelectClear : function()
    {
        this.Native["DD_SelectClear"]();
    },
    AddPageSelection : function(pageIndex, x, y, w, h)
    {
        this.Native["DD_AddPageSelection"](pageIndex, x, y, w, h);
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
        this.Native["DD_StartSearch"]();
    },
    EndSearch : function(bIsChange)
    {
        this.Native["DD_EndSearch"](bIsChange);
    },

    // ruler states
    Set_RulerState_Table : function(markup, transform)
    {
        this.Frame = null;
        this.Table = markup.Table;

        // TODO:
        this.Native["DD_Set_RulerState_Table"](markup, transform);
    },

    Set_RulerState_Paragraph : function(margins)
    {
        this.Table = null;
        if (margins && margins.Frame)
        {
            this.Native["DD_Set_RulerState_Paragraph"](margins.L, margins.T, margins.R, margins.B, true, margins.PageIndex);
            this.Frame = margins.Frame;
        }
        else if (margins)
        {
            this.Frame = null;
            this.Native["DD_Set_RulerState_Paragraph"](margins.L, margins.T, margins.R, margins.B);
        }
        else
        {
            this.Frame = null;
            this.Native["DD_Set_RulerState_Paragraph"]();
        }
    },

    Set_RulerState_HdrFtr : function(bHeader, Y0, Y1)
    {
        this.Frame = null;
        this.Table = null;
        this.Native["DD_Set_RulerState_HdrFtr"](bHeader, Y0, Y1);
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

        this.Native["DD_Update_ParaTab"](Default_Tab, _arr_pos, _arr_types);
    },

    CorrectRulerPosition : function(pos)
    {
        if (global_keyboardEvent.AltKey)
            return pos;

        return ((pos / 2.5 + 0.5) >> 0) * 2.5;
    },

    UpdateTableRuler : function(isCols, index, position)
    {
        this.Native["DD_UpdateTableRuler"](isCols, index, position);
    },

    // convert pixels
    GetDotsPerMM : function(value)
    {
        return value * this.Native["DD_GetDotsPerMM"]();
    },
    GetMMPerDot : function(value)
    {
        return value / this.GetDotsPerMM( 1 );
    },
    GetVisibleMMHeight : function()
    {
        return this.Native["DD_GetVisibleMMHeight"]();
    },

    // вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
    CheckFontCache : function()
    {
        var map_used = this.LogicDocument.Document_CreateFontMap();

        for (var i in map_used)
        {
            this.Native["DD_CheckFontCacheAdd"](map_used[i].Name, map_used[i].Style, map_used[i].Size);
        }
        this.Native["DD_CheckFontCache"]();
    },

    // при загрузке документа - нужно понять какие шрифты используются
    CheckFontNeeds : function()
    {
    },

    // треки
    DrawTrack : function(type, matrix, left, top, width, height, isLine, canRotate)
    {
        if (matrix)
            this.AutoShapesTrack["DD_TrackMatrix"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.AutoShapesTrack["DD_TrackMatrix"]();

        this.AutoShapesTrack["DD_DrawTrack"](type, left, top, width, height, isLine, canRotate);
    },
    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.AutoShapesTrack["DD_DrawTrackSelectShapes"](x, y, w, h);
    },
    DrawAdjustment : function(matrix, x, y)
    {
        if (matrix)
            this.AutoShapesTrack["DD_TrackMatrix"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        else
            this.AutoShapesTrack["DD_TrackMatrix"]();

        this.AutoShapesTrack["DD_DrawAdjustment"](x, y);
    },

    LockTrackPageNum : function(nPageNum)
    {
        this.Native["DD_AutoShapesTrackLockPageNum"](nPageNum);
    },
    UnlockTrackPageNum : function()
    {
        this.Native["DD_AutoShapesTrackLockPageNum"](-1);
    },

    IsMobileVersion : function()
    {
        return false;
    },

    DrawVerAnchor : function(pageNum, xPos)
    {
        this.Native["DD_DrawVerAnchor"](pageNum, xPos);
    },
    DrawHorAnchor : function(pageNum, yPos)
    {
        this.Native["DD_DrawHorAnchor"](pageNum, yPos);
    },

    // track text (inline)
    StartTrackText : function()
    {
        this.Native["DD_StartTrackText"]();
    },
    EndTrackText : function()
    {
        this.Native["DD_EndTrackText"]();
    }
};