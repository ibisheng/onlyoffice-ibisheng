    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {};




    /**
    * The chart constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the data as the second. If you need to change this, you can.
    * 
    * @param string id    The canvas tag ID
    * @param array  data  The chart data
    */
    OfficeExcel.Skeleton = function (id, data)
    {
        /**
        * Set these as object properties so they don't have to be constantly retrieved. Note that using a dollar
        * function - $() - can cause conflicts with popular javascript libraries, eg jQuery. It's therefore best
        * to stick to document.getElementById(). Setting the canvas and context as object properties means you
        * can reference them like this: myObj.canvas
        *                               myObj.context
        */
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;

        /**
        * This puts a reference to this object on to the canvas. Useful in event handling.
        */
        this.canvas.__object__ = this;

        /**
        * This defines the type of this graph type and should be a one word description.
        */
        this.type = 'skeleton';

        /**
        * This facilitates easy object identification, and should be true
        */
        this.isOfficeExcel = true;

        /**
        * This does a few things, for example adding the .fillText() method to the canvas 2D context when
        * it doesn't exist. This facilitates the graphs to be still shown in older browser (though without
        * text obviously). You'll find the function in OfficeExcel.common.core.js
        */
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

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[SKELETON] No canvas support');
            return;
        }

        /**
        * Store the data that was passed to this constructor
        */
        this.data = data;
        
        /**
        * This can be used to store the coordinates of shapes on the graph
        */
        this.coords = [];
        
        
        /**
        * If you add a .get*(e) method to ease getting the shape that's currently being hovered over
        * or has been clicked on (in the same vein as the Bar charts .getBar() method or the Line charts
        * .getPoint() method) then you should set this so that common methods have a common function
        * name to call - for example the context menu uses the common name .getShape(e) to add the
        * details to the context menu.
        */
        this.getShape = this.getXXX;
    }

    /**
    * The function you call to draw the chart after you have set all of the graph properties
    */
    OfficeExcel.Skeleton.prototype.Draw = function ()
    {
        /**
        * This draws the background image, which when loaded draws the graph, hence the return
        */
        if (typeof(this._otherProps._background_image) == 'string' && !this.__background_image__) {
            OfficeExcel.DrawBackgroundImage(this);
            return;
        }

        /**
        * Fire the custom OfficeExcel onbeforedraw event (which should be fired before the chart is drawn)
        */
        OfficeExcel.FireCustomEvent(this, 'onbeforedraw');

        /**
        * Clear all of this canvases event handlers (the ones installed by OfficeExcel)
        */
        OfficeExcel.ClearEventListeners(this.id);




        /*************************
        * Draw the chart here... *
        *************************/




        /**
        * These call common functions, that facilitate some of OfficeExcels features
        */


        /**
        * Setup the context menu if required
        */
        if (this._otherProps._contextmenu) {
            OfficeExcel.ShowContext(this);
        }

        /**
        * Draw "in graph" labels
        */
        if (this._otherProps._labels_ingraph) {
            OfficeExcel.DrawInGraphLabels(this);
        }
        
        /**
        * Draw crosschairs
        */
        if (this._otherProps._crosshairs) {
            OfficeExcel.DrawCrosshairs(this);
        }
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        if (this._otherProps._annotatable) {
            OfficeExcel.Annotate(this);
        }
        
        /**
        * This bit shows the mini zoom window if requested
        */
        if (this._zoom._mode == 'thumbnail' || this._zoom._mode == 'area') {
            OfficeExcel.ShowZoomWindow(this);
        }

        
        /**
        * This function enables resizing
        */
        if (this._otherProps._resizable) {
            OfficeExcel.AllowResizing(this);
        }


        /**
        * This function enables adjusting
        */
        if (this._otherProps._adjustable) {
            OfficeExcel.AllowAdjusting(this);
        }

        /**
        * Fire the custom OfficeExcel ondraw event (which should be fired when you have drawn the chart)
        */
        OfficeExcel.FireCustomEvent(this, 'ondraw');
    }
