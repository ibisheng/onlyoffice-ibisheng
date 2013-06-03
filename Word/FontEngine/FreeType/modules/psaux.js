/******************************************************************************/
// t1tables
/******************************************************************************/
function _isdigit(x)
{
    if ((x >= FT_Common.SYMBOL_CONST_0) && (x <= FT_Common.SYMBOL_CONST_9))
        return 1;
    return 0;
}
function _isxdigit(x)
{
    if (((x >= FT_Common.SYMBOL_CONST_0) && (x <= FT_Common.SYMBOL_CONST_9)) ||
        ((x >= FT_Common.SYMBOL_CONST_a) && (x <= FT_Common.SYMBOL_CONST_f)) ||
        ((x >= FT_Common.SYMBOL_CONST_A) && (x <= FT_Common.SYMBOL_CONST_F)))
        return 1;
    return 0;
}

function PS_FontInfoRec()
{
    this.version        = "";
    this.notice         = "";
    this.full_name      = "";
    this.family_name    = "";
    this.weight         = "";
    this.italic_angle   = 0;
    this.is_fixed_pitch = 0;
    this.underline_position     = 0;
    this.underline_thickness    = 0;

    this.CreateDublicate = function()
    {
        var _ret = new PS_FontInfoRec();

        _ret.version = this.version;
        _ret.notice = this.notice;
        _ret.full_name = this.full_name;
        _ret.family_name = this.family_name;
        _ret.weight = this.weight;
        _ret.italic_angle = this.italic_angle;
        _ret.is_fixed_pitch = this.is_fixed_pitch;
        _ret.underline_position = this.underline_position;
        _ret.underline_thickness = this.underline_thickness;

        return _ret;
    }
}
function PS_PrivateRec()
{
    this.unique_id = 0;
    this.lenIV = 0;

    this.num_blue_values = 0;
    this.num_other_blues = 0;
    this.num_family_blues = 0;
    this.num_family_other_blues = 0;

    this.blue_values = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.other_blues = [0,0,0,0,0,0,0,0,0,0];

    this.family_blues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.family_other_blues = [0,0,0,0,0,0,0,0,0,0];

    this.blue_scale = 0;
    this.blue_shift = 0;
    this.blue_fuzz = 0;

    this.standard_width = [0];
    this.standard_height = [0];

    this.num_snap_widths = 0;
    this.num_snap_heights = 0;
    this.force_bold = 0;
    this.round_stem_up = 0;

    this.snap_widths = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.snap_heights = [0,0,0,0,0,0,0,0,0,0,0,0,0];

    this.expansion_factor = 0;

    this.language_group = 0;
    this.password = 0;

    this.min_feature = [0,0];

    this.clear = function()
    {
        this.unique_id = 0;
        this.lenIV = 0;

        this.num_blue_values = 0;
        this.num_other_blues = 0;
        this.num_family_blues = 0;
        this.num_family_other_blues = 0;

        for (var i = 0; i < 14; i++)
            this.blue_values[i] = 0;

        for (var i = 0; i < 10; i++)
            this.other_blues[i] = 0;

        for (var i = 0; i < 14; i++)
            this.family_blues[i] = 0;

        for (var i = 0; i < 10; i++)
            this.family_other_blues[i] = 0;

        this.blue_scale = 0;
        this.blue_shift = 0;
        this.blue_fuzz = 0;

        this.standard_width[0] = 0;
        this.standard_height[0] = 0;

        this.num_snap_widths = 0;
        this.num_snap_heights = 0;
        this.force_bold = 0;
        this.round_stem_up = 0;

        for (var i = 0; i < 13; i++)
            this.snap_widths[i] = 0;
        for (var i = 0; i < 13; i++)
            this.snap_heights[i] = 0;

        this.expansion_factor = 0;

        this.language_group = 0;
        this.password = 0;

        this.min_feature[0] = 0;
        this.min_feature[1] = 0;
    }
}

function PS_DesignMapRec()
{
    this.num_points = 0;
    this.design_points = null;
    this.blend_points = null;
}

function PS_BlendRec()
{
    this.num_designs = 0;
    this.num_axis = 0;

    this.axis_names = CreateNullArray(FT_Common.T1_MAX_MM_AXIS);
    this.design_pos = CreateNullArray(FT_Common.T1_MAX_MM_DESIGNS);
    this.design_map = new Array(FT_Common.T1_MAX_MM_AXIS);
    for (var i = 0; i < FT_Common.T1_MAX_MM_AXIS; i++)
        this.design_map[i] = new PS_DesignMapRec();

    this.weight_vector = null;
    this.default_weight_vector = 0;

    this.font_infos = CreateNullArray(FT_Common.T1_MAX_MM_DESIGNS + 1);
    this.privates = CreateNullArray(FT_Common.T1_MAX_MM_DESIGNS + 1);

    this.blend_bitflags = 0;

    this.bboxes = CreateNullArray(FT_Common.T1_MAX_MM_DESIGNS + 1);

    this.default_design_vector = CreateUIntArray(FT_Common.T1_MAX_MM_DESIGNS);
    this.num_default_design_vector = 0;
}

function CID_FaceDictRec()
{
    this.private_dict = new PS_PrivateRec();

    this.len_buildchar = 0;
    this.forcebold_threshold = 0;
    this.stroke_width = 0;
    this.expansion_factor = 0;

    this.paint_type = 0;
    this.font_type = 0;
    this.font_matrix = new FT_Matrix();
    this.font_offset = new FT_Vector();

    this.num_subrs = 0;
    this.subrmap_offset = 0;
    this.sd_bytes = 0;
}

function CID_FaceInfoRec()
{
    this.cid_font_name = "";
    this.cid_version = 0;
    this.cid_font_type = 0;

    this.registry = "";
    this.ordering = "";
    this.supplement = 0;

    this.font_info = new PS_FontInfoRec();
    this.font_bbox = new FT_BBox();
    this.uid_base = 0;

    this.num_xuid = 0;
    this.xuid = CreateUIntArray(16);

    this.cidmap_offset = 0;
    this.fd_bytes = 0;
    this.gd_bytes = 0;
    this.cid_count = 0;

    this.num_dicts = 0;
    this.font_dicts = null;

    this.data_offset = 0;
}

function FT_Has_PS_Glyph_Names(face)
{
    var result = 0;
    if (face != null)
    {
        var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_INFO);

        if (service && service.ps_has_glyph_names)
            result = service.ps_has_glyph_names(face);
    }
    return result;
}
function FT_Get_PS_Font_Info(face, afont_info)
{
    var error = FT_Common.FT_Err_Invalid_Argument;
    if (face != null)
    {
        var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_INFO);

        if (service && service.ps_get_font_info)
            error = service.ps_get_font_info(face, afont_info);
    }
    return error;
}
function FT_Get_PS_Font_Private(face, afont_private)
{
    var error = FT_Common.FT_Err_Invalid_Argument;
    if (face != null)
    {
        var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_INFO);

        if (service && service.ps_get_font_private)
            error = service.ps_get_font_private(face, afont_private);
    }
    return error;
}
function FT_Get_PS_Font_Value(face, key, idx, value, value_len)
{
    var result  = 0;
    if (face != null)
    {
        var service = FT_FACE_FIND_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_INFO);

        if (service && service.ps_get_font_value)
            result = service.ps_get_font_value(face, key, idx, value, value_len);
    }
    return result;
}
/******************************************************************************/
// t1types
/******************************************************************************/
function T1_EncodingRec()
{
    this.num_chars  = 0;
    this.code_first = 0;
    this.code_last  = 0;

    this.char_index = null;
    this.char_name  = null;
}
function PS_FontExtraRec()
{
    this.fs_type = 0;

    this.CreateDublicate = function()
    {
        var _ret = new PS_FontExtraRec();
        _ret.fs_type = this.fs_type;
        return _ret;
    }
}
function T1_FontRec()
{
    this.font_info      = new PS_FontInfoRec();
    this.font_extra     = new PS_FontExtraRec();
    this.private_dict   = new PS_PrivateRec();
    this.font_name      = "";

    this.encoding_type  = 0;
    this.encoding       = new T1_EncodingRec();

    this.subrs_block        = null;
    this.charstrings_block  = null;
    this.glyph_names_block  = null;

    this.num_subrs = 0;
    this.subrs = null;
    this.subrs_len = null;

    this.num_glyphs = 0;
    this.glyph_names = null;
    this.charstrings = null;
    this.charstrings_len = null;

    this.paint_type = 0;
    this.font_type = 0;
    this.font_matrix = new FT_Matrix();
    this.font_offset = new FT_Vector();
    this.font_bbox = new FT_BBox();
    this.font_id = 0;

    this.stroke_width = 0;
}
function CID_SubrsRec()
{
    this.num_subrs = 0;
    this.code = null;
}

function AFM_TrackKernRec()
{
    this.degree     = 0;
    this.min_ptsize = 0;
    this.min_kern   = 0;
    this.max_ptsize = 0;
    this.max_kern   = 0;
}
function AFM_KernPairRec()
{
    this.index1 = 0;
    this.index2 = 0;
    this.x = 0;
    this.y = 0;
}
function AFM_FontInfoRec()
{
    this.IsCIDFont = 0;
    this.FontBBox = new FT_BBox();
    this.Ascender = 0;
    this.Descender = 0;
    this.TrackKerns = null;
    this.NumTrackKern = 0;
    this.KernPairs = null;
    this.NumKernPair = 0;
}



function T1_Face()
{
    this.num_faces = 0;
    this.face_index = 0;

    this.face_flags = 0;
    this.style_flags = 0;

    this.num_glyphs = 0;

    this.family_name = "";
    this.style_name = "";

    this.num_fixed_sizes = 0;
    this.available_sizes = new Array();

    this.num_charmaps = 0;
    this.charmaps = new Array();

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

    this.sizes_list = new Array();

    this.autohint = new Array();
    this.extensions = null;

    this.internal = null;
    /*@private end */

    this.type1 = new T1_FontRec();
    this.psnames = null;
    this.psaux = null;
    this.afm_data = null;

    this.charmaprecs = new Array(2);
    this.charmaprecs[0] = new FT_CharMapRec();
    this.charmaprecs[1] = new FT_CharMapRec();

    this.charmaps = new Array(2);
    this.charmaps[0] = null;
    this.charmaps[1] = null;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.unicode_map = null;
    //#endif

    /* support for Multiple Masters fonts */
    this.blend = null;

    /* undocumented, optional: indices of subroutines that express      */
    /* the NormalizeDesignVector and the ConvertDesignVector procedure, */
    /* respectively, as Type 2 charstrings; -1 if keywords not present  */
    this.ndv_idx = 0;
    this.cdv_idx = 0;

    /* undocumented, optional: has the same meaning as len_buildchar */
    /* for Type 2 fonts; manipulated by othersubrs 19, 24, and 25    */
    this.len_buildchar = 0;
    this.buildchar = null;

    /* since version 2.1 - interface to PostScript hinter */
    this.pshinter = null;
}

function CID_Face()
{
    this.num_faces = 0;
    this.face_index = 0;

    this.face_flags = 0;
    this.style_flags = 0;

    this.num_glyphs = 0;

    this.family_name = "";
    this.style_name = "";

    this.num_fixed_sizes = 0;
    this.available_sizes = new Array();

    this.num_charmaps = 0;
    this.charmaps = new Array();

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

    this.sizes_list = new Array();

    this.autohint = new Array();
    this.extensions = null;

    this.internal = null;
    /*@private end */

    this.psnames = null;
    this.psaux = null;
    this.cid = new CID_FaceInfoRec();
    this.font_extra = new PS_FontExtraRec();

    this.subrs = null;

    /* since version 2.1 - interface to PostScript hinter */
    this.pshinter = null;

    this.binary_data = new CPointer(); /* used if hex data has been converted */
    this.cid_stream = null;
}

/******************************************************************************/
function IS_PS_NEWLINE(ch)
{
    if (ch == FT_Common.SYMBOL_CONST_SR || ch == FT_Common.SYMBOL_CONST_SN)
        return true;
    return false;
}
function IS_PS_SPACE(ch)
{
    switch (ch)
    {
        case FT_Common.SYMBOL_CONST_SPACE:
        case FT_Common.SYMBOL_CONST_SR:
        case FT_Common.SYMBOL_CONST_SN:
        case FT_Common.SYMBOL_CONST_ST:
        case FT_Common.SYMBOL_CONST_SF:
        case FT_Common.SYMBOL_CONST_S0:
            return true;
    }
    return false;
}
function IS_PS_SPECIAL(ch)
{
    switch (ch)
    {
        case FT_Common.SYMBOL_CONST_BS:
        case FT_Common.SYMBOL_CONST_LS1:
        case FT_Common.SYMBOL_CONST_LS2:
        case FT_Common.SYMBOL_CONST_LS3:
        case FT_Common.SYMBOL_CONST_RS1:
        case FT_Common.SYMBOL_CONST_RS2:
        case FT_Common.SYMBOL_CONST_RS3:
        case FT_Common.SYMBOL_CONST_MATH_1:
        case FT_Common.SYMBOL_CONST_MATH_2:
        case FT_Common.SYMBOL_CONST_MATH_3:
            return true;
    }
    return false;
}
function IS_PS_DELIM(ch)
{
    switch (ch)
    {
        case FT_Common.SYMBOL_CONST_SPACE:
        case FT_Common.SYMBOL_CONST_SR:
        case FT_Common.SYMBOL_CONST_SN:
        case FT_Common.SYMBOL_CONST_ST:
        case FT_Common.SYMBOL_CONST_SF:
        case FT_Common.SYMBOL_CONST_S0:
        case FT_Common.SYMBOL_CONST_BS:
        case FT_Common.SYMBOL_CONST_LS1:
        case FT_Common.SYMBOL_CONST_LS2:
        case FT_Common.SYMBOL_CONST_LS3:
        case FT_Common.SYMBOL_CONST_RS1:
        case FT_Common.SYMBOL_CONST_RS2:
        case FT_Common.SYMBOL_CONST_RS3:
        case FT_Common.SYMBOL_CONST_MATH_1:
        case FT_Common.SYMBOL_CONST_MATH_2:
        case FT_Common.SYMBOL_CONST_MATH_3:
            return true;
    }
    return false;
}
function IS_PS_DIGIT(ch)
{
    return (ch >= FT_Common.SYMBOL_CONST_0 && ch <= FT_Common.SYMBOL_CONST_9) ? true : false;
}
function IS_PS_XDIGIT(ch)
{
    return (IS_PS_DIGIT(ch) || (ch >= FT_Common.SYMBOL_CONST_A && ch <= FT_Common.SYMBOL_CONST_F)
        || (ch >= FT_Common.SYMBOL_CONST_a && ch <= FT_Common.SYMBOL_CONST_f)) ? true : false;
}
function IS_PS_BASE85(ch)
{
    return (ch >= FT_Common.SYMBOL_CONST_VOSCL && ch <= FT_Common.SYMBOL_CONST_u) ? true : false;
}

function IS_PS_TOKEN(cur, limit, token, len)
{
    if (cur.data[cur.pos] == token.charCodeAt(0) && (((cur.pos + len) == limit) || ((cur.pos + len) < limit && IS_PS_DELIM(cur.data[cur.pos + len - 1]))) && _strncmp_data(cur, token, len - 1) == 0)
        return 1;
    return 0;
}

/******************************************************************************/
// psconv
/******************************************************************************/
var ft_char_table =
[
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1,
    -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1,
    -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1
];

