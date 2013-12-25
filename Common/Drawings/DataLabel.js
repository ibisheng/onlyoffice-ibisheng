var DLBL_POS_B = 0;
var DLBL_POS_BEST_FIT = 1;
var DLBL_POS_CTR     = 2;
var DLBL_POS_IN_BASE = 3;
var DLBL_POS_IN_END = 4;
var DLBL_POS_L = 5;
var DLBL_POS_OUT_END = 6;
var DLBL_POS_R = 7;
var DLBL_POS_T = 8;

function CDLbl()
{
    this.delete = null;
    this.dLblPos = null;
    this.idx = null;
    this.layout = null;
    this.numFmt = null;
    this.separator = null;
    this.showBubbleSize = null;
    this.showCatName = null;
    this.showLegendKey = null;
    this.showPercent = null;
    this.showSerName = null;
    this.showVal = null;
    this.spPr = null;
    this.tx = null;
    this.txPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDLbl.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_DLbl;
    },

    Write_ToBinary2: function(w)
    {
        w.Write_ToBinary2(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetDelete, oldPr: this.delete  , newPr: pr});
        this.delete = pr;
    },
    setDLblPos: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetDLblPos, oldPr: this.dLblPos  , newPr: pr});
        this.dLblPos = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetIdx, oldPr: this.idx  , newPr: pr});
        this.idx = pr;
    },
    setLayout: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetLayout, oldPr: this.layout  , newPr: pr});
        this.layout = pr;
    },
    setNumFmt: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetNumFmt, oldPr: this.numFmt  , newPr: pr});
        this.numFmt = pr;
    },
    setSeparator: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetSeparator, oldPr: this.separator  , newPr: pr});
        this.separator = pr;
    },
    setShowBubbleSize: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowBubbleSize, oldPr: this.showBubbleSize  , newPr: pr});
        this.showBubbleSize = pr;
    },
    setShowCatName: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowCatName, oldPr: this.showCatName  , newPr: pr});
        this.showCatName = pr;
    },
    setShowLegendKey: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowLegendKey, oldPr: this.showLegendKey  , newPr: pr});
        this.showLegendKey = pr;
    },
    setShowPercent: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowPercent, oldPr: this.showPercent  , newPr: pr});
        this.showPercent = pr;
    },
    setShowSerName: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowSerName, oldPr: this.showSerName  , newPr: pr});
        this.showSerName = pr;
    },
    setShowVal: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetShowVal, oldPr: this.showVal  , newPr: pr});
        this.showVal = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetSpPr, oldPr: this.spPr  , newPr: pr});
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetTx, oldPr: this.tx  , newPr: pr});
        this.tx = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbl_SetTxPr, oldPr: this.txPr  , newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_DLbl_SetDelete:
            {
                this.delete = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetDLblPos:
            {
                this.dLblPos = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetLayout:
            {
                this.layout = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetNumFmt:
            {
                this.numFmt = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetSeparator:
            {
                this.separator = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowBubbleSize:
            {
                this.showBubbleSize = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowCatName:
            {
                this.showCatName = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowLegendKey:
            {
                this.showLegendKey = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowPercent:
            {
                this.showPercent = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowSerName:
            {
                this.showSerName = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetShowVal:
            {
                this.showVal = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_DLbl_SetTxPr:
            {
                this.txPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_DLbl_SetDelete:
            {
                this.delete = data.newPr;
                break;
            }
            case historyitem_DLbl_SetDLblPos:
            {
                this.dLblPos = data.newPr;
                break;
            }
            case historyitem_DLbl_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_DLbl_SetLayout:
            {
                this.layout = data.newPr;
                break;
            }
            case historyitem_DLbl_SetNumFmt:
            {
                this.numFmt = data.newPr;
                break;
            }
            case historyitem_DLbl_SetSeparator:
            {
                this.separator = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowBubbleSize:
            {
                this.showBubbleSize = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowCatName:
            {
                this.showCatName = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowLegendKey:
            {
                this.showLegendKey = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowPercent:
            {
                this.showPercent = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowSerName:
            {
                this.showSerName = data.newPr;
                break;
            }
            case historyitem_DLbl_SetShowVal:
            {
                this.showVal = data.newPr;
                break;
            }
            case historyitem_DLbl_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_DLbl_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_DLbl_SetTxPr:
            {
                this.txPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        switch(data.Type)
        {
            case historyitem_DLbl_SetDLblPos:
            case historyitem_DLbl_SetIdx:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_DLbl_SetLayout:
            case historyitem_DLbl_SetSpPr:
            case historyitem_DLbl_SetTx:
            case historyitem_DLbl_SetTxPr:
            case historyitem_DLbl_SetNumFmt:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_DLbl_SetSeparator:
            {
                w.WriteBool(typeof  data.newPr === "string");
                if(typeof  data.newPr === "string")
                {
                    w.WriteString2(data.newPr);
                }
                break;
            }
            case historyitem_DLbl_SetDelete:
            case historyitem_DLbl_SetShowBubbleSize:
            case historyitem_DLbl_SetShowCatName:
            case historyitem_DLbl_SetShowLegendKey:
            case historyitem_DLbl_SetShowPercent:
            case historyitem_DLbl_SetShowSerName:
            case historyitem_DLbl_SetShowVal:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(isRealBool(data.newPr));
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_DLbl_SetDelete:
            {
                if(r.GetBool())
                {
                    this.delete = r.GetBool();
                }
                else
                {
                    this.delete = null;
                }
                break;
            }
            case historyitem_DLbl_SetDLblPos:
            {
                if(r.GetBool())
                {
                    this.dLblPos = r.GetLong();
                }
                else
                {
                    this.dLblPos = null;
                }
                break;
            }
            case historyitem_DLbl_SetIdx:
            {
                if(r.GetBool())
                {
                    this.idx = r.GetLong();
                }
                else
                {
                    this.idx = null;
                }
                break;
            }
            case historyitem_DLbl_SetLayout:
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
            case historyitem_DLbl_SetNumFmt:
            {
                if(r.GetBool())
                {
                    this.numFmt = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.numFmt = null;
                }
                break;
            }
            case historyitem_DLbl_SetSeparator:
            {
                if(r.GetBool())
                {
                    this.separator = r.GetString2();
                }
                else
                {
                    this.separator = null;
                }
                break;

            }
            case historyitem_DLbl_SetShowBubbleSize:
            {
                if(r.GetBool())
                {
                    this.showBubbleSize = r.GetBool();
                }
                else
                {
                    this.showBubbleSize = null;
                }
                break;
            }
            case historyitem_DLbl_SetShowCatName:
            {
                if(r.GetBool())
                {
                    this.showCatName = r.GetBool();
                }
                else
                {
                    this.showCatName = null;
                }
                break;
            }
            case historyitem_DLbl_SetShowLegendKey:
            {
                if(r.GetBool())
                {
                    this.showLegendKey = r.GetBool();
                }
                else
                {
                    this.showLegendKey = null;
                }
                break;
            }
            case historyitem_DLbl_SetShowPercent:
            {
                if(r.GetBool())
                {
                    this.showPercent = r.GetBool();
                }
                else
                {
                    this.showPercent = null;
                }
                break;
            }
            case historyitem_DLbl_SetShowSerName:
            {
                if(r.GetBool())
                {
                    this.showSerName = r.GetBool();
                }
                else
                {
                    this.showSerName = null;
                }
                break;
            }
            case historyitem_DLbl_SetShowVal:
            {
                if(r.GetBool())
                {
                    this.showVal = r.GetBool();
                }
                else
                {
                    this.showVal = null;
                }
                break;
            }
            case historyitem_DLbl_SetSpPr:
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
            case historyitem_DLbl_SetTx:
            {
                if(r.GetBool())
                {
                    this.tx = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.tx = null;
                }
                break;
            }
            case historyitem_DLbl_SetTxPr:
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