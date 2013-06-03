/******************************************************************************/
// bdf
/******************************************************************************/
function BDF_PropertyRec()
{
    this.type;
    this.u;
}

function tt_face_free_bdf_props(face)
{
    var bdf = face.bdf;
    if (bdf.loaded == 1)
    {
        bdf.table = null;
        bdf.table_end = 0;
        bdf.strings = null;
        bdf.strings_size = 0;
    }
}

function tt_face_load_bdf_props(face, stream)
{
    var bdf = face.bdf;
    var error = 0;

    bdf.table = null;
    bdf.table_end = 0;
    bdf.strings = null;
    bdf.strings_size = 0;
    bdf.num_strikes = 0;
    bdf.loaded = 0;

    var length = tt_face_goto_table(face, FT_Common.TTAG_BDF, stream);
    error = FT_Error;
    if (error != 0 || length < 8)
        return FT_Common.FT_Err_Invalid_Table;

    bdf.table = new CPointer();
    error = stream.ExtractFrame(length, bdf.table);

    if (error != 0)
        return FT_Common.FT_Err_Invalid_Table;

    bdf.table_end = length;

    var p = dublicate_pointer(bdf.table);
    var version = FT_NEXT_USHORT(p);
    var num_strikes = FT_NEXT_USHORT(p);
    var strings = FT_NEXT_ULONG (p);

    if (version != 0x0001 || strings < 8  || (strings - 8) / 4 < num_strikes || strings + 1 > length)
    {
        bdf.table = null;
        return FT_Common.FT_Err_Invalid_Table;
    }

    bdf.num_strikes = num_strikes;
    bdf.strings = new CPointer();
    bdf.strings.data = bdf.table.data;
    bdf.strings.pos = bdf.table.pos + strings;
    bdf.strings_size = length - strings;

    var count = bdf.num_strikes;
    p.pos = bdf.table.pos + 8;
    var strike = p.pos + count * 4;

    for ( ; count > 0; count--)
    {
        p.pos+=2;
        var num_items = FT_PEEK_USHORT(p);

        strike += 10 * num_items;
        p.pos+=2;
    }

    if (strike > bdf.strings)
    {
        bdf.table = null;
        bdf.table_end = 0;
        bdf.strings = null;
        bdf.strings_size = 0;
        bdf.num_strikes = 0;
        bdf.loaded = 0;
        return FT_Common.FT_Err_Invalid_Table;
    }

    bdf.loaded = 1;
    return error;
}

function tt_face_find_bdf_prop(face,property_name,aprop)
{
    var bdf = face.bdf;
    var size = face.size;
    var error = 0;

    aprop.type = FT_Common.BDF_PROPERTY_TYPE_NONE;

    if (bdf.loaded == 0)
    {
        error = tt_face_load_bdf_props(face, face.stream);
        if (error != 0)
            return error;
    }

    var count = bdf.num_strikes;
    var p = dublicate_pointer(bdf.table);
    p.pos += 8;

    var strike = dublicate_pointer(p);
    strike.pos += 4 * count;

    error = FT_Common.FT_Err_Invalid_Argument;

    var property_len = property_name.length;
    if (size == null || property_len == 0)
        return error;

    var is_strike = 0;
    for ( ; count > 0; count-- )
    {
        var _ppem  = FT_NEXT_USHORT(p);
        var _count = FT_NEXT_USHORT(p);

        if (_ppem == size.metrics.y_ppem)
        {
            count = _count;
            is_strike = 1;
            break;
        }

        strike.pos += 10 * _count;
    }
    if (0 == is_strike)
        return error;

    p.pos = strike.pos;
    var point = dublicate_pointer(bdf.strings);
    for (; count > 0; count--)
    {
        p.pos+=4;
        var type = FT_PEEK_USHORT(p);
        p.pos-=4;

        if ((type & 0x10) != 0)
        {
            var name_offset = FT_PEEK_ULONG(p);
            p.pos+=6;
            var value = FT_PEEK_ULONG(p);
            p.pos-=6;

            point.pos = bdf.strings.pos + name_offset;
            if (name_offset < bdf.strings_size && property_len < bdf.strings_size - name_offset &&
                        property_name == FT_PEEK_String1(point,bdf.strings_size-name_offset))
            {
                switch ( type & 0x0F )
                {
                    case 0x00:
                    case 0x01:
                        point.pos = bdf.strings.pos + value;
                        if (value < bdf.strings_size && -1 != ft_memchr(point, 0, bdf.strings_size))
                        {
                            aprop.type = FT_Common.BDF_PROPERTY_TYPE_ATOM;
                            aprop.u = FT_PEEK_String1(point,bdf.strings_size);
                            return 0;
                        }
                        break;

                    case 0x02:
                        aprop.type = FT_Common.BDF_PROPERTY_TYPE_INTEGER;
                        aprop.u = ((value > FT_Common.m_i) ? value-FT_Common.a_i : value);
                        return 0;
                    case 0x03:
                        aprop.type = FT_Common.BDF_PROPERTY_TYPE_CARDINAL;
                        aprop.u = ((value >= 0) ? value : value + FT_Common.m_i);
                        return 0;
                    default:
                        break;
                }
            }
        }
        p.pos += 10;
    }

    return error;
}

