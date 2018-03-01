/*
 * (c) Copyright Ascensio System SIA 2010-2018
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

(function(window, undefined) {

    function CFontFilesCache()
    {
        this.m_oLibrary = null;
        this.m_lMaxSize = 1000;
        this.m_lCurrentSize = 0;
        this.Fonts = {};

        this.LoadFontFile = function(stream_index, name, faceindex, fontManager)
        {
            var args = new AscFonts.FT_Open_Args();
            args.flags = 0x02;
            args.stream = AscFonts.g_fonts_streams[stream_index];

            var face = this.m_oLibrary.FT_Open_Face(args, faceindex);
            if (null == face)
                return null;

            var font = new AscFonts.CFontFile(name, faceindex);

            font.m_lUnits_Per_Em = face.units_per_EM;
            font.m_lAscender = face.ascender;
            font.m_lDescender = face.descender;
            font.m_lLineHeight = face.height;

            // flag for use always typo (os2 spec)
            var bIsUseTypeAttack = (face.os2 && ((face.os2.fsSelection & 128) == 128)) ? true : false;
            if (fontManager.IsCellMode)
                bIsUseTypeAttack = false;

            if (fontManager.IsUseWinOS2Params &&
                face.os2 && face.os2.version != 0xFFFF &&
                !bIsUseTypeAttack)
            {
                var _winAscent = face.os2.usWinAscent;
                var _winDescent = -face.os2.usWinDescent;

                // experimantal: for cjk fonts lineheight *= 1.3
                if ((face.os2.ulUnicodeRange2 & 0x2DF00000) != 0)
                {
                    var _addidive = (0.3 * (_winAscent - _winDescent)) >> 0;
                    _winAscent += ((_addidive + 1) >> 1);
                    _winDescent -= (_addidive >> 1);
                }

                // TODO:
                // https://www.microsoft.com/typography/otspec/recom.htm - hhea, not typo!!!
                if (font.m_lLineHeight < (_winAscent - _winDescent))
                {
                    font.m_lAscender = _winAscent;
                    font.m_lDescender = _winDescent;
                    font.m_lLineHeight = _winAscent - _winDescent;
                }
            }

            /*
            // что-то типо этого в экселе... пока выключаем
            if (fontManager.IsCellMode)
            {
                var _addidive = (0.15 * font.m_lLineHeight) >> 0;
                font.m_lAscender += ((_addidive + 1) >> 1);
                font.m_lDescender -= (_addidive >> 1);
                font.m_lLineHeight += _addidive;
            }
            */

            font.m_nNum_charmaps = face.num_charmaps;

            font.m_pFace = face;
            font.LoadDefaultCharAndSymbolicCmapIndex();
            font.m_nError = AscFonts.FT_Set_Char_Size(face, 0, font.m_fSize * 64, 0, 0);

            if (!font.IsSuccess())
            {
                font = null;
                face = null;
                return null;
            }

            font.ResetTextMatrix();
            font.ResetFontMatrix();

            if (true === font.m_bUseKerning)
            {
                font.m_bUseKerning = ((face.face_flags & 64) != 0 ? true : false);
            }

            return font;
        };

        this.LockFont = function(stream_index, fontName, faceIndex, fontSize, _ext, fontManager)
        {
            var key = fontName + faceIndex + fontSize;
            if (undefined !== _ext)
                key += _ext;
            var pFontFile = this.Fonts[key];
            if (pFontFile)
                return pFontFile;

            pFontFile = this.Fonts[key] = this.LoadFontFile(stream_index, fontName, faceIndex, fontManager);
            return pFontFile;
        };
    }

    function CDefaultFont()
    {
        this.m_oLibrary = null;
        this.m_arrDefaultFont = new Array(4);

        this.SetDefaultFont = function(sFamilyName)
        {
            var fontInfo = g_fontApplication.GetFontInfo(sFamilyName);
            var font = null;

            var _defaultIndex = fontInfo.indexR;
            if (-1 == _defaultIndex)
                _defaultIndex = fontInfo.indexI;
            if (-1 == _defaultIndex)
                _defaultIndex = fontInfo.indexB;
            if (-1 == _defaultIndex)
                _defaultIndex = fontInfo.indexBI;

            var _indexR = fontInfo.indexR != -1 ? fontInfo.indexR : _defaultIndex;
            var _indexI = fontInfo.indexI != -1 ? fontInfo.indexI : _defaultIndex;
            var _indexB = fontInfo.indexB != -1 ? fontInfo.indexB : _defaultIndex;
            var _indexBI = fontInfo.indexBI != -1 ? fontInfo.indexBI : _defaultIndex;

            var fontInfos = AscFonts.g_font_infos;
            font = fontInfos[_indexR];
            this.m_arrDefaultFont[0] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexR);
            this.m_arrDefaultFont[0].UpdateStyles(false, false);

            font = fontInfos[_indexB];
            this.m_arrDefaultFont[1] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexB);
            this.m_arrDefaultFont[1].UpdateStyles(true, false);

            font = fontInfos[_indexI];
            this.m_arrDefaultFont[2] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexI);
            this.m_arrDefaultFont[2].UpdateStyles(false, true);

            font = fontInfos[_indexBI];
            this.m_arrDefaultFont[3] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexBI);
            this.m_arrDefaultFont[3].UpdateStyles(true, true);
        };

        this.GetDefaultFont = function(bBold, bItalic)
        {
            var nIndex = (bBold ? 1 : 0) + (bItalic ? 2 : 0);
            return this.m_arrDefaultFont[nIndex];
        };
    }

    // params: { mode: "cell" };
    function CFontManager(params)
    {
        this.m_oLibrary = null;

        this.m_pFont = null;
        this.m_oGlyphString = new AscFonts.CGlyphString();

        this.error = 0;

        this.fontName = undefined;

        this.m_bUseDefaultFont = false;
        this.m_fCharSpacing = 0.0;
        this.m_bStringGID = false;

        this.m_oFontsCache = null;
        this.m_oDefaultFont = new CDefaultFont();

        this.m_lUnits_Per_Em = 0;
        this.m_lAscender = 0;
        this.m_lDescender = 0;
        this.m_lLineHeight = 0;

        this.RasterMemory = null;

        this.LOAD_MODE = 40970;

        this.IsCellMode = (params && params.mode == "cell") ? true : false;
        this.IsAdvanceNeedBoldFonts = this.IsCellMode;
        this.IsUseWinOS2Params = true;

        this.AfterLoad = function()
        {
            if (null == this.m_pFont)
            {
                this.m_lUnits_Per_Em = 0;
                this.m_lAscender = 0;
                this.m_lDescender = 0;
                this.m_lLineHeight = 0;
            }
            else
            {
                var f = this.m_pFont;
                this.m_lUnits_Per_Em = f.m_lUnits_Per_Em;
                this.m_lAscender = f.m_lAscender;
                this.m_lDescender = f.m_lDescender;
                this.m_lLineHeight = f.m_lLineHeight;

                f.CheckHintsSupport();
            }
        };

        this.Initialize = function(is_init_raster_memory)
        {
            this.m_oLibrary = new AscFonts.FT_Library();
            this.m_oLibrary.Init();

            this.m_oFontsCache = new CFontFilesCache();
            this.m_oFontsCache.m_oFontManager = this;
            this.m_oFontsCache.m_oLibrary = this.m_oLibrary;

            if (is_init_raster_memory === true)
            {
                if (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isArm)
                {
                    this.RasterMemory = new AscFonts.CRasterHeapTotal();
                    this.RasterMemory.CreateFirstChuck();
                }
            }
        };

        this.ClearFontsRasterCache = function()
        {
            for (var i in this.m_oFontsCache.Fonts)
            {
                if (this.m_oFontsCache.Fonts[i])
                    this.m_oFontsCache.Fonts[i].ClearCache();
            }
            //this.m_oFontsCache.Fonts = [];
            this.ClearRasterMemory();
        };

        this.ClearRasterMemory = function()
        {
            // быстрая очистка всей памяти (убирание всех дыр)
            if (null == this.RasterMemory || null == this.m_oFontsCache)
                return;

            var _fonts = this.m_oFontsCache.Fonts;
            for (var i in _fonts)
            {
                if (_fonts[i] !== undefined && _fonts[i] != null)
                    _fonts[i].ClearCacheNoAttack();
            }

            this.RasterMemory.Clear();
        };

        this.SetDefaultFont = function(name)
        {
            this.m_oDefaultFont.m_oLibrary = this.m_oLibrary;
            this.m_oDefaultFont.SetDefaultFont(name);
        };

        this.UpdateSize = function(dOldSize, dDpi, dNewDpi)
        {
            if (0 == dNewDpi)
                dNewDpi = 72.0;
            if (0 == dDpi)
                dDpi = 72.0;

            return dOldSize * dDpi / dNewDpi;
        };

        this.LoadString = function(wsBuffer, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            this.m_oGlyphString.SetString(wsBuffer, fX, fY);
            this.m_pFont.GetString(this.m_oGlyphString);

            return true;
        };

        this.LoadString2 = function(wsBuffer, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            this.m_oGlyphString.SetString(wsBuffer, fX, fY);
            this.m_pFont.GetString2(this.m_oGlyphString);

            return true;
        };

        this.LoadString3 = function(gid, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            this.SetStringGID(true);
            this.m_oGlyphString.SetStringGID (gid, fX, fY);
            this.m_pFont.GetString2(this.m_oGlyphString);
            this.SetStringGID(false);

            return true;
        };

        this.LoadString3C = function(gid, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            this.SetStringGID(true);

            // это SetString
            var string = this.m_oGlyphString;

            string.m_fX = fX + string.m_fTransX;
            string.m_fY = fY + string.m_fTransY;

            string.m_nGlyphsCount = 1;
            string.m_nGlyphIndex  = 0;

            var _g = string.GetFirstGlyph();
            _g.bBitmap = false;
            _g.oBitmap = null;
            _g.eState = AscFonts.EGlyphState.glyphstateNormal;
            _g.lUnicode = gid;

            this.m_pFont.GetString2C(string);

            this.SetStringGID(false);
            return true;
        };

        this.LoadString2C = function(wsBuffer, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            // это SetString
            var string = this.m_oGlyphString;

            string.m_fX = fX + string.m_fTransX;
            string.m_fY = fY + string.m_fTransY;

            string.m_nGlyphsCount = 1;
            string.m_nGlyphIndex  = 0;

            var _g = string.GetFirstGlyph();
            _g.bBitmap = false;
            _g.oBitmap = null;
            _g.eState = AscFonts.EGlyphState.glyphstateNormal;
            _g.lUnicode = wsBuffer.charCodeAt(0);

            this.m_pFont.GetString2C(string);
            return string.m_fEndX;
        };

        this.LoadString4C = function(lUnicode, fX, fY)
        {
            if (!this.m_pFont)
                return false;

            // это SetString
            var string = this.m_oGlyphString;

            string.m_fX = fX + string.m_fTransX;
            string.m_fY = fY + string.m_fTransY;

            string.m_nGlyphsCount = 1;
            string.m_nGlyphIndex  = 0;

            var _g = string.GetFirstGlyph();
            _g.bBitmap = false;
            _g.oBitmap = null;
            _g.eState = AscFonts.EGlyphState.glyphstateNormal;
            _g.lUnicode = lUnicode;

            this.m_pFont.GetString2C(string);
            return string.m_fEndX;
        };

        this.LoadStringPathCode = function(code, isGid, fX, fY, worker)
        {
            if (!this.m_pFont)
                return false;

            this.SetStringGID(isGid);

            // это SetString
            var string = this.m_oGlyphString;

            string.m_fX = fX + string.m_fTransX;
            string.m_fY = fY + string.m_fTransY;

            string.m_nGlyphsCount = 1;
            string.m_nGlyphIndex  = 0;

            var _g = string.GetFirstGlyph();
            _g.bBitmap = false;
            _g.oBitmap = null;
            _g.eState = AscFonts.EGlyphState.glyphstateNormal;
            _g.lUnicode = code;

            this.m_pFont.GetStringPath(string, worker);

            this.SetStringGID(false);

            return true;
        };

        this.LoadChar = function(lUnicode)
        {
            if (!this.m_pFont)
                return false;

            return this.m_pFont.GetChar2(lUnicode);
        };

        this.MeasureChar = function(lUnicode, is_raster_distances)
        {
            if (!this.m_pFont)
                return;

            return this.m_pFont.GetChar(lUnicode, is_raster_distances);
        };

        this.GetKerning = function(unPrevGID, unGID)
        {
            if (!this.m_pFont)
                return;

            return this.m_pFont.GetKerning(unPrevGID, unGID);
        };

        this.MeasureString = function()
        {
            var oPoint = new AscFonts.CGlyphRect();
            var len = this.m_oGlyphString.GetLength();
            if (len <= 0)
                return oPoint;

            var fTop = 0xFFFF, fBottom = -0xFFFF, fLeft = 0xFFFF, fRight = -0xFFFF;
            for (var nIndex = 0; nIndex < len; ++nIndex)
            {
                var oSizeTmp = this.m_oGlyphString.GetBBox (nIndex);

                if (fBottom < oSizeTmp.fBottom)
                    fBottom = oSizeTmp.fBottom;

                if (fTop > oSizeTmp.fTop)
                    fTop = oSizeTmp.fTop;

                if (fLeft > oSizeTmp.fLeft)
                    fLeft = oSizeTmp.fLeft;

                if (fRight < oSizeTmp.fRight)
                    fRight = oSizeTmp.fRight;
            }

            oPoint.fX = fLeft;
            oPoint.fY = fTop;

            oPoint.fWidth  = Math.abs((fRight - fLeft));
            oPoint.fHeight = Math.abs((fTop - fBottom));

            return oPoint;
        };

        this.MeasureString2 = function()
        {
            var oPoint = new AscFonts.CGlyphRect();

            if (this.m_oGlyphString.GetLength() <= 0)
                return oPoint;

            var fTop = 0xFFFF, fBottom = -0xFFFF, fLeft = 0xFFFF, fRight = -0xFFFF;

            var oSizeTmp = this.m_oGlyphString.GetBBox2();

            oPoint.fX = oSizeTmp.fLeft;
            oPoint.fY = oSizeTmp.fTop;

            oPoint.fWidth  = Math.abs((oSizeTmp.fRight - oSizeTmp.fLeft));
            oPoint.fHeight = Math.abs((oSizeTmp.fTop - oSizeTmp.fBottom));

            return oPoint;
        };

        this.GetNextChar2 = function()
        {
            return this.m_oGlyphString.GetNext();
        };

        this.IsSuccess = function()
        {
            return (0 == this.error);
        };

        this.SetTextMatrix = function(fA, fB, fC, fD, fE, fF)
        {
            if (!this.m_pFont)
                return false;

            if (this.m_pFont.SetTextMatrix (fA, fB, fC, fD, 0, 0))
                this.m_oGlyphString.SetCTM(fA, fB, fC, fD, 0, 0);
            this.m_oGlyphString.SetTrans(fE, fF);

            return true;
        };

        this.SetTextMatrix2 = function(fA, fB, fC, fD, fE, fF)
        {
            if (!this.m_pFont)
                return false;

            this.m_pFont.SetTextMatrix (fA, fB, fC, fD, 0, 0);
            this.m_oGlyphString.SetCTM(fA, fB, fC, fD, 0, 0);
            this.m_oGlyphString.SetTrans(fE, fF);

            return true;
        };

        this.SetStringGID = function(bStringGID)
        {
            this.m_bStringGID = bStringGID;

            if (!this.m_pFont)
                return;

            this.m_pFont.SetStringGID(this.m_bStringGID);
        };

        this.SetHintsProps = function(bIsHinting, bIsSubpixHinting)
        {
            if (undefined === AscCommon.g_fontManager.m_oLibrary.tt_hint_props)
                return;

            if (bIsHinting && bIsSubpixHinting)
            {
                this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
                this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = true;

                this.LOAD_MODE = 40968;
            }
            else if (bIsHinting)
            {
                this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
                this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;

                this.LOAD_MODE = 40968;
            }
            else
            {
                this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
                this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;

                this.LOAD_MODE = 40970;
            }
        };

        this.SetAdvanceNeedBoldFonts = function(value)
        {
            this.IsAdvanceNeedBoldFonts = value;
        };

        this.LoadFont = function(fontFile, faceIndex, size, isBold, isItalic, needBold, needItalic, isNoSetupToManager)
        {
            var _ext = "";
            if (needBold)
                _ext += "nbold";
            if (needItalic)
                _ext += "nitalic";

            var pFontFile = this.m_oFontsCache.LockFont(fontFile.stream_index, fontFile.Id, faceIndex, size, _ext, this);

            if (!pFontFile)
                pFontFile = this.m_oDefaultFont.GetDefaultFont(isBold, isItalic);

            if (!pFontFile)
                return null;

            pFontFile.m_oFontManager = this;

            pFontFile.SetNeedBold(needBold);
            pFontFile.SetNeedItalic(needItalic);

            pFontFile.SetStringGID(this.m_bStringGID);
            pFontFile.SetCharSpacing(this.m_fCharSpacing);

            if (isNoSetupToManager !== true)
            {
				this.m_pFont = pFontFile;
				this.m_oGlyphString.ResetCTM();
                this.AfterLoad();
            }

            return pFontFile;
        };
    }

    window['AscFonts'].CFontManager = CFontManager;
    window['AscFonts'].CFontFilesCache = CFontFilesCache;
})(window);
