// CONSTANTS

var DRAG_TABLE_ZONE_WIDTH       =   15;
var LINE_DOTTED__STEP           =   2;
var TABLE_ZONE_CAPTURE_LINE     =   3;
var TABLE_MIN_SIZE_CELL         =   15;
var TABLE_BOUNDS_RESIZER_OFFSET =   7;

// mode
var TableEditorModeDefault      =   0;
var TableEditorModeDOC          =   1;

//----------------------------------------------------------------------------------------------------------------------
var SizeUtils = {};
SizeUtils.renderLeftTop = function(){
    return {
        x:Render.getCanvas().offsetLeft - window.pageXOffset,
        y:Render.getCanvas().offsetTop  - window.pageYOffset };
};
SizeUtils.tablePositionAbs = function(table){
    return {
        x:Render.getCanvas().offsetLeft + table.getPosition().x,
        y:Render.getCanvas().offsetTop + table.getPosition().y };
};
SizeUtils.mouseCoordToCanvas = function(e){
    return {
        x:e.clientX - (Render.getCanvas().offsetLeft - window.pageXOffset),
        y:e.clientY - (Render.getCanvas().offsetTop  - window.pageYOffset) };
};
SizeUtils.coordToCanvas = function(e){
    return {
        x:e.x- (Render.getCanvas().offsetLeft - window.pageXOffset),
        y:e.y - (Render.getCanvas().offsetTop  - window.pageYOffset) };
};
var Cell = function(){this.init();};
Cell.prototype = {
    init:function(){
        this.__style    =   document.createElement('style');

        this.__indX     =   0;
        this.__indY     =   0;

        this.__x        =   0;
        this.__y        =   0;
        this.__width    =   0;
        this.__height   =   0;

    },
    default_ : function(){
    },
    style : function(){
        return this.__style;
    }
};

var LineStyle = function (){this.init();};
LineStyle.prototype = {
    init:function(){
        this.fill = "";
        this.borderColor    =  "#000000";
        this.borderWidth    =   1;
    },
    default_ : function(){
    },
    style : function(){
        return null;
    }
};

var StyleSystem = function(){this.init();};
StyleSystem.prototype = {
    init:function (){
        this.__columnStyles = [];
        this.__linesStyles = [];
    },
    clean:function(){
        this.__columnStyles = [];
        this.__linesStyles = [];
    },

    doTableEditorStyle:function(){

    },

    styleAt:function(type,x,y){
        if(type=='top'){
            if(null==this.__columnStyles)
                this.__columnStyles   =   [];

            var objT = this.__columnStyles[x+'*'+y];
            if (objT == undefined){
                objT = new LineStyle();
                this.__columnStyles[x+'*'+y]  =   objT;
            }

            return objT;
        }
        if(type=='bottom'){
            if(null==this.__columnStyles)
                this.__columnStyles   =   [];

            var objB = this.__columnStyles[x+'*'+(y+1)];
            if (objB == undefined){
                objB = new LineStyle();
                this.__columnStyles[x+'*'+(y+1)]  =   objB;
            }

            return objB;
        }
        if(type=='left'){
            if(null==this.__linesStyles)
                this.__linesStyles   =   [];

            var objT = this.__linesStyles[x+'*'+y];
            if (objT == undefined){
                objT = new LineStyle();
                this.__linesStyles[x+'*'+y]  =   objT;
            }

            return objT;
        }
        if(type=='right'){
            if(null==this.__linesStyles)
                this.__linesStyles   =   [];

            var objB = this.__linesStyles[(x+1)+'*'+y];
            if (objB == undefined){
                objB = new LineStyle();
                this.__linesStyles[(x+1)+'*'+y]  =   objB;
            }

            return objB;
        }

        return undefined;
    },
    readAt:function(type,x,y){
        if(type=='top')
            return this.__columnStyles[x+'*'+y];

        if(type=='bottom')
            return  this.__columnStyles[x+'*'+(y+1)];

        if (null==this.__linesStyles)
            return null;

        if(type=='right')
            return  this.__linesStyles[(x+1)+'*'+y];

        if(type=='left')
            return this.__linesStyles[x+'*'+y];

        return undefined;
    },

    cleanColumn:function(ind,from,to){
        for(var i=from;i<to;++i){
            var obj = ind + '*' + i;
            if (undefined!=this.__columnStyles [ obj ])
                delete this.__columnStyles [ obj ];
            if (undefined!=this.__linesStyles [ obj ])
                delete this.__linesStyles [ obj ];
        }
    },
    cleanLine:function(ind,from,to){
        for(var i=from;i<to;++i){
            var obj = i + '*' + ind;
            if (undefined!=this.__linesStyles [ obj ])
                delete this.__linesStyles [ obj ];
            if (undefined!=this.__columnStyles [ obj ])
                delete this.__columnStyles [ obj ];
        }
    },

    addColumn:function(ind,w,h){
        var column   =   [];
        this._copyStyles(this.__columnStyles,column,ind,h+1);
        this._shiftStyles(this.__columnStyles,column,w+1,h+1,ind+1,0,-1,0);

        var lines   =   [];
        this._copyStyles(this.__linesStyles,lines,ind,h+1);
        this._shiftStyles(this.__linesStyles,lines,w+1,h+1,ind+1,0,-1,0);

        var elem;
        for (elem in this.__columnStyles)
            delete this.__columnStyles[elem];
        for (elem in this.__linesStyles)
            delete this.__linesStyles[elem];

        delete this.__columnStyles;
        this.__columnStyles   =   column;

        delete this.__linesStyles;
        this.__linesStyles   =   lines;
    },
    addLine:function(ind,w,h){
        var column   =   [];
        this._copyStyles(this.__columnStyles,column,w+1,ind);
        this._shiftStyles(this.__columnStyles,column,w+1,h+1,0,ind+1,0,-1);

        var lines   =   [];
        this._copyStyles(this.__linesStyles,lines,w+1,ind);
        this._shiftStyles(this.__linesStyles,lines,w+1,h+1,0,ind+1,0,-1);

        var elem;
        for (elem in this.__columnStyles)
            delete this.__columnStyles[elem];
        for (elem in this.__linesStyles)
            delete this.__linesStyles[elem];

        delete this.__columnStyles;
        this.__columnStyles   =   column;

        delete this.__linesStyles;
        this.__linesStyles   =   lines;
    },

    deleteColumn:function(ind,from,to,w,h){

        var column   =   [];
        this._copyStyles(this.__columnStyles,column,ind,h+1);
        this._shiftStyles(this.__columnStyles,column,w+1,h+1,ind,0,1,0);

        var lines   =   [];
        this._copyStyles(this.__linesStyles,lines,ind,h+1);
        this._shiftStyles(this.__linesStyles,lines,w+1,h+1,ind,0,1,0);

        var elem;
        for (elem in this.__columnStyles)
            delete this.__columnStyles[elem];
        for (elem in this.__linesStyles)
            delete this.__linesStyles[elem];

        delete this.__columnStyles;
        this.__columnStyles   =   column;

        delete this.__linesStyles;
        this.__linesStyles   =   lines;
    },
    deleteLine:function(ind,from,to,w,h){
        var column   =   [];
        this._copyStyles(this.__columnStyles,column,w+1,ind);
        this._shiftStyles(this.__columnStyles,column,w+1,h+1,0,ind,0,1);

        var lines   =   [];
        this._copyStyles(this.__linesStyles,lines,w+1,ind);
        this._shiftStyles(this.__linesStyles,lines,w+1,h+1,0,ind,0,1);

        var elem;
        for (elem in this.__columnStyles)
            delete this.__columnStyles[elem];
        for (elem in this.__linesStyles)
            delete this.__linesStyles[elem];

        delete this.__columnStyles;
        this.__columnStyles   =   column;

        delete this.__linesStyles;
        this.__linesStyles   =   lines;
    },

    _copyStyles:function(src,dst,w,h){
        for (var i=0; i<w;++i){
            for (var j=0; j<h;++j){
                var ind = i + '*' + j;
                if (undefined!= src[ind])
                    dst[ind]    =   src[ind];
            }
        }
    },
    _shiftStyles:function(src,dst,w,h,fromx,fromy,offx,offy){
        for (var i=fromx; i<w;++i){
            for (var j=fromy; j<h;++j){
                var ind = i + '*' + j;
                var shiftInd = (i + offx)+ '*' + (j+offy);
                if (undefined!= src[shiftInd])
                    dst[ind]    =   src[shiftInd];
            }
        }
    },

    addColumnCopy:function(indw,w,h){

    },
    addLineCopy:function(indw,w,h){

    }
};

var MultiCells = function(){this.init();};
MultiCells.prototype = {
    init:function(){
        this._storage  =   new Object();
        this._main   =    new Object();
    },

    getOfIndex:function(obj){
        return this._storage[obj.x+'.'+obj.y];
    },
    isMain:function(obj){
        return this._main[obj.x+'.'+obj.y];
    },

    merge:function(obj){
        if (obj!=undefined){
            if (obj.w <1&&obj.h<1)
                return;

            var mainInd             =   obj.target.x+'.'+obj.target.y;
            this._storage[mainInd]  =   obj;
            this._main[mainInd]     =   true;

            for (var i=0; i<=obj.w;++i){
                for (var j=0; j<=obj.h;++j) {
                    var ind = (obj.target.x+i)+'.'+(obj.target.y+j);
                    this._storage[ind] = obj;

                    if (undefined!=this._main[ind]&&mainInd!=ind)
                        delete this._main[ind];
                }
            }
        }
    },
    unmerge:function(obj){
        if (obj!=undefined){
            if (obj.w <1&&obj.h<1)
                return;

            this._storage[obj.target.x+'.'+obj.target.y]   =   undefined;

            for (var i=0; i<=obj.w;++i){
                for (var j=0; j<=obj.h;++j) {
                    // TODO : delete property
                    this._storage[(obj.target.x+i)+'.'+(obj.target.y+j)] = undefined;
                }
            }

            delete this._main[obj.target.x+'.'+obj.target.y];
        }
    }
};

var ModeOneTableStyle    =   function(ref){
    var obj  =   new Object ();

    obj.init    =   function(){
        this._leftTopStyle    =   new Object ();
        this._leftTopStyle.borderWidth =   1;
        this._leftTopStyle.borderColor =   '#D2D6DE';

        this._cellStyle    =   new Object ();
        this._cellStyle.borderWidth =   1;
        this._cellStyle.borderColor =   '#000000';
    };
    obj.cellStyle    =   function(){
        return this._cellStyle;
    };

    obj.upLeftStyle =   function(){
        return this._leftTopStyle;
    };

    obj.update  =   function(){
        // update table styles
    };

    obj.init();
    return obj;
};

var CursorStyle = function(){
    var obj =   new Object();

    obj.currentStyle    =   '';

    obj.initStyles  =   function(){
        this.cursors    =   [];

        //this.cursors.push ('splitcursorhor');
    };
    obj.update  =   function(style){
        this.reset();

        if (style!=''){
            this.currentStyle   =   style;
            document.body.className += ' ' + this.currentStyle;
        }
    };
    obj.reset   =   function(){
        if (this.currentStyle!=''){
            var style   =   document.body.className.replace(' '+this.currentStyle,'');
            document.body.className =   style;
            this.currentStyle ='';
        }
    };

    obj.initStyles();
    return obj;
};

//----------------------------------------------------------------------------------------------------------------------

