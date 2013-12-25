function CTitle()
{
    this.layout  = null;
    this.overlay = null;
    this.spPr    = null;
    this.tx      = null;
    this.txPr    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTitle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return  historyitem_type_Chart;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    setLayout: function(pr)
    {
        History.Add(this, {Type: historyitem_Title_SetLayout, oldPr: this.layout, newPr: pr});
        this.layout = pr;
    },
    setOverlay: function(pr)
    {
        History.Add(this, {Type: historyitem_Title_SetOverlay, oldPr: this.overlay, newPr: pr});
        this.overlay = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Title_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_Title_SetTx, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Title_SetTxPr, oldPr: this.txPr, newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Title_SetLayout:
            {
                this.layout = data.oldPr;
                break;
            }
            case historyitem_Title_SetOverlay:
            {
                this.overlay = data.oldPr;
                break;
            }
            case historyitem_Title_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_Title_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_Title_SetTxPr:
            {
                this.txPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Title_SetLayout:
            {
                this.layout = data.newPr;
                break;
            }
            case historyitem_Title_SetOverlay:
            {
                this.overlay = data.newPr;
                break;
            }
            case historyitem_Title_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_Title_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_Title_SetTxPr:
            {
                this.txPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Title_SetLayout:
            case historyitem_Title_SetSpPr:
            case historyitem_Title_SetTx:
            case historyitem_Title_SetTxPr:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_Title_SetOverlay:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Title_SetLayout:
            {
                this.layout = readObject(r);
                break;
            }
            case historyitem_Title_SetOverlay:
            {
                this.overlay = readBool(r);
                break;
            }
            case historyitem_Title_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_Title_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_Title_SetTxPr:
            {
                this.txPr = readObject(r);
                break;
            }
        }
    }
};