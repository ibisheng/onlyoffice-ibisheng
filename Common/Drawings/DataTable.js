function CDTable()
{
    this.showHorzBorder = null;
    this.showKeys       = null;
    this.showOutline    = null;
    this.showVertBorder = null;
    this.spPr = null;
    this.txPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CDTable.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_DTable;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    setShowHorzBorder: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetShowHorzBorder, oldPr: this.showHorzBorder, newPr: pr});
        this.showHorzBorder = pr;
    },
    setShowKeys: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetShowKeys, oldPr: this.showHorzBorder, newPr: pr});
        this.showKeys = pr;
    },
    setShowOutline: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetShowOutline, oldPr: this.showHorzBorder, newPr: pr});
        this.showOutline = pr;
    },
    setShowVertBorder: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetShowVertBorder, oldPr: this.showHorzBorder, newPr: pr});
        this.showVertBorder = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetSpPr, oldPr: this.showHorzBorder, newPr: pr});
        this.spPr = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DTable_SetTxPr, oldPr: this.showHorzBorder, newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_DTable_SetShowHorzBorder:
            {
                this.showHorzBorder = data.oldPr;
                break;
            }

            case historyitem_DTable_SetShowKeys:
            {
                this.showKeys = data.oldPr;
                break;
            }
            case historyitem_DTable_SetShowOutline:
            {
                this.showOutline = data.oldPr;
                break;
            }

            case historyitem_DTable_SetShowVertBorder:
            {
                this.showVertBorder = data.oldPr;
                break;
            }
            case historyitem_DTable_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }

            case historyitem_DTable_SetTxPr:
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
            case historyitem_DTable_SetShowHorzBorder:
            {
                this.showHorzBorder = data.newPr;
                break;
            }

            case historyitem_DTable_SetShowKeys:
            {
                this.showKeys = data.newPr;
                break;
            }
            case historyitem_DTable_SetShowOutline:
            {
                this.showOutline = data.newPr;
                break;
            }

            case historyitem_DTable_SetShowVertBorder:
            {
                this.showVertBorder = data.newPr;
                break;
            }
            case historyitem_DTable_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }

            case historyitem_DTable_SetTxPr:
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
            case historyitem_DTable_SetShowHorzBorder:
            case historyitem_DTable_SetShowKeys:
            case historyitem_DTable_SetShowOutline:
            case historyitem_DTable_SetShowVertBorder:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }

            case historyitem_DTable_SetSpPr:
            case historyitem_DTable_SetTxPr:
            {
                this.spPr = data.newPr;
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
            case historyitem_DTable_SetShowHorzBorder:
            {
                if(r.GetBool())
                {
                    this.showHorzBorder = r.GetBool();
                }
                else
                {
                    this.showHorzBorder = null;
                }
                break;
            }

            case historyitem_DTable_SetShowKeys:
            {
                if(r.GetBool())
                {
                    this.showKeys = r.GetBool();
                }
                else
                {
                    this.showKeys = null;
                }
                break;
            }
            case historyitem_DTable_SetShowOutline:
            {
                if(r.GetBool())
                {
                    this.showOutline = r.GetBool();
                }
                else
                {
                    this.showOutline = null;
                }
                break;
            }

            case historyitem_DTable_SetShowVertBorder:
            {
                if(r.GetBool())
                {
                    this.showVertBorder = r.GetBool();
                }
                else
                {
                    this.showVertBorder = null;
                }
                break;
            }
            case historyitem_DTable_SetSpPr:
            {
                if(r.GetBool())
                {
                    this.spPr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.spPr = null;
                }
                break;
            }

            case historyitem_DTable_SetTxPr:
            {
                if(r.GetBool())
                {
                    this.txPr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.txPr = null;
                }
                break;
            }
        }
    }
};