var TableModel = function(id){this.init (id);};
TableModel.prototype = {

    init : function(id){
        this.__id   =   id;
        this._delegate  = null;

        this._x     =   0;
        this._y     =   0;

        this._linesSizes = [];
        this._rowSizes = [];
        this.__cells = null;

        this.__columnStyles = [];
        this.__linesStyles = [];

        this.__fullLinesStyle   = null;

        this._styleSystem  =   null;
        this._editorMode   =   0;
        this._multiCells   =   null;

        this._handlers      =   new Object();

        this._cursor        =   new CursorStyle();
    },

    addHandlerEvent:function(name,func){
        if (undefined!=this._handlers[name]){
            delete this._handlers[name];
        }
        this._handlers [name]  =   func;
    },
    invokeHandlerEvent:function(name,obj){
        if (undefined!=this._handlers[name]){
            this._handlers[name] (this._delegate, obj);
        }
    },
    invokeDelegate:function(del){
        this._delegate  =   del;
    },

    setEditMode:function(mode){
        this._editorMode  =   mode;
    },
    editorMode:function(){
        return this._editorMode;
    },

    getID : function (){
        return this.__id;
    },

    getBounding : function() {

        var width   =   this.width();
        var height  =   this.height();
        var x       =   this._x;
        var y       =   this._y;

        return {x:x, y:y,width:width, height:height};
    },
    getSizeXY : function (){
        var x   =  this._x + this.width();
        var y  =   this._y + this.height();
        return {x:x, y:y};
    },
    getPosition : function (){
        return {x:this._x, y:this._y};
    },
    setPosition : function (x,y){
        this._x = x;
        this._y = y;
    },

    move : function (x,y)    {
        this._x += x;
        if ( this._x < 0) this._x = 0;

        this._y += y;
        if ( this._y < 0) this._y = 0;
    },

    isExist : function (x,y) {

        var width   =   this.width();
        var height  =   this.height();

        return (x >= this._x && x <= (this._x + width) ) && (y >= this._y && y <= (this._y + height) );
    },
    isExistWithOffSet : function (x,y,addx,addy) {
        var width   =   this.width();
        var height  =   this.height();

        return (x >= this._x && x <= (this._x + width + addx) ) && (y >= this._y && y <= (this._y + height + addy) );
    },
    isPosBelongsColumn:function(n,val){
        return false;
    },
    isPosBelongsLine:function(i,val){
        return false;
    },

 	getX:function() {
		return this._x;
	},
	getY:function() {
		return this._y;
	},

    width : function (){
        var width   =   0;
        for (var i=0;i<this._rowSizes.length;++i)
            width += this._rowSizes [i];

        return width;
    },
    height : function (){
        var height   =   0;
        for (var i=0;i<this._linesSizes.length;++i)
            height += this._linesSizes [i];

        return height;
    },

    columnSize : function(i){
        if ( 0 == this._rowSizes.length)
            return 0;

        return this._rowSizes [i];
    },
    lineSize : function(i){
        if ( 0 == this._linesSizes.length)
            return 0;

        return this._linesSizes [i];
    },

    columnesCount : function(){
        return this._rowSizes.length;
    },
    linesCount : function(){
        return this._linesSizes.length;
    },

    columnSizeFromTo:function(fr,to){
        var val   =   0;
        for (var i=fr;i<this._rowSizes.length&&i<=to; ++i)
            val += this._rowSizes [i];

        return val;
    },
    lineSizeFromTo:function(fr,to){
        var val   =   0;
        for (var i=fr;i<this._linesSizes.length&&i<=to; ++i)
            val += this._linesSizes [i];

        return val;
    },

    insertColumn:function(ind,size){
        if (ind >= this._rowSizes.length||ind<0){
            this._rowSizes.push(size);
            return;
        }

        if (this._styleSystem)
            this._styleSystem.addColumn(ind,this._rowSizes.length, this._linesSizes.length);

        this._rowSizes.splice(ind,0,size);
    },
    insertLine:function(ind,size){
        if (ind >= this._linesSizes.length||ind<0){
            this._linesSizes.push(size);
            return;
        }

        if (this._styleSystem)
            this._styleSystem.addLine(ind,this._rowSizes.length, this._linesSizes.length);

        this._linesSizes.splice(ind,0,size);
    },

    deleteLine:function(i){
        if (this._styleSystem)
            this.deleteLineStyle(i);

        this._linesSizes.splice(i,1);
    },
    deleteColumn:function(i){
        if (this._styleSystem)
            this.deleteColumnStyle(i);

        this._rowSizes.splice(i,1);
    },

    updateLineSizeIf:function(fr,val){
        if (this._linesSizes [fr] != val){
            this._linesSizes [fr] = Math.max( val, TABLE_MIN_SIZE_CELL);

            return true;
        }

        return false;
    },

    updateColumnSizeIf:function(fr,val){
        if (this._rowSizes [fr] != val){
            this._rowSizes [fr] = Math.max( val, TABLE_MIN_SIZE_CELL);

            return true;
        }

        return false;
    },
    // for refract

    getCaptureLine : function(o){
        var h = this._y;

        for (var i = 0; i < this._linesSizes.length; ++i) {
            if (Math.abs(o - h) < TABLE_ZONE_CAPTURE_LINE)
                return i;
            h += this._linesSizes [i];
        }

        if (Math.abs(o - h) < TABLE_ZONE_CAPTURE_LINE)
            return this._linesSizes.length;

        return -1;
    },
    getCaptureRow : function(o){
        var w = this._x;

        for (var i = 0; i < this._rowSizes.length; ++i) {
            if (Math.abs(o - w) < TABLE_ZONE_CAPTURE_LINE)
                return i;
            w += this._rowSizes [i];
        }

        if (Math.abs(o - w) < TABLE_ZONE_CAPTURE_LINE)
            return this._rowSizes.length;

        return -1;
    },
    getSelectLineCell : function(o){
        var w = this._y;

        for (var i = 0; i < this._linesSizes.length; ++i) {
            if ( o >= w && o < w + this._linesSizes [i] )
                return i;
            w += this._linesSizes [i];
        }

        return -1;
    },
    getSelectRowCell : function(o){
        var w = this._x;

        for (var i = 0; i < this._rowSizes.length; ++i) {
            //var pp = w + this._rowSizes [i];
            if ( o >= w && o < w + this._rowSizes [i] )
                return i;
            w += this._rowSizes [i];
        }

        return -1;
    },

    setLineSize : function(i,value){
        this._linesSizes [i] = Math.max( value, TABLE_MIN_SIZE_CELL);
    },
    setRowSize : function(i,value){
        this._rowSizes [i] =  Math.max( value, TABLE_MIN_SIZE_CELL);
    },

    resizeProportional : function(fx,fy){
        for (var i = 0; i < this._linesSizes.length; ++i) {
            this._linesSizes [i] *= fy;
            this._linesSizes [i] =  Math.round(Math.max (this._linesSizes [i],TABLE_MIN_SIZE_CELL));
        }
        for (var i = 0; i < this._rowSizes.length; ++i) {
            this._rowSizes [i] *= fx;
            this._rowSizes [i] = Math.round(Math.max (this._rowSizes [i],TABLE_MIN_SIZE_CELL));
        }
    },

    deleteColumnStyle:function(i){
        if (this._styleSystem)
            this._styleSystem.deleteColumn(i,0,this._rowSizes.length,this._rowSizes.length, this._linesSizes.length );
    },
    deleteLineStyle:function(i){
        if (this._styleSystem)
            this._styleSystem.deleteLine(i,0,this._rowSizes.length,this._rowSizes.length, this._linesSizes.length );
    },

    getStyle : function(c){
        return this.__cells[c];
    },
    getCell : function(x,y){

        if (null==this.__cells)
            this.__cells    =   [];

        var ref = this.__cells[x + '_' + y];
        if (undefined==ref){
            var obj = new Cell();
            this.__cells[x + '_' + y]    =   obj;
        }

        return this.__cells[x + '_' + y];
    },

    styleSystem: function(){
        return this._styleSystem;
    },
    getLineStyle : function (type,x,y){

        if (null==this._styleSystem)
            this._styleSystem = new StyleSystem();

        return this._styleSystem.styleAt(type,x,y);
    },
    readLineStyle : function (type,x,y){

        if (null==this._styleSystem)
            this._styleSystem = new StyleSystem();

        return this._styleSystem.readAt(type,x,y);
    },
    defaultStyles : function(){
        if (this._styleSystem)
            this._styleSystem.clean();
    },

    merger:function(){
        if (null==this._multiCells)
            this._multiCells = new MultiCells();
        return this._multiCells;
    },

    cursor:function(){
        return this._cursor;
    }
};

var TableController = function (table,select,scroll,tools){this.init (table,select,scroll,tools);};
TableController.prototype = {

    init: function(table,select,scroll,tools){
        this._table = table;
        this._select = select;
        this._scroll = scroll;
        this._tools = tools;

        this._mousedown = false;
        this._mouseOn = false;
        this._captureDrag = false;
        this._mouseX = 0;
        this._mouseY = 0;

        this._moveX = 0;
        this._moveY = 0;
    },

    isFocused : function(x,y){
        return this._table.isExist(x,y);
    },

    setPos : function(x,y){
        this._table.setPosition(x,y);
    },

    resizeProportional : function(fx,fy){
        this._table.resizeProportional(fx,fy);
        this._scroll.move ({x:0,y:0});

        this._updateForDefaultMode ();
    },

    appendLeftColumn : function(x,y){
        if (this._table.isExist(x,y)){
            var capture =   this._table.getSelectRowCell(x);
            if (-1 != capture){
                var ind =   Math.max(0,capture);
                this._table.insertColumn (capture,this._table._rowSizes[ind]);
                //this.__table._rowSizes.splice(capture,0,this.__table._rowSizes[ind]);

                NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());
                this._table.invokeHandlerEvent('addColumn',capture);

                this._updateForDefaultMode ();
            }
        }
    },
    appendRightColumn : function(x,y){
        if (this._table.isExist(x,y)){
            var capture =   this._table.getSelectRowCell(x) + 1;
            var ind     =   Math.min(this._table.columnesCount()-1,capture);
            this._table.insertColumn (capture,this._table._rowSizes[ind]);

            NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());

            this._table.invokeHandlerEvent('addColumn',capture);

            this._updateForDefaultMode ();
        }
    },
    appendUpLine : function(x,y){
        if (this._table.isExist(x,y)){
            var capture = this._table.getSelectLineCell(y);
            if (-1 != capture){
                var ind =   Math.max(0,capture);
                this._table.insertLine (ind,this._table._linesSizes[ind]);
                // this.__table._linesSizes.splice(capture,0,this.__table._linesSizes[ind]);

                NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());

                this._table.invokeHandlerEvent('addLine',ind);

                this._updateForDefaultMode ();
            }
        }
    },
    appendDownLine : function(x,y){
        if (this._table.isExist(x,y)){
            var capture =   this._table.getSelectLineCell(y) + 1;
            var ind     =   Math.min(this._table.linesCount()-1,capture);
            this._table.insertLine (capture,this._table._linesSizes[ind]);

            NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());

            this._table.invokeHandlerEvent('addLine',capture);

            this._updateForDefaultMode ();
        }
    },

    deleteLine: function(x,y){
        if (this._table.isExist(x,y)){
            var capture =   this._table.getSelectLineCell(y);
            if (-1 != capture){
                this._table.deleteLine(capture);

                NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());

                this._table.invokeHandlerEvent('deleteLine',capture);

                this._updateForDefaultMode ();
            }
        }
    },
    deleteColumn: function(x,y){
        if (this._table.isExist(x,y)){
            var capture =   this._table.getSelectRowCell(x);
            if (-1 != capture){
                this._table.deleteColumn(capture);

                NotifityManager.send(SystemReleaseSelectedItems, this._table.getID());

                this._table.invokeHandlerEvent('deleteColumn',capture);

                this._updateForDefaultMode ();
            }
        }
    },

    onmousemove : function (e,x,y) {

    },
    onmousedown : function(e,x,y){
    },
    onmouseup : function(e,x,y){

    },

    getLineStyle : function(s,x,y){
        return this._table.getLineStyle(s,x,y);
    },

    doDefaultStyles : function(){
        this._table.defaultStyles();
    },

    editorMode : function(mode){
        this._table.setEditMode(mode);
    },

    merge:function(obj){
        this._table.merger().merge(obj);

        // TODO: clean styles at target cell
    },
    mergeSelectedItems:function(){
        if (undefined!=this._select){
            var bound = this._select.bound();
            // if (bound.w==1 && bound.h==1)
            //     return;

            var mergeObj = new Object()
            mergeObj.target =   {x:bound.x,y:bound.y};
            mergeObj.w = bound.w;
            mergeObj.h = bound.h;
            this.merge(mergeObj);

            NotifityManager.send(SystemMergeSelectedItems, this._table.getID());
        }
    },
    unmerge:function(obj){
        this._table.merger().unmerge(obj);

        // TODO: clean styles at target cell
    },
    unmergeSelectedItems:function(){
        if (undefined!=this._select){
            var bound = this._select.bound();
            // if (bound.w==1 && bound.h==1)
            //     return;

            var mergeObj = new Object()
            mergeObj.target = {x:bound.x,y:bound.y};
            mergeObj.w = bound.w;
            mergeObj.h = bound.h;
            this.unmerge(mergeObj);

            NotifityManager.send(SystemUnmergeSelectedItems, this._table.getID());
        }
    },
    itemsSelectedBound:function(){
        if (undefined!=this._select)
            return this._select.bound();

        return undefined;
    },
    clean:function(){
        if (undefined!=this._select)
            return this._select.release();
    },

    scroll:function(obj){
        this._scroll.move(obj);
        NotifityManager.send(UserTableScrollItems, this._table.getID());
    },

    toolsEditorMode:function(){
        return this._tools;
    },

    _updateForDefaultMode:function(){
        if (TableEditorModeDefault == this._table.editorMode()){
            this._scroll.updateSizes();
            this._table.invokeHandlerEvent('updateScrolls');
        }
    }
};

