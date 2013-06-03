/******************************************************************************/
// cidgload
/******************************************************************************/
function cid_load_glyph(decoder, glyph_index)
{
    var face = decoder.builder.face;
    var cid  = face.cid;
    var memory = face.memory;
    var fd_select;
    var stream       = face.cid_stream;
    var error        = 0;
    var charstring   = null;
    var glyph_length = 0;
    var psaux = face.psaux;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    var inc = face.internal.incremental_interface;
    //#endif

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (inc != null)
    {
        var glyph_data = new FT_Data();

        error = inc.funcs.get_glyph_data(inc.object, glyph_index, glyph_data);
        if (error != 0)
            return error;

        var p = glyph_data.pointer;
        fd_select = cid_get_offset(p, cid.fd_bytes);

        if (glyph_data.length != 0)
        {
            glyph_length = glyph_data.length - cid.fd_bytes;
            charstring = memory.Alloc(glyph_length);

            var _data = glyph_data.pointer.data;
            var _start = glyph_data.pointer.pos + cid.fd_bytes;
            for (var i = 0; i < glyph_length; i++)
                charstring[i] = _data[_start + i];
        }

        inc.funcs.free_glyph_data(inc.object, glyph_data);
        glyph_data = null;
    }
    else
    {
        //#endif /* FT_CONFIG_OPTION_INCREMENTAL */
        var entry_len = cid.fd_bytes + cid.gd_bytes;

        error = stream.Seek(cid.data_offset + cid.cidmap_offset + glyph_index * entry_len);
        if (error != 0)
            return error;

        error = stream.EnterFrame(2 * entry_len);
        if (error != 0)
            return error;

        var p = new CPointer();
        p.data = stream.data;
        p.pos = stream.cur;
        fd_select = cid_get_offset(p, cid.fd_bytes);
        var off1 = cid_get_offset(p, cid.gd_bytes);
        p.pos += cid.fd_bytes;
        glyph_length = cid_get_offset(p, cid.gd_bytes) - off1;

        stream.ExitFrame();

        if (fd_select >= cid.num_dicts)
            return FT_Common.FT_Err_Invalid_Offset;
        if (glyph_length == 0)
            return error;

        charstring = memory.Alloc(glyph_length);
        error = stream.ReadAt(cid.data_offset + off1, charstring, glyph_length);
        if (error != 0)
            return error;
    }

    var cid_subrs = face.subrs[fd_select];


    /* Set up subrs */
    decoder.num_subrs = cid_subrs.num_subrs;
    decoder.subrs     = cid_subrs.code;
    decoder.subrs_len = 0;

    /* Set up font matrix */
    var dict = cid.font_dicts[fd_select];

    decoder.font_matrix = dublicate_matrix(dict.font_matrix);
    decoder.font_offset = dublicate_vector(dict.font_offset);
    decoder.lenIV       = dict.private_dict.lenIV;

    /* Decode the charstring. */

    /* Adjustment for seed bytes. */
    var cs_offset = (decoder.lenIV >= 0 ? decoder.lenIV : 0);

    /* Decrypt only if lenIV >= 0. */
    if (decoder.lenIV >= 0)
        psaux.t1_decrypt(charstring, glyph_length, 4330);

    error = decoder.funcs.parse_charstrings(decoder, charstring + cs_offset, glyph_length - cs_offset);
    charstring = null;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (!error && inc && inc.funcs.get_glyph_metrics)
    {
        var metrics = new FT_Incremental_MetricsRec();

        metrics.bearing_x = (FT_RoundFix(decoder.builder.left_bearing.x) >> 16);
        metrics.bearing_y = 0;
        metrics.advance   = (FT_RoundFix(decoder.builder.advance.x) >> 16);
        metrics.advance_v = (FT_RoundFix(decoder.builder.advance.y) >> 16);

        error = inc.funcs.get_glyph_metrics(inc.object, glyph_index, false, metrics);

        decoder.builder.left_bearing.x = (metrics.bearing_x << 16);
        decoder.builder.advance.x      = (metrics.advance << 16);
        decoder.builder.advance.y      = (metrics.advance_v << 16);
    }
    //#endif /* FT_CONFIG_OPTION_INCREMENTAL */

    return error;
}

