var LINE_DOTTED__STEP       =   2;

CanvasRenderingContext2D.prototype.dottedLineTo = function (x, y, to, type) {

    //  type - false - vertical, true - horizontal
    
    if ( type )
    {
        var half = 0.5;
        for (var i = x; i < to; i = i + (LINE_DOTTED__STEP * 2)) {
            this.moveTo(i + half, y + half);
            this.lineTo(i + LINE_DOTTED__STEP + half, y + half);
        }
    }
    else
    {
        var half = 0.5;
        for (var i = y; i < to; i = i + (LINE_DOTTED__STEP * 2)) {
            this.moveTo(x + half, i + half);
            this.lineTo(x + half, i + LINE_DOTTED__STEP + half);
        }
    }
};
CanvasRenderingContext2D.prototype.fullClear = function(){
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

var Render = function(){
    var __canvas    =   null;
    var __context   =   null;
};

Render.getCanvas = function() { return Render.__canvas; }
Render.setCanvas = function(cn) { Render.__canvas = cn; }
Render.get = function() { return Render.__context; }
Render.set = function(cn) { Render.__context = cn; }

/*
 var Render = (function(){
 var __canvas    =   null;
    var __context   =   null;

    var __instance = function() {

          this.setCanvas = function(cn){
         __canvas   =   cn;
         },

         this.setContext = function(cn){
         __context   =   cn;
         },
         this.get = function(){
         if (__canvas )
         return __canvas;

         return null;
         },
         this.render = function(){
         if (__context )
         return __context;

         return null;
         }

    };

    return (__instance);
})();

*/
