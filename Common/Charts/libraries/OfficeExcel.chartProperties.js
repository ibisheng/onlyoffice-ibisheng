if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

OfficeExcel.Title = function()
{
    this._text = '';

    this._background = null;
    this._color = null;

    this._hpos = null;
    this._vpos = null;

    this._bold = true;
    this._font = null;
    this._size = null;
};

OfficeExcel.Gutter = function()
{
    this._left      = 25;
    this._right     = 25;
    this._top       = 25;
    this._bottom    = 25;
}

OfficeExcel.Shadow = function()
{
    this._visible   = false;
    this._offset_x  = 2;
    this._offset_y  = 2;
    this._blur      = 3;
    this._color     = 'rgba(0,0,0,0.5)';
}

OfficeExcel.chartZoom = function()
{
    this._factor = 1.5;
    this._fade_in = true;
    this._fade_out = true;
    this._hdir = 'right';
    this._vdir = 'down';
    this._frames = 25;
    this._delay = 16.666;
    this._shadow = true;
    this._mode = 'canvas';
    this._thumbnail_width = 75;
    this._thumbnail_height = 75;
    this._thumbnail_fixed = false;
    this._background = true;
    this._action = 'zoom';
}

OfficeExcel.Tooltips = function()
{
    this._tooltips = null;

    this._effect = 'fade';
    this._hotspot = 3;
    this._css_class = 'OfficeExcel_tooltip';
    this._highlight = true;
    this._event = 'onmousemove'

    this._override = null;
    this._hotspot_xonly = false;
    this._hotspot = 3;
    this._coords_adjust = null;
}

