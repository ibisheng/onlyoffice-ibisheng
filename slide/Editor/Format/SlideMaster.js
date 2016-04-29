"use strict";

// Import
var History = AscCommon.History;

function MasterSlide(presentation, theme)
{
    this.cSld = new AscFormat.CSld();
    this.clrMap = new AscFormat.ClrMap();

    this.hf = new AscFormat.HF();

    this.sldLayoutLst = [];

    this.txStyles = null;
    this.preserve = false;

    this.ImageBase64 = "";
    this.Width64 = 0;
    this.Height64 = 0;

    this.ThemeIndex = 0;

    // pointers
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;

    this.Width = 254;
    this.Height = 190.5;
    this.recalcInfo = {};
    this.DrawingDocument = editor.WordControl.m_oDrawingDocument;
    this.maxId = 1000;


//----------------------------------------------
    this.presentation = editor.WordControl.m_oLogicDocument;
    this.theme = theme;

    this.kind = AscFormat.TYPE_KIND.MASTER;
    this.recalcInfo =
    {
        recalculateBackground: true,
        recalculateSpTree: true
    };


    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add(this, this.Id);
}

MasterSlide.prototype =
{
    addLayout: function(layout)
    {
        this.addToSldLayoutLstToPos(this.sldLayoutLst.length, layout);
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SlideMaster;
    },

    setThemeIndex: function(index)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetThemeIndex, oldPr: this.ThemeIndex, newPr: index});
        this.ThemeIndex = index;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_SlideMasterSetSize:
            {
                this.Width  = data.oldW;
                this.Height = data.oldH;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetThemeIndex:
            {
                this.ThemeIndex = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterAddToSpTree:
            {
                this.cSld.spTree.splice(data.Pos, 1);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTheme :
            {
                this.Theme = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetBg               :
            {
                this.cSld.Bg = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTxStyles         :
            {
                this.txStyles = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetCSldName         :
            {
                this.cSld.name = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetClrMapOverride   :
            {
                this.clrMap = data.oldPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterAddLayout           :
            {
                this.sldLayoutLst.splice(data.Pos, 1);
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_SlideMasterSetSize:
            {
                this.Width  = data.newW;
                this.Height = data.newH;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetThemeIndex:
            {
                this.ThemeIndex = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterAddToSpTree:
            {
                this.cSld.spTree.splice(data.Pos, 0, data.Item);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTheme :
            {
                this.Theme = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetBg               :
            {
                this.cSld.Bg = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTxStyles         :
            {
                this.txStyles = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetCSldName         :
            {
                this.cSld.name = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterSetClrMapOverride   :
            {
                this.clrMap = data.newPr;
                break;
            }
            case AscDFH.historyitem_SlideMasterAddLayout           :
            {
                this.sldLayoutLst.splice(data.Pos, 0, data.Item);
                break;
            }
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(AscDFH.historyitem_type_SlideMaster);
        w.WriteString2(this.Id);
        AscFormat.writeObject(w, this.theme);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
        this.theme = AscFormat.readObject(r);
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case AscDFH.historyitem_SlideMasterSetSize:
            {
                AscFormat.writeDouble(w, data.newW);
                AscFormat.writeDouble(w, data.newH);
                break;
            }
            case AscDFH.historyitem_SlideMasterAddToSpTree:
            case AscDFH.historyitem_SlideMasterAddLayout           :
            {
                AscFormat.writeLong(w, data.Pos);
                AscFormat.writeObject(w, data.Item);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetBg :
            case AscDFH.historyitem_SlideMasterSetTxStyles         :
            {
                data.newPr.Write_ToBinary(w);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetCSldName         :
            {
                AscFormat.writeString(w, data.newPr);
                break;
            }

            case AscDFH.historyitem_SlideMasterSetTheme :
            case AscDFH.historyitem_SlideMasterSetClrMapOverride   :
            {
                AscFormat.writeObject(w, data.newPr);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetThemeIndex:
            {
                AscFormat.writeLong(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case AscDFH.historyitem_SlideMasterSetSize:
            {
                this.Width  = AscFormat.readDouble(r);
                this.Height = AscFormat.readDouble(r);
                break;
            }
            case AscDFH.historyitem_SlideMasterAddToSpTree:
            {
                var Pos = AscFormat.readLong(r);
                var Item = AscFormat.readObject(r);
                this.cSld.spTree.splice(Pos, 0, Item);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTheme :
            {
                this.Theme = AscFormat.readObject(r);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetBg               :
            {
                this.cSld.Bg = new AscFormat.CBg();
                this.cSld.Bg.Read_FromBinary(r);
                var Fill;
                if(this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill)
                {
                    Fill = this.cSld.Bg.bgPr.Fill;
                }
                if(typeof AscCommon.CollaborativeEditing !== "undefined")
                {
                    if(Fill && Fill.fill && Fill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP && typeof Fill.fill.RasterImageId === "string" && Fill.fill.RasterImageId.length > 0)
                    {
                        AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(Fill.fill.RasterImageId));
                    }
                }
                break;
            }
            case AscDFH.historyitem_SlideMasterSetTxStyles         :
            {
                this.txStyles = new AscFormat.CTextStyles();
                this.txStyles.Read_FromBinary(r);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetCSldName         :
            {
                this.cSld.name = AscFormat.readString(r);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetClrMapOverride   :
            {
                this.clrMap = AscFormat.readObject(r);
                break;
            }
            case AscDFH.historyitem_SlideMasterAddLayout           :
            {
                var Pos = AscFormat.readLong(r);
                var Item = AscFormat.readObject(r);
                this.sldLayoutLst.splice(Pos, 0, Item);
                break;
            }
            case AscDFH.historyitem_SlideMasterSetThemeIndex:
            {
                this.ThemeIndex = AscFormat.readLong(r);
                if (AscFormat.isRealNumber(this.ThemeIndex) && editor && editor.ThemeLoader)
                {
                    var theme_loader = editor.ThemeLoader;

                    var theme_load_info = new CThemeLoadInfo();
                    theme_load_info.Master = this;
                    theme_load_info.Theme = this.Theme;

                    var _lay_cnt = this.sldLayoutLst.length;
                    for (var i = 0; i < _lay_cnt; i++)
                        theme_load_info.Layouts[i] = this.sldLayoutLst[i];

                    theme_loader.themes_info_editor[this.ThemeIndex] = theme_load_info;
                }
                break;
            }
        }
    },

    draw: function(graphics)
    {
        for(var i=0; i < this.cSld.spTree.length; ++i)
        {
            if(!this.cSld.spTree[i].isPlaceholder())
                this.cSld.spTree[i].draw(graphics);
        }
    },



    getMatchingLayout: function(type, matchingName, cSldName, themeFlag)
    {
        var layoutType = type;

        var _layoutName = null, _layout_index, _layout;

        if(type === AscFormat.nSldLtTTitle && !(themeFlag === true))
        {
            layoutType = AscFormat.nSldLtTObj;
        }
        if(layoutType != null)
        {
            for(var i = 0; i < this.sldLayoutLst.length; ++i)
            {
                if(this.sldLayoutLst[i].type == layoutType)
                {
                    return this.sldLayoutLst[i];
                }
            }
        }

        if(type === AscFormat.nSldLtTTitle && !(themeFlag === true))
        {
            layoutType = AscFormat.nSldLtTTx;
            for(i = 0; i < this.sldLayoutLst.length; ++i)
            {
                if(this.sldLayoutLst[i].type == layoutType)
                {
                    return this.sldLayoutLst[i];
                }
            }
        }


        if(matchingName != "" && matchingName != null)
        {
            _layoutName = matchingName;
        }
        else
        {
            if(cSldName != "" && cSldName != null)
            {
                _layoutName = cSldName;
            }
        }
        if(_layoutName != null)
        {
            var _layout_name;
            for(_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index)
            {
                _layout = this.sldLayoutLst[_layout_index];
                _layout_name = null;

                if(_layout.matchingName != null && _layout.matchingName != "")
                {
                    _layout_name = _layout.matchingName;
                }
                else
                {
                    if(_layout.cSld.name != null && _layout.cSld.name != "")
                    {
                        _layout_name = _layout.cSld.name;
                    }
                }
                if(_layout_name == _layoutName)
                {
                    return _layout;
                }
            }
        }
        for(_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index)
        {
            _layout = this.sldLayoutLst[_layout_index];
            _layout_name = null;

            if(_layout.type != AscFormat.nSldLtTTitle)
            {
                return _layout;
            }

        }

        return this.sldLayoutLst[0];
    },


    getMatchingShape:  Slide.prototype.getMatchingShape,/*function(type, idx, bSingleBody)
    {
        var _input_reduced_type;
        if(type == null)
        {
            _input_reduced_type = AscFormat.phType_body;
        }
        else
        {
            if(type == AscFormat.phType_ctrTitle)
            {
                _input_reduced_type = AscFormat.phType_title;
            }
            else
            {
                _input_reduced_type = type;
            }
        }

        var _input_reduced_index;
        if(idx == null)
        {
            _input_reduced_index = 0;
        }
        else
        {
            _input_reduced_index = idx;
        }


        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        var body_count = 0;
        var last_body;
        for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
        {
            _glyph = _sp_tree[_shape_index];
            if(_glyph.isPlaceholder())
            {
                if(_glyph instanceof CShape)
                {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if(_glyph instanceof CImageShape)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if(_glyph instanceof  CGroupShape)
                {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if(_type == null)
                {
                    _final_type = AscFormat.phType_body;
                }
                else
                {
                    if(_type == AscFormat.phType_ctrTitle)
                    {
                        _final_type = AscFormat.phType_title;
                    }
                    else
                    {
                        _final_type = _type;
                    }
                }

                if(_index == null)
                {
                    _final_index = 0;
                }
                else
                {
                    _final_index = _index;
                }

                if(_input_reduced_type == _final_type && _input_reduced_index == _final_index)
                {
                    return _glyph;
                }
                if(_input_reduced_type == AscFormat.phType_title && _input_reduced_type == _final_type)
                {
                    return _glyph;
                }
                if(AscFormat.phType_body === _type)
                {
                    ++body_count;
                    last_body = _glyph;
                }
            }
        }


        if(_input_reduced_type == AscFormat.phType_sldNum || _input_reduced_type == AscFormat.phType_dt || _input_reduced_type == AscFormat.phType_ftr || _input_reduced_type == AscFormat.phType_hdr)
        {
            for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
            {
                _glyph = _sp_tree[_shape_index];
                if(_glyph.isPlaceholder())
                {
                    if(_glyph instanceof CShape)
                    {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof CImageShape)
                    {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof  CGroupShape)
                    {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }

                    if(_input_reduced_type == _type)
                    {
                        return _glyph;
                    }
                }
            }
        }

        if(body_count === 1 && type === AscFormat.phType_body  && bSingleBody)
        {
            return last_body;
        }
        return null;
    },        */

    recalculate: function()
    {
            var _shapes = this.cSld.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
            {
                if(!_shapes[_shape_index].isPlaceholder())
                    _shapes[_shape_index].recalculate();
            }

    },

    checkSlideSize:  Slide.prototype.checkSlideSize,
    checkDrawingUniNvPr:  Slide.prototype.checkDrawingUniNvPr,
    checkSlideColorScheme: function()
    {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(!this.cSld.spTree[i].isPlaceholder())
            {
                this.cSld.spTree[i].handleUpdateFill();
                this.cSld.spTree[i].handleUpdateLn();
            }
        }
    },

    setSlideSize: function(w, h)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetSize, oldW: this.Width, oldH: this.Height, newW: w, newH: h});
        this.Width = w;
        this.Height = h;
    },

    changeSize: Slide.prototype.changeSize,

    setTheme: function(theme)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetTheme, oldPr: this.Theme, newPr: theme});
        this.Theme = theme;
    },

    shapeAdd: function(pos, item)
    {
        this.checkDrawingUniNvPr(item);
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterAddToSpTree, Pos: pos, Item: item});
        this.cSld.spTree.splice(pos, 0, item);
    },

    changeBackground: function(bg)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetBg, oldPr: this.cSld.Bg , newPr: bg});
        this.cSld.Bg = bg;
    },

    setTxStyles: function(txStyles)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetTxStyles, oldPr: this.txStyles, newPr: txStyles});
        this.txStyles = txStyles;
    },

    setCSldName: function(name)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetCSldName,oldPr: this.cSld.name, newPr: name});
        this.cSld.name = name;
    },
    setClMapOverride: function(clrMap)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterSetClrMapOverride, oldPr: this.clrMap, newPr: clrMap});
        this.clrMap = clrMap;
    },

    addToSldLayoutLstToPos: function(pos, obj)
    {
        History.Add(this, {Type: AscDFH.historyitem_SlideMasterAddLayout, Item: obj, Pos:pos});
        this.sldLayoutLst.splice(pos, 0, obj);

    },

    getAllImages: function(images)
    {
        if(this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof  AscFormat.CBlipFill && typeof this.cSld.Bg.bgPr.Fill.fill.RasterImageId === "string" )
        {
            images[AscCommon.getFullImageSrc2(this.cSld.Bg.bgPr.Fill.fill.RasterImageId)] = true;
        }
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof this.cSld.spTree[i].getAllImages === "function")
            {
                this.cSld.spTree[i].getAllImages(images);
            }
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},


    getAllFonts: function(fonts)
    {
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof  this.cSld.spTree[i].getAllFonts === "function")
                this.cSld.spTree[i].getAllFonts(fonts);
        }
    }
};

