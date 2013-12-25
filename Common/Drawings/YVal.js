function CYVal()
{
    this.numLit = null;
    this.numRef = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CYVal.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_YVal;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id())
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetLong();
    },

    setNumLit: function(pr)
    {
        History.Add(this, {Type:historyitem_YVal_SetNumLit, oldPr: this.numLit, newPr: pr});
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(this, {Type:historyitem_YVal_SetNumRef, oldPr: this.numRef, newPr: pr});
        this.numRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_YVal_SetNumLit:
            {
                this.numLit = data.oldPr;
                break;
            }
            case historyitem_YVal_SetNumRef:
            {
                this.numRef = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_YVal_SetNumLit:
            {
                this.numLit = data.newPr;
                break;
            }
            case historyitem_YVal_SetNumRef:
            {
                this.numRef = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_YVal_SetNumLit:
            case historyitem_YVal_SetNumRef:
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
            case historyitem_YVal_SetNumLit:
            {
                this.numLit = readObject(r);
                break;
            }
            case historyitem_YVal_SetNumRef:
            {
                this.numRef = readObject(r);
                break;
            }
        }
    }
};