var TableView = function (table, elements){this.init(table,elements);};
TableView.prototype = {

    init : function(table,elements){
        this._table        =   table;
        this._delegate  =   null;
        this._elements      =   elements;
        this.showStructure  =   false;

        this._mouse =   {x:0,y:0};

        this._tools             =   new ToolEditor(this);
        // this._tools.mode(ToolModeLinePencil);

        this._scroll            =   new ScrollStatus(this._table);
        this.__selected         =   new ActiveSelect (this);
        this.__controller       =   new TableController(this._table, this.__selected,this._scroll,this._tools);

        // helpers
        this.__dragTrack        =   new DragTrack (this._table);
        this.__lineMover        =   new LineSizer (this);
        this.__boundsResizer    =   new BoundsResizer (this);
        this.__targetDelegate   =   null;

        // this.editorMode (TableEditorModeDefault);

        NotifityManager.bind(this,NeeedDisplayUpdate);
        NotifityManager.bind(this,UserTableChangePosition);
        NotifityManager.bind(this,UserTableChangeSizes);
    },
    release : function(){
        NotifityManager.unbind(this);
        NotifityManager.unbind(this.__dragTrack);
        NotifityManager.unbind(this.__boundsResizer);
        NotifityManager.unbind(this.__selected);

        this.__dragTrack.release();
        this.__boundsResizer.release();
        this.__selected.release();

        this._tools.release();

        this.killFocus();
    },
    getID : function (){
        return this._table.getID();
    },

    controller : function(){
        return this.__controller;
    },
    model : function(){
        return this._table;
    },
    scrolls:function(){
        return this._scroll;
    },

    setDelegate:function(obj){
        this._delegate  =   obj;
        this._table.invokeDelegate(this._delegate);
    },

    editorMode:function(val){
        if (val!=this._table.editorMode()){
            this.__selected.release();
            this._table.setEditMode(val);
            Notifity.bind(null,null);
        }

        if (TableEditorModeDefault==val){
            this._tools.mode(ToolModeDefault);
            this.__dragTrack.release();
            this.__boundsResizer.release();
            this.killFocus();
        }

        if (TableEditorModeDOC==val){
        }
    },

    killFocus : function (){
        this.__targetDelegate   =   null;
    },

    findTargetCell:function(crd){
        return { x:this._table.getSelectRowCell (crd.x),
            y:this._table.getSelectLineCell (crd.y) };
    },

    _notifity:function(id){
        this._table.invokeHandlerEvent('needPaint', null);
    },
    _paint:function(){
        this.drawTable ();
    },

    onmousemove:function(e) {
        if(this._tools.isEnable()){
            this._tools.onmousemove(e);
            return;
        }

        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        if (TableEditorModeDOC == this._table.editorMode()){
            if (null==this.__targetDelegate || this.__targetDelegate == this.__dragTrack)
                this.__dragTrack._showHelper(this._mouse.x,this._mouse.y);
        }

        if (this.__targetDelegate) {
            this.__targetDelegate.onmousemove(e);
        }
        else{
            if (TableEditorModeDOC == this._table.editorMode()){
                if ( this.__dragTrack.isZone(this._mouse.x,this._mouse.y) )
                    this.__dragTrack.onmousemove(e);
                else
                if ( this.__boundsResizer.isZone(this._mouse.x,this._mouse.y) )
                    this.__boundsResizer.onmousemove(e);
                else
                    this.__lineMover.onmousemove(e);
            }

            if (TableEditorModeDefault == this._table.editorMode()){
                this.__lineMover.onmousemove(e);
            }
        }

        Notifity.bind(null,null);
    },
    onmousedown:function(e){
        if(this._tools.isEnable()){
            this._tools.onmousedown(e);
            return;
        }

        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        if (TableEditorModeDOC == this._table.editorMode()){
            if ( this.__dragTrack.isZone(this._mouse.x,this._mouse.y) )
                this.__targetDelegate   =   this.__dragTrack;
            else
            if ( this.__boundsResizer.isZone(this._mouse.x,this._mouse.y) )
                this.__targetDelegate   =   this.__boundsResizer;
            else
            if ( this.__lineMover.isCaptureLine(this._mouse.x,this._mouse.y) )
                this.__targetDelegate   =   this.__lineMover;
            else
                this.__targetDelegate   =   this.__selected;
        }

        if (TableEditorModeDefault == this._table.editorMode()){
            if ( this.__lineMover.isCaptureLine(this._mouse.x,this._mouse.y) )
                this.__targetDelegate   =   this.__lineMover;
            else
                this.__targetDelegate   =   this.__selected;
        }

        if (this.__targetDelegate) {
            this.__targetDelegate.onmousedown(e);

            Notifity.bindFocusObj ( this );
        }
    },
    onmouseup:function(e){
        if(this._tools.isEnable()){
            this._tools.onmouseup(e);
            return;
        }

        if ( this.__targetDelegate )
            this.__targetDelegate.onmouseup(e);

        Notifity.killFocus();

        this.__targetDelegate   =   null;
    },
    onkeydown:function(e){
        if (undefined!=this.__selected){
            this.__selected.onkeydown(e);
        }
    },

    // for drawing

    drawTable:function (){
        if ((0!=this._scroll.x||0!=this._scroll.y) && (TableEditorModeDefault == this._table.editorMode()) )
            this.drawCustomStyleTableOff ();
        else
            this.drawCustomStyleTable();

        if(TableEditorModeDOC == this._table.editorMode()&&this.showStructure)
            this.drawDottedStructure();
    },
    drawDefaultStyleTable:function(){
        var context = Render.get();
        if (context){
            var __table     =   this._table;

            var tableX      =   __table.getBounding().x;
            var tableY      =   __table.getBounding().y;
            var tableWidth  =   __table.width();
            var tableHeight =   __table.height();

            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            context.clearRect ( tableX, tableY, tableWidth + 1, tableHeight + 1 );  //  for debug
            context.beginPath();

            var half    =   0.5;
            var offset  =    0;

            for (var i=0; i<=__table.columnesCount();++i){
                context.moveTo ( tableX + offset + half, tableY );
                context.lineTo ( tableX + offset + half, tableY + tableHeight );

                offset  +=   __table.columnSize(i);
            }

            offset  =   0;

            for (var j=0; j<=__table.linesCount();++j){
                context.moveTo ( tableX,              tableY + offset + half );
                context.lineTo ( tableX + tableWidth, tableY + offset + half );
                offset  +=   __table.lineSize(j);
            }

            context.closePath();
            context.lineWidth = 1;
            context.stroke();
        }
    },
    drawCustomStyleTable:function(){
        var context = Render.get();
        if (context){
            var __table     =   this._table;

            var tableX      =   __table.getBounding().x;
            var tableY      =   __table.getBounding().y;
            var tableWidth  =   __table.width();
            var tableHeight =   __table.height();

            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            var half    =   0.5;
            var offset  =    0;

            var offX = 0;
            var offY = 0;

            var merger = this._table.merger();
            var clipX   =   Render.getCanvas().width;
            var clipY   =   Render.getCanvas().height;

            for (var i = 0; i <= __table.columnesCount();++i){
                for (var j = 0; j <= __table.linesCount();++j){
                    var fromX   =   tableX + offX + half;
                    var fromY   =   tableY + offY + half;

                    if (fromX<clipX&&fromY<clipY)
                    {
                        var top     =   this._table.readLineStyle('top', i, j);
                        if (!this.drawMultiCell(context,top,merger,i,j,fromX,fromY))
                            this.drawNormalCell(context,i,j,fromX,fromY);
                    }

                    offY    +=  __table.lineSize(j);
                }

                offY    =   0;
                offX    +=  __table.columnSize(i);
            }
        }
    },
    drawCustomStyleTableOff:function(){
        var context = Render.get();
        if (context){
            var __table     =   this._table;

            var tableX      =   __table.getBounding().x;
            var tableY      =   __table.getBounding().y;
            var tableWidth  =   __table.width();
            var tableHeight =   __table.height();

            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            // context.clearRect ( tableX, tableY, tableWidth + 1, tableHeight + 1 );  //  for debug

            var half    =   0.5;
            var offset  =   0;

            var offX = 0;
            var offY = 0;

            var firstColumnSize =   this._table.columnSizeFromTo(0,0);
            var firstLineSize   =   this._table.lineSizeFromTo(0,0);

            var merger          =   this._table.merger();

            var scrollX         =   this._scroll.position().x;
            var scrollY         =   this._scroll.position().y;
            var scrollCell      =   this.findTargetCell({x:tableX + firstColumnSize + scrollX, y:tableY + firstLineSize + scrollY});

            offX                =   firstColumnSize;
            offY                =   firstLineSize;

            var clipX           =   Math.min(Render.getCanvas().width, tableWidth-offX);
            var clipY           =   Math.min(Render.getCanvas().height, tableHeight-offY);

            context.save();
            context.rect(tableX+offX,tableY+offY,clipX+2,clipY+2);
            context.clip();

            var i = 0;
            var j = 0;

            var str = '';

            var linesCount  =   __table.linesCount();
            var columnesCount   =    __table.columnesCount();

            for (i = 1; i <= columnesCount; ++i){
                for (j = 1; j <= linesCount; ++j ){
                    var fromX   =   tableX + offX + half;
                    var fromY   =   tableY + offY + half;

                    if (i!=0)
                        fromX -= scrollX;
                    if (j!=0&&i!=0)
                        fromY -= scrollY;

                    var drawCell = true;
                    if (i!=0)
                    {
                        if (j<scrollCell.y&&j>0){
                            offY    +=  __table.lineSize(j);
                            continue;
                        }

                        if (i<scrollCell.x&&i>0){
                            drawCell = false;
                            continue;
                        }
                    }

                    if (fromX<clipX&&fromY<clipY){
                         var top     =   this._table.readLineStyle('top', i, j);
                        if (!this.drawMultiCell(context, top, merger, i, j, fromX, fromY))
                            this.drawNormalCell(context,i,j,fromX,fromY);

                      //  str += 'cell (' +i+':'+j +') ';
                    }


                    offY    +=  __table.lineSize(j);
                }

                offY    =   firstLineSize;
                offX    +=  __table.columnSize(i);
            }

            //console.log(str);

            context.restore();

            context.save();
            context.rect(tableX,tableY, Math.min(Render.getCanvas().height,firstColumnSize + 2), Math.min(Render.getCanvas().width,tableHeight+2) );
            context.clip();

            i = 0;  j = 0; offX = 0; offY = 0;
            for (;j<= linesCount;++j){
                var fromX = tableX + offX + half;
                var fromY = tableY + offY + half;

                if (i!=0)
                    fromX -= scrollX;
                if (j!=0)
                    fromY -= scrollY;

                if (fromX<clipX&&fromY<clipY){
                    var top     =   this._table.readLineStyle('top', i, j);
                    if (!this.drawMultiCell(context,top,merger,i,j,fromX,fromY))
                        this.drawNormalCell(context,i,j,fromX,fromY);
                }

                offY    +=  __table.lineSize(j);
            }
            context.restore();

            context.save();
            context.rect(tableX,tableY,Math.min(Render.getCanvas().width,tableWidth), Math.min(Render.getCanvas().height,firstLineSize+2) );
            context.clip();

            i = 0;  j = 0; offX = 0; offY = 0;
            for (;i<=columnesCount;++i){
                var fromX   =   tableX + offX + half;
                var fromY   =   tableY + offY + half;

                if (i!=0)
                    fromX -= scrollX;
                if (j!=0&&i!=0)
                    fromY -= scrollY;

                if (fromX<clipX&&fromY<clipY){
                    var top     =   this._table.readLineStyle('top', i, j);
                    if (!this.drawMultiCell(context,top,merger,i,j,fromX,fromY))
                        this.drawNormalCell(context,i,j,fromX,fromY);
                }

                offY    =   0;
                offX    +=  __table.columnSize(i);
            }

            context.restore();
        }
    },

    drawMultiCell:function(context,top,merger,i,j,fromX,fromY){
        var targetMrg = merger.getOfIndex({x:i,y:j});
        if(undefined!=targetMrg){
            if(undefined!=merger.isMain({x:i,y:j})){
                var width   =   this._table.columnSizeFromTo(i,targetMrg.w+i);
                var height  =   this._table.lineSizeFromTo(j,targetMrg.h+j);

                if (top&&''!=top.fill){
                    context.beginPath();
                    context.rect(fromX, fromY, width, height);
                    context.fillStyle   =   top.fill;
                    context.closePath();
                    context.fill();
                }
                this.drawMultiCellLines(context,i,j,fromX,fromY,width,height);
            }
            return true;
        }
        return false;
    },
    drawMultiCellLines:function(context,i,j,fromX,fromY,width,height){
        var top     =   this._table.readLineStyle('top', i, j);
        if (top){
            context.beginPath();
            context.lineWidth   =   top.borderWidth;
            context.strokeStyle =   top.borderColor;

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX + width, fromY );

        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX + width, fromY );
        }

        context.closePath();
        context.stroke();

        var bottom  =   this._table.readLineStyle('bottom', i, j);
        if (bottom){
            context.beginPath();
            context.lineWidth   =   bottom.borderWidth;
            context.strokeStyle =   bottom.borderColor;

            context.moveTo ( fromX, fromY + height );
            context.lineTo ( fromX + width, fromY + height );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            context.moveTo ( fromX, fromY + height );
            context.lineTo ( fromX + width, fromY + height );
        }

        context.closePath();
        context.stroke();

        var left   =   this._table.readLineStyle('left', i, j);

        if (left){
            context.beginPath();
            context.lineWidth   =   left.borderWidth;
            context.strokeStyle =   left.borderColor;

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX, fromY + height );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";
            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX, fromY + height );
        }

        context.closePath();
        context.stroke();

        var right  =   this._table.readLineStyle('right', i, j);
        if (right){
            context.beginPath();
            context.lineWidth   =   right.borderWidth;
            context.strokeStyle =   right.borderColor;

            context.moveTo ( fromX + width, fromY );
            context.lineTo ( fromX + width, fromY + height );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";
            context.moveTo ( fromX + width, fromY );
            context.lineTo ( fromX + width, fromY + height );
        }

        context.closePath();
        context.stroke();
    },

    drawNormalCell:function(context,i,j,fromX,fromY,fX,fY){
        var top     =   this._table.readLineStyle('top', i, j);
        if (top){
            if (''!=top.fill){
                context.beginPath();
                context.rect(fromX, fromY, this._table.columnSize(i), this._table.lineSize(j));
                context.fillStyle   =   top.fill;
                context.closePath();
                context.fill();
            }

            context.beginPath();
            context.lineWidth   =   top.borderWidth;
            context.strokeStyle =   top.borderColor;

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX + this._table.columnSize(i), fromY );

        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX + this._table.columnSize(i), fromY );
        }

        context.closePath();
        context.stroke();

        var bottom  =   this._table.readLineStyle('bottom', i, j);
        if (bottom){
            context.beginPath();
            context.lineWidth   =   bottom.borderWidth;
            context.strokeStyle =   bottom.borderColor;

            context.moveTo ( fromX, fromY + this._table.lineSize(j) );
            context.lineTo ( fromX + this._table.columnSize(i), fromY + this._table.lineSize(j) );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";

            context.moveTo ( fromX, fromY + this._table.lineSize(j) );
            context.lineTo ( fromX + this._table.columnSize(i), fromY + this._table.lineSize(j) );
        }

        context.closePath();
        context.stroke();

        var left   =   this._table.readLineStyle('left', i, j);

        if (left){
            context.beginPath();
            context.lineWidth   =   left.borderWidth;
            context.strokeStyle =   left.borderColor;

            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX, fromY + this._table.lineSize(j) );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";
            context.moveTo ( fromX, fromY );
            context.lineTo ( fromX, fromY + this._table.lineSize(j) );
        }

        context.closePath();
        context.stroke();

        var right  =   this._table.readLineStyle('right', i, j);
        if (right){
            context.beginPath();
            context.lineWidth   =   right.borderWidth;
            context.strokeStyle =   right.borderColor;

            context.moveTo ( fromX + this._table.columnSize(i), fromY );
            context.lineTo ( fromX + this._table.columnSize(i), fromY + this._table.lineSize(j) );
        }else{
            context.beginPath();
            context.lineWidth   =   1;
            context.strokeStyle =   "black";
            context.moveTo ( fromX + this._table.columnSize(i), fromY );
            context.lineTo ( fromX + this._table.columnSize(i), fromY + this._table.lineSize(j) );
        }

        context.closePath();
        context.stroke();
    },

    drawDottedMultiCell:function(context,top,merger,i,j,fromX,fromY){
        var targetMrg = merger.getOfIndex({x:i,y:j});
        if(undefined!=targetMrg){
            if(undefined!=merger.isMain({x:i,y:j})){

                context.dottedLineTo ( fromX, fromY, fromX + this._table.columnSizeFromTo(i,targetMrg.w+i), true );
                context.dottedLineTo ( fromX, fromY + this._table.lineSizeFromTo(j,targetMrg.h+j), fromX + this._table.columnSize(i), true );
                context.dottedLineTo ( fromX, fromY, fromY + this._table.lineSizeFromTo(j,targetMrg.h+j), false );
                context.dottedLineTo ( fromX + this._table.columnSizeFromTo(i,targetMrg.w+i), fromY, fromY + this._table.lineSizeFromTo(j,targetMrg.h+j), false );
            }
            return true;
        }
        return false;
    },
    drawDottedNormalCell:function(context,i,j,fromX,fromY){
        context.dottedLineTo ( fromX, fromY, fromX + this._table.columnSize(i), true );
        context.dottedLineTo ( fromX, fromY + this._table.lineSize(j), fromX + this._table.columnSize(i), true );
        context.dottedLineTo ( fromX, fromY, fromY + this._table.lineSize(j), false );
        context.dottedLineTo ( fromX + this._table.columnSize(i), fromY, fromY + this._table.lineSize(j), false );
    },

    drawLeftTopSelectDBG:function(){
        if (TableEditorModeDefault == this._table.editorMode()){
            var context = Render.get();
            if (context){
                var bound = this.__selected.bound();
                if (bound.x==0&&bound.y==0)
                    return;

                var tablePos = this._table.getPosition();

                context.beginPath();
                context.rect(
                    tablePos.x + this._table.columnSizeFromTo(0,bound.x-1),
                    tablePos.y,
                    this._table.columnSizeFromTo(bound.x, bound.x + bound.w),
                    this._table.lineSizeFromTo(0,0));

                context.rect(
                    tablePos.x,
                    tablePos.y + this._table.lineSizeFromTo(0,bound.y-1),
                    this._table.columnSizeFromTo(0,0),
                    this._table.lineSizeFromTo(bound.y, bound.y + bound.h));
                context.fillStyle   =   '#0000ff';
                context.closePath();
                context.fill();
            }
        }
    },

    drawDottedStructure : function () {
        var context = Render.get();
        if (context){
            var __table     =   this._table;

            var tableX      =   __table.getBounding().x;
            var tableY      =   __table.getBounding().y;
            var tableWidth  =   __table.width();
            var tableHeight =   __table.height();

            context.lineWidth   =   1;
            context.strokeStyle =   "blue";
            context.beginPath();

            var offX = 0;
            var offY = 0;

            var merger = this._table.merger();

            for (var i = 0; i <= __table.columnesCount();++i){
                for (var j = 0; j <= __table.linesCount();++j){
                    var fromX   =   tableX + offX;
                    var fromY   =   tableY + offY;

                    if (!this.drawDottedMultiCell(context,null,merger,i,j,fromX,fromY))
                        this.drawDottedNormalCell(context,i,j,fromX,fromY);

                    offY    +=  __table.lineSize(j);
                }

                offY    =   0;
                offX    +=  __table.columnSize(i);
            }
        }

        context.closePath();
        context.lineWidth = 1;
        context.stroke();
    },
    drawDebug           : function () {
        /*
         var context = Render.get();
         if (context){
         var __table     =   this.__table;

         var tableX      =   __table.getBounding().x;
         var tableY      =   __table.getBounding().y;
         var tableWidth  =   __table.getWidth();
         var tableHeight =   __table.getHeight();

         var dbgText = "Bounding - { " + tableWidth + ", " + tableHeight + ", " + tableX + ", " + tableY +" }" +
         "   mouse - { " +  this._mouseX + ": "+  this._mouseY + " }";

         context.font = "Arial";
         context.fillText(dbgText, tableX, tableY - 12 );
         }
         */
    }
};

