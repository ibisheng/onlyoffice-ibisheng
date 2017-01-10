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

/******************************************************************************/
// stream
/******************************************************************************/
function FT_Frame_Field(v,s,o)
{
    this.value = v;
    this.size = s;
    this.offset = o;
}
function FT_Stream(data, size)
{
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;
}
FT_Stream.prototype =
{
	Seek : function(_pos)
    {
        if (_pos > this.size)
            return FT_Common.FT_Err_Invalid_Stream_Operation;
        this.pos = _pos;
        return FT_Common.FT_Err_Ok;
    },
    Skip : function(_skip)
    {
        if (_skip < 0)
            return FT_Common.FT_Err_Invalid_Stream_Operation;
        return this.Seek(this.pos + _skip);
    },
    Read : function(pointer, count)
    {
        return this.ReadAt(this.pos, pointer, count);
    },
    ReadArray : function(count)
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
    },
    ReadAt : function(_pos, pointer, count)
    {
        if (_pos > this.size)
            return FT_Common.FT_Err_Invalid_Stream_Operation;
        var read_bytes = this.size - _pos;
        if (read_bytes > count)
            read_bytes = count;

        FT_Common.memcpy_p2(pointer,this.data,_pos,count);

        this.pos = _pos + read_bytes;

        if (read_bytes < count)
            return FT_Common.FT_Err_Invalid_Stream_Operation;

        return FT_Common.FT_Err_Ok;
    },
    TryRead : function(pointer, count)
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
    },

    // 1 bytes
    GetUChar : function()
    {
        if (this.cur >= this.size)
            return 0;
        return this.data[this.cur++];
    },
    GetChar : function()
    {
        if (this.cur >= this.size)
            return 0;
        var m = this.data[this.cur++];
        if (m > FT_Common.m_c)
            m -= FT_Common.a_c;
        return m;
    },
    GetString1 : function(len)
    {
        if (this.cur + len > this.size)
            return "";
        var t = "";
        for (var i = 0; i < len; i++)
            t += String.fromCharCode(this.data[this.cur + i]);
        this.cur += len;
        return t;
    },
    ReadString1 : function(len)
    {
        if (this.pos + len > this.size)
            return "";
        var t = "";
        for (var i = 0; i < len; i++)
            t += String.fromCharCode(this.data[this.pos + i]);
        this.pos += len;
        return t;
    },

    ReadUChar : function()
    {
        if (this.pos >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return this.data[this.pos++];
    },
    ReadChar : function()
    {
        if (this.pos >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        var m = this.data[this.pos++];
        if (m > FT_Common.m_c)
            m -= FT_Common.a_c;
        return m;
    },

    // 2 byte
    GetUShort : function()
    {
        if (this.cur + 1 >= this.size)
            return 0;
        return (this.data[this.cur++] << 8 | this.data[this.cur++]);
    },
    GetShort : function()
    {
        return FT_Common.UShort_To_Short(this.GetUShort());
    },
    ReadUShort : function()
    {
        if (this.pos + 1 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] << 8 | this.data[this.pos++]);
    },
    ReadShort : function()
    {
        return FT_Common.UShort_To_Short(this.ReadUShort());
    },
    GetUShortLE : function()
    {
        if (this.cur + 1 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8);
    },
    GetShortLE : function()
    {
        return FT_Common.UShort_To_Short(this.GetUShortLE());
    },
    ReadUShortLE : function()
    {
        if (this.pos + 1 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] | this.data[this.pos++] << 8);
    },
    ReadShortLE : function()
    {
        return FT_Common.UShort_To_Short(this.ReadUShortLE());
    },

    // 4 byte
    GetULong : function()
    {
        if (this.cur + 3 >= this.size)
            return 0;
        //return (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
        var s = (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
        if (s < 0)
            s += FT_Common.a_i;
        return s;
    },
    GetLong : function()
    {
        // 32-битные числа - по умолчанию знаковые!!!
        //return FT_Common.UintToInt(this.GetULong());
        return (this.data[this.cur++] << 24 | this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
    },
    ReadULong : function()
    {
        if (this.pos + 3 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        var s = (this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
        if (s < 0)
            s += FT_Common.a_i;
        return s;
    },
    ReadLong : function()
    {
        // 32-битные числа - по умолчанию знаковые!!!
        //return FT_Common.Uint_To_int(this.ReadULong());
        if (this.pos + 3 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
    },

    GetULongLE : function()
    {
        if (this.cur + 3 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
    },
    GetLongLE : function()
    {
        return FT_Common.Uint_To_int(this.GetULongLE());
    },
    ReadULongLE : function()
    {
        if (this.pos + 3 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16 | this.data[this.pos++] << 24);
    },
    ReadLongLE : function()
    {
        return FT_Common.Uint_To_int(this.ReadULongLE());
    },

    // 3 byte
    GetUOffset : function()
    {
        if (this.cur + 2 >= this.size)
            return 0;
        return (this.data[this.cur++] << 16 | this.data[this.cur++] << 8 | this.data[this.cur++]);
    },
    GetUOffsetLE : function()
    {
        if (this.cur + 2 >= this.size)
            return 0;
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16);
    },
    ReadUOffset : function()
    {
        if (this.pos + 2 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++]);
    },
    ReadUOffsetLE : function()
    {
        if (this.pos + 2 >= this.size)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Stream_Operation;
            return 0;
        }
        FT_Error = FT_Common.FT_Err_Ok;
        return (this.data[this.pos++] | this.data[this.pos++] << 8 | this.data[this.pos++] << 16);
    },
    EnterFrame : function(count)
    {
        if (this.pos >= this.size || this.size - this.pos < count)
            return FT_Common.FT_Err_Invalid_Stream_Operation;

        this.cur = this.pos;
        this.pos += count;
        return FT_Common.FT_Err_Ok;
    },
    ExtractFrame : function(count, pointer)
    {
        if (null == pointer)
            pointer = new CPointer();

        var err = this.EnterFrame(count);
        if (err != FT_Common.FT_Err_Ok)
            return err;

        pointer.data = this.data;
        pointer.pos = this.cur;

        this.cur = 0;
        return err;
    },
    ReleaseFrame : function()
    {
    },
    ExitFrame : function()
    {
        this.cur = 0;
    },

    ReadFields : function(arrayFields, structure)
    {
        // arrayFields : array {value, size, offset}
        // structures : data pointer
        var error = FT_Common.FT_Err_Ok;
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
                    if (error != FT_Common.FT_Err_Ok)
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
                        error = FT_Common.FT_Err_Invalid_Stream_Operation;
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
    },
    ReadFields2 : function(fields, structure)
    {
        // arrayFields : array {value, size, offset}
        // structures : data pointer
        var error = FT_Common.FT_Err_Ok;
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
                    if (error != FT_Common.FT_Err_Ok)
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
                        error = FT_Common.FT_Err_Invalid_Stream_Operation;
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
};
/******************************************************************************/
// memory
/******************************************************************************/
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
        // TODO: нужно посмотреть, как эта память будет использоваться.
        // нужно ли здесь делать стек, либо все время от нуля делать??
    }
    this.CreateStream = function(size)
    {
        var _size = parseInt((size + 3) / 4);
        var obj = this.ctx.createImageData(1,_size);
        return new FT_Stream(obj.data,_size);
    }
}
var g_memory = new FT_Memory();

function FT_PEEK_CHAR(p)
{
    var r = p.data[p.pos];
    if (r > FT_Common.m_c)
        return r-FT_Common.a_c;
    return r;
}
function FT_NEXT_CHAR(p)
{
    var r = p.data[p.pos++];
    if (r > FT_Common.m_c)
        return r - FT_Common.a_c;
    return r;
}
function FT_PEEK_BYTE(p)
{
    return p.data[p.pos];
}
function FT_NEXT_BYTE(p)
{
    var r = p.data[p.pos++];
    return r;
}
function FT_PEEK_SHORT(p)
{
    var r = (p.data[p.pos] << 8 | p.data[p.pos+1]);
    if (r > FT_Common.m_s)
        return r - FT_Common.a_s;
    return r;
}
function FT_PEEK_SHORT_LE(p)
{
    var r = (p.data[p.pos+1] << 8 | p.data[p.pos]);
    if (r > FT_Common.m_s)
        return r - FT_Common.a_s;
    return r;
}
function FT_NEXT_SHORT(p)
{
    var r = (p.data[p.pos++] << 8 | p.data[p.pos++]);
    if (r > FT_Common.m_s)
        return r - FT_Common.a_s;
    return r;
}
function FT_PEEK_USHORT(p)
{
    var r = (p.data[p.pos] << 8 | p.data[p.pos+1]);
    return r;
}
function FT_PEEK_USHORT_LE(p)
{
    var r = (p.data[p.pos + 1] << 8 | p.data[p.pos]);
    return r;
}
function FT_NEXT_USHORT(p)
{
    var r = (p.data[p.pos++] << 8 | p.data[p.pos++]);
    return r;
}
function FT_PEEK_UOFF3(p)
{
    var r = (p.data[p.pos] << 16 | p.data[p.pos+1] << 8 | p.data[p.pos+2]);
    return r;
}
function FT_NEXT_UOFF3(p)
{
    var r = (p.data[p.pos++] << 16 | p.data[p.pos++] << 8 | p.data[p.pos++]);
    return r;
}
function FT_PEEK_LONG(p)
{
    return (p.data[p.pos] << 24 | p.data[p.pos+1] << 16 | p.data[p.pos+2] << 8 | p.data[p.pos+3]);
}
function FT_NEXT_LONG(p)
{
    var r = (p.data[p.pos++] << 24 | p.data[p.pos++] << 16 | p.data[p.pos++] << 8 | p.data[p.pos++]);
    return r;
}
function FT_PEEK_ULONG(p)
{
    var r = (p.data[p.pos] << 24 | p.data[p.pos+1] << 16 | p.data[p.pos+2] << 8 | p.data[p.pos+3]);
    if (r<0)
        r+=FT_Common.a_i;
    return r;
}
function FT_PEEK_ULONG_LE(p)
{
    var r = (p.data[p.pos+3] << 24 | p.data[p.pos+2] << 16 | p.data[p.pos+1] << 8 | p.data[p.pos]);
    if (r<0)
        r+=FT_Common.a_i;
    return r;
}
function FT_NEXT_ULONG(p)
{
    var r = (p.data[p.pos++] << 24 | p.data[p.pos++] << 16 | p.data[p.pos++] << 8 | p.data[p.pos++]);
    if (r<0)
        r+=FT_Common.a_i;
    return r;
}
function FT_PEEK_String1(p,len)
{
    var t = "";
    for (var i = 0; i < len; i++)
    {
        var r = p.data[p.pos + i];
        if (r == 0)
            return t;
        t += String.fromCharCode(r);
    }
    return t;
}
function FT_NEXT_String1(p,len)
{
    var t = "";
    for (var i = 0; i < len; i++)
        t += String.fromCharCode(p.data[p.pos + i]);
    p.pos+=len;
    return t;
}
function ft_memchr(p, v, size)
{
    for (var i=0;i<size;i++)
        if (p.data[p.pos+i] == v)
            return i;
    return -1;
}
function _strncmp(s1,s2,n)
{
    var m1 = s1.length;
    var m2 = s2.length;
    var l = n;
    if (m1 < l)
        l = m1;
    if (m2 < l)
        l = m2;

    for (var i=0;i<l;i++)
    {
        var c = s1.charCodeAt(i) - s2.charCodeAt(i);
        if (c != 0)
            return c;
    }
    return m1 - m2;
}

function _strcmp_data(s,p)
{
    var m = s.length;

    for (var i=0;i<m;i++)
    {
        var _c = p.data[p.pos + i];
        if (_c == FT_Common.SYMBOL_CONST_S0)
            return 1;

        var c = s.charCodeAt(i) - _c;
        if (c != 0)
            return c;
    }

    if (p.data[p.pos + m] == FT_Common.SYMBOL_CONST_S0)
        return 0;

    return -1;
}

function _strcmp(s1,s2)
{
    return (s1 == s2) ? 0 : 1;
}

function _strncmp_data(p,s,n)
{
    var m2 = s.length;
    var l = n;
    if (m2 < l)
        l = m2;

    var m1 = 0;
    for (var i=0;i<l;i++)
    {
        m1++;
        if (FT_Common.SYMBOL_CONST_S0 == p.data[p.pos + i])
        {
            m1 = i;
            break;
        }

        var c = p.data[p.pos + i] - s.charCodeAt(i);
        if (c != 0)
            return c;
    }
    return m1 - m2;
}
function _strncmp2(s1,s2,n,start1,start2)
{
    var m1 = s1.length - start1;
    var m2 = s2.length - start2;
    var l = n;
    if (m1 < l)
        l = m1;
    if (m2 < l)
        l = m2;

    for (var i=0;i<l;i++)
    {
        var c = s1.charCodeAt(i + start1) - s2.charCodeAt(i + start2);
        if (c != 0)
            return c;
    }
    return m1 - m2;
}
function _mem_strcpyn1(dst, src, size)
{
    var i = 0;
    var slen = src.length;
    while (size > 1 && i < slen)
    {
        dst.data[dst.pos + i] = src.charCodeAt(i);
        i++;
    }

    dst.data[dst.pos + i] = 0;  /* always zero-terminate */
    return i != slen;
}
/******************************************************************************/
// calc
/******************************************************************************/
function FT_LOAD_TARGET_MODE(x)
{
    return ((x >>> 16) & 15);
}
function FT_LOAD_TARGET(x)
{
    return ((x & 15) << 16);
}

function FT_PAD_FLOOR(x, n)
{
    return x & (~(n-1));
}
function FT_PAD_ROUND(x, n)
{
    return (x + (n >>> 1)) & (~(n-1));
}
function FT_PAD_CEIL(x, n)
{
    return (x + n - 1) & (~(n-1));
}

function FT_PIX_FLOOR(x)
{
    return x & ~63;
}
function FT_PIX_ROUND(x)
{
    return (x + 32) & ~63;
}
function FT_PIX_CEIL(x)
{
    return (x + 63) & ~63;
}

function FT_RoundFix(a)
{
    return (a >= 0) ? (a + 0x8000) & ~0xFFFF : -((-a + 0x8000) & ~0xFFFF);
}
function FT_CeilFix(a)
{
    return (a >= 0) ? (a + 0xFFFF) & ~0xFFFF : -((-a + 0xFFFF) & ~0xFFFF);
}
function FT_FloorFix(a)
{
    return (a >= 0) ?  a & ~0xFFFF : -((-a) & ~0xFFFF);
}

// int64 support
function _FT_MulDiv(a,b,c)
{
    var s = 1;
    var d = 0;

    if ( a < 0 ) { a = -a; s = -1; }
    if ( b < 0 ) { b = -b; s = -s; }
    if ( c < 0 ) { c = -c; s = -s; }

    d = (c > 0 ? parseInt((a * b + (c >>> 1)) / c) : 0x7FFFFFFF);
    return (s > 0) ? d : -d;
}
function _FT_MulFix(a,b)
{
    var s = 1;
    if (a < 0)
    {
        a = -a;
        s = -1;
    }
    if (b < 0)
    {
        b = -b;
        s = -s;
    }

    var c = ((a * b + 0x8000) >>> 16) & 0xFFFFFFFF;
    return ( s > 0 ) ? c : -c;
}
function _FT_DivFix(a,b)
{
    var q;
    var s = 1;
    if ( a < 0 ) { a = -a; s = -1; }
    if ( b < 0 ) { b = -b; s = -s; }

    if (b == 0)
        q = 0x7FFFFFFF;
    else
    {
        q = parseInt(((a * 65536) + (b >>> 1)) / b);
        if (q < 0)
            q += FT_Common.a_i;
    }

    return (s < 0 ? -q : q);
}

function Int64()
{
    this.lo = 0;
    this.hi = 0;
}
function ft_multo64(x, y, z)
{
    var lo1 = x & 0x0000FFFF;  var hi1 = x >>> 16;
    var lo2 = y & 0x0000FFFF;  var hi2 = y >>> 16;

    var lo = lo1 * lo2;
    var i1 = lo1 * hi2;
    var i2 = lo2 * hi1;
    var hi = hi1 * hi2;

    /* Check carry overflow of i1 + i2 */
    i1 += i2;
    if (i1 < i2)
        hi += (1 << 16);
    
    hi += (i1 >>> 16);
    i1  = (i1 << 16) & 0xFFFFFFFF;
    if (i1 < 0)
        i1 += FT_Common.a_i;

    /* Check carry overflow of i1 + lo */
    lo += i1;

    if (lo >= FT_Common.a_i)
        lo = FT_Common.IntToUInt(lo & 0xFFFFFFFF);

    if (lo < i1)
        hi++;

    z.lo = lo;
    z.hi = hi;
}
function ft_div64by32(hi, lo, y)
{
    var q = 0;
    var r = hi;

    if (r >= y)
        return 0x7FFFFFFF;

    var i = 32;
    do
    {
        r = (r << 1) & 0xFFFFFFFF;
        q = (q << 1) & 0xFFFFFFFF;

        r  |= (lo >>> 31);
        if (r < 0)
            r += FT_Common.a_i;

        if (r >= y)
        {
            r -= y;
            q |= 1;
        }

        if (q < 0)
            q += FT_Common.a_i;

        lo = (lo << 1) & 0xFFFFFFFF;
        if (lo < 0)
            lo += FT_Common.a_i;
    } while ( --i );

    return q;
}
function FT_Add64(x, y, z)
{
    var lo = x.lo + y.lo;
    var hi = x.hi + y.hi;
    if (lo < x.lo)
        hi++;

    z.lo = lo;
    z.hi = hi;
}
var temp1 = new Int64();
var temp2 = new Int64();
function FT_MulDiv(a, b, c)
{
    if (a > FT_Common.m_i || b > FT_Common.m_i || c > FT_Common.m_i)
        alert("error");

    if (a == 0 || b == c)
        return a;

    var s  = a; a = Math.abs(a);
    s ^= b; b = Math.abs(b);
    s ^= c; c = Math.abs(c);

    if (a <= 46340 && b <= 46340 && c <= 176095 && c > 0)
        a = ((a * b + (c >> 1)) / c) >> 0;
    else if (FT_Common.UintToInt(c) > 0)
    {
        ft_multo64(a >= 0 ? a : a + FT_Common.a_i, b >= 0 ? b : b + FT_Common.a_i, temp1);

        temp2.hi = 0;
        temp2.lo = (c >>> 1);
        FT_Add64(temp1, temp2, temp1);
        a = ft_div64by32(temp1.hi, temp1.lo, c);
    }
    else
        a = 0x7FFFFFFF;

    return (s < 0 ? -a : a);
}
function FT_MulFix(a, b)
{
    if (a > FT_Common.m_i || b > FT_Common.m_i)
    {
		//alert("error");
		a &= 0xFFFFFFFF;
		b &= 0xFFFFFFFF;
	}

    if (a == 0 || b == 0x10000)
        return a;

    var s = a; a = Math.abs(a);
    s ^= b; b = Math.abs(b);

    var ua = a < 0 ? a + FT_Common.a_i : a;
    var ub = b < 0 ? b + FT_Common.a_i : b;

    if (ua <= 2048 && ub <= 1048576)
        ua = (ua * ub + 0x8000) >>> 16;
    else
    {
        var al = ua & 0xFFFF;

        ua = ((ua >>> 16) * ub) + (al * (ub >>> 16)) + ((al * (ub & 0xFFFF) + 0x8000) >>> 16);
    }
    var _l = FT_Common.UintToInt(ua);
    return (s < 0 ? -_l : _l);
}
function FT_DivFix(a, b)
{
    if (a > FT_Common.m_i || b > FT_Common.m_i)
    {
        a = (a & 0xFFFFFFFF);
        b = (b & 0xFFFFFFFF);
    }
    
    var q = 0;

    var s = 1;
    if ( a < 0 ) { a = -a; s = -1; }
    if ( b < 0 ) { b = -b; s = -s; }

    if (b == 0)
    {
        q = 0x7FFFFFFF;
    }
    else if ((a >>> 16) == 0)
    {
        q = ((a * 65536 + (b >>> 1)) / b) >> 0;
        if (q < 0)
            q += FT_Common.a_i;
    }
    else
    {
        temp1.hi  = (a >>> 16);
        temp1.lo  = (a << 16) & 0xFFFFFFFF;
        if (temp1.lo < 0)
            temp1.lo += FT_Common.a_i;

        temp2.hi = 0;
        temp2.lo = (b >>> 1);

        if (temp2.lo < 0)
            temp2.lo += FT_Common.a_i;

        FT_Add64(temp1, temp2, temp1);
        q = ft_div64by32(temp1.hi, temp1.lo, b < 0 ? b + FT_Common.a_i : b);
    }

    var _q = (q > FT_Common.m_i) ? q - FT_Common.a_i : q;
    return (s < 0) ? -_q : _q;
}

function FT_Sqrt32(x)
{
    var val, root, newroot, mask;

    root = 0;
    mask = 0x40000000;
    val  = x;

    do
    {
        newroot = root + mask;
        if ( newroot <= val )
        {
            val -= newroot;
            root = newroot + mask;
        }

        root >>>= 1;
        mask >>>= 2;

    } while ( mask != 0 );

    return root;
}

function FT_Matrix_Multiply(a, b)
{
    var xx, xy, yx, yy;

    if ( !a || !b )
        return;

    xx = FT_MulFix(a.xx, b.xx) + FT_MulFix(a.xy, b.yx);
    xy = FT_MulFix(a.xx, b.xy) + FT_MulFix(a.xy, b.yy);
    yx = FT_MulFix(a.yx, b.xx) + FT_MulFix(a.yy, b.yx);
    yy = FT_MulFix(a.yx, b.xy) + FT_MulFix(a.yy, b.yy);

    b.xx = xx;  b.xy = xy;
    b.yx = yx;  b.yy = yy;
}

function FT_Matrix_Invert(matrix)
{
    var delta, xx, yy;

    if (!matrix)
        return FT_Common.FT_Err_Invalid_Argument;

    delta = FT_MulFix(matrix.xx, matrix.yy) - FT_MulFix(matrix.xy, matrix.yx);
    if ( !delta )
        return FT_Common.FT_Err_Invalid_Argument;

    matrix.xy = -FT_DivFix(matrix.xy, delta);
    matrix.yx = -FT_DivFix(matrix.yx, delta);

    xx = matrix.xx;
    yy = matrix.yy;

    matrix.xx = FT_DivFix(yy, delta);
    matrix.yy = FT_DivFix(xx, delta);

    return 0;
}

function FT_Matrix_Multiply_Scaled(a, b, scaling)
{
    var xx, xy, yx, yy;
    var val = 0x10000 * scaling;
    if ( !a || !b )
        return;

    xx = FT_MulDiv(a.xx, b.xx, val) + FT_MulDiv(a.xy, b.yx, val);
    xy = FT_MulDiv(a.xx, b.xy, val) + FT_MulDiv(a.xy, b.yy, val);
    yx = FT_MulDiv(a.yx, b.xx, val) + FT_MulDiv(a.yy, b.yx, val);
    yy = FT_MulDiv(a.yx, b.xy, val) + FT_MulDiv(a.yy, b.yy, val);

    b.xx = xx; b.xy = xy;
    b.yx = yx; b.yy = yy;
}

function FT_Vector_Transform_Scaled(vector, matrix, scaling)
{
    var xz, yz;
    var val = 0x10000 * scaling;
    if (!vector || !matrix)
        return;

    xz = FT_MulDiv(vector.x, matrix.xx, val) + FT_MulDiv(vector.y, matrix.xy, val);
    yz = FT_MulDiv(vector.x, matrix.yx, val) + FT_MulDiv(vector.y, matrix.yy, val);

    vector.x = xz;
    vector.y = yz;
}

function FT_SqrtFixed(x)
{
    var root, rem_hi, rem_lo, test_div;
    var count;

    root = 0;
    if (x > 0)
    {
        rem_hi = 0;
        rem_lo = x;
        count  = 24;
        do
        {
            rem_hi   = (rem_hi << 2) | (rem_lo >>> 30);
            rem_lo <<= 2;
            root   <<= 1;
            test_div = (root << 1) + 1;

            if (rem_hi >= test_div)
            {
                rem_hi -= test_div;
                root   += 1;
            }
        } while (--count);
    }

    return root;
}

function ft_corner_orientation(in_x, in_y, out_x, out_y)
{
    var result;
    if ( in_y == 0 )
    {
        if ( in_x >= 0 )
            result = out_y;
        else
            result = -out_y;
    }
    else if ( in_x == 0 )
    {
        if ( in_y >= 0 )
            result = -out_x;
        else
            result = out_x;
    }
    else if ( out_y == 0 )
    {
        if ( out_x >= 0 )
            result = in_y;
        else
            result = -in_y;
    }
    else if ( out_x == 0 )
    {
        if ( out_y >= 0 )
            result = -in_x;
        else
            result =  in_x;
    }
    else
    {
        var delta = in_x * out_y - in_y * out_x;

        if ( delta == 0 )
            result = 0;
        else
            result = 1 - 2 * ( delta < 0 );
    }

    return result;
}

function ft_corner_is_flat(in_x, in_y, out_x, out_y)
{
    var ax = in_x;
    var ay = in_y;

    var d_in, d_out, d_corner;

    if ( ax < 0 )
        ax = -ax;
    if ( ay < 0 )
        ay = -ay;
    d_in = ax + ay;

    ax = out_x;
    if ( ax < 0 )
        ax = -ax;
    ay = out_y;
    if ( ay < 0 )
        ay = -ay;
    d_out = ax + ay;

    ax = out_x + in_x;
    if ( ax < 0 )
        ax = -ax;
    ay = out_y + in_y;
    if ( ay < 0 )
        ay = -ay;
    d_corner = ax + ay;

    return (( d_in + d_out - d_corner ) < ( d_corner >>> 4 )) ? 1 : 0;
}
/******************************************************************************/
// glyph
/******************************************************************************/
// bitmap
function ft_bitmap_glyph_init(glyph, slot)
{
    var library = glyph.library;

    if (slot.format != FT_Common.FT_GLYPH_FORMAT_BITMAP)
        return FT_Common.FT_Err_Invalid_Glyph_Format;

    glyph.left = slot.bitmap_left;
    glyph.top  = slot.bitmap_top;

    if ((slot.internal.flags & FT_Common.FT_GLYPH_OWN_BITMAP) != 0)
    {
        var d = glyph.bitmap;
        var s = slot.bitmap;

        d.rows = s.rows;
        d.width = s.width;
        d.pitch = s.pitch;
        d.buffer = dublicate_pointer(s.buffer);
        d.num_grays = s.num_grays;
        d.pixel_mode = s.pixel_mode;
        d.palette_mode = s.palette_mode;
        d.palette = s.palette;

        slot.internal.flags &= ~FT_Common.FT_GLYPH_OWN_BITMAP;
    }
    else
    {
        FT_Bitmap_New(glyph.bitmap);
        return FT_Bitmap_Copy(library, slot.bitmap, glyph.bitmap);
    }
    return 0;
}
function ft_bitmap_glyph_copy(source, target)
{
    target.left = source.left;
    target.top  = source.top;
    return FT_Bitmap_Copy(source.library, source.bitmap, target.bitmap);
}
function ft_bitmap_glyph_done(bitmap_glyph)
{
    FT_Bitmap_Done(bitmap_glyph.library, bitmap_glyph.bitmap);
}
function ft_bitmap_glyph_bbox(glyph, cbox)
{
    cbox.xMin = glyph.left << 6;
    cbox.xMax = cbox.xMin + (glyph.bitmap.width << 6);
    cbox.yMax = glyph.top << 6;
    cbox.yMin = cbox.yMax - (glyph.bitmap.rows << 6);
}

// outline
function ft_outline_glyph_init(glyph, slot)
{
    var source = slot.outline;
    var target = glyph.outline;


    /* check format in glyph slot */
    if (slot.format != FT_Common.FT_GLYPH_FORMAT_OUTLINE)
        return FT_Common.FT_Err_Invalid_Glyph_Format;

    var error = FT_Outline_New(glyph.library, source.n_points, source.n_contours, glyph.outline);
    if (error != 0)
        return error;

    FT_Outline_Copy(source, target);
    return error;
}
function ft_outline_glyph_done(glyph)
{
    FT_Outline_Done(glyph.library, glyph.outline);
}
function ft_outline_glyph_copy(source, target)
{
    var library = source.library;
    var error = FT_Outline_New(library, source.outline.n_points, source.outline.n_contours, target.outline);
    if (error != 0)
        FT_Outline_Copy(source.outline, target.outline);

    return error;
}
function ft_outline_glyph_transform(glyph, matrix, delta)
{
    if (matrix != null)
        FT_Outline_Transform(glyph.outline, matrix);

    if (delta != null)
        FT_Outline_Translate(glyph.outline, delta.x, delta.y);
}
function ft_outline_glyph_bbox(glyph, bbox)
{
    FT_Outline_Get_CBox(glyph.outline, bbox);
}
function ft_outline_glyph_prepare(glyph, slot)
{
    slot.format         = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

    var d = slot.outline;
    var s = glyph.outline;

    d.n_contours = s.n_contours;
    d.n_points = s.n_points;
    d.points = s.points;
    d.tags = s.tags;
    d.contours = s.contours;
    d.flags = s.flags;

    slot.outline.flags &= ~FT_Common.FT_OUTLINE_OWNER;
    return 0;
}

function _ft_bitmap_glyph_class()
{
    this.glyph_size = 0; // glyph_type
    this.glyph_format = FT_Common.FT_GLYPH_FORMAT_BITMAP;
    this.glyph_init = ft_bitmap_glyph_init;
    this.glyph_done = ft_bitmap_glyph_done;
    this.glyph_copy = ft_bitmap_glyph_copy;
    this.glyph_transform = null;
    this.glyph_bbox = ft_bitmap_glyph_bbox;
    this.glyph_prepare = null;
}
var ft_bitmap_glyph_class = new _ft_bitmap_glyph_class();
function _ft_outline_glyph_class()
{
    this.glyph_size = 1; // glyph_type
    this.glyph_format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;
    this.glyph_init = ft_outline_glyph_init;
    this.glyph_done = ft_outline_glyph_done;
    this.glyph_copy = ft_outline_glyph_copy;
    this.glyph_transform = ft_outline_glyph_transform;
    this.glyph_bbox = ft_outline_glyph_bbox;
    this.glyph_prepare = ft_outline_glyph_prepare;
}
var ft_outline_glyph_class = new _ft_outline_glyph_class();

function FT_GlyphRec()
{
    this.library = null;
    this.clazz = null;
    this.format = 0;
    this.advance = new FT_Vector();
}
function FT_BitmapGlyphRec()
{
    this.library = null;
    this.clazz = null;
    this.format = 0;
    this.advance = new FT_Vector();

    this.left = 0;
    this.top = 0;
    this.bitmap = new FT_Bitmap();
}
function FT_OutlineGlyphRec()
{
    this.library = null;
    this.clazz = null;
    this.format = 0;
    this.advance = new FT_Vector();

    this.outline = new FT_Outline();
}
function ft_new_glyph(library, clazz)
{
    var glyph = null;
    if (clazz.glyph_size == 0)
        glyph = new FT_BitmapGlyphRec();
    else
        glyph = new FT_OutlineGlyphRec();

    glyph.library = library;
    glyph.clazz = clazz;
    glyph.format = clazz.glyph_format;
    return glyph;
}
/******************************************************************************/
// glyphloader
/******************************************************************************/
function FT_CreateVectorArray(array, start, count)
{
    for (var i = start + count - 1; i >= start; i--)
        array[i] = new FT_Vector();
}
function FT_CreateArray(array, start, count)
{
    for (var i = start + count - 1; i >= start; i--)
        array[i] = 0;
}
function FT_CreateArraySubGlyphs(array, start, count)
{
    for (var i = start + count - 1; i >= start; i--)
        array[i] = new FT_SubGlyph();
}
function FT_OutlineCur()
{
    this.n_contours = 0;
    this.n_points = 0;

    this.points = 0;
    this.tags = 0;
    this.contours = 0;

    this.flags = 0;
}
function FT_SubGlyph()
{
    this.index = 0;
    this.flags = 0;
    this.arg1 = 0;
    this.arg2 = 0;
    this.transform = new FT_Matrix();
}
function FT_GlyphLoad()
{
    this.outline = new FT_Outline();
    this.extra_points = null;
    this.extra_points2 = 0;
    this.num_subglyphs = 0;
    this.subglyphs = null;
}
function FT_GlyphLoadCur()
{
    this.outline = new FT_OutlineCur();
    this.extra_points = 0;
    this.extra_points2 = 0;
    this.num_subglyphs = 0;
    this.subglyphs = 0;
}
function FT_GlyphLoader()
{
    this.memory = null;
    this.max_points = 0;
    this.max_contours = 0;
    this.max_subglyphs = 0;
    this.use_extra = 0;

    this.base = new FT_GlyphLoad();
    this.current = new FT_GlyphLoadCur();

    this.other = null;
}

function FT_GlyphLoader_New(memory)
{
    var loader = new FT_GlyphLoader();
    loader.memory = memory;
    return loader;
}
function FT_GlyphLoader_Rewind(loader)
{
    var base    = loader.base;
    var current = loader.current;

    base.outline.n_points   = 0;
    base.outline.n_contours = 0;
    base.num_subglyphs      = 0;

    var _cur = current.outline;
    _cur.n_contours = 0;
    _cur.n_points = 0;
    _cur.points = 0;
    _cur.tags = 0;
    _cur.contours = 0;
    _cur.flags = 0;

    current.extra_points = 0;
    current.extra_points2 = 0;
    current.num_subglyphs = 0;
    current.subglyphs = 0;

    current.extra_points  = 0;
    current.extra_points2 = base.extra_points2;
}
function FT_GlyphLoader_Reset(loader)
{
    var base = loader.base;

    base.outline.points = null;
    base.outline.tags = null;
    base.outline.contours = null;
    base.extra_points = null;
    base.extra_points2 = 0;
    base.subglyphs = null;

    loader.max_points    = 0;
    loader.max_contours  = 0;
    loader.max_subglyphs = 0;

    FT_GlyphLoader_Rewind(loader);
}
function FT_GlyphLoader_Done(loader)
{
    if (loader)
        FT_GlyphLoader_Reset(loader);
}
function FT_GlyphLoader_Adjust_Points(loader)
{
    var base    = loader.base.outline;
    var current = loader.current.outline;

    current.points   = base.n_points;
    current.tags     = base.n_points;
    current.contours = base.n_contours;

    if (loader.use_extra == 1)
    {
        loader.current.extra_points  = base.n_points;
        loader.current.extra_points2 = loader.base.extra_points2 + base.n_points;
    }
}
function FT_GlyphLoader_CreateExtra(loader)
{
    var c = 2*loader.max_points;
    loader.base.extra_points = new Array(c);
    FT_CreateVectorArray(loader.base.extra_points, 0, c);
    loader.use_extra = 1;
    loader.base.extra_points2 = loader.max_points;
    FT_GlyphLoader_Adjust_Points(loader);
    return 0;
}
function FT_GlyphLoader_Adjust_Subglyphs(loader)
{
    loader.current.subglyphs = loader.base.num_subglyphs;
}
function FT_GlyphLoader_CheckPoints(loader, n_points, n_contours)
{
    var base = loader.base.outline;
    var current = loader.current.outline;
    var adjust = 0;

    var new_max = base.n_points + current.n_points + n_points;
    var old_max = loader.max_points;

    if (new_max > old_max)
    {
        new_max = (new_max + 7) & ~7;

        if (new_max > 32767)
            return FT_Error.FT_Err_Array_Too_Large;

        if (null == base.points)
            base.points = new Array(new_max);
        if (null == base.tags)
            base.tags = new Array(new_max);

        FT_CreateVectorArray(base.points, old_max, new_max - old_max);
        FT_CreateArray(base.tags, old_max, new_max - old_max);

        if (1 == loader.use_extra)
        {
            if (null == loader.base.extra_points)
                loader.base.extra_points = new Array(2 * (new_max - old_max));
            FT_CreateVectorArray(loader.base.extra_points, old_max * 2, 2 * (new_max - old_max));
            loader.base.extra_points2 = new_max;
        }

        adjust = 1;
        loader.max_points = new_max;
    }

    /* check contours */
    old_max = loader.max_contours;
    new_max = base.n_contours + current.n_contours + n_contours;
    if (new_max > old_max)
    {
        new_max = (new_max + 4) & ~4;

        if (new_max > 32767)
            return FT_Common.FT_Err_Array_Too_Large;

        if (base.contours == null)
            base.contours = new Array(new_max);
        FT_CreateArray(base.contours, old_max, new_max - old_max);

        adjust = 1;
        loader.max_contours = new_max;
    }

    if (adjust == 1)
        FT_GlyphLoader_Adjust_Points(loader);

    return 0;
}
function FT_GlyphLoader_CheckSubGlyphs(loader, n_subs)
{
    var base    = loader.base;
    var current = loader.current;

    var new_max = base.num_subglyphs + current.num_subglyphs + n_subs;
    var old_max = loader.max_subglyphs;
    if (new_max > old_max)
    {
        new_max = (new_max + 2) & ~2;

        if (null == base.subglyphs)
            base.subglyphs = new Array(new_max);
        FT_CreateArraySubGlyphs(base.subglyphs, old_max, new_max - old_max);
        loader.max_subglyphs = new_max;
        FT_GlyphLoader_Adjust_Subglyphs(loader);
    }
    return 0;
}
function FT_GlyphLoader_Prepare(loader)
{
    var current = loader.current;

    current.outline.n_points   = 0;
    current.outline.n_contours = 0;
    current.num_subglyphs      = 0;

    FT_GlyphLoader_Adjust_Points(loader);
    FT_GlyphLoader_Adjust_Subglyphs(loader);
}
function FT_GlyphLoader_Add(loader)
{
    if ( !loader )
        return;

    var base    = loader.base;
    var current = loader.current;

    var n_curr_contours = current.outline.n_contours;
    var n_base_points   = base.outline.n_points;

    base.outline.n_points = base.outline.n_points + current.outline.n_points;
    base.outline.n_contours = base.outline.n_contours + current.outline.n_contours;

    base.num_subglyphs += current.num_subglyphs;

    var mass = base.outline.contours;
    var start = current.outline.contours;
    for (var n = 0; n < n_curr_contours; n++)
        mass[start+n] = mass[start+n] + n_base_points;

    FT_GlyphLoader_Prepare(loader);
}
function FT_GlyphLoader_CopyPoints(target, source)
{
    var num_points   = source.base.outline.n_points;
    var num_contours = source.base.outline.n_contours;


    var error = FT_GlyphLoader_CheckPoints(target, num_points, num_contours);
    if (error != 0)
    {
        var _out = target.base.outline;
        var _in = source.base.outline;

        var i=0;

        var out_p = _out.points;
        var in_p = _in.points;
        var out_t = _out.tags;
        var in_t = _in.tags;

        for (i=0;i<num_points;i++)
        {
            out_p[i].x = in_p[i].x;
            out_p[i].y = in_p[i].y;

            out_t[i] = in_t[i];
        }

        var out_c = _out.contours;
        var in_c = _in.contours;
        for (i=0;i<num_contours;i++)
            out_c[i] = in_c[i];

        if (1 == target.use_extra && 1 == source.use_extra)
        {
            var out_e = target.base.extra_points;
            var in_e = source.base.extra_points;
            var c = 2 * num_points;
            for (i=0;i<c;i++)
            {
                out_e[i].x = in_e[i].x;
                out_e[i].y = in_e[i].y;
            }
        }

        _out.n_points   = num_points;
        _out.n_contours = num_contours;

        FT_GlyphLoader_Adjust_Points(target);
    }

    return error;
}
function FT_GLYPHLOADER_CHECK_POINTS(_loader,_points,_contours)
{
    if (_points == 0 || (_loader.base.outline.n_points + _loader.current.outline.n_points + _points) <= _loader.max_points)
    {
        if (_contours == 0 || (_loader.base.outline.n_contours + _loader.current.outline.n_contours + _contours) <= _loader.max_contours)
            return 0;
    }
    return FT_GlyphLoader_CheckPoints(_loader,_points,_contours);
}
/******************************************************************************/
// ftmm
/******************************************************************************/
function FT_MM_Axis()
{
    this.name = null;
    this.minimum = 0;
    this.maximum = 0;
}
function FT_Var_Axis()
{
    this.name = null;

    this.minimum = 0;
    this.def = 0;
    this.maximum = 0;

    this.tag = 0;
    this.strid = 0;
}
function FT_Var_Named_Style()
{
    this.coords = null;
    this.strid = 0;
}
function FT_MM_Var()
{
    this.num_axis = 0;
    this.num_designs = 0;
    this.num_namedstyles = 0;
    this.axis = null;
    this.namedstyle = null;

    this.dublicate = function()
    {
        var res = new FT_MM_Var();
        res.num_axis = this.num_axis;
        res.num_designs = this.num_designs;
        res.num_namedstyles = this.num_namedstyles;

        var c = res.num_axis;
        if (c != 0)
        {
            res.axis = new Array(c);
            for (var i=0;i<c;i++)
            {
                res.axis[i] = new FT_Var_Axis();
                var _m = res.axis[i];
                var _s = this.axis[i];

                _m.name = _s.name;
                _m.minimum = _s.minimum;
                _m.def = _s.def;
                _m.maximum = _s.maximum;
                _m.tag = _s.tag;
                _m.strid = _s.strid;
            }
        }
        c = res.num_namedstyles;
        if (c != 0)
        {
            res.namedstyle = new Array(c);
            for (var i=0;i<c;i++)
            {
                res.namedstyle[i] = new FT_Var_Named_Style();
                var _m = res.namedstyle[i];
                var _s = this.namedstyle[i];

                _m.strid = _s.strid;
                if (null != _s.coords)
                    _m.coords = _s.coords.splice(0,0);
            }
        }
    }
}
function FT_Multi_Master()
{
    this.num_axis = 0;
    this.num_designs = 0;
    this.axis = new Array(FT_Common.T1_MAX_MM_AXIS);

    for (var i = 0; i < FT_Common.T1_MAX_MM_AXIS; i++)
        this.axis[i] = new FT_MM_Axis();
}
/******************************************************************************/
// ftdriver
/******************************************************************************/
function FT_Driver_Class()
{
    this.flags = 0;
    this.name = "";
    this.version = 0;
    this.requires = 0;

    this.module_interface = null;

    this.init = null;
    this.done = null;
    this.get_interface = null;

    this.face_object_size = 0;
    this.size_object_size = 0;
    this.slot_object_size = 0;

    this.init_face = null;
    this.done_face = null;

    this.init_size = null;
    this.done_size = null;

    this.init_slot = null;
    this.done_slot = null;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_char_sizes = null;
    this.set_pixel_sizes = null;
    //#endif

    this.load_glyph = null;

    this.get_kerning = null;
    this.attach_file = null;
    this.get_advances = null;

    this.request_size = null;
    this.select_size = null;
}
//#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
function ft_stub_set_char_sizes(size, width, height, horz_res, vert_res)
{
    var driver = size.face.driver;
    if (driver.clazz.request_size != null)
    {
        var req = new FT_Size_RequestRec();
        req.type   = 0;
        req.width  = width;
        req.height = height;

        if (horz_res == 0)
            horz_res = vert_res;

        if (vert_res == 0)
            vert_res = horz_res;

        if (horz_res == 0)
            horz_res = vert_res = 72;

        req.horiResolution = horz_res;
        req.vertResolution = vert_res;

        return driver.clazz.request_size(size, req);
    }
    return 0;
}
function  ft_stub_set_pixel_sizes(size, width, height)
{
    var driver = size.face.driver;
    if (driver.clazz.request_size)
    {
        var req = new FT_Size_RequestRec();
        req.type           = 0;
        req.width          = width  << 6;
        req.height         = height << 6;
        req.horiResolution = 0;
        req.vertResolution = 0;
        return driver.clazz.request_size(size, req);
    }
    return 0;
}
//#endif
/******************************************************************************/
// ftvalid
/******************************************************************************/
function FT_ValidatorRec()
{
    this.base = new CPointer();
    this.limit = 0;
    this.level = 0
    this.error = 0
}
/******************************************************************************/
// pshints
/******************************************************************************/
/******************************************************************************/
// tttypes
/******************************************************************************/
function TTC_HeaderRec()
{
    this.tag = 0;
    this.version = 0;
    this.count = 0;
    this.offsets = null;
}
function SFNT_HeaderRec()
{
    this.format_tag = 0;
    this.num_tables = 0;
    this.search_range = 0;
    this.entry_selector = 0;
    this.range_shift = 0;

    this.offset = 0;  /* not in file */
}
function TT_Table()
{
    this.Tag = 0;
    this.CheckSum = 0;
    this.Offset = 0;
    this.Length = 0;
}
function TT_LongMetricsRec()
{
    this.advance = 0;
    this.bearing = 0;
}
function TT_NameEntryRec()
{
    this.platformID = 0;
    this.encodingID = 0;
    this.languageID = 0;
    this.nameID = 0;
    this.stringLength = 0;
    this.stringOffset = 0;
    this.string = null;
}
function TT_NameTableRec()
{
    this.format = 0;
    this.numNameRecords = 0;
    this.storageOffset = 0;
    this.names = null;
    this.stream = null;
}
function TT_GaspRange()
{
    this.maxPPEM = 0;
    this.gaspFlag = 0;
}
function TT_Gasp()
{
    this.version = 0;
    this.numRanges = 0;
    this.gaspRanges = null;
}
//#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
function TT_HdmxEntryRec()
{
    this.ppem = 0;
    this.max_width = 0;
    this.widths = null;
}
function TT_HdmxRec()
{
    this.version = 0;
    this.num_records = 0;
    this.records = null;
}
function TT_Kern0_PairRec()
{
    this.left = 0;
    this.right = 0;
    this.value = 0;
}
//#endif
function TT_SBit_MetricsRec()
{
    this.height = 0;
    this.width = 0;

    this.horiBearingX = 0;
    this.horiBearingY = 0;
    this.horiAdvance = 0;

    this.vertBearingX = 0;
    this.vertBearingY = 0;
    this.vertAdvance = 0;
}
function TT_SBit_Small_Metrics()
{
    this.height = 0;
    this.width = 0;

    this.bearingX = 0;
    this.bearingY = 0;
    this.advance = 0;
}
function TT_SBit_LineMetricsRec()
{
    this.ascender = 0;
    this.descender = 0;
    this.max_width = 0;
    this.caret_slope_numerator = 0;
    this.caret_slope_denominator = 0;
    this.caret_offset = 0;
    this.min_origin_SB = 0;
    this.min_advance_SB = 0;
    this.max_before_BL = 0;
    this.min_after_BL = 0;

    this.pad1 = 0;
    this.pad2 = 0;
}
function TT_SBit_RangeRec()
{
    this.first_glyph = 0;
    this.last_glyph = 0;

    this.index_format = 0;
    this.image_format = 0;
    this.image_offset = 0;

    this.image_size = 0;
    this.metrics = new TT_SBit_MetricsRec();
    this.num_glyphs = 0;

    this.glyph_offsets = null;
    this.glyph_codes = null;

    this.table_offset = 0;
}
function TT_SBit_StrikeRec()
{
    this.num_ranges = 0;
    this.sbit_ranges = null;
    this.ranges_offset = 0;

    this.color_ref = 0;

    this.hori = new TT_SBit_LineMetricsRec();
    this.vert = new TT_SBit_LineMetricsRec();

    this.start_glyph = 0;
    this.end_glyph = 0;

    this.x_ppem = 0;
    this.y_ppem = 0;

    this.bit_depth = 0;
    this.flags = 0;
}
function TT_SBit_ComponentRec()
{
    this.glyph_code = 0;
    this.x_offset = 0;
    this.y_offset = 0;
}
function TT_SBit_ScaleRec()
{
    this.hori = new TT_SBit_LineMetricsRec();
    this.vert = new TT_SBit_LineMetricsRec();

    this.x_ppem = 0;
    this.y_ppem = 0;

    this.x_ppem_substitute = 0;
    this.y_ppem_substitute = 0;
}
function TT_Post_20Rec()
{
    this.num_glyphs = 0;
    this.num_names = 0;
    this.glyph_indices = null;
    this.glyph_names = null;
}
function TT_Post_25Rec()
{
    this.num_glyphs = 0;
    this.offsets = null;
}
function TT_Post_NamesRec()
{
    this.loaded = false;
    this.format = null;
}
//#ifdef TT_CONFIG_OPTION_BDF
function TT_BDFRec()
{
    this.table = null;
    this.table_end = 0;
    this.strings = null;
    this.strings_size = 0;
    this.num_strikes = 0;
    this.loaded = 0;
}
//#endif
function TT_GlyphZoneRec()
{
    this.memory = null;
    this.max_points = 0;
    this.max_contours = 0;
    this.n_points = 0;    /* number of points in zone    */
    this.n_contours = 0;  /* number of contours          */

    this.org = null;         /* original point coordinates  */
    this.cur = null;         /* current point coordinates   */
    this.orus = null;        /* original (unscaled) point coordinates */

    this.tags = null;        /* current touch flags         */
    this.contours = null;    /* contour end points          */

    this._offset_org = 0;
    this._offset_cur = 0;
    this._offset_orus = 0;
    this._offset_tags = 0;
    this._offset_contours = 0;

    this.first_point = 0; /* offset of first (#0) point  */
}
TT_GlyphZoneRec.prototype =
{
    Clear : function()
    {
        this.memory = null;
        this.max_points = 0;
        this.max_contours = 0;
        this.n_points = 0;
        this.n_contours = 0;

        this.org = null;
        this.cur = null;
        this.orus = null;

        this.tags = null;
        this.contours = null;

        this._offset_org = 0;
        this._offset_cur = 0;
        this._offset_orus = 0;
        this._offset_tags = 0;
        this._offset_contours = 0;

        this.first_point = 0;
    },

    Copy : function(src)
    {
        this.memory = src.memory;
        this.max_points = src.max_points;
        this.max_contours = src.max_contours;
        this.n_points = src.n_points;
        this.n_contours = src.n_contours;

        this.org = src.org;
        this.cur = src.cur;
        this.orus = src.orus;

        this.tags = src.tags;
        this.contours = src.contours;

        this._offset_org = src._offset_org;
        this._offset_cur = src._offset_cur;
        this._offset_orus = src._offset_orus;
        this._offset_tags = src._offset_tags;
        this._offset_contours = src._offset_contours;

        this.first_point = src.first_point;
    }
}

function TT_LoaderRec()
{
    this.face = null;
    this.size = null;
    this.glyph = null;
    this.gloader = null;

    this.load_flags = 0;
    this.glyph_index = 0;

    this.stream = null;
    this.byte_len = 0;

    this.n_contours = 0;
    this.bbox = new FT_BBox();
    this.left_bearing = 0;
    this.advance = 0;
    this.linear = 0;
    this.linear_def = 0;
    this.preserve_pps = 0;
    this.pp1 = new FT_Vector();
    this.pp2 = new FT_Vector();

    this.glyf_offset = 0;

    this.base = new TT_GlyphZoneRec();
    this.zone = new TT_GlyphZoneRec();

    this.exec = null;
    this.instructions = null;
    this.ins_pos = 0;

    this.other = null;

    this.top_bearing = 0;
    this.vadvance = 0;
    this.pp3 = new FT_Vector();
    this.pp4 = new FT_Vector();

    this.cursor = 0;
    this.limit = 0;

    this.Clear = function()
    {
        this.load_flags = 0;
        this.glyph_index = 0;

        this.stream = null;
        this.byte_len = 0;

        this.n_contours = 0;
        this.bbox.xMin = 0;
        this.bbox.yMin = 0;
        this.bbox.xMax = 0;
        this.bbox.yMax = 0;
        this.left_bearing = 0;
        this.advance = 0;
        this.linear = 0;
        this.linear_def = 0;
        this.preserve_pps = 0;
        this.pp1.x = 0;
        this.pp1.y = 0;
        this.pp2.x = 0;
        this.pp2.y = 0;

        this.glyf_offset = 0;

        this.exec = null;
        this.instructions = null;
        this.ins_pos = 0;

        this.other = null;

        this.top_bearing = 0;
        this.vadvance = 0;
        this.pp3.x = 0;
        this.pp3.y = 0;
        this.pp4.x = 0;
        this.pp4.y = 0;

        this.cursor = 0;
        this.limit = 0;

        this.gloader = null;
    }
}
/******************************************************************************/
// tttables
/******************************************************************************/
function TT_Header()
{
    this.Table_Version = 0;
    this.Font_Revision = 0;

    this.CheckSum_Adjust = 0;
    this.Magic_Number = 0;

    this.Flags = 0;
    this.Units_Per_EM = 0;

    this.Created1 = 0;
    this.Created2 = 0;
    this.Modified1 = 0;
    this.Modified2 = 0;

    this.xMin = 0;
    this.yMin = 0;
    this.xMax = 0;
    this.yMax = 0;

    this.Mac_Style = 0;
    this.Lowest_Rec_PPEM = 0;

    this.Font_Direction = 0;
    this.Index_To_Loc_Format = 0;
    this.Glyph_Data_Format = 0;
}
function TT_HoriHeader()
{
    this.Version = 0;
    this.Ascender = 0;
    this.Descender = 0;
    this.Line_Gap = 0;

    this.advance_Width_Max = 0;

    this.min_Left_Side_Bearing = 0;
    this.min_Right_Side_Bearing = 0;
    this.xMax_Extent = 0;
    this.caret_Slope_Rise = 0;
    this.caret_Slope_Run = 0;
    this.caret_Offset = 0;

    this.Reserved1 = 0;
    this.Reserved2 = 0;
    this.Reserved3 = 0;
    this.Reserved4 = 0;

    this.metric_Data_Format = 0;
    this.number_Of_HMetrics = 0;

    this.long_metrics = null;
    this.short_metrics = null;
}
function TT_VertHeader()
{
    this.Version = 0;
    this.Ascender = 0;
    this.Descender = 0;
    this.Line_Gap = 0;

    this.advance_Height_Max = 0;

    this.min_Top_Side_Bearing = 0;
    this.min_Bottom_Side_Bearing = 0;
    this.yMax_Extent = 0;
    this.caret_Slope_Rise = 0;
    this.caret_Slope_Run = 0;
    this.caret_Offset = 0;

    this.Reserved1 = 0;
    this.Reserved2 = 0;
    this.Reserved3 = 0;
    this.Reserved4 = 0;

    this.metric_Data_Format = 0;
    this.number_Of_VMetrics = 0;

    this.long_metrics = null;
    this.short_metrics = null;
}
function TT_OS2()
{
    this.version = 0;
    this.xAvgCharWidth = 0;
    this.usWeightClass = 0;
    this.usWidthClass = 0;
    this.fsType = 0;
    this.ySubscriptXSize = 0;
    this.ySubscriptYSize = 0;
    this.ySubscriptXOffset = 0;
    this.ySubscriptYOffset = 0;
    this.ySuperscriptXSize = 0;
    this.ySuperscriptYSize = 0;
    this.ySuperscriptXOffset = 0;
    this.ySuperscriptYOffset = 0;
    this.yStrikeoutSize = 0;
    this.yStrikeoutPosition = 0;
    this.sFamilyClass = 0;

    this.panose = new Array(10);

    this.ulUnicodeRange1 = 0;        /* Bits 0-31   */
    this.ulUnicodeRange2 = 0;        /* Bits 32-63  */
    this.ulUnicodeRange3 = 0;        /* Bits 64-95  */
    this.ulUnicodeRange4 = 0;        /* Bits 96-127 */

    this.achVendID = new Array(4);

    this.fsSelection = 0;
    this.usFirstCharIndex = 0;
    this.usLastCharIndex = 0;
    this.sTypoAscender = 0;
    this.sTypoDescender = 0;
    this.sTypoLineGap = 0;
    this.usWinAscent = 0;
    this.usWinDescent = 0;

    /* only version 1 tables: */
    this.ulCodePageRange1 = 0;       /* Bits 0-31   */
    this.ulCodePageRange2 = 0;       /* Bits 32-63  */

    /* only version 2 tables: */
    this.sxHeight = 0;
    this.sCapHeight = 0;
    this.usDefaultChar = 0;
    this.usBreakChar = 0;
    this.usMaxContext = 0;
}
function TT_Postscript()
{
    this.FormatType = 0;
    this.italicAngle = 0;
    this.underlinePosition = 0;
    this.underlineThickness = 0;
    this.isFixedPitch = 0;
    this.minMemType42 = 0;
    this.maxMemType42 = 0;
    this.minMemType1 = 0;
    this.maxMemType1 = 0;
}
function TT_PCLT()
{
    this.Version = 0;
    this.FontNumber = 0;
    this.Pitch = 0;
    this.xHeight = 0;
    this.Style = 0;
    this.TypeFamily = 0;
    this.CapHeight = 0;
    this.SymbolSet = 0;
    this.TypeFace = "";
    this.CharacterComplement = "";
    this.FileName = "";
    this.StrokeWeight = 0;
    this.WidthType = 0;
    this.SerifStyle = 0;
    this.Reserved = 0;
}
function TT_MaxProfile()
{
    this.version = 0;
    this.numGlyphs = 0;
    this.maxPoints = 0;
    this.maxContours = 0;
    this.maxCompositePoints = 0;
    this.maxCompositeContours = 0;
    this.maxZones = 0;
    this.maxTwilightPoints = 0;
    this.maxStorage = 0;
    this.maxFunctionDefs = 0;
    this.maxInstructionDefs = 0;
    this.maxStackElements = 0;
    this.maxSizeOfInstructions = 0;
    this.maxComponentElements = 0;
    this.maxComponentDepth = 0;
}
function FT_Get_Sfnt_Table(face, tag)
{
    var table = null;
    if (face && ((face.face_flags & FT_Common.FT_FACE_FLAG_SFNT) != 0))
    {
        var service = FT_FACE_FIND_SERVICE( face, "sfnt-table");
        if (service != null)
            table = service.get_table(face, tag);
    }
    return table;
}
function FT_Load_Sfnt_Table(face, tag, offset, buffer, length)
{
    if (face == null || ((face.face_flags & FT_Common.FT_FACE_FLAG_SFNT) == 0))
        return FT_Common.FT_Err_Invalid_Face_Handle;

    var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_SFNT_TABLE);
    if (service == null)
        return FT_Common.FT_Err_Unimplemented_Feature;

    return service.load_table(face, tag, offset, buffer, length);
}
function FT_Sfnt_Table_Info(face, table_index, tag, length)
{
    if (face == null || ((face.face_flags & FT_Common.FT_FACE_FLAG_SFNT) == 0))
        return FT_Common.FT_Err_Invalid_Face_Handle;

    var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_SFNT_TABLE);
    if (service == null)
        return FT_Common.FT_Err_Unimplemented_Feature;

    return service.table_info(face, table_index, tag);
}
function FT_Get_CMap_Language_ID(charmap)
{
    if (charmap == null || charmap.face == null)
        return 0;

    var service = FT_FACE_FIND_SERVICE(charmap.face, FT_SERVICE_ID_TT_CMAP);
    if (service == null)
        return 0;
    var cmap_info = new TT_CMapInfo();
    if (0 != service.get_cmap_info( charmap, cmap_info))
        return 0;
    return cmap_info.language;
}
/******************************************************************************/
// ftimage
/******************************************************************************/
function FT_Vector()
{
    this.x = 0;
    this.y = 0;
}
function dublicate_vector(v)
{
    var _v = new FT_Vector();
    _v.x = v.x;
    _v.y = v.y;
    return _v;
}
function copy_vector(dst, src)
{
    dst.x = src.x;
    dst.y = src.y;
}
function FT_BBox()
{
    this.xMin = 0;
    this.yMin = 0;
    this.xMax = 0;
    this.yMax = 0;
}
function dublicate_bbox(v)
{
    var _v = new FT_BBox();
    _v.xMin = v.xMin;
    _v.yMin = v.yMin;
    _v.xMax = v.xMax;
    _v.yMax = v.yMax;
    return _v;
}
function FT_Bitmap()
{
    this.rows = 0;
    this.width = 0;
    this.pitch = 0;
    this.buffer = null;
    this.num_grays = 0;
    this.pixel_mode = 0;
    this.palette_mode = 0;
    this.palette = null;
}
function DoNullBitmap(im)
{
    im.rows = 0;
    im.width = 0;
    im.pitch = 0;
    im.buffer = null;
    im.num_grays = 0;
    im.pixel_mode = 0;
    im.palette_mode = 0;
    im.palette = null;
}
function FT_Outline()
{
    this.n_contours = 0;
    this.n_points = 0;

    this.points = null;
    this.tags = null;
    this.contours = null;

    this.flags = 0;
}
function EquatingOutline(d, s)
{
    d.n_contours = s.n_contours;
    d.n_points = s.n_points;
    d.points = s.points;
    d.tags = s.tags;
    d.contours = s.contours;
    d.flags = s.flags;
}
function FT_Span()
{
    this.x = 0;
    this.len = 0;
    this.coverage = 0;
}
function FT_Raster_Params()
{
    this.target = null;
    this.source = null;
    this.flags = 0;
    this.gray_spans = null;
    this.black_spans = null;
    this.bit_test = null;
    this.bit_set = null;
    this.user = null;
    this.clip_box = new FT_BBox();
}
/******************************************************************************/
// ftbitmap
/******************************************************************************/
function FT_Bitmap_New(bitmap)
{
    DoNullBitmap(bitmap);
}
function FT_Bitmap_Copy(library, source, target)
{
    var pitch  = source.pitch;
    if (source == target)
        return 0;

    if (source.buffer == null)
    {
        target.rows = source.rows;
        target.width = source.width;
        target.pitch = source.pitch;
        target.buffer = source.buffer;
        target.num_grays = source.num_grays;
        target.pixel_mode = source.pixel_mode;
        target.palette_mode = source.palette_mode;
        target.palette = source.palette;

        return 0;
    }

    if (pitch < 0)
        pitch = -pitch;
    var size = (pitch * source.rows);

    if (target.buffer != null)
    {
        var target_pitch = target.pitch;

        if (target_pitch < 0 )
            target_pitch = -target_pitch;
        var target_size = (target_pitch * target.rows);

        if (target_size != size)
        {
            target.buffer = null;
            target.buffer = g_memory.Alloc(size);//new Array(size);
        }
    }
    else
        target.buffer = g_memory.Alloc(size);//new Array(size);

    var s = source.buffer;
    var d = target.buffer;
    for (var i=0;i<size;i++)
        d[i]=s[i];

    return 0;
}
function FT_Bitmap_Done(library, bitmap)
{
    DoNullBitmap(bitmap);
    return 0;
}
/******************************************************************************/
// ftsnames
/******************************************************************************/
function FT_SfntName()
{
    this.platform_id = 0;
    this.encoding_id = 0;
    this.language_id = 0;
    this.name_id = 0;

    this.string = "";
    this.string_len = 0;
}
function FT_Get_Sfnt_Name_Count(face)
{
    return (face != null && (face.face_flags & FT_Common.FT_FACE_FLAG_SFNT) != 0) ? face.num_names : 0;
}
function FT_Get_Sfnt_Name(face, idx, aname)
{
    var error = FT_Common.FT_Err_Invalid_Argument;
    if (face != null && (face.face_flags & FT_Common.FT_FACE_FLAG_SFNT) != 0)
    {
        if (idx < face.num_names)
        {
            var entry = face.name_table.names[idx];

            if (entry.stringLength > 0 && entry.string == null)
            {
                var stream = face.stream;
                error = stream.Seek(entry.stringOffset);
                entry.string = stream.ReadString1(entry.stringLength);
                error = FT_Error;

                if (0 != error)
                {
                    entry.string = null;
                    entry.stringLength = 0;
                }
            }

            aname.platform_id = entry.platformID;
            aname.encoding_id = entry.encodingID;
            aname.language_id = entry.languageID;
            aname.name_id     = entry.nameID;
            aname.string      = entry.string;
            aname.string_len  = entry.stringLength;
        }
    }
    return 0;
}
/******************************************************************************/
// ftincrem
/******************************************************************************/
function FT_Incremental_MetricsRec()
{
    this.bearing_x = 0;
    this.bearing_y = 0;
    this.advance = 0;
    this.advance_v = 0;
}
function FT_Incremental_FuncsRec()
{
    this.get_glyph_data = null;
    this.free_glyph_data = null;
    this.get_glyph_metrics = null;
}
function FT_Incremental_Interface()
{
    this.funcs = null;
    this.object = null;
}
/******************************************************************************/
// fttypes
/******************************************************************************/
function FT_Matrix()
{
    this.xx = 0;
    this.xy = 0;
    this.yx = 0;
    this.yy = 0;
}
function dublicate_matrix(m)
{
    var _m = new FT_Matrix();
    _m.xx = m.xx;
    _m.xy = m.xy;
    _m.yx = m.yx;
    _m.yy = m.yy;
    return _m;
}
function FT_Data()
{
    this.pointer = null;
    this.length = 0;
}
function FT_Generic()
{
    this.data = null;
    this.finalizer = null;
}
function FT_Glyph_Metrics()
{
    this.width = 0;
    this.height = 0;

    this.horiBearingX = 0;
    this.horiBearingY = 0;
    this.horiAdvance = 0;

    this.vertBearingX = 0;
    this.vertBearingY = 0;
    this.vertAdvance = 0;

}
function FT_Bitmap_Size()
{
    this.height = 0;
    this.width = 0;

    this.size = 0;

    this.x_ppem = 0;
    this.y_ppem = 0;
}
function FT_CharMapRec()
{
    this.face = null;
    this.encoding = 0;
    this.platform_id = 0;
    this.encoding_id = 0;
}
function FT_Face()
{
    this.num_faces = 0;
    this.face_index = 0;

    this.face_flags = 0;
    this.style_flags = 0;

    this.num_glyphs = 0;

    this.family_name = "";
    this.style_name = "";

    this.num_fixed_sizes = 0;
    this.available_sizes = [];

    this.num_charmaps = 0;
    this.charmaps = [];

    this.generic = new FT_Generic();

    /*# The following member variables (down to `underline_thickness') */
    /*# are only relevant to scalable outlines; cf. @FT_Bitmap_Size    */
    /*# for bitmap fonts.                                              */
    this.bbox = new FT_BBox();

    this.units_per_EM = 0;
    this.ascender = 0;
    this.descender = 0;
    this.height = 0;

    this.max_advance_width = 0;
    this.max_advance_height = 0;

    this.underline_position = 0;
    this.underline_thickness = 0;

    this.glyph = null;
    this.size = null;
    this.charmap = null;

    /*@private begin */
    this.driver = null;
    this.memory = null;
    this.stream = null;

    this.sizes_list = [];

    this.autohint = [];
    this.extensions = null;

    this.internal = null;
    /*@private end */
}
function FT_Size_Metrics()
{
    this.x_ppem = 0;
    this.y_ppem = 0;

    this.x_scale = 0;
    this.y_scale = 0;

    this.ascender = 0;
    this.descender = 0;
    this.height = 0;
    this.max_advance = 0;
}
FT_Size_Metrics.prototype =
{
    Copy : function(src)
    {
        this.x_ppem = src.x_ppem;
        this.y_ppem = src.y_ppem;

        this.x_scale = src.x_scale;
        this.y_scale = src.y_scale;

        this.ascender = src.ascender;
        this.descender = src.descender;
        this.height = src.height;
        this.max_advance = src.max_advance;
    }
};

