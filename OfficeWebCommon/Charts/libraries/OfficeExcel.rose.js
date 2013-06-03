    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};
    
    /**
    * The rose chart constuctor
    * 
    * @param object canvas
    * @param array data
    */
    OfficeExcel.Rose = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.data              = data;
        this.canvas.__object__ = this;
        this.type              = 'rose';
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
        this.getShape = this.getSegment;
    }
    
    /**
    * This method draws the rose chart
    */
    OfficeExcel.Rose.prototype.Draw = function ()
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
        this.radius       = (Math.min(this.canvas.width - this._chartGutter._left - this._chartGutter._right, this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2);
        this.centerx      = this.canvas.width / 2;
        this.centery      = this.canvas.height / 2;
        this.angles       = [];
        this.total        = 0;
        this.startRadians = 0;
        
        // User specified radius
        if (typeof(this._otherProps._radius) == 'number') {
            this.radius = this._otherProps._radius;
        }
        
        /**
        * Change the centerx marginally if the key is defined
        */
        if (this._otherProps._key && this._otherProps._key.length > 0 && this._otherProps._key.length >= 3) {
            this.centerx = this.centerx - this._chartGutter._right + 5;
        }

        this.DrawBackground();
        this.DrawRose();
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
        if (this._tooltip._tooltips) {

            /**
            * Register this object for redrawing
            */
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);
        
            /**
            * The onclick event
            */
            var canvas_onclick_func = function (e)
            {
                var obj     = e.target.__object__;
                var canvas  = e.target;
                var context = canvas.getContext('2d');

                e = OfficeExcel.FixEventObject(e);

                OfficeExcel.Redraw();
                
                var segment = obj.getSegment(e);

                if (segment && obj._tooltip._tooltips) {

                    /**
                    * Parse the tooltip text
                    */
                    var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, segment[6]);

                    if (text) {

                        context.beginPath();
                            context.strokeStyle = obj._otherProps._highlight_stroke;
                            context.fillStyle   = obj._otherProps._highlight_fill;
                            
                            // This highlights the chart
                            context.arc(segment[4], segment[5], segment[2],segment[0], segment[1],false);
                            context.arc(segment[4], segment[5], segment[3],segment[1], segment[0],true);
    
                        context.closePath();
    
                        context.fill();
                        context.stroke();
    
                        context.strokeStyle = 'rgba(0,0,0,0)';

                        // Taken out on 12th June 2011
                        //obj.DrawLabels();
                        
                        /**
                        * Show the tooltip
                        */
                        OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, segment[6]);
    
                        e.stopPropagation();
                    }

                    return;
                }
            }
            this.canvas.addEventListener('click', canvas_onclick_func, false);
            OfficeExcel.AddEventListener(this.id, 'click', canvas_onclick_func);


            /**
            * The onmousemove event
            */
            var canvas_onmousemove_func = function (e)
            {

                var obj     = e.target.__object__;
                var canvas  = e.target;
                var context = canvas.getContext('2d');

                e = OfficeExcel.FixEventObject(e);

                var segment = obj.getSegment(e);

                if (segment && obj._tooltip._tooltips) {

                    /**
                    * Get the tooltip text
                    */
                    if (typeof(obj._tooltip._tooltips) == 'function') {
                        var text = String(obj._tooltip._tooltips(segment[6]));
                    } else if (typeof(obj._tooltip._tooltips) == 'object' && typeof(obj._tooltip._tooltips[segment[6]]) == 'function') {
                        var text = String(obj._tooltip._tooltips[segment[6]](segment[6]));
                    } else if (typeof(obj._tooltip._tooltips) == 'object' && (typeof(obj._tooltip._tooltips[segment[6]]) == 'string' || typeof(obj._tooltip._tooltips[segment[6]]) == 'number')) {
                        var text = String(obj._tooltip._tooltips[segment[6]]);
                    } else {
                        var text = null;
                    }

                    if (text) {
                        canvas.style.cursor = 'pointer';
                
                        /*******************************************************
                        * This is here in case tooltips are using the
                        * onmousemove event
                        *******************************************************/
                        if (obj._tooltip._event == 'onmousemove') {
                            if (!OfficeExcel.Registry.Get('chart.tooltip') || OfficeExcel.Registry.Get('chart.tooltip').__index__ != segment[6]) {
                                canvas_onclick_func(e);
                            }
                        }

                    } else {
                        canvas.style.cursor = 'default';
                    }

                    return;
                }

                canvas.style.cursor = 'default';
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);
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
    * This method draws the rose charts background
    */
    OfficeExcel.Rose.prototype.DrawBackground = function ()
    {
        this.context.lineWidth = 1;
    
        // Draw the background grey circles
        this.context.beginPath();
        this.context.strokeStyle = '#ccc';
        for (var i=15; i<this.radius - (OfficeExcel.isOld() ? 5 : 0); i+=15) {// Radius must be greater than 0 for Opera to work
            
            //this.context.moveTo(this.centerx + i, this.centery);

            // Radius must be greater than 0 for Opera to work
            this.context.arc(this.centerx, this.centery, i, 0, (2 * Math.PI), 0);
        }
        this.context.stroke();

        // Draw the background lines that go from the center outwards
        this.context.beginPath();
        for (var i=15; i<360; i+=15) {
        
            // Radius must be greater than 0 for Opera to work
            this.context.arc(this.centerx, this.centery, this.radius, i / 57.3, (i + 0.1) / 57.3, 0); // The 0.1 avoids a bug in Chrome 6
        
            this.context.lineTo(this.centerx, this.centery);
        }
        this.context.stroke();
        
        this.context.beginPath();
        this.context.strokeStyle = 'black';
    
        // Draw the X axis
        this.context.moveTo(this.centerx - this.radius, AA(this, this.centery) );
        this.context.lineTo(this.centerx + this.radius, AA(this, this.centery) );
    
        // Draw the X ends
        this.context.moveTo(AA(this, this.centerx - this.radius), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx - this.radius), this.centery + 5);
        this.context.moveTo(AA(this, this.centerx + this.radius), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx + this.radius), this.centery + 5);
        
        // Draw the X check marks
        for (var i=(this.centerx - this.radius); i<(this.centerx + this.radius); i+=20) {
            this.context.moveTo(AA(this, i),  this.centery - 3);
            this.context.lineTo(AA(this, i),  this.centery + 3.5);
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
    * This method draws the data on the graph
    */
    OfficeExcel.Rose.prototype.DrawRose = function ()
    {
        var max  = 0;
        var data = this.data;
        var margin = OfficeExcel.degrees2Radians(this._otherProps._margin);

        // Must be at least two data points
        //if (data.length < 2) {
        //    alert('[ROSE] Must be at least two data points! [' + data + ']');
        //    return;
        //}
    
        // Work out the maximum value and the sum
        if (!this._otherProps._ymax) {
            // Work out the max
            for (var i=0; i<data.length; ++i) {
                if (typeof(data[i]) == 'number') {
                    max = Math.max(max, data[i]);
                } else if (typeof(data[i]) == 'object' && this._otherProps._variant == 'non-equi-angular') {
                    max = Math.max(max, data[i][0]);
                
                // Fallback is stacked
                } else {
                    max = Math.max(max, OfficeExcel.array_sum(data[i]));
                }
            }

            this.scale = OfficeExcel.getScale(max, this);
            this.max = this.scale[4];
        } else {
            var ymax = this._otherProps._ymax;
            var ymin = this._otherProps._ymin;

            this.scale = [
                          ((ymax - ymin) * 0.2) + ymin,
                          ((ymax - ymin) * 0.4) + ymin,
                          ((ymax - ymin) * 0.6) + ymin,
                          ((ymax - ymin) * 0.8) + ymin,
                          ((ymax - ymin) * 1.0) + ymin
                         ];
            this.max = this.scale[4];
        }
        
        this.sum = OfficeExcel.array_sum(data);
        
        // Move to the centre
        this.context.moveTo(this.centerx, this.centery);
    
        this.context.stroke(); // Stroke the background so it stays grey
    
        // Transparency
        if (this._otherProps._colors_alpha) {
            this.context.globalAlpha = this._otherProps._colors_alpha;
        }

        /*******************************************************
        * A non-equi-angular Rose chart
        *******************************************************/
        if (typeof(this._otherProps._variant) == 'string' && this._otherProps._variant == 'non-equi-angular') {
            /*******************************************************
            * NON-EQUI-ANGULAR GOES HERE
            *******************************************************/
            var total=0;
            for (var i=0; i<data.length; ++i) {
                total += data[i][1];
            }
            
            
            for (var i=0; i<this.data.length; ++i) {
            
                var segmentRadians = (this.data[i][1] / total) * (2 * Math.PI);
                var radius         = ((this.data[i][0] - this._otherProps._ymin) / (this.max - this._otherProps._ymin)) * (this.radius - 10);
                
                this.context.strokeStyle = this._otherProps._strokecolor;
                this.context.fillStyle = this._otherProps._colors[0];

                if (this._otherProps._colors_sequential) {
                    this.context.fillStyle = this._otherProps._colors[i];
                }

                this.context.beginPath(); // Begin the segment

                    var startAngle = this.startRadians - (Math.PI / 2) + margin;
                    var endAngle   = this.startRadians + segmentRadians - (Math.PI / 2) - margin;

                    var exploded  = this.getexploded(i, startAngle, endAngle, this._otherProps._exploded);
                    var explodedX = exploded[0];
                    var explodedY = exploded[1];


                    this.context.arc(this.centerx + explodedX,
                                     this.centery + explodedY,
                                     radius,
                                     startAngle,
                                     endAngle,
                                     0);
                    this.context.lineTo(this.centerx + explodedX, this.centery + explodedY);
                this.context.closePath(); // End the segment
                
                this.context.stroke();
                this.context.fill();
                
                // Store the start and end angles

                this.angles.push(gg = [
                                  startAngle,
                                  endAngle,
                                  0,
                                  radius,
                                  this.centerx + explodedX,
                                  this.centery + explodedY
                                 ]);

                this.startRadians += segmentRadians;
            }
        } else {
            /*******************************************************
            * Draw regular segments here
            *******************************************************/
            for (var i=0; i<this.data.length; ++i) {

                this.context.strokeStyle = this._otherProps._strokecolor;
                this.context.fillStyle = this._otherProps._colors[0];

                /*******************************************************
                * This allows sequential colors
                *******************************************************/
                if (this._otherProps._colors_sequential) {
                    this.context.fillStyle = this._otherProps._colors[i];
                }

                var segmentRadians = (1 / this.data.length) * (2 * Math.PI);
    
                if (typeof(this.data[i]) == 'number') {
                    this.context.beginPath(); // Begin the segment

                        var radius = ((this.data[i] - this._otherProps._ymin) / (this.max - this._otherProps._ymin)) * (this.radius - 10);

                        var startAngle = (this.startRadians * this._otherProps._animation_grow_factor) - (Math.PI / 2) + margin;
                        var endAngle   = (this.startRadians * this._otherProps._animation_grow_factor) + (segmentRadians) - (Math.PI / 2) - margin;

                        var exploded  = this.getexploded(i, startAngle, endAngle, this._otherProps._exploded);
                        var explodedX = exploded[0];
                        var explodedY = exploded[1];

                        this.context.arc(this.centerx + explodedX,
                                         this.centery + explodedY,
                                         radius * this._otherProps._animation_grow_factor,
                                         startAngle,
                                         endAngle,
                                         0);
                        this.context.lineTo(this.centerx + explodedX, this.centery + explodedY);
                    this.context.closePath(); // End the segment
                    this.context.stroke();
                    this.context.fill();

                    if (endAngle == 0) {
                        endAngle = 6.2830;
                    }

                    // Store the start and end angles
                    this.angles.push([
                                      startAngle,
                                      endAngle,
                                      0,
                                      radius * this._otherProps._animation_grow_factor,
                                      this.centerx + explodedX,
                                      this.centery + explodedY
                                     ]);

                /*******************************************************
                * Draw a stacked segment
                *******************************************************/
                } else if (typeof(this.data[i]) == 'object') {
                    
                    var margin = this._otherProps._margin / (180 / Math.PI);
                    

                    for (var j=0; j<this.data[i].length; ++j) {
                    
                        var startAngle = (this.startRadians * this._otherProps._animation_grow_factor) - (Math.PI / 2) + margin;
                        var endAngle  = (this.startRadians * this._otherProps._animation_grow_factor)+ segmentRadians - (Math.PI / 2) - margin;
                    
                        var exploded  = this.getexploded(i, startAngle, endAngle, this._otherProps._exploded);
                        var explodedX = exploded[0];
                        var explodedY = exploded[1];
    
                        this.context.fillStyle = this._otherProps._colors[j];
                        if (j == 0) {
                            this.context.beginPath(); // Begin the segment
                                var startRadius = 0;
                                var endRadius = ((this.data[i][j] - this._otherProps._ymin) / (this.max - this._otherProps._ymin)) * (this.radius - 10);
                    
                                this.context.arc(this.centerx + explodedX,
                                                 this.centery + explodedY,
                                                 endRadius * this._otherProps._animation_grow_factor,
                                                 startAngle,
                                                 endAngle,
                                                 0);
                                this.context.lineTo(this.centerx + explodedX, this.centery + explodedY);
                            this.context.closePath(); // End the segment
                            this.context.stroke();
                            this.context.fill();
    
                            this.angles.push([
                                              startAngle,
                                              endAngle,
                                              0,
                                              endRadius * this._otherProps._animation_grow_factor,
                                              this.centerx + explodedX,
                                              this.centery + explodedY
                                             ]);
                        
                        } else {

                            this.context.beginPath(); // Begin the segment
                                
                                var startRadius = endRadius; // This comes from the prior iteration of this loop
                                var endRadius = (((this.data[i][j] - this._otherProps._ymin) / (this.max - this._otherProps._ymin)) * (this.radius - 10)) + startRadius;
                
                                this.context.arc(this.centerx + explodedX,
                                                 this.centery + explodedY,
                                                 startRadius  * this._otherProps._animation_grow_factor,
                                                 startAngle,
                                                 endAngle,
                                                 0);
                
                                this.context.arc(this.centerx + explodedX,
                                                 this.centery + explodedY,
                                                 endRadius  * this._otherProps._animation_grow_factor,
                                                 endAngle,
                                                 startAngle,
                                                 true);
                
                            this.context.closePath(); // End the segment
                            this.context.stroke();
                            this.context.fill();
    
                            this.angles.push([
                                              startAngle,
                                              endAngle,
                                              startRadius * this._otherProps._animation_grow_factor,
                                              endRadius * this._otherProps._animation_grow_factor,
                                              this.centerx + explodedX,
                                              this.centery + explodedY
                                             ]);
                        }
                    }
                }
    
                this.startRadians += segmentRadians;
            }
        }

        // Turn off the transparency
        if (this._otherProps._colors_alpha) {
            this.context.globalAlpha = 1;
        }

        // Draw the title if any has been set
        if (this._chartTitle._text) {
            OfficeExcel.DrawTitle(this.canvas,
                this._chartTitle._text,
                (this.canvas.height / 2) - this.radius,
                this.centerx,
                this._chartTitle._size ? this._chartTitle._size : this._otherProps._text_size + 2);
        }
    }


    /**
    * Unsuprisingly, draws the labels
    */
    OfficeExcel.Rose.prototype.DrawLabels = function ()
    {
        this.context.lineWidth = 1;
        var key = this._otherProps._key;

        if (key && key.length) {
            OfficeExcel.DrawKey(this, key, this._otherProps._colors);
        }
        
        // Set the color to black
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        
        var r          = this.radius - 10;
        var font_face  = this._otherProps._text_font;
        var font_size  = this._otherProps._text_size;
        var context    = this.context;
        var axes       = this._otherProps._labels_axes.toLowerCase();
        var decimals   = this._otherProps._scale_decimals;
        var units_pre = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;

        // Draw any circular labels
        if (typeof(this._otherProps._labels) == 'object' && this._otherProps._labels) {
            this.DrawCircularLabels(context, this._otherProps._labels, font_face, font_size, r + 10);
        }


        var color = 'rgba(255,255,255,0.8)';

        // The "North" axis labels
        if (axes.indexOf('n') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.2), OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.4), OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.6), OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.8), OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - r, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }

        // The "South" axis labels
        if (axes.indexOf('s') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.2), OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.4), OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.6), OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.8), OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + r, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }
        
        // The "East" axis labels
        if (axes.indexOf('e') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.2), this.centery, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.4), this.centery, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.6), this.centery, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.8), this.centery, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + r, this.centery, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }

        // The "West" axis labels
        if (axes.indexOf('w') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.2), this.centery, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.4), this.centery, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.6), this.centery, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.8), this.centery, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - r, this.centery, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }

        OfficeExcel.Text(context, font_face, font_size, this.centerx,  this.centery, typeof(this._otherProps._ymin) == 'number' ? OfficeExcel.number_format(this, Number(this._otherProps._ymin).toFixed(this._otherProps._scale_decimals), units_pre, units_post) : '0', 'center', 'center', true, false, color);
    }


    /**
    * Draws the circular labels that go around the charts
    * 
    * @param labels array The labels that go around the chart
    */
    OfficeExcel.Rose.prototype.DrawCircularLabels = function (context, labels, font_face, font_size, r)
    {
        var variant = this._otherProps._variant;
        var position = this._otherProps._labels_position;
        var r        = r + 10 + this._otherProps._labels_offset;

        for (var i=0; i<labels.length; ++i) {
            
            if (typeof(variant) == 'string' && variant == 'non-equi-angular') {

                var a = Number(this.angles[i][0]) + ((this.angles[i][1] - this.angles[i][0]) / 2);
                var halign = 'center'; // Default halign

                var x = Math.cos(a) * (r + 10);
                var y = Math.sin(a) * (r + 10);
                
                OfficeExcel.Text(context, font_face, font_size, this.centerx + x, this.centery + y, String(labels[i]), 'center', halign);
                
            } else {

                var a = ((2 * Math.PI) / labels.length) * (i + 1) - ((2 * Math.PI) / (labels.length * 2));
                var a = a - (Math.PI/ 2) + (this._otherProps._labels_position == 'edge' ? (((2 * Math.PI) / labels.length) / 2) : 0);
                var halign = 'center'; // Default halign
    
                // Horizontal alignment
                //if (a == 0) {
                //    var halign = 'left';
                //} else if (a == 180) {
                //    var halign = 'right';
                //}
    
                var x = Math.cos(a) * (r + 10);
                var y = Math.sin(a) * (r + 10);
    
                OfficeExcel.Text(context, font_face, font_size, this.centerx + x, this.centery + y, String(labels[i]), 'center', halign);
            }
        }
    }


























    /**
    * This function is for use with circular graph types, eg the Pie or Rose. Pass it your event object
    * and it will pass you back the corresponding segment details as an array:
    * 
    * [x, y, r, startAngle, endAngle]
    * 
    * Angles are measured in degrees, and are measured from the "east" axis (just like the canvas).
    * 
    * @param object e   Your event object
    */
    OfficeExcel.Rose.prototype.getSegment = function (e)
    {
        OfficeExcel.FixEventObject(e);

        var obj         = e.target.__object__;
        var canvas      = obj.canvas;
        var context     = obj.context;
        var angles      = obj.angles;
        var ret         = [];

        /**
        * Go through all of the angles checking each one
        */
        for (var i=0; i<angles.length ; ++i) {

            var angleStart  = angles[i][0];
            var angleEnd    = angles[i][1];
            var radiusStart = angles[i][2];
            var radiusEnd   = angles[i][3];
            var centerX     = angles[i][4];
            var centerY     = angles[i][5];
            var mouseCoords = OfficeExcel.getMouseXY(e);
            var mouseX      = mouseCoords[0] - centerX;
            var mouseY      = mouseCoords[1] - centerY;
            var angle       = Math.atan(mouseY / mouseX);


            /**
            * Adjust the angle
            */
            if (mouseX < 0 && mouseY < 0) {
                angle += Math.PI;
            } else if (mouseX > 0 && mouseY < 0) {
                // ...
            } else if (mouseX < 0 && mouseY > 0) {
                angle += Math.PI;
            }

            if (   (angle >= angleStart && angle <= angleEnd) ) {

                /**
                * Work out the radius
                */
                var radius = mouseY / Math.sin(angle)

                if (radius >= radiusStart && radius <= radiusEnd) {
                    angles[i][6] = i;
                    return angles[i];
                }
            
            }
        }

        return null;
    }
























    /**
    * Returns any exploded for a particular segment
    */
    OfficeExcel.Rose.prototype.getexploded = function (index, startAngle, endAngle, exploded)
    {
        var explodedx, explodedy;

        /**
        * Retrieve any exploded - the exploded can be an array of numbers or a single number
        * (which is applied to all segments)
        */
        if (typeof(exploded) == 'object' && typeof(exploded[index]) == 'number') {
            explodedx = Math.cos(((endAngle - startAngle) / 2) + startAngle) * exploded[index];
            explodedy = Math.sin(((endAngle - startAngle) / 2) + startAngle) * exploded[index];
        
        } else if (typeof(exploded) == 'number') {
            explodedx = Math.cos(((endAngle - startAngle) / 2) + startAngle) * exploded;
            explodedy = Math.sin(((endAngle - startAngle) / 2) + startAngle) * exploded;

        } else {
            explodedx = 0;
            explodedy = 0;
        }
        
        return [explodedx, explodedy];
    }