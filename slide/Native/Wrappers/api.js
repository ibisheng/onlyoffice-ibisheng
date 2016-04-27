var global_memory_stream_menu = CreateNativeMemoryStream();
// endsectionPr -----------------------------------------------------------------------------------------

// font engine -------------------------------------
var FontStyle =
{
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};

function CFontManager()
{
    this.m_oLibrary = {};
    this.Initialize = function(){};
}

function CStylesPainter()
{
    this.STYLE_THUMBNAIL_WIDTH  = GlobalSkin.STYLE_THUMBNAIL_WIDTH;
    this.STYLE_THUMBNAIL_HEIGHT = GlobalSkin.STYLE_THUMBNAIL_HEIGHT;

    this.CurrentTranslate = null;
    this.IsRetinaEnabled = false;

    this.defaultStyles = [];
    this.docStyles = [];
    this.mergedStyles = [];
}
CStylesPainter.prototype =
{
    GenerateStyles: function(_api, ds)
    {
        if (_api.WordControl.bIsRetinaSupport)
        {
            this.STYLE_THUMBNAIL_WIDTH  <<= 1;
            this.STYLE_THUMBNAIL_HEIGHT <<= 1;
            this.IsRetinaEnabled = true;
        }

        this.CurrentTranslate = _api.CurrentTranslate;

        var _stream = global_memory_stream_menu;
        var _graphics = new CDrawingStream();

        _api.WordControl.m_oDrawingDocument.Native["DD_PrepareNativeDraw"]();

        this.GenerateDefaultStyles(_api, ds, _graphics);
        this.GenerateDocumentStyles(_api, _graphics);

        // стили сформированы. осталось просто сформировать единый список
        var _count_default = this.defaultStyles.length;
        var _count_doc = 0;
        if (null != this.docStyles)
            _count_doc = this.docStyles.length;

        var aPriorityStyles = [];
        var fAddToPriorityStyles = function(style){
            var index = style.Style.uiPriority;
            if(null == index)
                index = 0;
            var aSubArray = aPriorityStyles[index];
            if(null == aSubArray)
            {
                aSubArray = [];
                aPriorityStyles[index] = aSubArray;
            }
            aSubArray.push(style);
        };
        var _map_document = {};

        for (var i = 0; i < _count_doc; i++)
        {
            var style = this.docStyles[i];
            _map_document[style.Name] = 1;
            fAddToPriorityStyles(style);
        }

        for (var i = 0; i < _count_default; i++)
        {
            var style = this.defaultStyles[i];
            if(null == _map_document[style.Name])
                fAddToPriorityStyles(style);
        }

        this.mergedStyles = [];
        for(var index in aPriorityStyles)
        {
            var aSubArray = aPriorityStyles[index];
            aSubArray.sort(function(a, b){
                if(a.Name < b.Name)
                    return -1;
                else if(a.Name > b.Name)
                    return 1;
                else
                    return 0;
            });
            for(var i = 0, length = aSubArray.length; i < length; ++i)
            {
                this.mergedStyles.push(aSubArray[i]);
            }
        }

        var _count = this.mergedStyles.length;
        for (var i = 0; i < _count; i++)
        {
            this.drawStyle(_graphics, this.mergedStyles[i].Style, _api);
        }

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](1);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
    },
    GenerateDefaultStyles: function(_api, ds, _graphics)
    {
        var styles = ds;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                this.defaultStyles.push({ Name: style.Name, Style: style });
                //this.drawStyle(_graphics, style, _api);
            }
        }
    },

    GenerateDocumentStyles: function(_api, _graphics)
    {
        if (_api.WordControl.m_oLogicDocument == null)
            return;

        var __Styles = _api.WordControl.m_oLogicDocument.Get_Styles();
        var styles = __Styles.Style;

        if (styles == null)
            return;

        for (var i in styles)
        {
            var style = styles[i];
            if (true == style.qFormat)
            {
                // как только меняется сериалайзер - меняется и код здесь. Да, не очень удобно,
                // зато быстро делается
                var formalStyle = i.toLowerCase().replace(/\s/g, "");
                var res = formalStyle.match(/^heading([1-9][0-9]*)$/);
                var index = (res) ? res[1] - 1 : -1;

                var _dr_style = __Styles.Get_Pr(i, styletype_Paragraph);
                _dr_style.Name = style.Name;
                _dr_style.Id = i;

                //this.drawStyle(_graphics, _dr_style, _api);

                var _name = _dr_style.Name;
                // алгоритм смены имени
                if (style.Default)
                {
                    switch (style.Default)
                    {
                        case 1:
                            break;
                        case 2:
                            _name = "No List";
                            break;
                        case 3:
                            _name = "Normal";
                            break;
                        case 4:
                            _name = "Normal Table";
                            break;
                    }
                }
                else if (index != -1)
                {
                    _name = "Heading ".concat(index + 1);
                }

                this.docStyles.push({ Name: _name, Style: _dr_style });
            }
        }
    },

    drawStyle: function(graphics, style, _api)
    {
        var _w_px = this.STYLE_THUMBNAIL_WIDTH;
        var _h_px = this.STYLE_THUMBNAIL_HEIGHT;
        var dKoefToMM = g_dKoef_pix_to_mm;

        if (AscCommon.AscBrowser.isRetina)
        {
            _w_px *= 2;
            _h_px *= 2;
            dKoefToMM /= 2;
        }

        _api.WordControl.m_oDrawingDocument.Native["DD_StartNativeDraw"](_w_px, _h_px, _w_px * dKoefToMM, _h_px * dKoefToMM);

        AscCommon.g_oTableId.m_bTurnOff = true;
        AscCommon.History.TurnOff();

        var oldDefTabStop = Default_Tab_Stop;
        Default_Tab_Stop = 1;

        var hdr = new CHeaderFooter(_api.WordControl.m_oLogicDocument.HdrFtr, _api.WordControl.m_oLogicDocument, _api.WordControl.m_oDrawingDocument, AscCommon.hdrftr_Header);
        var _dc = hdr.Content;//new CDocumentContent(editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, true, false);

        var par = new Paragraph(_api.WordControl.m_oDrawingDocument, _dc, 0, 0, 0, 0, false);
        var run = new ParaRun(par, false);

        for (var i = 0; i < style.Name.length; i++)
        {
            run.Add_ToContent(i, new ParaText(style.Name.charAt(i)), false);
        }

        _dc.Internal_Content_Add(0, par, false);
        par.Add_ToContent(0, run);
        par.Style_Add(style.Id, false);
        par.Set_Align(AscCommon.align_Left);
        par.Set_Tabs(new CParaTabs());

        var _brdL = style.ParaPr.Brd.Left;
        if ( undefined !== _brdL && null !== _brdL )
        {
            var brdL = new CDocumentBorder();
            brdL.Set_FromObject(_brdL);
            brdL.Space = 0;
            par.Set_Border(brdL, AscDFH.historyitem_Paragraph_Borders_Left);
        }

        var _brdT = style.ParaPr.Brd.Top;
        if ( undefined !== _brdT && null !== _brdT )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdT);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Top);
        }

        var _brdB = style.ParaPr.Brd.Bottom;
        if ( undefined !== _brdB && null !== _brdB )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdB);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Bottom);
        }

        var _brdR = style.ParaPr.Brd.Right;
        if ( undefined !== _brdR && null !== _brdR )
        {
            var brd = new CDocumentBorder();
            brd.Set_FromObject(_brdR);
            brd.Space = 0;
            par.Set_Border(brd, AscDFH.historyitem_Paragraph_Borders_Right);
        }

        var _ind = new CParaInd();
        _ind.FirstLine = 0;
        _ind.Left = 0;
        _ind.Right = 0;
        par.Set_Ind(_ind, false);

        var _sp = new CParaSpacing();
        _sp.Line              = 1;
        _sp.LineRule          = Asc.linerule_Auto;
        _sp.Before            = 0;
        _sp.BeforeAutoSpacing = false;
        _sp.After             = 0;
        _sp.AfterAutoSpacing  = false;
        par.Set_Spacing(_sp, false);

        _dc.Reset(0, 0, 10000, 10000);
        _dc.Recalculate_Page(0, true);

        _dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
        _dc.Recalculate_Page(0, true);

        var y = 0;
        var b = dKoefToMM * _h_px;
        var w = dKoefToMM * _w_px;
        var off = 10 * dKoefToMM;
        var off2 = 5 * dKoefToMM;
        var off3 = 1 * dKoefToMM;

        graphics.transform(1,0,0,1,0,0);
        graphics.save();
        graphics._s();
        graphics._m(off2, y + off3);
        graphics._l(w - off, y + off3);
        graphics._l(w - off, b - off3);
        graphics._l(off2, b - off3);
        graphics._z();
        graphics.clip();

        var baseline = par.Lines[0].Y;
        par.Shift(0, off + 0.5, y + 0.75 * (b - y) - baseline);
        par.Draw(0, graphics);

        graphics.restore();

        Default_Tab_Stop = oldDefTabStop;

        AscCommon.g_oTableId.m_bTurnOff = false;
        AscCommon.History.TurnOn();

        var _stream = global_memory_stream_menu;

        _stream["ClearNoAttack"]();

        _stream["WriteByte"](0);
        _stream["WriteString2"](style.Name);

        _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
        graphics.ClearParams();
    }
};

