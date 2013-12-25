function CNumRef()
{
    this.f = null;
    this.numCache = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_NumRef;
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
        History.Add(this, {Type: historyitem_NumRef_SetF, oldPr: this.f, newPr: pr });
        this.f = pr;
    },

    setNumCache: function(pr)
    {
        History.Add(this, {Type: historyitem_NumRef_SetNumCache, oldPr: this.numCache, newPr: pr});
        this.numCache = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_NumRef_SetF:
            {
                this.f = data.oldPr;
                break;
            }
            case historyitem_NumRef_SetNumCache:
            {
                this.numCache = data.oldPr;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_NumRef_SetF:
            {
                this.f = data.newPr;
                break;
            }
            case historyitem_NumRef_SetNumCache:
            {
                this.numCache = data.newPr;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_NumRef_SetF:
            case historyitem_NumRef_SetNumCache:
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
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_NumRef_SetF:
            {
                if(r.GetBool())
                {
                    this.f = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.f = null;
                }
                break;
            }
            case historyitem_NumRef_SetNumCache:
            {
                if(r.GetBool())
                {
                    this.numCache = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.numCache = null;
                }
            }
        }
    }
};