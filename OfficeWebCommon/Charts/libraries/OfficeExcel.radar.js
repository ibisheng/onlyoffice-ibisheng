    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The traditional radar chart constructor
    * 
    * @param string id   The ID of the canvas
    * @param array  data An array of data to represent
    */
    OfficeExcel.Radar = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.size              = null;// Set in the .Draw() method
        this.type              = 'radar';
        this.coords            = [];
        this.isOfficeExcel          = true;
        this.data              = [];
        this.max               = 0;
        this.original_data     = [];

        for (var i=1; i<arguments.length; ++i) {
            this.original_data.push(OfficeExcel.array_clone(arguments[i]));
            this.data.push(OfficeExcel.array_clone(arguments[i]));
            this.max = Math.max(this.max, OfficeExcel.array_max(arguments[i]));
        }

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
        
        // Must have at least 3 points
        for (var dataset=0; dataset<this.data.length; ++dataset) {
            if (this.data[dataset].length < 3) {
                alert('[RADAR] You must specify at least 3 data points');
                return;
            }
        }


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getPoint;
    }

    /**
    * The draw method which does all the brunt of the work
    */
    OfficeExcel.Radar.prototype.Draw = function (mainArr)
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
        * Reset the data to the original_data
        */
        this.data = OfficeExcel.array_clone(this.original_data);
        
        // Loop thru the data array if accumulative is enable checking to see if all the
        // datasets have the same number of elements.
        if (this._otherProps._accumulative) {
            for (var i=0; i<this.data.length; ++i) {
                if (this.data[i].length != this.data[0].length) {
                    alert('[RADAR] Error! When the radar has accumulative set to true all the datasets must have the same number of elements');
                }
            }
        }

        this.centerx  = ((this.canvas.width - this._chartGutter._left - this._chartGutter._right) / 2) + this._chartGutter._left;
        //this.centery  = ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top;
        this.centery  = this._chartGutter._top + this.radius;
        this.size     = Math.min(this.canvas.width - this._chartGutter._left - this._chartGutter._right, this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
        
        if (typeof(this._otherProps._radius) == 'number') {
            this.size = 2 * this._otherProps._radius;
        }

        // Work out the maximum value and the sum
        
        if( this._otherProps._ylabels_count == 'auto')
        {
            this.scale = mainArr;
            this.max = mainArr[mainArr.length - 1];
        }
        else if (!this._otherProps._ymax) {

            // this.max is calculated in the constructor

            // Work out this.max again if the chart is (now) set to be accumulative
            if (this._otherProps._accumulative) {
                
                var accumulation = [];
                var len = this.original_data[0].length

                for (var i=1; i<this.original_data.length; ++i) {
                    if (this.original_data[i].length != len) {
                        alert('[RADAR] Error! Stacked Radar chart datasets must all be the same size!');
                    }
                    
                    for (var j=0; j<this.original_data[i].length; ++j) {
                        this.data[i][j] += this.data[i - 1][j];
                        this.max = Math.max(this.max, this.data[i][j]);
                    }
                }
            }

            this.scale = OfficeExcel.getScale(this.max, this);
            this.max = this.scale[4];
        
        } else {
            var ymax = this._otherProps._ymax;

            this.scale = [
                          ymax * 0.2,
                          ymax * 0.4,
                          ymax * 0.6,
                          ymax * 0.8,
                          ymax * 1
                         ];
            this.max = this.scale[4];
        }
        
        
        //Draw Area
        this.DrawArea();
        
        this.DrawBackground();
        this.DrawAxes();
        this.DrawCircle();
        
 
        /**
        * Install the clickand mousemove event listeners
        */
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);
        
        this.DrawChart();
        this.DrawLabels();
        this.DrawAxisLabels();
        this.DrawHighlights();
        // Draw the title
        if (this._chartTitle._text) {
            OfficeExcel.DrawTitle(this.canvas, this._chartTitle._text, this._chartGutter._top, null, this._chartTitle._size ? this._chartTitle._size : null)
        }

        // Draw the key if necessary
        // obj, key, colors
        if (this._otherProps._key) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }

        /**
        * Show the context menu
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

    OfficeExcel.Radar.prototype.DrawArea = function ()
    {
        // Don't draw the axes?
        if (this._otherProps._noaxes)
            return;

        // Turn any shadow off
        OfficeExcel.NoShadow(this);

        this.context.lineWidth   = 1;
        this.context.lineCap = 'butt';
        this.context.strokeStyle = this._otherProps._axis_color;
        this.context.fillStyle = 'yellow';
        this.context.beginPath();
        this.context.fillStyle = "white";
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
        //this.context.strokeRect(10,10,this.canvas.width-150,this.canvas.height-150)
        this.context.stroke();
    }
    /**
    * Draws the background circles
    */
    OfficeExcel.Radar.prototype.DrawBackground = function ()
    {
       var color   = this._otherProps._background_circles_color;
        var poly    = this._otherProps._background_circles_poly;
        var spacing = this._otherProps._background_circles_spacing;

        /**
        * Draws the background circles
        */
        if (this._otherProps._background_circles && poly == false) {

           this.context.strokeStyle = color;
           this.context.beginPath();
               for (var r=5; r<this.radius; r+=spacing) {

                    this.context.moveTo(this.centerx, this.centery);
                    this.context.arc(this.centerx, this.centery,r, 0, TWOPI, false);
                }
            this.context.stroke();

    
            /**
            * Draw the diagonals/spokes
            */
            this.context.strokeStyle = color;

            for (var i=0; i<360; i+=15) {
                this.context.beginPath();
                this.context.arc(this.centerx, this.centery, this.radius, (i / 360) * TWOPI, ((i+0.01) / 360) * TWOPI, 0); // The 0.01 avoids a bug in Chrome 6
                this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }

        /**
        * The background"circles" are actually drawn as a poly based on how many points there are
        * (ie hexagons if there are 6 points, squares if the are four etc)
        */
        } else if (this._otherProps._background_circles && poly == true) {

            /**
            * Draw the diagonals/spokes
            */
            this.context.strokeStyle = color;
            var increment = 360 / this.data[0].length

            for (var i=0; i<360; i+=increment) {
                this.context.beginPath();
                    this.context.arc(this.centerx, this.centery, this.radius, ((i / 360) * TWOPI) - HALFPI, (((i + 0.0001) / 360) * TWOPI) - HALFPI, 0); // The 0.01 avoids a bug in Chrome 6
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
            }


            /**
            * Draw the lines that go around the Radar chart
            */
            this.context.strokeStyle = color;
                for (var r=0; r<=this.radius; r+=spacing) {
                    this.context.beginPath();
                        for (var a=0; a<=360; a+=(360 / this.data[0].length)) {
                            this.context.arc(this.centerx, this.centery,r, OfficeExcel.degrees2Radians(a) - HALFPI, OfficeExcel.degrees2Radians(a) + 0.00001 - HALFPI, 0);
                        }
                    this.context.closePath();
                    this.context.stroke();
                }
            /*for (var r=0; r <= bar._otherProps._background_grid_autofit_numhlines; r++) {
                this.context.beginPath();
                    for (var a=0; a<=360; a+=(360 / this.data[0].length)) {
                        this.context.arc(this.centerx, this.centery,r*spacing, OfficeExcel.degrees2Radians(a) - HALFPI, OfficeExcel.degrees2Radians(a) + 0.00001 - HALFPI, 0);
                    }
                this.context.closePath();
                this.context.stroke();
            }*/
        }
    }


    /**
    * Draws the axes
    */
    OfficeExcel.Radar.prototype.DrawAxes = function ()
    {
        this.context.strokeStyle = this._otherProps._axes_color;
        if(undefined == this._otherProps._axes_color)
            this.context.strokeStyle = 'black';

        var halfsize = this.size / 2;

        this.context.beginPath();

        /**
        * The Y axis
        */
        this.context.moveTo(AA(this, this.centerx), this.centery + halfsize);
        this.context.lineTo(AA(this, this.centerx), this.centery - halfsize);
        

        // Draw the bits at either end of the Y axis
        this.context.moveTo(this.centerx - 5, AA(this, this.centery + halfsize));
        this.context.lineTo(this.centerx + 5, AA(this, this.centery + halfsize));
        this.context.moveTo(this.centerx - 5, AA(this, this.centery - halfsize));
        this.context.lineTo(this.centerx + 5, AA(this, this.centery - halfsize));
        
        // Draw Y axis tick marks
        for (var y=(this.centery - halfsize); y<(this.centery + halfsize); y+=15) {
            this.context.moveTo(this.centerx - 3, AA(this, y));
            this.context.lineTo(this.centerx + 3, AA(this, y));
        }

        /**
        * The X axis
        */
        this.context.moveTo(this.centerx - halfsize, AA(this, this.centery));
        this.context.lineTo(this.centerx + halfsize, AA(this, this.centery));

        // Draw the bits at the end of the X axis
        this.context.moveTo(AA(this, this.centerx - halfsize), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx - halfsize), this.centery + 5);
        this.context.moveTo(AA(this, this.centerx + halfsize), this.centery - 5);
        this.context.lineTo(AA(this, this.centerx + halfsize), this.centery + 5);

        // Draw X axis tick marks
        for (var x=(this.centerx - halfsize); x<(this.centerx + halfsize); x+=15) {
            this.context.moveTo(AA(this, x), this.centery - 3);
            this.context.lineTo(AA(this, x), this.centery + 3);
        }

        /**
        * Finally draw it to the canvas
        */
        this.context.stroke();
    }


    /**
    * The function which actually draws the radar chart
    */
    OfficeExcel.Radar.prototype.DrawChart = function ()
    {
        var alpha = this._otherProps._colors_alpha;

        if (typeof(alpha) == 'number') {
            var oldAlpha = this.context.globalAlpha;
            this.context.globalAlpha = alpha;
        }
        
               var numDatasets = this.data.length;

        for (var dataset=0; dataset<this.data.length; ++dataset) {

            this.context.beginPath();

                var coords_dataset = [];
    
                for (var i=0; i<this.data[dataset].length; ++i) {
                    
                    var coords = this.GetCoordinates(dataset, i);

                    if (coords_dataset == null) {
                        coords_dataset = [];
                    }

                    coords_dataset.push(coords);
                    this.coords.push(coords);
                }

                /**
                * Now go through the coords and draw the chart itself
                *
                * 18/5/2012 - chart.strokestyle can now be an array of colors as well as a single color
                */

                this.context.strokeStyle = (typeof(this._otherProps._strokestyle) == 'object' && this._otherProps._strokestyle[dataset]) ? this._otherProps._strokestyle[dataset] : this._otherProps._strokestyle;
                this.context.fillStyle   = this._otherProps._colors[dataset];
                this.context.lineWidth   = this._otherProps._linewidth;

                for (i=0; i<coords_dataset.length; ++i) {
                    if (i == 0) {
                        this.context.moveTo(coords_dataset[i][0], coords_dataset[i][1]);
                    } else {
                        this.context.lineTo(coords_dataset[i][0], coords_dataset[i][1]);
                    }
                }
                

                // If on the second or greater dataset, backtrack
                if (this._otherProps._accumulative && dataset > 0) {

                    // This goes back to the start coords of this particular dataset
                    this.context.lineTo(coords_dataset[0][0], coords_dataset[0][1]);
                    
                    //Now move down to the end point of the previous dataset
                    this.context.moveTo(last_coords[0][0], last_coords[0][1]);

                    for (var i=coords_dataset.length - 1; i>=0; --i) {
                        this.context.lineTo(last_coords[i][0], last_coords[i][1]);
                    }
                }
            
            // This is used by the next iteration of the loop
            var last_coords = coords_dataset;

            this.context.closePath();
    
            this.context.stroke();
            this.context.fill();
        }
        
        // Reset the globalAlpha
        if (typeof(alpha) == 'number') {
            this.context.globalAlpha = oldAlpha;
        }

        /**
        * Can now handletooltips
        */
        if (this._tooltip._tooltips) {
            
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);
            
            var canvas_onmousemove_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var canvas      = e.target;
                var obj         = canvas.__object__;
                var overHotspot = false;
                var point = obj.getPoint(e);
    
    
                if (point) {
    
                    var dataset = point[3];
                    var idx     = point[4];
    
                    if (   !OfficeExcel.Registry.Get('chart.tooltip')
                        || (OfficeExcel.Registry.Get('chart.tooltip').__index__ != idx && OfficeExcel.Registry.Get('chart.tooltip').__dataset__ != dataset)
                        || (OfficeExcel.Registry.Get('chart.tooltip').__index__ != idx && OfficeExcel.Registry.Get('chart.tooltip').__dataset__ == dataset)
                       ) {
    
                        /**
                        * Get the tooltip text
                        */
                        var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, idx);
    
                        if (typeof(text) == 'string' && text.length) {
                   
                            overHotspot = true;
                            obj.canvas.style.cursor = 'pointer';
    
                            OfficeExcel.Clear(obj.canvas);
                            obj.Draw();
                            
                            if (obj._tooltip._highlight) {
                                obj.context.beginPath();
                                obj.context.strokeStyle = obj._otherProps._highlight_stroke;
                                obj.context.fillStyle   = obj._otherProps._highlight_fill;
                                obj.context.arc(point[1], point[2], 2, 0, 6.28, 0);
                                obj.context.fill();
                                obj.context.stroke();
                            }
                            
                            OfficeExcel.Tooltip(obj.canvas, text, e.pageX, e.pageY, idx);
                            
                            // Set the data set value on the tooltip
                            OfficeExcel.Registry.Get('chart.tooltip').__index__   = idx;
                            OfficeExcel.Registry.Get('chart.tooltip').__dataset__ = dataset;
    
    
                        }
                    //} else if (OfficeExcel.Registry.Get('chart.tooltip') && OfficeExcel.Registry.Get('chart.tooltip').__index__ == idx && OfficeExcel.Registry.Get('chart.tooltip').__dataset__ == dataset) {
                    } else {
                        overHotspot = true;
                        obj.canvas.style.cursor = 'pointer';
                    }
                }
    
                if (!overHotspot) {
                    obj.canvas.style.cursor = 'default';
                }
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);
        }
    }

    /**
    * Gets the coordinates for a particular mark
    * 
    * @param  number i The index of the data (ie which one it is)
    * @return array    A two element array of the coordinates
    */
    OfficeExcel.Radar.prototype.GetCoordinates = function (dataset, index)
    {
        // The number  of data points
        var len = this.data[dataset].length;

        // The magnitude of the data (NOT the x/y coords)
        var mag = (this.data[dataset][index] / this.max) * (this.size / 2);
        var min = 0;
        var max = 0;
        if(typeof(this.data[0]) == 'object')
        {
            var arrMin = [];
            var arrMax = [];
            for (var j=0; j < this.data.length; j++) {
                min = Math.min.apply(null, this.data[j]);
                max = Math.max.apply(null, this.data[j]);
                arrMin[j] = min;
                arrMax[j] = max;
            }
            min = Math.min.apply(null, arrMin);
            max = Math.max.apply(null, arrMax);
        }
        else
        {
            min = Math.min.apply(null, this.data);
            max = Math.max.apply(null, this.data);
        }
        if(this._otherProps._ylabels_count == 'auto' && min < 0)
        {
            var mag;
            if(min < 0 && max < 0)
                mag = ((this.data[dataset][index] + Math.abs(min)) / Math.abs(min)) * (this.size / 2);
            else
                mag = ((this.data[dataset][index] + Math.abs(min)) / Math.abs((parseFloat(max)) + Math.abs(min))) * (this.size / 2);
        }
        /**
        * Get the angle
        */
        var angle = ((2 * Math.PI) / len) * index; // In radians
        angle -= (Math.PI / 2)


        /**
        * Work out the X/Y coordinates
        */
        var x = Math.cos(angle) * mag;
        var y = Math.sin(angle) * mag;

        /**
        * Put the coordinate in the right quadrant
        */
        x = this.centerx + x;
        y = this.centery + y;
        
        return [x,y];
    }
    
    
    /**
    * This function adds the labels to the chart
    */
    OfficeExcel.Radar.prototype.DrawLabels = function ()
    {
        var labels = this._otherProps._labels;

        if (labels && labels.length > 0) {

            this.context.lineWidth = 1;
            this.context.fillStyle = this._otherProps._text_color;
            
            var offsetx = this._otherProps._labels_offsetx;
            var offsety = this._otherProps._labels_offsety;
            var font    = this._otherProps._text_font;
            var size    = this._otherProps._text_size;
            var radius  = this.size / 2;
                

            for (var i=0; i<labels.length; ++i) {
                
                var angle = ((2 * Math.PI) / this._otherProps._labels.length) * i;
                    angle -= (Math.PI / 2);

                var x = this.centerx + (Math.cos(angle) * (radius + offsetx));
                var y = this.centery + (Math.sin(angle) * (radius + offsety));

                if (labels[i] && labels[i].length) {
                    OfficeExcel.Text(this.context, font, size, x, y, labels[i], 'center', 'center', false, null, 'white');
                }
            }
        }
    }


    /**
    * Draws the circle. No arguments as it gets the information from the object properties.
    */
    OfficeExcel.Radar.prototype.DrawCircle = function ()
    {
        var circle   = {};
        circle.limit = this._otherProps._circle;
        circle.fill  = this._otherProps._circle_fill;
        circle.stroke  = this._otherProps._circle_stroke;

        if (circle.limit) {

            var r = (circle.limit / this.max) * (this.size / 2);
            
            this.context.fillStyle = circle.fill;
            this.context.strokeStyle = circle.stroke;

            this.context.beginPath();
            this.context.arc(this.centerx, this.centery, r, 0, 6.28, 0);
            this.context.fill();
            this.context.stroke();
        }
    }


    /**
    * Unsuprisingly, draws the labels
    */
    OfficeExcel.Radar.prototype.DrawAxisLabels = function ()
    {
        /**
        * Draw specific axis labels
        */
        if (this._otherProps._labels_specific) {
            this.DrawSpecificAxisLabels();
            return;
        }

        this.context.lineWidth = 1;
        
        // Set the color to black
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';

        var r          = (this.size/ 2);
        var font_face  = this._otherProps._text_font;
        var font_size  = this._otherProps._text_size;
        var context    = this.context;
        var axes       = this._otherProps._labels_axes.toLowerCase();
        var color      = 'rgba(255,255,255,0.8)';
        var drawzero   = false;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
        var decimals   = this._otherProps._scale_decimals;
        var spacing    = this._otherProps._background_circles_spacing;

        if('auto' == this._otherProps._ylabels_count)
        {
            for (var i=0; i < this.scale.length; ++i)
            {
                OfficeExcel.Text(context, font_face, font_size, this.centerx - 15, this.centery - (i * spacing),this.scale[i],'center','center',false,false,color);
            }
        }
        
        
        // The "North" axis labels
        if (axes.indexOf('n') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.2), OfficeExcel.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post),'center','center',true,false,color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.4), OfficeExcel.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.6), OfficeExcel.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - (r * 0.8), OfficeExcel.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery - r, OfficeExcel.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        // The "South" axis labels
        if (axes.indexOf('s') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.2), OfficeExcel.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.4), OfficeExcel.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.6), OfficeExcel.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + (r * 0.8), OfficeExcel.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx, this.centery + r, OfficeExcel.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }
        
        // The "East" axis labels
        if (axes.indexOf('e') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.2), this.centery, OfficeExcel.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.4), this.centery, OfficeExcel.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.6), this.centery, OfficeExcel.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + (r * 0.8), this.centery, OfficeExcel.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx + r, this.centery, OfficeExcel.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        // The "West" axis labels
        if (axes.indexOf('w') > -1) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.2), this.centery, OfficeExcel.number_format(this, this.scale[0].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.4), this.centery, OfficeExcel.number_format(this, this.scale[1].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.6), this.centery, OfficeExcel.number_format(this, this.scale[2].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - (r * 0.8), this.centery, OfficeExcel.number_format(this, this.scale[3].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - r, this.centery, OfficeExcel.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            OfficeExcel.Text(context, font_face, font_size, this.centerx - r, this.centery, OfficeExcel.number_format(this, this.scale[4].toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
            
            drawzero = true;
        }

        if (drawzero) {
            OfficeExcel.Text(context, font_face, font_size, this.centerx,  this.centery, OfficeExcel.number_format(this, (0).toFixed(decimals), units_pre, units_post), 'center', 'center', true, false, color);
        }
    }


    /**
    * Draws specific axis labels
    */
    OfficeExcel.Radar.prototype.DrawSpecificAxisLabels = function ()
    {
        /**
        * Specific Y labels
        */
        var labels  = this._otherProps._labels_specific;
        var context = this.context;
        var font    = this._otherProps._text_font;
        var size    = this._otherProps._text_size;
        var axes    = this._otherProps._labels_axes.toLowerCase();
        var interval = this.size / (labels.length * 2);

        for (var i=0; i<labels.length; ++i) {

            if (axes.indexOf('n') > -1) OfficeExcel.Text(context,font,size,this._chartGutter._left + (this.size / 2),this._chartGutter._top + (i * interval),labels[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('s') > -1) OfficeExcel.Text(context,font,size,this._chartGutter._left + (this.size / 2),this._chartGutter._top + (this.size / 2) + (i * interval) + interval,OfficeExcel.array_reverse(labels)[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('w') > -1) OfficeExcel.Text(context,font,size,this._chartGutter._left + (i * interval),this._chartGutter._top + (this.size / 2),labels[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
            if (axes.indexOf('e') > -1) OfficeExcel.Text(context,font,size,this._chartGutter._left + (i * interval) + interval + (this.size / 2),this._chartGutter._top + (this.size / 2),OfficeExcel.array_reverse(labels)[i],'center','center', true, false, 'rgba(255,255,255,0.8)');
        }
    }


    /**
    * This method eases getting the focussed point (if any)
    * 
    * @param event e The event object
    */
    OfficeExcel.Radar.prototype.getPoint = function (e)
    {
        var obj     = e.target.__object__;
        var canvas  = obj.canvas;
        var context = obj.context;

        for(var dataset=0; dataset<obj.coords.length; ++dataset) {
            for (var i=0; i<obj.coords[dataset].length; ++i) {
            
                var x           = obj.coords[dataset][i][0];
                var y           = obj.coords[dataset][i][1];
                var tooltips    = obj._tooltip._tooltips;
                var idx         = Number(i);
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];

                if (   mouseX < (x + 5)
                    && mouseX > (x - 5)
                    && mouseY > (y - 5)
                    && mouseY < (y + 5)
                   ) {

                    // This accounts for the datasets and increases the index accordingly
                    for(var j=0; j<dataset; j++) {
                        if (typeof(obj.data[j]) == 'object') {
                            i += obj.data[j].length;
                        }
                    }
                    
                    return [obj, x, y, dataset, i];
                }
            }
        }
    }
       /**
    * This draws highlights on the points
    */
    OfficeExcel.Radar.prototype.DrawHighlights = function ()
    {
        if (this._otherProps._highlights) {
            
            var sequentialIdx = 0;
            var dataset       = 0;
            var index         = 0;
            var radius        = this._otherProps._highlights_radius;
    
            for (var dataset=0; dataset <this.data.length; ++dataset) {
                for (var index=0; index<this.data[dataset].length; ++index) {
                    
                    this.context.beginPath();
                        this.context.strokeStyle = this._otherProps._highlights._stroke;
                        this.context.fillStyle = this._otherProps._highlights._fill ? this._otherProps._highlights._fill : ((typeof(this._otherProps._strokestyle) == 'object' && this._otherProps._strokestyle[dataset]) ? this._otherProps._strokestyle[dataset] : this._otherProps._strokestyle);
                        this.context.arc(this.coords[sequentialIdx][0], this.coords[sequentialIdx][1], radius, 0, TWOPI, false);
                    this.context.stroke();
                    this.context.fill();
    
                    ++sequentialIdx;
                }
            }
        }
    }