function PS_Conv_Strtol(cursor, limit, base)
{
    var _data = cursor.data;
    var pos = cursor.pos;

    var num = 0;
    var sign = 0;

    if (pos == limit || base < 2 || base > 36)
        return 0;

    if (_data[pos] == FT_Common.SYMBOL_CONST_MATH_MINUS || _data[pos] == FT_Common.SYMBOL_CONST_MATH_PLUS)
    {
        sign = (_data[pos] == FT_Common.SYMBOL_CONST_MATH_MINUS) ? 1 : 0;

        pos++;
        if (pos == limit)
            return 0;
    }

    for (; pos < limit; pos++)
    {
        if (IS_PS_SPACE(_data[pos]) || _data[pos] >= 0x80)
            break;

        var c = ft_char_table[_data[pos] & 0x7f];

        if (c < 0 || c >= base)
            break;

        num = num * base + c;
    }

    if (sign == 1)
        num = -num;

    cursor.pos = pos;
    return num;
}
function PS_Conv_ToInt(cursor, limit)
{
    var num = PS_Conv_Strtol(cursor, limit, 10);
    var data = cursor.data;
    var pos = cursor.pos;

    if (pos < limit && data[pos] == FT_Common.SYMBOL_CONST_SHARP)
    {
        cursor.pos = pos + 1;
        return PS_Conv_Strtol(cursor, limit, num);
    }
    return num;
}
function PS_Conv_ToFixed(cursor, limit, power_ten)
{
    var p = dublicate_pointer(cursor);
    var integral;
    var decimal = 0, divider = 1;
    var sign = 0;

    if (p.pos == limit)
        return 0;

    var _data = p.data;
    if (_data[p.pos] == FT_Common.SYMBOL_CONST_MATH_MINUS || _data[p.pos] == FT_Common.SYMBOL_CONST_MATH_PLUS)
    {
        sign = (_data[p.pos] == FT_Common.SYMBOL_CONST_MATH_MINUS) ? 1 : 0;

        p.pos++;
        if (p.pos == limit)
            return 0;
    }

    if (_data[p.pos] != FT_Common.SYMBOL_CONST_POINT)
        integral = PS_Conv_ToInt(p, limit) << 16;
    else
        integral = 0;

    /* read the decimal part */
    if (p.pos < limit && _data[p.pos] == FT_Common.SYMBOL_CONST_POINT)
    {
        p.pos++;
        for (; p.pos < limit; p.pos++)
        {
            if (IS_PS_SPACE(_data[p.pos]) || _data[p.pos] >= 0x80)
                break;

            var c = ft_char_table[_data[p.pos] & 0x7f];

            if (c < 0 || c >= 10)
                break;

            if (!integral && power_ten > 0)
            {
                power_ten--;
                decimal = decimal * 10 + c;
            }
            else
            {
                if (divider < 10000000)
                {
                    decimal = decimal * 10 + c;
                    divider *= 10;
                }
            }
        }
    }

    /* read exponent, if any */
    if (p.pos + 1 < limit && (_data[p.pos] == FT_Common.SYMBOL_CONST_e || _data[p.pos] == FT_Common.SYMBOL_CONST_E))
    {
        p.pos++;
        power_ten += PS_Conv_ToInt(p, limit);
    }

    while (power_ten > 0)
    {
        integral *= 10;
        decimal  *= 10;
        power_ten--;
    }

    while (power_ten < 0)
    {
        integral /= 10;
        divider  *= 10;
        power_ten++;
    }

    if (decimal)
        integral += FT_DivFix(decimal, divider);

    if (sign)
        integral = -integral;

    cursor.pos = p.pos;

    return integral;
}

function PS_Conv_ASCIIHexDecode(cursor, limit, buffer, n)
{
    var r = 0;
    var w = buffer.pos;
    var pad = 0x01;
    
    n *= 2;

    var p  = dublicate_pointer(cursor);
    if (n > (limit - p.pos))
        n = (limit - p.pos);

    /* we try to process two nibbles at a time to be as fast as possible */
    var _data = p.data;
    for ( ; r < n; r++)
    {
        var c = _data[p.pos + r];

        if (IS_PS_SPACE(c))
            continue;

        if (c >= 0x80)
            break;

        c = ft_char_table[c & 0x7F];
        var _c = (c >= 0) ? c : c + 256;
        if (c >= 16)
            break;

        pad = (pad << 4) | c;
        if (pad & 0x100)
        {
            buffer.data[w++] = pad & 0xFF;
            pad = 0x01;
        }
    }

    if (pad != 0x01)
        buffer[w++] = ((pad << 4) & 0xFF);

    cursor.pos = p.pos + r;
    return w;
}

function PS_Conv_EexecDecode(cursor, limit, buffer, n, seed)
{
    var r;
    var s = seed;

    var _sd = cursor.data;
    var _sp = cursor.pos;

    if (n > (limit - _sp))
        n = (limit - _sp);

    var _dd = buffer.data;
    var _dp = buffer.pos;

    var v = 0;
    var b = 0;

    for (r = 0; r < n; r++, _sp++, _dp++)
    {
        v = _sd[_sp];
        b = (v ^ (s >> 8));

        s = ((v + s)*52845 + 22719) & 0xFFFF;
        _dd[_dp] = b & 0xFF;
    }

    cursor.pos = _sp;
    return { r : r, seed : s };
}
/******************************************************************************/
// afmparse
/******************************************************************************/
function AFM_ValueRec()
{
    this.type = 0;
    this.u;
}
function AFM_StreamRec()
{
    this.base = null;
    this.cursor = 0;
    this.limit = 0;

    this.status = 0;
}

function AFM_IS_NEWLINE(ch)
{
    if (ch == FT_Common.SYMBOL_CONST_SR || ch == FT_Common.SYMBOL_CONST_SN)
        return true;
    return false;
}
function AFM_IS_EOF(ch)
{
    if (ch == -1  || ch == 0x1A)
        return true;
    return false;
}
function AFM_IS_SPACE(ch)
{
    if (ch == FT_Common.SYMBOL_CONST_SPACE  || ch == FT_Common.SYMBOL_CONST_ST)
        return true;
    return false;
}
function AFM_IS_SEP(ch)
{
    return (ch == FT_Common.SYMBOL_CONST_SERP) ? true : false;
}
function AFM_GETC(stream)
{
    return (stream.cursor < stream.limit) ? stream.base[stream.cursor++] : -1;
}

function afm_stream_skip_spaces(stream)
{
    var ch = 0;

    if (stream.status >= FT_Common.AFM_STREAM_STATUS_EOC)
        return FT_Common.SYMBOL_CONST_SERP;

    while (true)
    {
        ch = AFM_GETC();
        if (!AFM_IS_SPACE(ch))
            break;
    }

    if (AFM_IS_NEWLINE(ch))
        stream.status = FT_Common.AFM_STREAM_STATUS_EOL;
    else if (AFM_IS_SEP(ch))
        stream.status = FT_Common.AFM_STREAM_STATUS_EOC;
    else if (AFM_IS_EOF(ch))
        stream.status = FT_Common.AFM_STREAM_STATUS_EOF;

    return ch;
}
function afm_stream_read_one(stream)
{
    afm_stream_skip_spaces( stream );
    if (stream.status >= FT_Common.AFM_STREAM_STATUS_EOC)
        return null;

    var str = new CPointer();
    str.data = stream.base;
    str.pos = stream.cursor - 1;
    var ch;

    while ( 1 )
    {
        ch = AFM_GETC();
        if (AFM_IS_SPACE(ch))
            break;
        else if (AFM_IS_NEWLINE(ch))
        {
            stream.status = FT_Common.AFM_STREAM_STATUS_EOL;
            break;
        }
        else if (AFM_IS_SEP(ch))
        {
            stream.status = FT_Common.AFM_STREAM_STATUS_EOC;
            break;
        }
        else if (AFM_IS_EOF(ch))
        {
            stream.status = FT_Common.AFM_STREAM_STATUS_EOF;
            break;
        }
    }

    return str;
}
function afm_stream_read_string(stream)
{
    afm_stream_skip_spaces(stream);
    if (stream.status >= FT_Common.AFM_STREAM_STATUS_EOL)
        return null;

    var str = new CPointer();
    str.data = stream.base;
    str.pos = stream.cursor - 1;
    var ch;

    /* scan to eol */
    while ( 1 )
    {
        ch = AFM_GETC();
        if (AFM_IS_NEWLINE(ch))
        {
            stream.status = FT_Common.AFM_STREAM_STATUS_EOL;
            break;
        }
        else if (AFM_IS_EOF(ch))
        {
            stream.status = FT_Common.AFM_STREAM_STATUS_EOF;
            break;
        }
    }

    return str;
}
var afm_key_table =
[
    "Ascender",
    "AxisLabel",
    "AxisType",
    "B",
    "BlendAxisTypes",
    "BlendDesignMap",
    "BlendDesignPositions",
    "C",
    "CC",
    "CH",
    "CapHeight",
    "CharWidth",
    "CharacterSet",
    "Characters",
    "Descender",
    "EncodingScheme",
    "EndAxis",
    "EndCharMetrics",
    "EndComposites",
    "EndDirection",
    "EndFontMetrics",
    "EndKernData",
    "EndKernPairs",
    "EndTrackKern",
    "EscChar",
    "FamilyName",
    "FontBBox",
    "FontName",
    "FullName",
    "IsBaseFont",
    "IsCIDFont",
    "IsFixedPitch",
    "IsFixedV",
    "ItalicAngle",
    "KP",
    "KPH",
    "KPX",
    "KPY",
    "L",
    "MappingScheme",
    "MetricsSets",
    "N",
    "Notice",
    "PCC",
    "StartAxis",
    "StartCharMetrics",
    "StartComposites",
    "StartDirection",
    "StartFontMetrics",
    "StartKernData",
    "StartKernPairs",
    "StartKernPairs0",
    "StartKernPairs1",
    "StartTrackKern",
    "StdHW",
    "StdVW",
    "TrackKern",
    "UnderlinePosition",
    "UnderlineThickness",
    "VV",
    "VVector",
    "Version",
    "W",
    "W0",
    "W0X",
    "W0Y",
    "W1",
    "W1X",
    "W1Y",
    "WX",
    "WY",
    "Weight",
    "WeightVector",
    "XHeight"
];

function afm_parser_read_vals(parser, vals, n)
{
    var stream = parser.stream;
    var str = null;

    if (n > FT_Common.AFM_MAX_ARGUMENTS)
        return 0;

    var i = 0;
    for (; i < n; i++)
    {
        var val = vals[i];

        if (val.type == FT_Common.AFM_VALUE_TYPE_STRING)
            str = afm_stream_read_string(stream);
        else
            str = afm_stream_read_one(stream);

        if (str == null)
            break;

        var len = stream.cursor - str.pos - 1;

        switch (val.type)
        {
            case FT_Common.AFM_VALUE_TYPE_STRING:
            case FT_Common.AFM_VALUE_TYPE_NAME:
                val.u = "";
                for (var j = 0; j < len; j++)
                    val.u += String.fromCharCode(str.data[str.pos++]);
                break;

            case FT_Common.AFM_VALUE_TYPE_FIXED:
                val.u = PS_Conv_ToFixed(str, str.pos + len, 0);
                break;

            case FT_Common.AFM_VALUE_TYPE_INTEGER:
                val.u = PS_Conv_ToInt(str, str.pos + len);
                break;

            case FT_Common.AFM_VALUE_TYPE_BOOL:
                val.u = (len == 4 && (0 == _strncmp(str, "true", 4)));
                break;

            case FT_Common.AFM_VALUE_TYPE_INDEX:
                if (parser.get_index != null)
                    val.u = parser.get_index(str, len, parser.user_data);
                else
                    val.u = 0;
                break;
        }
    }

    return i;
}

function afm_parser_next_key(parser, line)
{
    var stream = parser.stream;
    var key = null;

    if (line)
    {
        while ( 1 )
        {
            /* skip current line */
            if (stream.status < FT_Common.AFM_STREAM_STATUS_EOL)
                afm_stream_read_string(stream);

            stream.status = FT_Common.AFM_STREAM_STATUS_NORMAL;
            key = afm_stream_read_one(stream);

            /* skip empty line */
            if (key == null  && (stream.status < FT_Common.AFM_STREAM_STATUS_EOF) && (stream.status >= FT_Common.AFM_STREAM_STATUS_EOL))
                continue;

            break;
        }
    }
    else
    {
        while ( 1 )
        {
            /* skip current column */
            while (stream.status < FT_Common.AFM_STREAM_STATUS_EOC)
                afm_stream_read_one(stream);

            stream.status = FT_Common.AFM_STREAM_STATUS_NORMAL;
            key = afm_stream_read_one(stream);

            /* skip empty column */
            if (key == null  && (stream.status < FT_Common.AFM_STREAM_STATUS_EOF) && (stream.status >= FT_Common.AFM_STREAM_STATUS_EOC))
                continue;

            break;
        }
    }

    var ret_len;
    ret_len = (key != null) ? (stream.cursor - key.pos - 1) : 0;

    return { key : key, len: ret_len };
}

function afm_tokenize(key, len)
{
    var n = 0;
    for (; n < FT_Common.N_AFM_TOKENS; n++)
    {
        if (afm_key_table[n].charCodeAt(0) == key.charCodeAt(0))
        {
            for (; n < FT_Common.N_AFM_TOKENS; n++)
            {
                if (afm_key_table[n].charCodeAt(0) != key.charCodeAt(0))
                    return FT_Common.AFM_TOKEN_UNKNOWN;

                if (_strncmp(afm_key_table[n], key, len) == 0)
                    return n;
            }
        }
    }
    return FT_Common.AFM_TOKEN_UNKNOWN;
}

function afm_parser_init(parser, memory, base, limit)
{
    var stream = new AFM_StreamRec();

    stream.base = dublicate_pointer(base);
    stream.cursor = stream.base.pos;
    stream.limit  = limit;

    /* don't skip the first line during the first call */
    stream.status = FT_Common.AFM_STREAM_STATUS_EOL;

    parser.memory    = memory;
    parser.stream    = stream;
    parser.FontInfo  = null;
    parser.get_index = null;

    return 0;
}

function afm_parser_done(parser)
{
    parser.stream = null;
}

function afm_parser_read_int(parser)
{
    var val = new AFM_ValueRec();
    val.type = FT_Common.AFM_VALUE_TYPE_INTEGER;

    if (afm_parser_read_vals(parser, val, 1) == 1)
    {
        return { pint: val.u, err: 0 };
    }
    return { pint: 0, err: FT_Common.FT_Err_Syntax_Error };
}