// helpers

var DragTrack = function(table){this.init (table);};
DragTrack.prototype = {
    init : function(table){
        this.__mouseX = 0;
        this.__mouseY = 0;

        this._mouseDown = 0;
        this._mouse =   {x:0,y:0};

        this._table = table;
        this.__cursorType = "default";

        this.__isCapture    =   false;
        this.__isTarget     =   false;
        this.__isZone       =   false;

        this.__divTrack = null;
        this.__divThumb = null;

        NotifityManager.bind(this,UserTableChangePosition);
        NotifityManager.bind(this,UserTableChangeSizes);
    },
    release : function(){
        this._mouseDown = false;
        this.releaseHelper_MoveTrack ();
        this.releaseHelper_MoveThumb();
    },
    getID : function (){
        return this._table.getID();
    },

    isZone : function(x,y){
        var pos         =   this._table.getPosition();
        this.__isZone   =   pos.x - x < 20 && pos.x - x > -5 && pos.y - y < 20 && pos.y - y > -5;

        return this.__isZone;
    },

    cursorStyle : function (){
        if (this._mouseDown||this.__isZone)
            return 'moves';

        return '';
    },

    completeDrag : function(e) {
        var  offSetX  =  e.clientX - SizeUtils.renderLeftTop().x;
        var  offSetY  =  e.clientY - SizeUtils.renderLeftTop().y;

        this._table.setPosition(offSetX, offSetY);

        this.releaseHelper_MoveTrack ();
        this.updateHelper_MoveThumb ();

        this._mouseDown =   false;
        this.__isCapture =   false;
        this.__isTarget  =   false;

        NotifityManager.send(UserTableChangePosition, this.getID());
        Notifity.killFocus ();
    },

    _showHelper : function (x,y){
        if (this.isZone(x,y) || this._table.isExist(x,y) || this._mouseDown){
            if ( null==this.__divThumb)
                this.addHelper_MoveThumb ();

            if (this.__divThumb)
                this.__divThumb.style.display = "block";
            return;
        }

        if (this.__divThumb)
            this.__divThumb.style.display = "none";
    },

    _paint:function(){},
    _notifity:function(id){
        if (UserTableChangePosition==id||UserTableChangeSizes==id){
            this.updateHelper_MoveThumb ();
        }

        this._mouseDown = false;
    },

    onmousemove : function(e){
        this.__mouseX = e.clientX;
        this.__mouseY = e.clientY;

        if ( this.__divTrack ){
            this.__divTrack.style.left = e.clientX + window.pageXOffset + 5 + "px";
            this.__divTrack.style.top  = e.clientY + window.pageYOffset + 5 + "px";
        }

        this._table.cursor().update(this.cursorStyle());
    },
    onmousedown : function(e){
        this.__mouseX = e.clientX;
        this.__mouseY = e.clientY;

        if (0 == e.button) {
            if (this.__isCapture)
                this.__isTarget = true;

            this._mouseDown = true;

            this.addHelper_MoveTrack ();
        }
    },
    onmouseup : function(e,x,y){
        if (this.__lineSpliter){
            this.__lineSpliter.onmouseup(e);
            return;
        }

        this.completeDrag(e);
    },

    addHelper_MoveTrack : function (){
        var tableX      =   this.__mouseX + window.pageXOffset + 5;
        var tableY      =   this.__mouseY + window.pageYOffset + 5;
        var tableWidth  =   this._table.width();
        var tableHeight =   this._table.height();

        this.__divTrack = document.createElement('div');
        this.__divTrack.delegate = this;

        with (this.__divTrack.style){
            width   =   tableWidth  + "px";
            height  =   tableHeight + "px";
            left    =   tableX + "px";
            top     =   tableY + "px";
        }

        this.__divTrack.className += ' ' + 'tableMoveBound';

        this.__divTrack.onmousemove =   function(e) {
            this.style.left = e.clientX + window.pageXOffset + 5 + "px";
            this.style.top  = e.clientY + window.pageYOffset + 5 + "px";
        };
        this.__divTrack.onmouseup   =   function(e) {
            this.delegate.completeDrag(e);
        };

        document.body.appendChild(this.__divTrack);
    },
    releaseHelper_MoveTrack : function (){
        if (this.__divTrack)
            document.body.removeChild(this.__divTrack);
        this.__divTrack = null;
        this._mouseDown = false;

        Notifity.killFocus ();
    },

    addHelper_MoveThumb : function (){
        this.__divThumb = document.createElement('div');
        this.__divThumb.delegate = this;

        this.__divThumb.style.width = 15 + "px";
        this.__divThumb.style.height = 15 + "px";

        this.__divThumb.className += ' ' + 'tableMoveThumb';

        this.updateHelper_MoveThumb ();

        this.__divThumb.onmousedown =   function(e) { Render.getCanvas().onmousedown(e); return false; };
        this.__divThumb.onmousemove =   function(e) { Render.getCanvas().onmousemove(e); };
        this.__divThumb.onmouseup   =   function(e) { Render.getCanvas().onmouseup(e);   };

        document.body.appendChild(this.__divThumb);
    },
    updateHelper_MoveThumb : function(){
        if (this.__divThumb){
            this.__divThumb.style.left  =   (SizeUtils.tablePositionAbs(this._table).x - 15) + "px";
            this.__divThumb.style.top   =   (SizeUtils.tablePositionAbs(this._table).y - 15) + "px";
        }
    },
    releaseHelper_MoveThumb : function (){
        if (this.__divThumb)
            document.body.removeChild(this.__divThumb);
        this.__divThumb = null;
    }
};

