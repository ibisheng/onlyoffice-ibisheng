function CStringPoint()
{
    this.idx = null;
    this.val = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStringPoint.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_StrPoint;
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

    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_StrPoint_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },

    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_StrPoint_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data)
        {
            case historyitem_StrPoint_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_StrPoint_SetVal:
            {
                this.val = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data)
        {
            case historyitem_StrPoint_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_StrPoint_SetVal:
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
            case historyitem_StrPoint_SetIdx:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_StrPoint_SetVal:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_StrPoint_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_StrPoint_SetVal:
            {
                this.val = readString(r);
                break;
            }
        }
    }

};