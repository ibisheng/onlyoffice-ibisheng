/** @define {boolean} */
var ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT = true;

var bIsLocalFontsUse = false;

function _is_support_cors()
{
    var xhrSupported = new XMLHttpRequest();
    return !!xhrSupported && ("withCredentials" in xhrSupported);
}
var bIsSupportOriginalFormatFonts = _is_support_cors();

function postLoadScript(scriptName)
{
    window.postMessage({type: "FROM_PAGE_LOAD_SCRIPT", text: scriptName}, "*");
}

/*window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_SCRIPT_LOAD_SCRIPT"))
    {
        var _mess = event.data.text;
        var _files = window.g_font_files;

        // потом сделать мап, при первом обращении
        for (var i = 0; i < _files.length; i++)
        {
            if (_files[i].Id == _mess)
            {
                var bIsUseOrigF = false;
                if (ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT && // проставляется в true на этапе сборки
                    _files[i].CanUseOriginalFormat && // false if load embedded fonts
                    bIsSupportOriginalFormatFonts) // false if work on ie9
                    bIsUseOrigF = true;

                if (!bIsUseOrigF)
                {
                    _files[i]._callback_font_load();
                }
                else
                {
                    bIsLocalFontsUse = false;
                    _files[i].LoadFontAsync(event.data.src, null);
                    bIsLocalFontsUse = true;
                }

                break;
            }

        }
    }
    else if (event.data.type && (event.data.type == "FROM_SCRIPT_IS_EXIST"))
    {
        bIsLocalFontsUse = true;
    }
}, false);*/

function CFontFileLoader(id)
{
    this.Id         = id;
    this.Status     = -1;  // -1 - notloaded, 0 - loaded, 1 - error, 2 - loading
    this.stream_index = -1;
    this.callback = null;
    this.IsNeedAddJSToFontPath = true;

    this.CanUseOriginalFormat = true;

    var oThis = this;

    this.CheckLoaded = function()
    {
        return (0 == this.Status || 1 == this.Status);
    }


    this.LoadFontAsync = function(basePath, _callback)
    {
        if (ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT && // проставляется в true на этапе сборки
			this.CanUseOriginalFormat && // false if load embedded fonts
			bIsSupportOriginalFormatFonts && // false if work on ie9
			!window["qtDocBridge"] && // document editor desktop version
			!window["scriptBridge"]) // table editor desktop version
        {
            this.LoadFontAsync2(basePath, _callback);
            return;
        }

        this.callback = _callback;
        if (-1 != this.Status)
            return true;

        this.Status = 2;
        if (bIsLocalFontsUse)
        {
            postLoadScript(this.Id);
            return;
        }

        var scriptElem = document.createElement('script');

        if (scriptElem.readyState && false)
        {
            scriptElem.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                {
                    scriptElem.onreadystatechange = null;
                    setTimeout(oThis._callback_font_load, 0);
                }
            }
        }
        scriptElem.onload = scriptElem.onerror = oThis._callback_font_load;

        if (this.IsNeedAddJSToFontPath)
            scriptElem.setAttribute('src', basePath + "js/" + this.Id + ".js");
        else
            scriptElem.setAttribute('src', basePath + this.Id + ".js");
        scriptElem.setAttribute('type','text/javascript');
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
        return false;
    }

    this._callback_font_load = function()
    {
        if (!window[oThis.Id])
            oThis.Status = 1;

        var __font_data_idx = g_fonts_streams.length;
        g_fonts_streams[__font_data_idx] = CreateFontData4(window[oThis.Id]);
        oThis.SetStreamIndex(__font_data_idx);

        oThis.Status = 0;

        // удаляем строку
        delete window[oThis.Id];

        if (null != oThis.callback)
            oThis.callback();
    }

    this.LoadFontAsync2 = function(basePath, _callback)
    {
        this.callback = _callback;
        if (-1 != this.Status)
            return true;

        if (bIsLocalFontsUse)
        {
            postLoadScript(this.Id);
            return;
        }
        this.Status = 2;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', basePath + "native/" + this.Id, true); // TODO:

        if (typeof ArrayBuffer !== 'undefined' && !window.opera)
            xhr.responseType = 'arraybuffer';

        if (xhr.overrideMimeType)
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        else
            xhr.setRequestHeader('Accept-Charset', 'x-user-defined');

        xhr.onload = function()
        {
            if (this.status != 200)
            {
                oThis.Status = 1;
                return;
            }

            oThis.Status = 0;

            if (typeof ArrayBuffer !== 'undefined' && !window.opera && this.response)
            {
                var __font_data_idx = g_fonts_streams.length;
                var _uintData = new Uint8Array(this.response);
                g_fonts_streams[__font_data_idx] = new FT_Stream(_uintData, _uintData.length);
                oThis.SetStreamIndex(__font_data_idx);
            }
            else if (AscBrowser.isIE)
            {
                var _response = new VBArray(this["responseBody"]).toArray();

                var srcLen = _response.length;
                var pointer = g_memory.Alloc(srcLen);
                var stream = new FT_Stream(pointer.data, srcLen);
                stream.obj = pointer.obj;

                var dstPx = stream.data;
                var index = 0;

                while (index < srcLen)
                {
                    dstPx[index] = _response[index];
                    index++;
                }

                var __font_data_idx = g_fonts_streams.length;
                g_fonts_streams[__font_data_idx] = stream;
                oThis.SetStreamIndex(__font_data_idx);
            }
            else
            {
                var __font_data_idx = g_fonts_streams.length;
                g_fonts_streams[__font_data_idx] = CreateFontData3(this.responseText);
                oThis.SetStreamIndex(__font_data_idx);
            }
        };

        xhr.send(null);
    }
}