function afm_parse_track_kern(parser)
{
    var fi = parser.FontInfo;
    var n = -1;

    var ret = afm_parser_read_int(parser);
    if (0 != ret.err)
        return FT_Common.FT_Err_Syntax_Error;

    fi.NumTrackKern = ret.pint;
    if (fi.NumTrackKern != 0)
    {
        fi.TrackKerns = new Array(fi.NumTrackKern);
    }

    while (true)
    {
        var _key_len = afm_parser_next_key(parser, 1);
        if (_key_len.key == null)
            break;

        var shared_vals = new Array(5);
        shared_vals[0] = new AFM_ValueRec();
        shared_vals[1] = new AFM_ValueRec();
        shared_vals[2] = new AFM_ValueRec();
        shared_vals[3] = new AFM_ValueRec();
        shared_vals[4] = new AFM_ValueRec();

        switch (afm_tokenize(_key_len.key, _key_len.len))
        {
            case FT_Common.AFM_TOKEN_TRACKKERN:
                n++;

                if (n >= fi.NumTrackKern)
                    return FT_Common.FT_Err_Syntax_Error;

                var tk = fi.TrackKerns[n];

                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_INTEGER;
                shared_vals[1].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[2].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[3].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[4].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                if (afm_parser_read_vals( parser, shared_vals, 5) != 5)
                    return FT_Common.FT_Err_Syntax_Error;

                tk.degree     = shared_vals[0].u;
                tk.min_ptsize = shared_vals[1].u;
                tk.min_kern   = shared_vals[2].u;
                tk.max_ptsize = shared_vals[3].u;
                tk.max_kern   = shared_vals[4].u;

                /* is this correct? */
                if (tk.degree < 0 && tk.min_kern > 0)
                    tk.min_kern = -tk.min_kern;
                break;

            case FT_Common.AFM_TOKEN_ENDTRACKKERN:
            case FT_Common.AFM_TOKEN_ENDKERNDATA:
            case FT_Common.AFM_TOKEN_ENDFONTMETRICS:
                fi.NumTrackKern = n + 1;
                return FT_Common.FT_Err_Ok;

            case FT_Common.AFM_TOKEN_UNKNOWN:
                break;

            default:
                return FT_Common.FT_Err_Syntax_Error;
        }
    }

    return FT_Common.FT_Err_Syntax_Error;
}

function afm_compare_kern_pairs(kp1, kp2)
{
    var index1 = kp1.index1 << 16 | kp1.index2;
    var index2 = kp2.index1 << 16 | kp2.index2;

    if ( index1 > index2 )
        return 1;
    else if ( index1 < index2 )
        return -1;
    else
        return 0;
}

function afm_parse_kern_pairs(parser)
{
    var fi = parser.FontInfo;
    var kp = null;
    var n = -1;

    var _key_len = afm_parser_read_int(parser);
    if (null != _key_len.key)
        return FT_Common.FT_Err_Syntax_Error;

    fi.NumKernPair = _key_len.len;
    if (fi.NumKernPair != 0)
    {
        fi.KernPairs = new Array(fi.NumKernPair);
        for (var i = 0; i < fi.NumKernPair; i++)
            fi.NumKernPair[i] = new AFM_KernPairRec();
    }

    while (true)
    {
        _key_len = afm_parser_next_key(parser, 1);
        if (null == _key_len.key)
            break;

        var token = afm_tokenize(_key_len.key, _key_len.len);
        switch (token)
        {
            case FT_Common.AFM_TOKEN_KP:
            case FT_Common.AFM_TOKEN_KPX:
            case FT_Common.AFM_TOKEN_KPY:
                var shared_vals = new Array(4);
                shared_vals[0] = new AFM_ValueRec();
                shared_vals[1] = new AFM_ValueRec();
                shared_vals[2] = new AFM_ValueRec();
                shared_vals[3] = new AFM_ValueRec();
                n++;

                if (n >= fi.NumKernPair)
                    return FT_Common.FT_Err_Syntax_Error;

                kp = fi.KernPairs[n];

                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_INDEX;
                shared_vals[1].type = FT_Common.AFM_VALUE_TYPE_INDEX;
                shared_vals[2].type = FT_Common.AFM_VALUE_TYPE_INTEGER;
                shared_vals[3].type = FT_Common.AFM_VALUE_TYPE_INTEGER;
                r = afm_parser_read_vals(parser, shared_vals, 4);
                if (r < 3)
                    return FT_Common.FT_Err_Syntax_Error;

                kp.index1 = shared_vals[0].u;
                kp.index2 = shared_vals[1].u;
                if (token == FT_Common.AFM_TOKEN_KPY)
                {
                    kp.x = 0;
                    kp.y = shared_vals[2].u;
                }
                else
                {
                    kp.x = shared_vals[2].u.i;
                    kp.y = (token == FT_Common.AFM_TOKEN_KP && r == 4) ? shared_vals[3].u : 0;
                }
                break;

            case FT_Common.AFM_TOKEN_ENDKERNPAIRS:
            case FT_Common.AFM_TOKEN_ENDKERNDATA:
            case FT_Common.AFM_TOKEN_ENDFONTMETRICS:
                fi.NumKernPair = n + 1;
                ft_qsort(fi.KernPairs, fi.NumKernPair, afm_compare_kern_pairs);
                return FT_Common.FT_Err_Ok;

            case FT_Common.AFM_TOKEN_UNKNOWN:
                break;

            default:
                return FT_Common.FT_Err_Syntax_Error;
        }
    }

    return FT_Common.FT_Err_Syntax_Error;
}

function afm_parse_kern_data(parser)
{
    while (true)
    {
        var _key_len = afm_parser_next_key(parser, 1);
        if (null != _key_len)
            break;

        switch (afm_tokenize(_key_len.key, _key_len.len))
        {
            case FT_Common.AFM_TOKEN_STARTTRACKKERN:
                var error = afm_parse_track_kern(parser);
                if (error != FT_Common.FT_Err_Ok)
                    return error;
                break;

            case FT_Common.AFM_TOKEN_STARTKERNPAIRS:
            case FT_Common.AFM_TOKEN_STARTKERNPAIRS0:
                var error = afm_parse_kern_pairs(parser);
                if (error != FT_Common.FT_Err_Ok)
                    return error;
                break;

            case FT_Common.AFM_TOKEN_ENDKERNDATA:
            case FT_Common.AFM_TOKEN_ENDFONTMETRICS:
                return FT_Common.FT_Err_Ok;

            case FT_Common.AFM_TOKEN_UNKNOWN:
                break;

            default:
                return FT_Common.FT_Err_Syntax_Error;
        }
    }
    
    return FT_Common.FT_Err_Syntax_Error;
}

function afm_parser_skip_section(parser, n, end_section)
{
    while ( n-- > 0 )
    {
        var _key_len = afm_parser_next_key(parser, 1);
        if (_key_len.key != null)
            return FT_Common.FT_Err_Syntax_Error;
    }

    while (true)
    {
        var _key_len = afm_parser_next_key(parser, 1);
        if (_key_len.key != null)
            break;

        var token = afm_tokenize(_key_len.key, _key_len.len);

        if (token == end_section || token == FT_Common.AFM_TOKEN_ENDFONTMETRICS)
            return FT_Common.FT_Err_Ok;
    }

    return FT_Common.FT_Err_Syntax_Error;
}

function afm_parser_parse(parser)
{
    var fi = parser.FontInfo;
    var error = FT_Common.FT_Err_Syntax_Error;
    var metrics_sets = 0;

    if (fi == null)
        return FT_Common.FT_Err_Invalid_Argument;

    var _key_len = afm_parser_next_key(parser, 1);
    if (null == _key_len.key || _key_len.len != 16 || _strncmp(_key_len.key, "StartFontMetrics", 16) != 0)
        return FT_Common.FT_Err_Unknown_File_Format;

    while (true)
    {
        _key_len = afm_parser_next_key(parser, 1);
        if (null == _key_len)
            break;

        var shared_vals = new Array(4);
        shared_vals[0] = new AFM_ValueRec();
        shared_vals[1] = new AFM_ValueRec();
        shared_vals[2] = new AFM_ValueRec();
        shared_vals[3] = new AFM_ValueRec();

        var token = afm_tokenize(_key_len.key, _key_len.len);
        switch (token)
        {
            case FT_Common.AFM_TOKEN_METRICSSETS:
                var ret = afm_parser_read_int(parser);
                if (ret.err != FT_Common.FT_Err_Ok)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }
                metrics_sets = ret.pint;
                if (metrics_sets != 0 && metrics_sets != 2)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return FT_Common.FT_Err_Unimplemented_Feature;
                }
                break;

            case FT_Common.AFM_TOKEN_ISCIDFONT:
                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_BOOL;
                if (afm_parser_read_vals(parser, shared_vals, 1) != 1)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }

                fi.IsCIDFont = shared_vals[0].u;
                break;

            case FT_Common.AFM_TOKEN_FONTBBOX:
                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[1].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[2].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                shared_vals[3].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                if (afm_parser_read_vals( parser, shared_vals, 4 ) != 4)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }

                fi.FontBBox.xMin = shared_vals[0].u;
                fi.FontBBox.yMin = shared_vals[1].u;
                fi.FontBBox.xMax = shared_vals[2].u;
                fi.FontBBox.yMax = shared_vals[3].u;
                break;

            case FT_Common.AFM_TOKEN_ASCENDER:
                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                if (afm_parser_read_vals(parser, shared_vals, 1) != 1)
                {
                    // fail
                    return error;
                }

                fi.Ascender = shared_vals[0].u;
                break;

            case FT_Common.AFM_TOKEN_DESCENDER:
                shared_vals[0].type = FT_Common.AFM_VALUE_TYPE_FIXED;
                if (afm_parser_read_vals( parser, shared_vals, 1 ) != 1)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }

                fi.Descender = shared_vals[0].u;
                break;

            case FT_Common.AFM_TOKEN_STARTCHARMETRICS:
                var ret = afm_parser_read_int(parser);
                if (ret.err != FT_Common.FT_Err_Ok)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }
                var n = ret.pint;
                error = afm_parser_skip_section(parser, n, FT_Common.AFM_TOKEN_ENDCHARMETRICS);
                if (error != FT_Common.FT_Err_Ok)
                    return error;
                break;

            case FT_Common.AFM_TOKEN_STARTKERNDATA:
                error = afm_parse_kern_data(parser);
                if (error != FT_Common.FT_Err_Ok)
                {
                    fi.TrackKerns = null;
                    fi.NumTrackKern = 0;

                    fi.KernPairs = null;
                    fi.NumKernPair = 0;

                    fi.IsCIDFont = 0;

                    return error;
                }
            /* fall through since we only support kern data */
            case FT_Common.AFM_TOKEN_ENDFONTMETRICS:
                return FT_Common.FT_Err_Ok;

            default:
                break;
        }
    }

    fi.TrackKerns = null;
    fi.NumTrackKern = 0;

    fi.KernPairs = null;
    fi.NumKernPair = 0;

    fi.IsCIDFont = 0;

    return error;
}

/******************************************************************************/
// t1cmap
/******************************************************************************/
function T1_CMapStdRec()
{
    this.cmap = new FT_CMapRec();

    this.code_to_sid = null;
    this.sid_to_string = null;

    this.num_glyphs = 0;
    this.glyph_names = null;

    this.type = FT_Common.FT_CMAP_1;
}
function T1_CMapCustomRec()
{
    this.cmap = new FT_CMapRec();
    this.first = 0;
    this.count = 0;
    this.indices = null;

    this.type = FT_Common.FT_CMAP_1;
}

// standart
function t1_cmap_std_init(cmap, is_expert)
{
    var face = __FT_CMapRec(cmap).charmap.face;
    var psnames = face.psnames;

    cmap.num_glyphs    = face.type1.num_glyphs;
    cmap.glyph_names   = face.type1.glyph_names;
    cmap.sid_to_string = psnames.adobe_std_strings;
    cmap.code_to_sid   = (is_expert == 1) ? psnames.adobe_expert_encoding : psnames.adobe_std_encoding;
}

function t1_cmap_std_done(cmap)
{
    cmap.num_glyphs    = 0;
    cmap.glyph_names   = null;
    cmap.sid_to_string = null;
    cmap.code_to_sid   = null;
}

function t1_cmap_std_char_index(cmap, char_code)
{
    var result = 0;

    if (char_code < 256)
    {
        /* convert character code to Adobe SID string */
        var code       = cmap.code_to_sid[char_code];
        var glyph_name = cmap.sid_to_string(code);

        /* look for the corresponding glyph name */
        for (var n = 0; n < cmap.num_glyphs; n++ )
        {
            var gname = cmap.glyph_names[n];

            if (gname != null && gname.charCodeAt(0) == glyph_name.charCodeAt(0) && gname == glyph_name)
            {
                result = n;
                break;
            }
        }
    }

    return result;
}

function t1_cmap_std_char_next(cmap, char_code)
{
    var result = 0;
    var pchar_code = char_code + 1;

    while (pchar_code < 256)
    {
        result = t1_cmap_std_char_index( cmap, pchar_code );
        if ( result != 0 )
            return {gindex:result,char_code:pchar_code};

        pchar_code++;
    }
    pchar_code = 0;
    return {gindex:result,char_code:pchar_code};
}

function t1_cmap_standard_init(cmap)
{
    t1_cmap_std_init(cmap, 0);
    return 0;
}

var t1_cmap_standard_class_rec = create_cmap_class_rec(0,t1_cmap_standard_init,t1_cmap_std_done,t1_cmap_std_char_index,t1_cmap_std_char_next,null,null,null,null,null);

// expert
function t1_cmap_expert_init(cmap)
{
    t1_cmap_std_init(cmap, 1);
    return 0;
}

var t1_cmap_expert_class_rec = create_cmap_class_rec(0,t1_cmap_expert_init,t1_cmap_std_done,t1_cmap_std_char_index,t1_cmap_std_char_next,null,null,null,null,null);

// custom
function t1_cmap_custom_init(cmap)
{
    var face = __FT_CMapRec(cmap).charmap.face;
    var encoding = face.type1.encoding;

    cmap.first   = encoding.code_first;
    cmap.count   = (encoding.code_last - cmap.first);

    if (0 > cmap.count)
        cmap.count = 0;

    cmap.indices = encoding.char_index;

    return 0;
}

function t1_cmap_custom_done(cmap)
{
    cmap.indices = null;
    cmap.first   = 0;
    cmap.count   = 0;
}

function t1_cmap_custom_char_index(cmap, char_code)
{
    if (char_code >= cmap.first && char_code < (cmap.first + cmap.count))
        return cmap.indices[char_code];
    return 0;
}

function t1_cmap_custom_char_next(cmap, _char_code)
{
    var result = 0;
    var char_code = _char_code;
    ++char_code;

    if (char_code < cmap.first)
        char_code = cmap.first;

    var last = cmap.first + cmap.count;
    for (; char_code < last; char_code++)
    {
        result = cmap.indices[char_code];
        if (result != 0)
            return {gindex:result,char_code:char_code};
    }

    return {gindex:result,char_code:0};
}

var t1_cmap_custom_class_rec = create_cmap_class_rec(0,t1_cmap_custom_init,t1_cmap_custom_done,t1_cmap_custom_char_index,t1_cmap_custom_char_next,null,null,null,null,null);

// unicode
function t1_get_glyph_name(face, idx)
{
    return face.type1.glyph_names[idx];
}

function t1_cmap_unicode_init(unicodes)
{
    var face = __FT_CMapRec(unicodes).charmap.face;
    var memory  = face.memory;
    var psnames = face.psnames;

    return psnames.unicodes_init(memory, unicodes, face.type1.num_glyphs, t1_get_glyph_name, null, face);
}

function t1_cmap_unicode_done(unicodes)
{
    unicodes.maps = null;
    unicodes.num_maps = 0;
}

function t1_cmap_unicode_char_index(unicodes, char_code)
{
    var face = __FT_CMapRec(unicodes).charmap.face;
    var psnames = face.psnames;

    return psnames.unicodes_char_index(unicodes, char_code);
}

