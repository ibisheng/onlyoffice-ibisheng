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

var FT_Error = 0;
function FT_Library()
{
    this.Memory = null;
    this.generic = new FT_Generic();
    this.version_major = 2;
    this.version_minor = 4;
    this.version_patch = 8;

    this.modules = [];
    this.renderers = [];
    this.cur_renderer = null;
    this.auto_hinter = null;

    this.raster_pool_size = 16384;
    this.raster_pool = null;

    this.m_bUseCIDs = true;

    this.tt_hint_props = new LibraryHintingParams();

    // #ifdef subpixel
    //FT_LcdFilter             lcd_filter;
    //FT_Int                   lcd_extra;        /* number of extra pixels */
    //FT_Byte                  lcd_weights[7];   /* filter weights, if any */
    //FT_Bitmap_LcdFilterFunc  lcd_filter_func;  /* filtering callback     */
    // #endif

    //#ifdef FT_CONFIG_OPTION_PIC
    //FT_PIC_Container   pic_container;
    //#endif

    this.Init = function()
    {
        this.Memory = new FT_Memory();
        //this.raster_pool = this.Memory.Alloc(this.raster_pool_size);
        // теперь пул для каждого рендерера свой
        // и он хранится непосредственно в рендерере.
        // если не создавать постоянно рендереры - то смысл такой же. У нас так и есть.
        this.FT_Add_Default_Modules();
    }
    this.FT_Add_Module = function(module)
    {
        var clazz = module.clazz;
        if (clazz == null)
            return FT_Common.FT_Err_Invalid_Argument;

        var version_control = (this.version_major << 16 | this.version_minor);
        if (clazz.requires > version_control)
            return FT_Common.FT_Err_Invalid_Version;

        var mod_count = this.modules.length;
        for (var i = 0; i < mod_count; i++)
        {
            var _module = this.modules[i];
            if (_module.clazz.name == clazz.name)
            {
                if (clazz.version < _module.clazz.version)
                    return FT_Common.FT_Err_Lower_Module_Version;
                this.modules.splice(i,1);
                break;
            }
        }

        var error = FT_Common.FT_Err_Ok;
        if ((clazz.flags & FT_Common.FT_MODULE_RENDERER) != 0)
        {
            error = this.ft_add_renderer(module);
            if (FT_Common.FT_Err_Ok != error)
            {
                //delete module;
                return error;
            }
        }
        if ((clazz.flags & FT_Common.FT_MODULE_HINTER) != 0)
        {
            this.auto_hinter = module;
        }
        if ((clazz.flags & 1) != 0)
        {
            if (0 == (clazz.flags & FT_Common.FT_MODULE_DRIVER_NO_OUTLINES))
            {
                module.glyph_loader = new FT_GlyphLoader();
            }
        }

        if (null != clazz.init)
            clazz.init(module);

        this.modules[mod_count] = module;
        return error;
    }
    this.FT_Add_Default_Modules = function()
    {
        // drivers
        var driver_tt = create_tt_driver(this);
        var driver_cff = create_cff_driver(this);
        var driver_t1 = create_t1_driver(this);
        //var driver_cid = create_cid_driver(this);
        this.FT_Add_Module(driver_tt);
        this.FT_Add_Module(driver_cff);
        this.FT_Add_Module(driver_t1);
        //this.FT_Add_Module(driver_cid);

        // modules
        var mod_ps_names = create_psnames_module(this);
        var mod_psaux = create_psaux_module(this);
        var mod_sfnt = create_sfnt_module(this);
        this.FT_Add_Module(mod_ps_names);
        this.FT_Add_Module(mod_psaux);
        this.FT_Add_Module(mod_sfnt);

        // autohinter
        this.auto_hinter = null;

        // renderers
        var mod_rend1 = create_renderer_smooth_module(this);
        this.FT_Add_Module(mod_rend1);
    }
    this.ft_add_renderer = function(module)
    {
        var error = FT_Common.FT_Err_Ok;
        var clazz = module.clazz;

        module.glyph_format = clazz.glyph_format;

        if ((clazz.glyph_format == FT_Common.FT_GLYPH_FORMAT_OUTLINE) && (clazz.raster_class.raster_new))
        {
            module.raster = new TRaster();
            error = clazz.raster_class.raster_new(this.Memory, module.raster);

            if (error != FT_Common.FT_Err_Ok)
                return error;

            module.raster_render = clazz.raster_class.raster_render;
            module.render = clazz.render_glyph;
        }

        this.renderers[this.renderers.length] = module;

        this.ft_set_current_renderer();
        return error;
    }
    this.ft_set_current_renderer = function()
    {
        this.cur_renderer = null;
        var count_r = this.renderers.length;
        for (var i = 0; i < count_r; i++)
        {
            if (this.renderers[i].glyph_format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
            {
                this.cur_renderer = this.renderers[i];
                return;
            }
        }
    }
    this.FT_Open_Face = function(args, face_index)
    {
        var face = null;
        var external_stream = (args.stream && (args.flags & 0x02) != 0) ? true : false;
        if (external_stream === true)
        {
            var stream = args.stream;

            // пробегаем по всем драйверам - и ищем первый, который сможет открыть
            var dr_len = this.modules.length;
            for (var i = 0; i < dr_len; i++)
            {
                if (0 == (this.modules[i].clazz.flags & FT_Common.FT_MODULE_FONT_DRIVER))
                    continue;

                var driver = this.modules[i];
                face = driver.open_face(stream, face_index);

                if (0 != FT_Error)
                {
                    //#ifdef FT_CONFIG_OPTION_MAC_FONTS
                    if (driver.clazz.name == "truetype" && ((FT_Error & 0xFF) == FT_Common.FT_Err_Table_Missing))
                    {
                        face = this.open_face_PS_from_sfnt_stream(stream, face_index);
                        if (FT_Error != 0)
                            return null;
                    }
                    //#endif
                }
                else
                {
                    break;
                }

                if ((FT_Error & 0xFF) != FT_Common.FT_Err_Unknown_File_Format)
                {
                    if (((FT_Error & 0xFF) == FT_Common.FT_Err_Invalid_Stream_Operation) ||
                        ((FT_Error & 0xFF) == FT_Common.FT_Err_Cannot_Open_Stream))
                    {
                        //#ifdef FT_CONFIG_OPTION_MAC_FONTS
                        face = this.load_mac_face(stream, face_index);
                        if (FT_Error == 0)
                            return face;
                        FT_Error = FT_Common.FT_Err_Unknown_File_Format;
                        face = null;
                        return face;
                        //#endif
                    }
                }
            }

            if (null == face)
                return face;

            face.face_flags |= (1 << 10);
            face.driver.faces_list[face.driver.faces_list.length] = face;

            if (face_index >= 0)
            {
                var slot = FT_New_GlyphSlot(face);
                slot = null;
                if (FT_Error != 0)
                {
                    face = null;
                    return null;
                }

                /* finally, allocate a size object for the face */
                {
                    var size = FT_New_Size(face);
                    if (FT_Error != 0)
                    {
                        face = null;
                        return null;
                    }

                    face.size = size;
                }
            }

            /* some checks */

            if ((face.face_flags & 1) != 0)
            {
                if (face.height < 0)
                    face.height = -face.height;

                if ((face.face_flags & (1 << 5)) == 0)
                    face.max_advance_height = face.height;
            }

            if ((face.face_flags & (1 << 1)) != 0)
            {
                var _num = face.num_fixed_sizes;
                for (var i = 0; i < _num; i++)
                {
                    var bsize = face.available_sizes[i];

                    if (bsize.height < 0)
                        bsize.height = -bsize.height;
                    if (bsize.x_ppem < 0)
                        bsize.x_ppem = -bsize.x_ppem;
                    if (bsize.y_ppem < 0)
                        bsize.y_ppem = -bsize.y_ppem;
                }
            }

            /* initialize internal face data */
            {
                var internal = face.internal;

                internal.transform_matrix.xx = 0x10000;
                internal.transform_matrix.xy = 0;
                internal.transform_matrix.yx = 0;
                internal.transform_matrix.yy = 0x10000;

                internal.transform_delta.x = 0;
                internal.transform_delta.y = 0;
            }

            FT_Error = FT_Common.FT_Err_Ok;
            return face;
        }
        // пока открываем только из уже созданного стрима
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
        return null;
    }

    this.open_face_PS_from_sfnt_stream = function(stream, face_index)
    {
    }
    this.load_mac_face = function(stream, face_index)
    {
    }

    this.FT_Get_Module_Interface = function(name)
    {
        var module = this.FT_Get_Module(name);
        return (null != module) ? module.clazz.module_interface : null;
    }
    this.FT_Get_Module = function(name)
    {
        var count = this.modules.length;
        for (var i = 0; i < count; i++)
        {
            if (this.modules[i].clazz.name == name)
                return this.modules[i];
        }
        return null;
    }
}

// API
function FT_Select_Size(face, strike_index)
{
    if (!face || (face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES) == 0)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    if (strike_index < 0 || strike_index >= face.num_fixed_sizes)
        return FT_Common.FT_Err_Invalid_Argument;

    var clazz = face.driver.clazz;
    if (clazz.select_size)
    {
        return clazz.select_size(face.size, strike_index);
    }

    FT_Select_Metrics(face, strike_index);
    return FT_Common.FT_Err_Ok;
}

function FT_Select_Metrics(face, strike_index)
{
    var metrics = face.size.metrics;
    var bsize   = face.available_sizes[strike_index];

    metrics.x_ppem = (FT_Common.IntToUInt(bsize.x_ppem + 32) >>> 6) & 0xFFFF;
    metrics.y_ppem = (FT_Common.IntToUInt(bsize.y_ppem + 32) >>> 6) & 0xFFFF;

    if ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        metrics.x_scale = FT_DivFix(bsize.x_ppem, face.units_per_EM);
        metrics.y_scale = FT_DivFix(bsize.y_ppem, face.units_per_EM);

        ft_recompute_scaled_metrics(face, metrics);
    }
    else
    {
        metrics.x_scale     = 1 << 16;
        metrics.y_scale     = 1 << 16;
        metrics.ascender    = bsize.y_ppem;
        metrics.descender   = 0;
        metrics.height      = bsize.height << 6;
        metrics.max_advance = bsize.x_ppem;
    }
}

