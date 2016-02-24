/******************************************************************************/
// afm
/******************************************************************************/
function T1_Done_Metrics(memory, fi)
{
    fi.KernPairs = null;
    fi.NumKernPair = 0;

    fi.TrackKerns = null;
    fi.NumTrackKern = 0;
}

function t1_get_index(name, len, user_data)
{
    var type1 = user_data;

    /* PS string/name length must be < 16-bit */
    if (len > 0xFFFF)
        return 0;

    for (var n = 0; n < type1.num_glyphs; n++)
    {
        var gname = type1.glyph_names[n];

        if (gname == name)
            return n;
    }

    return 0;
}

function compare_kern_pairs(a, b)
{
    var index1 = (a.index1 << 16) | a.index2;
    var index2 = (b.index2 << 16) | b.index2;

    if (index1 > index2)
        return 1;
    else if (index1 < index2)
        return -1;
    else
        return 0;
}

function T1_Read_PFM(t1_face, stream, fi)
{
    var error = 0;
    var start = new CPointer();
    start.data = stream.data;
    start.pos = stream.cur;

    var limit = stream.limit;
    var p = dublicate_pointer(start);

    /* Figure out how long the width table is.          */
    /* This info is a little-endian short at offset 99. */
    p.pos = start.pos + 99;
    if (p.pos + 2 > limit)
        return FT_Common.FT_Err_Invalid_File_Format;

    var width_table_length = FT_PEEK_USHORT_LE(p);

    p.pos += 18 + width_table_length;
    if (p.pos + 0x12 > limit || FT_PEEK_USHORT_LE(p) < 0x12)
        return error;

    /* Kerning offset is 14 bytes from start of extensions table. */
    p.pos += 14;
    p.pos = start.pos + FT_PEEK_ULONG_LE(p);

    if (p.pos == start.pos)
        return error;

    if (p.pos + 2 > limit)
        return FT_Common.FT_Err_Unknown_File_Format;

    fi.NumKernPair = FT_PEEK_USHORT_LE(p);
    p.pos += 2;
    if (p.pos + 4 * fi.NumKernPair > limit)
        return FT_Common.FT_Err_Invalid_File_Format;

    /* Actually, kerning pairs are simply optional! */
    if (fi.NumKernPair == 0)
        return error;

    fi.KernPairs = new Array(fi.NumKernPair);
    for (var i = 0; i < fi.KernPairs; i++)
    {
        fi.KernPairs[i] = new AFM_KernPairRec();
    }

    /* now, read each kern pair */
    var kp = 0;
    limit = p.pos + 4 * fi.NumKernPair;

    /* PFM kerning data are stored by encoding rather than glyph index, */
    /* so find the PostScript charmap of this font and install it       */
    /* temporarily.  If we find no PostScript charmap, then just use    */
    /* the default and hope it is the right one.                        */
    var oldcharmap = t1_face.charmap;
    var charmap = null;

    for (var n = 0; n < t1_face.num_charmaps; n++)
    {
        charmap = t1_face.charmaps[n];
        /* check against PostScript pseudo platform */
        if (__FT_CharmapRec(charmap).platform_id == 7)
        {
            error = FT_Set_Charmap(t1_face, charmap);
            if (error)
            {
                fi.KernPairs = null;
                return error;
            }
            break;
        }
    }

    /* Kerning info is stored as:             */
    /*                                        */
    /*   encoding of first glyph (1 byte)     */
    /*   encoding of second glyph (1 byte)    */
    /*   offset (little-endian short)         */
    for (; p.pos < limit; p.pos += 4)
    {
        var _t = fi.KernPairs[kp];

        _t.index1 = FT_Get_Char_Index(t1_face, p.data[p.pos]);
        _t.index2 = FT_Get_Char_Index(t1_face, p.data[p.data + 1]);

        p.pos += 2;
        _t.x = FT_PEEK_SHORT_LE(p);
        p.pos -= 2;
        _t.y = 0;

        kp++;
    }

    if (oldcharmap != null)
        error = FT_Set_Charmap(t1_face, oldcharmap);

    if (error != 0)
    {
        fi.KernPairs = null;
        return error;
    }

    /* now, sort the kern pairs according to their glyph indices */
    ft_qsort(fi.KernPairs, fi.NumKernPair, compare_kern_pairs);

    return error;
}

function T1_Read_Metrics(t1_face, stream)
{
    var parser = new AFM_ParserRec();

    var fi = new AFM_FontInfoRec();
    var t1_font = t1_face.type1;

    var error = stream.EnterFrame(stream.size);
    
    fi.FontBBox = dublicate_bbox(t1_font.font_bbox);
    fi.Ascender  = t1_font.font_bbox.yMax;
    fi.Descender = t1_font.font_bbox.yMin;

    var psaux = t1_face.psaux;
    if (psaux != null && psaux.afm_parser_funcs != null)
    {
        var cur = new CPointer();
        cur.pos = stream.cur;
        cur.data = stream.data;
        error = psaux.afm_parser_funcs.init(parser, g_memory, cur, stream.size);

        if (error == 0)
        {
            parser.FontInfo  = fi;
            parser.get_index = t1_get_index;
            parser.user_data = t1_face.type1;

            error = psaux.afm_parser_funcs.parse(parser);
            psaux.afm_parser_funcs.done(parser);
        }
    }

    if (error == FT_Common.FT_Err_Unknown_File_Format)
    {
        var start = new CPointer();
        start.pos = stream.cur;
        start.data = stream.data;

        /* MS Windows allows versions up to 0x3FF without complaining */
        if (stream.size > 6 && start.data[start.pos + 1] < 4)
        {
            start.pos += 2;
            if (FT_PEEK_ULONG_LE(start) == stream.size)
            {
                error = T1_Read_PFM(t1_face, stream, fi);
            }
        }
    }

    if (error == 0)
    {
        t1_font.font_bbox = dublicate_bbox(fi.FontBBox);

        t1_face.bbox.xMin = fi.FontBBox.xMin >> 16;
        t1_face.bbox.yMin = fi.FontBBox.yMin >> 16;
        /* no `U' suffix here to 0xFFFF! */
        t1_face.bbox.xMax = (fi.FontBBox.xMax + 0xFFFF) >> 16;
        t1_face.bbox.yMax = (fi.FontBBox.yMax + 0xFFFF) >> 16;

        /* no `U' suffix here to 0x8000! */
        t1_face.ascender  = ((fi.Ascender  + 0x8000) >> 16);
        t1_face.descender = ((fi.Descender + 0x8000) >> 16);

        if (fi.NumKernPair == 0)
        {
            t1_face.face_flags |= FT_Common.FT_FACE_FLAG_KERNING;
            t1_face.afm_data = fi;
            fi = null;
        }
    }

    stream.ExitFrame();

    if (fi != null)
    {
        T1_Done_Metrics(g_memory, fi);
        fi = null;
    }
    return error;
}

function T1_Get_Kerning(fi, glyph1, glyph2)
{
    var kerning = new FT_Vector();
    var min = 0;
    var mid = 0;
    var max = fi.NumKernPair - 1;
    var idx = (glyph1 << 16) | glyph2;

    /* simple binary search */
    var pairs = fi.KernPairs;

    while (min <= max)
    {
        mid  = min + (max - min) / 2;
        var midi = (pairs[mid].index1) << 16 | pairs[mid].index2;

        if (midi == idx)
        {
            kerning.x = mid.x;
            kerning.y = mid.y;

            return kerning;
        }

        if (midi < idx)
            min = mid + 1;
        else
            max = mid - 1;
    }

    kerning.x = 0;
    kerning.y = 0;

    return kerning;
}

function T1_Get_Track_Kerning(face, ptsize, degree, kerning)
{
    var fi = face.afm_data;
    var ret = { err: FT_Common.FT_Err_Invalid_Argument, kerning: kerning };

    if (fi == null)
    {
        ret.err = FT_Common.FT_Err_Invalid_Argument;
        return ret;
    }

    var count = fi.NumTrackKern;
    for (var i = 0; i < count; i++)
    {
        var tk = fi.TrackKerns[i];

        if (tk.degree != degree)
            continue;

        if (ptsize < tk.min_ptsize)
        {
            ret.kerning = tk.min_kern;
        }
        else if (ptsize > tk.max_ptsize)
        {
            ret.kerning = tk.max_kern;
        }
        else
        {
            ret.kerning = FT_MulDiv(ptsize - tk.min_ptsize, tk.max_kern - tk.min_kern, tk.max_ptsize - tk.min_ptsize) + tk.min_kern;
        }
    }

    return ret;
}

/******************************************************************************/
// gload
/******************************************************************************/
function T1_Parse_Glyph_And_Get_Char_String(decoder, glyph_index, char_string)
{
    var face = decoder.builder.face;
    var type1 = face.type1;
    var error = 0;

    decoder.font_matrix = dublicate_matrix(type1.font_matrix);
    decoder.font_offset = dublicate_vector(type1.font_offset);

    char_string.pointer = dublicate_pointer(type1.charstrings[glyph_index]);
    char_string.length  = type1.charstrings_len[glyph_index];

    if (error == 0)
        error = decoder.funcs.parse_charstrings(decoder, char_string.pointer, char_string.length);

    return error;
}

function T1_Parse_Glyph(decoder, glyph_index)
{
    var glyph_data = new FT_Data();
    var error = T1_Parse_Glyph_And_Get_Char_String(decoder, glyph_index, glyph_data);
    return error;
}

function T1_Compute_Max_Advance(face)
{
    var ret = { err : 0, max_advance : 0 };

    var type1 = face.type1;
    var psaux = face.psaux;

    /* initialize load decoder */
    var decoder = new T1_DecoderRec();
    
    ret.err = psaux.t1_decoder_funcs.init(decoder, face, null, null, type1.glyph_names, face.blend, 0, FT_Common.FT_RENDER_MODE_NORMAL, T1_Parse_Glyph);
    if (ret.err != 0)
        return ret;

        decoder.builder.metrics_only = 1;
    decoder.builder.load_points  = 0;

    decoder.num_subrs     = type1.num_subrs;
    decoder.subrs         = type1.subrs;
    decoder.subrs_len     = type1.subrs_len;

    decoder.buildchar     = face.buildchar;
    decoder.len_buildchar = face.len_buildchar;

    /* for each glyph, parse the glyph charstring and extract */
    /* the advance width                                      */
    var _count = type1.num_glyphs;
    for (var glyph_index = 0; glyph_index < _count; glyph_index++)
    {
        if (glyph_index == 342)
        {
            var tt = 0;
            tt += 5;
            tt -= 89;
            tt += 8;
        }

        /* now get load the unscaled outline */
        ret.err = T1_Parse_Glyph(decoder, glyph_index);
        if (glyph_index == 0 || decoder.builder.advance.x > ret.max_advance)
            ret.max_advance = decoder.builder.advance.x;
    }

    psaux.t1_decoder_funcs.done(decoder);
    ret.err = 0;
    return ret;
}

function T1_Get_Advances(face, first, count, load_flags, advances)
{
    if (load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT)
    {
        for ( nn = 0; nn < count; nn++ )
            advances[nn] = 0;

        return 0;
    }

    var decoder = new T1_DecoderRec();
    var psaux = face.psaux;
    var type1 = face.type1;

    var error = psaux.t1_decoder_funcs.init(decoder, face, null, null, type1.glyph_names, face.blend, 0, FT_Common.FT_RENDER_MODE_NORMAL, T1_Parse_Glyph);
    if (error != 0)
        return error;

    decoder.builder.metrics_only = 1;
    decoder.builder.load_points  = 0;

    decoder.num_subrs = type1.num_subrs;
    decoder.subrs     = type1.subrs;
    decoder.subrs_len = type1.subrs_len;

    decoder.buildchar     = face.buildchar;
    decoder.len_buildchar = face.len_buildchar;

    for (var nn = 0; nn < count; nn++)
    {
        error = T1_Parse_Glyph(decoder, first + nn);
        if (error == 0)
            advances[nn] = FT_RoundFix(decoder.builder.advance.x) >> 16;
        else
            advances[nn] = 0;
    }

    return 0;
}