function sfnt_get_charset_id(face,acharset_encoding,acharset_registry)
{
    var encoding = new BDF_PropertyRec();
    var registry = new BDF_PropertyRec();

    FT_Error = tt_face_find_bdf_prop(face, "CHARSET_REGISTRY", registry);
    if (FT_Error == 0)
    {
        FT_Error = tt_face_find_bdf_prop(face, "CHARSET_ENCODING", encoding);
        if (FT_Error == 0)
        {
            if (registry.type == BDF_PROPERTY_TYPE_ATOM && encoding.type == BDF_PROPERTY_TYPE_ATOM)
            {
                return {enc:encoding.u,reg:registry.u};
            }
            else
                FT_Error = FT_Common.FT_Err_Invalid_Argument;
        }
    }

    return {enc:"",reg:""};
}
/******************************************************************************/
// ttkern
/******************************************************************************/
function tt_face_load_kern(face, stream)
{
    var error = 0;
    var table_size = face.goto_table(face, FT_Common.TTAG_kern, stream);
    error = FT_Error;

    if (error != 0)
        return error;

    if (table_size < 4)
        return FT_Common.FT_Err_Table_Missing;

    face.kern_table = new CPointer();
    error = stream.ExtractFrame(table_size, face.kern_table);
    if (error != 0)
        return error;

    face.kern_table_size = table_size;
    stream.cur = face.kern_table.pos;
    var p_limit = stream.cur + table_size;

    stream.cur += 2; // skip version
    var num_tables = stream.GetUShort();

    if (num_tables > 32)
        num_tables = 32;

    var avail = 0;
    var ordered = 0;

    var nn = 0;
    for (; nn < num_tables; nn++)
    {
        var mask = 1 << nn;

        var p_next = stream.cur;

        if (stream.cur + 6 < p_limit)
            break;

        stream.cur += 2; // skip version
        var length = stream.GetUShort();
        var coverage = stream.GetUShort();

        if (length <= 6)
            break;

        p_next += length;

        if (p_next > p_limit)
            p_next = p_limit;

        if ((coverage & ~8) != 0x0001 || (stream.cur + 8) > p_limit)
        {
            stream.cur = p_next;
            continue;
        }

        var num_pairs = stream.GetUShort();
        stream.cur += 6;

        if ((p_next - stream.cur) < (6 * num_pairs))
            num_pairs = parseInt((p_next - stream.cur) / 6);

        avail |= mask;

        if (num_pairs > 0)
        {
            var count = 0;
            var old_pair = stream.GetULong();

            stream.cur += 2;

            for (count = num_pairs - 1; count > 0; count--)
            {
                var cur_pair = stream.GetULong();
                if (cur_pair <= old_pair)
                    break;

                stream.cur += 2;
                old_pair = cur_pair;
            }

            if (count == 0)
                ordered |= mask;
        }

        stream.cur = p_next;
    }

    face.num_kern_tables = nn;
    face.kern_avail_bits = avail;
    face.kern_order_bits = ordered;

    return error;
}
function tt_face_done_kern(face)
{
    face.kern_table = null;
    face.kern_table_size = 0;
    face.num_kern_tables = 0;
    face.kern_avail_bits = 0;
    face.kern_order_bits = 0;
}
function tt_face_get_kerning(face,left_glyph,right_glyph)
{
    var result = 0;
    var count, mask = 1;
    var p = dublicate_pointer(face.kern_table);
    if (null == p)
        return result;

    var p_limit = p.pos + face.kern_table_size;

    p.pos += 4;
    mask = 0x0001;

    for (count = face.num_kern_tables; count > 0 && p.pos + 6 <= p_limit; count--, mask <<= 1)
    {
        if (mask < 0)
            mask+=FT_Common.a_i;
        var version  = FT_NEXT_USHORT( p );
        var length   = FT_NEXT_USHORT( p );
        var coverage = FT_NEXT_USHORT( p );
        var value = 0;

        var base = p.pos;
        var next = base + length;

        if (next > p_limit)
            next = p_limit;

        if ((face.kern_avail_bits & mask) == 0)
        {
            p.pos = next;
            continue;
        }

        if (p.pos + 8 > next)
        {
            p.pos = next;
            continue;
        }

        var num_pairs = FT_NEXT_USHORT( p );
        p.pos += 6;

        if (( next - p.pos) < 6 * num_pairs)
            num_pairs = parseInt((next - p.pos)/6);

        switch (coverage >>> 8)
        {
            case 0:
            {
                var key0 = (left_glyph<<16 | right_glyph)&0xFFFFFFFF;
                if (key0 < 0)
                    key0 += FT_Common.a_i;

                if ((face.kern_order_bits & mask) != 0)
                {
                    var min = 0;
                    var max = num_pairs;

                    var q = dublicate_pointer(p);
                    var is_found = 0;
                    while ( min < max )
                    {
                        var mid = (min + max) >>> 1;
                        q.pos = p.pos + 6 * mid;
                        var key = FT_NEXT_ULONG(q);

                        if (key == key0)
                        {
                            value = FT_PEEK_SHORT( q );
                            if ((coverage & 8) != 0)
                                result = value;
                            else
                                result += value;
                            p.pos = next;
                            is_found = 1;
                            break;
                        }
                        if (key < key0)
                            min = mid + 1;
                        else
                            max = mid;
                    }
                    if (1 == is_found)
                        continue;
                }
                else
                {
                    var is_found = 0;
                    for (var count2 = num_pairs; count2 > 0; count2--)
                    {
                        var key = FT_NEXT_ULONG(p);

                        if (key == key0)
                        {
                            value = FT_PEEK_SHORT(p);
                            if ((coverage & 8) != 0)
                                result = value;
                            else
                                result += value;
                            p.pos = next;
                            is_found = 1;
                            break;
                        }
                        p.pos += 2;
                    }
                    if (is_found == 1)
                        continue;
                }
            }
            break;
        default:
            break;
        }
        p.pos = next;
    }

    return result;
}
/******************************************************************************/
// ttload
/******************************************************************************/
function tt_face_lookup_table(face, tag)
{
    var count = face.num_tables;
    for (var i=0; i<count; i++)
    {
        var entry = face.dir_tables[i];
        if (entry.Tag == tag && entry.Length != 0)
            return entry;
    }
    return null;
}
function tt_face_goto_table(face, tag, stream)
{
    var length = 0;
    var table = tt_face_lookup_table(face, tag);
    if (table != null)
    {
        length = table.Length;
        FT_Error = stream.Seek(table.Offset);
        return table.Length;
    }
    FT_Error = FT_Common.FT_Err_Table_Missing;
    return 0;
}
function check_table_dir(sfnt, stream)
{
    var error = 0;
    var nn = 0;
    var valid_entries = 0;
    var has_head = 0;
    var has_sing = 0;
    var has_meta = 0;
    var offset = sfnt.offset + 12;

    error = stream.Seek(offset);
    if (FT_Common.FT_Err_Ok != error)
        return error;

    var num_t = sfnt.num_tables;
    for (nn = 0; nn < num_t; nn++)
    {
        error = stream.EnterFrame(16);
        if (error != 0)
        {
            nn--;
            sfnt.num_tables = nn;
            break;
        }

        var Tag = stream.GetULong();
        var CheckSum = stream.GetULong();
        var Offset = stream.GetULong();
        var Length = stream.GetULong();

        stream.ExitFrame();

        if (Offset + Length > stream.size)
            continue;
        else
            valid_entries++;

        if (Tag == FT_Common.TTAG_head || Tag == FT_Common.TTAG_bhed)
        {
            has_head = 1;
            if (Length < 0x36)
                return FT_Common.FT_Err_Table_Missing;

            error = stream.Seek(Offset + 12);
            if (error != FT_Common.FT_Err_Ok)
                return error;

            var magic = stream.ReadULong();
            if (magic != 0x5F0F3CF5)
                return FT_Common.FT_Err_Table_Missing;

            error = stream.Seek(offset + (nn+1)*16);
            if (error != FT_Common.FT_Err_Ok)
                return error;
        }
        else if (Tag == FT_Common.TTAG_SING)
            has_sing = 1;
        else if (Tag == FT_Common.TTAG_META)
            has_meta = 1;
    }

    sfnt.num_tables = valid_entries;

    if (sfnt.num_tables == 0)
        return FT_Common.FT_Err_Unknown_File_Format;

    if ((has_head == 1) || ((has_sing == 1) && (has_meta == 1)))
        return FT_Common.FT_Err_Ok;
    else
        return FT_Common.FT_Err_Table_Missing;

    return error;
}
function tt_face_load_font_dir(face, stream)
{
    var sfnt = new SFNT_HeaderRec();
    var error = 0;

    sfnt.offset = stream.pos;
    sfnt.format_tag = stream.ReadULong();

    error = FT_Error;
    if (error != 0)
        return error;

    error = stream.EnterFrame(8);
    if (error != 0)
        return error;

    sfnt.num_tables = stream.GetUShort();
    sfnt.search_range = stream.GetUShort();
    sfnt.entry_selector = stream.GetUShort();
    sfnt.range_shift = stream.GetUShort();

    stream.ExitFrame();

    error = check_table_dir(sfnt, stream);
    if (0 != error)
        return error;

    face.num_tables = sfnt.num_tables;
    face.format_tag = sfnt.format_tag;

    face.dir_tables = new Array(face.num_tables);

    error = stream.Seek(sfnt.offset + 12);
    if (0 == error)
    {
        error = stream.EnterFrame(face.num_tables * 16);
    }
    if (0 != error)
        return error;

    var cur = 0;
    for (var nn = 0; nn < sfnt.num_tables; nn++ )
    {
        face.dir_tables[cur] = new TT_Table();
        var entry = face.dir_tables[cur];
        entry.Tag      = stream.GetULong();
        entry.CheckSum = stream.GetULong();
        entry.Offset   = stream.GetLong();
        entry.Length   = stream.GetLong();

        /* ignore invalid tables */
        if (entry.Offset + entry.Length > stream.size)
            continue;
        cur++;
    }

    stream.ExitFrame();
    return error;
}
function tt_face_load_any(face,tag,offset,buffer,length)
{
    var error = 0;
    var table;
    var size;

    if (tag != 0)
    {
        table = tt_face_lookup_table(face, tag);
        if (null == table)
            return FT_Common.FT_Err_Table_Missing;

        offset += table.Offset;
        size = table.Length;
    }
    else
    {
        size = face.stream.size;
    }

    if (length == 0)
    {
        FT_Error = 0;
        return size;
    }

    if (null != length)
        size = length;

    error = face.stream.ReadAt(offset,buffer,size);
    FT_Error = error;
    return size;
}
function tt_face_load_generic_header(face, stream, tag)
{
    var error = 0;
    face.goto_table(face, tag, stream);
    error = FT_Error;
    if (error != FT_Common.FT_Err_Ok)
        return error;

    error = stream.EnterFrame(54);
    if (error != 0)
        return error;

    var header = face.header;

    header.Table_Version = stream.GetULong();
    header.Font_Revision = stream.GetULong();
    header.CheckSum_Adjust = stream.GetLong();
    header.Magic_Number = stream.GetLong();
    header.Flags = stream.GetUShort();
    header.Units_Per_EM = stream.GetUShort();
    header.Created1 = stream.GetLong();
    header.Created2 = stream.GetLong();
    header.Modified1 = stream.GetLong();
    header.Modified2 = stream.GetLong();
    header.xMin = stream.GetShort();
    header.yMin = stream.GetShort();
    header.xMax = stream.GetShort();
    header.yMax = stream.GetShort();
    header.Mac_Style = stream.GetUShort();
    header.Lowest_Rec_PPEM = stream.GetUShort();
    header.Font_Direction = stream.GetShort();
    header.Index_To_Loc_Format = stream.GetShort();
    header.Glyph_Data_Format = stream.GetShort();

    stream.ExitFrame();

    return error;
}
function tt_face_load_head(face, stream)
{
    return tt_face_load_generic_header(face, stream, FT_Common.TTAG_head);
}
function tt_face_load_bhed(face, stream)
{
    return tt_face_load_generic_header(face, stream, FT_Common.TTAG_bhed);
}
function tt_face_load_maxp(face, stream)
{
    var error = 0;
    face.goto_table(face, FT_Common.TTAG_maxp, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    error = stream.EnterFrame(6);
    if (error != 0)
        return error;

    var maxProfile = face.max_profile;
    maxProfile.version = stream.GetLong();
    maxProfile.numGlyphs = stream.GetUShort();
    stream.ExitFrame();

    maxProfile.maxPoints             = 0;
    maxProfile.maxContours           = 0;
    maxProfile.maxCompositePoints    = 0;
    maxProfile.maxCompositeContours  = 0;
    maxProfile.maxZones              = 0;
    maxProfile.maxTwilightPoints     = 0;
    maxProfile.maxStorage            = 0;
    maxProfile.maxFunctionDefs       = 0;
    maxProfile.maxInstructionDefs    = 0;
    maxProfile.maxStackElements      = 0;
    maxProfile.maxSizeOfInstructions = 0;
    maxProfile.maxComponentElements  = 0;
    maxProfile.maxComponentDepth     = 0;

    if (maxProfile.version >= 0x10000)
    {
        error = stream.EnterFrame(26);
        if (error != 0)
            return error;

        maxProfile.maxPoints             = stream.GetUShort();
        maxProfile.maxContours           = stream.GetUShort();
        maxProfile.maxCompositePoints    = stream.GetUShort();
        maxProfile.maxCompositeContours  = stream.GetUShort();
        maxProfile.maxZones              = stream.GetUShort();
        maxProfile.maxTwilightPoints     = stream.GetUShort();
        maxProfile.maxStorage            = stream.GetUShort();
        maxProfile.maxFunctionDefs       = stream.GetUShort();
        maxProfile.maxInstructionDefs    = stream.GetUShort();
        maxProfile.maxStackElements      = stream.GetUShort();
        maxProfile.maxSizeOfInstructions = stream.GetUShort();
        maxProfile.maxComponentElements  = stream.GetUShort();
        maxProfile.maxComponentDepth     = stream.GetUShort();

        if (maxProfile.maxFunctionDefs < 64)
            maxProfile.maxFunctionDefs = 64;

        /* we add 4 phantom points later */
        if (maxProfile.maxTwilightPoints > (0xFFFF - 4))
            maxProfile.maxTwilightPoints = 0xFFFF - 4;

        /* we arbitrarily limit recursion to avoid stack exhaustion */
        if (maxProfile.maxComponentDepth > 100)
            maxProfile.maxComponentDepth = 100;

        stream.ExitFrame();
    }
    return error;
}
function tt_face_load_name(face, stream)
{
    var error = 0;
    var table_pos = 0;
    var table_len = 0;
    var storage_start = 0;
    var storage_limit = 0;
    var count = 0;

    table_len = face.goto_table(face, FT_Common.TTAG_name, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    var table = face.name_table;
    table.stream = stream;

    table_pos = stream.pos;

    error = stream.EnterFrame(6);
    if (error != 0)
        return error;

    table.format = stream.GetUShort();
    table.numNameRecords = stream.GetUShort();
    table.storageOffset = stream.GetUShort();

    stream.ExitFrame();

    storage_start = table_pos + 6 + 12*table.numNameRecords;
    storage_limit = table_pos + table_len;

    if (storage_start > storage_limit)
        return FT_Common.FT_Err_Name_Table_Missing;

    /* Allocate the array of name records. */
    count = table.numNameRecords;
    table.numNameRecords = 0;

    table.names = new Array(count);

    error = stream.EnterFrame(count * 12);
    for (; count > 0; count--)
    {
        var entry = new TT_NameEntryRec();
        entry.platformID = stream.GetUShort();
        entry.encodingID = stream.GetUShort();
        entry.languageID = stream.GetUShort();
        entry.nameID = stream.GetUShort();
        entry.stringLength = stream.GetUShort();
        entry.stringOffset = stream.GetUShort();

        if (entry.stringLength == 0)
            continue;

        entry.stringOffset += (table_pos + table.storageOffset);
        if (entry.stringOffset < storage_start || (entry.stringOffset + entry.stringLength) > storage_limit)
            continue;

        table.names[table.numNameRecords] = entry;
        table.numNameRecords++;
    }

    stream.ExitFrame();

    /* everything went well, update face->num_names */
    face.num_names = table.numNameRecords;
    return error;
}
function tt_face_free_name(face)
{
    face.name_table.names = null;
    var table = face.num_table;
    table.names = null;
    table.numNameRecords = 0;
    table.format         = 0;
    table.storageOffset  = 0;
}
function tt_face_load_cmap(face, stream)
{
    face.cmap_size = face.goto_table(face, FT_Common.TTAG_cmap, stream);
    if (FT_Error != 0)
        return FT_Error;

    face.cmap_table = new CPointer();
    var error = stream.ExtractFrame(face.cmap_size, face.cmap_table);
    if (error != 0)
    {
        face.cmap_size = 0;
        face.cmap_table = null;
    }
    return error;
}
function tt_face_load_os2(face, stream)
{
    var error = 0;

    var os2 = face.os2;

    face.goto_table(face, FT_Common.TTAG_OS2, stream);
    if (error != 0)
        return error;

    error = stream.EnterFrame(78);
    if (error != 0)
        return error;

    os2.version = stream.GetUShort();
    os2.xAvgCharWidth = stream.GetShort();
    os2.usWeightClass = stream.GetUShort();
    os2.usWidthClass = stream.GetUShort();
    os2.fsType = stream.GetShort();
    os2.ySubscriptXSize = stream.GetShort();
    os2.ySubscriptYSize = stream.GetShort();
    os2.ySubscriptXOffset = stream.GetShort();
    os2.ySubscriptYOffset = stream.GetShort();
    os2.ySuperscriptXSize = stream.GetShort();
    os2.ySuperscriptYSize = stream.GetShort();
    os2.ySuperscriptXOffset = stream.GetShort();
    os2.ySuperscriptYOffset = stream.GetShort();
    os2.yStrikeoutSize = stream.GetShort();
    os2.yStrikeoutPosition = stream.GetShort();
    os2.sFamilyClass = stream.GetShort();

    os2.panose = new Array(10);
    os2.panose[0] = stream.GetUChar();
    os2.panose[1] = stream.GetUChar();
    os2.panose[2] = stream.GetUChar();
    os2.panose[3] = stream.GetUChar();
    os2.panose[4] = stream.GetUChar();
    os2.panose[5] = stream.GetUChar();
    os2.panose[6] = stream.GetUChar();
    os2.panose[7] = stream.GetUChar();
    os2.panose[8] = stream.GetUChar();
    os2.panose[9] = stream.GetUChar();

    os2.ulUnicodeRange1 = stream.GetULong();
    os2.ulUnicodeRange2 = stream.GetULong();
    os2.ulUnicodeRange3 = stream.GetULong();
    os2.ulUnicodeRange4 = stream.GetULong();

    os2.achVendID = new Array(4);
    os2.achVendID[0] = stream.GetUChar();
    os2.achVendID[1] = stream.GetUChar();
    os2.achVendID[2] = stream.GetUChar();
    os2.achVendID[3] = stream.GetUChar();

    os2.fsSelection = stream.GetUShort();
    os2.usFirstCharIndex = stream.GetUShort();
    os2.usLastCharIndex = stream.GetUShort();
    os2.sTypoAscender = stream.GetShort();
    os2.sTypoDescender = stream.GetShort();
    os2.sTypoLineGap = stream.GetShort();
    os2.usWinAscent = stream.GetUShort();
    os2.usWinDescent = stream.GetUShort();

    os2.ulCodePageRange1 = 0;
    os2.ulCodePageRange2 = 0;
    os2.sxHeight         = 0;
    os2.sCapHeight       = 0;
    os2.usDefaultChar    = 0;
    os2.usBreakChar      = 0;
    os2.usMaxContext     = 0;

    stream.ExitFrame();

    if (os2.version >= 0x0001)
    {
        error = stream.EnterFrame(8);
        if (error != 0)
            return error;

        os2.ulCodePageRange1 = stream.GetULong();
        os2.ulCodePageRange2 = stream.GetULong();

        if (os2.version >= 0x0002)
        {
            error = stream.EnterFrame(10);
            if (error != 0)
                return error;

            os2.sxHeight         = stream.GetShort();
            os2.sCapHeight       = stream.GetShort();
            os2.usDefaultChar    = stream.GetUShort();
            os2.usBreakChar      = stream.GetUShort();
            os2.usMaxContext     = stream.GetUShort();
        }
    }

    return error;
}
function tt_face_load_post(face, stream)
{
    var error = 0;

    face.goto_table(face, FT_Common.TTAG_post, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    error = stream.EnterFrame(32);
    if (error != 0)
        return error;

    var post = face.postscript;
    post.FormatType = stream.GetLong();
    post.italicAngle = stream.GetLong();
    post.underlinePosition = stream.GetShort();
    post.underlineThickness = stream.GetShort();
    post.isFixedPitch = stream.GetULong();
    post.minMemType42 = stream.GetULong();
    post.maxMemType42 = stream.GetULong();
    post.minMemType1 = stream.GetULong();
    post.maxMemType1 = stream.GetULong();

    stream.ExitFrame();

    return error;
}
function tt_face_load_pclt(face, stream)
{
    var error = 0;
    var pclt = face.pclt;

    /* optional table */
    face.goto_table(face, FT_Common.TTAG_PCLT, stream);
    if (error != 0)
        return error;

    error = stream.EnterFrame(54);
    if (error != 0)
        return error;

    pclt.Version = stream.GetULong();
    pclt.FontNumber = stream.GetULong();
    pclt.Pitch = stream.GetUShort();
    pclt.xHeight = stream.GetUShort();
    pclt.Style = stream.GetUShort();
    pclt.TypeFamily = stream.GetUShort();
    pclt.CapHeight = stream.GetUShort();
    pclt.SymbolSet = stream.GetUShort();
    pclt.TypeFace = stream.GetString1(16);
    pclt.CharacterComplement = stream.GetString1(8);
    pclt.FileName = stream.GetString1(6);
    pclt.StrokeWeight = stream.GetChar();
    pclt.WidthType = stream.GetChar();
    pclt.SerifStyle = stream.GetUChar();
    pclt.Reserved = stream.GetUChar();

    stream.ExitFrame();
    return error;
}
function tt_face_load_gasp(face, stream)
{
    var error = 0;
    face.goto_table(face, FT_Common.TTAG_gasp, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    error = stream.EnterFrame(4);
    if (error != 0)
        return error;

    face.gasp.version   = stream.GetUShort();
    face.gasp.numRanges = stream.GetUShort();

    stream.ExitFrame();

    if (face.gasp.version >= 2)
    {
        face.gasp.numRanges = 0;
        return FT_Common.FT_Err_Invalid_Table;
    }

    var num_ranges = face.gasp.numRanges;
    face.gasp.gaspRanges = new Array(num_ranges);
    var ranges = face.gasp.gaspRanges;

    error = stream.EnterFrame(num_ranges * 4);
    if (error != 0)
        return error;

    for (var i = 0; i < num_ranges; i++)
    {
        ranges[i] = new TT_GaspRange();
        ranges[i].maxPPEM = stream.GetUShort();
        ranges[i].gaspFlag = stream.GetUShort();
    }

    stream.ExitFrame();
    return error;
}
/******************************************************************************/
// ttmtx
/******************************************************************************/
function tt_face_load_hmtx(face, stream, isvertical)
{
    var error = 0;

    var table_len = 0;
    var num_shorts = 0;
    var num_longs = 0;
    var num_shorts_checked = 0;

    var lm = null;

    if (isvertical == 1)
    {
        table_len = face.goto_table(face, FT_Common.TTAG_vmtx, stream);
        error = FT_Error;
        if (error != 0)
            return error;

        num_longs = face.vertical.number_Of_VMetrics;
        if (num_longs > (table_len / 4))
            num_longs = parseInt(table_len / 4);

        face.vertical.number_Of_VMetrics = 0;

        lm = face.vertical;
    }
    else
    {
        table_len = face.goto_table(face, FT_Common.TTAG_hmtx, stream);
        error = FT_Error;
        if (error != 0)
            return error;

        num_longs = face.horizontal.number_Of_HMetrics;
        if (num_longs > (table_len / 4))
            num_longs = parseInt(table_len / 4);

        face.horizontal.number_Of_HMetrics = 0;

        lm = face.horizontal;
    }

    /* never trust derived values */
    num_shorts         = face.max_profile.numGlyphs - num_longs;
    num_shorts_checked = parseInt((table_len - num_longs * 4) / 2);

    if (num_longs > 0)
        lm.long_metrics = new Array(num_longs);
    if (num_shorts > 0)
        lm.short_metrics = new Array(num_shorts);

    var longs  = lm.long_metrics;
    var shorts = lm.short_metrics;

    if (num_shorts < 0)
        num_shorts = 0;

    error = stream.EnterFrame(table_len);

    for (var i = 0; i < num_longs; i++)
    {
        longs[i] = new TT_LongMetricsRec();
        longs[i].advance = stream.GetUShort();
        longs[i].bearing = stream.GetShort();
    }

    var count_s = Math.min(num_shorts, num_shorts_checked);
    for (var i = 0; i < count_s; i++)
    {
        shorts[i] = stream.GetShort();
    }

    if (num_shorts > num_shorts_checked && num_shorts_checked > 0)
    {
        var ind = shorts.length;
        var val = shorts[num_shorts_checked - 1];
        for (var i = ind; i < num_shorts; i++)
            shorts[i] = val;
    }

    stream.ExitFrame();

    if (isvertical)
        face.vertical.number_Of_VMetrics = num_longs;
    else
        face.horizontal.number_Of_HMetrics = num_longs;

    return error;
}
function tt_face_load_hhea(face, stream, isvertical)
{
    var error = 0;
    var header = null;
    if (1 == isvertical)
    {
        face.goto_table(face, FT_Common.TTAG_vhea, stream);
        error = FT_Error;
        if (error != 0)
            return error;

        header = face.vertical;
    }
    else
    {
        face.goto_table(face, FT_Common.TTAG_hhea, stream);
        error = FT_Error;
        if (error != 0)
            return error;

        header = face.horizontal;
    }

    error = stream.EnterFrame(36);
    if (error != 0)
        return error;

    if (0 == isvertical)
    {
        header.Version = stream.GetULong();
        header.Ascender = stream.GetShort();
        header.Descender = stream.GetShort();
        header.Line_Gap = stream.GetShort();

        header.advance_Width_Max = stream.GetUShort();

        header.min_Left_Side_Bearing = stream.GetShort();
        header.min_Right_Side_Bearing = stream.GetShort();
        header.xMax_Extent = stream.GetShort();
        header.caret_Slope_Rise = stream.GetShort();
        header.caret_Slope_Run = stream.GetShort();
        header.caret_Offset = stream.GetShort();

        header.Reserved1 = stream.GetShort();
        header.Reserved2 = stream.GetShort();
        header.Reserved3 = stream.GetShort();
        header.Reserved4 = stream.GetShort();

        header.metric_Data_Format = stream.GetShort();
        header.number_Of_HMetrics = stream.GetUShort();
    }
    else
    {
        header.Version = stream.GetULong();
        header.Ascender = stream.GetShort();
        header.Descender = stream.GetShort();
        header.Line_Gap = stream.GetShort();

        header.advance_Height_Max = stream.GetUShort();

        header.min_Top_Side_Bearing = stream.GetShort();
        header.min_Bottom_Side_Bearing = stream.GetShort();
        header.yMax_Extent = stream.GetShort();
        header.caret_Slope_Rise = stream.GetShort();
        header.caret_Slope_Run = stream.GetShort();
        header.caret_Offset = stream.GetShort();

        header.Reserved1 = stream.GetShort();
        header.Reserved2 = stream.GetShort();
        header.Reserved3 = stream.GetShort();
        header.Reserved4 = stream.GetShort();

        header.metric_Data_Format = stream.GetShort();
        header.number_Of_VMetrics = stream.GetUShort();
    }

    stream.ExitFrame();

    header.long_metrics  = null;
    header.short_metrics = null;

    return error;
}
function tt_face_get_metrics(face, vertical, gindex)
{
    var header = (vertical == 1) ? face.vertical : face.horizontal;

    var longs_m = null;
    var k = header.number_Of_HMetrics;

    var v1 = 0;
    var v2 = 0;
    if (k == 0 || null == header.long_metrics || gindex >= face.max_profile.numGlyphs)
        return { bearing:0,advance:0 };

    if (gindex < k)
    {
        longs_m = header.long_metrics[gindex];
        v1 = longs_m.bearing;
        v2 = longs_m.advance;
    }
    else
    {
        v1 = header.short_metrics[gindex - k];
        v2 = header.long_metrics[k - 1].advance;
    }
    return { bearing:v1,advance:v2 };
}
/******************************************************************************/
// ttpost
/******************************************************************************/
function load_format_20(face, stream, post_limit)
{
    var error = 0;

    var num_glyphs = stream.ReadUShort();
    error = FT_Error;
    if (error != 0)
        return error;

    if (num_glyphs > face.max_profile.numGlyphs)
        return FT_Common.FT_Err_Invalid_File_Format;

    error = stream.EnterFrame(num_glyphs*2);
    if (error != 0)
        return error;

    var glyph_indices = new Array(num_glyphs);
    for (var n=0;n<num_glyphs;n++)
        glyph_indices[n] = stream.GetUShort();
    stream.ExitFrame();

    var num_names = 0;
    for ( n = 0; n < num_glyphs; n++ )
    {
        var idx = glyph_indices[n];
        if (idx >= 258)
        {
            idx -= 257;
            if (idx > num_names)
                num_names = idx;
        }
    }

    var name_strings = new Array(num_names);
    var n=0;
    for (n = 0; n < num_names; n++)
    {
        var len = 0;
        if (stream.pos >= post_limit)
            break;
        else
        {
            len = stream.ReadUChar();
            error = FT_Error;
            if (error != 0)
                return error;
        }

        if (len > post_limit || stream.pos > post_limit - len)
        {
            len = Math.max(0, post_limit - stream.pos);
        }

        name_strings[n] = stream.ReadString1(len);
    }

    if (n < num_names)
    {
        for (; n < num_names; n++)
            name_strings[n] = "";
    }

    var table = face.postscript_names.names.format_20;
    table.num_glyphs    = num_glyphs;
    table.num_names     = num_names;
    table.glyph_indices = glyph_indices;
    table.glyph_names   = name_strings;

    return 0;
}
function load_format_25(face, stream, post_limit)
{
    var num_glyphs = stream.ReadUShort();
    error = FT_Error;
    if (error != 0)
        return error;

    if (num_glyphs > face.max_profile.numGlyphs || num_glyphs > 258)
        return FT_Common.FT_Err_Invalid_File_Format;

    var offset_table = g_memory.Alloc(num_glyphs);
    error = stream.Read(offset_table,num_glyphs);

    if (error != 0)
        return error;

    for (var n = 0; n < num_glyphs; n++ )
    {
        var idx = n + offset_table[n];
        if ( idx < 0 || idx > num_glyphs )
            return FT_Common.FT_Err_Invalid_File_Format;
    }

    var table = face.postscript_names.names.format_25;
    table.num_glyphs = num_glyphs;
    table.offsets = offset_table;
    return 0;
}
function load_post_names(face)
{
    var stream = face.stream;
    var post_len = face.goto_table(face, FT_Common.TTAG_post, stream);
    var error = FT_Error;
    if (error != 0)
        return error;

    var post_limit = stream.pos + post_len;
    var format = face.postscript.FormatType;

    error = stream.Skip(32);
    if (error != 0)
        return error;

    if (format == 0x00020000)
        error = load_format_20(face, stream, post_limit);
    else if (format == 0x00028000)
        error = load_format_25(face, stream, post_limit);
    else
        error = FT_Common.FT_Err_Invalid_File_Format;

    face.postscript_names.loaded = 1;
    return error;
}
function tt_face_free_ps_names(face)
{
    var names = face.postscript_names;

    if (names.loaded == 1)
    {
        var format = face.postscript.FormatType;
        if (format == 0x00020000)
        {
            var table = names.names.format_20;

            table.glyph_indices = null;
            table.num_glyphs = 0;

            table.glyph_names = null;
            table.num_names = 0;
        }
        else if (format == 0x00028000)
        {
            var table = names.names.format_25;
            table.offsets = null;
            table.num_glyphs = 0;
        }
    }
    names.loaded = 0;
}
function tt_face_get_ps_name(face, idx)
{
    if (null == face)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Face_Handle;
        return "";
    }
    if (idx >= face.max_profile.numGlyphs)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Glyph_Index;
        return "";
    }
    var psnames = face.psnames;
    if (null == psnames)
    {
        FT_Error = FT_Common.FT_Err_Unimplemented_Feature;
        return "";
    }

    FT_Error = 0;
    var names = face.postscript_names;
    var format = face.postscript.FormatType;

    var res = psnames.macintosh_name(0);
    if (format == 0x00010000)
    {
        if (idx < 258)
            res = psnames.macintosh_name(idx);
    }
    else if (format == 0x00020000)
    {
        var table = names.names.format_20;
        if (0 == names.loaded)
        {
            FT_Error = load_post_names(face);
            if (FT_Error != 0)
                return res;
        }

        if (idx < table.num_glyphs)
        {
            var name_index = table.glyph_indices[idx];

            if (name_index < 258)
                res = psnames.macintosh_name(name_index);
            else
                res = table.glyph_names[name_index - 258];
        }
    }
    else if (format == 0x00028000)
    {
        var table = names.names.format_25;
        if (0 == names.loaded)
        {
            FT_Error = load_post_names( face );
            if (FT_Error != 0)
                return res;
        }

        if (idx < table.num_glyphs)
        {
            idx += table.offsets[idx];
            res = psnames.macintosh_name(idx);
        }
    }
    return res;
}
/******************************************************************************/
// ttsbit
/******************************************************************************/
function blit_sbit(target, _source, line_bits, byte_padded, x_offset, y_offset, source_height)
{
    var line_incr = target.pitch;
    var line_buff = target.buffer;

    var source = dublicate_pointer(_source);

    if (line_incr < 0)
        line_buff -= line_incr * (target.rows - 1);

    line_buff.pos += (x_offset >> 3) + y_offset * line_incr;

    var acc    = 0;
    var loaded = 0;

    for (var height = source_height; height > 0; height--)
    {
        var cur = dublicate_pointer(line_buff);
        var count = line_bits;
        var shift = (x_offset & 7);
        var space = (8 - shift);

        if ( count >= 8 )
        {
            count -= 8;
            do
            {
                if (loaded < 8)
                {
                    acc |= (source.data[source.pos++] << ( 8 - loaded));
                    loaded += 8;
                }

                val = (0xFF & (acc >>> 8));
                if (shift != 0)
                {
                    cur.data[cur.pos] |= (0xFF & (val >>> shift));
                    cur.data[cur.pos+1] |= (0xFF & (val << space));
                }
                else
                    cur.data[cur.pos] |= val;

                cur.pos++;
                acc <<= 8;
                loaded -= 8;
                count  -= 8;
            } while (count >= 0);
            count += 8;
        }

        if (count > 0)
        {
            if (loaded < count)
            {
                acc |= ((source.data[source.pos++]) << (8 - loaded));
                loaded += 8;
            }

            var val = ((0xFF&(acc >>> 8)) & ~(0xFF >>> count));
            cur.data[cur.pos] |= (0xFF & (val >>> shift));

            if (count > space)
                cur.data[cur.pos+1] |= (0xFF & (val << space));

            acc <<= count;
            loaded -= count;
        }

        if ( byte_padded )
        {
            acc    = 0;
            loaded = 0;
        }
        line_buff.pos += line_incr;
    }
}
function Load_SBit_Const_Metrics(range, stream)
{
    range.image_size = stream.ReadULong();
    if (FT_Error != 0)
        return FT_Error;

    var error = stream.EnterFrame(8);
    if (0 == error)
    {
        var metrics = range.metrics;

        metrics.height = stream.GetUChar();
        metrics.width = stream.GetUChar();

        metrics.horiBearingX = stream.GetChar();
        metrics.horiBearingY = stream.GetChar();
        metrics.horiAdvance = stream.GetUChar();

        metrics.vertBearingX = stream.GetChar();
        metrics.vertBearingY = stream.GetChar();
        metrics.vertAdvance = stream.GetUChar();
    }
    stream.ExitFrame();
    return error;
}
function Load_SBit_Range_Codes(range, stream, load_offsets)
{
    var count = stream.ReadULong();
    if (FT_Error != 0)
        return FT_Error;

    range.num_glyphs = count;

    var size = 2 * count;
    if (load_offsets != 0)
    {
        range.glyph_offsets = new Array(count);
        size *= 2;
    }

    var error = stream.EnterFrame(size);
    if (0 != error)
        return error;

    range.glyph_codes = new Array(count);

    for (var n = 0; n < count; n++)
    {
        range.glyph_codes[n] = stream.GetUShort();

        if (load_offsets != 0)
            range.glyph_offsets[n] = range.image_offset + stream.GetUShort();
    }

    stream.ExitFrame();
    return error;
}
function Load_SBit_Range(range, stream)
{
    var error = 0;

    switch(range.index_format)
    {
    case 1:
    case 3:
        if (range.last_glyph < range.first_glyph)
            return FT_Common.FT_Err_Invalid_File_Format;

        var num_glyphs = range.last_glyph - range.first_glyph + 1;
        range.num_glyphs = num_glyphs;
        num_glyphs++;

        var large = (range.index_format == 1) ? 1 : 0;
        var size_elem = large ? 4 : 2;

        error = stream.EnterFrame(num_glyphs*size_elem);
        if (error != 0)
            return error;
        range.glyph_offsets = new Array(num_glyphs);

        for (n = 0; n < num_glyphs; n++)
            range.glyph_offsets[n] = (range.image_offset + ((large == 1) ? stream.GetULong() : stream.GetUShort()));
        stream.ExitFrame();
        break;

    case 2:
        error = Load_SBit_Const_Metrics(range, stream);
        break;
    case 4:
        error = Load_SBit_Range_Codes(range, stream, 1);
        break;
    case 5:
        error = Load_SBit_Const_Metrics(range, stream);
        if (error != 0)
            error = Load_SBit_Range_Codes(range, stream, 0);
        break;
    default:
        error = FT_Common.FT_Err_Invalid_File_Format;
    }
    return error;
}

function tt_face_load_eblc(face, stream)
{
    var error = 0;

    face.num_sbit_strikes = 0;
    face.goto_table(face, FT_Common.TTAG_EBLC, stream);
    if (FT_Error != 0)
        face.goto_table(face, FT_Common.TTAG_bloc, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    var table_base = stream.pos;
    error = stream.EnterFrame(8);
    if (error != 0)
        return error;

    var version = stream.GetLong();
    var num_strikes = stream.GetULong();

    stream.ExitFrame();

    if (version != 0x00020000 || num_strikes >= 0x10000)
        return FT_Common.FT_Err_Invalid_File_Format;

    face.sbit_strikes = new Array(num_strikes);
    face.num_sbit_strikes = num_strikes;
    
    for (var i = 0; i < num_strikes; i++)
        face.sbit_strikes[i] = new TT_SBit_StrikeRec();

    var strike_ind = 0;
    var count  = num_strikes;

    error = stream.EnterFrame(48*num_strikes);
    if (error != 0)
        return error;

    while ( count > 0 )
    {
        var strike = face.sbit_strikes[strike_ind];

        strike.ranges_offset = stream.GetULong();
        stream.cur += 4;
        strike.num_ranges = stream.GetULong();
        strike.color_ref = stream.GetULong();

        var h = strike.hori;
        var v = strike.vert;

        h.ascender = stream.GetChar();
        h.descender = stream.GetChar();
        h.max_width = stream.GetUChar();
        h.caret_slope_numerator = stream.GetChar();
        h.caret_slope_denominator = stream.GetChar();
        h.caret_offset = stream.GetChar();
        h.min_origin_SB = stream.GetChar();
        h.min_advance_SB = stream.GetChar();
        h.max_before_BL = stream.GetChar();
        h.min_after_BL = stream.GetChar();
        h.pads1 = stream.GetChar();
        h.pads2 = stream.GetChar();

        v.ascender = stream.GetChar();
        v.descender = stream.GetChar();
        v.max_width = stream.GetUChar();
        v.caret_slope_numerator = stream.GetChar();
        v.caret_slope_denominator = stream.GetChar();
        v.caret_offset = stream.GetChar();
        v.min_origin_SB = stream.GetChar();
        v.min_advance_SB = stream.GetChar();
        v.max_before_BL = stream.GetChar();
        v.min_after_BL = stream.GetChar();
        v.pads1 = stream.GetChar();
        v.pads2 = stream.GetChar();

        strike.start_glyph = stream.GetUShort();
        strike.end_glyph = stream.GetUShort();
        strike.x_ppem = stream.GetUChar();
        strike.y_ppem = stream.GetUChar();
        strike.bit_depth = stream.GetUChar();
        strike.flags = stream.GetChar();

        count--;
        strike_ind++;
    }
    
    stream.ExitFrame();
    strike_ind = 0;
    count  = num_strikes;

    while ( count > 0 )
    {
        var strike = face.sbit_strikes[strike_ind];
        var range;
        var count2 = strike.num_ranges;

        error = stream.Seek(table_base + strike.ranges_offset);
        if (0 != error)
            return error;

        error = stream.EnterFrame(strike.num_ranges * 8);
        if (0 != error)
            return error;

        strike.sbit_ranges = new Array(strike.num_ranges);
        var __count = strike.num_ranges;
        for (var i = 0; i < __count; i++)
            strike.sbit_ranges[i] = new TT_SBit_RangeRec();

        var range_ind = 0;
        while ( count2 > 0 )
        {
            range = strike.sbit_ranges[range_ind];
            range.first_glyph  = stream.GetUShort();
            range.last_glyph   = stream.GetUShort();
            range.table_offset = table_base + strike.ranges_offset + stream.GetULong();
            count2--;
            range_ind++;
        }

        stream.ExitFrame();

        count2 = strike.num_ranges;
        range_ind = 0;
        while (count2 > 0)
        {
            range = strike.sbit_ranges[range_ind];
            error = stream.Seek(range.table_offset);
            if (error != 0)
                return error;
            error = stream.EnterFrame(8);
            if (error != 0)
                return error;

            range.index_format = stream.GetUShort();
            range.image_format = stream.GetUShort();
            range.image_offset = stream.GetULong();

            stream.ExitFrame();

            error = Load_SBit_Range(range, stream);
            if (error != 0)
                return error;

            count2--;
            range_ind++;
        }

        count--;
        strike_ind++;
    }

    return error;
}
function tt_face_free_eblc(face)
{
    face.sbit_strikes = null;
    face.num_sbit_strikes = 0;
}
function tt_face_set_sbit_strike(face, req)
{
    return FT_Match_Size(face, req, 0);
}
function tt_face_load_strike_metrics(face, strike_index, metrics)
{
    if (strike_index >= face.num_sbit_strikes)
      return FT_Common.FT_Err_Invalid_Argument;

    var strike = face.sbit_strikes[strike_index];

    metrics.x_ppem = strike.x_ppem;
    metrics.y_ppem = strike.y_ppem;

    metrics.ascender  = strike.hori.ascender << 6;
    metrics.descender = strike.hori.descender << 6;

    metrics.max_advance = (strike.hori.min_origin_SB + strike.hori.max_width + strike.hori.min_advance_SB) << 6;

    metrics.height = metrics.ascender - metrics.descender;

    return 0;
}
function find_sbit_range(glyph_index, strike)
{
    FT_Error = 0;
    var range = null;
    var glyph_offset = 0;

    if (glyph_index < strike.start_glyph || glyph_index > strike.end_glyph)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
    }

    var range_ind = 0;
    var range_limit = strike.num_ranges;

    for ( ; range_ind < range_limit; range_ind++)
    {
        range = strike.sbit_ranges[range_ind];
        if (glyph_index >= range.first_glyph && glyph_index <= range.last_glyph)
        {
            var delta = (glyph_index - range.first_glyph);

            switch (range.index_format)
            {
            case 1:
            case 3:
                glyph_offset = range.glyph_offsets[delta];
                break;
            case 2:
                glyph_offset = range.image_offset + range.image_size * delta;
                break;
            case 4:
            case 5:
                for (var n = 0; n < range.num_glyphs; n++)
                {
                    if (range.glyph_codes[n] == glyph_index)
                    {
                        if (range.index_format == 4)
                            glyph_offset = range.glyph_offsets[n];
                        else
                            glyph_offset = range.image_offset + n * range.image_size;
                        return {range:range,glyph_offset:glyph_offset};
                    }
                }
                break;
            default:
                break;
            }

            return {range:range,glyph_offset:glyph_offset};
        }
    }

    FT_Error = FT_Common.FT_Err_Invalid_Argument;
    return {range:range,glyph_offset:glyph_offset};
}
function tt_find_sbit_image(face, glyph_index, strike_index)
{
    FT_Error = 0;
    if (null == face.sbit_strikes || (face.num_sbit_strikes <= strike_index))
    {
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
        return {strike:null,range:null,glyph_offset:0};
    }

    var strike = face.sbit_strikes[strike_index];
    var ret = find_sbit_range(glyph_index, strike);
    if (FT_Error != 0)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
        return {strike:null,range:null,glyph_offset:0};
    }

    return {strike:strike,range:ret.range,glyph_offset:ret.glyph_offset};
}
function tt_load_sbit_metrics(stream, range, metrics)
{
    var error = 0;
    switch (range.image_format)
    {
    case 1:
    case 2:
    case 8:
        error = stream.EnterFrame(5);
        if (error != 0)
            return error;

        metrics.height       = stream.GetUChar();
        metrics.width        = stream.GetUChar();
        metrics.horiBearingX = stream.GetChar();
        metrics.horiBearingY = stream.GetChar();
        metrics.horiAdvance  = stream.GetUChar();

        metrics.vertBearingX = 0;
        metrics.vertBearingY = 0;
        metrics.vertAdvance  = 0;

        stream.ExitFrame();
        break;

    case 6:
    case 7:
    case 9:
        error = stream.EnterFrame(8);
        if (error != 0)
            return error;

        metrics.height       = stream.GetUChar();
        metrics.width        = stream.GetUChar();
        metrics.horiBearingX = stream.GetChar();
        metrics.horiBearingY = stream.GetChar();
        metrics.horiAdvance  = stream.GetUChar();

        metrics.vertBearingX = stream.GetChar();
        metrics.vertBearingY = stream.GetChar();
        metrics.vertAdvance  = stream.GetUChar();

        stream.ExitFrame();
        break;
    case 5:
    default:
        if (range.index_format == 2 || range.index_format == 5)
        {
            var s = range.metrics;
            metrics.height       = s.height;
            metrics.width        = s.width;
            metrics.horiBearingX = s.horiBearingX;
            metrics.horiBearingY = s.horiBearingY;
            metrics.horiAdvance  = s.horiAdvance;

            metrics.vertBearingX = s.vertBearingX;
            metrics.vertBearingY = s.vertBearingY;
            metrics.vertAdvance  = s.vertAdvance;
        }
        else
            return FT_Common.FT_Err_Invalid_File_Format;
    }

    return error;
}
function crop_bitmap(map, metrics)
{
    var rows, count;
    var line_len;
    var line = new CPointer();
    line.data = map.buffer.data;
    var d = line.data;

    // 1
    line.pos = map.buffer.pos;
    rows = map.rows;
    line_len = map.pitch;

    var is_go_to = 0;
    for (count = 0; count < rows; count++)
    {
        for (var cur=0; cur < line_len; cur++)
        {
            if (d[line.pos+cur] != 0)
            {
                is_go_to = 1;
                break;
            }
        }
        if (1 == is_go_to)
            break;
        line.pos += line_len;
    }

    if (count >= rows)
    {
        map.width      = 0;
        map.rows       = 0;
        map.pitch      = 0;
        map.pixel_mode = FT_Common.FT_PIXEL_MODE_MONO;
    }

    if ( count > 0 )
    {
        line.pos = map.buffer.pos;
        var pos1 = line.pos;
        var pos2 = line.pos + count * line_len;

        var c = (rows - count)*line_len;

        for (var i=0;i<c;i++)
            d[pos1+i] = d[pos2+i];

        metrics.height       = (metrics.height - count)&0xFF;
        metrics.horiBearingY = (metrics.horiBearingY - count);
        metrics.vertBearingY = (metrics.vertBearingY - count);

        map.rows -= count;
        rows -= count;
    }

    //2
    is_go_to = 0;
    line.pos = (rows - 1) * line_len;

    for (count = 0; count < rows; count++)
    {
        for (var cur=0; cur < line_len; cur++)
        {
            if (d[line.pos+cur] != 0)
            {
                is_go_to = 1;
                break;
            }
        }
        if (is_go_to == 1)
            break;

        line.pos -= line_len;
    }

    if (count > 0)
    {
        metrics.height = (metrics.height - count);
        rows -= count;
        map.rows -= count;
    }

    // 3
    is_go_to = 0;
    do
    {
        line.pos = map.buffer.pos;
        var limit = line.pos + rows * line_len;

        for (; line.pos < limit; line.pos += line_len)
        {
            if ((d[line.pos] & 0x80) != 0)
            {
                is_go_to = 1;
                break;
            }
        }
        if (1 == is_go_to)
            break;

        line.pos = map.buffer.pos;
        limit = line.pos + rows * line_len;

        for (; line.pos < limit; line.pos += line_len)
        {
            var width = map.width;
            var cur = line.pos;
            var old = 0xFF & (d[cur] << 1);
            for (var n = 8; n < width; n += 8)
            {
                var val = d[cur+1];
                d[cur] = 0xFF & (old | (val >>> 7));
                old = 0xFF & (val << 1);
                cur++;
            }
            d[cur] = old;
        }

        map.width--;
        metrics.horiBearingX++;
        metrics.vertBearingX++;
        metrics.width--;

    } while (map.width > 0);

    // 4
    do
    {
        var right = map.width - 1;
        line.pos = (right >>> 3);
        var limit = line.pos + rows * line_len;
        var mask = 0xFF & (0x80 >>> (right & 7));

        for ( ; line.pos < limit; line.pos += line_len)
            if ((d[line.pos] & mask)!=0)
                return;

        map.width--;
        metrics.width--;

    } while ( map.width > 0 );
}
function Load_SBit_Single(map, x_offset, y_offset, pix_bits, image_format, metrics, stream)
{
    var error = 0;
    if (x_offset < 0 || x_offset + metrics.width > map.width || y_offset < 0 || y_offset + metrics.height > map.rows)
        return FT_Common.FT_Err_Invalid_Argument;

    var glyph_width = metrics.width;
    var glyph_height = metrics.height;
    var glyph_size;
    var line_bits = pix_bits * glyph_width;
    var pad_bytes = 0;

    switch ( image_format )
    {
        case 1:  /* byte-padded formats */
        case 6:
            var line_length;
            switch ( pix_bits )
            {
                case 1:
                    line_length = (glyph_width + 7) >>> 3;
                    break;
                case 2:
                    line_length = (glyph_width + 3) >>> 2;
                    break;
                case 4:
                    line_length = (glyph_width + 1) >>> 1;
                    break;
                default:
                    line_length = glyph_width;
            }

            glyph_size = glyph_height * line_length;
            pad_bytes  = 1;
            break;
      case 2:
      case 5:
      case 7:
            line_bits  = glyph_width * pix_bits;
            glyph_size = (glyph_height * line_bits + 7) >>> 3;
            break;
      default:
            return FT_Common.FT_Err_Invalid_File_Format;
    }

    error = stream.EnterFrame(glyph_size);
    if (0 != error)
        return error;

    var s = new CPointer();
    s.data = stream.data;
    s.pos = stream.cur;
    blit_sbit(map, s, line_bits, pad_bytes, x_offset * pix_bits, y_offset, metrics.height);

    stream.ExitFrame();
    return error;
}
function Load_SBit_Image(strike, range, ebdt_pos, glyph_offset, slot, x_offset, y_offset, stream, metrics, depth)
{
    var map = slot.bitmap;
    var error = stream.Seek(ebdt_pos + glyph_offset);
    if (0 != error)
        return error;

    error = tt_load_sbit_metrics(stream, range, metrics);
    if (error != 0)
        return 0;

    if (depth == 0)
    {
        map.width = metrics.width;
        map.rows  = metrics.height;

        switch (strike.bit_depth)
        {
        case 1:
            map.pixel_mode = FT_Common.FT_PIXEL_MODE_MONO;
            map.pitch = (map.width + 7) >>> 3;
            break;
        case 2:
            map.pixel_mode = FT_Common.FT_PIXEL_MODE_GRAY2;
            map.pitch = (map.width + 3) >>> 2;
            break;
        case 4:
            map.pixel_mode = FT_Common.FT_PIXEL_MODE_GRAY4;
            map.pitch = (map.width + 1) >>> 1;
            break;
        case 8:
            map.pixel_mode = FT_Common.FT_PIXEL_MODE_GRAY;
            map.pitch = map.width;
            break;
        default:
            return FT_Common.FT_Err_Invalid_File_Format;
        }

        var size = map.rows * map.pitch;
        if (size == 0)
            return error;

        error = ft_glyphslot_alloc_bitmap(slot, size);
        if (error != 0)
            return error;
    }

    switch (range.image_format)
    {
        case 1:
        case 2:
        case 5:
        case 6:
        case 7:
            return Load_SBit_Single(map, x_offset, y_offset, strike.bit_depth, range.image_format, metrics, stream);

        case 8:
            error = stream.Skip(1);
            if (error != 0)
                return FT_Common.FT_Err_Invalid_Stream_Skip;
        case 9:
            break;

        default:
            return FT_Common.FT_Err_Invalid_File_Format;
    }

    var num_components = stream.ReadUShort();
    FT_Error = error;
    if (error != 0)
        return error;

    error = stream.EnterFrame(4*num_components);
    if (error != 0)
        return error;

    var components = new Array(num_components);
    var count = num_components;
    var comp = 0;

    for (; count > 0; count--, comp++)
    {
        var _comp = components[comp];
        _comp.glyph_code = stream.GetUShort();
        _comp.x_offset   = stream.GetChar();
        _comp.y_offset   = stream.GetChar();
    }

    stream.ExitFrame();
    count = num_components;
    comp = 0;
    for ( ; count > 0; count--, comp++ )
    {
        var elem_metrics = new TT_SBit_MetricsRec();

        var _comp = components[comp];
        var elem = find_sbit_range(_comp.glyph_code, strike);
        error = FT_Error;
        if (error != 0)
        {
            components = null;
            return error;
        }

        error = Load_SBit_Image(strike, elem.range, ebdt_pos, elem.glyph_offset, slot, x_offset + _comp.x_offset,
                                 y_offset + _comp.y_offset, stream, elem_metrics, depth + 1);
        if (error != 0)
        {
            components = null;
            return error;
        }
    }

    return error;
}
function tt_face_load_sbit_image(face, strike_index, glyph_index, load_flags, stream, map, metrics)
{
    var elem = tt_find_sbit_image(face, glyph_index, strike_index);
    var error = FT_Error;
    if (error != 0)
        return error;

    face.goto_table(face, FT_Common.TTAG_EBDT, stream);
    error = FT_Error;
    if (error != 0)
    {
        face.goto_table(face, FT_Common.TTAG_bdat, stream);
        error = FT_Error;
    }
    if (error != 0)
        return error;

    var ebdt_pos = stream.pos;
    var strike = elem.strike;

    error = Load_SBit_Image(strike, elem.range, ebdt_pos, elem.glyph_offset,
                             face.glyph, 0, 0, stream, metrics, 0);
    if (error != 0)
        return error;

    if (strike.flags & 1)
    {
        var advance = strike.hori.ascender - strike.hori.descender;

        metrics.vertBearingX = parseInt((-metrics.width / 2));
        metrics.vertBearingY = parseInt((advance - metrics.height)/2);
        metrics.vertAdvance  = parseInt(advance*12/10);
    }

    if (load_flags & FT_Common.FT_LOAD_CROP_BITMAP)
        crop_bitmap(map, metrics);
    return error;
}
/******************************************************************************/
// ttcmap
/******************************************************************************/
function TT_CMapRec()
{
    this.cmap = new FT_CMapRec();
    this.data = null;
    this.flags = 0;

    this.type = FT_Common.FT_CMAP_1;
}
function TT_CMap_ClassRec()
{
    this.clazz = new FT_CMap_ClassRec();
    this.format = 0;
    this.validate = null;
    this.get_cmap_info = null;
}
function TT_Validator()
{
    this.validator = new FT_ValidatorRec();
    this.num_glyphs = 0;
}
function tt_cmap_init(cmap, table)
{
    cmap.data = dublicate_pointer(table);
    return 0;
}
// cmap0 ----------------------------------------------------------------------------------
function tt_cmap0_char_index(cmap, char_code)
{
    var table = cmap.data;
    return char_code < 256 ? table.data[table.pos + 6 + char_code] : 0;
}
function tt_cmap0_char_next(cmap, char_code)
{
    var table = cmap.data;
    var pos_base = table.pos + 6;
    var charcode = char_code;
    var result = 0;
    var gindex = 0;

    var d = table.data;
    while (++charcode < 256)
    {
        gindex = d[pos_base + charcode];
        if (gindex != 0)
        {
            result = charcode;
            break;
        }
    }

    return {gindex:gindex,char_code:result};
}
function tt_cmap0_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap_init,null,tt_cmap0_char_index,tt_cmap0_char_next,null,null,null,null,null);
    this.format = 0;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        p.pos += 2;
        var length = FT_NEXT_USHORT(p);

        if (length > valid.limit || length < 262)
            return FT_Common.FT_Err_Invalid_Table;

        if (valid.level >= 1)
        {
            var idx;
            var d = p.data;
            var c = table.pos + 6;
            for (var n = 0; n < 256; n++)
            {
                idx = d[c++];
                if (idx >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;
            }
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.data;
        data.pos += 4;
        cmap_info.format   = 0;
        cmap_info.language = FT_PEEK_USHORT(data);
        data.pos -= 4;
        return 0;
    }
}
// cmap2 ----------------------------------------------------------------------------------
function tt_cmap2_get_subheader(table, char_code)
{
    if (char_code < 0x10000)
    {
        var char_lo = (char_code & 0xFF);
        var char_hi = (char_code >>> 8);
        var p = dublicate_pointer(table);
        p.pos += 6;

        var subs = table.pos + 518;
        var sub = subs;

        if (char_hi == 0)
        {
            sub = subs;
            p.pos += char_lo * 2;
            if (FT_PEEK_USHORT(p) != 0)
                return null;
        }
        else
        {
            p.pos += char_hi * 2;
            sub = subs + (FT_PEEK_USHORT(p) & ~7);
            if (sub == subs)
                return null;
        }
        var result = new CPointer();
        result.data = table.data;
        result.pos = sub;
        return result;
    }
    return null;
}
function tt_cmap2_char_index(cmap, char_code)
{
    var table = dublicate_pointer(cmap.data);
    var result = 0;
    var subheader = tt_cmap2_get_subheader(table, char_code);
    if (subheader != null)
    {
        var p = subheader;
        var idx = (char_code & 0xFF);

        var start  = FT_NEXT_USHORT(p);
        var count  = FT_NEXT_USHORT(p);
        var delta  = FT_NEXT_SHORT (p);
        var offset = FT_PEEK_USHORT(p);

        idx -= start;
        if ( idx < count && offset != 0 )
        {
            p.pos += offset + 2 * idx;
            idx = FT_PEEK_USHORT(p);
            if (idx != 0)
                result = (idx + delta) & 0xFFFF;
        }
    }
    return result;
}
function tt_cmap2_char_next(cmap, charcode_)
{
    var table = dublicate_pointer(cmap.data);
    var gindex = 0;
    var result = 0;
    var charcode = charcode_ + 1;
    var subheader = null;

    while (charcode < 0x10000)
    {
        subheader = tt_cmap2_get_subheader(table, charcode);
        if (subheader != null)
        {
            var p = subheader;
            var start   = FT_NEXT_USHORT(p);
            var count   = FT_NEXT_USHORT(p);
            var delta   = FT_NEXT_SHORT(p);
            var offset  = FT_PEEK_USHORT(p);
            var char_lo = (charcode & 0xFF);
            var pos, idx;

            if (offset == 0)
            {
                charcode = charcode & ~255 + 256;
                continue;
            }

            if (char_lo < start)
            {
                char_lo = start;
                pos = 0;
            }
            else
                pos = (char_lo - start);

            p.pos += offset + pos * 2;
            charcode = charcode & ~255 + char_lo;

            for ( ; pos < count; pos++, charcode++ )
            {
                idx = FT_NEXT_USHORT(p);

                if ( idx != 0 )
                {
                    gindex = (idx + delta) & 0xFFFF;
                    if ( gindex != 0 )
                    {
                        result = charcode;
                        return {gindex:gindex,char_code:result};
                    }
                }
            }
        }
        charcode = charcode & ~255 + 256;
    }
    return {gindex:gindex,char_code:result};
}
function tt_cmap2_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap_init,null,tt_cmap2_char_index,tt_cmap2_char_next,null,null,null,null,null);
    this.format = 2;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        p.pos += 2;
        var length = FT_PEEK_USHORT(p);
        var n = 0;

        if (length > valid.limit || length < 6 + 512)
            return FT_Common.FT_Err_Invalid_Table;

        p.pos = table.pos + 6;
        var max_subs = 0;
        for ( n = 0; n < 256; n++ )
        {
            var idx = FT_NEXT_USHORT(p);
            if (valid.level >= 2 && (idx & 7) != 0)
                return FT_Common.FT_Err_Invalid_Table;

            idx >>>= 3;

            if (idx > max_subs)
                max_subs = idx;
        }

        var glyph_ids = p.pos + (max_subs + 1) * 8;
        if (glyph_ids > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        for (n = 0; n <= max_subs; n++)
        {
            var first_code = FT_NEXT_USHORT(p);
            var code_count = FT_NEXT_USHORT(p);
            var delta = FT_NEXT_SHORT(p);
            var offset = FT_NEXT_USHORT(p);

            if (code_count == 0)
                continue;

            if (valid.level >= 2)
            {
                if (first_code >= 256 || first_code + code_count > 256)
                    return FT_Common.FT_Err_Invalid_Table;
            }

            if (offset != 0)
            {
                var ids = p.pos - 2 + offset;
                if (ids < glyph_ids || ids + code_count*2 > (table.pos+length))
                    return FT_Common.FT_Err_Invalid_Offset;

                if (valid.level >= 1)
                {
                    var limit = p.pos + code_count * 2;
                    var idx;
                    for (; p.pos < limit;)
                    {
                        idx = FT_NEXT_USHORT(p);
                        if ( idx != 0 )
                        {
                            idx = (idx + delta) & 0xFFFF;
                            if (idx >= valid.num_glyphs)
                                return FT_Common.FT_Err_Invalid_Glyph_Index;
                        }
                    }
                }
            }
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        cmap.data.pos += 4;
        cmap_info.format   = 2;
        cmap_info.language = FT_PEEK_USHORT(cmap.data);
        cmap.data.pos -= 4;
        return 0;
    }
}
// cmap4 ----------------------------------------------------------------------------------
function TT_CMap4Rec()
{
    this.cmap = new TT_CMapRec();
    this.cur_charcode;
    this.cur_gindex;

    this.num_ranges;
    this.cur_range;
    this.cur_start;
    this.cur_end;
    this.cur_delta;
    this.cur_values;

    this.type = FT_Common.FT_CMAP_4;
}
function tt_cmap4_init(cmap,table)
{
    var p = dublicate_pointer(table);
    p.pos += 6;
    cmap.cmap.data = dublicate_pointer(table);
    cmap.num_ranges = FT_PEEK_USHORT(p) >>> 1;
    cmap.cur_charcode = 0xFFFFFFFF;
    cmap.cur_gindex = 0;
    return 0;
}
function tt_cmap4_set_range(cmap, range_index)
{
    var table = cmap.cmap.data.pos;
    var p = dublicate_pointer(cmap.cmap.data);
    var num_ranges = cmap.num_ranges;

    while (range_index < num_ranges)
    {
        p.pos = table + 14 + range_index * 2;
        cmap.cur_end = FT_PEEK_USHORT(p);

        p.pos += 2 + num_ranges * 2;
        cmap.cur_start = FT_PEEK_USHORT(p);

        p.pos += num_ranges * 2;
        cmap.cur_delta = FT_PEEK_SHORT(p);

        p.pos += num_ranges * 2;
        var offset = FT_PEEK_USHORT(p);

        if (range_index >= num_ranges - 1 && cmap.cur_start == 0xFFFF && cmap.cur_end == 0xFFFF)
        {
            var face = cmap.cmap.cmap.charmap.face;
            var limit = face.cmap_table.pos + face.cmap_size;
            if (offset && p.pos + offset + 2 > limit)
            {
                cmap.cur_delta = 1;
                offset = 0;
            }
        }
        if (offset != 0xFFFF)
        {
            cmap.cur_values = null;
            if (offset != 0)
            {
                cmap.cur_values = dublicate_pointer(p);
                cmap.cur_values.pos += offset;
            }
            cmap.cur_range = range_index;
            return 0;
        }
        range_index++;
    }
    return -1;
}
function tt_cmap4_next(cmap)
{
    if (cmap.cur_charcode >= 0xFFFF)
    {
        cmap.cur_charcode = 0xFFFFFFFF;
        cmap.cur_gindex = 0;
        return;
    }

    var charcode = cmap.cur_charcode + 1;

    if (charcode < cmap.cur_start)
        charcode = cmap.cur_start;

    while(true)
    {
        var p = new CPointer();
        var values = cmap.cur_values;
        var end = cmap.cur_end;
        var delta = cmap.cur_delta;

        if ( charcode <= end )
        {
            if (values != null)
            {
                p.data = values.data;
                p.pos = values.pos;
                p.pos += 2*(charcode - cmap.cur_start);
                do
                {
                    var gindex = FT_NEXT_USHORT(p);
                    if (gindex != 0)
                    {
                        gindex = ((gindex + delta) & 0xFFFF);
                        if (gindex != 0)
                        {
                            cmap.cur_charcode = charcode;
                            cmap.cur_gindex   = gindex;
                            return;
                        }
                    }
                } while ( ++charcode <= end );
            }
            else
            {
                do
                {
                    var gindex = ((charcode + delta)&0xFFFF);
                    if (gindex != 0)
                    {
                        cmap.cur_charcode = charcode;
                        cmap.cur_gindex = gindex;
                        return;
                    }
                } while ( ++charcode <= end );
            }
        }

        if (tt_cmap4_set_range(cmap, cmap.cur_range + 1) < 0)
            break;

        if (charcode < cmap.cur_start)
            charcode = cmap.cur_start;
    }
    cmap.cur_charcode = 0xFFFFFFFF;
    cmap.cur_gindex = 0;
}
function tt_cmap4_char_map_linear(cmap, _charcode, next)
{
    var num_segs2, start, end, offset;
    var delta;
    var i, num_segs;
    var charcode = _charcode;
    var gindex = 0;
    var base = cmap.cmap.data.pos;
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 6;

    num_segs2 = FT_PEEK_USHORT(p) & ~1;
    num_segs = num_segs2 >>> 1;

    if (num_segs == 0)
        return {gindex:0,char_code:_charcode};

    if (next != 0)
        charcode++;

    for (; charcode <= 0xFFFF; charcode++)
    {
        p.pos = base + 14;
        var q = dublicate_pointer(p);
        q.pos = base + 16 + num_segs2;

        for ( i = 0; i < num_segs; i++ )
        {
            end   = FT_NEXT_USHORT(p);
            start = FT_NEXT_USHORT(q);

            if ( charcode >= start && charcode <= end )
            {
                p.pos = q.pos - 2 + num_segs2;
                delta = FT_PEEK_SHORT(p);
                p.pos += num_segs2;
                offset = FT_PEEK_USHORT(p);

                if (i >= num_segs - 1 && start == 0xFFFF && end == 0xFFFF)
                {
                    var face = cmap.cmap.charmap.face;
                    var limit = face.cmap_table.pos + face.cmap_size;
                    if (offset != 0 && p.pos + offset + 2 > limit)
                    {
                        delta  = 1;
                        offset = 0;
                    }
                }

                if (offset == 0xFFFF)
                    continue;

                if (offset != 0)
                {
                    p.pos += offset + (charcode - start) * 2;
                    gindex = FT_PEEK_USHORT(p);
                    if (gindex != 0)
                        gindex = (gindex + delta) & 0xFFFF;
                }
                else
                    gindex = (charcode + delta) & 0xFFFF;

                break;
            }
        }

        if (next == 0 || gindex != 0)
            break;
    }

    if (next != 0 && gindex != 0)
        return {gindex:gindex,char_code:charcode};

    return {gindex:gindex,char_code:_char_code};
}
function tt_cmap4_char_map_binary(cmap, _charcode, next)
{
    var num_segs2, start, end, offset;
    var delta;
    var max, min, mid, num_segs;
    var __charcode = _charcode;
    var charcode = _charcode;
    var gindex = 0;
    var p = dublicate_pointer(cmap.cmap.data);
    var base = p.pos;

    p.pos += 6;
    num_segs2 = FT_PEEK_USHORT(p) & ~1;

    if (num_segs2 == 0)
        return {gindex:gindex,char_code:__charcode};

    num_segs = num_segs2 >>> 1;

    mid = num_segs;
    end = 0xFFFF;

    if (next != 0)
        charcode++;

    min = 0;
    max = num_segs;

    while (min < max)
    {
        mid = (min + max) >>> 1;
        p.pos = base + 14 + mid * 2;
        end = FT_PEEK_USHORT(p);
        p.pos += 2 + num_segs2;
        start = FT_PEEK_USHORT(p);

        if (charcode < start)
            max = mid;
        else if (charcode > end)
            min = mid + 1;
        else
        {
            p.pos += num_segs2;
            delta = FT_PEEK_SHORT(p);
            p.pos += num_segs2;
            offset = FT_PEEK_USHORT(p);

            if (mid >= num_segs - 1 && start == 0xFFFF && end == 0xFFFF)
            {
                var face = cmap.cmap.charmap.face;
                var limit = face.cmap_table.pos + face.cmap_size;
                if (offset && p.pos + offset + 2 > limit)
                {
                    delta  = 1;
                    offset = 0;
                }
            }

            if ((cmap.flags & 2) != 0)
            {
                var i;
                max = mid;
                if (offset == 0xFFFF)
                    mid = max + 1;

                for (i = max ; i > 0; i--)
                {
                    var old_p = p.pos;
                    p.pos = base + 14 + (i - 1) * 2;
                    var prev_end = FT_PEEK_USHORT(p);

                    if ( charcode > prev_end )
                    {
                        p.pos = old_p.pos;
                        break;
                    }

                    end = prev_end;
                    p.pos += 2 + num_segs2;
                    start = FT_PEEK_USHORT(p);
                    p.pos += num_segs2;
                    delta = FT_PEEK_SHORT(p);
                    p.pos += num_segs2;
                    offset = FT_PEEK_USHORT(p);

                    if (offset != 0xFFFF)
                        mid = i - 1;
                }

                if (mid == max + 1)
                {
                    if (i != max)
                    {
                        p.pos = base + 14 + max * 2;
                        end = FT_PEEK_USHORT(p);
                        p.pos += 2 + num_segs2;
                        start = FT_PEEK_USHORT(p);
                        p.pos += num_segs2;
                        delta = FT_PEEK_SHORT(p);
                        p.pos += num_segs2;
                        offset = FT_PEEK_USHORT(p);
                    }
                    mid = max;
                    for (i = max + 1; i < num_segs; i++)
                    {
                        p.pos = base + 14 + i * 2;
                        var next_end = FT_PEEK_USHORT(p);
                        p.pos += 2 + num_segs2;
                        var next_start = FT_PEEK_USHORT(p);

                        if (charcode < next_start)
                            break;

                        end = next_end;
                        start = next_start;
                        p.pos += num_segs2;
                        delta = FT_PEEK_SHORT(p);
                        p.pos += num_segs2;
                        offset = FT_PEEK_USHORT(p);

                        if (offset != 0xFFFF)
                            mid = i;
                    }
                    i--;

                    if (mid == max)
                    {
                        mid = i;
                        break;
                    }
                }

                if (mid != i)
                {
                    p.pos = base + 14 + mid * 2;
                    end = FT_PEEK_USHORT(p);
                    p.pos += 2 + num_segs2;
                    start = FT_PEEK_USHORT(p);
                    p.pos += num_segs2;
                    delta = FT_PEEK_SHORT(p);
                    p.pos += num_segs2;
                    offset = FT_PEEK_USHORT(p);
                }
            }
            else
            {
                if (offset == 0xFFFF)
                    break;
            }

            if (offset != 0)
            {
                p.pos += offset + (charcode - start) * 2;
                gindex = FT_PEEK_USHORT(p);
                if (gindex != 0)
                    gindex = (gindex + delta) & 0xFFFF;
            }
            else
                gindex = (charcode + delta) & 0xFFFF;

            break;
        }
    }

    if (next != 0)
    {
        if ( charcode > end )
        {
            mid++;
            if ( mid == num_segs )
                return {gindex:0,char_code:__charcode};
        }

        if (tt_cmap4_set_range(cmap, mid) != 0)
        {
            if (gindex != 0)
                __charcode = charcode;
        }
        else
        {
            cmap.cur_charcode = charcode;
            if (gindex != 0)
                cmap.cur_gindex = gindex;
            else
            {
                cmap.cur_charcode = charcode;
                tt_cmap4_next(cmap);
                gindex = cmap.cur_gindex;
            }

            if (gindex != 0)
                __charcode = cmap.cur_charcode;
        }
    }

    return {gindex:gindex,char_code:__charcode};
}
function tt_cmap4_char_index(cmap,char_code)
{
    if (char_code >= 0x10000)
        return 0;

    if ((cmap.cmap.flags & 1) != 0)
        return tt_cmap4_char_map_linear(cmap, char_code, 0).gindex;
    else
        return tt_cmap4_char_map_binary(cmap, char_code, 0).gindex;
}
function tt_cmap4_char_next(cmap,char_code)
{
    var gindex = 0;
    var _char_code = char_code;
    if (_char_code >= 0xFFFF)
        return {gindex:gindex,char_code:_char_code};

    if ((cmap.flags & 1) != 0)
    {
        var r = tt_cmap4_char_map_linear(cmap, char_code, 1);
        gindex = r.gindex;
        _char_code = r.char_code;
    }
    else
    {
        if (_char_code == cmap.cur_charcode)
        {
            tt_cmap4_next(cmap);
            gindex = cmap.cur_gindex;
            if (gindex)
                _char_code = cmap.cur_charcode;
        }
        else
        {
            var r = tt_cmap4_char_map_binary(cmap, char_code, 1);
            gindex = r.gindex;
            _char_code = r.char_code;
        }
    }
    return {gindex:gindex,char_code:_char_code};
}
function tt_cmap4_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap4_init,null,tt_cmap4_char_index,tt_cmap4_char_next,null,null,null,null,null);
    this.format = 4;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        p.pos += 2;
        var length = FT_NEXT_USHORT(p);
        var error = 0;

        if (length < 16)
            return FT_Common.FT_Err_Invalid_Table;

        if (table.pos + length > valid.limit)
        {
            if (valid.level >= 1)
                return FT_Common.FT_Err_Invalid_Table;

            length = (valid.limit - table.pos);
        }

        p.pos = table.pos + 6;
        var num_segs = FT_NEXT_USHORT(p);

        if (valid.level >= 2)
        {
            if ((num_segs & 1) != 0)
                return FT_Common.FT_Err_Invalid_Table;
        }

        num_segs >>>= 1;

        if (length < 16 + num_segs * 2 * 4)
            return FT_Common.FT_Err_Invalid_Table;

        if (valid.level >= 2)
        {
            var search_range   = FT_NEXT_USHORT(p);
            var entry_selector = FT_NEXT_USHORT(p);
            var range_shift    = FT_NEXT_USHORT(p);

            if (((search_range | range_shift) & 1) != 0)
                return FT_Common.FT_Err_Invalid_Table;

            search_range >>>= 1;
            range_shift >>>= 1;

            if (search_range > num_segs || search_range * 2 < num_segs || search_range + range_shift != num_segs                 ||
                                search_range != (1 << entry_selector))
                return FT_Common.FT_Err_Invalid_Table;
        }

        var ends      = table.pos + 14;
        var starts    = table.pos + 16 + num_segs * 2;
        var deltas    = starts  + num_segs * 2;
        var offsets   = deltas  + num_segs * 2;
        var glyph_ids = offsets + num_segs * 2;

        if (valid.level >= 2)
        {
            p.pos = ends + (num_segs - 1) * 2;
            if (FT_PEEK_USHORT(p) != 0xFFFF)
                return FT_Common.FT_Err_Invalid_Table;
        }

        var start, end, offset, n;
        var last_start = 0, last_end = 0;
        var delta;
        var p_start = new CPointer(); p_start.data = p.data; p_start.pos = starts;
        var p_end = new CPointer(); p_end.data = p.data; p_end.pos = ends;
        var p_delta = new CPointer(); p_delta.data = p.data; p_delta.pos = deltas;
        var p_offset = new CPointer(); p_offset.data = p.data; p_offset.pos = offsets;

        for ( n = 0; n < num_segs; n++ )
        {
            p.pos = p_offset.pos;
            start  = FT_NEXT_USHORT(p_start);
            end    = FT_NEXT_USHORT(p_end);
            delta  = FT_NEXT_SHORT(p_delta);
            offset = FT_NEXT_USHORT(p_offset);

            if (start > end)
                return FT_Common.FT_Err_Invalid_Table;;

            if (start <= last_end && n > 0)
            {
                if (valid.level >= 1)
                    return FT_Common.FT_Err_Invalid_Table;
                else
                {
                    if (last_start > start || last_end > end)
                        error |= 1;
                    else
                        error |= 2;
                }
            }

            if (offset && offset != 0xFFFF)
            {
                p.pos += offset;
                if (valid.level >= 1)
                {
                    if (p.pos < glyph_ids || p.pos + (end - start + 1) * 2 > table.pos + length)
                        return FT_Common.FT_Err_Invalid_Table;
                }
                else if (n != num_segs - 1 || !(start == 0xFFFF && end == 0xFFFF))
                {
                    if (p.pos < glyph_ids || p.pos + (end - start + 1) * 2 > valid.limit)
                        return FT_Common.FT_Err_Invalid_Table;
                }

                if (valid.level >= 1)
                {
                    var idx;
                    for (var i = start; i < end; i++ )
                    {
                        idx = FT_NEXT_USHORT(p);
                        if (idx != 0)
                        {
                            idx = (idx + delta) & 0xFFFF;
                            if (idx >= valid.num_glyphs)
                                return FT_Common.FT_Err_Invalid_Glyph_Index;
                        }
                    }
                }
            }
            else if (offset == 0xFFFF)
            {
              if (valid.level >= 2 || n != num_segs - 1 || !( start == 0xFFFF && end == 0xFFFF))
                return FT_Common.FT_Err_Invalid_Table;
            }

            last_start = start;
            last_end   = end;
        }

        return error;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.cmap.data;
        data.pos += 4;
        cmap_info.format = 4;
        cmap_info.language = FT_PEEK_USHORT(data);
        data.pos -= 4;
        return 0;
    }
}
// cmap6 ----------------------------------------------------------------------------------
function tt_cmap6_char_index(cmap, char_code)
{
    var p = dublicate_pointer(cmap.data);
    p.pos += 6;
    var result = 0;
    var start = FT_NEXT_USHORT(p);
    var count = FT_NEXT_USHORT(p);
    var idx =  char_code - start;

    if ( idx < count )
    {
        p.pos += 2 * idx;
        result = FT_PEEK_USHORT(p);
    }
    return result;
}
function tt_cmap6_char_next(cmap, _char_code)
{
    var p = dublicate_pointer(cmap.data);
    p.pos += 6;
    var result    = 0;
    var char_code = _char_code + 1;
    var gindex = 0;

    var start = FT_NEXT_USHORT(p);
    var count = FT_NEXT_USHORT(p);

    if (char_code >= 0x10000)
        return {gindex:gindex,char_code:_char_code};

    if (char_code < start)
        char_code = start;

    var idx = char_code - start;
    p.pos += 2 * idx;
    for (; idx < count; idx++)
    {
        gindex = FT_NEXT_USHORT(p);
        if (gindex != 0)
        {
            result = char_code;
            break;
        }
        char_code++;
    }
    return {gindex:gindex,char_code:result};
}
function tt_cmap6_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap_init,null,tt_cmap6_char_index,tt_cmap6_char_next,null,null,null,null,null);
    this.format = 6;
    this.validate = function(table, valid)
    {
        var base = table.pos;
        var p = new CPointer();
        p.data = table.data;

        if (base + 10 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        p.pos = base + 2;
        var length = FT_NEXT_USHORT(p);
        p.pos = base + 8;
        var count = FT_NEXT_USHORT(p);

        if (base + length > valid.limit || length < 10 + count * 2)
            return FT_Common.FT_Err_Invalid_Table;

        if (valid.level >= 1)
        {
            var gindex;
            for (; count > 0; count--)
            {
                gindex = FT_NEXT_USHORT(p);
                if (gindex >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;
            }
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.data;
        data.pos += 4;
        cmap_info.format = 6;
        cmap_info.language = FT_PEEK_USHORT(data);
        data.pos -= 4;
        return 0;
    }
}
// cmap8 ----------------------------------------------------------------------------------
function tt_cmap8_char_index(cmap, char_code)
{
    var result = 0;
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 8204;
    var num_groups = FT_NEXT_ULONG(p);
    var start, end, start_id;
    for (; num_groups > 0; num_groups--)
    {
        start    = FT_NEXT_ULONG(p);
        end      = FT_NEXT_ULONG(p);
        start_id = FT_NEXT_ULONG(p);

        if (char_code < start)
            break;

        if (char_code <= end)
        {
            result = (start_id + char_code - start);
            break;
        }
    }
    return result;
}
function tt_cmap8_char_next(cmap, _char_code)
{
    var result = 0;
    var char_code = _char_code + 1;
    var gindex = 0;
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 8204;
    var num_groups = FT_NEXT_ULONG(p);
    var start, end, start_id;

    for ( ; num_groups > 0; num_groups-- )
    {
        start    = FT_NEXT_ULONG(p);
        end      = FT_NEXT_ULONG(p);
        start_id = FT_NEXT_ULONG(p);

        if (char_code < start)
            char_code = start;

        if (char_code <= end)
        {
            gindex = (char_code - start + start_id);
            if ( gindex != 0 )
            {
                result = char_code;
                break;
            }
        }
    }
    return {gindex:gindex,char_code:result};
}
function tt_cmap8_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap_init,null,tt_cmap8_char_index,tt_cmap8_char_next,null,null,null,null,null);
    this.format = 8;
    this.validate = function(table, valid)
    {
        var base = table.pos;
        var p = dublicate_pointer(table);
        p.pos += 4;

        if (base + 16 + 8192 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        var length = FT_NEXT_ULONG(p);
        if (length > (valid.limit - base) || length < 8192 + 16)
            return FT_Common.FT_Err_Invalid_Table;

        var is32 = base + 12;
        p.pos = is32 + 8192;
        var num_groups = FT_NEXT_ULONG(p);

        if (p.pos + num_groups * 12 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        var n, start, end, start_id, count, last = 0;
        for ( n = 0; n < num_groups; n++ )
        {
            var hi, lo;
            start    = FT_NEXT_ULONG(p);
            end      = FT_NEXT_ULONG(p );
            start_id = FT_NEXT_ULONG(p);

            if (start > end)
                return FT_Common.FT_Err_Invalid_Table;

            if (n > 0 && start <= last)
                return FT_Common.FT_Err_Invalid_Table;

            if (valid.level >= 1)
            {
                if (start_id + end - start >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;

                count = (end - start + 1);
                if ((start & ~0xFFFF) != 0)
                {
                    for (; count > 0; count--, start++)
                    {
                        hi = (start >>> 16);
                        lo = (start & 0xFFFF);

                        if ((p.data[is32 + hi >>> 3] & (0x80 >>> (hi & 7))) == 0)
                            return FT_Common.FT_Err_Invalid_Table;

                        if ((p.data[is32 + lo >>> 3] & (0x80 >>> (lo & 7))) == 0)
                            return FT_Common.FT_Err_Invalid_Table;
                    }
                }
                else
                {
                    if ((end & ~0xFFFF) != 0)
                        return FT_Common.FT_Err_Invalid_Table;

                    for ( ; count > 0; count--, start++ )
                    {
                        lo = (start & 0xFFFF);
                        if ((p.data[is32 + lo >>> 3] & (0x80 >>> (lo & 7))) != 0)
                            return FT_Common.FT_Err_Invalid_Table;
                    }
                }
            }
            last = end;
        }

        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.cmap.data;
        data.pos += 8;
        cmap_info.format = 8;
        cmap_info.language = FT_PEEK_ULONG(data);
        data.pos -= 8;
        return 0;
    }
}
// cmap10 ---------------------------------------------------------------------------------
function tt_cmap10_char_index(cmap, char_code)
{
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 12;
    var result = 0;
    var start = FT_NEXT_ULONG(p);
    var count = FT_NEXT_ULONG(p);
    var idx = (char_code - start);

    if (idx < count)
    {
        p.pos += 2 * idx;
        result = FT_PEEK_USHORT(p);
    }
    return result;
}
function tt_cmap10_char_next(cmap, _char_code)
{
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 12;
    var char_code = _char_code + 1;
    var gindex = 0;
    var start = FT_NEXT_ULONG(p);
    var count = FT_NEXT_ULONG(p);

    if (char_code < start)
        char_code = start;

    var idx = char_code - start;
    p.pos += 2 * idx;

    for (; idx < count; idx++)
    {
        gindex = FT_NEXT_USHORT(p);
        if (gindex != 0)
            break;
        char_code++;
    }
    return {gindex:gindex,char_code:char_code};
}
function tt_cmap10_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap_init,null,tt_cmap10_char_index,tt_cmap10_char_next,null,null,null,null,null);
    this.format = 10;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        var base = table.pos;
        p.pos += 4;

        if (base + 20 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        var length = FT_NEXT_ULONG(p);
        p.pos = base + 16;
        count = FT_NEXT_ULONG(p);

        if (length > (valid.limit - base) || length < 20 + count * 2)
            return FT_Common.FT_Err_Invalid_Table;

        if (valid.level >= 1)
        {
            var gindex;
            for (; count > 0; count--)
            {
                gindex = FT_NEXT_USHORT(p);
                if (gindex >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;
            }
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.cmap.data;
        data.pos += 8;
        cmap_info.format = 10;
        cmap_info.language = FT_PEEK_ULONG(data);
        data.pos -= 8;
        return 0;
    }
}
// cmap12 ---------------------------------------------------------------------------------
function TT_CMap12Rec()
{
    this.cmap = new TT_CMapRec();
    this.valid;
    this.cur_charcode;
    this.cur_gindex;
    this.cur_group;
    this.num_groups;

    this.type = FT_Common.FT_CMAP_12;
}
function tt_cmap12_init(cmap, table)
{
    cmap.cmap.data = dublicate_pointer(table);
    table.pos += 12;
    cmap.num_groups = FT_PEEK_ULONG(table);
    table.pos -= 12;
    cmap.valid = 0;
    return 0;
}
function tt_cmap12_next(cmap)
{
    if (cmap.cur_charcode >= 0xFFFFFFFF)
    {
        cmap.valid = 0;
        return;
    }

    var p = dublicate_pointer(cmap.cmap.data);
    var base = p.pos;
    var start, end, start_id;
    var gindex;

    var char_code = cmap.cur_charcode + 1;
    for (var n = cmap.cur_group; n < cmap.num_groups; n++)
    {
        p.pos = base + 16 + 12 * n;
        start    = FT_NEXT_ULONG(p);
        end      = FT_NEXT_ULONG(p);
        start_id = FT_PEEK_ULONG(p);

        if (char_code < start)
            char_code = start;

        for ( ; char_code <= end; char_code++ )
        {
            gindex = (start_id + char_code - start);
            if (gindex != 0)
            {
                cmap.cur_charcode = char_code;
                cmap.cur_gindex   = gindex;
                cmap.cur_group    = n;
                return;
            }
        }
    }
    cmap.valid = 0;
}
function tt_cmap12_char_map_binary(cmap, _char_code, next)
{
    var gindex = 0;
    var p = dublicate_pointer(cmap.cmap.data);
    var base = p.pos;
    p.pos += 12;
    var num_groups = FT_PEEK_ULONG(p);
    var char_code = _char_code;
    var __char_code = _char_code;
    var start, end, start_id;
    var max, min, mid;

    if (num_groups == 0)
        return {gindex:gindex,char_code:__char_code};

    mid = num_groups;
    end = 0xFFFFFFFF;

    if (next != 0)
        char_code++;

    min = 0;
    max = num_groups;

    while (min < max)
    {
        mid = (min + max) >>> 1;
        p.pos = base + 16 + 12 * mid;

        start = FT_NEXT_ULONG(p);
        end = FT_NEXT_ULONG(p);

        if (char_code < start)
            max = mid;
        else if (char_code > end)
            min = mid + 1;
        else
        {
            start_id = FT_PEEK_ULONG(p);
            gindex = (start_id + char_code - start);
            break;
        }
    }

    if (next != 0)
    {
        if (char_code > end)
        {
            mid++;
            if (mid == num_groups)
                return 0;
        }

        cmap.valid = 1;
        cmap.cur_charcode = char_code;
        cmap12.cur_group = mid;

        if (gindex == 0)
        {
            tt_cmap12_next(cmap);

            if (cmap.valid == 1)
                gindex = cmap.cur_gindex;
        }
        else
            cmap.cur_gindex = gindex;

        if (gindex != 0)
            __char_code = cmap.cur_charcode;
    }

    return {gindex:gindex,char_code:__char_code};
}
function tt_cmap12_char_index(cmap, char_code)
{
    return tt_cmap12_char_map_binary(cmap, char_code, 0).gindex;
}
function tt_cmap12_char_next(cmap, _char_code)
{
    var gindex = 0;
    var __char_code = _char_code;

    if (cmap.cur_charcode >= 0xFFFFFFFF)
        return {gindex:gindex,char_code:__char_code};

    if (cmap12.valid == 1 && cmap.cur_charcode == _char_code)
    {
        tt_cmap12_next(cmap);
        if (1 == cmap.valid)
        {
            gindex = cmap.cur_gindex;
            if (gindex != 0)
                __char_code = cmap.cur_charcode;
        }
        else
            gindex = 0;
    }
    else
        return tt_cmap12_char_map_binary(cmap, _char_code, 1);

    return {gindex:gindex,char_code:__char_code};
}
function tt_cmap12_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap12_init,null,tt_cmap12_char_index,tt_cmap12_char_next,null,null,null,null,null);
    this.format = 12;
    this.validate = function(table, valid)
    {
        var base = table.pos;
        var p = dublicate_pointer(table);
        if (p.pos + 16 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;
        p.pos = base + 4;
        var length = FT_NEXT_ULONG(p);
        p.pos = base + 12;
        var num_groups = FT_NEXT_ULONG(p);
        if (length > (valid.limit - base) || length < 16 + 12 * num_groups)
            return FT_Common.FT_Err_Invalid_Table;
        var n, start, end, start_id, last = 0;
        for (n = 0; n < num_groups; n++)
        {
            start    = FT_NEXT_ULONG(p);
            end      = FT_NEXT_ULONG(p);
            start_id = FT_NEXT_ULONG(p);

            if (start > end)
                return FT_Common.FT_Err_Invalid_Table;
            if (n > 0 && start <= last)
                return FT_Common.FT_Err_Invalid_Table;
            if (valid.level >= 1)
            {
                if (start_id + end - start >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;
            }
            last = end;
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.cmap.data;
        data.pos += 8;
        cmap_info.format = 12;
        cmap_info.language = FT_PEEK_ULONG(data);
        data.pos -= 8;
        return 0;
    }
}
// cmap13 ---------------------------------------------------------------------------------
function TT_CMap13Rec()
{
    this.cmap = new TT_CMapRec();
    this.valid;
    this.cur_charcode;
    this.cur_gindex;
    this.cur_group;
    this.num_groups;

    this.type = FT_Common.FT_CMAP_13;
}
function tt_cmap13_init(cmap, table)
{
    cmap.cmap.data = dublicate_pointer(table);
    table.pos += 12;
    cmap.num_groups = FT_PEEK_ULONG(table);
    table.pos -= 12;
    cmap.valid = 0;
    return 0;
}
function tt_cmap13_next(cmap)
{
    if (cmap.cur_charcode >= 0xFFFFFFFF)
    {
        cmap.valid = 0;
        return;
    }

    var p = dublicate_pointer(cmap.cmap.data);
    var base = p.pos;
    var start, end, glyph_id, char_code;
    var gindex;

    char_code = cmap.cur_charcode + 1;
    for (var n = cmap.cur_group; n < cmap.num_groups; n++ )
    {
        p.pos = base + 16 + 12 * n;
        start = FT_NEXT_ULONG(p);
        end = FT_NEXT_ULONG(p);
        glyph_id = FT_PEEK_ULONG(p);

        if (char_code < start)
            char_code = start;

        if ( char_code <= end )
        {
            gindex = glyph_id;
            if (gindex != 0)
            {
                cmap.cur_charcode = char_code;
                cmap.cur_gindex = gindex;
                cmap.cur_group = n;
                return;
            }
        }
    }
    cmap.valid = 0;
}
function tt_cmap13_char_map_binary(cmap, _char_code, next)
{
    var gindex = 0;
    var p = dublicate_pointer(cmap.cmap.data);
    var base = p.pos;
    p.pos += 12;
    var num_groups = FT_PEEK_ULONG(p);
    var char_code = _char_code;
    var __char_code = _char_code;
    var start, end;
    var max, min, mid;

    if (num_groups == 0)
        return {gindex:gindex,char_code:__char_code};

    mid = num_groups;
    end = 0xFFFFFFFF;

    if (next != 0)
        char_code++;

        min = 0;
        max = num_groups;

    while (min < max)
    {
        mid = (min + max) >>> 1;
        p.pos = base + 16 + 12 * mid;

        start = FT_NEXT_ULONG(p);
        end   = FT_NEXT_ULONG(p);

        if (char_code < start)
            max = mid;
        else if (char_code > end)
            min = mid + 1;
        else
        {
            gindex = FT_PEEK_ULONG(p);
            break;
        }
    }

    if (next != 0)
    {
        if (char_code > end)
        {
            mid++;
            if (mid == num_groups)
                return 0;
        }

        cmap.valid        = 1;
        cmap.cur_charcode = char_code;
        cmap.cur_group    = mid;

        if (gindex == 0)
        {
            tt_cmap13_next( cmap13 );
            if (cmap.valid == 1)
                gindex = cmap.cur_gindex;
        }
        else
            cmap.cur_gindex = gindex;

        if (gindex != 0)
            __char_code = cmap.cur_charcode;
    }

    return {gindex:gindex,char_code:__char_code};
}
function tt_cmap13_char_index(cmap, char_code)
{
    return tt_cmap13_char_map_binary(cmap, char_code, 0).gindex;
}
function tt_cmap13_char_next(cmap, _char_code)
{
    if (cmap.cur_charcode >= 0xFFFFFFFF)
        return {gindex:0,char_code:_char_code};

    var gindex;
    var __char_code = _char_code;
    if (cmap.valid == 1 && cmap.cur_charcode == _char_code)
    {
        tt_cmap13_next(cmap);
        if (cmap.valid == 1)
        {
            gindex = cmap.cur_gindex;
            if (gindex != 0)
                __char_code = cmap.cur_charcode;
        }
        else
            gindex = 0;
    }
    else
        return tt_cmap13_char_map_binary( cmap, pchar_code, 1 );

    return {gindex:gindex,char_code:__char_code};
}
function tt_cmap13_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap13_init,null,tt_cmap13_char_index,tt_cmap13_char_next,null,null,null,null,null);
    this.format = 13;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        var base = p.pos;

        if (bae + 16 > valid.limit)
            return FT_Common.FT_Err_Invalid_Table;

        p.pos = base + 4;
        var length = FT_NEXT_ULONG(p);
        p.pos = base + 12;
        var num_groups = FT_NEXT_ULONG(p);

        if (length > (valid.limit - base) || length < 16 + 12 * num_groups)
            return FT_Common.FT_Err_Invalid_Table;

        var start, end, glyph_id, last = 0;
        for (var n = 0; n < num_groups; n++)
        {
            start    = FT_NEXT_ULONG(p);
            end      = FT_NEXT_ULONG(p);
            glyph_id = FT_NEXT_ULONG(p);

            if (start > end)
                return FT_Common.FT_Err_Invalid_Table;

            if (n > 0 && start <= last)
                return FT_Common.FT_Err_Invalid_Table;

            if (valid.level >= 1)
            {
                if (glyph_id >= valid.num_glyphs)
                    return FT_Common.FT_Err_Invalid_Glyph_Index;
            }

            last = end;
        }
        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        var data = cmap.data;
        data.pos += 8;
        cmap_info.format = 13;
        cmap_info.language = FT_PEEK_ULONG(data);
        data.pos -= 8;
        return 0;
    }
}
// cmap14 ---------------------------------------------------------------------------------
function TT_CMap14Rec()
{
    this.cmap = new TT_CMapRec();
    this.num_selectors;
    this.max_results;
    this.results = null;

    this.type = FT_Common.FT_CMAP_14;
}
function tt_cmap14_done(cmap)
{
    cmap.results = null;
}
function tt_cmap14_ensure(cmap, num_results, memory)
{
    var old_max = cmap.max_results;
    if (num_results > cmap.max_results)
    {
        var c = num_results - old_max;
        for (;c>0;c--)
            cmap.results[old_max+c-1] = 0;
        cmap.max_results = num_results;
    }
    return 0;
}
function tt_cmap14_init(cmap, table)
{
    cmap.cmap.data = dublicate_pointer(table);
    table.pos += 6;
    cmap.num_selectors = FT_PEEK_ULONG(table);
    table.pos -= 6;
    cmap.max_results   = 0;
    cmap.results = null;
    return 0;
}
function tt_cmap14_char_index(cmap,char_code)
{
    return 0;
}
function tt_cmap14_char_next(cmap, _char_code)
{
    return {gindex:0,char_code:0};
}
function tt_cmap14_char_map_def_binary(base, char_code)
{
    var p = dublicate_pointer(base);
    var numRanges = FT_PEEK_ULONG(p);
    var min = 0;
    var max = numRanges;

    while (min < max)
    {
        var mid = (min + max) >>> 1;
        p.pos = base.pos + 4 + 4 * mid;
        var start = FT_NEXT_UOFF3(p);
        var cnt = FT_NEXT_BYTE(p);

        if (char_code < start)
            max = mid;
        else if (char_code > start+cnt)
            min = mid + 1;
        else
            return 1;
    }
    return 0;
}
function tt_cmap14_char_map_nondef_binary(base, char_code)
{
    var p = dublicate_pointer(base);
    var numMappings = FT_PEEK_ULONG(p);
    var min = 0;
    var max = numMappings;

    while (min < max)
    {
        var mid = (min + max) >>> 1;
        p.pos = base.pos + 4 + 5 * mid;
        var uni = FT_NEXT_UOFF3(p);

        if (char_code < uni)
            max = mid;
        else if (char_code > uni)
            min = mid + 1;
        else
            return FT_PEEK_USHORT(p);
    }
    return 0;
}
function tt_cmap14_find_variant(base, variantCode)
{
    var p = dublicate_pointer(base);
    var numVar = FT_PEEK_ULONG(p);
    var min = 0;
    var max = numVar;

    while (min < max)
    {
        var mid = (min + max) >>> 1;
        p.pos = base.pos + 4 + 11 * mid;
        var varSel = FT_NEXT_UOFF3(p);

        if (variantCode < varSel)
            max = mid;
        else if (variantCode > varSel)
            min = mid + 1;
        else
            return p;
    }
    return null;
}
function tt_cmap14_char_var_index(cmap, ucmap, charcode, variantSelector)
{
    var base = dublicate_pointer(cmap.cmap.data);
    base.pos += 6;
    var p = tt_cmap14_find_variant(base, variantSelector);
    if (null == p)
        return 0;

    var defOff = FT_NEXT_ULONG(p);
    var nondefOff = FT_PEEK_ULONG(p);

    base.pos = cmap.cmap.data.pos + defOff;
    if (defOff != 0 && 0 != tt_cmap14_char_map_def_binary(base, charcode))
    {
        return ucmap.cmap.clazz.char_index(ucmap.cmap, charcode);
    }

    base.pos = cmap.cmap.data.pos + nondefOff;
    if (nondefOff != 0)
        return tt_cmap14_char_map_nondef_binary(base, charcode);

    return 0;
}
function tt_cmap14_char_var_isdefault(cmap, charcode, variantSelector)
{
    var base = dublicate_pointer(cmap.cmap.data);
    var base_pos = base.pos;
    base += 6;
    var p = tt_cmap14_find_variant(base, variantSelector);
    if (null == p)
        return -1;

    var defOff    = FT_NEXT_ULONG(p);
    var nondefOff = FT_NEXT_ULONG(p);

    base.pos = base_pos + defOff;
    if (defOff != 0 && 0 != tt_cmap14_char_map_def_binary(base, charcode))
        return 1;

    base.pos = base_pos + nondefOff;
    if (nondefOff != 0 && tt_cmap14_char_map_nondef_binary(base, charcode) != 0)
        return 0;

    return -1;
}
function tt_cmap14_variants(cmap, memory)
{
    var count = cmap.num_selectors;
    var p = dublicate_pointer(cmap.cmap.data);
    p.pos += 10;

    if (0 != tt_cmap14_ensure(cmap, (count + 1), memory))
        return null;

    var result = cmap.results;
    var i = 0;
    for (; i < count; i++)
    {
        result[i] = FT_NEXT_UOFF3(p);
        p.pos += 8;
    }
    result[i] = 0;

    p.data = result;
    p.pos = 0;
    return p;
}
function tt_cmap14_char_variants(cmap, memory, charCode)
{
    var count = cmap.num_selectors;
    var p = dublicate_pointer(cmap.cmap.data);
    var base_pos = p.pos;
    p.pos += 10;
    
    if (0 != tt_cmap14_ensure(cmap, (count + 1), memory))
        return null;

    var p1 = dublicate_pointer(p);
    var p2 = dublicate_pointer(p);

    var results = cmap.results;
    var q = 0;
    for (; count > 0; --count)
    {
        var varSel    = FT_NEXT_UOFF3(p);
        var defOff    = FT_NEXT_ULONG(p);
        var nondefOff = FT_NEXT_ULONG(p);

        p1.pos = base_pos + defOff;
        p2.pos = base_pos + nondefOff;
        if ((defOff != 0 && 0 != tt_cmap14_char_map_def_binary(p1, charCode)) ||
           (nondefOff != 0 && 0 != tt_cmap14_char_map_nondef_binary(p2, charCode)))
        {
            results[q] = varSel;
            q++;
        }
    }
    results[q] = 0;
    p.data = results;
    p.pos = 0;
    return p;
}
function tt_cmap14_def_char_count(_p)
{
    var p = dublicate_pointer(_p);
    var numRanges = FT_NEXT_ULONG(p);
    var tot = 0;
    p.pos += 3;
    for (; numRanges > 0; numRanges--)
    {
        tot += 1 + p.data[p.pos];
        p.pos += 4;
    }
    return tot;
}
function tt_cmap14_get_def_chars(cmap, _p, memory)
{
    var p = dublicate_pointer(_p);
    var cnt = tt_cmap14_def_char_count(p);
    var numRanges = FT_NEXT_ULONG(p);

    if (0 != tt_cmap14_ensure(cmap, (cnt + 1), memory))
        return null;

    var results = cmap.results;
    var q = 0;
    for (; numRanges > 0; --numRanges)
    {
        var uni = FT_NEXT_UOFF3(p);
        cnt = FT_NEXT_BYTE(p) + 1;
        do
        {
            results[q] = uni;
            uni  += 1;
            q    += 1;
        } while (--cnt != 0);
    }
    results[q] = 0;
    p.data = results;
    p.pos = 0;
    return p;
}
function tt_cmap14_get_nondef_chars(cmap, _p, memory)
{
    var p = dublicate_pointer(_p);
    var numMappings = FT_NEXT_ULONG(p);

    if (0 != tt_cmap14_ensure(cmap, (numMappings + 1), memory))
        return null;

    var ret = cmap.results;
    var i = 0;
    for (; i < numMappings; i++)
    {
        ret[i] = FT_NEXT_UOFF3(p);
        p.pos += 2;
    }
    ret[i] = 0;
    p.data = ret;
    p.pos = 0;
    return p;
}
function tt_cmap14_variant_chars(cmap, memory, variantSelector)
{
    var base = dublicate_pointer(cmap.cmap.data);
    var base_pos = base.pos;
    base.pos += 6;
    var p = tt_cmap14_find_variant(base, variantSelector);
    if (null == p)
        return null;

    var defOff = FT_NEXT_ULONG(p);
    var nondefOff = FT_NEXT_ULONG(p);

    if (defOff == 0 && nondefOff == 0)
        return null;

    base.pos = base_pos + nondefOff;
    if (defOff == 0)
        return tt_cmap14_get_nondef_chars(cmap, base, memory);
    base.pos = base_pos + defOff;
    if (nondefOff == 0)
        return tt_cmap14_get_def_chars(cmap, base, memory);

    var numRanges;
    var numMappings;
    var duni;
    var dcnt;
    var nuni;
    var dp;
    var di, ni, k;

    var _cmap_data = cmap.cmap.data;
    p = dublicate_pointer(_cmap_data);
    p.pos += nondefOff;
    dp = dublicate_pointer(_cmap_data);
    dp.pos += defOff;

    numMappings = FT_NEXT_ULONG(p);
    dcnt        = tt_cmap14_def_char_count(dp);
    numRanges   = FT_NEXT_ULONG(dp);

    if (numMappings == 0)
    {
        var __pp = dublicate_pointer(_cmap_data);
        __pp += defOff;
        return tt_cmap14_get_def_chars(cmap, _p, memory);
    }
    if (dcnt == 0)
    {
        var __pp = dublicate_pointer(_cmap_data);
        __pp += nondefOff;
        return tt_cmap14_get_nondef_chars(cmap, __p, memory);
    }

    if (0 != tt_cmap14_ensure(cmap, (dcnt + numMappings + 1), memory))
        return null;

    var ret = cmap.results;
    duni = FT_NEXT_UOFF3(dp);
    dcnt = FT_NEXT_BYTE(dp);
    di = 1;
    nuni = FT_NEXT_UOFF3(p);
    p.pos += 2;
    ni = 1;
    i = 0;

    for ( ;; )
    {
        if (nuni > duni + dcnt)
        {
            for (k = 0; k <= dcnt; k++)
                ret[i++] = duni + k;

            ++di;

            if (di > numRanges)
                break;

            duni = FT_NEXT_UOFF3(dp);
            dcnt = FT_NEXT_BYTE(dp);
        }
        else
        {
            if (nuni < duni)
                ret[i++] = nuni;
            ++ni;
            if (ni > numMappings)
                break;

            nuni = FT_NEXT_UOFF3(p);
            p.pos += 2;
        }
    }

    if (ni <= numMappings)
    {
        ret[i++] = nuni;
        while (ni < numMappings)
        {
            ret[i++] = FT_NEXT_UOFF3(p);
            p.pos += 2;
            ++ni;
        }
    }
    else if (di <= numRanges)
    {
        for (k = 0; k <= dcnt; k++)
            ret[i++] = duni + k;

        while (di < numRanges)
        {
            duni = FT_NEXT_UOFF3(dp);
            dcnt = FT_NEXT_BYTE(dp);

            for (k = 0; k <= dcnt; k++)
                ret[i++] = duni + k;
            ++di;
        }
    }
    ret[i] = 0;
    p.data = ret;
    p.pos = 0;
    return p;
}
function tt_cmap14_class_rec()
{
    this.clazz = create_cmap_class_rec(0,tt_cmap14_init,tt_cmap14_done,tt_cmap14_char_index,tt_cmap14_char_next,
        tt_cmap14_char_var_index,tt_cmap14_char_var_isdefault,tt_cmap14_variants,
        tt_cmap14_char_variants,tt_cmap14_variant_chars);
    this.format = 14;
    this.validate = function(table, valid)
    {
        var p = dublicate_pointer(table);
        var defp = dublicate_pointer(table);
        var base = p.pos;
        p.pos += 2;
        var length        = FT_NEXT_ULONG(p);
        var num_selectors = FT_NEXT_ULONG(p);

        if (length > (valid.limit - base) || length < 10 + 11 * num_selectors)
            return FT_Common.FT_Err_Invalid_Table;

        var n, lastVarSel = 1;
        for ( n = 0; n < num_selectors; n++ )
        {
            var varSel = FT_NEXT_UOFF3(p);
            var defOff = FT_NEXT_ULONG(p);
            var nondefOff = FT_NEXT_ULONG(p);

            if (defOff >= length || nondefOff >= length)
                return FT_Common.FT_Err_Invalid_Table;

            if (varSel < lastVarSel)
                return FT_Common.FT_Err_Invalid_Table;

            lastVarSel = varSel + 1;
            if (defOff != 0)
            {
                defp.pos = base + defOff;
                var numRanges = FT_NEXT_ULONG(defp);
                var lastBase  = 0;

                if (defp.pos + numRanges * 4 > valid.limit)
                    return FT_Common.FT_Err_Invalid_Table;

                for (var i = 0; i < numRanges; ++i)
                {
                    var _base = FT_NEXT_UOFF3(defp);
                    var cnt  = FT_NEXT_BYTE(defp);

                    if (_base + cnt >= 0x110000)
                        return FT_Common.FT_Err_Invalid_Table;

                    if (_base < lastBase)
                        return FT_Common.FT_Err_Invalid_Table;

                    lastBase = _base + cnt + 1;
                }
            }

            if (nondefOff != 0)
            {
                defp.pos = base + nondefOff;
                var numMappings = FT_NEXT_ULONG(defp);
                var lastUni = 0;

                if (numMappings * 4 > (valid.limit - defp.pos))
                    return FT_Common.FT_Err_Invalid_Table;

                for (var i = 0; i < numMappings; ++i)
                {
                    var uni = FT_NEXT_UOFF3(defp);
                    var gid = FT_NEXT_USHORT(defp);

                    if ( uni >= 0x110000)
                        return FT_Common.FT_Err_Invalid_Table;
                    if (uni < lastUni)
                        return FT_Common.FT_Err_Invalid_Table;
                    lastUni = uni + 1;
                    if (valid.level >= 1 && gid >= valid.num_glyphs)
                        return FT_Common.FT_Err_Invalid_Glyph_Index;
                }
            }
        }

        return 0;
    }
    this.get_cmap_info = function(cmap, cmap_info)
    {
        cmap_info.format = 14;
        cmap_info.language = 0xFFFFFFFF;
        return 0;
    }
}
// finally
function tt_face_build_cmaps(face)
{
    var table = dublicate_pointer(face.cmap_table);

    if (null == table)
        return FT_Common.FT_Err_Invalid_Table;

    var limit = table.pos + face.cmap_size;
    var p = dublicate_pointer(table);

    if (p.data == null || p.pos + 4 > limit)
        return FT_Common.FT_Err_Invalid_Table;

    if (FT_NEXT_USHORT(p) != 0)
        return FT_Common.FT_Err_Invalid_Table;

    var num_cmaps = FT_NEXT_USHORT(p);
    //#ifdef FT_MAX_CHARMAP_CACHEABLE
    if (num_cmaps > FT_Common.FT_MAX_CHARMAP_CACHEABLE)
    {
    }
    //#endif

    var pclazz = FT_TT_CMAP_CLASSES_GET;
    var pclazz_len = pclazz.length;
    var clazz;
    for (; num_cmaps > 0 && p.pos + 8 <= limit; num_cmaps--)
    {
        var charmap = new FT_CharMapRec();
        charmap.platform_id = FT_NEXT_USHORT(p);
        charmap.encoding_id = FT_NEXT_USHORT(p);
        charmap.face        = face;
        charmap.encoding    = FT_Common.FT_ENCODING_NONE;
        var offset          = FT_NEXT_ULONG(p);

        if (offset && offset <= face.cmap_size - 2)
        {
            var cmap = dublicate_pointer(table);
            cmap.pos += offset;
            var format = FT_PEEK_USHORT(cmap);
            for (var i = 0; i < pclazz_len; i++)
            {
                clazz = pclazz[i];
                if (clazz.format == format)
                {
                    var valid = new TT_Validator();
                    valid.base = cmap;
                    valid.limit = limit;
                    valid.level = 0;
                    valid.error = 0;
                    valid.num_glyphs = face.max_profile.numGlyphs;

                    var error = clazz.validate(cmap, valid);
                    if (error == 0)
                    {
                        var ttcmap = FT_CMap_New(clazz, cmap, charmap);
                        if (null != ttcmap)
                        {
                            ttcmap.flags = 0;
                        }
                    }
                    break;
                }
            }
        }
    }
    return 0;
}
function tt_get_cmap_info(cmap, cmap_info)
{
    var clazz = __FT_CMapRec(cmap).clazz;
    return clazz.get_cmap_info(cmap, cmap_info);
}
/******************************************************************************/
// driver
/******************************************************************************/
function tt_face_load_sfnt_header_stub(face,stream,face_index,header)
{
    return FT_Common.FT_Err_Unimplemented_Feature;
}
function tt_face_load_directory_stub(face,stream,header)
{
    return FT_Common.FT_Err_Unimplemented_Feature;
}
function tt_face_load_hdmx_stub(face,stream)
{
    return FT_Common.FT_Err_Unimplemented_Feature;
}
function tt_face_free_hdmx_stub(face)
{
}
function tt_face_set_sbit_strike_stub(face,x_ppem,y_ppem)
{
    var req = new FT_Size_RequestRec();
    req.type = FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL;
    req.width = x_ppem;
    req.height = y_ppem;
    req.horiResolution = 0;
    req.vertResolution = 0;

    var strikeindex = 0x7FFFFFFF;
    return tt_face_set_sbit_strike(face, req, strikeindex);
}

function tt_face_load_sbit_stub(face,stream)
{
    return FT_Common.FT_Err_Unimplemented_Feature;
}
function tt_face_free_sbit_stub(face)
{
}

function tt_face_load_charmap_stub(face,cmap,input)
{
    return FT_Common.FT_Err_Unimplemented_Feature;
}
function tt_face_free_charmap_stub(face,cmap)
{
    return 0;
}

function get_sfnt_table(face, tag)
{
    var table = null;
    switch ( tag )
    {
    case 0:
        table = face.header;
        break;
    case 3:
        table = face.horizontal;
        break;
    case 4:
        table = (face.vertical_info == 1) ? face.vertical : null;
        break;
    case 2:
        table = (face.os2.version == 0xFFFF) ? null : face.os2;
        break;
    case 5:
        table = face.postscript;
        break;
    case 1:
        table = face.max_profile;
        break;
    case 6:
        table = (face.pclt.Version != 0) ? face.pclt : null;
        break;
    default:
        break;
    }
    return table;
}
function sfnt_table_info(face, idx, tag)
{
    if (tag != null)
        return {tag:0,offset:0,length:face.num_tables};

    if (idx >= face.num_tables)
        return null;
    var t = face.dir_tables[idx];
    return {tag:t.Tag,offset:t.Offset,length:t.Length};
}
function ft_mem_strcpyn(dst, src, size)
{
    var len = src.length;
    var ret = 1;
    if (len > size)
    {
        len = size;
        ret = 0;
    }
    var i=0;
    while (len > 1)
    {
        dst[dst.pos + i] = src.charCodeAt(i);
        i++;
        size--;
    }
    dst[dst.pos + i] = 0;
    return ret;
}
function sfnt_get_glyph_name(face, glyph_index, buffer, buffer_max)
{
    var gname = tt_face_get_ps_name(face, glyph_index);
    var error = FT_Error;
    if (error == 0)
        ft_mem_strcpyn(buffer, gname, buffer_max);
    return error;
}
function sfnt_get_name_index(face, glyph_name)
{
    var max_gid = 0xFFFFFFFF;
    if (face.num_glyphs < 0)
        return 0;
    else if (face.num_glyphs < 0xFFFFFFFF)
        max_gid = face.num_glyphs;
    for (var i = 0; i < max_gid; i++)
    {
        var gname = tt_face_get_ps_name(face, i);
        error = FT_Error;
        if (error != 0)
            continue;

        if (glyph_name == gname)
            return i;
    }
    return 0;
}
function sfnt_get_ps_name(face)
{
    var n, found_win, found_apple;
    var result = "";

    if (face.postscript_name != "")
        return face.postscript_name;

    found_win   = -1;
    found_apple = -1;

    var num_faces = face.num_faces;
    for (n = 0; n < num_faces; n++)
    {
        var name = face.name_table.names[n];
        if (name.nameID == 6 && name.stringLength > 0)
        {
            if (name.platformID == 3 && name.encodingID == 1 && name.languageID == 0x409)
                found_win = n;

            if (name.platformID == 1 && name.encodingID == 0 && name.languageID == 0)
                found_apple = n;
        }
    }

    if (found_win != -1)
    {
        var stream = face.name_table.stream;
        var name = face.name_table.names[found_win];
        var len = parseInt(name.stringLength / 2);

        var error = stream.Seek(name.stringOffset);
        if (error == 0)
            error = stream.EnterFrame(name.stringLength);
        if (error != 0)
        {
            name.stringOffset = 0;
            name.stringLength = 0;
            face.postscript_name = "";
            return "";
        }
        var d = stream.data;
        var cur = stream.cur;
        for (; len > 0; len--, cur += 2)
        {
            if (d[cur] == 0 && d[cur+1] >= 32 && d[cur+1] < 128)
                result += String.fromCharCode(d[cur+1]);
        }
        stream.ExitFrame();
        face.postscript_name = result;
        return result;
    }

    if (found_apple != -1)
    {
        var stream = face.name_table.stream;
        var name = face.name_table.names[found_apple];
        var len = name.stringLength;

        var error = stream.Seek(name.stringOffset);
        if (error == 0)
        {
            result = stream.ReadString1(name.stringLength);
            error = FT_Error;
        }
        if (error != 0)
        {
            name.stringOffset = 0;
            name.stringLength = 0;
            face.postscript_name = "";
            return "";
        }

        face.postscript_name = result;
        return result;
    }

    face.postscript_name = result;
    return result;
}

var sfnt_service_glyph_dict = new FT_Service_GlyphDictRec(sfnt_get_glyph_name,sfnt_get_name_index);
var sfnt_service_ps_name = new FT_Service_PsFontNameRec(sfnt_get_ps_name);
var tt_service_get_cmap_info = new FT_Service_TTCMapsRec(tt_get_cmap_info);

var tt_cmap_classes = new Array(9);
tt_cmap_classes[0] = new tt_cmap0_class_rec();
tt_cmap_classes[1] = new tt_cmap2_class_rec();
tt_cmap_classes[2] = new tt_cmap4_class_rec();
tt_cmap_classes[3] = new tt_cmap6_class_rec();
tt_cmap_classes[4] = new tt_cmap8_class_rec();
tt_cmap_classes[5] = new tt_cmap10_class_rec();
tt_cmap_classes[6] = new tt_cmap12_class_rec();
tt_cmap_classes[7] = new tt_cmap13_class_rec();
tt_cmap_classes[8] = new tt_cmap14_class_rec();

var sfnt_service_sfnt_table = new FT_Service_SFNT_TableRec(tt_face_load_any,get_sfnt_table,sfnt_table_info);
var sfnt_service_bdf = new FT_Service_BDFRec(sfnt_get_charset_id,tt_face_find_bdf_prop);

var sfnt_services = new Array(5);
sfnt_services[0] = new FT_ServiceDescRec(FT_SERVICE_ID_SFNT_TABLE,sfnt_service_sfnt_table);
sfnt_services[1] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_FONT_NAME,sfnt_service_ps_name);
sfnt_services[2] = new FT_ServiceDescRec(FT_SERVICE_ID_GLYPH_DICT,sfnt_service_glyph_dict);
sfnt_services[3] = new FT_ServiceDescRec(FT_SERVICE_ID_BDF,sfnt_service_bdf);
sfnt_services[4] = new FT_ServiceDescRec(FT_SERVICE_ID_TT_CMAP,tt_service_get_cmap_info);