window["use_native_fonts_only"] = true;
// -------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;


asc_docs_api.prototype["Native_Editor_Initialize_Settings"] = function(_params)
{
    window["NativeSupportTimeouts"] = true;

    if (!_params)
        return;

    var _current = { pos : 0 };
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_current.pos++];
        switch (_attr)
        {
            case 0:
            {
                GlobalSkin.STYLE_THUMBNAIL_WIDTH = _params[_current.pos++];
                break;
            }
            case 1:
            {
                GlobalSkin.STYLE_THUMBNAIL_HEIGHT = _params[_current.pos++];
                break;
            }
            case 2:
            {
                TABLE_STYLE_WIDTH_PIX = _params[_current.pos++];
                break;
            }
            case 3:
            {
                TABLE_STYLE_HEIGHT_PIX = _params[_current.pos++];
                break;
            }
            case 4:
            {
                this.chartPreviewManager.CHART_PREVIEW_WIDTH_PIX = _params[_current.pos++];
                break;
            }
            case 5:
            {
                this.chartPreviewManager.CHART_PREVIEW_HEIGHT_PIX = _params[_current.pos++];
                break;
            }
            case 6:
            {
                var _val = _params[_current.pos++];
                if (_val === true)
                {
                    this.ShowParaMarks = false;
                    CollaborativeEditing.m_bGlobalLock = true;

                    this.isViewMode = true;
                    this.WordControl.m_oDrawingDocument.IsViewMode = true;
                }
                break;
            }
            case 100:
            {
                this.WordControl.m_oDrawingDocument.IsRetina = _params[_current.pos++];
                break;
            }
            case 101:
            {
                this.WordControl.m_oDrawingDocument.IsMobile = _params[_current.pos++];
                window.AscAlwaysSaveAspectOnResizeTrack = true;
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    AscCommon.AscBrowser.isRetina = this.WordControl.m_oDrawingDocument.IsRetina;
};



asc_docs_api.prototype["CheckSlideBounds"] = function(nSlideIndex){
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.WordControl.m_oLogicDocument.Draw(nSlideIndex, oBoundsChecker);
    var oBounds = oBoundsChecker.Bounds;
    return [
        oBounds.min_x, oBounds.max_x, oBounds.min_y, oBounds.max_y
    ]
}

asc_docs_api.prototype["GetNativePageMeta"] = function(pageIndex)
{
    this.WordControl.m_oDrawingDocument.RenderPage(pageIndex);
};

// FT_Common
function _FT_Common()
{
    this.UintToInt = function(v)
    {
        return (v>2147483647)?v-4294967296:v;
    };
    this.UShort_To_Short = function(v)
    {
        return (v>32767)?v-65536:v;
    };
    this.IntToUInt = function(v)
    {
        return (v<0)?v+4294967296:v;
    };
    this.Short_To_UShort = function(v)
    {
        return (v<0)?v+65536:v;
    };
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    };
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    };
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    };
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    };
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    };
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = memory.Alloc(new_count);
        }
        else
        {
            var block2 = memory.Alloc(new_count);
            FT_Common.memcpy_p(block2, pointer, cur_count);
            ret.block = block2;
        }
        return ret;
    };

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = CreateIntArray(new_count);
        }
        else
        {
            var block2 = CreateIntArray(new_count);
            for (var i = 0; i < cur_count; i++)
                block2[i] = pointer[i];

            ret.block = block2;
        }
        return ret;
    };
}
var FT_Common = new _FT_Common();