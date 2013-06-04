// tools

var ToolModeDefault             =   0;
var ToolModeLineEraser          =   10;
var ToolModeLinePencil          =   11;

var Tool = function(ref){this.init(ref);};
Tool.prototype={
    init:function(ref){
        this._ref = ref;
        this._mouseDown =   false;
    }
};

var WorkScope = function(){
    var obj  =   new Object ();

    obj._bound  =   null;

    obj.init  =   function(e){
        this._mouseDown =   false
        this._helper =  null;
        this._mouse =   {x:0,y:0};
    };
    obj.bound = function(){
        return this._bound;
    };

    obj.append  =   function(e){
        if (null==this._helper){
            this._helper                    =   document.createElement('div');
            this._helper.delegate           =   this;

            this._helper.onmousedown        =   function(e) { Render.getCanvas().onmousedown(e);   };
            this._helper.onmousemove        =   function(e) { Render.getCanvas().onmousemove(e);   };
            this._helper.onmouseup          =   function(e) { Render.getCanvas().onmouseup(e);     };

            document.body.appendChild(this._helper);
        }
    };
    obj.update  =   function(e){
        this.append(e);

        if (this._helper){
            this._bound = this.boundFromMouse ({x:this._mouse.x,y:this._mouse.y, nx:e.clientX, ny:e.clientY});

            with(this._helper.style){
                border     =    "1px solid red";
                color      =    '#000000';
                position   =    'absolute';

                left       =    this._bound.x + window.pageXOffset + "px";
                top        =    this._bound.y + window.pageYOffset + "px";
                width      =    this._bound.w + "px";
                height     =    this._bound.h + "px";
            }
        }
    };
    obj.release  =   function(e){
        if (this._helper)
            document.body.removeChild(this._helper);
        this._helper = null;
    };

    obj.boundFromMouse   =   function(obj){
        return { x:Math.min(obj.x,obj.nx), y:Math.min(obj.y,obj.ny),
            w:( Math.max(obj.x,obj.nx)-Math.min(obj.x,obj.nx)),
            h:( Math.max(obj.y,obj.ny)- Math.min(obj.y,obj.ny)) };
    };

    obj.onmousemove =   function(e){
        if (this._mouseDown)
            this.update(e);
    };
    obj.onmousedown =   function(e){
        this.release(e);
        if (0==e.button){
            this._mouse     =   {x:e.clientX, y:e.clientY};
            this.update(e);
            this._mouseDown =   true;

            // this._helper.style.className+=' eraser';
            // document.body.className+=' eraser';
            // cursor      =   'default';
        }
    };
    obj.onmouseup   =   function(e){
        this.release(e);
        this._mouseDown =   false;
    };

    obj.init();
    return obj;
};

var LineSplitter = function(){
    var obj  =   new Object ();

    obj._bound  =   null;

    obj.init  =   function(e){
        this._mouseDown =   false
        this._helper =  null;
        this._mouse =   {x:0,y:0};
    };
    obj.bound = function(){
        return this._bound;
    };

    obj.append  =   function(e){
        if (null==this._helper){
            this._helper                    =   document.createElement('div');
            this._helper.delegate           =   this;

            this._helper.onmousedown        =   function(e) { Render.getCanvas().onmousedown(e);   };
            this._helper.onmousemove        =   function(e) { Render.getCanvas().onmousemove(e);   };
            this._helper.onmouseup          =   function(e) { Render.getCanvas().onmouseup(e);     };

            document.body.appendChild(this._helper);
        }
    };
    obj.update  =   function(e){
        this.append(e);

        if (this._helper){
            this._bound = this.boundFromMouse ({x:this._mouse.x,y:this._mouse.y, nx:e.clientX, ny:e.clientY});

            with(this._helper.style){
                border     =    "1px dashed black";
                color      =    '#000000';
                position   =    'absolute';

                left       =    this._bound.x + window.pageXOffset + "px";
                top        =    this._bound.y + window.pageYOffset + "px";
                width      =    this._bound.w + "px";
                height     =    this._bound.h + "px";
            }
        }
    };
    obj.release  =   function(e){
        if (this._helper)
            document.body.removeChild(this._helper);
        this._helper = null;
    };

    obj.boundFromMouse   =   function(obj){
        return { x:Math.min(obj.x,obj.nx), y:Math.min(obj.y,obj.ny),
            w:( Math.max(obj.x,obj.nx)-Math.min(obj.x,obj.nx)),
            h:( Math.max(obj.y,obj.ny)- Math.min(obj.y,obj.ny)) };
    };

    obj.onmousemove =   function(e){
        if (this._mouseDown)
            this.update(e);
    };
    obj.onmousedown =   function(e){
        this.release(e);
        if (0==e.button){
            this._mouse     =   {x:e.clientX, y:e.clientY};
            this.update(e);
            this._mouseDown =   true;
        }
    };
    obj.onmouseup   =   function(e){
        this.release(e);
        this._mouseDown =   false;
    };

    obj.init();
    return obj;
};

