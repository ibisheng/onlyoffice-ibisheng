/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
// cfftypes
/******************************************************************************/
function CFF_IndexRec()
{
    this.stream = null;
    this.start = 0;
    this.count = 0;
    this.off_size = 0;
    this.data_offset = 0;
    this.data_size = 0;

    this.offsets = null;
    this.bytes = null;

    this.clear = function()
    {
        this.stream = null;
        this.start = 0;
        this.count = 0;
        this.off_size = 0;
        this.data_offset = 0;
        this.data_size = 0;

        this.offsets = null;
        this.bytes = null;
    }
}

function CFF_EncodingRec()
{
    this.format = 0;
    this.offset = 0;

    this.count = 0;
    this.sids = CreateIntArray(256);
    this.codes = CreateIntArray(256);
}

function CFF_CharsetRec()
{
    this.format = 0;
    this.offset = 0;

    this.sids = null;
    this.cids = null;

    this.max_cid = 0;
    this.num_glyphs = 0;
}

function CFF_FontRecDictRec()
{
    this.version = 0;
    this.notice = 0;
    this.copyright = 0;
    this.full_name = 0;
    this.family_name = 0;
    this.weight = 0;
    this.is_fixed_pitch = 0;
    this.italic_angle = 0;
    this.underline_position = 0;
    this.underline_thickness = 0;
    this.paint_type = 0;
    this.charstring_type = 0;
    this.font_matrix = new FT_Matrix();
    this.has_font_matrix = 0;
    this.units_per_em = 0;
    this.font_offset = new FT_Vector();
    this.unique_id = 0;
    this.font_bbox = new FT_BBox();
    this.stroke_width = 0;
    this.charset_offset = 0;
    this.encoding_offset = 0;
    this.charstrings_offset = 0;
    this.private_offset = 0;
    this.private_size = 0;
    this.synthetic_base = 0;
    this.embedded_postscript = 0;

    this.cid_registry = 0;
    this.cid_ordering = 0;
    this.cid_supplement = 0;

    this.cid_font_version = 0;
    this.cid_font_revision = 0;
    this.cid_font_type = 0;
    this.cid_count = 0;
    this.cid_uid_base = 0;
    this.cid_fd_array_offset = 0;
    this.cid_fd_select_offset = 0;
    this.cid_font_name = 0;

    this.clear = function()
    {
        this.version = 0;
        this.notice = 0;
        this.copyright = 0;
        this.full_name = 0;
        this.family_name = 0;
        this.weight = 0;
        this.is_fixed_pitch = 0;
        this.italic_angle = 0;
        this.underline_position = 0;
        this.underline_thickness = 0;
        this.paint_type = 0;
        this.charstring_type = 0;

        this.font_matrix.xx = 0;
        this.font_matrix.xy = 0;
        this.font_matrix.yx = 0;
        this.font_matrix.yy = 0;

        this.has_font_matrix = 0;
        this.units_per_em = 0;

        this.font_offset.x = 0;
        this.font_offset.y = 0;

        this.unique_id = 0;

        this.font_bbox.xMin = 0;
        this.font_bbox.yMin = 0;
        this.font_bbox.xMax = 0;
        this.font_bbox.yMax = 0;

        this.stroke_width = 0;
        this.charset_offset = 0;
        this.encoding_offset = 0;
        this.charstrings_offset = 0;
        this.private_offset = 0;
        this.private_size = 0;
        this.synthetic_base = 0;
        this.embedded_postscript = 0;

        this.cid_registry = 0;
        this.cid_ordering = 0;
        this.cid_supplement = 0;

        this.cid_font_version = 0;
        this.cid_font_revision = 0;
        this.cid_font_type = 0;
        this.cid_count = 0;
        this.cid_uid_base = 0;
        this.cid_fd_array_offset = 0;
        this.cid_fd_select_offset = 0;
        this.cid_font_name = 0;
    }
}

function CFF_PrivateRec()
{
    this.num_blue_values = 0;
    this.num_other_blues = 0;
    this.num_family_blues = 0;
    this.num_family_other_blues = 0;

    this.blue_values = CreateIntArray(14);
    this.other_blues = CreateIntArray(10);
    this.family_blues = CreateIntArray(14);
    this.family_other_blues = CreateIntArray(10);

    this.blue_scale = 0;
    this.blue_shift = 0;
    this.blue_fuzz = 0;
    this.standard_width = 0;
    this.standard_height = 0;

    this.num_snap_widths = 0;
    this.num_snap_heights = 0;
    this.snap_widths = CreateIntArray(13);
    this.snap_heights = CreateIntArray(13);
    this.force_bold = 0;
    this.force_bold_threshold = 0;
    this.lenIV = 0;
    this.language_group = 0;
    this.expansion_factor = 0;
    this.initial_random_seed = 0;
    this.local_subrs_offset = 0;
    this.default_width = 0;
    this.nominal_width = 0;

    this.clear = function()
    {
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
        this.standard_width = 0;
        this.standard_height = 0;

        this.num_snap_widths = 0;
        this.num_snap_heights = 0;

        for (var i = 0; i < 13; i++)
            this.snap_widths[i] = 0;
        for (var i = 0; i < 13; i++)
            this.snap_heights[i] = 0;

        this.force_bold = 0;
        this.force_bold_threshold = 0;
        this.lenIV = 0;
        this.language_group = 0;
        this.expansion_factor = 0;
        this.initial_random_seed = 0;
        this.local_subrs_offset = 0;
        this.default_width = 0;
        this.nominal_width = 0;
    }
}

function CFF_FDSelectRec()
{
    this.format = 0;
    this.range_count = 0;

    /* that's the table, taken from the file `as is' */
    this.data = null;
    this.data_size = 0;

    /* small cache for format 3 only */
    this.cache_first = 0;
    this.cache_count = 0;
    this.cache_fd = 0;
}

/* A SubFont packs a font dict and a private dict together.  They are */
/* needed to support CID-keyed CFF fonts.                             */
function CFF_SubFontRec()
{
    this.font_dict = new CFF_FontRecDictRec();
    this.private_dict = new CFF_PrivateRec();

    this.local_subrs_index = new CFF_IndexRec();
    this.local_subrs = []; /* array of pointers into Local Subrs INDEX data */
}

function CFF_FontRec()
{
    this.stream = null;
    this.memory = null;
    this.num_faces = 0;
    this.num_glyphs = 0;

    this.version_major = 0;
    this.version_minor = 0;
    this.header_size = 0;
    this.absolute_offsize = 0;


    this.name_index = new CFF_IndexRec();
    this.top_dict_index = new CFF_IndexRec();
    this.global_subrs_index = new CFF_IndexRec();

    this.encoding = new CFF_EncodingRec();
    this.charset = new CFF_CharsetRec();

    this.charstrings_index = new CFF_IndexRec();
    this.font_dict_index = new CFF_IndexRec();
    this.private_index = new CFF_IndexRec();
    this.local_subrs_index = new CFF_IndexRec();

    this.font_name = "";

    /* array of pointers into Global Subrs INDEX data */
    this.global_subrs = [];

    /* array of pointers into String INDEX data stored at string_pool */
    this.num_strings = 0;
    this.strings = null;
    this.string_pool = null;

    this.top_font = new CFF_SubFontRec();
    this.num_subfonts = 0;
    this.subfonts = new Array(FT_Common.CFF_MAX_CID_FONTS);
    for (var i = 0; i < FT_Common.CFF_MAX_CID_FONTS; i++)
        this.subfonts[i] = null;

    this.fd_select = new CFF_FDSelectRec();

    /* interface to PostScript hinter */
    this.pshinter = null;

    /* interface to Postscript Names service */
    this.psnames = null;

    /* since version 2.3.0 */
    this.font_info = null;   /* font info dictionary */

    /* since version 2.3.6 */
    this.registry = "";
    this.ordering = "";
}

function CFF_ParserRec()
{
    this.library = null;
    this.start = null;
    this.limit = 0;
    this.cursor = null;

    this.stack = new Array(FT_Common.CFF_MAX_STACK_DEPTH + 1);
    this.top = 0;

    this.object_code = 0;
    this.object = 0;

    this.clear = function()
    {
        this.library = null;
        this.start = null;
        this.limit = 0;
        this.cursor = null;

        for (var i = 0; i < (FT_Common.CFF_MAX_STACK_DEPTH + 1); i++)
            this.stack[i] = 0;
        this.top = 0;

        this.object_code = 0;
        this.object = 0;
    }
}

function CFF_Field_Handler()
{
    this.kind = 0;
    this.code = 0;
    this.offset = 0;
    this.size = 0;
    this.reader = null;
    this.array_max = 0;
    this.count_offset = 0;

    this.set_field = null;
    this.set_field_count = null;
}

function create_cff_field(_kind, _code, _reader, _array_max, _set_field, _set_field_count)
{
    var ret = new CFF_Field_Handler();
    ret.kind = _kind;
    ret.code = _code;
    ret.offset = 0;
    ret.size = 0;
    ret.reader = _reader;
    ret.array_max = _array_max;
    ret.count_offset = 0;

    ret.set_field = _set_field;
    ret.set_field_count = _set_field_count;

    return ret;
}
/******************************************************************************/
// cffparse
/******************************************************************************/
function cff_parser_init(parser, code, object, library)
{
    parser.clear();
    
    parser.top = 0;
    parser.object_code = code;
    parser.object = object;
    parser.library = library;
}

function cff_parse_integer(start, limit)
{
    var p = dublicate_pointer(start);
    var v   = p.data[p.pos];
    p.pos++;
    var val = 0;

    if (v == 28)
    {
        if (p.pos + 2 > limit)
            return 0;

        val = FT_Common.UShort_To_Short((p.data[p.pos] << 8) | p.data[p.pos + 1]);
        p.pos += 2;
    }
    else if ( v == 29 )
    {
        if (p.pos + 4 > limit)
            return 0;

        val = (p.data[p.pos] << 24) | (p.data[p.pos + 1] << 16) | (p.data[p.pos + 2] << 8) | p.data[p.pos + 3];
        p.pos += 4;
    }
    else if (v < 247)
    {
        val = v - 139;
    }
    else if (v < 251)
    {
        if (p.pos + 1 > limit)
            return 0;

        val = (v - 247) * 256 + p.data[p.pos] + 108;
        p.pos++;
    }
    else
    {
        if (p + 1 > limit)
            return 0;

        val = -(v - 251) * 256 - p.data[p.pos] - 108;
        p.pos++;
    }
    return val;
}

var power_tens = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];

function cff_parse_real(start, limit, power_ten, is_scaling)
{
    var scaling = 0;
    var result = 0;

    var p = dublicate_pointer(start);
    var nib = 0;
    var phase = 0;

    var sign = 0, exponent_sign = 0;

    var number   = 0;
    var exponent = 0;

    var exponent_add    = 0;
    var integer_length  = 0;
    var fraction_length = 0;

    /* First of all, read the integer part. */
    phase = 4;

    for (;;)
    {
        /* If we entered this iteration with phase == 4, we need to */
        /* read a new byte.  This also skips past the initial 0x1E. */
        if (phase)
        {
            p.pos++;

            /* Make sure we don't read past the end. */
            if (p.pos >= limit)
                return { res : result, scaling: scaling };
        }

        /* Get the nibble. */
        nib = (p.data[p.pos] >> phase) & 0xF;
        phase = 4 - phase;

        if (nib == 0xE)
            sign = 1;
        else if (nib > 9)
            break;
        else
        {
            /* Increase exponent if we can't add the digit. */
            if (number >= 0xCCCCCCC)
                exponent_add++;
            /* Skip leading zeros. */
            else if ( nib || number )
            {
                integer_length++;
                number = number * 10 + nib;
            }
        }
    }

    /* Read fraction part, if any. */
    if (nib == 0xa)
    {
        for (;;)
        {
            /* If we entered this iteration with phase == 4, we need */
            /* to read a new byte.                                   */
            if (phase)
            {
                p.pos++;

                /* Make sure we don't read past the end. */
                if (p.pos >= limit)
                    return { res : result, scaling: scaling };
            }

            /* Get the nibble. */
            nib   = (p.data[p.pos] >> phase) & 0xF;
            phase = 4 - phase;
            if (nib >= 10)
                break;

            /* Skip leading zeros if possible. */
            if (!nib && !number)
                exponent_add--;
            /* Only add digit if we don't overflow. */
            else if (number < 0xCCCCCCC && fraction_length < 9)
            {
                fraction_length++;
                number = number * 10 + nib;
            }
        }
    }

    /* Read exponent, if any. */
    if (nib == 12)
    {
        exponent_sign = 1;
        nib           = 11;
    }

    if (nib == 11)
    {
        for (;;)
        {
            /* If we entered this iteration with phase == 4, */
            /* we need to read a new byte.                   */
            if (phase)
            {
                p.pos++;

                /* Make sure we don't read past the end. */
                if (p.pos >= limit)
                    return { res : result, scaling: scaling };
            }

            /* Get the nibble. */
            nib   = (p.data[p.pos] >> phase) & 0xF;
            phase = 4 - phase;
            if (nib >= 10)
                break;

            exponent = exponent * 10 + nib;

            /* Arbitrarily limit exponent. */
            if (exponent > 1000)
                return { res : result, scaling: scaling };
        }

        if (exponent_sign)
            exponent = -exponent;
    }

    /* We don't check `power_ten' and `exponent_add'. */
    exponent += power_ten + exponent_add;

    if (is_scaling != 0)
    {
        /* Only use `fraction_length'. */
        fraction_length += integer_length;
        exponent        += integer_length;

        if (fraction_length <= 5)
        {
            if (number > 0x7FFF)
            {
                result  = FT_DivFix(number, 10);
                scaling = exponent - fraction_length + 1;
            }
            else
            {
                if (exponent > 0)
                {
                    /* Make `scaling' as small as possible. */
                    var new_fraction_length = Math.min(exponent, 5);
                    exponent -= new_fraction_length;
                    var shift = new_fraction_length - fraction_length;

                    number *= power_tens[shift];
                    if (number > 0x7FFF)
                    {
                        number /= 10;
                        exponent += 1;
                    }
                }
                else
                    exponent -= fraction_length;

                result = number << 16;
                scaling = exponent;
            }
        }
        else
        {
            if ((number / power_tens[fraction_length - 5]) > 0x7FFF)
            {
                result = FT_DivFix(number, power_tens[fraction_length - 4]);
                scaling = exponent - 4;
            }
            else
            {
                result = FT_DivFix(number, power_tens[fraction_length - 5]);
                scaling = exponent - 5;
            }
        }
    }
    else
    {
        integer_length  += exponent;
        fraction_length -= exponent;

        /* Check for overflow and underflow. */
        if (Math.abs(integer_length) > 5)
            return { res : result, scaling: scaling };

        /* Remove non-significant digits. */
        if (integer_length < 0)
        {
            number /= power_tens[-integer_length];
            fraction_length += integer_length;
        }

        /* this can only happen if exponent was non-zero */
        if (fraction_length == 10)
        {
            number /= 10;
            fraction_length -= 1;
        }

        /* Convert into 16.16 format. */
        if (fraction_length > 0)
        {
            if ((number / power_tens[fraction_length]) > 0x7FFF)
                return { res : result, scaling: scaling };

            result = FT_DivFix(number, power_tens[fraction_length]);
        }
        else
        {
            number *= power_tens[-fraction_length];

            if (number > 0x7FFF)
                return { res : result, scaling: scaling };

            result = number << 16;
        }
    }

    if (sign)
        result = -result;

    return { res : result, scaling: scaling };
}

function cff_parse_num(d, start)
{
    var _d0 = d[start];
    var _d1 = d[start + 1];
    if (_d0.data[_d0.pos] == 30)
        return cff_parse_real(_d0, _d1.pos, 0, false).res >> 16;
    return cff_parse_integer(_d0, _d1.pos);
}

function cff_parse_fixed(d, start)
{
    var _d0 = d[start];
    var _d1 = d[start + 1];
    if (_d0.data[_d0.pos] == 30)
        return cff_parse_real(_d0, _d1.pos, 0, false).res;
    return cff_parse_integer(_d0, _d1.pos) << 16;
}

function cff_parse_fixed_scaled(d, start, scaling)
{
    var _d0 = d[start];
    var _d1 = d[start + 1];
    if (_d0.data[_d0.pos] == 30)
        return cff_parse_real(_d0, _d1.pos, scaling, false).res;

    return (cff_parse_integer(_d0, _d1.pos) * power_tens[scaling]) << 16;
}

function cff_parse_fixed_dynamic(d, start)
{
    var _d0 = d[start];
    var _d1 = d[start + 1];
    if (_d0.data[_d0.pos] == 30)
        return cff_parse_real(_d0, _d1.pos, 0, true);

    var integer_length = 0;
    var number = cff_parse_integer(_d0, _d1.pos);

    var scaling = 0;
    if (number > 0x7FFF)
    {
        for (integer_length = 5; integer_length < 10; integer_length++)
            if (number < power_tens[integer_length])
                break;

        if ((number / power_tens[integer_length - 5]) > 0x7FFF)
        {
            scaling = integer_length - 4;
            var result = FT_DivFix(number, power_tens[integer_length - 4]);
            return { res : result, scaling: scaling };
        }
        else
        {
            scaling = integer_length - 5;
            var result = FT_DivFix(number, power_tens[integer_length - 5]);
            return { res : result, scaling: scaling };
        }
    }
    else
    {
        return { res : number << 16, scaling: 0 };
    }
}

function cff_parse_font_matrix(parser)
{
    var dict = parser.object;
    var matrix = dict.font_matrix;
    var offset = dict.font_offset;
    //FT_ULong*        upm    = &dict.units_per_em;
    var data = parser.stack;
    var start = 0;
    var error = FT_Common.FT_Err_Stack_Underflow;

    if (parser.top >= 6)
    {
        var scaling = 0;
        error = FT_Common.FT_Err_Ok;

        dict.has_font_matrix = 1;
        /* We expect a well-formed font matrix, this is, the matrix elements */
        /* `xx' and `yy' are of approximately the same magnitude.  To avoid  */
        /* loss of precision, we use the magnitude of element `xx' to scale  */
        /* all other elements.  The scaling factor is then contained in the  */
        /* `units_per_em' value.                                             */

        var ret = cff_parse_fixed_dynamic(data, start++);
        scaling = ret.scaling;
        matrix.xx = ret.res;

        scaling = -scaling;
        if (scaling < 0 || scaling > 9)
        {
            /* Return default matrix in case of unlikely values. */
            matrix.xx = 0x10000;
            matrix.yx = 0;
            matrix.xy = 0;
            matrix.yy = 0x10000;
            offset.x  = 0;
            offset.y  = 0;
            dict.units_per_em = 1;

            return error;
        }

        matrix.yx = cff_parse_fixed_scaled(data, start++, scaling);
        matrix.xy = cff_parse_fixed_scaled(data, start++, scaling);
        matrix.yy = cff_parse_fixed_scaled(data, start++, scaling);
        offset.x  = cff_parse_fixed_scaled(data, start++, scaling);
        offset.y  = cff_parse_fixed_scaled(data, start, scaling);

        dict.units_per_em = power_tens[scaling];
    }

    return error;
}

function cff_parse_font_bbox(parser)
{
    var dict = parser.object;
    var bbox = dict.font_bbox;
    var data = parser.stack;

    if (parser.top >= 4)
    {
        var start = 0;

        bbox.xMin = FT_RoundFix(cff_parse_fixed(data, start++));
        bbox.yMin = FT_RoundFix(cff_parse_fixed(data, start++));
        bbox.xMax = FT_RoundFix(cff_parse_fixed(data, start++));
        bbox.yMax = FT_RoundFix(cff_parse_fixed(data, start));

        return 0;
    }
    return FT_Common.FT_Err_Stack_Underflow;
}

function cff_parse_private_dict(parser)
{
    var dict = parser.object;
    var data = parser.stack;

    if (parser.top >= 2)
    {
        dict.private_size   = cff_parse_num(data, 0);
        dict.private_offset = cff_parse_num(data, 1);

        return 0;
    }
    return FT_Common.FT_Err_Stack_Underflow;
}

function cff_parse_cid_ros(parser)
{
    var dict = parser.object;
    var data = parser.stack;

    if (parser.top >= 3)
    {
        dict.cid_registry = FT_Common.IntToUInt(cff_parse_num(data, 0));
        dict.cid_ordering = FT_Common.IntToUInt(cff_parse_num(data, 1));

        dict.cid_supplement = cff_parse_num(data, 2);
        return 0;
    }
    return FT_Common.FT_Err_Stack_Underflow;
}

