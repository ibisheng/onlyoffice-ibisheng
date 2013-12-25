function CRadarChart()
{
    this.axId        = null;
    this.dLbls       = null;
    this.radarStyle  = null;
    this.series      = [];
    this.varyColors  = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CRadarChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_RadarChart;
    },

    setAxId: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarChart_SetAxId, oldPr: this.axId, newPr:pr});
        this.axId = pr;
    },

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarChart_SetDLbls, oldPr: this.dLbls, newPr:pr});
        this.dLbls = pr;
    },

    setRadarStyle: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarChart_SetRadarStyle, oldPr: this.radarStyle, newPr:pr});
        this.radarStyle = pr;
    },

    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_RadarChart_AddSer, ser: ser});
        this.series.push(ser);
    },

    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarChart_SetVaryColors, oldPr: this.varyColors, newPr:pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_RadarChart_SetAxId:
            {
                this.axId = data.oldPr;
                break;
            }
            case historyitem_RadarChart_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_RadarChart_SetRadarStyle:
            {
                this.radarStyle = data.oldPr;
                break;
            }
            case historyitem_RadarChart_AddSer:
            {
                for(var i = this.series.length; i >  -1; --i)
                {
                    if(this.series[i] === data.ser)
                    {
                        this.series.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_RadarChart_SetVaryColors:
            {
                this.varyColors = data.oldPr;
                break;
            }
        }
    } ,

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_RadarChart_SetAxId:
            {
                this.axId = data.newPr;
                break;
            }
            case historyitem_RadarChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_RadarChart_SetRadarStyle:
            {
                this.radarStyle = data.newPr;
                break;
            }
            case historyitem_RadarChart_AddSer:
            {
                this.series.push(data.ser);
                break;
            }
            case historyitem_RadarChart_SetVaryColors:
            {
                this.varyColors = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_RadarChart_SetAxId:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_RadarChart_SetDLbls:
            case historyitem_RadarChart_SetRadarStyle:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_RadarChart_AddSer:
            {
                w.WriteBool(isRealObject(data.ser));
                if(isRealObject(data.ser))
                {
                    w.WriteString2(data.ser.Get_Id())
                }
                break;
            }
            case historyitem_RadarChart_SetVaryColors:
            {
                this.varyColors = data.newPr;
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        switch(data.Type)
        {
            case historyitem_RadarChart_SetAxId:
            {
                if(r.GetBool())
                {
                    this.axId = r.GetLong();
                }
                else
                {
                    this.axId = null;
                }
                break;
            }
            case historyitem_RadarChart_SetDLbls:
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
            case historyitem_RadarChart_SetRadarStyle:
            {
                if(r.GetBool())
                {
                    this.radarStyle = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.radarStyle = null;
                }
                break;
            }
            case historyitem_RadarChart_AddSer:
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
            case historyitem_RadarChart_SetVaryColors:
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