CFontFileLoader.prototype.SetStreamIndex = function(index)
{
	this.stream_index = index;
}

var FONT_TYPE_ADDITIONAL = 0;
var FONT_TYPE_STANDART = 1;
var FONT_TYPE_EMBEDDED = 2;
var FONT_TYPE_ADDITIONAL_CUT = 3;

var fontstyle_mask_regular = 1;
var fontstyle_mask_italic = 2;
var fontstyle_mask_bold = 4;
var fontstyle_mask_bolditalic = 8;

function GenerateMapId(api, name, style, size)
{
    var fontInfo = api.FontLoader.fontInfos[api.FontLoader.map_font_index[name]];
    var index = -1;

    // ��������� ����� �� �����
    var bNeedBold   = false;
    var bNeedItalic = false;

    var index       = -1;
    var faceIndex   = 0;

    var bSrcItalic  = false;
    var bSrcBold    = false;

    switch (style)
    {
        case FontStyle.FontStyleBoldItalic:
        {
            bSrcItalic  = true;
            bSrcBold    = true;

            bNeedBold   = true;
            bNeedItalic = true;
            if (-1 != fontInfo.indexBI)
            {
                index = fontInfo.indexBI;
                faceIndex = fontInfo.faceIndexBI;
                bNeedBold   = false;
                bNeedItalic = false;
            }
            else if (-1 != fontInfo.indexB)
            {
                index = fontInfo.indexB;
                faceIndex = fontInfo.faceIndexB;
                bNeedBold = false;
            }
            else if (-1 != fontInfo.indexI)
            {
                index = fontInfo.indexI;
                faceIndex = fontInfo.faceIndexI;
                bNeedItalic = false;
            }
            else
            {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            }
            break;
        }
        case FontStyle.FontStyleBold:
        {
            bSrcBold    = true;

            bNeedBold   = true;
            bNeedItalic = false;
            if (-1 != fontInfo.indexB)
            {
                index = fontInfo.indexB;
                faceIndex = fontInfo.faceIndexB;
                bNeedBold = false;
            }
            else if (-1 != fontInfo.indexR)
            {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            }
            else if (-1 != fontInfo.indexBI)
            {
                index = fontInfo.indexBI;
                faceIndex = fontInfo.faceIndexBI;
                bNeedBold = false;
            }
            else
            {
                index = fontInfo.indexI;
                faceIndex = fontInfo.faceIndexI;
            }
            break;
        }
        case FontStyle.FontStyleItalic:
        {
            bSrcItalic  = true;

            bNeedBold   = false;
            bNeedItalic = true;
            if (-1 != fontInfo.indexI)
            {
                index = fontInfo.indexI;
                faceIndex = fontInfo.faceIndexI;
                bNeedItalic = false;
            }
            else if (-1 != fontInfo.indexR)
            {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            }
            else if (-1 != fontInfo.indexBI)
            {
                index = fontInfo.indexBI;
                faceIndex = fontInfo.faceIndexBI;
                bNeedItalic = false;
            }
            else
            {
                index = fontInfo.indexB;
                faceIndex = fontInfo.faceIndexB;
            }
            break;
        }
        case FontStyle.FontStyleRegular:
        {
            bNeedBold   = false;
            bNeedItalic = false;
            if (-1 != fontInfo.indexR)
            {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            }
            else if (-1 != fontInfo.indexI)
            {
                index = fontInfo.indexI;
                faceIndex = fontInfo.faceIndexI;
            }
            else if (-1 != fontInfo.indexB)
            {
                index = fontInfo.indexB;
                faceIndex = fontInfo.faceIndexB;
            }
            else
            {
                index = fontInfo.indexBI;
                faceIndex = fontInfo.faceIndexBI;
            }
        }
    }

    var _ext = "";
    if (bNeedBold)
        _ext += "nbold";
    if (bNeedItalic)
        _ext += "nitalic";

    // index != -1 (!!!)
    var fontfile = api.FontLoader.fontFiles[index];
    return fontfile.Id + faceIndex + size + _ext;
}

