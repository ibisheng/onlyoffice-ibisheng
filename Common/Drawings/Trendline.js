var TRENDLINE_TYPE_EXP = 0;
var TRENDLINE_TYPE_LINEAR = 1;
var TRENDLINE_TYPE_LOG = 2;
var TRENDLINE_TYPE_MOVING_AVG = 3;
var TRENDLINE_TYPE_POLY = 4;
var TRENDLINE_TYPE_POWER = 5;

function CTrendLine()
{
    this.backward       = null;
    this.dispEq         = null;
    this.dispRSqr       = null;
    this.forward        = null;
    this.intercept      = null;
    this.name           = null;
    this.order          = null;
    this.period         = null;
    this.spPr           = null;
    this.trendlineLbl   = null;
    this.trendlineType  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTrendLine.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_TrendLine;
    },

    setBackward: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetBackward, oldPr: this.backward, newPr: pr});
        this.backward = pr;
    },

    setDispEq: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetDispEq, oldPr: this.dispEq, newPr: pr});
        this.dispEq = pr;
    },

    setDispRSqr: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetDispRSqr, oldPr: this.dispRSqr, newPr: pr});
        this.dispRSqr = pr;
    },

    setForward: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetForward, oldPr: this.forward, newPr: pr});
        this.forward = pr;
    },

    setIntercept: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetIntercept, oldPr: this.intercept, newPr: pr});
        this.intercept = pr;
    },

    setName: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetName, oldPr: this.name, newPr: pr});
        this.name = pr;
    },

    setOrder: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },

    setPeriod: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetPeriod, oldPr: this.period, newPr: pr});
        this.period = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },

    setTrendlineLbl: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetTrendlineLbl, oldPr: this.trendlineLbl, newPr: pr});
        this.trendlineLbl = pr;
    },

    setTrendlineType: function(pr)
    {
        History.Add(this, {Type:historyitem_Trendline_SetTrendlineType, oldPr: this.trendlineType, newPr: pr});
        this.trendlineType = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Trendline_SetBackward:
            {
                this.backward = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetDispEq:
            {
                this.dispEq = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetDispRSqr:
            {
                this.dispRSqr = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetForward:
            {
                this.forward = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetIntercept:
            {
                this.intercept = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetName:
            {
                this.name = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetPeriod:
            {
                this.period = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetTrendlineLbl:
            {
                this.trendlineLbl = data.oldPr;
                break;
            }
            case historyitem_Trendline_SetTrendlineType:
            {
                this.trendlineType = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Trendline_SetBackward:
            {
                this.backward = data.newPr;
                break;
            }
            case historyitem_Trendline_SetDispEq:
            {
                this.dispEq = data.newPr;
                break;
            }
            case historyitem_Trendline_SetDispRSqr:
            {
                this.dispRSqr = data.newPr;
                break;
            }
            case historyitem_Trendline_SetForward:
            {
                this.forward = data.newPr;
                break;
            }
            case historyitem_Trendline_SetIntercept:
            {
                this.intercept = data.newPr;
                break;
            }
            case historyitem_Trendline_SetName:
            {
                this.name = data.newPr;
                break;
            }
            case historyitem_Trendline_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_Trendline_SetPeriod:
            {
                this.period = data.newPr;
                break;
            }
            case historyitem_Trendline_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_Trendline_SetTrendlineLbl:
            {
                this.trendlineLbl = data.newPr;
                break;
            }
            case historyitem_Trendline_SetTrendlineType:
            {
                this.trendlineType = data.newPr;
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Trendline_SetBackward:
            case historyitem_Trendline_SetForward:
            case historyitem_Trendline_SetIntercept:
            {
                writeDouble(w, data.newPr);
                break;
            }
            case historyitem_Trendline_SetDispEq:
            case historyitem_Trendline_SetDispRSqr:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_Trendline_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_Trendline_SetOrder:
            case historyitem_Trendline_SetPeriod:
            case historyitem_Trendline_SetTrendlineType:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_Trendline_SetSpPr:
            case historyitem_Trendline_SetTrendlineLbl:
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
            case historyitem_Trendline_SetBackward:
            {
                this.backward = readDouble(r);
                break;
            }
            case historyitem_Trendline_SetDispEq:
            {
                this.dispEq = readBool(r);
                break;
            }
            case historyitem_Trendline_SetDispRSqr:
            {
                this.dispRSqr = readBool(r);
                break;
            }
            case historyitem_Trendline_SetForward:
            {
                this.forward = readDouble(r);
                break;
            }
            case historyitem_Trendline_SetIntercept:
            {
                this.intercept = readDouble(r);
                break;
            }
            case historyitem_Trendline_SetName:
            {
                this.name = readString(r);
                break;
            }
            case historyitem_Trendline_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_Trendline_SetPeriod:
            {
                this.period = readLong(r);
                break;
            }
            case historyitem_Trendline_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_Trendline_SetTrendlineLbl:
            {
                this.trendlineLbl = readObject(r);
                break;
            }
            case historyitem_Trendline_SetTrendlineType:
            {
                this.trendlineType = readLong(r);
                break;
            }
        }
    }
};

