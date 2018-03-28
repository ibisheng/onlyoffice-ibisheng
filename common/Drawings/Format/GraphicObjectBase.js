/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

/**
 * @param {Window} window
 * @param {undefined} undefined
 */
(function (window, undefined) {



    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetLocks] = AscDFH.CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetDrawingBaseType] = AscDFH.CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetWorksheet] = AscDFH.CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeSetBDeleted] = AscDFH.CChangesDrawingsBool;



    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetDrawingBasePos] = AscDFH.CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetDrawingBaseExt] = AscDFH.CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors] = AscDFH.CChangesDrawingsObjectNoId;


    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;

    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetLocks] = function(oClass, value){oClass.locks = value;};
    drawingsChangesMap[AscDFH.historyitem_ShapeSetBDeleted] = function(oClass, value){oClass.bDeleted = value;};
    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetDrawingBaseType] = function(oClass, value){
        if(oClass.drawingBase){
            oClass.drawingBase.Type = value;
        }
    };

    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetWorksheet] = function(oClass, value){
        if(typeof value === "string"){
            var oApi = window['Asc'] && window['Asc']['editor'];
            if(oApi && oApi.wbModel){
                oClass.worksheet = oApi.wbModel.getWorksheetById(value);
            }
            else{
                oClass.worksheet = null;
            }
        }
        else{
            oClass.worksheet = null;
        }
    };


    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetDrawingBasePos] = function(oClass, value){
        if(value){
            if(oClass.drawingBase && oClass.drawingBase.Pos){
                oClass.drawingBase.Pos.X = value.a;
                oClass.drawingBase.Pos.Y = value.b;
            }
        }
    };

    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetDrawingBaseExt] = function(oClass, value){
        if(value){
            if(oClass.drawingBase && oClass.drawingBase.ext){
                oClass.drawingBase.ext.cx = value.a;
                oClass.drawingBase.ext.cy = value.b;
            }
        }
    };
    drawingsChangesMap[AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors] = function(oClass, value){
        if(value){
            if(oClass.drawingBase){
                oClass.drawingBase.from.col = value.fromCol;
                oClass.drawingBase.from.colOff = value.fromColOff;
                oClass.drawingBase.from.row = value.fromRow;
                oClass.drawingBase.from.rowOff = value.fromRowOff;
                oClass.drawingBase.to.col = value.toCol;
                oClass.drawingBase.to.colOff = value.toColOff;
                oClass.drawingBase.to.row = value.toRow;
                oClass.drawingBase.to.rowOff = value.toRowOff;
                oClass.drawingBase.Pos.X = value.posX;
                oClass.drawingBase.Pos.Y = value.posY;
                oClass.drawingBase.ext.cx = value.cx ;
                oClass.drawingBase.ext.cy = value.cy ;
            }
        }
    };

    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_AutoShapes_SetDrawingBasePos] = CDrawingBaseCoordsWritable;
    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_AutoShapes_SetDrawingBaseExt] = CDrawingBaseCoordsWritable;
    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors] = CDrawingBasePosWritable;

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


    function CDrawingBaseCoordsWritable(a, b){
        this.a = a;
        this.b = b;
    }

    CDrawingBaseCoordsWritable.prototype.Write_ToBinary = function(Writer){
        Writer.WriteDouble(this.a);
        Writer.WriteDouble(this.b);
    };

    CDrawingBaseCoordsWritable.prototype.Read_FromBinary = function(Reader){
        this.a = Reader.GetDouble();
        this.b = Reader.GetDouble();
    };

    window['AscFormat'].CDrawingBaseCoordsWritable = CDrawingBaseCoordsWritable;

    function CDrawingBasePosWritable(oObject){

            this.fromCol       = null;
            this.fromColOff    = null;
            this.fromRow       = null;
            this.fromRowOff    = null;
            this.toCol         = null;
            this.toColOff      = null;
            this.toRow         = null;
            this.toRowOff      = null;
            this.posX          = null;
            this.posY          = null;
            this.cx            = null;
            this.cy            = null;
            if(oObject){
                this.fromCol       = oObject.fromCol   ;
                this.fromColOff    = oObject.fromColOff;
                this.fromRow       = oObject.fromRow   ;
                this.fromRowOff    = oObject.fromRowOff;
                this.toCol         = oObject.toCol     ;
                this.toColOff      = oObject.toColOff  ;
                this.toRow         = oObject.toRow     ;
                this.toRowOff      = oObject.toRowOff  ;
                this.posX          = oObject.posX      ;
                this.posY          = oObject.posY      ;
                this.cx            = oObject.cx        ;
                this.cy            = oObject.cy        ;
            }
    }

    CDrawingBasePosWritable.prototype.Write_ToBinary = function(Writer){
        AscFormat.writeDouble(Writer, this.fromCol      );
        AscFormat.writeDouble(Writer, this.fromColOff   );
        AscFormat.writeDouble(Writer, this.fromRow      );
        AscFormat.writeDouble(Writer, this.fromRowOff   );
        AscFormat.writeDouble(Writer, this.toCol        );
        AscFormat.writeDouble(Writer, this.toColOff     );
        AscFormat.writeDouble(Writer, this.toRow        );
        AscFormat.writeDouble(Writer, this.toRowOff     );
        AscFormat.writeDouble(Writer, this.posX         );
        AscFormat.writeDouble(Writer, this.posY         );
        AscFormat.writeDouble(Writer, this.cx           );
        AscFormat.writeDouble(Writer, this.cy           );
    };
    CDrawingBasePosWritable.prototype.Read_FromBinary = function(Reader){
        this.fromCol      = AscFormat.readDouble(Reader);
        this.fromColOff   = AscFormat.readDouble(Reader);
        this.fromRow      = AscFormat.readDouble(Reader);
        this.fromRowOff   = AscFormat.readDouble(Reader);
        this.toCol        = AscFormat.readDouble(Reader);
        this.toColOff     = AscFormat.readDouble(Reader);
        this.toRow        = AscFormat.readDouble(Reader);
        this.toRowOff     = AscFormat.readDouble(Reader);
        this.posX         = AscFormat.readDouble(Reader);
        this.posY         = AscFormat.readDouble(Reader);
        this.cx           = AscFormat.readDouble(Reader);
        this.cy           = AscFormat.readDouble(Reader);
    };
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

    CGraphicBounds.prototype.fromOther = function(oBounds){
        this.l = oBounds.l;
        this.t = oBounds.t;
        this.r = oBounds.r;
        this.b = oBounds.b;

        this.x = oBounds.x;
        this.y = oBounds.y;
        this.w = oBounds.w;
        this.h = oBounds.h;
    };
    CGraphicBounds.prototype.copy = function(){
        return new CGraphicBounds(this.l, this.t, this.r, this.b);
    };
    CGraphicBounds.prototype.transform = function(oTransform){

        var xlt = oTransform.TransformPointX(this.l, this.t);
        var ylt = oTransform.TransformPointY(this.l, this.t);

        var xrt = oTransform.TransformPointX(this.r, this.t);
        var yrt = oTransform.TransformPointY(this.r, this.t);
        var xlb = oTransform.TransformPointX(this.l, this.b);
        var ylb = oTransform.TransformPointY(this.l, this.b);

        var xrb = oTransform.TransformPointX(this.r, this.b);
        var yrb = oTransform.TransformPointY(this.r, this.b);

        this.l = Math.min(xlb, xlt, xrb, xrt);
        this.t = Math.min(ylb, ylt, yrb, yrt);

        this.r = Math.max(xlb, xlt, xrb, xrt);
        this.b = Math.max(ylb, ylt, yrb, yrt);

        this.x = this.l;
        this.y = this.t;
        this.w = this.r - this.l;
        this.h = this.b - this.t;
    };

    CGraphicBounds.prototype.checkByOther = function(oBounds){
        if(oBounds){
            if(oBounds.l < this.l){
                this.l = oBounds.l;
            }
            if(oBounds.t < this.t){
                this.t = oBounds.t;
            }
            if(oBounds.r > this.r){
                this.r = oBounds.r;
            }
            if(oBounds.b > this.b){
                this.b = oBounds.b;
            }
        }
    };
    CGraphicBounds.prototype.checkWH = function(){

        this.x = this.l;
        this.y = this.t;
        this.w = this.r - this.l;
        this.h = this.b - this.t;
    };
    CGraphicBounds.prototype.reset = function(l, t, r, b){

        this.l = l;
        this.t = t;
        this.r = r;
        this.b = b;

        this.x = l;
        this.y = t;
        this.w = r - l;
        this.h = b - t;
    };

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
        AscCommon.History.Add( new AscDFH.CChangesDrawingsLong(this, AscDFH.historyitem_AutoShapes_SetLocks, this.locks, nLocks));
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
                blip_fill.setRasterImageId(mapUrl[this.spPr.Fill.fill.RasterImageId]);
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

    CGraphicObjectBase.prototype.getAllFonts = function(mapUrl){
    };


    CGraphicObjectBase.prototype.getAllRasterImages = function(mapUrl){
    };

    CGraphicObjectBase.prototype.checkCorrect = function(){
        if(this.bDeleted === true){
            return false;
        }
        return this.checkTypeCorrect();
    };


    CGraphicObjectBase.prototype.CheckCorrect = function(){
        return this.checkCorrect();
    };

    CGraphicObjectBase.prototype.checkTypeCorrect = function(){
        return true;
    };

    CGraphicObjectBase.prototype.setDrawingBaseType = function(nType){
        if(this.drawingBase){
            History.Add(new AscDFH.CChangesDrawingsLong(this, AscDFH.historyitem_AutoShapes_SetDrawingBaseType, this.drawingBase.Type, nType));
            this.drawingBase.Type = nType;
        }
    };
    CGraphicObjectBase.prototype.setDrawingBasePos = function(fPosX, fPosY){
        if(this.drawingBase && this.drawingBase.Pos){
            History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AutoShapes_SetDrawingBasePos, new CDrawingBaseCoordsWritable(this.drawingBase.Pos.X, this.drawingBase.Pos.Y), new CDrawingBaseCoordsWritable(fPosX, fPosY)));
            this.drawingBase.Pos.X = fPosX;
            this.drawingBase.Pos.Y = fPosY;
        }
    };
    CGraphicObjectBase.prototype.setDrawingBaseExt = function(fExtX, fExtY){
        if(this.drawingBase && this.drawingBase.ext){
            History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AutoShapes_SetDrawingBaseExt, new CDrawingBaseCoordsWritable(this.drawingBase.ext.cx, this.drawingBase.ext.cy), new CDrawingBaseCoordsWritable(fExtX, fExtY)));
            this.drawingBase.ext.cx = fExtX;
            this.drawingBase.ext.cy = fExtY;
        }
    };



    CGraphicObjectBase.prototype.checkDrawingBaseCoords = function()
    {
        if(this.drawingBase && this.spPr && this.spPr.xfrm && !this.group) {
            var oldX = this.x, oldY = this.y, oldExtX = this.extX, oldExtY = this.extY;
            var oldRot = this.rot;
            this.x = this.spPr.xfrm.offX;
            this.y = this.spPr.xfrm.offY;
            this.extX = this.spPr.xfrm.extX;
            this.extY = this.spPr.xfrm.extY;
            this.rot = AscFormat.isRealNumber(this.spPr.xfrm.rot) ? AscFormat.normalizeRotate(this.spPr.xfrm.rot) : 0;

            var oldFromCol = this.drawingBase.from.col,
                oldFromColOff = this.drawingBase.from.colOff,
                oldFromRow = this.drawingBase.from.row,
                oldFromRowOff = this.drawingBase.from.rowOff,
                oldToCol = this.drawingBase.to.col,
                oldToColOff = this.drawingBase.to.colOff,
                oldToRow = this.drawingBase.to.row,
                oldToRowOff = this.drawingBase.to.rowOff,
                oldPosX = this.drawingBase.Pos.X,
                oldPosY = this.drawingBase.Pos.Y,
                oldCx = this.drawingBase.ext.cx,
                oldCy = this.drawingBase.ext.cy;


            this.drawingBase.setGraphicObjectCoords();
            this.x = oldX;
            this.y = oldY;
            this.extX = oldExtX;
            this.extY = oldExtY;
            this.rot = oldRot;
            var from = this.drawingBase.from, to = this.drawingBase.to;
            History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors,
                new CDrawingBasePosWritable({
                    fromCol: oldFromCol,
                    fromColOff: oldFromColOff,
                    fromRow: oldFromRow,
                    fromRowOff: oldFromRowOff,
                    toCol: oldToCol,
                    toColOff: oldToColOff,
                    toRow: oldToRow,
                    toRowOff: oldToRowOff,
                    posX: oldPosX,
                    posY: oldPosY,
                    cx: oldCx,
                    cy: oldCy
                }),
                new CDrawingBasePosWritable({
                    fromCol: from.col,
                    fromColOff: from.colOff,
                    fromRow: from.row,
                    fromRowOff: from.rowOff,
                    toCol: to.col,
                    toColOff: to.colOff,
                    toRow: to.row,
                    toRowOff: to.rowOff,
                    posX: this.drawingBase.Pos.X,
                    posY: this.drawingBase.Pos.Y,
                    cx: this.drawingBase.ext.cx,
                    cy: this.drawingBase.ext.cy
                })));
        }
};

    CGraphicObjectBase.prototype.setDrawingBaseCoords = function(fromCol, fromColOff, fromRow, fromRowOff, toCol, toColOff, toRow, toRowOff, posX, posY, extX, extY)
{
    if(this.drawingBase)
    {
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AutoShapes_SetDrawingBaseCoors, new CDrawingBasePosWritable({
                fromCol   : this.drawingBase.from.col,
                fromColOff: this.drawingBase.from.colOff,
                fromRow   : this.drawingBase.from.row,
                fromRowOff: this.drawingBase.from.rowOff,
                toCol     : this.drawingBase.to.col,
                toColOff  : this.drawingBase.to.colOff,
                toRow     : this.drawingBase.to.row,
                toRowOff  : this.drawingBase.to.rowOff,
                posX      : this.drawingBase.Pos.X,
                posY      : this.drawingBase.Pos.Y,
                cx        : this.drawingBase.ext.cx,
                cy        : this.drawingBase.ext.cy
            }),
            new CDrawingBasePosWritable({
                fromCol:    fromCol,
                fromColOff: fromColOff,
                fromRow   : fromRow,
                fromRowOff: fromRowOff,
                toCol:    toCol,
                toColOff: toColOff,
                toRow   : toRow,
                toRowOff: toRowOff,
                posX    : posX,
                posY    : posY,
                cx      : extX,
                cy      : extY
            })));


            this.drawingBase.from.col    = fromCol;
            this.drawingBase.from.colOff = fromColOff;
            this.drawingBase.from.row    = fromRow;
            this.drawingBase.from.rowOff = fromRowOff;

            this.drawingBase.to.col    = toCol;
            this.drawingBase.to.colOff = toColOff;
            this.drawingBase.to.row    = toRow;
            this.drawingBase.to.rowOff = toRowOff;

            this.drawingBase.Pos.X  = posX;
            this.drawingBase.Pos.Y  = posY;
            this.drawingBase.ext.cx = extX;
            this.drawingBase.ext.cy = extY;
}
};


    CGraphicObjectBase.prototype.setWorksheet = function(worksheet)
    {
        AscCommon.History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_AutoShapes_SetWorksheet, this.worksheet ? this.worksheet.getId() : null, worksheet ? worksheet.getId() : null));
        this.worksheet = worksheet;
        if(Array.isArray(this.spTree)){
            for(var i = 0; i < this.spTree.length; ++i)
            {
                this.spTree[i].setWorksheet(worksheet);
            }
        }
    };

    CGraphicObjectBase.prototype.getUniNvProps = function(){
        return this.nvSpPr || this.nvPicPr || this.nvGrpSpPr || this.nvGraphicFramePr || null;
    };

    CGraphicObjectBase.prototype.getNvProps = function(){
        var oUniNvPr = this.getUniNvProps();
        if(oUniNvPr){
            return oUniNvPr.cNvPr;
        }
        return null;
    };


    CGraphicObjectBase.prototype.setTitle = function(sTitle){
        if(undefined === sTitle || null === sTitle){
            return;
        }
        var oNvPr = this.getNvProps();
        if(oNvPr){
            oNvPr.setTitle(sTitle ? sTitle : null);
        }
    };

    CGraphicObjectBase.prototype.setDescription = function(sDescription){
        if(undefined === sDescription || null === sDescription){
            return;
        }
        var oNvPr = this.getNvProps();
        if(oNvPr){
            oNvPr.setDescr(sDescription ? sDescription : null);
        }
    };

    CGraphicObjectBase.prototype.getTitle = function(){
        var oNvPr = this.getNvProps();
        if(oNvPr){
            return oNvPr.title ? oNvPr.title : undefined;
        }
        return undefined;
    };

    CGraphicObjectBase.prototype.getDescription = function(){
        var oNvPr = this.getNvProps();
        if(oNvPr){
            return oNvPr.descr ? oNvPr.descr : undefined;
        }
        return undefined;
    };

    CGraphicObjectBase.prototype.setBDeleted = function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_ShapeSetBDeleted, this.bDeleted, pr));
        this.bDeleted = pr;
    };


    CGraphicObjectBase.prototype.getEditorType = function()
    {
        return 1;
    };
    CGraphicObjectBase.prototype.isEmptyPlaceholder = function()
    {
        return false;
    };

    CGraphicObjectBase.prototype.Restart_CheckSpelling = function()
    {
    };

    CGraphicObjectBase.prototype.convertToConnectionParams = function(rot, flipH, flipV, oTransform, oBounds, oConnectorInfo){
        var _ret =  new AscFormat.ConnectionParams();
        var _rot = oConnectorInfo.ang*AscFormat.cToRad + rot;
        var _normalized_rot = AscFormat.normalizeRotate(_rot);
        _ret.dir = AscFormat.CARD_DIRECTION_E;
        if(_normalized_rot >= 0 && _normalized_rot < Math.PI * 0.25 || _normalized_rot >= 7 * Math.PI * 0.25 && _normalized_rot < 2 * Math.PI){
            _ret.dir = AscFormat.CARD_DIRECTION_E;
            if(flipH){
                _ret.dir = AscFormat.CARD_DIRECTION_W;
            }
        }
        else if(_normalized_rot >= Math.PI * 0.25 && _normalized_rot < 3 * Math.PI * 0.25){
            _ret.dir = AscFormat.CARD_DIRECTION_S;
            if(flipV){
                _ret.dir = AscFormat.CARD_DIRECTION_N;
            }
        }
        else if(_normalized_rot >= 3 * Math.PI * 0.25 && _normalized_rot < 5 * Math.PI * 0.25){
            _ret.dir = AscFormat.CARD_DIRECTION_W;
            if(flipH){
                _ret.dir = AscFormat.CARD_DIRECTION_E;
            }
        }
        else if(_normalized_rot >= 5 * Math.PI * 0.25 && _normalized_rot < 7 * Math.PI * 0.25){
            _ret.dir = AscFormat.CARD_DIRECTION_N;
            if(flipV){
                _ret.dir = AscFormat.CARD_DIRECTION_S;
            }
        }
        _ret.x = oTransform.TransformPointX(oConnectorInfo.x, oConnectorInfo.y);
        _ret.y = oTransform.TransformPointY(oConnectorInfo.x, oConnectorInfo.y);
        _ret.bounds.fromOther(oBounds);
        _ret.idx = oConnectorInfo.idx;
        return _ret;
    };



    CGraphicObjectBase.prototype.getRectGeometry = function(){
        return AscFormat.ExecuteNoHistory(
            function(){
                var _ret = AscFormat.CreateGeometry("rect");
                _ret.Recalculate(this.extX, this.extY);
                return _ret;
            }, this, []
        );
    };

    CGraphicObjectBase.prototype.getGeom = function () {

        var _geom;
        if(this.rectGeometry){
            _geom = this.rectGeometry;
        }
        else if(this.spPr && this.spPr.geometry){
            _geom = this.spPr.geometry;
        }
        else{
            _geom = this.getRectGeometry();
        }
        return _geom;
    };

    CGraphicObjectBase.prototype.findGeomConnector = function(x, y){
        var _geom = this.getGeom();
        var oInvertTransform = this.invertTransform;
        var _x = oInvertTransform.TransformPointX(x, y);
        var _y = oInvertTransform.TransformPointY(x, y);
        return _geom.findConnector(_x, _y, this.convertPixToMM(AscCommon.global_mouseEvent.KoefPixToMM * AscCommon.TRACK_CIRCLE_RADIUS));

    };

    CGraphicObjectBase.prototype.findConnector = function(x, y){
        var oConnGeom = this.findGeomConnector(x, y);
        if(oConnGeom){
            var _rot = this.rot;
            var _flipH = this.flipH;
            var _flipV = this.flipV;
            if(this.group){
                _rot = AscFormat.normalizeRotate(this.group.getFullRotate() + _rot);
                if(this.group.getFullFlipH()){
                    _flipH = !_flipH;
                }
                if(this.group.getFullFlipV()){
                    _flipV = !_flipV;
                }
            }
            return this.convertToConnectionParams(_rot, _flipH, _flipV, this.transform, this.bounds, oConnGeom);
        }
        return null;
    };

    CGraphicObjectBase.prototype.findConnectionShape = function(x, y){
        if(this.hit(x, y)){
            return this;
        }
        return null;
    };


    CGraphicObjectBase.prototype.getFullRotate = function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    };

    CGraphicObjectBase.prototype.getAspect = function (num) {
        var _tmp_x = this.extX !== 0 ? this.extX : 0.1;
        var _tmp_y = this.extY !== 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    };

    CGraphicObjectBase.prototype.getFullFlipH = function () {
        if (!isRealObject(this.group))
            return this.flipH;
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    };

    CGraphicObjectBase.prototype.getFullFlipV = function () {
        if (!isRealObject(this.group))
            return this.flipV;
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    };

    CGraphicObjectBase.prototype.getMainGroup = function () {
        if(!isRealObject(this.group)){
            if(this.getObjectType() === AscDFH.historyitem_type_GroupShape){
                return this;
            }
            return null;
        }
        return this.group.getMainGroup();
    };


    CGraphicObjectBase.prototype.drawConnectors = function(overlay)
    {
        var _geom = this.getGeom();
        _geom.drawConnectors(overlay, this.transform);
    };
    CGraphicObjectBase.prototype.getConnectionParams = function(cnxIdx, _group)
    {
        if(this.recalculateTransform){
            this.recalculateTransform();
        }
        if(cnxIdx !== null){
            var oConnectionObject = this.getGeom().cnxLst[cnxIdx];
            if(oConnectionObject){
                var g_conn_info =  {idx: cnxIdx, ang: oConnectionObject.ang, x: oConnectionObject.x, y: oConnectionObject.y};
                var _rot = AscFormat.normalizeRotate(this.getFullRotate());
                var _flipH =  this.getFullFlipH();
                var _flipV =  this.getFullFlipV();
                var _bounds = this.bounds;
                var _transform = this.transform;

                if(_group){
                    _rot = AscFormat.normalizeRotate((this.group ? this.group.getFullRotate() : 0) + _rot - _group.getFullRotate());
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
                return this.convertToConnectionParams(_rot, _flipH, _flipV, _transform, _bounds, g_conn_info);
            }
        }
        return null;
    };

    CGraphicObjectBase.prototype.getCardDirectionByNum = function (num) {
        var num_north = this.getNumByCardDirection(AscFormat.CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip)
            return ((num - num_north) + AscFormat.CARD_DIRECTION_N + 8) % 8;

        return (AscFormat.CARD_DIRECTION_N - (num - num_north) + 8) % 8;
    };

    CGraphicObjectBase.prototype.getTransformMatrix = function(){
        return this.transform;
    };

    CGraphicObjectBase.prototype.getNumByCardDirection = function (cardDirection) {
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch (Math.min(y1, y3, y5, y7)) {
            case y1:
            {
                north_number = 1;
                break;
            }
            case y3:
            {
                north_number = 3;
                break;
            }
            case y5:
            {
                north_number = 5;
                break;
            }
            default:
            {
                north_number = 7;
                break;
            }
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;

        if (same_flip)
            return (north_number + cardDirection) % 8;
        return (north_number - cardDirection + 8) % 8;
    };

    CGraphicObjectBase.prototype.getInvertTransform = function(){
        return this.invertTransform;
    };

    CGraphicObjectBase.prototype.getResizeCoefficients = function (numHandle, x, y) {
        var cx, cy;
        cx = this.extX > 0 ? this.extX : 0.01;
        cy = this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch (numHandle) {
            case 0:
                return { kd1: (cx - t_x) / cx, kd2: (cy - t_y) / cy };
            case 1:
                return { kd1: (cy - t_y) / cy, kd2: 0 };
            case 2:
                return { kd1: (cy - t_y) / cy, kd2: t_x / cx };
            case 3:
                return { kd1: t_x / cx, kd2: 0 };
            case 4:
                return { kd1: t_x / cx, kd2: t_y / cy };
            case 5:
                return { kd1: t_y / cy, kd2: 0 };
            case 6:
                return { kd1: t_y / cy, kd2: (cx - t_x) / cx };
            case 7:
                return { kd1: (cx - t_x) / cx, kd2: 0 };
        }
        return { kd1: 1, kd2: 1 };
    };


    CGraphicObjectBase.prototype.GetAllContentControls = function(arrContentControls)
    {
    };

    CGraphicObjectBase.prototype.CheckContentControlEditingLock = function () {
        if(this.group){
            this.group.CheckContentControlEditingLock();
            return;
        }
        if(this.parent && this.parent.CheckContentControlEditingLock){
            this.parent.CheckContentControlEditingLock();
        }
    };

    CGraphicObjectBase.prototype.drawLocks = function(transform, graphics){
        var bNotes = !!(this.parent && this.parent.kind === AscFormat.TYPE_KIND.NOTES);
        if(!this.group && !bNotes)
        {
            var oLock;
            if(this.parent instanceof ParaDrawing)
            {
                oLock = this.parent.Lock;
            }
            else if(this.Lock)
            {
                oLock = this.Lock;
            }
            if(oLock && AscCommon.locktype_None !== oLock.Get_Type())
            {
                var bCoMarksDraw = true;
                var oApi = editor || Asc['editor'];
                if(oApi){

                    switch(oApi.getEditorId()){
                        case AscCommon.c_oEditorId.Word:{
                            bCoMarksDraw = (true === oApi.isCoMarksDraw || AscCommon.locktype_Mine !== oLock.Get_Type());
                            break;
                        }
                        case AscCommon.c_oEditorId.Presentation:{
                            bCoMarksDraw = (!AscCommon.CollaborativeEditing.Is_Fast() || AscCommon.locktype_Mine !== oLock.Get_Type());
                            break;
                        }
                        case AscCommon.c_oEditorId.Spreadsheet:{
                            bCoMarksDraw = (!oApi.collaborativeEditing.getFast() || AscCommon.locktype_Mine !== oLock.Get_Type());
                            break;
                        }
                    }
                }
                if(bCoMarksDraw){
                    graphics.transform3(transform);
                    graphics.DrawLockObjectRect(oLock.Get_Type(), 0, 0, this.extX, this.extY);
                    return true;
                }
            }
        }
        return false;
    };
    CGraphicObjectBase.prototype.getSignatureLineGuid = function(){
        return null;
    };

    CGraphicObjectBase.prototype.getCopyWithSourceFormatting = function(oIdMap){
        return this.copy(oIdMap);
    };

    CGraphicObjectBase.prototype.checkNeedRecalculate = function(){
        return false;
    };

    CGraphicObjectBase.prototype.canChangeArrows = function () {
        if (!this.spPr || this.spPr.geometry == null) {
            return false;
        }
        var _path_list = this.spPr.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for (_path_index = 0; _path_index < _path_list.length; ++_path_index) {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for (_path_command_index = 0; _path_command_index < _path_command_arr.length; ++_path_command_index) {
                if (_path_command_arr[_path_command_index].id == 5) {
                    break;
                }
            }
            if (_path_command_index == _path_command_arr.length) {
                return true;
            }
        }
        return false;
    };

    CGraphicObjectBase.prototype.getStroke = function () {
        if(this.pen && this.pen.Fill)
        {
            if(this.getObjectType() === AscDFH.historyitem_type_ImageShape && AscFormat.isRealNumber(this.pen.w))
            {
                var _ret = this.pen.createDuplicate();
                _ret.w/=2.0;
                return _ret;
            }
            return this.pen;
        }
        var ret = AscFormat.CreateNoFillLine();
        ret.w = 0;
        return ret;
    };


    CGraphicObjectBase.prototype.getPresetGeom = function () {
        if (this.spPr && this.spPr.geometry) {
            return this.spPr.geometry.preset;
        }
        else {
            if(this.calcGeometry)
            {
                return this.calcGeometry.preset;
            }
            return null;
        }
    };


    CGraphicObjectBase.prototype.getFill = function () {
        if(this.brush && this.brush.fill)
        {
            return this.brush;
        }
        return AscFormat.CreateNoFillUniFill();
    };



    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CGraphicObjectBase = CGraphicObjectBase;
    window['AscFormat'].CGraphicBounds     = CGraphicBounds;
    window['AscFormat'].checkNormalRotate  = checkNormalRotate;
    window['AscFormat'].normalizeRotate    = normalizeRotate;
    window['AscFormat'].LOCKS_MASKS        = LOCKS_MASKS;
})(window);