function CFontInfo(sName, thumbnail, type, indexR, faceIndexR, indexI, faceIndexI, indexB, faceIndexB, indexBI, faceIndexBI)
{
    this.Name = sName;
    this.Thumbnail = thumbnail;
    this.Type = type;
    this.NeedStyles = 0;

    this.indexR     = indexR;
    this.faceIndexR = faceIndexR;
    this.needR      = false;

    this.indexI     = indexI;
    this.faceIndexI = faceIndexI;
    this.needI      = false;

    this.indexB     = indexB;
    this.faceIndexB = faceIndexB;
    this.needB      = false;

    this.indexBI    = indexBI;
    this.faceIndexBI= faceIndexBI;
    this.needBI     = false;
}

CFontInfo.prototype =
{
    CheckFontLoadStyles : function(global_loader)
    {
        if ((this.NeedStyles & 0x0F) == 0x0F)
        {
            this.needR = true;
            this.needI = true;
            this.needB = true;
            this.needBI = true;
        }
        else
        {
            if ((this.NeedStyles & 1) != 0)
            {
                // ����� ����� regular
                if (false === this.needR)
                {
                    this.needR = true;
                    if (-1 == this.indexR)
                    {
                        if (-1 != this.indexI)
                        {
                            this.needI = true;
                        }
                        else if (-1 != this.indexB)
                        {
                            this.needB = true;
                        }
                        else
                        {
                            this.needBI = true;
                        }
                    }
                }
            }
            if ((this.NeedStyles & 2) != 0)
            {
                // ����� ����� italic
                if (false === this.needI)
                {
                    this.needI = true;
                    if (-1 == this.indexI)
                    {
                        if (-1 != this.indexR)
                        {
                            this.needR = true;
                        }
                        else if (-1 != this.indexBI)
                        {
                            this.needBI = true;
                        }
                        else
                        {
                            this.needB = true;
                        }
                    }
                }
            }
            if ((this.NeedStyles & 4) != 0)
            {
                // нужен стиль bold
                if (false === this.needB)
                {
                    this.needB = true;
                    if (-1 == this.indexB)
                    {
                        if (-1 != this.indexR)
                        {
                            this.needR = true;
                        }
                        else if (-1 != this.indexBI)
                        {
                            this.needBI = true;
                        }
                        else
                        {
                            this.needI = true;
                        }
                    }
                }
            }
            if ((this.NeedStyles & 8) != 0)
            {
                // нужен стиль bold
                if (false === this.needBI)
                {
                    this.needBI = true;
                    if (-1 == this.indexBI)
                    {
                        if (-1 != this.indexB)
                        {
                            this.needB = true;
                        }
                        else if (-1 != this.indexI)
                        {
                            this.needI = true;
                        }
                        else
                        {
                            this.needR = true;
                        }
                    }
                }
            }
        }

        var fonts = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFontFiles : global_loader.fontFiles;
        var basePath = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFilesPath : global_loader.fontFilesPath;
        var isNeed = false;
        if ((this.needR === true) && (-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false))
        {
            fonts[this.indexR].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needI === true) && (-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false))
        {
            fonts[this.indexI].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needB === true) && (-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false))
        {
            fonts[this.indexB].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needBI === true) && (-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false))
        {
            fonts[this.indexBI].LoadFontAsync(basePath, null);
            isNeed = true;
        }

        return isNeed;
    },

    CheckFontLoadStylesNoLoad : function(global_loader)
    {
        var fonts = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFontFiles : global_loader.fontFiles;
        var _isNeed = false;
        if ((-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false))
        {
            _isNeed = true;
        }
        if ((-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false))
        {
            _isNeed = true;
        }
        if ((-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false))
        {
            _isNeed = true;
        }
        if ((-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false))
        {
            _isNeed = true;
        }

        return _isNeed;
    },

    LoadFontsFromServer : function(global_loader)
    {
        var fonts = global_loader.fontFiles;
        var basePath = global_loader.fontFilesPath;
        if ((-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false))
        {
            fonts[this.indexR].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false))
        {
            fonts[this.indexI].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false))
        {
            fonts[this.indexB].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false))
        {
            fonts[this.indexBI].LoadFontAsync(basePath, null);
        }
    },

    LoadFont : function(font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform)
    {
        // сначала нужно проверить на обрезанный шрифт
        var _embedded_cur = g_font_loader.embedded_cut_manager;
        if (_embedded_cur.bIsCutFontsUse)
        {
            if (this.Type != FONT_TYPE_ADDITIONAL_CUT)
            {
                var _font_info = _embedded_cur.map_name_cutindex[this.Name];

                if (_font_info !== undefined)
                {
                    return _font_info.LoadFont(g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
                }
            }
        }

        // подбираем шрифт по стилю
        var sReturnName = this.Name;
        var bNeedBold   = false;
        var bNeedItalic = false;

        var index       = -1;
        var faceIndex   = 0;

        var bSrcItalic  = false;
        var bSrcBold    = false;

        switch (lStyle)
        {
            case FontStyle.FontStyleBoldItalic:
            {
                bSrcItalic  = true;
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = true;
                if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold   = false;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                break;
            }
            case FontStyle.FontStyleBold:
            {
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = false;
                if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold = false;
                }
                else
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                break;
            }
            case FontStyle.FontStyleItalic:
            {
                bSrcItalic  = true;

                bNeedBold   = false;
                bNeedItalic = true;
                if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                break;
            }
            case FontStyle.FontStyleRegular:
            {
                bNeedBold   = false;
                bNeedItalic = false;
                if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                else
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                }
            }
        }

        // index != -1 (!!!)
        var fontfile = null;
        if (this.Type == FONT_TYPE_EMBEDDED)
            fontfile = font_loader.embeddedFontFiles[index];
        else if (this.Type == FONT_TYPE_ADDITIONAL_CUT)
            fontfile = font_loader.embedded_cut_manager.font_files[index];
        else
            fontfile = font_loader.fontFiles[index];

        if (fontfile.Status != 0 && (this.Type == FONT_TYPE_STANDART || this.Type == FONT_TYPE_ADDITIONAL) &&
            null != _embedded_cur.map_name_cutindex && undefined !== _embedded_cur.map_name_cutindex[this.Name])
        {
            // нормальный шрифт пока не подгрузился... берем обрезанный
            var _font_info = _embedded_cur.map_name_cutindex[this.Name];

            if (_font_info !== undefined)
            {
                return _font_info.LoadFont(g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
            }
        }

        var _ext = "";
        if (bNeedBold)
            _ext += "nbold";
        if (bNeedItalic)
            _ext += "nitalic";

        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize, _ext);

        if (!pFontFile)
            pFontFile = fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic);
        else
            pFontFile.SetDefaultFont(fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic));

        if (!pFontFile)
            return false;

        pFontFile.m_oFontManager = fontManager;

        fontManager.m_pFont = pFontFile;
        pFontFile.SetNeedBold(bNeedBold);
        pFontFile.SetItalic(bNeedItalic);

        var _fEmSize = fontManager.UpdateSize(fEmSize, dVerDpi, dVerDpi);
        pFontFile.SetSizeAndDpi(_fEmSize, dHorDpi, dVerDpi);

        pFontFile.SetStringGID(fontManager.m_bStringGID);
        pFontFile.SetUseDefaultFont(fontManager.m_bUseDefaultFont);
        pFontFile.SetCharSpacing(fontManager.m_fCharSpacing);

        fontManager.m_oGlyphString.ResetCTM();
        if (undefined !== transform)
        {
            fontManager.SetTextMatrix2(transform.sx,transform.shy,transform.shx,transform.sy,transform.tx,transform.ty);
        }
        else
        {
            fontManager.SetTextMatrix(1, 0, 0, 1, 0, 0);
        }

        fontManager.AfterLoad();
    },

    GetFontID : function(font_loader, lStyle)
    {
        // подбираем шрифт по стилю
        var sReturnName = this.Name;
        var bNeedBold   = false;
        var bNeedItalic = false;

        var index       = -1;
        var faceIndex   = 0;

        var bSrcItalic  = false;
        var bSrcBold    = false;

        switch (lStyle)
        {
            case FontStyle.FontStyleBoldItalic:
            {
                bSrcItalic  = true;
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = true;
                if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold   = false;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                break;
            }
            case FontStyle.FontStyleBold:
            {
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = false;
                if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedBold = false;
                }
                else
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                break;
            }
            case FontStyle.FontStyleItalic:
            {
                bSrcItalic  = true;

                bNeedBold   = false;
                bNeedItalic = true;
                if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                    bNeedItalic = false;
                }
                else if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexBI)
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                    bNeedItalic = false;
                }
                else
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                break;
            }
            case FontStyle.FontStyleRegular:
            {
                bNeedBold   = false;
                bNeedItalic = false;
                if (-1 != this.indexR)
                {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                }
                else if (-1 != this.indexI)
                {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                }
                else if (-1 != this.indexB)
                {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                }
                else
                {
                    index = this.indexBI;
                    faceIndex = this.faceIndexBI;
                }
            }
        }

        // index != -1 (!!!)
        var fontfile = (this.Type == FONT_TYPE_EMBEDDED) ? font_loader.embeddedFontFiles[index] : font_loader.fontFiles[index];
        return { id: fontfile.Id, faceIndex : faceIndex };
    }
}

