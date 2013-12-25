function CUpDownBars()
{
    this.downBars = null;
    this.gapWidth = null;
    this.upBars   = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CUpDownBars.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_UpDownBars;
    },
    setDownBars: function(pr)
    {
        History.Add(this, {Type: historyitem_UpDownBars_SetDownBars, oldPr: this.downBars, newPr:pr});
        this.downBars = pr;
    },

    setGapWidth: function(pr)
    {

        History.Add(this, {Type: historyitem_UpDownBars_SetGapWidth, oldPr: this.downBars, newPr:pr});
        this.downBars = pr;
    },

    setUpBars: function(pr)
    {
        History.Add(this, {Type: historyitem_UpDownBars_SetUpBars, oldPr: this.downBars, newPr:pr});
        this.downBars = pr;
    },

    Undo: function(data)
    {},

    Redo: function(data)
    {},

    Write_ToBinary2: function(w)
    {},

    Read_FromBinary2: function(r)
    {},

    Load_Changes: function(r)
    {},

    Save_Changes: function(data, w)
    {}
};