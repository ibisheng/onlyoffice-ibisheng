/**
 * Created by Sergey.Luzyanin on 5/11/2017.
 */

(function () {
    function CConnectorTrack(oConnector, oBeginTrack, oEndTrack, oBeginShape, oEndShape){
        this.originalObject = oConnector;
        this.beginTrack = oBeginTrack;
        this.endTrack = oEndTrack;

        this.beginShape = oBeginShape;
        this.endShape = oEndShape;


        this.startX = this.originalObject.transform.TransformPointX(0, 0);
        this.startY = this.originalObject.transform.TransformPointY(0, 0);

        if(this.originalObject.group){
          //  var oInvertTransform = this.originalObject.group.invertTransform;
          //  var _stX =  oInvertTransform.TransformPointX(this.startX, this.startY);
          //  var _stY =  oInvertTransform.TransformPointY(this.startX, this.startY);
          //  this.startX = _stX;
          //  this.startY = _stY;
        }


        this.endX = this.originalObject.transform.TransformPointX(this.originalObject.extX, this.originalObject.extY);
        this.endY = this.originalObject.transform.TransformPointY(this.originalObject.extX, this.originalObject.extY);


        this.oSpPr = AscFormat.ExecuteNoHistory(function () {
            return oConnector.spPr.createDuplicate();
        }, this, []);
        AscFormat.XYAdjustmentTrack.call(this, oConnector, -1, false);

    }
    CConnectorTrack.prototype = Object.create(AscFormat.XYAdjustmentTrack.prototype);
    CConnectorTrack.prototype.track = function()
    {

        var oConnectorInfo = this.originalObject.nvSpPr.nvUniSpPr;
        var _rot, track_bounds, g_conn_info, oConnectionObject, _flipH, _flipV, _bounds, _transform;
        var _startConnectionParams = null;
        var _endConnectionParams = null;
        var _group = null;
        if(this.originalObject.group) {
            _group = this.originalObject.group;
        }
        if(this.beginTrack){
            track_bounds = this.convertTrackBounds(this.beginTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.beginTrack.angle) ? this.beginTrack.angle : this.beginTrack.originalObject.rot;
            _flipH =  AscFormat.isRealBool(this.beginTrack.resizedflipH) ? this.beginTrack.resizedflipH : this.beginTrack.originalObject.flipH;
            _flipV =  AscFormat.isRealBool(this.beginTrack.resizedflipV) ? this.beginTrack.resizedflipV : this.beginTrack.originalObject.flipV;
            if(this.beginTrack.originalObject.group){
                _rot = AscFormat.normalizeRotate(this.beginTrack.originalObject.group.getFullRotate() + _rot);
                if(this.beginTrack.originalObject.group.getFullFlipH()){
                    _flipH = !_flipH;
                }
                if(this.beginTrack.originalObject.group.getFullFlipV()){
                    _flipV = !_flipV;
                }
            }
            _bounds = track_bounds;
            _transform = this.beginTrack.overlayObject.TransformMatrix;
            //if(_group){
            //    _rot = AscFormat.normalizeRotate((this.beginTrack.originalObject.group ? this.beginTrack.originalObject.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
            //    if(_group.getFullFlipH()){
            //        _flipH = !_flipH;
            //    }
            //    if(_group.getFullFlipV()){
            //        _flipV = !_flipV;
            //    }
            //    _bounds = _bounds.copy();
            //    _bounds.transform(_group.invertTransform);
            //    _transform = _transform.CreateDublicate();
            //    AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
            //}
            oConnectionObject = this.beginTrack.overlayObject.geometry.cnxLst[oConnectorInfo.stCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.stCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
            _startConnectionParams = this.originalObject.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
        }
        if(this.endTrack){
            track_bounds = this.convertTrackBounds(this.endTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.endTrack.angle) ? this.endTrack.angle : this.endTrack.originalObject.rot;
            _flipH =  AscFormat.isRealBool(this.endTrack.resizedflipH) ? this.endTrack.resizedflipH : this.endTrack.originalObject.flipH;
            _flipV =  AscFormat.isRealBool(this.endTrack.resizedflipV) ? this.endTrack.resizedflipV : this.endTrack.originalObject.flipV;
            if(this.endTrack.originalObject.group){
                _rot = AscFormat.normalizeRotate(this.endTrack.originalObject.group.getFullRotate() + _rot);
                if(this.endTrack.originalObject.group.getFullFlipH()){
                    _flipH = !_flipH;
                }
                if(this.endTrack.originalObject.group.getFullFlipV()){
                    _flipV = !_flipV;
                }
            }
            _bounds = track_bounds;
            _transform = this.endTrack.overlayObject.TransformMatrix;
            //if(_group){
            //    _rot = AscFormat.normalizeRotate((this.endTrack.originalObject.group ? this.endTrack.originalObject.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
            //    if(_group.getFullFlipH()){
            //        _flipH = !_flipH;
            //    }
            //    if(_group.getFullFlipV()){
            //        _flipV = !_flipV;
            //    }
            //    _bounds = _bounds.copy();
            //    _bounds.transform(_group.invertTransform);
            //    _transform = _transform.CreateDublicate();
            //    AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
            //}
            oConnectionObject = this.endTrack.overlayObject.geometry.cnxLst[oConnectorInfo.endCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.endCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
            _endConnectionParams = this.originalObject.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
        }
        if(_startConnectionParams || _endConnectionParams){
            var bMoveInGroup = false;

            if(!_startConnectionParams){
                if(this.beginShape && oConnectorInfo.stCnxIdx !== null){
                    _startConnectionParams = this.beginShape.getConnectionParams(oConnectorInfo.stCnxIdx, null);
                }
                else{
                    if((this.endTrack instanceof AscFormat.MoveShapeImageTrack)){
                        var _dx,_dy;
                        if(this.originalObject.group){
                            bMoveInGroup = true;
                            var _oCopyMatrix = this.originalObject.group.invertTransform.CreateDublicate();
                            _oCopyMatrix.tx = 0;
                            _oCopyMatrix.ty = 0;
                            _dx = _oCopyMatrix.TransformPointX(this.endTrack.lastDx, this.endTrack.lastDy);
                            _dy = _oCopyMatrix.TransformPointY(this.endTrack.lastDx, this.endTrack.lastDy);
                        }
                        else{
                            _dx = this.endTrack.lastDx;
                            _dy = this.endTrack.lastDy;
                        }
                        this.oSpPr = AscFormat.ExecuteNoHistory(function(){return this.originalObject.spPr.createDuplicate()}, this, []);
                        this.oSpPr.xfrm.offX += _dx;
                        this.oSpPr.xfrm.offY += _dy;
                        this.geometry = this.oSpPr.geometry;
                        this.overlayObject.geometry = this.geometry;
                        this.calculateTransform();
                        return;
                    }
                }
                if(!_startConnectionParams){
                    _startConnectionParams = AscFormat.fCalculateConnectionInfo(_endConnectionParams, this.startX, this.startY);
                }
            }

            if(!_endConnectionParams){
                if(this.endShape && oConnectorInfo.endCnxIdx !== null){
                    _endConnectionParams = this.endShape.getConnectionParams(oConnectorInfo.endCnxIdx, null);
                }
                else{
                    if((this.beginTrack instanceof AscFormat.MoveShapeImageTrack)){
                        var _dx,_dy;
                        if(this.originalObject.group){
                            bMoveInGroup = true;
                             var _oCopyMatrix = this.originalObject.group.invertTransform.CreateDublicate();
                             _oCopyMatrix.tx = 0;
                             _oCopyMatrix.ty = 0;
                            _dx = _oCopyMatrix.TransformPointX(this.beginTrack.lastDx, this.beginTrack.lastDy);
                            _dy = _oCopyMatrix.TransformPointY(this.beginTrack.lastDx, this.beginTrack.lastDy);
                        }
                        else{
                            _dx = this.beginTrack.lastDx;
                            _dy = this.beginTrack.lastDy;
                        }
                        this.oSpPr = AscFormat.ExecuteNoHistory(function(){return this.originalObject.spPr.createDuplicate()}, this, []);
                        this.oSpPr.xfrm.offX += _dx;
                        this.oSpPr.xfrm.offY += _dy;
                        this.geometry = this.oSpPr.geometry;
                        this.overlayObject.geometry = this.geometry;

                        if(!this.originalObject.group || bMoveInGroup){
                            this.oSpPr.xfrm.setOffX(this.oSpPr.xfrm.offX);
                            this.oSpPr.xfrm.setOffY(this.oSpPr.xfrm.offY);
                            this.oSpPr.xfrm.setFlipH(this.oSpPr.xfrm.flipH);
                            this.oSpPr.xfrm.setFlipV(this.oSpPr.xfrm.flipV);
                            this.oSpPr.xfrm.setRot(this.oSpPr.xfrm.rot);
                        }
                        else{

                            var _xc = this.oSpPr.xfrm.offX + this.oSpPr.xfrm.extX / 2.0;
                            var _yc = this.oSpPr.xfrm.offY + this.oSpPr.xfrm.extY / 2.0;
                            var xc = this.originalObject.group.invertTransform.TransformPointX(_xc, _yc);
                            var yc = this.originalObject.group.invertTransform.TransformPointY(_xc, _yc);
                            this.oSpPr.xfrm.setOffX(xc - this.oSpPr.xfrm.extX / 2.0);
                            this.oSpPr.xfrm.setOffY(yc - this.oSpPr.xfrm.extY / 2.0);
                            this.oSpPr.xfrm.setFlipH(this.originalObject.group.getFullFlipH() ? !this.oSpPr.xfrm.flipH : this.oSpPr.xfrm.flipH);
                            this.oSpPr.xfrm.setFlipV(this.originalObject.group.getFullFlipV() ? !this.oSpPr.xfrm.flipV : this.oSpPr.xfrm.flipV);
                            this.oSpPr.xfrm.setRot(AscFormat.normalizeRotate(this.oSpPr.xfrm.rot - this.originalObject.group.getFullRotate()));
                        }

                        this.calculateTransform();
                        return;
                    }
                }
                if(!_endConnectionParams){
                    _endConnectionParams = AscFormat.fCalculateConnectionInfo(_startConnectionParams, this.endX, this.endY);
                }
            }
            this.oSpPr = AscFormat.fCalculateSpPr(_startConnectionParams, _endConnectionParams, this.originalObject.spPr.geometry.preset, this.overlayObject.pen.w);
            if(!this.originalObject.group){
                this.oSpPr.xfrm.setOffX(this.oSpPr.xfrm.offX);
                this.oSpPr.xfrm.setOffY(this.oSpPr.xfrm.offY);
                this.oSpPr.xfrm.setFlipH(this.oSpPr.xfrm.flipH);
                this.oSpPr.xfrm.setFlipV(this.oSpPr.xfrm.flipV);
                this.oSpPr.xfrm.setRot(this.oSpPr.xfrm.rot);
            }
            else{

                var _xc = this.oSpPr.xfrm.offX + this.oSpPr.xfrm.extX / 2.0;
                var _yc = this.oSpPr.xfrm.offY + this.oSpPr.xfrm.extY / 2.0;
                var xc = this.originalObject.group.invertTransform.TransformPointX(_xc, _yc);
                var yc = this.originalObject.group.invertTransform.TransformPointY(_xc, _yc);
                this.oSpPr.xfrm.setOffX(xc - this.oSpPr.xfrm.extX / 2.0);
                this.oSpPr.xfrm.setOffY(yc - this.oSpPr.xfrm.extY / 2.0);
                this.oSpPr.xfrm.setFlipH(this.originalObject.group.getFullFlipH() ? !this.oSpPr.xfrm.flipH : this.oSpPr.xfrm.flipH);
                this.oSpPr.xfrm.setFlipV(this.originalObject.group.getFullFlipV() ? !this.oSpPr.xfrm.flipV : this.oSpPr.xfrm.flipV);
                this.oSpPr.xfrm.setRot(AscFormat.normalizeRotate(this.oSpPr.xfrm.rot - this.originalObject.group.getFullRotate()));
            }

            this.geometry = this.oSpPr.geometry;
            this.overlayObject.geometry = this.geometry;
            this.calculateTransform();
        }


    };

    CConnectorTrack.prototype.calculateTransform = function(){
        this.geometry.Recalculate(this.oSpPr.xfrm.extX, this.oSpPr.xfrm.extY);
        var _transform = this.transform;
        _transform.Reset();

        var _horizontal_center = this.oSpPr.xfrm.extX*0.5;
        var _vertical_center = this.oSpPr.xfrm.extY*0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if(this.oSpPr.xfrm.flipH)
        {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if(this.oSpPr.xfrm.flipV)
        {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -(AscFormat.isRealNumber(this.oSpPr.xfrm.rot) ? this.oSpPr.xfrm.rot : 0 ));
        global_MatrixTransformer.TranslateAppend(_transform, this.oSpPr.xfrm.offX, this.oSpPr.xfrm.offY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if(this.originalObject.group)
        {
            global_MatrixTransformer.MultiplyAppend(_transform, this.originalObject.group.transform);
        }
    };

    CConnectorTrack.prototype.trackEnd = function()
    {
        var _xfrm = this.originalObject.spPr.xfrm;
        var _xfrm2 = this.oSpPr.xfrm;
        _xfrm.setOffX(_xfrm2.offX);
        _xfrm.setOffY(_xfrm2.offY);
        _xfrm.setExtX(_xfrm2.extX);
        _xfrm.setExtY(_xfrm2.extY);
        _xfrm.setFlipH(_xfrm2.flipH);
        _xfrm.setFlipV(_xfrm2.flipV);
        _xfrm.setRot(_xfrm2.rot);
        this.originalObject.spPr.setGeometry(this.oSpPr.geometry.createDuplicate());

        this.originalObject.checkDrawingBaseCoords();
    };
    CConnectorTrack.prototype.convertTrackBounds = function(trackBounds)
    {
        return new AscFormat.CGraphicBounds(trackBounds.min_x, trackBounds.min_y, trackBounds.max_x, trackBounds.max_y);
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CConnectorTrack = CConnectorTrack;
})();