OfficeExcel.OtherProps = function()
{
    this._curvy = false;
    this._curvy_factor = 0.25; // should be 0 - 0.5

    this._noredraw = false;

    this._chromefix = true;

    this._adjustable = false;

    this._xmin = 0;
    this._xmax = 0;
    this._ymin = 0;
    this._ymax = 0;

    this._outofbounds = false;

    this._resizable = false;
    this._total = true;

    this._noaxes = false;
    this._noxaxis = false;
    this._noyaxis = false;

    this._xaxispos = 'bottom';
    this._yaxispos = 'left';

    this._strokecolor = '#666';

    this._hmargin = 5;
    this._vmargin = 3;

    this._numyticks = 10;

    this._text_color = 'black';
    this._text_font = 'Arial';
    this._text_size = 10;
    this._text_angle = 0;

    this._axis_color = 'black';

    this._multiplier_x = 1;
    this._multiplier_w = 1;

    this._annotate_color = 'black';

    this._annotatable = false;

    this._units_pre = '';
    this._units_post = '';
    this._units_ingraph = false;

    this._events_mousemove = null;
    this._events_mousemove_revertto = null;
    this._events_click = null;
    this._events = [];

    this._resize_handle_background = null;

    this._crosshairs = false;
    this._crosshairs_color = '#333';
    this._crosshairs_hline = true;
    this._crosshairs_vline = true;
    this._crosshairs_linewidth = 1;
    this._crosshairs_coords = false;
    this._crosshairs_coords_fixed = true;
    this._crosshairs_coords_fadeout = false;
    this._crosshairs_coords_labels_x = 'X';
    this._crosshairs_coords_labels_y = 'Y';

    this._scale_round = false;
    this._scale_decimals = 0;
    this._scale_point = '.';
    this._scale_thousand = ',';
    this._scale_formatter = null;

    this._highlight_stroke = 'black';
    this._highlight_fill = 'rgba(255,255,255,0.5)';
    this._highlight_style = 'explode';
    this._highlight_style_2d_fill = 'rgba(255,255,255,0.5)';
    this._highlight_style_2d_stroke = 'rgba(255,255,255,0)';

    this._contextmenu = null;
    this._contextmenu_bg = null;
    this._contextmenu_submenu = null;

    this._colors = ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff', '#0f0'];
    this._colors_sequential = false;
    this._colors_reverse = false;
    this._colors_alternate = null;
    this._colors_alpha = null;
    this._colors_default = 'black';

    this._title_yaxis_align = 'left';
    this._title_yaxis_position = 'left';
    this._title_left = '';
    this._title_right = '';

    this._gutter_center = 60;

    this._radius = null;

    this._exploded = 0;

    this._segments = [];

    this._centerx = null;
    this._centery = null;

    this._borders = true;
    this._border = false;
	this._area_border = true;	// граница для всей области диаграммы
    this._border_color = 'rgba(255,255,255,0.5)';

    this._align = 'center';

    this._effect_roundrobin_multiplier = 1;

    this._xlabels = true;
    this._xlabels_offset = 0;
    this._xlabels_inside = false;
    this._xlabels_inside_color = 'rgba(255,255,255,0.5)';

    this._ylabels = true;
    this._ylabels_count = 5;
    this._ylabels_inside = false;
    this._ylabels_inside_color = null;
    this._ylabels_specific = null;
    this._ylabels_invert = false;

    this._labels = [];
    this._labels_offset = 0;
    this._labels_offsetx = 10;
    this._labels_offsety = 10;
    this._labels_axes = '';
    this._labels_position = 'center';
    this._labels_align = 'bottom';
    this._labels_ingraph = null;
    this._labels_above = false;
    this._labels_above_decimals = 0;
    this._labels_above_size = null;
    this._labels_above_angle = null;
    this._labels_sticks = false;
    this._labels_sticks_length = 7;
    this._labels_sticks_color = '#aaa';
    this._labels_specific = null;
    this._labels_specific_align = 'left';

    this._background_barcolor1 = 'rgba(0,0,0,0)';
    this._background_barcolor2 = 'rgba(0,0,0,0)';
    this._background_grid = true;
    this._background_grid_color = '#ddd';
    this._background_grid_width = 1;
    this._background_grid_hsize = 20;
    this._background_grid_vsize = 20;
    this._background_grid_hlines = true;
    this._background_grid_vlines = true;
    this._background_grid_border = true;
    this._background_grid_autofit = true;
    this._background_grid_autofit_numhlines = 5;
    this._background_grid_autofit_numvlines = 20;
    this._background_grid_autofit_align = false;
    this._background_vbars = null;
    this._background_hbars = null;
    this._background_image = null;
    this._background_image_x = null;
    this._background_image_y = null;
    this._background_image_stretch = true;
    this._background_image_align = null;
    this._background_circles = true;

    this._line_visible = true;

    this._variant = null;

    this._stepped = false;

    this._xticks = null;

    this._linewidth = 1.01;

    this._fillstyle = null;

    this._smallxticks = 3;
    this._largexticks = 5;
    this._smallyticks = 3;
    this._largeyticks = 5;
    this._ticksize = 3;
    this._tickdirection = -1;

    this._tickmarks = null; // can be reverse
    this._tickmarks_linewidth = null;
    this._tickmarks_dot_color = 'white';

    this._resize_handle_adjust = [0,0];

    this._key = [];
    this._key_background = 'white';
    this._key_position = 'graph';
    this._key_position_x = null;
    this._key_position_y = null;
    this._key_position_gutter_boxed = true;
    this._key_shadow = false;
    this._key_shadow_color = '#666';
    this._key_shadow_blur = 3;
    this._key_shadow_offsetx = 2;
    this._key_shadow_offsety = 2;
    this._key_rounded = true;
    this._key_linewidth = 1;
    this._key_color_shape = 'square';
    this._key_colors = null;
    this._key_halign = 'right';
    this._key_text_size = 10;
    this._key_interactive = false;

    this._noendxtick = false;
    this._noendytick = true;

    this._axesontop = false;

    this._filled = false;
    this._filled_range = false;
    this._filled_accumulative = true;

    this._backdrop = false;
    this._backdrop_size = 30;
    this._backdrop_alpha = 0.2

    this._animation_factor = 1;
    this._animation_unfold_x = false;
    this._animation_unfold_y = true;
    this._animation_unfold_initial = 2;
    this._animation_grow_factor = 1;

    this._grouping = 'grouped';

    this._xaxis = true;

    this._defaultcolor = 'white';

    this._line = false;
    this._line_linewidth = 1;
    this._line_colors = ['green', 'red'];
    this._line_shadow_color = 'rgba(0,0,0,0)';
    this._line_shadow_offsetx = 3;
    this._line_shadow_offsety = 3;
    this._line_shadow_blur = 2;
    this._line_stepped = false;

    this._boxplot_width = 1;
    this._boxplot_capped = true;

    this._xscale = false;
    this._xscale_units_pre = '';
    this._xscale_units_post = '';
    this._xscale_numlabels = 10;
    this._xscale_formatter = null;

    this._xtickinterval = null;

    this._margin = 2;

    this._circle = 0;
    this._circle_fill = 'red';
    this._circle_stroke = 'black';

    this._accumulative = false;

    this._boxplot = false;

    this._vbars = null;
}