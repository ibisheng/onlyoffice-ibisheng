    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The bi-polar/age frequency constructor.
    * 
    * @param string id The id of the canvas
    * @param array  left  The left set of data points
    * @param array  right The right set of data points
    */
    OfficeExcel.Bipolar = function (id, left, right)
    {
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'bipolar';
        this.coords            = [];
        this.max               = 0;
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
        
        // The left and right data respectively
        this.left       = left;
        this.right      = right;
        this.data       = [left, right];

        // Pad the arrays so they're the same size
        while (this.left.length < this.right.length) this.left.push(0);
        while (this.left.length > this.right.length) this.right.push(0);
        
        /**
        * Add the common .getShape() method
        */
        this.getShape = this.getBar;
    }

    /**
    * Draws the graph
    */
    OfficeExcel.Bipolar.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        OfficeExcel.ClearEventListeners(this.id);

        // Reset the data to what was initially supplied
        this.left  = this.data[0];
        this.right = this.data[1];


        /**
        * Reset the coords array
        */
        this.coords = [];

        this.GetMax();
        this.DrawAxes();
        this.DrawTicks();
        this.DrawLeftBars();
        this.DrawRightBars();

        if (this._otherProps._axis_color != 'black') {
            this.DrawAxes(); // Draw the axes again (if the axes color is not black)
        }

        this.DrawLabels();
        this.DrawTitles();
        
        /**
        * Setup the context menu if required
        */
        if (this._otherProps._contextmenu) {
            OfficeExcel.ShowContext(this);
        }


        /**
        * Install the clickand mousemove event listeners
        */
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);


        /**
        * Install the on* event handlers
        */
        if (this._tooltip._tooltips) {


            // Register the object so that it gets redrawn
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);


            /**
            * Install the window onclick handler
            */
            
            /**
            * Install the window event handler
            */
            var eventHandler_window_click = function ()
            {
                OfficeExcel.Redraw();
            }
            window.addEventListener('click', eventHandler_window_click, false);
            OfficeExcel.AddEventListener('window_' + this.id, 'click', eventHandler_window_click);



            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            var eventHandler_canvas_mousemove = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var bar         = obj.getBar(e);

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                for (var i=0; i<obj.coords.length; i++) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = obj.coords[i][0];
                    var top    = obj.coords[i][1];
                    var width  = obj.coords[i][2];
                    var height = obj.coords[i][3];

                    if (mouseX >= left && mouseX <= (left + width ) && mouseY >= top && mouseY <= (top + height) ) {
                        
                        var text   = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, i);
                        
                        canvas.style.cursor = text ? 'pointer' : 'default';
                        return;
                    }
                }
                    
                canvas.style.cursor = 'default';
            }
            this.canvas.addEventListener('mousemove', eventHandler_canvas_mousemove, false);
            OfficeExcel.AddEventListener(this.id, 'mouseover', eventHandler_canvas_mousemove);


            /**
            * Install the onclick event handler for the tooltips
            */
            var eventHandler_canvas_click = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas = document.getElementById(this.id)
                var obj = canvas.__object__;

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                OfficeExcel.Clear(canvas);
                obj.Draw();
    
                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var bar         = obj.getBar(e);

                /**
                * This bit shows the tooltip (if required)
                */
                if (bar) {

                    var mouseX = mouseCoords[0];  // In relation to the canvas
                    var mouseY = mouseCoords[1];  // In relation to the canvas
                    var left   = bar[0];
                    var top    = bar[1];
                    var width  = bar[2];
                    var height = bar[3];
                    var index  = bar[4];

                    /**
                    * Show a tooltip if it's defined
                    */
                    if (obj._tooltip._tooltips) {

                        var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, index);

                        // Only now show a tooltip if one has been set
                        if (text) {
                            obj.context.beginPath();
                                obj.context.strokeStyle = obj._otherProps._highlight_stroke;
                                obj.context.fillStyle   = obj._otherProps._highlight_fill;
                                obj.context.strokeRect(left, top, width, height);
                                obj.context.fillRect(left, top, width, height);
                            obj.context.stroke();
                            obj.context.fill();

                            OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, index);
                        }
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation();
                
                return false;
            }
            this.canvas.addEventListener('click', eventHandler_canvas_click, false);
            OfficeExcel.AddEventListener(this.id, 'click', eventHandler_canvas_click);

            // This resets the bipolar graph
            if (OfficeExcel.Registry.Get('chart.tooltip')) {
                OfficeExcel.Registry.Get('chart.tooltip').style.display = 'none';
                OfficeExcel.Registry.Set('chart.tooltip', null)
            }
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
        * Fire the OfficeExcel ondraw event
        */
        OfficeExcel.FireCustomEvent(this, 'ondraw');
    }


    /**
    * Draws the axes
    */
    OfficeExcel.Bipolar.prototype.DrawAxes = function ()
    {
        // Draw the left set of axes
        this.context.beginPath();
        this.context.strokeStyle = this._otherProps._axis_color;

        this.axisWidth  = (this.canvas.width - this._otherProps._gutter_center - this._chartGutter._left - this._chartGutter._right) / 2;
        this.axisHeight = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;

        this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
        this.context.lineTo(this._chartGutter._left + this.axisWidth, AA(this, this.canvas.height - this._chartGutter._bottom));
        
        this.context.moveTo(AA(this, this._chartGutter._left + this.axisWidth), this.canvas.height - this._chartGutter._bottom);
        this.context.lineTo(AA(this, this._chartGutter._left + this.axisWidth), this._chartGutter._top);
        
        this.context.stroke();


        // Draw the right set of axes
        this.context.beginPath();

        var x = this._chartGutter._left + this.axisWidth + this._otherProps._gutter_center;
        
        this.context.moveTo(AA(this, x), this._chartGutter._top);
        this.context.lineTo(AA(this, x), this.canvas.height - this._chartGutter._bottom);
        
        this.context.moveTo(AA(this, x), AA(this, this.canvas.height - this._chartGutter._bottom));
        this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));

        this.context.stroke();
    }


    /**
    * Draws the tick marks on the axes
    */
    OfficeExcel.Bipolar.prototype.DrawTicks = function ()
    {
        var numDataPoints = this.left.length;
        var barHeight     = ( (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom)- (this.left.length * (this._otherProps._margin * 2) )) / numDataPoints;
        
        // Draw the left Y tick marks
        for (var i = this.canvas.height - this._chartGutter._bottom; i >= this._chartGutter._top; i -= (barHeight + ( this._otherProps._margin * 2)) ) {
            if (i < (this.canvas.height - this._chartGutter._bottom) ) {
                this.context.beginPath();
                this.context.moveTo(this._chartGutter._left + this.axisWidth, AA(this, i));
                this.context.lineTo(this._chartGutter._left + this.axisWidth + 3, AA(this, i));
                this.context.stroke();
            }
        }

        //Draw the right axis Y tick marks
        for (var i = this.canvas.height - this._chartGutter._bottom; i >= this._chartGutter._top; i -= (barHeight + ( this._otherProps._margin * 2)) ) {
            if (i < (this.canvas.height - this._chartGutter._bottom) ) {
                this.context.beginPath();
                this.context.moveTo(this._chartGutter._left + this.axisWidth + this._otherProps._gutter_center, AA(this, i));
                this.context.lineTo(this._chartGutter._left + this.axisWidth + this._otherProps._gutter_center - 3, AA(this, i));
                this.context.stroke();
            }
        }
        
        var xInterval = this.axisWidth / 10;

        // Is xtickinterval specified ? If so, use that.
        if (typeof(this._otherProps._xtickinterval) == 'number')
            xInterval = this._otherProps._xtickinterval;

        
        // Draw the left sides X tick marks
        for (i=this._chartGutter._left; i<(this._chartGutter._left + this.axisWidth); i+=xInterval) {
            this.context.beginPath();
            this.context.moveTo(AA(this, i), this.canvas.height - this._chartGutter._bottom);
            this.context.lineTo(AA(this, i), (this.canvas.height - this._chartGutter._bottom) + 4);
            this.context.closePath();
            
            this.context.stroke();
        }

        // Draw the right sides X tick marks
        var stoppingPoint = this.canvas.width - this._chartGutter._right;

        for (i=(this._chartGutter._left + this.axisWidth + this._otherProps._gutter_center + xInterval); i<=stoppingPoint; i+=xInterval) {
            this.context.beginPath();
                this.context.moveTo(AA(this, i), this.canvas.height - this._chartGutter._bottom);
                this.context.lineTo(AA(this, i), (this.canvas.height - this._chartGutter._bottom) + 4);
            this.context.closePath();
            
            this.context.stroke();
        }
        
        // Store this for later
        this.barHeight = barHeight;
    }


    /**
    * Figures out the maximum value, or if defined, uses xmax
    */
    OfficeExcel.Bipolar.prototype.GetMax = function()
    {
        var max = 0;
        var dec = this._otherProps._scale_decimals;
        
        // xmax defined
        if (this._otherProps._xmax) {

            max = this._otherProps._xmax;
            
            this.scale    = [];
            this.scale[0] = Number((max / 5) * 1).toFixed(dec);
            this.scale[1] = Number((max / 5) * 2).toFixed(dec);
            this.scale[2] = Number((max / 5) * 3).toFixed(dec);
            this.scale[3] = Number((max / 5) * 4).toFixed(dec);
            this.scale[4] = Number(max).toFixed(dec);

            this.max = max;
            

        // Generate the scale ourselves
        } else {
            this.leftmax  = OfficeExcel.array_max(this.left);
            this.rightmax = OfficeExcel.array_max(this.right);
            max = Math.max(this.leftmax, this.rightmax);

            this.scale    = OfficeExcel.getScale(max, this);
            this.scale[0] = Number(this.scale[0]).toFixed(dec);
            this.scale[1] = Number(this.scale[1]).toFixed(dec);
            this.scale[2] = Number(this.scale[2]).toFixed(dec);
            this.scale[3] = Number(this.scale[3]).toFixed(dec);
            this.scale[4] = Number(this.scale[4]).toFixed(dec);

            this.max = this.scale[4];
        }

        // Don't need to return it as it is stored in this.max
    }


    /**
    * Function to draw the left hand bars
    */
    OfficeExcel.Bipolar.prototype.DrawLeftBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = this._otherProps._strokecolor;

        for (i=0; i<this.left.length; ++i) {
            
            /**
            * Turn on a shadow if requested
            */
            if (this._shadow._visible) {
                this.context.shadowColor   = this._shadow._color;
                this.context.shadowBlur    = this._shadow._blur;
                this.context.shadowOffsetX = this._shadow._offset_x;
                this.context.shadowOffsetY = this._shadow._offset_y;
            }

            this.context.beginPath();

                // Set the colour
                if (this._otherProps._colors[i]) {
                    this.context.fillStyle = this._otherProps._colors[i];
                }
                
                /**
                * Work out the coordinates
                */
                var width = ( (this.left[i] / this.max) *  this.axisWidth);
                var coords = [
                    this._chartGutter._left + this.axisWidth - width,
                    this._chartGutter._top + (i * ( this.axisHeight / this.left.length)) + this._otherProps._margin,
                              width,
                              this.barHeight
                             ];

                // Draw the IE shadow if necessary
                if (OfficeExcel.isOld() && this._shadow._visible) {
                    this.DrawIEShadow(coords);
                }
    
                
                this.context.strokeRect(AA(this, coords[0]), AA(this, coords[1]), coords[2], coords[3]);
                this.context.fillRect(AA(this, coords[0]), AA(this, coords[1]), coords[2], coords[3]);

            this.context.stroke();
            this.context.fill();

            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([
                              coords[0],
                              coords[1],
                              coords[2],
                              coords[3]
                             ]);
        }

        /**
        * Turn off any shadow
        */
        OfficeExcel.NoShadow(this);
    }


    /**
    * Function to draw the right hand bars
    */
    OfficeExcel.Bipolar.prototype.DrawRightBars = function ()
    {
        // Set the stroke colour
        this.context.strokeStyle = this._otherProps._strokecolor;
            
        /**
        * Turn on a shadow if requested
        */
        if (this._shadow._visible) {
            this.context.shadowColor   = this._shadow._color;
            this.context.shadowBlur    = this._shadow._blur;
            this.context.shadowOffsetX = this._shadow._offset_x;
            this.context.shadowOffsetY = this._shadow._offset_y;
        }

        for (var i=0; i<this.right.length; ++i) {
            this.context.beginPath();

                // Set the colour
                if (this._otherProps._colors[i]) {
                    this.context.fillStyle = this._otherProps._colors[i];
                }
    
    
                var width = ( (this.right[i] / this.max) * this.axisWidth);
                var coords = [
                    this._chartGutter._left + this.axisWidth + this._otherProps._gutter_center,
                              this._otherProps._margin + (i * (this.axisHeight / this.right.length)) + this._chartGutter._top,
                              width,
                              this.barHeight
                            ];
    
                    // Draw the IE shadow if necessary
                    if (OfficeExcel.isOld() && this._shadow._visible) {
                        this.DrawIEShadow(coords);
                    }
                this.context.strokeRect(AA(this, coords[0]), AA(this, coords[1]), coords[2], coords[3]);
                this.context.fillRect(AA(this, coords[0]), AA(this, coords[1]), coords[2], coords[3]);

            this.context.closePath();
            
            /**
            * Add the coordinates to the coords array
            */
            this.coords.push([
                              coords[0],
                              coords[1],
                              coords[2],
                              coords[3]
                             ]);
        }
        
        this.context.stroke();

        /**
        * Turn off any shadow
        */
        OfficeExcel.NoShadow(this);
    }


    /**
    * Draws the titles
    */
    OfficeExcel.Bipolar.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this._otherProps._text_color;

        var labelPoints = new Array();
        var font = this._otherProps._text_font;
        var size = this._otherProps._text_size;
        
        var max = Math.max(this.left.length, this.right.length);
        
        for (i=0; i<max; ++i) {
            var barAreaHeight = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
            var barHeight     = barAreaHeight / this.left.length;
            var yPos          = (i * barAreaHeight) + this._chartGutter._top;

            labelPoints.push(this._chartGutter._top + (i * barHeight) + (barHeight / 2) + 5);
        }

        for (i=0; i<labelPoints.length; ++i) {
            OfficeExcel.Text(this.context,
                        this._otherProps._text_font,
                        this._otherProps._text_size,
                this._chartGutter._left + this.axisWidth + (this._otherProps._gutter_center / 2),
                        labelPoints[i],
                        String(this._otherProps._labels[i] ? this._otherProps._labels[i] : ''),
                        null,
                        'center');
        }

        // Now draw the X labels for the left hand side
        OfficeExcel.Text(this.context,font,size,this._chartGutter._left,this.canvas.height - this._chartGutter._bottom + 14,OfficeExcel.number_format(this, this.scale[4], this._otherProps._units_pre, this._otherProps._units_post),null,'center');
        OfficeExcel.Text(this.context, font, size, this._chartGutter._left + ((this.canvas.width - this._otherProps._gutter_center - this._chartGutter._left - this._chartGutter._right) / 2) * (1/5), this.canvas.height - this._chartGutter._bottom + 14, OfficeExcel.number_format(this, this.scale[3], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this._chartGutter._left + ((this.canvas.width - this._otherProps._gutter_center - this._chartGutter._left - this._chartGutter._right) / 2) * (2/5), this.canvas.height - this._chartGutter._bottom + 14, OfficeExcel.number_format(this, this.scale[2], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this._chartGutter._left + ((this.canvas.width - this._otherProps._gutter_center - this._chartGutter._left - this._chartGutter._right) / 2) * (3/5), this.canvas.height - this._chartGutter._bottom + 14, OfficeExcel.number_format(this, this.scale[1], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this._chartGutter._left + ((this.canvas.width - this._otherProps._gutter_center - this._chartGutter._left - this._chartGutter._right) / 2) * (4/5), this.canvas.height - this._chartGutter._bottom + 14, OfficeExcel.number_format(this, this.scale[0], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');

        // Now draw the X labels for the right hand side
        OfficeExcel.Text(this.context, font, size, this.canvas.width - this._chartGutter._right, this.canvas.height - this._chartGutter._bottom + 14, OfficeExcel.number_format(this, this.scale[4], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this.canvas.width - this._chartGutter._right - (this.axisWidth * 0.2), this.canvas.height - this._chartGutter._bottom + 14,OfficeExcel.number_format(this, this.scale[3], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this.canvas.width - this._chartGutter._right - (this.axisWidth * 0.4), this.canvas.height - this._chartGutter._bottom + 14,OfficeExcel.number_format(this, this.scale[2], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this.canvas.width - this._chartGutter._right - (this.axisWidth * 0.6), this.canvas.height - this._chartGutter._bottom + 14,OfficeExcel.number_format(this, this.scale[1], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
        OfficeExcel.Text(this.context, font, size, this.canvas.width - this._chartGutter._right - (this.axisWidth * 0.8), this.canvas.height - this._chartGutter._bottom + 14,OfficeExcel.number_format(this, this.scale[0], this._otherProps._units_pre, this._otherProps._units_post), null, 'center');
    }
    
    /**
    * Draws the titles
    */
    OfficeExcel.Bipolar.prototype.DrawTitles = function ()
    {
        OfficeExcel.Text(this.context, this._otherProps._text_font, this._otherProps._text_size, this._chartGutter._left + 5, (this._chartGutter._top / 2) + 5, String(this._otherProps._title_left), 'center');
        OfficeExcel.Text(this.context,this._otherProps._text_font, this._otherProps._text_size, this.canvas.width - this._chartGutter._right - 5, (this._chartGutter._top / 2) + 5, String(this._otherProps._title_right), 'center', 'right');
        
        // Draw the main title for the whole chart
        OfficeExcel.DrawTitle(this.canvas, this._chartTitle._text, this._chartGutter._top, null, this._chartTitle._size ? this._chartTitle._size : null);
    }


    /**
    * This function is used by MSIE only to manually draw the shadow
    * 
    * @param array coords The coords for the bar
    */
    OfficeExcel.Bipolar.prototype.DrawIEShadow = function (coords)
    {
        var prevFillStyle = this.context.fillStyle;
        var offsetx = this._shadow._offset_x;
        var offsety = this._shadow._offset_y;
        
        this.context.lineWidth = this._otherProps._linewidth;
        this.context.fillStyle = this._shadow._color;
        this.context.beginPath();
        
        // Draw shadow here
        this.context.fillRect(coords[0] + offsetx, coords[1] + offsety, coords[2],coords[3]);

        this.context.fill();
        
        // Change the fillstyle back to what it was
        this.context.fillStyle = prevFillStyle;
    }


    /**
    * Returns the appropriate focussed bar coordinates
    * 
    * @param e object The event object
    */
    OfficeExcel.Bipolar.prototype.getBar = function (e)
    {
        var obj         = e.target.__object__;
        var canvas      = obj.canvas;
        var context     = obj.context;
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

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                return [left,top,width,height,i];
            }
        }

        return null;
    }