var LineEraserTool  =   function(ref){
    var obj         =   new Tool(ref);
    obj.constructor =   arguments.callee;

    // property

    obj._scope      =   new WorkScope();

    obj.findTarget  =   function(){
        return { column:this._ref.model().getSelectRowCell (this._mouse.x),
            line:this._ref.model().getSelectLineCell (this._mouse.y) };
    };
    obj.findTargetByMouse  =   function(obj){
        return { column:this._ref.model().getSelectRowCell (obj.x),
            line:this._ref.model().getSelectLineCell (obj.y) };
    };
    obj.findTargetColumn    =   function(){
        return this._ref.model().getCaptureRow(this._mouse.x);

    };
    obj.findTargetLine  =   function(){
        return  this._ref.model().getCaptureLine(this._mouse.y);
    };

    obj.mergeOneLine    =   function(obj){  //   TODO: for testing
        if (obj.x-1>=0){
            var mergeObj;
            var one =   this._ref.model().merger().getOfIndex({x:obj.x-1,y:obj.y});
            var two =   this._ref.model().merger().getOfIndex({x:obj.x,y:obj.y});
            if (undefined==one&&undefined==two){
                mergeObj = new Object();
                mergeObj.target =   {x:obj.x-1,y:obj.y};
                mergeObj.w = 1;
                mergeObj.h = 0;

                this._ref.model().merger().merge(mergeObj);
                return true;
            }

            if (undefined!=one&&undefined==two) {
                if((one.h==0)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:one.target.x,y:one.target.y};
                    mergeObj.w = one.w + 1;
                    mergeObj.h = one.h;

                    this._ref.model().merger().merge(mergeObj);
                }
                return true;
            }
            if (undefined==one&&undefined!=two){
                 if((0==two.h)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:obj.x-1,y:obj.y};
                    mergeObj.w = two.w + 1;
                    mergeObj.h = two.h;

                    this._ref.model().merger().merge(mergeObj);
                }
                return true;
            }

            if (undefined!=one&&undefined!=two){
                if((one.h==two.h)&&(one.target.x!=two.target.x)&&(one.target.y==two.target.y)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:one.target.x,y:one.target.y};
                    mergeObj.w = one.w + two.w + 1;
                    mergeObj.h = one.h;

                    this._ref.model().merger().merge(mergeObj);

                    return true
                }
            }
        }

        return false;
    };
    obj.mergeOneColumn  =   function(obj){   //   TODO: for testing
        if (obj.y-1>=0){
            var mergeObj;
            var one =   this._ref.model().merger().getOfIndex({x:obj.x,y:obj.y-1});
            var two =   this._ref.model().merger().getOfIndex({x:obj.x,y:obj.y});
            if (undefined==one&&undefined==two){
                mergeObj = new Object();
                mergeObj.target =   {x:obj.x,y:obj.y-1};
                mergeObj.w = 0;
                mergeObj.h = 1;

                this._ref.model().merger().merge(mergeObj);
                return true;
            }

            if (undefined!=one&&undefined==two) {
                if((one.w==0)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:one.target.x,y:one.target.y};
                    mergeObj.w = one.w;
                    mergeObj.h = one.h+1;

                    this._ref.model().merger().merge(mergeObj);
                }
                return true;
            }
            if (undefined==one&&undefined!=two){
                 if((0==two.w)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:obj.x,y:obj.y-1};
                    mergeObj.w = two.w;
                    mergeObj.h = two.h+1;

                    this._ref.model().merger().merge(mergeObj);
                }
                return true;
            }

            if (undefined!=one&&undefined!=two){
                if((one.w==two.w)&&(one.target.y!=two.target.y)&&(one.target.x==two.target.x)){
                    mergeObj = new Object();
                    mergeObj.target =   {x:one.target.x,y:one.target.y};
                    mergeObj.w = one.w;
                    mergeObj.h = one.h + two.h + 1;

                    this._ref.model().merger().merge(mergeObj);

                    return true
                }
            }
        }

        return false;
    };

    obj.processArea =   function(obj){    //   TODO: default func for merge add delete style
        var i;
        var j;

        var ret = false;

        for (j=obj.y;j<=obj.ye;++j)
            for (i=obj.x+1;i<=obj.xe;++i)
               ret |= this.mergeOneLine ({x:i,y:j})

        for (i=obj.x;i<=obj.xe;++i)
            for (j=obj.y+1;j<=obj.ye;++j)
                ret |= this.mergeOneColumn ({x:i,y:j})
        for (j=obj.y;j<=obj.ye;++j)
            for (i=obj.x+1;i<=obj.xe;++i)
                ret |= this.mergeOneLine ({x:i,y:j})

        for (i=obj.x;i<=obj.xe;++i)
            for (j=obj.y+1;j<=obj.ye;++j)
               ret |= this.mergeOneColumn ({x:i,y:j})

        return ret;
    };

    obj.finish  =   function(){
        if (this._scope){
            var bound =   this._scope.bound();
            if (bound){
                if(0==bound.w&&0==bound.h){
                    var column  =   this.findTargetColumn();
                    var line    =   this.findTargetLine();
                    var cell    =   this.findTarget();

                    // console.log('column : ' +column + ' line :' + line + 'cell :{' + cell.column +':' + cell.line +'}');

                    if (-1!=column){
                        if (this.mergeOneLine({x:column,y:cell.line}) )
                            this._ref.model().invokeHandlerEvent('needPaint', null);
                        return;
                    }

                    if (-1!=line){
                        if (this.mergeOneColumn({x:cell.column,y:line}))
                            this._ref.model().invokeHandlerEvent('needPaint', null);
                        return;
                    }

                    return;
                }

                var leftTop = this.findTargetByMouse(SizeUtils.coordToCanvas({x:bound.x,y:bound.y}));
                var rightBottom = this.findTargetByMouse(SizeUtils.coordToCanvas({x:bound.x+bound.w,y:bound.y+bound.h}) );

                // console.log('cell :{' + leftTop.column +':' + leftTop.line +'}');

                if (this.processArea ({x:leftTop.column,y:leftTop.line,xe:rightBottom.column, ye:rightBottom.line}))
                    this._ref.model().invokeHandlerEvent('needPaint', null);
            }
        }
    };

    obj.removeSelectTarget  =   function(){

    };

    // functions
    obj.debug       =   function(){
    //    console.log('LineEraserTool :' + this.id );
    };
    obj.clean    =   function(){
        if (this._scope)
            this._scope.release();
    };

    obj.onmousemove =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._scope.onmousemove(e);

    };
    obj.onmousedown =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._scope.onmousedown(e);

    };
    obj.onmouseup =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._scope.onmouseup(e);

        this.finish();

    };

    return obj;
};
var PencilTool  =   function(ref){
    var obj         =   new Tool(ref);
    obj.constructor =   arguments.callee;

    // property

    obj._splitter      =   new LineSplitter();

    obj.findTarget  =   function(){
        return { column:this._ref.model().getSelectRowCell (this._mouse.x),
            line:this._ref.model().getSelectLineCell (this._mouse.y) };
    };
    obj.findTargetByMouse  =   function(obj){
        return { column:this._ref.model().getSelectRowCell (obj.x),
            line:this._ref.model().getSelectLineCell (obj.y) };
    };
    obj.findTargetColumn    =   function(){
        return this._ref.model().getCaptureRow(this._mouse.x);

    };
    obj.findTargetLine  =   function(){
        return  this._ref.model().getCaptureLine(this._mouse.y);
    };

    obj.finish  =   function(){
    };

    // functions
    obj.debug       =   function(){
       // console.log('PencilTool :' + this.id );
    };
    obj.clean    =   function(){
        if (this._scope)
            this._scope.release();
    };

    obj.onmousemove =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._splitter.onmousemove(e);

    };
    obj.onmousedown =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._splitter.onmousedown(e);

    };
    obj.onmouseup =   function(e){
        this._mouse = SizeUtils.mouseCoordToCanvas(e);

        obj._splitter.onmouseup(e);

        this.finish();

    };

    return obj;
};

