"use strict";

(function(window, undefined){
    AscFormat.CTextBody.prototype.Get_Worksheet = function()
    {
        return this.parent && this.parent.Get_Worksheet && this.parent.Get_Worksheet();
    };
    AscFormat.CTextBody.prototype.getDrawingDocument = function()
    {
        return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
    };
})(window);
