function CNumLit()
{
    this.formatCode  = null;
    this.pts          = [];
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

    addPt: function(pr)
    {
        History.Add(this, {Type:historyitem_NumLit_AddPt, pt: pr});
        this.pts.push(pr);
    },

    setPtCount: function(pr)
    {
        History.Add(this, {Type:historyitem_NumLit_SetPtCount, oldPr: this.pts, newPr: pr});
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

            case historyitem_NumLit_AddPt:
            {
                for(var i = this.pts.length - 1; i > -1; --i)
                {
                    if(this.pts[i] === data.pt)
                    {
                        this.pts.splice(i, 1);
                    }
                }
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

            case historyitem_NumLit_AddPt:
            {
                this.pts.push(data.newPr);
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
                writeString(w, data.newPr);
                break;
            }

            case historyitem_NumLit_AddPt:
            {
                writeObject(w, data.pt);
                break;
            }

            case historyitem_NumLit_SetPtCount:
            {
                writeLong(w, data.newPr);
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
                this.formatCode = readString(r);
                break;
            }

            case historyitem_NumLit_AddPt:
            {
                var pt = readObject(r);
                if(isRealObject(pt))
                {
                    this.pts.push(pt);
                }
                break;
            }

            case historyitem_NumLit_SetPtCount:
            {
                this.ptCount = readLong(r);
                break;
            }
        }
    }
};