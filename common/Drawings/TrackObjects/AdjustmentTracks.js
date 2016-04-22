"use strict";

(function(window, undefined){

function XYAdjustmentTrack(originalShape, adjIndex, bTextWarp)
{
    AscFormat.ExecuteNoHistory(function(){
        this.originalShape = originalShape;

        var oPen, oBrush;
        if(bTextWarp !== true)
        {
            this.geometry = originalShape.spPr.geometry.createDuplicate();
            this.shapeWidth = originalShape.extX;
            this.shapeHeight = originalShape.extY;
            this.transform = originalShape.transform;
            this.invertTransform = originalShape.invertTransform;
            oPen = originalShape.pen;
            oBrush = originalShape.brush;
        }
        else
        {
            this.geometry = originalShape.recalcInfo.warpGeometry.createDuplicate();
            this.shapeWidth = originalShape.recalcInfo.warpGeometry.gdLst["w"];
            this.shapeHeight = originalShape.recalcInfo.warpGeometry.gdLst["h"];
            this.transform = originalShape.transformTextWordArt;
            this.invertTransform = originalShape.invertTransformTextWordArt;
            oPen = null;
            oBrush = null;
        }
        this.bTextWarp = bTextWarp === true;
        this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
        this.adjastment = this.geometry.ahXYLst[adjIndex];

        this.xFlag = false;
        this.yFlag = false;

        this.refX = null;
        this.refY = null;

        this.originalObject= originalShape;

        if(this.adjastment !== null && typeof this.adjastment === "object")
        {
            var _ref_x = this.adjastment.gdRefX;
            var  _gd_lst = this.geometry.gdLst;
            if(typeof _ref_x === "string" && typeof _gd_lst[_ref_x] === "number"
                && typeof this.adjastment.minX === "number" && typeof this.adjastment.maxX === "number")
            {
                _gd_lst[_ref_x] = this.adjastment.minX;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);

                this.minRealX = this.adjastment.posX;

                _gd_lst[_ref_x] = this.adjastment.maxX;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);

                this.maxRealX = this.adjastment.posX;
                this.maximalRealX = Math.max(this.maxRealX, this.minRealX);
                this.minimalRealX = Math.min(this.maxRealX, this.minRealX);

                this.minimalRealativeX = Math.min(this.adjastment.minX, this.adjastment.maxX);
                this.maximalRealativeX = Math.max(this.adjastment.minX, this.adjastment.maxX);

                if(this.maximalRealX - this.minimalRealX > 0)
                {
                    this.coeffX = (this.adjastment.maxX - this.adjastment.minX)/(this.maxRealX - this.minRealX);
                    this.xFlag = true;
                }
            }

            var _ref_y = this.adjastment.gdRefY;
            if(typeof _ref_y === "string" && typeof _gd_lst[_ref_y] === "number"
                && typeof this.adjastment.minY === "number" && typeof this.adjastment.maxY === "number")
            {
                _gd_lst[_ref_y] = this.adjastment.minY;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);

                this.minRealY = this.adjastment.posY;

                _gd_lst[_ref_y] = this.adjastment.maxY;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);

                this.maxRealY = this.adjastment.posY;


                this.maximalRealY = Math.max(this.maxRealY, this.minRealY);
                this.minimalRealY = Math.min(this.maxRealY, this.minRealY);

                this.minimalRealativeY = Math.min(this.adjastment.minY, this.adjastment.maxY);
                this.maximalRealativeY = Math.max(this.adjastment.minY, this.adjastment.maxY);

                if(this.maximalRealY - this.minimalRealY > 0)
                {
                    this.coeffY = (this.adjastment.maxY - this.adjastment.minY)/(this.maxRealY - this.minRealY);
                    this.yFlag = true;
                }
            }
            if(this.xFlag)
            {
                this.refX = _ref_x;
            }
            if(this.yFlag)
            {
                this.refY = _ref_y;
            }
        }
        this.overlayObject = new OverlayObject(this.geometry, this.shapeWidth, this.shapeHeight, oBrush, oPen, this.transform);


    }, this, []);

    this.draw = function(overlay)
    {
        if(AscFormat.isRealNumber(this.originalShape.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalShape.selectStartPage);
        }
        this.overlayObject.draw(overlay);
    };


    this.track = function(posX, posY)
    {
        var invert_transform = this.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);

        var bRecalculate = false;

        if(this.xFlag)
        {
            var _new_x = this.adjastment.minX + this.coeffX*(_relative_x - this.minRealX);

            if(_new_x <= this.maximalRealativeX && _new_x >= this.minimalRealativeX)
            {
                if(this.geometry.gdLst[this.adjastment.gdRefX] !== _new_x)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefX] = _new_x;
            }
            else if( _new_x > this.maximalRealativeX)
            {
                if(this.geometry.gdLst[this.adjastment.gdRefX] !== this.maximalRealativeX)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefX] = this.maximalRealativeX;
            }
            else
            {
                if(this.geometry.gdLst[this.adjastment.gdRefX] !== this.minimalRealativeX)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefX] = this.minimalRealativeX;
            }
        }

        if(this.yFlag)
        {
            var _new_y = this.adjastment.minY + this.coeffY*(_relative_y - this.minRealY);

            if(_new_y <= this.maximalRealativeY && _new_y >= this.minimalRealativeY)
            {
                if(this.geometry.gdLst[this.adjastment.gdRefY] !== _new_y)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefY] = _new_y;
            }
            else if(_new_y > this.maximalRealativeY)
            {
                if(this.geometry.gdLst[this.adjastment.gdRefY] !== this.maximalRealativeY)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefY] = this.maximalRealativeY;
            }
            else
            {
                if(this.geometry.gdLst[this.adjastment.gdRefY] !== this.minimalRealativeY)
                    bRecalculate = true;
                this.geometry.gdLst[this.adjastment.gdRefY] = this.minimalRealativeY;
            }
        }
        if(bRecalculate)
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
    };

    this.trackEnd = function()
    {
        var oGeometryToSet;
        if(!this.bTextWarp)
        {
            oGeometryToSet =  this.originalShape.spPr.geometry;
            if(this.xFlag)
            {
                oGeometryToSet.setAdjValue(this.refX, this.geometry.gdLst[this.adjastment.gdRefX]+"");
            }
            if(this.yFlag)
            {
                oGeometryToSet.setAdjValue(this.refY, this.geometry.gdLst[this.adjastment.gdRefY]+"");
            }
        }
        else
        {
            var new_body_pr = this.originalShape.getBodyPr();
            if (new_body_pr) {
                oGeometryToSet = AscFormat.ExecuteNoHistory(function(){
                    var oGeom = this.geometry.createDuplicate();
                    if(this.xFlag)
                    {
                        oGeom.setAdjValue(this.refX, this.geometry.gdLst[this.adjastment.gdRefX]+"");
                    }
                    if(this.yFlag)
                    {
                        oGeom.setAdjValue(this.refY, this.geometry.gdLst[this.adjastment.gdRefY]+"");
                    }
                    return oGeom;
                }, this, []);

                new_body_pr = new_body_pr.createDuplicate();
                new_body_pr.prstTxWarp = oGeometryToSet;
                if (this.originalShape.bWordShape) {
                    this.originalShape.setBodyPr(new_body_pr);
                }
                else {
                    if (this.originalShape.txBody) {
                        this.originalShape.txBody.setBodyPr(new_body_pr);
                    }
                }
            }

        }
    };
}

