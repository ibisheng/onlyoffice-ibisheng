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
        var _rot, track_bounds, g_conn_info, oConectionObject;
        var _startConnectionParams = null;
        var _endConnectionParams = null;
        if(this.beginTrack){
            track_bounds = this.convertTrackBounds(this.beginTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.beginTrack.angle) ? this.beginTrack.angle : this.beginTrack.originalObject.rot;
            oConectionObject = this.beginTrack.overlayObject.geometry.cnxLst[oConnectorInfo.stCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.stCnxIdx, ang: oConectionObject.ang, x: oConectionObject.x, y: oConectionObject.y};
            _startConnectionParams = this.connector.convertToConnectionParams(_rot, this.beginTrack.overlayObject.TransformMatrix, track_bounds, g_conn_info)
        }
        if(this.endTrack){
            track_bounds = this.convertTrackBounds(this.endTrack.getBounds());
            _rot = AscFormat.isRealNumber(this.endTrack.angle) ? this.endTrack.angle : this.endTrack.originalObject.rot;
            oConectionObject = this.endTrack.overlayObject.geometry.cnxLst[oConnectorInfo.endCnxIdx];
            g_conn_info =  {idx: oConnectorInfo.endCnxIdx, ang: oConectionObject.ang, x: oConectionObject.x, y: oConectionObject.y};
            _endConnectionParams = this.connector.convertToConnectionParams(_rot, this.endTrack.overlayObject.TransformMatrix, track_bounds, g_conn_info)
        }
        if(_startConnectionParams || _endConnectionParams){

            if(!_startConnectionParams){
                if(this.beginShape && oConnectorInfo.stCnxIdx !== null){
                    oConectionObject = this.beginShape.spPr.geometry.cnxLst[oConnectorInfo.stCnxIdx];
                    g_conn_info =  {idx: oConnectorInfo.stCnxIdx, ang: oConectionObject.ang, x: oConectionObject.x, y: oConectionObject.y};
                    _startConnectionParams = this.beginShape.convertToConnectionParams(this.beginShape.rot, this.beginShape.transform, this.beginShape.bounds, g_conn_info);
                }
                else{
                    _startConnectionParams = AscFormat.fCalculateConnectionInfo(_endConnectionParams, this.startX, this.startY);
                }

            }

            if(!_endConnectionParams){
                if(this.endShape && oConnectorInfo.endCnxIdx !== null){
                    oConectionObject = this.endShape.spPr.geometry.cnxLst[oConnectorInfo.endCnxIdx];
                    g_conn_info =  {idx: oConnectorInfo.endCnxIdx, ang: oConectionObject.ang, x: oConectionObject.x, y: oConectionObject.y};
                    _endConnectionParams = this.endShape.convertToConnectionParams(this.endShape.rot, this.endShape.transform, this.endShape.bounds, g_conn_info);
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
    };
    CConnectorTrack.prototype.convertTrackBounds = function(trackBounds)
    {
        return new AscFormat.CGraphicBounds(trackBounds.min_x, trackBounds.min_y, trackBounds.max_x, trackBounds.max_y);
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CConnectorTrack = CConnectorTrack;
})();
