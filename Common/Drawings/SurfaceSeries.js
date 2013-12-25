function CSurfaceSeries()
{
    this.cat   = null;
    this.idx   = null;
    this.order = null;
    this.spPr  = null;
    this.tx    = null;
    this.val   = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSurfaceSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_SurfaceSeries;
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

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_SurfaceSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_SurfaceSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_SurfaceSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_SurfaceSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_SurfaceSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_SurfaceSeries_SetVal:
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
            case historyitem_SurfaceSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_SurfaceSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_SurfaceSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_SurfaceSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_SurfaceSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_SurfaceSeries_SetVal:
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
            case historyitem_SurfaceSeries_SetCat:
            case historyitem_SurfaceSeries_SetSpPr:
            case historyitem_SurfaceSeries_SetTx:
            case historyitem_SurfaceSeries_SetVal:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_SurfaceSeries_SetIdx:
            case historyitem_SurfaceSeries_SetOrder:
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
            case historyitem_SurfaceSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_SurfaceSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_SurfaceSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_SurfaceSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_SurfaceSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_SurfaceSeries_SetVal:
            {
                this.val = readObject(r);
                break;
            }
        }
    },


    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetCat, oldPr: this.cat, newPr: pr});
        this.cat = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetTx, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_SurfaceSeries_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    }
};