function CStrCache()
{
    this.pt      = null;
    this.ptCount = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStrCache.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_StrCache;
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

    setPt: function(pr)
    {
        History.Add(this, {Type: historyitem_StrCache_Pt, oldPr: this.pt, newPr: pr});
        this.pt = pr;
    },

    setPtCount: function(pr)
    {
        History.Add(this, {Type: historyitem_StrCache_PtCount, oldPr: this.ptCount, newPr: pr});
        this.ptCount = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_StrCache_Pt:
            {
                this.pt = data.oldPr;
                break;
            }
            case historyitem_StrCache_PtCount:
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
            case historyitem_StrCache_Pt:
            {
                this.pt = data.newPr;
                break;
            }
            case historyitem_StrCache_PtCount:
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
            case historyitem_StrCache_Pt:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_StrCache_PtCount:
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
            case historyitem_StrCache_Pt:
            {
                this.pt = readObject(r);
                break;
            }
            case historyitem_StrCache_PtCount:
            {
                this.ptCount = readLong(r);
                break;
            }
        }
    }
};