function t1_cmap_unicode_char_next(unicodes, pchar_code)
{
    var face = __FT_CMapRec(unicodes).charmap.face;
    var psnames = face.psnames;

    return psnames.unicodes_char_next(unicodes, pchar_code);
}

var t1_cmap_unicode_class_rec = create_cmap_class_rec(0,t1_cmap_unicode_init,t1_cmap_unicode_done,t1_cmap_unicode_char_index,t1_cmap_unicode_char_next,null,null,null,null,null);

/******************************************************************************/
// psobj
/******************************************************************************/

function ps_table_new(table, count, memory)
{
    table.memory = memory;
    table.elements = new Array(count);

    for (var i = 0; i < count; i++)
        table.elements[i] = new CPointer();

    table.lengths = CreateIntArray(count);

    table.max_elems = count;
    table.init      = 0xDEADBEEF;
    table.num_elems = 0;
    table.block     = null;
    table.capacity  = 0;
    table.cursor    = 0;

    table.funcs = ps_table_funcs;
    return 0;
}

function shift_elements(table, old_base)
{
    var delta  = table.block.pos - old_base.pos;
    var els = table.elements;

    var limit = table.max_elems;
    for (var i = 0; i < limit; i++)
    {
        if (null != els[i])
        {
            els[i].data[els[i].pos] += delta;
        }
    }
}

function reallocate_t1_table(table, new_size)
{
    var memory = table.memory;
    var old_base = table.block;

    table.block = memory.Alloc(new_size);
    var dst = table.block.data;
    if (null != old_base)
    {
        var src = old_base.data;
        for (var i = 0; i < table.capacity; i++)
        {
            dst[i] = src[i];
        }
    }

    var _els = table.elements;
    var _elc = table.max_elems;
    for (var j = 0; j < _elc; j++)
        _els[j].data = dst;

    old_base = null;
    table.capacity = new_size;
    return 0;
}

function ps_table_add(table, idx, object, length)
{
    if (idx < 0 || idx >= table.max_elems)
        return FT_Common.FT_Err_Invalid_Argument;

    if (length < 0)
        return FT_Common.FT_Err_Invalid_Argument;

    /*
    table.elements[idx] = copy_pointer(object, length);
    table.lengths[idx] = length;
    table.cursor = idx + 1;
    */

    if (table.cursor + length > table.capacity)
    {
        var new_size = table.capacity;

        while (new_size < (table.cursor + length))
        {
            /* increase size by 25% and round up to the nearest multiple
             of 1024 */
            new_size += (new_size >> 2) + 1;
            new_size = parseInt((new_size + 1023) / 1024) * 1024;
        }

        reallocate_t1_table(table, new_size);
    }

    /* add the object to the base block and adjust offset */
    table.elements[idx].pos = table.cursor;
    table.lengths[idx] = length;

    var dd = table.block.data;
    var dp = table.cursor;
    var sd = object.data;
    var sp = object.pos;

    for (var i = 0; i < length; i++)
        dd[dp++] = sd[sp++];

    table.cursor += length;

    return 0;
}

function ps_table_done(table)
{
    if (null == table.block)
        return 0;

    reallocate_t1_table(table, table.cursor);
    return 0;
}

function ps_table_release(table)
{
    if (table.init == 0xDEADBEEF)
    {
        table.block = null;
        table.elements = null;
        table.lengths = null;
        table.init = 0;
    }
}

function skip_comment(cur, limit)
{
    while (cur.pos < limit)
    {
        if (IS_PS_NEWLINE(cur.data[cur.pos]))
            break;
        cur.pos++;
    }
}

function skip_spaces(cur, limit)
{
    while (cur.pos < limit)
    {
        if (!IS_PS_SPACE(cur.data[cur.pos]))
        {
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_MATH_3)
            {
                /* According to the PLRM, a comment is equal to a space. */
                skip_comment(cur, limit);
            }
            else
                break;
        }
        cur.pos++;
    }
}

function skip_literal_string(cur, limit)
{
    var embed = 0;
    var error = FT_Common.FT_Err_Invalid_File_Format;

    while (cur.pos < limit)
    {
        var c = cur.data[cur.pos];
        cur.pos++;

        if (c == FT_Common.SYMBOL_CONST_SS)
        {
            /* Red Book 3rd ed., section `Literal Text Strings', p. 29:     */
            /* A backslash can introduce three different types              */
            /* of escape sequences:                                         */
            /*   - a special escaped char like \r, \n, etc.                 */
            /*   - a one-, two-, or three-digit octal number                */
            /*   - none of the above in which case the backslash is ignored */

            if (cur.pos == limit)
                break;/* error (or to be ignored?) */

            switch (cur.data[cur.pos])
            {
            /* skip `special' escape */
            case FT_Common.SYMBOL_CONST_n:
            case FT_Common.SYMBOL_CONST_r:
            case FT_Common.SYMBOL_CONST_t:
            case FT_Common.SYMBOL_CONST_b:
            case FT_Common.SYMBOL_CONST_f:
            case FT_Common.SYMBOL_CONST_SS:
            case FT_Common.SYMBOL_CONST_LS1:
            case FT_Common.SYMBOL_CONST_RS1:
                cur.pos++;
                break;

            default:
                /* skip octal escape or ignore backslash */
                for (var i = 0; i < 3 && cur.pos < limit; i++)
                {
                    if (FT_Common.SYMBOL_CONST_0 > cur.data[cur.pos] || FT_Common.SYMBOL_CONST_7 < cur.data[cur.pos])
                        break;

                    cur.pos++;
                }
            }
        }
        else if (c == FT_Common.SYMBOL_CONST_LS1)
            embed++;
        else if (c == FT_Common.SYMBOL_CONST_RS1)
        {
            embed--;
            if (embed == 0)
            {
                error = 0;
                break;
            }
        }
    }
    return error;
}

function skip_string(cur, limit)
{
    while (cur.pos < limit)
    {
        /* All whitespace characters are ignored. */
        skip_spaces(cur, limit);
        if (cur.pos >= limit)
            break;

        if (!IS_PS_XDIGIT(cur.data[cur.pos]))
            break;
    }

    if (cur.pos < limit && cur.data[cur.pos] != FT_Common.SYMBOL_CONST_MATH_2)
    {
        return FT_Common.FT_Err_Invalid_File_Format;
    }
    else
        cur.pos++;

    return 0;
}

function skip_procedure(cur, limit)
{
    var embed = 0;

    var error = 0;
    for (; cur.pos < limit && error == 0; cur.pos++)
    {
        switch (cur.data[cur.pos])
        {
        case FT_Common.SYMBOL_CONST_LS3:
            ++embed;
            break;

        case FT_Common.SYMBOL_CONST_RS3:
            --embed;
            if (embed == 0)
            {
                cur.pos++;
                return 0;
            }
            break;

        case FT_Common.SYMBOL_CONST_LS1:
            error = skip_literal_string(cur, limit);
            break;

        case FT_Common.SYMBOL_CONST_MATH_1:
            error = skip_string(cur, limit);
            break;

        case FT_Common.SYMBOL_CONST_MATH_3:
            skip_comment(cur, limit);
            break;
        }
    }

    if (embed != 0)
        error = FT_Common.FT_Err_Invalid_File_Format;

    return error;
}

function ps_parser_skip_PS_token(parser)
{
    /* Note: PostScript allows any non-delimiting, non-whitespace        */
    /*       character in a name (PS Ref Manual, 3rd ed, p31).           */
    /*       PostScript delimiters are (, ), <, >, [, ], {, }, /, and %. */

    var cur = dublicate_pointer(parser.cursor);
    var limit = parser.limit;
    var error = FT_Common.FT_Err_Ok;

    var cursor_pos = cur.pos;
    skip_spaces(cur, limit);             /* this also skips comments */
    if (cur.pos >= limit)
    {
        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    /* self-delimiting, single-character tokens */
    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_LS2 || cur.data[cur.pos] == FT_Common.SYMBOL_CONST_RS2)
    {
        cur.pos++;
        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    /* skip balanced expressions (procedures and strings) */

    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_LS3)                              /* {...} */
    {
        error = skip_procedure(cur, limit);
        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_LS1)                              /* (...) */
    {
        error = skip_literal_string(cur, limit);
        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_MATH_1)                              /* <...> */
    {
        if (cur.pos + 1 < limit && cur.data[cur.pos + 1] == FT_Common.SYMBOL_CONST_MATH_1)   /* << */
        {
            cur.pos += 2;
        }
        else
            error = skip_string(cur, limit);

        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_MATH_2)
    {
        cur.pos++;
        if (cur.pos >= limit || cur.data[cur.pos] != FT_Common.SYMBOL_CONST_MATH_2)             /* >> */
        {
            error = FT_Common.FT_Err_Invalid_File_Format;

            parser.error  = error;
            parser.cursor.pos = cur.pos;
            return;
        }
        cur.pos++;
        if (cur.pos == cursor_pos)
        {
            error = FT_Common.FT_Err_Invalid_File_Format;
        }

        parser.error  = error;
        parser.cursor.pos = cur.pos;
        return;
    }

    if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS)
        cur.pos++;

    /* anything else */
    while (cur.pos < limit)
    {
        /* *cur might be invalid (e.g., ')' or '}'), but this   */
        /* is handled by the test `cur == parser->cursor' below */
        if (IS_PS_DELIM(cur.data[cur.pos]))
            break;

        cur.pos++;
    }

    //exit
    if (cur.pos == cursor_pos)
    {
        error = FT_Common.FT_Err_Invalid_File_Format;
    }

    parser.error  = error;
    parser.cursor.pos = cur.pos;
}

function ps_parser_skip_spaces(parser)
{
    skip_spaces(parser.cursor, parser.limit);
}

function ps_parser_to_token(parser, token)
{
    var limit = parser.limit;
    var embed = 0;

    token.type  = FT_Common.T1_TOKEN_TYPE_NONE;
    token.start = null;
    token.limit = 0;

    /* first of all, skip leading whitespace */
    ps_parser_skip_spaces(parser);
    var cur = dublicate_pointer(parser.cursor);

    if (cur.pos >= limit)
        return;

    switch (cur.data[cur.pos])
    {
        /************* check for literal string *****************/
    case FT_Common.SYMBOL_CONST_LS1:
        token.type  = FT_Common.T1_TOKEN_TYPE_STRING;
        token.start = dublicate_pointer(cur);

        if (skip_literal_string(cur, limit) == 0)
            token.limit = cur.pos;
        break;

        /************* check for programs/array *****************/
    case FT_Common.SYMBOL_CONST_LS3:
        token.type  = FT_Common.T1_TOKEN_TYPE_ARRAY;
        token.start = dublicate_pointer(cur);

        if (skip_procedure(cur, limit) == 0)
            token.limit = cur.pos;
        break;

        /************* check for table/array ********************/
        /* XXX: in theory we should also look for "<<"          */
        /*      since this is semantically equivalent to "[";   */
        /*      in practice it doesn't matter (?)               */
    case FT_Common.SYMBOL_CONST_LS2:
        token.type  = FT_Common.T1_TOKEN_TYPE_ARRAY;
        embed        = 1;
        token.start  = dublicate_pointer(cur);
        cur.pos++;

        /* we need this to catch `[ ]' */
        parser.cursor.pos = cur.pos;
        ps_parser_skip_spaces(parser);
        cur.pos = parser.cursor.pos;

        while (cur.pos < limit && parser.error == 0)
        {
            /* XXX: this is wrong because it does not      */
            /*      skip comments, procedures, and strings */
            if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_LS2)
                embed++;
            else if (cur.data[cur.pos] == FT_Common.SYMBOL_CONST_RS2)
            {
                embed--;
                if ( embed <= 0 )
                {
                    cur.pos++;
                    token.limit = cur.pos;
                    break;
                }
            }

            parser.cursor.pos = cur.pos;
            ps_parser_skip_PS_token(parser);
            /* we need this to catch `[XXX ]' */
            ps_parser_skip_spaces(parser);
            cur.pos = parser.cursor.pos;
        }
        break;

        /* ************ otherwise, it is any token **************/
    default:
        token.start = dublicate_pointer(cur);
        token.type  = ((cur.data[cur.pos] == FT_Common.SYMBOL_CONST_BS) ? FT_Common.T1_TOKEN_TYPE_KEY : FT_Common.T1_TOKEN_TYPE_ANY);
        ps_parser_skip_PS_token(parser);
        cur.pos = parser.cursor.pos;
        if (!parser.error)
            token.limit = cur.pos;
    }

    if (token.limit == 0)
    {
        token.start = null;
        token.type  = FT_Common.T1_TOKEN_TYPE_NONE;
    }

    parser.cursor.pos = cur.pos;
}

function ps_parser_to_token_array(parser, tokens, max_tokens)
{
    var master = new T1_TokenRec();
    var pnum_tokens = -1;
    /* this also handles leading whitespace */
    ps_parser_to_token(parser, master);

    if (master.type == FT_Common.T1_TOKEN_TYPE_ARRAY)
    {
        var old_cursor = parser.cursor.pos;
        var old_limit  = parser.limit;
        var cur        = 0;

        /* don't include outermost delimiters */
        parser.cursor = dublicate_pointer(master.start);
        parser.cursor.pos += 1;
        parser.limit  = master.limit - 1;

        while (parser.cursor.pos < parser.limit)
        {
            var token = new T1_TokenRec();
            ps_parser_to_token(parser, token);
            if (token.type == 0)
                break;

            if (tokens != null && cur < max_tokens)
            {
                var _cur = tokens[cur];
                _cur.start = dublicate_pointer(token.start);
                _cur.limit = token.limit;
                _cur.type = token.type;
            }

            cur++;
        }

        pnum_tokens = cur;

        parser.cursor.pos = old_cursor;
        parser.limit  = old_limit;
    }

    return pnum_tokens;
}

function ps_tocoordarray(cur, limit, max_coords, coords)
{
    var count = 0;
    if (cur.pos >= limit)
        return count;

    /* check for the beginning of an array; otherwise, only one number */
    /* will be read                                                    */
    var c = cur.data[cur.pos];
    var ender = 0;

    if (c == FT_Common.SYMBOL_CONST_LS2)
        ender = FT_Common.SYMBOL_CONST_RS2;
    else if (c == FT_Common.SYMBOL_CONST_LS3)
        ender = FT_Common.SYMBOL_CONST_RS3;

    if (ender != 0)
        cur.pos++;

    /* now, read the coordinates */
    while ( cur < limit )
    {
        /* skip whitespace in front of data */
        skip_spaces(cur, limit);
        if (cur.pos >= limit)
            return count;

        if (cur.data[cur.pos] == ender)
        {
            cur.pos++;
            break;
        }

        var old_cur = cur.pos;

        if ( coords != NULL && count >= max_coords )
            break;

        /* call PS_Conv_ToFixed() even if coords == NULL */
        /* to properly parse number at `cur'             */
        var dummy = PS_Conv_ToFixed(cur, limit, 0) >> 16;
        if (null != coords)
            coords[count] = dummy;

        if (old_cur == cur.pos)
        {
            count = -1;
            return count;
        }
        else
            count++;

        if (ender == 0)
            break;
    }

    return count;
}

