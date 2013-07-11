    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    /**
    * The scatter graph constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    */
    OfficeExcel.Scatter = function (chartCanvas, data)
    {
        // Get the canvas and context objects
        this.id                = null;
        this.canvas            = chartCanvas ? chartCanvas : document.getElementById(id);
        this.canvas.__object__ = this;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.max               = 0;
        this.coords            = [];
        this.data              = [];
        this.type              = 'scatter';
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

        // Handle multiple datasets being given as one argument
        if (arguments[1][0] && arguments[1][0][0] && typeof(arguments[1][0][0][0]) == 'number') {
            // Store the data set(s)
            for (var i=0; i<arguments[1].length; ++i) {
                this.data[i] = arguments[1][i];
            }

        // Handle multiple data sets being supplied as seperate arguments
        } else {
            // Store the data set(s)
            for (var i=1; i<arguments.length; ++i) {
                this.data[i - 1] = arguments[i];
            }
        }

        // Check for support
        if (!this.canvas) {
            alert('[SCATTER] No canvas support');
            return;
        }


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getPoint;
    }

    /**
    * The function you call to draw the line chart
    */
    OfficeExcel.Scatter.prototype.Draw = function (min,max,ymin,ymax,isSkip,isFormatCell,isformatCellScOy)
    {
        // MUST be the first thing done!
        if (typeof(this._otherProps._background_image) == 'string' && !this.__background_image__) {
            OfficeExcel.DrawBackgroundImage(this);
            return;
        }
        var xScale;
        /**
        * Fire the onbeforedraw event
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        //OfficeExcel.ClearEventListeners(this.id);

        // Go through all the data points and see if a tooltip has been given
        this._tooltip._tooltips = false;
        this.hasTooltips = false;
        var overHotspot  = false;

        // Reset the coords array
        this.coords = [];

        if (!OfficeExcel.isOld()) {
            for (var i=0; i<this.data.length; ++i) {
                for (var j =0;j<this.data[i].length; ++j) {
                    if (this.data[i][j] && this.data[i][j][3] && typeof(this.data[i][j][3]) == 'string' && this.data[i][j][3].length) {
                        this._tooltip._tooltips = [1];
                        this.hasTooltips = true;
                    }
                }
            }
        }

        // Reset the maximum value
        this.max = 0;

        // Work out the maximum Y value
        if (this._otherProps._ymax && 'auto' != this._otherProps._ylabels_count) {

            this.scale = [];
            this.max   = this._otherProps._ymax;
            this.min   = this._otherProps._ymin ? this._otherProps._ymin : 0;

            this.scale[0] = ((this.max - this.min) * (1/5)) + this.min;
            this.scale[1] = ((this.max - this.min) * (2/5)) + this.min;
            this.scale[2] = ((this.max - this.min) * (3/5)) + this.min;
            this.scale[3] = ((this.max - this.min) * (4/5)) + this.min;
            this.scale[4] = ((this.max - this.min) * (5/5)) + this.min;

            var decimals = this._otherProps._scale_decimals;

            this.scale = [
                          Number(this.scale[0]).toFixed(decimals),
                          Number(this.scale[1]).toFixed(decimals),
                          Number(this.scale[2]).toFixed(decimals),
                          Number(this.scale[3]).toFixed(decimals),
                          Number(this.scale[4]).toFixed(decimals)
                         ];

        } else {

            var i = 0;
            var j = 0;
            if('auto' == this._otherProps._ylabels_count && undefined != this._otherProps._ymax)
                this.max = this._otherProps._ymax;
            else
            {
                 for (i=0; i<this.data.length; ++i) {
                    for (j=0; j<this.data[i].length; ++j) {
                        this.max = Math.max(this.max, typeof(this.data[i][j][1]) == 'object' ? OfficeExcel.array_max(this.data[i][j][1]) : Math.abs(this.data[i][j][1]));
                    }
                }
            }
           
            if(this.scale == undefined)
                this.scale = OfficeExcel.getScale(this.max, this);
            if('auto' == this._otherProps._ylabels_count)
            {
                var lengSc = this.scale.length;
                //this.max = this.scale[lengSc -1];
                //this.min = this._otherProps._ymin;
                this._otherProps._background_grid_autofit_numhlines = lengSc-1;
                this._otherProps._numyticks = lengSc -1;
                var conX = true;
                if(this._otherProps._type == 'burse2')
                    xScale = this._otherProps._labels;
                else
                {
                    if(this.xScale == undefined)
                        xScale = OfficeExcel.getScale(conX, this);
                    else
                        xScale = this.xScale;
                }
                    
                this.xScale = xScale;
                if(this._otherProps._type == 'burse2')
                    this._otherProps._background_grid_autofit_numvlines = xScale.length;
                else
                    this._otherProps._background_grid_autofit_numvlines = xScale.length - 1;
                this._otherProps._numxticks = xScale.length;
            }
            else
            {
                this.max   = this.scale[4];
                this.min   = this._otherProps._ymin ? this._otherProps._ymin : 0;

                if (this.min) {
                    this.scale[0] = ((this.max - this.min) * (1/5)) + this.min;
                    this.scale[1] = ((this.max - this.min) * (2/5)) + this.min;
                    this.scale[2] = ((this.max - this.min) * (3/5)) + this.min;
                    this.scale[3] = ((this.max - this.min) * (4/5)) + this.min;
                    this.scale[4] = ((this.max - this.min) * (5/5)) + this.min;
                }


                if (typeof(this._otherProps._scale_decimals) == 'number') {
                    var decimals = this._otherProps._scale_decimals;
        
                    this.scale = [
                                  Number(this.scale[0]).toFixed(decimals),
                                  Number(this.scale[1]).toFixed(decimals),
                                  Number(this.scale[2]).toFixed(decimals),
                                  Number(this.scale[3]).toFixed(decimals),
                                  Number(this.scale[4]).toFixed(decimals)
                                 ];
                }
            }
            
        }

        this.grapharea = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
        
        //Draw Area
        this.DrawArea();
        
        // Progressively Draw the chart
        OfficeExcel.background.Draw(this);

        /**
        * Draw any horizontal bars that have been specified
        */
        if (this._otherProps._background_hbars && this._otherProps._background_hbars.length) {
            OfficeExcel.DrawBars(this);
        }

        /**
        * Draw any vertical bars that have been specified
        */
        if (this._otherProps._background_vbars && this._otherProps._background_vbars.length) {
            this.DrawVBars();
        }

        if (!this._otherProps._noaxes) {
            this.DrawAxes(min,max,ymin,ymax);
        }

        this.DrawLabels(xScale,isFormatCell,isformatCellScOy);

        i = 0;
        for(i=0; i<this.data.length; ++i) {
            this.DrawMarks(i);

            // Set the shadow
            this.context.shadowColor   = this._otherProps._line_shadow_color;
            this.context.shadowOffsetX = this._otherProps._line_shadow_offsetx;
            this.context.shadowOffsetY = this._otherProps._line_shadow_offsety;
            this.context.shadowBlur    = this._otherProps._line_shadow_blur;
            
            if(this._otherProps._type != 'burse2')
				this.DrawLine(i);

            // Turn the shadow off
            OfficeExcel.NoShadow(this);
        }


        if (this._otherProps._line) {
            for (var i=0;i<this.data.length; ++i) {
                this.DrawMarks(i); // Call this again so the tickmarks appear over the line
            }
        }


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
        * Install the event handler for tooltips
        */
        if (this.hasTooltips) {

            /**
            * Register all charts
            */
            OfficeExcel.Register(this);
            
            OfficeExcel.PreLoadTooltipImages(this);

            var overHotspot = false;

            var canvas_onmousemove_func = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var canvas      = e.target;
                var obj         = canvas.__object__;
                var context     = obj.context;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var point       = obj.getPoint(e);
                var overHotspot = false;

                if (point) {

                    var __dataset__ = point[2];
                    var __index__   = point[3];
                    var __text__    = point[4];
                    var overHotspot = true;
                    
                    /**
                    * Get the tooltip text
                    */
                    var text = OfficeExcel.parseTooltipText(obj.data[__dataset__][__index__], 3);



                    if (point[4]) {

                        if (
                            !OfficeExcel.Registry.Get('chart.tooltip') ||
                            OfficeExcel.Registry.Get('chart.tooltip').__text__ != __text__ ||
                            OfficeExcel.Registry.Get('chart.tooltip').__index__ != __index__ ||
                            OfficeExcel.Registry.Get('chart.tooltip').__dataset__ != __dataset__
                           ) {

                            if (obj._tooltip._highlight) {
                                OfficeExcel.Redraw();
                            }

                            /**
                            * Show the tooltip
                            */
                            if (text) {
                                canvas.style.cursor = 'pointer';
                                OfficeExcel.Tooltip(canvas, text, e.pageX, e.pageY, __index__);
                                OfficeExcel.Registry.Get('chart.tooltip').__text__ = obj.data[__dataset__][__index__][3];
                            } 

                            OfficeExcel.Registry.Get('chart.tooltip').__index__ = __index__;
                            
                            if (OfficeExcel.Registry.Get('chart.tooltip')) {
                                OfficeExcel.Registry.Get('chart.tooltip').__dataset__ = __dataset__;
                            }



                            /**
                            * Draw a circle around the mark. Also highlight the boxplot if necessary
                            */
                            if (obj._tooltip._highlight && typeof(point[0]) == 'object') {
                                context.beginPath();
                                context.strokeStyle = 'black';
                                context.fillStyle = 'rgba(255,255,255,0.5)';
                                context.strokeRect(point[0][0], point[1][0], point[0][1], point[1][1]);
                                context.fillRect(point[0][0], point[1][0], point[0][1], point[1][1]);
                                context.stroke();
                                context.fill();

                            } else if (obj._tooltip._highlight && typeof(point[0]) == 'number') {
                                context.beginPath();
                                context.fillStyle = 'rgba(255,255,255,0.5)';
                                context.arc(point[0], point[1], 3, 0, 6.28, 0);
                                context.fill();
                            }
                        // Just change the mouse pointer
                        } else if (point[4] && text) {
                            e.target.style.cursor = 'pointer';
                        }
                    }
                }

                /**
                * Reset the pointer
                */
                if (!overHotspot || !point[4]) {
                    canvas.style.cursor = 'default';
                }
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            OfficeExcel.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);
        }
        
        
        /**
        * Draw the key if necessary
        */
        if (this._otherProps._key && this._otherProps._key.length) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }


        /**
        * Draw " above" labels if enabled
        */
        if (this._otherProps._labels_above) {
            this.DrawAboveLabels(isformatCellScOy);
        }

        /**
        * Draw the "in graph" labels, using the member function, NOT the shared function in OfficeExcel.common.core.js
        */
        this.DrawInGraphLabels(this);


        /**
        * Draw crosschairs
        */
        OfficeExcel.DrawCrosshairs(this);

        
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


     OfficeExcel.Scatter.prototype.DrawArea = function ()
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

        // Draw the X axis
        /*if (this._otherProps._noxaxis == false) {
            if (this._otherProps._xaxispos == 'center') {
                this.context.moveTo(this._chartGutter._left, AA(this, (this.grapharea / 2) + this._chartGutter._top));
                this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, (this.grapharea / 2) + this._chartGutter._top));
            } else if (this._otherProps._xaxispos == 'top') {
                this.context.moveTo(this._chartGutter._left, AA(this, this._chartGutter._top));
                this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this._chartGutter._top));
            } else {
                
                this.context.moveTo(0, AA(this, this.canvas.height));
                this.context.lineTo(this.canvas.width, AA(this, this.canvas.height));
            }
        }

        // Draw the Y axis
        if (this._otherProps._noyaxis == false) {
            if (this._otherProps._yaxispos == 'left') {
                this.context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
                this.context.lineTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom );
            } else {
                this.context.moveTo(AA(this, this.canvas.width - this._chartGutter._right), this._chartGutter._top);
                this.context.lineTo(AA(this, this.canvas.width - this._chartGutter._right), this.canvas.height - this._chartGutter._bottom);
            }
        }*/
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
    * Draws the axes of the scatter graph
    */
    OfficeExcel.Scatter.prototype.DrawAxes = function (min,max,ymin,ymax)
    {
        var canvas      = this.canvas;
        var context     = this.context;
        var graphHeight = OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom;

        context.beginPath();
        context.strokeStyle = this._otherProps._axis_color;
        context.lineWidth   = 1;

        // Draw the Y axis
		if(!this._otherProps._noyaxis)
		{
			if('auto' == this._otherProps._ylabels_count)
			{
				//определяем куда ставить ось
				var numNull = this._otherProps._background_grid_autofit_numvlines;
				/*var arrTemp = [];
				var k = 0;
				for (var j=0; j < this.data.length; j++) {
					for (var i=0; i<this.data[j].length; i++)
					{
						arrTemp[k] = this.data[j][i][0];
						k++;
					}
				}
				min = Math.min.apply(null, arrTemp);
				max = Math.max.apply(null, arrTemp);*/
				if(min >= 0 && max >= 0)
				{
					numNull = this._otherProps._background_grid_autofit_numvlines;
				}
				else if(min <= 0 && max <= 0)
				{
					numNull = 0;
				}
				else
				{
					for (var i=0; i<this.xScale.length; i++)
					{
						if(this.xScale[i] == 0)
						{
							numNull = this._otherProps._background_grid_autofit_numvlines - i;
							break;
						}
					}
				}
				var nullPosition;
				
				if(this._otherProps._type == 'burse2')
					nullPosition =  (this.canvas.width - this._chartGutter._left - this._chartGutter._right)/(this._otherProps._background_grid_autofit_numvlines)*this._otherProps._background_grid_autofit_numvlines;
				else if(0 == numNull)
					nullPosition = 0;
				else
					nullPosition =  (this.canvas.width - this._chartGutter._left - this._chartGutter._right)/(this._otherProps._background_grid_autofit_numvlines)*numNull;
				
				
				context.moveTo(AA(this, OfficeExcel.GetWidth(this) - this._chartGutter._right - nullPosition), this._chartGutter._top);
				context.lineTo(AA(this, OfficeExcel.GetWidth(this) - this._chartGutter._right - nullPosition), OfficeExcel.GetHeight(this) - this._chartGutter._bottom + 1);
				this.nullPositionOX = OfficeExcel.GetWidth(this) - this._chartGutter._right - nullPosition;
					
					
					//context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
					//context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
			}
			else if (this._otherProps._yaxispos == 'left') {
				context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
				context.lineTo(AA(this, this._chartGutter._left), OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
			} else {
				context.moveTo(AA(this, OfficeExcel.GetWidth(this) - this._chartGutter._right), this._chartGutter._top);
				context.lineTo(AA(this, OfficeExcel.GetWidth(this) - this._chartGutter._right), OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
			}
		}

        // Draw the X axis
		if(!this._otherProps._noxaxis)
		{
			if (this._otherProps._xaxis) {
				if (this._otherProps._xaxispos == 'center') {
					context.moveTo(this._chartGutter._left, AA(this, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) / 2)));
					context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2)));
				} 
				else if('auto' == this._otherProps._ylabels_count)
				{
					//определяем куда ставить ось
					var numNull = this._otherProps._background_grid_autofit_numhlines;
					/*var arrTemp = []
					var k = 0;
					for (var j=0; j < this.data.length; j++) {
						for (var i=0; i<this.data[j].length; i++)
						{
							arrTemp[k] = this.data[j][i][1];
							k++;
						}
					}
					min = Math.min.apply(null, arrTemp);
					max = Math.max.apply(null, arrTemp);*/
					if(this._otherProps._type == 'burse2')
					{
						ymin = min;
						ymax = max;
					}
					
					if(ymin >= 0 && ymax >= 0)
					{
						numNull = 0;
					}
					else if(ymin <= 0 && ymax <= 0)
					{
						numNull = this._otherProps._background_grid_autofit_numhlines;
					}
					else
					{
						for (var i=0; i<this.scale.length; i++)
						{
							if(this.scale[i] == 0)
							{
								numNull = i;
								break;
							}
						}
					}
					var nullPosition;
					
					if(0 == numNull)
						nullPosition =  0;
					else
						nullPosition =  (this.canvas.height - this._chartGutter._bottom - this._chartGutter._top)/(this._otherProps._background_grid_autofit_numhlines)*numNull;
					context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
					context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
					this.nullPositionOY = this.canvas.height - this._chartGutter._bottom - nullPosition;
				}
				else 
				{
					context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
					context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));
				}
			}
		}
        /**
        * Draw the Y tickmarks
        */
		if(!this._otherProps._noyaxis)
		{
			var numyticks = this._otherProps._numyticks;

			for (y=this._chartGutter._top,countTick = 0; y <= this.canvas.height - this._chartGutter._bottom + 1 + (this._otherProps._xaxispos == 'center' ? 1 : 0) ; y+=(graphHeight / numyticks),countTick++) {

				// This is here to accomodate the X axis being at the center
				//if (y == (this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2)) ) continue;
				if(countTick == numyticks)
					y = this.canvas.height - this._chartGutter._bottom;
			   // if (this._otherProps._yaxispos == 'left') {
					context.moveTo(this.nullPositionOX, AA(this, y));
					context.lineTo(this.nullPositionOX - 3, AA(this, y));
				/*} else {
					context.moveTo(this.nullPositionOX +3, AA(this, y));
					context.lineTo(this.nullPositionOX, AA(this, y));
				}*/
				
				/**
				* Draw an extra tick if the X axis isn't being shown
				*/
				if (this._otherProps._xaxis == false && this._otherProps._noendytick == false) {
					this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
					this.context.lineTo(this._chartGutter._left - 3, AA(this, this.canvas.height - this._chartGutter._bottom));
				}
			}
		}

        /**
        * Draw the X tickmarks
        */
		if(!this._otherProps._noxaxis)
		{
			 if('auto' == this._otherProps._ylabels_count)
			{
				var x = this._chartGutter._left;
				var yStart = this.nullPositionOY;
				var yEnd   = this.nullPositionOY + 5;
				for (var j=0; j <= this._otherProps._background_grid_autofit_numvlines; j++) 
				{
					var newX = x + ((this.canvas.width - this._chartGutter._right - this._chartGutter._left)/(this._otherProps._background_grid_autofit_numvlines))*j;
					if(j == this._otherProps._background_grid_autofit_numvlines)
						newX = this.canvas.width - this._chartGutter._right;
					this.context.moveTo(AA(this, newX), yStart);
					this.context.lineTo(AA(this, newX), yEnd);
				}
			}
			else if (this._otherProps._xticks && this._otherProps._xaxis) {
				var x  = 0;
				var y  =  (this._otherProps._xaxispos == 'center') ? this._chartGutter._top + (this.grapharea / 2): (this.canvas.height - this._chartGutter._bottom);
				this.xTickGap = (this.Get('chart.labels') && this.Get('chart.labels').length) ? ((this.canvas.width - this.gutterLeft - this.gutterRight ) / this.Get('chart.labels').length) : (this.canvas.width - this.gutterLeft - this.gutterRight) / 10;


				for (x =  (this._chartGutter._left + (this._otherProps._yaxispos == 'left' ? this.xTickGap : 0) );
					 x <= (this.canvas.width - this._chartGutter._right - (this._otherProps._yaxispos == 'left' ? -1 : 1));
					 x += this.xTickGap) {

					if (this._otherProps._yaxispos == 'left' && this._otherProps._noendxtick == true && x == (this.canvas.width - this._chartGutter._right) ) {
						continue;
					} else if (this._otherProps._yaxispos == 'right' && this._otherProps._noendxtick == true && x == this._chartGutter._left) {
						continue;
					}

					context.moveTo(AA(this, x), y - (this._otherProps._xaxispos == 'center' ? 3 : 0));
					context.lineTo(AA(this, x), y + 3);
				}

			}
		}
        context.stroke();
    }











    /**
    * Draws the labels on the scatter graph
    */
    OfficeExcel.Scatter.prototype.DrawLabels = function (xScale,isFormatCell,isformatCellScOy)
    {
        this.context.fillStyle = this._otherProps._text_color;
        var font       = this._otherProps._ylabels_font;
        var xMin       = this._otherProps._xmin;
        var xMax       = this._otherProps._xmax;
        var yMax       = this.scale[this.scale.length - 1];
        var yMin       = this._otherProps._ymin;
        var text_size  = this._otherProps._ylabels_size;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
        var numYLabels = this._otherProps._ylabels_count;
        var invert     = this._otherProps._ylabels_invert;
        var inside     = this._otherProps._ylabels_inside;
        var context    = this.context;
        var canvas     = this.canvas;
        var boxed      = false;

        this.halfTextHeight = text_size / 2;

            
        this.halfGraphHeight = (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2;

        /**
        * Draw the Y yaxis labels, be it at the top or center
        */
        if (this._otherProps._ylabels) {

            var xPos  = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : OfficeExcel.GetWidth(this) - this._chartGutter._right + 5;
            var align = this._otherProps._yaxispos == 'right' ? 'left' : 'right';
			var bold 	   = this._otherProps._ylabels_bold;
			var textOptions =
			{
				color: this._otherProps._ylabels_color,
				underline: this._otherProps._ylabels_underline,
				italic: this._otherProps._ylabels_italic
			}	
			
            if (inside) {
                if (this._otherProps._yaxispos == 'left') {
                    xPos  = this._chartGutter._left + 5;
                    align = 'left';
                    boxed = true;
                } else {
                    xPos  = this.canvas.width - this._chartGutter._right - 5;
                    align = 'right';
                    boxed = true;
                }
            }

            if (this._otherProps._xaxispos == 'center') {


                /**
                * Specific Y labels
                */
                 if('auto' == numYLabels)
                {
                     for (var i=0; i<this.scale.length; ++i) {
                        OfficeExcel.Text(context,font,text_size,this.nullPositionOX - 10,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText(this.scale[this.scale.length -1 - i],isformatCellScOy),null,align,bounding,null,bgcolor, bold, null, textOptions);
                    }
                }
                else
                {
                    if (typeof(this._otherProps._ylabels_specific) == 'object' && this._otherProps._ylabels_specific != null && this._otherProps._ylabels_specific.length) {

                        var labels = this._otherProps._ylabels_specific;
                        
                        if (this._otherProps._ymin > 0) {
                            labels = [];
                            for (var i=0; i<(this._otherProps._ylabels_specific.length - 1); ++i) {
                                labels.push(this._otherProps._ylabels_specific[i]);
                            }
                        }

                        for (var i=0; i<labels.length; ++i) {
                            var y = this._chartGutter._top + (i * (this.grapharea / (labels.length * 2) ) );
                            OfficeExcel.Text(context, font, text_size, xPos, y, labels[i], 'center', align, boxed, null, null, bold, null, textOptions);
                        }
                        
                        var reversed_labels = OfficeExcel.array_reverse(labels);
                    
                        for (var i=0; i<reversed_labels.length; ++i) {
                            var y = this._chartGutter._top + (this.grapharea / 2) + ((i+1) * (this.grapharea / (labels.length * 2) ) );
                            OfficeExcel.Text(context,font, text_size, xPos, y, reversed_labels[i], 'center', align, boxed, null, null, bold, null, textOptions);
                        }

                        if (this._otherProps._ymin > 0) {
                            OfficeExcel.Text(context, font, text_size, xPos, (this.grapharea / 2) + this._chartGutter._top, this._otherProps._ylabels_specific[this._otherProps._ylabels_specific.length - 1], 'center', align, boxed, null, bold, null, textOptions);
                        }

                        return;
                    }


                    if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                        // Draw the top halves labels
                        OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top, OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                        
                        
                        if (numYLabels >= 5) {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (1/10) ), OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (3/10) ), OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), 'center', align, boxed, null, null, bold, null, textOptions);
                        }
            
                        if (numYLabels >= 3) {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (2/10) ), OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (4/10) ), OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                        }
                        
                        // Draw the bottom halves labels
                        if (numYLabels >= 3) {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (1/10) ) + this.halfGraphHeight, '-' + OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (3/10) ) + this.halfGraphHeight, '-' + OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                        }
            
                        if (numYLabels == 5) {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (2/10) ) + this.halfGraphHeight, '-' + OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (4/10) ) + this.halfGraphHeight, '-' + OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                        }
            
                        OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (5/10) ) + this.halfGraphHeight, '-' + OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                    
                    } else if (numYLabels == 10) {
                        // 10 Y labels
                        var interval = (this.grapharea / numYLabels) / 2;
                    
                        for (var i=0; i<numYLabels; ++i) {
                            OfficeExcel.Text(context, font, text_size, xPos,this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (i/20) ),OfficeExcel.number_format(this,(this.max - (this.max * (i/10))).toFixed(this._otherProps._scale_decimals),units_pre, units_post),'center', align, boxed, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos,this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (i/20) ) + (this.grapharea / 2) + (this.grapharea / 20),'-' + OfficeExcel.number_format(this, ((this.max * (i/10)) + (this.max * (1/10))).toFixed((this._otherProps._scale_decimals)), units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                        }

                    } else {
                        alert('[SCATTER SCALE] Number of Y labels can be 1/3/5/10 only');
                    }
        
                }

            } 
            else if (this._otherProps._xaxispos == 'top' && 'auto' == numYLabels)
            {
                  var scale = OfficeExcel.array_reverse(this.scale);
                    /*var elemArr;
                    for (var i=0; i<this.scale.length; ++i) {
                        elemArr = (scale[scale.length  - i])
                        if(0 == i)
                            elemArr = scale[scale.length - 1] - (scale[scale.length - 2] - scale[scale.length - 1])
                        OfficeExcel.Text(context,font,text_size,xpos,this._chartGutter._top + this.halfTextHeight + ((i/scale.length) * (this.grapharea) ),-elemArr,null,align,bounding,null,bgcolor);
                    }*/
                 //var xpos       = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : this.canvas.width - this._chartGutter._right + 5;
                var xpos = 12;
                var align      = this._otherProps._yaxispos == 'left' ? 'right' : 'left';
				align = 'right';
                      for (var i=0; i<this.scale.length; ++i) {
                        var elemArr;
                        elemArr = (scale[scale.length  - i - 1])
                        //if(0 == i)
                            //elemArr = scale[scale.length - 1] - (scale[scale.length - 2] - scale[scale.length - 1])
						if(elemArr == 0)
							OfficeExcel.Text(context,font,text_size,this.nullPositionOX - xpos,this._chartGutter._top + this.halfTextHeight + ((i/(this.scale.length - 1)) * (this.grapharea) ),OfficeExcel.numToFormatText(elemArr.toString(),isformatCellScOy),null,align,null, boxed, null, bold, null, textOptions);
						else
							OfficeExcel.Text(context,font,text_size,this.nullPositionOX - xpos,this._chartGutter._top + this.halfTextHeight + ((i/(this.scale.length - 1)) * (this.grapharea) ),OfficeExcel.numToFormatText("-" + elemArr.toString(),isformatCellScOy),null,align,null, boxed, null, bold, null, textOptions);
                    }
            }
            else {
                
                var xPos  = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : this.canvas.width - this._chartGutter._right + 5;
                var align = this._otherProps._yaxispos == 'right' ? 'left' : 'right';

                if (inside) {
                    if (this._otherProps._yaxispos == 'left') {
                        xPos  = this._chartGutter._left + 5;
                        align = 'left';
                        boxed = true;
                    } else {
                        xPos  = this.canvas.width - this._chartGutter._right - 5;
                        align = 'right';
                        boxed = true;
                    }
                }
                /**
                * Specific Y labels
                */
                
                
                
                if('auto' == numYLabels)
                {
                     align = 'right';
					 for (var i=0; i<this.scale.length; ++i) {
                        OfficeExcel.Text(context,font,text_size,this.nullPositionOX - 10,this._chartGutter._top + this.halfTextHeight + ((i/(this.scale.length - 1)) * (this.grapharea) ),OfficeExcel.numToFormatText(this.scale[this.scale.length -1 - i],isformatCellScOy),null,align,null,boxed, null, bold, null, textOptions);
                         //OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (4/5) ), this.scale[this.scale.length -1 - i], 'center', align, boxed);
                    }
                }
                else
                {
                    if (typeof(this._otherProps._ylabels_specific) == 'object' && this._otherProps._ylabels_specific) {

                        var labels = this._otherProps._ylabels_specific;
                        
                        // Lose the last label
                        if (this._otherProps._ymin > 0) {
                            labels = [];
                            for (var i=0; i<(this._otherProps._ylabels_specific.length - 1); ++i) {
                                labels.push(this._otherProps._ylabels_specific[i]);
                            }
                        }

                        for (var i=0; i<labels.length; ++i) {
                            var y = this._chartGutter._top + (i * (this.grapharea / labels.length) );
                            
                            OfficeExcel.Text(context, font, text_size, xPos, y, labels[i], 'center', align, boxed, null, bold, null, textOptions);
                        }

                        if (this._otherProps._ymin > 0) {
                            OfficeExcel.Text(context, font, text_size, xPos, this.canvas.height - this._chartGutter._bottom, this._otherProps._ylabels_specific[this._otherProps._ylabels_specific.length - 1], 'center', align, boxed, null,bold, null, textOptions);
                        }

                        return;
                    }

                    if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                        if (invert) {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top, OfficeExcel.number_format(this, 0, units_pre, units_post), 'center', align, boxed, null, null, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) * (5/5) ), OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
            
                            if (numYLabels >= 5) {
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (2/5) ), OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (4/5) ), OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            }
            
                            if (numYLabels >= 3) {
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (3/5) ), OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (1/5) ), OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            }
                        } else {
                            OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top, OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), 'center', align, boxed, null, null, bold, null, textOptions);
            
                            if (numYLabels >= 5) {
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (1/5) ), OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (3/5) ), OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            }
            
                            if (numYLabels >= 3) {
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (2/5) ), OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                                OfficeExcel.Text(context, font, text_size, xPos, this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (4/5) ), OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), 'center', align, boxed, null, bold, null, textOptions);
                            }
                        }
                    } else if (numYLabels == 10) {
                        var interval = (this.grapharea / numYLabels) / 2;
                        if (invert) {
                            for (var i=numYLabels; i>=0; --i) {
                                OfficeExcel.Text(context, font, text_size, xPos,this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * ((10-i)/10) ),OfficeExcel.number_format(this,(this.max - (this.max * (i/10))).toFixed((this._otherProps._scale_decimals)), units_pre, units_post),'center', align, boxed, null, bold, null, textOptions);
                            }
                        } else {
                            // 10 Y labels
                            for (var i=0; i<numYLabels; ++i) {

                                OfficeExcel.Text(context, font, text_size, xPos,this._chartGutter._top + ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) * (i/10) ),OfficeExcel.number_format(this, (this.max - ((this.max - this.min) * (i/10))).toFixed((this._otherProps._scale_decimals)), units_pre, units_post),'center', align, boxed, null, bold, null, textOptions);
                            }
                        }
                    } else {
                        alert('[SCATTER SCALE] Number of Y labels can be 1/3/5/10 only');
                    }
                    
                    if (this._otherProps._ymin) {
                        OfficeExcel.Text(context, font, text_size, xPos, this.canvas.height - this._chartGutter._bottom,OfficeExcel.number_format(this, this._otherProps._ymin.toFixed(this._otherProps._scale_decimals), units_pre, units_post),'center', align, boxed, null, bold, null, textOptions);
                    }
                }

            }
        }




        /**
        * Draw an X scale
        */
		var bold 	   = this._otherProps._xlabels_bold;
		var textOptions =
		{
			color: this._otherProps._xlabels_color,
			underline: this._otherProps._xlabels_underline,
			italic: this._otherProps._xlabels_italic
		}	
		var scaleFactor = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scaleFactor = OfficeExcel.drawingCtxCharts.scaleFactor;
		var offsetY = 15*scaleFactor;
		font = this._otherProps._xlabels_font;
		text_size = this._otherProps._xlabels_size;
        if('auto' == this._otherProps._ylabels_count && this._otherProps._xlabels)
        {
            if(this._otherProps._yaxispos == 'right')
            {
                var scale = OfficeExcel.array_reverse(xScale);

                var numXLabels = scale.length;
                var interval     = (this.canvas.width - this._chartGutter._left - this._chartGutter._right ) / (numXLabels - 1);
                var y            = this.canvas.height - this._chartGutter._bottom + 5 + (text_size / 2);
                var units_pre_x  = this._otherProps._scale_units_pre;
                var units_post_x = this._otherProps._scale_units_post;


                if (!this._otherProps._xmax) {
                    var xmax = 0;
                    
                    for (var ds=0; ds<this.data.length; ++ds) {
                        for (var point=0; point<this.data[ds].length; ++point) {
                            xmax = Math.max(xmax, this.data[ds][point][0]);
                        }
                    }

                    //this._otherProps._xmax = OfficeExcel.getScale(xmax)[4];
                }


                for (var i=0; i<numXLabels; ++i) {
                
                    var num  = ( (this._otherProps._xmax - this._otherProps._xmin) * ((i+1) / numXLabels)) + this._otherProps._xmin;
                    var x    = this._chartGutter._left + ((i) * interval);

                    if (typeof(this._otherProps._scale_formatter) == 'function') {
                        var text = this._otherProps._scale_formatter(this, num);
                    } else {
                        var text = scale[i];
                    }
					if(text == 0)
						OfficeExcel.Text(context, font, text_size, x, this.nullPositionOY + offsetY,OfficeExcel.numToFormatText(text.toString(),isFormatCell), 'center', 'center', false, null, null, bold, null, textOptions);
					else
						OfficeExcel.Text(context, font, text_size, x, this.nullPositionOY + offsetY, "-" + OfficeExcel.numToFormatText(text.toString(),isFormatCell), 'center', 'center', false, null, null, bold, null, textOptions);
                }
                
                
                
            }
            else
            {
                var numXLabels   = xScale.length - 1;
                if(this._otherProps._type == 'burse2')
                    numXLabels   = xScale.length;
                var interval     = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / numXLabels;
                var y            = this.canvas.height - this._chartGutter._bottom + 5 + (text_size / 2);
                var units_pre_x  = this._otherProps._xscale_units_pre;
                var units_post_x = this._otherProps._xscale_units_post;


                if (!this._otherProps._xmax) {
                    var xmax = 0;
                    
                    for (var ds=0; ds<this.data.length; ++ds) {
                        for (var point=0; point<this.data[ds].length; ++point) {
                            xmax = Math.max(xmax, this.data[ds][point][0]);
                        }
                    }

                    this._otherProps._xmax = OfficeExcel.getScale(xmax)[4];
                }

                if(this._otherProps._type == 'burse2')
                    numXLabels   = numXLabels - 1;
                for (var i=0; i<=numXLabels; ++i) {
                
                    var num  = ( (this._otherProps._xmax - this._otherProps._xmin) * ((i) / numXLabels)) + this._otherProps._xmin;
                    
                    if(this._otherProps._type == 'burse2')
                        var x    = this._chartGutter._left + ((this.canvas.width - this._chartGutter._left - this._chartGutter._right)/(this._otherProps._xmax*2)) + ((i) * interval);
                    else
                        var x    = this._chartGutter._left + ((i) * interval);

                    if (typeof(this._otherProps._xscale_formatter) == 'function') {
                        var text = this._otherProps._xscale_formatter(this, num);
                    } else {
                        var text = xScale[i];
                    }

                    OfficeExcel.Text(context, font, text_size, x, this.nullPositionOY + offsetY, OfficeExcel.numToFormatText(text.toString(),isFormatCell), 'center', 'center', false, null, null, bold, null, textOptions);
                }
            }
           
        }
        else if (this._otherProps._xscale && this._otherProps._xlabels) {

            var numXLabels   = this._otherProps._xscale_numlabels;
            var interval     = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / numXLabels;
            var y            = this.canvas.height - this._chartGutter._bottom + 5 + (text_size / 2);
            var units_pre_x  = this._otherProps._xscale_units_pre;
            var units_post_x = this._otherProps._xscale_units_post;


            if (!this._otherProps._xmax) {
                var xmax = 0;
                
                for (var ds=0; ds<this.data.length; ++ds) {
                    for (var point=0; point<this.data[ds].length; ++point) {
                        xmax = Math.max(xmax, this.data[ds][point][0]);
                    }
                }

                this._otherProps._xmax = OfficeExcel.getScale(xmax)[4];
            }


            for (var i=0; i<numXLabels; ++i) {
            
                var num  = ( (this._otherProps._xmax - this._otherProps._xmin) * ((i+1) / numXLabels)) + this._otherProps._xmin;
                var x    = this._chartGutter._left + ((i+1) * interval);

                if (typeof(this._otherProps._xscale_formatter) == 'function') {
                    var text = this._otherProps._xscale_formatter(this, num);
                } else {
                    var text = OfficeExcel.number_format(this,
                                                    num.toFixed(this._otherProps._scale_decimals),
                                                    units_pre_x,
                                                    units_post_x);
                }

                OfficeExcel.Text(context, font, text_size, x, y, text, 'center', 'center', false, null, null, bold, null, textOptions);
            }

        /**
        * Draw X labels
        */
        } else if(this._otherProps._xlabels){
            // Put the text on the X axis
            var graphArea = this.canvas.width - this._chartGutter._left - this._chartGutter._right;
            var xInterval = graphArea / this._otherProps._labels.length;
            var xPos      = this._chartGutter._left;
            var yPos      = (this.canvas.height - this._chartGutter._bottom) + 15;
            var labels    = this._otherProps._labels;
    
            /**
            * Text angle
            */
            var angle  = 0;
            var valign = null;
            var halign = 'center';
    
            if (this._otherProps._text_angle > 0) {
                angle  = -1 * this._otherProps._text_angle;
                valign = 'center';
                halign = 'right';
                yPos -= 10;
            }
    
            for (i=0; i<labels.length; ++i) {
                
                if (typeof(labels[i]) == 'object') {
                
                    if (this._otherProps._labels_specific_align == 'center') {
                        var rightEdge = 0;
    
                        if (labels[i+1] && labels[i+1][1]) {
                            rightEdge = labels[i+1][1];
                        } else {
                            rightEdge = this._otherProps._xmax;
                        }
                        
                        var offset = (rightEdge - labels[i][1]) / 2;
    
                    } else {
                        var offset = 0;
                    }
                
    
                    OfficeExcel.Text(context,
                                font,
                                this._otherProps._text_size,
                        this._chartGutter._left + (graphArea * ((labels[i][1] - xMin + offset) / (this._otherProps._xmax - xMin))) + 5,
                                yPos,
                                String(labels[i][0]),
                                valign,
                                angle != 0 ? 'right' : (this._otherProps._labels_specific_align == 'center' ? 'center' : 'left'),
                                null,
                                angle, null, bold, null, textOptions
                               );
                    
                    /**
                    * Draw the gray indicator line
                    */
                    this.context.beginPath();
                        this.context.strokeStyle = '#bbb';
                        this.context.moveTo(AA(this, this._chartGutter._left + (graphArea * ((labels[i][1] - xMin)/ (this._otherProps._xmax - xMin)))), OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
                        this.context.lineTo(AA(this, this._chartGutter._left + (graphArea * ((labels[i][1] - xMin)/ (this._otherProps._xmax - xMin)))), OfficeExcel.GetHeight(this) - this._chartGutter._bottom + 20);
                    this.context.stroke();
                
                } else {
                    OfficeExcel.Text(context, font, this._otherProps._text_size, xPos + (this.xTickGap / 2), yPos, String(labels[i]), valign, halign, null, angle, null, bold, null, textOptions);
                }
                
                // Do this for the next time around
                xPos += xInterval;
            }
    
            /**
            * Draw the final indicator line
            */
            if (typeof(labels[0]) == 'object') {
                this.context.beginPath();
                    this.context.strokeStyle = '#bbb';
                    this.context.moveTo(this._chartGutter._left + graphArea, OfficeExcel.GetHeight(this) - this._chartGutter._bottom);
                    this.context.lineTo(this._chartGutter._left + graphArea, OfficeExcel.GetHeight(this) - this._chartGutter._bottom + 20);
                this.context.stroke();
            }
        }
    }














    /**
    * Draws the actual scatter graph marks
    * 
    * @param i integer The dataset index
    */
    OfficeExcel.Scatter.prototype.DrawMarks = function (i)
    {
        /**
        *  Reset the coords array
        */
        this.coords[i] = [];

        /**
        * Plot the values
        */
        var xmax          = this._otherProps._xmax;
        var default_color = this._otherProps._defaultcolor;

        for (var j=0; j<this.data[i].length; ++j) {
            /**
            * This is here because tooltips are optional
            */
            var data_point = this.data[i];

            var xCoord = data_point[j][0];
            var yCoord = data_point[j][1];
			var color;
			if(this._otherProps._colors[i])
				color = this._otherProps._colors[i];
			else
				color = data_point[j][2] ? data_point[j][2] : default_color
            var tooltip = (data_point[j] && data_point[j][3]) ? data_point[j][3] : null;
			if(yCoord.toString() == "" || xCoord.toString() == "")
			{
				this.coords[i][j] = [];
				this.coords[i][j][0] = '';
				this.coords[i][j][1] = '';
				this.coords[i][j][2] = null;
			}
            else if(!(this._otherProps._type == 'burse2' && this.data[i][j] != undefined && this.data[i][j][1] != undefined && this.data[i][j][1][0] == 0 && this.data[i][j][1][1] == 0 && this.data[i][j][1][2] == 0 && this.data[i][j][1][3] == 0))
				this.DrawMark(
                          i,
                          xCoord,
                          yCoord,
                          xmax,
                          this.max,
                          color,
                          tooltip,
                          this.coords[i],
                          data_point
                         );
        }
    }


    /**
    * Draws a single scatter mark
    */
    OfficeExcel.Scatter.prototype.DrawMark = function (index, x, y, xMax, yMax, color, tooltip, coords, data)
    {
        /**
        * Inverted Y scale handling
        */
        if (this._otherProps._ylabels_invert) {
            if (typeof(y) == 'number') {
                y = yMax - y;
            }
        }

        var tickmarks = this._otherProps._tickmarks;
        var tickSize  = this._otherProps._ticksize;
        var xMin      = this._otherProps._xmin;
        var x = ((x - xMin) / (xMax - xMin)) * (this.canvas.width - this._chartGutter._left - this._chartGutter._right);
        var originalX = x;
        var originalY = y;
        
        
        /**
        * This allows tickmarks to be an array
        */

        if (tickmarks && typeof(tickmarks) == 'object') {
            tickmarks = tickmarks[index];
        }


        /**
        * This allows ticksize to be an array
        */
        if (typeof(tickSize) == 'object') {
            var tickSize     = tickSize[index];
            var halfTickSize = tickSize / 2;
        } else {
            var halfTickSize = tickSize / 2;
        }


        /**
        * This bit is for boxplots only
        */
        if (   typeof(y) == 'object'
            && typeof(y[0]) == 'number'
            && typeof(y[1]) == 'number'
            && typeof(y[2]) == 'number'
            && typeof(y[3]) == 'number'
            && typeof(y[4]) == 'number'
           ) {

            var yMin = this._otherProps._ymin ? this._otherProps._ymin : 0;
            this._otherProps._boxplot = true;
            this.graphheight = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
            
            if (this._otherProps._xaxispos == 'center') {
                this.graphheight /= 2;
            }

            var y0 = (this.graphheight) - ((y[4] - yMin) / (yMax - yMin)) * (this.graphheight);
            var y1 = (this.graphheight) - ((y[3] - yMin) / (yMax - yMin)) * (this.graphheight);
            var y2 = (this.graphheight) - ((y[2] - yMin) / (yMax - yMin)) * (this.graphheight);
            var y3 = (this.graphheight) - ((y[1] - yMin) / (yMax - yMin)) * (this.graphheight);
            var y4 = (this.graphheight) - ((y[0] - yMin) / (yMax - yMin)) * (this.graphheight);
            
            /**
            * Inverted labels
            */
            if (this._otherProps._ylabels_invert) {
                y0 = this.graphheight - y0;
                y1 = this.graphheight - y1;
                y2 = this.graphheight - y2;
                y3 = this.graphheight - y3;
                y4 = this.graphheight - y4;
            }

            var col1  = y[5];
            var col2  = y[5];
			if(this._otherProps._type == 'burse2' && y[1] && y[3] && y[3] < y[1])
				 col2  = y[6];

            // Override the boxWidth
            if (typeof(y[7]) == 'number') {
                var boxWidth = y[7];
            }

            var y = this.graphheight - y2;

        } else {
            var yMin = this._otherProps._ymin ? this._otherProps._ymin : 0;
            var y = (( (y - yMin) / (yMax - yMin)) * (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom));
        }

        /**
        * Account for the X axis being at the centre
        */
        if (this._otherProps._xaxispos == 'center') {
            y /= 2;
            y += this.halfGraphHeight;
        }

        // This is so that points are on the graph, and not the gutter
        x += this._chartGutter._left;
        y = this.canvas.height - this._chartGutter._bottom - y;

        this.context.beginPath();
        
        // Color
        this.context.strokeStyle = color;

        /**
        * Boxplots
        */
        if (   this._otherProps._boxplot
            && typeof(y0) == 'number'
            && typeof(y1) == 'number'
            && typeof(y2) == 'number'
            && typeof(y3) == 'number'
            && typeof(y4) == 'number'
           ) {

            var boxWidth = this._otherProps._boxplot_width;

            // boxWidth is now a scale value, so convert it to a pixel vlue
            boxWidth = (boxWidth / this._otherProps._xmax) * (this.canvas.width -this._chartGutter._left - this._chartGutter._right);

            var halfBoxWidth = boxWidth / 2;


            // Now draw the whiskers
            this.context.beginPath();
            if (this._otherProps._boxplot_capped) {
                this.context.moveTo(x - halfBoxWidth, AA(this, y0 + this._chartGutter._top));
                this.context.lineTo(x + halfBoxWidth, AA(this, y0 + this._chartGutter._top));
            }

            this.context.moveTo(AA(this, x), y0 + this._chartGutter._top);
            this.context.lineTo(AA(this, x), y1 + this._chartGutter._top);

            if (this._otherProps._boxplot_capped) {
                this.context.moveTo(x - halfBoxWidth, AA(this, y4 + this._chartGutter._top));
                this.context.lineTo(x + halfBoxWidth, AA(this, y4 + this._chartGutter._top));
            }

            this.context.moveTo(AA(this, x), y4 + this._chartGutter._top);
            this.context.lineTo(AA(this, x), y3 + this._chartGutter._top);

            this.context.stroke();
            
            this.context.beginPath();
				this.context.fillStyle = col2;
				this.context.fillRect(x - halfBoxWidth, y1 + this._chartGutter._top, boxWidth, y3 - y1);
				if(!g_bChartPreview)
					this.context.strokeRect(x - halfBoxWidth, y1 + this._chartGutter._top, boxWidth, y3 - y1);
                // Draw the upper coloured box if a value is specified
                /*if (col1) {
                    this.context.fillStyle = col1;
                    this.context.fillRect(x - halfBoxWidth, y1 + this._chartGutter._top, boxWidth, y2 - y1);
                }
    
                // Draw the lower coloured box if a value is specified
                if (col2) {
                    this.context.fillStyle = col2;
                    this.context.fillRect(x - halfBoxWidth, y2 + this._chartGutter._top, boxWidth, y3 - y2);
                }*/
            this.context.stroke();
        }


        /**
        * Draw the tickmark, but not for boxplots
        */
        if (!y0 && !y1 && !y2 && !y3 && !y4) {
            
            this.graphheight = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;


            
            if (tickmarks == 'circle') {
                this.context.arc(x, y, halfTickSize, 0, 6.28, 0);
                this.context.fillStyle = color;
                this.context.fill();
            
            } else if (tickmarks == 'plus') {

                this.context.moveTo(x, y - halfTickSize);
                this.context.lineTo(x, y + halfTickSize);
                this.context.moveTo(x - halfTickSize, y);
                this.context.lineTo(x + halfTickSize, y);
                this.context.stroke();
            
            } else if (tickmarks == 'square') {
                this.context.strokeStyle = color;
                this.context.fillStyle = color;
                this.context.fillRect(
                                      x - halfTickSize,
                                      y - halfTickSize,
                                      tickSize,
                                      tickSize
                                     );
                //this.context.fill();

            } else if (tickmarks == 'cross') {

                this.context.moveTo(x - halfTickSize, y - halfTickSize);
                this.context.lineTo(x + halfTickSize, y + halfTickSize);
                this.context.moveTo(x + halfTickSize, y - halfTickSize);
                this.context.lineTo(x - halfTickSize, y + halfTickSize);
                
                this.context.stroke();
            
            /**
            * Diamond shape tickmarks
            */
            } else if (tickmarks == 'diamond') {
                this.context.fillStyle = this.context.strokeStyle;

                this.context.moveTo(x, y - halfTickSize);
                this.context.lineTo(x + halfTickSize, y);
                this.context.lineTo(x, y + halfTickSize);
                this.context.lineTo(x - halfTickSize, y);
                this.context.lineTo(x, y - halfTickSize);
                
                this.context.fill();
                this.context.stroke();

            /**
            * Custom tickmark style
            */
            } else if (typeof(tickmarks) == 'function') {

                var graphWidth = OfficeExcel.GetWidth(this) - this._chartGutter._left - this._chartGutter._right
                var xVal = ((x - this._chartGutter._left) / graphWidth) * xMax;
                var yVal = ((this.graphheight - (y - this._chartGutter._top)) / this.graphheight) * yMax;

                tickmarks(this, data, x, y, xVal, yVal, xMax, yMax, color)

            /**
            * No tickmarks
            */
            } else if (tickmarks == null) {
    
            /**
            * Unknown tickmark type
            */
            } else {
                alert('[SCATTER] (' + this.id + ') Unknown tickmark style: ' + tickmarks );
            }
        }

        /**
        * Add the tickmark to the coords array
        */
        if (   this._otherProps._boxplot
            && typeof(y0) == 'number'
            && typeof(y1) == 'number'
            && typeof(y2) == 'number'
            && typeof(y3) == 'number'
            && typeof(y4) == 'number') {

            x = [x - halfBoxWidth, x + halfBoxWidth];
            y = [y0 + this._chartGutter._top, y1 + this._chartGutter._top, y2 + this._chartGutter._top, y3 + this._chartGutter._top, y4 + this._chartGutter._top];

        }

        coords.push([x, y, tooltip]);
    }
    
    
    /**
    * Draws an optional line connecting the tick marks.
    * 
    * @param i The index of the dataset to use
    */
    OfficeExcel.Scatter.prototype.DrawLine = function (i)
    {
        if (this._otherProps._line && this.coords[i].length >= 2) {

            this.context.lineCap     = 'round';
            this.context.lineJoin    = 'round';
            //this.context.lineWidth   = this.GetLineWidth(i);// i is the index of the set of coordinates
            this.context.lineWidth = 3;
            this.context.strokeStyle = this._otherProps._colors[i];
            this.context.beginPath();
            
            var len = this.coords[i].length;

            for (var j=0; j<this.coords[i].length; ++j) {

					var xPos = this.coords[i][j][0];
					var yPos = this.coords[i][j][1];
					//для вычисления среднего
					/*var summ = 0;
					if(typeof this.coords[i][j][0] == "object")
					{
						for(var k = 0; k < this.coords[i][j][0].length; k++)
						{
							summ += this.coords[i][j][0][k];
						}
						if(summ != 0)
							xPos = summ/this.coords[i][j][0].length;
					}
					var summ = 0;
					if(typeof this.coords[i][j][1] == "object")
					{
						for(var k = 0; k < this.coords[i][j][1].length; k++)
						{
							summ += this.coords[i][j][1][k];
						}
						if(summ != 0)
							yPos = summ/this.coords[i][j][1].length;
					}*/
						
					if (j == 0) {
						this.context.moveTo(xPos, yPos);
					} else {
					
						// Stepped?
						var stepped = this._otherProps._line_stepped;

						if (   (typeof(stepped) == 'boolean' && stepped)
							|| (typeof(stepped) == 'object' && stepped[i])
						   ) {
								this.context.lineTo(this.coords[i][j][0], this.coords[i][j - 1][1]);
						}
						if(xPos.toString() != "" && yPos.toString() != "" && this.coords[i][j - 1][0].toString() != "" && this.coords[i][j - 1][1].toString() != "")
						{
								this.context.lineTo(xPos, yPos);
						}
						else if(xPos.toString() != "" && yPos.toString() != "")
							this.context.moveTo(xPos, yPos);
							
						//else 
							//this.context.moveTo(xPos, yPos);
					}
				
            }
            
            this.context.stroke();
        }
        
        /**
        * Set the linewidth back to 1
        */
        this.context.lineWidth = 1;
    }


    /**
    * Returns the linewidth
    * 
    * @param number i The index of the "line" (/set of coordinates)
    */
    OfficeExcel.Scatter.prototype.GetLineWidth = function (i)
    {
        var linewidth = this._otherProps._line_linewidth;
        
        if (typeof(linewidth) == 'number') {
            return linewidth;
        
        } else if (typeof(linewidth) == 'object') {
            if (linewidth[i]) {
                return linewidth[i];
            } else {
                return linewidth[0];
            }

            alert('[SCATTER] Error! linewidth should be a single number or an array of one or more numbers');
        }
    }


    /**
    * Draws vertical bars. Line chart doesn't use a horizontal scale, hence this function
    * is not common
    */
    OfficeExcel.Scatter.prototype.DrawVBars = function ()
    {
        var canvas  = this.canvas;
        var context = this.context;
        var vbars = this._otherProps._background_vbars;
        var graphWidth = OfficeExcel.GetWidth(this) - this._chartGutter._left - this._chartGutter._right;
        
        if (vbars) {
        
            var xmax = this._otherProps._xmax;

            for (var i=0; i<vbars.length; ++i) {
                var startX = ((vbars[i][0] / xmax) * graphWidth) + this._chartGutter._left;
                var width  = (vbars[i][1] / xmax) * graphWidth;

                context.beginPath();
                    context.fillStyle = vbars[i][2];
                    context.fillRect(startX, this._chartGutter._top, width, (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom));
                context.fill();
            }
        }
    }





    /**
    * Draws in-graph labels.
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Scatter.prototype.DrawInGraphLabels = function (obj)
    {
        var canvas  = obj.canvas;
        var context = obj.context;
        var labels  = obj._otherProps._labels_ingraph;
        var labels_processed = [];

        // Defaults
        var fgcolor   = 'black';
        var bgcolor   = 'white';
        var direction = 1;

        if (!labels) {
            return;
        }

        /**
        * Preprocess the labels array. Numbers are expanded
        */
        for (var i=0; i<labels.length; ++i) {
            if (typeof(labels[i]) == 'number') {
                for (var j=0; j<labels[i]; ++j) {
                    labels_processed.push(null);
                }
            } else if (typeof(labels[i]) == 'string' || typeof(labels[i]) == 'object') {
                labels_processed.push(labels[i]);
            
            } else {
                labels_processed.push('');
            }
        }

        /**
        * Turn off any shadow
        */
        OfficeExcel.NoShadow(obj);

        if (labels_processed && labels_processed.length > 0) {

            var i=0;

            for (var _set=0; _set<obj.coords.length; ++_set) {
                for (var point = 0; point<obj.coords[_set].length; ++point) {
                    if (labels_processed[i]) {
                        var x = obj.coords[_set][point][0];
                        var y = obj.coords[_set][point][1];
                        var length = typeof(labels_processed[i][4]) == 'number' ? labels_processed[i][4] : 25;
                            
                        var text_x = x;
                        var text_y = y - 5 - length;

                        context.moveTo(x, y - 5);
                        context.lineTo(x, y - 5 - length);
                        
                        context.stroke();
                        context.beginPath();
                        
                        // This draws the arrow
                        context.moveTo(x, y - 5);
                        context.lineTo(x - 3, y - 10);
                        context.lineTo(x + 3, y - 10);
                        context.closePath();


                        context.beginPath();
                            
                            // Fore ground color
                            context.fillStyle = (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][1]) == 'string') ? labels_processed[i][1] : 'black';

                            OfficeExcel.Text(context,
                                        obj._otherProps._text_font,
                                        obj._otherProps._text_size,
                                        text_x,
                                        text_y,
                                        (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][0]) == 'string') ? labels_processed[i][0] : labels_processed[i],
                                        'bottom',
                                        'center',
                                        true,
                                        null,
                                        (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][2]) == 'string') ? labels_processed[i][2] : 'white');
                        context.fill();
                    }
                    
                    i++;
                }
            }
        }
    }


    /**
    * This function makes it much easier to get the (if any) point that is currently being hovered over.
    * 
    * @param object e The event object
    */
    OfficeExcel.Scatter.prototype.getPoint = function (e)
    {
        var canvas      = e.target;
        var obj         = canvas.__object__;
        var context     = obj.context;
        var mouseXY     = OfficeExcel.getMouseXY(e);
        var mouseX      = mouseXY[0];
        var mouseY      = mouseXY[1];
        var overHotspot = false;
        var offset = obj._tooltip._hotspot;

        for (var _set=0; _set<obj.coords.length; ++_set) {
            for (var i=0; i<obj.coords[_set].length; ++i) {

                var xCoord = obj.coords[_set][i][0];
                var yCoord = obj.coords[_set][i][1];

                if (typeof(yCoord) == 'number') {
                    if (mouseX <= (xCoord + offset) &&
                        mouseX >= (xCoord - offset) &&
                        mouseY <= (yCoord + offset) &&
                        mouseY >= (yCoord - offset)) {
                        
                        return [xCoord, yCoord, _set, i, obj.data[_set][i][3]];
                    }
                } else {

                    var mark = obj.data[_set][i];


                    /**
                    * Determine the width
                    */
                    var width = obj._otherProps._boxplot_width;
                    
                    if (typeof(mark[1][7]) == 'number') {
                        width = mark[1][7];
                    }

                    if (   typeof(xCoord) == 'object'
                        && mouseX > xCoord[0]
                        && mouseX < xCoord[1]
                        && mouseY < yCoord[3]
                        && mouseY > yCoord[1]
                        ) {

                        return [[xCoord[0], xCoord[1] - xCoord[0]], [yCoord[1], yCoord[3] - yCoord[1]], _set, i, obj.data[_set][i][3]];
                    }
                }
            }
        }
    }


    /**
    * Draws the above line labels
    */
    OfficeExcel.Scatter.prototype.DrawAboveLabels = function (format)
    {
        var context    = this.context;
        var size       = this._otherProps._labels_above_size;
        var font       = this._otherProps._text_font;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
		var bold 	   = this._otherProps._labels_above_bold;
		var textOptions =
		{
			color: this._otherProps._labels_above_color,
			underline: this._otherProps._labels_above_underline,
			italic: this._otherProps._labels_above_italic
		}	
        context.strokeStyle = 'black';
        context.fillStyle = 'black';


        for (var _set=0; _set<this.coords.length; ++_set) {
            for (var point=0; point<this.coords[_set].length; ++point) {
                
                var x_val = this.data[_set][point][0];
                var y_val = this.data[_set][point][1];
                
                
                var x_pos = this.coords[_set][point][0];
                var y_pos = this.coords[_set][point][1];

                OfficeExcel.Text(context,
                            font,
                            size,
                            x_pos,
                            y_pos - 5 - size,
                            //x_val.toFixed(this._otherProps._labels_above_decimals) + ', ' + y_val.toFixed(this._otherProps._labels_above_decimals),
							OfficeExcel.numToFormatText(OfficeExcel.num_round(y_val),format),
                            'center',
                            'center',
                            false,//рамка
                            null,
                            'rgba(255, 255, 255, 0.7)', bold, null, textOptions);
            }
        }
    }


    /**
    * When you click on the chart, this method can return the Y value at that point. It works for any point on the
    * chart (that is inside the gutters) - not just points within the Bars.
    * 
    * @param object e The event object
    */
    OfficeExcel.Scatter.prototype.getValue = function (arg)
    {
        if (arg.length == 2) {
            var mouseX = arg[0];
            var mouseY = arg[1];
        } else {
            var mouseCoords = OfficeExcel.getMouseXY(arg);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
        }
        var obj = this;
        
        if (   mouseY < obj._chartGutter._top
            || mouseY > (obj.canvas.height - obj._chartGutter._bottom)
            || mouseX < this._chartGutter._left
            || mouseX > (obj.canvas.width - this._chartGutter._right)
           ) {
            return null;
        }
        
        if (obj._otherProps._xaxispos == 'center') {
            var value = (((obj.grapharea / 2) - (mouseY - obj._chartGutter._top)) / obj.grapharea) * (obj.max - obj.min)
            value *= 2;
            if (value >= 0) {
                value += obj.min
            } else {
                value -= obj.min
            }
        } else {
            var value = ((obj.grapharea - (mouseY - obj._chartGutter._top)) / obj.grapharea) * (obj.max - obj.min)
            value += obj.min;
        }

        return value;
    }