function cff_parser_run(parser, start, limit)
{
    var p = dublicate_pointer(start);
    var error = 0;

    parser.top    = 0;
    parser.start  = start;
    parser.limit  = limit;
    parser.cursor = dublicate_pointer(start);

    var tops = parser.stack;
    while (p.pos < limit)
    {
        var v = p.data[p.pos];

        if (v >= 27 && v != 31)
        {
            /* it's a number; we will push its position on the stack */
            if (parser.top >= FT_Common.CFF_MAX_STACK_DEPTH)
                return FT_Common.FT_Err_Invalid_Argument;

            tops[parser.top++] = dublicate_pointer(p);

            /* now, skip it */
            if (v == 30)
            {
                /* skip real number */
                p.pos++;
                for (;;)
                {
                    /* An unterminated floating point number at the */
                    /* end of a dictionary is invalid but harmless. */
                    if (p.pos >= limit)
                        return error;
                    v = p.data[p.pos] >> 4;
                    if (v == 15)
                        break;
                    v = p.data[p.pos] & 0xF;
                    if (v == 15)
                        break;
                    p.pos++;
                }
            }
            else if (v == 28)
                p.pos += 2;
            else if (v == 29)
                p.pos += 4;
            else if (v > 246)
                p.pos += 1;
        }
        else
        {
            /* This is not a number, hence it's an operator.  Compute its code */
            /* and look for it in our current list.                            */

            var num_args = parser.top;
            var code = v;

            tops[parser.top++] = dublicate_pointer(p);
            if (v == 12)
            {
                /* two byte operator */
                p.pos++;
                if (p.pos >= limit)
                    return FT_Common.FT_Err_Invalid_Argument;

                code = 0x100 | p.data[p.pos];
            }
            code = code | parser.object_code;

            var fields = cff_field_handlers;
            for (var field_ = 0; field_ < fields.length; field_++)
            {
                var field = fields[field_];
                if (field.code == FT_Common.UintToInt(code))
                {
                    /* we found our field's handler; read it */
                    var val;

                    /* check that we have enough arguments -- except for */
                    /* delta encoded arrays, which can be empty          */
                    if (field.kind != FT_Common.cff_kind_delta && num_args < 1)
                        return FT_Common.FT_Err_Invalid_Argument;

                    switch (field.kind)
                    {
                        case FT_Common.cff_kind_bool:
                        case FT_Common.cff_kind_string:
                        case FT_Common.cff_kind_num:
                            val = cff_parse_num(parser.stack, 0);
                            fire_t1_field(parser.object, val, field);
                            break;

                        case FT_Common.cff_kind_fixed:
                            val = cff_parse_fixed(parser.stack, 0);
                            fire_t1_field(parser.object, val, field);
                            break;

                        case FT_Common.cff_kind_fixed_thousand:
                            val = cff_parse_fixed_scaled(parser.stack, 0, 3);
                            fire_t1_field(parser.object, val, field);
                            break;

                        case FT_Common.cff_kind_delta:
                            var data = parser.stack;
                            var _data_pos = 0;

                            if (num_args > field.array_max)
                                num_args = field.array_max;

                            fire_t1_field_count(parser.object, num_args, field);
                            val = 0;
                            field.offset = 0;
                            while (num_args > 0)
                            {
                                val += cff_parse_num(data, _data_pos++);
                                fire_t1_field(parser.object, val, field);
                                field.offset++;
                                num_args--;
                            }

                            break;

                        default:  /* callback */
                            error = field.reader(parser);
                            if ( error )
                                return error;
                    }

                    break;
                }
            }

            /* this is an unknown operator, or it is unsupported; */
            /* we will ignore it for now.                         */
            /* clear stack */
            parser.top = 0;
        }
        p.pos++;
    }

    return error;
}

/******************************************************************************/
// cfftoken
/******************************************************************************/
var cff_field_handlers = new Array(51);

// CFF_FontRecDictRec
cff_field_handlers[0] = create_cff_field(FT_Common.cff_kind_string, 0 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.version = val }, undefined);
cff_field_handlers[1] = create_cff_field(FT_Common.cff_kind_string, 1 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.notice = val }, undefined);
cff_field_handlers[2] = create_cff_field(FT_Common.cff_kind_string, 0x100 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.copyright = val }, undefined);
cff_field_handlers[3] = create_cff_field(FT_Common.cff_kind_string, 2 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.full_name = val }, undefined);
cff_field_handlers[4] = create_cff_field(FT_Common.cff_kind_string, 3 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.family_name = val }, undefined);
cff_field_handlers[5] = create_cff_field(FT_Common.cff_kind_string, 4 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.weight = val }, undefined);

cff_field_handlers[6] = create_cff_field(FT_Common.cff_kind_bool, 0x101 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.is_fixed_pitch = val }, undefined);

cff_field_handlers[7] = create_cff_field(FT_Common.cff_kind_fixed, 0x102 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.italic_angle = val }, undefined);
cff_field_handlers[8] = create_cff_field(FT_Common.cff_kind_fixed, 0x103 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.underline_position = val }, undefined);
cff_field_handlers[9] = create_cff_field(FT_Common.cff_kind_fixed, 0x104 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.underline_thickness = val }, undefined);

cff_field_handlers[10] = create_cff_field(FT_Common.cff_kind_num, 0x105 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.paint_type = val }, undefined);
cff_field_handlers[11] = create_cff_field(FT_Common.cff_kind_num, 0x106 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.charstring_type = val }, undefined);

cff_field_handlers[12] = create_cff_field(FT_Common.cff_kind_callback, 0x107 | FT_Common.CFFCODE_TOPDICT, cff_parse_font_matrix, 0, undefined, undefined);

cff_field_handlers[13] = create_cff_field(FT_Common.cff_kind_num, 13 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.unique_id = val }, undefined);

cff_field_handlers[14] = create_cff_field(FT_Common.cff_kind_callback, 5 | FT_Common.CFFCODE_TOPDICT, cff_parse_font_bbox, 0, undefined, undefined);

cff_field_handlers[15] = create_cff_field(FT_Common.cff_kind_num, 0x108 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.stroke_width = val }, undefined);
cff_field_handlers[16] = create_cff_field(FT_Common.cff_kind_num, 15 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.charset_offset = val }, undefined);
cff_field_handlers[17] = create_cff_field(FT_Common.cff_kind_num, 16 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.encoding_offset = val }, undefined);
cff_field_handlers[18] = create_cff_field(FT_Common.cff_kind_num, 17 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.charstrings_offset = val }, undefined);

cff_field_handlers[19] = create_cff_field(FT_Common.cff_kind_callback, 18 | FT_Common.CFFCODE_TOPDICT, cff_parse_private_dict, 0, undefined, undefined);

cff_field_handlers[20] = create_cff_field(FT_Common.cff_kind_num, 0x114 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.synthetic_base = val }, undefined);

cff_field_handlers[21] = create_cff_field(FT_Common.cff_kind_string, 0x115 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.embedded_postscript = val }, undefined);

cff_field_handlers[22] = create_cff_field(FT_Common.cff_kind_callback, 0x11E | FT_Common.CFFCODE_TOPDICT, cff_parse_cid_ros, 0, undefined, undefined);

cff_field_handlers[23] = create_cff_field(FT_Common.cff_kind_num, 0x11F | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_font_version = val }, undefined);
cff_field_handlers[24] = create_cff_field(FT_Common.cff_kind_num, 0x120 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_font_revision = val }, undefined);
cff_field_handlers[25] = create_cff_field(FT_Common.cff_kind_num, 0x121 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_font_type = val }, undefined);
cff_field_handlers[26] = create_cff_field(FT_Common.cff_kind_num, 0x122 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_count = val }, undefined);
cff_field_handlers[27] = create_cff_field(FT_Common.cff_kind_num, 0x123 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_uid_base = val }, undefined);
cff_field_handlers[28] = create_cff_field(FT_Common.cff_kind_num, 0x124 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_fd_array_offset = val }, undefined);
cff_field_handlers[29] = create_cff_field(FT_Common.cff_kind_num, 0x125 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_fd_select_offset = val }, undefined);

cff_field_handlers[30] = create_cff_field(FT_Common.cff_kind_string, 0x126 | FT_Common.CFFCODE_TOPDICT, null, 0, function(obj, val, f) { obj.cid_font_name = val }, undefined);

// CFF_PrivateRec
cff_field_handlers[31] = create_cff_field(FT_Common.cff_kind_delta, 6 | FT_Common.CFFCODE_PRIVATE, null, 14, function(obj, val, f) { obj.blue_values[f.offset] = val }, function(obj, val, f) { obj.num_blue_values = val });
cff_field_handlers[32] = create_cff_field(FT_Common.cff_kind_delta, 7 | FT_Common.CFFCODE_PRIVATE, null, 10, function(obj, val, f) { obj.other_blues[f.offset] = val }, function(obj, val, f) { obj.num_other_blues = val });
cff_field_handlers[33] = create_cff_field(FT_Common.cff_kind_delta, 8 | FT_Common.CFFCODE_PRIVATE, null, 14, function(obj, val, f) { obj.family_blues[f.offset] = val }, function(obj, val, f) { obj.num_family_blues = val });
cff_field_handlers[34] = create_cff_field(FT_Common.cff_kind_delta, 9 | FT_Common.CFFCODE_PRIVATE, null, 10, function(obj, val, f) { obj.family_other_blues[f.offset] = val }, function(obj, val, f) { obj.num_family_other_blues = val });

cff_field_handlers[35] = create_cff_field(FT_Common.cff_kind_fixed_thousand, 0x109 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.blue_scale = val }, undefined);

cff_field_handlers[36] = create_cff_field(FT_Common.cff_kind_num, 0x10A | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.blue_shift = val }, undefined);
cff_field_handlers[37] = create_cff_field(FT_Common.cff_kind_num, 0x10B | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.blue_fuzz = val }, undefined);
cff_field_handlers[38] = create_cff_field(FT_Common.cff_kind_num, 10 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.standard_width = val }, undefined);
cff_field_handlers[39] = create_cff_field(FT_Common.cff_kind_num, 11 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.standard_height = val }, undefined);

cff_field_handlers[40] = create_cff_field(FT_Common.cff_kind_delta, 0x10C | FT_Common.CFFCODE_PRIVATE, null, 13, function(obj, val, f) { obj.snap_widths[f.offset] = val }, function(obj, val, f) { obj.num_snap_widths = val });
cff_field_handlers[41] = create_cff_field(FT_Common.cff_kind_delta, 0x10D | FT_Common.CFFCODE_PRIVATE, null, 13, function(obj, val, f) { obj.snap_heights[f.offset] = val }, function(obj, val, f) { obj.num_snap_heights = val });

cff_field_handlers[42] = create_cff_field(FT_Common.cff_kind_bool, 0x10E | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.force_bold = val }, undefined);
cff_field_handlers[43] = create_cff_field(FT_Common.cff_kind_fixed, 0x10F | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.force_bold_threshold = val }, undefined);

cff_field_handlers[44] = create_cff_field(FT_Common.cff_kind_num, 0x110 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.lenIV = val }, undefined);
cff_field_handlers[45] = create_cff_field(FT_Common.cff_kind_num, 0x111 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.language_group = val }, undefined);

cff_field_handlers[46] = create_cff_field(FT_Common.cff_kind_fixed, 0x112 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.expansion_factor = val }, undefined);

cff_field_handlers[47] = create_cff_field(FT_Common.cff_kind_num, 0x113 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.initial_random_seed = val }, undefined);
cff_field_handlers[48] = create_cff_field(FT_Common.cff_kind_num, 19 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.local_subrs_offset = val }, undefined);
cff_field_handlers[49] = create_cff_field(FT_Common.cff_kind_num, 20 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.default_width = val }, undefined);
cff_field_handlers[50] = create_cff_field(FT_Common.cff_kind_num, 21 | FT_Common.CFFCODE_PRIVATE, null, 0, function(obj, val, f) { obj.nominal_width = val }, undefined);

/******************************************************************************/
// cffload
/******************************************************************************/
var cff_isoadobe_charset =
[
    0,   1,   2,   3,   4,   5,   6,   7,
    8,   9,  10,  11,  12,  13,  14,  15,
    16,  17,  18,  19,  20,  21,  22,  23,
    24,  25,  26,  27,  28,  29,  30,  31,
    32,  33,  34,  35,  36,  37,  38,  39,
    40,  41,  42,  43,  44,  45,  46,  47,
    48,  49,  50,  51,  52,  53,  54,  55,
    56,  57,  58,  59,  60,  61,  62,  63,
    64,  65,  66,  67,  68,  69,  70,  71,
    72,  73,  74,  75,  76,  77,  78,  79,
    80,  81,  82,  83,  84,  85,  86,  87,
    88,  89,  90,  91,  92,  93,  94,  95,
    96,  97,  98,  99, 100, 101, 102, 103,
    104, 105, 106, 107, 108, 109, 110, 111,
    112, 113, 114, 115, 116, 117, 118, 119,
    120, 121, 122, 123, 124, 125, 126, 127,
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 161, 162, 163, 164, 165, 166, 167,
    168, 169, 170, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 186, 187, 188, 189, 190, 191,
    192, 193, 194, 195, 196, 197, 198, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    208, 209, 210, 211, 212, 213, 214, 215,
    216, 217, 218, 219, 220, 221, 222, 223,
    224, 225, 226, 227, 228
];

var cff_expert_charset =
[
    0,   1, 229, 230, 231, 232, 233, 234,
    235, 236, 237, 238,  13,  14,  15,  99,
    239, 240, 241, 242, 243, 244, 245, 246,
    247, 248,  27,  28, 249, 250, 251, 252,
    253, 254, 255, 256, 257, 258, 259, 260,
    261, 262, 263, 264, 265, 266, 109, 110,
    267, 268, 269, 270, 271, 272, 273, 274,
    275, 276, 277, 278, 279, 280, 281, 282,
    283, 284, 285, 286, 287, 288, 289, 290,
    291, 292, 293, 294, 295, 296, 297, 298,
    299, 300, 301, 302, 303, 304, 305, 306,
    307, 308, 309, 310, 311, 312, 313, 314,
    315, 316, 317, 318, 158, 155, 163, 319,
    320, 321, 322, 323, 324, 325, 326, 150,
    164, 169, 327, 328, 329, 330, 331, 332,
    333, 334, 335, 336, 337, 338, 339, 340,
    341, 342, 343, 344, 345, 346, 347, 348,
    349, 350, 351, 352, 353, 354, 355, 356,
    357, 358, 359, 360, 361, 362, 363, 364,
    365, 366, 367, 368, 369, 370, 371, 372,
    373, 374, 375, 376, 377, 378
];

var cff_expertsubset_charset =
[
    0,   1, 231, 232, 235, 236, 237, 238,
    13,  14,  15,  99, 239, 240, 241, 242,
    243, 244, 245, 246, 247, 248,  27,  28,
    249, 250, 251, 253, 254, 255, 256, 257,
    258, 259, 260, 261, 262, 263, 264, 265,
    266, 109, 110, 267, 268, 269, 270, 272,
    300, 301, 302, 305, 314, 315, 158, 155,
    163, 320, 321, 322, 323, 324, 325, 326,
    150, 164, 169, 327, 328, 329, 330, 331,
    332, 333, 334, 335, 336, 337, 338, 339,
    340, 341, 342, 343, 344, 345, 346
];

var cff_standard_encoding =
[
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    1,   2,   3,   4,   5,   6,   7,   8,
    9,  10,  11,  12,  13,  14,  15,  16,
    17,  18,  19,  20,  21,  22,  23,  24,
    25,  26,  27,  28,  29,  30,  31,  32,
    33,  34,  35,  36,  37,  38,  39,  40,
    41,  42,  43,  44,  45,  46,  47,  48,
    49,  50,  51,  52,  53,  54,  55,  56,
    57,  58,  59,  60,  61,  62,  63,  64,
    65,  66,  67,  68,  69,  70,  71,  72,
    73,  74,  75,  76,  77,  78,  79,  80,
    81,  82,  83,  84,  85,  86,  87,  88,
    89,  90,  91,  92,  93,  94,  95,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,  96,  97,  98,  99, 100, 101, 102,
    103, 104, 105, 106, 107, 108, 109, 110,
    0, 111, 112, 113, 114,   0, 115, 116,
    117, 118, 119, 120, 121, 122,   0, 123,
    0, 124, 125, 126, 127, 128, 129, 130,
    131,   0, 132, 133,   0, 134, 135, 136,
    137,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0, 138,   0, 139,   0,   0,   0,   0,
    140, 141, 142, 143,   0,   0,   0,   0,
    0, 144,   0,   0,   0, 145,   0,   0,
    146, 147, 148, 149,   0,   0,   0,   0
];

var cff_expert_encoding =
[
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    1, 229, 230,   0, 231, 232, 233, 234,
    235, 236, 237, 238,  13,  14,  15,  99,
    239, 240, 241, 242, 243, 244, 245, 246,
    247, 248,  27,  28, 249, 250, 251, 252,
    0, 253, 254, 255, 256, 257,   0,   0,
    0, 258,   0,   0, 259, 260, 261, 262,
    0,   0, 263, 264, 265,   0, 266, 109,
    110, 267, 268, 269,   0, 270, 271, 272,
    273, 274, 275, 276, 277, 278, 279, 280,
    281, 282, 283, 284, 285, 286, 287, 288,
    289, 290, 291, 292, 293, 294, 295, 296,
    297, 298, 299, 300, 301, 302, 303,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0, 304, 305, 306,   0,   0, 307, 308,
    309, 310, 311,   0, 312,   0,   0, 312,
    0,   0, 314, 315,   0,   0, 316, 317,
    318,   0,   0,   0, 158, 155, 163, 319,
    320, 321, 322, 323, 324, 325,   0,   0,
    326, 150, 164, 169, 327, 328, 329, 330,
    331, 332, 333, 334, 335, 336, 337, 338,
    339, 340, 341, 342, 343, 344, 345, 346,
    347, 348, 349, 350, 351, 352, 353, 354,
    355, 356, 357, 358, 359, 360, 361, 362,
    363, 364, 365, 366, 367, 368, 369, 370,
    371, 372, 373, 374, 375, 376, 377, 378
];

function cff_get_standard_encoding(charcode)
{
    return (charcode < 256 ? cff_standard_encoding[charcode] : 0);
}

function cff_index_read_offset(idx)
{
    var result = 0;
    var tmp = g_memory.Alloc(4);
    var error = idx.stream.Read(tmp, idx.off_size);

    if (error == 0)
    {
        for (var nn = 0; nn < idx.off_size; nn++)
            result = (result << 8) | tmp.data[nn];

        result = FT_Common.IntToUInt(result);
    }

    return { err : error, result: result };
}

function cff_index_init(idx, stream, load)
{
    idx.clear();
    idx.stream = stream;
    idx.start  = stream.pos;

    var count = stream.ReadUShort();
    var error = FT_Error;
    if (error != 0)
        return error;

    if (0 == count)
        return error;

    var offsize = stream.ReadUChar();
    if (error != 0)
        return error;

    if (offsize < 1 || offsize > 4)
        return FT_Common.FT_Err_Invalid_Table;

    idx.count    = count;
    idx.off_size = offsize;
    var size = (count + 1) * offsize;

    idx.data_offset = idx.start + 3 + size;

    error = stream.Skip(size - offsize);
    if (error != 0)
        return error;

    var _err = cff_index_read_offset(idx);
    error = _err.err;
    size = _err.result;
    if (error != 0)
        return error;

    if (size == 0)
        return FT_Common.FT_Err_Invalid_Table;

    idx.data_size = --size;

    if (load)
    {
        /* load the data */
        idx.bytes = new CPointer();
        error = stream.ExtractFrame(size, idx.bytes);
    }
    else
    {
        /* skip the data */
        error = stream.Skip(size);
    }

    return error;
}

function cff_index_done(idx)
{
    if (idx.stream != null)
    {
        idx.clear();
    }
}

function cff_index_load_offsets(idx)
{
    var error = 0;
    var stream = idx.stream;

    if (idx.count > 0 && idx.offsets == null)
    {
        var offsize = idx.off_size;
        var data_size = (idx.count + 1) * offsize;

        error = stream.Seek(idx.start + 3);
        if (error == 0)
            error = stream.EnterFrame(data_size);

        if (error != 0)
            return error;

        idx.offsets = CreateUIntArray(idx.count + 1);

        var poff = 0;
        var p = stream.cur;
        var p_end  = p + data_size;

        var _s = stream.data;
        var _d = idx.offsets;

        switch (offsize)
        {
            case 1:
                for (; p < p_end; p++, poff++)
                    _d[poff] = _s[p];
                break;

            case 2:
                for (; p < p_end; p += 2, poff++)
                    _d[poff] = (_s[p] << 8 | _s[p+1]);
                break;

            case 3:
                for (; p < p_end; p += 3, poff++)
                    _d[poff] = (_s[p] << 16 | _s[p+1] << 8 | _s[p+2]);
                break;

            default:
                for (; p < p_end; p += 4, poff++)
                {
                    var r = (_s[p] << 24 | _s[p+1] << 16 | _s[p+2] << 8 | _s[p+3]);
                    if (r<0)
                        r+=FT_Common.a_i;
                    _d[poff] = r;
                }
        }

        stream.ExitFrame();
    }

    return error;
}

