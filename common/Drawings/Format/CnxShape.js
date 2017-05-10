/**
 * Created by Sergey.Luzyanin on 4/25/2017.
 */
(function(undefined){


    var CONNECTOR_MARGIN = 6.35;

    /**
    * @constructor
    * */
    function ConnectionParams(){
        this.bounds = new AscFormat.CGraphicBounds(0, 0, 0, 0);
        this.dir = AscFormat.CARD_DIRECTION_E;
        this.x = 0;
        this.y = 0;
    }
    ConnectionParams.prototype.copy = function(){
        var _c = new ConnectionParams();
        _c.bounds.fromOther(this.bounds);
        _c.dir = this.dir;
        _c.x = this.x;
        _c.y = this.y;
        return _c;
    };
    ConnectionParams.prototype.transform = function(oTransform){
        this.bounds.transform(oTransform);
        //this.dir = AscFormat.CARD_DIRECTION_E;
        var _x = oTransform.TransformPointX(this.x, this.y);
        var _y = oTransform.TransformPointY(this.x, this.y);
        this.x = _x;
        this.y = _y;
    };

    function fCalculateSpPr(begin, end, sPreset){
        return AscFormat.ExecuteNoHistory(function(){
            var oSpPr = new AscFormat.CSpPr();
            var oXfrm = new AscFormat.CXfrm();
            oSpPr.setXfrm(oXfrm);
            oXfrm.setParent(oSpPr);

            var _begin = begin.copy();
            var _end = end.copy();
            var fAngle = 0;

            switch(begin.dir){
                case AscFormat.CARD_DIRECTION_N:{
                    fAngle = Math.PI/2;
                    switch(_end.dir){
                        case AscFormat.CARD_DIRECTION_N:{
                            _end.dir = AscFormat.CARD_DIRECTION_E;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_S:{
                            _end.dir = AscFormat.CARD_DIRECTION_W;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_W:{
                            _end.dir = AscFormat.CARD_DIRECTION_N;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_E:{
                            _end.dir = AscFormat.CARD_DIRECTION_S;
                            break;
                        }
                    }
                    break;
                }
                case AscFormat.CARD_DIRECTION_S:{
                    fAngle = -Math.PI/2;
                    switch(_end.dir){
                        case AscFormat.CARD_DIRECTION_N:{
                            _end.dir = AscFormat.CARD_DIRECTION_W;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_S:{
                            _end.dir = AscFormat.CARD_DIRECTION_E;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_W:{
                            _end.dir = AscFormat.CARD_DIRECTION_S;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_E:{
                            _end.dir = AscFormat.CARD_DIRECTION_N;
                            break;
                        }
                    }
                    break;
                }
                case AscFormat.CARD_DIRECTION_W:{
                    fAngle = Math.PI;
                    switch(_end.dir){
                        case AscFormat.CARD_DIRECTION_N:{
                            _end.dir = AscFormat.CARD_DIRECTION_S;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_S:{
                            _end.dir = AscFormat.CARD_DIRECTION_N;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_W:{
                            _end.dir = AscFormat.CARD_DIRECTION_E;
                            break;
                        }
                        case AscFormat.CARD_DIRECTION_E:{
                            _end.dir = AscFormat.CARD_DIRECTION_W;
                            break;
                        }
                    }
                    break;
                }
                default:{
                    //East is default direction
                    fAngle = 0;
                    break;
                }
            }

            var oTransform = new AscCommon.CMatrix();
            oTransform.Rotate(fAngle, AscCommon.MATRIX_ORDER_APPEND);
            _begin.transform(oTransform);
            _end.transform(oTransform);

            var posX = Math.min(_begin.x, _end.x);
            var posY = Math.min(_begin.y, _end.y);
            var extX = Math.abs(_end.x - _begin.x);
            var extY = Math.abs(_end.y - _begin.y);
            var flipV = false;
            var flipH = false;
            var rot = 0;
            var oMapAdj = {};
            var tmp;
            var xc = posX + extX/2, yc = posY + extY/2;
            if(sPreset === "line"){

            }
            else if(sPreset.indexOf("curvedConnector") > 0){

            }
            else{
                //returns "bentConnector" by default
                switch(_end.dir){
                    case AscFormat.CARD_DIRECTION_N:{

                        if(_end.bounds.l > _begin.bounds.r){
                            if(_end.y <= _begin.y){
                                sPreset = "bentConnector4";
                                rot = 3.0*Math.PI/2.0;
                                tmp = extX;
                                extX = extY;
                                extY = tmp;
                                posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                flipH = true;
                                flipV = true;
                                oMapAdj["adj2"] = 100000 - (100000*(((_begin.bounds.r + _end.bounds.l)/2 - (xc - extY/2))/extY) + 0.5) >> 0;
                                oMapAdj["adj1"] = (-100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0;
                            }
                            else{
                                sPreset = "bentConnector2";
                                rot = 3.0*Math.PI/2.0;
                                tmp = extX;
                                extX = extY;
                                extY = tmp;
                                posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                flipV = true;
                            }
                        }
                        else{
                            if(_end.y <= _begin.bounds.b){
                                if(_end.y <= _begin.y){
                                    sPreset = "bentConnector4";
                                    rot = 3.0*Math.PI/2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                    flipH = true;
                                    oMapAdj["adj1"] = -((100000*((yc - extX/2 - (Math.min(_end.bounds.t, _begin.bounds.t) - CONNECTOR_MARGIN))/extX) + 0.5) >> 0);
                                    oMapAdj["adj2"] = 100000 + (100000*(Math.max(CONNECTOR_MARGIN, _end.bounds.r + CONNECTOR_MARGIN - _begin.x)/extY) + 0.5) >> 0;
                                }
                                else{
                                    sPreset = "bentConnector4";
                                    rot = Math.PI/2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                    flipH = true;
                                    flipV = true;
                                    oMapAdj["adj1"] = 100000 + ((100000*((yc - extX/2 - (Math.min(_end.bounds.t, _begin.bounds.t) - CONNECTOR_MARGIN))/extX) + 0.5) >> 0);
                                    oMapAdj["adj2"] = 100000 + (100000*(Math.max(CONNECTOR_MARGIN, _end.bounds.r + CONNECTOR_MARGIN - _begin.x)/extY) + 0.5) >> 0;
                                }

                            }
                            else{
                                sPreset = "bentConnector4";
                                rot = Math.PI/2.0;
                                tmp = extX;
                                extX = extY;
                                extY = tmp;
                                posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                flipH = true;
                                flipV = true;
                                oMapAdj["adj1"] = ((100000*(_end.y - (_end.bounds.t + _begin.bounds.b)/2)/extX) + 0.5) >> 0;
                                oMapAdj["adj2"] = 100000 + (100000*(CONNECTOR_MARGIN/extY) + 0.5) >> 0;
                            }
                        }
                        break;
                    }
                    case AscFormat.CARD_DIRECTION_S:{
                        if(_end.bounds.l > _begin.bounds.r){
                            if(_end.bounds.b < _begin.y){
                                sPreset = "bentConnector2";
                                rot = Math.PI/2.0;
                                tmp = extX;
                                extX = extY;
                                extY = tmp;
                                posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                            }
                            else{
                                sPreset = "bentConnector4";
                                rot = Math.PI / 2.0;
                                tmp = extX;
                                extX = extY;
                                extY = tmp;
                                posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                flipH = true;
                                oMapAdj["adj1"] = (-100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0;
                                oMapAdj["adj2"] = 100000 - (100000*(((_begin.bounds.r + _end.bounds.l)/2 - (xc - extY/2))/extY) + 0.5) >> 0;
                            }
                        }
                        else{
                            if(_end.bounds.b < _begin.bounds.t){

                                if(_end.x > _begin.bounds.r){
                                    sPreset = "bentConnector2";
                                    rot = Math.PI/2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                }
                                else{
                                    sPreset = "bentConnector4";
                                    rot = 3.0 * Math.PI / 2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                    flipH = true;

                                    oMapAdj["adj1"] = (100000*(((_begin.bounds.t + _end.bounds.b)/2 - (yc - extX/2))/extX) + 0.5) >> 0;
                                    oMapAdj["adj2"] = 100000 + (100000*(Math.max(CONNECTOR_MARGIN, _end.bounds.r + CONNECTOR_MARGIN - _begin.x)/extY) + 0.5) >> 0;
                                }
                            }
                            else{

                                if(_end.x < _begin.x){
                                    sPreset = "bentConnector4";
                                    rot =  Math.PI / 2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                    flipH = true;
                                    flipV = true;

                                    oMapAdj["adj1"] = -((100000*(Math.max(_begin.bounds.b, _end.bounds.b) + CONNECTOR_MARGIN - _end.y)/extX + 0.5) >> 0);
                                    oMapAdj["adj2"] = 100000 + (100000*(Math.max(CONNECTOR_MARGIN, _end.bounds.r + CONNECTOR_MARGIN - _begin.x)/extY) + 0.5) >> 0;
                                }
                                else{
                                    sPreset = "bentConnector4";
                                    rot =  Math.PI / 2.0;
                                    tmp = extX;
                                    extX = extY;
                                    extY = tmp;
                                    posX = (_end.x + _begin.x)/2.0 - extX/2.0;
                                    posY = (_end.y + _begin.y)/2.0 - extY/2.0;
                                    flipH = true;

                                    oMapAdj["adj1"] = -((100000*(Math.max(_begin.bounds.b, _end.bounds.b) + CONNECTOR_MARGIN - _end.y)/extX + 0.5) >> 0);
                                    oMapAdj["adj2"] = -(100000*(Math.max(CONNECTOR_MARGIN, _end.bounds.r + CONNECTOR_MARGIN - _begin.x)/extY) + 0.5) >> 0;
                                }
                            }
                        }
                        break;
                    }
                    case AscFormat.CARD_DIRECTION_W:{

                        if(_begin.x < _end.x){
                            sPreset = "bentConnector3";
                            flipV = _begin.y > _end.y;
                        }
                        else{
                            sPreset = "bentConnector5";
                            rot = Math.PI;
                            flipH = true;
                            oMapAdj["adj3"] = (100000 + 100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0;
                            var leftX =_end.x - Math.min(_begin.bounds.l, _end.bounds.l) + CONNECTOR_MARGIN;
                            oMapAdj["adj1"] = (-100000*(leftX/extX) + 0.5) >> 0;
                            if(_end.bounds.b < _begin.bounds.t || _end.bounds.t > _begin.bounds.b){
                                if(_end.bounds.b < _begin.bounds.t){
                                    flipV = true;
                                    oMapAdj["adj2"] = (100000*(((_begin.bounds.t + _end.bounds.b)/2 - posY)/extY) + 0.5) >> 0;
                                }
                                else{
                                    oMapAdj["adj2"] = (100000*(((_end.bounds.t + _begin.bounds.b)/2 - posY)/extY) + 0.5) >> 0;
                                }
                            }
                            else{
                                if(_end.y < _begin.y){
                                    flipV = true;
                                    oMapAdj["adj2"] = (100000*((Math.max(_begin.bounds.b, _end.bounds.b) + CONNECTOR_MARGIN - posY)/extY) + 0.5) >> 0;
                                }
                                else{
                                    oMapAdj["adj2"] = 100000 - (100000*((Math.min(_begin.bounds.t, _end.bounds.t) - CONNECTOR_MARGIN - posY)/extY) + 0.5) >> 0;
                                }
                            }
                        }
                        break;
                    }
                    case AscFormat.CARD_DIRECTION_E:{
                        if(_end.bounds.l > _begin.bounds.r){
                            if(_end.bounds.b < _begin.y){
                                sPreset = "bentConnector3";
                                flipH = true;
                                oMapAdj["adj1"] = -(100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0
                            }
                            else{
                                if(_end.y < _begin.y){
                                    sPreset = "bentConnector5";
                                    flipH = true;
                                    oMapAdj["adj1"] = -(100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0;
                                    oMapAdj["adj2"] = -(100000*(CONNECTOR_MARGIN/extX) + 0.5) >> 0;
                                    oMapAdj["adj3"] = (100000 - (100000*(CONNECTOR_MARGIN/extX) + 0.5)) >> 0;
                                }
                            }
                        }
                        break;
                    }
                }
            }

            var oGeometry = AscFormat.CreateGeometry(sPreset);
            for(var key in oMapAdj){
                if(oMapAdj.hasOwnProperty(key)){
                    oGeometry.setAdjValue(key, oMapAdj[key]);
                }
            }
            oSpPr.setGeometry(oGeometry);
            oGeometry.setParent(oSpPr);
            oXfrm.setOffX(posX);
            oXfrm.setOffY(posY);
            oXfrm.setExtX(extX);
            oXfrm.setExtY(extY);
            oXfrm.setRot(rot);
            oXfrm.setFlipH(flipH);
            oXfrm.setFlipV(flipV);
            return oSpPr;

        }, this, []);
    }


    function fCalculateConnectionInfo(oConnInfo, x, y) {

        var oConnecInfo2 = new ConnectionParams();
        oConnecInfo2.x = x;
        oConnecInfo2.y = y;
        oConnecInfo2.bounds.fromOther(new AscFormat.CGraphicBounds(x, y, x, y));

        var diffX = x - oConnInfo.x;
        var diffY = y - oConnInfo.y;

        if(Math.abs(diffX) > Math.abs(diffY)){
            if(diffX < 0){
                oConnecInfo2.dir = AscFormat.CARD_DIRECTION_E;
            }
            else{
                oConnecInfo2.dir = AscFormat.CARD_DIRECTION_W;
            }
        }
        else{
            if(diffY < 0){
                oConnecInfo2.dir = AscFormat.CARD_DIRECTION_S;
            }
            else{
                oConnecInfo2.dir = AscFormat.CARD_DIRECTION_N;
            }
        }
        return oConnecInfo2;
    }

    function CConnectionShape() {
        AscFormat.CShape.call(this);
    }
    CConnectionShape.prototype = Object.create(AscFormat.CShape.prototype);
    CConnectionShape.prototype.constructor = CConnectionShape;

    CConnectionShape.prototype.calculateSpPr = function(begin, end){
    };

    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].fCalculateSpPr = fCalculateSpPr;
    window['AscFormat'].fCalculateConnectionInfo = fCalculateConnectionInfo;
    window['AscFormat'].ConnectionParams = ConnectionParams;
})();