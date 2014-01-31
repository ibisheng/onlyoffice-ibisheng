"use strict";

if (typeof(window["OfficeExcel"]) == 'undefined') window["OfficeExcel"] = {};

OfficeExcel.Gutter = function()
{
    this._left      = 25;
    this._right     = 25;
    this._top       = 25;
    this._bottom    = 25;
}

OfficeExcel.OtherProps = function()
{
    this._xmin = 0;
    this._xmax = 0;
    this._ymin = 0;
    this._ymax = 0;

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

    this._axis_color = 'black';

    this._units_pre = '';
    this._units_post = '';

    this._scale_decimals = 0;
    this._scale_point = '.';
    this._scale_thousand = ',';

    this._colors = ['rgb(0,0,255)', '#0f0', '#00f', '#ff0', '#0ff', '#0f0'];

    this._radius = null;

    this._exploded = 0;

	this._area_border = true;	// граница для всей области диаграммы

    this._align = 'center';

    this._xlabels = true;

    this._ylabels = true;
    this._ylabels_count = 'auto';

    this._labels = [];
    this._labels_above = false;
    this._labels_above_size = null;

    this._background_barcolor1 = 'rgba(0,0,0,0)';
    this._background_barcolor2 = 'rgba(0,0,0,0)';
    this._background_grid = true;
    this._background_grid_color = '#ddd';
    this._background_grid_width = 1;
    this._background_grid_hsize = 20;
    this._background_grid_vsize = 20;
    this._background_grid_hlines = true;
    this._background_grid_vlines = true;
    this._background_grid_autofit = true;
    this._background_grid_autofit_numhlines = 5;
    this._background_grid_autofit_numvlines = 20;
    this._background_vbars = null;
    this._background_hbars = null;

    this._variant = null;

    this._stepped = false;

    this._xticks = null;

    this._linewidth = 1.01;

    this._fillstyle = null;

    this._smallyticks = 3;
    this._ticksize = 3;

    this._tickmarks = null; // can be reverse
    this._tickmarks_dot_color = 'white';

    this._key = [];
    this._key_color_shape = 'square';
    this._key_colors = null;
    this._key_halign = 'right';
    this._key_text_size = 10;

    this._filled = false;
    this._filled_range = false;

    this._xaxis = true;

    this._defaultcolor = 'white';

    this._line = false;
    this._line_linewidth = 1;
    this._line_colors = ['green', 'red'];
    this._line_stepped = false;

    this._boxplot_width = 1;
    this._boxplot_capped = true;

    this._xscale = false;
    this._xscale_units_pre = '';
    this._xscale_units_post = '';
    this._xscale_numlabels = 10;

    this._boxplot = false;
}