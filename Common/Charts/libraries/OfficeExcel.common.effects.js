    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {isOfficeExcel:true,type:'common'};
    
    OfficeExcel.Effects = {}
    OfficeExcel.Effects.Fade           = {}; OfficeExcel.Effects.jQuery         = {}
    OfficeExcel.Effects.jQuery.HBlinds = {}; OfficeExcel.Effects.jQuery.VBlinds = {}
    OfficeExcel.Effects.jQuery.Slide   = {}; OfficeExcel.Effects.Pie            = {}
    OfficeExcel.Effects.Bar            = {}; OfficeExcel.Effects.Line           = {}
    OfficeExcel.Effects.Line.jQuery    = {}; OfficeExcel.Effects.Fuel           = {}
    OfficeExcel.Effects.Rose           = {}; OfficeExcel.Effects.Odo            = {}
    OfficeExcel.Effects.Gauge          = {}; OfficeExcel.Effects.Meter          = {}
    OfficeExcel.Effects.HBar           = {}; OfficeExcel.Effects.HProgress      = {}
    OfficeExcel.Effects.VProgress      = {}; OfficeExcel.Effects.Radar          = {}
    OfficeExcel.Effects.Waterfall      = {}; OfficeExcel.Effects.Gantt          = {}

    /**
    * Fadein
    * 
    * This function simply uses the CSS opacity property - initially set to zero and
    * increasing to 1 over the period of 0.5 second
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.Fade.In = function (obj)
    {
        /*var canvas = obj.canvas;

        // Initially the opacity should be zero
        canvas.style.opacity = 0;
        
        // Draw the chart
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();
        
        // Now fade the chart in
        for (var i=1; i<=10; ++i) {
            setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), i * 50);
        }
        
        // Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 500);
        }*/
    }


    /**
    * Fadeout
    * 
    * This function is a reversal of the above function - fading out instead of in
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.Fade.Out = function (obj)
    {
        /*var canvas = obj.canvas;
        
        // Draw the chart
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();
        
        // Now fade the chart in
        for (var i=10; i>=0; --i) {
            setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), (10 - i) * 50);
        }
        
        // Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 500);
        }*/
    }


    /**
    * Expand
    * 
    * This effect is like the tooltip effect of the same name. I starts in the middle
    * and expands out to full size.
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.jQuery.Expand = function (obj)
    {
        // Check for jQuery
        /*if (typeof(jQuery) == 'undefined') {
            alert('[ERROR] Could not find jQuery object - have you included the jQuery file?');
        }
        
        var canvas = obj.canvas;
        
        if (!canvas.__OfficeExcel_div_placeholder__) {
            var div    = OfficeExcel.Effects.ReplaceCanvasWithDIV(canvas);
            canvas.__OfficeExcel_div_placeholder__ = div;
        } else {
            div = canvas.__OfficeExcel_div_placeholder__;
        }

        canvas.style.position = 'relative';
        canvas.style.top = (canvas.height / 2) + 'px';
        canvas.style.left = (canvas.width / 2) + 'px';


        canvas.style.width = 0;
        canvas.style.height = 0;


        canvas.style.opacity = 0;

        OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        $('#' + obj.id).animate({
            opacity: 1,
            width: parseInt(div.style.width) + 'px',
            height: parseInt(div.style.height) + 'px',
            left: '-=' + (obj.canvas.width / 2) + 'px',
            top: '-=' + (obj.canvas.height / 2) + 'px'
        }, 1000);
        
       // Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1000);
        }*/
    }


    /**
    * A function used to replace the canvas witha Div, which inturn holds the canvas. This way the page
    * layout doesn't shift in the canvas is resized.
    * 
    * @param object canvas The canvas to replace.
    */
    OfficeExcel.Effects.ReplaceCanvasWithDIV  = function (canvas)
    {
        /*if (!canvas.replacementDIV) {
            // Create the place holder DIV
            var div    = document.createElement('DIV');
                div.style.width = canvas.width + 'px';
                div.style.height = canvas.height + 'px';
                div.style.cssFloat = canvas.style.cssFloat;
                div.style.left = canvas.style.left;
                div.style.top = canvas.style.top;
                //div.style.position = canvas.style.position;
                div.style.display = 'inline-block';
            canvas.parentNode.insertBefore(div, canvas);
            
    
            // Remove the canvas from the document
            canvas.parentNode.removeChild(canvas);
            
            // Add it back in as a child of the place holder
            div.appendChild(canvas);
            
            // Reset the positioning information on the canvas
            canvas.style.position = 'relative';
            canvas.style.left = (div.offsetWidth / 2) + 'px';
            canvas.style.top = (div.offsetHeight / 2) + 'px';
            canvas.style.cssFloat = '';
        
            // Add a reference to the canvas to the DIV so that repeated plays of the anumation
            // don't keep replacing the canvas with a new DIV
            canvas.replacementDIV = div;

        } else {
            var div = canvas.replacementDIV;
        }
        
        return div;*/
    }


    /**
    * Snap
    * 
    * Similar to the tooltip effect of the same name, this moves the canvas in from the top left corner
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.jQuery.Snap = function (obj)
    {
        /*var delay = 500;

        var div = OfficeExcel.Effects.ReplaceCanvasWithDIV(obj.canvas);
        
        obj.canvas.style.position = 'absolute';
        obj.canvas.style.top = 0;
        obj.canvas.style.left = 0;
        obj.canvas.style.width = 0;
        obj.canvas.style.height = 0;
        obj.canvas.style.opacity = 0;
        
        var targetLeft   = div.offsetLeft;
        var targetTop    = div.offsetTop;
        var targetWidth  = div.offsetWidth;
        var targetHeight = div.offsetHeight;

        OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        $('#' + obj.id).animate({
            opacity: 1,
            width: targetWidth + 'px',
            height: targetHeight + 'px',
            left: targetLeft + 'px',
            top: targetTop + 'px'
        }, delay);
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay + 50);
        }*/
    }


    /**
    * Reveal
    * 
    * This effect issmilat to the Expand effect - the canvas is slowly revealed from
    * the centre outwards
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.jQuery.Reveal = function (obj)
    {
        /*var opts   = arguments[1] ? arguments[1] : null;
        var delay  = 1000;
        var canvas = obj.canvas;
        var xy     = OfficeExcel.getCanvasXY(obj.canvas);


        obj.canvas.style.visibility = 'hidden';
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();


        var divs = [
                    ['reveal_left', xy[0], xy[1], obj.canvas.width  / 2, obj.canvas.height],
                    ['reveal_right',(xy[0] + (obj.canvas.width  / 2)),xy[1],(obj.canvas.width  / 2),obj.canvas.height],
                    ['reveal_top',xy[0],xy[1],obj.canvas.width,(obj.canvas.height / 2)],
                    ['reveal_bottom',xy[0],(xy[1] + (obj.canvas.height  / 2)),obj.canvas.width,(obj.canvas.height / 2)]
                   ];
        
        for (var i=0; i<divs.length; ++i) {
            var div = document.createElement('DIV');
                div.id = divs[i][0];
                div.style.width =  divs[i][3]+ 'px';
                div.style.height = divs[i][4] + 'px';
                div.style.left   = divs[i][1] + 'px';
                div.style.top   = divs[i][2] + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = opts && typeof(opts['color']) == 'string' ? opts['color'] : 'white';
            document.body.appendChild(div);
        }
        
        obj.canvas.style.visibility = 'visible';


        $('#reveal_left').animate({width: 0}, delay);
        $('#reveal_right').animate({left: '+=' + (obj.canvas.width / 2),width: 0}, delay);
        $('#reveal_top').animate({height: 0}, delay);
        $('#reveal_bottom').animate({top: '+=' + (obj.canvas.height / 2),height: 0}, delay);
        
        // Remove the DIVs from the DOM 100ms after the animation ends
        setTimeout(
            function ()
            {
                document.body.removeChild(document.getElementById("reveal_top"))
                document.body.removeChild(document.getElementById("reveal_bottom"))
                document.body.removeChild(document.getElementById("reveal_left"))
                document.body.removeChild(document.getElementById("reveal_right"))
            }
            , delay);
        
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Conceal
    * 
    * This effect is the reverse of the Reveal effect - instead of revealing the canvas it
    * conceals it. Combined with the reveal effect would make for a nice wipe effect.
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.jQuery.Conceal = function (obj)
    {
        /*var opts   = arguments[1] ? arguments[1] : null;
        var delay  = 1000;
        var canvas = obj.canvas;
        var xy     = OfficeExcel.getCanvasXY(obj.canvas);


        var divs = [
                    ['conceal_left', xy[0], xy[1], 0, obj.canvas.height],
                    ['conceal_right',(xy[0] + obj.canvas.width),xy[1],0,obj.canvas.height],
                    ['conceal_top',xy[0],xy[1],obj.canvas.width,0],
                    ['conceal_bottom',xy[0],(xy[1] + obj.canvas.height),obj.canvas.width,0]
                   ];
        
        for (var i=0; i<divs.length; ++i) {
            var div = document.createElement('DIV');
                div.id = divs[i][0];
                div.style.width =  divs[i][3]+ 'px';
                div.style.height = divs[i][4] + 'px';
                div.style.left   = divs[i][1] + 'px';
                div.style.top   = divs[i][2] + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = opts && typeof(opts['color']) == 'string' ? opts['color'] : 'white';
            document.body.appendChild(div);
        }


        $('#conceal_left').animate({width: '+=' + (obj.canvas.width / 2)}, delay);
        $('#conceal_right').animate({left: '-=' + (obj.canvas.width / 2),width: (obj.canvas.width / 2)}, delay);
        $('#conceal_top').animate({height: '+=' + (obj.canvas.height / 2)}, delay);
        $('#conceal_bottom').animate({top: '-=' + (obj.canvas.height / 2),height: (obj.canvas.height / 2)}, delay);
        
        // Remove the DIVs from the DOM 100ms after the animation ends
        setTimeout(
            function ()
            {
                document.body.removeChild(document.getElementById("conceal_top"))
                document.body.removeChild(document.getElementById("conceal_bottom"))
                document.body.removeChild(document.getElementById("conceal_left"))
                document.body.removeChild(document.getElementById("conceal_right"))
            }
            , delay);
            
        setTimeout(function () {OfficeExcel.Clear(obj.canvas);}, delay);
        
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Horizontal Blinds (open)
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.jQuery.HBlinds.Open = function (obj)
    {
        /*var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = OfficeExcel.getCanvasXY(canvas);
        var height = canvas.height / 5;
        
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        for (var i=0; i<5; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  canvas.width + 'px';
                div.style.height = height + 'px';
                div.style.left   = xy[0] + 'px';
                div.style.top   = (xy[1] + (canvas.height * (i / 5))) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({height: 0}, delay);
        }

        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay);
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Horizontal Blinds (close)
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.jQuery.HBlinds.Close = function (obj)
    {
        /*var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = OfficeExcel.getCanvasXY(canvas);
        var height = canvas.height / 5;

        for (var i=0; i<5; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  canvas.width + 'px';
                div.style.height = 0;
                div.style.left   = xy[0] + 'px';
                div.style.top   = (xy[1] + (canvas.height * (i / 5))) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({height: height + 'px'}, delay);
        }
        
        setTimeout(function () {OfficeExcel.Clear(obj.canvas);}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Vertical Blinds (open)
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.jQuery.VBlinds.Open = function (obj)
    {
        /*var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = OfficeExcel.getCanvasXY(canvas);
        var width  = canvas.width / 10;
        
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        for (var i=0; i<10; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  width + 'px';
                div.style.height = canvas.height + 'px';
                div.style.left   = (xy[0] + (canvas.width * (i / 10))) + 'px';
                div.style.top   = (xy[1]) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({width: 0}, delay);
        }

        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Vertical Blinds (close)
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.jQuery.VBlinds.Close = function (obj)
    {
        /*var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = OfficeExcel.getCanvasXY(canvas);
        var width  = canvas.width / 10;
        
        // Don't draw the chart

        for (var i=0; i<10; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  0;
                div.style.height = canvas.height + 'px';
                div.style.left   = (xy[0] + (canvas.width * (i / 10))) + 'px';
                div.style.top   = (xy[1]) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({width: width}, delay);
        }

        setTimeout(function () {OfficeExcel.Clear(obj.canvas, color);}, delay + 100);

        if (opts['remove']) {
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);
        }
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Pie chart grow
    * 
    * Gradually increases the pie chart radius
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.Pie.Grow = function (obj)
    {
        /*var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = OfficeExcel.getCanvasXY(canvas);
        
        canvas.style.visibility = 'hidden';
        obj.Draw();
        var radius = obj.getRadius();
        OfficeExcel.Clear(obj.canvas);
        canvas.style.visibility = 'visible';

        obj._otherProps._radius = 0;

        OfficeExcel.Effects.Animate(obj, {'chart.radius': radius}, arguments[2]); // ToDo chart.radius -> _otherProps._radius??*/
    }


    /**
    * Grow
    * 
    * The Bar chart Grow effect gradually increases the values of the bars
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.Bar.Grow = function (obj)
    {
        // Save the data
        /*obj.original_data = OfficeExcel.array_clone(obj.data);
        
        // Zero the data
        obj.__animation_frame__ = 0;

        if (obj._otherProps._ymax == null) {

            var ymax = 0;

            for (var i=0; i<obj.data.length; ++i) {
                if (OfficeExcel.is_array(obj.data[i]) && obj._otherProps._grouping == 'stacked') {
                    ymax = Math.max(ymax, Math.abs(OfficeExcel.array_sum(obj.data[i])));
                } else {
                    ymax = Math.max(ymax, Math.abs(obj.data[i]));
                }
            }

            ymax = OfficeExcel.getScale(ymax, obj)[4];

            obj._otherProps._ymax = ymax;
        }

        function Grow ()
        {
            var numFrames = 30;

            if (!obj.__animation_frame__) {
                obj.__animation_frame__  = 0;
                obj.__original_hmargin__ = obj._otherProps._hmargin;
                obj.__hmargin__          = ((obj.canvas.width - obj._chartGutter._left - obj._chartGutter._right) / obj.data.length) / 2;
                obj._otherProps._hmargin = obj.__hmargin__;
            }

            // Alter the Bar chart data depending on the frame
            for (var j=0; j<obj.original_data.length; ++j) {
                if (typeof(obj.data[j]) == 'object') {
                    for (var k=0; k<obj.data[j].length; ++k) {
                        obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k];
                    }
                } else {
                    obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j];
                }
            }

            
            //Increment the hmargin to the target
            obj._otherProps._hmargin = ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__hmargin__ - obj.__original_hmargin__)) + obj.__original_hmargin__;


            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (obj.__animation_frame__ < numFrames) {
                obj.__animation_frame__ += 1;
                
                if (location.href.indexOf('?settimeout') > 0) {
                    setTimeout(Grow, 40);
                } else {
                    OfficeExcel.Effects.UpdateCanvas(Grow);
                }
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow);*/
    }


    /**
    * A wrapper function that encapsulate requestAnimationFrame
    * 
    * @param function func The animation function
    */
    OfficeExcel.Effects.UpdateCanvas = function (func)
    {
        // Standard
        if (typeof(window.requestAnimationFrame) == 'function') {
            window.requestAnimationFrame(func);

        // IE 10+
        } else if (typeof(window.msRequestAnimationFrame) == 'function') {
            window.msRequestAnimationFrame(func);

        // Chrome
        } else if (typeof(window.webkitRequestAnimationFrame) == 'function') {
            window.webkitRequestAnimationFrame(func);

        // Firefox
        } else if (window.mozRequestAnimationFrame) { // Seems rather slow in FF6 - so disabled
            window.mozRequestAnimationFrame(func);

        // Default fallback to setTimeout
        } else {
            setTimeout(func, 1000 / 60);
        }
    }


    /**
    * Grow
    * 
    * The Fuel chart Grow effect gradually increases the values of the Fuel chart
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.Fuel.Grow = function (obj)
    {
        /*var totalFrames  = 30;
        var currentFrame = 0;
        var diff         = obj.value - obj.currentValue;
        var increment    = diff / totalFrames;
        var callback     = arguments[2] ? arguments[2] : null;

        function Grow ()
        {

            if (currentFrame < totalFrames) {
                obj.value = obj.currentValue + increment;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();

                currentFrame++;
                OfficeExcel.Effects.UpdateCanvas(Grow);
            } else if (callback) {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow);*/
    }


    /**
    * The Animate function. Similar to the jQuery Animate() function - simply pass it a
    * map of the properties and their target values, and this function will animate
    * them to get to those values.
    * 
    * @param object obj The chart object
    * @param object map A map (an associative array) of the properties and their target values.
    * @param            An optional function which will be called when the animation is complete
    */
    OfficeExcel.Effects.Animate = function (obj, map)
    {
        /*obj.Draw();

        OfficeExcel.Effects.__total_frames__  = (map && map['frames']) ? map['frames'] : 30;

        function Animate_Iterator (func)
        {
            var id = [obj.id +  '_' + obj.type];

            // Very first time in - initialise the arrays
            if (typeof(OfficeExcel.Effects.__current_frame__ ) == 'undefined') {
                OfficeExcel.Effects.__current_frame__   = new Array();
                OfficeExcel.Effects.__original_values__ = new Array();
                OfficeExcel.Effects.__diffs__           = new Array();
                OfficeExcel.Effects.__steps__           = new Array();
                OfficeExcel.Effects.__callback__        = new Array();
            }

            // Initialise the arrays for THIS animation (not necessrily the first in the page)
            if (!OfficeExcelExcel.Effects.__current_frame__[id]) {
                OfficeExcel.Effects.__current_frame__[id] = OfficeExcel.Effects.__total_frames__;
                OfficeExcel.Effects.__original_values__[id] = {};
                OfficeExcel.Effects.__diffs__[id]           = {};
                OfficeExcel.Effects.__steps__[id]           = {};
                OfficeExcel.Effects.__callback__[id]        = func;
            }

            for (var i in map) {
                if (typeof(map[i]) == 'string' || typeof(map[i]) == 'number') {

                    // If this the first frame, record the proginal value
                    if (OfficeExcel.Effects.__current_frame__[id] == OfficeExcel.Effects.__total_frames__) {
                        OfficeExcel.Effects.__original_values__[id][i] = obj.Get(i);
                        OfficeExcel.Effects.__diffs__[id][i]           = map[i] - OfficeExcel.Effects.__original_values__[id][i];
                        OfficeExcel.Effects.__steps__[id][i]           = OfficeExcel.Effects.__diffs__[id][i] / OfficeExcel.Effects.__total_frames__;
                    }

                    obj.Set(i, obj.Get(i) + OfficeExcel.Effects.__steps__[id][i]);

                    OfficeExcel.Clear(obj.canvas);
                    obj.Draw();
                }
            }

            // If the current frame number is above zero, run the animation iterator again
            if (--OfficeExcel.Effects.__current_frame__[id] > 0) {
                //setTimeout(Animate_Iterator, 100)
                OfficeExcel.Effects.UpdateCanvas(Animate_Iterator);
            
            // Optional callback
            } else {

                if (typeof(OfficeExcel.Effects.__callback__[id]) == 'function') {
                    (OfficeExcel.Effects.__callback__[id])(obj);
                }
                
                // Get rid of the arrays
                OfficeExcel.Effects.__current_frame__[id]   = null;
                OfficeExcel.Effects.__original_values__[id] = null;
                OfficeExcel.Effects.__diffs__[id]           = null;
                OfficeExcel.Effects.__steps__[id]           = null;
                OfficeExcel.Effects.__callback__[id]        = null;

            }
        }

        Animate_Iterator(arguments[2]);*/
    }


    /**
    * Slide in
    * 
    * This function is a wipe that can be used when switching the canvas to a new graph
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.jQuery.Slide.In = function (obj)
    {
        /*OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        var canvas = obj.canvas;
        var div    = OfficeExcel.Effects.ReplaceCanvasWithDIV(obj.canvas);
        var delay = 1000;
        div.style.overflow= 'hidden';
        var from = typeof(arguments[1]) == 'object' && typeof(arguments[1]['from']) == 'string' ? arguments[1]['from'] : 'left';
        
        canvas.style.position = 'relative';
        
        if (from == 'left') {
            canvas.style.left = (0 - div.offsetWidth) + 'px';
            canvas.style.top  = 0;
        } else if (from == 'top') {
            canvas.style.left = 0;
            canvas.style.top  = (0 - div.offsetHeight) + 'px';
        } else if (from == 'bottom') {
            canvas.style.left = 0;
            canvas.style.top  = div.offsetHeight + 'px';
        } else {
            canvas.style.left = div.offsetWidth + 'px';
            canvas.style.top  = 0;
        }
        
        $('#' + obj.id).animate({left:0,top:0}, delay);
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Slide out
    * 
    * This function is a wipe that can be used when switching the canvas to a new graph
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.jQuery.Slide.Out = function (obj)
    {
        /*var canvas = obj.canvas;
        var div    = OfficeExcel.Effects.ReplaceCanvasWithDIV(obj.canvas);
        var delay = 1000;
        div.style.overflow= 'hidden';
        var to = typeof(arguments[1]) == 'object' && typeof(arguments[1]['to']) == 'string' ? arguments[1]['to'] : 'left';
        
        canvas.style.position = 'relative';
        canvas.style.left = 0;
        canvas.style.top  = 0;
        
        if (to == 'left') {
            $('#' + obj.id).animate({left: (0 - canvas.width) + 'px'}, delay);
        } else if (to == 'top') {
            $('#' + obj.id).animate({left: 0, top: (0 - div.offsetHeight) + 'px'}, delay);
        } else if (to == 'bottom') {
            $('#' + obj.id).animate({top: (0 + div.offsetHeight) + 'px'}, delay);
        } else {
            $('#' + obj.id).animate({left: (0 + canvas.width) + 'px'}, delay);
        }
        
        //Callback
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay);
        }*/
    }


    /**
    * Unfold
    * 
    * This effect gradually increases the X/Y coordinatesfrom 0
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.Line.Unfold = function (obj)
    {
        /*obj._otherProps._animation_factor = obj._otherProps._animation_unfold_initial;
        OfficeExcel.Effects.Animate(obj, {'chart.animation.factor': 1}, arguments[2]);*/
    }


    /**
    * Unfold
    * 
    * This effect gradually increases the radiuss and decrease the margin of the Rose chart
    * 
    * @param object   obj The chart object
    * @param              Not used - pass null
    * @param function     An optional callback function
    */
    OfficeExcel.Effects.Rose.Grow = function (obj)
    {
        /*var numFrames       = 60;
        var currentFrame    = 0;
        var original_margin = obj._otherProps._margin;
        var margin          = (360 / obj.data.length) / 2;
        var callback        = arguments[2];

        obj._otherProps._margin = margin;
        obj._otherProps._animation_grow_factor = 0;

        function Grow_inner ()
        {
            if (currentFrame++ < numFrames) {
                obj._otherProps._animation_grow_factor = currentFrame / numFrames;
                obj._otherProps._margin =  (currentFrame / numFrames) * original_margin;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                OfficeExcel.Effects.UpdateCanvas(Grow_inner);

            } else {
                obj._otherProps._animation_grow_factor = 1;
                obj._otherProps._margin = original_margin;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                if (typeof(callback) == 'function') {
                    callback(obj);
                }
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_inner);*/
    }


    /**
    * UnfoldFromCenter
    * 
    * Line chart  unfold from center
    */
    OfficeExcel.Effects.Line.UnfoldFromCenter = function (obj)
    {
        /*var numFrames = 30;

        var original_opacity = obj.canvas.style.opacity;
        obj.canvas.style.opacity = 0;
        obj.Draw();
        var center_value = obj.scale[4] / 2;
        obj._otherProps._ymax = Number(obj.scale[4]);
        OfficeExcel.Clear(obj.canvas);
        obj.canvas.style.opacity = original_opacity;
        var original_data = OfficeExcel.array_clone(obj.original_data);
        var original_blur = obj._shadow._blur;
        obj._shadow._blur = 0;
        var callback = arguments[2];

        if (!obj.__increments__) {
        
            obj.__increments__ = new Array();
        
            for (var dataset=0; dataset<original_data.length; ++dataset) {

                obj.__increments__[dataset] = new Array();

                for (var i=0; i<original_data[dataset].length; ++i) {
                    obj.__increments__[dataset][i] = (original_data[dataset][i] - center_value) / numFrames;
                    
                    obj.original_data[dataset][i] = center_value;
                }
            }
        }

        function UnfoldFromCenter ()
        {
            OfficeExcel.Clear(obj.canvas);
            obj.Draw();
        
            for (var dataset=0; dataset<original_data.length; ++dataset) {
                for (var i=0; i<original_data[dataset].length; ++i) {
                    obj.original_data[dataset][i] += obj.__increments__[dataset][i];
                }
            }

            if (--numFrames > 0) {
                OfficeExcel.Effects.UpdateCanvas(UnfoldFromCenter);
            } else {
                obj.original_data = OfficeExcel.array_clone(original_data);
                obj.__increments__ = null;
                obj._shadow._blur = original_blur
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                if (typeof(callback) == 'function') {
                    callback(obj);
                }
            }
        }
        
        UnfoldFromCenter();*/
    }


    /**
    * FoldToCenter
    * 
    * Line chart  FoldTocenter
    */
    OfficeExcel.Effects.Line.FoldToCenter = function (obj)
    {
        /*var totalFrames = 30;
        var numFrame    = totalFrames;
        obj.Draw();
        var center_value = obj.scale[4] / 2;
        obj._otherProps._ymax = Number(obj.scale[4]);
        OfficeExcel.Clear(obj.canvas);
        var original_data = OfficeExcel.array_clone(obj.original_data);
        obj._shadow._blur = 0;
        var callback = arguments[2];
        
        function FoldToCenter ()
        {
            for (var i=0; i<obj.data.length; ++i) {
                if (obj.data[i].length) {
                    for (var j=0; j<obj.data[i].length; ++j) {
                        if (obj.original_data[i][j] > center_value) {
                            obj.original_data[i][j] = ((original_data[i][j] - center_value) * (numFrame/totalFrames)) + center_value;
                        } else {
                            obj.original_data[i][j] = center_value - ((center_value - original_data[i][j]) * (numFrame/totalFrames));
                        }
                    }
                }
            }
            
            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (numFrame-- > 0) {
                OfficeExcel.Effects.UpdateCanvas(FoldToCenter);
            } else if (typeof(callback) == 'function') {
                callback(obj);
            }
        }

        OfficeExcel.Effects.UpdateCanvas(FoldToCenter);*/
    }


    /**
    * Odo Grow
    * 
    * This effect gradually increases the represented value
    * 
    * @param object   obj The chart object
    * @param              Not used - pass null
    * @param function     An optional callback function
    */
    OfficeExcel.Effects.Odo.Grow = function (obj)
    {
        /*var numFrames = 30;
        var origValue = Number(obj.currentValue);
        var newValue  = obj.value;
        var diff      = newValue - origValue;
        var step      = (diff / numFrames);
        var callback  = arguments[2];

        function Grow_inner ()
        {
            if (obj.currentValue != newValue) {
                obj.value = Number(obj.currentValue) + step;
            }


            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (numFrames-- > 0) {
                OfficeExcel.Effects.UpdateCanvas(Grow_inner);
            } else if (callback) {
                callback(obj);
            }
        }
        
        //setTimeout(Grow, 100);
        OfficeExcel.Effects.UpdateCanvas(Grow_inner);*/
    }


    /**
    * Meter Grow
    * 
    * This effect gradually increases the represented value
    * 
    * @param object   obj The chart object
    * @param              Not used - pass null
    * @param function     An optional callback function
    */
    OfficeExcel.Effects.Meter.Grow = function (obj)
    {
        /*if (!obj.currentValue) {
            obj.currentValue = obj.min;
        }

        var totalFrames = 60;
        var numFrame    = 0;
        var diff        = obj.value - obj.currentValue;
        var step        = diff / totalFrames
        var callback    = arguments[2];

        function Grow_meter_inner ()
        {
            obj.value = obj.currentValue + step;

            OfficeExcel.Clear(obj.canvas);
            obj.Draw();
        
            if (numFrame++ < totalFrames) {
                OfficeExcel.Effects.UpdateCanvas(Grow_meter_inner);
            } else if (typeof(callback) == 'function') {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_meter_inner);*/
    }


    /**
    * Grow
    * 
    * The HBar chart Grow effect gradually increases the values of the bars
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.HBar.Grow = function (obj)
    {
        // Save the data
        /*obj.original_data = OfficeExcel.array_clone(obj.data);
        
        // Zero the data
        obj.__animation_frame__ = 0;

        if (obj._otherProps._xmax == 0) {

            var xmax = 0;

            for (var i=0; i<obj.data.length; ++i) {
                if (OfficeExcel.is_array(obj.data[i]) && obj._otherProps._grouping == 'stacked') {
                    xmax = Math.max(xmax, OfficeExcel.array_sum(obj.data[i]));
                } else if (OfficeExcel.is_array(obj.data[i]) && obj._otherProps._grouping == 'grouped') {
                    xmax = Math.max(xmax, OfficeExcel.array_max(obj.data[i]));
                } else {
                    xmax = Math.max(xmax, OfficeExcel.array_max(obj.data[i]));
                }
            }

            xmax = OfficeExcel.getScale(xmax)[4];

            obj._otherProps._xmax = xmax;
        }
        
        
        //Turn off shadow blur for the duration of the animation

        if (obj._shadow._blur > 0) {
            var __original_shadow_blur__ = obj._shadow._blur;
            obj._shadow._blur = 0;
        }

        function Grow ()
        {
            var numFrames = 30;

            if (!obj.__animation_frame__) {
                obj.__animation_frame__  = 0;
                obj.__original_vmargin__ = obj._otherProps._vmargin;
                obj.__vmargin__          = ((obj.canvas.height - obj._chartGutter._top - obj._chartGutter._bottom) / obj.data.length) / 2;
                obj._otherProps._vmargin = obj.__vmargin__;
            }

            // Alter the Bar chart data depending on the frame
            for (var j=0; j<obj.original_data.length; ++j) {
                
                // This stops the animatioon from being completely linear
                var easing = Math.pow(Math.sin((obj.__animation_frame__ * (90 / numFrames)) / (180 / Math.PI)), 4);

                if (typeof(obj.data[j]) == 'object') {
                    for (var k=0; k<obj.data[j].length; ++k) {
                        obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k] * easing;
                    }
                } else {
                    obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j] * easing;
                }
            }

            
            //Increment the vmargin to the target
            
            obj._otherProps._vmargin = ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__vmargin__ - obj.__original_vmargin__)) + obj.__original_vmargin__;


            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (obj.__animation_frame__ < numFrames) {
                obj.__animation_frame__ += 1;
                
                OfficeExcel.Effects.UpdateCanvas(Grow);
            
            // Turn any shadow blur back on
            } else {
                if (typeof(__original_shadow_blur__) == 'number' && __original_shadow_blur__ > 0) {
                    obj._shadow._blur = __original_shadow_blur__;
                    OfficeExcel.Clear(obj.canvas);
                    obj.Draw();
                }
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow);*/
    }


    /**
    * Trace
    * 
    * This effect is for the Line chart, uses the jQuery library and slowly
    * uncovers the Line , but you can see the background of the chart. This effect
    * is quite new (1/10/2011) and as such should be used with caution.
    * 
    * @param object obj The graph object
    * @param object     Not used
    * @param int        A number denoting how long (in millseconds) the animation should last for. Defauld
    *                   is 1500
    */
    OfficeExcel.Effects.Line.jQuery.Trace = function (obj)
    {
        /*OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        //Create the DIV that the second canvas will sit in
        var div = document.createElement('DIV');
        var xy = OfficeExcel.getCanvasXY(obj.canvas);
        div.id = '__OfficeExcel_trace_animation_' + OfficeExcel.random(0, 4351623) + '__';
        div.style.left = xy[0] + 'px';
        div.style.top = xy[1] + 'px';
        div.style.width = obj._chartGutter._left;
        div.style.height = obj.canvas.height + 'px';
        div.style.position = 'absolute';
        div.style.overflow = 'hidden';
        document.body.appendChild(div);
        
        //Make the second canvas
        var id      = '__OfficeExcel_line_reveal_animation_' + OfficeExcel.random(0, 99999999) + '__';
        var canvas2 = document.createElement('CANVAS');
        canvas2.width = obj.canvas.width;
        canvas2.height = obj.canvas.height;
        canvas2.style.position = 'absolute';
        canvas2.style.left = 0;
        canvas2.style.top  = 0;

        canvas2.id         = id;
        div.appendChild(canvas2);
        
        var reposition_canvas2 = function (e)
        {
            var xy = OfficeExcel.getCanvasXY(obj.canvas);
            
            div.style.left = xy[0] + 'px';
            div.style.top = xy[1] + 'px';
        }
        window.addEventListener('resize', reposition_canvas2, false)
        
        //Make a copy of the original Line object
        var obj2 = new OfficeExcel.Line(id, OfficeExcel.array_clone(obj.original_data));

        for (i in obj.properties) {
            if (typeof(i) == 'string') {
                obj2.Set(i, obj.properties[i]);
            }
        }

        obj2._otherProps._labels = [];
        obj2._otherProps._background_grid = false;
        obj2._otherProps._ylabels = false;
        obj2._otherProps._noaxes = true;
        obj2._chartTitle._text = '';
        obj2._xAxisTitle._text = '';
        obj2._yAxisTitle._text = '';
        obj2._otherProps._filled_accumulative = obj._otherProps._filled_accumulative;
        obj._otherProps._key = [];

        obj2.Draw();

        //This effectively hides the line
        obj._otherProps._line_visible = false;
        obj._otherProps._colors = ['rgba(0,0,0,0)'];
        if (obj._otherProps._filled) {
            var original_fillstyle = obj._otherProps._fillstyle;
            obj._otherProps._fillstyle = 'rgba(0,0,0,0)';
        }

        OfficeExcel.Clear(obj.canvas);
        obj.Draw();

        $('#' + div.id).animate({
            width: obj.canvas.width + 'px'
        }, arguments[2] ? arguments[2] : 1500, OfficeExcel.Effects.Line.Trace_callback);


        
        // Get rid of the second canvas and turn the line back on
        // on the original.
        
        OfficeExcel.Effects.Line.Trace_callback = function ()
        {
            // Remove the window resize listener
            window.removeEventListener('resize', reposition_canvas2, false);

            div.parentNode.removeChild(div);
            div.removeChild(canvas2);
            obj._otherProps._line_visible = true;
            
            // Revert the filled status back to as it was
            obj._otherProps._filled = OfficeExcel.array_clone(obj2._otherProps._filled)
            obj._otherProps._fillstyle = original_fillstyle
            obj._otherProps._colors = OfficeExcel.array_clone(obj2._otherProps._colors);
            obj._otherProps._key = OfficeExcel.array_clone(obj2._otherProps._key);

            OfficeExcel.Clear(obj.canvas);
            obj.Draw();
        }*/
    }



    /**
    * RoundRobin
    * 
    * This effect does two things:
    *  1. Gradually increases the size of each segment
    *  2. Gradually increases the size of the radius from 0
    * 
    * @param object obj The graph object
    */
    OfficeExcel.Effects.Pie.RoundRobin = function (obj)
    {
        /*var callback     = arguments[2] ? arguments[2] : null;
        var opt          = arguments[1];
        var currentFrame = 0;
        var numFrames    = 90;
        var targetRadius =  typeof(obj._otherProps._radius) == 'number' ? obj._otherProps._radius : obj.getRadius();

        function RoundRobin_inner ()
        {
            obj._otherProps._effect_roundrobin_multiplier = Math.pow(Math.sin((currentFrame * (90 / numFrames)) / (180 / Math.PI)), 2) * (currentFrame / numFrames);

            if (!opt || opt['radius']) {
                obj._otherProps._radius = targetRadius * obj._otherProps._effect_roundrobin_multiplier;
            }
            
            OfficeExcel.Clear(obj.canvas)
            obj.Draw();

            if (currentFrame++ < numFrames) {
                OfficeExcel.Effects.UpdateCanvas(RoundRobin_inner);
            
            } else if (callback) {
                callback(obj);
            }
        }

        OfficeExcel.Effects.UpdateCanvas(RoundRobin_inner);*/
    }


    /**
    * Implode (pie chart)
    * 
    * Here the segments are initially exploded - and gradually
    * contract inwards to create the Pie chart
    * 
    * @param object obj The Pie chart object
    */
    OfficeExcel.Effects.Pie.Implode = function (obj)
    {
        /*var numFrames = 90;
        var distance = Math.min(obj.canvas.width, obj.canvas.height);
        
        function Implode_inner ()
        {
            obj._otherProps._exploded = Math.sin(numFrames / 57.3) * distance;
            OfficeExcel.Clear(obj.canvas)
            obj.Draw();

            if (numFrames > 0) {
                numFrames--;
                OfficeExcel.Effects.UpdateCanvas(Implode_inner);
            } else {
                // Finish off the animation
                obj._otherProps._exploded = 0;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Implode_inner);*/
    }


    /**
    * Gauge Grow
    * 
    * This effect gradually increases the represented value
    * 
    * @param object   obj The chart object
    * @param              Not used - pass null
    * @param function     An optional callback function
    */
    OfficeExcel.Effects.Gauge.Grow = function (obj)
    {
        /*var numFrames = 30;
        var origValue = Number(obj.currentValue);
        
        if (obj.currentValue == null) {
            obj.currentValue = obj.min;
            origValue = obj.min;
        }

        var newValue  = obj.value;
        var diff      = newValue - origValue;
        var step      = (diff / numFrames);


        function Grow ()
        {
            if (obj.currentValue != newValue) {
                obj.value = Number(obj.currentValue) + step;
            }
    
            if (obj.value > obj.max) {
                obj.value = obj.max;
            }
    
            if (obj.value < obj.min) {
                obj.value = obj.min;
            }

            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (numFrames-- > 0) {
                //setTimeout(Grow, 100);
                OfficeExcel.Effects.UpdateCanvas(Grow);
            }
        }
        
        //setTimeout(Grow, 100);
        OfficeExcel.Effects.UpdateCanvas(Grow);*/
    }


    /**
    * Radar chart grow
    * 
    * This effect gradually increases the magnitude of the points on the radar chart
    * 
    * @param object obj The chart object
    * @param null       Not used
    * @param function   An optional callback that is run when the effect is finished
    */
    OfficeExcel.Effects.Radar.Grow = function (obj)
    {
        /*var totalframes   = 30;
        var framenum      = totalframes;
        var data          = OfficeExcel.array_clone(obj.data);
        var callback      = arguments[2];
        obj.original_data = OfficeExcel.array_clone(obj.original_data);

        function Grow_inner ()
        {
            for (var i=0; i<data.length; ++i) {
                
                if (obj.original_data[i] == null) {
                    obj.original_data[i] = [];
                }

                for (var j=0; j<data[i].length; ++j) {
                    obj.original_data[i][j] = ((totalframes - framenum)/totalframes)  * data[i][j];
                }
            }

            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (framenum > 0) {
                framenum--;
                OfficeExcel.Effects.UpdateCanvas(Grow_inner);
            } else if (typeof(callback) == 'function') {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_inner);*/
    }


    /**
    * Waterfall Grow
    * 
    * @param object obj The chart object
    * @param null Not used
    * @param function An optional function which is called when the animation is finished
    */
    OfficeExcel.Effects.Waterfall.Grow = function (obj)
    {
        /*var totalFrames = 45;
        var numFrame    = 0;
        var data = OfficeExcel.array_clone(obj.data);
        var callback = arguments[2];
        
        //Reset The data to zeros
        for (var i=0; i<obj.data.length; ++i) {
            obj.data[i] /= totalFrames;
            
        }
        
        
        //Fix the scale
        
        if (obj._otherProps._ymax == null) {
            var max = OfficeExcel.getScale(obj.getMax(data))[4]
            obj._otherProps._ymax = max;
        }

        obj._otherProps._multiplier_x = 0;
        obj._otherProps._multiplier_w = 0;

        function Grow_inner ()
        {
            for (var i=0; i<obj.data.length; ++i) {
                obj.data[i] = data[i] * (numFrame/totalFrames);
            }
            
            var multiplier = Math.pow(Math.sin(((numFrame / totalFrames) * 90) / 57.3), 20);
            obj._otherProps._multiplier_x = (numFrame / totalFrames) * multiplier;
            obj._otherProps._multiplier_w = (numFrame / totalFrames) * multiplier;
            
            OfficeExcel.Clear(obj.canvas);
            obj.Draw();

            if (numFrame++ < totalFrames) {
                OfficeExcel.Effects.UpdateCanvas(Grow_inner);
            } else if (typeof(callback) == 'function') {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_inner)*/
    }



    /**
    * Bar chart Wave effect
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.Bar.Wave = function (obj)
    {
        /*var callback = arguments[2] ? arguments[2] : null;

        var max = 0;
        for (var i=0; i<obj.data.length; ++i) {
            if (typeof(obj.data[i]) == 'number') {
                max = Math.max(max, obj.data[i])
            } else {
                if (obj._otherProps._grouping == 'stacked') {
                    max = Math.max(max, OfficeExcel.array_sum(obj.data[i]))
                } else {
                    max = Math.max(max, OfficeExcel.array_max(obj.data[i]))
                }
            }
        }
        var scale = OfficeExcel.getScale(max);
        obj._otherProps._ymax = scale[4];
        
        original_bar_data = OfficeExcel.array_clone(obj.data);
        __OfficeExcel_bar_wave_object__ = obj;
    
        // Zero all the bars
        for (var i=0; i<obj.data.length; ++i) {
             if (typeof(obj.data[i]) == 'number') {
                obj.data[i] = 0;
             } else {
                obj.data[i] = new Array(obj.data[i].length);
             }
             
             var totalFrames = 25;
             var delay       = 25;
             
            setTimeout('OfficeExcel.Effects.Bar.Wave_inner(' + i + ', ' + totalFrames + ', ' + delay + ')', i * 150);
        }
    
        OfficeExcel.Effects.Bar.Wave_inner = function  (idx, totalFrames, delay)
        {
            // Touch this at your peril...!
            for (var k=0; k<=totalFrames; ++k) {
                setTimeout('OfficeExcel.Effects.Bar.Wave_inner_iterator(__OfficeExcel_bar_wave_object__, '+idx+', '+(k / totalFrames)+');', delay * k);
            }
        }
        
        setTimeout(callback, (i * 150) + (totalFrames * delay), totalFrames, delay);
    }
    
    
    OfficeExcel.Effects.Bar.Wave_inner_iterator = function (obj, idx, factor)
    {
        if (typeof(obj.data[idx]) == 'number') {
            obj.data[idx] = original_bar_data[idx] * factor;
        } else {
            for (var i=0; i<obj.data[idx].length; ++i) {
                obj.data[idx][i] = factor * original_bar_data[idx][i];
            }
        }
        
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();*/
    }


    /**
    * HProgress Grow effect
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.HProgress.Grow = function (obj)
    {
        /*var canvas       = obj.canvas;
        var context      = obj.context;
        var diff         = obj.value - Number(obj.currentValue);
        var numFrames    = 30;
        var currentFrame = 0
        var increment    = diff  / numFrames;
        var callback     = arguments[2] ? arguments[2] : null;

        function Grow_hprogress_inner ()
        {
            if (currentFrame++ < 30) {
                obj.value = obj.currentValue + increment;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                OfficeExcel.Effects.UpdateCanvas(Grow_hprogress_inner);

            } else if (callback) {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_hprogress_inner);*/
    }


    /**
    * VProgress Grow effect
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.VProgress.Grow = function (obj)
    {
        /*var canvas       = obj.canvas;
        var context      = obj.context;
        var diff         = obj.value - Number(obj.currentValue);
        var numFrames    = 30;
        var currentFrame = 0
        var increment    = diff  / numFrames;
        var callback     = arguments[2] ? arguments[2] : null;

        function Grow_vprogress_inner ()
        {
            if (currentFrame++ < 30) {
                obj.value = obj.currentValue + increment;
                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                OfficeExcel.Effects.UpdateCanvas(Grow_vprogress_inner);

            } else if (callback) {
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_vprogress_inner);*/
    }


    /**
    * Pie chart Wave
    * 
    * This is the Pie chart version of the Wave effect.
    * 
    * @param object obj The chart object
    */        
    OfficeExcel.Effects.Pie.Wave = function (obj)
    {
        //Zero all the data and set the max value
        /*var max = OfficeExcel.array_max(obj.data);
        var scale = OfficeExcel.getScale(max);
        obj._otherProps._ymax = scale[4];

        original_pie_data = OfficeExcel.array_clone(obj.data);
        __OfficeExcel_pie_wave_object__ = obj;

        // Zero all the bars
        for (var i=0; i<obj.data.length; ++i) {
            obj.data[i] = 0;
            setTimeout('OfficeExcel.Effects.Pie.Wave_inner(' + i + ')', i * 100);
        }

        OfficeExcel.Effects.Pie.Wave_inner = function  (idx)
        {
            var totalFrames = 25;

            // Touch this at your peril...!
            for (var k=0; k<=totalFrames; ++k) {
                setTimeout('OfficeExcel.Effects.Pie.Wave_inner_iterator(__OfficeExcel_pie_wave_object__, '+idx+', '+(k / totalFrames)+');', 20 * k);
            }
        }*/
    }

    OfficeExcel.Effects.Pie.Wave_inner_iterator = function (obj, idx, factor)
    {
        /*obj.data[idx] = original_pie_data[idx] * factor;
        
        OfficeExcel.Clear(obj.canvas);
        obj.Draw();*/
    }


    /**
    * Bar chart Wave2 effect - using the requestAnimationFrame function
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.Bar.Wave2 = function (obj)
    {
        /*var callback = arguments[2] ? arguments[2] : null;
    
        var max = 0;
        for (var i=0; i<obj.data.length; ++i) {
            if (typeof(obj.data[i]) == 'number') {
                max = Math.max(max, obj.data[i])
            } else {
                if (obj._otherProps._grouping == 'stacked') {
                    max = Math.max(max, OfficeExcel.array_sum(obj.data[i]))
                } else {
                    max = Math.max(max, OfficeExcel.array_max(obj.data[i]))
                }
            }
        }
        var scale = OfficeExcel.getScale(max);
        obj._otherProps._ymax = scale[4];
        
        original_bar_data = OfficeExcel.array_clone(obj.data);
        __OfficeExcel_bar_wave_object__ = obj;
    
        
        //Zero all the bars
        for (var i=0; i<obj.data.length; ++i) {
             if (typeof(obj.data[i]) == 'number') {
                obj.data[i] = 0;
             } else {
                obj.data[i] = new Array(obj.data[i].length);
             }
             
            setTimeout('a = new OfficeExcel.Effects.Bar.Wave2.Iterator(__OfficeExcel_bar_wave_object__, ' + i + ', 45); a.Animate();', i * 150);
        }*/
    }

    
    /**
    * The Iterator object that handles the individual animation frames
    */
    OfficeExcel.Effects.Bar.Wave2.Iterator = function (obj, idx, frames)
    {
        this.obj    = obj;
        this.idx    = idx;
        this.frames = frames;
        this.curFrame = 0;
    }

    OfficeExcel.Effects.Bar.Wave2.Iterator.prototype.Animate = function ()
    {
        /*if (typeof(this.obj.data[this.idx]) == 'number') {
            this.obj.data[this.idx] = (this.curFrame / this.frames) * original_bar_data[this.idx];
        } else if (typeof(this.obj.data[this.idx]) == 'object') {
            for (var j=0; j<this.obj.data[this.idx].length; ++j) {
                this.obj.data[this.idx][j] = (this.curFrame / this.frames) * original_bar_data[this.idx][j];
            }
        }
    
        OfficeExcel.Clear(this.obj.canvas);
        this.obj.Draw();
        
        if (this.curFrame < this.frames) {
            
            this.curFrame += 1;
    
            OfficeExcel.Effects.UpdateCanvas(this.Animate.bind(this));
        }*/
    }


    /**
    * Gantt chart Grow effect
    * 
    * @param object obj The chart object
    */
    OfficeExcel.Effects.Gantt.Grow = function (obj)
    {
        /*var canvas       = obj.canvas;
        var context      = obj.context;
        var numFrames    = 30;
        var currentFrame = 0
        var callback     = arguments[2] ? arguments[2] : null;
        var events       = obj._otherProps._events;
        
        var original_events = OfficeExcel.array_clone(events);

        function Grow_gantt_inner ()
        {
            if (currentFrame < numFrames) {
                // Update the events
                for (var i=0; i<events.length; ++i) {
                    if (typeof(events[i][0]) == 'object') {
                        for (var j=0; j<events[i].length; ++j) {
                            events[i][j][1] = (currentFrame / numFrames) * original_events[i][j][1];
                        }
                    } else {

                        events[i][1] = (currentFrame / numFrames) * original_events[i][1];
                    }
                }

                obj._otherProps._events = events;

                OfficeExcel.Clear(obj.canvas);
                obj.Draw();
                
                currentFrame++;
                
                OfficeExcel.Effects.UpdateCanvas(Grow_gantt_inner);

            } else if (callback) {            
                callback(obj);
            }
        }
        
        OfficeExcel.Effects.UpdateCanvas(Grow_gantt_inner);*/
    }


    /**
    * This is a compatibility hack provided for Opera and Safari which
    * don't support ther Javascript 1.8.5 function.bind()
    */
    /*if (!Function.prototype.bind) {  
      Function.prototype.bind = function (oThis) {  
        if (typeof this !== "function") {  
          // closest thing possible to the ECMAScript 5 internal IsCallable function  
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
        }  
      
        var aArgs = Array.prototype.slice.call(arguments, 1),   
            fToBind = this,   
            fNOP = function () {},  
            fBound = function () {  
              return fToBind.apply(this instanceof fNOP  
                                     ? this  
                                     : oThis || window,  
                                   aArgs.concat(Array.prototype.slice.call(arguments)));  
            };  
      
        fNOP.prototype = this.prototype;  
        fBound.prototype = new fNOP();  
      
        return fBound;  
      };  
    }*/


    /**
    * Rose chart explode
    * 
    * Explodes the Rose chart - gradually incrementing the size of the chart.explode property
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.Rose.Explode = function (obj)
    {
       /* var canvas   = obj.canvas;
        var opts     = arguments[1] ? arguments[1] : [];
        var callback = arguments[2] ? arguments[2] : null;
        var frames   = opts['frames'] ? opts['frames'] : 60;

        obj._otherProps._exploded = 0;

        OfficeExcel.Effects.Animate(obj, {'frames': frames, 'chart.exploded': Math.min(canvas.width, canvas.height)}, callback);*/
    }


    /**
    * Rose chart implode
    * 
    * Implodes the Rose chart - gradually decreasing the size of the chart.explode property. It starts at the largest of
    * the canvas width./height
    * 
    * @params object obj The graph object
    */
    OfficeExcel.Effects.Rose.Implode = function (obj)
    {
        var canvas   = obj.canvas;
        var opts     = arguments[1] ? arguments[1] : [];
        var callback = arguments[2] ? arguments[2] : null;
        var frames   = opts['frames'] ? opts['frames'] : 60;

        obj._otherProps._exploded = Math.min(canvas.width, canvas.height);

        OfficeExcel.Effects.Animate(obj, {'frames': frames, 'chart.exploded': 0}, callback);
    }