    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The horizontal bar chart constructor. The horizontal bar is a minor variant
    * on the bar chart. If you have big labels, this may be useful as there is usually
    * more space available for them.
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    OfficeExcel.HBar = function (chartCanvas, data)
    {
        // Get the canvas and context objects
        this.id                = null;
        this.canvas            = chartCanvas ? chartCanvas : document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.data              = data;
        this.type              = 'hbar';
        this.coords            = [];
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
        
        this.max = 0;
        this.stackedOrGrouped  = false;

        // Check for support
        if (!this.canvas) {
            alert('[HBAR] No canvas support');
            return;
        }

        for (i=0; i<this.data.length; ++i) {
            if (typeof(this.data[i]) == 'object') {
                this.stackedOrGrouped = true;
            }
        }


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getBar;
    }


    /**
    * The function you call to draw the bar chart
    */
    OfficeExcel.HBar.prototype.Draw = function (xmin,xmax,ymin,ymax,isSkip,isFormatCell)
    {
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');


        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        //OfficeExcel.ClearEventListeners(this.id);

        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];
        this.max    = 0;

        /**
        * Check for xmin in stacked charts
        */
        if (this._otherProps._xmin > 0 && this._otherProps._grouping == 'stacked') {
            alert('[HBAR] Using xmin is not supported with stacked charts, resetting xmin to zero');
            this.__otherProps._xmin = 0;
        }

         var grouping = this._otherProps._grouping;

        for (i=0; i<this.data.length; ++i) {
            if (typeof(this.data[i]) == 'object') {
                var value = grouping == 'grouped' ? Number(OfficeExcel.array_max(this.data[i], true)) : Number(OfficeExcel.array_sum(this.data[i])) ;
            } else {
                var value = Number(Math.abs(this.data[i]));
            }

            this.max = Math.max(Math.abs(this.max), Math.abs(value));
        }

        this.scale = OfficeExcel.getScale(this.max, this);
         
        //определяем куда ставить ось
        var numNull = this._otherProps._background_grid_autofit_numhlines;
        var arrTemp = []
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
        if(min >= 0 && max >= 0)
        {
            numNull = 0;
        }
        else if(min <= 0 && max <= 0)
        {
            numNull = this._otherProps._background_grid_autofit_numvlines;
        }
        else
        {
            for (var i=0; i<this.scale.length; i++)
            {
                if(this.scale[i] == 0)
                {
                    numNull = i + 1;
                    break;
                }
            }
        }
        var nullPosition;
        if(0 == numNull)
            nullPosition = 0;
        else
            nullPosition =  (this.canvas.width - this._chartGutter._left - this._chartGutter._right)/(this._otherProps._background_grid_autofit_numvlines)*numNull;
        this.nullPositionOX = nullPosition + this._chartGutter._left;
        
        
        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.graphwidth     = this.canvas.width - this._chartGutter._left - this._chartGutter._right;
        this.graphheight    = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this._otherProps._text_size / 2;

        
        //Draw Area
        OfficeExcel.background.DrawArea(this);
        
        // Progressively Draw the chart
        OfficeExcel.background.Draw(this);
        

        //getNullPosition(this);
        
        this.Drawbars(isFormatCell);
        this.DrawAxes();
        this.DrawLabels(isFormatCell);


        // Draw the key if necessary
        if (this._otherProps._key.length) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }


        /**
        * Install the clickand mousemove event listeners
        */
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);

        /**
        * Install the event handlers for tooltips
        */
        if (this._tooltip._tooltips) {

            // Need to register this object for redrawing
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);

            /**
            * Install the window onclick handler
            */
            window.onclick = function ()
            {
                OfficeExcel.Redraw();
            }



            /**
            * If the cursor is over a hotspot, change the cursor to a hand
            */
            //this.canvas.onmousemove = function (e)
            var canvas_onmousemove_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas = document.getElementById(this.id);
                var obj = canvas.__object__;
                var bar = obj.getBar(e);

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = OfficeExcel.getMouseXY(e);

                if (bar) {

                    
                    var left   = bar[0];
                    var top    = bar[1];
                    var width  = bar[2];
                    var height = bar[3];
                    var idx    = bar[4];
                    var text   = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, idx);

                    if (!text) {
                        return;
                    }

                    canvas.style.cursor = 'pointer';
                    
                    /**
                    * Show the tooltip if the event is onmousemove
                    */
                    if (obj._tooltip._event == 'onmousemove') {
                    
                        var tooltipObj = OfficeExcel.Registry.Get('chart.tooltip');

                        if (text) {
                            if (!tooltipObj || tooltipObj.__index__ != idx) {
                            
                                OfficeExcel.HideTooltip();
                                OfficeExcel.Redraw();

                                obj.context.beginPath();
                                obj.context.strokeStyle = obj._otherProps._highlight_stroke;
                                obj.context.fillStyle   = obj._otherProps._highlight_fill;
                                obj.context.strokeRect(left, top, width, height);
                                obj.context.fillRect(left, top, width, height);

                                OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, idx);
                            }
                            return;
                        }
                    }
                }
                
                if (!bar) {
                    canvas.style.cursor = 'default';
                }
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);


            /**
            * Install the onclick event handler for the tooltips
            */
            //this.canvas.onclick = function (e)
            var canvas_onclick_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                //var canvas = document.getElementById(this.id);
                var canvas = e.target;
                var obj = canvas.__object__;
                var bar = obj.getBar(e);

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                OfficeExcel.Redraw();

                /**
                * Get the mouse X/Y coordinates
                */
                var mouseCoords = OfficeExcel.getMouseXY(e);
                
                /*******************************************************
                * Only do this if a bar is being hovered over
                *******************************************************/
                if (bar) {
                    
                    var left   = bar[0];
                    var top    = bar[1];
                    var width  = bar[2];
                    var height = bar[3];
                    var idx    = bar[4];

                    text = OfficeExcel.parseTooltipText(obj._tooltip._tooltips, idx);
                    
                    if (!text) {
                        return;
                    }

                    /**
                    * Show a tooltip if it's defined
                    */
                    if (String(text).length && text != null) {

                        obj.context.beginPath();
                        obj.context.strokeStyle = obj._otherProps._highlight_stroke;
                        obj.context.fillStyle   = obj._otherProps._highlight_fill;
                        obj.context.strokeRect(left, top, width, height);
                        obj.context.fillRect(left, top, width, height);
    
                        obj.context.stroke();
                        obj.context.fill();

                        OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, idx);
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation();
            }
            this.canvas.addEventListener('click', canvas_onclick_func, false);
            OfficeExcel.AddEventListener(this.id,'click', canvas_onclick_func);

            // This resets the bar graph
            if (OfficeExcel.Registry.Get('chart.tooltip')) {
                OfficeExcel.Registry.Get('chart.tooltip').style.display = 'none';
                OfficeExcel.Registry.Set('chart.tooltip', null)
            }
        }

        /**
        * Setup the context menu if required
        */
        if (this._otherProps._contextmenu) {
            OfficeExcel.ShowContext(this);
        }


        /**
        * Draw "in graph" labels
        */
        OfficeExcel.DrawInGraphLabels(this);
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        if (this._otherProps._annotatable) {
            OfficeExcel.Annotate(this);
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
    * This draws the axes
    */
    OfficeExcel.HBar.prototype.DrawAxes = function ()
    {
        var halfway = (this.graphwidth / 2) + this._chartGutter._left;

        this.context.beginPath();
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this._otherProps._axis_color;

        // Draw the Y axis
		if(!this._otherProps._noyaxis)
		{
			 if('auto' == this._otherProps._ylabels_count)
			{
				
				this.context.moveTo(AA(this, this.nullPositionOX), this._chartGutter._top);
				this.context.lineTo(AA(this, this.nullPositionOX), this.canvas.height - this._chartGutter._bottom);
				//this.nullPositionOX = this._chartGutter._left + nullPosition;
				//this.min = min;
				//this.max = max;
					
					//context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
					//context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
			}
			else if (this._otherProps._yaxispos == 'center') {
				this.context.moveTo(AA(this, halfway), this._chartGutter._top);
				this.context.lineTo(AA(this, halfway), this.canvas.height - this._chartGutter._bottom);
			} else {
				this.context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
				this.context.lineTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom);
			}
		}
        // Draw the X axis
		if(!this._otherProps._noxaxis)
		{
			this.context.moveTo(this._chartGutter._left, AA(this, OfficeExcel.GetHeight(this) - this._chartGutter._bottom));
			this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));
		}

        // Draw the Y tickmarks
		if(!this._otherProps._noyaxis)
		{
			var yTickGap = (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / this.data.length;

			for (y=this._chartGutter._top; y<=(this.canvas.height - this._chartGutter._bottom) + 1; y+=yTickGap) {
				if('auto' == this._otherProps._ylabels_count)
				{
					if( (y + yTickGap) > (this.canvas.height - this._chartGutter._bottom))
					{
						y = this.canvas.height - this._chartGutter._bottom;
						this.context.moveTo(this.nullPositionOX, AA(this, y));
						this.context.lineTo( this.nullPositionOX  - 3, AA(this, y));
						break;
					}
						y = this.canvas.height - this._chartGutter._bottom;
					this.context.moveTo(this.nullPositionOX, AA(this, y));
					this.context.lineTo( this.nullPositionOX  - 3, AA(this, y));
				}
				else if (this._otherProps._yaxispos == 'center') {
					this.context.moveTo(halfway + 3, AA(this, y));
					this.context.lineTo(halfway  - 3, AA(this, y));
				} else {
					this.context.moveTo(this._chartGutter._left, AA(this, y));
					this.context.lineTo( this._chartGutter._left  - 3, AA(this, y));
				}
			}
		}

        // Draw the X tickmarks
		if(!this._otherProps._noxaxis)
		{
			xTickGap = (this.canvas.width - this._chartGutter._left - this._chartGutter._right ) / (this.scale.length);
			yStart   = this.canvas.height - this._chartGutter._bottom;
			yEnd     = (this.canvas.height - this._chartGutter._bottom) + 5;

			for (x=(this.canvas.width - this._chartGutter._right), i=0; this._otherProps._yaxispos == 'center' ? x>=this._chartGutter._left : x>=this._chartGutter._left; x-=xTickGap) {

				if (this._otherProps._yaxispos != 'center' || i != 5) {
					this.context.moveTo(AA(this, x), yStart);
					this.context.lineTo(AA(this, x), yEnd);
				}
				i++;
			}
		}
        this.context.stroke();
    }


    /**
    * This draws the labels for the graph
    */
    OfficeExcel.HBar.prototype.DrawLabels = function (isFormatCell)
    {
        var context    = this.context;
        var canvas     = this.canvas;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
        var text_size  = this._otherProps._xlabels_size;
        var font       = this._otherProps._xlabels_font;
		var scaleFactor = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scaleFactor = OfficeExcel.drawingCtxCharts.scaleFactor;

        /**
        * Set the units to blank if they're to be used for ingraph labels only
        */
        if (this._otherProps._units_ingraph) {
            units_pre  = '';
            units_post = '';
        }


        /**
        * Draw the X axis labels
        */
        if (this._otherProps._xlabels) {

            var gap = 13*scaleFactor;

            this.context.beginPath();
            this.context.fillStyle = this._otherProps._text_color;
			var bold 	   = this._otherProps._xlabels_bold;
			var textOptions =
			{
				color: this._otherProps._xlabels_color,
				underline: this._otherProps._xlabels_underline,
				italic: this._otherProps._xlabels_italic
			}	

            if('auto' == this._otherProps._ylabels_count)
            {
                var elemArr;
                var arrTemp = [];
                
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
                    var minX = Math.min.apply(null, arrMin);
                    var maxX = Math.max.apply(null, arrMax);
                }
                else
                {
                    var minX = Math.min.apply(null, this.data);
                    var maxX = Math.max.apply(null, this.data);
                }
                
                
                
                
                /*for (var i=0; i<this.data.length; i++)
                {
                    arrTemp[i] = this.data[i];
                }
                var minX = Math.min.apply(null, arrTemp);
                var maxX = Math.max.apply(null, arrTemp);*/
                
				if(minX < 0 && maxX <= 0)
                {
                    var xRevScale = OfficeExcel.array_reverse(this.scale);
                    for (var i=0; i<=xRevScale.length; i++) {
                        elemArr = xRevScale[i]
                        if(xRevScale.length == i)
						{
							var floatKoff = 100000000000;
							elemArr = Math.round(OfficeExcel.array_exp(xRevScale[xRevScale.length - 1] - (Math.abs(xRevScale[1] - xRevScale[0])))*floatKoff)/floatKoff ;
						}
                            
							//OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (i/xRevScale.length)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, - OfficeExcel.number_format(this, elemArr, units_pre, units_post), 'center', 'center'); 
						if(elemArr == 0)
							OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (i/xRevScale.length)), this._chartGutter._top + this.halfTextHeight*scaleFactor + this.graphheight + gap, OfficeExcel.numToFormatText(elemArr.toString(),isFormatCell) + units_post, 'center', 'center', false, null, null, bold, null,textOptions); 
						else
							OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (i/xRevScale.length)), this._chartGutter._top + this.halfTextHeight*scaleFactor + this.graphheight + gap,OfficeExcel.numToFormatText("-" +  elemArr.toString(),isFormatCell) + units_post, 'center', 'center', false, null, null, bold, null,textOptions); 
                    }
                  this._otherProps._background_grid_autofit_numvlines = xRevScale.length;
                  this._otherProps._numxticks = xRevScale.length;
                }
                else
                {
                     for (var i=0; i<=this.scale.length; i++) {
                        elemArr = this.scale[i-1]
                        if(0 == i)
						{
							var floatKoff = 100000000000;
							elemArr = Math.round(OfficeExcel.array_exp(this.scale[0] - (this.scale[1] - this.scale[0]))*floatKoff)/floatKoff ;
						}
							 //OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (i/this.scale.length)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, elemArr, units_pre, units_post), 'center', 'center'); 
                        OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (i/this.scale.length)), this._chartGutter._top + this.halfTextHeight*scaleFactor + this.graphheight + gap, (OfficeExcel.numToFormatText(elemArr.toString(),isFormatCell) + units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                    }
                  this._otherProps._background_grid_autofit_numvlines = this.scale.length;
                  this._otherProps._numxticks = this.scale.length;
                }
               
            }
            else if (this._otherProps._yaxispos == 'center') {
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (10/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (9/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (8/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (7/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (6/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 

                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (4/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, '-' + OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (3/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, '-' + OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (2/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, '-' + OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (1/10)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, '-' + OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (0)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, '-' + OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
    
            } else {
    
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (5/5)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[4]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (4/5)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[3]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (3/5)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[2]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (2/5)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[1]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                OfficeExcel.Text(context, font, text_size, this._chartGutter._left + (this.graphwidth * (1/5)), this._chartGutter._top + this.halfTextHeight + this.graphheight + gap, OfficeExcel.number_format(this, Number(this.scale[0]).toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', 'center', false, null, null, bold, null,textOptions); 
                
                if (this._otherProps._xmin > 0) {
                    OfficeExcel.Text(context,font,text_size,this._chartGutter._left,this._chartGutter._top + this.halfTextHeight + this.graphheight + 2,OfficeExcel.number_format(this, this._otherProps._xmin, units_pre, units_post),'center','center', false, null, null, bold, null,textOptions); 
                }
            }
            
            this.context.fill();
            this.context.stroke();
        }

        /**
        * The Y axis labels
        */
        if (typeof(this._otherProps._labels) == 'object' && this._otherProps._ylabels) {
        
            var xOffset = 11;
			text_size  = this._otherProps._ylabels_size;
			font       = this._otherProps._ylabels_font;
			var bold 	   = this._otherProps._ylabels_bold;
			var textOptions =
			{
				color: this._otherProps._ylabels_color,
				underline: this._otherProps._ylabels_underline,
				italic: this._otherProps._ylabels_italic
			}	
			
            // Draw the X axis labels
            this.context.fillStyle = this._otherProps._text_color;
            
            // How wide is each bar
            var barHeight = (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom ) / this._otherProps._labels.length;
            
            // Reset the xTickGap
            yTickGap = (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) / this._otherProps._labels.length

            // Draw the X tickmarks
            var i=0;
            if('auto' == this._otherProps._ylabels_count)
            {
                for (y=this._chartGutter._top + (yTickGap / 2); y<=OfficeExcel.GetHeight(this) - this._chartGutter._bottom; y+=yTickGap) {
                OfficeExcel.Text(this.context, font,text_size, this.nullPositionOX  - xOffset,y,String(this._otherProps._labels[i++]),'center','right', false, null, null, bold, null,textOptions); 
            }
            }
            else
            {
                for (y=this._chartGutter._top + (yTickGap / 2); y<=OfficeExcel.GetHeight(this) - this._chartGutter._bottom; y+=yTickGap) {
                OfficeExcel.Text(this.context, font,text_size,this._chartGutter._left - xOffset,y,String(this._otherProps._labels[i++]),'center','right', false, null, null, bold, null,textOptions); 
                }
            }
        }
    }
    
    
    /**
    * This function draws the actual bars
    */
    OfficeExcel.HBar.prototype.Drawbars = function (isFormatCell)
    {
        this.context.lineWidth   = 1;
        this.context.strokeStyle = this._otherProps._strokecolor;
        this.context.fillStyle   = this._otherProps._colors[0];
        var prevX                = 0;
        var prevY                = 0;

        /**
        * Work out the max value
        */
        if (this._otherProps._xmax) {
             if('auto' == this._otherProps._ylabels_count)
            {
                var lengSc = this.scale.length;
                this.max = this.scale[lengSc -1];
                this._otherProps._background_grid_autofit_numhlines = lengSc;
                this._otherProps._numxticks = lengSc;
            }
            else
            {
                this.scale = [
                          (((this._otherProps._xmax - this._otherProps._xmin) * 0.2) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals),
                          (((this._otherProps._xmax - this._otherProps._xmin) * 0.4) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals),
                          (((this._otherProps._xmax - this._otherProps._xmin) * 0.6) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals),
                          (((this._otherProps._xmax - this._otherProps._xmin) * 0.8) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals),
                          (((this._otherProps._xmax - this._otherProps._xmin) + this._otherProps._xmin)).toFixed(this._otherProps._scale_decimals)
                         ];
                this.max = this.scale[4];
            }
        } else {
        
            if('auto' == this._otherProps._ylabels_count)
            {
                var lengSc = this.scale.length;
                this.max = this.scale[lengSc -1];
                this._otherProps._background_grid_autofit_numhlines = lengSc;
                this._otherProps._numxticks = lengSc;
            }
            /**
            * Account for xmin
            */
            else if (this._otherProps._xmin > 0) {
                this.scale[0] = Number((((this.scale[4] - this._otherProps._xmin) * 0.2) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals));
                this.scale[1] = Number((((this.scale[4] - this._otherProps._xmin) * 0.4) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals));
                this.scale[2] = Number((((this.scale[4] - this._otherProps._xmin) * 0.6) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals));
                this.scale[3] = Number((((this.scale[4] - this._otherProps._xmin) * 0.8) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals));
                this.scale[4] = Number((((this.scale[4] - this._otherProps._xmin) * 1.0) + this._otherProps._xmin).toFixed(this._otherProps._scale_decimals));
            }
            if('auto' != this._otherProps._ylabels_count)
                this.max = this.scale[4];
        }

        if (this._otherProps._scale_decimals == null && Number(this.max) == 1) {
            this._otherProps._scale_decimals = 1;
        }
        
        /*******************************************************
        * This is here to facilitate sequential colors
        *******************************************************/
        var colorIdx = 0;

        /**
        * The bars are drawn HERE
        */
        var graphwidth = (this.canvas.width - this._chartGutter._left - this._chartGutter._right);
        var halfwidth  = graphwidth / 2;

        for (i=0; i<this.data.length; ++i) {

            
            
            // Work out the width and height
            var width;
            if('auto' == this._otherProps._ylabels_count)
            {
                var tempMax = this._otherProps._xmax;
                var tempMin = this._otherProps._xmin;
                this.max = tempMax;
                this.min = tempMin;
                if(this.min < 0 && this.max > 0)
                {
                    width = (OfficeExcel.array_sum(this.data[i])) / (tempMax - tempMin) * (graphwidth);
                }
                else if(this.min < 0 && this.max < 0)
                     width = ((OfficeExcel.array_sum(this.data[i]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
                else if(this.min < 0 && this.max == 0)
                    width = ((OfficeExcel.array_sum(this.data[i]) < 0 ? OfficeExcel.array_sum(this.data[i]): OfficeExcel.array_sum(this.data[i]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
                else
                    width = ((OfficeExcel.array_sum(this.data[i]) < 0 ? OfficeExcel.array_sum(this.data[i] + tempMin): OfficeExcel.array_sum(this.data[i]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
            }
            else
                width  = (this.data[i] / this.max) *  graphwidth;
            
            
            
            var height = this.graphheight / this.data.length;
            var orig_height = height;

            
            var x;
            if('auto' == this._otherProps._ylabels_count)
            {
                if(this.min < 0 && this.max < 0)
                    x = this.nullPositionOX - width;
                else if(0 > OfficeExcel.array_sum(this.data[i]))
                    x = this.nullPositionOX + 2*width;
                else
                    x = this.nullPositionOX;
            }
            else
                x = this._chartGutter._left;
            
            
            var y       = this._chartGutter._top + (i * height);
            var vmargin = this._otherProps._vmargin;

            // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
            if (width < 0) {
                x -= width;
                width = Math.abs(width);
            }

            /**
            * Turn on the shadow if need be
            */
            if (this._shadow._visible) {
                this.context.shadowColor   = this._shadow._color;
                this.context.shadowBlur    = this._shadow._blur;
                this.context.shadowOffsetX = this._shadow._offset_x;
                this.context.shadowOffsetY = this._shadow._offset_y;
            }

            /**
            * Draw the bar
            */
            this.context.beginPath();
                if (typeof(this.data[i]) == 'number') {

                    var barHeight = height - (2 * vmargin);
                    var barWidth  = ((this.data[i] - this._otherProps._xmin) / (this.max - this._otherProps._xmin)) * this.graphwidth;
                    var barX      = this._chartGutter._left;

                    // Account for Y axis pos
                    if (this._otherProps._yaxispos == 'center') {
                        barWidth /= 2;
                        barX += halfwidth;
                        
                        if (this.data[i] < 0) {
                            barWidth = (Math.abs(this.data[i]) - this._otherProps._xmin) / (this.max - this._otherProps._xmin);
                            barWidth = barWidth * (this.graphwidth / 2);
                            barX = ((this.graphwidth / 2) + this._chartGutter._left) - barWidth;
                        }
                    }
                    
                     if('auto' == this._otherProps._ylabels_count)
                    {
                        barWidth = width;
                        barX = x;
                    }
                    // Set the fill color
                    this.context.strokeStyle = this._otherProps._strokecolor;
                    this.context.fillStyle = this._otherProps._colors[0];
                    
                    // Sequential colors
                    if (this._otherProps._colors_sequential) {
                        this.context.fillStyle = this._otherProps._colors[colorIdx++];
                    }

                    this.context.strokeRect(barX, this._chartGutter._top + (i * height) + this._otherProps._vmargin, barWidth, barHeight);
                    this.context.fillRect(barX, this._chartGutter._top + (i * height) + this._otherProps._vmargin, barWidth, barHeight);

                    this.coords.push([barX,
                                      y + vmargin,
                                      barWidth,
                                      height - (2 * vmargin),
                                      this.context.fillStyle,
                                      this.data[i],
                                      true]);

                /**
                * Stacked bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this._otherProps._grouping == 'stacked') {

                    if (this._otherProps._yaxispos == 'center') {
                        alert('[HBAR] You can\'t have a stacked chart with the Y axis in the center, change it to grouped');
                    }

                    var barHeight = height - (2 * vmargin);

                    for (j=0; j<this.data[i].length; ++j) {
                    

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this._otherProps._strokecolor;
                        this.context.fillStyle = this._otherProps._colors[j];
                        

                        // Sequential colors
                        if (this._otherProps._colors_sequential) {
                            this.context.fillStyle = this._otherProps._colors[colorIdx++];
                        }
                        

                        var width = (((this.data[i][j]) / (this.max))) * this.graphwidth;
                        var totalWidth = (OfficeExcel.array_sum(this.data[i]) / this.max) * this.graphwidth;

                        this.context.strokeRect(x, this._chartGutter._top + this._otherProps._vmargin + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );
                        this.context.fillRect(x, this._chartGutter._top + this._otherProps._vmargin + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );

                        /**
                        * Store the coords for tooltips
                        */

                        // The last property of this array is a boolean which tells you whether the value is the last or not
                        this.coords.push([x,
                                          y + vmargin,
                                          width,
                                          height - (2 * vmargin),
                                          this.context.fillStyle,
                                          OfficeExcel.array_sum(this.data[i]),
                                          j == (this.data[i].length - 1)
                                         ]);

                        x += width;
                    }

                /**
                * A grouped bar chart
                */
                } else if (typeof(this.data[i]) == 'object' && this._otherProps._grouping == 'grouped') {

                    for (j=0; j<this.data[i].length; ++j) {

                        /**
                        * Turn on the shadow if need be
                        */
                        if (this._shadow._visible)
                            OfficeExcel.SetShadow(this, this._shadow._color, this._shadow._offset_x, this._shadow._offset_y, this._shadow._blur);

                        // Set the fill/stroke colors
                        this.context.strokeStyle = this._otherProps._strokecolor;
						if(this._otherProps._colors[j])
							this.context.fillStyle = this._otherProps._colors[j];

                        // Sequential colors
                        if (this._otherProps._colors_sequential) {
                            this.context.fillStyle = this._otherProps._colors[colorIdx++];
                        }

                        
                        
                        
                        
                        var width;
                        if('auto' == this._otherProps._ylabels_count)
                        {
                            var tempMax = this._otherProps._xmax;
                            var tempMin = this._otherProps._xmin;
                            this.max = tempMax;
                            this.min = tempMin;
                            if(this.min < 0 && this.max > 0)
                            {
                                width = (OfficeExcel.array_sum(this.data[i][j])) / (tempMax - tempMin) * (graphwidth);
                            }
                            else if(this.min < 0 && this.max < 0)
                                 width = ((OfficeExcel.array_sum(this.data[i][j]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
                            else if(this.min < 0 && this.max == 0)
                                width = graphwidth - ((OfficeExcel.array_sum(this.data[i][j]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
                            else
                                width = ((OfficeExcel.array_sum(this.data[i][j]) < 0 ? OfficeExcel.array_sum(this.data[i][j] + tempMin): OfficeExcel.array_sum(this.data[i][j]) - tempMin) / (tempMax - tempMin)) * (graphwidth);
                        }
                        else
                            width  = ((this.data[i][j] - this._otherProps._xmin) / (this.max - this._otherProps._xmin)) * (OfficeExcel.GetWidth(this) - this._chartGutter._left - this._chartGutter._right );
                        
                        
                        
                        var height = this.graphheight / this.data.length;
                        var orig_height = height;

                        var individualBarHeight = (height - (2 * vmargin)) / this.data[i].length;

                         var startX;
                        if('auto' == this._otherProps._ylabels_count)
                        {
                            if(this.min < 0 && this.max < 0)
                                startX = this.nullPositionOX - width;
                            else if(0 > OfficeExcel.array_sum(this.data[i][j]) && this.min < 0 && this.max > 0)
                                startX = this.nullPositionOX
                            else if(0 > OfficeExcel.array_sum(this.data[i][j]))
                                startX = this.nullPositionOX - width;
                            else
                                startX = this.nullPositionOX;
                        }
                        else
                            startX = this._chartGutter._left;

                        var startY = y + vmargin + (j * individualBarHeight);
                        if(this._otherProps._autoGrouping == 'stackedPer' || this._otherProps._autoGrouping == 'stacked')
                        {
                            startY = y + vmargin + (0*individualBarHeight);
                            individualBarHeight = individualBarHeight*this.data[0].length
                        }
                        // Account for the Y axis being in the middle
                        if (this._otherProps._yaxispos == 'center') {
                            width  /= 2;
                            startX += halfwidth;
                        }
                        
                        if (width < 0) {
                            startX += width;
                            width *= -1;
                        }

                        //this.context.strokeRect(startX, startY, width, individualBarHeight);
                        if(width != 0)
                            this.context.fillRect(startX, startY, width, individualBarHeight);
						
						var catName;
						if(this.catNameLabels && this.catNameLabels[i] && this.catNameLabels[i][j])
						{
							catName = this.catNameLabels[i][j];
						}						
                        this.coords.push([startX,
                                          startY,
                                          width,
                                          individualBarHeight,
                                          this.context.fillStyle,
                                          this.data[i][j],
                                          true,
										  this.arrFormatAdobeLabels[i][j],
										  this.firstData[i][j],
										  catName
										  ]);
                    }
                }

            this.context.closePath();
        }

        this.context.fill();
        this.context.stroke();



        /**
        * Now the bars are stroke()ed, turn off the shadow
        */
        OfficeExcel.NoShadow(this);
        
        this.RedrawBars(isFormatCell);
    }
    
    
    /**
    * This function goes over the bars after they been drawn, so that upwards shadows are underneath the bars
    */
    OfficeExcel.HBar.prototype.RedrawBars = function (format)
    {
        if (this._otherProps._noredraw) {
            return;
        }

        var coords = this.coords;

        var font   = this._otherProps._labels_above_font;
        var size   = this._otherProps._labels_above_size;
        var color  = this._otherProps._text_color;
		var bold 	   = this._otherProps._labels_above_bold;
		var textOptions =
		{
			color: this._otherProps._labels_above_color,
			underline: this._otherProps._labels_above_underline,
			italic: this._otherProps._labels_above_italic
		}	

        OfficeExcel.NoShadow(this);
        this.context.strokeStyle = this._otherProps._strokecolor;

        for (var i=0; i<coords.length; ++i) {

            if (this._shadow._visible) {
                this.context.beginPath();
                    this.context.strokeStyle = this._otherProps._strokecolor;
                    this.context.fillStyle = coords[i][4];
                    this.context.lineWidth = 1;
                    this.context.strokeRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                    this.context.fillRect(coords[i][0], coords[i][1], coords[i][2], coords[i][3]);
                this.context.fill();
                this.context.stroke();
            }

            /**
            * Draw labels "above" the bar
            */
            if (this._otherProps._labels_above && coords[i][6]) {

                this.context.fillStyle   = color;
                this.context.strokeStyle = 'black';
                OfficeExcel.NoShadow(this);

                var border = (coords[i][0] + coords[i][2] + 7 + this.context.measureText(this._otherProps._units_pre + this.coords[i][5] + this._otherProps._units_post).width) > OfficeExcel.GetWidth(this) ? true : false;
				var textLabel = this.coords[i][5];
				var formatLabel = format;
				if(this.coords[i][7])
					formatLabel = this.coords[i][7];
				if(this.coords[i][9])
					textLabel = this.coords[i][9];
				else if(this.coords[i][8])
					textLabel = this.coords[i][8];
				else
					continue;
					
				if(this.coords[i][7] == null && !textLabel)
					textLabel = "";
				if(textLabel != '' && !this.coords[i][9])
					textLabel = OfficeExcel.numToFormatText(OfficeExcel.num_round(textLabel),formatLabel);
					
                OfficeExcel.Text(this.context,
                            font,
                            size,
                            coords[i][0] + coords[i][2] + (border ? -5 : 5),
                            coords[i][1] + (coords[i][3] / 2),
							//OfficeExcel.number_format(this, OfficeExcel.num_round(this.coords[i][5]), this._otherProps._units_pre, this._otherProps._units_post),
							textLabel,
                            'center',
                            border ? 'right' : 'left',
                            null,
                            null,
                            border ? 'rgba(255,255,255,0.9)' : null, bold, null, textOptions);
            }
        }
    }
    
    
    /*******************************************************
    * This function can be used to get the appropriate bar information (if any)
    * 
    * @param  e Event object
    * @return   Appriate bar information (if any)
    *******************************************************/
    OfficeExcel.HBar.prototype.getBar = function (e)
    {
        var obj         = e.target.__object__;
        var canvas      = obj.canvas;
        var context     = obj.context;
        var mouseCoords = OfficeExcel.getMouseXY(e);

        /**
        * Loop through the bars determining if the mouse is over a bar
        */
        for (var i=0,len=obj.coords.length; i<len; i++) {

            var mouseX = mouseCoords[0];  // In relation to the canvas
            var mouseY = mouseCoords[1];  // In relation to the canvas
            var left   = obj.coords[i][0];
            var top    = obj.coords[i][1];
            var width  = obj.coords[i][2];
            var height = obj.coords[i][3];
            var idx    = i;

            if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) ) {
                return [left, top, width, height, idx];
            }
        }
    }


    /**
    * When you click on the chart, this method can return the X value at that point. It works for any point on the
    * chart (that is inside the gutters) - not just points within the Bars.
    * 
    * @param object e The event object
    */
    OfficeExcel.HBar.prototype.getValue = function (arg)
    {
        if (arg.length == 2) {
            var mouseX = arg[0];
            var mouseY = arg[1];
        } else {
            var mouseCoords = OfficeExcel.getMouseXY(arg);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
        }
        
        if (   mouseY < this._chartGutter._top
            || mouseY > (this.canvas.height - this._chartGutter._bottom)
            || mouseX < this._chartGutter._left
            || mouseX > (this.canvas.width - this._chartGutter._right)
           ) {
            return null;
        }
        
        if (this._otherProps._yaxispos == 'center') {
            var value = ((mouseX - this._chartGutter._left) / (this.graphwidth / 2)) * (this.max - this._otherProps._xmin);
                value = value - this.max
                
                // Special case if xmin is defined
                if (this._otherProps._xmin > 0) {
                    value = ((mouseX - this._chartGutter._left - (this.graphwidth / 2)) / (this.graphwidth / 2)) * (this.max - this._otherProps._xmin);
                    value += this._otherProps._xmin;
                    
                    if (mouseX < (this._chartGutter._left + (this.graphwidth / 2))) {
                        value -= (2 * this._otherProps._xmin);
                    }
                }
        } else {
            var value = ((mouseX - this._chartGutter._left) / this.graphwidth) * (this.max - this._otherProps._xmin);
                value += this._otherProps._xmin;
        }

        return value;
    }
function getNullPosition(obj)
{
    var numNull = obj._otherProps._background_grid_autofit_numhlines;
    var arrTemp = [];
    if(undefined == obj.scale)
        return;
    if(typeof(obj.data[0]) == 'object')
    {
        var arrMin = [];
        var arrMax = [];
        for (var j=0; j < obj.data.length; j++) {
            min = Math.min.apply(null, obj.data[j]);
            max = Math.max.apply(null, obj.data[j]);
            arrMin[j] = min;
            arrMax[j] = max;
        }
        min = Math.min.apply(null, arrMin);
        max = Math.max.apply(null, arrMax);
    }
    else
    {
        min = Math.min.apply(null, obj.data);
        max = Math.max.apply(null, obj.data);
    }
    if(min >= 0 && max >= 0)
    {
        numNull = 0;
    }
    else if(min <= 0 && max <= 0)
    {
        numNull = obj._otherProps._background_grid_autofit_numhlines;
    }
    else
    {
        for (var i=0; i<obj.scale.length; i++)
        {
            if(obj.scale[i] == 0)
            {
                numNull = i + 1;
                break;
            }
        }
    }
    var nullPosition;
    if(0 == numNull)
        nullPosition = 0;
    else
        nullPosition =  (obj.canvas.width - obj._chartGutter._left - obj._chartGutter._right)/(obj._otherProps._background_grid_autofit_numhlines)*numNull;
    obj.nullPositionOX = obj._chartGutter._left + nullPosition;
}