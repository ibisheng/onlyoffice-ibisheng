function CPlotArea()
{
    this.chart = null;
    this.catAx = null;
    this.dateAx = null;
    this.dTable = null;
    this.layout = null;
    this.serAx = null;
    this.spPr = null;
    this.valAx = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPlotArea.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PlotArea;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setChart: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetChart, oldPr: this.chart, newPr:pr});
        this.chart = pr;
    },

    setCatAx: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetCatAx, oldPr: this.catAx, newPr:pr});
        this.catAx = pr;
    },

    setDateAx: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetDateAx, oldPr: this.dateAx, newPr:pr});
        this.dateAx = pr;
    },

    setDTable: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetDTable, oldPr: this.dTable, newPr:pr});
        this.dTable = pr;
    },

    setLayout: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetLayout, oldPr: this.layout, newPr:pr});
        this.layout = pr;
    },

    setSerAx: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetSerAx, oldPr: this.serAx, newPr:pr});
        this.serAx = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetSpPr, oldPr: this.spPr, newPr:pr});
        this.spPr = pr;
    },

    setValAx: function(pr)
    {
        History.Add(this, {Type: historyitem_PlotArea_SetValAx, oldPr: this.valAx, newPr:pr});
        this.valAx = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PlotArea_SetCatAx:
            {
                this.catAx = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetDateAx:
            {
                this.dateAx = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetDTable:
            {
                this.dTable = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetLayout:
            {
                this.layout = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetSerAx:
            {
                this.serAx = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_PlotArea_SetValAx:
            {
                this.valAx = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PlotArea_SetCatAx:
            {
                this.catAx = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetDateAx:
            {
                this.dateAx = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetDTable:
            {
                this.dTable = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetLayout:
            {
                this.layout = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetSerAx:
            {
                this.serAx = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_PlotArea_SetValAx:
            {
                this.valAx = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PlotArea_SetCatAx:
            case historyitem_PlotArea_SetDateAx:
            case historyitem_PlotArea_SetDTable:
            case historyitem_PlotArea_SetLayout:
            case historyitem_PlotArea_SetSerAx:
            case historyitem_PlotArea_SetSpPr:
            case historyitem_PlotArea_SetValAx:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PlotArea_SetCatAx:
            {
                this.catAx = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetDateAx:
            {
                this.dateAx = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetDTable:
            {
                this.dTable = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetLayout:
            {
                this.layout = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetSerAx:
            {
                this.serAx = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_PlotArea_SetValAx:
            {
                this.valAx = readObject(r);
                break;
            }
        }
    }
};