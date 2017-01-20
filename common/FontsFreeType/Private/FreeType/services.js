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
//                                  SERVICES
/******************************************************************************/

/******************************************************************************/
// bdf
/******************************************************************************/
var FT_SERVICE_ID_BDF = "bdf";
function FT_Service_BDFRec(get_charset_id_,get_property_)
{
    this.get_charset_id = get_charset_id_;
    this.get_property = get_property_;
}
/******************************************************************************/
// cid
/******************************************************************************/
var FT_SERVICE_ID_CID = "CID";
function FT_Service_CIDRec(get_ros_, get_is_cid_, get_cid_from_glyph_index_)
{
    this.get_ros = get_ros_;
    this.get_is_cid = get_is_cid_;
    this.get_cid_from_glyph_index = get_cid_from_glyph_index_;
}
/******************************************************************************/
// glyph-dict
/******************************************************************************/
var FT_SERVICE_ID_GLYPH_DICT = "glyph-dict";
function FT_Service_GlyphDictRec(get_name_, name_index_)
{
    this.get_name = get_name_;
    this.name_index = name_index_;
}
/******************************************************************************/
// gxval
/******************************************************************************/
var FT_SERVICE_ID_GX_VALIDATE = "truetypegx-validate";
var FT_SERVICE_ID_CLASSICKERN_VALIDATE = "classickern-validate";

function FT_Service_GXvalidateRec(validate_)
{
    this.validate = validate_;
}
function FT_Service_CKERNvalidateRec(validate_)
{
    this.validate = validate_;
}
/******************************************************************************/
// kerning
/******************************************************************************/
var FT_SERVICE_ID_KERNING = "kerning";
function FT_Service_KerningRec(get_track_)
{
    this.get_track = get_track_;
}
/******************************************************************************/
// multi-masters
/******************************************************************************/
var FT_SERVICE_ID_MULTI_MASTERS = "multi-masters";
function FT_Service_MultiMastersRec(get_mm_, set_mm_design_, set_mm_blend_, get_mm_var_, set_var_design_)
{
    this.get_mm = get_mm_;
    this.set_mm_design = set_mm_design_;
    this.set_mm_blend = set_mm_blend_;
    this.get_mm_var = get_mm_var_;
    this.set_var_design = set_var_design_;
}
/******************************************************************************/
// opentype-validate
/******************************************************************************/
var FT_SERVICE_ID_OPENTYPE_VALIDATE = "opentype-validate";
function FT_Service_OTvalidateRec(validate_)
{
    this.validate = validate_;
}
/******************************************************************************/
// pfr-metrics
/******************************************************************************/
var FT_SERVICE_ID_PFR_METRICS = "pfr-metrics";
function FT_Service_PfrMetricsRec(get_metrics_,get_kerning_,get_advance_)
{
    this.get_metrics = get_metrics_;
    this.get_kerning = get_kerning_;
    this.get_advance = get_advance_;
}
/******************************************************************************/
// postscript-font-name
/******************************************************************************/
var FT_SERVICE_ID_POSTSCRIPT_FONT_NAME = "postscript-font-name";
function FT_Service_PsFontNameRec(get_ps_font_name_)
{
    this.get_ps_font_name = get_ps_font_name_;
}
/******************************************************************************/
// postscript-cmaps
/******************************************************************************/
var FT_SERVICE_ID_POSTSCRIPT_CMAPS = "postscript-cmaps";

