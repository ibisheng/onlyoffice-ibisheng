function CBandFmt()
{
    this.idx = null;
    this.spPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBandFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_BandFmt;
    },

    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_BandFmt_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_BandFmt_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BandFmt_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_BandFmt_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BandFmt_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_BandFmt_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_BandFmt_SetIdx:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_BandFmt_SetSpPr:
            {

                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString(data.newPr.Get_Id());
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_BandFmt_SetIdx:
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
            case historyitem_BandFmt_SetSpPr:
            {
                this.spPr = data.newPr;
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
        }
    }
};