function tt_face_get_name(face, nameid)
{
    FT_Error = 0;
    var found_apple         = -1;
    var found_apple_roman   = -1;
    var found_apple_english = -1;
    var found_win           = -1;
    var found_unicode       = -1;

    var is_english = false;
    var convert = null;
    var rec = null;
    var num_names = face.num_names;
    var n = 0;
    for (; n < face.num_names; n++)
    {
        rec = face.name_table.names[n];
        if (rec.nameID == nameid && rec.stringLength > 0)
        {
            switch (rec.platformID)
            {
            case FT_Common.TT_PLATFORM_APPLE_UNICODE:
            case FT_Common.TT_PLATFORM_ISO:
                found_unicode = n;
                break;

            case FT_Common.TT_PLATFORM_MACINTOSH:
                if ( rec.languageID == 0)
                    found_apple_english = n;
                else if (rec.encodingID == 0)
                    found_apple_roman = n;
                break;

            case FT_Common.TT_PLATFORM_MICROSOFT:
                if (found_win == -1 || (rec.languageID & 0x3FF) == 0x009)
                {
                    switch ( rec.encodingID )
                    {
                    case FT_Common.TT_MS_ID_SYMBOL_CS:
                    case FT_Common.TT_MS_ID_UNICODE_CS:
                    case FT_Common.TT_MS_ID_UCS_4:
                        is_english = ((rec.languageID & 0x3FF) == 0x009) ? true : false;
                        found_win  = n;
                        break;

                    default:
                        break;
                    }
                }
                break;
            default:
                break;
            }
        }
    }

    found_apple = found_apple_roman;
    if (found_apple_english >= 0)
        found_apple = found_apple_english;

    if (found_win >= 0 && !(found_apple >= 0 && false === is_english))
    {
        rec = face.name_table.names[found_win];
        switch (rec.encodingID)
        {
        case FT_Common.TT_MS_ID_UNICODE_CS:
        case FT_Common.TT_MS_ID_SYMBOL_CS:
            convert = tt_name_entry_ascii_from_utf16;
            break;

        case FT_Common.TT_MS_ID_UCS_4:
            convert = tt_name_entry_ascii_from_utf16;
            break;

        default:
            break;
        }
    }
    else if (found_apple >= 0)
    {
        rec     = face.name_table.names[found_apple];
        convert = tt_name_entry_ascii_from_other;
    }
    else if (found_unicode >= 0)
    {
        rec     = face.name_table.names[found_unicode];
        convert = tt_name_entry_ascii_from_utf16;
    }

    if (rec && convert)
    {
        if (rec.string == null)
        {
            var stream = face.name_table.stream;
            FT_Error = stream.Seek(rec.stringOffset);
            if (FT_Error == 0)
            {
                rec.string = stream.ReadArray(rec.stringLength);
            }
            if (FT_Error != 0 || null == rec.string)
                return "";
        }
        return convert(rec);
    }
    return "";
}
/* convert an Apple Roman or symbol name entry to ASCII */
function tt_name_entry_ascii_from_utf16(entry)
{
    var string = "";
    var p = entry.string;
    var len = parseInt(entry.stringLength / 2);
    if (len > p.length)
        len = p.length;

    var code = 0;
    for (var n = 0; n < len; n++)
    {
        code = p[2*n] << 8 | p[2*n+1];
        if (code < 32 || code > 127)
            code = FT_Common.SYMBOL_CONST_VOPROS;

        string += String.fromCharCode(code);
    }
    return string;
}

