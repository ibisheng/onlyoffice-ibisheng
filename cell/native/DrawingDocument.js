"use strict";

var g_dKoef_pix_to_mm = AscCommon.g_dKoef_pix_to_mm;
var g_dKoef_mm_to_pix = AscCommon.g_dKoef_mm_to_pix;

function CTextMeasurer()
{
    this.m_oManager     = new window['AscFonts'].CFontManager();

    this.m_oFont        = null;

    // RFonts
    this.m_oTextPr      = null;
    this.m_oLastFont    = new CFontSetup();
    this.LastFontOriginInfo = { Name : "", Replace : null };

    this.Init = function()
    {
        this.m_oManager.Initialize();
    };

    this.SetFont = function(font)
    {
        if (!font)
            return;

        this.m_oFont = font;

        var bItalic = true === font.Italic;
        var bBold   = true === font.Bold;

        var oFontStyle = FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBoldItalic;

        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpName != font.FontFamily.Name || _lastSetUp.SetUpSize != font.FontSize || _lastSetUp.SetUpStyle != oFontStyle)
        {
            _lastSetUp.SetUpName = font.FontFamily.Name;
            _lastSetUp.SetUpSize = font.FontSize;
            _lastSetUp.SetUpStyle = oFontStyle;

            g_fontApplication.LoadFont(_lastSetUp.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };

    this.SetFontInternal = function(_name, _size, _style)
    {
        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpName != _name || _lastSetUp.SetUpSize != _size || _lastSetUp.SetUpStyle != _style)
        {
            _lastSetUp.SetUpName = _name;
            _lastSetUp.SetUpSize = _size;
            _lastSetUp.SetUpStyle = _style;

            g_fontApplication.LoadFont(_lastSetUp.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };

    this.SetTextPr = function(textPr, theme)
    {
        this.m_oTextPr = textPr.Copy();
        this.theme = theme;
        var FontScheme = theme.themeElements.fontScheme;
        this.m_oTextPr.RFonts.Ascii    = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.Ascii.Name), Index: -1};
        this.m_oTextPr.RFonts.EastAsia = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.EastAsia.Name), Index: -1};
        this.m_oTextPr.RFonts.HAnsi    = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.HAnsi.Name), Index: -1};
        this.m_oTextPr.RFonts.CS       = {Name: FontScheme.checkFont(this.m_oTextPr.RFonts.CS.Name), Index: -1};
    };

    this.SetFontSlot = function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.m_oLastFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Index  = _rfonts.Ascii.Index;

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Index  = _rfonts.CS.Index;

                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Index  = _rfonts.EastAsia.Index;

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_HAnsi:
            default:
            {
                _lastFont.Name   = _rfonts.HAnsi.Name;
                _lastFont.Index  = _rfonts.HAnsi.Index;

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
        }

        if (undefined !== fontSizeKoef)
            _lastFont.Size *= fontSizeKoef;

        var _style = 0;
        if (_lastFont.Italic)
            _style += 2;
        if (_lastFont.Bold)
            _style += 1;

        if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle)
        {
            _lastFont.SetUpName = _lastFont.Name;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;

            g_fontApplication.LoadFont(_lastFont.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastFont.SetUpSize, _lastFont.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };

    this.GetTextPr = function()
    {
        return this.m_oTextPr;
    };

    this.GetFont = function()
    {
        return this.m_oFont;
    };

    this.Measure = function(text)
    {
        var Width  = 0;
        var Height = 0;

        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        var Temp = this.m_oManager.MeasureChar( _code);
		
        Width  = Temp.fAdvanceX * 25.4 / 72;
        Height = 0;//Temp.fHeight;

        return { Width : Width, Height : Height };
    };
    this.Measure2 = function(text)
    {
        var Width  = 0;

        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        var Temp = this.m_oManager.MeasureChar( _code );

        Width  = Temp.fAdvanceX * 25.4 / 72;

        return { Width : Width, Ascent : (Temp.oBBox.fMaxY * 25.4 / 72), Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72)};
    };

    this.MeasureCode = function(lUnicode)
    {
        var Width  = 0;
        var Height = 0;

        if (null != this.LastFontOriginInfo.Replace)
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

        var Temp = this.m_oManager.MeasureChar( lUnicode );

        Width  = Temp.fAdvanceX * 25.4 / 72;
        Height = 0;//Temp.fHeight;

        return { Width : Width, Height : Height };
    };
    this.Measure2Code = function(lUnicode)
    {
        var Width  = 0;

        if (null != this.LastFontOriginInfo.Replace)
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

        var Temp = this.m_oManager.MeasureChar( lUnicode );

        Width  = Temp.fAdvanceX * 25.4 / 72;

        return { Width : Width, Ascent : (Temp.oBBox.fMaxY * 25.4 / 72), Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72)};
    };

    this.GetAscender = function()
    {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Ascender   = this.m_oManager.m_lAscender;

        return Ascender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetDescender = function()
    {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Descender  = this.m_oManager.m_lDescender;

        return Descender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetHeight = function()
    {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Height     = this.m_oManager.m_lLineHeight;

        return Height * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
}

function CTableOutlineDr()
{
    var image_64 = "u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u//6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6/4+Pj/+7u7v/9vb2//b29v/39/f/9/f3//f39/83aMT/9/f3//f39//39/f/9/f3//f39/+Pj4//u7u7//Ly8v/y8vL/8vLy//Pz8/83aMT/N2jE/zdoxP/z8/P/8/Pz//Pz8//z8/P/j4+P/7u7u//u7u7/7u7u/+7u7v/u7u7/7u7u/zdoxP/u7u7/7u7u/+7u7v/u7u7/7u7u/4+Pj/+7u7v/6Ojo/+jo6P83aMT/6enp/+np6f83aMT/6enp/+np6f83aMT/6enp/+np6f+Pj4//u7u7/+Pj4/83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP/k5OT/j4+P/7u7u//o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/4+Pj/+7u7v/7e3t/+3t7f/t7e3/7e3t/+3t7f83aMT/7e3t/+zs7P/s7Oz/7Ozs/+zs7P+Pj4//u7u7//Ly8v/y8vL/8vLy//Ly8v83aMT/N2jE/zdoxP/x8fH/8fHx//Hx8f/x8fH/j4+P/7u7u//19fX/9fX1//X19f/19fX/9fX1/zdoxP/19fX/9fX1//X19f/19fX/9fX1/4+Pj/+7u7v/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//j4+P+Pj4//u7u7/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/w==";

    this.image = document.createElement('canvas');
    this.image.width  = 13;
    this.image.height = 13;

    var ctx = this.image.getContext('2d');
    var _data = ctx.createImageData(13, 13);

    AscFonts.DecodeBase64(_data, image_64);
    ctx.putImageData(_data, 0, 0);

    _data = null;
    image_64 = null;

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

    this.checkMouseDown = function(pos, word_control)
    {
        if (null == this.TableOutline)
            return false;

        var _table_track = this.TableOutline;
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;

        this.IsChangeSmall = true;
        this.ChangeSmallPoint = pos;

        if (!this.TableMatrix || AscCommon.global_MatrixTransformer.IsIdentity(this.TableMatrix))
        {
            if (word_control.MobileTouchManager)
            {
                var _move_point = word_control.MobileTouchManager.TableMovePoint;

                if (_move_point == null || pos.Page != _table_track.PageNum)
                    return false;

                var _pos1 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(pos.X, pos.Y, pos.Page);
                var _pos2 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(_move_point.X, _move_point.Y, pos.Page);

                var _eps = word_control.MobileTouchManager.TrackTargetEps;

                var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset;
                var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize;
                if ((_pos1.X >= (_pos2.X - _offset2 - _eps)) && (_pos1.X <= (_pos2.X - _offset1 + _eps)) &&
                    (_pos1.Y >= (_pos2.Y - _offset2 - _eps)) && (_pos1.Y <= (_pos2.Y - _offset1 + _eps)))
                {
                    this.TrackTablePos = 0;
                    return true;
                }

                return false;
            }

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
            if (word_control.MobileTouchManager)
            {
                var _invert = AscCommon.global_MatrixTransformer.Invert(this.TableMatrix);
                var _posx = _invert.TransformPointX(pos.X, pos.Y);
                var _posy = _invert.TransformPointY(pos.X, pos.Y);

                var _move_point = word_control.MobileTouchManager.TableMovePoint;

                if (_move_point == null || pos.Page != _table_track.PageNum)
                    return false;

                var _koef = g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
                var _eps = word_control.MobileTouchManager.TrackTargetEps * _koef;

                var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset * _koef;
                var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize * _koef;
                if ((_posx >= (_move_point.X - _offset2 - _eps)) && (_posx <= (_move_point.X - _offset1 + _eps)) &&
                    (_posy >= (_move_point.Y - _offset2 - _eps)) && (_posy <= (_move_point.Y - _offset1 + _eps)))
                {
                    this.TrackTablePos = 0;
                    return true;
                }

                return false;
            }

            var _invert = AscCommon.global_MatrixTransformer.Invert(this.TableMatrix);
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

    this.checkMouseUp = function(X, Y, word_control)
    {
        this.bIsTracked = false;

        if (null == this.TableOutline || (true === this.IsChangeSmall) || word_control.m_oApi.isViewMode)
            return false;

        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;

        var _outline = this.TableOutline;
        var _table = _outline.Table;

        _table.Cursor_MoveToStartPos();
        _table.Document_SetThisElementCurrent();

        if (!_table.Is_Inline())
        {
            var pos;
            switch (this.TrackTablePos)
            {
                case 1:
                {
                    var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                    pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
                    break;
                }
                case 2:
                {
                    var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                    var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                    pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
                    break;
                }
                case 3:
                {
                    var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                    pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
                    break;
                }
                case 0:
                default:
                {
                    pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
                    break;
                }
            }

            var NearestPos = word_control.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY);
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

    this.checkMouseMove = function(X, Y, word_control)
    {
        if (null == this.TableOutline)
            return false;

        if (true === this.IsChangeSmall)
        {
            var _pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
            var _dist = 15 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
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

        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        switch (this.TrackTablePos)
        {
            case 1:
            {
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
                break;
            }
            case 2:
            {
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
                break;
            }
            case 3:
            {
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
                break;
            }
            case 0:
            default:
            {
                this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
                break;
            }
        }

        this.CurPos.X -= this.TrackOffsetX;
        this.CurPos.Y -= this.TrackOffsetY;
    }

    this.CheckStartTrack = function(word_control, transform)
    {
        this.TableMatrix = null;
        if (transform)
            this.TableMatrix = transform.CreateDublicate();

        if (!this.TableMatrix || AscCommon.global_MatrixTransformer.IsIdentity(this.TableMatrix))
        {
            var pos = word_control.m_oDrawingDocument.ConvertCoordsToCursor(this.TableOutline.X, this.TableOutline.Y, this.TableOutline.PageNum, true);

            var _x0 = word_control.m_oEditor.AbsolutePosition.L;
            var _y0 = word_control.m_oEditor.AbsolutePosition.T;

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

            var _x0 = word_control.m_oEditor.AbsolutePosition.L * g_dKoef_mm_to_pix;
            var _y0 = word_control.m_oEditor.AbsolutePosition.T * g_dKoef_mm_to_pix;
            var _x1 = word_control.m_oEditor.AbsolutePosition.R * g_dKoef_mm_to_pix;
            var _y1 = word_control.m_oEditor.AbsolutePosition.B * g_dKoef_mm_to_pix;

            var pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x0, y0, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 0;
                return;
            }

            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x1, y1, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 1;
                return;
            }

            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x3, y3, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 3;
                return;
            }

            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x2, y2, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1)
            {
                this.TrackTablePos = 2;
                return;
            }

            this.TrackTablePos = 0;
        }
    }
}

function CCacheImage()
{
    this.image              = null;
    this.image_locked       = 0;
    this.image_unusedCount  = 0;
}

function CCacheManager()
{
    this.arrayImages = [];
    this.arrayCount = 0;
    this.countValidImage = 1;

    this.CheckImagesForNeed = function()
    {
        for (var i = 0; i < this.arrayCount; ++i)
        {
            if ((this.arrayImages[i].image_locked == 0) && (this.arrayImages[i].image_unusedCount >= this.countValidImage))
            {
                delete this.arrayImages[i].image;
                this.arrayImages.splice(i, 1);
                --i;
                --this.arrayCount;
            }
        }
    }

    this.UnLock = function(_cache_image)
    {
        if (null == _cache_image)
            return;

        _cache_image.image_locked = 0;
        _cache_image.image_unusedCount = 0;
        // ����� ����� �������� ������ � ���� (_cache_image = null) <- ��� ����������� !!!!!!!
    }

    this.Lock = function(_w, _h)
    {
        for (var i = 0; i < this.arrayCount; ++i)
        {
            if (this.arrayImages[i].image_locked)
                continue;
            var _wI = this.arrayImages[i].image.width;
            var _hI = this.arrayImages[i].image.height;
            if ((_wI == _w) && (_hI == _h))
            {
                this.arrayImages[i].image_locked = 1;
                this.arrayImages[i].image_unusedCount = 0;

                this.arrayImages[i].image.ctx.globalAlpha = 1.0;
                this.arrayImages[i].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.arrayImages[i].image.ctx.fillStyle = "#ffffff";
                this.arrayImages[i].image.ctx.fillRect(0, 0, _w, _h);
                return this.arrayImages[i];
            }
            this.arrayImages[i].image_unusedCount++;
        }
        this.CheckImagesForNeed();
        var index = this.arrayCount;
        this.arrayCount++;

        this.arrayImages[index] = new CCacheImage();
        this.arrayImages[index].image = document.createElement('canvas');
        this.arrayImages[index].image.width = _w;
        this.arrayImages[index].image.height = _h;
        this.arrayImages[index].image.ctx = this.arrayImages[index].image.getContext('2d');
        this.arrayImages[index].image.ctx.globalAlpha = 1.0;
        this.arrayImages[index].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.arrayImages[index].image.ctx.fillStyle = "#ffffff";
        this.arrayImages[index].image.ctx.fillRect(0, 0, _w, _h);
        this.arrayImages[index].image_locked = 1;
        this.arrayImages[index].image_unusedCount = 0;
        return this.arrayImages[index];
    }
}

function CDrawingPage()
{
    this.left   = 0;
    this.top    = 0;
    this.right  = 0;
    this.bottom = 0;

    this.cachedImage = null;
}

function CPage()
{
    this.width_mm       = 210;
    this.height_mm      = 297;

    this.margin_left    = 0;
    this.margin_top     = 0;
    this.margin_right   = 0;
    this.margin_bottom  = 0;

    this.pageIndex      = -1;

    this.searchingArray = [];
    this.selectionArray = [];
    this.drawingPage = new CDrawingPage();

    this.Draw = function(context, xDst, yDst, wDst, hDst, contextW, contextH)
    {
        if (null != this.drawingPage.cachedImage)
        {
            context.strokeStyle = "#81878F";
            context.strokeRect(xDst, yDst, wDst, hDst);
            // ����� ���������� �� �������� ���������
            context.drawImage(this.drawingPage.cachedImage.image, xDst, yDst, wDst, hDst);
        }
        else
        {
            context.fillStyle = "#ffffff";
            context.strokeStyle = "#81878F";
            context.strokeRect(xDst, yDst, wDst, hDst);
            context.fillRect(xDst, yDst, wDst, hDst);
        }
    }

    this.DrawSelection = function(overlay, xDst, yDst, wDst, hDst, TextMatrix)
    {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;

        var selectionArray = this.selectionArray;

        if (null == TextMatrix || AscCommon.global_MatrixTransformer.IsIdentity(TextMatrix))
        {
            for (var i = 0; i < selectionArray.length; i++)
            {
                var r = selectionArray[i];

                var _x = ((xDst + dKoefX * r.x) >> 0) - 0.5;
                var _y = ((yDst + dKoefY * r.y) >> 0) - 0.5;

                var _w = (dKoefX * r.w + 1) >> 0;
                var _h = (dKoefY * r.h + 1) >> 0;

                if (_x < overlay.min_x)
                    overlay.min_x = _x;
                if ((_x + _w) > overlay.max_x)
                    overlay.max_x = _x + _w;

                if (_y < overlay.min_y)
                    overlay.min_y = _y;
                if ((_y + _h) > overlay.max_y)
                    overlay.max_y = _y + _h;

                overlay.m_oContext.rect(_x,_y,_w,_h);
            }
        }
        else
        {
            for (var i = 0; i < selectionArray.length; i++)
            {
                var r = selectionArray[i];

                var _x1 = TextMatrix.TransformPointX(r.x, r.y);
                var _y1 = TextMatrix.TransformPointY(r.x, r.y);

                var _x2 = TextMatrix.TransformPointX(r.x + r.w, r.y);
                var _y2 = TextMatrix.TransformPointY(r.x + r.w, r.y);

                var _x3 = TextMatrix.TransformPointX(r.x + r.w, r.y + r.h);
                var _y3 = TextMatrix.TransformPointY(r.x + r.w, r.y + r.h);

                var _x4 = TextMatrix.TransformPointX(r.x, r.y + r.h);
                var _y4 = TextMatrix.TransformPointY(r.x, r.y + r.h);

                var x1 = xDst + dKoefX * _x1;
                var y1 = yDst + dKoefY * _y1;

                var x2 = xDst + dKoefX * _x2;
                var y2 = yDst + dKoefY * _y2;

                var x3 = xDst + dKoefX * _x3;
                var y3 = yDst + dKoefY * _y3;

                var x4 = xDst + dKoefX * _x4;
                var y4 = yDst + dKoefY * _y4;

                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);

                var ctx = overlay.m_oContext;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
            }
        }
    }
    this.DrawSearch = function(overlay, xDst, yDst, wDst, hDst, drDoc)
    {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;

        // проверяем колонтитулы ------------
        var ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All);
        if (!ret && this.pageIndex != 0)
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All_no_First);
        if (!ret && this.pageIndex == 0)
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_First);
        if (!ret && (this.pageIndex & 1) == 1)
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Even);
        if (!ret && (this.pageIndex & 1) == 0)
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd);
        if (!ret && (this.pageIndex != 0))
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd_no_First);
        // ----------------------------------

        var ctx = overlay.m_oContext;
        for (var i = 0; i < this.searchingArray.length; i++)
        {
            var place = this.searchingArray[i];

            if (!place.Transform)
            {
                if (undefined === place.Ex)
                {
                    var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                    var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;

                    var _w = parseInt(dKoefX * place.W) + 1;
                    var _h = parseInt(dKoefY * place.H) + 1;

                    if (_x < overlay.min_x)
                        overlay.min_x = _x;
                    if ((_x + _w) > overlay.max_x)
                        overlay.max_x = _x + _w;

                    if (_y < overlay.min_y)
                        overlay.min_y = _y;
                    if ((_y + _h) > overlay.max_y)
                        overlay.max_y = _y + _h;

                    ctx.rect(_x,_y,_w,_h);
                }
                else
                {
                    var _x1 = parseInt(xDst + dKoefX * place.X);
                    var _y1 = parseInt(yDst + dKoefY * place.Y);

                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var _x2 = parseInt(xDst + dKoefX * x2);
                    var _y2 = parseInt(yDst + dKoefY * y2);

                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var _x3 = parseInt(xDst + dKoefX * x3);
                    var _y3 = parseInt(yDst + dKoefY * y3);

                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x4 = parseInt(xDst + dKoefX * x4);
                    var _y4 = parseInt(yDst + dKoefY * y4);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
            else
            {
                var _tr = place.Transform;
                if (undefined === place.Ex)
                {
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                    var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);

                    var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);

                    var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
                else
                {
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;

                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;

                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;

                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                    var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);

                    var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);

                    var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
        }
    }

    this.drawInHdrFtr = function(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, arr)
    {
        var _c = arr.length;
        if (0 == _c)
            return false;

        var ctx = overlay.m_oContext;
        for (var i = 0; i < _c; i++)
        {
            var place = arr[i];

            if (!place.Transform)
            {
                if (undefined === place.Ex)
                {
                    var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                    var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;

                    var _w = parseInt(dKoefX * place.W) + 1;
                    var _h = parseInt(dKoefY * place.H) + 1;

                    if (_x < overlay.min_x)
                        overlay.min_x = _x;
                    if ((_x + _w) > overlay.max_x)
                        overlay.max_x = _x + _w;

                    if (_y < overlay.min_y)
                        overlay.min_y = _y;
                    if ((_y + _h) > overlay.max_y)
                        overlay.max_y = _y + _h;

                    ctx.rect(_x,_y,_w,_h);
                }
                else
                {
                    var _x1 = parseInt(xDst + dKoefX * place.X);
                    var _y1 = parseInt(yDst + dKoefY * place.Y);

                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var _x2 = parseInt(xDst + dKoefX * x2);
                    var _y2 = parseInt(yDst + dKoefY * y2);

                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var _x3 = parseInt(xDst + dKoefX * x3);
                    var _y3 = parseInt(yDst + dKoefY * y3);

                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x4 = parseInt(xDst + dKoefX * x4);
                    var _y4 = parseInt(yDst + dKoefY * y4);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
            else
            {
                var _tr = place.Transform;
                if (undefined === place.Ex)
                {
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                    var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);

                    var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);

                    var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
                else
                {
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;

                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;

                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;

                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                    var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);

                    var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);

                    var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);

                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);

                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
        }
        return true;
    }

    this.DrawSearchCur1 = function(overlay, xDst, yDst, wDst, hDst, place)
    {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;

        var ctx = overlay.m_oContext;

        if (!place.Transform)
        {
            if (undefined === place.Ex)
            {
                var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;

                var _w = parseInt(dKoefX * place.W) + 1;
                var _h = parseInt(dKoefY * place.H) + 1;

                if (_x < overlay.min_x)
                    overlay.min_x = _x;
                if ((_x + _w) > overlay.max_x)
                    overlay.max_x = _x + _w;

                if (_y < overlay.min_y)
                    overlay.min_y = _y;
                if ((_y + _h) > overlay.max_y)
                    overlay.max_y = _y + _h;

                ctx.rect(_x,_y,_w,_h);
            }
            else
            {
                var _x1 = parseInt(xDst + dKoefX * place.X);
                var _y1 = parseInt(yDst + dKoefY * place.Y);

                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var _x2 = parseInt(xDst + dKoefX * x2);
                var _y2 = parseInt(yDst + dKoefY * y2);

                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var _x3 = parseInt(xDst + dKoefX * x3);
                var _y3 = parseInt(yDst + dKoefY * y3);

                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x4 = parseInt(xDst + dKoefX * x4);
                var _y4 = parseInt(yDst + dKoefY * y4);

                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);

                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }
        else
        {
            var _tr = place.Transform;
            if (undefined === place.Ex)
            {
                var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);

                var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);

                var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);

                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);

                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
            else
            {
                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;

                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;

                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;

                var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);

                var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);

                var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);

                var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);

                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);

                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }
    }

    this.DrawSearchCur = function(overlay, xDst, yDst, wDst, hDst, navi)
    {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;

        var places = navi.Place;
        var len = places.length;

        var ctx = overlay.m_oContext;

        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "rgba(51,102,204,255)";

        for (var i = 0; i < len; i++)
        {
            var place = places[i];
            if (undefined === place.Ex)
            {
                var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;

                var _w = parseInt(dKoefX * place.W) + 1;
                var _h = parseInt(dKoefY * place.H) + 1;

                if (_x < overlay.min_x)
                    overlay.min_x = _x;
                if ((_x + _w) > overlay.max_x)
                    overlay.max_x = _x + _w;

                if (_y < overlay.min_y)
                    overlay.min_y = _y;
                if ((_y + _h) > overlay.max_y)
                    overlay.max_y = _y + _h;

                ctx.rect(_x,_y,_w,_h);
            }
            else
            {
                var _x1 = parseInt(xDst + dKoefX * place.X);
                var _y1 = parseInt(yDst + dKoefY * place.Y);

                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var _x2 = parseInt(xDst + dKoefX * x2);
                var _y2 = parseInt(yDst + dKoefY * y2);

                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var _x3 = parseInt(xDst + dKoefX * x3);
                var _y3 = parseInt(yDst + dKoefY * y3);

                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x4 = parseInt(xDst + dKoefX * x4);
                var _y4 = parseInt(yDst + dKoefY * y4);

                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);

                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }

        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    this.DrawTableOutline = function(overlay, xDst, yDst, wDst, hDst, table_outline_dr)
    {
        var transform = table_outline_dr.TableMatrix;
        if (null == transform || transform.IsIdentity2())
        {
            var dKoefX = wDst / this.width_mm;
            var dKoefY = hDst / this.height_mm;

            var _offX = (null == transform) ? 0 : transform.tx;
            var _offY = (null == transform) ? 0 : transform.ty;

            var _x = 0;
            var _y = 0;
            switch (table_outline_dr.TrackTablePos)
            {
                case 1:
                {
                    _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX));
                    _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) - 13;
                    break;
                }
                case 2:
                {
                    _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX));
                    _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY));
                    break;
                }
                case 3:
                {
                    _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) - 13;
                    _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY));
                    break;
                }
                case 0:
                default:
                {
                    _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) - 13;
                    _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) - 13;
                    break;
                }
            }

            var _w = 13;
            var _h = 13;

            if (_x < overlay.min_x)
                overlay.min_x = _x;
            if ((_x + _w) > overlay.max_x)
                overlay.max_x = _x + _w;

            if (_y < overlay.min_y)
                overlay.min_y = _y;
            if ((_y + _h) > overlay.max_y)
                overlay.max_y = _y + _h;

            overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y);
        }
        else
        {
            var ctx = overlay.m_oContext;


            var _ft = new AscCommon.CMatrix();
            _ft.sx = transform.sx;
            _ft.shx = transform.shx;
            _ft.shy = transform.shy;
            _ft.sy = transform.sy;
            _ft.tx = transform.tx;
            _ft.ty = transform.ty;

            var coords = new AscCommon.CMatrix();
            coords.sx = wDst / this.width_mm;
            coords.sy = hDst / this.height_mm;
            coords.tx = xDst;
            coords.ty = yDst;

            AscCommon.global_MatrixTransformer.MultiplyAppend(_ft, coords);

            ctx.transform(_ft.sx,_ft.shy,_ft.shx,_ft.sy,_ft.tx,_ft.ty);

            var _x = 0;
            var _y = 0;
            var _w = 13 / coords.sx;
            var _h = 13 / coords.sy;
            switch (table_outline_dr.TrackTablePos)
            {
                case 1:
                {
                    _x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
                    _y = (table_outline_dr.TableOutline.Y - _h);
                    break;
                }
                case 2:
                {
                    _x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
                    _y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
                    break;
                }
                case 3:
                {
                    _x = (table_outline_dr.TableOutline.X - _w);
                    _y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
                    break;
                }
                case 0:
                default:
                {
                    _x = (table_outline_dr.TableOutline.X - _w);
                    _y = (table_outline_dr.TableOutline.Y - _h);
                    break;
                }
            }

            overlay.CheckPoint(_ft.TransformPointX(_x, _y), _ft.TransformPointY(_x, _y));
            overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y), _ft.TransformPointY(_x + _w, _y));
            overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y + _h), _ft.TransformPointY(_x + _w, _y + _h));
            overlay.CheckPoint(_ft.TransformPointX(_x, _y + _h), _ft.TransformPointY(_x, _y + _h));

            overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y, _w, _h);
            ctx.setTransform(1,0,0,1,0,0);
        }
    }
}