function ps_tofixedarray(cur, limit, max_values, values, power_ten)
{
    var count = 0;
    if (cur.pos >= limit)
        return count;

    /* Check for the beginning of an array.  Otherwise, only one number */
    /* will be read.                                                    */
    var c = cur.data[cur.pos];
    var ender = 0;

    if (c == FT_Common.SYMBOL_CONST_LS2)
        ender = FT_Common.SYMBOL_CONST_RS2;
    else if (c == FT_Common.SYMBOL_CONST_LS3)
        ender = FT_Common.SYMBOL_CONST_RS3;

    if (ender != 0)
        cur.pos++;

    /* now, read the values */
    while (cur.pos < limit)
    {
        /* skip whitespace in front of data */
        skip_spaces(cur, limit);
        if (cur.pos >= limit)
            return count;

        if (cur.data[cur.pos] == ender)
        {
            cur.pos++;
            break;
        }

        var old_cur = cur.pos;
        if (values != null && count >= max_values)
            break;

        /* call PS_Conv_ToFixed() even if coords == NULL */
        /* to properly parse number at `cur'             */
        var dummy = PS_Conv_ToFixed(cur, limit, power_ten);
        if (null != values)
            values[count] = dummy;

        if (old_cur == cur.pos)
        {
            count = -1;
            return count;
        }
        else
            count++;

        if (ender == 0)
            break;
    }

    return count;
}

function ps_tobool(cur, limit)
{
    var result = 0;
    var data = cur.data;
    var pos = cur.pos;

    /* return 1 if we find `true', 0 otherwise */
    if (cur.pos + 3 < limit &&
        data[pos] == FT_Common.SYMBOL_CONST_t &&
        data[pos + 1] == FT_Common.SYMBOL_CONST_r &&
        data[pos + 2] == FT_Common.SYMBOL_CONST_u &&
        data[pos + 3] == FT_Common.SYMBOL_CONST_e)
    {
        result = 1;
        cur.pos += 5;
    }
    else if (cur.pos + 4 < limit &&
        data[pos] == FT_Common.SYMBOL_CONST_f &&
        data[pos + 1] == FT_Common.SYMBOL_CONST_a &&
        data[pos + 2] == FT_Common.SYMBOL_CONST_l &&
        data[pos + 3] == FT_Common.SYMBOL_CONST_s &&
        data[pos + 4] == FT_Common.SYMBOL_CONST_e)
    {
        result = 0;
        cur.pos   += 6;
    }

    return result;
}

function ps_parser_load_field(parser, field, objects, max_objects, pflags)
{
    var token = new T1_TokenRec();
    /* this also skips leading whitespace */
    ps_parser_to_token(parser, token);
    if (token.type == 0)
        return FT_Common.FT_Err_Invalid_File_Format;

    var count = 1;
    var idx   = 0;
    var cur   = dublicate_pointer(token.start);
    var limit = token.limit;

    /* we must detect arrays in /FontBBox */
    if (field.type == FT_Common.T1_FIELD_TYPE_BBOX)
    {
        var token2 = new T1_TokenRec();
        var old_cur   = dublicate_pointer(parser.cursor);
        var old_limit = parser.limit;

        /* don't include delimiters */
        parser.cursor = dublicate_pointer(token.start);
        parser.cursor.pos += 1;
        parser.limit  = token.limit - 1;

        ps_parser_to_token(parser, token2);
        parser.cursor = dublicate_pointer(old_cur);
        parser.limit  = old_limit;

        if (token2.type == FT_Common.T1_TOKEN_TYPE_ARRAY)
        {
            /* if this is an array and we have no blend, an error occurs */
            if (max_objects == 0)
                return FT_Common.FT_Err_Invalid_File_Format;

            count = max_objects;
            idx   = 1;

            /* don't include delimiters */
            cur.pos++;
            limit--;
        }
    }
    else if (token.type == FT_Common.T1_TOKEN_TYPE_ARRAY)
    {
        /* if this is an array and we have no blend, an error occurs */
        if (max_objects == 0)
            return FT_Common.FT_Err_Invalid_File_Format;

        count = max_objects;
        idx   = 1;

        /* don't include delimiters */
        cur.pos++;
        limit--;
    }

    for (; count > 0; count--, idx++)
    {
        var __obj = objects[idx];
        var val;
        skip_spaces(cur, limit);

        switch (field.type)
        {
            case FT_Common.T1_FIELD_TYPE_BOOL:
                val = ps_tobool(cur, limit);
                fire_t1_field(__obj, val, field);
                break;

            case FT_Common.T1_FIELD_TYPE_FIXED:
                val = PS_Conv_ToFixed(cur, limit, 0);
                fire_t1_field(__obj, val, field);
                break;

            case FT_Common.T1_FIELD_TYPE_FIXED_1000:
                val = PS_Conv_ToFixed(cur, limit, 3);
                fire_t1_field(__obj, val, field);
                break;

            case FT_Common.T1_FIELD_TYPE_INTEGER:
                val = PS_Conv_ToInt(cur, limit);
                fire_t1_field(__obj, val, field);
                break;

            case FT_Common.T1_FIELD_TYPE_STRING:
            case FT_Common.T1_FIELD_TYPE_KEY:
                var len = (limit - cur.pos);

                if (cur.pos >= limit)
                    break;

                /* we allow both a string or a name   */
                /* for cases like /FontName (foo) def */
                if (token.type == FT_Common.T1_TOKEN_TYPE_KEY)
                {
                    /* don't include leading `/' */
                    len--;
                    cur.pos++;
                }
                else if (token.type == FT_Common.T1_TOKEN_TYPE_STRING)
                {
                    /* don't include delimiting parentheses    */
                    /* XXX we don't handle <<...>> here        */
                    /* XXX should we convert octal escapes?    */
                    /*     if so, what encoding should we use? */
                    cur.pos++;
                    len -= 2;
                }
                else
                {
                    return FT_Common.FT_Err_Invalid_File_Format;
                }

                /* for this to work (FT_String**)q must have been */
                /* initialized to NULL                            */
                var _s = "";
                for (var i = 0; i < len; i++)
                    _s += String.fromCharCode(cur.data[cur.pos + i]);

                fire_t1_field(__obj, _s, field);
                break;

            case FT_Common.T1_FIELD_TYPE_BBOX:
                var temp = new Array(4);
                temp[0] = 0;
                temp[1] = 0;
                temp[2] = 0;
                temp[3] = 0;

                var result = ps_tofixedarray(cur, limit, 4, temp, 0);

                if ( result < 0 )
                {
                    return FT_Common.FT_Err_Invalid_File_Format;
                }

                __obj.xMin = FT_RoundFix(temp[0]);
                __obj.yMin = FT_RoundFix(temp[1]);
                __obj.xMax = FT_RoundFix(temp[2]);
                __obj.yMax = FT_RoundFix(temp[3]);

                break;

            default:
                /* an error occurred */
                return FT_Common.FT_Err_Invalid_File_Format;
        }
    }

    return 0;
}

function ps_parser_load_field_table(parser, field, objects, max_objects, pflags)
{
    var elements = new Array(FT_Common.T1_MAX_TABLE_ELEMENTS);
    for (var i = 0; i < FT_Common.T1_MAX_TABLE_ELEMENTS; i++)
        elements[i] = new T1_TokenRec();

    var fieldrec = create_dublicate_t1_field(field);

    fieldrec.type = FT_Common.T1_FIELD_TYPE_INTEGER;
    if (field.type == FT_Common.T1_FIELD_TYPE_FIXED_ARRAY || field.type == FT_Common.T1_FIELD_TYPE_BBOX)
        fieldrec.type = FT_Common.T1_FIELD_TYPE_FIXED;

    var num_elements = ps_parser_to_token_array(parser, elements, FT_Common.T1_MAX_TABLE_ELEMENTS);
    if (num_elements < 0)
        return FT_Common.FT_Err_Ignore;

    if (num_elements > field.array_max)
        num_elements = field.array_max;

    var old_cursor = dublicate_pointer(parser.cursor);
    var old_limit  = parser.limit;

    /* we store the elements count if necessary;           */
    /* we further assume that `count_offset' can't be zero */
    if (field.type != FT_Common.T1_FIELD_TYPE_BBOX && field.set_field_count != undefined)
    {
        fire_t1_field_count(objects[0], num_elements, field);
    }

    /* we now load each element, adjusting the field.offset on each one */
    var token = 0;
    for ( ; num_elements > 0; num_elements--, token++)
    {
        fieldrec.offset = token;
        parser.cursor = dublicate_pointer(elements[token].start);
        parser.limit  = elements[token].limit;
        ps_parser_load_field(parser, fieldrec, objects, max_objects, 0);
    }

    parser.cursor = dublicate_pointer(old_cursor);
    parser.limit  = old_limit;

    return 0;
}

function ps_parser_to_int(parser)
{
    ps_parser_skip_spaces(parser);
    return PS_Conv_ToInt(parser.cursor, parser.limit);
}

function ps_parser_to_bytes(parser, bytes, max_bytes, delimiters)
{
    ps_parser_skip_spaces(parser);
    var cur = dublicate_pointer(parser.cursor);
    
    if (cur.pos >= parser.limit)
        return 0;

    if (delimiters)
    {
        if (cur.data[cur.pos] != FT_Common.SYMBOL_CONST_MATH_1)
        {
            return {err: FT_Common.FT_Err_Invalid_File_Format, num_bytes: 0};
        }

        cur.pos++;
    }

    var num_bytes = PS_Conv_ASCIIHexDecode(cur, parser.limit, bytes, max_bytes);

    if (delimiters)
    {
        if (cur.pos < parser.limit && cur.data[cur.pos] != FT_Common.SYMBOL_CONST_MATH_2)
        {
            return {err: FT_Common.FT_Err_Invalid_File_Format, num_bytes: num_bytes};
        }

        cur.pos++;
    }

    parser.cursor.pos = cur.pos;
    return {err: FT_Common.FT_Err_Ok, num_bytes: num_bytes};
}

function ps_parser_to_fixed(parser, power_ten)
{
    ps_parser_skip_spaces(parser);
    return PS_Conv_ToFixed(parser.cursor, parser.limit, power_ten);
}

function ps_parser_to_coord_array(parser, max_coords, coords)
{
    ps_parser_skip_spaces(parser);
    return PS_Conv_ToFixed(parser.cursor, parser.limit, max_coords, coords);
}

function ps_parser_to_fixed_array(parser, max_values, values, power_ten)
{
    ps_parser_skip_spaces(parser);
    return ps_tofixedarray(parser.cursor, parser.limit, max_values, values, power_ten);
}

function ps_parser_init(parser, base, limit, memory)
{
    parser.error  = 0;
    parser.base   = dublicate_pointer(base);
    parser.limit  = limit;
    parser.cursor = dublicate_pointer(base);
    parser.memory = memory;
    parser.funcs  = ps_parser_funcs;
}

function ps_parser_done(parser)
{
}

function t1_builder_init(builder, face, size, _glyph, hinting)
{
    var glyph = (null == _glyph) ? null : _glyph.root;

    builder.parse_state = FT_Common.T1_Parse_Start;
    builder.load_points = 1;

    builder.face = face;
    builder.glyph = glyph;
    builder.memory = face.memory;

    if (glyph != null)
    {
        var loader = glyph.internal.loader;

        builder.loader  = loader;
        builder.base    = loader.base.outline;
        builder.current = loader.current.outline;
        FT_GlyphLoader_Rewind(loader);

        builder.hints_globals = size.internal;
        builder.hints_funcs   = null;

        if (hinting)
            builder.hints_funcs = glyph.internal.glyph_hints;
    }

    builder.pos_x = 0;
    builder.pos_y = 0;

    builder.left_bearing.x = 0;
    builder.left_bearing.y = 0;
    builder.advance.x      = 0;
    builder.advance.y      = 0;

    builder.funcs = t1_builder_funcs;
}

function t1_builder_done(builder)
{
    var glyph = builder.glyph;

    if (glyph != null)
        EquatingOutline(glyph.outline, builder.base);
}

function t1_builder_check_points(builder, count)
{
    return FT_GLYPHLOADER_CHECK_POINTS(builder.loader, count, 0);
}

function t1_builder_add_point(builder, x, y, flag)
{
    var outline = builder.current;
    var base = builder.base;

    if (builder.load_points)
    {
        var point = base.points[outline.points + outline.n_points];
        point.x = (FT_RoundFix(x) >> 16);
        point.y = (FT_RoundFix(y) >> 16);

        base.tags[outline.tags + outline.n_points] = flag ? FT_Common.FT_CURVE_TAG_ON : FT_Common.FT_CURVE_TAG_CUBIC;
    }
    outline.n_points++;
}

function t1_builder_add_point1(builder, x, y)
{
    var error = t1_builder_check_points(builder, 1);
    if ( !error )
        t1_builder_add_point(builder, x, y, 1);

    return error;
}

function t1_builder_add_contour(builder)
{
    var outline = builder.current;

    /* this might happen in invalid fonts */
    if (outline == null)
    {
        return FT_Common.FT_Err_Invalid_File_Format;
    }

    if (builder.load_points == 0)
    {
        outline.n_contours++;
        return FT_Common.FT_Err_Ok;
    }

    var error = FT_GLYPHLOADER_CHECK_POINTS(builder.loader, 0, 1);
    if (error == 0)
    {
        if (outline.n_contours > 0)
            builder.base.contours[outline.contours + outline.n_contours - 1] = (outline.n_points - 1);

        outline.n_contours++;
    }

    return error;
}

function t1_builder_start_point(builder, x, y)
{
    var error = FT_Common.FT_Err_Invalid_File_Format;

    /* test whether we are building a new contour */
    if (builder.parse_state == FT_Common.T1_Parse_Have_Path)
        error = FT_Common.FT_Err_Ok;
    else
    {
        builder.parse_state = FT_Common.T1_Parse_Have_Path;
        error = t1_builder_add_contour(builder);
        if ( !error )
            error = t1_builder_add_point1(builder, x, y);
    }

    return error;
}

function t1_builder_close_contour(builder)
{
    var outline = builder.current;

    if (outline == null)
        return;

    var base = builder.base;
    var first = (outline.n_contours <= 1) ? 0 : base.contours[outline.contours + outline.n_contours - 2] + 1;

    /* We must not include the last point in the path if it */
    /* is located on the first point.                       */
    if (outline.n_points > 1)
    {
        var p1 = base.points[outline.points + first];
        var p2 = base.points[outline.points + outline.n_points - 1];

        var control = base.tags[outline.tags + outline.n_points - 1];

        /* `delete' last point only if it coincides with the first */
        /* point and it is not a control point (which can happen). */
        if (p1.x == p2.x && p1.y == p2.y)
            if (control == FT_Common.FT_CURVE_TAG_ON)
                outline.n_points--;
    }

    if (outline.n_contours > 0)
    {
        /* Don't add contours only consisting of one point, i.e.,  */
        /* check whether the first and the last point is the same. */
        if (first == outline.n_points - 1)
        {
            outline.n_contours--;
            outline.n_points--;
        }
        else
            base.contours[outline.contours + outline.n_contours - 1] = (outline.n_points - 1);
    }
}

function t1_decrypt(buffer, length, seed)
{
    var mem = dublicate_pointer(buffer);
    PS_Conv_EexecDecode(mem, mem.pos + length, mem, length, seed);
}

/******************************************************************************/
// t1decode
/******************************************************************************/

