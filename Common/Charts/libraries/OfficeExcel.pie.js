    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};

    OfficeExcel.Pie = function (chartCanvas, data)
    {
        this.canvas            = chartCanvas;
        this.context           = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.total             = 0;
        this.subTotal          = 0;
        this.angles            = [];
        this.data              = data;
        this.type              = 'pie';

        /**
        * Compatibility with older browsers
        */
        OfficeExcel.CanvasBrowserCompat(this.context);

        // Chart gutter
        this._chartGutter   = new OfficeExcel.Gutter();
        // Other Props
        this._otherProps    = new OfficeExcel.OtherProps();

        /**
        * Calculate the total
        */
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
        }
    }

    /**
    * This draws the pie chart
    */
    OfficeExcel.Pie.prototype.Draw = function (min,max,ymin,ymax,isSkip,isFormatCell)
    {
        this.radius           = this._otherProps._radius ? this._otherProps._radius : this.getRadius();
        // this.centerx now defined below
        this.centery          = ((this.canvas.height - this._chartGutter._top - this._chartGutter._bottom) / 2) + this._chartGutter._top;
        this.subTotal         = 0;
        this.angles           = [];
        
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
        
        //Draw Area
        OfficeExcel.background.DrawArea(this);

        /**
        * The total of the array of values
        */
        this.total = OfficeExcel.array_sum(this.data);

        for (var i=0,len=this.data.length; i<len; i++) {
            
            var angle = ((this.data[i] / this.total) * (Math.PI * 2));

            // Draw the segment
            this.DrawSegment(angle,this._otherProps._colors[i],i == (this.data.length - 1), i);
        }


        /**
        * Redraw the seperating lines
        */
        this.DrawBorders();

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
        * Draw the labels
        */
        this.DrawLabels(isFormatCell);

        if (this._otherProps._key != null) {
            OfficeExcel.DrawKey(this, this._otherProps._key, this._otherProps._colors);
        }
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
		var curLabel;
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
        
        context.fillStyle = 'black';
        context.beginPath();

        /**
        * Draw the key (ie. the labels)
        */
        if (labels && labels.length) {

            var text_size = this._otherProps._text_size;

            for (lNum=0; lNum<labels.length; ++lNum) {
				isFormatCellTrue = isFormatCell;
				if(this.arrFormatAdobeLabels && this.arrFormatAdobeLabels[lNum])
					isFormatCellTrue = this.arrFormatAdobeLabels[0][lNum];
                /**
                * T|his ensures that if we're given too many labels, that we don't get an error
                */
                if (typeof(this.angles) == 'undefined') {
                    continue;
                }

                // Move to the centre
                context.moveTo(centerx,this.centery);
                
                var a = this.angles[lNum][0] + ((this.angles[lNum][1] - this.angles[lNum][0]) / 2);

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

                var angle = ((this.angles[lNum][1] - this.angles[lNum][0]) / 2) + this.angles[lNum][0];

                /**
                * Handle the additional "explosion" offset
                */
                if (typeof(this._otherProps._exploded) == 'object' && this._otherProps._exploded[lNum] || typeof(this._otherProps._exploded) == 'number') {

                    var t = ((this.angles[lNum][1] - this.angles[lNum][0]) / 2);
                    var seperation = typeof(this._otherProps._exploded) == 'number' ? this._otherProps._exploded : this._otherProps._exploded[lNum];

                    // Adjust the angles
                    var explosion_offsetx = (Math.cos(angle) * seperation);
                    var explosion_offsety = (Math.sin(angle) * seperation);
                } else {
                    var explosion_offsetx = 0;
                    var explosion_offsety = 0;
                }

                context.fillStyle = this._otherProps._text_color;
				if(this.catNameLabels && typeof this.catNameLabels[0][lNum] == "string")
				{
					curLabel = this.catNameLabels[0][lNum];
					isFormatCellTrue = "General";
				}
				else
					curLabel = labels[lNum];
                OfficeExcel.Text(context,
                            this._otherProps._text_font,
                            text_size,
                            centerx + explosion_offsetx + ((this.radius - 10)* Math.cos(a)),
                            this.centery + explosion_offsety + (((this.radius - 10) * Math.sin(a))),
                            OfficeExcel.numToFormatText(curLabel,isFormatCellTrue),
                            vAlignment,
                            hAlignment, false, null,null, bold, null, textOptions);
            }
            
            context.fill();
        }
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