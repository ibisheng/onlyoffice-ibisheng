function CPieChart()
{
    this.dLbls         = null;
    this.firstSliceAng = null;
    this.series        = [];
    this.varyColors    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPieChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PieChart;
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

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_PieChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },

    setFirstSliceAng: function(pr)
    {
        History.Add(this, {Type: historyitem_PieChart_SetFirstSliceAng, oldPr: this.firstSliceAng, newPr: pr});
        this.firstSliceAng = pr;
    },

    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_PieChart_SetFirstSliceAng, ser: ser});
        this.series.push(ser);
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_PieChart_SetVaryColors, oldPr: this.varyColors, newPr: pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PieChart_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_PieChart_SetFirstSliceAng:
            {
                this.firstSliceAng = data.oldPr;
                break;
            }
            case historyitem_PieChart_AddSer:
            {
                this.series.push(data.ser);
                break;
            }
            case historyitem_PieChart_SetVaryColors:
            {
                this.varyColors = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PieChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_PieChart_SetFirstSliceAng:
            {
                this.firstSliceAng = data.newPr;
                break;
            }
            case historyitem_PieChart_AddSer:
            {
                this.series.push(data.ser);
                break;
            }
            case historyitem_PieChart_SetVaryColors:
            {
                this.varyColors = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PieChart_SetDLbls:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_PieChart_SetFirstSliceAng:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_PieChart_AddSer:
            {
                w.WriteBool(isRealObeject(data.ser));
                if(isRealObeject(data.ser))
                {
                    w.WriteString2(data.ser.Get_Id());
                }
                break;
            }
            case historyitem_PieChart_SetVaryColors:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PieChart_SetDLbls:
            {
                if(r.GetBool())
                {
                    this.dLbls = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.dLbls = null;
                }
                break;
            }
            case historyitem_PieChart_SetFirstSliceAng:
            {
                if(r.GetBool())
                {
                    this.firstSliceAng = r.GetLong();
                }
                else
                {
                    this.firstSliceAng = null;
                }
                break;
            }
            case historyitem_PieChart_AddSer:
            {
                if(r.GetBool())
                {
                    var ser = g_oTableId.Get_ById(r.GetString2());
                    if(isRealObject(ser))
                    {
                        this.series.push(ser);
                    }
                }
                break;
            }
            case historyitem_PieChart_SetVaryColors:
            {
                if(r.GetBool())
                {
                    this.varyColors = r.GetBool();
                }
                else
                {
                    this.varyColors = null;
                }
                break;
            }
        }
    }

};