function CMultiLvlStrRef()
{
    this.f                = null;
    this.multiLvlStrCache = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMultiLvlStrRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType:  function()
    {
        return historyitem_type_MultiLvlStrRef;
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

    setF: function(pr)
    {
        History.Add(this, {Type: historyitem_MultiLvlStrRef_SetF, oldPr: this.f, newPr: pr});
        this.f = pr;
    },

    setMultiLvlStrCache: function(pr)
    {
        History.Add(this, {Type: historyitem_MultiLvlStrRef_SetMultiLvlStrCache, oldPr: this.multiLvlStrCache, newPr: pr});
        this.multiLvlStrCache = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_MultiLvlStrRef_SetF:
            {
                this.f = data.oldPr;
                break;
            }
            case historyitem_MultiLvlStrRef_SetMultiLvlStrCache:
            {
                this.multiLvlStrCache = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_MultiLvlStrRef_SetF:
            {
                this.f = data.newPr;
                break;
            }
            case historyitem_MultiLvlStrRef_SetMultiLvlStrCache:
            {
                this.multiLvlStrCache = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_MultiLvlStrRef_SetF:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_MultiLvlStrRef_SetMultiLvlStrCache:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        switch (data.Type)
        {
            case historyitem_MultiLvlStrRef_SetF:
            {
                this.f = readString(r);
                break;
            }
            case historyitem_MultiLvlStrRef_SetMultiLvlStrCache:
            {
                this.multiLvlStrCache = readObject(r);
                break;
            }
        }
    }

};