var t1_args_count = [
    0, /* none */
    0, /* endchar */
    2, /* hsbw */
    5, /* seac */
    4, /* sbw */
    0, /* closepath */
    1, /* hlineto */
    1, /* hmoveto */
    4, /* hvcurveto */
    2, /* rlineto */
    2, /* rmoveto */
    6, /* rrcurveto */
    4, /* vhcurveto */
    1, /* vlineto */
    1, /* vmoveto */
    0, /* dotsection */
    2, /* hstem */
    6, /* hstem3 */
    2, /* vstem */
    6, /* vstem3 */
    2, /* div */
    -1, /* callothersubr */
    1, /* callsubr */
    0, /* pop */
    0, /* return */
    2, /* setcurrentpoint */
    2  /* opcode 15 (undocumented and obsolete) */
];

function t1_lookup_glyph_by_stdcharcode(decoder, charcode)
{
    /* check range of standard char code */
    if (charcode < 0 || charcode > 255)
        return -1;

    var glyph_name = decoder.psnames.adobe_std_strings(decoder.psnames.adobe_std_encoding[charcode]);

    for (var n = 0; n < decoder.num_glyphs; n++)
    {
        var name = decoder.glyph_names[n];

        if (name != null && name == glyph_name)
            return n;
    }

    return -1;
}

function t1operator_seac(decoder, asb, adx, ady, bchar, achar)
{
    var bchar_index, achar_index;

    if (decoder.seac)
        return FT_Common.FT_Err_Syntax_Error;

    var error = 0;
    var face = decoder.builder.face;

    /* seac weirdness */
    adx += decoder.builder.left_bearing.x;

    /* `glyph_names' is set to 0 for CID fonts which do not */
    /* include an encoding.  How can we deal with these?    */
    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (decoder.glyph_names == null && null == face.internal.incremental_interface)
        return FT_Common.FT_Err_Syntax_Error;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    if (face.internal.incremental_interface != null)
    {
        /* the caller must handle the font encoding also */
        bchar_index = bchar;
        achar_index = achar;
    }
    else// #endif
    {
        bchar_index = t1_lookup_glyph_by_stdcharcode(decoder, bchar);
        achar_index = t1_lookup_glyph_by_stdcharcode(decoder, achar);
    }

    if (bchar_index < 0 || achar_index < 0)
        return FT_Common.FT_Err_Syntax_Error;

    /* if we are trying to load a composite glyph, do not load the */
    /* accent character and return the array of subglyphs.         */
    if (decoder.builder.no_recurse)
    {
        var glyph = decoder.builder.glyph;
        var loader = glyph.internal.loader;

        /* reallocate subglyph array if necessary */
        error = FT_GlyphLoader_CheckSubGlyphs(loader, 2);
        if (error != 0)
            return error;

        var subg = loader.current.subglyphs[0];

        /* subglyph 0 = base character */
        subg.index = bchar_index;
        subg.flags = FT_Common.FT_SUBGLYPH_FLAG_ARGS_ARE_XY_VALUES | FT_Common.FT_SUBGLYPH_FLAG_USE_MY_METRICS;
        subg.arg1  = 0;
        subg.arg2  = 0;

        subg = loader.current.subglyphs[1];

        /* subglyph 1 = accent character */
        subg.index = achar_index;
        subg.flags = FT_Common.FT_SUBGLYPH_FLAG_ARGS_ARE_XY_VALUES;
        subg.arg1  = FT_RoundFix(adx - asb) >> 16;
        subg.arg2  = FT_RoundFix(ady) >> 16;

        /* set up remaining glyph fields */
        glyph.num_subglyphs = 2;
        glyph.subglyphs     = loader.base.subglyphs;
        glyph.format        = FT_Common.FT_GLYPH_FORMAT_COMPOSITE;

        loader.current.num_subglyphs = 2;
        return error;
    }

    /* First load `bchar' in builder */
    /* now load the unscaled outline */

    FT_GlyphLoader_Prepare(decoder.builder.loader);  /* prepare loader */

    /* the seac operator must not be nested */
    decoder.seac = 1;
    error = t1_decoder_parse_glyph(decoder, bchar_index);
    decoder.seac = 0;
    if (error != 0)
        return error;

    /* save the left bearing and width of the base character */
    /* as they will be erased by the next load.              */

    var left_bearing = dublicate_vector(decoder.builder.left_bearing);
    var advance      = dublicate_vector(decoder.builder.advance);

    decoder.builder.left_bearing.x = 0;
    decoder.builder.left_bearing.y = 0;

    decoder.builder.pos_x = adx - asb;
    decoder.builder.pos_y = ady;

    /* Now load `achar' on top of */
    /* the base outline           */

    /* the seac operator must not be nested */
    decoder.seac = 1;
    error = t1_decoder_parse_glyph(decoder, achar_index);
    decoder.seac = 0;
    if (error != 0)
        return error;

    /* restore the left side bearing and   */
    /* advance width of the base character */

    decoder.builder.left_bearing = left_bearing;
    decoder.builder.advance      = advance;

    decoder.builder.pos_x = 0;
    decoder.builder.pos_y = 0;

    return error;
}

