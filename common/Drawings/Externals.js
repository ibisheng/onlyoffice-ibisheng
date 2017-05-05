/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function(window, document){

// Import
var FontStyle = AscFonts.FontStyle;
var DecodeBase64Char = AscFonts.DecodeBase64Char;
var b64_decode = AscFonts.b64_decode;
var FT_Stream = AscFonts.FT_Stream;

var g_fontNamesEncoder = undefined;

var g_map_font_index = {};
var g_fonts_streams = [];

function ZBase32Encoder()
{
    this.EncodingTable = "ybndrfg8ejkmcpqxot1uwisza345h769";
    this.DecodingTable = ("undefined" == typeof Uint8Array) ? new Array(128) : new Uint8Array(128);

    var ii =  0;
    for (ii = 0; ii < 128; ii++)
        this.DecodingTable[ii] = 255;

    var _len_32 = this.EncodingTable.length;
    for (ii = 0; ii < _len_32; ii++)
    {
        this.DecodingTable[this.EncodingTable.charCodeAt(ii)] = ii;
    }

    this.GetUTF16_fromUnicodeChar = function(code)
    {
        if (code < 0x10000)
            return String.fromCharCode(code);
        else
        {
            code -= 0x10000;
            return String.fromCharCode(0xD800 | ((code >> 10) & 0x03FF)) + String.fromCharCode(0xDC00 | (code & 0x03FF));
        }
    };

    this.GetUTF16_fromUTF8 = function(pBuffer)
    {
        var _res = "";

        var lIndex = 0;
        var lCount = pBuffer.length;
        var val = 0;
        while (lIndex < lCount)
        {
            var byteMain = pBuffer[lIndex];
            if (0x00 == (byteMain & 0x80))
            {
                // 1 byte
                _res += this.GetUTF16_fromUnicodeChar(byteMain);
                ++lIndex;
            }
            else if (0x00 == (byteMain & 0x20))
            {
                // 2 byte
                val = (((byteMain & 0x1F) << 6) |
                            (pBuffer[lIndex + 1] & 0x3F));
                _res += this.GetUTF16_fromUnicodeChar(val);
                lIndex += 2;
            }
            else if (0x00 == (byteMain & 0x10))
            {
                // 3 byte
                val = (((byteMain & 0x0F) << 12) |
                            ((pBuffer[lIndex + 1] & 0x3F) << 6) |
                            (pBuffer[lIndex + 2] & 0x3F));

                _res += this.GetUTF16_fromUnicodeChar(val);
                lIndex += 3;
            }
            else if (0x00 == (byteMain & 0x08))
            {
                // 4 byte
                val = (((byteMain & 0x07) << 18) |
                            ((pBuffer[lIndex + 1] & 0x3F) << 12) |
                            ((pBuffer[lIndex + 2] & 0x3F) << 6) |
                            (pBuffer[lIndex + 3] & 0x3F));

                _res += this.GetUTF16_fromUnicodeChar(val);
                lIndex += 4;
            }
            else if (0x00 == (byteMain & 0x04))
            {
                // 5 byte
                val = (((byteMain & 0x03) << 24) |
                            ((pBuffer[lIndex + 1] & 0x3F) << 18) |
                            ((pBuffer[lIndex + 2] & 0x3F) << 12) |
                            ((pBuffer[lIndex + 3] & 0x3F) << 6) |
                            (pBuffer[lIndex + 4] & 0x3F));

                _res += this.GetUTF16_fromUnicodeChar(val);
                lIndex += 5;
            }
            else
            {
                // 6 byte
                val = (((byteMain & 0x01) << 30) |
                            ((pBuffer[lIndex + 1] & 0x3F) << 24) |
                            ((pBuffer[lIndex + 2] & 0x3F) << 18) |
                            ((pBuffer[lIndex + 3] & 0x3F) << 12) |
                            ((pBuffer[lIndex + 4] & 0x3F) << 6) |
                            (pBuffer[lIndex + 5] & 0x3F));

                _res += this.GetUTF16_fromUnicodeChar(val);
                lIndex += 5;
            }
        }

        return _res;
    };

    this.GetUTF8_fromUTF16 = function(sData)
    {
        var pCur = 0;
        var pEnd = sData.length;

        var result = [];
        while (pCur < pEnd)
        {
            var code = sData.charCodeAt(pCur++);
            if (code >= 0xD800 && code <= 0xDFFF && pCur < pEnd)
            {
                code = 0x10000 + (((code & 0x3FF) << 10) | (0x03FF & sData.charCodeAt(pCur++)));
            }

            if (code < 0x80)
            {
                result.push(code);
            }
            else if (code < 0x0800)
            {
                result.push(0xC0 | (code >> 6));
                result.push(0x80 | (code & 0x3F));
            }
            else if (code < 0x10000)
            {
                result.push(0xE0 | (code >> 12));
                result.push(0x80 | ((code >> 6) & 0x3F));
                result.push(0x80 | (code & 0x3F));
            }
            else if (code < 0x1FFFFF)
            {
                result.push(0xF0 | (code >> 18));
                result.push(0x80 | ((code >> 12) & 0x3F));
                result.push(0x80 | ((code >> 6) & 0x3F));
                result.push(0x80 | (code & 0x3F));
            }
            else if (code < 0x3FFFFFF)
            {
                result.push(0xF8 | (code >> 24));
                result.push(0x80 | ((code >> 18) & 0x3F));
                result.push(0x80 | ((code >> 12) & 0x3F));
                result.push(0x80 | ((code >> 6) & 0x3F));
                result.push(0x80 | (code & 0x3F));
            }
            else if (code < 0x7FFFFFFF)
            {
                result.push(0xFC | (code >> 30));
                result.push(0x80 | ((code >> 24) & 0x3F));
                result.push(0x80 | ((code >> 18) & 0x3F));
                result.push(0x80 | ((code >> 12) & 0x3F));
                result.push(0x80 | ((code >> 6) & 0x3F));
                result.push(0x80 | (code & 0x3F));
            }
        }

        return result;
    };

    this.Encode = function(sData)
    {
        var data = this.GetUTF8_fromUTF16(sData);

        var encodedResult = "";
        var len = data.length;
        for (var i = 0; i < len; i += 5)
        {
            var byteCount = Math.min(5, len - i);

            var buffer = 0;
            for (var j = 0; j < byteCount; ++j)
            {
                buffer *= 256;
                buffer += data[i + j];
            }

            var bitCount = byteCount * 8;
            while (bitCount > 0)
            {
                var index = 0;
                if (bitCount >= 5)
                {
                    var _del = Math.pow(2, bitCount - 5);
                    //var _del = 1 << (bitCount - 5);
                    index = (buffer / _del) & 0x1f;
                }
                else
                {
                    index = (buffer & (0x1f >> (5 - bitCount)));
                    index <<= (5 - bitCount);
                }

                encodedResult += this.EncodingTable.charAt(index);
                bitCount -= 5;
            }
        }

        return encodedResult;
    };

    this.Decode = function(data)
    {
        var result = [];

        var _len = data.length;
        var obj = { data: data, index : new Array(8) };

        var cur = 0;
        while (cur < _len)
        {
            cur = this.CreateIndexByOctetAndMovePosition(obj, cur);

            var shortByteCount = 0;
            var buffer = 0;
            for (var j = 0; j < 8 && obj.index[j] != -1; ++j)
            {
                buffer *= 32;
                buffer += (this.DecodingTable[obj.index[j]] & 0x1f);
                shortByteCount++;
            }

            var bitCount = shortByteCount * 5;
            while (bitCount >= 8)
            {
                //var _del = 1 << (bitCount - 8);
                var _del = Math.pow(2, bitCount - 8);
                var _res = (buffer / _del) & 0xff;
                result.push(_res);
                bitCount -= 8;
            }
        }

        this.GetUTF16_fromUTF8(result);
    };

    this.CreateIndexByOctetAndMovePosition = function(obj, currentPosition)
    {
        var j = 0;
        while (j < 8)
        {
            if (currentPosition >= obj.data.length)
            {
                obj.index[j++] = -1;
                continue;
            }

            if (this.IgnoredSymbol(obj.data.charCodeAt(currentPosition)))
            {
                currentPosition++;
                continue;
            }

            obj.index[j] = obj.data[currentPosition];
            j++;
            currentPosition++;
        }

        return currentPosition;
    };

    this.IgnoredSymbol = function(checkedSymbol)
    {
        return (checkedSymbol >= 128 || this.DecodingTable[checkedSymbol] == 255);
    };
}

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
                if (_files[i].CanUseOriginalFormat && // false if load embedded fonts
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

    this._callback_font_load = function()
    {
        if (!window[oThis.Id])
            oThis.Status = 1;

        var __font_data_idx = g_fonts_streams.length;
        g_fonts_streams[__font_data_idx] = AscFonts.CreateFontData4(window[oThis.Id]);
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

        if (!g_fontNamesEncoder)
            g_fontNamesEncoder = new ZBase32Encoder();

        //var _name = this.Id;
        var _name = g_fontNamesEncoder.Encode(this.Id) + ".js";

        xhr.open('GET', basePath + "odttf/" + _name, true); // TODO:

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
            else if (AscCommon.AscBrowser.isIE)
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
                g_fonts_streams[__font_data_idx] = AscFonts.CreateFontData3(this.responseText);
                oThis.SetStreamIndex(__font_data_idx);
            }

            // decode
            var guidOdttf = [0xA0, 0x66, 0xD6, 0x20, 0x14, 0x96, 0x47, 0xfa, 0x95, 0x69, 0xB8, 0x50, 0xB0, 0x41, 0x49, 0x48];
            var _stream = g_fonts_streams[g_fonts_streams.length - 1];
            var _data = _stream.data;

            var _count_decode = Math.min(32, _stream.size);
            for (var i = 0; i < _count_decode; ++i)
                _data[i] ^= guidOdttf[i % 16];
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
};
CFontFileLoader.prototype.LoadFontAsync = function(basePath, _callback, isEmbed)
{
	var oThis = this;
	if (window["AscDesktopEditor"] !== undefined && this.CanUseOriginalFormat)
	{
		if (-1 != this.Status)
			return true;

		this.callback = null;
		this.Status = 2;
		window["AscDesktopEditor"]["LoadFontBase64"](this.Id);
		this._callback_font_load();
		return;
	}

	if (this.CanUseOriginalFormat && // false if load embedded fonts
		bIsSupportOriginalFormatFonts) // false if work on ie9
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

	var src;
	if (this.IsNeedAddJSToFontPath)
	{
		if (!g_fontNamesEncoder)
			g_fontNamesEncoder = new ZBase32Encoder();

		//var _name = this.Id + ".js";
		var _name = g_fontNamesEncoder.Encode(this.Id + ".js") + ".js";
		src = basePath + "js/" + _name;
	}
	else
		src = basePath + this.Id + ".js";
	if(isEmbed)
		src = AscCommon.g_oDocumentUrls.getUrl(src);
	scriptElem.setAttribute('src', src);
	scriptElem.setAttribute('type','text/javascript');
	document.getElementsByTagName('head')[0].appendChild(scriptElem);
	return false;
};

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

		var isEmbed = (FONT_TYPE_EMBEDDED == this.Type);
        var fonts = isEmbed ? global_loader.embeddedFontFiles : global_loader.fontFiles;
        var basePath = isEmbed ? global_loader.embeddedFilesPath : global_loader.fontFilesPath;
        var isNeed = false;
        if ((this.needR === true) && (-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false))
        {
            fonts[this.indexR].LoadFontAsync(basePath, null, isEmbed);
            isNeed = true;
        }
        if ((this.needI === true) && (-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false))
        {
            fonts[this.indexI].LoadFontAsync(basePath, null, isEmbed);
            isNeed = true;
        }
        if ((this.needB === true) && (-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false))
        {
            fonts[this.indexB].LoadFontAsync(basePath, null, isEmbed);
            isNeed = true;
        }
        if ((this.needBI === true) && (-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false))
        {
            fonts[this.indexBI].LoadFontAsync(basePath, null, isEmbed);
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
        else
            fontfile = font_loader.fontFiles[index];

        if (window["NATIVE_EDITOR_ENJINE"] && fontfile.Status != 0)
        {
			fontfile.LoadFontNative();
        }        

        var _ext = "";
        if (bNeedBold)
            _ext += "nbold";
        if (bNeedItalic)
            _ext += "nitalic";

        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize, _ext, fontManager);

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
    },

    GetBaseStyle : function(lStyle)
    {
        switch (lStyle)
        {
            case FontStyle.FontStyleBoldItalic:
            {
                if (-1 != this.indexBI)
                {
                    return FontStyle.FontStyleBoldItalic;
                }
                else if (-1 != this.indexB)
                {
                    return FontStyle.FontStyleBold;
                }
                else if (-1 != this.indexI)
                {
                    return FontStyle.FontStyleItalic;
                }
                else
                {
                    return FontStyle.FontStyleRegular;
                }
                break;
            }
            case FontStyle.FontStyleBold:
            {
                if (-1 != this.indexB)
                {
                    return FontStyle.FontStyleBold;
                }
                else if (-1 != this.indexR)
                {
                    return FontStyle.FontStyleRegular;
                }
                else if (-1 != this.indexBI)
                {
                    return FontStyle.FontStyleBoldItalic;
                }
                else
                {
                    return FontStyle.FontStyleItalic;
                }
                break;
            }
            case FontStyle.FontStyleItalic:
            {
                if (-1 != this.indexI)
                {
                    return FontStyle.FontStyleItalic;
                }
                else if (-1 != this.indexR)
                {
                    return FontStyle.FontStyleRegular;
                }
                else if (-1 != this.indexBI)
                {
                    return FontStyle.FontStyleBoldItalic;
                }
                else
                {
                    return FontStyle.FontStyleBold;
                }
                break;
            }
            case FontStyle.FontStyleRegular:
            {
                if (-1 != this.indexR)
                {
                    return FontStyle.FontStyleRegular;
                }
                else if (-1 != this.indexI)
                {
                    return FontStyle.FontStyleItalic;
                }
                else if (-1 != this.indexB)
                {
                    return FontStyle.FontStyleBold;
                }
                else
                {
                    return FontStyle.FontStyleBoldItalic;
                }
            }
        }
        return FontStyle.FontStyleRegular;
    }
};

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
CFont.prototype.asc_getFontId = function() { return this.id; };
CFont.prototype.asc_getFontName = function() { return this.name; };
CFont.prototype.asc_getFontThumbnail = function() { return this.thumbnail; };
CFont.prototype.asc_getFontType = function() { return this.type; };