function cid_slot_load_glyph(glyph, cidsize, glyph_index, load_flags)
{
    var error = null;
    var decoder = new T1_DecoderRec();
    var face = glyph.face;

    var psaux = face.psaux;

    if (glyph_index >= face.num_glyphs)
        return FT_Common.FT_Err_Invalid_Argument;

    if (load_flags & FT_Common.FT_LOAD_NO_RECURSE)
        load_flags |= (FT_Common.FT_LOAD_NO_SCALE | FT_Common.FT_LOAD_NO_HINTING);

    glyph.x_scale = cidsize.metrics.x_scale;
    glyph.y_scale = cidsize.metrics.y_scale;

    glyph.outline.n_points   = 0;
    glyph.outline.n_contours = 0;

    var hinting = ((load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0 && (load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0) ? 1 : 0;
    glyph.format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

    error = psaux.t1_decoder_funcs.init(decoder, glyph.face, cidsize, glyph, null, null, hinting, FT_LOAD_TARGET_MODE(load_flags), cid_load_glyph);
    if (error != 0)
        return error;

    /* TODO: initialize decoder.len_buildchar and decoder.buildchar */
    /*       if we ever support CID-keyed multiple master fonts     */

    /* set up the decoder */
    decoder.builder.no_recurse = ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0);

    error = cid_load_glyph(decoder, glyph_index);
    if (error != 0)
        return error;

    var font_matrix = dublicate_matrix(decoder.font_matrix);
    var font_offset = dublicate_vector(decoder.font_offset);

    /* save new glyph tables */
    psaux.t1_decoder_funcs.done(decoder);
    decoder = null;

    /* now set the metrics -- this is rather simple, as    */
    /* the left side bearing is the xMin, and the top side */
    /* bearing the yMax                                    */
    glyph.outline.flags &= FT_Common.FT_OUTLINE_OWNER;
    glyph.outline.flags |= FT_Common.FT_OUTLINE_REVERSE_FILL;

    /* for composite glyphs, return only left side bearing and */
    /* advance width                                           */
    if (load_flags & FT_Common.FT_LOAD_NO_RECURSE)
    {
        var internal = glyph.internal;

        glyph.metrics.horiBearingX = (FT_RoundFix(decoder.builder.left_bearing.x) >> 16);
        glyph.metrics.horiAdvance = (FT_RoundFix(decoder.builder.advance.x) >> 16);

        internal.glyph_matrix      = dublicate_matrix(font_matrix);
        internal.glyph_delta       = dublicate_vector(font_offset);
        internal.glyph_transformed = 1;
    }
    else
    {
        var metrics = glyph.metrics;

        /* copy the _unscaled_ advance width */
        metrics.horiAdvance = (FT_RoundFix(decoder.builder.advance.x) >> 16);
        glyph.linearHoriAdvance = (FT_RoundFix(decoder.builder.advance.x) >> 16);
        glyph.internal.glyph_transformed = 0;

        /* make up vertical ones */
        metrics.vertAdvance = (face.cid.font_bbox.yMax - face.cid.font_bbox.yMin) >> 16;
        glyph.linearVertAdvance = metrics.vertAdvance;
        glyph.format            = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

        if (cidsize.metrics.y_ppem < 24)
            cidglyph.outline.flags |= FT_Common.FT_OUTLINE_HIGH_PRECISION;

        /* apply the font matrix */
        FT_Outline_Transform(glyph.outline, font_matrix);
        FT_Outline_Translate(glyph.outline, font_offset.x, font_offset.y);

        var advance = new FT_Vector();
        advance.x = metrics.horiAdvance;
        advance.y = 0;
        FT_Vector_Transform(advance, font_matrix);
        metrics.horiAdvance = advance.x + font_offset.x;

        advance.x = 0;
        advance.y = metrics.vertAdvance;
        FT_Vector_Transform(advance, font_matrix);
        metrics.vertAdvance = advance.y + font_offset.y;

        if ((load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
        {
            /* scale the outline and the metrics */
            var cur = decoder.builder.base;
            var vec = cur.points;
            var x_scale = glyph.x_scale;
            var y_scale = glyph.y_scale;

            /* First of all, scale the points */
            if (!hinting || decoder.builder.hints_funcs == null)
            {
                for (var n = cur.n_points; n > 0; n--, vec++)
                {
                    cur.points[vec].x = FT_MulFix(cur.points[vec].x, x_scale);
                    cur.points[vec].y = FT_MulFix(cur.points[vec].y, y_scale);
                }
            }

            /* Then scale the metrics */
            metrics.horiAdvance = FT_MulFix(metrics.horiAdvance, x_scale);
            metrics.vertAdvance = FT_MulFix(metrics.vertAdvance, y_scale);
        }

        /* compute the other metrics */
        var cbox = new FT_BBox();
        FT_Outline_Get_CBox(glyph.outline, cbox);

        metrics.width  = cbox.xMax - cbox.xMin;
        metrics.height = cbox.yMax - cbox.yMin;

        metrics.horiBearingX = cbox.xMin;
        metrics.horiBearingY = cbox.yMax;

        if (load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT)
        {
            /* make up vertical ones */
            ft_synthesize_vertical_metrics(metrics, metrics.vertAdvance);
        }
    }

    return error;
}

/******************************************************************************/
// cidparse
/******************************************************************************/
function CID_Parser()
{
    this.root = new PS_ParserRec();
    this.stream = null;

    this.postscript = null;
    this.postscript_len = 0;

    this.data_offset = 0;
    this.binary_length = 0;

    this.cid = null;
    this.num_dict = 0;

    this.clear = function()
    {
        this.root.cursor = 0;
        this.root.base = null;
        this.root.limit = 0;
        this.root.error = 0;
        this.root.memory = null;

        this.funcs = null;

        this.stream = null;

        this.postscript = null;
        this.postscript_len = 0;

        this.data_offset = 0;
        this.binary_length = 0;

        this.cid = null;
        this.num_dict = 0;
    }
}

function cid_parser_new(parser, stream, memory, psaux)
{
    parser.clear();
    psaux.ps_parser_funcs.init(parser.root, null, 0, memory);

    parser.stream = stream;

    var base_offset = stream.pos;
    var offset = 0;

    /* first of all, check the font format in the header */
    var error = stream.EnterFrame(31);
    if (error != 0)
        return error;

    var cur_str = stream.GetString1(31);
    if (cur_str != "%!PS-Adobe-3.0 Resource-CIDFont")
        return FT_Common.FT_Err_Unknown_File_Format;

    stream.ExitFrame();

    /* now, read the rest of the file until we find */
    /* `StartData' or `/sfnts'                      */
    var limit = 0;
    while (true)
    {
        var buffer = memory.Alloc(256 + 10);
        var read_len = 256 + 10; /* same as signed FT_Stream->size */
        var p = dublicate_pointer(buffer);

        for (offset = stream.pos; ; offset += 256)
        {
            var stream_len = stream.size - stream.pos;/* same as signed FT_Stream->size */
            if (stream_len == 0)
                return FT_Common.FT_Err_Unknown_File_Format;

            read_len = Math.min(read_len, stream_len);

            error = stream.Read(p, read_len);
            if (error != 0)
                return error;

            if (read_len < 256)
                p[read_len] = FT_Common.SYMBOL_CONST_S0;

            limit = p.pos + read_len - 10;

            p.pos = buffer.pos;

            var bIsGoToFound = 0;
            for (; p.pos < limit; p.pos++)
            {
                if ((p.data[p.pos] == FT_Common.SYMBOL_CONST_S) && (_strncmp_data(p, "StartData", 9) == 0))
                {
                    /* save offset of binary data after `StartData' */
                    offset += (p.pos - buffer.pos + 10);
                    bIsGoToFound = 1;
                    break;
                }
                else if ((p.data[p.pos + 1] == FT_Common.SYMBOL_CONST_s) && (_strncmp_data(p, "/sfnts", 6) == 0))
                {
                    offset += (p.pos - buffer.pos + 7);
                    bIsGoToFound = 1;
                    break;
                }
            }

            if (bIsGoToFound == 1)
                break;

            var _dd = p.data;
            var __s1 = buffer.pos;
            var __s2 = p.pos;

            var arr_move = memory.Alloc(10);
            for (var i = 0; i < 10; i++)
                arr_move[i] = _dd[__s2 + i];

            for (var i = 0; i < 10; i++)
                _dd[__s1 + i] = arr_move[i];

            arr_move = null;

            read_len = 256;
            p.pos = buffer.pos + 10;
        }

        /* We have found the start of the binary data or the `/sfnts' token. */
        /* Now rewind and extract the frame corresponding to this PostScript */
        /* section.                                                          */
        var ps_len = offset - base_offset;

        error = stream.Seek(base_offset);
        if (error != 0)
            return error;

        parser.postscript = new CPointer();
        error = stream.ExtractFrame(ps_len, parser.postscript);

        if (error != 0)
            return error;

        parser.data_offset    = offset;
        parser.postscript_len = ps_len;
        parser.root.base      = dublicate_pointer(parser.postscript);
        parser.root.cursor    = 0;
        parser.root.limit     = parser.postscript.pos + ps_len;
        parser.num_dict       = -1;

        /* Finally, we check whether `StartData' or `/sfnts' was real --  */
        /* it could be in a comment or string.  We also get the arguments */
        /* of `StartData' to find out whether the data is represented in  */
        /* binary or hex format.                                          */

        var arg1 = dublicate_pointer(parser.root.base);
        arg1.pos += parser.root.cursor;
        parser.root.funcs.skip_PS_token(p.root);
        parser.root.funcs.skip_spaces(p.root);

        var arg2 = dublicate_pointer(parser.root.base);
        arg2.pos += parser.root.cursor;
        parser.root.funcs.skip_PS_token(p.root);
        parser.root.funcs.skip_spaces(p.root);

        limit = parser.root.limit;
        var cur = dublicate_pointer(parser.root.base);
        cur.pos += parser.root.cursor;

        while (cur.pos < limit)
        {
            if (parser.root.error != 0)
                return parser.root.error;

            if ((cur.data[cur.pos] == FT_Common.SYMBOL_CONST_S) && (_strncmp_data(cur, "StartData", 9) == 0))
            {
                if (_strncmp_data(arg1, "(Hex)", 5) == 0)
                {
                    var _num_s = "";
                    var ii = 0;
                    while (true)
                    {
                        if (arg2.data[arg2.pos + ii] == FT_Common.SYMBOL_CONST_S0)
                            break;
                        _num_s += String.fromCharCode(arg2.data[arg2.pos + ii]);
                    }
                    parser.binary_length = parseInt(_num_s);
                }

                limit = parser.root.limit;
                cur.pos = parser.root.base.pos + parser.root.cursor;
                return error;
            }
            else if ((cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_s) && (_strncmp_data(cur, "/sfnts", 6) == 0))
            {
                return FT_Common.FT_Err_Unknown_File_Format;
            }

            parser.root.funcs.skip_PS_token(p.root);
            parser.root.funcs.skip_spaces(p.root);

            arg1.pos = arg2.pos;
            arg2.pos = cur.pos;
            cur.pos = parser.root.base.pos + parser.root.cursor;
        }

        /* we haven't found the correct `StartData'; go back and continue */
        /* searching                                                      */
        stream.ReleaseFrame();
        parser.postscript = null;

        error = stream.Seek(offset);
        if (error != 0)
            break;
    }

    return error;
}

function cid_parser_done(parser)
{
    /* always free the private dictionary */
    if (parser.postscript != null)
    {
        parser.stream.ReleaseFrame();
        parser.postscript = null;
    }
    parser.root.funcs.done(parser.root);
}


/******************************************************************************/
// cidload
/******************************************************************************/
function CID_Loader()
{
    this.parser = new CID_Parser();
    this.num_chars = 0;

    this.clear = function()
    {
        this.parser.clear();
        this.num_chars = 0;
    }
}

function cid_get_offset(start, offsize)
{
    var result = 0;
    for (; offsize > 0; offsize--)
    {
        result <<= 8;
        result |= start.data[start.pos++];
    }
    return result;
}
function cid_load_keyword(face, loader, keyword)
{
    var error = 0;
    var parser = loader.parser;
    var object = null;
    var cid = face.cid;

    if (keyword.type == FT_Common.T1_FIELD_TYPE_CALLBACK)
    {
        keyword.reader(face, parser);
        error = parser.error;
        return error;
    }

    switch (keyword.location)
    {
        case FT_Common.T1_FIELD_LOCATION_CID_INFO:
            object = cid;
            break;
        case FT_Common.T1_FIELD_LOCATION_FONT_INFO:
            object = cid.font_info;
            break;
        case FT_Common.T1_FIELD_LOCATION_FONT_EXTRA:
            object = face.font_extra;
            break;
        case FT_Common.T1_FIELD_LOCATION_BBOX:
            object = cid.font_bbox;
            break;
        default:
        {
            if (parser.num_dict < 0 || parser.num_dict >= cid.num_dicts)
                return FT_Error.FT_Err_Syntax_Error;

            var dict = cid.font_dicts[parser.num_dict];
            switch (keyword.location)
            {
                case FT_Common.T1_FIELD_LOCATION_PRIVATE:
                    object = dict.private_dict;
                    break;
                default:
                    object = dict;
            }
        }
    }

    var dummy_object = new Array(1);
    dummy_object[0] = object;

    if (keyword.type == FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY || keyword.type == FT_Common.T1_FIELD_TYPE_FIXED_ARRAY)
        error = loader.parser.root.funcs.load_field_table(loader.parser.root, keyword, dummy_object, 0, 0);
    else
        error = loader.parser.root.funcs.load_field(loader.parser.root, keyword, dummy_object, 0, 0);

    return error;
}

function parse_font_matrix(face, parser)
{
    var temp = new Array(6);
    if (parser.num_dict >= 0 && parser.num_dict < face.cid.num_dicts)
    {
        var dict = face.cid.font_dicts[parser.num_dict];
        var matrix = dict.font_matrix;
        var offset = dict.font_offset;

        parser.root.funcs.to_fixed_array(parser.root, 6, temp, 3);

        var temp_scale = Math.abs(temp[3]);

        /* Set units per EM based on FontMatrix values.  We set the value to */
        /* `1000/temp_scale', because temp_scale was already multiplied by   */
        /* 1000 (in `t1_tofixed', from psobjs.c).                            */
        face.units_per_EM = (FT_DivFix(0x10000, FT_DivFix(temp_scale, 1000)));
        if (face.units_per_EM > 0xFFFF)
            face.units_per_EM = 0xFFFF;

        /* we need to scale the values by 1.0/temp[3] */
        if (temp_scale != 0x10000)
        {
            temp[0] = FT_DivFix(temp[0], temp_scale);
            temp[1] = FT_DivFix(temp[1], temp_scale);
            temp[2] = FT_DivFix(temp[2], temp_scale);
            temp[4] = FT_DivFix(temp[4], temp_scale);
            temp[5] = FT_DivFix(temp[5], temp_scale);
            temp[3] = 0x10000;
        }

        matrix.xx = temp[0];
        matrix.yx = temp[1];
        matrix.xy = temp[2];
        matrix.yy = temp[3];

        /* note that the font offsets are expressed in integer font units */
        offset.x  = temp[4] >> 16;
        offset.y  = temp[5] >> 16;
    }

    return 0;
}

function parse_fd_array(face, parser)
{
    var cid = face.cid;
    var error = 0;

    var num_dicts = parser.root.funcs.to_int(parser.root);

    if (cid.font_dicts == null)
    {
        cid.font_dicts = new Array(num_dicts);
        for (var i = 0; i < num_dicts; i++)
        {
            cid.font_dicts[i] = new CID_FaceDictRec();
            cid.font_dicts[i].private_dict.lenIV = 4;
        }
        cid.num_dicts = num_dicts;
    }
    return error;
}

function parse_expansion_factor(face, parser)
{
    if (parser.num_dict >= 0 && parser.num_dict < face.cid.num_dicts)
    {
        var dict = face.cid.font_dicts[parser.num_dict];

        dict.expansion_factor              = parser.root.funcs.to_fixed(parser.root, 0);
        dict.private_dict.expansion_factor = dict.expansion_factor;
    }
    return 0;
}

function cid_parse_dict(face, loader, base, size)
{
    var parser = loader.parser;

    parser.root.cursor = dublicate_pointer(base);
    parser.root.limit  = base.pos + size;
    parser.root.error  = 0;

    var cur = dublicate_pointer(base);
    var limit = cur.pos + size;

    var newlimit = 0;

    while (true)
    {
        parser.root.cursor = cur.pos;
        parser.root.funcs.skip_spaces(parser.root);

        if (parser.root.cursor.pos >= limit)
            newlimit = limit - 1 - 17;
        else
            newlimit = parser.root.cursor.pos - 17;

        /* look for `%ADOBeginFontDict' */
        for (; cur.pos < newlimit; cur.pos++)
        {
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_MATH_3 && _strncmp_data(cur, "%ADOBeginFontDict", 17) == 0)
            {
                /* if /FDArray was found, then cid->num_dicts is > 0, and */
                /* we can start increasing parser->num_dict               */
                if (face.cid.num_dicts > 0)
                    parser.num_dict++;
            }
        }

        cur.pos = parser.root.cursor.pos;
        /* no error can occur in cid_parser_skip_spaces */
        if (cur.pos >= limit)
            break;

        parser.root.funcs.skip_PS_token(parser.root);
        if (parser.root.cursor.pos >= limit || parser.root.error != 0)
            break;

        /* look for immediates */
        if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS && cur.pos + 2 < limit)
        {
            cur.pos++;
            var len = parser.root.cursor.pos - cur.pos;

            if (len > 0 && len < 22)
            {
                /* now compare the immediate name to the keyword table */
                var keyword = 0;
                var keywords_count = cid_field_records.length;

                while (true)
                {
                    if (keyword >= keywords_count)
                        break;

                    var _key = cid_field_records[keyword];

                    if (cur.data[cur.pos] == _key.ident.charCodeAt(0) && len == _key.ident.length)
                    {
                        var n;
                        for (n = 1; n < len; n++)
                            if (cur.data[cur.pos + n] != _key.ident.charCodeAt(n))
                                break;

                        if (n >= len)
                        {
                            /* we found it - run the parsing callback */
                            parser.root.error = cid_load_keyword(face, loader, keyword);
                            if (parser.root.error)
                                return parser.root.error;
                            break;
                        }
                    }
                    keyword++;
                }
            }
        }

        cur.pos = parser.root.cursor.pos;
    }
    return parser.root.error;
}

function cid_read_subrs(face)
{
    var cid = face.cid;
    var memory = face.memory;
    var stream = face.cid_stream;
    var error = 0;
    var n = 0;

    var _num_dicts = cid.num_dicts;
    face.subrs = new Array(_num_dicts);
    var subrs = face.subrs;

    for (n = 0; n < _num_dicts; n++)
        subrs[n] = new CID_SubrsRec();

    var subr = 0;
    var max_offsets = 0;
    var offsets = new Array();
    var psaux = face.psaux;

    for (n = 0; n < _num_dicts; n++, subr++)
    {
        var dict = cid.font_dicts[n];
        var lenIV = dict.private_dict.lenIV;
        var count, num_subrs = dict.num_subrs;

        /* Check for possible overflow. */
        if (num_subrs == 0xFFFFFFFF)
        {
            face.subrs = null;
            offsets = null;
            return FT_Common.FT_Err_Syntax_Error;
        }

        /* reallocate offsets array if needed */
        if (num_subrs + 1 > max_offsets)
        {
            var new_max = (num_subrs + 4) & (~3);

            if ( new_max <= max_offsets )
            {
                face.subrs = null;
                offsets = null;
                return FT_Common.FT_Err_Syntax_Error;
            }

            for (var i = max_offsets; i < new_max; i++)
                offsets[i] = 0;

            max_offsets = new_max;
        }

        /* read the subrmap's offsets */
        error = stream.Seek(cid.data_offset + dict.subrmap_offset);
        if (error == 0)
            error = stream.EnterFrame((num_subrs + 1) * dict.sd_bytes);

        if (error != 0)
        {
            face.subrs = null;
            offsets = null;
            return error;
        }

        var p = new CPointer;
        p.data = stream.data;
        p.pos = stream.cur;
        for (count = 0; count <= num_subrs; count++)
            offsets[count] = cid_get_offset(p, dict.sd_bytes);

        stream.ExitFrame();

        /* offsets must be ordered */
        for (count = 1; count <= num_subrs; count++)
        {
            if (offsets[count - 1] > offsets[count])
            {
                face.subrs = null;
                offsets = null;
                return error;
            }
        }

        /* now, compute the size of subrs charstrings, */
        /* allocate, and read them                     */
        var data_len = offsets[num_subrs] - offsets[0];

        subrs[subr].code = new Array(num_subrs + 1);
        subrs[subr].code[0] = memory.Alloc(data_len);

        error = stream.Seek(cid.data_offset + offsets[0]);
        if (error == 0)
            error = stream.Read(subrs[subr].code[0], data_len);

        if (error != 0)
        {
            face.subrs = null;
            offsets = null;
            return error;
        }

        /* set up pointers */
        for (count = 1; count <= num_subrs; count++)
        {
            var len = offsets[count] - offsets[count - 1];
            subrs[subr].code[count] = subrs[subr].code[count - 1] + len;
        }

        /* decrypt subroutines, but only if lenIV >= 0 */
        if (lenIV >= 0)
        {
            for (count = 0; count < num_subrs; count++)
            {
                var len = offsets[count + 1] - offsets[count];
                psaux.t1_decrypt(subrs[subr].code[count], len, 4330);
            }
        }

        subrs[subr].num_subrs = num_subrs;
    }

    offsets = null;
    return error;
}

function t1_init_loader(loader, face)
{
    loader.clear();
}
function t1_done_loader(loader)
{
    cid_parser_done(loader.parser);
}

function cid_hex_to_binary(data, data_len, offset, face)
{
    var stream = face.stream;

    var error = stream.Seek(offset);
    if (error != 0)
        return error;

    var buffer = face.memoty.Alloc(256);
    var val = null;

    var d = dublicate_pointer(data);
    var dlimit = d.pos + data_len;
    var p = dublicate_pointer(buffer);
    var plimit = p.pos;

    var upper_nibble = 1;
    var done = 0;

    while (d.pos < dlimit)
    {
        if (p.pos >= plimit)
        {
            var oldpos = stream.pos;
            var size = stream.size - oldpos;

            if (size == 0)
                return FT_Common.FT_Err_Syntax_Error;

            error = stream.Read(buffer, (256 > size) ? size : 256);
            if (error != 0)
                return error;

            p.pos = buffer.pos;
            plimit = p.pos + stream.pos - oldpos;
        }

        var _p = p.data[p.pos];
        if (_p >= FT_Common.SYMBOL_CONST_0 && _p <= FT_Common.SYMBOL_CONST_9)
            val = _p - FT_Common.SYMBOL_CONST_0;
        else if (_p >= FT_Common.SYMBOL_CONST_a && _p <= FT_Common.SYMBOL_CONST_f)
            val = _p - FT_Common.SYMBOL_CONST_a;
        else if (_p >= FT_Common.SYMBOL_CONST_A && _p <= FT_Common.SYMBOL_CONST_F)
            val = _p - FT_Common.SYMBOL_CONST_A + 10;
        else if (_p == FT_Common.SYMBOL_CONST_SPACE || _p == FT_Common.SYMBOL_CONST_ST ||
            _p == FT_Common.SYMBOL_CONST_SR || _p == FT_Common.SYMBOL_CONST_SN ||
            _p == FT_Common.SYMBOL_CONST_SF || _p == FT_Common.SYMBOL_CONST_S0)
        {
            p.pos++;
            continue;
        }
        else if (_p == FT_Common.SYMBOL_CONST_MATH_2)
        {
            val  = 0;
            done = 1;
        }
        else
        {
            return FT_Common.FT_Err_Syntax_Error;
        }

        if (upper_nibble == 1)
            d.data[d.pos] = (val << 4) & 0xFF;
        else
        {
            d.data[d.pos] = (d.data[d.pos] + val) & 0xFF;
            d.pos++;
        }

        upper_nibble = (1 - upper_nibble);

        if (done == 1)
            break;

        p.pos++;
    }

    return 0;
}

function cid_face_open(face, face_index)
{
    var loader = new CID_Loader();
    var memory = face.memory;

    t1_init_loader(loader, face);

    var parser = loader.parser;
    var error = cid_parser_new(parser, face.stream, memory, face.psaux);
    if (error != 0)
    {
        t1_done_loader(loader);
        return error;
    }

    error = cid_parse_dict(face, loader, parser.postscript, parser.postscript_len);
    if (error != 0)
    {
        return error;
    }

    if (face_index < 0)
    {
        t1_done_loader(loader);
        return error;
    }

    if (parser.binary_length != 0)
    {
        face.binary_data = memory.Alloc(parser.binary_length);
        /* we must convert the data section from hexadecimal to binary */
        error = cid_hex_to_binary(face.binary_data, parser.binary_length, parser.data_offset, face);
        if (error != 0)
        {
            t1_done_loader(loader);
            return error;
        }

        face.cid_stream = new FT_Stream(face.binary_data.data, parser.binary_length);
        face.cid.data_offset = 0;
    }
    else
    {
        face.cid_stream = new FT_Stream(face.stream.data, face.stream.size);
        face.cid.data_offset = loader.parser.data_offset;
    }

    error = cid_read_subrs(face);

    t1_done_loader(loader);
    return error;
}

/******************************************************************************/
// objs
/******************************************************************************/
function CID_SizeRec()
{
    this.root = new FT_Size();
    this.valid = 0;
}

function CID_GlyphSlotRec()
{
    this.root = new FT_GlyphSlot();

    this.hint = 0;
    this.scaled = 0;

    this.x_scale = 0;
    this.y_scale = 0;
}

function cid_slot_done(_slot)
{
    var slot = (slot.hint == undefined) ? _slot : _slot.root;
    slot.internal.glyph_hints = null;
}

function cid_slot_init(_slot)
{
    var slot = (slot.hint == undefined) ? _slot : _slot.root;

    var face     = slot.face;
    var pshinter = face.pshinter;

    if (pshinter != null)
    {
        var module = slot.face.driver.library.FT_Get_Module("pshinter");
        if (module != null)
        {
            // пока нет хинтов - нету и этого if'а
            slot.internal.glyph_hints = pshinter.get_t1_funcs(module);
        }
    }

    return 0;
}

function cid_size_get_globals_funcs(size)
{
    var face = size.root.face;
    var pshinter = face.pshinter;

    var module = size.face.driver.library.FT_Get_Module("pshinter");
    return (module && pshinter && pshinter.get_globals_funcs) ? pshinter.get_globals_funcs(module) : null;
}

function cid_size_done(size)
{
    if (size.root.internal != null)
    {
        var funcs = cid_size_get_globals_funcs(size);
        if (funcs != null)
            funcs.destroy(size.root.internal);

        size.root.internal = 0;
    }
}

function cid_size_init(size)     /* CID_Size */
{
    var error = 0;
    var funcs = cid_size_get_globals_funcs(size);

    if (funcs != null)
    {
        var face = size.root.face;
        var dict = face.cid.font_dicts[face.face_index];
        var priv = dict.private_dict;

        var ret = funcs.create(size.root.face.memory, priv);
        error = ret.err;
        if (error == 0)
            size.internal = ret.globals;
    }

    return error;
}

function cid_size_request(size, req)
{
    FT_Request_Metrics(size.face, req);

    var funcs = cid_size_get_globals_funcs(size);

    if (funcs)
        funcs.set_scale(size.internal, size.metrics.x_scale, size.metrics.y_scale, 0, 0);

    return 0;
}

function cid_face_done(face)         /* CID_Face */
{
    if (face == null)
        return;

    var cid = face.cid;
    var info = cid.font_info;

    /* release subrs */
    face.subrs = null;

    /* release FontInfo strings */
    info.version = "";
    info.notice = "";
    info.full_name = "";
    info.family_name = "";
    info.weight = "";

    /* release font dictionaries */
    cid.font_dicts = null;
    cid.num_dicts = 0;

    /* release other strings */
    cid.cid_font_name = "";
    cid.registry = "";
    cid.ordering = "";

    face.family_name = "";
    face.style_name  = "";

    face.binary_data = null;
    face.cid_stream = null;
}

function cid_face_init(stream, face, face_index, num_params, params)
{
    face.num_faces = 1;

    var psaux = face.psaux;
    if (psaux == null)
    {
        psaux = face.driver.library.FT_Get_Module_Interface("psaux");
        face.psaux = psaux;
    }

    var pshinter = face.pshinter;
    if (pshinter == null)
    {
        pshinter = face.driver.library.FT_Get_Module_Interface("pshinter");
        face.pshinter = pshinter;
    }

    /* open the tokenizer; this will also check the font format */
    var error = stream.Seek(0);
    if (error != 0)
        return error;

    error = cid_face_open(face, face_index);
    if (error != 0)
        return error;

    /* if we just wanted to check the format, leave successfully now */
    if (face_index < 0)
        return error;

    /* check the face index */
    /* XXX: handle CID fonts with more than a single face */
    if (face_index != 0)
        return FT_Common.FT_Err_Invalid_Argument;
    
    /* now load the font program into the face object */
    /* initialize the face object fields */
    /* set up root face fields */
    var cid = face.cid;
    var info = cid.font_info;

    face.num_glyphs   = cid.cid_count;
    face.num_charmaps = 0;

    face.face_index = face_index;
    face.face_flags = FT_Common.FT_FACE_FLAG_SCALABLE | FT_Common.FT_FACE_FLAG_HORIZONTAL | FT_Common.FT_FACE_FLAG_HINTER;

    if (info.is_fixed_pitch)
        face.face_flags |= FT_Common.FT_FACE_FLAG_FIXED_WIDTH;

    /* XXX: TODO: add kerning with .afm support */

    /* get style name -- be careful, some broken fonts only */
    /* have a /FontName dictionary entry!                   */
    face.family_name = info.family_name;
    /* assume "Regular" style if we don't know better */
    face.style_name = "Regular";
    if (face.family_name != null)
    {
        var full   = info.full_name;
        var family = face.family_name;

        var full_ind = 0;
        var family_ind = 0;

        var full_count = 0;
        var family_count = 0;

        if (full != null)
        {
            while (full_ind < full_count)
            {
                if (full.charCodeAt(full_ind) == family.charCodeAt(family_ind))
                {
                    family_ind++;
                    full_ind++;
                }
                else
                {
                    if (full.charCodeAt(full_ind) == FT_Common.SYMBOL_CONST_SPACE || full.charCodeAt(full_ind) == FT_Common.SYMBOL_CONST_MATH_MINUS)
                        full_ind++;
                    else if (family.charCodeAt(family_ind) == FT_Common.SYMBOL_CONST_SPACE || family.charCodeAt(family_ind) == FT_Common.SYMBOL_CONST_MATH_MINUS)
                        family_ind++;
                    else
                    {
                        if (family_ind == family_count)
                            face.style_name = full;
                        break;
                    }
                }
            }
        }
    }
    else
    {
        /* do we have a `/FontName'? */
        if (cid.cid_font_name)
            face.family_name = cid.cid_font_name;
    }

    /* compute style flags */
    face.style_flags = 0;
    if (info.italic_angle)
        face.style_flags |= FT_Common.FT_STYLE_FLAG_ITALIC;
    if (info.weight != null)
    {
        if (info.weight == "Bold" || info.weight == "Black")
            face.style_flags |= FT_Common.FT_STYLE_FLAG_BOLD;
    }

    /* no embedded bitmap support */
    face.num_fixed_sizes = 0;
    face.available_sizes = 0;

    face.bbox.xMin = cid.font_bbox.xMin >> 16;
    face.bbox.yMin = cid.font_bbox.yMin >> 16;
    /* no `U' suffix here to 0xFFFF! */
    face.bbox.xMax = (cid.font_bbox.xMax + 0xFFFF) >> 16;
    face.bbox.yMax = (cid.font_bbox.yMax + 0xFFFF) >> 16;

    if (face.units_per_EM)
        face.units_per_EM = 1000;

    face.ascender  = face.bbox.yMax;
    face.descender = face.bbox.yMin;

    face.height = parseInt((face.units_per_EM * 12) / 10);
    if (face.height < face.ascender - face.descender)
        face.height = (face.ascender - face.descender);

    face.underline_position  = info.underline_position;
    face.underline_thickness = info.underline_thickness;

    return error;
}

function cid_driver_init(driver)
{
    return 0;
}

function cid_driver_done(driver)
{
}


/******************************************************************************/
// token
/******************************************************************************/
var cid_field_records = new Array(50);
// CID_FaceInfoRec
cid_field_records[0] = create_t1_field2("CIDFontName", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_KEY, function(obj, val, f) { obj.cid_font_name = val}, undefined);
cid_field_records[1] = create_t1_field2("CIDFontVersion", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_FIXED, function(obj, val, f) { obj.cid_version = val}, undefined);
cid_field_records[2] = create_t1_field2("CIDFontType", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.cid_font_type = val}, undefined);
cid_field_records[3] = create_t1_field2("Registry", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.registry = val}, undefined);
cid_field_records[4] = create_t1_field2("Ordering", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.ordering = val}, undefined);
cid_field_records[5] = create_t1_field2("Supplement", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.supplement = val}, undefined);
cid_field_records[6] = create_t1_field2("UIDBase", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.uid_base = val}, undefined);
cid_field_records[7] = create_t1_field2("CIDMapOffset", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.cidmap_offset = val}, undefined);
cid_field_records[8] = create_t1_field2("FDBytes", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.fd_bytes = val}, undefined);
cid_field_records[9] = create_t1_field2("GDBytes", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.gd_bytes = val}, undefined);
cid_field_records[10] = create_t1_field2("CIDCount", FT_Common.T1_FIELD_LOCATION_CID_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.cid_count = val}, undefined);

