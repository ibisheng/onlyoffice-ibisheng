    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    OfficeExcel.Line = function (chartCanvas, data)
    {
        // Get the canvas and context objects
        this.id                = null;
        this.canvas            = chartCanvas ? chartCanvas : document.getElementById(id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'line';
        this.max               = 0;
        this.coords            = [];
        this.coords2           = [];
        this.coordsKey         = [];
        this.hasnegativevalues = false;
        this.isOfficeExcel     = true;
		this.data = data;
        // Check for support
        if (!this.canvas) {
            alert('[LINE] Fatal error: no canvas support');
            return;
        }

        // Compatibility canvas browser
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

        // Change null arguments to empty arrays
        for (var i = 1; i < arguments.length; ++i) {
            if ('null' == typeof(arguments[i]) || !arguments[i])
                arguments[i] = [];
        }

        // Store the original data.
        this.original_data = [];

        for (var i = 1; i < arguments.length; ++i) {
            if (arguments[i] && 'object' == typeof(arguments[i]) && arguments[i][0] && 'object' == typeof(arguments[i][0]) && arguments[i][0].length) {

                var tmp = [];

                for (var j = 0; j < arguments[i].length; ++j)
                    tmp[j] = OfficeExcel.array_clone(arguments[i][j]);

                for (var j = 0; j < tmp.length; ++j)
                    this.original_data[this.original_data.length] = OfficeExcel.array_clone(tmp[j]);

            } else
                this.original_data[this.original_data.length] = OfficeExcel.array_clone(arguments[i]);
        }

        /**
        * Store the data here as one big array
        */
        this.data_arr = [];

        for (var i=1; i<arguments.length; ++i) {
            for (var j=0; j<arguments[i].length; ++j) {
                this.data_arr.push(arguments[i][j]);
            }
        }
    }

    // Draw the line chart
    OfficeExcel.Line.prototype.Draw = function (min,max,ymin,ymax,isSkip,isFormatCell)
    {
        // MUST be the FIRST thing done - Hand over drawing to the bar chart if it's a combo back to the Bar chart
        if (this.__bar__ && !arguments[0]) {
            this.__bar__.Draw();
            return;
        }

        // MUST be the SECOND thing done!
        /*if (typeof(this._otherProps._background_image) == 'string' && !this.__background_image__) {
            OfficeExcel.DrawBackgroundImage(this);
            return;
        }*/
        if (typeof(this._otherProps._background_image) == 'string' && !this.__background_image__) {
            OfficeExcel.DrawBackgroundImage1(this,mainBackground);
            return;
        }
        if (this.__bar__ && this._tooltip._highlight) {
            //this._tooltip._highlight = false;
        }

        // Fire onbeforedraw
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        // Clear all Listeners
        //OfficeExcel.ClearEventListeners(this.id);

        // Reset the data back to that which was initially supplied
        this.data = OfficeExcel.array_clone(this.original_data);

        // Reset max
        this.max = 0;

        if (this._otherProps._filled && !this._otherProps._filled_range && this.data.length > 1 && this._otherProps._filled_accumulative) {

            var accumulation = [];

            for (var _set = 0; _set < this.data.length; ++_set) {
                for (var point = 0; point < this.data[_set].length; ++point) {
                    this.data[_set][point] = Number(accumulation[point] ? accumulation[point] : 0) + this.data[_set][point];
                    accumulation[point] = this.data[_set][point];
                }
            }
        }

        // Max y
        //if('auto' != this._otherProps._ylabels_count)
            if (this._otherProps._ymax && this.scale) {

                this.max = this._otherProps._ymax;
                this.min = this._otherProps._ymin ? this._otherProps._ymin : 0;

                /*this.scale = [
                              (((this.max - this.min) * (1/5)) + this.min).toFixed(this._otherProps._scale_decimals),
                              (((this.max - this.min) * (2/5)) + this.min).toFixed(this._otherProps._scale_decimals),
                              (((this.max - this.min) * (3/5)) + this.min).toFixed(this._otherProps._scale_decimals),
                              (((this.max - this.min) * (4/5)) + this.min).toFixed(this._otherProps._scale_decimals),
                              this.max.toFixed(this._otherProps._scale_decimals)
                             ];*/

                // Check for negative values
                if (!this._otherProps._outofbounds) {
                    for (var dataset = 0; dataset < this.data.length; ++dataset) {
                        for (var datapoint = 0; datapoint < this.data[dataset].length; ++datapoint) {
                            // Check for negative values
                            this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;
                        }
                    }
                }

            } else {

                this.min = this._otherProps._ymin ? this._otherProps._ymin : 0;

                // Work out the max Y value
                //for (var dataset = 0; dataset < this.data.length; ++dataset) {
                    //for (var datapoint = 0; datapoint < this.data[dataset].length; ++datapoint) {

                        this.max = max;

                        // Check for negative values
                        /*if (!this._otherProps._outofbounds)
                            this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;*/
                    //}
               // }

                this.scale = OfficeExcel.getScale(Math.abs(parseFloat(this.max)),this,min,max);
                //this.max   = this.scale[4] ? this.scale[4] : 0;
                if('auto' == this._otherProps._ylabels_count)
                {
                    var lengSc = this.scale.length;
                    this.max = this.scale[lengSc -1];
                    this.min = this._otherProps._ymin;
                    this._otherProps._background_grid_autofit_numhlines = lengSc;
                    this._otherProps._numyticks = lengSc;
                }
                else if (this._otherProps._ymin) {
                    this.scale[0] = ((this.max - this._otherProps._ymin) * (1/5)) + this._otherProps._ymin;
                    this.scale[1] = ((this.max - this._otherProps._ymin) * (2/5)) + this._otherProps._ymin;
                    this.scale[2] = ((this.max - this._otherProps._ymin) * (3/5)) + this._otherProps._ymin;
                    this.scale[3] = ((this.max - this._otherProps._ymin) * (4/5)) + this._otherProps._ymin;
                    this.scale[4] = ((this.max - this._otherProps._ymin) * (5/5)) + this._otherProps._ymin;
                }

                else if (typeof(this._otherProps._scale_decimals) == 'number') {
                    /*for (var i = 0; i < lengSc;i++) {
                        this.scale[i] = Number(this.scale[i]).toFixed(this._otherProps._scale_decimals);
                    }*/
                    this.scale[0] = Number(this.scale[0]).toFixed(this._otherProps._scale_decimals);
                    this.scale[1] = Number(this.scale[1]).toFixed(this._otherProps._scale_decimals);
                    this.scale[2] = Number(this.scale[2]).toFixed(this._otherProps._scale_decimals);
                    this.scale[3] = Number(this.scale[3]).toFixed(this._otherProps._scale_decimals);
                    this.scale[4] = Number(this.scale[4]).toFixed(this._otherProps._scale_decimals);
                }
            }

        // Reset coords
        this.coords = [];

        this.grapharea      = this.canvas.height - this._chartGutter._top - this._chartGutter._bottom;
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this._otherProps._text_size / 2;

        // Check the combination of the X axis position and if there any negative values
        //
        // 19th Dec 2010 - removed for Opera since it can be reported incorrectly whn there
        // are multiple graphs on the page
        if ('auto' != this._otherProps._ylabels_count && this._otherProps._xaxispos == 'bottom' && this.hasnegativevalues && navigator.userAgent.indexOf('Opera') == -1) {
            alert('[LINE] You have negative values and the X axis is at the bottom. This is not good...');
        }
        
        //Draw Area
		OfficeExcel.background.DrawArea(this);
        
        // Draw 3D
        if (this._otherProps._variant == '3d')
            OfficeExcel.Draw3DAxes(this);

        // Progressively Draw the chart
        OfficeExcel.background.Draw (this);

        // Draw Bars
        if (this._otherProps._background_hbars && this._otherProps._background_hbars.length > 0)
            OfficeExcel.DrawBars(this);

        // Draw Axes
        if (this._otherProps._axesontop == false)
            this.DrawAxes(min,max);
        
        // Shadow Color
        var shadowColor = this._shadow._color;

        for (var i = 0, j = 0; i < this.data.length; ++i, ++j) {
            this.context.beginPath();

            // Shadow
            if (this._shadow._visible && !this._otherProps._filled) {
                // Shadow Color
                if (typeof(shadowColor) == 'object' && shadowColor[i - 1])
                    this.context.shadowColor = shadowColor[i];
                else if (typeof(shadowColor) == 'object')
                    this.context.shadowColor = shadowColor[0];
                else if (typeof(shadowColor) == 'string')
                    this.context.shadowColor = shadowColor;

                this.context.shadowBlur    = this._shadow._blur;
                this.context.shadowOffsetX = this._shadow._offset_x;
                this.context.shadowOffsetY = this._shadow._offset_y;

            } else if (this._otherProps._filled && this._shadow._visible)
                alert('[LINE] Shadows are not permitted when the line is filled');

            // Draw line
            var fill = null;
            if (this._otherProps._fillstyle) {
                if (typeof(this._otherProps._fillstyle) == 'object' && this._otherProps._fillstyle[j])
                    fill = this._otherProps._fillstyle[j];
                else if (typeof(this._otherProps._fillstyle) == 'string')
                    fill = this._otherProps._fillstyle;
                else
                    alert('[LINE] Warning: fillstyle must be either a string or an array with the same number of elements as you have sets of data');
            } else if (this._otherProps._filled)
                fill = this._otherProps._colors[j];

            // tickmarks
            var tickmarks = null;
            if (this._otherProps._tickmarks && typeof(this._otherProps._tickmarks) == 'object')
                tickmarks = this._otherProps._tickmarks[i];
            else if (this._otherProps._tickmarks && typeof(this._otherProps._tickmarks) == 'string')
                tickmarks = this._otherProps._tickmarks;
            else if (this._otherProps._tickmarks && typeof(this._otherProps._tickmarks) == 'function')
                tickmarks = this._otherProps._tickmarks;
            
			//var isSkip = false;
            if(this._otherProps._filled == true && (this._otherProps._autoGrouping == 'stacked' || this._otherProps._autoGrouping == 'stackedPer'))
			{
				var k = 0;
				if(!isSkip[i])
					this.DrawLine(this.data[this.data.length - 1 - i], 'inherit', this._otherProps._colors[this._otherProps._colors.length - 1- j], this.GetLineWidth(j), tickmarks, i);
			}  
            else
			{
				if(!isSkip[i])
					this.DrawLine(this.data[i], this._otherProps._colors[j], fill, this.GetLineWidth(j), tickmarks, i);
			}

            this.context.stroke();
        }

        /**
        * If the line is filled re-stroke the lines
        */
        if (this._otherProps._filled && this._otherProps._filled_accumulative) {

            for (var i=0; i<this.coords2.length; ++i) {

                this.context.beginPath();
                this.context.lineWidth = this.GetLineWidth(i);
                this.context.strokeStyle = this._otherProps._colors[i];

                for (var j=0; j<this.coords2[i].length; ++j) {

                    if (j == 0 || this.coords2[i][j][1] == null || (this.coords2[i][j - 1] && this.coords2[i][j - 1][1] == null)) {
                        this.context.moveTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                    } else {
                        if (this._otherProps._stepped) {
                            this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j - 1][1]);
                        }
                        this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j][1]);
                    }
                }

                this.context.stroke();
                // No fill!
            }

            //Redraw the tickmarks
            if (this._otherProps._tickmarks) {

                this.context.beginPath();

                this.context.fillStyle = 'white';

                for (var i = 0; i < this.coords2.length; ++i) {
                    this.context.beginPath();
                    this.context.strokeStyle = this._otherProps._colors[i];
                    for (var j = 0; j < this.coords2[i].length; ++j) {
                        if (typeof(this.coords2[i][j]) == 'object' && typeof(this.coords2[i][j][0]) == 'number' && typeof(this.coords2[i][j][1]) == 'number') {

                            var tickmarks = typeof(this._otherProps._tickmarks) == 'object' ? this._otherProps._tickmarks[i] : this._otherProps._tickmarks;

                            this.DrawTick ( this.coords2[i][j],
                                            this.coords2[i][j][0],
                                            this.coords2[i][j][1],
                                            this.context.strokeStyle,
                                            false,
                                            j == 0 ? 0 : this.coords2[i][j - 1][0],
                                            j == 0 ? 0 : this.coords2[i][j - 1][1],
                                            tickmarks,
                                            j);
                        }
                    }
                }

                this.context.stroke();
                this.context.fill();
            }
        }

        // Install mouse listeners
        OfficeExcel.InstallUserClickListener(this, this._otherProps._events_click);
        OfficeExcel.InstallUserMousemoveListener(this, this._otherProps._events_mousemove);

        // Install tooltips
        if (this._tooltip._tooltips && (this._tooltip._tooltips.length || typeof(this._tooltip._tooltips) == 'function')) {

            // Register to redraw
            if (this._tooltip._highlight)
                OfficeExcel.Register(this);

            OfficeExcel.PreLoadTooltipImages(this);

            OfficeExcel.InstallLineTooltipEventListeners(this);

            // If there's a bar, install bar listeners
            if (this.__bar__)
                OfficeExcel.InstallBarTooltipEventListeners(this.__bar__);
        }

        // Draw Axes if on top
        if (this._otherProps._axesontop)
            this.DrawAxes(min,max);

        // Draw the labels
        this.DrawLabels(isFormatCell);

        // Draw range
        this.DrawRange();

        // Draw keys
        if (this._otherProps._key.length)
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);

        // Draw above labels
        if (this._otherProps._labels_above)
            this.DrawAboveLabels(isFormatCell);

        // Draw in graph labels
        OfficeExcel.DrawInGraphLabels(this);

        // Draw crosschairs
        OfficeExcel.DrawCrosshairs(this);

        // Redraw the lines if a filled range is on the cards
        if (this._otherProps._filled && this._otherProps._filled_range && this.data.length == 2) {

            this.context.beginPath();
            var len = this.coords.length / 2;
            this.context.lineWidth = this._otherProps._linewidth;
            this.context.strokeStyle = this._otherProps._colors[0];

            for (var i=0; i<len; ++i) {
                if (i == 0)
                    this.context.moveTo(this.coords[i][0], this.coords[i][1]);
                else
                    this.context.lineTo(this.coords[i][0], this.coords[i][1]);
            }

            this.context.stroke();


            this.context.beginPath();

            if (this._otherProps._colors[1])
                this.context.strokeStyle = this._otherProps._colors[1];

            for (var i=this.coords.length - 1; i>=len; --i) {
                if (i == (this.coords.length - 1) )
                    this.context.moveTo(this.coords[i][0], this.coords[i][1]);
                else
                    this.context.lineTo(this.coords[i][0], this.coords[i][1]);
            }

            this.context.stroke();
        } else if (this._otherProps._filled && this._otherProps._filled_range)
            alert('[LINE] You must have only two sets of data for a filled range chart');

        // Adjustments
        if (this._otherProps._adjustable)
            OfficeExcel.AllowAdjusting(this);

        // Ondraw event
        OfficeExcel.FireCustomEvent(this, 'ondraw');
    }

    
    
    // Draws the axes
    OfficeExcel.Line.prototype.DrawAxes = function (min,max)
    {
        // Don't draw the axes?
        if (this._otherProps._noaxes)
            return;

        // Turn any shadow off
        OfficeExcel.NoShadow(this);

        this.context.lineWidth   = 1;
        this.context.lineCap = 'butt';
        this.context.strokeStyle = this._otherProps._axis_color;
        this.context.beginPath();

        // Draw the X axis
        
		if('auto' == this._otherProps._ylabels_count && this._otherProps._xaxispos)
		{
			//определяем куда ставить ось
			var numNull = this._otherProps._background_grid_autofit_numhlines;
			var arrTemp = []
			var k = 0;
			for (var j=0; j < this.data.length; j++) {
				for (var i=0; i<this.data[j].length; i++)
				{
					arrTemp[k] = this.data[j][i];
					k++;
				}
			}
			//min = Math.min.apply(null, arrTemp);
			//max = Math.max.apply(null, arrTemp);
			if(min >= 0 && max >= 0)
			{
				numNull = 0;
			}
			else if(min <= 0 && max <= 0)
			{
				numNull = this._otherProps._background_grid_autofit_numhlines;
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
				nullPosition =  0;
			else
				nullPosition =  (this.canvas.height - this._chartGutter._bottom - this._chartGutter._top)/(this._otherProps._background_grid_autofit_numhlines)*numNull;
			if (this._otherProps._noxaxis == false) {
				this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
				this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
			}
			
			this.nullPositionOX = this.canvas.height - this._chartGutter._bottom - nullPosition;
		}
		else if (this._otherProps._xaxispos == 'center') {
			this.context.moveTo(this._chartGutter._left, AA(this, (this.grapharea / 2) + this._chartGutter._top));
			this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, (this.grapharea / 2) + this._chartGutter._top));
		} else if (this._otherProps._xaxispos == 'top') {
			this.context.moveTo(this._chartGutter._left, AA(this, this._chartGutter._top));
			this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this._chartGutter._top));
		} else {
			this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
			this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));
		}

        // Draw the Y axis
        if (this._otherProps._noyaxis == false) {
            if (this._otherProps._yaxispos == 'left') {
                this.context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
                this.context.lineTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom + 1);
            } else {
                this.context.moveTo(AA(this, this.canvas.width - this._chartGutter._right), this._chartGutter._top);
                this.context.lineTo(AA(this, this.canvas.width - this._chartGutter._right), this.canvas.height - this._chartGutter._bottom);
            }
        }

        // Draw X tickmarks
		if(!this._otherProps._noxaxis)
		{
			if('auto' == this._otherProps._ylabels_count)
			{
				var x = this._chartGutter._left;
				var yStart = this.nullPositionOX;
				var yEnd   = this.nullPositionOX + 5;
				for (var j=0; j <= this._otherProps._background_grid_autofit_numvlines; j++) 
				{
					var newX = x + ((this.canvas.width - this._chartGutter._right - this._chartGutter._left)/(this._otherProps._background_grid_autofit_numvlines))*j;
					this.context.moveTo(AA(this, newX), yStart);
					this.context.lineTo(AA(this, newX), yEnd);
				}
			}
			else if (this._otherProps._noxaxis == false) {
				var xTickInterval;
				if (this.data[0].length > 0)
					xTickInterval = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / (this._otherProps._xticks ? this._otherProps._xticks : (this.data[0].length - 1));

				if (!xTickInterval || xTickInterval <= 0)
					xTickInterval = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / (this._otherProps._labels && this._otherProps._labels.length ? this._otherProps._labels.length - 1 : 10);

				for (var x = this._chartGutter._left + (this._otherProps._yaxispos == 'left' ? xTickInterval : 0); x <= (this.canvas.width - this._chartGutter._right + 1 ); x += xTickInterval) {

					if (this._otherProps._yaxispos == 'right' && x >= (this.canvas.width - this._chartGutter._right - 1) )
						break;

					// If the last tick is not desired...
					if (this._otherProps._noendxtick) {
						if (this._otherProps._yaxispos == 'left' && x >= (this.canvas.width - this._chartGutter._right))
							break;
						else if (this._otherProps._yaxispos == 'right' && x == this._chartGutter._left)
							continue;
					}

					var yStart = this._otherProps._xaxispos == 'center' ? (this._chartGutter._top + (this.grapharea / 2)) - 3 : this.canvas.height - this._chartGutter._bottom;
					var yEnd = this._otherProps._xaxispos == 'center' ? yStart + 6 : this.canvas.height - this._chartGutter._bottom - (x % 60 == 0 ? this._otherProps._largexticks * this._otherProps._tickdirection : this._otherProps._smallxticks * this._otherProps._tickdirection);

					if (this._otherProps._xaxispos == 'center') {
						yStart = AA(this, (this._chartGutter._top + (this.grapharea / 2))) - 3;
						yEnd = yStart + 6;

					} else if (this._otherProps._xaxispos == 'bottom') {
						yStart = this.canvas.height - this._chartGutter._bottom;
						yEnd  = this.canvas.height - this._chartGutter._bottom - (x % 60 == 0 ? this._otherProps._largexticks * this._otherProps._tickdirection : this._otherProps._smallxticks * this._otherProps._tickdirection);
							yEnd += 0.5;


					} else if (this._otherProps._xaxispos == 'top') {
						yStart = this._chartGutter._top - 3;
						yEnd   = this._chartGutter._top;
					}
		
					this.context.moveTo(AA(this, x), yStart);
					this.context.lineTo(AA(this, x), yEnd);
				}
			} else if (this._otherProps._noyaxis == false) {
				if (this._otherProps._yaxispos == 'left') {
					this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom));
					this.context.lineTo(this._chartGutter._left - this._otherProps._smallyticks, AA(this, this.canvas.height - this._chartGutter._bottom));
				} else {
					this.context.moveTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom));
					this.context.lineTo(this.canvas.width - this._chartGutter._right + this._otherProps._smallyticks, AA(this, this.canvas.height - this._chartGutter._bottom));
				}
			}
		}
        // Draw Y tickmarks
        var numyticks = this._otherProps._numyticks;

        if (this._otherProps._noyaxis == false) {
            var adjustment = 0;

            if (this._otherProps._yaxispos == 'right')
                adjustment = (this.canvas.width - this._chartGutter._left - this._chartGutter._right);

            // X axis at the center
            if (this._otherProps._xaxispos == 'center') {
                var interval = (this.grapharea / numyticks);
                var lineto = (this._otherProps._yaxispos == 'left' ? this._chartGutter._left : this.canvas.width - this._chartGutter._right + this._otherProps._smallyticks);

                // Draw the upper halves Y tick marks
                for (y=this._chartGutter._top; y < (this.grapharea / 2) + this._chartGutter._top; y+=interval) {
                    this.context.moveTo((this._otherProps._yaxispos == 'left' ? this._chartGutter._left - this._otherProps._smallyticks : this.canvas.width - this._chartGutter._right), AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }

                // Draw the lower halves Y tick marks
                for (var y = this._chartGutter._top + (this.halfgrapharea) + interval; y <= this.grapharea + this._chartGutter._top; y += interval) {
                    this.context.moveTo((this._otherProps._yaxispos == 'left' ? this._chartGutter._left - this._otherProps._smallyticks : this.canvas.width - this._chartGutter._right), AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }
            // X axis at the top
            } else if (this._otherProps._xaxispos == 'top') {
                var interval = (this.grapharea / numyticks);
                var lineto = (this._otherProps._yaxispos == 'left' ? this._chartGutter._left : this.canvas.width - this._chartGutter._right + this._otherProps._smallyticks);

                // Draw the Y tick marks
                //for (var y = this._chartGutter._top + interval; y <= this.grapharea + this._chartGutter._top; y += interval) {
				for (var y = this._chartGutter._top,counter = 0 ; y <= this.grapharea + this._chartGutter._top + 2; y += interval, ++counter) {
					 if(counter == numyticks)
							y = this.canvas.height - this._chartGutter._bottom;
                    this.context.moveTo((this._otherProps._yaxispos == 'left' ? this._chartGutter._left - this._otherProps._smallyticks : this.canvas.width - this._chartGutter._right), AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }

                // If there's no X axis draw an extra tick
                if (this._otherProps._noxaxis) {
                    this.context.moveTo((this._otherProps._yaxispos == 'left' ? this._chartGutter._left - this._otherProps._smallyticks : this.canvas.width - this._chartGutter._right), this._chartGutter._top);
                    this.context.lineTo(lineto, this._chartGutter._top);
                }
            // X axis at the bottom
            } else {
                var lineto = (this._otherProps._yaxispos == 'left' ? this._chartGutter._left - this._otherProps._smallyticks : this.canvas.width - this._chartGutter._right + this._otherProps._smallyticks);

                for (var y = this._chartGutter._top, counter = 0; y <= (this.canvas.height - this._chartGutter._bottom) + 2 && counter <= numyticks; y += ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / numyticks), ++counter) {
                    if(counter == numyticks)
						y = this.canvas.height - this._chartGutter._bottom;
					this.context.moveTo(this._chartGutter._left + adjustment, AA(this, y));
                    this.context.lineTo(lineto, AA(this, y));
                }
            }

			// Draw an extra X tickmark
			 /*else if (this._otherProps._noxaxis == false) {

				if (this._otherProps._yaxispos == 'left') {
					this.context.moveTo(this._chartGutter._left, this._otherProps._xaxispos == 'top' ? this._chartGutter._top : this.canvas.height - this._chartGutter._bottom);
					this.context.lineTo(this._chartGutter._left, this._otherProps._xaxispos == 'top' ? this._chartGutter._top - this._otherProps._smallxticks : this.canvas.height - this._chartGutter._bottom + _otherProps._smallxticks);
			   } else {
					this.context.moveTo(this.canvas.width - this._chartGutter._right, this.canvas.height - this._chartGutter._bottom);
					this.context.lineTo(this.canvas.width - this._chartGutter._right, this.canvas.height - this._chartGutter._bottom + this._otherProps._smallxticks);
				}
			}*/
		}	
        this.context.stroke();
    }


    // Draw the text labels for the axes
    OfficeExcel.Line.prototype.DrawLabels = function (isFormatCell)
    {
        this.context.strokeStyle = 'black';
        this.context.fillStyle   = this._otherProps._text_color;
        this.context.lineWidth   = 1;
		var scaleFactor = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scaleFactor = OfficeExcel.drawingCtxCharts.scaleFactor;

        // Turn off any shadow
        OfficeExcel.NoShadow(this);

        // This needs to be here
        var font      = this._otherProps._ylabels_font;
        var text_size = this._otherProps._ylabels_size;
        var context   = this.context;
        var canvas    = this.canvas;
		var bold 	   = this._otherProps._ylabels_bold;
		var textOptions =
		{
			color: this._otherProps._ylabels_color,
			underline:this._otherProps._ylabels_underline,
			italic: this._otherProps._ylabels_italic
		}		

        // Draw the Y axis labels
        if (this._otherProps._ylabels && this._otherProps._ylabels_specific == null) {

            var units_pre  = this._otherProps._units_pre;
            var units_post = this._otherProps._units_post;
            var xpos       = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : this.canvas.width - this._chartGutter._right + 5;
            var align      = this._otherProps._yaxispos == 'left' ? 'right' : 'left';

            var numYLabels = this._otherProps._ylabels_count;
            var bounding   = false;
            var bgcolor    = this._otherProps._ylabels_inside ? this._otherProps._ylabels_inside_color : null;	


            /**
            * If the Y labels are inside the Y axis, invert the alignment
            */
            if (this._otherProps._ylabels_inside == true && align == 'left') {
                xpos -= 10;
                align = 'right';
                bounding = true;


            } else if (this._otherProps._ylabels_inside == true && align == 'right') {
                xpos += 10;
                align = 'left';
                bounding = true;
            }



            if (this._otherProps._xaxispos == 'center') {
                var half = this.grapharea / 2;
                if('auto' == numYLabels)
                {
                     for (var i=0; i<this.scale.length; ++i) {
                        OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),this.scale[this.scale.length -1 - i],null,align,bounding,null,bgcolor, bold, null, textOptions);
                    }
                }
                else
                {
                    if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                    //  Draw the upper halves labels
                    OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (0/5) * half ) + this.halfTextHeight, OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);

                    if (numYLabels == 5) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (1/5) * half ) + this.halfTextHeight, OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (3/5) * half ) + this.halfTextHeight, OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    if (numYLabels >= 3) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (2/5) * half ) + this.halfTextHeight, OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (4/5) * half ) + this.halfTextHeight, OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    //  Draw the lower halves labels
                    if (numYLabels >= 3) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (6/5) * half ) + this.halfTextHeight, '-' + OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (8/5) * half ) + this.halfTextHeight, '-' + OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    if (numYLabels == 5) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (7/5) * half ) + this.halfTextHeight, '-' + OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (9/5) * half ) + this.halfTextHeight, '-' + OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + ( (10/5) * half ) + this.halfTextHeight, '-' + OfficeExcel.number_format(this, (this.scale[4] == '1.0' ? '1.0' : this.scale[4]), units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);

                    } else if (numYLabels == 10) {

                    // 10 Y labels
                    var interval = (this.grapharea / numYLabels) / 2;

                    for (var i=0; i<numYLabels; ++i) {
                        // This draws the upper halves labels
                        OfficeExcel.Text(context,font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((i/20) * (this.grapharea) ), OfficeExcel.number_format(this, ((this.scale[4] / numYLabels) * (numYLabels - i)).toFixed((this._otherProps._scale_decimals)),units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);

                        // And this draws the lower halves labels
                        OfficeExcel.Text(context, font, text_size, xpos,

                            this._chartGutter._top + this.halfTextHeight + ((i/20) * this.grapharea) + (this.grapharea / 2) + (this.grapharea / 20),

                        '-' + OfficeExcel.number_format(this, (this.scale[4] - ((this.scale[4] / numYLabels) * (numYLabels - i - 1))).toFixed((this._otherProps._scale_decimals)),units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    } else {
                        alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                    }
                    if (typeof(this._otherProps._ymin) == 'number') {
                    OfficeExcel.Text(context, font, text_size, xpos, this.canvas.height / 2, OfficeExcel.number_format(this, this._otherProps._ymin.toFixed(this._otherProps._scale_decimals), units_pre, units_post), 'center', align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                // No X axis - so draw 0
                    if (this._otherProps._noxaxis == true) {
                        OfficeExcel.Text(context,font,text_size,xpos,this._chartGutter._top + ( (5/5) * half ) + this.halfTextHeight,this._otherProps._units_pre + '0' + this._otherProps._units_post,null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }
                }
                

                

            // X axis at the top
            } else if (this._otherProps._xaxispos == 'top') {
                
                 if('auto' == numYLabels)
                {
                    var scale = OfficeExcel.array_reverse(this.scale);
                    /*var elemArr;
                    for (var i=0; i<this.scale.length; ++i) {
                        elemArr = (scale[scale.length  - i])
                        if(0 == i)
                            elemArr = scale[scale.length - 1] - (scale[scale.length - 2] - scale[scale.length - 1])
                        OfficeExcel.Text(context,font,text_size,xpos,this._chartGutter._top + this.halfTextHeight + ((i/scale.length) * (this.grapharea) ),-elemArr,null,align,bounding,null,bgcolor);
                    }*/
                      for (var i=0; i<=this.scale.length; ++i) {
                        var elemArr;
                        elemArr = (scale[scale.length  - i])
                        if(0 == i)
						{
							var floatKoff = 100000000000;
							elemArr = Math.round(OfficeExcel.array_exp(scale[scale.length - 1] - (scale[scale.length - 2] - scale[scale.length - 1]))*floatKoff)/floatKoff ;
						}
						if(elemArr == 0)
							OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText(elemArr.toString(),isFormatCell),null,align,bounding,null,bgcolor, bold, null, textOptions);
						else
							OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText("-" + elemArr.toString(),isFormatCell),null,align,bounding,null,bgcolor, bold, null, textOptions);
					}
                }
                else
                {
                      var scale = OfficeExcel.array_reverse(this.scale);

                    /**
                    * Accommodate reversing the Y labels
                    */
                    if (this._otherProps._ylabels_invert) {

                        scale = OfficeExcel.array_reverse(scale);

                        this.context.translate(0, this.grapharea * -0.2);
                        if (typeof(this._otherProps._ymin) == null) {
                            this._otherProps._ymin = 0;
                        }
                    }

                    if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((1/5) * (this.grapharea ) ), '-' + OfficeExcel.number_format(this, scale[4], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);

                        if (numYLabels == 5) {
                            OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((4/5) * (this.grapharea) ), '-' + OfficeExcel.number_format(this, scale[1], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((2/5) * (this.grapharea) ), '-' + OfficeExcel.number_format(this, scale[3], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        }

                        if (numYLabels >= 3) {
                            OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((3/5) * (this.grapharea ) ), '-' + OfficeExcel.number_format(this, scale[2], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                            OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((5/5) * (this.grapharea) ), '-' + OfficeExcel.number_format(this, scale[0], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        }

                    } else if (numYLabels == 10) {

                        // 10 Y labels
                        var interval = (this.grapharea / numYLabels) / 2;

                        for (var i=0; i<numYLabels; ++i) {

                            OfficeExcel.Text(context,font,text_size,xpos,(2 * interval) + this._chartGutter._top + this.halfTextHeight + ((i/10) * (this.grapharea) ),'-' + OfficeExcel.number_format(this,(scale[0] - (((scale[0] - this.min) / numYLabels) * (numYLabels - i - 1))).toFixed((this._otherProps._scale_decimals)),units_pre,units_post),null,align,bounding,null,bgcolor, bold, null, textOptions);
                        }

                    } else {
                        alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                    }


                    /**
                    * Accommodate translating back after reversing the labels
                    */
                    if (this._otherProps._ylabels_invert) {
                        this.context.translate(0, 0 - (this.grapharea * -0.2));
                    }

                    if (typeof(this._otherProps._ymin) == 'number') {
                        OfficeExcel.Text(context,font,text_size,xpos,this._otherProps._ylabels_invert ? this.canvas.height - this._chartGutter._bottom : this._chartGutter._top,'-' + OfficeExcel.number_format(this, this._otherProps._ymin.toFixed(this._otherProps._scale_decimals), units_pre, units_post),'center',align,bounding,null,bgcolor, bold, null, textOptions);
                    }
                    }

              

            } else {

                /**
                * Accommodate reversing the Y labels
                */
                if (this._otherProps._ylabels_invert) {
                    this.scale = OfficeExcel.array_reverse(this.scale);
                    this.context.translate(0, this.grapharea * 0.2);
                    if (typeof(this._otherProps._ymin) == null) {
                        this._otherProps._ymin = 0;
                    }
                }

                if('auto' == numYLabels)
                {
                     for (var i=0; i<this.scale.length; ++i) {
					 
						OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText((this.scale[this.scale.length -1 - i]).toString(),isFormatCell) +  units_post,null,align,bounding,null,bgcolor, bold, null, textOptions);

                        //OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.number_format(this, (this.scale[this.scale.length -1 - i]).toString().replace('.',','), units_pre, units_post),null,align,bounding,null,bgcolor);

                        //OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),this.scale[this.scale.length -1 - i],null,align,bounding,null,bgcolor);

                    }
                }
                else if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
                    OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((0/5) * (this.grapharea ) ), OfficeExcel.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);

                    if (numYLabels == 5) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((3/5) * (this.grapharea) ), OfficeExcel.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((1/5) * (this.grapharea) ), OfficeExcel.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                    if (numYLabels >= 3) {
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((2/5) * (this.grapharea ) ), OfficeExcel.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                        OfficeExcel.Text(context, font, text_size, xpos, this._chartGutter._top + this.halfTextHeight + ((4/5) * (this.grapharea) ), OfficeExcel.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor, bold, null, textOptions);
                    }

                } else if (numYLabels == 10) {

                    // 10 Y labels
                    var interval = (this.grapharea / numYLabels) / 2;

                    for (var i=0; i<numYLabels; ++i) {
                        OfficeExcel.Text(context,font,text_size,xpos,this._chartGutter._top + this.halfTextHeight + ((i/10) * (this.grapharea) ),OfficeExcel.number_format(this,((((this.scale[4] - this.min) / numYLabels) * (numYLabels - i)) + this.min).toFixed((this._otherProps._scale_decimals)),units_pre,units_post),null,align,bounding,null,bgcolor, bold, null, textOptions);
                    }

                } else {
                    alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');
                }


                /**
                * Accommodate translating back after reversing the labels
                */
                if (this._otherProps._ylabels_invert) {
                    this.context.translate(0, 0 - (this.grapharea * 0.2));
                }

                if (typeof(this._otherProps._ymin) == 'number' || typeof(this._otherProps._ymin) == 'string' && this._otherProps._ymin.search('E') != -1) {
					OfficeExcel.Text(context,font,text_size,xpos - 5,this._otherProps._ylabels_invert ? this._chartGutter._top : this.canvas.height - this._chartGutter._bottom,OfficeExcel.numToFormatText(this._otherProps._ymin.toString(),isFormatCell) + units_post,'center',align,bounding,null,bgcolor, bold, null, textOptions);
                    //OfficeExcel.Text(context,font,text_size,xpos - 5,this._otherProps._ylabels_invert ? this._chartGutter._top : this.canvas.height - this._chartGutter._bottom,OfficeExcel.number_format(this, this._otherProps._ymin, units_pre, units_post),'center',align,bounding,null,bgcolor);
                    //OfficeExcel.Text(context,font,text_size,xpos - 5,this._otherProps._ylabels_invert ? this._chartGutter._top : this.canvas.height - this._chartGutter._bottom,OfficeExcel.number_format(this, this._otherProps._ymin.toFixed(this._otherProps._scale_decimals), units_pre, units_post),'center',align,bounding,null,bgcolor);
                }
            }

            // No X axis - so draw 0 - but not if the X axis is in the center
            if (   this._otherProps._noxaxis == true
                && this._otherProps._ymin == null
                && this._otherProps._xaxispos != 'center'
               ) {

                OfficeExcel.Text(context,font,text_size,xpos,this._otherProps._xaxispos == 'top' ? this._chartGutter._top + this.halfTextHeight: (this.canvas.height - this._chartGutter._bottom + this.halfTextHeight),this._otherProps._units_pre + '0' + this._otherProps._units_post,null, align, bounding, null, bgcolor, bold, null, textOptions);
            }

        } else if (this._otherProps._ylabels && typeof(this._otherProps._ylabels_specific) == 'object') {

            // A few things
            var gap      = this.grapharea / this._otherProps._ylabels_specific.length;
            var halign   = this._otherProps._yaxispos == 'left' ? 'right' : 'left';
            var bounding = false;
            var bgcolor  = null;
            var ymin     = this._otherProps._ymin != null && this._otherProps._ymin;

            // Figure out the X coord based on the position of the axis
            if (this._otherProps._yaxispos == 'left') {
                var x = this._chartGutter._left - 5;

                if (this._otherProps._ylabels_inside) {
                    x += 10;
                    halign   = 'left';
                    bounding = true;
                    bgcolor  = 'rgba(255,255,255,0.5)';
                }

            } else if (this._otherProps._yaxispos == 'right') {
                var x = this.canvas.width - this._chartGutter._right + 5;

                if (this._otherProps._ylabels_inside) {
                    x -= 10;
                    halign = 'right';
                    bounding = true;
                    bgcolor  = 'rgba(255,255,255,0.5)';
                }
            }


            // Draw the labels
            if (this._otherProps._xaxispos == 'center') {

                // Draw the top halfs labels
                for (var i=0; i<this._otherProps._ylabels_specific.length; ++i) {
                    var y = this._chartGutter._top + (this.grapharea / ((this._otherProps._ylabels_specific.length ) * 2) * i);

                    if (ymin && ymin > 0) {
                        var y  = ((this.grapharea / 2) / (this._otherProps._ylabels_specific.length - (ymin ? 1 : 0)) ) * i;
                            y += this._chartGutter._top;
                    }

                    OfficeExcel.Text(context, font, text_size,x,y,String(this._otherProps._ylabels_specific[i]), 'center', halign, bounding, 0, bgcolor, bold, null, textOptions);
                }

                // Now reverse the labels and draw the bottom half
                var reversed_labels = OfficeExcel.array_reverse(this._otherProps._ylabels_specific);

                // Draw the bottom halfs labels
                for (var i=0; i<reversed_labels.length; ++i) {
                    var y = (this.grapharea / 2) + this._chartGutter._top + ((this.grapharea / (reversed_labels.length * 2) ) * (i + 1));

                    if (ymin && ymin > 0) {
                        var y  = ((this.grapharea / 2) / (reversed_labels.length - (ymin ? 1 : 0)) ) * i;
                            y += this._chartGutter._top;
                            y += (this.grapharea / 2);
                    }

                    OfficeExcel.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor, bold, null, textOptions);
                }

            } else if (this._otherProps._xaxispos == 'top') {

                // Reverse the labels and draw
                var reversed_labels = OfficeExcel.array_reverse(this._otherProps._ylabels_specific);

                // Draw the bottom halfs labels
                for (var i=0; i<reversed_labels.length; ++i) {

                    var y = ((this.grapharea / (reversed_labels.length - (ymin ? 1 : 0)) ) * (i + (ymin ? 0 : 1)));
                        y = y + this._chartGutter._top;

                    OfficeExcel.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor, bold, null, textOptions);
                }

            } else {
                for (var i=0; i<this._otherProps._ylabels_specific.length; ++i) {
                    var y = this._chartGutter._top + ((this.grapharea / (this._otherProps._ylabels_specific.length - (ymin ? 1 : 0) )) * i);
                    OfficeExcel.Text(context, font, text_size,x,y,String(this._otherProps._ylabels_specific[i]), 'center', halign, bounding, 0, bgcolor, bold, null, textOptions);
                }
            }
        }

        // Draw the X axis labels
        if (this._otherProps._labels && this._otherProps._labels.length > 0 && this._otherProps._xlabels ) {

            var yOffset  = 5;
            var bordered = false;
            var bgcolor  = null;
			font     = this._otherProps._xlabels_font;
			bold 	     = this._otherProps._xlabels_bold;
			textOptions =
			{
				color: this._otherProps._xlabels_color,
				underline: this._otherProps._xlabels_underline,
				italic: this._otherProps._xlabels_italic
			}		
            /**
            * Text angle
            */
            var angle  = 0;
            var valign = 'top';
            var halign = 'center';

            if (this._otherProps._xlabels_inside) {
                yOffset = -5;
                bordered = true;
                bgcolor  = this._otherProps._xlabels_inside_color;
                valign = 'bottom';
            }

            if (this._otherProps._xaxispos == 'top') {
                valign = 'bottom';
                yOffset += 2;
            }

            if (typeof(this._otherProps._text_angle) == 'number' && this._otherProps._text_angle > 0) {
                angle   = -1 * this._otherProps._text_angle;
                valign  = 'center';
                halign  = 'right';
                yOffset = 10;

                if (this._otherProps._xaxispos == 'top') {
                    yOffset = 10;
                }
            }
            
            if(this._otherProps._xaxispos == 'top' && 'auto' == this._otherProps._ylabels_count)
                yOffset = 20;
            else if('auto' == this._otherProps._ylabels_count)
                yOffset = 11;
            this.context.fillStyle = this._otherProps._text_color;
            var numLabels = this._otherProps._labels.length;
			
			var axisOxAngleOptions;
			if(this._otherProps._axisOxAngleOptions && this._otherProps._axisOxAngleOptions.angle)
			{
				axisOxAngleOptions = this._otherProps._axisOxAngleOptions;
				angle = this._otherProps._axisOxAngleOptions.angle;
			}
			var diffWidth;
			var diffHeight;
            for (i=0; i<numLabels; ++i) {

                // Changed 8th Nov 2010 to be not reliant on the coords
                //if (this._otherProps._labels[i] && this.coords && this.coords[i] && this.coords[i][0]) {
                if (this._otherProps._labels[i]) {

                    var labelX = ((this.canvas.width - this._chartGutter._left - this._chartGutter._right - (2 * this._otherProps._hmargin)) / (numLabels - 1) ) * i;
                        labelX += this._chartGutter._left + this._otherProps._hmargin;

                    /**
                    * Account for an unrelated number of labels
                    */
                    if (this._otherProps._labels.length != this.data[0].length) {
                        //labelX = this._chartGutter._left + this._otherProps._hmargin + ((this.canvas.width - this._chartGutter._left - this._chartGutter._right - (2 * this._otherProps._hmargin)) * (i / (this._otherProps._labels.length - 1)));
                        labelX = this._chartGutter._left - this._otherProps._background_grid_vsize/2 + i*this._otherProps._background_grid_vsize;
                    }

                    // This accounts for there only being one point on the chart
                    if (!labelX) {
                        labelX = this._chartGutter._left + this._otherProps._hmargin;
                    }

                    if (this._otherProps._xaxispos == 'top' && this._otherProps._text_angle > 0) {
                        halign = 'left';
                    }
                    if('auto' == this._otherProps._ylabels_count)
                    {
                        diffWidth = axisOxAngleOptions ? (axisOxAngleOptions[i]*Math.sin(angle*Math.PI/180))/(4) : 0;
						diffHeight = axisOxAngleOptions ? (axisOxAngleOptions[i]*Math.cos(angle*Math.PI/180) - 10) : 0;
						OfficeExcel.Text(context,
                                font,
                                text_size,
                                labelX - diffWidth,
                                //(this._otherProps._xaxispos == 'top') ? this._chartGutter._top - yOffset - (this._otherProps._xlabels_inside ? -22 : 0) : (this.canvas.height - this._chartGutter._bottom) + yOffset,
                                this.nullPositionOX + yOffset*scaleFactor + diffHeight,
                                String(this._otherProps._labels[i]),
                                valign,
                                halign,
                                bordered,
                                angle,
                                bgcolor, bold, null, textOptions);
                    }
                    else
                    {
                        OfficeExcel.Text(context,
                                font,
                                text_size,
                                labelX,
                                (this._otherProps._xaxispos == 'top') ? this._chartGutter._top - yOffset - (this._otherProps._xlabels_inside ? -22 : 0) : (this.canvas.height - this._chartGutter._bottom) + yOffset,
                                //this.nullPositionOX + 20,
                                String(this._otherProps._labels[i]),
                                valign,
                                halign,
                                bordered,
                                angle,
                                bgcolor, bold, null, textOptions);
                    }
                    
                }
            }

        }

        this.context.stroke();
        if(this._otherProps._filled != true)
            this.context.fill();
    }


    // Draws the line
    OfficeExcel.Line.prototype.DrawLine = function (lineData, color, fill, linewidth, tickmarks, index)
    {
        // This facilitates the Rise animation (the Y value only)
        if (this._otherProps._animation_unfold_y && this._otherProps._animation_factor != 1) {
            for (var i=0; i<lineData.length; ++i) {
                lineData[i] *= this._otherProps._animation_factor;
            }
        }

        var penUp = false;
        var yPos  = null;
        var xPos  = 0;
        this.context.lineWidth = 1;
        var lineCoords = [];

        /**
        * Get the previous line data
        */
        if (index > 0) {
            var prevLineCoords = this.coords2[index - 1];
        }

        // Work out the X interval
        var xInterval
        if('auto' == this._otherProps._ylabels_count && 'object' == typeof this.data_arr[0])
            xInterval = (this.canvas.width - (2 * this._otherProps._hmargin) - this._chartGutter._left - this._chartGutter._right) / (this._otherProps._labels.length - 1);
        else
            xInterval = (this.canvas.width - (2 * this._otherProps._hmargin) - this._chartGutter._left - this._chartGutter._right) / (lineData.length - 1);

        // Loop thru each value given, plotting the line
        // (FORMERLY FIRST)
        for (i=0; i<lineData.length; i++) {

            var data_point = lineData[i];

            yPos = this.canvas.height - (((data_point - (data_point > 0 ?  this._otherProps._ymin : (-1 * this._otherProps._ymin))) / (this.max - this.min) ) * this.grapharea);
            yPos = (this.grapharea / (this.max - this.min)) * (data_point - this.min);
            yPos = this.canvas.height - yPos;

            /**
            * This skirts an annoying JS rounding error
            * SEARCH TAGS: JS ROUNDING ERROR DECIMALS
            */
            if (data_point == this.max) {
                yPos = Math.round(yPos);
            }

            if (this._otherProps._ylabels_invert) {
                yPos -= this._chartGutter._bottom;
                yPos -= this._chartGutter._top;
                yPos = this.canvas.height - yPos;
            }

            // Make adjustments depending on the X axis position
            if (this._otherProps._xaxispos == 'center') {
                yPos = (yPos - this._chartGutter._bottom - this._chartGutter._top) / 2;
                yPos = yPos + this._chartGutter._top;


            // TODO Check this
            } else if (this._otherProps._xaxispos == 'top') {

                yPos = (this.grapharea / (this.max - this.min)) * (Math.abs(data_point) - this.min);
                yPos += this._chartGutter._top;

                if (this._otherProps._ylabels_invert) {
                    yPos -= this._chartGutter._top;
                    yPos  = this.grapharea - yPos;
                    yPos += this._chartGutter._top;
                }

            } else if (this._otherProps._xaxispos == 'bottom') {
                // TODO
                yPos -= this._chartGutter._bottom; // Without this the line is out of place due to the gutter
            }


            if (   lineData[i] == null
                || (this._otherProps._xaxispos == 'bottom' && lineData[i] < this.min && !this._otherProps._outofbounds)
                ||  (this._otherProps._xaxispos == 'center' && lineData[i] < (-1 * this.max) && !this._otherProps._outofbounds)) {

                yPos = null;
            }

            // Not always very noticeable, but it does have an effect
            // with thick lines
            this.context.lineCap  = 'round';
            this.context.lineJoin = 'round';

            // Plot the line if we're at least on the second iteration
            if (i > 0) {
                xPos = xPos + xInterval;
            } else {
                xPos = this._otherProps._hmargin + this._chartGutter._left;
            }

            if (this._otherProps._animation_unfold_x) {
                xPos *= this._otherProps._animation_factor;

                if (xPos < this._chartGutter._left) {
                    xPos = this._chartGutter._left;
                }
            }

            /**
            * Add the coords to an array
            */
			if(data_point.toString() == '')
			{
				this.coords.push(['', '']);
				lineCoords.push(['', '']);
			}
			else
			{
				this.coords.push([xPos, yPos]);
				lineCoords.push([xPos, yPos]);
			}
        }

        this.context.stroke();

        // Store the coords in another format, indexed by line number
        this.coords2[index] = lineCoords;

        /**
        * For IE only: Draw the shadow ourselves as ExCanvas doesn't produce shadows
        */
        if (OfficeExcel.isOld() && this._shadow._visible) {
            this.DrawIEShadow(lineCoords, this.context.shadowColor);
        }

        /**
        * Now draw the actual line [FORMERLY SECOND]
        */
        this.context.beginPath();
        // Transparent now as of 11/19/2011
        this.context.strokeStyle = 'rgba(0,0,0,0)';
        //this.context.strokeStyle = fill;
        if (fill) {
            this.context.fillStyle   = fill;
        }

        var isStepped = this._otherProps._stepped;
        var isFilled = this._otherProps._filled;

        if (this._otherProps._xaxispos == 'top') {
            var xAxisPos = this._chartGutter._top;
        } else if (this._otherProps._xaxispos == 'center') {
            var xAxisPos = this._chartGutter._top + (this.grapharea / 2);
        } else if (this._otherProps._xaxispos == 'bottom') {
            var xAxisPos = this.canvas.height - this._chartGutter._bottom;
        }


        for (var i=0; i<lineCoords.length; ++i) {

            xPos = lineCoords[i][0];
            yPos = lineCoords[i][1];
            var set = index;

            var prevY     = (lineCoords[i - 1] ? lineCoords[i - 1][1] : null);
            var isLast    = (i + 1) == lineCoords.length;

            /**
            * This nullifys values which are out-of-range
            */
            if (prevY < this._chartGutter._top || prevY > (this.canvas.height - this._chartGutter._bottom) ) {
                penUp = true;
            }

            if (i == 0 || penUp || !yPos || !prevY /*|| prevY < this._chartGutter._top*/) {

                if (this._otherProps._filled && !this._otherProps._filled_range) {

                    this.context.moveTo(xPos + 1, xAxisPos);

                    // This facilitates the X axis being at the top
                    // NOTE: Also done below
                    if (this._otherProps._xaxispos == 'top') {
                        this.context.moveTo(xPos + 1, xAxisPos);
                    }

                    this.context.moveTo(xPos, yPos);

                } else {

                    if (OfficeExcel.isOld() && yPos == null) {
                        // Nada
                    } else {
                        this.context.moveTo(xPos + 1, yPos);
                    }
                }

                if (yPos == null) {
                    penUp = true;

                } else {
                    penUp = false;
                }

            } else {

                // Draw the stepped part of stepped lines
                if (isStepped) {
                    this.context.lineTo(xPos, lineCoords[i - 1][1]);
                }

                if ((yPos >= this._chartGutter._top && yPos <= (this.canvas.height - this._chartGutter._bottom)) || this._otherProps._outofbounds ) {

                    if (isLast && this._otherProps._filled && !this._otherProps._filled_range && this._otherProps._yaxispos == 'right') {
                        xPos -= 1;
                    }


                    // Added 8th September 2009
                    if (!isStepped || !isLast) {
                        this.context.lineTo(xPos, yPos);

                        if (isFilled && lineCoords[i+1] && lineCoords[i+1][1] == null) {
                            this.context.lineTo(xPos, xAxisPos);
                        }

                    // Added August 2010
                    } else if (isStepped && isLast) {
                        this.context.lineTo(xPos,yPos);
                    }


                    penUp = false;
                } else {
                    penUp = true;
                }
            }
        }

        /**
        * Draw a line to the X axis if the chart is filled
        */
        if (this._otherProps._filled && !this._otherProps._filled_range) {

            // Is this needed ??
            var fillStyle = this._otherProps._fillstyle;

            /**
            * Draw the bottom edge of the filled bit using either the X axis or the prevlinedata,
            * depending on the index of the line. The first line uses the X axis, and subsequent
            * lines use the prevLineCoords array
            */
            if (index > 0 && this._otherProps._filled_accumulative) {

                this.context.lineTo(xPos, prevLineCoords ? prevLineCoords[i - 1][1] : (this.canvas.height - this._chartGutter._bottom - 1 + (this._otherProps._xaxispos == 'center' ? (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2 : 0)));

                for (var k=(i - 1); k>=0; --k) {
                    this.context.lineTo(k == 0 ? prevLineCoords[k][0] + 1: prevLineCoords[k][0], prevLineCoords[k][1]);
                }
            } else {

                // Draw a line down to the X axis
                if (this._otherProps._xaxispos == 'top') {
                    this.context.lineTo(xPos, this._chartGutter._top +  1);
                    this.context.lineTo(lineCoords[0][0],this._chartGutter._top + 1);
                } else if (typeof(lineCoords[i - 1][1]) == 'number') {

                    var yPosition = this.nullPositionOX;
					
                    this.context.lineTo(xPos,yPosition);
                    this.context.lineTo(lineCoords[0][0],yPosition);
                }
            }

            this.context.fillStyle = fill;

            this.context.fill();
            this.context.beginPath();

        }

        /**
        * FIXME this may need removing when Chrome is fixed
        * SEARCH TAGS: CHROME SHADOW BUG
        */
        if (navigator.userAgent.match(/Chrome/) && this._shadow._visible && this._otherProps._chromefix && this._shadow._blur > 0) {

            for (var i=lineCoords.length - 1; i>=0; --i) {
                if (
                       typeof(lineCoords[i][1]) != 'number'
                    || (typeof(lineCoords[i+1]) == 'object' && typeof(lineCoords[i+1][1]) != 'number')
                   ) {
                    this.context.moveTo(lineCoords[i][0],lineCoords[i][1]);
                } else {
                    this.context.lineTo(lineCoords[i][0],lineCoords[i][1]);
                }
            }
        }

        this.context.stroke();


        if (this._otherProps._backdrop) {
            this.DrawBackdrop(lineCoords, color);
        }

        // Now redraw the lines with the correct line width
        if(!this._otherProps._filled)
            this.RedrawLine(lineCoords, color, linewidth);

        this.context.stroke();

        // Draw the tickmarks
        for (var i=0; i<lineCoords.length; ++i) {

            i = Number(i);

            if (isStepped && i == (lineCoords.length - 1)) {
                this.context.beginPath();
                //continue;
            }

            if (
                (
                    tickmarks != 'endcircle'
                 && tickmarks != 'endsquare'
                 && tickmarks != 'filledendsquare'
                 && tickmarks != 'endtick'
                 && tickmarks != 'endtriangle'
                 && tickmarks != 'arrow'
                 && tickmarks != 'filledarrow'
                )
                || (i == 0 && tickmarks != 'arrow' && tickmarks != 'filledarrow')
                || i == (lineCoords.length - 1)
               ) {

                var prevX = (i <= 0 ? null : lineCoords[i - 1][0]);
                var prevY = (i <= 0 ? null : lineCoords[i - 1][1]);

                this.DrawTick(lineData, lineCoords[i][0], lineCoords[i][1], color, false, prevX, prevY, tickmarks, i);

                // Draws tickmarks on the stepped bits of stepped charts. Takend out 14th July 2010
                //
                //if (this._otherProps._stepped && lineCoords[i + 1] && this._otherProps._tickmarks != 'endsquare' && this._otherProps._tickmarks != 'endcircle' && this._otherProps._tickmarks != 'endtick') {
                //    this.DrawTick(lineCoords[i + 1][0], lineCoords[i][1], color);
                //}
            }
        }

        // Draw something off canvas to skirt an annoying bug
        this.context.beginPath();
        this.context.arc(this.canvas.width + 50000, this.canvas.height + 50000, 2, 0, 6.38, 1);
    }


    // Draws a tick
    OfficeExcel.Line.prototype.DrawTick = function (lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index)
    {
        // If the yPos is null - no tick
        if ((yPos == null || yPos > (this.canvas.height - this._chartGutter._bottom) || yPos < this._chartGutter._top) && !this._otherProps._outofbounds || !this._otherProps._line_visible)
            return;

        this.context.beginPath();

        var offset   = 0;

        this.context.lineWidth   = this._otherProps._tickmarks_linewidth ? this._otherProps._tickmarks_linewidth : this._otherProps._linewidth;
        this.context.strokeStyle = isShadow ? this._shadow._color : this.context.strokeStyle;
        this.context.fillStyle   = isShadow ? this._shadow._color : this.context.strokeStyle;

        if (   tickmarks == 'circle'
            || tickmarks == 'filledcircle'
            || tickmarks == 'endcircle') {

            if (tickmarks == 'circle'|| tickmarks == 'filledcircle' || (tickmarks == 'endcircle') ) {
                this.context.beginPath();
                this.context.arc(xPos + offset, yPos + offset, this._otherProps._ticksize, 0, 360 / (180 / Math.PI), false);

                if (tickmarks == 'filledcircle') {
                    this.context.fillStyle = isShadow ? this._shadow._color : this.context.strokeStyle;
                } else {
                    this.context.fillStyle = isShadow ? this._shadow._color : 'white';
                }

                this.context.stroke();
                this.context.fill();
            }

        // Halfheight "Line" style tick marks
        } else if (tickmarks == 'halftick') {
            this.context.beginPath();
            this.context.moveTo(xPos, yPos);
            this.context.lineTo(xPos, yPos + this._otherProps._ticksize);

            this.context.stroke();

        // Tick style tickmarks
        } else if (tickmarks == 'tick') {
            this.context.beginPath();
            this.context.moveTo(xPos, yPos -  this._otherProps._ticksize);
            this.context.lineTo(xPos, yPos + this._otherProps._ticksize);

            this.context.stroke();

        // Endtick style tickmarks
        } else if (tickmarks == 'endtick') {
            this.context.beginPath();
            this.context.moveTo(xPos, yPos -  this._otherProps._ticksize);
            this.context.lineTo(xPos, yPos + this._otherProps._ticksize);

            this.context.stroke();

        // "Cross" style tick marks
        } else if (tickmarks == 'cross') {
            this.context.beginPath();
            this.context.moveTo(xPos - this._otherProps._ticksize, yPos - this._otherProps._ticksize);
            this.context.lineTo(xPos + this._otherProps._ticksize, yPos + this._otherProps._ticksize);
            this.context.moveTo(xPos + this._otherProps._ticksize, yPos - this._otherProps._ticksize);
            this.context.lineTo(xPos - this._otherProps._ticksize, yPos + this._otherProps._ticksize);

            this.context.stroke();


        // Triangle style tick marks
        } else if (tickmarks == 'triangle' || tickmarks == 'filledtriangle' || tickmarks == 'endtriangle') {
            this.context.beginPath();

                if (tickmarks == 'filledtriangle') {
                    this.context.fillStyle = isShadow ? this._shadow._color : this.context.strokeStyle;
                } else {
                    this.context.fillStyle = 'white';
                }

                this.context.moveTo(xPos - this._otherProps._ticksize, yPos + this._otherProps._ticksize);
                this.context.lineTo(xPos, yPos - this._otherProps._ticksize);
                this.context.lineTo(xPos + this._otherProps._ticksize, yPos + this._otherProps._ticksize);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();


        // A white bordered circle
        } else if (tickmarks == 'borderedcircle' || tickmarks == 'dot') {
                this.context.lineWidth   = 1;
                this.context.strokeStyle = this._otherProps._tickmarks_dot_color;
                this.context.fillStyle   = this._otherProps._tickmarks_dot_color;

                // The outer white circle
                this.context.beginPath();
                this.context.arc(xPos, yPos, this._otherProps._ticksize, 0, 360 / (180 / Math.PI), false);
                this.context.closePath();


                this.context.fill();
                this.context.stroke();

                // Now do the inners
                this.context.beginPath();
                this.context.fillStyle   = color;
                this.context.strokeStyle = color;
                this.context.arc(xPos, yPos, this._otherProps._ticksize - 2, 0, 360 / (180 / Math.PI), false);

                this.context.closePath();

                this.context.fill();
                this.context.stroke();

        } else if (   tickmarks == 'square'
                   || tickmarks == 'filledsquare'
                   || (tickmarks == 'endsquare')
                   || (tickmarks == 'filledendsquare') ) {

            this.context.fillStyle   = 'white';
            this.context.strokeStyle = this.context.strokeStyle; // FIXME Is this correct?

            this.context.beginPath();
            this.context.strokeRect(xPos - this._otherProps._ticksize, yPos - this._otherProps._ticksize, this._otherProps._ticksize * 2, this._otherProps._ticksize * 2);

            // Fillrect
            if (tickmarks == 'filledsquare' || tickmarks == 'filledendsquare') {
                this.context.fillStyle = isShadow ? this._shadow._color : this.context.strokeStyle;
                this.context.fillRect(xPos - this._otherProps._ticksize, yPos - this._otherProps._ticksize, this._otherProps._ticksize * 2, this._otherProps._ticksize * 2);

            } else if (tickmarks == 'square' || tickmarks == 'endsquare') {
                this.context.fillStyle = isShadow ? this._shadow._color : 'white';
                this.context.fillRect((xPos - this._otherProps._ticksize) + 1, (yPos - this._otherProps._ticksize) + 1, (this._otherProps._ticksize * 2) - 2, (this._otherProps._ticksize * 2) - 2);
            }

            this.context.stroke();
            this.context.fill();

        /**
        * FILLED arrowhead
        */
        } else if (tickmarks == 'filledarrow') {

            var x = Math.abs(xPos - prevX);
            var y = Math.abs(yPos - prevY);

            if (yPos < prevY) {
                var a = Math.atan(x / y) + 1.57;
            } else {
                var a = Math.atan(y / x) + 3.14;
            }

            this.context.beginPath();
                this.context.moveTo(xPos, yPos);
                this.context.arc(xPos, yPos, 7, a - 0.5, a + 0.5, false);
            this.context.closePath();

            this.context.stroke();
            this.context.fill();

        /**
        * Arrow head, NOT filled
        */
        } else if (tickmarks == 'arrow') {

            var x = Math.abs(xPos - prevX);
            var y = Math.abs(yPos - prevY);

            var orig_linewidth = this.context.lineWidth;

            if (yPos < prevY) {
                var a = Math.atan(x / y) + 1.57;
            } else {
                var a = Math.atan(y / x) + 3.14;
            }

            this.context.beginPath();
                this.context.moveTo(xPos, yPos);
                this.context.arc(xPos, yPos, 7, a - 0.5 - (document.all ? 0.1 : 0.01), a - 0.4, false);

                this.context.moveTo(xPos, yPos);
                this.context.arc(xPos, yPos, 7, a + 0.5 + (document.all ? 0.1 : 0.01), a + 0.5, true);
            this.context.stroke();
            this.context.fill();

            // Revert to original lineWidth
            this.context.lineWidth = orig_linewidth;

        /**
        * Custom tick drawing function
        */
        } else if (typeof(tickmarks) == 'function') {
            tickmarks(this, lineData, lineData[index], index, xPos, yPos, color, prevX, prevY);
        }
    }

    // Draws a filled range if necessary
    OfficeExcel.Line.prototype.DrawRange = function ()
    {
        // Fill the range if necessary
        if (this._otherProps._filled_range && this._otherProps._filled) {
            this.context.beginPath();
            this.context.fillStyle = this._otherProps._fillstyle;
            this.context.strokeStyle = this._otherProps._fillstyle;
            this.context.lineWidth = 1;
            var len = (this.coords.length / 2);

            for (var i = 0; i < len; ++i) {
                if (i == 0)
                    this.context.moveTo(this.coords[i][0], this.coords[i][1])
                else
                    this.context.lineTo(this.coords[i][0], this.coords[i][1])
            }

            for (var i = this.coords.length - 1; i >= len; --i)
                this.context.lineTo(this.coords[i][0], this.coords[i][1])
            
            this.context.stroke();
            this.context.fill();
        }
    }

    // Redraws the line with the correct line width etc
    OfficeExcel.Line.prototype.RedrawLine = function (coords, color, linewidth)
    {
        if (this._otherProps._noredraw)
            return;

        this.context.strokeStyle = (typeof(color) == 'object' && color ? color[0] : color);
        this.context.lineWidth = linewidth;

        if (!this._otherProps._line_visible)
            this.context.strokeStyle = 'rgba(0,0,0,0)';

        if (this._otherProps._curvy) {
            this.DrawCurvyLine(coords, !this._otherProps._line_visible ? 'rgba(0,0,0,0)' : color, linewidth);
            return;
        }

        this.context.beginPath();

        var len    = coords.length;
        var width  = this.canvas.width
        var height = this.canvas.height;
        var penUp  = false;

        for (var i = 0; i < len; ++i) {
            var xPos   = coords[i][0];
            var yPos   = coords[i][1];

            if (i > 0) {
                var prevX = coords[i - 1][0];
                var prevY = coords[i - 1][1];
            }


            if ((
                   (i == 0 && coords[i])
               /*|| (yPos < this._chartGutter._top)
                || (prevY < this._chartGutter._top)*/
				|| yPos == ''
				|| prevY == ''
                || (yPos > (height - this._chartGutter._bottom))
                || (i > 0 && prevX > (width - this._chartGutter._right))
                || (i > 0 && prevY > (height - this._chartGutter._bottom))
                || prevY == null
                || penUp == true
               ) && (!this._otherProps._outofbounds || yPos == null || prevY == null) ) {

                if (OfficeExcel.isOld() && yPos == null) {
                    // ...?
                } else {
                    this.context.moveTo(coords[i][0], coords[i][1]);
                }

                penUp = false;

            } else {

                if (this._otherProps._stepped && i > 0) {
                    this.context.lineTo(coords[i][0], coords[i - 1][1]);
                }

                // Don't draw the last bit of a stepped chart. Now DO
                //if (!this._otherProps._stepped || i < (coords.length - 1)) {
                this.context.lineTo(coords[i][0], coords[i][1]);
                //}
                penUp = false;
            }
        }

        /**
        * If two colors are specified instead of one, go over the up bits
        */
        if (this._otherProps._colors_alternate && typeof(color) == 'object' && color[0] && color[1]) {
            for (var i = 1; i < len; ++i) {

                var prevX = coords[i - 1][0];
                var prevY = coords[i - 1][1];

                this.context.beginPath();
                this.context.strokeStyle = color[coords[i][1] < prevY ? 0 : 1];
                this.context.lineWidth = this._otherProps._linewidth;
                this.context.moveTo(prevX, prevY);
                this.context.lineTo(coords[i][0], coords[i][1]);
                this.context.stroke();
            }
        }
    }

    /**
    * This function is used by MSIE only to manually draw the shadow
    *
    * @param array coords The coords for the line
    */
    OfficeExcel.Line.prototype.DrawIEShadow = function (coords, color)
    {
        var offsetx = this._shadow._offset_x;
        var offsety = this._shadow._offset_y;

        this.context.lineWidth   = this._otherProps._linewidth;
        this.context.strokeStyle = color;
        this.context.beginPath();

        for (var i=0; i<coords.length; ++i) {
            if (i == 0) {
                this.context.moveTo(coords[i][0] + offsetx, coords[i][1] + offsety);
            } else {
                this.context.lineTo(coords[i][0] + offsetx, coords[i][1] + offsety);
            }
        }

        this.context.stroke();
    }


    /**
    * Draw the backdrop
    */
    OfficeExcel.Line.prototype.DrawBackdrop = function (coords, color)
    {
        var size = this._otherProps._backdrop_size;
        this.context.lineWidth = size;
        this.context.globalAlpha = this._otherProps._backdrop_alpha;
        this.context.strokeStyle = color;
        this.context.lineJoin = 'miter';

        this.context.beginPath();
            this.context.moveTo(coords[0][0], coords[0][1]);
            for (var j=1; j<coords.length; ++j) {
                this.context.lineTo(coords[j][0], coords[j][1]);
            }

        this.context.stroke();

        // Reset the alpha value
        this.context.globalAlpha = 1;
        this.context.lineJoin = 'round';
        OfficeExcel.NoShadow(this);
    }

    // Returns the linewidth
    OfficeExcel.Line.prototype.GetLineWidth = function (i)
    {
        var linewidth = this._otherProps._linewidth;

        if (typeof(linewidth) == 'number')
            return linewidth;
        else if (typeof(linewidth) == 'object') {
            if (linewidth[i])
                return linewidth[i];
            else
                return linewidth[0];

            alert('[LINE] Error! linewidth should be a single number or an array of one or more numbers');
        }
    }


    /**
    * The getPoint() method - used to get the point the mouse is currently over, if any
    *
    * @param object e The event object
    * @param object   OPTIONAL You can pass in the bar object instead of the
    *                          function getting it from the canvas
    */
    OfficeExcel.Line.prototype.getPoint = function (e)
    {
        var canvas  = e.target;
        var obj     = canvas.__object__;
        var context = obj.context;
        var mouseXY = OfficeExcel.getMouseXY(e);
        var mouseX  = mouseXY[0];
        var mouseY  = mouseXY[1];

        // This facilitates you being able to pass in the bar object as a parameter instead of
        // the function getting it from the object
        if (arguments[1]) {
            obj = arguments[1];
        }

        for (var i=0; i<obj.coords.length; ++i) {

            var xCoord = obj.coords[i][0];
            var yCoord = obj.coords[i][1];

            // Do this if the hotspot is triggered by the X coord AND the Y coord
            if (   obj._tooltip._hotspot_xonly == false
                && mouseX <= (xCoord + 5)
                && mouseX >= (xCoord - 5)
                && mouseY <= (yCoord + 5)
                && mouseY >= (yCoord - 5)
               ) {

                    return [obj, xCoord, yCoord, i];

            } else if (    obj._tooltip._hotspot_xonly == true
                        && mouseX <= (xCoord + 5)
                        && mouseX >= (xCoord - 5)) {

                        return [obj, xCoord, yCoord, i];
            }
        }
    }


    // Draws the above line labels
    OfficeExcel.Line.prototype.DrawAboveLabels = function (format)
    {
        var context    = this.context;
        var size       = this._otherProps._labels_above_size;
        var font       = this._otherProps._labels_above_font;
        var units_pre  = this._otherProps._units_pre;
        var units_post = this._otherProps._units_post;
		var bold 	   = this._otherProps._labels_above_bold;
		var textOptions =
		{
			color: this._otherProps._labels_above_color,
			underline: this._otherProps._labels_above_underline,
			italic: this._otherProps._labels_above_italic
		}		
        context.beginPath();
		var formatLabels = []; 
        var tempData = [];
        n = 0;
        for (var i = 0; i < this.firstData.length; ++i) {
             for (var j = 0; j < this.firstData[i].length; ++j) {
				if(this.catNameLabels && this.catNameLabels[i] && this.catNameLabels[i][j])
				{	
					tempData[n] = this.catNameLabels[i][j];
					formatLabels[n] = "General";
				}
				else
				{
					 tempData[n] = this.firstData[i][j];
					if(this.arrFormatAdobeLabels && this.arrFormatAdobeLabels[i] && this.arrFormatAdobeLabels[i][j])
						formatLabels[n] = this.arrFormatAdobeLabels[i][j];
					else
						formatLabels[n] = format;
				}
				n++;
            }
        }
        for (var i = 0; i < this.coords.length; ++i) {
            var coords = this.coords[i];
			 OfficeExcel.Text(context, font, size, coords[0], coords[1] - 5 - size,OfficeExcel.numToFormatText( OfficeExcel.num_round(tempData[i]),formatLabels[i]), 'center', 'center', false, null, 'rgba(255, 255, 255, 0.7)', bold, null, textOptions);
           // OfficeExcel.Text(context, font, size, coords[0], coords[1] - 5 - size, OfficeExcel.number_format(this, OfficeExcel.num_round(tempData[i]), units_pre, units_post), 'center', 'center', false, null, 'rgba(255, 255, 255, 0.7)');
        }

        context.fill();
    }


    /**
    * Draw a curvy line. This isn't 100% accurate but may be more to your tastes
    */
    OfficeExcel.Line.prototype.DrawCurvyLine = function (coords, color, linewidth)
    {
        var co = this.context;

        // Now calculate the halfway point
        co.beginPath();

            co.strokeStyle = color;
            co.lineWidth   = linewidth;

            for (var i=0; i<coords.length; ++i) {

                var factor  = this._otherProps._curvy_factor;

                if (coords[i] && typeof(coords[i][1]) == 'number' && coords[i + 1] && typeof(coords[i + 1][1]) == 'number') {

                    var coordX  = coords[i][0];
                    var coordY  = coords[i][1];
                    var nextX   = coords[i + 1][0];
                    var nextY   = coords[i + 1][1];
                    var prevX   = coords[i - 1] ? coords[i - 1][0] : null;
                    var prevY   = coords[i - 1] ? coords[i - 1][1] : null;
                    var offsetX = (coords[i + 1][0] - coords[i][0]) * factor;
                    var offsetY = (coords[i + 1][1] - coords[i][1]) * factor;


                    if (i == 0) {
                        co.moveTo(coordX, coordY);
                        co.lineTo(nextX - offsetX, nextY - offsetY);

                    } else if (nextY == null) {
                        co.lineTo(coordX, coordY);

                    } else if (prevY == null) {
                        co.moveTo(coordX, coordY);

                    } else if (coordY == null) {
                        co.moveTo(nextX, nextY);


                    } else {

                        co.quadraticCurveTo(coordX, coordY, coordX + offsetX, coordY + offsetY);

                        if (nextY) {
                            co.lineTo(nextX - offsetX, nextY - offsetY);
                        } else {
                            co.lineTo(coordX, coordY);
                        }
                    }

                } else if (typeof(coords[i][1]) == 'number') {
                    co.lineTo(coords[i][0], coords[i][1]);
                }
            }

        co.stroke();
    }


    /**
    * When you click on the chart, this method can return the Y value at that point. It works for any point on the
    * chart (that is inside the gutters) - not just points on the Line.
    *
    * @param object e The event object
    */
    OfficeExcel.Line.prototype.getValue = function (arg)
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
            || mouseX > (obj.canvas.width - obj._chartGutter._right)
           ) {
            return null;
        }
        
        if (this._otherProps._xaxispos == 'center') {
            var value = (( (obj.grapharea / 2) - (mouseY - obj._chartGutter._top)) / obj.grapharea) * (obj.max - obj.min);
            value *= 2;
            return value;
        } else if (this._otherProps._xaxispos == 'top') {
            var value = ((obj.grapharea - (mouseY - obj._chartGutter._top)) / obj.grapharea) * (obj.max - obj.min);
            value = Math.abs(obj.max - value) * -1;
            return value;
        } else {
            var value = ((obj.grapharea - (mouseY - obj._chartGutter._top)) / obj.grapharea) * (obj.max - obj.min)
            value += obj.min;
            return value;
        }
    }