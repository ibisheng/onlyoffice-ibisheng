function CBubbleChart()
{
    this.axId          = null;
    this.bubble3D      = null;
    this.bubbleScale   = null;
    this.dLbls         = null;
    this.series = [];
    this.showNegBubbles = null;
    this.sizeRepresents = null;
    this.varyColors     = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBubbleChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    getObjectType: function()
    {
        return historyitem_type_BubbleChart;
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
        History.Add(this, {Type:historyitem_BubbleChart_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },
    setBubble3D: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetBubble3D, oldPr: this.bubble3D, newPr: pr});
        this.bubble3D = pr;
    },
    setBubbleScale: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetBubbleScale, oldPr: this.bubbleScale, newPr: pr});
        this.bubbleScale = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    AddSer: function(ser)
    {
        History.Add(this, {Type:historyitem_BubbleChart_AddSerie, ser: ser});
        this.series.push(ser);
    },
    setShowNegBubbles: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetShowNegBubbles, oldPr: this.showNegBubbles, newPr: pr});
        this.showNegBubbles = pr;
    },
    setSizeRepresents: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetSizeRepresents, oldPr: this.sizeRepresents, newPr: pr});
        this.sizeRepresents = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type:historyitem_BubbleChart_SetVaryColors, oldPr: this.varyColors, newPr: pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {},

    Redo: function()
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};