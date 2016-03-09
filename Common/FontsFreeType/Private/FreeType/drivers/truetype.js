/******************************************************************************/
// classes
/******************************************************************************/
function TT_Size_Metrics()
{
    this.x_ratio = 0;
    this.y_ratio = 0;

    this.ppem   = 0;
    this.ratio  = 0;
    this.scale  = 0;

    this.compensations = new Array(4);

    this.valid = 0;

    this.rotated = 0;
    this.stretched = 0;
}
TT_Size_Metrics.prototype =
{
    Copy : function(src)
    {
        this.x_ratio = src.x_ratio;
        this.y_ratio = src.y_ratio;

        this.ppem   = src.ppem;
        this.ratio  = src.ratio;
        this.scale  = src.scale;

        this.compensations[0] = src.compensations[0];
        this.compensations[1] = src.compensations[1];
        this.compensations[2] = src.compensations[2];
        this.compensations[3] = src.compensations[3];

        this.valid = src.valid;

        this.rotated = src.rotated;
        this.stretched = src.stretched;
    }
};

function TT_DefRecord()
{
    this.range  = 0;        /* in which code range is it located?     */
    this.start  = 0;        /* where does it start?                   */
    this.end    = 0;          /* where does it end?                     */
    this.opc    = 0;          /* function #, or instruction code        */
    this.active = false;       /* is it active?                          */
    this.inline_delta = false; /* is function that defines inline delta? */
}

function TT_CodeRange()
{
    this.base = null;
    this.size = 0;
}

