    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {isOfficeExcel:true,type:'common'};

    OfficeExcel.AllowAdjusting = function (obj)
    {
        var canvas  = obj.canvas;
        var context = obj.context;
        
        OfficeExcel.Register(obj);
        
        if (obj.type == 'thermometer') {
            var canvas_onmousedown = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var obj         = e.target.__object__;
                var id          = obj.id;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var coords      = obj.coords;

                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                
                if (   mouseX > obj.coords[0]
                    && mouseX < (obj.coords[0] + obj.coords[2])
                    ) {

                    OfficeExcel.Registry.Set('chart.thermometer.' + id + '.resizing', true);
                    obj.canvas.style.cursor = 'ns-resize';

                    /**
                    * Fire the OfficeExcel event
                    */
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustbegin');
                    
                    // Fire the onmousemove handler
                    canvas_onmousemove(e);
                }
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);



            var canvas_onmousemove = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var obj         = e.target.__object__;
                var id          = obj.id;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var coords      = obj.coords;

                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                
                if (OfficeExcel.Registry.Get('chart.thermometer.' + id + '.resizing')) {
                    
                    var capRadius = (OfficeExcel.GetWidth(obj) - obj._chartGutter._left - obj._chartGutter._right) / 2;
                    var top       = obj._chartGutter._top + capRadius;
                    var bottom    = coords[1] + coords[3];
                    var newvalue = obj.max - ((mouseY - top) / (bottom - obj._chartGutter._top - capRadius)) * (obj.max - obj.min);

                    obj.value = Math.round(newvalue);

                    /**
                    * Bounds checking
                    */
                    if (obj.value > obj.max) {
                        obj.value = obj.max;
                    } else if (obj.value < obj.min) {
                        obj.value = obj.min;
                    }

                    OfficeExcel.Clear(canvas);
                    obj.Draw();

                    /**
                    * Fire the OfficeExcel event
                    */
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjust');
                }
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);



            var canvas_onmouseup = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var obj         = e.target.__object__;
                var id          = obj.id;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var coords      = obj.coords;

                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];

                OfficeExcel.Registry.Set('chart.thermometer.' + id + '.resizing', false);
                obj.canvas.style.cursor = 'default';

                /**
                * Fire the OfficeExcel event
                */
                OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);
            
            















        } else if (obj.type == 'line') {
            var canvas_onmousedown = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var obj         = e.target.__object__;
                var id          = obj.id;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var coords      = obj.coords;
                var mouseCoords = OfficeExcel.getMouseXY(e);
    
                OfficeExcel.Redraw();
    
                for (var i=0; i<coords.length; ++i) {
    
                    if (   mouseCoords[0] > coords[i][0] - 5
                        && mouseCoords[1] > coords[i][1] - 5
                        && mouseCoords[0] < coords[i][0] + 5
                        && mouseCoords[1] < coords[i][1] + 5
                       ) {

                        var numDataSeries = obj.original_data.length;
                        var numDataPoints = obj.original_data[0].length;
                        var data_series   = i / numDataPoints;
                            data_series = Math.floor(data_series);
    
    
    
                      canvas.style.cursor = 'ns-resize';
                      OfficeExcel.FireCustomEvent(obj, 'onadjustbegin');
                      OfficeExcel.Registry.Set('chart.adjusting.line.' + id, [obj, i, [coords[i][0], coords[i][1]], data_series]);
    
                      return;
                    }
                }
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);
    
    
            var canvas_onmousemove = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                var id = e.target.__object__.id;
    
                var state = OfficeExcel.Registry.Get('chart.adjusting.line.' + id);
    
                if (state) {
                    var obj         = state[0];
                    var idx         = state[1];
                    var canvas      = obj.canvas;
                    var context     = obj.context;
                    var data_series = state[3];
                    var points      = obj.original_data[data_series];
                    var mouseCoords = OfficeExcel.getMouseXY(e);
                    var x           = mouseCoords[0];
                    var y           = mouseCoords[1];
                    var h           = OfficeExcel.GetHeight(obj);
                    
    
                    // Don't allow adjusting to the gutter if out-of-bounds is NOT specified
                    if (!obj._otherProps._outofbounds) {
                        if (y >= (h - obj._chartGutter._bottom)) {
                            y = h - obj._chartGutter._bottom;
                        } else if (y <= obj._chartGutter._top) {
                            y = obj._chartGutter._top;
                        }
                    }

                    // This accounts for a center X axis
                    if (obj._otherProps._xaxispos == 'center') {
                        y *= 2;
                        y -= (obj._chartGutter._top / 2);
                    } else if (obj._otherProps._xaxispos == 'top') {
                        y = OfficeExcel.GetHeight(obj) - y;
                    }

                    var pos   = h - obj._chartGutter._top - obj._chartGutter._bottom;
                        pos   = pos - (y - obj._chartGutter._top);
                    var value = (obj.max / (h - obj._chartGutter._top - obj._chartGutter._bottom)) * pos;
                    
                    if (obj._otherProps._ylabels_invert) {
                        value = obj.max - value;
                    }



                    // Adjust the index so that it's applicable to the correct data series
                    for (var i=0; i<data_series; ++i) {
                        idx -= obj.original_data[0].length;
                    }

                    obj.original_data[data_series][idx] = value;

                    obj._otherProps._ymax = obj.max;
                    canvas.style.cursor = 'ns-resize';
                    OfficeExcel.Redraw();

                    /**
                    * Fire the onadjust event
                    */
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');
    
                    return;
    
                } else {
                    
                    var canvas  = e.target;
                    var context = canvas.__object__.context;
                    var obj     = canvas.__object__;
                    var mouseCoords = OfficeExcel.getMouseXY(e);
                    var x       = mouseCoords[0];
                    var y       = mouseCoords[1];
    
                    for (var i=0; i<obj.coords.length; ++i) {
    
                        if (   x > obj.coords[i][0] - 5
                            && y > obj.coords[i][1] - 5
                            && x < obj.coords[i][0] + 5
                            && y < obj.coords[i][1] + 5
                           ) {
    
                           canvas.style.cursor = 'ns-resize';
                           return;
                        }
                    }
                }
                
                e.target.style.cursor = null;
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);
    
    
            var canvas_onmouseup = function (e)
            {
                var id = e.target.__object__.id;
                
                if (OfficeExcel.Registry.Get('chart.adjusting.line.' + id)) {
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
                }

                OfficeExcel.Registry.Set('chart.adjusting.line.' + id, null);
                e.target.style.cursor = null;
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);
    
    
            var canvas_onmouseout = function (e)
            {
                canvas_onmouseup(e);
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);
        
        /**
        * HProgress bar
        */
        } else if (obj.type == 'hprogress') {

            
            var canvas_onmousedown = function (e)
            {
                var id = e.target.__object__.id;

                OfficeExcel.Registry.Set('chart.adjusting.hprogress.' + id, [true]);
                
                OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustbegin');
                
                canvas_onmousemove(e);
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);


            var canvas_onmousemove = function (e)
            {
                var id    = e.target.__object__.id;
                var state = OfficeExcel.Registry.Get('chart.adjusting.hprogress.' + id);

                if (state && state.length) {
                    var obj     = e.target.__object__;
                    var canvas  = obj.canvas;
                    var context = obj.context;
                    
                    if (obj.type == 'hprogress') {
                    
                        var coords = OfficeExcel.getMouseXY(e);
                            coords[0] = Math.max(0, coords[0] - obj._chartGutter._left);
                        var barWidth  = canvas.width - obj._chartGutter._left - obj._chartGutter._right;
                        
                        // Work out the new value
                        var value  = (coords[0] / barWidth) * (obj.max - obj.Get('chart.min'));
                            value += obj.Get('chart.min');
                        
                        obj.value = Math.max(0, value.toFixed());
                        OfficeExcel.Clear(obj.canvas);
                        obj.Draw();

/*
                    } else if (obj.type == 'vprogress') {

                        var coords = OfficeExcel.getMouseXY(e);
                            coords[1] = Math.max(0, coords[1] - obj.Get('chart.gutter'));
                        var barHeight = canvas.height - (2 * obj.Get('chart.gutter'));
                        
                        // Work out the new value
                        var value = ( (barHeight - coords[1]) / barHeight) * obj.max;
                        
                        obj.value = Math.max(0, value.toFixed());
                        OfficeExcel.Clear(obj.canvas);
                        obj.Draw();
*/
                    }

                    /**
                    * Fire the onadjust event
                    */
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');
                }
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);
            
            
            var canvas_onmouseup = function (e)
            {
                var id = e.target.__object__.id;

                if (OfficeExcel.Registry.Get('chart.adjusting.hprogress.' + id)) {
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
                }

                OfficeExcel.Registry.Set('chart.adjusting.hprogress.' + id, null);
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);
    
    
            var canvas_onmouseout = function (e)
            {
                canvas_onmouseup(e);
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);
        
        /**
        * VProgress bar
        */
        } else if (obj.type == 'vprogress') {

            
            var canvas_onmousedown = function (e)
            {
                var id = e.target.__object__.id;

                OfficeExcel.Registry.Set('chart.adjusting.vprogress.' + id, [true]);
                
                OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustbegin');
                
                canvas_onmousemove(e);
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);


            var canvas_onmousemove = function (e)
            {
                var id    = e.target.__object__.id;
                var state = OfficeExcel.Registry.Get('chart.adjusting.vprogress.' + id);

                if (state && state.length) {

                    var obj     = e.target.__object__;
                    var canvas  = obj.canvas;
                    var context = obj.context;
                    
                    if (obj.type == 'hprogress') {
                    
                        var coords = OfficeExcel.getMouseXY(e);
                            coords[0] = Math.max(0, coords[0] - obj._chartGutter._left);
                        var barWidth  = canvas.width - obj._chartGutter._left - obj._chartGutter._right;
                        
                        // Work out the new value
                        var value  = (coords[0] / barWidth) * (obj.max - obj.Get('chart.min'));
                            value += obj.Get('chart.min');
                        
                        obj.value = Math.max(0, value.toFixed(obj._otherProps._scale_decimals));

                        OfficeExcel.Clear(obj.canvas);
                        obj.Draw();

                    } else if (obj.type == 'vprogress') {

                        var coords = OfficeExcel.getMouseXY(e);
                            coords[1] = Math.max(0, coords[1] - obj._chartGutter._top);
                        var barHeight = canvas.height - obj._chartGutter._top -  obj._chartGutter._bottom;
                        
                        // Work out the new value
                        var value = ( (barHeight - coords[1]) / barHeight) * obj.max;
                        
                        obj.value = Math.max(0, value.toFixed(obj._otherProps._scale_decimals));

                        OfficeExcel.Clear(obj.canvas);
                        obj.Draw();
                    }

                    /**
                    * Fire the onadjust event
                    */
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');
                }
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);
            
            
            var canvas_onmouseup = function (e)
            {
                var id = e.target.__object__.id;

                if (OfficeExcel.Registry.Get('chart.adjusting.vprogress.' + id)) {
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
                }

                OfficeExcel.Registry.Set('chart.adjusting.vprogress.' + id, null);
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);
    
    
            var canvas_onmouseout = function (e)
            {
                canvas_onmouseup(e);
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);

        /**
        * Bar chart
        */
        } else if (obj.type == 'bar') {
        
            // Stacked bar charts not supported
            if (obj._otherProps._grouping == 'stacked') {
                alert('[BAR] Adjusting stacked bar charts is not supported');
                return;
            }


            var canvas  = obj.canvas;
            var context = obj.context;


            var canvas_onmousemove = function (e)
            {
                var obj     = e.target.__object__;
                var id      = obj.id;
                var canvas  = obj.canvas;
                var context = obj.context;
                var mouse   = OfficeExcel.getMouseXY(e);
                var mousex  = mouse[0];
                var mousey  = mouse[1]; // mousey, mousey...
                

                // Loop through the coords to see if the mouse position is at the top of a bar
                for (var i=0; i<obj.coords.length; ++i) {

                    var barX = obj.coords[i][0];
                    var barY = obj.coords[i][1];
                    var barW = obj.coords[i][2];
                    var barH = obj.coords[i][3];
                    
                    if (mousex > barX && mousex < (barX + barW)) {

                        /**
                        * Change the mouse pointer
                        */
                        //if (   (obj._otherProps._xaxispos == 'bottom' && (mousey > (barY - 5) && mousey < (barY + 5)))
                        //    || (((obj._otherProps._xaxispos == 'center' || obj._otherProps._xaxispos == 'top') && mousey > (barY + barH - 5) && mousey < (barY + barH + 5)))
                        //    || ((obj._otherProps._xaxispos == 'center' && barX < (obj.canvas.height / 2) && mousey < (barY + 5) && mousey > barY))
                        //   ) {
                        //    canvas.style.cursor = 'ns-resize';

                        //} else {
                        //    canvas.style.cursor = 'default';
                        //}



                        var idx = OfficeExcel.Registry.Get('chart.adjusting.bar.' + id)
                        
                        if (typeof(idx) == 'number') {

                            // This accounts for a center X axis
                            if (obj._otherProps._xaxispos == 'center') {
                                obj.grapharea /= 2;
                            }

                            var newheight = obj.grapharea - (mousey - obj._chartGutter._top);
                            var newvalue  = (newheight / obj.grapharea) * obj.max;
                            
                            // Account for X axis at the top
                            if (obj._otherProps._xaxispos == 'top') {
                                newvalue = obj.max - newvalue;
                            }

                            // Top and bottom boundaries
                            if (newvalue > obj.max) newvalue = obj.max;

                            if (obj._otherProps._xaxispos == 'center') {
                                if (newvalue < (-1 * obj.max)) newvalue = (-1 * obj.max);
                            
                            } else {
                                if (newvalue < 0) newvalue = 0;
                            }

                            ///////////////// This was fun to work out... /////////////////

                            var j, index;

                            for (var j=0, index=0; j<obj.data.length; ++j,++index) {

                                if (typeof(obj.data[j]) == 'object') {

                                    for (var k=0; k<obj.data[j].length && index <= idx; ++k, ++index) {
                                        if (index == idx) {

                                        
                                            if (obj._otherProps._xaxispos == 'top') {
                                                newvalue *= -1;
                                            }

                                            obj.data[j][k] = newvalue;
                                            var b = true;
                                            break;
                                        }
                                    }
                                    
                                    --index;
                                } else if (typeof(obj.data[j]) == 'number') {

                                    if (index == idx) {
                                        
                                        if (obj._otherProps._xaxispos == 'top') {
                                            newvalue *= -1;
                                        }

                                        obj.data[j] = newvalue;

                                        // No need to set b
                                        break;
                                    }
                                }
                                
                                if (b) {
                                    break;
                                }
                            }
                            ///////////////////////////////////////////////////////////////

                            OfficeExcel.Clear(canvas);
                            obj.Draw();

                            /**
                            * Fire the onadjust event
                            */
                            OfficeExcel.FireCustomEvent(obj, 'onadjust');
                        }

                        return;
                    }
                }
                
                canvas.style.cursor = 'default';
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);



            var canvas_onmousedown = function (e)
            {
                var obj     = e.target.__object__;
                var id      = obj.id;
                var canvas  = obj.canvas;
                var context = obj.context;
                var mouse   = OfficeExcel.getMouseXY(e);
                var mousex  = mouse[0];
                var mousey  = mouse[1];

                // Loop through the coords to see if the mouse position is at the top of a bar
                for (var i=0; i<obj.coords.length; ++i) {
                    if (mousex > obj.coords[i][0] && mousex < (obj.coords[i][0] + obj.coords[i][2])) {

                        OfficeExcel.FireCustomEvent(obj, 'onadjustbegin');

                        obj._otherProps._ymax = obj.max;
                        OfficeExcel.Registry.Set('chart.adjusting.bar.' + id, i);
                        
                        canvas_onmousemove(e);
                    }
                }
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);



            var canvas_onmouseup = function (e)
            {
                var id = e.target.__object__.id;
                
                if (typeof(OfficeExcel.Registry.Get('chart.adjusting.bar.' + id)) == 'number') {
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
                }
                
                OfficeExcel.Registry.Set('chart.adjusting.bar.' + id, null);
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);


            var canvas_onmouseout = function (e)
            {
                canvas_onmouseup(e);
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);














        /**
        * The Radar chart
        */
        } else if (obj.type == 'radar') {


            var canvas = obj.canvas;
            var context = obj.context;
            
            
            var canvas_onmousemove = function (e)
            {
                var id          = e.target.id;
                var obj         = e.target.__object__;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var mouseDown   = OfficeExcel.Registry.Get('chart.adjusting.radar.' + id);
                var mouseCoords = OfficeExcel.getMouseXY(e);

                if (mouseDown) {

                    canvas.style.cursor = 'move';
                    
                    var dataset = mouseDown[0];
                    var index   = mouseDown[1];

                    var dx      = mouseCoords[0] - obj.centerx;
                    var dy      = mouseCoords[1] - obj.centery;
                    var hyp     = Math.sqrt((dx * dx) + (dy * dy));
                    var newvalue = (hyp / (obj.size / 2)) * obj.max;

                    newvalue = Math.min(obj.max, newvalue);
                    newvalue = Math.max(0, newvalue);

                    obj.original_data[mouseDown[0]][mouseDown[1]] = newvalue;
                    OfficeExcel.Clear(canvas);
                    obj.Draw();

                    /**
                    * Fire the onadjust event
                    */
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');

                } else {

                    // Determine if the mouse is near a point, and if so, change the pointer
                    for (var ds = 0; ds<obj.coords.length; ds++) {
                        for (var i=0; i<obj.coords[ds].length; ++i) {
                            
                            var dx = Math.abs(mouseCoords[0] - obj.coords[ds][i][0]);
                            var dy = Math.abs(mouseCoords[1] - obj.coords[ds][i][1]);
                            var a  = Math.atan(dy / dx);
        
                            
                            var hyp = Math.sqrt((dx * dx) + (dy * dy));
        
                            if (hyp <= 5) {
                                canvas.style.cursor = 'move';
                                return;
                            }
                        }
                    }

                    canvas.style.cursor = 'default';
                }
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);
            
            
            var canvas_onmousedown = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var obj         = e.target.__object__;
                var id          = obj.id;
                var canvas      = obj.canvas;
                var context     = obj.context;
                var mouseCoords = OfficeExcel.getMouseXY(e);

                // Determine if the mouse is near a point
                for (var j=0; j<obj.coords.length; ++j) {
                    for (var i=0; i<obj.coords[j].length; ++i) {
                        
                        var dx = Math.abs(mouseCoords[0] - obj.coords[j][i][0]);
                        var dy = Math.abs(mouseCoords[1] - obj.coords[j][i][1]);
                        var a  = Math.atan(dy / dx);


                        var hyp = Math.sqrt((dx * dx) + (dy * dy));
    
                        if (hyp <= 5) {
                            canvas.style.cursor = 'pointer';
                            OfficeExcel.FireCustomEvent(obj, 'onadjustbegin');

                            OfficeExcel.Registry.Set('chart.adjusting.radar.' + id, [j, i, obj.coords[j][i][0] > obj.centerx, obj.coords[j][i][1] > obj.centery]);
                            return;
                        }
                    }
                }
                    
                canvas.style.cursor = 'default';
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);


            var canvas_onmouseup = function (e)
            {
                var id = e.target.id;

                if (OfficeExcel.Registry.Get('chart.adjusting.radar.' + id)) {
                    OfficeExcel.FireCustomEvent(e.target.__object__, 'onadjustend');
                }

                OfficeExcel.Registry.Set('chart.adjusting.radar.' + id, null);
                canvas.style.cursor = 'default';
            }
            canvas.addEventListener('mouseup', canvas_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseup', canvas_onmouseup);
    
    
            var canvas_onmouseout = function (e)
            {
                canvas_onmouseup(e);
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);
        
        /**
        * Gantt chart
        */
        } else if (obj.type == 'gantt') {


            /**
            * The onmousedown event handler
            */
            var canvas_onmousedown = function (e)
            {
                var canvas      = e.target;
                var id          = canvas.id;
                var obj         = canvas.__object__;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];

                for (var i=0; i<obj.coords.length; ++i) {
                    
                    var coordX = obj.coords[i][0];
                    var coordY = obj.coords[i][1];
                    var coordW = obj.coords[i][2];
                    var coordH = obj.coords[i][3];

                    if (mouseX > coordX
                        && mouseX < (coordX + coordW)
                        && mouseY > coordY
                        && mouseY < (coordY + coordH)
                       ) {
                        
                        var mode = (mouseX >= (coordX + coordW - 5) ? 'resize' : 'move');

                        OfficeExcel.Registry.Set('chart.adjusting.gantt', {'index': i,'object': obj,'mousex': mouseX,'mousey': mouseY,'event_start': obj._otherProps._events[i][0],'event_duration': obj._otherProps._events[i][1],'mode': mode});

                        OfficeExcel.FireCustomEvent(obj, 'onadjustbegin');
                        return;
                    }
                }
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);

            
            /**
            * Change the pointer
            */
            var canvas_onmousemove = function (e)
            {
                var canvas      = e.target;
                var id          = canvas.id;
                var obj         = canvas.__object__;
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
                
                for (var i=0; i<obj.coords.length; ++i) {
                    
                    var coordX = obj.coords[i][0];
                    var coordY = obj.coords[i][1];
                    var coordW = obj.coords[i][2];
                    var coordH = obj.coords[i][3];

                    if (mouseX > coordX
                        && mouseX < (coordX + coordW)
                        && mouseY > coordY
                        && mouseY < (coordY + coordH)
                       ) {

                       canvas.style.cursor = 'ew-resize';                        
                        return;
                    }
                }
                
                canvas.style.cursor = 'default';
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);








            var window_onmousemove = function (e)
            {
                var conf = OfficeExcel.Registry.Get('chart.adjusting.gantt');

                if (conf) {

                    var obj         = conf['object'];
                    var id          = obj.id;
                    var index       = conf['index'];
                    var startX      = conf['mousex'];
                    var startY      = conf['mousey'];
                    var eventStart  = conf['event_start'];
                    var duration    = conf['event_duration'];
                    var mode        = conf['mode'];
                    var mouseCoords = OfficeExcel.getMouseXY(e);
                    var mouseX      = mouseCoords[0];
                    var mouseY      = mouseCoords[1];
                    
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');

                    if (mode == 'resize') {
                    
                        /**
                        * Account for the right hand gutter. Appears to be a FF bug
                        */
                        if (mouseX > (OfficeExcel.GetWidth(obj) - obj._chartGutter._right)) {
                            mouseX = OfficeExcel.GetWidth(obj) - obj._chartGutter._right;
                        }
                        

                        var diff = ((mouseX - startX) / (OfficeExcel.GetWidth(obj) - obj._chartGutter._left - obj._chartGutter._right)) * obj._otherProps._xmax;
                            diff = Math.round(diff);
                        
                        obj._otherProps._events[index][1] = duration + diff;
                        
                        if (obj._otherProps._events[index][1] < 0) {
                            obj._otherProps._events[index][1] = 1;
                        }

                    } else {

                        var diff = ((mouseX - startX) / (OfficeExcel.GetWidth(obj) - obj._chartGutter._left - obj._chartGutter._right)) * obj._otherProps._xmax;
                        diff = Math.round(diff);

                        if (   eventStart + diff > 0
                            && (eventStart + diff + obj._otherProps._events[index][1]) < obj._otherProps._xmax) {
    
                            obj._otherProps._events[index][0] = eventStart + diff;
                        
                        } else if (eventStart + diff < 0) {
                            obj._otherProps._events[index][0] = 0;
                        
                        } else if ((eventStart + diff + obj._otherProps._events[index][1]) > obj._otherProps._xmax) {
                            obj._otherProps._events[index][0] = obj._otherProps._xmax - obj._otherProps._events[index][1];
                        }
                    }
                    
                    OfficeExcel.Redraw();
                    OfficeExcel.FireCustomEvent(obj, 'onadjust');
                }
            }
            window.addEventListener('mousemove', window_onmousemove, false);
            OfficeExcel.AddEventListener('window_' + canvas.id, 'mousemove', window_onmousemove);








        
        
            var window_onmouseup = function (e)
            {
                if (OfficeExcel.Registry.Get('chart.adjusting.gantt')) {
                
                    var conf = OfficeExcel.Registry.Get('chart.adjusting.gantt');
                    var obj  = conf['object'];
                    var id   = obj.id;

                    OfficeExcel.FireCustomEvent(obj, 'onadjustend');
                    OfficeExcel.Registry.Set('chart.adjusting.gantt', null);
                }
            }
            window.addEventListener('mouseup', window_onmouseup, false);
            OfficeExcel.AddEventListener('window_' + canvas.id, 'mouseup', window_onmouseup);
        }
    }