/* convert an Apple Roman or symbol name entry to ASCII */
function tt_name_entry_ascii_from_other(entry)
{
    var string = "";
    var p = entry.string;
    var len = entry.stringLength;
    if (len > p.length)
        len = p.length;

    var code = 0;
    for (var n = 0; n < len; n++)
    {
        code = p[n];
        if ( code < 32 || code > 127 )
            code = FT_Common.SYMBOL_CONST_VOPROS;

        string += String.fromCharCode(code);
    }
    return string;
}

function sfnt_init_face(stream, face, face_index)
{
    var error = 0;
    var library = face.driver.library;

    var sfnt = face.sfnt;
    if (null == sfnt)
    {
        sfnt = library.FT_Get_Module_Interface("sfnt");
        if (null == sfnt)
            return FT_Common.FT_Err_Invalid_File_Format;

        face.sfnt = sfnt;
        face.goto_table = sfnt.goto_table;
    }

    face.psnames = FT_FACE_FIND_GLOBAL_SERVICE(face, "postscript-cmaps");

    error = sfnt_open_font(stream, face);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    if (face_index < 0)
        face_index = 0;

    if (face_index >= face.ttc_header.count)
        return FT_Common.FT_Err_Invalid_Argument;

    error = stream.Seek(face.ttc_header.offsets[face_index])
    if (error != FT_Common.FT_Err_Ok)
        return error;

    /* check that we have a valid TrueType file */
    error = sfnt.load_font_dir(face, stream);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    face.num_faces = face.ttc_header.count;
    face.face_index = face_index;

    return error;
}
function sfnt_load_face(stream, face, face_index)
{
    var error = FT_Common.FT_Err_Ok;
    var psnames_error = FT_Common.FT_Err_Ok;

    var has_outline = false;
    var is_apple_sbit = false;
    var ignore_preferred_family = false;
    var ignore_preferred_subfamily = false;

    var sfnt = face.sfnt;

    if (face.internal.incremental_interface != null)
        has_outline = true;
    else if (null != tt_face_lookup_table(face, FT_Common.TTAG_glyf))
        has_outline = true;
    else if (null != tt_face_lookup_table(face, FT_Common.TTAG_CFF))
        has_outline = true;

    if (false === has_outline && sfnt.load_bhed != null)
    {
        error = sfnt.load_bhed(face, stream);
        is_apple_sbit = (error == 0) ? false : true;
    }

    if (false === is_apple_sbit)
    {
        error = sfnt.load_head(face, stream);
        if (error != 0)
            return error;
    }

    if (0 == face.header.Units_Per_EM)
        return FT_Common.FT_Err_Invalid_Table;

    error = sfnt.load_maxp(face, stream);
    error = sfnt.load_cmap(face, stream);

    error = sfnt.load_name(face, stream);
    error = sfnt.load_post(face, stream);

    psnames_error = error;

    if (false === is_apple_sbit)
    {
        error = sfnt.load_hhea(face, stream, 0);
        if (error == 0)
        {
            error = sfnt.load_hmtx(face, stream, 0);
            if (error == FT_Common.FT_Err_Table_Missing)
            {
                error = FT_Common.FT_Err_Hmtx_Table_Missing;

                //#ifdef FT_CONFIG_OPTION_INCREMENTAL
                if (face.internal.incremental_interface &&
                    face.internal.incremental_interface.funcs.get_glyph_metrics)
                {
                    face.horizontal.number_Of_HMetrics = 0;
                    error = FT_Common.FT_Err_Ok;
                }
                //#endif
            }
        }
        else if (error == FT_Common.FT_Err_Table_Missing)
        {
            if (face.format_tag == FT_Common.TTAG_true)
            {
                has_outline = false;
                error       = FT_Common.FT_Err_Ok;
            }
            else
            {
                error = FT_Common.FT_Err_Horiz_Header_Missing;

                //#ifdef FT_CONFIG_OPTION_INCREMENTAL
                if (face.internal.incremental_interface &&
                    face.internal.incremental_interface.funcs.get_glyph_metrics)
                {
                    face.horizontal.number_Of_HMetrics = 0;
                    error = FT_Common.FT_Err_Ok;
                }
                //#endif
            }
        }

        if (error != 0)
            return error;

        error = sfnt.load_hhea(face, stream, 1);
        if (error == 0)
        {
            error = sfnt.load_hmtx(face, stream, 1);
            if (error == 0)
                face.vertical_info = 1;
        }

        if (error != 0 && error != FT_Common.FT_Err_Table_Missing)
            return error;

        error = sfnt.load_os2(face, stream);
        if (error != 0)
        {
            /* we treat the table as missing if there are any errors */
            face.os2.version = 0xFFFF;
        }
    }

    if (sfnt.load_eblc)
    {
        error = sfnt.load_eblc(face, stream);
        if (error != 0)
        {
            if (error == FT_Common.FT_Err_Table_Missing)
                error = FT_Common.FT_Err_Ok;
            else
                return error;
        }
    }

    error = sfnt.load_pclt(face, stream);
    if (error != 0)
    {
        if (error != FT_Common.FT_Err_Table_Missing)
            return error;

        face.pclt.Version = 0;
    }

    error = sfnt.load_gasp(face, stream);
    error = sfnt.load_kern(face, stream);

    face.num_glyphs = face.max_profile.numGlyphs;

    face.family_name = "";
    face.style_name = "";

    if (face.os2.version != 0xFFFF && (face.os2.fsSelection & 256) != 0)
    {
        /*
        if (false ==  ignore_preferred_family)
        {
            face.family_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_PREFERRED_FAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
        */
        if ("" == face.family_name)
        {
            face.family_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_FONT_FAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }

        /*
        if (false == ignore_preferred_subfamily)
        {
            face.style_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_PREFERRED_SUBFAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
        */
        if ("" == face.style_name)
        {
            face.style_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_FONT_SUBFAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
    }
    else
    {
        face.family_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_WWS_FAMILY);
        error = FT_Error;
        if (error != 0)
            return error;

        /*
        if (face.family_name == "" && false == ignore_preferred_family)
        {
            face.family_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_PREFERRED_FAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
        */
        if (face.family_name == "")
        {
            face.family_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_FONT_FAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }

        face.style_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_WWS_SUBFAMILY);
        error = FT_Error;
        if (error != 0)
            return error;

        /*
        if (face.style_name == "" && false == ignore_preferred_subfamily)
        {
            face.style_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_PREFERRED_SUBFAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
        */
        if (face.style_name == "")
        {
            face.style_name = tt_face_get_name(face, FT_Common.TT_NAME_ID_FONT_SUBFAMILY);
            error = FT_Error;
            if (error != 0)
                return error;
        }
    }

    // face_flags
    var flags = face.face_flags;
    if (has_outline === true)
        flags |= FT_Common.FT_FACE_FLAG_SCALABLE;

    flags |= (FT_Common.FT_FACE_FLAG_SFNT | FT_Common.FT_FACE_FLAG_HORIZONTAL);

    //#ifdef TT_CONFIG_OPTION_POSTSCRIPT_NAMES
    if (psnames_error == 0 && face.postscript.FormatType != 0x00030000)
        flags |= FT_Common.FT_FACE_FLAG_GLYPH_NAMES;
    //#endif

    /* fixed width font? */
    if (face.postscript.isFixedPitch)
        flags |= FT_Common.FT_FACE_FLAG_FIXED_WIDTH;

    /* vertical information? */
    if (face.vertical_info)
        flags |= FT_Common.FT_FACE_FLAG_VERTICAL;

    /* kerning available ? */
    if (face.kern_avail_bits != 0)
        flags |= FT_Common.FT_FACE_FLAG_KERNING;

    //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT
    /* Don't bother to load the tables unless somebody asks for them. */
    /* No need to do work which will (probably) not be used.          */
    if (null != tt_face_lookup_table(face, FT_Common.TTAG_glyf) &&
        null != tt_face_lookup_table(face, FT_Common.TTAG_fvar) &&
        null != tt_face_lookup_table(face, FT_Common.TTAG_gvar))
        flags |= FT_Common.FT_FACE_FLAG_MULTIPLE_MASTERS;
    //#endif

    face.face_flags = flags;

    // Compute style flags.
    flags = 0;
    if (has_outline === true && face.os2.version != 0xFFFF)
    {
        if ((face.os2.fsSelection & 512) != 0)
            flags |= FT_Common.FT_STYLE_FLAG_ITALIC;
        else if ((face.os2.fsSelection & 1) != 0)
            flags |= FT_Common.FT_STYLE_FLAG_ITALIC;

        if ((face.os2.fsSelection & 32) != 0)
            flags |= FT_Common.FT_STYLE_FLAG_BOLD;
    }
    else
    {
        if ((face.header.Mac_Style & 1) != 0)
            flags |= FT_Common.FT_STYLE_FLAG_BOLD;

        if ((face.header.Mac_Style & 2) != 0)
            flags |= FT_Common.FT_STYLE_FLAG_ITALIC;
    }

    face.style_flags = flags;

    // TODO: ---
    tt_face_build_cmaps(face);

    for (var m = 0; m < face.num_charmaps; m++)
    {
        var charmap = __FT_CharmapRec(face.charmaps[m]);
        charmap.encoding = 0;
        charmap.encoding = sfnt_find_encoding(charmap.platform_id, charmap.encoding_id);
    }

    //#ifdef TT_CONFIG_OPTION_EMBEDDED_BITMAPS
    var count = face.num_sbit_strikes;

    if (count > 0)
    {
        var em_size = face.header.Units_Per_EM;
        var avgwidth = face.os2.xAvgCharWidth;
        var metrics = new FT_Size_Metrics();

        if (em_size == 0 || face.os2.version == 0xFFFF)
        {
            avgwidth = 0;
            em_size = 1;
        }

        face.available_sizes = new Array(count);

        for (var i = 0; i < count; i++)
        {
            face.available_sizes[i] = new FT_Bitmap_Size();
            var bsize = face.available_sizes[i];

            error = sfnt.load_strike_metrics(face, i, metrics);
            if (error != 0)
                return error;

            bsize.height = (metrics.height >>> 6) & 0xFFFF;
            bsize.width = parseInt((avgwidth * metrics.x_ppem + parseInt(em_size / 2)) / em_size) & 0xFFFF;

            bsize.x_ppem = metrics.x_ppem << 6;
            bsize.y_ppem = metrics.y_ppem << 6;

            /* assume 72dpi */
            bsize.size   = metrics.y_ppem << 6;
        }

        face.face_flags |= FT_Common.FT_FACE_FLAG_FIXED_SIZES;
        face.num_fixed_sizes = count;
    }

    //#endif TT_CONFIG_OPTION_EMBEDDED_BITMAPS

    /* a font with no bitmaps and no outlines is scalable; */
    /* it has only empty glyphs then                       */
    if (((face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES) == 0) &&
        ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) == 0))
        face.face_flags |= FT_Common.FT_FACE_FLAG_SCALABLE;

    // Set up metrics
    if ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        face.bbox.xMin    = face.header.xMin;
        face.bbox.yMin    = face.header.yMin;
        face.bbox.xMax    = face.header.xMax;
        face.bbox.yMax    = face.header.yMax;
        face.units_per_EM = face.header.Units_Per_EM;

        face.ascender  = face.horizontal.Ascender;
        face.descender = face.horizontal.Descender;

        face.height = (face.ascender - face.descender + face.horizontal.Line_Gap);

        if (face.ascender == 0 && face.descender == 0)
        {
            if (face.os2.version != 0xFFFF)
            {
                if (face.os2.sTypoAscender || face.os2.sTypoDescender)
                {
                    face.ascender  = face.os2.sTypoAscender;
                    face.descender = face.os2.sTypoDescender;

                    face.height = (face.ascender - face.descender + face.os2.sTypoLineGap);
                }
                else
                {
                    face.ascender  = face.os2.usWinAscent;
                    face.descender = -face.os2.usWinDescent;

                    face.height = (face.ascender - face.descender);
                }
            }
        }

        face.max_advance_width  = face.horizontal.advance_Width_Max;
        face.max_advance_height = ((face.vertical_info != 0) ? face.vertical.advance_Height_Max : face.height);

        face.underline_position  = face.postscript.underlinePosition - parseInt(face.postscript.underlineThickness / 2);
        face.underline_thickness = face.postscript.underlineThickness;
    }
    return error;
}
function sfnt_done_face()
{
}