// здесь если type == FONT_TYPE_EMBEDDED, то thumbnail - это base64 картинка,
// иначе - это позиция (y) в общем табнейле всех шрифтов (ADDITIONAL и STANDART)
function CFont(name, id, type, thumbnail, style)
{
    this.name = name;
    this.id = id;
    this.type = type;
    this.thumbnail = thumbnail;
    if(null != style)
        this.NeedStyles = style;
    else
        this.NeedStyles = fontstyle_mask_regular | fontstyle_mask_italic | fontstyle_mask_bold | fontstyle_mask_bolditalic;
}

var ImageLoadStatus =
{
    Loading : 0,
    Complete : 1
}

function CImage(src)
{
    this.src    = src;
    this.Image  = null;
    this.Status = ImageLoadStatus.Complete;
}

// ALL_FONTS_PART -------------------------------------------------------------
(function(document){

    var __len_files = window["__fonts_files"].length;

    window.g_font_files = new Array(__len_files);
    for (var i = 0; i < __len_files; i++)
    {
        window.g_font_files[i] = new CFontFileLoader(window["__fonts_files"][i]);
    }

    var __len_infos = window["__fonts_infos"].length;

    window.g_font_infos = new Array(__len_infos);
    window.g_map_font_index = {};

    for (var i = 0; i < __len_infos; i++)
    {
        var _info = window["__fonts_infos"][i];
        window.g_font_infos[i] = new CFontInfo(_info[0], i, 0, _info[1], _info[2], _info[3], _info[4], _info[5], _info[6], _info[7], _info[8]);
        window.g_map_font_index[_info[0]] = i;
    }

    // удаляем временные переменные
    delete window["__fonts_files"];
    delete window["__fonts_infos"];

})(window.document);

