/**
 * Created by Sergey.Luzyanin on 4/25/2017.
 */
(function(undefined){



    function CBaseParams() {
        this.aAdj = [];//{"@adjName": value};
        this.posX = null;
        this.posY = null;
        this.extX = null;
        this.extY = null;
        this.flipH = null;
        this.flipV = null;
        this.rot = null;
    }

    function CConnectionShape() {
        AscFormat.CShape.call(this);
    }
    CConnectionShape.prototype = Object.create(AscFormat.CShape.prototype);
    CConnectionShape.prototype.constructor = CConnectionShape;

    CConnectionShape.prototype.calculateBaseParams = function(startPos, endPos){

    }

})();