function sfnt_find_encoding(platform_id, encoding_id)
{
    switch (platform_id)
    {
        case FT_Common.TT_PLATFORM_ISO:
        {
            return FT_Common.FT_ENCODING_UNICODE;
        }
        case FT_Common.TT_PLATFORM_APPLE_UNICODE:
        {
            return FT_Common.FT_ENCODING_UNICODE;
        }
        case FT_Common.TT_PLATFORM_MACINTOSH:
        {
            if (FT_Common.TT_MAC_ID_ROMAN == encoding_id)
                return FT_Common.FT_ENCODING_APPLE_ROMAN;
            break;
        }
        case FT_Common.TT_PLATFORM_MICROSOFT:
        {
            if (FT_Common.TT_MS_ID_SYMBOL_CS == encoding_id)
                return FT_Common.FT_ENCODING_MS_SYMBOL;
            if (FT_Common.TT_MS_ID_UCS_4 == encoding_id)
                return FT_Common.FT_ENCODING_UNICODE;
            if (FT_Common.TT_MS_ID_UNICODE_CS == encoding_id)
                return FT_Common.FT_ENCODING_UNICODE;
            if (FT_Common.TT_MS_ID_SJIS == encoding_id)
                return FT_Common.FT_ENCODING_SJIS;
            if (FT_Common.TT_MS_ID_GB2312 == encoding_id)
                return FT_Common.FT_ENCODING_GB2312;
            if (FT_Common.TT_MS_ID_BIG_5 == encoding_id)
                return FT_Common.FT_ENCODING_BIG5;
            if (FT_Common.TT_MS_ID_WANSUNG == encoding_id)
                return FT_Common.FT_ENCODING_WANSUNG;
            if (FT_Common.TT_MS_ID_JOHAB == encoding_id)
                return FT_Common.FT_ENCODING_JOHAB;
            break;
        }
        default:
            break;
    }
    return FT_Common.FT_ENCODING_NONE;
}