var ImageLoadStatus =
{
    Loading : 0,
    Complete : 1
};

function CImage(src)
{
    this.src    = src;
    this.Image  = null;
    this.Status = ImageLoadStatus.Complete;
}

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

// ALL_FONTS_PART -------------------------------------------------------------

    if (undefined === window["__fonts_files"] && window["native"]["GenerateAllFonts"])
    {
        // тогда должны быть глобальные переменные такие, без window
        window["native"]["GenerateAllFonts"]();
    }

    var __len_files = window["__fonts_files"].length;
    var g_font_files = new Array(__len_files);
    for (var i = 0; i < __len_files; i++)
    {
        g_font_files[i] = new CFontFileLoader(window["__fonts_files"][i]);
    }

    var __len_infos = window["__fonts_infos"].length;
    var g_font_infos = new Array(__len_infos);
	
    for (var i = 0; i < __len_infos; i++)
    {
        var _info = window["__fonts_infos"][i];
        g_font_infos[i] = new CFontInfo(_info[0], i, 0, _info[1], _info[2], _info[3], _info[4], _info[5], _info[6], _info[7], _info[8]);
        g_map_font_index[_info[0]] = i;
    }

    /////////////////////////////////////////////////////////////////////
    // а вот это наш шрифт - аналог wingdings3
    var _wngds3 = new CFontFileLoader("ASC.ttf");
    _wngds3.Status = 0;
    var _ind_wngds3 = g_fonts_streams.length;
    g_fonts_streams[_ind_wngds3] = AscFonts.CreateFontData2("AAEAAAARAQAABAAQTFRTSMgBAWkAAAIMAAAACU9TLzI5/eoAAAABmAAAAGBWRE1Yb8J3OwAAAhgAAAXgY21hcPBr8H4AAAjAAAAASGN2dCBAjTlRAAASGAAAAn5mcGdtgM3J1AAACQgAAAdFZ2FzcAAXAAkAABmgAAAAEGdseWalB9HFAAAUmAAAAORoZG14G81RIAAAB/gAAADIaGVhZAUoUMgAAAEcAAAANmhoZWEOZANxAAABVAAAACRobXR4FGIB2gAAAfgAAAAUbG9jYQBoALoAABV8AAAADG1heHAITQdkAAABeAAAACBuYW1lDC7+vAAAFYgAAAPJcG9zdONgvM0AABlUAAAASXByZXB9uZ8bAAAQUAAAAcYAAQAAAAEAAPQVs0xfDzz1ABsIAAAAAADPTriwAAAAAM+3TU8AgAAABnUFyAAAAAwAAQAAAAAAAAABAAAHbP5QAAAHIQCA/foGdQABAAAAAAAAAAAAAAAAAAAABQABAAAABQAJAAIAAAAAAAIAEAAUAE0AAAfoB0UAAAAAAAMFGAGQAAUAAATOBM4AAAMWBM4EzgAAAxYAZAMgDAAFBAECAQgHBwcHAAAAAAAAAAAAAAAAAAAAAE1TICAAQPAi8DgGKwGkADEHbAGwgAAAAAAAAAD/////AAAAIAAABAAAgAAAAAAE0gAAByEArQRvAK0AAAAFZAEBZGQAAAAAAAABAAEBAQEBAAwA+Aj/AAgACP/+AAkACP/9AAoACf/+AAsACv/+AAwAC//+AA0ADP/9AA4ADf/9AA8ADv/9ABAADv/9ABEAD//9ABIAEf/8ABMAEv/7ABQAE//7ABUAFP/7ABYAFf/7ABcAFv/7ABgAF//7ABkAGP/6ABoAGP/6ABsAGP/6ABwAGf/7AB0AGv/7AB4AHP/5AB8AHf/5ACAAHv/5ACEAH//4ACIAIP/5ACMAIf/5ACQAIf/4ACUAIv/4ACYAI//4ACcAJP/4ACgAJf/4ACkAJv/3ACoAKP/2ACsAKf/2ACwAKf/2AC0AKv/2AC4AKv/3AC8AK//2ADAALP/2ADEALf/2ADIALv/2ADMAL//1ADQAMP/1ADUAMf/1ADYAM//0ADcANP/0ADgANP/0ADkANf/zADoANv/zADsAN//zADwAOP/zAD0AOf/zAD4AOf/zAD8AOv/zAEAAO//yAEEAPP/zAEIAPf/yAEMAPv/yAEQAP//xAEUAQP/xAEYAQf/xAEcAQv/xAEgAQ//xAEkARP/xAEoARf/wAEsARv/wAEwARv/wAE0ASP/vAE4ASf/vAE8ASf/vAFAASv/vAFEAS//uAFIATP/uAFMATf/vAFQATv/vAFUAT//uAFYAT//uAFcAUP/uAFgAUf/uAFkAU//tAFoAVP/sAFsAVf/sAFwAVv/sAF0AV//sAF4AWP/sAF8AWf/sAGAAWf/rAGEAWf/rAGIAWv/rAGMAW//rAGQAXP/rAGUAXv/qAGYAX//qAGcAYP/qAGgAYf/qAGkAYv/qAGoAYv/pAGsAY//pAGwAZP/pAG0AZf/pAG4AZv/pAG8AZ//pAHAAaP/oAHEAav/nAHIAav/nAHMAa//nAHQAa//nAHUAbP/nAHYAbf/nAHcAbv/mAHgAb//nAHkAcP/nAHoAcf/nAHsAcv/mAHwAc//mAH0Adf/lAH4Adf/lAH8Adv/lAIAAd//lAIEAeP/kAIIAef/kAIMAev/kAIQAev/kAIUAe//kAIYAfP/kAIcAff/kAIgAff/jAIkAf//iAIoAgP/iAIsAgf/iAIwAgv/iAI0Ag//iAI4AhP/iAI8Ahf/iAJAAhv/hAJEAh//hAJIAh//hAJMAiP/hAJQAiv/gAJUAiv/gAJYAi//gAJcAjP/gAJgAjf/gAJkAjv/fAJoAj//fAJsAkP/fAJwAkP/fAJ0Akf/fAJ4Akv/fAJ8Ak//fAKAAlf/eAKEAlv/dAKIAl//dAKMAmP/dAKQAmf/dAKUAmv/dAKYAmv/dAKcAmv/dAKgAm//cAKkAnP/cAKoAnf/cAKsAnv/cAKwAoP/bAK0Aof/bAK4Aov/bAK8Ao//aALAAo//bALEApP/bALIApf/aALMApv/aALQAp//aALUAqP/aALYAqf/aALcAqv/ZALgAq//ZALkArP/YALoArP/YALsArf/YALwArv/YAL0Ar//YAL4AsP/YAL8Asf/XAMAAsv/XAMEAs//XAMIAtP/XAMMAtf/XAMQAtv/WAMUAt//WAMYAuP/WAMcAuf/VAMgAuv/VAMkAu//VAMoAu//VAMsAvP/VAMwAvf/VAM0Avv/VAM4Avv/VAM8Av//VANAAwf/TANEAwv/TANIAw//TANMAxP/TANQAxf/TANUAxv/TANYAx//TANcAyP/T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");
    _wngds3.SetStreamIndex(_ind_wngds3);
    g_font_files.push(_wngds3);

    var _ind_info_wngds3 = g_font_infos.length;
    g_font_infos[_ind_info_wngds3] = new CFontInfo("ASCW3", 0, FONT_TYPE_ADDITIONAL, g_font_files.length - 1, 0, -1, -1, -1, -1, -1, -1);
    g_map_font_index["ASCW3"] = _ind_info_wngds3;
    /////////////////////////////////////////////////////////////////////

    // удаляем временные переменные
    delete window["__fonts_files"];
    delete window["__fonts_infos"];

    //------------------------------------------------------export------------------------------------------------------
    var prot;
    window['AscFonts'] = window['AscFonts'] || {};
    window['AscFonts'].g_font_files = g_font_files;
    window['AscFonts'].g_font_infos = g_font_infos;
    window['AscFonts'].g_map_font_index = g_map_font_index;
    window['AscFonts'].g_fonts_streams = g_fonts_streams;

    window['AscFonts'].FONT_TYPE_ADDITIONAL = FONT_TYPE_ADDITIONAL;
    window['AscFonts'].FONT_TYPE_STANDART = FONT_TYPE_STANDART;
    window['AscFonts'].FONT_TYPE_EMBEDDED = FONT_TYPE_EMBEDDED;
    window['AscFonts'].FONT_TYPE_ADDITIONAL_CUT = FONT_TYPE_ADDITIONAL_CUT;

    window['AscFonts'].CFontFileLoader = CFontFileLoader;
    window['AscFonts'].GenerateMapId = GenerateMapId;
    window['AscFonts'].CFontInfo = CFontInfo;
    window['AscFonts'].CFont = CFont;
    prot = CFont.prototype;
    prot['asc_getFontId'] = prot.asc_getFontId;
    prot['asc_getFontName'] = prot.asc_getFontName;
    prot['asc_getFontThumbnail'] = prot.asc_getFontThumbnail;
    prot['asc_getFontType'] = prot.asc_getFontType;
    window['AscFonts'].ImageLoadStatus = ImageLoadStatus;
    window['AscFonts'].CImage = CImage;
    window['AscFonts'].DecodeBase64 = DecodeBase64;

})(window, window.document);

// сначала хотел писать "вытеснение" из этого мапа.
// но тогда нужно хранить base64 строки. Это не круто. По памяти - даже
// выигрыш будет. Не особо то шрифты жмутся lzw или deflate
// поэтому лучше из памяти будем удалять base64 строки
// ----------------------------------------------------------------------------