function FT_Size()
{
    this.face = null;
    this.generic = null;
    this.metrics = new FT_Size_Metrics();
    this.internal = null;
}
function FT_GlyphSlot()
{
    this.library = null;
    this.face = null;
    this.next = null;
    this.reserved = 0;       /* retained for binary compatibility */
    this.generic = null;

    this.metrics = new FT_Glyph_Metrics();
    this.linearHoriAdvance = 0;
    this.linearVertAdvance = 0;
    this.advance = new FT_Vector();

    this.format = 0;

    this.bitmap = new FT_Bitmap();
    this.bitmap_left = 0;
    this.bitmap_top = 0;

    this.outline = new FT_Outline();

    this.num_subglyphs = 0;
    this.subglyphs = [];

    this.control_data = null;
    this.control_len = 0;

    this.lsb_delta = 0;
    this.rsb_delta = 0;

    this.other = null;

    this.internal = null;

    this.base_root = null;
}
function FT_Open_Args()
{
    this.flags = null;
    this.memory_base = null;
    this.memory_size = null;
    this.pathname = "";
    this.stream = null;
    this.driver = null;
    this.num_params = 0;
    this.params = null;
}
function FT_Size_RequestRec()
{
    this.type = 0;
    this.width = 0;
    this.height = 0;
    this.horiResolution = 0;
    this.vertResolution = 0;
}
function FT_CMapRec()
{
    this.charmap = new FT_CharMapRec();
    this.clazz = null;

    this.type = FT_Common.FT_CMAP_0;
}
function __FT_CMapRec(val)
{
    switch (val.type)
    {
        case FT_Common.FT_CMAP_0:
            return val;
        case FT_Common.FT_CMAP_1:
            return val.cmap;
        case FT_Common.FT_CMAP_4:
        case FT_Common.FT_CMAP_12:
        case FT_Common.FT_CMAP_13:
        case FT_Common.FT_CMAP_14:
            return val.cmap.cmap;
        default:
            break;
    }
    return val;
}
function __FT_TTCMapRec(val)
{
    switch (val.type)
    {
        case FT_Common.FT_CMAP_0:
            return null;
        case FT_Common.FT_CMAP_1:
            return val;
        case FT_Common.FT_CMAP_4:
        case FT_Common.FT_CMAP_12:
        case FT_Common.FT_CMAP_13:
        case FT_Common.FT_CMAP_14:
            return val.cmap;
        default:
            break;
    }
    return null;
}
function __FT_CharmapRec(val)
{
    switch (val.type)
    {
        case FT_Common.FT_CMAP_0:
            return val.charmap;
        case FT_Common.FT_CMAP_1:
            return val.cmap.charmap;
        case FT_Common.FT_CMAP_4:
        case FT_Common.FT_CMAP_12:
        case FT_Common.FT_CMAP_13:
        case FT_Common.FT_CMAP_14:
            return val.cmap.cmap.charmap;
        default:
            break;
    }
    return val.charmap;
}
function FT_CMap_ClassRec()
{
    this.size = 0;
    this.init = null;
    this.done = null;
    this.char_index = null;
    this.char_next = null;

    this.char_var_index = null;
    this.char_var_default = null;
    this.variant_list = null;
    this.charvariant_list = null;
    this.variantchar_list = null;
}
function create_cmap_class_rec(size_,init_,done_,char_index_,char_next_,var_index_,var_default_,
                               var_list_,char_var_list_, var_char_list_)
{
    var c = new FT_CMap_ClassRec();
    c.size = size_;
    c.init = init_;
    c.done = done_;
    c.char_index = char_index_;
    c.char_next = char_next_;

    c.char_var_index = var_index_;
    c.char_var_default = var_default_;
    c.variant_list = var_list_;
    c.charvariant_list = char_var_list_;
    c.variantchar_list = var_char_list_;
    return c;
}
function FT_Face_Internal()
{
    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.reserved1 = 0;
    this.reserved2 = 0;
    //#endif
    this.transform_matrix = new FT_Matrix();
    this.transform_delta = new FT_Vector();
    this.transform_flags = 0;

    this.services = new FT_ServiceCache();

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    this.incremental_interface = null;
    //#endif

    this.ignore_unpatented_hinter = false;
    this.refcount = 0;
}
function FT_Slot_Internal()
{
    this.loader = null;
    this.flags = 0;
    this.glyph_transformed = false;
    this.glyph_matrix = new FT_Matrix();
    this.glyph_delta = new FT_Vector();
    this.glyph_hints = null;
}
function FT_Module()
{
    this.clazz = null;      // FT_Module_Class
    this.library = null;    // FT_Library
    this.memory = null;     // FT_Memory
    this.generic = null;    // FT_Generic
}
function FT_Driver()
{
    this.root = new FT_Module();
    this.clazz = new FT_Driver_Class();
    this.faces_list = [];
    this.extensions = null;
    this.glyph_loader = null;
}
function FT_Module_Class()
{
    this.flags = 0;
    this.name = "";
    this.version = 0;
    this.requires = 0;

    this.module_interface = null;

    this.init = null;
    this.done = null;
    this.get_interface = null;
}
/******************************************************************************/
// outline
/******************************************************************************/
function FT_Outline_New(library, numPoints, numContours, anoutline)
{
    if (library == null)
        return FT_Common.FT_Err_Invalid_Library_Handle;

    return FT_Outline_New_Internal(library.Memory, numPoints, numContours, anoutline);
}
function FT_Outline_New_Internal(memory, numPoints, numContours, anoutline)
{
    if (null == anoutline || null == memory)
        return FT_Common.FT_Err_Invalid_Argument;

    var _points = new Array(numPoints);
    for (var i = 0; i < numPoints; i++)
        _points[i] = new FT_Vector();

    var _tags = new Array(numPoints);
    for (var i = 0; i < numPoints; i++)
        _tags[i] = 0;
    var _contours = new Array(numContours);
    for (var i = 0; i < numContours; i++)
        _contours[i] = 0;

    anoutline.points = _points;
    anoutline.tags = _tags;
    anoutline.contours = _contours;

    anoutline.n_points    = numPoints & 0xFFFF;
    anoutline.n_contours  = numContours & 0xFFFF;
    anoutline.flags      |= FT_Common.FT_OUTLINE_OWNER;

    return 0;
}
function FT_Outline_Check(outline)
{
    if (outline != null)
    {
        var n_points   = outline.n_points;
        var n_contours = outline.n_contours;
        var end0, end;
        var n;

        if (n_points == 0 && n_contours == 0)
            return 0;

        if (n_points <= 0 || n_contours <= 0)
            return FT_Common.FT_Err_Invalid_Argument;

        end0 = end = -1;
        var _c = outline.contours;
        for (n = 0; n < n_contours; n++)
        {
            end = _c[n];
            if (end <= end0 || end >= n_points)
                return FT_Common.FT_Err_Invalid_Argument;
            end0 = end;
        }

        if ( end != n_points - 1 )
            return FT_Common.FT_Err_Invalid_Argument;

        return 0;
    }
    return FT_Common.FT_Err_Invalid_Argument;
}
function FT_Outline_Copy(source, target)
{
    if (null == source || null == target || source.n_points != target.n_points || source.n_contours != target.n_contours)
        return FT_Common.FT_Err_Invalid_Argument;

    if (source == target)
        return 0;

    var n_p = source.n_points;
    var s_p = source.points;
    var d_p = target.points;
    var s_t = source.tags;
    var t_t = target.tags;
    for (var i = 0; i < n_p; i++)
    {
        d_p[i].x = s_p[i].x;
        d_p[i].y = s_p[i].y;

        t_t[i] = s_t[i];
    }

    var n_c = source.n_contours;
    var s_c = source.contours;
    var t_c = target.contours;
    for (var i = 0; i < source.n_contours; i++)
    {
        t_c[i] = s_c[i];
    }

    var is_owner = target.flags & FT_Common.FT_OUTLINE_OWNER;
    target.flags = source.flags;

    target.flags &= ~FT_Common.FT_OUTLINE_OWNER;
    target.flags |= is_owner;

    return 0;
}
function FT_Outline_Done_Internal(memory, outline)
{
    if (memory != null && outline != null)
    {
        if (outline.flags & FT_Common.FT_OUTLINE_OWNER)
        {
            outline.points = null;
            outline.tags = null;
            outline.contours = null;
        }

        outline.n_points = 0;
        outline.n_contours = 0;
        outline.flags = 0;

        return 0;
    }
    else
        return FT_Common.FT_Err_Invalid_Argument;
}
function FT_Outline_Done(library, outline)
{
    if (library == null)
        return FT_Common.FT_Err_Invalid_Library_Handle;

    return FT_Outline_Done_Internal(library.memory, outline);
}
/******************************************************************************/
// obj
/******************************************************************************/
function find_unicode_charmap(face)
{
    if (null == face || null == face.charmaps)
        return FT_Common.FT_Err_Invalid_CharMap_Handle;

    var count = Math.min(face.charmaps.length, face.num_charmaps);
    if (0 == count)
        return FT_Common.FT_Err_Invalid_CharMap_Handle;

    var cur = count - 1;
    for ( ; cur >= 0; cur--)
    {
        var cmap = __FT_CharmapRec(face.charmaps[cur]);
        if (cmap.encoding == FT_Common.FT_ENCODING_UNICODE)
        {
            if ((cmap.platform_id == FT_Common.TT_PLATFORM_MICROSOFT && cmap.encoding_id == FT_Common.TT_MS_ID_UCS_4) ||
                (cmap.platform_id == FT_Common.TT_PLATFORM_APPLE_UNICODE && cmap.encoding_id == FT_Common.TT_APPLE_ID_UNICODE_32))
            {
                //#ifdef FT_MAX_CHARMAP_CACHEABLE
                if (cur > FT_Common.FT_MAX_CHARMAP_CACHEABLE)
                {
                    continue;
                }
                //#endif
                face.charmap = face.charmaps[cur];
                return FT_Common.FT_Err_Ok;
            }
        }
    }
    cur = count - 1;
    for ( ; cur >= 0; cur--)
    {
        var cmap = __FT_CharmapRec(face.charmaps[cur]);
        if (cmap.encoding == FT_Common.FT_ENCODING_UNICODE)
        {
            //#ifdef FT_MAX_CHARMAP_CACHEABLE
            if (cur > FT_Common.FT_MAX_CHARMAP_CACHEABLE)
            {
                continue;
            }
            //#endif
            face.charmap = face.charmaps[cur];
            return FT_Common.FT_Err_Ok;
        }
    }
    return FT_Common.FT_Err_Invalid_CharMap_Handle;
}
function ft_glyphslot_init(slot)
{
    var driver = slot.face.driver;
    slot.library = driver.library;
    slot.internal = new FT_Slot_Internal();

    var error = 0;
    if ((driver.flags & FT_Common.FT_MODULE_DRIVER_NO_OUTLINES) == 0)
        slot.internal.loader = FT_GlyphLoader_New(driver.memory);

    if (driver.clazz.init_slot)
        error = driver.clazz.init_slot(slot);
    return error;
}
function ft_glyphslot_free_bitmap(slot)
{
    if (slot.internal != null && (slot.internal.flags & FT_Common.FT_GLYPH_OWN_BITMAP) != 0)
    {
        slot.bitmap.buffer = null;
        slot.internal.flags &= ~FT_Common.FT_GLYPH_OWN_BITMAP;
    }
    else
    {
        slot.bitmap.buffer = null;
    }
}
function ft_glyphslot_set_bitmap(slot, buffer)
{
    ft_glyphslot_free_bitmap(slot);
    slot.bitmap.buffer = buffer;
}
function ft_glyphslot_alloc_bitmap(slot, size)
{
    if ((slot.internal.flags & FT_Common.FT_GLYPH_OWN_BITMAP) != 0)
        slot.bitmap.buffer = null;
    else
        slot.internal.flags |= FT_Common.FT_GLYPH_OWN_BITMAP;

    slot.bitmap.buffer = g_memory.Alloc(size);
    return 0;
}
function ft_glyphslot_clear(slot)
{
    ft_glyphslot_free_bitmap(slot);

    var metrics = slot.metrics;
    metrics.width = 0;
    metrics.height = 0;
    metrics.horiBearingX = 0;
    metrics.horiBearingY = 0;
    metrics.horiAdvance = 0;
    metrics.vertBearingX = 0;
    metrics.vertBearingY = 0;
    metrics.vertAdvance = 0;

    var outl = slot.outline;
    outl.n_contours = 0;
    outl.n_points = 0;
    outl.contours = null;
    outl.points = null;
    outl.tags = null;
    outl.flags = 0;

    slot.bitmap.width      = 0;
    slot.bitmap.rows       = 0;
    slot.bitmap.pitch      = 0;
    slot.bitmap.pixel_mode = 0;

    slot.bitmap_left   = 0;
    slot.bitmap_top    = 0;
    slot.num_subglyphs = 0;
    slot.subglyphs     = 0;
    slot.control_data  = 0;
    slot.control_len   = 0;
    slot.other         = 0;
    slot.format        = FT_Common.FT_GLYPH_FORMAT_NONE;

    slot.linearHoriAdvance = 0;
    slot.linearVertAdvance = 0;
    slot.lsb_delta         = 0;
    slot.rsb_delta         = 0;
}
function ft_glyphslot_done(slot)
{
    var clazz = slot.face.driver.clazz;
    if (clazz.done_slot != null)
        clazz.done_slot(slot);

    ft_glyphslot_free_bitmap(slot);
    slot.internal = null;
}
function ft_glyphslot_grid_fit_metrics(slot,  vertical)
{
    var metrics = slot.metrics;
    var right, bottom;

    if (1 ==  vertical)
    {
        metrics.horiBearingX = FT_PIX_FLOOR(metrics.horiBearingX);
        metrics.horiBearingY = FT_PIX_CEIL (metrics.horiBearingY);

        right  = FT_PIX_CEIL(metrics.vertBearingX + metrics.width);
        bottom = FT_PIX_CEIL(metrics.vertBearingY + metrics.height);

        metrics.vertBearingX = FT_PIX_FLOOR(metrics.vertBearingX);
        metrics.vertBearingY = FT_PIX_FLOOR(metrics.vertBearingY);

        metrics.width  = right - metrics.vertBearingX;
        metrics.height = bottom - metrics.vertBearingY;
    }
    else
    {
        metrics.vertBearingX = FT_PIX_FLOOR(metrics.vertBearingX);
        metrics.vertBearingY = FT_PIX_FLOOR(metrics.vertBearingY);

        right  = FT_PIX_CEIL (metrics.horiBearingX + metrics.width);
        bottom = FT_PIX_FLOOR(metrics.horiBearingY - metrics.height);

        metrics.horiBearingX = FT_PIX_FLOOR(metrics.horiBearingX);
        metrics.horiBearingY = FT_PIX_CEIL (metrics.horiBearingY);

        metrics.width  = right - metrics.horiBearingX;
        metrics.height = metrics.horiBearingY - bottom;
    }

    metrics.horiAdvance = FT_PIX_ROUND(metrics.horiAdvance);
    metrics.vertAdvance = FT_PIX_ROUND(metrics.vertAdvance);
}
function ft_synthesize_vertical_metrics(metrics, advance)
{
    var height = metrics.height;

    /* compensate for glyph with bbox above/below the baseline */
    if (metrics.horiBearingY < 0)
    {
        if (height < metrics.horiBearingY)
            height = metrics.horiBearingY;
    }
    else if (metrics.horiBearingY > 0)
        height -= metrics.horiBearingY;

    /* the factor 1.2 is a heuristical value */
    if (advance == 0)
        advance = parseInt(height * 12 / 10);

    metrics.vertBearingX = parseInt(metrics.horiBearingX - metrics.horiAdvance / 2);
    metrics.vertBearingY = parseInt((advance - height) / 2);
    metrics.vertAdvance  = advance;
}