function T1_Load_Glyph(_glyph, size, glyph_index, load_flags)
{
    var glyph = _glyph.base_root;

    var decoder = new T1_DecoderRec();
    var face = _glyph.face;
    var type1 = face.type1;
    var psaux = face.psaux;
    var decoder_funcs = psaux.t1_decoder_funcs;

    var glyph_data = new FT_Data();
    var must_finish_decoder = 0;

    if (glyph_index >= face.num_glyphs)
        return FT_Common.FT_Err_Invalid_Argument;

    if (load_flags & FT_Common.FT_LOAD_NO_RECURSE)
        load_flags |= (FT_Common.FT_LOAD_NO_SCALE | FT_Common.FT_LOAD_NO_HINTING);

    if (size != null)
    {
        glyph.x_scale = size.metrics.x_scale;
        glyph.y_scale = size.metrics.y_scale;
    }
    else
    {
        glyph.x_scale = 0x10000;
        glyph.y_scale = 0x10000;
    }

    _glyph.outline.n_points   = 0;
    _glyph.outline.n_contours = 0;

    var hinting = ((load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0 && (load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0);
    _glyph.format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

    var error = decoder_funcs.init(decoder, face, size, glyph, type1.glyph_names, face.blend, hinting, FT_LOAD_TARGET_MODE(load_flags), T1_Parse_Glyph);
    if (error != 0)
        return error;

    must_finish_decoder = 1;

    decoder.builder.no_recurse = ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0) ? 1 : 0;

    decoder.num_subrs     = type1.num_subrs;
    decoder.subrs         = type1.subrs;
    decoder.subrs_len     = type1.subrs_len;

    decoder.buildchar     = face.buildchar;
    decoder.len_buildchar = face.len_buildchar;

    /* now load the unscaled outline */
    error = T1_Parse_Glyph_And_Get_Char_String(decoder, glyph_index, glyph_data);
    if (error != 0)
    {
        decoder_funcs.done(decoder);
        return error;
    }

    var font_matrix = dublicate_matrix(decoder.font_matrix);
    var font_offset = dublicate_vector(decoder.font_offset);

    /* save new glyph tables */
    decoder_funcs.done(decoder);
    
    must_finish_decoder = 0;

    /* now, set the metrics -- this is rather simple, as   */
    /* the left side bearing is the xMin, and the top side */
    /* bearing the yMax                                    */
    if (error == 0)
    {
        glyph.root.outline.flags &= FT_Common.FT_OUTLINE_OWNER;
        glyph.root.outline.flags |= FT_Common.FT_OUTLINE_REVERSE_FILL;

        /* for composite glyphs, return only left side bearing and */
        /* advance width                                           */
        if ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0)
        {
            var internal = glyph.root.internal;

            glyph.root.metrics.horiBearingX = FT_RoundFix(decoder.builder.left_bearing.x) >> 16;
            glyph.root.metrics.horiAdvance = FT_RoundFix(decoder.builder.advance.x);

            internal.glyph_matrix      = dublicate_matrix(font_matrix);
            internal.glyph_delta       = dublicate_vector(font_offset);
            internal.glyph_transformed = 1;
        }
        else
        {
            var cbox = new FT_BBox();
            var metrics = glyph.root.metrics;
            var advance = new FT_Vector();

            /* copy the _unscaled_ advance width */
            metrics.horiAdvance = FT_RoundFix(decoder.builder.advance.x) >> 16;
            glyph.root.linearHoriAdvance = FT_RoundFix(decoder.builder.advance.x) >> 16;
            glyph.root.internal.glyph_transformed = 0;

            if ((load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0)
            {
                /* make up vertical ones */
                metrics.vertAdvance = (face.type1.font_bbox.yMax - face.type1.font_bbox.yMin) >> 16;
                glyph.root.linearVertAdvance = metrics.vertAdvance;
            }
            else
            {
                metrics.vertAdvance = FT_RoundFix(decoder.builder.advance.y) >> 16;
                glyph.root.linearVertAdvance = FT_RoundFix(decoder.builder.advance.y) >> 16;
            }

            glyph.root.format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

            if (size != null && size.metrics.y_ppem < 24)
                glyph.root.outline.flags |= FT_Common.FT_OUTLINE_HIGH_PRECISION;

            /* apply the font matrix, if any */
            if (font_matrix.xx != 0x10000 || font_matrix.yy != font_matrix.xx || font_matrix.xy != 0 || font_matrix.yx != 0)
                FT_Outline_Transform(glyph.root.outline, font_matrix);

            if (font_offset.x || font_offset.y)
                FT_Outline_Translate(glyph.root.outline, font_offset.x, font_offset.y);

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
                var cur_p_c = decoder.builder.base.n_points;
                var points = decoder.builder.base.points;
                var vec = 0;
                var x_scale = glyph.x_scale;
                var y_scale = glyph.y_scale;


                /* First of all, scale the points, if we are not hinting */
                if (hinting == 0 || decoder.builder.hints_funcs == null)
                {
                    for (var n = cur_p_c; n > 0; n--, vec++)
                    {
                        points[vec].x = FT_MulFix(points[vec].x, x_scale);
                        points[vec].y = FT_MulFix(points[vec].y, y_scale);
                    }
                }

                /* Then scale the metrics */
                metrics.horiAdvance = FT_MulFix(metrics.horiAdvance, x_scale);
                metrics.vertAdvance = FT_MulFix(metrics.vertAdvance, y_scale);
            }

            /* compute the other metrics */
            FT_Outline_Get_CBox(glyph.root.outline, cbox);

            metrics.width  = cbox.xMax - cbox.xMin;
            metrics.height = cbox.yMax - cbox.yMin;

            metrics.horiBearingX = cbox.xMin;
            metrics.horiBearingY = cbox.yMax;

            if ((load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0)
            {
                /* make up vertical ones */
                ft_synthesize_vertical_metrics(metrics, metrics.vertAdvance);
            }
        }

        /* Set control data to the glyph charstrings.  Note that this is */
        /* _not_ zero-terminated.                                        */
        glyph.root.control_data = dublicate_pointer(glyph_data.pointer);
        glyph.root.control_len  = glyph_data.length;
    }

    return error;
}

/******************************************************************************/
// parse
/******************************************************************************/
function T1_ParserRec()
{
    this.root = new PS_ParserRec();
    this.stream = null;

    this.base_dict = null;
    this.base_len = 0;

    this.private_dict = null;
    this.private_len = 0;

    this.in_pfb = 0;
    this.in_memory = 0;
    this.single_block = 0;

    this.clear = function()
    {
        this.root.clear();
        this.stream = null;

        this.base_dict = null;
        this.base_len = 0;

        this.private_dict = null;
        this.private_len = 0;

        this.in_pfb = 0;
        this.in_memory = 0;
        this.single_block = 0;
    }
}

function read_pfb_tag(stream)
{
    var ret = { tag: 0, size: 0, err: 0 };

    var tag = stream.ReadUShort();
    ret.err = FT_Error;
    if (ret.err == 0)
    {
        if (tag == 0x8001 || tag == 0x8002)
        {
            var size = stream.ReadULongLE();
            ret.err = FT_Error;
            if (ret.err == 0)
                ret.size = size;
        }
        ret.tag = tag;
    }
    return ret;
}

function check_type1_format(stream, header_string, header_length)
{
    var error = stream.Seek(0);
    if (error != 0)
        return error;


    var ret = read_pfb_tag(stream);
    if (ret.err != 0)
        return ret.err;

    /* We assume that the first segment in a PFB is always encoded as   */
    /* text.  This might be wrong (and the specification doesn't insist */
    /* on that), but we have never seen a counterexample.               */
    if (ret.tag != 0x8001 && 0 != stream.Seek(0))
        return error;

    error = stream.EnterFrame(header_length);
    if (error == 0)
    {
        for (var i = 0; i < header_length; i++)
        {
            if (header_string.charCodeAt(i) != stream.data[stream.cur + i])
                return FT_Common.FT_Err_Unknown_File_Format;
        }

        stream.ExitFrame();
    }
    return error;
}

function T1_New_Parser(parser, stream, memory, psaux)
{
    psaux.ps_parser_funcs.init(parser.root, null, 0, memory);

    parser.stream       = stream;
    parser.base_len     = 0;
    parser.base_dict    = null;
    parser.private_len  = 0;
    parser.private_dict = null;
    parser.in_pfb       = 0;
    parser.in_memory    = 0;
    parser.single_block = 0;

    /* check the header format */
    var error = check_type1_format(stream, "%!PS-AdobeFont", 14);
    if (error != 0)
    {
        if (error != FT_Common.FT_Err_Unknown_File_Format)
            return error;

        error = check_type1_format(stream, "%!FontType", 10);
        if (error != 0)
            return error;
    }

    error = stream.Seek(0);
    if (error != 0)
        return error;

    var ret = read_pfb_tag(stream);
    if (ret.err != 0)
        return ret.err;

    var size = ret.size;

    if (ret.tag != 0x8001)
    {
        /* assume that this is a PFA file for now; an error will */
        /* be produced later when more things are checked        */
        error = stream.Seek(0);
        if (error != 0)
            return error;
        size = stream.size;
    }
    else
        parser.in_pfb = 1;

    /* now, try to load `size' bytes of the `base' dictionary we */
    /* found previously                                          */
    /* if it is a memory-based resource, set up pointers */
    parser.base_dict = new CPointer();
    parser.base_dict.data = stream.data;
    parser.base_dict.pos = stream.pos;
    parser.base_len = size;
    parser.in_memory = 1;

    error = stream.Skip(size);
    if (error != 0)
        return error;

    parser.root.base   = dublicate_pointer(parser.base_dict);
    parser.root.cursor = dublicate_pointer(parser.root.base);
    parser.root.limit  = parser.root.base.pos + parser.base_len;

    return error;
}

function T1_Finalize_Parser(parser)
{
    parser.private_dict = null;
    parser.base_dict = null;

    parser.root.funcs.done(parser.root);
}

function T1_Get_Private_Dict(parser, psaux)
{
    var stream = parser.stream;
    var memory = parser.root.memory;

    var error = 0;
    var size = 0;

    if (parser.in_pfb == 1)
    {
        /* in the case of the PFB format, the private dictionary can be  */
        /* made of several segments.  We thus first read the number of   */
        /* segments to compute the total size of the private dictionary  */
        /* then re-read them into memory.                                */
        var start_pos = stream.pos;
        parser.private_len = 0;
        for (;;)
        {
            var ret = read_pfb_tag(stream);
            if (ret.err != 0)
                return ret.err;

            if (ret.tag != 0x8002)
                break;

            parser.private_len += ret.size;

            error = stream.Skip(ret.size);
        }

        /* Check that we have a private dictionary there */
        /* and allocate private dictionary buffer        */
        if (parser.private_len == 0)
            return FT_Common.FT_Err_Invalid_File_Format;

        error = stream.Seek(start_pos);
        if (error != 0)
            return error;

        parser.private_dict = memory.Alloc(parser.private_len);
        parser.private_len = 0;
        var p = dublicate_pointer(parser.private_dict);
        for (;;)
        {
            var ret = read_pfb_tag(stream);
            if (ret.err != 0 || ret.tag != 0x8002)
            {
                error = 0;
                break;
            }

            p.pos = parser.private_len;
            error = stream.Read(p, ret.size);

            if (error != 0)
                return error;

            parser.private_len += ret.size;
        }
    }
    else
    {
        /* We have already `loaded' the whole PFA font file into memory; */
        /* if this is a memory resource, allocate a new block to hold    */
        /* the private dict.  Otherwise, simply overwrite into the base  */
        /* dictionary block in the heap.                                 */

        /* first of all, look at the `eexec' keyword */
        var cur = dublicate_pointer(parser.base_dict);
        var limit = cur.pos + parser.base_len;
        var c = 0;

        var _go_to_found = 0;

        while (true)
        {
            for (;;)
            {
                c = cur.data[cur.pos];
                if (c == FT_Common.SYMBOL_CONST_e && cur.pos + 9 < limit)  /* 9 = 5 letters for `eexec' + */
                {
                    if (cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_e && cur.data[cur.pos + 2] == FT_Common.SYMBOL_CONST_x &&
                        cur.data[cur.pos + 3] == FT_Common.SYMBOL_CONST_e && cur.data[cur.pos + 4] == FT_Common.SYMBOL_CONST_c)
                        break;
                }
                cur.pos++;
                if (cur.pos >= limit)
                    return FT_Common.FT_Err_Invalid_File_Format;
            }

            /* check whether `eexec' was real -- it could be in a comment */
            /* or string (as e.g. in u003043t.gsf from ghostscript)       */
            parser.root.cursor = dublicate_pointer(parser.base_dict);
            parser.root.limit  = cur.pos + 9;

            cur = dublicate_pointer(parser.root.cursor);

            limit = parser.root.limit;

            while (cur.pos < limit)
            {
                if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_e && _strncmp_data(cur, "eexec", 5) == 0)
                {
                    _go_to_found = 1;
                    break;
                }

                parser.root.funcs.skip_PS_token(parser.root);
                if (parser.root.error != 0)
                    break;
                parser.root.funcs.skip_spaces(parser.root);
                cur.pos = parser.root.cursor.pos;
            }

            if (_go_to_found == 1)
                break;

            /* we haven't found the correct `eexec'; go back and continue */
            /* searching                                                  */
            cur.pos   = limit;
            limit = parser.base_dict.pos + parser.base_len;
        }

        /* now determine where to write the _encrypted_ binary private  */
        /* dictionary.  We overwrite the base dictionary for disk-based */
        /* resources and allocate a new block otherwise                 */
        parser.root.limit = parser.base_dict.pos + parser.base_len;

        parser.root.funcs.skip_PS_token(parser.root);
        cur.pos = parser.root.cursor.pos;

        /* according to the Type1 spec, the first cipher byte must not be  */
        /* an ASCII whitespace character code (blank, tab, carriage return */
        /* or line feed).  We have seen Type 1 fonts with two line feed    */
        /* characters...  So skip now all whitespace character codes.      */
        while (cur.pos < limit  && (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_SPACE || cur.data[cur.pos] == FT_Common.SYMBOL_CONST_ST || cur.data[cur.pos] == FT_Common.SYMBOL_CONST_SR || cur.data[cur.pos] == FT_Common.SYMBOL_CONST_SN))
            cur.pos++;
        if (cur.pos >= limit)
            return FT_Common.FT_Err_Invalid_File_Format;

        size = parser.base_len - (cur.pos - parser.base_dict.pos);

        if (parser.in_memory == 1)
        {
            /* note that we allocate one more byte to put a terminating `0' */
            parser.private_dict = memory.Alloc(size + 1);
            parser.private_len = size;
        }
        else
        {
            parser.single_block = 1;
            parser.private_dict = dublicate_pointer(parser.base_dict);
            parser.private_len  = size;
            parser.base_dict    = null;
            parser.base_len     = 0;
        }

        /* now determine whether the private dictionary is encoded in binary */
        /* or hexadecimal ASCII format -- decode it accordingly              */

        /* we need to access the next 4 bytes (after the final \r following */
        /* the `eexec' keyword); if they all are hexadecimal digits, then   */
        /* we have a case of ASCII storage                                  */

        if (_isxdigit(cur[0]) && _isxdigit(cur[1]) && _isxdigit(cur[2]) && _isxdigit(cur[3]))
        {
            /* ASCII hexadecimal encoding */
            parser.root.cursor = cur.pos;
            var ret = psaux.ps_parser_funcs.to_bytes(parser.root, parser.private_dict, parser.private_len, 0);
            parser.private_len = ret.num_bytes;

            /* put a safeguard */
            parser.private_dict[len] = FT_Common.SYMBOL_CONST_S0;
        }
        else
        {
            var mem = memory.Alloc(size);
            for (var i = 0; i < size; i++)
                mem.data[i] = cur.data[cur.pos + i];

            var _p = parser.private_dict.data;
            var _n = parser.private_dict.pos;
            for (var i = 0; i < size; i++)
                _p[_n + i] = mem.data[i];

            mem = null;
        }

    }

    /* we now decrypt the encoded binary private dictionary */
    var _mem = dublicate_pointer(parser.private_dict);
    psaux.t1_decrypt(_mem, parser.private_len, 55665);

    /* replace the four random bytes at the beginning with whitespace */
    var _d = parser.private_dict.data;
    _d[0] = FT_Common.SYMBOL_CONST_SPACE;
    _d[1] = FT_Common.SYMBOL_CONST_SPACE;
    _d[2] = FT_Common.SYMBOL_CONST_SPACE;
    _d[3] = FT_Common.SYMBOL_CONST_SPACE;

    parser.root.base   = dublicate_pointer(parser.private_dict);
    parser.root.cursor = dublicate_pointer(parser.private_dict);
    parser.root.limit  = parser.private_dict.pos + parser.private_len;

    return error;
}

