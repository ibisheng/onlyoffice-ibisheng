function CDrawingDocument()
{
    this.Native = window.native;
    this.Api    = window.editor;

    this.IsLockObjectsEnable    = false;
    this.LogicDocument          = null;
    
    this.CanvasHitContext       = CreateHitControl();

    this.m_dTargetSize          = 0;
    this.m_lCurrentPage         = -1;

    this.Frame = null;
    this.Table = null;
    this.AutoShapesTrack        = new CAutoshapeTrack();
    
    this.m_oWordControl = this;

    this.IsUpdateOverlayOnlyEnd         = false;
    this.IsUpdateOverlayOnlyEndReturn   = false;
    this.IsUpdateOverlayOnEndCheck      = false;

    this.m_bIsSelection         = false;
    this.m_bIsMouseLock         = false;

    this.IsKeyDownButNoPress    = false;
    this.bIsUseKeyPress         = false;
    
    this.m_sLockedCursorType    = "";
    
    this.AutoShapesTrackLockPageNum = -1;
}

CDrawingDocument.prototype =
{
    AfterLoad : function()
    {
        this.m_oWordControl = this;
        this.LogicDocument  = window.editor.WordControl.m_oLogicDocument;
        this.LogicDocument.DrawingDocument = this;        
    },
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
        if ("" == this.m_sLockedCursorType)
            this.Native["DD_SetCursorType"](sType, Data);
        else
            this.Native["DD_SetCursorType"](this.m_sLockedCursorType, Data);
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

    // target
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
        this.m_bIsSelection = bIsEnabled;
        if (false === this.m_bIsSelection)
        {
            this.SelectClear();
            this.OnUpdateOverlay();
        }
        //this.Native["DD_SelectEnabled"](bIsEnabled);
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
        this.OnUpdateOverlay();
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
        this.AutoShapesTrackLockPageNum = nPageNum;
        //this.Native["DD_AutoShapesTrackLockPageNum"](nPageNum);
    },
    UnlockTrackPageNum : function()
    {
        this.AutoShapesTrackLockPageNum = -1;
        //this.Native["DD_AutoShapesTrackLockPageNum"](-1);
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
    },

    // html page
    StartUpdateOverlay : function()
    {
        this.IsUpdateOverlayOnlyEnd = true;
    },
    EndUpdateOverlay : function()
    {
        if (this.IsUpdateOverlayOnlyEndReturn)
            return;

        this.IsUpdateOverlayOnlyEnd = false;
        if (this.IsUpdateOverlayOnEndCheck)
            this.OnUpdateOverlay();

        this.IsUpdateOverlayOnEndCheck = false;
    },
    OnUpdateOverlay : function()
    {
        if (this.IsUpdateOverlayOnlyEnd)
        {
            this.IsUpdateOverlayOnEndCheck = true;
            return false;
        }

        this.Native["DD_Overlay_Clear"]();

        var drawingFirst    = this.Native["GetDrawingFirstPage"]();
        var drawingEnd      = this.Native["GetDrawingEndPage"]();
        if (this.m_bIsSelection)
        {
            this.Native["DD_Overlay_StartDrawSelection"]();

            for (var i = drawingFirst; i <= drawingEnd; i++)
            {
                if (!this.IsFreezePage(i))
                    this.LogicDocument.Selection_Draw_Page(i);
            }

            this.Native["DD_Overlay_EndDrawSelection"]();
        }

        // проверки - внутри
        this.Native["DD_Overlay_DrawTableOutline"]();

        // drawShapes (+ track)
        if (this.LogicDocument.DrawingObjects)
        {
            for (var indP = drawingFirst; indP <= drawingEnd; indP++)
            {
                this.AutoShapesTrack.PageIndex = indP;
                this.LogicDocument.DrawingObjects.drawSelect(indP);
            }

            if (this.LogicDocument.DrawingObjects.needUpdateOverlay())
            {
                this.AutoShapesTrack.PageIndex = -1;
                this.LogicDocument.DrawingObjects.drawOnOverlay(this.AutoShapesTrack);
                this.AutoShapesTrack.CorrectOverlayBounds();
            }
        }

        this.Native["DD_Overlay_DrawTableTrack"]();
        this.Native["DD_Overlay_DrawFrameTrack"]();
        this.Native["DD_Overlay_DrawInlineTextTrackEnabled"]();
        this.Native["DD_Overlay_DrawHorVerAnchor"]();

        return true;
    },

    OnMouseDown : function(e)
    {
        check_MouseDownEvent(e, true);

        // у Илюхи есть проблема при вводе с клавы, пока нажата кнопка мыши
        if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button))
            this.m_bIsMouseLock = true;

        this.StartUpdateOverlay();

        if ((0 == global_mouseEvent.Button) || (undefined == global_mouseEvent.Button))
        {
            var pos = null;
            if (this.AutoShapesTrackLockPageNum == -1)
                pos = this.Native["DD_ConvertCoordsFromCursor"](global_mouseEvent.X, global_mouseEvent.Y);
            else
                pos = this.Native["DD_ConvetToPageCoords"](global_mouseEvent.X, global_mouseEvent.Y, this.AutoShapesTrackLockPageNum);

            if (pos.Page == -1)
            {
                this.EndUpdateOverlay();
                return;
            }

            if (this.IsFreezePage(pos.Page))
            {
                this.EndUpdateOverlay();
                return;
            }

            // теперь проверить трек таблиц
            var ret = this.Native["checkMouseDown_Drawing"](pos.X, pos.Y, pos.Page);
            if (ret === true)
                return;

            this.Native["DD_NeedScrollToTargetFlag"](true);
            this.LogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
            this.Native["DD_NeedScrollToTargetFlag"](false);
        }

        this.Native["DD_CheckTimerScroll"](true);
        this.EndUpdateOverlay();
    },

    OnMouseUp : function(e)
    {
        check_MouseUpEvent(e);

        var pos = null;
        if (this.AutoShapesTrackLockPageNum == -1)
            pos = this.Native["DD_ConvertCoordsFromCursor"](global_mouseEvent.X, global_mouseEvent.Y);
        else
            pos = this.Native["DD_ConvetToPageCoords"](global_mouseEvent.X, global_mouseEvent.Y, this.AutoShapesTrackLockPageNum);

        if (pos.Page == -1)
            return;

        if (this.IsFreezePage(pos.Page))
            return;

        this.UnlockCursorType();

        this.StartUpdateOverlay();

        // восстанавливаем фокус
        this.m_bIsMouseLock = false;

        var is_drawing = this.Native["checkMouseUp_Drawing"](pos.X, pos.Y, pos.Page);
        if (is_drawing === true)
            return;

        this.Native["DD_CheckTimerScroll"](false);

        this.Native.m_bIsMouseUpSend = true;

        this.Native["DD_NeedScrollToTargetFlag"](true);
        this.LogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
        this.Native["DD_NeedScrollToTargetFlag"](false);

        this.Native.m_bIsMouseUpSend = false;
        this.LogicDocument.Document_UpdateInterfaceState();
        this.LogicDocument.Document_UpdateRulersState();

        this.EndUpdateOverlay();
    },

    OnMouseMove : function(e)
    {
        check_MouseMoveEvent(e);
        var pos = null;
        if (this.AutoShapesTrackLockPageNum == -1)
            pos = this.Native["DD_ConvertCoordsFromCursor"](global_mouseEvent.X, global_mouseEvent.Y);
        else
            pos = this.Native["DD_ConvetToPageCoords"](global_mouseEvent.X, global_mouseEvent.Y, this.AutoShapesTrackLockPageNum);

        if (pos.Page == -1)
            return;

        if (this.IsFreezePage(pos.Page))
            return;

        if (this.m_sLockedCursorType != "")
            this.SetCursorType("default");

        this.StartUpdateOverlay();
        var is_drawing = this.Native["checkMouseMove_Drawing"](pos.X, pos.Y, pos.Page);
        if (is_drawing === true)
            return;

        this.LogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
        this.EndUpdateOverlay();
    },

    OnKeyDown : function(e)
    {
        check_KeyboardEvent(e);

        if (this.IsFreezePage(this.m_lCurrentPage))
            return;

        this.StartUpdateOverlay();

        this.IsKeyDownButNoPress = true;
        this.bIsUseKeyPress = (this.LogicDocument.OnKeyDown(global_keyboardEvent) === true) ? false : true;

        this.EndUpdateOverlay();
    },

    OnKeyUp : function(e)
    {
        global_keyboardEvent.AltKey     = false;
        global_keyboardEvent.CtrlKey    = false;
        global_keyboardEvent.ShiftKey   = false;
    },

    OnKeyPress : function(e)
    {
        if (false === this.bIsUseKeyPress)
            return;

        if (this.IsFreezePage(this.m_lCurrentPage))
            return;

        check_KeyboardEvent(e);

        this.StartUpdateOverlay();
        var retValue = this.LogicDocument.OnKeyPress(global_keyboardEvent);
        this.EndUpdateOverlay();
        return retValue;
    },
    
    ///////////////////////////////////////////
    StartTableStylesCheck : function()
    {        
    },

    EndTableStylesCheck : function()
    {
    },

    CheckTableStyles : function(tableLook)
    {
    },
    
    SendControlColors : function()
    {
    },
    SendThemeColorScheme : function()
    {
    },
    DrawImageTextureFillShape : function()
    {
    },
    DrawGuiCanvasTextProps : function()
    {
    }
};