// PS_FontInfoRec
cid_field_records[11] = create_t1_field2("version", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.version = val}, undefined);
cid_field_records[12] = create_t1_field2("Notice", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.notice = val}, undefined);
cid_field_records[13] = create_t1_field2("FullName", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.full_name = val}, undefined);
cid_field_records[14] = create_t1_field2("FamilyName", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.family_name = val}, undefined);
cid_field_records[15] = create_t1_field2("Weight", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, function(obj, val, f) { obj.weight = val}, undefined);
cid_field_records[16] = create_t1_field2("ItalicAngle", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.italic_angle = val}, undefined);
cid_field_records[17] = create_t1_field2("isFixedPitch", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_BOOL, function(obj, val, f) { obj.is_fixed_pitch = val}, undefined);
cid_field_records[18] = create_t1_field2("UnderlinePosition", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.underline_position = val}, undefined);
cid_field_records[19] = create_t1_field2("UnderlineThickness", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.underline_thickness = val}, undefined);

// PS_FontExtraRec
cid_field_records[20] = create_t1_field2("FSType", FT_Common.T1_FIELD_LOCATION_FONT_EXTRA, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.fs_type = val}, undefined);

// CID_FaceDictRec
cid_field_records[21] = create_t1_field2("PaintType", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.paint_type = val & 0xFF }, undefined);
cid_field_records[22] = create_t1_field2("FontType", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.font_type = val & 0xFF}, undefined);
cid_field_records[23] = create_t1_field2("SubrMapOffset", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.subrmap_offset = val}, undefined);
cid_field_records[24] = create_t1_field2("SDBytes", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.sd_bytes = val}, undefined);
cid_field_records[25] = create_t1_field2("SubrCount", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.num_subrs = val}, undefined);
cid_field_records[26] = create_t1_field2("lenBuildCharArray", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.len_buildchar = val}, undefined);
cid_field_records[27] = create_t1_field2("ForceBoldThreshold", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_FIXED, function(obj, val, f) { obj.forcebold_threshold = val}, undefined);
cid_field_records[28] = create_t1_field2("StrokeWidth", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_FIXED, function(obj, val, f) { obj.stroke_width = val}, undefined);

