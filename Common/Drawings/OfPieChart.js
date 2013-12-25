var OF_PIE_TYPE_BAR = 0;
var OF_PIE_TYPE_PIE = 1;

var SPLIT_TYPE_AUTO = 0;
var SPLIT_TYPE_CUST = 1;
var SPLIT_TYPE_PERCENT = 2;
var SPLIT_TYPE_POS = 3;
var SPLIT_TYPE_VAL = 4;

function COfPieChart()
{
    this.custSplit     = [];
    this.dLbls         = null;
    this.gapWidth      = null;
    this.ofPieType     = null;
    this.secondPieSize = null;
    this.series        = null;
    this.serLines      = null;
    this.splitPos      = null;
    this.splitType     = null;
    this.varyColors    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

COfPieChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_OfPieChart;
    },

    addCustSplit: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_AddCustSplit, nSplit:pr, pos: this.custSplit.length});
        this.custSplit.push(pr);
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setGapWidth: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetGapWidth, oldPr: this.gapWidth, newPr: pr});
        this.gapWidth = pr;
    },
    setOfPieType: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetOfPieType, oldPr: this.ofPieType, newPr: pr});
        this.ofPieType = pr;
    },
    setSecondPieSize: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetSecondPieSize, oldPr: this.secondPieSize, newPr: pr});
        this.secondPieSize = pr;
    },
    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_OfPieChart_AddSer, ser: ser});
        this.series.push(ser);
    },
    setSerLines: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetSerLines, oldPr: this.serLines, newPr: pr});
        this.serLines = pr;
    },
    setSplitPos: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetSplitPos, oldPr: this.splitPos, newPr: pr});
        this.splitPos = pr;
    },
    setSplitType: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetSplitType, oldPr: this.splitType, newPr: pr});
        this.splitType = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_OfPieChart_SetVaryColors, oldPr: this.varyColors, newPr: pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_OfPieChart_AddCustSplit:
            {
                if(this.custSplit[data.pos] === data.nSplit)
                    this.custSplit.splice(data.pos, 1);
                break;
            }
            case historyitem_OfPieChart_SetDLbls:
            {
                 this.dLbls = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetGapWidth:
            {
                 this.gapWidth = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetOfPieType:
            {
                 this.ofPieType = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetSecondPieSize:
            {
                 this.secondPieSize = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_AddSer:
            {
                for(var i = this.series.length - 1; i > -1; --i)
                {
                    if(this.series[i] === data.ser)
                    {
                        this.series.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_OfPieChart_SetSerLines:
            {
                 this.serLines = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetSplitPos:
            {
                 this.splitPos = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetSplitType:
            {
                 this.splitType = data.oldPr;
                 break;
            }
            case historyitem_OfPieChart_SetVaryColors:
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
            case historyitem_OfPieChart_AddCustSplit:
            {
                this.custSplit.splice(data.pos, data.nSplit);
                break;
            }
            case historyitem_OfPieChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetGapWidth:
            {
                this.gapWidth = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetOfPieType:
            {
                this.ofPieType = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetSecondPieSize:
            {
                this.secondPieSize = data.newPr;
                break;
            }
            case historyitem_OfPieChart_AddSer:
            {
                if(isRealObject(data.ser))
                {
                    this.series.push(data.ser);
                }
                break;
            }
            case historyitem_OfPieChart_SetSerLines:
            {
                this.serLines = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetSplitPos:
            {
                this.splitPos = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetSplitType:
            {
                this.splitType = data.newPr;
                break;
            }
            case historyitem_OfPieChart_SetVaryColors:
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
            case historyitem_OfPieChart_AddCustSplit:
            {
                w.WriteBool(isRealNumber(data.pos) && isRealNumber(data.nSplit));
                if(isRealNumber(data.pos) && isRealNumber(data.nSplit))
                {
                    w.WriteLong(data.pos);
                    w.WriteLong(data.nSplit);
                }
                break;
            }
            case historyitem_OfPieChart_SetDLbls:
            case historyitem_OfPieChart_SetSerLines:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_OfPieChart_SetGapWidth:
            case historyitem_OfPieChart_SetOfPieType:
            case historyitem_OfPieChart_SetSecondPieSize:
            case historyitem_OfPieChart_SetSplitType:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_OfPieChart_AddSer:
            {
                w.WriteBool(isRealObject(data.ser));
                if(isRealObject(data.ser))
                {
                    w.WriteString2(data.ser.Get_Id());
                }
                break;
            }
            case historyitem_OfPieChart_SetSplitPos:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteDouble(data.newPr);
                }
                break;
            }
            case historyitem_OfPieChart_SetVaryColors:
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

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_OfPieChart_AddCustSplit:
            {
                if(r.GetBool())
                {
                    var pos = r.GetLong();
                    var nSplit = r.GetLong();
                    this.custSplit.splice(pos, nSplit);
                }
                break;
            }
            case historyitem_OfPieChart_SetDLbls:
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
            case historyitem_OfPieChart_SetGapWidth:
            {
                if(r.GetBool())
                {
                    this.gapWidth = r.GetLong();
                }
                else
                {
                    this.gapWidth = null;
                }
                break;
            }
            case historyitem_OfPieChart_SetOfPieType:
            {
                if(r.GetBool())
                {
                    this.ofPieType = r.GetLong();
                }
                else
                {
                    this.ofPieType = null;
                }
                break;
            }
            case historyitem_OfPieChart_SetSecondPieSize:
            {
                if(r.GetBool())
                {
                    this.secondPieSize = r.GetLong();
                }
                else
                {
                    this.secondPieSize = null;
                }
                break;
            }
            case historyitem_OfPieChart_AddSer:
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
            case historyitem_OfPieChart_SetSerLines:
            {
                if(r.GetBool())
                {
                    this.serLines = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.serLines = null;
                }
                break;
            }
            case historyitem_OfPieChart_SetSplitPos:
            {
                if(r.GetBool())
                {
                    this.splitPos = r.GetDouble();
                }
                else
                {
                    this.splitPos = null;
                }
                break;
            }
            case historyitem_OfPieChart_SetSplitType:
            {
                if(r.GetBool())
                {
                    this.splitType = r.GetLong();
                }
                else
                {
                    this.splitType = null;
                }
                break;
            }
            case historyitem_OfPieChart_SetVaryColors:
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