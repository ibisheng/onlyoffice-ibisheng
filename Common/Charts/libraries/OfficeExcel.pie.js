    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The pie chart constructor
    * 
    * @param data array The data to be represented on the pie chart
    */
    OfficeExcel.Pie = function (chartCanvas, data)
    {
        this.id                = null;
        this.canvas            = chartCanvas ? chartCanvas : document.getElementById(id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.total             = 0;
        this.subTotal          = 0;
        this.angles            = [];
        this.data              = data;
        this.type              = 'pie';
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
        * Calculate the total
        */
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
        }


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getSegment;
    }

    /**
    * This draws the pie chart
    */
    OfficeExcel.Pie.prototype.Draw = function (min,max,ymin,ymax,isSkip,isFormatCell)
    {
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        //OfficeExcel.ClearEventListeners(this.id);


        this.radius           = this._otherProps._radius ? this._otherProps._radius : this.getRadius();
        // this.centerx now defined below
        this.centery          = ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top;
        this.subTotal         = 0;
        this.angles           = [];

        /**
        * Allow the specification of a custom centery
        */
        if (typeof(this._otherProps._centery) == 'number') {
            this.centery = this._otherProps._centery;
        }
        
        /**
        * Alignment (Pie is center aligned by default) Only if centerx is not defined - donut defines the centerx
        */
        if (this._otherProps._align == 'left') {
            this.centerx = this.radius + this._chartGutter._left;
        
        } else if (this._otherProps._align == 'right') {
            this.centerx = this.canvas.width - this.radius - this._chartGutter._right;
        
        } else {
            this.centerx = this.canvas.width / 2;
        }
        
        /**
        * Allow the specification of a custom centerx
        */
        if (typeof(this._otherProps._centerx) == 'number') {
            this.centerx = this._otherProps._centerx;
        }
        
        //Draw Area
        this.DrawArea();
        /**
        * Draw the title
        */

        OfficeExcel.DrawTitle(this.canvas,
            this._chartTitle._text,
            (this.canvas.height / 2) - this.radius - 5,
            this.centerx,
            this._chartTitle._size ? this._chartTitle._size : this._otherProps._text_size + 2);

        /**
        * Draw the shadow if required
        */
        if (this._shadow._visible && 0) {
        
            var offsetx = document.all ? this._shadow._offset_x : 0;
            var offsety = document.all ? this._shadow._offset_y : 0;

            this.context.beginPath();
            this.context.fillStyle = this._shadow._color;

            this.context.shadowColor   = this._shadow._color;
            this.context.shadowBlur    = this._shadow._blur;
            this.context.shadowOffsetX = this._shadow._offset_x;
            this.context.shadowOffsetY = this._shadow._offset_y;
            
            this.context.arc(this.centerx + offsetx, this.centery + offsety, this.radius, 0, 6.28, 0);
            
            this.context.fill();
            
            // Now turn off the shadow
            OfficeExcel.NoShadow(this);
        }

        /**
        * The total of the array of values
        */
        this.total = OfficeExcel.array_sum(this.data);

        for (var i=0,len=this.data.length; i<len; i++) {
            
            var angle = ((this.data[i] / this.total) * (Math.PI * 2));

            // Draw the segment
            this.DrawSegment(angle,this._otherProps._colors[i],i == (this.data.length - 1), i);
        }

        OfficeExcel.NoShadow(this);


        /**
        * Redraw the seperating lines
        */
        this.DrawBorders();

        /**
        * Now draw the segments again with shadow turned off. This is always performed,
        * not just if the shadow is on.
        */
		//TODO граница между секторами круговой диаграммы - в следующей версии нужно зачитывать из xml
        /*for (var i=0; i<this.angles.length; i++) {
    
            this.context.beginPath();
                this.context.strokeStyle = this._otherProps._strokecolor;
                this.context.fillStyle = this._otherProps._colors[i];
                this.context.arc(this.angles[i][2],
                                 this.angles[i][3],
                                 this.radius,
                                 (this.angles[i][0]),
                                 (this.angles[i][1]),
                                 false);
                if (this._otherProps._variant == 'donut') {

                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this.radius / 2,
                                     (this.angles[i][1]),
                                     (this.angles[i][0]),
                                     true);
                    
                } else {
                    this.context.lineTo(this.angles[i][2], this.angles[i][3]);
                }
            this.context.closePath();
            this.context.fill();
            this.context.stroke();
        }*/


        /**
        * Draw label sticks
        */
        if (this._otherProps._labels_sticks) {
            
            this.DrawSticks();
            
            // Redraw the border going around the Pie chart if the stroke style is NOT white
            var strokeStyle = this._otherProps._strokecolor;
            var isWhite     = strokeStyle == 'white' || strokeStyle == '#fff' || strokeStyle == '#fffffff' || strokeStyle == 'rgb(255,255,255)' || strokeStyle == 'rgba(255,255,255,0)';

            if (!isWhite || (isWhite && this._shadow._visible)) {
               // Again (?)
              this.DrawBorders();
           }
        }

        /**
        * Draw the labels
        */
        this.DrawLabels(isFormatCell);
        
        
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
        if (this._tooltip._tooltips && this._tooltip._tooltips.length) {

            /**
            * Register this object for redrawing
            */
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);
        
            /**
            * The onclick event
            */
            //this.canvas.onclick = function (e)
            var canvas_onclick_func = function (e)
            {
                OfficeExcel.HideZoomedCanvas();

                e = OfficeExcel.FixEventObject(e);

                var mouseCoords = OfficeExcel.getMouseXY(e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;



                /**
                * If it's actually a donut make sure the hyp is bigger
                * than the size of the hole in the middle
                */
                if (obj._otherProps._variant == 'donut' && Math.abs(hyp) < (obj.radius / 2)) {
                    return;
                }

                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                var isDonut = obj._otherProps._variant == 'donut';
                var hStyle  = obj._otherProps._highlight_style;
                var segment = obj.getSegment(e);


                if (segment) {

                    var x     = mouseCoords[0] - segment[0];
                    var y     = mouseCoords[1] - segment[1];
                    var theta = Math.atan(y / x); // RADIANS
                    var hyp   = y / Math.sin(theta);


                    if (   OfficeExcel.Registry.Get('chart.tooltip')
                        && segment[5] == OfficeExcel.Registry.Get('chart.tooltip').__index__
                        && OfficeExcel.Registry.Get('chart.tooltip').__canvas__.__object__.id == obj.id) {

                        return;

                    } else {
                        OfficeExcel.Redraw();
                    }

                    /**
                    * If a tooltip is defined, show it
                    */
    
                    /**
                    * Get the tooltip text
                    */
                    var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, segment[5]);
    
                    if (text) {
                        OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, segment[5]);
                    }


                    /**
                    * Do the highlighting
                    */
                    if (text) {
                        if (hStyle == '2d') {
                            
                            obj.highlight_segment(segment);
    
                        } else if (hStyle == 'explode') {
    
                            
                           obj.Explode(segment[5], 25);
    
                            setTimeout(function () {obj._otherProps._exploded = [];}, document.all ? 1000 : 500);
                            
                            e.stopPropagation();
                            e.cancelBubble = true;
                            //return false;
    
                        } else {
    
                            context.lineWidth = 2;
    
                            /**
                            * Draw a white segment where the one that has been clicked on was
                            */
                            context.fillStyle = 'white';
                            context.strokeStyle = 'white';
                            context.beginPath();
                                //context.moveTo(segment[0], segment[1]);
                                context.arc(segment[0], segment[1], segment[2], obj.angles[segment[5]][0], obj.angles[segment[5]][1], false);
                                obj._otherProps._variant == 'donut' ? context.arc(segment[0], segment[1], segment[2] / 2, obj.angles[segment[5]][1], obj.angles[segment[5]][0], true) : context.lineTo(segment[0], segment[1]);
                            context.stroke();
                            context.fill();
    
                            context.lineWidth = 1;
    
                            context.shadowColor   = '#666';
                            context.shadowBlur    = 3;
                            context.shadowOffsetX = 3;
                            context.shadowOffsetY = 3;
    
                            // Draw the new segment
                            context.beginPath();
                                context.fillStyle   = obj._otherProps._colors[segment[5]];
                                context.strokeStyle = obj._otherProps._strokecolor;
                                context.arc(segment[0] - 3, segment[1] - 3, segment[2], obj.angles[segment[5]][0], obj.angles[segment[5]][1], false);
                                obj._otherProps._variant == 'donut' ? context.arc(segment[0] - 3, segment[1] - 3, segment[2] / 2, obj.angles[segment[5]][1], obj.angles[segment[5]][0], true) : context.lineTo(segment[0], segment[1]);
                            context.closePath();
                            
                            context.stroke();
                            context.fill();
                            
                            // Turn off the shadow
                            OfficeExcel.NoShadow(obj);
                            
                            /**
                            * If a border is defined, redraw that
                            */
                            if (obj._otherProps._border) {
                                context.beginPath();
                                context.strokeStyle = obj._otherProps._border_color;
                                context.lineWidth = 5;
                                context.arc(segment[0] - 3, segment[1] - 3, obj.radius - 2, obj.angles[i][0], obj.angles[i][1], 0);
                                context.stroke();
                            }
                        }
                    }


                    /**
                    * Need to redraw the key?
                    */
                    if (obj._otherProps._key && obj._otherProps._key.length && obj._otherProps._key_position == 'graph') {
                        OfficeExcel.DrawKey(obj, obj._otherProps._key, obj._otherProps._colors);
                    }

                    e.stopPropagation();

                    return;
                } else if (obj._tooltip._event == 'onclick') {
                    OfficeExcel.Redraw();
                }
            }
            var event_name = this._tooltip._event == 'onmousemove' ? 'mousemove' : 'click';

            this.canvas.addEventListener(event_name, canvas_onclick_func, false);
            OfficeExcel.AddEventListener(this.id, event_name, canvas_onclick_func);






            /**
            * The onmousemove event for changing the cursor
            */
            //this.canvas.onmousemove = function (e)
            var canvas_onmousemove_func = function (e)
            {
                OfficeExcel.HideZoomedCanvas();

                e = OfficeExcel.FixEventObject(e);
                
                var obj     = e.target.__object__;
                var segment = obj.getSegment(e);

                if (segment) {
                    var text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, segment[5]);
                    
                    if (text) {
                        e.target.style.cursor = 'pointer';
                        return;
                    }
                }

                /**
                * Put the cursor back to null
                */
                e.target.style.cursor = 'default';
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);









            /**
            * The window onclick function
            */
            var window_onclick_func = function (e)
            {
                // Taken out on 02/10/11
                //OfficeExcel.HideZoomedCanvas();

                e = OfficeExcel.FixEventObject(e);

                OfficeExcel.Redraw();

                /**
                * Put the cursor back to null
                */
                //e.target.style.cursor = 'default';
            }
            window.addEventListener('click', window_onclick_func, false);
            OfficeExcel.AddEventListener('window_' + this.id, 'click', window_onclick_func);
        }


        /**
        * If a border is pecified, draw it
        */
        if (this._otherProps._border) {
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.strokeStyle = this._otherProps._border_color;

            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 2,
                             0,
                             6.28,
                             0);

            this.context.stroke();
        }
        
        /**
        * Draw the kay if desired
        */
        if (this._otherProps._key != null) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }

        OfficeExcel.NoShadow(this);
        
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

    
    OfficeExcel.Pie.prototype.DrawArea = function ()
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
		
		// border
		if ( !g_bChartPreview && this._otherProps._area_border ) {
			this.context.beginPath();
			this.context.rect(0, 0, this.canvas.width,this.canvas.height);
			this.context.strokeStyle = "black";
		}
		
        this.context.stroke();
    }

    /**
    * Draws a single segment of the pie chart
    * 
    * @param int degrees The number of degrees for this segment
    */
    OfficeExcel.Pie.prototype.DrawSegment = function (radians, color, last, index)
    {
        var context  = this.context;
        var canvas   = this.canvas;
        var subTotal = this.subTotal;
		
		var centerx = this.centerx;
		if(this._otherProps._key_halign == 'right')
			centerx  = (this.canvas.width - this._chartGutter._right)/2;
		else if(this._otherProps._key_halign == 'left')
			centerx  = (this.canvas.width + this._chartGutter._left)/2;
		if(centerx <= (this.radius + 14) || (this.canvas.width - (this.radius*2) - this._chartGutter._left) <= 14)
			centerx = this.centerx;
			
            radians  = radians * this._otherProps._effect_roundrobin_multiplier;

        context.beginPath();

            context.fillStyle   = color;
            context.strokeStyle = this._otherProps._strokecolor;
            context.lineWidth   = 0;
            
            if (this._shadow._visible)
                OfficeExcel.SetShadow(this, this._shadow._color,this._shadow._offset_x, this._shadow._offset_y, this._shadow._blur);

            /**
            * Exploded segments
            */
            if ( (typeof(this._otherProps._exploded) == 'object' && this._otherProps._exploded[index] > 0) || typeof(this._otherProps._exploded) == 'number') {
                var explosion = typeof(this._otherProps._exploded) == 'number' ? this._otherProps._exploded : this._otherProps._exploded[index];
                var x         = 0;
                var y         = 0;
                var h         = explosion;
                var t         = (subTotal + (radians / 2)) - 1.57;
                var x         = (Math.cos(t) * explosion);
                var y         = (Math.sin(t) * explosion);
            
                this.context.moveTo(centerx + x, this.centery + y);
            } else {
                var x = 0;
                var y = 0;
            }
            
            /**
            * Calculate the angles
            */
            var startAngle = (subTotal) - 1.57;
            var endAngle   = (((subTotal + radians))) - 1.57;
			if(this.radius < 0)
				this.radius = 0;
            context.arc(centerx + x,
                        this.centery + y,
                        this.radius,
                        startAngle,
                        endAngle,
                        0);

            if (this._otherProps._variant == 'donut') {
    
                context.arc(centerx + x,
                            this.centery + y,
                            (this.radius / 2),
                            endAngle,
                            startAngle,
                            true);
            } else {
                context.lineTo(centerx + x, this.centery + y);
            }

        this.context.closePath();


        // Keep hold of the angles
        this.angles.push([subTotal - (Math.PI / 2), subTotal + radians - (Math.PI / 2), centerx + x, this.centery + y]);


        
        //this.context.stroke();
        this.context.fill();

        /**
        * Calculate the segment angle
        */
        this._otherProps._segments.push([subTotal, subTotal + radians]);
        this.subTotal += radians;
    }

    /**
    * Draws the graphs labels
    */
    OfficeExcel.Pie.prototype.DrawLabels = function (isFormatCell)
    {
        var hAlignment = 'left';
        var vAlignment = 'center';
        var labels     = this._otherProps._labels;
        var context    = this.context;
		var bold 	   = this._otherProps._labels_above_bold;
		var textOptions =
		{
			color: this._otherProps._labels_above_color,
			underline: this._otherProps._labels_above_underline,
			italic: this._otherProps._labels_above_italic
		}	
		
		var centerx = this.centerx;
		if(this._otherProps._key_halign == 'right')
			centerx  = (this.canvas.width - this._chartGutter._right)/2;
		else if(this._otherProps._key_halign == 'left')
			centerx  = (this.canvas.width + this._chartGutter._left)/2;
		if(centerx <= (this.radius + 14) || (this.canvas.width - (this.radius*2) - this._chartGutter._left) <= 14)
			centerx = this.centerx;
		
        /**
        * Turn the shadow off
        */
        OfficeExcel.NoShadow(this);
        
        context.fillStyle = 'black';
        context.beginPath();

        /**
        * Draw the key (ie. the labels)
        */
        if (labels && labels.length) {

            var text_size = this._otherProps._text_size;

            for (i=0; i<labels.length; ++i) {
				isFormatCellTrue = isFormatCell;
				if(this.arrFormatAdobeLabels && this.arrFormatAdobeLabels[i])
					isFormatCellTrue = this.arrFormatAdobeLabels[0][i];
                /**
                * T|his ensures that if we're given too many labels, that we don't get an error
                */
                if (typeof(this.angles) == 'undefined') {
                    continue;
                }

                // Move to the centre
                context.moveTo(centerx,this.centery);
                
                var a = this.angles[i][0] + ((this.angles[i][1] - this.angles[i][0]) / 2);

                /**
                * Alignment
                */
                if (a < 1.57) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                } else if (a < 3.14) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 4.71) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 6.28) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                }

                var angle = ((this.angles[i][1] - this.angles[i][0]) / 2) + this.angles[i][0];

                /**
                * Handle the additional "explosion" offset
                */
                if (typeof(this._otherProps._exploded) == 'object' && this._otherProps._exploded[i] || typeof(this._otherProps._exploded) == 'number') {

                    var t = ((this.angles[i][1] - this.angles[i][0]) / 2);
                    var seperation = typeof(this._otherProps._exploded) == 'number' ? this._otherProps._exploded : this._otherProps._exploded[i];

                    // Adjust the angles
                    var explosion_offsetx = (Math.cos(angle) * seperation);
                    var explosion_offsety = (Math.sin(angle) * seperation);
                } else {
                    var explosion_offsetx = 0;
                    var explosion_offsety = 0;
                }
                
                /**
                * Allow for the label sticks
                */
                if (this._otherProps._labels_sticks) {
                    explosion_offsetx += (Math.cos(angle) * this._otherProps._labels_sticks_length);
                    explosion_offsety += (Math.sin(angle) * this._otherProps._labels_sticks_length);
                }


                context.fillStyle = this._otherProps._text_color;

                OfficeExcel.Text(context,
                            this._otherProps._text_font,
                            text_size,
                            centerx + explosion_offsetx + ((this.radius - 10)* Math.cos(a)) + (this._otherProps._labels_sticks ? (a < 1.57 || a > 4.71 ? 2 : -2) : 0),
                            this.centery + explosion_offsety + (((this.radius - 10) * Math.sin(a))),
                            OfficeExcel.numToFormatText(labels[i],isFormatCellTrue),
                            vAlignment,
                            hAlignment, false, null,null, bold, null, textOptions);
            }
            
            context.fill();
        }
    }


    /**
    * This function draws the pie chart sticks (for the labels)
    */
    OfficeExcel.Pie.prototype.DrawSticks = function ()
    {
        var context  = this.context;
        var offset   = this._otherProps._linewidth / 2;
        var exploded = this._otherProps._exploded;
        var sticks   = this._otherProps._labels_sticks;

        for (var i=0; i<this.angles.length; ++i) {

            if (typeof(sticks) == 'object' && !sticks[i]) {
                continue;
            }

            var radians = this.angles[i][1] - this.angles[i][0];

            context.beginPath();
            context.strokeStyle = this._otherProps._labels_sticks_color;
            context.lineWidth   = 1;

            var midpoint = (this.angles[i][0] + (radians / 2));

            if (typeof(exploded) == 'object' && exploded[i]) {
                var extra = exploded[i];
            } else if (typeof(exploded) == 'number') {
                var extra = exploded;
            } else {
                var extra = 0;
            }

            context.lineJoin = 'round';
            context.lineWidth = 1;

            context.arc(this.centerx,
                        this.centery,
                        this.radius + this._otherProps._labels_sticks_length + extra,
                        midpoint,
                        midpoint + 0.001,
                        0);
            context.arc(this.centerx,
                        this.centery,
                        this.radius + extra,
                        midpoint,
                        midpoint + 0.001,
                        0);

            context.stroke();
        }
    }


    /**
    * The (now Pie chart specific) getSegment function
    * 
    * @param object e The event object
    */
    OfficeExcel.Pie.prototype.getSegment = function (e)
    {
        OfficeExcel.FixEventObject(e);

        // The optional arg provides a way of allowing some accuracy (pixels)
        var accuracy = arguments[1] ? arguments[1] : 0;

        var obj         = e.target.__object__;
        var canvas      = obj.canvas;
        var context     = obj.context;
        var mouseCoords = OfficeExcel.getMouseXY(e);
        var r           = obj.radius;
        var angles      = obj.angles;
        var ret         = [];

        for (var i=0; i<angles.length; ++i) {

            var x     = mouseCoords[0] - angles[i][2];
            var y     = mouseCoords[1] - angles[i][3];
            var theta = Math.atan(y / x); // RADIANS
            var hyp   = y / Math.sin(theta);
            var hyp   = (hyp < 0) ? hyp + accuracy : hyp - accuracy;


            /**
            * Account for the correct quadrant
            */
            if (x < 0 && y >= 0) {
                theta += Math.PI;
            } else if (x < 0 && y < 0) {
                theta += Math.PI;
            }

            if (theta > (2 * Math.PI)) {
                theta -= (2 * Math.PI);
            }

            if (theta >= angles[i][0] && theta < angles[i][1]) {

                hyp = Math.abs(hyp);

                if (!hyp || (obj.radius && hyp > obj.radius) ) {
                    return null;
                }

                if (obj.type == 'pie' && obj._otherProps._variant == 'donut' && (hyp > obj.radius || hyp < (obj.radius / 2) ) ) {
                    return null;
                }



                ret[0] = angles[i][2];
                ret[1] = angles[i][3];
                ret[2] = obj.radius;
                ret[3] = angles[i][0] - (2 * Math.PI);
                ret[4] = angles[i][1];
                ret[5] = i;


                
                if (ret[3] < 0) ret[3] += (2 * Math.PI);
                if (ret[4] > (2 * Math.PI)) ret[4] -= (2 * Math.PI);
                
                ret[3] = ret[3];
                ret[4] = ret[4];

                return ret;
            }
        }
        
        return null;
    }


    OfficeExcel.Pie.prototype.DrawBorders = function ()
    {
        if (this._otherProps._linewidth > 0) {

            this.context.lineWidth = this._otherProps._linewidth;
            this.context.strokeStyle = this._otherProps._strokecolor;

            for (var i=0,len=this.angles.length; i<len; ++i) {
                this.context.beginPath();
                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this.radius,
                                     (this.angles[i][0]),
                                     (this.angles[i][0] + 0.001),
                                     0);
                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this._otherProps._variant == 'donut' ? this.radius / 2: this.radius,
                                     this.angles[i][0],
                                     this.angles[i][0],
                                     0);
                this.context.closePath();
                
                this.context.stroke();
            }
        }
    }


    /**
    * Returns the radius of the pie chart
    */
    OfficeExcel.Pie.prototype.getRadius = function ()
    {
        return Math.min(this.canvas.height - this._chartGutter._top - this._chartGutter._bottom, this.canvas.width - this._chartGutter._left - this._chartGutter._right) / 2;
    }


    /**
    * A programmatic explode function
    * 
    * @param object obj   The chart object
    * @param number index The zero-indexed number of the segment
    * @param number size  The size (in pixels) of the explosion
    */
    OfficeExcel.Pie.prototype.Explode = function (index, size)
    {
        var obj = this;
        
        this._otherProps._exploded = [];
        this._otherProps._exploded[index] = 0;

        for (var o=0; o<size; ++o) {
            setTimeout(
                function ()
                {
                    obj._otherProps._exploded[index] += 1;
                    OfficeExcel.Clear(obj.canvas);
                    obj.Draw();
                }, o * (document.all ? 25 : 16.666));
        }
    }


    /**
    * This function highlights a segment
    * 
    * @param array segment The segment information that is returned by the pie.getSegment(e) function
    */
    OfficeExcel.Pie.prototype.highlight_segment = function (segment)
    {
        var context = this.context;

        context.beginPath();
    
        context.strokeStyle = this._otherProps._highlight_style_2d_stroke;
        context.fillStyle   = this._otherProps._highlight_style_2d_fill;
    
        context.moveTo(segment[0], segment[1]);
        context.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);
        context.lineTo(segment[0], segment[1]);
        context.closePath();
        
        context.stroke();
        context.fill();
    }