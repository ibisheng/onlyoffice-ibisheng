/**
 * @param {Window} window
 * @param {undefined} undefined
 */
(function (window, undefined) {

    var LOCKS_MASKS =
    {
        noGrp: 1,
        noUngrp: 4,
        noSelect: 16,
        noRot: 64,
        noChangeAspect: 256,
        noMove: 1024,
        noResize: 4096,
        noEditPoints: 16384,
        noAdjustHandles: 65536,
        noChangeArrowheads: 262144,
        noChangeShapeType: 1048576,
        noDrilldown: 4194304,
        noTextEdit: 8388608,
        noCrop: 16777216
    };

    function checkNormalRotate(rot)
    {
        var _rot = normalizeRotate(rot);
        return (_rot >= 0 && _rot < Math.PI * 0.25) || (_rot >= 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot >= 7 * Math.PI * 0.25 && _rot < 2 * Math.PI);
    }

    function normalizeRotate(rot)
    {
        var new_rot = rot;
        if(AscFormat.isRealNumber(new_rot))
        {
            while(new_rot >= 2*Math.PI)
                new_rot -= 2*Math.PI;
            while(new_rot < 0)
                new_rot += 2*Math.PI;
            return new_rot;
        }
        return new_rot;
    }

    
    /**
     * Class represent bounds graphical object
     * @param {number} l
     * @param {number} t
     * @param {number} r
     * @param {number} b
     * @constructor
     */
    function CGraphicBounds(l, t, r, b){
        this.l = l;
        this.t = t;
        this.r = r;
        this.b = b;

        this.x = l;
        this.y = t;
        this.w = r - l;
        this.h = b - t;
    }
    /**
     * Base class for all graphic objects
     * @constructor
     */
    function CGraphicObjectBase() {
        /*Format fields*/
        this.spPr  = null;
        this.group = null;
        this.parent = null;
        this.bDeleted = true;
        this.locks = 0;
        this.Id = '';

        /*Calculated fields*/
        this.posX = null;
        this.posY = null;
        this.x    = 0;
        this.y    = 0;
        this.extX = 0;
        this.extY = 0;
        this.rot  = 0;
        this.flipH = false;
        this.flipV = false;
        this.bounds = new CGraphicBounds(0, 0, 0, 0);
        this.localTransform = new AscCommon.CMatrix();
        this.transform = new AscCommon.CMatrix();
        this.invertTransform = null;
        this.pen = null;
        this.brush = null;
        this.snapArrayX = [];
        this.snapArrayY = [];

        this.selected = false;

        this.Lock = new AscCommon.CLock();
        this.setRecalculateInfo();
    }

    /**
     * Create a scheme color
     * @memberof CGraphicObjectBase
     * @returns {CGraphicBounds}
     */
    CGraphicObjectBase.prototype.checkBoundsRect = function(){
        var aCheckX = [], aCheckY = [];
        this.calculateSnapArrays(aCheckX, aCheckY, this.localTransform);
        return new CGraphicBounds(Math.min.apply(Math, aCheckX), Math.min.apply(Math, aCheckY), Math.max.apply(Math, aCheckX), Math.max.apply(Math, aCheckY));
    };

    
    /**
     * Set default recalculate info
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.setRecalculateInfo = function(){};
    
    /**
     * Get object Id
     * @memberof CGraphicObjectBase
     * @returns {string}
     */
    CGraphicObjectBase.prototype.Get_Id = function () {
        return this.Id;
    };

    /**
     * Get type object
     * @memberof CGraphicObjectBase
     * @returns {number}
     */
    CGraphicObjectBase.prototype.getObjectType = function () {
        return AscDFH.historyitem_type_Unknown;
    };

    /**
     * Write object to stream
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.Write_ToBinary2 = function (oWriter) {
        oWriter.WriteLong(this.getObjectType());
        oWriter.WriteString2(this.Get_Id());
    };

    /**
     * Read object from stream
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.Read_FromBinary2 = function (oReader) {
        this.Id = oReader.GetString2();
    };


    /**
     * Get object Id
     * @memberof CGraphicObjectBase
     * @returns {string}
     */
    CGraphicObjectBase.prototype.Get_Id = function () {
        return this.Id;
    };

    /**
     * Get object bounds for defining group size
     * @memberof CGraphicObjectBase
     * @returns {CGraphicBounds}
     */
    CGraphicObjectBase.prototype.getBoundsInGroup = function () {
        var r = this.rot;
        if (!AscFormat.isRealNumber(r) || AscFormat.checkNormalRotate(r)) {
            return new CGraphicBounds(this.x, this.y, this.x + this.extX, this.y + this.extY);
        }
        else {
            var hc = this.extX * 0.5;
            var vc = this.extY * 0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return new CGraphicBounds(xc - vc, yc - hc, xc + vc, yc + hc);
        }
    };

    /**
     * Normalize a size object in group
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.normalize = function () {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        }
        else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx * xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy * xfrm.extY;
        }
        Math.abs(new_off_x - xfrm.offX) > AscFormat.MOVE_DELTA &&  xfrm.setOffX(new_off_x);
        Math.abs(new_off_y - xfrm.offY) > AscFormat.MOVE_DELTA &&  xfrm.setOffY(new_off_y);
        Math.abs(new_ext_x - xfrm.extX) > AscFormat.MOVE_DELTA &&  xfrm.setExtX(new_ext_x);
        Math.abs(new_ext_y - xfrm.extY) > AscFormat.MOVE_DELTA &&  xfrm.setExtY(new_ext_y);
    };

    /**
     * Check point hit to bounds object
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.checkHitToBounds = function(x, y) {
        if(this.parent && (this.parent.Get_ParentTextTransform  && this.parent.Get_ParentTextTransform())) {
            return true;
        }
        var _x, _y;
        if(AscFormat.isRealNumber(this.posX) && AscFormat.isRealNumber(this.posY)){
            _x = x - this.posX - this.bounds.x;
            _y = y - this.posY - this.bounds.y;
        }
        else{
            _x = x - this.bounds.x;
            _y = y - this.bounds.y;
        }
        var delta = 3 + (this.pen && AscFormat.isRealNumber(this.pen.w) ? this.pen.w/36000 : 0);
        return _x >= -delta && _x <= this.bounds.w + delta && _y >= -delta && _y <= this.bounds.h + delta;
    };

    /**
     * Internal method for calculating snap arrays
     * @param {Array} snapArrayX
     * @param {Array} snapArrayY
     * @param {CMatrix} transform
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.calculateSnapArrays = function(snapArrayX, snapArrayY, transform)
    {
        var t = transform ? transform : this.transform;
        snapArrayX.push(t.TransformPointX(0, 0));
        snapArrayY.push(t.TransformPointY(0, 0));
        snapArrayX.push(t.TransformPointX(this.extX, 0));
        snapArrayY.push(t.TransformPointY(this.extX, 0));

        snapArrayX.push(t.TransformPointX(this.extX*0.5, this.extY*0.5));
        snapArrayY.push(t.TransformPointY(this.extX*0.5, this.extY*0.5));
        snapArrayX.push(t.TransformPointX(this.extX, this.extY));
        snapArrayY.push(t.TransformPointY(this.extX, this.extY));
        snapArrayX.push(t.TransformPointX(0, this.extY));
        snapArrayY.push(t.TransformPointY(0, this.extY));
    };

    /**
     * Public method for calculating snap arrays
     * @memberof CGraphicObjectBase
     */
    CGraphicObjectBase.prototype.recalculateSnapArrays = function()
    {
        this.snapArrayX.length = 0;
        this.snapArrayY.length = 0;
        this.calculateSnapArrays(this.snapArrayX, this.snapArrayY, null);
    };

    CGraphicObjectBase.prototype.setLocks = function(nLocks){
        AscCommon.History.Add(this, {Type: AscDFH.historyitem_AutoShapes_SetLocks, oldPr: this.locks, newPr: nLocks});
        this.locks = nLocks;
    };

    CGraphicObjectBase.prototype.getLockValue = function(nMask) {
        return  !!((this.locks & nMask) && (this.locks & (nMask << 1)));
    };

    CGraphicObjectBase.prototype.setLockValue = function(nMask, bValue) {
        if(!AscFormat.isRealBool(bValue)) {
            this.setLocks((~nMask) & this.locks);
        }
        else{
            this.setLocks(this.locks | nMask | (bValue ? nMask << 1 : 0));
        }
    };

    CGraphicObjectBase.prototype.getNoGrp = function(){
        return this.getLockValue(LOCKS_MASKS.noGrp);
    };
    CGraphicObjectBase.prototype.getNoUngrp = function(){
        return this.getLockValue(LOCKS_MASKS.noUngrp);
    };
    CGraphicObjectBase.prototype.getNoSelect = function(){
        return this.getLockValue(LOCKS_MASKS.noSelect);
    };
    CGraphicObjectBase.prototype.getNoRot = function(){
        return this.getLockValue(LOCKS_MASKS.noRot);
    };
    CGraphicObjectBase.prototype.getNoChangeAspect = function(){
        return this.getLockValue(LOCKS_MASKS.noChangeAspect);
    };
    CGraphicObjectBase.prototype.getNoMove = function(){
        return this.getLockValue(LOCKS_MASKS.noMove);
    };
    CGraphicObjectBase.prototype.getNoResize = function(){
        return this.getLockValue(LOCKS_MASKS.noResize);
    };
    CGraphicObjectBase.prototype.getNoEditPoints = function(){
        return this.getLockValue(LOCKS_MASKS.noEditPoints);
    };
    CGraphicObjectBase.prototype.getNoAdjustHandles = function(){
        return this.getLockValue(LOCKS_MASKS.noAdjustHandles);
    };
    CGraphicObjectBase.prototype.getNoChangeArrowheads = function(){
        return this.getLockValue(LOCKS_MASKS.noChangeArrowheads);
    };
    CGraphicObjectBase.prototype.getNoChangeShapeType = function(){
        return this.getLockValue(LOCKS_MASKS.noChangeShapeType);
    };
    CGraphicObjectBase.prototype.getNoDrilldown = function(){
        return this.getLockValue(LOCKS_MASKS.noDrilldown);
    };
    CGraphicObjectBase.prototype.getNoTextEdit = function(){
        return this.getLockValue(LOCKS_MASKS.noTextEdit);
    };
    CGraphicObjectBase.prototype.getNoCrop = function(){
        return this.getLockValue(LOCKS_MASKS.noCrop);
    };
    CGraphicObjectBase.prototype.setNoChangeAspect = function(bValue){
        return this.setLockValue(LOCKS_MASKS.noChangeAspect, bValue);
    };
    CGraphicObjectBase.prototype.Reassign_ImageUrls = function(mapUrl){
        if(this.blipFill){
            if(mapUrl[this.blipFill.RasterImageId]){
                if(this.setBlipFill){
                    var blip_fill = new AscFormat.CBlipFill();
                    blip_fill.setRasterImageId(mapUrl[this.blipFill.RasterImageId]);
                    blip_fill.setStretch(true);
                    this.setBlipFill(blip_fill);
                }
            }
        }
        if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill.RasterImageId){
            if(mapUrl[this.spPr.Fill.fill.RasterImageId]){
                var blip_fill = new AscFormat.CBlipFill();
                blip_fill.setRasterImageId(mapUrl[this.blipFill.RasterImageId]);
                blip_fill.setStretch(true);
                var oUniFill = new AscFormat.CUniFill();
                oUniFill.setFill(blip_fill);
                this.spPr.setFill(oUniFill);
            }
        }
        if(Array.isArray(this.spTree)){
            for(var i = 0; i < this.spTree.length; ++i){
                if(this.spTree[i].Reassign_ImageUrls){
                    this.spTree[i].Reassign_ImageUrls(mapUrl);
                }
            }
        }
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CGraphicObjectBase = CGraphicObjectBase;
    window['AscFormat'].CGraphicBounds     = CGraphicBounds;
    window['AscFormat'].checkNormalRotate  = checkNormalRotate;
    window['AscFormat'].normalizeRotate    = normalizeRotate;
    window['AscFormat'].LOCKS_MASKS        = LOCKS_MASKS;
})(window);