XYAdjustmentTrack.prototype.getBounds = function()
{
    var bounds_checker = new  AscFormat.CSlideBoundsChecker();
    bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
    this.draw(bounds_checker);
    var tr = this.originalShape.transform;
    var arr_p_x = [];
    var arr_p_y = [];
    arr_p_x.push(tr.TransformPointX(0,0));
    arr_p_y.push(tr.TransformPointY(0,0));
    arr_p_x.push(tr.TransformPointX(this.originalShape.extX,0));
    arr_p_y.push(tr.TransformPointY(this.originalShape.extX,0));
    arr_p_x.push(tr.TransformPointX(this.originalShape.extX,this.originalShape.extY));
    arr_p_y.push(tr.TransformPointY(this.originalShape.extX,this.originalShape.extY));
    arr_p_x.push(tr.TransformPointX(0,this.originalShape.extY));
    arr_p_y.push(tr.TransformPointY(0,this.originalShape.extY));

    arr_p_x.push(bounds_checker.Bounds.min_x);
    arr_p_x.push(bounds_checker.Bounds.max_x);
    arr_p_y.push(bounds_checker.Bounds.min_y);
    arr_p_y.push(bounds_checker.Bounds.max_y);

    bounds_checker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
    bounds_checker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
    bounds_checker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
    bounds_checker.Bounds.max_y = Math.max.apply(Math, arr_p_y);

    bounds_checker.Bounds.posX = this.originalShape.x;
    bounds_checker.Bounds.posY = this.originalShape.y;
    bounds_checker.Bounds.extX = this.originalShape.extX;
    bounds_checker.Bounds.extY = this.originalShape.extY;

    return bounds_checker.Bounds;
};