function cff_index_get_pointers(idx, table, pool, is_pool)
{
    var error = 0;

    if (idx.offsets == null)
    {
        error = cff_index_load_offsets(idx);
        if (error != 0)
            return { err: error, table: table, pool: pool };
    }

    if (idx.count > 0)
    {
        var t = new Array(idx.count + 1);
        var new_bytes = g_memory.Alloc(idx.data_size + idx.count);

        var extra = 0;
        var org_bytes = idx.bytes;

        /* at this point, `idx->offsets' can't be NULL */
        var cur_offset = idx.offsets[0] - 1;

        /* sanity check */
        if (cur_offset >= idx.data_size)
        {
            cur_offset = 0;
        }

        if (is_pool == 0)
        {
            t[0] = dublicate_pointer(org_bytes);
            t[0].pos += cur_offset;
        }
        else
        {
            t[0] = dublicate_pointer(new_bytes);
            t[0].pos += cur_offset;
        }

        for (var n = 1; n <= idx.count; n++)
        {
            var next_offset = idx.offsets[n] - 1;

            /* empty slot + two sanity checks for invalid offset tables */
            if (next_offset == 0 || next_offset < cur_offset || (next_offset >= idx.data_size && n < idx.count))
                next_offset = cur_offset;

            if (is_pool == 0)
            {
                t[n] = dublicate_pointer(org_bytes);
                t[n].pos += next_offset;
            }
            else
            {
                t[n] = dublicate_pointer(new_bytes);
                t[n].pos += next_offset + extra;

                if (next_offset != cur_offset)
                {
                    var _d = t[n - 1];
                    var _s = dublicate_pointer(org_bytes);
                    _s.pos += cur_offset;
                    var _l = t[n].pos - t[n-1].pos;

                    for (var i = 0; i < _l; i++)
                        _d.data[_d.pos + i] = _s.data[_s.pos + i];

                    t[n].data[t[n].pos] = FT_Common.SYMBOL_CONST_S0;
                    t[n].pos += 1;
                    extra++;
                }
            }

            cur_offset = next_offset;
        }

        return { err: error, table: t, pool: new_bytes };
    }

    return { err: error, table: table, pool: pool };
}

function cff_index_access_element(idx, element)
{
    var error = 0;
    var pbytes = null;
    var pbyte_len = 0;

    if (idx && idx.count > element)
    {
        /* compute start and end offsets */
        var stream = idx.stream;
        var off1, off2 = 0;


        /* load offsets from file or the offset table */
        if (idx.offsets == null)
        {
            var pos = element * idx.off_size;

            error = stream.Seek(idx.start + 3 + pos);
            if (error != 0)
                return { err: error, bytes: pbytes, len: pbyte_len };

            var ret = cff_index_read_offset(idx);
            error = ret.err;
            off1 = ret.result;
            if (error != 0)
                return { err: error, bytes: pbytes, len: pbyte_len };

            if (off1 != 0)
            {
                do
                {
                    element++;
                    ret = cff_index_read_offset(idx);
                    error = ret.err;
                    off2 = ret.result;
                }
                while (off2 == 0 && element < idx.count);
            }
        }
        else   /* use offsets table */
        {
            off1 = idx.offsets[element];
            if (off1)
            {
                do
                {
                    element++;
                    off2 = idx.offsets[element];

                } while (off2 == 0 && element < idx.count);
            }
        }

        /* XXX: should check off2 does not exceed the end of this entry; */
        /*      at present, only truncate off2 at the end of this stream */
        if (off2 > stream.size + 1 || idx.data_offset > stream.size - off2 + 1)
        {
            off2 = stream.size - idx.data_offset + 1;
        }

        /* access element */
        if (off1 && off2 > off1)
        {
            pbyte_len = off2 - off1;

            if (idx.bytes != null)
            {
                /* this index was completely loaded in memory, that's easy */
                pbytes = dublicate_pointer(idx.bytes);
                pbytes.pos += (off1 - 1);
            }
            else
            {
                /* this index is still on disk/file, access it through a frame */
                error = stream.Seek(idx.data_offset + off1 - 1);
                if (error == 0)
                {
                    pbytes = new CPointer();
                    error = stream.ExtractFrame(off2 - off1, pbytes);
                }
            }
        }
        else
        {
            /* empty index element */
            pbytes = null;
            pbyte_len = 0;
        }
    }
    else
        error = FT_Common.FT_Err_Invalid_Argument;

    return { err: error, bytes: pbytes, len: pbyte_len };
}

function cff_index_forget_element(idx, pbytes)
{
    if (idx.bytes == null)
    {
        idx.stream.ReleaseFrame();
        pbytes = null;
    }
}

function cff_index_get_name(font, element)
{
    var idx = font.name_index;
    var ret = cff_index_access_element(idx, element);
    if (0 != ret.err)
        return null;

    var name = "";
    var _len = ret.len;
    var _d = ret.bytes;
    for (var i = 0; i < _len; i++)
        name += String.fromCharCode(_d.data[_d.pos + i]);

    cff_index_forget_element(idx, ret.bytes);
    return name;
}

function cff_index_get_string(font, element)
{
    return (element < font.num_strings) ? FT_PEEK_String1(font.strings[element], 1000) : null;
}

function cff_index_get_sid_string(font, sid)
{
    /* value 0xFFFFU indicates a missing dictionary entry */
    if (sid == 0xFFFF)
        return null;

    /* if it is not a standard string, return it */
    if (sid > 390)
        return cff_index_get_string(font, sid - 391);

    /* CID-keyed CFF fonts don't have glyph names */
    if (font.psnames == null)
        return null;

    /* this is a standard string */
    return font.psnames.adobe_std_strings(sid);
}

function CFF_Done_FD_Select(fdselect, stream)
{
    if (fdselect.data)
    {
        stream.ReleaseFrame();
        fdselect.data = null;
    }

    fdselect.data_size   = 0;
    fdselect.format      = 0;
    fdselect.range_count = 0;
}

function CFF_Load_FD_Select(fdselect, num_glyphs, stream, offset)
{
    var error = stream.Seek(offset);
    if (error != 0)
        return error;

    var format = stream.ReadUChar();
    error = FT_Error;
    if (error != 0)
        return error;

    fdselect.format      = format;
    fdselect.cache_count = 0;   /* clear cache */

    switch (format)
    {
        case 0:     /* format 0, that's simple */
            fdselect.data_size = num_glyphs;
            fdselect.data = new CPointer();
            error = stream.ExtractFrame(fdselect.data_size, fdselect.data);
            break;
        case 3:     /* format 3, a tad more complex */
            var num_ranges = stream.ReadUShort();
            error = FT_Error;
            if (error != 0)
                return error;

            fdselect.data_size = num_ranges * 3 + 2;
            fdselect.data = new CPointer();
            error = stream.ExtractFrame(fdselect.data_size, fdselect.data);
            break;

        default:    /* hmm... that's wrong */
            error = FT_Common.FT_Err_Invalid_File_Format;
    }

    return error;
}

function cff_fd_select_get(fdselect, glyph_index)
{
    var fd = 0;
    switch (fdselect.format)
    {
        case 0:
            fd = fdselect.data.data[fdselect.data.pos + glyph_index];
            break;

        case 3:
            /* first, compare to cache */
            if ((glyph_index - fdselect.cache_first) < fdselect.cache_count)
            {
                fd = fdselect.cache_fd;
                break;
            }

            /* then, lookup the ranges array */
            var p = dublicate_pointer(fdselect.data);
            var p_limit = p.pos + fdselect.data_size;

            var first = FT_NEXT_USHORT(p);
            do
            {
                if (glyph_index < first)
                    break;

                var fd2 = p.data[p.pos];
                p.pos++;
                var limit = FT_NEXT_USHORT(p);

                if (glyph_index < limit)
                {
                    fd = fd2;

                    /* update cache */
                    fdselect.cache_first = first;
                    fdselect.cache_count = limit-first;
                    fdselect.cache_fd    = fd2;
                    break;
                }
                first = limit;

            } while ( p < p_limit );
            break;

        default:
            break;
    }

    return fd;
}

function cff_charset_compute_cids(charset, num_glyphs, memory)
{
    var error = 0;
    var max_cid = 0;

    if (charset.max_cid > 0)
        return error;

    for (var i = 0; i < num_glyphs; i++)
    {
        if (charset.sids[i] > max_cid)
            max_cid = charset.sids[i];
    }

    charset.cids = CreateUIntArray(max_cid + 1);

    /* When multiple GIDs map to the same CID, we choose the lowest */
    /* GID.  This is not described in any spec, but it matches the  */
    /* behaviour of recent Acroread versions.                       */
    for (var j = num_glyphs - 1; j >= 0 ; j--)
        charset.cids[charset.sids[j]] = j;

    charset.max_cid    = max_cid;
    charset.num_glyphs = num_glyphs;

    return error;
}

function cff_charset_cid_to_gindex(charset, cid)
{
    if (cid <= charset.max_cid)
        return charset.cids[cid];
    return 0;
}

function cff_charset_free_cids(charset, memory)
{
    charset.cids = null;
    charset.max_cid = 0;
}

function cff_charset_done(charset, stream)
{
    cff_charset_free_cids(charset, stream.memory);

    charset.sids = null;
    charset.format = 0;
    charset.offset = 0;
}

function cff_charset_load(charset, num_glyphs, stream, base_offset, offset, invert)
{
    var error = 0;
    var glyph_sid = 0;

    /* If the the offset is greater than 2, we have to parse the */
    /* charset table.                                            */
    if (offset > 2)
    {
        charset.offset = base_offset + offset;

        error = stream.Seek(charset.offset);
        if (error != 0)
        {
            charset.sids = null;
            charset.cids = null;
            charset.format = 0;
            charset.offset = 0;
            return error;
        }

        charset.format = stream.ReadUChar();
        error = FT_Error;
        if (error != 0)
        {
            charset.sids = null;
            charset.cids = null;
            charset.format = 0;
            charset.offset = 0;
            return error;
        }

        charset.sids = CreateUIntArray(num_glyphs);

        /* assign the .notdef glyph */
        charset.sids[0] = 0;

        switch (charset.format)
        {
            case 0:
                if (num_glyphs > 0)
                {
                    error = stream.EnterFrame((num_glyphs - 1) * 2);
                    if (error != 0)
                    {
                        charset.sids = null;
                        charset.cids = null;
                        charset.format = 0;
                        charset.offset = 0;
                        return error;
                    }

                    for (j = 1; j < num_glyphs; j++)
                        charset.sids[j] = stream.GetUShort();

                    stream.ExitFrame();
                }
                break;

            case 1:
            case 2:
                var nleft = 0;
                var j = 1;
                while (j < num_glyphs)
                {
                    glyph_sid = stream.ReadUShort();
                    error = FT_Error;
                    if (error != 0)
                    {
                        charset.sids = null;
                        charset.cids = null;
                        charset.format = 0;
                        charset.offset = 0;
                        return error;
                    }

                    if (charset.format == 2)
                    {
                        nleft = stream.ReadUShort();
                        error = FT_Error;
                        if (error != 0)
                        {
                            charset.sids = null;
                            charset.cids = null;
                            charset.format = 0;
                            charset.offset = 0;
                            return error;
                        }
                    }
                    else
                    {
                        nleft = stream.ReadUChar();
                        error = FT_Error;
                        if (error != 0)
                        {
                            charset.sids = null;
                            charset.cids = null;
                            charset.format = 0;
                            charset.offset = 0;
                            return error;
                        }
                    }

                    /* try to rescue some of the SIDs if `nleft' is too large */
                    if (glyph_sid > (0xFFFF - nleft))
                    {
                        nleft = (0xFFFF - glyph_sid);
                    }

                    /* Fill in the range of sids -- `nleft + 1' glyphs. */
                    for (i = 0; j < num_glyphs && i <= nleft; i++, j++, glyph_sid++)
                        charset.sids[j] = glyph_sid;
                }
                break;

            default:
                charset.sids = null;
                charset.cids = null;
                charset.format = 0;
                charset.offset = 0;
                return FT_Common.FT_Err_Invalid_File_Format;
        }
    }
    else
    {
        /* Parse default tables corresponding to offset == 0, 1, or 2.  */
        /* CFF specification intimates the following:                   */
        /*                                                              */
        /* In order to use a predefined charset, the following must be  */
        /* true: The charset constructed for the glyphs in the font's   */
        /* charstrings dictionary must match the predefined charset in  */
        /* the first num_glyphs.                                        */
        charset.offset = offset;  /* record charset type */

        switch (offset)
        {
        case 0:
            if (num_glyphs > 229)
            {
                charset.sids = null;
                charset.cids = null;
                charset.format = 0;
                charset.offset = 0;
                return FT_Common.FT_Err_Invalid_File_Format;
            }

            charset.sids = CreateUIntArray(num_glyphs);
            for (var k = 0; k < num_glyphs; k++)
                charset.sids[k] = cff_isoadobe_charset[k];

            break;

        case 1:
            if (num_glyphs > 166)
            {
                charset.sids = null;
                charset.cids = null;
                charset.format = 0;
                charset.offset = 0;
                return FT_Common.FT_Err_Invalid_File_Format;
            }

            charset.sids = CreateUIntArray(num_glyphs);
            for (var k = 0; k < num_glyphs; k++)
                charset.sids[k] = cff_expert_charset[k];

            break;

        case 2:
            if (num_glyphs > 87)
            {
                charset.sids = null;
                charset.cids = null;
                charset.format = 0;
                charset.offset = 0;
                return FT_Common.FT_Err_Invalid_File_Format;
            }

            charset.sids = CreateUIntArray(num_glyphs);
            for (var k = 0; k < num_glyphs; k++)
                charset.sids[k] = cff_expertsubset_charset[k];

            break;

        default:
            charset.sids = null;
            charset.cids = null;
            charset.format = 0;
            charset.offset = 0;
            return FT_Common.FT_Err_Invalid_File_Format;
        }
    }

    /* we have to invert the `sids' array for subsetted CID-keyed fonts */
    if (invert)
        error = cff_charset_compute_cids(charset, num_glyphs, stream.memory);

    if (error != 0)
    {
        charset.sids = null;
        charset.cids = null;
        charset.format = 0;
        charset.offset = 0;
    }
    return error;
}

function cff_encoding_done(encoding)
{
    encoding.format = 0;
    encoding.offset = 0;
    encoding.count  = 0;
}

function cff_encoding_load(encoding, charset, num_glyphs, stream, base_offset, offset)
{
    var error = 0;
    var count = 0;
    var j = 0;
    var glyph_sid = 0;
    var glyph_code = 0;


    /* Check for charset->sids.  If we do not have this, we fail. */
    if (charset.sids == null)
        return FT_Common.FT_Err_Invalid_File_Format;

    /* Zero out the code to gid/sid mappings. */
    for (j = 0; j < 256; j++)
    {
        encoding.sids[j] = 0;
        encoding.codes[j] = 0;
    }

    /* Note: The encoding table in a CFF font is indexed by glyph index;  */
    /* the first encoded glyph index is 1.  Hence, we read the character  */
    /* code (`glyph_code') at index j and make the assignment:            */
    /*                                                                    */
    /*    encoding->codes[glyph_code] = j + 1                             */
    /*                                                                    */
    /* We also make the assignment:                                       */
    /*                                                                    */
    /*    encoding->sids[glyph_code] = charset->sids[j + 1]               */
    /*                                                                    */
    /* This gives us both a code to GID and a code to SID mapping.        */
    if (offset > 1)
    {
        encoding.offset = base_offset + offset;

        error = stream.Seek(encoding.offset);
        if (error != 0)
            return error;
        encoding.format = stream.ReadUChar();
        error = FT_Error;
        if (error != 0)
            return error;
        count = stream.ReadUChar();
        error = FT_Error;
        if (error != 0)
            return error;

        switch (encoding.format & 0x7F)
        {
            case 0:
                encoding.count = count + 1;
                error = stream.EnterFrame(count);
                if (error != 0)
                    return error;

                var p = stream.cur;
                for (j = 1; j <= count; j++)
                {
                    glyph_code = stream.data[p];
                    p++;
                    /* Make sure j is not too big. */
                    if (j < num_glyphs)
                    {
                        /* Assign code to GID mapping. */
                        encoding.codes[glyph_code] = j;
                        /* Assign code to SID mapping. */
                        encoding.sids[glyph_code] = charset.sids[j];
                    }
                }
                stream.ExitFrame();
                break;

            case 1:
                var nleft = 0;
                var i = 1;
                encoding.count = 0;

                /* Parse the Format1 ranges. */
                for (j = 0;  j < count; j++, i += nleft)
                {
                    /* Read the first glyph code of the range. */
                    glyph_code = stream.ReadUChar();
                    error = FT_Error;
                    if (error != 0)
                        return error;

                    nleft = stream.ReadUChar();
                    error = FT_Error;
                    if (error != 0)
                        return error;
                    /* Read the number of codes in the range. */
                    /* Increment nleft, so we read `nleft + 1' codes/sids. */
                    nleft++;

                    /* compute max number of character codes */
                    if (nleft > encoding.count)
                        encoding.count = nleft;

                    /* Fill in the range of codes/sids. */
                    for (var k = i; k < nleft + i; k++, glyph_code++)
                    {
                        /* Make sure k is not too big. */
                        if (k < num_glyphs && glyph_code < 256)
                        {
                            /* Assign code to GID mapping. */
                            encoding.codes[glyph_code] = k;
                            /* Assign code to SID mapping. */
                            encoding.sids[glyph_code] = charset.sids[k];
                        }
                    }
                }

                /* simple check; one never knows what can be found in a font */
                if (encoding.count > 256)
                    encoding.count = 256;

                break;

            default:
                return FT_Common.FT_Err_Invalid_File_Format;
        }

        /* Parse supplemental encodings, if any. */
        if (encoding.format & 0x80)
        {
            count = stream.ReadUChar();
            error = FT_Error;
            if (error != 0)
                return error;

            for (j = 0; j < count; j++)
            {
                /* Read supplemental glyph code. */
                glyph_code = stream.ReadUChar();
                error = FT_Error;
                if (error != 0)
                    return error;

                glyph_sid = stream.ReadUShort();
                error = FT_Error;
                if (error != 0)
                    return error;

                /* Assign code to SID mapping. */
                encoding.sids[glyph_code] = glyph_sid;

                /* First, look up GID which has been assigned to */
                /* SID glyph_sid.                                */
                for (var gindex = 0; gindex < num_glyphs; gindex++)
                {
                    if (charset.sids[gindex] == glyph_sid)
                    {
                        encoding.codes[glyph_code] = gindex;
                        break;
                    }
                }
            }
        }
    }
    else
    {
        /* We take into account the fact a CFF font can use a predefined */
        /* encoding without containing all of the glyphs encoded by this */
        /* encoding (see the note at the end of section 12 in the CFF    */
        /* specification).                                               */

        switch (offset)
        {
        case 0:
        case 1:
            var src = (offset == 0) ? cff_standard_encoding : cff_expert_encoding;
            for (var k = 0; k < 256; k++)
                encoding.sids[k] = src[k];

            encoding.count = 0;
            error = cff_charset_compute_cids(charset, num_glyphs, stream.memory);
            if (error != 0)
                return error;

            for (j = 0; j < 256; j++)
            {
                var sid = encoding.sids[j];
                var gid = 0;


                if (sid)
                    gid = cff_charset_cid_to_gindex(charset, sid);

                if ( gid != 0 )
                {
                    encoding.codes[j] = gid;
                    encoding.count    = j + 1;
                }
                else
                {
                    encoding.codes[j] = 0;
                    encoding.sids [j] = 0;
                }
            }
            break;

        default:
            return FT_Common.FT_Err_Invalid_File_Format;
        }
    }

    return error;
}

function cff_subfont_load(font, idx, font_index, stream, base_offset, library)
{
    var error = 0;
    var parser = new CFF_ParserRec();
    var top = font.font_dict;
    var priv = font.private_dict;

    cff_parser_init(parser, FT_Common.CFF_CODE_TOPDICT, font.font_dict, library);

    /* set defaults */
    top.clear();

    top.underline_position  = -100 << 16;
    top.underline_thickness = 50 << 16;
    top.charstring_type     = 2;
    top.font_matrix.xx      = 0x10000;
    top.font_matrix.yy      = 0x10000;
    top.cid_count           = 8720;

    /* we use the implementation specific SID value 0xFFFF to indicate */
    /* missing entries                                                 */
    top.version             = 0xFFFF;
    top.notice              = 0xFFFF;
    top.copyright           = 0xFFFF;
    top.full_name           = 0xFFFF;
    top.family_name         = 0xFFFF;
    top.weight              = 0xFFFF;
    top.embedded_postscript = 0xFFFF;

    top.cid_registry        = 0xFFFF;
    top.cid_ordering        = 0xFFFF;
    top.cid_font_name       = 0xFFFF;

    var ret = cff_index_access_element(idx, font_index);
    error = ret.err;
    var dict = ret.bytes;
    var dict_len = ret.len;

    if (error == 0)
    {
        error = cff_parser_run(parser, dict, dict.pos + dict_len);
    }

    cff_index_forget_element(idx, dict);

    if (error != 0)
        return error;

    /* if it is a CID font, we stop there */
    if (top.cid_registry != 0xFFFF)
        return error;

    /* parse the private dictionary, if any */
    if (top.private_offset != 0 && top.private_size != 0)
    {
        priv.clear();

        priv.blue_shift       = 7;
        priv.blue_fuzz        = 1;
        priv.lenIV            = -1;
        priv.expansion_factor = parseInt(0.06 * 0x10000);
        priv.blue_scale       = parseInt(0.039625 * 0x10000 * 1000);

        cff_parser_init(parser, FT_Common.CFF_CODE_PRIVATE, priv, library);

        error = stream.Seek(base_offset + font.font_dict.private_offset);
        if (error != 0)
            return error;

        error = stream.EnterFrame(font.font_dict.private_size);
        if (error != 0)
            return error;

        var curs = new CPointer();
        curs.data = stream.data;
        curs.pos = stream.cur;
        error = cff_parser_run(parser, curs, curs.pos + font.font_dict.private_size);

        stream.ExitFrame();
        if (error != 0)
            return error;

        /* ensure that `num_blue_values' is even */
        priv.num_blue_values &= ~1;
    }

    /* read the local subrs, if any */
    if (priv.local_subrs_offset != 0)
    {
        error = stream.Seek(base_offset + top.private_offset + priv.local_subrs_offset);
        if (error != 0)
            return error;

        error = cff_index_init(font.local_subrs_index, stream, 1);
        if (error != 0)
            return error;

        ret = cff_index_get_pointers(font.local_subrs_index, font.local_subrs, null, 0);
        error = ret.err;
        font.local_subrs = ret.table;
        if (error != 0)
            return error;
    }

    return error;
}

