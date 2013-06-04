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

window.addEventListener("message", function(event) {
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
                _files[i]._callback_font_load();
                break;
            }

        }
    }
    else if (event.data.type && (event.data.type == "FROM_SCRIPT_IS_EXIST"))
    {
        bIsLocalFontsUse = true;
    }
}, false);

function CFontFileLoader(id)
{
    this.Id         = id;
    this.Status     = -1;  // -1 - notloaded, 0 - loaded, 1 - error, 2 - loading
    this.stream_index = -1;
    this.callback = null;

    this.CanUseOriginalFormat = true;

    var oThis = this;

    this.CheckLoaded = function()
    {
        return (0 == this.Status || 1 == this.Status);
    }


    this.LoadFontAsync = function(basePath, _callback)
    {
        if (ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT && this.CanUseOriginalFormat && bIsSupportOriginalFormatFonts)
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

        var _src = this.Id;
        var _srcInd = _src.indexOf(".");
        if (-1 != _srcInd)
            _src = _src.substring(0, _srcInd);

        scriptElem.setAttribute('src', basePath + _src + ".js");
        scriptElem.setAttribute('type','text/javascript');
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
        return false;
    }

    this._callback_font_load = function()
    {
        if (oThis.stream_index != -1)
            oThis.Status = 0;
        else
            oThis.Status = 1;

        if (null != oThis.callback)
            oThis.callback();
    }

    this.LoadFontAsync2 = function(basePath, _callback)
    {
        this.callback = _callback;
        if (-1 != this.Status)
            return true;

        this.Status = 2;
        if (bIsLocalFontsUse)
        {
            postLoadScript(this.Id);
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', basePath + "TrueType/" + this.Id, true); // TODO:

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
            else if (/msie/i.test(navigator.userAgent))
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

    // index != -1 (!!!)
    var fontfile = api.FontLoader.fontFiles[index];
    return fontfile.Id + faceIndex + size;
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

    this.CheckFontLoadStyles = function(global_loader)
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
    }

    this.LoadFontsFromServer = function(global_loader)
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
    }

    this.check_fonts_loaded_sync = function(global_loader)
    {
        var fonts = global_loader.fontFiles;
        var isNeed = false;
        if ((this.needR === true) && (-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false))
        {
            isNeed = true;
        }
        if ((this.needI === true) && (-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false))
        {
            isNeed = true;
        }
        if ((this.needB === true) && (-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false))
        {
            isNeed = true;
        }
        if ((this.needBI === true) && (-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false))
        {
            isNeed = true;
        }

        return isNeed;
    }

    this.LoadFont = function(font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi,transform)
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

        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize);

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
            fontManager.m_pFont.SetTextMatrix(transform.sx,transform.shy,transform.shx,transform.sy,transform.tx,transform.ty);
        }
        else
        {
            fontManager.m_pFont.SetTextMatrix(1, 0, 0, 1, 0, 0);
        }

        fontManager.AfterLoad();
    }

    this.GetFontID = function(font_loader, lStyle)
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

function CImageLoader(id)
{
    this.Id         = id;
    this.Status     = -1;  // -1 - notloaded, 0 - loaded, 1 - error, 2 - loading, 3 - imageloading
    this.Image      = null;

    var oThis = this;
    this.CheckLoaded = function()
    {
        return (0 == oThis.Status || 1 == oThis.Status);
    }
    this.LoadImageAsync = function(basePath, _callback)
    {
        this.callback = _callback;
        if (-1 != this.Status)
            return true;

        this.Status = 2;
        var scriptElem = document.createElement('script');

        if (scriptElem.readyState && false)
        {
            scriptElem.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                {
                    scriptElem.onreadystatechange = null;
                    setTimeout(oThis._callback_font_load(), 0);
                }
            }
        }
        scriptElem.onload = scriptElem.onerror = oThis._callback_font_load;

        scriptElem.setAttribute('src',basePath + this.Id + ".js");
        scriptElem.setAttribute('type','text/javascript');
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
        return false;
    }

    this._callback_font_load = function()
    {
        if (oThis.Status != 3)
            oThis.Status = 1;

        if (null != oThis.callback)
            oThis.callback();
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