function CDrawingDocument(drawingObjects)
{
    this.Native = window["native"];
    this.Api    = window.editor;
    this.m_oApi = this.Api;
    this.CanvasHitContext = CreateHitControl();

    this.drawingObjects = drawingObjects;
    this.IsLockObjectsEnable = false;

    this.m_oWordControl     = null;
    this.m_oLogicDocument   = null;
 	this.m_oDocumentRenderer = null;

    this.m_arrPages         = [];
    this.m_lPagesCount      = 0;

    this.m_lDrawingFirst    = -1;
    this.m_lDrawingEnd      = -1;
    this.m_lCurrentPage     = -1;

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

//    this.CanvasHit = document.createElement('canvas');
//    this.CanvasHit.width = 10;
//    this.CanvasHit.height = 10;
//    this.CanvasHitContext = this.CanvasHit.getContext('2d');

    this.TargetCursorColor = {R: 0, G: 0, B: 0};

    this.GuiControlColorsMap = null;
    this.IsSendStandartColors = false;

    this.GuiCanvasFillTextureParentId = "";
    this.GuiCanvasFillTexture = null;
    this.GuiCanvasFillTextureCtx = null;
    this.LastDrawingUrl = "";

    this.GuiCanvasFillTextureParentIdTextArt = "";
    this.GuiCanvasFillTextureTextArt = null;
    this.GuiCanvasFillTextureCtxTextArt = null;
    this.LastDrawingUrlTextArt = "";



    this.GuiCanvasTextProps = null;
    this.GuiCanvasTextPropsId = "gui_textprops_canvas_id";
    this.GuiLastTextProps = null;

    this.TableStylesLastLook = null;
    this.LastParagraphMargins = null;

    // параметры для SelectShow
    this.min_PageAddSelection = 100000;
    this.max_PageAddSelection = -1;
    this.IsShowSelectAttack = false;

    this.AutoShapesTrack = null;
    this.AutoShapesTrackLockPageNum = -1;

    this.Overlay = null;
    this.IsTextMatrixUse = false;

    // массивы ректов для поиска
    this._search_HdrFtr_All          = []; // Поиск в колонтитуле, который находится на всех страницах
    this._search_HdrFtr_All_no_First = []; // Поиск в колонтитуле, который находится на всех страницах, кроме первой
    this._search_HdrFtr_First        = []; // Поиск в колонтитуле, который находится только на первой странице
    this._search_HdrFtr_Even         = []; // Поиск в колонтитуле, который находится только на нечетных страницах
    this._search_HdrFtr_Odd          = []; // Поиск в колонтитуле, который находится только на четных страницах, включая первую
    this._search_HdrFtr_Odd_no_First = []; // Поиск в колонтитуле, который находится только на нечетных страницах, кроме первой

    this.Start_CollaborationEditing = function()
    {
        this.IsLockObjectsEnable = true;
        this.Native["DD_Start_CollaborationEditing"]();
    }
    this.SetCursorType = function(sType, Data)
    {
        if ("" == this.m_sLockedCursorType)
            this.Native["DD_SetCursorType"](sType, Data);
        else
            this.Native["DD_SetCursorType"](this.m_sLockedCursorType, Data);
    }
    this.LockCursorType = function(sType)
    {
        this.m_sLockedCursorType = sType;
        this.Native["DD_LockCursorType"](sType);
    }
    this.LockCursorTypeCur = function()
    {
        this.m_sLockedCursorType = this.Native["DD_get_LockCursorType"]();
    }
    this.UnlockCursorType = function()
    {
        this.m_sLockedCursorType = "";
        this.Native["DD_UnlockCursorType"]();
    }

    this.OnStartRecalculate = function(pageCount)
    {
        this.Native["DD_OnStartRecalculate"](pageCount);
    }

    this.OnRepaintPage = function(index)
    {
        this.Native["DD_OnRepaintPage"](index);
    }

    this.OnRecalculatePage = function(index, pageObject)
    {
        this.TableOutlineDr.TableOutline = null;

        this.Native["DD_OnRecalculatePage"](index, pageObject.Width, pageObject.Height,
            pageObject.Margins.Left, pageObject.Margins.Top, pageObject.Margins.Right, pageObject.Margins.Bottom);
    }

    this.OnEndRecalculate = function(isFull, isBreak)
    {
        this.Native["DD_OnEndRecalculate"](isFull, isBreak);
    }

	this.ChangePageAttack = function(pageIndex)
	{
//		if (pageIndex < this.m_lDrawingFirst || pageIndex > this.m_lDrawingEnd)
//			return;
//
//		this.StopRenderingPage(pageIndex);
//		this.m_oWordControl.OnScroll();
	}

    this.StartRenderingPage = function(pageIndex)
    {
//        if (true === this.IsFreezePage(pageIndex))
//        {
//            return;
//        }
//
//        var page = this.m_arrPages[pageIndex];
//
//        var w = parseInt(this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix * page.width_mm / 100);
//        var h = parseInt(this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix * page.height_mm / 100);
//
//        if (this.m_oWordControl.bIsRetinaSupport)
//        {
//            w *= 2;
//            h *= 2;
//        }
//
//        // заглушка под мобильную версию (iPad не рисует большие картинки (наверное страховка по памяти))
//        if (g_bIsMobile)
//        {
//            var _mobile_max = 2000;
//            if (w > _mobile_max || h > _mobile_max)
//            {
//                if (w > h)
//                {
//                    h = parseInt(h * _mobile_max / w);
//                    w = _mobile_max;
//                }
//                else
//                {
//                    w = parseInt(w * _mobile_max / h);
//                    h = _mobile_max;
//                }
//            }
//        }
//
//        page.drawingPage.cachedImage = this.m_oCacheManager.Lock(w, h);
//
//        //var StartTime = new Date().getTime();
//
//        // ������ ����� �������
//        var g = new CGraphics();
//        g.init(page.drawingPage.cachedImage.image.ctx, w, h, page.width_mm, page.height_mm);
//        g.m_oFontManager = g_fontManager;
//
//        g.transform(1,0,0,1,0,0);
//
//		if (null == this.m_oDocumentRenderer)
//	        this.m_oLogicDocument.DrawPage(pageIndex, g);
//		else
//			this.m_oDocumentRenderer.drawPage(pageIndex, g);
//
//        //var EndTime = new Date().getTime();
//
//        //alert("" + ((EndTime - StartTime) / 1000));
    }

    this.IsFreezePage = function(pageIndex)
    {
        return this.Native["DD_IsFreezePage"](pageIndex);
    }

    this.RenderDocument = function(Renderer)
    {
        for (var i = 0; i < this.m_lPagesCount; i++)
        {
            var page = this.m_arrPages[i];
            Renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();
        }
    }

    this.ToRenderer = function()
    {
        var Renderer = new AscCommon.CDocumentRenderer();
        Renderer.VectorMemoryForPrint = new AscCommon.CMemory();
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        this.RenderDocument(Renderer);
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        var ret = Renderer.Memory.GetBase64Memory();
        //console.log(ret);
        return ret;
    }

    this.ToRenderer2 = function()
    {
        var Renderer = new AscCommon.CDocumentRenderer();

        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;

        var ret = "";
        for (var i = 0; i < this.m_lPagesCount; i++)
        {
            var page = this.m_arrPages[i];
            Renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();

            ret += Renderer.Memory.GetBase64Memory();
            Renderer.Memory.Seek(0);
        }

        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        //console.log(ret);
        return ret;
    }

    this.isComleteRenderer = function()
    {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);
        if (this.m_lCurrentRendererPage >= pagescount)
        {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
            return true;
        }
        return false;
    }
    this.isComleteRenderer2 = function()
    {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);
        var start = Math.max(this.m_lCurrentRendererPage, 0);
        var end = Math.min(start + 50, pagescount - 1);

        if ((end + 1) >= pagescount)
            return true;

        return false;
    }
    this.ToRendererPart = function()
    {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);

        if (-1 == this.m_lCurrentRendererPage)
        {
            this.m_oDocRenderer = new AscCommon.CDocumentRenderer();
            this.m_oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
            this.m_lCurrentRendererPage = 0;
            this.m_bOldShowMarks = this.m_oWordControl.m_oApi.ShowParaMarks;
            this.m_oWordControl.m_oApi.ShowParaMarks = false;
        }

        var start = this.m_lCurrentRendererPage;
        var end = Math.min(this.m_lCurrentRendererPage + 50, pagescount - 1);

        var renderer = this.m_oDocRenderer;
        renderer.Memory.Seek(0);
        renderer.VectorMemoryForPrint.ClearNoAttack();

        for (var i = start; i <= end; i++)
        {
            var page = this.m_arrPages[i];
            renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, renderer);
            renderer.EndPage();

            editor.async_SaveToPdf_Progress(parseInt((i + 1) * 100 / pagescount));
        }

        this.m_lCurrentRendererPage = end + 1;

        if (this.m_lCurrentRendererPage >= pagescount)
        {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
        }

        return renderer.Memory.GetBase64Memory();
    }

    this.StopRenderingPage = function(pageIndex)
    {
		if (null != this.m_oDocumentRenderer)
			this.m_oDocumentRenderer.stopRenderingPage(pageIndex);
        if (null != this.m_arrPages[pageIndex].drawingPage.cachedImage)
        {
            this.m_oCacheManager.UnLock(this.m_arrPages[pageIndex].drawingPage.cachedImage);
            this.m_arrPages[pageIndex].drawingPage.cachedImage = null;
        }
    }

    this.ClearCachePages = function()
    {
        this.Native["DD_ClearCachePages"]();
    }

    this.CheckRasterImageOnScreen = function(src)
    {
        if (null == this.m_oWordControl.m_oLogicDocument)
            return;

        if (this.m_lDrawingFirst == -1 || this.m_lDrawingEnd == -1)
            return;

        var bIsRaster = false;
        var _checker = this.m_oWordControl.m_oLogicDocument.DrawingObjects;
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
        {
            var _imgs = _checker.getAllRasterImagesOnPage(i);

            var _len = _imgs.length;
            for (var j = 0; j < _len; j++)
            {
                if (AscCommon.getFullImageSrc2(_imgs[j]) == src)
                {
                    this.StopRenderingPage(i);
                    bIsRaster = true;
                    break;
                }
            }
        }

        if (bIsRaster)
            this.m_oWordControl.OnScroll();
    }

    this.FirePaint = function()
    {
        this.Native["DD_FirePaint"]();
    }

    this.ConvertCoordsFromCursor = function(x, y, bIsRul)
    {
        var _x = x;
        var _y = y;

        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);

        if (undefined == bIsRul)
        {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;

            /*
            if (true == this.m_oWordControl.m_bIsRuler)
            {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }
            */

            _x = x - _xOffset;
            _y = y - _yOffset;
        }

        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
        {
            var rect = this.m_arrPages[i].drawingPage;

            if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom))
            {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;

                return { X : x_mm, Y : y_mm, Page: rect.pageIndex, DrawPage: i };
            }
        }

        return { X : 0, Y : 0, Page: -1, DrawPage: -1 };
    }

    this.ConvertCoordsFromCursorPage = function(x, y, page, bIsRul)
    {
        var _x = x;
        var _y = y;

        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);

        if (undefined == bIsRul)
        {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;

            /*
            if (true == this.m_oWordControl.m_bIsRuler)
            {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }
            */

            _x = x - _xOffset;
            _y = y - _yOffset;
        }

        if (page < 0 || page >= this.m_lPagesCount)
            return { X : 0, Y : 0, Page: -1, DrawPage: -1 };

        var rect = this.m_arrPages[page].drawingPage;
        var x_mm = (_x - rect.left) * dKoef;
        var y_mm = (_y - rect.top) * dKoef;

        return { X : x_mm, Y : y_mm, Page: rect.pageIndex, DrawPage: i };
    }

    this.ConvertCoordsToAnotherPage = function(x, y, pageCoord, pageNeed)
    {
        if (pageCoord < 0 || pageCoord >= this.m_lPagesCount || pageNeed < 0 || pageNeed >= this.m_lPagesCount)
            return { X : 0, Y : 0, Error: true };

        var dKoef1 = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
        var dKoef2 = 100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue;

        var page1 = this.m_arrPages[pageCoord].drawingPage;
        var page2 = this.m_arrPages[pageNeed].drawingPage;

        var xCursor = page1.left + x * dKoef1;
        var yCursor = page1.top + y * dKoef1;

        var _x = (xCursor - page2.left) * dKoef2;
        var _y = (yCursor - page2.top) * dKoef2;

        return { X : _x, Y : _y, Error: false };
    }

    this.ConvertCoordsFromCursor2 = function(x, y, bIsRul, bIsNoNormalize, _zoomVal)
    {
        var _x = x;
        var _y = y;

        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        if (undefined !== _zoomVal)
            dKoef = (100 * g_dKoef_pix_to_mm / _zoomVal);

        if (undefined == bIsRul)
        {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;

            if (true == this.m_oWordControl.m_bIsRuler)
            {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }

            _x = x - _xOffset;
            _y = y - _yOffset;
        }

        if (-1 == this.m_lDrawingFirst || -1 == this.m_lDrawingEnd)
            return { X : 0, Y : 0, Page: -1, DrawPage: -1 };

        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
        {
            var rect = this.m_arrPages[i].drawingPage;

            if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom))
            {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;

                if (x_mm > (this.m_arrPages[i].width_mm + 10))
                    x_mm = this.m_arrPages[i].width_mm + 10;
                if (x_mm < -10)
                    x_mm = -10;

                return { X : x_mm, Y : y_mm, Page: rect.pageIndex, DrawPage: i };
            }
        }

        // в страницу не попали. вторая попытка - это попробовать найти страницу по вертикали
        var _start = Math.max(this.m_lDrawingFirst - 1, 0);
        var _end = Math.min(this.m_lDrawingEnd + 1, this.m_lPagesCount - 1);
        for (var i = _start; i <= _end; i++)
        {
            var rect = this.m_arrPages[i].drawingPage;

            var bIsCurrent = false;
            if (i == this.m_lDrawingFirst && rect.top > _y)
            {
                bIsCurrent = true;
            }
            else if ((rect.top <= _y) && (_y <= rect.bottom))
            {
                bIsCurrent = true;
            }
            else if (i != this.m_lPagesCount - 1)
            {
                if (_y > rect.bottom && _y < this.m_arrPages[i+1].drawingPage.top)
                    bIsCurrent = true;
            }
            else if (_y < rect.top)
            {
                // либо вышли раньше, либо это самая первая видимая страница
                bIsCurrent = true;
            }
            else if (i == this.m_lDrawingEnd)
            {
                if (_y > rect.bottom)
                    bIsCurrent = true;
            }

            if (bIsCurrent)
            {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;

                if (true === bIsNoNormalize)
                {
                    if (x_mm > (this.m_arrPages[i].width_mm + 10))
                        x_mm = this.m_arrPages[i].width_mm + 10;
                    if (x_mm < -10)
                        x_mm = -10;
                }

                return { X : x_mm, Y : y_mm, Page: rect.pageIndex, DrawPage: i };
            }
        }

        return { X : 0, Y : 0, Page: -1, DrawPage: -1 };
    }

    this.ConvetToPageCoords = function(x,y,pageIndex)
    {
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
        {
            return { X : 0, Y : 0, Page : pageIndex, Error: true };
        }
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        var rect = this.m_arrPages[pageIndex].drawingPage;

        var _x = (x - rect.left) * dKoef;
        var _y = (y - rect.top) * dKoef;

        return { X : _x, Y : _y, Page : pageIndex, Error: false };
    }

    this.IsCursorInTableCur = function(x, y, page)
    {
        var _table = this.TableOutlineDr.TableOutline;
        if (_table == null)
            return false;

        if (page != _table.PageNum)
            return false;

        var _dist = this.TableOutlineDr.image.width * g_dKoef_pix_to_mm;
        _dist *= (100 / this.m_oWordControl.m_nZoomValue);

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
    }

    this.ConvertCoordsToCursorWR = function(x, y, pageIndex, transform)
    {
        return {X: 0, Y: 0, Error: false};

//        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
//
//        var _x = 0;
//        var _y = 0;
//        if (true == this.m_oWordControl.m_bIsRuler)
//        {
//            _x = 5 * g_dKoef_mm_to_pix;
//            _y = 7 * g_dKoef_mm_to_pix;
//        }
//
//        // теперь крутить всякие циклы нет смысла
//        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
//        {
//            return { X : 0, Y : 0, Error: true };
//        }
//
//        var __x = x;
//        var __y = y;
//        if (transform)
//        {
//            __x = transform.TransformPointX(x, y);
//            __y = transform.TransformPointY(x, y);
//        }
//
//        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + __x * dKoef + _x);
//        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top  + __y * dKoef + _y);
//
//        return { X : x_pix, Y : y_pix, Error: false };
    }

    this.ConvertCoordsToCursor = function(x, y, pageIndex, bIsRul)
    {
//        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
//
//        var _x = 0;
//        var _y = 0;
//        if (true == this.m_oWordControl.m_bIsRuler)
//        {
//            if (undefined == bIsRul)
//            {
//                //_x = 5 * g_dKoef_mm_to_pix;
//                //_y = 7 * g_dKoef_mm_to_pix;
//            }
//        }
//
//        // теперь крутить всякие циклы нет смысла
//        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
//        {
//            return { X : 0, Y : 0, Error: true };
//        }
//
//        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x);
//        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top  + y * dKoef + _y);
//
//        return { X : x_pix, Y : y_pix, Error: false };
//
//        // old version
//        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++)
//        {
//            var rect = this.m_arrPages[i].drawingPage;
//
//            if (this.m_arrPages[i].pageIndex == pageIndex)
//            {
//                var x_pix = parseInt(rect.left + x * dKoef + _x);
//                var y_pix = parseInt(rect.top + y * dKoef + _y);
//
//                return { X : x_pix, Y : y_pix, Error: false };
//            }
//        }

        return { X : 0, Y : 0, Error: true };
    }
    this.ConvertCoordsToCursor2 = function(x, y, pageIndex, bIsRul)
    {
        return {X: 0, Y: 0, Error: false};

//        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
//
//        var _x = 0;
//        var _y = 0;
//        if (true == this.m_oWordControl.m_bIsRuler)
//        {
//            if (undefined == bIsRul)
//            {
//                //_x = 5 * g_dKoef_mm_to_pix;
//                //_y = 7 * g_dKoef_mm_to_pix;
//            }
//        }
//
//        // теперь крутить всякие циклы нет смысла
//        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
//        {
//            return { X : 0, Y : 0, Error: true };
//        }
//
//        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x - 0.5);
//        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top  + y * dKoef + _y - 0.5);
//
//        return { X : x_pix, Y : y_pix, Error: false };
    }
    this.ConvertCoordsToCursor3 = function(x, y, pageIndex)
    {
        return {X: 0, Y: 0, Error: false};
        //var _return = this.Native["DD_ConvertCoordsToAnotherPage"](x, y, pageCoord, pageNeed);
        //return { X : _return[0], Y : _return[1], Error : _return[2] };

//        // теперь крутить всякие циклы нет смысла
//        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount)
//        {
//            return { X : 0, Y : 0, Error: true };
//        }
//
//        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
//
//        var _x = this.m_oWordControl.X;
//        var _y = this.m_oWordControl.Y;
//
//        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x + 0.5);
//        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top  + y * dKoef + _y + 0.5);
//
//        return { X : x_pix, Y : y_pix, Error: false };
    }

    this.InitViewer = function()
    {
    }

    this.TargetStart = function()
    {
        this.Native["DD_TargetStart"]();
    }
    this.TargetEnd = function()
    {
        this.TargetShowFlag = false;
        this.TargetShowNeedFlag = false;
        this.Native["DD_TargetEnd"]();
    }
    this.UpdateTargetNoAttack = function()
    {
        if (null == this.m_oWordControl)
            return;

        this.CheckTargetDraw(this.m_dTargetX, this.m_dTargetY);
    }

    this.GetTargetStyle = function()
    {
        return "rgb(" + this.TargetCursorColor.R + "," + this.TargetCursorColor.G + "," + this.TargetCursorColor.B + ")";
    }

    this.SetTargetColor = function(r, g, b)
    {
        this.Native["DD_SetTargetColor"](r, g, b);
    }

    this.CheckTargetDraw = function(x, y)
    {
        //TODO:

//        var _oldW = this.TargetHtmlElement.width;
//        var _oldH = this.TargetHtmlElement.height;
//
//        var dKoef = this.drawingObjects.convertMetric(1, 3, 0);
//
//        var _newW = 2;
//        var _newH = this.m_dTargetSize * dKoef;
//
//        var _offX = 0;
//        var _offY = 0;
//        if (this.AutoShapesTrack && this.AutoShapesTrack.Graphics && this.AutoShapesTrack.Graphics.m_oCoordTransform)
//        {
//            _offX = this.AutoShapesTrack.Graphics.m_oCoordTransform.tx;
//            _offY = this.AutoShapesTrack.Graphics.m_oCoordTransform.ty;
//        }
//
//        var _factor = AscBrowser.isRetina ? 1 : 0;
//
//        if (null != this.TextMatrix && !global_MatrixTransformer.IsIdentity2(this.TextMatrix))
//        {
//            var _x1 = this.TextMatrix.TransformPointX(x, y);
//            var _y1 = this.TextMatrix.TransformPointY(x, y);
//
//            var _x2 = this.TextMatrix.TransformPointX(x, y + this.m_dTargetSize);
//            var _y2 = this.TextMatrix.TransformPointY(x, y + this.m_dTargetSize);
//
//            var pos1 = { X : _offX + dKoef * _x1, Y : _offY + dKoef * _y1 };
//            var pos2 = { X : _offX + dKoef * _x2, Y : _offY + dKoef * _y2 };
//
//            _newW = (((Math.abs(pos1.X - pos2.X) >> 0) + 1) >> 1) << 1;
//            _newH = (((Math.abs(pos1.Y - pos2.Y) >> 0) + 1) >> 1) << 1;
//
//            if (2 > _newW)
//                _newW = 2;
//            if (2 > _newH)
//                _newH = 2;
//
//            if (_oldW == _newW && _oldH == _newH)
//            {
//                // просто очищаем
//                this.TargetHtmlElement.width = _newW;
//            }
//            else
//            {
//                this.TargetHtmlElement.style.width = (_newW >> _factor) + "px";
//                this.TargetHtmlElement.style.height = (_newH >> _factor) + "px";
//
//                this.TargetHtmlElement.width = _newW;
//                this.TargetHtmlElement.height = _newH;
//            }
//            var ctx = this.TargetHtmlElement.getContext('2d');
//
//            if (_newW  == 2 || _newH == 2)
//            {
//                ctx.fillStyle = this.GetTargetStyle();
//                ctx.fillRect(0, 0, _newW, _newH);
//            }
//            else
//            {
//                ctx.beginPath();
//                ctx.strokeStyle = this.GetTargetStyle();
//                ctx.lineWidth = 2;
//
//                if (((pos1.X - pos2.X)*(pos1.Y - pos2.Y)) >= 0)
//                {
//                    ctx.moveTo(0, 0);
//                    ctx.lineTo(_newW, _newH);
//                }
//                else
//                {
//                    ctx.moveTo(0, _newH);
//                    ctx.lineTo(_newW, 0);
//                }
//
//                ctx.stroke();
//            }
//
//            this.TargetHtmlElement.style.left = (Math.min(pos1.X, pos2.X) >> _factor) + "px";
//            this.TargetHtmlElement.style.top = (Math.min(pos1.Y, pos2.Y) >> _factor) + "px";
//        }
//        else
//        {
//            if (_oldW == _newW && _oldH == _newH)
//            {
//                // просто очищаем
//                this.TargetHtmlElement.width = _newW;
//            }
//            else
//            {
//                this.TargetHtmlElement.style.width = (_newW >> _factor) + "px";
//                this.TargetHtmlElement.style.height = (_newH >> _factor) + "px";
//
//                this.TargetHtmlElement.width = _newW;
//                this.TargetHtmlElement.height = _newH;
//            }
//
//            var ctx = this.TargetHtmlElement.getContext('2d');
//
//            ctx.fillStyle = this.GetTargetStyle();
//            ctx.fillRect(0, 0, _newW, _newH);
//
//            if (null != this.TextMatrix)
//            {
//                x += this.TextMatrix.tx;
//                y += this.TextMatrix.ty;
//            }
//
//            var pos = { X : _offX + dKoef * x, Y : _offY + dKoef * y };
//
//            this.TargetHtmlElement.style.left = (pos.X >> _factor) + "px";
//            this.TargetHtmlElement.style.top = (pos.Y >> _factor) + "px";
//        }
    }

    this.UpdateTargetTransform = function(matrix)
    {
        if (matrix)
        {
            if (null == this.TextMatrix)
                this.TextMatrix = new AscCommon.CMatrix();
            this.TextMatrix.sx = matrix.sx;
            this.TextMatrix.shy = matrix.shy;
            this.TextMatrix.shx = matrix.shx;
            this.TextMatrix.sy = matrix.sy;
            this.TextMatrix.tx = matrix.tx;
            this.TextMatrix.ty = matrix.ty;

            this.Native["DD_UpdateTargetTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        }
        else
        {
            this.TextMatrix = null;
            this.Native["DD_RemoveTargetTransform"]();
        }
    }

    this.UpdateTarget = function(x, y, pageIndex)
    {
        this.m_dTargetX = x;
        this.m_dTargetY = y;
        this.m_lTargetPage = pageIndex;

        this.Native["DD_UpdateTarget"](x, y, pageIndex);

        this.CheckTargetDraw(x, y);
    }
    this.UpdateTarget2 = function(x, y, pageIndex)
    {
        //TODO:

//        if (pageIndex >= this.m_arrPages.length)
//            return;
//
//        this.m_oWordControl.m_oLogicDocument.Set_TargetPos( x, y, pageIndex );
//
//        var bIsPageChanged = false;
//        if (this.m_lCurrentPage != pageIndex)
//        {
//            this.m_lCurrentPage = pageIndex;
//            this.m_oWordControl.SetCurrentPage2();
//            this.m_oWordControl.OnScroll();
//            bIsPageChanged = true;
//        }
//
//        this.m_dTargetX = x;
//        this.m_dTargetY = y;
//        this.m_lTargetPage = pageIndex;
//
//        var pos = this.ConvertCoordsToCursor(x, y, this.m_lCurrentPage);
//
//        if (true == pos.Error && (false == bIsPageChanged))
//            return;
//
//        // �������, ����� �� ������ �� ������
//        var boxX = 0;
//        var boxY = 0;
//        var boxR = this.m_oWordControl.m_oEditor.HtmlElement.width;
//        var boxB = this.m_oWordControl.m_oEditor.HtmlElement.height;
//
//        /*
//        if (true == this.m_oWordControl.m_bIsRuler)
//        {
//            boxX += Number(5 * g_dKoef_mm_to_pix);
//            boxY += Number(7 * g_dKoef_mm_to_pix);
//            boxR += Number(5 * g_dKoef_mm_to_pix);
//            boxB += Number(7 * g_dKoef_mm_to_pix);
//        }
//        */
//
//        var nValueScrollHor = 0;
//        if (pos.X < boxX)
//        {
//            //nValueScrollHor = boxX - pos.X;
//            //nValueScrollHor = pos.X;
//            nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(x - 5, pageIndex);
//        }
//        if (pos.X > boxR)
//        {
//            //nValueScrollHor = boxR - pos.X;
//            //nValueScrollHor = pos.X + this.m_oWordControl.m_oEditor.HtmlElement.width;
//            var _mem = x + 5 - g_dKoef_pix_to_mm * this.m_oWordControl.m_oEditor.HtmlElement.width * 100 / this.m_oWordControl.m_nZoomValue;
//            nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(_mem, pageIndex);
//        }
//
//        var nValueScrollVer = 0;
//        if (pos.Y < boxY)
//        {
//            //nValueScrollVer = boxY - pos.Y;
//            //nValueScrollVer = pos.Y;
//            nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(y - 5, pageIndex);
//        }
//        if (pos.Y > boxB)
//        {
//            //nValueScrollVer = boxB - pos.Y;
//            //nValueScrollHor = pos.Y + this.m_oWordControl.m_oEditor.HtmlElement.height;
//            var _mem = y + this.m_dTargetSize + 5 - g_dKoef_pix_to_mm * this.m_oWordControl.m_oEditor.HtmlElement.height * 100 / this.m_oWordControl.m_nZoomValue;
//            nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(_mem, pageIndex);
//        }
//
//        var isNeedScroll = false;
//        if (0 != nValueScrollHor)
//        {
//            isNeedScroll = true;
//            var temp = nValueScrollHor * this.m_oWordControl.m_dScrollX_max / (this.m_oWordControl.m_dDocumentWidth - this.m_oWordControl.m_oEditor.HtmlElement.width);
//            this.m_oWordControl.m_oScrollHorApi.scrollToX(parseInt(temp), false);
//        }
//        if (0 != nValueScrollVer)
//        {
//            isNeedScroll = true;
//            var temp = nValueScrollVer * this.m_oWordControl.m_dScrollY_max / (this.m_oWordControl.m_dDocumentHeight - this.m_oWordControl.m_oEditor.HtmlElement.height);
//            this.m_oWordControl.m_oScrollVerApi.scrollToY(parseInt(temp), false);
//        }
//
//        if (true == isNeedScroll)
//        {
//            this.m_oWordControl.OnScroll();
//            return;
//        }
    }

    this.UpdateTargetTimer = function() {}

    this.SetTargetSize = function(size)
    {
        this.m_dTargetSize = size;
        this.Native["DD_SetTargetSize"](size);
    }
    this.DrawTarget = function() {}

    this.TargetShow = function()
    {
        this.TargetShowNeedFlag = true;
        this.Native["DD_TargetShow"]();
    }
    this.CheckTargetShow = function() {}
    this.StartTrackImage = function(obj, x, y, w, h, type, pagenum)
    {
    }
    this.StartTrackTable = function(obj, transform)
    {
        //TODO:
//        if (this.m_oWordControl.MobileTouchManager)
//        {
//            if (!this.m_oWordControl.MobileTouchManager.TableStartTrack_Check)
//                return;
//        }
//
//        this.TableOutlineDr.TableOutline = obj;
//        this.TableOutlineDr.Counter = 0;
//        this.TableOutlineDr.bIsNoTable = false;
//        this.TableOutlineDr.CheckStartTrack(this.m_oWordControl, transform);
//
//        if (this.m_oWordControl.MobileTouchManager)
//            this.m_oWordControl.OnUpdateOverlay();
    }
    this.EndTrackTable = function(pointer, bIsAttack)
    {
        if (this.TableOutlineDr.TableOutline != null)
        {
            if (pointer == this.TableOutlineDr.TableOutline.Table || bIsAttack)
            {
                this.TableOutlineDr.TableOutline = null;
                this.TableOutlineDr.Counter = 0;
            }
        }
    }
    this.CheckTrackTable = function()
    {
        if (null == this.TableOutlineDr.TableOutline)
            return;

        if (this.TableOutlineDr.bIsNoTable && this.TableOutlineDr.bIsTracked === false)
        {
            this.TableOutlineDr.Counter++;
            if (this.TableOutlineDr.Counter > 100)
            {
                this.TableOutlineDr.TableOutline = null;
                this.m_oWordControl.OnUpdateOverlay();
            }
        }
    }
    this.DrawTableTrack = function(overlay)
    {
        //TODO:
//        if (null == this.TableOutlineDr.TableOutline)
//            return;
//
//        var _table = this.TableOutlineDr.TableOutline.Table;
//
//        if (!_table.Is_Inline())
//        {
//            if (null == this.TableOutlineDr.CurPos)
//                return;
//
//            var _page = this.m_arrPages[this.TableOutlineDr.CurPos.Page];
//            var drPage = _page.drawingPage;
//
//            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
//            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;
//
//            if (!this.TableOutlineDr.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableOutlineDr.TableMatrix))
//            {
//                var _x = parseInt(drPage.left + dKoefX * (this.TableOutlineDr.CurPos.X + _table.Get_TableOffsetCorrection())) + 0.5;
//                var _y = parseInt(drPage.top + dKoefY * this.TableOutlineDr.CurPos.Y) + 0.5;
//
//                var _r = _x + parseInt(dKoefX * this.TableOutlineDr.TableOutline.W);
//                var _b = _y + parseInt(dKoefY * this.TableOutlineDr.TableOutline.H);
//
//                if (_x < overlay.min_x)
//                    overlay.min_x = _x;
//                if (_r > overlay.max_x)
//                    overlay.max_x = _r;
//
//                if (_y < overlay.min_y)
//                    overlay.min_y = _y;
//                if (_b > overlay.max_y)
//                    overlay.max_y = _b;
//
//                var ctx = overlay.m_oContext;
//                ctx.strokeStyle = "#FFFFFF";
//
//                ctx.beginPath();
//                ctx.rect(_x, _y, _r - _x, _b - _y);
//                ctx.stroke();
//
//                ctx.strokeStyle = "#000000";
//                ctx.beginPath();
//
//                // набиваем пунктир
//                var dot_size = 3;
//                for (var i = _x; i < _r; i += dot_size)
//                {
//                    ctx.moveTo(i, _y);
//                    i += dot_size;
//
//                    if (i > _r)
//                        i = _r;
//
//                    ctx.lineTo(i, _y);
//                }
//                for (var i = _y; i < _b; i += dot_size)
//                {
//                    ctx.moveTo(_r, i);
//                    i += dot_size;
//
//                    if (i > _b)
//                        i = _b;
//
//                    ctx.lineTo(_r, i);
//                }
//                for (var i = _r; i > _x; i -= dot_size)
//                {
//                    ctx.moveTo(i, _b);
//                    i -= dot_size;
//
//                    if (i < _x)
//                        i = _x;
//
//                    ctx.lineTo(i, _b);
//                }
//                for (var i = _b; i > _y; i -= dot_size)
//                {
//                    ctx.moveTo(_x, i);
//                    i -= dot_size;
//
//                    if (i < _y)
//                        i = _y;
//
//                    ctx.lineTo(_x, i);
//                }
//
//                ctx.stroke();
//                ctx.beginPath();
//            }
//            else
//            {
//                var _x = this.TableOutlineDr.CurPos.X + _table.Get_TableOffsetCorrection();
//                var _y = this.TableOutlineDr.CurPos.Y;
//                var _r = _x + this.TableOutlineDr.TableOutline.W;
//                var _b = _y + this.TableOutlineDr.TableOutline.H;
//
//                var transform = this.TableOutlineDr.TableMatrix;
//
//                var x1 = transform.TransformPointX(_x, _y);
//                var y1 = transform.TransformPointY(_x, _y);
//
//                var x2 = transform.TransformPointX(_r, _y);
//                var y2 = transform.TransformPointY(_r, _y);
//
//                var x3 = transform.TransformPointX(_r, _b);
//                var y3 = transform.TransformPointY(_r, _b);
//
//                var x4 = transform.TransformPointX(_x, _b);
//                var y4 = transform.TransformPointY(_x, _b);
//
//                overlay.CheckPoint(x1, y1);
//                overlay.CheckPoint(x2, y2);
//                overlay.CheckPoint(x3, y3);
//                overlay.CheckPoint(x4, y4);
//
//                var ctx = overlay.m_oContext;
//                ctx.strokeStyle = "#FFFFFF";
//
//                ctx.beginPath();
//                ctx.moveTo(x1, y1);
//                ctx.lineTo(x2, y2);
//                ctx.lineTo(x3, y3);
//                ctx.lineTo(x4, y4);
//                ctx.closePath();
//                ctx.stroke();
//
//                ctx.strokeStyle = "#000000";
//                ctx.beginPath();
//
//                this.AutoShapesTrack.AddRectDash(ctx, x1, y1, x2, y2, x4, y4, x3, y3, 3, 3);
//
//                ctx.stroke();
//                ctx.beginPath();
//            }
//        }
//        else
//        {
//            this.LockCursorType("default");
//
//            var _x = global_mouseEvent.X;
//            var _y = global_mouseEvent.Y;
//            var posMouse = this.ConvertCoordsFromCursor2(_x, _y);
//
//            this.TableOutlineDr.InlinePos = this.m_oWordControl.m_oLogicDocument.Get_NearestPos(posMouse.Page, posMouse.X, posMouse.Y);
//            this.TableOutlineDr.InlinePos.Page = posMouse.Page;
//            //var posView = this.ConvertCoordsToCursor(this.TableOutlineDr.InlinePos.X, this.TableOutlineDr.InlinePos.Y, posMouse.Page, true);
//
//            var _near = this.TableOutlineDr.InlinePos;
//            this.AutoShapesTrack.SetCurrentPage(_near.Page);
//            this.AutoShapesTrack.DrawInlineMoveCursor(_near.X, _near.Y, _near.Height, _near.transform);
//        }
    }
    this.SetCurrentPage = function(PageIndex)
    {
        this.m_lCurrentPage = this.Native["DD_SetCurrentPage"](PageIndex);

//        if (PageIndex >= this.m_arrPages.length)
//            return;
//        if (this.m_lCurrentPage == PageIndex)
//            return;
//
//        this.m_lCurrentPage = PageIndex;
//        this.m_oWordControl.SetCurrentPage();
    }

    this.SelectEnabled = function(bIsEnabled)
    {
        this.m_bIsSelection = bIsEnabled;
        if (false === this.m_bIsSelection)
        {
            this.SelectClear();
//            //this.m_oWordControl.CheckUnShowOverlay();
//            //this.drawingObjects.OnUpdateOverlay();
//            this.drawingObjects.getOverlay().m_oContext.globalAlpha = 1.0;
    }
    }
	this.SelectClear = function()
    {
        this.Native["DD_SelectClear"]();
    }
    this.SearchClear = function()
    {
        //TODO:
//        for (var i = 0; i < this.m_lPagesCount; i++)
//        {
//            this.m_arrPages[i].searchingArray.splice(0, this.m_arrPages[i].searchingArray.length);
//        }
//
//        this._search_HdrFtr_All.splice(0, this._search_HdrFtr_All.length);
//        this._search_HdrFtr_All_no_First.splice(0, this._search_HdrFtr_All_no_First.length);
//        this._search_HdrFtr_First.splice(0, this._search_HdrFtr_First.length);
//        this._search_HdrFtr_Even.splice(0, this._search_HdrFtr_Even.length);
//        this._search_HdrFtr_Odd.splice(0, this._search_HdrFtr_Odd.length);
//        this._search_HdrFtr_Odd_no_First.splice(0, this._search_HdrFtr_Odd_no_First.length);
//
//        this.m_oWordControl.m_oOverlayApi.Clear();
//        this.m_bIsSearching = false;
//        this.CurrentSearchNavi = null;
    }
    this.AddPageSearch = function(findText, rects, type)
    {
        //TODO:

//        var _len = rects.length;
//        if (_len == 0)
//            return;
//
//        if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none")
//        {
//            this.m_oWordControl.ShowOverlay();
//            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
//        }
//
//        var navigator = { Page : rects[0].PageNum, Place : rects, Type : type };
//
//        var _find = { text: findText, navigator : navigator };
//        this.m_oWordControl.m_oApi.sync_SearchFoundCallback(_find);
//
//        var is_update = false;
//
//        var _type = type & 0x00FF;
//        switch (_type)
//        {
//            case search_Common:
//            {
//                var _pages = this.m_arrPages;
//                for (var i = 0; i < _len; i++)
//                {
//                    var r = rects[i];
//
//                    if (this.SearchTransform)
//                        r.Transform = this.SearchTransform;
//
//                    _pages[r.PageNum].searchingArray[_pages[r.PageNum].searchingArray.length] = r;
//
//                    if (r.PageNum >= this.m_lDrawingFirst && r.PageNum <= this.m_lDrawingEnd)
//                        is_update = true;
//                }
//                break;
//            }
//            case search_HdrFtr_All:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_All[this._search_HdrFtr_All.length] = rects[i];
//                }
//                is_update = true;
//
//                break;
//            }
//            case search_HdrFtr_All_no_First:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_All_no_First[this._search_HdrFtr_All_no_First.length] = rects[i];
//                }
//                if (this.m_lDrawingEnd > 0)
//                    is_update = true;
//
//                break;
//            }
//            case search_HdrFtr_First:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_First[this._search_HdrFtr_First.length] = rects[i];
//                }
//                if (this.m_lDrawingFirst == 0)
//                    is_update = true;
//
//                break;
//            }
//            case search_HdrFtr_Even:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_Even[this._search_HdrFtr_Even.length] = rects[i];
//                }
//                var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
//
//                if (__c > 1)
//                    is_update = true;
//                else if (__c == 1 && (this.m_lDrawingFirst & 1) == 1)
//                    is_update = true;
//
//                break;
//            }
//            case search_HdrFtr_Odd:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_Odd[this._search_HdrFtr_Odd.length] = rects[i];
//                }
//                var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
//
//                if (__c > 1)
//                    is_update = true;
//                else if (__c == 1 && (this.m_lDrawingFirst & 1) == 0)
//                    is_update = true;
//
//                break;
//            }
//            case search_HdrFtr_Odd_no_First:
//            {
//                for (var i = 0; i < _len; i++)
//                {
//                    if (this.SearchTransform)
//                        rects[i].Transform = this.SearchTransform;
//
//                    this._search_HdrFtr_Odd_no_First[this._search_HdrFtr_Odd_no_First.length] = rects[i];
//                }
//
//                if (this.m_lDrawingEnd > 1)
//                {
//                    var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
//                    if (__c > 1)
//                        is_update = true;
//                    else if (__c == 1 && (this.m_lDrawingFirst & 1) == 0)
//                        is_update = true;
//                }
//
//                break;
//            }
//            default:
//                break;
//        }
//
//        if (is_update)
//            this.drawingObjects.OnUpdateOverlay();

    }

    this.StartSearchTransform = function(transform)
    {
        //TODO:
        //this.SearchTransform = transform.CreateDublicate();
    }

    this.EndSearchTransform = function()
    {
        //TODO:
       // this.SearchTransform = null;
    }

    this.StartSearch = function()
    {
        //TODO:
//        this.SearchClear();
//        if (this.m_bIsSelection)
//            this.m_oWordControl.OnUpdateOverlay();
//        this.m_bIsSearching = true;
//        this.CurrentSearchNavi = null;
    }
    this.EndSearch = function(bIsChange)
    {
        //TODO:

//        if (bIsChange)
//        {
//            this.SearchClear();
//            this.m_bIsSearching = false;
//            this.m_oWordControl.OnUpdateOverlay();
//        }
//        else
//        {
//            this.m_bIsSearching = true;
//            this.m_oWordControl.OnUpdateOverlay();
//        }
//        this.m_oWordControl.m_oApi.sync_SearchEndCallback();
    }

    this.private_StartDrawSelection = function(overlay)
    {
        this.Native["DD_StartDrawSelection"]();

        //        this.Overlay = overlay;
//        this.IsTextMatrixUse = ((null != this.TextMatrix) && !global_MatrixTransformer.IsIdentity(this.TextMatrix));
//
//        this.Overlay.m_oContext.fillStyle = "rgba(51,102,204,255)";
//        this.Overlay.m_oContext.beginPath();
//
//        if (this.IsTextMatrixUse)
//            this.Overlay.m_oContext.strokeStyle = "#9ADBFE";
    }
    this.private_EndDrawSelection = function()
    {
        this.Native["DD_EndDrawSelection"]();

        //TODO:
//        var ctx = this.Overlay.m_oContext;
//
//        ctx.globalAlpha = 0.2;
//        ctx.fill();
//
//        if (this.IsTextMatrixUse)
//        {
//            ctx.globalAlpha = 1.0;
//            ctx.stroke();
//        }
//
//        ctx.beginPath();
//        ctx.globalAlpha = 1.0;
//
//        this.IsTextMatrixUse = false;
//        this.Overlay = null;
    }

    this.AddPageSelection = function(pageIndex, x, y, w, h)
    {
        this.Native["DD_AddPageSelection"](pageIndex, x, y, w, h);
    }

    this.AddPageSelection2 = function(pageIndex, x, y, width, height)
    {
        //TODO:

//        //if (pageIndex < 0 || pageIndex >= Math.max(this.m_lPagesCount, this.m_lCountCalculatePages) || Math.abs(width) < 0.001 || Math.abs(height) < 0.001)
//        //    return;
//        if (Math.abs(width) < 0.001 || Math.abs(height) < 0.001)
//            return;
//
//        if (undefined === this.m_arrPages[pageIndex])
//            this.m_arrPages[pageIndex] = new CPage();
//
//        if (this.min_PageAddSelection > pageIndex)
//            this.min_PageAddSelection = pageIndex;
//        if (this.max_PageAddSelection < pageIndex)
//            this.max_PageAddSelection = pageIndex;
//
//        if (this.m_bIsSelection && (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none"))
//        {
//            this.m_oWordControl.ShowOverlay();
//            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
//        }
//
//        var r = new _rect();
//        r.x = x;
//        r.y = y;
//        r.w = width;
//        r.h = height;
//        this.m_arrPages[pageIndex].selectionArray[this.m_arrPages[pageIndex].selectionArray.length] = r;
//
//        if (this.m_oWordControl.MobileTouchManager)
//        {
//            if (null == this.m_oWordControl.MobileTouchManager.RectSelect1)
//            {
//                this.m_oWordControl.MobileTouchManager.RectSelect1 = r;
//                this.m_oWordControl.MobileTouchManager.PageSelect1 = pageIndex;
//            }
//
//            this.m_oWordControl.MobileTouchManager.RectSelect2 = r;
//            this.m_oWordControl.MobileTouchManager.PageSelect2 = pageIndex;
//        }
    }

    this.AddPageSelection2 = function(pageIndex, x, y, width, height)
    {
        //TODO:
//        //if (pageIndex < 0 || pageIndex >= Math.max(this.m_lPagesCount, this.m_lCountCalculatePages) || Math.abs(width) < 0.001 || Math.abs(height) < 0.001)
//        //    return;
//        if (Math.abs(width) < 0.001 || Math.abs(height) < 0.001)
//            return;
//
//        if (undefined === this.m_arrPages[pageIndex])
//            this.m_arrPages[pageIndex] = new CPage();
//
//        if (this.min_PageAddSelection > pageIndex)
//            this.min_PageAddSelection = pageIndex;
//        if (this.max_PageAddSelection < pageIndex)
//            this.max_PageAddSelection = pageIndex;
//
//        if (this.m_bIsSelection && (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none"))
//        {
//            this.m_oWordControl.ShowOverlay();
//            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
//        }
//
//        var r = new _rect();
//        r.x = x;
//        r.y = y;
//        r.w = width;
//        r.h = height;
//        this.m_arrPages[pageIndex].selectionArray[this.m_arrPages[pageIndex].selectionArray.length] = r;
//
//        if (this.m_oWordControl.MobileTouchManager)
//        {
//            if (null == this.m_oWordControl.MobileTouchManager.RectSelect1)
//            {
//                this.m_oWordControl.MobileTouchManager.RectSelect1 = r;
//                this.m_oWordControl.MobileTouchManager.PageSelect1 = pageIndex;
//            }
//
//            this.m_oWordControl.MobileTouchManager.RectSelect2 = r;
//            this.m_oWordControl.MobileTouchManager.PageSelect2 = pageIndex;
//        }
    }
    this.SelectShow = function()
    {
        this.drawingObjects.OnUpdateOverlay();
    }

    this.Set_RulerState_Table = function(markup, transform)
    {
        //TODO:

//        var hor_ruler = this.m_oWordControl.m_oHorRuler;
//        var ver_ruler = this.m_oWordControl.m_oVerRuler;
//
//        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
//        hor_ruler.m_oTableMarkup = markup.CreateDublicate();
//
//        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
//        ver_ruler.m_oTableMarkup = markup.CreateDublicate();
//
//        this.TableOutlineDr.TableMatrix         = null;
//        this.TableOutlineDr.CurrentPageIndex    = this.m_lCurrentPage;
//        if (transform)
//        {
//            hor_ruler.m_oTableMarkup.TransformX = transform.tx;
//            hor_ruler.m_oTableMarkup.TransformY = transform.ty;
//
//            ver_ruler.m_oTableMarkup.TransformX = transform.tx;
//            ver_ruler.m_oTableMarkup.TransformY = transform.ty;
//
//            hor_ruler.m_oTableMarkup.CorrectFrom();
//            ver_ruler.m_oTableMarkup.CorrectFrom();
//
//            this.TableOutlineDr.TableMatrix = transform.CreateDublicate();
//        }
//
//        hor_ruler.CalculateMargins();
//
//        if (0 <= this.m_lCurrentPage && this.m_lCurrentPage < this.m_lPagesCount)
//        {
//            hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
//            ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
//        }
//
//        this.m_oWordControl.UpdateHorRuler();
//        this.m_oWordControl.UpdateVerRuler();
//
//        if (this.m_oWordControl.MobileTouchManager)
//        {
//            this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = true;
//            markup.Table.Start_TrackTable();
//            this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = false;
//        }
    }

    this.Set_RulerState_Paragraph = function(margins)
    {
        //TODO:
//        var hor_ruler = this.m_oWordControl.m_oHorRuler;
//        var ver_ruler = this.m_oWordControl.m_oVerRuler;
//
//        if (hor_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH && ver_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH)
//        {
//            if ((margins && !hor_ruler.IsCanMoveMargins) || (!margins && hor_ruler.IsCanMoveMargins))
//            {
//                var bIsNeedUpdate = false;
//                if (margins && this.LastParagraphMargins)
//                {
//                    if (margins.L != this.LastParagraphMargins.L ||
//                        margins.T != this.LastParagraphMargins.T ||
//                        margins.R != this.LastParagraphMargins.R ||
//                        margins.B != this.LastParagraphMargins.B)
//                    {
//                        bIsNeedUpdate = true;
//                    }
//                }
//
//                if (!bIsNeedUpdate)
//                    return;
//            }
//        }
//
//        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
//        hor_ruler.m_oTableMarkup = null;
//
//        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
//        ver_ruler.m_oTableMarkup = null;
//
//        // вообще надо посмотреть... может и был параграф до этого.
//        // тогда вэкграунд перерисовывать не нужно. Только надо знать, на той же странице это было или нет
//        if (-1 != this.m_lCurrentPage)
//        {
//            if (margins)
//            {
//                var cachedPage = {};
//                cachedPage.width_mm = this.m_arrPages[this.m_lCurrentPage].width_mm;
//                cachedPage.height_mm = this.m_arrPages[this.m_lCurrentPage].height_mm;
//
//                cachedPage.margin_left    = margins.L;
//                cachedPage.margin_top     = margins.T;
//                cachedPage.margin_right   = margins.R;
//                cachedPage.margin_bottom  = margins.B;
//
//                hor_ruler.CreateBackground(cachedPage);
//                ver_ruler.CreateBackground(cachedPage);
//
//                // disable margins
//                hor_ruler.IsCanMoveMargins = false;
//                ver_ruler.IsCanMoveMargins = false;
//
//                this.LastParagraphMargins = {};
//                this.LastParagraphMargins.L = margins.L;
//                this.LastParagraphMargins.T = margins.T;
//                this.LastParagraphMargins.R = margins.R;
//                this.LastParagraphMargins.B = margins.B;
//            }
//            else
//            {
//                hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
//                ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
//
//                // enable margins
//                hor_ruler.IsCanMoveMargins = true;
//                ver_ruler.IsCanMoveMargins = true;
//
//                this.LastParagraphMargins = null;
//            }
//        }
//
//        this.m_oWordControl.UpdateHorRuler();
//        this.m_oWordControl.UpdateVerRuler();
    }

    this.Set_RulerState_HdrFtr = function(bHeader, Y0, Y1)
    {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;

        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        hor_ruler.m_oTableMarkup = null;

        ver_ruler.CurrentObjectType = (true === bHeader) ? RULER_OBJECT_TYPE_HEADER : RULER_OBJECT_TYPE_FOOTER;
        ver_ruler.header_top = Y0;
        ver_ruler.header_bottom = Y1;
        ver_ruler.m_oTableMarkup = null;

        // вообще надо посмотреть... может и бал параграф до этого.
        // тогда вэкграунд перерисовывать не нужно. Только надо знать, на той же странице это было или нет
        if (-1 != this.m_lCurrentPage)
        {
            hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
            ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
        }

        this.m_oWordControl.UpdateHorRuler();
        this.m_oWordControl.UpdateVerRuler();
    }

    this.Update_ParaTab = function(Default_Tab, ParaTabs)
    {
        //TODO:

//        var hor_ruler = this.m_oWordControl.m_oHorRuler;
//
//        var __tabs = ParaTabs.Tabs;
//        if (undefined === __tabs)
//            __tabs = ParaTabs;
//
//        var _len = __tabs.length;
//        if ((Default_Tab == hor_ruler.m_dDefaultTab) && (hor_ruler.m_arrTabs.length == _len) && (_len == 0))
//        {
//            // потом можно и проверить сами табы
//            return;
//        }
//
//        hor_ruler.m_dDefaultTab = Default_Tab;
//        hor_ruler.m_arrTabs = [];
//        var _ar = hor_ruler.m_arrTabs;
//
//        for (var i = 0; i < _len; i++)
//        {
//            if (__tabs[i].Value == tab_Left)
//                _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_left);
//            else if (__tabs[i].Value == tab_Center)
//                _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_center);
//            else if (__tabs[i].Value == tab_Right)
//                _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_right);
//        }
//
//        hor_ruler.CorrectTabs();
//        this.m_oWordControl.UpdateHorRuler();
    }

    this.UpdateTableRuler = function(isCols, index, position)
    {
        this.Native["DD_UpdateTableRuler"](isCols, index, position);
    }
    this.GetDotsPerMM = function(value)
    {
        return value * this.Native["DD_GetDotsPerMM"]();
       // return value * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
    }

    this.GetMMPerDot = function(value)
    {
        return value / this.GetDotsPerMM( 1 );
    }
    this.GetVisibleMMHeight = function()
    {
        return this.Native["DD_GetVisibleMMHeight"]();

//        var pixHeigth = this.m_oWordControl.m_oEditor.HtmlElement.height;
//        var pixBetweenPages = 20 * (this.m_lDrawingEnd - this.m_lDrawingFirst);
//
//        return (pixHeigth - pixBetweenPages) * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
    }

    // вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
    this.CheckFontCache = function()
    {
        var map_used = this.LogicDocument.Document_CreateFontMap();

        for (var i in map_used)
        {
            this.Native["DD_CheckFontCacheAdd"](map_used[i].Name, map_used[i].Style, map_used[i].Size);
        }
        this.Native["DD_CheckFontCache"]();

//        var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();
//
//        var _measure_map = g_oTextMeasurer.m_oManager.m_oFontsCache.Fonts;
//        var _drawing_map = g_fontManager.m_oFontsCache.Fonts;
//
//        var map_keys = {};
//        var api = this.m_oWordControl.m_oApi;
//        for (var i in map_used)
//        {
//            var key = GenerateMapId(api, map_used[i].Name, map_used[i].Style, map_used[i].Size);
//            map_keys[key] = true;
//        }
//
//        // а теперь просто пробегаем по кэшам и удаляем ненужное
//        for (var i in _measure_map)
//        {
//            if (map_keys[i] == undefined)
//            {
//                //_measure_map[i] = undefined;
//                delete _measure_map[i];
//            }
//        }
//        for (var i in _drawing_map)
//        {
//            if (map_keys[i] == undefined)
//            {
//                //_drawing_map[i] = undefined;
//                if (null != _drawing_map[i])
//                    _drawing_map[i].Destroy();
//                delete _drawing_map[i];
//            }
//        }
    }

    // при загрузке документа - нужно понять какие шрифты используются
    this.CheckFontNeeds = function()
    {
//        var map_keys = this.m_oWordControl.m_oLogicDocument.Document_Get_AllFontNames();
//        var dstfonts = [];
//        for (var i in map_keys)
//        {
//            dstfonts[dstfonts.length] = new CFont(i, 0, "", 0, null);
//        }
//        this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
//        return;

        /*
        var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();

        var map_keys = {};
        for (var i in map_used)
        {
            var search = map_used[i];
            var found = map_keys[search.Name];

            var _need_style = 0;
            switch (search.Style)
            {
                case FontStyle.FontStyleRegular:
                {
                    _need_style = fontstyle_mask_regular;
                    break;
                }
                case FontStyle.FontStyleBold:
                {
                    _need_style = fontstyle_mask_bold;
                    break;
                }
                case FontStyle.FontStyleItalic:
                {
                    _need_style = fontstyle_mask_italic;
                    break;
                }
                case FontStyle.FontStyleBoldItalic:
                {
                    _need_style = fontstyle_mask_bolditalic;
                    break;
                }
                default:
                {
                    _need_style = fontstyle_mask_regular | fontstyle_mask_italic | fontstyle_mask_bold | fontstyle_mask_bolditalic;
                    break;
                }
            }

            if (undefined === found)
            {
                map_keys[search.Name] = _need_style;
            }
            else
            {
                map_keys[search.Name] |= _need_style;
            }
        }

        // теперь просто пробегаем и заполняем все объектами
        var dstfonts = [];
        for (var i in map_keys)
        {
            dstfonts[dstfonts.length] = new CFont(i, 0, "", 0, map_keys[i]);
        }
        this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
        */
    }

    // фукнции для старта работы
    this.OpenDocument = function()
    {
        //SetHintsProps(false, false);
//        this.m_oDocumentRenderer.InitDocument(this);
//
//        this.m_oWordControl.CalculateDocumentSize();
//        this.m_oWordControl.OnScroll();
    }

    this.BeginDrawTracking = function()
    {
        this.AutoShapesTrack.BeginDrawTracking();
    },

    this.EndDrawTracking = function()
    {
        this.AutoShapesTrack.EndDrawTracking();
    },

    // вот здесь весь трекинг
    this.DrawTrack = function(type, matrix, left, top, width, height, isLine, canRotate, isNoMove)
    {
        this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
    }

    this.DrawTrackSelectShapes = function(x, y, w, h)
    {
        this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
    }

    this.DrawAdjustment = function(matrix, x, y, bTextWarp)
    {
        this.AutoShapesTrack.DrawAdjustment(matrix, x, y, bTextWarp);
    }

    this.LockTrackPageNum = function(nPageNum)
    {
        this.AutoShapesTrackLockPageNum = nPageNum;
    }
    this.UnlockTrackPageNum = function()
    {
        this.AutoShapesTrackLockPageNum = -1;
    }

    this.CheckGuiControlColors = function()
    {

    }

    this.SendControlColors = function()
    {

    }

    this.SendThemeColorScheme = function()
    {

    }

    this.DrawImageTextureFillShape = function(url)
    {

    }

    this.DrawImageTextureFillTextArt = function(url)
    {

    }

    this.InitGuiCanvasShape = function(div_id)
    {

    }

    this.InitGuiCanvasTextProps = function(div_id)
    {

    }

    this.InitGuiCanvasTextArt = function(div_id)
    {

    }

    this.DrawGuiCanvasTextProps = function(props)
    {

    };

    this.CheckTableStyles = function(tableLook)
    {
        // сначала проверим, подписан ли кто на этот евент
        // а то во вьюере не стоит ничего посылать
//        if (!this.m_oWordControl.m_oApi.asc_checkNeedCallback("asc_onInitTableTemplates"))
//            return;

        var bIsChanged = false;
        if (null == this.TableStylesLastLook)
        {
            this.TableStylesLastLook = new CTablePropLook();

            this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
            this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
            this.TableStylesLastLook.LastCol  = tableLook.LastCol;
            this.TableStylesLastLook.LastRow  = tableLook.LastRow;
            this.TableStylesLastLook.BandHor  = tableLook.BandHor;
            this.TableStylesLastLook.BandVer  = tableLook.BandVer;
            bIsChanged = true;
        }
        else
        {
            if (this.TableStylesLastLook.FirstCol != tableLook.FirstCol)
            {
                this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.FirstRow != tableLook.FirstRow)
            {
                this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.LastCol != tableLook.LastCol)
            {
                this.TableStylesLastLook.LastCol = tableLook.LastCol;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.LastRow != tableLook.LastRow)
            {
                this.TableStylesLastLook.LastRow = tableLook.LastRow;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.BandHor != tableLook.BandHor)
            {
                this.TableStylesLastLook.BandHor = tableLook.BandHor;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.BandVer != tableLook.BandVer)
            {
                this.TableStylesLastLook.BandVer = tableLook.BandVer;
                bIsChanged = true;
            }
        }

        if (!bIsChanged)
            return;

        var logicDoc = this.m_oWordControl.m_oLogicDocument;
        var _dst_styles = [];

        var _styles = logicDoc.Styles.Get_AllTableStyles();
        var _styles_len = _styles.length;

        if (_styles_len == 0)
            return _dst_styles;

        var _x_mar = 10;
        var _y_mar = 10;
        var _r_mar = 10;
        var _b_mar = 10;
        var _pageW = 297;
        var _pageH = 210;

        var W = (_pageW - _x_mar - _r_mar);
        var H = (_pageH - _y_mar - _b_mar);
        var Grid = [];

        var Rows = 5;
        var Cols = 5;

        for (var i = 0; i < Cols; i++)
            Grid[i] = W / Cols;

        var _canvas = document.createElement('canvas');
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
        var ctx = _canvas.getContext('2d');

        AscCommon.History.TurnOff();
        for (var i1 = 0; i1 < _styles_len; i1++)
        {
            var i = _styles[i1];
            var _style = logicDoc.Styles.Style[i];

            if (!_style || _style.Type != styletype_Table)
                continue;

            var table = new CTable(this, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
            table.Set_Props({TableStyle : i, TableLook : tableLook});

            for (var j = 0; j < Rows; j++)
                table.Content[j].Set_Height(H / Rows, Asc.linerule_AtLeast);

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, _canvas.width, _canvas.height);

            var graphics = new AscCommon.CGraphics();
            graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
            graphics.m_oFontManager = AscCommon.g_fontManager;
            graphics.transform(1,0,0,1,0,0);

            table.Recalculate_Page(0);
            table.Draw(0, graphics);

            var _styleD = new CAscTableStyle();
            _styleD.Type = 0;
            _styleD.Image = _canvas.toDataURL("image/png");
            _styleD.Id = i;
            _dst_styles.push(_styleD);
        }
        AscCommon.History.TurnOn();

        this.m_oWordControl.m_oApi.sync_InitEditorTableStyles(_dst_styles);
    }

    this.IsMobileVersion = function()
    {
        return this.IsMobile;
    }

    this.OnSelectEnd = function()
    {
    }

}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CPage = CPage;
window['AscCommon'].CDrawingDocument = CDrawingDocument;