function ft_recompute_scaled_metrics(face, metrics)
{
    metrics.ascender    = FT_PIX_CEIL(FT_MulFix(face.ascender, metrics.y_scale));
    metrics.descender   = FT_PIX_FLOOR(FT_MulFix(face.descender, metrics.y_scale));
    metrics.height      = FT_PIX_ROUND(FT_MulFix(face.height, metrics.y_scale));
    metrics.max_advance = FT_PIX_ROUND(FT_MulFix(face.max_advance_width, metrics.x_scale));
}

function FT_Request_Size(face, req)
{
    var strike_index = 0;

    if (!face)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    if (!req || req.width < 0 || req.height < 0 || req.type >= FT_Common.FT_SIZE_REQUEST_TYPE_MAX)
        return FT_Common.FT_Err_Invalid_Argument;

    var clazz = face.driver.clazz;

    if (clazz.request_size)
    {
        return clazz.request_size(face.size, req);
    }

    if (((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) == 0) && ((face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES) != 0))
    {
        FT_Error = FT_Common.FT_Err_Ok;
        strike_index = FT_Match_Size(face, req, 0);
        var error = FT_Error;
        FT_Error = FT_Common.FT_Err_Ok;
        if (error != FT_Common.FT_Err_Ok)
            return error;

        return FT_Select_Size(face, strike_index);
    }

    FT_Request_Metrics(face, req);
    return FT_Common.FT_Err_Ok;
}