function CMasterThumbnailDrawer()
{
    this.CanvasImage    = null;
    this.IsRetina       = false;
    this.WidthMM        = 0;
    this.HeightMM       = 0;

    this.WidthPx        = 0;
    this.HeightPx       = 0;

    this.DrawingDocument = null;

    this.GetThumbnail = function(_master, use_background, use_master_shapes)
    {
        var h_px = 38;
        var w_px = 85;//(this.WidthMM * h_px / this.HeightMM) >> 0;

        // пока не будем генерить для ретины
        /*
        if (this.IsRetina)
        {
            w_px <<= 1;
            h_px <<= 1;
        }
        */

        this.WidthPx  = w_px;
        this.HeightPx = h_px;

        if (this.CanvasImage == null)
            this.CanvasImage = document.createElement('canvas');

        this.CanvasImage.width = w_px;
        this.CanvasImage.height = h_px;

        var _ctx = this.CanvasImage.getContext('2d');

        var g = new AscCommon.CGraphics();
        g.init(_ctx, w_px, h_px, this.WidthMM, this.HeightMM);
        g.m_oFontManager = AscCommon.g_fontManager;

        g.transform(1,0,0,1,0,0);

        var dKoefPixToMM = this.HeightMM / h_px;

        // background
        var _back_fill = null;
        var RGBA = {R:0, G:0, B:0, A:255};

        var _layout = null;
        for (var i = 0; i < _master.sldLayoutLst.length; i++)
        {
            if (_master.sldLayoutLst[i].type == AscFormat.nSldLtTTitle)
            {
                _layout = _master.sldLayoutLst[i];
                break;
            }
        }

        var _theme = _master.Theme;

        if (_layout != null && _layout.cSld.Bg != null)
        {
            if (null != _layout.cSld.Bg.bgPr)
                _back_fill = _layout.cSld.Bg.bgPr.Fill;
            else if(_layout.cSld.Bg.bgRef != null)
            {
                _layout.cSld.Bg.bgRef.Color.Calculate(_theme, null, _layout, _master, RGBA);
                RGBA = _layout.cSld.Bg.bgRef.Color.RGBA;
                _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx, _layout.cSld.Bg.bgRef.Color);
            }
        }
        else if (_master != null)
        {
            if (_master.cSld.Bg != null)
            {
                if (null != _master.cSld.Bg.bgPr)
                    _back_fill = _master.cSld.Bg.bgPr.Fill;
                else if(_master.cSld.Bg.bgRef != null)
                {
                    _master.cSld.Bg.bgRef.Color.Calculate(_theme, null, _layout, _master, RGBA);
                    RGBA = _master.cSld.Bg.bgRef.Color.RGBA;
                    _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx, _master.cSld.Bg.bgRef.Color);
                }
            }
            else
            {
                _back_fill = new AscFormat.CUniFill();
                _back_fill.fill = new AscFormat.CSolidFill();
                _back_fill.fill.color = new AscFormat.CUniColor();
                _back_fill.fill.color.color = new AscFormat.CRGBColor();
                _back_fill.fill.color.color.RGBA = {R:255, G:255, B:255, A:255};
            }
        }

        if (_back_fill != null)
            _back_fill.calculate(_theme, null, _layout, _master, RGBA);

        if (use_background !== false)
            DrawBackground(g, _back_fill, this.WidthMM, this.HeightMM);

        var _sx = g.m_oCoordTransform.sx;
        var _sy = g.m_oCoordTransform.sy;

        if (use_master_shapes !== false)
        {
            if (null == _layout)
            {
                _master.draw(g);
            }
            else
            {
                if (_layout.showMasterSp == true || _layout.showMasterSp == undefined)
                {
                    _master.draw(g);
                }
                _layout.draw(g);
            }
        }

        g.reset();
        g.SetIntegerGrid(true);

        // цвета
        var _color_w = 6;
        var _color_h = 3;
        var _color_x = 4;
        var _text_x = 8 * dKoefPixToMM;
        var _text_y = (h_px - 10) * dKoefPixToMM;
        var _color_y = 31;
        var _color_delta = 1;

        _ctx.beginPath();
        _ctx.fillStyle = "#FFFFFF";
        _ctx.fillRect(_color_x - _color_delta, _color_y - _color_delta, _color_w * 6 + 7 * _color_delta, 5);
        _ctx.beginPath();

        var _color = new AscFormat.CSchemeColor();
        for (var i = 0; i < 6; i++)
        {
            _ctx.beginPath();
            _color.id = i;
            _color.Calculate(_theme, null, null, _master, RGBA);
            g.b_color1(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B, 255);

            _ctx.fillRect(_color_x, _color_y, _color_w, _color_h);
            _color_x += (_color_w + _color_delta);
        }
        _ctx.beginPath();

        // text
        var _api = this.DrawingDocument.m_oWordControl.m_oApi;

        History.TurnOff();
        var _oldTurn = _api.isViewMode;
        _api.isViewMode = true;

        _color.id = 15;
        _color.Calculate(_theme, null, null, _master, RGBA);

        var _textPr1 = new CTextPr();
        _textPr1.FontFamily = { Name : _theme.themeElements.fontScheme.majorFont.latin, Index : -1 };
        _textPr1.FontSize = 18;
        _textPr1.Color = new CDocumentColor(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B);
        var _textPr2 = new CTextPr();
        _textPr2.FontFamily = { Name : _theme.themeElements.fontScheme.minorFont.latin, Index : -1 };
        _textPr2.FontSize = 18;
        _textPr2.Color = new CDocumentColor(_color.RGBA.R, _color.RGBA.G, _color.RGBA.B);


        /*
        *   var docContent = new CDocumentContent(this.m_oWordControl.m_oLogicDocument, this.m_oWordControl.m_oDrawingDocument, 0, 0,1000, 1000, false, false, true);
         var par = docContent.Content[0];

         par.Cursor_MoveToStartPos();

         par.Set_Pr(new CParaPr());
         var _textPr = new CTextPr();
         _textPr.FontFamily = { Name : "Arial", Index : -1 };

         _textPr.Strikeout  = this.GuiLastTextProps.Strikeout;

         if (true === this.GuiLastTextProps.Subscript)
         _textPr.VertAlign  = vertalign_SubScript;
         else if (true === this.GuiLastTextProps.Superscript)
         _textPr.VertAlign  = vertalign_SuperScript;
         else
         _textPr.VertAlign = vertalign_Baseline;

         _textPr.DStrikeout = this.GuiLastTextProps.DStrikeout;
         _textPr.Caps       = this.GuiLastTextProps.AllCaps;
         _textPr.SmallCaps  = this.GuiLastTextProps.SmallCaps;

         _textPr.Spacing    = this.GuiLastTextProps.TextSpacing;
         _textPr.Position   = this.GuiLastTextProps.Position;

         var parRun = new ParaRun(par); var Pos = 0;
         parRun.Set_Pr(_textPr);
         parRun.Add_ToContent(Pos++,new ParaText("H"), false);
         parRun.Add_ToContent(Pos++,new ParaText("e"), false);
         parRun.Add_ToContent(Pos++,new ParaText("l"), false);
         parRun.Add_ToContent(Pos++,new ParaText("l"), false);
         parRun.Add_ToContent(Pos++,new ParaText("o"), false);
         parRun.Add_ToContent(Pos++,new ParaSpace(1), false);
         parRun.Add_ToContent(Pos++, new ParaText("W"), false);
         parRun.Add_ToContent(Pos++, new ParaText("o"), false);
         parRun.Add_ToContent(Pos++, new ParaText("r"), false);
         parRun.Add_ToContent(Pos++, new ParaText("l"), false);
         parRun.Add_ToContent(Pos++, new ParaText("d"), false);
         par.Add_ToContent(0, parRun);

         docContent.Recalculate_Page(0, true);

         * */

        var docContent = new AscCommon.CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0,1000, 1000, false, false, true);
        var par = docContent.Content[0];
        par.Cursor_MoveToStartPos();
        var _paraPr = new CParaPr();
        par.Pr = _paraPr;
        var parRun = new ParaRun(par);
        parRun.Set_Pr(_textPr1);
        parRun.Add_ToContent(0, new ParaText("A"), false);
        par.Add_ToContent(0, parRun);
        parRun = new ParaRun(par);
        parRun.Set_Pr(_textPr2);
        parRun.Add_ToContent(0, new ParaText("a"), false);
        par.Add_ToContent(1, parRun);

        par.Recalculate_Page(0);

        // сбрасываем дпи
        g.init(_ctx, w_px, h_px, w_px * AscCommon.g_dKoef_pix_to_mm,  h_px * AscCommon.g_dKoef_pix_to_mm);
        g.CalculateFullTransform();
        _text_x = 8 * AscCommon.g_dKoef_pix_to_mm;
        _text_y = (h_px - 11) * AscCommon.g_dKoef_pix_to_mm;

        par.Lines[0].Ranges[0].XVisible = _text_x;
        par.Lines[0].Y = _text_y;

        var old_marks = _api.ShowParaMarks;
        _api.ShowParaMarks = false;

        par.Draw(0, g);
        _api.ShowParaMarks = old_marks;

        History.TurnOn();
        _api.isViewMode = _oldTurn;

        try
        {
            return this.CanvasImage.toDataURL("image/png");
        }
        catch (err)
        {
            this.CanvasImage = null;
            if (undefined === use_background && undefined === use_master_shapes)
                return this.GetThumbnail(_master, true, false);
            else if (use_background && !use_master_shapes)
                return this.GetThumbnail(_master, false, false);
        }
        return "";
    }
}