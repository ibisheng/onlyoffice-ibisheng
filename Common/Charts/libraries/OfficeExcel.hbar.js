    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    OfficeExcel.HBar = function (chartCanvas, data)
    {
        this.canvas            = chartCanvas;
        this.context           = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.data              = data;
        this.type              = 'hbar';
        this.coords            = [];

        /**
        * Compatibility with older browsers
        */
        OfficeExcel.CanvasBrowserCompat(this.context);

        // Chart gutter
        this._chartGutter   = new OfficeExcel.Gutter();
        // Other Props
        this._otherProps    = new OfficeExcel.OtherProps();
        
        this.max = 0;
    }


    /**
    * The function you call to draw the bar chart
    */
    OfficeExcel.HBar.prototype.Draw = function (xmin,xmax,ymin,ymax,isSkip,isFormatCell)
    {
        /**
        * Stop the coords array from growing uncontrollably
        */
        this.coords = [];
        this.max    = 0;

		var value = 0;
        for (i=0; i<this.data.length; ++i) {
            if (typeof(this.data[i]) == 'object') {
                value = Number(OfficeExcel.array_max(this.data[i], true));
            } else {
                value = Number(Math.abs(this.data[i]));
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
        
        this.Drawbars(isFormatCell);
        this.DrawAxes();
        this.DrawLabels(isFormatCell);


        // Draw the key if necessary
        if (this._otherProps._key.length) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }
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
                } else if (typeof(this.data[i]) == 'object') {

                    for (j=0; j<this.data[i].length; ++j) {
                        // Set the fill/stroke colors
                        this.context.strokeStyle = this._otherProps._strokecolor;
						if(this._otherProps._colors[j])
							this.context.fillStyle = this._otherProps._colors[j];

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
        
        this.RedrawBars(isFormatCell);
    }
    
    
    /**
    * This function goes over the bars after they been drawn, so that upwards shadows are underneath the bars
    */
    OfficeExcel.HBar.prototype.RedrawBars = function (format)
    {
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
		};

        this.context.strokeStyle = this._otherProps._strokecolor;

        for (var i=0; i<coords.length; ++i) {
            /**
            * Draw labels "above" the bar
            */
            if (this._otherProps._labels_above && coords[i][6]) {

                this.context.fillStyle   = color;
                this.context.strokeStyle = 'black';

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