function FT_Request_Metrics(face, req)
{
    var metrics = face.size.metrics;

    if ((face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE) != 0)
    {
        var w = 0, h = 0, scaled_w = 0, scaled_h = 0;

        switch (req.type)
        {
            case FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL:
                w = h = face.units_per_EM;
                break;

            case FT_Common.FT_SIZE_REQUEST_TYPE_REAL_DIM:
                w = h = face.ascender - face.descender;
                break;

            case FT_Common.FT_SIZE_REQUEST_TYPE_BBOX:
                w = face.bbox.xMax - face.bbox.xMin;
                h = face.bbox.yMax - face.bbox.yMin;
                break;

            case FT_Common.FT_SIZE_REQUEST_TYPE_CELL:
                w = face.max_advance_width;
                h = face.ascender - face.descender;
                break;

            case FT_Common.FT_SIZE_REQUEST_TYPE_SCALES:
                metrics.x_scale = req.width;
                metrics.y_scale = req.height;
                if (metrics.x_scale == 0)
                    metrics.x_scale = metrics.y_scale;
                else if (metrics.y_scale == 0)
                    metrics.y_scale = metrics.x_scale;

                scaled_w = FT_MulFix(face.units_per_EM, metrics.x_scale);
                scaled_h = FT_MulFix(face.units_per_EM, metrics.y_scale);

                metrics.x_ppem = (FT_Common.IntToUInt(scaled_w + 32) >>> 6) & 0xFFFF;
                metrics.y_ppem = (FT_Common.IntToUInt(scaled_h + 32) >>> 6) & 0xFFFF;

                ft_recompute_scaled_metrics( face, metrics );
                return;

            case FT_Common.FT_SIZE_REQUEST_TYPE_MAX:
                break;
        }

        /* to be on the safe side */
        if (w < 0)
            w = -w;

        if (h < 0)
            h = -h;

        scaled_w = FT_REQUEST_WIDTH(req);
        scaled_h = FT_REQUEST_HEIGHT(req);

        if (req.width != 0)
        {
            metrics.x_scale = FT_DivFix(scaled_w, w);

            if (req.height != 0)
            {
                metrics.y_scale = FT_DivFix(scaled_h, h);

                if (req.type == FT_Common.FT_SIZE_REQUEST_TYPE_CELL)
                {
                    if (metrics.y_scale > metrics.x_scale)
                        metrics.y_scale = metrics.x_scale;
                    else
                        metrics.x_scale = metrics.y_scale;
                }
            }
            else
            {
                metrics.y_scale = metrics.x_scale;
                scaled_h = FT_MulDiv(scaled_w, h, w);
            }
        }
        else
        {
            metrics.x_scale = metrics.y_scale = FT_DivFix(scaled_h, h);
            scaled_w = FT_MulDiv(scaled_h, w, h);
        }

        if (req.type != FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL)
        {
            scaled_w = FT_MulFix(face.units_per_EM, metrics.x_scale);
            scaled_h = FT_MulFix(face.units_per_EM, metrics.y_scale);
        }

        metrics.x_ppem = (FT_Common.IntToUInt(scaled_w + 32) >>> 6) & 0xFFFF;
        metrics.y_ppem = (FT_Common.IntToUInt(scaled_h + 32) >>> 6) & 0xFFFF;

        ft_recompute_scaled_metrics(face, metrics);
    }
    else
    {
        metrics.x_ppem = 0;
        metrics.y_ppem = 0;

        metrics.ascender = 0;
        metrics.descender = 0;
        metrics.height = 0;
        metrics.max_advance = 0;

        metrics.x_scale = 1 << 16;
        metrics.y_scale = 1 << 16;
    }
}