/******************************************************************************/
// objs
/******************************************************************************/
var T1_SizeRec = FT_Size;

function T1_GlyphSlotRec()
{
    this.root = new FT_GlyphSlot();
    this.root.base_root = this;

    this.hint = 0;
    this.scaled = 0;

    this.max_points = 0;
    this.max_contours = 0;

    this.x_scale = 0;
    this.y_scale = 0;
}

function T1_Size_Get_Globals_Funcs(size)
{
    return null;

    var pshinter = size.face.pshinter;
    var module = size.face.driver.library.FT_Get_Module("pshinter");
    if (module != null && pshinter != null && pshinter.get_globals_funcs != null)
        return pshinter.get_globals_funcs(module);
    return null;
}

function T1_Size_Done(size)
{
    if (size.internal != null)
    {
        var funcs = T1_Size_Get_Globals_Funcs(size);
        if (funcs != null)
            funcs.destroy(size.internal);

        size.internal = null;
    }
}

function T1_Size_Init()
{
    var size  = new FT_Size();
    var funcs = T1_Size_Get_Globals_Funcs(size);

    if (funcs != null)
    {
        // TODO: (hints)
    }

    return size;
}

function T1_Size_Request(size, req)
{
    var funcs = T1_Size_Get_Globals_Funcs(size);
    FT_Request_Metrics(size.face, req);

    if (funcs != null)
        funcs.set_scale(size.internal, size.metrics.x_scale, size.metrics.y_scale, 0, 0);

    return 0;
}

function T1_GlyphSlot_Done(slot)
{
    slot.internal.glyph_hints = null;
}

function T1_GlyphSlot_Init(slot)
{
    var face = slot.face;
    var pshinter = face.pshinter;

    if (pshinter != null)
    {
        var module = face.driver.library.FT_Get_Module("pshinter");
        if (module != null)
        {
            var funcs = pshinter.get_t1_funcs(module);
            slot.internal.glyph_hints = funcs;
        }
    }
    return 0;
}

function T1_Face_Done(face)
{
    if (face == null)
        return;

    var memory = face.memory;
    var type1 = face.type1;

    //#ifndef T1_CONFIG_OPTION_NO_MM_SUPPORT
    /* release multiple masters information */
    if (face.buildchar != null)
    {
        face.buildchar = null;
        face.len_buildchar = 0;
    }

    T1_Done_Blend(face);
    face.blend = 0;
    //#endif

    /* release font info strings */
    var info = type1.font_info;

    info.version = null;
    info.notice = null;
    info.full_name = null;
    info.family_name = null;
    info.weight = null;

    /* release top dictionary */
    type1.charstrings_len = null;
    type1.charstrings = null;
    type1.glyph_names = null;

    type1.subrs = null;
    type1.subrs_len = null;

    type1.subrs_block = null;
    type1.charstrings_block = null;
    type1.glyph_names_block = null;

    type1.encoding.char_index = null;
    type1.encoding.char_name = null;
    type1.font_name = null;

    //#ifndef T1_CONFIG_OPTION_NO_AFM
    /* release afm data if present */
    if (face.afm_data != null)
    {
        T1_Done_Metrics(memory, face.afm_data);
        face.afm_data = null;
    }
    //#endif

    face.family_name = "";
    face.style_name  = "";
}

function T1_Face_Init(stream, face, face_index, num_params, params)
{
    var type1 = face.type1;
    var info = type1.font_info;

    face.num_faces = 1;

    var psnames = FT_FACE_FIND_GLOBAL_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_CMAPS);
    face.psnames = psnames;

    var psaux = face.driver.library.FT_Get_Module_Interface("psaux");
    face.psaux = psaux;

    face.pshinter = face.driver.library.FT_Get_Module_Interface("pshinter");

    /* open the tokenizer; this will also check the font format */
    var error = T1_Open_Face(face);
    if (error != 0)
        return error;

    /* if we just wanted to check the format, leave successfully now */
    if (face_index < 0)
        return error;

    /* check the face index */
    if (face_index > 0)
        return FT_Common.FT_Err_Invalid_Argument;

    /* now load the font program into the face object */
    /* initialize the face object fields */
    /* set up root face fields */
    face.num_glyphs = type1.num_glyphs;
    face.face_index = 0;

    face.face_flags = FT_Common.FT_FACE_FLAG_SCALABLE | FT_Common.FT_FACE_FLAG_HORIZONTAL | FT_Common.FT_FACE_FLAG_GLYPH_NAMES | FT_Common.FT_FACE_FLAG_HINTER;

    if (info.is_fixed_pitch == 1)
        face.face_flags |= FT_Common.FT_FACE_FLAG_FIXED_WIDTH;

    if (face.blend != null)
        face.face_flags |= FT_Common.FT_FACE_FLAG_MULTIPLE_MASTERS;

    /* XXX: TODO -- add kerning with .afm support */
    /* The following code to extract the family and the style is very   */
    /* simplistic and might get some things wrong.  For a full-featured */
    /* algorithm you might have a look at the whitepaper given at       */
    /*                                                                  */
    /*   http://blogs.msdn.com/text/archive/2007/04/23/wpf-font-selection-model.aspx */

    /* get style name -- be careful, some broken fonts only */
    /* have a `/FontName' dictionary entry!                 */
    face.family_name = info.family_name;
    face.style_name = null;

    if (face.family_name != null)
    {
        var full = 0;
        var family = 0;

        var full_len = info.full_name.length;
        var family_len = face.family_name.length;

        if (full < full_len)
        {
            var the_same = 1;
            while (full < full_len)
            {
                var _1 = info.full_name.charCodeAt(full);
                var _2 = (family < family_len) ? face.family_name.charCodeAt(family) : 0;

                if (_1 == _2)
                {
                    family++;
                    full++;
                }
                else
                {
                    if (_1 == FT_Common.SYMBOL_CONST_SPACE || _1 == FT_Common.SYMBOL_CONST_MATH_MINUS)
                        full++;
                    else if (_2 == FT_Common.SYMBOL_CONST_SPACE || _2 == FT_Common.SYMBOL_CONST_MATH_MINUS)
                        family++;
                    else
                    {
                        the_same = 0;

                        if (family == family_len)
                            face.style_name = full;
                        break;
                    }
                }
            }

            if (the_same == 1)
                face.style_name = "Regular";
        }
    }
    else
    {
        /* do we have a `/FontName'? */
        if (type1.font_name != null)
            face.family_name = type1.font_name;
    }

    if (face.style_name != null)
    {
        if (info.weight != null)
            face.style_name = info.weight;
        else
            face.style_name = "Regular";
    }

    /* compute style flags */
    face.style_flags = 0;
    if (info.italic_angle != 0)
        face.style_flags |= FT_Common.FT_STYLE_FLAG_ITALIC;
    if (info.weight != null)
    {
        if (info.weight == "Bold" || info.weight == "Black")
            face.style_flags |= FT_Common.FT_STYLE_FLAG_BOLD;
    }

    /* no embedded bitmap support */
    face.num_fixed_sizes = 0;
    face.available_sizes = 0;

    face.bbox.xMin = type1.font_bbox.xMin >> 16;
    face.bbox.yMin = type1.font_bbox.yMin >> 16;
    /* no `U' suffix here to 0xFFFF! */
    face.bbox.xMax = (type1.font_bbox.xMax + 0xFFFF) >> 16;
    face.bbox.yMax = (type1.font_bbox.yMax + 0xFFFF) >> 16;

    /* Set units_per_EM if we didn't set it in parse_font_matrix. */
    if (face.units_per_EM == 0)
        face.units_per_EM = 1000;

    face.ascender  = face.bbox.yMax;
    face.descender = face.bbox.yMin;

    face.height = parseInt((face.units_per_EM * 12) / 10);
    if (face.height < (face.ascender - face.descender))
        face.height = (face.ascender - face.descender);

    /* now compute the maximum advance width */
    face.max_advance_width = (face.bbox.xMax);

    var ret = T1_Compute_Max_Advance(face);

    /* in case of error, keep the standard width */
    if (ret.err == 0)
        face.max_advance_width = FT_RoundFix(ret.max_advance) >> 16;
    else
        error = 0;   /* clear error */

    face.max_advance_height = face.height;

    face.underline_position  = info.underline_position;
    face.underline_thickness = info.underline_thickness;

    if (psnames != null && psaux != null)
    {
        var cmap_classes = psaux.t1_cmap_classes;
        var charmap = new FT_CharMapRec();

        charmap.face = face;

        /* first of all, try to synthesize a Unicode charmap */
        charmap.platform_id = FT_Common.TT_PLATFORM_MICROSOFT;
        charmap.encoding_id = FT_Common.TT_MS_ID_UNICODE_CS;
        charmap.encoding    = FT_Common.FT_ENCODING_UNICODE;

        var __cmap = FT_CMap_New(cmap_classes.unicode, null, charmap);
        __cmap = null;
        error = FT_Error;
        FT_Error = 0;
        if (error != 0 && FT_Common.FT_Err_No_Unicode_Glyph_Name != error)
            return error;
        error = 0;

        /* now, generate an Adobe Standard encoding when appropriate */
        charmap.platform_id = FT_Common.TT_PLATFORM_ADOBE;
        var clazz = null;

        switch (type1.encoding_type)
        {
            case FT_Common.T1_ENCODING_TYPE_STANDARD:
                charmap.encoding    = FT_Common.FT_ENCODING_ADOBE_STANDARD;
                charmap.encoding_id = FT_Common.TT_ADOBE_ID_STANDARD;
                clazz               = cmap_classes.standard;
                break;

            case FT_Common.T1_ENCODING_TYPE_EXPERT:
                charmap.encoding    = FT_Common.FT_ENCODING_ADOBE_EXPERT;
                charmap.encoding_id = FT_Common.TT_ADOBE_ID_EXPERT;
                clazz               = cmap_classes.expert;
                break;

            case FT_Common.T1_ENCODING_TYPE_ARRAY:
                charmap.encoding    = FT_Common.FT_ENCODING_ADOBE_CUSTOM;
                charmap.encoding_id = FT_Common.TT_ADOBE_ID_CUSTOM;
                clazz               = cmap_classes.custom;
                break;

            case FT_Common.T1_ENCODING_TYPE_ISOLATIN1:
                charmap.encoding    = FT_Common.FT_ENCODING_ADOBE_LATIN_1;
                charmap.encoding_id = FT_Common.TT_ADOBE_ID_LATIN_1;
                clazz               = cmap_classes.unicode;
                break;

            default:
                break;
        }

        if (clazz != null)
        {
            __cmap = FT_CMap_New(clazz, null, charmap);
            error = FT_Error;
            __cmap = null;
        }
    }

    return error;
}

function T1_Driver_Init(driver)
{
    return 0;
}

function T1_Driver_Done(driver)
{
}

/******************************************************************************/
// load
/******************************************************************************/

function T1_Loader()
{
    this.parser = new T1_ParserRec();

    this.num_chars = 0;
    this.encoding_table = new PS_TableRec();
    /* encoding character names         */

    this.num_glyphs = 0;
    this.glyph_names = new PS_TableRec();
    this.charstrings = new PS_TableRec();
    this.swap_table = new PS_TableRec();

    this.num_subrs = 0;
    this.subrs = new PS_TableRec();
    this.fontdata = 0;

    this.keywords_encountered = 0;

    this.clear = function()
    {
        this.parser.clear();

        this.num_chars = 0;
        this.encoding_table.clear();
        /* encoding character names         */

        this.num_glyphs = 0;
        this.glyph_names.clear();
        this.charstrings.clear();
        this.swap_table.clear();

        this.num_subrs = 0;
        this.subrs.clear();
        this.fontdata = 0;

        this.keywords_encountered = 0;
    }
}

function t1_allocate_blend(face, num_designs, num_axis)
{
    var blend = face.blend;
    if (blend == null)
    {
        blend = new PS_BlendRec();
        blend.num_default_design_vector = 0;
        face.blend = blend;
    }

    /* allocate design data if needed */
    if (num_designs > 0)
    {
        if (blend.num_designs == 0)
        {
            blend.font_infos[0] = face.type1.font_info;
            blend.privates[0] = face.type1.private_dict;
            blend.bboxes[0] = face.type1.font_bbox;

            for (var i = 1; i <= num_designs; i++)
            {
                blend.font_infos[i] = new PS_FontInfoRec();
                blend.privates[i] = new PS_PrivateRec();
                blend.bboxes[i] = new FT_BBox();
            }

            blend.weight_vector = CreateIntArray(num_designs * 2);
            blend.default_weight_vector = num_designs;

            blend.num_designs = num_designs;
        }
        else if (blend.num_designs != num_designs)
            return FT_Common.FT_Err_Invalid_File_Format;
    }

    /* allocate axis data if needed */
    if (num_axis > 0)
    {
        if (blend.num_axis != 0 && blend.num_axis != num_axis)
            return FT_Common.FT_Err_Invalid_File_Format;

        blend.num_axis = num_axis;
    }

    /* allocate the blend design pos table if needed */
    num_designs = blend.num_designs;
    num_axis    = blend.num_axis;
    if (num_designs && num_axis && blend.design_pos[0] == null)
    {
        for (var i = 0; i < num_designs; i++)
            blend.design_pos[i] = CreateIntArray(num_axis);
    }
    return 0;
}

