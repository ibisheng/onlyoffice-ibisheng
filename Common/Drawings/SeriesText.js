function CTx()
{
    this.strRef = null;
    this.val    = null;

    this.Id = g_oIdCouter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTx.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Tx;
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

    setStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_Tx_SetStrRef, oldPr: this.strRef, newPr:pr});
        this.strRef = pr;
    },

    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_Tx_SetVal, oldPr: this.strRef, newPr:pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Tx_SetStrRef:
            {
                this.strRef = data.oldPr;
                break;
            }
            case historyitem_Tx_SetVal:
            {
                this.val = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Tx_SetStrRef:
            {
                this.strRef = data.newPr;
                break;
            }
            case historyitem_Tx_SetVal:
            {
                this.val = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Tx_SetStrRef:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_Tx_SetVal:
            {
                this.val = writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Tx_SetStrRef:
            {
                this.strRef = readObject(r);
                break;
            }
            case historyitem_Tx_SetVal:
            {
                this.val = readString(r);
                break;
            }
        }
    }
};