var LineSizer = function (obj){this.init (obj);};
LineSizer.prototype = {
    init : function (obj){
        this._table    =   obj.model();
        this._invoker   =   obj.controller ();
        this._scroll    =   obj.scrolls();

        this._mouse = {x:0,y:0};
        this._mouseDown = 0;

        this.__isTrarget = false;
        this._cursorType = "default";
        this._line = -1;
        this._column = 0;

        this.__isZone       =   false;
        this.__lineSpliter  =   null;

    },
    release : function(){
        this._line = -1;
        this._column = -1;
        this._mouseDown = false;

        this.deleteLineSpliter();
    },
    getID : function (){
        return this._table.getID();
    },

    isZone : function(x,y){
        var pos         =   this._table.getPosition();
        this.__isZone   =   pos.x - x < 20 && pos.x - x > 2 && pos.y - y < 20 && pos.y - y > 2;

        return this.__isZone;
    },
    isCaptureLine:function(x,y){
        this._mouse.x   =   x;
        this._mouse.y   =   y;

        if (TableEditorModeDefault == this._table.editorMode()){
            var targetCell = this.findTargetCell ();

            if (this.findTargetColumn() > 1 && (targetCell.line==0))
                return true;
            if (this.findTargetLine() > 1 && (targetCell.column==0))
                return true;

            return false;
        }

        return (-1!= this.findTargetLine ())||(-1!=this.findTargetColumn());
    },

    findTargetLine:function(){
        this._line = -1;

        if (undefined != this._table && this._table){
            this._line = this._table.getCaptureLine(this._mouse.y+this._scroll.position().y);
            if (0 == this._line)
                this._line = -1;
        }
        return this._line;
    },
    findTargetColumn:function(){
        this._column = -1;

        if (undefined != this._table && this._table)
            this._column = this._table.getCaptureRow(this._mouse.x+this._scroll.position().x);

        return this._column;
    },
    findTargetCell:function(){
        return { column:this._table.getSelectRowCell (this._mouse.x+this._scroll.position().x*0),
            line:this._table.getSelectLineCell (this._mouse.y+this._scroll.position().y*0) };
    },

    cursorStyle : function (){
        if (TableEditorModeDefault == this._table.editorMode()){
            if (this._line>1)
                return 'lineresizes';
            else
            if (this._column>1)
                return 'columnresizes';
        }
        if (TableEditorModeDOC == this._table.editorMode()){
            if (-1 != this._line)
                return 'lineresizes';
            else
            if (-1 != this._column)
                return 'columnresizes';
        }

        return '';
    },

    getSplitterDX : function (mx){
        if ( 0 == this._column ){
            var rightX  =   this._table.columnSizeFromTo(0,Math.max (this._column - 1, 0)) - TABLE_MIN_SIZE_CELL + this._table._x;
            return  Math.min(rightX, mx);
        }

        var widthLeft   =   this._table.columnSizeFromTo(0,Math.max (this._column - 2, -1)) + TABLE_MIN_SIZE_CELL + this._table._x;

        if (TableEditorModeDefault == this._table.editorMode())
            return Math.max(widthLeft, mx);

        var splitter    =   Math.max(widthLeft, mx);

        if ( this._column < this._table.columnesCount() ){
            var width  =   this._table.columnSizeFromTo(0,Math.max (this._column , -1)) - TABLE_MIN_SIZE_CELL + this._table._x;
            splitter   =   Math.min(width, splitter);
        }

        return splitter;
    },
    getSplitterDY : function (my){
        var height      =   this._table.lineSizeFromTo(0,Math.max (this._line - 2, -1)) + TABLE_MIN_SIZE_CELL + this._table._y;
        return Math.max(height, my);
    },

    updateColumn : function(val){
        var ret     =   false;

        if (TableEditorModeDefault == this._table.editorMode()){
            if(this._column>0){
                var prev    =   this._table.columnSizeFromTo(0,this._column - 2);
                var cur     =   this._table.columnSizeFromTo(0,this._column - 1);

                var split   =   val - this._table._x - prev;
                ret         =   this._table.updateColumnSizeIf(this._column - 1, split);

                this._invoker._updateForDefaultMode();
            }
            return ret;
        }

        if (0 == this._column) {
            var width = this._table.columnSizeFromTo(0,0);
            var size = this._table._x - val;

            if (width + size >= TABLE_MIN_SIZE_CELL) {
                this._table._x = val;
                ret         =   this._table.updateColumnSizeIf(0, width + size);

                this._invoker._updateForDefaultMode();
            } else {
                this._table._x = this._table._x + width - TABLE_MIN_SIZE_CELL;
                ret         =   this._table.updateColumnSizeIf(0, TABLE_MIN_SIZE_CELL);

                this._invoker._updateForDefaultMode();
            }
        } else {
            var prev    =   this._table.columnSizeFromTo(0,this._column - 2);

            /// to refactoring
            if (this._table.columnesCount() == this._column) {
                var cur     =   this._table.columnSizeFromTo(0,this._column - 1);

                var split   =   val - this._table._x - prev;
                ret         =   this._table.updateColumnSizeIf(this._column - 1, split);

                this._invoker._updateForDefaultMode();
            }
            else if (this._column > 0) {
                var cur     =   this._table.columnSizeFromTo(0,this._column);

                var split   =   Math.max ( val - this._table._x - prev, TABLE_MIN_SIZE_CELL );
                split       =   Math.min ( split, cur - prev - TABLE_MIN_SIZE_CELL );

                ret = this._table.updateColumnSizeIf(this._column, ( cur - prev ) - split);
                ret |= this._table.updateColumnSizeIf(this._column - 1, split);

                this._invoker._updateForDefaultMode();
            }
        }

        return ret;
    },
    updateLine : function(val){
        if(this._line>0){
            var prev    =   this._table.lineSizeFromTo(0,this._line - 2);
            var cur     =   this._table.lineSizeFromTo(0,this._line - 1);

            var split   =   val - this._table._y - prev;
            var ret = this._table.updateLineSizeIf(this._line - 1, split);

            this._invoker._updateForDefaultMode();

            return ret;
        }

        return false;
    },
    updateCursor : function (){
        if (TableEditorModeDefault == this._table.editorMode()){
            var    line    =   this._table.getSelectLineCell (this._mouse.y);
            if (this._column>0&&(line!=0))
                return;

            var    column  =   this._table.getSelectRowCell (this._mouse.x);
            if(this._line>0 && column!=0)
                return;
        }
        if (TableEditorModeDOC == this._table.editorMode()){
            if (this._mouseDown){
                if (-1 != this._line)
                    this._table.cursor().update('lineresizes');
                else if (-1 != this._column)
                    this._table.cursor().update('columnresizes');

                return;
            }

            if (this._table.isExist(this._mouse.x,this._mouse.y))
                this._table.cursor().update(this.cursorStyle());
            else
                this._table.cursor().reset();
        }
    },

    _paint:function(){},
    _notifity:function(id){},

    onmousemove : function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);
        if (this._table.isExist(this._mouse.x,this._mouse.y)){
            if (!this._mouseDown){
                this.findTargetLine();
                this.findTargetColumn();
            }

            if (TableEditorModeDefault == this._table.editorMode()){
                // var targetCell = this.findTargetCell ();
                if (this._column > 1 && this._mouseDown /*&& (targetCell.line==0)*/){
                    this.updateColumn (this._mouse.x+this._scroll.position().x);
                    NotifityManager.send(UserTableChangeSizes, this.getID());
                    NotifityManager.send(NeeedDisplayUpdate, null);
                }
                else
                if (this._line > 1 && this._mouseDown /*&& (targetCell.column==0)*/){
                    this.updateLine (this._mouse.y+this._scroll.position().y);
                    NotifityManager.send(UserTableChangeSizes, this.getID());
                    NotifityManager.send(NeeedDisplayUpdate, null);
                }
                if (this._line>1 || this._column>1)
                    this.updateCursor();
                else
                    this._table.cursor().reset();
            }
        }

        if (TableEditorModeDOC == this._table.editorMode()){
            if (this.__lineSpliter && this._mouseDown)
                this.__lineSpliter.onmousemove(e);

            if (-1!= this._line || -1 != this._column)
                this.updateCursor();
            else
                this._table.cursor().reset();
         }
    },
    onmousedown : function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);
        if (0==e.button){
            if (TableEditorModeDOC == this._table.editorMode()){
                if (-1 != this.findTargetColumn())
                    this.addLineSpliter (e,"row");
                else
                if (-1 != this.findTargetLine())
                    this.addLineSpliter (e,"line");
            }

            if (TableEditorModeDefault == this._table.editorMode()){
                var targetCell = this.findTargetCell ();

                this._mouseDown = false;

                if (this.findTargetColumn() > 1 && (targetCell.line==0))
                    this._mouseDown = true;
                if (this.findTargetLine() > 1 && (targetCell.column==0))
                    this._mouseDown = true;

                return;
            }

            this._mouseDown = true;
        }
    },
    onmouseup : function(e){
        if (this.__lineSpliter){
            var retStatus = false;
            if (this.__lineSpliter.typeDrag=='row')
                retStatus    =   this.updateColumn (SizeUtils.mouseCoordToCanvas(e).x);

            if (this.__lineSpliter.typeDrag=='line')
                retStatus    =   this.updateLine(SizeUtils.mouseCoordToCanvas(e).y);

            if (retStatus){
                NotifityManager.send(UserTableChangeSizes, this.getID());
                NotifityManager.send(NeeedDisplayUpdate, null);
            }

            Notifity.killFocus ();
            this.release();

            this.onmousemove(e);
        }
    },

    addLineSpliter : function (e,typeDrag){
        if ( null == this.__lineSpliter ){
            this.__lineSpliter           =   document.createElement('div');
            this.__lineSpliter.delegate  =   this;
            this.__lineSpliter.typeDrag  =   typeDrag;

            if (typeDrag=='row'){
                with (this.__lineSpliter.style) {
                    height          =   Render.getCanvas().offsetHeight + "px";
                    left            =   e.clientX + window.pageXOffset +"px";
                    top             =   Render.getCanvas().offsetTop + "px";
                }

                this.__lineSpliter.className += ' ' + 'tableColumnSplitter';
            }

            if (typeDrag=='line'){
                with (this.__lineSpliter.style) {
                    width           =   Render.getCanvas().offsetWidth  + "px";
                    left            =   Render.getCanvas().offsetLeft + "px";
                    top             =   e.clientY + window.pageYOffset + "px";
                }
                this.__lineSpliter.className += ' ' + 'tableLineSplitter';
            }
        }

        this.__lineSpliter.onmousemove  =   function(e) {
            if (this.typeDrag=='row'){
                var SplitX      =   this.delegate.getSplitterDX (SizeUtils.mouseCoordToCanvas(e).x);
                this.style.left =   SplitX + Render.getCanvas().offsetLeft + "px";
            }
            if (this.typeDrag=='line'){
                var SplitY      =   this.delegate.getSplitterDY (SizeUtils.mouseCoordToCanvas(e).y);
                this.style.top  =   SplitY + Render.getCanvas().offsetTop + "px";
            }
        };
        this.__lineSpliter.onmouseup    =   function(e) { Render.getCanvas().onmouseup(e);     };

        document.body.appendChild(this.__lineSpliter);
    },
    deleteLineSpliter : function (){
        if (this.__lineSpliter)
            document.body.removeChild(this.__lineSpliter);
        this.__lineSpliter = null;
    }
};

