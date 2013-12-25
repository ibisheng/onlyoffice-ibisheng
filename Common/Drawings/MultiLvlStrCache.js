function CMultiLvlStrCache()
{
    this.lvl     = null;
    this.ptCount = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMultiLvlStrCache.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_MultiLvlStrCache;
    },

    setLvl: function(pr)
    {
        History.Add(this, {Type: historyitem_MultiLvlStrCache_SetLvl, newPr: pr, oldPr: this.lvl});
        this.lvl = pr;
    },

    setPtCount: function(pr)
    {
        History.Add(this, {Type: historyitem_MultiLvlStrCache_SetPtCount, newPr: pr, oldPr: this.ptCount});
        this.ptCount = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_MultiLvlStrCache_SetLvl:
            {
                this.lvl = data.oldPr;
                break;
            }
            case historyitem_MultiLvlStrCache_SetPtCount:
            {
                this.ptCount = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_MultiLvlStrCache_SetLvl:
            {
                this.lvl = data.newPr;
                break;
            }
            case historyitem_MultiLvlStrCache_SetPtCount:
            {
                this.ptCount = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_MultiLvlStrCache_SetLvl:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_MultiLvlStrCache_SetPtCount:
            {
                writeLong(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_MultiLvlStrCache_SetLvl:
            {
                this.lvl = readObject(r);
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_MultiLvlStrCache_SetPtCount:
            {
                this.ptCount = readLong(r);
                break;
            }
        }
    }
};