var charA = "A".charCodeAt(0);
var charZ = "Z".charCodeAt(0);
var chara = "a".charCodeAt(0);
var charz = "z".charCodeAt(0);
var char0 = "0".charCodeAt(0);
var char9 = "9".charCodeAt(0);
var charp = "+".charCodeAt(0);
var chars = "/".charCodeAt(0);

function DecodeBase64Char(ch)
{
    if (ch >= charA && ch <= charZ)
        return ch - charA + 0;
    if (ch >= chara && ch <= charz)
        return ch - chara + 26;
    if (ch >= char0 && ch <= char9)
        return ch - char0 + 52;
    if (ch == charp)
        return 62;
    if (ch == chars)
        return 63;
    return -1;
}

var b64_decode = new Array();
for (var i = charA; i <= charZ; i++)
    b64_decode[i] = i - charA + 0;
for (var i = chara; i <= charz; i++)
    b64_decode[i] = i - chara + 26;
for (var i = char0; i <= char9; i++)
    b64_decode[i] = i - char0 + 52;
b64_decode[charp] = 62;
b64_decode[chars] = 63;

function DecodeBase64(imData, szSrc)
{
    var srcLen = szSrc.length;
    var nWritten = 0;

    var dstPx = imData.data;
    var index = 0;

    if (window.chrome)
    {
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    else
    {
        var p = b64_decode;
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
}

function CreateFontData2(szSrc, dstLen)
{
    var srcLen = szSrc.length;
    var nWritten = 0;

    if (dstLen === undefined)
        dstLen = srcLen;

    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;

    var dstPx = stream.data;
    var index = 0;

    if (window.chrome)
    {
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    else
    {
        var p = b64_decode;
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }

    return stream;
}

function CreateFontData3(szSrc)
{
    var srcLen = szSrc.length;
    var nWritten = 0;

    var pointer = g_memory.Alloc(srcLen);
    var stream = new FT_Stream(pointer.data, srcLen);
    stream.obj = pointer.obj;

    var dstPx = stream.data;
    var index = 0;

    while (index < srcLen)
    {
        dstPx[index] = (szSrc.charCodeAt(index) & 0xFF);
        index++;
    }

    return stream;
}

function CreateFontData4(szSrc)
{
    var srcLen = szSrc.length;
    var nWritten = 0;

    var index = 0;
    var dst_len = "";
    while (true)
    {
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0))
            break;

        dst_len += String.fromCharCode(_c);
        index++;
    }

    index++;
    var dstLen = parseInt(dst_len);

    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;

    var dstPx = stream.data;

    if (window.chrome)
    {
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    else
    {
        var p = b64_decode;
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }

    return stream;
}


var g_fonts_streams = new Array();
// сначала хотел писать "вытеснение" из этого мапа.
// но тогда нужно хранить base64 строки. Это не круто. По памяти - даже
// выигрыш будет. Не особо то шрифты жмутся lzw или deflate
// поэтому лучше из памяти будем удалять base64 строки
// ----------------------------------------------------------------------------