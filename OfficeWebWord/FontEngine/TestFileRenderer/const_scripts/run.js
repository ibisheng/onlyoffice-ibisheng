function __init__viewer__(count_fonts)
{
    var _len_const_font_infos = g_font_infos.length;
    var _len_const_font_files = g_font_files.length;

    function new_font_file(index)
    {
        var ret = new CFontFileLoader("font" + index + ".js");
        ret.Status = 0;
        ret.stream_index = index;
        return ret;
    }

    for (var i = 0; i < count_fonts; i++)
    {
        g_font_files[_len_const_font_files + i] = new_font_file(i);
        g_map_font_index["font" + i] = _len_const_font_infos + i;
        g_font_infos[_len_const_font_infos + i] = new CFontInfo("font" + i, "", FONT_TYPE_EMBEDDED, _len_const_font_files + i,
            0, -1, -1, -1, -1, -1, -1);
    }

    StartViewer();
}