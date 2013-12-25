function CStringLiteral()
{
    this.pt      = null;
    this.ptCount = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStringLiteral.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_StringLiteral;
    },

    setPt: function(pr)
    {
        History.Add(this, {Type: historyitem_StringLiteral_SetPt, newPr: pr, oldPr: this.pt});
        this.pt = pr;
    },

    setPtCount: function(pr)
    {
        History.Add(this, {Type: historyitem_StringLiteral_SetPtCount, newPr: pr, oldPr: this.ptCount});
        this.ptCount = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_StringLiteral_SetPt:
            {
                this.pt = data.oldPr;
                break;
            }
            case historyitem_StringLiteral_SetPtCount:
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
            case historyitem_StringLiteral_SetPt:
            {
                this.pt = data.newPr;
                break;
            }
            case historyitem_StringLiteral_SetPtCount:
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
            case historyitem_StringLiteral_SetPt:
            {
                writeObject(data.newPr);
                break;
            }
            case historyitem_StringLiteral_SetPtCount:
            {
                writeLong(data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_StringLiteral_SetPt:
            {
                this.pt = readObject(r);
                break;
            }
            case historyitem_StringLiteral_SetPtCount:
            {
                this.ptCount = readLong(r);
                break;
            }
        }
    }
};