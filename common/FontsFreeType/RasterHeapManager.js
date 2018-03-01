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

    function CRasterHeapLineFree()
    {
        this.Y      = 0;
        this.Height = 0;
    }

    function CRasterDataInfo()
    {
        this.Chunk = null;
        this.Line = null;
        this.Index = 0;
    }

    function CRasterHeapLine()
    {
        this.Y = 0;
        this.Height = 0;
        this.Count = 0;
        this.CountBusy = 0;
        this.Images = null;
        this.Index = 0;
    }
    CRasterHeapLine.prototype =
    {
        CreatePlaces : function(width, height, widthLine)
        {
            this.Height = height;
            this.Count = (widthLine / width) >> 0;

            var _size = this.Count;
            var arr = null;
            if (typeof(Int8Array) != 'undefined' && !window.opera)
                arr = new Int8Array(_size);
            else
                arr = new Array(_size);

            for (var i=0;i<_size;i++)
                arr[i] = 0;

            this.Images = arr;
        },

        Alloc : function()
        {
            if (this.Count == this.CountBusy)
                return -1;

            var arr = this.Images;
            if (arr[this.CountBusy] == 0)
            {
                arr[this.CountBusy] = 1;
                this.CountBusy += 1;
                return this.CountBusy - 1;
            }

            var _len = this.Count;
            for (var i = 0; i < _len; i++)
            {
                if (arr[i] == 0)
                {
                    arr[i] = 1;
                    this.CountBusy += 1;
                    return i;
                }
            }
            return -1;
        },

        Free : function(index)
        {
            if (this.Images[index] == 1)
            {
                this.Images[index] = 0;
                this.CountBusy -= 1;
            }
            return this.CountBusy;
        }
    };

    function CRasterHeapChuck()
    {
        this.CanvasImage    = null;
        this.CanvasCtx      = null;

        this.Width  = 0;
        this.Height = 0;

        this.LinesFree = [];
        this.LinesBusy = [];

        this.CurLine = null;

        this.FindOnlyEqualHeight = false;
    }
    CRasterHeapChuck.prototype =
    {
        Create : function(width, height)
        {
            this.Width  = width;
            this.Height = height;

            this.CanvasImage = document.createElement('canvas');
            this.CanvasImage.width  = width;
            this.CanvasImage.height = height;

            this.CanvasCtx = this.CanvasImage.getContext('2d');
            this.CanvasCtx.globalCompositeOperation = "source-atop";

            var _freeLine = new CRasterHeapLineFree();
            _freeLine.Y         = 0;
            _freeLine.Height    = this.Height;
            this.LinesFree[0]   = _freeLine;
        },

        Clear : function()
        {
            this.LinesBusy.splice(0, this.LinesBusy.length);
            this.LinesFree.splice(0, this.LinesFree.length);

            var _freeLine = new CRasterHeapLineFree();
            _freeLine.Y         = 0;
            _freeLine.Height    = this.Height;
            this.LinesFree[0]   = _freeLine;
        },

        Alloc : function(width, height)
        {
            var _need_height = Math.max(width, height);
            var _busy_len = this.LinesBusy.length;
            for (var i = 0; i < _busy_len; i++)
            {
                var _line = this.LinesBusy[i];
                if (_line.Height >= _need_height)
                {
                    var _index = _line.Alloc();
                    if (-1 != _index)
                    {
                        var _ret = new CRasterDataInfo();
                        _ret.Chunk = this;
                        _ret.Line = _line;
                        _ret.Index = _index;
                        return _ret;
                    }
                }
            }

            // линию не нашли. Начинаем искать из свободной памяти
            // ищем 3/2 от нужного размера. и параллельно 1
            var _need_height1 = (3 * _need_height) >> 1;
            if (this.FindOnlyEqualHeight)
                _need_height1 = _need_height;

            var _free_len = this.LinesFree.length;
            var _index_found_koef1 = -1;
            for (var i = 0; i < _free_len; i++)
            {
                var _line = this.LinesFree[i];
                if (_line.Height >= _need_height1)
                {
                    // нашли
                    var _new_line = new CRasterHeapLine();
                    _new_line.CreatePlaces(_need_height1, _need_height1, this.Width);
                    _new_line.Y = _line.Y;
                    _new_line.Index = this.LinesBusy.length;
                    this.LinesBusy.push(_new_line);

                    _line.Y += _need_height1;
                    _line.Height -= _need_height1;

                    if (_line.Height == 0)
                        this.LinesFree.splice(i, 1);

                    var _ret = new CRasterDataInfo();
                    _ret.Chunk = this;
                    _ret.Line = _new_line;
                    _ret.Index = _new_line.Alloc();
                    return _ret;
                }
                else if (_line.Height >= _need_height && -1 == _index_found_koef1)
                {
                    _index_found_koef1 = i;
                }
            }

            // 3/2 не нашли. если нашли для 1, то выделяем там
            if (-1 != _index_found_koef1)
            {
                var _line = this.LinesFree[_index_found_koef1];

                var _new_line = new CRasterHeapLine();
                _new_line.CreatePlaces(_need_height, _need_height, this.Width);
                _new_line.Y = _line.Y;
                _new_line.Index = this.LinesBusy.length;
                this.LinesBusy.push(_new_line);

                _line.Y += _need_height;
                _line.Height -= _need_height;

                if (_line.Height == 0)
                    this.LinesFree.splice(i, 1);

                var _ret = new CRasterDataInfo();
                _ret.Chunk = this;
                _ret.Line = _new_line;
                _ret.Index = _new_line.Alloc();
                return _ret;
            }

            // не нашли.
            return null;
        },

        Free : function(obj)
        {
            var _refs = obj.Line.Free(obj.Index);
            if (_refs == 0)
            {
                // нужно удалить линию и перебить всем оставшимся индексы

                var _line = obj.Line;
                this.LinesBusy.splice(_line.Index, 1);

                var _lines_busy = this.LinesBusy;
                var _busy_len = _lines_busy.length;
                for (var i = _line.Index; i < _busy_len; i++)
                    _lines_busy[i].Index = i;

                // теперь нужно поправить linesfree
                var y1 = _line.Y;
                var y2 = _line.Y + _line.Height;
                var _lines_free = this.LinesFree;
                var _free_len = _lines_free.length;

                var _ind_prev = -1;
                var _ind_next = -1;
                for (var i = 0; i < _free_len; i++)
                {
                    var _line_f = _lines_free[i];
                    if (-1 == _ind_prev)
                    {
                        if (y1 == (_line_f.Y + _line_f.Height))
                            _ind_prev = i;
                    }
                    else if (-1 == _ind_next)
                    {
                        if (y2 == _line_f.Y)
                            _ind_next = i;
                    }
                    else
                    {
                        break;
                    }
                }

                // нашли прилегаюую свободную память. теперь нужно их склеить, или создать новую
                if (-1 != _ind_prev && -1 != _ind_next)
                {
                    _lines_free[_ind_prev].Height += (_line.Height + _lines_free[_ind_next].Height);
                    _lines_free.splice(_ind_next, 1);
                }
                else if (-1 != _ind_prev)
                {
                    _lines_free[_ind_prev].Height += _line.Height;
                }
                else if (-1 != _ind_next)
                {
                    _lines_free[_ind_next].Y -= _line.Height;
                    _lines_free[_ind_next].Height += _line.Height;
                }
                else
                {
                    var _new_line = new CRasterHeapLineFree();
                    _new_line.Y = _line.Y;
                    _new_line.Height = _line.Height;
                    _lines_free.push(_new_line);
                }
                _line = null;
            }
        }
    };

    function CRasterHeapTotal(_size)
    {
        this.ChunkHeapSize = (undefined === _size) ? 3000 : _size; // 4 * 3000 * 3000 = 36Mb
        this.Chunks = [];
    }
    CRasterHeapTotal.prototype =
    {
        Clear : function()
        {
            var _len = this.Chunks.length;
            for (var i = 0; i < _len; i++)
            {
                this.Chunks[i].Clear();
            }

            // теперь наверное удалим и память лишнюю
            if (_len > 1)
                this.Chunks.splice(1, _len - 1);
        },

        Alloc : function(width, height)
        {
            var _len = this.Chunks.length;
            for (var i = 0; i < _len; i++)
            {
                var _ret = this.Chunks[i].Alloc(width, height);
                if (null != _ret)
                    return _ret;
            }
            this.HeapAlloc(this.ChunkHeapSize, this.ChunkHeapSize);
            return this.Chunks[_len].Alloc(width, height);
        },

        HeapAlloc : function(width, height)
        {
            var _chunk = new CRasterHeapChuck();
            _chunk.Create(width, height);
            this.Chunks[this.Chunks.length] = _chunk;
        },

        CreateFirstChuck : function(_w, _h)
        {
            if (0 == this.Chunks.length)
            {
                this.Chunks[0] = new CRasterHeapChuck();
                this.Chunks[0].Create((undefined == _w) ? this.ChunkHeapSize : _w, (undefined == _h) ? this.ChunkHeapSize : _h);
            }
        }
    };

    window['AscFonts'] = window['AscFonts'] || {};
    window['AscFonts'].CRasterHeapTotal = CRasterHeapTotal;

})(window, undefined);