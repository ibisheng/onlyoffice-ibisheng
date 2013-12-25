function CNumericPoint()
{
    this.formatCode = null;
    this.idx        = null;
    this.val        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumericPoint.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_NumericPoint;
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

    setFormatCode: function(pr)
    {
        History.Add(this, {Type: historyitem_NumericPoint_SetFormatCode, oldPr: this.formatCode, newPr: pr});
        this.formatCode = pr;
    },

    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_NumericPoint_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },

    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_NumericPoint_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_NumericPoint_SetFormatCode:
            {
                this.formatCode = data.oldPr;
                break;
            }
            case historyitem_NumericPoint_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_NumericPoint_SetVal:
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
            case historyitem_NumericPoint_SetFormatCode:
            {
                this.formatCode = data.newPr;
                break;
            }
            case historyitem_NumericPoint_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_NumericPoint_SetVal:
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
            case historyitem_NumericPoint_SetFormatCode:
            case historyitem_NumericPoint_SetVal:
            {
                w.WriteBool(typeof data.newPr === "string");
                if(typeof data.newPr === "string")
                {
                    w.WriteString2(data.newPr);
                }
                break;
            }
            case historyitem_NumericPoint_SetIdx:
            {
                this.idx = data.newPr;
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_NumericPoint_SetFormatCode:
            {
                if(r.GetBool())
                {
                    this.formatCode = r.GetString2();
                }
                else
                {
                    this.formatCode = null;
                }
                break;
            }
            case historyitem_NumericPoint_SetIdx:
            {
                if(r.GetBool())
                {
                    this.idx = r.GetLong();
                }
                else
                {
                    this.idx = null;
                }
                break;
            }
            case historyitem_NumericPoint_SetVal:
            {
                if(r.GetBool())
                {
                    this.val = r.GetString2();
                }
                else
                {
                    this.val = null;
                }
                break;
            }
        }
    }
};