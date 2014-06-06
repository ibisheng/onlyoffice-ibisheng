/** @define {boolean} */
var ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT = false;

var bIsLocalFontsUse = false;

function _is_support_cors()
{
    if (window["NATIVE_EDITOR_ENJINE"] === true)
        return false;
        
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
    
    this.LoadFontNative = function()
    {
		if (window["use_native_fonts_only"] === true)
		{
			// all font engine now native
			this.Status = 0;
			return;
		}
		
        var __font_data_idx = g_fonts_streams.length;
        var _data = window["native"]["GetFontBinary"](this.Id);
        g_fonts_streams[__font_data_idx] = new FT_Stream(_data, _data.length);
        this.SetStreamIndex(__font_data_idx);
        this.Status = 0;
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
        var _embedded_cur = window.g_font_loader.embedded_cut_manager;
        if (_embedded_cur.bIsCutFontsUse)
        {
            if (this.Type != FONT_TYPE_ADDITIONAL_CUT)
            {
                var _font_info = _embedded_cur.map_name_cutindex[this.Name];

                if (_font_info !== undefined)
                {
                    return _font_info.LoadFont(window.g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
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

        if (window["NATIVE_EDITOR_ENJINE"] === undefined)
        {
            if (fontfile.Status != 0 && (this.Type == FONT_TYPE_STANDART || this.Type == FONT_TYPE_ADDITIONAL) &&
                null != _embedded_cur.map_name_cutindex && undefined !== _embedded_cur.map_name_cutindex[this.Name])
            {
                // нормальный шрифт пока не подгрузился... берем обрезанный
                var _font_info = _embedded_cur.map_name_cutindex[this.Name];

                if (_font_info !== undefined)
                {
                    return _font_info.LoadFont(window.g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
                }
            }
        }
        else
        {
            if (fontfile.Status != 0)
            {
                fontfile.LoadFontNative();
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
        return { id: fontfile.Id, faceIndex : faceIndex, file : fontfile };
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

var g_fonts_streams = [];

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

var b64_decode = [];
(function(){
	var i;
	for (i = charA; i <= charZ; i++)
		b64_decode[i] = i - charA + 0;
	for (i = chara; i <= charz; i++)
		b64_decode[i] = i - chara + 26;
	for (i = char0; i <= char9; i++)
		b64_decode[i] = i - char0 + 52;
})();
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

    /////////////////////////////////////////////////////////////////////
    // а вот это наш шрифт - аналог wingdings3
    var _wngds3 = new CFontFileLoader("ASC.ttf");
    _wngds3.Status = 0;
    var _ind_wngds3 = g_fonts_streams.length;
    g_fonts_streams[_ind_wngds3] = CreateFontData2("AAEAAAARAQAABAAQTFRTSLRRURgAAAK0AAAAM09TLzI6A+rhAAABmAAAAGBWRE1Yb8J3OwAAAugAAAXgY21hcAAX8LEAAA2wAAAAQGN2dCBAYzlRAAAVdAAAAnhmcGdtlK49CwAADfAAAAXSZ2FzcAAXAAkAADAQAAAAEGdseWb5lSApAAAX7AAAEYBoZG14G8C9WwAACMgAAAToaGVhZAXhPlQAAAEcAAAANmhoZWEPHQR6AAABVAAAACRobXR4D30eZQAAAfgAAAC8bG9jYVQqWSQAAClsAAAAYG1heHAIdAYXAAABeAAAACBuYW1loyGViQAAKcwAAAP3cG9zdAue6lEAAC3EAAACS3ByZXDb2mChAAATxAAAAbAAAQAAAAEAAFASZh9fDzz1ABsIAAAAAADPTriwAAAAAM+3OtsAgAAABy4FyAAAAAwAAQAAAAAAAAABAAAHbP5QAAAIAACA/foHLgABAAAAAAAAAAAAAAAAAAAALwABAAAALwAXAAQAFwAEAAIAEAAUAEMAAAfoBdIAAQABAAMF5gGQAAUACATOBM4AAAMWBM4EzgAAAxYAZAMgDAAFBAECAQgHBwcHAAAAAAAAAAAAAAAAAAAAAE1TICAAQPAg8EsGKwGkADEHbAGwgAAAAAAAAAD/////AAAAIAAABAAAgAAAAAAE0gAACAAAAAchAK0HIQCtBG8AxQRvAMUFpACtBaQArQWkAK0FpACtByEArQchAK0EbwDFBG8AxQaNAK0GjQCtBG8AxQRvAMUEbwCtBG8AxQRvAK0EbwCtBG8AxQRvAMUEbwCtBG8ArQRvAK0HIQCtByEArQWvAMUFrwCUBa8AxQWvAJQH2gCtB9oArQchAK0HIQCtByEArQchAK0HIQCtByEArQchAK0HIQCtByEArQchAK0AAAAvZAEBAWRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQAAAAAAQABAQEBAQAMAPgI/wAIAAj//gAJAAj//QAKAAn//gALAAr//gAMAAv//gANAAz//QAOAA3//QAPAA7//QAQAA7//QARAA///QASABH//AATABL/+wAUABP/+wAVABT/+wAWABX/+wAXABb/+wAYABf/+wAZABj/+gAaABj/+gAbABj/+gAcABn/+wAdABr/+wAeABz/+QAfAB3/+QAgAB7/+QAhAB//+AAiACD/+QAjACH/+QAkACH/+AAlACL/+AAmACP/+AAnACT/+AAoACX/+AApACb/9wAqACj/9gArACn/9gAsACn/9gAtACr/9gAuACr/9wAvACv/9gAwACz/9gAxAC3/9gAyAC7/9gAzAC//9QA0ADD/9QA1ADH/9QA2ADP/9AA3ADT/9AA4ADT/9AA5ADX/8wA6ADb/8wA7ADf/8wA8ADj/8wA9ADn/8wA+ADn/8wA/ADr/8wBAADv/8gBBADz/8wBCAD3/8gBDAD7/8gBEAD//8QBFAED/8QBGAEH/8QBHAEL/8QBIAEP/8QBJAET/8QBKAEX/8ABLAEb/8ABMAEb/8ABNAEj/7wBOAEn/7wBPAEn/7wBQAEr/7wBRAEv/7gBSAEz/7gBTAE3/7wBUAE7/7wBVAE//7gBWAE//7gBXAFD/7gBYAFH/7gBZAFP/7QBaAFT/7ABbAFX/7ABcAFb/7ABdAFf/7ABeAFj/7ABfAFn/7ABgAFn/6wBhAFn/6wBiAFr/6wBjAFv/6wBkAFz/6wBlAF7/6gBmAF//6gBnAGD/6gBoAGH/6gBpAGL/6gBqAGL/6QBrAGP/6QBsAGT/6QBtAGX/6QBuAGb/6QBvAGf/6QBwAGj/6ABxAGr/5wByAGr/5wBzAGv/5wB0AGv/5wB1AGz/5wB2AG3/5wB3AG7/5gB4AG//5wB5AHD/5wB6AHH/5wB7AHL/5gB8AHP/5gB9AHX/5QB+AHX/5QB/AHb/5QCAAHf/5QCBAHj/5ACCAHn/5ACDAHr/5ACEAHr/5ACFAHv/5ACGAHz/5ACHAH3/5ACIAH3/4wCJAH//4gCKAID/4gCLAIH/4gCMAIL/4gCNAIP/4gCOAIT/4gCPAIX/4gCQAIb/4QCRAIf/4QCSAIf/4QCTAIj/4QCUAIr/4ACVAIr/4ACWAIv/4ACXAIz/4ACYAI3/4ACZAI7/3wCaAI//3wCbAJD/3wCcAJD/3wCdAJH/3wCeAJL/3wCfAJP/3wCgAJX/3gChAJb/3QCiAJf/3QCjAJj/3QCkAJn/3QClAJr/3QCmAJr/3QCnAJr/3QCoAJv/3ACpAJz/3ACqAJ3/3ACrAJ7/3ACsAKD/2wCtAKH/2wCuAKL/2wCvAKP/2gCwAKP/2wCxAKT/2wCyAKX/2gCzAKb/2gC0AKf/2gC1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YQBsAE4AbwByAG0AYQBsAAACAAAAAAAA/zgAZAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAAECAAIAAwEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtBE5VTEwGYTJsZWZ0B2EycmlnaHQEYTJ1cAZhMmRvd24EYTJudwRhMm5lBGEyc3cEYTJzZQlhMnRhYmxlZnQKYTJ0YWJyaWdodAdhMnRhYnVwCWEydGFiZG93bgZhMmhvbWUFYTJlbmQIYTJwYWdldXAKYTJwYWdlZG93bgthMmxlZnRyaWdodAhhMnVwZG93bgphMmxlZnRkYXNoC2EycmlnaHRkYXNoCGEydXBkYXNoCmEyZG93bmRhc2gIYTJ6aWd6YWcPYTJjb3JuZXJkd25sZWZ0DWEyY29ybmVyZHducnQOYTJjb3JuZXJ1cGxlZnQMYTJjb3JuZXJ1cHJ0DmEyY29ybmVybGVmdHVwD2EyY29ybmVycmlnaHR1cA9hMmNvcm5lcmxlZnRkd24NYTJjb3JuZXJydGR3bgpyZXR1cm5sZWZ0C3JldHVybnJpZ2h0C25ld2xpbmVsZWZ0DG5ld2xpbmVyaWdodAphMm9wbGVmdHJ0CWEyb3Bkd251cA1hMm9wdGFibGVmdHJ0DGEyb3B0YWJkd251cAthMnBhcmxsbGVmdAxhMnBhcmxscmlnaHQJYTJwYXJsbHVwC2EycGFybGxkb3duAAAAAAMACAACABAAAf//AAM=");
    _wngds3.SetStreamIndex(_ind_wngds3);
    window.g_font_files[window.g_font_files.length] = _wngds3;

    var _ind_info_wngds3 = window.g_font_infos.length;
    window.g_font_infos[_ind_info_wngds3] = new CFontInfo("ASCWngds3", 0, FONT_TYPE_ADDITIONAL, window.g_font_files.length - 1, 0, -1, -1, -1, -1, -1, -1);
    window.g_map_font_index["ASCWngds3"] = _ind_info_wngds3;
    /////////////////////////////////////////////////////////////////////

    // удаляем временные переменные
    delete window["__fonts_files"];
    delete window["__fonts_infos"];

})(window.document);

// сначала хотел писать "вытеснение" из этого мапа.
// но тогда нужно хранить base64 строки. Это не круто. По памяти - даже
// выигрыш будет. Не особо то шрифты жмутся lzw или deflate
// поэтому лучше из памяти будем удалять base64 строки
// ----------------------------------------------------------------------------

// класс для подбора шрифтов
function CFontSelect()
{
    this.m_wsFontName   = "";

    this.m_wsFontPath   = "";
    this.m_lIndex       = 0;

    this.m_bBold    = false;
    this.m_bItalic  = false;
    this.m_bIsFixed = false;

    this.m_aPanose  = null;

    if (typeof(Int8Array) != 'undefined' && !window.opera)
    {
        this.m_aPanose = new Int8Array(10);
    }
    else
    {
        this.m_aPanose = new Array(10);
    }
    this.m_ulUnicodeRange1 = 0;
    this.m_ulUnicodeRange2 = 0;
    this.m_ulUnicodeRange3 = 0;
    this.m_ulUnicodeRange4 = 0;

    this.m_ulCodePageRange1 = 0;
    this.m_ulCodePageRange2 = 0;

    this.m_usWeigth = 0;
    this.m_usWidth  = 0;

    this.m_sFamilyClass = 0;
    this.m_eFontFormat  = 0;

    this.m_shAvgCharWidth   = 0;
    this.m_shAscent         = 0;
    this.m_shDescent        = 0;
    this.m_shLineGap        = 0;
    this.m_shXHeight        = 0;
    this.m_shCapHeight      = 0;
}
CFontSelect.prototype =
{
    fromStream : function(fs)
    {
        // name
        var _len = fs.GetLong();
        this.m_wsFontName = fs.GetString(_len >> 1);

        _len = fs.GetLong();
        this.m_wsFontPath = fs.GetString(_len >> 1);
        if (1 < this.m_wsFontPath.length)
            this.m_wsFontPath = this.m_wsFontPath.substring(1);

        this.m_lIndex = fs.GetLong();

        this.m_bItalic  = (1 == fs.GetLong());
        this.m_bBold    = (1 == fs.GetLong());
        this.m_bIsFixed = (1 == fs.GetLong());

        var _panose_len = fs.GetLong(); // 10
        for (var i = 0; i < _panose_len; i++)
            this.m_aPanose[i] = fs.GetUChar();

        this.m_ulUnicodeRange1 = fs.GetULong();
        this.m_ulUnicodeRange2 = fs.GetULong();
        this.m_ulUnicodeRange3 = fs.GetULong();
        this.m_ulUnicodeRange4 = fs.GetULong();

        this.m_ulCodePageRange1 = fs.GetULong();
        this.m_ulCodePageRange2 = fs.GetULong();

        this.m_usWeigth = fs.GetUShort();
        this.m_usWidth  = fs.GetUShort();

        this.m_sFamilyClass = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_eFontFormat  = FT_Common.UShort_To_Short(fs.GetUShort());

        this.m_shAvgCharWidth   = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shAscent         = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shDescent        = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shLineGap        = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shXHeight        = FT_Common.UShort_To_Short(fs.GetUShort());
        this.m_shCapHeight      = FT_Common.UShort_To_Short(fs.GetUShort());
    }
};

function CLanguageFontSelect()
{
    this.Type   = 0;
    this.Ranges = [];
    this.CodePage1Mask = 0;
    this.CodePage2Mask = 0;
    this.DefaultFont = "Arial";

    this.FullSupportPages = false;
}

CLanguageFontSelect.prototype =
{
    checkChar : function(_code)
    {
        var _len = this.Ranges.length;
        for (var i = 0; i < _len; i += 2)
        {
            if (_code >= this.Ranges[i] && _code <= this.Ranges[i + 1])
                return true;
        }
        return false;
    }
};

var LanguagesFontSelectTypes =
{
    Unknown     : -1,
    Arabic      : 1,
    Korean      : 2,
    Japan       : 3,
    Chinese     : 4,

    EastAsiaStart   : 2,
    EastAsiaEnd     : 4
};

function CFontSelectList()
{
    this.List = new Array();
    this.ListMap = {};

    this.Languages = [];

    this.m_pRanges = null;
    this.m_pRangesNums = null;

    this.IsInit = false;
    this.CurrentLoadedObj = null;
}

function memset(p, start, val, count)
{
    var _data = p.data;
    for (var i = 0; i < count; i++)
        _data[i + start] = val;
}

CFontSelectList.prototype =
{
    fromStream : function()
    {
        if (true == this.IsInit)
            return;

        this.IsInit = true;

        // read from stream
        var _ft_stream = CreateFontData2(window["g_fonts_selection_bin"]);
        var _file_stream = new FileStream(_ft_stream.data, _ft_stream.size);

        var count = _file_stream.GetLong();
        for (var i = 0; i < count; i++)
        {
            var _fs = new CFontSelect();
            _fs.fromStream(_file_stream);
            this.List.push(_fs);
            this.ListMap[_fs.m_wsFontPath] = this.List.length - 1;
        }

        // add languages
        // 1) arabic
        var _arabic_lang = new CLanguageFontSelect();
        _arabic_lang.Type = LanguagesFontSelectTypes.Arabic;
        _arabic_lang.Ranges.push(0x0600);
        _arabic_lang.Ranges.push(0x06FF);
        _arabic_lang.Ranges.push(0x0750);
        _arabic_lang.Ranges.push(0x077F);
        _arabic_lang.Ranges.push(0x08A0);
        _arabic_lang.Ranges.push(0x08FF);
        _arabic_lang.Ranges.push(0xFB50);
        _arabic_lang.Ranges.push(0xFDFF);
        _arabic_lang.Ranges.push(0xFE70);
        _arabic_lang.Ranges.push(0xFEFF);
        _arabic_lang.CodePage1Mask = (1 << 6);
        _arabic_lang.CodePage2Mask = (1 << 19) | (1 << 29);
        _arabic_lang.DefaultFont = "Tahoma";
        this.Languages.push(_arabic_lang);

        // 2) korean
        var _korean_lang = new CLanguageFontSelect();
        _korean_lang.Type = LanguagesFontSelectTypes.Korean;
        _korean_lang.Ranges.push(0x1100);
        _korean_lang.Ranges.push(0x11FF);
        _korean_lang.Ranges.push(0x3130);
        _korean_lang.Ranges.push(0x318F);
        _korean_lang.Ranges.push(0xAC00);
        _korean_lang.Ranges.push(0xD7AF);
        _korean_lang.Ranges.push(0xFF00);
        _korean_lang.Ranges.push(0xFFEF);
        _korean_lang.CodePage1Mask = (1 << 19);
        _korean_lang.CodePage2Mask = 0;
        _korean_lang.DefaultFont = "Batang";
        this.Languages.push(_korean_lang);

        // 3) japan
        var _japan_lang = new CLanguageFontSelect();
        _japan_lang.Type = LanguagesFontSelectTypes.Japan;
        _japan_lang.Ranges.push(0x4E00);
        _japan_lang.Ranges.push(0x9FBF);

        /*
        _japan_lang.Ranges.push(0x3000);// punctuation
        _japan_lang.Ranges.push(0x303F);
        _japan_lang.Ranges.push(0x3040);// Hiragana
        _japan_lang.Ranges.push(0x309F);
        _japan_lang.Ranges.push(0x30A0);// Katakana
        _japan_lang.Ranges.push(0x30FF);
        */
        _japan_lang.Ranges.push(0x3000);
        _japan_lang.Ranges.push(0x30FF);
        _japan_lang.Ranges.push(0xFF00);
        _japan_lang.Ranges.push(0xFFEF);

        _japan_lang.CodePage1Mask = (1 << 17) | (1 << 30);
        _japan_lang.CodePage2Mask = 0;
        _japan_lang.DefaultFont = "MS Mincho";
        _japan_lang.FullSupportPages = true;
        this.Languages.push(_japan_lang);

        // 4) chinese http://stackoverflow.com/questions/1366068/whats-the-complete-range-for-chinese-characters-in-unicode
        var _chinese_lang = new CLanguageFontSelect();
        _chinese_lang.Type = LanguagesFontSelectTypes.Chinese;
        _chinese_lang.Ranges.push(0x4E00);
        _chinese_lang.Ranges.push(0x9FFF);
        _chinese_lang.Ranges.push(0x3400);
        _chinese_lang.Ranges.push(0x4DFF);
        _chinese_lang.Ranges.push(0x20000);
        _chinese_lang.Ranges.push(0x2A6DF);
        _chinese_lang.Ranges.push(0xF900);
        _chinese_lang.Ranges.push(0xFAFF);
        _chinese_lang.Ranges.push(0x2F800);
        _chinese_lang.Ranges.push(0x2FA1F);
        _chinese_lang.Ranges.push(0xFF00);
        _chinese_lang.Ranges.push(0xFFEF);
        _chinese_lang.CodePage1Mask = (1 << 18) | (1 << 20);
        _chinese_lang.CodePage2Mask = 0;
        _chinese_lang.DefaultFont = "SimSun";
        this.Languages.push(_chinese_lang);

        // debug!!!
        /*
        var _symbols = " `~><.,:;?!/\\|[](){}$€%#@&\'\"=+-*^_1234567890";
        console.log("start dump multisymbols -----------------------------");
        for (var i = 0; i < _symbols.length; i++)
        console.log("" + _symbols.charCodeAt(i));
        console.log("end dump multisymbols -------------------------------");
        */

        /*
        var _array_results = [];
        var _count_fonts = this.List.length;
        for (var i = 0; i < _count_fonts; i++)
        {
            var f = this.List[i];

            console.log(f.m_wsFontPath + "_" + f.m_lIndex + " codepage1: " + f.m_ulCodePageRange1 + ", codepage2: " + f.m_ulCodePageRange2);
        }
        */
    },

    isEnglishChar : function(_code)
    {
        if (97 <= _code && _code <= 122)
            return true;
        if (65 <= _code && _code <= 90)
            return true;
        return false;
    },

    isMultiLanguageSymbol : function(_code)
    {
        // здесь те символы, которые не влияют на язык

        switch (_code)
        {
            case 32:
            case 96:
            case 126:
            case 62:
            case 60:
            case 46:
            case 44:
            case 58:
            case 59:
            case 63:
            case 33:
            case 47:
            case 92:
            case 124:
            case 91:
            case 93:
            case 40:
            case 41:
            case 123:
            case 125:
            case 36:
            case 37:
            case 35:
            case 64:
            case 38:
            case 39:
            case 34:
            case 61:
            case 43:
            case 45:
            case 42:
            case 94:
            case 95:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 48:
                return true;
            default:
            {
                if (_code >= 0x2000 && _code <= 0x206F) // general punctuation
                    return true;

                if (_code >= 0x20A0 && _code <= 0x20CF) // Currency Symbols
                    return true;

                break;
            }
        }
        return false;
    },

    checkText : function(text)
    {
        var _text_len = text.length;
        if (_text_len == 0)
            return LanguagesFontSelectTypes.Unknown;

        var _array_detect_languages = new Array();
        var _detect_languages_length = this.Languages.length;

        for (var _lang = 0; _lang < _detect_languages_length; _lang++)
        {
            var _language = this.Languages[_lang];

            var _is_support = true;
            var _no_multi_symbols = 0;
            var _percent_by_english = 0;
            for (var i = 0; i < _text_len; i++)
            {
                var _code = text.charCodeAt(i);
                if (!this.isMultiLanguageSymbol(_code))
                {
                    _no_multi_symbols++;
                    if (!_language.checkChar(_code))
                    {
                        if (this.isEnglishChar(_code))
                            _percent_by_english--;
                        else
                        {
                            _is_support = false;
                            break;
                        }
                    }
                    else
                    {
                        _percent_by_english++;
                    }
                }
            }

            if (0 == _no_multi_symbols)
                return LanguagesFontSelectTypes.Unknown;

            if (_is_support && (_percent_by_english > 0))
            {
                _array_detect_languages.push(_language.Type);
            }
        }

        var _len = _array_detect_languages.length;
        if (0 == _len)
            return LanguagesFontSelectTypes.Unknown;

        return _array_detect_languages[_len - 1];
    },

    checkPasteText : function(textPr, langId)
    {
        var _ret_obj = { is_async : false, name : "", fontSlot : fontslot_ASCII };

        if (!textPr.RFonts)
            return _ret_obj;

        var _lang = null;
        for (var i = 0; i < this.Languages.length; i++)
        {
            _lang = this.Languages[i];
            if (_lang.Type == langId)
            {
                break;
            }
        }
        if (null == _lang)
        {
            // такого быть не должно
            return _ret_obj;
        }

        _ret_obj.fontSlot = fontslot_ASCII;

        if (langId >= LanguagesFontSelectTypes.EastAsiaStart && langId <= LanguagesFontSelectTypes.EastAsiaEnd)
            _ret_obj.fontSlot = fontslot_EastAsia;

        if (langId == LanguagesFontSelectTypes.Arabic)
        {
            if (textPr.CS || textPr.RTL)
                _ret_obj.fontSlot = fontslot_CS;
        }

        var _fontFamily = undefined;
        var bold    = undefined;
        var italic  = undefined;
        switch (_ret_obj.fontSlot)
        {
            case fontslot_ASCII:
            {
                _fontFamily = textPr.RFonts.Ascii;
                bold    = textPr.Bold;
                italic  = textPr.Italic;
                break;
            }
            case fontslot_HAnsi:
            {
                _fontFamily = textPr.RFonts.HAnsi;
                bold    = textPr.Bold;
                italic  = textPr.Italic;
                break;
            }
            case fontslot_CS:
            {
                _fontFamily = textPr.RFonts.CS;
                bold    = textPr.BoldCS;
                italic  = textPr.ItalicCS;
                break;
            }
            case fontslot_EastAsia:
            {
                _fontFamily = textPr.RFonts.EastAsia;
                bold    = textPr.Bold;
                italic  = textPr.Italic;
                break;
            }
            default:
                break;
        }

        if (undefined == _fontFamily)
            return _ret_obj;

        var _info = window.g_font_infos[window.g_map_font_index[_fontFamily.Name]];

        var oFontStyle = FontStyle.FontStyleRegular;
        if (!italic && bold)
            oFontStyle = FontStyle.FontStyleBold;
        else if (italic && !bold)
            oFontStyle = FontStyle.FontStyleItalic;
        else if (italic && bold)
            oFontStyle = FontStyle.FontStyleBoldItalic;

        var _id = _info.GetFontID(window.g_font_loader, oFontStyle);
        var _select = this.List[this.ListMap[_id.id]];

        if (0 != _lang.CodePage1Mask)
        {
            if (!_lang.FullSupportPages)
            {
                if (0 == (_lang.CodePage1Mask & _select.m_ulCodePageRange1))
                    _ret_obj.is_async = true;
            }
            else
            {
                if (_lang.CodePage1Mask != (_lang.CodePage1Mask & _select.m_ulCodePageRange1))
                    _ret_obj.is_async = true;
            }
        }
        if (0 != _lang.CodePage2Mask)
        {
            if (!_lang.FullSupportPages)
            {
                if (0 == (_lang.CodePage2Mask & _select.m_ulCodePageRange2))
                    _ret_obj.is_async = true;
            }
            else
            {
                if (_lang.CodePage2Mask != (_lang.CodePage2Mask & _select.m_ulCodePageRange2))
                    _ret_obj.is_async = true;
            }
        }

        if (!_ret_obj.is_async)
            return _ret_obj;

        _ret_obj.name = this.selectNeedFont(_lang, oFontStyle);
        if (_ret_obj.name == "")
            _ret_obj.is_async = false;

        return _ret_obj;
    },

    getSetupRFonts : function(obj)
    {
        var _rfonts = new CRFonts();
        switch (obj.fontSlot)
        {
            case fontslot_EastAsia:
            {
                _rfonts.EastAsia = { Name : obj.name, Index : -1 };
                break;
            }
            case fontslot_CS:
            {
                _rfonts.CS = { Name : obj.name, Index : -1 };
                break;
            }
            case fontslot_HAnsi:
            {
                _rfonts.HAnsi = { Name : obj.name, Index : -1 };
                break;
            }
            case fontslot_ASCII:
            default:
            {
                _rfonts.Ascii = { Name : obj.name, Index : -1 };
                break;
            }
        }
        return _rfonts;
    },

    selectNeedFont : function(_lang, _style)
    {
        var _error = 0x01000000;
        var _name = "";

        var _len = window.g_font_infos.length;
        for (var i = 0; i < _len; i++)
        {
            var _info = window.g_font_infos[i];
            var _id = _info.GetFontID(window.g_font_loader, _style);
            var _select = this.List[this.ListMap[_id.id]];

            var _bIsNeed = false;
            if (0 != _lang.CodePage1Mask)
            {
                if (!_lang.FullSupportPages)
                {
                    if (0 == (_lang.CodePage1Mask & _select.m_ulCodePageRange1))
                        _bIsNeed = true;
                }
                else
                {
                    if (_lang.CodePage1Mask != (_lang.CodePage1Mask & _select.m_ulCodePageRange1))
                        _bIsNeed = true;
                }
            }
            if (0 != _lang.CodePage2Mask)
            {
                if (!_lang.FullSupportPages)
                {
                    if (0 == (_lang.CodePage2Mask & _select.m_ulCodePageRange2))
                        _bIsNeed = true;
                }
                else
                {
                    if (_lang.CodePage2Mask != (_lang.CodePage2Mask & _select.m_ulCodePageRange2))
                        _bIsNeed = true;
                }
            }

            if (!_bIsNeed)
            {
                var _tmp_error = 0;
                if (_id.file.Status != 0)
                    _tmp_error += 0x00010000;
                if (_info.Name != _lang.DefaultFont)
                    _tmp_error += 0x00000100;

                if (_tmp_error < _error)
                {
                    _error = _tmp_error;
                    _name = _info.Name;
                }
            }
        }

        return _name;
    },

    checkText2 : function(text)
    {
        var r1 = 0;
        var r2 = 0;
        var r3 = 0;
        var r4 = 0;
        var codePage1 = 0;
        var codePage2 = 0;

        var len = text.length;
        for (var i = 0; i < len; i++)
        {
            var _code = text.charCodeAt(i);

            var lRangeNum	= this.m_pRangesNums.data[_code];
            var lRange		= this.m_pRanges.data[_code];

            if (0xFF != lRangeNum)
            {
                if ((i == 0) && ((lRangeNum == 1) && (lRange == 28)))
                {
                    codePage1 = 0x80000000;
                }
                else if (((lRangeNum == 2) && (lRange == 3)) || ((lRangeNum == 1) && (lRange == 31)) || ((lRangeNum == 0) && (lRange == 13)))
                {
                    // arabic!
                    r1 |= (1 << 13);
                    r2 |= (1 << 31);
                    r3 |= (1 << 3);
                }
                else
                {
                    if (0 == lRangeNum)
                        r1 |= 1 << lRange;
                    else if (1 == lRangeNum)
                        r2 |= 1 << lRange;
                    else if (2 == lRangeNum)
                        r3 |= 1 << lRange;
                    else
                        r4 |= 1 << lRange;
                }
            }
        }

        var _array_results = [];
        var _count_fonts = this.List.length;
        for (var i = 0; i < _count_fonts; i++)
        {
            var f = this.List[i];

            if (((f.m_ulUnicodeRange1 & r1) == r1) &&
                ((f.m_ulUnicodeRange2 & r2) == r2) &&
                ((f.m_ulUnicodeRange3 & r3) == r3) &&
                ((f.m_ulUnicodeRange4 & r4) == r4) &&
                ((f.m_ulCodePageRange1 & codePage1) == codePage1) &&
                ((f.m_ulCodePageRange2 & codePage2) == codePage2))
            {
                _array_results.push(f.m_wsFontPath);
            }
        }

        //console.log(_array_results);
    },

    initRanges : function()
    {
        // пока не используем
        /*

        // пока только 2 байта
        this.m_pRanges      = g_memory.Alloc(0xFFFF);
        this.m_pRangesNums  = g_memory.Alloc(0xFFFF);

        memset(this.m_pRanges, 0, 0xFF, 0xFFFF);
        memset(this.m_pRangesNums, 0, 0xFF, 0xFFFF);

        // теперь просто по порядку заполняем все рэнджи
        var nStart = 0;
        var nCount = 0;

        // rangeNum 0
        // case 00: sUCRName = "Basic Latin"; break; /: U+0020-U+007E :/
        nStart = 0x0020;
        nCount = 0x007E - nStart + 1;
        memset(this.m_pRanges, nStart, 0, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 01: sUCRName = "Latin-1 Supplement"; break; /: U+0080-U+00FF :/
        nStart = 0x0080;
        nCount = 0x00FF - nStart + 1;
        memset(this.m_pRanges, nStart, 1, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 02: sUCRName = "Latin Extended-A"; break; /: U+0100-U+017F :/
        nStart = 0x0100;
        nCount = 0x017F - nStart + 1;
        memset(this.m_pRanges, nStart, 2, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 03: sUCRName = "Latin Extended-B"; break; /: U+0180-U+024F :/
        nStart = 0x0180;
        nCount = 0x024F - nStart + 1;
        memset(this.m_pRanges, nStart, 3, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 04: sUCRName = "IPA Extensions"; break; /: U+0250-U+02AF :/ /: U+1D00-U+1D7F :/ /: U+1D80-U+1DBF :/
        nStart = 0x0250;
        nCount = 0x02AF - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x1D00;
        nCount = 0x1D7F - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x1D80;
        nCount = 0x1DBF - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 05: sUCRName = "Spacing Modifier Letters"; break; /: U+02B0-U+02FF :/ /: U+A700-U+A71F :/
        nStart = 0x02B0;
        nCount = 0x02FF - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0xA700;
        nCount = 0xA71F - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 06: sUCRName = "Combining Diacritical Marks"; break; /: U+0300-U+036F :/ /: U+1DC0-U+1DFF :/
        nStart = 0x0300;
        nCount = 0x036F - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x1DC0;
        nCount = 0x1DFF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 07: sUCRName = "Greek and Coptic"; break; /: U+0370-U+03FF :/
        nStart = 0x0370;
        nCount = 0x03FF - nStart + 1;
        memset(this.m_pRanges, nStart, 7, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 08: sUCRName = "Coptic"; break; /: U+2C80-U+2CFF :/
        nStart = 0x2C80;
        nCount = 0x2CFF - nStart + 1;
        memset(this.m_pRanges, nStart, 8, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 09: sUCRName = "Cyrillic"; break; /: U+0400-U+04FF :/ /: U+0500-U+052F :/ /: U+2DE0-U+2DFF :/ /: U+A640-U+A69F :/
        nStart = 0x0400;
        nCount = 0x04FF - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x0500;
        nCount = 0x052F - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x2DE0;
        nCount = 0x2DFF - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0xA640;
        nCount = 0xA69F - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 10: sUCRName = "Armenian"; break; /: U+0530-U+058F :/
        nStart = 0x0530;
        nCount = 0x058F - nStart + 1;
        memset(this.m_pRanges, nStart, 10, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 11: sUCRName = "Hebrew"; break; /: U+0590-U+05FF :/
        nStart = 0x0590;
        nCount = 0x05FF - nStart + 1;
        memset(this.m_pRanges, nStart, 11, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 12: sUCRName = "Vai"; break; /: U+A500-U+A63F :/
        nStart = 0xA500;
        nCount = 0xA63F - nStart + 1;
        memset(this.m_pRanges, nStart, 12, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 13: sUCRName = "Arabic"; break; /: U+0600-U+06FF :/ /: U+0750-U+077F :/
        nStart = 0x0600;
        nCount = 0x06FF - nStart + 1;
        memset(this.m_pRanges, nStart, 13, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x0750;
        nCount = 0x077F - nStart + 1;
        memset(this.m_pRanges, nStart, 13, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 14: sUCRName = "NKo"; break; /: U+07C0-U+07FF :/
        nStart = 0x07C0;
        nCount = 0x07FF - nStart + 1;
        memset(this.m_pRanges, nStart, 14, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 15: sUCRName = "Devanagari"; break; /: U+0900-U+097F :/
        nStart = 0x0900;
        nCount = 0x097F - nStart + 1;
        memset(this.m_pRanges, nStart, 15, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 16: sUCRName = "Bengali"; break; /: U+0980-U+09FF :/
        nStart = 0x0980;
        nCount = 0x09FF - nStart + 1;
        memset(this.m_pRanges, nStart, 16, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 17: sUCRName = "Gurmukhi"; break; /: U+0A00-U+0A7F :/
        nStart = 0x0A00;
        nCount = 0x0A7F - nStart + 1;
        memset(this.m_pRanges, nStart, 17, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 18: sUCRName = "Gujarati"; break; /: U+0A80-U+0AFF :/
        nStart = 0x0A80;
        nCount = 0x0AFF - nStart + 1;
        memset(this.m_pRanges, nStart, 18, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 19: sUCRName = "Oriya"; break; /: U+0B00-U+0B7F :/
        nStart = 0x0B00;
        nCount = 0x0B7F - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 20: sUCRName = "Tamil"; break; /: U+0B80-U+0BFF :/
        nStart = 0x0B80;
        nCount = 0x0BFF - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 21: sUCRName = "Telugu"; break; /: U+0C00-U+0C7F :/
        nStart = 0x0C00;
        nCount = 0x0C7F - nStart + 1;
        memset(this.m_pRanges, nStart, 21, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 22: sUCRName = "Kannada"; break; /: U+0C80-U+0CFF :/
        nStart = 0x0C80;
        nCount = 0x0CFF - nStart + 1;
        memset(this.m_pRanges, nStart, 22, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 23: sUCRName = "Malayalam"; break; /: U+0D00-U+0D7F :/
        nStart = 0x0D00;
        nCount = 0x0D7F - nStart + 1;
        memset(this.m_pRanges, nStart, 23, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 24: sUCRName = "Thai"; break; /: U+0E00-U+0E7F :/
        nStart = 0x0E00;
        nCount = 0x0E7F - nStart + 1;
        memset(this.m_pRanges, nStart, 24, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 25: sUCRName = "Lao"; break; /: U+0E80-U+0EFF :/
        nStart = 0x0E80;
        nCount = 0x0EFF - nStart + 1;
        memset(this.m_pRanges, nStart, 25, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 26: sUCRName = "Georgian"; break; /: U+10A0-U+10FF :/ /: U+2D00-U+2D2F :/
        nStart = 0x10A0;
        nCount = 0x10FF - nStart + 1;
        memset(this.m_pRanges, nStart, 26, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x2D00;
        nCount = 0x2D2F - nStart + 1;
        memset(this.m_pRanges, nStart, 26, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 27: sUCRName = "Balinese"; break; /: U+1B00-U+1B7F :/
        nStart = 0x1B00;
        nCount = 0x1B7F - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 28: sUCRName = "Hangul Jamo"; break; /: U+1100-U+11FF :/
        nStart = 0x1100;
        nCount = 0x11FF - nStart + 1;
        memset(this.m_pRanges, nStart, 28, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 29: sUCRName = "Latin Extended Additional"; break; /: U+1E00-U+1EFF :/ /: U+2C60-U+2C7F :/ /: U+A720-U+A7FF :/
        nStart = 0x1E00;
        nCount = 0x1EFF - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x2C60;
        nCount = 0x2C7F - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0xA720;
        nCount = 0xA7FF - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 30: sUCRName = "Greek Extended"; break; /: U+1F00-U+1FFF :/
        nStart = 0x1F00;
        nCount = 0x1FFF - nStart + 1;
        memset(this.m_pRanges, nStart, 30, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        //case 31: sUCRName = "General Punctuation"; break; /: U+2000-U+206F :/ /: U+2E00-U+2E7F :/
        nStart = 0x2000;
        nCount = 0x206F - nStart + 1;
        memset(this.m_pRanges, nStart, 31, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        nStart = 0x2E00;
        nCount = 0x2E7F - nStart + 1;
        memset(this.m_pRanges, nStart, 31, nCount);
        memset(this.m_pRangesNums, nStart, 0, nCount);

        // rangeNum 1
        //case 00: sUCRName = "Superscripts And Subscripts"; break; /: U+2070-U+209F :/
        nStart = 0x2070;
        nCount = 0x209F - nStart + 1;
        memset(this.m_pRanges, nStart, 0, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 01: sUCRName = "Currency Symbols"; break; /: U+20A0-U+20CF :/
        nStart = 0x20A0;
        nCount = 0x20CF - nStart + 1;
        memset(this.m_pRanges, nStart, 1, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 02: sUCRName = "Combining Diacritical Marks For Symbols"; break; /: U+20D0-U+20FF :/
        nStart = 0x20D0;
        nCount = 0x20FF - nStart + 1;
        memset(this.m_pRanges, nStart, 2, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 03: sUCRName = "Letterlike Symbols"; break; /: U+2100-U+214F :/
        nStart = 0x2100;
        nCount = 0x214F - nStart + 1;
        memset(this.m_pRanges, nStart, 3, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 04: sUCRName = "Number Forms"; break; /: U+2150-U+218F :/
        nStart = 0x2150;
        nCount = 0x218F - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 05: sUCRName = "Arrows"; break; /: U+2190-U+21FF :/ /: U+27F0-U+27FF :/ /: U+2900-U+297F :/ /: U+2B00-U+2BFF :/
        nStart = 0x2190;
        nCount = 0x21FF - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x27F0;
        nCount = 0x27FF - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2900;
        nCount = 0x297F - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2B00;
        nCount = 0x2BFF - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 06: sUCRName = "Mathematical Operators"; break; /: U+2200-U+22FF :/ /: U+2A00-U+2AFF :/ /: U+27C0-U+27EF :/ /: U+2980-U+29FF :/
        nStart = 0x2200;
        nCount = 0x22FF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2A00;
        nCount = 0x2AFF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x27C0;
        nCount = 0x27EF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2980;
        nCount = 0x29FF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 07: sUCRName = "Miscellaneous Technical"; break; /: U+2300-U+23FF :/
        nStart = 0x2300;
        nCount = 0x23FF - nStart + 1;
        memset(this.m_pRanges, nStart, 7, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 08: sUCRName = "Control Pictures"; break; /: U+2400-U+243F :/
        nStart = 0x2400;
        nCount = 0x243F - nStart + 1;
        memset(this.m_pRanges, nStart, 8, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 09: sUCRName = "Optical Character Recognition"; break; /: U+2440-U+245F :/
        nStart = 0x2440;
        nCount = 0x245F - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 10: sUCRName = "Enclosed Alphanumerics"; break; /: U+2460-U+24FF :/
        nStart = 0x2460;
        nCount = 0x24FF - nStart + 1;
        memset(this.m_pRanges, nStart, 10, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 11: sUCRName = "Box Drawing"; break; /: U+2500-U+257F :/
        nStart = 0x2500;
        nCount = 0x257F - nStart + 1;
        memset(this.m_pRanges, nStart, 11, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 12: sUCRName = "Block Elements"; break; /: U+2580-U+259F :/
        nStart = 0x2580;
        nCount = 0x259F - nStart + 1;
        memset(this.m_pRanges, nStart, 12, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 13: sUCRName = "Geometric Shapes"; break; /: U+25A0-U+25FF :/
        nStart = 0x25A0;
        nCount = 0x25FF - nStart + 1;
        memset(this.m_pRanges, nStart, 13, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 14: sUCRName = "Miscellaneous Symbols"; break; /: U+2600-U+26FF :/
        nStart = 0x2600;
        nCount = 0x26FF - nStart + 1;
        memset(this.m_pRanges, nStart, 14, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 15: sUCRName = "Dingbats"; break; /: U+2700-U+27BF :/
        nStart = 0x2700;
        nCount = 0x27BF - nStart + 1;
        memset(this.m_pRanges, nStart, 15, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 16: sUCRName = "CJK Symbols and Punctuation"; break; /: U+3000-U+303F :/
        nStart = 0x3000;
        nCount = 0x303F - nStart + 1;
        memset(this.m_pRanges, nStart, 16, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 17: sUCRName = "Hiragana"; break;  /: U+3040-U+309F :/
        nStart = 0x3040;
        nCount = 0x309F - nStart + 1;
        memset(this.m_pRanges, nStart, 17, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 18: sUCRName = "Katakana"; break; /: U+30A0-U+30FF :/ /: U+31F0-U+31FF :/
        nStart = 0x30A0;
        nCount = 0x30FF - nStart + 1;
        memset(this.m_pRanges, nStart, 18, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x31F0;
        nCount = 0x31FF - nStart + 1;
        memset(this.m_pRanges, nStart, 18, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 19: sUCRName = "Bopomofo"; break; /: U+3100-U+312F :/ /: U+31A0-U+31BF :/
        nStart = 0x3100;
        nCount = 0x312F - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x31A0;
        nCount = 0x31BF - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 20: sUCRName = "Hangul Compatibility Jamo"; break; /: U+3130-U+318F :/
        nStart = 0x3130;
        nCount = 0x318F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 21: sUCRName = "Phags-pa"; break; /: U+A840-U+A87F :/
        nStart = 0xA840;
        nCount = 0xA87F - nStart + 1;
        memset(this.m_pRanges, nStart, 21, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 22: sUCRName = "Enclosed CJK Letters and Months"; break; /: U+3200-U+32FF :/
        nStart = 0x3200;
        nCount = 0x32FF - nStart + 1;
        memset(this.m_pRanges, nStart, 22, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 23: sUCRName = "CJK Compatibility"; break; /: U+3300-U+33FF :/
        nStart = 0x3300;
        nCount = 0x33FF - nStart + 1;
        memset(this.m_pRanges, nStart, 23, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 24: sUCRName = "Hangul Syllables"; break; /: U+AC00-U+D7AF :/
        nStart = 0xAC00;
        nCount = 0xD7AF - nStart + 1;
        memset(this.m_pRanges, nStart, 24, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 25: sUCRName = "Non-Plane 0"; break; /: U+D800-U+DB7F :/ /: U+DB80-U+DBFF :/ /: U+DC00-U+DFFF :/ // Не юникодные символы
        nStart = 0xD800;
        nCount = 0xDB7F - nStart + 1;
        memset(this.m_pRanges, nStart, 25, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0xDB80;
        nCount = 0xDBFF - nStart + 1;
        memset(this.m_pRanges, nStart, 25, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0xDC00;
        nCount = 0xDFFF - nStart + 1;
        memset(this.m_pRanges, nStart, 25, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 26: sUCRName = "Phoenician"; break; /:U+10900-U+1091F:/

        //case 27: sUCRName = "CJK Unified Ideographs"; break; /: U+4E00-U+9FFF :/ /: U+2E80-U+2EFF :/ /: U+2F00-U+2FDF :/ /: U+2FF0-U+2FFF :/ /: U+3400-U+4DB5 :/ /:U+20000-U+2A6D6:/ /: U+3190-U+319F :/
        nStart = 0x4E00;
        nCount = 0x9FFF - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2E80;
        nCount = 0x2EFF - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2F00;
        nCount = 0x2FDF - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x2FF0;
        nCount = 0x2FFF - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x3400;
        nCount = 0x4DB5 - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0x3190;
        nCount = 0x319F - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 28: sUCRName = "Private Use Area (plane 0)"; break; /: U+E000-U+F8FF :/ // Не юникодные символы
        nStart = 0xE000;
        nCount = 0xF8FF - nStart + 1;
        memset(this.m_pRanges, nStart, 28, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 29: sUCRName = "CJK Strokes"; break; /: U+31C0-U+31EF :/ /: U+F900-U+FAFF :/ /:U+2F800-U+2FA1F:/
        nStart = 0x31C0;
        nCount = 0x31EF - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        nStart = 0xF900;
        nCount = 0xFAFF - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 30: sUCRName = "Alphabetic Presentation Forms"; break; /: U+FB00-U+FB4F :/
        nStart = 0xFB00;
        nCount = 0xFB4F - nStart + 1;
        memset(this.m_pRanges, nStart, 30, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        //case 31: sUCRName = "Arabic Presentation Forms-A"; break; /: U+FB50-U+FDFF :/
        nStart = 0xFB50;
        nCount = 0xFDFF - nStart + 1;
        memset(this.m_pRanges, nStart, 31, nCount);
        memset(this.m_pRangesNums, nStart, 1, nCount);

        // rangeNum 2
        //case 00: sUCRName = "Combining Half Marks"; break; /: U+FE20-U+FE2F :/
        nStart = 0xFE20;
        nCount = 0xFE2F - nStart + 1;
        memset(this.m_pRanges, nStart, 0, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 01: sUCRName = "Vertical forms"; break; /: U+FE10-U+FE1F :/ /: U+FE30-U+FE4F :/
        nStart = 0xFE10;
        nCount = 0xFE1F - nStart + 1;
        memset(this.m_pRanges, nStart, 1, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0xFE30;
        nCount = 0xFE4F - nStart + 1;
        memset(this.m_pRanges, nStart, 1, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 02: sUCRName = "Small Form Variants"; break; /: U+FE50-U+FE6F :/
        nStart = 0xFE50;
        nCount = 0xFE6F - nStart + 1;
        memset(this.m_pRanges, nStart, 2, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 03: sUCRName = "Arabic Presentation Forms-B"; break; /: U+FE70-U+FEFE :/
        nStart = 0xFE70;
        nCount = 0xFEFE - nStart + 1;
        memset(this.m_pRanges, nStart, 3, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 04: sUCRName = "Halfwidth and Fullwidth Forms"; break; /: U+FF00-U+FFEF :/
        nStart = 0xFF00;
        nCount = 0xFFEF - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 05: sUCRName = "Specials"; break; /: U+FFF0-U+FFFF :/
        nStart = 0xFFF0;
        nCount = 0xFFFF - nStart + 1;
        memset(this.m_pRanges, nStart, 5, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 06: sUCRName = "Tibetan"; break; /: U+0F00-U+0FFF :/
        nStart = 0x0F00;
        nCount = 0x0FFF - nStart + 1;
        memset(this.m_pRanges, nStart, 6, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 07: sUCRName = "Syriac"; break; /: U+0700-U+074F :/
        nStart = 0x0700;
        nCount = 0x074F - nStart + 1;
        memset(this.m_pRanges, nStart, 7, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 08: sUCRName = "Thaana"; break; /: U+0780-U+07BF :/
        nStart = 0x0780;
        nCount = 0x07BF - nStart + 1;
        memset(this.m_pRanges, nStart, 8, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 09: sUCRName = "Sinhala"; break; /: U+0D80-U+0DFF :/
        nStart = 0x0D80;
        nCount = 0x0DFF - nStart + 1;
        memset(this.m_pRanges, nStart, 9, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 10: sUCRName = "Myanmar"; break; /: U+1000-U+109F :/
        nStart = 0x1000;
        nCount = 0x109F - nStart + 1;
        memset(this.m_pRanges, nStart, 10, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 11: sUCRName = "Ethiopic"; break; /: U+1200-U+137F :/ /: U+1380-U+139F :/ /: U+2D80-U+2DDF :/
        nStart = 0x1200;
        nCount = 0x137F - nStart + 1;
        memset(this.m_pRanges, nStart, 11, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x1380;
        nCount = 0x139F - nStart + 1;
        memset(this.m_pRanges, nStart, 11, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x2D80;
        nCount = 0x2DDF - nStart + 1;
        memset(this.m_pRanges, nStart, 11, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 12: sUCRName = "Cherokee"; break; /: U+13A0-U+13FF :/
        nStart = 0x13A0;
        nCount = 0x13FF - nStart + 1;
        memset(this.m_pRanges, nStart, 12, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 13: sUCRName = "Unified Canadian Aboriginal Syllabics"; break; /: U+1400-U+167F :/
        nStart = 0x1400;
        nCount = 0x167F - nStart + 1;
        memset(this.m_pRanges, nStart, 13, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 14: sUCRName = "Ogham"; break; /: U+1680-U+169F :/
        nStart = 0x1680;
        nCount = 0x169F - nStart + 1;
        memset(this.m_pRanges, nStart, 14, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 15: sUCRName = "Runic"; break; /: U+16A0-U+16FF :/
        nStart = 0x16A0;
        nCount = 0x16FF - nStart + 1;
        memset(this.m_pRanges, nStart, 15, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 16: sUCRName = "Khmer"; break; /: U+1780-U+17FF :/ /: U+19E0-U+19FF :/
        nStart = 0x1780;
        nCount = 0x17FF - nStart + 1;
        memset(this.m_pRanges, nStart, 16, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x19E0;
        nCount = 0x19FF - nStart + 1;
        memset(this.m_pRanges, nStart, 16, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 17: sUCRName = "Mongolian"; break; /: U+1800-U+18AF :/
        nStart = 0x1800;
        nCount = 0x18AF - nStart + 1;
        memset(this.m_pRanges, nStart, 17, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 18: sUCRName = "Braille Patterns"; break; /: U+2800-U+28FF :/
        nStart = 0x2800;
        nCount = 0x28FF - nStart + 1;
        memset(this.m_pRanges, nStart, 18, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 19: sUCRName = "Yi Syllables"; break; /: U+A000-U+A48F :/ /: U+A490-U+A4CF :/
        nStart = 0xA000;
        nCount = 0xA48F - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0xA490;
        nCount = 0xA4CF - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 20: sUCRName = "Tagalog"; break; /: U+1700-U+171F :/ /: U+1720-U+173F :/ /: U+1740-U+175F :/ /: U+1760-U+177F :/
        nStart = 0x1700;
        nCount = 0x171F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x1720;
        nCount = 0x173F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x1740;
        nCount = 0x175F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        nStart = 0x1760;
        nCount = 0x177F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 21: sUCRName = "Old Italic"; break; /:U+10300-U+1032F:/
        //case 22: sUCRName = "Gothic"; break; /:U+10330-U+1034F:/
        //case 23: sUCRName = "Deseret"; break; /:U+10400-U+1044F:/
        //case 24: sUCRName = "Byzantine Musical Symbols"; break; /:U+1D000-U+1D0FF:/ /:U+1D100-U+1D1FF:/ /:U+1D200-U+1D24F:/
        //case 25: sUCRName = "Mathematical Alphanumeric Symbols"; break; /:U+1D400-U+1D7FF:/
        //case 26: sUCRName = "Private Use (plane 15)"; break; /:U+F0000-U+FFFFD:/ /:U+100000-U+10FFFD:/ // Не юникодные символы

        //case 27: sUCRName = "Variation Selectors"; break; /: U+FE00-U+FE0F :/ /:U+E0100-U+E01EF:/
        nStart = 0xFE00;
        nCount = 0xFE0F - nStart + 1;
        memset(this.m_pRanges, nStart, 27, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 28: sUCRName = "Tags"; break; /:U+E0000-U+E007F:/
        //case 29: sUCRName = "Limbu"; break; /: U+1900-U+194F :/
        nStart = 0x1900;
        nCount = 0x194F - nStart + 1;
        memset(this.m_pRanges, nStart, 29, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 30: sUCRName = "Tai Le"; break; /: U+1950-U+197F :/
        nStart = 0x1950;
        nCount = 0x197F - nStart + 1;
        memset(this.m_pRanges, nStart, 30, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        //case 31: sUCRName = "New Tai Lue"; break; /: U+1980-U+19DF :/
        nStart = 0x1980;
        nCount = 0x19DF - nStart + 1;
        memset(this.m_pRanges, nStart, 31, nCount);
        memset(this.m_pRangesNums, nStart, 2, nCount);

        // rangeNum 3
        //case 00: sUCRName = "Buginese"; break; /: U+1A00-U+1A1F :/
        nStart = 0x1A00;
        nCount = 0x1A1F - nStart + 1;
        memset(this.m_pRanges, nStart, 0, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 01: sUCRName = "Glagolitic"; break; /: U+2C00-U+2C5F :/
        nStart = 0x2C00;
        nCount = 0x2C5F - nStart + 1;
        memset(this.m_pRanges, nStart, 1, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 02: sUCRName = "Tifinagh"; break; /: U+2D30-U+2D7F :/
        nStart = 0x2D30;
        nCount = 0x2D7F - nStart + 1;
        memset(this.m_pRanges, nStart, 2, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 03: sUCRName = "Yijing Hexagram Symbols"; break; /: U+4DC0-U+4DFF :/
        nStart = 0x4DC0;
        nCount = 0x4DFF - nStart + 1;
        memset(this.m_pRanges, nStart, 3, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 04: sUCRName = "Syloti Nagri"; break; /: U+A800-U+A82F :/
        nStart = 0xA800;
        nCount = 0xA82F - nStart + 1;
        memset(this.m_pRanges, nStart, 4, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 05: sUCRName = "Linear B Syllabary"; break; /:U+10000-U+1007F:/ /:U+10080-U+100FF:/ /:U+10100-U+1013F:/
        //case 06: sUCRName = "Ancient Greek Numbers"; break; /:U+10140-U+1018F:/
        //case 07: sUCRName = "Ugaritic"; break; /:U+10380-U+1039F:/
        //case 08: sUCRName = "Old Persian"; break; /:U+103A0-U+103DF:/
        //case 09: sUCRName = "Shavian"; break; /:U+10450-U+1047F:/
        //case 10: sUCRName = "Osmanya"; break; /:U+10480-U+104AF:/
        //case 11: sUCRName = "Cypriot Syllabary"; break; /:U+10800-U+1083F:/
        //case 12: sUCRName = "Kharoshthi"; break; /:U+10A00-U+10A5F:/
        //case 13: sUCRName = "Tai Xuan Jing Symbols"; break; /:U+1D300-U+1D35F:/
        //case 14: sUCRName = "Cuneiform"; break; /:U+12000-U+123FF:/ /:U+12400-U+1247F:/
        //case 15: sUCRName = "Counting Rod Numerals"; break; /:U+1D360-U+1D37F:/

        //case 16: sUCRName = "Sundanese"; break; /: U+1B80-U+1BBF :/
        nStart = 0x1B80;
        nCount = 0x1BBF - nStart + 1;
        memset(this.m_pRanges, nStart, 16, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 17: sUCRName = "Lepcha"; break; /: U+1C00-U+1C4F :/
        nStart = 0x1C00;
        nCount = 0x1C4F - nStart + 1;
        memset(this.m_pRanges, nStart, 17, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 18: sUCRName = "Ol Chiki"; break; /: U+1C50-U+1C7F :/
        nStart = 0x1C50;
        nCount = 0x1C7F - nStart + 1;
        memset(this.m_pRanges, nStart, 18, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 19: sUCRName = "Saurashtra"; break; /: U+A880-U+A8DF :/
        nStart = 0xA880;
        nCount = 0xA8DF - nStart + 1;
        memset(this.m_pRanges, nStart, 19, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 20: sUCRName = "Kayah Li"; break; /: U+A900-U+A92F :/
        nStart = 0xA900;
        nCount = 0xA92F - nStart + 1;
        memset(this.m_pRanges, nStart, 20, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 21: sUCRName = "Rejang"; break; /: U+A930-U+A95F :/
        nStart = 0xA930;
        nCount = 0xA95F - nStart + 1;
        memset(this.m_pRanges, nStart, 21, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 22: sUCRName = "Cham"; break; /: U+AA00-U+AA5F :/
        nStart = 0xAA00;
        nCount = 0xAA5F - nStart + 1;
        memset(this.m_pRanges, nStart, 22, nCount);
        memset(this.m_pRangesNums, nStart, 3, nCount);

        //case 23: sUCRName = "Ancient Symbols"; break; /:U+10190-U+101CF:/
        //case 24: sUCRName = "Phaistos Disc"; break; /:U+101D0-U+101FF:/
        //case 25: sUCRName = "Carian"; break; /:U+102A0-U+102DF:/ /:U+10280-U+1029F:/ /:U+10920-U+1093F:/
        //case 26: sUCRName = "Domino Tiles"; break; /:U+1F030-U+1F09F:/ /:U+1F000-U+1F02F:/
        //case 27: sUCRName = "Reserved for process-internal usage"; break;
        //case 28: sUCRName = "Reserved for process-internal usage"; break;
        //case 29: sUCRName = "Reserved for process-internal usage"; break;
        //case 30: sUCRName = "Reserved for process-internal usage"; break;
        //case 31: sUCRName = "Reserved for process-internal usage"; break;

        */
    }
};

var g_fontSelections = new CFontSelectList();