var ToolEditor  =   function(ref){
    var obj         =   new Tool(ref);
    obj.constructor =   arguments.callee;

    obj._eraser =   null;
    obj._pencil =   null;
    obj._mode   =   ToolModeDefault;
    obj._tool   =   null;

    obj.mode    =   function(e){
        if(ToolModeDefault==e){
            this.release();
            obj._tool    =  null;
        }

        if (ToolModeLineEraser==e){
            this.release();

            if (null==obj._eraser)
                obj._eraser =   new  LineEraserTool(this._ref);

            obj._tool    =  obj._eraser;
        }

        if (ToolModeLinePencil==e){
            this.release();

            if (null==obj._pencil)
                obj._pencil =   new  PencilTool(this._ref);

            obj._tool    =  obj._pencil;
        }

        this._mode  =   e;

    };
    obj.release =   function(){
          if(obj._tool){
            obj._tool.clean();
            obj._tool   =   null;
          }

        this._mode  =   ToolModeDefault;
    };
    obj.isEnable =   function(){
        return (null!=obj._tool);
    };

    obj.onmousemove =   function(e){
        if (obj._tool)
            obj._tool.onmousemove(e);
    };
    obj.onmousedown =   function(e){
        if (obj._tool)
            obj._tool.onmousedown(e);
    };
    obj.onmouseup =   function(e){
        if (obj._tool)
            obj._tool.onmouseup(e);
    };

    return obj;
};
