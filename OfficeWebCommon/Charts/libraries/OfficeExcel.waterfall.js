    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The bar chart constructor
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    OfficeExcel.Waterfall = function (id, data)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'waterfall';
        this.max               = 0;
        this.isOfficeExcel          = true;
        this.coords            = [];

        /**
        * Compatibility with older browsers
        */
        OfficeExcel.CanvasBrowserCompat(this.context);

        // Chart gutter
        this._chartGutter   = new OfficeExcel.Gutter();
        // Chart Title
        this._chartTitle    = new OfficeExcel.Title();
        // xAxis Title
        this._xAxisTitle    = new OfficeExcel.Title();
        // yAxis Title
        this._yAxisTitle    = new OfficeExcel.Title();
        // Chart shadow
        this._shadow        = new OfficeExcel.Shadow();
        // zoom
        this._zoom          = new OfficeExcel.chartZoom();
        // Tooltip
        this._tooltip       = new OfficeExcel.Tooltips();
        // Other Props
        this._otherProps    = new OfficeExcel.OtherProps();

        // Check for support
        if (!this.canvas) {
            alert('[WATERFALL] No canvas support');
            return;
        }

        // Store the data
        this.data = data;


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getBar;
    }

    /**
    * The function you call to draw the bar chart
    */
    OfficeExcel.Waterfall.prototype.Draw = function ()
    {
        // MUST be the first thing done!
        if (typeof(this._otherProps._background_image) == 'string' && !this.__background_image__) {
            OfficeExcel.DrawBackgroundImage(this);
            return;
        }


        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        OfficeExcel.ClearEventListeners(this.id);

        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];
        
        /**
        * This gets used a lot
        */
        this.centery = ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top;

        /**
        * Work out a few things. They need to be here because they depend on things you can change after you instantiate the object
        */
        this.max            = 0;
        this.grapharea      = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
        this.graphwidth     = this.canvas.width - this._chartGutter._left - this._chartGutter._right;
        this.halfTextHeight = this._otherProps._text_size / 2;


        /**
        * Work out the maximum value
        * 
        * Normally the last bar is a total and not taken into account when the scale is generated.
        * However it is not necessarily shown, so if it's not being shown it should not be
        * accounted for.
        */
        this.max     = this.getMax(this.data);
        this.scale   = OfficeExcel.getScale(typeof(this._otherProps._ymax) == 'number' ? this._otherProps._ymax : this.max, this);
        this.max     = this.scale[4];
        var decimals = this._otherProps._scale_decimals;
        
        /**
        * ymax specified
        */
        if (this._otherProps._ymax > 0) {
            this.max = this._otherProps._ymax;
        }

        this.scale = [
                      (this.max * (1/5)).toFixed(decimals),
                      (this.max * (2/5)).toFixed(decimals),
                      (this.max * (3/5)).toFixed(decimals),
                      (this.max * (4/5)).toFixed(decimals),
                      typeof(this.max) == 'number' ? this.max.toFixed(decimals) : this.max
                     ];


        // Progressively Draw the chart
        OfficeExcel.background.Draw(this);

        this.DrawAxes();
        this.Drawbars();
        this.DrawLabels();

        /**
        * Setup the context menu if required
        */
        if (this._otherProps._contextmenu) {
            OfficeExcel.ShowContext(this);
        }

        
        /**
        * Draw crosschairs
        */
        if (this._otherProps._crosshairs) {
            OfficeExcel.DrawCrosshairs(this);
        }
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        if (this._otherProps._annotatable) {
            OfficeExcel.Annotate(this);
        }
        
        /**
        * This bit shows the mini zoom window if requested
        */
        if (this._zoom._mode == 'thumbnail' || this._zoom._mode == 'area') {
            OfficeExcel.ShowZoomWindow(this);
        }

        
        /**
        * This function enables resizing
        */
        if (this._otherProps._resizable) {
            OfficeExcel.AllowResizing(this);
        }


        /**
        * Install the click and mousemove event listeners
        */
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);
        
        /**
        * Tooltips
        */
        if (this._tooltip._tooltips) {
        
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);

            /**
            * Install the onclick event handler for the tooltips
            */
            var canvas_onclick_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas  = document.getElementById(this.id);
                var context = canvas.getContext('2d');
                var obj     = canvas.__object__;
                var bar     = obj.getBar(e);


                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                if (bar) {

                    /**
                    * First, if the event is onmousemove end the tooltip is already being shown, do nothing
                    */
                    if (obj._tooltip._event == 'onmousemove' && OfficeExcel.Registry.Get('chart.tooltip') && OfficeExcel.Registry.Get('chart.tooltip').__index__ == bar[5]) {
                        return;
                    }

                    /**
                    * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                    * This "deselects" any already selected bar
                    */
                    OfficeExcel.Redraw();

                    var x = bar[1];
                    var y = bar[2];
                    var w = bar[3];
                    var h = bar[4];

                    if (!obj._tooltip._tooltips[bar[5]]) {
                        return;
                    }
                    
                       
                    // Draw the highlight (if necessary)
                    if (obj._tooltip._highlight) {
                       context.beginPath();
                           context.fillStyle = obj._otherProps._highlight_fill;
                           context.strokeStyle = obj._otherProps._highlight_stroke;
                           context.strokeRect(x,y,w,h);
                           context.fillRect(x,y,w,h);
                       context.stroke();
                       context.fill();
                    }

                    /**
                    * Get the tooltip text
                    */
                    var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, bar[5]);
                    
                    if (text) {
                        canvas.style.cursor = 'pointer';
                        OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, bar[5]);
                    } else {
                        canvas.style.pointer = 'default';
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation();
                
                return false;
            }
            this.canvas.addEventListener(this._tooltip._event == 'onclick' ? 'click' : 'mousemove', canvas_onclick_func, false);
            OfficeExcel.AddEventListener(this.id, this._tooltip._event == 'onclick' ? 'click' : 'mousemove', canvas_onclick_func);

            /**
            * Install the window onclick handler
            */
            var window_onclick_func = function (){OfficeExcel.Redraw();};
            window.addEventListener('click', window_onclick_func, false);
            OfficeExcel.AddEventListener('window_' + this.id, 'click', window_onclick_func);

            /**
            * Install the onmousemove event handler for the tooltips
            */
            var canvas_onmousemove_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas  = document.getElementById(this.id);
                var context = canvas.getContext('2d');
                var obj     = canvas.__object__;
                var bar     = obj.getBar(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                if (bar && obj._tooltip._tooltips[bar[5]]) {
                    canvas.style.cursor = 'pointer';
                    e.stopPropagation();

                   return;
                }
                
                canvas.style.cursor = 'default';

                /**
                * Stop the event bubbling
                */
                e.stopPropagation();
                
                return false;
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);
        }

        
        /**
        * Fire the OfficeExcel ondraw event
        */
        OfficeExcel.FireCustomEvent(this, 'ondraw');
    }

    
    /**
    * Draws the charts axes
    */
    OfficeExcel.Waterfall.prototype.DrawAxes = function ()
    {
        if (this._otherProps._noaxes) {
            return;
        }

        this.context.beginPath();
        this.context.strokeStyle = this._otherProps._axis_color;
        this.context.lineWidth = 1;

        // Draw the Y axis
        if (this._otherProps._noyaxis == false) {
            this.context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
            this.context.lineTo(AA(this, this._chartGutter._left), OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
        }

        // Draw the X axis
        if (this._otherProps._noxaxis == false) {
            // Center X axis
            if (this._otherProps._xaxispos == 'center') {
                this.context.moveTo(this._chartGutter._left, AA(this, ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top));
                this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top));
            } else {
                this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
                this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));
            }
        }

        var numYTicks = this._otherProps._numyticks;

        // Draw the Y tickmarks
        if (this._otherProps._noyaxis == false) {

            var yTickGap = (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) / numYTicks;
    
            for (y=this._chartGutter._top; y < (this.canvas.height - this._chartGutter._bottom); y += yTickGap) {
                if (this._otherProps._xaxispos == 'bottom' || (y != ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top)) {
                    this.context.moveTo(this._chartGutter._left, AA(this, y));
                    this.context.lineTo(this._chartGutter._left - 3, AA(this, y));
                }
            }
            
            /**
            * If the X axis is not being shown, draw an extra tick
            */
            if (this._otherProps._noxaxis || this._otherProps._xaxispos == 'center') {
                this.context.moveTo(this._chartGutter._left - 3, AA(this, this.canvas.height - this._chartGutter._bottom));
                this.context.lineTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
            }
        }


        // Draw the X tickmarks
        if (this._otherProps._noxaxis == false) {

            xTickGap = (this.canvas.width - this._chartGutter._left - this._chartGutter._right ) / (this.data.length + (this._otherProps._total ? 1 : 0));
            
            if (this._otherProps._xaxispos == 'center') {
                yStart   = ((this.canvas.height - this._chartGutter._bottom - this._chartGutter._top) / 2) + this._chartGutter._top - 3;
                yEnd     = ((this.canvas.height - this._chartGutter._bottom - this._chartGutter._top) / 2) + this._chartGutter._top + 3;
            } else {
                yStart   = this.canvas.height - this._chartGutter._bottom;
                yEnd     = (this.canvas.height - this._chartGutter._bottom) + 3;
            }
    
            for (x=this._chartGutter._left + xTickGap; x<=OfficeExcel.GetWidth(this) - this._chartGutter._right + 1; x+=xTickGap) {
                this.context.moveTo(AA(this, x), yStart);
                this.context.lineTo(AA(this, x), yEnd);
            }
            
            if (this._otherProps._noyaxis) {
                this.context.moveTo(AA(this, this._chartGutter._left), yStart);
                this.context.lineTo(AA(this, this._chartGutter._left), yEnd);
            }
        }

        /**
        * If the Y axis is not being shown, draw an extra tick
        */
        if (this._otherProps._noyaxis && this._otherProps._noxaxis == false) {
            this.context.moveTo(AA(this, this._chartGutter._left), OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
            this.context.lineTo(AA(this, this._chartGutter._left), OfficeExcel.GetHeight(this) - this._chartGutter._bottom + 3);
        }

        this.context.stroke();
    }


    /**
    * Draws the labels for the graph
    */
    OfficeExcel.Waterfall.prototype.DrawLabels = function ()
    {
        var context    = this.context;
        var numYLabels = 5; // Make this configurable
        var interval   = this.grapharea / numYLabels;
        var font       = this._otherProps._text_font;
        var size       = this._otherProps._text_size;
        var color      = this._otherProps._text_color;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
        
        this.context.beginPath();
        this.context.fillStyle = color;

        /**
        * First, draw the Y labels
        */
        if (this._otherProps._ylabels) {
            if (this._otherProps._xaxispos == 'center') {

                var halfInterval = interval / 2;
                var halfWay      = ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top;

                for (var i=0; i<numYLabels; ++i) {
                    OfficeExcel.Text(context,
                                font,
                                size,
                        this._chartGutter._left - 5,
                        this._chartGutter._top + (i * halfInterval),
                                OfficeExcel.number_format(this, this.scale[4 - i], units_pre, units_post),
                                'center',
                                'right');
                }

                for (var i=0; i<numYLabels; ++i) {
                    OfficeExcel.Text(context,
                                font,
                                size,
                        this._chartGutter._left - 5,
                                halfWay + (i * halfInterval) + halfInterval,
                                '-' + OfficeExcel.number_format(this, this.scale[i], units_pre, units_post),
                                'center',
                                'right');
                }

            } else {

                for (var i=1; i<=numYLabels; ++i) {
                    OfficeExcel.Text(context,
                                font,
                                size,
                        this._chartGutter._left - 5,
                                this.canvas.height - this._chartGutter._bottom - (i * interval),
                                OfficeExcel.number_format(this, this.scale[i - 1], units_pre, units_post),
                                'center',
                                'right');
    
                }
            }
        }



        /**
        * Now, draw the X labels
        */
        if (this._otherProps._labels.length > 0) {
        
            // Recalculate the interval for the X labels
            interval = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / this._otherProps._labels.length;
            
            var halign = 'center';
            var angle  = this._otherProps._text_angle;
            
            if (angle) {
                halign = 'right';
                angle *= -1;
            }

            var labels = this._otherProps._labels;

            for (var i=0; i<labels.length; ++i) {

                // context, font, size, x, y, text[, valign[, halign[, border[, angle[, background[, bold[, indicator]]]]]]]
                OfficeExcel.Text(context,
                            font,
                            size,
                    this._chartGutter._left + (i * interval) + (interval / 2),
                            this.canvas.height - this._chartGutter._bottom + 5 + this.halfTextHeight,
                            labels[i],
                            'center',
                            halign,
                            null,
                            angle);

            }
        }
        
        this.context.stroke();
        this.context.fill();
    }


    /**
    * Draws the bars on to the chart
    */
    OfficeExcel.Waterfall.prototype.Drawbars = function ()
    {
        var context      = this.context;
        var canvas       = this.canvas;
        var hmargin      = this._otherProps._hmargin;
        var runningTotal = 0;

        
            for (var i=0; i<this.data.length; ++i) {
                context.beginPath();
                context.strokeStyle = this._otherProps._strokecolor;

                    var x      = this._chartGutter._left + hmargin + (((this.graphwidth / (this.data.length + (this._otherProps._total ? 1 : 0))) * i) * this._otherProps._multiplier_x);
                    var y      = this._chartGutter._top + this.grapharea - (i == 0 ? ((this.data[0] / this.max) * this.grapharea) : (this.data[i] > 0 ? ((runningTotal + this.data[i]) / this.max) * this.grapharea : (runningTotal / this.max) * this.grapharea));
                    var w      = ((this.canvas.width - this._chartGutter._left - this._chartGutter._right) / (this.data.length + (this._otherProps._total ? 1 : 0 )) ) - (2 * this._otherProps._hmargin);
                        w      = w * this._otherProps._multiplier_w;
                    var h      = (Math.abs(this.data[i]) / this.max) * this.grapharea;

                    if (this._otherProps._xaxispos == 'center') {
                        h /= 2;
                        y  = (i == 0 ? ((this.data[0] / this.max) * this.grapharea) : (this.data[i] > 0 ? ((runningTotal + this.data[i]) / this.max) * this.grapharea : (runningTotal / this.max) * this.grapharea));
                        y = this._chartGutter._top + (this.grapharea/2) - (y / 2);
                    }

                    // Color
                    context.fillStyle = this.data[i] >= 0 ? this._otherProps._colors[0] : this._otherProps._colors[1];

                    
                    if (this._shadow._visible)
                        OfficeExcel.SetShadow(this, this._shadow._color, this._shadow._offset_x, this._shadow._offset_y, this._shadow._blur);
                    else
                        OfficeExcel.NoShadow(this);

                    context.strokeRect(x, y, w, h);
                    context.fillRect(x, y, w, h);

                    this.coords.push([x, y, w, h]);
                    
                    runningTotal += this.data[i];

                context.stroke();
                context.fill();
            }
            
if (this._otherProps._total) {

    // This is the height of the final bar
    h = (runningTotal / this.max) * (this.grapharea / (this._otherProps._xaxispos == 'center' ? 2 : 1));
    
    /**
    * Set the Y (ie the start point) value
    */
    if (this._otherProps._xaxispos == 'center') {
        y = runningTotal > 0 ? this.centery - h : this.centery - h;
    } else {
        y = this.canvas.height - this._chartGutter._bottom - h;
    }

    // This is the X position of the final bar
    x = x + (this._otherProps._hmargin * 2) + w;


    // Final color
    this.context.fillStyle = this._otherProps._colors[2];

    this.context.beginPath();
        this.context.strokeRect(x, y, w, h);
        this.context.fillRect(x, y, w, h);
    this.context.stroke();
    this.context.fill();

    this.coords.push([x, y - (runningTotal > 0 ? 0 : Math.abs(h)), w, Math.abs(h)]);
}

            OfficeExcel.NoShadow(this);

            /**
            * This draws the connecting lines
            */
            for (var i=1; i<this.coords.length; ++i) {
                context.strokeStyle = 'gray';
                context.beginPath();
                    if (this.data[i - 1] > 0) {
                        context.moveTo(this.coords[i - 1][0] + this.coords[i - 1][2], AA(this, this.coords[i - 1][1]));
                        context.lineTo(this.coords[i - 1][0] + this.coords[i - 1][2] + (2 * hmargin), AA(this, this.coords[i - 1][1]));
                    } else {
                        context.moveTo(this.coords[i - 1][0] + this.coords[i - 1][2], AA(this, this.coords[i - 1][1] + this.coords[i - 1][3]));
                        context.lineTo(this.coords[i - 1][0] + this.coords[i - 1][2] + (2 * hmargin), AA(this, this.coords[i - 1][1] + this.coords[i - 1][3]));
                    }
                context.stroke();
            }
    }


    /**
    * Not used by the class during creating the graph, but is used by event handlers
    * to get the coordinates (if any) of the selected bar
    * 
    * @param object e The event object
    */
    OfficeExcel.Waterfall.prototype.getBar = function (e)
    {
        var canvas      = e.target;
        var obj         = e.target.__object__;        
        var mouseCoords = OfficeExcel.getMouseXY(e);

        /**
        * Loop through the bars determining if the mouse is over a bar
        */
        for (var i=0; i<obj.coords.length; i++) {

            var mouseX = mouseCoords[0];
            var mouseY = mouseCoords[1];

            var left   = obj.coords[i][0];
            var top    = obj.coords[i][1];
            var width  = obj.coords[i][2];
            var height = obj.coords[i][3];

            if (   mouseX >= left
                && mouseX <= left + width
                && mouseY >= top
                && mouseY <= top + height) {
                
                return [obj, left, top, width, height, i];
            }
        }
        
        return null;
    }


    /**
    * The Waterfall is slightly different to Bar/Line charts so has this function to get the max value
    */
    OfficeExcel.Waterfall.prototype.getMax = function (data)
    {
        var runningTotal = 0;
        var max          = 0;

        for (var i=0; i<data.length; ++i) {
            runningTotal += data[i];
            max = Math.max(max, Math.abs(runningTotal));
        }

        return max;
    }