// PS_PrivateRec
cid_field_records[29] = create_t1_field2("UniqueID", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.unique_id = val}, undefined);
cid_field_records[30] = create_t1_field2("lenIV", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.lenIV = val}, undefined);
cid_field_records[31] = create_t1_field2("LanguageGroup", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.language_group = val}, undefined);
cid_field_records[32] = create_t1_field2("password", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.password = val}, undefined);

cid_field_records[33] = create_t1_field2("BlueScale", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_FIXED_1000, function(obj, val, f) { obj.blue_scale = val}, undefined);
cid_field_records[34] = create_t1_field2("BlueShift", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.blue_shift = val}, undefined);
cid_field_records[35] = create_t1_field2("BlueFuzz", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, function(obj, val, f) { obj.blue_fuzz = val}, undefined);

cid_field_records[36] = create_t1_field3("BlueValues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 14, function(obj, val, f) { obj.blue_values[f.offset] = val}, function(obj, val, f) { obj.num_blue_values = val});
cid_field_records[37] = create_t1_field3("OtherBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 10, function(obj, val, f) { obj.other_blues[f.offset] = val}, function(obj, val, f) { obj.num_other_blues = val});
cid_field_records[38] = create_t1_field3("FamilyBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 14, function(obj, val, f) { obj.family_blues[f.offset] = val}, function(obj, val, f) { obj.num_family_blues = val});
cid_field_records[39] = create_t1_field3("FamilyOtherBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 10, function(obj, val, f) { obj.family_other_blues[f.offset] = val}, function(obj, val, f) { obj.num_family_other_blues = val});

cid_field_records[40] = create_t1_field3("StdHW", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 1, function(obj, val, f) { obj.standard_width[0] = val}, undefined);
cid_field_records[41] = create_t1_field3("StdVW", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 1, function(obj, val, f) { obj.standard_height[0] = val}, undefined);
cid_field_records[42] = create_t1_field3("MinFeature", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 2, function(obj, val, f) { obj.min_feature[f.offset] = val}, undefined);

cid_field_records[43] = create_t1_field3("StemSnapH", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 12, function(obj, val, f) { obj.snap_widths[f.offset] = val}, function(obj, val, f) { obj.num_snap_widths = val});
cid_field_records[44] = create_t1_field3("StemSnapV", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 12, function(obj, val, f) { obj.snap_heights[f.offset] = val}, function(obj, val, f) { obj.num_snap_heights = val});

cid_field_records[45] = create_t1_field2("ForceBold", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_BOOL, function(obj, val, f) { obj.force_bold = val}, undefined);

// FT_BBox
cid_field_records[46] = create_t1_field2("FontBBox", FT_Common.T1_FIELD_LOCATION_BBOX, FT_Common.T1_FIELD_TYPE_BOOL, undefined, undefined);

// callbacks
cid_field_records[47] = create_t1_field("FDArray", FT_Common.T1_FIELD_LOCATION_BBOX, FT_Common.T1_FIELD_TYPE_CALLBACK, parse_fd_array, 0, -1, 0, 0, 0, undefined, undefined);
cid_field_records[48] = create_t1_field("FontMatrix", FT_Common.T1_FIELD_LOCATION_BBOX, FT_Common.T1_FIELD_TYPE_CALLBACK, parse_font_matrix, 0, -1, 0, 0, 0, undefined, undefined);
cid_field_records[49] = create_t1_field("ExpansionFactor", FT_Common.T1_FIELD_LOCATION_BBOX, FT_Common.T1_FIELD_TYPE_CALLBACK, parse_expansion_factor, 0, -1, 0, 0, 0, undefined, undefined);


/******************************************************************************/
// driver
/******************************************************************************/
function cid_get_postscript_name(face)
{
    var result = face.cid.cid_font_name;

    if (result && result[0] == '/')
        result = result.substring(1);

    return result;
}
var cid_service_ps_name = new FT_Service_PsFontNameRec(cid_get_postscript_name);

function cid_ps_get_font_info(face)
{
    FT_Error = FT_Common.FT_Err_Ok;
    return face.cid.font_info.CreateDublicate();
}
function cid_ps_get_font_extra(face)
{
    FT_Error = FT_Common.FT_Err_Ok;
    return face.cid.font_extra.CreateDublicate();
}
var cid_service_ps_info = new FT_Service_PsInfoRec(cid_ps_get_font_info,cid_ps_get_font_extra,null,null,null);

function cid_get_ros(face, registry, ordering, supplement)
{
    FT_Error = FT_Common.FT_Err_Ok;
    var cid = face.cid;
    return { registry : cid.registry, ordering : cid.ordering, supplement : cid.supplement }
}
function cid_get_is_cid(face)
{
    FT_Error = FT_Common.FT_Err_Ok;
    return 1;
}
function cid_get_cid_from_glyph_index(face,  glyph_index)
{
    FT_Error = FT_Common.FT_Err_Ok;
    return glyph_index;
}
var cid_service_cid_info = new FT_Service_CIDRec(cid_get_ros, cid_get_is_cid, cid_get_cid_from_glyph_index);

var cid_services = new Array(4);
cid_services[0] = new FT_ServiceDescRec(FT_SERVICE_ID_XF86_NAME,FT_XF86_FORMAT_CID);
cid_services[1] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_FONT_NAME,cid_service_ps_name);
cid_services[2] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_INFO,cid_service_ps_info);
cid_services[3] = new FT_ServiceDescRec(FT_SERVICE_ID_CID,cid_service_cid_info);

function cid_get_interface(module, cid_interface)
{
    return ft_service_list_lookup(cid_services, cid_interface);
}

function CID_Driver_Class()
{
    this.flags = 0x501;
    this.name = "t1cid";
    this.version = 0x10000;
    this.requires = 0x20000;

    this.module_interface = null;

    this.init = cid_driver_init;
    this.done = cid_driver_done;
    this.get_interface = cid_get_interface;

    this.face_object_size = 0;
    this.size_object_size = 0;
    this.slot_object_size = 0;

    this.init_face = cid_face_init;
    this.done_face = cid_face_done;

    this.init_size = cid_size_init;
    this.done_size = cid_size_done;

    this.init_slot = cid_slot_init;
    this.done_slot = cid_slot_done;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_char_sizes = ft_stub_set_char_sizes;
    this.set_pixel_sizes = ft_stub_set_pixel_sizes;
    //#endif

    this.load_glyph = cid_slot_load_glyph;

    this.get_kerning = null;
    this.attach_file = null;
    this.get_advances = null;

    this.request_size = cid_size_request;
    this.select_size = null;
}

function CID_Driver()
{
    this.clazz = null;      // FT_Module_Class
    this.library = null;    // FT_Library
    this.memory = null;     // FT_Memory
    this.generic = null;    // FT_Generic

    this.clazz = new CID_Driver_Class();
    this.faces_list = new Array();
    this.extensions = null;
    this.glyph_loader = null;

    this.open_face = function(stream, face_index)
    {
        FT_Error = 0;
        var face = new CID_Face();
        var internal = new FT_Face_Internal();

        face.driver = this;
        face.memory = this.memory;
        face.stream = stream;

        //#ifdef FT_CONFIG_OPTION_INCREMENTAL
        face.internal = internal;
        face.internal.incremental_interface = null;
        //#endif

        var err1 = this.clazz.init_face(stream, face, face_index);

        if (err1 != 0)
        {
            face = null;
            FT_Error = err1;
            return null;
        }

        var err2 = find_unicode_charmap(face);
        if (err2 != 0 && err2 != FT_Common.FT_Err_Invalid_CharMap_Handle)
        {
            face = null;
            FT_Error = err2;
            return null;
        }

        return face;
    }
}

function create_cid_driver(library)
{
    var driver = new CID_Driver();
    driver.library = library;
    driver.memory = library.Memory;

    driver.clazz = new CID_Driver_Class();
    return driver;
}