var BoundsResizer = function(obj){this.init(obj);};
BoundsResizer.prototype = {

    init:function(obj){
        this._mouse = {x:0,y:0};
        this._mouseDown = 0;

        this._controller = obj.controller();
        this._table = obj.model();

        this.__isTarget =   false;
        this.__isZone   =   false;

        this.__divTrack =   null;
    },
    release:function(){
        this.releaseHelper_ResizeTrack();
    },
    getID:function (){
        return this._table.getID();
    },

    isZone:function(x,y){
        var boundBL     =   this._table.getSizeXY();
        this.__isZone   =   x - boundBL.x < 20 && x - boundBL.x > 0 && y - boundBL.y < 20 &&  y - boundBL.y > 0;

        return this.__isZone;
    },

    cursorStyle:function (){
        if (this._mouseDown)
            return 'crosshairs';

        if (this.__isZone)
            return 'seresizes';

        return '';
    },

    completeDrag:function(e) {
        var tableX  =   Math.max (this._table.width(), 1);
        var tableY  =   Math.max (this._table.height(), 1);

        var  width  =  Math.max(this._mouse.x - this._table.getPosition().x, 1);
        var  height =  Math.max(this._mouse.y- this._table.getPosition().y, 1);

        if (tableX>0&&tableY>0)
            this._controller.resizeProportional(width/tableX, height/tableY);

        this.releaseHelper_ResizeTrack ();

        this._mouseDown =   false;
        this.__isCapture =   false;
        this.__isTarget  =   false;

        NotifityManager.send(UserTableChangeSizes, this.getID());
        NotifityManager.send(NeeedDisplayUpdate, null);
        Notifity.killFocus ();

        this._table.cursor().reset();
    },

    _paint:function(){},
    _notifity:function(id){},

    onmousemove:function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        if (this.__divTrack && this._mouseDown)
            this.updateHelper_ResizeTrack(e);

        if (this.isZone(this._mouse.x,this._mouse.y)||this._mouseDown)
            this._table.cursor().update(this.cursorStyle());
        else
            this._table.cursor().reset();
    },
    onmousedown:function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        if (0 == e.button){
            if (this.__isCapture)
                this.__isTarget = true;

            this._mouseDown = true;

            this.addHelper_ResizeTrack (e);

            this._table.cursor().update(this.cursorStyle());
        }
    },
    onmouseup:function(e){
        this.completeDrag(e);
    },

    addHelper_ResizeTrack : function (e){
        this.__divTrack = document.createElement('div');
        this.__divTrack.delegate = this;

        this.__divTrack.style.left = SizeUtils.tablePositionAbs(this._table).x + "px";
        this.__divTrack.style.top = SizeUtils.tablePositionAbs(this._table).y + "px";

        this.__divTrack.className += ' ' + 'tableMoveBound';

        this.__divTrack.onmousedown =   function(e) { Render.getCanvas().onmousedown(e);   };
        this.__divTrack.onmousemove =   function(e) { Render.getCanvas().onmousemove(e);   };
        this.__divTrack.onmouseup   =   function(e) { Render.getCanvas().onmouseup(e);     };

        this.updateHelper_ResizeTrack (e);

        document.body.appendChild(this.__divTrack);
    },
    updateHelper_ResizeTrack : function(e){
        with (this.__divTrack.style){
            width   =   e.clientX + window.pageXOffset - SizeUtils.tablePositionAbs(this._table).x + "px";
            height  =   e.clientY + window.pageYOffset - SizeUtils.tablePositionAbs(this._table).y + "px";
        }
    },
    releaseHelper_ResizeTrack : function (){
        if (this.__divTrack)
            document.body.removeChild(this.__divTrack);
        this.__divTrack = null;
    }
};

