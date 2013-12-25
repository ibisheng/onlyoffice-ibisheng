function CBubbleSeries()
{
    this.bubble3D         = null;
    this.bubbleSize       = null;
    this.dLbls            = null;
    this.dPt              = null;
    this.errBars          = null;
    this.idx              = null;
    this.invertIfNegative = null;
    this.order            = null;
    this.spPr             = null;
    this.trendline        = null;
    this.tx               = null;
    this.xVal             = null;
    this.yVal             = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBubbleSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_BubbleSeries;
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
            case historyitem_BubbleSeries_SetBubble3D:
            {
                this.bubble3D = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetBubbleSize:
            {
                this.bubbleSize = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetXVal:
            {
                this.xVal = data.oldPr;
                break;
            }
            case historyitem_BubbleSeries_SetYVal:
            {
                this.yVal = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BubbleSeries_SetBubble3D:
            {
                this.bubble3D = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetBubbleSize:
            {
                this.bubbleSize = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetXVal:
            {
                this.xVal = data.newPr;
                break;
            }
            case historyitem_BubbleSeries_SetYVal:
            {
                this.yVal = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_BubbleSeries_SetBubble3D:
            case historyitem_BubbleSeries_SetInvertIfNegative:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_BubbleSeries_SetBubbleSize:
            case historyitem_BubbleSeries_SetDLbls:
            case historyitem_BubbleSeries_SetDPt:
            case historyitem_BubbleSeries_SetErrBars:
            case historyitem_BubbleSeries_SetSpPr:
            case historyitem_BubbleSeries_SetTrendline:
            case historyitem_BubbleSeries_SetTx:
            case historyitem_BubbleSeries_SetXVal:
            case historyitem_BubbleSeries_SetYVal:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_BubbleSeries_SetIdx:
            case historyitem_BubbleSeries_SetOrder:
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
            case historyitem_BubbleSeries_SetBubble3D:
            {
                this.bubble3D = readBool(r);
                break;
            }
            case historyitem_BubbleSeries_SetBubbleSize:
            {
                this.bubbleSize = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetErrBars:
            {
                this.errBars = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_BubbleSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = readBool(r);
                break;
            }
            case historyitem_BubbleSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_BubbleSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetTrendline:
            {
                this.trendline = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetXVal:
            {
                this.xVal = readObject(r);
                break;
            }
            case historyitem_BubbleSeries_SetYVal:
            {
                this.yVal = readObject(r);
                break;
            }
        }
    },

    setBubble3D: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetBubble3D, oldPr: this.bubble3D, newPr: pr});
        this.bubble3D = pr;
    },
    setBubbleSize: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetBubbleSize, oldPr: this.bubbleSize, newPr: pr});
        this.bubbleSize = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetDPt, oldPr: this.dPt, newPr: pr});
        this.dPt = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetErrBars, oldPr: this.errBars, newPr: pr});
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setInvertIfNegative: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetInvertIfNegative, oldPr: this.invertIfNegative, newPr: pr});
        this.invertIfNegative = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetTrendline, oldPr: this.trendline, newPr: pr});
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetTx, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setXVal: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetXVal, oldPr: this.xVal, newPr: pr});
        this.xVal = pr;
    },
    setYVal: function(pr)
    {
        History.Add(this, {Type: historyitem_BubbleSeries_SetYVal, oldPr: this.yVal, newPr: pr});
        this.yVal = pr;
    }
};