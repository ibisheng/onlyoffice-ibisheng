function CChartText()
{
    this.rich = null;
    this.strRef = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartText.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ChartText;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id())
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetLong();
    },

    setRich: function(pr)
    {
        History.Add(this, {Type: historyitem_ChartText_SetRich, oldPr: this.rich, newPr: pr});
        this.rich = pr;
    },

    setStrRef: function(pr)
    {
        History.Add(this, {Type: historyitem_ChartText_SetStrRef, oldPr: this.strRef, newPr: pr});
        this.strRef = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartText_SetRich:
            {
                this.rich = data.oldPr;
                break;
            }
            case historyitem_ChartText_SetStrRef:
            {
                this.strRef = data.oldPr;
                break;
            }
        }
    },


    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartText_SetRich:
            {
                this.rich = data.newPr;
                break;
            }
            case historyitem_ChartText_SetStrRef:
            {
                this.strRef = data.newPr;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ChartText_SetRich:
            case historyitem_ChartText_SetStrRef:
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
            case historyitem_ChartText_SetRich:
            {
                this.rich = readObject(r);
                break;
            }
            case historyitem_ChartText_SetStrRef:
            {
                this.strRef = readObject(r);
                break;
            }
        }
    }
};