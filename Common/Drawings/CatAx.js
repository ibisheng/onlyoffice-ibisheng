

function CCatAx()
{
    this.auto = null;
    this.axId = null;
    this.axPos = null;
    this.crossAx = null;
    this.crosses = null;
    this.crossesAt = null;
    this.bDelete = null;
    this.lblAlgn = null;
    this.lblOffset = null;
    this.majorGridlines = null;
    this.majorTickMark = null;
    this.minorGridlines = null;
    this.minorTickMark = null;
    this.noMultiLvlLbl = null;

    this.numFmt       = null;
    this.scaling      = null;
    this.spPr         = null;
    this.tickLblPos   = null;
    this.tickLblSkip  = null;
    this.tickMarkSkip = null;
    this.title        = null;
    this.txPr         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CCatAx.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_CatAx;
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

    setAuto: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetAuto, oldPr: this.auto, newPr: pr});
        this.auto = pr;
    },
    setAxId : function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },
    setAxPos: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetAxPos, oldPr: this.axPos, newPr: pr});
        this.axPos = pr;
    },
    setCrossAx: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetCrossAx, oldPr: this.crossAx, newPr: pr});
        this.crossAx = pr;
    },
    setCrosses: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetCrosses, oldPr: this.crosses, newPr: pr});
        this.crosses = pr;
    },
    setCrossesAt: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetCrossesAt, oldPr: this.crossesAt, newPr: pr});
        this.crossesAt = pr;
    },
    setDelete: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetDelete, oldPr: this.bDelete, newPr: pr});
        this.bDelete = pr;
    },
    setLblAlgn: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetLblAlgn, oldPr: this.lblAlgn, newPr: pr});
        this.lblAlgn = pr;
    },
    setLblOffset: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetLblOffset, oldPr: this.lblOffset, newPr: pr});
        this.lblOffset = pr;
    },
    setMajorGridlines: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetMajorGridlines, oldPr: this.majorGridlines, newPr: pr});
        this.majorGridlines = pr;
    },
    setMajorTickMark: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetMajorTickMark, oldPr: this.majorTickMark, newPr: pr});
        this.majorTickMark = pr;
    },
    setMinorGridlines: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetMiniGridlines, oldPr: this.minorGridlines, newPr: pr});
        this.minorGridlines = pr;
    },
    setMinorTickMark: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetMiniTickMark, oldPr: this.minorTickMark, newPr: pr});
        this.minorTickMark = pr;
    },
    setNoMultiLvlLbl: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetNoMultiLvlLbl, oldPr: this.noMultiLvlLbl, newPr: pr});
        this.noMultiLvlLbl = pr;
    },

    setNumFmt: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetNumFmt, oldPr: this.numFmt, newPr: pr});
        this.numFmt = pr;
    },
    setScaling: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetScaling, oldPr: this.scaling, newPr: pr});
        this.scaling = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTickLblPos: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetTickLblPos, oldPr: this.tickLblPos, newPr: pr});
        this.tickLblPos = pr;
    },
    setTickLblSkip: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetTickLblSkip, oldPr: this.tickLblSkip, newPr: pr});
        this.tickLblSkip = pr;
    },
    setTickMarkSkip: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetTickMarkSkip, oldPr: this.tickMarkSkip, newPr: pr});
        this.tickMarkSkip = pr;
    },
    setTitle: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetTitle, oldPr: this.title, newPr: pr});
        this.title = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_CatAx_SetTxPr, oldPr: this.txPr, newPr: pr});
        this.txPr = pr;
    },

    Undo: function()
    {},

    Redo: function()
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};