function FT_REQUEST_WIDTH(req)
{
    return (req.horiResolution != 0) ? parseInt((req.width * req.horiResolution + 36) / 72) : req.width;
}

function FT_REQUEST_HEIGHT(req)
{
    return (req.vertResolution != 0) ? parseInt((req.height * req.vertResolution + 36) / 72) : req.height;
}

function FT_Match_Size(face, req, ignore_width)
{
    if ((face.face_flags & FT_Common.FT_FACE_FLAG_FIXED_SIZES) == 0)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Face_Handle;
        return 0;
    }

    if (req.type != FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL)
    {
        FT_Error = FT_Common.FT_Err_Unimplemented_Feature;
        return 0;
    }

    var w = FT_REQUEST_WIDTH(req);
    var h = FT_REQUEST_HEIGHT(req);

    if (req.width != 0 && req.height == 0)
        h = w;
    else if (req.width == 0 && req.height != 0)
        w = h;

    w = FT_PIX_ROUND(w);
    h = FT_PIX_ROUND(h);

    var num_fs = face.num_fixed_sizes;
    for (var i = 0; i < num_fs; i++)
    {
        var bsize = face.available_sizes[i];

        if (h != FT_PIX_ROUND(bsize.y_ppem))
            continue;

        if (w == FT_PIX_ROUND(bsize.x_ppem) || (ignore_width != 0))
        {
            FT_Error = 0;
            return i;
        }
    }

    FT_Error = FT_Common.FT_Err_Invalid_Pixel_Size;
    return 0;
}

function FT_Set_Char_Size(face, char_width, char_height, horz_resolution, vert_resolution)
{
    var req = new FT_Size_RequestRec();

    if (0 == char_width)
        char_width = char_height;
    else if (0 == char_height)
        char_height = char_width;

    if (0 == horz_resolution)
        horz_resolution = vert_resolution;
    else if (0 == vert_resolution)
        vert_resolution = horz_resolution;

    if (char_width < 64)
        char_width = 64;
    if (char_height < 64)
        char_height = 64;

    if (0 == horz_resolution)
        horz_resolution = vert_resolution = 72;

    req.type           = FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL;
    req.width          = char_width;
    req.height         = char_height;
    req.horiResolution = horz_resolution;
    req.vertResolution = vert_resolution;

    return FT_Request_Size(face, req);
}

function FT_Set_Pixel_Sizes(face, pixel_width, pixel_height)
{
    var req = new FT_Size_RequestRec();

    if (pixel_width == 0)
        pixel_width = pixel_height;
    else if (pixel_height == 0)
        pixel_height = pixel_width;

    if (pixel_width < 1)
        pixel_width = 1;
    if (pixel_height < 1)
        pixel_height = 1;

    /* use `>=' to avoid potential compiler warning on 16bit platforms */
    if (pixel_width >= 0xFFFF)
        pixel_width = 0xFFFF;
    if (pixel_height >= 0xFFFF)
        pixel_height = 0xFFFF;

    req.type           = FT_Common.FT_SIZE_REQUEST_TYPE_NOMINAL;
    req.width          = pixel_width << 6;
    req.height         = pixel_height << 6;
    req.horiResolution = 0;
    req.vertResolution = 0;

    return FT_Request_Size(face, req);
}

