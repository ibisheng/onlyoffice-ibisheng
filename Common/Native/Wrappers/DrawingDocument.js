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

    // inline text track
    this.InlineTextTrackEnabled = false;
    this.InlineTextTrack        = null;
    this.InlineTextTrackPage    = -1;
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

        var _array_params1 = [];
        _array_params1.push(markup.Internal.RowIndex);
        _array_params1.push(markup.Internal.CellIndex);
        _array_params1.push(markup.Internal.PageNum);

        _array_params1.push(markup.X);

        _array_params1.push(markup.CurCol);
        _array_params1.push(markup.CurRow);

        if (transform)
        {
            _array_params1.push(transform.sx);
            _array_params1.push(transform.shy);
            _array_params1.push(transform.shx);
            _array_params1.push(transform.sy);
            _array_params1.push(transform.tx);
            _array_params1.push(transform.ty);
        }

        var _array_params_margins = [];
        for (var i = 0; i < markup.Margins.length; i++)
        {
            _array_params_margins.push(markup.Margins[i].Left);
            _array_params_margins.push(markup.Margins[i].Right);
        }

        var _array_params_rows = [];
        for (var i = 0; i < markup.Rows.length; i++)
        {
            _array_params_rows.push(markup.Rows[i].Y);
            _array_params_rows.push(markup.Rows[i].H);
        }

        this.Native["DD_Set_RulerState_Table"](_array_params1, markup.Cols, _array_params_margins, _array_params_rows);
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

    Update_ParaInd : function( Ind )
    {
        var FirstLine = 0,
            Left = 0,
            Right = 0;
        if ( "undefined" != typeof(Ind) )
        {
            if("undefined" != typeof(Ind.FirstLine))
            {
                FirstLine = Ind.FirstLine;
            }
            if("undefined" != typeof(Ind.Left))
            {
                Left = Ind.Left;
            }
            if("undefined" != typeof(Ind.Right))
            {
                Right = Ind.Right;
            }
        }

        this.Native["DD_Update_ParaInd"](FirstLine, Left, Right);
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
        this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate);        
    },
    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
    },
    DrawAdjustment : function(matrix, x, y)
    {
        this.AutoShapesTrack.DrawAdjustment(matrix, x, y);
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
        this.InlineTextTrackEnabled = true;
        this.InlineTextTrack        = null;
        this.InlineTextTrackPage    = -1;
        this.Native["DD_StartTrackText"]();
    },
    EndTrackText : function()
    {
        this.InlineTextTrackEnabled = false;

        this.LogicDocument.On_DragTextEnd(this.InlineTextTrack, global_keyboardEvent.CtrlKey);
        this.InlineTextTrack        = null;
        this.InlineTextTrackPage    = -1;
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
        
        this.Native["DD_Overlay_UpdateStart"]();

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
                this.AutoShapesTrack.SetPageIndexSimple(indP);
                this.LogicDocument.DrawingObjects.drawSelect(indP);
            }

            this.AutoShapesTrack.SetCurrentPage(-100);
            if (this.LogicDocument.DrawingObjects.needUpdateOverlay())
            {
                this.AutoShapesTrack.PageIndex = -1;
                this.LogicDocument.DrawingObjects.drawOnOverlay(this.AutoShapesTrack);
                this.AutoShapesTrack.CorrectOverlayBounds();
            }
            this.AutoShapesTrack.SetCurrentPage(-101);
        }

        this.Native["DD_Overlay_DrawTableTrack"]();
        this.Native["DD_Overlay_DrawFrameTrack"]();

        if (this.InlineTextTrackEnabled && null != this.InlineTextTrack)
        {
            this.AutoShapesTrack.DrawInlineMoveCursor(this.InlineTextTrackPage,
                this.InlineTextTrack.X, this.InlineTextTrack.Y, this.InlineTextTrack.Height,
                this.InlineTextTrack.transform);
        }

        this.Native["DD_Overlay_DrawHorVerAnchor"]();
        
        this.Native["DD_Overlay_UpdateEnd"]();

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
            /*
            var ret = this.Native["checkMouseDown_Drawing"](pos.X, pos.Y, pos.Page);
            if (ret === true)
                return;
            */
            var is_drawing = this.checkMouseDown_Drawing(pos);
            if (is_drawing === true)
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

        /*
        var is_drawing = this.Native["checkMouseUp_Drawing"](pos.X, pos.Y, pos.Page);
        if (is_drawing === true)
            return;
        */
        var is_drawing = this.checkMouseUp_Drawing(pos);
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

        /*
        var is_drawing = this.Native["checkMouseMove_Drawing"](pos.X, pos.Y, pos.Page);
        if (is_drawing === true)
            return;
        */
        var is_drawing = this.checkMouseMove_Drawing(pos);
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
    },

    // drawings mouse events
    checkMouseDown_Drawing : function(pos)
    {
        /*
        var _ret = this.TableOutlineDr.checkMouseDown(pos, oWordControl);
        if (_ret === true)
        {
            oWordControl.m_oLogicDocument.Selection_Remove();
            this.TableOutlineDr.bIsTracked = true;
            this.LockCursorType("move");

            this.TableOutlineDr.TableOutline.Table.Select_All();
            this.TableOutlineDr.TableOutline.Table.Document_SetThisElementCurrent(true);

            if (-1 == oWordControl.m_oTimerScrollSelect)
            {
                oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
            }
            oWordControl.EndUpdateOverlay();
            return true;
        }

        if (this.FrameRect.IsActive)
        {
            var eps = 10 * g_dKoef_pix_to_mm * 100 / oWordControl.m_nZoomValue;
            var _check = this.checkCursorOnTrackRect(pos.X, pos.Y, eps, this.FrameRect.Rect);

            if (-1 != _check)
            {
                this.FrameRect.IsTracked = true;
                this.FrameRect.Track.X = pos.X;
                this.FrameRect.Track.Y = pos.Y;
                this.FrameRect.Track.Type = _check;

                switch (_check)
                {
                    case 0:
                    {
                        this.LockCursorType("nw-resize");
                        break;
                    }
                    case 1:
                    {
                        this.LockCursorType("n-resize");
                        break;
                    }
                    case 2:
                    {
                        this.LockCursorType("ne-resize");
                        break;
                    }
                    case 3:
                    {
                        this.LockCursorType("e-resize");
                        break;
                    }
                    case 4:
                    {
                        this.LockCursorType("se-resize");
                        break;
                    }
                    case 5:
                    {
                        this.LockCursorType("s-resize");
                        break;
                    }
                    case 6:
                    {
                        this.LockCursorType("sw-resize");
                        break;
                    }
                    case 7:
                    {
                        this.LockCursorType("w-resize");
                        break;
                    }
                    default:
                    {
                        this.LockCursorType("move");
                        break;
                    }
                }

                if (-1 == oWordControl.m_oTimerScrollSelect)
                {
                    oWordControl.m_oTimerScrollSelect = setInterval(oWordControl.SelectWheel, 20);
                }
                oWordControl.EndUpdateOverlay();
                return true;
            }
        }
        */

        return false;
    },

    checkMouseMove_Drawing : function(pos)
    {
        /*
        var oWordControl = this.m_oWordControl;
        if (this.TableOutlineDr.bIsTracked)
        {
            this.TableOutlineDr.checkMouseMove(global_mouseEvent.X, global_mouseEvent.Y, oWordControl);
            oWordControl.ShowOverlay();
            oWordControl.OnUpdateOverlay();
            oWordControl.EndUpdateOverlay();
            return true;
        }
        */

        if (this.InlineTextTrackEnabled)
        {
            this.InlineTextTrack        = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
            this.InlineTextTrackPage    = pos.Page;

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        /*
        if (this.FrameRect.IsActive)
        {
            if (!this.FrameRect.IsTracked && this.FrameRect.PageIndex == pos.Page)
            {
                var eps = 10 * g_dKoef_pix_to_mm * 100 / oWordControl.m_nZoomValue;
                var _check = this.checkCursorOnTrackRect(pos.X, pos.Y, eps, this.FrameRect.Rect);

                if (_check != -1)
                {
                    switch (_check)
                    {
                        case 0:
                        {
                            this.SetCursorType("nw-resize");
                            break;
                        }
                        case 1:
                        {
                            this.SetCursorType("n-resize");
                            break;
                        }
                        case 2:
                        {
                            this.SetCursorType("ne-resize");
                            break;
                        }
                        case 3:
                        {
                            this.SetCursorType("e-resize");
                            break;
                        }
                        case 4:
                        {
                            this.SetCursorType("se-resize");
                            break;
                        }
                        case 5:
                        {
                            this.SetCursorType("s-resize");
                            break;
                        }
                        case 6:
                        {
                            this.SetCursorType("sw-resize");
                            break;
                        }
                        case 7:
                        {
                            this.SetCursorType("w-resize");
                            break;
                        }
                        default:
                        {
                            this.SetCursorType("move");
                            break;
                        }
                    }
                    // оверлей не нужно перерисовывать
                    oWordControl.EndUpdateOverlay();
                    return true;
                }
            }
            else
            {
                this.checkTrackRect(pos);

                oWordControl.ShowOverlay();
                oWordControl.OnUpdateOverlay();
                oWordControl.EndUpdateOverlay();
                return true;
            }
        }
        */

        return false;
    },

    checkMouseUp_Drawing : function(pos)
    {
        /*
        var oWordControl = this.m_oWordControl;
        if (this.TableOutlineDr.bIsTracked)
        {
            this.TableOutlineDr.checkMouseUp(global_mouseEvent.X, global_mouseEvent.Y, oWordControl);
            oWordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            oWordControl.m_oLogicDocument.Document_UpdateRulersState();

            if (-1 != oWordControl.m_oTimerScrollSelect)
            {
                clearInterval(oWordControl.m_oTimerScrollSelect);
                oWordControl.m_oTimerScrollSelect = -1;
            }
            oWordControl.OnUpdateOverlay();

            oWordControl.EndUpdateOverlay();
            return true;
        }
        */

        if (this.InlineTextTrackEnabled)
        {
            this.InlineTextTrack        = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
            this.InlineTextTrackPage    = pos.Page;
            this.EndTrackText();

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        /*
        if (this.FrameRect.IsActive && this.FrameRect.IsTracked)
        {
            this.FrameRect.IsTracked = false;

            this.checkTrackRect(pos);
            var _track = this.FrameRect.Track;
            this.FrameRect.Frame.Change_Frame(_track.L, _track.T, _track.R - _track.L, _track.B - _track.T, _track.PageIndex);

            if (-1 != oWordControl.m_oTimerScrollSelect)
            {
                clearInterval(oWordControl.m_oTimerScrollSelect);
                oWordControl.m_oTimerScrollSelect = -1;
            }
            oWordControl.OnUpdateOverlay();

            oWordControl.EndUpdateOverlay();
            return true;
        }
        */
        return false;
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

