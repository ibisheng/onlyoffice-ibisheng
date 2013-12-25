function CPivotFmt()
{
    this.dLbl = null;
    this.idx = null;
    this.marker = null;
    this.spPr = null;
    this.txPr = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CPivotFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PivotFmt;
    },

    setLbl: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotFmt_SetDLbl, oldPr:this.dLbl, newPr: pr});
        this.dLbl = pr;
    },

    setIdx: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotFmt_SetIdx, oldPr:this.idx, newPr: pr});
        this.idx = pr;
    },

    setMarker: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotFmt_SetMarker, oldPr:this.marker, newPr: pr});
        this.marker = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotFmt_SetSpPr, oldPr:this.spPr, newPr: pr});
        this.spPr = pr;
    },

    setTxPr: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotFmt_SetTxPr, oldPr:this.txPr, newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotFmt_SetDLbl:
            {
                this.dLbl = data.oldPr;
                break;
            }
            case historyitem_PivotFmt_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_PivotFmt_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_PivotFmt_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_PivotFmt_SetTxPr:
            {
                this.txPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotFmt_SetDLbl:
            {
                this.dLbl = data.newPr;
                break;
            }
            case historyitem_PivotFmt_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_PivotFmt_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_PivotFmt_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_PivotFmt_SetTxPr:
            {
                this.txPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_PivotFmt_SetDLbl:
            case historyitem_PivotFmt_SetMarker:
            case historyitem_PivotFmt_SetSpPr:
            case historyitem_PivotFmt_SetTxPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_PivotFmt_SetIdx:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_PivotFmt_SetDLbl:
            {
                if(r.GetBool())
                {
                    this.dLbl = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.dLbl = null;
                }
                break;
            }
            case historyitem_PivotFmt_SetIdx:
            {
                if(r.GetBool())
                {
                    this.idx = r.GetLong();
                }
                else
                {
                    this.idx = null;
                }
                break;
            }
            case historyitem_PivotFmt_SetMarker:
            {
                if(r.GetBool())
                {
                    this.marker = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.marker = null;
                }
                break;
            }
            case historyitem_PivotFmt_SetSpPr:
            {
                if(r.GetBool())
                {
                    this.spPr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.spPr = null;
                }
                break;
            }
            case historyitem_PivotFmt_SetTxPr:
            {
                if(r.GetBool())
                {
                    this.txPr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.txPr = null;
                }
                break;
            }
        }
    }
};

