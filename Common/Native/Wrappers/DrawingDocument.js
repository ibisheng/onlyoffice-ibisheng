function CTableOutlineDr()
{
    this.image = {};
    this.image.width  = 13;
    this.image.height = 13;

    this.TableOutline = null;
    this.Counter = 0;
    this.bIsNoTable = true;
    this.bIsTracked = false;

    this.CurPos = null;
    this.TrackTablePos = 0; // 0 - left_top, 1 - right_top, 2 - right_bottom, 3 - left_bottom
    this.TrackOffsetX = 0;
    this.TrackOffsetY = 0;

    this.InlinePos = null;

    this.IsChangeSmall = true;
    this.ChangeSmallPoint = null;

    this.TableMatrix        = null;
    this.CurrentPageIndex   = null;

    this.Native = window.native;

    this.checkMouseDown = function(pos, drDoc)
    {
        if (null == this.TableOutline)
            return false;

        var _table_track = this.TableOutline;
        var _d = 13 / this.Native["DD_GetDotsPerMM"]();

        this.IsChangeSmall = true;
        this.ChangeSmallPoint = pos;

        if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix))
        {
            switch (this.TrackTablePos)
            {
                case 1:
                {
                    var _x = _table_track.X + _table_track.W;
                    var _b = _table_track.Y;
                    var _y = _b - _d;
                    var _r = _x + _d;

                    if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
                    {
                        this.TrackOffsetX = pos.X - _x;
                        this.TrackOffsetY = pos.Y - _b;
                        return true;
                    }
                    return false;
                }
                case 2:
                {
                    var _x = _table_track.X + _table_track.W;
                    var _y = _table_track.Y + _table_track.H;
                    var _r = _x + _d;
                    var _b = _y + _d;

                    if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
                    {
                        this.TrackOffsetX = pos.X - _x;
                        this.TrackOffsetY = pos.Y - _y;
                        return true;
                    }
                    return false;
                }
                case 3:
                {
                    var _r = _table_track.X;
                    var _x = _r - _d;
                    var _y = _table_track.Y + _table_track.H;
                    var _b = _y + _d;

                    if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
                    {
                        this.TrackOffsetX = pos.X - _r;
                        this.TrackOffsetY = pos.Y - _y;
                        return true;
                    }
                    return false;
                }
                case 0:
                default:
                {
                    var _r = _table_track.X;
                    var _b = _table_track.Y;
                    var _x = _r - _d;
                    var _y = _b - _d;

                    if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b))
                    {
                        this.TrackOffsetX = pos.X - _r;
                        this.TrackOffsetY = pos.Y - _b;
                        return true;
                    }
                    return false;
                }
            }
        }
        else
        {
            var _invert = global_MatrixTransformer.Invert(this.TableMatrix);
            var _posx = _invert.TransformPointX(pos.X, pos.Y);
            var _posy = _invert.TransformPointY(pos.X, pos.Y);
            switch (this.TrackTablePos)
            {
                case 1:
                {
                    var _x = _table_track.X + _table_track.W;
                    var _b = _table_track.Y;
                    var _y = _b - _d;
                    var _r = _x + _d;

                    if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
                    {
                        this.TrackOffsetX = _posx - _x;
                        this.TrackOffsetY = _posy - _b;
                        return true;
                    }
                    return false;
                }
                case 2:
                {
                    var _x = _table_track.X + _table_track.W;
                    var _y = _table_track.Y + _table_track.H;
                    var _r = _x + _d;
                    var _b = _y + _d;

                    if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
                    {
                        this.TrackOffsetX = _posx - _x;
                        this.TrackOffsetY = _posy - _y;
                        return true;
                    }
                    return false;
                }
                case 3:
                {
                    var _r = _table_track.X;
                    var _x = _r - _d;
                    var _y = _table_track.Y + _table_track.H;
                    var _b = _y + _d;

                    if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
                    {
                        this.TrackOffsetX = _posx - _r;
                        this.TrackOffsetY = _posy - _y;
                        return true;
                    }
                    return false;
                }
                case 0:
                default:
                {
                    var _r = _table_track.X;
                    var _b = _table_track.Y;
                    var _x = _r - _d;
                    var _y = _b - _d;

                    if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b))
                    {
                        this.TrackOffsetX = _posx - _r;
                        this.TrackOffsetY = _posy - _b;
                        return true;
                    }
                    return false;
                }
            }
        }

        return false;
    }

    this.checkMouseUp = function(X, Y, drDoc)
    {
        this.bIsTracked = false;

        if (null == this.TableOutline || (true === this.IsChangeSmall) || drDoc.Api.isViewMode)
            return false;

        var _dKoef_mm_to_pix = this.Native["DD_GetDotsPerMM"]();
        var _d = 13 / _dKoef_mm_to_pix;

        var _outline = this.TableOutline;
        var _table = _outline.Table;

        _table.Cursor_MoveToStartPos();
        _table.Document_SetThisElementCurrent(true);

        if (!_table.Is_Inline())
        {
            var pos;
            switch (this.TrackTablePos)
            {
                case 1:
                {
                    var _w_pix = this.TableOutline.W * _dKoef_mm_to_pix;
                    pos = this.Native["DD_ConvertCoordsFromCursor"](X - _w_pix, Y);
                    break;
                }
                case 2:
                {
                    var _w_pix = this.TableOutline.W * _dKoef_mm_to_pix;
                    var _h_pix = this.TableOutline.H * _dKoef_mm_to_pix;
                    pos = this.Native["DD_ConvertCoordsFromCursor"](X - _w_pix, Y - _h_pix);
                    break;
                }
                case 3:
                {
                    var _h_pix = this.TableOutline.H * _dKoef_mm_to_pix;
                    pos = this.Native["DD_ConvertCoordsFromCursor"](X, Y - _h_pix);
                    break;
                }
                case 0:
                default:
                {
                    pos = this.Native["DD_ConvertCoordsFromCursor"](X, Y);
                    break;
                }
            }

            var NearestPos = drDoc.LogicDocument.Get_NearestPos(pos.Page, pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY);
            _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page, NearestPos);
            _outline.X = pos.X - this.TrackOffsetX;
            _outline.Y = pos.Y - this.TrackOffsetY;
            _outline.PageNum = pos.Page;
        }
        else
        {
            if (null != this.InlinePos)
            {
                // inline move
                _table.Move(this.InlinePos.X, this.InlinePos.Y, this.InlinePos.Page, this.InlinePos);
            }
        }
    }

    this.checkMouseMove = function(X, Y, drDoc)
    {
        if (null == this.TableOutline)
            return false;

        var _dKoef_mm_to_pix = this.Native["DD_GetDotsPerMM"]();

        if (true === this.IsChangeSmall)
        {
            var _pos = this.Native["DD_ConvertCoordsFromCursor"](X, Y);
            var _dist = 15 / _dKoef_mm_to_pix;
            if ((Math.abs(_pos.X - this.ChangeSmallPoint.X) < _dist) && (Math.abs(_pos.Y - this.ChangeSmallPoint.Y) < _dist) && (_pos.Page == this.ChangeSmallPoint.Page))
            {
                this.CurPos = { X: this.ChangeSmallPoint.X, Y : this.ChangeSmallPoint.Y, Page: this.ChangeSmallPoint.Page };

                switch (this.TrackTablePos)
                {
                    case 1:
                    {
                        this.CurPos.X -= this.TableOutline.W;
                        break;
                    }
                    case 2:
                    {
                        this.CurPos.X -= this.TableOutline.W;
                        this.CurPos.Y -= this.TableOutline.H;
                        break;
                    }
                    case 3:
                    {
                        this.CurPos.Y -= this.TableOutline.H;
                        break;
                    }
                    case 0:
                    default:
                    {
                        break;
                    }
                }

                this.CurPos.X -= this.TrackOffsetX;
                this.CurPos.Y -= this.TrackOffsetY;
                return;
            }
            this.IsChangeSmall = false;

            this.TableOutline.Table.Selection_Remove();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }

        var _d = 13 / _dKoef_mm_to_pix;
        switch (this.TrackTablePos)
        {
            case 1:
            {
                var _w_pix = this.TableOutline.W * _dKoef_mm_to_pix;
                this.CurPos = this.Native["DD_ConvertCoordsFromCursor"](X - _w_pix, Y);
                break;
            }
            case 2:
            {
                var _w_pix = this.TableOutline.W * _dKoef_mm_to_pix;
                var _h_pix = this.TableOutline.H * _dKoef_mm_to_pix;
                this.CurPos = this.Native["DD_ConvertCoordsFromCursor"](X - _w_pix, Y - _h_pix);
                break;
            }
            case 3:
            {
                var _h_pix = this.TableOutline.H * _dKoef_mm_to_pix;
                this.CurPos = this.Native["DD_ConvertCoordsFromCursor"](X, Y - _h_pix);
                break;
            }
            case 0:
            default:
            {
                this.CurPos = this.Native["DD_ConvertCoordsFromCursor"](X, Y);
                break;
            }
        }

        this.CurPos.X -= this.TrackOffsetX;
        this.CurPos.Y -= this.TrackOffsetY;
    }

    this.CheckStartTrack = function(drDoc, transform)
    {
        this.TableMatrix = null;
        if (transform)
            this.TableMatrix = transform.CreateDublicate();

        var _bounds = this.Native["DD_GetControlSizes"]();

        if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix))
        {
            var pos = this.Native["DD_ConvertCoordsToCursor"](this.TableOutline.X, this.TableOutline.Y, this.TableOutline.PageNum);

            var _x0 = 0;
            var _y0 = 0;

            if (pos.X < _x0 && pos.Y < _y0)
            {
                this.TrackTablePos = 2;
            }
            else if (pos.X < _x0)
            {
                this.TrackTablePos = 1;
            }
            else if (pos.Y < _y0)
            {
                this.TrackTablePos = 3;
            }
            else
            {
                this.TrackTablePos = 0;
            }
        }
        else
        {
            var _x = this.TableOutline.X;
            var _y = this.TableOutline.Y;
            var _r = _x + this.TableOutline.W;
            var _b = _y + this.TableOutline.H;

            var x0 = transform.TransformPointX(_x, _y);
            var y0 = transform.TransformPointY(_x, _y);

            var x1 = transform.TransformPointX(_r, _y);
            var y1 = transform.TransformPointY(_r, _y);

            var x2 = transform.TransformPointX(_r, _b);
            var y2 = transform.TransformPointY(_r, _b);

            var x3 = transform.TransformPointX(_x, _b);
            var y3 = transform.TransformPointY(_x, _b);

            var _x0 = 0;
            var _y0 = 0;
            var _x1 = _bounds[0];
            var _y1 = _bounds[1];

            var pos0 = this.Native["DD_ConvertCoordsToCursor"](x0, y0, this.TableOutline.PageNum);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 0;
                return;
            }

            pos0 = this.Native["DD_ConvertCoordsToCursor"](x1, y1, this.TableOutline.PageNum);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 1;
                return;
            }

            pos0 =this.Native["DD_ConvertCoordsToCursor"](x3, y3, this.TableOutline.PageNum);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 3;
                return;
            }

            pos0 = this.Native["DD_ConvertCoordsToCursor"](x2, y2, this.TableOutline.PageNum);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 2;
                return;
            }

            this.TrackTablePos = 0;
        }
    }
}

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

    // frame rect
    this.FrameRect = { IsActive : false, Rect : { X : 0, Y : 0, R : 0, B : 0 }, Frame : null,
        Track : { X : 0, Y : 0, L : 0, T : 0, R : 0, B : 0, PageIndex : 0, Type : -1 }, IsTracked : false, PageIndex : 0 };

    // table track
    this.TableOutlineDr = new CTableOutlineDr();
}