function t1_decoder_parse_charstrings(decoder, charstring_base, charstring_len)
{
    var builder = decoder.builder;
    var x, y, orig_x, orig_y;
    var known_othersubr_result_cnt   = 0;
    var unknown_othersubr_result_cnt = 0;
    var large_int = 0;

    /* compute random seed from stack address of parameter */
    var seed = parseInt(Math.random() * 0xFFFF);
    if (seed == 0)
        seed = 0x7384;

    /* First of all, initialize the decoder */
    decoder.top  = 0;
    decoder.zone = 0;
    var zone  = 0;
    var zones = decoder.zones;

    builder.parse_state = FT_Common.T1_Parse_Start;

    var hinter = builder.hints_funcs;

    /* a font that reads BuildCharArray without setting */
    /* its values first is buggy, but ...               */
    if (decoder.buildchar != null && decoder.len_buildchar > 0)
    {
        for (var i = 0; i < decoder.len_buildchar; i++)
        {
            decoder.buildchar[i] = 0;
        }
    }

    zones[zone].base = dublicate_pointer(charstring_base);
    zones[zone].limit  = charstring_base.pos + charstring_len;
    var limit = zones[zone].limit;

    zones[zone].cursor = 0;
    var ip = dublicate_pointer(zones[zone].base);

    var error = 0;

    x = orig_x = builder.pos_x;
    y = orig_y = builder.pos_y;

    /* begin hints recording session, if any */
    if (hinter != null)
        hinter.open(hinter.hints);

    large_int = 0;

    /* now, execute loop */
    while (ip.pos < limit)
    {
        var tops = decoder.stack;
        var top = decoder.top;
        var op = FT_Common.op_none;
        var value = 0;

        /*********************************************************************/
        /*                                                                   */
        /* Decode operator or operand                                        */
        /*                                                                   */
        /*                                                                   */
        /* first of all, decompress operator or value */
        var _oper = ip.data[ip.pos];
        ip.pos++;
        switch (_oper)
        {
        case 1:
            op = FT_Common.op_hstem;
            break;

        case 3:
            op = FT_Common.op_vstem;
            break;
        case 4:
            op = FT_Common.op_vmoveto;
            break;
        case 5:
            op = FT_Common.op_rlineto;
            break;
        case 6:
            op = FT_Common.op_hlineto;
            break;
        case 7:
            op = FT_Common.op_vlineto;
            break;
        case 8:
            op = FT_Common.op_rrcurveto;
            break;
        case 9:
            op = FT_Common.op_closepath;
            break;
        case 10:
            op = FT_Common.op_callsubr;
            break;
        case 11:
            op = FT_Common.op_return;
            break;

        case 13:
            op = FT_Common.op_hsbw;
            break;
        case 14:
            op = FT_Common.op_endchar;
            break;

        case 15:          /* undocumented, obsolete operator */
            op = FT_Common.op_unknown15;
            break;

        case 21:
            op = FT_Common.op_rmoveto;
            break;
        case 22:
            op = FT_Common.op_hmoveto;
            break;

        case 30:
            op = FT_Common.op_vhcurveto;
            break;
        case 31:
            op = FT_Common.op_hvcurveto;
            break;

        case 12:
            if (ip.pos > limit)
                return FT_Common.FT_Err_Syntax_Error;

            var _oper2 = ip.data[ip.pos];
            ip.pos++;
            switch (_oper2)
            {
            case 0:
                op = FT_Common.op_dotsection;
                break;
            case 1:
                op = FT_Common.op_vstem3;
                break;
            case 2:
                op = FT_Common.op_hstem3;
                break;
            case 6:
                op = FT_Common.op_seac;
                break;
            case 7:
                op = FT_Common.op_sbw;
                break;
            case 12:
                op = FT_Common.op_div;
                break;
            case 16:
                op = FT_Common.op_callothersubr;
                break;
            case 17:
                op = FT_Common.op_pop;
                break;
            case 33:
                op = FT_Common.op_setcurrentpoint;
                break;

            default:
                return FT_Common.FT_Err_Syntax_Error;
            }
            break;

        case 255:    /* four bytes integer */
            if (ip.pos + 4 > limit)
            {
                return FT_Common.FT_Err_Syntax_Error;
            }

            value = ((ip.data[ip.pos] << 24) | (ip.data[ip.pos + 1] << 16) | (ip.data[ip.pos + 2] << 8) |  (ip.data[ip.pos + 3]));
            ip.pos += 4;

            /* According to the specification, values > 32000 or < -32000 must */
            /* be followed by a `div' operator to make the result be in the    */
            /* range [-32000;32000].  We expect that the second argument of    */
            /* `div' is not a large number.  Additionally, we don't handle     */
            /* stuff like `<large1> <large2> <num> div <num> div' or           */
            /* <large1> <large2> <num> div div'.  This is probably not allowed */
            /* anyway.                                                         */
            if (value > 32000 || value < -32000)
            {
                if (large_int)
                {
                }
                else
                    large_int = 1;
            }
            else
            {
                if (!large_int)
                    value <<= 16;
            }

            break;

        default:
            if (ip.data[ip.pos - 1] >= 32)
            {
                if (ip.data[ip.pos - 1] < 247)
                    value = ip.data[ip.pos - 1] - 139;
                else
                {
                    ip.pos++;
                    if (ip.pos > limit)
                    {
                        return FT_Common.FT_Err_Syntax_Error;
                    }

                    if (ip.data[ip.pos - 2] < 251)
                        value =  ((ip.data[ip.pos - 2] - 247) << 8) + ip.data[ip.pos - 1] + 108;
                    else
                        value = -(((ip.data[ip.pos - 2] - 251) << 8) + ip.data[ip.pos - 1] + 108);
                }

                if (!large_int)
                    value <<= 16;
            }
            else
            {
                return FT_Common.FT_Err_Syntax_Error;
            }
        }

        if (unknown_othersubr_result_cnt > 0)
        {
            switch (op)
            {
                case FT_Common.op_callsubr:
                case FT_Common.op_return:
                case FT_Common.op_none:
                case FT_Common.op_pop:
                    break;

                default:
                    /* all operands have been transferred by previous pops */
                    unknown_othersubr_result_cnt = 0;
                    break;
            }
        }

        if ( large_int && !(op == FT_Common.op_none || op == FT_Common.op_div))
        {
            large_int = 0;
        }

        /*********************************************************************/
        /*                                                                   */
        /*  Push value on stack, or process operator                         */
        /*                                                                   */
        /*                                                                   */
        if (op == FT_Common.op_none)
        {
            if (top >= FT_Common.T1_MAX_CHARSTRINGS_OPERANDS)
            {
                return FT_Common.FT_Err_Syntax_Error;
            }

            tops[top] = value;
            top++;
            decoder.top = top;
        }
        else if ( op == FT_Common.op_callothersubr )  /* callothersubr */
        {
            if (top < 2)
                return FT_Common.FT_Err_Stack_Overflow;

            top -= 2;

            var subr_no = (tops[top + 1] >> 16) & 0xFFFF;
            var arg_cnt = (tops[top] >> 16) & 0xFFFF;

            /***********************************************************/
            /*                                                         */
            /* remove all operands to callothersubr from the stack     */
            /*                                                         */
            /* for handled othersubrs, where we know the number of     */
            /* arguments, we increase the stack by the value of        */
            /* known_othersubr_result_cnt                              */
            /*                                                         */
            /* for unhandled othersubrs the following pops adjust the  */
            /* stack pointer as necessary                              */

            if (arg_cnt > top)
                return FT_Common.FT_Err_Stack_Overflow;

            top -= arg_cnt;

            known_othersubr_result_cnt   = 0;
            unknown_othersubr_result_cnt = 0;

            /* XXX TODO: The checks to `arg_count == <whatever>'       */
            /* might not be correct; an othersubr expects a certain    */
            /* number of operands on the PostScript stack (as opposed  */
            /* to the T1 stack) but it doesn't have to put them there  */
            /* by itself; previous othersubrs might have left the      */
            /* operands there if they were not followed by an          */
            /* appropriate number of pops                              */
            /*                                                         */
            /* On the other hand, Adobe Reader 7.0.8 for Linux doesn't */
            /* accept a font that contains charstrings like            */
            /*                                                         */
            /*     100 200 2 20 callothersubr                          */
            /*     300 1 20 callothersubr pop                          */
            /*                                                         */
            /* Perhaps this is the reason why BuildCharArray exists.   */

            switch (subr_no)
            {
                case 0:                     /* end flex feature */
                    if (arg_cnt != 3)
                        return FT_Common.FT_Err_Syntax_Error;

                    if (decoder.flex_state == 0 || decoder.num_flex_vectors != 7)
                    {
                        return FT_Common.FT_Err_Syntax_Error;
                    }

                    /* the two `results' are popped by the following setcurrentpoint */
                    tops[top] = x;
                    tops[top + 1] = y;
                    known_othersubr_result_cnt = 2;
                    break;

                case 1:                     /* start flex feature */
                    if (arg_cnt != 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    decoder.flex_state        = 1;
                    decoder.num_flex_vectors  = 0;

                    error = t1_builder_start_point(builder, x, y);
                    if (error != FT_Common.FT_Err_Ok)
                        return error;

                    error = t1_builder_check_points(builder, 6);
                    if (error != FT_Common.FT_Err_Ok)
                        return error;

                    break;

                case 2:                     /* add flex vectors */
                    if (arg_cnt != 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    if (decoder.flex_state == 0)
                    {
                        return FT_Common.FT_Err_Syntax_Error;
                    }

                    /* note that we should not add a point for index 0; */
                    /* this will move our current position to the flex  */
                    /* point without adding any point to the outline    */
                    var idx = decoder.num_flex_vectors;
                    decoder.num_flex_vectors++;
                    if (idx > 0 && idx < 7)
                        t1_builder_add_point(builder, x, y, (idx == 3 || idx == 6) ? 1 : 0);

                    break;

                case 3:                     /* change hints */
                    if (arg_cnt != 1)
                        return FT_Common.FT_Err_Syntax_Error;

                    known_othersubr_result_cnt = 1;

                    if (hinter)
                        hinter.reset(hinter.hints, builder.current.n_points);
                    break;

                case 12:
                case 13:
                    /* counter control hints, clear stack */
                    top = 0;
                    break;

                case 14:
                case 15:
                case 16:
                case 17:
                case 18:                    /* multiple masters */
                {
                    var blend = decoder.blend;

                    if ( !blend )
                    {
                        return FT_Common.FT_Err_Syntax_Error;
                    }

                    var num_points = subr_no - 13;
                    if (subr_no == 18)
                        num_points++;
                    if (arg_cnt != (num_points * blend.num_designs))
                    {
                        return FT_Common.FT_Err_Syntax_Error;
                    }

                    /* We want to compute                                    */
                    /*                                                       */
                    /*   a0*w0 + a1*w1 + ... + ak*wk                         */
                    /*                                                       */
                    /* but we only have a0, a1-a0, a2-a0, ..., ak-a0.        */
                    /*                                                       */
                    /* However, given that w0 + w1 + ... + wk == 1, we can   */
                    /* rewrite it easily as                                  */
                    /*                                                       */
                    /*   a0 + (a1-a0)*w1 + (a2-a0)*w2 + ... + (ak-a0)*wk     */
                    /*                                                       */
                    /* where k == num_designs-1.                             */
                    /*                                                       */
                    /* I guess that's why it's written in this `compact'     */
                    /* form.                                                 */
                    /*                                                       */
                    var delta  = top + num_points;
                    var values = top;
                    for (var nn = 0; nn < num_points; nn++)
                    {
                        var tmp = tops[values];

                        for (var mm = 1; mm < blend.num_designs; mm++)
                            tmp += FT_MulFix(tops[delta++], blend.weight_vector[mm]);

                        tops[values++] = tmp;
                    }

                    known_othersubr_result_cnt = num_points;
                    break;
                }

                case 19:
                    /* <idx> 1 19 callothersubr                             */
                    /* => replace elements starting from index cvi( <idx> ) */
                    /*    of BuildCharArray with WeightVector               */
                    var blend = decoder.blend;

                    if (arg_cnt != 1 || blend == null)
                        return FT_Common.FT_Err_Syntax_Error;

                    var idx = (tops[top] >> 16) & 0xFFFF;

                    if (idx < 0 || (idx + blend.num_designs) > decoder.len_buildchar)
                        return FT_Common.FT_Err_Syntax_Error;

                    for (var ii = 0; ii < blend.num_designs; ii++)
                        decoder.buildchar[idx + ii] = blend.weight_vector[ii];

                    break;

                case 20:
                    /* <arg1> <arg2> 2 20 callothersubr pop   */
                    /* ==> push <arg1> + <arg2> onto T1 stack */
                    if (arg_cnt != 2)
                        return FT_Common.FT_Err_Syntax_Error;

                    tops[top] += tops[top + 1]; /* XXX (over|under)flow */

                    known_othersubr_result_cnt = 1;
                    break;

                case 21:
                    /* <arg1> <arg2> 2 21 callothersubr pop   */
                    /* ==> push <arg1> - <arg2> onto T1 stack */
                    if (arg_cnt != 2)
                        return FT_Common.FT_Err_Syntax_Error;

                    tops[top] -= tops[top + 1]; /* XXX (over|under)flow */

                    known_othersubr_result_cnt = 1;
                    break;

                case 22:
                    /* <arg1> <arg2> 2 22 callothersubr pop   */
                    /* ==> push <arg1> * <arg2> onto T1 stack */
                    if (arg_cnt != 2)
                        return FT_Common.FT_Err_Syntax_Error;

                    tops[top] = FT_MulFix(tops[top], tops[top + 1]);

                    known_othersubr_result_cnt = 1;
                    break;

                case 23:
                    /* <arg1> <arg2> 2 23 callothersubr pop   */
                    /* ==> push <arg1> / <arg2> onto T1 stack */
                    if (arg_cnt != 2 || tops[top + 1] == 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    tops[top] = FT_DivFix(tops[top], tops[top + 1]);

                    known_othersubr_result_cnt = 1;
                    break;

                case 24:
                    /* <val> <idx> 2 24 callothersubr               */
                    /* ==> set BuildCharArray[cvi( <idx> )] = <val> */
                    var blend = decoder.blend;

                    if (arg_cnt != 2 || blend == null)
                        return FT_Common.FT_Err_Syntax_Error;

                    var idx = (tops[top + 1] >> 16) & 0xFFFF;

                    if (idx < 0 || idx >= decoder.len_buildchar)
                        return FT_Common.FT_Err_Syntax_Error;

                    decoder.buildchar[idx] = tops[top];

                    break;

                case 25:
                    /* <idx> 1 25 callothersubr pop        */
                    /* ==> push BuildCharArray[cvi( idx )] */
                    /*     onto T1 stack                   */
                    var blend = decoder.blend;

                    if (arg_cnt != 1 || blend == null)
                        return FT_Common.FT_Err_Syntax_Error;

                    idx = (tops[top] >> 16) & 0xFFFF;

                    if (idx < 0 || idx >= decoder.len_buildchar)
                        return FT_Common.FT_Err_Syntax_Error;

                    tops[top] = decoder.buildchar[idx];

                    known_othersubr_result_cnt = 1;
                    break;

                case 27:
                    /* <res1> <res2> <val1> <val2> 4 27 callothersubr pop */
                    /* ==> push <res1> onto T1 stack if <val1> <= <val2>, */
                    /*     otherwise push <res2>                          */
                    if (arg_cnt != 4)
                        return FT_Common.FT_Err_Syntax_Error;

                    if (tops[top + 2] > tops[top + 3])
                        tops[top] = tops[top + 1];

                    known_othersubr_result_cnt = 1;
                    break;

                case 28:
                    /* 0 28 callothersubr pop                               */
                    /* => push random value from interval [0, 1) onto stack */
                    if (arg_cnt != 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    var Rand = seed;
                    if (Rand >= 0x8000)
                        Rand++;

                    tops[top] = Rand;

                    seed = FT_MulFix(seed, 0x10000 - seed);
                    if (seed == 0)
                        seed += 0x2873;

                    known_othersubr_result_cnt = 1;
                    break;

                default:
                    if (arg_cnt >= 0 && subr_no >= 0)
                    {
                        unknown_othersubr_result_cnt = arg_cnt;
                        break;
                    }
                    /* fall through */

                    return FT_Common.FT_Err_Syntax_Error;
            }

            top += known_othersubr_result_cnt;
            decoder.top = top;
        }
        else  /* general operator */
        {
            var num_args = t1_args_count[op];

            if (top < num_args)
                return FT_Common.FT_Err_Stack_Overflow;

            /* XXX Operators usually take their operands from the        */
            /*     bottom of the stack, i.e., the operands are           */
            /*     decoder->stack[0], ..., decoder->stack[num_args - 1]; */
            /*     only div, callsubr, and callothersubr are different.  */
            /*     In practice it doesn't matter (?).                    */

            top -= num_args;

            switch (op)
            {
                case FT_Common.op_endchar:

                    t1_builder_close_contour(builder);

                    /* close hints recording session */
                    if (hinter != null)
                    {
                        if (hinter.close(hinter.hints, builder.current.n_points))
                            return FT_Common.FT_Err_Syntax_Error;

                        /* apply hints to the loaded glyph outline now */
                        hinter.apply(hinter.hints, builder.current, builder.hints_globals, decoder.hint_mode);
                    }

                    /* add current outline to the glyph slot */
                    FT_GlyphLoader_Add(builder.loader);

                    /* the compiler should optimize away this empty loop but ... */
                    /* return now! */
                    return 0;

                case FT_Common.op_hsbw:
                    builder.parse_state = FT_Common.T1_Parse_Have_Width;

                    builder.left_bearing.x += tops[top];
                    builder.advance.x       = tops[top + 1];
                    builder.advance.y       = 0;

                    orig_x = x = builder.pos_x + tops[top];
                    orig_y = y = builder.pos_y;

                    /* the `metrics_only' indicates that we only want to compute */
                    /* the glyph's metrics (lsb + advance width), not load the   */
                    /* rest of it; so exit immediately                           */
                    if (builder.metrics_only)
                        return 0;

                    break;

                case FT_Common.op_seac:
                    return t1operator_seac(decoder, tops[top], tops[top + 1], tops[top + 2],
                        (tops[top + 3] >> 16) & 0xFFFF, (tops[top + 4] >> 16) & 0xFFFF);

                case FT_Common.op_sbw:
                    builder.parse_state = FT_Common.T1_Parse_Have_Width;

                    builder.left_bearing.x += tops[top];
                    builder.left_bearing.y += tops[top + 1];
                    builder.advance.x       = tops[top + 2];
                    builder.advance.y       = tops[top + 3];

                    x = builder.pos_x + tops[top];
                    y = builder.pos_y + tops[top + 1];

                    /* the `metrics_only' indicates that we only want to compute */
                    /* the glyph's metrics (lsb + advance width), not load the   */
                    /* rest of it; so exit immediately                           */
                    if (builder.metrics_only)
                        return 0;

                    break;

                case FT_Common.op_closepath:
                    /* if there is no path, `closepath' is a no-op */
                    if (builder.parse_state == FT_Common.T1_Parse_Have_Path || builder.parse_state == FT_Common.T1_Parse_Have_Moveto)
                        t1_builder_close_contour(builder);

                    builder.parse_state = FT_Common.T1_Parse_Have_Width;
                    break;

                case FT_Common.op_hlineto:

                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;

                    x += tops[top];
                    error = t1_builder_add_point1(builder, x, y);
                    if (error != 0)
                        return error;

                    break;

                case FT_Common.op_hmoveto:
                    x += tops[top];
                    if (decoder.flex_state == 0)
                    {
                        if (builder.parse_state == FT_Common.T1_Parse_Start)
                            return FT_Common.FT_Err_Syntax_Error;
                        builder.parse_state = FT_Common.T1_Parse_Have_Moveto;
                    }
                    break;

                case FT_Common.op_hvcurveto:

                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;
                    error = t1_builder_check_points(builder, 3);
                    if (error != 0)
                        return error;

                    x += tops[top];
                    t1_builder_add_point(builder, x, y, 0);
                    x += tops[top + 1];
                    y += tops[top + 2];
                    t1_builder_add_point(builder, x, y, 0);
                    y += tops[top + 3];
                    t1_builder_add_point(builder, x, y, 1);
                    break;

                case FT_Common.op_rlineto:
                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;

                    x += tops[top];
                    y += tops[top + 1];

                    error = t1_builder_add_point1(builder, x, y);
                    if (error != 0)
                        return error;

                    break;

                case FT_Common.op_rmoveto:
                    x += tops[top];
                    y += tops[top + 1];
                    if (decoder.flex_state == 0)
                    {
                        if (builder.parse_state == FT_Common.T1_Parse_Start)
                            return FT_Common.FT_Err_Syntax_Error;
                        builder.parse_state = FT_Common.T1_Parse_Have_Moveto;
                    }
                    break;

                case FT_Common.op_rrcurveto:

                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;
                    error = t1_builder_check_points(builder, 3);
                    if (error != 0)
                        return error;

                    x += tops[top];
                    y += tops[top + 1];
                    t1_builder_add_point(builder, x, y, 0);

                    x += tops[top + 2];
                    y += tops[top + 3];
                    t1_builder_add_point(builder, x, y, 0);

                    x += tops[top + 4];
                    y += tops[top + 5];
                    t1_builder_add_point(builder, x, y, 1);
                    break;

                case FT_Common.op_vhcurveto:
                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;
                    error = t1_builder_check_points(builder, 3);
                    if (error != 0)
                        return error;

                    y += tops[top];
                    t1_builder_add_point(builder, x, y, 0);
                    x += tops[top + 1];
                    y += tops[top + 2];
                    t1_builder_add_point(builder, x, y, 0);
                    x += tops[top + 3];
                    t1_builder_add_point(builder, x, y, 1);
                    break;

                case FT_Common.op_vlineto:
                    error = t1_builder_start_point(builder, x, y);
                    if (error != 0)
                        return error;

                    y += tops[top];
                    error = t1_builder_add_point1(builder, x, y);
                    if (error != 0)
                        return error;
                    break;

                case FT_Common.op_vmoveto:
                    y += tops[top];
                    if (decoder.flex_state == 0)
                    {
                        if (builder.parse_state == FT_Common.T1_Parse_Start)
                            return FT_Common.FT_Err_Syntax_Error;
                        builder.parse_state = FT_Common.T1_Parse_Have_Moveto;
                    }
                    break;

                case FT_Common.op_div:
                    /* if `large_int' is set, we divide unscaled numbers; */
                    /* otherwise, we divide numbers in 16.16 format --    */
                    /* in both cases, it is the same operation            */
                    tops[top] = FT_DivFix(tops[top], tops[top + 1]);
                    ++top;

                    large_int = 0;
                    break;

                case FT_Common.op_callsubr:
                {
                    var idx = (tops[top] >> 16) & 0xFFFF;
                    if (idx < 0 || idx >= decoder.num_subrs)
                        return FT_Common.FT_Err_Syntax_Error;

                    if (zone >= FT_Common.T1_MAX_SUBRS_CALLS)
                        return FT_Common.FT_Err_Syntax_Error;

                    zones[zone].cursor = dublicate_pointer(ip);  /* save current instruction pointer */
                    zone++;

                    /* The Type 1 driver stores subroutines without the seed bytes. */
                    /* The CID driver stores subroutines with seed bytes.  This     */
                    /* case is taken care of when decoder->subrs_len == 0.          */
                    zones[zone].base = dublicate_pointer(decoder.subrs[idx]);

                    if (decoder.subrs_len != 0)
                        zones[zone].limit = zones[zone].base.pos + decoder.subrs_len[idx];
                    else
                    {
                        /* We are using subroutines from a CID font.  We must adjust */
                        /* for the seed bytes.                                       */
                        zones[zone].base.pos  += (decoder.lenIV >= 0 ? decoder.lenIV : 0);
                        zones[zone].limit = decoder.subrs[idx + 1].pos;
                    }

                    zones[zone].cursor = dublicate_pointer(zones[zone].base);

                    if (zones[zone].base == null)
                        return FT_Common.FT_Err_Syntax_Error;

                    decoder.zone = zone;
                    ip           = dublicate_pointer(zones[zone].base);
                    limit        = zones[zone].limit;
                    break;
                }

                case FT_Common.op_pop:

                    if (known_othersubr_result_cnt > 0)
                    {
                        known_othersubr_result_cnt--;
                        /* ignore, we pushed the operands ourselves */
                        break;
                    }

                    if (unknown_othersubr_result_cnt == 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    unknown_othersubr_result_cnt--;
                    top++;   /* `push' the operand to callothersubr onto the stack */
                    break;

                case FT_Common.op_return:

                    if (zone <= 0)
                        return FT_Common.FT_Err_Syntax_Error;

                    zone--;
                    ip           = dublicate_pointer(zones[zone].cursor);
                    limit        = zones[zone].limit;
                    decoder.zone = zone;
                    break;

                case FT_Common.op_dotsection:
                    break;

                case FT_Common.op_hstem:
                    /* record horizontal hint */
                    if (hinter != null)
                    {
                        /* tops[0] += builder->left_bearing.y; */
                        hinter.stem(hinter.hints, 1, tops, top);
                    }
                    break;

                case FT_Common.op_hstem3:
                    /* record horizontal counter-controlled hints */
                    if (hinter != null)
                        hinter.stem3(hinter.hints, 1, tops, top);
                    break;

                case FT_Common.op_vstem:
                    /* record vertical hint */
                    if (hinter != null)
                    {
                        tops[top] += orig_x;
                        hinter.stem(hinter.hints, 0, tops, top);
                    }
                    break;

                case FT_Common.op_vstem3:
                    /* record vertical counter-controlled hints */
                    if (hinter != null)
                    {
                        tops[top] += orig_x;
                        tops[top + 2] += orig_x;
                        tops[top + 4] += orig_x;
                        hinter.stem3(hinter.hints, 0, tops, top);
                    }
                    break;

                case FT_Common.op_setcurrentpoint:
                    /* From the T1 specification, section 6.4:                */
                    /*                                                        */
                    /*   The setcurrentpoint command is used only in          */
                    /*   conjunction with results from OtherSubrs procedures. */

                    /* known_othersubr_result_cnt != 0 is already handled     */
                    /* above.                                                 */

                    /* Note, however, that both Ghostscript and Adobe         */
                    /* Distiller handle this situation by silently ignoring   */
                    /* the inappropriate `setcurrentpoint' instruction.  So   */
                    /* we do the same.                                        */
                    x = tops[top];
                    y = tops[top + 1];
                    decoder.flex_state = 0;
                    break;

                case FT_Common.op_unknown15:
                    /* nothing to do except to pop the two arguments */
                    break;

                default:
                    return FT_Common.FT_Err_Syntax_Error;
            }

            /* XXX Operators usually clear the operand stack;  */
            /*     only div, callsubr, callothersubr, pop, and */
            /*     return are different.                       */
            /*     In practice it doesn't matter (?).          */

            decoder.top = top;

        } /* general operator processing */

    } /* while ip < limit */

    return error;
}

function t1_decoder_parse_glyph(decoder, glyph)
{
    return decoder.parse_callback(decoder, glyph);
}

function t1_decoder_init(decoder, face, size, slot, glyph_names, blend, hinting, hint_mode, parse_callback)
{
    decoder.clear();

    var psnames = FT_FACE_FIND_GLOBAL_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_CMAPS);
    if (psnames == null)
        return FT_Common.FT_Err_Unimplemented_Feature;

    decoder.psnames = psnames;

    t1_builder_init(decoder.builder, face, size, slot, hinting);

    /* decoder->buildchar and decoder->len_buildchar have to be  */
    /* initialized by the caller since we cannot know the length */
    /* of the BuildCharArray                                     */
    decoder.num_glyphs     = face.num_glyphs;
    decoder.glyph_names    = glyph_names;
    decoder.hint_mode      = hint_mode;
    decoder.blend          = blend;
    decoder.parse_callback = parse_callback;

    decoder.funcs          = t1_decoder_funcs;

    return 0;
}

function t1_decoder_done(decoder)
{
    t1_builder_done(decoder.builder);
}


/******************************************************************************/
// psaux
/******************************************************************************/
function PS_Table_FuncsRec(_init, _done, _add, _release)
{
    this.init       = _init;
    this.done       = _done;
    this.add        = _add;
    this.release    = _release;
}

function PS_TableRec()
{
    this.block = null;
    this.cursor = 0;
    this.capacity = 0;
    this.init = 0;

    this.max_elems = 0;
    this.num_elems = 0;
    this.elements = null;
    this.lengths = null;

    this.memory = null;
    this.funcs = new PS_Table_FuncsRec(null, null, null, null);

    this.clear = function()
    {
        this.block = null;
        this.cursor = 0;
        this.capacity = 0;
        this.init = 0;

        this.max_elems = 0;
        this.num_elems = 0;
        this.elements = null;
        this.lengths = null;

        this.memory = null;
        this.funcs = new PS_Table_FuncsRec(null, null, null, null);
    }
}

function T1_TokenRec()
{
    this.start = new CPointer();
    this.limit = 0;
    this.type = 0;
}

function T1_FieldRec()
{
    this.ident = "";
    this.location = 0;
    this.type = 0;
    this.reader = null;
    this.offset = 0; // у нас это просто индекс члена класса. А не сдвиг в памяти
    this.size = 0;
    this.array_max = 0;

    this.count_offset = 0;
    this.dict = 0;

    this.set_field = null;
    this.set_field_count = null;
}

function create_dublicate_t1_field(_field)
{
    var ret = new T1_FieldRec();

    ret.ident = _field.ident;
    ret.location = _field.location;
    ret.type = _field.type;
    ret.reader = _field.reader;
    ret.offset = _field.offset; // у нас это просто индекс в МАССИВЕ (т.е. для не массива это поле не нужно)
    ret.size = _field.size;     // не пользуем (на будущее оставим)
    ret.array_max = _field.array_max;

    ret.count_offset = _field.count_offset;
    ret.dict = _field.dict;

    ret.set_field = _field.set_field;
    ret.set_field_count = _field.set_field_count;

    return ret;
}

function fire_t1_field(obj, val, f)
{
    f.set_field(obj, val, f);
}
function fire_t1_field_count(obj, val, f)
{
    f.set_field_count(obj, val, f);
}

function create_t1_field(_ident, _location, _type, _reader, _offset, _size, _array_max, _count_offset, _dict, func_set_field, func_set_field_count)
{
    var ret = new T1_FieldRec();
    ret.ident = _ident;
    ret.location = _location;
    ret.type = _type;
    ret.reader = _reader;
    ret.offset = _offset;
    ret.size = _size;
    ret.array_max = _array_max;
    ret.count_offset = _count_offset;
    ret.dict = _dict;

    ret.set_field = func_set_field;
    ret.set_field_count = func_set_field_count;

    return ret;
}
function create_t1_field2(_ident, _location, _type, func_set_field, func_set_field_count)
{
    var ret = new T1_FieldRec();
    ret.ident = _ident;
    ret.location = _location;
    ret.type = _type;

    ret.set_field = func_set_field;
    ret.set_field_count = func_set_field_count;

    return ret;
}
function create_t1_field4(_ident, _location, _type, _dict, func_set_field, func_set_field_count)
{
    var ret = new T1_FieldRec();
    ret.ident = _ident;
    ret.location = _location;
    ret.type = _type;
    ret.dict = _dict;

    ret.set_field = func_set_field;
    ret.set_field_count = func_set_field_count;

    return ret;
}
function create_t1_field3(_ident, _location, _type, _max, func_set_field, func_set_field_count)
{
    var ret = new T1_FieldRec();
    ret.ident = _ident;
    ret.location = _location;
    ret.type = _type;
    ret.array_max = _max;

    ret.set_field = func_set_field;
    ret.set_field_count = func_set_field_count;

    return ret;
}
function create_t1_field5(_ident, _location, _type, _max, _dict, func_set_field, func_set_field_count)
{
    var ret = new T1_FieldRec();
    ret.ident = _ident;
    ret.location = _location;
    ret.type = _type;
    ret.array_max = _max;
    ret.dict = _dict;

    ret.set_field = func_set_field;
    ret.set_field_count = func_set_field_count;

    return ret;
}

function PS_Parser_FuncsRec(_init,_done,_skip_spaces,_skip_PS_token,_to_int,_to_fixed,_to_bytes,_to_coord_array,_to_fixed_array,
                            _to_token,_to_token_array,_load_field,_load_field_table)
{
    this.init = _init;
    this.done = _done;

    this.skip_spaces    = _skip_spaces;
    this.skip_PS_token  = _skip_PS_token;

    this.to_int         = _to_int;
    this.to_fixed       = _to_fixed;
    this.to_bytes       = _to_bytes;
    this.to_coord_array = _to_coord_array;
    this.to_fixed_array = _to_fixed_array;
    this.to_token       = _to_token;
    this.to_token_array = _to_token_array;
    this.load_field     = _load_field;
    this.load_field_table = _load_field_table;
}

function T1_Builder_FuncsRec(_init,_done,_check_points,_add_point,_add_point1,_add_contour,_start_point,_close_contour)
{
    this.init = _init;
    this.done = _done;

    this.check_points   = _check_points;
    this.add_point      = _add_point;
    this.add_point1     = _add_point1;
    this.add_contour    = _add_contour;
    this.start_point    = _start_point;
    this.close_contour  = _close_contour;
}

function PS_ParserRec()
{
    this.cursor = 0;
    this.base = null;
    this.limit = 0;
    this.error = 0;
    this.memory = null;

    this.funcs = null;

    this.clear = function()
    {
        this.cursor = 0;
        this.base = null;
        this.limit = 0;
        this.error = 0;
        this.memory = null;

        this.funcs = null;
    }
}

function T1_BuilderRec()
{
    this.memory = null;
    this.face = null;
    this.glyph = null;
    this.loader = null;
    this.base = null;
    this.current = null;

    this.pos_x = 0;
    this.pos_y = 0;

    this.left_bearing = new FT_Vector();
    this.advance = new FT_Vector();

    this.bbox = new FT_BBox();
    this.parse_state = 0;
    this.load_points = 0;
    this.no_recurse = 0;

    this.metrics_only = 0;

    this.hints_funcs = null;
    this.hints_globals = null;

    this.funcs = null;

    this.clear = function()
    {
        this.memory = null;
        this.face = null;
        this.glyph = null;
        this.loader = null;
        this.base = null;
        this.current = null;

        this.pos_x = 0;
        this.pos_y = 0;

        this.left_bearing.x = 0;
        this.left_bearing.y = 0;
        this.advance.x = 0;
        this.advance.y = 0;

        this.bbox.xMin = 0;
        this.bbox.yMin = 0;
        this.bbox.xMax = 0;
        this.bbox.yMax = 0;

        this.parse_state = 0;
        this.load_points = 0;
        this.no_recurse = 0;

        this.metrics_only = 0;

        this.hints_funcs = null;
        this.hints_globals = null;

        this.funcs = null;
    }
}

function T1_Decoder_ZoneRec()
{
    this.cursor = 0;
    this.base = null;
    this.limit = 0;
}

function T1_Decoder_FuncsRec(_init, _done, _parse_charstrings)
{
    this.init = _init;
    this.done = _done;
    this.parse_charstrings = _parse_charstrings;
}

function T1_DecoderRec()
{
    this.builder = new T1_BuilderRec();

    this.stack = CreateIntArray(FT_Common.T1_MAX_CHARSTRINGS_OPERANDS);
    this.top = 0;

    this.zones = new Array(FT_Common.T1_MAX_SUBRS_CALLS + 1);
    for (var i = 0; i <= FT_Common.T1_MAX_SUBRS_CALLS; i++)
        this.zones[i] = new T1_Decoder_ZoneRec();

    this.zone = 0;

    this.psnames = null;
    this.num_glyphs = 0;
    this.glyph_names = null;

    this.lenIV = 0;
    this.num_subrs = 0;
    this.subrs = null;
    this.subrs_len = null;

    this.font_matrix = new FT_Matrix();
    this.font_offset = new FT_Vector();

    this.flex_state = 0;
    this.num_flex_vectors = 0;
    this.flex_vectors = new Array(7);
    for (var i = 0; i < 7; i++)
        this.flex_vectors[i] = new FT_Vector();

    this.blend = null;

    this.hint_mode = 0;

    this.parse_callback = null;
    this.funcs = null;

    this.buildchar = null;
    this.len_buildchar = 0;

    this.seac = 0;

    this.clear = function()
    {
        this.builder.clear();

        for (var i = 0; i < FT_Common.T1_MAX_CHARSTRINGS_OPERANDS; i++)
            this.stack[i] = 0;

        this.top = 0;

        for (var i = 0; i <= FT_Common.T1_MAX_SUBRS_CALLS; i++)
        {
            var _z = this.zones[i];
            _z.base = null;
            _z.cursor = 0;
            _z.limit = 0;
        }
        this.zone = 0;

        this.psnames = null;
        this.num_glyphs = 0;
        this.glyph_names = null;

        this.lenIV = 0;
        this.num_subrs = 0;
        this.subrs = null;
        this.subrs_len = null;

        this.font_matrix.xx = 0;
        this.font_matrix.xy = 0;
        this.font_matrix.yx = 0;
        this.font_matrix.yy = 0;

        this.font_offset.x = 0;
        this.font_offset.y = 0;

        this.flex_state = 0;
        this.num_flex_vectors = 0;
        for (var i = 0; i < 7; i++)
        {
            this.flex_vectors[i].x = 0;
            this.flex_vectors[i].y = 0;
        }

        this.blend = null;

        this.hint_mode = 0;

        this.parse_callback = null;
        this.funcs = null;

        this.buildchar = null;
        this.len_buildchar = 0;

        this.seac = 0;
    }
}

var ps_table_funcs = {
    init : ps_table_new,
    done : ps_table_done,
    add : ps_table_add,
    release : ps_table_release
};

var ps_parser_funcs = {
    init : ps_parser_init,
    done : ps_parser_done,
    skip_spaces : ps_parser_skip_spaces,
    skip_PS_token : ps_parser_skip_PS_token,
    to_int : ps_parser_to_int,
    to_fixed : ps_parser_to_fixed,
    to_bytes : ps_parser_to_bytes,
    to_coord_array : ps_parser_to_coord_array,
    to_fixed_array : ps_parser_to_fixed_array,
    to_token : ps_parser_to_token,
    to_token_array : ps_parser_to_token_array,
    load_field : ps_parser_load_field,
    load_field_table : ps_parser_load_field_table
};

var t1_builder_funcs = {
    init : t1_builder_init,
    done : t1_builder_done,
    check_points : t1_builder_check_points,
    add_point : t1_builder_add_point,
    add_point1 : t1_builder_add_point1,
    add_contour : t1_builder_add_contour,
    start_point : t1_builder_start_point,
    close_contour : t1_builder_close_contour
};

var t1_decoder_funcs = {
    init : t1_decoder_init,
    done : t1_decoder_done,
    parse_charstrings : t1_decoder_parse_charstrings
};

var afm_parser_funcs = {
    init : afm_parser_init,
    done : afm_parser_done,
    parse : afm_parser_parse
};

var t1_cmap_classes = {
    standard : t1_cmap_standard_class_rec,
    expert : t1_cmap_expert_class_rec,
    custom : t1_cmap_custom_class_rec,
    unicode : t1_cmap_unicode_class_rec
};

function PSAux_ServiceRec()
{
    this.ps_table_funcs = null;
    this.ps_parser_funcs = null;
    this.t1_builder_funcs = null;
    this.t1_decoder_funcs = null;

    this.t1_decrypt = null;

    this.t1_cmap_classes = null;

    this.afm_parser_funcs = null;
}

function create_psaux_interface(_table_funcs,_parser_funcs,_builder_funcs,_decoder_funcs,_decrypt,_cmap_classes,_afm_parser_funcs)
{
    var ret = new PSAux_ServiceRec();

    ret.ps_table_funcs = _table_funcs;
    ret.ps_parser_funcs = _parser_funcs;
    ret.t1_builder_funcs = _builder_funcs;
    ret.t1_decoder_funcs = _decoder_funcs;
    ret.t1_decrypt = _decrypt;
    ret.t1_cmap_classes = _cmap_classes;
    ret.afm_parser_funcs = _afm_parser_funcs;

    return ret;
}
var psaux_interface = create_psaux_interface(ps_table_funcs,ps_parser_funcs,t1_builder_funcs,t1_decoder_funcs, t1_decrypt, t1_cmap_classes, afm_parser_funcs);

function create_psaux_module(library)
{
    var psaux_mod = new FT_Module();
    psaux_mod.clazz = new FT_Module_Class();

    var clazz = psaux_mod.clazz;
    clazz.flags = 0;
    clazz.name = "psaux";
    clazz.version = 0x20000;
    clazz.requires = 0x20000;

    clazz.module_interface = psaux_interface;
    clazz.init = null;
    clazz.done = null;

    clazz.get_interface = null;

    psaux_mod.library = library;
    psaux_mod.memory = library.Memory;
    psaux_mod.generic = null;

    return psaux_mod;
}