function PolarAdjustmentTrack(originalShape, adjIndex, bTextWarp)
{
    AscFormat.ExecuteNoHistory(function(){
        this.originalShape = originalShape;



        var oPen, oBrush;
        if(bTextWarp !== true)
        {
            this.geometry = originalShape.spPr.geometry.createDuplicate();
            this.shapeWidth = originalShape.extX;
            this.shapeHeight = originalShape.extY;
            this.transform = originalShape.transform;
            this.invertTransform = originalShape.invertTransform;
            oPen = originalShape.pen;
            oBrush = originalShape.brush;
        }
        else
        {
            this.geometry = originalShape.recalcInfo.warpGeometry.createDuplicate();
            this.shapeWidth = originalShape.recalcInfo.warpGeometry.gdLst["w"];
            this.shapeHeight = originalShape.recalcInfo.warpGeometry.gdLst["h"];
            this.transform = originalShape.transformTextWordArt;
            this.invertTransform = originalShape.invertTransformTextWordArt;
            oPen = null;
            oBrush = null;
        }

        this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
        this.adjastment = this.geometry.ahPolarLst[adjIndex];
        this.bTextWarp = bTextWarp === true;

        this.radiusFlag = false;
        this.angleFlag = false;


        this.originalObject = originalShape;

        if(this.adjastment !== null && typeof this.adjastment === "object")
        {
            var _ref_r = this.adjastment.gdRefR;
            var  _gd_lst = this.geometry.gdLst;
            if(typeof _ref_r === "string" && typeof _gd_lst[_ref_r] === "number"
                && typeof this.adjastment.minR === "number" && typeof this.adjastment.maxR === "number")
            {
                _gd_lst[_ref_r] = this.adjastment.minR;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
                var _dx = this.adjastment.posX - this.shapeWidth*0.5;
                var _dy = this.adjastment.posY - this.shapeWidth*0.5;
                this.minRealR = Math.sqrt(_dx*_dx + _dy*_dy);

                _gd_lst[_ref_r] = this.adjastment.maxR;
                this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
                _dx = this.adjastment.posX - this.shapeWidth*0.5;
                _dy = this.adjastment.posY - this.shapeHeight*0.5;
                this.maxRealR = Math.sqrt(_dx*_dx + _dy*_dy);



                this.maximalRealRadius = Math.max(this.maxRealR, this.minRealR);
                this.minimalRealRadius = Math.min(this.maxRealR, this.minRealR);

                this.minimalRealativeRadius = Math.min(this.adjastment.minR, this.adjastment.maxR);
                this.maximalRealativeRadius = Math.max(this.adjastment.minR, this.adjastment.maxR);

                if(this.maximalRealRadius - this.minimalRealRadius > 0)
                {
                    this.coeffR = (this.adjastment.maxR - this.adjastment.minR)/(this.maxRealR - this.minRealR);
                    this.radiusFlag = true;
                }
            }

            var _ref_ang = this.adjastment.gdRefAng;
            if(typeof _ref_ang === "string" && typeof _gd_lst[_ref_ang] === "number"
                && typeof this.adjastment.minAng === "number" && typeof  this.adjastment.maxAng === "number")
            {
                this.angleFlag = true;
                this.minimalAngle = Math.min(this.adjastment.minAng, this.adjastment.maxAng);
                this.maximalAngle = Math.max(this.adjastment.minAng, this.adjastment.maxAng);
            }

        }

        this.overlayObject = new OverlayObject(this.geometry, this.shapeWidth, this.shapeHeight, oBrush, oPen, this.transform);

    }, this, []);

    this.draw = function(overlay)
    {
        if(this.originalShape.parent && AscFormat.isRealNumber(this.originalShape.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalShape.selectStartPage);
        }
        this.overlayObject.draw(overlay);
    };

    this.track = function(posX, posY)
    {
        var invert_transform = this.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);



        var _pos_x_relative_center = _relative_x - this.shapeHeight*0.5;
        var _pos_y_relative_center = _relative_y - this.shapeWidth*0.5;
        if(this.radiusFlag)
        {
            var _radius = Math.sqrt(_pos_x_relative_center*_pos_x_relative_center + _pos_y_relative_center*_pos_y_relative_center);
            var _new_radius = this.adjastment.minR + this.coeffR*(_radius - this.minRealR);

            if(_new_radius <= this.maximalRealativeRadius && _new_radius >= this.minimalRealativeRadius)
            {
                this.geometry.gdLst[this.adjastment.gdRefR] = _new_radius;
            }
            else if( _new_radius > this.maximalRealativeRadius)
            {
                this.geometry.gdLst[this.adjastment.gdRefR] = this.maximalRealativeRadius;
            }
            else
            {
                this.geometry.gdLst[this.adjastment.gdRefR] = this.minimalRealativeRadius;
            }
        }

        if(this.angleFlag)
        {
            var _angle = Math.atan2(_pos_y_relative_center, _pos_x_relative_center);
            while(_angle < 0)
                _angle += 2*Math.PI;
            while(_angle >= 2*Math.PI)
                _angle -= 2*Math.PI;

            _angle *= AscFormat.cToDeg;
            if(_angle >= this.minimalAngle && _angle <= this.maximalAngle)
            {
                this.geometry.gdLst[this.adjastment.gdRefAng]= _angle;
            }
            else if(_angle >= this.maximalAngle)
            {
                this.geometry.gdLst[this.adjastment.gdRefAng] = this.maximalAngle;
            }
            else if(_angle <= this.minimalAngle)
            {
                this.geometry.gdLst[this.adjastment.gdRefAng] = this.minimalAngle;
            }
        }
        this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
    };

    this.trackEnd = function()
    {
        var oGeometryToSet;
        if(!this.bTextWarp)
        {
            oGeometryToSet =  this.originalShape.spPr.geometry;
            if(this.radiusFlag)
            {
                oGeometryToSet.setAdjValue(this.adjastment.gdRefR, this.geometry.gdLst[this.adjastment.gdRefR]+"");
            }
            if(this.angleFlag)
            {
                oGeometryToSet.setAdjValue(this.adjastment.gdRefAng, this.geometry.gdLst[this.adjastment.gdRefAng]+"");
            }

        }
        else
        {
            var new_body_pr = this.originalShape.getBodyPr();
            if (new_body_pr) {
                oGeometryToSet = AscFormat.ExecuteNoHistory(function(){
                    var oGeom = this.geometry.createDuplicate();
                    if(this.radiusFlag)
                    {
                        oGeom.setAdjValue(this.adjastment.gdRefR, this.geometry.gdLst[this.adjastment.gdRefR]+"");
                    }
                    if(this.angleFlag)
                    {
                        oGeom.setAdjValue(this.adjastment.gdRefAng, this.geometry.gdLst[this.adjastment.gdRefAng]+"");
                    }
                    return oGeom;
                }, this, []);

                new_body_pr = new_body_pr.createDuplicate();
                new_body_pr.prstTxWarp = oGeometryToSet;
                if (this.originalShape.bWordShape) {
                    this.originalShape.setBodyPr(new_body_pr);
                }
                else {
                    if (this.originalShape.txBody) {
                        this.originalShape.txBody.setBodyPr(new_body_pr);
                    }
                }
            }

        }
    };
}
PolarAdjustmentTrack.prototype.getBounds = XYAdjustmentTrack.prototype.getBounds;

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].XYAdjustmentTrack = XYAdjustmentTrack;
    window['AscFormat'].PolarAdjustmentTrack = PolarAdjustmentTrack;
})(window);