function T1_Get_Multi_Master(face, master)
{
    var blend = face.blend;
    if (null == blend)
        return FT_Common.FT_Err_Invalid_Argument;

    master.num_axis = blend.num_axis;
    master.num_designs = blend.num_designs;

    for (var n = 0; n < blend.num_axis; n++)
    {
        var axis = master.axis[n];
        var map = blend.design_map[n];

        axis.name = blend.axis_names[n];
        axis.minimum = map.design_points[0];
        axis.maximum = map.design_points[map.num_points - 1];
    }
    return 0;
}

function mm_axis_unmap(axismap, ncv)
{
    if (ncv <= axismap.blend_points[0])
        return (axismap.design_points[0] << 16);

    for (var j = 1; j < axismap.num_points; j++)
    {
        if (ncv <= axismap.blend_points[j])
        {
            var t = FT_MulDiv(ncv - axismap.blend_points[j - 1], 0x10000, axismap.blend_points[j] - axismap.blend_points[j - 1]);
            return (axismap.design_points[j - 1] << 16) + FT_MulDiv(t, axismap.design_points[j] - axismap.design_points[j - 1], 1);
        }
    }

    return (axismap.design_points[axismap.num_points - 1] << 16);
}

function mm_weights_unmap(weights, w_s, axiscoords, a_s, axis_count)
{
    if (axis_count == 1)
        axiscoords[a_s] = weights[w_s + 1];
    else if (axis_count == 2)
    {
        axiscoords[a_s] = weights[w_s + 3] + weights[w_s + 1];
        axiscoords[a_s + 1] = weights[w_s + 3] + weights[w_s + 2];
    }
    else if (axis_count == 3)
    {
        axiscoords[a_s] = weights[w_s + 7] + weights[w_s + 5] + weights[w_s + 3] + weights[w_s + 1];
        axiscoords[a_s + 1] = weights[w_s + 7] + weights[w_s + 6] + weights[w_s + 3] + weights[w_s + 2];
        axiscoords[a_s + 2] = weights[w_s + 7] + weights[w_s + 6] + weights[w_s + 5] + weights[w_s + 4];
    }
    else
    {
        axiscoords[a_s] = weights[w_s + 15] + weights[w_s + 13] + weights[w_s + 11] + weights[w_s + 9] + weights[w_s + 7] + weights[w_s + 5] + weights[w_s + 3] + weights[w_s + 1];
        axiscoords[a_s + 1] = weights[w_s + 15] + weights[w_s + 14] + weights[w_s + 11] + weights[w_s + 10] + weights[w_s + 7] + weights[w_s + 6] + weights[w_s + 3] + weights[w_s + 2];
        axiscoords[a_s + 2] = weights[w_s + 15] + weights[w_s + 14] + weights[w_s + 13] + weights[w_s + 12] + weights[w_s + 7] + weights[w_s + 6] + weights[w_s + 5] + weights[w_s + 4];
        axiscoords[a_s + 3] = weights[w_s + 15] + weights[w_s + 14] + weights[w_s + 13] + weights[w_s + 12] + weights[w_s + 11] + weights[w_s + 10] + weights[w_s + 9] + weights[w_s + 8];
    }
}

function T1_Get_MM_Var(face)
{
    var mmvar = new FT_MM_Var();
    var mmaster = new FT_Multi_Master();
    var axiscoords = CreateIntArray(FT_Common.T1_MAX_MM_AXIS);
    var blend = face.blend;

    var error = T1_Get_Multi_Master(face, mmaster);
    if (error != 0)
        return { err: error, mm : null };

    var _num_axis = master.num_axis;
    mmvar.axis = new Array(_num_axis);
    for (var i = 0; i < _num_axis; i++)
        mmvar.axis[i] = new FT_Var_Axis();

    mmvar.num_axis = mmaster.num_axis;
    mmvar.num_designs = mmaster.num_designs;
    mmvar.num_namedstyles = 0xFFFFFFFF;                /* Does not apply */
    /* Point to axes after MM_Var struct */
    mmvar.namedstyle = null;

    for (var i = 0 ; i < _num_axis; i++)
    {
        var _axis = mmvar.axis[i];

        _axis.name = mmaster.axis[i].name;
        _axis.minimum = (mmaster.axis[i].minimum << 16);
        _axis.maximum = (mmaster.axis[i].maximum << 16);
        _axis.def = parseInt((_axis.minimum + _axis.maximum) / 2);
        /* Does not apply.  But this value is in range */
        _axis.strid = 0xFFFFFFFF;
        _axis.tag = 0xFFFFFFFF;

        if (_axis.name == "Weight")
            _axis.tag = 2003265652;//FT_MAKE_TAG("w", "g", "h", "t");
        else if (_axis.name == "Width")
            _axis.tag = 2003072104;//FT_MAKE_TAG("w", "d", "t", "h");
        else if (_axis.name == "OpticalSize")
            _axis.tag = 1869640570;//FT_MAKE_TAG("o", "p", "s", "z");
    }

    if (blend.num_designs == (1 << blend.num_axis))
    {
        mm_weights_unmap(blend.default_weight_vector, 0, axiscoords, 0, blend.num_axis);

        for (var i = 0; i < _num_axis; i++)
            mmvar.axis[i].def = mm_axis_unmap(blend.design_map[i], axiscoords[i]);
    }

    return { err : 0, mm : mmvar };
}

function T1_Set_MM_Blend(face, num_coords, coords)
{
    var blend = face.blend;
    if (blend != null)
        return FT_Common.FT_Err_Invalid_Argument;

    if (blend != null && blend.num_axis == num_coords)
    {
        for (var n = 0; n < blend.num_designs; n++)
        {
            var result = 0x10000;  /* 1.0 fixed */

            for (var m = 0; m < blend.num_axis; m++)
            {
                var factor = coords[m];
                if (factor < 0)
                    factor = 0;
                if (factor > 0x10000)
                    factor = 0x10000;
                if (( n & (1 << m)) == 0)
                    factor = 0x10000 - factor;

                result = FT_MulFix(result, factor);
            }
            blend.weight_vector[n] = result;
        }
    }

    return 0;
}

function T1_Set_MM_Design(face, num_coords, coords)
{
    var blend = face.blend;
    if (null == blend || blend.num_axis != num_coords)
        return FT_Common.FT_Err_Invalid_Argument;

    /* compute the blend coordinates through the blend design map */
    var final_blends = CreateIntArray(FT_Common.T1_MAX_MM_DESIGNS);

    for (var n = 0; n < blend.num_axis; n++)
    {
        var design = coords[n];
        var the_blend = 0;
        var map = blend.design_map[n];
        var designs = map.design_points;
        var blends = map.blend_points;
        var before = -1, after = -1;

        var is_go_to_found = 0;
        for (var p = 0; p < map.num_points; p++)
        {
            var p_design = designs[p];

            /* exact match? */
            if (design == p_design)
            {
                the_blend = blends[p];
                is_go_to_found = 1;
                break;
            }

            if (design < p_design)
            {
                after = p;
                break;
            }

            before = p;
        }

        if (0 == is_go_to_found)
        {
            /* now interpolate if necessary */
            if (before < 0)
                the_blend = blends[0];
            else if ( after < 0 )
                the_blend = blends[map.num_points - 1];
            else
                the_blend = FT_MulDiv(design - designs[before], blends[after] - blends[before], designs[after] - designs[before]);
        }

        final_blends[n] = the_blend;
    }

    var error = T1_Set_MM_Blend(face, num_coords, final_blends);
    return error;
}

function T1_Set_Var_Design(face, num_coords, coords)
{
    var lcoords = CreateIntArray(4);          /* maximum axis count is 4 */

    if (num_coords <= 4 && num_coords > 0)
    {
        for (var i = 0; i < num_coords; i++)
            lcoords[i] = FT_RoundFix(coords[i]) >> 16;
        var error = T1_Set_MM_Design(face, num_coords, lcoords);
        return error;
    }
    return FT_Common.FT_Err_Invalid_Argument;
}

function T1_Done_Blend(face)
{
    face.blend = null;
}

