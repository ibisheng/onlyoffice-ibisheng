function CLegendEntry()
{
    this.bDelete = null;
    this.idx = null;
    this.txPr  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLegendEntry.prototype =
{
    getObjectType: function()
    {
        return historyitem_type_LegendEntry;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(this, {Type: historyitem_LegendEntry_SetDelete, oldPr: this.bDelete, newPr:pr});
        this.bDelete = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_LegendEntry_SetIdx, oldPr: this.idx, newPr:pr});
        this.idx = pr;
    },

    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_LegendEntry_SetTxPr, oldPr: this.txPr, newPr:pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LegendEntry_SetDelete:
            {
                this.bDelete = data.oldPr;
                break;
            }
            case historyitem_LegendEntry_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_LegendEntry_SetTxPr:
            {
                this.txPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LegendEntry_SetDelete:
            {
                this.bDelete = data.newPr;
                break;
            }
            case historyitem_LegendEntry_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_LegendEntry_SetTxPr:
            {
                this.txPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_LegendEntry_SetDelete:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
            case historyitem_LegendEntry_SetIdx:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_LegendEntry_SetTxPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_LegendEntry_SetDelete:
            {
                if(r.GetBool())
                {
                    this.bDelete = r.GetBool();
                }
                else
                {
                    this.bDelete = null;
                }
                break;
            }
            case historyitem_LegendEntry_SetIdx:
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
            case historyitem_LegendEntry_SetTxPr:
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