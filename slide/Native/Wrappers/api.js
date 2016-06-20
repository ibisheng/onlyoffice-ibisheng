/*
 * (c) Copyright Ascensio System SIA 2010-2016
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

window["use_native_fonts_only"] = true;
// -------------------------------------------------

// declarate unused methods and objects
window["ftm"] = FT_Memory;


Asc['asc_docs_api'].prototype["Native_Editor_Initialize_Settings"] = function(_params)
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
                AscCommonSlide.GlobalSkin.STYLE_THUMBNAIL_WIDTH = _params[_current.pos++];
                break;
            }
            case 1:
            {
                AscCommonSlide.GlobalSkin.STYLE_THUMBNAIL_HEIGHT = _params[_current.pos++];
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
                    AscCommon.CollaborativeEditing.m_bGlobalLock = true;

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



Asc['asc_docs_api'].prototype["CheckSlideBounds"] = function(nSlideIndex){
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.WordControl.m_oLogicDocument.Draw(nSlideIndex, oBoundsChecker);
    var oBounds = oBoundsChecker.Bounds;
    return [
        oBounds.min_x, oBounds.max_x, oBounds.min_y, oBounds.max_y
    ]
}

Asc['asc_docs_api'].prototype["GetNativePageMeta"] = function(pageIndex)
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