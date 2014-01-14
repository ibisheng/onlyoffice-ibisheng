    if (typeof(window["OfficeExcel"]) == 'undefined') window["OfficeExcel"] = {};

    OfficeExcel.Bar = function (chartCanvas, data)
    {
        this.canvas            = chartCanvas;
        this.context           = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'bar';
        this.max               = 0;

        /**
        * Compatibility with older browsers
        */
        OfficeExcel.CanvasBrowserCompat(this.context);

        // Chart gutter
        this._chartGutter   = new OfficeExcel.Gutter();
        // Other Props
        this._otherProps    = new OfficeExcel.OtherProps();

        // Store the data
        this.data = data;
        
        // Used to store the coords of the bars
        this.coords = [];
    }

    /**
    * The function you call to draw the bar chart
    */
    OfficeExcel.Bar.prototype.Draw = function (min,max,ymin,ymax,isSkip,isFormatCell)
    {
        this.max = max;
        this.scale = OfficeExcel.getScale(this.max, this,min,max);
		this._otherProps._background_grid_autofit_numhlines = this.scale.length;
        this._otherProps._numyticks = this.scale.length;

        /**
        * Convert any null values to 0. Won't make any difference to the bar (as opposed to the line chart)
        */
        for (var i=0; i<this.data.length; ++i) {
            if (this.data[i] == null) {
                this.data[i] = 0;
            }
        }


        // Cache this in a class variable as it's used rather a lot

        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];

        /**
        * Work out a few things. They need to be here because they depend on things you can change before you
        * call Draw() but after you instantiate the object
        */
        this.grapharea      = OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom;
        this.halfgrapharea  = this.grapharea / 2;
        this.halfTextHeight = this._otherProps._text_size / 2;
        
        //Draw Area
        OfficeExcel.background.DrawArea(this);
        
        // Progressively Draw the chart
        OfficeExcel.background.Draw(this);

        //If it's a sketch chart variant, draw the axes first
        if (this._otherProps._variant == 'sketch') {
            this.DrawAxes(min,max);
            this.Drawbars(isSkip,isFormatCell);
        } else {
            this.DrawAxes(min,max);
            this.Drawbars(isSkip,isFormatCell);
            
        }
		
		this.DrawAboveLabels(isFormatCell);

        this.DrawLabels(isFormatCell);


        // Draw the key if necessary
        if (this._otherProps._key.length) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }


        /**
        * Is a line is defined, draw it
        */
        var line = this._otherProps._line;

        if (line) {
        
            line.__bar__ = this;

            line._chartGutter = this._chartGutter;

            line._otherProps._hmargin = (this.canvas.width - this._chartGutter._left - this._chartGutter._right) / (line.original_data[0].length * 2);
            
            // If a BAR custom yMax is set, use that
            if (this._otherProps._ymax && !line._otherProps._ymax) {
                line._otherProps._ymax = this._otherProps._ymax;
            
            } else if (line._otherProps._ymax) {
                line._otherProps._ymax = line._otherProps._ymax;
            }

            // The boolean is used to specify that the Line chart .Draw() method is being called by the Bar chart
            line.Draw(true);
        }
    }

    
    /**
    * Draws the charts axes
    */
    OfficeExcel.Bar.prototype.DrawAxes = function (min,max)
    {
        if (this._otherProps._noaxes) {
            return;
        }

        var xaxispos = this._otherProps._xaxispos;
        var yaxispos = this._otherProps._yaxispos;

        this.context.beginPath();
        this.context.strokeStyle = this._otherProps._axis_color;
        this.context.lineWidth   = 1;

        // Draw the Y axis
        if (this._otherProps._noyaxis == false) {
            if (yaxispos == 'right') {
                this.context.moveTo(AA(this, this.canvas.width - this._chartGutter._right), this._chartGutter._top);
                this.context.lineTo(AA(this, this.canvas.width - this._chartGutter._right), this.canvas.height - this._chartGutter._bottom + 1);
            } else {
                this.context.moveTo(AA(this, this._chartGutter._left), this._chartGutter._top);
                this.context.lineTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom + 1);
            }
        }
        
        // Draw the X axis
		if('auto' == this._otherProps._ylabels_count)
		{
			//определяем куда ставить ось
			var numNull = this._otherProps._background_grid_autofit_numhlines;

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
			if (this._otherProps._noxaxis == false)
			{
				this.context.moveTo(this._chartGutter._left, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
				this.context.lineTo(this.canvas.width - this._chartGutter._right, AA(this, this.canvas.height - this._chartGutter._bottom - nullPosition));
			}
			
			
			this.nullPositionOX = this.canvas.height - this._chartGutter._bottom - nullPosition;
		}

        var numYTicks = this._otherProps._numyticks;

        // Draw the Y tickmarks
        if (this._otherProps._noyaxis == false) {
            var yTickGap = (OfficeExcel.GetHeight(this) - this._chartGutter._top - this._chartGutter._bottom) / numYTicks;
            var xpos     = yaxispos == 'left' ? this._chartGutter._left : OfficeExcel.GetWidth(this) - this._chartGutter._right;
    
            for (var y=this._chartGutter._top,isCount = 0;
                 xaxispos == 'center' ? y <= (OfficeExcel.GetHeight(this) - this._chartGutter._bottom) + 2 : y <= (OfficeExcel.GetHeight(this) - this._chartGutter._bottom + (xaxispos == 'top' ? 1 : 0)) + 2;
                 y += yTickGap,++isCount) {
    
                if (xaxispos == 'center' && y == (OfficeExcel.GetHeight(this) / 2)) continue;
                
                // X axis at the top
                //if (xaxispos == 'top' && y == this._chartGutter._top) continue;
               if(isCount == numYTicks)
					y = OfficeExcel.GetHeight(this) - this._chartGutter._bottom;
                this.context.moveTo(xpos, AA(this, y));
                this.context.lineTo(xpos + (yaxispos == 'left' ? -3 : 3), AA(this, y));
            }
            
            /**
            * If the X axis is not being shown, draw an extra tick
            */
            if (this._otherProps._noxaxis) {
                if (xaxispos == 'center') {
                    this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), AA(this, this.canvas.height / 2));
                    this.context.lineTo(xpos, AA(this, OfficeExcel.GetHeight(this) / 2));
                } else if (xaxispos == 'top') {
                    this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), AA(this, this._chartGutter._top));
                    this.context.lineTo(xpos, AA(this, this._chartGutter._top));
                } else {
                    this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), AA(this, OfficeExcel.GetHeight(this) - this._chartGutter._bottom));
                    this.context.lineTo(xpos, AA(this, OfficeExcel.GetHeight(this) - this._chartGutter._bottom));
                }
            }
        }


        // Draw the X tickmarks
		if (!this._otherProps._noxaxis) {
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

			/**
			* If the Y axis is not being shown, draw an extra tick
			*/
			if (this._otherProps._noyaxis && this._otherProps._noxaxis == false && this._otherProps._xticks == null) {
				if (xaxispos == 'center') {
					this.context.moveTo(AA(this, this._chartGutter._left), (OfficeExcel.GetHeight(this) / 2) - 3);
					this.context.lineTo(AA(this, this._chartGutter._left), (OfficeExcel.GetHeight(this) / 2) + 3);
				} else {
					this.context.moveTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom);
					this.context.lineTo(AA(this, this._chartGutter._left), this.canvas.height - this._chartGutter._bottom + 3);
				}
			}
		}
        this.context.stroke();
    }


    /**
    * Draws the bars
    */
    OfficeExcel.Bar.prototype.Drawbars = function (isSkip,formatCell)
    {
        this.context.lineWidth   = this._otherProps._linewidth;
        this.context.strokeStyle = this._otherProps._strokecolor;
        this.context.fillStyle   = this._otherProps._colors[0];
        var prevX                = 0;
        var prevY                = 0;
        var decimals             = this._otherProps._scale_decimals;

        this.min = this._otherProps._ymin;
        if('auto' == this._otherProps._ylabels_count)
        {
            var lengSc = this.scale.length;
            this.max = this.scale[lengSc -1];
            this.min = this._otherProps._ymin;
            this._otherProps._background_grid_autofit_numhlines = lengSc;
            this._otherProps._numyticks = lengSc;
        }

        /**
        * Draw horizontal bars here
        */
        if (this._otherProps._background_hbars && this._otherProps._background_hbars.length > 0) {
            OfficeExcel.DrawBars(this);
        }

        var variant = this._otherProps._variant;

        /**
        * Get the variant once, and draw the bars, be they regular, stacked or grouped
        */
        
        // Get these variables outside of the loop
        var xaxispos      = this._otherProps._xaxispos;
        var width         = (this.canvas.width - this._chartGutter._left - this._chartGutter._right ) / this.data.length;
        var orig_height   = height;
        var hmargin       = this._otherProps._hmargin;
        var strokeStyle   = this._otherProps._strokecolor;
        var colors        = this._otherProps._colors;
		
		var bold = this._otherProps._labels_above_bold;
		var textOptions = 
		{
			color: this._otherProps._labels_above_color,
			italic: this._otherProps._labels_above_italic,
			underline: this._otherProps._labels_above_underline
		};

        for (var i=0; i<this.data.length; ++i) {

            // Work out the height
            //The width is up outside the loop
			if(!isSkip[i])
			{
            var height;
            if('auto' == this._otherProps._ylabels_count)
            {
                if(this.min < 0 && this.max > 0)
                {
                    height = ((OfficeExcel.array_sum(this.data[i]) < 0 ? OfficeExcel.array_sum(this.data[i]): OfficeExcel.array_sum(this.data[i])) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
                }
                else
                    height = ((OfficeExcel.array_sum(this.data[i]) < 0 ? OfficeExcel.array_sum(this.data[i] + this.min): OfficeExcel.array_sum(this.data[i]) - this.min) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
            }

            // Half the height if the Y axis is at the center
            if (xaxispos == 'center') {
                height /= 2;
            }

            var x = (i * width) + this._chartGutter._left;
            var y;
            if('auto' == this._otherProps._ylabels_count)
                y = this.nullPositionOX - height;

            // xaxispos is top
            if (xaxispos == 'top') {
                y = this._chartGutter._top + Math.abs(height);
            }


            // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
            if (height < 0) {
                y += height;
                height = Math.abs(height);
            }

            /**
            * Draw the bar
            */
            this.context.beginPath();
                if (typeof(this.data[i]) == 'number') {
                    
                    var barWidth = width - (2 * hmargin);

                    // Set the fill color
                    this.context.strokeStyle = strokeStyle;
                    this.context.fillStyle = colors[0];

                    if (variant == 'sketch') {

                        this.context.lineCap = 'round';
                        
                        var sketchOffset = 3;

                        this.context.beginPath();

                        this.context.strokeStyle = colors[0];

                        // Left side
                        this.context.moveTo(x + hmargin + 2, y + height - 2);
                        this.context.lineTo(x + hmargin , y - 2);

                        // The top
                        this.context.moveTo(x + hmargin - 3, y + -2 + (this.data[i] < 0 ? height : 0));
                        this.context.bezierCurveTo(x + ((hmargin + width) * 0.33),y + 5 + (this.data[i] < 0 ? height - 10: 0),x + ((hmargin + width) * 0.66),y + 5 + (this.data[i] < 0 ? height - 10 : 0),x + hmargin + width + -1, y + 0 + (this.data[i] < 0 ? height : 0));


                        // The right side
                        this.context.moveTo(x + hmargin + width - 2, y + -2);
                        this.context.lineTo(x + hmargin + width - 3, y + height - 3);

                        for (var r=0.2; r<=0.8; r+=0.2) {
                            this.context.moveTo(x + hmargin + width + (r > 0.4 ? -1 : 3) - (r * width),y - 1);
                            this.context.lineTo(x + hmargin + width - (r > 0.4 ? 1 : -1) - (r * width), y + height + (r == 0.2 ? 1 : -2));
                        }

                        this.context.stroke();

                    // Regular bar
                    } else if (variant == 'bar') {
                    
                        this.context.strokeRect(x + hmargin, y, barWidth, height);
                        this.context.fillRect(x + hmargin, y, barWidth, height);

                        // This bit draws the text labels that appear above the bars if requested
                        if (this._otherProps._labels_above) {
                            var yPos = y - 3;

                            // Account for negative bars
                            if (this.data[i] < 0) {
                                yPos += height + 6 + (this._otherProps._text_size - 4);
                            }

                            if (this._otherProps._xaxispos == 'top') {
                                yPos = this._chartGutter._top + height + 6 + (typeof(this._otherProps._labels_above_size) == 'number' ? this._otherProps._labels_above_size : this._otherProps._text_size - 4);
                            }

                            this.context.fillStyle = this._otherProps._text_color;

                            OfficeExcel.Text(this.context,
                                        this._otherProps._labels_above_font,
                                        typeof(this._otherProps._labels_above_size) == 'number' ? this._otherProps._labels_above_size : this._otherProps._text_size - 3,
                                        x + hmargin + (barWidth / 2),
                                        yPos,
                                        OfficeExcel.number_format(this, OfficeExcel.num_round(this.data[i]),this._otherProps._units_pre,this._otherProps._units_post),
                                        null,
                                        'center',
                                        null,
                                        null,
										null,
										bold,
										null,
										textOptions
                                       );
                        }

                    // Dot chart
                    } else if (variant == 'dot') {

                        this.context.beginPath();
                        this.context.moveTo(x + (width / 2), y);
                        this.context.lineTo(x + (width / 2), y + height);
                        this.context.stroke();
                        
                        this.context.beginPath();
                        this.context.fillStyle = this._otherProps._colors[i];
                        this.context.arc(x + (width / 2), y + (this.data[i] > 0 ? 0 : height), 2, 0, 6.28, 0);
                        
                        // Set the colour for the dots
                        this.context.fillStyle = this._otherProps._colors[0];

                        this.context.stroke();
                        this.context.fill();
                    
                    // Pyramid chart
                    } else if (variant == 'pyramid') {

                        this.context.beginPath();
                            var startY = (this._otherProps._xaxispos == 'center' ? (OfficeExcel.GetHeight(this) / 2) : (OfficeExcel.GetHeight(this) - this._chartGutter._bottom));
                        
                            this.context.moveTo(x + hmargin, startY);
                            this.context.lineTo(
                                                x + hmargin + (barWidth / 2),
                                                y + (this._otherProps._xaxispos == 'center' && (this.data[i] < 0) ? height : 0)
                                               );
                            this.context.lineTo(x + hmargin + barWidth, startY);
                        
                        this.context.closePath();
                        
                        this.context.stroke();
                        this.context.fill();
                    
                    // Arrow chart
                    } else if (variant == 'arrow') {
                        
                        var startY = (this._otherProps._xaxispos == 'center' ? (OfficeExcel.GetHeight(this) / 2) : (OfficeExcel.GetHeight(this) - this._chartGutter._bottom));

                        this.context.lineWidth = this._otherProps._linewidth ? this._otherProps._linewidth : 1;
                        this.context.lineCap = 'round';

                        this.context.beginPath();

                            this.context.moveTo(x + hmargin + (barWidth / 2), startY);
                            this.context.lineTo(x + hmargin + (barWidth / 2), y + (this._otherProps._xaxispos == 'center' && (this.data[i] < 0) ? height : 0));
                            this.context.arc(x + hmargin + (barWidth / 2),
                                             y + (this._otherProps._xaxispos == 'center' && (this.data[i] < 0) ? height : 0),
                                             5,
                                             this.data[i] > 0 ? 0.78 : 5.6,
                                             this.data[i] > 0 ? 0.79 : 5.48,
                                             this.data[i] < 0);

                            this.context.moveTo(x + hmargin + (barWidth / 2), y + (this._otherProps._xaxispos == 'center' && (this.data[i] < 0) ? height : 0));
                            this.context.arc(x + hmargin + (barWidth / 2),
                                             y + (this._otherProps._xaxispos == 'center' && (this.data[i] < 0) ? height : 0),
                                             5,
                                             this.data[i] > 0 ? 2.355 : 4,
                                             this.data[i] > 0 ? 2.4 : 3.925,
                                             this.data[i] < 0);

                        this.context.stroke();
                        
                        this.context.lineWidth = 1;
                    }

                    this.coords.push([x + hmargin, y, width - (2 * hmargin), height]);

                } else if (typeof(this.data[i]) == 'object') {
                    this.context.lineWidth = this._otherProps._linewidth;

                    for (var j=0; j<this.data[i].length; ++j) {

                        // Set the fill and stroke colors
                        this.context.strokeStyle = strokeStyle;
                        this.context.fillStyle   = colors[j];
                        
                        var individualBarWidth = (width - (2 * hmargin)) / this.data[i].length;
                        var height;
                        if('auto' == this._otherProps._ylabels_count)
                        {
                            if(this.min < 0 && this.max > 0)
                            {
                                height = ((OfficeExcel.array_sum(this.data[i][j]) < 0 ? OfficeExcel.array_sum(this.data[i][j]): OfficeExcel.array_sum(this.data[i][j])) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
                            }
                            else
                                height = ((OfficeExcel.array_sum(this.data[i][j]) < 0 ? OfficeExcel.array_sum(this.data[i][j] + this.min): OfficeExcel.array_sum(this.data[i][j]) - this.min) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
                        }
                        
                        
                        // If the X axis pos is in the center, we need to half the  height
                        if (xaxispos == 'center') {
                            height /= 2;
                        }

                        var startX = x + hmargin + (j * individualBarWidth);

                        if('auto' == this._otherProps._ylabels_count)
                        {
                            var startY = this.nullPositionOX - height;
                        }
                        
                        if(this._otherProps._type == 'accumulative' || this._otherProps._autoGrouping == 'stackedPer')
                        {
                            individualBarWidth = ((width) - (2 * hmargin));
                            startX = hmargin + i*2*hmargin + (i * individualBarWidth) + this._chartGutter._left;
                            //считаем общую высоту
                            var allHeight = 0;
                            var allHeightAbNull = 0;
                            var allHeightLessNull = 0;
                            /*if(this.min < 0 && this.max <= 0 && this._otherProps._autoGrouping == 'stackedPer')
                            {
                                var asd;
                            }
                            else
                            {*/
                                 for (var n = 0; n < j; ++n)
                                {
                                    if(this.min < 0 && this.max > 0)
                                    {
                                        allHeight = ((OfficeExcel.array_sum(this.data[i][n]) < 0 ? OfficeExcel.array_sum(this.data[i][n]): OfficeExcel.array_sum(this.data[i][n])) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
                                    }
                                    else
                                        allHeight = ((OfficeExcel.array_sum(this.data[i][n]) < 0 ? OfficeExcel.array_sum(this.data[i][n] + this.min): OfficeExcel.array_sum(this.data[i][n]) - this.min) / (this.max - this.min)) * (this.canvas.height - this._chartGutter._top - this._chartGutter._bottom);
                                    if(allHeight > 0)
                                        allHeightAbNull += allHeight;
                                    else
                                        allHeightLessNull += allHeight;
                                }
                                if(this.data[i][j] > 0)
                                    startY = startY - allHeightAbNull;
                                else
                                    startY = startY - allHeightLessNull;
                            //}
                           
                            //startY = 
                        }
                        if(height != 0)
                        {
                            //this.context.strokeRect(startX, startY, individualBarWidth, height);
                            this.context.fillRect(startX, startY, individualBarWidth, height);
                        }
                        y += height;
						
						var formatCellTrue = formatCell;
						if(this.arrFormatAdobeLabels && this.arrFormatAdobeLabels[i])
							formatCellTrue = this.arrFormatAdobeLabels[i][j];
						var catName;
						if(this.catNameLabels && this.catNameLabels[i] && this.catNameLabels[i][j])
							catName = this.catNameLabels[i][j];
						this.coords.push([startX, startY, individualBarWidth, height, formatCellTrue, this.firstData[i][j], catName]);
                    }
                }

            this.context.closePath();
			}
        }
    }

    /**
    * Draws the labels for the graph
    */
    OfficeExcel.Bar.prototype.DrawLabels = function (isFormatCell)
    {
        var context    = this.context;
        var labels     = this._otherProps._labels;
		var scaleFactor = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scaleFactor = OfficeExcel.drawingCtxCharts.scaleFactor;

        // Draw the Y axis labels:
        if (this._otherProps._ylabels) {
            this.Drawlabels_top(isFormatCell);
            this.Drawlabels_bottom(isFormatCell);
        }

        /**
        * The X axis labels
        */
        if (typeof(labels) == 'object' && labels && this._otherProps._xlabels) {

            var yOffset = 13;

            /**
            * Text angle
            */
            var angle  = 0;
            var halign = 'center';

            // Draw the X axis labels
            context.fillStyle = this._otherProps._text_color;
            
            // How wide is each bar
            var barWidth = (OfficeExcel.GetWidth(this) - this._chartGutter._right - this._chartGutter._left) / labels.length;
            
            // Reset the xTickGap
            var xTickGap = (OfficeExcel.GetWidth(this) - this._chartGutter._right - this._chartGutter._left) / labels.length

            // Draw the X tickmarks
            var i=0;
            var font = this._otherProps._xlabels_font;
			var bold = this._otherProps._xlabels_bold;
			var textOptions = 
			{
				color: this._otherProps._xlabels_color,
				italic: this._otherProps._xlabels_italic,
				underline: this._otherProps._xlabels_underline
			}
			var text_size  = this._otherProps._xlabels_size;
			
            if('auto' == this._otherProps._ylabels_count)
                yOffset =+ 23;
				
			var countLabels = 0;
			var axisOxAngleOptions;
			if(this._otherProps._axisOxAngleOptions && this._otherProps._axisOxAngleOptions.angle)
			{
				axisOxAngleOptions = this._otherProps._axisOxAngleOptions;
				angle = this._otherProps._axisOxAngleOptions.angle;
			}
			var diffWidth;
			var diffHeight;
            for (var x=this._chartGutter._left + (xTickGap / 2); x<=OfficeExcel.GetWidth(this) - this._chartGutter._right; x+=xTickGap) {
                    if('auto' == this._otherProps._ylabels_count)
                    {
						diffWidth = axisOxAngleOptions ? (axisOxAngleOptions[countLabels]*Math.sin(angle*Math.PI/180))/(4) : 0;
						diffHeight = axisOxAngleOptions ? (axisOxAngleOptions[countLabels]*Math.cos(angle*Math.PI/180) - 10) : 0;
						OfficeExcel.Text(context, font,
                                      text_size,
                                      x - diffWidth,
                                      this.nullPositionOX + yOffset*scaleFactor + diffHeight,
                                      String(labels[i++]),
                                      null,
                                      halign,
                                      null,
                                      angle,
									  null,
									  bold,
									  null,
									  textOptions);
                    }
                 countLabels++;
            }
        }
    }

    /**
    * Draws the X axis at the top
    */
    OfficeExcel.Bar.prototype.Drawlabels_top = function (isFormatCell)
    {
        this.context.beginPath();
        this.context.fillStyle = this._otherProps._text_color;
        this.context.strokeStyle = 'black';

        if (this._otherProps._xaxispos == 'top') {

            var context    = this.context;
            var interval   = (this.grapharea * (1/5) );
            var text_size  = this._otherProps._ylabels_size;
            var units_pre  = this._otherProps._units_pre;
            var units_post = this._otherProps._units_post;
            var align      = this._otherProps._yaxispos == 'left' ? 'right' : 'left';
            var font       = this._otherProps._ylabels_font;
            var numYLabels = this._otherProps._ylabels_count;
			var bold 	   = this._otherProps._ylabels_bold;
			var textOptions = 
			{
				color: this._otherProps._ylabels_color,
				italic: this._otherProps._ylabels_italic,
				underline: this._otherProps._ylabels_underline
			}

            var xpos  = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : this.canvas.width - this._chartGutter._right + 5;
            var boxed = false;
            
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
						OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText(elemArr.toString(),isFormatCell),null, align, boxed, null, null, bold, null, textOptions);
					else
						OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText("-" + elemArr.toString(),isFormatCell),null, align, boxed, null, null, bold, null, textOptions);	
                }
            }
          
        }
        
        this.context.fill();
        this.context.stroke();
    }

    /**
    * Draws the X axdis at the bottom (the default)
    */
    OfficeExcel.Bar.prototype.Drawlabels_bottom = function (isFormatCell)
    {

        this.context.beginPath();
        this.context.fillStyle = this._otherProps._text_color;
        this.context.strokeStyle = 'black';

        if (this._otherProps._xaxispos != 'center' && this._otherProps._xaxispos != 'top') {
            
            var interval   = (this.grapharea * (1/5) );
            var text_size  = this._otherProps._xlabels_size;
            var units_pre  = this._otherProps._units_pre;
            var units_post = this._otherProps._units_post;
            var context    = this.context;
            var align      = this._otherProps._yaxispos == 'left' ? 'right' : 'left';
            var font       = this._otherProps._xlabels_font;
            var numYLabels = this._otherProps._ylabels_count;
			var bold 	   = this._otherProps._xlabels_bold;
			var textOptions = 
			{	
				color: this._otherProps._xlabels_color,
				italic: this._otherProps._xlabels_italic,
				underline: this._otherProps._xlabels_underline
			}

            var xpos  = this._otherProps._yaxispos == 'left' ? this._chartGutter._left - 5 : OfficeExcel.GetWidth(this) - this._chartGutter._right + 5;
            var boxed = false;
            
            // 1 label
            if('auto' == numYLabels)
            {
                 for (var i=0; i<this.scale.length; ++i) {
                    var stepY;
                    stepY = this.scale[this.scale.length -1 - i]
					OfficeExcel.Text(context,font,text_size,xpos - 5,this._chartGutter._top + this.halfTextHeight + ((i/this.scale.length) * (this.grapharea) ),OfficeExcel.numToFormatText(stepY.toString(),isFormatCell) + units_post,null,align,boxed, null, null, bold, null, textOptions);
                }
            }
            
            /**
            * Show the minimum value if its not zero
            */
            if (this._otherProps._ymin != 0 || 'auto' == numYLabels) {
			if(typeof(this._otherProps._ymin) == 'string' && this._otherProps._ymin.search('E') != -1)
			{
				OfficeExcel.Text(context,
                            font,
                            text_size,
                            xpos - 5,
                            this.canvas.height - this._chartGutter._bottom,
                            this.min + units_post,
                            'center',
                            align,
                            boxed, null, null, bold, null, textOptions);
			}
			else{
				OfficeExcel.Text(context,
                            font,
                            text_size,
                            xpos - 5,
                            this.canvas.height - this._chartGutter._bottom,
							OfficeExcel.numToFormatText(this.min,isFormatCell) + units_post,
                            //OfficeExcel.number_format(this,(this.min.toFixed((this._otherProps._scale_decimals))), units_pre, units_post),
                            'center',
                            align,
                            boxed, null, null, bold, null, textOptions);
				}   
            }
        }
        
        this.context.fill();
        this.context.stroke();
    }
	
	OfficeExcel.Bar.prototype.DrawAboveLabels = function (isFormatCell)
    {
		// This bit draws the text labels that appear above the bars if requested
		if (this._otherProps._labels_above && this.coords) {

			  // Get these variables outside of the loop
			var xaxispos      = this._otherProps._xaxispos;
			var width         = (this.canvas.width - this._chartGutter._left - this._chartGutter._right ) / this.data.length;
			var hmargin       = this._otherProps._hmargin;
			var strokeStyle   = this._otherProps._strokecolor;
			var colors        = this._otherProps._colors;
			var startX;
			var startY;
			var individualBarWidth;
			var value = 0;
			
			var bold = this._otherProps._labels_above_bold;
			var textOptions = 
			{
				color: this._otherProps._labels_above_color,
				italic: this._otherProps._labels_above_italic,
				underline: this._otherProps._labels_above_underline
			};
			for(var i = 0; i < this.coords.length; i ++)
			{
				
				this.context.strokeStyle = 'rgba(0,0,0,0)';
				startX = this.coords[i][0];
				startY = this.coords[i][1];
				individualBarWidth = this.coords[i][2];
				
				//this._otherProps._labels_above_coords
				var formatCellTrue = isFormatCell;
				if(this.coords[i][4])
					formatCellTrue = this.coords[i][4];
				if(this.coords[i][4] == null && !this.coords[i][5])
					value = "";
				else if(this.coords[i][5] != undefined)
					value = this.coords[i][5];
				if(value != '')
					value = OfficeExcel.numToFormatText(OfficeExcel.num_round(value),formatCellTrue);
				//catName
				if(this.catNameLabels && this.coords[i][6])
					value = this.coords[i][6];
					
				this.context.fillStyle = this._otherProps._text_color;
				OfficeExcel.Text(this.context,
							this._otherProps._labels_above_font,
							typeof(this._otherProps._labels_above_size) == 'number' ? this._otherProps._labels_above_size : this._otherProps._text_size - 3,startX + (individualBarWidth / 2),
							startY - 2,
							//OfficeExcel.number_format(this, OfficeExcel.num_round(this.data[i][j]),this._otherProps._units_pre,this._otherProps._units_post),
							value,
							null,
							'center',
							null,
							null,
							null,
							bold,
							null,
							textOptions);
			}
		}
	}