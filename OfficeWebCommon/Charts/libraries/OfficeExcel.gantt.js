    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The gantt chart constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    */
    OfficeExcel.Gantt = function (id)
    {
        // Get the canvas and context objects
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.type              = 'gantt';
        this.isOfficeExcel          = true;


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

        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getBar;
    }

    /**
    * Draws the chart
    */
    OfficeExcel.Gantt.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        OfficeExcel.ClearEventListeners(this.id);

        /**
        * Work out the graphArea
        */
        this.graphArea     = this.canvas.width - this._chartGutter._left - this._chartGutter._right;
        this.graphHeight   = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
        this.numEvents     = this._otherProps._events.length
        this.barHeight     = this.graphHeight / this.numEvents;
        this.halfBarHeight = this.barHeight / 2;

        /**
        * Draw the background
        */
        OfficeExcel.background.Draw(this);
        
        /**
        * Draw the labels at the top
        */
        this.DrawLabels();




        /**
        * Install the clickand mousemove event listeners
        */
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);

        /**
        * Draw the events
        */
        this.DrawEvents();
        
        
        /**
        * Setup the context menu if required
        */
        if (this._otherProps._contextmenu) {
            OfficeExcel.ShowContext(this);
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
        * This function enables adjusting
        */
        if (this._otherProps._adjustable) {
            OfficeExcel.AllowAdjusting(this);
        }


        /**
        * Fire the OfficeExcel ondraw event
        */
        OfficeExcel.FireCustomEvent(this, 'ondraw');
    }

    
    /**
    * Draws the labels at the top and the left of the chart
    */
    OfficeExcel.Gantt.prototype.DrawLabels = function ()
    {
        this.context.beginPath();
        this.context.fillStyle = this._otherProps._text_color;

        /**
        * Draw the X labels at the top of the chart.
        */
        var labels = this._otherProps._labels;
        var labelSpace = (this.graphArea) / labels.length;
        var x      = this._chartGutter._left + (labelSpace / 2);
        var y      = this._chartGutter._top - (this._otherProps._text_size / 2) - 5;
        var font   = this._otherProps._text_font;
        var size   = this._otherProps._text_size;

        this.context.strokeStyle = 'black'

        if (this._otherProps._labels_align == 'bottom') {
            y = this.canvas.height - this._chartGutter._bottom + size;
        }

        /**
        * Draw the horizontal labels
        */
        for (i=0; i<labels.length; ++i) {
            OfficeExcel.Text(this.context,
                        font,
                        size,
                        x + (i * labelSpace),
                        y,
                        String(labels[i]),
                        'center',
                        'center');
        }

        // Draw the vertical labels
        for (var i=0; i<this._otherProps._events.length; ++i) {
            
            var ev = this._otherProps._events[i];
            var x  = this._chartGutter._left;
            var y  = this._chartGutter._top + this.halfBarHeight + (i * this.barHeight);

            OfficeExcel.Text(this.context,
                        font,
                        size,
                        x - 5, y,
                        OfficeExcel.is_array(ev[0]) ? String(ev[0][3]) : String(ev[3]),
                        'center',
                        'right');
        }
    }
    
    /**
    * Draws the events to the canvas
    */
    OfficeExcel.Gantt.prototype.DrawEvents = function ()
    {
        var canvas  = this.canvas;
        var context = this.context;
        var events  = this._otherProps._events;

        /**
        * Reset the coords array to prevent it growing
        */
        this.coords = [];

        /**
        * First draw the vertical bars that have been added
        */
        if (this._otherProps._vbars) {
            for (i=0; i<this._otherProps._vbars.length; ++i) {
                // Boundary checking
                if (this._otherProps._vbars[i][0] + this._otherProps._vbars[i][1] > this._otherProps._xmax) {
                    this._otherProps._vbars[i][1] = 364 - this._otherProps._vbars[i][0];
                }
    
                var barX   = this._chartGutter._left + (( (this._otherProps._vbars[i][0] - this._otherProps._xmin) / (this._otherProps._xmax - this._otherProps._xmin) ) * this.graphArea);

                var barY   = this._chartGutter._top;
                var width  = (this.graphArea / (this._otherProps._xmax - this._otherProps._xmin) ) * this._otherProps._vbars[i][1];
                var height = OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom;
                
                // Right hand bounds checking
                if ( (barX + width) > (OfficeExcel.GetWidth(this) - this._chartGutter._right) ) {
                    width = OfficeExcel.GetWidth(this) - this._chartGutter._right - barX;
                }
    
                context.fillStyle = this._otherProps._vbars[i][2];
                context.fillRect(barX, barY, width, height);
            }
        }


        /**
        * Draw the events
        */
        for (i=0; i<events.length; ++i) {            
            if (typeof(events[i][0]) == 'number') {
                this.DrawSingleEvent(events[i]);
            } else {
                for (var j=0; j<events[i].length; ++j) {
                    this.DrawSingleEvent(events[i][j]);
                }
            }

        }


        /**
        * If tooltips are defined, handle them
        */
        if (this._tooltip._tooltips) {

            // Register the object for redrawing
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);

            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            var canvas_onmousemove_func = function (e)
            {
                e               = OfficeExcel.FixEventObject(e);
                var canvas      = e.target;
                var obj         = canvas.__object__;
                var len         = obj.coords.length;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var bar         = obj.getBar(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                if (bar) {
                    var text = obj._tooltip._tooltips[bar[5]];
                        text = OfficeExcel.getTooltipTextFromDIV(obj._tooltip._tooltips[bar[5]]);
                        
                    if (text) {
                        canvas.style.cursor = 'pointer';
                    }

                    if (obj._tooltip._event == 'onmousemove' && (!OfficeExcel.Registry.Get('chart.tooltip') || bar[5] != OfficeExcel.Registry.Get('chart.tooltip').__index__)) {
                        canvas_onclick_func(e);
                    }
                } else {
                    canvas.style.cursor = 'default';
                }
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);


            var canvas_onclick_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas      = e.target;
                var context     = canvas.getContext('2d');
                var obj         = canvas.__object__;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                var bar         = obj.getBar(e);
                
                if (bar) {
                
                    var idx = bar[5];

                    // Get the tooltip text
                    var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, idx);
                        
                    if (!text) {
                        return;
                    }

                   // Redraw the graph
                    OfficeExcel.Redraw();

                    if (String(text).length && text != '') {

                        // SHOW THE CORRECT TOOLTIP
                        OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, idx);
                        
                        /**
                        * Draw a rectangle around the correct bar, in effect highlighting it
                        */
                        context.lineWidth = 1;
                        context.strokeStyle = obj._otherProps._highlight_stroke;
                        context.fillStyle   = obj._otherProps._highlight_fill;
                        context.strokeRect(bar[1], bar[2], bar[3], bar[4]);
                        context.fillRect(bar[1], bar[2], bar[3], bar[4]);
                    }
                }
            }
            this.canvas.addEventListener('click', canvas_onclick_func, false);
            OfficeExcel.AddEventListener(this.id, 'click', canvas_onclick_func);
        }
    }


    /**
    * Retrieves the bar (if any) that has been click on or is hovered over
    * 
    * @param object e The event object
    */
    OfficeExcel.Gantt.prototype.getBar = function (e)
    {
        e = OfficeExcel.FixEventObject(e);

        var canvas      = e.target;
        var context     = canvas.getContext('2d');
        var obj         = canvas.__object__;
        var mouseCoords = OfficeExcel.getMouseXY(e);
        var mouseX      = mouseCoords[0];
        var mouseY      = mouseCoords[1];
        var coords      = obj.coords;

        /**
        * Loop through the bars determining if the mouse is over a bar
        */
        for (var i=0; i<coords.length; i++) {

            var left   = coords[i][0];
            var top    = coords[i][1];
            var width  = coords[i][2];
            var height = coords[i][3];

            if (   mouseX >= left
                && mouseX <= (left + width)
                && mouseY >= top
                && mouseY <= (top + height)
               ) {
                
                return [obj, left, top, width, height, i];
            }
        }
    }


    /**
    * Draws a single event
    */
    OfficeExcel.Gantt.prototype.DrawSingleEvent = function ()
    {
        var min     = this._otherProps._xmin;
        var context = this.context;
        var ev      = OfficeExcel.array_clone(arguments[0]);

        context.beginPath();
        context.strokeStyle = 'black';
        context.fillStyle = ev[4] ? ev[4] : this._otherProps._defaultcolor;

        var barStartX  = AA(this, this._chartGutter._left + (((ev[0] - min) / (this._otherProps._xmax - min)) * this.graphArea));
        var barStartY  = AA(this, this._chartGutter._top + (i * this.barHeight));
        var barWidth   = (ev[1] / (this._otherProps._xmax - min) ) * this.graphArea;

        /**
        * If the width is greater than the graph atrea, curtail it
        */
        if ( (barStartX + barWidth) > (this.canvas.width - this._chartGutter._right) ) {
            barWidth = this.canvas.width - this._chartGutter._right - barStartX;
        }
        
        // This helps anti-aliasing
        //
        // 9/1/2012 
        //
        //The width is now rounded to the nearest pixel. This helps with antialiasing (because the start value is
        // rounded to the nearest .5 value.
        barWidth       = Math.round(barWidth);
        this.barHeight = Math.round(this.barHeight)
        
        /**
        *  Draw the actual bar storing store the coordinates
        */
        this.coords.push([barStartX, barStartY + this._otherProps._margin, barWidth, this.barHeight - (2 * this._otherProps._margin)]);
        context.fillRect(barStartX, barStartY + this._otherProps._margin, barWidth, this.barHeight - (2 * this._otherProps._margin) );

        // Work out the completeage indicator
        var complete = (ev[2] / 100) * barWidth;

        // Draw the % complete indicator. If it's greater than 0
        if (typeof(ev[2]) == 'number') {
            context.beginPath();
            context.fillStyle = ev[5] ? ev[5] : '#0c0';
            context.fillRect(barStartX,
                                  barStartY + this._otherProps._margin,
                                  (ev[2] / 100) * barWidth,
                                  this.barHeight - (2 * this._otherProps._margin) );
            
            context.beginPath();
            context.fillStyle = this._otherProps._text_color;
            OfficeExcel.Text(context, this._otherProps._text_font, this._otherProps._text_size, barStartX + barWidth + 5, barStartY + this.halfBarHeight, String(ev[2]) + '%', 'center');
        }

        // draw the border around the bar
        if (this._otherProps._borders || ev[6]) {
            context.strokeStyle = typeof(ev[6]) == 'string' ? ev[6] : 'black';
            context.lineWidth = (typeof(ev[7]) == 'number' ? ev[7] : 1);
            context.beginPath();
            context.strokeRect(barStartX, barStartY + this._otherProps._margin, barWidth, this.barHeight - (2 * this._otherProps._margin) );
        }
    }