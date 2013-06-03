    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};
    
    /**
    * The chart constuctor
    * 
    * @param object canvas
    * @param array data
    */
    OfficeExcel.Rscatter = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.data              = data;
        this.canvas.__object__ = this;
        this.type              = 'rscatter';
        this.hasTooltips       = false;
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

        this.centerx = 0;
        this.centery = 0;
        this.radius  = 0;
        this.max     = 0;

        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getPoint;
    }
    
    /**
    * This method draws the rose chart
    */
    OfficeExcel.Rscatter.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        OfficeExcel.ClearEventListeners(this.id);

        // Calculate the radius
        this.radius  = (Math.min(OfficeExcel.GetWidth(this) - this._chartGutter._left - this._chartGutter._right, OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) / 2);
        this.centerx = OfficeExcel.GetWidth(this) / 2;
        this.centery = OfficeExcel.GetHeight(this) / 2;
        this.coords  = [];
        
        /**
        * If there's a user specified radius, use that
        */
        if (typeof(this._otherProps._radius) == 'number') {
            this.radius = this._otherProps._radius;
        }
        
        /**
        * Work out the scale
        */
        var max = this._otherProps._ymax;
        var min = this._otherProps._ymin;
        
        if (typeof(max) == 'number') {
            this.max   = max;
            this.scale = [((max - min) * 0.2) + min,((max - min) * 0.4) + min,((max - min) * 0.6) + min,((max - min) * 0.8) + min,((max - min) * 1.0) + min];
            
        } else {
            for (var i=0; i<this.data.length; ++i) {
                this.max = Math.max(this.max, this.data[i][1]);
            }
            this.scale = OfficeExcel.getScale(this.max, this);
            this.max   = this.scale[4];

            // Hmmmmmmmm
            if (String(this.scale[0]).indexOf('e') == -1) {

                var decimals = this._otherProps._scale_decimals;

                this.scale[0] = Number(this.scale[0]).toFixed(decimals);
                this.scale[1] = Number(this.scale[1]).toFixed(decimals);
                this.scale[2] = Number(this.scale[2]).toFixed(decimals);
                this.scale[3] = Number(this.scale[3]).toFixed(decimals);
                this.scale[4] = Number(this.scale[4]).toFixed(decimals);
            }
        }

        /**
        * Change the centerx marginally if the key is defined
        */
        if (this._otherProps._key && this._otherProps._key.length > 0 && this._otherProps._key.length >= 3) {
            this.centerx = this.centerx - this._chartGutter._right + 5;
        }
        
        /**
        * Populate the colors array for the purposes of generating the key
        */
        if (typeof(this._otherProps._key) == 'object' && OfficeExcel.is_array(this._otherProps._key) && this._otherProps._key[0]) {
            for (var i=0; i<this.data.length; ++i) {
                if (this.data[i][2] && typeof(this.data[i][2]) == 'string') {
                    this._otherProps._colors.push(this.data[i][2]);
                }
            }
        }
        
        // This resets the chart drawing state
        this.context.beginPath();

        this.DrawBackground();
        this.DrawRscatter();
        this.DrawLabels();

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
        * Tooltips
        */
        if (this.hasTooltips) {

            /**
            * Register this object for redrawing
            */
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);
            
            /**
            * The onmousemove event
            */
            var canvas_onmousemove_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var obj         = e.target.__object__;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var overHotspot = false;
                var offset      = obj._tooltip._hotspot;
                var point       = obj.getPoint(e);

                if (point) {

                    overHotspot = true;
                    var text = OfficeExcel.parseTooltipText(obj.data[point[3]], 3);

                    if (text) {
                        canvas.style.cursor = 'pointer';
                    }

                    if (!OfficeExcel.Registry.Get('chart.tooltip') || OfficeExcel.Registry.Get('chart.tooltip').__text__ != text) {

                        if (obj._tooltip._highlight) {
                            OfficeExcel.Redraw();
                        }

                        if (text) {

                            OfficeExcel.Tooltip(canvas, text, e.pageX + 5, e.pageY - 5, point[3]);

                            /**
                            * Highlight the tickmark
                            */
                            if (obj._tooltip._highlight) {
                                context.beginPath();
                                    context.strokeStyle = 'red';
                                    context.fillStyle = 'rgba(255,255,255,0.5)';

                                    context.moveTo(point[1], point[2]);
                                    context.arc(point[1], point[2], 3, 0, 6.2830, 0);

                                context.closePath();
                                context.fill();
                                
                                context.moveTo(obj.centerx, obj.centery);
                            }
                        }
                    }
                }
                
                if (!overHotspot) {
                    canvas.style.cursor = 'default';
                }
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);
        }

        // Draw the title if any has been set
        if (this._chartTitle._text) {
            OfficeExcel.DrawTitle(this.canvas,
                this._chartTitle._text,
                (this.canvas.height / 2) - this.radius - 5,
                this.centerx,
                this._chartTitle._size ? this._chartTitle._size : this._otherProps._text_size + 2);
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
    * This method draws the rose charts background
    */
    OfficeExcel.Rscatter.prototype.DrawBackground = function ()
    {
        this.context.lineWidth = 1;
    
        // Draw the background grey circles
        this.context.strokeStyle = '#ccc';
        for (var i=15; i<this.radius - (document.all ? 5 : 0); i+=15) {// Radius must be greater than 0 for Opera to work
            //this.context.moveTo(this.centerx + i, this.centery);
    
            // Radius must be greater than 0 for Opera to work
            this.context.arc(this.centerx, this.centery, i, 0, (2 * Math.PI), 0);
        }
        this.context.stroke();

        // Draw the background lines that go from the center outwards
        this.context.beginPath();
        for (var i=15; i<360; i+=15) {
        
            // Radius must be greater than 0 for Opera to work
            this.context.arc(this.centerx, this.centery, this.radius, i / 57.3, (i + 0.01) / 57.3, 0);
        
            this.context.lineTo(this.centerx, this.centery);
        }
        this.context.stroke();
        
        this.context.beginPath();
        this.context.strokeStyle = 'black';
    
        // Draw the X axis
        this.context.moveTo(this.centerx - this.radius, AA(this, this.centery));
        this.context.lineTo(this.centerx + this.radius, AA(this, this.centery));
    
        // Draw the X ends
        this.context.moveTo(AA(this, this.centerx - this.radius), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx - this.radius), this.centery + 5);
        this.context.moveTo(AA(this, this.centerx + this.radius), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx + this.radius), this.centery + 5);
        
        // Draw the X check marks
        for (var i=(this.centerx - this.radius); i<(this.centerx + this.radius); i+=20) {
            this.context.moveTo(AA(this, i),  this.centery - 3);
            this.context.lineTo(AA(this, i),  this.centery + 3);
        }
        
        // Draw the Y check marks
        for (var i=(this.centery - this.radius); i<(this.centery + this.radius); i+=20) {
            this.context.moveTo(this.centerx - 3, AA(this, i));
            this.context.lineTo(this.centerx + 3, AA(this, i));
        }
    
        // Draw the Y axis
        this.context.moveTo(AA(this, this.centerx), this.centery - this.radius);
        this.context.lineTo(AA(this, this.centerx), this.centery + this.radius);
    
        // Draw the Y ends
        this.context.moveTo(this.centerx - 5, AA(this, this.centery - this.radius));
        this.context.lineTo(this.centerx + 5, AA(this, this.centery - this.radius));
    
        this.context.moveTo(this.centerx - 5, AA(this, this.centery + this.radius));
        this.context.lineTo(this.centerx + 5, AA(this, this.centery + this.radius));
        
        // Stroke it
        this.context.closePath();
        this.context.stroke();
    }


    /**
    * This method draws a set of data on the graph
    */
    OfficeExcel.Rscatter.prototype.DrawRscatter = function ()
    {
        var data = this.data;

        for (var i=0; i<data.length; ++i) {

            var d1 = data[i][0];
            var d2 = data[i][1];
            var a   = d1 / (180 / Math.PI); // RADIANS
            var r   = ( (d2 - this._otherProps._ymin) / (this.max - this._otherProps._ymin) ) * this.radius;
            var x   = Math.sin(a) * r;
            var y   = Math.cos(a) * r;
            var color = data[i][2] ? data[i][2] : this._otherProps._colors_default;
            var tooltip = data[i][3] ? data[i][3] : null;

            if (tooltip && String(tooltip).length) {
                this.hasTooltips = true;
            }

            /**
            * Account for the correct quadrant
            */
            x = x + this.centerx;
            y = this.centery - y;


            this.DrawTick(x, y, color);
            
            // Populate the coords array with the coordinates and the tooltip
            this.coords.push([x, y, color, tooltip]);
        }
    }


    /**
    * Unsuprisingly, draws the labels
    */
    OfficeExcel.Rscatter.prototype.DrawLabels = function ()
    {
        this.context.lineWidth = 1;
        var key = this._otherProps._key;
        
        // Set the color to black
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        
        var r          = this.radius;
        var color      = this._otherProps._text_color;
        var font_face  = this._otherProps._text_font;
        var font_size  = this._otherProps._text_size;
        var context    = this.context;
        var axes       = this._otherProps._labels_axes.toLowerCase();
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
        var decimals   = this._otherProps._scale_decimals;
        
        this.context.fillStyle = this._otherProps._text_color;

        // Draw any labels
        if (typeof(this._otherProps._labels) == 'object' && this._otherProps._labels) {
            this.DrawCircularLabels(context, this._otherProps._labels, font_face, font_size, r);
        }


        var color = 'rgba(255,255,255,0.8)';

        // The "North" axis labels
        if (axes.indexOf('n') > -1) {
            OfficeExcel.Text(context,font_face,font_size,this.centerx,this.centery - ((r) * 0.2),OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post),'center','center',true,false,color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.4), OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.6), OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - ((r) * 0.8), OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - r, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }

        // The "South" axis labels
        if (axes.indexOf('s') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.2), OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.4), OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.6), OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + ((r) * 0.8), OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + r, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }
        
        // The "East" axis labels
        if (axes.indexOf('e') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx + ((r) * 0.2), this.centery, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + ((r) * 0.4), this.centery, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + ((r) * 0.6), this.centery, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + ((r) * 0.8), this.centery, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + r, this.centery, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }

        // The "West" axis labels
        if (axes.indexOf('w') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx - ((r) * 0.2), this.centery, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - ((r) * 0.4), this.centery, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - ((r) * 0.6), this.centery, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - ((r) * 0.8), this.centery, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - r, this.centery, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }
        
        // Draw the center minimum value (but only if there's at least one axes labels stipulated)
        if (this._otherProps._labels_axes.length > 0) {
            OfficeExcel.Text(context,
                        font_face,
                        font_size,
                        this.centerx,
                        this.centery,
                        OfficeExcel.number_format(this, Number(this._otherProps._ymin).toFixed(this._otherProps._scale_decimals), units_pre, units_post),
                        'center',
                        'center',
                        true,
                        false,
                        color);
        }

        /**
        * Draw the key
        */
        if (key && key.length) {
            OfficeExcel.DrawKey(this, key, this._otherProps._colors);
        }
    }


    /**
    * Draws the circular labels that go around the charts
    * 
    * @param labels array The labels that go around the chart
    */
    OfficeExcel.Rscatter.prototype.DrawCircularLabels = function (context, labels, font_face, font_size, r)
    {
        var position = this._otherProps._labels_position;
        var r        = r + 10;

        for (var i=0; i<labels.length; ++i) {


            var a = (360 / labels.length) * (i + 1) - (360 / (labels.length * 2));
            var a = a - 90 + (this._otherProps._labels_position == 'edge' ? ((360 / labels.length) / 2) : 0);

            var x = Math.cos(a / 57.29577866666) * (r + 10);
            var y = Math.sin(a / 57.29577866666) * (r + 10);

            OfficeExcel.Text(context, font_face, font_size, this.centerx + x, this.centery + y, String(labels[i]), 'center', 'center');
        }
    }


    /**
    * Draws a single tickmark
    */
    OfficeExcel.Rscatter.prototype.DrawTick = function (x, y, color)
    {
        var tickmarks    = this._otherProps._tickmarks;
        var ticksize     = this._otherProps._ticksize;

        this.context.strokeStyle = color;
        this.context.fillStyle   = color;

        // Cross
        if (tickmarks == 'cross') {

            this.context.beginPath();
            this.context.moveTo(x + ticksize, y + ticksize);
            this.context.lineTo(x - ticksize, y - ticksize);
            this.context.stroke();
    
            this.context.beginPath();
            this.context.moveTo(x - ticksize, y + ticksize);
            this.context.lineTo(x + ticksize, y - ticksize);
            this.context.stroke();
        
        // Circle
        } else if (tickmarks == 'circle') {

            this.context.beginPath();
            this.context.arc(x, y, ticksize, 0, 6.2830, false);
            this.context.fill();

        // Square
        } else if (tickmarks == 'square') {

            this.context.beginPath();
            this.context.fillRect(x - ticksize, y - ticksize, 2 * ticksize, 2 * ticksize);
            this.context.fill();
        
        // Diamond shape tickmarks
         } else if (tickmarks == 'diamond') {

            this.context.beginPath();
                this.context.moveTo(x, y - ticksize);
                this.context.lineTo(x + ticksize, y);
                this.context.lineTo(x, y + ticksize);
                this.context.lineTo(x - ticksize, y);
            this.context.closePath();
            this.context.fill();

        // Plus style tickmarks
        } else if (tickmarks == 'plus') {
        
            this.context.lineWidth = 1;

            this.context.beginPath();
                this.context.moveTo(x, y - ticksize);
                this.context.lineTo(x, y + ticksize);
                this.context.moveTo(x - ticksize, y);
                this.context.lineTo(x + ticksize, y);
            this.context.stroke();
        }
    }


    /**
    * This function makes it much easier to get the (if any) point that is currently being hovered over.
    * 
    * @param object e The event object
    */
    OfficeExcel.Rscatter.prototype.getPoint = function (e)
    {
        var canvas      = e.target;
        var obj         = canvas.__object__;
        var context     = obj.context;
        var context     = obj.context;
        var mouseCoords = OfficeExcel.getMouseXY(e);
        var mouseX      = mouseCoords[0];
        var mouseY      = mouseCoords[1];
        var overHotspot = false;
        var offset = obj._tooltip._hotspot; // This is how far the hotspot extends

                for (var i=0; i<obj.coords.length; ++i) {
                
                    var x       = obj.coords[i][0];
                    var y       = obj.coords[i][1];
                    var tooltip = obj.coords[i][3];

                    if (
                        mouseX < (x + offset) &&
                        mouseX > (x - offset) &&
                        mouseY < (y + offset) &&
                        mouseY > (y - offset)
                       ) {
                        
                        return [obj, x, y, i];
                    }
                }
    }