function FT_Get_First_Char(face)
{
    var result = {gindex:0,char_code:0};
    if (face && face.charmap && face.num_glyphs != 0)
    {
        result.gindex = FT_Get_Char_Index(face, 0);
        if (result.gindex == 0 || result.gindex >= face.num_glyphs)
            result = FT_Get_Next_Char(face, 0);
    }
    return result;
}

function FT_Get_Next_Char(face, charcode)
{
    var result = {gindex:0,char_code:0};
    if (face && face.charmap && face.num_glyphs != 0)
    {
        var code = charcode;
        var cmap = face.charmap;
        var _cmap = __FT_CMapRec(cmap);

        do
        {
            var _clazz = _cmap.clazz.clazz;
            if (undefined == _clazz)
                _clazz = _cmap.clazz;

            result = _clazz.char_next(cmap, code);
            code = result.char_code;
        } while (result.gindex >= face.num_glyphs);

        result.char_code = (result.gindex == 0) ? 0 : code;
    }
    return result;
}

function FT_Get_Char_Index(face, charcode)
{
    var result = 0;
    if (face && face.charmap)
    {
        var _clazz = __FT_CMapRec(face.charmap).clazz;
        if (undefined != _clazz.clazz)
            _clazz = _clazz.clazz;

        result = _clazz.char_index(face.charmap, charcode);
    }
    return result;
}

function FT_Get_Charmap_Index(charmap)
{
    if (!charmap || !charmap.face)
        return -1;

    var i = 0;
    for (; i < charmap.face.num_charmaps; i++)
        if (charmap.face.charmaps[i] == charmap)
            break;

    //#ifdef FT_MAX_CHARMAP_CACHEABLE
    if (i > 15)
        return -i;
    //#endif
    return i;
}

function FT_Set_Charmap(face, cmap)
{
    if (!face)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    var len = face.num_charmaps;
    if (0 == len)
        return FT_Common.FT_Err_Invalid_CharMap_Handle;

    if (FT_Get_CMap_Format(cmap) == 14)
        return FT_Common.FT_Err_Invalid_Argument;

    for (var i = 0; i < len; i++)
    {
        if (face.charmaps[i] == cmap)
        {
            //#ifdef FT_MAX_CHARMAP_CACHEABLE
            if (i > 15)
                continue;
            //#endif
            face.charmap = face.charmaps[i];
            return 0;
        }
    }
    return FT_Common.FT_Err_Invalid_Argument;
}

function FT_Get_CMap_Format(cmap)
{
    var charmap = __FT_CharmapRec(cmap);
    if (!charmap || !charmap.face)
        return -1;

    var service = FT_FACE_FIND_SERVICE(charmap.face, "tt-cmaps");

    if (service == null)
        return -1;

    var cmap_info = new TT_CMapInfo();
    service.get_cmap_info(cmap, cmap_info);
    if (FT_Error != 0)
        return -1;
    
    return cmap_info.format;
}


function FT_Glyph_Get_CBox(glyph, bbox_mode, acbox)
{
    acbox.xMin = acbox.yMin = acbox.xMax = acbox.yMax = 0;

    if (!glyph || !glyph.clazz)
        return;

    var clazz = glyph.clazz;
    if (!clazz.glyph_bbox)
        return;

    clazz.glyph_bbox(glyph, acbox);

    if (bbox_mode == FT_Common.FT_GLYPH_BBOX_GRIDFIT || bbox_mode == FT_Common.FT_GLYPH_BBOX_PIXELS)
    {
        acbox.xMin = FT_PIX_FLOOR(acbox.xMin);
        acbox.yMin = FT_PIX_FLOOR(acbox.yMin);
        acbox.xMax = FT_PIX_CEIL(acbox.xMax);
        acbox.yMax = FT_PIX_CEIL(acbox.yMax);
    }

    if (bbox_mode == FT_Common.FT_GLYPH_BBOX_TRUNCATE || bbox_mode == FT_Common.FT_GLYPH_BBOX_PIXELS)
    {
        acbox.xMin >>= 6;
        acbox.yMin >>= 6;
        acbox.xMax >>= 6;
        acbox.yMax >>= 6;
    }
}

function FT_Get_Glyph(slot)
{
    FT_Error = 0;
    var clazz = null;

    if (!slot)
        return FT_Common.FT_Err_Invalid_Slot_Handle;

    if (slot.format == FT_Common.FT_GLYPH_FORMAT_BITMAP)
        clazz = ft_bitmap_glyph_class;
    else if (slot.format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
        clazz = ft_outline_glyph_class;
    else
    {
        var render = FT_Lookup_Renderer(slot.library, slot.format);
        if (render)
            clazz = render.glyph_class;
    }

    if (!clazz)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Glyph_Format;
        return null;
    }

    var glyph = ft_new_glyph(slot.library, clazz);
    if (FT_Error != 0)
        return null;

    glyph.advance.x = slot.advance.x << 10;
    glyph.advance.y = slot.advance.y << 10;

    FT_Error = clazz.glyph_init(glyph, slot);

    if (FT_Error != 0)
    {
        FT_Done_Glyph(glyph);
        glyph = null;
    }
    else
        return glyph;

    return null;
}