function sfnt_open_font(stream, face)
{
    var error = 0;

    face.ttc_header.tag     = 0;
    face.ttc_header.version = 0;
    face.ttc_header.count   = 0;

    var offset = stream.pos;
    var tag = stream.ReadULong();
    error = FT_Error;
    FT_Error = 0;

    if (error != FT_Common.FT_Err_Ok)
      return error;

    if (tag != 0x00010000 && tag != FT_Common.TTAG_ttcf && tag != FT_Common.TTAG_OTTO &&
         tag != FT_Common.TTAG_true && tag != FT_Common.TTAG_typ1 && tag != 0x00020000)
        return FT_Common.FT_Err_Unknown_File_Format;

    face.ttc_header.tag = FT_Common.TTAG_ttcf;

    if (tag == FT_Common.TTAG_ttcf)
    {
        error = stream.EnterFrame(8);
        if (error != 0)
            return error;

        face.ttc_header.version = stream.GetLong();
        face.ttc_header.count = stream.GetLong();

        stream.ExitFrame();

        if (face.ttc_header.count == 0)
            return FT_Common.FT_Err_Invalid_Table;

        var ul = FT_Common.IntToUInt(face.ttc_header.count);
        if (ul > (stream.size / (28 + 4)))
            return FT_Common.FT_Err_Array_Too_Large;

        face.ttc_header.offsets = new Array(ul);
        error = stream.EnterFrame(4*ul);

        if (error != FT_Common.FT_Err_Ok)
            return error;

        for (var n = 0; n < ul; n++)
            face.ttc_header.offsets[n] = stream.GetULong();

        stream.ExitFrame();
    }
    else
    {
        face.ttc_header.version = 1 << 16;
        face.ttc_header.count = 1;

        face.ttc_header.offsets = new Array(1);
        face.ttc_header.offsets[0] = offset;
    }

    return error;
}