function cff_subfont_done(memory, subfont)
{
    if (subfont != null)
    {
        cff_index_done(subfont.local_subrs_index);
        subfont.local_subrs = null;
    }
}

function cff_font_load(library, stream, face_index, font, pure_cff)
{
    var error = 0;
    var memory = stream.memory;
    var base_offset = stream.pos;
    var dict = font.top_font.font_dict;
    var string_index = new CFF_IndexRec();

    // TODO: font.clear();
    error = stream.EnterFrame(4);
    if (error != 0)
        return error;

    /* read CFF font header */
    font.version_major = stream.GetUChar();
    font.version_minor = stream.GetUChar();
    font.header_size = stream.GetUChar();
    font.absolute_offsize = stream.GetUChar();

    stream.ExitFrame();

    /* check format */
    if (font.version_major != 1 || font.header_size < 4 || font.absolute_offsize > 4)
        return FT_Common.FT_Err_Unknown_File_Format;

    /* skip the rest of the header */
    error = stream.Skip(font.header_size - 4);
    if (error != 0)
        return error;

    /* read the name, top dict, string and global subrs index */
    error = cff_index_init(font.name_index, stream, 0);
    if (error == 0)
        error = cff_index_init(font.font_dict_index, stream, 0);
    if (error == 0)
        error = cff_index_init(string_index, stream, 1);
    if (error == 0)
        error = cff_index_init(font.global_subrs_index, stream, 1);

    if (error != 0)
        return error;

    var ret = cff_index_get_pointers(string_index, font.strings, font.string_pool, 1);
    error = ret.err;
    font.strings = ret.table;
    font.string_pool = ret.pool;

    font.num_strings = string_index.count;

    /* well, we don't really forget the `disabled' fonts... */
    font.num_faces = font.name_index.count;
    if (face_index >= font.num_faces)
    {
        error = FT_Common.FT_Err_Invalid_Argument;
    }

    /* in case of a font format check, simply exit now */
    if (face_index < 0)
        return error;

    /* now, parse the top-level font dictionary */
    error = cff_subfont_load(font.top_font, font.font_dict_index, face_index, stream, base_offset, library);
    if (error != 0)
        return error;

    error = stream.Seek(base_offset + dict.charstrings_offset);
    if (error != 0)
        return error;

    error = cff_index_init(font.charstrings_index, stream, 0);
    if (error != 0)
        return error;

    /* now, check for a CID font */
    if (dict.cid_registry != 0xFFFF)
    {
        var fd_index = new CFF_IndexRec();
        var sub = null;

        /* this is a CID-keyed font, we must now allocate a table of */
        /* sub-fonts, then load each of them separately              */
        error = stream.Seek(base_offset + dict.cid_fd_array_offset);
        if (error != 0)
            return error;

        error = cff_index_init(fd_index, stream, 0);
        if (error != 0)
            return error;

        if (fd_index.count > FT_Common.CFF_MAX_CID_FONTS)
        {
            cff_index_done(fd_index);
        }
        else
        {
            var _is_break = 0;
            /* allocate & read each font dict independently */
            font.num_subfonts = fd_index.count;
            sub = new Array(fd_index.count);

            for (var idx = 0; idx < fd_index.count; idx++)
                sub[idx] = new CFF_SubFontRec();

            /* set up pointer table */
            for (var idx = 0; idx < fd_index.count; idx++)
                font.subfonts[idx] = sub[idx];

            /* now load each subfont independently */
            for (var idx = 0; idx < fd_index.count; idx++)
            {
                error = cff_subfont_load(font.subfonts[idx], fd_index, idx, stream, base_offset, library);
                if (error != 0)
                {
                    cff_index_done(fd_index);
                    _is_break = 1;
                }
            }

            /* now load the FD Select array */
            if (_is_break == 0)
            {
                error = CFF_Load_FD_Select(font.fd_select, font.charstrings_index.count, stream, base_offset + dict.cid_fd_select_offset);
            }

            cff_index_done(fd_index);

            if (error != 0)
                return error;
        }
    }
    else
        font.num_subfonts = 0;

    /* read the charstrings index now */
    if (dict.charstrings_offset == 0)
        return FT_Common.FT_Err_Invalid_File_Format;


    font.num_glyphs = font.charstrings_index.count;

    ret = cff_index_get_pointers(font.global_subrs_index, font.global_subrs, null, 0);
    error = ret.err;
    font.global_subrs = ret.table;

    if (error != 0)
        return error;

    /* read the Charset and Encoding tables if available */
    if (font.num_glyphs > 0)
    {
        var invert = (dict.cid_registry != 0xFFFF && pure_cff) ? 1 : 0;

        error = cff_charset_load(font.charset, font.num_glyphs, stream, base_offset, dict.charset_offset, invert);
        if (error != 0)
            return error;

        /* CID-keyed CFFs don't have an encoding */
        if (dict.cid_registry == 0xFFFF)
        {
            error = cff_encoding_load(font.encoding, font.charset, font.num_glyphs, stream, base_offset, dict.encoding_offset);
            if (error != 0)
                return error;
        }
    }

    /* get the font name (/CIDFontName for CID-keyed fonts, */
    /* /FontName otherwise)                                 */
    font.font_name = cff_index_get_name(font, face_index);

    cff_index_done(string_index);
    return error;
}

function cff_font_done(font)
{
    var memory = font.memory;

    cff_index_done(font.global_subrs_index);
    cff_index_done(font.font_dict_index );
    cff_index_done(font.name_index);
    cff_index_done(font.charstrings_index);

    /* release font dictionaries, but only if working with */
    /* a CID keyed CFF font                                */
    if (font.num_subfonts > 0)
    {
        for (var idx = 0; idx < font.num_subfonts; idx++)
            cff_subfont_done(memory, font.subfonts[idx]);

        /* the subfonts array has been allocated as a single block */
        font.subfonts[0] = null;
    }

    cff_encoding_done(font.encoding);
    cff_charset_done(font.charset, font.stream);

    cff_subfont_done(memory, font.top_font);

    CFF_Done_FD_Select(font.fd_select, font.stream);

    font.font_info = null;

    font.strings = null;
    font.string_pool = null;
}

/******************************************************************************/
// cffcmaps
/******************************************************************************/
function CFF_CMapStdRec()
{
    this.cmap = new FT_CMapRec();
    this.gids = null;

    this.type = FT_Common.FT_CMAP_1;
}

function cff_cmap_encoding_init(cmap)
{
    cmap.gids = __FT_CMapRec(cmap).charmap.face.extra.data.encoding.codes;
    return 0;
}

function cff_cmap_encoding_done(cmap)
{
    cmap.gids = null;
}

function cff_cmap_encoding_char_index(cmap, char_code)
{
    if (char_code < 256)
        return cmap.gids[char_code];

    return 0;
}

function cff_cmap_encoding_char_next(cmap, pchar_code)
{
    var char_code = pchar_code;
    var ret = {gindex: 0, char_code: 0};

    if (char_code < 255)
    {
        var code = char_code + 1;

        for (;;)
        {
            if (code >= 256)
                break;

            ret.gindex = cmap.gids[code];
            if (ret.gindex != 0)
            {
                ret.char_code = code;
                break;
            }
            code++;
        }
    }
    return ret;
}

var cff_cmap_encoding_class_rec = create_cmap_class_rec(101,cff_cmap_encoding_init,cff_cmap_encoding_done,cff_cmap_encoding_char_index,cff_cmap_encoding_char_next,null,null,null,null,null);

function cff_sid_to_glyph_name(face, idx)
{
    var cff = face.extra.data;
    var sid = cff.charset.sids[idx];

    return cff_index_get_sid_string(cff, sid);
}

function cff_cmap_unicode_init(unicodes)
{
    var face = __FT_CharmapRec(unicodes).face;
    var cff = face.extra.data;
    var charset = cff.charset;
    var psnames = cff.psnames;

    /* can't build Unicode map for CID-keyed font */
    /* because we don't know glyph names.         */
    if (charset.sids == null)
        return FT_Common.FT_Err_No_Unicode_Glyph_Name;

    return psnames.unicodes_init(face.memory, unicodes, cff.num_glyphs, cff_sid_to_glyph_name, null, face);
}

function cff_cmap_unicode_done(unicodes)
{
    unicodes.maps = null;
    unicodes.num_maps = 0;
}

function cff_cmap_unicode_char_index(unicodes, char_code)
{
    var face = __FT_CharmapRec(unicodes).face;
    var psnames = face.extra.data.psnames;

    return psnames.unicodes_char_index(unicodes, char_code);
}

function cff_cmap_unicode_char_next(unicodes, pchar_code)
{
    var face = __FT_CharmapRec(unicodes).face;
    var psnames = face.extra.data.psnames;

    return psnames.unicodes_char_next(unicodes, pchar_code);
}

var cff_cmap_unicode_class_rec = create_cmap_class_rec(102,cff_cmap_unicode_init,cff_cmap_unicode_done,cff_cmap_unicode_char_index,cff_cmap_unicode_char_next,null,null,null,null,null);

/******************************************************************************/
// cffobjs
/******************************************************************************/

function CFF_SizeRec()
{
    this.face = null;
    this.generic = null;
    this.metrics = new FT_Size_Metrics();
    this.internal = null;
    
    this.strike_index = 0;    /* 0xFFFFFFFF to indicate invalid */
}

function CFF_GlyphSlotRec()
{
    this.root = new FT_GlyphSlot();

    this.hint = 0;
    this.scaled = 0;

    this.x_scale = 0;
    this.y_scale = 0;
}

function CFF_InternalRec()
{
    this.topfont = null;
    this.subfonts = new Array(FT_Common.CFF_MAX_CID_FONTS);
}

function CFF_Transform()
{
    this.xx = 0;
    this.xy = 0;
    this.yx = 0;
    this.yy = 0;

    this.ox = 0;
    this.oy = 0;
}

function cff_size_get_globals_funcs(size)
{
    var face = size.face;
    var font = face.extra.data;
    var pshinter = font.pshinter;

    var module = face.driver.library.FT_Get_Module("pshinter");
    return (module != null && pshinter != null && pshinter.get_globals_funcs != null) ? pshinter.get_globals_funcs(module) : null;
}

function cff_size_done(cffsize)
{
    var internal = cffsize.internal;
    if (internal != null)
    {
        var funcs = cff_size_get_globals_funcs(size);
        if (funcs != null)
        {
            funcs.destroy(internal.topfont);

            for (var i = font.num_subfonts; i > 0; i--)
                funcs.destroy(internal.subfonts[i - 1]);
        }
        /* `internal' is freed by destroy_size (in ftobjs.c) */
    }
}

function cff_make_private_dict(subfont, priv)
{
    var cpriv = subfont.private_dict;
    var n = 0;
    priv.clear();

    var count = priv.num_blue_values = cpriv.num_blue_values;
    for (n = 0; n < count; n++)
        priv.blue_values[n] = cpriv.blue_values[n];

    count = priv.num_other_blues = cpriv.num_other_blues;
    for (n = 0; n < count; n++)
        priv.other_blues[n] = cpriv.other_blues[n];

    count = priv.num_family_blues = cpriv.num_family_blues;
    for (n = 0; n < count; n++)
        priv.family_blues[n] = cpriv.family_blues[n];

    count = priv.num_family_other_blues = cpriv.num_family_other_blues;
    for (n = 0; n < count; n++)
        priv.family_other_blues[n] = cpriv.family_other_blues[n];

    priv.blue_scale = cpriv.blue_scale;
    priv.blue_shift = cpriv.blue_shift;
    priv.blue_fuzz  = cpriv.blue_fuzz;

    priv.standard_width[0]  = cpriv.standard_width;
    priv.standard_height[0] = cpriv.standard_height;

    count = priv.num_snap_widths = cpriv.num_snap_widths;
    for (n = 0; n < count; n++)
        priv.snap_widths[n] = cpriv.snap_widths[n];

    count = priv.num_snap_heights = cpriv.num_snap_heights;
    for (n = 0; n < count; n++)
        priv.snap_heights[n] = cpriv.snap_heights[n];

    priv.force_bold     = cpriv.force_bold;
    priv.language_group = cpriv.language_group;
    priv.lenIV          = cpriv.lenIV;
}

function cff_size_init()
{
    var size = new CFF_SizeRec();
    var funcs = null;//cff_size_get_globals_funcs(size);

    if (funcs != null)
    {
        // TODO: global funcs...
    }

    FT_Error = 0;
    size.strike_index = 0xFFFFFFFF;
    return size;
}

function cff_size_select(size, strike_index)
{
    size.strike_index = strike_index;
    FT_Select_Metrics(size.face, strike_index);

    var funcs = cff_size_get_globals_funcs(size);

    if (funcs != null)
    {
        // TODO: global funcs...
    }

    return 0;
}

function cff_size_request(size, req)
{
    var face = size.face;
    if (0 != (face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES))
    {
        var sfnt = face.sfnt;
        
        var strike_index = sfnt.set_sbit_strike(face, req);
        if (FT_Error != 0)
            size.strike_index = 0xFFFFFFFF;
        else
            return cff_size_select(size, strike_index);
    }

    FT_Request_Metrics(size.face, req);

    var funcs = cff_size_get_globals_funcs(size);
    if (funcs != null)
    {
        // TODO: global funcs...
    }
    return 0;
}

function cff_slot_done(slot)
{
    slot.internal.glyph_hints = null;
}

function cff_slot_init(slot)
{
    var face     = slot.face;
    var font     = face.extra.data;
    var pshinter = font.pshinter;

    if (pshinter != null)
    {
        var module = face.driver.library.FT_Get_Module("pshinter");
        if (module != null)
        {
            slot.internal.glyph_hints = pshinter.get_t2_funcs(module);
        }
    }
    return 0;
}

function cff_strcpy(memory, source)
{
    var result = source;
    return result;
}

function remove_subset_prefix(name)
{
    var idx = 0;
    var length = name.length + 1;
    var continue_search = 1;

    while (continue_search)
    {
        if (length >= 7 && name.charCodeAt(6) == FT_Common.SYMBOL_CONST_MATH_PLUS)
        {
            for (idx = 0; idx < 6; idx++)
            {
                /* ASCII uppercase letters */
                var c = name.charCodeAt(idx);
                if (!(FT_Common.SYMBOL_CONST_A <= c && c <= FT_Common.SYMBOL_CONST_Z))
                    continue_search = 0;
            }

            if (continue_search)
            {
                name = name.substring(7);
                length -= 7;
            }
        }
        else
            continue_search = 0;
    }

    return name;
}

function remove_style(family_name, style_name)
{
    var family_name_length = family_name.length;
    var style_name_length  = style_name.length;

    if (family_name_length > style_name_length)
    {
        var idx = 0;
        for (idx = 1; idx <= style_name_length; idx++)
        {
            if (family_name.charCodeAt(family_name_length - idx) != style_name.charCodeAt(style_name_length - idx))
                break;
        }

        if (idx > style_name_length)
        {
            /* family_name ends with style_name; remove it */
            idx = family_name_length - style_name_length - 1;

            /* also remove special characters     */
            /* between real family name and style */
            while (idx > 0)
            {
                var c = family_name.charCodeAt(idx);
                if (c == FT_Common.SYMBOL_CONST_MATH_MINUS || c == FT_Common.SYMBOL_CONST_SPACE || c == FT_Common.SYMBOL_CONST__ || c == FT_Common.SYMBOL_CONST_MATH_PLUS)
                    break;
                
                --idx;
            }

            if (idx > 0)
                family_name = family_name.substring(0, idx);
        }
    }

    return family_name;
}

