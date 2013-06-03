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
        var text_font   = obj._otherProps._text_font;
        
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;
        var gutterBottom = obj._chartGutter._bottom;

        var hpos        = obj._otherProps._yaxispos == 'right' ? gutterLeft + 10 : OfficeExcel.GetWidth(obj) - gutterRight - 10;
        var vpos        = gutterTop + 10;
        var title       = obj._chartTitle._text;
        var blob_size   = text_size; // The blob of color
        var hmargin      = 8; // This is the size of the gaps between the blob of color and the text
        var vmargin      = 4; // This is the vertical margin of the key
        var fillstyle    = obj._otherProps._key_background;
        var strokestyle  = '#333';
        var height       = 0;
        var width        = 0;


        obj.coordsKey = [];


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
        /*if (typeof(obj._otherProps._key_halign) == 'string') {
            if (obj._otherProps._key_halign == 'left') {
                hpos = gutterLeft + 10;
            } else if (obj._otherProps._key_halign == 'right') {
                hpos = OfficeExcel.GetWidth(obj) - gutterRight  - width;
            }
        }*/
        
        
        
        
        var widthAllKey = 70*(key.length);
        if((obj._otherProps._key_halign == 'top' || obj._otherProps._key_halign == 'bottom' ))
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
		}
        
        var heightKeyVer = key.length*24;
        var heightKey = 24;
        var widthKey = textWidth*key.length + key.length*30 + 11*(key.length-1);
        //var widthKeyVer = textWidth + 30;
        var widthKeyVer = 31 + 30;
        //var margin = obj._chartGutter._top - 14;
        
        if (typeof(obj._otherProps._key_halign) == 'string') {
            if (obj._otherProps._key_halign == 'left') {
                hpos = 20;
                vpos = canvas.height/2 - heightKeyVer/2;
            } else if (obj._otherProps._key_halign == 'right') {
                hpos = canvas.width -  widthKeyVer - 10;
                vpos = canvas.height/2 - heightKeyVer/2;
            }
            else if (obj._otherProps._key_halign == 'top') {
                hpos = canvas.width/2 - widthAllKey/2;
                if(obj._chartTitle._text != null && obj._chartTitle._text != '')
                    vpos = text_size + 20 + obj._chartTitle._size + 20;
                else
                    vpos = text_size + 20;
            }
            else if (obj._otherProps._key_halign == 'bottom') {
                hpos = canvas.width/2 - widthAllKey/2;
                vpos = canvas.height - 10;
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


        // Stipulate the shadow for the key box
        if (obj._otherProps._key_shadow) {
            context.shadowColor   = obj._otherProps._key_shadow_color;
            context.shadowBlur    = obj._otherProps._key_shadow_blur;
            context.shadowOffsetX = obj._otherProps._key_shadow_offsetx;
            context.shadowOffsetY = obj._otherProps._key_shadow_offsety;
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
        
                OfficeExcel.NoShadow(obj);
        
            } 
            else if(null != obj._otherProps._key_rounded) {
                context.strokeRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * OfficeExcel.getKeyLength(key)));
                context.fillRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * OfficeExcel.getKeyLength(key)));
            }
        }

        OfficeExcel.NoShadow(obj);

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
            var horPos = false;
            if(obj._otherProps._key_halign == 'bottom' || obj._otherProps._key_halign == 'top')
            {
                horPos = true;
                //colors = OfficeExcel.array_reverse(colors)
                //key = OfficeExcel.array_reverse(key)
            }
           
            if(horPos)
            {
                 for (var i=0; i<key.length; i++) {
                // Draw the blob of color
                    
                
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

                                context.moveTo(hpos + (65 * i) + (text_size * i) ,vpos - text_size);
                                context.lineTo(hpos + blob_size + (65 * i) + (text_size * i) + 16, vpos - text_size);

                        context.stroke();

                    } else {
                        context.fillStyle =  colors[i];
                        context.fillRect(hpos + blob_size + (65 * i) + (text_size * i), vpos  - text_size - 10, text_size - 2, text_size + 1 - 2);
                        //context.fillRect(hpos, vpos + (10 * j) + (text_size * j) - text_size, 22, obj._otherProps._linewidth);
                    }

                    context.beginPath();
                
                    context.fillStyle = 'black';
                     OfficeExcel.Text(context,
                            text_font,
                            text_size,
                            hpos + blob_size + (65 * i) + (text_size * i) + 19,
                            vpos-text_size,
                            key[i]);
                }
            }
            else
            {
                for (var i=key.length - 1; i>=0; i--) {
            
                    var j = Number(i) + 1;
                    
                    // Draw the blob of color
                        
                    
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

                            context.moveTo(hpos - 8, vpos + (15 * j) + (text_size * j) - text_size + (blob_size / 2));
                            context.lineTo(hpos + blob_size + 8, vpos + (15 * j) + (text_size * j) - text_size + (blob_size / 2));
                            //context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                            //context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                        context.stroke();

                    } else {
                        context.fillStyle =  colors[i];
                        context.fillRect(hpos + 5 + 2, vpos + (15 * j) + (text_size * j) - text_size, text_size - 2, text_size + 1 - 2);
                        //context.fillRect(hpos, vpos + (10 * j) + (text_size * j) - text_size, 22, obj._otherProps._linewidth);
                    }

                    context.beginPath();
                
                    context.fillStyle = 'black';
                    
                    OfficeExcel.Text(context,
                            text_font,
                            text_size,
                            hpos + blob_size + 5 + 5,
                            vpos + (15 * j) + (text_size * j),
                            key[i]);
                }
            }
                

            if (obj._otherProps._key_interactive) {
            
                var px = hpos + 5;
                var py = vpos + (5 * j) + (text_size * j) - text_size;
                var pw = width - 5 - 5 - 5;
                var ph = text_size;
                
                
                obj.coordsKey.push([px, py, pw, ph]);
            }

        context.fill();

        /**
        * Install the interactivity event handler
        */
        if (obj._otherProps._key_interactive) {
        
            OfficeExcel.Register(obj);
        
            var key_mousemove = function (e)
            {
                var obj         = e.target.__object__;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
        
                for (var i=0; i<obj.coordsKey.length; ++i) {
                
                    var px = obj.coordsKey[i][0];
                    var py = obj.coordsKey[i][1];
                    var pw = obj.coordsKey[i][2];
                    var ph = obj.coordsKey[i][3];
        
                    if (   mouseX > (px-2) && mouseX < (px + pw + 2) && mouseY > (py - 2) && mouseY < (py + ph + 2) ) {
                        
                        // Necessary?
                        //var index = obj.coordsKey.length - i - 1;
        
                        canvas.style.cursor = 'pointer';
                        

                        
                        return;
                    }
                    
                    canvas.style.cursor = 'default';
                    
                    if (typeof(obj._tooltip._tooltips) == 'object' && typeof(canvas_onmousemove_func) == 'function') {
                        canvas_onmousemove_func(e);
                    }
                }
            }
            canvas.addEventListener('mousemove', key_mousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', key_mousemove);
        
        
            var key_click = function (e)
            {
                OfficeExcel.Redraw();

                var obj         = e.target.__object__;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                
                /**
                * Hand over highlighting the pie chart key to another function
                */
                if (obj.type == 'pie') {
                    return key_onclick_pie(e);
                }

                OfficeExcel.DrawKey(obj, obj._otherProps._key, obj._otherProps._colors);
        
                for (var i=0; i<obj.coordsKey.length; ++i) {
                
                    var px = obj.coordsKey[i][0];
                    var py = obj.coordsKey[i][1];
                    var pw = obj.coordsKey[i][2];
                    var ph = obj.coordsKey[i][3];
        
                    if (   mouseX > px && mouseX < (px + pw) && mouseY > py && mouseY < (py + ph) ) {

                        /**
                        * Loop thru all objects. If they're objects with
                        * key_interactive enabled, redraw them
                        */
                        for (j in OfficeExcel.objects) {
                            if (OfficeExcel.objects[j] && OfficeExcel.objects[j].Get && OfficeExcel.objects[j]._otherProps._key_interactive) {
                                
                                if (OfficeExcel.objects[j]._otherProps._exploded) {
                                    OfficeExcel.objects[j]._otherProps._exploded = [];
                                }
                        
                                OfficeExcel.Clear(OfficeExcel.objects[j].canvas);
                                OfficeExcel.objects[j].Draw();
                            }
                        }
                        var index = obj.coordsKey.length - i - 1;

                        // HIGHLIGHT THE LINE HERE
                        context.beginPath();
                            context.fillStyle = 'rgba(255,255,255,0.9)';
                            context.fillRect(AA(obj, obj._chartGutter._left),AA(obj, obj._chartGutter._top),canvas.width - obj._chartGutter._left - obj._chartGutter._right,canvas.height - obj._chartGutter._top - obj._chartGutter._bottom);
                        context.fill();

                        context.beginPath();
                            context.strokeStyle = obj._otherProps._colors[index];
                            context.lineWidth  = obj._otherProps._linewidth;
                            if (obj.coords2 &&obj.coords2[index] &&obj.coords2[index].length) {
                                for (var j=0; j<obj.coords2[index].length; ++j) {
                                    
                                    var x = obj.coords2[index][j][0];
                                    var y = obj.coords2[index][j][1];
                                
                                    if (j == 0) {
                                        context.moveTo(x, y);
                                    } else {
                                        context.lineTo(x, y);
                                    }
                                }
                            }
                        context.stroke();


                        context.lineWidth  = 1;
                        context.beginPath();
                            context.strokeStyle = 'black';
                            context.fillStyle   = 'white';
                            
                            OfficeExcel.SetShadow(obj, 'rgba(0,0,0,0.5)', 0,0,10);

                            context.strokeRect(px - 2, py - 2, pw + 4, ph + 4);
                            context.fillRect(px - 2, py - 2, pw + 4, ph + 4);

                        context.stroke();
                        context.fill();


                        OfficeExcel.NoShadow(obj);


                        context.beginPath();
                            context.fillStyle = obj._otherProps._colors[index];
                            context.fillRect(px, py, blob_size, blob_size);
                        context.fill();

                        context.beginPath();
                            context.fillStyle = obj._otherProps._text_color;
                        
                            OfficeExcel.Text(context,
                                        obj._otherProps._text_font,
                                        obj._otherProps._text_size,
                                        px + 5 + blob_size,
                                        py + ph,
                                        obj._otherProps._key[obj._otherProps._key.length - i - 1]
                                       );
                        context.fill();

        
                        canvas.style.cursor = 'pointer';
                        
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                    }
                    
                    canvas.style.cursor = 'default';
                }
            }
            canvas.addEventListener('click', key_click, false);
            OfficeExcel.AddEventListener(canvas.id, 'click', key_click);
            
            /**
            * This function handles the Pie chart interactive key (the click event)
            * 
            * @param object e The event object
            */
            var key_onclick_pie = function (e)
            {
                var canvas      = e.target;
                var context     = canvas.getContext('2d');
                var obj         = e.target.__object__;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];

                //OfficeExcel.DrawKey(obj, obj._otherProps._key, obj._otherProps._colors);

                for (var i=0; i<obj.coordsKey.length; ++i) {

                    var px = obj.coordsKey[i][0];
                    var py = obj.coordsKey[i][1];
                    var pw = obj.coordsKey[i][2];
                    var ph = obj.coordsKey[i][3];
        
                    if (   mouseX > (px - 2) && mouseX < (px + pw + 2) && mouseY > (py - 2) && mouseY < (py + ph + 2) ) {
                        
                        var index = obj.coordsKey.length - i - 1;


                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();



                        // ==========================================================================
                        var highlight_key = function ()
                        {
                            context.lineWidth  = 1;
                            context.beginPath();
                                context.strokeStyle = 'black';
                                context.fillStyle   = 'white';
                                
                                OfficeExcel.SetShadow(obj, 'rgba(0,0,0,0.5)', 0,0,10);
    
                                context.strokeRect(px - 2, py - 2, pw + 4, ph + 4);
                                context.fillRect(px - 2, py - 2, pw + 4, ph + 4);
    
                            context.stroke();
                            context.fill();
    
    
                            OfficeExcel.NoShadow(obj);
    
    
                            context.beginPath();
                                context.fillStyle = obj._otherProps._colors[index];
                                context.fillRect(px, py, blob_size, blob_size);
                            context.fill();
    
                            context.beginPath();
                                context.fillStyle = obj._otherProps._text_color;
                            
                                OfficeExcel.Text(context,
                                            obj._otherProps._text_font,
                                            obj._otherProps._text_size,
                                            px + 5 + blob_size,
                                            py + ph,
                                            obj._otherProps._key[obj._otherProps._key.length - i - 1]
                                           );
                            context.fill();
                        }
                        // ==========================================================================

                        setTimeout(function (){obj._otherProps._exploded[index] = 2;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 20);
                        setTimeout(function (){obj._otherProps._exploded[index] = 4;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 40);
                        setTimeout(function (){obj._otherProps._exploded[index] = 6;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 60);
                        setTimeout(function (){obj._otherProps._exploded[index] = 8;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 80);
                        setTimeout(function (){obj._otherProps._exploded[index] = 10;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 100);
                        setTimeout(function (){obj._otherProps._exploded[index] = 12;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 120);
                        setTimeout(function (){obj._otherProps._exploded[index] = 14;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 140);
                        setTimeout(function (){obj._otherProps._exploded[index] = 16;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 160);
                        setTimeout(function (){obj._otherProps._exploded[index] = 18;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 180);
                        setTimeout(function (){obj._otherProps._exploded[index] = 20;OfficeExcel.Clear(obj.canvas);obj.Draw();highlight_key();}, 200);
                        
                        /**
                        * This is here so that when calling the Redraw function the Pie chart
                        * is drawn unexploded
                        */
                        setTimeout(function (){obj._otherProps._exploded[index] = 0;}, 250);

                        return;
                    } else {
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                    }
                }

                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
            }
            
            /**
            * The window onclick for the pie chart
            */
            var key_interactive_click = function (e)
            {
                if (obj && obj.type == 'pie') {
                    obj._otherProps._exploded = [];
                }
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
            }
            window.addEventListener('click', key_interactive_click, false);
            OfficeExcel.AddEventListener('window_' + canvas.id, 'click', key_interactive_click);
        }
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

            if (obj._otherProps._key_shadow) {
                context.shadowColor   = obj._otherProps._key_shadow_color;
                context.shadowBlur    = obj._otherProps._key_shadow_blur;
                context.shadowOffsetX = obj._otherProps._key_shadow_offsetx;
                context.shadowOffsetY = obj._otherProps._key_shadow_offsety;
            }

            
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


            OfficeExcel.NoShadow(obj);
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