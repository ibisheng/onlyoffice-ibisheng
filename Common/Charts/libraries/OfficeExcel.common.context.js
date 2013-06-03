    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {isOfficeExcel:true,type:'common'};


    /**
    * This gunction shows a context menu containing the parameters
    * provided to it
    * 
    * @param object canvas    The canvas object
    * @param array  menuitems The context menu menuitems
    * @param object e         The event object
    */
    OfficeExcel.Contextmenu = function (canvas, menuitems, e)
    {
        e = OfficeExcel.FixEventObject(e);

        /**
        * Fire the custom OfficeExcel event onbeforecontextmenu
        */
        OfficeExcel.FireCustomEvent(canvas.__object__, 'onbeforecontextmenu');

        /**
        * Hide any existing menu
        */
        if (OfficeExcel.Registry._otherProps._contextmenu) {
            OfficeExcel.HideContext();
        }
        
        // Hide any zoomed canvas
        OfficeExcel.HideZoomedCanvas();

        /**
        * Hide the palette if necessary
        */
        OfficeExcel.HidePalette();
        
        /**
        * This is here to ensure annotating is OFF
        */
        canvas.__object__.Set('chart.mousedown', false);

        var x      = e.pageX;
        var y      = e.pageY;
        var div    = document.createElement('div');
        var bg     = document.createElement('div');

        div.className             = 'OfficeExcel_contextmenu';
        div.__canvas__            = canvas; /* Store a reference to the canvas on the contextmenu object */
        div.style.position        = 'absolute';
        div.style.left            = 0;
        div.style.top             = 0;
        div.style.border          = '1px solid black';
        div.style.backgroundColor = 'white';
        div.style.boxShadow       = '3px 3px 3px rgba(96,96,96,0.5)';
        div.style.MozBoxShadow    = '3px 3px 3px rgba(96,96,96,0.5)';
        div.style.WebkitBoxShadow = '3px 3px 3px rgba(96,96,96,0.5)';
        div.style.filter          = 'progid:DXImageTransform.Microsoft.Shadow(color=#aaaaaa,direction=135)';
        div.style.opacity         = 0;

        bg.className             = 'OfficeExcel_contextmenu_background';
        bg.style.position        = 'absolute';
        bg.style.backgroundColor = '#ccc';
        bg.style.borderRight     = '1px solid #aaa';
        bg.style.top             = 0;
        bg.style.left            = 0;
        bg.style.width           = '18px';
        bg.style.height          = '100%';
        bg.style.opacity         = 0;


        div = document.body.appendChild(div);
        bg  = div.appendChild(bg);


        /**
        * Now add the context menu items
        */
        for (i=0; i<menuitems.length; ++i) {
            
            var menuitem = document.createElement('div');
            
            menuitem.__canvas__      = canvas;
            menuitem.__contextmenu__ = div;
            menuitem.className       = 'OfficeExcel_contextmenu_item';
            
            if (menuitems[i]) {
                menuitem.style.padding = '2px 5px 2px 23px';
                menuitem.style.fontFamily = 'Arial';
                menuitem.style.fontSize = '10pt';
                menuitem.style.fontWeight = 'normal';
                menuitem.innerHTML = menuitems[i][0];

                if (OfficeExcel.is_array(menuitems[i][1])) {
                    menuitem.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAQUlEQVQImY3NoQ2AMABE0ZewABMyGQ6mqWODzlAclBSFO8HZl8uf0FFxCHtwYkt4Y6ChYE44cGH9/fyae2p2LAleW9oVTQuVf6gAAAAASUVORK5CYII=)';
                    menuitem.style.backgroundRepeat = 'no-repeat';
                    menuitem.style.backgroundPosition = '97% center';
                }

                // Add the mouseover event
                if (menuitems[i][1]) {
                    if (menuitem.addEventListener) {
                        menuitem.addEventListener("mouseover", function (e) {OfficeExcel.HideContextSubmenu(); e.target.style.backgroundColor = 'rgba(0,0,0,0.2)'; e.target.style.cursor = 'pointer';}, false);
                        menuitem.addEventListener("mouseout", function (e) {e.target.style.backgroundColor = 'inherit'; e.target.style.cursor = 'default';}, false);
                    } else  {
                        menuitem.attachEvent("onmouseover", function () {OfficeExcel.HideContextSubmenu();event.srcElement.style.backgroundColor = '#eee';event.srcElement.style.cursor = 'pointer';}
                    , false);
                        menuitem.attachEvent("onmouseout", function () {event.srcElement.style.backgroundColor = 'inherit'; event.srcElement.style.cursor = 'default';}, false);
                    }
                } else {
                    if (menuitem.addEventListener) {
                        menuitem.addEventListener("mouseover", function (e) {e.target.style.cursor = 'default';}, false);
                        menuitem.addEventListener("mouseout", function (e) {e.target.style.cursor = 'default';}, false);
                    } else  {
                        menuitem.attachEvent("onmouseover", function () {event.srcElement.style.cursor = 'default'}, false);
                        menuitem.attachEvent("onmouseout", function () {event.srcElement.style.cursor = 'default';}, false);
                    }
                }

            } else {
                menuitem.style.borderBottom = '1px solid #ddd';
                menuitem.style.marginLeft = '25px';
            }

            div.appendChild(menuitem);

            /**
            * Install the event handler that calls the menuitem
            */
            if (menuitems[i] && menuitems[i][1] && typeof(menuitems[i][1]) == 'function') {
                if (document.all  && 0) { // MSIE bit no longer necessary
                    menuitem.attachEvent('onclick', menuitems[i][1]);
                    menuitem.attachEvent('onclick', function () {OfficeExcel.HideContext();});
                } else {
                    menuitem.addEventListener('click', menuitems[i][1], false);
                }
            
            // Submenu
            } else if (menuitems[i] && menuitems[i][1] && OfficeExcel.is_array(menuitems[i][1])) {
                (function ()
                {
                    var tmp = menuitems[i][1]; // This is here because of "references vs primitives" and how they're passed around in Javascript
                    menuitem.addEventListener('mouseover', function (e) {OfficeExcel.Contextmenu_submenu(canvas.__object__, tmp, e.target);}, false);
                })();
            }
        }

        /**
        * Now all the menu items have been added, set the shadow width
        * Shadow now handled by CSS3?
        */
        div.style.width = (div.offsetWidth + 10) + 'px';
        div.style.height = (div.offsetHeight - 2) + 'px';

        /**
        * Set the background (the left bar) width if it's MSIE
        */
        //if (document.all) {
        //    bg.style.height = (div.offsetHeight - 2) + 'px';
        //}

        // Show the menu to the left or the right (normal) of the cursor?
        if (x + div.offsetWidth > document.body.offsetWidth) {
            x -= div.offsetWidth;
        }
        
        // Reposition the menu (now we have the real offsetWidth)
        div.style.left = x + 'px';
        div.style.top = y + 'px';

        /**
        * Do a little fade in effect
        */
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu) obj.style.opacity = 0.2", 50);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu) obj.style.opacity = 0.4", 100);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu) obj.style.opacity = 0.6", 150);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu) obj.style.opacity = 0.8", 200);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu) obj.style.opacity = 1", 250);

        // The fade in effect on the left gray bar
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu_bg) obj.style.opacity = 0.2", 50);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu_bg) obj.style.opacity = 0.4", 100);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu_bg) obj.style.opacity = 0.6", 150);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu_bg) obj.style.opacity = 0.8", 200);
        setTimeout("if (obj = OfficeExcel.Registry._otherProps._contextmenu_bg) obj.style.opacity = 1", 250);

        // Store the context menu in the registry
        OfficeExcel.Registry._otherProps._contextmenu = div;
        OfficeExcel.Registry._otherProps._contextmenu_bg = bg;
        OfficeExcel.Registry._otherProps._contextmenu.oncontextmenu = function () {return false;};
        OfficeExcel.Registry._otherProps._contextmenu_bg.oncontextmenu = function () {return false;};

        /**
        * Install the event handlers that hide the context menu
        */
        canvas.addEventListener('click', function () {OfficeExcel.HideContext();}, false);

        window.onclick = function (e)
        {
            OfficeExcel.HideContext();
            
            // Removed on 3/7/10 - stops a bug in conjunction with annotating which presents itself on the Rscatter
            //OfficeExcel.Redraw();
            
            // Fire the onclick event again
            if (e.target.onclick && e.button == 0) {
                e.target.onclick(e);
            }
        }

        window.onresize = function () {OfficeExcel.HideContext();}
        
        /**
        * Add the __shape__ object to the context menu
        */
        
        /**
        * Set the shape coords from the .getShape()  method
        */
        if (typeof(canvas.__object__.getShape) == 'function') {
            OfficeExcel.Registry._otherProps._contextmenu.__shape__ = canvas.__object__.getShape(e);
        }


        e.stopPropagation();

        /**
        * Fire the (OfficeExcel) oncontextmenu event
        */
        OfficeExcel.FireCustomEvent(canvas.__object__, 'oncontextmenu');

        return false;
    }


    /**
    * Hides the context menu if it's currently visible
    */
    OfficeExcel.HideContext = function ()
    {
        var cm   = OfficeExcel.Registry._otherProps._contextmenu;
        var cmbg = OfficeExcel.Registry._otherProps._contextmenu_bg;
        
        //Hide any submenu currently being displayed
        OfficeExcel.HideContextSubmenu();

        if (cm) {
            cm.parentNode.removeChild(cm);
            cmbg.parentNode.removeChild(cmbg);

            cm.style.visibility = 'hidden';
            cm.style.display = 'none';
            OfficeExcel.Registry._otherProps._contextmenu = null;
            
            cmbg.style.visibility = 'hidden';
            cmbg.style.display = 'none';
            OfficeExcel.Registry._otherProps._contextmenu_bg = null;
        }
    }


    /**
    * Hides the context menus SUBMENU if it's currently visible
    */
    OfficeExcel.HideContextSubmenu = function ()
    {
        var sub  = OfficeExcel.Registry._otherProps._contextmenu_submenu;

        if (sub) {
            sub.style.visibility = 'none';
            sub.style.display    = 'none';
            OfficeExcel.Registry._otherProps._contextmenu_submenu = null;
        }
    }


    /**
    * Shows the context menu after making a few checks - not opera (doesn't support oncontextmenu,
    * not safari (tempermentality), not chrome (hmmm)
    */
    OfficeExcel.ShowContext = function (obj)
    {
        OfficeExcel.HidePalette();

        if (obj._otherProps._contextmenu && obj._otherProps._contextmenu.length) {

            var isOpera      = navigator.userAgent.indexOf('Opera') >= 0;
            var isSafari     = navigator.userAgent.indexOf('Safari') >= 0;
            var isChrome     = navigator.userAgent.indexOf('Chrome') >= 0;
            var isMacFirefox = navigator.userAgent.indexOf('Firefox') > 0 && navigator.userAgent.indexOf('Mac') > 0;
            var isIE9        = navigator.userAgent.indexOf('MSIE 9') >= 0;

            if (((!isOpera && !isSafari) || isChrome) && !isMacFirefox) {

                obj.canvas.oncontextmenu = function (e)
                {
                     e = OfficeExcel.FixEventObject(e);

                    if (e.ctrlKey) return true;

                    OfficeExcel.Contextmenu(obj.canvas, obj._otherProps._contextmenu, e);

                    return false;
                }

            // Accomodate Opera and Safari - use double click event
            } else {

                obj.canvas.addEventListener('dblclick', function (e)
                {
                    if (e.ctrlKey) return true;

                    if (!OfficeExcel.Registry._otherProps._contextmenu) {
                        OfficeExcel.Contextmenu(obj.canvas, obj._otherProps._contextmenu, e);
                    }
                }, false);
            }
        }
    }


    /**
    * This draws a submenu should it be necessary
    * 
    * @param object obj  The graph object
    * @param object menu The context menu
    */
    OfficeExcel.Contextmenu_submenu = function (obj, menuitems, parentMenuItem)
    {
        OfficeExcel.HideContextSubmenu();

        var canvas  = obj.canvas;
        var context = obj.context;
        var menu    = parentMenuItem.parentNode;

        var subMenu = document.createElement('DIV');
        subMenu.style.position = 'absolute';
        subMenu.style.width = '100px';
        subMenu.style.top = menu.offsetTop + parentMenuItem.offsetTop + 'px';
        subMenu.style.left            = (menu.offsetLeft + menu.offsetWidth - (OfficeExcel.isOld() ? 9 : 0)) + 'px';
        subMenu.style.backgroundColor = 'white';
        subMenu.style.border          = '1px solid black';
        subMenu.className             = 'OfficeExcel_contextmenu';
        subMenu.__contextmenu__       = menu;
        subMenu.style.boxShadow       = '3px 3px 3px rgba(96,96,96,0.5)';
        subMenu.style.MozBoxShadow    = '3px 3px 3px rgba(96,96,96,0.5)';
        subMenu.style.WebkitBoxShadow = '3px 3px 3px rgba(96,96,96,0.5)';
        subMenu.style.filter          = 'progid:DXImageTransform.Microsoft.Shadow(color=#aaaaaa,direction=135)';
        document.body.appendChild(subMenu);
        
        for (var i=0; i<menuitems.length; ++i) {
                    
            var menuitem = document.createElement('DIV');
            
            menuitem.__canvas__      = canvas;
            menuitem.__contextmenu__ = menu;
            menuitem.className       = 'OfficeExcel_contextmenu_item';
            
            if (menuitems[i]) {
                menuitem.style.padding = '2px 5px 2px 23px';
                menuitem.style.fontFamily = 'Arial';
                menuitem.style.fontSize = '10pt';
                menuitem.style.fontWeight = 'normal';
                menuitem.innerHTML = menuitems[i][0];
        
                if (menuitems[i][1]) {
                    if (menuitem.addEventListener) {
                        menuitem.addEventListener("mouseover", function (e) {e.target.style.backgroundColor = 'rgba(0,0,0,0.2)'; e.target.style.cursor = 'pointer';}, false);
                        menuitem.addEventListener("mouseout", function (e) {e.target.style.backgroundColor = 'inherit'; e.target.style.cursor = 'default';}, false);
                    } else  {
                        menuitem.attachEvent("onmouseover", function () {event.srcElement.style.backgroundColor = 'rgba(0,0,0,0.2)'; event.srcElement.style.cursor = 'pointer'}, false);
                        menuitem.attachEvent("onmouseout", function () {event.srcElement.style.backgroundColor = 'inherit'; event.srcElement.style.cursor = 'default';}, false);
                    }
                } else {
                    if (menuitem.addEventListener) {
                        menuitem.addEventListener("mouseover", function (e) {e.target.style.cursor = 'default';}, false);
                        menuitem.addEventListener("mouseout", function (e) {e.target.style.cursor = 'default';}, false);
                    } else  {
                        menuitem.attachEvent("onmouseover", function () {event.srcElement.style.cursor = 'default'}, false);
                        menuitem.attachEvent("onmouseout", function () {event.srcElement.style.cursor = 'default';}, false);
                    }
                }
            } else {
                menuitem.style.borderBottom = '1px solid #ddd';
                menuitem.style.marginLeft = '25px';
            }
            
            subMenu.appendChild(menuitem);
        
            if (menuitems[i] && menuitems[i][1]) {
                if (document.all) {
                    menuitem.attachEvent('onclick', menuitems[i][1]);
                } else {
                    menuitem.addEventListener('click', menuitems[i][1], false);
                }
            }
        }


        var bg                   = document.createElement('DIV');
        bg.className             = 'OfficeExcel_contextmenu_background';
        bg.style.position        = 'absolute';
        bg.style.backgroundColor = '#ccc';
        bg.style.borderRight     = '1px solid #aaa';
        bg.style.top             = 0;
        bg.style.left            = 0;
        bg.style.width           = '18px';
        bg.style.height          = '100%';

        bg  = subMenu.appendChild(bg);

        OfficeExcel.Registry._otherProps._contextmenu_submenu = subMenu;
    }


    /**
    * A function designed to be used in conjunction with thed context menu
    * to allow people to get image versions of canvases.
    * 
    * @param      canvas Optionally you can pass in the canvas, which will be used
    */
    OfficeExcel.showPNG = function ()
    {
        if (OfficeExcel.isIE8()) {
            alert('[OfficeExcel PNG] Sorry, showing a PNG is not supported on MSIE8.');
            return;
        }

        if (arguments[0] && arguments[0].id) {
            var canvas = arguments[0];
            var event  = arguments[1];
        
        } else if (OfficeExcel.Registry._otherProps._contextmenu) {
            var canvas = OfficeExcel.Registry._otherProps._contextmenu.__canvas__;
        
        } else {
            alert('[OfficeExcel SHOWPNG] Could not find canvas!');
        }

        var obj = canvas.__object__;

        /**
        * Create the gray background DIV to cover the page
        */
        var bg = document.createElement('DIV');
            bg.id = '__OfficeExcel_image_bg__';
            bg.style.position = 'fixed';
            bg.style.top = '-10px';
            bg.style.left = '-10px';
            bg.style.width = '5000px';
            bg.style.height = '5000px';
            bg.style.backgroundColor = 'rgb(204,204,204)';
            bg.style.opacity = 0;
        document.body.appendChild(bg);
        
        
        /**
        * Create the div that the graph sits in
        */
        var div = document.createElement('DIV');
            div.style.backgroundColor = 'white';
            div.style.opacity = 0;
            div.style.border = '1px solid black';
            div.style.position = 'fixed';
            div.style.top = '20%';
            div.style.width = canvas.width + 'px';
            div.style.height = canvas.height + 35 + 'px';
            div.style.left = (document.body.clientWidth / 2) - (canvas.width / 2) + 'px';
            div.style.padding = '5px';

            div.style.borderRadius = '10px';
            div.style.MozBorderRadius = '10px';
            div.style.WebkitBorderRadius = '10px';

            div.style.boxShadow    = '0 0 15px rgba(96,96,96,0.5)';
            div.style.MozBoxShadow = '0 0 15px rgba(96,96,96,0.5)';
            div.style.WebkitBoxShadow = 'rgba(96,96,96,0.5) 0 0 15px';

            div.__canvas__ = canvas;
            div.__object__ = obj;
            div.id = '__OfficeExcel_image_div__';
        document.body.appendChild(div);

        
        /**
        * Add the HTML text inputs
        */
        div.innerHTML += '<div style="position: absolute; margin-left: 10px; top: ' + canvas.height + 'px; width: ' + (canvas.width - 50) + 'px; height: 25px"><span style="display: inline; display: inline-block; width: 65px; text-align: right">URL:</span><textarea style="float: right; overflow: hidden; height: 15px; width: ' + (canvas.width - obj._chartGutter._left - obj._chartGutter._right - 80) + 'px" onclick="this.select()" readonly="readonly" id="__OfficeExcel_dataurl__">' + canvas.toDataURL() + '</textarea></div>';
        div.innerHTML += '<div style="position: absolute; top: ' + (canvas.height + 25) + 'px; left: ' + (obj._chartGutter._left - 65 + (canvas.width / 2)) + 'px; width: ' + (canvas.width - obj._chartGutter._right) + 'px; font-size: 65%">A link using the URL: <a href="' + canvas.toDataURL() + '">View</a></div>'

        
        
        /**
        * Create the image rendition of the graph
        */
        var img = document.createElement('IMG');
        OfficeExcel.Registry.Set('chart.png', img);
        img.__canvas__ = canvas;
        img.__object__ = obj;
        img.id = '__OfficeExcel_image_img__';
        img.className = 'OfficeExcel_png';

        img.src = canvas.toDataURL();

        div.appendChild(img);
        
        setTimeout(function () {document.getElementById("__OfficeExcel_dataurl__").select();}, 50);
        
        window.addEventListener('resize', function (e){var img = OfficeExcel.Registry.Get('chart.png');img.style.left = (document.body.clientWidth / 2) - (img.width / 2) + 'px';}, false);
        
        bg.onclick = function (e)
        {
            var div = document.getElementById("__OfficeExcel_image_div__");
            var bg = document.getElementById("__OfficeExcel_image_bg__");

            if (div) {
                div.style.opacity = 0;

                div.parentNode.removeChild(div);

                div.id = '';
                div.style.display = 'none';
                div = null;
            }

            if (bg) {
                bg.style.opacity = 0;

                bg.id = '';
                bg.style.display = 'none';
                bg = null;
            }
        }
        
        window.addEventListener('resize', function (e) {bg.onclick(e);}, false)
        
        /**
        * This sets the image as a global variable, circumventing repeated calls to document.getElementById()
        */
        __OfficeExcel_image_bg__  = bg;
        __OfficeExcel_image_div__ = div;


        setTimeout('__OfficeExcel_image_div__.style.opacity = 0.2', 50);
        setTimeout('__OfficeExcel_image_div__.style.opacity = 0.4', 100);
        setTimeout('__OfficeExcel_image_div__.style.opacity = 0.6', 150);
        setTimeout('__OfficeExcel_image_div__.style.opacity = 0.8', 200);
        setTimeout('__OfficeExcel_image_div__.style.opacity = 1', 250);

        setTimeout('__OfficeExcel_image_bg__.style.opacity = 0.1', 50);
        setTimeout('__OfficeExcel_image_bg__.style.opacity = 0.2', 100);
        setTimeout('__OfficeExcel_image_bg__.style.opacity = 0.3', 150);
        setTimeout('__OfficeExcel_image_bg__.style.opacity = 0.4', 200);
        setTimeout('__OfficeExcel_image_bg__.style.opacity = 0.5', 250);


        
        img.onclick = function (e)
        {
            if (e.stopPropagation) e.stopPropagation();
            else event.cancelBubble = true;
        }
        
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    }