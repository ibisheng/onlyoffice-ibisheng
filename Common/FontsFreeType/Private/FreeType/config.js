function FT_MAKE_TAG(a,b,c,d)
{
    var r = a.charCodeAt(0) << 24 | b.charCodeAt(0) << 16 | c.charCodeAt(0) << 8 | d.charCodeAt(0);
    if (r < 0)
        r+=FT_Common.a_i;
    return r;
}
function _FT_Common()
{
// GENERATOR_START_CONSTANTS
    this.FT_ENCODING_NONE = 0;

    this.FT_ENCODING_MS_SYMBOL = FT_MAKE_TAG("s","y","m","b");
    this.FT_ENCODING_UNICODE = FT_MAKE_TAG("u","n","i","c");

    this.FT_ENCODING_SJIS = FT_MAKE_TAG("s","j","i","s");
    this.FT_ENCODING_GB2312 = FT_MAKE_TAG("g","b"," "," ");
    this.FT_ENCODING_BIG5 = FT_MAKE_TAG("b","i","g","5");
    this.FT_ENCODING_WANSUNG = FT_MAKE_TAG("w","a","n","s");
    this.FT_ENCODING_JOHAB = FT_MAKE_TAG("j","o","h","a");

    /* for backwards compatibility */
    this.FT_ENCODING_MS_SJIS    = this.FT_ENCODING_SJIS;
    this.FT_ENCODING_MS_GB2312  = this.FT_ENCODING_GB2312;
    this.FT_ENCODING_MS_BIG5    = this.FT_ENCODING_BIG5;
    this.FT_ENCODING_MS_WANSUNG = this.FT_ENCODING_WANSUNG;
    this.FT_ENCODING_MS_JOHAB   = this.FT_ENCODING_JOHAB;

    this.FT_ENCODING_ADOBE_STANDARD = FT_MAKE_TAG("A","D","O","B");
    this.FT_ENCODING_ADOBE_EXPERT = FT_MAKE_TAG("A","D","B","E");
    this.FT_ENCODING_ADOBE_CUSTOM = FT_MAKE_TAG("A","D","B","C");
    this.FT_ENCODING_ADOBE_LATIN_1 = FT_MAKE_TAG("l","a","t","1");

    this.FT_ENCODING_OLD_LATIN_2 = FT_MAKE_TAG("l","a","t","2");

    this.FT_ENCODING_APPLE_ROMAN = FT_MAKE_TAG("a","r","m","n");

    // modules types
    this.FT_MODULE_FONT_DRIVER        = 1;
    this.FT_MODULE_RENDERER           = 2;
    this.FT_MODULE_HINTER             = 4;
    this.FT_MODULE_STYLER             = 8;

    this.FT_MODULE_DRIVER_SCALABLE    = 0x100;
    this.FT_MODULE_DRIVER_NO_OUTLINES = 0x200;
    this.FT_MODULE_DRIVER_HAS_HINTER  = 0x400;

    // errors codes
    this.FT_Err_Ok                             = 0x00;
    this.FT_Err_Cannot_Open_Resource           = 0x01;
    this.FT_Err_Unknown_File_Format            = 0x02;
    this.FT_Err_Invalid_File_Format            = 0x03;
    this.FT_Err_Invalid_Version                = 0x04;
    this.FT_Err_Lower_Module_Version           = 0x05;
    this.FT_Err_Invalid_Argument               = 0x06;
    this.FT_Err_Unimplemented_Feature          = 0x07;
    this.FT_Err_Invalid_Table                  = 0x08;
    this.FT_Err_Invalid_Offset                 = 0x09;
    this.FT_Err_Array_Too_Large                = 0x0A;

    /* glyph/character errors */
    this.FT_Err_Invalid_Glyph_Index            = 0x10;
    this.FT_Err_Invalid_Character_Code         = 0x11;
    this.FT_Err_Invalid_Glyph_Format           = 0x12;
    this.FT_Err_Cannot_Render_Glyph            = 0x13;
    this.FT_Err_Invalid_Outline                = 0x14;
    this.FT_Err_Invalid_Composite              = 0x15;
    this.FT_Err_Too_Many_Hints                 = 0x16;
    this.FT_Err_Invalid_Pixel_Size             = 0x17;

    /* handle errors */
    this.FT_Err_Invalid_Handle                 = 0x20;
    this.FT_Err_Invalid_Library_Handle         = 0x21;
    this.FT_Err_Invalid_Driver_Handle          = 0x22;
    this.FT_Err_Invalid_Face_Handle            = 0x23;
    this.FT_Err_Invalid_Size_Handle            = 0x24;
    this.FT_Err_Invalid_Slot_Handle            = 0x25;
    this.FT_Err_Invalid_CharMap_Handle         = 0x26;
    this.FT_Err_Invalid_Cache_Handle           = 0x27;
    this.FT_Err_Invalid_Stream_Handle          = 0x28;

    /* driver errors */
    this.FT_Err_Too_Many_Drivers               = 0x30;
    this.FT_Err_Too_Many_Extensions            = 0x31;
    /* memory errors */

    this.FT_Err_Out_Of_Memory                  = 0x40;
    this.FT_Err_Unlisted_Object                = 0x41;

    /* stream errors */
    this.FT_Err_Cannot_Open_Stream             = 0x51;
    this.FT_Err_Invalid_Stream_Seek            = 0x52;
    this.FT_Err_Invalid_Stream_Skip            = 0x53;
    this.FT_Err_Invalid_Stream_Read            = 0x54;
    this.FT_Err_Invalid_Stream_Operation       = 0x55;
    this.FT_Err_Invalid_Frame_Operation        = 0x56;
    this.FT_Err_Nested_Frame_Access            = 0x57;
    this.FT_Err_Invalid_Frame_Read             = 0x58;

    /* raster errors */
    this.FT_Err_Raster_Uninitialized           = 0x60;
    this.FT_Err_Raster_Corrupted               = 0x61;
    this.FT_Err_Raster_Overflow                = 0x62;
    this.FT_Err_Raster_Negative_Height         = 0x63;

    /* cache errors */
    this.FT_Err_Too_Many_Caches                = 0x70;

    /* TrueType and SFNT errors */
    this.FT_Err_Invalid_Opcode                 = 0x80;
    this.FT_Err_Too_Few_Arguments              = 0x81;
    this.FT_Err_Stack_Overflow                 = 0x82;
    this.FT_Err_Code_Overflow                  = 0x83;
    this.FT_Err_Bad_Argument                   = 0x84;
    this.FT_Err_Divide_By_Zero                 = 0x85;
    this.FT_Err_Invalid_Reference              = 0x86;
    this.FT_Err_Debug_OpCode                   = 0x87;
    this.FT_Err_ENDF_In_Exec_Stream            = 0x88;
    this.FT_Err_Nested_DEFS                    = 0x89;
    this.FT_Err_Invalid_CodeRange              = 0x8A;
    this.FT_Err_Execution_Too_Long             = 0x8B;
    this.FT_Err_Too_Many_Function_Defs         = 0x8C;
    this.FT_Err_Too_Many_Instruction_Defs      = 0x8D;
    this.FT_Err_Table_Missing                  = 0x8E;
    this.FT_Err_Horiz_Header_Missing           = 0x8F;
    this.FT_Err_Locations_Missing              = 0x90;
    this.FT_Err_Name_Table_Missing             = 0x91;
    this.FT_Err_CMap_Table_Missing             = 0x92;
    this.FT_Err_Hmtx_Table_Missing             = 0x93;
    this.FT_Err_Post_Table_Missing             = 0x94;
    this.FT_Err_Invalid_Horiz_Metrics          = 0x95;
    this.FT_Err_Invalid_CharMap_Format         = 0x96;
    this.FT_Err_Invalid_PPem                   = 0x97;
    this.FT_Err_Invalid_Vert_Metrics           = 0x98;
    this.FT_Err_Could_Not_Find_Context         = 0x99;
    this.FT_Err_Invalid_Post_Table_Format      = 0x9A;
    this.FT_Err_Invalid_Post_Table             = 0x9B;

    /* CFF, CID, and Type 1 errors */
    this.FT_Err_Syntax_Error                   = 0xA0;
    this.FT_Err_Stack_Underflow                = 0xA1;
    this.FT_Err_Ignore                         = 0xA2;
    this.FT_Err_No_Unicode_Glyph_Name          = 0xA3;

    /* BDF errors */
    this.FT_Err_Missing_Startfont_Field        = 0xB0;
    this.FT_Err_Missing_Font_Field             = 0xB1;
    this.FT_Err_Missing_Size_Field             = 0xB2;
    this.FT_Err_Missing_Fontboundingbox_Field  = 0xB3;
    this.FT_Err_Missing_Chars_Field            = 0xB4;
    this.FT_Err_Missing_Startchar_Field        = 0xB5;
    this.FT_Err_Missing_Encoding_Field         = 0xB6;
    this.FT_Err_Missing_Bbx_Field              = 0xB7;
    this.FT_Err_Bbx_Too_Big                    = 0xB8;
    this.FT_Err_Corrupted_Font_Header          = 0xB9;
    this.FT_Err_Corrupted_Font_Glyphs          = 0xBA;

    this.FT_Mod_Err                            = 0x100;

    //
    this.BDF_PROPERTY_TYPE_NONE     = 0;
    this.BDF_PROPERTY_TYPE_ATOM     = 1;
    this.BDF_PROPERTY_TYPE_INTEGER  = 2;
    this.BDF_PROPERTY_TYPE_CARDINAL = 3;

    //
    this.TT_CMAP_FLAG_UNSORTED     = 1;
    this.TT_CMAP_FLAG_OVERLAPPING  = 2;

    this.m_c = 0x7F;
    this.m_s = 0x7FFF;
    this.m_i = 0x7FFFFFFF;
    this.a_c = 0xFF + 1;
    this.a_s = 0xFFFF + 1;
    this.a_i = 0xFFFFFFFF + 1;    

    // base
    this.FT_MAX_CHARMAP_CACHEABLE = 15;

    this.TT_PLATFORM_APPLE_UNICODE = 0;
    this.TT_PLATFORM_MACINTOSH = 1;
    this.TT_PLATFORM_ISO = 2;
    this.TT_PLATFORM_MICROSOFT = 3;
    this.TT_PLATFORM_CUSTOM = 4;
    this.TT_PLATFORM_ADOBE = 7;

    //
    this.TT_MAC_ID_ROMAN = 0;
    //
    this.TT_MS_ID_SYMBOL_CS = 0;
    this.TT_MS_ID_UNICODE_CS = 1;
    this.TT_MS_ID_SJIS = 2;
    this.TT_MS_ID_GB2312 = 3;
    this.TT_MS_ID_BIG_5 = 4;
    this.TT_MS_ID_WANSUNG = 5;
    this.TT_MS_ID_JOHAB = 6;
    this.TT_MS_ID_UCS_4 = 10;

    this.TT_APPLE_ID_DEFAULT = 0;
    this.TT_APPLE_ID_UNICODE_1_1 = 1;
    this.TT_APPLE_ID_ISO_10646 = 2;
    this.TT_APPLE_ID_UNICODE_2_0 = 3;
    this.TT_APPLE_ID_UNICODE_32 = 4;
    this.TT_APPLE_ID_VARIANT_SELECTOR = 5;

    // true type tags
    this.TTAG_avar = FT_MAKE_TAG("a","v","a","r");
    this.TTAG_BASE = FT_MAKE_TAG("B","A","S","E");
    this.TTAG_bdat = FT_MAKE_TAG("b","d","a","t");
    this.TTAG_BDF  = FT_MAKE_TAG("B","D","F"," ");
    this.TTAG_bhed = FT_MAKE_TAG("b","h","e","d");
    this.TTAG_bloc = FT_MAKE_TAG("b","l","o","c");
    this.TTAG_bsln = FT_MAKE_TAG("b","s","l","n");
    this.TTAG_CFF  = FT_MAKE_TAG("C","F","F"," ");
    this.TTAG_CID  = FT_MAKE_TAG("C","I","D"," ");
    this.TTAG_cmap = FT_MAKE_TAG("c","m","a","p");
    this.TTAG_cvar = FT_MAKE_TAG("c","v","a","r");
    this.TTAG_cvt  = FT_MAKE_TAG("c","v","t"," ");
    this.TTAG_DSIG = FT_MAKE_TAG("D","S","I","G");
    this.TTAG_EBDT = FT_MAKE_TAG("E","B","D","T");
    this.TTAG_EBLC = FT_MAKE_TAG("E","B","L","C");
    this.TTAG_EBSC = FT_MAKE_TAG("E","B","S","C");
    this.TTAG_feat = FT_MAKE_TAG("f","e","a","t");
    this.TTAG_FOND = FT_MAKE_TAG("F","O","N","D");
    this.TTAG_fpgm = FT_MAKE_TAG("f","p","g","m");
    this.TTAG_fvar = FT_MAKE_TAG("f","v","a","r");
    this.TTAG_gasp = FT_MAKE_TAG("g","a","s","p");
    this.TTAG_GDEF = FT_MAKE_TAG("G","D","E","F");
    this.TTAG_glyf = FT_MAKE_TAG("g","l","y","f");
    this.TTAG_GPOS = FT_MAKE_TAG("G","P","O","S");
    this.TTAG_GSUB = FT_MAKE_TAG("G","S","U","B");
    this.TTAG_gvar = FT_MAKE_TAG("g","v","a","r");
    this.TTAG_hdmx = FT_MAKE_TAG("h","d","m","x");
    this.TTAG_head = FT_MAKE_TAG("h","e","a","d");
    this.TTAG_hhea = FT_MAKE_TAG("h","h","e","a");
    this.TTAG_hmtx = FT_MAKE_TAG("h","m","t","x");
    this.TTAG_JSTF = FT_MAKE_TAG("J","S","T","F");
    this.TTAG_just = FT_MAKE_TAG("j","u","s","t");
    this.TTAG_kern = FT_MAKE_TAG("k","e","r","n");
    this.TTAG_lcar = FT_MAKE_TAG("l","c","a","r");
    this.TTAG_loca = FT_MAKE_TAG("l","o","c","a");
    this.TTAG_LTSH = FT_MAKE_TAG("L","T","S","H");
    this.TTAG_LWFN = FT_MAKE_TAG("L","W","F","N");
    this.TTAG_MATH = FT_MAKE_TAG("M","A","T","H");
    this.TTAG_maxp = FT_MAKE_TAG("m","a","x","p");
    this.TTAG_META = FT_MAKE_TAG("M","E","T","A");
    this.TTAG_MMFX = FT_MAKE_TAG("M","M","F","X");
    this.TTAG_MMSD = FT_MAKE_TAG("M","M","S","D");
    this.TTAG_mort = FT_MAKE_TAG("m","o","r","t");
    this.TTAG_morx = FT_MAKE_TAG("m","o","r","x");
    this.TTAG_name = FT_MAKE_TAG("n","a","m","e");
    this.TTAG_opbd = FT_MAKE_TAG("o","p","b","d");
    this.TTAG_OS2  = FT_MAKE_TAG("O","S","/","2");
    this.TTAG_OTTO = FT_MAKE_TAG("O","T","T","O");
    this.TTAG_PCLT = FT_MAKE_TAG("P","C","L","T");
    this.TTAG_POST = FT_MAKE_TAG("P","O","S","T");
    this.TTAG_post = FT_MAKE_TAG("p","o","s","t");
    this.TTAG_prep = FT_MAKE_TAG("p","r","e","p");
    this.TTAG_prop = FT_MAKE_TAG("p","r","o","p");
    this.TTAG_sfnt = FT_MAKE_TAG("s","f","n","t");
    this.TTAG_SING = FT_MAKE_TAG("S","I","N","G");
    this.TTAG_trak = FT_MAKE_TAG("t","r","a","k");
    this.TTAG_true = FT_MAKE_TAG("t","r","u","e");
    this.TTAG_ttc  = FT_MAKE_TAG("t","t","c"," ");
    this.TTAG_ttcf = FT_MAKE_TAG("t","t","c","f");
    this.TTAG_TYP1 = FT_MAKE_TAG("T","Y","P","1");
    this.TTAG_typ1 = FT_MAKE_TAG("t","y","p","1");
    this.TTAG_VDMX = FT_MAKE_TAG("V","D","M","X");
    this.TTAG_vhea = FT_MAKE_TAG("v","h","e","a");
    this.TTAG_vmtx = FT_MAKE_TAG("v","m","t","x");

    //
    this.FT_FACE_FLAG_SCALABLE         = (1 << 0);
    this.FT_FACE_FLAG_FIXED_SIZES      = (1 << 1);
    this.FT_FACE_FLAG_FIXED_WIDTH      = (1 << 2);
    this.FT_FACE_FLAG_SFNT             = (1 << 3);
    this.FT_FACE_FLAG_HORIZONTAL       = (1 << 4);
    this.FT_FACE_FLAG_VERTICAL         = (1 << 5);
    this.FT_FACE_FLAG_KERNING          = (1 << 6);
    this.FT_FACE_FLAG_FAST_GLYPHS      = (1 << 7);
    this.FT_FACE_FLAG_MULTIPLE_MASTERS = (1 << 8);
    this.FT_FACE_FLAG_GLYPH_NAMES      = (1 << 9);
    this.FT_FACE_FLAG_EXTERNAL_STREAM  = (1 << 10);
    this.FT_FACE_FLAG_HINTER           = (1 << 11);
    this.FT_FACE_FLAG_CID_KEYED        = (1 << 12);
    this.FT_FACE_FLAG_TRICKY           = (1 << 13);

    this.FT_SIZE_REQUEST_TYPE_NOMINAL   = 0;
    this.FT_SIZE_REQUEST_TYPE_REAL_DIM  = 1;
    this.FT_SIZE_REQUEST_TYPE_BBOX      = 2;
    this.FT_SIZE_REQUEST_TYPE_CELL      = 3;
    this.FT_SIZE_REQUEST_TYPE_SCALES    = 4;
    this.FT_SIZE_REQUEST_TYPE_MAX       = 5;

    this.FT_LOAD_DEFAULT                      = 0x0;
    this.FT_LOAD_NO_SCALE                     = 0x1;
    this.FT_LOAD_NO_HINTING                   = 0x2;
    this.FT_LOAD_RENDER                       = 0x4;
    this.FT_LOAD_NO_BITMAP                    = 0x8;
    this.FT_LOAD_VERTICAL_LAYOUT              = 0x10;
    this.FT_LOAD_FORCE_AUTOHINT               = 0x20;
    this.FT_LOAD_CROP_BITMAP                  = 0x40;
    this.FT_LOAD_PEDANTIC                     = 0x80;
    this.FT_LOAD_IGNORE_GLOBAL_ADVANCE_WIDTH  = 0x200;
    this.FT_LOAD_NO_RECURSE                   = 0x400;
    this.FT_LOAD_IGNORE_TRANSFORM             = 0x800;
    this.FT_LOAD_MONOCHROME                   = 0x1000;
    this.FT_LOAD_LINEAR_DESIGN                = 0x2000;
    this.FT_LOAD_NO_AUTOHINT                  = 0x8000;

    this.FT_GLYPH_FORMAT_NONE       = 0;
    this.FT_GLYPH_FORMAT_COMPOSITE  = FT_MAKE_TAG("c","o","m","p");
    this.FT_GLYPH_FORMAT_BITMAP     = FT_MAKE_TAG("b","i","t","s");
    this.FT_GLYPH_FORMAT_OUTLINE    = FT_MAKE_TAG("o","u","t","l");
    this.FT_GLYPH_FORMAT_PLOTTER    = FT_MAKE_TAG("p","l","o","t");

    this.FT_RENDER_MODE_NORMAL      = 0;
    this.FT_RENDER_MODE_LIGHT       = 1;
    this.FT_RENDER_MODE_MONO        = 2;
    this.FT_RENDER_MODE_LCD         = 3;
    this.FT_RENDER_MODE_LCD_V       = 4;
    this.FT_RENDER_MODE_MAX         = 5;

    this.FT_SUBGLYPH_FLAG_ARGS_ARE_WORDS            = 1;
    this.FT_SUBGLYPH_FLAG_ARGS_ARE_XY_VALUES        = 2;
    this.FT_SUBGLYPH_FLAG_ROUND_XY_TO_GRID          = 4;
    this.FT_SUBGLYPH_FLAG_SCALE                     = 8;
    this.FT_SUBGLYPH_FLAG_XY_SCALE                  = 0x40;
    this.FT_SUBGLYPH_FLAG_2X2                       = 0x80;
    this.FT_SUBGLYPH_FLAG_USE_MY_METRICS            = 0x200;

    this.FT_LOAD_ADVANCE_ONLY       = 0x100;
    this.FT_LOAD_SBITS_ONLY         = 0x4000;

    this.FT_KERNING_DEFAULT         = 0;
    this.FT_KERNING_UNFITTED        = 1;
    this.FT_KERNING_UNSCALED        = 2;

    //
    this.TT_NAME_ID_COPYRIGHT           = 0;
    this.TT_NAME_ID_FONT_FAMILY         = 1;
    this.TT_NAME_ID_FONT_SUBFAMILY      = 2;
    this.TT_NAME_ID_UNIQUE_ID           = 3;
    this.TT_NAME_ID_FULL_NAME           = 4;
    this.TT_NAME_ID_VERSION_STRING      = 5;
    this.TT_NAME_ID_PS_NAME             = 6;
    this.TT_NAME_ID_TRADEMARK           = 7;

    this.TT_NAME_ID_MANUFACTURER        = 8;
    this.TT_NAME_ID_DESIGNER            = 9;
    this.TT_NAME_ID_DESCRIPTION         = 10;
    this.TT_NAME_ID_VENDOR_URL          = 11;
    this.TT_NAME_ID_DESIGNER_URL        = 12;
    this.TT_NAME_ID_LICENSE             = 13;
    this.TT_NAME_ID_LICENSE_URL         = 14;

    this.TT_NAME_ID_PREFERRED_FAMILY     = 16;
    this.TT_NAME_ID_PREFERRED_SUBFAMILY  = 17;
    this.TT_NAME_ID_MAC_FULL_NAME        = 18;

    this.TT_NAME_ID_SAMPLE_TEXT          = 19;

    this.TT_NAME_ID_CID_FINDFONT_NAME    = 20;

    this.TT_NAME_ID_WWS_FAMILY           = 21;
    this.TT_NAME_ID_WWS_SUBFAMILY        = 22;

    //
    this.FT_STYLE_FLAG_ITALIC   = 1;
    this.FT_STYLE_FLAG_BOLD     = 2;

    //
    this.FT_RASTER_FLAG_DEFAULT = 0;
    this.FT_RASTER_FLAG_AA      = 1;
    this.FT_RASTER_FLAG_DIRECT  = 2;
    this.FT_RASTER_FLAG_CLIP    = 4;

    //
    this.FT_CURVE_TAG_ON        = 1;
    this.FT_CURVE_TAG_CONIC     = 0;
    this.FT_CURVE_TAG_CUBIC     = 2;

    //
    this.FT_OUTLINE_NONE             = 0x0;
    this.FT_OUTLINE_OWNER            = 0x1;
    this.FT_OUTLINE_EVEN_ODD_FILL    = 0x2;
    this.FT_OUTLINE_REVERSE_FILL     = 0x4;
    this.FT_OUTLINE_IGNORE_DROPOUTS  = 0x8;
    this.FT_OUTLINE_SMART_DROPOUTS   = 0x10;
    this.FT_OUTLINE_INCLUDE_STUBS    = 0x20;

    this.FT_OUTLINE_HIGH_PRECISION   = 0x100;
    this.FT_OUTLINE_SINGLE_PASS      = 0x200;

    //
    this.FT_GLYPH_OWN_BITMAP         = 0x1;

    //
    this.FT_PIXEL_MODE_NONE     = 0;
    this.FT_PIXEL_MODE_MONO     = 1;
    this.FT_PIXEL_MODE_GRAY     = 2;
    this.FT_PIXEL_MODE_GRAY2    = 3;
    this.FT_PIXEL_MODE_GRAY4    = 4;
    this.FT_PIXEL_MODE_LCD      = 5;
    this.FT_PIXEL_MODE_LCD_V    = 6;
    this.FT_PIXEL_MODE_MAX      = 7;

    this.ErrorLongJump          = -100;

    //
    this.FT_GLYPH_BBOX_UNSCALED  = 0;
    this.FT_GLYPH_BBOX_SUBPIXELS = 0;
    this.FT_GLYPH_BBOX_GRIDFIT   = 1;
    this.FT_GLYPH_BBOX_TRUNCATE  = 2;
    this.FT_GLYPH_BBOX_PIXELS    = 3;

    // GX_TupleCountFlags
    this.GX_TC_TUPLES_SHARE_POINT_NUMBERS = 0x8000;
    this.GX_TC_RESERVED_TUPLE_FLAGS       = 0x7000;
    this.GX_TC_TUPLE_COUNT_MASK           = 0x0FFF;

    // GX_TupleIndexFlags
    this.GX_TI_EMBEDDED_TUPLE_COORD  = 0x8000;
    this.GX_TI_INTERMEDIATE_TUPLE    = 0x4000;
    this.GX_TI_PRIVATE_POINT_NUMBERS = 0x2000;
    this.GX_TI_RESERVED_TUPLE_FLAG   = 0x1000;
    this.GX_TI_TUPLE_INDEX_MASK      = 0x0FFF;

    //
    this.TTAG_wght = FT_MAKE_TAG("w","g","h","t");
    this.TTAG_wdth = FT_MAKE_TAG("w","d","t","h");
    this.TTAG_opsz = FT_MAKE_TAG("o","p","s","z");
    this.TTAG_slnt = FT_MAKE_TAG("s","l","n","t");

    //
    this.FT_PARAM_TAG_UNPATENTED_HINTING = FT_MAKE_TAG("u","n","p","a");

    // это для типа указателя на cmap
    this.FT_CMAP_0      = 0;
    this.FT_CMAP_1      = 1;
    this.FT_CMAP_4      = 2;
    this.FT_CMAP_12     = 3;
    this.FT_CMAP_13     = 4;
    this.FT_CMAP_14     = 5;

    // t1types
    this.T1_BLEND_UNDERLINE_POSITION    = 0;
    this.T1_BLEND_UNDERLINE_THICKNESS   = 1;
    this.T1_BLEND_ITALIC_ANGLE          = 2;

    this.T1_BLEND_BLUE_VALUES           = 3;
    this.T1_BLEND_OTHER_BLUES           = 4;
    this.T1_BLEND_STANDARD_WIDTH        = 5;
    this.T1_BLEND_STANDARD_HEIGHT       = 6;
    this.T1_BLEND_STEM_SNAP_WIDTHS      = 7;
    this.T1_BLEND_STEM_SNAP_HEIGHTS     = 8;
    this.T1_BLEND_BLUE_SCALE            = 9;
    this.T1_BLEND_BLUE_SHIFT            = 10;
    this.T1_BLEND_FAMILY_BLUES          = 11;
    this.T1_BLEND_FAMILY_OTHER_BLUES    = 12;
    this.T1_BLEND_FORCE_BOLD            = 13;
    this.T1_BLEND_MAX                   = 14;

    this.T1_MAX_MM_DESIGNS              = 16;
    this.T1_MAX_MM_AXIS                 = 4;
    this.T1_MAX_MM_MAP_POINTS           = 20;

    this.T1_ENCODING_TYPE_NONE          = 0;
    this.T1_ENCODING_TYPE_ARRAY         = 1;
    this.T1_ENCODING_TYPE_STANDARD      = 2;
    this.T1_ENCODING_TYPE_ISOLATIN1     = 3;
    this.T1_ENCODING_TYPE_EXPERT        = 4;

    // keys
    this.PS_DICT_FONT_TYPE              = 0;
    this.PS_DICT_FONT_MATRIX            = 1;
    this.PS_DICT_FONT_BBOX              = 2;
    this.PS_DICT_PAINT_TYPE             = 3;
    this.PS_DICT_FONT_NAME              = 4;
    this.PS_DICT_UNIQUE_ID              = 5;
    this.PS_DICT_NUM_CHAR_STRINGS       = 6;
    this.PS_DICT_CHAR_STRING_KEY        = 7;
    this.PS_DICT_CHAR_STRING            = 8;
    this.PS_DICT_ENCODING_TYPE          = 9;
    this.PS_DICT_ENCODING_ENTRY         = 10;

        /* conventionally in the font Private dictionary */
    this.PS_DICT_NUM_SUBRS              = 11;
    this.PS_DICT_SUBR                   = 12;
    this.PS_DICT_STD_HW                 = 13;
    this.PS_DICT_STD_VW                 = 14;
    this.PS_DICT_NUM_BLUE_VALUES        = 15;
    this.PS_DICT_BLUE_VALUE             = 16;
    this.PS_DICT_BLUE_FUZZ              = 17;
    this.PS_DICT_NUM_OTHER_BLUES        = 18;
    this.PS_DICT_OTHER_BLUE             = 19;
    this.PS_DICT_NUM_FAMILY_BLUES       = 20;
    this.PS_DICT_FAMILY_BLUE            = 21;
    this.PS_DICT_NUM_FAMILY_OTHER_BLUES = 22;
    this.PS_DICT_FAMILY_OTHER_BLUE      = 23;
    this.PS_DICT_BLUE_SCALE             = 24;
    this.PS_DICT_BLUE_SHIFT             = 25;
    this.PS_DICT_NUM_STEM_SNAP_H        = 26;
    this.PS_DICT_STEM_SNAP_H            = 27;
    this.PS_DICT_NUM_STEM_SNAP_V        = 28;
    this.PS_DICT_STEM_SNAP_V            = 29;
    this.PS_DICT_FORCE_BOLD             = 30;
    this.PS_DICT_RND_STEM_UP            = 31;
    this.PS_DICT_MIN_FEATURE            = 32;
    this.PS_DICT_LEN_IV                 = 33;
    this.PS_DICT_PASSWORD               = 34;
    this.PS_DICT_LANGUAGE_GROUP         = 35;

    /* conventionally in the font FontInfo dictionary */
    this.PS_DICT_VERSION                = 36;
    this.PS_DICT_NOTICE                 = 37;
    this.PS_DICT_FULL_NAME              = 38;
    this.PS_DICT_FAMILY_NAME            = 39;
    this.PS_DICT_WEIGHT                 = 40;
    this.PS_DICT_IS_FIXED_PITCH         = 41;
    this.PS_DICT_UNDERLINE_POSITION     = 42;
    this.PS_DICT_UNDERLINE_THICKNESS    = 43;
    this.PS_DICT_FS_TYPE                = 44;
    this.PS_DICT_ITALIC_ANGLE           = 45;

    this.PS_DICT_MAX = this.PS_DICT_ITALIC_ANGLE;

    this.TT_ADOBE_ID_STANDARD  = 0;
    this.TT_ADOBE_ID_EXPERT    = 1;
    this.TT_ADOBE_ID_CUSTOM    = 2;
    this.TT_ADOBE_ID_LATIN_1   = 3;

    // PSAUX
    this.T1_TOKEN_TYPE_NONE     = 0;
    this.T1_TOKEN_TYPE_ANY      = 1;
    this.T1_TOKEN_TYPE_STRING   = 2;
    this.T1_TOKEN_TYPE_ARRAY    = 3;
    this.T1_TOKEN_TYPE_KEY      = 4;
    this.T1_TOKEN_TYPE_MAX      = 5;

    this.T1_FIELD_TYPE_NONE             = 0;
    this.T1_FIELD_TYPE_BOOL             = 1;
    this.T1_FIELD_TYPE_INTEGER          = 2;
    this.T1_FIELD_TYPE_FIXED            = 3;
    this.T1_FIELD_TYPE_FIXED_1000       = 4;
    this.T1_FIELD_TYPE_STRING           = 5;
    this.T1_FIELD_TYPE_KEY              = 6;
    this.T1_FIELD_TYPE_BBOX             = 7;
    this.T1_FIELD_TYPE_INTEGER_ARRAY    = 8;
    this.T1_FIELD_TYPE_FIXED_ARRAY      = 9;
    this.T1_FIELD_TYPE_CALLBACK         = 10;
    this.T1_FIELD_TYPE_MAX              = 11;

    this.T1_FIELD_LOCATION_CID_INFO     = 0;
    this.T1_FIELD_LOCATION_FONT_DICT    = 1;
    this.T1_FIELD_LOCATION_FONT_EXTRA   = 2;
    this.T1_FIELD_LOCATION_FONT_INFO    = 3;
    this.T1_FIELD_LOCATION_PRIVATE      = 4;
    this.T1_FIELD_LOCATION_BBOX         = 5;
    this.T1_FIELD_LOCATION_LOADER       = 6;
    this.T1_FIELD_LOCATION_FACE         = 7;
    this.T1_FIELD_LOCATION_BLEND        = 8;
    this.T1_FIELD_LOCATION_MAX          = 9;

    this.T1_FIELD_DICT_FONTDICT         = 1;
    this.T1_FIELD_DICT_PRIVATE          = 2;

    this.T1_Parse_Start                 = 0;
    this.T1_Parse_Have_Width            = 1;
    this.T1_Parse_Have_Moveto           = 2;
    this.T1_Parse_Have_Path             = 3;

    this.T1_MAX_CHARSTRINGS_OPERANDS    = 256;

    this.AFM_VALUE_TYPE_STRING          = 0;
    this.AFM_VALUE_TYPE_NAME            = 1;
    this.AFM_VALUE_TYPE_FIXED           = 2;
    this.AFM_VALUE_TYPE_INTEGER         = 3;
    this.AFM_VALUE_TYPE_BOOL            = 4;
    this.AFM_VALUE_TYPE_INDEX           = 5;

    this.AFM_STREAM_STATUS_NORMAL       = 0;
    this.AFM_STREAM_STATUS_EOC          = 1;
    this.AFM_STREAM_STATUS_EOL          = 2;
    this.AFM_STREAM_STATUS_EOF          = 3;

    this.AFM_MAX_ARGUMENTS              = 5;

    this.AFM_TOKEN_ASCENDER = 0;
    this.AFM_TOKEN_AXISLABEL = 1;
    this.AFM_TOKEN_AXISTYPE = 2;
    this.AFM_TOKEN_B = 3;
    this.AFM_TOKEN_BLENDAXISTYPES = 4;
    this.AFM_TOKEN_BLENDDESIGNMAP = 5;
    this.AFM_TOKEN_BLENDDESIGNPOSITIONS = 6;
    this.AFM_TOKEN_C = 7;
    this.AFM_TOKEN_CC = 8;
    this.AFM_TOKEN_CH = 9;
    this.AFM_TOKEN_CAPHEIGHT = 10;
    this.AFM_TOKEN_CHARWIDTH = 11;
    this.AFM_TOKEN_CHARACTERSET = 12;
    this.AFM_TOKEN_CHARACTERS = 13;
    this.AFM_TOKEN_DESCENDER = 14;
    this.AFM_TOKEN_ENCODINGSCHEME = 15;
    this.AFM_TOKEN_ENDAXIS = 16;
    this.AFM_TOKEN_ENDCHARMETRICS = 17;
    this.AFM_TOKEN_ENDCOMPOSITES = 18;
    this.AFM_TOKEN_ENDDIRECTION = 19;
    this.AFM_TOKEN_ENDFONTMETRICS = 20;
    this.AFM_TOKEN_ENDKERNDATA = 21;
    this.AFM_TOKEN_ENDKERNPAIRS = 22;
    this.AFM_TOKEN_ENDTRACKKERN = 23;
    this.AFM_TOKEN_ESCCHAR = 24;
    this.AFM_TOKEN_FAMILYNAME = 25;
    this.AFM_TOKEN_FONTBBOX = 26;
    this.AFM_TOKEN_FONTNAME = 27;
    this.AFM_TOKEN_FULLNAME = 28;
    this.AFM_TOKEN_ISBASEFONT = 29;
    this.AFM_TOKEN_ISCIDFONT = 30;
    this.AFM_TOKEN_ISFIXEDPITCH = 31;
    this.AFM_TOKEN_ISFIXEDV = 32;
    this.AFM_TOKEN_ITALICANGLE = 33;
    this.AFM_TOKEN_KP = 34;
    this.AFM_TOKEN_KPH = 35;
    this.AFM_TOKEN_KPX = 36;
    this.AFM_TOKEN_KPY = 37;
    this.AFM_TOKEN_L = 38;
    this.AFM_TOKEN_MAPPINGSCHEME = 39;
    this.AFM_TOKEN_METRICSSETS = 40;
    this.AFM_TOKEN_N = 41;
    this.AFM_TOKEN_NOTICE = 42;
    this.AFM_TOKEN_PCC = 43;
    this.AFM_TOKEN_STARTAXIS = 44;
    this.AFM_TOKEN_STARTCHARMETRICS = 45;
    this.AFM_TOKEN_STARTCOMPOSITES = 46;
    this.AFM_TOKEN_STARTDIRECTION = 47;
    this.AFM_TOKEN_STARTFONTMETRICS = 48;
    this.AFM_TOKEN_STARTKERNDATA = 49;
    this.AFM_TOKEN_STARTKERNPAIRS = 50;
    this.AFM_TOKEN_STARTKERNPAIRS0 = 51;
    this.AFM_TOKEN_STARTKERNPAIRS1 = 52;
    this.AFM_TOKEN_STARTTRACKKERN = 53;
    this.AFM_TOKEN_STDHW = 54;
    this.AFM_TOKEN_STDVW = 55;
    this.AFM_TOKEN_TRACKKERN = 56;
    this.AFM_TOKEN_UNDERLINEPOSITION = 57;
    this.AFM_TOKEN_UNDERLINETHICKNESS = 58;
    this.AFM_TOKEN_VV = 59;
    this.AFM_TOKEN_VVECTOR = 60;
    this.AFM_TOKEN_VERSION = 61;
    this.AFM_TOKEN_W = 62;
    this.AFM_TOKEN_W0 = 63;
    this.AFM_TOKEN_W0X = 64;
    this.AFM_TOKEN_W0Y = 65;
    this.AFM_TOKEN_W1 = 66;
    this.AFM_TOKEN_W1X = 67;
    this.AFM_TOKEN_W1Y = 68;
    this.AFM_TOKEN_WX = 69;
    this.AFM_TOKEN_WY = 70;
    this.AFM_TOKEN_WEIGHT = 71;
    this.AFM_TOKEN_WEIGHTVECTOR = 72;
    this.AFM_TOKEN_XHEIGHT = 73;
    this.N_AFM_TOKENS = 74;
    this.AFM_TOKEN_UNKNOWN = 75;

    this.T1_MAX_TABLE_ELEMENTS = 32;
    this.T1_MAX_SUBRS_CALLS = 16;

    this.TABLE_EXTEND = 5;

    // константы строковые
    this.SYMBOL_CONST_SR                = "\r".charCodeAt(0);
    this.SYMBOL_CONST_SN                = "\n".charCodeAt(0);
    this.SYMBOL_CONST_ST                = "\t".charCodeAt(0);
    this.SYMBOL_CONST_SF                = "\f".charCodeAt(0);
    this.SYMBOL_CONST_S0                = "\0".charCodeAt(0);

    this.SYMBOL_CONST_SPACE             = " ".charCodeAt(0);
    this.SYMBOL_CONST_LS1               = "(".charCodeAt(0);
    this.SYMBOL_CONST_LS2               = "[".charCodeAt(0);
    this.SYMBOL_CONST_LS3               = "{".charCodeAt(0);
    this.SYMBOL_CONST_RS1               = ")".charCodeAt(0);
    this.SYMBOL_CONST_RS2               = "]".charCodeAt(0);
    this.SYMBOL_CONST_RS3               = "}".charCodeAt(0);
    this.SYMBOL_CONST_BS                = "/".charCodeAt(0);
    this.SYMBOL_CONST_SS                = "\\".charCodeAt(0);

    this.SYMBOL_CONST_MATH_1            = "<".charCodeAt(0);
    this.SYMBOL_CONST_MATH_2            = ">".charCodeAt(0);
    this.SYMBOL_CONST_MATH_3            = "%".charCodeAt(0);
    this.SYMBOL_CONST_MATH_MINUS        = "-".charCodeAt(0);
    this.SYMBOL_CONST_MATH_PLUS         = "+".charCodeAt(0);

    this.SYMBOL_CONST_0                 = "0".charCodeAt(0);
    this.SYMBOL_CONST_7                 = "7".charCodeAt(0);
    this.SYMBOL_CONST_9                 = "9".charCodeAt(0);

    this.SYMBOL_CONST_a                 = "a".charCodeAt(0);
    this.SYMBOL_CONST_b                 = "b".charCodeAt(0);
    this.SYMBOL_CONST_c                 = "c".charCodeAt(0);
    this.SYMBOL_CONST_d                 = "d".charCodeAt(0);
    this.SYMBOL_CONST_e                 = "e".charCodeAt(0);
    this.SYMBOL_CONST_f                 = "f".charCodeAt(0);
    this.SYMBOL_CONST_g                 = "g".charCodeAt(0);
    this.SYMBOL_CONST_h                 = "h".charCodeAt(0);
    this.SYMBOL_CONST_i                 = "i".charCodeAt(0);
    this.SYMBOL_CONST_j                 = "j".charCodeAt(0);
    this.SYMBOL_CONST_k                 = "k".charCodeAt(0);
    this.SYMBOL_CONST_l                 = "l".charCodeAt(0);
    this.SYMBOL_CONST_m                 = "m".charCodeAt(0);
    this.SYMBOL_CONST_n                 = "n".charCodeAt(0);
    this.SYMBOL_CONST_o                 = "o".charCodeAt(0);
    this.SYMBOL_CONST_p                 = "p".charCodeAt(0);
    this.SYMBOL_CONST_q                 = "q".charCodeAt(0);
    this.SYMBOL_CONST_r                 = "r".charCodeAt(0);
    this.SYMBOL_CONST_s                 = "s".charCodeAt(0);
    this.SYMBOL_CONST_t                 = "t".charCodeAt(0);
    this.SYMBOL_CONST_u                 = "u".charCodeAt(0);
    this.SYMBOL_CONST_v                 = "v".charCodeAt(0);
    this.SYMBOL_CONST_w                 = "w".charCodeAt(0);
    this.SYMBOL_CONST_x                 = "x".charCodeAt(0);
    this.SYMBOL_CONST_y                 = "y".charCodeAt(0);
    this.SYMBOL_CONST_z                 = "z".charCodeAt(0);

    this.SYMBOL_CONST_A                 = "A".charCodeAt(0);
    this.SYMBOL_CONST_B                 = "B".charCodeAt(0);
    this.SYMBOL_CONST_C                 = "C".charCodeAt(0);
    this.SYMBOL_CONST_D                 = "D".charCodeAt(0);
    this.SYMBOL_CONST_E                 = "E".charCodeAt(0);
    this.SYMBOL_CONST_F                 = "F".charCodeAt(0);
    this.SYMBOL_CONST_G                 = "G".charCodeAt(0);
    this.SYMBOL_CONST_H                 = "H".charCodeAt(0);
    this.SYMBOL_CONST_I                 = "I".charCodeAt(0);
    this.SYMBOL_CONST_J                 = "J".charCodeAt(0);
    this.SYMBOL_CONST_K                 = "K".charCodeAt(0);
    this.SYMBOL_CONST_L                 = "L".charCodeAt(0);
    this.SYMBOL_CONST_M                 = "M".charCodeAt(0);
    this.SYMBOL_CONST_N                 = "N".charCodeAt(0);
    this.SYMBOL_CONST_O                 = "O".charCodeAt(0);
    this.SYMBOL_CONST_P                 = "P".charCodeAt(0);
    this.SYMBOL_CONST_Q                 = "Q".charCodeAt(0);
    this.SYMBOL_CONST_R                 = "R".charCodeAt(0);
    this.SYMBOL_CONST_S                 = "S".charCodeAt(0);
    this.SYMBOL_CONST_T                 = "T".charCodeAt(0);
    this.SYMBOL_CONST_U                 = "U".charCodeAt(0);
    this.SYMBOL_CONST_V                 = "V".charCodeAt(0);
    this.SYMBOL_CONST_W                 = "W".charCodeAt(0);
    this.SYMBOL_CONST_X                 = "X".charCodeAt(0);
    this.SYMBOL_CONST_Y                 = "Y".charCodeAt(0);
    this.SYMBOL_CONST_Z                 = "Z".charCodeAt(0);

    this.SYMBOL_CONST_VOSCL             = "!".charCodeAt(0);
    this.SYMBOL_CONST_VOPROS            = "?".charCodeAt(0);
    this.SYMBOL_CONST_LOGOR             = "|".charCodeAt(0);

    this.SYMBOL_CONST_POINT             = ".".charCodeAt(0);
    this.SYMBOL_CONST_SHARP             = "#".charCodeAt(0);
    this.SYMBOL_CONST_SERP              = ";".charCodeAt(0);
    this.SYMBOL_CONST__                 = "_".charCodeAt(0);

    this.op_none = 0;
    this.op_endchar = 1;
    this.op_hsbw = 2;
    this.op_seac = 3;
    this.op_sbw = 4;
    this.op_closepath = 5;
    this.op_hlineto = 6;
    this.op_hmoveto = 7;
    this.op_hvcurveto = 8;
    this.op_rlineto = 9;
    this.op_rmoveto = 10;
    this.op_rrcurveto = 11;
    this.op_vhcurveto = 12;
    this.op_vlineto = 13;
    this.op_vmoveto = 14;
    this.op_dotsection = 15;
    this.op_hstem = 16;
    this.op_hstem3 = 17;
    this.op_vstem = 18;
    this.op_vstem3 = 19;
    this.op_div = 20;
    this.op_callothersubr = 21;
    this.op_callsubr = 22;
    this.op_pop = 23;
    this.op_return = 24;
    this.op_setcurrentpoint = 25;
    this.op_unknown15 = 26;
    this.op_max = 27;

    // cff
    this.CFF_MAX_CID_FONTS = 256;

    this.CFF_MAX_STACK_DEPTH = 96;

    this.CFF_CODE_TOPDICT = 0x1000;
    this.CFF_CODE_PRIVATE = 0x2000;

    this.CFFCODE_TOPDICT = 0x1000;
    this.CFFCODE_PRIVATE = 0x2000;

    this.cff_kind_none = 0;
    this.cff_kind_num = 1;
    this.cff_kind_fixed = 2;
    this.cff_kind_fixed_thousand = 3;
    this.cff_kind_string = 4;
    this.cff_kind_bool = 5;
    this.cff_kind_delta = 6;
    this.cff_kind_callback = 7;
    this.cff_kind_max = 8;

    this.CFF_MAX_OPERANDS = 48;
    this.CFF_MAX_SUBRS_CALLS = 32;
    this.CFF_MAX_TRANS_ELEMENTS = 32;

    this.CFF_COUNT_CHECK_WIDTH  = 0x80;
    this.CFF_COUNT_EXACT        = 0x40;
    this.CFF_COUNT_CLEAR_STACK  = 0x20;

    this.cff_op_unknown = 0;

    this.cff_op_rmoveto = 1;
    this.cff_op_hmoveto = 2;
    this.cff_op_vmoveto = 3;

    this.cff_op_rlineto = 4;
    this.cff_op_hlineto = 5;
    this.cff_op_vlineto = 6;

    this.cff_op_rrcurveto = 7;
    this.cff_op_hhcurveto = 8;
    this.cff_op_hvcurveto = 9;
    this.cff_op_rcurveline = 10;
    this.cff_op_rlinecurve = 11;
    this.cff_op_vhcurveto = 12;
    this.cff_op_vvcurveto = 13;

    this.cff_op_flex = 14;
    this.cff_op_hflex = 15;
    this.cff_op_hflex1 = 16;
    this.cff_op_flex1 = 17;

    this.cff_op_endchar = 18;

    this.cff_op_hstem = 19;
    this.cff_op_vstem = 20;
    this.cff_op_hstemhm = 21;
    this.cff_op_vstemhm = 22;

    this.cff_op_hintmask = 23;
    this.cff_op_cntrmask = 24;
    this.cff_op_dotsection = 25;

    this.cff_op_abs = 26;
    this.cff_op_add = 27;
    this.cff_op_sub = 28;
    this.cff_op_div = 29;
    this.cff_op_neg = 30;
    this.cff_op_random = 31;
    this.cff_op_mul = 32;
    this.cff_op_sqrt = 33;

    this.cff_op_blend = 34;

    this.cff_op_drop = 35;
    this.cff_op_exch = 36;
    this.cff_op_index = 37;
    this.cff_op_roll = 38;
    this.cff_op_dup = 39;

    this.cff_op_put = 40;
    this.cff_op_get = 41;
    this.cff_op_store = 42;
    this.cff_op_load = 43;

    this.cff_op_and = 44;
    this.cff_op_or = 45;
    this.cff_op_not = 46;
    this.cff_op_eq = 47;
    this.cff_op_ifelse = 48;

    this.cff_op_callsubr = 49;
    this.cff_op_callgsubr = 50;
    this.cff_op_return = 51;

    /* Type 1 opcodes: invalid but seen in real life */
    this.cff_op_hsbw = 52;
    this.cff_op_closepath = 53;
    this.cff_op_callothersubr = 54;
    this.cff_op_pop = 55;
    this.cff_op_seac = 56;
    this.cff_op_sbw = 57;
    this.cff_op_setcurrentpoint = 58;

    this.cff_op_max = 59;

    // t1
    this.T1_PRIVATE = 1;
    this.T1_FONTDIR_AFTER_PRIVATE = 2;

    // ttinterp
    this.TT_MAX_CODE_RANGES = 3;

    this.tt_coderange_none  = 0;
    this.tt_coderange_font  = 1;
    this.tt_coderange_cvt   = 2;
    this.tt_coderange_glyph = 3;

    this.TT_INTERPRETER_VERSION_35 = 35;
    this.TT_INTERPRETER_VERSION_38 = 38;

    this.SPH_OPTION_BITMAP_WIDTHS = false;
    this.SPH_OPTION_SET_SUBPIXEL = true;
    this.SPH_OPTION_SET_GRAYSCALE = false;
    this.SPH_OPTION_SET_COMPATIBLE_WIDTHS = false;
    this.SPH_OPTION_SET_RASTERIZER_VERSION = 38;

    this.SPH_FDEF_INLINE_DELTA_1        = 0x0000001;
    this.SPH_FDEF_INLINE_DELTA_2        = 0x0000002;
    this.SPH_FDEF_DIAGONAL_STROKE       = 0x0000004;
    this.SPH_FDEF_VACUFORM_ROUND_1      = 0x0000008;
    this.SPH_FDEF_TTFAUTOHINT_1         = 0x0000010;
    this.SPH_FDEF_SPACING_1             = 0x0000020;
    this.SPH_FDEF_SPACING_2             = 0x0000040;
    this.SPH_FDEF_TYPEMAN_STROKES       = 0x0000080;
    this.SPH_FDEF_TYPEMAN_DIAGENDCTRL   = 0x0000100;

    this.SPH_TWEAK_ALLOW_X_DMOVE                   = 0x0000001;
    this.SPH_TWEAK_ALWAYS_DO_DELTAP                = 0x0000002;
    this.SPH_TWEAK_ALWAYS_SKIP_DELTAP              = 0x0000004;
    this.SPH_TWEAK_COURIER_NEW_2_HACK              = 0x0000008;
    this.SPH_TWEAK_DEEMBOLDEN                      = 0x0000010;
    this.SPH_TWEAK_DO_SHPIX                        = 0x0000020;
    this.SPH_TWEAK_EMBOLDEN                        = 0x0000040;
    this.SPH_TWEAK_MIAP_HACK                       = 0x0000080;
    this.SPH_TWEAK_NORMAL_ROUND                    = 0x0000100;
    this.SPH_TWEAK_NO_ALIGNRP_AFTER_IUP            = 0x0000200;
    this.SPH_TWEAK_NO_CALL_AFTER_IUP               = 0x0000400;
    this.SPH_TWEAK_NO_DELTAP_AFTER_IUP             = 0x0000800;
    this.SPH_TWEAK_PIXEL_HINTING                   = 0x0001000;
    this.SPH_TWEAK_RASTERIZER_35                   = 0x0002000;
    this.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES          = 0x0004000;
    this.SPH_TWEAK_SKIP_IUP                        = 0x0008000;
    this.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES           = 0x0010000;
    this.SPH_TWEAK_SKIP_OFFPIXEL_Y_MOVES           = 0x0020000;
    this.SPH_TWEAK_TIMES_NEW_ROMAN_HACK            = 0x0040000;
    this.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES_DELTAP    = 0x0080000;

    this.FT_CURVE_TAG_HAS_SCANMODE                  = 4;
    this.FT_CURVE_TAG_TOUCH_X                       = 8;  /* reserved for the TrueType hinter */
    this.FT_CURVE_TAG_TOUCH_Y                       = 16;  /* reserved for the TrueType hinter */
    this.FT_CURVE_TAG_TOUCH_BOTH                    = (this.FT_CURVE_TAG_TOUCH_X | this.FT_CURVE_TAG_TOUCH_Y);

    this.FT_ORIENTATION_TRUETYPE   = 0;
    this.FT_ORIENTATION_POSTSCRIPT = 1;
    this.FT_ORIENTATION_FILL_RIGHT = this.FT_ORIENTATION_TRUETYPE;
    this.FT_ORIENTATION_FILL_LEFT  = this.FT_ORIENTATION_POSTSCRIPT;
    this.FT_ORIENTATION_NONE = 2;

    this.FT_ANGLE_PI  = (180 << 16);
    this.FT_ANGLE_PI2 = (this.FT_ANGLE_PI / 2);
    this.FT_TRIG_MAX_ITERS = 23;

    this.FT_TRIG_SCALE = 0x9B74EDA8;
    if (this.FT_TRIG_SCALE < 0)
        this.FT_TRIG_SCALE = this.IntToUInt(this.FT_TRIG_SCALE);

    this.tt_coderange_none  = 0;
    this.tt_coderange_font  = 1;
    this.tt_coderange_cvt   = 2;
    this.tt_coderange_glyph = 3;

    this.MAX_RUNNABLE_OPCODES = 1000000;
	
	this.ARGS_ARE_WORDS         = 0x0001;
	this.ARGS_ARE_XY_VALUES     = 0x0002;
	this.ROUND_XY_TO_GRID       = 0x0004;
	this.WE_HAVE_A_SCALE        = 0x0008;
	this.MORE_COMPONENTS        = 0x0020;
	this.WE_HAVE_AN_XY_SCALE    = 0x0040;
	this.WE_HAVE_A_2X2          = 0x0080;
	this.WE_HAVE_INSTR          = 0x0100;
	this.USE_MY_METRICS         = 0x0200;
	this.OVERLAP_COMPOUND       = 0x0400;
	this.SCALED_COMPONENT_OFFSET   = 0x0800;
	this.UNSCALED_COMPONENT_OFFSET = 0x1000;

// GENERATOR_END_CONSTANTS

	this.UintToInt = function(v){
        return (v>FT_Common.m_i)?v-FT_Common.a_i:v;
    }
    this.UShort_To_Short = function(v){
        return (v>FT_Common.m_s)?v-FT_Common.a_s:v;
    }
    this.IntToUInt = function(v){
        return (v<0)?v+FT_Common.a_i:v;
    }
    this.Short_To_UShort = function(v){
        return (v<0)?v+FT_Common.a_s:v;
    }
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    }
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    }
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    }
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    }
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    }
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = FT_Common.FT_Err_Invalid_Argument;
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
    }

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = FT_Common.FT_Err_Invalid_Argument;
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
    }
}
var FT_Common = new _FT_Common();