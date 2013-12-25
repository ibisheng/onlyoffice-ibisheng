function CCat()
{
    this.multiLvlStrRef = null;
    this.numLit         = null;
    this.numRef         = null;
    this.strLit         = null;
    this.strRef         = null;

    this.Id = g_IdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CCat.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Cat;
    },

    setMultiLvlStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_Cat_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },
    setNumLit: function(pr)
    {
        History.Add(this, {Type: historyitem_Cat_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },
    setNumRef: function(pr)
    {
        History.Add(this, {Type: historyitem_Cat_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },
    setStrLit: function(pr)
    {
        History.Add(this, {Type: historyitem_Cat_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },
    setStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_Cat_SetMultiLvlStrRef, oldPr: this.multiLvlStrRef, newPr: pr});
        this.multiLvlStrRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Cat_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = data.oldPr;
                break;
            }
           case historyitem_Cat_SetNumLit:
           {
               this.numLit = data.oldPr;
               break;
           }
           case historyitem_Cat_SetNumRef:
           {
               this.numRef = data.oldPr;
               break;
           }
           case historyitem_Cat_SetStrLit:
           {
               this.strLit = data.oldPr;
               break;
           }
           case historyitem_Cat_SetStrRef:
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
            case historyitem_Cat_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = data.newPr;
                break;
            }
            case historyitem_Cat_SetNumLit:
            {
                this.numLit = data.newPr;
                break;
            }
            case historyitem_Cat_SetNumRef:
            {
                this.numRef = data.newPr;
                break;
            }
            case historyitem_Cat_SetStrLit:
            {
                this.strLit = data.newPr;
                break;
            }
            case historyitem_Cat_SetStrRef:
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
            case historyitem_Cat_SetMultiLvlStrRef:
            case historyitem_Cat_SetNumLit:
            case historyitem_Cat_SetNumRef:
            case historyitem_Cat_SetStrLit:
            case historyitem_Cat_SetStrRef:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Cat_SetMultiLvlStrRef:
            {
                this.multiLvlStrRef = readObject(r);
                break;
            }
            case historyitem_Cat_SetNumLit:
            {
                this.numLit = readObject(r);
                break;
            }
            case historyitem_Cat_SetNumRef:
            {
                this.numRef = readObject(r);
                break;
            }
            case historyitem_Cat_SetStrLit:
            {
                this.strLit = readObject(r);
                break;
            }
            case historyitem_Cat_SetStrRef:
            {
                this.strRef = readObject(r);
                break;
            }
        }
    }
};