function FT_Done_Glyph(glyph)
{
    return 0;
}

function FT_Get_Name_Index(face, glyph_name)
{
    if (face && ((face.face_flags & FT_Common.FT_FACE_FLAG_GLYPH_NAMES) != 0))
    {
        var service = face.internal.services.service_GLYPH_DICT;
        if (null != service)
            service = FT_FACE_FIND_SERVICE(face, "glyph-dict");

        if (service && service.name_index)
            return service.name_index(face, glyph_name);
    }
    return 0;
}
function FT_Get_Glyph_Name(face, glyph_index, buffer, buffer_max)
{
    if (face && (glyph_index <= face.num_glyphs) && ((face.face_flags & FT_Common.FT_FACE_FLAG_GLYPH_NAMES) != 0))
    {
        var service = face.internal.services.service_GLYPH_DICT;
        if (null != service)
            service = FT_FACE_FIND_SERVICE(face, "glyph-dict");

        if (service && service.get_name)
            return service.get_name(face, glyph_index, buffer, buffer_max);
    }
    return 0;
}

function FT_Get_X11_Font_Format(face)
{
    if (face)
        return FT_FACE_FIND_SERVICE(face, "xf86-driver-name");
    return null;
}

function FT_Lookup_Renderer(library, format)
{
    var r = library.renderers;
    var c = r.length;

    for (var i = 0; i < c; i++)
    {
        if (r[i].glyph_format == format)
            return r[i];
    }

    return null;
}