function cff_face_init(stream, face, face_index, num_params, params)
{
    var pure_cff = 1;
    var sfnt_format = 0;
    var flags = 0;
    var library = face.driver.library;

    var sfnt = library.FT_Get_Module_Interface("sfnt");
    if (sfnt == null)
        return FT_Common.FT_Err_Unknown_File_Format;

    var psnames = FT_FACE_FIND_GLOBAL_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_CMAPS);
    var pshinter = library.FT_Get_Module_Interface("pshinter");

    /* create input stream from resource */
    var error = stream.Seek(0);
    if (error != 0)
        return error;

    /* check whether we have a valid OpenType file */
    error = sfnt.init_face(stream, face, face_index, num_params, params);
    if (error == 0)
    {
        if (face.format_tag != FT_Common.TTAG_OTTO)
            return FT_Common.FT_Err_Unknown_File_Format;

        /* if we are performing a simple font format check, exit immediately */
        if (face_index < 0)
            return 0;

        /* UNDOCUMENTED!  A CFF in an SFNT can have only a single font. */
        if (face_index > 0)
            return FT_Common.FT_Err_Invalid_Argument;

        sfnt_format = 1;

        /* now, the font can be either an OpenType/CFF font, or an SVG CEF */
        /* font; in the latter case it doesn't have a `head' table         */
        face.goto_table(face, FT_Common.TTAG_head, stream);
        error = FT_Error;
        if (error == 0)
        {
            pure_cff = 0;

            /* load font directory */
            error = sfnt.load_face(stream, face, 0);
            if (error != 0)
                return error;
        }
        else
        {
            /* load the `cmap' table explicitly */
            error = sfnt.load_cmap(face, stream);
            if (error != 0)
                return error;

            /* XXX: we don't load the GPOS table, as OpenType Layout     */
            /* support will be added later to a layout library on top of */
            /* FreeType 2                                                */
        }

        /* now load the CFF part of the file */
        face.goto_table(face, FT_Common.TTAG_CFF, stream);
        error = FT_Error;
        if (error != 0)
            return error;
    }
    else
    {
        /* rewind to start of file; we are going to load a pure-CFF font */
        error = stream.Seek(0);
        if (error != 0)
            return error;
    }

    /* now load and parse the CFF table in the file */
    var cff = new CFF_FontRec();
    face.extra.data = cff;
    
    error = cff_font_load(library, stream, face_index, cff, pure_cff);
    if (error != 0)
        return error;

    cff.pshinter = pshinter;
    cff.psnames  = psnames;

    face.face_index = face_index;

    /* Complement the root flags with some interesting information. */
    /* Note that this is only necessary for pure CFF and CEF fonts; */
    /* SFNT based fonts use the `name' table instead.               */
    face.num_glyphs = cff.num_glyphs;
    var dict = cff.top_font.font_dict;

    /* we need the `PSNames' module for CFF and CEF formats */
    /* which aren't CID-keyed                               */
    if (dict.cid_registry == 0xFFFF && psnames == null)
        return FT_Common.FT_Err_Unknown_File_Format;

    if (dict.has_font_matrix == 0)
        dict.units_per_em = pure_cff ? 1000 : face.units_per_EM;

    /* Normalize the font matrix so that `matrix->xx' is 1; the */
    /* scaling is done with `units_per_em' then (at this point, */
    /* it already contains the scaling factor, but without      */
    /* normalization of the matrix).                            */
    /*                                                          */
    /* Note that the offsets must be expressed in integer font  */
    /* units.                                                   */
    var matrix = dict.font_matrix;
    var offset = dict.font_offset;
    var temp = Math.abs(matrix.yy);

    if (temp != 0x10000)
    {
        dict.units_per_em = FT_DivFix(dict.units_per_em, temp);

        matrix.xx = FT_DivFix(matrix.xx, temp);
        matrix.yx = FT_DivFix(matrix.yx, temp);
        matrix.xy = FT_DivFix(matrix.xy, temp);
        matrix.yy = FT_DivFix(matrix.yy, temp);
        offset.x  = FT_DivFix(offset.x,  temp);
        offset.y  = FT_DivFix(offset.y,  temp);
    }

    offset.x >>= 16;
    offset.y >>= 16;

    for (var i = cff.num_subfonts; i > 0; i--)
    {
        var sub = cff.subfonts[i - 1].font_dict;
        var top = cff.top_font.font_dict;

        if (sub.has_font_matrix == 1)
        {
            var scaling = 0;
            /* if we have a top-level matrix, */
            /* concatenate the subfont matrix */

            if (top.has_font_matrix == 1)
            {
                if (top.units_per_em > 1 && sub.units_per_em > 1)
                    scaling = Math.min(top.units_per_em, sub.units_per_em);
                else
                    scaling = 1;

                FT_Matrix_Multiply_Scaled(top.font_matrix, sub.font_matrix, scaling);
                FT_Vector_Transform_Scaled(sub.font_offset, top.font_matrix, scaling);

                sub.units_per_em = FT_MulDiv(sub.units_per_em, top.units_per_em, scaling);
            }
        }
        else
        {
            sub.font_matrix = top.font_matrix;
            sub.font_offset = top.font_offset;

            sub.units_per_em = top.units_per_em;
        }

        matrix = sub.font_matrix;
        offset = sub.font_offset;
        temp = Math.abs(matrix.yy);

        if (temp != 0x10000)
        {
            sub.units_per_em = FT_DivFix(sub.units_per_em, temp);

            matrix.xx = FT_DivFix(matrix.xx, temp);
            matrix.yx = FT_DivFix(matrix.yx, temp);
            matrix.xy = FT_DivFix(matrix.xy, temp);
            matrix.yy = FT_DivFix(matrix.yy, temp);
            offset.x  = FT_DivFix(offset.x,  temp);
            offset.y  = FT_DivFix(offset.y,  temp);
        }

        offset.x >>= 16;
        offset.y >>= 16;
    }

    if (pure_cff == 1)
    {
        var style_name = null;

        /* set up num_faces */
        face.num_faces = cff.num_faces;

        /* compute number of glyphs */
        if (dict.cid_registry != 0xFFFF)
            face.num_glyphs = cff.charset.max_cid + 1;
        else
            face.num_glyphs = cff.charstrings_index.count;

        /* set global bbox, as well as EM size */
        face.bbox.xMin = dict.font_bbox.xMin >> 16;
        face.bbox.yMin = dict.font_bbox.yMin >> 16;
        /* no `U' suffix here to 0xFFFF! */
        face.bbox.xMax = (dict.font_bbox.xMax + 0xFFFF) >> 16;
        face.bbox.yMax = (dict.font_bbox.yMax + 0xFFFF) >> 16;

        face.units_per_EM = dict.units_per_em & 0xFFFF;

        face.ascender  = face.bbox.yMax;
        face.descender = face.bbox.yMin;

        face.height = ((face.units_per_EM * 12) / 10);
        if (face.height < (face.ascender - face.descender))
            face.height = (face.ascender - face.descender);

        face.underline_position = (dict.underline_position >> 16);
        face.underline_thickness = (dict.underline_thickness >> 16);

        /* retrieve font family & style name */
        face.family_name = cff_index_get_name(cff, face_index);
        if (face.family_name != null)
        {
            var full = cff_index_get_sid_string(cff, dict.full_name);
            var fullp = 0;
            var family = face.family_name;
            var family_name = null;

            face.family_name = remove_subset_prefix(face.family_name);

            if (dict.family_name != 0)
            {
                family_name = cff_index_get_sid_string(cff, dict.family_name);
                if (family_name != null)
                    family = family_name;
            }

            var familyp = 0;
            var full_len = (full == null) ? 0 : full.length;
            var family_len = family.length;

            /* We try to extract the style name from the full name.   */
            /* We need to ignore spaces and dashes during the search. */
            if (full != null && family != null)
            {
                while (fullp < full_len)
                {
                    var _c1 = full.charCodeAt(fullp);
                    var _c2 = 0;
                    if (familyp < family_len)
                        _c2 = family.charCodeAt(familyp);

                    /* skip common characters at the start of both strings */
                    if (_c1 == _c2)
                    {
                        familyp++;
                        fullp++;
                        continue;
                    }

                    if (_c1 == FT_Common.SYMBOL_CONST_SPACE || _c1 == FT_Common.SYMBOL_CONST_MATH_MINUS)
                    {
                        fullp++;
                        continue;
                    }

                    if (_c2 == FT_Common.SYMBOL_CONST_SPACE || _c2 == FT_Common.SYMBOL_CONST_MATH_MINUS)
                    {
                        familyp++;
                        continue;
                    }

                    if (familyp >= family_len && fullp < full_len)
                    {
                        /* The full name begins with the same characters as the  */
                        /* family name, with spaces and dashes removed.  In this */
                        /* case, the remaining string in `fullp' will be used as */
                        /* the style name.                                       */
                        style_name = full.substring(fullp);

                        /* remove the style part from the family name (if present) */
                        face.family_name = remove_style(face.family_name, style_name);
                    }
                    break;
                }
            }
        }
        else
        {
            var cid_font_name = cff_index_get_sid_string(cff, dict.cid_font_name);
            /* do we have a `/FontName' for a CID-keyed font? */
            if (cid_font_name != null)
                face.family_name = cff_strcpy(memory, cid_font_name);
        }

        if (style_name != null)
            face.style_name = style_name;
        else /* assume "Regular" style if we don't know better */
            face.style_name = "Regular";

        /*******************************************************************/
        /*                                                                 */
        /* Compute face flags.                                             */
        /*                                                                 */
        flags = (FT_Common.FT_FACE_FLAG_SCALABLE | FT_Common.FT_FACE_FLAG_HORIZONTAL | FT_Common.FT_FACE_FLAG_HINTER);

        if (sfnt_format != 0)
            flags |= FT_Common.FT_FACE_FLAG_SFNT;

        /* fixed width font? */
        if (dict.is_fixed_pitch != 0)
            flags |= FT_Common.FT_FACE_FLAG_FIXED_WIDTH;

        /* XXX: WE DO NOT SUPPORT KERNING METRICS IN THE GPOS TABLE FOR NOW */

        face.face_flags = flags;
        /*******************************************************************/
        /*                                                                 */
        /* Compute style flags.                                            */
        /*                                                                 */
        flags = 0;

        if (dict.italic_angle != 0)
            flags |= FT_Common.FT_STYLE_FLAG_ITALIC;

        var weight = cff_index_get_sid_string(cff, dict.weight);
        if (weight != null)
            if (weight == "Bold" || weight == "Black")
                flags |= FT_Common.FT_STYLE_FLAG_BOLD;

        /* double check */
        if (0 == (flags & FT_Common.FT_STYLE_FLAG_BOLD) && face.style_name != null)
            if (!_strncmp(face.style_name, "Bold", 4) || !_strncmp(face.style_name, "Black", 5))
                flags |= FT_Common.FT_STYLE_FLAG_BOLD;

        face.style_flags = flags;
    }


    //#ifndef FT_CONFIG_OPTION_NO_GLYPH_NAMES
    /* CID-keyed CFF fonts don't have glyph names -- the SFNT loader */
    /* has unset this flag because of the 3.0 `post' table.          */
    if (dict.cid_registry == 0xFFFF)
        face.face_flags |= FT_Common.FT_FACE_FLAG_GLYPH_NAMES;
    //#endif

    if (dict.cid_registry != 0xFFFF && pure_cff == 1)
        face.face_flags |= FT_Common.FT_FACE_FLAG_CID_KEYED;


    /*******************************************************************/
    /*                                                                 */
    /* Compute char maps.                                              */
    /*                                                                 */

    /* Try to synthesize a Unicode charmap if there is none available */
    /* already.  If an OpenType font contains a Unicode "cmap", we    */
    /* will use it, whatever be in the CFF part of the file.          */
    var cmaprec = new FT_CharMapRec();
    var cmap = null;
    var nn = 0;
    var encoding = cff.encoding;

    var is_skip_unicode = 0;
    for (nn = 0; nn < face.num_charmaps; nn++)
    {
        cmap = face.charmaps[nn];

        /* Windows Unicode? */
        if (cmap.platform_id == FT_Common.TT_PLATFORM_MICROSOFT && cmap.encoding_id == FT_Common.TT_MS_ID_UNICODE_CS)
            is_skip_unicode = 1;

        /* Apple Unicode platform id? */
        if (cmap.platform_id == FT_Common.TT_PLATFORM_APPLE_UNICODE)
            is_skip_unicode = 1; /* Apple Unicode */
    }

    if (0 == is_skip_unicode)
    {
        /* since CID-keyed fonts don't contain glyph names, we can't */
        /* construct a cmap                                          */
        if (pure_cff == 1 && cff.top_font.font_dict.cid_registry != 0xFFFF)
            return error;

        //#ifdef FT_MAX_CHARMAP_CACHEABLE
        if (nn + 1 > FT_Common.FT_MAX_CHARMAP_CACHEABLE)
            return error;
        //#endif

        /* we didn't find a Unicode charmap -- synthesize one */
        cmaprec.face        = face;
        cmaprec.platform_id = FT_Common.TT_PLATFORM_MICROSOFT;
        cmaprec.encoding_id = FT_Common.TT_MS_ID_UNICODE_CS;
        cmaprec.encoding    = FT_Common.FT_ENCODING_UNICODE;

        nn = face.num_charmaps;

        FT_CMap_New(FT_CFF_CMAP_UNICODE_CLASS_REC_GET, null, cmaprec);
        error = FT_Error;
        if (error && FT_Common.FT_Err_No_Unicode_Glyph_Name != error)
            return error;
        error = 0;

        /* if no Unicode charmap was previously selected, select this one */
        if (face.charmap == null && nn != face.num_charmaps)
            face.charmap = face.charmaps[nn];
    }

    //#ifdef FT_MAX_CHARMAP_CACHEABLE
    if (nn > FT_Common.FT_MAX_CHARMAP_CACHEABLE)
        return error;
    //#endif

    if (encoding.count > 0)
    {
        var clazz = null;

        cmaprec.face = face;
        cmaprec.platform_id = FT_Common.TT_PLATFORM_ADOBE;  /* Adobe platform id */

        if (encoding.offset == 0)
        {
            cmaprec.encoding_id = FT_Common.TT_ADOBE_ID_STANDARD;
            cmaprec.encoding    = FT_Common.FT_ENCODING_ADOBE_STANDARD;
            clazz               = FT_CFF_CMAP_ENCODING_CLASS_REC_GET;
        }
        else if (encoding.offset == 1)
        {
            cmaprec.encoding_id = FT_Common.TT_ADOBE_ID_EXPERT;
            cmaprec.encoding    = FT_Common.FT_ENCODING_ADOBE_EXPERT;
            clazz               = FT_CFF_CMAP_ENCODING_CLASS_REC_GET;
        }
        else
        {
            cmaprec.encoding_id = FT_Common.TT_ADOBE_ID_CUSTOM;
            cmaprec.encoding    = FT_Common.FT_ENCODING_ADOBE_CUSTOM;
            clazz               = FT_CFF_CMAP_ENCODING_CLASS_REC_GET;
        }

        FT_CMap_New(clazz, null, cmaprec);
        error = FT_Error;
    }

    return error;
}

function cff_face_done(face)
{
    if (face == null)
        return;

    var sfnt = face.sfnt;

    if (sfnt != null)
        sfnt.done_face(face);

    var cff = face.extra.data;
    if (cff != null)
    {
        cff_font_done(cff);
        face.extra.data = null;
    }
}

function cff_driver_init(module)
{
    return 0;
}

function cff_driver_done(module)
{
}

/******************************************************************************/
// cffgload
/******************************************************************************/

var cff_argument_counts =
[
    0,  /* unknown */

    2 | FT_Common.CFF_COUNT_CHECK_WIDTH | FT_Common.CFF_COUNT_EXACT, /* rmoveto */
    1 | FT_Common.CFF_COUNT_CHECK_WIDTH | FT_Common.CFF_COUNT_EXACT,
    1 | FT_Common.CFF_COUNT_CHECK_WIDTH | FT_Common.CFF_COUNT_EXACT,

    0 | FT_Common.CFF_COUNT_CLEAR_STACK, /* rlineto */
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,

    0 | FT_Common.CFF_COUNT_CLEAR_STACK, /* rrcurveto */
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,
    0 | FT_Common.CFF_COUNT_CLEAR_STACK,

    13, /* flex */
    7,
    9,
    11,

    0 | FT_Common.CFF_COUNT_CHECK_WIDTH, /* endchar */

    2 | FT_Common.CFF_COUNT_CHECK_WIDTH, /* hstem */
    2 | FT_Common.CFF_COUNT_CHECK_WIDTH,
    2 | FT_Common.CFF_COUNT_CHECK_WIDTH,
    2 | FT_Common.CFF_COUNT_CHECK_WIDTH,

    0 | FT_Common.CFF_COUNT_CHECK_WIDTH, /* hintmask */
    0 | FT_Common.CFF_COUNT_CHECK_WIDTH, /* cntrmask */
    0, /* dotsection */

    1, /* abs */
    2,
    2,
    2,
    1,
    0,
    2,
    1,

    1, /* blend */

    1, /* drop */
    2,
    1,
    2,
    1,

    2, /* put */
    1,
    4,
    3,

    2, /* and */
    2,
    1,
    2,
    4,

    1, /* callsubr */
    1,
    0,

    2, /* hsbw */
    0,
    0,
    0,
    5, /* seac */
    4, /* sbw */
    2  /* setcurrentpoint */
];

function CFF_Builder()
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
    this.path_begun = 0;
    this.load_points = 0;
    this.no_recurse = 0;

    this.metrics_only = 0;

    this.hints_funcs = null;
    this.hints_globals = null;

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

        this.path_begun = 0;
        this.load_points = 0;
        this.no_recurse = 0;

        this.metrics_only = 0;

        this.hints_funcs = null;
        this.hints_globals = null;
    }
}

function CFF_Decoder_Zone()
{
    this.base = null;
    this.limit = 0;
    this.cursor = 0;
}

function CFF_Decoder()
{
    this.builder = new CFF_Builder();
    this.cff = null;

    this.stack = CreateIntArray(FT_Common.CFF_MAX_OPERANDS + 1);
    this.top = 0;

    this.zones = new Array(FT_Common.CFF_MAX_SUBRS_CALLS + 1);
    for (var i = 0; i < (FT_Common.CFF_MAX_SUBRS_CALLS + 1); i++)
        this.zones[i] = new CFF_Decoder_Zone();

    this.zone = 0;

    this.flex_state = 0;
    this.num_flex_vectors = 0;

    this.flex_vectors = new Array(7);
    for (var i = 0; i < 7; i++)
        this.flex_vectors[i] = new FT_Vector();

    this.glyph_width = 0;
    this.nominal_width = 0;

    this.read_width = 0;
    this.width_only = 0;
    this.num_hints = 0;
    this.buildchar = CreateIntArray(FT_Common.CFF_MAX_TRANS_ELEMENTS);

    this.num_locals = 0;
    this.num_globals = 0;

    this.locals_bias = 0;
    this.globals_bias = 0;

    this.locals = null;
    this.globals = null;

    this.glyph_names = null;   /* for pure CFF fonts only  */
    this.num_glyphs = 0;    /* number of glyphs in font */

    this.hint_mode = 0;

    this.seac = 0;

    this.clear = function()
    {
        this.builder.clear();
        this.cff = null;

        this.stack = CreateIntArray(FT_Common.CFF_MAX_OPERANDS + 1);
        for (var i = 0; i < (FT_Common.CFF_MAX_OPERANDS + 1); i++)
            this.stack[i] = 0;
        this.top = 0;

        for (var i = 0; i < (FT_Common.CFF_MAX_SUBRS_CALLS + 1); i++)
        {
            var p = this.zones[i];
            p.base = null;
            p.cursor = 0;
            p.limit = 0;
        }

        this.zone = 0;

        this.flex_state = 0;
        this.num_flex_vectors = 0;

        for (var i = 0; i < 7; i++)
        {
            this.flex_vectors[i].x = 0;
            this.flex_vectors[i].y = 0;
        }

        this.glyph_width = 0;
        this.nominal_width = 0;

        this.read_width = 0;
        this.width_only = 0;
        this.num_hints = 0;

        for (var i = 0; i < FT_Common.CFF_MAX_TRANS_ELEMENTS; i++)
            this.buildchar[i] = 0;

        this.num_locals = 0;
        this.num_globals = 0;

        this.locals_bias = 0;
        this.globals_bias = 0;

        this.locals = null;
        this.globals = null;

        this.glyph_names = null;   /* for pure CFF fonts only  */
        this.num_glyphs = 0;    /* number of glyphs in font */

        this.hint_mode = 0;

        this.seac = 0;
    }
}

function cff_builder_init(builder, face, size, glyph, hinting)
{
    builder.path_begun  = 0;
    builder.path_begun  = 0;
    builder.load_points = 1;

    builder.face   = face;
    builder.glyph  = glyph;
    builder.memory = face.memory;

    if (glyph != null)
    {
        var loader = glyph.internal.loader;

        builder.loader = loader;
        builder.base = loader.base.outline;
        builder.current = loader.current.outline;
        FT_GlyphLoader_Rewind(loader);

        builder.hints_globals = null;
        builder.hints_funcs = null;

        if (hinting && size != null)
        {
            var internal = size.internal;

            builder.hints_globals = internal.topfont;
            builder.hints_funcs = glyph.internal.glyph_hints;
        }
    }

    builder.pos_x = 0;
    builder.pos_y = 0;

    builder.left_bearing.x = 0;
    builder.left_bearing.y = 0;
    builder.advance.x      = 0;
    builder.advance.y      = 0;
}

function cff_builder_done(builder)
{
    var glyph = builder.glyph;
    if (glyph != null)
        EquatingOutline(glyph.outline, builder.base);
}

function cff_compute_bias(in_charstring_type, num_subrs)
{
    if (in_charstring_type == 1)
        return 0;
    else if (num_subrs < 1240)
        return 107;
    else if (num_subrs < 33900)
        return 1131;

    return 32768;
}

function cff_decoder_init(decoder, face, size, slot, hinting, hint_mode)
{
    var cff = face.extra.data;
    /* clear everything */
    decoder.clear();

    /* initialize builder */
    cff_builder_init(decoder.builder, face, size, slot, hinting);

    /* initialize Type2 decoder */
    decoder.cff = cff;
    decoder.num_globals = cff.global_subrs_index.count;
    decoder.globals = cff.global_subrs;
    decoder.globals_bias = cff_compute_bias(cff.top_font.font_dict.charstring_type, decoder.num_globals);

    decoder.hint_mode    = hint_mode;
}

function cff_decoder_prepare(decoder, size, glyph_index)
{
    var builder = decoder.builder;
    var cff = builder.face.extra.data;
    var sub = cff.top_font;

    /* manage CID fonts */
    if (cff.num_subfonts != 0)
    {
        var fd_index = cff_fd_select_get(cff.fd_select, glyph_index);

        if (fd_index >= cff.num_subfonts)
            return FT_Common.FT_Err_Invalid_File_Format;

        sub = cff.subfonts[fd_index];

        if (builder.hints_funcs != null && size != null)
        {
            var internal = size.internal;

            /* for CFFs without subfonts, this value has already been set */
            builder.hints_globals = internal.subfonts[fd_index];
        }
    }

    decoder.num_locals = sub.local_subrs_index.count;
    decoder.locals = sub.local_subrs;
    decoder.locals_bias = cff_compute_bias(decoder.cff.top_font.font_dict.charstring_type, decoder.num_locals);

    decoder.glyph_width   = sub.private_dict.default_width;
    decoder.nominal_width = sub.private_dict.nominal_width;

    return 0;
}

function _cff_check_points(builder, count)
{
    return FT_GLYPHLOADER_CHECK_POINTS(builder.loader, count, 0);
}

function cff_builder_add_point(builder, x, y, flag)
{
    var base = builder.base;
    var outline = builder.current;

    if (builder.load_points = 1)
    {
        var point = base.points[outline.points + outline.n_points];
        var control = base.tags[outline.tags + outline.n_points];

        point.x = x >> 16;
        point.y = y >> 16;
        base.tags[outline.tags + outline.n_points] = ((flag != 0) ? FT_Common.FT_CURVE_TAG_ON : FT_Common.FT_CURVE_TAG_CUBIC);
    }

    outline.n_points++;
}

function cff_builder_add_point1(builder, x, y)
{
    var error = _cff_check_points(builder, 1);
    if (error == 0)
        cff_builder_add_point(builder, x, y, 1);

    return error;
}

function cff_builder_add_contour(builder)
{
    if (builder.load_points == 0)
    {
        builder.current.n_contours++;
        return 0;
    }

    var base = builder.base;
    var outline = builder.current;
    var error = FT_GLYPHLOADER_CHECK_POINTS(builder.loader, 0, 1);
    if (error == 0)
    {
        if (outline.n_contours > 0)
            base.contours[outline.contours + outline.n_contours - 1] = (outline.n_points - 1);

        outline.n_contours++;
    }

    return error;
}

function cff_builder_start_point(builder, x, y)
{
    var error = 0;
    if (builder.path_begun == 0)
    {
        builder.path_begun = 1;
        error = cff_builder_add_contour(builder);
        if (error == 0)
            error = cff_builder_add_point1(builder, x, y);
    }
    return error;
}

