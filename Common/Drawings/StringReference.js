function CStrRef()
{
    this.f        = null;
    this.strCache = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStrRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_StrRef;
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
        History.Add(this, {Type: historyitem_StrRef_SetF, oldPr: this.f, newPr: pr});
        this.f = pr;
    },

    setStrCache: function(pr)
    {
        History.Add(this, {Type: historyitem_StrRef_SetStrCache, oldPr: this.strCache, newPr: pr});
        this.strCache = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_StrRef_SetF:
            {
                this.f = data.oldPr;
                break;
            }
            case historyitem_StrRef_SetStrCache:
            {
                this.strCache = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_StrRef_SetF:
            {
                this.f = data.newPr;
                break;
            }
            case historyitem_StrRef_SetStrCache:
            {
                this.strCache = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_StrRef_SetF:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_StrRef_SetStrCache:
            {
                writeObject(data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_StrRef_SetF:
            {
                this.f = readString(r);
                break;
            }
            case historyitem_StrRef_SetStrCache:
            {
                this.strCache = readObject(r);
                break;
            }
        }
    }
};