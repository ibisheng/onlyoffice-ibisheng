var TYPE_AXIS_CAT = 0;
var TYPE_AXIS_DATE = 1;
var TYPE_AXIS_SER = 2;
var TYPE_AXIS_VAL = 3;

var AX_POS_L = 0;
var AX_POS_T = 1;
var AX_POS_R = 2;
var AX_POS_B = 3;

var CROSSES_AUTO_ZERO = 0;
var CROSSES_MAX = 1;
var CROSSES_MIN = 2;

var LBL_ALG_CTR = 0;
var LBL_ALG_L = 1;
var LBL_ALG_R = 2;

var TICK_MARK_CROSS = 0;
var TICK_MARK_IN = 1;
var TICK_MARK_NONE = 2;
var TICK_MARK_OUT = 3;

var TICK_LABEL_POSITION_HIGH    = 0;
var TICK_LABEL_POSITION_LOW     = 1;
var TICK_LABEL_POSITION_NEXT_TO = 2;
var TICK_LABEL_POSITION_NONE    = 3;

var TIME_UNIT_DAYS = 0;
var TIME_UNIT_MONTHS = 1;
var TIME_UNIT_YEARS = 2;

var CROSS_BETWEEN_BETWEEN = 0;
var CROSS_BETWEEN_MID_CAT = 1;


function CAxis()
{
    this.type           = null;
    this.auto           = null;
    this.axId           = null;
    this.axPos          = null;
    this.baseTimeUnit   = null;
    this.crossAx        = null;
    this.crossBetween   = null;
    this.crosses        = null;
    this.crossesAt      = null;
    this.delete         = null;
    this.dispUnits      = null;
    this.lblAlgn        = null;
    this.lblOffset      = null;
    this.majorGridlines = null;
    this.majorTickMark  = null;
    this.majorTimeUnit  = null;
    this.majorUnit      = null;
    this.minorGridlines = null;
    this.minorTickMark  = null;
    this.minorTimeUnit  = null;
    this.minorUnit      = null;
    this.noMultiLvlLbl  = null;
    this.numFmt         = null;
    this.scaling        = null;
    this.spPr           = null;
    this.tickLblPos     = null;
    this.tickLblSkip    = null;
    this.tickMarkSkip   = null;
    this.title          = null;
    this.txPr           = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CAxis.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Axis;
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

    setType: function(type)
    {
        History.Add(this, {Type: historyitem_Axis_SetType, oldPr: this.type, newPr: type});
        this.type = type;
    },

    setAuto: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetAuto, oldPr: this.auto, newPr: pr});
        this.auto = pr;
    },

    setAxId : function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },
    setAxPos: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetAxPos, oldPr: this.axPos, newPr: pr});
        this.axPos = pr;
    },
    setBaseTimeUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetBaseTimeUnit, oldPr: this.baseTimeUnit, newPr: pr});
        this.baseTimeUnit = pr;
    },
    setCrossAx: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetCrossAx, oldPr: this.crossAx, newPr: pr});
        this.crossAx = pr;
    },

    setCrossBetween: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetCrossBetween, oldPr: this.crossBetween, newPr: pr});
        this.crossBetween = pr;
    },

    setCrosses: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetCrosses, oldPr: this.crosses, newPr: pr});
        this.crosses = pr;
    },
    setCrossesAt: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetCrossesAt, oldPr: this.crossesAt, newPr: pr});
        this.crossesAt = pr;
    },
    setDelete: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetDelete, oldPr: this.bDelete, newPr: pr});
        this.bDelete = pr;
    },

    setDispUnits: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetDispUnits, oldPr: this.dispUnits, newPr: pr});
        this.dispUnits = pr;
    },


    setLblAlgn: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetLblAlgn, oldPr: this.lblAlgn, newPr: pr});
        this.lblAlgn = pr;
    },
    setLblOffset: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetLblOffset, oldPr: this.lblOffset, newPr: pr});
        this.lblOffset = pr;
    },
    setMajorGridlines: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMajorGridlines, oldPr: this.majorGridlines, newPr: pr});
        this.majorGridlines = pr;
    },
    setMajorTickMark: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMajorTickMark, oldPr: this.majorTickMark, newPr: pr});
        this.majorTickMark = pr;
    },

    setMajorTimeUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMajorTimeUnit, oldPr: this.majorTimeUnit, newPr: pr});
        this.majorTimeUnit = pr;
    },

    setMajorUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMajorUnit, oldPr: this.majorUnit, newPr: pr});
        this.majorTimeUnit = pr;
    },

    setMinorGridlines: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMiniGridlines, oldPr: this.minorGridlines, newPr: pr});
        this.minorGridlines = pr;
    },
    setMinorTickMark: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMiniTickMark, oldPr: this.minorTickMark, newPr: pr});
        this.minorTickMark = pr;
    },

    setMinorTimeUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMinorTimeUnit, oldPr: this.minorTimeUnit, newPr: pr});
        this.minorTimeUnit = pr;
    },

    setMinorUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetMinorUnit, oldPr: this.minorUnit, newPr: pr});
        this.minorUnit = pr;
    },

    setNoMultiLvlLbl: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetNoMultiLvlLbl, oldPr: this.noMultiLvlLbl, newPr: pr});
        this.noMultiLvlLbl = pr;
    },

    setNumFmt: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetNumFmt, oldPr: this.numFmt, newPr: pr});
        this.numFmt = pr;
    },
    setScaling: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetScaling, oldPr: this.scaling, newPr: pr});
        this.scaling = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTickLblPos: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetTickLblPos, oldPr: this.tickLblPos, newPr: pr});
        this.tickLblPos = pr;
    },
    setTickLblSkip: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetTickLblSkip, oldPr: this.tickLblSkip, newPr: pr});
        this.tickLblSkip = pr;
    },
    setTickMarkSkip: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetTickMarkSkip, oldPr: this.tickMarkSkip, newPr: pr});
        this.tickMarkSkip = pr;
    },
    setTitle: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetTitle, oldPr: this.title, newPr: pr});
        this.title = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Axis_SetTxPr, oldPr: this.txPr, newPr: pr});
        this.txPr = pr;
    },

    Undo: function(data)
    {
    },

    Redo: function()
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};