function cff_builder_close_contour(builder)
{
    var base = builder.base;
    var outline = builder.current;

    if (outline == null)
        return;

    var first = (outline.n_contours <= 1) ? 0 : base.contours[outline.contours + outline.n_contours - 2] + 1;

    /* We must not include the last point in the path if it */
    /* is located on the first point.                       */
    if (outline.n_points > 1)
    {
        var p1 = base.points[outline.points + first];
        var p2 = base.points[outline.points + outline.n_points - 1];
        var control = base.tags[outline.tags + outline.n_points - 1];

        /* `delete' last point only if it coincides with the first    */
        /* point and if it is not a control point (which can happen). */
        if (p1.x == p2.x && p1.y == p2.y)
            if (control == FT_Common.FT_CURVE_TAG_ON)
                outline.n_points--;
    }

    if (outline.n_contours > 0)
    {
        /* Don't add contours only consisting of one point, i.e., */
        /* check whether begin point and last point are the same. */
        if (first == outline.n_points - 1)
        {
            outline.n_contours--;
            outline.n_points--;
        }
        else
            base.contours[outline.contours + outline.n_contours - 1] = (outline.n_points - 1);
    }
}

function cff_lookup_glyph_by_stdcharcode(cff, charcode)
{
    /* CID-keyed fonts don't have glyph names */
    if (null == cff.charset.sids)
        return -1;

    /* check range of standard char code */
    if (charcode < 0 || charcode > 255)
        return -1;

    /* Get code to SID mapping from `cff_standard_encoding'. */
    var glyph_sid = cff_get_standard_encoding(charcode);

    for (var n = 0; n < cff.num_glyphs; n++)
    {
        if (cff.charset.sids[n] == glyph_sid)
            return n;
    }

    return -1;
}

function cff_get_glyph_data(face, glyph_index)
{
    var cff = face.extra.data;
    return cff_index_access_element(cff.charstrings_index, glyph_index);
}

function cff_free_glyph_data(face, pointer, length)
{
    var cff = face.extra.data;
    cff_index_forget_element(cff.charstrings_index, pointer);
}

function cff_operator_seac(decoder, asb, adx, ady, bchar, achar)
{
    var builder = decoder.builder;
    var bchar_index, achar_index;
    var face = builder.face;

    if (decoder.seac != 0)
        return FT_Common.FT_Err_Syntax_Error;

    adx += decoder.builder.left_bearing.x;
    ady += decoder.builder.left_bearing.y;

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL
    /* Incremental fonts don't necessarily have valid charsets.        */
    /* They use the character code, not the glyph index, in this case. */
    if (face.internal.incremental_interface != null)
    {
        bchar_index = bchar;
        achar_index = achar;
    }
    else //#endif /* FT_CONFIG_OPTION_INCREMENTAL */
    {
        var cff = face.extra.data;
        bchar_index = cff_lookup_glyph_by_stdcharcode(cff, bchar);
        achar_index = cff_lookup_glyph_by_stdcharcode(cff, achar);
    }

    if (bchar_index < 0 || achar_index < 0)
        return FT_Common.FT_Err_Syntax_Error;

    /* If we are trying to load a composite glyph, do not load the */
    /* accent character and return the array of subglyphs.         */
    if (builder.no_recurse != 0)
    {
        var glyph  = builder.glyph;
        var loader = glyph.internal.loader;

        /* reallocate subglyph array if necessary */
        error = FT_GlyphLoader_CheckSubGlyphs(loader, 2);
        if (error != 0)
            return error;

        var subg = loader.base.subglyphs[loader.current.subglyphs];

        /* subglyph 0 = base character */
        subg.index = bchar_index;
        subg.flags = FT_Common.FT_SUBGLYPH_FLAG_ARGS_ARE_XY_VALUES | FT_Common.FT_SUBGLYPH_FLAG_USE_MY_METRICS;
        subg.arg1  = 0;
        subg.arg2  = 0;

        subg = loader.base.subglyphs[loader.current.subglyphs + 1];

        /* subglyph 1 = accent character */
        subg.index = achar_index;
        subg.flags = FT_Common.FT_SUBGLYPH_FLAG_ARGS_ARE_XY_VALUES;
        subg.arg1 = (adx >> 16);
        subg.arg2 = (ady >> 16);

        /* set up remaining glyph fields */
        glyph.num_subglyphs = 2;
        glyph.subglyphs     = loader.base.subglyphs;
        glyph.format = FT_Common.FT_GLYPH_FORMAT_COMPOSITE;

        loader.current.num_subglyphs = 2;
    }

    FT_GlyphLoader_Prepare(builder.loader);

    /* First load `bchar' in builder */
    var ret = cff_get_glyph_data(face, bchar_index);
    var error = ret.err;
    var charstring = ret.bytes;
    var charstring_len = ret.len;
    if (error == 0)
    {
        /* the seac operator must not be nested */
        decoder.seac = 1;
        error = cff_decoder_parse_charstrings(decoder, charstring, charstring_len);
        decoder.seac = 0;

        cff_free_glyph_data(face, charstring, charstring_len);

        if (error != 0)
            return error;
    }

    /* Save the left bearing, advance and glyph width of the base */
    /* character as they will be erased by the next load.         */

    var left_bearing = dublicate_vector(builder.left_bearing);
    var advance = dublicate_vector(builder.advance);
    var glyph_width = decoder.glyph_width;

    builder.left_bearing.x = 0;
    builder.left_bearing.y = 0;

    builder.pos_x = adx - asb;
    builder.pos_y = ady;

    /* Now load `achar' on top of the base outline. */
    ret = cff_get_glyph_data(face, achar_index);
    error = ret.err;
    charstring = ret.bytes;
    charstring_len = ret.len;
    if (error == 0)
    {
        /* the seac operator must not be nested */
        decoder.seac = 1;
        error = cff_decoder_parse_charstrings(decoder, charstring, charstring_len);
        decoder.seac = 0;

        cff_free_glyph_data(face, charstring, charstring_len);

        if (error != 0)
            return error;
    }

    /* Restore the left side bearing, advance and glyph width */
    /* of the base character.                                 */
    builder.left_bearing.x = left_bearing.x;
    builder.left_bearing.y = left_bearing.y;
    builder.advance.x = advance.x;
    builder.advance.y = advance.y;

    decoder.glyph_width  = glyph_width;

    builder.pos_x = 0;
    builder.pos_y = 0;

    return error;
}

