"use strict";

(
    /**
     * @param {Window} window
     * @param {undefined} undefined
     */
function (window, undefined) {
    function COleObject()
    {
        COleObject.superclass.constructor.call(this);
        this.m_sData = null;
        this.m_sApplicationId = null;
        this.m_nPixWidth = null;
        this.m_nPixHeight = null;
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add( this, this.Id );
    }
    AscCommon.extendClass(COleObject, AscFormat.CImageShape);

    COleObject.prototype.getObjectType = function()
    {
        return AscDFH.historyitem_type_OleObject;
    };
    COleObject.prototype.setData = function(sData)
    {
        AscCommon.History.Add(this, {Type:AscDFH.historyitem_ImageShapeSetData, oldData: this.m_sData,  newData: sData});
        this.m_sData = sData;
    };
    COleObject.prototype.setApplicationId = function(sApplicationId)
    {
        AscCommon.History.Add(this, {Type:AscDFH.historyitem_ImageShapeSetApplicationId, oldId: this.m_sApplicationId,  newId: sApplicationId});
        this.m_sApplicationId = sApplicationId;
    };
    COleObject.prototype.setPixSizes = function(nPixWidth, nPixHeight)
    {
        AscCommon.History.Add(this, {Type: AscDFH.historyitem_ImageShapeSetPixSizes, oldPr: {w: this.m_nPixWidth, h: this.m_nPixHeight}, newPr: {w: nPixWidth, h: nPixHeight}});
        this.m_nPixWidth = nPixWidth;
        this.m_nPixHeight = nPixHeight;
    };

    COleObject.prototype.copy = function()
    {
        var copy = new COleObject();
        if(this.nvPicPr)
        {
            copy.setNvPicPr(this.nvPicPr.createDuplicate());
        }
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        if(this.blipFill)
        {
            copy.setBlipFill(this.blipFill.createDuplicate());
        }
        if(this.style)
        {
            copy.setStyle(this.style.createDuplicate());
        }
        copy.setBDeleted(this.bDeleted);
        if(this.fromSerialize)
        {
            copy.setBFromSerialize(true);
        }
        copy.setData(this.m_sData);
        copy.setApplicationId(this.m_sApplicationId);
        copy.setPixSizes(this.m_nPixWidth, this.m_nPixHeight);
        copy.cachedImage = this.getBase64Img();
        copy.cachedPixH = this.cachedPixH;
        copy.cachedPixW = this.cachedPixW;
        return copy;
    };
        window['AscFormat'] = window['AscFormat'] || {};
        window['AscFormat'].COleObject = COleObject;
})(window);