var LEGEND_POS_L = 0;
var LEGEND_POS_T = 1;
var LEGEND_POS_R = 2;
var LEGEND_POS_B = 3;
var LEGEND_POS_TR = 4;

function CLegend()
{
    this.layout = null;
    this.legendEntryes = [];
    this.legendPos = null;
    this.overlay = null;
    this.spPr = null;
    this.txPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CLegend.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_Legend;
    },

    setLayout: function(layout)
    {
        History.Add(this, {Type: historyitem_Legend_SetLayout,oldPr: this.layout, newPr: layout});
        this.layout = layout;
    },
    addLegendEntry: function(legendEntry)
    {
        History.Add(this, {Type: historyitem_Legend_AddLegendEntry, entry: legendEntry});
        this.legendEntryes.push(legendEntry);
    },
    setLegendPos: function(legendPos)
    {
        History.Add(this, {Type: historyitem_Legend_SetLegendPos,oldPr: this.legendPos, newPr: legendPos});
        this.legendPos = legendPos;
    },
    setOverlay: function(overlay)
    {
        History.Add(this, {Type: historyitem_Legend_SetOverlay,oldPr: this.overlay, newPr: overlay});
        this.overlay = overlay;
    },
    setSpPr: function(spPr)
    {
        History.Add(this, {Type: historyitem_Legend_SetSpPr,oldPr: this.spPr, newPr: spPr});
        this.spPr = spPr;
    },
    setTxPr: function(txPr)
    {
        History.Add(this, {Type: historyitem_Legend_SetTxPr,oldPr: this.txPr, newPr: txPr});
        this.txPr = txPr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Legend_SetLayout:
            {
                this.layout = data.oldPr;
                break;
            }
            case historyitem_Legend_AddLegendEntry:
            {
                for(var i = this.legendEntryes.length; i > -1; --i)
                {
                    if(this.legendEntryes[i].Get_Id() === data.entry)
                    {
                        this.legendEntryes.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_Legend_SetLegendPos:
            {
                this.legendPos = data.oldPr;
                break;
            }
            case historyitem_Legend_SetOverlay:
            {
                this.overlay = data.oldPr;
                break;
            }
            case historyitem_Legend_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_Legend_SetTxPr:
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
            case historyitem_Legend_SetLayout:
            {
                this.layout = data.newPr;
                break;
            }
            case historyitem_Legend_AddLegendEntry:
            {
                this.legendEntryes.push(data.entry);
                break;
            }
            case historyitem_Legend_SetLegendPos:
            {
                this.legendPos = data.newPr;
                break;
            }
            case historyitem_Legend_SetOverlay:
            {
                this.overlay = data.newPr;
                break;
            }
            case historyitem_Legend_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_Legend_SetTxPr:
            {
                this.txPr = data.newPr;
                break;
            }

        }
    },

    Save_Changes: function()
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Legend_SetLayout:
            case historyitem_Legend_SetSpPr:
            case historyitem_Legend_SetTxPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_Legend_AddLegendEntry:
            {
                w.WriteBool(isRealObject(data.entry));
                if(isRealObject(data.entry))
                {
                    w.WriteString2(data.entry.Get_Id());
                }
                break;
            }
            case historyitem_Legend_SetLegendPos:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_Legend_SetOverlay:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function()
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_Legend_SetLayout:
            {
                if(r.GetBool())
                {
                    this.layout = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.layout = null;
                }
                break;
            }
            case historyitem_Legend_AddLegendEntry:
            {
                if(r.GetBool())
                {
                    var entry = g_oTableId.Get_ById(r.GetString2());
                    if(isRealObject(entry))
                    {
                        this.legendEntryes.push(entry);
                    }
                }
                break;
            }
            case historyitem_Legend_SetLegendPos:
            {
                if(r.GetBool())
                {
                    this.legendPos = r.GetLong();
                }
                else
                {
                    this.legendPos = null;
                }
                break;
            }
            case historyitem_Legend_SetOverlay:
            {
                if(r.GetBool())
                {
                    this.overlay = r.GetBool();
                }
                else
                {
                    this.overlay = null;
                }
                break;
            }
            case historyitem_Legend_SetSpPr:
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
            case historyitem_Legend_SetTxPr:
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