function cff_decoder_parse_charstrings(decoder, charstring_base, charstring_len)
{
    var builder = decoder.builder;
    var charstring_type = decoder.cff.top_font.font_dict.charstring_type;

    /* set default width */
    decoder.num_hints  = 0;
    decoder.read_width = 1;

    /* compute random seed from stack address of parameter */
    var seed = parseInt(Math.random() * 0xFFFF);
    if (seed == 0)
        seed = 0x7384;

    /* initialize the decoder */
    decoder.top = 0;
    decoder.zone = 0;

    var zones = decoder.zones;
    var zone = 0;

    var tops = decoder.stack;
    var stack = decoder.top;

    var hinter = builder.hints_funcs;

    builder.path_begun = 0;

    zones[zone].base = dublicate_pointer(charstring_base);
    var limit = zones[zone].limit = charstring_base.pos + charstring_len;
    zones[zone].cursor = 0;
    var ip = dublicate_pointer(charstring_base);

    var error = 0;

    var x = builder.pos_x;
    var y = builder.pos_y;

    /* begin hints recording session, if any */
    if (hinter != null)
        hinter.open(hinter.hints);

    /* now execute loop */
    while (ip.pos < limit)
    {
        var op = 0;
        /********************************************************************/
        /*                                                                  */
        /* Decode operator or operand                                       */
        /*                                                                  */
        var v = ip.data[ip.pos];
        ip.pos++;
        if (v >= 32 || v == 28)
        {
            var shift = 16;
            var val = 0;

            /* this is an operand, push it on the stack */
            if (v == 28)
            {
                if (ip.pos + 1 >= limit)
                    return FT_Common.FT_Err_Invalid_File_Format;
                val = ((ip.data[ip.pos] << 8) | ip.data[ip.pos + 1]);
                if (val > FT_Common.m_s)
                    val = val - FT_Common.a_s;
                ip.pos += 2;
            }
            else if (v < 247)
                val = v - 139;
            else if (v < 251)
            {
                if (ip.pos >= limit)
                    return FT_Common.FT_Err_Invalid_File_Format;
                val = (v - 247) * 256 + ip.data[ip.pos] + 108;
                ip.pos++;
            }
            else if (v < 255)
            {
                if (ip.pos >= limit)
                    return FT_Common.FT_Err_Invalid_File_Format;
                val = -(v - 251) * 256 - ip.data[ip.pos] - 108;
                ip.pos++;
            }
            else
            {
                if (ip.pos + 3 >= limit)
                    return FT_Common.FT_Err_Invalid_File_Format;
                val = (ip.data[ip.pos] << 24 )| (ip.data[ip.pos + 1] << 16) | (ip.data[ip.po + 2] << 8) | ip.data[ip.pos + 3];
                ip.pos += 4;
                if (charstring_type == 2)
                    shift = 0;
            }
            if (decoder.top >= FT_Common.CFF_MAX_OPERANDS)
                return FT_Common.FT_Err_Stack_Overflow;

            val <<= shift;
            tops[decoder.top] = val;
            decoder.top++;
        }
        else
        {
            /* The specification says that normally arguments are to be taken */
            /* from the bottom of the stack.  However, this seems not to be   */
            /* correct, at least for Acroread 7.0.8 on GNU/Linux: It pops the */
            /* arguments similar to a PS interpreter.                         */
            var args = decoder.top;
            var num_args = args;

            /* find operator */
            op = FT_Common.cff_op_unknown;

            switch (v)
            {
                case 1:
                    op = FT_Common.cff_op_hstem;
                    break;
                case 3:
                    op = FT_Common.cff_op_vstem;
                    break;
                case 4:
                    op = FT_Common.cff_op_vmoveto;
                    break;
                case 5:
                    op = FT_Common.cff_op_rlineto;
                    break;
                case 6:
                    op = FT_Common.cff_op_hlineto;
                    break;
                case 7:
                    op = FT_Common.cff_op_vlineto;
                    break;
                case 8:
                    op = FT_Common.cff_op_rrcurveto;
                    break;
                case 9:
                    op = FT_Common.cff_op_closepath;
                    break;
                case 10:
                    op = FT_Common.cff_op_callsubr;
                    break;
                case 11:
                    op = FT_Common.cff_op_return;
                    break;
                case 12:
                {
                    if (ip.pos >= limit)
                        return FT_Common.FT_Err_Invalid_File_Format;
                    v = ip.data[ip.pos];
                    ip.pos++;
                    switch (v)
                    {
                        case 0:
                            op = FT_Common.cff_op_dotsection;
                            break;
                        case 1: /* this is actually the Type1 vstem3 operator */
                            op = FT_Common.cff_op_vstem;
                            break;
                        case 2: /* this is actually the Type1 hstem3 operator */
                            op = FT_Common.cff_op_hstem;
                            break;
                        case 3:
                            op = FT_Common.cff_op_and;
                            break;
                        case 4:
                            op = FT_Common.cff_op_or;
                            break;
                        case 5:
                            op = FT_Common.cff_op_not;
                            break;
                        case 6:
                            op = FT_Common.cff_op_seac;
                            break;
                        case 7:
                            op = FT_Common.cff_op_sbw;
                            break;
                        case 8:
                            op = FT_Common.cff_op_store;
                            break;
                        case 9:
                            op = FT_Common.cff_op_abs;
                            break;
                        case 10:
                            op = FT_Common.cff_op_add;
                            break;
                        case 11:
                            op = FT_Common.cff_op_sub;
                            break;
                        case 12:
                            op = FT_Common.cff_op_div;
                            break;
                        case 13:
                            op = FT_Common.cff_op_load;
                            break;
                        case 14:
                            op = FT_Common.cff_op_neg;
                            break;
                        case 15:
                            op = FT_Common.cff_op_eq;
                            break;
                        case 16:
                            op = FT_Common.cff_op_callothersubr;
                            break;
                        case 17:
                            op = FT_Common.cff_op_pop;
                            break;
                        case 18:
                            op = FT_Common.cff_op_drop;
                            break;
                        case 20:
                            op = FT_Common.cff_op_put;
                            break;
                        case 21:
                            op = FT_Common.cff_op_get;
                            break;
                        case 22:
                            op = FT_Common.cff_op_ifelse;
                            break;
                        case 23:
                            op = FT_Common.cff_op_random;
                            break;
                        case 24:
                            op = FT_Common.cff_op_mul;
                            break;
                        case 26:
                            op = FT_Common.cff_op_sqrt;
                            break;
                        case 27:
                            op = FT_Common.cff_op_dup;
                            break;
                        case 28:
                            op = FT_Common.cff_op_exch;
                            break;
                        case 29:
                            op = FT_Common.cff_op_index;
                            break;
                        case 30:
                            op = FT_Common.cff_op_roll;
                            break;
                        case 33:
                            op = FT_Common.cff_op_setcurrentpoint;
                            break;
                        case 34:
                            op = FT_Common.cff_op_hflex;
                            break;
                        case 35:
                            op = FT_Common.cff_op_flex;
                            break;
                        case 36:
                            op = FT_Common.cff_op_hflex1;
                            break;
                        case 37:
                            op = FT_Common.cff_op_flex1;
                            break;
                        default:
                            break;
                    }
                    break;
                }
                case 13:
                    op = FT_Common.cff_op_hsbw;
                    break;
                case 14:
                    op = FT_Common.cff_op_endchar;
                    break;
                case 16:
                    op = FT_Common.cff_op_blend;
                    break;
                case 18:
                    op = FT_Common.cff_op_hstemhm;
                    break;
                case 19:
                    op = FT_Common.cff_op_hintmask;
                    break;
                case 20:
                    op = FT_Common.cff_op_cntrmask;
                    break;
                case 21:
                    op = FT_Common.cff_op_rmoveto;
                    break;
                case 22:
                    op = FT_Common.cff_op_hmoveto;
                    break;
                case 23:
                    op = FT_Common.cff_op_vstemhm;
                    break;
                case 24:
                    op = FT_Common.cff_op_rcurveline;
                    break;
                case 25:
                    op = FT_Common.cff_op_rlinecurve;
                    break;
                case 26:
                    op = FT_Common.cff_op_vvcurveto;
                    break;
                case 27:
                    op = FT_Common.cff_op_hhcurveto;
                    break;
                case 29:
                    op = FT_Common.cff_op_callgsubr;
                    break;
                case 30:
                    op = FT_Common.cff_op_vhcurveto;
                    break;
                case 31:
                    op = FT_Common.cff_op_hvcurveto;
                    break;
                default:
                    break;
            }

            if (op == FT_Common.cff_op_unknown)
                continue;

            /* check arguments */
            var req_args = cff_argument_counts[op];
            if ((req_args & FT_Common.CFF_COUNT_CHECK_WIDTH) != 0)
            {
                if (num_args > 0 && decoder.read_width != 0)
                {
                    /* If `nominal_width' is non-zero, the number is really a      */
                    /* difference against `nominal_width'.  Else, the number here  */
                    /* is truly a width, not a difference against `nominal_width'. */
                    /* If the font does not set `nominal_width', then              */
                    /* `nominal_width' defaults to zero, and so we can set         */
                    /* `glyph_width' to `nominal_width' plus number on the stack   */
                    /* -- for either case.                                         */
                    var set_width_ok = 0;
                    switch (op)
                    {
                        case FT_Common.cff_op_hmoveto:
                        case FT_Common.cff_op_vmoveto:
                            set_width_ok = num_args & 2;
                            break;

                        case FT_Common.cff_op_hstem:
                        case FT_Common.cff_op_vstem:
                        case FT_Common.cff_op_hstemhm:
                        case FT_Common.cff_op_vstemhm:
                        case FT_Common.cff_op_rmoveto:
                        case FT_Common.cff_op_hintmask:
                        case FT_Common.cff_op_cntrmask:
                            set_width_ok = num_args & 1;
                            break;

                        case FT_Common.cff_op_endchar:
                            /* If there is a width specified for endchar, we either have */
                            /* 1 argument or 5 arguments.  We like to argue.             */
                            set_width_ok = ((num_args == 5) || (num_args == 1)) ? 1 : 0;
                            break;

                        default:
                            FT_Common.set_width_ok = 0;
                            break;
                    }

                    if (set_width_ok != 0)
                    {
                        decoder.glyph_width = decoder.nominal_width + (tops[stack] >> 16);

                        if (decoder.width_only != 0)
                        {
                            /* we only want the advance width; stop here */
                            break;
                        }

                        /* Consumed an argument. */
                        num_args--;
                    }
                }

                decoder.read_width = 0;
                req_args = 0;
            }

            req_args &= 0x000F;
            if (num_args < req_args)
                return FT_Common.FT_Err_Too_Few_Arguments;
            args     -= req_args;
            num_args -= req_args;

            /* At this point, `args' points to the first argument of the  */
            /* operand in case `req_args' isn't zero.  Otherwise, we have */
            /* to adjust `args' manually.                                 */

            /* Note that we only pop arguments from the stack which we    */
            /* really need and can digest so that we can continue in case */
            /* of superfluous stack elements.                             */

            switch (op)
            {
                case FT_Common.cff_op_hstem:
                case FT_Common.cff_op_vstem:
                case FT_Common.cff_op_hstemhm:
                case FT_Common.cff_op_vstemhm:
                    /* the number of arguments is always even here */
                    if (hinter != null)
                        hinter.stems(hinter.hints, (op == FT_Common.cff_op_hstem || op == FT_Common.cff_op_hstemhm) ? 1 : 0, num_args / 2, tops[args - (num_args & ~1)]);

                    decoder.num_hints += num_args / 2;
                    args = stack;
                    break;

                case FT_Common.cff_op_hintmask:
                case FT_Common.cff_op_cntrmask:
                    /* implement vstem when needed --                        */
                    /* the specification doesn't say it, but this also works */
                    /* with the 'cntrmask' operator                          */
                    /*                                                       */
                    if (num_args > 0)
                    {
                        if (hinter != null)
                            hinter.stems(hinter.hints, 0, num_args / 2, tops[args - (num_args & ~1)]);

                        decoder.num_hints += num_args / 2;
                    }

                    /* In a valid charstring there must be at least one byte */
                    /* after `hintmask' or `cntrmask' (e.g., for a `return'  */
                    /* instruction).  Additionally, there must be space for  */
                    /* `num_hints' bits.                                     */
                    if ((ip.pos + ((decoder.num_hints + 7) >> 3)) >= limit)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    if (hinter != null)
                    {
                        if (op == FT_Common.cff_op_hintmask)
                            hinter.hintmask(hinter.hints, builder.current.n_points, decoder.num_hints, ip);
                        else
                            hinter.counter(hinter.hints, decoder.num_hints, ip);
                    }

                    ip.pos += (decoder.num_hints + 7 ) >> 3;
                    args = stack;
                    break;

                case FT_Common.cff_op_rmoveto:
                    cff_builder_close_contour(builder);
                    builder.path_begun = 0;
                    x += tops[args - 2];
                    y += tops[args - 1];
                    args = stack;
                    break;

                case FT_Common.cff_op_vmoveto:
                    cff_builder_close_contour(builder);
                    builder.path_begun = 0;
                    y += tops[args - 1];
                    args = stack;
                    break;

                case FT_Common.cff_op_hmoveto:
                    cff_builder_close_contour(builder);
                    builder.path_begun = 0;
                    x += tops[args - 1];
                    args = stack;
                    break;

                case FT_Common.cff_op_rlineto:
                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, parseInt(num_args / 2)) != 0)
                        return error;

                    if (num_args < 2)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    args -= num_args & ~1;
                    while (args < decoder.top)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 2;
                    }
                    args = stack;
                    break;

                case FT_Common.cff_op_hlineto:
                case FT_Common.cff_op_vlineto:
                {
                    var phase = (op == FT_Common.cff_op_hlineto) ? 1 : 0;

                    if (num_args < 0)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    /* there exist subsetted fonts (found in PDFs) */
                    /* which call `hlineto' without arguments      */
                    if (num_args == 0)
                        break;

                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, num_args))
                        return error;

                    args = stack;
                    while (args < decoder.top)
                    {
                        if (phase == 1)
                            x += tops[args];
                        else
                            y += tops[args];

                        if (cff_builder_add_point1(builder, x, y) != 0)
                            return error;

                        args++;
                        phase ^= 1;
                    }
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_rrcurveto:
                {
                    if (num_args < 6)
                        return FT_Error.FT_Err_Too_Few_Arguments;

                    var nargs = num_args - num_args % 6;

                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, parseInt(nargs / 2)))
                        return error;

                    args -= nargs;
                    while (args < decoder.top)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 2];
                        y += tops[args + 3];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 4];
                        y += tops[args + 5];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 6;
                    }
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_vvcurveto:
                {
                    if (num_args < 4)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    /* if num_args isn't of the form 4n or 4n+1, */
                    /* we reduce it to 4n+1                      */
                    var nargs = num_args - num_args % 4;
                    if ((num_args - nargs) > 0)
                        nargs += 1;

                    if (cff_builder_start_point(builder, x, y) != 0)
                        return error;

                    args -= nargs;
                    if ((nargs & 1) != 0)
                    {
                        x += tops[args];
                        args++;
                        nargs--;
                    }

                    if (_cff_check_points(builder, 3 * parseInt(nargs / 4)))
                        return error;

                    while (args < decoder.top)
                    {
                        y += tops[args];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 1];
                        y += tops[args + 2];
                        cff_builder_add_point(builder, x, y, 0);
                        y += tops[args + 3];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 4;
                    }
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_hhcurveto:
                {
                    if (num_args < 4)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    /* if num_args isn't of the form 4n or 4n+1, */
                    /* we reduce it to 4n+1                      */
                    var nargs = num_args - num_args % 4;
                    if ((num_args - nargs) > 0)
                        nargs += 1;

                    if (cff_builder_start_point(builder, x, y) != 0)
                        return error;

                    args -= nargs;
                    if ((nargs & 1) != 0)
                    {
                        y += tops[args];
                        args++;
                        nargs--;
                    }

                    if (_cff_check_points(builder, 3 * parseInt(nargs / 4)))
                        return error;

                    while (args < decoder.top)
                    {
                        x += tops[args];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 1];
                        y += tops[args + 2];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 3];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 4;
                    }
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_vhcurveto:
                case FT_Common.cff_op_hvcurveto:
                {
                    if (cff_builder_start_point(builder, x, y) != 0)
                        return error;

                    if (num_args < 4)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    /* if num_args isn't of the form 8n, 8n+1, 8n+4, or 8n+5, */
                    /* we reduce it to the largest one which fits             */
                    var nargs = num_args - num_args % 4;
                    if ((num_args - nargs) > 0)
                        nargs += 1;

                    args -= nargs;
                    if (_cff_check_points(builder, parseInt(nargs / 4) * 3))
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    var phase = (op == FT_Common.cff_op_hvcurveto) ? 1 : 0;

                    while (nargs >= 4)
                    {
                        nargs -= 4;
                        if (phase == 1)
                        {
                            x += tops[args];
                            cff_builder_add_point(builder, x, y, 0);
                            x += tops[args + 1];
                            y += tops[args + 2];
                            cff_builder_add_point(builder, x, y, 0);
                            y += tops[args + 3];
                            if (nargs == 1)
                                x += tops[args + 4];
                            cff_builder_add_point(builder, x, y, 1);
                        }
                        else
                        {
                            y += tops[args];
                            cff_builder_add_point(builder, x, y, 0);
                            x += tops[args + 1];
                            y += tops[args + 2];
                            cff_builder_add_point(builder, x, y, 0);
                            x += tops[args + 3];
                            if (nargs == 1)
                                y += tops[args + 4];
                            cff_builder_add_point(builder, x, y, 1);
                        }
                        args  += 4;
                        phase ^= 1;
                    }
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_rlinecurve:
                {
                    if (num_args < 8)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    var nargs = num_args & ~1;
                    var num_lines = parseInt((nargs - 6) / 2);

                    if (cff_builder_start_point(builder, x, y) || _cff_check_points(builder, num_lines + 3))
                        return error;

                    args -= nargs;

                    /* first, add the line segments */
                    while (num_lines > 0)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 2;
                        num_lines--;
                    }

                    /* then the curve */
                    x += tops[args];
                    y += tops[args + 1];
                    cff_builder_add_point(builder, x, y, 0);
                    x += tops[args + 2];
                    y += tops[args + 3];
                    cff_builder_add_point(builder, x, y, 0);
                    x += tops[args + 4];
                    y += tops[args + 5];
                    cff_builder_add_point(builder, x, y, 1);
                    args = stack;
                    break;
                }

                case FT_Common.cff_op_rcurveline:
                {
                    if ( num_args < 8 )
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    var nargs  = num_args - 2;
                    nargs      = nargs - nargs % 6 + 2;
                    var num_curves = parseInt((nargs - 2) / 6);

                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, num_curves * 3 + 2))
                        return error;

                    args -= nargs;

                    /* first, add the curves */
                    while (num_curves > 0)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 2];
                        y += tops[args + 3];
                        cff_builder_add_point(builder, x, y, 0);
                        x += tops[args + 4];
                        y += tops[args + 5];
                        cff_builder_add_point(builder, x, y, 1);
                        args += 6;
                        num_curves--;
                    }

                    /* then the final line */
                    x += tops[args];
                    y += tops[args + 1];
                    cff_builder_add_point(builder, x, y, 1);
                    args = stack;

                    break;
                }

                case FT_Common.cff_op_hflex1:
                {
                    /* adding five more points: 4 control points, 1 on-curve point */
                    /* -- make sure we have enough space for the start point if it */
                    /* needs to be added                                           */
                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, 6))
                        return error;

                    /* record the starting point's y position for later use */
                    var start_y = y;

                    /* first control point */
                    x += tops[args];
                    y += tops[args + 1];
                    cff_builder_add_point(builder, x, y, 0);

                    /* second control point */
                    x += tops[args + 2];
                    y += tops[args + 3];
                    cff_builder_add_point(builder, x, y, 0);

                    /* join point; on curve, with y-value the same as the last */
                    /* control point's y-value                                 */
                    x += tops[args + 4];
                    cff_builder_add_point(builder, x, y, 1);

                    /* third control point, with y-value the same as the join */
                    /* point's y-value                                        */
                    x += tops[args + 5];
                    cff_builder_add_point(builder, x, y, 0);

                    /* fourth control point */
                    x += tops[args + 6];
                    y += tops[args + 7];
                    cff_builder_add_point(builder, x, y, 0);

                    /* ending point, with y-value the same as the start   */
                    x += tops[args + 8];
                    y  = start_y;
                    cff_builder_add_point(builder, x, y, 1);

                    args = stack;
                    break;
                }

                case FT_Common.cff_op_hflex:
                {
                    /* adding six more points; 4 control points, 2 on-curve points */
                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, 6))
                        return error;

                    /* record the starting point's y-position for later use */
                    var start_y = y;

                    /* first control point */
                    x += tops[args];
                    cff_builder_add_point(builder, x, y, 0);

                    /* second control point */
                    x += tops[args + 1];
                    y += tops[args + 2];
                    cff_builder_add_point(builder, x, y, 0);

                    /* join point; on curve, with y-value the same as the last */
                    /* control point's y-value                                 */
                    x += tops[args + 3];
                    cff_builder_add_point(builder, x, y, 1);

                    /* third control point, with y-value the same as the join */
                    /* point's y-value                                        */
                    x += tops[args + 4];
                    cff_builder_add_point(builder, x, y, 0);

                    /* fourth control point */
                    x += tops[args + 5];
                    y  = start_y;
                    cff_builder_add_point(builder, x, y, 0);

                    /* ending point, with y-value the same as the start point's */
                    /* y-value -- we don't add this point, though               */
                    x += tops[args + 6];
                    cff_builder_add_point(builder, x, y, 1);

                    args = stack;
                    break;
                }

                case FT_Common.cff_op_flex1:
                {
                    /* alter use                    */
                    var dx = 0, dy = 0;   /* used in horizontal/vertical  */

                    /* adding six more points; 4 control points, 2 on-curve points */
                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, 6) != 0)
                        return error;

                    /* record the starting point's x, y position for later use */
                    var start_x = x;
                    var start_y = y;

                    /* XXX: figure out whether this is supposed to be a horizontal */
                    /*      or vertical flex; the Type 2 specification is vague... */

                    var temp = args;
                    var count = 0;

                    /* grab up to the last argument */
                    for (count = 5; count > 0; count--)
                    {
                        dx += tops[temp];
                        dy += tops[temp + 1];
                        temp += 2;
                    }

                    if (dx < 0)
                        dx = -dx;
                    if (dy < 0)
                        dy = -dy;

                    /* strange test, but here it is... */
                    var horizontal = (dx > dy) ? 1 : 0;

                    for (count = 5; count > 0; count--)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, (count == 3) ? 1 : 0);
                        args += 2;
                    }

                    /* is last operand an x- or y-delta? */
                    if (horizontal == 1)
                    {
                        x += tops[args];
                        y  = start_y;
                    }
                    else
                    {
                        x  = start_x;
                        y += tops[args];
                    }

                    cff_builder_add_point(builder, x, y, 1);

                    args = stack;
                    break;
                }

                case FT_Common.cff_op_flex:
                {
                    if (cff_builder_start_point(builder, x, y) != 0 || _cff_check_points(builder, 6))
                        return error;

                    for (var count = 6; count > 0; count--)
                    {
                        x += tops[args];
                        y += tops[args + 1];
                        cff_builder_add_point(builder, x, y, (count == 4 || count == 1) ? 1 : 0);
                        args += 2;
                    }

                    args = stack;
                    break;
                }

                case FT_Common.cff_op_seac:
                    error = cff_operator_seac(decoder, tops[args], tops[args + 1], tops[args + 2], (tops[args + 3] >> 16), (tops[args + 4] >> 16));

                    /* add current outline to the glyph slot */
                    FT_GlyphLoader_Add(builder.loader);
                    return error;

                case FT_Common.cff_op_endchar:
                    /* We are going to emulate the seac operator. */
                    if (num_args >= 4)
                    {
                        /* Save glyph width so that the subglyphs don't overwrite it. */
                        var glyph_width = decoder.glyph_width;

                        error = cff_operator_seac(decoder, 0, tops[args - 4], tops[args - 3], (tops[args - 2] >> 16), (tops[args - 1] >> 16));
                        decoder.glyph_width = glyph_width;
                    }
                    else
                    {
                        cff_builder_close_contour(builder);

                        /* close hints recording session */
                        if (hinter != null)
                        {
                            if (hinter.close(hinter.hints, builder.current.n_points))
                                return FT_Common.FT_Err_Invalid_File_Format;

                            /* apply hints to the loaded glyph outline now */
                            hinter.apply(hinter.hints, builder.current, builder.hints_globals, decoder.hint_mode);
                        }

                        /* add current outline to the glyph slot */
                        FT_GlyphLoader_Add(builder.loader);
                    }

                    /* return now! */
                    return error;

                case FT_Common.cff_op_abs:
                    if (tops[args] < 0)
                        tops[args] = -tops[args];
                    args++;
                    break;

                case FT_Common.cff_op_add:
                    tops[args] += tops[args + 1];
                    args++;
                    break;

                case FT_Common.cff_op_sub:
                    tops[args] -= tops[args + 1];
                    args++;
                    break;

                case FT_Common.cff_op_div:
                    tops[args] = FT_DivFix(tops[args], tops[args + 1]);
                    args++;
                    break;

                case FT_Common.cff_op_neg:
                    tops[args] = -tops[args];
                    args++;
                    break;

                case FT_Common.cff_op_random:
                {
                    var Rand = seed;
                    if (Rand >= 0x8000)
                        Rand++;

                    tops[args] = Rand;
                    seed = FT_MulFix(seed, 0x10000 - seed);
                    if (seed == 0)
                        seed += 0x2873;
                    args++;

                    break;
                }

                case FT_Common.cff_op_mul:
                    tops[args] = FT_MulFix( args[0], args[1] );
                    args++;
                    break;

                case FT_Common.cff_op_sqrt:
                    if (tops[args] > 0)
                    {
                        var count = 9;
                        var root = tops[args];
                        var new_root = 0;
                        for (;;)
                        {
                            new_root = (root + FT_DivFix(tops[args], root) + 1) >> 1;
                            if (new_root == root || count <= 0)
                                break;
                            root = new_root;
                        }
                        tops[args] = new_root;
                    }
                    else
                        tops[args] = 0;
                    args++;
                    break;

                case FT_Common.cff_op_drop:
                    /* nothing */
                    break;

                case FT_Common.cff_op_exch:
                {
                    var tmp = tops[args];
                    tops[args] = tops[args + 1];
                    tops[args + 1] = tmp;
                    args += 2;

                    break;
                }

                case FT_Common.cff_op_index:
                {
                    var idx = (tops[args] >> 16);

                    if (idx < 0)
                        idx = 0;
                    else if (idx > num_args - 2)
                        idx = num_args - 2;
                    tops[args] = tops[args-(idx + 1)];
                    args++;

                    break;
                }

                case FT_Common.cff_op_roll:
                {
                    var count = (tops[args] >> 16);
                    var idx = (tops[args + 1] >> 16);

                    if (count <= 0)
                        count = 1;

                    args -= count;
                    if (args < stack)
                        return FT_Common.FT_Err_Too_Few_Arguments;

                    if (idx >= 0)
                    {
                        while (idx > 0)
                        {
                            var tmp = tops[args + count - 1];
                            for (var i = count - 2; i >= 0; i--)
                                tops[args + i + 1] = tops[args + i];
                            tops[args] = tmp;
                            idx--;
                        }
                    }
                    else
                    {
                        while (idx < 0)
                        {
                            var tmp = tops[args];
                            for (var i = 0; i < count - 1; i++)
                                tops[args + i] = tops[args + i + 1];
                            tops[args + count - 1] = tmp;
                            idx++;
                        }
                    }
                    args += count;

                    break;
                }

                case FT_Common.cff_op_dup:
                    tops[args + 1] = tops[args];
                    args += 2;
                    break;

                case FT_Common.cff_op_put:
                {
                    var val = tops[args];
                    var idx = (tops[args + 1] >> 16);

                    if (idx >= 0 && idx < FT_Common.CFF_MAX_TRANS_ELEMENTS)
                        decoder.buildchar[idx] = val;

                    break;
                }

                case FT_Common.cff_op_get:
                {
                    var idx = (tops[args] >> 16);
                    var val = 0;

                    if (idx >= 0 && idx < FT_Common.CFF_MAX_TRANS_ELEMENTS)
                        val = decoder.buildchar[idx];

                    tops[args] = val;
                    args++;

                    break;
                }

                case FT_Common.cff_op_store:
                    return FT_Common.FT_Err_Unimplemented_Feature;

                case FT_Common.cff_op_load:
                    return FT_Common.FT_Err_Unimplemented_Feature;

                case FT_Common.cff_op_dotsection:
                    /* this operator is deprecated and ignored by the parser */
                    break;

                case FT_Common.cff_op_closepath:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */
                    args = stack;
                    break;

                case FT_Common.cff_op_hsbw:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */
                    decoder.glyph_width = decoder.nominal_width + (tops[args + 1] >> 16);

                    decoder.builder.left_bearing.x = tops[args];
                    decoder.builder.left_bearing.y = 0;

                    x = decoder.builder.pos_x + tops[args];
                    y = decoder.builder.pos_y;
                    args = stack;
                    break;

                case FT_Common.cff_op_sbw:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */
                    decoder.glyph_width = decoder.nominal_width + (tops[args + 2] >> 16);

                    decoder.builder.left_bearing.x = tops[args];
                    decoder.builder.left_bearing.y = tops[args + 1];

                    x = decoder.builder.pos_x + tops[args];
                    y = decoder.builder.pos_y + tops[args + 1];
                    args = stack;
                    break;

                case FT_Common.cff_op_setcurrentpoint:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */
                    x = decoder.builder.pos_x + tops[args];
                    y = decoder.builder.pos_y + tops[args + 1];
                    args = stack;
                    break;

                case FT_Common.cff_op_callothersubr:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */

                    /* subsequent `pop' operands should add the arguments,       */
                    /* this is the implementation described for `unknown' other  */
                    /* subroutines in the Type1 spec.                            */
                    /*                                                           */
                    /* XXX Fix return arguments (see discussion below).          */
                    args -= 2 + (tops[args - 2] >> 16);
                    if (args < stack)
                        return FT_Common.FT_Err_Too_Few_Arguments;
                    break;

                case FT_Common.cff_op_pop:
                    /* this is an invalid Type 2 operator; however, there        */
                    /* exist fonts which are incorrectly converted from probably */
                    /* Type 1 to CFF, and some parsers seem to accept it         */

                    /* XXX Increasing `args' is wrong: After a certain number of */
                    /* `pop's we get a stack overflow.  Reason for doing it is   */
                    /* code like this (actually found in a CFF font):            */
                    /*                                                           */
                    /*   17 1 3 callothersubr                                    */
                    /*   pop                                                     */
                    /*   callsubr                                                */
                    /*                                                           */
                    /* Since we handle `callothersubr' as a no-op, and           */
                    /* `callsubr' needs at least one argument, `pop' can't be a  */
                    /* no-op too as it basically should be.                      */
                    /*                                                           */
                    /* The right solution would be to provide real support for   */
                    /* `callothersubr' as done in `t1decode.c', however, given   */
                    /* the fact that CFF fonts with `pop' are invalid, it is     */
                    /* questionable whether it is worth the time.                */
                    args++;
                    break;

                case FT_Common.cff_op_and:
                {
                    var cond = (tops[args] != 0 && tops[args + 1] != 0) ? 1 : 0;

                    tops[args] = (cond == 1) ? 0x10000 : 0;
                    args++;

                    break;
                }
                case FT_Common.cff_op_or:
                {
                    var cond = (tops[args] != 0 || tops[args + 1]) ? 1 : 0;

                    tops[args] = (cond == 1) ? 0x10000 : 0;
                    args++;

                    break;
                }

                case FT_Common.cff_op_eq:
                {
                    tops[args] = (tops[args] == 0) ? 0x10000 : 0;
                    args++;

                    break;
                }

                case FT_Common.cff_op_ifelse:
                {
                    if (tops[args + 2] > tops[args + 3])
                        tops[args] = tops[args + 1];
                    args++;

                    break;
                }

                case FT_Common.cff_op_callsubr:
                {
                    var idx = ((tops[args] >> 16) + decoder.locals_bias);

                    if (idx >= decoder.num_locals)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    if (zone >= FT_Common.CFF_MAX_SUBRS_CALLS)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    zones[zone].cursor = ip.pos - zones[zone].base.pos;  /* save current instruction pointer */

                    zone++;
                    zones[zone].base = dublicate_pointer(decoder.locals[idx]);
                    zones[zone].limit = (decoder.locals[idx + 1] != null) ? decoder.locals[idx + 1].pos : zones[zone].base.pos;
                    zones[zone].cursor = 0;

                    if (zones[zone].base == null || zones[zone].limit == zones[zone].base.pos)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    decoder.zone = zone;
                    ip = dublicate_pointer(zones[zone].base);
                    limit = zones[zone].limit;

                    break;
                }

                case FT_Common.cff_op_callgsubr:
                {
                    var idx = ((tops[args] >> 16) + decoder.globals_bias);

                    if (idx >= decoder.num_globals)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    if (zone >= FT_Common.CFF_MAX_SUBRS_CALLS)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    zones[zone].cursor = ip.pos - zones[zone].base.pos;  /* save current instruction pointer */

                    zone++;
                    zones[zone].base = dublicate_pointer(decoder.globals[idx]);
                    zones[zone].limit = (decoder.globals[idx + 1] != null) ? decoder.globals[idx + 1].pos : zones[zone].base.pos;
                    zones[zone].cursor = 0;

                    if (zones[zone].base == null || zones[zone].limit == zones[zone].base.pos)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    decoder.zone = zone;
                    ip = dublicate_pointer(zones[zone].base);
                    limit = zones[zone].limit;

                    break;
                }

                case FT_Common.cff_op_return:
                    if (decoder.zone <= 0)
                        return FT_Common.FT_Err_Invalid_File_Format;

                    decoder.zone--;
                    zone  = decoder.zone;
                    ip = dublicate_pointer(zones[zone].base);
                    ip.pos += zones[zone].cursor;
                    limit = zones[zone].limit;
                    break;

                default:
                    return FT_Common.FT_Err_Unimplemented_Feature;
            }

            decoder.top = args;

            if (decoder.top >= FT_Common.CFF_MAX_OPERANDS)
                return FT_Common.FT_Err_Stack_Overflow;

        } /* general operator processing */

    } /* while ip < limit */

    return error;
}

