function CMinusPlus()
{
    this.numLit = null;
    this.numRef = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMinusPlus.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_MinusPlus;
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


    setNumLit: function(pr)
    {
        History.Add(this, {Type: historyitem_MinusPlus_SetnNumLit, oldPr: this.numLit, newPr: pr});
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(this, {Type: historyitem_MinusPlus_SetnNumRef, oldPr: this.numRef, newPr: pr});
        this.numRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_MinusPlus_SetnNumLit:
            {
                this.numLit = data.oldPr;
                break;
            }
            case historyitem_MinusPlus_SetnNumRef:
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
            case historyitem_MinusPlus_SetnNumLit:
            {
                this.numLit = data.newPr;
                break;
            }
            case historyitem_MinusPlus_SetnNumRef:
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
            case historyitem_MinusPlus_SetnNumLit:
            case historyitem_MinusPlus_SetnNumRef:
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
            case historyitem_MinusPlus_SetnNumLit:
            {
                if(r.GetBool())
                {
                    this.numLit = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.numLit = null;
                }
                break;
            }
            case historyitem_MinusPlus_SetnNumRef:
            {
                if(r.GetBool())
                {
                    this.numRef = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.numRef = null;
                }
                break;
            }
        }
    }
};