function _sfnt_interface()
{
    this.goto_table = tt_face_goto_table;

    this.init_face = sfnt_init_face;
    this.load_face = sfnt_load_face;
    this.done_face = sfnt_done_face;
    this.get_interface = sfnt_get_interface;
    
    this.load_any = tt_face_load_any;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.load_sfnt_header = tt_face_load_sfnt_header_stub;
    this.load_directory = tt_face_load_directory_stub;
    //#endif

    this.load_head = tt_face_load_head;
    this.load_hhea = tt_face_load_hhea;
    this.load_cmap = tt_face_load_cmap;
    this.load_maxp = tt_face_load_maxp;
    this.load_os2 = tt_face_load_os2;
    this.load_post = tt_face_load_post;

    this.load_name = tt_face_load_name;
    this.free_name = tt_face_free_name;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.load_hdmx_stub = tt_face_load_hdmx_stub;
    this.free_hdmx_stub = tt_face_free_hdmx_stub;
    //#endif

    this.load_kern = tt_face_load_kern;

    this.load_gasp = tt_face_load_gasp;
    this.load_pclt = tt_face_load_pclt;

    this.load_bhed = tt_face_load_bhed;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_sbit_strike_stub = tt_face_set_sbit_strike_stub;
    this.load_sbits_stub = tt_face_load_sbit_stub;

    this.find_sbit_image = tt_find_sbit_image;
    this.load_sbit_metrics = tt_load_sbit_metrics;
    //#endif

    this.load_sbit_image = tt_face_load_sbit_image;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.free_sbits_stub = tt_face_free_sbit_stub;
    //#endif

    this.get_psname = tt_face_get_ps_name;
    this.free_psnames = tt_face_free_ps_names;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.load_charmap_stub = tt_face_load_charmap_stub;
    this.free_charmap_stub = tt_face_free_charmap_stub;
    //#endif

    this.get_kerning = tt_face_get_kerning;

    this.load_font_dir = tt_face_load_font_dir;
    this.load_hmtx = tt_face_load_hmtx;

    this.load_eblc = tt_face_load_eblc;
    this.free_eblc = tt_face_free_eblc;

    this.set_sbit_strike = tt_face_set_sbit_strike;
    this.load_strike_metrics = tt_face_load_strike_metrics;

    this.get_metrics = tt_face_get_metrics;
}
var sfnt_interface = new _sfnt_interface();