function t1_parse_blend_axis_types(face, loader)
{
    var axis_tokens = new Array(FT_Common.T1_MAX_MM_AXIS);
    for (var i = 0; i < FT_Common.T1_MAX_MM_AXIS; i++)
        axis_tokens[i] = new T1_TokenRec();

    /* take an array of objects */
    var num_axis = loader.parser.root.funcs.to_token_array(loader.parser.root, axis_tokens, FT_Common.T1_MAX_MM_AXIS);
    if (num_axis < 0)
    {
        loader.parser.root.error = FT_Common.FT_Err_Ignore;
        return;
    }
    if (num_axis == 0 || num_axis > FT_Common.T1_MAX_MM_AXIS)
    {
        loader.parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    /* allocate blend if necessary */
    var error = t1_allocate_blend(face, 0, num_axis);
    if (error != 0)
    {
        loader.parser.root.error = error;
        return;
    }

    var blend = face.blend;
    
    /* each token is an immediate containing the name of the axis */
    for (var n = 0; n < num_axis; n++)
    {
        var token = axis_tokens[n];
        
        /* skip first slash, if any */
        if (token.start.data[token.start.pos] == FT_Common.SYMBOL_CONST_BS)
            token.start.pos++;

        var len = token.limit - token.start.pos;
        if (len == 0)
        {
            loader.parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
            return;
        }

        blend.axis_names[n] = "";
        for (var i = 0; i < len; i++)
        {
            blend.axis_names[n] += String.fromCharCode(token.start.data[token.start.pos + n]);
        }
    }

    loader.parser.root.error = error;
}

function t1_parse_blend_design_positions(face, loader)
{
    var design_tokens = new Array(FT_Common.T1_MAX_MM_DESIGNS);
    for (var i = 0; i < FT_Common.T1_MAX_MM_DESIGNS; i++)
        design_tokens[i] = new T1_TokenRec();

    var parser = loader.parser;

    /* get the array of design tokens -- compute number of designs */
    var num_designs = parser.root.funcs.to_token_array(parser.root, design_tokens, FT_Common.T1_MAX_MM_DESIGNS);
    if (num_designs < 0)
    {
        parser.root.error = FT_Common.FT_Err_Ignore;
        return;
    }
    if (num_designs == 0 || num_designs > FT_Common.T1_MAX_MM_DESIGNS)
    {
        loader.parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var old_cursor = parser.root.cursor;
    var old_limit = parser.root.limit;

    var blend = face.blend;
    var num_axis = 0;  /* make compiler happy */

    var error = 0;
    for (var n = 0; n < num_designs; n++)
    {
        /* read axis/coordinates tokens */
        var token = design_tokens[n];
        parser.root.cursor = token.start.pos;
        parser.root.limit = token.limit;

        var axis_tokens = new Array(FT_Common.T1_MAX_MM_AXIS);
        for (var i = 0; i < FT_Common.T1_MAX_MM_AXIS; i++)
            axis_tokens[i] = new T1_TokenRec();
        
        var n_axis = parser.root.funcs.to_token_array(parser.root, axis_tokens, FT_Common.T1_MAX_MM_AXIS);

        if (n == 0)
        {
            if (n_axis <= 0 || n_axis > FT_Common.T1_MAX_MM_AXIS)
            {
                loader.parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
                return;
            }

            num_axis = n_axis;
            error = t1_allocate_blend( face, num_designs, num_axis );
            if (error != 0)
            {
                loader.parser.root.error = error;
                return;
            }
            blend = face.blend;
        }
        else if (n_axis != num_axis)
        {
            loader.parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
            return;
        }

        /* now read each axis token into the design position */
        for (var axis = 0; axis < n_axis; axis++)
        {
            var token2 = axis_tokens[axis];

            parser.root.cursor = token2.start.pos;
            parser.root.limit  = token2.limit;
            blend.design_pos[n][axis] = parser.root.funcs.to_fixed(parser, 0);
        }
    }

    parser.root.cursor = old_cursor;
    parser.root.limit  = old_limit;

    parser.root.error = error;
}

function t1_parse_blend_design_map(face, loader)
{
    var parser = loader.parser;

    var axis_tokens = new Array(FT_Common.T1_MAX_MM_AXIS);
    for (var i = 0; i < FT_Common.T1_MAX_MM_AXIS; i++)
        axis_tokens[i] = new T1_TokenRec();

    var num_axis = parser.root.funcs.to_token_array(parser.root, axis_tokens, FT_Common.T1_MAX_MM_AXIS);

    if (num_axis < 0)
    {
        parser.root.error = FT_Common.FT_Err_Ignore;
        return;
    }
    if (num_axis == 0 || num_axis > FT_Common.T1_MAX_MM_AXIS)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var old_cursor = parser.root.cursor;
    var old_limit = parser.root.limit;

    var error = t1_allocate_blend(face, 0, num_axis);
    if (error != 0)
    {
        parser.root.error = error;
        return;
    }
    var blend = face.blend;

    /* now read each axis design map */
    for (var n = 0; n < num_axis; n++)
    {
        var map = blend.design_map[n];

        var point_tokens = new Array(FT_Common.T1_MAX_MM_MAP_POINTS);
        for (var i = 0; i < FT_Common.T1_MAX_MM_MAP_POINTS; i++)
            point_tokens[i] = new T1_TokenRec();

        var axis_token = axis_tokens[n];

        parser.root.cursor = axis_token.start.pos;
        parser.root.limit  = axis_token.limit;

        var num_points = parser.root.funcs.to_token_array(parser.root, point_tokens, FT_Common.T1_MAX_MM_MAP_POINTS);

        if (num_points <= 0 || num_points > FT_Common.T1_MAX_MM_MAP_POINTS)
        {
            parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
            return;
        }

        /* allocate design map data */
        map.design_points = CreateIntArray(num_points);
        map.blend_points = CreateIntArray(num_points);
        map.num_points = num_points;

        for (var p = 0; p < num_points; p++)
        {
            var point_token = point_tokens[p];

            /* don't include delimiting brackets */
            parser.root.cursor = point_token.start.pos + 1;
            parser.root.limit = point_token.limit - 1;

            map.design_points[p] = parser.root.funcs.to_int(parser.root);
            map.blend_points [p] = parser.root.funcs.to_fixed(parser.root, 0);
        }
    }

    parser.root.cursor = old_cursor;
    parser.root.limit  = old_limit;

    parser.root.error = error;
}

function t1_parse_weight_vector(face, loader)
{
    var design_tokens = new Array(FT_Common.T1_MAX_MM_DESIGNS);
    for (var i = 0; i < FT_Common.T1_MAX_MM_DESIGNS; i++)
        design_tokens[i] = new T1_TokenRec();

    var parser = loader.parser;
    var blend = face.blend;
    var num_designs = parser.root.funcs.to_token_array(parser.root, design_tokens, FT_Common.T1_MAX_MM_DESIGNS);
    if (num_designs < 0)
    {
        parser.root.error = FT_Common.FT_Err_Ignore;
        return;
    }
    if (num_designs == 0 || num_designs > FT_Common.T1_MAX_MM_DESIGNS)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var error = 0;
    if (blend == null || blend.num_designs == 0)
    {
        error = t1_allocate_blend(face, num_designs, 0 );
        if (error != 0)
        {
            parser.root.error = error;
            return;
        }
        blend = face.blend;
    }
    else if (blend.num_designs != num_designs)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var old_cursor = parser.root.cursor;
    var old_limit = parser.root.limit;

    for (var n = 0; n < num_designs; n++)
    {
        var token = design_tokens[n];
        parser.root.cursor = token.start.pos;
        parser.root.limit = token.limit;

        var _temp = parser.root.funcs.to_fixed(parser.root, 0);
        blend.weight_vector[n] = _temp;
        blend.weight_vector[blend.default_weight_vector + n] = _temp;
    }

    parser.root.cursor = old_cursor;
    parser.root.limit  = old_limit;

    parser.root.error = error;
}

function t1_parse_buildchar(face, loader)
{
    face.len_buildchar = loader.parser.funcs.to_fixed_array(loader.parser.root, 0, null, 0);
}

function t1_load_keyword(face, loader, field)
{
    var blend = face.blend;
    if (blend != null && blend.num_designs == 0)
        blend = null;

    /* if the keyword has a dedicated callback, call it */
    if (field.type == FT_Common.T1_FIELD_TYPE_CALLBACK)
    {
        field.reader(face, loader);
        return loader.parser.root.error;
    }

    var max_objects = 0;
    var arr = null;

    /* now, the keyword is either a simple field, or a table of fields; */
    /* we are now going to take care of it                              */
    switch (field.location)
    {
        case FT_Common.T1_FIELD_LOCATION_FONT_INFO:
            if (blend != null)
            {
                arr = blend.font_infos;
                max_objects = blend.num_designs;
            }
            else
            {
                arr = new Array(1);
                arr[0] = face.type1.font_info;
                max_objects  = 0;
            }
            break;

        case FT_Common.T1_FIELD_LOCATION_FONT_EXTRA:
            arr = new Array(1);
            arr[0] = face.type1.font_extra;
            max_objects  = 0;
            break;

        case FT_Common.T1_FIELD_LOCATION_PRIVATE:
            if (blend != null)
            {
                arr = blend.privates;
                max_objects = blend.num_designs;
            }
            else
            {
                arr = new Array(1);
                arr[0] = face.type1.private_dict;
                max_objects = 0;
            }
            break;

        case FT_Common.T1_FIELD_LOCATION_BBOX:
            if (blend != null)
            {
                arr = blend.bboxes;
                max_objects = blend.num_designs;
            }
            else
            {
                arr = new Array(1);
                arr[0] = face.type1.font_bbox;
                max_objects = 0;
            }
            break;

        case FT_Common.T1_FIELD_LOCATION_LOADER:
            arr = new Array(1);
            arr[0] = loader;
            max_objects  = 0;
            break;

        case FT_Common.T1_FIELD_LOCATION_FACE:
            arr = new Array(1);
            arr[0] = face;
            max_objects  = 0;
            break;

        case FT_Common.T1_FIELD_LOCATION_BLEND:
            arr = new Array(1);
            arr[0] = loader;
            max_objects  = 0;
            break;

        default:
            arr = new Array(1);
            arr[0] = face.type1;
            max_objects  = 0;
    }

    if (field.type == FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY || field.type == FT_Common.T1_FIELD_TYPE_FIXED_ARRAY)
        return loader.parser.root.funcs.load_field_table(loader.parser.root, field, arr, max_objects, 0);

    return loader.parser.root.funcs.load_field(loader.parser.root, field, arr, max_objects, 0);
}

function t1_parse_private(face, loader)
{
    loader.keywords_encountered |= FT_Common.T1_PRIVATE;
}

function _t1_read_binary_data(parser)
{
    var ret = { size: 0, base: null, err: 0 };

    var limit = parser.root.limit;

    /* the binary data has one of the following formats */
    /*                                                  */
    /*   `size' [white*] RD white ....... ND            */
    /*   `size' [white*] -| white ....... |-            */
    /*                                                  */

    parser.root.funcs.skip_spaces(parser.root);
    var cur = dublicate_pointer(parser.root.cursor);

    if (cur.pos < limit && (cur.data[cur.pos] >= FT_Common.SYMBOL_CONST_0) && (cur.data[cur.pos] <= FT_Common.SYMBOL_CONST_9))
    {
        var s = parser.root.funcs.to_int(parser.root);
        parser.root.funcs.skip_PS_token(parser.root);

        /* there is only one whitespace char after the */
        /* `RD' or `-|' token                          */
        ret.base = dublicate_pointer(parser.root.cursor);
        ret.base.pos += 1;

        if (s >= 0 && s < (limit - ret.base.pos))
        {
            parser.root.cursor.pos += (s + 1);
            ret.size = s;
            ret.err = (parser.root.error == 0) ? 1 : 0;
            return ret;
        }
    }

    parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
    return ret;
}

function t1_parse_font_matrix(face, loader)
{
    var parser = loader.parser;
    var matrix = face.type1.font_matrix;
    var offset = face.type1.font_offset;

    var temp = CreateIntArray(6);

    var result = parser.root.funcs.to_fixed_array(parser.root, 6, temp, 3);

    if (result < 0)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var temp_scale = Math.abs(temp[3]);

    if (temp_scale == 0)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    /* Set Units per EM based on FontMatrix values.  We set the value to */
    /* 1000 / temp_scale, because temp_scale was already multiplied by   */
    /* 1000 (in t1_tofixed, from psobjs.c).                              */
    face.units_per_EM = (FT_DivFix(1000 * 0x10000, temp_scale) >> 16);

    /* we need to scale the values by 1.0/temp_scale */
    if (temp_scale != 0x10000)
    {
        temp[0] = FT_DivFix(temp[0], temp_scale);
        temp[1] = FT_DivFix(temp[1], temp_scale);
        temp[2] = FT_DivFix(temp[2], temp_scale);
        temp[4] = FT_DivFix(temp[4], temp_scale);
        temp[5] = FT_DivFix(temp[5], temp_scale);
        temp[3] = temp[3] < 0 ? -0x10000 : 0x10000;
    }

    matrix.xx = temp[0];
    matrix.yx = temp[1];
    matrix.xy = temp[2];
    matrix.yy = temp[3];

    /* note that the offsets must be expressed in integer font units */
    offset.x = temp[4] >> 16;
    offset.y = temp[5] >> 16;
}

function t1_parse_encoding(face, loader)
{
    var parser = loader.parser;
    var limit = parser.root.limit;

    var memory = parser.root.memory;

    var psaux = face.psaux;

    parser.root.funcs.skip_spaces(parser.root);
    var cur = dublicate_pointer(parser.root.cursor);
    if (cur.pos >= limit)
    {
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    /* if we have a number or `[', the encoding is an array, */
    /* and we must load it now                               */
    var _cur_v = cur.data[cur.pos];
    if ((_cur_v >= FT_Common.SYMBOL_CONST_0 && _cur_v <= FT_Common.SYMBOL_CONST_9) || _cur_v == FT_Common.SYMBOL_CONST_LS2)
    {
        var encode = face.type1.encoding;
        var count, n;
        var char_table = loader.encoding_table;
        var only_immediates = 0;

        /* read the number of entries in the encoding; should be 256 */
        if (_cur_v == FT_Common.SYMBOL_CONST_LS2)
        {
            count = 256;
            only_immediates = 1;
            parser.root.cursor.pos++;
        }
        else
            count = parser.root.funcs.to_int(parser.root);

        parser.root.funcs.skip_spaces(parser.root);
        if (parser.root.cursor.pos >= limit)
            return;

        /* we use a T1_Table to store our charnames */
        loader.num_chars = encode.num_chars = count;

        encode.char_index = CreateUIntArray(count);
        encode.char_name = CreateNullArray(count);
        var error = psaux.ps_table_funcs.init(char_table, count, memory);
        if (error != 0)
        {
            parser.root.error = error;
            return;
        }

        /* We need to `zero' out encoding_table.elements */
        for (n = 0; n < count; n++)
        {
            var notdef_name = memory.Alloc(8);
            notdef_name.data[0] = FT_Common.SYMBOL_CONST_POINT;
            notdef_name.data[1] = FT_Common.SYMBOL_CONST_n;
            notdef_name.data[2] = FT_Common.SYMBOL_CONST_o;
            notdef_name.data[3] = FT_Common.SYMBOL_CONST_t;
            notdef_name.data[4] = FT_Common.SYMBOL_CONST_d;
            notdef_name.data[5] = FT_Common.SYMBOL_CONST_e;
            notdef_name.data[6] = FT_Common.SYMBOL_CONST_f;
            notdef_name.data[7] = FT_Common.SYMBOL_CONST_S0;

            char_table.funcs.add(char_table, n, notdef_name, 8)
        }

        /* Now we need to read records of the form                */
        /*                                                        */
        /*   ... charcode /charname ...                           */
        /*                                                        */
        /* for each entry in our table.                           */
        /*                                                        */
        /* We simply look for a number followed by an immediate   */
        /* name.  Note that this ignores correctly the sequence   */
        /* that is often seen in type1 fonts:                     */
        /*                                                        */
        /*   0 1 255 { 1 index exch /.notdef put } for dup        */
        /*                                                        */
        /* used to clean the encoding array before anything else. */
        /*                                                        */
        /* Alternatively, if the array is directly given as       */
        /*                                                        */
        /*   /Encoding [ ... ]                                    */
        /*                                                        */
        /* we only read immediates.                               */

        n = 0;
        parser.root.funcs.skip_spaces(parser.root);

        while (parser.root.cursor.pos < limit)
        {
            cur.pos = parser.root.cursor.pos;

            /* we stop when we encounter a `def' or `]' */
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_d && cur.pos + 3 < limit)
            {
                if (cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_e && cur.data[cur.pos + 2] == FT_Common.SYMBOL_CONST_f && IS_PS_DELIM(cur.data[cur.pos + 3]))
                {
                    cur.pos += 3;
                    break;
                }
            }
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_RS2)
            {
                cur.pos++;
                break;
            }

            /* check whether we've found an entry */
            if (((cur.data[cur.pos] >= FT_Common.SYMBOL_CONST_0) && (cur.data[cur.pos] <= FT_Common.SYMBOL_CONST_9)) || (only_immediates == 1))
            {
                var charcode = 0;

                if (only_immediates == 1)
                    charcode = n;
                else
                {
                    charcode = parser.root.funcs.to_int(parser.root);
                    parser.root.funcs.skip_spaces(parser.root);
                }

                cur.pos = parser.root.cursor.pos;

                if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS && (cur.pos + 2) < limit && (n < count))
                {
                    cur.pos++;
                    parser.root.cursor.pos = cur.pos;
                    parser.root.funcs.skip_PS_token(parser.root);
                    if (parser.root.error != 0)
                        return;

                    var len = parser.root.cursor.pos - cur.pos;

                    parser.root.error = char_table.funcs.add(char_table, charcode, cur, len + 1);
                    if (parser.root.error != 0)
                        return;
                    char_table.elements[charcode][len] = FT_Common.SYMBOL_CONST_S0;

                    n++;
                }
                else if (only_immediates == 1)
                {
                    /* Since the current position is not updated for           */
                    /* immediates-only mode we would get an infinite loop if   */
                    /* we don't do anything here.                              */
                    /*                                                         */
                    /* This encoding array is not valid according to the type1 */
                    /* specification (it might be an encoding for a CID type1  */
                    /* font, however), so we conclude that this font is NOT a  */
                    /* type1 font.                                             */
                    parser.root.error = FT_Common.FT_Err_Unknown_File_Format;
                    return;
                }
            }
            else
            {
                parser.root.funcs.skip_PS_token(parser.root);
                if (parser.root.error != 0)
                    return;
            }

            parser.root.funcs.skip_spaces(parser.root);
        }

        face.type1.encoding_type = FT_Common.T1_ENCODING_TYPE_ARRAY;
        parser.root.cursor.pos = cur.pos;
    }
    else
    {
        if (cur.pos + 17 < limit && _strncmp_data(cur, "StandardEncoding", 16) == 0)
            face.type1.encoding_type = FT_Common.T1_ENCODING_TYPE_STANDARD;
        else if (cur + 15 < limit && _strncmp_data(cur, "ExpertEncoding", 14) == 0)
            face.type1.encoding_type = FT_Common.T1_ENCODING_TYPE_EXPERT;
        else if (cur + 18 < limit && _strncmp_data(cur, "ISOLatin1Encoding", 17) == 0)
            face.type1.encoding_type = FT_Common.T1_ENCODING_TYPE_ISOLATIN1;
        else
            parser.root.error = FT_Common.FT_Err_Ignore;
    }
}