function check_KeyboardEvent(e)
{
    global_keyboardEvent.AltKey     = ((e.Flags & 0x01) == 0x01);
    global_keyboardEvent.CtrlKey    = ((e.Flags & 0x02) == 0x02);
    global_keyboardEvent.ShiftKey   = ((e.Flags & 0x04) == 0x04);

    global_keyboardEvent.Sender = null;

    global_keyboardEvent.CharCode   = e.CharCode;
    global_keyboardEvent.KeyCode    = e.KeyCode;
    global_keyboardEvent.Which      = null;
}

function check_MouseDownEvent(e, isClicks)
{
    global_mouseEvent.X = e.X;
    global_mouseEvent.Y = e.Y;

    global_mouseEvent.AltKey     = ((e.Flags & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e.Flags & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e.Flags & 0x04) == 0x04);

    global_mouseEvent.Type      = g_mouse_event_type_down;
    global_mouseEvent.Button    = e.Button;

    global_mouseEvent.Sender    = null;

    if (isClicks)
    {
        global_mouseEvent.ClickCount = e.ClickCount;
    }
    else
    {
        global_mouseEvent.ClickCount     = 1;
    }
    
    global_mouseEvent.IsLocked = true;
}

function check_MouseMoveEvent(e)
{
    global_mouseEvent.X = e.X;
    global_mouseEvent.Y = e.Y;

    global_mouseEvent.AltKey     = ((e.Flags & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e.Flags & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e.Flags & 0x04) == 0x04);

    global_mouseEvent.Type      = g_mouse_event_type_move;
    global_mouseEvent.Button    = e.Button;
}

function check_MouseUpEvent(e)
{
    global_mouseEvent.X = e.X;
    global_mouseEvent.Y = e.Y;

    global_mouseEvent.AltKey     = ((e.Flags & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e.Flags & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e.Flags & 0x04) == 0x04);

    global_mouseEvent.Type      = g_mouse_event_type_up;
    global_mouseEvent.Button    = e.Button;

    global_mouseEvent.Sender    = null;
    
    global_mouseEvent.IsLocked  = false;
}