function PS_UniMap()
{
    this.unicode;
    this.glyph_index;
}
function PS_UnicodesRec()
{
    this.cmap;
    this.num_maps;
    this.maps;
}
function FT_Service_PsCMapsRec(unicode_value_, unicodes_init_,unicodes_char_index_, unicodes_char_next_, macintosh_name_,
                                    adobe_std_strings_, adobe_std_encoding_, adobe_expert_encoding_)
{
    this.unicode_value = unicode_value_;

    this.unicodes_init = unicodes_init_;
    this.unicodes_char_index = unicodes_char_index_;
    this.unicodes_char_next = unicodes_char_next_;

    this.macintosh_name = macintosh_name_;
    this.adobe_std_strings = adobe_std_strings_;
    this.adobe_std_encoding = adobe_std_strings_;
    this.adobe_expert_encoding = adobe_expert_encoding_;
}
/******************************************************************************/
// postscript-info
/******************************************************************************/
var FT_SERVICE_ID_POSTSCRIPT_INFO = "postscript-info";
function FT_Service_PsInfoRec(get_font_info_, ps_get_font_extra_, has_glyph_names_,get_font_private_, get_font_value_)
{
    this.ps_get_font_info = get_font_info_;
    this.ps_get_font_extra = ps_get_font_extra_;
    this.ps_has_glyph_names = has_glyph_names_;
    this.ps_get_font_private = get_font_private_;
    this.ps_get_font_value = get_font_value_;
}
/******************************************************************************/
// sfnt-table
/******************************************************************************/
var FT_SERVICE_ID_SFNT_TABLE = "sfnt-table";
function FT_Service_SFNT_TableRec(load_, get_, info_)
{
    this.load_table = load_;
    this.get_table = get_;
    this.table_info = info_;
}
/******************************************************************************/
// tt-cmaps
/******************************************************************************/
var FT_SERVICE_ID_TT_CMAP = "tt-cmaps";
function TT_CMapInfo()
{
    this.language;
    this.format;
}
function FT_Service_TTCMapsRec(get_cmap_info_)
{
    this.get_cmap_info = get_cmap_info_;
}
/******************************************************************************/
// truetype-engine
/******************************************************************************/
var FT_SERVICE_ID_TRUETYPE_ENGINE = "truetype-engine";
function FT_Service_TrueTypeEngineRec(engine_type_)
{
    this.engine_type = engine_type_;
}
/******************************************************************************/
// tt-glyf
/******************************************************************************/
var FT_SERVICE_ID_TT_GLYF = "tt-glyf";
function FT_Service_TTGlyfRec(get_location_)
{
    this.get_location = get_location_;
}
/******************************************************************************/
// winfonts
/******************************************************************************/
var FT_SERVICE_ID_WINFNT = "winfonts";
function FT_Service_WinFntRec(get_header_)
{
    this.get_header = get_header_;
}
/******************************************************************************/
// xf86
/******************************************************************************/
var FT_SERVICE_ID_XF86_NAME  = "xf86-driver-name";
var FT_XF86_FORMAT_TRUETYPE  = "TrueType";
var FT_XF86_FORMAT_TYPE_1    = "Type 1";
var FT_XF86_FORMAT_BDF       = "BDF";
var FT_XF86_FORMAT_PCF       = "PCF";
var FT_XF86_FORMAT_TYPE_42   = "Type 42";
var FT_XF86_FORMAT_CID       = "CID Type 1";
var FT_XF86_FORMAT_CFF       = "CFF";
var FT_XF86_FORMAT_PFR       = "PFR";
var FT_XF86_FORMAT_WINFNT    = "Windows FNT";

/******************************************************************************/
function FT_ServiceDescRec(id,data)
{
    this.serv_id = id;
    this.serv_data = data;
}
function ft_service_list_lookup(service_descriptors,service_id)
{
    var c = service_descriptors.length;
    for (var i=0;i<c;i++)
    {
        if (service_descriptors[i].serv_id == service_id)
            return service_descriptors[i].serv_data;
    }
    return null;
}

function FT_FACE_FIND_SERVICE(face, id)
{
    var module = face.driver;
    if (module.clazz.get_interface)
        return module.clazz.get_interface(module, id);
    return null;
}
function FT_FACE_FIND_GLOBAL_SERVICE(face, name)
{
    return ft_module_get_service(face.driver, name);
}
function ft_module_get_service(module, name)
{
    var result = null;

    if (module != null)
    {
        if (null != module.clazz.get_interface)
            result = module.clazz.get_interface(module, name);
        if (null == result)
        {
            var modules = module.library.modules;
            var count = modules.length;
            for (var i = 0;i<count;i++)
            {
                if (modules[i].clazz.get_interface)
                {
                    result = modules[i].clazz.get_interface(modules[i], name);
                    if (null != result)
                        break;
                }
            }
        }
    }

    return result;
}

function FT_ServiceCache()
{
    this.service_POSTSCRIPT_FONT_NAME = null;
    this.service_MULTI_MASTERS = null;
    this.service_GLYPH_DICT = null;
    this.service_PFR_METRICS = null;
    this.service_WINFNT = null;
}