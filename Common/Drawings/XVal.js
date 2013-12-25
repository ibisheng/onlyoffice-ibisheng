function CXVal()
{
    this.multiLvlStrRef = null;
    this.numLit         = null;
    this.numRef         = null;
    this.strLit         = null;
    this.strRef         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CXVal.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_XVal;
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

    setMultiLvlStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_XVal_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },

    setNumLit: function(pr)
    {
        History.Add(this, {Type: historyitem_XVal_SetNumLit, oldPr: this.numLit, newPr: pr});
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(this, {Type: historyitem_XVal_SetNumRef, oldPr: this.numRef, newPr: pr});
        this.numRef = pr;
    },

    setStrLit: function(pr)
    {
        History.Add(this, {Type: historyitem_XVal_SetStrLit, oldPr: this.strLit, newPr: pr});
        this.strLit = pr;
    },

    setStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_XVal_SetStrRef, oldPr: this.strRef, newPr: pr});
        this.strRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_XVal_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = data.oldPr;
                break;
            }
            case historyitem_XVal_SetNumLit:
            {
                this.numLit = data.oldPr;
                break;
            }
            case historyitem_XVal_SetNumRef:
            {
                this.numRef = data.oldPr;
                break;
            }
            case historyitem_XVal_SetStrLit:
            {
                this.strLit = data.oldPr;
                break;
            }
            case historyitem_XVal_SetStrRef:
            {
                this.strRef = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_XVal_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = data.newPr;
                break;
            }
            case historyitem_XVal_SetNumLit:
            {
                this.numLit = data.newPr;
                break;
            }
            case historyitem_XVal_SetNumRef:
            {
                this.numRef = data.newPr;
                break;
            }
            case historyitem_XVal_SetStrLit:
            {
                this.strLit = data.newPr;
                break;
            }
            case historyitem_XVal_SetStrRef:
            {
                this.strRef = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_XVal_SetMultiLvlStrRef:
            case historyitem_XVal_SetNumLit:
            case historyitem_XVal_SetNumRef:
            case historyitem_XVal_SetStrLit:
            case historyitem_XVal_SetStrRef:
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
            case historyitem_XVal_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = readObject(r);
                break;
            }
            case historyitem_XVal_SetNumLit:
            {
                this.numLit =  readObject(r);
                break;
            }
            case historyitem_XVal_SetNumRef:
            {
                this.numRef =  readObject(r);
                break;
            }
            case historyitem_XVal_SetStrLit:
            {
                this.strLit =  readObject(r);
                break;
            }
            case historyitem_XVal_SetStrRef:
            {
                this.strRef =  readObject(r);
                break;
            }
        }
    }

};