function t1_parse_subrs(face, loader)
{
    var parser = loader.parser;
    var table = loader.subrs;
    var memory = parser.root.memory;

    var psaux = face.psaux;
    parser.root.funcs.skip_spaces(parser.root);

    /* test for empty array */
    if (parser.root.cursor.pos < parser.root.limit && parser.root.cursor.data[parser.root.cursor.pos] == FT_Common.SYMBOL_CONST_LS2)
    {
        parser.root.funcs.skip_PS_token(parser.root);
        parser.root.funcs.skip_spaces(parser.root);

        if (parser.root.cursor.pos >= parser.root.limit || parser.root.cursor.data[parser.root.cursor.pos] != FT_Common.SYMBOL_CONST_RS2)
        parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
        return;
    }

    var num_subrs = parser.root.funcs.to_int(parser.root);

    /* position the parser right before the `dup' of the first subr */
    parser.root.funcs.skip_PS_token(parser.root);
    if (parser.root.error != 0)
        return;

    parser.root.funcs.skip_spaces(parser.root);

    var error = 0;
    /* initialize subrs array -- with synthetic fonts it is possible */
    /* we get here twice                                             */
    if (loader.num_subrs == 0)
    {
        error = psaux.ps_table_funcs.init(table, num_subrs, memory);
        if (error != 0)
        {
            parser.root.error = 0;
            return;
        }
    }

    /* the format is simple:   */
    /*                         */
    /*   `index' + binary data */
    /*                         */
    for (;;)
    {
        /* If the next token isn't `dup' we are done. */
        if (_strncmp_data(parser.root.cursor, "dup", 3) != 0)
            break;

        parser.root.funcs.skip_PS_token(parser.root);

        var idx = parser.root.funcs.to_int(parser.root);

        var ret = _t1_read_binary_data(parser);

        var size = ret.size;
        var base = ret.base;
        if (0 == ret.err)
            return;

        /* The binary string is followed by one token, e.g. `NP' */
        /* (bound to `noaccess put') or by two separate tokens:  */
        /* `noaccess' & `put'.  We position the parser right     */
        /* before the next `dup', if any.                        */
        parser.root.funcs.skip_PS_token(parser.root);
        if (parser.root.error != 0)
            return;

        parser.root.funcs.skip_spaces(parser.root);

        if (_strncmp_data(parser.root.cursor, "put", 3) == 0)
        {
            parser.root.funcs.skip_PS_token(parser.root);
            parser.root.funcs.skip_spaces(parser);
        }

        /* with synthetic fonts it is possible we get here twice */
        if (loader.num_subrs != 0)
            continue;

        /* some fonts use a value of -1 for lenIV to indicate that */
        /* the charstrings are unencoded                           */
        /*                                                         */
        /* thanks to Tom Kacvinsky for pointing this out           */
        /*                                                         */
        if (face.type1.private_dict.lenIV >= 0)
        {
            /* some fonts define empty subr records -- this is not totally */
            /* compliant to the specification (which says they should at   */
            /* least contain a `return'), but we support them anyway       */
            if (size < face.type1.private_dict.lenIV)
            {
                parser.root.error = FT_Common.FT_Err_Invalid_File_Format;
                return;
            }

            /* t1_decrypt() shouldn't write to base -- make temporary copy */
            var temp = memory.Alloc(size);
            for (var i = 0; i < size; i++)
            {
                temp.data[i] = base.data[base.pos + i];
            }

            psaux.t1_decrypt(temp, size, 4330);
            size -= face.type1.private_dict.lenIV;

            temp.pos += face.type1.private_dict.lenIV;
            error = table.funcs.add(table, idx, temp, size);

            temp = null;
        }
        else
            error = table.funcs.add(table, idx, base, size);

        if (error != 0)
        {
            parser.root.error = error;
        }
    }

    if (loader.num_subrs == 0)
        loader.num_subrs = num_subrs;
}

