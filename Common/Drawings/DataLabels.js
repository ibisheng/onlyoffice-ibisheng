function CDLbls()
{
    this.delete          = null;
    this.dLbl            = null;
    this.dLblPos         = null;
    this.leaderLines     = null;
    this.numFmt          = null;
    this.separator       = null;
    this.showBubbleSize  = null;
    this.showCatName     = null;
    this.showLeaderLines = null;
    this.showLegendKey   = null;
    this.showPercent     = null;
    this.showSerName     = null;
    this.showVal         = null;
    this.spPr            = null;
    this.txPr            = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDLbls.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_DLbls;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetDelete, oldPr: this.delete, newPr: pr});
        this.delete = pr;
    },
    setDLbl: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetDLbl, oldPr: this.dLbl, newPr: pr});
        this.dLbl = pr;
    },
    setDLblPos: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetDLblPos, oldPr: this.dLblPos, newPr: pr});
        this.dLblPos = pr;
    },
    setLeaderLines: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetLeaderLines, oldPr: this.leaderLines, newPr: pr});
        this.leaderLines = pr;
    },
    setNumFmt: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetNumFmt, oldPr: this.numFmt, newPr: pr});
        this.numFmt = pr;
    },
    setSeparator: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetSeparator, oldPr: this.separator, newPr: pr});
        this.separator = pr;
    },
    setShowBubbleSize: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowBubbleSize, oldPr: this.showBubbleSize, newPr: pr});
        this.showBubbleSize = pr;
    },
    setShowCatName: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowCatName, oldPr: this.showCatName, newPr: pr});
        this.showCatName = pr;
    },
    setShowLeaderLines: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowLeaderLines, oldPr: this.showLeaderLines, newPr: pr});
        this.showLeaderLines = pr;
    },
    setShowLegendKey: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowLegendKey, oldPr: this.showLegendKey, newPr: pr});
        this.showLegendKey = pr;
    },
    setShowPercent: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowPercent, oldPr: this.showPercent, newPr: pr});
        this.showPercent = pr;
    },
    setShowSerName: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowSerName, oldPr: this.showSerName, newPr: pr});
        this.showSerName = pr;
    },
    setShowVal: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetShowVal, oldPr: this.showVal, newPr: pr});
        this.showVal = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DLbls_SetTxPr, oldPr: this.txPr, newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {},

    Redo: function(data)
    {},

    Save_Changes: function(data, w)
    {},

    Load_Changes: function(r)
    {}
};