var ActiveSelect = function(obj){this.init(obj);};
ActiveSelect.prototype = {

    init:function(obj){
        this._table     =   obj.model();
        this._scroll    =   obj.scrolls();
        this._helper    =   null;
        this._mainHelper=   null;
        this._leftHelper=   null;
        this._topHelper =   null;
        this._mouseDown =   false;

        this._cell      =   {x:0,y:0};
        this._cellEnd   =   {x:0,y:0};
        this._cellMain  =   {x:0,y:0};
        this._bound     =   {x:0,y:0,w:0,h:0};

        NotifityManager.bind(this,UserTableChangePosition);
        NotifityManager.bind(this,UserTableChangeSizes);
        NotifityManager.bind(this,SystemMergeSelectedItems);
        NotifityManager.bind(this,SystemUnmergeSelectedItems);
        NotifityManager.bind(this,UserTableScrollItems);
    },
    release:function(){
        this.releaseHelper();
        this._mouseDown =   false;
    },

    getID:function (){
        return this._table.getID();
    },
    bound:function(){
        return this._bound;
    },
    innerBounder:function(obj){
        var minx = obj.x;
        var maxx = obj.x2
        var miny = obj.y;
        var maxy = obj.y2

        var i;
        var target = undefined;

        for (i=obj.x;i<=obj.x2;++i){
            var multiCellUp  =   this._table.merger().getOfIndex({x:i,y:obj.y});
            if (undefined!=multiCellUp){
                minx    =   Math.min(multiCellUp.target.x,minx);
                miny    =   Math.min(multiCellUp.target.y,miny);
                maxx    =   Math.max(multiCellUp.target.x + multiCellUp.w,maxx);
                maxy    =   Math.max(multiCellUp.target.y + multiCellUp.h,maxy);
            }

            var multiCellDown  =   this._table.merger().getOfIndex({x:i,y:obj.y2});
            if (undefined!=multiCellDown){
                minx    =   Math.min(multiCellDown.target.x,minx);
                miny    =   Math.min(multiCellDown.target.y,miny);
                maxx    =   Math.max(multiCellDown.target.x + multiCellDown.w,maxx);
                maxy    =   Math.max(multiCellDown.target.y + multiCellDown.h,maxy);
            }
        }
        for (i=obj.y+1;i<obj.y2;++i){
            var multiCellLeft  =   this._table.merger().getOfIndex({x:obj.x,y:i});
            if (undefined!=multiCellLeft){
                minx    =   Math.min(multiCellLeft.target.x,minx);
                miny    =   Math.min(multiCellLeft.target.y,miny);
                maxx    =   Math.max(multiCellLeft.target.x + multiCellLeft.w,maxx);
                maxy    =   Math.max(multiCellLeft.target.y + multiCellLeft.h,maxy);
            }

            var multiCellRight  =   this._table.merger().getOfIndex({x:obj.x2,y:i});
            if (undefined!=multiCellRight){
                minx    =   Math.min(multiCellRight.target.x,minx);
                miny    =   Math.min(multiCellRight.target.y,miny);
                maxx    =   Math.max(multiCellRight.target.x + multiCellRight.w,maxx);
                maxy    =   Math.max(multiCellRight.target.y + multiCellRight.h,maxy);
            }
        }

        return {x:minx, y:miny, w:maxx-minx, h:maxy-miny};
    },

    _paint:function(){},
    _notifity:function(id){
        if (UserTableChangePosition==id||UserTableChangeSizes==id){
            this.updateHelper (this._cellEnd.x,this._cellEnd.y);
        }
        else if (SystemMergeSelectedItems==id){
            this.updateHelper (this._cellMain.x,this._cellMain.y);
        }
        else if (UserTableScrollItems==id){
            this.updateHelper (-2,-2);
        }
        else if (SystemUnmergeSelectedItems==id){
            if (this._helper)
                document.body.removeChild(this._helper);
            this._helper    =   null;
            this._bound.w   =   0;
            this._bound.h   =   0;

            this.updateHelper (this._cellMain.x,this._cellMain.y);
        }

        this._mouseDown = false;
    },

    onmousemove:function(e){
        if (this._helper && this._mouseDown){
            var cellX   =   this._table.getSelectRowCell  (e.clientX + this._scroll.position().x - SizeUtils.renderLeftTop().x);
            var cellY   =   this._table.getSelectLineCell (e.clientY + this._scroll.position().y - SizeUtils.renderLeftTop().y);

            if (TableEditorModeDefault == this._table.editorMode()){
                if(cellX<0||cellY<0)    return;
                if(cellX==0&&cellY==0)  return;
                if(0==cellX&&this._cellMain.x!=1){
                    this.updateHelper (1,cellY);
                    return;
                }
                if(0==cellX){
                    this.updateHelper (this._table.columnesCount(),cellY);
                    return;
                }
                if(0==cellY&&this._cellMain.y!=1){
                    this.updateHelper (cellX,1);
                    return;
                }
                if(0==cellY){
                    this.updateHelper (cellX, this._table.linesCount());
                    return;
                }
            }

            this.updateHelper (cellX,cellY);
        }

        /*

         if (-1 != this._line || -1 != this._row)
         Notifity.bind(function() {  return  (function() {
         Notifity.self.updateCursor();
         }).call(Notifity.self); }, this );
         */
    },
    onmousedown:function(e){
        this.releaseHelper(e);
        if (0 == e.button){
            this._cell.x = this._table.getSelectRowCell ( e.clientX + this._scroll.position().x - SizeUtils.renderLeftTop().x);
            this._cell.y = this._table.getSelectLineCell (e.clientY + this._scroll.position().y - SizeUtils.renderLeftTop().y);

            if (TableEditorModeDefault == this._table.editorMode()){
                if (this._cell.x<=0 && this._cell.y<=0)
                    return;

                if(0==this._cell.x){
                    this._cell.x        =   1;

                    this._cellEnd.x     =   this._cell.x;
                    this._cellEnd.y     =   this._cell.y;
                    this._cellMain.x    =   this._cell.x;
                    this._cellMain.y    =   this._cell.y;

                    this._mouseDown     =   true;
                    this.appendHelper(e);

                    this.updateHelper (this._table.columnesCount(),this._cell.y);
                    return;
                }
                if(0==this._cell.y){
                    this._cell.y        =   1;

                    this._cellEnd.x     =   this._cell.x;
                    this._cellEnd.y     =   this._cell.y;
                    this._cellMain.x    =   this._cell.x;
                    this._cellMain.y    =   this._cell.y;

                    this._mouseDown     =   true;

                    this.appendHelper(e);

                    this.updateHelper (this._cell.x, this._table.linesCount());
                    return;
                }
            }

            this._cellEnd.x     =   this._cell.x;
            this._cellEnd.y     =   this._cell.y;

            this._mouseDown     =   true;

            this._cellMain.x    =   Math.max (this._table.getSelectRowCell  (e.clientX + this._scroll.position().x - SizeUtils.renderLeftTop().x),0);
            this._cellMain.y    =   Math.max (this._table.getSelectLineCell (e.clientY + this._scroll.position().y - SizeUtils.renderLeftTop().y),0);

            this.appendHelper(e);
            this.updateHelper (this._cellMain.x,this._cellMain.y);
        }
    },
    onmouseup:function(e){
        this._mouseDown =   false;
        // this.releaseHelper(e);
        Render.getCanvas().style.cursor = "default";
        Notifity.killFocus ();
    },
    onkeydown:function(e){
        var clsSelected = undefined;
        if (e.shiftKey)
            clsSelected   = true;

        if (39==e.keyCode){  // LEFT
            this.recountMainCell({x:1,y:0,clear:e.shiftKey ? undefined : true});
            this.updateHelper (this._cellMain.x,this._cellMain.y);
            this.updateScrolls({x:1,y:0});
        }
        if (37==e.keyCode){ // RIGHT
            this.recountMainCell({x:-1,y:0,clear:e.shiftKey ? undefined : true});
            this.updateHelper (this._cellMain.x,this._cellMain.y);
            this.updateScrolls({x:-1,y:0});
        }
        if (40==e.keyCode){ // DOWN
            this.recountMainCell({x:0,y:1,clear:e.shiftKey ? undefined : true});
            this.updateHelper (this._cellMain.x,this._cellMain.y);
            this.updateScrolls({x:0,y:1});
        }
        if (38==e.keyCode){ // UP
            this.recountMainCell({x:0,y:-1,clear:e.shiftKey ? undefined : true});
            this.updateHelper (this._cellMain.x,this._cellMain.y);
            this.updateScrolls({x:0,y:-1});
        }
    },

    appendHelper:function(e){
        this._helper                    =   document.createElement('div');
        this._helper.delegate           =   this;

        this._helper.onmousedown        =   function(e) { Render.getCanvas().onmousedown(e);   };
        this._helper.onmousemove        =   function(e) { Render.getCanvas().onmousemove(e);   };
        this._helper.onmouseup          =   function(e) { Render.getCanvas().onmouseup(e);     };

        document.body.appendChild(this._helper);

        if (TableEditorModeDefault == this._table.editorMode()){
            this._mainHelper                =   document.createElement('div');
            this._mainHelper.delegate           =   this;

            this._mainHelper.onmousedown    =   function(e) { Render.getCanvas().onmousedown(e);   };
            this._mainHelper.onmousemove    =   function(e) { Render.getCanvas().onmousemove(e);   };
            this._mainHelper.onmouseup      =   function(e) { Render.getCanvas().onmouseup(e);     };
            this._mainHelper.onkeydown      =   function(e) { Render.getCanvas().onkeydown(e);     };

            this._leftHelper                =   document.createElement('div');
            this._leftHelper.delegate       =   this;

            this._leftHelper.onmousedown    =   function(e) { Render.getCanvas().onmousedown(e);  return false; };
            this._leftHelper.onmousemove    =   function(e) { Render.getCanvas().onmousemove(e);   };
            this._leftHelper.onmouseup      =   function(e) { Render.getCanvas().onmouseup(e);     };
            this._leftHelper.onkeydown      =   function(e) { Render.getCanvas().onkeydown(e);     };

            this._topHelper                 =   document.createElement('div');
            this._topHelper.delegate        =   this;

            this._topHelper.onmousedown     =   function(e) { Render.getCanvas().onmousedown(e);  return false; };
            this._topHelper.onmousemove     =   function(e) { Render.getCanvas().onmousemove(e);   };
            this._topHelper.onmouseup       =   function(e) { Render.getCanvas().onmouseup(e);     };
            this._topHelper.onkeydown       =   function(e) { Render.getCanvas().onkeydown(e);     };

            document.body.appendChild(this._mainHelper);
            document.body.appendChild(this._topHelper);
            document.body.appendChild(this._leftHelper);
        }

        this.updateHelper(this._cellMain.x,this._cellMain.y);
    },
    releaseHelper:function(e){
        if (this._helper)
            document.body.removeChild(this._helper);
        if (this._mainHelper)
            document.body.removeChild(this._mainHelper);

        if (this._topHelper)
            document.body.removeChild(this._topHelper);
        if (this._leftHelper)
            document.body.removeChild(this._leftHelper);

        this._topHelper = null;
        this._leftHelper = null;

        this._mainHelper = null;
        this._helper = null;
    },
    updateHelper:function(cellX,cellY){
        this.updateSelectedCells(cellX,cellY);
        this.updateTargetCell();
    },

    updateSelectedCells: function(cellX,cellY){
        if(this._helper){
            var minWidth = 1;
            var minHeight = 1;
            var targetMrg = this._table.merger().getOfIndex({x:cellX,y:cellY});

            if(undefined!=targetMrg){
                // if(undefined==targetMrg.target.isMain){
                //     cellX = targetMrg.target.x;
                //     cellY = targetMrg.target.y;
                //     minWidth = targetMrg.w + 2;
                //     minHeight = targetMrg.h + 2;
                // }
            }

            var offX  =   SizeUtils.tablePositionAbs(this._table).x;
            var offY  =   SizeUtils.tablePositionAbs(this._table).y;

            var offOneX =  offX + this._table.columnSizeFromTo(0,0);
            var offOneY =   offY + this._table.lineSizeFromTo(0,0);

            if (-2!=cellX&&-2!=cellY){
                var cellRight;
                var cellBottom;

                if (TableEditorModeDefault == this._table.editorMode()){
                    if (cellX==0){
                        this._cellMain.x =   1;
                        this._cell.x     =   this._table.columnesCount();
                        cellX            =   1;
                    }

                    if (cellY==0){
                        this._cellMain.y =   1;
                        this._cell.y     =   this._table.linesCount();
                        cellY            =   1;
                    }
                }

                if (-1==cellX){
                    if (this._mouseX - offX > 0)
                        cellX   =   this._cellEnd.x;
                    else
                        cellX   =   0;
                }

                if (-1==cellY){
                    if (this._mouseY - offY > 0)
                        cellY   =   this._cellEnd.y;
                    else
                        cellY   =   0;
                }

                cellRight       =   Math.max (cellX,this._cell.x);
                cellX           =   Math.min (cellX,this._cell.x);
                cellBottom      =   Math.max (cellY,this._cell.y);
                cellY           =   Math.min (cellY,this._cell.y);

                this._cellEnd.x =   cellRight;
                this._cellEnd.y =   cellBottom;

                cellX           =   Math.max (cellX,0);
                cellY           =   Math.max (cellY,0);
                cellRight       =   Math.max (cellRight,0);
                cellBottom      =   Math.max (cellBottom,0);

                if (TableEditorModeDefault == this._table.editorMode()){
                    cellX           =   Math.max (cellX,1);
                    cellY           =   Math.max (cellY,1);
                    cellRight       =   Math.max (cellRight,minWidth);
                    cellBottom      =   Math.max (cellBottom,minHeight);
                }

                var innerObjBounder =   this.innerBounder({x:cellX,x2:cellRight,y:cellY,y2:cellBottom});

                this._bound.x   =   cellX = innerObjBounder.x;
                this._bound.y   =   cellY = innerObjBounder.y;
                this._bound.w   =   innerObjBounder.w;
                this._bound.h   =   innerObjBounder.h;
            }

            // console.log(this._bound);

            var offSetX     =  Math.floor(offX + this._table.columnSizeFromTo(0,this._bound.x-1));
            var offSetY     =  Math.floor(offY + this._table.lineSizeFromTo(0,this._bound.y-1));

            var mainWidth   =   this._table.columnSizeFromTo (this._bound.x, this._bound.x + this._bound.w) - 1;
            var mainHeight  =   this._table.lineSizeFromTo (this._bound.y, this._bound.y + this._bound.h) - 1;

            var leftx       =  -this._scroll.position().x + offSetX;
            var topx        =  -this._scroll.position().y + offSetY;

            if (TableEditorModeDefault == this._table.editorMode()){
                if (leftx<offOneX){
                    mainWidth   +=  -this._scroll.position().x + this._table.columnSizeFromTo(1,this._bound.x-1);
                    leftx       =   offOneX;
                }
                if (leftx+mainWidth>Render.getCanvas().offsetWidth + offX)
                    mainWidth   =   Render.getCanvas().offsetWidth + offX - leftx-3;

                if (topx<offOneY){
                    mainHeight  +=  -this._scroll.position().y + this._table.lineSizeFromTo(1,this._bound.y-1);
                    topx        =   offOneY;
                }
                if (topx+mainHeight>Render.getCanvas().offsetHeight+offY)
                    mainHeight   =  Render.getCanvas().offsetHeight+offY - topx-3;
            }

            with(this._helper.style){
                (mainWidth>0&&mainHeight>0)? display='block' : display='none';
                if (display=='block'){
                    border          =   "2px solid blue";
                    background      =   '#EAEEFE';
                    color           =   '#000000';
                    opacity         =   0.5;

                    borderTopColor  =   '#0000FF';
                    borderTopStyle  =   'solid';
                    borderTopWidth  =   '2px';

                    position        =   'absolute';
                    display         =   'block';
                    cursor          =   'hand';

                    left            =   leftx + "px";
                    top             =   topx  + "px";
                    width           =   mainWidth + "px";
                    height          =   mainHeight + "px";
                }
            }
        }
    },
    updateTargetCell:function(){
        if (TableEditorModeDefault == this._table.editorMode() && null!=this._mainHelper){
            var offX    =   SizeUtils.tablePositionAbs(this._table).x;
            var offY    =   SizeUtils.tablePositionAbs(this._table).y;

            var offOneX =   offX + this._table.columnSizeFromTo(0,0);
            var offOneY =   offY + this._table.lineSizeFromTo(0,0);

            this.updateLeftTopSelect(offX,offY);

            var mainWidth   =   '';
            var mainHeight  =   '';
            var targetMain  =   this._table.merger().getOfIndex({x:this._cellMain.x,y:this._cellMain.y});
            if(undefined!=targetMain){
                this._cellMain.x    =   targetMain.target.x;
                this._cellMain.y    =   targetMain.target.y;
                mainWidth   =   this._table.columnSizeFromTo (this._cellMain.x, this._cellMain.x + targetMain.w) - 1;
                mainHeight  =   this._table.lineSizeFromTo (this._cellMain.y, this._cellMain.y + targetMain.h) - 1;
            } else{
                mainWidth   =   this._table.columnSize (this._cellMain.x) - 1;
                mainHeight  =   this._table.lineSize (this._cellMain.y) - 1;
            }

            var leftx   =  -this._scroll.position().x + offX + this._table.columnSizeFromTo(0,this._cellMain.x-1);
            var topx    =  -this._scroll.position().y + offY + this._table.lineSizeFromTo(0,this._cellMain.y-1);

            if (leftx<offOneX ){
                mainWidth   +=  -this._scroll.position().x + this._table.columnSizeFromTo(1,this._cellMain.x-1);
                leftx       =   offOneX;
            }
            if (leftx+mainWidth>Render.getCanvas().offsetWidth + offX)
                mainWidth   =   Render.getCanvas().offsetWidth + offX - leftx-3;

            if (topx<offOneY){
                mainHeight  +=  -this._scroll.position().y + this._table.lineSizeFromTo(1,this._cellMain.y-1);
                topx        =   offOneY;
            }
            if (topx+mainHeight>Render.getCanvas().offsetHeight+offY)
                mainHeight   =  Render.getCanvas().offsetHeight+offY - topx-3;

            with(this._mainHelper.style){
                (mainWidth>0&&mainHeight>0)? display='block' : display='none';
                if (display=='block'){
                    border     =    "2px solid black";
                    color      =    '#000000';
                    position   =    'absolute';

                    left       =    leftx + "px";
                    top        =    topx  + "px";
                    width      =    mainWidth + "px";
                    height     =    mainHeight + "px";
                }
            }
        }
    },
    updateLeftTopSelect:function(offX,offY){
        var bound = this.bound();
        if (bound.x==0&&bound.y==0)
            return;

        var offX        =   SizeUtils.tablePositionAbs(this._table).x;
        var offY        =   SizeUtils.tablePositionAbs(this._table).y;

        var offOneX     =   offX + this._table.columnSizeFromTo(0,0);
        var offOneY     =   offY + this._table.lineSizeFromTo(0,0);

        var mainWidth   =   this._table.columnSizeFromTo(this.bound().x, this.bound().x + this.bound().w);
        var mainHeight  =   this._table.lineSizeFromTo(this.bound().y, this.bound().y + this.bound().h);

        var leftx =  -this._scroll.position().x + offX + this._table.columnSizeFromTo(0,this.bound().x-1);
        if (leftx<offOneX){
            mainWidth   +=  -this._scroll.position().x + this._table.columnSizeFromTo(1,this.bound().x-1);
            leftx       =   offOneX;
        }
        if (leftx+mainWidth>Render.getCanvas().offsetWidth + offX){
            mainWidth   =   Render.getCanvas().offsetWidth + offX - leftx-3;
        }

        var topx =  -this._scroll.position().y +  offY + this._table.lineSizeFromTo(0,this.bound().y-1);
        if (topx<offOneY){
            mainHeight  +=  -this._scroll.position().y + this._table.lineSizeFromTo(1,this.bound().y-1);
            topx        =   offOneY;
        }
        if (topx+mainHeight>Render.getCanvas().offsetHeight+offY){
            mainHeight   =  Render.getCanvas().offsetHeight+offY - topx-3;
        }

        with(this._topHelper.style) {
            (mainWidth>0)? display='block' : display='none';
            if (display=='block'){
                border          =   "1px solid black";
                background      =   '#0000ff';
                color           =   '#000000';
                opacity         =   0.3;

                position        =   'absolute';

                left            =  leftx + "px";
                top             =  offY + "px";

                width           =   mainWidth + "px";
                height          =   this._table.lineSizeFromTo(0,0) + "px";
            }
        }
        with(this._leftHelper.style){
            (mainHeight>0)? display='block' : display='none';
            if (display=='block'){
                border          =   "1px solid black";
                background      =   '#0000ff';
                color           =   '#000000';
                opacity         =   0.3;

                position        =   'absolute';

                left            =   offX + "px";
                top             =   topx + "px";

                width           =   this._table.columnSizeFromTo(0,0) + "px";
                height          =   mainHeight + "px";
            }
        }
    },

    recountMainCell:function(obj){
        var target  =   this._table.merger().getOfIndex({x:this._cellMain.x,y:this._cellMain.y});
        if(undefined!=target){
            if (obj.x>0)
                this._cellMain.x    =   target.target.x + target.w + 1;
            if (obj.x<0){
                target  =   this._table.merger().getOfIndex({x:this._cellMain.x-1,y:this._cellMain.y});
                (undefined==target)? this._cellMain.x += obj.x : this._cellMain.x = target.target.x;
            }
            if (obj.y>0)
                this._cellMain.y    =   target.target.y + target.h + 1;
            if (obj.y<0){
                target  =   this._table.merger().getOfIndex({x:this._cellMain.x,y:this._cellMain.y-1});
                (undefined==target)? this._cellMain.y += obj.y : this._cellMain.y    =   target.target.y;
            }
        }
        else    {
            this._cellMain.x    +=   obj.x;
            this._cellMain.y    +=   obj.y;
        }

        this._cellMain.x        =   Math.min(this._cellMain.x,this._table.columnesCount()-1);
        this._cellMain.y        =   Math.min(this._cellMain.y,this._table.linesCount()-1);

        if (TableEditorModeDefault == this._table.editorMode()) {
            this._cellMain.x    =   Math.max(this._cellMain.x,1);
            this._cellMain.y    =   Math.max(this._cellMain.y,1);
        }
        else    {
            this._cellMain.x    =   Math.max(this._cellMain.x,0);
            this._cellMain.y    =   Math.max(this._cellMain.y,0);
        }

        if (undefined!=obj.clear){
            this._cellEnd.x     =   this._cellMain.x;
            this._cellEnd.y     =   this._cellMain.y;
            this._cell.x        =   this._cellMain.x;
            this._cell.y        =   this._cellMain.y;
        }
    },
    updateScrolls:function(obj){
        // TODO:  updateScrolls- для merge ячеек
        if (TableEditorModeDefault == this._table.editorMode()){
            var mainWidth   = 0;
            var mainHeight  = 0;

            var oneX =   this._table.columnSizeFromTo(0,0);
            var oneY =   this._table.lineSizeFromTo(0,0);

            var target  =   this._table.merger().getOfIndex({x:this._cellMain.x,y:this._cellMain.y});
            if(undefined!=target){
                if (obj.x>0)
                    this._cellMain.x    =   target.target.x + target.w + 1;
                if (obj.x<0){
                    target  =   this._table.merger().getOfIndex({x:this._cellMain.x-1,y:this._cellMain.y});
                    (undefined==target)? this._cellMain.x += obj.x : this._cellMain.x = target.target.x;
                }
                if (obj.y>0)
                    this._cellMain.y    =   target.target.y + target.h + 1;
                if (obj.y<0){
                    target  =   this._table.merger().getOfIndex({x:this._cellMain.x,y:this._cellMain.y-1});
                    (undefined==target)? this._cellMain.y += obj.y : this._cellMain.y    =   target.target.y;
                }
            }
            else
            {
                mainWidth   = this._table.columnSizeFromTo (1, this._cellMain.x + obj.x);
                mainHeight  = this._table.lineSizeFromTo (1, this._cellMain.y + obj.y);
            }

            if (0!=obj.x){
                var leftX = Render.getCanvas().offsetWidth + SizeUtils.tablePositionAbs(this._table).x + this._scroll.position().x;
                if (this._scroll.position().x > mainWidth)
                    this._scroll.move({x:mainWidth, y:-1});
                else
                if (mainWidth>=leftX-2){
                    var fullColumnPosition  =  ( this._table.width() - oneX );
                    var renderX             =  ( Render.getCanvas().width - ( this._table.getPosition().x + oneX ));
                    mainWidth               =  this._table.columnSizeFromTo (1, this._cellMain.x);

                    this._scroll.move({x:(mainWidth -renderX), y:-1});
                }
            }

            if (0!=obj.y){
                var topX = Render.getCanvas().offsetHeight + SizeUtils.tablePositionAbs(this._table).y + this._scroll.position().y;
                if (this._scroll.position().y > mainHeight)
                    this._scroll.move({x:-1, y:mainHeight});
                else
                if (mainHeight>=topX-2){
                    var fullLinePosition    =  ( this._table.height() - oneY );
                    var renderY             =  ( Render.getCanvas().height - ( this._table.getPosition().y + oneY ));
                    mainHeight              =  this._table.lineSizeFromTo (1, this._cellMain.y);

                    this._scroll.move({x:-1, y:(mainHeight -renderY)});
                }
            }

            this._scroll.updateSizes();
            this._table.invokeHandlerEvent('updateScrollsPos');
        }
    }
};

