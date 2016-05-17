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
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add( this, this.Id );
    }
    AscCommon.extendClass(COleObject, CImageShape);

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
        window['AscFormat'] = window['AscFormat'] || {};
        window['AscFormat'].COleObject = COleObject;
})(window);