function t1_parse_charstrings(face, loader)
{
    var parser = loader.parser;
    var code_table = loader.charstrings;
    var name_table = loader.glyph_names;
    var swap_table = loader.swap_table;
    var memory = parser.root.memory;

    var psaux = face.psaux;

    var limit = parser.root.limit;
    var n = 0;
    var notdef_index = 0;
    var notdef_found = 0;

    var num_glyphs = parser.root.funcs.to_int(parser.root);
    /* some fonts like Optima-Oblique not only define the /CharStrings */
    /* array but access it also                                        */
    if (num_glyphs == 0 || parser.root.error != 0)
        return;

    /* initialize tables, leaving space for addition of .notdef, */
    /* if necessary, and a few other glyphs to handle buggy      */
    /* fonts which have more glyphs than specified.              */

    /* for some non-standard fonts like `Optima' which provides  */
    /* different outlines depending on the resolution it is      */
    /* possible to get here twice                                */

    var root = parser.root;

    var error = 0;
    if (loader.num_glyphs == 0)
    {
        error = psaux.ps_table_funcs.init(code_table, num_glyphs + 1 + FT_Common.TABLE_EXTEND, memory);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = psaux.ps_table_funcs.init(name_table, num_glyphs + 1 + FT_Common.TABLE_EXTEND, memory);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        /* Initialize table for swapping index notdef_index and */
        /* index 0 names and codes (if necessary).              */
        error = psaux.ps_table_funcs.init(swap_table, 4, memory);
        if (error != 0)
        {
            root.error = error;
            return error;
        }
    }

    n = 0;

    for (;;)
    {
        /* the format is simple:        */
        /*   `/glyphname' + binary data */

        root.funcs.skip_spaces(root);

        var cur = dublicate_pointer(root.cursor);
        if (cur.pos >= limit)
            break;

        /* we stop when we find a `def' or `end' keyword */
        if (cur.pos + 3 < limit && IS_PS_DELIM(cur.data[cur.pos + 3]))
        {
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_d && cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_e && cur.data[cur.pos + 2] == FT_Common.SYMBOL_CONST_f)
            {
                /* There are fonts which have this: */
                /*                                  */
                /*   /CharStrings 118 dict def      */
                /*   Private begin                  */
                /*   CharStrings begin              */
                /*   ...                            */
                /*                                  */
                /* To catch this we ignore `def' if */
                /* no charstring has actually been  */
                /* seen.                            */
                if (n != 0)
                    break;
            }

            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_e && cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_n && cur.data[cur.pos + 2] == FT_Common.SYMBOL_CONST_d)
                break;
        }

        root.funcs.skip_PS_token(root);
        if (root.error != 0)
            return;

        if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS)
        {
            if (cur.pos + 1 >= limit)
            {
                root.error = FT_Common.FT_Err_Invalid_File_Format;
                return;
            }

            cur.pos++;                              /* skip `/' */
            var len = root.cursor.pos - cur.pos;

            var ret = _t1_read_binary_data(parser);

            if (ret.err == 0)
                return;

            var size = ret.size;
            var base = ret.base;

            /* for some non-standard fonts like `Optima' which provides */
            /* different outlines depending on the resolution it is     */
            /* possible to get here twice                               */
            if (loader.num_glyphs != 0)
                continue;

            error = name_table.funcs.add(name_table, n, cur, len + 1);
            if (error != 0)
            {
                root.error = error;
                return;
            }

            /* add a trailing zero to the name table */
            name_table.elements[n].data[name_table.elements[n].pos + len] = FT_Common.SYMBOL_CONST_S0;

            /* record index of /.notdef */
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_POINT && _strcmp_data(".notdef", name_table.elements[n]) == 0)
            {
                notdef_index = n;
                notdef_found = 1;
            }

            if (face.type1.private_dict.lenIV >= 0 && (n < (num_glyphs + FT_Common.TABLE_EXTEND)))
            {
                if (size <= face.type1.private_dict.lenIV)
                {
                    root.error = FT_Common.FT_Err_Invalid_File_Format;
                    return;
                }

                /* t1_decrypt() shouldn't write to base -- make temporary copy */
                var temp = memory.Alloc(size);

                for (var i = 0; i < size; i++)
                    temp.data[i] = base.data[base.pos + i];


                psaux.t1_decrypt(temp, size, 4330);
                size -= face.type1.private_dict.lenIV;

                temp.pos += face.type1.private_dict.lenIV;
                error = code_table.funcs.add(code_table, n, temp, size);

                temp = null;
            }
            else
                error = code_table.funcs.add(code_table, n, base, size);

            if (error != 0)
            {
                root.error = error;
                return;
            }

            n++;
        }
    }

    loader.num_glyphs = n;

    /* if /.notdef is found but does not occupy index 0, do our magic. */
    if (notdef_found != 0 && _strcmp_data(".notdef", name_table.elements[0]))
    {
        /* Swap glyph in index 0 with /.notdef glyph.  First, add index 0  */
        /* name and code entries to swap_table.  Then place notdef_index   */
        /* name and code entries into swap_table.  Then swap name and code */
        /* entries at indices notdef_index and 0 using values stored in    */
        /* swap_table.                                                     */

        /* Index 0 name */
        error = swap_table.funcs.add(swap_table, 0, name_table.elements[0], name_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        /* Index 0 code */
        error = swap_table.funcs.add(swap_table, 1, code_table.elements[0], code_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        /* Index notdef_index name */
        error = swap_table.funcs.add(swap_table, 2, name_table.elements[notdef_index], name_table.lengths[notdef_index]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        /* Index notdef_index code */
        error = swap_table.funcs.add(swap_table, 3, code_table.elements[notdef_index], code_table.lengths[notdef_index]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = name_table.funcs.add(name_table, notdef_index, swap_table.elements[0], swap_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = code_table.funcs.add(code_table, notdef_index, swap_table.elements[1], swap_table.lengths[1]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = name_table.funcs.add(name_table, 0, swap_table.elements[2], swap_table.lengths[2]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = code_table.funcs.add(code_table, 0, swap_table.elements[3], swap_table.lengths[3]);
        if (error != 0)
        {
            root.error = error;
            return;
        }
    }
    else if (notdef_found == 0)
    {
        /* notdef_index is already 0, or /.notdef is undefined in   */
        /* charstrings dictionary.  Worry about /.notdef undefined. */
        /* We take index 0 and add it to the end of the table(s)    */
        /* and add our own /.notdef glyph to index 0.               */

        /* 0 333 hsbw endchar */
        var notdef_glyph = memory.Alloc(5);
        notdef_glyph.data[0] = 0x8B;
        notdef_glyph.data[1] = 0xF7;
        notdef_glyph.data[2] = 0xE1;
        notdef_glyph.data[3] = 0x0D;
        notdef_glyph.data[4] = 0x0E;

        var notdef_name = memory.Alloc(8);
        notdef_name.data[0] = FT_Common.SYMBOL_CONST_POINT;
        notdef_name.data[1] = FT_Common.SYMBOL_CONST_n;
        notdef_name.data[2] = FT_Common.SYMBOL_CONST_o;
        notdef_name.data[3] = FT_Common.SYMBOL_CONST_t;
        notdef_name.data[4] = FT_Common.SYMBOL_CONST_d;
        notdef_name.data[5] = FT_Common.SYMBOL_CONST_e;
        notdef_name.data[6] = FT_Common.SYMBOL_CONST_f;
        notdef_name.data[7] = FT_Common.SYMBOL_CONST_S0;

        error = swap_table.funcs.add(swap_table, 0, name_table.elements[0], name_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = swap_table.funcs.add(swap_table, 1, code_table.elements[0], code_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = name_table.funcs.add(name_table, 0, notdef_name, 8);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = code_table.funcs.add(code_table, 0, notdef_glyph, 5);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = name_table.funcs.add(name_table, n, swap_table.elements[0], swap_table.lengths[0]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        error = code_table.funcs.add(code_table, n, swap_table.elements[1], swap_table.lengths[1]);
        if (error != 0)
        {
            root.error = error;
            return;
        }

        /* we added a glyph. */
        loader.num_glyphs += 1;
    }
}

function _t1_parse_dict(face, loader, base, size)
{
    var parser = loader.parser;
    var have_integer = 0;

    parser.root.cursor = dublicate_pointer(base);
    parser.root.limit  = base.pos + size;
    parser.root.error  = 0;

    var limit = parser.root.limit;

    parser.root.funcs.skip_spaces(parser.root);

    var start_binary = dublicate_pointer(parser.root.cursor);
    
    while (parser.root.cursor.pos < limit)
    {
        var cur = dublicate_pointer(parser.root.cursor);

        /* look for `eexec' */
        if (IS_PS_TOKEN(cur, limit, "eexec", 6) == 1)
            break;

        /* look for `closefile' which ends the eexec section */
        else if (IS_PS_TOKEN(cur, limit, "closefile", 10) == 1)
            break;

        /* in a synthetic font the base font starts after a           */
        /* `FontDictionary' token that is placed after a Private dict */
        else if (IS_PS_TOKEN(cur, limit, "FontDirectory", 14) == 1)
        {
            if (loader.keywords_encountered & FT_Common.T1_PRIVATE)
                loader.keywords_encountered |= FT_Common.T1_FONTDIR_AFTER_PRIVATE;
            parser.root.cursor.pos += 13;
        }
        /* check whether we have an integer */
        else if (cur.data[cur.pos] >= FT_Common.SYMBOL_CONST_0 && cur.data[cur.pos] <= FT_Common.SYMBOL_CONST_9)
        {
            start_binary.pos = cur.pos;
            parser.root.funcs.skip_PS_token(parser.root);
            if (parser.root.error != 0)
                return parser.root.error;
            have_integer = 1;
        }

        /* in valid Type 1 fonts we don't see `RD' or `-|' directly */
        /* since those tokens are handled by parse_subrs and        */
        /* parse_charstrings                                        */
        else if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_R && ((cur.pos + 6) < limit) && cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_D && have_integer == 1)
        {
            parser.root.cursor.pos = start_binary.pos;

            var ret = _t1_read_binary_data(parser);
            if (0 == ret.err)
                return FT_Common.FT_Err_Invalid_File_Format;
            have_integer = 0;
        }
        else if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_MATH_MINUS && ((cur.pos + 6) < limit) && cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_LOGOR &&  have_integer == 1)
        {
            var ret = _t1_read_binary_data(parser);
            if (0 == ret.err)
                return FT_Common.FT_Err_Invalid_File_Format;
            have_integer = 0;
        }

        /* look for immediates */
        else if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS && ((cur.pos + 2) < limit))
        {
            cur.pos++;

            parser.root.cursor.pos = cur.pos;
            parser.root.funcs.skip_PS_token(parser.root);
            if (parser.root.error != 0)
                return parser.root.error;

            var len = parser.root.cursor.pos - cur.pos;

            if (len > 0 && len < 22 && parser.root.cursor.pos < limit)
            {
                /* now compare the immediate name to the keyword table */
                for (var _i = 0; _i < t1_keywords.length; _i++)
                {
                    var keyword = t1_keywords[_i];
                    var name = keyword.ident;
                    if (name == null)
                        break;

                    if (cur.data[cur.pos] == name.charCodeAt(0) && len == name.length && _strncmp_data(cur, name, len) == 0)
                    {
                        var dict = ((loader.keywords_encountered & FT_Common.T1_PRIVATE) != 0) ? FT_Common.T1_FIELD_DICT_PRIVATE : FT_Common.T1_FIELD_DICT_FONTDICT;

                        if ((dict & keyword.dict) == 0)
                        {
                            break;
                        }

                        if (((loader.keywords_encountered & FT_Common.T1_FONTDIR_AFTER_PRIVATE) == 0) || (name == "CharStrings"))
                        {
                            parser.root.error = t1_load_keyword(face, loader, keyword);
                            if (parser.root.error != 0)
                            {
                                if (parser.root.error == FT_Common.FT_Err_Ignore)
                                    parser.root.error = 0;
                                else
                                    return parser.root.error;
                            }
                        }
                        break;
                    }
                }
            }

            have_integer = 0;
        }
        else
        {
            parser.root.funcs.skip_PS_token(parser.root);
            if (parser.root.error != 0)
                return parser.root.error;
            have_integer = 0;
        }

        parser.root.funcs.skip_spaces(parser.root);
    }

    return parser.root.error;
}

function t1_init_loader(loader, face)
{
    loader.clear();

    loader.num_glyphs = 0;
    loader.num_chars  = 0;

    /* initialize the tables -- simply set their `init' field to 0 */
    loader.encoding_table.init  = 0;
    loader.charstrings.init     = 0;
    loader.glyph_names.init     = 0;
    loader.subrs.init           = 0;
    loader.swap_table.init      = 0;
    loader.fontdata             = 0;
    loader.keywords_encountered = 0;
}

function t1_done_loader(loader)
{
    var parser = loader.parser;

    /* finalize tables */
    if (loader.encoding_table.funcs.release != null)
        loader.encoding_table.funcs.release(loader.encoding_table);

    if (loader.charstrings.funcs.release != null)
        loader.charstrings.funcs.release(loader.charstrings);

    if (loader.glyph_names.funcs.release != null)
        loader.glyph_names.funcs.release(loader.glyph_names);

    if (loader.swap_table.funcs.release != null)
        loader.swap_table.funcs.release(loader.swap_table);

    if (loader.subrs.funcs.release != null)
        loader.subrs.funcs.release(loader.subrs);

    /* finalize parser */
    T1_Finalize_Parser(parser);
}

function T1_Open_Face(face)
{
    var loader = new T1_Loader();
    var type1 = face.type1;
    var priv = type1.private_dict;

    var psaux = face.psaux;

    t1_init_loader(loader, face);

    /* default values */
    face.ndv_idx          = -1;
    face.cdv_idx          = -1;
    face.len_buildchar    = 0;

    priv.blue_shift       = 7;
    priv.blue_fuzz        = 1;
    priv.lenIV            = 4;
    priv.expansion_factor = parseInt(0.06 * 0x10000);
    priv.blue_scale       = parseInt(0.039625 * 0x10000 * 1000);

    var parser = loader.parser;
    var error = T1_New_Parser(parser, face.stream, face.memory, psaux);
    if (error != 0)
    {
        t1_done_loader(loader);
        return error;
    }

    error = _t1_parse_dict(face, loader, parser.base_dict, parser.base_len);
    if (error != 0)
    {
        t1_done_loader(loader);
        return error;
    }

    error = T1_Get_Private_Dict(parser, psaux);
    if (error != 0)
    {
        t1_done_loader(loader);
        return error;
    }

    error = _t1_parse_dict(face, loader, parser.private_dict, parser.private_len);
    if (error != 0)
    {
        t1_done_loader(loader);
        return error;
    }

    /* ensure even-ness of `num_blue_values' */
    priv.num_blue_values &= 0xFFFFFFFE;

    //#ifndef T1_CONFIG_OPTION_NO_MM_SUPPORT

    if (face.blend != null && face.blend.num_default_design_vector != 0 && face.blend.num_default_design_vector != face.blend.num_axis)
    {
        face.blend.num_default_design_vector = 0;
    }

    /* the following can happen for MM instances; we then treat the */
    /* font as a normal PS font                                     */
    if (face.blend != null && (face.blend.num_designs == 0 || face.blend.num_axis == 0))
        T1_Done_Blend(face);

    /* another safety check */
    if (face.blend != null)
    {
        for (var i = 0; i < face.blend.num_axis; i++)
        {
            if (face.blend.design_map[i].num_points == 0)
            {
                T1_Done_Blend(face);
                break;
            }
        }
    }

    if (face.blend != null)
    {
        if (face.len_buildchar > 0)
        {
            face.buildchar = CreateIntArray(face.len_buildchar);
        }
    }
    else
    {
        face.len_buildchar = 0;
    }

    //#endif /* !T1_CONFIG_OPTION_NO_MM_SUPPORT */

    /* now, propagate the subrs, charstrings, and glyphnames tables */
    /* to the Type1 data                                            */
    type1.num_glyphs = loader.num_glyphs;

    if (loader.subrs.init != null)
    {
        loader.subrs.init = null;
        type1.num_subrs   = loader.num_subrs;
        type1.subrs_block = loader.subrs.block;
        type1.subrs       = loader.subrs.elements;
        type1.subrs_len   = loader.subrs.lengths;
    }

    if (loader.charstrings.init == 0)
    {
        error = FT_Common.FT_Err_Invalid_File_Format;
    }

    loader.charstrings.init  = 0;
    type1.charstrings_block = loader.charstrings.block;
    type1.charstrings       = loader.charstrings.elements;
    type1.charstrings_len   = loader.charstrings.lengths;

    /* we copy the glyph names `block' and `elements' fields; */
    /* the `lengths' field must be released later             */
    type1.glyph_names_block = loader.glyph_names.block;
    type1.glyph_names = loader.glyph_names.elements;

    for (var ii = 0; ii < type1.num_glyphs; ii++)
    {
        var s = "";
        var p = type1.glyph_names[ii];
        var indC = 0;
        while (true)
        {
            var _c = p.data[p.pos + indC];
            indC++;

            if (_c == FT_Common.SYMBOL_CONST_S0)
                break;

            s += String.fromCharCode(_c);
        }
        type1.glyph_names[ii] = s;
    }

    loader.glyph_names.block = 0;
    loader.glyph_names.elements = 0;

    /* we must now build type1.encoding when we have a custom array */
    if (type1.encoding_type == FT_Common.T1_ENCODING_TYPE_ARRAY)
    {
        /* OK, we do the following: for each element in the encoding  */
        /* table, look up the index of the glyph having the same name */
        /* the index is then stored in type1.encoding.char_index, and */
        /* the name to type1.encoding.char_name                       */

        var min_char = 0;
        var max_char = 0;

        var charcode = 0;
        for ( ; charcode < loader.encoding_table.max_elems; charcode++)
        {
            type1.encoding.char_index[charcode] = 0;
            type1.encoding.char_name[charcode] = ".notdef";

            var char_name = loader.encoding_table.elements[charcode];
            if (char_name != null)
            {
                for (var idx = 0; idx < type1.num_glyphs; idx++)
                {
                    var glyph_name = type1.glyph_names[idx];
                    if (_strncmp_data(char_name, glyph_name, glyph_name.length) == 0)
                    {
                        type1.encoding.char_index[charcode] = idx;
                        type1.encoding.char_name[charcode] = glyph_name;

                        /* Change min/max encoded char only if glyph name is */
                        /* not /.notdef                                      */
                        if (".notdef" != glyph_name)
                        {
                            if (charcode < min_char)
                                min_char = charcode;
                            if (charcode >= max_char)
                                max_char = charcode + 1;
                        }
                        break;
                    }
                }
            }
        }

        type1.encoding.code_first = min_char;
        type1.encoding.code_last  = max_char;
        type1.encoding.num_chars  = loader.num_chars;
    }

    t1_done_loader(loader);
    return error;
}

/******************************************************************************/
// tokens
/******************************************************************************/
var t1_keywords = new Array(45);
// PS_FontInfoRec
t1_keywords[0] = create_t1_field4("version", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.version = val}, undefined);
t1_keywords[1] = create_t1_field4("Notice", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.notice = val}, undefined);
t1_keywords[2] = create_t1_field4("FullName", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.full_name = val}, undefined);
t1_keywords[3] = create_t1_field4("FamilyName", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.family_name = val}, undefined);
t1_keywords[4] = create_t1_field4("Weight", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_STRING, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.weight = val}, undefined);
t1_keywords[5] = create_t1_field4("ItalicAngle", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.italic_angle = val}, undefined);
t1_keywords[6] = create_t1_field4("isFixedPitch", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_BOOL, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.is_fixed_pitch = val}, undefined);
t1_keywords[7] = create_t1_field4("UnderlinePosition", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.underline_position = val}, undefined);
t1_keywords[8] = create_t1_field4("UnderlineThickness", FT_Common.T1_FIELD_LOCATION_FONT_INFO, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.underline_thickness = val}, undefined);

// PS_FontExtraRec
t1_keywords[9] = create_t1_field4("FSType", FT_Common.T1_FIELD_LOCATION_FONT_EXTRA, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.fs_type = val}, undefined);

// PS_PrivateRec
t1_keywords[10] = create_t1_field4("UniqueID", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT | FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.unique_id = val}, undefined);
t1_keywords[11] = create_t1_field4("lenIV", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.lenIV = val}, undefined);
t1_keywords[12] = create_t1_field4("LanguageGroup", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.language_group = val}, undefined);
t1_keywords[13] = create_t1_field4("password", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.password = val}, undefined);

t1_keywords[14] = create_t1_field4("BlueScale", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_FIXED_1000, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.blue_scale = val}, undefined);
t1_keywords[15] = create_t1_field4("BlueShift", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.blue_shift = val}, undefined);
t1_keywords[16] = create_t1_field4("BlueFuzz", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.blue_fuzz = val}, undefined);

t1_keywords[17] = create_t1_field5("BlueValues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 14, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.blue_values[f.offset] = val}, function(obj, val, f) { obj.num_blue_values = val});
t1_keywords[18] = create_t1_field5("OtherBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 10, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.other_blues[f.offset] = val}, function(obj, val, f) { obj.num_other_blues = val});
t1_keywords[19] = create_t1_field5("FamilyBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 14, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.family_blues[f.offset] = val}, function(obj, val, f) { obj.num_family_blues = val});
t1_keywords[20] = create_t1_field5("FamilyOtherBlues", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 10, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.family_other_blues[f.offset] = val}, function(obj, val, f) { obj.num_family_other_blues = val});

t1_keywords[21] = create_t1_field5("StdHW", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 1, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.standard_width[0] = val}, undefined);
t1_keywords[22] = create_t1_field5("StdVW", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 1, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.standard_height[0] = val}, undefined);
t1_keywords[23] = create_t1_field5("MinFeature", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 2, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.min_feature[f.offset] = val}, undefined);

t1_keywords[24] = create_t1_field5("StemSnapH", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 12, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.snap_widths[f.offset] = val}, function(obj, val, f) { obj.num_snap_widths = val});
t1_keywords[25] = create_t1_field5("StemSnapV", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_INTEGER_ARRAY, 12, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.snap_heights[f.offset] = val}, function(obj, val, f) { obj.num_snap_heights = val});

t1_keywords[26] = create_t1_field4("ForceBold", FT_Common.T1_FIELD_LOCATION_PRIVATE, FT_Common.T1_FIELD_TYPE_BOOL, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.force_bold = val}, undefined);

// T1_FontRec
t1_keywords[27] = create_t1_field4("FontName", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_KEY, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.font_name = val}, undefined);
t1_keywords[28] = create_t1_field4("PaintType", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.paint_type = val}, undefined);
t1_keywords[29] = create_t1_field4("FontType", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.font_type = val}, undefined);
t1_keywords[30] = create_t1_field4("StrokeWidth", FT_Common.T1_FIELD_LOCATION_FONT_DICT, FT_Common.T1_FIELD_TYPE_FIXED, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.stroke_width = val}, undefined);