/******************************************************************************/
// pic
/******************************************************************************/
var FT_SFNT_SERVICES_GET            = sfnt_services;
var FT_SFNT_SERVICE_GLYPH_DICT_GET  = sfnt_service_glyph_dict;
var FT_SFNT_SERVICE_PS_NAME_GET     = sfnt_service_ps_name;
var FT_TT_SERVICE_GET_CMAP_INFO_GET = tt_service_get_cmap_info;
var FT_TT_CMAP_CLASSES_GET          = tt_cmap_classes;
var FT_SFNT_SERVICE_SFNT_TABLE_GET  = sfnt_service_sfnt_table;
var FT_SFNT_SERVICE_BDF_GET         = sfnt_service_bdf;
var FT_SFNT_INTERFACE_GET           = sfnt_interface;

function sfnt_get_interface(module,name)
{
    return ft_service_list_lookup(FT_SFNT_SERVICES_GET, name);
}

function create_sfnt_module(library)
{
    var sfnt_mod = new FT_Module();
    sfnt_mod.clazz = new FT_Module_Class();

    var clazz = sfnt_mod.clazz;
    clazz.flags = 0;
    clazz.name = "sfnt";
    clazz.version = 0x10000;
    clazz.requires = 0x20000;

    clazz.module_interface = FT_SFNT_INTERFACE_GET;
    clazz.init = null;
    clazz.done = null;

    clazz.get_interface = sfnt_get_interface;

    sfnt_mod.library = library;
    sfnt_mod.memory = library.Memory;
    sfnt_mod.generic = null;

    return sfnt_mod;
}

