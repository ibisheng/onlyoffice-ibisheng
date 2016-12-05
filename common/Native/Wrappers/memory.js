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

function CPointer()
{
    this.obj    = null;
    this.data   = null;
    this.pos    = 0;
}
function dublicate_pointer(p)
{
    if (null == p)
        return null;

    var d = new CPointer();
    d.data = p.data;
    d.pos = p.pos;
    return d;
}
function copy_pointer(p, size)
{
    var _p = g_memory.Alloc(size);
    for (var i = 0; i < size; i++)
        _p.data[i] = p.data[p.pos + i];
    return _p;
}

function FT_Memory()
{
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.ctx    = this.canvas.getContext('2d');

    this.Alloc = function(size)
    {
        var p = new CPointer();
        p.obj = this.ctx.createImageData(1,parseInt((size + 3) / 4));
        p.data = p.obj.data;
        p.pos = 0;
        return p;
    }
    this.AllocHeap = function()
    {
        // TODO: 
    }
    this.CreateStream = function(size)
    {
        console.log("not impl");
    }
}
var g_memory = new FT_Memory();

window["ftm"] = FT_Memory;

function FT_Stream(data, size)
{
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;

    this.Seek = function(_pos)
    {
        if (_pos > this.size)
            return 85;
        this.pos = _pos;
        return 0;
    }
    this.Skip = function(_skip)
    {
        if (_skip < 0)
            return 85;
        return this.Seek(this.pos + _skip);
    }
    this.Read = function(pointer, count)
    {
        return this.ReadAt(this.pos, pointer, count);
    }
    this.ReadArray = function(count)
    {
        var read_bytes = this.size - this.pos;
        if (read_bytes > count)
            read_bytes = count;
        if (0 == read_bytes)
            return null;
        var a = new Array(read_bytes);
        for (var i = 0;i<count;i++)
            a[i] = this.data[this.pos+i];
        return a;
    }
    this.ReadAt = function(_pos, pointer, count)
    {
        if (_pos > this.size)
            return 85;
        var read_bytes = this.size - _pos;
        if (read_bytes > count)
            read_bytes = count;

        FT_Common.memcpy_p2(pointer,this.data,_pos,count);

        this.pos = _pos + read_bytes;

        if (read_bytes < count)
            return 85;

        return 0;
    }
    this.TryRead = function(pointer, count)
    {
        var read_bytes = 0;
        if (this.pos < this.size)
            return read_bytes;
        read_bytes = this.size - this.pos;
        if (read_bytes > count)
            read_bytes = count;

        FT_Common.memcpy_p2(pointer,this.data,this.pos,count);

        this.pos += read_bytes;
        return read_bytes;
    }

    // 1 bytes
    this.GetUChar = function()
    {
        if (this.cur >= this.size)
            return 0;
        return this.data[this.cur++];
    }
    this.GetChar = function()
    {
        if (this.cur >= this.size)
            return 0;
        var m = this.data[this.cur++];
        if (m > 127)
            m -= 256;
        return m;
    }
    this.GetString1 = function(len)
    {
        if (this.cur + len > this.size)
            return "";
        var t = "";
        for (var i = 0; i < len; i++)
            t += String.fromCharCode(this.data[this.cur + i]);
        this.cur += len;
        return t;
    }
    this.ReadString1 = function(len)
    {
        if (this.pos + len > this.size)
            return "";
        var t = "";
        for (var i = 0; i < len; i++)
            t += String.fromCharCode(this.data[this.pos + i]);
        this.pos += len;
        return t;
    }

    this.ReadUChar = function()
    {
        if (this.pos >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return this.data[this.pos++];
    }
    this.ReadChar = function()
    {
        if (this.pos >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        var m = this.data[this.pos++];
        if (m > 127)
            m -= 256;
        return m;
    }

    // 2 byte
    this.GetUShort = function()
    {
        if (this.cur + 1 >= this.size)
            return 0;
        return (this.data[this.cur++] << 8 | this.data[this.cur++]);
    }
    this.GetShort = function()
    {
        return FT_Common.UShort_To_Short(this.GetUShort());
    }
    this.ReadUShort = function()
    {
        if (this.pos + 1 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] << 8 | this.data[this.pos++]);
    }
    this.ReadShort = function()
    {
        return FT_Common.UShort_To_Short(this.ReadUShort());
    }
    this.GetUShortLE = function()
    {
        if (this.cur + 1 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8);
    }
    this.GetShortLE = function()
    {
        return FT_Common.UShort_To_Short(this.GetUShortLE());
    }
    this.ReadUShortLE = function()
    {
        if (this.pos + 1 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] | this.data[this.pos++] << 8);
    }
    this.ReadShortLE = function()
    {
        return FT_Common.UShort_To_Short(this.ReadUShortLE());
    }

    // 4 byte
    this.GetULong = function()
    {
        if (this.cur + 3 >= this.size)
            return 0;
        //return (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
        var s = (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
        if (s < 0)
            s += 4294967296;
        return s;
    }
    this.GetLong = function()
    {
        // 32-битные числа - по умолчанию знаковые!!!
        //return FT_Common.UintToInt(this.GetULong());
        return (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
    }
    this.ReadULong = function()
    {
        if (this.pos + 3 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        var s = (this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
        if (s < 0)
            s += 4294967296;
        return s;
    }
    this.ReadLong = function()
    {
        // 32-битные числа - по умолчанию знаковые!!!
        //return FT_Common.Uint_To_int(this.ReadULong());
        if (this.pos + 3 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
    }

    this.GetULongLE = function()
    {
        if (this.cur + 3 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
    }
    this.GetLongLE = function()
    {
        return FT_Common.Uint_To_int(this.GetULongLE());
    }
    this.ReadULongLE = function()
    {
        if (this.pos + 3 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16 | this.data[this.pos++] << 24);
    }
    this.ReadLongLE = function()
    {
        return FT_Common.Uint_To_int(this.ReadULongLE());
    }

    // 3 byte
    this.GetUOffset = function()
    {
        if (this.cur + 2 >= this.size)
            return 0;
        return (this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
    }
    this.GetUOffsetLE = function()
    {
        if (this.cur + 2 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16);
    }
    this.ReadUOffset = function()
    {
        if (this.pos + 2 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
    }
    this.ReadUOffsetLE = function()
    {
        if (this.pos + 2 >= this.size)
        {
            FT_Error = 85;
            return 0;
        }
        FT_Error = 0;
        return (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16);
    }
    this.EnterFrame = function(count)
    {
        if (this.pos >= this.size || this.size - this.pos < count)
            return 85;

        this.cur = this.pos;
        this.pos += count;
        return 0;
    }
    this.ExtractFrame = function(count, pointer)
    {
        if (null == pointer)
            pointer = new CPointer();

        var err = this.EnterFrame(count);
        if (err != 0)
            return err;

        pointer.data = this.data;
        pointer.pos = this.cur;

        this.cur = 0;
        return err;
    }
    this.ReleaseFrame = function()
    {
    }
    this.ExitFrame = function()
    {
        this.cur = 0;
    }

    this.ReadFields = function(arrayFields, structure)
    {
        // arrayFields : array {value, size, offset}
        // structures : data pointer
        var error = 0;
        var cursor = this.cur;
        var frame_accessed = false;

        var data = null;
        var pos = 0;

        var ind = 0;
        do
        {
            var value;
            var sign_shift;

            switch (arrayFields[ind].value)
            {
                case 4:  /* access a new frame */
                    error = this.EnterFrame(arrayFields[ind].offset);
                    if (error != 0)
                    {
                        if (frame_accessed === true)
                            this.ExitFrame();
                        return error;
                    }

                    frame_accessed = true;
                    cursor = this.cur;
                    ind++;
                    continue;  /* loop! */

                case 24:  /* read a byte sequence */
                case 25:   /* skip some bytes      */
                {
                    var len = arrayFields[ind].size;
                    if ( cursor + len > this.size )
                    {
                        error = 85;
                        if (frame_accessed === true)
                            this.ExitFrame();
                        return error;
                    }

                    if ( arrayFields[ind] == 24 )
                    {
                        data = structure.data;
                        pos = structure.pos + arrayFields[ind].offset;

                        for (var i=0;i<len;i++)
                            data[i] = this.data[cursor+i];
                    }
                    cursor += len;
                    ind++;
                    continue;
                }

                case 8:
                case 9:  /* read a single byte */
                    value = this.data[cursor++];
                    sign_shift = 24;
                    break;

                case 13:
                case 12:  /* read a 2-byte big-endian short */
                    value = this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 16;
                    break;

                case 15:
                case 14:  /* read a 2-byte little-endian short */
                    value = this.data[cursor++] | this.data[cursor++] << 8;
                    sign_shift = 16;
                    break;

                case 17:
                case 16:  /* read a 4-byte big-endian long */
                    value = this.data[cursor++] << 24 | this.data[cursor++] << 16 | this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 0;
                    break;

                case 19:
                case 18:  /* read a 4-byte little-endian long */
                    value = this.data[cursor++] | this.data[cursor++] << 8 | this.data[cursor++] << 16 | this.data[cursor++] << 24;
                    sign_shift = 0;
                    break;

                case 21:
                case 20:  /* read a 3-byte big-endian long */
                    value = this.data[cursor++] << 16 | this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 8;
                    break;

                case 23:
                case 22:  /* read a 3-byte little-endian long */
                    value = this.data[cursor++] | this.data[cursor++] << 8 | this.data[cursor++] << 16;
                    sign_shift = 8;
                    break;

                default:
                    /* otherwise, exit the loop */
                    this.cur = cursor;
                    if (frame_accessed === true)
                        this.ExitFrame();
                    return error;
            }

            /* now, compute the signed value is necessary */
            if ( arrayFields[ind].value & 1 )
                value = (( value << sign_shift ) >>> sign_shift) & 0xFFFFFFFF;

            /* finally, store the value in the object */

            data = structure.data;
            pos = structure.pos + arrayFields[ind].offset;
            switch (arrayFields[ind])
            {
                case 1:
                    data[pos] = value & 0xFF;
                    break;

                case 2:
                    data[pos] = (value >>> 8)&0xFF;
                    data[pos+1] = value&0xFF;
                    break;

                case 4:
                    data[pos] = (value >>> 24)&0xFF;
                    data[pos+1] = (value >>> 16)&0xFF;
                    data[pos+2] = (value >>> 8)&0xFF;
                    data[pos+3] = value&0xFF;
                    break;

                default:
                    data[pos] = (value >>> 24)&0xFF;
                    data[pos+1] = (value >>> 16)&0xFF;
                    data[pos+2] = (value >>> 8)&0xFF;
                    data[pos+3] = value&0xFF;
            }

            /* go to next field */
            ind++;
        }
        while ( 1 );

        return error;
    }
    this.ReadFields2 = function(fields, structure)
    {
        // arrayFields : array {value, size, offset}
        // structures : data pointer
        var error = 0;
        var cursor = this.cur;
        var frame_accessed = false;

        var data = null;
        var pos = 0;

        var ind = 0;
        do
        {
            var value;
            var sign_shift;

            var fval = fields[ind];
            var fsize = fields[ind+1];
            var foffset = fields[ind+2];

            switch (fval)
            {
                case 4:  /* access a new frame */
                    error = this.EnterFrame(foffset);
                    if (error != 0)
                    {
                        if (frame_accessed === true)
                            this.ExitFrame();
                        return error;
                    }

                    frame_accessed = true;
                    cursor = this.cur;
                    ind+=3;
                    continue;  /* loop! */

                case 24:  /* read a byte sequence */
                case 25:   /* skip some bytes      */
                {
                    if ( cursor + fsize > this.size )
                    {
                        error = 85;
                        if (frame_accessed === true)
                            this.ExitFrame();
                        return error;
                    }

                    if ( fval == 24 )
                    {
                        data = structure.data;
                        pos = structure.pos + arrayFields[ind].offset;

                        for (var i=0;i<len;i++)
                            data[i] = this.data[cursor+i];
                    }
                    cursor += fsize;
                    ind++;
                    continue;
                }

                case 8:
                case 9:  /* read a single byte */
                    value = this.data[cursor++];
                    sign_shift = 24;
                    break;

                case 13:
                case 12:  /* read a 2-byte big-endian short */
                    value = this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 16;
                    break;

                case 15:
                case 14:  /* read a 2-byte little-endian short */
                    value = this.data[cursor++] | this.data[cursor++] << 8;
                    sign_shift = 16;
                    break;

                case 17:
                case 16:  /* read a 4-byte big-endian long */
                    value = this.data[cursor++] << 24 | this.data[cursor++] << 16 | this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 0;
                    break;

                case 19:
                case 18:  /* read a 4-byte little-endian long */
                    value = this.data[cursor++] | this.data[cursor++] << 8 | this.data[cursor++] << 16 | this.data[cursor++] << 24;
                    sign_shift = 0;
                    break;

                case 21:
                case 20:  /* read a 3-byte big-endian long */
                    value = this.data[cursor++] << 16 | this.data[cursor++] << 8 | this.data[cursor++];
                    sign_shift = 8;
                    break;

                case 23:
                case 22:  /* read a 3-byte little-endian long */
                    value = this.data[cursor++] | this.data[cursor++] << 8 | this.data[cursor++] << 16;
                    sign_shift = 8;
                    break;

                default:
                    /* otherwise, exit the loop */
                    this.cur = cursor;
                    if (frame_accessed === true)
                        this.ExitFrame();
                    return error;
            }

            /* now, compute the signed value is necessary */
            if (0 != (fval & 1))
                value = (( value << sign_shift ) >>> sign_shift) & 0xFFFFFFFF;

            /* finally, store the value in the object */

            data = structure.data;
            pos = structure.pos + arrayFields[ind].offset;
            switch (arrayFields[ind])
            {
                case 1:
                    data[pos] = value & 0xFF;
                    break;

                case 2:
                    data[pos] = (value >>> 8)&0xFF;
                    data[pos+1] = value&0xFF;
                    break;

                case 4:
                    data[pos] = (value >>> 24)&0xFF;
                    data[pos+1] = (value >>> 16)&0xFF;
                    data[pos+2] = (value >>> 8)&0xFF;
                    data[pos+3] = value&0xFF;
                    break;

                default:
                    data[pos] = (value >>> 24)&0xFF;
                    data[pos+1] = (value >>> 16)&0xFF;
                    data[pos+2] = (value >>> 8)&0xFF;
                    data[pos+3] = value&0xFF;
            }

            /* go to next field */
            ind+=3;
        }
        while ( 1 );

        return error;
    }
}

window["fts"] = FT_Stream;

window['AscFonts'].FT_Memory = FT_Memory;
window['AscFonts'].FT_Stream = FT_Stream;
window['AscFonts'].g_memory = g_memory;

window['AscFonts'].CFontManager = function CFontManager() {
    this.m_oLibrary = {};
    this.m_oLibrary.tt_hint_props = {};
    this.Initialize = function(){};
    this.ClearFontsRasterCache = function(){};
};

// FT_Common
function _FT_Common() {
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

window['AscFonts'].FT_Common = FT_Common;