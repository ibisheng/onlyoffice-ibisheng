    OfficeExcel.DrawKey = function (obj, key, colors)
    {
        var canvas  = obj.canvas;
        var context = obj.context;
        context.lineWidth = 1;

        context.beginPath();

        /**
        * Key positioned in the gutter
        */
        var keypos   = obj._otherProps._key_position;
        var textsize = obj._otherProps._text_size;

        /**
        * Account for null values in the key
        */
        var key_non_null    = [];
        var colors_non_null = [];
        for (var i=0; i<key.length; ++i) {
            if (key[i] != null) {
                colors_non_null.push(colors[i]);
                key_non_null.push(key[i]);
            }
        }
        
        key    = key_non_null;
        colors = colors_non_null;



        if (keypos && keypos == 'gutter') {
    
            OfficeExcel.DrawKey_gutter(obj, key, colors);


        /**
        * In-graph style key
        */
        } else if (keypos && keypos == 'graph') {

            OfficeExcel.DrawKey_graph(obj, key, colors);
        
        } else {
            alert('[COMMON] (' + obj.id + ') Unknown key position: ' + keypos);
        }
    }

    /**
    * This does the actual drawing of the key when it's in the graph
    * 
    * @param object obj The graph object
    * @param array  key The key items to draw
    * @param array colors An aray of colors that the key will use
    */
    OfficeExcel.DrawKey_graph = function (obj, key, colors)
    {
        var canvas      = obj.canvas;
        var context     = obj.context;
        var text_size   = typeof(obj._otherProps._key_text_size) == 'number' ? obj._otherProps._key_text_size : obj._otherProps._text_size;
        var text_font   = obj._otherProps._key_text_font;
        
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;
        var gutterBottom = obj._chartGutter._bottom;

        var hpos        = obj._otherProps._yaxispos == 'right' ? gutterLeft + 10 : OfficeExcel.GetWidth(obj) - gutterRight - 10;
        var vpos        = gutterTop + 10;
        var blob_size   = text_size; // The blob of color
        var hmargin      = 8; // This is the size of the gaps between the blob of color and the text
        var vmargin      = 4; // This is the vertical margin of the key
        var fillstyle    = obj._otherProps._key_background;
        var strokestyle  = '#333';
        var height       = 0;
        var width        = 0;
		var scale = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scale = OfficeExcel.drawingCtxCharts.scaleFactor;
		
		var sizeLine = 26*scale;
		if(bar._otherProps._key_color_shape != 'line')
			sizeLine = 8*scale;


        // Need to set this so that measuring the text works out OK
        context.font = text_size + 'pt ' + obj._otherProps._text_font;

        // Work out the longest bit of text
        for (i=0; i<key.length; ++i) {
            width = Math.max(width, context.measureText(key[i]).width);
        }
        var textWidth = width;
        
        width += 5;
        width += blob_size;
        width += 5;
        width += 5;
        width += 5;

        /**
        * Now we know the width, we can move the key left more accurately
        */
        if (   obj._otherProps._yaxispos == 'left'
            || (obj.type == 'pie' && !obj._otherProps._yaxispos)
            || (obj.type == 'hbar' && !obj._otherProps._yaxispos)
            || (obj.type == 'hbar' && obj._otherProps._yaxispos == 'center')
            || (obj.type == 'rscatter' && !obj._otherProps._yaxispos)
            || (obj.type == 'radar' && !obj._otherProps._yaxispos)
            || (obj.type == 'rose' && !obj._otherProps._yaxispos)
            || (obj.type == 'funnel' && !obj._otherProps._yaxispos)
            || (obj.type == 'vprogress' && !obj._otherProps._yaxispos)
            || (obj.type == 'hprogress' && !obj._otherProps._yaxispos)
           ) {

            hpos -= width;
        }

        /**
        * Horizontal alignment
        */
        
		var scale = 1;
		if(OfficeExcel.drawingCtxCharts && OfficeExcel.drawingCtxCharts.scaleFactor)
			scale = OfficeExcel.drawingCtxCharts.scaleFactor;
        var widthAllKey = 70*(key.length);
        /*if((obj._otherProps._key_halign == 'top' || obj._otherProps._key_halign == 'bottom' ))
		{
            if(widthAllKey > obj.canvas.width - 50)
			{
				var lengthKey = Math.round((obj.canvas.width - 50)/(70));
				if(lengthKey == 0)
					lengthKey = 1;
				obj._otherProps._key = obj._otherProps._key.slice(0,lengthKey);
                key = obj._otherProps._key;
			}
            widthAllKey = 70*(key.length);
		}*/
		
		var drwContext = OfficeExcel.drawingCtxCharts;
		var font = getFontProperties("key");
		if(obj._otherProps._key_halign == 'top' || obj._otherProps._key_halign == 'bottom' && key.length != 0)
		{
			widthAllKey = 0;
			var widthEveryElemKey = [];
			var widthKey;
			for(var l = 0; l < key.length; l++)
			{
				var props1 = getMaxPropertiesText(drwContext,font,key[l]);
				if(bar._otherProps._key_max_width)
					widthKey = bar._otherProps._key_max_width;
				else
					widthKey = props1.width;
				widthAllKey += widthKey + (3)*scale + sizeLine;
				widthEveryElemKey[l] = widthKey + (3)*scale + sizeLine;
			}
		}
		
		heigthTextKey = 24;
		if(key && key.length != 0)
		{
			var props = getMaxPropertiesText(drwContext,font,bar._otherProps._key);
			heigthTextKey = (drwContext.getHeightText()/0.75)*scale;
		}
		
        var heightKeyVer = key.length*heigthTextKey;
		
        var heightKey = 24;
        var widthKey = textWidth*key.length + key.length*30 + 11*(key.length-1);
        //var widthKeyVer = textWidth + 30;
        var widthKeyVer = 61;
        //var margin = obj._chartGutter._top - 14;
        
        if (typeof(obj._otherProps._key_halign) == 'string') {
            if (obj._otherProps._key_halign == 'left') {
                hpos = calculatePosiitionObjects("key_hpos");
                vpos = canvas.height/2 - heightKeyVer/2;
            } else if (obj._otherProps._key_halign == 'right') {
                hpos = calculatePosiitionObjects("key_hpos");
                vpos = canvas.height/2 - heightKeyVer/2;
            }
            else if (obj._otherProps._key_halign == 'top') {
                hpos = canvas.width/2 - widthAllKey/2;
                vpos = calculatePosiitionObjects("key_hpos");
            }
            else if (obj._otherProps._key_halign == 'bottom') {
                hpos = canvas.width/2 - widthAllKey/2;
                vpos = calculatePosiitionObjects("key_hpos");
            }
        }


        /**
        * Specific location coordinates
        */
        if (typeof(obj._otherProps._key_position_x) == 'number') {
            hpos = obj._otherProps._key_position_x;
        }
        
        if (typeof(obj._otherProps._key_position_y) == 'number') {
            vpos = obj._otherProps._key_position_y;
        }

        // Draw the box that the key resides in
        context.beginPath();
            context.fillStyle   = obj._otherProps._key_background;
            context.strokeStyle = 'black';
        if('radar' == obj.type)
        {
            colors = obj._otherProps._strokecolor
        }
        if (arguments[3] != false) {

            context.lineWidth = typeof(obj._otherProps._key_linewidth) == 'number' ? obj._otherProps._key_linewidth : 1;

            // The older square rectangled key
            if (obj._otherProps._key_rounded == true) {
                context.beginPath();
                    context.strokeStyle = strokestyle;
                    OfficeExcel.strokedCurvyRect(context, AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * OfficeExcel.getKeyLength(key)),4);
        
                context.stroke();
                context.fill();
            } 
            else if(null != obj._otherProps._key_rounded) {
                context.strokeRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * OfficeExcel.getKeyLength(key)));
                context.fillRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * OfficeExcel.getKeyLength(key)));
            }
        }

        context.beginPath();

            /**
            * Custom colors for the key
            */
            if (obj._otherProps._key_colors) {
                colors = obj._otherProps._key_colors;
            }
            //colors = OfficeExcel.array_reverse(colors);
            // Draw the labels given
            if( obj._otherProps._autoGrouping == 'stacked' ||  obj._otherProps._autoGrouping == 'stackedPer' ||  obj._otherProps._type != undefined && obj._otherProps._type == 'accumulative' && 'bar' == obj.type)
            {
                colors = OfficeExcel.array_reverse(colors)
                if('hbar' != obj.type)
                    key = OfficeExcel.array_reverse(key)
            }
           
            if(obj._otherProps._key_halign == 'bottom' || obj._otherProps._key_halign == 'top')
            {
                 
				var levels;
				if(obj._otherProps._key_levels)
					levels = obj._otherProps._key_levels;
				var gVpos = vpos;
				//если не умещается легенда, делаем её в несколько строк
				if(levels && levels.length)
				{
					
					var widthCurKey = 0;
					for(var i = 0; i < levels[0].length; i++)
					{
						widthCurKey += widthEveryElemKey[i];
					}
					hpos = (canvas.width - widthCurKey)/2;
					var startLevelNum = 0;
					var elemeNum = 0;;
					for (var i = 0; i < levels.length; i++) {
						startLevelNum = elemeNum;
						for(var j = 0; j < levels[i].length; j++)
						{
							// Draw the blob of color
							var leftDiff = 0;
							for(var n = startLevelNum ; n < elemeNum; n++)
							{
								leftDiff += widthEveryElemKey[n];
							}
							if(obj._otherProps._key_halign == 'top')
								vpos = gVpos + props.height*(i)*scale;
							else
								vpos = gVpos - props.height*(levels.length - i - 1)*scale;
							if (obj._otherProps._key_color_shape == 'line') {
								context.beginPath();
									context.strokeStyle = colors[elemeNum];
									context.lineWidth = '2.7'
										
										context.moveTo(hpos + leftDiff + 2*scale,vpos - props.height/2);
										context.lineTo(hpos + leftDiff + sizeLine + 2*scale, vpos - props.height/2);

								context.stroke();

							} else {
								context.fillStyle =  colors[elemeNum];
								context.fillRect(hpos + leftDiff + 2*scale, vpos - 7*scale, 7*scale, 7*scale);
							}

							context.beginPath();
						
							context.fillStyle = 'black';
							OfficeExcel.Text(context,
									text_font,
									text_size,
									hpos + leftDiff + sizeLine + 3*scale,
									vpos,
									levels[i][j]);
									
							elemeNum++;
						}
					}
				}				
				else
				{
					for (var i=0; i<key.length; i++) {
						// Draw the blob of color
						var leftDiff = 0;
						for(var n = 0 ; n < i; n++)
						{
							leftDiff += widthEveryElemKey[n];
						}
						
						
						if (obj._otherProps._key_color_shape == 'circle') {
							context.beginPath();
								context.strokeStyle = 'rgba(0,0,0,0)';
								context.fillStyle = colors[i];
								context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
							context.fill();
						
						} else if (obj._otherProps._key_color_shape == 'line') {
							context.beginPath();
								context.strokeStyle = colors[i];
								context.lineWidth = '2.7'

									context.moveTo(hpos + leftDiff + 2*scale,vpos - props.height/2);
									context.lineTo(hpos + leftDiff + sizeLine + 2*scale, vpos - props.height/2);

							context.stroke();

						} else {
							context.fillStyle =  colors[i];
							context.fillRect(hpos + leftDiff + 2*scale, vpos - 7*scale, 7*scale, 7*scale);
							//context.fillRect(hpos, vpos + (10 * j) + (text_size * j) - text_size, 22, obj._otherProps._linewidth);
						}

						context.beginPath();
					
						context.fillStyle = 'black';
						OfficeExcel.Text(context,
								text_font,
								text_size,
								hpos + leftDiff + sizeLine + 3*scale,
								vpos,
								key[i]);
					}
				}	
            }
            else
            {
                for (var i=key.length - 1; i>=0; i--) {
            
                    var j = Number(i) + 1;
                    
                    // Draw the blob of color
                        
                    var diffKeyAndLine = 3*scale;
                    if (obj._otherProps._key_color_shape == 'circle') {
                        context.beginPath();
                            context.strokeStyle = 'rgba(0,0,0,0)';
                            context.fillStyle = colors[i];
                            context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
                        context.fill();
                    
                    } else if (obj._otherProps._key_color_shape == 'line') {
                        context.beginPath();
                            context.strokeStyle = colors[i];
                            context.lineWidth = '2.7'

                            context.moveTo(hpos, vpos + heigthTextKey*j - heigthTextKey + (heigthTextKey / 2));
                            context.lineTo(hpos + sizeLine, vpos + heigthTextKey*j - heigthTextKey + (heigthTextKey / 2));
                            //context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                            //context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                        context.stroke();

                    } else {
                        context.fillStyle =  colors[i];
                        context.fillRect(hpos, vpos + heigthTextKey*j - props.height/2 - 7*scale, 7*scale, 7*scale);
                        diffKeyAndLine = 5;
                    }

                    context.beginPath();
                
                    context.fillStyle = 'black';
                    
                    OfficeExcel.Text(context,
                            text_font,
                            text_size,
                            hpos + sizeLine + diffKeyAndLine,
                            vpos + heigthTextKey*j - props.height/2,
                            key[i]);
                }
            }

        context.fill();
    }

    /**
    * This does the actual drawing of the key when it's in the gutter
    * 
    * @param object obj The graph object
    * @param array  key The key items to draw
    * @param array colors An aray of colors that the key will use
    */
    OfficeExcel.DrawKey_gutter = function (obj, key, colors)
    {
        var canvas      = obj.canvas;
        var context     = obj.context;
        var text_size   = typeof(obj._otherProps._key_text_size) == 'number' ? obj._otherProps._key_text_size : obj._otherProps._text_size;
        var text_font   = obj._otherProps._text_font;
        
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;
        var gutterBottom = obj._chartGutter._bottom;

        var hpos        = OfficeExcel.GetWidth(obj) / 2;
        var vpos        = (gutterTop / 2) - 5;
        var title       = obj._chartTitle._text;
        var blob_size   = text_size; // The blob of color
        var hmargin      = 8; // This is the size of the gaps between the blob of color and the text
        var vmargin      = 4; // This is the vertical margin of the key
        var fillstyle   = obj._otherProps._key_background;
        var strokestyle = 'black';
        var length      = 0;



        // Need to work out the length of the key first
        context.font = text_size + 'pt ' + text_font;
        for (i=0; i<key.length; ++i) {
            length += hmargin;
            length += blob_size;
            length += hmargin;
            length += context.measureText(key[i]).width;
        }
        length += hmargin;




        /**
        * Work out hpos since in the Pie it isn't necessarily dead center
        */
        if (obj.type == 'pie') {
            if (obj._otherProps._align == 'left') {
                var hpos = obj.radius + gutterLeft;
                
            } else if (obj._otherProps._align == 'right') {
                var hpos = obj.canvas.width - obj.radius - gutterRight;

            } else {
                hpos = canvas.width / 2;
            }
        }





        /**
        * This makes the key centered
        */  
        hpos -= (length / 2);


        /**
        * Override the horizontal/vertical positioning
        */
        if (typeof(obj._otherProps._key_position_x) == 'number') {
            hpos = obj._otherProps._key_position_x;
        }
        if (typeof(obj._otherProps._key_position_y) == 'number') {
            vpos = obj._otherProps._key_position_y;
        }



        /**
        * Draw the box that the key sits in
        */
        if (obj._otherProps._key_position_gutter_boxed) {

            context.beginPath();
                context.fillStyle = fillstyle;
                context.strokeStyle = strokestyle;

                if (obj._otherProps._key_rounded) {
                    OfficeExcel.strokedCurvyRect(context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin)
                    // Odd... OfficeExcel.filledCurvyRect(context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
                } else {
                    context.strokeRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
                    context.fillRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
                }
                
            context.stroke();
            context.fill();
        }


        /**
        * Draw the blobs of color and the text
        */

        // Custom colors for the key
        if (obj._otherProps._key_colors) {
            colors = obj._otherProps._key_colors;
        }

        for (var i=0, pos=hpos; i<key.length; ++i) {
            pos += hmargin;
            
            // Draw the blob of color - line
            if (obj._otherProps._key_color_shape =='line') {
                
                context.beginPath();
                    context.strokeStyle = colors[i];
                    context.moveTo(pos, vpos + (blob_size / 2));
                    context.lineTo(pos + blob_size, vpos + (blob_size / 2));
                context.stroke();
                
            // Circle
            } else if (obj._otherProps._key_color_shape == 'circle') {
                
                context.beginPath();
                    context.fillStyle = colors[i];
                    context.moveTo(pos, vpos + (blob_size / 2));
                    context.arc(pos + (blob_size / 2), vpos + (blob_size / 2), (blob_size / 2), 0, 6.28, 0);
                context.fill();


            } else {

                context.beginPath();
                    context.fillStyle = colors[i];
                    context.fillRect(pos, vpos, blob_size, blob_size);
                context.fill();
            }

            pos += blob_size;
            
            pos += hmargin;

            context.beginPath();
                context.fillStyle = 'black';
                OfficeExcel.Text(context, text_font, text_size, pos, vpos + text_size - 1, key[i]);
            context.fill();
            pos += context.measureText(key[i]).width;
        }
    }
    
    /**
    * Returns the key length, but accounts for null values
    * 
    * @param array key The key elements
    */
    OfficeExcel.getKeyLength = function (key)
    {
        var len = 0;

        for (var i=0; i<key.length; ++i) {
            if (key[i] != null) {
                ++len;
            }
        }

        return len;
    }