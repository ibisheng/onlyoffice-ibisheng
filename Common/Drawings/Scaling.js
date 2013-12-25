var ORIENTATION_MAX_MIN = 0;
var ORIENTATION_MIN_MAX = 1;

function CScaling()
{
    this.logBase = null;
    this.max = null;
    this.min = null;
    this.orientation = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CScaling.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Scaling;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setLogBase: function(pr)
    {
        History.Add(this, {Type: historyitem_Scaling_SetLogBase, oldPr: this.logBase, newPr: pr});
        this.logBase = pr;
    },

    setMax: function(pr)
    {
        History.Add(this, {Type: historyitem_Scaling_SetLogBase, oldPr: this.logBase, newPr: pr});
        this.logBase = pr;
    },

    setMin: function(pr)
    {
        History.Add(this, {Type: historyitem_Scaling_SetLogBase, oldPr: this.logBase, newPr: pr});
        this.logBase = pr;
    },

    setOrientation: function(pr)
    {
        History.Add(this, {Type: historyitem_Scaling_SetLogBase, oldPr: this.logBase, newPr: pr});
        this.logBase = pr;
    },

    Undo: function()
    {},

    Redo: function()
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};