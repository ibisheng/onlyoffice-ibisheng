/**
 * Created by Sergey.Luzyanin on 5/11/2017.
 */

(function () {
    function CConnectorTrack(oConnector, oBeginTrack, oEndTrack, oBeginShape, oEndShape){
        this.connector = oConnector;
        this.beginTrack = oBeginTrack;
        this.endTrack = oEndTrack;

        this.beginShape = oBeginShape;
        this.endShape = oEndShape;


        this.startX = this.connector.transform.TransformPointX(0, 0);
        this.startY = this.connector.transform.TransformPointY(0, 0);

        if(this.connector.group){
            var oInvertTransform = this.connector.group.invertTransform;
            var _stX =  oInvertTransform.TransformPointX(this.startX, this.startY);
            var _stY =  oInvertTransform.TransformPointY(this.startX, this.startY);
            this.startX = _stX;
            this.startY = _stY;
        }


        this.endX = this.connector.transform.TransformPointX(this.connector.extX, this.connector.extY);
        this.endY = this.connector.transform.TransformPointY(this.connector.extX, this.connector.extY);


        this.oSpPr = AscFormat.ExecuteNoHistory(function () {
            return oConnector.spPr.createDuplicate();
        }, this, []);
        AscFormat.XYAdjustmentTrack.call(this, oConnector, -1, false);

    }
    CConnectorTrack.prototype = Object.create(AscFormat.XYAdjustmentTrack.prototype);
    CConnectorTrack.prototype.track = function()
    {

        var oConnectorInfo = this.connector.nvSpPr.nvUniSpPr;
        var _rot, track_bounds, g_conn_info, oConnectionObject, _flipH, _flipV, _bounds, _transform;
        var _startConnectionParams = null;
        var _endConnectionParams = null;
        var _group = null;
        if(this.connector.group) {
            _group = this.connector.group;
        }
        if(this.beginTrack){
            track_bounds = this.convertTrackBounds(this.beginTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.beginTrack.angle) ? this.beginTrack.angle : this.beginTrack.originalObject.rot;
            _flipH =  AscFormat.isRealBool(this.beginTrack.resizedflipH) ? this.beginTrack.resizedflipH : this.beginTrack.originalObject.flipH;
            _flipV =  AscFormat.isRealBool(this.beginTrack.resizedflipV) ? this.beginTrack.resizedflipV : this.beginTrack.originalObject.flipV;
            _bounds = track_bounds;
            _transform = this.beginTrack.overlayObject.TransformMatrix;
            if(_group){
                _rot = AscFormat.normalizeRotate((this.beginTrack.originalObject.group ? this.beginTrack.originalObject.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
                if(_group.getFullFlipH()){
                    _flipH = !_flipH;
                }
                if(_group.getFullFlipV()){
                    _flipV = !_flipV;
                }
                _bounds = _bounds.copy();
                _bounds.transform(_group.invertTransform);
                _transform = _transform.CreateDublicate();
                AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
            }
            oConnectionObject = this.beginTrack.overlayObject.geometry.cnxLst[oConnectorInfo.stCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.stCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
            _startConnectionParams = this.connector.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
        }
        if(this.endTrack){
            track_bounds = this.convertTrackBounds(this.endTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.endTrack.angle) ? this.endTrack.angle : this.endTrack.originalObject.rot;
            _flipH =  AscFormat.isRealBool(this.endTrack.resizedflipH) ? this.endTrack.resizedflipH : this.endTrack.originalObject.flipH;
            _flipV =  AscFormat.isRealBool(this.endTrack.resizedflipV) ? this.endTrack.resizedflipV : this.endTrack.originalObject.flipV;
            _bounds = track_bounds;
            _transform = this.endTrack.overlayObject.TransformMatrix;
            if(_group){
                _rot = AscFormat.normalizeRotate((this.endTrack.originalObject.group ? this.endTrack.originalObject.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
                if(_group.getFullFlipH()){
                    _flipH = !_flipH;
                }
                if(_group.getFullFlipV()){
                    _flipV = !_flipV;
                }
                _bounds = _bounds.copy();
                _bounds.transform(_group.invertTransform);
                _transform = _transform.CreateDublicate();
                AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
            }
            oConnectionObject = this.endTrack.overlayObject.geometry.cnxLst[oConnectorInfo.endCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.endCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
            _endConnectionParams = this.connector.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
        }
        if(_startConnectionParams || _endConnectionParams){

            if(!_startConnectionParams){
                if(this.beginShape && oConnectorInfo.stCnxIdx !== null){
                    oConnectionObject = this.beginShape.getGeom().cnxLst[oConnectorInfo.stCnxIdx];
                    g_conn_info =  {idx: oConnectorInfo.stCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
                    _rot = this.beginShape.rot;
                    _flipH =  this.beginShape.flipH;
                    _flipV =  this.beginShape.flipV;
                    _bounds = this.beginShape.bounds;
                    _transform = this.beginShape.transform;
                    
                    if(_group){
                        _rot = AscFormat.normalizeRotate((this.beginShape.group ? this.beginShape.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
                        if(_group.getFullFlipH()){
                            _flipH = !_flipH;
                        }
                        if(_group.getFullFlipV()){
                            _flipV = !_flipV;
                        }
                        _bounds = _bounds.copy();
                        _bounds.transform(_group.invertTransform);
                        _transform = _transform.CreateDublicate();
                        AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
                    }
                    _startConnectionParams = this.beginShape.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
                }
                else{
                    _startConnectionParams = AscFormat.fCalculateConnectionInfo(_endConnectionParams, this.startX, this.startY);
                }

            }

            if(!_endConnectionParams){
                if(this.endShape && oConnectorInfo.endCnxIdx !== null){
                    oConnectionObject = this.endShape.getGeom().cnxLst[oConnectorInfo.endCnxIdx];
                    g_conn_info =  {idx: oConnectorInfo.endCnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
                    _rot = this.endShape.rot;
                    _flipH =  this.endShape.flipH;
                    _flipV =  this.endShape.flipV;
                    _bounds = this.endShape.bounds;
                    _transform = this.endShape.transform;
                    if(_group){
                        _rot = AscFormat.normalizeRotate((this.endShape.group ? this.endShape.group.getFullRotate() : 0) +  _rot - _group.getFullRotate());
                        if(_group.getFullFlipH()){
                            _flipH = !_flipH;
                        }
                        if(_group.getFullFlipV()){
                            _flipV = !_flipV;
                        }
                        _bounds = _bounds.copy();
                        _bounds.transform(_group.invertTransform);
                        _transform = _transform.CreateDublicate();
                        AscCommon.global_MatrixTransformer.MultiplyAppend(_transform, _group.invertTransform);
                    }
                    _endConnectionParams = this.endShape.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
                }
                else {
                    _endConnectionParams = AscFormat.fCalculateConnectionInfo(_startConnectionParams, this.endX, this.endY);
                }
            }
            this.oSpPr = AscFormat.fCalculateSpPr(_startConnectionParams, _endConnectionParams, this.connector.spPr.geometry.preset, this.overlayObject.pen.w);
            this.geometry = this.oSpPr.geometry;
            this.overlayObject.geometry = this.geometry;
        }
        this.geometry.Recalculate(this.oSpPr.xfrm.extX, this.oSpPr.xfrm.extY);

        _transform = this.transform;
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
        if(this.connector.group)
        {
            global_MatrixTransformer.MultiplyAppend(_transform, this.connector.group.transform);
        }

    };

    CConnectorTrack.prototype.trackEnd = function()
    {
        var _xfrm = this.connector.spPr.xfrm;
        var _xfrm2 = this.oSpPr.xfrm;
        _xfrm.setOffX(_xfrm2.offX);
        _xfrm.setOffY(_xfrm2.offY);
        _xfrm.setExtX(_xfrm2.extX);
        _xfrm.setExtY(_xfrm2.extY);
        _xfrm.setFlipH(_xfrm2.flipH);
        _xfrm.setFlipV(_xfrm2.flipV);
        _xfrm.setRot(_xfrm2.rot);
        this.connector.spPr.setGeometry(this.oSpPr.geometry.createDuplicate());

        this.connector.checkDrawingBaseCoords();
    };
    CConnectorTrack.prototype.convertTrackBounds = function(trackBounds)
    {
        return new AscFormat.CGraphicBounds(trackBounds.min_x, trackBounds.min_y, trackBounds.max_x, trackBounds.max_y);
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CConnectorTrack = CConnectorTrack;
})();