function TT_SizeRec()
{
    this.face = null;
    this.generic = null;
    this.metrics = new FT_Size_Metrics();
    this.internal = null;

    /* we have our own copy of metrics so that we can modify */
    /* it without affecting auto-hinting (when used)         */
    this._metrics = new FT_Size_Metrics();

    this.ttmetrics = new TT_Size_Metrics();

    this.strike_index = 0;
    //#ifdef TT_USE_BYTECODE_INTERPRETER
    this.num_function_defs = 0; /* number of function definitions */
    this.max_function_defs = 0;
    this.function_defs = null;     /* table of function definitions  */

    this.num_instruction_defs = 0;  /* number of ins. definitions */
    this.max_instruction_defs = 0;
    this.instruction_defs =  null;      /* table of ins. definitions  */

    this.max_func = 0;
    this.max_ins = 0;

    this.codeRangeTable = new Array(3);
    this.codeRangeTable[0] = new TT_CodeRange();
    this.codeRangeTable[1] = new TT_CodeRange();
    this.codeRangeTable[2] = new TT_CodeRange();

    this.GS = new TT_GraphicsState();

    this.cvt_size = 0;      /* the scaled control value table */
    this.cvt = null;

    this.storage_size = 0; /* The storage area is now part of */
    this.storage = null;      /* the instance                    */

    this.twilight = new TT_GlyphZoneRec();     /* The instance's twilight zone    */

    /* debugging variables */

    /* When using the debugger, we must keep the */
    /* execution context tied to the instance    */
    /* object rather than asking it on demand.   */
    this.debug = false;
    this.context = null;

    this.bytecode_ready = false;
    this.cvt_ready = false;
    this.ttfautohinted = false;
    //#endif
}
function TT_Face()
{
    this.num_faces = 0;
    this.face_index = 0;

    this.face_flags = 0;
    this.style_flags = 0;

    this.num_glyphs = 0;

    this.family_name = "";
    this.style_name = "";

    this.num_fixed_sizes = 0;
    this.available_sizes = null;

    this.num_charmaps = 0;
    this.charmaps = null;

    this.generic = new FT_Generic();

    /*# The following member variables (down to `underline_thickness') */
    /*# are only relevant to scalable outlines; cf. @FT_Bitmap_Size    */
    /*# for bitmap fonts.                                              */
    this.bbox = new FT_BBox();

    this.units_per_EM = 0;
    this.ascender = 0;
    this.descender = 0;
    this.height = null;

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

    this.ttc_header = new TTC_HeaderRec();

    this.format_tag = 0;
    this.num_tables = 0;
    this.dir_tables = null;

    this.header = new TT_Header();
    this.horizontal = new TT_HoriHeader();

    this.max_profile = new TT_MaxProfile();
    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.max_components = 0;
    //#endif

    this.vertical_info = false;
    this.vertical = new TT_VertHeader();

    this.num_names = 0;
    this.name_table = new TT_NameTableRec();

    this.os2 = new TT_OS2();
    this.postscript = new TT_Postscript();

    this.cmap_table = null;
    this.cmap_size = 0;

    this.sfnt = null;
    this.psnames = null;

    // horizontal device metrics
    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.hdmx = new TT_HdmxRec();
    //#endif

    // grid-fitting and scaling table
    this.gasp = new TT_Gasp(); // the `gasp' table

    // PCL 5 tabl
    this.pclt = new TT_PCLT();

    // embedded bitmaps support
    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.num_sbit_strikes = 0;
    this.sbit_strikes = null;
    //#endif

    this.num_sbit_scales = 0;
    this.sbit_scales = null;

    // postscript names table
    this.postscript_names = new TT_Post_NamesRec();

    // TrueType-specific fields (ignored by the OTF-Type2 driver)
    // the glyph locations
    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.num_locations_stub = 0;
    this.glyph_locations_stub = null;
    //#endif

    // the font program, if any
    this.font_program_size = 0;
    this.font_program = null;

    // the cvt program, if any
    this.cvt_program_size = 0;
    this.cvt_program = null;

    // the original, unscaled, control value table
    this.cvt_size = 0;
    this.cvt = null;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    // the format 0 kerning table, if any
    this.num_kern_pairs = 0;
    this.kern_table_index = 0;
    this.kern_pairs = [];
    //#endif

    // A pointer to the bytecode interpreter to use.  This is also
    // used to hook the debugger for the `ttdebug' utility.
    this.interpreter = null;

    //#ifdef TT_CONFIG_OPTION_UNPATENTED_HINTING
    // Use unpatented hinting only.
    this.unpatented_hinting = false;
    //#endif

    // Other tables or fields. This is used by derivative formats like OpenType.
    this.extra = new FT_Generic();

    this.postscript_name = "";

    // since version 2.1.8, but was originally placed after
    // `glyph_locations_stub'
    this.glyf_len = 0;

    // since version 2.1.8, but was originally placed before `extra'
    //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT
    this.doblend = 0;
    this.blend = null;
    //#endif

    // since version 2.2

    this.horz_metrics = null;
    this.horz_metrics_size = 0;

    this.vert_metrics = null;
    this.vert_metrics_size = 0;

    this.num_locations = 0; // in broken TTF, gid > 0xFFFF
    this.glyph_locations = null;

    this.hdmx_table = null;
    this.hdmx_table_size = 0;
    this.hdmx_record_count = 0;
    this.hdmx_record_size = 0;
    this.hdmx_record_sizes = null;

    this.sbit_table = null;
    this.sbit_table_size = 0;
    this.sbit_num_strikes = 0;

    this.kern_table = null;
    this.kern_table_size = 0;
    this.num_kern_tables = 0;
    this.kern_avail_bits = 0;
    this.kern_order_bits = 0;

    //#ifdef TT_CONFIG_OPTION_BDF
    this.bdf = new TT_BDFRec();
    //#endif

    // since 2.3.0
    this.horz_metrics_offset = 0;
    this.vert_metrics_offset = 0;

    this.goto_table = null;
    this.access_glyph_frame = null;
    this.forget_glyph_frame = null;
    this.read_glyph_header = null;
    this.read_simple_glyph = null;
    this.read_composite_glyph = null;

    this.sph_found_func_flags = 0;  /* special functions found */
                                    /* for this face           */
    this.sph_compatibility_mode = false;
}
/******************************************************************************/
// gxvar
/******************************************************************************/
function GX_AVarCorrespondenceRec()
{
    this.fromCoord  = 0;
    this.toCoord    = 0;
}
function GX_AVarSegmentRec()
{
    this.pairCount = 0;
    this.correspondence = null;
}
function GX_BlendRec()
{
    this.num_axis = 0;
    this.normalizedcoords = null;

    this.mmvar = null;
    this.mmvar_len = 0;

    this.avar_checked = 0;
    this.avar_segment = null;

    this.tuplecount = 0;
    this.tuplecoords = null;

    this.gv_glyphcnt = 0;
    this.glyphoffsets = null;
}
function GX_GVar_Head()
{
    this.version = 0;
    this.axisCount = 0;
    this.globalCoordCount = 0;
    this.offsetToCoord = 0;
    this.glyphCount = 0;
    this.flags = 0;
    this.offsetToData = 0;
}
function GX_FVar_Head()
{
    this.version = 0;
    this.offsetToData = 0;
    this.countSizePairs = 0;
    this.axisCount = 0;
    this.axisSize = 0;
    this.instanceCount = 0;
    this.instanceSize = 0;
}
function GX_FVar_Axis()
{
    this.axisTag = 0;
    this.minValue = 0;
    this.defaultValue = 0;
    this.maxValue = 0;
    this.flags = 0;
    this.nameID = 0;
}
function ft_var_readpackedpoints(stream)
{
    var points = null;
    var point_cnt = 0;

    var n;
    var runcnt;
    var j;
    var first;
    point_cnt = n = stream.GetUChar();

    if (n == 0)
        return {points:points, point_cnt:point_cnt};

    if (n & 0x80)
        n = stream.GetUChar() | ((n & 0x7F) << 8);

    points = new Array(n);
    var i = 0;
    while (i < n)
    {
        runcnt = stream.GetUChar();
        if (runcnt & 0x80)
        {
            runcnt = runcnt & 0x7F;
            first  = points[i++] = stream.GetUShort();

            if (runcnt < 1 || i + runcnt >= n)
                return {points:points, point_cnt:point_cnt};

            /* first point not included in runcount */
            for (j = 0; j < runcnt; ++j)
            {
                first += stream.GetUShort();
                points[i++] = first & 0xFFFF;
            }
        }
        else
        {
            first = points[i++] = stream.GetUChar();

            if (runcnt < 1 || i + runcnt >= n)
                return {points:points, point_cnt:point_cnt};

            for (j = 0; j < runcnt; ++j)
            {
                first += stream.GetUChar();
                points[i++] = first & 0xFFFF;
            }
        }
    }

    return {points:points, point_cnt:point_cnt};
}
function ft_var_readpackeddeltas(stream, delta_cnt)
{
    var runcnt;
    var j;

    var deltas = new Array(delta_cnt);
    var i = 0;
    while (i < delta_cnt)
    {
        runcnt = stream.GetUChar();
        if ((runcnt & 128)!=0)
        {
            for (j = 0;j <= (runcnt & 63) && i < delta_cnt;j++)
                deltas[i++] = 0;
        }
        else if ((runcnt & 64)!=0)
        {
            for (j = 0;j <= (runcnt & 63) && i < delta_cnt;j++)
                deltas[i++] = stream.GetShort();
        }
        else
        {
            for (j = 0;j <= (runcnt & 63) && i < delta_cnt;j++)
                deltas[i++] = stream.GetChar();
        }

        if (j <= (runcnt & 63))
        {
            deltas = null;
            return null;
        }
    }
    return deltas;
}
function ft_var_load_avar(face)
{
    var stream = face.stream;
    var blend  = face.blend;
    var segment = null;
    var i, j;

    blend.avar_checked = 1;
    var table_len = face.goto_table(face, FT_Common.TTAG_avar, stream);
    var error = FT_Error;
    if (error != 0)
        return;

    error = stream.EnterFrame(table_len);
    if (error != 0)
        return;

    var version   = stream.GetLong();
    var axisCount = stream.GetLong();

    if (version != 0x00010000 || axisCount != blend.mmvar.num_axis)
    {
        stream.ExitFrame();
        return;
    }

    blend.avar_segment = new Array(axisCount);
    for (i=0;i<axisCount;i++)
        blend.avar_segment[i] = new GX_AVarSegmentRec();

    for (i = 0; i < axisCount; ++i)
    {
        segment = blend.avar_segment[i];
        segment.pairCount = stream.GetUShort();
        segment.correspondence = new Array(segment.pairCount);

        for (j = 0; j < segment.pairCount; ++j)
        {
            segment.correspondence[j].fromCoord = stream.GetShort() << 2;
            segment.correspondence[j].toCoord = stream.GetShort() << 2;
        }
    }
    stream.ExitFrame();
}
function ft_var_load_gvar(face)
{
    var stream = face.stream;
    var blend  = face.blend;
    var error = 0;
    var i, j;
    var gvar_head = new GX_GVar_Head();

    var table_len = face.goto_table(face, FT_Common.TTAG_gvar, stream);
    error = FT_Error;
    if (error != 0)
        return error;

    var gvar_start = stream.pos;

    error = stream.EnterFrame(20);
    if (error != 0)
        return error;

    gvar_head.version = stream.GetLong();
    gvar_head.axisCount = stream.GetUShort();
    gvar_head.globalCoordCount = stream.GetUShort();
    gvar_head.offsetToCoord = stream.GetULong();
    gvar_head.glyphCount = stream.GetUShort();
    gvar_head.flags = stream.GetUShort();
    gvar_head.offsetToData = stream.GetULong();

    stream.ExitFrame();

    blend.tuplecount  = gvar_head.globalCoordCount;
    blend.gv_glyphcnt = gvar_head.glyphCount;
    var offsetToData = gvar_start + gvar_head.offsetToData;

    if (gvar_head.version != 0x00010000 || gvar_head.axisCount != blend.mmvar.num_axis)
        return FT_Common.FT_Err_Invalid_Table;

    blend.glyphoffsets = new Array(blend.gv_glyphcnt + 1);
    if ((gvar_head.flags & 1) != 0)
    {
        error = stream.EnterFrame((blend.gv_glyphcnt + 1)*4);
        if (error != 0)
            return error;

        for (i = 0; i <= blend.gv_glyphcnt; ++i)
            blend.glyphoffsets[i] = offsetToData + stream.GetLong();

        stream.ExitFrame();
    }
    else
    {
        error = stream.EnterFrame((blend.gv_glyphcnt + 1)*2);
        if (error != 0)
            return error;

        for (i = 0; i <= blend.gv_glyphcnt; ++i)
            blend.glyphoffsets[i] = offsetToData + stream.GetUShort() * 2;

        stream.ExitFrame();
    }

    if (blend.tuplecount != 0)
    {
        blend.tuplecoords = new Array(gvar_head.axisCount * blend.tuplecount);
        error = stream.Seek(gvar_start + gvar_head.offsetToCoord);
        if (error != 0)
            return error;

        error = stream.EnterFrame(blend.tuplecount * gvar_head.axisCount * 2);

        for (i = 0; i < blend.tuplecount; i++)
        {
            for (j=0;j<gvar_head.axisCount;j++)
            {
                blend.tuplecoords[i * gvar_head.axisCount + j] = stream.GetShort() << 2;
            }
        }

        stream.ExitFrame();
    }
    return error;
}
function ft_var_apply_tuple(blend, tupleIndex, tuple_coords, im_start_coords, im_end_coords)
{
    var apply = 0x10000;
    var temp = 0;
    var i = 0;
    var c = blend.num_axis;
    var nn = blend.normalizedcoords;
    for (; i < c;i++)
    {
        if (tuple_coords[i] == 0)
            continue;
        else if (nn[i] == 0 || (nn[i] < 0 && tuple_coords[i] > 0) || (nn[i] > 0 && tuple_coords[i] < 0))
        {
            apply = 0;
            break;
        }
        else if (0 == (tupleIndex & FT_Common.GX_TI_INTERMEDIATE_TUPLE))
            apply = FT_MulDiv(apply, nn[i] > 0 ? nn[i] : -nn[i], 0x10000);

        else if (nn[i] <= im_start_coords[i] || nn[i] >= im_end_coords[i])
        {
            apply = 0;
            break;
        }
        else if (nn[i] < tuple_coords[i])
        {
            temp = FT_MulDiv(nn[i] - im_start_coords[i], 0x10000, tuple_coords[i] - im_start_coords[i]);
            apply = FT_MulDiv(apply, temp, 0x10000);
        }
        else
        {
            temp = FT_MulDiv(im_end_coords[i] - nn[i], 0x10000, im_end_coords[i] - tuple_coords[i]);
            apply = FT_MulDiv(apply, temp, 0x10000);
        }
    }
    return apply;
}
function TT_Get_MM_Var(face, bIsRet)
{
    var stream = face.stream;
    var table_len;
    FT_Error = 0;
    var fvar_start;
    var i, j;
    var mmvar = null;
    var fvar_head = new GX_FVar_Head();

    if (face.blend == null)
    {
        table_len = face.goto_table(face, FT_Common.TTAG_gvar, stream);
        if (FT_Error != 0)
            return null;

        table_len = face.goto_table(face, FT_Common.TTAG_fvar, stream);
        if (FT_Error != 0)
            return null;

        fvar_start = stream.pos;

        FT_Error = stream.EnterFrame(16);
        if (FT_Error != 0)
            return null;
        fvar_head.version = stream.GetULong();
        fvar_head.offsetToData = stream.GetUShort();
        fvar_head.countSizePairs = stream.GetUShort();
        fvar_head.axisCount = stream.GetUShort();
        fvar_head.axisSize = stream.GetUShort();
        fvar_head.instanceCount = stream.GetUShort();
        fvar_head.instanceSize = stream.GetUShort();
        stream.ExitFrame();


        if (fvar_head.version != 0x00010000 || fvar_head.countSizePairs != 2 || fvar_head.axisSize != 20 ||
                fvar_head.axisCount > 0x3FFE || fvar_head.instanceSize != 4 + 4 * fvar_head.axisCount || fvar_head.instanceCount > 0x7EFF ||
            fvar_head.offsetToData + fvar_head.axisCount * 20 + fvar_head.instanceCount * fvar_head.instanceSize > table_len)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Table;
            return null;
        }

        face.blend = new GX_BlendRec();
        face.blend.mmvar_len = 0;
        mmvar = new FT_MM_Var();

        face.blend.mmvar = mmvar;

        mmvar.num_axis = fvar_head.axisCount;
        mmvar.num_designs = 0xFFFFFFFF;
        mmvar.num_namedstyles = fvar_head.instanceCount;
        mmvar.axis = new Array(mmvar.num_axis);
        mmvar.namedstyle = new Array(mmvar.num_namedstyles);

        FT_Error = stream.EnterFrame(fvar_start + fvar_head.offsetToData);
        if (FT_Error != 0)
            return null;

        var mass_a = mmvar.axis;
        var count_a = mmvar.num_axis;
        for (i = 0; i < count_a; i++)
        {
            mass_a[i] = new FT_Var_Axis();
            var a = mass_a[i];

            FT_Error = stream.EnterFrame(20);
            if (FT_Error != 0)
                return null;

            a.tag = stream.GetULong();
            a.minimum = stream.GetULong();
            a.def = stream.GetULong();
            a.maximum = stream.GetULong();
            stream.Skip(2);
            a.strid = stream.GetUShort();

            var tag = a.tag;
            a.name = "";
            a.name += String.fromCharCode((tag >>> 24) & 0xFF);
            a.name += String.fromCharCode((tag >>> 16) & 0xFF);
            a.name += String.fromCharCode((tag >>> 8) & 0xFF);
            a.name += String.fromCharCode(tag & 0xFF);

            stream.ExitFrame();
        }

        if (0 == bIsRet)
            return null;

        var mass_s = mmvar.namedstyle;
        var count_s = mmvar.num_namedstyles;
        for (i = 0;i < count_s;i++)
        {
            FT_Error = stream.EnterFrame(4 + 4 * count_a);
            if (FT_Error != 0)
                return null;

            mass_s[i] = new FT_Var_Named_Style();
            var s = mass_s[i];

            s.strid = stream.GetUShort();
            stream.Skip(2);

            s.coords = new Array(count_a);
            for (j = 0; j < count_a; j++)
                s.coords[j] = stream.GetULong();

            stream.ExitFrame();
        }
    }

    mmvar = null;
    mmvar = face.blend.mmvar.dublicate();

    mass_a = mmvar.axis;
    count_a = mmvar.num_axis;
    for (i = 0; i < count_a; i++)
    {
        var a = mass_a[i];

        if (a.tag == FT_Common.TTAG_wght)
            a.name = "Weight";
        else if (a.tag == FT_Common.TTAG_wdth)
            a.name = "Width";
        else if (a.tag == FT_Common.TTAG_opsz)
            a.name = "OpticalSize";
        else if (a.tag == FT_Common.TTAG_slnt)
            a.name = "Slant";
    }

    return mmvar;
}
function TT_Set_MM_Blend(face, num_coords, coords)
{
    var error = 0;
    face.doblend = 0;

    if (face.blend == null)
    {
        TT_Get_MM_Var(face, 0);
        if (FT_Error != 0)
            return FT_Error;
    }
    var manageCvt = 0;

    var blend = face.blend;
    var mmvar = blend.mmvar;

    if (num_coords != mmvar.num_axis)
        return FT_Common.FT_Err_Invalid_Argument;

    for (var i = 0; i < num_coords; i++)
    {
        if (coords[i] < -0x00010000 || coords[i] > 0x00010000)
            return FT_Common.FT_Err_Invalid_Argument;
    }

    if (blend.glyphoffsets == null)
    {
        error = ft_var_load_gvar(face);
        if (error != 0)
            return error;
    }

    if (blend.normalizedcoords == null)
    {
        blend.normalizedcoords = new Array(num_coords);
        manageCvt = 1;
    }
    else
    {
        manageCvt = 0;
        for (var i = 0; i < num_coords; ++i)
        {
            if (blend.normalizedcoords[i] != coords[i])
            {
                manageCvt = 2;
                break;
            }
        }
    }

    blend.num_axis = num_coords;
    for (var i = 0;i < num_coords; i++)
        blend.normalizedcoords[i] = coords[i];
    face.doblend = 1;
    if (face.cvt != null)
    {
        switch (manageCvt)
        {
            case 2:
                tt_face_load_cvt(face, face.stream);
                break;

            case 1:
                tt_face_vary_cvt(face, face.stream);
                break;

            case 0:
                break;
        }
    }
    return error;
}
function TT_Set_Var_Design(face, num_coords, coords)
{
    var error = 0;
    var i, j;
    var a = null;
    var av = null;
    if (face.blend == null)
    {
        TT_Get_MM_Var(face, 0);
        if (FT_Error != 0)
            return FT_Error;
    }

    var blend = face.blend;
    var mmvar = blend.mmvar;

    if (num_coords != mmvar.num_axis)
        return FT_Common.FT_Err_Invalid_Argument;

    var _c = mmvar.num_axis;
    var normalized = new Array(_c);

    for (i = 0; i < _c; i++)
    {
        a = mmvar.axis[i];
        if (coords[i] > a.maximum || coords[i] < a.minimum)
            return FT_Common.FT_Err_Invalid_Argument;
        
        if (coords[i] < a.def)
        {
            normalized[i] = -FT_MulDiv(coords[i] - a.def, 0x10000, a.minimum - a.def);
        }
        else if (a.maximum == a.def)
            normalized[i] = 0;
        else
        {
            normalized[i] = FT_MulDiv(coords[i] - a.def, 0x10000, a.maximum - a.def);
        }
    }

    if (0 == blend.avar_checked)
        ft_var_load_avar(face);

    if (blend.avar_segment != null)
    {
        for (i = 0; i < _c; i++)
        {
            av = blend.avar_segment[i];
            var _coords = av.correspondence;
            for (j = 1; j < av.pairCount; j++)
            if (normalized[i] < _coords[j].fromCoord)
            {
                var mem = FT_MulDiv(normalized[i] - _coords[j - 1].fromCoord, 0x10000, _coords[j].fromCoord - _coords[j - 1].fromCoord);
                normalized[i] = FT_MulDiv(mem, _coords[j].toCoord - _coords[j - 1].toCoord, 0x10000) + _coords[j - 1].toCoord;
                break;
            }
        }
    }

    error = TT_Set_MM_Blend(face, num_coords, normalized);
    normalized = null;
    return error;
}
function tt_face_vary_cvt(face, stream)
{
    var error = 0;
    var here;
    var i, j;
    var blend = face.blend;
    var point_count;
    var localpoints;
    var deltas;

    if (blend == null)
        return 0;

    if (face.cvt == null)
        return 0;

    var table_len = face.goto_table(face, FT_Common.TTAG_cvar, stream);
    error = FT_Error;
    if (error != 0)
        return 0;

    error = stream.EnterFrame(table_len);
    if (error != 0)
        return 0;

    var table_start = stream.cur;
    if (0x00010000 != stream.GetLong())
    {
        stream.ExitFrame();
        return 0;
    }

    var num_axis = blend.num_axis;
    var tuple_coords = new Array(num_axis);
    var im_start_coords = new Array(num_axis);
    var im_end_coords = new Array(num_axis);

    var tupleCount   = stream.GetUShort();
    var offsetToData = table_start + stream.GetUShort();

    for (i = 0; i < (tupleCount & 0xFFF); ++i)
    {
        var tupleDataSize = stream.GetUShort();
        var tupleIndex    = stream.GetUShort();

        if ((tupleIndex & FT_Common.GX_TI_EMBEDDED_TUPLE_COORD) != 0)
        {
            for (j = 0; j < num_axis; j++)
                tuple_coords[j] = stream.GetShort() << 2;
        }
        else
        {
            if ((tupleIndex & FT_Common.GX_TI_INTERMEDIATE_TUPLE) != 0)
            {
                stream.Skip(4 * num_axis);
            }
            offsetToData += tupleDataSize;
            continue;
        }
        if ((tupleIndex & FT_Common.GX_TI_INTERMEDIATE_TUPLE) != 0)
        {
            for (j = 0; j < num_axis; j++)
                im_start_coords[j] = stream.GetShort() << 2;
            for (j = 0; j < num_axis; j++)
                im_end_coords[j] = stream.GetShort() << 2;
        }

        var apply = ft_var_apply_tuple(blend, tupleIndex, tuple_coords, im_start_coords, im_end_coords);
        if (apply == 0 || 0 == (tupleIndex & FT_Common.GX_TI_PRIVATE_POINT_NUMBERS))
        {
            offsetToData += tupleDataSize;
            continue;
        }

        here = stream.cur;
        stream.cur = offsetToData;

        var __mem1 = ft_var_readpackedpoints(stream);
        localpoints = __mem1.points;
        point_count = __mem1.point_cnt;
        var cvt_size = face.cvt_size;
        deltas = ft_var_readpackeddeltas(stream, point_count == 0 ? cvt_size : point_count);
        if (deltas == null)
        {
        }
        else if (localpoints == null)
        {
            for (j = 0; j < cvt_size; j++)
                face.cvt[j] = (face.cvt[j] + FT_MulFix(deltas[j], apply)) & 0xFFFF;
        }
        else
        {
            for (j = 0; j < point_count; ++j)
            {
                var pindex = localpoints[j];
                face.cvt[pindex] = (face.cvt[pindex] + FT_MulFix(deltas[j], apply)) & 0xFFFF;
            }
        }

        localpoints = null;
        deltas = null;
        offsetToData += tupleDataSize;
        stream.cur = here;
    }

    stream.ExitFrame();

    tuple_coords = null;
    im_start_coords = null;
    im_end_coords = null;

    return error;
}
function TT_Vary_Get_Glyph_Deltas(face, glyph_index, n_points)
{
    var stream = face.stream;
    var blend  = face.blend;
    var error;
    var here;
    var i, j;
    var point_count, spoint_count = 0;
    var sharedpoints = null;
    var localpoints  = null;
    var points = null;
    var deltas_x = null, deltas_y = null;


    if (face.doblend == 0 || blend == null)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
        return null;
    }

    var delta_xy = new Array(n_points);
    for (i=0;i<n_points;i++)
        delta_xy[i] = new FT_Vector();
    
    if (glyph_index >= blend.gv_glyphcnt || blend.glyphoffsets[glyph_index] == blend.glyphoffsets[glyph_index + 1])
        return 0;

    error = stream.Seek(blend.glyphoffsets[glyph_index]);
    if (error == 0)
        error = stream.EnterFrame(blend.glyphoffsets[glyph_index + 1] - blend.glyphoffsets[glyph_index]);

    if (error != 0)
    {
        delta_xy = null;
        FT_Error = error;
        return null;
    }

    var glyph_start = stream.cur;

    var num_axis = blend.num_axis;
    var tuple_coords = new Array(num_axis);
    var im_start_coords = new Array(num_axis);
    var im_end_coords = new Array(num_axis);

    var tupleCount   = stream.GetUShort();
    var offsetToData = glyph_start + stream.GetUShort();

    if ((tupleCount & FT_Common.GX_TC_TUPLES_SHARE_POINT_NUMBERS) != 0)
    {
        here = stream.cur;
        stream.cur = offsetToData;

        var __mem = ft_var_readpackedpoints(stream);
        sharedpoints = __mem.points;
        spoint_count = __mem.point_cnt;
        offsetToData = stream.cur;
        stream.cur = here;
    }

    for ( i = 0; i < ( tupleCount & GX_TC_TUPLE_COUNT_MASK ); ++i )
    {
        var tupleDataSize = stream.GetUShort();
        var tupleIndex    = stream.GetUShort();

        if (0 != (tupleIndex & FT_Common.GX_TI_EMBEDDED_TUPLE_COORD))
        {
            for (j = 0; j < num_axis; j++)
                tuple_coords[j] = stream.GetShort() << 2;
        }
        else if (((tupleIndex & FT_Common.GX_TI_TUPLE_INDEX_MASK) != 0) >= blend.tuplecount)
        {
            FT_Error = FT_Common.FT_Err_Invalid_Table;
            tuple_coords = null;
            im_start_coords = null;
            im_end_coords = null;
            delta_xy = null;
            stream.ExitFrame();
            return null;
        }
        else
        {
            var _src = blend.tuplecoords;
            var _s_start = (tupleIndex & 0xFFF) * num_axis;
            for (j=0;j<num_axis;j++)
                tuple_coords[j] = _src[_s_start+j];
        }

        if (0 != (tupleIndex & FT_Common.GX_TI_INTERMEDIATE_TUPLE))
        {
            for (j = 0; j < num_axis; j++)
                im_start_coords[j] = stream.GetShort() << 2;
            for (j = 0; j < num_axis; j++)
                im_end_coords[j] = stream.GetShort() << 2;
        }

        var apply = ft_var_apply_tuple(blend, tupleIndex, tuple_coords, im_start_coords, im_end_coords);
        if (apply == 0)
        {
            offsetToData += tupleDataSize;
            continue;
        }

        here = stream.cur;
        if (0 != (tupleIndex & FT_Common.GX_TI_PRIVATE_POINT_NUMBERS))
        {
            stream.cur = offsetToData;
            var __mem = ft_var_readpackedpoints(stream);
            localpoints = __mem.points;
            point_count = __mem.point_cnt;
            points = localpoints;
        }
        else
        {
            points      = sharedpoints;
            point_count = spoint_count;
        }

        deltas_x = ft_var_readpackeddeltas(stream, point_count == 0 ? n_points : point_count);
        deltas_y = ft_var_readpackeddeltas(stream, point_count == 0 ? n_points : point_count);

        if (points == null || deltas_y == null || deltas_x == null)
        {
        }
        else if (points == null)
        {
            for (j = 0; j < n_points; j++)
            {
                delta_xy[j].x += FT_MulFix(deltas_x[j], apply);
                delta_xy[j].y += FT_MulFix(deltas_y[j], apply);
            }
        }
        else
        {
            for (j = 0; j < point_count; j++)
            {
                if (localpoints[j] >= n_points)
                    continue;

                delta_xy[localpoints[j]].x += FT_MulFix(deltas_x[j], apply);
                delta_xy[localpoints[j]].y += FT_MulFix(deltas_y[j], apply);
            }
        }

        localpoints = null;
        deltas_x = null;
        deltas_y = null;

        offsetToData += tupleDataSize;
        stream.cur = here;
    }

    tuple_coords = null;
    im_start_coords = null;
    im_end_coords = null;
    delta_xy = null;
    stream.ExitFrame();
    if (error != 0)
        delta_xy = null;

    FT_Error = error;
    return delta_xy;
}
function tt_done_blend(memory, blend)
{
}
/******************************************************************************/
// glyphloader
/******************************************************************************/
function load_sbit_image(size, glyph, glyph_index, load_flags)
{
    var metrics = new TT_SBit_MetricsRec();

    var face   = glyph.face;
    var stream = face.stream;
    var error = face.sfnt.load_sbit_image(face, size.strike_index, glyph_index, load_flags, stream, glyph.bitmap, metrics);
    if (error == 0)
    {
        glyph.outline.n_points   = 0;
        glyph.outline.n_contours = 0;

        glyph.metrics.width  = metrics.width  << 6;
        glyph.metrics.height = metrics.height << 6;

        glyph.metrics.horiBearingX = metrics.horiBearingX << 6;
        glyph.metrics.horiBearingY = metrics.horiBearingY << 6;
        glyph.metrics.horiAdvance  = metrics.horiAdvance  << 6;

        glyph.metrics.vertBearingX = metrics.vertBearingX << 6;
        glyph.metrics.vertBearingY = metrics.vertBearingY << 6;
        glyph.metrics.vertAdvance  = metrics.vertAdvance  << 6;

        glyph.format = FT_Common.FT_GLYPH_FORMAT_BITMAP;

        if ((load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0)
        {
            glyph.bitmap_left = metrics.vertBearingX;
            glyph.bitmap_top  = metrics.vertBearingY;
        }
        else
        {
            glyph.bitmap_left = metrics.horiBearingX;
            glyph.bitmap_top  = metrics.horiBearingY;
        }
    }

    return error;
}
function TT_Get_HMetrics(face, idx)
{
    return face.sfnt.get_metrics(face, 0, idx);
}
function TT_Get_VMetrics(face, idx, yMax)
{
    if (face.vertical_info === true)
        return face.sfnt.get_metrics(face, 1, idx);
    else if (face.os2.version != 0xFFFF)
        return {bearing : (face.os2.sTypoAscender - yMax), advance : (face.os2.sTypoAscender - face.os2.sTypoDescender)};
    else
        return {bearing : (face.horizontal.Ascender - yMax), advance : (face.horizontal.Ascender - face.horizontal.Descender)};

    return {bearing : 0, advance : face.units_per_EM};
}

function tt_get_metrics(loader, glyph_index)
{
    var face = loader.face;

    var h = TT_Get_HMetrics(face, glyph_index);
    var v = TT_Get_VMetrics(face, glyph_index, loader.bbox.yMax);

    loader.left_bearing = h.bearing;
    loader.advance      = h.advance;
    loader.top_bearing  = v.bearing;
    loader.vadvance     = v.advance;

    if (face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (loader.exec != null)
            loader.exec.sph_tweak_flags = 0;

        /* this may not be the right place for this, but it works */
        if (loader.exec != null && loader.exec.ignore_x_mode)
            global_SubpixHintingHacks.sph_set_tweaks(loader, glyph_index);
    }//#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

    if (loader.linear_def == 0)
    {
        loader.linear_def = 1;
        loader.linear = h.advance;
    }
}
function tt_get_metrics_incr_overrides(loader, glyph_index)
{
    var face = loader.face;

    var h = TT_Get_HMetrics(face, glyph_index);
    var v = TT_Get_VMetrics(face, glyph_index, 0);

    if (face.internal.incremental_interface && face.internal.incremental_interface.funcs.get_glyph_metrics)
    {
        var metrics = new FT_Incremental_MetricsRec();

        metrics.bearing_x = loader.left_bearing;
        metrics.bearing_y = 0;
        metrics.advance   = loader.advance;
        metrics.advance_v = 0;

        var error = face.internal.incremental_interface.funcs.get_glyph_metrics(face.internal.incremental_interface.object,
            glyph_index, false, metrics);
        if (error != 0)
            return 0;

        loader.left_bearing = metrics.bearing_x;
        loader.advance      = metrics.advance;
        loader.top_bearing  = v.tsb;
        loader.vadvance     = v.ah;

        if (0 == loader.linear_def)
        {
            loader.linear_def = 1;
            loader.linear = h.aw;
        }
    }
    return 0;
}
function translate_array(n, coords, delta_x, delta_y)
{
    if (delta_x != 0)
        for (var k = 0; k < n; k++)
            coords[k].x += delta_x;

    if (delta_y != 0)
        for (var k = 0; k < n; k++)
            coords[k].y += delta_y;
}
function translate_array_ex(n, coords, start_p, delta_x, delta_y)
{
    if (delta_x != 0)
        for (var k = 0; k < n; k++)
            coords[start_p + k].x += delta_x;

    if (delta_y != 0)
        for (var k = 0; k < n; k++)
            coords[start_p + k].y += delta_y;
}

function TT_Access_Glyph_Frame(loader, glyph_index, offset, byte_count)
{
    var error = 0;
    var stream = loader.stream;

    error = stream.Seek(offset);
    if (error == 0)
        error = stream.EnterFrame(byte_count);

    if (error != 0)
        return error;

    loader.cursor = stream.cur;
    loader.limit  = stream.size;

    return 0;
}

function TT_Forget_Glyph_Frame(loader)
{
    loader.stream.ExitFrame();
}

function TT_Load_Glyph_Header(loader)
{
    var stream = loader.stream;

    if (stream.cur + 10 > stream.size)
        return FT_Common.FT_Err_Invalid_Outline;

    loader.n_contours = stream.GetShort();
    loader.bbox.xMin = stream.GetShort();
    loader.bbox.yMin = stream.GetShort();
    loader.bbox.xMax = stream.GetShort();
    loader.bbox.yMax = stream.GetShort();

    loader.cursor += 10;

    return 0;
}

function TT_Load_Simple_Glyph(load)
{
    var error = 0;
    var p = new FT_Stream(load.stream.data, load.stream.size);
    p.cur = load.cursor;

    var gloader = load.gloader;
    var n_contours = load.n_contours;
    var face = load.face;
    var n_ins;
    var n_points;

    var c, count;
    var x;
    var prev_cont;
    var xy_size = 0;

    error = FT_GLYPHLOADER_CHECK_POINTS(gloader, 0, n_contours);
    if (error != 0)
        return error;

    if (null == gloader.base.outline.contours)
    {
        error = FT_GLYPHLOADER_CHECK_POINTS(gloader, 0, n_contours);
    }

    var conts = gloader.base.outline.contours;
    var cont = gloader.current.outline.contours;
    var cont_limit = cont + n_contours;

    if (n_contours >= 0xFFF || p.cur + (n_contours + 1) * 2 > load.limit)
        return FT_Common.FT_Err_Invalid_Outline;

    prev_cont = p.GetUShort();

    if (n_contours > 0)
        conts[cont] = prev_cont;

    for (cont++; cont < cont_limit; cont++)
    {
        conts[cont] = p.GetUShort();
        if (conts[cont] <= prev_cont)
            return FT_Common.FT_Err_Invalid_Table;
        prev_cont = conts[cont];
    }

    n_points = 0;
    if (n_contours > 0)
    {
        n_points = conts[cont-1] + 1;
        if (n_points < 0)
            return FT_Common.FT_Err_Invalid_Outline;
    }

    /* note that we will add four phantom points later */
    error = FT_GLYPHLOADER_CHECK_POINTS(gloader, n_points + 4, 0);
    if (error != 0)
        return error;

    var outline = gloader.current.outline;
    for (cont = outline.contours + 1; cont < cont_limit; cont++)
        if (conts[cont-1] >= conts[cont])
            return FT_Common.FT_Err_Invalid_Outline;

    load.glyph.control_len  = 0;
    load.glyph.control_data = 0;

    if (p.cur + 2 > load.limit)
        return FT_Common.FT_Err_Invalid_Outline;

    n_ins = p.GetUShort();
    if (n_ins > face.max_profile.maxSizeOfInstructions)
        return FT_Common.FT_Err_Too_Many_Hints;

    if ((load.limit - p.cur) < n_ins)
        return FT_Common.FT_Err_Too_Many_Hints;

    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if (face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER)
    {
        if ((load.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
        {
            load.glyph.control_len  = n_ins;
            load.glyph.control_data = dublicate_pointer(load.exec.glyphIns);

			if (load.glyph.control_data != null)
			{
				var _dd = load.glyph.control_data.data;
				var _dc = load.glyph.control_data.pos;

				for (var j = 0; j < n_ins; j++)
					_dd[_dc + j] = p.data[p.cur + j];
			}
        }
    }

    p.cur += n_ins;

    var flags = gloader.base.outline.tags;
    var flag = outline.tags;
    var flag_limit = flag + n_points;

    var limit = load.limit;
    while (flag < flag_limit)
    {
        if (p.cur + 1 > limit)
            return FT_Common.FT_Err_Invalid_Outline;

        flags[flag++] = c = p.GetUChar();
        if ((c & 8)!=0)
        {
            if (p.cur + 1 > limit)
                return FT_Common.FT_Err_Invalid_Outline;

            count = p.GetUChar();
            if (flag + count > flag_limit)
                return FT_Common.FT_Err_Invalid_Outline;

            for (; count > 0; count--)
                flags[flag++] = c;
        }
    }

    var vecs = gloader.base.outline.points;
    var vec = outline.points;
    var vec_limit = vec + n_points;
    flag = outline.tags;
    x = 0;

    if (p.cur + xy_size > limit)
        return FT_Common.FT_Err_Invalid_Outline;

    for ( ; vec < vec_limit; vec++, flag++ )
    {
        var y = 0;
        var f = flags[flag];

        if ((f & 2)!=0)
        {
            if (p.cur + 1 > limit)
                return FT_Common.FT_Err_Invalid_Outline;

            y = p.GetUChar();
            if (( f & 16 ) == 0)
                y = -y;
        }
        else if (( f & 16 ) == 0)
        {
            if (p.cur + 2 > limit)
                return FT_Common.FT_Err_Invalid_Outline;

            y = p.GetShort();
        }

        x += y;
        vecs[vec].x = x;
        flags[flag]  = (f & ~( 2 | 16 )) & 0xFF;
    }

    vec = outline.points;
    flag = outline.tags;
    x = 0;

    for ( ; vec < vec_limit; vec++, flag++)
    {
        var y = 0;
        var f = flags[flag];

        if ((f & 4)!=0)
        {
            if (p.cur + 1 > limit)
                return FT_Common.FT_Err_Invalid_Outline;

            y = p.GetUChar();
            if ((f & 32) == 0)
                y = -y;
        }
        else if ((f & 32) == 0)
        {
            if (p.cur + 2 > limit)
                return FT_Common.FT_Err_Invalid_Outline;

            y = p.GetShort();
        }

        x += y;
        vecs[vec].y = x;
        flags[flag]  = (f & FT_Common.FT_CURVE_TAG_ON) & 0xFF;
    }

    outline.n_points   = n_points & 0xFFFF;
    outline.n_contours = n_contours & 0xFFFF;

    load.cursor = p.cur;
    return error;
}

function TT_Load_Composite_Glyph(loader)
{
    var error = 0;
    var s = new FT_Stream(loader.stream.data, loader.stream.size);
    s.cur = loader.cursor;
    var size_read = loader.limit - loader.cursor;
    var count_read = 0;

    var gloader = loader.gloader;
    var subglyph = null;
    var num_subglyphs = 0;

    do
    {
        var xx, xy, yy, yx;
        var count;

        error = FT_GlyphLoader_CheckSubGlyphs(gloader, num_subglyphs + 1);
        if (error != 0)
            return error;

        if (count_read + 4 > size_read)
            return FT_Common.FT_Err_Invalid_Composite;

        subglyph = gloader.base.subglyphs[gloader.current.subglyphs + num_subglyphs];

        subglyph.arg1 = subglyph.arg2 = 0;

        subglyph.flags = s.GetUShort();
        subglyph.index = s.GetUShort();

        count_read += 4;

        count = 2;
        if (subglyph.flags & FT_Common.ARGS_ARE_WORDS)
            count += 2;
        if (subglyph.flags & FT_Common.WE_HAVE_A_SCALE)
            count += 2;
        else if (subglyph.flags & FT_Common.WE_HAVE_AN_XY_SCALE)
            count += 4;
        else if (subglyph.flags & FT_Common.WE_HAVE_A_2X2)
            count += 8;

        if (count_read + count > size_read)
            return FT_Common.FT_Err_Invalid_Composite;

        if (subglyph.flags & FT_Common.ARGS_ARE_WORDS)
        {
            subglyph.arg1 = s.GetShort();
            subglyph.arg2 = s.GetShort();
        }
        else
        {
            subglyph.arg1 = s.GetChar();
            subglyph.arg2 = s.GetChar();
        }

        xx = yy = 0x10000;
        xy = yx = 0;

        if (subglyph.flags & FT_Common.WE_HAVE_A_SCALE)
        {
            xx = s.GetShort() << 2;
            yy = xx;
        }
        else if (subglyph.flags & FT_Common.WE_HAVE_AN_XY_SCALE)
        {
            xx = s.GetShort() << 2;
            yy = s.GetShort() << 2;
        }
        else if (subglyph.flags & FT_Common.WE_HAVE_A_2X2)
        {
            xx = s.GetShort() << 2;
            yx = s.GetShort() << 2;
            xy = s.GetShort() << 2;
            yy = s.GetShort() << 2;
        }

        subglyph.transform.xx = xx;
        subglyph.transform.xy = xy;
        subglyph.transform.yx = yx;
        subglyph.transform.yy = yy;

        num_subglyphs++;

        count_read += count;

    } while (subglyph.flags & FT_Common.MORE_COMPONENTS);

    gloader.current.num_subglyphs = num_subglyphs;

    if (loader.face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER)
    {
        loader.ins_pos = loader.stream.pos + s.cur - loader.limit;
    }
    
    loader.cursor = s.cur;
    return error
}

function TT_Process_Simple_Glyph(loader)
{
    var gloader = loader.gloader;
    var error = 0;

    var outline  = gloader.current.outline;
    var base  = gloader.base.outline;
    var n_points = outline.n_points;

    var points = base.points;
    var p_s = outline.points;
    var s = p_s + n_points;
    var tags = base.tags;
    var t_s = outline.tags;
    var t = t_s + n_points;

    points[s    ].x = loader.pp1.x;
    points[s + 1].x = loader.pp2.x;
    points[s + 2].x = loader.pp3.x;
    points[s + 3].x = loader.pp4.x;
    points[s    ].y = loader.pp1.y;
    points[s + 1].y = loader.pp2.y;
    points[s + 2].y = loader.pp3.y;
    points[s + 3].y = loader.pp4.y;

    tags[t    ] = 0;
    tags[t + 1] = 0;
    tags[t + 2] = 0;
    tags[t + 3] = 0;

    n_points += 4;
    s += 4;

    //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT
    if (loader.face.doblend != 0)
    {
        var deltas = TT_Vary_Get_Glyph_Deltas(loader.face, loader.glyph_index, n_points);
        error = FT_Error;
        if (error != 0)
            return error;

        for (var i = 0; i < n_points; i++)
        {
            points[i + p_s].x += deltas[i].x;
            points[i + p_s].y += deltas[i].y;
        }

        deltas = null;
    }
    //#endif

    if ((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
    {
        tt_prepare_zone_cur(loader.zone, gloader, 0, 0);

        var _p_len = loader.zone.n_points + 4;

        var _orus = loader.zone.orus;
        var _cur = loader.zone.cur;
        for (var i = 0; i < _p_len; i++)
        {
            _orus[loader.zone._offset_orus + i].x = _cur[loader.zone._offset_cur + i].x;
            _orus[loader.zone._offset_orus + i].y = _cur[loader.zone._offset_cur + i].y;
        }
    }

    var _face = loader.face;
    if (_face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        var x_scale_factor = 1000;
        var ppem = loader.size.metrics.x_ppem;
        if ((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
        {
            x_scale_factor = global_SubpixHintingHacks.sph_test_tweak_x_scaling(_face, _face.family_name, ppem, _face.style_name, loader.glyph_index);
        }

        if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0 || x_scale_factor != 1000)
        {
            var x_scale = FT_MulDiv(loader.size.metrics.x_scale, x_scale_factor, 1000);
            var y_scale = loader.size.metrics.y_scale;

            /* compensate for any scaling by de/emboldening; */
            /* the amount was determined via experimentation */
            if (x_scale_factor != 1000 && ppem > 11)
                FT_Outline_EmboldenXY(outline, FT_MulFix(1280 * ppem, 1000 - x_scale_factor), 0);

            for (var vec = 0 ; vec < n_points; vec++)
            {
                points[vec + p_s].x = FT_MulFix(points[vec + p_s].x, x_scale);
                points[vec + p_s].y = FT_MulFix(points[vec + p_s].y, y_scale);
            }

            loader.pp1.x = points[s - 4].x;
            loader.pp2.x = points[s - 3].x;
            loader.pp3.x = points[s - 2].x;
            loader.pp4.x = points[s - 1].x;
            loader.pp1.y = points[s - 4].y;
            loader.pp2.y = points[s - 3].y;
            loader.pp3.y = points[s - 2].y;
            loader.pp4.y = points[s - 1].y;
        }
    }
    else
    {
        if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
        {
            var x_scale = loader.size.metrics.x_scale;
            var y_scale = loader.size.metrics.y_scale;

            for (var vec = 0 ; vec < n_points; vec++)
            {
                points[vec + p_s].x = FT_MulFix(points[vec + p_s].x, x_scale);
                points[vec + p_s].y = FT_MulFix(points[vec + p_s].y, y_scale);
            }

            loader.pp1.x = points[s - 4].x;
            loader.pp2.x = points[s - 3].x;
            loader.pp3.x = points[s - 2].x;
            loader.pp4.x = points[s - 1].x;
            loader.pp1.y = points[s - 4].y;
            loader.pp2.y = points[s - 3].y;
            loader.pp3.y = points[s - 2].y;
            loader.pp4.y = points[s - 1].y;
        }
    }

    if ((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
    {
        loader.zone.n_points += 4;
        error = TT_Hint_Glyph(loader, false);
    }

    return error;
}

function TT_Process_Composite_Component(loader, subglyph, start_point, num_base_points)
{
    var gloader = loader.gloader;
    var base_vecs = gloader.base.outline.points;
    var base_vec = 0;
    var num_points = gloader.base.outline.n_points;
    var x, y;

    var have_scale = (0 == (subglyph.flags & (FT_Common.WE_HAVE_A_SCALE | FT_Common.WE_HAVE_AN_XY_SCALE | FT_Common.WE_HAVE_A_2X2))) ? 0 : 1;

    if (have_scale != 0)
    {
        for (var i = num_base_points; i < num_points; i++)
            FT_Vector_Transform(base_vecs[i], subglyph.transform);
    }

    if (0 == (subglyph.flags & FT_Common.ARGS_ARE_XY_VALUES))
    {
        var k = subglyph.arg1;
        var l = subglyph.arg2;
        k += start_point;
        l += num_base_points;
        if (k >= num_base_points || l >= num_points)
            return FT_Common.FT_Err_Invalid_Composite;

        var p1 = gloader.base.outline.points[k];
        var p2 = gloader.base.outline.points[l];

        x = p1.x - p2.x;
        y = p1.y - p2.y;
    }
    else
    {
        x = subglyph.arg1;
        y = subglyph.arg2;

        if (x == 0 && y == 0)
            return 0;

        if (have_scale != 0 && 0 != (subglyph.flags & FT_Common.SCALED_COMPONENT_OFFSET))
        {
            var mac_xscale = FT_SqrtFixed(FT_MulFix(subglyph.transform.xx, subglyph.transform.xx) +
                                            FT_MulFix(subglyph.transform.xy, subglyph.transform.xy));
            var mac_yscale = FT_SqrtFixed(FT_MulFix(subglyph.transform.yy, subglyph.transform.yy) +
                                            FT_MulFix(subglyph.transform.yx, subglyph.transform.yx));


            x = FT_MulFix(x, mac_xscale);
            y = FT_MulFix(y, mac_yscale);
        }

        if (0 == (loader.load_flags & FT_Common.FT_LOAD_NO_SCALE))
        {
            var x_scale = loader.size.metrics.x_scale;
            var y_scale = loader.size.metrics.y_scale;

            x = FT_MulFix(x, x_scale);
            y = FT_MulFix(y, y_scale);

            if (subglyph.flags & FT_Common.ROUND_XY_TO_GRID)
            {
                x = FT_PIX_ROUND(x);
                y = FT_PIX_ROUND(y);
            }
        }
    }

    if (x != 0)
    {
        for (var j=num_base_points;j<num_points;j++)
            base_vecs[j].x += x;
    }
    if (y != 0)
    {
        for (var j=num_base_points;j<num_points;j++)
            base_vecs[j].y += y;
    }
    
    return 0;
}

function TT_Process_Composite_Glyph(loader, start_point, start_contour)
{
    var outline = loader.gloader.base.outline;

    /* make room for phantom points */
    var error = FT_GLYPHLOADER_CHECK_POINTS(loader.gloader, outline.n_points + 4, 0);
    if (error != 0)
        return error;

    var _points = outline.points;
    var _n_points = outline.n_points;
    var _tags = outline.tags;

    _points[_n_points].x = loader.pp1.x;
    _points[_n_points].y = loader.pp1.y;

    _points[_n_points + 1].x = loader.pp2.x;
    _points[_n_points + 1].y = loader.pp2.y;

    _points[_n_points + 2].x = loader.pp3.x;
    _points[_n_points + 2].y = loader.pp3.y;

    _points[_n_points + 3].x = loader.pp4.x;
    _points[_n_points + 3].y = loader.pp4.y;

    _tags[_n_points] = 0;
    _tags[_n_points + 1] = 0;
    _tags[_n_points + 2] = 0;
    _tags[_n_points + 3] = 0;

    if (loader.face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER) //#ifdef TT_USE_BYTECODE_INTERPRETER
    {
        /* TT_Load_Composite_Glyph only gives us the offset of instructions */
        /* so we read them here                                             */
        var stream = loader.stream;
        error = stream.Seek(loader.ins_pos);
        if (error != 0)
            return error;

        var n_ins = stream.ReadUShort();
        error = FT_Error;
        FT_Error = 0;
        if (error != 0)
            return error;

        /* check it */
        var max_ins = loader.face.max_profile.maxSizeOfInstructions;
        if (n_ins > max_ins)
        {
            /* acroread ignores this field, so we only do a rough safety check */
            if (n_ins > loader.byte_len)
                return FT_Common.FT_Err_Too_Many_Hints;
        
            var ret = Update_MaxBYTE(loader.exec.memory, loader.exec.glyphSize, loader.exec.glyphIns, n_ins);
            if (ret != null)
            {
                loader.exec.glyphSize = ret.size;
                loader.exec.glyphIns = ret.block;
            }

            if ( error )
                return error;
        }
        else if (n_ins == 0)
            return 0;

        error = stream.Read(loader.exec.glyphIns, n_ins);
        if (error != 0)
            return error;

        loader.glyph.control_data = dublicate_pointer(loader.exec.glyphIns);
        loader.glyph.control_len = n_ins;
    }
    //#endif

    tt_prepare_zone(loader.zone, loader.gloader.base, start_point, start_contour);

    /* Some points are likely touched during execution of  */
    /* instructions on components.  So let's untouch them. */
    for (var i = start_point; i < loader.zone.n_points; i++)
        loader.zone.tags[i] &= ~FT_Common.FT_CURVE_TAG_TOUCH_BOTH;

    loader.zone.n_points += 4;

    return TT_Hint_Glyph(loader, true);
}

function TT_Hint_Glyph(loader, is_composite)
{
    var zone = loader.zone;
    var n_ins = 0;

    var _tt_hints = loader.face.driver.library.tt_hint_props;
    if (_tt_hints.TT_USE_BYTECODE_INTERPRETER) //#ifdef TT_USE_BYTECODE_INTERPRETER
    {
        n_ins = loader.glyph.control_len;
    }
    //#endif

    var origin = zone.cur[zone._offset_cur + zone.n_points - 4].x;
    origin = FT_PIX_ROUND(origin) - origin;
    if (origin != 0)
        translate_array_ex(zone.n_points, zone.cur, zone._offset_cur, origin, 0);

    if (_tt_hints.TT_USE_BYTECODE_INTERPRETER) //#ifdef TT_USE_BYTECODE_INTERPRETER
    {
        /* save original point position in org */
        if (n_ins > 0)
        {
            var _arr_d = zone.org;
            var _arr_s = zone.cur;
            var _count = zone.n_points;
            var _d_s = zone._offset_org;
            var _s_s = zone._offset_cur;

            for (var i = 0; i < _count; i++)
            {
                _arr_d[i + _d_s].x = _arr_s[i + _s_s].x;
                _arr_d[i + _d_s].y = _arr_s[i + _s_s].y;
            }
        }

        /* Reset graphics state. */
        loader.size.GS.Copy(loader.exec.GS);

        /* XXX: UNDOCUMENTED! Hinting instructions of a composite glyph */
        /*      completely refer to the (already) hinted subglyphs.     */
        if (is_composite)
        {
            loader.exec.metrics.x_scale = 1 << 16;
            loader.exec.metrics.y_scale = 1 << 16;

            var _arr_d = zone.orus;
            var _arr_s = zone.cur;
            var _count = zone.n_points;
            var _d_s = zone._offset_orus;
            var _s_s = zone._offset_cur;

            for (var i = 0; i < _count; i++)
            {
                _arr_d[i + _d_s].x = _arr_s[i + _s_s].x;
                _arr_d[i + _d_s].y = _arr_s[i + _s_s].y;
            }
        }
        else
        {
            loader.exec.metrics.x_scale = loader.size.metrics.x_scale;
            loader.exec.metrics.y_scale = loader.size.metrics.y_scale;
        }
    }//#endif

    /* round pp2 and pp4 */
    zone.cur[zone._offset_cur + zone.n_points - 3].x = FT_PIX_ROUND(zone.cur[zone._offset_cur + zone.n_points - 3].x);
    zone.cur[zone._offset_cur + zone.n_points - 1].y = FT_PIX_ROUND(zone.cur[zone._offset_cur + zone.n_points - 1].y);

    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if ( n_ins > 0 )
    {
        var base_outline = loader.gloader.base.outline;
        var current_outline = loader.gloader.current.outline;

        var error = TT_Set_CodeRange(loader.exec, FT_Common.tt_coderange_glyph, loader.exec.glyphIns, n_ins);
        if (error)
            return error;

        loader.exec.is_composite = is_composite;
        loader.exec.pts.Copy(zone);

        var debug = (!(loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) && loader.size.debug) ? true : false;

        error = TT_Run_Context(loader.exec, debug);
        if (error && loader.exec.pedantic_hinting)
            return error;

        /* store drop-out mode in bits 5-7; set bit 2 also as a marker */
        base_outline.tags[current_outline.tags] |= (loader.exec.GS.scan_type << 5) | FT_Common.FT_CURVE_TAG_HAS_SCANMODE;
    }
    //#endif

    /* save glyph phantom points */
    if (!loader.preserve_pps)
    {
        var _off = zone.n_points + zone._offset_cur;

        loader.pp1.x = zone.cur[_off - 4].x;
        loader.pp1.y = zone.cur[_off - 4].y;

        loader.pp2.x = zone.cur[_off - 3].x;
        loader.pp2.y = zone.cur[_off - 3].y;

        loader.pp3.x = zone.cur[_off - 2].x;
        loader.pp3.y = zone.cur[_off - 2].y;

        loader.pp4.x = zone.cur[_off - 1].x;
        loader.pp4.y = zone.cur[_off - 1].y;
    }

    if (_tt_hints.TT_CONFIG_OPTION_SUBPIXEL_HINTING) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (loader.exec.sph_tweak_flags & FT_Common.SPH_TWEAK_DEEMBOLDEN)
            FT_Outline_EmboldenXY(loader.gloader.current.outline, -24, 0);
        else if (loader.exec.sph_tweak_flags & FT_Common.SPH_TWEAK_EMBOLDEN)
            FT_Outline_EmboldenXY(loader.gloader.current.outline, 24, 0);
    }//#endif
    return 0;
}

function tt_prepare_zone(zone, load, start_point, start_contour)
{
    zone.n_points    = (load.outline.n_points - start_point) & 0xFFFF;
    zone.n_contours  = FT_Common.UShort_To_Short((load.outline.n_contours - start_contour) & 0xFFFF);

    zone.org = load.extra_points;
    zone._offset_org = start_point;

    zone.cur = load.outline.points;
    zone._offset_cur = start_point;

    zone.orus = load.extra_points;
    zone._offset_orus = load.extra_points2 + start_point;

    zone.tags = load.outline.tags;
    zone._offset_tags = start_point;

    zone.contours = load.outline.contours;
    zone._offset_contours = start_contour;

    zone.first_point = start_point;
}

function tt_prepare_zone_cur(zone, load, start_point, start_contour)
{
    var _base = load.base;
    var _cur = load.current;

    zone.n_points    = (_cur.outline.n_points - start_point) & 0xFFFF;
    zone.n_contours  = FT_Common.UShort_To_Short((_cur.outline.n_contours - start_contour) & 0xFFFF);

    zone.org = _base.extra_points;
    zone._offset_org = _cur.extra_points + start_point;

    zone.cur = _base.outline.points;
    zone._offset_cur = _cur.outline.points + start_point;

    zone.orus = _base.extra_points;
    zone._offset_orus = _cur.extra_points2 + start_point;

    zone.tags = _base.outline.tags;
    zone._offset_tags = _cur.outline.tags + start_point;

    zone.contours = _base.outline.contours;
    zone._offset_contours = _cur.outline.contours + start_contour;

    zone.first_point = start_point;
}

function tt_size_run_prep(size, pedantic)
{
    var face = size.face;
    var exec;
    var error = 0;

    /* debugging instances have their own context */
    if (size.debug)
        exec = size.context;
    else
        exec = face.driver.context;

    if (exec == null)
        return FT_Common.FT_Err_Could_Not_Find_Context;

    TT_Load_Context(exec, face, size);

    exec.callTop = 0;
    exec.top     = 0;

    exec.instruction_trap = false;
    exec.pedantic_hinting = pedantic;

    TT_Set_CodeRange(exec, FT_Common.tt_coderange_cvt, face.cvt_program, face.cvt_program_size);
    TT_Clear_CodeRange(exec, FT_Common.tt_coderange_glyph);

    if (face.cvt_program_size > 0)
    {
        error = TT_Goto_CodeRange(exec, FT_Common.tt_coderange_cvt, 0);

        if (!error && !size.debug)
        {
            error = face.interpreter(exec);
        }
    }
    else
        error = 0;

    /* save as default graphics state */
    exec.GS.Copy(size.GS);

    // _DEBUG!
    /*
    var __arr = exec.stack;
    var __len = exec.stackSize;
    for (var __i = 0; __i < __len; ++__i)
        console.log("" + __i + ": " + __arr[__i]);
    */
    //

    TT_Save_Context(exec, size);
    return error;
}

function tt_loader_init(loader, size, glyph, load_flags, glyf_table_only)
{
    var face = glyph.face;
    var stream = face.stream;
    var pedantic = (0 == (load_flags & FT_Common.FT_LOAD_PEDANTIC)) ? 0 : 1;

    loader.Clear();

    var bIsHint = face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER;
    var bIsSubpixHint = face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    if (bIsHint)//#ifdef TT_USE_BYTECODE_INTERPRETER
    {/* load execution context */
        if ((load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0 && !glyf_table_only)
        {
            var grayscale = false;

            //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
            var subpixel_hinting = false;
            var grayscale_hinting = false;
            //#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

            if (!size.cvt_ready)
            {
                var error = tt_size_ready_bytecode(size, pedantic);
                if (error != 0)
                    return error;
            }

            /* query new execution context */
            var exec = size.debug ? size.context : face.driver.context;
            if (exec == null)
                return FT_Common.FT_Err_Could_Not_Find_Context;

            if (bIsSubpixHint) // #ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
            {
                subpixel_hinting = ((FT_LOAD_TARGET_MODE(load_flags) != FT_Common.FT_RENDER_MODE_MONO) && FT_Common.SPH_OPTION_SET_SUBPIXEL);

                if (subpixel_hinting)
                    grayscale = grayscale_hinting = false;
                else if (FT_Common.SPH_OPTION_SET_GRAYSCALE)
                {
                    grayscale = grayscale_hinting = true;
                    subpixel_hinting = false;
                }

                if ((face.face_flags & FT_Common.FT_FACE_FLAG_TRICKY) != 0)
                    subpixel_hinting = grayscale_hinting = false;

                exec.ignore_x_mode = subpixel_hinting || grayscale_hinting;
                exec.rasterizer_version = FT_Common.SPH_OPTION_SET_RASTERIZER_VERSION;
                if (exec.sph_tweak_flags & FT_Common.SPH_TWEAK_RASTERIZER_35)
                    exec.rasterizer_version = 35;

                if (true)
                {
                    exec.compatible_widths     = FT_Common.SPH_OPTION_SET_COMPATIBLE_WIDTHS;
                    exec.symmetrical_smoothing = false;
                    exec.bgr                   = false;
                    exec.subpixel_positioned   = true;
                }
                else
                {
                    /*
                    exec.compatible_widths = (FT_LOAD_TARGET_MODE(load_flags) !=  FT_Common.TT_LOAD_COMPATIBLE_WIDTHS);
                    exec.symmetrical_smoothing = (FT_LOAD_TARGET_MODE(load_flags) != FT_Common.TT_LOAD_SYMMETRICAL_SMOOTHING);
                    exec.bgr = (FT_LOAD_TARGET_MODE(load_flags) != FT_Common.TT_LOAD_BGR);
                    exec.subpixel_positioned = (FT_LOAD_TARGET_MODE(load_flags) != FT_Common.TT_LOAD_SUBPIXEL_POSITIONED);
                    */
                }
            }/* !TT_CONFIG_OPTION_SUBPIXEL_HINTING */
            else
            {
                grayscale = (FT_LOAD_TARGET_MODE(load_flags) != FT_Common.FT_RENDER_MODE_MONO);
            }/* !TT_CONFIG_OPTION_SUBPIXEL_HINTING */

            TT_Load_Context(exec, face, size);

            if (bIsSubpixHint)//#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
            {
                /* a change from mono to subpixel rendering (and vice versa) */
                /* requires a re-execution of the CVT program                */
                if (subpixel_hinting != exec.subpixel_hinting)
                {
                    exec.subpixel_hinting = subpixel_hinting;

                    for (var i = 0; i < size.cvt_size; i++)
                        size.cvt[i] = FT_MulFix(face.cvt[i], size.ttmetrics.scale);

                    tt_size_run_prep(size, pedantic);
                }

                /* a change from mono to grayscale rendering (and vice versa) */
                /* requires a re-execution of the CVT program                 */
                if (grayscale != exec.grayscale_hinting)
                {
                    exec.grayscale_hinting = grayscale_hinting;

                    for (var i = 0; i < size.cvt_size; i++)
                        size.cvt[i] = FT_MulFix(face.cvt[i], size.ttmetrics.scale);
                    tt_size_run_prep( size, pedantic );
                }
            }/* !TT_CONFIG_OPTION_SUBPIXEL_HINTING */
            else
            {
                /* a change from mono to grayscale rendering (and vice versa) */
                /* requires a re-execution of the CVT program                 */
                if (grayscale != exec.grayscale)
                {
                    exec.grayscale = grayscale;

                    for (i = 0; i < size.cvt_size; i++)
                        size.cvt[i] = FT_MulFix(face.cvt[i], size.ttmetrics.scale);

                    tt_size_run_prep(size, pedantic);
                }
            }//#endif /* !TT_CONFIG_OPTION_SUBPIXEL_HINTING */

            /* see whether the cvt program has disabled hinting */
            if (exec.GS.instruct_control & 1)
                load_flags |= FT_Common.FT_LOAD_NO_HINTING;

            /* load default graphics state -- if needed */
            if (exec.GS.instruct_control & 2)
                exec.GS.default_tt();

            exec.pedantic_hinting = ((load_flags & FT_Common.FT_LOAD_PEDANTIC) != 0) ? true : false;
            loader.exec = exec;
            loader.instructions = dublicate_pointer(exec.glyphIns);
        }
    }//#endif /* TT_USE_BYTECODE_INTERPRETER */

    if (face.internal.incremental_interface)
        loader.glyf_offset = 0;
    else
    {
        face.goto_table(face, FT_Common.TTAG_glyf, stream);
        var error = FT_Error;
        FT_Error = 0;
        if (error == FT_Common.FT_Err_Table_Missing)
            loader.glyf_offset = 0;
        else if ( error )
            return error;
        else
            loader.glyf_offset = stream.pos;
    }

    if (0 == glyf_table_only)
    {
        var gloader = glyph.internal.loader;
        FT_GlyphLoader_Rewind(gloader);
        loader.gloader = gloader;
    }

    loader.load_flags = load_flags;

    loader.face = face;
    loader.size = size;
    loader.glyph = glyph;
    loader.stream = stream;

    return 0;
}

function tt_face_get_device_metrics(face, ppem, gindex)
{
    var _ret = null;
    var record_size = face.hdmx_record_size;

    for (var nn = 0; nn < face.hdmx_record_count; nn++ )
    {
        if ( face.hdmx_record_sizes[nn] == ppem )
        {
            gindex += 2;
            if (gindex < record_size)
            {
                _ret = dublicate_pointer(face.hdmx_table);
                _ret.pos += (8 + nn * record_size + gindex);
            }

            break;
        }
    }

    return _ret;
}

function compute_glyph_metrics(loader, glyph_index)
{
    var bbox = new FT_BBox();
    var face = loader.face;
    var y_scale = 0x10000;
    var glyph = loader.glyph;
    var size = loader.size;

    if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
        y_scale = size.metrics.y_scale;

    if (glyph.format != FT_Common.FT_GLYPH_FORMAT_COMPOSITE)
        FT_Outline_Get_CBox(glyph.outline, bbox);
    else
    {
        bbox.xMin = loader.bbox.xMin;
        bbox.yMin = loader.bbox.yMin;
        bbox.xMax = loader.bbox.xMax;
        bbox.yMax = loader.bbox.yMax;
    }

    glyph.linearHoriAdvance = loader.linear;

    glyph.metrics.horiBearingX = bbox.xMin;
    glyph.metrics.horiBearingY = bbox.yMax;
    glyph.metrics.horiAdvance  = loader.pp2.x - loader.pp1.x;

    if (face.postscript.isFixedPitch == 0 && (loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
    {
        var widthp = tt_face_get_device_metrics(face, loader.size.metrics.x_ppem, glyph_index);

        if (face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
        {
            var ignore_x_mode = (FT_LOAD_TARGET_MODE(loader.load_flags) != FT_Common.FT_RENDER_MODE_MONO);

            if (null != widthp && ((ignore_x_mode && loader.exec.compatible_widths) || !ignore_x_mode || FT_Common.SPH_OPTION_BITMAP_WIDTHS))
                glyph.metrics.horiAdvance = widthp.data[widthp.pos] << 6;
        }
        else
        {
            if (null != widthp)
                glyph.metrics.horiAdvance = widthp.data[widthp.pos] << 6;
        }
    }

    glyph.metrics.width  = bbox.xMax - bbox.xMin;
    glyph.metrics.height = bbox.yMax - bbox.yMin;

    var top;
    var advance;

    if (face.vertical_info === true && face.vertical.number_Of_VMetrics > 0)
    {
        top = FT_DivFix(loader.pp3.y - bbox.yMax, y_scale);

        if (loader.pp3.y <= loader.pp4.y)
            advance = 0;
        else
            advance = FT_DivFix(loader.pp3.y - loader.pp4.y, y_scale);
    }
    else
    {
        var height = FT_DivFix(bbox.yMax - bbox.yMin, y_scale);
        if (face.os2.version != 0xFFFF)
            advance = face.os2.sTypoAscender - face.os2.sTypoDescender;
        else
            advance = face.horizontal.Ascender - face.horizontal.Descender;

        top = parseInt((advance - height)/2);
    }

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    var metrics = new FT_Incremental_MetricsRec();

    var incr = face.internal.incremental_interface;
    if (incr && incr.funcs.get_glyph_metrics)
    {
        metrics.bearing_x = 0;
        metrics.bearing_y = top;
        metrics.advance   = advance;

        var error = incr.funcs.get_glyph_metrics(incr.object, glyph_index, true, metrics);
        if (error != 0)
            return error;

        top     = metrics.bearing_y;
        advance = metrics.advance;
    }
    //#endif

    glyph.linearVertAdvance = advance;

    /* scale the metrics */
    if (0 == (loader.load_flags & FT_Common.FT_LOAD_NO_SCALE))
    {
        top     = FT_MulFix(top, y_scale);
        advance = FT_MulFix(advance, y_scale);
    }

    glyph.metrics.vertBearingX = glyph.metrics.horiBearingX - parseInt(glyph.metrics.horiAdvance / 2);
    glyph.metrics.vertBearingY = top;
    glyph.metrics.vertAdvance  = advance;

    return 0;
}
function TT_Load_Glyph(size, glyph, glyph_index, load_flags)
{
    var loader = new TT_LoaderRec();
    var face = glyph.face;
    var error = 0;

    //#ifdef TT_CONFIG_OPTION_EMBEDDED_BITMAPS
    if (size.strike_index != 0xFFFFFFFF && ((load_flags & FT_Common.FT_LOAD_NO_BITMAP) == 0))
    {
        error = load_sbit_image(size, glyph, glyph_index, load_flags);
        if (error == 0)
        {
            if ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
            {
                tt_loader_init(loader, size, glyph, load_flags, true);
                load_truetype_glyph(loader, glyph_index, 0, true);
                glyph.linearHoriAdvance = loader.linear;
                glyph.linearVertAdvance = loader.top_bearing + loader.bbox.yMax - loader.vadvance;
            }

            return 0;
        }
    }
    //#endif

    if ((0 == (load_flags & FT_Common.FT_LOAD_NO_SCALE)) && (size.ttmetrics.valid == 0))
        return FT_Common.FT_Err_Invalid_Size_Handle;

    if ((load_flags & FT_Common.FT_LOAD_SBITS_ONLY) != 0)
        return FT_Common.FT_Err_Invalid_Argument;

    error = tt_loader_init(loader, size, glyph, load_flags, false);
    if (error != 0)
        return error;

    glyph.format        = FT_Common.FT_GLYPH_FORMAT_OUTLINE;
    glyph.num_subglyphs = 0;
    glyph.outline.flags = 0;

    /* main loading loop */
    error = load_truetype_glyph(loader, glyph_index, 0, false);
    if (error == 0)
    {
        if (glyph.format == FT_Common.FT_GLYPH_FORMAT_COMPOSITE)
        {
            glyph.num_subglyphs = loader.gloader.base.num_subglyphs;
            glyph.subglyphs     = loader.gloader.base.subglyphs;
        }
        else
        {
            EquatingOutline(glyph.outline, loader.gloader.base.outline);
            glyph.outline.flags &= ~FT_Common.FT_OUTLINE_SINGLE_PASS;

            if (loader.pp1.x != 0)
                FT_Outline_Translate(glyph.outline, -loader.pp1.x, 0);
        }

        if (face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER && ((load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0))
        {
            if (loader.exec.GS.scan_control)
            {
                /* convert scan conversion mode to FT_OUTLINE_XXX flags */
                switch (loader.exec.GS.scan_type)
                {
                case 0: /* simple drop-outs including stubs */
                    glyph.outline.flags |= FT_Common.FT_OUTLINE_INCLUDE_STUBS;
                    break;
                case 1: /* simple drop-outs excluding stubs */
                    /* nothing; it's the default rendering mode */
                    break;
                case 4: /* smart drop-outs including stubs */
                    glyph.outline.flags |= (FT_Common.FT_OUTLINE_SMART_DROPOUTS | FT_Common.FT_OUTLINE_INCLUDE_STUBS);
                    break;
                case 5: /* smart drop-outs excluding stubs  */
                    glyph.outline.flags |= FT_Common.FT_OUTLINE_SMART_DROPOUTS;
                    break;

                default: /* no drop-out control */
                    glyph.outline.flags |= FT_Common.FT_OUTLINE_IGNORE_DROPOUTS;
                    break;
                }
            }
            else
                glyph.outline.flags |= FT_Common.FT_OUTLINE_IGNORE_DROPOUTS;
        }
        compute_glyph_metrics(loader, glyph_index);
    }

    if ((0 == (load_flags & FT_Common.FT_LOAD_NO_SCALE)) && size.metrics.y_ppem < 24)
        glyph.outline.flags |= FT_Common.FT_OUTLINE_HIGH_PRECISION;

    return error;
}

function load_truetype_glyph(loader, glyph_index, recurse_count, header_only)
{
    var error = 0;
    var x_scale, y_scale;
    var offset;
    var face = loader.face;
    var gloader = loader.gloader;
    var opened_frame = 0;

    var glyph_data;
    var glyph_data_loaded = 0;

    if (recurse_count > 1 && recurse_count > face.max_profile.maxComponentDepth )
        return FT_Common.FT_Err_Invalid_Composite;

    if (glyph_index >= face.num_glyphs)
        error = FT_Common.FT_Err_Invalid_Glyph_Index;

    loader.glyph_index = glyph_index;

    if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
    {
        x_scale = loader.size.metrics.x_scale;
        y_scale = loader.size.metrics.y_scale;
    }
    else
    {
        x_scale = 0x10000;
        y_scale = 0x10000;
    }

    tt_get_metrics(loader, glyph_index);

    if (face.internal.incremental_interface != null)
    {
        glyph_data = face.internal.incremental_interface.funcs.get_glyph_data(face.internal.incremental_interface.object, glyph_index);
        error = FT_Error;
        if (error != 0)
            return error;

        glyph_data_loaded = 1;
        offset = 0;
        loader.byte_len  = glyph_data.length;

        loader.stream = new FT_Stream(glyph_data.pointer, glyph_data.length);
    }
    else
    {
        var __mem = tt_face_get_location(face, glyph_index);
        offset = __mem.loc;
        loader.byte_len = __mem.size;
    }

    if (loader.byte_len > 0)
    {
        if (0 == loader.glyf_offset && null == face.internal.incremental_interface)
            return FT_Common.FT_Err_Invalid_Table;

        error = face.access_glyph_frame(loader, glyph_index, loader.glyf_offset + offset, loader.byte_len);
        if (error != 0)
            return error;

        opened_frame = 1;

        error = face.read_glyph_header(loader);
        if (error != 0 || header_only)
            return error;
    }

    var subpixel_ = (loader.exec && loader.exec.subpixel_hinting) ? true : false;
    var subpixel_ = (loader.exec && loader.exec.grayscale_hinting) ? true : false;
    var use_aw_2_  = (subpixel_ && grayscale_);

    if (loader.byte_len == 0 || loader.n_contours == 0)
    {
        loader.bbox.xMin = 0;
        loader.bbox.xMax = 0;
        loader.bbox.yMin = 0;
        loader.bbox.yMax = 0;

        if (header_only == 1)
            return error;

        loader.pp1.x = loader.bbox.xMin - loader.left_bearing;
        loader.pp1.y = 0;
        loader.pp2.x = loader.pp1.x + loader.advance;
        loader.pp2.y = 0;
        loader.pp3.x = use_aw_2_ ? (loader.advance >> 0) : 0;
        loader.pp3.y = loader.top_bearing + loader.bbox.yMax;
        loader.pp4.x = use_aw_2_ ? (loader.advance >> 0) : 0;
        loader.pp4.y = loader.pp3.y - loader.vadvance;

        //#ifdef FT_CONFIG_OPTION_INCREMENTAL
        tt_get_metrics_incr_overrides(loader, glyph_index);
        //#endif

        //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT
        if (loader.face.doblend != 0)
        {
            var deltas = TT_Vary_Get_Glyph_Deltas(loader.face, glyph_index, 4);
            error = FT_Error;
            if (error != 0)
                return error;

            loader.pp1.x += deltas[0].x; loader.pp1.y += deltas[0].y;
            loader.pp2.x += deltas[1].x; loader.pp2.y += deltas[1].y;
            loader.pp3.x += deltas[2].x; loader.pp3.y += deltas[2].y;
            loader.pp4.x += deltas[3].x; loader.pp4.y += deltas[3].y;

            deltas = null;
        }
        //#endif

        if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
        {
            loader.pp1.x = FT_MulFix(loader.pp1.x, x_scale);
            loader.pp2.x = FT_MulFix(loader.pp2.x, x_scale);
            loader.pp3.y = FT_MulFix(loader.pp3.y, y_scale);
            loader.pp4.y = FT_MulFix(loader.pp4.y, y_scale);
        }

        error = 0;
        return error;
    }

    loader.pp1.x = loader.bbox.xMin - loader.left_bearing;
    loader.pp1.y = 0;
    loader.pp2.x = loader.pp1.x + loader.advance;
    loader.pp2.y = 0;
    loader.pp3.x = use_aw_2_ ? (loader.advance >> 0) : 0;
    loader.pp3.y = loader.top_bearing + loader.bbox.yMax;
    loader.pp4.x = use_aw_2_ ? (loader.advance >> 0) : 0;
    loader.pp4.y = loader.pp3.y - loader.vadvance;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    tt_get_metrics_incr_overrides(loader, glyph_index);
    //#endif

    if (loader.n_contours > 0)
    {
        error = face.read_simple_glyph( loader );
        if (error != 0)
            return error;

        face.forget_glyph_frame(loader);
        opened_frame = 0;

        error = TT_Process_Simple_Glyph(loader);
        if (error != 0)
            return error;

        FT_GlyphLoader_Add(gloader);
    }
    else if (loader.n_contours == -1)
    {
        var start_point = gloader.base.outline.n_points;
        var start_contour = gloader.base.outline.n_contours;

        error = face.read_composite_glyph(loader);
        if (error != 0)
            return error;

        var ins_pos = loader.ins_pos;

        face.forget_glyph_frame( loader );
        opened_frame = 0;

        //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT

        if (face.doblend != 0)
        {
            var deltas = TT_Vary_Get_Glyph_Deltas(face, glyph_index, gloader.current.num_subglyphs + 4);
            error = FT_Error;
            if (error != 0)
                return error;

            var subglyph = gloader.current.subglyphs[gloader.base.num_subglyphs];
            var limit = gloader.current.num_subglyphs;

            var i = 0;
            for (; i < limit; ++i, ++subglyph )
            {
                if (subglyph.flags & FT_Common.ARGS_ARE_XY_VALUES)
                {
                    subglyph.arg1 += (deltas[i].x & 0xFFFF);
                    subglyph.arg2 += (deltas[i].y & 0xFFFF);
                }
            }

            loader.pp1.x += deltas[i + 0].x; loader.pp1.y += deltas[i + 0].y;
            loader.pp2.x += deltas[i + 1].x; loader.pp2.y += deltas[i + 1].y;
            loader.pp3.x += deltas[i + 2].x; loader.pp3.y += deltas[i + 2].y;
            loader.pp4.x += deltas[i + 3].x; loader.pp4.y += deltas[i + 3].y;

            deltas = null;
        }
        //#endif /* TT_CONFIG_OPTION_GX_VAR_SUPPORT */

        if ((loader.load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0)
        {
            loader.pp1.x = FT_MulFix(loader.pp1.x, x_scale);
            loader.pp2.x = FT_MulFix(loader.pp2.x, x_scale);
            loader.pp3.y = FT_MulFix(loader.pp3.y, y_scale);
            loader.pp4.y = FT_MulFix(loader.pp4.y, y_scale);
        }

        if ((loader.load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0)
        {
            FT_GlyphLoader_Add( gloader );
            loader.glyph.format = FT_Common.FT_GLYPH_FORMAT_COMPOSITE;

            return error;
        }

        var n, num_base_points;
        var subglyph       = 0;

        var num_points     = start_point;
        var num_subglyphs  = gloader.current.num_subglyphs;
        var num_base_subgs = gloader.base.num_subglyphs;

        var old_stream = loader.stream;
        var old_byte_len = loader.byte_len;

        FT_GlyphLoader_Add(gloader);

        for ( n = 0; n < num_subglyphs; n++ )
        {
            var pp = new Array(4);
            subglyph = gloader.base.subglyphs[num_base_subgs + n];

            pp[0] = loader.pp1;
            pp[1] = loader.pp2;
            pp[2] = loader.pp3;
            pp[3] = loader.pp4;

            num_base_points = gloader.base.outline.n_points;

            error = load_truetype_glyph(loader, subglyph.index, recurse_count + 1, 0);
            if (error != 0)
                return error;

            subglyph = gloader.base.subglyphs[num_base_subgs + n];

            if (0 == (subglyph.flags & 0x0200))
            {
                loader.pp1 = pp[0];
                loader.pp2 = pp[1];
                loader.pp3 = pp[2];
                loader.pp4 = pp[3];
            }

            if (gloader.base.outline.n_points == num_base_points)
                continue;

            TT_Process_Composite_Component(loader, subglyph, start_point, num_base_points);
        }

        loader.stream   = old_stream;
        loader.byte_len = old_byte_len;

        loader.ins_pos = ins_pos;

        var bIsSubFlags = true;
        if (bIsSubFlags && face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER)
            bIsSubFlags = ((subglyph.flags & FT_Common.WE_HAVE_INSTR) != 0);

        if (((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0) && bIsSubFlags && num_points > start_point)
            TT_Process_Composite_Glyph(loader, start_point, start_contour);
    }
    else
        return FT_Common.FT_Err_Invalid_Outline;

    if (opened_frame == 1)
        face.forget_glyph_frame(loader);

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (glyph_data_loaded != 0)
    {
        face.internal.incremental_interface.funcs.free_glyph_data(face.internal.incremental_interface.object, glyph_data);
        glyph_data = null;
    }
    //#endif
    return error;
}
function TT_Init_Glyph_Loading(face)
{
    face.access_glyph_frame   = TT_Access_Glyph_Frame;
    face.read_glyph_header    = TT_Load_Glyph_Header;
    face.read_simple_glyph    = TT_Load_Simple_Glyph;
    face.read_composite_glyph = TT_Load_Composite_Glyph;
    face.forget_glyph_frame   = TT_Forget_Glyph_Frame;
}
/******************************************************************************/
// driver
/******************************************************************************/
var tt_service_truetype_engine = new FT_Service_TrueTypeEngineRec(0);
var tt_service_truetype_glyf = new FT_Service_TTGlyfRec(tt_face_get_location);
var tt_service_gx_multi_masters = new FT_Service_MultiMastersRec(null,null,TT_Set_MM_Blend,TT_Get_MM_Var,TT_Set_Var_Design);
var tt_services = new Array(4);
tt_services[0] = new FT_ServiceDescRec(FT_SERVICE_ID_XF86_NAME,FT_XF86_FORMAT_TRUETYPE);
tt_services[1] = new FT_ServiceDescRec(FT_SERVICE_ID_MULTI_MASTERS,tt_service_gx_multi_masters);
tt_services[2] = new FT_ServiceDescRec(FT_SERVICE_ID_TRUETYPE_ENGINE,tt_service_truetype_engine);
tt_services[3] = new FT_ServiceDescRec(FT_SERVICE_ID_TT_GLYF,tt_service_truetype_glyf);

var FT_TT_SERVICES_GET                  = tt_services;
var FT_TT_SERVICE_GX_MULTI_MASTERS_GET  = tt_service_gx_multi_masters;
var FT_TT_SERVICE_TRUETYPE_GLYF_GET     = tt_service_truetype_glyf;

function tt_check_trickyness_sfnt_ids(face)
{
    var checksum = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var num_matched_ids = new Array(13);
    for (var l = 0; l < 13; l++)
        num_matched_ids[l] = 0;

    var TRICK_SFNT_ID_cvt = 0;
    var TRICK_SFNT_ID_fpgm = 1;
    var TRICK_SFNT_ID_prep = 2;

    var has_cvt  = false;
    var has_fpgm = false;
    var has_prep = false;

    var sfnt_id = face.driver.sfnt_id;

    for (i = 0; i < face.num_tables; i++)
    {
        checksum = 0;
        switch(face.dir_tables[i].Tag)
        {
            case FT_Common.TTAG_cvt:
                k = TRICK_SFNT_ID_cvt;
                has_cvt  = true;
                break;

            case FT_Common.TTAG_fpgm:
                k = TRICK_SFNT_ID_fpgm;
                has_fpgm = true;
                break;

            case FT_Common.TTAG_prep:
                k = TRICK_SFNT_ID_prep;
                has_prep = true;
                break;

            default:
                continue;
        }

        for ( j = 0; j < 13; j++ )
            if ( face.dir_tables[i].Length == sfnt_id[j][k].Length )
            {
                if (checksum != 0)
                    checksum = tt_get_sfnt_checksum(face, i);

                if (sfnt_id[j][k].CheckSum == checksum)
                    num_matched_ids[j]++;

                if (num_matched_ids[j] == 3)
                    return true;
            }
    }
    for (j = 0; j < 13; j++)
    {
        if ( !has_cvt  && !sfnt_id[j][TRICK_SFNT_ID_cvt].Length )
            num_matched_ids[j] ++;
        if ( !has_fpgm && !sfnt_id[j][TRICK_SFNT_ID_fpgm].Length )
            num_matched_ids[j] ++;
        if ( !has_prep && !sfnt_id[j][TRICK_SFNT_ID_prep].Length )
            num_matched_ids[j] ++;
        if (num_matched_ids[j] == 3)
            return true;
    }
    return false;
}
function tt_get_sfnt_checksum(face, i)
{
    if (!face.goto_table)
        return 0;

    var len = face.goto_table(face, face.dir_tables[i].Tag, face.stream);
        return 0;

    if (FT_Error != FT_Common.FT_Err_Ok)
        return 0;

    return tt_synth_sfnt_checksum(face.stream, face.dir_tables[i].Length);
}
function tt_synth_sfnt_checksum(stream, length)
{
    var error = 0;
    var checksum = 0;
    var i = 0;

    var len = length;
    if (FT_Common.FT_Err_Ok != stream.EnterFrame(len))
        return 0;

    for ( ; len > 3; len -= 4 )
        checksum += stream.GetULong();

    for ( i = 3; len > 0; len --,i--)
        checksum += (stream.GetUChar() << (i * 8));

    stream.ExitFrame();
    return checksum;
}
function tt_check_trickyness(face)
{
    if (!face)
        return false;

    if ((face.family_name != "") && (tt_check_trickyness_family(face.family_name) === true))
        return true;

    return tt_check_trickyness_sfnt_ids(face);
}
function tt_check_trickyness_family(name)
{
    if (name == "DFKaiSho-SB")
        return true;
    if (name == "DFKaiShu")
        return true;
    if (name == "DFKai-SB")
        return true;
    if (name == "HuaTianKaiTi?")
        return true;
    if (name == "HuaTianSongTi?")
        return true;
    if (name == "MingLiU")
        return true;
    if (name == "PMingLiU")
        return true;
    if (name == "MingLi43")
        return true;
    return false;
}
function tt_face_load_hdmx(face, stream)
{
    var error = FT_Common.FT_Err_Ok;
    var version = 0;
    var nn = 0;
    var num_records = 0;
    var table_size = 0;
    var record_size = 0;

    table_size = face.goto_table(face, FT_Common.TTAG_hdmx, stream);
    if ( (FT_Error != FT_Common.FT_Err_Ok) || table_size < 8 )
    {
		FT_Error = 0;
		return FT_Common.FT_Err_Ok;
	}

    face.hdmx_table = new CPointer();
    error = stream.ExtractFrame(table_size, face.hdmx_table);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    var p = dublicate_pointer(face.hdmx_table);
    var end = p.pos + table_size;

    version     = FT_NEXT_USHORT(p);
    num_records = FT_NEXT_USHORT(p);
    record_size = FT_NEXT_ULONG(p);

    if (record_size >= 0xFFFF0000)
        record_size &= 0xFFFF;

    if (version != 0 || num_records > 255 || record_size > 0x10001)
    {
        error = FT_Common.FT_Err_Invalid_File_Format;
        face.hdmx_table = null;
        face.hdmx_table_size = 0;
        stream.ReleaseFrame();
        return error;
    }

    if (0 != num_records)
        face.hdmx_record_sizes = new Array(num_records);

    for ( nn = 0; nn < num_records; nn++ )
    {
        if ( (p.pos + record_size) > end )
            break;

        face.hdmx_record_sizes[nn] = p.data[p.pos];
        p.pos += record_size;
    }

    face.hdmx_record_count = nn;
    face.hdmx_table_size   = table_size;
    face.hdmx_record_size  = record_size;

    return error;
}

function tt_face_load_loca(face, stream)
{
    var error = FT_Common.FT_Err_Ok;
    var table_len = 0;
    var shift = 0;

    face.glyf_len = face.goto_table(face, FT_Common.TTAG_glyf, stream);
    error = FT_Error;

    if ( error == FT_Common.FT_Err_Table_Missing)
        face.glyf_len = 0;
    else if (error != FT_Common.FT_Err_Ok)
        return error;

    table_len = face.goto_table(face, FT_Common.TTAG_loca, stream);
    error = FT_Error;
    if (error != FT_Common.FT_Err_Ok)
    {
        error = FT_Common.FT_Err_Locations_Missing;
        return error;
    }

    if (face.header.Index_To_Loc_Format != 0)
    {
        shift = 2;
        if (table_len >= 0x40000)
        {
            error = FT_Common.FT_Err_Invalid_Table;
            return error;
        }
        face.num_locations = table_len >>> shift;
    }
    else
    {
        shift = 1;

        if (table_len >= 0x20000)
        {
            error = FT_Common.FT_Err_Invalid_Table;
            return error;
        }
        face.num_locations = table_len >>> shift;
    }

    if (face.num_locations != (face.num_glyphs + 1))
    {
        if (face.num_locations <= face.num_glyphs)
        {
            var new_loca_len = (face.num_glyphs + 1) << shift;

            var pos = stream.pos;
            var dist = 0x7FFFFFFF;

            var entry = 0;
            for (; entry < face.num_tables; entry++)
            {
                var diff = face.dir_tables[entry].Offset - pos;
                if (diff > 0 && diff < dist)
                    dist = diff;
            }

            if (entry == face.num_tables)
            {
                dist = stream.size - pos;
            }

            if (new_loca_len <= dist)
            {
                face.num_locations = face.num_glyphs + 1;
                table_len          = new_loca_len;
            }
        }
    }

    face.glyph_locations = new CPointer();
    error = stream.ExtractFrame(table_len, face.glyph_locations);
    return error;
}
function tt_face_get_location(face, gindex)
{
    var pos1 = 0;
    var pos2 = 0;
    var asize = 0;

    pos1 = pos2 = 0;
    var p = new CPointer();
    p.data = face.glyph_locations.data;
    var pos_s = face.glyph_locations.pos;
    var p_limit = 0;
    if (gindex < face.num_locations)
    {
        if (face.header.Index_To_Loc_Format != 0)
        {
            p.pos = pos_s + gindex * 4;
            p_limit = pos_s + face.num_locations * 4;

            pos1 = FT_NEXT_ULONG(p);
            pos2 = pos1;

            if (p.pos + 4 <= p_limit)
                pos2 = FT_NEXT_ULONG(p);
        }
        else
        {
            p.pos  = pos_s + gindex * 2;
            p_limit = pos_s + face.num_locations * 2;

            pos1 = FT_NEXT_USHORT(p);
            pos2 = pos1;

            if (p.pos + 2 <= p_limit)
                pos2 = FT_NEXT_USHORT(p);

            pos1 <<= 1;
            pos2 <<= 1;
        }
    }

    if (pos1 >= face.glyf_len)
        return {loc:0,size:0};

    if (pos2 >= face.glyf_len)
        pos2 = face.glyf_len;

    if (pos2 >= pos1)
        asize = pos2 - pos1;
    else
        asize = face.glyf_len - pos1;

    return {loc:pos1,size:asize};
}
function tt_face_load_cvt(face, stream)
{
    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if (face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
    {
        var table_len = face.goto_table(face, FT_Common.TTAG_cvt, stream);
        var error = FT_Error;
		FT_Error = 0;

        if (error != 0)
        {
            face.cvt_size = 0;
            face.cvt = null;
            return 0;
        }

        face.cvt_size = table_len / 2;
        face.cvt = CreateIntArray(face.cvt_size);

        error = stream.EnterFrame(table_len);
        if (error != 0)
            return error;

        for (var i = 0; i < face.cvt_size; i++)
            face.cvt[i] = stream.GetShort();
        
        //#ifdef TT_CONFIG_OPTION_GX_VAR_SUPPORT
        if (face.doblend)
            error = tt_face_vary_cvt(face, stream);
        //#endif

        return error;
    }
    //#endif
    return 0;
}
function tt_face_load_fpgm(face, stream)
{
    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if (face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
    {
        /* The font program is optional */
        var table_len = face.goto_table(face, FT_Common.TTAG_fpgm, stream);
        var error = FT_Error;
		FT_Error = 0;
		
        if (error != 0)
        {
            face.font_program = null;
            face.font_program_size = 0;
            error = 0;
            return error;
        }
        else
        {
            face.font_program_size = table_len;
            face.font_program = new CPointer();
            return stream.ExtractFrame(table_len, face.font_program);
        }
    }
    //#endif
    return 0;
}
function tt_face_load_prep(face, stream)
{
    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if (face.driver.library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
    {
        var table_len = face.goto_table(face, FT_Common.TTAG_prep, stream);
        var error = FT_Error;
		FT_Error = 0;
		
        if (error != 0)
        {
            face.cvt_program = null;
            face.cvt_program_size = 0;
            return 0;
        }
        else
        {
            face.cvt_program_size = table_len;
            face.cvt_program = new CPointer();
            return stream.ExtractFrame(table_len, face.cvt_program);
        }
    }
    //#endif
    return 0;
}
function tt_check_single_notdef(face)
{
    var result = false;

    var asize = 0;
    var i = 0;
    var glyph_index = 0;
    var count = 0;

    for( i = 0; i < face.num_locations; i++ )
    {
        asize = tt_face_get_location(face, i).size;
        if ( asize > 0 )
        {
            count += 1;
            if ( count > 1 )
                break;
            glyph_index = i;
        }
    }

    /* Only have a single outline. */
    if (count == 1)
    {
        if (glyph_index == 0)
            result = true;
        else
        {
            /* FIXME: Need to test glyphname == .notdef ? */
            FT_Error = FT_Common.FT_Err_Ok;
            var buffer = g_memory.Alloc(10);
            buffer.pos = 0;

            FT_Get_Glyph_Name(face, glyph_index, buffer, 8);
            var buf = "";
            for (var i = 0; i < 10; i++)
            {
                buf += String.fromCharCode(buffer.data[i]);
            }

            if (FT_Error != FT_Common.FT_Err_Ok && buf[0] == '.' && (0 == _strncmp(buf,".notdef",8)))
                result = true;
        }
    }

    FT_Error = FT_Common.FT_Err_Ok;
    return result;
}

function tt_driver_init(ttdriver)
{
    var _tt_hint_props = ttdriver.library.tt_hint_props;
    if (_tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
    {
        if (!TT_New_Context(ttdriver))
            FT_Common.FT_Err_Could_Not_Find_Context;
    }
    return 0;
}
function tt_driver_done(ttdriver)
{
    var _tt_hint_props = ttdriver.library.tt_hint_props;
    if (_tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
    {
        if (ttdriver.context != null)
        {
            TT_Done_Context(ttdriver.context);
            ttdriver.context = null;
        }
    }
}
function tt_get_interface(driver, tt_interface)
{
    var result = ft_service_list_lookup(FT_TT_SERVICES_GET, tt_interface);
    if (result != null)
        return result;

    if (driver == null)
        return null;

    var sfntd = driver.library.FT_Get_Module("sfnt");
    if (null != sfntd)
    {
        var sfnt = sfntd.clazz.module_interface;
        if (null != sfnt)
            return sfnt.get_interface(driver, tt_interface);
    }
    return null;
}
function tt_face_init(stream, face, face_index)
{
    var error = FT_Common.FT_Err_Ok;
    var library = face.driver.library;
    var sfnt = library.FT_Get_Module_Interface("sfnt");

    error = stream.Seek(0);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    error = sfnt.init_face(stream, face, face_index);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    if (face.format_tag != 0x00010000 && face.format_tag != 0x00020000 && face.format_tag != FT_Common.TTAG_true)
    {
        error = FT_Common.FT_Err_Unknown_File_Format;
        return error;
    }

    if (library.tt_hint_props.TT_USE_BYTECODE_INTERPRETER || true)
        face.face_flags |= FT_Common.FT_FACE_FLAG_HINTER;

    if ( face_index < 0 )
        return FT_Common.FT_Err_Ok;

    error = sfnt.load_face(stream, face, face_index);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    if (tt_check_trickyness(face) === true)
        face.face_flags |= FT_Common.FT_FACE_FLAG_TRICKY;

    error = tt_face_load_hdmx(face, stream);
    if (error != FT_Common.FT_Err_Ok)
        return error;

    if ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        //#ifdef FT_CONFIG_OPTION_INCREMENTAL
        if (null == face.internal.incremental_interface)
            error = tt_face_load_loca(face, stream);
        if (error == FT_Common.FT_Err_Ok)
            error = tt_face_load_cvt(face, stream);
        if (error == FT_Common.FT_Err_Ok)
            error = tt_face_load_fpgm(face, stream);
        if (error == FT_Common.FT_Err_Ok)
            error = tt_face_load_prep(face, stream);

        /* Check the scalable flag based on `loca'. */
        if ((null == face.internal.incremental_interface) && (0 != face.num_fixed_sizes) && (face.glyph_locations != null) &&
            tt_check_single_notdef(face))
        {
            face.face_flags &= ~FT_Common.FT_FACE_FLAG_SCALABLE;
        }
        //#endif
    }

    //#if defined( TT_CONFIG_OPTION_UNPATENTED_HINTING )
    // TODO:
    //#endif

    TT_Init_Glyph_Loading(face);
    return error;
}
function tt_face_done(face)
{
}
function tt_size_init()
{
    var size  = new TT_SizeRec();

    //#ifdef TT_USE_BYTECODE_INTERPRETER
    size.bytecode_ready = 0;
    size.cvt_ready      = 0;
    //#endif

    size.ttmetrics.valid = 0;
    size.strike_index = 0xFFFFFFFF;

    return size;
}
function tt_size_done(size)
{
    //#ifdef TT_USE_BYTECODE_INTERPRETER
    if (size.bytecode_ready)
        tt_size_done_bytecode(size);
    //#endif
    size.ttmetrics.valid = 0;
}
function tt_slot_init(slot)
{
    return FT_GlyphLoader_CreateExtra(slot.internal.loader);
}
function Load_Glyph(slot, size, glyph_index, load_flags)
{
    var face = slot.face;
    var error = 0;

    if (!slot)
        return FT_Common.FT_Err_Invalid_Slot_Handle;

    if (!size)
        return FT_Common.FT_Err_Invalid_Size_Handle;

    if (!face)
        return FT_Common.FT_Err_Invalid_Argument;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (glyph_index >= face.num_glyphs && (null == face.internal.incremental_interface))
        return FT_Common.FT_Err_Invalid_Argument;

    if ((load_flags & FT_Common.FT_LOAD_NO_HINTING) != 0)
    {
        if ((face.face_flags & FT_Common.FT_FACE_FLAG_TRICKY) != 0)
            load_flags &= ~FT_Common.FT_LOAD_NO_HINTING;

        if ((load_flags & FT_Common.FT_LOAD_NO_AUTOHINT) != 0)
            load_flags |= FT_Common.FT_LOAD_NO_HINTING;
    }

    if ((load_flags & (FT_Common.FT_LOAD_NO_RECURSE | FT_Common.FT_LOAD_NO_SCALE)) != 0)
    {
        load_flags |= (FT_Common.FT_LOAD_NO_BITMAP | FT_Common.FT_LOAD_NO_SCALE);

        if ((face.face_flags & FT_Common.FT_FACE_FLAG_TRICKY) == 0)
            load_flags |= FT_Common.FT_LOAD_NO_HINTING;
    }

    error = TT_Load_Glyph(size, slot, glyph_index, load_flags);
    return error;
}
function tt_get_kerning(face, left_glyph, right_glyph, kerning)
{
    kerning.x = 0;
    kerning.y = 0;

    if (face.sfnt)
        kerning.x = face.sfnt.get_kerning(face, left_glyph, right_glyph);

    return 0;
}
function tt_get_advances(face, start, count, flags, advances)
{
    /* XXX: TODO: check for sbits */
    if ((face.face_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0)
    {
        for (var nn = 0; nn < count; nn++)
        {
            /* since we don't need `tsb', we use zero for `yMax' parameter */
            var res = TT_Get_VMetrics(face, start + nn, 0);
            advances[nn] = res.ah;
        }
    }
    else
    {
        for (var nn = 0; nn < count; nn++)
        {
            var res = TT_Get_HMetrics(face, start);
            advances[nn] = res.aw;
        }
    }

    return 0;
}
function tt_size_request(size, req)
{
    var error = 0;

    //#ifdef TT_CONFIG_OPTION_EMBEDDED_BITMAPS
    if ((size.face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES) != 0)
    {
        var sfnt = size.face.sfnt;
        var strike_index = sfnt.set_sbit_strike(size.face, req);

        error = FT_Error;
        FT_Error = 0;

        if (error != 0)
            size.strike_index = 0xFFFFFFFF;
    else
        return this.select_size(size, strike_index);
    }
    //#endif

    FT_Request_Metrics(size.face, req);

    if ((size.face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        error = tt_size_reset(size);

        var s = size._metrics;
        var d = size.metrics;

        d.x_ppem = s.x_ppem;
        d.y_ppem = s.y_ppem;

        d.x_scale = s.x_scale;
        d.y_scale = s.y_scale;

        d.ascender = s.ascender;
        d.descender = s.descender;
        d.height = s.height;
        d.max_advance = s.max_advance;
    }

    return error;
}
function tt_size_select(size, strike_index)
{
    var ttface = size.face;
    var error = 0;
    size.strike_index = strike_index;

    if ((ttface.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        FT_Select_Metrics(ttface, strike_index);
        tt_size_reset(size);
    }
    else
    {
        var sfnt = ttface.sfnt;
        var metrics = size.metrics;

        error = sfnt.load_strike_metrics(ttface, strike_index, metrics);
        if (error != 0)
            size.strike_index = 0xFFFFFFFF;
    }
    return error;
}

function tt_size_reset(size)
{
    size.ttmetrics.valid = 0;
    var face = size.face;

    var d = size._metrics;
    var s = size.metrics;

    d.x_ppem = s.x_ppem;
    d.y_ppem = s.y_ppem;

    d.x_scale = s.x_scale;
    d.y_scale = s.y_scale;

    d.ascender = s.ascender;
    d.descender = s.descender;
    d.height = s.height;
    d.max_advance = s.max_advance;

    if (d.x_ppem < 1 || d.y_ppem < 1)
        return FT_Common.FT_Err_Invalid_PPem;

    if (face.header.Flags & 8)
    {
        d.x_scale = FT_DivFix(d.x_ppem << 6, face.units_per_EM);
        d.y_scale = FT_DivFix(d.y_ppem << 6, face.units_per_EM);

        d.ascender = FT_PIX_ROUND(FT_MulFix(face.ascender, d.y_scale));
        d.descender = FT_PIX_ROUND(FT_MulFix(face.descender, d.y_scale));
        d.height = FT_PIX_ROUND(FT_MulFix(face.height, d.y_scale));
        d.max_advance = FT_PIX_ROUND(FT_MulFix(face.max_advance_width, d.x_scale));
    }

    var tt = size.ttmetrics;
    /* compute new transformation */
    if (d.x_ppem >= d.y_ppem)
    {
        tt.scale   = d.x_scale;
        tt.ppem    = d.x_ppem;
        tt.x_ratio = 0x10000;
        tt.y_ratio = FT_MulDiv(d.y_ppem, 0x10000, d.x_ppem);
    }
    else
    {
        tt.scale   = d.y_scale;
        tt.ppem    = d.y_ppem;
        tt.x_ratio = FT_MulDiv(d.x_ppem, 0x10000, d.y_ppem);
        tt.y_ratio = 0x10000;
    }

    //#ifdef TT_USE_BYTECODE_INTERPRETER
    // TODO:
    //#endif

    size.ttmetrics.valid = 1;
    return 0;
}

function TT_Driver_Class()
{
    this.flags = 0x101;
    this.name = "truetype";
    this.version = 0x10000;
    this.requires = 0x20000;

    this.module_interface = null;

    this.init = tt_driver_init;
    this.done = tt_driver_done;
    this.get_interface = tt_get_interface;

    this.face_object_size = 0;
    this.size_object_size = 0;
    this.slot_object_size = 0;

    this.init_face = tt_face_init;
    this.done_face = tt_face_done;

    this.init_size = tt_size_init;
    this.done_size = tt_size_done;

    this.init_slot = tt_slot_init;
    this.done_slot = null;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_char_sizes = ft_stub_set_char_sizes;
    this.set_pixel_sizes = ft_stub_set_pixel_sizes;
    //#endif

    this.load_glyph = Load_Glyph;

    this.get_kerning = tt_get_kerning;
    this.attach_file = null;
    this.get_advances = tt_get_advances;

    this.request_size = tt_size_request;
    this.select_size = tt_size_select;
}

function tt_sfnt_id_rec(c,l)
{
    this.CheckSum = c;
    this.Length = l;
}

function TT_Driver()
{
    this.clazz = null;      // FT_Module_Class
    this.library = null;    // FT_Library
    this.memory = null;     // FT_Memory
    this.generic = null;    // FT_Generic

    this.clazz = new TT_Driver_Class();
    this.faces_list = [];
    this.extensions = null;
    this.glyph_loader = null;

    this.context = null;
    this.zone = new TT_GlyphZoneRec();
    this.extension_component = null;

    this.open_face = function(stream, face_index)
    {
        if (null == this.sfnt_id)
        {
            this.sfnt_id = new Array(13);
            this.sfnt_id[0] = new Array(3);
            this.sfnt_id[0][0] = new tt_sfnt_id_rec(0x05bcf058, 0x000002e4);
            this.sfnt_id[0][1] = new tt_sfnt_id_rec(0x28233bf1, 0x000087c4);
            this.sfnt_id[0][2] = new tt_sfnt_id_rec(0xa344a1ea, 0x000001e1);

            this.sfnt_id[1] = new Array(3);
            this.sfnt_id[1][0] = new tt_sfnt_id_rec(0x05bcf058, 0x000002e4);
            this.sfnt_id[1][1] = new tt_sfnt_id_rec(0x28233bf1, 0x000087c4);
            this.sfnt_id[1][2] = new tt_sfnt_id_rec(0xa344a1eb, 0x000001e1);

            this.sfnt_id[2] = new Array(3);
            this.sfnt_id[2][0] = new tt_sfnt_id_rec(0x11e5ead4, 0x00000350);
            this.sfnt_id[2][1] = new tt_sfnt_id_rec(0x5a30ca3b, 0x00009063);
            this.sfnt_id[2][2] = new tt_sfnt_id_rec(0x13a42602, 0x0000007e);

            this.sfnt_id[3] = new Array(3);
            this.sfnt_id[3][0] = new tt_sfnt_id_rec(0xfffbfffc, 0x00000008);
            this.sfnt_id[3][1] = new tt_sfnt_id_rec(0x9c9e48b8, 0x0000bea2);
            this.sfnt_id[3][2] = new tt_sfnt_id_rec(0x70020112, 0x00000008);

            this.sfnt_id[4] = new Array(3);
            this.sfnt_id[4][0] = new tt_sfnt_id_rec(0xfffbfffc, 0x00000008);
            this.sfnt_id[4][1] = new tt_sfnt_id_rec(0x0a5a0483, 0x00017c39);
            this.sfnt_id[4][2] = new tt_sfnt_id_rec(0x70020112, 0x00000008);

            this.sfnt_id[5] = new Array(3);
            this.sfnt_id[5][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[5][1] = new tt_sfnt_id_rec(0x40c92555, 0x000000e5);
            this.sfnt_id[5][2] = new tt_sfnt_id_rec(0xa39b58e3, 0x0000117c);

            this.sfnt_id[6] = new Array(3);
            this.sfnt_id[6][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[6][1] = new tt_sfnt_id_rec(0x33c41652, 0x000000e5);
            this.sfnt_id[6][2] = new tt_sfnt_id_rec(0x26d6c52a, 0x00000f6a);

            this.sfnt_id[7] = new Array(3);
            this.sfnt_id[7][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[7][1] = new tt_sfnt_id_rec(0x6db1651d, 0x0000019d);
            this.sfnt_id[7][2] = new tt_sfnt_id_rec(0x6c6e4b03, 0x00002492);

            this.sfnt_id[8] = new Array(3);
            this.sfnt_id[8][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[8][1] = new tt_sfnt_id_rec(0x40c92555, 0x000000e5);
            this.sfnt_id[8][2] = new tt_sfnt_id_rec(0xde51fad0, 0x0000117c);

            this.sfnt_id[9] = new Array(3);
            this.sfnt_id[9][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[9][1] = new tt_sfnt_id_rec(0x85e47664, 0x000000e5);
            this.sfnt_id[9][2] = new tt_sfnt_id_rec(0xa6c62831, 0x00001caa);

            this.sfnt_id[10] = new Array(3);
            this.sfnt_id[10][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[10][1] = new tt_sfnt_id_rec(0x2d891cfd, 0x0000019d);
            this.sfnt_id[10][2] = new tt_sfnt_id_rec(0xa0604633, 0x00001de8);

            this.sfnt_id[11] = new Array(3);
            this.sfnt_id[11][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[11][1] = new tt_sfnt_id_rec(0x40aa774c, 0x000001cb);
            this.sfnt_id[11][2] = new tt_sfnt_id_rec(0x9b5caa96, 0x00001f9a);

            this.sfnt_id[12] = new Array(3);
            this.sfnt_id[12][0] = new tt_sfnt_id_rec(0x00000000, 0x00000000);
            this.sfnt_id[12][1] = new tt_sfnt_id_rec(0x0d3de9cb, 0x00000141);
            this.sfnt_id[12][2] = new tt_sfnt_id_rec(0xd4127766, 0x00002280);
        }

        FT_Error = 0;
        var face = new TT_Face();
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

function create_tt_driver(library)
{
    var driver = new TT_Driver();
    driver.library = library;
    driver.memory = library.Memory;

    driver.clazz = new TT_Driver_Class();
    return driver;
}