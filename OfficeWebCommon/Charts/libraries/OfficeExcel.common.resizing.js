    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {isOfficeExcel:true,type:'common'};


    /**
    * This is an array of CSS properties that should be preserved when adding theplaceholder DIV
    */
    __OfficeExcel_resizing_preserve_css_properties__ = [];

    /**
    * This function can be used to allow resizing
    * 
    * @param object obj Your graph object
    */
    OfficeExcel.AllowResizing = function (obj)
    {
        if (obj._otherProps._resizable) {
            var canvas  = obj.canvas;
            var context = obj.context;
            var resizeHandle = 15;
            OfficeExcel.Resizing.canvas = canvas;
            OfficeExcel.Resizing.placeHolders = [];
            
            /**
            * Add the original width and height to the canvas
            */
            if (!canvas.__original_width__ && !canvas.__original_height__) {
                canvas.__original_width__  = canvas.width;
                canvas.__original_height__ = canvas.height;
            }


            var adjustX = (typeof(obj._otherProps._resize_handle_adjust) == 'object' && typeof(obj._otherProps._resize_handle_adjust[0]) == 'number' ? obj._otherProps._resize_handle_adjust[0] : 0);
            var adjustY = (typeof(obj._otherProps._resize_handle_adjust) == 'object' && typeof(obj._otherProps._resize_handle_adjust[1]) == 'number' ? obj._otherProps._resize_handle_adjust[1] : 0);


            /**
            * Draw the resize handle
            */
            var textWidth = context.measureText('Reset').width + 2;


            // Draw the white background for the resize handle - OPTIONAL default is rgba(0,0,0,0);
            var bgcolor = obj._otherProps._resize_handle_background;
            
            if (!bgcolor) {
                bgcolor = 'rgba(0,0,0,0)';
            }

            context.beginPath();
                context.fillStyle = bgcolor;
                context.moveTo(canvas.width - resizeHandle - resizeHandle + adjustX, canvas.height - resizeHandle);
                context.fillRect(canvas.width - resizeHandle - resizeHandle + adjustX, canvas.height - resizeHandle + adjustY, 2 * resizeHandle, resizeHandle);
            context.fill();


            obj.context.beginPath();
                obj.context.strokeStyle = 'gray';
                obj.context.fillStyle = 'rgba(0,0,0,0)';
                obj.context.lineWidth = 1;
                obj.context.fillRect(obj.canvas.width - resizeHandle + adjustX, obj.canvas.height - resizeHandle - 2 + adjustY, resizeHandle, resizeHandle + 2);
                obj.context.fillRect(obj.canvas.width - resizeHandle - textWidth + adjustX, obj.canvas.height - resizeHandle + adjustY, resizeHandle + textWidth, resizeHandle + 2);


                // Draw the arrows
                
                    // Vertical line
                    obj.context.moveTo(AA(this, obj.canvas.width - (resizeHandle / 2) + adjustX), obj.canvas.height - resizeHandle + adjustY);
                    obj.context.lineTo(AA(this, obj.canvas.width - (resizeHandle / 2) + adjustX), obj.canvas.height + adjustY);


                    // Horizontal line
                    obj.context.moveTo(obj.canvas.width + adjustX, AA(this, obj.canvas.height - (resizeHandle / 2) + adjustY));
                    obj.context.lineTo(obj.canvas.width - resizeHandle + adjustX, AA(this, obj.canvas.height - (resizeHandle / 2) + adjustY));
                
            context.fill();
            context.stroke();


            // Top arrow head
            context.fillStyle = 'gray';
            context.beginPath();
                context.moveTo(canvas.width - (resizeHandle / 2) + adjustX, canvas.height - resizeHandle + adjustY);
                context.lineTo(canvas.width - (resizeHandle / 2) + 3 + adjustX, canvas.height - resizeHandle + 3 + adjustY);
                context.lineTo(canvas.width - (resizeHandle / 2) - 3 + adjustX, canvas.height - resizeHandle + 3 + adjustY);
            context.closePath();
            context.fill();

            // Bottom arrow head
            context.beginPath();
                context.moveTo(canvas.width - (resizeHandle / 2) + adjustX, canvas.height + adjustY);
                context.lineTo(canvas.width - (resizeHandle / 2) + 3 + adjustX, canvas.height - 3 + adjustY);
                context.lineTo(canvas.width - (resizeHandle / 2) - 3 + adjustX, canvas.height - 3 + adjustY);
            context.closePath();
            context.fill();

            // Left arrow head
            context.beginPath();
                context.moveTo(canvas.width - resizeHandle + adjustX, canvas.height - (resizeHandle / 2) + adjustY);
                context.lineTo(canvas.width - resizeHandle + 3 + adjustX, canvas.height - (resizeHandle / 2) + 3 + adjustY);
                context.lineTo(canvas.width - resizeHandle + 3 + adjustX, canvas.height - (resizeHandle / 2) - 3 + adjustY);
            context.closePath();
            context.fill();

            // Right arrow head
            context.beginPath();
                context.moveTo(canvas.width + adjustX, canvas.height - (resizeHandle / 2) + adjustY);
                context.lineTo(canvas.width - 3 + adjustX, canvas.height - (resizeHandle / 2) + 3 + adjustY);
                context.lineTo(canvas.width  - 3 + adjustX, canvas.height - (resizeHandle / 2) - 3 + adjustY);
            context.closePath();
            context.fill();
            
            // Square at the centre of the arrows
            context.beginPath();
                context.fillStyle = 'white';
                context.moveTo(canvas.width + adjustX, canvas.height - (resizeHandle / 2) + adjustY);
                context.strokeRect(canvas.width - (resizeHandle / 2) - 2 + adjustX, canvas.height - (resizeHandle / 2) - 2 + adjustY, 4, 4);
                context.fillRect(canvas.width - (resizeHandle / 2) - 2 + adjustX, canvas.height - (resizeHandle / 2) - 2 + adjustY, 4, 4);
            context.stroke();
            context.fill();


            // Draw the "Reset" button
            context.beginPath();
                context.fillStyle = 'gray';
                context.moveTo(AA(this, canvas.width - resizeHandle - 3 + adjustX), canvas.height - resizeHandle / 2 + adjustY);
                context.lineTo(AA(this, canvas.width - resizeHandle - resizeHandle + adjustX), canvas.height - (resizeHandle / 2) + adjustY);
                context.lineTo(canvas.width - resizeHandle - resizeHandle + 2 + adjustX, canvas.height - (resizeHandle / 2) - 2 + adjustY);
                context.lineTo(canvas.width - resizeHandle - resizeHandle + 2 + adjustX, canvas.height - (resizeHandle / 2) + 2 + adjustY);
                context.lineTo(canvas.width - resizeHandle - resizeHandle + adjustX, canvas.height - (resizeHandle / 2) + adjustY);
            context.stroke();
            context.fill();

            context.beginPath();
                context.moveTo(AA(this, canvas.width - resizeHandle - resizeHandle - 1 + adjustX), canvas.height - (resizeHandle / 2) - 3 + adjustY);
                context.lineTo(AA(this, canvas.width - resizeHandle - resizeHandle - 1 + adjustX), canvas.height - (resizeHandle / 2) + 3 + adjustY);
            context.stroke();
            context.fill();
            


            var window_onmousemove = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var canvas    = OfficeExcel.Resizing.canvas;
                var newWidth  = OfficeExcel.Resizing.originalw - (OfficeExcel.Resizing.originalx - e.pageX);// - 5
                var newHeight = OfficeExcel.Resizing.originalh - (OfficeExcel.Resizing.originaly - e.pageY);// - 5

                if (OfficeExcel.Resizing.mousedown) {
                    if (newWidth > (canvas.__original_width__ / 2)) OfficeExcel.Resizing.div.style.width = newWidth + 'px';
                    if (newHeight > (canvas.__original_height__ / 2)) OfficeExcel.Resizing.div.style.height = newHeight + 'px';
                    
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresize');
                }
            }
            window.addEventListener('mousemove', window_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'window_mousemove', window_onmousemove);

            /**
            * The window onmouseup function
            */
            var MouseupFunc = function (e)
            {
                if (!OfficeExcel.Resizing || !OfficeExcel.Resizing.div || !OfficeExcel.Resizing.mousedown) {
                    return;
                }

                if (OfficeExcel.Resizing.div) {

                    var div    = OfficeExcel.Resizing.div;
                    var canvas = div.__canvas__;
                    var coords = OfficeExcel.getCanvasXY(div.__canvas__);

                    var parentNode = canvas.parentNode;

                    if (canvas.style.position != 'absolute') {
                        // Create a DIV to go in the canvases place
                        var placeHolderDIV = document.createElement('DIV');
                            placeHolderDIV.style.width = OfficeExcel.Resizing.originalw + 'px';
                            placeHolderDIV.style.height = OfficeExcel.Resizing.originalh + 'px';
                            //placeHolderDIV.style.backgroundColor = 'red';
                            placeHolderDIV.style.display = 'inline-block'; // Added 5th Nov 2010
                            placeHolderDIV.style.position = canvas.style.position;
                            placeHolderDIV.style.left     = canvas.style.left;
                            placeHolderDIV.style.top      = canvas.style.top;
                            placeHolderDIV.style.cssFloat = canvas.style.cssFloat;

                        parentNode.insertBefore(placeHolderDIV, canvas);
                    }


                    // Now set the canvas to be positioned absolutely
                    canvas.style.backgroundColor = 'white';
                    canvas.style.position        = 'absolute';
                    canvas.style.border = '1px dashed gray';
                    canvas.style.left            = (OfficeExcel.Resizing.originalCanvasX  - 1) + 'px';
                    canvas.style.top             = (OfficeExcel.Resizing.originalCanvasY - 1) + 'px';

                    canvas.width = parseInt(div.style.width);
                    canvas.height = parseInt(div.style.height);
                    
                

                    /**
                    * Fire the onresize event
                    */
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizebeforedraw');

                    canvas.__object__.Draw();

                    // Get rid of transparent semi-opaque DIV
                    OfficeExcel.Resizing.mousedown = false;
                    div.style.display = 'none';
                    document.body.removeChild(div);
                }

                /**
                * If there is zoom enabled in thumbnail mode, lose the zoom image
                */
                if (OfficeExcel.Registry.Get('chart.zoomed.div') || OfficeExcel.Registry.Get('chart.zoomed.img')) {
                    OfficeExcel.Registry.Set('chart.zoomed.div', null);
                    OfficeExcel.Registry.Set('chart.zoomed.img', null);
                }

                /**
                * Fire the onresize event
                */
                OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizeend');
            }


            var window_onmouseup = MouseupFunc;
            window.addEventListener('onmouseup', window_onmouseup, false);
            OfficeExcel.AddEventListener(canvas.id, 'window_mouseup', window_onmouseup);


            var canvas_onmousemove = function (e)
            {
                e = OfficeExcel.FixEventObject(e);
                
                var coords  = OfficeExcel.getMouseXY(e);
                var obj     = e.target.__object__;
                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var cursor  = canvas.style.cursor;

                // Save the original cursor
                if (!OfficeExcel.Resizing.original_cursor) {
                    OfficeExcel.Resizing.original_cursor = cursor;
                }
                
                if (   (coords[0] > (canvas.width - resizeHandle)
                    && coords[0] < canvas.width
                    && coords[1] > (canvas.height - resizeHandle)
                    && coords[1] < canvas.height)) {
                        
                        canvas.style.cursor = 'move';

                } else if (   coords[0] > (canvas.width - resizeHandle - resizeHandle)
                           && coords[0] < canvas.width - resizeHandle
                           && coords[1] > (canvas.height - resizeHandle)
                           && coords[1] < canvas.height) {
                    
                    canvas.style.cursor = 'pointer';

                } else {
                    if (OfficeExcel.Resizing.original_cursor) {
                        canvas.style.cursor = OfficeExcel.Resizing.original_cursor;
                        OfficeExcel.Resizing.original_cursor = null;
                    } else {
                        canvas.style.cursor = 'default';
                    }
                }
            }
            canvas.addEventListener('mousemove', canvas_onmousemove, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousemove', canvas_onmousemove);



            var canvas_onmouseout = function (e)
            {
                e.target.style.cursor = 'default';
                e.target.title        = '';
            }
            canvas.addEventListener('mouseout', canvas_onmouseout, false);
            OfficeExcel.AddEventListener(canvas.id, 'mouseout', canvas_onmouseout);



            var canvas_onmousedown = function (e)
            {
                e = OfficeExcel.FixEventObject(e);

                var coords = OfficeExcel.getMouseXY(e);
                var canvasCoords = OfficeExcel.getCanvasXY(e.target);
                var canvas = e.target;

                if (   coords[0] > (obj.canvas.width - resizeHandle)
                    && coords[0] < obj.canvas.width
                    && coords[1] > (obj.canvas.height - resizeHandle)
                    && coords[1] < obj.canvas.height) {
                    
                    OfficeExcel.FireCustomEvent(obj, 'onresizebegin');
                    
                    // Save the existing border
                    if (canvas.__original_css_border__ == null) {
                        canvas.__original_css_border__ = canvas.style.border;
                    }

                    OfficeExcel.Resizing.mousedown = true;


                    /**
                    * Create the semi-opaque DIV
                    */

                    var div = document.createElement('DIV');
                    div.style.position = 'absolute';
                    div.style.left     = canvasCoords[0] + 'px';
                    div.style.top      = canvasCoords[1] + 'px';
                    div.style.width    = canvas.width + 'px';
                    div.style.height   = canvas.height + 'px';
                    div.style.border   = '1px dotted black';
                    div.style.backgroundColor = 'gray';
                    div.style.opacity  = 0.5;
                    div.__canvas__ = e.target;

                    document.body.appendChild(div);
                    OfficeExcel.Resizing.div = div;
                    OfficeExcel.Resizing.placeHolders.push(div);
                    
                    // Hide the previous resize indicator layers. This is only necessary it seems for the Meter chart
                    for (var i=0; i<(OfficeExcel.Resizing.placeHolders.length - 1); ++i) {
                        OfficeExcel.Resizing.placeHolders[i].style.display = 'none';
                    }

                    // This is a repetition of the window.onmouseup function (No need to use DOM2 here)
                    div.onmouseup = function (e)
                    {
                        MouseupFunc(e);
                    }

                    
                    // No need to use DOM2 here
                    OfficeExcel.Resizing.div.onmouseover = function (e)
                    {
                        e = OfficeExcel.FixEventObject(e);
                        e.stopPropagation();
                    }
    
                    // The mouse
                    OfficeExcel.Resizing.originalx = e.pageX;
                    OfficeExcel.Resizing.originaly = e.pageY;
                    
                    OfficeExcel.Resizing.originalw = obj.canvas.width;
                    OfficeExcel.Resizing.originalh = obj.canvas.height;
                    
                    OfficeExcel.Resizing.originalCanvasX = OfficeExcel.getCanvasXY(obj.canvas)[0];
                    OfficeExcel.Resizing.originalCanvasY = OfficeExcel.getCanvasXY(obj.canvas)[1];
                }


                /**
                * This facilitates the reset button
                */
                if (   coords[0] > (canvas.width - resizeHandle - resizeHandle)
                    && coords[0] < canvas.width - resizeHandle
                    && coords[1] > (canvas.height - resizeHandle)
                    && coords[1] < canvas.height) {
                    
                    /**
                    * Fire the onresizebegin event
                    */
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizebegin');

                    // Restore the original width and height
                    canvas.width = canvas.__original_width__;
                    canvas.height = canvas.__original_height__;

                    // Lose the border
                    canvas.style.border = canvas.__original_css_border__;
                    //canvas.__original_css_border__ = null;
                    
                    // Add 1 pixel to the top/left because the border is going
                    canvas.style.left = (parseInt(canvas.style.left)) + 'px';
                    canvas.style.top  = (parseInt(canvas.style.top)) + 'px';


                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizebeforedraw');

                    // Redraw the canvas
                    canvas.__object__.Draw();
                    
                    // Set the width and height on the DIV
                    if (OfficeExcel.Resizing.div) {
                        OfficeExcel.Resizing.div.style.width  = canvas.__original_width__ + 'px';
                        OfficeExcel.Resizing.div.style.height = canvas.__original_height__ + 'px';
                    }

                    /**
                    * Fire the resize event
                    */
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresize');
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizeend');
                }
            }
            canvas.addEventListener('mousedown', canvas_onmousedown, false);
            OfficeExcel.AddEventListener(canvas.id, 'mousedown', canvas_onmousedown);


            /**
            * This function facilitates the reset button
            * 
            * NOTE: 31st December 2010 - doesn't appear to be being used any more
            */

            /*
            canvas.onclick = function (e)
            {
                var coords = OfficeExcel.getMouseXY(e);
                var canvas = e.target;

                if (   coords[0] > (canvas.width - resizeHandle - resizeHandle)
                    && coords[0] < canvas.width - resizeHandle
                    && coords[1] > (canvas.height - resizeHandle)
                    && coords[1] < canvas.height) {

                    // Restore the original width and height
                    canvas.width = canvas.__original_width__;
                    canvas.height = canvas.__original_height__;

                    // Lose the border
                    canvas.style.border = '';
                    
                    // Add 1 pixel to the top/left because the border is going
                    canvas.style.left = (parseInt(canvas.style.left) + 1) + 'px';
                    canvas.style.top  = (parseInt(canvas.style.top) + 1) + 'px';
                    
                    // Fire the onresizebeforedraw event
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresizebeforedraw');

                    // Redraw the canvas
                    canvas.__object__.Draw();
                    
                    // Set the width and height on the DIV
                    OfficeExcel.Resizing.div.style.width  = canvas.__original_width__ + 'px';
                    OfficeExcel.Resizing.div.style.height = canvas.__original_height__ + 'px';
                    
                    // Fire the resize event
                    OfficeExcel.FireCustomEvent(canvas.__object__, 'onresize');
                }
            }
            */
        }
    }