function FT_Set_Renderer(library, renderer)
{
    if (!library)
        return FT_Common.FT_Err_Invalid_Library_Handle;

    if (!renderer)
        return FT_Common.FT_Err_Invalid_Argument;

    if (renderer.glyph_format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
        library.cur_renderer = renderer;

    return 0;
}

function ft_lookup_glyph_renderer(slot)
{
    var library = slot.library;
    var res = library.cur_renderer;

    if (!res || (res.glyph_format != slot.format))
        res = FT_Lookup_Renderer(library, slot.format);

    return res;
}

function ft_set_current_renderer(library)
{
    library.cur_renderer = FT_Lookup_Renderer(library, FT_Common.FT_GLYPH_FORMAT_OUTLINE);
}



function FT_Load_Glyph(face, glyph_index, load_flags)
{
    if (!face || !face.size || !face.glyph)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    var slot = face.glyph;
    ft_glyphslot_clear(slot);

    var driver  = face.driver;
    var library = driver.library;
    var hinter  = library.auto_hinter;
    var autohint = false;

    /* resolve load flags dependencies */
    if (load_flags & FT_Common.FT_LOAD_NO_RECURSE)
        load_flags |= (FT_Common.FT_LOAD_NO_SCALE | FT_Common.FT_LOAD_IGNORE_TRANSFORM);

    if (load_flags & FT_Common.FT_LOAD_NO_SCALE)
    {
        load_flags |= (FT_Common.FT_LOAD_NO_HINTING | FT_Common.FT_LOAD_NO_BITMAP);
        load_flags &= ~FT_Common.FT_LOAD_RENDER;
    }

    // if (hinter && ...){}
    // TODO:

    if (true === autohint)
    {
        // TODO:
    }
    else
    {
        var error = driver.clazz.load_glyph(slot, face.size, glyph_index, load_flags);
        if (error != FT_Common.FT_Err_Ok)
            return error;

        if (slot.format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
        {
            /* check that the loaded outline is correct */
            error = FT_Outline_Check(slot.outline);
            if (error != FT_Common.FT_Err_Ok)
                return error;

            //#ifdef GRID_FIT_METRICS
            if (0 == (load_flags & FT_Common.FT_LOAD_NO_HINTING))
                ft_glyphslot_grid_fit_metrics( slot, ((load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT) != 0) ? true : false);
            //#endif
        }
    }

    /* compute the advance */
    if (0 != (load_flags & FT_Common.FT_LOAD_VERTICAL_LAYOUT))
    {
        slot.advance.x = 0;
        slot.advance.y = slot.metrics.vertAdvance;
    }
    else
    {
        slot.advance.x = slot.metrics.horiAdvance;
        slot.advance.y = 0;
    }

    /* compute the linear advance in 16.16 pixels */
    if ((load_flags & FT_Common.FT_LOAD_LINEAR_DESIGN) == 0 && (0 != (face.face_flags & FT_Common.FT_FACE_FLAG_SCALABLE)))
    {
        var metrics = face.size.metrics;

        /* it's tricky! */
        slot.linearHoriAdvance = FT_MulDiv(slot.linearHoriAdvance, metrics.x_scale, 64);
        slot.linearVertAdvance = FT_MulDiv(slot.linearVertAdvance, metrics.y_scale, 64);
    }

    if ((load_flags & FT_Common.FT_LOAD_IGNORE_TRANSFORM) == 0)
    {
        var internal = face.internal;

        /* now, transform the glyph image if needed */
        if (internal.transform_flags != 0)
        {
            /* get renderer */
            var renderer = ft_lookup_glyph_renderer(slot);
            if (renderer != null)
                error = renderer.clazz.transform_glyph(renderer, slot, internal.transform_matrix, internal.transform_delta);
            else if (slot.format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
            {
                /* apply `standard' transformation if no renderer is available */
                if ((internal.transform_flags & 1) != 0)
                    FT_Outline_Transform(slot.outline, internal.transform_matrix);

                if ((internal.transform_flags & 2) != 0)
                    FT_Outline_Translate(slot.outline, internal.transform_delta.x, internal.transform_delta.y);
            }

            /* transform advance */
            FT_Vector_Transform(slot.advance, internal.transform_matrix);
        }
    }

    /* do we need to render the image now? */
    if ((error == 0) && (slot.format != FT_Common.FT_GLYPH_FORMAT_BITMAP) && (slot.format != FT_Common.FT_GLYPH_FORMAT_COMPOSITE) && ((load_flags & FT_Common.FT_LOAD_RENDER) != 0))
    {
        var mode = FT_LOAD_TARGET_MODE(load_flags);

        if (mode == FT_Common.FT_RENDER_MODE_NORMAL && (load_flags & FT_Common.FT_LOAD_MONOCHROME))
            mode = FT_Common.FT_RENDER_MODE_MONO;

        error = FT_Render_Glyph(slot, mode);
    }
    return error;
}

function FT_Load_Char(face, char_code, load_flags)
{
    var glyph_index = 0;

    if ( !face )
        return FT_Common.FT_Err_Invalid_Face_Handle;

    glyph_index = char_code;
    if (face.charmap)
        glyph_index = FT_Get_Char_Index(face, char_code);

    return FT_Load_Glyph(face, glyph_index, load_flags);
}

function FT_Set_Transform(face, matrix, delta)
{
    if (!face)
        return;

    var internal = face.internal;
    internal.transform_flags = 0;

    var m = internal.transform_matrix;
    if (!matrix)
    {
        m.xx = 0x10000;
        m.xy = 0;
        m.yx = 0;
        m.yy = 0x10000;
    }
    else
    {
        m.xx = matrix.xx;
        m.xy = matrix.xy;
        m.yx = matrix.yx;
        m.yy = matrix.yy;
    }

    /* set transform_flags bit flag 0 if `matrix' isn't the identity */
    if ((m.xy | m.yx) != 0 || m.xx != 0x10000 || m.yy != 0x10000)
        internal.transform_flags |= 1;

    var d = internal.transform_delta;
    if (!delta)
    {
        d.x = 0;
        d.y = 0;
    }
    else
    {
        d.x = delta.x;
        d.y = delta.y;
    }

    /* set transform_flags bit flag 1 if `delta' isn't the null vector */
    if ((d.x | d.y) != 0)
        internal.transform_flags |= 2;
}

function FT_Render_Glyph(slot, render_mode)
{
    if (!slot || !slot.face)
        return FT_Common.FT_Err_Invalid_Argument;

    var library = slot.library;
    return FT_Render_Glyph_Internal(library, slot, render_mode);
}

function FT_Render_Glyph_Internal(library, slot, render_mode)
{
    var error = FT_Common.FT_Err_Ok;
    var renderer = null;
    var update = false;

    /* if it is already a bitmap, no need to do anything */
    switch (slot.format)
    {
        case FT_Common.FT_GLYPH_FORMAT_BITMAP:   /* already a bitmap, don't do anything */
            break;

        default:
        {
            /* small shortcut for the very common case */
            if (slot.format == FT_Common.FT_GLYPH_FORMAT_OUTLINE)
            {
                renderer = library.cur_renderer;
            }
            else
            {
                renderer = FT_Lookup_Renderer(library, slot.format);
            }

            error = FT_Common.FT_Err_Unimplemented_Feature;
            while (renderer != null)
            {
                error = renderer.render(renderer, slot, render_mode, null);
                if ((error == 0) || ((error & 0xFF) != FT_Common.FT_Err_Cannot_Render_Glyph))
                    break;

                renderer = FT_Lookup_Renderer(library, slot.format);
                update   = true;
            }
            if (error == 0 && update && renderer)
                FT_Set_Renderer(library, renderer);
        }
    }

    return error;
}

function FT_Get_Kerning(face, left_glyph, right_glyph, kern_mode, akerning)
{
    var error = FT_Common.FT_Err_Ok;

    if (!face)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    if (!akerning)
        return FT_Common.FT_Err_Invalid_Argument;

    var driver = face.driver;

    akerning.x = 0;
    akerning.y = 0;

    if (driver.clazz.get_kerning)
    {
        error = driver.clazz.get_kerning(face, left_glyph, right_glyph, akerning);
        if (error == FT_Common.FT_Err_Ok)
        {
            if (kern_mode != FT_Common.FT_KERNING_UNSCALED)
            {
                akerning.x = FT_MulFix(akerning.x, face.size.metrics.x_scale);
                akerning.y = FT_MulFix(akerning.y, face.size.metrics.y_scale);

                if (kern_mode != FT_Common.FT_KERNING_UNFITTED)
                {
                    if (face.size.metrics.x_ppem < 25)
                        akerning.x = FT_MulDiv(akerning.x, face.size.metrics.x_ppem, 25);
                    if (face.size.metrics.y_ppem < 25)
                        akerning.y = FT_MulDiv(akerning.y, face.size.metrics.y_ppem, 25);

                    akerning.x = FT_PIX_ROUND(akerning.x);
                    akerning.y = FT_PIX_ROUND(akerning.y);
                }
            }
        }
    }

    return error;
}

function FT_New_GlyphSlot(face)
{
    if (!face || !face.driver)
        return FT_Common.FT_Err_Invalid_Argument;

    var slot = null;
    var _slot = null;

    if (face.driver.clazz.name == "type1")
    {
        _slot = new T1_GlyphSlotRec();
        slot = _slot.root;
    }
    else
    {
        _slot = new FT_GlyphSlot();
        slot = _slot;
    }

    slot.face = face;
    FT_Error = ft_glyphslot_init(slot);
    if (FT_Error != 0)
    {
        ft_glyphslot_done(slot);
        return null;
    }

    slot.next  = face.glyph;
    face.glyph = slot;
    return slot;
}

function FT_GlyphLoader_New(memory)
{
    var loader = new FT_GlyphLoader();
    loader.memory = memory;
    return loader;
}

function ft_glyphslot_done(slot)
{
    return 0;
}

function FT_New_Size(face)
{
    if (!face)
        return FT_Common.FT_Err_Invalid_Face_Handle;

    if (!face.driver)
        return FT_Common.FT_Err_Invalid_Driver_Handle;

    var size = null;
    var clazz  = face.driver.clazz;
    
    FT_Error = 0;
    if (clazz.init_size)
    {
        size = clazz.init_size();
    }
    size.face = face;

    if (FT_Error == 0)
    {
        face.sizes_list[face.sizes_list.length] = size;
        return size;
    }

    return null;
}
function FT_CMap_New(clazz, init_data, charmap)
{
    FT_Error = 0;
    
    if (clazz == null || charmap == null || charmap.face == null)
    {
        FT_Error = FT_Common.FT_Err_Invalid_Argument;
        return null;
    }

    var _clazz = clazz.clazz;
    var face = charmap.face;
    var cmap = null;

    if (undefined != clazz.format)
    {
        switch (clazz.format)
        {
            case 4:
                cmap = new TT_CMap4Rec();
                break;
            case 12:
                cmap = new TT_CMap12Rec();
                break;
            case 13:
                cmap = new TT_CMap13Rec();
                break;
            case 14:
                cmap = new TT_CMap14Rec();
                break;
            default:
                cmap = new TT_CMapRec();
                break;
        }
    }
    else
    {
        switch (clazz.size)
        {
            case 101:
            case 102:
                cmap = new CFF_CMapStdRec();
                break;
            default:
                cmap = new TT_CMapRec();
        }
    }

    var cmap_ = __FT_CMapRec(cmap);
    if (undefined == _clazz)
        _clazz = clazz;

    if (null != cmap)
    {
        var charmap_= cmap_.charmap;
        charmap_.face = charmap.face;
        charmap_.encoding = charmap.encoding;
        charmap_.platform_id = charmap.platform_id;
        charmap_.encoding_id = charmap.encoding_id;

        cmap_.clazz = clazz;
        if (clazz.init != 0)
        {
            var error = _clazz.init(cmap, init_data);
            if (error != 0)
            {
                FT_Error = error;
                cmap = null;
                cmap_ = null;
                return null;
            }
        }
        if (null == face.charmaps)
            face.charmaps = new Array(1);
        face.charmaps[face.num_charmaps++] = cmap;
    }

    return cmap;
}