// FT_BBox
t1_keywords[31] = create_t1_field4("FontBBox", FT_Common.T1_FIELD_LOCATION_BBOX, FT_Common.T1_FIELD_TYPE_BBOX, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);

// T1_FaceRec
t1_keywords[32] = create_t1_field4("NDV", FT_Common.T1_FIELD_LOCATION_FACE, FT_Common.T1_FIELD_TYPE_INTEGER, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.ndv_idx = val}, undefined);
t1_keywords[33] = create_t1_field4("CDV", FT_Common.T1_FIELD_LOCATION_FACE, FT_Common.T1_FIELD_TYPE_FIXED, FT_Common.T1_FIELD_DICT_PRIVATE, function(obj, val, f) { obj.cdv_idx = val}, undefined);

// PS_BlendRec
t1_keywords[34] = create_t1_field5("CDV", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_FIXED, FT_Common.T1_MAX_MM_DESIGNS, FT_Common.T1_FIELD_DICT_FONTDICT, function(obj, val, f) { obj.default_design_vector[f.offset] = val}, function(obj, val, f) { obj.num_default_design_vector = val});

// callbacks
t1_keywords[35] = create_t1_field("FontMatrix", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_font_matrix, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[36] = create_t1_field("Encoding", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_encoding, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[37] = create_t1_field("Subrs", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_subrs, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_PRIVATE, undefined, undefined);
t1_keywords[38] = create_t1_field("CharStrings", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_charstrings, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_PRIVATE, undefined, undefined);
t1_keywords[39] = create_t1_field("Private", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_private, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);

t1_keywords[40] = create_t1_field("BlendDesignPositions", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_blend_design_positions, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[41] = create_t1_field("BlendDesignMap", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_blend_design_map, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[42] = create_t1_field("BlendAxisTypes", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_blend_axis_types, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[43] = create_t1_field("WeightVector", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_weight_vector, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_FONTDICT, undefined, undefined);
t1_keywords[44] = create_t1_field("BuildCharArray", FT_Common.T1_FIELD_LOCATION_BLEND, FT_Common.T1_FIELD_TYPE_CALLBACK, t1_parse_buildchar, 0, -1, 0, 0, FT_Common.T1_FIELD_DICT_PRIVATE, undefined, undefined);

/******************************************************************************/
// driver
/******************************************************************************/

function t1_get_glyph_name(face, glyph_index, buffer, buffer_max)
{
    return face.type1.glyph_names[glyph_index];
    //_mem_strcpyn1(buffer, face.type1.glyph_names[glyph_index], buffer_max);
    //return 0;
}

function t1_get_name_index(face, glyph_name)
{
    var _count = face.type1.num_glyphs;
    for (var i = 0; i < _count; i++)
    {
        if (face.type1.glyph_names[i] == glyph_name)
            return i;
    }
    return 0;
}

var t1_service_glyph_dict = new FT_Service_GlyphDictRec(t1_get_glyph_name, t1_get_name_index);

function t1_get_ps_name(face)
{
    return face.type1.font_name;
}
var t1_service_ps_name = new FT_Service_PsFontNameRec(t1_get_ps_name);

var t1_service_multi_masters = new FT_Service_MultiMastersRec(T1_Get_Multi_Master, T1_Set_MM_Design, T1_Set_MM_Blend, T1_Get_MM_Var, T1_Set_Var_Design);

function t1_ps_get_font_info(face)
{
    FT_Error = 0;
    return face.type1.font_info.CreateDublicate();
}
function t1_ps_get_font_extra(face)
{
    FT_Error = 0;
    return face.type1.font_extra.CreateDublicate();
}
function t1_ps_has_glyph_names(face)
{
    return 1;
}
function t1_ps_get_font_private(face)
{
    FT_Error = 0;
    return face.type1.private_dict;
}

function t1_ps_get_font_value(face, key, idx)
{
    var retval = -1;
    var value = null;
    var type1 = face.type1;

    switch (key)
    {
        case FT_Common.PS_DICT_FONT_TYPE:
            value = type1.font_type;
            break;

        case FT_Common.PS_DICT_FONT_MATRIX:
            switch (idx)
            {
                case 0:
                    value = type1.font_matrix.xx;
                    break;
                case 1:
                    value = type1.font_matrix.xy;
                    break;
                case 2:
                    value = type1.font_matrix.yx;
                    break;
                case 3:
                    value = type1.font_matrix.yy;
                    break;
            }
            break;

        case FT_Common.PS_DICT_FONT_BBOX:
            switch (idx)
            {
                case 0:
                    value = type1.font_bbox.xMin;
                    break;
                case 1:
                    value = type1.font_bbox.yMin;
                    break;
                case 2:
                    value = type1.font_bbox.xMax;
                    break;
                case 3:
                    value = type1.font_bbox.yMax;
                    break;
            }
            break;

        case FT_Common.PS_DICT_PAINT_TYPE:
            value = type1.paint_type;
            break;

        case FT_Common.PS_DICT_FONT_NAME:
            value = type1.font_name;
            break;

        case FT_Common.PS_DICT_UNIQUE_ID:
            value = type1.private_dict.unique_id;
            break;

        case FT_Common.PS_DICT_NUM_CHAR_STRINGS:
            value = type1.num_glyphs;
            break;

        case FT_Common.PS_DICT_CHAR_STRING_KEY:
            if (idx < type1.num_glyphs)
            {
                value = type1.glyph_names[idx];
            }
            break;

        case FT_Common.PS_DICT_CHAR_STRING:
            if (idx < type1.num_glyphs)
            {
                value = type1.charstrings[idx];
            }
            break;

        case FT_Common.PS_DICT_ENCODING_TYPE:
            value = type1.encoding_type;
            break;

        case FT_Common.PS_DICT_ENCODING_ENTRY:
            if (type1.encoding_type == FT_Common.T1_ENCODING_TYPE_ARRAY && idx < type1.encoding.num_chars)
            {
                value = type1.encoding.char_name[idx];
            }
            break;

        case FT_Common.PS_DICT_NUM_SUBRS:
            value = type1.num_subrs;
            break;

        case FT_Common.PS_DICT_SUBR:
            if (idx < type1.num_subrs)
            {
                value = type1.subrs[idx];
            }
            break;

        case FT_Common.PS_DICT_STD_HW:
            value = type1.private_dict.standard_width[0];
            break;

        case FT_Common.PS_DICT_STD_VW:
            value = type1.private_dict.standard_height[0];
            break;

        case FT_Common.PS_DICT_NUM_BLUE_VALUES:
            value = type1.private_dict.num_blue_values;
            break;

        case FT_Common.PS_DICT_BLUE_VALUE:
            if (idx < type1.private_dict.num_blue_values)
            {
                value = type1.private_dict.blue_values[idx];
            }
            break;

        case FT_Common.PS_DICT_BLUE_SCALE:
            value = type1.private_dict.blue_scale;
            break;

        case FT_Common.PS_DICT_BLUE_FUZZ:
            value = type1.private_dict.blue_fuzz;
            break;

        case FT_Common.PS_DICT_BLUE_SHIFT:
            value = type1.private_dict.blue_shift;
            break;

        case FT_Common.PS_DICT_NUM_OTHER_BLUES:
            value = type1.private_dict.num_other_blues;
            break;

        case FT_Common.PS_DICT_OTHER_BLUE:
            if (idx < type1.private_dict.num_other_blues)
            {
                value = type1.private_dict.other_blues[idx];
            }
            break;

        case FT_Common.PS_DICT_NUM_FAMILY_BLUES:
            value = type1.private_dict.num_family_blues;
            break;

        case FT_Common.PS_DICT_FAMILY_BLUE:
            if (idx < type1.private_dict.num_family_blues)
            {
                value = type1.private_dict.family_blues[idx];
            }
            break;

        case FT_Common.PS_DICT_NUM_FAMILY_OTHER_BLUES:
            value = type1.private_dict.num_family_other_blues;
            break;

        case FT_Common.PS_DICT_FAMILY_OTHER_BLUE:
            if (idx < type1.private_dict.num_family_other_blues)
            {
                value = type1.private_dict.family_other_blues[idx];
            }
            break;

        case FT_Common.PS_DICT_NUM_STEM_SNAP_H:
            value = type1.private_dict.num_snap_widths;
            break;

        case FT_Common.PS_DICT_STEM_SNAP_H:
            if (idx < type1.private_dict.num_snap_widths)
            {
                value = type1.private_dict.snap_widths[idx];
            }
            break;

        case FT_Common.PS_DICT_NUM_STEM_SNAP_V:
            value = type1.private_dict.num_snap_heights;
            break;

        case FT_Common.PS_DICT_STEM_SNAP_V:
            if (idx < type1.private_dict.num_snap_heights)
            {
                value = type1.private_dict.snap_heights[idx];
            }
            break;

        case FT_Common.PS_DICT_RND_STEM_UP:
            value = type1.private_dict.round_stem_up;
            break;

        case FT_Common.PS_DICT_FORCE_BOLD:
            value = type1.private_dict.force_bold;
            break;

        case FT_Common.PS_DICT_MIN_FEATURE:
            value = type1.private_dict.min_feature[idx];
            break;

        case FT_Common.PS_DICT_LEN_IV:
            value = type1.private_dict.lenIV;
            break;

        case FT_Common.PS_DICT_PASSWORD:
            value = type1.private_dict.password;
            break;

        case FT_Common.PS_DICT_LANGUAGE_GROUP:
            value= type1.private_dict.language_group;
            break;

        case FT_Common.PS_DICT_IS_FIXED_PITCH:
            value = type1.font_info.is_fixed_pitch;
            break;

        case FT_Common.PS_DICT_UNDERLINE_POSITION:
            value = type1.font_info.underline_position;
            break;

        case FT_Common.PS_DICT_UNDERLINE_THICKNESS:
            value = type1.font_info.underline_thickness;
            break;

        case FT_Common.PS_DICT_FS_TYPE:
            value = type1.font_extra.fs_type;
            break;

        case FT_Common.PS_DICT_VERSION:
            value = type1.font_info.version;
            break;

        case FT_Common.PS_DICT_NOTICE:
            value = type1.font_info.notice;
            break;

        case FT_Common.PS_DICT_FULL_NAME:
            value = type1.font_info.full_name;
            break;

        case FT_Common.PS_DICT_FAMILY_NAME:
            value = type1.font_info.family_name;
            break;

        case FT_Common.PS_DICT_WEIGHT:
            value = type1.font_info.weight;
            break;

        case FT_Common.PS_DICT_ITALIC_ANGLE:
            value = type1.font_info.italic_angle;
            break;

        default:
            break;
    }

    return retval;
}

var t1_service_ps_info = new FT_Service_PsInfoRec(t1_ps_get_font_info, t1_ps_get_font_extra, t1_ps_has_glyph_names, t1_ps_get_font_private, t1_ps_get_font_value);
var t1_service_kerning = new FT_Service_KerningRec(T1_Get_Track_Kerning);

var t1_services = new Array(6);
t1_services[0] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_FONT_NAME,t1_service_ps_name);
t1_services[1] = new FT_ServiceDescRec(FT_SERVICE_ID_GLYPH_DICT,t1_service_glyph_dict);
t1_services[2] = new FT_ServiceDescRec(FT_SERVICE_ID_XF86_NAME,FT_XF86_FORMAT_TYPE_1);
t1_services[3] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_INFO,t1_service_ps_info);
t1_services[4] = new FT_ServiceDescRec(FT_SERVICE_ID_KERNING,t1_service_kerning);
t1_services[5] = new FT_ServiceDescRec(FT_SERVICE_ID_MULTI_MASTERS,t1_service_multi_masters);

function Get_Interface(driver, t1_interface)
{
    return ft_service_list_lookup(t1_services, t1_interface);
}

function Get_Kerning(face, left_glyph, right_glyph, kerning)
{
    kerning.x = 0;
    kerning.y = 0;

    if (face.afm_data != null)
        T1_Get_Kerning(face.afm_data, left_glyph, right_glyph, kerning);

    return 0;
}

function T1_Driver_Class()
{
    this.flags = 0x501;
    this.name = "type1";
    this.version = 0x10000;
    this.requires = 0x20000;

    this.module_interface = null;

    this.init = T1_Driver_Init;
    this.done = T1_Driver_Done;
    this.get_interface = Get_Interface;

    this.face_object_size = 0;
    this.size_object_size = 0;
    this.slot_object_size = 0;

    this.init_face = T1_Face_Init;
    this.done_face = T1_Face_Done;

    this.init_size = T1_Size_Init;
    this.done_size = T1_Size_Done;

    this.init_slot = T1_GlyphSlot_Init;
    this.done_slot = T1_GlyphSlot_Done;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_char_sizes = ft_stub_set_char_sizes;
    this.set_pixel_sizes = ft_stub_set_pixel_sizes;
    //#endif

    this.load_glyph = T1_Load_Glyph;

    this.get_kerning = Get_Kerning;
    this.attach_file = T1_Read_Metrics;
    this.get_advances = T1_Get_Advances;

    this.request_size = T1_Size_Request;
    this.select_size = null;
}

function T1_Driver()
{
    this.clazz = null;      // FT_Module_Class
    this.library = null;    // FT_Library
    this.memory = null;     // FT_Memory
    this.generic = null;    // FT_Generic

    this.clazz = new T1_Driver_Class();
    this.faces_list = [];
    this.extensions = null;
    this.glyph_loader = null;

    this.open_face = function(stream, face_index)
    {
        FT_Error = 0;
        var face = new T1_Face();
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

		FT_Error = 0;
        return face;
    }
}

function create_t1_driver(library)
{
    var driver = new T1_Driver();
    driver.library = library;
    driver.memory = library.Memory;

    driver.clazz = new T1_Driver_Class();
    return driver;
}