var ScrollStatus = function(obj){this.init(obj);};
ScrollStatus.prototype = {
    init:function(obj){
        this._table = obj;

        this._position = {x:0,y:0};
        this._sizes = {x:0,y:0};

        this.updateSizes();
    },

    getID:function (){
        return this._table.getID();
    },

    updateSizes:function(){
        var fullColumnPosition  =  ( this._table.getPosition().x + this._table.width() -  this._table.columnSizeFromTo(0,0) );
        var fullLinePosition    =  ( this._table.getPosition().y + this._table.height() - this._table.lineSizeFromTo(0,0) );

        this._sizes.x           =  Math.max(0,fullColumnPosition - Render.getCanvas().width);
        this._sizes.y           =  Math.max(0,fullLinePosition - Render.getCanvas().height);
    },
    move:function(obj){
        if (this._sizes.x>0&&obj.x>=0)
            this._position.x = obj.x;

        if (this._sizes.y>0&&obj.y>=0)
            this._position.y = obj.y;
    },
    moveOffset:function(obj){
        this._position.x += obj.x;
        this._position.y += obj.y;

        this._position.x = Math.max(0,this._position.x);
        this._position.y = Math.max(0,this._position.y);
        this._position.x = Math.min(this._position.x,this._sizes.x);
        this._position.y = Math.min(this._position.y,this._sizes.y);
    },
    position:function(){
        return this._position;
    },
    sizes:function(){
        return this._sizes;
    }
};