CDrawingDocument.prototype =
{
    AfterLoad : function()
    {
        this.m_oWordControl = this;
		this.Api = window.editor;
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
        this.TableOutlineDr.TableOutline = null;

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
        this.TableOutlineDr.TableOutline    = obj;
        this.TableOutlineDr.Counter         = 0;
        this.TableOutlineDr.bIsNoTable      = false;
        this.TableOutlineDr.CheckStartTrack(this, transform);
    },
    EndTrackTable : function(pointer, bIsAttack)
    {
        if (this.TableOutlineDr.TableOutline != null)
        {
            if (pointer == this.TableOutlineDr.TableOutline.Table || bIsAttack)
            {
                this.TableOutlineDr.TableOutline = null;
                this.TableOutlineDr.Counter = 0;
            }
        }
    },

    CheckTrackTable : function()
    {
        if (null == this.TableOutlineDr.TableOutline)
            return;

        if (this.TableOutlineDr.bIsNoTable && this.TableOutlineDr.bIsTracked === false)
        {
            this.TableOutlineDr.Counter++;
            if (this.TableOutlineDr.Counter > 100)
            {
                this.TableOutlineDr.TableOutline = null;
                this.OnUpdateOverlay();
            }
        }
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
        this.FrameRect.IsActive = false;
        this.Table = markup.Table;

        var _array_params1 = [];
        _array_params1.push(markup.Internal.RowIndex);
        _array_params1.push(markup.Internal.CellIndex);
        _array_params1.push(markup.Internal.PageNum);

        _array_params1.push(markup.X);

        _array_params1.push(markup.CurCol);
        _array_params1.push(markup.CurRow);

        this.TableOutlineDr.TableMatrix         = null;
        this.TableOutlineDr.CurrentPageIndex    = this.m_lCurrentPage;

        if (transform)
        {
            _array_params1.push(transform.sx);
            _array_params1.push(transform.shy);
            _array_params1.push(transform.shx);
            _array_params1.push(transform.sy);
            _array_params1.push(transform.tx);
            _array_params1.push(transform.ty);

            this.TableOutlineDr.TableMatrix = transform.CreateDublicate();
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
        if (margins && margins.Frame !== undefined)
        {
            var bIsUpdate = false;

            if (!this.FrameRect.IsActive)
                bIsUpdate = true;

            if (!bIsUpdate)
            {
                if (this.FrameRect.Rect.X != margins.L ||
                    this.FrameRect.Rect.Y != margins.T ||
                    this.FrameRect.Rect.R != margins.R ||
                    this.FrameRect.Rect.B != margins.B ||
                    this.FrameRect.PageIndex != margins.PageIndex)
                {
                    bIsUpdate = true;
                }
            }

            this.FrameRect.IsActive = true;
            this.FrameRect.Rect.X = margins.L;
            this.FrameRect.Rect.Y = margins.T;
            this.FrameRect.Rect.R = margins.R;
            this.FrameRect.Rect.B = margins.B;
            this.FrameRect.PageIndex = margins.PageIndex;
            this.FrameRect.Frame = margins.Frame;

            if (bIsUpdate)
            {
                this.OnUpdateOverlay();
            }
        }
        else
        {
            if (this.FrameRect.IsActive)
            {
                this.FrameRect.IsActive = false;
                this.OnUpdateOverlay();
            }
            else
                this.FrameRect.IsActive = false;
        }

        this.Table = null;
        if (margins && margins.Frame)
        {
            this.Native["DD_Set_RulerState_Paragraph"](margins.L, margins.T, margins.R, margins.B, true, margins.PageIndex);
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

        var _table_outline = this.TableOutlineDr.TableOutline;
        if (_table_outline != null)
        {
            var _page = _table_outline.PageNum;
            if (_page >= drawingFirst && _page <= drawingEnd)
            {
                var _m = this.TableOutlineDr.TableMatrix;
                if (!_m)
                {
                    this.Native["DD_Overlay_DrawTableOutline"](_page, _table_outline.TrackTablePos,
                        _table_outline.X, _table_outline.Y, _table_outline.W, _table_outline.H);
                }
                else
                {
                    this.Native["DD_Overlay_DrawTableOutline"](_page, _table_outline.TrackTablePos,
                        _table_outline.X, _table_outline.Y, _table_outline.W, _table_outline.H,
                        _m.sx, _m.shy, _m.shx, _m.sy, _m.tx, _m.ty);

                }
            }
        }
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

        if (this.TableOutlineDr.bIsTracked)
        {
            this.DrawTableTrack();
        }

        this.DrawFrameTrack();

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

        this.TableOutlineDr.bIsNoTable = true;
        this.LogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);

        if (this.TableOutlineDr.bIsNoTable === false)
        {
            // TODO: нужно посмотреть, может в ЭТОМ же месте трек для таблицы уже нарисован
            this.OnUpdateOverlay();
        }

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
        var _ret = this.TableOutlineDr.checkMouseDown(pos, this);
        if (_ret === true)
        {
            this.LogicDocument.Selection_Remove();
            this.TableOutlineDr.bIsTracked = true;
            this.LockCursorType("move");

            this.TableOutlineDr.TableOutline.Table.Select_All();
            this.TableOutlineDr.TableOutline.Table.Document_SetThisElementCurrent(true);

            this.EndUpdateOverlay();
            return true;
        }

        if (this.FrameRect.IsActive)
        {
            var eps = 10 / this.Native["DD_GetDotsPerMM"]();
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

                this.EndUpdateOverlay();
                return true;
            }
        }

        return false;
    },

    checkMouseMove_Drawing : function(pos)
    {
        if (this.TableOutlineDr.bIsTracked)
        {
            this.TableOutlineDr.checkMouseMove(global_mouseEvent.X, global_mouseEvent.Y, this);
            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        if (this.InlineTextTrackEnabled)
        {
            this.InlineTextTrack        = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
            this.InlineTextTrackPage    = pos.Page;

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        if (this.FrameRect.IsActive)
        {
            if (!this.FrameRect.IsTracked && this.FrameRect.PageIndex == pos.Page)
            {
                var eps = 10 / this.Native["DD_GetDotsPerMM"]();
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
                    this.EndUpdateOverlay();
                    return true;
                }
            }
            else
            {
                this.checkTrackRect(pos);

                this.OnUpdateOverlay();
                this.EndUpdateOverlay();
                return true;
            }
        }

        return false;
    },

    checkMouseUp_Drawing : function(pos)
    {
        if (this.TableOutlineDr.bIsTracked)
        {
            this.TableOutlineDr.checkMouseUp(global_mouseEvent.X, global_mouseEvent.Y, this);
            this.LogicDocument.Document_UpdateInterfaceState();
            this.LogicDocument.Document_UpdateRulersState();

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        if (this.InlineTextTrackEnabled)
        {
            this.InlineTextTrack        = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
            this.InlineTextTrackPage    = pos.Page;
            this.EndTrackText();

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        if (this.FrameRect.IsActive && this.FrameRect.IsTracked)
        {
            this.FrameRect.IsTracked = false;

            this.checkTrackRect(pos);
            var _track = this.FrameRect.Track;
            this.FrameRect.Frame.Change_Frame(_track.L, _track.T, _track.R - _track.L, _track.B - _track.T, _track.PageIndex);

            this.OnUpdateOverlay();
            this.EndUpdateOverlay();
            return true;
        }

        return false;
    },

    checkCursorOnTrackRect : function(X, Y, eps, rect)
    {
        // 0-1-...-7 - точки по часовой стрелке, начиная с left-top,
        // 8-..-11 - стороны по часовой стрелке, начиная с top

        var __x_dist1 = Math.abs(X - rect.X);
        var __x_dist2 = Math.abs(X - ((rect.X + rect.R) / 2));
        var __x_dist3 = Math.abs(X - rect.R);

        var __y_dist1 = Math.abs(Y - rect.Y);
        var __y_dist2 = Math.abs(Y - ((rect.Y + rect.B) / 2));
        var __y_dist3 = Math.abs(Y - rect.B);

        if (__y_dist1 < eps)
        {
            if ((X < (rect.X - eps)) || (X > (rect.R + eps)))
                return -1;

            if (__x_dist1 <= __x_dist2 && __x_dist1 <= __x_dist3)
                return (__x_dist1 < eps) ? 0 : 8;

            if (__x_dist2 <= __x_dist1 && __x_dist2 <= __x_dist3)
                return (__x_dist2 < eps) ? 1 : 8;

            if (__x_dist3 <= __x_dist1 && __x_dist3 <= __x_dist2)
                return (__x_dist3 < eps) ? 2 : 8;

            return 8;
        }

        if (__y_dist3 < eps)
        {
            if ((X < (rect.X - eps)) || (X > (rect.R + eps)))
                return -1;

            if (__x_dist1 <= __x_dist2 && __x_dist1 <= __x_dist3)
                return (__x_dist1 < eps) ? 6 : 10;

            if (__x_dist2 <= __x_dist1 && __x_dist2 <= __x_dist3)
                return (__x_dist2 < eps) ? 5 : 10;

            if (__x_dist3 <= __x_dist1 && __x_dist3 <= __x_dist2)
                return (__x_dist3 < eps) ? 4 : 10;

            return 8;
        }

        if (__x_dist1 < eps)
        {
            if ((Y < (rect.Y - eps)) || (Y > (rect.B + eps)))
                return -1;

            if (__y_dist1 <= __y_dist2 && __y_dist1 <= __y_dist3)
                return (__y_dist1 < eps) ? 0 : 11;

            if (__y_dist2 <= __y_dist1 && __y_dist2 <= __y_dist3)
                return (__y_dist2 < eps) ? 7 : 11;

            if (__y_dist3 <= __y_dist1 && __y_dist3 <= __y_dist2)
                return (__y_dist3 < eps) ? 6 : 11;

            return 11;
        }

        if (__x_dist3 < eps)
        {
            if ((Y < (rect.Y - eps)) || (Y > (rect.B + eps)))
                return -1;

            if (__y_dist1 <= __y_dist2 && __y_dist1 <= __y_dist3)
                return (__y_dist1 < eps) ? 2 : 9;

            if (__y_dist2 <= __y_dist1 && __y_dist2 <= __y_dist3)
                return (__y_dist2 < eps) ? 3 : 9;

            if (__y_dist3 <= __y_dist1 && __y_dist3 <= __y_dist2)
                return (__y_dist3 < eps) ? 4 : 9;

            return 9;
        }

        return -1;
    },

    checkTrackRect : function(pos)
    {
        var _min_dist = 3; // mm;

        var _track = this.FrameRect.Track;
        var _rect = this.FrameRect.Rect;
        _track.PageIndex = this.FrameRect.PageIndex;
        switch (_track.Type)
        {
            case 0:
            {
                _track.L = _rect.X + (pos.X - _track.X);
                _track.T = _rect.Y + (pos.Y - _track.Y);
                _track.R = _rect.R;
                _track.B = _rect.B;

                if (_track.L > (_track.R - _min_dist))
                    _track.L = _track.R - _min_dist;
                if (_track.T > (_track.B - _min_dist))
                    _track.T = _track.B - _min_dist;

                break;
            }
            case 1:
            {
                _track.L = _rect.X;
                _track.T = _rect.Y + (pos.Y - _track.Y);
                _track.R = _rect.R;
                _track.B = _rect.B;

                if (_track.T > (_track.B - _min_dist))
                    _track.T = _track.B - _min_dist;

                break;
            }
            case 2:
            {
                _track.L = _rect.X;
                _track.T = _rect.Y + (pos.Y - _track.Y);
                _track.R = _rect.R + (pos.X - _track.X);
                _track.B = _rect.B;

                if (_track.R < (_track.L + _min_dist))
                    _track.R = _track.L + _min_dist;
                if (_track.T > (_track.B - _min_dist))
                    _track.T = _track.B - _min_dist;

                break;
            }
            case 3:
            {
                _track.L = _rect.X;
                _track.T = _rect.Y;
                _track.R = _rect.R + (pos.X - _track.X);
                _track.B = _rect.B;

                if (_track.R < (_track.L + _min_dist))
                    _track.R = _track.L + _min_dist;

                break;
            }
            case 4:
            {
                _track.L = _rect.X;
                _track.T = _rect.Y;
                _track.R = _rect.R + (pos.X - _track.X);
                _track.B = _rect.B + (pos.Y - _track.Y);

                if (_track.R < (_track.L + _min_dist))
                    _track.R = _track.L + _min_dist;
                if (_track.B < (_track.T + _min_dist))
                    _track.B = _track.T + _min_dist;

                break;
            }
            case 5:
            {
                _track.L = _rect.X;
                _track.T = _rect.Y;
                _track.R = _rect.R;
                _track.B = _rect.B + (pos.Y - _track.Y);

                if (_track.B < (_track.T + _min_dist))
                    _track.B = _track.T + _min_dist;

                break;
            }
            case 6:
            {
                _track.L = _rect.X + (pos.X - _track.X);
                _track.T = _rect.Y;
                _track.R = _rect.R;
                _track.B = _rect.B + (pos.Y - _track.Y);

                if (_track.L > (_track.R - _min_dist))
                    _track.L = _track.R - _min_dist;
                if (_track.B < (_track.T + _min_dist))
                    _track.B = _track.T + _min_dist;

                break;
            }
            case 7:
            {
                _track.L = _rect.X + (pos.X - _track.X);
                _track.T = _rect.Y;
                _track.R = _rect.R;
                _track.B = _rect.B;

                if (_track.L > (_track.R - _min_dist))
                    _track.L = _track.R - _min_dist;

                break;
            }
            default:
            {
                _track.L = pos.X - (_track.X - _rect.X);
                _track.T = pos.Y - (_track.Y - _rect.Y);
                _track.R = _track.L + _rect.R - _rect.X;
                _track.B = _track.T + _rect.B - _rect.Y;

                _track.PageIndex = pos.Page;
                break;
            }
        }
    },

    DrawFrameTrack : function()
    {
        if (!this.FrameRect.IsActive)
            return;

        this.Native["DD_Overlay_DrawFrameTrack1"](this.FrameRect.PageIndex,
            this.FrameRect.Rect.X, this.FrameRect.Rect.Y, this.FrameRect.Rect.R, this.FrameRect.Rect.B);

        // move
        if (this.FrameRect.IsTracked)
        {
            this.Native["DD_Overlay_DrawFrameTrack2"](this.FrameRect.Track.PageIndex,
                this.FrameRect.Track.L, this.FrameRect.Track.T, this.FrameRect.Track.R, this.FrameRect.Track.B);
        }
    },

    IsCursorInTableCur : function(x, y, page)
    {
        var _table = this.TableOutlineDr.TableOutline;
        if (_table == null)
            return false;

        if (page != _table.PageNum)
            return false;

        var _dist = this.TableOutlineDr.image.width / this.GetDotsPerMM();

        var _x = _table.X;
        var _y = _table.Y;
        var _r = _x + _table.W;
        var _b = _y + _table.H;

        if ((x > (_x - _dist)) && (x < _r) && (y > (_y - _dist)) && (y < _b))
        {
            if ((x < _x) || (y < _y))
            {
                this.TableOutlineDr.Counter = 0;
                this.TableOutlineDr.bIsNoTable = false;
                return true;
            }
        }
        return false;
    },

    DrawTableTrack : function()
    {
        if (null == this.TableOutlineDr.TableOutline)
            return;

        var _table = this.TableOutlineDr.TableOutline.Table;

        if (!_table.Is_Inline())
        {
            if (null == this.TableOutlineDr.CurPos)
                return;

            var _matrix = this.TableOutlineDr.TableMatrix;

            if (!_matrix)
            {
                this.Native["DD_Overlay_DrawTableTrack"](this.TableOutlineDr.CurPos.Page,
                    this.TableOutlineDr.CurPos.X, this.TableOutlineDr.CurPos.Y,
                    this.TableOutlineDr.TableOutline.W, this.TableOutlineDr.TableOutline.H);
            }
            else
            {
                this.Native["DD_Overlay_DrawTableTrack"](this.TableOutlineDr.CurPos.Page,
                    this.TableOutlineDr.CurPos.X, this.TableOutlineDr.CurPos.Y,
                    this.TableOutlineDr.TableOutline.W, this.TableOutlineDr.TableOutline.H,
                    _matrix.sx, _matrix.shy, _matrix.shx, _matrix.sy, _matrix.tx, _matrix.ty);
            }
        }
        else
        {
            this.LockCursorType("default");

            var _x = global_mouseEvent.X;
            var _y = global_mouseEvent.Y;
            var posMouse = this.Native["DD_ConvertCoordsFromCursor"](_x, _y);

            this.TableOutlineDr.InlinePos = this.LogicDocument.Get_NearestPos(posMouse.Page, posMouse.X, posMouse.Y);
            this.TableOutlineDr.InlinePos.Page = posMouse.Page;

            var _near = this.TableOutlineDr.InlinePos;

            this.AutoShapesTrack.DrawInlineMoveCursor(_near.Page, _near.X, _near.Y, _near.Height, _near.transform);
        }
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

