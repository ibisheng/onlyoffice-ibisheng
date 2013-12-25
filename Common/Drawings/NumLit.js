function CNumLit()
{
    this.formatCode  = null;
    this.pt          = null;
    this.ptCount     = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumLit.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_NumLit;
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
        History.Add(this, {Type:historyitem_NumLit_SetFormatCode, oldPr: this.formatCode, newPr: pr});
        this.formatCode = pr;
    },

    setPt: function(pr)
    {
        History.Add(this, {Type:historyitem_NumLit_SetPt, oldPr: this.pt, newPr: pr});
        this.pt = pr;
    },

    setPtCount: function(pr)
    {
        History.Add(this, {Type:historyitem_NumLit_SetPt, oldPr: this.pt, newPr: pr});
        this.ptCount = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_NumLit_SetFormatCode:
            {
                this.formatCode = data.oldPr;
                break;
            }

            case historyitem_NumLit_SetPt:
            {
                this.pt = data.oldPr;
                break;
            }

            case historyitem_NumLit_SetPtCount:
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
            case historyitem_NumLit_SetFormatCode:
            {
                this.formatCode = data.newPr;
                break;
            }

            case historyitem_NumLit_SetPt:
            {
                this.pt = data.newPr;
                break;
            }

            case historyitem_NumLit_SetPtCount:
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
            case historyitem_NumLit_SetFormatCode:
            {
                w.WriteBool(typeof data.newPr === "string");
                if(typeof data.newPr === "string")
                {
                    w.WriteString2(data.newPr);
                }
                break;
            }

            case historyitem_NumLit_SetPt:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }

            case historyitem_NumLit_SetPtCount:
            {
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
        switch (type)
        {
            case historyitem_NumLit_SetFormatCode:
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

            case historyitem_NumLit_SetPt:
            {
                if(r.GetBool())
                {
                    this.pt = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.pt = null;
                }
                break;
            }

            case historyitem_NumLit_SetPtCount:
            {
                if(r.GetBool())
                {
                    this.ptCount = r.GetLong();
                }
                else
                {
                    this.ptCount = null;
                }
                break;
            }
        }
    }
};