function cff_slot_load(glyph, size, glyph_index, load_flags)
{
    var face = glyph.face;
    var cff  = face.extra.data;

    var font_matrix = null;
    var font_offset = null;

    var hinting = 0;
    var force_scaling = 0;

    /* in a CID-keyed font, consider `glyph_index' as a CID and map */
    /* it immediately to the real glyph_index -- if it isn't a      */
    /* subsetted font, glyph_indices and CIDs are identical, though */
    if (cff.top_font.font_dict.cid_registry != 0xFFFF && cff.charset.cids != null)
    {
        /* don't handle CID 0 (.notdef) which is directly mapped to GID 0 */
        if (glyph_index != 0)
        {
            glyph_index = cff_charset_cid_to_gindex(cff.charset, glyph_index);
            if (glyph_index == 0)
                return FT_Common.FT_Err_Invalid_Argument;
        }
    }
    else if (glyph_index >= cff.num_glyphs)
        return FT_Common.FT_Err_Invalid_Argument;

    if ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0)
        load_flags |= (FT_Common.FT_LOAD_NO_SCALE | FT_Common.FT_LOAD_NO_HINTING);

    glyph.x_scale = 0x10000;
    glyph.y_scale = 0x10000;
    if (size != 0)
    {
        glyph.x_scale = size.metrics.x_scale;
        glyph.y_scale = size.metrics.y_scale;
    }

    var error = 0;

    //#ifdef TT_CONFIG_OPTION_EMBEDDED_BITMAPS

    /* try to load embedded bitmap if any              */
    /*                                                 */
    /* XXX: The convention should be emphasized in     */
    /*      the documents because it can be confusing. */
    if (size != null)
    {
        var cff_face = size.face;
        var sfnt = cff_face.sfnt;
        var stream = cff_face.stream;

        if (size.strike_index != 0xFFFFFFFF && sfnt.load_eblc != null && (load_flags & FT_Common.FT_LOAD_NO_BITMAP) == 0)
        {
            var metrics = new TT_SBit_MetricsRec();

            error = sfnt.load_sbit_image(face, size.strike_index, glyph_index, load_flags, stream, glyph.bitmap, metrics);

            if (error == 0)
            {
                glyph.outline.n_points   = 0;
                glyph.outline.n_contours = 0;

                glyph.metrics.width  = metrics.width << 6;
                glyph.metrics.height = metrics.height << 6;

                glyph.metrics.horiBearingX = metrics.horiBearingX << 6;
                glyph.metrics.horiBearingY = metrics.horiBearingY << 6;
                glyph.metrics.horiAdvance  = metrics.horiAdvance  << 6;

                glyph.metrics.vertBearingX = metrics.vertBearingX << 6;
                glyph.metrics.vertBearingY = metrics.vertBearingY << 6;
                glyph.metrics.vertAdvance  = metrics.vertAdvance  << 6;

                glyph.format = FT_Common.FT_GLYPH_FORMAT_BITMAP;

                if (load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT)
                {
                    glyph.bitmap_left = metrics.vertBearingX;
                    glyph.bitmap_top  = metrics.vertBearingY;
                }
                else
                {
                    glyph.bitmap_left = metrics.horiBearingX;
                    glyph.bitmap_top  = metrics.horiBearingY;
                }
                return error;
            }
        }
    }

    //#endif /* TT_CONFIG_OPTION_EMBEDDED_BITMAPS */

    /* return immediately if we only want the embedded bitmaps */
    if ((load_flags & FT_Common.FT_LOAD_SBITS_ONLY) != 0)
        return FT_Common.FT_Err_Invalid_Argument;

    /* if we have a CID subfont, use its matrix (which has already */
    /* been multiplied with the root matrix)                       */

    /* this scaling is only relevant if the PS hinter isn't active */
    if (cff.num_subfonts > 0)
    {
        var fd_index = cff_fd_select_get(cff.fd_select, glyph_index);

        if (fd_index >= cff.num_subfonts)
            fd_index = (cff.num_subfonts - 1);

        var top_upm = cff.top_font.font_dict.units_per_em;
        var sub_upm = cff.subfonts[fd_index].font_dict.units_per_em;

        font_matrix = dublicate_matrix(cff.subfonts[fd_index].font_dict.font_matrix);
        font_offset = dublicate_vector(cff.subfonts[fd_index].font_dict.font_offset);

        if (top_upm != sub_upm)
        {
            glyph.x_scale = FT_MulDiv(glyph.x_scale, top_upm, sub_upm);
            glyph.y_scale = FT_MulDiv(glyph.y_scale, top_upm, sub_upm);

            force_scaling = 1;
        }
    }
    else
    {
        font_matrix = dublicate_matrix(cff.top_font.font_dict.font_matrix);
        font_offset = dublicate_vector(cff.top_font.font_dict.font_offset);
    }

    glyph.outline.n_points   = 0;
    glyph.outline.n_contours = 0;

    hinting = ((load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0 && (load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0) ? 1 : 0;

    glyph.format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;  /* by default */

    var decoder = new CFF_Decoder();
    cff_decoder_init(decoder, face, size, glyph, hinting, FT_LOAD_TARGET_MODE(load_flags));

    if ((load_flags & FT_Common.FT_LOAD_ADVANCE_ONLY) != 0)
        decoder.width_only = 1;

    decoder.builder.no_recurse = ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0) ? 1 : 0;

    /* now load the unscaled outline */
    var ret = cff_get_glyph_data(face, glyph_index);
    error = ret.err;
    var charstring = ret.bytes;
    var charstring_len = ret.len;

    if (error == 0)
    {
        error = cff_decoder_prepare(decoder, size, glyph_index);
        if (error == 0)
        {
            error = cff_decoder_parse_charstrings(decoder, charstring, charstring_len);
            cff_free_glyph_data(face, charstring, charstring_len);
            charstring = null;

            if (error == 0)
            {
                //#ifdef FT_CONFIG_OPTION_INCREMENTAL
                /* Control data and length may not be available for incremental */
                /* fonts.                                                       */
                if (face.internal.incremental_interface != null)
                {
                    glyph.control_data = null;
                    glyph.control_len = 0;
                }
                else //#endif /* FT_CONFIG_OPTION_INCREMENTAL */
                {
                    var csindex = cff.charstrings_index;

                    if (csindex.offsets != null)
                    {
                        glyph.control_data = dublicate_pointer(csindex.bytes);
                        glyph.control_data.pos += csindex.offsets[glyph_index] - 1;
                        glyph.control_len = charstring_len;
                    }

                }
                cff_builder_done(decoder.builder);
            }
        }
    }
    /* XXX: anything to do for broken glyph entry? */

    //#ifdef FT_CONFIG_OPTION_INCREMENTAL

    /* Incremental fonts can optionally override the metrics. */
    if (error == 0 && face.internal.incremental_interface != null && face.internal.incremental_interface.funcs.get_glyph_metrics != null)
    {
        var metrics = new FT_Incremental_MetricsRec();

        metrics.bearing_x = decoder.builder.left_bearing.x;
        metrics.bearing_y = 0;
        metrics.advance   = decoder.builder.advance.x;
        metrics.advance_v = decoder.builder.advance.y;

        error = face.internal.incremental_interface.funcs.get_glyph_metrics(face.internal.incremental_interface.object, glyph_index, 0, metrics);

        decoder.builder.left_bearing.x = metrics.bearing_x;
        decoder.builder.advance.x      = metrics.advance;
        decoder.builder.advance.y      = metrics.advance_v;
    }

    //#endif /* FT_CONFIG_OPTION_INCREMENTAL */

    if (error == 0)
    {
        /* Now, set the metrics -- this is rather simple, as   */
        /* the left side bearing is the xMin, and the top side */
        /* bearing the yMax.                                   */

        /* For composite glyphs, return only left side bearing and */
        /* advance width.                                          */
        if ((load_flags & FT_Common.FT_LOAD_NO_RECURSE) != 0)
        {
            var internal = glyph.internal;

            glyph.metrics.horiBearingX = decoder.builder.left_bearing.x;
            glyph.metrics.horiAdvance  = decoder.glyph_width;
            internal.glyph_matrix           = dublicate_matrix(font_matrix);
            internal.glyph_delta            = dublicate_matrix(font_offset);
            internal.glyph_transformed      = 1;
        }
        else
        {
            var cbox = new FT_BBox();
            var metrics = glyph.metrics;
            var advance = new FT_Vector();
            var has_vertical_info = 0;

            /* copy the _unscaled_ advance width */
            metrics.horiAdvance = decoder.glyph_width;
            glyph.linearHoriAdvance = decoder.glyph_width;
            glyph.internal.glyph_transformed = 0;

            has_vertical_info = (face.vertical_info && face.vertical.number_Of_VMetrics > 0 && face.vertical.long_metrics) ? 1 : 0;

            /* get the vertical metrics from the vtmx table if we have one */
            if (has_vertical_info == 1)
            {
                var _ret = face.sfnt.get_metrics(face, 1, glyph_index);
                metrics.vertBearingY = _ret.bearing;
                metrics.vertAdvance  = _ret.advance;
            }
            else
            {
                /* make up vertical ones */
                if (face.os2.version != 0xFFFF)
                    metrics.vertAdvance = (face.os2.sTypoAscender - face.os2.sTypoDescender);
                else
                    metrics.vertAdvance = (face.horizontal.Ascender - face.horizontal.Descender);
            }

            glyph.linearVertAdvance = metrics.vertAdvance;

            glyph.format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

            glyph.outline.flags = 0;
            if (size != null && size.metrics.y_ppem < 24)
                glyph.outline.flags |= FT_Common.FT_OUTLINE_HIGH_PRECISION;

            glyph.outline.flags |= FT_Common.FT_OUTLINE_REVERSE_FILL;

            if (!(font_matrix.xx == 0x10000 && font_matrix.yy == 0x10000 && font_matrix.xy == 0 && font_matrix.yx == 0))
                FT_Outline_Transform(glyph.outline, font_matrix);

            if (!(font_offset.x == 0 && font_offset.y == 0))
                FT_Outline_Translate(glyph.outline, font_offset.x, font_offset.y);

            advance.x = metrics.horiAdvance;
            advance.y = 0;
            FT_Vector_Transform(advance, font_matrix);
            metrics.horiAdvance = advance.x + font_offset.x;

            advance.x = 0;
            advance.y = metrics.vertAdvance;
            FT_Vector_Transform(advance, font_matrix);
            metrics.vertAdvance = advance.y + font_offset.y;

            if ((load_flags & FT_Common.FT_LOAD_NO_SCALE) == 0 || force_scaling == 1)
            {
                /* scale the outline and the metrics */
                var cur = glyph.outline;
                var vecs = cur.points;
                var _vec = 0;
                var x_scale = glyph.x_scale;
                var y_scale = glyph.y_scale;

                /* First of all, scale the points */
                if (hinting == 0 || decoder.builder.hints_funcs == null)
                    for (var n = cur.n_points; n > 0; n--, _vec++)
                    {
                        vecs[_vec].x = FT_MulFix(vecs[_vec].x, x_scale);
                        vecs[_vec].y = FT_MulFix(vecs[_vec].y, y_scale);
                    }

                /* Then scale the metrics */
                metrics.horiAdvance = FT_MulFix(metrics.horiAdvance, x_scale);
                metrics.vertAdvance = FT_MulFix(metrics.vertAdvance, y_scale);
            }

            /* compute the other metrics */
            FT_Outline_Get_CBox(glyph.outline, cbox);

            metrics.width = cbox.xMax - cbox.xMin;
            metrics.height = cbox.yMax - cbox.yMin;

            metrics.horiBearingX = cbox.xMin;
            metrics.horiBearingY = cbox.yMax;

            if (has_vertical_info == 1)
                metrics.vertBearingX = metrics.horiBearingX - parseInt(metrics.horiAdvance / 2);
            else
            {
                if ((load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0)
                    ft_synthesize_vertical_metrics(metrics, metrics.vertAdvance);
            }
        }
    }

    return error;
}

/******************************************************************************/
// driver
/******************************************************************************/
function cff_get_kerning(face, left_glyph, right_glyph, kerning)
{
    var sfnt = face.sfnt;

    kerning.x = 0;
    kerning.y = 0;

    if (sfnt != null)
        kerning.x = sfnt.get_kerning(face, left_glyph, right_glyph);

    return 0;
}

function cff_Load_Glyph(slot, cffsize, glyph_index, load_flags)
{
    var size = cffsize;
    if (slot == null)
        return FT_Common.FT_Err_Invalid_Slot_Handle;

    /* check whether we want a scaled outline or bitmap */
    if (size == null)
        load_flags |= FT_Common.FT_LOAD_NO_SCALE | FT_Common.FT_LOAD_NO_HINTING;

    /* reset the size object if necessary */
    if (load_flags & FT_Common.FT_LOAD_NO_SCALE)
        size = null;

    if (size != null)
    {
        /* these two objects must have the same parent */
        if (cffsize.face != slot.face)
            return FT_Common.FT_Err_Invalid_Face_Handle;
    }

    /* now load the glyph outline if necessary */
    var error = cff_slot_load(slot, size, glyph_index, load_flags);

    /* force drop-out mode to 2 - irrelevant now */
    /* slot->outline.dropout_mode = 2; */
    return error;
}

function cff_get_advances(face, start, count, flags, advances)
{
    var slot = face.glyph;
    var error = 0;
    flags |= FT_Common.FT_LOAD_ADVANCE_ONLY;

    for (var nn = 0; nn < count; nn++)
    {
        error = cff_Load_Glyph(slot, face.size, start + nn, flags);
        if (error )
            break;

        advances[nn] = (flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) ? slot.linearVertAdvance : slot.linearHoriAdvance;
    }

    return error;
}

function cff_get_glyph_name(face, glyph_index, buffer, buffer_max)
{
    var font = face.extra.data;

    if (font.psnames == null)
        return FT_Common.FT_Err_Unknown_File_Format;

    /* first, locate the sid in the charset table */
    var sid = font.charset.sids[glyph_index];

    /* now, lookup the name itself */
    var gname = cff_index_get_sid_string(font, sid);

    if (gname != null)
        _mem_strcpyn1(buffer, gname, buffer_max);
        
    return 0;
}

function cff_get_name_index(face, glyph_name)
{
    var cff = face.extra.data;
    var charset = cff.charset;

    var psnames = FT_FACE_FIND_GLOBAL_SERVICE(face, FT_SERVICE_ID_POSTSCRIPT_CMAPS);
    if (psnames == null)
        return 0;

    var sid = 0;
    var name = "";
    for (var i = 0; i < cff.num_glyphs; i++)
    {
        sid = charset.sids[i];

        if (sid > 390)
            name = cff_index_get_string(cff, sid - 391);
        else
            name = psnames.adobe_std_strings(sid);

        if (name == null || name == "")
            continue;

        if (glyph_name == name)
            return i;
    }
    return 0;
}

var cff_service_glyph_dict = new FT_Service_GlyphDictRec(cff_get_glyph_name, cff_get_name_index);

function cff_ps_has_glyph_names(face)
{
    return ((face.face_flags & FT_Common.FT_FACE_FLAG_GLYPH_NAMES) > 0) ? 1 : 0;
}

function cff_ps_get_font_info(face)
{
    var cff = face.extra.data;
    var font_info = null;
    if (cff != null && cff.font_info == null)
    {
        var dict = cff.top_font.font_dict;
        font_info = new PS_FontInfoRec();

        font_info.version = cff_index_get_sid_string(cff, dict.version);
        font_info.notice = cff_index_get_sid_string(cff, dict.notice);
        font_info.full_name = cff_index_get_sid_string(cff, dict.full_name);
        font_info.family_name = cff_index_get_sid_string(cff, dict.family_name);
        font_info.weight = cff_index_get_sid_string(cff, dict.weight);

        font_info.italic_angle        = dict.italic_angle;
        font_info.is_fixed_pitch      = dict.is_fixed_pitch;
        font_info.underline_position  = dict.underline_position;
        font_info.underline_thickness = dict.underline_thickness;

        cff.font_info = font_info;
    }
    return { err : 0, font_info : font_info };
}

var cff_service_ps_info = new FT_Service_PsInfoRec(cff_ps_get_font_info, null, cff_ps_has_glyph_names, null, null);

function cff_get_ps_name(face)
{
    return face.extra.data.font_name;
}

var cff_service_ps_name = new FT_Service_PsFontNameRec(cff_get_ps_name);

function cff_get_cmap_info(charmap, cmap_info)
{
    var cmap = charmap.cmap;
    var library = __FT_CMapRec(cmap).charmap.face.driver.library;

    cmap_info.language = 0;
    cmap_info.format = 0;

    var error = 0;
    if (cmap.clazz != FT_CFF_CMAP_ENCODING_CLASS_REC_GET && cmap.clazz != FT_CFF_CMAP_UNICODE_CLASS_REC_GET)
    {
        var sfnt = library.FT_Get_Module("sfnt");
        var service = ft_module_get_service(sfnt, FT_SERVICE_ID_TT_CMAP);

        if (service != null && service.get_cmap_info != null)
            error = service.get_cmap_info(charmap, cmap_info);
    }
    return error;
}

var cff_service_get_cmap_info = new FT_Service_TTCMapsRec(cff_get_cmap_info);

function cff_get_ros(face, registry, ordering, supplement)
{
    var ret = {err : 0, registry : "", ordering : "", supplement : 0};
    var cff = face.extra.data;

    if (cff != null)
    {
        var dict = cff.top_font.font_dict;

        if (dict.cid_registry == 0xFFFF)
        {
            ret.err = FT_Common.FT_Err_Invalid_Argument;
            return ret;
        }

        if (cff.registry == null)
            cff.registry = cff_index_get_sid_string(cff, dict.cid_registry);
        ret.registry = cff.registry;

        if (cff.ordering == null)
            cff.ordering = cff_index_get_sid_string(cff, dict.cid_ordering);
        ret.ordering = cff.ordering;

        /*
         * XXX: According to Adobe TechNote #5176, the supplement in CFF
         *      can be a real number. We truncate it to fit public API
         *      since freetype-2.3.6.
         */
        ret.supplement = dict.cid_supplement;
    }

    return error;
}

function cff_get_is_cid(face)
{
    var ret = {err : 0, is_cid : 0};
    var cff = face.extra.data;

    if (cff != null)
    {
        var dict = cff.top_font.font_dict;

        if (dict.cid_registry != 0xFFFF)
            ret.is_cid = 1;
    }

    return ret;
}

function cff_get_cid_from_glyph_index(face, glyph_index)
{
    var ret = { err : 0, cid : 0};
    var cff = face.extra.data;

    if (cff != null)
    {
        var dict = cff.top_font.font_dict;

        if (dict.cid_registry == 0xFFFF || glyph_index > cff.num_glyphs)
        {
            ret.err = FT_Common.FT_Err_Invalid_Argument;
            return ret;
        }

        ret.cid = cff.charset.sids[glyph_index];
    }
    return ret;
}

var cff_service_cid_info = new FT_Service_CIDRec(cff_get_ros, cff_get_is_cid, cff_get_cid_from_glyph_index);

var FT_CFF_SERVICE_PS_INFO_GET         = cff_service_ps_info;
var FT_CFF_SERVICE_GLYPH_DICT_GET      = cff_service_glyph_dict;
var FT_CFF_SERVICE_PS_NAME_GET         = cff_service_ps_name;
var FT_CFF_SERVICE_GET_CMAP_INFO_GET   = cff_service_get_cmap_info;
var FT_CFF_SERVICE_CID_INFO_GET        = cff_service_cid_info;
var FT_CFF_CMAP_ENCODING_CLASS_REC_GET = cff_cmap_encoding_class_rec;
var FT_CFF_CMAP_UNICODE_CLASS_REC_GET  = cff_cmap_unicode_class_rec;
var FT_CFF_FIELD_HANDLERS_GET          = cff_field_handlers;

var cff_services = new Array(6);
cff_services[0] = new FT_ServiceDescRec(FT_SERVICE_ID_XF86_NAME,FT_XF86_FORMAT_CFF);
cff_services[1] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_INFO,FT_CFF_SERVICE_PS_INFO_GET);
cff_services[2] = new FT_ServiceDescRec(FT_SERVICE_ID_POSTSCRIPT_FONT_NAME,FT_CFF_SERVICE_PS_NAME_GET);
cff_services[3] = new FT_ServiceDescRec(FT_SERVICE_ID_GLYPH_DICT,FT_CFF_SERVICE_GLYPH_DICT_GET);
cff_services[4] = new FT_ServiceDescRec(FT_SERVICE_ID_TT_CMAP,FT_CFF_SERVICE_GET_CMAP_INFO_GET);
cff_services[5] = new FT_ServiceDescRec(FT_SERVICE_ID_CID,FT_CFF_SERVICE_CID_INFO_GET);

var FT_CFF_SERVICES_GET = cff_services;

function cff_get_interface(driver, module_interface)
{
    var result = ft_service_list_lookup(FT_CFF_SERVICES_GET, module_interface);
    if (result != null)
        return result;

    if (driver == null)
        return null;

    /* we pass our request to the `sfnt' module */
    var sfnt = driver.library.FT_Get_Module("sfnt");
    if (sfnt == null)
        return null;

    return sfnt.clazz.get_interface(sfnt, module_interface);
}

function CFF_Driver_Class()
{
    this.flags = 0x501;
    this.name = "cff";
    this.version = 0x10000;
    this.requires = 0x20000;

    this.module_interface = null;

    this.init = cff_driver_init;
    this.done = cff_driver_done;
    this.get_interface = cff_get_interface;

    this.face_object_size = 0;
    this.size_object_size = 0;
    this.slot_object_size = 0;

    this.init_face = cff_face_init;
    this.done_face = cff_face_done;

    this.init_size = cff_size_init;
    this.done_size = cff_size_done;

    this.init_slot = cff_slot_init;
    this.done_slot = cff_slot_done;

    //#ifdef FT_CONFIG_OPTION_OLD_INTERNALS
    this.set_char_sizes = ft_stub_set_char_sizes;
    this.set_pixel_sizes = ft_stub_set_pixel_sizes;
    //#endif

    this.load_glyph = cff_Load_Glyph;

    this.get_kerning = cff_get_kerning;
    this.attach_file = null;
    this.get_advances = cff_get_advances;

    this.request_size = cff_size_request;
    this.select_size = cff_size_select;
}

function CFF_Driver()
{
    this.clazz = null;      // FT_Module_Class
    this.library = null;    // FT_Library
    this.memory = null;     // FT_Memory
    this.generic = null;    // FT_Generic

    this.clazz = new CFF_Driver_Class();
    this.faces_list = [];
    this.extensions = null;
    this.glyph_loader = null;

    this.extension_component = null;

    this.open_face = function(stream, face_index)
    {
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

function create_cff_driver(library)
{
    var driver = new CFF_Driver();
    driver.library = library;
    driver.memory = library.Memory;

    return driver;
}