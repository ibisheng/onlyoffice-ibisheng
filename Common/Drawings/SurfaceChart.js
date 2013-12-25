function CSurfaceChart()
{
    this.axId = null;
    this.bandFmts = [];
    this.series = null;
    this.wireframe = null;

    this.Id = g_oTableId.Get_NewId();
}

CSurfaceChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SurfaceChart;
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

    setAxId: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceChart_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },

    addBandFmt: function(fmt)
    {
        History.Add(this, {Type: historyitem_SurfaceChart_AddBandFmt, pr: fmt});
        this.bandFmts.push(fmt);
    },

    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_SurfaceChart_AddSer, pr: ser});
        this.series.push(ser);
    },

    setWireframe: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceChart_SetWireframe, oldPr: this.wireframe, newPr: pr});
        this.wireframe = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_SurfaceChart_SetAxId:
            {
                this.axId = data.oldPr;
                break;
            }
            case historyitem_SurfaceChart_AddBandFmt:
            {
                for(var i = this.bandFmts.length - 1; i > -1; --i)
                {
                    if(this.bandFmts[i] === data.pr)
                    {
                        this.bandFmts.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_SurfaceChart_AddSer:
            {
                for(var i = this.series.length - 1; i > -1; --i)
                {
                    if(this.series[i] === data.pr)
                    {
                        this.series.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_SurfaceChart_SetWireframe:
            {
                this.wireframe = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_SurfaceChart_SetAxId:
            {
                this.axId = data.newPr;
                break;
            }
            case historyitem_SurfaceChart_AddBandFmt:
            {
                this.bandFmts.push(data.pr);
                break;
            }
            case historyitem_SurfaceChart_AddSer:
            {
                this.series.push(data.pr);
                break;
            }
            case historyitem_SurfaceChart_SetWireframe:
            {
                this.wireframe = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_SurfaceChart_SetAxId:
            {
                w.WriteLong(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_SurfaceChart_AddBandFmt:
            case historyitem_SurfaceChart_AddSer:
            {
                w.WriteBool(isRealObject(data.pr));
                if(isRealObject(data.pr))
                {
                    w.WriteString(data.pr.Get_Id());
                }
                break;
            }
            case historyitem_SurfaceChart_SetWireframe:
            {
                w.WriteLong(isRealBool(data.newPr));
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
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_SurfaceChart_SetAxId:
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
            case historyitem_SurfaceChart_AddBandFmt:
            {
                if(r.GetBool())
                {
                    var fmt  = g_oTableId.Get_ById(r.GetString2());
                    if(isRealObject(fmt))
                    {
                        this.bandFmts.push(fmt);
                    }
                }
                break;
            }
            case historyitem_SurfaceChart_AddSer:
            {
                if(r.GetBool())
                {
                    var ser  = g_oTableId.Get_ById(r.GetString2());
                    if(isRealObject(ser))
                    {
                        this.series.push(ser);
                    }
                }
                break;
            }
            case historyitem_SurfaceChart_SetWireframe:
            {
                if(r.GetBool())
                {
                    this.wireframe = r.GetBool();
                }
                else
                {
                    this.wireframe = null;
                }
                break;
            }
        }
    }

};